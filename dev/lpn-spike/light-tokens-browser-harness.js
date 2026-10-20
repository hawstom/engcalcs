// THE LIGHT THEME IS TODAY'S LIGHT THEME, TOKEN BY TOKEN (Task 811; dev/themes-plan.md), in a real Chromium.
// Run with:
//   node dev/lpn-spike/light-tokens-browser-harness.js
//
// The tokens became seeds plus color-mix() derivations, which is a rewrite of every value in the block. A
// rewrite of that kind is only safe if the light page cannot tell. So this resolves every --ec-* token the
// pinned master stylesheet declared, twice, in a real browser:
//   - BEFORE: the token block of css/engcalcs.css at BASE_SHA (the commit this branch was cut from; pinned,
//     never `master`, so the merge that carries this branch cannot break its own check), on a bare page;
//   - AFTER: the live stylesheet, on the looped-network page with Light chosen, on the same page under
//     System with a light device, and on a calculator page (no data-theme at all);
// and requires the same colour, channel for channel at 8 bits and alpha to 0.001, for every token except the
// deliberate "same, but better" changes named in CHANGED below. Those are required to have their NEW values,
// so a change cannot drift either. A colour written as color-mix() computes as `color(srgb ...)` rather than
// `rgb(...)`; both are read as numbers here, which is what the screen shows.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_LIGHT_TOKENS_LOCKED';
const NAME = 'light-tokens-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename].concat(process.argv.slice(2)), {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error(NAME + ': NOT RUN, browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}

// The commit feat/theme was cut from: the last stylesheet before the seeds.
const BASE_SHA = 'e8ba2bb6740b864c8c91467a299da6e67f05bb68';
// "The same, but better" #1 and #2 (dev/themes-plan.md): the only light tokens allowed to move, and where to.
const CHANGED = {
	'--ec-warn-ink': [154, 68, 0, 1],       // #9a4400, was #c60 (3.69:1 on the notice)
	'--ec-help-ink': [58, 119, 168, 1]      // #3a77a8, was steelblue (4.11:1 on white)
};
// New tokens: not in the old block, so nothing to compare; their light values are stated here.
const ADDED = {
	'--ec-chrome-bg': [238, 241, 245, 1],   // #eef1f5, "better" #1: the menu bar, toolbar and tab strip
	'--ec-control-border': [143, 143, 143, 1], // #8f8f8f, "better" #2: Bootstrap field edges at 3:1
	'--ec-map-paper': [255, 255, 255, 1],
	'--ec-map-ink': [0, 0, 0, 1]
};

let checks = 0, fails = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { fails++; }
	if (!cond || process.env.EC_VERBOSE) { console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail)); }
}

