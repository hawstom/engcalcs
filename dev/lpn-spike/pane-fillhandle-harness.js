// THE FILL HANDLE -- DRAG-TO-FILL -- ROADMAP Task 690's drag half (Ctrl+D and Ctrl+Enter are its
// keyboard half, both already shipped -- see pane-ctrlenter-harness.js and pane-filldown-harness.js).
// Run with:
//   node dev/lpn-spike/pane-fillhandle-harness.js
//
// What matters enough to assert headlessly:
//
//   1. The handle appears at the bottom-right corner of a selection that has at least one settable
//      cell, and is ABSENT where fill is not offered (an all-read-only or all-id selection).
//   2. Dragging down extends the fill by ROWS, tiling the source's own value into every new row.
//   3. Dragging right extends the fill by COLUMNS, the same tiling.
//   4. A 2-row source dragged down several more rows repeats its own pattern (ABABA), never a
//      series -- an id column in range never auto-increments, either.
//   5. A non-settable (id / read-only) column caught in the dragged range is skipped and counted,
//      never written, and no exception is thrown.
//   6. One Ctrl+Z undoes the whole drag.
//   7. Escape (or a plain release with no extension) cancels: nothing is written, no undo snapshot,
//      and the preview outline is gone.
//   8. A row the table's own filter is hiding is never in reach of the drag at all, because the
//      drag reads the same paneTableRowsInOrder() paste and Ctrl+D already trust for that.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

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
	"\t\tsetCell: function (id, elId, key, v) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\tpaneColByKey(s, key).set(el, v); },\n" +
	"\t\tcellText: function (id, elId, key) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\treturn paneCellText(paneColByKey(s, key), el); },\n" +
	// A selection set AND painted -- unlike the Ctrl+Enter harness's own selectBox(), the fill
	// handle's presence is a fact about the last PAINT, so the paint has to actually run for this
	// harness to see what a click or an arrow key would have produced.
	"\t\tselectBox: function (id, aKey, fKey, r0, r1) { var s = paneTableById(id),\n" +
	"\t\t\trows = paneTableRowsInOrder(s), cols = paneCols(s);\n" +
	"\t\t\ts.sel = { aId: rows[r0].id, aKey: aKey, fId: rows[r1].id, fKey: fKey };\n" +
	"\t\t\tpaneSelPaint(s, rows, cols); },\n" +
	"\t\tselBox: function (id) { var s = paneTableById(id);\n" +
	"\t\t\treturn paneSelBox(s, paneTableRowsInOrder(s), paneCols(s)); },\n" +
	"\t\tundoDepth: function () { return undoStack.length; }, undo: undo,\n" +
	"\t\tnotice: function () { return document.getElementById('lpn_map_notice').textContent || ''; },\n" +
	// THE HANDLE ITSELF, read off the spec the way the real page leaves it after paneSelPaint().
	"\t\thasHandle: function (id) { var s = paneTableById(id);\n" +
	"\t\t\treturn !!(s._fillHandleEl && s._fillHandleEl.parentNode); },\n" +
	"\t\tcornerOf: function (id) { var s = paneTableById(id);\n" +
	"\t\t\treturn s._fillCornerTd ? { id: s._fillCornerTd._lpnPaneId, key: s._fillCornerTd._lpnPaneKey } : null; },\n" +
	// THE DRAG, driven exactly the way the real pointer wiring drives it underneath --
	// paneFillHandleBegin() snapshots the table, paneFillHandleMoveToIndex() reads row/column
	// INDICES against that snapshot (what the real code's elementFromPoint()-based hit test also
	// resolves down to), and paneFillHandleEnd() commits or cancels. None of this touches a pointer
	// event; that plumbing is the one part of the feature this harness cannot and need not drive.
	"\t\tdragBegin: function (id) { return paneFillHandleBegin(paneTableById(id)); },\n" +
	"\t\tdragMoveTo: function (id, elId, key) { var s = paneTableById(id), d = s._fillDrag, r, c;\n" +
	"\t\t\tif (!d) { return; }\n" +
	"\t\t\tr = d.rows.map(function (x) { return x.id; }).indexOf(elId);\n" +
	"\t\t\tc = d.cols.map(function (x) { return x.key; }).indexOf(key);\n" +
	"\t\t\tpaneFillHandleMoveToIndex(s, r, c); },\n" +
	"\t\tdragTarget: function (id) { var s = paneTableById(id); return (s._fillDrag && s._fillDrag.target) || null; },\n" +
	"\t\tdragEnd: function (id, commit) { return paneFillHandleEnd(paneTableById(id), commit); },\n" +
	"\t\tpreviewCount: function (id) { var s = paneTableById(id); return Object.keys(s._fillPreview || {}).length; },\n" +
	// THE FILTER, through the page's own Find grammar -- the same door table-filter-harness.js and
	// customer-node-harness.js already use, so a query built here parses exactly as a typed one would.
	"\t\tsetFilter: function (scope, prop, op, value, tableId) {\n" +
	"\t\t\tfindState.scope = scope; findState.prop = prop; findState.op = op; findState.value = value;\n" +
	"\t\t\tpaneSetFilter(tableId, findQueryString()); },\n" +
	"\t\tclearFilter: function (tableId) { paneSetFilter(tableId, ''); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

// A drag that commits: begin, move to the far cell, end(true). Mirrors what the pointer wiring
// does, one call per step of the gesture.
function drag(id, toElId, toKey, commit) {
	const began = L.dragBegin(id);
	if (!began) { return { began: false, did: false }; }
	L.dragMoveTo(id, toElId, toKey);
	const did = L.dragEnd(id, commit !== false);
	return { began: true, did: did };
}

const ids = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0), L.addNode('junction', 20, 0),
	L.addNode('junction', 30, 0), L.addNode('junction', 40, 0)].map((n) => n.id);
ids.forEach((id, i) => { L.setCell('junctions', id, 'elev', 100 + i); L.setCell('junctions', id, 'demand', i); });
L.openPane('junctions');
L.renderTable('junctions');

console.log('\n--- 1. the handle is present only where a selection offers something to fill ---');
{
	L.selectBox('junctions', 'demand', 'demand', 2, 2);
	report(L.hasHandle('junctions'), 'a single settable cell shows the handle');
	report(JSON.stringify(L.cornerOf('junctions')) === JSON.stringify({ id: ids[2], key: 'demand' }),
		'the handle sits at the corner of the (one-cell) box', JSON.stringify(L.cornerOf('junctions')));

	L.selectBox('junctions', 'id', 'id', 1, 3);
	report(!L.hasHandle('junctions'), 'an id-only selection (never fillable) shows NO handle');

	L.selectBox('junctions', 'pressure', 'pressure', 0, 4);
	report(!L.hasHandle('junctions'), 'a read-only result column alone shows NO handle');

	L.selectBox('junctions', 'id', 'demand', 0, 2);
	report(L.hasHandle('junctions'), 'a box mixing id (unfillable) and demand (fillable) still shows the handle');
}

console.log('\n--- 2. dragging down extends the fill by ROWS, tiling one source value ---');
{
	L.setCell('junctions', ids[0], 'demand', 42);
	L.selectBox('junctions', 'demand', 'demand', 0, 0);
	const d0 = L.undoDepth();
	const r = drag('junctions', ids[4], 'demand');
	report(r.began && r.did, 'the drag committed');
	ids.forEach((id, i) => {
		report(L.cellText('junctions', id, 'demand') === '42', 'row ' + i + ' now reads the source value (42)',
			L.cellText('junctions', id, 'demand'));
	});
	report(L.undoDepth() === d0 + 1, 'the whole drag is ONE undo snapshot', d0 + ' -> ' + L.undoDepth());
	const box = L.selBox('junctions');
	report(!!box && box.r0 === 0 && box.r1 === 4, 'the selection afterward covers source + filled range (all 5 rows)',
		JSON.stringify(box));
}

console.log('\n--- 3. dragging right extends the fill by COLUMNS ---');
{
	ids.forEach((id, i) => L.setCell('junctions', id, 'elev', 100 + i));
	L.setCell('junctions', ids[0], 'elev', 7);
	L.selectBox('junctions', 'elev', 'elev', 0, 0);
	const r = drag('junctions', ids[0], 'demand');
	report(r.began && r.did, 'the rightward drag committed');
	report(L.cellText('junctions', ids[0], 'demand') === '7', 'Demand in row 0 now carries Elev\'s source value',
		L.cellText('junctions', ids[0], 'demand'));
	const box = L.selBox('junctions');
	report(!!box && box.c0 === box.c1 - 1, 'the selection afterward spans source + filled COLUMN, one row tall',
		JSON.stringify(box));
}

console.log('\n--- 4. a 2-row source dragged down several rows repeats its OWN PATTERN, never a series ---');
{
	L.setCell('junctions', ids[0], 'demand', 10);
	L.setCell('junctions', ids[1], 'demand', 20);
	L.selectBox('junctions', 'demand', 'demand', 0, 1);
	const r = drag('junctions', ids[4], 'demand');
	report(r.began && r.did, 'the pattern drag committed');
	// Source rows 0,1 = 10,20; target rows 2,3,4 tile ABAB from the source's own 2-row height:
	// row2 -> 10 (offset 0), row3 -> 20 (offset 1), row4 -> 10 (offset 0 again).
	report(L.cellText('junctions', ids[2], 'demand') === '10', 'row 2 repeats the source\'s first value (10)',
		L.cellText('junctions', ids[2], 'demand'));
	report(L.cellText('junctions', ids[3], 'demand') === '20', 'row 3 repeats the source\'s second value (20)',
		L.cellText('junctions', ids[3], 'demand'));
	report(L.cellText('junctions', ids[4], 'demand') === '10', 'row 4 wraps back to the source\'s first value (10), NOT a series (30)',
		L.cellText('junctions', ids[4], 'demand'));
}

console.log('\n--- 5. a non-settable column caught in the drag is skipped and counted, never thrown ---');
{
	ids.forEach((id, i) => L.setCell('junctions', id, 'demand', i));
	L.selectBox('junctions', 'id', 'pressure', 0, 0);   // id .. pressure spans every column in between too
	let threw = false;
	const beforeIds = ids.map((id) => L.cellText('junctions', id, 'id'));
	const beforePressure = ids.map((id) => L.cellText('junctions', id, 'pressure'));
	let r;
	try { r = drag('junctions', ids[4], 'pressure'); } catch (e) { threw = true; }
	report(!threw, 'no exception fires dragging across id and a read-only result column');
	report(!!r && r.began && r.did, 'the drag still committed (Demand and Elev in the span are settable)');
	ids.forEach((id, i) => {
		report(L.cellText('junctions', id, 'id') === beforeIds[i], 'row ' + i + '\'s id is untouched (never auto-incremented)',
			L.cellText('junctions', id, 'id'));
		report(L.cellText('junctions', id, 'pressure') === beforePressure[i], 'row ' + i + '\'s Pressure (result) is untouched');
	});
	const m = /Filled (\d+) cells\. (\d+) were not changed/.exec(L.notice());
	report(!!m, 'the notice reports what was filled and what was skipped', L.notice());
	if (m) { report(+m[2] > 0, '{skipped} counts at least the id and Pressure cells in range', L.notice()); }
}

console.log('\n--- 6. one Ctrl+Z undoes the whole drag ---');
{
	ids.forEach((id, i) => L.setCell('junctions', id, 'demand', i));
	const before = ids.map((id) => L.cellText('junctions', id, 'demand'));
	L.setCell('junctions', ids[0], 'demand', 88);
	L.selectBox('junctions', 'demand', 'demand', 0, 0);
	const d0 = L.undoDepth();
	drag('junctions', ids[4], 'demand');
	ids.forEach((id) => report(L.cellText('junctions', id, 'demand') === '88', 'every row reads 88 before undo'));
	report(L.undoDepth() === d0 + 1, 'exactly one snapshot was pushed for the drag');
	L.undo();
	// Row 0 is the SOURCE cell the drag read FROM, never written TO -- its 88 is the ordinary edit
	// that seeded the drag, not part of what the drag itself did, so undoing the drag leaves it
	// exactly where that edit left it (the same reasoning Ctrl+Enter's own harness applies to its
	// anchor cell).
	report(L.cellText('junctions', ids[0], 'demand') === '88', 'the SOURCE cell (never written by the drag) still reads 88');
	ids.slice(1).forEach((id, i) => {
		report(L.cellText('junctions', id, 'demand') === before[i + 1], 'one Ctrl+Z restores filled row ' + (i + 1) + '\'s pre-drag value',
			L.cellText('junctions', id, 'demand'));
	});
}

console.log('\n--- 7. Escape (or a release with no extension) cancels: nothing written, no undo, no preview ---');
{
	ids.forEach((id, i) => L.setCell('junctions', id, 'demand', i));
	const before = ids.map((id) => L.cellText('junctions', id, 'demand'));
	L.selectBox('junctions', 'demand', 'demand', 0, 0);
	const d0 = L.undoDepth();
	const began = L.dragBegin('junctions');
	report(began, 'the drag can begin');
	L.dragMoveTo('junctions', ids[3], 'demand');
	report(L.previewCount('junctions') > 0, 'a preview is painted while the drag is live', L.previewCount('junctions'));
	const did = L.dragEnd('junctions', false);   // Escape's own path: commit = false
	report(!did, 'Escape reports no fill happened');
	ids.forEach((id, i) => {
		report(L.cellText('junctions', id, 'demand') === before[i], 'row ' + i + ' is unchanged after Escape',
			L.cellText('junctions', id, 'demand'));
	});
	report(L.undoDepth() === d0, 'no undo snapshot was pushed by a cancelled drag');
	report(L.previewCount('junctions') === 0, 'the preview outline is gone once the drag ends');
	report(L.hasHandle('junctions'), 'the handle is back once the drag ends');

	console.log('   (a release with no extension at all -- the pointer never left the corner -- behaves the same)');
	L.dragBegin('junctions');
	L.dragMoveTo('junctions', ids[0], 'demand');   // the box's own corner: no row/col extension
	const did2 = L.dragEnd('junctions', true);     // even a "commit" release with nothing dragged out is a no-op
	report(!did2, 'a release with no dragged extension writes nothing');
	report(L.undoDepth() === d0, 'and still pushes no undo snapshot');
}

console.log('\n--- 8. a row the table\'s FILTER is hiding is never reached by the drag ---');
{
	const more = [L.addNode('junction', 0, 200), L.addNode('junction', 10, 200), L.addNode('junction', 20, 200)].map((n) => n.id);
	const allIds = ids.concat(more);
	// Demand 0..7 across the 8 junctions; "above 2" keeps the top 5 (demand 3..7) in the table and
	// filters the bottom 3 (demand 0..2) out of it -- exactly the rows the drag must never touch.
	allIds.forEach((id, i) => { L.setCell('junctions', id, 'demand', i); L.setCell('junctions', id, 'elev', 500); });
	L.setFilter('junction', 'demand', 'gt', '2', 'junctions');
	L.renderTable('junctions');
	const shown = allIds.filter((id) => L.cellText('junctions', id, 'demand') !== '' &&
		+L.cellText('junctions', id, 'demand') > 2);
	const hidden = allIds.filter((id) => +L.cellText('junctions', id, 'demand') <= 2);
	report(hidden.length > 0 && shown.length > 1, 'the fixture actually has both shown and hidden rows',
		'shown=' + shown.length + ' hidden=' + hidden.length);
	L.setCell('junctions', shown[0], 'elev', 999);
	L.selectBox('junctions', 'elev', 'elev', 0, 0);
	drag('junctions', shown[shown.length - 1], 'elev');
	shown.forEach((id) => report(L.cellText('junctions', id, 'elev') === '999', 'shown row ' + id + ' was filled to 999'));
	L.clearFilter('junctions');
	L.renderTable('junctions');
	hidden.forEach((id) => report(L.cellText('junctions', id, 'elev') === '500',
		'row ' + id + ', hidden by the filter during the drag, was NEVER TOUCHED', L.cellText('junctions', id, 'elev')));
}

console.log(`\n${failures ? 'FAILURES' : 'all pass'}: ${checks - failures}/${checks}`);
process.exit(failures ? 1 : 0);
