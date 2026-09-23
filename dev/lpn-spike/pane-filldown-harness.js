// FILL DOWN -- ROADMAP Task 690, the spreadsheet convention bound to Ctrl+D. Run with:
//   node dev/lpn-spike/pane-filldown-harness.js
//
// What matters enough to assert headlessly:
//
//   1. Ctrl+D, with a multi-row selection standing, copies the TOP row's cells down through every
//      row below it in the selection -- the Excel/Sheets convention, and Tom's own spreadsheet
//      framing for this whole umbrella (Task 690).
//   2. It goes through the SAME validated write as a paste -- paneWriteCellText(), which is
//      c.set(), which is setProp() -- so a result column refuses it exactly as it refuses a
//      keystroke or a paste, and the refusal is COUNTED rather than silently dropped.
//   3. ONE undo snapshot for the whole rectangle, not one per row.
//   4. A cell being typed in (Entry/Edit mode) keeps its own "d" -- Ctrl+D must not fire mid-edit.
//      A single-row selection is not a fill and leaves the browser's own Ctrl+D alone.
//   5. Inside a scenario it is an OVERRIDE: base does not move (the seam
//      dev/scenario-seam-repair.md exists to keep, on the one door scenario_seam_check.php cannot
//      see through a keyboard gesture).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}

setUnitSet('us');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode,\n" +
	"\t\tpaneTableById: paneTableById, openPane: openPane,\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\tcolKeys: function (id) { return paneCols(paneTableById(id)).map(function (c) { return c.key; }); },\n" +
	"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\tsetCell: function (id, elId, key, v) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\tpaneColByKey(s, key).set(el, v); },\n" +
	"\t\tcellText: function (id, elId, key) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\treturn paneCellText(paneColByKey(s, key), el); },\n" +
	// Sets the field the real Ctrl+D handler reads, exactly as the keyboard's own Ctrl+A does
	// (paneHandleKey) -- the click-and-drag gesture that would normally set it is pane-select-
	// harness.js's territory, not this one's.
	"\t\tselectBox: function (id, aKey, fKey, r0, r1) { var s = paneTableById(id),\n" +
	"\t\t\trows = paneTableRowsInOrder(s);\n" +
	"\t\t\ts.sel = { aId: rows[r0].id, aKey: aKey, fId: rows[r1].id, fKey: fKey }; },\n" +
	"\t\tenterEdit: paneEnterEdit, cancelEdit: paneCancelEdit,\n" +
	"\t\tfocusable: function (id, elId, key) { var s = paneTableById(id);\n" +
	"\t\t\treturn paneCellFocusable(s.tds[elId][key]); },\n" +
	"\t\tundoDepth: function () { return undoStack.length; }, undo: undo,\n" +
	"\t\teffective: effective, baseValue: baseValue, hasOverride: hasOverride,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
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
function tableEl(id) { return byId['lpn_pane_' + id].children.filter((c) => c._tag === 'table')[0]; }
function ctrlD(id) {
	fire(tableEl(id), 'keydown', { key: 'd', shiftKey: false, ctrlKey: true, metaKey: false,
		altKey: false, preventDefault: function () { this._prevented = true; } });
}

const ids = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0),
	L.addNode('junction', 20, 0), L.addNode('junction', 30, 0)].map((n) => n.id);
ids.forEach((id, i) => { L.setCell('junctions', id, 'elev', 100 + i); L.setCell('junctions', id, 'demand', i); });
L.openPane('junctions');
L.renderTable('junctions');

console.log('\n--- Ctrl+D fills the top row of the selection down ---');
{
	L.setCell('junctions', ids[0], 'demand', 42);
	const d0 = L.undoDepth();
	L.selectBox('junctions', 'demand', 'demand', 0, 3);
	ctrlD('junctions');
	ids.forEach((id, i) => {
		report(L.cellText('junctions', id, 'demand') === L.cellText('junctions', ids[0], 'demand'),
			'row ' + i + ' now reads the top row\'s Demand', L.cellText('junctions', id, 'demand'));
	});
	report(L.undoDepth() === d0 + 1, 'the whole fill is ONE undo snapshot, not one per row',
		d0 + ' -> ' + L.undoDepth());
	L.undo();
	report(L.cellText('junctions', ids[3], 'demand') !== L.cellText('junctions', ids[0], 'demand') ||
		L.cellText('junctions', ids[3], 'demand') === '3',
		'one Ctrl+Z undoes the whole fill', L.cellText('junctions', ids[3], 'demand'));
	// Redo the fill for the sections below.
	L.selectBox('junctions', 'demand', 'demand', 0, 3);
	ctrlD('junctions');
}

