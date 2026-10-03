// CTRL+SHIFT+PAGEDOWN/PAGEUP SWITCHES TABLES, AND NOW THE GRAPH TABS TOO -- ROADMAP Task 690
// ("Ctrl+Shift+PageUp/PageDn between tables") extended by Task 743 (Tom: "It would be nice if it
// also could proceed to the graphs."). Run with:
//   node dev/lpn-spike/pane-tableswitch-harness.js
//
// What matters enough to assert headlessly:
//
//   1. Ctrl+Shift+PageDown moves to the NEXT table in paneTables() order; Ctrl+Shift+PageUp moves
//      back. Plain Ctrl+PageDown/PageUp (no Shift) is left untouched -- that combination is the
//      BROWSER's own tab switch and must not be claimed.
//   2. Excel does not wrap at the ends, so neither does this: PageUp on the first tab and
//      PageDown on the last are both no-ops (the keystroke is still claimed). Task 743 moves
//      which tab is "the last" -- Profile, not Customers -- without changing the rule.
//   3. Focus lands on the SAME COLUMN KEY if the destination table has one (Junctions' and
//      Reservoirs' shared "elev"); otherwise the FIRST column (Junctions' "demand", which
//      Reservoirs has no column for, falls back to "id").
//   4. Focus lands on the SAME ROW INDEX, clamped to the destination table's row count.
//   5. **(Task 743) THE STEP NOW WALKS THE WHOLE STRIP** (`paneTabs`, not only `paneTables()`):
//      from the last table it proceeds onto Time series, then Frequency, then Profile, and back.
//      A graph/profile tab carries no column or row across the boundary in either direction --
//      there is nothing to carry -- so a table reached FROM a graph opens at its home cell.
//   6. **A GRAPH OR PROFILE TAB LANDS THE CARET ON ITS OWN FIRST CONTROL** (its group/quantity
//      `<select>`, or Profile's Edit button), so the NEXT press still has a keydown listener to
//      answer -- and the listener lives on the TAB'S PANEL, not on the control, so it still fires
//      with focus inside a `<select>`, which would otherwise page its own option list.
//   7. Mid-edit, the typed-but-not-yet-committed value is committed before the switch, so no
//      text is lost -- the same choice Enter and the arrow keys make.
//   8. **AN EMPTY TABLE STILL ANSWERS THE SHORTCUT** (Perry's pre-review finding on b37ec130):
//      Pumps, Valves, Text and Customers are left with no rows at all in this harness -- a real
//      network commonly has empty asset tables (Net3 has no valves) -- and the shortcut must
//      still work FROM one of them, in both directions, including walking straight through
//      several empty tables in a row, and the "none of these yet" note is where the caret lands
//      so the NEXT press still has something to answer it.
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
	// Which element the caret landed on, by id -- a graph or profile tab has no cell grid, so this
	// is how the test asks "did the step land somewhere sensible" without reaching into the tab's
	// own private rendering functions.
	"\t\tfocusedId: function () { var el = document.activeElement; return el ? el.id : null; },\n" +
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

function fire(el, type, ev) {
	((el && el._listeners && el._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}
// **THE ELEMENT THE LISTENER LIVES ON, NOT A FIXED TAG** -- a table with rows carries the key
// handler on its <table> (paneWireTable); an EMPTY table has no <table> at all (renderPaneTable()
// draws its "none of these yet" note instead) and carries it on THAT; a graph or profile tab
// (Task 743) carries it on the PANEL ITSELF (wireGraphTabKeys()), never on a control inside it --
// so a press fired here with the caret sitting in a `<select>` is exactly the case that matters:
// the listener still answers even though the control it landed on has its own idea of PageDown.
// The stub's fire() does not simulate bubbling (nor does any other harness here rely on that), so
// the target has to be whichever one is really standing in the panel right now.
function keyOwnerEl(id) {
	const host = byId['lpn_pane_' + id];
	if (!host || !host.children) { return null; }
	const table = host.children.filter((c) => c._tag === 'table')[0];
	if (table) { return table; }
	const note = host.children.filter((c) => c._tag === 'p')[0];
	return note || host;
}
function pressPageKey(id, key, opts) {
	let prevented = false;
	const o = opts || {};
	fire(keyOwnerEl(id), 'keydown', { key: key, shiftKey: !!o.shift, ctrlKey: o.ctrl !== false,
		metaKey: false, altKey: false, preventDefault: function () { prevented = true; } });
	return prevented;
}
// Is the caret standing on TABLE id's own empty-state note (renderPaneTable's ".lpn-lib-note"),
// as opposed to nothing, or a leftover element from some other panel?
function focusedIsEmptyNoteOf(id) {
	const host = byId['lpn_pane_' + id], el = document.activeElement;
	return !!(host && el && host.children && host.children.indexOf(el) !== -1 &&
		el.className && el.className.indexOf('lpn-lib-note') !== -1);
}

const jIds = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0), L.addNode('junction', 20, 0),
	L.addNode('junction', 30, 0), L.addNode('junction', 40, 0)].map((n) => n.id);
jIds.forEach((id, i) => { L.setCell('junctions', id, 'elev', 100 + i); L.setCell('junctions', id, 'demand', i); });
const rIds = [L.addNode('reservoir', 0, 100)].map((n) => n.id);
L.setCell('reservoirs', rIds[0], 'elev', 500);
const tIds = [L.addNode('tank', 0, 200), L.addNode('tank', 10, 200)].map((n) => n.id);
tIds.forEach((id, i) => { L.setCell('tanks', id, 'elev', 300 + i); });
L.addLink('pipe', jIds[0], jIds[1]);
L.addLink('pipe', jIds[2], jIds[3]);
// **PUMPS, VALVES, TEXT AND CUSTOMERS ARE LEFT EMPTY, DELIBERATELY.** A real network commonly
// has empty asset tables -- EPANET's own Net3 has no valves -- and that is precisely the case
// Perry's pre-review caught going dead on b37ec130: an empty CURRENT table left nothing in its
// panel the keyboard could reach, so the shortcut was never claimed and the tab never moved.
// Four of them in a row, at the END of the strip, also exercises "walk through several empty
// tables" and "the no-wrap boundary is now a genuinely EMPTY last table", not a stand-in for one.

L.openPane('junctions');
['junctions', 'reservoirs', 'tanks', 'pipes', 'pumps', 'valves', 'text', 'customers']
	.forEach((id) => L.renderTable(id));

const order = L.tableIds();
report(order.join(',') === 'junctions,reservoirs,tanks,pipes,pumps,valves,text,customers',
	'the table order this harness assumes is the real one', JSON.stringify(order));

console.log('\n--- 1. Ctrl+Shift+PageDown moves to the NEXT table; plain Ctrl+PageDown does not ---');
{
	L.setPaneTab('junctions');
	L.selectBox('junctions', 'elev', 'elev', 0, 0);
	L.focusable('junctions', jIds[0], 'elev').focus();
	const undone = pressPageKey(L.activeTab(), 'PageDown', { shift: false });
	report(!undone, 'plain Ctrl+PageDown (no Shift) is left for the browser -- not claimed');
	report(L.activeTab() === 'junctions', 'and the tab did not move', L.activeTab());
	const claimed = pressPageKey(L.activeTab(), 'PageDown', { shift: true });
	report(claimed, 'Ctrl+Shift+PageDown is claimed');
	report(L.activeTab() === 'reservoirs', 'the tab moved to the next table, Reservoirs', L.activeTab());
}

console.log('\n--- 2. Ctrl+Shift+PageUp moves back to the PREVIOUS table ---');
{
	const claimed = pressPageKey(L.activeTab(), 'PageUp', { shift: true });
	report(claimed, 'Ctrl+Shift+PageUp is claimed');
	report(L.activeTab() === 'junctions', 'the tab moved back to Junctions', L.activeTab());
}

console.log('\n--- 3. Excel does not wrap: PageUp on the first table is a no-op ---');
{
	report(L.activeTab() === 'junctions', 'starting on the first table, Junctions');
	const claimed = pressPageKey(L.activeTab(), 'PageUp', { shift: true });
	report(claimed, 'the keystroke is still claimed (never reaches the browser)');
	report(L.activeTab() === 'junctions', 'but the tab did not wrap to the last table', L.activeTab());
}

console.log('\n--- 4. focus lands on the SAME COLUMN if it exists, else the FIRST column ---');
{
	// "elev" exists in both Junctions and Reservoirs -- the switch keeps it.
	L.selectBox('junctions', 'elev', 'elev', 0, 0);
	L.focusable('junctions', jIds[0], 'elev').focus();
	pressPageKey(L.activeTab(), 'PageDown', { shift: true });
	const at1 = L.focused('reservoirs');
	report(!!at1 && at1.key === 'elev', 'landed on "elev" in Reservoirs, the shared column', JSON.stringify(at1));
	L.setPaneTab('junctions');

	// "demand" exists only in Junctions -- Reservoirs has no such column, so the switch falls
	// back to the first column, "id".
	L.selectBox('junctions', 'demand', 'demand', 0, 0);
	L.focusable('junctions', jIds[0], 'demand').focus();
	pressPageKey(L.activeTab(), 'PageDown', { shift: true });
	const at2 = L.focused('reservoirs');
	report(!!at2 && at2.key === 'id', 'no "demand" column in Reservoirs -- landed on the first column, "id"', JSON.stringify(at2));
	L.setPaneTab('junctions');
}

console.log('\n--- 5. focus lands on the SAME ROW INDEX, clamped to the destination row count ---');
{
	// Row index 3 (the 4th of Junctions' 5 rows) -- Reservoirs has only 1 row, so the row index
	// clamps to 0, the last (and only) row it has, never to an index that does not exist.
	L.selectBox('junctions', 'elev', 'elev', 3, 3);
	L.focusable('junctions', jIds[3], 'elev').focus();
	pressPageKey(L.activeTab(), 'PageDown', { shift: true });
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
	pressPageKey(L.activeTab(), 'PageDown', { shift: true });
	const pipeOrder = L.tableOrder('pipes');
	const at2 = L.focused('pipes');
	report(!!at2 && at2.id === pipeOrder[1] && at2.key === 'tag',
		'row index 1 carries over unchanged on "tag" -- no clamp needed', JSON.stringify(at2));
	L.setPaneTab('junctions');
}

console.log('\n--- 6. the tab order this harness assumes for stepping onto the graph tabs ---');
{
	// Task 743: the strip's visual order is the eight tables, then Time series, then Frequency,
	// then Profile -- the whole thing is now one walk, not two.
	const tabs = L.tabIds();
	report(tabs.join(',') === order.join(',') + ',timeseries,frequency,sysflow,profile',
		'tables, then Time series, Frequency, Flow balance, then Profile, in that order', JSON.stringify(tabs));
}

console.log('\n--- 7. mid-edit, the typed value is committed before the switch, never lost ---');
{
	L.selectBox('junctions', 'elev', 'elev', 0, 0);
	const box = L.focusable('junctions', jIds[0], 'elev');
	box.focus();
	L.enterEdit(box, true);
	box.value = '777';
	pressPageKey(L.activeTab(), 'PageDown', { shift: true });
	report(L.cellText('junctions', jIds[0], 'elev') === '777',
		'the typed-but-uncommitted "777" landed in the model, not lost', L.cellText('junctions', jIds[0], 'elev'));
	report(L.activeTab() === 'reservoirs', 'and the switch still happened');
	L.setPaneTab('junctions');
}

console.log('\n--- 8. an EMPTY table still answers the shortcut, in both directions ---');
{
	// Pipes (2 real rows) -> Pumps (empty): the switch still fires from a non-empty table INTO
	// an empty one, and something in the empty panel has to catch the caret.
	L.setPaneTab('pipes');
	const pipeOrder = L.tableOrder('pipes');
	L.selectBox('pipes', 'tag', 'tag', 0, 0);
	L.focusable('pipes', pipeOrder[0], 'tag').focus();
	const claimed1 = pressPageKey(L.activeTab(), 'PageDown', { shift: true });
	report(claimed1, 'Ctrl+Shift+PageDown out of a full table is claimed');
	report(L.activeTab() === 'pumps', 'the tab moved to Pumps, which has no rows', L.activeTab());
	report(focusedIsEmptyNoteOf('pumps'),
		'the caret landed on Pumps\' "none of these yet" note -- somewhere sensible to keep going');

	// FROM that empty table, PageDown keeps going: Pumps -> Valves, both empty.
	const claimed2 = pressPageKey(L.activeTab(), 'PageDown', { shift: true });
	report(claimed2, 'Ctrl+Shift+PageDown FROM an empty table (Pumps) is claimed');
	report(L.activeTab() === 'valves', 'the tab moved on to Valves, also empty', L.activeTab());
	report(focusedIsEmptyNoteOf('valves'), 'and the caret landed on Valves\' own empty-state note');

	// Walk the rest of the strip: Valves -> Text -> Customers, all empty, one keystroke apiece --
	// several empty tables in a row, not just one.
	pressPageKey(L.activeTab(), 'PageDown', { shift: true });
	report(L.activeTab() === 'text', 'Valves -> Text', L.activeTab());
	report(focusedIsEmptyNoteOf('text'), 'landed on Text\'s own empty-state note');
	pressPageKey(L.activeTab(), 'PageDown', { shift: true });
	report(L.activeTab() === 'customers', 'Text -> Customers, the LAST table', L.activeTab());
	report(focusedIsEmptyNoteOf('customers'), 'landed on Customers\' own empty-state note');

	// **Customers IS NO LONGER THE END OF THE STRIP (Task 743)** -- Time series, Frequency and
	// Profile follow it, so one more PageDown from here is no longer a no-op; section 9 below
	// picks the walk up from exactly this tab and follows it onto the graphs.

	// FROM an empty table, PageUp works too, walking back into a table that has real rows.
	const claimed4 = pressPageKey(L.activeTab(), 'PageUp', { shift: true });
	report(claimed4, 'Ctrl+Shift+PageUp FROM an empty table (Customers) is claimed');
	report(L.activeTab() === 'text', 'Customers -> Text', L.activeTab());
	pressPageKey(L.activeTab(), 'PageUp', { shift: true });
	pressPageKey(L.activeTab(), 'PageUp', { shift: true });   // text -> valves -> pumps
	report(L.activeTab() === 'pumps', 'walked back through Valves to Pumps', L.activeTab());
	const claimed5 = pressPageKey(L.activeTab(), 'PageUp', { shift: true });
	report(claimed5, 'Ctrl+Shift+PageUp from Pumps (empty) back into Pipes (real rows) is claimed');
	report(L.activeTab() === 'pipes', 'landed back on Pipes', L.activeTab());
	const at = L.focused('pipes');
	report(!!at && at.id === pipeOrder[0] && at.key === 'id',
		'with nothing to carry from an empty source, focus falls back to the first cell, row 0 / "id"',
		JSON.stringify(at));
	L.setPaneTab('junctions');
}

