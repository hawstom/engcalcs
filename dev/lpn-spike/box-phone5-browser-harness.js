// BOX DESIGN, ROUND 5 (Tom's 2026-10-29 browser pass on round 4). Run with:
//   node dev/lpn-spike/box-phone5-browser-harness.js   (takes the browser lock itself)
//   A. a Text's two rotate buttons stand in a full-width row of their own under the Angle row, like the DEM buttons
//      (390 x 844, 360 x 740, and a PC);
//   B. the left-edge drag handle is a slim pill (4 x 32 px) with a transparent hit strip and no grey slab, in rest, hover
//      and pressed states, phone and PC; dragging still resizes and the flyout stays open after the drag;
//   C. on a phone in tall mode a Properties flyout opens at about half the screen height, a drag of its bottom handle makes
//      it taller, and a PC flyout is still the full column.
// EC_SHOTS=<dir> saves box5-*.png there.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BP5_LOCKED';
const NAME = 'box-phone5-browser-harness';
const SHOTS = process.env.EC_SHOTS || '';
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
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const net1 = fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8');
	const shot = (S, n) => SHOTS ? S.page.screenshot({ path: path.join(SHOTS, n) }) : Promise.resolve();
	const devices = [
		{ n: 'phone 390x844', w: 390, h: 844, touch: true, tag: 'phone' },
		{ n: 'phone 360x740', w: 360, h: 740, touch: true, tag: 'phone360' },
		{ n: 'PC 1200x800', w: 1200, h: 800, touch: false, tag: 'pc' }];
	const openNet1 = async (S) => {
		await S.page.addInitScript(() => { window.EC_DEFAULT_DOCKS = true; });
		await S.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await S.goto('Looped-Network.php?ec_nolog=1');
		await S.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, net1);
		await S.reload();
		await S.answerTrainingPanel().catch(() => {});
		await S.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await S.settle(2500);
	};
	const tapNode = async (S, touch) => {
		const at = await S.page.evaluate(() => { const c = Array.from(document.querySelectorAll('#lpn_canvas [data-node="22"]')).filter((e) => e.getBoundingClientRect().width > 0)[0]; const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		if (touch) { await S.page.touchscreen.tap(at.x, at.y); } else { await S.page.mouse.click(at.x, at.y); }
		await S.settle(1100);
	};
	try {
		console.log('\n--- A. a Text\'s rotate buttons ---');
		for (const dev of devices) {
			// The Text is placed on a desktop-sized window (the toolbar's tool is reachable there), then the window narrows to the phone.
			const S = await Session.open(browser, NAME + '-a-' + dev.tag, { viewport: { width: 1200, height: 800 }, hasTouch: dev.touch, isMobile: dev.touch });
			const P = S.page;
			await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
			await S.goto('Looped-Network.php?ec_nolog=1');
			await S.answerTrainingPanel().catch(() => {});
			await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await S.settle(800);
			await S.newProject('us');
			await S.dismissGallery();
			await S.settle(600);
			await S.toolbarClick(await S.lang('lpn_tool_add_text'));
			await S.settle(300);
			const ps = await P.evaluate(() => { const b = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: b.x + b.width * 0.5, y: b.y + b.height * 0.3 }; });
			if (dev.touch) { await P.touchscreen.tap(ps.x, ps.y); } else { await P.mouse.click(ps.x, ps.y); }
			await S.settle(300);
			await P.keyboard.type('Pump station');
			await P.keyboard.press('Control+Enter');
			await S.settle(300);
			await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await S.settle(150);
			await P.keyboard.press('0');
			await P.setViewportSize({ width: dev.w, height: dev.h });
			await S.settle(1000);
			const tc = await P.evaluate(() => { const t = document.querySelector('#lpn_canvas text.lpn-lbl[data-lbl]'); const b = t.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
			if (dev.touch) { await P.touchscreen.tap(tc.x, tc.y); } else { await P.mouse.click(tc.x, tc.y); }
			await S.settle(1100);
			const m = await P.evaluate(() => {
				const box = document.getElementById('lpn_popup'), row = box && box.querySelector('.lpn-rot-btns');
				if (!row) { return null; }
				const bs = Array.from(row.querySelectorAll('button')).map((b) => b.getBoundingClientRect());
				const rr = row.getBoundingClientRect();
				const ang = Array.from(box.querySelectorAll('.lpn-grow')).filter((r) => /Angle/i.test(r.textContent) && r.querySelector('input[type="number"]'))[0];
				const ar = ang ? ang.getBoundingClientRect() : null;
				const gr = (box.querySelector('.lpn-gprops') || box).getBoundingClientRect(), br = box.getBoundingClientRect();
				return { rowL: Math.round(rr.left), rowW: Math.round(rr.width), gridL: Math.round(gr.left), gridW: Math.round(gr.width), boxL: Math.round(br.left), boxR: Math.round(br.right),
					angleBottom: ar ? Math.round(ar.bottom) : null, rowTop: Math.round(rr.top), n: bs.length, sameLine: bs.length === 2 && Math.abs(bs[0].top - bs[1].top) < 2,
					btnR: Math.round(Math.max.apply(null, bs.map((b) => b.right))), btnL: Math.round(Math.min.apply(null, bs.map((b) => b.left))), btnH: Math.round(bs[0].height), disp: getComputedStyle(row).display };
			});
			console.log('  ' + dev.n + ' ' + JSON.stringify(m));
			ok(dev.n + ': the two rotate buttons are in a row of their own', !!m && m.n === 2);
			ok(dev.n + ': that row spans the full width of the rows above it (as the DEM row does)', !!m && m.rowW >= m.gridW - 4 && m.rowL <= m.gridL + 2, m && ('row ' + m.rowL + '+' + m.rowW + ' grid ' + m.gridL + '+' + m.gridW));
			ok(dev.n + ': the row stands under the Angle row, not beside it', !!m && m.angleBottom !== null && m.rowTop >= m.angleBottom - 2, m && (m.rowTop + ' vs ' + m.angleBottom));
			ok(dev.n + ': both buttons lie inside the box', !!m && m.btnL >= m.boxL && m.btnR <= m.boxR, m && (m.btnL + '..' + m.btnR + ' in ' + m.boxL + '..' + m.boxR));
			if (dev.touch) { ok(dev.n + ': a finger-tall button (>= 36 px)', !!m && m.btnH >= 36, m && String(m.btnH)); }
			await shot(S, 'box5-text-' + dev.tag + '.png');
			ok(dev.n + ': no page error', S.errors.length === 0, S.errors.join(' | '));
			await S.close();
		}

		console.log('\n--- B. the left-edge handle ---');
		for (const dev of devices) {
			const S = await Session.open(browser, NAME + '-b-' + dev.tag, { viewport: { width: dev.w, height: dev.h }, hasTouch: dev.touch, isMobile: dev.touch });
			const P = S.page;
			await openNet1(S);
			await tapNode(S, dev.touch);
			const sample = () => P.evaluate(() => {
				const g = ['right', 'left'].map((k) => document.getElementById('lpn_dock_grip_' + k)).filter((e) => e && getComputedStyle(e).display !== 'none')[0];
				if (!g) { return null; }
				const r = g.getBoundingClientRect(), cs = getComputedStyle(g), af = getComputedStyle(g, '::after');
				return { hitW: Math.round(r.width), hitH: Math.round(r.height), bg: cs.backgroundColor, pillW: parseFloat(af.width), pillH: parseFloat(af.height), pillBg: af.backgroundColor, x: r.left + r.width / 2, y: r.top + r.height / 2 };
			});
			const gripPaintsSlab = (s) => !/rgba\(0, 0, 0, 0\)|transparent/.test(s.bg);
			let s = await sample();
			console.log('  ' + dev.n + ' rest ' + JSON.stringify(s));
			ok(dev.n + ': the handle exists beside the flyout', !!s);
			ok(dev.n + ': its visible part is a pill 4 px wide and 32 px tall', !!s && s.pillW === 4 && s.pillH === 32 && !/rgba\(0, 0, 0, 0\)/.test(s.pillBg), s && (s.pillW + 'x' + s.pillH + ' ' + s.pillBg));
			ok(dev.n + ': the touch strip is transparent (no grey slab)', !!s && !gripPaintsSlab(s), s && s.bg);
			ok(dev.n + ': the strip is a usable target (>= ' + (dev.touch ? 12 : 8) + ' px wide, at most 16; round 6 narrowed the phone strip from 19 px)', !!s && s.hitW >= (dev.touch ? 12 : 8) && s.hitW <= 16, s && String(s.hitW));
			// Pressed or hovered: still no slab.
			await P.mouse.move(s.x, s.y);
			await S.settle(200);
			const sh = await sample();
			ok(dev.n + ': hovered or pressed it stays transparent behind the pill', !!sh && !gripPaintsSlab(sh), sh && sh.bg);
			const out = () => P.evaluate(() => { const b = document.getElementById('lpn_popup'); return !!b && b.classList.contains('lpn-dock-out'); });
			ok(dev.n + ': the flyout is out before the drag', await out());
			const w0 = await P.evaluate(() => document.getElementById('lpn_popup').getBoundingClientRect().width);
			if (dev.touch) {
				const cdp = await P.context().newCDPSession(P);
				const tp = (type, x) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y: s.y, id: 1 }] });
				await tp('touchStart', s.x);
				for (let i = 1; i <= 6; i++) { await tp('touchMove', s.x - i * 8); await S.settle(30); }
				await tp('touchEnd', 0);
			} else {
				await P.mouse.move(s.x, s.y); await P.mouse.down();
				await P.mouse.move(s.x + 60, s.y, { steps: 6 }); await P.mouse.up();
			}
			const w1 = await P.evaluate(() => document.getElementById('lpn_popup').getBoundingClientRect().width);
			ok(dev.n + ': dragging the handle still resizes the box', Math.abs(w1 - w0) > 20, w0 + ' -> ' + w1);
			if (dev.touch) {
				await S.settle(3000);
				ok(dev.n + ': Properties stays open after the drag (3 s)', await out());
			}
			await shot(S, 'box5-grip-' + dev.tag + '.png');
			await S.close();
		}

		console.log('\n--- C. Properties opens at about half the screen height on a phone ---');
		for (const dev of devices) {
			const S = await Session.open(browser, NAME + '-c-' + dev.tag, { viewport: { width: dev.w, height: dev.h }, hasTouch: dev.touch, isMobile: dev.touch });
			const P = S.page;
			await openNet1(S);
			await tapNode(S, dev.touch);
			const sz = () => P.evaluate(() => { const b = document.getElementById('lpn_popup'), r = b.getBoundingClientRect(), h = document.getElementById('lpn_dock_hgrip'), hr = h && getComputedStyle(h).display !== 'none' ? h.getBoundingClientRect() : null;
				return { top: Math.round(r.top), h: Math.round(r.height), bottom: Math.round(r.bottom), vh: innerHeight, frac: Math.round(r.height / innerHeight * 100) / 100, out: b.classList.contains('lpn-dock-out'), hg: hr ? { y: hr.top + hr.height / 2, x: hr.left + hr.width / 2, w: Math.round(hr.width) } : null }; });
			const z = await sz();
			console.log('  ' + dev.n + ' ' + JSON.stringify(z));
			if (dev.touch) {
				ok(dev.n + ': opens at 40 to 60% of the screen height', z.out && z.frac >= 0.4 && z.frac <= 0.6, JSON.stringify(z));
				ok(dev.n + ': the map below it stays visible (>= 30% of the screen free under the box)', z.vh - z.bottom >= z.vh * 0.3, JSON.stringify(z));
				ok(dev.n + ': a bottom handle is there to drag it taller', !!z.hg, JSON.stringify(z.hg));
				await shot(S, 'box5-props-' + dev.tag + '.png');
				if (z.hg) {
					const cdp = await P.context().newCDPSession(P);
					const tp = (type, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x: z.hg.x, y, id: 1 }] });
					await tp('touchStart', z.hg.y);
					for (let i = 1; i <= 8; i++) { await tp('touchMove', z.hg.y + i * 30); await S.settle(30); }
					await tp('touchEnd', 0);
					await S.settle(400);
					const z2 = await sz();
					ok(dev.n + ': dragging the bottom handle down makes it taller (not capped)', z2.h > z.h + 100, z.h + ' -> ' + z2.h);
					ok(dev.n + ': it is still open after the drag', z2.out);
				}
			} else {
				ok(dev.n + ': a PC flyout is still the full column (>= 80% of the screen height)', z.out && z.frac >= 0.8 && !z.hg, JSON.stringify(z));
			}
			ok(dev.n + ': no page error', S.errors.length === 0, S.errors.join(' | '));
			await S.close();
		}
	} catch (e) {
		ok('harness ran to the end', false, e && e.stack);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + ' of ' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main();
