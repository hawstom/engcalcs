// Multi-select and the three select-area shapes — ROADMAP Task 266. Run with:
//   node dev/lpn-spike/select-area-harness.js
//
// WHY THIS EXISTS. Task 415 made the map select-first so that a second subject would have
// somewhere to go, and this is that second subject arriving. Four ways it can be wrong, all of
// them quiet:
//
//   1. **A mark left on an element that has stopped being selected.** Selection is a CSS class on
//      a drawn element and a list in a variable, and the two can drift apart. If they do, the map
//      shows a highlight the next bulk edit will not touch — and nothing on screen explains it.
//   2. **A cascade cancelling a delete halfway through.** Deleting a node destroys the pipes on
//      it. Before multi-select, dropping the whole selection at that moment cost nothing because
//      there was only ever one thing in it. With many, it silently cancels the rest of the delete.
//   3. **Three containment rules instead of one.** A window, a lasso and a polygon are three ways
//      of producing a ring and one question afterwards. Three tests are three chances to disagree
//      about an edge, on three gestures a user thinks of as one command.
//   4. **A link caught by one end.** A marquee over one junction of a long main must not carry
//      that main and everything a bulk edit then does to it out of the visible area.
//
// The containment predicate itself is pure and lives in js/lpn-geom.js; the first section here
// is against that function directly, because it is the one piece with a right answer that can be
// computed by hand.

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
require(path.join(ROOT, 'js', 'lpn-geom.js'));

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// ---- 1. the predicate, by hand ----------------------------------------------------------------
console.log('\n--- pointInPolygon(), which all three shapes go through ---');
{
	const G = EngCalcs.lpnGeom;
	const sq = G.rectRing(0, 0, 10, 10);
	report(sq.length === 4, 'a window drag becomes a four-point ring');
	report(G.pointInPolygon(sq, 5, 5), 'a point in the middle is in');
	report(!G.pointInPolygon(sq, 15, 5), 'a point to the right is out');
	report(!G.pointInPolygon(sq, 5, -1), 'a point above is out');
	// A drag up and to the LEFT is as ordinary as one down and to the right, and the ring must not
	// care which corner the gesture started at.
	const back = G.rectRing(10, 10, 0, 0);
	report(G.pointInPolygon(back, 5, 5), 'a backwards drag makes the same window');
	// A concave ring is the whole reason a lasso is not a bounding box: the notch has to be OUT.
	const c = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 6, y: 10 },
		{ x: 6, y: 4 }, { x: 4, y: 4 }, { x: 4, y: 10 }, { x: 0, y: 10 }];
	report(G.pointInPolygon(c, 2, 8), 'a concave ring holds a point in one of its arms');
	report(!G.pointInPolygon(c, 5, 8), '...and NOT one in the notch between them',
		'this is the whole difference between a lasso and its bounding box');
	report(!G.pointInPolygon([{ x: 0, y: 0 }, { x: 1, y: 1 }], 0.5, 0.5),
		'a ring of two points holds nothing, which is what a click with no drag is');
	report(!G.pointInPolygon(null, 0, 0), 'and neither does no ring at all');
}

