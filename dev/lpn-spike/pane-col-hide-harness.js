// COLUMN HIDE -- ROADMAP Task 690, Declan's design (dev/agents/data-entry-clerk/journal.md,
// "Column hide and reorder — the design Tom has agreed to in principle"). Run with:
//   node dev/lpn-spike/pane-col-hide-harness.js
//
// Reorder already shipped as the column-drag gesture (pane-column-drag-harness.js); this is the
// remaining half of that design. What matters enough to assert, headlessly:
//
//   1. Right-click (or long-press) a heading offers "Hide this column", and clicking it removes
//      the column from the RENDERED table -- not merely CSS-hides it -- so it is gone from
//      paneCols(), from a copy of the table, and from tabbing/arrow-jump for free.
//   2. ID cannot be hidden: it is the only door findGoTo() gives a click-to-pan action through.
//   3. The state is BROWSER FURNITURE, keyed per table id, in the SAME localStorage key column
//      widths and order already use (LPN_PANECOLS_KEY) -- never in serializeProject(), and it
//      survives a reload (a second, independent module over the same localStorage) exactly as a
//      dragged width does.
//   4. There is an obvious way back: the same right-click menu, opened on any remaining heading,
//      lists a hidden column by name and un-hides it on a click -- no separate popover needed.
//   5. SEVERAL HEADINGS CAN BE MARKED FIRST** (Tom: *"can we select multiple heading cells to hide
//      multiple columns at once?"*): Ctrl/Cmd+click toggles one heading into a standing selection,
//      Shift+click extends a range, and a right-click on any heading IN that selection hides all
//      of it at once, in one write. ID is silently dropped from the targets rather than blocking
//      the whole action. A right-click elsewhere is unchanged: the single-column case.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { setUnitSet, loadLoopedNetwork, clearResizeObservers } = require('./lpn-dom-stub.js');

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
	"\t\tsetColHidden: function (id, key, h) { paneSetColHidden(paneTableById(id), key, h); },\n" +
	"\t\tcolKeys: function (id) { return paneCols(paneTableById(id)).map(function (c) { return c.key; }); },\n" +
	"\t\tallColKeys: function (id) { return paneColsAll(paneTableById(id)).map(function (c) { return c.key; }); },\n" +
	"\t\theadCell: function (id, key) { return paneTableById(id).headCells[key]; },\n" +
	// **THE <th> ITSELF, NOT THE HEADING BUTTON** -- click/mousedown/drag-start moved from the
	// button to the cell (2026-09-25, second pass: a percentage height on a table cell's child
	// does not resolve to the cell's real height, so stretching the button could not make the
	// WHOLE cell one target; see js/looped-network.js's own comment). Kept as its own name here
	// rather than inlining `headCell()` at every call site below, since "the thing a click is
	// fired on" is a clearer name for what these tests are doing than "the heading cell" is.
	"\t\tsortBtn: function (id, key) { return paneTableById(id).headCells[key]; },\n" +
	"\t\theadSel: function (id) { return (paneTableById(id).headSel || []).slice(); },\n" +
	// **THROUGH paneColsAll(), NOT paneCols().** A test that needs to write a value into a
	// currently-hidden column -- to prove hiding does not delete it -- would find nothing through
	// the visible-only list.
	"\t\tcolByKeyAll: function (id, key) { var cs = paneColsAll(paneTableById(id)), i;\n" +
	"\t\t\tfor (i = 0; i < cs.length; i++) { if (cs[i].key === key) { return cs[i]; } } return null; },\n" +
	"\t\tcolLabel: function (id, key) { var cs = paneColsAll(paneTableById(id)),\n" +
	"\t\t\tc = cs.filter(function (x) { return x.key === key; })[0];\n" +
	"\t\t\treturn c ? paneHeadingText(c) : null; },\n" +
	"\t\tsetCell: function (id, elId, key, v) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0],\n" +
	"\t\t\tcs = paneColsAll(s), col, i;\n" +
	"\t\t\tfor (i = 0; i < cs.length; i++) { if (cs[i].key === key) { col = cs[i]; break; } }\n" +
	"\t\t\tcol.set(el, v); },\n" +
	"\t\tcopyTsv: function (id) { var s = paneTableById(id), rows = paneTableRowsInOrder(s),\n" +
	"\t\t\tcols = paneCols(s), box = paneSelBox(s, rows, cols);\n" +
	"\t\t\treturn box ? paneCopyTsv(s, rows, cols, box) : null; },\n" +
	// The whole-table selection itself is exercised by pane-select-harness.js; here it is only
	// the means to a copy, made directly through the same field paneHandleKey's own Ctrl+A sets.
	"\t\tselectAll: function (id) { var s = paneTableById(id), rows = paneTableRowsInOrder(s),\n" +
	"\t\t\tcols = paneCols(s);\n" +
	"\t\t\ts.sel = { aId: rows[0].id, aKey: cols[0].key,\n" +
	"\t\t\t\tfId: rows[rows.length - 1].id, fKey: cols[cols.length - 1].key }; },\n" +
	"\t\tserializeProject: serializeProject, prefsKey: LPN_PANECOLS_KEY,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n";

