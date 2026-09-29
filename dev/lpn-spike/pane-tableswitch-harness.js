// CTRL+SHIFT+PAGEDOWN/PAGEUP SWITCHES TABLES -- ROADMAP Task 690, the open item ("Ctrl+Shift+
// PageUp/PageDn between tables"). Run with:
//   node dev/lpn-spike/pane-tableswitch-harness.js
//
// What matters enough to assert headlessly:
//
//   1. Ctrl+Shift+PageDown moves to the NEXT table in paneTables() order; Ctrl+Shift+PageUp moves
//      back. Plain Ctrl+PageDown/PageUp (no Shift) is left untouched -- that combination is the
//      BROWSER's own tab switch and must not be claimed.
//   2. Excel does not wrap at the ends, so neither does this: PageUp on the first table and
//      PageDown on the last are both no-ops (the keystroke is still claimed).
//   3. Focus lands on the SAME COLUMN KEY if the destination table has one (Junctions' and
//      Reservoirs' shared "elev"); otherwise the FIRST column (Junctions' "demand", which
//      Reservoirs has no column for, falls back to "id").
//   4. Focus lands on the SAME ROW INDEX, clamped to the destination table's row count.
//   5. The switch is scoped to the DATA TABLES ONLY (paneTables()) -- it must never reach
//      Time series or Profile, which sit on the same tab strip but hold no cell grid.
//   6. Mid-edit, the typed-but-not-yet-committed value is committed before the switch, so no
//      text is lost -- the same choice Enter and the arrow keys make.
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
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink, addCustomer: addCustomer,\n" +
	"\t\tpaneTableById: paneTableById, openPane: openPane, setPaneTab: setPaneTab,\n" +
	"\t\tactiveTab: function () { return paneState.tab; },\n" +
	"\t\ttableIds: function () { return paneTables().map(function (s) { return s.id; }); },\n" +
	"\t\ttabIds: function () { return paneTabs.map(function (t) { return t.id; }); },\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\tsetCell: function (id, elId, key, v) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\tpaneColByKey(s, key).set(el, v); },\n" +
	"\t\tcellText: function (id, elId, key) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\treturn paneCellText(paneColByKey(s, key), el); },\n" +
	// Same door the Ctrl+Enter harness sets a selection through, so the anchor and focus rows are
	// exactly what a real Shift+click or keyboard select would leave standing.
	"\t\tselectBox: function (id, aKey, fKey, r0, r1) { var s = paneTableById(id),\n" +
	"\t\t\trows = paneTableRowsInOrder(s);\n" +
	"\t\t\ts.sel = { aId: rows[r0].id, aKey: aKey, fId: rows[r1].id, fKey: fKey }; },\n" +
	"\t\tselBox: function (id) { var s = paneTableById(id);\n" +
	"\t\t\treturn paneSelBox(s, paneTableRowsInOrder(s), paneCols(s)); },\n" +
	"\t\tenterEdit: paneEnterEdit, cancelEdit: paneCancelEdit,\n" +
	"\t\tfocusable: function (id, elId, key) { var s = paneTableById(id);\n" +
	"\t\t\treturn paneCellFocusable(s.tds[elId][key]); },\n" +
	"\t\tfocused: function (id) { var s = paneTableById(id), k, el = document.activeElement;\n" +
	"\t\t\tfor (k in s.tds) { if (Object.prototype.hasOwnProperty.call(s.tds, k)) {\n" +
	"\t\t\t\tvar cols = s.tds[k], ck; for (ck in cols) { if (Object.prototype.hasOwnProperty.call(cols, ck)) {\n" +
	"\t\t\t\t\tif (paneCellFocusable(cols[ck]) === el) { return { id: k, key: ck }; }\n" +
	"\t\t\t\t} } } } return null; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

