// **THE PICK CHOOSER ON NET3, WHERE THE SCREEN DECIDES** (Tom, 2026-11-16: "I can't predict when I
// will or won't get a chooser"; "a list of more than about 4 to 5 elements is not helpful"). The box
// opens only where the pressed point is on the ink of two or more symbols, lists no pipe (only a pipe whose two ends are drawn at one point could be a row, and Net3 has none),
// and has at most six rows. Real Chromium, the Net3 example:
//   L. the Lake: a click where the reservoir's symbol overlaps the pump's glyph opens a box listing
//      the reservoir and the pump (no pipe); a click on the reservoir clear of the pump, and on the
//      pump clear of the reservoir, selects that one with no box; Pump 10 and Pump 335 at their
//      junctions (10, 60, 61): free ink selects the pump, the overlap opens the box of the two;
//   A. desktop, a mouse, a click on EVERY node's centre at the opening view and 4, 8, 12 and 20 notches
//      out (the network drawn 120 px wide): the number of boxes and the largest row count are PRINTED,
//      and the checks are that every click without a box selects the node it is on, that every box
//      lists two to six rows with no pipe, and that the opening view opens only the few where a tank
//      or pump glyph lies over a junction (a pump's or valve's symbol counts like any node's: Net3's pumps 10 and 335 each lie over a junction);
//   B. phone, 390 x 844 touch, 8 notches out: the same with a finger;
//   B3. phone, a finger is a disc of the touch reach (Tom, 2026-11-18: "I can't select Pump 335 ... I repeatedly select
//      N60 or N61"): a tap on Pump 335's ink selects the pump, a tap where its ink overlaps Junction 61 gives the box, at the
//      opening view and 4 and 8 notches out; a tap on a lone junction far from anything selects it with no box; a tap on
//      Tank 1 at 4 notches out gives its box.
// The cases built by hand are in pick-chooser-browser-harness.js.
//
//   node dev/lpn-spike/pick-chooser-zoom-browser-harness.js   (takes the browser lock itself)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const NAME = 'pick-chooser-zoom-browser-harness';
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PICKZOOM_LOCKED';
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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const net3 = fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net3.lwn'), 'utf8');
	const errors = [];
	const open = async (S) => {
		S.page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await S.page.addInitScript(() => { window.EC_DEFAULT_DOCKS = true; });
		await S.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await S.goto('Looped-Network.php?ec_nolog=1');
		await S.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, net3);
		await S.reload();
		await S.answerTrainingPanel().catch(() => {});
		await S.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await S.settle(3000);
	};
	// Every node centre on screen, and how wide the network is drawn.
	const centres = (S) => S.page.evaluate(() => {
		const out = [];
		let l = Infinity, r = -Infinity;
		document.querySelectorAll('#lpn_canvas circle.lpn-node[data-node], #lpn_canvas .lpn-node[data-node]').forEach((e) => {
			const b = e.getBoundingClientRect();
			if (!(b.width > 0)) { return; }
			const x = b.left + b.width / 2, y = b.top + b.height / 2;
			l = Math.min(l, x); r = Math.max(r, x);
			const top = document.elementsFromPoint(x, y)[0];
			if (top && top.closest && top.closest('#lpn_canvas') && x > 0 && y > 0 && x < innerWidth && y < innerHeight) { out.push({ id: e.dataset.node, x, y }); }
		});
		return { pts: out, width: r - l };
	});
	const readAndReset = (S) => S.page.evaluate(() => {
		const sel = Array.from(document.querySelectorAll('#lpn_canvas .lpn-selected')).map((e) => e.dataset.node ? 'n' + e.dataset.node : (e.dataset.link ? 'l' + e.dataset.link : 'x')).sort().join(',');
		const rows = Array.from(document.querySelectorAll('.lpn-pick-chooser button')).map((b) => b.textContent.trim());
		document.querySelectorAll('.lpn-pane-ctxmenu').forEach((m) => m.remove());
		const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); }
		return { sel, box: rows.length > 0, rows };
	});
	const sweep = async (S, touch) => {
		const { pts, width } = await centres(S);
		const cdp = touch ? await S.page.context().newCDPSession(S.page) : null;
		const press = async (p) => {
			if (touch) {
				await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p.x, y: p.y, id: 1 }] });
				await sleep(35);
				await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
				await sleep(60);
			} else { await S.page.mouse.move(p.x, p.y); await S.page.mouse.click(p.x, p.y); await sleep(40); }
		};
		const res = [];
		for (const p of pts) { await press(p); res.push(Object.assign({ id: p.id }, await readAndReset(S))); }
		const boxes = res.filter((r) => r.box);
		const quiet = res.filter((r) => !r.box);
		return { n: pts.length, width: Math.round(width), boxes: boxes.length,
			shortBoxes: boxes.filter((r) => r.rows.length < 2).length,
			maxRows: boxes.reduce((m, r) => Math.max(m, r.rows.length), 0), pipeRows: boxes.filter((r) => r.rows.some((x) => /^Pipe /.test(x))).length,   // Net3 has no assembly: no box lists a pipe
			box20: (boxes.find((r) => r.id === '20') || {}).rows,
			// A tap that selects a neighbour is wrong only when that neighbour is more than 3 px from the node tapped
			// (two dots 2 px apart cannot be told apart by a finger's centre pixel).
			quietWrongIds: quiet.filter((r) => r.sel !== 'n' + r.id).map((r) => r.id + '->' + r.sel).join(' '),
			quietWrong: quiet.filter((r) => { if (r.sel === 'n' + r.id) { return false; } const me = pts.find((p) => p.id === r.id), other = pts.find((p) => 'n' + p.id === r.sel); return !(me && other && Math.hypot(me.x - other.x, me.y - other.y) <= 3); }).length,
			sample: boxes.slice(0, 3).map((r) => r.id + ': ' + r.rows.join(' / ')) };
	};
	const zoomOut = async (S, notches) => {
		const c = await S.page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await S.page.mouse.move(c.x, c.y);
		for (let i = 0; i < notches; i++) { await S.page.mouse.wheel(0, 120); await sleep(30); }
		await S.settle(900);
	};
	try {
		console.log('\nL. The Lake: the reservoir overlaps the pump');
		const D = await Session.open(browser, NAME + '-d', { viewport: { width: 1400, height: 900 } });
		await open(D);
		const rowsNow = () => D.page.$$eval('.lpn-pick-chooser button', (bs) => bs.map((b) => b.textContent.trim()));
		// A link wears its mark on its halo, which sits just before its grab band (the one with data-link).
		const selNow = () => D.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas .lpn-selected')).map((e) => { if (e.dataset.node) { return 'n' + e.dataset.node; } const h = e.dataset.link !== undefined ? e : e.nextElementSibling; return h && h.dataset.link !== undefined ? 'l' + h.dataset.link : 'x'; }).sort().join(','));
		const lake = await D.page.evaluate(() => {
			const r = (s) => { const e = Array.from(document.querySelectorAll(s)).find((x) => x.getBoundingClientRect().width > 0); return e && e.getBoundingClientRect(); };
			const a = r('#lpn_canvas circle.lpn-node[data-node="Lake"]'), g = r('#lpn_canvas path.lpn-link-symbol-hit[data-link="10"]');
			return { a: a && [a.left, a.top, a.right, a.bottom], g: g && [g.left, g.top, g.right, g.bottom] };
		});
		ok('the Lake reservoir and the pump glyph are drawn', !!lake.a && !!lake.g, JSON.stringify(lake));
		// A point on the ink of both: the reservoir's silhouette (its hit path, a triangle) and the pump's, deepest in both.
		const overlap = await D.page.evaluate(() => {
			const r = document.querySelector('#lpn_canvas path.lpn-node-hit[data-node="Lake"]'), g = document.querySelector('#lpn_canvas path.lpn-link-symbol-hit[data-link="10"]');
			const rb = r.getBoundingClientRect(), gb = g.getBoundingClientRect(), svg = r.ownerSVGElement, P = svg.createSVGPoint(), rm = r.getScreenCTM().inverse(), gm = g.getScreenCTM().inverse();
			const has = (e, m, x, y, o) => { P.x = x + o[0]; P.y = y + o[1]; return e.isPointInFill(P.matrixTransform(m)); };
			const offs = [[0, 0], [1.2, 0], [-1.2, 0], [0, 1.2], [0, -1.2]];
			let best = null;
			for (let x = Math.max(rb.left, gb.left); x <= Math.min(rb.right, gb.right); x += 0.5) {
				for (let y = Math.max(rb.top, gb.top); y <= Math.min(rb.bottom, gb.bottom); y += 0.5) {
					if (offs.every((o) => has(r, rm, x, y, o) && has(g, gm, x, y, o))) { best = { x, y }; }
				}
			}
			return best;
		});
		await D.page.mouse.move(overlap.x, overlap.y); await D.page.mouse.click(overlap.x, overlap.y); await D.settle(450);
		const lakeRows = await rowsNow();
		ok('a click where the reservoir overlaps the pump opens the box', lakeRows.length >= 2, JSON.stringify(lakeRows));
		ok('...listing the reservoir and the pump, and no pipe', lakeRows.some((r) => /Lake/.test(r)) && lakeRows.some((r) => /Pump 10/.test(r)) && !lakeRows.some((r) => /^Pipe /.test(r)), JSON.stringify(lakeRows));
		ok('...selecting nothing until a row is chosen', (await selNow()) === '', await selNow());
		const pumpRow = (await D.page.$$('.lpn-pick-chooser button'))[lakeRows.findIndex((r) => /Pump 10/.test(r))];
		await pumpRow.click(); await D.settle(450);
		ok('...and choosing Pump 10 selects the pump, which that click could not reach before', (await selNow()) === 'l10', await selNow());
		await D.page.evaluate(() => { const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); } });
		// Clear of the other: left of the glyph on the reservoir, right of the reservoir on the glyph.
		const onlyLake = { x: lake.a[0] + 5, y: overlap.y };
		const onlyPump = await D.page.evaluate((a) => {
			// The pump's own ink farthest from the reservoir that is still the pump to the browser's hit test.
			for (let x = a.g[2]; x > a.g[0]; x -= 0.5) {
				for (const y of [a.y, a.y - 2, a.y + 2, a.y - 4, a.y + 4]) {
					const top = document.elementsFromPoint(x, y)[0];
					if (top && top.dataset && top.dataset.link === '10') { return { x, y }; }
				}
			}
			return null;
		}, { g: lake.g, y: overlap.y });
		ok('(the pump\'s far end is more than the 6 px pickbox from the reservoir\'s drawn edge)', !!onlyPump && onlyPump.x - lake.a[2] > 6.5, JSON.stringify([onlyPump, lake.a[2]]));
		await D.page.mouse.click(700, 120); await D.settle(300);
		await D.page.mouse.move(onlyLake.x, onlyLake.y); await D.page.mouse.click(onlyLake.x, onlyLake.y); await D.settle(450);
		ok('a click on the reservoir clear of the pump selects the reservoir with no box', (await rowsNow()).length === 0 && (await selNow()) === 'nLake', JSON.stringify([await rowsNow(), await selNow(), onlyLake]));
		await D.page.evaluate(() => { const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); } });
		await D.page.mouse.move(onlyPump.x, onlyPump.y); await D.page.mouse.click(onlyPump.x, onlyPump.y); await D.settle(450);
		const farRows = await rowsNow();
		ok('a click on the pump\'s free end, clear of the reservoir, selects Pump 10 with no box', farRows.length === 0 && (await selNow()) === 'l10', JSON.stringify([farRows, await selNow(), onlyPump]));
		await D.page.evaluate(() => { const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); } });
		await D.page.mouse.click(700, 120); await D.settle(300);

		// Round 6, Net3's pumps and the junctions at their ends: the box only where the pressed point is on both inks.
		const ends = await D.page.evaluate(() => {
			const out = {};
			[['10', '10'], ['335', '60'], ['335', '61']].forEach((c) => {
				const g = document.querySelector('#lpn_canvas path.lpn-link-symbol-hit[data-link="' + c[0] + '"]'), n = document.querySelector('#lpn_canvas circle.lpn-node[data-node="' + c[1] + '"]');
				if (!g || !n) { return; }
				const nb = n.getBoundingClientRect(), gb = g.getBoundingClientRect(), svg = n.ownerSVGElement, gm = g.getScreenCTM().inverse(), P = svg.createSVGPoint();
				const inG = (x, y) => { P.x = x; P.y = y; return g.isPointInFill(P.matrixTransform(gm)); };
				const cx = nb.left + nb.width / 2, cy = nb.top + nb.height / 2, r = nb.width / 2;
				let free = null, over = null;
				for (let x = gb.left; x <= gb.right; x += 0.5) { for (let y = gb.top; y <= gb.bottom; y += 0.5) {
					if (!inG(x, y)) { continue; }
					const d = Math.hypot(x - cx, y - cy);
					if (d > r + 4 && (!free || d > free.d)) { free = { x, y }; }
					if (d < r - 0.3 && [[0.6, 0], [-0.6, 0], [0, 0.6], [0, -0.6]].every((o) => inG(x + o[0], y + o[1])) && (!over || d < over.d)) { over = { x, y, d }; }   // well inside the glyph, in the disc
				} }
				out[c[0] + '/' + c[1]] = { free, over, centre: { x: cx, y: cy } };
			});
			return out;
		});
		for (const k of Object.keys(ends)) {
			const [lid, nid] = k.split('/'), e = ends[k];
			if (e.free && lid !== '10') {   // Pump 10's far end beside Junction 10 is the Lake's overlap; its free end is tested above
				await D.page.mouse.move(e.free.x, e.free.y); await D.page.mouse.click(e.free.x, e.free.y); await D.settle(450);
				const fr = await rowsNow(), fs = await selNow();
				ok('Pump ' + lid + ' free ink, away from Junction ' + nid + ': selects the pump with no box', fr.length === 0 && fs === 'l' + lid, JSON.stringify([fr, fs, e.free]));
				await D.page.evaluate(() => { const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); } });
				await D.page.mouse.click(700, 120); await D.settle(300);
			}
			if (e.over) {
				await D.page.mouse.move(e.over.x, e.over.y); await D.page.mouse.click(e.over.x, e.over.y); await D.settle(450);
				const orows = await rowsNow();
				ok('Pump ' + lid + ' overlapping Junction ' + nid + ', pressed on the overlap: the box of the two', orows.length === 2 && orows.some((x) => x === 'Pump ' + lid) && orows.some((x) => x === 'Junction ' + nid), JSON.stringify(orows));
				await D.page.keyboard.press('Escape'); await D.settle(200);
				await D.page.mouse.click(700, 120); await D.settle(300);
			} else {
				// No clear overlap (a sliver under 0.6 px counts as none): the junction is the junction, pressed at its centre, and no box opens.
				await D.page.mouse.move(e.centre.x, e.centre.y); await D.page.mouse.click(e.centre.x, e.centre.y); await D.settle(450);
				const cr = await rowsNow(), cs = await selNow();
				ok('Pump ' + lid + ' and Junction ' + nid + ' share no clear overlap at this view: a press on the junction selects it with no box', cr.length === 0 && cs === 'n' + nid, JSON.stringify([cr, cs, e.centre]));
				await D.page.evaluate(() => { const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); } });
				await D.page.mouse.click(700, 120); await D.settle(300);
			}
		}

		// Near, not touching (Perry, 2026-11-16): the pump 335 neighbours Junction 601 and Reservoir River are not under its ink.
		for (const id of ['601', 'River']) {
			const c = await D.page.evaluate((id) => { const e = document.querySelector('#lpn_canvas circle.lpn-node[data-node="' + id + '"], #lpn_canvas .lpn-node[data-node="' + id + '"]'); if (!e) { return null; } const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, id);
			await D.page.mouse.move(c.x, c.y); await D.page.mouse.click(c.x, c.y); await D.settle(450);
			const rr = await rowsNow();
			ok('at the opening view a click on ' + id + ', near pump 335 but clear of its ink, lists no pump', !rr.some((x) => /^Pump /.test(x)), JSON.stringify(rr));
			await D.page.evaluate(() => { const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); } });
			await D.page.keyboard.press('Escape'); await D.settle(200);
		}
		// Tank 3 over Junction 20: pressed on a point inside both (the disc's upper half is on the tank's ink).
		{
			const o = await D.page.evaluate(() => {
				const t = document.querySelector('#lpn_canvas path.lpn-node-hit[data-node="3"]').getBoundingClientRect(), j = document.querySelector('#lpn_canvas circle.lpn-node[data-node="20"]').getBoundingClientRect();
				return { x: j.left + j.width / 2, y: (Math.max(t.top, j.top) + Math.min(t.bottom, j.bottom)) / 2 };
			});
			await D.page.mouse.move(o.x, o.y); await D.page.mouse.click(o.x, o.y); await D.settle(450);
			const r20 = await rowsNow();
			ok('Tank 3 over Junction 20, pressed where both are drawn: the box of those two and no pipe', r20.length === 2 && r20.some((x) => /Tank 3/.test(x)) && r20.some((x) => /Junction 20/.test(x)), JSON.stringify([r20, o]));
			await D.page.keyboard.press('Escape'); await D.settle(200);
			await D.page.evaluate(() => { const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); } });
			await D.page.mouse.click(700, 120); await D.settle(300);
		}
		console.log('\nA. Desktop, a mouse, Net3, a click on every node centre');
		await D.page.evaluate(() => { const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); } });
		await D.page.mouse.click(700, 120); await D.settle(300);
		for (const [label, notches] of [['the opening view', 0], ['4 notches out', 4], ['8 notches out', 4], ['12 notches out', 4], ['20 notches out', 8]]) {
			await zoomOut(D, notches);
			const r = await sweep(D, false);
			console.log('  NUMBERS ' + label + ': ' + JSON.stringify(r));
			ok(label + ' (network ' + r.width + ' px wide): ' + r.n + ' node-centre clicks open ' + r.boxes + ' boxes, at most ' + r.maxRows + ' rows', r.n >= 90, JSON.stringify(r));
			ok('...every box lists two to six rows and no pipe (Net3 has no zero-length pipe)', r.shortBoxes === 0 && r.maxRows <= 6 && r.pipeRows === 0, JSON.stringify(r));
			ok('...and every click without a box selects the node it is on', r.quietWrong === 0, JSON.stringify(r));
			if (notches === 0) { ok('...at the opening view only the places where two symbols are drawn touching open one (measured 7 of 97: three tank or pump over junction; at most 8)', r.boxes <= 8, JSON.stringify(r)); }
		}
		await D.page.close();

		console.log('\nB. Phone, 390 x 844, a finger, Net3, 8 notches out');
		const T = await Session.open(browser, NAME + '-p', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
		await open(T);
		await zoomOut(T, 8);
		const r = await sweep(T, true);
		console.log('  NUMBERS phone 8 notches out: ' + JSON.stringify(r));
		ok('8 notches out (network ' + r.width + ' px wide): ' + r.n + ' node-centre taps open ' + r.boxes + ' boxes', r.n >= 50, JSON.stringify(r));
		ok('...every box lists two to six rows and no pipe (Net3 has no zero-length pipe)', r.shortBoxes === 0 && r.maxRows <= 6 && r.pipeRows === 0, JSON.stringify(r));
		ok('...and every tap without a box selects the node it is on', r.quietWrong === 0, JSON.stringify(r));
		await T.page.close();

		console.log('\nB3. Phone, a finger is a disc: Pump 335 beside Junctions 60 and 61, a lone junction, Tank 1');
		const F = await Session.open(browser, NAME + '-p3', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
		await open(F);
		const fRows = () => F.page.$$eval('.lpn-pick-chooser button', (bs) => bs.map((b) => b.textContent.trim()));
		const fSel = () => F.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas .lpn-selected')).map((e) => e.dataset.node ? 'n' + e.dataset.node : (e.dataset.link !== undefined ? 'l' + e.dataset.link : (e.nextElementSibling && e.nextElementSibling.dataset.link !== undefined ? 'l' + e.nextElementSibling.dataset.link : 'x'))).sort().join(','));
		const fClear = async () => { await F.page.evaluate(() => { document.querySelectorAll('.lpn-pane-ctxmenu').forEach((m) => m.remove()); const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); } }); await F.page.touchscreen.tap(380, 835); await F.settle(300); };
		const mid = (sel) => F.page.evaluate((q) => { const e = document.querySelector(q); if (!e) { return null; } const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, sel);
		const pump = async (done) => {
			// A point on the pump's own ink, outside the disc of every node and every other glyph: the farthest such from the nodes.
			const g = await F.page.evaluate(() => {
				const gl = document.querySelector('#lpn_canvas path.lpn-link-symbol-hit[data-link="335"]'), P = gl.ownerSVGElement.createSVGPoint(), gm = gl.getScreenCTM().inverse(), b = gl.getBoundingClientRect();
				const discs = Array.from(document.querySelectorAll('#lpn_canvas circle.lpn-node[data-node]')).map((e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 + 1 }; });
				let best = null;
				for (let x = b.left; x <= b.right; x += 0.25) { for (let y = b.top; y <= b.bottom; y += 0.25) {
					P.x = x; P.y = y;
					if (!gl.isPointInFill(P.matrixTransform(gm))) { continue; }
					const d = Math.min.apply(null, discs.map((c) => Math.hypot(x - c.x, y - c.y) - c.r));
					if (d > 0 && (!best || d > best.d)) { best = { x, y, d }; }
				} }
				return best;
			});
			ok(done + ' notches out: Pump 335 has ink clear of every node disc', !!g, JSON.stringify(g));
			if (!g) { return; }
			await F.page.touchscreen.tap(g.x, g.y); await F.settle(600);
			const rr = await fRows(), ss = await fSel();
			ok(done + ' notches out: a tap on Pump 335\'s ink selects the pump with no box', rr.length === 0 && ss === 'l335', JSON.stringify([rr, ss, g]));
			await fClear();
		};
		// Where the pump's ink overlaps a junction's disc: the box.
		const overlapN61 = async (done) => {
			const o = await F.page.evaluate(() => {
				const g = document.querySelector('#lpn_canvas path.lpn-link-symbol-hit[data-link="335"]'), n = document.querySelector('#lpn_canvas circle.lpn-node[data-node="61"]');
				const gb = g.getBoundingClientRect(), nb = n.getBoundingClientRect(), P = g.ownerSVGElement.createSVGPoint(), gm = g.getScreenCTM().inverse();
				const cx = nb.left + nb.width / 2, cy = nb.top + nb.height / 2, r = nb.width / 2 - 0.5;
				let best = null;
				for (let x = gb.left; x <= gb.right; x += 0.25) { for (let y = gb.top; y <= gb.bottom; y += 0.25) {
					P.x = x; P.y = y;
					const d = Math.hypot(x - cx, y - cy);
					if (d < r && g.isPointInFill(P.matrixTransform(gm)) && (!best || d < best.d)) { best = { x, y, d }; }
				} }
				return best;
			});
			ok(done + ' notches out: Pump 335\'s ink overlaps Junction 61\'s disc somewhere', !!o, JSON.stringify(o));
			if (!o) { return; }
			await F.page.touchscreen.tap(o.x, o.y); await F.settle(600);
			const rr = await fRows();
			ok(done + ' notches out: a tap where Pump 335\'s ink overlaps Junction 61 opens the box listing both', rr.includes('Pump 335') && rr.includes('Junction 61'), JSON.stringify([rr, o]));
			await fClear();
		};
		// A lone junction at the opening view: no other node, glyph or Text within 34 px of it (past the finger's 24).
		{
			const lone = await F.page.evaluate(() => {
				const pts = [];
				document.querySelectorAll('#lpn_canvas [data-node], #lpn_canvas path.lpn-link-symbol-hit, #lpn_canvas [data-lbl]').forEach((e) => { const b = e.getBoundingClientRect(); if (b.width > 0) { pts.push({ id: e.dataset.node, junction: e.tagName === 'circle' && e.dataset.node !== undefined, l: b.left, t: b.top, r: b.right, b: b.bottom, x: b.left + b.width / 2, y: b.top + b.height / 2 }); } });
				const near = (a, o) => Math.max(o.l - a.r, 0, a.l - o.r) < 34 && Math.max(o.t - a.b, 0, a.t - o.b) < 34;
				return pts.filter((a) => a.junction && a.x > 20 && a.x < 370 && a.y > 20 && a.y < 800 && document.elementsFromPoint(a.x, a.y)[0].dataset.node === a.id && !pts.some((o) => o !== a && o.id !== a.id && near(a, o)))[0] || null;
			});
			ok('(at the opening view Net3 has a junction with nothing within 34 px)', !!lone, JSON.stringify(lone));
			if (lone) {
				await F.page.touchscreen.tap(lone.x, lone.y); await F.settle(600);
				const rr = await fRows(), ss = await fSel();
				ok('a tap on the lone Junction ' + lone.id + ' selects it with no box', rr.length === 0 && ss === 'n' + lone.id, JSON.stringify([rr, ss]));
				await fClear();
			}
		}
		await pump(0); await overlapN61(0);
		await zoomOut(F, 4);
		await pump(4); await overlapN61(4);
		{
			const t1 = await mid('#lpn_canvas path.lpn-node-hit[data-node="1"]');
			await F.page.touchscreen.tap(t1.x, t1.y); await F.settle(600);
			const rr = await fRows();
			ok('a tap on Tank 1\'s ink, 4 notches out, gives its box: the tank and the junction it hides', rr.length >= 2 && rr[0] === 'Tank 1' && rr.includes('Junction 40'), JSON.stringify([rr, t1]));
			await fClear();
		}
		await zoomOut(F, 4);
		await pump(8); await overlapN61(8);
		await F.page.close();

		console.log('\nB2. Phone, the opening view: the Lake is off the left edge until panned; a real tap on the Lake over Pump 10 opens the box');
		const P = await Session.open(browser, NAME + '-p2', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
		await open(P);
		const lakeBox = () => P.page.evaluate(() => {
			const r = (s) => document.querySelector(s).getBoundingClientRect(), a = r('#lpn_canvas circle.lpn-node[data-node="Lake"]'), b = r('#lpn_canvas path.lpn-link-symbol-hit[data-link="10"]');
			return { a: [a.left, a.top, a.right, a.bottom], b: [b.left, b.top, b.right, b.bottom] };
		});
		const before = await lakeBox();
		ok('at the opening view on a phone the Lake is off the left edge (a tap there is a tap on nothing)', before.a[2] < 0, JSON.stringify(before));
		const pcdp = await P.page.context().newCDPSession(P.page);
		await pcdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 60, y: 600, id: 1 }] });
		for (let i = 1; i <= 10; i++) { await pcdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 60 + i * 30, y: 600, id: 1 }] }); await sleep(25); }
		await pcdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
		await P.settle(600);
		const lk = await lakeBox();
		const at = await P.page.evaluate(() => {
			const r = document.querySelector('#lpn_canvas path.lpn-node-hit[data-node="Lake"]'), g = document.querySelector('#lpn_canvas path.lpn-link-symbol-hit[data-link="10"]');
			const rb = r.getBoundingClientRect(), gb = g.getBoundingClientRect(), svg = r.ownerSVGElement, Pt = svg.createSVGPoint(), rm = r.getScreenCTM().inverse(), gm = g.getScreenCTM().inverse();
			const has = (e, m, x, y, o) => { Pt.x = x + o[0]; Pt.y = y + o[1]; return e.isPointInFill(Pt.matrixTransform(m)); };
			const offs = [[0, 0], [1.2, 0], [-1.2, 0], [0, 1.2], [0, -1.2]];
			let best = { x: -1, y: -1 };
			for (let x = Math.max(rb.left, gb.left); x <= Math.min(rb.right, gb.right); x += 0.5) {
				for (let y = Math.max(rb.top, gb.top); y <= Math.min(rb.bottom, gb.bottom); y += 0.5) {
					if (offs.every((o) => has(r, rm, x, y, o) && has(g, gm, x, y, o))) { best = { x, y }; }
				}
			}
			return best;
		});
		ok('...panned by a finger, the Lake is on screen', at.x > 0 && at.x < 390, JSON.stringify(at));
		await P.page.touchscreen.tap(at.x, at.y);
		await P.settle(700);
		const lrows = await P.page.$$eval('.lpn-pick-chooser button', (bs) => bs.map((b) => b.textContent.trim()));
		ok('a tap (touchscreen.tap) where the reservoir overlaps the pump opens the box of the two', lrows.length === 2 && lrows.some((x) => /Lake/.test(x)) && lrows.some((x) => /Pump 10/.test(x)), JSON.stringify(lrows));
		await P.page.close();

		ok('no page error', errors.length === 0, errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(failures ? '\nFAILED: ' + failures + ' of ' + checks : '\nALL PASS (' + checks + ' checks)');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
