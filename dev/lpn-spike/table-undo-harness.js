// UNDO WORKS INSIDE A TABLE, NOT ONLY ON THE MAP -- ROADMAP Task 689. Run with:
//   node dev/lpn-spike/table-undo-harness.js
//
// **WHY THIS EXISTS.** Tom, 2026-09-17, testing the Junctions table: *"I can copy and paste from
// two cells to two cells. But I can't Ctrl+Z within the table. I must move cursor to the map for
// Ctrl+Z to work."* The undo EXISTED and the table could not reach it, which is worse than having
// none: a person who has learned that Ctrl+Z works on this page presses it after a bad paste and
// nothing happens, with nothing on screen to say why.
//
// **THE CAUSE WAS A CORRECT GUARD APPLIED ONE CASE TOO WIDELY.** The map's Ctrl+Z listener turns
// away any event whose target is a text entry -- Tom's own 2026-08-20 point about the Library
// fields, where undoing the whole map because somebody wanted the last word back is worse than not
// undoing at all. Every pane cell is an `<input>`, so the whole bottom pane sat behind that guard.
//
// **THE RULE UNDER TEST, in one line: native undo while a cell editor is OPEN, project undo when it
// is not.** That is not a new state -- the table already models it, and `readOnly` is the mechanism
// rather than a flag: a cell is read-only in NAVIGATION mode and writable only once F2, a
// double-click or a printable character has opened the editor (Task 186). So this harness drives
// paneEnterEdit()/paneCancelEdit(), the page's own doors, and never assigns `readOnly` itself --
// setting by hand the very thing under test is how a stub makes a harness pass for the wrong reason.
//
// **THE FOUR WAYS THIS GOES WRONG, which is the shape of the sections below:**
//   1. It never worked at all -- the old defect, restored by reverting one guard.
//   2. It works TOO WELL and eats the text undo inside an open cell editor, which is Tom's 2026-08-20
//      complaint coming back by the other door.
//   3. It leaks: a popup field, the Library boxes, Settings -- every ordinary input on the page must
//      keep the browser's own undo.
//   4. The document goes back and the TABLE does not, which from the outside is indistinguishable
//      from an undo that did nothing. That is exactly the library-box defect of Task 611, and this
//      asserts the cell text, not the document.

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
	"\t\tpaneTableById: paneTableById, openPane: openPane, paneIsOpen: paneIsOpen,\n" +
	"\t\tactivePaneTableSpec: activePaneTableSpec,\n" +
	"\t\tsortTable: function (id, col) { sortPaneTable(paneTableById(id), col); },\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\ttableCols: function (id) { return paneCols(paneTableById(id)); },\n" +
	"\t\tcells: function (id) { return paneTableById(id).cells; },\n" +
	"\t\tsetCell: function (id, elId, key, v) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\tpaneColByKey(s, key).set(el, v); },\n" +
	"\t\tcellText: function (id, elId, key) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\treturn paneCellText(paneColByKey(s, key), el); },\n" +
	"\t\tinEdit: paneInEdit, enterEdit: paneEnterEdit, cancelEdit: paneCancelEdit,\n" +
	"\t\tnavigating: paneCellNavigating,\n" +
	"\t\tsaveUndoSnapshot: saveUndoSnapshot, undo: undo,\n" +
	"\t\tundoDepth: function () { return undoStack.length; },\n" +
	"\t\tgetMode: function () { return mode; }, setMode: setMode,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

const pc = (global.EngCalcs && global.EngCalcs.pageConfig) || {};

// The page's own document-level keydown listeners, driven the way a browser drives them. Nothing
// here reaches past a listener the page installed on `document` itself.
function press(key, mod) {
	const e = Object.assign({
		key: key, target: null, ctrlKey: false, metaKey: false, altKey: false, shiftKey: false,
		preventDefault: function () { this._prevented = true; }
	}, mod || {});
	(global.document._listeners.keydown || []).slice().forEach((f) => f(e));
	return e;
}
function ctrlZ(target) { return press('z', { ctrlKey: true, target: target || null }); }

