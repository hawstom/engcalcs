// TOM'S FIFTH PASS OVER THE TABLES (Task 690, 2026-09-21): the halves a stub can decide. Run with:
//   node dev/lpn-spike/pane-review-5-harness.js
//
// The layout halves -- the heading seam (R-112), the column floors (R-110) and what a switch costs in
// milliseconds (R-111) -- need a layout engine and live in dev/browser-pass/specs/tables.js. What is
// here is the STATE behind three of them, which is exact and runs on every commit:
//
//   R-109  *"The page loads with the current table blank. I have to switch away and back to see
//          that table."* -- a document ARRIVING redraws the table on show, solve or no solve.
//   R-111  *"Switching to Junctions the first time and some subsequent times delayed about 3
//          seconds or more."* -- showing a table again refills it; it does not rebuild it.
//   R-113  *"Switching tables (tabs) leaves the tab selected instead of the currently highlighted
//          cell."* -- a tab click puts the caret on the table's current cell.
//
// (R-115, the right-click row's wording, is a language-file value and is asserted BY KEY in
// dev/browser-pass/specs/tables.js and pane-review-harness.js; pinning the English here is what
// harness_wording_check.php exists to stop.)

'use strict';

const fs = require('fs');
const path = require('path');
const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}

setUnitSet('us');
const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tpaneTableById: paneTableById, openPane: openPane, setPaneTab: setPaneTab,\n" +
	"\t\tarrived: paneDocumentArrived, renderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\tcells: function (id) { return paneTableById(id).cells; },\n" +
	"\t\ttds: function (id) { return paneTableById(id).tds; },\n" +
	"\t\tselBox: function (id) { var s = paneTableById(id);\n" +
	"\t\t\treturn paneSelBox(s, paneTableRowsInOrder(s), paneCols(s)); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

function tableOf(id) { return (byId['lpn_pane_' + id].children || []).filter((c) => c._tag === 'table')[0] || null; }
function rowsOf(id) {
	const t = tableOf(id);
	const tb = t && t.children.filter((c) => c._tag === 'tbody')[0];
	return tb ? tb.children.length : 0;
}

// ---- R-109 -------------------------------------------------------------------------------------
console.log('\n--- R-109: a document arriving redraws the table on show ---');
{
	// The boot order, exactly: the pane is opened on Junctions BEFORE any project has been read,
	// which is what wirePane() does from the stored pane state.
	L.openPane('junctions');
	report(rowsOf('junctions') === 0, 'with no document yet, the Junctions table has no rows', rowsOf('junctions'));
	// Then the document arrives -- and nothing solves, which is Recalculate off.
	L.addNode('junction', 0, 0); L.addNode('junction', 10, 0); L.addNode('junction', 20, 0);
	report(rowsOf('junctions') === 0, '...adding parts alone does not redraw a hidden-by-time table (the stale state R-109 saw)',
		rowsOf('junctions'));
	L.arrived();
	report(rowsOf('junctions') === 3, 'the arrival draws all three junctions, with no solve and no tab switch', rowsOf('junctions'));
	// And nothing stands above it to scroll away and move the heading (Tom, 2026-09-21, on the
	// retired paste note: *"When I scroll past the last visible row, that message disappears, and
	// the headings jump upward."*).
	report(byId.lpn_pane_junctions.children[0] === tableOf('junctions'),
		'the table is the first thing in its panel, with no note above it', byId.lpn_pane_junctions.children[0]._tag);
	const src = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'looped-network.js'), 'utf8');
	report((src.match(/paneDocumentArrived\(\);/g) || []).length >= 2,
		'...and it is called on BOTH arrival doors, the boot path and refreshAllFromDocument()',
		(src.match(/paneDocumentArrived\(\);/g) || []).length + ' calls');
}

// ---- R-111 -------------------------------------------------------------------------------------
console.log('\n--- R-111: showing a table again refills it, it does not rebuild it ---');
{
	L.addLink('pipe', L.getDoc().nodes[0].id, L.getDoc().nodes[1].id);
	L.setPaneTab('junctions');
	const t1 = tableOf('junctions');
	const cell1 = L.cells('junctions')[L.getDoc().nodes[0].id].elev;
	L.setPaneTab('pipes');
	L.getDoc().nodes[0].elev = 123;   // a change made while the table was not on show
	L.setPaneTab('junctions');
	report(tableOf('junctions') === t1, 'coming back to Junctions shows the same <table>, not a new one');
	report(L.cells('junctions')[L.getDoc().nodes[0].id].elev === cell1, '...with the same cell controls in it');
	report(String(cell1.value) === '123', '...refilled with what changed while it was hidden', cell1.value);
	// And a change that DOES alter what the table is still rebuilds it.
	L.setPaneTab('pipes');
	L.addNode('junction', 30, 0);
	L.setPaneTab('junctions');
	report(tableOf('junctions') !== t1 && rowsOf('junctions') === 4,
		'a new junction added while hidden rebuilds the table, so the row is there', rowsOf('junctions') + ' rows');
}

// ---- R-113 -------------------------------------------------------------------------------------
console.log('\n--- R-113: a tab click puts the caret on the table’s current cell ---');
{
	global.document.activeElement = null;
	L.setPaneTab('pipes');
	L.setPaneTab('junctions');
	const box = L.selBox('junctions');
	report(!!box, 'an untouched table gets a current cell, as a spreadsheet opens on A1', JSON.stringify(box));
	const active = global.document.activeElement;
	report(!!active && !!active._lpnCell, 'the focus is a cell control of the table, not the tab button',
		active ? (active._tag || active.tagName) : 'nothing');
	// A selection made before leaving is the one standing after coming back.
	const second = L.getDoc().nodes[1].id;
	L.cells('junctions')[second].elev.focus();
	(tableOf('junctions')._listeners.focusin || []).forEach((f) => f({ target: L.tds('junctions')[second].elev }));
	L.setPaneTab('pipes');
	global.document.activeElement = null;
	L.setPaneTab('junctions');
	report(global.document.activeElement === L.cells('junctions')[second].elev,
		'coming back, the caret is on the cell it left', global.document.activeElement &&
			global.document.activeElement.getAttribute && global.document.activeElement.getAttribute('aria-label'));
}

console.log(failures ? `\nFAILURES: ${failures}/${checks}` : `\nall pass: ${checks}/${checks}`);
process.exit(failures ? 1 : 0);
