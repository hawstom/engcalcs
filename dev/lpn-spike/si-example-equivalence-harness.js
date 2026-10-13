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
//
// TOM'S ROUNDING, 2026-10-13, MAKES THE TWIN AN SI DESIGN, NOT A BIT-EXACT IMAGE: "Round all the
// pipe diameters to the nearest 50 mm. Round all the base demands and curve flows to the nearest
// 0.001 L/s. Round all the res. heads, tank depths and diameters, control depths, curve heads and pipe
// lengths to the nearest 0.001m". So every rounded number is checked EXACTLY against that rule applied
// to the US file (0. below), the unrounded ones (elevations, roughness, minor loss) still to 1e-5, and
// the solves are bounded as the same network behaving alike, not as equal to the millimetre.
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
const MODEL_REL = 1e-5, FLOW_REL = 1e-4, FLOW_ABS = 1e-6;
// The rounded twin against the original: a tank's level, hour by hour, within LEVEL_ABS. Measured
// 2026-10-13 at 0.79 m (Net3 tank 3, where a 400 mm main stands in for 16 in) and 0.0009 m (Net2).
// Heads and flows are printed, not bounded: a pump control that trips a step earlier moves a head
// by tens of metres for that hour, which is the network obeying its own controls.
const LEVEL_ABS = 1.0;

// 0. TOM'S RULE, number by number, on the files themselves (ft, in, gpm against m, mm, L/s).
const FT = 0.3048, IN = 25.4, GPM = 3.785411784 / 60;
const step = (x, s) => Math.round(x / s) * s;
const L3 = (x) => step(x * FT, 0.001), D50 = (x) => Math.max(50, step(x * IN, 50)), Q3 = (x) => step(x * GPM, 0.001);
function ruleMisses(ru, rs) {
	const miss = [];
	const want = (a, b, at) => { if (typeof a === 'number' && Math.abs(a - b) > 1e-9) { miss.push(at + ': ' + b + ', rule gives ' + a); } };
	ru.nodes.forEach((a, i) => {
		const b = rs.nodes[i];
		['_head', '_level', 'minLevel', 'maxLevel', 'tankDiameter'].forEach((k) => { if (typeof a[k] === 'number') { want(L3(a[k]), b[k], 'node ' + a.id + ' ' + k); } });
		if (typeof a._demand === 'number') { want(Q3(a._demand), b._demand, 'node ' + a.id + ' demand'); }
	});
	ru.links.forEach((a, i) => {
		const b = rs.links[i];
		if (typeof a._length === 'number') { want(L3(a._length), b._length, 'link ' + a.id + ' length'); }
		if (typeof a._diameter === 'number') { want(D50(a._diameter), b._diameter, 'link ' + a.id + ' diameter'); }
	});
	(ru.curves || []).forEach((c, i) => c.points.forEach((p, j) => {
		want(Q3(p[0]), rs.curves[i].points[j][0], 'curve ' + c.id + ' flow ' + j);
		want(L3(p[1]), rs.curves[i].points[j][1], 'curve ' + c.id + ' head ' + j);
	}));
	(ru.controls || []).forEach((c, i) => {
		if (c.condition && c.condition.kind === 'node') { want(L3(c.condition.value), rs.controls[i].condition.value, 'control ' + i); }
	});
	return miss;
}

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
			if (a.elev !== undefined) { num(a.elev, b.elev, 'node ' + a.id + ' elev', 1e-3); }
		});
		us.links.forEach((a, i) => {
			const b = si.links[i];
			['roughness', 'minorK'].forEach((k) => {
				if (a[k] !== undefined) { num(a[k], b[k], 'link ' + a.id + ' ' + k, 1e-6); }
			});
		});
		{
			const ru = JSON.parse(fs.readFileSync(ROOT + 'examples/' + file + '.lwn', 'utf8'));
			const rs = JSON.parse(fs.readFileSync(ROOT + 'examples/' + file + '-SI.lwn', 'utf8'));
			const miss = ruleMisses(ru, rs);
			ok('every diameter, demand, head, level, length, curve point and control depth follows the rounding rule',
				miss.length === 0, miss.length ? miss.length + ' miss, first ' + miss[0] : '');
			if (net === 'Net3') {
				const c = rs.controls.find((x) => x.link === '335' && x.condition && x.condition.cmp === 'below');
				const keep = c.condition.value;
				c.condition.value = 17.1;	// left in feet
				ok('a control threshold left in feet is caught', ruleMisses(ru, rs).length === 1);
				c.condition.value = keep;
			}
		}
		ok('every unrounded input (elevation, roughness, minor loss) is within ' + MODEL_REL + ' relative',
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
				ru.nodes.filter((n) => n._demand).slice(0, 3).forEach((a) => {
				const b = rs.nodes.find((n) => n.id === a.id);
				ok('node ' + a.id + ': ' + a._demand + ' gpm is ' + b._demand + ' L/s; ' + a.elev + ' ft is ' + b.elev + ' m',
					Math.abs(Q3(a._demand) - b._demand) < 1e-9 && rel(a.elev * 0.3048, b.elev, 1e-3) < 1e-5);
			});
			const a = ru.links.find((l) => l.type === 'pipe'), b = rs.links.find((l) => l.id === a.id);
			ok('pipe ' + a.id + ': ' + a._length + ' ft is ' + b._length + ' m; ' + a._diameter + ' in is ' + b._diameter + ' mm',
				Math.abs(L3(a._length) - b._length) < 1e-9 && b._diameter === D50(a._diameter) && b._diameter % 50 === 0);
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
			console.log('       built-in single instant, rounded twin against original: worst head '
				+ wh.v.toExponential(2) + ' m (' + wh.at + '), worst scaled flow ' + wq.v.toExponential(2) + ' (' + wq.at + ')');
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
		console.log('       EPS, rounded twin against original: worst head ' + w.h.v.toExponential(2) + ' m (' + w.h.at + ')');
		ok('EPS: tank levels stay within ' + LEVEL_ABS + ' m of the original at every step', w.lvl.v < LEVEL_ABS,
			'worst ' + w.lvl.v.toExponential(2) + ' m (' + w.lvl.at + ')');
		console.log('       EPS flows: worst scaled ' + w.qrel.v.toExponential(2) + ' (' + w.qrel.at + ')');
		ok('EPS: the tanks actually move (a flat run would agree with anything)',
			w.tanks > 0 && w.tanksMoved === w.tanks, w.tanksMoved + ' of ' + w.tanks);
		summary.push(net + ' EPS (' + w.frames + ' steps): head ' + w.h.v.toExponential(2) + ' m, level '
			+ w.lvl.v.toExponential(2) + ' m, flow rel ' + w.qrel.v.toExponential(2));
	}

	console.log('\nWORST DIFFERENCES');
	summary.forEach((s) => console.log('  ' + s));
	console.log(fails === 0 ? '\nsi example equivalence harness: all checks passed'
		: '\nsi example equivalence harness: ' + fails + ' FAILED');
	process.exit(fails === 0 ? 0 : 1);
}()).catch((e) => { console.error(e); process.exit(1); });
