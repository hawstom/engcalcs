// NO VISIBLE CHANGE when inline chrome colours moved onto the --ec-* tokens. Run with:
//   node dev/lpn-spike/inline-colour-harness.js            check against the golden
//   node dev/lpn-spike/inline-colour-harness.js --capture  write the golden (run it on the PINNED tree)
//
// Task 714, phase 1b (dev/theming-plan.md). Two halves:
//   1. PAIRS: every literal that was replaced, beside the var() that replaced it, painted on a probe
//      element; the computed colours must be identical. This covers the sites a headless run cannot
//      reach (the lock banner needs a second holder, a separator needs a menu with one).
//   2. GOLDEN: the computed colours of the real elements the conversion touched (the label bench and
//      tile bench boxes, an open menu's separators), compared with inline-colour-golden.json, which
//      was captured on the pinned SHA below. A SHA is pinned, never `master`: a before-run that reads
//      master breaks the merge that fixes it.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const GOLDEN = path.join(__dirname, 'inline-colour-golden.json');
const PINNED_SHA = '1920777d';
const CAPTURE = process.argv.includes('--capture');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_INLINE_COLOUR_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename].concat(process.argv.slice(2)), {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error('inline-colour-harness: NOT RUN, browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}

// [css property, the literal that was written, what is written now]
const PAIRS = [
	['background-color', '#fff', 'var(--ec-bg)'],
	['border-top-color', '#333', 'var(--ec-ink)'],
	['box-shadow', '2px 2px 6px rgba(0,0,0,.3)', '2px 2px 6px var(--ec-a-0-0-0-3)'],
	['border-top-color', '#ccc', 'var(--ec-border-strong)'],
	['border-top-color', '#a00', 'var(--ec-error-ink)'],
	['border-top-color', '#a80', 'var(--ec-warn-border)'],
	['background-color', '#fff0f0', 'var(--ec-error-bg-soft)'],
	['background-color', '#fffbe6', 'var(--ec-warn-bg)'],
	['color', '#888', 'var(--ec-gray-888)']
];
// [selector, property] on the real page with ?debug=labels,tiles and a menu open.
const ROWS = [
	['#lpn_label_bench', 'background-color'], ['#lpn_label_bench', 'border-top-color'],
	['#lpn_label_bench', 'border-left-color'], ['#lpn_label_bench', 'box-shadow'],
	['#lpn_label_bench_out', 'border-top-color'], ['#lpn_label_bench div:nth-of-type(1)', 'border-top-color'],
	['#lpn_tile_bench', 'background-color'], ['#lpn_tile_bench', 'border-top-color'], ['#lpn_tile_bench', 'box-shadow'],
	['#lpn_menu_popup hr', 'border-top-color']
];

let fails = 0, checks = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (!cond && detail ? '   ' + detail : ''));
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('inline-colour-harness: no Chromium; SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'A');
		await a.goto('Looped-Network.php?debug=labels,tiles');
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.page.click('#lpn_menu_file');
		await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		await a.settle(600);
		const res = await a.page.evaluate(({ pairs, rows }) => {
			const probe = document.createElement('i');
			document.body.appendChild(probe);
			const paint = (prop, v) => { probe.style.cssText = 'border:1px solid;box-shadow:none'; probe.style.setProperty(prop, v); return getComputedStyle(probe).getPropertyValue(prop); };
			const pairOut = pairs.map(([prop, lit, now]) => [paint(prop, lit), paint(prop, now)]);
			const rowOut = rows.map(([sel, prop]) => { const el = document.querySelector(sel); return el ? getComputedStyle(el).getPropertyValue(prop) : null; });
			return { pairOut, rowOut };
		}, { pairs: PAIRS, rows: ROWS });

		if (CAPTURE) {
			fs.writeFileSync(GOLDEN, JSON.stringify({ pinned: PINNED_SHA, rows: ROWS.map((r, i) => ({ sel: r[0], prop: r[1], value: res.rowOut[i] })) }, null, '\t') + '\n');
			console.log('captured ' + ROWS.length + ' rows to ' + GOLDEN);
			return;
		}
		PAIRS.forEach(([prop, lit, now], i) => {
			ok(prop + ': ' + lit + ' == ' + now, res.pairOut[i][0] !== '' && res.pairOut[i][0] === res.pairOut[i][1], res.pairOut[i].join(' vs '));
		});
		const g = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
		ok('golden was captured on the pinned SHA ' + PINNED_SHA, g.pinned === PINNED_SHA);
		ROWS.forEach(([sel, prop], i) => {
			const want = g.rows[i];
			ok(sel + ' ' + prop + ' unchanged', want && want.sel === sel && want.prop === prop && res.rowOut[i] === want.value, 'got ' + res.rowOut[i] + ', pinned ' + (want && want.value));
		});
		ok('the benches and a separator were reachable (not all null)', res.rowOut.filter((v) => v !== null).length === ROWS.length, JSON.stringify(res.rowOut));
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? `\n${fails} FAILED of ${checks}` : `\nall ${checks} ok`);
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