// ---- the network under the table --------------------------------------------------------------
const ids = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0), L.addNode('junction', 20, 0)]
	.map((n) => n.id);
// A demand on every junction, not because this harness is about demands but because a map label
// prints one: undo() rebuilds the whole drawing, and a junction that states no demand at all is a
// document the page itself never makes.
ids.forEach((id, i) => { L.setCell('junctions', id, 'elev', 100 + i); L.setCell('junctions', id, 'demand', 10 + i); });
// **THE PANE IS OPEN, because that is the only state this task is about.** A person pressing Ctrl+Z
// with the caret in a cell is by definition looking at the table; refreshPaneIfOpen() returns at its
// first line otherwise, and a harness that left the pane shut would be asserting the wrong branch.
L.openPane('junctions');
L.renderTable('junctions');
const cellOf = (elId, key) => L.cells('junctions')[elId][key];

console.log('\n--- 0. the harness is looking at a real table ---');
{
	const c = cellOf(ids[0], 'elev');
	report(!!c && c.tagName === 'INPUT', 'the elevation cell is a rendered <input>', c && c.tagName);
	report(c.readOnly === true, '...read-only, which is NAVIGATION mode and the whole mechanism');
	report(!!c._lpnCell, '...and it carries the cell context every pane control carries');
	// The heading comes from the language file through pageConfig, never from a literal here.
	report(typeof pc.lpn_field_elev === 'string' && pc.lpn_field_elev.length > 0,
		'and the column it is in is the one lpn_field_elev names', pc.lpn_field_elev);
}

console.log('\n--- 1. Ctrl+Z INSIDE THE TABLE UNDOES THE TABLE EDIT (Task 689) ---');
{
	const cell = cellOf(ids[0], 'elev');
	const before = L.cellText('junctions', ids[0], 'elev');
	L.saveUndoSnapshot();
	L.setCell('junctions', ids[0], 'elev', 999);
	L.renderTable('junctions');
	report(L.cellText('junctions', ids[0], 'elev') !== before, 'an edit landed', L.cellText('junctions', ids[0], 'elev'));
	const depth = L.undoDepth();
	const e = ctrlZ(cell);
	report(L.undoDepth() === depth - 1, 'Ctrl+Z with the caret in a navigating cell pops the undo stack',
		depth + ' -> ' + L.undoDepth());
	report(L.cellText('junctions', ids[0], 'elev') === before, '...and the document is back', L.cellText('junctions', ids[0], 'elev'));
	report(e._prevented === true, '...and the browser does not also get the key');
	// 4. THE TABLE ITSELF, not just the document. An undo the user cannot see is an undo that did
	// nothing, which is the Task 611 library-box defect in the pane.
	report(cellOf(ids[0], 'elev').value === before, 'and the CELL shows the restored value',
		cellOf(ids[0], 'elev').value);
}

console.log('\n--- 2. AN OPEN CELL EDITOR KEEPS THE BROWSER\'S OWN TEXT UNDO ---');
{
	const cell = cellOf(ids[1], 'elev');
	report(L.enterEdit(cell, false) === true, 'F2 / double-click opens the editor through the page\'s own door');
	report(L.inEdit(cell) === true, '...so the cell is in EDIT mode');
	report(L.navigating(cell) === false, '...and is therefore not a navigating cell');
	const depth = L.undoDepth();
	const e = ctrlZ(cell);
	report(L.undoDepth() === depth, 'Ctrl+Z while typing in a cell does NOT undo the project', depth + ' -> ' + L.undoDepth());
	report(e._prevented !== true, '...and the keystroke is left to the browser, which is the text undo');
	L.cancelEdit(cell);
	report(L.navigating(cell) === true, 'Escape puts the cell back into navigation mode');
	const d2 = L.undoDepth();
	ctrlZ(cell);
	report(L.undoDepth() === d2 - 1 || d2 === 0, '...where Ctrl+Z is the project undo again', d2 + ' -> ' + L.undoDepth());
}

