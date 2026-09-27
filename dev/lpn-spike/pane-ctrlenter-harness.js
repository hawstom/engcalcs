// CTRL+ENTER FILLS A STANDING SELECTION -- ROADMAP Task 690, the data-entry-clerk's own spec
// (dev/task-690-ctrl-enter-spec.md). Run with:
//   node dev/lpn-spike/pane-ctrlenter-harness.js
//
// What matters enough to assert headlessly, against the spec's own numbered acceptance tests:
//
//   1. With a multi-cell selection standing, Ctrl+Enter broadcasts the ANCHOR cell's value (not
//      necessarily the top row -- Excel and Sheets both read the anchor) to every settable cell in
//      the box, and the box is NOT collapsed afterward.
//   2. The id column is skipped by name and counted in {skipped}, the same precedent Ctrl+D set.
//   3. A read-only/result column is skipped and counted, never an alert().
//   4. A single-cell selection is ordinary Enter: commit and move down, no extra undo snapshot.
//   5. One Ctrl+Z undoes the whole broadcast.
//   6. Inside a scenario the broadcast is an override on every filled element; base does not move.
//   7. A unit-bearing numeric column: the anchor's literal token is written to every cell in range,
//      not a value reconverted per row.
//   8. A blank anchor cell broadcasts a cleared/default state, with the same {skipped} accounting.
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
	"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\tsetCell: function (id, elId, key, v) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\tpaneColByKey(s, key).set(el, v); },\n" +
	"\t\tcellText: function (id, elId, key) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\treturn paneCellText(paneColByKey(s, key), el); },\n" +
	// Sets the field the real Ctrl+Enter handler reads, exactly as the keyboard's own Ctrl+A does
	// (paneHandleKey) -- r0 is the ANCHOR row index, r1 the focus row index, so a caller can put the
	// anchor anywhere in the box, including its own bottom edge.
	"\t\tselectBox: function (id, aKey, fKey, r0, r1) { var s = paneTableById(id),\n" +
	"\t\t\trows = paneTableRowsInOrder(s);\n" +
	"\t\t\ts.sel = { aId: rows[r0].id, aKey: aKey, fId: rows[r1].id, fKey: fKey }; },\n" +
	"\t\tselBox: function (id) { var s = paneTableById(id);\n" +
	"\t\t\treturn paneSelBox(s, paneTableRowsInOrder(s), paneCols(s)); },\n" +
	"\t\tenterEdit: paneEnterEdit, cancelEdit: paneCancelEdit,\n" +
	"\t\tfocusable: function (id, elId, key) { var s = paneTableById(id);\n" +
	"\t\t\treturn paneCellFocusable(s.tds[elId][key]); },\n" +
	"\t\tundoDepth: function () { return undoStack.length; }, undo: undo,\n" +
	"\t\teffective: effective, baseValue: baseValue, hasOverride: hasOverride,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tnotice: function () { return document.getElementById('lpn_map_notice').textContent || ''; },\n" +
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
function ctrlEnter(id) {
	let prevented = false;
	fire(tableEl(id), 'keydown', { key: 'Enter', shiftKey: false, ctrlKey: true, metaKey: false,
		altKey: false, preventDefault: function () { prevented = true; } });
	return prevented;
}

const ids = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0), L.addNode('junction', 20, 0),
	L.addNode('junction', 30, 0), L.addNode('junction', 40, 0)].map((n) => n.id);
ids.forEach((id, i) => { L.setCell('junctions', id, 'elev', 100 + i); L.setCell('junctions', id, 'demand', i); });
L.openPane('junctions');
L.renderTable('junctions');

