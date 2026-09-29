// EVERY TABLE MUST ACCEPT THE PASTE ITS OWN COPY PRODUCES -- TEXT AND CUSTOMERS INCLUDED. Run with:
//   node dev/lpn-spike/pane-table-paste-roundtrip-harness.js
//
// Tom, 2026-09-28, opening Net3, Ctrl+A/Ctrl+C on a table, opening a brand-new project, and
// Ctrl+V/Ctrl+Shift+V back into the same table: "I pasted successfully to a new project from Net3
// for Junctions, Reservoirs. But when I came to Tanks, it would not paste: 'Not used is not a
// valid Mixing fraction.'" and "pasting Text table just does nothing."
//
// A first pass here made the Text/Customers half of that "explain why instead of doing nothing" --
// Tom rejected it: *"Nothing about text is harder to put in a table than a junction is. Same with
// Customer... Refusing to paste Customers makes no more sense than refusing to paste Pipes... The
// more honest thing from the beginning would have been to say we took the easy way out."* He is
// right, and this harness now tests the honest fix.
//
// ROOT CAUSE 1 (Tanks, and every other plain-word cell): paneCellText() prints a column's own
// PLAIN WORD -- "Not used", "Attached" -- wherever plainFor(el) is true (a tank whose mixing model
// is not two-compartment, a TCV valve's minor loss, a Text following a leader). A copy writes
// exactly what the cell shows, so that word is what lands on the clipboard. paneParseCellText() and
// paneWriteCellText() did not know it, so a paste carrying it back was refused as a bad number or a
// bad choice. Every table that has such a column reproduces this, not only Tanks.
//
// ROOT CAUSE 2 (Text, and Customers): paneCanCreate() excluded the 'label' and 'customer' groups
// entirely, so an EMPTY Text or Customer table offered no paste target at all. THE FIX: both groups
// now create rows exactly as Junctions and Pipes do -- a Text names its anchor (a node or a link)
// in its own new Attached to column, exactly as a Pipe names its two nodes in From/To; a Customer
// names its serving pipe (Connected asset) or, when it is lumped exactly onto a node, that node
// (Added to node) -- and refuses a row only when what it needs is not there yet, the same shape of
// refusal a Pipe gives for a missing node.
//
// WHAT THIS ASSERTS, for every one of the eight tables (Net3 plus a valve, a customer and two Text
// rows -- one anchored to a node, one to a pipe -- it does not carry):
//
//   1. The whole table, copied from Net3 the way Ctrl+A/Ctrl+C actually reads it -- through
//      paneCellText(), no header row (R-310) -- pastes into a brand-new project, table after table
//      in dependency order (nodes, links, THEN customers and Text, which need them), and every
//      INPUT cell reads back exactly, plain words and anchors/references included. (A result column
//      -- demandActual, pressure, flow, a Customer's Total -- is excluded: it is the SOLVE's own
//      number or a pure arithmetic derivative, not something a paste writes.)
//   2. A Text row naming an anchor that does not exist, or naming none while leaving X/Y blank too,
//      refuses with a reason naming the row -- never creates a stray or a crash.
//   3. A Customer row naming neither a pipe nor a node, or naming one that does not exist, refuses
//      the same way -- the same shape of refusal Pipes already give for a missing node.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}