console.log('\n--- 3. EVERY OTHER INPUT ON THE PAGE KEEPS ITS NATIVE UNDO (Tom, 2026-08-20) ---');
{
	// A popup field, a Library box, a Settings number: an ordinary input with no cell context.
	[['input', {}], ['textarea', {}], ['select', {}], ['div', { isContentEditable: true }]]
		.forEach(function (pair) {
			const depth = L.undoDepth();
			const e = ctrlZ(Object.assign({ tagName: pair[0].toUpperCase() }, pair[1]));
			report(L.undoDepth() === depth, `Ctrl+Z in a <${pair[0]}> that is not a table cell leaves the project alone`,
				depth + ' -> ' + L.undoDepth());
			report(e._prevented !== true, `...and the <${pair[0]}> keeps the keystroke`);
		});
	// And with nothing focused at all -- the map case, which must not have been traded away.
	L.saveUndoSnapshot();
	const depth = L.undoDepth();
	ctrlZ(null);
	report(L.undoDepth() === depth - 1, 'Ctrl+Z over the map still undoes, which is what worked before',
		depth + ' -> ' + L.undoDepth());
}

console.log('\n--- 4. A CHECKBOX CELL AND A CHOICE CELL ARE NEVER "BEING TYPED IN" ---');
{
	// The Active column is a checkbox and carries _lpnCell like every other control in the table.
	// paneInEdit() is deliberately false for both, so both take the project undo.
	const box = cellOf(ids[0], 'active');
	report(!!box && !!box._lpnCell, 'the Active cell is a pane control', box && box.tagName);
	report(L.inEdit(box) === false, '...that is never in edit mode');
	report(L.navigating(box) === true, '...and therefore always navigating');
	L.saveUndoSnapshot();
	const depth = L.undoDepth();
	ctrlZ(box);
	report(L.undoDepth() === depth - 1, 'so Ctrl+Z on it undoes the project', depth + ' -> ' + L.undoDepth());
}

console.log('\n--- 5. NOTHING ELSE CHANGED: a bare digit on a cell still does not pick a tool ---');
{
	// Task 595's tool keys keep the plain isTextEntry() guard: in navigation mode a printable
	// character OVERWRITES the cell (Task 186), so a digit must not also switch the toolbar.
	L.setMode('select');
	press('2', { target: cellOf(ids[0], 'elev') });
	report(L.getMode() === 'select', 'a digit typed at a navigating cell leaves the tool alone', L.getMode());
	L.setMode('select');
	press('2');
	report(L.getMode() === 'add-junction', '...while the same digit with nothing focused still picks the tool', L.getMode());
	L.setMode('select');
}

console.log('\n--- 6. THERE IS ONE SET OF TABLE SPECS, NOT TWO ---');
{
	// Found while making section 1 pass. `var paneTablesCache = null;` sat BELOW the paneTabs block
	// that fills it, so it re-ran at load and wiped it: the tab strip then rendered, sorted and
	// selected on one set of six specs while everything reaching a table by id got a second set.
	// The visible half was the Print button, which reads activePaneTableSpec() -- the paper came
	// out in id order however the reader had sorted the screen. Nothing on screen can say the two
	// doors disagree, so it is asserted here.
	L.sortTable('junctions', 'elev');
	const spec = L.activePaneTableSpec();
	report(!!spec && spec.sort.col === 'elev',
		'a sort made through paneTableById() is the sort the Print button reads',
		spec && spec.sort.col);
	report(spec === L.paneTableById('junctions'), '...because the two doors return one object');
}

console.log(`\n${failures ? 'FAILURES' : 'all pass'}: ${checks - failures}/${checks}`);
process.exit(failures ? 1 : 0);
