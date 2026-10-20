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
	"\t\truncrit: runCriticality, critRun: function () { return critRun; },\n" +
	"\t\tsetDm: function (v) { settings.hydraulics = settings.hydraulics || {}; settings.hydraulics.demandMultiplier = v; },\n" +
	"\t\tcritSet: function (k, v) { critAsk[k] = v; },\n" +
	"\t\tdsSet: function (k, v) { dsAsk[k] = v; }, runFind: runDemandScaleSearch, runScale: runDemandScale,\n" +
	"\t\tdsSearch: function () { return dsSearch; }, dsRun: function () { return dsRun; },\n" +
	"\t\tminPressureSet: function (t) { if (!fireFlowAsk) { fireFlowAsk = fireFlowDefaults(); } fireFlowAsk.minPressure = t; },\n" +
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

	head('5b. FIRE FLOW WHEN A TANK EMPTIES (Net1, demands x6)');
	open('Net1.lwn');
	L.setEngine('epanet');
	L.setDm(6);
	const rr = await L.analysisRun();
	const emp = EC.lpnEpsTankEmptyAt(rr.frames, L.assembleModel(), null);
	check(!!emp, 'at six times the demand the tank empties in the run (' + (emp ? EC.lpnFormatTime(emp.t) : 'never') + ')');
	for (const w of ['minp', 'all']) {
		const set = await sweepSelected(['11', '12', '13', '21', '22', '23', '31', '32'], w);
		check(set.at.emptyT === emp.t, w + ': the set records the step the tank empties');
		check(set.results.length === 8 && set.counts.error === 0, w + ': every junction answered, none an error (' + JSON.stringify(set.counts) + ')');
		check(w === 'all' ? set.at.stepsDone === rr.frames.filter((f) => f.t < emp.t).length : set.at.t < emp.t, w + ': only steps before the tank empties were tested');
	}
	L.setDm(1);

	head('6. CRITICALITY OVER THE WHOLE RUN (Net1: pump 9 and pipe 10 are the only supply to the tank)');
	open('Net1.lwn');
	L.setEngine('epanet');
	L.minPressureSet('40');
	L.critSet('scope', 'all');
	L.critSet('when', 'run');
	const cr = await L.runcrit();
	check(cr && cr.ok && cr.wholeRun === 25, 'the whole-run set says it covers 25 reporting steps');
	// the independent reading: Net1 with the link removed, run once, tank level read off its frames
	async function emptyOf(linkId) {
		const m = L.assembleModel();
		m.links = m.links.filter((l) => l.id !== linkId);
		// a rule that names the link would be an input error to EPANET, as it is in the sweep's case model
		if (Array.isArray(m.rules)) { m.rules = m.rules.filter((r) => !(r.links || []).includes(linkId)); }
		const r = await EC.lpnEpanetRun(m, {});
		const tank = m.nodes.find((n) => n.type === 'tank');
		const f = r.frames.find((fr) => fr.levels[tank.id] <= (tank.minLevel || 0) + 1e-3);
		return { tank: tank.id, t: f ? f.t : null, frames: r.frames, model: m };
	}
	for (const id of ['9', '10']) {
		const rec = cr.byId[id], want = await emptyOf(id);
		check(rec.run && rec.run.emptyAt && rec.run.emptyAt.id === want.tank && rec.run.emptyAt.t === want.t && want.t !== null,
			`outage of link ${id}: the tank empties at ${rec.run && rec.run.emptyAt ? EC.lpnFormatTime(rec.run.emptyAt.t) : 'never'} (an independent run says ${want.t === null ? 'never' : EC.lpnFormatTime(want.t)})`);
		check(rec.run.belowSeconds === (24 * 3600 - rec.run.emptyAt.t) && EC.lpnCriticalitySeverity(rec) === 'fail', '  and it counts as a failure with the hours actually spent below the minimum, the last step an instant (' + rec.run.belowSeconds / 3600 + ' h)');
		check(rec.run.lowest && rec.run.lowest.t < rec.run.emptyAt.t, '  and its lowest pressure is read before the tank emptied, not from a disconnected network');
	}
	{
		const rec = cr.byId['11'], want = await emptyOf('11');
		let lo = Infinity, at = null;
		want.frames.forEach((f) => want.model.nodes.forEach((n) => {
			if (n.type === 'junction' && f.pressures[n.id] < lo) { lo = f.pressures[n.id]; at = f.t; }
		}));
		check(rec.run.emptyAt === null && want.t === null, 'outage of link 11: no tank empties');
		check(Math.abs(rec.run.lowest.pressure - lo) < 1e-9 && rec.run.lowest.t === at, `  and its lowest pressure over the run is the independent run's (${(lo / 0.703070).toFixed(2)} psi at ${EC.lpnFormatTime(at)})`);
	}
	L.critSet('when', 'now');
	const cn = await L.runcrit();
	check(cn.ok && !cn.wholeRun && cn.results.every((r) => r.run === undefined), 'the step on screen is unchanged: no run record on any row');

	head('6b. CRITICALITY WHOLE RUN: DEMAND NOT SERVED IS THE LARGEST OVER THE RUN');
	open('Net3.lwn');
	L.setEngine('epanet');
	L.minPressureSet('20');
	L.critSet('when', 'run');
	const c3 = await L.runcrit();
	const base3 = await L.analysisRun();
	const peakOf = (rec) => {
		let peak = 0, peakT = null;
		base3.frames.forEach((f) => {
			const sum = rec.cutOff.reduce((x, id) => x + f.demands[id], 0);
			if (sum > peak) { peak = sum; peakT = f.t; }
		});
		return { peak, peakT };
	};
	const cutting = c3.results.filter((r) => r.cutOff && r.cutOff.length && peakOf(r).peak > 0);
	check(cutting.length > 0, 'some Net3 outage cuts off a junction that has demand (' + cutting.map((r) => r.id).join(',') + ')');
	cutting.forEach((r) => {
		const w = peakOf(r);
		check(Math.abs(r.unserved - w.peak) < 1e-12 && r.unservedAt === w.peakT,
			`outage of link ${r.id} cuts off ${r.cutOff.join(',')}: demand not served is the run's own peak (${(w.peak * 15850.3231).toFixed(2)} gpm at ${EC.lpnFormatTime(w.peakT)})`);
	});
	L.critSet('when', 'now');

	head('7. DEMAND SCALING OVER THE WHOLE RUN (Net3)');
	open('Net3.lwn');
	L.setEngine('epanet');
	L.minPressureSet('20');
	// Net3 has junctions near the river below 20 psi with no demand at all, so the question is asked of
	// the hydrants, as a person would select them.
	const dsIds = ['15', '35', '101', '123', '161', '209', '255'];
	L.setSelectionList(dsIds.map((id) => ({ kind: 'node', id: id })));
	L.dsSet('scope', 'selected');
	L.dsSet('when', 'run');
	t0 = Date.now();
	await L.runFind();
	const wholeMs = Date.now() - t0;
	const ds = L.dsSearch();
	check(ds && ds.outcome === 'found' && ds.wholeRun === true, `the whole-run Find answers: demand scale ${ds && ds.multiplier} (${wholeMs} ms, ${ds && ds.solves} runs)`);
	const run3 = await L.analysisRun();
	const minP = EC.lpnFireFlowPsiToHead(20);
	// the independent reading: scale every demand, run the EPS, read every frame
	async function passes(mult) {
		const m = EC.lpnDemandScaleModel(L.assembleModel(), mult, dsIds);
		const r = await EC.lpnEpanetRun(m, {});
		if (!r.ok) { return { ok: false, why: 'run stopped' }; }
		let lo = Infinity, at = null;
		r.frames.forEach((f) => m.nodes.forEach((n) => {
			if (dsIds.includes(n.id) && f.pressures[n.id] < lo) { lo = f.pressures[n.id]; at = f.t; }
		}));
		const empty = EC.lpnEpsTankEmptyAt(r.frames, m, null);
		return { ok: lo >= minP && !empty, lo, at, empty };
	}
	const at = await passes(ds.multiplier), above = await passes(+(ds.multiplier + ds.step).toFixed(10));
	check(at.ok, `at the answer (${ds.multiplier}) an independent run holds 20 psi at every step (lowest ${(at.lo / 0.703070).toFixed(2)} psi at ${EC.lpnFormatTime(at.at)})`);
	check(!above.ok, `one step above it fails (${above.empty ? 'the tank runs dry' : (above.lo / 0.703070).toFixed(2) + ' psi at ' + EC.lpnFormatTime(above.at)})`);
	check(ds.limit && (above.empty ? ds.limit.t === above.empty.t : ds.limit.t === above.at), `the limiting reporting step is ${ds.limit && EC.lpnFormatTime(ds.limit.t)}`);

	// the single-instant answers at each reporting step, on the same frames
	let minInstant = Infinity, minAt = null;
	const instant = [];
	for (let k = 0; k < run3.frames.length; k += 1) {
		const tt = run3.frames[k].t;
		const m = L.analysisModelAt(tt, EC.lpnTimeFrameResult(run3, tt));
		const sr = await EC.lpnDemandScaleSearch(m, { solve: L.engineFor(m).solve, minPressure: minP, junctions: dsIds });
		instant.push({ t: tt, m: sr.multiplier, outcome: sr.outcome });
		if (sr.outcome === 'found' && sr.multiplier < minInstant) { minInstant = sr.multiplier; minAt = tt; }
	}
	console.log('    single-instant answers by step: ' + instant.map((x) => EC.lpnFormatTime(x.t) + '=' + x.m).join(' '));
	const instAtLimit = instant.find((x) => x.t === ds.limit.t);
	check(ds.multiplier <= instAtLimit.m + 1e-9, `the whole-run answer (${ds.multiplier}) is no larger than the single-instant answer at its limiting step ${EC.lpnFormatTime(ds.limit.t)} (${instAtLimit.m})`);
	check(ds.multiplier <= minInstant + 1e-9, `and no larger than the lowest single-instant answer (${minInstant} at ${EC.lpnFormatTime(minAt)})`);

	// Run at a scale, whole run: lowest pressure and its step per junction
	L.dsSet('multiplier', String(ds.multiplier));
	await L.runScale();
	const dr = L.dsRun();
	check(dr && dr.ok && dr.wholeRun && dr.below.length === 0 && !dr.emptied, 'Run at the answer: no junction below the limit over the run, no tank empties');
	check(dr.pressures.length > 50 && dr.pressures.every((x) => typeof x.t === 'number'), '  and every junction names the step of its lowest pressure (' + dr.pressures.length + ' junctions, ' + dr.pressures.filter((x) => typeof x.t !== 'number').map((x) => x.id).join(',') + ')');
	L.dsSet('multiplier', String(+(ds.multiplier + ds.step * 20).toFixed(10)));
	await L.runScale();
	const dr2 = L.dsRun();
	check(dr2.ok && (dr2.below.length > 0 || dr2.emptied), 'Run well above the answer: junctions fall below the limit or a tank empties');
	L.dsSet('when', 'now');
	await L.runFind();
	check(L.dsSearch().wholeRun === undefined && typeof L.dsSearch().multiplier === 'number', 'the step on screen is unchanged: no whole-run mark');

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
