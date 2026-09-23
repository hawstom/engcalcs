// WHAT A TAB KEEPS WHILE YOU ARE LOOKING AT ANOTHER ONE (ROADMAP Task 680). Run with:
//   node dev/lpn-spike/switch-keep-harness.js
//
// Tom, 2026-09-16: *"why aren't we storing these things when we switch away?"* The solve was thrown
// away by construction -- refreshAllFromDocument() opened with `lastSolveResult = null` -- so
// returning to a tab re-solved a network that had not changed while you were away, and drew every
// label EMPTY until the answer came back 300 ms later.
//
// **THE PROPERTY UNDER TEST IS NOT SPEED.** Measured in real Chrome the switch is no faster: the one
// label pass now composes values instead of blanks, which costs about what the second pass did. What
// it buys is that the numbers are there on arrival, no engine run is spent, and the tab is not
// marked dirty by its own re-solve. **What must be true is that a kept result is never the WRONG
// one**, and that is what this pins: the guard is a signature over the document, so an edit made
// while you were away misses it.

'use strict';
const path = require('path');
const stub = require('./lpn-dom-stub.js');
const { setUnitSet, loadLoopedNetwork } = stub;

const L = loadLoopedNetwork(
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h;\n" +
	"\t\t\tsvg.getBoundingClientRect = function () { return { top: 0, bottom: h, width: w, height: h }; }; },\n" +
	"\t\tmarkSized: noteMapSized,\n" +
	"\t\taddNode: addNode, addLink: addLink, getDoc: function () { return doc; },\n" +
	"\t\tnewProject: newProject, openProject: openProject,\n" +
	"\t\topenId: function () { return library.openId; },\n" +
	"\t\tprojects: function () { return library.projects.map(function (p) { return p.id; }); },\n" +
	"\t\tsetSolve: function (r) { lastSolveResult = r; },\n" +
	"\t\tsolve: function () { return lastSolveResult; },\n" +
	"\t\tsetElev: function (id, v) { nodeById(id).elev = v; },\n" +
	"\t\tsaveToStorage: saveToStorage,\n" +
	"\t\tapplySaved: applySaved, buildDom: buildDom, refreshLabelText: refreshLabelText,\n" +
	"\t\trefreshAll: refreshAllFromDocument, rememberSwitch: rememberSwitchState,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tlayoutOf: function () {\n" +
	"\t\t\tvar out = {};\n" +
	"\t\t\tObject.keys(nodeEls).forEach(function (id) { var h = nodeEls[id];\n" +
	"\t\t\t\tout['n:' + id] = JSON.stringify([h.nudge, h.placedSide, h.lines, h.lineCount,\n" +
	"\t\t\t\t\t!!h.hiddenDropped, !!h.hiddenCrossed, h.tw]); });\n" +
	"\t\t\tObject.keys(linkEls).forEach(function (id) { var h = linkEls[id];\n" +
	"\t\t\t\tout['l:' + id] = JSON.stringify([h.nudge, h.placedSide, h.lines, h.lineCount,\n" +
	"\t\t\t\t\t!!h.hiddenShort, !!h.hiddenCrowded, !!h.hiddenCrossed, h.shedCount, h.tw]); });\n" +
	"\t\t\treturn out; },\n" +
	"\t\trestores: function () { return switchRestoreCount; },\n" +
	"\t\tmiss: function () { return keptLayoutMiss; },\n" +
	"\t\tsetKeepLayout: function (v) { keepLayoutEnabled = v; },\n" +
	"\t\tsegIndexBuilds: function () { return linkSegIndexBuilds; }"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

setUnitSet('us');
L.buildLayers();
L.setCanvas(1400, 700);
L.markSized();

// Two projects, each with a network in it. **Both are made with newProject()**: the document a
// fresh page starts on is not in the library until something puts it there, so a harness that just
// draws and saves has one project and a null id.
L.newProject();
const first = L.openId();
const a = L.addNode('junction', 0, 0), b = L.addNode('junction', 100, 0);
L.addLink('pipe', a.id, b.id);
L.saveToStorage();
L.newProject();
const second = L.openId();
const c = L.addNode('junction', 0, 0), d = L.addNode('junction', 50, 0);
L.addLink('pipe', c.id, d.id);
L.saveToStorage();

// **SHAPED LIKE A REAL RESULT, because a restored one is handed straight to the renderer.** The
// arrow drawing reads `flows[id]` without asking whether the map exists; a bare marker object
// crashes the rebuild, which is a fair thing for this harness to have found even though only real
// results are ever kept in the page.
function fakeResult(mark) {
	return { ok: true, mark: mark, flows: {}, heads: {}, pressures: {}, velocities: {},
		headlosses: {}, quality: {}, converged: true, warnings: [], issues: [] };
}

console.log('--- a solve survives a switch away and back ---');
{
	L.openProject(first);
	// A result this harness can recognise again. The shape does not matter here; the identity does.
	const mine = fakeResult('kept-me');
	L.setSolve(mine);
	L.openProject(second);
	ok('switching away leaves the other project with no borrowed result',
		!L.solve() || L.solve().mark !== 'kept-me',
		'the incoming tab shows ' + JSON.stringify(L.solve() && L.solve().mark));
	L.openProject(first);
	ok('...and switching back restores the one that was computed here',
		!!L.solve() && L.solve().mark === 'kept-me',
		'got ' + JSON.stringify(L.solve() && L.solve().mark));
}

console.log('\n--- but never the WRONG result ---');
{
	// An edit made to the document while the tab was not open. The signature is over the document,
	// so the kept result must be refused -- this is the assertion the whole design rests on.
	L.openProject(first);
	L.setSolve(fakeResult('stale'));
	L.openProject(second);
	L.openProject(first);
	ok('a result kept for this document is reused while the document stands',
		!!L.solve() && L.solve().mark === 'stale');
	L.setSolve(fakeResult('edited-after'));
	L.openProject(second);
	// **THE EDIT HAS TO HAPPEN WHERE THE PAGE CANNOT SEE IT, or the test proves nothing.** Editing
	// through the open project would re-solve and replace the result, so the pairing would stay
	// honest by itself. This is the case the signature exists for: another window, or a hand edit,
	// moving the STORED document of a tab that is not open.
	const key = 'lpn_project_' + first;
	const stored = JSON.parse(localStorage.getItem(key));
	stored.nodes[0].elev = (stored.nodes[0].elev || 0) + 1234.5;
	localStorage.setItem(key, JSON.stringify(stored));
	L.openProject(first);
	ok('...and refused once the document has moved under it',
		!L.solve() || L.solve().mark !== 'edited-after',
		'got ' + JSON.stringify(L.solve() && L.solve().mark));
}

// ================================================================================================
// **THE ONE THAT MATTERS: A RESTORED LAYOUT IS THE LAYOUT THE PASS WOULD HAVE COMPUTED.**
// Keeping the placements is only sound if what comes back is what would have been worked out --
// every nudge, every side, every shed value, every hidden flag. So: switch away and back (which
// restores), record the whole layout, then force the real pass over the same drawing and compare
// label by label. A difference here is a label in the wrong place or missing a value, which is the
// failure this whole feature could produce and which nothing else would catch.
// ================================================================================================
console.log('\n--- a restored layout equals a computed one, label by label ---');
{
	const fs2 = require('fs');
	L.openProject(second);
	// **NO LEFTOVER RESULT FROM THE TESTS ABOVE.** A label's content depends on what has been
	// solved, so a fake result still sitting in the page would make the two passes below answer
	// different questions and the comparison would be about that rather than about the restore.
	L.setSolve(null);
	// A real drawing, because the interesting decisions (shedding, crowding, leaders) need a crowd.
	// **THE SHIPPED FILE'S OWN labelMaxWidth (Task 705, set to 30 ft 2026-09-22) IS CLEARED HERE.**
	// That threshold is a fact about the LABELING FEATURE and has nothing to do with what this
	// harness is testing -- whether a restored layout matches a computed one -- and at 30 ft on a
	// network this size it hides every label outright, which would make every position compare
	// equal for the wrong reason (nothing drawn, not "restored correctly"). A shared example file is
	// a shared fixture; this harness needs "always show labels", not whatever Net3.lwn ships today.
	const net3Doc = JSON.parse(fs2.readFileSync(
		path.join(__dirname, '../water-network-examples/Net3.lwn'), 'utf8'));
	if (net3Doc.settings) { net3Doc.settings.labelMaxWidth = null; }
	L.applySaved(net3Doc);
	L.refreshAll();
	const ls = L.labelSettings();
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
	L.refreshLabelText();
	L.setSolve(null);
	L.refreshLabelText();   // settled: the pass seeded from itself, as it is on any second look
	L.saveToStorage();
	// **THE VIEW HAS TO BE THE SAME ON BOTH VISITS, or the comparison is between two zooms.** A
	// layout belongs to the scale that produced it, which is why the restore is gated on the scale
	// in the first place -- so the project is saved WITH the view it is being read at.
	L.saveToStorage();
	const before = L.layoutOf();
	const restoresBefore = L.restores();
	// Away and back: the second switch restores rather than computes.
	L.openProject(first);
	const midRestores = L.restores();
	L.openProject(second);
	const restored = L.layoutOf();
	// **COUNTED ON THE SWITCH THAT MATTERS, not across both.** The switch AWAY restores the other
	// tab's layout and would satisfy a total on its own -- which is exactly how this assertion
	// passed while the switch back was quietly recomputing.
	ok('the switch BACK restored rather than recomputed', L.restores() === midRestores + 1,
		'restores ' + restoresBefore + ' -> ' + midRestores + ' -> ' + L.restores()
			+ '; refused because: ' + L.miss());
	// Now make it do the work anyway, over the identical drawing.
	L.refreshLabelText();
	const computed = L.layoutOf();
	// **IS THE PASS EVEN THE SAME TWICE?** If a second identical pass disagrees with the first, the
	// comparison above is measuring the pass's own memory rather than the restore.
	L.refreshLabelText();
	const computedAgain = L.layoutOf();
	const selfDiffer = Object.keys(computed).filter(function (k) { return computed[k] !== computedAgain[k]; });
	ok('the pass agrees with itself when run twice over the same drawing', !selfDiffer.length,
		selfDiffer.length + ' of ' + Object.keys(computed).length + ' labels differ between two '
		+ 'consecutive passes; first ' + (selfDiffer[0] || ''));

	const keys = Object.keys(computed);
	ok('the drawing came back with all its labels', keys.length > 100, keys.length + ' labels');
	const missing = keys.filter(function (k) { return restored[k] === undefined; });
	ok('...every one of them restored', !missing.length, missing.slice(0, 3).join(', '));
	// **THE FAITHFUL COMPARISON IS AGAINST WHAT WAS ON SCREEN, NOT AGAINST A FRESH PASS, and
	// measuring both is how that was learned.** A fresh pass over the restored drawing disagrees
	// with the restore on 214 of 216 labels -- and a plain rebuild with the keep SWITCHED OFF
	// disagrees with the pre-switch drawing on the same 214. **So the page already lays the same
	// document out differently after a rebuild**, at the same zoom, with the same settings; the
	// keep did not introduce that and is the only thing here that removes it. Asserting
	// restore == fresh pass would therefore be demanding that the keep reproduce an answer the
	// page does not reproduce either.
	// The same round trip with the keep SWITCHED OFF, which is what the page does today.
	L.setKeepLayout(false);
	L.openProject(first);
	L.openProject(second);
	const rebuilt = L.layoutOf();
	L.setKeepLayout(true);
	const moved = keys.filter(function (k) { return before[k] !== restored[k]; });
	const rebuiltDiffer2 = keys.filter(function (k) { return rebuilt[k] !== before[k]; });
	ok('a plain rebuild does NOT reproduce the layout it had -- the standing defect this keeps from '
		+ 'showing', rebuiltDiffer2.length > 0,
		rebuiltDiffer2.length + ' of ' + keys.length + ' labels move on a switch without the keep');
	ok('...and with the keep, every label comes back exactly where it was', !moved.length,
		moved.length + ' changed');
}

// ================================================================================================
// **A REBUILD IS LINEAR IN THE PIPES, NOT QUADRATIC.** `linkSegIndex()` indexes every link's
// segments; unheld it rebuilds that index on every call, and `buildDom()` asks for it once per pipe
// through `layoutLinkLabel()`. Measured on Tom's machine before the hold: `links 1,156 ms` of a
// 1,414 ms switch, 9.7 ms a pipe on a 119-pipe drawing; after, 16-30 ms here for the same work.
// A stopwatch cannot assert that safely on another machine -- the COUNT can.
// ================================================================================================
console.log('\n--- a rebuild indexes the pipes once, not once per pipe ---');
{
	const fs3 = require('fs');
	L.openProject(second);
	L.applySaved(JSON.parse(fs3.readFileSync(
		path.join(__dirname, '../water-network-examples/Net3.lwn'), 'utf8')));
	const links = L.getDoc().links.length;
	const before2 = L.segIndexBuilds();
	L.buildDom();
	const built = L.segIndexBuilds() - before2;
	ok('building a ' + links + '-pipe drawing builds the segment index a handful of times',
		built <= 4, built + ' index builds for ' + links + ' pipes');
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
