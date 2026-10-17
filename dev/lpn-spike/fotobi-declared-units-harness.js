// TOM'S METRIC FOTOBI, AS ITS FILE DECLARES IT AND AS HE MEANT IT (Tom, 2026-10-16 evening).
//
//   node dev/lpn-spike/fotobi-declared-units-harness.js
//
// His report: the 1-hr to 16-hr drain scenarios, which had run with the tanks 2.499 of 2.5 m full,
// now stop ("The EPANET run stopped at 0:20:20 ... Tank T-NW was full, so EPANET had closed L11").
// fixtures/fotobi-si-2026-10-16.epp is the file he sent, unchanged. Its numbers are metric (tank
// 2.5 deep and 3 across, 19-50 pipes, label suffixes " m H2O", " mm", " lpm"), but its `units`
// block declares US customary: ft, in, ft H2O, gpm. The page reads a number in the unit the file
// declares, so it ran 19-50 INCH pipes, a 2.5 FT tank and 1 gpm per station. Every commit back to
// 2026-10-14 gives that same stop; none changed the hydraulics. This holds both halves:
//
//   1. as declared: the run is in feet (tank maximum 0.762 m), and the 16-hr drain stops at
//      0:20:20 on L11 beside a full T-NW -- exactly his message, so the stub is his page;
//   2. as he meant it (m, mm, m H2O, L/min, the same numbers): every scenario runs its 24 hours.
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
const FIXTURE = path.join(__dirname, 'fixtures', 'fotobi-si-2026-10-16.epp');
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
const METRIC = {
	lpn_u_length: 'm', lpn_u_diameter: 'mm', lpn_u_elevhead: 'mh2o', lpn_u_pressure: 'mh2o',
	lpn_u_flow: 'lpm', lpn_u_velocity: 'mps', lpn_u_gradient: 'gradePercent', lpn_u_roughness: 'mm', lpn_u_age: 'hr'
};
function load(units) {
	const saved = L.acceptImportedText(fs.readFileSync(FIXTURE, 'utf8'));
	if (units) { saved.units = units; }
	L.applySaved(saved);
	return saved;
}
function modelOf(name) {
	L.switchScenario(L.getScenarios().find((s) => s.name === name).id);
	return L.assembleModel();
}
const DRAINS = ['1-hr drain w pump off', '8-hr drain w pump off', '12-hr drain w pump off', '16-hr drain w pump off'];

(async function () {
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();
	await EngCalcs.lpnEpanetLoad();

	console.log('\n--- 1. as the file declares it: US customary ---');
	const saved = load();
	ok('the file declares feet and inches', saved.units.lpn_u_length === 'ft' && saved.units.lpn_u_diameter === 'in');
	ok('...over metric numbers: a 2.5 deep tank, 19-50 pipes, " mm" and " m H2O" label suffixes',
		saved.nodes.find((n) => n.id === 'T-NW').maxLevel === 2.5 &&
		saved.labelSettings.suffix.link.diameter === ' mm' && saved.labelSettings.suffix.node.level === ' m H2O');
	const m16 = modelOf('16-hr drain w pump off');
	const tnw = m16.nodes.find((n) => n.id === 'T-NW');
	ok('the run reads the tank maximum as 2.5 ft (0.762 m)', Math.abs(tnw.maxLevel - 0.762) < 1e-6, String(tnw.maxLevel));
	const r16 = await EngCalcs.lpnEpanetRun(clone(m16));
	ok('...and the 16-hr drain stops at 0:20:20, as he saw', !!r16 && r16.stoppedAt === 1220, String(r16 && r16.stoppedAt));
	ok('...on L11 beside a full T-NW, cutting off J-NW-S-3, J-NW-S-2, J-NW-S-1',
		!!r16.cutOff && r16.cutOff.link === 'L11' && r16.cutOff.tank === 'T-NW' && r16.cutOff.tankState === 'full' &&
		r16.cutOff.nodes.join() === 'J-NW-S-3,J-NW-S-2,J-NW-S-1', JSON.stringify(r16.cutOff));

	console.log('\n--- 2. the same numbers, in the units he meant: m, mm, m H2O, L/min ---');
	load(METRIC);
	const tm = modelOf('16-hr drain w pump off').nodes.find((n) => n.id === 'T-NW');
	ok('the tank is 2.4999 of 2.5 m', Math.abs(tm.maxLevel - 2.5) < 1e-9 && Math.abs(tm.level - 2.4999) < 1e-9,
		tm.level + ' of ' + tm.maxLevel);
	for (const scn of L.getScenarios()) {
		const model = modelOf(scn.name);
		if (!(model.time && model.time.times && model.time.times.duration > 0)) { continue; }
		const run = await EngCalcs.lpnEpanetRun(clone(model));
		const hours = model.time.times.duration / 3600;
		ok(scn.name + ': its ' + hours + '-hour run finishes', !!run && run.ok && !run.refused &&
			(run.frames || []).length === hours + 1, run && (run.engineError || ''));
	}
	ok('every drain scenario was among them', DRAINS.every((n) => L.getScenarios().some((s) => s.name === n)));

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });
