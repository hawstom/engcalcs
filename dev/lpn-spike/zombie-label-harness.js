// A LABEL ELEMENT NOTHING OWNS IS STILL ON THE MAP AND STILL CLICKABLE. Run with:
//   node dev/lpn-spike/zombie-label-harness.js
//
// Tom, 2026-09-01: *"Turning off all labels to try to double-click vertices better (it didn't help
// much if at all) left zombie labels on the map on the phone and PC. Their size no longer scales.
// They don't move. I can't drag them. But I can use them to edit their pipe. Bad, bad, bad."*
//
// **THE CAUSE IS ONE MISSING LINE IN A TEARDOWN, NOT ANYTHING ABOUT LABEL VISIBILITY.** Double-
// clicking a vertex handle runs removeVertex() -> rebuildLink(), and buildLinkEls() REPLACES
// linkEls[l.id] with a fresh holder. Anything of the old holder still hanging in the shared labels
// layer at that moment is orphaned: no holder points at it, so refreshFontSizes() never rescales
// it, relayoutLabels() never moves it, refreshLabelTextPass() never rewrites or empties it, and
// setLabelAssemblyHidden() never hides it -- while its own `data-linklbl` still routes a click to
// the pipe. Every one of Tom's five symptoms is that single fact. rebuildLink() removed the line,
// the halo, the handles, the arrows, the primary text, the leader and the symbol, and did NOT
// remove the REPEAT CHAIN a long pipe carries; deleteLink()'s own copy of the same list did. Two
// lists, one of them wrong, which is why the fix is removeLinkEls() and one list.
//
// **A SHAPE-ONLY CHECK WOULD PASS OVER THIS**, which is why section 2 asserts what Tom actually
// observed rather than counting elements: the orphan is IN the DOM, it still carries the dataset
// that routes a click to its pipe, its content survives a pass that empties every live label, and
// a zoom does not rescale it.
//
// The stub lays nothing out, so what is asserted here is OWNERSHIP -- which elements the update
// path can still reach. That is exactly the property that failed.

'use strict';

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

setUnitSet('us');
const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, runSolve: runSolve,\n" +
	"\t\trefreshLabelText: refreshLabelText,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tlinkEls: function () { return linkEls; },\n" +
	"\t\tlabelsLayer: function () { return labelsLayer; },\n" +
	"\t\tinsertVertex: insertVertex, removeVertex: removeVertex, deleteLink: deleteLink,\n" +
	"\t\tundo: undo, undoDepth: function () { return undoStack.length; },\n" +
	"\t\tstations: linkLabelStations,\n" +
	"\t\tzoomTo: function (s) { state.s = s; refreshFontSizes(); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }"
);

L.buildLayers();
L.setCanvas(1000, 700);
L.seedDefaultInputs();

// A pipe long enough to repeat its label -- the repeat chain is the half of the holder the broken
// teardown forgot, so a short pipe cannot reach this defect at all.
const res = L.addNode('reservoir', 0, 0);
const j1 = L.addNode('junction', 2000, 0);
const j2 = L.addNode('junction', 2000, 900);
const long = L.addLink('pipe', res.id, j1.id);
L.addLink('pipe', j1.id, j2.id);
L.buildDom();
L.runSolve();

const ls = L.labelSettings();
Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
L.refreshLabelText();

// Every <text> in the labels layer, and the text it is actually showing.
function labelTexts() {
	return L.labelsLayer().children.filter(function (c) { return c._tag === 'text'; });
}
function contentOf(e) {
	if (e._text) { return e._text; }
	return (e.children || []).map(contentOf).join('');
}
// Is this element one the update path can still reach? A link label is owned either as the holder's
// own `text` or as one of its `repeats`; that IS the set every later pass walks.
function ownedByALiveHolder(e) {
	const els = L.linkEls();
	return Object.keys(els).some(function (id) {
		const le = els[id];
		return le.text === e || (le.repeats || []).some(function (r) { return r.text === e; });
	});
}
function orphans() {
	return labelTexts().filter(function (e) {
		return e.dataset.linklbl !== undefined && !ownedByALiveHolder(e);
	});
}

console.log('\n--- the drawing really has a repeat chain on it, or nothing below can fail ---');
report(L.stations(long).length > 1, 'the long pipe repeats its label',
	L.stations(long).length + ' stations');
report((L.linkEls()[long.id].repeats || []).length > 0, '...so its holder carries repeat elements',
	(L.linkEls()[long.id].repeats || []).length + ' repeats');
report(orphans().length === 0, 'and a freshly built drawing has no orphan to begin with');

