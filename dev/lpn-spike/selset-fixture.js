// Shared set-up for the selection-set harnesses (Tom, 2026-09-28, "Preparing to make videos"):
// table-map-select-harness.js and goto-keeps-selection-harness.js. Four junctions in a row, the
// Junctions table rendered, and the Find panel built, all through the page's own code.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { byId, ensure, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

global.navigator.clipboard = { writeText: function () { return { then: function () {} }; } };
global.requestAnimationFrame = global.window.requestAnimationFrame = () => 0;
ensure('lpn_find_form');
ensure('lpn_find_results');
setUnitSet('us');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tpaneTableById: paneTableById, openPane: openPane, spec: paneTableById,\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\tcells: function (id) { return paneTableById(id).cells; },\n" +
	"\t\ttds: function (id) { return paneTableById(id).tds; },\n" +
	"\t\tselectedRefs: selectedRefs, clearSel: clearSelection, setSelectionList: setSelectionList,\n" +
	"\t\ttoggle: toggleInSelection, locatedRef: locatedElementRef,\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tview: function () { return currentView(); }, setView: function (v) { applyView(v); },\n" +
	"\t\tnodeClass: function (id) { return nodeEls[id] ? (nodeEls[id].circle.getAttribute('class') || '') : ''; },\n" +
	"\t\tsetState: function (scope, prop, op, value) {\n" +
	"\t\t\tfindState.scope = scope; findState.prop = prop; findState.op = op;\n" +
	"\t\t\tfindState.value = value === undefined ? '' : value; findNormalize(); },\n" +
	"\t\tbuildPanel: function () { rebuildFindForm(); }, pressFind: function () { runFind(); },\n" +
	"\t\tresultsBox: function () { return document.getElementById('lpn_find_results'); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
L.setCanvas(1000, 600);

const ids = [L.addNode('junction', 0, 0), L.addNode('junction', 100, 0),
	L.addNode('junction', 200, 0), L.addNode('junction', 300, 0)].map((n) => n.id);
L.addLink('pipe', ids[0], ids[1], []);
L.addLink('pipe', ids[1], ids[2], []);
L.addLink('pipe', ids[2], ids[3], []);
L.openPane('junctions');
L.renderTable('junctions');
const tableEl = byId.lpn_pane_junctions.children.filter((c) => c._tag === 'table')[0];

function fire(el, type, ev) {
	((el && el._listeners && el._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}
function td(elId, k) { return L.tds('junctions')[elId][k]; }
function cell(elId, k) { return L.cells('junctions')[elId][k]; }
function tr(elId) { return td(elId, 'id').parentNode; }
function rowBar(elId) { return !!(tr(elId) && tr(elId).classList.contains('lpn-mapsel')); }
function click(elId, k, opts) {
	opts = opts || {};
	fire(tableEl, 'mousedown', { target: td(elId, k), button: opts.button || 0, shiftKey: !!opts.shift,
		preventDefault: function () {} });
	fire(tableEl, 'focusin', { target: td(elId, k) });
	global.document.activeElement = cell(elId, k);
	fire(tableEl, 'mouseup', {});
}
function menuEl() {
	return global.document.body.children.filter((c) => c['class'] === 'lpn-pane-ctxmenu').slice(-1)[0];
}
function rightClick(elId, k) {
	click(elId, k, { button: 2 });
	fire(tableEl, 'contextmenu', { target: td(elId, k), button: 2, clientX: 10, clientY: 20, preventDefault: function () {} });
	return menuEl();
}
function menuLabels(m) {
	return ((m && m.children) || []).map((b) => { const f = b.children && b.children[0]; return f && f.textContent !== undefined ? f.textContent : b.textContent; });
}
function menuItem(m, text) { return ((m && m.children) || []).filter((b, i) => menuLabels(m)[i] === text)[0]; }
function pin(elId) {
	return (td(elId, 'id').children || []).filter((c) => String(c['class'] || c.className || '').indexOf('lpn-pane-goto') >= 0)[0];
}
function findRows() {
	const out = [];
	(function walk(e) { (e.children || []).forEach((k) => { if (k._lpnFindRef) { out.push(k); } walk(k); }); })(L.resultsBox());
	return out;
}
let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function done(title) {
	if (fails) { console.log('\n' + fails + ' of ' + checks + ' ' + title + ' check(s) FAILED'); process.exit(1); }
	console.log('\n' + title + ': all ' + checks + ' checks passed.');
	// A solve the edits scheduled would otherwise fire into the stub after the last check.
	process.exit(0);
}
const refs = (list) => JSON.stringify(list.map((id) => ({ kind: 'node', id: id })));

module.exports = { L, ids, byId, tableEl, fire, td, cell, tr, rowBar, click, menuEl, rightClick, menuLabels,
	menuItem, pin, findRows, ok, done, refs, PC: global.EngCalcs.pageConfig };
