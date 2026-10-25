// PRAIRIE'S PROJECT TABS ARE PAINTED, NOT OUTLINED (Tom, 2026-10-24), in a real Chromium. Run with:
//   node dev/lpn-spike/prairie-tabs-browser-harness.js   (takes the browser lock itself)
//
// Tom: the active project tab had a little pale strip at its edge, and the upright black lines
// between a tab's name and its close mark looked unfinished.
//   T1  in Prairie, no tab (current or not) paints a side line or strip: its box-shadow has no
//       sideways offset;
//   T2  the name/close seam is not a full-height border any more (border-left is 0 on the caret and
//       the close mark) and is a short ::before instead; in Light the plain border is untouched;
//   T3  the current tab is the barn red with the roof sheen, and its close mark is still readable
//       (ink against the paint at least 4.5 : 1);
//   T4  no page errors.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PRAIRIETABS_LOCKED';
const NAME = 'prairie-tabs-browser-harness';
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
		await page.evaluate(() => { localStorage.clear(); localStorage.setItem('lpn_theme', 'prairie'); });
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await page.setViewportSize({ width: 1100, height: 600 });
		await a.settle(1000);
		await a.newProject('us');
		await a.settle(600);
		const read = () => page.evaluate(() => {
			const tabs = Array.from(document.querySelectorAll('.lpn-tab'));
			function lum(c) { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); }
			function rgb(s) { return (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number); }
			const cur = document.querySelector('.lpn-tab-current'), x = cur && cur.querySelector('.lpn-tab-x');
			return {
				n: tabs.length,
				sideways: tabs.map((t) => getComputedStyle(t).boxShadow).filter((sh) => sh !== 'none' && sh.replace(/rgba?\([^)]*\)/g, '').split(',').some((one) => parseFloat(one.trim()) !== 0)),
				xBorder: x ? getComputedStyle(x).borderLeftWidth : null,
				xSeam: x ? getComputedStyle(x, '::before').content : null,
				curBg: cur ? getComputedStyle(cur).backgroundImage : '',
				xInk: x ? getComputedStyle(x).color : '',
				curBgColor: cur ? getComputedStyle(cur).backgroundColor : '',
				cr: (function () { if (!x || !cur) { return 0; } const a1 = lum(rgb(getComputedStyle(x).color)), a2 = lum(rgb(getComputedStyle(cur).backgroundColor)); return (Math.max(a1, a2) + 0.05) / (Math.min(a1, a2) + 0.05); }())
			};
		});
		const p = await read();
		ok('T0 there are at least two project tabs', p.n >= 2, String(p.n));
		ok('T1 no tab paints a sideways line or strip', p.sideways.length === 0, JSON.stringify(p.sideways));
		ok('T2 the close mark has no full-height border and carries a short seam instead', p.xBorder === '0px' && p.xSeam !== 'none' && p.xSeam !== 'normal', p.xBorder + ' / ' + p.xSeam);
		ok('T3 the current tab has the roof sheen and its close mark reads (>= 4.5:1)', /linear-gradient/.test(p.curBg) && p.cr >= 4.5, p.cr.toFixed(1) + ' ' + p.curBgColor + ' ' + p.xInk);
		await page.evaluate(() => window.ecTheme.set('light'));
		await a.settle(300);
		const l = await page.evaluate(() => { const x = document.querySelector('.lpn-tab-current .lpn-tab-x'); return x ? getComputedStyle(x).borderLeftWidth : null; });
		ok('T2b in Light the close mark keeps its plain border', l === '1px', String(l));
		ok('T4 no page errors', errors.length === 0, errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
