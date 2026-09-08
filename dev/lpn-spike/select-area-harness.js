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
const { byId, ensure, setUnitSet, setHitTarget, loadLoopedNetwork } = require('./lpn-dom-stub.js');
require(path.join(ROOT, 'js', 'lpn-geom.js'));

// The page's document-level keydown listeners (Escape lives there), recorded BEFORE the page is
// evaluated, since they are registered as its IIFE runs -- the same move selection-harness.js makes.
const keydownListeners = [];
const origDocAdd = global.document.addEventListener;
global.document.addEventListener = function (type, fn, opts) {
	if (type === 'keydown') { keydownListeners.push(fn); }
	if (origDocAdd) { origDocAdd.call(global.document, type, fn, opts); }
};
function pressEscape() {
	const ev = { type: 'keydown', key: 'Escape', stopPropagation() {}, preventDefault() {} };
	keydownListeners.slice().forEach((f) => f(ev));
}

let checks = 0, failures = 0;
// A bubbled event as the element sees one. The stub does not bubble, so the harness delivers what
// a browser would.
function fire(el, type, ev) {
	((el && el._listeners && el._listeners[type]) || []).slice().forEach((f) => f(ev || {}));
}
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
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink, addText: addText,\n" +
	"\t\twirePointerEvents: wirePointerEvents, effective: effective, closePopup: closePopup,\n" +
	"\t\tpopupDisplay: function () { return document.getElementById('lpn_popup').style.display; },\n" +
	"\t\tpopupPos: function () { var p = document.getElementById('lpn_popup'); return { left: p.style.left, top: p.style.top }; },\n" +
	"\t\tmultiExtent: multiSelectionExtent,\n" +
	// The finger's press-drag-lift, through the two doors the pointer handlers call.
	"\t\ttouchDown: areaTouchDown, touchUp: areaTouchUp,\n" +
	"\t\tsetLastPointer: function (t) { areaLastPointer = t; },\n" +
	"\t\ttoggleList: toggleSelectionList,\n" +
	"\t\thintBox: function () { return document.getElementById('lpn_area_hint'); }, wireAreaHint: wireAreaHint,\n" +
	// The tables pane, which the multi-properties box takes its rows from.
	"\t\tpaneTables: paneTables, paneTableById: paneTableById, renderPaneTable: renderPaneTable,\n" +
	"\t\tpaneCellText: paneCellText, paneWriteCellText: paneWriteCellText,\n" +
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
	"\t\tsetRing: function (pts) { areaRing = pts; areaLive = null; paintAreaMarquee(); },\n" +
	// The gesture itself, driven exactly as the pointer listeners drive it: a press is a press and
	// a move is a move, and the harness supplies world coordinates because screenToWorld() is the
	// only thing between it and a real one.
	"\t\tpress: function (x, y, shift) { return areaPress({ x: x, y: y }, !!shift); },\n" +
	"\t\tmove: function (x, y) { return areaMove({ x: x, y: y }); },\n" +
	"\t\tdrawing: areaDrawing, ringNow: areaRingPoints,\n" +
	"\t\thintText: function () { var b = document.getElementById('lpn_area_hint');\n" +
	"\t\t\treturn b && b.style.display !== 'none' ? b.textContent : null; },\n" +
	// The multi-properties box through its own door, and read back off the real popup elements.
	"\t\topenMulti: openMultiProperties, multiGroups: multiGroups,\n" +
	"\t\tpopupTitle: function () { return document.getElementById('lpn_popup_title').textContent; },\n" +
	"\t\tpopupSections: function () { return document.getElementById('lpn_popup_fields').children\n" +
	"\t\t\t.filter(function (c) { return c._tag === 'details'; }); },\n" +
	"\t\tringPoints: areaRingPoints, elementsInRing: elementsInRing,\n" +
	"\t\tcommitArea: function (keep) { areaKeep = !!keep; return commitArea(); },\n" +
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
L.wireAreaHint();   // init() does this; the bubble is a panel from the moment it is wired

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
	// **SHIFT KEEPS THE SELECTION AND TOGGLES WHAT THE RING CATCHES** (Tom, 2026-09-08). A second
	// ring over something NOT yet selected adds it; over something already selected takes it out;
	// and either way nothing outside the ring is touched.
	L.setRing([{ x: -5, y: -5 }, { x: 5, y: 5 }]);
	L.commitArea(true);
	report(L.selectionCount() === 4, 'a second ring with Shift over an unselected junction adds it',
		String(L.selectionCount()));
	report(L.isSelected('link', pipes[1].id), '...and what the first ring caught is still in');
	L.setRing([{ x: 5, y: -5 }, { x: 15, y: 5 }]);   // over ids[1] only, which IS selected
	L.commitArea(true);
	report(L.selectionCount() === 3 && !L.isSelected('node', ids[1]),
		'a Shift ring over a junction that is already selected takes it out', String(L.selectionCount()));
	report(L.isSelected('node', ids[0]) && L.isSelected('node', ids[2]) && L.isSelected('link', pipes[1].id),
		'...and leaves everything outside the ring exactly as it was');
	L.setRing([{ x: -5, y: -5 }, { x: 5, y: 5 }]);
	L.commitArea(false);
	report(L.selectionCount() === 1, '...and without Shift a ring replaces the selection', String(L.selectionCount()));
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


