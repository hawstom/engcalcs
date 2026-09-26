// THE TABLES PANE HEADING, SECOND PASS -- Tom, 2026-09-25, on the first build: (1) "there is only
// one selection possible and one cursor for a heading... A click anywhere on the cell selects the
// column" (no more click-to-sort, no selectable text); (2) the sort arrow inside the heading text
// "should go"; (3) sorting comes from the "..." menu, with an arrow that appears once a column IS
// sorted, "maybe just below the menu"; (4) the Manage columns dialog should "do nothing until OK"
// and reorder by moving a SELECTION with buttons outside the list, not one row's own arrows.
// Run with:
//   node dev/lpn-spike/pane-heading-menu-harness.js
//
// What this asserts, headlessly:
//   1. A plain click on a heading SELECTS that column and never sorts; Ctrl/Shift+click still
//      build a multi-column selection exactly as before.
//   2. The "..." glyph opens the column menu (Sort ascending/descending, Hide, Show all, Manage
//      columns…), and a press that travels (a drag) is not read as the click that follows it.
//   3. Choosing Sort ascending/descending from the menu sorts; the sort arrow then exists ONLY on
//      that column's heading, and clicking the arrow reverses the sort without reopening the menu.
//   4. The Manage columns dialog applies NOTHING until OK -- Cancel discards every checkbox and
//      every move -- and a selection built with click/Ctrl+click/Shift+click moves as one block
//      with Move up / Move down / Move to beginning / Move to end.
//
// What this CANNOT see, said plainly: whether the heading's own text is visually unselectable
// (`user-select: none` is a CSS fact, and this stub has no layout engine), whether the "..." glyph
// or the arrow LOOK quiet-but-visible rather than truly hidden, and the real mouse/touch drag
// gesture end to end. dev/browser-pass/specs/colselect.js and colmanage.js drive all of that in a
// real Chromium; this harness holds the STATE those pixels are drawn from.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { byId, setUnitSet, loadLoopedNetwork, clearResizeObservers } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}

setUnitSet('us');

const INJECT =
	"\t\tgetDoc: function () { return doc; }, addNode: addNode,\n" +
	"\t\tpaneTableById: paneTableById, openPane: openPane,\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\tcolKeys: function (id) { return paneCols(paneTableById(id)).map(function (c) { return c.key; }); },\n" +
	"\t\tallColKeys: function (id) { return paneColsAll(paneTableById(id)).map(function (c) { return c.key; }); },\n" +
	"\t\tcolHidden: paneColHidden,\n" +
	"\t\theadCell: function (id, key) { return paneTableById(id).headCells[key]; },\n" +
	"\t\theadSel: function (id) { return (paneTableById(id).headSel || []).slice(); },\n" +
	"\t\tsortState: function (id) { var s = paneTableById(id); return { col: s.sort.col, dir: s.sort.dir }; },\n" +
	"\t\topenManageDialog: function (id) { paneOpenManageColsDialog(paneTableById(id)); },\n" +
	"\t\tsetCell: function (id, elId, key, v) { var s = paneTableById(id),\n" +
	"\t\t\tel = doc.nodes.filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\tpaneColByKey(s, key).set(el, v); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n";

let L = loadLoopedNetwork(INJECT);
L.buildLayers();
const PC = global.EngCalcs.pageConfig;

function fire(el, type, ev) {
	((el && el._listeners && el._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}
function docFire(type, ev) {
	((global.document._listeners && global.document._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}
// A token match, so 'lpn-pane-sort' never answers for 'lpn-pane-sortarrow' or the reverse.
function hasToken(el, tok) { return (' ' + (el.className || '') + ' ').indexOf(' ' + tok + ' ') !== -1; }
function colMenuBtn(id, key) { return L.headCell(id, key).children.filter((c) => hasToken(c, 'lpn-pane-colmenu'))[0]; }
function sortArrowBtn(id, key) { return L.headCell(id, key).children.filter((c) => hasToken(c, 'lpn-pane-sortarrow'))[0] || null; }
function ctxMenuEl() { return global.document.body.children.filter((c) => c.className === 'lpn-pane-ctxmenu').slice(-1)[0]; }
function menuItem(menu, text) { return menu && menu.children.filter((b) => b.textContent === text)[0]; }
// The dialog's own tree is walked rather than addressed by a fixed shape, so a class name is the
// only thing this harness has to agree with the page code on.
function findAll(root, cls) {
	const out = [];
	(function walk(el) {
		if (!el || !el.children) { return; }
		el.children.forEach((c) => { if (hasToken(c, cls)) { out.push(c); } walk(c); });
	}(root));
	return out;
}
function dialogRows() { return findAll(byId.lpn_dialog_body, 'lpn-managecols-row'); }
function dialogBtn(text) { return byId.lpn_dialog_body.children ? findAll(byId.lpn_dialog_body, 'lpn-managecols-btns')
	.reduce((a, b) => a.concat(b.children), []).filter((b) => b.textContent === text)[0] : null; }
function dialogOkCancel(text) { return (byId.lpn_dialog_buttons.children || []).filter((b) => b.textContent === text)[0]; }

const ids = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0), L.addNode('junction', 20, 0)]
	.map((n) => n.id);
ids.forEach((id, i) => { L.setCell('junctions', id, 'elev', 100 + i); L.setCell('junctions', id, 'demand', 10 + i); });
L.openPane('junctions');
L.renderTable('junctions');

console.log('\n--- 1. a plain click SELECTS the column and never sorts ---');
{
	const before = L.sortState('junctions');
	// **THE CLICK LISTENER IS ON THE `<th>`, NOT THE HEADING BUTTON** (see
	// js/looped-network.js's own comment: a percentage height on a table cell's child does not
	// resolve to the cell's real height, so the click/mousedown/drag-start handlers that make the
	// WHOLE cell one target had to move up a level). Firing on `headingBtn()` would find nothing
	// in this stub, which does not simulate DOM event bubbling from a child to its ancestor --
	// `L.headCell()` is the real target now.
	fire(L.headCell('junctions', 'demand'), 'click', {});
	report(JSON.stringify(L.headSel('junctions')) === JSON.stringify(['demand']),
		'a plain click on the heading selects that column alone', JSON.stringify(L.headSel('junctions')));
	report(JSON.stringify(L.sortState('junctions')) === JSON.stringify(before),
		'...and does not change the sort', JSON.stringify(L.sortState('junctions')));
	// A second plain click on a DIFFERENT heading replaces the selection, it does not add to it.
	fire(L.headCell('junctions', 'elev'), 'click', {});
	report(JSON.stringify(L.headSel('junctions')) === JSON.stringify(['elev']),
		'a plain click on another heading replaces the selection', JSON.stringify(L.headSel('junctions')));
	// Ctrl+click and Shift+click still build a multi-column selection, unaffected by the change.
	fire(L.headCell('junctions', 'demand'), 'click', { ctrlKey: true });
	report(L.headSel('junctions').sort().join(',') === ['demand', 'elev'].sort().join(','),
		'Ctrl+click still ADDS a column to the standing selection', JSON.stringify(L.headSel('junctions')));
	// Shift+click extends from the ANCHOR (the last heading a plain or Ctrl+click landed on --
	// here 'demand', from the Ctrl+click just above) to the Shift-clicked heading, inclusive of
	// every column between them -- exactly the R-221 range Tom asked for, checked against the
	// table's own column order rather than a hard-coded count.
	const cols = L.colKeys('junctions'), iAnchor = cols.indexOf('demand'), iTarget = cols.indexOf('id');
	const expectedRange = cols.slice(Math.min(iAnchor, iTarget), Math.max(iAnchor, iTarget) + 1);
	fire(L.headCell('junctions', 'id'), 'click', { shiftKey: true });
	report(L.headSel('junctions').slice().sort().join(',') === expectedRange.slice().sort().join(','),
		'Shift+click extends a range from the anchor (the last Ctrl+click) to here, inclusive',
		JSON.stringify(L.headSel('junctions')));
}

console.log('\n--- 2. the "..." menu opens the column menu; a drag is not read as the click after it ---');
{
	const menu = (fire(colMenuBtn('junctions', 'demand'), 'click', { stopPropagation: function () {} }), ctxMenuEl());
	report(!!menu, 'the "..." button opens a menu');
	const sortAsc = menuItem(menu, PC.lpn_pane_sort_asc), sortDesc = menuItem(menu, PC.lpn_pane_sort_desc),
		manage = menuItem(menu, PC.lpn_pane_manage_cols);
	report(!!sortAsc && !!sortDesc, 'it offers Sort ascending and Sort descending', JSON.stringify(menu.children.map((b) => b.textContent)));
	report(!!manage, '...and Manage columns…');
	// A press that travels is a drag, not a click: the heading button's own click handler checks
	// spec.headDragged and returns without changing the selection when it is set (renderPaneTable()).
	const spec = L.paneTableById('junctions');
	const before = L.headSel('junctions').slice();
	spec.headDragged = true;
	fire(L.headCell('junctions', 'id'), 'click', {});
	report(JSON.stringify(L.headSel('junctions')) === JSON.stringify(before),
		'a click that ends a drag (headDragged) changes nothing', JSON.stringify(L.headSel('junctions')));
	report(spec.headDragged === false, '...and the flag is consumed, not left standing for the next real click');
}

console.log('\n--- 3. sort from the menu; the arrow exists ONLY on the sorted column, and reverses it ---');
{
	report(!sortArrowBtn('junctions', 'demand'), 'no arrow yet: nothing is sorted by Demand');
	fire(colMenuBtn('junctions', 'demand'), 'click', { stopPropagation: function () {} });
	fire(menuItem(ctxMenuEl(), PC.lpn_pane_sort_asc), 'click', {});
	report(JSON.stringify(L.sortState('junctions')) === JSON.stringify({ col: 'demand', dir: 1 }),
		'Sort ascending from the menu sorts by that column', JSON.stringify(L.sortState('junctions')));
	const arrow = sortArrowBtn('junctions', 'demand');
	report(!!arrow, 'the sorted column now carries an arrow');
	report(!hasToken(arrow, 'lpn-pane-sortarrow-desc'), '...pointing ascending', arrow.className);
	['id', 'elev'].forEach((k) => report(!sortArrowBtn('junctions', k), 'and no OTHER column carries one: ' + k));
	fire(arrow, 'click', { stopPropagation: function () {} });
	report(JSON.stringify(L.sortState('junctions')) === JSON.stringify({ col: 'demand', dir: -1 }),
		'clicking the arrow reverses the sort, without touching WHICH column is sorted', JSON.stringify(L.sortState('junctions')));
	report(hasToken(sortArrowBtn('junctions', 'demand'), 'lpn-pane-sortarrow-desc'), '...and the arrow itself now points the other way');
	// Menu-driven Sort descending still works, on top of the arrow.
	fire(colMenuBtn('junctions', 'demand'), 'click', { stopPropagation: function () {} });
	fire(menuItem(ctxMenuEl(), PC.lpn_pane_sort_desc), 'click', {});
	report(L.sortState('junctions').dir === -1, 'Sort descending from the menu still works too');
}

console.log('\n--- 4. Manage columns: nothing applies until OK; Cancel discards; a SELECTION moves as a block ---');
{
	const before = L.colKeys('junctions'), beforeHidden = before.map((k) => L.colHidden('junctions', k));
	fire(colMenuBtn('junctions', 'id'), 'click', { stopPropagation: function () {} });
	fire(menuItem(ctxMenuEl(), PC.lpn_pane_manage_cols), 'click', {});
	let rows = dialogRows();
	report(rows.length === before.length, 'one dialog row per column', rows.length + ' vs ' + before.length);
	const rowLabel = (r) => r.children[1].textContent;
	const label1 = rowLabel(rows[1]), label3 = rowLabel(rows[3]);
	// Uncheck row 2's Show box -- a real browser flips `checked` itself before running the click
	// listener; this stub's fire() only calls the listener, so the flip is done here to stand in
	// for it -- and confirm it does NOT touch the live table.
	rows[2].children[0].checked = false;
	fire(rows[2].children[0], 'click', {});
	report(JSON.stringify(L.colKeys('junctions')) === JSON.stringify(before),
		'unchecking Show in the dialog does not touch the live table before OK', JSON.stringify(L.colKeys('junctions')));
	// Select rows 1 and 3 (not side by side) with click then Ctrl+click, and move to the beginning.
	// **EACH ROW CLICK REDRAWS THE LIST** (fresh <div>s, same as renderPaneTable() does for the
	// table itself), so `rows[3]` fired on below is already the pre-redraw element -- its listener
	// closure still runs the right index, but checking `.classList` on IT afterward would read a
	// detached node. `dialogRows()` is re-queried fresh after both clicks, the way a real reader's
	// eye would.
	fire(rows[1], 'click', {});
	fire(rows[3], 'click', { ctrlKey: true });
	rows = dialogRows();
	report(rows[1].classList.contains('lpn-managecols-row-sel') && rows[3].classList.contains('lpn-managecols-row-sel'),
		'click then Ctrl+click selects two rows that are not side by side');
	report(!rows[0].classList.contains('lpn-managecols-row-sel') && !rows[2].classList.contains('lpn-managecols-row-sel'),
		'...and only those two');
	// Each button is re-queried fresh at the moment it is pressed, never held across a redraw --
	// the same staleness rule the row elements need above, since the button ROW does not redraw
	// but the buttons' disabled state does, and this stub is standing in for a real DOM either way.
	report(!!dialogBtn(PC.lpn_pane_manage_cols_top) && !!dialogBtn(PC.lpn_pane_manage_cols_bottom) &&
		!!dialogBtn(PC.lpn_pane_manage_cols_up) && !!dialogBtn(PC.lpn_pane_manage_cols_down),
		'all four move buttons exist outside the list');
	fire(dialogBtn(PC.lpn_pane_manage_cols_top), 'click', {});
	const afterTop = dialogRows();
	report(rowLabel(afterTop[0]) === label1 && rowLabel(afterTop[1]) === label3,
		'Move to beginning moves the whole (non-contiguous) selection to the top, in its own relative order',
		JSON.stringify(afterTop.map(rowLabel)));
	report(JSON.stringify(L.colKeys('junctions')) === JSON.stringify(before),
		'...still nothing applied to the live table', JSON.stringify(L.colKeys('junctions')));
	fire(dialogBtn(PC.lpn_pane_manage_cols_bottom), 'click', {});
	let now = dialogRows();
	report(rowLabel(now[now.length - 2]) === label1 && rowLabel(now[now.length - 1]) === label3,
		'Move to end moves the selection to the end, in the same relative order', JSON.stringify(now.map(rowLabel)));
	fire(dialogBtn(PC.lpn_pane_manage_cols_up), 'click', {});
	now = dialogRows();
	report(rowLabel(now[now.length - 3]) === label1, 'Move up moves the block up one step', JSON.stringify(now.map(rowLabel)));
	fire(dialogBtn(PC.lpn_pane_manage_cols_down), 'click', {});
	now = dialogRows();
	report(rowLabel(now[now.length - 2]) === label1, 'Move down moves it back down one step', JSON.stringify(now.map(rowLabel)));
	// Cancel: the live table must show the untouched original order and hidden state.
	fire(dialogOkCancel(PC.lpn_cancel), 'click', {});
	report(JSON.stringify(L.colKeys('junctions')) === JSON.stringify(before), 'Cancel discards every change made in the dialog',
		JSON.stringify(L.colKeys('junctions')));
	report(before.every((k, i) => L.colHidden('junctions', k) === beforeHidden[i]), '...including every Show checkbox');

	// Reopen: repeat hide + move-to-top, and this time press OK.
	fire(colMenuBtn('junctions', 'id'), 'click', { stopPropagation: function () {} });
	fire(menuItem(ctxMenuEl(), PC.lpn_pane_manage_cols), 'click', {});
	const rows2 = dialogRows();
	const hiddenKey = before[2];
	rows2[2].children[0].checked = false;
	fire(rows2[2].children[0], 'click', {});
	fire(rows2[1], 'click', {});
	fire(rows2[3], 'click', { ctrlKey: true });
	fire(dialogBtn(PC.lpn_pane_manage_cols_top), 'click', {});
	fire(dialogOkCancel(PC.lpn_dialog_ok), 'click', {});
	report(L.colHidden('junctions', hiddenKey), 'OK applies the hide', hiddenKey);
	const liveNow = L.colKeys('junctions');
	report(liveNow.indexOf(hiddenKey) === -1, '...the hidden column is gone from the live, visible list', liveNow.join(','));
	// The moved pair (before[1], before[3] -- the hidden column, before[2], is not one of them) now
	// leads the VISIBLE list, in their own relative order: exactly what colmanage.js also drives in
	// a real Chromium, checked here by KEY rather than by rendered label text.
	report(liveNow[0] === before[1] && liveNow[1] === before[3],
		'OK applies the reorder too: the moved pair leads the visible list, in order', liveNow.slice(0, 2).join(','));
	// Survives a rebuild exactly as a dragged width does (same LPN_PANECOLS_KEY).
	L.renderTable('junctions');
	report(JSON.stringify(L.colKeys('junctions')) === JSON.stringify(liveNow),
		'the hide and the reorder both survive a table rebuild', JSON.stringify(L.colKeys('junctions')));
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
