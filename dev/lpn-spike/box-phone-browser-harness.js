// BOX DESIGN ON A PHONE (Tom and Ida, 2026-10-29), 390 x 844, touch. Run with:
//   node dev/lpn-spike/box-phone-browser-harness.js   (takes the browser lock itself)
//   1. Properties is two columns on a phone (name beside value), as on a PC, in a box that fills the screen's width;
//   2. the divider is a gridline, not a bar: no painted width over 2 px, a hit area of at least 24 px;
//   3. the hit area never lies over label text, and a tap on it passes through to the cell under it;
//   4. a finger drag on it moves the Label column;
//   5. the stacked layout (name above value) appears only when the box is narrower than 16 rem;
//   6. the pane splitters are a 1 px line with a 24 px hit area (no gray bar).
// EC_SHOTS=<dir> saves box-design-phone-props.png and box-design-phone-settings.png there.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BPH_LOCKED';
const NAME = 'box-phone-browser-harness';
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
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const net1 = fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8');
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
		const P = a.page;
		await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await P.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, net1);
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(2500);
		ok('the phone is coarse-pointer 390 px wide', await P.evaluate(() => matchMedia('(pointer: coarse)').matches && window.innerWidth === 390));
		const at = await P.evaluate(() => { const c = Array.from(document.querySelectorAll('#lpn_canvas [data-node="22"]')).filter((e) => e.getBoundingClientRect().width > 0)[0]; const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await P.touchscreen.tap(at.x, at.y);
		await a.settle(900);

		console.log('\n--- 1. Properties is two columns ---');
		const geo = () => P.evaluate(() => {
			const box = document.getElementById('lpn_popup').getBoundingClientRect();
			const rows = Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-grow')).filter((r) => r.getBoundingClientRect().width > 0 && r.querySelector('.lpn-gname') && r.querySelector('.lpn-gval'));
			const two = rows.filter((r) => { const n = r.querySelector('.lpn-gname').getBoundingClientRect(), v = r.querySelector('.lpn-gval').getBoundingClientRect(); return v.left >= n.right - 1 && Math.abs((v.top + v.height / 2) - (n.top + n.height / 2)) < n.height; });
			return { boxL: Math.round(box.left), boxW: Math.round(box.width), rows: rows.length, two: two.length };
		});
		const g1 = await geo();
		ok('the box fills the phone width less the edge (>= 370 of 390 px)', g1.boxW >= 370, JSON.stringify(g1));
		ok('at least 10 rows stand name-beside-value, and all of them do', g1.rows >= 10 && g1.two === g1.rows, JSON.stringify(g1));
		const rowH = await P.evaluate(() => { const r = Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-grow')).filter((x) => x.getBoundingClientRect().width > 0)[1]; return r.getBoundingClientRect().height; });
		ok('a row is a finger tall (>= 38 px)', rowH >= 38, String(rowH));
		if (SHOTS) { await P.screenshot({ path: path.join(SHOTS, 'box-design-phone-props.png') }); }

		console.log('\n--- 2, 3. the divider ---');
		const sp = () => P.evaluate(() => {
			const s = document.querySelector('.lpn-propbox .lpn-popover-body > .lpn-gsplit');
			if (!s) { return null; }
			const r = s.getBoundingClientRect(), cs = getComputedStyle(s), b = getComputedStyle(s, '::before');
			const painted = (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') || cs.backgroundImage !== 'none' || (b.content && b.content !== 'none' && b.content !== 'normal');
			const nm = document.querySelector('#lpn_popup_fields .lpn-gname'), nr = document.createRange();
			nr.selectNodeContents(nm);
			let overlap = 0;
			Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-gname, #lpn_popup_title .lpn-gname')).forEach((n) => {
				if (!n.getBoundingClientRect().width) { return; }
				const rg = document.createRange(); rg.selectNodeContents(n);
				Array.from(rg.getClientRects()).forEach((q) => { if (q.right > r.left + 0.5 && q.left < r.right) { overlap++; } });
			});
			return { left: r.left, right: r.right, top: r.top, w: r.width, painted: !!painted, paintedW: painted ? r.width : 0, overlap, display: cs.display, nameBorder: getComputedStyle(nm).borderInlineEndWidth };
		});
		const s0 = await sp();
		ok('the divider is present on the phone', !!s0 && s0.display === 'block', JSON.stringify(s0));
		ok('its hit area is at least 24 px wide', !!s0 && s0.w >= 24, s0 && String(s0.w));
		ok('it paints nothing itself (visible width 0; the gridline beside it is <= 2 px)', !!s0 && s0.paintedW <= 2 && parseFloat(s0.nameBorder) <= 2, JSON.stringify(s0));
		ok('no label text lies under the hit area', !!s0 && s0.overlap === 0, String(s0 && s0.overlap));

		console.log('\n--- 3b. a tap on the hit area reaches the cell under it ---');
		const tag = await P.evaluate((l) => {
			const s = document.querySelector('.lpn-propbox .lpn-popover-body > .lpn-gsplit').getBoundingClientRect();
			const r = Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-grow')).filter((x) => x.getBoundingClientRect().width > 0 && x.querySelector('input[type=text], input[type=number]'))[0];
			const i = r.querySelector('input'), q = i.getBoundingClientRect();
			i.setAttribute('data-bph', '1'); return { x: s.right - 4, y: q.top + q.height / 2, inSplit: s.right - 4 > s.left };
		});
		await P.evaluate(() => { window.__ev = []; ['pointerdown', 'pointerup', 'click'].forEach((t) => document.addEventListener(t, (e) => window.__ev.push(t + ':' + e.pointerType + ':' + (e.target.className || e.target.tagName)), true)); });
		await P.touchscreen.tap(tag.x, tag.y);
		if (process.env.EC_DBG) { console.log(JSON.stringify(await P.evaluate(() => window.__ev)), await P.evaluate(() => document.activeElement.tagName + '.' + document.activeElement.className)); }
		await a.settle(300);
		ok('the first text cell takes focus from a tap on the divider\'s hit area', await P.evaluate(() => !!document.activeElement && document.activeElement.getAttribute('data-bph') === '1'), JSON.stringify(tag));
		await P.evaluate(() => { if (document.activeElement) { document.activeElement.blur(); } });

		console.log('\n--- 4. a finger drag moves the Label column ---');
		const cdp = await P.context().newCDPSession(P);
		const nameW = () => P.evaluate(() => document.querySelector('#lpn_popup_fields .lpn-gname').getBoundingClientRect().width);
		const w0 = await nameW();
		const s1 = await sp();
		const y = s1.top + 120;
		const x0 = (s1.left + s1.right) / 2;
		await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y }] });
		for (let i = 1; i <= 6; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + i * 6, y }] }); }
		await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
		await a.settle(400);
		const w1 = await nameW();
		ok('dragging right 36 px widens the name column by about that much', w1 > w0 + 25 && w1 < w0 + 50, w0 + ' -> ' + w1);
		const s2 = await sp();
		ok('the hit area still lies clear of label text after the drag', !!s2 && s2.overlap === 0, String(s2 && s2.overlap));

		console.log('\n--- 5. stacked only under 16 rem ---');
		const stackState = (wpx) => P.evaluate((w) => {
			document.getElementById('lpn_popup').style.minWidth = '0'; document.getElementById('lpn_popup').style.width = w + 'px';
			return new Promise((res) => setTimeout(() => {
				const r = Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-grow')).filter((x) => x.getBoundingClientRect().width > 0 && x.querySelector('.lpn-gname') && x.querySelector('.lpn-gval'))[2];
				const n = r.querySelector('.lpn-gname').getBoundingClientRect(), v = r.querySelector('.lpn-gval').getBoundingClientRect();
				res({ stacked: v.top >= n.bottom - 1, bodyNarrow: document.querySelector('.lpn-propbox .lpn-popover-body').className });
			}, 500), 0);
		}, wpx);
		const st300 = await stackState(300);
		ok('at 300 px (18.75 rem) the box is still two columns', !st300.stacked, JSON.stringify(st300));
		const st200 = await stackState(200);
		ok('at 200 px (12.5 rem) the name stands above its value', st200.stacked, JSON.stringify(st200));
		await P.evaluate(() => { document.getElementById('lpn_popup').style.width = ''; });

		console.log('\n--- 6. the pane splitters ---');
		const grips = await P.evaluate(() => Array.from(document.querySelectorAll('.lpn-pane-grip, .lpn-rpane-grip')).map((g) => {
			const r = g.getBoundingClientRect(), a = getComputedStyle(g, '::after'), cs = getComputedStyle(g);
			const horiz = g.classList.contains('lpn-pane-grip');
			return { cls: g.className, thin: horiz ? r.height : r.width, hit: horiz ? parseFloat(a.height) : parseFloat(a.width), afterBg: a.backgroundColor };
		}));
		ok('there is a pane splitter to measure', grips.length > 0, JSON.stringify(grips));
		ok('every pane splitter is a line of 2 px or less with a 24 px hit area', grips.every((g) => g.thin <= 2 && g.hit >= 24 && /rgba\(0, 0, 0, 0\)|transparent/.test(g.afterBg)), JSON.stringify(grips));

		console.log('\n--- Settings ---');
		await P.evaluate(() => { const p = document.getElementById('lpn_popup'), x = p && p.querySelector('.lpn-popover-x'); if (x) { x.click(); } });
		await a.settle(300);
		await openBox(a, 'lpn_settings_box');
		await a.settle(900);
		ok('Settings is open on the phone', await P.evaluate(() => { const b = document.getElementById('lpn_settings_box'); return !!b && getComputedStyle(b).display !== 'none'; }));
		if (SHOTS) { await P.screenshot({ path: path.join(SHOTS, 'box-design-phone-settings.png') }); }
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
