// THE SI TWINS OF Net2 AND Net3 SOLVE LIKE THEIR US ORIGINALS (ROADMAP Task 786). Run with:
//   node dev/lpn-spike/si-example-equivalence-harness.js
//
// Tom, 2026-10-11: convert Net2 and Net3 to SI. A converted file can be wrong silently -- a flow
// column left in gpm, a control threshold still in feet -- and open, draw and solve without a
// complaint. So each pair is opened the way the gallery opens it (migrateSaved, applySaved), built
// into the page's own model (assembleModel), and run three ways:
//   1. THE MODELS: every element's elevation, demand, length, diameter, tank level and pump point,
//      in the SI the engines read, compared one number at a time (this is where rounding shows).
//   2. A SINGLE INSTANT, by the built-in solver, where it can solve the network at all.
//   3. THE EXTENDED-PERIOD RUN through EPANET, every node head, tank level and link flow at every
//      reporting step, controls firing and tanks moving.
// Worst RELATIVE differences are printed and bounded. A mutation (one control threshold left in
// feet) must be caught, so the comparison can fail.
'use strict';

const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');
global.alert = global.window.alert = function () { };

const L = loadLoopedNetwork(
	"\t\tmigrateSaved: migrateSaved, applySaved: applySaved,\n" +
	"\t\tassembleModel: assembleModel,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
const EC = global.EngCalcs;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
// A relative difference that does not blow up where the quantity is ~0: scaled by the larger of
// the two values and by `floor`, the smallest value worth a relative statement in that quantity.
const rel = (a, b, floor) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), floor);
const worst = () => ({ v: 0, at: '' });
const note = (w, v, at) => { if (v > w.v) { w.v = v; w.at = at; } };

function open(file, edit) {
	setUnitSet(/-SI/.test(file) ? 'si' : 'us');
	const saved = JSON.parse(fs.readFileSync(ROOT + 'examples/' + file, 'utf8'));
	if (edit) { edit(saved); }
	L.applySaved(L.migrateSaved(saved));
	return L.assembleModel();
}

// Floors, in SI: below these a number is rounding dust (1 mm of head, 1 mL/s of flow).
// A flow is judged as EPANET's own convergence is: a tolerance relative to the flow plus a floor of
// 0.001 L/s, because a loop's small flows are the difference of larger ones and amplify rounding.
const MODEL_REL = 1e-5, HEAD_ABS = 0.005, FLOW_REL = 1e-4, FLOW_ABS = 1e-6;

