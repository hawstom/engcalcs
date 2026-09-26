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
function nodes() { return L.getDoc().nodes; }
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
	report(res && /paste rows/i.test(res.note.textContent), '...and says so on the note', res && res.note.textContent);
	report(res && res.prevented, 'the paste is claimed, not left to the browser');
	report(nodes().length === 400, '400 junctions were created', String(nodes().length));
	report(nodes().every((n) => n.type === 'junction'), '...all of them junctions');
	const j7 = L.nodeById('J-7');
	report(!!j7 && L.cellText('junctions', 'J-7', 'axis1') === '70' && L.cellText('junctions', 'J-7', 'axis2') === '35',
		'each one sits at the X and Y its row stated', j7 && (L.cellText('junctions', 'J-7', 'axis1') + ',' + L.cellText('junctions', 'J-7', 'axis2')));
	report(j7 && j7.elev === 0 && j7._demand === 0, 'a blank elevation and demand take the new-asset defaults',
		j7 && JSON.stringify({ elev: j7.elev, demand: j7._demand }));
	report(L.undoDepth() === d0 + 1, 'the whole paste is ONE undo snapshot', d0 + ' -> ' + L.undoDepth());
	report(/Pasted 400 rows and added 400/.test(L.notice()), 'the notice counts rows added, not cells', L.notice());
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
	// Standing on C's ID, so the block covers C and runs past the last row.
	L.selectCell('junctions', 'C', 'id');
	let r = L.pasteAt('junctions', 'C\t20\t0\t\t\t1\t555\nD\t30\t0\nA\t40\t0');
	report(r && r.refused === true, 'an ID already in the network refuses the paste', r && JSON.stringify(r.errors));
	report(r && r.errors.length === 1 && /Row 3/.test(r.errors[0]) && /A is already in use/.test(r.errors[0]),
		'...naming the row of the pasted block and the reason', r && r.errors[0]);
	report(nodes().length === 3 && !L.nodeById('D'), 'nothing was created, not even the good row D');
	report(L.cellText('junctions', 'C', 'elev') === '100', 'and the existing row the block covered was not written either',
		L.cellText('junctions', 'C', 'elev'));
	report(L.undoDepth() === d0, 'a refused paste takes no undo snapshot');
	report(/^Nothing was pasted\./.test(L.notice()), 'the notice says nothing was pasted', L.notice());

	L.selectCell('junctions', 'C', 'id');
	r = L.pasteAt('junctions', 'C\t20\t0\nD\t30\t0\nE\t40\t0\nD\t50\t0');
	report(r && r.refused === true && r.errors.length === 1 && /Row 4/.test(r.errors[0]) && /used twice in this paste/.test(r.errors[0]),
		'an ID used twice WITHIN the pasted block refuses it too', r && r.errors[0]);
	report(nodes().length === 3, '...and creates nothing', String(nodes().length));

	r = L.pasteAt('junctions', 'C\t20\t0\n\t30\t0\nE F\t40\t0');
	report(r && r.errors.length === 2 && /Row 2: a new row needs an ID/.test(r.errors[0]) && /Row 3.*space or a quotation mark/.test(r.errors[1]),
		'a blank ID and an ID with a space are each named', r && JSON.stringify(r.errors));

	// Many bad rows: five named, the rest counted.
	const many = ['C\t20\t0'];
	for (let i = 0; i < 12; i++) { many.push('A\t' + i + '\t0'); }
	r = L.pasteAt('junctions', many.join('\n'));
	report(/Nothing was pasted\./.test(L.notice()) && /Rows with problems not shown here: 7\./.test(L.notice()),
		'twelve failing rows: five are named and seven counted', L.notice());

	// A good paste over the same place now lands: C edited, D and E created.
	L.selectCell('junctions', 'C', 'id');
	r = L.pasteAt('junctions', 'C\t20\t0\t\t\t1\t555\nD\t30\t0\t\t\t1\t560\nE\t40\t0');
	report(r && r.created === 2 && L.nodeById('D') && L.nodeById('E'), 'a clean block edits the covered row and adds the rest',
		r && JSON.stringify(r));
	report(L.cellText('junctions', 'C', 'elev') === '555' && L.cellText('junctions', 'D', 'elev') === '560',
		'...with the cells of both kinds of row written', L.cellText('junctions', 'C', 'elev') + ',' + L.cellText('junctions', 'D', 'elev'));
	report(/Pasted 3 rows and added 2 of them/.test(L.notice()), 'the notice says 3 rows, 2 added', L.notice());
}

console.log('\n--- 3. a new node with no position refuses the paste ---');
{
	L.selectCell('junctions', 'E', 'id');
	const n0 = nodes().length;
	let r = L.pasteAt('junctions', 'E\t40\t0\nF\t\t7');
	report(r && r.refused === true && /Row 2: a new node needs both X and Y/.test(r.errors[0]),
		'a blank coordinate is refused, naming both axes the project uses', r && r.errors[0]);
	r = L.pasteAt('junctions', 'E\t40\t0\nF\tabc\t7');
	report(r && r.refused === true && /Row 2: abc is not a valid X/.test(r.errors[0]),
		'a coordinate that is not a number is refused, naming the column', r && r.errors[0]);
	r = L.pasteAt('junctions', 'E\t40\t0\nF\t50\t0\t\t\t1\tlots');
	report(r && r.refused === true && /Row 2: lots is not a valid Elevation/.test(r.errors[0]),
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
	L.openPane('pipes'); L.renderTable('pipes');
	L.selectCell('pipes', 'P2', 'id');
	let r = L.pasteAt('pipes', [pipeRow({ id: 'P2', from: 'N2', to: 'N3' }), pipeRow({ id: 'P3', from: 'N3', to: 'N9' })].join('\n'));
	report(r && r.refused === true && /Row 2: node N9 does not exist yet/.test(r.errors[0]),
		'a pipe naming a node that does not exist refuses the paste', r && r.errors[0]);
	r = L.pasteAt('pipes', [pipeRow({ id: 'P2', from: 'N2', to: 'N3' }), pipeRow({ id: 'P3', from: 'N3' })].join('\n'));
	report(r && r.refused === true && /Row 2: a new link needs a From node and a To node/.test(r.errors[0]),
		'a pipe with a blank To refuses the paste', r && r.errors[0]);
	r = L.pasteAt('pipes', [pipeRow({ id: 'P2', from: 'N2', to: 'N3' }), pipeRow({ id: 'P3', from: 'N3', to: 'N3' })].join('\n'));
	report(r && r.refused === true && /From and To are the same node/.test(r.errors[0]),
		'a pipe from a node to itself refuses the paste', r && r.errors[0]);
	r = L.pasteAt('pipes', [pipeRow({ id: 'P2', from: 'N2', to: 'N3' }), pipeRow({ id: 'N1', from: 'N3', to: 'N1' })].join('\n'));
	report(r && r.refused === true && /the ID N1 is already in use/.test(r.errors[0]),
		'a pipe ID that a NODE already answers to is taken (one ID pool, as allIds() has it)', r && r.errors[0]);
	report(links().length === 2, 'none of those created anything', String(links().length));
}

console.log('\n--- 5. the Vertices cell, per the clerk\'s vertex spec ---');
{
	const cols = L.headings('pipes');
	const vh = cols.filter((c) => c.key === 'verts')[0];
	report(!!vh && vh.h === 'Vertices (X/Y/…)', 'the Pipes table has a Vertices column whose heading states the order', vh && vh.h);
	const keys = cols.map((c) => c.key);
	function pipeRow(o) { return keys.map((k) => (o[k] === undefined ? '' : String(o[k]))).join('\t'); }
	L.selectCell('pipes', 'P2', 'id');
	let r = L.pasteAt('pipes', [pipeRow({ id: 'P2', from: 'N2', to: 'N3' }),
		pipeRow({ id: 'P4', from: 'N1', to: 'N3', verts: '0/100/50/120' })].join('\n'));
	const p4 = L.linkById('P4');
	report(r && r.created === 1 && p4 && p4.verts.length === 2, 'n1/n2/n3/n4 is two vertices', p4 && JSON.stringify(p4.verts));
	report(p4 && L.outwardX(p4.verts[0].x) === 0 && L.outwardY(p4.verts[0].y) === 100 &&
		L.outwardX(p4.verts[1].x) === 50 && L.outwardY(p4.verts[1].y) === 120,
		'...read in pairs, X then Y on a grid project, From end first');
	report(L.cellText('pipes', 'P4', 'verts') === '0/100/50/120', 'the cell reads back exactly as typed', L.cellText('pipes', 'P4', 'verts'));
	report(p4 && Math.abs(p4._length - (100 + Math.hypot(50, 20) + Math.hypot(50, 20))) < 1e-9,
		'the auto length follows the bends', p4 && String(p4._length));
	L.selectCell('pipes', 'P4', 'id');
	r = L.pasteAt('pipes', [pipeRow({ id: 'P4', from: 'N1', to: 'N3', verts: '0/100/50/120' }), pipeRow({ id: 'P5', from: 'N1', to: 'N3', verts: '0/100/50' })].join('\n'));
	report(r && r.refused === true && /Row 2: 0\/100\/50 is not a valid Vertices/.test(r.errors[0]),
		'an odd count refuses the whole paste', r && r.errors[0]);
	r = L.pasteAt('pipes', [pipeRow({ id: 'P4', from: 'N1', to: 'N3', verts: '0/100/50/120' }), pipeRow({ id: 'P5', from: 'N1', to: 'N3', verts: '0,100,50,120' })].join('\n'));
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
	report(vcol && vcol.h === 'Vertices (Latitude/Longitude/…)', '...and so does the Vertices heading', vcol && vcol.h);
	const gkeys = L.headings('pipes').map((c) => c.key);
	pasteIntoEmpty('pipes', gkeys.map((k) => ({ id: 'GP', from: 'G1', to: 'G2', verts: '40.7135/-74.0071/40.72/-73.99' })[k] || '').join('\t'));
	report(L.cellText('pipes', 'GP', 'verts') === '40.7135/-74.0071/40.72/-73.99', 'the vertex cell reads back the typed latitude and longitude',
		L.cellText('pipes', 'GP', 'verts'));
	const saved = L.serialize();
	const sv = saved.links.filter((l) => l.id === 'GP')[0].verts;
	report(sv[0].y === 40.7135 && sv[0].x === -74.0071 && sv[1].y === 40.72 && sv[1].x === -73.99,
		'a save writes the typed numbers exactly, not a projection residual', JSON.stringify(sv));
	const sn = saved.nodes.filter((n) => n.id === 'G1')[0];
	report(sn.y === 40.7128 && sn.x === -74.006, 'and a pasted node\'s position too', JSON.stringify({ x: sn.x, y: sn.y }));
	L.selectCell('junctions', 'G2', 'id');
	const r2 = L.pasteAt('junctions', 'G2\t40.7306\t-73.9866\nG3\t95\t0');
	report(r2 && r2.refused === true && /95 is not a valid Latitude/.test(r2.errors[0]), 'a latitude off the map is refused', r2 && r2.errors[0]);
	L.setCoords(undefined);
}

console.log('\n--- 6. inside a scenario: born as a drawn element is, cells as overrides ---');
{
	L.reset();
	pasteIntoEmpty('junctions', 'B1\t0\t0\t\t\t1\t10\t5');
	const scn = L.createScenario('Growth');
	L.switchScenario(scn.id);
	L.openPane('junctions'); L.renderTable('junctions');
	L.selectCell('junctions', 'B1', 'id');
	const r = L.pasteAt('junctions', 'B1\t0\t0\t\t\t1\t10\t5\nS1\t50\t0\t\t\t1\t20\t7');
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
	L.openPane('junctions'); L.renderTable('junctions');
	L.selectCell('junctions', 'U2', 'id');
	L.pasteAt('junctions', 'U2\t10\t0\t\t\t1\t99\nU3\t20\t0\nU4\t30\t0');
	report(nodes().length === 4 && L.nodeById('U2').elev === 99, 'the paste landed');
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
	// The sheet a clerk would keep: this page's own headings (exactly what a whole-table copy puts
	// on the clipboard), one row per element, blanks where the sheet has nothing to say.
	function sheet(tableId, rows) {
		const hs = L.headings(tableId);
		return [hs.map((c) => c.h).join('\t')].concat(rows.map((o) => hs.map((c) => (o[c.key] === undefined ? '' : String(o[c.key]))).join('\t'))).join('\r\n');
	}
	pasteIntoEmpty('junctions', sheet('junctions', sec.JUNCTIONS.map((r) => ({ id: r[0], axis1: xy[r[0]][0], axis2: xy[r[0]][1], elev: r[1], demand: r[2] }))));
	pasteIntoEmpty('reservoirs', sheet('reservoirs', sec.RESERVOIRS.map((r) => ({ id: r[0], axis1: xy[r[0]][0], axis2: xy[r[0]][1], head: r[1] }))));
	pasteIntoEmpty('tanks', sheet('tanks', sec.TANKS.map((r) => ({ id: r[0], axis1: xy[r[0]][0], axis2: xy[r[0]][1], elev: r[1], level: r[2], minLevel: r[3], maxLevel: r[4], tankDiameter: r[5] }))));
	// **EPANET KEEPS NODE AND LINK IDS IN SEPARATE NAMESPACES AND THIS PAGE'S NEW-ID RULE DOES NOT**
	// (validateNewId() pools them, and the spec reuses it verbatim). Net1 has junction 10 AND pipe
	// 10, so its pipe sheet as EPANET wrote it is refused, whole, naming the rows. That is the
	// finding this section exists to record; the sheet with its pipe IDs made unique then lands.
	pasteIntoEmpty('pipes', sheet('pipes', sec.PIPES.map((r) => ({ id: r[0], from: r[1], to: r[2], length: r[3], diameter: r[4], roughness: r[5] }))));
	report(links().length === 0 && /^Nothing was pasted\. Row 2: the ID 10 is already in use\./.test(L.notice()),
		'Net1\'s pipe sheet as EPANET wrote it is refused: pipe 10 shares an ID with junction 10', L.notice());
	pasteIntoEmpty('pipes', sheet('pipes', sec.PIPES.map((r) => ({ id: 'P' + r[0], from: r[1], to: r[2], length: r[3], diameter: r[4], roughness: r[5] }))));
	const pipesSaid = L.notice();
	pasteIntoEmpty('pumps', sheet('pumps', sec.PUMPS.map((r) => ({ id: 'PU' + r[0], from: r[1], to: r[2] }))));
	report(nodes().filter((n) => n.type === 'junction').length === sec.JUNCTIONS.length &&
		nodes().filter((n) => n.type === 'reservoir').length === 1 && nodes().filter((n) => n.type === 'tank').length === 1,
		'every junction, the reservoir and the tank were created, and no heading row became a node',
		nodes().map((n) => n.id).join(','));
	report(!L.nodeById('ID'), 'the heading row was recognized and skipped');
	report(links().filter((l) => l.type === 'pipe').length === sec.PIPES.length && links().filter((l) => l.type === 'pump').length === 1,
		'every pipe and the pump were created', String(links().length) + ' / ' + pipesSaid);
	const bad = sec.PIPES.filter((r) => { const l = L.linkById('P' + r[0]); return !l || l.from !== r[1] || l.to !== r[2] ||
		l._diameter !== +r[4] || l._length !== +r[3] || l._roughness !== +r[5] || l.lenAuto !== false; });
	report(bad.length === 0, 'each pipe has its ends, length, diameter and roughness from the sheet, and a typed length turns Auto off',
		bad.map((r) => r[0]).join(','));
	const j12 = L.nodeById('12'), t2 = L.nodeById('2');
	report(j12 && j12.elev === 700 && L.baseValue(j12, 'demand') === 150 && L.cellText('junctions', '12', 'axis1') === '50',
		'junction 12 carries its elevation, demand and X', j12 && JSON.stringify({ e: j12.elev, x: L.cellText('junctions', '12', 'axis1') }));
	report(t2 && t2.minLevel === 100 && t2.maxLevel === 150 && t2.tankDiameter === 50.5, 'the tank carries its levels and diameter');
}

console.log(`\n${failures ? 'FAILURES' : 'all pass'}: ${checks - failures}/${checks}`);
process.exit(failures ? 1 : 0);
