// CLEAR OVERRIDE ON A COLUMN OF 1,200 LABELLED PIPES BUILDS THE SEGMENT INDEX A FIXED NUMBER OF
// TIMES, NOT ONCE PER PIPE. Run with:
//   node dev/lpn-spike/clear-override-grid-harness.js
//
// Perry, 2026-10-07, on Tom's slow Clear override: on a 1,201-pipe grid with link labels, clearing
// the Roughness column froze about 2.7 s, because each pipe's label placement (buildLinkEls() and
// layoutLinkLabel()) rebuilt the index of every link's segments. withOneLabelBatch() now holds one
// index across the writes and builds one fresh index for the final placing. Counted, not timed, so
// a loaded machine cannot fail it and a quadratic regression cannot pass it; a generous stopwatch
// rides along. The real-Chromium half is pane-clear-override-speed-browser-harness.js.
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
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tpaneTableById: paneTableById, openPane: openPane, undo: undo,\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\trows: function (id) { return paneTableRowsInOrder(paneTableById(id)); },\n" +
	"\t\tselectRange: function (id, aId, aKey, fId, fKey) { paneTableById(id).sel = { aId: aId, aKey: aKey, fId: fId, fKey: fKey }; },\n" +
	"\t\tclear: function (id) { return paneClearOverrides(paneTableById(id)); },\n" +
	"\t\tsetProp: setProp, createScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\toverrideCount: function () { return overrideCount(activeScenario()); },\n" +
	"\t\tlabelsOn: function () { labelSettings.link.id = true; labelSettings.link.roughness = true; },\n" +
	"\t\tbuildDom: buildDom,\n" +
	"\t\tsegIndexBuilds: function () { return linkSegIndexBuilds; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

// A 25 x 25 grid: 625 junctions, 1,200 pipes, every pipe labelled with its ID and roughness.
const N = 25, ids = [];
for (let i = 0; i < N; i++) {
	ids.push([]);
	for (let j = 0; j < N; j++) { const n = L.addNode('junction', i * 300, j * 300); L.setProp(n, 'elev', 50); L.setProp(n, 'demand', 5); ids[i].push(n.id); }
}
const pipes = [];
for (let i = 0; i < N; i++) {
	for (let j = 0; j < N; j++) {
		if (i + 1 < N) { pipes.push(L.addLink('pipe', ids[i][j], ids[i + 1][j])); }
		if (j + 1 < N) { pipes.push(L.addLink('pipe', ids[i][j], ids[i][j + 1])); }
	}
}
pipes.forEach((p) => { L.setProp(p, 'diameter', 8); L.setProp(p, 'roughness', 130); L.setProp(p, 'k', 0); });
L.labelsOn();
L.buildDom();
report(pipes.length === 1200, 'a grid of 1,200 pipes', String(pipes.length));

L.createScenario('Peak');
pipes.forEach((p) => L.setProp(p, 'roughness', 77));
report(L.overrideCount() >= 1200, 'every pipe holds a roughness override in Peak', String(L.overrideCount()));

L.openPane('pipes');
L.renderTable('pipes');
const rows = L.rows('pipes');
L.selectRange('pipes', rows[0].id, 'roughness', rows[rows.length - 1].id, 'roughness');
const b0 = L.segIndexBuilds(), t0 = Date.now();
const did = L.clear('pipes');
const ms = Date.now() - t0, builds = L.segIndexBuilds() - b0;
report(did && L.overrideCount() === 0, 'Clear override on the whole column clears all 1,200', String(L.overrideCount()));
report(builds <= 4, 'the segment index is built a fixed number of times, not once per pipe', builds + ' builds');
report(ms < 20000, 'and the clear finishes in a sane time', ms + ' ms');
L.undo();
report(L.overrideCount() >= 1200, 'one undo brings all 1,200 back', String(L.overrideCount()));

console.log(failures ? `\n${failures} of ${checks} FAILED` : `\nall pass: ${checks}/${checks}`);
process.exit(failures ? 1 : 0);
