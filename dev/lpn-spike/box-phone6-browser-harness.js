// BOX DESIGN, ROUND 6 (Tom's 2026-10-30 browser pass on round 5). Run with:
//   node dev/lpn-spike/box-phone6-browser-harness.js   (takes the browser lock itself)
//   A. on a phone the Properties rows are dense: a row pitch (top of one row to the top of the next) of at most 26 px for a
//      junction and for a pipe (it was 40+), inputs still at least 22 px tall; Settings and Find and replace rows are as dense;
//   B. the invisible finger strip of the side grip is at most 16 px wide on a phone and 8 px on a PC, and a tap 20 px beside
//      the grip reaches the map beneath; the pane-edge grips on a PC are at most 8 px;
//   C. the height dragged on a phone flyout's bottom pill is still there after a reload (browser storage, never the project).
// EC_SHOTS=<dir> saves box6-*.png there.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BP6_LOCKED';
const NAME = 'box-phone6-browser-harness';
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
const MAX_PITCH = 26, MIN_INPUT = 22, PHONE_STRIP = 16, PC_STRIP = 8;
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
	const openNet1 = async (S, keep) => {
		await S.page.addInitScript(() => { window.EC_DEFAULT_DOCKS = true; });
		await S.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await S.goto('Looped-Network.php?ec_nolog=1');
		if (!keep) { await S.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, net1); }
		await S.reload();
		await S.answerTrainingPanel().catch(() => {});
		await S.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await S.settle(2500);
	};
	const tapEl = async (S, touch, sel) => {
		const at = await S.page.evaluate((q) => { const c = Array.from(document.querySelectorAll(q)).filter((e) => e.getBoundingClientRect().width > 0)[0]; const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
		if (touch) { await S.page.touchscreen.tap(at.x, at.y); } else { await S.page.mouse.click(at.x, at.y); }
		await S.settle(1100);
	};
	// The row pitch of a box: the median distance between the tops of consecutive visible rows.
	const pitch = (S, boxSel) => S.page.evaluate((a) => {
		const q = a.q, MP = a.mp;
		const box = document.querySelector(q);
		if (!box) { return null; }
		const rows = Array.from(box.querySelectorAll('.lpn-grow')).filter((r) => r.querySelector('.lpn-gval') && r.firstElementChild).map((r) => {
			const c = Array.from(r.children).filter((k) => k.getBoundingClientRect().height > 0);
			if (!c.length) { return null; }
			const t = Math.min.apply(null, c.map((k) => k.getBoundingClientRect().top)), b = Math.max.apply(null, c.map((k) => k.getBoundingClientRect().bottom));
			const inp = c.filter((k) => /^(INPUT|SELECT|TEXTAREA)$/.test(k.tagName) && k.type !== 'checkbox' && k.type !== 'radio')[0];
			return { t, b, ih: inp ? inp.getBoundingClientRect().height : null };
		}).filter(Boolean).sort((a, b) => a.t - b.t);
		const d = [];
		for (let i = 1; i < rows.length; i++) { const x = rows[i].t - rows[i - 1].t; if (x > 4 && x < 80) { d.push(x); } }
		d.sort((a, b) => a - b);
		const ih = rows.map((r) => r.ih).filter((x) => x).sort((a, b) => a - b);
		return { n: rows.length, median: d.length ? d[Math.floor(d.length / 2)] : null, max: d.length ? d[d.length - 1] : null, over: d.filter((x) => x > MP + 4).length, of: d.length, minInput: ih.length ? Math.round(ih[0]) : null };
	}, { q: boxSel, mp: MAX_PITCH });
	try {
		console.log('\n--- A. dense Properties rows on a phone ---');
		for (const dev of devices.filter((x) => x.touch)) {
			const S = await Session.open(browser, NAME + '-a-' + dev.tag, { viewport: { width: dev.w, height: dev.h }, hasTouch: dev.touch, isMobile: dev.touch });
			await openNet1(S);
			for (const [what, sel] of [['pipe', '#lpn_canvas .lpn-link-hit[data-link="10"]'], ['junction', '#lpn_canvas [data-node="22"]']]) {
				await tapEl(S, true, sel);
				const m = await pitch(S, '#lpn_popup');
				console.log('  ' + dev.n + ' ' + what + ' ' + JSON.stringify(m));
				const kind = await S.page.evaluate(() => /Diameter|Roughness|Length/.test(document.getElementById('lpn_popup').textContent) ? 'pipe' : 'junction');
				ok(dev.n + ' ' + what + ': Properties shows the ' + what + "'s rows", !!m && m.n >= 4 && kind === what, m && (m.n + ' rows, ' + kind));
				ok(dev.n + ' ' + what + ': the median row pitch is at most ' + MAX_PITCH + ' px', !!m && m.median !== null && m.median <= MAX_PITCH, m && String(m.median));
				ok(dev.n + ' ' + what + ': only a row whose label wraps to two lines is taller than ' + (MAX_PITCH + 4) + ' px (at most a quarter of them)', !!m && m.over * 4 <= m.of && m.max <= 50, m && (m.over + ' of ' + m.of + ', tallest ' + m.max));
				ok(dev.n + ' ' + what + ': inputs are still at least ' + MIN_INPUT + ' px tall', !!m && m.minInput !== null && m.minInput >= MIN_INPUT, m && String(m.minInput));
				await shot(S, 'box6-props-' + what + '-' + dev.tag + '.png');
			}
			ok(dev.n + ': no page error', S.errors.length === 0, S.errors.join(' | '));
			await S.close();
		}

		console.log('\n--- A2. the other boxes on the standard style (Find and replace, Fire flow, Criticality; Settings keeps its own layout, shot only) keep their rows dense on a phone ---');
		{
			const dev = devices[0];
			const S = await Session.open(browser, NAME + '-a2', { viewport: { width: dev.w, height: dev.h }, hasTouch: true, isMobile: true });
			await openNet1(S);
			const L = (k) => S.lang(k);
			const analyze = await L('lpn_analyze_menu');
			const doors = [
				['Find and replace', '#lpn_find_popup', async () => { await S.menuClick(await L('lpn_find_menu'), 'edit'); }],
				['Fire flow', '#lpn_ff_box', async () => { await S.menuClickSub(analyze, await L('lpn_ff_menu'), 'project'); }],
				['Criticality', '#lpn_crit_box', async () => { await S.menuClickSub(analyze, await L('lpn_crit_menu'), 'project'); }]];
			await S.menuClick(await L('lpn_tool_settings'), 'project');
			await S.settle(900);
			await shot(S, 'box6-settings-phone.png');
			await S.page.keyboard.press('Escape'); await S.settle(300);
			for (const [what, boxSel, door] of doors) {
				await door();
				await S.settle(900);
				const m = await pitch(S, boxSel);
				console.log('  ' + what + ' ' + JSON.stringify(m));
				ok(what + ': it shows rows on a phone', !!m && m.n >= 3, m && String(m.n));
				ok(what + ': the median row pitch is at most ' + (MAX_PITCH + 2) + ' px', !!m && m.median !== null && m.median <= MAX_PITCH + 2, m && String(m.median));
				await shot(S, 'box6-' + what.replace(/ /g, '-').toLowerCase() + '-phone.png');
				await S.page.keyboard.press('Escape'); await S.settle(300);
			}
			await S.close();
		}

		console.log('\n--- B. the finger strip of the grips ---');
		for (const dev of devices) {
			const S = await Session.open(browser, NAME + '-b-' + dev.tag, { viewport: { width: dev.w, height: dev.h }, hasTouch: dev.touch, isMobile: dev.touch });
			const P = S.page;
			await openNet1(S);
			await tapEl(S, dev.touch, '#lpn_canvas [data-node="22"]');
			const g = await P.evaluate(() => {
				const e = ['right', 'left'].map((k) => document.getElementById('lpn_dock_grip_' + k)).filter((x) => x && getComputedStyle(x).display !== 'none')[0];
				if (!e) { return null; }
				const r = e.getBoundingClientRect(), box = document.getElementById('lpn_popup').getBoundingClientRect();
				return { w: Math.round(r.width * 10) / 10, l: r.left, r: r.right, cy: r.top + r.height / 2, side: e.id.replace('lpn_dock_grip_', ''), boxL: box.left, boxR: box.right };
			});
			console.log('  ' + dev.n + ' ' + JSON.stringify(g));
			ok(dev.n + ': the grip exists', !!g);
			const max = dev.touch ? PHONE_STRIP : PC_STRIP;
			ok(dev.n + ': the finger strip is at most ' + max + ' px wide', !!g && g.w <= max, g && String(g.w));
			ok(dev.n + ': ... and not thinner than the pill (4 px)', !!g && g.w >= 4, g && String(g.w));
			if (g) {
				// 20 px past the strip, on the map side, the element under the point is not the grip (a tap 8 px past it is checked too).
				const mapX8 = g.side === 'right' ? g.l - 8 : g.r + 8;
				const hit8 = await P.evaluate((a) => { const e = document.elementFromPoint(a.x, a.y); return !!e && !e.closest('#lpn_popup, .lpn-dock-grip, .lpn-dock-strip'); }, { x: mapX8, y: g.cy });
				ok(dev.n + ': a tap 8 px beside the grip reaches the map beneath', hit8);
				const mapX = g.side === 'right' ? g.l - 20 : g.r + 20;
				const hit = await P.evaluate((a) => { const e = document.elementFromPoint(a.x, a.y); return e ? (e.id || e.className || e.tagName) : null; }, { x: mapX, y: g.cy });
				ok(dev.n + ': a tap 20 px beside the grip does not land on the grip', !!hit && !/lpn-dock-grip/.test(String(hit)), String(hit));
				const pass = await P.evaluate((a) => { const e = document.elementFromPoint(a.x, a.y); return !!e && !e.closest('#lpn_popup, .lpn-dock-grip, .lpn-dock-strip'); }, { x: mapX, y: g.cy });
				ok(dev.n + ': ... it reaches the map beneath, not the box', pass);
			}
			if (!dev.touch) {
				const pg = await P.evaluate(() => Array.from(document.querySelectorAll('.lpn-pane-grip, .lpn-rpane-grip')).filter((e) => e.getBoundingClientRect().width > 0).map((e) => { const r = e.getBoundingClientRect(); return { c: e.className, w: Math.round(r.width), h: Math.round(r.height) }; }));
				console.log('  PC pane grips ' + JSON.stringify(pg));
				ok('PC pane-edge grips are at most 8 px across their narrow side', pg.every((x) => Math.min(x.w, x.h) <= 8), JSON.stringify(pg));
			}
			await shot(S, 'box6-grip-' + dev.tag + '.png');
			await S.close();
		}

		console.log('\n--- C. a dragged flyout height survives a reload ---');
		for (const dev of devices.filter((x) => x.touch)) {
			const S = await Session.open(browser, NAME + '-c-' + dev.tag, { viewport: { width: dev.w, height: dev.h }, hasTouch: true, isMobile: true });
			const P = S.page;
			await openNet1(S);
			await tapEl(S, true, '#lpn_canvas [data-node="22"]');
			const sz = () => P.evaluate(() => { const b = document.getElementById('lpn_popup'), r = b.getBoundingClientRect(), h = document.getElementById('lpn_dock_hgrip'), hr = h && getComputedStyle(h).display !== 'none' ? h.getBoundingClientRect() : null;
				return { h: Math.round(r.height), out: b.classList.contains('lpn-dock-out'), hg: hr ? { y: hr.top + hr.height / 2, x: hr.left + hr.width / 2 } : null }; });
			const z = await sz();
			ok(dev.n + ': the bottom pill is there', !!z.hg, JSON.stringify(z));
			if (z.hg) {
				const cdp = await P.context().newCDPSession(P);
				const tp = (type, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x: z.hg.x, y, id: 1 }] });
				await tp('touchStart', z.hg.y);
				for (let i = 1; i <= 6; i++) { await tp('touchMove', z.hg.y + i * 30); await S.settle(30); }
				await tp('touchEnd', 0);
				await S.settle(400);
				const z2 = await sz();
				ok(dev.n + ': the drag made it taller', z2.h > z.h + 100, z.h + ' -> ' + z2.h);
				const kept = await P.evaluate(() => Object.keys(localStorage).filter((k) => /dockH/.test(localStorage.getItem(k) || '')));
				ok(dev.n + ': the height is written to a browser key, not the project', kept.length > 0 && kept.every((k) => !/^lpn_project/.test(k)), JSON.stringify(kept));
				await S.reload();
				await S.answerTrainingPanel().catch(() => {});
				await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
				await S.settle(2500);
				await tapEl(S, true, '#lpn_canvas [data-node="22"]');
				const z3 = await sz();
				ok(dev.n + ': after a reload the flyout opens at the dragged height', Math.abs(z3.h - z2.h) <= 3, z2.h + ' -> ' + z3.h);
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
