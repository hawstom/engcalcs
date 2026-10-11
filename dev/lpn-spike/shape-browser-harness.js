// THE SHAPE (ROADMAP Task 779), in a real Chrome, through real pointer presses.
//
//   node dev/lpn-spike/shape-browser-harness.js
//
// Tom, 2026-10-06: *"a very simple shape element type (if one point, it's a point, and if more, it's
// a polyline, and it can close into a polygon if you let it ...) and the ability to snap or magnet to
// shape points."* 2026-10-09: a one-point Shape is drawn as an x.
//
// On Net1: the Shape tool draws a one-point Shape (an x), a three-point open one (Enter finishes) and
// a closed one (the first point pressed again); a reload keeps all three. A Shape point dragged near
// junction 22 lands on it exactly, and a junction placed near a Shape point lands on that exactly;
// moving a whole Shape and deleting one are one undo step each; the network solves to the same
// heads and flows with Shapes present, and the EPANET file it exports is byte for byte the one it
// exported before; the DXF file carries the Shapes as POINT and LWPOLYLINE on their own layer. On a
// geographic project: the points are stored as longitude and latitude, a junction snaps onto one
// exactly, and File > Export > GeoJSON then File > Import > GeoJSON shapes round-trips all three,
// with the junction named as not imported. On a Spanish page the tool draws and the snap glyph
// names the junction in Spanish.
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SHAPE_BROWSER_LOCKED';
const NAME = 'shape-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure of what this measures; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

let checks = 0, failures = 0, Session;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

