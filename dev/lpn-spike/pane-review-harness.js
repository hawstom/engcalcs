// TOM'S 2026-09-19 BROWSER PASS ON THE SPREADSHEET TABLES, one assertion per finding. Run with:
//   node dev/lpn-spike/pane-review-harness.js
//
// He worked the bottom-pane tables by hand and wrote eighteen numbered findings. The ones with a
// behaviour under them are here; the four about the PICTURE (a blip on every column separator, a
// gray line past the last column, heading borders wider than the body's, a blue frame nothing else
// balanced) are all one name collision in css/engcalcs.css and are asserted there, not here.
//
// **THE CORRECTION THAT MOVED THE MOST IS HIS OWN, AND IT IS ABOUT APPEARANCE RATHER THAN KEYS**:
// *"I said that keyboard navigation should be in Select mode. But that is wrong... in Select mode
// they should be shaded blue and in Entry mode the single current cell should be merely border
// highlighted."* So a WASH on screen now always means a range somebody selected, and moving from
// cell to cell paints a border and nothing else. The keystrokes did not move; the pictures did.
//
// Everything is driven through the page's own doors -- a keydown at the table, a mousedown, a
// focusin -- and never by writing the classes or the flags under test, which is the stub failure
// dev/testing-notes.md names first.

'use strict';

const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}

// The clipboard, before the page is loaded, because libCopyOut() reads navigator at the moment of
// the copy and the stub ships a navigator with no clipboard at all.
let clipboard = null;
global.navigator.clipboard = { writeText: function (t) { clipboard = t; return { then: function () {} }; } };

setUnitSet('us');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode,\n" +
	"\t\tpaneTableById: paneTableById, openPane: openPane,\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\ttableCols: function (id) { return paneCols(paneTableById(id)); },\n" +
	"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\tcells: function (id) { return paneTableById(id).cells; },\n" +
	"\t\ttds: function (id) { return paneTableById(id).tds; },\n" +
	"\t\tspec: paneTableById,\n" +
	"\t\tselBox: function (id) { var s = paneTableById(id);\n" +
	"\t\t\treturn paneSelBox(s, paneTableRowsInOrder(s), paneCols(s)); },\n" +
	"\t\tmode: paneCellMode, fourthMode: function (id, k) {\n" +
	"\t\t\tvar s = paneTableById('junctions'); return paneFourthMode(s, s.cells[id][k]); },\n" +
	"\t\tblankAt: paneCellBlankAt, homeCol: paneHomeCol,\n" +
	"\t\tsetCell: function (id, elId, key, v) { var s = paneTableById(id),\n" +
	"\t\t\tel = doc.nodes.filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\tpaneColByKey(s, key).set(el, v); },\n" +
	"\t\tcellText: function (id, elId, key) { var s = paneTableById(id),\n" +
	"\t\t\tel = doc.nodes.filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\treturn paneCellText(paneColByKey(s, key), el); },\n" +
	"\t\tundoDepth: function () { return undoStack.length; }, undo: undo,\n" +
	"\t\tselectedRefs: selectedRefs,\n" +
	"\t\topenPopup: openPopup, popupRef: function () { return currentPopup; }, closePopup: closePopup,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
const PC = global.EngCalcs.pageConfig;

const ids = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0),
	L.addNode('junction', 20, 0), L.addNode('junction', 30, 0)].map((n) => n.id);
ids.forEach((id, i) => { L.setCell('junctions', id, 'elev', 100 + i); L.setCell('junctions', id, 'demand', 10 + i); });
L.openPane('junctions');
L.renderTable('junctions');

const spec = L.spec('junctions');
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
function click(elId, k, button) {
	// A press and then the focus it causes, which is the order a browser does it in.
	fire(tableEl, 'mousedown', { target: td(elId, k), button: button || 0, shiftKey: false,
		preventDefault: function () {} });
	if (!button) {
		global.document.activeElement = null;
		fire(tableEl, 'focusin', { target: td(elId, k) });
		global.document.activeElement = cell(elId, k);
	} else {
		// A right press focuses the box under the pointer too, which is the whole hazard.
		fire(tableEl, 'focusin', { target: td(elId, k) });
	}
	fire(tableEl, 'mouseup', {});
}
function at() {
	const b = L.selBox('junctions');
	if (!b) { return null; }
	return L.tableOrder('junctions')[b.fr] + '/' + cols[b.fc];
}
function boxSize() {
	const b = L.selBox('junctions');
	return b ? (b.r1 - b.r0 + 1) + 'x' + (b.c1 - b.c0 + 1) : '0x0';
}
function classOf(elId, k) { return String(td(elId, k)['class'] || ''); }
// The row elements in the order the table is showing them, which is what paneCellBlankAt() reads.
function paneRows() {
	const doc = L.getDoc();
	return L.tableOrder('junctions').map((id) => doc.nodes.filter((n) => n.id === id)[0]);
}

console.log('\n--- R-028: a typed cell is undoable, and ONE press is enough ---');
{
	click(ids[0], 'elev');
	const c = cell(ids[0], 'elev');
	const was = L.cellText('junctions', ids[0], 'elev');
	const d0 = L.undoDepth();
	key('9'); c.value = '9'; key('9'); c.value = '99';
	key('Enter');
	report(L.cellText('junctions', ids[0], 'elev') === '99', 'the typed value reaches the document',
		L.cellText('junctions', ids[0], 'elev'));
	report(L.undoDepth() === d0 + 1, 'a typed cell takes ONE undo snapshot', d0 + ' -> ' + L.undoDepth());
	// The commit runs twice for one edit -- the key handler, then the blur it causes -- so the
	// second one must add nothing, or the first Ctrl+Z would put back what is already on screen.
	fire(c, 'change', {});
	report(L.undoDepth() === d0 + 1, '...and the blur that follows adds no second one', String(L.undoDepth()));
	L.undo();
	report(L.cellText('junctions', ids[0], 'elev') === was, 'one Ctrl+Z puts the old value back',
		L.cellText('junctions', ids[0], 'elev'));
	L.renderTable('junctions');
	// A commit that changes nothing is not an edit and must not fill the stack with no-ops.
	const c2 = cell(ids[1], 'elev');
	click(ids[1], 'elev');
	const d1 = L.undoDepth();
	fire(c2, 'change', {});
	report(L.undoDepth() === d1, 'a commit that changes nothing takes no snapshot', d1 + ' -> ' + L.undoDepth());
}

console.log('\n--- R-030: Home and Ctrl+Home are column A, which is the ID ---');
{
	report(L.homeCol(L.tableCols('junctions')) === 0, 'the Home column is index 0');
	click(ids[2], 'demand');
	key('Home');
	report(at() === ids[2] + '/' + cols[0], 'Home goes to the ID column on its own row', at());
	key('Home', { ctrlKey: true });
	report(at() === ids[0] + '/' + cols[0], 'Ctrl+Home is the ID of the first row', at());
}

console.log('\n--- R-029: Ctrl+arrow stops at blanks and ends, not at a control ---');
{
	// A yes/no column and a pull-down column both hold a STATE, and a state is not a blank --
	// Tom's own answer about the checkbox ("no, since it's a zero in concept"), applied to both.
	// A jump that stopped on every row of such a column is what he hit: *"Ctrl+arrows works, but
	// stops at selectors."*
	const rows = paneRows(), colDefs = L.tableCols('junctions');
	let controls = 0, blankText = 0;
	colDefs.forEach(function (c, i) {
		if (!c.bool && !c.choices) { return; }
		controls++;
		let anyBlank = false;
		for (let r = 0; r < rows.length; r++) { if (L.blankAt(rows, colDefs, r, i)) { anyBlank = true; } }
		report(!anyBlank, `the ${c.bool ? 'yes/no' : 'pull-down'} column "${c.key}" is never a blank`);
	});
	report(controls > 0, 'the junctions table really has such a column to test', String(controls));
	// A genuinely empty text cell IS still a blank, or Ctrl+Down would always run to the bottom
	// and the whole gesture would be End with extra steps.
	colDefs.forEach(function (c, i) {
		if (c.bool || c.choices) { return; }
		if (L.blankAt(rows, colDefs, 0, i)) { blankText++; }
	});
	report(blankText > 0, 'an empty ordinary cell is still a blank', String(blankText));
	// And the jump itself: Ctrl+Down from a filled cell runs to the end of the filled run.
	click(ids[0], 'elev');
	key('ArrowDown', { ctrlKey: true });
	report(at() === ids[ids.length - 1] + '/elev', 'Ctrl+Down runs the length of a filled column', at());
}

