// CLEAR OVERRIDE ON THE TABLES' RIGHT-CLICK MENU (Tom, 2026-10-06: "Would it be good UI design to
// add a 'Clear override' item to the right-click menu in Tables? I think I would love that."). Run:
//   node dev/lpn-spike/pane-clear-override-harness.js
//
// Asserted: 1. one cell in Show scenarios mode clears its row's scenario's override and the cell
// reads the inherited Base value again; Base and the other scenarios are untouched. 2. One undo
// step restores it. 3. A multi-cell selection clears every override in it and leaves the cells
// that hold none. 4. The item is greyed on a cell with no override and in a Base row, never hidden.
// 5. In the ordinary table while a non-Base scenario is open it works the same way. 6. In Base,
// with scenarios existing, it is greyed.
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
	"\t\ttext: function (id, row, key) { var s = paneTableById(id); return paneCellText(paneColByKey(s, key), row); },\n" +
	"\t\tselectRange: function (id, aId, aKey, fId, fKey) { paneTableById(id).sel = { aId: aId, aKey: aKey, fId: fId, fKey: fKey }; },\n" +
	"\t\ttd: function (id, rowId, key) { var s = paneTableById(id); return s.tds[rowId] && s.tds[rowId][key]; },\n" +
	"\t\tsetProp: setProp, baseValue: baseValue,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tbaseId: function () { return baseScenario().id; },\n" +
	"\t\toverrides: function (scnId) { return scenarioById(scnId).overrides; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

function fire(el, type, ev) {
	((el && el._listeners && el._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}
function tableEl(id) { return global.document.getElementById('lpn_pane_' + id).children.filter((c) => c._tag === 'table')[0]; }
function menuEl() { return global.document.body.children.filter((c) => c['class'] === 'lpn-pane-ctxmenu').slice(-1)[0]; }
function openMenu(id, rowId, key) {
	L.selectRange(id, rowId, key, rowId, key);
	return openMenuKeepSel(id, rowId, key);
}
function openMenuKeepSel(id, rowId, key) {
	fire(tableEl(id), 'contextmenu', { target: L.td(id, rowId, key), clientX: 10, clientY: 20, preventDefault: function () {} });
	return menuEl();
}
const PC = () => global.EngCalcs.pageConfig;
function item(menu) { return menu ? menu.children.filter((b) => b.textContent.indexOf(PC().lpn_pane_clear_override) >= 0)[0] : null; }
const SEP = String.fromCharCode(1);
const snap = (o) => JSON.stringify(o);

const J = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0), L.addNode('junction', 20, 0)];
J.forEach((n, i) => { L.setProp(n, 'elev', 100); L.setProp(n, 'demand', 10 * (i + 1)); });
const peak = L.createScenario('Peak Hour');
L.setProp(J[1], 'demand', 99);
L.setProp(J[2], 'demand', 88);
L.setProp(J[1], 'fireFlow', 1500);
const fire1 = L.createScenario('Fire');
L.setProp(J[0], 'fireFlow', 1200);
L.switchScenario(L.baseId());
L.openPane('junctions');
L.renderTable('junctions');

const baseSnap = snap(J.map((n) => [n.id, L.baseValue(n, 'demand'), L.baseValue(n, 'elev')]));
const fireSnap = snap(L.overrides(fire1.id));
function show() {
	const menu = openMenu('junctions', J[0].id, 'demand');
	fire(menu.children.filter((b) => b.textContent.indexOf(PC().lpn_pane_scn_show) >= 0)[0], 'click', {});
}
function has(scnId, n, p) { const o = L.overrides(scnId)[ovKeyOf(scnId, n)] || {}; return Object.prototype.hasOwnProperty.call(o, p); }
function ovKeyOf(scnId, n) { return Object.keys(L.overrides(scnId)).filter((k) => k.split(/[^A-Za-z0-9_]/).indexOf(String(n.id)) >= 0)[0]; }

console.log('\n--- 6. in Base, with scenarios existing, the item is greyed, not hidden ---');
{
	const m = openMenu('junctions', J[1].id, 'demand');
	report(!!item(m) && item(m).disabled === true, 'present and disabled on a Base table cell');
}

show();
console.log('\n--- 4. greyed on a cell with no override, and in a Base row ---');
{
	let m = openMenu('junctions', J[0].id + SEP + L.baseId(), 'demand');
	report(!!item(m) && item(m).disabled === true, 'a Base row cell: disabled');
	m = openMenu('junctions', J[0].id + SEP + peak.id, 'demand');
	report(!!item(m) && item(m).disabled === true, 'an inherited cell (J1 Peak Hour demand): disabled');
}

