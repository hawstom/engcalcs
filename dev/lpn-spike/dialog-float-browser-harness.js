// CONVERT AS AND THE COORDINATE-SYSTEM CHOOSER MOVE, RESIZE, AND EVERY ROW'S DIVIDER DRAGS (round 11b; Tom, 2026-10-31: Convert as
// "(1) The second divider is not draggable. 2. The box is not draggable or resizeable, and I see no good reason why not." and of the
// chooser "(1) It seems a little like a bug that the last 'row' doesn't have a draggable divider. (2) Also not draggable or resizeable.").
// Design: dev/box-float-design.md. On Net1, at 1366 x 900 with a mouse and at 390 x 844 with a finger, for both boxes:
//   - a drag of the title band moves the box by the drag;
//   - a drag of the resize corner (the browser's own on a PC, the grip on a phone) changes its size, and the rows reflow to it;
//   - EVERY divider moves when dragged (Convert as's three Label dividers and its Round to | Suffix line; the chooser's two, the
//     one-row Name run included) and the box's width does not change; the Round to | Suffix divider sits on that line;
//   - the chooser opened from Convert as stands in front of it; Esc closes the chooser only and hands the focus back to `...`;
//   - Convert as still converts (SI, a new tab whose units are SI);
//   - and none of it adds a key to the visitor's storage.
//
//   node dev/lpn-spike/dialog-float-browser-harness.js   (takes the browser lock itself)
//   FLOAT_SHOT=<dir> also writes screenshots there (box11-float-<what>-<pc|phone>.png).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_FLOAT_LOCKED';
const NAME = 'dialog-float-browser-harness';
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
const near = (a, b, tol) => Math.abs(a - b) <= tol;

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const SHOT = process.env.FLOAT_SHOT || '';
	const MODES = [['pc', { viewport: { width: 1366, height: 900 } }], ['phone', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }]];
	try {
		for (const [mode, opt] of MODES) {
			console.log('\n=== ' + mode + ' ===');
			const touch = mode === 'phone';
			const a = await Session.open(browser, NAME + '-' + mode, Object.assign({ serviceWorkers: 'block' }, opt));
			const page = a.page;
			const cdp = await page.context().newCDPSession(page);
			await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
			await a.goto('Looped-Network.php?ec_nolog=1');
			await a.answerTrainingPanel().catch(() => {});
			await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } localStorage.removeItem('lpn_gcols'); });
			await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
			await a.settle(1500);
			const keys0 = await page.evaluate(() => Object.keys(localStorage).filter((k) => !/^lpn_project_/.test(k)).sort());
			// One drag, by mouse on a PC and by finger on a phone, in small steps.
			async function drag(x0, y0, dx, dy) {
				const n = 8;
				if (touch) {
					const tp = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
					await tp('touchStart', x0, y0);
					for (let i = 1; i <= n; i++) { await tp('touchMove', x0 + dx * i / n, y0 + dy * i / n); }
					await tp('touchEnd');
				} else {
					await page.mouse.move(x0, y0);
					await page.mouse.down();
					for (let i = 1; i <= n; i++) { await page.mouse.move(x0 + dx * i / n, y0 + dy * i / n); }
					await page.mouse.up();
				}
				await a.settle(250);
			}
			// A press on a control in a row: a finger's tap on a phone (a divider's hit area may lie over it, and passes the tap through).
			async function tap(sel) {
				if (!touch) { await page.click(sel); await a.settle(200); return; }
				const r = await rect(sel), x = r.x + r.w / 2, y = r.y + r.h / 2;
				await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
				await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
				await a.settle(300);
			}
			const rect = (sel) => page.$eval(sel, (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, r: r.right, b: r.bottom }; });
			const shot = async (what, sel) => { if (SHOT) { await page.locator(sel).screenshot({ path: path.join(SHOT, 'box11-float-' + what + '-' + mode + '.png') }).catch(() => {}); } };

			// The box's title band moves it; its corner sizes it and the rows follow.
			async function moveAndSize(tag, sel, bodySel) {
				let r0 = await rect(sel);
				const disp = await page.$eval(sel, (e) => getComputedStyle(e).display);
				ok(tag + ': open as a flex column (title band, scrolling body)', disp === 'flex', disp);
				const dx = touch ? -24 : -120, dy = touch ? -40 : -50;   // up, so the corner stays on screen
				await drag(r0.x + r0.w / 2, r0.y + 14, dx, dy);
				let r1 = await rect(sel);
				ok(tag + ': dragged by its title, it moves by the drag', near(r1.x - r0.x, dx, 3) && near(r1.y - r0.y, dy, 3),
					'moved ' + Math.round(r1.x - r0.x) + ',' + Math.round(r1.y - r0.y) + ' for ' + dx + ',' + dy);
				ok(tag + ': and keeps its size while it moves', near(r1.w, r0.w, 1) && near(r1.h, r0.h, 1));
				const b0 = await rect(bodySel);
				const rw = touch ? -70 : 90, rh = touch ? -120 : -80;
				if (touch) {
					const g = await rect(sel + ' .lpn-resize-grip').catch(() => null);
					ok(tag + ': a phone shows the resize grip', !!g && g.w > 0, JSON.stringify(g));
					if (g) { await drag(g.x + g.w / 2, g.y + g.h / 2, rw, rh); }
				} else {
					ok(tag + ': the box is resizable (resize: both)', await page.$eval(sel, (e) => getComputedStyle(e).resize) === 'both');
					await drag(r1.r - 4, r1.b - 4, rw, rh);
				}
				const r2 = await rect(sel), b1 = await rect(bodySel);
				ok(tag + ': its corner sizes it', near(r2.w - r1.w, rw, 4) && near(r2.h - r1.h, rh, 4),
					Math.round(r1.w) + 'x' + Math.round(r1.h) + ' -> ' + Math.round(r2.w) + 'x' + Math.round(r2.h));
				ok(tag + ': and the rows reflow to the new width', near(b1.w - b0.w, rw, 4), Math.round(b0.w) + ' -> ' + Math.round(b1.w));
				const over = await page.$eval(bodySel, (e) => e.scrollWidth - e.clientWidth);
				ok(tag + ': nothing scrolls sideways at the new size', over <= 1, String(over));
			}
			// Every divider of the box moves when dragged, and the box's width does not.
			async function dividers(tag, sel, want) {
				const n = await page.$$eval(sel + ' .lpn-gsplit', (l) => l.filter((s) => s.getBoundingClientRect().width > 0).length);
				ok(tag + ': ' + want + ' dividers stand in the box', n === want, String(n));
				for (let i = 0; i < n; i++) {
					const at = () => page.$$eval(sel + ' .lpn-gsplit', (l, i) => {
						const s = l.filter((e) => e.getBoundingClientRect().width > 0)[i], r = s.getBoundingClientRect();
						const hit = document.elementFromPoint(r.left + r.width / 2, r.top + Math.min(10, r.height / 2));
						return { x: r.left + r.width / 2, y: r.top + Math.min(10, r.height / 2), c1: s.classList.contains('lpn-convas-split'), hit: hit === s, top: r.top };
					}, i);
					const s0 = await at(), w0 = (await rect(sel)).w;
					const name = s0.c1 ? 'the Round to | Suffix divider' : 'divider ' + (i + 1) + ' (row at ' + Math.round(s0.top) + ')';
					ok(tag + ': ' + name + ' takes the press', s0.hit);
					const dx = s0.c1 ? -24 : (i % 2 ? -24 : 24);
					await drag(s0.x, s0.y, dx, 0);
					const s1 = await at(), w1 = (await rect(sel)).w;
					ok(tag + ': ' + name + ' moves when dragged', Math.abs(s1.x - s0.x) >= 12 && Math.sign(s1.x - s0.x) === Math.sign(dx),
						Math.round(s0.x) + ' -> ' + Math.round(s1.x));
					ok(tag + ': ' + name + ': the box width does not change', near(w1, w0, 0.5), w0 + ' -> ' + w1);
				}
			}

			// ---- Convert as ----
			await a.menuClick(await a.lang('lpn_file_convert_as'), 'file');
			await page.waitForSelector('#lpn_convas_panel', { state: 'visible', timeout: 4000 });
			await a.settle(700);
			const pr = await rect('#lpn_convas_panel'), vw = opt.viewport.width, vh = opt.viewport.height;
			ok('convert as: opens wholly on screen', pr.x >= 0 && pr.y >= 0 && pr.r <= vw + 0.5 && pr.b <= vh + 0.5, JSON.stringify(pr));
			const footIn = await page.$eval('#lpn_convas_ok', (e) => e.getBoundingClientRect().bottom <= window.innerHeight);
			ok('convert as: Convert and Cancel are in view', footIn);
			if (touch) { ok('convert as: a phone box fills the width', near(pr.w, vw - 8, 2), String(pr.w)); }
			await shot('convas-open', '#lpn_convas_panel');
			await moveAndSize('convert as', '#lpn_convas_panel', '#lpn_convas_body');
			await dividers('convert as', '#lpn_convas_panel', 4);
			const line = await page.evaluate(() => {
				const s = document.querySelector('#lpn_convas_panel .lpn-convas-split').getBoundingClientRect();
				const c = document.querySelector('#lpn_convas_panel .lpn-grow:not(.lpn-convas-colhead) .lpn-convas-c1').getBoundingClientRect();
				return { split: s.left + s.width / 2, line: c.right, coarse: matchMedia('(pointer: coarse)').matches };
			});
			ok('convert as: the Round to | Suffix divider stands on that line', near(line.split, line.line + (line.coarse ? 4 : 0), 4), JSON.stringify(line));
			await shot('convas-moved', '#lpn_convas_panel');

			// ---- the chooser, opened from Convert as ----
			await tap('#lpn_convas_kind_epsg');
			await tap('#lpn_convas_crs_pick');
			await page.waitForSelector('#lpn_crsbox', { state: 'visible', timeout: 4000 });
			await a.settle(900);
			const z = await page.evaluate(() => [document.getElementById('lpn_crsbox'), document.getElementById('lpn_convas_panel')].map((e) => +getComputedStyle(e).zIndex));
			ok('chooser: stands in front of Convert as', z[0] > z[1], z.join(' over '));
			const lastRun = await page.evaluate(() => { const g = Array.from(document.querySelectorAll('#lpn_crsbox .lpn-grid')); const l = g[g.length - 1]; return { rows: l.querySelectorAll(':scope > .lpn-grow').length, split: !!l.querySelector(':scope > .lpn-gsplit') }; });
			ok('chooser: its last run (one row, Name) has a divider', lastRun.split, JSON.stringify(lastRun));
			await shot('crs-open', '#lpn_crsbox');
			await moveAndSize('chooser', '#lpn_crsbox', '#lpn_crsbox_body');
			await dividers('chooser', '#lpn_crsbox', 2);
			if (SHOT) { await page.screenshot({ path: path.join(SHOT, 'box11-float-stack-' + mode + '.png') }).catch(() => {}); }
			// Esc in the chooser: the chooser only, and the focus goes back to `...`.
			await page.focus('#lpn_crsbox_name');
			await page.keyboard.press('Escape');
			await a.settle(300);
			const after = await page.evaluate(() => ({
				crs: getComputedStyle(document.getElementById('lpn_crsbox')).display,
				convas: getComputedStyle(document.getElementById('lpn_convas_panel')).display,
				focus: document.activeElement && document.activeElement.id }));
			ok('Esc in the chooser closes the chooser', after.crs === 'none', after.crs);
			ok('...and leaves Convert as open', after.convas !== 'none', after.convas);
			ok('...with the focus back on the button that opened it', after.focus === 'lpn_convas_crs_pick', after.focus);
			// Picking a system from the chooser still lands in Convert as.
			await tap('#lpn_convas_crs_pick');
			await page.waitForSelector('#lpn_crsbox', { state: 'visible', timeout: 4000 });
			await tap('#lpn_crsbox_cancel');
			await a.settle(300);
			ok('Cancel in the chooser leaves Convert as open', await page.$eval('#lpn_convas_panel', (e) => getComputedStyle(e).display !== 'none'));

			// ---- Convert as still converts ----
			await tap('#lpn_convas_kind_none');
			const before = await page.evaluate(() => JSON.parse(localStorage.getItem('lpn_index') || '{}').openId);
			await tap('#lpn_convas_si');
			await tap('#lpn_convas_ok');
			await a.settle(1800);
			const conv = await page.evaluate(() => {
				const ix = JSON.parse(localStorage.getItem('lpn_index') || '{}'), d = JSON.parse(localStorage.getItem('lpn_project_' + ix.openId) || 'null');
				return { id: ix.openId, units: d && d.units };
			});
			ok('Convert as converts: a new tab is open', conv.id && conv.id !== before, conv.id + ' vs ' + before);
			ok('...whose units are SI', !!conv.units && conv.units.lpn_u_diameter === 'mm' && conv.units.lpn_u_length === 'm', JSON.stringify(conv.units));
			// Reopened this session: on a PC where it was left and at the size it was given; a phone opens it filling the window again.
			await a.menuClick(await a.lang('lpn_file_convert_as'), 'file');
			await page.waitForSelector('#lpn_convas_panel', { state: 'visible', timeout: 4000 });
			await a.settle(500);
			const re = await rect('#lpn_convas_panel');
			if (touch) { ok('reopened on a phone: it fills the width again', near(re.w, vw - 8, 2), String(re.w)); }
			else { ok('reopened on a PC: where and as big as it was left', near(re.w, pr.w + 90, 5), Math.round(re.w) + ' vs ' + Math.round(pr.w + 90)); }
			await tap('#lpn_convas_cancel');
			const keys1 = await page.evaluate(() => Object.keys(localStorage).filter((k) => !/^lpn_project_/.test(k)).sort());
			const added = keys1.filter((k) => keys0.indexOf(k) < 0 && k !== 'lpn_gcols');
			ok('no new key is stored on the visitor\'s device (the divider rides in lpn_gcols)', added.length === 0, JSON.stringify(added));
			await a.close();
		}
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