function tableEl(id) { return byId['lpn_pane_' + id].children.filter((c) => c._tag === 'table')[0]; }
function pressPageKey(id, key, opts) {
	let prevented = false;
	const o = opts || {};
	fire(tableEl(id), 'keydown', { key: key, shiftKey: !!o.shift, ctrlKey: o.ctrl !== false,
		metaKey: false, altKey: false, preventDefault: function () { prevented = true; } });
	return prevented;
}
function fire(el, type, ev) {
	((el && el._listeners && el._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}

const jIds = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0), L.addNode('junction', 20, 0),
	L.addNode('junction', 30, 0), L.addNode('junction', 40, 0)].map((n) => n.id);
jIds.forEach((id, i) => { L.setCell('junctions', id, 'elev', 100 + i); L.setCell('junctions', id, 'demand', i); });
const rIds = [L.addNode('reservoir', 0, 100)].map((n) => n.id);
L.setCell('reservoirs', rIds[0], 'elev', 500);
const tIds = [L.addNode('tank', 0, 200), L.addNode('tank', 10, 200)].map((n) => n.id);
tIds.forEach((id, i) => { L.setCell('tanks', id, 'elev', 300 + i); });
// A pipe to carry a customer -- Customers is the LAST data table in paneTables() order, and it
// needs at least one row for test 4 below: an empty CURRENT table's keydown bails out before
// this shortcut is ever reached (`paneHandleKey`'s own `!rows.length` guard), which would make
// the boundary this test names untestable rather than passing.
const pipe = L.addLink('pipe', jIds[0], jIds[1]);
L.addLink('pipe', jIds[2], jIds[3]);
L.addCustomer(5, 0, { link: pipe.id });

L.openPane('junctions');
L.renderTable('junctions');
L.renderTable('reservoirs');
L.renderTable('tanks');
L.renderTable('customers');

const order = L.tableIds();
report(order[0] === 'junctions' && order[1] === 'reservoirs' && order[2] === 'tanks',
	'the table order this harness assumes is the real one', JSON.stringify(order));

console.log('\n--- 1. Ctrl+Shift+PageDown moves to the NEXT table; plain Ctrl+PageDown does not ---');
{
	const undone = pressPageKey('junctions', 'PageDown', { shift: false });
	report(!undone, 'plain Ctrl+PageDown (no Shift) is left for the browser -- not claimed');
	report(L.activeTab() === 'junctions', 'and the tab did not move', L.activeTab());
	const claimed = pressPageKey('junctions', 'PageDown', { shift: true });
	report(claimed, 'Ctrl+Shift+PageDown is claimed');
	report(L.activeTab() === 'reservoirs', 'the tab moved to the next table, Reservoirs', L.activeTab());
}

console.log('\n--- 2. Ctrl+Shift+PageUp moves back to the PREVIOUS table ---');
{
	const claimed = pressPageKey('reservoirs', 'PageUp', { shift: true });
	report(claimed, 'Ctrl+Shift+PageUp is claimed');
	report(L.activeTab() === 'junctions', 'the tab moved back to Junctions', L.activeTab());
}

console.log('\n--- 3. Excel does not wrap: PageUp on the first table is a no-op ---');
{
	report(L.activeTab() === 'junctions', 'starting on the first table, Junctions');
	const claimed = pressPageKey('junctions', 'PageUp', { shift: true });
	report(claimed, 'the keystroke is still claimed (never reaches the browser)');
	report(L.activeTab() === 'junctions', 'but the tab did not wrap to the last table', L.activeTab());
}

console.log('\n--- 4. Excel does not wrap: PageDown on the last table is a no-op ---');
{
	L.setPaneTab(order[order.length - 1]);
	report(L.activeTab() === order[order.length - 1], 'starting on the last table', L.activeTab());
	const claimed = pressPageKey(order[order.length - 1], 'PageDown', { shift: true });
	report(claimed, 'the keystroke is still claimed');
	report(L.activeTab() === order[order.length - 1], 'but the tab did not wrap to the first table', L.activeTab());
	L.setPaneTab('junctions');
}