setUnitSet('us');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, applySaved: applySaved,\n" +
	"\t\tserializeProject: serializeProject, refreshAll: refreshAllFromDocument,\n" +
	"\t\taddNode: addNode, addLink: addLink, addCustomer: addCustomer, addText: addText,\n" +
	"\t\tpaneTableById: paneTableById, openPane: openPane,\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\ttableIds: function () { return paneTables().map(function (s) { return { id: s.id, group: s.group }; }); },\n" +
	"\t\theadings: function (id) { return paneCols(paneTableById(id)).map(function (c) {\n" +
	"\t\t\treturn { key: c.key, h: paneHeadingText(c), result: !!c.result, blank: !!c.blank, set: !!c.set }; }); },\n" +
	"\t\ttableOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)).map(function (e) { return e.id; }); },\n" +
	"\t\tcellText: function (id, elId, key) { var s = paneTableById(id),\n" +
	"\t\t\tel = paneTableAllElements(s).filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\treturn paneCellText(paneColByKey(s, key), el); },\n" +
	"\t\tnotice: function () { return document.getElementById('lpn_map_notice').textContent || ''; },\n" +
	"\t\tundo: undo, undoDepth: function () { return undoStack.length; },\n" +
	"\t\tpasteAppend: function (id, text) { var s = paneTableById(id); renderPaneTable(s);\n" +
	"\t\t\treturn panePasteAt(s, libPasteCells(text), { append: true }); },\n" +
	"\t\tnodeById: nodeById, linkById: linkById, customerById: customerById, labelById: labelById,\n" +
	"\t\tsetCurves: function (c) { doc.curves = c; },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [], customers: [], origin: { x: 0, y: 0 } };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1, M: 1 };\n" +
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
function paneHost(tableId) { return byId['lpn_pane_' + tableId]; }
function paneNote(tableId) {
	const host = paneHost(tableId);
	return host.children.filter((c) => c._tag === 'p').slice(-1)[0];
}
// The empty table's own paste target: the note renderPaneTable() puts where the table would be,
// on every table now paneCanCreate() covers all eight.
function pasteIntoEmpty(tableId, text) {
	L.openPane(tableId);
	L.renderTable(tableId);
	const note = paneNote(tableId);
	if (!note || !(note._listeners && note._listeners.paste)) { return null; }
	let prevented = false;
	fire(note, 'paste', { clipboardData: { getData: () => text }, preventDefault: () => { prevented = true; } });
	return { prevented, note };
}
const PC = global.EngCalcs.pageConfig;
function say(key, vals) {
	let t = String(PC[key]);
	Object.keys(vals || {}).forEach((k) => { t = t.replace('{' + k + '}', String(vals[k])); });
	return t;
}

// Copy exactly as Ctrl+A/Ctrl+C reads a table: one line per row, tab-separated, through
// paneCellText() -- no header (R-310), so a plain-word cell is copied as the word it shows.
function copyTable(tableId) {
	const ids = L.tableOrder(tableId), heads = L.headings(tableId);
	return { order: ids, heads: heads, sheet: ids.map((id) => heads.map((h) => L.cellText(tableId, id, h.key)).join('\t')).join('\n') };
}
// Every INPUT cell must round-trip; a RESULT cell (a solve's own number, or a Customer's Total,
// pure arithmetic off cells already checked) is not what this harness is testing, and neither is a
// blank source cell on a newly created row, which legitimately takes "the default a drawn element
// is born with" (panePlanCreates' own rule) rather than staying blank. Compared numerically where
// both sides parse as one, with a loose tolerance -- a snapped/derived position (a Customer's own
// coordinate, an anchored Text's hidden offset) is not guaranteed to the same double bit for bit,
// only to the same place on the ground.
function compareRow(tableId, id, heads, wantRow, bad) {
	heads.forEach((h, cIdx) => {
		if (h.key === 'id' || h.key === 'total' || h.result) { return; }
		const want = wantRow[cIdx] === undefined ? '' : wantRow[cIdx];
		if (want === '') { return; }
		const got = L.cellText(tableId, id, h.key);
		if (want === got) { return; }
		const wn = +want, gn = +got;
		if (isFinite(wn) && isFinite(gn) && Math.abs(wn - gn) < 1e-3) { return; }
		bad.push(id + '.' + h.key + ': want ' + JSON.stringify(want) + ' got ' + JSON.stringify(got));
	});
}

// ---- build the source: Net3, plus the valve, the customer and the two Text rows it does not
// carry -- one Text anchored to a node, one to a pipe, so both anchor kinds round-trip. -----------
const net3 = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', 'Net3.lwn'), 'utf8'));
L.applySaved(JSON.parse(JSON.stringify(net3)));
L.refreshAll();
const someJ = L.getDoc().nodes.filter((n) => n.type === 'junction').slice(0, 2).map((n) => n.id);
L.addLink('valve', someJ[0], someJ[1], [], 'PRV-1');   // Net3 carries no valve; TCV by default, so its km cell is plain
const somePipe = L.getDoc().links.filter((l) => l.type === 'pipe')[0];
L.addCustomer(0, 0, { link: somePipe.id, t: 0.5 });   // Net3 carries no customer
L.addText(0, 0, someJ[0]);            // anchored to a NODE: align/valign plain ("Attached"), Attached to = the node's id
L.addText(0, 0, null, { link: somePipe.id, t: 0.25 });   // anchored to a PIPE