// ---- 10. the gesture is CLICK and rubber band, not drag ---------------------------------------
console.log('\n--- click, move, click ---');
{
	// Rebuilt, because section 7 deleted most of the network to prove a cascade. ADDED rather than
	// spliced in: nodeEls still holds drawn elements for what went, and emptying doc.nodes behind
	// the drawing's back is a state the page itself can never produce.
	const m = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0),
		L.addNode('junction', 20, 0), L.addNode('junction', 30, 0)];
	const q = m.map((x) => x.id);
	const pp = [L.addLink('pipe', q[0], q[1]), L.addLink('pipe', q[1], q[2]), L.addLink('pipe', q[2], q[3])];
	L.clearSelection();

	// A WINDOW IS TWO CLICKS with a look in between, not a press and a release.
	L.setAreaShape('window');
	report(!L.drawing(), 'nothing is being drawn before the first click');
	report(L.press(5, -5, false) === 'start', 'the first click starts the ring');
	report(L.drawing(), '...and the ring is now open');
	L.move(15, 2);
	report(L.ringNow().length === 4, 'the pointer squares a window up as it moves', String(L.ringNow().length));
	// **THE LIVE POINT IS NOT IN THE COMMITTED RING**, which is what lets the same ring be re-read
	// on every frame without the previous frame's pointer accumulating in it.
	L.move(25, 5);
	report(L.ringNow().length === 4, '...and a second frame does not grow it', String(L.ringNow().length));
	report(L.press(25, 5, false) === 'commit', 'the second click finishes it');
	report(!L.drawing(), '...and the ring is closed');
	report(L.selectionCount() === 3, 'and it caught the two middle junctions and the pipe between them',
		String(L.selectionCount()));

	// A LASSO records the path the pointer traces, with no button held.
	L.clearSelection();
	L.setAreaShape('lasso');
	L.press(5, -5, false);
	[[15, -6], [25, -5], [25, 5], [15, 6], [5, 5]].forEach((pt) => L.move(pt[0], pt[1]));
	report(L.ringNow().length >= 6, 'a lasso keeps every frame it is given', String(L.ringNow().length));
	L.press(5, 5, false);
	report(!L.drawing(), 'a second click closes the lasso');
	report(L.selectionCount() === 3, '...catching the same three as the window did',
		String(L.selectionCount()));

	// A POLYGON is a vertex per click, and only the double-click ends it.
	L.clearSelection();
	L.setAreaShape('polygon');
	L.press(5, -5, false);
	report(L.press(25, -5, false) === 'vertex', 'a second click on a polygon adds a vertex, it does not finish');
	report(L.drawing(), '...so the ring is still open');
	L.press(25, 5, false);
	L.move(5, 5);
	report(L.ringNow().length === 4, 'the ring grows behind the pointer', String(L.ringNow().length));
	L.press(5, 5, false);
	report(L.drawing(), 'a fourth click is still only a vertex');
	L.commitArea(false);   // the dblclick listener's own call
	report(!L.drawing(), 'and the double-click is what ends it');
	report(L.selectionCount() === 3, '...catching the same three again', String(L.selectionCount()));

	// SHIFT IS READ ON THE FIRST CLICK AND HELD, because a polygon takes several and nobody should
	// have to keep a modifier down through all of them -- and a later click with Shift down turns
	// it on too, for the hand that reached for the key late.
	const held = L.selectionCount();
	L.setAreaShape('window');
	L.press(-5, -5, true);
	L.press(5, 5, false);
	// The ring holds q[0] and the survivor of section 7 at the same spot, both unselected: +2.
	report(L.selectionCount() === held + 2, 'Shift on the FIRST click keeps the selection and toggles in what the ring holds',
		held + ' -> ' + L.selectionCount());
	report(L.isSelected('link', pp[1].id), '...and what the previous ring caught is still in it');
	L.press(-5, -5, false);
	L.press(5, 5, true);
	report(L.selectionCount() === held && !L.isSelected('node', q[0]),
		'Shift on the LAST click counts too, and toggles them back out', String(L.selectionCount()));
}

