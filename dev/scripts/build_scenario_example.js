// Builds dev/water-network-examples/Net1-Scenarios.lwn from Net1.lwn by driving the page's own
// scenario code (createScenario, createAlternative, assignAlternative, setProp) and writing the
// file with the page's own serializer. Never hand-edit the result's scenario blocks.
//
//   node dev/scripts/build_scenario_example.js
//
// Tree (demands in gpm, US units):
//   Base                                   average day, Net1's own demands
//   |- Max day                             demand multiplier 1.5 (one override)
//   |  `- Max day with main break          Active topology alternative "Main break, pipe 112 closed" (shared)
//   `- Peak hour                           demand multiplier 2.25 (one override)
//      `- Peak hour with main break        the same shared alternative
'use strict';
const path = require('path');
const fs = require('fs');
const H = path.join(__dirname, '..', 'lpn-spike');
const { ROOT, setUnitSet, loadLoopedNetwork } = require(H + '/lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require(H + '/example-fixture.js');
global.confirm = global.window.confirm = function () { return true; };
global.alert = global.window.alert = function () {};
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
if (!global.EngCalcs.lpnGeorefToLonLat) { require(ROOT + 'js/lpn-georef.js'); }
const L = loadLoopedNetwork(EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; }, getScenarios: function () { return scenarios; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, projectFileText: projectFileText, getProject: function () { return project; },\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, createAlternative: createAlternative,\n" +
	"\t\tassignAlternative: assignAlternative, calcWriteTargetOf: calcWriteTargetOf, heldCalcOption: heldCalcOption, setProp: setProp, effective: effective,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas'); world = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world); linksLayer = el('g', {}, world);\n" +
	"\t\t\tnodesLayer = el('g', {}, world); labelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n");
setUnitSet('us');
L.buildLayers(); L.setCanvas(1000, 700); L.seedDefaultInputs();
const src = path.join(ROOT, 'dev/water-network-examples/Net1.lwn');
const saved = L.acceptImportedText(fs.readFileSync(src, 'utf8'));
if (!saved) { throw new Error('Net1.lwn did not open'); }
L.applySaved(saved); L.buildDom(); L.applyMethodUI();
const doc = L.getDoc();
const node = (id) => doc.nodes.filter((n) => n.id === id)[0];
const link = (id) => doc.links.filter((l) => l.id === id)[0];

L.getProject().name = 'Net1 with scenarios';
const base = L.getScenarios()[0];
// Stored alternatives are created first, then named by a scenario; edits made in that scenario
// land in the stored record (writeTargetFor), which is what lets a second scenario share it.
// Max day and Peak hour are ONE override each: the scenario's demand multiplier (Settings, Demand
// multiplier), which the page stores in the scenario's Calculation alternative. No junction demand
// is overridden anywhere. Fire flow is not a scenario here: Water, Analyze, Fire flow analysis adds
// it, unmultiplied, on top of the open scenario's demands.
const breakAlt = L.createAlternative('topology', 'Main break, pipe 112 closed', null);
const setMult = (scn, v) => { L.switchScenario(scn.id); L.calcWriteTargetOf(scn).demandMultiplier = v; };

const md = L.createScenario('Max day', base.id);
setMult(md, 1.5);
const mdBreak = L.createScenario('Max day with main break', md.id);
L.assignAlternative(mdBreak.id, 'topology', breakAlt.id);
L.switchScenario(mdBreak.id); L.setProp(link('112'), 'active', false);

const peak = L.createScenario('Peak hour', base.id);
setMult(peak, 2.25);
const peakBreak = L.createScenario('Peak hour with main break', peak.id);
L.assignAlternative(peakBreak.id, 'topology', breakAlt.id);

L.switchScenario(base.id);
// The stub has no real canvas, so the view it writes is the stub's; Net1's own framing is right.
const doc2 = JSON.parse(L.projectFileText());
const orig = JSON.parse(fs.readFileSync(src, 'utf8'));
doc2.view = orig.view;
// Likewise the stub's label settings are every default spelled out; Net1 states only what it chose.
doc2.labelSettings = orig.labelSettings;
const out = JSON.stringify(doc2, null, '\t');
fs.writeFileSync(process.argv[2] || path.join(ROOT, 'dev/water-network-examples/Net1-Scenarios.lwn'), out + (out.slice(-1) === '\n' ? '' : '\n'));
console.log('written', out.length, 'bytes');
