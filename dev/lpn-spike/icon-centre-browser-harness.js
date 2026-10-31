// AN ICON ALONE IN ITS BUTTON IS CENTRED ON THE BUTTON, in a real Chromium. Run with:
//   node dev/lpn-spike/icon-centre-browser-harness.js   (takes the browser lock itself)
//
// Tom, 2026-10-30: "On a phone, the menu icons are not centered on their buttons." The cause was the gap
// an icon keeps for a word beside it (`button > .ec-icon { margin-inline-end: .4em }`) staying behind
// when the word was hidden (the phone menu bar) or absent (toolbar buttons), plus the hidden word's
// text-line strut pushing the icon up. Every visible button on Looped-Network.php whose visible text is
// empty and that holds an icon must have the icon's centre within 1 px of the button's centre, on both
// axes, at 390 x 844 with touch and at 1400 x 900 with a mouse.
//   C1  phone: the six menu-bar buttons are icon-only and centred;  C2  phone: every icon-only button centred;
//   C3  desktop: every icon-only button centred (and there are several);  C4  no page errors.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_ICONCTR_LOCKED';
const NAME = 'icon-centre-browser-harness';
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
function measure() {
	const out = [];
	document.querySelectorAll('button').forEach((b) => {
		const ic = b.querySelector('svg');
		if (!ic) { return; }
		const br = b.getBoundingClientRect(), ir = ic.getBoundingClientRect();
		if (br.width <= 0 || ir.width <= 0 || b.innerText.trim() !== '') { return; }
		out.push({ id: b.id || String(b.className).slice(0, 30), dx: +((ir.left + ir.width / 2) - (br.left + br.width / 2)).toFixed(2), dy: +((ir.top + ir.height / 2) - (br.top + br.height / 2)).toFixed(2) });
	});
	return out;
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
		for (const phone of [true, false]) {
			const a = await Session.open(browser, 'A', { serviceWorkers: 'block', viewport: phone ? { width: 390, height: 844 } : { width: 1400, height: 900 },
				hasTouch: phone, isMobile: phone, deviceScaleFactor: 2 });
			const page = a.page;
			page.on('pageerror', (e) => errors.push(String(e && e.message)));
			await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
			await a.goto('Looped-Network.php?ec_nolog=1');
			await page.evaluate(() => localStorage.clear());
			await a.reload();
			await a.answerTrainingPanel().catch(() => {});
			await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await a.settle(1500);
			const r = await page.evaluate(measure), bad = r.filter((x) => Math.abs(x.dx) > 1 || Math.abs(x.dy) > 1);
			if (phone) {
				const menus = r.filter((x) => /^lpn_menu_/.test(x.id));
				ok('C1 phone: the six menu-bar buttons are icon-only', menus.length === 6, menus.map((x) => x.id).join(','));
				ok('C2 phone: every icon-only button (' + r.length + ') has its icon within 1 px of centre', r.length >= 6 && bad.length === 0, JSON.stringify(bad));
			} else {
				ok('C3 desktop: every icon-only button (' + r.length + ') has its icon within 1 px of centre', r.length >= 4 && bad.length === 0, JSON.stringify(bad));
			}
			await a.context.close();
		}
		ok('C4 no page errors', errors.length === 0, errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
