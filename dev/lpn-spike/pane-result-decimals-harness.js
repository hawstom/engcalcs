// **RESULT CELLS PRINT THE LABEL'S DECIMALS; THE VERTICES COLUMN IS SIZED BY ITS HEADING**
// (Tom, 2026-10-16: *"the Pipes table Vertices column should always be sized based on the heading
// rule ignoring the contents"* and *"all other applicable results in all tables should respect the
// Settings, Pipe labels decimals setting even when the result is zero"*). Run with:
//   node dev/lpn-spike/pane-result-decimals-harness.js
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
	"\t\tpaneTableById: paneTableById,\n" +
	"\t\theadings: function (id) { return paneCols(paneTableById(id)).map(function (c) { return c.key; }); },\n" +
	"\t\tpasteAppend: function (id, text) { var s = paneTableById(id); renderPaneTable(s);\n" +
	"\t\t\treturn panePasteAt(s, libPasteCells(text), { append: true }); },\n" +
	"\t\twidthEm: function (id, key) { var s = paneTableById(id); s.initEmCache = null; return paneColWidthEm(s, paneColByKey(s, key)); },\n" +
	"\t\tresultText: function (group, key, v) { var c = group === 'link' ? paneColLinkResult(key, 'x', null) : paneColNodeResult(key, 'x', null);\n" +
	"\t\t\tc.get = function () { return v; }; return paneCellText(c, {}); },\n" +
	"\t\tsetDec: function (group, key, d) { labelSettings.decimals[group][key] = d; },\n" +
	"\t\tgetDec: function (group, key) { return labelSettings.decimals[group][key]; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

console.log('\n--- 1. a zero result keeps its decimals ---');
{
	const dv = L.getDec('link', 'velocity');
	report(typeof dv === 'number' && dv > 0, 'sanity: Pipe labels velocity has a decimals count', dv);
	report(L.resultText('link', 'velocity', 0) === (0).toFixed(dv), 'a zero velocity prints ' + (0).toFixed(dv), L.resultText('link', 'velocity', 0));
	L.setDec('link', 'velocity', 3);
	report(L.resultText('link', 'velocity', 0) === '0.000', 'Decimals 3 prints 0.000', L.resultText('link', 'velocity', 0));
	report(L.resultText('link', 'velocity', 2.5) === '2.500', 'and 2.5 as 2.500', L.resultText('link', 'velocity', 2.5));
	report(L.resultText('link', 'velocity', -0.0001) === '0.000', 'a tiny negative never prints -0.000', L.resultText('link', 'velocity', -0.0001));
	L.setDec('link', 'headloss', 2); L.setDec('link', 'gradient', 4); L.setDec('node', 'pressure', 1);
	report(L.resultText('link', 'headloss', 0) === '0.00', 'head loss 0 at 2 places', L.resultText('link', 'headloss', 0));
	report(L.resultText('link', 'gradient', 0) === '0.0000', 'gradient 0 at 4 places', L.resultText('link', 'gradient', 0));
	report(L.resultText('node', 'pressure', 0) === '0.0', 'a junction result reads Junction labels: pressure 0 at 1 place', L.resultText('node', 'pressure', 0));
	report(L.resultText('node', 'depth', 1.234567) === '1.23', 'a result with no label row keeps two-place rounding', L.resultText('node', 'depth', 1.234567));
}

console.log('\n--- 2. the Vertices column ignores its contents ---');
{
	report(L.headings('pipes').indexOf('verts') >= 0, 'sanity: the Pipes table has a Vertices column');
	const empty = L.widthEm('pipes', 'verts');
	const keys = L.headings('pipes');
	L.pasteAppend('junctions', 'J1\t0\t0\nJ2\t1000\t0');
	const row = keys.map((k) => ({ id: 'P1', from: 'J1', to: 'J2',
		verts: '100.123/5.456|200.123/6.456|300.123/7.456|400.123/8.456|500.123/9.456' })[k] || '').join('\t');
	L.pasteAppend('pipes', row);
	const full = L.widthEm('pipes', 'verts');
	report(empty > 0 && Math.abs(full - empty) < 0.01, 'a pipe with five vertices does not widen the column', empty + ' vs ' + full);
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