console.log('\n--- a result column refuses it exactly as it refuses a keystroke, and it is counted ---');
{
	L.setCell('junctions', ids[0], 'demand', 7);
	const before = ids.map((id) => L.cellText('junctions', id, 'pressure'));
	const d0 = L.undoDepth();
	// Demand (settable) through Pressure (a result column -- see paneColNodeResult) in one range,
	// so the fill has one column it can write and one it must refuse.
	L.selectBox('junctions', 'demand', 'pressure', 0, 3);
	ctrlD('junctions');
	report(L.cellText('junctions', ids[2], 'demand') === '7', 'the settable column in range still fills',
		L.cellText('junctions', ids[2], 'demand'));
	ids.forEach((id, i) => {
		report(L.cellText('junctions', id, 'pressure') === before[i],
			'row ' + i + '\'s result column is untouched, exactly as a keystroke would be refused');
	});
	report(L.undoDepth() === d0 + 1, '...and still just one snapshot for the range', d0 + ' -> ' + L.undoDepth());
}

console.log('\n--- a single row is not a fill, and the browser keeps its own Ctrl+D ---');
{
	const d0 = L.undoDepth();
	L.selectBox('junctions', 'demand', 'demand', 1, 1);
	let prevented = false;
	fire(tableEl('junctions'), 'keydown', { key: 'd', shiftKey: false, ctrlKey: true, metaKey: false,
		altKey: false, preventDefault: function () { prevented = true; } });
	report(L.undoDepth() === d0, 'a one-row selection takes no snapshot');
	report(!prevented, '...and the key handler does not claim the keystroke, so the browser\'s own Ctrl+D stands');
}

console.log('\n--- Ctrl+D does not fire while a cell is being typed in ---');
{
	L.selectBox('junctions', 'demand', 'demand', 0, 3);
	const box0 = L.focusable('junctions', ids[0], 'demand');
	box0.focus();
	L.enterEdit(box0, false);
	box0.value = 'notd';
	const d0 = L.undoDepth();
	ctrlD('junctions');
	report(L.undoDepth() === d0, 'Ctrl+D while typing in a cell does not run a fill');
	L.cancelEdit(box0);
}

console.log('\n--- inside a scenario, fill-down is an OVERRIDE and base does not move ---');
{
	const jA = L.addNode('junction', 0, 100), jB = L.addNode('junction', 10, 100),
		jC = L.addNode('junction', 20, 100);
	L.setCell('junctions', jA.id, 'demand', 11);
	L.setCell('junctions', jB.id, 'demand', 22);
	L.setCell('junctions', jC.id, 'demand', 33);
	const scn = L.createScenario('Peak hour');
	L.switchScenario(scn.id);
	L.renderTable('junctions');
	L.selectBox('junctions', 'demand', 'demand',
		L.tableOrder('junctions').indexOf(jA.id), L.tableOrder('junctions').indexOf(jC.id));
	ctrlD('junctions');
	report(L.effective(jB, 'demand') === 11, 'the scenario sees the filled-down value',
		String(L.effective(jB, 'demand')));
	report(L.baseValue(jB, 'demand') === 22, 'BASE DOES NOT MOVE', String(L.baseValue(jB, 'demand')));
	report(L.hasOverride(jB, 'demand') === true, 'the fill is recorded as a scenario override');
	report(L.baseValue(jC, 'demand') === 33, '...and the third row\'s base is untouched too',
		String(L.baseValue(jC, 'demand')));
}

console.log(`\n${failures ? 'FAILURES' : 'all pass'}: ${checks - failures}/${checks}`);
process.exit(failures ? 1 : 0);