// ---- the page ---------------------------------------------------------------------------------
setUnitSet('us');
const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	// The selection through the doors the page itself uses — never by assigning the variable.
	"\t\tsetSelection: setSelection, clearSelection: clearSelection,\n" +
	"\t\ttoggleInSelection: toggleInSelection, selectedRefs: selectedRefs,\n" +
	"\t\tselectionCount: selectionCount, isSelected: isSelected,\n" +
	"\t\tselectedRef: selectedRef, deleteSelection: deleteSelection,\n" +
	"\t\trefreshSelection: refreshSelection,\n" +
	"\t\tmarked: function () { return doc.nodes.filter(function (n) {\n" +
	"\t\t\tvar c = nodeEls[n.id] && nodeEls[n.id].circle;\n" +
	"\t\t\treturn c && c.classList && c.classList.contains('lpn-selected'); }).map(function (n) { return n.id; }); },\n" +
	// The area tool through its own door, and the ring set the way a drag sets it.
	"\t\tsetAreaShape: setSelectAreaShape, areaShape: function () { return selectAreaShape; },\n" +
	"\t\tareaShapeNext: selectAreaShapeNext,\n" +
	"\t\tsetRing: function (pts) { areaRing = pts; paintAreaMarquee(); },\n" +
	"\t\tringPoints: areaRingPoints, elementsInRing: elementsInRing,\n" +
	"\t\tcommitArea: function (add) { areaAdd = !!add; return commitArea(); },\n" +
	"\t\tmarqueeShown: function () { return selectAreaEl && selectAreaEl.style.display !== 'none'; },\n" +
	"\t\tmode: function () { return mode; }, setMode: setMode,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world);\n" +
	"\t\t\tselectAreaEl = el('polygon', { 'class': 'lpn-marquee', style: 'display:none' }, world); }\n"
);
L.buildLayers();

// A row of four junctions with pipes between them. The window is drawn around the middle two, so
// exactly one pipe has BOTH ends inside and two have one end each — which is the only arrangement
// that can tell the two containment rules apart.
const doc = L.getDoc();
const n = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0),
	L.addNode('junction', 20, 0), L.addNode('junction', 30, 0)];
const ids = n.map((x) => x.id);
const pipes = [L.addLink('pipe', ids[0], ids[1]), L.addLink('pipe', ids[1], ids[2]),
	L.addLink('pipe', ids[2], ids[3])];
const G = EngCalcs.lpnGeom;

// ---- 2. many, and the mark follows the list ---------------------------------------------------
console.log('\n--- selection is a list, and the mark is the list ---');
{
	L.setSelection('node', ids[0]);
	report(L.selectionCount() === 1, 'one selected');
	report(L.marked().join(',') === ids[0], 'and the map marks exactly it', L.marked().join(','));
	L.toggleInSelection('node', ids[1]);
	report(L.selectionCount() === 2, 'Shift-click adds a second');
	report(L.marked().sort().join(',') === ids.slice(0, 2).sort().join(','),
		'and the map marks both', L.marked().join(','));
	// Already in means out again — the only way to correct a marquee that caught one too many.
	L.toggleInSelection('node', ids[0]);
	report(L.selectionCount() === 1 && L.isSelected('node', ids[1]),
		'Shift-clicking one that is already in takes it out');
	report(L.marked().join(',') === ids[1], '...and its mark goes with it', L.marked().join(','));
	// The singular is the LAST one, which is what every verb written before multi-select reads.
	report(L.selectedRef() && L.selectedRef().id === ids[1],
		'the singular selection is the last of the list, for every pre-266 reader');
	L.clearSelection();
	report(L.marked().length === 0, 'clearing takes every mark off the map');
}

// ---- 3. the same element twice is one selection -----------------------------------------------
{
	L.setSelection('node', ids[0]);
	L.toggleInSelection('node', ids[1]);
	L.toggleInSelection('node', ids[1]);
	L.toggleInSelection('node', ids[1]);
	report(L.selectionCount() === 2, 'toggling three times leaves it in, once', String(L.selectionCount()));
	report(L.selectedRefs().filter((s) => s.id === ids[1]).length === 1,
		'and it appears in the list once, so a count cannot be a lie');
}

// ---- 4. what a ring catches --------------------------------------------------------------------
console.log('\n--- what is inside ---');
{
	// x from 5 to 25 catches the middle two junctions and exactly one whole pipe.
	const ring = G.rectRing(5, -5, 25, 5);
	const found = L.elementsInRing(ring);
	const nodes = found.filter((f) => f.kind === 'node').map((f) => f.id);
	const links = found.filter((f) => f.kind === 'link').map((f) => f.id);
	report(nodes.sort().join(',') === ids.slice(1, 3).sort().join(','),
		'a node is caught by its own position', nodes.join(','));
	report(links.join(',') === pipes[1].id,
		'a link is caught only when BOTH its ends are', links.join(','));
	report(links.indexOf(pipes[0].id) < 0 && links.indexOf(pipes[2].id) < 0,
		'...so a main with one end in the ring is left alone',
		'the CAD window-select rule, stated rather than inferred');
	report(L.elementsInRing([]).length === 0, 'an empty ring catches nothing');
}

// ---- 5. the three shapes are one mechanism ----------------------------------------------------
console.log('\n--- three shapes, one ring ---');
{
	report(L.areaShapeNext('window') !== L.areaShape(), 'the shapes cycle');
	const seen = [];
	let s = L.areaShape();
	for (let i = 0; i < 3; i++) { seen.push(s); L.setAreaShape(L.areaShapeNext()); s = L.areaShape(); }
	report(seen.sort().join(',') === 'lasso,polygon,window',
		'and three presses reach all three, then come back round', seen.join(','));
	report(L.mode() === 'select-area', 'entering a shape is entering the tool');

	// A WINDOW carries two corners and is squared up by the one function that draws it, so the
	// gesture never has to know which corner it started at.
	L.setAreaShape('window');
	L.setRing([{ x: 5, y: -5 }, { x: 25, y: 5 }]);
	report(L.ringPoints().length === 4, 'a window ring of two corners draws as four points');
	const byWindow = L.elementsInRing(L.ringPoints()).map((f) => f.kind + ':' + f.id).sort().join(',');

	// A LASSO is the path a pointer dragged. Drawn around the same two junctions, it must catch
	// exactly the same things — that is the claim that one predicate serves all three.
	L.setAreaShape('lasso');
	L.setRing([{ x: 5, y: -5 }, { x: 15, y: -6 }, { x: 25, y: -5 }, { x: 25, y: 5 },
		{ x: 15, y: 6 }, { x: 5, y: 5 }]);
	const byLasso = L.elementsInRing(L.ringPoints()).map((f) => f.kind + ':' + f.id).sort().join(',');
	report(byLasso === byWindow, 'a lasso around the same ground catches the same elements', byLasso);

	// A POLYGON is the ring a series of clicks built. Same ground, same answer.
	L.setAreaShape('polygon');
	L.setRing([{ x: 5, y: -5 }, { x: 25, y: -5 }, { x: 25, y: 5 }, { x: 5, y: 5 }]);
	const byPoly = L.elementsInRing(L.ringPoints()).map((f) => f.kind + ':' + f.id).sort().join(',');
	report(byPoly === byWindow, '...and so does a polygon', byPoly);
}

// ---- 6. the commit, and Shift ------------------------------------------------------------------
console.log('\n--- committing a ring ---');
{
	L.clearSelection();
	L.setAreaShape('window');
	L.setRing([{ x: 5, y: -5 }, { x: 25, y: 5 }]);
	report(L.marqueeShown(), 'the marquee is on the map while it is being drawn');
	const got = L.commitArea(false);
	report(got === 3, 'the commit reports what it caught', String(got));
	report(!L.marqueeShown(), 'and the marquee comes off the map when it commits');
	report(L.selectionCount() === 3, 'and the subject is those three');
	// SHIFT ADDS. Without it a second marquee is a second question, not a longer answer.
	L.setRing([{ x: -5, y: -5 }, { x: 5, y: 5 }]);
	L.commitArea(true);
	report(L.selectionCount() === 4, 'a second ring with Shift adds to the first',
		String(L.selectionCount()));
	L.setRing([{ x: -5, y: -5 }, { x: 5, y: 5 }]);
	L.commitArea(false);
	report(L.selectionCount() === 1, '...and without Shift it replaces it', String(L.selectionCount()));
	// A press with no travel leaves a degenerate ring, which must select nothing rather than
	// everything — the difference between a stray click and a catastrophe.
	L.setRing([{ x: 0, y: 0 }, { x: 0, y: 0 }]);
	L.commitArea(false);
	report(L.selectionCount() === 0, 'a click with no drag selects nothing at all');
}

// ---- 7. a cascade takes one element out, not the whole subject ---------------------------------
console.log('\n--- deleting many ---');
{
	L.clearSelection();
	L.setAreaShape('window');
	L.setRing([{ x: 5, y: -5 }, { x: 25, y: 5 }]);
	L.commitArea(false);
	report(L.selectionCount() === 3, 'two junctions and the pipe between them are selected');
	const before = doc.nodes.length + doc.links.length;
	L.deleteSelection();
	report(L.selectionCount() === 0, 'the whole subject goes');
	// The two outer junctions survive; every pipe touching a deleted one cascades away.
	report(doc.nodes.map((x) => x.id).sort().join(',') ===
		[ids[0], ids[3]].sort().join(','), 'and only the two junctions outside the ring are left',
		doc.nodes.map((x) => x.id).join(','));
	report(doc.links.length === 0, 'with every pipe that touched a deleted junction cascaded away',
		String(doc.links.length));
	report(doc.nodes.length + doc.links.length < before, 'the document really shrank');
}

// ---- 8. a rebuild re-marks exactly what is still there -----------------------------------------
{
	L.clearSelection();
	L.setSelection('node', ids[0]);
	L.toggleInSelection('node', ids[3]);
	report(L.selectionCount() === 2, 'two selected across a rebuild');
	// refreshSelection() is what buildDom() calls: the drawn elements are new and carry no classes,
	// and a selection naming something the rebuild no longer holds has to go.
	L.refreshSelection();
	report(L.selectionCount() === 2, 'both survive a refresh');
	doc.nodes.splice(doc.nodes.findIndex((x) => x.id === ids[3]), 1);
	L.refreshSelection();
	report(L.selectionCount() === 1 && L.isSelected('node', ids[0]),
		'and one whose element has gone is pruned, leaving the rest', String(L.selectionCount()));
}

// ---- 9. what the source has to keep saying ------------------------------------------------------
console.log('\n--- the seams ---');
{
	const src = fs.readFileSync(path.join(ROOT, 'js', 'looped-network.js'), 'utf8');
	const css = fs.readFileSync(path.join(ROOT, 'css', 'engcalcs.css'), 'utf8');
	const icons = fs.readFileSync(path.join(ROOT, 'lib', 'Icons.lib.php'), 'utf8');
	// **SELECTION NEVER ENTERS THE DOCUMENT**, asserted on the document rather than on the source:
	// serializeProject() hands out doc.nodes and doc.links BY REFERENCE, so a `selected` key on an
	// element would be saved into the file, into every undo snapshot and into the dirty signature,
	// and opening a project would restore somebody else's highlight. A text scan cannot make this
	// claim — `opt.selected = true` on an <option> is the browser's own property and appears ten
	// times here legitimately — so the test is to select things and then look at the document.
	L.clearSelection();
	doc.nodes.forEach((x) => L.toggleInSelection('node', x.id));
	report(L.selectionCount() === doc.nodes.length, 'every node selected, for the test below');
	report(JSON.stringify(doc).indexOf('"selected"') < 0,
		'and the document carries no trace of it');
	report(!/setProp\([^)]*'selected'/.test(src), 'selection never goes through setProp() either');
	// One write site for the list, or a mark gets left behind on something no longer selected —
	// which is a highlight on the map that the next bulk edit will not touch, with nothing on
	// screen to explain it.
	const writes = (src.match(/\bselections = /g) || []).length;
	report(writes === 3, 'the list is written only where it is declared and inside setSelectionList()',
		String(writes) + ' (the `var`, then its filter and its de-duplicate)');
	report(/\.lpn-tool-more::after/.test(css),
		'the disclosure triangle is a pseudo-element, so it is an indicator and not a target');
	['select-window', 'select-lasso', 'select-polygon'].forEach((k) => {
		report(icons.indexOf("'" + k + "'") >= 0, 'the ' + k + ' icon exists');
	});
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