console.log('\n--- 9. (Task 743) stepping onward from the last TABLE onto the graph tabs, and back ---');
{
	// Customers is the last of the eight tables; the next three presses now reach Time series,
	// Frequency and Profile in turn, each one landing on ITS OWN first control.
	L.setPaneTab('customers');
	const claimed1 = pressPageKey('customers', 'PageDown', { shift: true });
	report(claimed1, 'Ctrl+Shift+PageDown out of Customers (the last table) is claimed');
	report(L.activeTab() === 'timeseries', 'the tab moved onto Time series', L.activeTab());
	report(L.focusedId() === 'lpn_ts_group',
		'and the caret landed on Time series\' own first control, its group picker', L.focusedId());

	// **THE CARET IS ACTUALLY INSIDE THE `<select>` RIGHT NOW** -- a real browser lets a focused
	// `<select>` page its own option list on PageDown, so this press is the one this whole feature
	// depends on: the listener lives on the PANEL (keyOwnerEl() falls back to it, finding no
	// <table> or <p> child), never on the control, and still answers with focus down inside one.
	report(L.focusedId() === 'lpn_ts_group', 'the caret is inside the group <select>, not on the panel');
	const claimed2 = pressPageKey('timeseries', 'PageDown', { shift: true });
	report(claimed2, 'Ctrl+Shift+PageDown FROM Time series is claimed, with focus still inside the <select>');
	report(L.activeTab() === 'frequency', 'the tab moved on to Frequency', L.activeTab());
	report(L.focusedId() === 'lpn_freq_group',
		'and landed on Frequency\'s own first control, its group picker', L.focusedId());

	const claimed3 = pressPageKey('frequency', 'PageDown', { shift: true });
	report(claimed3, 'Ctrl+Shift+PageDown FROM Frequency is claimed');
	report(L.activeTab() === 'sysflow', 'the tab moved on to Flow balance', L.activeTab());
	// System flow has no controls at all, so focus lands on its panel -- which is where the key
	// listener lives, so the next press still steps.
	report(L.focusedId() === 'lpn_pane_sysflow',
		'and, with no control of its own, focus landed on its panel', L.focusedId());
	const claimed3b = pressPageKey('sysflow', 'PageDown', { shift: true });
	report(claimed3b, 'Ctrl+Shift+PageDown FROM Flow balance is claimed');
	report(L.activeTab() === 'profile', 'the tab moved on to Profile, the LAST tab on the strip', L.activeTab());
	report(L.focusedId() === 'lpn_profile_edit_btn',
		'and landed on Profile\'s own first (and only) control, its Edit button', L.focusedId());

	// Excel's own rule, now against the TRUE last tab: one more PageDown is still claimed, but
	// nothing moves.
	const claimed4 = pressPageKey('profile', 'PageDown', { shift: true });
	report(claimed4, 'PageDown on Profile, the true last tab, is still claimed');
	report(L.activeTab() === 'profile', 'but it does not wrap to Junctions', L.activeTab());

	// And back, the whole way: Profile -> Frequency -> Time series -> Customers.
	const back1 = pressPageKey('profile', 'PageUp', { shift: true });
	report(back1, 'Ctrl+Shift+PageUp FROM Profile is claimed');
	report(L.activeTab() === 'sysflow', 'Profile -> Flow balance', L.activeTab());
	pressPageKey('sysflow', 'PageUp', { shift: true });
	report(L.activeTab() === 'frequency', 'Flow balance -> Frequency', L.activeTab());
	report(L.focusedId() === 'lpn_freq_group', 'landing again on Frequency\'s first control', L.focusedId());

	pressPageKey('frequency', 'PageUp', { shift: true });
	report(L.activeTab() === 'timeseries', 'Frequency -> Time series', L.activeTab());
	report(L.focusedId() === 'lpn_ts_group', 'landing again on Time series\' first control', L.focusedId());

	const back3 = pressPageKey('timeseries', 'PageUp', { shift: true });
	report(back3, 'Ctrl+Shift+PageUp FROM Time series is claimed');
	report(L.activeTab() === 'customers', 'Time series -> Customers, back among the tables', L.activeTab());
	// **A GRAPH TAB CARRIES NO COLUMN OR ROW ACROSS** -- landing back in a table finds `colKey`
	// null exactly as an empty-table SOURCE already does (section 8), so it takes the same "home
	// column" path proven there and in section 4; Customers being empty in this harness means the
	// visible proof here is the same empty-state note section 8 already checked.
	report(focusedIsEmptyNoteOf('customers'),
		'landed on Customers\' own empty-state note, the same door an empty table always answers on');
	L.setPaneTab('junctions');
}

console.log('\n--- 10. plain Ctrl+PageDown (no Shift) inside a graph tab is still left for the browser ---');
{
	L.setPaneTab('timeseries');
	const undone = pressPageKey('timeseries', 'PageDown', { shift: false });
	report(!undone, 'plain Ctrl+PageDown inside Time series is not claimed either');
	report(L.activeTab() === 'timeseries', 'and the tab did not move', L.activeTab());
	L.setPaneTab('junctions');
}

console.log(`\n${failures ? 'FAILURES' : 'all pass'}: ${checks - failures}/${checks}`);
process.exit(failures ? 1 : 0);
