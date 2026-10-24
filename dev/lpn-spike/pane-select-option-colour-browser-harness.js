// THE CHOICES OF A BOTTOM-PANE PULL-DOWN ARE READABLE IN EVERY THEME, in a real Chromium. Run with:
//   node dev/lpn-spike/pane-select-option-colour-browser-harness.js   (takes the browser lock itself)
//
// Tom, 2026-10-24: in Dark, the unselected options of a Settings table Value selector looked empty.
// The select is transparent and its options inherited that, so the browser's popup paper (white)
// sat under light ink. A native popup cannot be photographed, so this reads what the browser will
// paint it with: each option's computed background must be opaque, and its ink must contrast with it
// by at least 4.5 : 1.
//   O1  for every theme the page offers, the first Settings pull-downs' options (all of them in the
//       longest one) have an opaque background and ink contrasting 4.5 : 1 against it;
//   O2  no page errors.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PANESELOPT_LOCKED';
const NAME = 'pane-select-option-colour-browser-harness';
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
		await page.setViewportSize({ width: 1400, height: 900 });
		await a.settle(1200);
		await a.newProject('us');
		await page.click('#lpn_pane_btn');
		await a.settle(500);
		await page.click('#lpn_pane_tab_settings');
		await a.settle(700);
		const themes = await page.evaluate(() => window.ecTheme.list.slice());
		ok('O0 the page offers several themes', themes.length >= 5, themes.join(','));
		for (const th of themes) {
			await page.evaluate((t) => window.ecTheme.preview(t), th);
			await a.settle(250);
			const r = await page.evaluate(() => {
				function rgba(s) { const m = s.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 }; }
				function lum(c) { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); }
				const sels = Array.from(document.querySelectorAll('#lpn_pane_settings select'));
				const biggest = sels.slice().sort((x, y) => y.options.length - x.options.length)[0];
				const pick = sels.slice(0, 6).concat(biggest ? [biggest] : []);
				const bad = [];
				pick.forEach((s) => Array.from(s.options).forEach((o) => {
					const cs = getComputedStyle(o), bg = rgba(cs.backgroundColor), ink = rgba(cs.color);
					const l1 = lum(ink), l2 = lum(bg), cr = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
					if (bg.a < 1 || cr < 4.5) { bad.push(o.textContent + ' bg=' + cs.backgroundColor + ' ink=' + cs.color + ' cr=' + cr.toFixed(1)); }
				}));
				return { n: pick.length, bad: bad.slice(0, 3), nbad: bad.length };
			});
			ok('O1 theme ' + th + ': every option is opaque and readable (' + r.n + ' pull-downs)', r.n > 0 && r.nbad === 0, JSON.stringify(r.bad));
		}
		ok('O2 no page errors', errors.length === 0, errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
