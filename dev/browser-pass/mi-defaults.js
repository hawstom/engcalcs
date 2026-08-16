// Manning-Irregular's first visit, in both unit presets (ROADMAP Task 233).
//
//   node dev/browser-pass/mi-defaults.js
//
// WHY THIS IS A BROWSER CHECK AND NOT A calc-spike ONE. Manning-Irregular is a ROW-TABLE
// calculator: it writes nothing at all until `pageCalculatorInitialize` has seeded a cookie and
// `cookieToForm` has built the station rows out of it. `dev/calc-spike/calc-page.js` deliberately
// has no DOM rich enough to insert table rows, so its smoke harness runs this page and then says
// so rather than asserting -- which is exactly why Task 233's ⚠ survived it. The defect lives in
// the seed cookie, and the seed cookie only runs in a browser.
//
// WHAT IT ASSERTS, per preset:
//   * the unit selects still hold what the SERVER rendered. The seed is positional over the
//     form's INPUTs and SELECTs, and every `s:<factor>` slot in it overwrites one select by its
//     conversion factor. Task 233 was one hard-coded `s:1` per select, and 1 is always the SI
//     option -- so an English page opened in metric because of its own seed.
//   * the page opens on a PASSING design. CLAUDE.md: a page that greets a first-time visitor
//     with a warning is worse than one that greets them with a worked example.
//
// A fresh browser context per preset is load-bearing: the page-input cookie outlives the seed,
// and a second visit never runs pageCalculatorInitialize at all.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

// IT STARTS ITS OWN SERVER, ON A PORT IT PROVED WAS FREE, ROOTED AT THIS CHECKOUT. Sharing
// lib/env.js's would have been shorter and would have tested the wrong tree twice over: its port
// is a constant, so a server another session left running answers instead and `php -S` fails to
// bind in silence; and its docroot is derived as REPO/.., which is the repository's PARENT and
// therefore has no `engcalcs/` at all when the checkout is a git worktree. Both faults are
// invisible -- the page loads, the assertions run, and they describe somebody else's files.
const fs = require('fs');
const os = require('os');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');
const { findChromium } = require('./lib/env');

const REPO = path.resolve(__dirname, '..', '..');

/** A port nothing is listening on, asked of the OS rather than guessed. */
function freePort() {
	return new Promise((resolve, reject) => {
		const srv = net.createServer();
		srv.on('error', reject);
		srv.listen(0, '127.0.0.1', () => {
			const p = srv.address().port;
			srv.close(() => resolve(p));
		});
	});
}

// The pages ask for /engcalcs/js/... absolutely, so the docroot must have an `engcalcs` in it.
// A symlink into this checkout gives that without copying the tree or assuming where it sits.
function makeDocroot() {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mi-defaults-'));
	fs.symlinkSync(REPO, path.join(dir, 'engcalcs'), 'dir');
	return dir;
}

async function startServer(port, docroot) {
	const proc = spawn('php', ['-d', 'pcre.jit=0', '-d', 'display_errors=0',
		'-S', `127.0.0.1:${port}`, '-t', docroot], { cwd: docroot, stdio: ['ignore', 'ignore', 'pipe'] });
	const errors = [];
	proc.stderr.on('data', (d) => errors.push(String(d)));
	const deadline = Date.now() + 15000;
	while (Date.now() < deadline) {
		try {
			const res = await fetch(`http://127.0.0.1:${port}/engcalcs/Manning-Irregular.php`, { method: 'HEAD' });
			if (res.status === 200) { return proc; }
		} catch (err) { /* not up yet */ }
		await new Promise(r => setTimeout(r, 150));
	}
	proc.kill();
	throw new Error(`PHP server did not come up on port ${port}\n${errors.join('')}`);
}

async function launchBrowser(playwright) {
	const executablePath = findChromium();
	if (!executablePath) {
		throw new Error('No Chromium found. Set CHROME_PATH, or run: npx playwright install chromium');
	}
	return playwright.chromium.launch({ executablePath });
}