async function open(browser, url, name) {
	const a = await Session.open(browser, name || NAME, { viewport: { width: 1400, height: 900 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
	await a.goto(url || 'Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1000);
	return a;
}

// Page-side helpers, bound to one session.
function helpers(a) {
	const P = a.page;
	const settle = (ms) => a.settle(ms || 300);
	const stored = async () => {
		await settle(450);
		return P.evaluate(() => {
			const idx = JSON.parse(localStorage.getItem('lpn_index') || '{}');
			return JSON.parse(localStorage.getItem('lpn_project_' + idx.openId) || 'null');
		});
	};
	const centre = (sel) => P.evaluate((s) => {
		const e = document.querySelector(s);
		if (!e) { return null; }
		const r = e.getBoundingClientRect();
		return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
	}, sel);
	const nodeAt = (id) => centre('#lpn_canvas .lpn-node[data-node="' + id + '"]');
	const gripAt = (sid, i) => centre('#lpn_canvas .lpn-shape[data-shape="' + sid + '"] .lpn-shape-handle[data-pidx="' + i + '"] rect');
	const mark = () => P.evaluate(() => {
		const g = document.querySelector('#lpn_canvas .lpn-snap-mark');
		return g && g.style.display !== 'none'
			? { kind: g.getAttribute('data-snap-kind'), name: (g.querySelector('text') || {}).textContent } : null;
	});
	const esc = async () => { await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await settle(150); };
	const tool = async (key) => { await esc(); await a.toolbarClick(await a.lang(key)); await settle(200); };
	const select = async () => { await esc(); await a.toolbarClick('Select').catch(async () => { await P.keyboard.press('1'); }); await settle(200); };
	const click = async (p) => { await P.mouse.move(p.x - 3, p.y - 3); await P.mouse.move(p.x, p.y, { steps: 2 }); await settle(60); await P.mouse.click(p.x, p.y); await settle(250); };
	const dragTo = async (from, to) => {
		await P.mouse.move(from.x, from.y);
		await P.mouse.down();
		const steps = 12;
		for (let i = 1; i <= steps; i++) {
			await P.mouse.move(from.x + (to.x - from.x) * i / steps, from.y + (to.y - from.y) * i / steps);
			await settle(30);
		}
		await settle(150);
		const m = await mark();
		await P.mouse.up();
		await settle(300);
		return m;
	};
	// The real Calculate button; done when the page holds a NEW result object.
	const solve = async () => {
		await P.evaluate(() => { window.__shapePrev = EngCalcs.lpnSolveProbe(); });
		const run = P.locator('#lpn_toolbar_run button[data-icon="run"]:visible');
		if (await run.count()) { await run.first().click(); }
		else { await P.evaluate(() => EngCalcs.lpnTimeRunNow()); }
		await a.waitFor(() => P.evaluate(() => { const r = EngCalcs.lpnSolveProbe(); return !!(r && r !== window.__shapePrev && r.heads); }), 'a solve', 60000);
		await settle(800);
		return P.evaluate(() => { const r = EngCalcs.lpnSolveProbe(); return r ? { heads: r.heads || null, flows: r.flows || null } : null; });
	};
	// One File > Export row, by the real menu: the downloaded file's text.
	const exportVia = async (key, enc) => {
		const downloads = [];
		const onDl = (d) => downloads.push(d);
		P.on('download', onDl);
		await esc();
		await a.menuClickSub(await a.lang('lpn_file_export_menu'), await a.lang(key), 'file');
		const t0 = Date.now();
		while (!downloads.length && Date.now() - t0 < 15000) { await P.waitForTimeout(200); }
		await P.waitForTimeout(600);
		P.off('download', onDl);
		if (!downloads.length) { return null; }
		const p = await downloads[0].path();
		return p ? fs.readFileSync(p, enc || 'utf8') : null;
	};
	return { P, settle, stored, centre, nodeAt, gripAt, mark, esc, tool, select, click, dragTo, solve, exportVia };
}

const same = (a, b) => !!a && !!b && a.x === b.x && a.y === b.y;
const sameMap = (A, B) => !!A && !!B && Object.keys(A).length === Object.keys(B).length &&
	Object.keys(A).every((k) => A[k] === B[k] || Math.abs(A[k] - B[k]) <= 1e-9 * Math.max(1, Math.abs(A[k])));
// DXF text into [code, value] pairs, and the entities of the ENTITIES section.
function dxfEntities(text) {
	const L = text.split(/\r?\n/), pairs = [];
	for (let i = 0; i + 1 < L.length; i += 2) { pairs.push([L[i].trim(), L[i + 1]]); }
	let inEnt = false; const ents = []; let cur = null;
	for (let i = 0; i < pairs.length; i++) {
		const [c, v] = pairs[i];
		if (c === '2' && i > 0 && pairs[i - 1][0] === '0' && pairs[i - 1][1] === 'SECTION') { inEnt = v === 'ENTITIES'; continue; }
		if (!inEnt) { continue; }
		if (c === '0') { if (cur) { ents.push(cur); } cur = (v === 'ENDSEC') ? null : { type: v, g: [] }; if (v === 'ENDSEC') { inEnt = false; } continue; }
		if (cur) { cur.g.push([c, v]); }
	}
	return ents;
}

// A point on a drawn Shape, in screen pixels: the x of a point Shape, else the middle of its
// second leg.
function shapeMid(P, id) {
	return P.evaluate((sid) => {
		const g = document.querySelector('#lpn_canvas .lpn-shape[data-shape="' + sid + '"]');
		const x = g && g.querySelector('.lpn-shape-x');
		if (x) { const r = x.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }
		const e = g.querySelector('.lpn-shape-line'), pts = e.points, m = e.getScreenCTM(), a0 = pts.getItem(1), a1 = pts.getItem(2);
		const q = { x: (a0.x + a1.x) / 2, y: (a0.y + a1.y) / 2 };
		return { x: m.a * q.x + m.c * q.y + m.e, y: m.b * q.x + m.d * q.y + m.f };
	}, id);
}

async function drawThree(h, cells) {
	// A one-point Shape: a press, then the same point again.
	await h.tool('lpn_tool_add_shape');
	await h.click(cells[0]);
	await h.click(cells[0]);
	// Three points, open, finished by Enter.
	await h.click({ x: cells[1].x - 30, y: cells[1].y - 20 });
	await h.click({ x: cells[1].x + 30, y: cells[1].y - 20 });
	await h.click({ x: cells[1].x, y: cells[1].y + 30 });
	await h.P.keyboard.press('Enter'); await h.settle(300);
	// Three points, closed by pressing the first again.
	const c = cells[2], tri = [{ x: c.x - 30, y: c.y + 25 }, { x: c.x + 30, y: c.y + 25 }, { x: c.x, y: c.y - 30 }];
	for (const p of tri) { await h.click(p); }
	await h.click(tri[0]);
	return tri;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await open(browser);
		const h = helpers(a), P = h.P;

		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await h.settle(800);
		const inp0 = await h.exportVia('lpn_file_export_item_inp');
		ok('Net1 is open and exports an EPANET file', !!inp0 && /\[JUNCTIONS\]/.test(inp0));
		const r0 = await h.solve();
		ok('Net1 solves before any Shape is drawn', !!r0 && !!r0.heads && Object.keys(r0.heads).length > 0);

		console.log('\n--- 1. drawing a point, an open polyline and a polygon ---');
		const n = {};
		for (const id of ['11', '12', '21', '22', '23', '31', '32']) { n[id] = await h.nodeAt(id); }
		const mid = (ids) => ({ x: ids.reduce((s, i) => s + n[i].x, 0) / ids.length, y: ids.reduce((s, i) => s + n[i].y, 0) / ids.length });
		const cells = [mid(['11', '12', '21', '22']), mid(['21', '22', '31', '32']), mid(['22', '23', '32', '33'].filter((i) => n[i]).concat(['22']))];
		cells[2] = { x: (n['22'].x + n['23'].x) / 2, y: (n['22'].y + n['32'].y) / 2 };
		await h.tool('lpn_tool_add_shape');
		const hint = await P.evaluate(() => (document.getElementById('lpn_mode_hint') || {}).textContent || '');
		ok('the Shape tool states its mode', hint === await a.lang('lpn_mode_add_shape'), hint);
		await P.mouse.move(cells[0].x, cells[0].y, { steps: 3 }); await h.settle(120);
		ok('in open space there is no snap glyph', (await h.mark()) === null, JSON.stringify(await h.mark()));
		const tri = await drawThree(h, cells);
		const inpS = await h.exportVia('lpn_file_export_item_inp');
		ok('with three Shapes drawn, the EPANET file is byte for byte the one exported before', inpS === inp0,
			inpS && inp0 ? 'lengths ' + inpS.length + ' / ' + inp0.length : 'missing');
		const d1 = await h.stored();
		const S = (d1 && d1.shapes) || [];
		ok('three Shapes are stored', S.length === 3, JSON.stringify(S.map((s) => [s.id, s.pts.length, s.closed])));
		const sPt = S[0], sLine = S[1], sPoly = S[2];
		ok('the first is one point', !!sPt && sPt.pts.length === 1 && !sPt.closed);
		ok('the second is three points, open', !!sLine && sLine.pts.length === 3 && sLine.closed === false);
		ok('the third is three points, closed', !!sPoly && sPoly.pts.length === 3 && sPoly.closed === true);
		ok('Shape IDs take the S prefix', S.every((s) => /^S\d+$/.test(s.id)), S.map((s) => s.id).join());
		ok('the one-point Shape is drawn as an x', await P.evaluate((id) => !!document.querySelector('#lpn_canvas .lpn-shape[data-shape="' + id + '"] .lpn-shape-x'), sPt.id));
		ok('...the open one as a polyline and the closed one as a polygon', await P.evaluate((ids) =>
			!!document.querySelector('#lpn_canvas .lpn-shape[data-shape="' + ids[0] + '"] polyline.lpn-shape-line') &&
			!!document.querySelector('#lpn_canvas .lpn-shape[data-shape="' + ids[1] + '"] polygon.lpn-shape-line'), [sLine.id, sPoly.id]));
		const xBox = await P.evaluate((id) => { const r = document.querySelector('#lpn_canvas .lpn-shape[data-shape="' + id + '"] .lpn-shape-x').getBoundingClientRect(); return [r.width, r.height]; }, sPt.id);
		ok('the x is a few pixels across on screen', xBox[0] >= 6 && xBox[0] <= 16 && xBox[1] >= 6 && xBox[1] <= 16, JSON.stringify(xBox));
		// Escape abandons a Shape being drawn and leaves nothing behind.
		await h.click({ x: cells[0].x + 40, y: cells[0].y + 40 });
		await P.keyboard.press('Escape'); await h.settle(200);
		ok('Escape abandons a Shape being drawn', ((await h.stored()).shapes || []).length === 3);

		console.log('\n--- 2. a reload keeps them ---');
		await h.esc();
		await a.reload(); await h.settle(1200);
		const d2 = await h.stored();
		ok('after a reload the three Shapes are still stored', ((d2 && d2.shapes) || []).length === 3);
		ok('...and drawn', await P.evaluate(() => document.querySelectorAll('#lpn_canvas .lpn-shape').length) === 3);

		console.log('\n--- 3. a Shape point snaps onto junction 22 exactly ---');
		await h.select();
		const lineMid = await P.evaluate((id) => {
			const e = document.querySelector('#lpn_canvas .lpn-shape[data-shape="' + id + '"] polyline');
			const pts = e.points, m = e.getScreenCTM(), a0 = pts.getItem(1), a1 = pts.getItem(2);
			const q = { x: (a0.x + a1.x) / 2, y: (a0.y + a1.y) / 2 };
			return { x: m.a * q.x + m.c * q.y + m.e, y: m.b * q.x + m.d * q.y + m.f };
		}, sLine.id);
		await h.click(lineMid);
		ok('a press on the polyline selects it', await P.evaluate((id) => document.querySelector('#lpn_canvas .lpn-shape[data-shape="' + id + '"]').classList.contains('lpn-selected'), sLine.id));
		const g0 = await h.gripAt(sLine.id, 0), j22 = await h.nodeAt('22');
		ok('...and shows its point grips', !!g0);
		const m3 = await h.dragTo(g0, { x: j22.x + 6, y: j22.y - 5 });
		ok('during the drag the glyph names Junction 22', !!m3 && m3.kind === 'node' && m3.name === (await a.lang('lpn_tool_add_junction')) + ' 22', JSON.stringify(m3));
		const d3 = await h.stored(), n22 = d3.nodes.find((x) => x.id === '22'), l3 = d3.shapes.find((s) => s.id === sLine.id);
		ok('the Shape point is stored at junction 22\'s x and y exactly', same(l3.pts[0], n22), JSON.stringify([l3.pts[0], n22.x, n22.y]));
		ok('...and its other points did not move', same(l3.pts[1], sLine.pts[1]) && same(l3.pts[2], sLine.pts[2]));
		await P.keyboard.press('Control+z'); await h.settle(400);
		ok('Undo puts the point back', same((await h.stored()).shapes.find((s) => s.id === sLine.id).pts[0], sLine.pts[0]));
		await P.keyboard.press('Control+y'); await h.settle(400);

		console.log('\n--- 4. a junction snaps onto a Shape point exactly ---');
		const t0 = tri[0];
		await h.tool('lpn_tool_add_junction');
		await P.mouse.move(t0.x + 6, t0.y + 5, { steps: 3 }); await h.settle(150);
		const m4 = await h.mark();
		const want4 = (await a.lang('lpn_snap_shape_point')).split('{shape}').join((await a.lang('lpn_tool_add_shape')) + ' ' + sPoly.id).split('{n}').join('1');
		ok('hovering near the polygon\'s first point names it ("' + want4 + '")', !!m4 && m4.kind === 'shape' && m4.name === want4, JSON.stringify(m4));
		const before4 = (await h.stored()).nodes.map((x) => x.id);
		await P.mouse.click(t0.x + 6, t0.y + 5); await h.settle(400);
		const d4 = await h.stored(), nj = d4.nodes.find((x) => before4.indexOf(x.id) < 0), p4 = d4.shapes.find((s) => s.id === sPoly.id).pts[0];
		ok('a junction is placed exactly on the Shape point', !!nj && same(nj, p4), JSON.stringify([nj && nj.x, nj && nj.y, p4]));
		await h.esc();
		await P.keyboard.press('Control+z'); await h.settle(400);
		ok('Undo removes the junction', !(await h.stored()).nodes.some((x) => x.id === (nj && nj.id)));

		console.log('\n--- 5. a Shape point snaps onto another Shape\'s point ---');
		{
			await h.select();
			await h.click(lineMid);
			const g2 = await h.gripAt(sLine.id, 2);
			const m5 = await h.dragTo(g2, { x: t0.x + 5, y: t0.y - 4 });
			ok('the glyph names the polygon\'s first point', !!m5 && m5.kind === 'shape' && m5.name === want4, JSON.stringify(m5));
			const d5 = await h.stored();
			ok('the polyline\'s third point is stored on it exactly', same(d5.shapes.find((s) => s.id === sLine.id).pts[2], d5.shapes.find((s) => s.id === sPoly.id).pts[0]));
			await P.keyboard.press('Control+z'); await h.settle(400);
		}

		console.log('\n--- 6. moving a whole Shape, and Undo ---');
		{
			await h.select();
			const e0 = await P.evaluate((id) => {
				const e = document.querySelector('#lpn_canvas .lpn-shape[data-shape="' + id + '"] polygon');
				const pts = e.points, m = e.getScreenCTM(), a0 = pts.getItem(0), a1 = pts.getItem(1);
				const q = { x: (a0.x + a1.x) / 2, y: (a0.y + a1.y) / 2 };
				return { x: m.a * q.x + m.c * q.y + m.e, y: m.b * q.x + m.d * q.y + m.f };
			}, sPoly.id);
			const beforeMove = (await h.stored()).shapes.find((s) => s.id === sPoly.id).pts;
			await h.dragTo(e0, { x: e0.x + 40, y: e0.y + 15 });
			const moved = (await h.stored()).shapes.find((s) => s.id === sPoly.id).pts;
			const dx = moved[0].x - beforeMove[0].x, dy = moved[0].y - beforeMove[0].y;
			ok('dragging the polygon\'s edge moves it', Math.abs(dx) > 0 && Math.abs(dy) > 0, JSON.stringify([dx, dy]));
			ok('...every point by the same amount', moved.every((p, i) => Math.abs((p.x - beforeMove[i].x) - dx) < 1e-9 && Math.abs((p.y - beforeMove[i].y) - dy) < 1e-9));
			await P.keyboard.press('Control+z'); await h.settle(400);
			const back = (await h.stored()).shapes.find((s) => s.id === sPoly.id).pts;
			ok('one Undo puts every point back exactly', back.every((p, i) => same(p, beforeMove[i])));
		}

		console.log('\n--- 7. deleting a Shape, and Undo ---');
		{
			await h.select();
			const xAt = await h.centre('#lpn_canvas .lpn-shape[data-shape="' + sPt.id + '"] .lpn-shape-x');
			await h.click(xAt);
			ok('a press on the x selects the point Shape', await P.evaluate((id) => document.querySelector('#lpn_canvas .lpn-shape[data-shape="' + id + '"]').classList.contains('lpn-selected'), sPt.id));
			await P.keyboard.press('Delete'); await h.settle(400);
			ok('Delete removes it', !(await h.stored()).shapes.some((s) => s.id === sPt.id));
			await P.keyboard.press('Control+z'); await h.settle(400);
			ok('one Undo brings it back', (await h.stored()).shapes.some((s) => s.id === sPt.id && same(s.pts[0], sPt.pts[0])));
			// The Delete tool, on a Shape's line.
			await h.tool('lpn_tool_delete');
			await h.click(lineMid);
			ok('the Delete tool removes a Shape pressed on its line', !(await h.stored()).shapes.some((s) => s.id === sLine.id));
			await h.esc();
			await P.keyboard.press('Control+z'); await h.settle(400);
			ok('...and Undo restores it', (await h.stored()).shapes.some((s) => s.id === sLine.id));
		}

		console.log('\n--- 8. the network with Shapes present: the same answers, the same EPANET file ---');
		{
			const r8 = await h.solve();
			ok('the heads are unchanged', sameMap(r0.heads, r8 && r8.heads));
			ok('the flows are unchanged', sameMap(r0.flows, r8 && r8.flows));
			const inp1 = await h.exportVia('lpn_file_export_item_inp');
			// With the three Shapes, and then at the same moment without them (the Delete tool on each):
			// the two files must be the same bytes. Not against an export made earlier: Net1's
			// [LABELS] x is measured off the drawn text, and a reload alone moves it by a hair
			// (pre-existing, with or without Shapes), so section 1 holds the before-and-after.
			await h.tool('lpn_tool_delete');
			for (const id of [sPt.id, sLine.id, sPoly.id]) { await h.click(await shapeMid(P, id)); }
			const inp2 = await h.exportVia('lpn_file_export_item_inp');
			ok('the Delete tool took all three Shapes', ((await h.stored()).shapes || []).length === 0);
			ok('the EPANET file with the Shapes is byte for byte the one without them', !!inp1 && inp1 === inp2,
				inp1 && inp2 ? 'lengths ' + inp1.length + ' / ' + inp2.length : 'missing');
			ok('...and names no Shape', !!inp1 && !/\bS[123]\b/.test(inp1));
			await h.esc();
			for (let k = 0; k < 3; k++) { await P.keyboard.press('Control+z'); await h.settle(300); }
			ok('three Undos bring the three Shapes back', ((await h.stored()).shapes || []).length === 3);
			const dxf = await h.exportVia('lpn_file_export_item_dxf', 'latin1');
			const ents = dxf ? dxfEntities(dxf) : [];
			const layerOf = (e) => (e.g.find((p) => p[0] === '8') || [])[1];
			const onShape = ents.filter((e) => layerOf(e) === 'C-WATR-MODL-S___-BASE');
			ok('the DXF file has a Shape layer, C-WATR-MODL-S___-BASE', !!dxf && /C-WATR-MODL-S___-BASE/.test(dxf));
			ok('...holding one POINT', onShape.filter((e) => e.type === 'POINT').length === 1);
			const polys = onShape.filter((e) => e.type === 'LWPOLYLINE').map((e) => (e.g.find((p) => p[0] === '70') || [])[1].trim());
			ok('...and two LWPOLYLINEs, one closed (70 = 1) and one open (70 = 0)', polys.sort().join() === '0,1', polys.join());
			ok('...and nothing else', onShape.length === 3, onShape.map((e) => e.type).join());
		}
		ok('no uncaught page errors on Net1', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));

		console.log('\n--- 9. a geographic project: longitude and latitude, and a GeoJSON round trip ---');
		{
			await a.newGeoProject('us');
			await a.dismissGallery();
			await h.settle(600);
			const box = await P.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
			// A first junction, so the view and the origin settle before anything is measured.
			await h.tool('lpn_tool_add_junction');
			await h.click({ x: box.x + box.w * 0.3, y: box.y + box.h * 0.5 }); await h.settle(400);
			const gcells = [{ x: box.x + box.w * 0.45, y: box.y + box.h * 0.4 }, { x: box.x + box.w * 0.55, y: box.y + box.h * 0.55 }, { x: box.x + box.w * 0.68, y: box.y + box.h * 0.45 }];
			const gtri = await drawThree(h, gcells);
			const g1 = await h.stored();
			ok('the project is geographic', g1.project && g1.project.coords === 'geo');
			ok('three Shapes are stored', (g1.shapes || []).length === 3, JSON.stringify((g1.shapes || []).map((s) => [s.id, s.pts.length, s.closed])));
			ok('...with longitudes and latitudes, not Web Mercator drawing numbers',
				(g1.shapes || []).every((s) => s.pts.every((p) => Math.abs(p.x) <= 180 && Math.abs(p.y) <= 85.06 && !('_ysrc' in p))));
			await h.tool('lpn_tool_add_junction');
			const before9 = g1.nodes.map((x) => x.id);
			await P.mouse.move(gtri[1].x + 5, gtri[1].y - 5, { steps: 3 }); await h.settle(150);
			const m9 = await h.mark();
			ok('the junction tool shows the Shape point glyph', !!m9 && m9.kind === 'shape', JSON.stringify(m9));
			await P.mouse.click(gtri[1].x + 5, gtri[1].y - 5); await h.settle(400);
			const g2 = await h.stored(), gj = g2.nodes.find((x) => before9.indexOf(x.id) < 0), gp = g2.shapes[2].pts[1];
			ok('the junction stores the Shape point\'s longitude and latitude exactly', !!gj && same(gj, gp), JSON.stringify([gj && gj.x, gj && gj.y, gp]));
			await h.esc();

			const gjText = await h.exportVia('lpn_file_export_item_geojson');
			let G = null;
			try { G = JSON.parse(gjText); } catch (e) { G = null; }
			const sf = G ? G.features.filter((f) => f.properties && f.properties.element === 'Shape') : [];
			ok('the GeoJSON file holds three Shape features', sf.length === 3, gjText ? gjText.slice(0, 120) : 'no file');
			const byType = {}; sf.forEach((f) => { byType[f.geometry.type] = f; });
			ok('...a Point, a LineString and a Polygon', !!byType.Point && !!byType.LineString && !!byType.Polygon, Object.keys(byType).join());
			const ring = byType.Polygon ? byType.Polygon.geometry.coordinates[0] : [];
			ok('the polygon\'s ring is closed (RFC 7946 3.1.6): four positions, the last the first',
				ring.length === 4 && ring[0][0] === ring[3][0] && ring[0][1] === ring[3][1], JSON.stringify(ring));
			let area = 0; for (let k = 0; k + 1 < ring.length; k++) { area += ring[k][0] * ring[k + 1][1] - ring[k + 1][0] * ring[k][1]; }
			ok('...and counterclockwise, as an exterior ring must be', area > 0, String(area));
			ok('the Point carries the stored longitude and latitude', !!byType.Point &&
				byType.Point.geometry.coordinates[0] === g2.shapes[0].pts[0].x && byType.Point.geometry.coordinates[1] === g2.shapes[0].pts[0].y);

			// Into a fresh geographic project, through the real menu row and file chooser.
			await a.newGeoProject('us');
			await a.dismissGallery();
			await h.settle(500);
			await h.esc();
			const [chooser] = await Promise.all([
				P.waitForEvent('filechooser', { timeout: 10000 }),
				a.menuClickSub(await a.lang('lpn_file_import_menu'), await a.lang('lpn_file_import_geojson'), 'file')
			]);
			await chooser.setFiles({ name: 'shapes.geojson', mimeType: 'application/geo+json', buffer: Buffer.from(gjText) });
			await a.waitFor(async () => ((await h.stored()).shapes || []).length > 0, 'the import', 8000).catch(() => {});
			const g3 = await h.stored(), note = await a.notice();
			ok('the import makes three Shapes', (g3.shapes || []).length === 3, JSON.stringify((g3.shapes || []).map((s) => s.id)));
			const src = {}; g2.shapes.forEach((s) => { src[s.id] = s; });
			const back = {}; (g3.shapes || []).forEach((s) => { back[s.id] = s; });
			ok('...under the IDs they were exported with', g2.shapes.every((s) => !!back[s.id]), Object.keys(back).join());
			ok('the point and the polyline come back point for point, exactly', [g2.shapes[0], g2.shapes[1]].every((s) =>
				back[s.id] && back[s.id].closed === s.closed && back[s.id].pts.length === s.pts.length && back[s.id].pts.every((p, i) => same(p, s.pts[i]))));
			const pb = back[g2.shapes[2].id], pa = g2.shapes[2];
			const ringSame = pb && pb.closed && pb.pts.length === 3 && same(pb.pts[0], pa.pts[0]) &&
				((same(pb.pts[1], pa.pts[1]) && same(pb.pts[2], pa.pts[2])) || (same(pb.pts[1], pa.pts[2]) && same(pb.pts[2], pa.pts[1])));
			ok('the polygon comes back closed, the same three points from the same first point', !!ringSame, JSON.stringify(pb));
			ok('the notice counts the Shapes and names the junction as not imported',
				note.indexOf('3') >= 0 && note.indexOf(gj.id + ' (' + await a.lang('lpn_geojson_import_why_network') + ')') >= 0, note);
			ok('...and no junction was made', (g3.nodes || []).length === 0);
			await P.keyboard.press('Control+z'); await h.settle(400);
			ok('one Undo takes the whole import back', ((await h.stored()).shapes || []).length === 0);
		}
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();

		console.log('\n--- 10. a Spanish page ---');
		{
			const b = await open(browser, 'Looped-Network.php?lang=es', NAME + '-es');
			const hb = helpers(b);
			await b.openExampleCard(await b.lang('lpn_ex_net1_title'));
			await hb.settle(800);
			const c22 = await hb.nodeAt('22');
			await hb.tool('lpn_tool_add_shape');
			await b.page.mouse.move(c22.x + 6, c22.y - 5, { steps: 3 }); await hb.settle(150);
			const name = (await hb.mark() || {}).name;
			const want = (await b.lang('lpn_tool_add_junction')) + ' 22';
			ok('the Shape tool\'s glyph names "' + want + '"', name === want, name);
			await hb.click({ x: c22.x + 6, y: c22.y - 5 });
			await hb.click({ x: c22.x + 6, y: c22.y - 5 });
			const ds = await hb.stored(), n22s = ds.nodes.find((x) => x.id === '22');
			ok('a one-point Shape drawn there stands on junction 22 exactly', (ds.shapes || []).length === 1 && same(ds.shapes[0].pts[0], n22s));
			ok('no uncaught page errors on the Spanish page', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
			await b.close();
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
