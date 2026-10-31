// Box round 8 (Tom, 2026-10-30, phone): "The Properties box has an inappropriate lower width limit. Remove that limit."
//   A. FLOATING, a desktop window: the Properties box and the Find box can be dragged (mouse, the native corner) well below their old
//      floors (17 rem / 12 rem and 16 rem) and the page never scrolls sideways.
//   B. FLOATING, a 390 px touch phone: the same box, sized by the touch grip, goes below the old 17 rem phone floor.
//   C. DOCKED (EC_DEFAULT_DOCKS), a desktop window: the dock's own handle takes the Properties box below the old 240 px clamp.
//   D. a Settings box shrunk below two columns stacks its rows (label, then the control group), and the page does not scroll sideways.
// EC_SHOTS=<dir> saves boxnarrow-*.png there.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BNARROW_LOCKED';
const NAME = 'box-narrow-browser-harness';
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
	const netText = (n) => fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', n + '.lwn'), 'utf8');
	const net1 = netText('Net1');
	const shot = (S, n) => SHOTS ? S.page.screenshot({ path: path.join(SHOTS, n) }) : Promise.resolve();
	const openNet1 = async (S, docks, netName) => {
		const text = netName ? netText(netName) : net1;
		if (docks) { await S.page.addInitScript(() => { window.EC_DEFAULT_DOCKS = true; }); }
		await S.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await S.goto('Looped-Network.php?ec_nolog=1');
		await S.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, text);
		await S.reload();
		await S.answerTrainingPanel().catch(() => {});
		await S.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await S.settle(2500);
	};
	const pipeAt = (S) => S.page.evaluate(() => {
		const hits = Array.from(document.querySelectorAll('#lpn_canvas .lpn-link-hit'));
		for (const h of hits) { const r = h.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; if (x > 40 && y > 140 && x < innerWidth - 40 && y < innerHeight - 60 && document.elementFromPoint(x, y) === h) { return { x, y }; } }
		const r = hits[0].getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
	});
	// Every value control visible and wholly inside the box, the header buttons on screen, nothing scrolling sideways inside the box.
	const fitReport = (S) => S.page.evaluate(() => {
		const b = document.getElementById('lpn_popup'), br = b.getBoundingClientRect(), body = b.querySelector('.lpn-popover-body'), d = document.documentElement;
		const inside = (r) => r.left >= br.left - 1 && r.right <= br.right + 1 && r.left >= -1 && r.right <= innerWidth + 1;
		const ins = Array.from(b.querySelectorAll('#lpn_popup_fields input:not([type=hidden]), #lpn_popup_fields select, #lpn_popup_fields textarea')).filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
		const bad = ins.filter((e) => !inside(e.getBoundingClientRect()));
		const btns = Array.from(b.querySelectorAll('.lpn-box-corner button, .lpn-popover-x'));
		const badBtn = btns.filter((e) => { const r = e.getBoundingClientRect(); return !(r.width > 0) || !inside(r); });
		const t = b.querySelector('.lpn-setbox-title'), tr = t && t.getBoundingClientRect(), cr = b.querySelector('.lpn-box-corner') && b.querySelector('.lpn-box-corner').getBoundingClientRect();
		const bb = body.getBoundingClientRect(), wideEls = Array.from(body.querySelectorAll('*')).filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > bb.right + 1; }).slice(0, 4).map((e) => e.tagName + '.' + String(e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className).slice(0, 24) + '+' + Math.round(e.getBoundingClientRect().right - bb.right)).join(' ');
		return { wideEls, w: Math.round(br.width), inputs: ins.length, badInputs: bad.length, firstBad: bad[0] ? bad[0].className + ' ' + Math.round(bad[0].getBoundingClientRect().left - br.left) + '..' + Math.round(bad[0].getBoundingClientRect().right - br.left) : '', titleOverlap: (tr && cr) ? Math.max(0, Math.round((tr.right - parseFloat(getComputedStyle(t).paddingRight)) - cr.left)) : 0, btns: btns.length, badBtns: badBtn.length, bodySide: body.scrollWidth - body.clientWidth, pageX: d.scrollWidth - d.clientWidth };
	});
	const geo = (S, sel) => S.page.evaluate((s) => {
		const b = document.querySelector(s), r = b.getBoundingClientRect(), d = document.documentElement;
		return { w: Math.round(r.width), l: Math.round(r.left), r: Math.round(r.right), minW: getComputedStyle(b).minWidth, pageX: d.scrollWidth - d.clientWidth, shown: getComputedStyle(b).display !== 'none' };
	}, sel);
	try {
		console.log('--- A. floating, desktop 1280 x 800: Properties and Find shrink freely ---');
		{
			const S = await Session.open(browser, NAME + '-a', { viewport: { width: 1280, height: 800 } });
			const P = S.page;
			await openNet1(S, false);
			const at = await pipeAt(S);
			await P.mouse.click(at.x, at.y);
			await S.settle(1100);
			let g = await geo(S, '#lpn_popup');
			ok('A1. Properties opens', g.shown, JSON.stringify(g));
			// The native corner: drag it left by far more than the box is wide.
			const dragCorner = async (sel, dx) => {
				const r = await P.evaluate((s) => { const b = document.querySelector(s).getBoundingClientRect(); return { x: b.right - 6, y: b.bottom - 6 }; }, sel);
				await P.mouse.move(r.x, r.y); await P.mouse.down(); await P.mouse.move(r.x + dx / 2, r.y, { steps: 6 }); await P.mouse.move(r.x + dx, r.y, { steps: 6 }); await P.mouse.up();
				await S.settle(400);
			};
			await dragCorner('#lpn_popup', -1000);
			g = await geo(S, '#lpn_popup');
			console.log('  ' + JSON.stringify(g));
			ok('A2. Properties dragged narrower than its old 12 rem (192 px) floor', g.w < 192 && g.w >= 70, g.w + ' px');
			ok('A3. ...its min-width is no more than 5 rem', parseFloat(g.minW) <= 80, g.minW);
			ok('A4. ...the page does not scroll sideways', g.pageX <= 0, String(g.pageX));
			await shot(S, 'boxnarrow-properties.png');
			await P.keyboard.press('Escape'); await S.settle(300);
			await S.menuClick(await S.lang('lpn_find_menu'), 'edit');
			await S.settle(900);
			await dragCorner('#lpn_find_popup', -1000);
			g = await geo(S, '#lpn_find_popup');
			console.log('  ' + JSON.stringify(g));
			ok('A5. Find dragged narrower than its old 16 rem (256 px) floor', g.w < 256 && g.w >= 70, g.w + ' px');
			ok('A6. ...the page does not scroll sideways', g.pageX <= 0, String(g.pageX));
			ok('A7. no page error', S.errors.length === 0, S.errors.join(' | '));
			await S.close();
		}

		console.log('\n--- B. docked, 390 px phone: a finger on the dock handle goes below the old 17 rem (272 px) floor ---');
		{
			const S = await Session.open(browser, NAME + '-b', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
			const P = S.page;
			await openNet1(S, true);
			const at = await pipeAt(S);
			await P.touchscreen.tap(at.x, at.y);
			await S.settle(1200);
			let g = await geo(S, '#lpn_popup');
			ok('B1. Properties opens', g.shown, JSON.stringify(g));
			ok('B2. ...and its min-width is no more than 5 rem', parseFloat(g.minW) <= 80, g.minW);
			const h = await P.evaluate(() => {
				const e = ['right', 'left'].map((k) => document.getElementById('lpn_dock_grip_' + k)).filter((x) => x && getComputedStyle(x).display !== 'none')[0];
				if (!e) { return null; }
				const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, id: e.id };
			});
			ok('B3. the dock handle exists', !!h, JSON.stringify(h));
			if (h) {
				const sign = h.id === 'lpn_dock_grip_right' ? 1 : -1;
				const cdp = await S.context.newCDPSession(P);
				const touch = async (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
				await touch('touchStart', h.x, h.y);
				for (let i = 1; i <= 20; i++) { await touch('touchMove', h.x + sign * i * 15, h.y); }
				await touch('touchEnd', 0, 0);
				await S.settle(600);
				g = await geo(S, '#lpn_popup');
				console.log('  ' + JSON.stringify(g) + ' ' + h.id);
				ok('B4. dragged below 272 px', g.w < 272 && g.w >= 70, g.w + ' px');
				ok('B5. ...the page does not scroll sideways', g.pageX <= 0, String(g.pageX));
				await shot(S, 'boxnarrow-properties-phone.png');
			}
			ok('B6. no page error', S.errors.length === 0, S.errors.join(' | '));
			await S.close();
		}

		console.log('\n--- C. docked, desktop 1280 x 800: the dock handle goes below 240 px ---');
		{
			const S = await Session.open(browser, NAME + '-c', { viewport: { width: 1280, height: 800 } });
			const P = S.page;
			await openNet1(S, true);
			const at = await pipeAt(S);
			await P.mouse.click(at.x, at.y);
			await S.settle(1200);
			let g = await geo(S, '#lpn_popup');
			ok('C1. Properties opens docked', g.shown, JSON.stringify(g));
			const h = await P.evaluate(() => {
				const e = ['right', 'left'].map((k) => document.getElementById('lpn_dock_grip_' + k)).filter((x) => x && getComputedStyle(x).display !== 'none')[0];
				if (!e) { return null; }
				const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, id: e.id };
			});
			ok('C2. the dock handle exists', !!h, JSON.stringify(h));
			if (h) {
				const dir = h.id === 'lpn_dock_grip_left' ? -1 : 1;   // the grip of a left dock sits on its right edge: dragging it left narrows
				const sign = h.id === 'lpn_dock_grip_right' ? 1 : -1;
				await P.mouse.move(h.x, h.y); await P.mouse.down();
				for (let i = 1; i <= 24; i++) { await P.mouse.move(h.x + sign * i * 20, h.y); }
				await P.mouse.up();
				await S.settle(600);
				g = await geo(S, '#lpn_popup');
				console.log('  ' + JSON.stringify(g) + ' ' + h.id + ' ' + dir);
				ok('C3. docked width is below the old 240 px clamp', g.w < 240 && g.w >= 70, g.w + ' px');
				ok('C4. ...the page does not scroll sideways', g.pageX <= 0, String(g.pageX));
				await shot(S, 'boxnarrow-docked.png');
			}
			ok('C5. no page error', S.errors.length === 0, S.errors.join(' | '));
			await S.close();
		}

		console.log('\n--- E. Properties at 180, 150, 120, 100 and 80 px: every value visible in the box, header buttons on screen, no sideways scroll ---');
		for (const net of ['Net1', 'Net3']) {
			for (const mode of ['PC floating', 'phone docked']) {
				const phone = mode === 'phone docked';
				const S = await Session.open(browser, NAME + '-e', phone ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } : { viewport: { width: 1280, height: 800 } });
				const P = S.page;
				await openNet1(S, phone, net);
				const at = await pipeAt(S);
				if (phone) { await P.touchscreen.tap(at.x, at.y); } else { await P.mouse.click(at.x, at.y); }
				await S.settle(1300);
				ok('E. ' + net + ' ' + mode + ': Properties opens', (await geo(S, '#lpn_popup')).shown);
				for (const target of [180, 150, 120, 100, 80]) {
					if (phone) {
						const h = await P.evaluate(() => { const e = document.getElementById('lpn_dock_grip_right'); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
						const cur = (await geo(S, '#lpn_popup')).w;
						const cdp = await S.context.newCDPSession(P);
						const touch = async (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
						await touch('touchStart', h.x, h.y);
						for (let k = 1; k <= 10; k++) { await touch('touchMove', h.x + (cur - target) * k / 10, h.y); }
						await touch('touchEnd', 0, 0);
					} else {
						await P.evaluate((w) => document.getElementById('lpn_popup').style.setProperty('width', w + 'px', 'important'), target);
					}
					await S.settle(500);
					const f = await fitReport(S);
					console.log('  ' + net + ' ' + mode + ' ' + target + ' ' + JSON.stringify(f));
					ok('E. ' + net + ' ' + mode + ' ' + target + ' px: box is ' + target + ' wide', Math.abs(f.w - target) <= 3, String(f.w));
					ok('E. ' + net + ' ' + mode + ' ' + target + ' px: all ' + f.inputs + ' value controls wholly inside the box', f.inputs > 0 && f.badInputs === 0, f.badInputs + ' outside; first ' + f.firstBad);
					ok('E. ' + net + ' ' + mode + ' ' + target + ' px: ' + f.btns + ' header buttons on screen', f.btns >= 2 && f.badBtns === 0, f.badBtns + ' off');
					ok('E. ' + net + ' ' + mode + ' ' + target + ' px: the title stops before the header buttons', f.titleOverlap <= 1, f.titleOverlap + ' px over');
					ok('E. ' + net + ' ' + mode + ' ' + target + ' px: no sideways scroll in the box or the page', f.bodySide <= 1 && f.pageX <= 0, f.bodySide + ' / ' + f.pageX);
					if (target === 100) { await shot(S, 'boxnarrow-e-' + net + '-' + (phone ? 'phone' : 'pc') + '.png'); }
				}
				ok('E. ' + net + ' ' + mode + ': no page error', S.errors.length === 0, S.errors.join(' | '));
				await S.close();
			}
		}

		console.log('\n--- F. a phone floating Properties box is wholly on screen and can be shrunk by finger (390 and 320) ---');
		for (const vw of [390, 320]) {
			const S = await Session.open(browser, NAME + '-f' + vw, { viewport: { width: vw, height: 740 }, hasTouch: true, isMobile: true });
			const P = S.page;
			await openNet1(S, true);
			const at = await pipeAt(S);
			await P.touchscreen.tap(at.x, at.y);
			await S.settle(1300);
			await P.evaluate(() => { const b = document.querySelector('#lpn_popup .lpn-corner-btn[data-dock="float"]'); if (b) { b.click(); } });
			await S.settle(700);
			let g = await P.evaluate(() => { const b = document.getElementById('lpn_popup'), r = b.getBoundingClientRect(); return { l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom), vw: innerWidth, vh: innerHeight, docked: b.classList.contains('lpn-docked') }; });
			console.log('  ' + vw + ' floated ' + JSON.stringify(g));
			ok('F. ' + vw + ': Float leaves the box floating', !g.docked);
			ok('F. ' + vw + ': floated box wholly on screen', g.l >= 0 && g.r <= g.vw && g.t >= 0 && g.b <= g.vh + 1, JSON.stringify(g));
			let ff = await fitReport(S);
			ok('F. ' + vw + ': its header buttons are all on screen', ff.btns >= 2 && ff.badBtns === 0, ff.badBtns + ' off');
			const grip = await P.evaluate(() => { const e = document.querySelector('#lpn_popup .lpn-resize-grip'); if (!e || getComputedStyle(e).display === 'none') { return null; } const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
			console.log('  grip ' + JSON.stringify(await P.evaluate(() => { const e = document.querySelector('#lpn_popup .lpn-resize-grip'); const pp = document.getElementById('lpn_popup'); return [e ? getComputedStyle(e).display : null, getComputedStyle(pp).resize, Array.from(pp.children).map((c) => c.className).join(','), matchMedia('(any-pointer: coarse)').matches]; })));
			ok('F. ' + vw + ': it has a touch resize grip', !!grip);
			if (grip) {
				const cdp = await S.context.newCDPSession(P);
				const touch = async (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
				await touch('touchStart', grip.x, grip.y);
				for (let k = 1; k <= 12; k++) { await touch('touchMove', grip.x - (g.r - g.l - 130) * k / 12, grip.y); }
				await touch('touchEnd', 0, 0);
				await S.settle(500);
				ff = await fitReport(S);
				console.log('  ' + vw + ' shrunk ' + JSON.stringify(ff));
				ok('F. ' + vw + ': the grip shrinks it to about 130 px', ff.w <= 140 && ff.w >= 80, String(ff.w));
				ok('F. ' + vw + ': shrunk, every value is in the box and the buttons are on screen', ff.badInputs === 0 && ff.badBtns === 0, ff.badInputs + ' inputs, ' + ff.badBtns + ' buttons off');
				ok('F. ' + vw + ': ...and nothing scrolls sideways', ff.bodySide <= 1 && ff.pageX <= 0, ff.bodySide + ' / ' + ff.pageX);
			}
			// The window changes (a turn): the floating box is pulled back on screen.
			await P.setViewportSize({ width: 240, height: 740 });
			await S.settle(600);
			g = await P.evaluate(() => { const r = document.getElementById('lpn_popup').getBoundingClientRect(); return { l: Math.round(r.left), r: Math.round(r.right), vw: innerWidth }; });
			ok('F. ' + vw + ': a window narrowed to 240 px keeps the box wholly on screen', g.l >= 0 && g.r <= g.vw + 1, JSON.stringify(g));
			ok('F. ' + vw + ': no page error', S.errors.length === 0, S.errors.join(' | '));
			await S.close();
		}

		console.log('\n--- D. Settings shrunk below two columns stacks its rows ---');
		{
			const S = await Session.open(browser, NAME + '-d', { viewport: { width: 1280, height: 800 } });
			const P = S.page;
			await openNet1(S, false);
			await S.menuClick(await S.lang('lpn_tool_settings'), 'project');
			await S.settle(900);
			await P.evaluate(() => { const b = document.getElementById('lpn_settings_box'); b.style.width = '12rem'; });
			await S.settle(500);
			const m = await P.evaluate(() => {
				const b = document.getElementById('lpn_settings_box'), c = document.getElementById('lpn_setbox_content'), d = document.documentElement;
				const rows = Array.from(c.querySelectorAll('.lpn-set-row')).filter((r) => r.getBoundingClientRect().width > 0);
				const two = rows.filter((r) => getComputedStyle(r).gridTemplateColumns.split(' ').length > 1).length;
				return { w: Math.round(b.getBoundingClientRect().width), rows: rows.length, two, pageX: d.scrollWidth - d.clientWidth, minW: getComputedStyle(b).minWidth };
			});
			console.log('  ' + JSON.stringify(m));
			ok('D1. Settings honours a 12 rem width (old floor 25 rem)', m.w < 250, m.w + ' px');
			ok('D2. its rows are stacked (one column)', m.rows > 0 && m.two === 0, m.two + ' of ' + m.rows + ' still two columns');
			ok('D3. the page does not scroll sideways', m.pageX <= 0, String(m.pageX));
			await shot(S, 'boxnarrow-settings.png');
			ok('D4. no page error', S.errors.length === 0, S.errors.join(' | '));
			await S.close();
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + ' of ' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
