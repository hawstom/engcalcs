// **MEASURES THE FINGER'S PICK RULE AGAINST THE MOUSE'S** (Task 861, round 10; Tom, 2026-11-22: "What would happen if we treat phone
// exactly like a mouse/PC, going by only the exact tap point?"). It prints a table and asserts nothing beyond "the page ran".
// The same intended points (read off the drawing in each context) are tapped with the same Gaussian scatter, under three rules:
//   finger   a touch device as shipped (round 9: touchNodeOver, the finger's 24 px reach)
//   switch   the same touch device with window.EC_TOUCH_PICK_LIKE_MOUSE (js/looped-network.js, fingerRule()): the JS pick is the
//            mouse's, the CSS skirts for a coarse pointer (pump 24 px, Text 16 px) remain
//   mouse    a desktop context, real mouse clicks: the whole mouse rule, CSS included
// per target kind: % the intended element is selected, % something else, % nothing, % a box opens (and how often it holds the intended).
// The scatter is Gaussian, SD px (default 4 CSS px, about 1 mm; ASSUMED: touch-accuracy studies such as Holz & Baudisch, CHI 2010,
// put a finger's offset at roughly 1-2 mm SD, and none was looked up here). Env: SD, N (taps per kind), SIZES=phone,tablet, VIEWS=0,8.
//   node dev/lpn-spike/pick-touch-rule-measure.js   (takes the browser lock itself)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const NAME = 'pick-touch-rule-measure';
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PICKMEAS_LOCKED';
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
const SD = parseFloat(process.env.SD || '4'), N = parseInt(process.env.N || '40', 10);
const SIZES = (process.env.SIZES || 'phone,tablet').split(','), VIEWS = (process.env.VIEWS || '0,8').split(',').map(Number);
const SIZE = { phone: { width: 390, height: 844, dsf: 3 }, tablet: { width: 1280, height: 800, dsf: 2 } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function gauss(r) { return Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r()); }

