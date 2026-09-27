// PASTE THAT CREATES ROWS -- ROADMAP Task 610, built to dev/paste-creates-rows-spec.md and, for the
// Vertices cell, dev/agents/data-entry-clerk/task-610-vertex-cell-spec.md. Run with:
//   node dev/lpn-spike/pane-row-paste-harness.js
//
// Tom's conditions are the whole of the task: a paste that ADDS is refused unless every row
// carries an ID that collides with nothing, a link row names two existing nodes, and a vertex cell
// has a stated format. What this asserts:
//
//   1. 400 junction rows pasted into an EMPTY table (through the note that stands in for it)
//      create 400 junctions, at the stated positions, in ONE undo step, and one Ctrl+Z removes all.
//   2. A duplicate ID -- against an existing element, and within the same pasted block -- refuses
//      the WHOLE paste, cells over existing rows included, and the notice names the row.
//   3. A new node with a blank coordinate refuses the whole paste.
//   4. Pipe rows join existing nodes; a pipe naming a missing node refuses the whole paste.
//   5. The Vertices cell: n1/n2/... read in slot order, whole cell or nothing, the typed latitude
//      kept exactly through a save on a geographic project.
//   6. A scenario: a pasted element is born as a drawn one is (inactive in Base, active here), its
//      position is its construction, and its property cells are this scenario's overrides.
//   9. Paste as new rows at end of table is its own action (cell and heading menus arm it, Ctrl+Shift+V does it),
//      it leaves existing rows byte-identical, and an ordinary paste never creates an element.
//   7. A real exported network, tab-separated with a heading row (EPANET's Net1, in this page's own
//      column order), pasted table by table into an empty project.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
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
	"\t\tpaneTableById: paneTableById, openPane: openPane,\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\tpasteAt: function (id, text) { return panePasteAt(paneTableById(id), libPasteCells(text)); },\n" +
	"\t\tpasteAppend: function (id, text) { var s = paneTableById(id); renderPaneTable(s);\n" +
	"\t\t\treturn panePasteAt(s, libPasteCells(text), { append: true }); },\n" +
	"\t\tspec: paneTableById, armed: function (id) { return !!paneTableById(id).appendArmed; },\n" +
	"\t\tctxMenu: function (id, elId, key) { var s = paneTableById(id); paneOpenContextMenu(s, 1, 1, s.tds[elId][key]); },\n" +
	"\t\tcolMenu: function (id, key) { paneOpenColMenu(paneTableById(id), 1, 1, key); },\n" +
	"\t\theadings: function (id) { return paneCols(paneTableById(id)).map(function (c) { return { key: c.key, h: paneHeadingText(c) }; }); },\n" +
	"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\tselectCell: function (id, elId, key) { paneTableById(id).sel = { aId: elId, aKey: key, fId: elId, fKey: key }; },\n" +
	"\t\tsel: function (id) { return paneTableById(id).sel; },\n" +
	"\t\tcellText: function (id, elId, key) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\treturn paneCellText(paneColByKey(s, key), el); },\n" +
	"\t\tsetCell: function (id, elId, key, v) { var s = paneTableById(id),\n" +
	"\t\t\tel = (s.group === 'link' ? doc.links : doc.nodes).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\tvar p = paneParseCellText(paneColByKey(s, key), v); if (p.ok) { paneColByKey(s, key).set(el, p.v); } return p.ok; },\n" +
	"\t\tundoDepth: function () { return undoStack.length; }, undo: undo,\n" +
	"\t\teffective: effective, baseValue: baseValue, hasOverride: hasOverride,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, inBase: inBaseScenario,\n" +
	"\t\tnotice: function () { return document.getElementById('lpn_map_notice').textContent || ''; },\n" +
	"\t\tvalidateNewId: validateNewId,\n" +
	"\t\tnodeById: nodeById, linkById: linkById, outwardX: outwardX, outwardY: outwardY,\n" +
	"\t\tserialize: serializeProject, GEO: LPN_COORDS_GEO,\n" +
	"\t\tsetCoords: function (k) { project.coords = k; },\n" +
	"\t\tsetDefault: function (k, v) { settings.defaults[k] = v; }, getDefault: function (k) { return settings.defaults[k]; },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [], customers: [], origin: { x: 0, y: 0 } };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tscenarios = defaultScenarios(); project.activeScenario = 'base'; undoStack.length = 0;\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tpaneTables().forEach(function (s) { s.sel = null; s.orderIds = null; s.sig = ''; s.cells = null; }); },\n" +
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
function tableEl(id) { return byId['lpn_pane_' + id].children.filter((c) => c._tag === 'table')[0]; }
// The empty table's own paste target: the note renderPaneTable() puts where the table would be.
function pasteIntoEmpty(tableId, text) {
	L.openPane(tableId);
	L.renderTable(tableId);
	const host = byId['lpn_pane_' + tableId];
	const note = host.children.filter((c) => c._tag === 'p').slice(-1)[0];
	if (!note || !(note._listeners && note._listeners.paste)) { return null; }
	let prevented = false;
	fire(note, 'paste', { clipboardData: { getData: () => text }, preventDefault: () => { prevented = true; } });
	return { prevented, note };
}
// Every expected sentence is built from the language file, never restated: a reworded string must
// not break this harness (harness_wording_pins).
const PC = global.EngCalcs.pageConfig;
function say(key, vals) {
	let t = String(PC[key]);
	Object.keys(vals || {}).forEach((k) => { t = t.replace('{' + k + '}', String(vals[k])); });
	return t;
}
function has(text, key, vals) { return String(text || '').indexOf(say(key, vals)) >= 0; }
const REFUSED = say('lpn_pane_paste_refused', { reasons: '' }).trim();
function nodes() { return L.getDoc().nodes; }
function dlgButtons() { return byId.lpn_dialog_buttons.children; }
function dlgButton(label) { return dlgButtons().filter((c) => c.textContent === label)[0]; }
function dlgText() { return byId.lpn_dialog_body.children.map((c) => c.textContent).join(' '); }
function links() { return L.getDoc().links; }

