// EVERY PULL-DOWN AND EVERY OPTION IS READABLE IN DARK, FROM ONE GLOBAL RULE, in a real Chromium. Run with:
//   node dev/lpn-spike/select-dark-sheet-browser-harness.js   (takes the browser lock itself)
//
// Tom, 2026-10-27: "The invisibility in Dark mode bug hit again for all selectors ... use global styles".
// The rule is `option, optgroup` near the end of css/engcalcs.css. This reads what the browser will paint:
//   S1  Looped-Network.php, Dark, Settings pane open: every <option> of every <select> in the page has an
//       opaque background and ink contrasting 4.5 : 1 against it;
//   S2  the same page: every visible <select> has ink contrasting 4.5 : 1 against the paper it draws on
//       (its own background, or the nearest opaque ancestor's);
//   S3  and S4  the same two checks on Hazen-Williams.php, a calculator page;
//   S5  no page errors.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SELDARK_LOCKED';
const NAME = 'select-dark-sheet-browser-harness';
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
// Runs in the page. Returns counts and the first few offenders.
function audit() {
	function rgba(s) { const m = s.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 }; }
	function lum(c) { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); }
	function cr(a, b) { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); }
	function paper(el) {
		for (let e = el; e; e = e.parentElement) {
			const c = rgba(getComputedStyle(e).backgroundColor);
			if (c.a >= 1) { return c; }
		}
		return rgba(getComputedStyle(document.documentElement).backgroundColor.replace('rgba(0, 0, 0, 0)', 'rgb(255,255,255)'));
	}
	const sels = Array.from(document.querySelectorAll('select')), badOpt = [], badSel = [];
	let nopt = 0, nvis = 0;
	sels.forEach((s) => {
		Array.from(s.options).forEach((o) => {
			nopt++;
			const cs = getComputedStyle(o), bg = rgba(cs.backgroundColor), ink = rgba(cs.color), c = cr(ink, bg);
			if (bg.a < 1 || c < 4.5) { badOpt.push((s.id || s.className) + ':' + o.textContent + ' bg=' + cs.backgroundColor + ' ink=' + cs.color + ' cr=' + c.toFixed(1)); }
		});
		if (s.offsetParent === null || !s.getClientRects().length) { return; }
		nvis++;
		const cs = getComputedStyle(s), ink = rgba(cs.color), own = rgba(cs.backgroundColor), bg = own.a >= 1 ? own : paper(s.parentElement), c = cr(ink, bg);
		if (c < 4.5) { badSel.push((s.id || s.className) + ' ink=' + cs.color + ' paper=' + bg.r + ',' + bg.g + ',' + bg.b + ' cr=' + c.toFixed(1)); }
	});
	return { nsel: sels.length, nvis: nvis, nopt: nopt, badOpt: badOpt.slice(0, 4), nBadOpt: badOpt.length, badSel: badSel.slice(0, 4), nBadSel: badSel.length };
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
		await page.evaluate(() => window.ecTheme.preview('dark'));
		await a.settle(300);
		let r = await page.evaluate(audit);
		ok('S1 Looped-Network Dark: every option opaque and readable (' + r.nopt + ' options in ' + r.nsel + ' pull-downs)', r.nsel > 5 && r.nBadOpt === 0, JSON.stringify(r.badOpt));
		ok('S2 Looped-Network Dark: every visible pull-down readable (' + r.nvis + ')', r.nvis > 0 && r.nBadSel === 0, JSON.stringify(r.badSel));
		await a.goto('Hazen-Williams.php?ec_nolog=1');
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(600);
		await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
		await a.settle(300);
		r = await page.evaluate(audit);
		ok('S3 Hazen-Williams Dark: every option opaque and readable (' + r.nopt + ' options in ' + r.nsel + ' pull-downs)', r.nsel > 0 && r.nBadOpt === 0, JSON.stringify(r.badOpt));
		ok('S4 Hazen-Williams Dark: every visible pull-down readable (' + r.nvis + ')', r.nvis > 0 && r.nBadSel === 0, JSON.stringify(r.badSel));
		ok('S5 no page errors', errors.length === 0, errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
