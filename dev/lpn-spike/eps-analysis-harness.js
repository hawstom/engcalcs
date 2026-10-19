// FIRE FLOW, CRITICALITY AND DEMAND SCALING OVER AN EXTENDED-PERIOD RUN (ROADMAP Task 578).
// Run:  node dev/lpn-spike/eps-analysis-harness.js
//
// Tom, 2026-10-19: "I am wondering why our fire flow analysis can't do an entire EPS. And I suppose
// that the same question could be asked about criticality and demand scaling analysis."
//
// Through the page's own doors, on EPA's Net3 (24 hours, 25 reporting steps, tanks, pumps):
//   1. The snapshot at step k reproduces that step's frame: solved, its heads equal the run's.
//   2. Fire flow "every reporting step" equals the minimum of the per-step sweeps, junction by
//      junction, and names the step where it occurs.
//   3. "The reporting step of lowest pressure" picks the step the frames say, and its answers are
//      that step's sweep.
//   4. (later phases append their sections here.)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const { ROOT, byId, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');
const PC = global.EngCalcs.pageConfig;

require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-fireflow.js');
require(ROOT + 'js/lpn-demandscale.js');

let failures = 0;
function check(ok, msg) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg);
	if (!ok) { failures++; }
}
function head(t) { console.log('\n' + t); }
// The box's required flow goes through the unit converter, the plain sweep's does not: same to rounding.
const same = (a, b) => (a === undefined && b === undefined) || Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\trunFireFlowSweep: runFireFlowSweep,\n" +
	"\t\tanalysisModelAt: analysisModelAt, analysisRun: analysisRun, assembleModel: assembleModel,\n" +
	"\t\tengineFor: engineFor,\n" +
	"\t\tsetAsk: function (k, v) { if (!fireFlowAsk) { fireFlowAsk = fireFlowDefaults(); } fireFlowAsk[k] = v; },\n" +
	"\t\task: function () { return fireFlowAsk; },\n" +
	"\t\tffRun: function () { return fireFlowRun; },\n" +
	"\t\tsetSelectionList: setSelectionList,\n" +
	"\t\tsetEngine: function (e) { settings.engine = e; },\n" +
	"\t\topenFireFlowBox: openFireFlowBox, wireFireFlowBox: wireFireFlowBox,\n" +
	"\t\tbuildFireFlowControls: buildFireFlowControls, rebuildFireFlowReport: rebuildFireFlowReport,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
const EC = global.EngCalcs;

function open(file) {
	const saved = L.acceptImportedText(fs.readFileSync(ROOT + (/^Net[23]\.lwn$/.test(file) ? 'dev/water-network-examples/' : 'examples/') + file, 'utf8'));
	if (!saved) { throw new Error('did not open ' + file); }
	L.applySaved(saved);
	L.buildDom();
	L.applyMethodUI();
}
async function sweepSelected(ids, when, extra) {
	L.setSelectionList(ids.map((id) => ({ kind: 'node', id: id })));
	L.setAsk('scope', 'selected');
	L.setAsk('design', 'off');
	L.setAsk('when', when || 'now');
	Object.keys(extra || {}).forEach((k) => L.setAsk(k, extra[k]));
	await L.runFireFlowSweep();
	return L.ffRun();
}