console.log('\n--- 1. 400 junction rows into an empty table: 400 junctions, one undo step ---');
{
	L.reset();
	const lines = [];
	for (let i = 1; i <= 400; i++) { lines.push(['J-' + i, String(i * 10), String(i * 5)].join('\t')); }
	const d0 = L.undoDepth(), t0 = Date.now();
	const res = pasteIntoEmpty('junctions', lines.join('\r\n'));
	const ms = Date.now() - t0;
	report(!!res, 'an empty Junctions table offers a paste target');
	report(res && has(res.note.textContent, 'lpn_pane_paste_here'), '...and says so on the note', res && res.note.textContent);
	report(res && res.prevented, 'the paste is claimed, not left to the browser');
	report(nodes().length === 400, '400 junctions were created', String(nodes().length));
	report(nodes().every((n) => n.type === 'junction'), '...all of them junctions');
	const j7 = L.nodeById('J-7');
	report(!!j7 && L.cellText('junctions', 'J-7', 'axis1') === '70' && L.cellText('junctions', 'J-7', 'axis2') === '35',
		'each one sits at the X and Y its row stated', j7 && (L.cellText('junctions', 'J-7', 'axis1') + ',' + L.cellText('junctions', 'J-7', 'axis2')));
	report(j7 && j7.elev === 0 && j7._demand === 0, 'a blank elevation and demand take the new-asset defaults',
		j7 && JSON.stringify({ elev: j7.elev, demand: j7._demand }));
	report(L.undoDepth() === d0 + 1, 'the whole paste is ONE undo snapshot', d0 + ' -> ' + L.undoDepth());
	report(has(L.notice(), 'lpn_pane_pasted_rows', { n: 400, created: 400 }), 'the notice counts rows added, not cells', L.notice());
	report(ms < 5000, '400 rows paste in reasonable time headlessly', ms + ' ms');
	const s = L.sel('junctions');
	report(s && s.aId === 'J-1' && s.fId === 'J-400', 'the new rows are left selected, first to last', JSON.stringify(s));
	L.undo();
	report(nodes().length === 0, 'ONE Ctrl+Z removes all 400', String(nodes().length));
}

console.log('\n--- 2. a duplicate ID refuses the WHOLE paste ---');
{
	L.reset();
	pasteIntoEmpty('junctions', 'A\t0\t0\nB\t10\t0\nC\t20\t0');
	L.setCell('junctions', 'C', 'elev', '100');
	L.openPane('junctions'); L.renderTable('junctions');
	const d0 = L.undoDepth();
	const before = JSON.stringify(nodes());
	let r = L.pasteAppend('junctions', 'D\t30\t0\nA\t40\t0');
	report(r && r.refused === true, 'an ID already in the network refuses the paste', r && JSON.stringify(r.errors));
	report(r && r.errors.length === 1 && r.errors[0] === say('lpn_pane_paste_id_taken', { row: 2, id: 'A' }),
		'...naming the row of the pasted block and the reason', r && r.errors[0]);
	report(nodes().length === 3 && !L.nodeById('D'), 'nothing was created, not even the good row D');
	report(JSON.stringify(nodes()) === before, 'and the existing rows are exactly as they were');
	report(L.undoDepth() === d0, 'a refused paste takes no undo snapshot');
	report(L.notice().indexOf(REFUSED) === 0, 'the notice says nothing was pasted', L.notice());

	r = L.pasteAppend('junctions', 'D\t30\t0\nE\t40\t0\nD\t50\t0');
	report(r && r.refused === true && r.errors.length === 1 && r.errors[0] === say('lpn_pane_paste_id_twice', { row: 3, id: 'D' }),
		'an ID used twice WITHIN the pasted block refuses it too', r && r.errors[0]);
	report(nodes().length === 3, '...and creates nothing', String(nodes().length));

	r = L.pasteAppend('junctions', '\t30\t0\nE F\t40\t0');
	report(r && r.errors.length === 2 && r.errors[0] === say('lpn_pane_paste_no_id', { row: 1 }) && r.errors[1] === say('lpn_pane_paste_bad_id', { row: 2, id: 'E F' }),
		'a blank ID and an ID with a space are each named', r && JSON.stringify(r.errors));

	// Many bad rows: five named, the rest counted.
	const many = [];
	for (let i = 0; i < 12; i++) { many.push('A\t' + i + '\t0'); }
	r = L.pasteAppend('junctions', many.join('\n'));
	report(L.notice().indexOf(REFUSED) === 0 && has(L.notice(), 'lpn_pane_paste_more', { n: 7 }),
		'twelve failing rows: five are named and seven counted', L.notice());

	// A clean block on the new row appends, and the rows above it are byte-identical after.
	r = L.pasteAppend('junctions', 'D\t30\t0\t\t\t1\t560\nE\t40\t0');
	report(r && r.created === 2 && L.nodeById('D') && L.nodeById('E'), 'Paste as new rows at end of table adds every line',
		r && JSON.stringify(r));
	report(JSON.stringify(nodes().slice(0, 3)) === before, 'APPEND TOUCHES NO EXISTING ROW: A, B and C are byte-identical after');
	report(L.tableOrder('junctions').join(',') === 'A,B,C,D,E', 'the table reads A, B, C, D, E', L.tableOrder('junctions').join(','));
	report(L.cellText('junctions', 'D', 'elev') === '560', '...with the new row\'s cells written', L.cellText('junctions', 'D', 'elev'));
	report(has(L.notice(), 'lpn_pane_pasted_rows', { n: 2, created: 2 }), 'the notice says 2 rows, 2 added', L.notice());

	// An ORDINARY paste on the last row is a spreadsheet paste: that row is written (a DIFFERENT
	// value, so the overwrite is visible) and what runs past the bottom is dropped and counted. It
	// never creates an element and never deletes one.
	const n5 = nodes().length, e0 = L.cellText('junctions', 'E', 'elev');
	L.selectCell('junctions', 'E', 'id');
	r = L.pasteAt('junctions', 'E\t45\t0\t\t\t1\t777\nF\t50\t0');
	report(r && r.asked === true && nodes().length === n5 && !L.nodeById('F') && L.cellText('junctions', 'E', 'elev') === e0,
		'an ordinary paste running past the last row writes nothing and creates nothing until it is answered', r && JSON.stringify(r));
	fire(dlgButton(PC.lpn_cancel), 'click');
}

