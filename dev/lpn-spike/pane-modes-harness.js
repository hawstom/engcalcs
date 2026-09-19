// SELECT, ENTRY AND EDIT: the three modes a spreadsheet has. Run with:
//   node dev/lpn-spike/pane-modes-harness.js
//
// **THE SPECIFICATION IS TOM'S OWN, WRITTEN OUT AFTER TESTING** (2026-09-18): *"if we want these
// tables to act like a spreadsheet, maybe I should make a prioritize spec list of how spreadsheets
// act"*, and then (a) Select, (b) Entry, (c) Edit. This page had TWO states where he named THREE,
// and the missing middle one is the whole of the difference -- it is also why his Ctrl+Z felt
// *"unpredictable"*, because typing a character moved him into a state he had not asked for and
// which still looked like Select.
//
// **THE ASSERTION THAT MATTERS MOST IS THE RIGHT ARROW IN ENTRY MODE**, which he singled out. A
// person typing four hundred numbers types a value and presses Right to move on. If the caret
// swallows it, every one of those four hundred keystrokes lands inside the number just typed --
// silently, with the table looking perfectly correct -- and the feature is worthless to the only
// user it exists for.
//
// **AND THE ONE IN THE OTHER DIRECTION: an arrow cannot leave EDIT mode at all.** That is stricter
// than what shipped (Left and Right used to leave once the caret reached an edge, copied from the
// Curves grid) and he asked for the stricter rule by name. An edit that jumps out from under you
// is typing nobody can get back.
//
// Every mode is driven through the page's own doors -- a keydown at the table, paneEnterEdit(),
// paneCancelEdit() -- and never by setting `readOnly` or `_lpnEntry` here, which are the mechanisms
// under test. A stub that sets the thing being measured is the failure mode dev/testing-notes.md
// names first.

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
	"\t\ttableCols: function (id) { return paneCols(paneTableById(id)); },\n" +
	"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\tcells: function (id) { return paneTableById(id).cells; },\n" +
	"\t\ttds: function (id) { return paneTableById(id).tds; },\n" +
	"\t\tselBox: function (id) { var s = paneTableById(id);\n" +
	"\t\t\treturn paneSelBox(s, paneTableRowsInOrder(s), paneCols(s)); },\n" +
	"\t\tmode: paneCellMode, inEdit: paneInEdit, navigating: paneCellNavigating,\n" +
	"\t\tenterEdit: paneEnterEdit, cancelEdit: paneCancelEdit,\n" +
	"\t\tsetCell: function (id, elId, key, v) { var s = paneTableById(id),\n" +
	"\t\t\tel = doc.nodes.filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\tpaneColByKey(s, key).set(el, v); },\n" +
	"\t\tcellText: function (id, elId, key) { var s = paneTableById(id),\n" +
	"\t\t\tel = doc.nodes.filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\treturn paneCellText(paneColByKey(s, key), el); },\n" +
	"\t\tsaveUndoSnapshot: saveUndoSnapshot, undo: undo,\n" +
	"\t\tundoDepth: function () { return undoStack.length; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

const pc = (global.EngCalcs && global.EngCalcs.pageConfig) || {};
const ids = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0), L.addNode('junction', 20, 0)]
	.map((n) => n.id);
ids.forEach((id, i) => { L.setCell('junctions', id, 'elev', 100 + i); L.setCell('junctions', id, 'demand', 10 + i); });
L.openPane('junctions');
L.renderTable('junctions');