console.log('\n--- every table copies from Net3 (plus what it lacked) ---');
const tableIds = L.tableIds();
report(tableIds.length >= 8, 'all eight tables are on the page', tableIds.map((t) => t.id).join(','));

const sheets = {};
tableIds.forEach((t) => { sheets[t.id] = copyTable(t.id); });
report(sheets.tanks.sheet.indexOf(PC.lpn_pane_not_used) >= 0,
	"Net3's own Tanks copy carries the plain word Not used, reproducing Tom's paste", JSON.stringify(sheets.tanks.sheet));
report(sheets.valves.sheet.indexOf(PC.lpn_pane_not_used) >= 0,
	"the added valve's Km cell copies as Not used too (a TCV's minor loss is plain)");
report(sheets.text.sheet.indexOf(PC.lpn_pane_text_attached) >= 0,
	'an anchored Text row copies its align/valign as Attached');
const anchorHead = sheets.text.heads.filter((h) => h.key === 'anchor')[0];
report(!!anchorHead && anchorHead.h === PC.lpn_field_text_anchor, 'the Text table has an Attached to column', anchorHead && anchorHead.h);
report(sheets.text.sheet.indexOf('\t' + someJ[0] + '\t') >= 0 || sheets.text.sheet.split('\n').some((r) => r.split('\t')[anchorHead ? sheets.text.heads.indexOf(anchorHead) : -1] === someJ[0]),
	'the node-anchored row copies its anchor as the node\'s own id', sheets.text.sheet);
report(sheets.text.sheet.split('\n').some((r) => r.split('\t')[sheets.text.heads.indexOf(anchorHead)] === somePipe.id),
	'the pipe-anchored row copies its anchor as the pipe\'s own id', sheets.text.sheet);

console.log('\n--- every table (Text and Customers included) pastes into one new, empty project, in dependency order ---');
// A curve REFERENCE is not the curve: Pumps carries a stated head-curve id, and that id has to
// exist in the destination's own Library before it can be pasted back, exactly as a real user
// opening a truly blank project would have to add the curve first. Captured before the reset below,
// then seeded as the Library's own door would seed it, so this harness tests the plain-word/
// reference paste and not a missing-library setup step.
const sourceSaved = L.serializeProject();
L.reset();
L.setCurves(JSON.parse(JSON.stringify(sourceSaved.curves || [])));
['junctions', 'reservoirs', 'tanks', 'pipes', 'pumps', 'valves', 'customers', 'text'].forEach((tableId) => {
	const s = sheets[tableId];
	const res = pasteIntoEmpty(tableId, s.sheet);
	report(!!res, `${tableId}: an empty table offers a paste target`);
	report(res && res.prevented, `${tableId}: the paste is claimed`);
	const gotIds = L.tableOrder(tableId);
	report(gotIds.length === s.order.length, `${tableId}: every source row (${s.order.length}) was created`, String(gotIds.length));
	report(L.notice().indexOf(PC.lpn_pane_paste_refused) !== 0,
		`${tableId}: the paste was not refused`, L.notice());
	const bad = [], srcRows = s.sheet.split('\n');
	gotIds.forEach((id, rIdx) => { compareRow(tableId, id, s.heads, (srcRows[rIdx] || '').split('\t'), bad); });
	report(bad.length === 0, `${tableId}: every input cell round-trips exactly, plain words and references included`, bad.slice(0, 8).join(' | '));
});

console.log('\n--- a Text row naming a missing anchor, or naming none with no position either, refuses ---');
{
	L.reset();
	pasteIntoEmpty('junctions', 'J1\t0\t0');
	const heads = L.headings('text').map((h) => h.key);
	function textRow(o) { return heads.map((k) => (o[k] === undefined ? '' : String(o[k]))).join('\t'); }
	const d0 = L.undoDepth();
	let res = pasteIntoEmpty('text', textRow({ id: 'X1', anchor: 'NOPE' }));
	report(L.notice() === say('lpn_pane_paste_refused', { reasons: say('lpn_pane_paste_no_anchor', { row: 1, id: 'NOPE' }) }),
		'an anchor naming nothing in the network refuses, by name', L.notice());
	report(!L.labelById('X1'), '...and creates nothing');
	res = pasteIntoEmpty('text', textRow({ id: 'X1' }));
	report(L.notice() === say('lpn_pane_paste_refused', { reasons: say('lpn_pane_paste_text_no_position', { row: 1, first: PC.lpn_field_x, second: PC.lpn_field_y }) }),
		'no anchor and no position refuses too', L.notice());
	report(!L.labelById('X1'), '...and creates nothing');
	report(L.undoDepth() === d0, 'and neither refusal took an undo snapshot', d0 + ' -> ' + L.undoDepth());
	res = pasteIntoEmpty('text', textRow({ id: 'X1', anchor: 'J1' }));
	report(!!L.labelById('X1') && L.labelById('X1').anchorNode === 'J1', 'a real anchor creates it, attached', res && res.prevented);
	report(L.undoDepth() === d0 + 1, 'as ONE undo step', d0 + ' -> ' + L.undoDepth());
	L.undo();
	report(!L.labelById('X1'), 'and one Ctrl+Z removes it');
}

console.log('\n--- a Customer row naming neither a pipe nor a node, or naming one that is missing, refuses ---');
{
	L.reset();
	pasteIntoEmpty('junctions', 'J1\t0\t0\nJ2\t100\t0');
	const pipeHeads = L.headings('pipes').map((h) => h.key);
	function pipeRow(o) { return pipeHeads.map((k) => (o[k] === undefined ? '' : String(o[k]))).join('\t'); }
	pasteIntoEmpty('pipes', pipeRow({ id: 'P1', from: 'J1', to: 'J2' }));
	report(!!L.linkById('P1'), 'the fixture pipe P1 exists, joining J1 and J2');
	const heads = L.headings('customers').map((h) => h.key);
	function custRow(o) { return heads.map((k) => (o[k] === undefined ? '' : String(o[k]))).join('\t'); }
	const d0 = L.undoDepth();
	let res = pasteIntoEmpty('customers', custRow({ id: 'C1', axis1: 50, axis2: 5 }));
	report(L.notice() === say('lpn_pane_paste_refused', { reasons: say('lpn_pane_paste_no_customer_ref', { row: 1 }) }),
		'naming neither a pipe nor a node refuses', L.notice());
	report(!L.customerById('C1'), '...and creates nothing');
	res = pasteIntoEmpty('customers', custRow({ id: 'C1', axis1: 50, axis2: 5, link: 'NOPE' }));
	report(L.notice() === say('lpn_pane_paste_refused', { reasons: say('lpn_pane_paste_no_pipe', { row: 1, id: 'NOPE' }) }),
		'a pipe that does not exist refuses, by name', L.notice());
	res = pasteIntoEmpty('customers', custRow({ id: 'C1', axis1: 50, axis2: 5, atNode: 'NOPE' }));
	report(L.notice() === say('lpn_pane_paste_refused', { reasons: say('lpn_pane_paste_no_customer_node', { row: 1, id: 'NOPE' }) }),
		'a node that does not exist refuses, by name', L.notice());
	report(L.undoDepth() === d0, 'none of the three refusals took an undo snapshot', d0 + ' -> ' + L.undoDepth());
	res = pasteIntoEmpty('customers', custRow({ id: 'C1', axis1: 50, axis2: 5, link: 'P1' }));
	report(!!L.customerById('C1') && L.customerById('C1').link === 'P1', 'a real pipe creates it, connected', res && res.prevented);
	report(L.undoDepth() === d0 + 1, 'as ONE undo step', d0 + ' -> ' + L.undoDepth());
	res = L.pasteAppend('customers', custRow({ id: 'C2', axis1: 0, axis2: 5, atNode: 'J1' }));
	report(!!L.customerById('C2') && L.customerById('C2').link === 'P1' && L.customerById('C2').t === 0,
		'naming a node instead attaches through whichever pipe reaches it, exactly on the end',
		JSON.stringify({ link: L.customerById('C2') && L.customerById('C2').link, t: L.customerById('C2') && L.customerById('C2').t }));
	L.undo();
	report(!L.customerById('C2') && !!L.customerById('C1'), 'and one Ctrl+Z removes only the last one');
}

console.log(`\n${failures ? 'FAILURES' : 'all pass'}: ${checks - failures}/${checks}`);
process.exit(failures ? 1 : 0);