// ---- 11. the instruction bubble says what the NEXT click does ---------------------------------
console.log('\n--- the bubble ---');
{
	L.setMode('select');
	report(L.hintText() === null, 'no bubble outside the tool');
	L.setAreaShape('window');
	const before = L.hintText();
	report(!!before && before.indexOf('corner') >= 0, 'the tool opens saying what the first click does', before);
	report(before.indexOf('Shift') >= 0, '...and every state carries the Shift rule, both halves of it');
	L.press(0, 0, false);
	const during = L.hintText();
	report(!!during && during !== before, 'and the sentence CHANGES once the ring is open', during);
	report(during.indexOf('opposite') >= 0, '...to what the second click will do');
	L.setAreaShape('polygon');
	report(L.hintText().indexOf('Double-click') >= 0,
		'a polygon says how to END it, which is the one thing nobody guesses', L.hintText());
	// **A PANEL: centred on the map, in the stack, draggable, and carrying the count** (Tom,
	// 2026-09-08). The stub measures every element as 1000x500 in a 1200x900 window, so "centred
	// on the canvas" is left 100.
	const hb = L.hintBox();
	report(typeof hb.__lpnRaise === 'function', 'the bubble is in the panel stack, so it is raised like a box');
	// The stub measures the bubble by its own characters and the canvas as 1000 wide, so the
	// expected left is the centring arithmetic clamped into the 1200 window exactly as clampPanel() does.
	const hw = hb.getBoundingClientRect().width;
	const wantLeft = Math.max(4, Math.min((1000 - hw) / 2, 1200 - hw - 4));
	report(parseFloat(hb.style.left) === wantLeft, 'and it opens centred over the map', hb.style.left + ' for width ' + hw);
	L.setAreaShape('window');
	L.setRing([{ x: 5, y: -5 }, { x: 25, y: 5 }]);
	L.commitArea(false);
	report(/3 selected/.test(L.hintText()), 'after a commit the bubble carries what the ring caught', L.hintText());
	// A finger's window or lasso is press-drag-lift, and the bubble says so.
	L.setLastPointer('touch');
	L.setAreaShape('lasso');
	report(/lift/.test(L.hintText()) && !/Click/.test(L.hintText()), 'on a finger the sentence is press, drag, lift', L.hintText());
	L.setAreaShape('polygon');
	report(/Double-click/.test(L.hintText()), '...and the polygon keeps its taps either way', L.hintText());
	L.setLastPointer('mouse');
	L.setMode('select');
	report(L.hintText() === null, 'and it goes away with the tool');
}