let L = loadLoopedNetwork(INJECT);
L.buildLayers();
const PC = global.EngCalcs.pageConfig;

function reload() {
	clearResizeObservers();
	const P = loadLoopedNetwork(INJECT);
	P.buildLayers();
	return P;
}

function fire(el, type, ev) {
	((el && el._listeners && el._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}
function menuEl() {
	return global.document.body.children.filter((c) => c.className === 'lpn-pane-ctxmenu').slice(-1)[0];
}
function rightClickHeading(id, colKey) {
	const th = L.headCell(id, colKey);
	fire(th, 'contextmenu', { clientX: 10, clientY: 20, preventDefault: function () {}, stopPropagation: function () {} });
	return menuEl();
}
function menuItem(menu, text) {
	return menu && menu.children.filter((b) => b.textContent === text)[0];
}

const ids = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0), L.addNode('junction', 20, 0)]
	.map((n) => n.id);
ids.forEach((id, i) => { L.setCell('junctions', id, 'elev', 100 + i); L.setCell('junctions', id, 'demand', 10 + i); });
L.openPane('junctions');
L.renderTable('junctions');

const demandLabel = L.colLabel('junctions', 'demand');

console.log('\n--- right-click a heading offers to hide it ---');
{
	const before = L.colKeys('junctions');
	report(before.indexOf('demand') >= 0, 'Demand starts visible', before.join(','));
	const menu = rightClickHeading('junctions', 'demand');
	report(!!menu, 'right-clicking the Demand heading opens a menu');
	const item = menuItem(menu, PC.lpn_pane_hide_col);
	report(!!item, 'the menu offers "Hide this column"');
	fire(item, 'click', {});
	const after = L.colKeys('junctions');
	report(after.indexOf('demand') < 0, 'Demand is gone from the rendered/interactive column list',
		after.join(','));
	report(L.allColKeys('junctions').indexOf('demand') >= 0,
		'...but Demand still exists in the full column list -- it is hidden, not removed');
	report(!L.headCell('junctions', 'demand'), 'and there is no <th> for it any more');
}

console.log('\n--- a hidden column is absent from a copy, not merely invisible ---');
{
	L.selectAll('junctions');
	const tsv = L.copyTsv('junctions');
	report(tsv.indexOf(demandLabel) < 0, 'the heading row of a copy carries no ' + demandLabel + ' column',
		tsv.split('\n')[0]);
	report(L.colKeys('junctions').indexOf('demand') < 0,
		'...the same absence a filtered-out row already gets, by construction');
}

console.log('\n--- ID cannot be hidden ---');
{
	const menu = rightClickHeading('junctions', 'id');
	const item = menu && menuItem(menu, PC.lpn_pane_hide_col);
	report(!item, 'the ID heading\'s own menu offers no "Hide this column"', menu ? 'menu opened' : 'no menu');
	// The setter refuses too, not only the menu (Perry, 2026-09-23: deleting the setter's own guard
	// left every check green, because only the menu was tested).
	L.setColHidden('junctions', 'id', true);
	report(L.colKeys('junctions').indexOf('id') >= 0, 'paneSetColHidden() itself refuses to hide ID');
}