// The intended points, read off the drawing. kind: junction (isolated), pipe-mid, pipe-end (12 px along from an end),
// pump (Pump 335's ink, farthest from every node), reservoir (River's ink).
const TARGETS = () => {
	const cv = document.getElementById('lpn_canvas'), cr = cv.getBoundingClientRect(), P = cv.createSVGPoint();
	const inCanvas = (x, y) => { if (x < cr.left + 10 || x > cr.right - 50 || y < cr.top + 20 || y > cr.bottom - 40) { return false; } const t = document.elementFromPoint(x, y); return !!t && !!t.closest('#lpn_canvas'); };
	const discs = Array.from(document.querySelectorAll('#lpn_canvas circle.lpn-node[data-node]')).map((e) => { const b = e.getBoundingClientRect(); return { id: e.dataset.node, x: b.left + b.width / 2, y: b.top + b.height / 2, r: b.width / 2, res: e.classList.contains('lpn-node-reservoir') || e.classList.contains('lpn-node-tank') }; }).filter((d) => d.r > 0);
	const glyphs = Array.from(document.querySelectorAll('#lpn_canvas path.lpn-link-symbol-hit, #lpn_canvas path.lpn-node-hit')).map((e) => ({ e, b: e.getBoundingClientRect(), m: e.getScreenCTM().inverse() })).filter((g) => g.b.width > 0);
	const near = (x, y, d) => discs.some((c) => Math.hypot(x - c.x, y - c.y) < d + c.r) || glyphs.some((g) => x > g.b.left - d && x < g.b.right + d && y > g.b.top - d && y < g.b.bottom + d);
	const pipes = Array.from(document.querySelectorAll('#lpn_canvas polyline.lpn-link.lpn-link-pipe[data-link]')).filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 || b.height > 0; }).map((e) => { const m = e.getScreenCTM(); return { id: e.dataset.link, pts: e.getAttribute('points').trim().split(/\s+/).map((t) => { const a = t.split(','); return { x: m.a * a[0] + m.c * a[1] + m.e, y: m.b * a[0] + m.d * a[1] + m.f }; }) }; });
	const segD = (x, y, a, b) => { const dx = b.x - a.x, dy = b.y - a.y, L = dx * dx + dy * dy, t = L ? Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / L)) : 0; return Math.hypot(x - a.x - t * dx, y - a.y - t * dy); };
	const lineD = (q, x, y) => { let d = Infinity; for (let i = 0; i + 1 < q.pts.length; i++) { d = Math.min(d, segD(x, y, q.pts[i], q.pts[i + 1])); } return d; };
	const out = [];
	discs.filter((d) => !d.res).forEach((d) => {
		if (!inCanvas(d.x, d.y) || discs.some((o) => o !== d && Math.hypot(o.x - d.x, o.y - d.y) < 12) || glyphs.some((g) => d.x > g.b.left - 6 && d.x < g.b.right + 6 && d.y > g.b.top - 6 && d.y < g.b.bottom + 6)) { return; }
		out.push({ kind: 'junction', id: 'n' + d.id, x: d.x, y: d.y });
	});
	pipes.forEach((q) => {
		const pts = q.pts, n = pts.length;
		let len = 0; for (let i = 0; i + 1 < n; i++) { len += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y); }
		if (len < 30) { return; }
		const at = (f) => { let rem = f; for (let i = 0; i + 1 < n; i++) { const L = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y); if (rem <= L || i === n - 2) { const t = L ? rem / L : 0; return { x: pts[i].x + t * (pts[i + 1].x - pts[i].x), y: pts[i].y + t * (pts[i + 1].y - pts[i].y) }; } rem -= L; } };
		const clearOfPipes = (p) => pipes.every((o) => o === q || lineD(o, p.x, p.y) > 8);
		const m = at(len / 2);
		if (inCanvas(m.x, m.y) && !near(m.x, m.y, 12) && clearOfPipes(m)) { out.push({ kind: 'pipe-mid', id: 'l' + q.id, x: m.x, y: m.y }); }
		[at(12), at(len - 12)].forEach((p) => { if (inCanvas(p.x, p.y) && clearOfPipes(p) && !discs.some((c) => Math.hypot(p.x - c.x, p.y - c.y) < 8) && !glyphs.some((g) => p.x > g.b.left - 2 && p.x < g.b.right + 2 && p.y > g.b.top - 2 && p.y < g.b.bottom + 2)) { out.push({ kind: 'pipe-end', id: 'l' + q.id, x: p.x, y: p.y }); } });
	});
	const inkPt = (sel, pred) => {
		const g = glyphs.find((q) => q.e.matches(sel)); if (!g) { return null; }
		let best = null;
		for (let x = g.b.left; x <= g.b.right; x += 0.5) { for (let y = g.b.top; y <= g.b.bottom; y += 0.5) {
			P.x = x; P.y = y; if (!g.e.isPointInFill(P.matrixTransform(g.m))) { continue; }
			const d = Math.min.apply(null, discs.filter((c) => !pred || pred(c)).map((c) => Math.hypot(x - c.x, y - c.y) - c.r));
			if (!best || d > best.d) { best = { x, y, d }; }
		} }
		return best;
	};
	const pump = inkPt('[data-link="335"]');
	if (pump && inCanvas(pump.x, pump.y)) { out.push({ kind: 'pump', id: 'l335', x: pump.x, y: pump.y }); }
	const riv = glyphs.find((q) => q.e.matches('[data-node="River"]'));
	if (riv) { const x = (riv.b.left + riv.b.right) / 2, y = riv.b.top + (riv.b.bottom - riv.b.top) * 0.3; if (inCanvas(x, y)) { out.push({ kind: 'reservoir', id: 'nRiver', x, y }); } }
	// overlap: the centroid of the ground where River's ink and Pump 335's ink lie together (a box is the right answer there).
	const pg = glyphs.find((q) => q.e.matches('[data-link="335"]'));
	if (riv && pg) {
		let sx = 0, sy = 0, k = 0;
		for (let x = Math.max(riv.b.left, pg.b.left); x <= Math.min(riv.b.right, pg.b.right); x += 0.25) { for (let y = Math.max(riv.b.top, pg.b.top); y <= Math.min(riv.b.bottom, pg.b.bottom); y += 0.25) {
			P.x = x; P.y = y; if (riv.e.isPointInFill(P.matrixTransform(riv.m)) && pg.e.isPointInFill(P.matrixTransform(pg.m))) { sx += x; sy += y; k++; }
		} }
		if (k) { out.push({ kind: 'overlap', id: 'box', x: sx / k, y: sy / k, area: k / 16 }); }
	}
	return out;
};
const READ = () => {
	const sel = Array.from(document.querySelectorAll('#lpn_canvas .lpn-selected')).map((e) => e.dataset.node ? 'n' + e.dataset.node : (e.dataset.link !== undefined ? 'l' + e.dataset.link : (e.nextElementSibling && e.nextElementSibling.dataset.link !== undefined ? 'l' + e.nextElementSibling.dataset.link : 'x')));
	const rows = Array.from(document.querySelectorAll('.lpn-pick-chooser button')).map((b) => b.textContent.trim());
	document.querySelectorAll('.lpn-pane-ctxmenu').forEach((m) => m.remove());
	const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); }
	return { sel: sel.filter((v, i) => sel.indexOf(v) === i).sort().join(','), rows };
};

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const net3 = fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net3.lwn'), 'utf8');
	const open = async (S, flag) => {
		await S.page.addInitScript((f) => { window.EC_DEFAULT_DOCKS = true; if (f) { window.EC_TOUCH_PICK_LIKE_MOUSE = true; } }, flag);
		await S.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await S.goto('Looped-Network.php?ec_nolog=1');
		await S.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, net3);
		await S.reload();
		await S.answerTrainingPanel().catch(() => {});
		await S.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await S.settle(3000);
	};
	const rules = [['finger', true, false], ['switch', true, true], ['mouse', false, false]];
	const all = {};
	for (const sz of SIZES) {
		const V = SIZE[sz];
		for (const [rule, touch, flag] of rules) {
			const S = await Session.open(browser, NAME + '-' + sz + '-' + rule, touch ? { viewport: { width: V.width, height: V.height }, hasTouch: true, isMobile: true, deviceScaleFactor: V.dsf } : { viewport: { width: V.width, height: V.height } });
			await open(S, flag);
			const cdp = touch ? await S.page.context().newCDPSession(S.page) : null;
			let zoomed = 0;
			for (const notches of VIEWS) {
				if (notches > zoomed) {
					const c = await S.page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
					await S.page.mouse.move(c.x, c.y);
					for (let i = zoomed; i < notches; i++) { await S.page.mouse.wheel(0, 120); await sleep(30); }
					zoomed = notches; await S.settle(900);
				}
				const tg = await S.page.evaluate(TARGETS);
				const kinds = (process.env.KINDS || 'junction,pipe-mid,pipe-end,pump,reservoir').split(',');
				for (const kind of kinds) {
					const list = tg.filter((t) => t.kind === kind).slice(0, 14);
					const key = [sz, notches, kind].join('|');
					all[key] = all[key] || {};
					const c = all[key][rule] = { n: 0, intended: 0, other: 0, nothing: 0, box: 0, boxHas: 0, targets: list.length };
					if (!list.length) { continue; }
					const r = rng(1234 + kind.length * 7 + notches);
					for (let i = 0; i < N; i++) {
						const t = list[i % list.length], x = t.x + SD * gauss(r), y = t.y + SD * gauss(r);
						if (touch) {
							await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] }); await sleep(30);
							await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
						} else { await S.page.mouse.move(x, y); await S.page.mouse.click(x, y); }
						await sleep(110);
						const o = await S.page.evaluate(READ);
						c.n++;
						if (o.rows.length) { c.box++; if (t.kind === 'overlap' ? (o.rows.some((w) => /Reservoir River/.test(w)) && o.rows.some((w) => /Pump 335/.test(w))) : o.rows.some((w) => new RegExp((t.id[0] === 'n' ? '(Junction|Reservoir|Tank) ' : '(Pipe|Pump|Valve) ') + t.id.slice(1) + '$').test(w))) { c.boxHas++; } }
						else if (o.sel === t.id) { c.intended++; } else if (o.sel === '') { c.nothing++; } else { c.other++; }
						await S.page.keyboard.press('Escape'); await sleep(40);
					}
				}
			}
			await S.page.close();
		}
	}
	console.log('\nScatter: Gaussian, SD ' + SD + ' CSS px, ' + N + ' taps per kind per view (intended points: up to 14 per kind). Cells: % intended / % other / % nothing / % box (% of all taps that open a box listing the intended).');
	console.log('size   view  kind        rule     intended other nothing box (has intended)  targets');
	Object.keys(all).forEach((k) => {
		const [sz, v, kind] = k.split('|');
		Object.keys(all[k]).forEach((rule) => {
			const c = all[k][rule], p = (x) => (c.n ? Math.round(100 * x / c.n) : 0);
			console.log([sz.padEnd(6), ('out ' + v).padEnd(5), kind.padEnd(11), rule.padEnd(8), String(p(c.intended)).padStart(8), String(p(c.other)).padStart(5), String(p(c.nothing)).padStart(7), String(p(c.box)).padStart(4) + ' (' + p(c.boxHas) + ')', String(c.targets).padStart(7)].join(' '));
		});
	});
	await browser.close();
	env.stopServer();
	process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
