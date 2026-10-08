// AN AUTO-HIDDEN ALTERNATIVES BOX MAY COVER THE WHOLE MAP; A PINNED ONE KEEPS THE MAP'S 320 PX.
// Run with:  node dev/lpn-spike/alt-autohide-width-browser-harness.js
//
// Tom, 2026-10-08: "The Alternatives box widens until the map is 320 px. Why not cover the map
// entirely when it's an autohide box. A pinned box is different, of course. It needs its limits."
// Real Chromium, 1920x1000: docked and auto-hidden, the flown-out box's grip takes it past
// (window - 320 px) to the whole map; pinned, the same drag stops at a 320 px map; pinning the wide
// auto-hidden box clamps it back to that.
//
// DO NOT PREFIX THIS WITH `flock`: it takes /tmp/engcalcs-browser.lock itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock', LOCK_ENV = 'EC_AAH_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error('alt-autohide-width-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
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

		console.log('--- pinned: the 320 px floor ---');
		await openAlt();
		await page.click('#lpn_alt_box .lpn-corner-btn[data-dock="right"]');
		await a.settle(600);
		let g = await geom();
		g = await dragGrip(g, 3);
		ok('1.0 pinned, dragged to the left edge: the map keeps 320 px', g.map >= 319 && g.map <= 330, JSON.stringify(g));

		console.log('\n--- auto-hidden: covers the map ---');
		await page.click('#lpn_alt_box .lpn-corner-btn[data-dock="autohide"]');
		await a.settle(600);
		const mapTucked = (await geom()).map;
		ok('2.0 tucked, the map is nearly the whole window', mapTucked > W - 100, String(mapTucked));
		const tb = await (await page.$('#lpn_dock_strip_right .lpn-dock-tab')).boundingBox();
		await page.mouse.move(tb.x - 300, tb.y + 10);
		await a.settle(100);
		await page.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2, { steps: 3 });
		await a.settle(600);
		g = await geom();
		ok('2.1 flown out, the grip is live', g.gx !== null, JSON.stringify(g));
		g = await dragGrip(g, 3);
		const wide = g;
		ok('2.2 the box is wider than window - 320 px', g.w > W - 320 + 40, JSON.stringify(g));
		ok('2.3 ...and covers nearly the whole map (within the strip and a margin)', g.w >= mapTucked - 60, JSON.stringify({ w: g.w, map: mapTucked }));
		ok('2.4 ...without shrinking the map', Math.abs(g.map - mapTucked) <= 2, JSON.stringify({ map: g.map, mapTucked }));

		console.log('\n--- pinning the wide box clamps it ---');
		await page.mouse.move(900, 500);
		await a.settle(300);
		if (!(await page.isVisible('#lpn_alt_box .lpn-corner-btn[data-dock="autohide"]'))) {
			const t2 = await (await page.$('#lpn_dock_strip_right .lpn-dock-tab')).boundingBox();
			await page.mouse.move(t2.x - 300, t2.y + 10);
			await page.mouse.move(t2.x + t2.width / 2, t2.y + t2.height / 2, { steps: 3 });
			await a.settle(600);
		}
		await page.click('#lpn_alt_box .lpn-corner-btn[data-dock="autohide"]');
		await a.settle(700);
		g = await geom();
		ok('3.0 pinned, the map keeps 320 px', g.docked && g.map >= 319 && g.map <= 330, JSON.stringify(g));
		ok('3.1 the width it keeps is the clamped one, not the flyout\'s', g.w <= W - 319, String(g.w));
		ok('no uncaught page errors', errors.length === 0, errors.join(' | '));
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? `\n${fails} FAILED` : '\nall ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
