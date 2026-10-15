// AN HOUR WITH NO DEMAND IS SOLVED, IN BOTH ENGINES (R-402). Run with:
//   node dev/lpn-spike/zero-demand-hours-harness.js
//
// Tom, 2026-10-15, on his two-system drain study: the demand patterns *"were intended to be all 0
// except the time of use. But since that caused problems, I tried all 0.001 and 0.0001. It seems to
// me that the solver should be smart enough to handle 0."*
//
// Measured on a copy of his project (pumps off, tanks starting full, demand only in a window), on the
// scenario code of feat/bentley-interop, 2026-10-15:
//   * Exact zeros: every hour of every pump-off scenario converges in EPANET at Accuracy 0.001 AND at
//     1e-5, the tanks hold their level outside the window and drain inside it, and the built-in
//     solver converges at a zero-demand instant in 2 iterations.
//   * His 0.0001 stand-ins are what fail: with flows of about a millionth of a cubic metre per second,
//     EPANET's relative error (flow change over total flow) is round-off, and at 1e-5 "EPS Pump off"
//     and "1-hr drain" ran 211 trials an hour without converging (24 of 25 hours). At 0.001 they
//     converge. So zero is the right input, and the earlier "problems" with zero are not reproduced
//     by today's code (the out-of-bounds crash of Task 796 was fixed on 889a56c2).
//
// This holds the zero case on a small network of the same shape: a tank-only source that starts
// full, a dead-end stub with no demand (his L17/L19), and a demand pattern that is zero outside a
// window. EPANET runs the day at both accuracies; the built-in solver solves the zero-demand instant.

'use strict';

const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const EngCalcs = global.EngCalcs;
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));
setUnitSet('si');
const L = loadLoopedNetwork(
	"\t\tapplySaved: applySaved, assembleModel: assembleModel,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas'); world = el('g', {}, svg);" +
	" backdropLayer = el('g', {}, world); gridLayer = el('g', {}, world); linksLayer = el('g', {}, world);" +
	" nodesLayer = el('g', {}, world); labelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
const solverEC = require(path.join(ROOT, 'js', 'lpn-solver.js'));
Object.keys(solverEC).forEach(function (k) { EngCalcs[k] = solverEC[k]; });
require(path.join(ROOT, 'js', 'lpn-epanet.js'));

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const WINDOW = [9, 16];   // demand from 09:00 to 17:00, nothing else all day
const mult = [];
for (let h = 0; h < 24; h++) { mult.push(h >= WINDOW[0] && h <= WINDOW[1] ? 1 : 0); }

function pipe(id, from, to, len) {
	return { id: id, type: 'pipe', from: from, to: to, verts: [], _diameter: 25, _roughness: 130,
		_length: len, lenAuto: false, _status: 'open', _k: 0 };
}
const saved = {
	format: 'hawsedc-lpn', v: 6,
	project: { name: 'Zero-demand hours', activeScenario: 'base' },
	scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
	nodes: [
		// Starts FULL, as his tanks do: level at the maximum, so the tank cannot fill.
		{ id: 'T', type: 'tank', x: 0, y: 0, elev: 100, _level: 7, minLevel: 4.5, maxLevel: 7, tankDiameter: 3 },
		{ id: 'J1', type: 'junction', x: 50, y: 0, elev: 95, _demand: 0 },
		{ id: 'J2', type: 'junction', x: 100, y: 0, elev: 94, _demand: 0.05 },
		{ id: 'J3', type: 'junction', x: 100, y: 50, elev: 96, _demand: 0.05 },
		// The dead-end stub with no demand at all, where his pump used to connect.
		{ id: 'J4', type: 'junction', x: 50, y: -50, elev: 90, _demand: 0 }
	],
	links: [pipe('L1', 'T', 'J1', 60), pipe('L2', 'J1', 'J2', 60), pipe('L3', 'J1', 'J3', 80),
		pipe('L4', 'J2', 'J3', 50), pipe('L5', 'J1', 'J4', 40)],
	labels: [],
	patterns: [{ id: 'USE', multipliers: mult }],
	defaultPattern: 'USE',
	times: { duration: 86400, hydraulicStep: 3600, patternStep: 3600, patternStart: 0, reportStep: 3600,
		reportStart: 0, startClock: 0 },
	settings: { engine: 'epanet', method: 'hw', hydraulics: {} },
	units: { lpn_u_length: 'm', lpn_u_elevhead: 'mh2o', lpn_u_pressure: 'mh2o', lpn_u_diameter: 'mm',
		lpn_u_flow: 'lps', lpn_u_velocity: 'mps', lpn_u_gradient: 'gradePercent' }
};
L.applySaved(saved);

(async function () {
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	for (const acc of [0.001, 1e-5]) {
		console.log('\n--- EPANET, Accuracy ' + acc + ' ---');
		const m = L.assembleModel();
		m.hydraulics = Object.assign({}, m.hydraulics, { accuracy: acc });
		ok('the model really runs a day', !!(m.time && m.time.times && m.time.times.duration === 86400));
		const run = await EngCalcs.lpnEpanetRun(m);
		ok('the run is accepted, not refused', run.ok && !run.refused, run.engineError || '');
		const frames = run.frames || [];
		ok('every hour is reported', frames.length === 25, String(frames.length));
		const bad = frames.filter(function (f) { return f.converged !== true; });
		ok('every hour converges, the zero-demand ones included', frames.length > 0 && bad.length === 0,
			bad.map(function (f) { return EngCalcs.lpnFormatTime(f.t) + ' rel ' + f.relativeError; }).join(', '));
		const idle = frames.filter(function (f) { const h = f.t / 3600; return h < WINDOW[0] || h > WINDOW[1] + 1; });
		// "No water" to within what a converged answer means: at Accuracy 0.001 EPANET stops with a
		// few millilitres a second still circulating round the loop (measured 5e-6 m3/s, 0.08 gpm,
		// at 1e-5 it is 5e-8) -- its starting guess not yet iterated away, because a flow change
		// that small is already inside the tolerance. Real, harmless, and EPANET's own.
		const worst = Math.max.apply(null, idle.map(function (f) {
			return Math.max.apply(null, Object.keys(f.flows).map(function (k) { return Math.abs(f.flows[k]); }));
		}));
		ok('...and an hour with no demand moves next to no water (under 0.02 L/s)', idle.length > 0 && worst < 2e-5,
			worst.toExponential(2) + ' m3/s');
		const at = function (h) { const f = frames.find(function (x) { return x.t === h * 3600; }); return f && f.heads && f.heads.T; };
		ok('...the full tank holds its level before the window, to the millimetre',
			Math.abs(at(0) - at(WINDOW[0])) < 1e-3, at(0) + ' -> ' + at(WINDOW[0]));
		ok('...and drains inside it', at(WINDOW[1] + 1) < at(WINDOW[0]) - 0.1, at(WINDOW[0]) + ' -> ' + at(WINDOW[1] + 1));
	}
	console.log('\n--- the built-in solver, at the zero-demand instant ---');
	for (const acc of [0.001, 1e-5]) {
		const m = L.assembleModel();
		ok('the instant solved really has no demand', m.nodes.every(function (n) { return !n.demand; }));
		const r = EngCalcs.lpnSolve(m, { tol: acc });
		ok('Accuracy ' + acc + ': it converges', r.ok && r.converged, 'iterations ' + r.iterations);
		ok('...with next to no flow anywhere (under 0.02 L/s)',
			Object.keys(r.flows || {}).every(function (k) { return Math.abs(r.flows[k]) < 2e-5; }));
	}
	console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
	process.exit(fails ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(1); });