(async function () {
	await warmEpanet();
	await EC.lpnEpanetLoad('file://' + ROOT + 'js/vendor/epanet-js.js');
	const summary = [];

	for (const net of ['Net3', 'Net2']) {
		console.log('\n== ' + net + ': US original against its SI twin');
		const us = open(net + '.lwn'), si = open(net + '-SI.lwn');

		// 1. THE MODELS ---------------------------------------------------------------------
		const wm = worst();
		const num = (a, b, at, floor) => {
			if (typeof a !== 'number' && typeof b !== 'number') { return; }
			note(wm, rel(a, b, floor), at);
		};
		ok('same node and link ids, in order',
			us.nodes.map((n) => n.id).join() === si.nodes.map((n) => n.id).join()
			&& us.links.map((l) => l.id).join() === si.links.map((l) => l.id).join());
		us.nodes.forEach((a, i) => {
			const b = si.nodes[i];
			['elev', 'head', 'level', 'minLevel', 'maxLevel', 'diameter'].forEach((k) => {
				if (a[k] !== undefined) { num(a[k], b[k], 'node ' + a.id + ' ' + k, 1e-3); }
			});
			num(a.demand || 0, b.demand || 0, 'node ' + a.id + ' demand', 1e-6);
		});
		us.links.forEach((a, i) => {
			const b = si.links[i];
			['length', 'diameter', 'roughness', 'minorK'].forEach((k) => {
				if (a[k] !== undefined) { num(a[k], b[k], 'link ' + a.id + ' ' + k, 1e-6); }
			});
			(a.curve || a.curvePoints || []).forEach((p, j) => {
				const q = (b.curve || b.curvePoints)[j];
				num(p[0], q[0], 'link ' + a.id + ' curve x' + j, 1e-6);
				num(p[1], q[1], 'link ' + a.id + ' curve y' + j, 1e-3);
			});
		});
		ok('every converted input is within ' + MODEL_REL + ' relative',
			wm.v < MODEL_REL, 'worst ' + wm.v.toExponential(2) + ' (' + wm.at + ')');
		ok('the Hazen-Williams roughness is not touched',
			us.method === si.method && us.links.every((l, i) => l.roughness === si.links[i].roughness));
		summary.push(net + ' inputs: ' + wm.v.toExponential(2));

		// 1b. THE DRAWING IS IN METRES TOO ------------------------------------------------------
		// On a grid project a world unit IS the display length unit, so the scale bar, a new pipe's
		// auto length and the backdrop all read the coordinates as metres in the SI twin. A pipe's
		// STATED length is not its drawn length in these two files (EPA drew them schematically:
		// stated over drawn runs from 1 to 25951 in Net3), so "bar equals stated" cannot hold even in
		// the US file; what must hold is that the drawn geometry is the same drawing at 0.3048 the
		// size, which is exactly what the bar, auto length and snapping measure.
		{
			const ru = JSON.parse(fs.readFileSync(ROOT + 'examples/' + net + '.lwn', 'utf8'));
			const rs = JSON.parse(fs.readFileSync(ROOT + 'examples/' + net + '-SI.lwn', 'utf8'));
			const K = 0.3048, wd = worst(), wl = worst(), wb = worst();
			const NU = {}, NS = {};
			ru.nodes.forEach((n) => { NU[n.id] = n; }); rs.nodes.forEach((n) => { NS[n.id] = n; });
			ru.nodes.forEach((n) => {
				const m = NS[n.id];
				note(wd, rel(n.x * K, m.x, 1e-3), 'node ' + n.id + ' x'); note(wd, rel(n.y * K, m.y, 1e-3), 'node ' + n.id + ' y');
			});
			(ru.labels || []).forEach((t, i) => { note(wd, rel(t.x * K, rs.labels[i].x, 1e-3), 'text ' + t.id); });
			const drawn = (doc, N, l) => {
				const pts = [N[l.from]].concat(l.verts || [], [N[l.to]]);
				let sum = 0;
				for (let i = 1; i < pts.length; i++) { sum += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); }
				return sum;
			};
			ru.links.forEach((l, i) => {
				note(wl, rel(drawn(ru, NU, l) * K, drawn(rs, NS, rs.links[i]), 1e-3), 'link ' + l.id);
			});
			// The site plan: its four corners, as a fraction of the drawing's own extent, in both.
			const ext = (doc) => {
				const xs = doc.nodes.map((n) => n.x), ys = doc.nodes.map((n) => n.y);
				return { x0: Math.min.apply(null, xs), y0: Math.min.apply(null, ys),
					w: Math.max.apply(null, xs) - Math.min.apply(null, xs), h: Math.max.apply(null, ys) - Math.min.apply(null, ys) };
			};
			const corners = (doc) => {
				const b = doc.backdrop, e = ext(doc), out = [];
				[[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].forEach((p) => {
					out.push([(b.tx + b.s * p[0] - e.x0) / e.w, (b.ty + b.s * p[1] - e.y0) / e.h]);
				});
				return out;
			};
			const cu = corners(ru), cs = corners(rs);
			cu.forEach((c, i) => { note(wb, Math.abs(c[0] - cs[i][0]) + Math.abs(c[1] - cs[i][1]), 'corner ' + i); });
			ok('every coordinate is the US one times 0.3048', wd.v < 1e-8, 'worst ' + wd.v.toExponential(2) + ' (' + wd.at + ')');
			ok('every drawn pipe length (the scale bar and auto-length measure) is 0.3048 times the US one', wl.v < 1e-8,
				'worst ' + wl.v.toExponential(2) + ' (' + wl.at + ')');
			ok('the site plan sits at the same relative place under the pipes', wb.v < 1e-7,
				'worst corner offset ' + wb.v.toExponential(2) + ' of the drawing (' + wb.at + ')');
			ok('the view is the same window (centre and pixels per unit)',
				rel(ru.view.cx * K, rs.view.cx, 1e-3) < 1e-8 && rel(ru.view.s / K, rs.view.s, 1e-3) < 1e-8);
			summary.push(net + ' drawing: coordinates ' + wd.v.toExponential(2) + ', pipe drawn length ' + wl.v.toExponential(2) + ', backdrop corners ' + wb.v.toExponential(2));
		}

		// 2. A SINGLE INSTANT, built-in solver ---------------------------------------------
		const su = EC.lpnSolve(us, { tol: 1e-9 }), ss = EC.lpnSolve(si, { tol: 1e-9 });
		if (su.ok && ss.ok) {
			const wh = worst(), wq = worst();
			for (const id in su.heads) {
				note(wh, Math.abs(su.heads[id] - ss.heads[id]), 'node ' + id);
			}
			for (const id in su.flows) {
				note(wq, Math.abs(su.flows[id] - ss.flows[id]) / (FLOW_ABS / FLOW_REL + Math.abs(su.flows[id])), "link " + id);
			}
			ok('built-in single instant: heads agree', wh.v < HEAD_ABS,
				'worst ' + wh.v.toExponential(2) + ' m (' + wh.at + ')');
			ok('built-in single instant: flows agree', wq.v < FLOW_REL,
				'worst scaled ' + wq.v.toExponential(2) + ' (' + wq.at + ')');
			summary.push(net + ' built-in instant: head ' + wh.v.toExponential(2) + ' m, flow rel ' + wq.v.toExponential(2));
		} else {
			console.log('       (built-in solver declines this network: ' + JSON.stringify((su.issues || []).map((i) => i.code || i.message || i)).slice(0, 120) + '; EPANET covers it below)');
		}

		// 3. THE EXTENDED-PERIOD RUN, through EPANET ----------------------------------------
		const compareRuns = async (a, b) => {
			const ra = await EC.lpnEpanetRun(a, {}), rb = await EC.lpnEpanetRun(b, {});
			const w = { ok: ra.ok && rb.ok, frames: 0, same: ra.frames.length === rb.frames.length,
				h: worst(), lvl: worst(), q: worst(), qrel: worst(), tanksMoved: 0 };
			if (!w.same) { return w; }
			const lo = {}, hi = {};
			ra.frames.forEach((fa, i) => {
				const fb = rb.frames[i];
				w.frames++;
				const at = (id) => id + ' at ' + fa.t / 3600 + ' h';
				for (const id in fa.heads) { note(w.h, Math.abs(fa.heads[id] - fb.heads[id]), at(id)); }
				for (const id in fa.levels || {}) {
					note(w.lvl, Math.abs(fa.levels[id] - fb.levels[id]), at(id));
					lo[id] = Math.min(lo[id] === undefined ? Infinity : lo[id], fa.levels[id]);
					hi[id] = Math.max(hi[id] === undefined ? -Infinity : hi[id], fa.levels[id]);
				}
				for (const id in fa.flows) {
					note(w.qrel, Math.abs(fa.flows[id] - fb.flows[id]) / (FLOW_ABS / FLOW_REL + Math.abs(fa.flows[id])), at(id));
				}
			});
			for (const id in lo) { if (hi[id] - lo[id] > 0.1) { w.tanksMoved++; } }
			w.tanks = Object.keys(lo).length;
			return w;
		};
		const w = await compareRuns(us, si);
		ok('EPANET EPS ran both and gave the same number of steps', w.ok && w.same, w.frames + ' steps');
		ok('EPS: heads agree at every step', w.h.v < HEAD_ABS,
			'worst ' + w.h.v.toExponential(2) + ' m (' + w.h.at + ')');
		ok('EPS: tank levels agree at every step', w.lvl.v < HEAD_ABS,
			'worst ' + w.lvl.v.toExponential(2) + ' m (' + w.lvl.at + ')');
		ok('EPS: flows agree at every step', w.qrel.v < FLOW_REL,
			'worst scaled ' + w.qrel.v.toExponential(2) + ' (' + w.qrel.at + ')');
		ok('EPS: the tanks actually move (a flat run would agree with anything)',
			w.tanks > 0 && w.tanksMoved === w.tanks, w.tanksMoved + ' of ' + w.tanks);
		summary.push(net + ' EPS (' + w.frames + ' steps): head ' + w.h.v.toExponential(2) + ' m, level '
			+ w.lvl.v.toExponential(2) + ' m, flow rel ' + w.qrel.v.toExponential(2));

		// 4. THE COMPARISON CAN FAIL ---------------------------------------------------------
		if (net === 'Net3') {
			const bad = open('Net3-SI.lwn', (saved) => {
				const c = saved.controls.find((x) => x.link === '335' && x.condition && x.condition.cmp === 'below');
				c.condition.value = 17.1;	// left in feet
			});
			const wb = await compareRuns(us, bad);
			ok('a control threshold left in feet is caught',
				!(wb.ok && wb.same && wb.lvl.v < HEAD_ABS && wb.qrel.v < FLOW_REL),
				'level ' + wb.lvl.v.toExponential(2) + ' m, flow rel ' + wb.qrel.v.toExponential(2));
		}
	}

	console.log('\nWORST DIFFERENCES');
	summary.forEach((s) => console.log('  ' + s));
	console.log(fails === 0 ? '\nsi example equivalence harness: all checks passed'
		: '\nsi example equivalence harness: ' + fails + ' FAILED');
	process.exit(fails === 0 ? 0 : 1);
}()).catch((e) => { console.error(e); process.exit(1); });
