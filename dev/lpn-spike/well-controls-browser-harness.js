// THE WELL'S BOX ASKS "Pump on below" AND "Pump off above" in a real Chrome. Run with:
//   EC_PICS=<pictureDir> node dev/lpn-spike/well-controls-browser-harness.js
//
// Task 822 (Tom, 2026-11-09). Opens assembly-sections-fixture.lwn, types 1 and 2.5 into the two fields and asserts they stand in the box's entry
// area above the section headings, take a depth in the box's length unit, and leave a blank one blank. A picture is saved when a directory is given.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_WELL_CONTROLS_BROWSER_LOCKED';
const NAME = 'well-controls-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure of what this measures; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

let checks = 0, failures = 0, Session;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const PICS = process.env.EC_PICS || null;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const fixture = require('fs').readFileSync(path.join(REPO, 'dev', 'lpn-spike', 'assembly-sections-fixture.lwn'), 'utf8');
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 1000 }, serviceWorkers: 'block' });
		const P = a.page;
		await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await P.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_hovercard', 'off'); }, fixture);
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(2500);
		const centreOf = (id) => P.evaluate((i) => {
			const el = Array.from(document.querySelectorAll('#lpn_canvas [data-node="' + i + '"], #lpn_canvas [data-link="' + i + '"]')).filter((e) => e.getBoundingClientRect().width > 0)[0];
			if (!el) { return null; }
			const r = el.getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		}, id);
		const clickAt = async (id) => { const c = await centreOf(id); await P.mouse.click(c.x, c.y); await a.settle(900); return c; };
		const heads = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-asm-head')).map((h) => {
			const r = h.getBoundingClientRect(), f = document.getElementById('lpn_popup_fields').getBoundingClientRect(), c = getComputedStyle(h);
			return { t: h.textContent, w: r.width, left: r.left, right: r.right, fl: f.left, fr: f.right, ws: c.whiteSpace, ov: c.overflow, to: c.textOverflow, fw: c.fontWeight, top: r.top };
		}));

		console.log('\n--- the Well ---');
		await P.keyboard.press('Escape');
		await clickAt('W2P');
		const labs = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields > label')).map((l) => l.textContent.replace(/\s+/g, ' ').trim()));
		let ls = await labs();
		const iOn = ls.findIndex((x) => /^Pump on below \(/.test(x)), iOff = ls.findIndex((x) => /^Pump off above \(/.test(x));
		ok('the entry area has Pump on below and Pump off above, in the length unit, in that order, after the pump curve', iOn > 0 && iOff === iOn + 1 && /Pump head curve/.test(ls[iOn - 1] || ''), ls.join(' | '));
		const inputOf = (re) => P.evaluateHandle((src) => Array.from(document.querySelectorAll('#lpn_popup_fields > label')).find((l) => new RegExp(src).test(l.textContent)).querySelector('input'), re.source);
		const typeIn = async (re, v) => { const h = await inputOf(re); await h.click({ clickCount: 3 }); if (v === '') { await P.keyboard.press('Backspace'); } else { await P.keyboard.type(v); } await P.keyboard.press('Tab'); await a.settle(500); };
		const val = (re) => P.evaluate((src) => Array.from(document.querySelectorAll('#lpn_popup_fields > label')).find((l) => new RegExp(src).test(l.textContent)).querySelector('input').value, re.source);
		ok('both open blank', (await val(/^Pump on below/)) === '' && (await val(/^Pump off above/)) === '');
		await typeIn(/^Pump on below/, '1');
		await typeIn(/^Pump off above/, '2.5');
		ok('they keep what was typed', (await val(/^Pump on below/)) === '1' && (await val(/^Pump off above/)) === '2.5');
		const nHeads = await P.evaluate(() => document.querySelectorAll("#lpn_popup_fields .lpn-asm-head").length);
		ok('the box still has its five section headings', nHeads === 5, String(nHeads));
		await P.keyboard.press('Escape');
		await clickAt('W2P');
		ok('and they are still there when the box is opened again', (await val(/^Pump on below/)) === '1' && (await val(/^Pump off above/)) === '2.5');
		if (PICS) { await P.screenshot({ path: path.join(PICS, 'well-pump-controls-v10.png') }); }
		// Tom, 2026-11-11: "When I first opened Controls, nothing appeared; when I switched to a different Library then back, two appeared."
		// The Libraries box stands open on Controls while the Well writes its controls; the section must show them at once.
		console.log('\n--- the Controls library, open before the Well writes its controls ---');
		await P.keyboard.press('Escape');
		await clickAt('W2P');
		await typeIn(/^Pump on below/, '');
		await typeIn(/^Pump off above/, '');
		await a.menuClick(await a.lang('lpn_library_menu'), 'project');
		await a.settle(700);
		await P.click('#lpn_libbox_link_controls');
		await a.settle(500);
		const owned = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_libbox_content .lpn-lib-owned')).map((e) => e.textContent.replace(/\s+/g, ' ').trim()));
		ok('with the Controls library open and no depth typed, it holds no control of the Well', (await owned()).length === 0);
		await clickAt('W2P');
		await typeIn(/^Pump on below/, '1');
		await typeIn(/^Pump off above/, '2.5');
		const two = await owned();
		ok('typing the two depths puts the Well\'s two controls into the open Controls library at once, without a section switch', two.length === 2 && /OPEN IF NODE T1 BELOW 1/i.test(two[0]) && /CLOSED IF NODE T1 ABOVE 2.5/i.test(two[1]) && /Written by well W2/.test(two[0]), two.join(' || '));
		await typeIn(/^Pump on below/, '');
		ok('clearing one depth takes its control out of the open library at once', (await owned()).length === 1);
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exit(1); });
