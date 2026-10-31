// Box round 9 (Tom, 2026-10-30, round-8 phone and PC pass: "Give the user control."), at PC 1366x768 and phone 390x844:
//   A. Properties: the Label column drags to near zero, by mouse and by finger; labels are one line, clipped with an ellipsis, and a cut label carries its full text as its tip.
//   B. No stacking: at 100 px every row keeps its label and its value side by side (the label left of the value, in one band), and no grid is marked narrow.
//   C. Multi-selection Properties (Net1, a Select area over everything): each section is its own two-column block, stacked one after another (section boxes do not overlap, each
//      row's label and value share a band), under the one divider, which drags by mouse and by finger and moves every section's Label column together.
//   D. Find and replace and Fire flow use the global style at every width (a sheet grid, the divider, no narrow class), and the Fire flow Label | Value divider drags.
//   E. Settings: its name column has no floor either, and its names clip on one line.
// EC_SHOTS=<dir> saves boxr9-*.png there.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BR9_LOCKED';
const NAME = 'box-round9-browser-harness';
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
	const MODES = [['PC', { viewport: { width: 1366, height: 768 } }], ['phone', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }]];
	const netTexts = {};
	const netText = (n) => (netTexts[n] = netTexts[n] || fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', n + '.lwn'), 'utf8'));
	const open = async (S, netName) => {
		await S.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await S.goto('Looped-Network.php?ec_nolog=1');
		await S.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, netName ? netText(netName) : net1);
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
	const tapAt = async (S, phone, at) => { if (phone) { await S.page.touchscreen.tap(at.x, at.y); } else { await S.page.mouse.click(at.x, at.y); } };
	const setWidth = (S, sel, w) => S.page.evaluate((a) => { const b = document.querySelector(a.sel); b.style.setProperty('width', a.w + 'px', 'important'); b.style.setProperty('max-width', 'none', 'important'); b.style.setProperty('left', '4px', 'important'); }, { sel, w });
	// The divider: its centre (it runs the height of the box's rows).
	const splitAt = (S, sel) => S.page.evaluate((s) => {
		const b = document.querySelector(s), g = b.querySelector('.lpn-gsplit'); if (!g) { return null; }
		const r = g.getBoundingClientRect(), br = b.getBoundingClientRect();
		return { x: r.left + r.width / 2, y: Math.min(Math.max(r.top + Math.min(r.height / 2, 60), br.top + 70), br.bottom - 20), w: r.width, h: r.height };
	}, sel);
	const drag = async (S, phone, from, dx) => {
		const P = S.page;
		if (phone) {
			const cdp = await S.context.newCDPSession(P);
			const touch = async (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
			await touch('touchStart', from.x, from.y);
			for (let i = 1; i <= 14; i++) { await touch('touchMove', from.x + dx * i / 14, from.y); }
			await touch('touchEnd', 0, 0);
			await cdp.detach().catch(() => {});
		} else {
			await P.mouse.move(from.x, from.y); await P.mouse.down(); await P.mouse.move(from.x + dx / 2, from.y, { steps: 6 }); await P.mouse.move(from.x + dx, from.y, { steps: 6 }); await P.mouse.up();
		}
		await S.settle(600);
	};
	// First label of a box: its width, style and title; and the widest label that has been cut.
	const labelsOf = (S, sel) => S.page.evaluate((s) => {
		const b = document.querySelector(s), names = Array.from(b.querySelectorAll('.lpn-gname')).filter((e) => e.getBoundingClientRect().height > 0);
		const bad = names.filter((n) => { const cs = getComputedStyle(n); return cs.whiteSpace !== 'nowrap' || cs.textOverflow !== 'ellipsis' || cs.overflow !== 'hidden'; }).length;
		const tall = names.filter((n) => n.getBoundingClientRect().height > 40).length;
		const cut = names.filter((n) => n.scrollWidth > n.clientWidth + 1);
		const cutNoTitle = cut.filter((n) => { const t = (n.textContent || '').replace(/\s*\?\s*$/, '').replace(/\s+/g, ' ').trim(); return ((n.getAttribute('data-bs-original-title') || n.title || '').indexOf(t) !== 0); });
		const w = names.length ? Math.max.apply(null, names.map((n) => n.getBoundingClientRect().width)) : 0;
		return { n: names.length, bad, tall, cut: cut.length, cutNoTitle: cutNoTitle.length, ex: cutNoTitle[0] ? (cutNoTitle[0].textContent || '').trim().slice(0, 30) + ' | ' + (cutNoTitle[0].getAttribute('data-bs-original-title') || cutNoTitle[0].title) : '', maxW: Math.round(w) };
	}, sel);
	// Every row: the label left of the value, the two in one band, and no label or value over another.
	const rowsOf = (S, sel) => S.page.evaluate((s) => {
		const b = document.querySelector(s); let rows = 0, split = 0, over = 0, ex = '';
		const cells = [];
		Array.from(b.querySelectorAll('.lpn-grow:not(.lpn-gspan-row)')).forEach((r) => {
			const n = r.querySelector(':scope > .lpn-gname'), v = r.querySelector(':scope > .lpn-gval');
			if (!n || !v) { return; }
			const a = n.getBoundingClientRect(), c = v.getBoundingClientRect();
			if (!(a.height > 0) || !(c.height > 0)) { return; }
			rows++;
			if (c.left < a.left - 1 || Math.abs((a.top + a.height / 2) - (c.top + c.height / 2)) > Math.max(a.height, c.height)) { split++; }
			cells.push(a, c);
		});
		for (let i = 0; i < cells.length; i++) for (let j = i + 1; j < cells.length; j++) {
			const x = Math.min(cells[i].right, cells[j].right) - Math.max(cells[i].left, cells[j].left), y = Math.min(cells[i].bottom, cells[j].bottom) - Math.max(cells[i].top, cells[j].top);
			if (x > 1 && y > 1) { over++; if (!ex) { ex = Math.round(x) + 'x' + Math.round(y); } }
		}
		return { rows, notSideBySide: split, overlaps: over, ex, narrow: b.querySelectorAll('.lpn-gnarrow').length, pageX: document.documentElement.scrollWidth - document.documentElement.clientWidth };
	}, sel);
	const nameColW = (S, sel) => S.page.evaluate((s) => { const n = Array.from(document.querySelector(s).querySelectorAll('.lpn-gname')).find((e) => e.getBoundingClientRect().height > 0); return n ? Math.round(n.getBoundingClientRect().width * 10) / 10 : -1; }, sel);

	try {
		for (const [mode, ctx] of MODES) {
			const phone = mode === 'phone';
			console.log('\n=== ' + mode + ' ' + ctx.viewport.width + 'x' + ctx.viewport.height + ' ===');
			console.log('--- A and B. one element\'s Properties ---');
			{
				const S = await Session.open(browser, NAME + '-a-' + mode, ctx);
				await open(S);
				await tapAt(S, phone, await pipeAt(S));
				await S.settle(1300);
				ok(mode + ' A1. Properties opens', await S.page.evaluate(() => getComputedStyle(document.getElementById('lpn_popup')).display !== 'none'));
				const l0 = await labelsOf(S, '#lpn_popup');
				ok(mode + ' A1b. at first open every cut label already carries its full text as its tip (no hover)', l0.n > 5 && l0.cutNoTitle === 0, JSON.stringify(l0));
				await setWidth(S, '#lpn_popup', 330);
				await S.settle(500);
				let sp = await splitAt(S, '#lpn_popup');
				ok(mode + ' A2. the divider is there', !!sp, JSON.stringify(sp));
				const w0 = await nameColW(S, '#lpn_popup');
				await drag(S, phone, sp, -400);
				const w1 = await nameColW(S, '#lpn_popup');
				ok(mode + ' A3. the Label column drags to near zero (was ' + w0 + ' px)', w1 >= 0 && w1 <= 8 && w0 > 60, w0 + ' -> ' + w1 + ' px');
				const l1 = await labelsOf(S, '#lpn_popup');
				ok(mode + ' A4. every label is one line, clipped with an ellipsis, never wrapped', l1.n > 5 && l1.bad === 0 && l1.tall === 0, JSON.stringify(l1));
				ok(mode + ' A5. every label the column cuts carries its full text as its tip', l1.cut > 5 && l1.cutNoTitle === 0, l1.cut + ' cut; ' + l1.ex);
				const r1 = await rowsOf(S, '#lpn_popup');
				ok(mode + ' A6. at that width every value is still beside its label, nothing over anything', r1.rows > 5 && r1.notSideBySide === 0 && r1.overlaps === 0 && r1.pageX <= 0, JSON.stringify(r1));
				await shot(S, 'boxr9-a-' + mode + '.png');
				sp = await splitAt(S, '#lpn_popup');
				await drag(S, phone, sp, 150);
				const w2 = await nameColW(S, '#lpn_popup');
				ok(mode + ' A7. and drags back out', w2 > 60, w2 + ' px');
				for (const w of [160, 100]) {
					await setWidth(S, '#lpn_popup', w);
					await S.settle(600);
					const r = await rowsOf(S, '#lpn_popup'), l = await labelsOf(S, '#lpn_popup');
					console.log('  ' + w + ' px ' + JSON.stringify(r) + ' ' + JSON.stringify(l));
					ok(mode + ' B. ' + w + ' px: two columns (no stacking): ' + r.rows + ' rows, label beside value, no narrow class', r.rows > 5 && r.notSideBySide === 0 && r.narrow === 0, JSON.stringify(r));
					ok(mode + ' B. ' + w + ' px: nothing over anything, no sideways scroll', r.overlaps === 0 && r.pageX <= 0, JSON.stringify(r));
					ok(mode + ' B. ' + w + ' px: labels clipped, not wrapped', l.bad === 0 && l.tall === 0, JSON.stringify(l));
				}
				await shot(S, 'boxr9-b-' + mode + '.png');
				ok(mode + ' A8. no page error', S.errors.length === 0, S.errors.join(' | '));
				await S.close();
			}

			console.log('--- C. multi-selection Properties ---');
			{
				const S = await Session.open(browser, NAME + '-c-' + mode, ctx);
				const P = S.page;
				await open(S);
				await P.keyboard.press('a'); await S.settle(300);
				await P.evaluate(() => { const h = document.getElementById('lpn_area_hint'); if (h) { const b = h.querySelector('button'); if (b) { b.click(); } } });
				await S.settle(300);
				const vp = P.viewportSize();
				await P.mouse.move(20, 180); await P.mouse.down(); await P.mouse.move(vp.width / 2, vp.height / 2, { steps: 5 }); await P.mouse.move(vp.width - 20, vp.height - 80, { steps: 5 }); await P.mouse.up();
				await S.settle(1300);
				const n = await P.evaluate(() => document.querySelectorAll('#lpn_popup .lpn-multi-section').length);
				const lm0 = await labelsOf(S, '#lpn_popup');
				ok(mode + ' C1b. at first open every cut label in the multi box carries its full text as its tip', lm0.n > 5 && lm0.cutNoTitle === 0, JSON.stringify(lm0));
				ok(mode + ' C1. a Select area over Net1 opens the multi-selection box with several sections', n >= 3, String(n));
				for (const w of [315, 200, 120]) {
					await setWidth(S, '#lpn_popup', w);
					await S.settle(700);
					const m = await P.evaluate(() => {
						const secs = Array.from(document.querySelectorAll('#lpn_popup .lpn-multi-section')).filter((s) => s.getBoundingClientRect().height > 0), r = secs.map((s) => s.getBoundingClientRect());
						let overlap = 0; for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) { if (Math.min(r[i].bottom, r[j].bottom) - Math.max(r[i].top, r[j].top) > 1) { overlap++; } }
						const stacked = r.every((x, i) => i === 0 || x.top >= r[i - 1].bottom - 1);
						const sheet = secs.filter((s) => s.querySelector('.lpn-grow')).length, inSheet = !!document.querySelector('#lpn_popup .lpn-sheet'), sp = !!document.querySelector('#lpn_popup .lpn-gsplit');
						const nameLeft = secs.map((s) => { const e = s.querySelector('.lpn-gname'); return e ? Math.round(e.getBoundingClientRect().left) : null; }).filter((x) => x !== null);
						const valLeft = secs.map((s) => { const e = s.querySelector('.lpn-grow > .lpn-gval'); return e ? Math.round(e.getBoundingClientRect().left) : null; }).filter((x) => x !== null);
						const same = (a) => a.every((x) => Math.abs(x - a[0]) <= 1);
						return { sections: secs.length, overlap, stacked, withRows: sheet, inSheet, split: sp, labelXsAlign: same(nameLeft), valueXsAlign: same(valLeft) };
					});
					const rr = await rowsOf(S, '#lpn_popup'), ll = await labelsOf(S, '#lpn_popup');
					console.log('  ' + w + ' px ' + JSON.stringify(m) + ' ' + JSON.stringify(rr));
					ok(mode + ' C. ' + w + ' px: no two sections share a vertical band; each starts below the one before', m.sections >= 3 && m.overlap === 0 && m.stacked, JSON.stringify(m));
					ok(mode + ' C. ' + w + ' px: every row\'s label and value are in one band, nothing overlaps', rr.rows > 10 && rr.notSideBySide === 0 && rr.overlaps === 0 && rr.pageX <= 0, JSON.stringify(rr));
					ok(mode + ' C. ' + w + ' px: the sections share one Label column and one Value column', m.labelXsAlign && m.valueXsAlign, JSON.stringify(m));
					ok(mode + ' C. ' + w + ' px: global style (sheet grid with the divider), labels clipped on one line, every cut one tipped', m.inSheet && m.split && ll.bad === 0 && ll.tall === 0 && ll.cutNoTitle === 0, JSON.stringify(ll));
					if (w === 315) { await shot(S, 'boxr9-c-' + mode + '.png'); }
				}
				await setWidth(S, '#lpn_popup', 315);
				await S.settle(600);
				const sp = await splitAt(S, '#lpn_popup');
				ok(mode + ' C2. the divider is there' + (phone ? ' with a finger-size hit area' : ''), !!sp && (!phone || sp.w >= 20), JSON.stringify(sp));
				const colsX = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup .lpn-multi-section')).filter((s) => s.getBoundingClientRect().height > 0).map((s) => { const e = s.querySelector('.lpn-grow > .lpn-gval'); return e ? Math.round(e.getBoundingClientRect().left) : null; }).filter((x) => x !== null));
				const before = await colsX();
				await drag(S, phone, sp, -90);
				const after = await colsX();
				ok(mode + ' C3. dragging the divider moves every section\'s Value column together (' + before[0] + ' -> ' + after[0] + ')', after.length >= 3 && after.every((x) => Math.abs(x - after[0]) <= 1) && after[0] < before[0] - 40, JSON.stringify([before, after]));
				const sp2 = await splitAt(S, '#lpn_popup');
				await drag(S, phone, sp2, -500);
				const w = await nameColW(S, '#lpn_popup');
				ok(mode + ' C4. ...and takes the Label column to near zero', w >= 0 && w <= 8, String(w));
				ok(mode + ' C5. no page error', S.errors.length === 0, S.errors.join(' | '));
				await S.close();
			}

			console.log('--- D. Find and replace, Fire flow ---');
			for (const [what, sel, door, hostSel] of [
				['Find', '#lpn_find_popup', async (S) => { await S.menuClick(await S.lang('lpn_find_menu'), 'edit'); }, '#lpn_find_popup .lpn-gridhost'],
				['Fire flow', '#lpn_ff_box', async (S) => { await S.menuClickSub(await S.lang('lpn_analyze_menu'), await S.lang('lpn_ff_menu'), 'project'); }, '#lpn_ff_box .lpn-gridhost']]) {
				const S = await Session.open(browser, NAME + '-d-' + mode, ctx);
				await open(S);
				await door(S);
				await S.settle(1100);
				ok(mode + ' D. ' + what + ': opens', await S.page.evaluate((s) => { const b = document.querySelector(s); return !!b && getComputedStyle(b).display !== 'none'; }, sel));
				const ld0 = await labelsOf(S, sel);
				ok(mode + ' D. ' + what + ': at first open every cut label carries its full text as its tip (no hover)', ld0.n > 3 && ld0.cutNoTitle === 0, JSON.stringify(ld0));
				for (const w of [300, 150, 100]) {
					await setWidth(S, sel, w);
					await S.settle(600);
					const g = await S.page.evaluate((h) => { const e = document.querySelector(h); return { sheet: e.classList.contains('lpn-sheet'), narrow: e.classList.contains('lpn-gnarrow'), split: !!e.querySelector('.lpn-gsplit'), rows: e.querySelectorAll('.lpn-grow').length, hdr: getComputedStyle(e).display }; }, hostSel);
					const r = await rowsOf(S, sel), l = await labelsOf(S, sel);
					ok(mode + ' D. ' + what + ' ' + w + ' px: the global box style (sheet grid, divider, two columns)', g.sheet && !g.narrow && g.split && g.rows >= 4 && r.notSideBySide === 0 && r.narrow === 0, JSON.stringify([g, r]));
					ok(mode + ' D. ' + what + ' ' + w + ' px: labels one line with an ellipsis, every cut one tipped, nothing over anything', l.bad === 0 && l.tall === 0 && l.cutNoTitle === 0 && r.overlaps === 0, JSON.stringify([l, r.overlaps]));
				}
				await setWidth(S, sel, 380);
				await S.settle(600);
				const sp = await splitAt(S, sel);
				const w0 = await nameColW(S, sel);
				ok(mode + ' D. ' + what + ': the divider is there', !!sp, JSON.stringify(sp));
				if (sp) {
					await drag(S, phone, sp, -70);
					const w1 = await nameColW(S, sel);
					ok(mode + ' D. ' + what + ': the Label column drags narrower (' + w0 + ' -> ' + w1 + ' px)', w1 < w0 - 30, w0 + ' -> ' + w1);
					const sp3 = await splitAt(S, sel);
					await drag(S, phone, sp3, 60);
					const w2 = await nameColW(S, sel);
					ok(mode + ' D. ' + what + ': ...and wider again (' + w2 + ' px)', w2 > w1 + 30, w1 + ' -> ' + w2);
					const sp4 = await splitAt(S, sel);
					await drag(S, phone, sp4, -600);
					const w3 = await nameColW(S, sel);
					ok(mode + ' D. ' + what + ': ...and to near zero', w3 >= 0 && w3 <= 8, String(w3));
				}
				if (what === 'Fire flow') { await shot(S, 'boxr9-ff-' + mode + '.png'); }
				ok(mode + ' D. ' + what + ': no page error', S.errors.length === 0, S.errors.join(' | '));
				await S.close();
			}

			console.log('--- F. multi-selection opens with the label width and the `?` markers single Properties has ---');
			for (const netName of ['Net1', 'Net3']) {
				const S = await Session.open(browser, NAME + '-f-' + mode, ctx);
				const P = S.page;
				await open(S, netName);
				// Single Properties of a sample of elements, one per distinct label list: the Label column's width and which labels carry a `?`.
				const singles = new Map();
				for (const kind of ['node-junction', 'node-reservoir', 'node-tank', 'link-pipe', 'link-pump', 'link-valve']) {
					const cands = await P.evaluate((o) => Array.from(document.querySelectorAll('#lpn_canvas .lpn-' + o.k)).map((e) => {
						let r = e.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
						if (e.tagName === 'polyline' && e.points && e.points.length > 1 && e.getScreenCTM) { const a = e.points[0], c = e.points[1], m = e.getScreenCTM(); const p = e.ownerSVGElement.createSVGPoint(); p.x = (a.x + c.x) / 2; p.y = (a.y + c.y) / 2; const q = p.matrixTransform(m); x = q.x; y = q.y; }
						return { x, y, ok: x > 10 && y > 150 && x < innerWidth - o.lim && y < innerHeight - 70 };
					}).filter((c) => c.ok).slice(0, 8), { k: kind, lim: phone ? 20 : 400 });
					for (const q of cands) {
						await P.mouse.click(q.x, q.y); await S.settle(500);
						const one = await P.evaluate(() => {
							const b = document.getElementById('lpn_popup'); if (!b || getComputedStyle(b).display === 'none' || b.querySelector('.lpn-multi-section')) { return null; }
							const names = Array.from(b.querySelectorAll('#lpn_popup_fields .lpn-gname')).filter((n) => n.getBoundingClientRect().height > 0);
							const lab = (n) => (n.textContent || '').replace(/\s*\?\s*$/, '').replace(/\s+/g, ' ').trim();
							return { w: names.length ? names[0].getBoundingClientRect().width : 0, labels: names.map(lab), tipped: names.filter((n) => n.querySelector('.ec-tip') || n.classList.contains('ec-help')).map(lab) };
						});
						if (one && one.labels.length) { singles.set(kind, one); break; }
					}
				}
				const sing = Array.from(singles.values());
				await P.keyboard.press('Escape'); await S.settle(300);
				await P.keyboard.press('a'); await S.settle(300);
				await P.evaluate(() => { const h = document.getElementById('lpn_area_hint'); if (h) { const b = h.querySelector('button'); if (b) { b.click(); } } });
				await S.settle(300);
				const vp = P.viewportSize();
				await P.mouse.move(20, 180); await P.mouse.down(); await P.mouse.move(vp.width / 2, vp.height / 2, { steps: 5 }); await P.mouse.move(vp.width - 20, vp.height - 80, { steps: 5 }); await P.mouse.up();
				await S.settle(1500);
				const multi = await P.evaluate(() => {
					const b = document.getElementById('lpn_popup');
					const names = Array.from(b.querySelectorAll('.lpn-multi-section .lpn-gname')).filter((n) => n.getBoundingClientRect().height > 0);
					const lab = (n) => (n.textContent || '').replace(/\s*\?\s*$/, '').replace(/\s+/g, ' ').trim();
					return { w: names.length ? names[0].getBoundingClientRect().width : 0, sections: b.querySelectorAll('.lpn-multi-section').length, tipped: names.filter((n) => n.querySelector('.ec-tip') || n.classList.contains('ec-help')).map(lab), all: names.map(lab) };
				});
				const maxSingle = Math.max.apply(null, sing.map((x) => x.w));
				console.log('  ' + netName + ' ' + mode + ': single label widths ' + JSON.stringify(sing.map((x) => Math.round(x.w))) + ', multi ' + Math.round(multi.w) + ', ' + sing.length + ' singles sampled, ' + multi.sections + ' sections');
				ok(mode + ' F. ' + netName + ': ' + sing.length + ' kinds of element opened singly', sing.length >= 3, Array.from(singles.keys()).join(','));
				ok(mode + ' F. ' + netName + ': multi\'s first Label column (' + Math.round(multi.w) + ' px) matches the widest single fit (' + Math.round(maxSingle) + ' px): at least it, and at most 12 px more (the Text section is not sampled singly)', multi.w >= maxSingle - 6 && multi.w <= maxSingle + 12, multi.w + ' vs ' + maxSingle);
				const needTip = new Set(); sing.forEach((x) => x.tipped.forEach((t) => { if (multi.all.indexOf(t) >= 0) { needTip.add(t); } }));
				const missing = Array.from(needTip).filter((t) => multi.tipped.indexOf(t) < 0);
				ok(mode + ' F. ' + netName + ': every label single Properties marks with a `?` (' + needTip.size + ') is marked in multi too', needTip.size >= 3 && missing.length === 0, 'missing: ' + JSON.stringify(missing));
				ok(mode + ' F. ' + netName + ': no page error', S.errors.length === 0, S.errors.join(' | '));
				await S.close();
			}

			console.log('--- E. Settings ---');
			{
				const S = await Session.open(browser, NAME + '-e-' + mode, ctx);
				await open(S);
				await S.menuClick(await S.lang('lpn_tool_settings'), 'project');
				await S.settle(1000);
				await S.page.evaluate(() => { document.getElementById('lpn_settings_box').style.width = '12rem'; });
				await S.settle(600);
				const m = await S.page.evaluate(() => {
					const c = document.getElementById('lpn_setbox_content'), rows = Array.from(c.querySelectorAll('.lpn-set-row')).filter((r) => r.getBoundingClientRect().width > 0);
					const names = rows.map((r) => r.firstElementChild).filter((n) => n && n.getBoundingClientRect().width > 0);
					const bad = names.filter((n) => { const cs = getComputedStyle(n); return cs.whiteSpace !== 'nowrap' || cs.textOverflow !== 'ellipsis'; }).length;
					const cols = rows[0] ? getComputedStyle(rows[0]).gridTemplateColumns : '';
					const two = rows.filter((r) => getComputedStyle(r).gridTemplateColumns.split(' ').length > 1).length;
					return { rows: rows.length, bad, two, cols, pageX: document.documentElement.scrollWidth - document.documentElement.clientWidth };
				});
				ok(mode + ' E1. Settings names never wrap and clip with an ellipsis at 12 rem', m.rows > 3 && m.bad === 0, JSON.stringify(m));
				ok(mode + ' E1b. its rows keep two columns', m.rows > 3 && m.two === m.rows, m.two + ' of ' + m.rows);
				ok(mode + ' E2. the page does not scroll sideways', m.pageX <= 0, String(m.pageX));
				ok(mode + ' E3. no page error', S.errors.length === 0, S.errors.join(' | '));
				await S.close();
			}
		}

		console.log('\n=== G. phone 390x844, Properties docked and auto-hidden: a finger drag inside it never retracts it ===');
		{
			const S = await Session.open(browser, NAME + '-g', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
			const P = S.page;
			await P.addInitScript(() => { window.EC_DEFAULT_DOCKS = true; });
			await open(S);
			await tapAt(S, true, await pipeAt(S));
			await S.settle(1300);
			const state = () => P.evaluate(() => {
				const b = document.getElementById('lpn_popup'), r = b.getBoundingClientRect(), cx = r.left + Math.min(r.width / 2, 60), cy = r.top + 120;
				const top = document.elementFromPoint(cx, cy);
				return { shown: getComputedStyle(b).display !== 'none', left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width), onTop: !!top && b.contains(top), docked: b.classList.contains('lpn-docked') };
			});
			const touchDrag = async (from, dx, dy) => {
				const cdp = await S.context.newCDPSession(P);
				const touch = async (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
				await touch('touchStart', from.x, from.y);
				for (let i = 1; i <= 12; i++) { await touch('touchMove', from.x + dx * i / 12, from.y + dy * i / 12); }
				await touch('touchEnd', 0, 0);
				await cdp.detach().catch(() => {});
			};
			const st0 = await state();
			ok('G1. Properties is out and on top (docked flyout)', st0.shown && st0.onTop, JSON.stringify(st0));
			const sp = await splitAt(S, '#lpn_popup');
			const w0 = await nameColW(S, '#lpn_popup');
			await touchDrag(sp, -40, 0);
			await S.settle(1200);
			const st1 = await state();
			ok('G2. after a finger drag of the Label | Value divider the box has not retracted, 1.2 s later', st1.shown && st1.onTop && st1.right >= st0.right - 2, JSON.stringify([st0, st1]));
			const w1 = await nameColW(S, '#lpn_popup');
			ok('G3. ...and the drag did change the Label column (' + w0 + ' -> ' + w1 + ')', w1 < w0 - 15, w0 + ' -> ' + w1);
			const sp2 = await splitAt(S, '#lpn_popup');
			const map0 = await P.evaluate(() => document.getElementById('lpn_canvas').innerHTML.length);
			await touchDrag(sp2, 30, 0);
			await S.settle(1200);
			const st2 = await state(), w2 = await nameColW(S, '#lpn_popup');
			ok('G4. a second finger drag moves the divider again (the map is not panned)', st2.shown && st2.onTop && w2 > w1 + 10, w1 + ' -> ' + w2 + ' ' + JSON.stringify(st2));
			const grip = await P.evaluate(() => { const e = ['right', 'left'].map((k) => document.getElementById('lpn_dock_grip_' + k)).filter((x) => x && getComputedStyle(x).display !== 'none')[0]; if (!e) { return null; } const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, sign: e.id === 'lpn_dock_grip_right' ? 1 : -1 }; });
			ok('G5. the dock grip is there', !!grip, JSON.stringify(grip));
			if (grip) {
				await touchDrag(grip, grip.sign * 40, 0);
				await S.settle(1200);
				const st3 = await state();
				ok('G6. after a finger drag of the dock grip the box has not retracted either', st3.shown && st3.onTop, JSON.stringify(st3));
			}
			ok('G7. no page error', S.errors.length === 0, S.errors.join(' | '));
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
