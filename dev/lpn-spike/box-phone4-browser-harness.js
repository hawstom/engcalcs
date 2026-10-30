// BOX DESIGN, ROUND 4 (Tom's 2026-10-29 browser pass), a phone 390 x 844 with touch. Run with:
//   node dev/lpn-spike/box-phone4-browser-harness.js   (takes the browser lock itself)
//   A. Properties and Contour plot are two columns at 360 px and when dragged narrow, and no label overlaps its value;
//   B. a finger tap on a map Text opens Properties;
//   C. the pane edges are a hairline with a finger-sized grab area, no grey bar (screenshot box4-pane-edges-phone.png);
//   D. a floating box's left-edge resize handle does not lie over the first label's text;
//   E. Settings keeps its corner resize grip on a phone.
// EC_SHOTS=<dir> saves box4-phone-props.png, box4-phone-contour.png and box4-pane-edges-phone.png there.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BP4_LOCKED';
const NAME = 'box-phone4-browser-harness';
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
const { openBox } = require('./dock-boxes.js');
let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
// Every visible row of a box: is the name beside its value, and does the name's box end before the value's begins?
function rowsReport(P, boxId) {
	return P.evaluate((id) => {
		const box = document.getElementById(id);
		const rows = Array.from(box.querySelectorAll('.lpn-grow')).filter((r) => r.getBoundingClientRect().width > 0 && r.querySelector('.lpn-gname') && r.querySelector('.lpn-gval'));
		let overlap = 0, stacked = 0, bad = [];
		rows.forEach((r) => {
			const n = r.querySelector('.lpn-gname').getBoundingClientRect(), v = r.querySelector('.lpn-gval').getBoundingClientRect();
			if (n.right > v.left + 1) { overlap++; bad.push((r.querySelector('.lpn-gname').textContent || '').trim().slice(0, 20)); }
			if (v.top >= n.bottom - 1) { stacked++; }
		});
		const b = box.getBoundingClientRect();
		return { rows: rows.length, overlap, stacked, bad: bad.slice(0, 4), boxL: Math.round(b.left), boxR: Math.round(b.right), vw: window.innerWidth };
	}, boxId);
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
	const shot = (P, n) => SHOTS ? P.screenshot({ path: path.join(SHOTS, n) }) : Promise.resolve();
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 360, height: 780 }, hasTouch: true, isMobile: true });
		const P = a.page;
		await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await P.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, net1);
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(2500);
		ok('the phone is coarse-pointer 360 px wide', await P.evaluate(() => matchMedia('(pointer: coarse)').matches && window.innerWidth === 360));

		const openSettingsGrip = async () => {
			await P.evaluate(() => { document.querySelectorAll('.lpn-popover-x').forEach((x) => { if (x.getBoundingClientRect().width) { x.click(); } }); });
			await openBox(a, 'lpn_settings_box');
			await a.settle(700);
			return P.evaluate(() => { const b = document.getElementById('lpn_settings_box'), g = b.querySelector('.lpn-resize-grip'); if (!g) { return { shown: false }; }
				const r = g.getBoundingClientRect(), br = b.getBoundingClientRect();
				return { shown: getComputedStyle(g).display !== 'none' && r.width > 0, w: Math.round(r.width), right: Math.round(r.right), bottom: Math.round(r.bottom), boxRight: Math.round(br.right), boxBottom: Math.round(br.bottom) }; });
		};

		console.log('\n--- A. Properties, two columns ---');
		const at = await P.evaluate(() => { const c = Array.from(document.querySelectorAll('#lpn_canvas [data-node="22"]')).filter((e) => e.getBoundingClientRect().width > 0)[0]; const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await P.touchscreen.tap(at.x, at.y);
		await a.settle(900);
		let g = await rowsReport(P, 'lpn_popup');
		ok('Properties opens with at least 10 rows, all name-beside-value, none overlapping', g.rows >= 10 && g.stacked === 0 && g.overlap === 0, JSON.stringify(g));
		ok('Properties lies within the screen', g.boxL >= 0 && g.boxR <= g.vw, JSON.stringify(g));
		await shot(P, 'box4-phone-props.png');
		for (const w of [300, 240, 200]) {
			await P.evaluate((w) => { const p = document.getElementById('lpn_popup'); p.style.minWidth = '0'; p.style.width = w + 'px'; }, w);
			await a.settle(500);
			g = await rowsReport(P, 'lpn_popup');
			ok('dragged to ' + w + ' px: still two columns, no name over its value', g.rows >= 10 && g.stacked === 0 && g.overlap === 0, JSON.stringify(g));
		}
		await P.evaluate(() => { const p = document.getElementById('lpn_popup'); p.style.width = ''; p.style.minWidth = ''; const x = p.querySelector('.lpn-popover-x'); if (x) { x.click(); } });
		await a.settle(300);

		console.log('\n--- A2. Contour plot, two columns ---');
		await openBox(a, 'lpn_contour_box');
		await a.settle(900);
		g = await rowsReport(P, 'lpn_contour_box');
		ok('Contour plot opens with rows, all name-beside-value, none overlapping', g.rows >= 4 && g.stacked === 0 && g.overlap === 0, JSON.stringify(g));
		const lbl = await P.evaluate(() => (document.querySelector('#lpn_contour_box .lpn-grow .lpn-gname') || {}).textContent);
		ok('the first Contour plot row reads "Show plot"', /Show plot/.test(String(lbl)), String(lbl));
		await shot(P, 'box4-phone-contour.png');
		await P.evaluate(() => { const p = document.getElementById('lpn_contour_box'); p.style.minWidth = '0'; p.style.width = '230px'; });
		await a.settle(500);
		g = await rowsReport(P, 'lpn_contour_box');
		ok('dragged to 230 px: still two columns, no overlap', g.rows >= 4 && g.stacked === 0 && g.overlap === 0, JSON.stringify(g));
		await P.evaluate(() => { const p = document.getElementById('lpn_contour_box'); p.style.width = ''; p.style.minWidth = ''; });

		console.log('\n--- E. Settings keeps its corner resize grip on the phone ---');
		const sg = await openSettingsGrip();
		ok('Settings shows its corner grip (>= 24 px) at the bottom-right of the box', sg.shown && sg.w >= 24 && Math.abs(sg.right - sg.boxRight) <= 2 && Math.abs(sg.bottom - sg.boxBottom) <= 2, JSON.stringify(sg));

		console.log('\n--- A3. the other standard boxes, two columns at 360 px ---');
		for (const id of ['lpn_ff_box', 'lpn_crit_box', 'lpn_find_popup', 'lpn_settings_box', 'lpn_library_box', 'lpn_ds_box']) {
			await P.evaluate(() => { document.querySelectorAll('.lpn-popover-x').forEach((x) => { if (x.getBoundingClientRect().width) { x.click(); } }); });
			await openBox(a, id);
			await a.settle(900);
			g = await rowsReport(P, id);
			ok(id + ': name beside value, none overlapping', g.rows === 0 || (g.stacked === 0 && g.overlap === 0), JSON.stringify(g));
			if (SHOTS) { await P.screenshot({ path: path.join(SHOTS, 'box4-dbg-' + id + '.png') }); }
		}

		console.log('\n--- A4. Settings rows, every section open ---');
		await P.evaluate(() => { document.querySelectorAll('.lpn-popover-x').forEach((x) => { if (x.getBoundingClientRect().width) { x.click(); } }); });
		await openBox(a, 'lpn_settings_box');
		await a.settle(600);
		await P.evaluate(() => { document.querySelectorAll('#lpn_settings_box button[aria-expanded="false"], #lpn_settings_box summary, #lpn_settings_box .lpn-set-sechead').forEach((b) => { try { b.click(); } catch (e) { /* none */ } }); });
		await a.settle(900);
		const sr = await P.evaluate(() => {
			const rows = Array.from(document.querySelectorAll('#lpn_settings_box .lpn-set-row')).filter((r) => r.getBoundingClientRect().width > 0 && r.children.length >= 2);
			let stacked = 0, over = 0, bad = [];
			rows.forEach((r) => { const n = r.children[0].getBoundingClientRect(), v = r.children[1].getBoundingClientRect();
				if (v.top >= n.bottom - 1) { stacked++; bad.push(r.children[0].textContent.trim().slice(0, 24)); }
				else if (n.right > v.left + 1) { over++; bad.push('OVER ' + r.children[0].textContent.trim().slice(0, 24)); } });
			const sb = document.getElementById('lpn_settings_box').getBoundingClientRect();
			const wide = Array.from(document.querySelectorAll('#lpn_settings_box .lpn-set-row *')).filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > sb.right + 1; }).length;
			return { rows: rows.length, stacked, over, wide, bad: bad.slice(0, 6) };
		});
		ok('Settings: its rows stand name beside value, none over, nothing past the box edge', sr.rows >= 5 && sr.stacked === 0 && sr.over === 0 && sr.wide === 0, JSON.stringify(sr));
		await P.evaluate(() => { const g = document.querySelector('#lpn_settings_box .lpn-set-ctlgroup'); if (g) { g.scrollIntoView({ block: 'center' }); } });
		await a.settle(300);
		if (SHOTS) { await P.screenshot({ path: path.join(SHOTS, 'box4-dbg-settings-open.png') }); }

		console.log('\n--- D. the left-edge resize handle of an unpinned (auto-hidden) box ---');
		const gripVsText = (S) => S.page.evaluate(() => {
			const g = document.getElementById('lpn_dock_grip_right'), box = document.getElementById('lpn_contour_box');
			if (!g || !box || getComputedStyle(g).display === 'none') { return null; }
			const gr = g.getBoundingClientRect(), br = box.getBoundingClientRect();
			let overText = 0, firstLeft = 1e9;
			Array.from(box.querySelectorAll('.lpn-gname, label, input, select, button')).forEach((n) => {
				if (!n.getBoundingClientRect().width || n.closest('.lpn-setbox-title')) { return; }
				const rg = document.createRange(); rg.selectNodeContents(n);
				Array.from(rg.getClientRects()).forEach((q) => { if (q.width > 0 && q.right > gr.left && q.left < gr.right && q.bottom > gr.top && q.top < gr.bottom) { overText++; } firstLeft = Math.min(firstLeft, q.left); });
			});
			return { gripL: Math.round(gr.left), gripR: Math.round(gr.right), gripW: Math.round(gr.width), boxL: Math.round(br.left), firstText: Math.round(firstLeft), overText };
		});
		for (const dev of [{ n: 'phone', w: 390, h: 844, touch: true }, { n: 'PC', w: 1200, h: 800, touch: false }]) {
			const S = await Session.open(browser, NAME + '-' + dev.n, { viewport: { width: dev.w, height: dev.h }, hasTouch: dev.touch, isMobile: dev.touch });
			await S.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
			await S.goto('Looped-Network.php?ec_nolog=1');
			await S.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, net1);
			await S.reload();
			await S.answerTrainingPanel().catch(() => {});
			await S.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await S.settle(2500);
			await openBox(S, 'lpn_contour_box');
			await S.page.click('#lpn_contour_box .lpn-corner-btn[data-dock="right"]', { timeout: 4000 });
			await S.settle(300);
			if (!dev.touch) { await S.page.click('#lpn_contour_box .lpn-corner-btn[data-dock="autohide"]', { timeout: 4000 }); }   // a phone's docked box is always a flyout
			await S.settle(500);
			const tb = await S.page.evaluate(() => { const t = document.querySelector('#lpn_dock_strip_right .lpn-dock-tab'); const r = t.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
			if (dev.touch) { await S.page.touchscreen.tap(tb.x, tb.y); } else { await S.page.mouse.move(tb.x - 300, tb.y); await S.page.mouse.move(tb.x, tb.y, { steps: 3 }); }
			await S.settle(900);
			const gv = await gripVsText(S);
			ok(dev.n + ': the unpinned box shows its width handle', !!gv, JSON.stringify(gv));
			ok(dev.n + ': the handle lies over no label or control text', !!gv && gv.overText === 0, JSON.stringify(gv));
			ok(dev.n + ': the label text starts at or past the handle\'s inner edge', !!gv && gv.firstText >= gv.gripR - 0.5, JSON.stringify(gv));
			ok(dev.n + ': the handle is wide enough to take (>= 16 px for a finger, >= 8 px for a pointer)', !!gv && gv.gripW >= (dev.touch ? 16 : 8), JSON.stringify(gv));
			await S.close();
		}

		console.log('\n--- C. the pane edges on a phone (390 x 844, touch) ---');
		const S2 = await Session.open(browser, NAME + '-edges', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
		await S2.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await S2.goto('Looped-Network.php?ec_nolog=1');
		await S2.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); localStorage.setItem('lpn_pane', JSON.stringify({ open: true, h: 260 })); localStorage.setItem('lpn_rpane', JSON.stringify({ open: true, w: 200 })); }, net1);
		await S2.reload();
		await S2.answerTrainingPanel().catch(() => {});
		await S2.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await S2.settle(2500);
		const edges = await S2.page.evaluate(() => {
			const out = {};
			[['bottom', '.lpn-pane-grip'], ['right', '.lpn-rpane-grip']].forEach(([k, sel]) => {
				const g = document.querySelector(sel);
				if (!g || !g.getBoundingClientRect().width) { out[k] = null; return; }
				const r = g.getBoundingClientRect(), cs = getComputedStyle(g), af = getComputedStyle(g, '::after');
				const horiz = k === 'bottom';
				// What a person sees across the edge: the painted background, in the strip the grip occupies.
				out[k] = { thin: Math.round((horiz ? r.height : r.width) * 10) / 10, bg: cs.backgroundColor, afterBg: af.backgroundColor, hit: horiz ? af.height : af.width,
					x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
			});
			return out;
		});
		console.log('  ' + JSON.stringify(edges));
		ok('the bottom pane is open and its top edge is a line of 2 px or less', !!edges.bottom && edges.bottom.thin <= 2, JSON.stringify(edges.bottom));
		ok('the right pane is open and its left edge is a line of 2 px or less', !!edges.right && edges.right.thin <= 2, JSON.stringify(edges.right));
		ok('each edge has an invisible 24 px grab area', !!edges.bottom && !!edges.right && parseFloat(edges.bottom.hit) >= 24 && parseFloat(edges.right.hit) >= 24 && /rgba\(0, 0, 0, 0\)|transparent/.test(edges.bottom.afterBg + edges.right.afterBg), JSON.stringify(edges));
		if (SHOTS) { await S2.page.screenshot({ path: path.join(SHOTS, 'box4-pane-edges-phone.png') }); }
		await S2.close();

		console.log('\n--- B. a finger tap on a map Text opens Properties ---');
		const ph = await Session.open(browser, NAME + '-text', { viewport: { width: 1200, height: 800 }, hasTouch: true, isMobile: true });
		const Q = ph.page;
		await Q.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
		await ph.goto('Looped-Network.php?ec_nolog=1');
		await ph.answerTrainingPanel().catch(() => {});
		await Q.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await ph.settle(800);
		await ph.newProject('us');
		await ph.dismissGallery();
		await ph.settle(600);
		await ph.toolbarClick(await ph.lang('lpn_tool_add_text'));
		await ph.settle(300);
		const ps = await Q.evaluate(() => { const b = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: b.x + b.width * 0.5, y: b.y + b.height * 0.3 }; });
		await Q.touchscreen.tap(ps.x, ps.y);
		await ph.settle(300);
		await Q.keyboard.type('Pump station');
		await Q.keyboard.press('Control+Enter');
		await ph.settle(300);
		await Q.keyboard.press('Escape'); await Q.keyboard.press('Escape'); await ph.settle(150);
		await Q.keyboard.press('0');
		await Q.setViewportSize({ width: 390, height: 844 });
		await ph.settle(1000);
		const open = () => Q.evaluate(() => { const p = document.getElementById('lpn_popup'); return !!p && p.style.display !== 'none' && p.getBoundingClientRect().width > 0 && !!p.querySelector('textarea:not(.lpn-desc-ta)'); });
		ok('before the tap Properties is closed', !(await open()));
		const tc = await Q.evaluate(() => { const t = document.querySelector('#lpn_canvas text.lpn-lbl[data-lbl]'); const b = t.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; });
		await Q.touchscreen.tap(tc.x, tc.y);
		await ph.settle(900);
		ok('a tap on the Text opens Properties on it', await open(), JSON.stringify(tc));
		await Q.evaluate(() => { const x = document.querySelector('#lpn_popup .lpn-popover-x'); if (x) { x.click(); } });
		await ph.settle(300);
		await Q.keyboard.press('Escape'); await ph.settle(200);
		const tc2 = await Q.evaluate(() => { const t = document.querySelector('#lpn_canvas text.lpn-lbl[data-lbl]'); const b = t.getBoundingClientRect(); return { x: b.x + b.width * 0.8, y: b.y + b.height * 0.5 }; });
		await Q.touchscreen.tap(tc2.x, tc2.y);
		await ph.settle(900);
		ok('a tap near the end of the Text opens Properties too', await open(), JSON.stringify(tc2));
		await Q.evaluate(() => { const x = document.querySelector('#lpn_popup .lpn-popover-x'); if (x) { x.click(); } });
		await Q.keyboard.press('Escape'); await ph.settle(300);
		const tc3 = await Q.evaluate(() => { const t = document.querySelector('#lpn_canvas text.lpn-lbl[data-lbl]'); const b = t.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y - 6 }; });
		await Q.touchscreen.tap(tc3.x, tc3.y);
		await ph.settle(900);
		ok('a fingertip 6 px above the words (off the words, within a finger\'s error) still opens Properties', await open(), JSON.stringify(tc3));
		await ph.close();

		ok('no page error', a.errors.length === 0, a.errors.join(' | '));
		await a.close();
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