console.log('\n--- 1. one cell: the override goes, the inherited Base value shows ---');
{
	const key = J[1].id + SEP + peak.id;
	const m = openMenu('junctions', key, 'demand');
	report(!!item(m) && item(m).disabled === false, 'enabled on J2\'s Peak Hour demand, which holds an override');
	report(L.text('junctions', L.rows('junctions').filter((r) => r.id === key)[0], 'demand') === '99', 'it reads 99 before');
	fire(item(m), 'click', {});
	report(!has(peak.id, J[1], 'demand') && !has(peak.id, J[1], 'demands'), 'the Peak Hour override is gone');
	report(has(peak.id, J[1], 'fireFlow'), 'J2\'s other override in Peak Hour (fire flow) stays');
	report(L.text('junctions', L.rows('junctions').filter((r) => r.id === key)[0], 'demand') === '20',
		'the cell reads Base\'s 20', L.text('junctions', L.rows('junctions').filter((r) => r.id === key)[0], 'demand'));
	report(has(peak.id, J[2], 'demand'), 'J3\'s Peak Hour override is untouched');
	report(snap(L.overrides(fire1.id)) === fireSnap, 'the Fire scenario is untouched');
	report(snap(J.map((n) => [n.id, L.baseValue(n, 'demand'), L.baseValue(n, 'elev')])) === baseSnap, 'BASE IS UNTOUCHED');
}

console.log('\n--- 2. one undo step restores it ---');
{
	L.undo();
	report(has(peak.id, J[1], 'demand') && L.overrides(peak.id)[ovKeyOf(peak.id, J[1])].demand === 99, 'one undo puts the override back, value 99');
	report(snap(L.overrides(fire1.id)) === fireSnap, '...and nothing else moved');
}

console.log('\n--- 3. a multi-cell selection clears every override in it ---');
{
	L.renderTable('junctions');
	// J2 and J3 Peak Hour rows are not adjacent in the natural order (J2/Peak, J3/Base, J3/Fire, J3/Peak),
	// so select the whole block from J2 Peak Hour to J3 Peak Hour across demand and fire flow.
	L.selectRange('junctions', J[1].id + SEP + peak.id, 'demand', J[2].id + SEP + peak.id, 'fireFlow');
	const m = openMenuKeepSel('junctions', J[1].id + SEP + peak.id, 'demand');
	report(!!item(m) && item(m).disabled === false, 'enabled on the range');
	fire(item(m), 'click', {});
	report(!has(peak.id, J[1], 'demand') && !has(peak.id, J[1], 'fireFlow') && !has(peak.id, J[2], 'demand'),
		'J2\'s demand and fire flow and J3\'s demand overrides in Peak Hour are all cleared');
	report(has(fire1.id, J[0], 'fireFlow') && snap(L.overrides(fire1.id)) === fireSnap, 'Fire is untouched');
	report(snap(J.map((n) => [n.id, L.baseValue(n, 'demand'), L.baseValue(n, 'elev')])) === baseSnap, 'Base is untouched');
	L.undo();
	report(has(peak.id, J[1], 'demand') && has(peak.id, J[1], 'fireFlow') && has(peak.id, J[2], 'demand'), 'ONE undo restores them all');
}

console.log('\n--- 5. the ordinary table, while a non-Base scenario is open ---');
{
	// leave Show scenarios
	let m = openMenu('junctions', J[0].id + SEP + L.baseId(), 'demand');
	fire(m.children.filter((b) => b.textContent.indexOf(PC().lpn_pane_scn_show) >= 0)[0], 'click', {});
	L.switchScenario(peak.id);
	L.renderTable('junctions');
	m = openMenu('junctions', J[2].id, 'demand');
	report(!!item(m) && item(m).disabled === false, 'enabled on J3 demand in Peak Hour');
	fire(item(m), 'click', {});
	report(!has(peak.id, J[2], 'demand') && has(peak.id, J[1], 'demand'), 'J3\'s override is cleared and J2\'s is not');
	report(L.text('junctions', L.rows('junctions').filter((r) => r.id === J[2].id)[0], 'demand') === '30', 'J3 demand reads Base\'s 30');
	m = openMenu('junctions', J[0].id, 'demand');
	report(!!item(m) && item(m).disabled === true, 'disabled on an inherited cell');
	L.undo();
	report(has(peak.id, J[2], 'demand'), 'undo restores it');
	L.switchScenario(L.baseId());
	L.renderTable('junctions');
	m = openMenu('junctions', J[1].id, 'demand');
	report(!!item(m) && item(m).disabled === true, 'disabled in Base');
}

console.log(`\n${failures ? 'FAILURES' : 'all pass'}: ${checks - failures}/${checks}`);
process.exit(failures ? 1 : 0);