console.log('\n--- 3. a new node with no position refuses the paste ---');
{
	const n0 = nodes().length;
	let r = L.pasteAppend('junctions', 'G\t\t7');
	report(r && r.refused === true && r.errors[0] === say('lpn_pane_paste_no_position', { row: 1, first: PC.lpn_field_x, second: PC.lpn_field_y }),
		'a blank coordinate is refused, naming both axes the project uses', r && r.errors[0]);
	r = L.pasteAppend('junctions', 'G\tabc\t7');
	report(r && r.refused === true && r.errors[0] === say('lpn_pane_paste_bad_cell', { row: 1, text: 'abc', col: PC.lpn_field_x }),
		'a coordinate that is not a number is refused, naming the column', r && r.errors[0]);
	r = L.pasteAppend('junctions', 'G\t50\t0\t\t\t1\tlots');
	report(r && r.refused === true && r.errors[0] === say('lpn_pane_paste_bad_cell', { row: 1, text: 'lots', col: L.headings('junctions').filter((c) => c.key === 'elev')[0].h }),
		'any other cell of a new row that cannot be read refuses it too', r && r.errors[0]);
	report(nodes().length === n0, 'nothing was created by any of them');
}

console.log('\n--- 4. pipe rows join existing nodes; a missing node refuses the paste ---');
{
	L.reset();
	pasteIntoEmpty('junctions', 'N1\t0\t0\nN2\t100\t0\nN3\t100\t100');
	const cols = L.headings('pipes').map((c) => c.key);
	function pipeRow(o) { return cols.map((k) => (o[k] === undefined ? '' : String(o[k]))).join('\t'); }
	let res = pasteIntoEmpty('pipes', [pipeRow({ id: 'P1', from: 'N1', to: 'N2', diameter: 8 }),
		pipeRow({ id: 'P2', from: 'N2', to: 'N3' })].join('\n'));
	report(links().length === 2, 'two pipe rows create two pipes', String(links().length));
	const p1 = L.linkById('P1'), p2 = L.linkById('P2');
	report(p1 && p1.from === 'N1' && p1.to === 'N2' && p1.type === 'pipe', 'P1 joins N1 to N2');
	report(p1 && p1._diameter === 8, 'a stated diameter is written', p1 && String(p1._diameter));
	report(p2 && p2._diameter === L.getDefault('diameter') && p2.lenAuto === true && Math.abs(p2._length - 100) < 1e-9,
		'a blank diameter takes the new-asset default, and the length follows the drawing as a drawn pipe\'s does',
		p2 && JSON.stringify({ d: p2._diameter, len: p2._length, auto: p2.lenAuto }));
	let r = L.pasteAppend('pipes', [pipeRow({ id: 'P3', from: 'N3', to: 'N1' }), pipeRow({ id: 'P3b', from: 'N3', to: 'N9' })].join('\n'));
	report(r && r.refused === true && r.errors[0] === say('lpn_pane_paste_no_node', { row: 2, id: 'N9' }),
		'a pipe naming a node that does not exist refuses the paste', r && r.errors[0]);
	r = L.pasteAppend('pipes', pipeRow({ id: 'P3', from: 'N3' }));
	report(r && r.refused === true && r.errors[0] === say('lpn_pane_paste_no_ends', { row: 1 }),
		'a pipe with a blank To refuses the paste', r && r.errors[0]);
	r = L.pasteAppend('pipes', pipeRow({ id: 'P3', from: 'N3', to: 'N3' }));
	report(r && r.refused === true && r.errors[0] === say('lpn_pane_paste_same_ends', { row: 1 }),
		'a pipe from a node to itself refuses the paste', r && r.errors[0]);
	r = L.pasteAppend('pipes', pipeRow({ id: 'P1', from: 'N3', to: 'N1' }));
	report(r && r.refused === true && r.errors[0] === say('lpn_pane_paste_id_taken', { row: 1, id: 'P1' }),
		'a pipe ID another PIPE already has is taken', r && r.errors[0]);
	report(links().length === 2, 'none of those created anything', String(links().length));
	// **NODES AND LINKS ARE SEPARATE NAMESPACES** (Tom, 2026-09-26: "Junctions and pipes can use
	// same ID."). A pipe may be called N1 while junction N1 exists.
	r = L.pasteAppend('pipes', pipeRow({ id: 'N1', from: 'N3', to: 'N1' }));
	report(r && r.created === 1 && L.linkById('N1') && L.nodeById('N1') && L.linkById('N1').from === 'N3',
		'a pipe may share its ID with a junction, by paste', r && JSON.stringify(r));
	// ...and by rename, through the same rule the Properties box and the ID cell use.
	report(L.validateNewId('N2', 'P2', 'link') === true, 'renaming pipe P2 to N2 (a junction\'s ID) is allowed');
	report(L.validateNewId('P1', 'P2', 'link') !== true, 'renaming it to P1 (another pipe\'s) is not');
	report(L.validateNewId('N3', 'N2', 'node') !== true && L.validateNewId('P1', 'N2', 'node') === true,
		'and for a node: another node\'s ID is taken, a pipe\'s is free');
	L.setCell('pipes', 'P2', 'id', 'N2');
	report(L.linkById('N2') && L.nodeById('N2') && L.linkById('N2').from === 'N2' && L.linkById('N2').to === 'N3',
		'the ID cell renames pipe P2 to N2, and its ends still name junctions N2 and N3');
}