console.log('\n--- the obvious way back: the menu on ANY heading lists a hidden column by name ---');
{
	const label = String(PC.lpn_pane_show_col || 'Show {col}').replace('{col}', demandLabel);
	const menu = rightClickHeading('junctions', 'elev');
	const item = menuItem(menu, label);
	report(!!item, 'a right-click on Elevation offers "' + label + '"',
		menu && menu.children.map((b) => b.textContent).join(' | '));
	fire(item, 'click', {});
	report(L.colKeys('junctions').indexOf('demand') >= 0, '...and clicking it brings Demand back');
	report(!!L.headCell('junctions', 'demand'), '...with a real <th> for it again');
}

console.log('\n--- it is browser furniture: the same key column widths already use, never the project ---');
{
	L.setCell('junctions', ids[0], 'demand', 42);   // give hiding something to survive alongside
	rightClickHeading('junctions', 'demand');
	fire(menuItem(menuEl(), PC.lpn_pane_hide_col), 'click', {});
	report(L.colKeys('junctions').indexOf('demand') < 0, 'Demand is hidden again, going into the reload test');
	const stored = JSON.parse(global.localStorage.getItem(L.prefsKey) || '{}');
	report(!!(stored.junctions && stored.junctions.hidden && stored.junctions.hidden.indexOf('demand') >= 0),
		'the hidden key sits in ' + L.prefsKey + ', beside the widths and the order',
		JSON.stringify(stored.junctions));
	const text = JSON.stringify(L.serializeProject());
	report(text.indexOf(L.prefsKey) < 0, 'serializeProject() has never heard of the preferences key');
	report(text.indexOf('"hidden"') < 0, '...and carries no hidden-column list under any name');
}

console.log('\n--- it persists across a reload, exactly as a dragged width does ---');
{
	L = reload();
	const ids2 = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0)].map((n) => n.id);
	ids2.forEach((id, i) => { L.setCell('junctions', id, 'elev', 100 + i); L.setCell('junctions', id, 'demand', 10 + i); });
	L.openPane('junctions');
	L.renderTable('junctions');
	report(L.colKeys('junctions').indexOf('demand') < 0,
		'a fresh module over the SAME localStorage opens with Demand still hidden');
	report(L.allColKeys('junctions').indexOf('demand') >= 0, '...Demand still exists, just hidden');
	L.setColHidden('junctions', 'demand', false);   // bring it back, going into the next section
}

console.log('\n--- several headings can be marked first, and one right-click hides them all ---');
{
	// Tom: *"But can we select multiple heading cells to hide multiple columns at once?"*
	function click(key, mod) {
		fire(L.sortBtn('junctions', key), 'click', Object.assign({}, mod));
	}
	// Ctrl/Cmd+click TOGGLES a heading into the standing selection, without sorting it.
	const sortBefore = JSON.stringify(L.colKeys('junctions'));
	click('elev', { ctrlKey: true });
	report(JSON.stringify(L.headSel('junctions')) === JSON.stringify(['elev']),
		'Ctrl+click marks Elevation', JSON.stringify(L.headSel('junctions')));
	click('demand', { ctrlKey: true });
	report(JSON.stringify(L.headSel('junctions')) === JSON.stringify(['elev', 'demand']),
		'Ctrl+click adds Demand to the standing selection', JSON.stringify(L.headSel('junctions')));
	report(JSON.stringify(L.colKeys('junctions')) === sortBefore,
		'...and neither click re-sorted the table -- a modifier click selects, it does not sort');

	// A right-click on a heading that IS in that selection hides the whole selection, ID excluded,
	// in one write -- and the menu says "these", not "this", because more than one is going.
	const menu = rightClickHeading('junctions', 'demand');
	const item = menuItem(menu, PC.lpn_pane_hide_cols);
	report(!!item, 'the menu offers "Hide these columns" (plural) for a multi-heading selection',
		menu && menu.children.map((b) => b.textContent).join(' | '));
	fire(item, 'click', {});
	const after = L.colKeys('junctions');
	report(after.indexOf('elev') < 0 && after.indexOf('demand') < 0,
		'both Elevation and Demand are hidden from one right-click', after.join(','));
	report(L.allColKeys('junctions').indexOf('elev') >= 0 && L.allColKeys('junctions').indexOf('demand') >= 0,
		'...hidden, not removed -- both still exist in the full list');

	// Bring them back for the next check.
	L.setColHidden('junctions', 'elev', false);
	L.setColHidden('junctions', 'demand', false);
}

console.log('\n--- a right-click OUTSIDE the standing selection is still the single-column case ---');
{
	function click(key, mod) { fire(L.sortBtn('junctions', key), 'click', Object.assign({}, mod)); }
	click('elev', { ctrlKey: true });
	report(JSON.stringify(L.headSel('junctions')) === JSON.stringify(['elev']), 'Elevation alone is marked');
	// Right-clicking a DIFFERENT heading (Tag, never touched by the Ctrl+click above) must act on
	// Tag alone, not silently drag Elevation along with it.
	const menu = rightClickHeading('junctions', 'tag');
	const item = menuItem(menu, PC.lpn_pane_hide_col);
	report(!!item, 'the menu offers the SINGULAR "Hide this column" -- Tag was never selected',
		menu && menu.children.map((b) => b.textContent).join(' | '));
	fire(item, 'click', {});
	const after = L.colKeys('junctions');
	report(after.indexOf('tag') < 0, 'Tag alone is hidden');
	report(after.indexOf('elev') >= 0, '...and Elevation, which was only Ctrl+clicked and never right-clicked, is untouched');
	L.setColHidden('junctions', 'tag', false);
}

console.log('\n--- ID inside a multi-selection is dropped, not a reason to refuse the rest ---');
{
	function click(key, mod) { fire(L.sortBtn('junctions', key), 'click', Object.assign({}, mod)); }
	click('id', { ctrlKey: true });
	click('elev', { ctrlKey: true });
	report(JSON.stringify(L.headSel('junctions')) === JSON.stringify(['id', 'elev']), 'ID and Elevation are both marked');
	const menu = rightClickHeading('junctions', 'elev');
	fire(menuItem(menu, PC.lpn_pane_hide_col), 'click', {});
	const after = L.colKeys('junctions');
	report(after.indexOf('id') >= 0, 'ID stayed visible -- it is never a hide target, even inside a selection');
	report(after.indexOf('elev') < 0, '...but Elevation, the rest of the same selection, was hidden');
	L.setColHidden('junctions', 'elev', false);
}

// **A PLAIN CLICK NO LONGER CLEARS TO NOTHING; IT SELECTS** (2026-09-25, second pass: Tom's "a
// click anywhere on the cell selects the column" -- sorting moved to the "..." menu and its
// arrow). A plain click on a DIFFERENT heading REPLACES the standing selection with that column
// alone, which is the new way a reader gets back to "just one heading marked" -- see
// pane-heading-menu-harness.js for the click/sort split in full.
console.log('\n--- a plain click on a heading replaces any standing selection with itself ---');
{
	function click(key, mod) { fire(L.sortBtn('junctions', key), 'click', Object.assign({}, mod)); }
	click('elev', { ctrlKey: true });
	report(L.headSel('junctions').length === 1, 'a heading is marked going in');
	click('demand', {});
	report(JSON.stringify(L.headSel('junctions')) === JSON.stringify(['demand']),
		'a plain click on another heading replaces the selection with that column alone',
		JSON.stringify(L.headSel('junctions')));
}

console.log(`\n${failures ? 'FAILURES' : 'all pass'}: ${checks - failures}/${checks}`);
process.exit(failures ? 1 : 0);