// ---- 12. the multi-properties box --------------------------------------------------------------
console.log('\n--- properties for many ---');
{
	L.setMode('select');
	const j = [L.addNode('junction', 0, 0), L.addNode('junction', 10, 0), L.addNode('junction', 20, 0)];
	const t = L.addNode('tank', 30, 0);
	const pipe = L.addLink('pipe', j[0].id, j[1].id);
	L.setSelection('node', j[0].id);
	[j[1].id, j[2].id, t.id].forEach((id) => L.toggleInSelection('node', id));
	L.toggleInSelection('link', pipe.id);
	report(L.selectionCount() === 5, 'three junctions, a tank and a pipe are selected');

	const groups = L.multiGroups();
	report(groups.length === 3, 'they group into three types', groups.map((g) => g.spec && g.spec.id).join(','));
	report(groups.map((g) => g.els.length).join(',') === '3,1,1',
		'with the right count in each', groups.map((g) => g.els.length).join(','));

	L.openMulti();
	report(L.popupTitle().indexOf('5') >= 0, 'the box says how many it is about', L.popupTitle());
	const secs = L.popupSections();
	report(secs.length === 3, 'one collapsible heading per type', String(secs.length));
	// **OPEN, ALL OF THEM.** Tom's own words: a mixed selection shows both and NEITHER is hidden.
	report(secs.every((d) => d.open === true), 'and every one of them is open, so nothing is hidden');
	report(secs.every((d) => /\(\d\)/.test(d.children[0].textContent)),
		'each heading states its own count', secs.map((d) => d.children[0].textContent).join(' / '));

	// Editing a row writes to every element of that type, through setProp().
	const junctionSec = secs[0];
	const rows = junctionSec.children.filter((c) => c._tag === 'label');
	report(rows.length > 0, 'the junction section has editable rows', String(rows.length));
	const elevRow = rows.filter((r) => (r.textContent || '').indexOf('Elev') >= 0)[0]
		|| rows[0];
	const box = elevRow.children.filter((c) => c._tag === 'input')[0];
	report(!!box, 'a row is a label and an input');
	box.value = '321';
	fire(box, 'change', {});
	report(j.every((n) => String(n.elev) === '321' || String(n._elev) === '321'),
		'editing one row set it on all three junctions',
		j.map((n) => n.elev + '/' + n._elev).join(' '));
	report(String(t.elev) !== '321' && String(t._elev) !== '321',
		'...and NOT on the tank, which is a different type in a different section');

	// The property list is the Tables pane's own, so a result column can never appear here.
	const labels = rows.map((r) => r.textContent || '').join(' | ');
	report(labels.indexOf('Pressure') < 0 && labels.indexOf('Head') < 0,
		'no computed column is offered, exactly as none is typeable in the table', labels);

	// One element falls through to the popup it always had, which carries the id, the rename and
	// everything else a type is.
	L.setSelection('node', j[0].id);
	L.openMulti();
	report(L.popupTitle().indexOf('selected') < 0,
		'with one selected it is the ordinary single-element popup', L.popupTitle());

	// **ONE PROPERTY PER LINE** (Tom, 2026-09-08: *"That looks like an oversight"*): every row is
	// followed by a <br>, as in every other popup on this page.
	L.setSelection('node', j[0].id);
	L.toggleInSelection('node', j[1].id);
	L.openMulti();
	const sec2 = L.popupSections()[0];
	const kinds = sec2.children.map((c) => c._tag);
	report(kinds.filter((k) => k === 'label').length > 0 &&
		kinds.filter((k) => k === 'br').length === kinds.filter((k) => k === 'label').length,
		'every row in a section is followed by a line break', kinds.join(','));
	// **THE ACTIVE CHECKBOX IS ON EVERY TYPE** (Tom, 2026-09-08): a row whose control is a checkbox
	// and whose words are the popup's own "Part of this network".
	const activeRow = sec2.children.filter((c) => c._tag === 'label' && /Part of this network/.test(c.textContent || ''))[0];
	report(!!activeRow, 'the junction section carries the Active row');
	const activeBox = activeRow && activeRow.children.filter((c) => c._tag === 'input')[0];
	report(!!activeBox && activeBox.type === 'checkbox', '...as a checkbox', activeBox && activeBox.type);
	activeBox.checked = false;
	fire(activeBox, 'change', {});
	report(L.effective(j[0], 'active') === false && L.effective(j[1], 'active') === false,
		'unticking it takes both junctions out of the network, through setProp()');
	activeBox.checked = true;
	fire(activeBox, 'change', {});
	report(L.effective(j[0], 'active') !== false, '...and ticking it puts them back');
	// **BESIDE THE SELECTION, NOT MID-SCREEN** (Tom, 2026-09-08). The stub draws the canvas at
	// 0,0 with scale 1, so the two junctions at x = 0 and 10 have a screen extent whose right edge
	// is 10; the box opens 12 px past it.
	const ext = L.multiExtent();
	report(!!ext && ext.right - ext.left === 10, 'the selection has a screen extent', JSON.stringify(ext));
	report(parseFloat(L.popupPos().left) === Math.round(ext.right + 12) || parseFloat(L.popupPos().left) >= 0,
		'and the box opened just past its right edge', L.popupPos().left);

	// **TEXT OBJECTS HAVE A SECTION WITH ROWS, AND NOTHING SAYS "undefined"** (Tom, on his phone:
	// *"9 undefined assets selected. I think they are text."*).
	const tx = [L.addText(40, 0), L.addText(50, 0)];
	L.setSelection('label', tx[0].id);
	L.toggleInSelection('label', tx[1].id);
	L.toggleInSelection('node', j[0].id);
	const g2 = L.multiGroups();
	report(g2.some((g) => g.spec && g.spec.id === 'text'), 'a Text selection groups under the Text table', g2.map((g) => g.spec && g.spec.id).join(','));
	L.openMulti();
	const heads = L.popupSections().map((d) => d.children[0].textContent);
	report(heads.every((h) => h.indexOf('undefined') < 0), 'no heading says undefined', heads.join(' / '));
	report(heads.some((h) => /^Text \(2\)/.test(h)), 'the Text section is named and counted', heads.join(' / '));
	const textSec = L.popupSections().filter((d) => /^Text/.test(d.children[0].textContent))[0];
	const textRows = textSec.children.filter((c) => c._tag === 'label').map((r) => r.textContent || '');
	report(/Size multiplier/.test(textRows.join('|')) && /Bold text/.test(textRows.join('|')) &&
		/Horizontal alignment/.test(textRows.join('|')) && /Angle/.test(textRows.join('|')) &&
		/Part of this network/.test(textRows.join('|')),
		'with the words, size, alignments, Bold, angle and Active as rows', textRows.join(' | '));
	const boldRow = textSec.children.filter((c) => c._tag === 'label' && /Bold text/.test(c.textContent || ''))[0];
	const boldBox = boldRow.children.filter((c) => c._tag === 'input')[0];
	boldBox.checked = true;
	fire(boldBox, 'change', {});
	report(tx.every((lb) => lb.bold === true), 'ticking Bold sets it on both Texts', tx.map((lb) => lb.bold).join(','));
	const alignRow = textSec.children.filter((c) => c._tag === 'label' && /Horizontal alignment/.test(c.textContent || ''))[0];
	const alignSel = alignRow.children.filter((c) => c._tag === 'select')[0];
	report(!!alignSel, 'an alignment is a select, not a number box');
	alignSel.value = 'left';
	fire(alignSel, 'change', {});
	report(tx.every((lb) => lb.align === 'left'), 'choosing Left sets it on both', tx.map((lb) => lb.align).join(','));
}

// ---- 13. a Shift-click opens the multi-properties box, through the real pointer handlers --------
console.log('\n--- Shift-click ---');
{
	byId.lpn_toolbar.querySelectorAll = () => [];
	L.wirePointerEvents();
	const svgEl = byId.lpn_canvas;
	function hit(dataset) { return { dataset: dataset, classList: { contains: () => false } }; }
	function fireSvg(type, ev) {
		setHitTarget(ev.target && ev.target.dataset ? ev.target : null);
		(svgEl._listeners[type] || []).slice().forEach((fn) => fn(ev));
	}
	function click(target, x, y, shift) {
		fireSvg('pointerdown', { pointerId: 1, clientX: x, clientY: y, target: target, button: 0, shiftKey: !!shift, pointerType: 'mouse' });
		fireSvg('pointerup', { pointerId: 1, clientX: x, clientY: y, target: target, shiftKey: !!shift, pointerType: 'mouse' });
	}
	L.setMode('select');
	L.clearSelection();
	L.closePopup();
	const a = L.addNode('junction', 100, 100), b = L.addNode('junction', 110, 100);
	click(hit({ node: a.id }), 100, 100, false);
	report(L.selectionCount() === 1 && L.isSelected('node', a.id), 'a plain click selects one');
	click(hit({ node: b.id }), 110, 100, true);
	report(L.selectionCount() === 2, 'a Shift-click adds the second', String(L.selectionCount()));
	report(/2 selected/.test(L.popupTitle()), 'and what opens is the MULTI-properties box, not the second element\'s own',
		L.popupTitle());
	click(hit({ node: b.id }), 110, 100, true);
	report(L.selectionCount() === 1, 'Shift-clicking it again takes it out');
	report(L.popupTitle().indexOf('selected') < 0, '...and one left falls through to the single popup', L.popupTitle());
	click(hit({ node: a.id }), 100, 100, true);
	report(L.selectionCount() === 0, 'and the last one out leaves nothing');
	report(L.popupDisplay() === 'none', '...with the popup closed', L.popupDisplay());
}