console.log('\n--- 5. the Vertices cell, per the clerk\'s vertex spec ---');
{
	const cols = L.headings('pipes');
	const vh = cols.filter((c) => c.key === 'verts')[0];
	report(!!vh && vh.h === 'Vertices (X/Y|…)', 'the Pipes table has a Vertices column whose heading states the order', vh && vh.h);
	const keys = cols.map((c) => c.key);
	function pipeRow(o) { return keys.map((k) => (o[k] === undefined ? '' : String(o[k]))).join('\t'); }
	let r = L.pasteAppend('pipes', pipeRow({ id: 'P4', from: 'N1', to: 'N3', verts: '0/100/50/120' }));
	const p4 = L.linkById('P4');
	report(r && r.created === 1 && p4 && p4.verts.length === 2, 'n1/n2/n3/n4 is two vertices', p4 && JSON.stringify(p4.verts));
	report(p4 && L.outwardX(p4.verts[0].x) === 0 && L.outwardY(p4.verts[0].y) === 100 &&
		L.outwardX(p4.verts[1].x) === 50 && L.outwardY(p4.verts[1].y) === 120,
		'...read in pairs, X then Y on a grid project, From end first');
	// A pasted flat n1/n2/n3/n4 cell (the old format) reads back with the new '|'-between-vertices
	// display (Tom, 2026-09-27): '/' still joins a pair, '|' now separates one vertex from the next.
	report(L.cellText('pipes', 'P4', 'verts') === '0/100|50/120', 'the cell reads back with the new vertex-separator display', L.cellText('pipes', 'P4', 'verts'));
	report(p4 && Math.abs(p4._length - (100 + Math.hypot(50, 20) + Math.hypot(50, 20))) < 1e-9,
		'the auto length follows the bends', p4 && String(p4._length));
	r = L.pasteAppend('pipes', pipeRow({ id: 'P5', from: 'N1', to: 'N3', verts: '0/100/50' }));
	report(r && r.refused === true && r.errors[0] === say('lpn_pane_paste_bad_cell', { row: 1, text: '0/100/50', col: vh.h }),
		'an odd count refuses the whole paste', r && r.errors[0]);
	r = L.pasteAppend('pipes', pipeRow({ id: 'P5', from: 'N1', to: 'N3', verts: '0,100,50,120' }));
	report(r && r.refused === true, 'commas are not the separator, and a cell using them is refused, not half-read', r && r.errors[0]);
	// On an existing pipe, a bad cell is refused and counted like any other cell, and the old
	// vertices stay; a good one replaces them; an empty one straightens it.
	L.selectCell('pipes', 'P4', 'verts');
	r = L.pasteAt('pipes', '1/2/3');
	report(r && r.refused === 1 && L.linkById('P4').verts.length === 2, 'a malformed cell on an existing pipe leaves its vertices alone');
	L.selectCell('pipes', 'P4', 'verts');
	r = L.pasteAt('pipes', '10/110');
	report(L.linkById('P4').verts.length === 1 && L.cellText('pipes', 'P4', 'verts') === '10/110', 'a good one replaces them');
	report(L.setCell('pipes', 'P4', 'verts', '') && L.linkById('P4').verts.length === 0, 'an empty cell is a straight pipe');

	// A geographic project: latitude first, and the typed characters survive a save.
	L.reset();
	L.setCoords(L.GEO);
	pasteIntoEmpty('junctions', 'G1\t40.7128\t-74.006\nG2\t40.7306\t-73.9866');
	const gh = L.headings('junctions');
	report(gh[1].h === 'Latitude' && gh[2].h === 'Longitude', 'a geographic project reads Latitude, Longitude', gh[1].h + ', ' + gh[2].h);
	const vcol = L.headings('pipes').filter((c) => c.key === 'verts')[0];
	report(vcol && vcol.h === 'Vertices (Latitude/Longitude|…)', '...and so does the Vertices heading', vcol && vcol.h);
	const gkeys = L.headings('pipes').map((c) => c.key);
	pasteIntoEmpty('pipes', gkeys.map((k) => ({ id: 'GP', from: 'G1', to: 'G2', verts: '40.7135/-74.0071/40.72/-73.99' })[k] || '').join('\t'));
	report(L.cellText('pipes', 'GP', 'verts') === '40.7135/-74.0071|40.72/-73.99', 'the vertex cell reads back the typed latitude and longitude',
		L.cellText('pipes', 'GP', 'verts'));
	const saved = L.serialize();
	const sv = saved.links.filter((l) => l.id === 'GP')[0].verts;
	report(sv[0].y === 40.7135 && sv[0].x === -74.0071 && sv[1].y === 40.72 && sv[1].x === -73.99,
		'a save writes the typed numbers exactly, not a projection residual', JSON.stringify(sv));
	const sn = saved.nodes.filter((n) => n.id === 'G1')[0];
	report(sn.y === 40.7128 && sn.x === -74.006, 'and a pasted node\'s position too', JSON.stringify({ x: sn.x, y: sn.y }));
	const r2 = L.pasteAppend('junctions', 'G3\t95\t0');
	report(r2 && r2.refused === true && r2.errors[0] === say('lpn_pane_paste_bad_cell', { row: 1, text: '95', col: PC.lpn_field_lat }), 'a latitude off the map is refused', r2 && r2.errors[0]);
	L.setCoords(undefined);
}