// The unit each select must be showing on arrival, per preset. Read from the page's own
// data-family + EngCalcs.unitSets at runtime rather than typed here, so this cannot drift from
// lib/Units.lib.php -- see the assertion loop below.
const SELECT_NAMES = [
	'wsu', 's0u', 'q_617u',
	'stationu', 'elevationu', 'tauu', 'tu', 'pwu', 'au', 'rhu', 'v617u', 'hv617u', 'q617u'
];

let checks = 0, failures = 0;
function ok(cond, label, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log(`${cond ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

async function probe(browser, origin, lang) {
	const context = await browser.newContext();
	await context.addCookies([{ name: 'ec_language', value: lang, url: origin }]);
	const page = await context.newPage();
	const errors = [];
	page.on('pageerror', (e) => errors.push(String(e)));
	await page.goto(`${origin}/engcalcs/Manning-Irregular.php?ec_nolog=1`, { waitUntil: 'load' });
	// The page calculates on DOMContentLoaded; give the seed + first pageCalculator a tick.
	await page.waitForFunction(() => document.getElementById('q_617').innerHTML !== '', null, { timeout: 5000 });
	const state = await page.evaluate((names) => {
		const out = { selects: {}, families: {}, presetMap: EngCalcs.unitSets, rows: EngCalcs.numCalcRows };
		for (const n of names) {
			const el = document.getElementsByName(n)[0];
			if (!el) { continue; }
			out.selects[n] = el.options[el.selectedIndex] ? el.options[el.selectedIndex].getAttribute('data-unit') : null;
			out.families[n] = el.getAttribute('data-family');
		}
		out.q = document.getElementById('q_617').innerHTML;
		out.vcheck = document.getElementById('v_check').innerHTML;
		out.ws = document.getElementById('ws').value;
		out.s0 = document.getElementById('s0').value;
		out.stations = Array.from(document.getElementsByName('station')).map(e => e.value);
		out.elevations = Array.from(document.getElementsByName('elevation')).map(e => e.value);
		out.ns = Array.from(document.getElementsByName('n')).map(e => e.value);
		return out;
	}, SELECT_NAMES);
	await context.close();
	return { state, errors };
}

(async function main() {
	let playwright;
	try { playwright = require('playwright-core'); }
	catch (err) {
		console.error('playwright-core is not installed. From dev/browser-pass:  npm install');
		process.exit(2);
	}
	const port = await freePort();
	const docroot = makeDocroot();
	const origin = `http://127.0.0.1:${port}`;
	const server = await startServer(port, docroot);
	const browser = await launchBrowser(playwright);
	console.log(`=== Manning-Irregular, first visit, both presets (${REPO}) ===`);
	try {
		for (const [preset, lang] of [['us', 'en'], ['si', 'es']]) {
			console.log(`\n--- ${preset} (lang=${lang}) ---`);
			const { state, errors } = await probe(browser, origin, lang);
			ok(errors.length === 0, `${preset}: no uncaught JavaScript on first load`, errors.join(' | '));

			const wanted = state.presetMap[preset];
			const wrong = [];
			for (const n of SELECT_NAMES) {
				const fam = state.families[n];
				if (!fam || !wanted[fam]) { continue; }
				if (state.selects[n] !== wanted[fam]) {
					wrong.push(`${n}: showing ${state.selects[n]}, preset wants ${wanted[fam]}`);
				}
			}
			ok(wrong.length === 0, `${preset}: every unit select opens on the ${preset} preset`, wrong.join('; '));

			ok(state.rows >= 3, `${preset}: the seed built its station rows`, `${state.rows} rows`);
			const q = parseFloat(state.q);
			ok(isFinite(q) && q > 0, `${preset}: it opens on a real answer`,
				`Q = ${state.q}, ws = ${state.ws}, s0 = ${state.s0}, stations = ${state.stations.join('/')}`);
			ok(!/⚠/.test(state.vcheck), `${preset}: the defaults open on a passing design (no ⚠)`,
				state.vcheck.replace(/<[^>]*>/g, '').trim());
		}
	} catch (err) {
		failures++;
		console.log(`\n FAIL  threw\n${err && err.stack ? err.stack : err}`);
	} finally {
		await browser.close();
		server.kill();
		fs.rmSync(docroot, { recursive: true, force: true });
	}
	console.log(`\n${checks - failures}/${checks} checks passed.\n`);
	process.exit(failures ? 1 : 0);
}());
