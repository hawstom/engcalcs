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
//      Tank 1 at 4 notches out gives its box;
//   B4. phone 412 x 915 at 2.6x, 12 notches out (the cluster is a few px across): a tap on the ink of Pump 335 and a junction
//      opens the box; a tap on no ink beside Junction 61 selects the junction, and one beside the pump's glyph selects the pump, not the reservoir whose band lies over the cluster.
//   B5. phone 412 x 915 at 2.6x, at the opening view and 8 notches out (Tom, 2026-11-19: "I can't select the pipes even though
//      they are clearly visible"): a tap on a pipe's line, or 3 px off it, near either end and clear of every symbol's
//      ink, selects that pipe (it gave the junction while only symbols counted as nearby ink);
//   B6. the same views: a tap 2 or 3 px from a junction's centre gives the junction (or its box), and a drag from 3 px off its
//      centre moves it (TOUCH_NODE_MIN_PX: a pipe's line does not take a junction's own ground).
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

		console.log('\nB4. Phone 412 x 915 at 2.6x, a finger, zoomed far out (Tom, 2026-11-18): River, Pump 335 and Junctions 60 and 61 are a few px across');
		const X = await Session.open(browser, NAME + '-p4', { viewport: { width: 412, height: 915 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2.6 });
		await open(X);
		await zoomOut(X, 12);
		const xRows = () => X.page.$$eval('.lpn-pick-chooser button', (bs) => bs.map((b) => b.textContent.trim()));
		const xSel = () => X.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas .lpn-selected')).map((e) => e.dataset.node ? 'n' + e.dataset.node : (e.dataset.link !== undefined ? 'l' + e.dataset.link : (e.nextElementSibling && e.nextElementSibling.dataset.link !== undefined ? 'l' + e.nextElementSibling.dataset.link : 'x'))).sort().join(','));
		// A known-empty map point, far from every node and glyph (the browser answers the bare svg): the deselect tap goes there.
		const empty = await X.page.evaluate(() => {
			const cv = document.getElementById('lpn_canvas'), r = cv.getBoundingClientRect(), pts = Array.from(document.querySelectorAll('#lpn_canvas [data-node], #lpn_canvas path.lpn-link-symbol-hit')).map((e) => e.getBoundingClientRect());
			for (let x = r.left + 12; x < r.right - 12; x += 12) { for (let y = r.top + 12; y < r.bottom - 12; y += 12) {
				const t = document.elementFromPoint(x, y);
				if ((t === cv || (t && t.id === 'lpn_canvas')) && pts.every((b) => x < b.left - 60 || x > b.right + 60 || y < b.top - 60 || y > b.bottom + 60)) { return { x, y }; }
			} }
			return null;
		});
		ok('(the page has a known-empty map point for the deselect tap)', !!empty, JSON.stringify(empty));
		const xTap = async (x, y) => {
			await X.page.touchscreen.tap(x, y); await X.settle(450);
			const out = { rows: await xRows(), sel: await xSel() };
			await X.page.evaluate(() => { document.querySelectorAll('.lpn-pane-ctxmenu').forEach((m) => m.remove()); const c = document.getElementById('lpn_popup_close'); if (c) { c.click(); } });
			// Deselect with Escape (a tap on bare map does not clear a selection) and require the known-empty point to be bare map again,
			// so no box or popup is left over the cluster.
			await X.page.keyboard.press('Escape'); await X.settle(300);
			out.clear = (await xSel()) === '' && (await xRows()).length === 0 && await X.page.evaluate((e) => { const t = document.elementFromPoint(e.x, e.y); return !!t && t.id === 'lpn_canvas'; }, empty);
			return out;
		};
		// The cluster's own ink, read from the drawing: the pump glyph's fill and each junction disc, at 0.5 px.
		const cl = await X.page.evaluate(() => {
			const g = document.querySelector('#lpn_canvas path.lpn-link-symbol-hit[data-link="335"]'), P = g.ownerSVGElement.createSVGPoint(), gm = g.getScreenCTM().inverse(), gb = g.getBoundingClientRect();
			const disc = (id) => { const b = document.querySelector('#lpn_canvas circle.lpn-node[data-node="' + id + '"]').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, r: b.width / 2 }; };
			const d60 = disc('60'), d61 = disc('61'), pump = [], over = [], rv = document.querySelector('#lpn_canvas path.lpn-node-hit[data-node="River"]').getBoundingClientRect();
			const inPump = (x, y) => { P.x = x; P.y = y; return g.isPointInFill(P.matrixTransform(gm)); };
			for (let x = gb.left - 1; x <= gb.right + 1; x += 0.5) { for (let y = gb.top - 1; y <= gb.bottom + 1; y += 0.5) {
				if (!inPump(x, y)) { continue; }
				pump.push({ x, y });
				const i60 = Math.hypot(x - d60.x, y - d60.y) < d60.r + 0.4, i61 = Math.hypot(x - d61.x, y - d61.y) < d61.r + 0.4;
				if (i60 || i61) { over.push({ x, y, n: i60 ? '60' : '61' }); }
			} }
			// A point 0.6 to 1.2 px off the pump's ink, off both dots' ink, nearer the pump than either dot, below the reservoir's drawing
			// (its tip is the bottom of its box), and where the browser's hit is the reservoir's band.
			const nearPump = (x, y) => { let m = Infinity; for (let a = 0; a < 16; a++) { for (const rr of [0.4, 0.8, 1.2, 1.6, 2.0]) { if (inPump(x + rr * Math.cos(a * Math.PI / 8), y + rr * Math.sin(a * Math.PI / 8))) { m = Math.min(m, rr); } } } return m; };
			let beside = null;
			for (let x = gb.left - 3; x <= gb.right + 3; x += 0.25) { for (let y = Math.max(gb.top - 3, rv.bottom + 0.3); y <= gb.bottom + 3; y += 0.25) {
				const m = nearPump(x, y), t = document.elementFromPoint(x, y), dd = (d) => Math.hypot(x - d.x, y - d.y) - d.r - 0.6;
				if (!inPump(x, y) && m <= 1.2 && dd(d60) > m + 0.5 && dd(d61) > m + 0.5 && t && t.dataset && t.dataset.node === 'River' && (!beside || m < beside.m)) { beside = { x, y, m }; }
			} }
			return { d60, d61, w: gb.width, h: gb.height, pump: pump.length, over, beside, rvBottom: rv.bottom,
				hitAtJ61: (() => { const t = document.elementFromPoint(d61.x + 1.5, d61.y + 2); return t && t.dataset ? (t.dataset.node || '') : ''; })(),
				fillAtJ61: inPump(d61.x + 1.5, d61.y + 2) };
		});
		ok('12 notches out: Pump 335 is a few px across (' + cl.w.toFixed(1) + ' x ' + cl.h.toFixed(1) + ') and its ink overlaps a junction dot somewhere', cl.w < 8 && cl.over.length > 0, JSON.stringify({ w: cl.w, h: cl.h, over: cl.over.length }));
		for (const n of ['60', '61']) {
			const pts = cl.over.filter((o) => o.n === n);
			ok('...Pump 335 and Junction ' + n + ' have ink in common', pts.length > 0, String(pts.length));
			if (!pts.length) { continue; }
			const o = pts[Math.floor(pts.length / 2)], res = await xTap(o.x, o.y);
			ok('...a tap on the ink of Pump 335 and Junction ' + n + ' opens the box of the two', res.rows.includes('Pump 335') && res.rows.includes('Junction ' + n) && res.clear, JSON.stringify([res, o]));
		}
		// A press on no ink, a few px from Junction 61 and under the reservoir's tip: the reservoir's band lies over the cluster,
		// but the nearest drawn thing is the junction, so a finger meant it.
		ok('...2 px below Junction 61 is no ink (not the pump, outside the dot, below the reservoir) and the browser hit is the reservoir band', !cl.fillAtJ61 && cl.d61.y + 2 > cl.rvBottom && cl.hitAtJ61 === 'River', JSON.stringify([cl.fillAtJ61, cl.hitAtJ61, cl.rvBottom]));
		{
			const res = await xTap(cl.d61.x + 1.5, cl.d61.y + 2);
			ok('...a tap on no ink 2 px below Junction 61 selects Junction 61, not the reservoir whose band it falls in', res.rows.length === 0 && res.sel === 'n61' && res.clear, JSON.stringify([res, cl.d61]));
		}
		// Tom's "I can't select Pump 335": a press on no ink just beside the pump's glyph, inside the reservoir's band, is the pump's.
		ok('...a point 1 px beside Pump 335\'s glyph, off every ink, nearer the pump than either dot, under the reservoir\'s band, exists', !!cl.beside, JSON.stringify(cl.beside));
		if (cl.beside) {
			const res = await xTap(cl.beside.x, cl.beside.y);
			ok('...a tap there selects Pump 335, with no box', res.rows.length === 0 && res.sel === 'l335' && res.clear, JSON.stringify([res, cl.beside]));
		}
		await X.page.close();

		console.log('\nB5. Phone 412 x 915 at 2.6x, a finger on a visible pipe (Tom, 2026-11-19: "I can\'t select the pipes even though they are clearly visible")');
		const Y = await Session.open(browser, NAME + '-p5', { viewport: { width: 412, height: 915 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2.6 });
		await open(Y);
		// Points where a finger is plainly on a pipe: on its drawn line (or 3 px off it, inside its 6 px band), within the
		// finger's 24 px of a junction's ink (where the old rule gave the junction), more than 1.5 px clear of every symbol's
		// ink and of every other pipe's line, so nothing else drawn is as near.
		const pipePts = () => Y.page.evaluate(() => {
			const cv = document.getElementById('lpn_canvas'), cr = cv.getBoundingClientRect(), P = cv.createSVGPoint();
			const pipes = Array.from(document.querySelectorAll('#lpn_canvas polyline.lpn-link.lpn-link-pipe[data-link]')).filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 || b.height > 0; }).map((e) => {
				const m = e.getScreenCTM();
				return { id: e.dataset.link, hw: parseFloat(getComputedStyle(e).strokeWidth) * Math.abs(m.a) / 2, pts: e.getAttribute('points').trim().split(/\s+/).map((t) => { const a = t.split(','); return { x: m.a * a[0] + m.c * a[1] + m.e, y: m.b * a[0] + m.d * a[1] + m.f }; }) };
			});
			const segD = (x, y, a, b) => { const dx = b.x - a.x, dy = b.y - a.y, L = dx * dx + dy * dy, t = L ? Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / L)) : 0; return Math.hypot(x - a.x - t * dx, y - a.y - t * dy); };
			const lineD = (q, x, y) => { let d = Infinity; for (let i = 0; i + 1 < q.pts.length; i++) { d = Math.min(d, segD(x, y, q.pts[i], q.pts[i + 1])); } return d - q.hw; };
			const discs = Array.from(document.querySelectorAll('#lpn_canvas circle.lpn-node[data-node]')).map((e) => { const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, r: b.width / 2 + 0.6 }; }).filter((d) => d.r > 0.6);
			const centres = Array.from(document.querySelectorAll('#lpn_canvas circle.lpn-node[data-node]')).map((e) => { const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
			const fills = Array.from(document.querySelectorAll('#lpn_canvas path.lpn-node-hit[data-node], #lpn_canvas path.lpn-link-symbol-hit')).filter((e) => e.getBoundingClientRect().width > 0).map((e) => ({ e, b: e.getBoundingClientRect(), m: e.getScreenCTM().inverse() }));
			const symD = (x, y) => {
				let d = Math.min.apply(null, discs.map((c) => Math.hypot(x - c.x, y - c.y) - c.r));
				fills.forEach((f) => { if (x > f.b.left - 2 && x < f.b.right + 2 && y > f.b.top - 2 && y < f.b.bottom + 2) { for (const [ox, oy] of [[0, 0], [1.5, 0], [-1.5, 0], [0, 1.5], [0, -1.5]]) { P.x = x + ox; P.y = y + oy; if (f.e.isPointInFill(P.matrixTransform(f.m))) { d = Math.min(d, ox || oy ? 1 : -1); } } } });
				return d;
			};
			const out = [];
			pipes.forEach((q) => {
				// From each end, 10 px along the pipe (or a third of a short one), on the line and 3 px off it
				const n = q.pts.length;
				for (const [a, b] of [[q.pts[0], q.pts[1]], [q.pts[n - 1], q.pts[n - 2]]]) {
					const L = Math.hypot(b.x - a.x, b.y - a.y);
					if (L < 12) { continue; }
					const ux = (b.x - a.x) / L, uy = (b.y - a.y) / L, along = Math.min(10, L / 3);
					for (const off of [0, 3]) {
						const x = a.x + ux * along - uy * off, y = a.y + uy * along + ux * off;
						if (x < cr.left + 8 || x > cr.right - 8 || y < cr.top + 70 || y > cr.bottom - 10) { continue; }
						const top = document.elementFromPoint(x, y); if (!top || !top.closest('#lpn_canvas')) { continue; }
						const mine = Math.max(0, lineD(q, x, y)), sd = symD(x, y);
						// Not within a junction's own ground (TOUCH_NODE_MIN_PX = 5 px of its centre, plus a pixel): B6 holds that side.
					if (centres.some((c) => Math.hypot(x - c.x, y - c.y) <= 6)) { continue; }
					if (sd - mine < 1.5 || sd > 24 || pipes.some((o) => o !== q && lineD(o, x, y) - mine < 1.5)) { continue; }
						out.push({ id: q.id, x, y, off });
					}
				}
			});
			return out;
		});
		const ySel = () => Y.page.evaluate(() => { const r = Array.from(document.querySelectorAll('#lpn_canvas .lpn-selected')).map((e) => e.dataset.node ? 'n' + e.dataset.node : (e.dataset.link !== undefined ? 'l' + e.dataset.link : (e.nextElementSibling && e.nextElementSibling.dataset.link !== undefined ? 'l' + e.nextElementSibling.dataset.link : 'x'))); return r.filter((v, i) => r.indexOf(v) === i).sort().join(','); });
		// **A PRESS, READ AT ONCE, THEN CANCELLED.** A finger's press is decided on the way down (touchNodeOver(), Task 415) and a
		// tap's lift opens the Properties box, which on a phone docks over most of the map and would take the next taps; so each
		// point is pressed, what it selected is read, and the press is cancelled; then a press on bare map clears it. A press that
		// would open the chooser selects nothing yet, and reads as ''.
		const yCdp = await Y.page.context().newCDPSession(Y.page);
		const yBare = () => Y.page.evaluate(() => {
			const cv = document.getElementById('lpn_canvas'), r = cv.getBoundingClientRect();
			const bareAt = (x, y) => { const e = document.elementFromPoint(x, y); return !!e && !!e.closest('#lpn_canvas') && !e.closest('[data-node],[data-link],[data-lbl],[data-nodelbl],[data-linklbl],[data-shape],[data-cust]'); };
			for (let y = r.top + 80; y < r.bottom - 20; y += 7) { for (let x = r.left + 10; x < r.right - 10; x += 7) {
				let ok = bareAt(x, y);
				for (let dx = -30; dx <= 30 && ok; dx += 3) { for (let dy = -30; dy <= 30 && ok; dy += 3) { if (!bareAt(x + dx, y + dy)) { ok = false; } } }
				if (ok) { return { x, y }; }
			} }
			return null;
		});
		const yPress = async (x, y, bare) => {
			await yCdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
			const sel = await ySel();
			await yCdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
			if (sel && bare) { await yCdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: bare.x, y: bare.y, id: 1 }] }); await yCdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] }); }
			return sel;
		};
		const yOnMap = (x, y) => Y.page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return !!(e && e.closest('#lpn_canvas')); }, [x, y]);
		const pipeTaps = async (label) => {
			await Y.page.evaluate(() => { const c = document.getElementById('lpn_popup_close'); if (c) { c.click(); } });
			const bare = await yBare();
			const pts = (await pipePts()).slice(0, 40);
			const wrong = [];
			let tapped = 0;
			for (const q of pts) {
				if (!(await yOnMap(q.x, q.y))) { continue; }
				tapped++;
				const sel = await yPress(q.x, q.y, bare);
				if (sel !== 'l' + q.id) { wrong.push(q.id + (q.off ? '+3px' : '') + '->' + (sel || 'nothing or box') + '@' + q.x.toFixed(1) + ',' + q.y.toFixed(1)); }
			}
			ok(label + ': ' + tapped + ' presses on a pipe\'s line or 3 px off it, beside a junction, each select that pipe', tapped >= 10 && wrong.length === 0, wrong.slice(0, 8).join(' '));
		};
		// B6. The other side of the same balance (Task 562: *"many times pipes would edit when I was trying to edit nodes"*): a
		// finger 2 or 3 px from a junction's centre, on the pipes through it or beside them, still gets the junction (or the
		// box, where it is drawn over another symbol), and a drag from 3 px off its centre moves it.
		const junctionTaps = async (label) => {
			await Y.page.evaluate(() => { const c = document.getElementById('lpn_popup_close'); if (c) { c.click(); } });
			const bare = await yBare();
			const pts = await Y.page.evaluate(() => {
				const cv = document.getElementById('lpn_canvas'), cr = cv.getBoundingClientRect(), P = cv.createSVGPoint();
				const discs = Array.from(document.querySelectorAll('#lpn_canvas circle.lpn-node[data-node]')).map((e) => { const b = e.getBoundingClientRect(); return { id: e.dataset.node, x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
				const fills = Array.from(document.querySelectorAll('#lpn_canvas path.lpn-node-hit[data-node], #lpn_canvas path.lpn-link-symbol-hit')).filter((e) => e.getBoundingClientRect().width > 0).map((e) => ({ e, m: e.getScreenCTM().inverse() }));
				const onFill = (x, y) => fills.some((f) => { P.x = x; P.y = y; return f.e.isPointInFill(P.matrixTransform(f.m)); });
				const out = [];
				discs.forEach((d) => {
					if (d.x < cr.left + 8 || d.x > cr.right - 48 || d.y < cr.top + 70 || d.y > cr.bottom - 10) { return; }
					if (discs.some((o) => o !== d && Math.hypot(o.x - d.x, o.y - d.y) < 10)) { return; }
					[[2, 0], [0, 2], [-3, 0], [0, -3]].forEach(([ox, oy]) => {
						const x = d.x + ox, y = d.y + oy, t = document.elementFromPoint(x, y);
						// Clear of every other symbol's ink by 4 px, so this junction is the nearest drawn thing.
						const near = [[0, 0], [4, 0], [-4, 0], [0, 4], [0, -4], [3, 3], [-3, 3], [3, -3], [-3, -3]].some(([a, b]) => onFill(x + a, y + b));
						if (t && t.closest('#lpn_canvas') && !near) { out.push({ id: d.id, x, y }); }
					});
				});
				return out;
			});
			const wrong = [];
			let tapped = 0;
			for (const q of pts.slice(0, 60)) {
				if (!(await yOnMap(q.x, q.y))) { continue; }
				tapped++;
				const sel = await yPress(q.x, q.y, bare);
				if (sel !== 'n' + q.id && sel !== '') { wrong.push(q.id + '->' + sel + '@' + q.x.toFixed(1) + ',' + q.y.toFixed(1)); }
			}
			ok(label + ': ' + tapped + ' presses 2 or 3 px from a junction\'s centre each give that junction (or its box)', tapped >= 10 && wrong.length === 0, wrong.slice(0, 8).join(' '));
			// A drag from 3 px off the centre of three junctions moves each (and Undo puts it back).
			let moved = 0, tried = 0;
			for (const q of pts.filter((p, i, a) => a.findIndex((o) => o.id === p.id) === i).slice(0, 3)) {
				const at = () => Y.page.evaluate((id) => { const b = document.querySelector('#lpn_canvas circle.lpn-node[data-node="' + id + '"]').getBoundingClientRect(); return b.left + b.width / 2; }, q.id);
				const x0 = await at(), sx = x0 + 3;
				const cy = await Y.page.evaluate((id) => { const b = document.querySelector('#lpn_canvas circle.lpn-node[data-node="' + id + '"]').getBoundingClientRect(); return b.top + b.height / 2; }, q.id);
				await yCdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: sx, y: cy, id: 1 }] });
				for (let i = 1; i <= 6; i++) { await yCdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: sx + i * 5, y: cy, id: 1 }] }); await sleep(16); }
				await yCdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await Y.settle(200);
				tried++;
				if ((await at()) - x0 > 20) { moved++; await Y.page.keyboard.press('Control+z'); await Y.settle(250); }
				await Y.page.evaluate(() => { const c = document.getElementById('lpn_popup_close'); if (c) { c.click(); } });
			}
			ok(label + ': a finger dragging from 3 px off a junction\'s centre moves it (' + moved + ' of ' + tried + ')', tried >= 2 && moved === tried, '');
		};
		await pipeTaps('the opening view');
		await junctionTaps('the opening view');
		await zoomOut(Y, 8);
		await pipeTaps('8 notches out');
		await junctionTaps('8 notches out');
		await Y.page.close();

		ok('no page error', errors.length === 0, errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(failures ? '\nFAILED: ' + failures + ' of ' + checks : '\nALL PASS (' + checks + ' checks)');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