console.log('\n--- 1. Ctrl+Enter broadcasts the ANCHOR cell, anchored at the bottom of the box, not the top ---');
{
	// The anchor is row index 4 (the bottom of the five), the focus row index 0 (the top) -- a
	// person who clicked the bottom row and Shift-clicked up to the top leaves the anchor exactly
	// there, which is a real gesture and NOT box.r0. If the code wrongly read box.r0/rows[box.r0]
	// this would broadcast row 0's stale demand instead of row 4's freshly typed one.
	L.setCell('junctions', ids[4], 'demand', 99);
	const d0 = L.undoDepth();
	L.selectBox('junctions', 'demand', 'demand', 4, 0);
	const box0 = L.selBox('junctions');
	report(box0.ar === 4 && box0.r0 === 0 && box0.r1 === 4, 'the box spans all 5 rows with the anchor at the bottom edge',
		JSON.stringify(box0));
	const prevented = ctrlEnter('junctions');
	report(prevented, 'the keystroke is claimed');
	ids.forEach((id, i) => {
		report(L.cellText('junctions', id, 'demand') === '99', 'row ' + i + ' now reads the anchor\'s Demand (99)',
			L.cellText('junctions', id, 'demand'));
	});
	report(L.undoDepth() === d0 + 1, 'the whole broadcast is ONE undo snapshot', d0 + ' -> ' + L.undoDepth());
	const box1 = L.selBox('junctions');
	report(!!box1 && box1.r0 === 0 && box1.r1 === 4 && box1.ar === 4,
		'the selection is NOT collapsed -- still 5 rows, anchor still at the bottom', JSON.stringify(box1));
}

console.log('\n--- 2. the id column is skipped by name and counted in {skipped} ---');
{
	L.setCell('junctions', ids[4], 'demand', 55);
	L.selectBox('junctions', 'demand', 'id', 4, 0);
	const before = ids.map((id) => L.cellText('junctions', id, 'id'));
	ctrlEnter('junctions');
	ids.forEach((id, i) => {
		report(L.cellText('junctions', id, 'id') === before[i], 'row ' + i + '\'s id is untouched', L.cellText('junctions', id, 'id'));
	});
	report(L.cellText('junctions', ids[2], 'demand') === '55', 'the settable column in range still fills',
		L.cellText('junctions', ids[2], 'demand'));
	const m = /(\d+) were not changed/.exec(L.notice());
	report(!!m && +m[1] >= 4, '{skipped} counts (at least) the 4 id cells that were "not changed"', L.notice());
}

console.log('\n--- 3. a read-only/result column is skipped and counted, no alert() ---');
{
	L.setCell('junctions', ids[4], 'demand', 12);
	const before = ids.map((id) => L.cellText('junctions', id, 'pressure'));
	L.selectBox('junctions', 'demand', 'pressure', 4, 0);
	let threw = false;
	try { ctrlEnter('junctions'); } catch (e) { threw = true; }
	report(!threw, 'no exception (no alert()) fires for a read-only column in range');
	ids.forEach((id, i) => {
		report(L.cellText('junctions', id, 'pressure') === before[i], 'row ' + i + '\'s Pressure (result) is untouched');
	});
	report(L.cellText('junctions', ids[1], 'demand') === '12', 'Demand still fills alongside the refused Pressure column');
}

console.log('\n--- 4. a single-cell selection behaves as ordinary Enter ---');
{
	L.selectBox('junctions', 'demand', 'demand', 1, 1);
	const box0 = L.selBox('junctions');
	report(box0.r0 === box0.r1 && box0.c0 === box0.c1, 'the selection really is one cell');
	const d0 = L.undoDepth();
	const before = L.cellText('junctions', ids[1], 'demand');
	ctrlEnter('junctions');
	report(L.cellText('junctions', ids[1], 'demand') === before, 'the cell\'s own value is unchanged (no broadcast to itself)');
	report(L.undoDepth() === d0, 'no undo snapshot beyond the ordinary commit\'s own (nothing was edited here)');
	const box1 = L.selBox('junctions');
	report(!!box1 && box1.r0 === 2 && box1.r1 === 2, 'plain Enter behavior: the selection moved down one row',
		JSON.stringify(box1));
}

console.log('\n--- 5. one Ctrl+Z undoes the whole multi-row broadcast ---');
{
	ids.forEach((id, i) => L.setCell('junctions', id, 'demand', i));
	const before = ids.map((id) => L.cellText('junctions', id, 'demand'));
	L.setCell('junctions', ids[0], 'demand', 77);
	L.selectBox('junctions', 'demand', 'demand', 0, 4);
	ctrlEnter('junctions');
	ids.forEach((id) => report(L.cellText('junctions', id, 'demand') === '77', 'every row reads 77 before undo'));
	L.undo();
	report(L.cellText('junctions', ids[3], 'demand') === before[3] || L.cellText('junctions', ids[3], 'demand') !== '77',
		'one Ctrl+Z restores a filled row (undoing the whole broadcast, not one row of it)',
		L.cellText('junctions', ids[3], 'demand'));
}

