// THE SI TWINS OF THE Net2 (BRANFORD) AND Net3 (NOVATO) EXAMPLES SOLVE LIKE THEIR US ORIGINALS (ROADMAP Task 786). Run with:
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
	setUnitSet(/-SI\.lwn$/.test(file) ? 'si' : 'us');
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

	// kind: 'geo' is a lat/lon project (degrees, drawing untouched), 'proj' a projected one whose
	// drawing and origin shift convert and whose CRS becomes its metre twin.
	const PAIRS = [['Net3-Novato-CA-World', 'geo', 'Net3'], ['Net2-Branford-CT', 'proj', 'Net2']];
	for (const [file, kind, net] of PAIRS) {
		console.log('\n== ' + file + ': US original against its SI twin');
		const us = open(file + '.lwn'), si = open(file + '-SI.lwn');

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

		// 1b. THE DRAWING AND ITS GEOREFERENCE ---------------------------------------------------
		// A lat/lon project stores degrees, so its drawing must be IDENTICAL in the twin (nothing to
		// convert, and converting would move it off the map). A projected project is drawn in the
		// CRS's feet: the drawing is the US one times 0.3048 (what the scale bar, auto length and
		// snapping measure), the origin shift is an absolute position and converts at the US survey
		// foot, and the CRS becomes the metre twin of the same projection. A pipe's STATED length is
		// not its drawn length in these files (EPA drew them schematically), so "bar equals stated"
		// cannot hold even in the US file.
		{
			const ru = JSON.parse(fs.readFileSync(ROOT + 'examples/' + file + '.lwn', 'utf8'));
			const rs = JSON.parse(fs.readFileSync(ROOT + 'examples/' + file + '-SI.lwn', 'utf8'));
			const K = kind === 'geo' ? 1 : 0.3048, wd = worst(), wl = worst();
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
			ok('every coordinate is the US one times ' + K, wd.v < 1e-6, 'worst ' + wd.v.toExponential(2) + ' (' + wd.at + ')');
			ok('every drawn pipe length (the scale bar and auto-length measure) is ' + K + ' times the US one', wl.v < 1e-6,
				'worst ' + wl.v.toExponential(2) + ' (' + wl.at + ')');
			ok('the view is the same window (centre and pixels per unit)',
				rel(ru.view.cx * K, rs.view.cx, 1e-3) < 1e-8 && rel(ru.view.s / K, rs.view.s, 1e-3) < 1e-8);
			ok('neither twin has a backdrop', !ru.backdrop && !rs.backdrop);
			if (kind === 'geo') {
				ok('the georeference is carried: lat/lon project, no CRS, origin unchanged',
					rs.project.coords === 'geo' && !rs.project.crs && JSON.stringify(rs.origin) === JSON.stringify(ru.origin));
			} else {
				const F = 1200 / 3937;
				ok('the CRS is the metre twin of the same projection (EPSG:2234 ftUS to EPSG:26956 m)',
					ru.project.crs === 'EPSG:2234' && rs.project.crs === 'EPSG:26956');
				ok('the origin shift is the US survey foot conversion',
					rel(ru.origin.x * F, rs.origin.x, 1) < 1e-8 && rel(ru.origin.y * F, rs.origin.y, 1) < 1e-8,
					JSON.stringify(ru.origin) + ' -> ' + JSON.stringify(rs.origin));
				// Where the origin lands, in the CRS's metres: a Connecticut (NAD83) easting is ~300000 m
				// and a northing ~200000 m, so a missed conversion is 3 times off and shows here.
				ok('the placed origin is plausible Connecticut State Plane in metres',
					rs.origin.x > 250000 && rs.origin.x < 350000 && rs.origin.y > 150000 && rs.origin.y < 250000,
					JSON.stringify(rs.origin));
				// And the proof that matters: the same node lands on the same spot on the Earth in both
				// twins, through each CRS's own definition (proj4, the library the page uses).
				const P0 = require(ROOT + 'js/vendor/proj4.js'), P = P0.default || P0;
				const D = JSON.parse(fs.readFileSync(ROOT + 'js/data/epsg-proj4.json', 'utf8'));
				const D2 = D.defs || D;
				P.defs('US', D2['2234']); P.defs('SI', D2['26956']);
				const at = (c, d) => { const n = d.nodes.find((x) => x.id === '26'); return P(c, 'EPSG:4326', [d.origin.x + n.x, d.origin.y + n.y]); };
				const pu = at('US', ru), ps = at('SI', rs);
				const metres = Math.hypot((pu[0] - ps[0]) * 85000, (pu[1] - ps[1]) * 111000);
				ok('node 26 lands on the same spot on the Earth in both twins', metres < 0.05,
					metres.toFixed(4) + ' m apart, at lat ' + pu[1].toFixed(5) + ' lon ' + pu[0].toFixed(5));
			}
			summary.push(net + ' drawing: coordinates ' + wd.v.toExponential(2) + ', pipe drawn length ' + wl.v.toExponential(2));
		}

		// 1c. A FEW NUMBERS, NAMED: what a reader would check by hand, from the files' own values --------
		{
			const ru = JSON.parse(fs.readFileSync(ROOT + 'examples/' + file + '.lwn', 'utf8'));
			const rs = JSON.parse(fs.readFileSync(ROOT + 'examples/' + file + '-SI.lwn', 'utf8'));
			const LPS = 3.785411784 / 60;	// one gpm in L/s
			ru.nodes.filter((n) => n._demand).slice(0, 3).forEach((a) => {
				const b = rs.nodes.find((n) => n.id === a.id);
				ok('node ' + a.id + ': ' + a._demand + ' gpm is ' + b._demand + ' L/s; ' + a.elev + ' ft is ' + b.elev + ' m',
					rel(a._demand * LPS, b._demand, 1e-3) < 1e-5 && rel(a.elev * 0.3048, b.elev, 1e-3) < 1e-5);
			});
			const a = ru.links.find((l) => l.type === 'pipe'), b = rs.links.find((l) => l.id === a.id);
			ok('pipe ' + a.id + ': ' + a._length + ' ft is ' + b._length + ' m; ' + a._diameter + ' in is ' + b._diameter + ' mm',
				rel(a._length * 0.3048, b._length, 1e-3) < 1e-5 && rel(a._diameter * 25.4, b._diameter, 1e-3) < 1e-5);
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
			const bad = open('Net3-Novato-CA-World-SI.lwn', (saved) => {
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