(async function () {
	setUnitSet('us');
	L.buildLayers();
	await warmEpanet();
	L.setEngine('epanet');
	const FT = 0.3048;

	head('1. THE SNAPSHOT AT STEP k REPRODUCES THE RUN\'S FRAME');
	open('Net3.lwn');
	const run = await L.analysisRun();
	check(run && run.ok && run.frames.length === 25, 'the run has ' + (run && run.frames && run.frames.length) + ' frames');
	for (const k of [0, 1, 6, 13, 20, 24]) {
		const t = run.frames[k].t;
		const frame = EC.lpnTimeFrameResult(run, t);
		const m = L.analysisModelAt(t, frame);
		const r = await L.engineFor(m).solve(m);
		let worst = 0, where = '';
		m.nodes.forEach((n) => {
			const d = Math.abs(r.heads[n.id] - frame.heads[n.id]);
			if (d > worst) { worst = d; where = n.id; }
		});
		check(worst < 0.01 * FT, `step ${k} (${EC.lpnFormatTime(t)}): every head within 0.01 ft of the run (worst ${(worst / FT).toFixed(5)} ft at ${where})`);
	}

	head('2. FIRE FLOW, EVERY REPORTING STEP = THE MINIMUM OF THE PER-STEP SWEEPS');
	const ids = ['10', '15', '20', '35', '101', '123', '161', '209', '255'];
	const tol = EC.lpnFireFlowDefaults.flowTol * EC.lpnFireFlowDefaults.maxFlow;
	// the per-step sweeps, the plain way
	const perStep = [];
	let plainSolves = 0;
	for (let k = 0; k < run.frames.length; k++) {
		const t = run.frames[k].t;
		const m = L.analysisModelAt(t, EC.lpnTimeFrameResult(run, t));
		const set = await EC.lpnFireFlowSweep(m, {
			solve: L.engineFor(m).solve, junctions: ids, required: EC.lpnFireFlowGpmToSI(1000)
		});
		plainSolves += set.solves;
		perStep.push({ t, set });
	}
	let t0 = Date.now();
	const all = await sweepSelected(ids, 'all');
	const allMs = Date.now() - t0;
	check(all && all.at && all.at.mode === 'all' && all.at.stepsDone === 25, 'the set says it is the worst of 25 steps');
	let okAll = true, okHour = true;
	ids.forEach((id) => {
		const rec = all.byId[id];
		let minAvail = Infinity, minRec = null, rest = null;
		perStep.forEach((ps) => {
			const r = ps.set.byId[id];
			if (r.available === undefined) { if (!rest) { rest = r; } }
			else if (r.available < minAvail) { minAvail = r.available; minRec = r; }
		});
		const want = rest ? undefined : minAvail;
		const same = rest ? (rec.available === undefined) : (rec.available !== undefined && Math.abs(rec.available - want) <= 2 * tol);
		if (!same) { okAll = false; console.log('    ' + id, rec.available, want); }
		// the reported step must be a step where this junction really is that low
		const atHour = perStep.find((ps) => ps.t === rec.t);
		const ra = atHour && atHour.set.byId[id];
		const hourOk = ra && (rest ? ra.available === undefined : Math.abs(ra.available - minAvail) <= 2 * tol);
		if (!hourOk) { okHour = false; console.log('    hour', id, rec.t); }
	});
	check(okAll, 'every junction\'s available flow equals the lowest of the 25 per-step sweeps (within 2 gpm)');
	check(okHour, 'and the step it reports is a step where that junction is that low');
	check(all.solves < plainSolves / 2, `it used ${all.solves} solves against ${plainSolves} for 25 plain sweeps`);
	console.log(`    (9 hydrants, 25 steps: ${allMs} ms; plain sweeps ${plainSolves} solves)`);

	head('3. THE REPORTING STEP OF LOWEST PRESSURE');
	let best = null;
	run.frames.forEach((f, k) => {
		const fr = EC.lpnTimeFrameResult(run, f.t);
		ids.forEach((id) => { const p = fr.pressures[id]; if (!best || p < best.p) { best = { p, k, t: f.t, id }; } });
	});
	t0 = Date.now();
	const mp = await sweepSelected(ids, 'minp');
	const mpMs = Date.now() - t0;
	check(mp.at.mode === 'minp' && mp.at.t === best.t, `it picked ${EC.lpnFormatTime(mp.at.t)}; the frames say ${EC.lpnFormatTime(best.t)} (junction ${best.id})`);
	const psAt = perStep.find((ps) => ps.t === best.t).set;
	check(ids.every((id) => same(mp.byId[id].available, psAt.byId[id].available)), 'its answers are that step\'s sweep, unchanged');
	console.log(`    (9 hydrants, one step: ${mpMs} ms)`);

	head('4. A CHOSEN REPORTING STEP');
	const hr = await sweepSelected(ids, 'hour', { step: String(14 * 3600) });
	const ps14 = perStep.find((ps) => ps.t === 14 * 3600).set;
	check(hr.at.mode === 'hour' && hr.at.t === 14 * 3600, 'tested at 14:00');
	check(ids.every((id) => same(hr.byId[id].available, ps14.byId[id].available)), 'its answers are the 14:00 sweep');

	head('5. THE STEP ON SCREEN IS UNCHANGED');
	const now = await sweepSelected(ids, 'now');
	check(!now.at && now.stopped === false && ids.every((id) => now.byId[id]), 'no "at" record, every hydrant answered');

	// Timings, not assertions: every junction of Net3.
	if (process.env.EPS_TIMES) {
		L.setSelectionList([]);
		L.setAsk('scope', 'all'); L.setAsk('design', 'off');
		for (const w of ['now', 'minp', 'all']) {
			L.setAsk('when', w);
			const t1 = Date.now();
			await L.runFireFlowSweep();
			console.log(`    Net3, every junction, ${w}: ${Date.now() - t1} ms, ${L.ffRun().solves} solves, ${L.ffRun().results.length} junctions`);
		}
	}
	console.log(failures ? '\n' + failures + ' FAILED' : '\nall eps analysis checks passed');
	process.exit(failures ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(2); });
