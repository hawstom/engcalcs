// THE GALLERY'S WELCOME LINE CLEARS THE MODE LINE (Tom, 2026-10-24), in a real Chromium. Run with:
//   node dev/lpn-spike/welcome-clear-of-mode-browser-harness.js   (takes the browser lock itself)
//
// On a fresh, empty project the examples gallery sits over the map and its first line, "Welcome to
// water supply network modelling", used to start under the Mode line in the top-left overlay row.
//   W1  at 1280, 900 and 700 px wide the welcome line starts below the bottom of the overlay row;
//   W2  the same after the window is narrowed with the gallery open (the Mode line wraps more);
//   W3  at 390 px, where the Mode line is hidden by design, the welcome line is still below the row.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_WELCOMEMODE_LOCKED';
const NAME = 'welcome-clear-of-mode-browser-harness';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	try {
		const a = await Session.open(browser, 'A', { serviceWorkers: 'block' });
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate(() => localStorage.clear());
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		const gap = () => page.evaluate(() => {
			const w = document.querySelector('.lpn-examples-welcome'), row = document.getElementById('lpn_map_overlay_tl');
			if (!w || !row) { return null; }
			return { welcomeTop: w.getBoundingClientRect().top, rowBottom: row.getBoundingClientRect().bottom };
		});
		for (const width of [1280, 900, 700]) {
			await page.setViewportSize({ width: width, height: 800 });
			await a.settle(1500);
			const g = await gap();
			ok('W1 at ' + width + ' px the welcome line starts below the overlay row', !!g && g.welcomeTop >= g.rowBottom, JSON.stringify(g));
		}
		await page.setViewportSize({ width: 1280, height: 800 });
		await a.settle(800);
		await page.setViewportSize({ width: 660, height: 800 });
		await a.settle(800);
		const g2 = await gap();
		ok('W2 narrowed with the gallery open, it still clears the row', !!g2 && g2.welcomeTop >= g2.rowBottom, JSON.stringify(g2));
		await page.setViewportSize({ width: 390, height: 800 });
		await a.settle(800);
		const g3 = await gap();
		ok('W3 at 390 px it clears the row', !!g3 && g3.welcomeTop >= g3.rowBottom, JSON.stringify(g3));
		ok('W4 no page errors', errors.length === 0, errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
