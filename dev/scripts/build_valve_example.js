// Builds dev/water-network-examples/Valves.lwn: a small US-unit network in which every valve type
// is ACTIVE at the solved state. The .inp text below is imported through the page's own importer
// (lpnInpParse, docFromInp) and the file is written by the page's own serializer; the .lwn format
// is never written by hand.
//
//   node dev/scripts/build_valve_example.js
//
// The story, top to bottom (gpm, psi, ft):
//   R1 hilltop reservoir, head 810 ft -> J1 -> PBV1 breaks 60 psi on the steep line -> J2 -> J3 hub.
//   From the hub: PRV1 to a low zone (45 psi), PSV1 to a storage tank (hub held at 55 psi),
//   FCV1 to a customer pond (300 gpm), TCV1 throttling a branch, GPV1 a strainer with a Library curve.
'use strict';
const path = require('path');
const fs = require('fs');
const H = path.join(__dirname, '..', 'lpn-spike');
const { ROOT, setUnitSet, loadLoopedNetwork } = require(H + '/lpn-dom-stub.js');
global.confirm = global.window.confirm = function () { return true; };
global.alert = global.window.alert = function () {};
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
if (!global.EngCalcs.lpnGeorefToLonLat) { require(ROOT + 'js/lpn-georef.js'); }

const INP = fs.readFileSync(path.join(__dirname, 'valve_example.inp'), 'utf8');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections, applyUnitSelections: applyUnitSelections,\n" +
	"\t\tapplySaved: applySaved, buildDom: buildDom, applyMethodUI: applyMethodUI, projectFileText: projectFileText,\n" +
	"\t\tgetProject: function () { return project; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas'); world = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world); linksLayer = el('g', {}, world);\n" +
	"\t\t\tnodesLayer = el('g', {}, world); labelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n");
setUnitSet('us');
L.buildLayers(); L.setCanvas(1000, 700); L.seedDefaultInputs();
const parsed = global.EngCalcs.lpnInpParse(INP);
if (!parsed.ok) { throw new Error('inp: ' + parsed.error); }
L.applyUnitSelections(L.inpUnitSelections(parsed));
const doc = L.docFromInp(parsed, 'Valves');
L.applySaved(doc); L.buildDom(); L.applyMethodUI();
L.getProject().name = 'Valves';
// The stub has no real canvas and spells every label default out; state what this example chose
// (as Net1 does) and frame the drawing by hand: it spans x 0..620, y 70..330 in feet.
const f = JSON.parse(L.projectFileText());
f.view = { cx: 310, cy: 200, s: 1.3 };
f.settings.textSize = 12; f.settings.symbolSize = 12; f.settings.linkWidth = 4;   // every example opens at 12, 12, 4
f.labelSettings = {
	node: { id: true, elev: true, demand: true, head: false, pressure: true },
	link: { id: true, diameter: false, length: false, roughness: false, km: false, flow: true, velocity: true, headloss: false, gradient: false },
	prefix: { node: { id: '' }, link: { id: '' } }, separator: ' ', markExtrema: true
};
const out = JSON.stringify(f, null, '\t');
const dest = process.argv[2] || path.join(ROOT, 'dev/water-network-examples/Valves.lwn');
fs.writeFileSync(dest, out + (out.slice(-1) === '\n' ? '' : '\n'));
console.log('written', out.length, 'bytes;', JSON.stringify(parsed.dropped.map((d) => d.code)));
