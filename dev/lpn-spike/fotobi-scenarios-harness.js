// TOM'S FOTOBI PROJECT, EVERY SCENARIO THROUGH EPANET (Tom, 2026-10-14).
//
//   node dev/lpn-spike/fotobi-scenarios-harness.js
//
// fixtures/fotobi-scenarios.epp is the file he sent, unchanged: two systems, each a reservoir and
// a pump with a tank, four level controls on the pumps, and thirteen scenarios built from
// alternatives -- a Topology alternative switching the pumps (and in "No wells" the reservoirs)
// off, Initial alternatives filling the tanks, Physical ones resizing pipes, and calculation sets
// giving the drain tests a 24-hour run. The engine half of the defect he hit is held in
// epanet-topology-refusal-harness.js; this holds his own file, in his own scenario structure:
//
//   1. every scenario solves through EPANET and every scenario with a run runs, none refused;
//   2. the same with his "EPS Pump off" Topology alternative switching the RESERVOIRS off instead
//      of the pumps -- each pump is then out of the run because its end is, and its [ENERGY] price
//      used to go to EPANET anyway (Error 216, the whole run refused). Before the fix this part
//      did not merely fail: the refusals damaged the engine and a later run hung inside it;
//   3. "did not converge" in the pump-off scenarios, which he asked about, is EPANET's verdict at
//      this page's Accuracy of 0.00001, not a wrong network: removing a pump leaves a dead-end
//      pipe with no flow where it stood, the flows elsewhere are a ten-thousandth of a gpm, and at
//      EPANET's own default Accuracy (0.001) the same network converges -- to heads within a
//      millimetre of both the unconverged answer and the built-in solver's.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
['log', 'warn', 'error'].forEach((k) => {
	const f = console[k].bind(console);
	console[k] = (...a) => { if (typeof a[0] === 'string' && a[0].indexOf('epanet-js (') === 0) { return; } f(...a); };
});
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const FIXTURE = path.join(__dirname, 'fixtures', 'fotobi-scenarios.epp');
const { loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');
require(path.join(ROOT, 'js', 'lpn-time.js'));

const L = loadLoopedNetwork(
	"\t\tassembleModel: assembleModel, applySaved: applySaved, switchScenario: switchScenario,\n" +
	"\t\tacceptImportedText: acceptImportedText, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tgetScenarios: function () { return scenarios; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n");
const EngCalcs = global.EngCalcs;
['lpn-inp.js', 'lpn-net.js', 'lpn-patterns.js', 'lpn-epanet.js'].forEach((f) => require(path.join(ROOT, 'js', f)));

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const clone = (m) => JSON.parse(JSON.stringify(m));
const said = (r) => !r ? 'none' : r.refused ? 'REFUSED ' + r.engineError : (r.ok ? 'ok' : 'issues ' + JSON.stringify(r.issues).slice(0, 120));

function load(edit) {
	const saved = L.acceptImportedText(fs.readFileSync(FIXTURE, 'utf8'));
	if (edit) { edit(saved); }
	L.applySaved(saved);
}
function modelOf(name) {
	const scn = L.getScenarios().find((s) => s.name === name);
	L.switchScenario(scn.id);
	return L.assembleModel();
}
async function everyScenario(label) {
	for (const scn of L.getScenarios()) {
		const model = modelOf(scn.name);
		const steady = await EngCalcs.lpnSolveEpanet(clone(model), {});
		ok(label + scn.name + ': solved by EPANET', !!steady && steady.ok && !steady.refused &&
			Object.values(steady.heads || {}).every((h) => isFinite(h)), said(steady));
		if (model.time && model.time.times && model.time.times.duration > 0) {
			const run = await EngCalcs.lpnEpanetRun(clone(model));
			ok(label + scn.name + ': its ' + (model.time.times.duration / 3600) + '-hour run finishes', !!run && run.ok && !run.refused &&
				(run.frames || []).length === model.time.times.duration / 3600 + 1, said(run));
		}
	}
}

(async function () {
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();
	await EngCalcs.lpnEpanetLoad();

	console.log('\n--- 1. his file as he sent it ---');
	load();
	ok('thirteen scenarios', L.getScenarios().length === 13);
	await everyScenario('');

	console.log('\n--- 2. the reservoirs switched off instead of the pumps ---');
	load((s) => {
		s.alternatives.find((a) => a.id === 'a14').values = { 'n:R-NW': { active: false }, 'n:R-NE': { active: false } };
	});
	const off = modelOf('EPS Pump off');
	ok('EPS Pump off: the pumps are out of its run with their reservoirs', !off.links.some((l) => l.type === 'pump'));
	ok('...and its input has no [ENERGY] row for P-NE', !/PUMP\s+P-NE/.test(EngCalcs.lpnToInp(off, { eps: true }).inp));
	await everyScenario('(reservoirs off) ');

	console.log('\n--- 3. "did not converge" with the pumps off is the Accuracy, not the network ---');
	load();
	const m = modelOf('EPS Pump off');
	const tight = await EngCalcs.lpnSolveEpanet(clone(m), {});
	ok('at this page\'s Accuracy (0.00001) EPANET reports it did not converge', tight.ok && tight.converged === false,
		'relative error ' + tight.relativeError + ' after ' + tight.iterations);
	const loose = clone(m);
	loose.hydraulics = Object.assign({}, loose.hydraulics, { accuracy: 0.001 });
	const easy = await EngCalcs.lpnSolveEpanet(loose, {});
	ok('...at EPANET\'s own default Accuracy (0.001) it converges', easy.ok && easy.converged === true, easy.iterations + ' iterations');
	const native = EngCalcs.lpnSolve(clone(m), { tol: 1e-9 });
	const worst = (a, b) => Math.max(...m.nodes.map((n) => Math.abs(a.heads[n.id] - b.heads[n.id])));
	ok('...and the three answers agree within a millimetre of head', worst(tight, easy) < 1e-3 && worst(easy, native) < 1e-3,
		'unconverged vs converged ' + worst(tight, easy).toExponential(1) + ' m, EPANET vs built-in ' + worst(easy, native).toExponential(1) + ' m');
	const stub = ['J-A20', 'J-A60'].map((id) => m.links.filter((l) => l.from === id || l.to === id).length);
	ok('...where each pump stood, a junction with no demand on one pipe is left: a dead end with no flow',
		stub.every((c) => c === 1) && m.nodes.filter((n) => n.id === 'J-A20' || n.id === 'J-A60').every((n) => !n.demand));

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });
