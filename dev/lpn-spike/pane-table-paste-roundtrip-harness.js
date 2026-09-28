// EVERY TABLE MUST ACCEPT THE PASTE ITS OWN COPY PRODUCES. Run with:
//   node dev/lpn-spike/pane-table-paste-roundtrip-harness.js
//
// Tom, 2026-09-28, opening Net3, Ctrl+A/Ctrl+C on a table, opening a brand-new project, and
// Ctrl+V/Ctrl+Shift+V back into the same table: "I pasted successfully to a new project from Net3
// for Junctions, Reservoirs. But when I came to Tanks, it would not paste: 'Not used is not a
// valid Mixing fraction.'" and "pasting Text table just does nothing."
//
// ROOT CAUSE 1 (Tanks, and every other plain-word cell): paneCellText() prints a column's own
// PLAIN WORD -- "Not used", "Attached" -- wherever plainFor(el) is true (a tank whose mixing model
// is not two-compartment, a TCV valve's minor loss, a Text following a leader). A copy writes
// exactly what the cell shows, so that word is what lands on the clipboard. paneParseCellText() and
// paneWriteCellText() did not know it, so a paste carrying it back was refused as a bad number or a
// bad choice -- the word the cell itself produced could not be pasted back into the cell it came
// from. Every table that has such a column reproduces this, not only Tanks.
//
// ROOT CAUSE 2 (Text, and Customers): paneCanCreate() is deliberately false for the 'label' and
// 'customer' groups (a Text is placed on the map, a Customer is served from a pipe, neither by
// typing an ID) -- so an EMPTY Text or Customer table offered no paste target at all: no note, no
// listener, nothing on screen for the gesture to land on. Not a wrong refusal, a silent one. The
// note now says why instead of doing nothing.
//
// WHAT THIS ASSERTS, for every one of the eight tables (Net3 plus one valve and one customer it
// does not carry, and one anchored Text so the align/valign plain word is exercised too):
//
//   1. A table that CAN create rows (node/link groups): the whole table, copied from Net3 (a valve
//      and, where Net3 has none, added first) the way Ctrl+A/Ctrl+C actually reads it -- through
//      paneCellText(), no header row (R-310) -- pastes into a brand-new project, table after table
//      in dependency order (nodes, then links, exactly as Tom's report did it), and every INPUT
//      cell reads back exactly, plain words included. (A result column -- demandActual, pressure,
//      flow... -- is excluded: it is the SOLVE's number, and a partially-built network solves to a
//      different one than the finished source did; that is not what this harness is testing.)
//   2. A table that CANNOT create rows (Text, Customers): the same copy, pasted over the identical
//      network already carrying the same rows (the workflow the design actually supports: place
//      first, then bulk-edit by paste) -- every input cell round-trips there too.
//   3. Pasting that same copy into a truly EMPTY Text or Customer table no longer does nothing: the
//      table's own note explains why in words, and creates nothing.
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
	"\t\tselectCell: function (id, elId, key) { paneTableById(id).sel = { aId: elId, aKey: key, fId: elId, fKey: key }; },\n" +
	"\t\tpasteAt: function (id, text) { return panePasteAt(paneTableById(id), libPasteCells(text)); },\n" +
	"\t\tnotice: function () { return document.getElementById('lpn_map_notice').textContent || ''; },\n" +
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

// Copy exactly as Ctrl+A/Ctrl+C reads a table: one line per row, tab-separated, through
// paneCellText() -- no header (R-310), so a plain-word cell is copied as the word it shows.
function copyTable(tableId) {
	const ids = L.tableOrder(tableId), heads = L.headings(tableId);
	return { order: ids, heads: heads, sheet: ids.map((id) => heads.map((h) => L.cellText(tableId, id, h.key)).join('\t')).join('\n') };
}
// Every INPUT cell must round-trip; a RESULT cell is the solve's own number and a blank cell on a
// newly created row legitimately takes "the default a drawn element is born with" rather than
// staying blank (panePlanCreates' own rule) -- neither is what this harness is testing. The id
// column is skipped too: on a Text/Customer row it is a plain, unrenamable identity cell (never a
// value that could mismatch, whether the paste of its own text lands or is refused). Compared
// numerically where both sides parse as one, with a loose tolerance -- a customer's own coordinate
// is DERIVED (nearest point on its pipe) and re-snapping the same pasted number is not guaranteed
// to the same double bit for bit, only to the same place on the ground.
function compareRow(tableId, id, heads, wantRow, bad) {
	heads.forEach((h, cIdx) => {
		if (h.key === 'id' || h.result || !h.set) { return; }
		const want = wantRow[cIdx] === undefined ? '' : wantRow[cIdx];
		if (want === '') { return; }   // a blank source cell is not a promise about the created default
		const got = L.cellText(tableId, id, h.key);
		if (want === got) { return; }
		const wn = +want, gn = +got;
		if (isFinite(wn) && isFinite(gn) && Math.abs(wn - gn) < 1e-3) { return; }
		bad.push(id + '.' + h.key + ': want ' + JSON.stringify(want) + ' got ' + JSON.stringify(got));
	});
}

// ---- build the source: Net3, plus the one valve and one customer it does not carry, and one
// Text anchored to a node so the align/valign plain word is exercised too. ---------------------
const net3 = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', 'Net3.lwn'), 'utf8'));
L.applySaved(JSON.parse(JSON.stringify(net3)));
L.refreshAll();
const someJ = L.getDoc().nodes.filter((n) => n.type === 'junction').slice(0, 2).map((n) => n.id);
L.addLink('valve', someJ[0], someJ[1], [], 'PRV-1');   // Net3 carries no valve; TCV by default, so its km cell is plain
const somePipe = L.getDoc().links.filter((l) => l.type === 'pipe')[0];
L.addCustomer(0, 0, { link: somePipe.id, t: 0.5 });   // Net3 carries no customer
L.addText(0, 0, someJ[0]);   // anchored: align/valign are plain ("Attached") on this row

console.log('\n--- every table copies from Net3 (plus the valve/customer/anchored-text it lacked) ---');
const tableIds = L.tableIds();
report(tableIds.length >= 8, 'all eight tables are on the page', tableIds.map((t) => t.id).join(','));

const sheets = {};
tableIds.forEach((t) => { sheets[t.id] = copyTable(t.id); });
report(sheets.tanks.sheet.indexOf(PC.lpn_pane_not_used || 'Not used') >= 0,
	"Net3's own Tanks copy carries the plain word Not used, reproducing Tom's paste", JSON.stringify(sheets.tanks.sheet));
report(sheets.valves.sheet.indexOf(PC.lpn_pane_not_used || 'Not used') >= 0,
	"the added valve's Km cell copies as Not used too (a TCV's minor loss is plain)");
report(sheets.text.sheet.indexOf(PC.lpn_pane_text_attached || 'Attached') >= 0,
	'the anchored Text row copies its align/valign as Attached');

// A byte-identical snapshot of the fully-built source, for the Text/Customers leg below -- it
// needs a destination that already carries every row under the same id, and reloading this is the
// only way to guarantee the SAME numbers rather than recomputed ones (a customer's position is
// derived from its pipe, and re-deriving it a second time is not what is under test here).
const sourceSaved = L.serializeProject();

console.log('\n--- node and link tables (they CAN create rows): pasted table by table into one new, empty project, in dependency order ---');
L.reset();
// A curve REFERENCE is not the curve: Pumps carries a stated head-curve id, and that id has to
// exist in the destination's own Library before it can be pasted back, exactly as a real user
// opening a truly blank project would have to add the curve first. Seeded here as the Library's own
// door would be, so this harness tests the plain-word paste and not a missing-library setup step.
L.setCurves(JSON.parse(JSON.stringify(sourceSaved.curves || [])));
['junctions', 'reservoirs', 'tanks', 'pipes', 'pumps', 'valves'].forEach((tableId) => {
	const s = sheets[tableId];
	const res = pasteIntoEmpty(tableId, s.sheet);
	report(!!res, `${tableId}: an empty table offers a paste target`);
	report(res && res.prevented, `${tableId}: the paste is claimed`);
	const gotIds = L.tableOrder(tableId);
	report(gotIds.length === s.order.length, `${tableId}: every source row (${s.order.length}) was created`, String(gotIds.length));
	report(L.notice().indexOf(PC.lpn_pane_paste_refused || 'Nothing was pasted') !== 0,
		`${tableId}: the paste was not refused`, L.notice());
	const bad = [], srcRows = s.sheet.split('\n');
	gotIds.forEach((id, rIdx) => { compareRow(tableId, id, s.heads, (srcRows[rIdx] || '').split('\t'), bad); });
	report(bad.length === 0, `${tableId}: every input cell round-trips exactly, plain words included`, bad.slice(0, 6).join(' | '));
});

console.log('\n--- Text and Customers (they CANNOT create rows): the same copy pasted over the identical network, already carrying the same rows ---');
['text', 'customers'].forEach((tableId) => {
	const s = sheets[tableId];
	report(s.order.length > 0, `${tableId}: the source has rows to test with`, String(s.order.length));
	L.reset();
	L.applySaved(JSON.parse(JSON.stringify(sourceSaved)));   // the exact source network, rows and all
	L.openPane(tableId); L.renderTable(tableId);
	const destIds = L.tableOrder(tableId);
	report(destIds.length === s.order.length && destIds.every((id, i) => id === s.order[i]),
		`${tableId}: the destination carries the same ids in the same order`, destIds.join(',') + ' / ' + s.order.join(','));
	L.selectCell(tableId, destIds[0], s.heads[0].key);
	const r = L.pasteAt(tableId, s.sheet);
	// A read-only/result cell (Customers' Total, Connected asset) refuses a same-value paste exactly
	// as it refuses a keystroke, by design -- and so, separately, does the id column, which carries
	// no rename on a Text or a Customer. Neither writes a wrong value (bad[], below, is the real
	// regression gate); a refusal count above that many settable cells would be.
	const settable = s.heads.filter((h) => h.set && !h.result && h.key !== 'id').length;
	report(r && r.refused <= destIds.length * (s.heads.length - settable),
		`${tableId}: nothing SETTABLE was refused`, r && JSON.stringify(r));
	const bad = [], srcRows = s.sheet.split('\n');
	destIds.forEach((id, rIdx) => { compareRow(tableId, id, s.heads, (srcRows[rIdx] || '').split('\t'), bad); });
	report(bad.length === 0, `${tableId}: every input cell round-trips exactly, plain words included`, bad.slice(0, 6).join(' | '));
});

console.log('\n--- a truly empty Text/Customer table explains itself instead of doing nothing ---');
['text', 'customers'].forEach((tableId) => {
	L.reset();
	L.openPane(tableId); L.renderTable(tableId);
	const note = paneNote(tableId);
	report(!!note, `${tableId}: the empty table still shows a note`);
	const key = tableId === 'text' ? 'lpn_pane_paste_not_created_text' : 'lpn_pane_paste_not_created_customer';
	const want = PC[key];
	report(!!want && note && note.textContent.indexOf(want) >= 0,
		`${tableId}: the note says why a paste will not create rows here`, note && note.textContent);
	report(!(note && note._listeners && note._listeners.paste), `${tableId}: and it takes no paste action of its own`);
});

console.log(`\n${failures ? 'FAILURES' : 'all pass'}: ${checks - failures}/${checks}`);
process.exit(failures ? 1 : 0);