console.log('\n--- 5. focus lands on the SAME COLUMN if it exists, else the FIRST column ---');
{
	// "elev" exists in both Junctions and Reservoirs -- the switch keeps it.
	L.selectBox('junctions', 'elev', 'elev', 0, 0);
	L.focusable('junctions', jIds[0], 'elev').focus();
	pressPageKey('junctions', 'PageDown', { shift: true });
	const at1 = L.focused('reservoirs');
	report(!!at1 && at1.key === 'elev', 'landed on "elev" in Reservoirs, the shared column', JSON.stringify(at1));
	L.setPaneTab('junctions');

	// "demand" exists only in Junctions -- Reservoirs has no such column, so the switch falls
	// back to the first column, "id".
	L.selectBox('junctions', 'demand', 'demand', 0, 0);
	L.focusable('junctions', jIds[0], 'demand').focus();
	pressPageKey('junctions', 'PageDown', { shift: true });
	const at2 = L.focused('reservoirs');
	report(!!at2 && at2.key === 'id', 'no "demand" column in Reservoirs -- landed on the first column, "id"', JSON.stringify(at2));
	L.setPaneTab('junctions');
}

console.log('\n--- 6. focus lands on the SAME ROW INDEX, clamped to the destination row count ---');
{
	// Row index 3 (the 4th of Junctions' 5 rows) -- Reservoirs has only 1 row, so the row index
	// clamps to 0, the last (and only) row it has, never to an index that does not exist.
	L.selectBox('junctions', 'elev', 'elev', 3, 3);
	L.focusable('junctions', jIds[3], 'elev').focus();
	pressPageKey('junctions', 'PageDown', { shift: true });
	const resOrder = L.tableOrder('reservoirs');
	const at = L.focused('reservoirs');
	report(!!at && at.id === resOrder[0], 'row index 3 clamped down to Reservoirs\' only row', JSON.stringify(at));
	L.setPaneTab('junctions');

	// No clamp is needed when the destination has room: Tanks' row index 1 (the second and last
	// of its 2 rows) is still a valid index in Pipes' 2 rows, so it carries over unchanged. "tag"
	// is a column both tables have (Pipes has no "elev").
	L.setPaneTab('tanks');
	const tankOrder = L.tableOrder('tanks');
	L.selectBox('tanks', 'tag', 'tag', 1, 1);
	L.focusable('tanks', tankOrder[1], 'tag').focus();
	pressPageKey('tanks', 'PageDown', { shift: true });
	const pipeOrder = L.tableOrder('pipes');
	const at2 = L.focused('pipes');
	report(!!at2 && at2.id === pipeOrder[1] && at2.key === 'tag',
		'row index 1 carries over unchanged on "tag" -- no clamp needed', JSON.stringify(at2));
	L.setPaneTab('junctions');
}

console.log('\n--- 7. scoped to the data tables only -- never Time series or Profile ---');
{
	const tabs = L.tabIds();
	report(tabs.indexOf('timeseries') > order.length - 1 && tabs.indexOf('profile') > order.length - 1,
		'Time series and Profile sit after the data tables on the strip', JSON.stringify(tabs));
	// From the LAST data table, PageDown must stay there, never step onto Time series.
	L.setPaneTab(order[order.length - 1]);
	pressPageKey(order[order.length - 1], 'PageDown', { shift: true });
	report(L.activeTab() === order[order.length - 1],
		'PageDown from the last data table does not advance onto Time series', L.activeTab());
	L.setPaneTab('junctions');
}

console.log('\n--- 8. mid-edit, the typed value is committed before the switch, never lost ---');
{
	L.selectBox('junctions', 'elev', 'elev', 0, 0);
	const box = L.focusable('junctions', jIds[0], 'elev');
	box.focus();
	L.enterEdit(box, true);
	box.value = '777';
	pressPageKey('junctions', 'PageDown', { shift: true });
	report(L.cellText('junctions', jIds[0], 'elev') === '777',
		'the typed-but-uncommitted "777" landed in the model, not lost', L.cellText('junctions', jIds[0], 'elev'));
	report(L.activeTab() === 'reservoirs', 'and the switch still happened');
	L.setPaneTab('junctions');
}

console.log(`\n${failures ? 'FAILURES' : 'all pass'}: ${checks - failures}/${checks}`);
process.exit(failures ? 1 : 0);
