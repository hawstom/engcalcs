// THE FIRE FLOW IS NEVER MULTIPLIED BY THE DEMAND MULTIPLIER. Run with:
//   node dev/lpn-spike/fireflow-multiplier-harness.js
//
// Tom, 2026-10-18: *"I say that we can't have the fire flow analysis demand multiplied. If
// necessary, we must divide it behind the scenes so that the base demand is multiplied, but not the
// fire flow. If base demand is 100, fire flow is 1000, and multiplier is 3.0, the fire flow
// analysis flow needs to be 1300, not 3300."*
//
// His case exactly, through the page's own Fire flow analysis (runFireFlowSweep), in BOTH engines,
// with the multiplier set on the document and then on a scenario, and at two steps of an
// extended-period run (pattern 1 then 2, so 1300 then 1600). Two things are measured:
//   1. what the solver is HANDED at the tested junction on the probe at the required flow, and
//   2. what the engine actually SOLVED with: the pressure at that probe must equal an ordinary
//      solve of the same network with 1300 typed at the junction and no multiplier at all. This
//      is the half that would catch EPANET applying its own Demand Multiplier on top.
// And the available fire flow reported must be the fire flow itself: the same number a network
// with 300 typed in and multiplier 1 reports.

'use strict';

const { ROOT, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');

require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-fireflow.js');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections, nodeById: nodeById, setProp: setProp,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, touchTree: touchTree,\n" +
	"\t\tdocDM: docDemandMultiplier,\n" +
	"\t\tsetSelectionList: setSelectionList, runFireFlowSweep: runFireFlowSweep,\n" +
	"\t\tsetAsk: function (k, v) { if (!fireFlowAsk) { fireFlowAsk = fireFlowDefaults(); } fireFlowAsk[k] = v; },\n" +
	"\t\tffRun: function () { return fireFlowRun; },\n" +
	"\t\tsetEngine: function (e) { settings.engine = e; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
const EngCalcs = global.EngCalcs;
const GPM = EngCalcs.lpnFireFlowGpmToSI(1);

// One reservoir, one pipe, one junction. Pattern PAT1 is 1 for the first hour and 2 for the second.
function inp(demand, mult, eps) {
	return '[TITLE]\nfire flow multiplier\n\n' +
		'[JUNCTIONS]\n J1  0  ' + demand + (eps ? '  PAT1' : '') + '\n\n' +
		'[RESERVOIRS]\n R1  150\n\n' +
		'[PIPES]\n P1  R1  J1  1000  12  130  0  Open\n\n' +
		(eps ? '[PATTERNS]\n PAT1  1  2\n\n[TIMES]\n Duration 1:00\n Hydraulic Timestep 1:00\n' +
			' Pattern Timestep 1:00\n Report Timestep 1:00\n\n' : '') +
		'[OPTIONS]\n Units GPM\n Headloss H-W\n' + (mult !== 1 ? ' Demand Multiplier ' + mult + '\n' : '') +
		'\n[COORDINATES]\n R1  0  0\n J1  1000  0\n\n[END]\n';
}
function open(text) {
	const parsed = EngCalcs.lpnInpParse(text);
	if (!parsed.ok) { throw new Error('did not parse: ' + JSON.stringify(parsed.error)); }
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	L.applySaved(L.docFromInp(parsed, 'ffmult.inp'));
	L.buildDom();
	L.applyMethodUI();
}

// Wrap both engines so every model a solve is handed is seen, at the tested junction.
const handed = [];
const realNative = EngCalcs.lpnSolve, realEpanet = EngCalcs.lpnSolveEpanet;
EngCalcs.lpnSolve = function (m, o) { record(m); return realNative.apply(this, arguments); };
EngCalcs.lpnSolveEpanet = function (m, o) { record(m); return realEpanet.apply(this, arguments); };
function record(m) {
	const j = (m.nodes || []).find((n) => n.id === 'J1');
	if (j) { handed.push(j.demand); }
}

// The page's own Fire flow analysis on J1, 1000 gpm required, 20 psi residual. Returns the record,
// the demand handed to the solver at the required-flow probe (the second probe: 0, required, ...),
// in gpm, and that probe's pressure.
async function fireAtJ1() {
	handed.length = 0;
	L.setSelectionList([{ kind: 'node', id: 'J1' }]);
	L.setAsk('scope', 'selected');
	L.setAsk('design', 'off');
	L.setAsk('required', '1000');
	L.setAsk('residual', '20');
	await L.runFireFlowSweep();
	const rec = L.ffRun().byId.J1;
	return { rec: rec, atRequired: handed[1] / GPM, pressureAtRequired: rec.pressureAtRequired };
}
(async function () {
	setUnitSet('us');
	L.buildLayers();
	await warmEpanet();

	for (const engine of ['native', 'epanet']) {
		console.log('\n--- ' + engine + ' engine, one instant ---');

		// The reference: 1300 typed, multiplier 1, so nothing anywhere multiplies anything.
		open(inp(1300, 1, false));
		L.setEngine(engine);
		// Its static pressure (the probe at 0) is what a plain 1300 gpm solve gives.
		const ref1300 = (await fireAtJ1()).rec.staticPressure;

		// The reference for the available flow: 300 typed, multiplier 1.
		open(inp(300, 1, false));
		L.setEngine(engine);
		const ref300 = await fireAtJ1();

		// Tom's case: 100 typed, the document's multiplier 3.0.
		open(inp(100, 3.0, false));
		L.setEngine(engine);
		ok('the document resolves multiplier 3', L.docDM() === 3, L.docDM());
		const tom = await fireAtJ1();
		ok('Tom\'s case, document multiplier: the solver is handed 1300 gpm at J1, not 3300',
			Math.abs(tom.atRequired - 1300) < 1e-6, tom.atRequired.toFixed(3) + ' gpm');
		ok('...and the engine solved 1300: the pressure equals a plain 1300 gpm solve',
			Math.abs(tom.pressureAtRequired - ref1300) < 1e-6,
			(tom.pressureAtRequired - ref1300).toExponential(2) + ' m');
		ok('...and the available fire flow is the fire flow itself (= 300 typed, multiplier 1)',
			Math.abs(tom.rec.available - ref300.rec.available) < 1e-9 && tom.rec.available > 0,
			(tom.rec.available / GPM).toFixed(1) + ' vs ' + (ref300.rec.available / GPM).toFixed(1) + ' gpm');

		// The same multiplier held by a scenario instead, the document saying 1.
		open(inp(100, 1, false));
		L.setEngine(engine);
		const s = L.createScenario('Maximum day');
		s.demandMultiplier = 3.0;
		L.touchTree();
		ok('the scenario resolves multiplier 3', L.docDM() === 3, L.docDM());
		const scn = await fireAtJ1();
		ok('Tom\'s case, scenario multiplier: the solver is handed 1300 gpm at J1',
			Math.abs(scn.atRequired - 1300) < 1e-6, scn.atRequired.toFixed(3) + ' gpm');
		ok('...and the engine solved 1300',
			Math.abs(scn.pressureAtRequired - ref1300) < 1e-6,
			(scn.pressureAtRequired - ref1300).toExponential(2) + ' m');
		ok('...and the available fire flow is unscaled',
			Math.abs(scn.rec.available - ref300.rec.available) < 1e-9,
			(scn.rec.available / GPM).toFixed(1) + ' gpm');

		// Multiplier 0: the base demand vanishes and the fire flow alone is drawn.
		open(inp(100, 0, false));
		L.setEngine(engine);
		const zero = await fireAtJ1();
		ok('multiplier 0: the solver is handed the fire flow alone, 1000 gpm',
			Math.abs(zero.atRequired - 1000) < 1e-6, zero.atRequired.toFixed(3) + ' gpm');
	}

	// ---- an extended-period run on screen: the step's own pattern multiplier, times 3, plus 1000
	console.log('\n--- epanet engine, extended-period run on screen ---');
	const ref = {};
	for (const engine of ['epanet', 'native']) {
		for (const q of [1300, 1600]) {
			open(inp(q, 1, false));
			L.setEngine(engine);
			ref[engine + q] = (await fireAtJ1()).rec.staticPressure;
		}
	}

	open(inp(100, 3.0, true));
	L.setEngine('epanet');
	EngCalcs.lpnTimeArrived();
	EngCalcs.lpnTimeRunNow();
	const t0 = Date.now();
	while (EngCalcs.lpnTimeRunState().frames < 2 && Date.now() - t0 < 60000) { await wait(25); }
	ok('the run produced its two frames', EngCalcs.lpnTimeRunState().frames === 2, EngCalcs.lpnTimeRunState().frames);
	for (const [t, want] of [[0, 1300], [3600, 1600]]) {
		EngCalcs.lpnTimeGoTo(t);
		for (const engine of ['epanet', 'native']) {
			L.setEngine(engine);
			const r = await fireAtJ1();
			ok(`at ${EngCalcs.lpnFormatTime(t)}, ${engine}: the solver is handed ${want} gpm (pattern x 3 x 100 + 1000)`,
				Math.abs(r.atRequired - want) < 1e-6, r.atRequired.toFixed(3) + ' gpm');
			ok(`...and the engine solved ${want}`, Math.abs(r.pressureAtRequired - ref[engine + want]) < 1e-6,
				(r.pressureAtRequired - ref[engine + want]).toExponential(2) + ' m');
		}
	}

	console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });
