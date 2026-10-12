// EVERY PROPERTY OVERRIDABLE PER SCENARIO -- Tom, 2026-10-12. Run with:
//   node dev/lpn-spike/scenario-all-overridable-harness.js
//
// Tom: *"I don't accept this. Change it, include them all as overridable... these limitations
// were... indefensible."* Until then a node's elevation, a reservoir's head pattern, a tank's depth
// limits, diameter, volume curve and mixing, and a pump's relative speed and speed pattern were
// Base-owned: typed inside a scenario, they edited Base under every scenario at once. Asserted on
// Net1, with the native solver and with EPANET:
//   1. Each is in LPN_OVERRIDABLE, and setProp() inside a scenario writes an override and leaves
//      Base's own value alone.
//   2. A scenario's elevation (a junction's and the tank's) and its pump speed change THAT
//      scenario's solved pressures and flows, in both engines, and Base's not at all.
//   3. A scenario's tank depth limits, diameter and mixing, and its head and speed patterns, reach
//      the solver's model and the .inp export in that scenario, and not in Base.
//   4. The overrides survive a save and reopen; a unit change converts a scenario's elevation and
//      tank diameter; a pattern rename reaches a scenario's head and speed pattern.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; }, getScenarios: function () { return scenarios; },\n" +
	"\t\tsetEngine: function (e) { settings.engine = e; },\n" +
	"\t\tOVERRIDABLE: LPN_OVERRIDABLE, effective: effective, setProp: setProp, hasOverride: hasOverride, baseValue: baseValue,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, baseScenario: baseScenario, activeScenario: activeScenario,\n" +
	"\t\tassembleModel: assembleModel, engineFor: engineFor, serializeProject: serializeProject, projectFileText: projectFileText,\n" +
	"\t\tconvertUnitValues: convertUnitValues, libRepointPattern: libRepointPattern, touchTree: touchTree,\n" +
	"\t\town: function (s) { return resolvedOverrides(s); },\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(inpExportDocument(), inpExportOptions()); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const NEW = { node: ['elev', 'minLevel', 'maxLevel', 'tankDiameter', 'volCurve', 'mixingModel', 'mixingFraction', 'headPattern'], link: ['speed', 'speedPattern'] };

