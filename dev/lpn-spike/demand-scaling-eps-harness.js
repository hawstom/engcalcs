// DEMAND SCALING ON AN EXTENDED-PERIOD PROJECT: which time step a result describes (ROADMAP Task
// 754; Perry's pre-review, 2026-10-01: on Net3 a Find made at 0:00 still read 0.51 with the clock
// at 6:00, where the answer there was 3.10). Run with:
//   node dev/lpn-spike/demand-scaling-eps-harness.js
//
// On Net1 with its 24-hour EPANET run, through the page's own Run and Find:
//   1. Each answer names the time step it was computed at.
//   2. Moving the clock does not leave it passing for the new moment: both answers say when they
//      were computed and where the clock is now.
//   3. Find again at the new step names that step, is not marked, and gives that step's answer.
//
// Mutations this must catch: the time line dropped; the clock-move check removed from
// applySolveResult(); the run's time not recorded (it would always match the clock).
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
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\topenBox: openDemandScaleBox, wireBox: wireDemandScaleBox,\n" +
	"\t\trunScale: runDemandScale, runFind: runDemandScaleSearch,\n" +
	"\t\tsearchRun: function () { return dsSearch; }, scaleRun: function () { return dsRun; },\n" +
	"\t\tsetMult: function (t) { dsAsk.multiplier = t; },\n" +
	"\t\tsetMin: function (t) { critFireFlowAsk().minPressure = t; },\n" +
	"\t\tsetEngine: function (e) { settings.engine = e; },\n" +
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
	const saved = L.acceptImportedText(fs.readFileSync(ROOT + 'examples/Net1.lwn', 'utf8'));
	L.applySaved(saved);
	L.buildDom();
	L.applyMethodUI();
	L.setEngine('epanet');
	EC.lpnTimeArrived();
	EC.lpnTimeRunNow();
	const t0 = Date.now();
	while (EC.lpnTimeRunState().frames === 0 && Date.now() - t0 < 90000) { await wait(25); }
	ok('Net1\'s run produced frames', EC.lpnTimeRunState().frames > 1, EC.lpnTimeRunState().frames);
	L.wireBox();
	L.openBox();
	EC.lpnTimeGoTo(0);
	const before = JSON.stringify(L.getDoc());

	console.log('--- 1. Each answer names its time step ---');
	const zero = EC.lpnTimeElapsedText(0), six = EC.lpnTimeElapsedText(6 * 3600);
	L.setMin('100');
	L.setMult('2');
	await L.runScale();
	await L.runFind();
	const at0 = L.searchRun().multiplier;
	ok('the Find answer names 0:00', text(dsHost('search')).indexOf(PC.lpn_analyze_at_time.replace('{time}', zero)) >= 0, text(dsHost('search')).slice(-160));
	ok('the Run answer names 0:00', text(dsHost('scale')).indexOf(PC.lpn_analyze_at_time.replace('{time}', zero)) >= 0);
	ok('neither is marked while the clock is there', text(byId.lpn_ds_controls).indexOf(PC.lpn_analyze_time_moved.split('{time}')[0]) < 0);

	console.log('\n--- 2. The clock moves to 6:00 ---');
	EC.lpnTimeGoTo(6 * 3600);
	const moved = PC.lpn_analyze_time_moved.replace('{time}', zero).replace('{now}', six);
	ok('both answers say they were computed at 0:00 and the clock is at 6:00',
		text(byId.lpn_ds_controls).split(moved).length - 1 === 2, text(dsHost('search')).slice(-200));

	console.log('\n--- 3. Find again at 6:00 ---');
	await L.runFind();
	const at6 = L.searchRun().multiplier;
	ok('it names 6:00', text(dsHost('search')).indexOf(PC.lpn_analyze_at_time.replace('{time}', six)) >= 0);
	ok('the Find answer is no longer marked', text(dsHost('search')).indexOf(PC.lpn_analyze_time_moved.split('{time}')[0]) < 0);
	ok('...while the Run answer, still from 0:00, is', text(dsHost('scale')).indexOf(moved) >= 0);
	ok('6:00 has an answer of its own', at6 !== at0, at0 + ' at 0:00, ' + at6 + ' at 6:00');
	ok('the project is unchanged', JSON.stringify(L.getDoc()) === before);

	console.log(fails ? '\n' + fails + ' demand scaling EPS check(s) FAILED' : '\nDemand scaling EPS harness: all checks passed.');
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });
