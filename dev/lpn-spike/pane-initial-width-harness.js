// **THE INITIAL COLUMN WIDTH RULE** (Tom, 2026-09-27, verbatim): *"Set initial table column width
// to hold the greater (max) of (a) the known, present, current contents of the column not counting
// 'No....' selectors or (b) the heading's longest word not counting units, with any word 8
// characters or longer split into two parts for the purposes of this calculation."* Alongside it,
// two more of the same session: *"Let's try making the ID column of every table centered
// horizontally"*, and a complaint about the Vertices cell's flat `N/E/N/E/N/E` reading. Run with:
//   node dev/lpn-spike/pane-initial-width-harness.js
//
// What this asserts:
//   1. A table with real, present content in a column opens WIDER than its heading alone would
//      require (rule a beating rule b) -- Pipes' Description on a real long sentence.
//   2. A table with a long single-word heading and NO content opens at the SPLIT-WORD floor, not
//      the whole word (rule b, the 8-char split) -- Junctions' Description on an empty table.
//   3. A selector column with nothing chosen ("No pattern" etc.) does not inflate the width past
//      what a table where every row HAS chosen something would draw -- rule (a)'s "not counting
//      'No....' selectors".
//   4. The ID column is centred, on screen and on the printed sheet, in more than one table.
//   5. The Vertices cell displays the new `n/e|n/e|...` form, and the parser accepts both it and
//      the old flat `n/n/n/n/...` form, round-tripping either one losslessly.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const ROOT = path.resolve(__dirname, '..', '..');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}

setUnitSet('us');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tpaneTableById: paneTableById, openPane: openPane,\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\tpasteAt: function (id, text) { return panePasteAt(paneTableById(id), libPasteCells(text)); },\n" +
	"\t\tpasteAppend: function (id, text) { var s = paneTableById(id); renderPaneTable(s);\n" +
	"\t\t\treturn panePasteAt(s, libPasteCells(text), { append: true }); },\n" +
	"\t\theadings: function (id) { return paneCols(paneTableById(id)).map(function (c) { return { key: c.key, h: paneHeadingText(c) }; }); },\n" +
	"\t\twidthEm: function (id, key) { var s = paneTableById(id); return paneColWidthEm(s, paneColByKey(s, key)); },\n" +
	"\t\tcellText: function (id, elId, key) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\treturn paneCellText(paneColByKey(s, key), el); },\n" +
	"\t\tsetCell: function (id, elId, key, v) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\tvar p = paneParseCellText(paneColByKey(s, key), v); if (p.ok) { paneColByKey(s, key).set(el, p.v); } return p.ok; },\n" +
	"\t\tlinkById: function (elId) { return doc.links.filter(function (x) { return x.id === elId; })[0]; },\n" +
	"\t\tth: function (id, key) { var s = paneTableById(id); return s.headCells && s.headCells[key]; },\n" +
	"\t\ttd: function (id, elId, key) { var s = paneTableById(id); return s.tds && s.tds[elId] && s.tds[elId][key]; },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [], customers: [], origin: { x: 0, y: 0 } };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tscenarios = defaultScenarios(); project.activeScenario = 'base'; undoStack.length = 0;\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tpaneTables().forEach(function (s) { s.sel = null; s.orderIds = null; s.sig = ''; s.cells = null; s.initEmCache = null; }); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

function pipeRow(o, keys) {
	return keys.map((k) => (o[k] === undefined ? '' : String(o[k]))).join('\t');
}

console.log('\n--- 1. real, present content beats the heading (rule a over rule b) ---');
{
	const keys = L.headings('pipes').map((c) => c.key);
	const longDesc = 'Force main along Elm Street from the booster station to the elevated tank';
	L.pasteAppend('junctions', 'J1\t0\t0\nJ2\t100\t0');
	L.pasteAppend('pipes', pipeRow({ id: 'P1', from: 'J1', to: 'J2', desc: longDesc }, keys));
	const withContent = L.widthEm('pipes', 'desc');
	// The heading alone ("Description", 11 characters, split per rule b) would draw far less than
	// a real 74-character sentence measured whole under rule (a).
	report(withContent > 8, 'a real Description sentence widens the column well past the heading floor', withContent);
}

console.log('\n--- 2. no content: the heading\'s longest word, SPLIT at 8+ characters (rule b) ---');
{
	L.reset();
	const noContent = L.widthEm('junctions', 'desc');
	// "Description" is 11 characters (>= 8), split Math.ceil(11/2) = 6/5 ("Descri"/"ption"); only
	// the longer half counts. It must be well short of the whole unsplit word's own width.
	report(noContent > 0 && noContent < 6, 'an empty Description column opens at a SPLIT word, not the whole one', noContent);
	const headings = L.headings('junctions');
	report(headings.some((h) => h.key === 'desc'), 'sanity: the junctions table has a Description column');
}

console.log('\n--- 3. a "No ..." selector does not count as content (rule a\'s exclusion) ---');
{
	L.reset();
	const keys = L.headings('pipes').map((c) => c.key);
	L.pasteAppend('junctions', 'J1\t0\t0\nJ2\t100\t0');
	L.pasteAppend('pipes', pipeRow({ id: 'P1', from: 'J1', to: 'J2' }, keys));
	// P1's pipe type is unset, so its cell reads the "No pipe type selected" placeholder choice --
	// a long sentence that must NOT inflate the column past the heading-only floor.
	report(L.headings('pipes').some((c) => c.key === 'typeId'), 'sanity: the pipe type column exists');
	const withNone = L.widthEm('pipes', 'typeId');
	// A column of nothing but unset selectors must equal a column with no rows at all: both see no
	// content, so both fall through to rule (b) alone.
	L.reset();
	const emptyTable = L.widthEm('pipes', 'typeId');
	report(Math.abs(withNone - emptyTable) < 0.01,
		'an all-"No pipe type selected" column is no wider than an empty one -- the placeholder does not count',
		withNone + ' vs ' + emptyTable);
}

console.log('\n--- 4. the ID column is centred, on screen and on paper ---');
{
	const CSS = require('./pane-table-css.js').load(path.join(ROOT, 'css', 'engcalcs.css'));
	const blind = [];
	const html = { tag: 'html', cls: [] };
	const panel = { tag: 'div', cls: ['lpn-pane-panel', 'lpn-pane-scroll', 'on'] };
	const table = { tag: 'table', cls: ['lpn-pane-table'] };
	const printTable = { tag: 'table', cls: ['lpn-pane-table', 'lpn-print-table'] };
	const thead = { tag: 'thead', cls: [] };
	const tr = { tag: 'tr', cls: [] };
	const idCls = ['lpn-pane-col-id', 'lpn-pane-first'];
	const screenTh = [html, panel, table, thead, tr, { tag: 'th', cls: idCls }];
	const screenTd = [html, panel, table, tr, { tag: 'td', cls: idCls }];
	const printTh = [html, printTable, thead, tr, { tag: 'th', cls: idCls }];
	const printTd = [html, printTable, tr, { tag: 'td', cls: idCls }];
	report(CSS.winning(CSS.rules, screenTh, 1200, 'text-align', blind) === 'center' &&
		CSS.winning(CSS.rules, screenTd, 1200, 'text-align', blind) === 'center',
		'the ID heading and cell are centred on screen');
	report(CSS.winning(CSS.rules, printTh, 1200, 'text-align', blind, 'print') === 'center' &&
		CSS.winning(CSS.rules, printTd, 1200, 'text-align', blind, 'print') === 'center',
		'...and on the printed sheet too, through the same shared class');
	// Scoped to what this section's own chains could possibly meet (pane-harness.js's own rule):
	// a reader that reported every OTHER selector in the whole stylesheet as "unreadable" would be
	// ignored within a week.
	const mine = [...new Set(blind)].filter((sel) =>
		/lpn-pane/.test(sel) && !/[:[]/.test(sel.replace('html:has(#lpn_canvas)', '')));
	report(mine.length === 0, 'nothing about the ID rule was unreadable to the stylesheet reader', mine.join(' | '));

	// And in the real rendered table (Junctions and Pipes both), the class is actually there.
	['junctions', 'pipes'].forEach((id) => {
		L.renderTable(id);
		const th = L.th(id, 'id');
		report(!!th && String(th.className || '').indexOf('lpn-pane-col-id') >= 0,
			id + ': the rendered ID heading carries the centring class', th && th.className);
	});
}

console.log('\n--- 5. the Vertices cell: n/e|n/e|... on screen, either form on paste ---');
{
	L.reset();
	const keys = L.headings('pipes').map((c) => c.key);
	L.pasteAppend('junctions', 'J1\t0\t0\nJ2\t100\t0\nJ3\t200\t0');
	L.pasteAppend('pipes', pipeRow({ id: 'P1', from: 'J1', to: 'J3', verts: '0/100/50/120' }, keys));
	report(L.cellText('pipes', 'P1', 'verts') === '0/100|50/120',
		'two vertices display as n/e|n/e, not the old flat n/n/n/n', L.cellText('pipes', 'P1', 'verts'));
	// The NEW form parses too, and round-trips to itself.
	report(L.setCell('pipes', 'P1', 'verts', '5/6|7/8'),
		'the new |-separated form is accepted by the parser');
	report(L.cellText('pipes', 'P1', 'verts') === '5/6|7/8',
		'...and reads back exactly as the new form, unchanged', L.cellText('pipes', 'P1', 'verts'));
	// The OLD flat form still parses (a table copied before this change), reading back in the NEW
	// display -- lossless in VALUE, even though the separator it displays with has changed.
	report(L.setCell('pipes', 'P1', 'verts', '1/2/3/4'),
		'the old flat n1/n2/n3/n4 form is still accepted');
	report(L.cellText('pipes', 'P1', 'verts') === '1/2|3/4',
		'...and reads back with the new separator between vertices', L.cellText('pipes', 'P1', 'verts'));
	const p1 = L.linkById('P1');
	report(p1 && p1.verts.length === 2 && L.linkById('P1').verts[0].x === 1,
		'...and the geometry itself is the same two vertices either way');
	// A single vertex has no separator to change, and both a malformed old- and new-style cell are
	// still refused as a whole.
	report(L.setCell('pipes', 'P1', 'verts', '10/20') && L.cellText('pipes', 'P1', 'verts') === '10/20',
		'a single vertex is unaffected by the separator change');
	report(!L.setCell('pipes', 'P1', 'verts', '1/2/3'), 'a malformed OLD-style cell (odd count) is still refused');
	report(!L.setCell('pipes', 'P1', 'verts', '1/2|3'), 'a malformed NEW-style cell (an incomplete pair) is still refused');
	report(!L.setCell('pipes', 'P1', 'verts', '1/2|3/x'), 'a non-numeric token in the NEW form is still refused');
}

console.log(`\n${failures === 0 ? 'all pass' : 'FAILURES'}: ${checks - failures}/${checks}`);
process.exit(failures === 0 ? 0 : 1);