function open() {
	L.applySaved(L.acceptImportedText(fs.readFileSync(ROOT + 'examples/Net1.lwn', 'utf8')));
	L.buildDom();
	L.applyMethodUI();
}
const node = (id) => L.getDoc().nodes.filter((n) => n.id === id)[0];
const link = (id) => L.getDoc().links.filter((l) => l.id === id)[0];
async function solve() {
	const m = L.assembleModel();
	const r = await Promise.resolve(L.engineFor(m).solve(m));
	return r && (r.ok !== false) ? r : null;
}
const flowOf = (r, id) => (r.flows || {})[id];
const inpRow = (inp, section, id) => {
	const lines = inp.split('\n'), start = lines.findIndex((l) => l.trim().toUpperCase() === '[' + section + ']');
	for (let i = start + 1; i < lines.length && !/^\[/.test(lines[i].trim()); i++) {
		if (lines[i].trim().split(/\s+/)[0] === id) { return lines[i].trim().split(/\s+/); }
	}
	return null;
};

(async function () {
	setUnitSet('us');
	L.buildLayers();
	await warmEpanet();

	console.log('--- 1. every one is overridable, and a scenario write leaves Base alone ---');
	open();
	ok('each formerly Base-owned property is in LPN_OVERRIDABLE', Object.keys(NEW).every((g) => NEW[g].every((p) => L.OVERRIDABLE[g][p] === true)),
		JSON.stringify(Object.keys(NEW).map((g) => NEW[g].filter((p) => !L.OVERRIDABLE[g][p]))));
	const J = node('22'), T = node('2'), R = node('9'), P = link('9');
	ok('Net1 has junction 22, tank 2, reservoir 9 and pump 9', !!(J && T && R && P && T.type === 'tank' && R.type === 'reservoir' && P.type === 'pump'));
	const base0 = { jElev: J.elev, tElev: T.elev, tMin: T.minLevel, tMax: T.maxLevel, tD: T.tankDiameter, pSpeed: P.speed, mix: T.mixingModel };
	const S = L.createScenario('Everything');
	L.switchScenario(S.id);
	L.setProp(J, 'elev', J.elev + 50);
	L.setProp(T, 'elev', T.elev + 20);
	L.setProp(T, 'minLevel', 5);
	L.setProp(T, 'maxLevel', 140);
	L.setProp(T, 'tankDiameter', 60);
	L.setProp(T, 'mixingModel', '2COMP');
	L.setProp(T, 'mixingFraction', 0.4);
	L.setProp(R, 'headPattern', '1');
	L.setProp(P, 'speed', 0.8);
	L.setProp(P, 'speedPattern', '1');
	const marked = [[J, 'elev'], [T, 'elev'], [T, 'minLevel'], [T, 'maxLevel'], [T, 'tankDiameter'], [T, 'mixingModel'], [T, 'mixingFraction'], [R, 'headPattern'], [P, 'speed'], [P, 'speedPattern']]
		.filter((x) => !L.hasOverride(x[0], x[1])).map((x) => x[0].id + '.' + x[1]);
	ok('each write in the scenario is an override, marked', !marked.length, marked.join(', '));
	ok('...and Base\'s own values are untouched', J.elev === base0.jElev && T.elev === base0.tElev && T.minLevel === base0.tMin && T.maxLevel === base0.tMax &&
		T.tankDiameter === base0.tD && P.speed === base0.pSpeed && T.mixingModel === base0.mix && !R.headPattern && !P.speedPattern);
	ok('...and the scenario reads its own', L.effective(J, 'elev') === base0.jElev + 50 && L.effective(T, 'tankDiameter') === 60 && L.effective(P, 'speed') === 0.8);
	const altPhys = (L.getDoc().alternatives || []).filter((a) => a.id === (S.alternatives || {}).physical)[0];
	ok('...held in the scenario\'s own Physical alternative, named after it', !!altPhys && altPhys.name === 'Everything' && altPhys.values['n:22'].elev === base0.jElev + 50);

	for (const engine of ['native', 'epanet']) {
		console.log('\n--- 2. ' + engine + ': the scenario\'s own elevations and pump speed change its answers, and Base\'s not ---');
		L.setEngine(engine);
		L.switchScenario(L.baseScenario().id);
		const b = await solve();
		ok(engine + ': Base solves', !!b && !!b.pressures);
		L.switchScenario(S.id);
		const s = await solve();
		ok(engine + ': the scenario solves', !!s && !!s.pressures);
		L.switchScenario(L.baseScenario().id);
		const b2 = await solve();
		// The solver answers in SI: heads in metres, pressures in metres of water. Junction 22's
		// ground is 50 ft (15.24 m) higher, and the tank that sets the heads around it is 20 ft
		// (6.10 m) higher, so its pressure falls by about the difference, 9.1 m.
		const drop = b.pressures['22'] - s.pressures['22'];
		ok(engine + ': junction 22 sits 50 ft higher under a tank 20 ft higher: its pressure is about 30 ft (9.1 m) lower', Math.abs(drop - 30 * 0.3048) < 0.5, b.pressures['22'] + ' -> ' + s.pressures['22']);
		ok(engine + ': the pump at speed 0.8 moves a different flow', Math.abs(flowOf(s, '9') - flowOf(b, '9')) > 1e-3, flowOf(b, '9') + ' -> ' + flowOf(s, '9'));
		const tankHead = (r) => (r.heads || {})['2'];
		ok(engine + ': the tank 20 ft higher holds a head 20 ft (6.096 m) higher', Math.abs((tankHead(s) - tankHead(b)) - 20 * 0.3048) < 1e-6, tankHead(b) + ' -> ' + tankHead(s));
		ok(engine + ': Base solves exactly as before the scenario was solved', JSON.stringify(b2.pressures) === JSON.stringify(b.pressures));
	}

	console.log('\n--- 3. the model and the export carry the rest, in the scenario only ---');
	L.switchScenario(L.baseScenario().id);
	const mb = L.assembleModel(), xb = L.exportInp();
	L.switchScenario(S.id);
	const ms = L.assembleModel(), xs = L.exportInp();
	const mn = (m, id) => m.nodes.filter((n) => n.id === id)[0], ml = (m, id) => m.links.filter((l) => l.id === id)[0];
	ok('the model\'s tank 2 has the scenario\'s limits and diameter', mn(ms, '2').maxLevel !== mn(mb, '2').maxLevel && mn(ms, '2').minLevel !== mn(mb, '2').minLevel &&
		mn(ms, '2').diameter !== mn(mb, '2').diameter, JSON.stringify([mn(mb, '2'), mn(ms, '2')]));
	ok('...reservoir 9 names the scenario\'s head pattern, Base\'s none', mn(ms, '9').headPattern === '1' && !mn(mb, '9').headPattern);
	ok('...pump 9 runs at 0.8 on pattern 1 in the scenario, 1 on none in Base', ml(ms, '9').speed === 0.8 && ml(ms, '9').speedPattern === '1' && ml(mb, '9').speed === 1 && !ml(mb, '9').speedPattern,
		JSON.stringify([ml(mb, '9').speed, ml(ms, '9').speed]));
	ok('both exports are written', xb.ok && xs.ok);
	const jb = inpRow(xb.inp, 'JUNCTIONS', '22'), js = inpRow(xs.inp, 'JUNCTIONS', '22');
	ok('[JUNCTIONS] 22: the scenario\'s export states its elevation, Base\'s its own', +js[1] === base0.jElev + 50 && +jb[1] === base0.jElev, JSON.stringify([jb, js]));
	const tb = inpRow(xb.inp, 'TANKS', '2'), ts = inpRow(xs.inp, 'TANKS', '2');
	ok('[TANKS] 2: elevation, minimum and maximum depth and diameter are the scenario\'s', +ts[1] === base0.tElev + 20 && +ts[3] === 5 && +ts[4] === 140 && +ts[5] === 60 &&
		+tb[1] === base0.tElev && +tb[5] === base0.tD, JSON.stringify([tb, ts]));
	const rs = inpRow(xs.inp, 'RESERVOIRS', '9'), rb = inpRow(xb.inp, 'RESERVOIRS', '9');
	ok('[RESERVOIRS] 9: the scenario\'s head pattern', rs[2] === '1' && rb.length === 2, JSON.stringify([rb, rs]));
	const ps = inpRow(xs.inp, 'PUMPS', '9');
	ok('[PUMPS] 9: SPEED 0.8 and PATTERN 1 in the scenario', ps.join(' ').indexOf('SPEED 0.8') >= 0 && ps.join(' ').indexOf('PATTERN 1') >= 0 &&
		inpRow(xb.inp, 'PUMPS', '9').join(' ').indexOf('SPEED') < 0, JSON.stringify(ps));
	const mixS = inpRow(xs.inp, 'MIXING', '2');
	ok('[MIXING] 2: the scenario\'s two-compartment model and its fraction', !!mixS && mixS[1] === '2COMP' && +mixS[2] === 0.4, JSON.stringify(mixS));

	console.log('\n--- 4. a file, a unit change, a pattern rename ---');
	const text = L.projectFileText();
	L.applySaved(L.acceptImportedText(text));
	L.buildDom();
	const S2 = L.getScenarios().filter((x) => x.name === 'Everything')[0];
	L.switchScenario(S2.id);
	ok('saved and reopened, the scenario still reads its own elevation and pump speed', L.effective(node('22'), 'elev') === base0.jElev + 50 && L.effective(link('9'), 'speed') === 0.8);
	ok('...and Base its own', (L.switchScenario(L.baseScenario().id), node('22').elev === base0.jElev && L.effective(link('9'), 'speed') === base0.pSpeed));
	L.convertUnitValues('lpn_u_elevhead', 0.3048);
	L.switchScenario(S2.id);
	ok('a unit change (ft to m) converts the scenario\'s elevation and depth limits', Math.abs(L.effective(node('22'), 'elev') - (base0.jElev + 50) * 0.3048) < 1e-9 &&
		Math.abs(L.effective(node('2'), 'maxLevel') - 140 * 0.3048) < 1e-9, String(L.effective(node('22'), 'elev')));
	L.convertUnitValues('lpn_u_length', 0.3048);
	ok('...and a length change converts its tank diameter', Math.abs(L.effective(node('2'), 'tankDiameter') - 60 * 0.3048) < 1e-9, String(L.effective(node('2'), 'tankDiameter')));
	L.libRepointPattern('1', 'Daily');
	ok('a pattern rename reaches the scenario\'s head pattern and speed pattern', L.effective(node('9'), 'headPattern') === 'Daily' && L.effective(link('9'), 'speedPattern') === 'Daily',
		JSON.stringify([L.effective(node('9'), 'headPattern'), L.effective(link('9'), 'speedPattern')]));

	console.log(fails ? '\n' + fails + ' check(s) FAILED' : '\nscenario-all-overridable: ALL PASS');
	process.exit(fails ? 1 : 0);
})().catch((e) => { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });
