// AN EDITED ROW STAYS IN A FILTERED TABLE -- ROADMAP Task 738. Run with:
//   node dev/lpn-spike/filter-edited-row-harness.js
//
// Tom, 2026-09-28: editing a filtered value so the row no longer matched made the row vanish from
// under him, and a Ctrl+Enter fill into a filtered selection made the whole selection vanish. His
// ruling, 2026-09-30 ("the synthesis"): no toggle; a row stays if it matches OR it was edited since
// Filter in table was pressed; pressing Filter in table again re-applies from scratch. A row that
// stays without matching is dimmed, its ID cell carries a warning sign, and the filter's line counts
// them.
//
// What this asserts, through the page's own doors (the Find panel's real button, a cell's real
// change listener, the table's real Ctrl+Enter keydown, the fill handle's real begin/move/end, and
// undo()):
//   1. edit a matching row out of the filter: it stays, dimmed, with the sign, and the count is 1;
//   2. fill a filtered selection (Ctrl+Enter, then drag-to-fill) out of the filter: none vanish;
//   3. an undo that makes a row match again un-marks it, and it stays;
//   4. an edit by the Properties door (setProp) counts too; a scenario switch does not;
//   5. press Filter in table again: the non-matching rows go, the count and the marks clear.
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
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, setProp: setProp,\n" +
	"\t\tpaneTableById: paneTableById, openPane: openPane,\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\tsetCell: function (id, elId, key, v) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\tpaneColByKey(s, key).set(el, v); },\n" +
	"\t\tcell: function (id, elId, key) { return paneTableById(id).cells[elId][key]; },\n" +
	"\t\ttd: function (id, elId, key) { var t = paneTableById(id).tds[elId]; return t ? t[key] : null; },\n" +
	"\t\tselectBox: function (id, aKey, fKey, r0, r1) { var s = paneTableById(id),\n" +
	"\t\t\trows = paneTableRowsInOrder(s), cols = paneCols(s);\n" +
	"\t\t\ts.sel = { aId: rows[r0].id, aKey: aKey, fId: rows[r1].id, fKey: fKey };\n" +
	"\t\t\tpaneSelPaint(s, rows, cols); },\n" +
	"\t\tdragBegin: function (id) { return paneFillHandleBegin(paneTableById(id)); },\n" +
	"\t\tdragMoveTo: function (id, elId, key) { var s = paneTableById(id), d = s._fillDrag, r, c;\n" +
	"\t\t\tif (!d) { return; }\n" +
	"\t\t\tr = d.rows.map(function (x) { return x.id; }).indexOf(elId);\n" +
	"\t\t\tc = d.cols.map(function (x) { return x.key; }).indexOf(key);\n" +
	"\t\t\tpaneFillHandleMoveToIndex(s, r, c); },\n" +
	"\t\tdragEnd: function (id, commit) { return paneFillHandleEnd(paneTableById(id), commit); },\n" +
	"\t\tstaleText: function (n) { return String(EngCalcs.pageConfig.lpn_pane_filter_stale).split('{n}').join(String(n)); },\n" +
	"\t\tstaleHead: function () { return String(EngCalcs.pageConfig.lpn_pane_filter_stale).split('{n}')[0]; },\n" +
	"\t\tundo: undo, saveUndoSnapshot: saveUndoSnapshot,\n" +
	"\t\tdemandText: function (elId) { var s = paneTableById('junctions');\n" +
	"\t\t\treturn paneCellText(paneColByKey(s, 'demand'), doc.nodes.filter(function (x) { return x.id === elId; })[0]); },\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tqueryFor: function (scope, prop, op, value) {\n" +
	"\t\t\tfindState.scope = scope; findState.prop = prop; findState.op = op; findState.value = value;\n" +
	"\t\t\treturn findQueryString(); },\n" +
	"\t\tbuildPanel: function () { rebuildFindForm(); },\n" +
	"\t\ttype: function (text) { findQueryInput.value = text;\n" +
	"\t\t\t(findQueryInput._listeners.input || []).forEach(function (f) { f({}); }); },\n" +
	"\t\tpressFilter: function () { var b = null;\n" +
	"\t\t\t(function walk(e) { if (e.id === 'lpn_find_filter_go') { b = e; }\n" +
	"\t\t\t\t(e.children || []).forEach(walk); })(document.getElementById('lpn_find_form'));\n" +
	"\t\t\tif (!b) { throw new Error('no filter button'); }\n" +
	"\t\t\t(b._listeners.click || []).forEach(function (f) { f({}); }); },\n" +
	"\t\tfilterQuery: function (id) { return paneFilterQuery(paneTableById(id)); },\n" +
	"\t\tbannerText: function (id) { var s = paneTableById(id), host = document.getElementById(s.panel), t = '';\n" +
	"\t\t\t(function walk(e) { if (/lpn-pane-filter/.test(e.className || '') && !t) { t = e.textContent ||\n" +
	"\t\t\t\t(e.children || []).map(function (c) { return c.textContent || ''; }).join(' '); }\n" +
	"\t\t\t\t(e.children || []).forEach(walk); })(host);\n" +
	"\t\t\treturn t; },\n" +
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
	fire(tableEl(id), 'keydown', { key: 'Enter', shiftKey: false, ctrlKey: true, metaKey: false,
		altKey: false, preventDefault: function () {} });
}
// Typing a value into a cell and leaving it, through the cell's own change listener.
function typeInCell(elId, key, v) {
	const input = L.cell('junctions', elId, key);
	input.value = String(v);
	fire(input, 'change');
	L.renderTable('junctions');
}
function isDimmed(elId) {
	const td = L.td('junctions', elId, 'demand');
	if (!td) { return false; }
	return / ?lpn-pane-stale( |$)/.test((td.parentNode && td.parentNode.className) || '');
}
function hasSign(elId) {
	const td = L.td('junctions', elId, 'id');
	return !!td && (td.children || []).some((c) =>
		/lpn-pane-stale-mark/.test(c.className || '') && c.textContent === '⚠');
}
function demandOf(elId) { return Number(L.demandText(elId)); }

// Five junctions with demands 0..4. The filter "demand above 2" admits the last two.
const ids = [0, 1, 2, 3, 4].map((i) => L.addNode('junction', 10 * i, 0).id);
ids.forEach((id, i) => { L.setCell('junctions', id, 'elev', 100 + i); L.setCell('junctions', id, 'demand', i); });
L.openPane('junctions');
L.renderTable('junctions');
const [, , , J4, J5] = ids;

console.log('\n--- 0. Filter in table, pressed in the Find panel ---');
L.buildPanel();
L.type(L.queryFor('junction', 'demand', 'gt', '2'));
L.pressFilter();
report(L.filterQuery('junctions') !== '', 'the Junctions table is filtered', L.filterQuery('junctions'));
report(JSON.stringify(L.tableOrder('junctions')) === JSON.stringify([J4, J5]),
	'...to the two junctions whose demand is above 2', JSON.stringify(L.tableOrder('junctions')));
report(!isDimmed(J4) && !hasSign(J4) && !isDimmed(J5), '...and neither is marked');
report(L.bannerText('junctions').indexOf(L.staleHead()) < 0, '...and the line has no count', L.bannerText('junctions'));

console.log('\n--- 1. edit a matching row so it no longer matches ---');
typeInCell(J4, 'demand', 1);
report(demandOf(J4) === 1, 'the edit landed', String(demandOf(J4)));
report(L.tableOrder('junctions').indexOf(J4) >= 0, 'the row STAYS in the table', JSON.stringify(L.tableOrder('junctions')));
report(isDimmed(J4), '...dimmed');
report(hasSign(J4), '...with the warning sign on its ID cell');
report(!isDimmed(J5) && !hasSign(J5), '...and the row that still matches is not marked');
report(L.bannerText('junctions').indexOf(L.staleText(1)) >= 0, 'the filter line counts 1', L.bannerText('junctions'));
// A solve refreshes the table without changing any row: nothing moves and the marks hold.
L.renderTable('junctions');
report(isDimmed(J4) && hasSign(J4) && L.tableOrder('junctions').length === 2, 'a redraw keeps the row and its marks');

console.log('\n--- 2. fill a filtered selection out of the filter ---');
// Ctrl+Enter with the anchor on J4 (demand 1): J5 gets 1 too, and no longer matches either.
L.selectBox('junctions', 'demand', 'demand', 0, 1);
ctrlEnter('junctions');
L.renderTable('junctions');
report(demandOf(J5) === 1, 'Ctrl+Enter filled the selection', String(demandOf(J5)));
report(JSON.stringify(L.tableOrder('junctions')) === JSON.stringify([J4, J5]),
	'...and NONE of the selection vanished', JSON.stringify(L.tableOrder('junctions')));
report(isDimmed(J5) && hasSign(J5), '...the newly unmatched row is marked');
report(L.bannerText('junctions').indexOf(L.staleText(2)) >= 0, '...and the count is 2', L.bannerText('junctions'));
// Undo the fill: J5 is back at 4 and matches again. It stays (it always stays until re-filter) and
// is simply un-marked.
L.undo();
L.renderTable('junctions');
report(demandOf(J5) === 4, 'undo put J5 back at 4', String(demandOf(J5)));
report(L.tableOrder('junctions').indexOf(J5) >= 0 && !isDimmed(J5) && !hasSign(J5),
	'...an undo that makes a row match again un-marks it');
report(L.bannerText('junctions').indexOf(L.staleText(1)) >= 0, '...and the count falls to 1', L.bannerText('junctions'));
// Drag-to-fill from J4 down onto J5 -- the other fill.
L.selectBox('junctions', 'demand', 'demand', 0, 0);
L.dragBegin('junctions');
L.dragMoveTo('junctions', J5, 'demand');
L.dragEnd('junctions', true);
L.renderTable('junctions');
report(demandOf(J5) === 1, 'drag-to-fill filled J5', String(demandOf(J5)));
report(JSON.stringify(L.tableOrder('junctions')) === JSON.stringify([J4, J5]),
	'...and none vanished', JSON.stringify(L.tableOrder('junctions')));
report(L.bannerText('junctions').indexOf(L.staleText(2)) >= 0, '...count 2 again', L.bannerText('junctions'));

console.log('\n--- 3. an undo is an edit too ---');
{
	// Re-apply: both are at 1 now, so nothing is above 2 and the table is empty.
	L.pressFilter();
	report(L.tableOrder('junctions').length === 0, 're-applied: nothing is above 2 now', JSON.stringify(L.tableOrder('junctions')));
	// A Properties edit (the setProp seam, behind an undo snapshot as every real edit is) brings
	// J4 in by matching...
	const j4 = L.getDoc().nodes.filter((n) => n.id === J4)[0];
	L.saveUndoSnapshot();
	L.setProp(j4, 'demand', 9);
	L.renderTable('junctions');
	report(JSON.stringify(L.tableOrder('junctions')) === JSON.stringify([J4]), 'an edit that makes a row match brings it in',
		JSON.stringify(L.tableOrder('junctions')));
	// ...and Ctrl+Z takes the value back out of the filter. The undo changed the row, so it stays.
	L.undo();
	L.renderTable('junctions');
	report(demandOf(J4) === 1, 'undo put J4 back at 1', String(demandOf(J4)));
	report(JSON.stringify(L.tableOrder('junctions')) === JSON.stringify([J4]) && isDimmed(J4) && hasSign(J4),
		'...and the row the undo took out of the filter stays, marked', JSON.stringify(L.tableOrder('junctions')));
}

console.log('\n--- 4. the Properties door, and a scenario switch ---');
{
	const j4 = L.getDoc().nodes.filter((n) => n.id === J4)[0];
	L.setProp(j4, 'demand', 9);
	L.pressFilter();
	report(JSON.stringify(L.tableOrder('junctions')) === JSON.stringify([J4]), 're-applied with J4 matching',
		JSON.stringify(L.tableOrder('junctions')));
	// A Properties edit (the setProp seam) out of the filter.
	L.setProp(j4, 'demand', 0);
	L.renderTable('junctions');
	report(L.tableOrder('junctions').indexOf(J4) >= 0 && isDimmed(J4) && hasSign(J4),
		'a Properties edit out of the filter keeps the row, marked');
	// Switching scenario changes no element, so it is not an edit.
	L.setProp(j4, 'demand', 9);
	L.pressFilter();
	L.createScenario('Max day');
	L.renderTable('junctions');
	report(L.tableOrder('junctions').indexOf(J4) >= 0 && !isDimmed(J4),
		'switching scenario is not an edit', JSON.stringify(L.tableOrder('junctions')));
	L.switchScenario('base');
	L.renderTable('junctions');
	report(L.tableOrder('junctions').indexOf(J4) >= 0 && !isDimmed(J4) && !hasSign(J4),
		'...and switching back leaves it unmarked');
}

console.log('\n--- 5. Filter in table again re-applies from scratch ---');
{
	const j4 = L.getDoc().nodes.filter((n) => n.id === J4)[0];
	typeInCell(J4, 'demand', 0);
	report(L.tableOrder('junctions').indexOf(J4) >= 0 && L.bannerText('junctions').indexOf(L.staleText(1)) >= 0,
		'an edited row is held with a count of 1', L.bannerText('junctions'));
	L.pressFilter();
	L.renderTable('junctions');
	report(L.tableOrder('junctions').indexOf(J4) < 0, 'pressed again, the row that no longer matches goes',
		JSON.stringify(L.tableOrder('junctions')));
	report(L.bannerText('junctions').indexOf(L.staleHead()) < 0, '...and the count clears', L.bannerText('junctions'));
	// And the kept set is truly gone: making it match brings it back unmarked.
	L.setProp(j4, 'demand', 5);
	L.renderTable('junctions');
	report(L.tableOrder('junctions').indexOf(J4) >= 0 && !isDimmed(J4) && !hasSign(J4),
		'...and a row that matches again arrives unmarked');
	// Show all (removing the filter) forgets too.
	typeInCell(J4, 'demand', 0);
	report(isDimmed(J4), '(held and marked again)');
	L.pressFilter();
	report(L.tableOrder('junctions').indexOf(J4) < 0, 're-applied once more, it goes');
}

console.log('\n' + checks + ' checks, ' + failures + ' failed');
process.exit(failures === 0 ? 0 : 1);