console.log('\n--- 6. inside a scenario: born as a drawn element is, cells as overrides ---');
{
	L.reset();
	pasteIntoEmpty('junctions', 'B1\t0\t0\t\t\t1\t10\t5');
	const scn = L.createScenario('Growth');
	L.switchScenario(scn.id);
	const r = L.pasteAppend('junctions', 'S1\t50\t0\t\t\t1\t20\t7');
	const s1 = L.nodeById('S1');
	report(r && r.created === 1 && !!s1, 'a scenario paste creates the new junction');
	report(s1 && s1._active === false && L.hasOverride(s1, 'active') && L.effective(s1, 'active') === true,
		'it is born inactive in Base and active in this scenario, exactly as a drawn one is');
	report(s1 && L.cellText('junctions', 'S1', 'axis1') === '50' && s1.x === 50 && !L.hasOverride(s1, 'x'),
		'its position is its construction, not an override on a node at 0, 0');
	report(s1 && L.hasOverride(s1, 'demand') && L.effective(s1, 'demand') === 7,
		'its demand, an overridable property, is this scenario\'s override', s1 && String(L.effective(s1, 'demand')));
	const b1 = L.nodeById('B1');
	report(L.baseValue(b1, 'demand') === 5, 'the existing row\'s Base demand did not move', String(L.baseValue(b1, 'demand')));
	L.undo();
	report(!L.nodeById('S1'), 'one Ctrl+Z takes the scenario paste back');
	L.switchScenario('base');
}

console.log('\n--- 7. undo restores exactly ---');
{
	L.reset();
	pasteIntoEmpty('junctions', 'U1\t0\t0\nU2\t10\t0');
	const before = JSON.stringify(L.serialize().nodes);
	L.pasteAppend('junctions', 'U3\t20\t0\nU4\t30\t0\t\t\t1\t99');
	report(nodes().length === 4 && L.nodeById('U4').elev === 99, 'the paste landed');
	L.undo();
	report(JSON.stringify(L.serialize().nodes) === before, 'Ctrl+Z restores the document byte for byte');
}

console.log('\n--- 8. a real exported network: Net1, tab-separated, with a heading row ---');
{
	L.reset();
	const inp = fs.readFileSync(path.join(__dirname, 'reference', 'Net1.inp'), 'utf8');
	const sec = {};
	let cur = null;
	inp.split(/\r?\n/).forEach((ln) => {
		const m = /^\s*\[(\w+)\]/.exec(ln);
		if (m) { cur = m[1]; sec[cur] = sec[cur] || []; return; }
		const t = ln.replace(/;.*$/, '').trim();
		if (cur && t) { sec[cur].push(t.split(/\s+/)); }
	});
	const xy = {};
	sec.COORDINATES.forEach((r) => { xy[r[0]] = [r[1], r[2]]; });
	// The sheet a clerk would keep: this page's own headings (a copy never puts these on the
	// clipboard itself, R-310, but an external spreadsheet's export legitimately has them), one
	// row per element, blanks where the sheet has nothing to say.
	function sheet(tableId, rows) {
		const hs = L.headings(tableId);
		return [hs.map((c) => c.h).join('\t')].concat(rows.map((o) => hs.map((c) => (o[c.key] === undefined ? '' : String(o[c.key]))).join('\t'))).join('\r\n');
	}
	pasteIntoEmpty('junctions', sheet('junctions', sec.JUNCTIONS.map((r) => ({ id: r[0], axis1: xy[r[0]][0], axis2: xy[r[0]][1], elev: r[1], demand: r[2] }))));
	pasteIntoEmpty('reservoirs', sheet('reservoirs', sec.RESERVOIRS.map((r) => ({ id: r[0], axis1: xy[r[0]][0], axis2: xy[r[0]][1], head: r[1] }))));
	pasteIntoEmpty('tanks', sheet('tanks', sec.TANKS.map((r) => ({ id: r[0], axis1: xy[r[0]][0], axis2: xy[r[0]][1], elev: r[1], level: r[2], minLevel: r[3], maxLevel: r[4], tankDiameter: r[5] }))));
	// Net1 has junction 10 AND pipe 10, and with nodes and links in separate namespaces (Tom,
	// 2026-09-26) its pipe sheet pastes verbatim, exactly as EPANET wrote it.
	pasteIntoEmpty('pipes', sheet('pipes', sec.PIPES.map((r) => ({ id: r[0], from: r[1], to: r[2], length: r[3], diameter: r[4], roughness: r[5] }))));
	const pipesSaid = L.notice();
	pasteIntoEmpty('pumps', sheet('pumps', sec.PUMPS.map((r) => ({ id: r[0], from: r[1], to: r[2] }))));
	report(nodes().filter((n) => n.type === 'junction').length === sec.JUNCTIONS.length &&
		nodes().filter((n) => n.type === 'reservoir').length === 1 && nodes().filter((n) => n.type === 'tank').length === 1,
		'every junction, the reservoir and the tank were created, and no heading row became a node',
		nodes().map((n) => n.id).join(','));
	report(!L.nodeById('ID'), 'the heading row was recognized and skipped');
	report(links().filter((l) => l.type === 'pipe').length === sec.PIPES.length && links().filter((l) => l.type === 'pump').length === 1,
		'every pipe and the pump were created', String(links().length) + ' / ' + pipesSaid);
	report(!!L.linkById('10') && !!L.nodeById('10') && L.linkById('10').from === '10' && L.linkById('10').to === '11',
		'pipe 10 and junction 10 both exist, and pipe 10 joins junctions 10 and 11');
	const bad = sec.PIPES.filter((r) => { const l = L.linkById(r[0]); return !l || l.from !== r[1] || l.to !== r[2] ||
		l._diameter !== +r[4] || l._length !== +r[3] || l._roughness !== +r[5] || l.lenAuto !== false; });
	report(bad.length === 0, 'each pipe has its ends, length, diameter and roughness from the sheet, and a typed length turns Auto off',
		bad.map((r) => r[0]).join(','));
	const j12 = L.nodeById('12'), t2 = L.nodeById('2');
	report(j12 && j12.elev === 700 && L.baseValue(j12, 'demand') === 150 && L.cellText('junctions', '12', 'axis1') === '50',
		'junction 12 carries its elevation, demand and X', j12 && JSON.stringify({ e: j12.elev, x: L.cellText('junctions', '12', 'axis1') }));
	report(t2 && t2.minLevel === 100 && t2.maxLevel === 150 && t2.tankDiameter === 50.5, 'the tank carries its levels and diameter');
}

console.log('\n--- 9. Paste as new rows at end of table: the menu arms it, Ctrl+Shift+V does it, an ordinary paste never does ---');
{
	L.reset();
	pasteIntoEmpty('junctions', 'K1\t0\t0\nK2\t10\t0\nK3\t20\t0');
	L.openPane('junctions'); L.renderTable('junctions');
	const spec = L.spec('junctions');
	const table = () => tableEl('junctions');
	function menuEl() { return global.document.body.children.filter((c) => c['class'] === 'lpn-pane-ctxmenu' || c.className === 'lpn-pane-ctxmenu').slice(-1)[0]; }
	function item(menu) { return menu && menu.children.filter((b) => (b.textContent || '').indexOf(PC.lpn_pane_paste_append) === 0)[0]; }
	function paste(text) { fire(table(), 'paste', { clipboardData: { getData: () => text }, preventDefault: () => {} }); }
	function key(name, mod) {
		fire(table(), 'keydown', Object.assign({ key: name, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false,
			preventDefault: function () {} }, mod || {}));
	}
	const before = JSON.stringify(nodes());
	L.selectCell('junctions', 'K3', 'elev');
	L.ctxMenu('junctions', 'K3', 'elev');
	const it = item(menuEl());
	report(!!it && (it.textContent || '').indexOf('Ctrl+Shift+V') > 0, 'the cell menu offers Paste as new rows at end of table, with its shortcut', it && it.textContent);
	fire(it, 'click');
	report(L.armed('junctions') && byId.lpn_pane_junctions.classList.contains('lpn-pane-appending'),
		'choosing it arms the table, visibly');
	report(L.notice() === PC.lpn_pane_paste_armed, '...and says to press Ctrl+V', L.notice());
	paste('K4\t30\t0\nK5\t40\t0');
	report(nodes().length === 5 && JSON.stringify(nodes().slice(0, 3)) === before,
		'the paste appends K4 and K5 and leaves K1..K3 byte-identical', L.tableOrder('junctions').join(','));
	report(!L.armed('junctions') && !byId.lpn_pane_junctions.classList.contains('lpn-pane-appending'), 'and the table is disarmed after it');
	// Esc cancels an armed table.
	L.colMenu('junctions', 'elev');
	const it2 = item(menuEl());
	report(!!it2, 'the heading menu offers it too');
	fire(it2, 'click');
	report(L.armed('junctions'), '...and arms the table the same way');
	key('Escape');
	report(!L.armed('junctions'), 'Esc cancels it');
	const before5 = JSON.stringify(nodes());
	L.selectCell('junctions', 'K5', 'id');
	paste('K6\t50\t0');
	report(nodes().length === 5 && dlgText() === say('lpn_pane_paste_ids_differ', { n: 1 }),
		'after Esc, a paste is ordinary again: standing on K5 it would rename K5, so it asks', dlgText());
	fire(dlgButton(PC.lpn_cancel), 'click');
	report(JSON.stringify(nodes()) === before5, '...and Cancel leaves K5 as it was');
	// Ctrl+Shift+V: the keydown marks the paste the browser then raises.
	L.selectCell('junctions', 'K5', 'elev');
	key('V', { ctrlKey: true, shiftKey: true });
	paste('K6\t50\t0\nK7\t60\t0');
	report(nodes().length === 7 && L.nodeById('K6') && L.nodeById('K7') && JSON.stringify(nodes().slice(0, 5)) === before5,
		'Ctrl+Shift+V appends K6 and K7 without touching K1..K5', L.tableOrder('junctions').join(','));
	L.selectCell('junctions', 'K7', 'elev');
	paste('70');
	report(nodes().length === 7 && L.nodeById('K7').elev === 70, 'the next plain Ctrl+V is ordinary again');
	// Tables that cannot create rows offer nothing.
	L.openPane('text'); L.renderTable('text');
	report(!L.spec('text').appendArmed, 'the Text table has no such action');
}

console.log('\n--- 10. 100 rows pasted on the first of 50: the paste asks ---');
{
	function setup() {
		L.reset();
		const l = [];
		for (let i = 1; i <= 50; i++) { l.push(['R' + i, String(i), '0', '', '', '1', String(100 + i)].join('\t')); }
		pasteIntoEmpty('junctions', l.join('\n'));
		L.openPane('junctions'); L.renderTable('junctions');
		L.selectCell('junctions', 'R1', 'id');
		return JSON.stringify(nodes());
	}
	const hundred = [];
	for (let i = 1; i <= 100; i++) { hundred.push(['R' + i, String(i), '0', '', '', '1', String(500 + i)].join('\t')); }
	const text = hundred.join('\n');
	const say3 = (k) => say(k, { n: 100, fit: 50, extra: 50 });

	let orig = setup(), d0 = L.undoDepth();
	let r = L.pasteAt('junctions', text);
	report(r && r.asked === true && r.fit === 50 && r.extra === 50, 'it asks rather than dropping the other 50', r && JSON.stringify(r));
	report(dlgText() === say3('lpn_pane_paste_overflow'), 'the question names 100, 50 and 50', dlgText());
	report(dlgButtons().map((b) => b.textContent).join(' | ') === [say3('lpn_pane_paste_overflow_add'), say3('lpn_pane_paste_overflow_fit'), PC.lpn_cancel].join(' | '),
		'three answers: add, fit only, cancel', dlgButtons().map((b) => b.textContent).join(' | '));
	report(JSON.stringify(nodes()) === orig && L.undoDepth() === d0, 'nothing is written while it asks');
	fire(dlgButton(say3('lpn_pane_paste_overflow_add')), 'click');
	report(nodes().length === 100 && L.nodeById('R100') && L.nodeById('R1').elev === 501 && L.nodeById('R100').elev === 600,
		'Add: 100 rows, the 50 overwritten and 50 added', String(nodes().length));
	report(L.undoDepth() === d0 + 1, '...as ONE undo step', d0 + ' -> ' + L.undoDepth());
	L.undo();
	report(JSON.stringify(nodes()) === orig, 'one Ctrl+Z restores the original 50 exactly');

	orig = setup(); d0 = L.undoDepth();
	L.pasteAt('junctions', text);
	fire(dlgButton(say3('lpn_pane_paste_overflow_fit')), 'click');
	report(nodes().length === 50 && L.nodeById('R1').elev === 501 && L.nodeById('R50').elev === 550 && !L.nodeById('R51'),
		'Fit only: the 50 are changed and none added', String(nodes().length));

	orig = setup(); d0 = L.undoDepth();
	L.pasteAt('junctions', text);
	fire(dlgButton(PC.lpn_cancel), 'click');
	report(JSON.stringify(nodes()) === orig && L.undoDepth() === d0, 'Cancel: nothing changed');

	// A left-over row that would be refused: the dialog says why and withholds Add.
	orig = setup();
	const bad = hundred.slice(); bad[79] = 'R3\t80\t0';
	r = L.pasteAt('junctions', bad.join('\n'));
	report(r && r.errors.length === 1 && dlgText().indexOf(say('lpn_pane_paste_id_taken', { row: 80, id: 'R3' })) >= 0,
		'a left-over row that fails is named in the question', dlgText());
	report(!dlgButton(say3('lpn_pane_paste_overflow_add')) && !!dlgButton(say3('lpn_pane_paste_overflow_fit')) && !!dlgButton(PC.lpn_cancel),
		'...and only Fit only and Cancel are offered');
	fire(dlgButton(PC.lpn_cancel), 'click');
	report(JSON.stringify(nodes()) === orig, '...and Cancel leaves the table as it was');
}