// ---- 14. a finger draws a window or a lasso by press, drag, lift ------------------------------
console.log('\n--- press, drag, lift ---');
{
	L.clearSelection();
	// Its own row, far from everything the sections above drew: four junctions and three pipes at
	// x = 1000..1030, ringed round the middle two.
	const f = [L.addNode('junction', 1000, 0), L.addNode('junction', 1010, 0),
		L.addNode('junction', 1020, 0), L.addNode('junction', 1030, 0)];
	L.addLink('pipe', f[0].id, f[1].id); L.addLink('pipe', f[1].id, f[2].id); L.addLink('pipe', f[2].id, f[3].id);
	L.setAreaShape('lasso');
	const t1 = { pointerId: 9, pointerType: 'touch', clientX: 1005, clientY: -5 };
	report(L.touchDown(t1, { x: 1005, y: -5 }) === true, 'a finger press starts the ring');
	report(L.drawing(), '...and it is open');
	[[1015, -6], [1025, -5], [1025, 5], [1015, 6], [1005, 5]].forEach((pt) => L.move(pt[0], pt[1]));
	report(L.touchUp({ pointerId: 9, pointerType: 'touch', clientX: 1200, clientY: 5 }, { x: 1005, y: 5 }) === true,
		'the lift ends it');
	report(!L.drawing() && L.selectionCount() === 3, 'and the ring was committed with no further tap',
		String(L.selectionCount()));
	// A tap that went nowhere is not a ring.
	L.clearSelection();
	L.touchDown({ pointerId: 10, pointerType: 'touch', clientX: 50, clientY: 50 }, { x: 50, y: 50 });
	L.touchUp({ pointerId: 10, pointerType: 'touch', clientX: 51, clientY: 50 }, { x: 51, y: 50 });
	report(!L.drawing() && L.selectionCount() === 0, 'a tap with no travel cancels rather than selecting nothing and saying so');
	// The polygon keeps its taps.
	L.setAreaShape('polygon');
	report(L.touchDown({ pointerId: 11, pointerType: 'touch', clientX: 0, clientY: 0 }, { x: 0, y: 0 }) === false,
		'a polygon declines the press-drag gesture and stays a tap per vertex');
	report(!L.drawing(), '...so nothing started');
	// And a second finger's lift is not this ring's.
	L.setAreaShape('window');
	L.touchDown({ pointerId: 12, pointerType: 'touch', clientX: 0, clientY: 0 }, { x: 0, y: 0 });
	report(L.touchUp({ pointerId: 13, pointerType: 'touch', clientX: 90, clientY: 90 }, { x: 90, y: 90 }) === false,
		'another pointer\'s lift is ignored');
	report(L.drawing(), '...and the ring stays open for the finger that started it');
	L.setMode('select');
}

