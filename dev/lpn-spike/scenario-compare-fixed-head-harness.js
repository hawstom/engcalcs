// Scenario comparison "Lowest pressure" judges junctions only: a reservoir or tank is a fixed
// head, and its zero "pressure" must never be the lowest. Run with:
//   node dev/lpn-spike/scenario-compare-fixed-head-harness.js
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
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\textremes: scenarioCompareExtremes, compare: runScenarioCompare,\n" +
	"\t\trun: function () { return scenarioCompareRun; },\n" +
	"\t\tsetEngine: function (e) { settings.engine = e; },\n" +
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

(async function () {
	setUnitSet('us');
	L.buildLayers();
	await warmEpanet();
	L.applySaved(L.acceptImportedText(fs.readFileSync(ROOT + 'examples/Net1.lwn', 'utf8')));
	L.buildDom();
	L.applyMethodUI();
	L.setEngine('epanet');
	const doc = L.getDoc();
	const fixed = {};
	doc.nodes.forEach(function (n) { if (n.type !== 'junction') { fixed[n.id] = n.type; } });
	ok('Net1 has a reservoir and a tank', Object.keys(fixed).length >= 2, JSON.stringify(fixed));
	// Synthetic result: fixed heads at 0 pressure, junctions positive.
	const pressures = {};
	doc.nodes.forEach(function (n) { pressures[n.id] = fixed[n.id] ? 0 : 50 + Number(n.id) || 50; });
	const e = L.extremes({ nodes: doc.nodes, links: [] }, { pressures: pressures });
	ok('lowest pressure is not at a fixed head', !fixed[e.minAt], e.minAt);
	ok('...and is a positive junction pressure', e.minPressure > 0, e.minPressure);
	const rows = await L.compare();
	ok('real Net1 run: row solved', rows.length > 0 && rows[0].ok, JSON.stringify(rows[0] && rows[0].why));
	ok('real Net1 run: lowest pressure is a junction, not 9',
		rows[0].ok && !fixed[rows[0].minAt] && rows[0].minAt !== '9' && rows[0].minPressure > 0,
		rows[0].minAt + ' ' + rows[0].minPressure);
	console.log(fails ? '\nFAIL' : '\nscenario-compare-fixed-head: ALL PASS');
	process.exit(fails ? 1 : 0);
})();