console.log('\n--- 11. a paste that would change IDs asks first, in Tom\'s words ---');
{
	L.reset();
	pasteIntoEmpty('junctions', 'M1\t0\t0\t\t\t1\t1\nM2\t10\t0\t\t\t1\t2\nM3\t20\t0\t\t\t1\t3\nM4\t30\t0\t\t\t1\t4');
	L.openPane('junctions'); L.renderTable('junctions');
	const orig = JSON.stringify(nodes()), d0 = L.undoDepth();
	L.selectCell('junctions', 'M1', 'id');
	let r = L.pasteAt('junctions', 'M1\t0\t0\t\t\t1\t11\nM2\t10\t0\t\t\t1\t12');
	report(r && !r.asked && L.nodeById('M1').elev === 11 && L.nodeById('M2').elev === 12, 'matching IDs ask nothing', r && JSON.stringify(r));
	L.undo();
	L.selectCell('junctions', 'M1', 'id');
	r = L.pasteAt('junctions', 'X1\t0\t0\nM2\t10\t0\nX3\t20\t0\nX4\t30\t0');
	report(r && r.asked && r.idChanges === 3 && dlgText() === say('lpn_pane_paste_ids_differ', { n: 3 }),
		'three differing IDs ask, with n = 3', dlgText());
	report(dlgButtons().map((b) => b.textContent).join('|') === [PC.points_data_paste, PC.lpn_cancel].join('|'), '...offering Paste and Cancel');
	fire(dlgButton(PC.lpn_cancel), 'click');
	report(JSON.stringify(nodes()) === orig && L.undoDepth() === d0, 'Cancel changes nothing');
	L.pasteAt('junctions', 'X1\t0\t0\nM2\t10\t0\nX3\t20\t0\nX4\t30\t0');
	fire(dlgButton(PC.points_data_paste), 'click');
	report(L.nodeById('X1') && L.nodeById('X3') && L.nodeById('X4') && !L.nodeById('M1') && nodes().length === 4,
		'Paste renames the three', nodes().map((n) => n.id).join(','));
	report(L.undoDepth() === d0 + 1, '...as one undo step', d0 + ' -> ' + L.undoDepth());
	L.undo();
	report(JSON.stringify(nodes()) === orig, 'and one Ctrl+Z puts the four IDs back');
	// Both questions: the IDs first, then the overflow.
	L.selectCell('junctions', 'M3', 'id');
	r = L.pasteAt('junctions', 'Y3\t20\t0\nM4\t30\t0\nM5\t40\t0');
	report(r && r.idChanges === 1, 'a paste that renames AND overflows asks about the IDs first');
	fire(dlgButton(PC.points_data_paste), 'click');
	report(dlgText() === say('lpn_pane_paste_overflow', { n: 3, fit: 2, extra: 1 }), '...then about the row left over', dlgText());
	fire(dlgButton(say('lpn_pane_paste_overflow_add', { extra: 1 })), 'click');
	report(L.nodeById('Y3') && L.nodeById('M5') && nodes().length === 5 && L.undoDepth() === d0 + 1,
		'...and both land as one undo step', nodes().map((n) => n.id).join(','));
}

console.log('\n--- 12. twenty bad IDs in one paste: ONE message, not twenty alerts ---');
{
	L.reset();
	const l = [];
	for (let i = 1; i <= 25; i++) { l.push(['Z' + i, String(i), '0'].join('\t')); }
	pasteIntoEmpty('junctions', l.join('\n'));
	L.openPane('junctions'); L.renderTable('junctions');
	const orig = JSON.stringify(nodes()), d0 = L.undoDepth();
	let alerts = 0, notices = 0;
	const oldAlert = global.window.alert, oldGAlert = global.alert;
	global.window.alert = global.alert = () => { alerts++; };
	const box = byId.lpn_map_notice, last = box.textContent;
	const bad = [];
	for (let i = 1; i <= 20; i++) { bad.push('Z' + (i + 1) + '\t' + i + '\t0'); }   // each names its neighbour: taken
	L.selectCell('junctions', 'Z1', 'id');
	const r = L.pasteAt('junctions', bad.join('\n'));
	if (box.textContent !== last) { notices++; }
	global.window.alert = oldAlert; global.alert = oldGAlert;
	report(alerts === 0, 'no alert at all', String(alerts));
	report(notices === 1 && r && r.refused === true && r.errors.length === 20, 'exactly one notice, refusing the paste with 20 reasons', r && String(r.errors.length));
	report(L.notice().indexOf(REFUSED) === 0 && has(L.notice(), 'lpn_pane_paste_more', { n: 15 }) &&
		has(L.notice(), 'lpn_pane_paste_id_taken', { row: 1, id: 'Z2' }), '...naming five rows and counting fifteen', L.notice());
	report(JSON.stringify(nodes()) === orig && L.undoDepth() === d0, 'and nothing was written');
}

console.log(`\n${failures ? 'FAILURES' : 'all pass'}: ${checks - failures}/${checks}`);
process.exit(failures ? 1 : 0);
