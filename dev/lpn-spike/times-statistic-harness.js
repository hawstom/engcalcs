// [TIMES] STATISTIC IS CARRIED, ROUND-TRIPPED AND OFFERED AS A VIEW (ROADMAP Task 735). Run with:
//   node dev/lpn-spike/times-statistic-harness.js
//
//   1. Net1 with each of Statistic None / Averaged / Minimum / Maximum / Range, and a prefix spelling,
//      is imported, saved, reopened and exported; the Statistic line comes back as the file's own word.
//   2. A file with no Statistic line exports none (the sparseness rule).
//   3. The statistic computed over a hand-built run matches hand arithmetic for each of the four.
//   4. NONE and an unknown name give no statistic frame.
//   5. Net1 run through the vendored EPANET engine matches EPANET's own Statistic report (node 10
//      pressure, link 110 flow which reverses and so is absolute, pump 9 headloss which stays signed).
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
// Three reporting steps; node A heads 10, 20, 60; link P (reverses) flows -2, 4, 4; pump H headloss -5, -7, -9 stays signed; levels absent.
function fr(t, h, q, hl) { return { t: t, heads: { A: h }, flows: { P: q }, headlosses: { H: hl }, pressures: {}, statuses: { P: 'open' } }; }
const run = { engineVersion: 'x', frames: [fr(0, 10, -2, -5), fr(3600, 20, 4, -7), fr(7200, 60, 4, -9)] };
// Link flow is statisticed on |Q| (EPANET), so the reversing -2 counts as 2.
const exp = { AVERAGED: [30, 10 / 3], MINIMUM: [10, 2], MAXIMUM: [60, 4], RANGE: [50, 2] };
Object.keys(exp).forEach(function (k) {
	const s = EC.lpnTimeStatisticFrame(run, k);
	ok(k + ' head', s && Math.abs(s.heads.A - exp[k][0]) < 1e-9, s && s.heads.A);
	ok(k + ' flow', s && Math.abs(s.flows.P - exp[k][1]) < 1e-9, s && s.flows.P);
	ok(k + ' pump headloss stays signed', s && Math.abs(s.headlosses.H - { AVERAGED: -7, MINIMUM: -9, MAXIMUM: -5, RANGE: 4 }[k]) < 1e-9, s && s.headlosses.H);
	ok(k + ' carries statistic name and last status', s && s.statistic === k && s.statuses.P === 'open');
});

console.log('4. nothing to show');
ok('NONE gives no frame', EC.lpnTimeStatisticFrame(run, 'NONE') === null);
ok('unknown gives no frame', EC.lpnTimeStatisticFrame(run, 'MEDIAN') === null);
ok('no run gives no frame', EC.lpnTimeStatisticFrame(null, 'RANGE') === null);

console.log('5. Net1 through the vendored EPANET engine, against EPANET\'s own report');
// Values printed by EPANET 2.3 itself for Net1 with `Statistic <X>` (its AVERAGE/MINIMUM/MAXIMUM/
// RANGE Results blocks): node 10 pressure psi, link 110 flow gpm, pump 9 headloss ft.
const REPORT = {
	AVERAGED: { p10: 123.60, q110: 575.06, h9: -126.05 },
	MINIMUM: { p10: 108.90, q110: 51.87 },
	MAXIMUM: { p10: 133.89 },
	RANGE: { p10: 24.98, q110: 1048.13 }
};
require(ROOT + 'js/lpn-solver.js');
require('./bootstrap.js');
EC.lpnEpanetLoad && require(ROOT + 'js/lpn-epanet.js');
EC.lpnEpanetLoad('file://' + ROOT + 'js/vendor/epanet-js.js').then(async function (mod) {
	const ws = new mod.Workspace(); await ws.loadModule();
	ws.writeFile('a.inp', NET1.replace(/^(\s*Statistic\s+)\S+/mi, '$1None'));
	const p = new mod.Project(ws);
	p.open('a.inp', 'a.rpt', 'a.out');
	const n10 = p.getNodeIndex('10'), l110 = p.getLinkIndex('110'), l9 = p.getLinkIndex('9');
	const frames = [];
	p.openH(); p.initH(0);
	let t, step;
	do {
		t = p.runH();
		if (t % 3600 === 0) {
			frames.push({ t: t, pressures: { '10': p.getNodeValue(n10, 11) },
				flows: { '110': p.getLinkValue(l110, 8), '9': p.getLinkValue(l9, 8) },
				headlosses: { '9': p.getLinkValue(l9, 10) } });
		}
		step = p.nextH();
	} while (step > 0);
	p.closeH(); p.close();
	ok('the engine gave 25 hourly frames', frames.length === 25, frames.length);
	const r = { engineVersion: 'x', frames: frames };
	Object.keys(REPORT).forEach(function (k) {
		const s = EC.lpnTimeStatisticFrame(r, k), e = REPORT[k];
		if (e.p10 !== undefined) { ok(k + ' node 10 pressure ' + e.p10, Math.abs(s.pressures['10'] - e.p10) < 0.01, s.pressures['10'].toFixed(2)); }
		if (e.q110 !== undefined) { ok(k + ' link 110 flow ' + e.q110, Math.abs(s.flows['110'] - e.q110) < 0.01, s.flows['110'].toFixed(2)); }
		if (e.h9 !== undefined) { ok(k + ' pump 9 headloss ' + e.h9, Math.abs(s.headlosses['9'] - e.h9) < 0.02, s.headlosses['9'].toFixed(2)); }
	});
	console.log(fails ? '\nFAIL: ' + fails : '\nall times-statistic checks passed');
	process.exit(fails ? 1 : 0);
}).catch(function (e) { console.error(e); process.exit(1); });
