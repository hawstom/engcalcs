// The Tables pane as a SPREADSHEET — ROADMAP Task 186. Run with:
//   node dev/lpn-spike/pane-select-harness.js
//
// WHY THIS EXISTS. Tom's spec has three parts and only one of them can be judged by looking at the
// screen (part 1, that the cells abut). The other two are a state machine over a rectangle, and
// every way they can be wrong is silent:
//
//   1. **A browser's native drag-selection cannot span two <input> elements at all**, and every
//      editable cell here is one. So the highlight and the clipboard write must both come from
//      application state. If they ever fall back to the browser's own selection, a user who drags
//      B3 to D40 and presses Ctrl+C gets an empty clipboard or one input's worth of text — with no
//      error, on the first thing a spreadsheet-literate visitor will try.
//   2. **The selection must be keyed on (element id, column key), never on a DOM node.** A sort
//      click, a filter edit or a new part rebuilds the whole tbody, and node references die on
//      every one of them. This harness sorts a table WITH a selection standing and asserts the
//      rectangle followed its rows rather than staying at its old coordinates.
//   3. **`type="number"` makes the whole spec impossible** — Up and Down are its spinner, and
//      `selectionStart` throws on it in Chrome and Firefox. The Curves grid already had to make
//      this change for the same reason (Task 588); this asserts the Tables pane did too, because
//      a cell that reverts to `number` breaks arrows and reports nothing.
//   4. **A text box can hold something that is not a number**, which the old input type refused
//      silently. What replaces that refusal must not write NaN into a field of the user's.

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

setUnitSet('us');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tpaneTableById: paneTableById,\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\tsortTable: function (id, col) { sortPaneTable(paneTableById(id), col); },\n" +
	"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\ttableCols: function (id) { return paneCols(paneTableById(id)); },\n" +
	// The selection model through its own doors, exactly as the page drives it: a keydown at the
	// table, a focusin at a cell. Nothing here reaches past a function the page itself calls.
	"\t\tselBox: function (id) { var s = paneTableById(id);\n" +
	"\t\t\treturn paneSelBox(s, paneTableRowsInOrder(s), paneCols(s)); },\n" +
	"\t\tselState: function (id) { return paneTableById(id).sel; },\n" +
	"\t\ttds: function (id) { return paneTableById(id).tds; },\n" +
	"\t\tcopyTsv: function (id) { var s = paneTableById(id), rows = paneTableRowsInOrder(s),\n" +
	"\t\t\tcols = paneCols(s), box = paneSelBox(s, rows, cols);\n" +
	"\t\t\treturn box ? paneCopyTsv(s, rows, cols, box) : null; },\n" +
	// Written through the COLUMN'S OWN set(), which is setProp() — the one write seam. A harness
	// that assigned el.demand directly would be testing a document shape the page never produces.
	"\t\tsetCell: function (id, elId, key, v) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\tpaneColByKey(s, key).set(el, v); },\n" +
	// The two modes and the paste through their own doors — never by setting `readOnly` here,
	// which is the very mechanism under test.
	"\t\tinEdit: paneInEdit, enterEdit: paneEnterEdit, cancelEdit: paneCancelEdit,\n" +
	"\t\tpasteAt: function (id, cells) { return panePasteAt(paneTableById(id), cells); },\n" +
	"\t\tpasteCells: libPasteCells, pasteIsGrid: libPasteIsGrid,\n" +
	"\t\tcellText: function (id, elId, key) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\treturn paneCellText(paneColByKey(s, key), el); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

const src = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'css', 'engcalcs.css'), 'utf8');

// ---- a network with something to select ------------------------------------------------------
// Four junctions, deliberately with a GAP in the demand column: J2 states none. Ctrl+Down has to
// treat that gap as a spreadsheet does, and a table with no blank cell anywhere cannot test it.
const doc = L.getDoc();
// Built the way the page builds one — addNode() mints the id and the defaults — and then given
// demands and elevations directly, because what is under test is the table over a document, not
// the drawing gestures that made it.
const made = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0),
	L.addNode('junction', 20, 0), L.addNode('junction', 30, 0)];