console.log('\n--- R-031 / R-033 / R-034: one cell wears a border, a range wears the wash ---');
{
	click(ids[1], 'elev');
	report(boxSize() === '1x1', 'a click selects one cell', boxSize());
	report(classOf(ids[1], 'elev').indexOf('lpn-pane-cur') >= 0, 'the current cell wears the border class');
	report(classOf(ids[1], 'elev').indexOf('lpn-pane-sel') < 0,
		'...and NO wash, because a wash is reserved for a range', classOf(ids[1], 'elev'));
	key('ArrowDown');
	report(classOf(ids[1], 'elev').indexOf('lpn-pane-cur') < 0, 'moving on takes the border away again');
	report(classOf(ids[2], 'elev').indexOf('lpn-pane-cur') >= 0, '...and gives it to the cell moved to');
	report(classOf(ids[2], 'elev').indexOf('lpn-pane-sel') < 0, '...still with no wash');
}

console.log('\n--- R-036: the current cell of a range is the STARTING cell ---');
{
	// His own sequence, in his own letters: click A1, extend to B1, then Down lands on A2.
	click(ids[0], cols[0]);
	key('ArrowRight', { shiftKey: true });
	report(boxSize() === '1x2', 'Shift+Right makes a range of two cells', boxSize());
	report(classOf(ids[0], cols[0]).indexOf('lpn-pane-sel') >= 0, 'both cells wear the wash');
	report(classOf(ids[0], cols[1]).indexOf('lpn-pane-sel') >= 0, '...including the one dragged to');
	report(classOf(ids[0], cols[0]).indexOf('lpn-pane-cur') >= 0,
		'the border is on A1, the cell the selection STARTED from');
	report(classOf(ids[0], cols[1]).indexOf('lpn-pane-cur') < 0, '...and not on B1, the end of it');
	key('ArrowDown');
	report(at() === ids[1] + '/' + cols[0], 'Down from that selection lands on A2, not B2', at());
	report(boxSize() === '1x1', '...collapsing the range, as an unshifted arrow does', boxSize());
}

console.log('\n--- R-039: Ctrl+C copies one cell, and copies a keyboard range ---');
{
	clipboard = null;
	click(ids[0], 'elev');
	const e1 = key('c', { ctrlKey: true });
	report(e1._prevented === true, 'Ctrl+C on one cell is handled by the table');
	report(clipboard === L.cellText('junctions', ids[0], 'elev'),
		'...and puts that cell on the clipboard', JSON.stringify(clipboard));
	clipboard = null;
	key('ArrowDown', { shiftKey: true });
	key('c', { ctrlKey: true });
	report(clipboard === L.cellText('junctions', ids[0], 'elev') + '\n' + L.cellText('junctions', ids[1], 'elev'),
		'Ctrl+C after Shift+Down copies both rows', JSON.stringify(clipboard));
	// Across columns, which is the question Tom left open: it DOES copy, tab-separated.
	clipboard = null;
	click(ids[0], 'elev');
	key('ArrowRight', { shiftKey: true });
	key('c', { ctrlKey: true });
	report(String(clipboard).indexOf('\t') > 0, 'a range spanning two columns copies both, tab separated',
		JSON.stringify(clipboard));
	// A cell being typed in keeps its own Ctrl+C: those characters are the user's.
	clipboard = null;
	click(ids[2], 'elev');
	key('5');
	const e2 = key('c', { ctrlKey: true });
	report(e2._prevented !== true && clipboard === null,
		'Ctrl+C inside a cell being typed in is left to the browser');
	key('Escape');
}

console.log('\n--- R-037: a right press inside the selection leaves it alone ---');
{
	click(ids[0], 'elev');
	key('ArrowDown', { shiftKey: true });
	key('ArrowDown', { shiftKey: true });
	report(boxSize() === '3x1', 'three cells selected', boxSize());
	click(ids[1], 'elev', 2);                       // right press on the middle of the selection
	report(boxSize() === '3x1', 'a right press inside it changes nothing', boxSize());
	report(at() === ids[2] + '/elev', '...and does not move the end of it either', at());
	click(ids[3], 'demand', 2);                     // right press OUTSIDE it
	report(boxSize() === '1x1', 'a right press outside it moves the selection, as a left one does',
		boxSize());
}

console.log('\n--- R-038: navigating selects no characters ---');
{
	// paneFocusCell() used to call select() on arrival, which is what made a cell merely passed
	// over look exactly like a cell being edited. The stub records a select() call, so a harness
	// can see the one thing a screenshot would have had to.
	const c = cell(ids[0], 'elev');
	let selected = 0;
	c.select = function () { selected++; };
	click(ids[1], 'elev');
	key('ArrowUp');
	report(selected === 0, 'arriving by arrow key selects none of the text', String(selected));
}

console.log('\n--- R-063: four modes, his own words (2026-09-21) ---');
{
	// "There is another mode, and it is Select. So there are four modes. Call them what you want:
	// Ready/Navigate, Enter/Entry, Edit, Select." paneFourthMode() is the one place that answers
	// which of his four a cell is in; asserted against a single cell (Ready) and a real range
	// (Select), because his own point was that a range is not the same mode as one cell standing
	// still even though nothing about the arrow keys or Ctrl+Z changes between them.
	click(ids[0], 'elev');
	report(L.fourthMode(ids[0], 'elev') === 'ready', 'one cell, nothing typed, is Ready',
		L.fourthMode(ids[0], 'elev'));
	key('ArrowDown', { shiftKey: true });
	report(L.fourthMode(ids[0], 'elev') === 'select', 'a two-cell range is Select',
		L.fourthMode(ids[0], 'elev'));
	report(boxSize() === '2x1', '...a genuine range, not a stray click', boxSize());
	key('ArrowDown');
	report(L.fourthMode(ids[1], 'elev') === 'ready', 'collapsing the range returns to Ready',
		L.fourthMode(ids[1], 'elev'));
	const c = cell(ids[1], 'elev');
	key('9'); c.value = '9';
	report(L.fourthMode(ids[1], 'elev') === 'entry', 'typing over a cell is Entry',
		L.fourthMode(ids[1], 'elev'));
	key('Enter');
	key('F2');
	report(L.fourthMode(ids[2], 'elev') === 'edit', 'F2 is Edit', L.fourthMode(ids[2], 'elev'));
	key('Escape');
}

console.log('\n--- quirk 2: an arrow up must scroll the row clear of the pinned heading ---');
{
	// Tom, 2026-09-21: "The cursor, with up arrow, ends up under the headings if the table has
	// been scrolled down. Ctrl+up doesn't help. But Ctrl+down, Ctrl+up fixes the disappearance."
	// `thead tr` is `position: sticky`, so it overlays the scrolling body instead of taking room
	// out of it -- the browser's own focus()-scroll does not know that, and paneScrollCellIntoView
	// is the correction.
	const host = byId.lpn_pane_junctions;
	const theadRow = tableEl.children.filter((c) => c._tag === 'thead')[0].children[0];
	host.getBoundingClientRect = function () { return { top: 100, bottom: 400 }; };
	theadRow.getBoundingClientRect = function () { return { top: 100, bottom: 130, height: 30 }; };
	host.scrollTop = 50;
	click(ids[3], 'elev');
	const targetTd = td(ids[2], 'elev');
	targetTd.getBoundingClientRect = function () { return { top: 105, bottom: 125 }; };
	key('ArrowUp');
	report(host.scrollTop === 25,
		'scrolling up enough to clear the heading, not merely into the viewport',
		String(host.scrollTop));
	delete host.getBoundingClientRect;
	delete theadRow.getBoundingClientRect;
}

console.log('\n--- R-038 (mouse half) / quirk 1: a plain press must not arm native text selection ---');
{
	// His 2026-09-21 narrowing: "A selection should highlight cells, not characters. But I see
	// characters highlighting as in Entry mode when selecting by mouse." A browser arms its own
	// click-and-drag text selection from `mousedown` regardless of `readOnly` or CSS
	// `user-select`, so only `preventDefault()` on that event stops it -- and until now the plain
	// (non-Shift) press never called it, only the Shift-extend branch did. Losing the browser's
	// own default focus along with it is why the handler must focus the control itself.
	const td0 = td(ids[0], 'elev'), inp0 = cell(ids[0], 'elev');
	let prevented = 0, focused = 0;
	inp0.focus = function () { focused++; global.document.activeElement = inp0; };
	fire(tableEl, 'mousedown', { target: td0, button: 0, shiftKey: false,
		preventDefault: function () { prevented++; } });
	report(prevented === 1, 'a plain left press prevents the browser default', String(prevented));
	report(focused === 1, '...and focuses the cell itself, since the browser default will not',
		String(focused));
	fire(tableEl, 'mouseup', {});
}

console.log('\n--- right-click menu: Copy, Paste, Select in map, Delete ---');
{
	// Tom, 2026-09-21: "For a complete spreadsheet experience, right-click should offer Copy,
	// Paste, Select in map, and Delete." Every word on it is borrowed rather than coined --
	// asserted here against the exact strings the borrowed keys carry.
	function menuEl() {
		return global.document.body.children.filter((c) => c['class'] === 'lpn-pane-ctxmenu').slice(-1)[0];
	}
	// A real right-click is a mousedown (which the page reads to decide whether it kept or moved
	// the selection) and only THEN the contextmenu -- click(elId, k, 2) does the first half.
	function openMenuOn(elId, k) {
		click(elId, k, 2);
		fire(tableEl, 'contextmenu', { target: td(elId, k), clientX: 10, clientY: 20,
			preventDefault: function () {} });
		return menuEl();
	}
	click(ids[1], 'elev');
	let menu = openMenuOn(ids[1], 'elev');
	report(!!menu, 'a right press on a cell opens a menu');
	const labels = (menu.children || []).map((b) => b.textContent);
	report(labels.length === 4, 'exactly four rows', labels.join(' | '));
	report(labels[0] === (PC.points_data_copy || 'Copy'), 'Copy is the row-table grid’s own word', labels[0]);
	report(labels[1] === (PC.points_data_paste || 'Paste'), 'Paste is the row-table grid’s own word', labels[1]);
	report(labels[2] === PC.lpn_pane_goto_tip,
		'Select in map reuses the pin’s own tip, not a new string', labels[2]);
	report(labels[3] === (PC.lpn_tool_delete || 'Delete'), 'Delete reuses the Delete tool’s word', labels[3]);

	// Copy: writes the cell to the clipboard, the same as Ctrl+C.
	clipboard = null;
	fire(menu.children[0], 'click', {});
	report(clipboard === L.cellText('junctions', ids[1], 'elev'), 'Copy puts the cell on the clipboard', clipboard);
	report(!menuEl(), '...and closes the menu');

	// Select in map: the same door the pin uses -- setSelection() through findGoTo().
	openMenuOn(ids[2], 'elev');
	menu = menuEl();
	fire(menu.children[2], 'click', {});
	const refs = L.selectedRefs();
	report(refs.length === 1 && refs[0].kind === 'node' && refs[0].id === ids[2],
		'Select in map selects the element the row is about', JSON.stringify(refs));

	// Delete: clears the value, takes one undo, and never removes the row. A text field ('tag')
	// so the assertion is not tangled up with a required numeric field's own blank-means-zero rule
	// (paneParseCellText: `+'' === 0`), which is unrelated to what Delete does.
	L.setCell('junctions', ids[3], 'tag', 'X99');
	L.renderTable('junctions');
	click(ids[3], 'tag');
	const before = L.cellText('junctions', ids[3], 'tag');
	const d0 = L.undoDepth();
	openMenuOn(ids[3], 'tag');
	menu = menuEl();
	fire(menu.children[3], 'click', {});
	report(L.cellText('junctions', ids[3], 'tag') === '', 'Delete clears the cell’s value',
		L.cellText('junctions', ids[3], 'tag'));
	report(L.undoDepth() === d0 + 1, '...as one undoable edit', d0 + ' -> ' + L.undoDepth());
	report(L.tableOrder('junctions').indexOf(ids[3]) >= 0, '...and the row itself is still in the table');
	L.undo();
	report(L.cellText('junctions', ids[3], 'tag') === before, 'and Ctrl+Z puts the value back',
		L.cellText('junctions', ids[3], 'tag'));
	L.renderTable('junctions');

	// A blank selection is not an edit and must not fill the undo stack with a no-op.
	click(ids[0], 'tag');
	const d1 = L.undoDepth();
	openMenuOn(ids[0], 'tag');
	menu = menuEl();
	if (menu) { fire(menu.children[3], 'click', {}); }
	report(L.undoDepth() === d1, 'Delete on an already-blank cell takes no snapshot', d1 + ' -> ' + L.undoDepth());
}

console.log('\n--- R-035: a cell typed AFTER an Undo must not revert ---');
{
	// His revised wording (2026-09-21): "When I type into any cell after any Undo and press Enter,
	// Tab, or Arrow, my entry is reverted." 26 earlier trials with no Undo in front of the edit
	// never reproduced it -- this is the one sequence that does.
	//
	// The cause: undo() clones a whole new `doc`, so every node object gets a new identity under
	// the SAME id. paneTableSignature() is ids-and-headings only, so the table takes the cheap
	// refillPaneTable() path rather than a rebuild -- and every <input>'s `_lpnCell.el` closure,
	// set once when the cell was BUILT, kept pointing at the pre-undo object. A commit after that
	// wrote onto the orphaned object; the document (and the next refill) never saw it.
	click(ids[0], 'demand');
	const before = L.cellText('junctions', ids[0], 'demand');
	const cUndo = cell(ids[0], 'demand');
	key('5'); cUndo.value = before + '5';
	key('Enter');
	L.undo();
	L.renderTable('junctions');
	click(ids[0], 'demand');
	const c = cell(ids[0], 'demand');
	key('7'); c.value = '777';
	key('Enter');
	report(L.cellText('junctions', ids[0], 'demand') === '777',
		'the post-undo entry sticks instead of reverting', L.cellText('junctions', ids[0], 'demand'));
}

console.log('\n--- CRASH 1: renaming from the table while Properties is open ---');
{
	// Perry's pre-review, reproduced here with the same real events he used (mousedown, focusin,
	// F2, type, change) rather than by calling the setter. Open the Properties popup on one node,
	// then rename THAT node from the table below -- an entirely ordinary thing to do with two
	// panels open. Before the fix, renameNode() was the only caller that kept `currentPopup` in
	// step; the pane table's ID cell went through applyNodeRename() directly, so the popup was
	// left naming an id that no longer existed and the very next refreshPopupIfOpen() (which
	// paneCommitCell() calls after every commit) threw inside renderNodeFields().
	L.openPopup(ids[2], 0, 0);
	report(L.popupRef() && L.popupRef().id === ids[2], 'Properties is open on the node under test',
		JSON.stringify(L.popupRef()));
	const oldId = ids[2], newId = oldId + '-renamed';
	click(oldId, 'id');
	const idInput = cell(oldId, 'id');
	key('F2');
	idInput.value = newId;
	fire(idInput, 'change', {});
	let threw = null;
	try { fire(tableEl, 'change', {}); } catch (e) { threw = e; }
	report(!threw, 'renaming from the table with Properties open does not throw',
		threw ? String(threw && threw.stack || threw) : '');
	report(L.popupRef() && L.popupRef().id === newId,
		'the open popup follows the rename to the new id', JSON.stringify(L.popupRef()));
	L.closePopup();
	ids[2] = newId;   // so later blocks (right-click menu section already ran) still resolve
}

console.log('\n--- CRASH 2: Delete on a selection spanning the ID column ---');
{
	// Perry: three rows selected across the ID column raised three sequential blocking alert()s
	// (validateNewId() correctly refusing a blank id, once per row) before the page could be used
	// again. No data was lost, but it contradicts Delete's own "clears values, undoable" promise.
	let alerts = 0;
	const realAlert = global.alert;
	global.alert = function () { alerts++; };
	try {
		click(ids[0], 'id');
		key('ArrowDown', { shiftKey: true });
		key('ArrowDown', { shiftKey: true });
		report(boxSize() === '3x1', 'three rows selected, spanning the ID column', boxSize());
		const idsBefore = [ids[0], ids[1], ids[2]].map((id) => L.cellText('junctions', id, 'id'));
		function menuEl2() {
			return global.document.body.children.filter((c) => c['class'] === 'lpn-pane-ctxmenu').slice(-1)[0];
		}
		fire(tableEl, 'mousedown', { target: td(ids[0], 'id'), button: 2, shiftKey: false,
			preventDefault: function () {} });
		fire(tableEl, 'contextmenu', { target: td(ids[0], 'id'), clientX: 5, clientY: 5,
			preventDefault: function () {} });
		const menu = menuEl2();
		report(!!menu, 'the right-click menu opens on an ID-spanning selection');
		if (menu) { fire(menu.children[3], 'click', {}); }
		report(alerts === 0, 'Delete on a selection spanning the ID column raises no alert', String(alerts));
		const idsAfter = [ids[0], ids[1], ids[2]].map((id) => L.cellText('junctions', id, 'id'));
		report(JSON.stringify(idsAfter) === JSON.stringify(idsBefore),
			'...and every ID is unchanged', JSON.stringify(idsAfter));
	} finally { global.alert = realAlert; }
}

console.log(`\n${failures ? 'FAILURES' : 'all pass'}: ${checks - failures}/${checks}`);
process.exit(failures ? 1 : 0);
