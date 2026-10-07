// THE ALTERNATIVES BOX: ITS GRIP STOPS ONLY AT THE MAP'S 320 PX, AND ITS SIZE AND DOCK SURVIVE A
// RELOAD ON ONE KEY. Run with:  node dev/lpn-spike/alt-box-memory-browser-harness.js
//
// Tom, 2026-10-07: *"The Alternatives box gets wider, but it's still limited to about 80% of the
// screen width."* and card E02: *"Add the key, no first-dock limit"*. In a real Chromium, 1920x1000:
//   1. Docked right the first time, it keeps the width it floated at (no 45% of the window).
//   2. Its grip dragged to the window's left edge: the map stops at 320 px, the box is wider than
//      80% of the window.
//   3. Settings docked on the LEFT keeps its width and the box gives way; then the same drag still
//      takes the box until the map is 320 px wide (two columns no longer split the room in half),
//      and Settings gives way to its floor.
//   4. Settings closed, the box sized by its grip, the page reloaded, the box reopened: docked
//      right at the same width, read from `lpn_altbox`, and nothing about it in the project.
//   5. Floated and resized by its corner, reloaded, reopened: floating, the same size.
//
// DO NOT PREFIX THIS WITH `flock`: it takes /tmp/engcalcs-browser.lock itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock', LOCK_ENV = 'EC_ABM_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error('alt-box-memory-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
const W = 1920, H = 1000;

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
		const a = await Session.open(browser, 'A');
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await page.setViewportSize({ width: W, height: H });
		await a.goto('Looped-Network.php');
		await page.evaluate(() => { try { localStorage.setItem('lpn_scnbasic', 'off'); } catch (e) {} });
		await a.reload();
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		const noConsent = () => page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await noConsent();
		const openAlt = async () => {
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			await a._clickRow('#lpn_menu_list', await a.lang('lpn_alt_title'));
			await a.settle(600);
		};
		const geom = () => page.evaluate(() => {
			const box = document.getElementById('lpn_alt_box'), b = box.getBoundingClientRect(),
				s = document.getElementById('lpn_canvas').getBoundingClientRect(),
				g = document.getElementById('lpn_dock_grip_right'), gr = g && g.classList.contains('lpn-dock-grip-live') ? g.getBoundingClientRect() : null,
				set = document.getElementById('lpn_settings_box');
			return { w: Math.round(b.width), h: Math.round(b.height), docked: box.classList.contains('lpn-docked'), map: Math.round(s.width),
				gx: gr && gr.left + gr.width / 2, gy: gr && gr.top + gr.height / 2,
				setW: set && set.classList.contains('lpn-docked') ? Math.round(set.getBoundingClientRect().width) : null };
		});
		const dragGrip = async (g, toX) => {
			await page.mouse.move(g.gx, g.gy, { steps: 2 });
			await page.mouse.down();
			await page.mouse.move(toX, g.gy, { steps: 10 });
			await page.mouse.up();
			await a.settle(500);
			return geom();
		};

		console.log('--- 1. the first dock ---');
		await openAlt();
		const floated = await geom();
		ok('1.0 it opens floating at about 1500 px', !floated.docked && Math.abs(floated.w - 1500) <= 4, JSON.stringify(floated));
		ok('1.1 opening it writes nothing to the browser', await page.evaluate(() => localStorage.getItem('lpn_altbox') === null));
		await page.click('#lpn_alt_box .lpn-corner-btn[data-dock="right"]');
		await a.settle(600);
		let g = await geom();
		ok('1.2 docked right, it keeps the width it floated at (no 45% first-dock cap of 864 px)', g.docked && Math.abs(g.w - floated.w) <= 2, JSON.stringify(g));

		console.log('\n--- 2. the grip, one column ---');
		g = await dragGrip(g, 3);
		ok('2.1 dragged to the left edge, the map keeps 320 px', g.map >= 319 && g.map <= 330, JSON.stringify(g));
		ok('2.2 ...and the box is wider than 80% of the window', g.w > 0.8 * W, `${g.w} > ${0.8 * W}`);

		console.log('\n--- 3. the grip, with Settings docked on the left ---');
		await a.toolbarClick(await a.lang('lpn_tool_settings'));
		await a.settle(600);
		await page.click('#lpn_settings_box .lpn-corner-btn[data-dock="left"]');
		await a.settle(600);
		g = await geom();
		ok('3.0 Settings docked on the left keeps a usable width, and the box gives way to it', g.setW !== null && g.setW > 240 && g.map >= 319, JSON.stringify(g));
		g = await dragGrip(g, 3);
		ok('3.1 the same drag still takes the map to 320 px', g.map >= 319 && g.map <= 330, JSON.stringify(g));
		ok('3.2 ...the box is wider than half the room (no even split); Settings gave way to its 240 px floor', g.w > (W - 320) / 2 + 100 && g.setW === 240, JSON.stringify(g));
		await page.click('#lpn_settings_box .lpn-corner-btn[data-dock="float"]');
		await a.settle(300);
		await page.evaluate(() => { const x = document.querySelector('#lpn_settings_box .lpn-popover-x'); if (x) { x.click(); } });
		await a.settle(500);

		console.log('\n--- 4. docked, reloaded ---');
		g = await geom();
		g = await dragGrip(g, W - 1100);
		const before = await geom();
		ok('4.0 the grip sets the box to about 1100 px', Math.abs(before.w - 1100) <= 6, JSON.stringify(before));
		const rec = await page.evaluate(() => { try { return JSON.parse(localStorage.getItem('lpn_altbox')); } catch (e) { return null; } });
		ok('4.1 lpn_altbox holds the dock and its width', !!rec && rec.dock === 'right' && Math.abs(rec.dockW - before.w) <= 2, JSON.stringify(rec));
		const inProject = await page.evaluate(() => Object.keys(localStorage).filter((k) => /^lpn_project_/.test(k)).some((k) => /altbox|dockW/.test(localStorage.getItem(k))));
		ok('4.2 the project holds nothing of it (window furniture only)', !inProject);
		await a.reload();
		await noConsent();
		await a.settle(800);
		await openAlt();
		const after = await geom();
		ok('4.3 reopened after the reload: docked right at the same width', after.docked && Math.abs(after.w - before.w) <= 2, JSON.stringify({ before: before.w, after }));

		console.log('\n--- 5. floating, resized, reloaded ---');
		await page.click('#lpn_alt_box .lpn-corner-btn[data-dock="float"]');
		await a.settle(500);
		// The browser's own resize corner, dragged by a real mouse.
		const r = await page.evaluate(() => { const b = document.getElementById('lpn_alt_box').getBoundingClientRect(); return { x: b.right - 4, y: b.bottom - 4, w: b.width, h: b.height }; });
		await page.mouse.move(r.x, r.y);
		await page.mouse.down();
		await page.mouse.move(r.x - 300, r.y - 60, { steps: 10 });
		await page.mouse.up();
		await a.settle(600);
		const fl = await geom();
		ok('5.0 the corner made it about 300 px narrower', !fl.docked && Math.abs(fl.w - (r.w - 300)) <= 8, JSON.stringify({ was: r.w, now: fl.w }));
		await a.reload();
		await noConsent();
		await a.settle(800);
		await openAlt();
		const fl2 = await geom();
		ok('5.1 reopened after the reload: floating at the same size', !fl2.docked && Math.abs(fl2.w - fl.w) <= 2 && Math.abs(fl2.h - fl.h) <= 2, JSON.stringify({ before: fl, after: fl2 }));
		ok('no uncaught page errors', errors.length === 0, errors.join(' | '));
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? `\n${fails} FAILED` : '\nall ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