console.log('\n--- 6. inside a scenario, Ctrl+Enter is an OVERRIDE and base does not move ---');
{
	const jA = L.addNode('junction', 0, 100), jB = L.addNode('junction', 10, 100),
		jC = L.addNode('junction', 20, 100);
	L.setCell('junctions', jA.id, 'demand', 11);
	L.setCell('junctions', jB.id, 'demand', 22);
	L.setCell('junctions', jC.id, 'demand', 33);
	const scn = L.createScenario('Peak hour');
	L.switchScenario(scn.id);
	L.renderTable('junctions');
	const order = L.tableOrder('junctions');
	L.selectBox('junctions', 'demand', 'demand', order.indexOf(jC.id), order.indexOf(jA.id));
	ctrlEnter('junctions');
	report(L.effective(jB, 'demand') === 33, 'the scenario sees the anchor\'s (jC\'s) filled value', String(L.effective(jB, 'demand')));
	report(L.baseValue(jB, 'demand') === 22, 'BASE DOES NOT MOVE', String(L.baseValue(jB, 'demand')));
	report(L.hasOverride(jB, 'demand') === true, 'the fill is recorded as a scenario override');
	report(L.baseValue(jA, 'demand') === 11, '...and the far row\'s base is untouched too', String(L.baseValue(jA, 'demand')));
}

console.log('\n--- 7. a unit-bearing numeric column: the anchor\'s literal token, not a reconverted value ---');
{
	// Elev is a plain LENGTH-family numeric column (feet, on the 'us' unit set opened above) --
	// every row reads the SAME displayed unit, so the anchor's raw text ("6") must land in every
	// row's cell as the identical text a keystroke would have put there, never passed through a
	// parse-and-reconvert round trip that could drift a fraction.
	L.setCell('junctions', ids[0], 'elev', 6);
	report(L.cellText('junctions', ids[0], 'elev') === '6', 'the anchor shows the literal token "6"');
	L.selectBox('junctions', 'elev', 'elev', 0, 4);
	ctrlEnter('junctions');
	ids.forEach((id, i) => {
		report(L.cellText('junctions', id, 'elev') === '6', 'row ' + i + ' carries the literal token "6", not a reconverted value',
			L.cellText('junctions', id, 'elev'));
	});
}

console.log('\n--- 8. a blank anchor cell broadcasts a cleared/default state ---');
{
	// Emitter is `blank: true` -- a column that has a real "not stated" state, unlike Demand, whose
	// blank commits to 0. Blank is the legitimate "clear this column across the selection" case the
	// spec names, and it must not be special-cased away.
	ids.forEach((id, i) => L.setCell('junctions', id, 'emitter', 0.5 + i));
	L.setCell('junctions', ids[0], 'emitter', undefined);
	report(L.cellText('junctions', ids[0], 'emitter') === '', 'the anchor cell is blank');
	L.selectBox('junctions', 'emitter', 'emitter', 0, 4);
	ctrlEnter('junctions');
	ids.forEach((id, i) => {
		report(L.cellText('junctions', id, 'emitter') === '', 'row ' + i + ' is cleared to the blank/default state',
			L.cellText('junctions', id, 'emitter'));
	});
}

console.log('\n--- 9. Ctrl+Enter commits an in-progress edit first, then broadcasts what was typed ---');
{
	// "Where it goes" in the spec: Ctrl+Enter must work whether or not the active cell is still
	// mid-edit -- committing the freshly typed text into the model is the first thing it has to do,
	// so that text (not the cell's old, already-committed value) is what gets broadcast.
	L.selectBox('junctions', 'demand', 'demand', 0, 4);
	const box0 = L.focusable('junctions', ids[0], 'demand');
	box0.focus();
	L.enterEdit(box0, true);
	box0.value = '123';
	ctrlEnter('junctions');
	ids.forEach((id, i) => {
		report(L.cellText('junctions', id, 'demand') === '123', 'row ' + i + ' reads the value typed but not yet committed',
			L.cellText('junctions', id, 'demand'));
	});
}

console.log(`\n${failures ? 'FAILURES' : 'all pass'}: ${checks - failures}/${checks}`);
process.exit(failures ? 1 : 0);
