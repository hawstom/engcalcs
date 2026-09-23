// WHERE THE TIME GOES BETWEEN A KEYSTROKE AND THE CHARACTER APPEARING. Run with:
//   node dev/lpn-spike/pane-typing-bench.js [rows]
//
// Tom, 2026-09-18, on feat/tables-spreadsheet: *"Editing is very sluggish, even when I turn off
// auto recalculate."* He has already ruled out the solve, which is the obvious answer and the wrong
// one. This measures the rest rather than guessing at it, because a wrong guess about where time
// goes has cost this project whole rounds before (Task 680 found HALF of a 636 ms project switch in
// the label pass, which nobody had suspected).
//
// It is a BENCH and not a harness: it asserts nothing and fails nothing. Numbers on this machine are
// not numbers on his, but the SHAPE -- which call is 90% of a keypress -- carries across.

'use strict';

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const N = parseInt(process.argv[2] || '400', 10);
setUnitSet('us');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tpaneTableById: paneTableById, openPane: openPane,\n" +
	"\t\trenderTable: function (id) { renderPaneTable(paneTableById(id)); },\n" +
	"\t\trowsInOrder: function (id) { return paneTableRowsInOrder(paneTableById(id)); },\n" +
	"\t\tcols: function (id) { return paneCols(paneTableById(id)); },\n" +
	"\t\tsignature: function (id) { var s = paneTableById(id); return paneTableSignature(s, paneTableRowsInOrder(s)); },\n" +
	"\t\tselPaint: function (id) { var s = paneTableById(id); paneSelPaint(s, paneTableRowsInOrder(s), paneCols(s)); },\n" +
	"\t\trefill: function (id) { var s = paneTableById(id); refillPaneTable(s, paneTableRowsInOrder(s)); },\n" +
	"\t\thandleKey: function (id, e) { return paneHandleKey(paneTableById(id), e); },\n" +
	"\t\tcells: function (id) { return paneTableById(id).cells; },\n" +
	"\t\tcommit: paneCommitCell, enterEdit: paneEnterEdit,\n" +
	"\t\tsetCell: function (id, elId, key, v) { var s = paneTableById(id),\n" +
	"\t\t\tel = doc.nodes.filter(function (x) { return x.id === elId; })[0];\n" +
	"\t\t\tpaneColByKey(s, key).set(el, v); },\n" +
	"\t\tafterPropertyEdit: afterPropertyEdit, saveToStorage: saveToStorage,\n" +
	"\t\tserialize: serializeProject, scheduleSolve: scheduleSolve,\n" +
	"\t\trefreshScenarioMarks: refreshScenarioMarks, refreshPaneIfOpen: refreshPaneIfOpen,\n" +
	"\t\tupdateNode: updateNode,\n" +
	"\t\tmapBoxReads: function () { return mapBoxReads; },\n" +
	"\t\tsegIndexBuilds: function () { return linkSegIndexBuilds; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

const ids = [];
for (let i = 0; i < N; i++) {
	const n = L.addNode('junction', (i % 20) * 30, Math.floor(i / 20) * 30);
	ids.push(n.id);
	L.setCell('junctions', n.id, 'elev', 100 + (i % 37));
	L.setCell('junctions', n.id, 'demand', 5 + (i % 11));
}
L.openPane('junctions');
L.renderTable('junctions');
const cols = L.cols('junctions');
console.log(`${N} junctions, ${cols.length} columns, ${N * cols.length} cells\n`);

function ms(label, reps, fn) {
	fn();                                  // warm
	const t0 = process.hrtime.bigint();
	for (let i = 0; i < reps; i++) { fn(); }
	const per = Number(process.hrtime.bigint() - t0) / 1e6 / reps;
	console.log('  ' + per.toFixed(2).padStart(8) + ' ms   ' + label);
	return per;
}

const cell = () => L.cells('junctions')[ids[3]].elev;
const keyEvent = (k, mod) => Object.assign({
	key: k, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false,
	preventDefault: function () {}
}, mod || {});

console.log('THE PIECES, each measured on its own:');
const tRows = ms('paneTableRowsInOrder()  -- filter + sort, per call', 200, () => L.rowsInOrder('junctions'));
const tCols = ms('paneCols()', 200, () => L.cols('junctions'));
const tSig = ms('paneTableSignature()    -- string of every row id + heading', 200, () => L.signature('junctions'));
const tPaint = ms('paneSelPaint()          -- a class on every td', 50, () => L.selPaint('junctions'));
const tRefill = ms('refillPaneTable()       -- every cell re-read and rewritten', 50, () => L.refill('junctions'));
const tRender = ms('renderPaneTable()       -- the whole tab, signature + refill', 50, () => L.renderTable('junctions'));
const tSer = ms('serializeProject()', 50, () => L.serialize());
const tSave = ms('saveToStorage()         -- serialize + JSON + localStorage', 50, () => L.saveToStorage());
const tMarks = ms('refreshScenarioMarks()', 50, () => L.refreshScenarioMarks());
const tNode = ms('updateNode() on one node', 200, () => L.updateNode(ids[3]));

console.log('\nTHE GESTURES, as the page really runs them:');
const tArrow = ms('one ArrowDown in the table', 50, () => {
	L.handleKey('junctions', keyEvent('ArrowDown'));
	L.handleKey('junctions', keyEvent('ArrowUp'));
});
const tType = ms('one printable character in Select mode', 50, () => {
	const c = cell();
	c.readOnly = true;
	L.handleKey('junctions', keyEvent('9'));
});
const tCommit = ms('one commit (Enter / blur) on a cell', 20, () => {
	const c = cell();
	c.value = String(100 + Math.random());
	L.commit(c);
});

console.log('\nWHAT A COMMIT IS MADE OF: '
	+ `saveToStorage ${tSave.toFixed(1)} + renderPaneTable ${tRender.toFixed(1)} `
	+ `+ scenario marks ${tMarks.toFixed(1)} = ${(tSave + tRender + tMarks).toFixed(1)} ms `
	+ `of a measured ${tCommit.toFixed(1)} ms.`);
console.log(`AN ARROW KEY IS: rowsInOrder ${tRows.toFixed(1)} x2 + selPaint ${tPaint.toFixed(1)} `
	+ `= ${(tRows * 2 + tPaint).toFixed(1)} ms of a measured ${tArrow.toFixed(1)} ms (two presses).`);
console.log(`(signature ${tSig.toFixed(1)}, refill ${tRefill.toFixed(1)}, serialize ${tSer.toFixed(1)}, `
	+ `updateNode ${tNode.toFixed(2)}, cols ${tCols.toFixed(2)})`);