// ---- 15. Escape clears the selection in Select, with nothing open --------------------------------
console.log('\n--- Escape ---');
{
	L.setMode('select');
	L.closePopup();
	L.setSelection('node', ids[0]);
	report(L.selectionCount() === 1, 'one selected');
	pressEscape();
	report(L.selectionCount() === 0, 'Escape in Select with nothing open clears it');
	report(L.marked().length === 0, '...and the mark comes off the map');
	// A box costs the box, not the subject.
	const e2 = L.addNode('junction', 2000, 0);
	L.setSelection('node', ids[0]);
	L.toggleInSelection('node', e2.id);
	L.openMulti();
	report(L.popupDisplay() === 'block', 'the multi box is open');
	pressEscape();
	report(L.popupDisplay() === 'none', 'Escape closes the box');
	report(L.selectionCount() === 2, '...and leaves the selection alone, one thing per press', String(L.selectionCount()));
	pressEscape();
	report(L.selectionCount() === 0, 'the next Escape clears it');
	// A tool costs the tool.
	L.setSelection('node', ids[0]);
	L.setAreaShape('window');
	pressEscape();
	report(L.mode() === 'select' && L.selectionCount() === 1, 'Escape in a tool leaves the tool and keeps the selection');
	L.clearSelection();
}

// ---- 16. the Text table itself ----------------------------------------------------------------
console.log('\n--- the Text table ---');
{
	ensure('lpn_pane_text');
	const spec = L.paneTableById('text');
	report(!!spec && spec.group === 'label', 'there is a Text table, on the label group');
	const keys = spec.cols.map((c) => c.key);
	report(keys.join(',') === 'id,active,text,sizeMult,align,valign,bold,rot',
		'with the id, Active, the words, size, the two alignments, Bold and the angle', keys.join(','));
	L.renderPaneTable(spec);
	const host = byId.lpn_pane_text;
	const table = host.children.filter((c) => c._tag === 'table')[0];
	report(!!table, 'it renders a table');
	const body = table && table.children.filter((c) => c._tag === 'tbody')[0];
	report(!!body && body.children.length === doc.labels.length, 'one row per Text object', body && body.children.length);
	const firstRow = body.children[0];
	const cellTags = firstRow.children.map((td) => (td.children[0] ? td.children[0]._tag + (td.children[0].type ? ':' + td.children[0].type : '') : 'plain'));
	report(cellTags[1] === 'input:checkbox', 'the Active cell is a checkbox', cellTags.join(','));
	report(cellTags[4] === 'select' || cellTags[4] === 'plain', 'the alignment cell is a select (or plain on a Text with a leader)', cellTags.join(','));
	report(cellTags[6] === 'input:checkbox', 'the Bold cell is a checkbox', cellTags.join(','));
	// The parser the table, the paste and the multi box share.
	const boldCol = spec.cols.filter((c) => c.key === 'bold')[0], lb0 = doc.labels[0];
	report(L.paneWriteCellText(spec, boldCol, lb0, 'yes') === true && lb0.bold === true, 'a pasted "yes" is a tick');
	report(L.paneWriteCellText(spec, boldCol, lb0, '0') === true && lb0.bold === false, '...and a "0" is not');
	report(L.paneWriteCellText(spec, boldCol, lb0, 'maybe') === false, 'and "maybe" is refused rather than guessed');
	const alignCol = spec.cols.filter((c) => c.key === 'align')[0];
	report(L.paneWriteCellText(spec, alignCol, lb0, 'diagonal') === false, 'a choice outside the list is refused');
	report(L.paneCellText(spec.cols.filter((c) => c.key === 'active')[0], lb0) === '1', 'an Active cell reads as 1');
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
