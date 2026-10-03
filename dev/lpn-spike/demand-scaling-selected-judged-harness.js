// DEMAND SCALING UNDER "Selected junctions" JUDGES THE SELECTED JUNCTIONS (Tom's browser pass,
// 2026-10-03: "The Time Series graph shows all the selected junctions above 55 psi at 7:00. But
// Scaling Find says '⚠ At least one junction is below 20 psi even with the scaled demands at
// zero.'"). Run with:
//   node dev/lpn-spike/demand-scaling-selected-judged-harness.js
//
// Net3 with its 24-hour EPANET run, the clock at 7:00, a 20 psi limit. Junctions 40, 50 and 20,
// beside the tanks, sit below 20 psi there whatever any demand does; three junctions the time
// step shows above 55 psi are selected. Through the page's own Run and Find:
//   1. Scale 1 reproduces the time step's own pressures at the selected junctions, so the analysis
//      solves the instant the graph shows (patterns, tank levels, link statuses).
//   2. Find is not "below even at zero", and its lowest junction is a selected one.
//   3. Its answer is right by solves of its own: every selected junction holds at m, one fails at
//      m + step.
//   4. Run at scale 1 counts no selected junction below, while its table still lists junction 40.
//   5. All junctions still judges every junction: below even at zero, and it names the junction.
//   6. The answer names its time step.
//
// The defect this catches: the verdict taken over every junction (pressureList() without the
// selection) -- checks 2 and 4 fail on it.
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

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\topenBox: openDemandScaleBox, wireBox: wireDemandScaleBox,\n" +
	"\t\trunScale: runDemandScale, runFind: runDemandScaleSearch,\n" +
	"\t\tsearchRun: function () { return dsSearch; }, scaleRun: function () { return dsRun; },\n" +
	"\t\tsetScope: function (v) { dsAsk.scope = v; }, setMult: function (t) { dsAsk.multiplier = t; },\n" +
	"\t\tsetMin: function (t) { critFireFlowAsk().minPressure = t; },\n" +
	"\t\tsetEngine: function (e) { settings.engine = e; },\n" +
	"\t\tsetSelectionList: setSelectionList,\n" +
	"\t\tcurrentModel: function () { var m = assembleModel(); fireFlowAtFrame(m); return m; },\n" +
	"\t\tsolveOnScreen: function (m) { return Promise.resolve(engineFor(m).solve(m)); },\n" +
	"\t\ttoPsi: function (si) { return toDisplay(si, 'lpn_u_pressure'); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
const EC = global.EngCalcs;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
function kids(n) { return (n && (n.childNodes || n.children)) || []; }
function text(n) {
	if (!n) { return ''; }
	if (n.nodeType === 3 || n._text !== undefined && !kids(n).length) { return String(n.textContent || n._text || ''); }
	const k = kids(n);
	return k.length ? k.map(text).join('') : String(n.textContent || '');
}
function dsHost(which) {
	let found = null;
	(function walk(x) {
		if (!x || found) { return; }
		if (x.getAttribute && x.getAttribute('data-ds') === which) { found = x; return; }
		kids(x).forEach(walk);
	})(byId.lpn_ds_controls);
	return found;
}

(async function () {
	setUnitSet('us');
	L.buildLayers();
	await warmEpanet();
	L.applySaved(L.acceptImportedText(fs.readFileSync(ROOT + 'examples/Net3.lwn', 'utf8')));
	L.buildDom();
	L.applyMethodUI();
	L.setEngine('epanet');
	EC.lpnTimeArrived();
	EC.lpnTimeRunNow();
	const t0 = Date.now();
	while (EC.lpnTimeRunState().frames === 0 && Date.now() - t0 < 120000) { await wait(25); }
	ok('Net3\'s run produced frames', EC.lpnTimeRunState().frames > 1, EC.lpnTimeRunState().frames);
	L.wireBox();
	L.openBox();
	const T = 7 * 3600;
	EC.lpnTimeGoTo(T);
	const f = EC.lpnTimeCurrentFrame();
	const psi = (id) => L.toPsi(f.pressures[id]);
	const model = L.currentModel();
	const js = model.nodes.filter((n) => n.type === 'junction').map((n) => n.id);
	const low = js.filter((id) => psi(id) < 20);
	ok('at 7:00 some junction is below 20 psi (the trap)', low.indexOf('40') >= 0, JSON.stringify(low));
	// Three junctions the time step shows above 55 psi, from the middle of the range rather than
	// the pump's discharge, so the search has a limit to find.
	const above = js.filter((id) => psi(id) > 55).sort((a, b) => psi(a) - psi(b));
	const sel = above.slice(0, 3);
	ok('three selected junctions all above 55 psi at 7:00', sel.length === 3 && sel.every((id) => psi(id) > 55),
		sel.map((id) => id + ' ' + psi(id).toFixed(1)).join(', '));
	L.setSelectionList(sel.map((id) => ({ kind: 'node', id: id })));
	L.setMin('20');
	L.setScope('selected');

	console.log('\n--- 1. Scale 1 is the time step on screen ---');
	L.setMult('1');
	const r1 = await L.runScale();
	const byId1 = {};
	r1.pressures.forEach((x) => { byId1[x.id] = x.pressure; });
	const worst = Math.max.apply(null, sel.map((id) => Math.abs(L.toPsi(byId1[id]) - psi(id))));
	ok('the selected junctions\' pressures at scale 1 match the 7:00 frame', worst < 0.5, worst.toFixed(3) + ' psi');

	console.log('\n--- 4. Run at scale 1 judges the selection, lists everyone ---');
	ok('no selected junction counted below 20 psi', r1.below.length === 0, JSON.stringify(r1.below));
	ok('the table still lists junction 40, below 20 psi', r1.pressures.some((x) => x.id === '40' && L.toPsi(x.pressure) < 20));
	ok('the Run verdict is the passing one', text(dsHost('scale')).indexOf(PC.lpn_ds_scale_ok.split('{m}')[0]) >= 0, text(dsHost('scale')).slice(0, 160));

	console.log('\n--- 2. Find under Selected ---');
	const s = await L.runFind();
	const out = text(dsHost('search'));
	console.log('  ' + out.slice(0, 260));
	ok('not "below even with the scaled demands at zero"', s.outcome !== EC.lpnDemandScaleOutcomes.BELOW_AT_ZERO, s.outcome);
	ok('...and the box does not say it', out.indexOf(PC.lpn_ds_below_zero.split('{pressure}')[0]) < 0);
	const probe = s.failing || s.holding;
	ok('the lowest junction it names is a selected one', !!probe && !!probe.lowest && sel.indexOf(probe.lowest.id) >= 0, probe && JSON.stringify(probe.lowest));
	ok('6. the answer names 7:00', out.indexOf(PC.lpn_ds_at_time.replace('{time}', EC.lpnTimeElapsedText(T))) >= 0);
	ok('it says the selected junctions were scaled and checked', out.indexOf(PC.lpn_ds_scaled_selected.replace('{n}', '3')) >= 0);

	console.log('\n--- 3. The answer, by solves of its own ---');
	const solve = (m) => EC.lpnDemandScaleRun(L.currentModel(), { solve: (x) => L.solveOnScreen(x), multiplier: m, junctions: sel, minPressure: s.minPressure });
	const atM = await solve(s.multiplier);
	const selMin = (run) => Math.min.apply(null, run.pressures.filter((x) => sel.indexOf(x.id) >= 0).map((x) => x.pressure));
	ok('every selected junction holds the limit at ' + s.multiplier, atM.ok && selMin(atM) >= s.minPressure, L.toPsi(selMin(atM)).toFixed(2) + ' psi');
	if (s.outcome === EC.lpnDemandScaleOutcomes.FOUND) {
		const up = await solve(+(s.multiplier + s.step).toFixed(10));
		ok('one does not at one step more', !up.ok || selMin(up) < s.minPressure, up.ok ? L.toPsi(selMin(up)).toFixed(2) + ' psi' : up.code);
	}

	console.log('\n--- 5. All junctions still judges every junction ---');
	L.setScope('all');
	const a = await L.runFind();
	ok('below even at zero, under All', a.outcome === EC.lpnDemandScaleOutcomes.BELOW_AT_ZERO, a.outcome);
	ok('...and it names a junction low at 7:00', !!a.failing && !!a.failing.lowest && low.indexOf(a.failing.lowest.id) >= 0, a.failing && JSON.stringify(a.failing.lowest));
	ok('...in the box', text(dsHost('search')).indexOf(PC.lpn_ds_below_zero.split('{pressure}')[0]) >= 0);

	console.log(fails ? '\n' + fails + ' demand scaling selected-judged check(s) FAILED' : '\nDemand scaling selected-judged harness: all checks passed.');
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });
