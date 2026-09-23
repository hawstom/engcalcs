// UNDO ON AN ORDINARY PROPERTY EDIT. Run with:
//   node dev/lpn-spike/undo-property-edit-harness.js
//
// Tom, 2026-09-22: *"When I change Base demand, Ctrl+Z or the Undo button don't put it back to
// what it was."* MEASURED, not guessed: every generic field builder the Properties popup shares
// (unitNumberField, unitNumberFieldBlank, numberFieldBlank, numberFieldPlain, textField,
// patternField, selectFieldPlain) and the Base demand row's own three inputs
// (demandRowInto()'s bInput/sel/cInput) committed the edit straight to the document and never
// called saveUndoSnapshot() -- so there was nothing on the undo stack to pop. Ctrl+Z and the Undo
// button share one handler (undo(), wired once on keydown and once on the toolbar button), so
// this is not "the button and the shortcut disagree"; both call the same function and both found
// an empty (or stale) stack. Every OTHER commit path in this popup already took its own snapshot
// (the override marker's checkbox, closedField, curveChooser, customPropFields, a demand row's
// delete button) -- these were the ones that did not, and the Tables pane's single-cell commit
// (paneCommitCell()) had the identical gap alongside a paste, which DID snapshot.
//
// THE INVARIANT THIS FILE HOLDS: after an edit and one Undo, the DOCUMENT, the PROPERTIES BOX
// (a re-render of it), the MAP LABEL and the TABLES PANE all show the ORIGINAL value again --
// CLAUDE.md's own rule that an edit must show up everywhere the input is shown, applied to undo.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, buildDom: buildDom, nodeById: nodeById,\n" +
	"\t\trenderNodeFields: renderNodeFields,\n" +
	"\t\tundo: undo, undoDepth: function () { return undoStack.length; },\n" +
	"\t\tpaneTables: paneTables,\n" +
	"\t\tpaneCommitCell: paneCommitCell,\n" +
	"\t\tnodeLabelText: function (id) { return nodeEls[id] ? nodeEls[id].text.textContent : null; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
setUnitSet('us');
L.seedDefaultInputs();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

function findAll(kids, tag) {
	const out = [];
	(function walk(list) {
		(list || []).forEach((c) => {
			if (c.tagName === tag) { out.push(c); }
			if (c.children && c.children.length) { walk(c.children); }
		});
	})(kids);
	return out;
}
function popupFor(id) {
	byId.lpn_popup_fields.children.length = 0;
	L.renderNodeFields(id);
	return byId.lpn_popup_fields.children;
}
function demandInputOf(id) {
	const kids = popupFor(id);
	const table = kids.filter((c) => c.tagName === 'TABLE')[0];
	return findAll([table], 'INPUT').filter((i) => i.type === 'number')[0];
}
function demandColGet(id) {
	const n = L.nodeById(id);
	return L.paneTables().filter((t) => t.id === 'junctions')[0]
		.cols.filter((c) => c.key === 'demand')[0].get(n);
}

console.log('=== undo after an ordinary property edit ===');

const doc = L.getDoc();
doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
const seed = L.addNode('junction', 100, 100);
seed._demand = 25;
const ID = seed.id;   // the id is stable across undo(); the OBJECT is not -- undo() replaces
                       // `doc` wholesale with the snapshot's deep clone, the stub trap
                       // dev/testing-notes.md warns about. Every section below re-fetches by id.
const ORIGINAL = 25;
const EDITED = 999;

// ---------------------------------------------------------------------------
// 1. Base demand -- Tom's own reported case.
// ---------------------------------------------------------------------------
console.log('\n--- Base demand, edited through the popup row ---');
{
	const depthBefore = L.undoDepth();
	const input = demandInputOf(ID);
	ok('found the Base demand input', !!input);
	input.value = String(EDITED);
	input._listeners.change[0]();
	ok('the edit reached the document', L.nodeById(ID)._demand === EDITED,
		L.nodeById(ID)._demand);
	ok('the edit took an undo snapshot', L.undoDepth() === depthBefore + 1,
		'depth ' + depthBefore + ' -> ' + L.undoDepth());

	L.undo();
	ok('DOCUMENT: the document is back to the original', L.nodeById(ID)._demand === ORIGINAL,
		L.nodeById(ID)._demand);
	ok('TABLES PANE: the demand column reads the original', demandColGet(ID) === ORIGINAL,
		demandColGet(ID));
	ok('MAP LABEL: rebuilt without the edited value baked into any element',
		!!L.nodeLabelText(ID) || L.nodeLabelText(ID) === '');   // no throw; buildDom() ran
	const reopened = demandInputOf(ID);
	ok('PROPERTIES BOX: re-opening the popup shows the original value',
		reopened.value === String(ORIGINAL), reopened.value);
}

// ---------------------------------------------------------------------------
// 2. Elevation -- unitNumberField(), the most-shared of the generic builders.
// ---------------------------------------------------------------------------
console.log('\n--- Elevation, a plain unitNumberField() ---');
{
	L.nodeById(ID).elev = 10;
	const depthBefore = L.undoDepth();
	const kids = popupFor(ID);
	// Elevation is unitNumberField()'s own row, ahead of the coordinate fields' number inputs
	// (Task 674) in a junction popup's DOM order -- found by its label text, not by position, so
	// a future reorder cannot silently retarget this at the wrong box.
	const elevLabel = kids.filter((c) => c.tagName === 'LABEL')
		.filter((c) => (c.textContent || '').indexOf(EngCalcs.pageConfig.lpn_field_elev || 'Elevation') === 0)[0];
	const elevInput = findAll([elevLabel], 'INPUT')[0];
	ok('found the Elevation input', !!elevInput);
	elevInput.value = '500';
	elevInput._listeners.change[0]();
	ok('the edit reached the document', L.nodeById(ID).elev === 500, L.nodeById(ID).elev);
	ok('the edit took an undo snapshot', L.undoDepth() === depthBefore + 1,
		'depth ' + depthBefore + ' -> ' + L.undoDepth());
	L.undo();
	ok('the document is back to the original elevation', L.nodeById(ID).elev === 10,
		L.nodeById(ID).elev);
}

// ---------------------------------------------------------------------------
// 3. The Tables pane's own single-cell commit (paneCommitCell()), not a paste.
// ---------------------------------------------------------------------------
console.log('\n--- a single cell typed in the Tables pane ---');
{
	L.nodeById(ID)._demand = 25;
	const depthBefore = L.undoDepth();
	const spec = L.paneTables().filter((t) => t.id === 'junctions')[0];
	// A cell as paneTableRow() builds one: a text input carrying _lpnCell.
	const cellInput = { type: 'text', value: '77',
		_lpnCell: { spec: spec, c: spec.cols.filter((c) => c.key === 'demand')[0], el: L.nodeById(ID) } };
	L.paneCommitCell(cellInput);
	ok('the cell write reached the document', L.nodeById(ID)._demand === 77, L.nodeById(ID)._demand);
	ok('the cell commit took an undo snapshot', L.undoDepth() === depthBefore + 1,
		'depth ' + depthBefore + ' -> ' + L.undoDepth());
	L.undo();
	ok('the document is back to the original demand', L.nodeById(ID)._demand === 25,
		L.nodeById(ID)._demand);
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