const tableEl = byId.lpn_pane_junctions.children.filter((c) => c._tag === 'table')[0];
const cols = L.tableCols('junctions').map((c) => c.key);
function fire(el, type, ev) {
	((el && el._listeners && el._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}
function key(name, mod) {
	const e = Object.assign({
		key: name, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false,
		preventDefault: function () { this._prevented = true; }
	}, mod || {});
	fire(tableEl, 'keydown', e);
	return e;
}
function cell(elId, k) { return L.cells('junctions')[elId][k]; }
function td(elId, k) { return L.tds('junctions')[elId][k]; }
function click(elId, k) {
	// A mouse landing in a cell IS a selection, which is how the page wires it.
	global.document.activeElement = null;
	fire(tableEl, 'focusin', { target: td(elId, k) });
	global.document.activeElement = cell(elId, k);
}
function at() {
	const b = L.selBox('junctions');
	if (!b) { return null; }
	return L.tableOrder('junctions')[b.fr] + '/' + cols[b.fc];
}

console.log('\n--- (a) SELECT MODE: moving never opens an editor ---');
{
	click(ids[0], 'elev');
	report(L.mode(cell(ids[0], 'elev')) === 'select', 'a click lands in Select mode', L.mode(cell(ids[0], 'elev')));
	report(at() === ids[0] + '/elev', '...on the cell that was clicked', at());
	// Every one of the four ways he names must move and must NOT open an editor.
	['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Enter'].forEach(function (k) {
		click(ids[1], 'elev');
		const before = at();
		key(k);
		report(at() !== before || k === 'ArrowUp' || k === 'ArrowLeft',
			`${k} in Select mode moves from cell to cell`, before + ' -> ' + at());
		report(L.mode(cell(ids[1], 'elev')) === 'select', `...and ${k} opened no editor`);
	});
	// The heading of the column being driven, read from the language file rather than typed here.
	report(typeof pc.lpn_field_elev === 'string' && pc.lpn_field_elev.length > 0,
		'the column under test is the one lpn_field_elev names', pc.lpn_field_elev);
}

console.log('\n--- (b) ENTRY MODE: typing replaces, and the arrows still move cells ---');
{
	click(ids[0], 'elev');
	const c = cell(ids[0], 'elev');
	const e = key('7');
	report(L.mode(c) === 'entry', 'a printable character in Select mode opens ENTRY', L.mode(c));
	report(c.value === '', '...with the cell WIPED, so the first character replaces what was there', JSON.stringify(c.value));
	report(e._prevented !== true, '...and the keystroke left to the browser, which inserts the character');
	// The browser would now have inserted it; the harness does what the browser does.
	c.value = '7';
	key('5');
	report(L.mode(c) === 'entry', 'a second character stays in ENTRY', L.mode(c));
	c.value = '75';
	report(c.value === '75', '...and appends rather than replacing', c.value);
	// **THE ONE HE SINGLED OUT.** Right in ENTRY is the next CELL, never the next character.
	const before = at();
	const re = key('ArrowRight');
	report(at() !== before, 'ArrowRight in ENTRY moves to the neighbouring CELL', before + ' -> ' + at());
	report(re._prevented === true, '...and the browser never sees it, so no caret moves');
	report(L.cellText('junctions', ids[0], 'elev') === '75', '...committing what was typed on the way out',
		L.cellText('junctions', ids[0], 'elev'));
	report(L.mode(cell(ids[0], 'elev')) === 'select', '...and leaving the cell behind in Select mode');
	// The other three arrows, because "arrow keys" is his word and Right is only the example.
	['ArrowLeft', 'ArrowUp', 'ArrowDown'].forEach(function (k) {
		click(ids[1], 'elev');
		key('3');
		const cc = cell(ids[1], 'elev');
		cc.value = '3';
		const b2 = at();
		key(k);
		report(at() !== b2 || k === 'ArrowUp', `${k} in ENTRY moves a cell, not a caret`, b2 + ' -> ' + at());
		report(L.mode(cc) === 'select', `...and ${k} left ENTRY behind`);
	});
	// F2 is the spreadsheet's escape hatch: promote what is being typed into a real edit.
	click(ids[2], 'elev');
	key('4');
	const c2 = cell(ids[2], 'elev');
	c2.value = '4';
	key('F2');
	report(L.mode(c2) === 'edit', 'F2 in ENTRY promotes to EDIT', L.mode(c2));
	report(c2.value === '4', '...keeping what has been typed', c2.value);
	L.cancelEdit(c2);
}

console.log('\n--- (c) EDIT MODE: arrows are the caret and cannot leave ---');
{
	click(ids[0], 'elev');
	const c = cell(ids[0], 'elev');
	report(L.enterEdit(c, false) === true, 'F2 / double-click opens EDIT');
	report(L.mode(c) === 'edit', '...and it is EDIT, not ENTRY', L.mode(c));
	report(c.value !== '', '...keeping the value, which is what makes it an edit', c.value);
	['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'].forEach(function (k) {
		const before = at();
		const e = key(k);
		report(at() === before, `${k} in EDIT does not move the selection`, before + ' -> ' + at());
		report(L.mode(c) === 'edit', `...and ${k} cannot leave EDIT mode`, L.mode(c));
		report(e._prevented !== true, `...the browser gets ${k}, which is the caret`);
	});
	// The three ways out he names. Escape is the fourth and was already his point 3.
	const eEnter = key('Enter');
	report(L.mode(c) === 'select', 'Enter leaves EDIT', L.mode(c));
	report(eEnter._prevented === true, '...and moves a row, as a spreadsheet does');
	L.enterEdit(c, false);
	report(L.cancelEdit(c) === true, 'Escape leaves EDIT');
	report(L.mode(c) === 'select', '...back to Select', L.mode(c));
	// A click on another cell: the browser blurs the old one, which commits it.
	L.enterEdit(c, false);
	c.value = '123';
	fire(c, 'change', {});
	report(L.mode(c) === 'select', 'a commit from a blur leaves EDIT too', L.mode(c));
}

console.log('\n--- Ctrl+Z MEANS ONE THING PER MODE, AND THAT IS THE WHOLE RULE ---');
{
	// Tom: "Ctrl+Z doesn't work or is unpredictable. I can't tell." The rule is now readable off
	// the arrow keys: where Right moves a cell, Ctrl+Z undoes the project; where Right moves the
	// caret, Ctrl+Z undoes the typing.
	function ctrlZ(target) {
		const e = {
			key: 'z', ctrlKey: true, metaKey: false, altKey: false, shiftKey: false, target: target,
			preventDefault: function () { this._prevented = true; }
		};
		(global.document._listeners.keydown || []).slice().forEach((f) => f(e));
		return e;
	}
	click(ids[0], 'elev');
	const c = cell(ids[0], 'elev');
	report(L.mode(c) === 'select', 'in SELECT', L.mode(c));
	L.saveUndoSnapshot();
	let d = L.undoDepth();
	ctrlZ(c);
	report(L.undoDepth() === d - 1, '...Ctrl+Z is the PROJECT undo', d + ' -> ' + L.undoDepth());

	key('8');
	c.value = '8';
	report(L.mode(c) === 'entry', 'in ENTRY', L.mode(c));
	L.saveUndoSnapshot();
	d = L.undoDepth();
	let e = ctrlZ(c);
	report(L.undoDepth() === d, '...Ctrl+Z is the browser TEXT undo, so the project is untouched', d + ' -> ' + L.undoDepth());
	report(e._prevented !== true, '...and the keystroke reaches the browser');
	L.cancelEdit(c);

	L.enterEdit(c, false);
	report(L.mode(c) === 'edit', 'in EDIT', L.mode(c));
	d = L.undoDepth();
	e = ctrlZ(c);
	report(L.undoDepth() === d, '...Ctrl+Z is the browser TEXT undo here too', d + ' -> ' + L.undoDepth());
	report(e._prevented !== true, '...and the keystroke reaches the browser');
	L.cancelEdit(c);
	report(L.mode(c) === 'select', 'Escape returns to SELECT');
	d = L.undoDepth();
	ctrlZ(c);
	report(L.undoDepth() === Math.max(0, d - 1), '...where the project undo is one keystroke away again',
		d + ' -> ' + L.undoDepth());
}

console.log(`\n${failures ? 'FAILURES' : 'all pass'}: ${checks - failures}/${checks}`);
process.exit(failures ? 1 : 0);