const ids = made.map((n) => n.id);
ids.forEach((id, i) => L.setCell('junctions', id, 'elev', 100 + i));
L.setCell('junctions', ids[0], 'demand', 10);
// ids[1] is left alone — the GAP. Ctrl+Down has nothing to jump over without one.
L.setCell('junctions', ids[2], 'demand', 30);
L.setCell('junctions', ids[3], 'demand', 40);
L.renderTable('junctions');

const spec = L.paneTableById('junctions');
const cols = L.tableCols('junctions');
const colKeys = cols.map((c) => c.key);
const tableEl = byId.lpn_pane_junctions.children.filter((c) => c._tag === 'table')[0];

function fire(el, type, ev) {
	((el && el._listeners && el._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}
// A bubbled event as the TABLE sees one: the target is the cell (or the control in it) and the
// listener is the table's. The stub does not bubble, so the harness delivers what a browser would.
function key(name, mod) {
	fire(tableEl, 'keydown', Object.assign({
		key: name, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false,
		preventDefault: function () { this._prevented = true; }
	}, mod || {}));
}
function td(id, k) { return L.tds('junctions')[id][k]; }
function clickCell(id, k) {
	fire(tableEl, 'focusin', { target: td(id, k) });
}
function boxOf() { return L.selBox('junctions'); }
function selIds() {
	const b = boxOf();
	if (!b) { return null; }
	const rows = L.tableOrder('junctions');
	return { rows: rows.slice(b.r0, b.r1 + 1), cols: colKeys.slice(b.c0, b.c1 + 1) };
}

// ---- 1. the cell is a text box, because every arrow key depends on it -------------------------
console.log('\n--- the cell kind (the thing every other assertion rests on) ---');
{
	const rowFn = src.slice(src.indexOf('function paneTableRow('),
		src.indexOf('function refillPaneTable('));
	report(/input\.type = 'text'/.test(rowFn), "a Tables-pane cell is input type=text");
	report(!/input\.type = 'number'/.test(rowFn), "...and never type=number, which is the spinner and the throwing selectionStart");
	report(/inputmode', 'decimal'/.test(rowFn), "...with inputmode=decimal, so a phone still gets the numeric keypad");
	const anyInput = td(ids[0], 'demand').children[0];
	report(anyInput && anyInput.type === 'text', 'and the rendered cell really is one', anyInput && anyInput.type);
	report(anyInput && anyInput.getAttribute('inputmode') === 'decimal', 'and really carries inputmode');
}

// ---- 2. a click is a selection of one cell ----------------------------------------------------
console.log('\n--- anchor and focus ---');
{
	clickCell(ids[1], 'demand');
	const b = boxOf();
	report(!!b, 'landing the caret in a cell selects it');
	report(b && b.r0 === 1 && b.r1 === 1 && b.c0 === colKeys.indexOf('demand') && b.c1 === b.c0,
		'...and the rectangle is that one cell', b && JSON.stringify(b));
	report(spec.sel && spec.sel.aId === ids[1] && spec.sel.aKey === 'demand',
		'the state is keyed on the element id and the column key, not on an index');
}

// ---- 3. arrows move; Shift+arrows extend ------------------------------------------------------
{
	clickCell(ids[0], 'demand');
	key('ArrowDown');
	report(spec.sel.fId === ids[1], 'ArrowDown moves the focus one row', spec.sel.fId);
	report(spec.sel.aId === ids[1], '...and collapses the anchor onto it');
	clickCell(ids[0], 'demand');
	key('ArrowDown', { shiftKey: true });
	key('ArrowDown', { shiftKey: true });
	const s = selIds();
	report(s && s.rows.join(',') === ids.slice(0,3).join(','), 'Shift+ArrowDown twice extends over three rows', s && s.rows.join(','));
	report(spec.sel.aId === ids[0], '...with the anchor left where it was');
	report(s && s.cols.length === 1, '...and one column wide');
	key('ArrowRight', { shiftKey: true });
	const s2 = selIds();
	report(s2 && s2.cols.length === 2, 'Shift+ArrowRight widens it to two columns', s2 && s2.cols.join(','));
}

// ---- 4. the edges hold ------------------------------------------------------------------------
{
	clickCell(ids[0], colKeys[0]);
	key('ArrowUp');
	report(spec.sel.fId === ids[0], 'ArrowUp on the top row stays on the top row');
	key('ArrowLeft');
	report(spec.sel.fKey === colKeys[0], 'ArrowLeft in the first column does not leave the table');
	clickCell(ids[3], colKeys[colKeys.length - 1]);
	key('ArrowDown');
	key('ArrowRight');
	report(spec.sel.fId === ids[3] && spec.sel.fKey === colKeys[colKeys.length - 1],
		'and the bottom-right corner is a corner in both directions');
}

// ---- 5. Home, End and their Ctrl pair ---------------------------------------------------------
console.log('\n--- Home, End, Ctrl+Home, Ctrl+End ---');
{
	clickCell(ids[2], 'demand');
	key('Home');
	report(spec.sel.fKey === colKeys[1], 'Home goes to the FIRST DATA column, not to the ID button', spec.sel.fKey);
	report(spec.sel.fId === ids[2], '...staying on its own row');
	key('End');
	report(spec.sel.fKey === colKeys[colKeys.length - 1], 'End goes to the last column, read-only or not', spec.sel.fKey);
	report(spec.sel.fId === ids[2], '...still on its own row');
	key('End', { ctrlKey: true });
	report(spec.sel.fId === ids[3] && spec.sel.fKey === colKeys[colKeys.length - 1],
		'Ctrl+End is the last cell of the last row');
	key('Home', { ctrlKey: true });
	report(spec.sel.fId === ids[0] && spec.sel.fKey === colKeys[1],
		'Ctrl+Home is the first data cell of the first row');
	// Held against the RENDERED order, which is the point: a spreadsheet's Ctrl+End goes to the
	// last cell you can see, and this table's order is whatever the last sort and filter left.
	report(L.tableOrder('junctions')[0] === ids[0], 'and "first row" means the first row on screen');
}

// ---- 6. Ctrl+Arrow: the edge of a run, from both sides of a gap --------------------------------
console.log("\n--- Ctrl+Arrow, Excel's own rule ---");
{
	// The demand column reads 10, (blank), 30, 40 top to bottom.
	report(L.cellText('junctions', ids[1], 'demand') === '', 'J2 states no demand, so its cell is blank');
	clickCell(ids[0], 'demand');
	key('ArrowDown', { ctrlKey: true });
	report(spec.sel.fId === ids[2], 'Ctrl+Down from a filled cell whose neighbour is blank lands on the next filled one', spec.sel.fId);
	key('ArrowDown', { ctrlKey: true });
	report(spec.sel.fId === ids[3], '...and from inside a run, on the last cell of that run', spec.sel.fId);
	clickCell(ids[3], 'demand');
	key('ArrowUp', { ctrlKey: true });
	report(spec.sel.fId === ids[2], 'Ctrl+Up runs back to the top of the run it is in', spec.sel.fId);
	clickCell(ids[0], 'demand');
	key('ArrowDown', { ctrlKey: true, shiftKey: true });
	report(spec.sel.aId === ids[0] && spec.sel.fId === ids[2],
		'Ctrl+Shift+Down does the same edge-finding and EXTENDS rather than moves');
}

// ---- 7. the copy is ours, and it is what the screen says --------------------------------------
console.log('\n--- the clipboard ---');
{
	clickCell(ids[0], 'demand');
	key('ArrowDown', { shiftKey: true });
	const tsv = L.copyTsv('junctions');
	report(tsv === '10\n', 'a two-cell column copies as two lines, one of them empty', JSON.stringify(tsv));
	report(tsv.split('\n').length === 2, '...and a blank cell copies as a blank cell, not as a 0');
	clickCell(ids[0], 'demand');
	key('ArrowDown', { shiftKey: true });
	key('ArrowDown', { shiftKey: true });
	key('ArrowRight', { shiftKey: true });
	const grid = L.copyTsv('junctions').split('\n');
	report(grid.length === 3 && grid.every((l) => l.split('\t').length === 2),
		'a 3x2 rectangle copies as three lines of two tab-separated cells', JSON.stringify(grid));
	report(grid[0].split('\t')[0] === L.cellText('junctions', ids[0], 'demand'),
		'and every cell is paneCellText(), so the clipboard cannot disagree with the screen or the print sheet');
}

// ---- 8. headers come with the WHOLE table and with nothing else --------------------------------
{
	clickCell(ids[0], 'demand');
	key('ArrowDown', { shiftKey: true });
	const part = L.copyTsv('junctions');
	report(part.split('\n').length === 2, 'a partial selection copies no heading row', JSON.stringify(part));
	key('a', { ctrlKey: true });
	const all = L.copyTsv('junctions');
	const lines = all.split('\n');
	report(lines.length === 5, 'Ctrl+A selects every cell, so the copy is four rows and a heading', String(lines.length));
	report(lines[0].split('\t').length === colKeys.length, '...the heading row being one cell per column');
	// paneHeadingText() already appends the unit in parentheses, so the units on the clipboard are
	// the units on the strip with no second formatter to disagree with it.
	report(/\(/.test(lines[0]), '...and the headings carry their units, as the screen does', lines[0]);
}

// ---- 9. the selection survives a rebuild, because it is not made of DOM nodes ------------------
console.log('\n--- a sort rebuilds the table under a standing selection ---');
{
	clickCell(ids[0], 'demand');
	key('ArrowDown', { shiftKey: true });
	const before = selIds();
	report(before.rows.join(',') === ids.slice(0,2).join(','), 'two rows selected before the sort');
	const oldTd = td(ids[0], 'demand');
	L.sortTable('junctions', 'elev');
	L.sortTable('junctions', 'elev');   // descending: J4, J3, J2, J1
	report(L.tableOrder('junctions').join(',') === ids.slice().reverse().join(','), 'the sort really re-ordered the rows',
		L.tableOrder('junctions').join(','));
	const after = selIds();
	report(after && after.rows.slice().sort().join(',') === ids.slice(0,2).join(','),
		'and the selection is still the SAME TWO ELEMENTS, not the same two positions',
		after && after.rows.join(','));
	report(td(ids[0], 'demand') !== oldTd, 'the <td> carrying the highlight is a different node now');
	report(td(ids[0], 'demand').classList.contains('lpn-pane-sel'),
		'and the new node is the one wearing the class');
	report(!td(ids[2], 'demand').classList.contains('lpn-pane-sel'),
		'while a row that is not in the rectangle is not');
}

// ---- 10. a deleted row leaves no rectangle behind ----------------------------------------------
{
	clickCell(ids[0], 'demand');
	const gone = doc.nodes.filter((n) => n.id !== ids[0]);
	doc.nodes.length = 0;
	gone.forEach((n) => doc.nodes.push(n));
	L.renderTable('junctions');
	report(boxOf() === null, 'a selection whose element has gone resolves to nothing at all');
	// The honest answer, rather than a rectangle drawn at whatever index J1 used to occupy.
	report(L.copyTsv('junctions') === null, '...and there is nothing to copy');
}

// ---- 11. what the stylesheet has to say (Tom's part 1) -----------------------------------------
console.log('\n--- the cells abut ---');
{
	report(/\.lpn-pane-table tbody td \{[^}]*padding: 0;/.test(css),
		'a body cell has no padding of its own');
	report(/\.lpn-pane-table tbody td \{[^}]*border: 1px/.test(css),
		'...and carries the grid line itself, so two cells share one rule between them');
	report(/\.lpn-pane-table tbody td input \{[^}]*border: 0;/.test(css),
		'the control inside it has no border, or the grid would be drawn twice with a gutter');
	report(/\.lpn-pane-table tbody td\.lpn-pane-sel \{/.test(css),
		'and the selected range has a class of its own to wash');
	// The widths Tom approved are a custom property and must not have been disturbed.
	report(/\.lpn-pane-table input \{ width: var\(--lpn-pane-col-w/.test(css),
		'the approved column widths still arrive as --lpn-pane-col-w');
}

// ---- 12. a text box can hold nonsense; the document must not ------------------------------------
console.log('\n--- what replaces the number input\'s silent refusal ---');
{
	L.renderTable('junctions');
	const cell = td(ids[1], 'demand').children[0];
	const was = cell.value;
	cell.value = 'abc';
	fire(cell, 'change', {});
	report(L.cellText('junctions', ids[1], 'demand') !== 'NaN',
		'typing letters does not write NaN into a field of the user\'s',
		L.cellText('junctions', ids[1], 'demand'));
	report(cell.value === was, '...and the cell goes back to what the document holds', JSON.stringify(cell.value));
	cell.value = '12.5';
	fire(cell, 'change', {});
	report(L.cellText('junctions', ids[1], 'demand') === '12.5', 'and a real number still lands', L.cellText('junctions', ids[1], 'demand'));
}


// ---- 13. the two modes, which is the whole of Tom's 2026-09-07 spec --------------------------
console.log('\n--- navigation mode and edit mode ---');
// **A FRESH DOCUMENT, because the sections above deliberately DELETE elements** — section 10
// proves a selection whose element has gone resolves to nothing, and it does that by removing one.
// Everything below needs four junctions again, built the way the page builds them.
const made2 = [L.addNode('junction', 0, 40), L.addNode('junction', 10, 40),
	L.addNode('junction', 20, 40), L.addNode('junction', 30, 40)];
const ids2 = made2.map((x) => x.id);
// The survivors of the sections above are cleared out, so the ROW ORDER below is known: every
// assertion here is about which row a key or a paste reached, and it cannot be read against a
// table whose order depends on what an earlier section happened to delete.
doc.nodes.length = 0;
made2.forEach((x) => doc.nodes.push(x));
doc.links.length = 0;
ids2.forEach((id, i) => L.setCell('junctions', id, 'elev', 200 + i));
ids2.forEach((id, i) => L.setCell('junctions', id, 'demand', (i + 1) * 10));
L.paneTableById('junctions').sel = null;
// The sort is a GESTURE that is then held, and section 9 clicked a heading twice — so it is
// still descending on elevation. Put it back to the id ordering a fresh table opens on.
L.paneTableById('junctions').sort = { col: 'id', dir: 1 };
L.paneTableById('junctions').orderIds = null;
L.paneTableById('junctions').sig = '';
L.renderTable('junctions');
report(L.tableOrder('junctions').join(',') === ids2.join(','),
	'four junctions, in a known order, for everything below', L.tableOrder('junctions').join(','));
{
	const cell = td(ids2[0], 'demand').children[0];
	report(cell.readOnly === true, 'a cell is born in NAVIGATION mode, read-only');
	report(!L.inEdit(cell), '...and reports itself not editing');
	// **THE POINT OF readOnly IS THAT THERE IS NO CARET TO SWALLOW AN ARROW.** A flag alone would
	// leave the browser moving one underneath us.
	clickCell(ids2[0], 'demand');
	key('ArrowDown');
	report(spec.sel.fId === ids2[1], 'an arrow in navigation mode moves one cell, always', spec.sel.fId);

	// F2 keeps the value; typing over a cell wipes it. Tom's (b) against his (a).
	clickCell(ids2[0], 'demand');
	const c0 = td(ids2[0], 'demand').children[0];
	c0.focus();
	const held = c0.value;
	key('F2');
	report(L.inEdit(c0), 'F2 puts the cell into edit mode');
	report(c0.value === held, '...and keeps what was there', JSON.stringify(c0.value));

	// Escape puts back what was typed over and fires no commit.
	c0.value = '999';
	key('Escape');
	report(!L.inEdit(c0), 'Escape leaves edit mode');
	report(c0.value === held, '...and puts back what the cell held', JSON.stringify(c0.value));
	report(L.cellText('junctions', ids2[0], 'demand') === held,
		'...having written nothing to the document', L.cellText('junctions', ids2[0], 'demand'));

	// A printable character OVERWRITES: the mode switches and the box is emptied, and the
	// keystroke itself is left to the browser so a dead key or an IME composition is not lost.
	c0.focus();
	key('7');
	report(L.inEdit(c0), 'typing a character starts an edit');
	report(c0.value === '', '...on an emptied cell, because typing OVERWRITES', JSON.stringify(c0.value));

	// Delete empties a cell without entering edit mode at all.
	c0.value = held; L.cancelEdit(c0); c0.readOnly = true;
	clickCell(ids2[2], 'demand');
	const c2 = td(ids2[2], 'demand').children[0];
	c2.focus();
	key('Delete');
	// **A COLUMN WITH NO BLANK STATE READS AN EMPTIED CELL AS 0**, which is the same rule the
	// change handler has always followed: `+'' === 0`. A demand of nothing IS a demand of zero. On
	// a column that declares `blank` -- a reaction coefficient, where an empty box means "use the
	// global" and a typed 0 means "does not react" -- the same gesture passes `undefined` instead.
	report(L.cellText('junctions', ids2[2], 'demand') === '0',
		'Delete empties a cell in navigation mode, without entering it',
		JSON.stringify(L.cellText('junctions', ids2[2], 'demand')));
	L.setCell('junctions', ids2[2], 'demand', 30);
	L.renderTable('junctions');
}

// ---- 14. the paste tiles, by Tom's own rule ---------------------------------------------------
console.log("\n--- pasting, and the fractional repeat ---");
{
	// The clipboard reader is the Curves grid's, reused rather than restated.
	report(L.pasteIsGrid(L.pasteCells('1\t2\n3\t4')), 'a tab-separated block is a grid');
	report(!L.pasteIsGrid(L.pasteCells('7')), '...and one cell is not, so the browser keeps it');

	// ONE CELL INTO A RECTANGLE FILLS IT.
	L.renderTable('junctions');
	clickCell(ids2[0], 'demand');
	key('ArrowDown', { shiftKey: true });
	key('ArrowDown', { shiftKey: true });
	L.pasteAt('junctions', [['55']]);
	report(ids2.slice(0, 3).every((id) => L.cellText('junctions', id, 'demand') === '55'),
		'one cell pasted into three fills all three',
		ids2.map((id) => L.cellText('junctions', id, 'demand')).join('|'));

	// TWO ROWS INTO THREE — the fractional case, and the half is the source's first row again.
	clickCell(ids2[0], 'demand');
	key('ArrowDown', { shiftKey: true });
	key('ArrowDown', { shiftKey: true });
	L.pasteAt('junctions', [['11'], ['22']]);
	report(L.cellText('junctions', ids2[0], 'demand') === '11' &&
		L.cellText('junctions', ids2[1], 'demand') === '22' &&
		L.cellText('junctions', ids2[2], 'demand') === '11',
		'two rows into three repeat one and a HALF times',
		ids2.slice(0, 3).map((id) => L.cellText('junctions', id, 'demand')).join(','));

	// THREE ROWS INTO ONE SELECTED CELL — the source is bigger, so all three land. "At least one
	// whole time" is what stops a selection of one truncating a block of forty.
	clickCell(ids2[0], 'demand');
	L.pasteAt('junctions', [['1'], ['2'], ['3']]);
	report(L.cellText('junctions', ids2[0], 'demand') === '1' &&
		L.cellText('junctions', ids2[1], 'demand') === '2' &&
		L.cellText('junctions', ids2[2], 'demand') === '3',
		'three rows into one selected cell all land',
		ids2.slice(0, 3).map((id) => L.cellText('junctions', id, 'demand')).join(','));

	// IT CANNOT GROW THE TABLE. A row is an element on the map; a paste that ran off the bottom
	// would have to invent junctions, which is a different question with an ID-collision story.
	const before = doc.nodes.length;
	clickCell(ids2[3], 'demand');
	const off = L.pasteAt('junctions', [['5'], ['6'], ['7']]);
	report(doc.nodes.length === before, 'a paste past the last row invents no elements');
	report(off && off.dropped === 2, '...and counts what it dropped rather than dropping it quietly',
		off && String(off.dropped));

	// A RESULT COLUMN REFUSES A PASTE EXACTLY AS IT REFUSES A KEYSTROKE.
	clickCell(ids2[0], 'head');
	const res = L.pasteAt('junctions', [['1'], ['2']]);
	report(res && res.wrote === 0 && res.refused === 2,
		'a computed column refuses every pasted cell and says how many',
		res && JSON.stringify(res));

	// A PASTE IS THE USER TYPING, so nonsense is refused by the same test a keystroke meets.
	clickCell(ids2[0], 'demand');
	const bad = L.pasteAt('junctions', [['abc'], ['9']]);
	report(bad && bad.wrote === 1 && bad.refused === 1,
		'letters in a pasted block are refused, and the numbers beside them still land',
		bad && JSON.stringify(bad));
	report(L.cellText('junctions', ids2[1], 'demand') === '9', '...the number landing where it was aimed');
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
