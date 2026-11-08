// "CLEAR RESTORES" SHOWS THE VALUE AS THE PERSON SEES IT. Perry's real-Chrome pass, 2026-11-06: the line
// under an overridden emitter coefficient read "Clear restores 0.083572 gpm/psi" while the parent held
// 1111 gpm/psi -- the stored SI number with the displayed unit's name. Run:
//   node dev/lpn-spike/clear-restores-unit-harness.js
//
// Asserted: in US units, an emitter coefficient's line quotes the displayed-unit number; a diameter
// (stored as typed) is unchanged.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}

setUnitSet('us');

const L = loadLoopedNetwork(
	"\t\taddNode: addNode, addLink: addLink, setProp: setProp, emitterToStore: emitterToStore,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, baseId: function () { return baseScenario().id; },\n" +
	"\t\tmarker: function (fields, e, p) { overrideMarker(fields, e, p); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

const a = L.addNode('junction', 0, 0), b = L.addNode('junction', 10, 0), pipe = L.addLink('pipe', a.id, b.id, []);
const Q = L.createScenario('Q', L.baseId());
L.setProp(a, 'emitter', L.emitterToStore(1111));
L.setProp(pipe, 'diameter', 8);
L.createScenario('Q1', Q.id);
L.setProp(a, 'emitter', L.emitterToStore(2000));
L.setProp(pipe, 'diameter', 12);

function walk(n, out) { (n.children || []).forEach((c) => { out.push(c); walk(c, out); }); return out; }
function lineFor(e, p, labelText) {
	const f = global.document.createElement('div'), lab = global.document.createElement('label');
	lab.textContent = labelText;
	f.appendChild(lab);
	L.marker(f, e, p);
	return walk(f, []).filter((c) => String(c.className).indexOf('lpn-ov-base') >= 0 && String(c.className).indexOf('shared') < 0).map((c) => c.textContent).join('');
}
const emLine = lineFor(a, 'emitter', 'Emitter coefficient (gpm/psi)');
report(/1111 gpm\/psi/.test(emLine) && !/0\.0\d/.test(emLine), 'emitter: Clear restores the displayed-unit number', emLine);
const dLine = lineFor(pipe, 'diameter', 'Diameter (in)');
report(/8 in/.test(dLine), 'diameter: unchanged, as typed', dLine);

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