// In the page: every named token resolved to [r, g, b, a] (0-255, alpha 0-1), or its raw text when it is
// not a colour (a radius, a width, a shadow list).
function resolveAll(names) {
	const probe = document.createElement('i');
	probe.style.cssText = 'position:absolute;width:1px;height:1px;left:-9px;top:-9px';
	document.body.appendChild(probe);
	const parse = (s) => {
		let m = /^rgba?\(([^)]*)\)$/.exec(s);
		if (m) { const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
		m = /^color\(srgb ([^)]*)\)$/.exec(s);
		if (m) { const p = m[1].split(/[\s/]+/).filter(Boolean).map(parseFloat); return [p[0] * 255, p[1] * 255, p[2] * 255, p.length > 3 ? p[3] : 1]; }
		return null;
	};
	const out = {};
	const rootStyle = getComputedStyle(document.documentElement);
	names.forEach((n) => {
		const raw = rootStyle.getPropertyValue(n).trim();
		probe.style.backgroundColor = '';
		probe.style.backgroundColor = 'var(' + n + ')';
		const c = probe.style.backgroundColor ? parse(getComputedStyle(probe).backgroundColor) : null;
		out[n] = c ? { c: [Math.round(c[0]), Math.round(c[1]), Math.round(c[2]), Math.round(c[3] * 1000) / 1000] } : { raw };
	});
	probe.remove();
	return out;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));

	let oldCss;
	try { oldCss = execFileSync('git', ['-C', REPO, 'show', BASE_SHA + ':css/engcalcs.css'], { encoding: 'utf8', maxBuffer: 64 << 20 }); }
	catch (e) { console.error(NAME + ': cannot read css/engcalcs.css at ' + BASE_SHA + ' (' + e.message.split('\n')[0] + ')'); process.exit(1); }
	const a = oldCss.indexOf('/* ec-colour-tokens:begin */'), b = oldCss.indexOf('/* ec-colour-tokens:end */');
	const oldBlock = oldCss.slice(a, b);
	// The light set is the first :root rule; the dark ones are behind attributes the bare page never has.
	const lightRule = /:root\s*\{([\s\S]*?)\n\}/.exec(oldBlock)[1];
	const names = Array.from(new Set((lightRule.match(/--ec-[\w-]+(?=\s*:)/g) || [])));
	ok('the pinned light set declares its tokens (' + names.length + ')', names.length > 100, String(names.length));

	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		// BEFORE: the pinned block alone, on a bare page.
		const bare = await browser.newPage();
		await bare.setContent('<!doctype html><html><head><style>' + oldBlock + '</style></head><body></body></html>');
		const before = await bare.evaluate(resolveAll, names);
		await bare.close();
		ok('every pinned token resolves to a colour or a value on the bare page', names.every((n) => before[n].c || before[n].raw),
			names.filter((n) => !before[n].c && !before[n].raw).join(', '));

		const allNames = names.concat(Object.keys(ADDED));
		const compare = (label, after) => {
			let same = 0;
			names.forEach((n) => {
				const was = before[n], now = after[n];
				if (CHANGED[n]) {
					ok(label + ': ' + n + ' is the deliberate new value', !!now.c && JSON.stringify(now.c) === JSON.stringify(CHANGED[n]),
						JSON.stringify(now) + ' wanted ' + JSON.stringify(CHANGED[n]) + ' (was ' + JSON.stringify(was) + ')');
					return;
				}
				const eq = was.c ? (!!now.c && was.c.every((v, i) => (i < 3 ? v === now.c[i] : Math.abs(v - now.c[i]) < 0.0015))) : was.raw === now.raw;
				if (eq) { same++; }
				ok(label + ': ' + n + ' is unchanged', eq, 'was ' + JSON.stringify(was) + ', now ' + JSON.stringify(now));
			});
			Object.keys(ADDED).forEach((n) => ok(label + ': new token ' + n + ' has its stated light value',
				!!after[n].c && JSON.stringify(after[n].c) === JSON.stringify(ADDED[n]), JSON.stringify(after[n])));
			console.log('  ' + label + ': ' + same + ' of ' + (names.length - Object.keys(CHANGED).length) + ' tokens identical to ' + BASE_SHA.slice(0, 9) +
				', ' + Object.keys(CHANGED).length + ' changed on purpose, ' + Object.keys(ADDED).length + ' added');
		};

		const s = await Session.open(browser, 'light', { colorScheme: 'light' });
		try {
			await s.goto('Looped-Network.php');
			await s.settle(600);
			const sys = await s.page.evaluate(() => document.documentElement.getAttribute('data-theme'));
			ok('System under a light device resolves to light', sys === 'light', String(sys));
			compare('System, light device', await s.page.evaluate(resolveAll, allNames));
			await s.page.evaluate(() => window.ecTheme.set('light'));
			await s.settle(200);
			compare('Light chosen', await s.page.evaluate(resolveAll, allNames));
			// The chrome surface is the one place "better" #1 shows: the menu bar, toolbar and tab strip.
			const chrome = await s.page.evaluate(() => ['lpn_menubar', 'lpn_toolbar', 'lpn_tabs'].map((id) => getComputedStyle(document.getElementById(id)).backgroundColor));
			ok('the menu bar, toolbar and tab strip sit on the chrome surface', chrome.every((c) => /238, 241, 245|0\.933333 0\.945098 0\.960784/.test(c)), JSON.stringify(chrome));
			await s.page.evaluate(() => window.ecTheme.set('system'));
			await s.goto('Manning-Pipe-Flow.php');
			const attr = await s.page.evaluate(() => document.documentElement.getAttribute('data-theme'));
			ok('a calculator page carries no data-theme', attr === null, String(attr));
			compare('calculator page', await s.page.evaluate(resolveAll, allNames));
			ok('no page errors', !s.errors.length, (s.errors[0] || '').slice(0, 200));
		} finally { await s.close(); }
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? `\n${fails} FAILED of ${checks}` : `\nall ${checks} ok`);
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