console.log('\n--- editing a bend does not orphan the chain (Tom\'s double-click on a vertex) ---');
{
	L.insertVertex(long.id, { x: 1000, y: 300 });
	const afterInsert = orphans().length;
	L.removeVertex(long.id, 0);
	const afterRemove = orphans().length;
	report(afterInsert === 0, 'adding a bend leaves no unowned label element', afterInsert + ' orphans');
	report(afterRemove === 0, 'and double-clicking the vertex off leaves none either',
		afterRemove + ' orphans');
}

console.log('\n--- the four things Tom could see, asserted one at a time ---');
{
	// Get the drawing back into the state he was in: bends edited, then every label field off.
	L.insertVertex(long.id, { x: 1000, y: 300 });
	L.removeVertex(long.id, 0);
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = false; });
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = false; });
	L.refreshLabelText();

	const showing = labelTexts().filter(function (e) { return contentOf(e).trim() !== ''; });
	report(showing.length === 0,
		'1. with every label field off, nothing on the map is still lettered',
		showing.length + ' elements still showing text');

	const clickable = labelTexts().filter(function (e) {
		return e.dataset.linklbl !== undefined && !ownedByALiveHolder(e);
	});
	report(clickable.length === 0,
		'2. no element routes a click to a pipe that no pass can reach',
		clickable.length + ' unowned data-linklbl elements');

	// "Their size no longer scales": every label element must take the new font size on a zoom, and
	// refreshFontSizes() walks nodeEls/linkEls -- so an orphan is exactly what it cannot see.
	L.zoomTo(4);
	const stale = labelTexts().filter(function (e) {
		return String(e.style.fontSize) !== (11 / 4) + 'px';
	});
	report(stale.length === 0, '3. a zoom rescales every label element on the map',
		stale.length + ' elements left at the old size');
	L.zoomTo(1);
}

console.log('\n--- and a deleted pipe still takes its whole chain with it (2026-07-30) ---');
{
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
	L.refreshLabelText();
	const before = labelTexts().length;
	L.deleteLink(long.id);
	const after = labelTexts().length;
	report(orphans().length === 0, 'deleting the pipe leaves no unowned label element',
		orphans().length + ' orphans');
	report(after < before, '...and its elements really are gone', before + ' -> ' + after + ' texts');
}

// ================================================================================================
// AND A BEND EDIT IS UNDOABLE -- ROADMAP Task 567's first strand
// ================================================================================================
// Found 2026-09-01 by the utility-field-operator agent, reading for a DIFFERENT question: the
// browser's own `dblclick` bends a pipe or removes a bend in ordinary `select` mode, and neither
// insertVertex() nor removeVertex() took an undo snapshot -- while the identical edit reached
// through the Delete TOOL did, because that ONE call site remembered. So the accident was the
// unrecoverable half and the deliberate act was the safe one, which is backwards.
//
// **THIS ASSERTS THE SNAPSHOT, NOT THE HANDLER.** The double-click listener is not reachable from
// here (the DOM stub dispatches no dblclick), so the assertion is placed where the fix is: on the
// functions themselves, which is exactly why the fix went there rather than into the handler. A
// third caller cannot now forget.
console.log('\n--- a bend edit is undoable, however it was reached (Task 567) ---');
{
	const l2 = L.getDoc().links[0];
	const before = L.undoDepth();
	L.insertVertex(l2.id, { x: 500, y: 260 });
	report(L.undoDepth() === before + 1, 'adding a bend pushes exactly one undo snapshot',
		before + ' -> ' + L.undoDepth());
	const verts = l2.verts.length;
	L.undo();
	report(L.getDoc().links[0].verts.length === verts - 1,
		'...and it takes the bend back off', 'verts now ' + L.getDoc().links[0].verts.length);

	// Removing one is the other half, and it is the branch a stray double-tap on a HANDLE reaches.
	L.insertVertex(l2.id, { x: 500, y: 260 });
	const d2 = L.undoDepth(), v2 = L.getDoc().links[0].verts.length;
	L.removeVertex(l2.id, 0);
	report(L.undoDepth() === d2 + 1, 'removing a bend pushes exactly one snapshot, not two',
		d2 + ' -> ' + L.undoDepth());
	L.undo();
	report(L.getDoc().links[0].verts.length === v2, '...and one Undo puts it back',
		'verts now ' + L.getDoc().links[0].verts.length);
}

console.log(`\n${failures ? 'FAILURES: ' + failures : 'all ' + checks + ' checks passed'}`);
process.exit(failures ? 1 : 0);
