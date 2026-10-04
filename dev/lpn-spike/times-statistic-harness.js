// [TIMES] STATISTIC IS CARRIED, ROUND-TRIPPED AND OFFERED AS A VIEW (ROADMAP Task 735). Run with:
//   node dev/lpn-spike/times-statistic-harness.js
//
//   1. Net1 with each of Statistic None / Averaged / Minimum / Maximum / Range, and a prefix spelling,
//      is imported, saved, reopened and exported; the Statistic line comes back as the file's own word.
//   2. A file with no Statistic line exports none (the sparseness rule).
//   3. The statistic computed over a hand-built run matches hand arithmetic for each of the four.
//   4. NONE and an unknown name give no statistic frame.
// Mutations this must catch: the importer dropping the word (1); the exporter writing a line for an
// absent value (2); AVERAGED weighting by anything but equal periods, RANGE not max-min (3).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');

const L = loadLoopedNetwork(
	"\t\tserializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections, seedDefaultInputs: seedDefaultInputs,\n" +
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
setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

const NET1 = fs.readFileSync(ROOT + 'dev/lpn-spike/reference/Net1.inp', 'utf8');
function statLine(text) {
	const m = /^\s*Statistic\s+(\S+)/mi.exec(text.split(/\[TIMES\]/i)[1] || '');
	return m ? m[1] : null;
}
function roundTrip(src) {
	const parsed = EC.lpnInpParse(src);
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	const d1 = L.docFromInp(parsed, 'x.inp');
	// Through a saved project and back, as a reopened file goes.
	const saved = JSON.parse(JSON.stringify(d1));
	return EC.lpnExportInp(saved);
}

console.log('1. each value comes back as the file wrote it');
['None', 'Averaged', 'Minimum', 'Maximum', 'Range', 'AVERAGED', 'Avg'].forEach(function (w) {
	const src = NET1.replace(/^(\s*Statistic\s+)\S+/mi, '$1' + w);
	const out = roundTrip(src);
	const got = out.ok ? statLine(out.inp) : 'REFUSED';
	// 'Avg' is not a keyword prefix: carried verbatim.
	ok('Statistic ' + w, got === w, 'got ' + got);
});

console.log('2. no line in, no line out');
const bare = NET1.replace(/^\s*Statistic.*\n/mi, '');
ok('source really has none', statLine(bare) === null);
const o2 = roundTrip(bare);
ok('export writes none', o2.ok && statLine(o2.inp) === null);

console.log('3. the statistic over a hand-built run');
// Three reporting steps; node A heads 10, 20, 60; link P flows -2, 4, 4; levels absent.
function fr(t, h, q) { return { t: t, heads: { A: h }, flows: { P: q }, pressures: {}, statuses: { P: 'open' } }; }
const run = { engineVersion: 'x', frames: [fr(0, 10, -2), fr(3600, 20, 4), fr(7200, 60, 4)] };
const exp = { AVERAGED: [30, 2], MINIMUM: [10, -2], MAXIMUM: [60, 4], RANGE: [50, 6] };
Object.keys(exp).forEach(function (k) {
	const s = EC.lpnTimeStatisticFrame(run, k);
	ok(k + ' head', s && Math.abs(s.heads.A - exp[k][0]) < 1e-9, s && s.heads.A);
	ok(k + ' flow', s && Math.abs(s.flows.P - exp[k][1]) < 1e-9, s && s.flows.P);
	ok(k + ' carries statistic name and last status', s && s.statistic === k && s.statuses.P === 'open');
});

console.log('4. nothing to show');
ok('NONE gives no frame', EC.lpnTimeStatisticFrame(run, 'NONE') === null);
ok('unknown gives no frame', EC.lpnTimeStatisticFrame(run, 'MEDIAN') === null);
ok('no run gives no frame', EC.lpnTimeStatisticFrame(null, 'RANGE') === null);

console.log(fails ? '\nFAIL: ' + fails : '\nall times-statistic checks passed');
process.exit(fails ? 1 : 0);
