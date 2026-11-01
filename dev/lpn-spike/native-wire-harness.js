// THE BUILT-IN SOLVER'S PERIOD LOOP, THROUGH THE PAGE'S OWN RUN PATH (Task 733, slice 7).
//
//   node dev/lpn-spike/native-wire-harness.js
//
// native-eps-harness.js and its siblings hold lpnNativeRun to EPANET's answer by calling the loop
// directly. This one holds the WIRING: js/lpn-time.js's lpnTimeRun() -> periodRun() -> the loop (or
// EPANET), with a host that answers engine() the way the page's Settings does, and the frames read back
// the way the page reads them (EngCalcs.lpnTimeRunFrames(), lpnTimeKeep()).
//
// Net1, Net2 and Net3 as the .inp files ship them -- patterns, [CONTROLS], and the file's own
// [QUALITY] (Net1 chlorine, Net2 fluoride with its source, Net3 a source trace from the Lake) -- are run
// twice through that path: engine 'native' and engine 'epanet'. The 'epanet' run is the page's old
// behaviour and must be the EPANET engine's own result; the 'native' run must say it is the built-in
// solver's and agree with it within the tolerances dev/native-eps-plan.md measured: 0.8 mm of head and of
// tank level, 0.002 L/s of flow or 1e-5 of the largest flow, and for quality the end-to-end tolerance of
// native-eps-quality-harness.js for that network.
//
// A case the loop refuses (a tank that names a volume curve the model has no rows for) must route to
// EPANET with the sentence that says so; the same case with the EPANET engine chosen says nothing.

'use strict';

const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
Object.assign(EngCalcs, require(path.join(ROOT, 'js', 'lpn-rules.js')));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));
require(path.join(ROOT, 'js', 'lpn-native-run.js'));
const { buildModel } = require('./net3-model.js');

const HEAD_TOL = 0.8e-3;   // m, also a tank's level
const FLOW_TOL = 2e-6;     // m3/s
const FLOW_REL = 1e-5;     // of the largest flow

let pass = 0, fail = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}

function loadEpa(file) {
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(path.join(__dirname, 'reference', file), 'utf8'));
	if (!parsed.ok) { throw new Error(file + ' does not parse: ' + parsed.error); }
	return { parsed, model: buildModel(EngCalcs, parsed) };
}
// The file's chemical run as the page hands it over (the same reading native-eps-quality-harness.js uses).
function chemical(file) {
	const { parsed, model } = loadEpa(file), sec = parsed.inpSections || {}, ft = parsed.scale.head;
	const qo = parsed.qualityOptions || {};
	model.quality = { mode: 'chemical', chemical: qo.quality };
	if (qo.tolerance !== undefined) { model.quality.tolerance = parseFloat(qo.tolerance); }
	if (qo.diffusivity !== undefined) { model.quality.diffusivity = parseFloat(qo.diffusivity); }
	(sec.QUALITY || []).forEach((ln) => {
		const w = String(ln).split(';')[0].trim().split(/\s+/);
		const n = model.nodes.find((x) => x.id === w[0]);
		if (n && isFinite(parseFloat(w[1]))) { n.initQuality = parseFloat(w[1]); }
	});
	const src = EngCalcs.lpnSourcesParse(sec.SOURCES || []);
	Object.keys(src).forEach((id) => { model.nodes.find((x) => x.id === id).source = src[id]; });
	const mix = EngCalcs.lpnMixingParse(sec.MIXING || []);
	Object.keys(mix).forEach((id) => { model.nodes.find((x) => x.id === id).mixing = mix[id]; });
	const re = EngCalcs.lpnReactionsParse(sec.REACTIONS || []);
	if (re.orderWall === undefined || re.orderWall === 1) {
		if (typeof re.globalWall === 'number') { re.globalWall *= ft; }
		Object.keys(re.wall).forEach((id) => { re.wall[id] *= ft; });
	}
	model.reactions = re;
	return model;
}
function traced(file, node) {
	const { model } = loadEpa(file);
	model.quality = { mode: 'trace', traceNode: node };
	return model;
}

// ---- the page's run path, with a host the way the page's seam is ----------------------------------------
let engine = 'native', doc = null, applied = null, statuses = [], routeNotes = [], notices = [], current = null;
EngCalcs.lpnTimeInit({
	tabs: [],
	doc: () => doc,
	apply: (r) => { if (applied) { applied(r); } },
	status: (t, c) => statuses.push([t, c]),
	notice: (t, c) => notices.push([t, c]),
	routeNote: (t) => routeNotes.push(t),
	engine: () => engine,
	// The Run button asks, then the page solves, which offers the model to lpnTimeRun().
	solve: () => { EngCalcs.lpnTimeRun(current); }, solveNow: () => { EngCalcs.lpnTimeRun(current); },
	native: () => ({ ok: true, converged: true, heads: {}, flows: {}, engine: 'native-steady' }),
	snapshot: () => {}, save: () => {},
	toSI: (v) => v, toDisplay: (v) => v, unitLabel: () => ''
});

// Run a model through lpnTimeRun() with the host answering `eng`. Resolves with the run the page holds,
// the frames as the page reads them, and the sentences the host was handed.
function pagePath(model, eng) {
	engine = eng;
	doc = { times: model.time.times, nodes: model.nodes, links: model.links };
	statuses = []; routeNotes = []; notices = [];
	// A copy, so neither engine edits the other's input.
	current = JSON.parse(JSON.stringify(model));
	return new Promise((resolve) => {
		applied = () => {
			const kept = EngCalcs.lpnTimeKeep();
			if (!kept) { return; }
			applied = null;
			resolve({ run: kept.run, frames: EngCalcs.lpnTimeRunFrames(), statuses: statuses.slice(), routeNotes: routeNotes.slice(), notices: notices.slice() });
		};
		EngCalcs.lpnTimeRunNow();
	});
}

function worst(framesA, framesB, which) {
	let d = 0, at = '-', big = 0;
	framesA.forEach((fa, i) => {
		const fb = framesB[i] || {}, a = fa[which] || {}, b = fb[which] || {};
		Object.keys(a).forEach((id) => {
			big = Math.max(big, Math.abs(a[id]));
			const x = Math.abs(a[id] - b[id]);
			if (!(x <= d)) { d = x; at = id + '@' + fa.t / 3600 + 'h'; }
		});
	});
	return { d, at, big };
}

async function compareNet(name, model, tol) {
	// The reference is the EPANET engine called directly, so the page's 'epanet' path is checked against it too.
	const direct = await EngCalcs.lpnEpanetRun(JSON.parse(JSON.stringify(model)));
	const viaEpanet = await pagePath(model, 'epanet');
	const viaNative = await pagePath(model, 'native');
	const E = direct, N = viaNative.run, P = viaEpanet.run;
	ok(name + ': engine setting EPANET still runs EPANET (page path == direct call)',
		P.engine === 'epanet' && viaEpanet.frames.every((f) => f.engine === 'epanet') && P.frames.length === E.frames.length &&
		worst(E.frames, P.frames, 'heads').d === 0 && worst(E.frames, P.frames, 'flows').d === 0 &&
		viaEpanet.routeNotes.every((t) => t === ''), `frames ${P.frames.length}`);
	ok(name + ': engine setting built-in runs the built-in loop, and says nothing about EPANET',
		N.engine === 'native' && viaNative.frames.length === E.frames.length && viaNative.frames.every((f) => f.engine === 'native') &&
		viaNative.routeNotes.every((t) => t === '') && N.ok === true && N.report === '' && N.engineVersion === undefined,
		`engine=${N.engine} frames=${N.frames.length} notes=${JSON.stringify(viaNative.routeNotes)}`);
	const times = N.frames.every((f, i) => f.t === E.frames[i].t);
	const hd = worst(E.frames, N.frames, 'heads'), lv = worst(E.frames, N.frames, 'levels'), fl = worst(E.frames, N.frames, 'flows');
	const flowTol = Math.max(FLOW_TOL, FLOW_REL * fl.big);
	ok(name + ': heads within 0.8 mm at every reporting time', times && hd.d <= HEAD_TOL, `worst ${(hd.d * 1000).toFixed(3)} mm @${hd.at}`);
	ok(name + ': tank levels within 0.8 mm', lv.d <= HEAD_TOL, `worst ${(lv.d * 1000).toFixed(3)} mm @${lv.at}`);
	ok(name + ': flows within 0.002 L/s or 1e-5 of the largest', fl.d <= flowTol, `worst ${(fl.d * 1000).toFixed(5)} L/s @${fl.at} (tol ${(flowTol * 1000).toFixed(5)})`);
	ok(name + ': the page reads the same statuses', N.frames.every((f, i) => JSON.stringify(f.statuses) === JSON.stringify(E.frames[i].statuses)),
		'');
	if (model.quality && model.quality.mode && model.quality.mode !== 'none') {
		const qn = worst(E.frames, N.frames, 'qualities'), ql = worst(E.frames, N.frames, 'linkQualities');
		ok(name + ': quality at every node within ' + tol.node + ' and every link within ' + tol.link + ' (' + model.quality.mode + ')',
			qn.d <= tol.node && ql.d <= tol.link && qn.big > 0, `node ${qn.d.toExponential(2)} @${qn.at}  link ${ql.d.toExponential(2)} @${ql.at}  largest ${qn.big.toPrecision(4)}`);
		ok(name + ': the page frame carries the quality, in the run\'s mode',
			viaNative.frames.every((f) => f.qualities && f.linkQualities && f.qualityMode === model.quality.mode));
		if (model.quality.mode === 'chemical') {
			const said = viaNative.notices.some((n) => n[1] === 'time-native-no-rates');
			ok(name + ': no reaction rates on a built-in run; the page says so the first time only',
				viaNative.frames.every((f) => f.linkRates === undefined) && viaEpanet.frames.some((f) => f.linkRates) &&
				said === !noRatesAlreadySaid, `said ${said}`);
			noRatesAlreadySaid = true;
		}
	}
	// Pumps: the energy summary has the page's fields on both sides.
	if (E.energy) {
		const en = N.energy, ee = E.energy;
		const keys = Object.keys(ee).filter((k) => k !== 'pumps');
		ok(name + ': the energy summary has every field the page reads', !!en && keys.every((k) => k in en) && en.pumps.length === ee.pumps.length,
			en ? `pumps ${en.pumps.length}` : 'null');
		if (en) {
			const rel = Math.abs(en.kwh - ee.kwh) / Math.max(1e-9, Math.abs(ee.kwh));
			ok(name + ': total kWh within 1e-3 of EPANET\'s', rel <= 1e-3, `native ${en.kwh.toFixed(3)} epanet ${ee.kwh.toFixed(3)} (rel ${rel.toExponential(2)})`);
		}
	} else {
		ok(name + ': no pumps, no energy summary on either side', !N.energy);
	}
	ok(name + ': the run carries the fields the box and status line read',
		typeof N.busyMs === 'number' && N.converged === true && N.duration === E.duration && Array.isArray(N.warnings) && N.stepsUnconverged === 0,
		`converged=${N.converged} steps=${N.steps}`);
}
let noRatesAlreadySaid = false;

async function run() {
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const withAccuracy = (m) => { m.hydraulics = Object.assign({ accuracy: 1e-5 }, m.hydraulics || {}); return m; };

	console.log('-- EPA\'s examples as shipped, through the page\'s run path');
	// Net1: pump 9 on two controls, chlorine from the file. Tolerances are native-eps-quality-harness.js's end-to-end ones.
	await compareNet('Net1 (chlorine, bulk and wall reactions, two controls)', withAccuracy(chemical('Net1.inp')), { node: 1e-4, link: 1e-4 });
	await compareNet('Net2 (fluoride source on a pattern, 55 h)', withAccuracy(chemical('Net2.inp')), { node: 5e-3, link: 5e-3 });
	{
		const m = withAccuracy(traced('Net3.inp', 'Lake'));
		await compareNet('Net3 (pumps, three tanks, controls, source trace from the Lake)', m, { node: 0.1, link: 0.1 });
	}
	// Net3 with no quality at all: hydraulics, controls and the pumps' energy only.
	await compareNet('Net3 without quality', withAccuracy(loadEpa('Net3.inp').model), { node: 0, link: 0 });

	console.log('-- a case the loop refuses routes to EPANET and says so');
	{
		const m = withAccuracy(loadEpa('Net1.inp').model);
		m.nodes.find((n) => n.type === 'tank').volCurveName = 'NOSUCH';   // a curve the model has no rows for: native-run-volume-curve
		const tank = m.nodes.find((n) => n.type === 'tank').id;
		ok('the loop refuses it by name', EngCalcs.lpnNativeRunRefusals(m, { quality: true }).some((r) => r.code === 'native-run-volume-curve' && r.ids[0] === tank));
		const plan = EngCalcs.lpnTimeNativePlan(m);
		ok('the plan is "wanted, not used"', plan.wanted === true && plan.use === false, JSON.stringify(plan.refusals));
		engine = 'native';
		const routed = await pagePath(m, 'native');
		ok('the run is EPANET\'s', routed.run.engine === 'epanet' && routed.frames.every((f) => f.engine === 'epanet') && routed.run.frames.length === 25);
		ok('and the status sentence names the tank',
			routed.routeNotes.some((t) => /EPANET solver/.test(t) && t.indexOf(tank) >= 0), JSON.stringify(routed.routeNotes));
		const chosen = await pagePath(m, 'epanet');
		ok('with the EPANET engine chosen the same network is run by EPANET and nothing is said', chosen.run.engine === 'epanet' && chosen.routeNotes.every((t) => t === ''));
		ok('the plan is not "wanted" when EPANET is chosen', EngCalcs.lpnTimeNativePlan(m).wanted === false);
	}
	{
		const m = withAccuracy(loadEpa('Net1.inp').model);
		m.msx = { text: '[TITLE]' };
		const plan = (engine = 'native', EngCalcs.lpnTimeNativePlan(m));
		ok('EPANET-MSX is refused with no ids, so the generic sentence is used', plan.use === false && plan.wanted === true && plan.refusals.some((r) => r.ids.length === 0));
	}

	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}
run().catch((e) => { console.error(e); process.exit(2); });
