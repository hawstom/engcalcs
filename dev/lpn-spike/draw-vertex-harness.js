// ARBITRARY POINTS WHILE DRAWING A LINK -- ROADMAP Task 567. Run with:
//   node dev/lpn-spike/draw-vertex-harness.js
//
// Tom, 2026-09-02, promoting this from a side note to the essential part: *"I do think that like
// all the software we should allow vertices (clicks in open space) on Add pipe. This is essential,
// and I let it slide or didn't see."* Both reference tools (EPANET, epanet-js) accept arbitrary
// points for a link's vertices until a second NODE is clicked; this page went node to node and made
// the user bend the pipe afterwards, through the double-click that is the rest of Task 567. Drawing
// the bend while drawing the pipe removes the need for that door in the common case.
//
// **THE STUB THAT WOULD MAKE THIS PASS FOR THE WRONG REASON** is one that lets the harness call
// addLink() with a vertex list itself. That proves the ARGUMENT works and says nothing about the
// gesture, which is where the whole change lives -- the old code cleared the drawing on exactly the
// press this one records. So every assertion below drives the page's own pointerdown/pointerup
// handlers with bare map under the point, and reads the result out of `doc`.
//
// **AND THE HALF THAT IS EASY TO FORGET: WHAT MUST *NOT* HAPPEN.** A press in open space with no
// drawing in progress still does nothing; the picked points never reach the document until a second
// node arrives, so an abandoned drawing leaves no vertex, no link and no undo snapshot behind; and
// the points die with the drawing, so the NEXT pipe does not inherit the last one's bends.

'use strict';

const { byId, loadLoopedNetwork, setUnitSet, setHitTarget } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
	"\t\tlinkById: linkById,\n" +
	"\t\tundoDepth: function () { return undoStack.length; },\n" +
	"\t\tpendingFrom: function () { return pendingLinkFrom; },\n" +
	"\t\tpendingVerts: function () { return pendingLinkVerts.slice(); },\n" +
	"\t\tpendingPath: function () { return pendingPathEl; },\n" +
	"\t\trubberBand: function () { return rubberBandEl; },\n" +
	"\t\tworldToScreen: worldToScreen,\n" +
	"\t\tsetScale: function (s) { state.s = s; state.tx = 0; state.ty = 0; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world);\n" +
	"\t\t\tpendingPathEl = el('polyline', { style: 'display:none' }, world); }\n"
);
L.buildLayers();
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const svg = byId.lpn_canvas;
byId.lpn_toolbar.querySelectorAll = function () { return []; };

// A fresh, empty map with one world unit per screen pixel, so a world coordinate IS a pixel count.
function fresh() {
	L.seedDefaultInputs();
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
	L.buildDom();
	L.buildLayers();
	L.setScale(1);
	// **ONE SET OF HANDLERS, NOT ONE PER SECTION.** wirePointerEvents() appends to the stub's
	// listener list, so a second call makes every click run twice -- which reads as the page
	// recording two bends for one press, and cost an hour before the doubling was recognised as the
	// harness's own. The real page wires once, in init().
	svg._listeners = {};
	L.wirePointerEvents();
	return doc;
}
// BARE MAP under every press, always -- the whole subject is the press that hits nothing. The
// add-* branch snaps to the nearest node within reach on its own, which is how a node is ever hit
// here at all; a point far from every node is genuinely open space.
function fire(type, ev) { setHitTarget(null); (svg._listeners[type] || []).forEach(function (fn) { fn(ev); }); }
function click(x, y) {
	fire('pointerdown', { pointerId: 3, clientX: x, clientY: y, pointerType: 'mouse', button: 0 });
	fire('pointerup', { pointerId: 3, clientX: x, clientY: y, pointerType: 'mouse' });
}
function esc() {
	(global.document._listeners.keydown || []).slice().forEach(function (fn) {
		fn({ key: 'Escape', stopPropagation: function () {}, preventDefault: function () {} });
	});
}

// ---------------------------------------------------------------------------
// 1. THE GESTURE Tom asked for: node, open space, open space, node.
// ---------------------------------------------------------------------------
console.log('\n--- a click in open space is a bend, not an abandonment ---');
{
	const doc = fresh();
	const a = L.addNode('junction', 100, 100).id;
	const b = L.addNode('junction', 500, 100).id;
	L.setMode('add-pipe');

	click(100, 100);
	ok('the first click picks the from-node', L.pendingFrom() === a, L.pendingFrom());

	click(200, 300);
	// **THIS IS THE PRESS THE OLD CODE GOT WRONG.** It ran setPendingLinkFrom(null), so a click a
	// few pixels off the second node -- or a deliberate bend -- threw the whole drawing away.
	ok('...a click in open space KEEPS the drawing', L.pendingFrom() === a, L.pendingFrom());
	ok('...and records the point', L.pendingVerts().length === 1,
		JSON.stringify(L.pendingVerts()));
	// Nothing has reached the document. The points are view state until a second node arrives.
	ok('...with nothing written to the document yet', doc.links.length === 0, doc.links.length);

	click(400, 300);
	ok('a second open-space click records a second point', L.pendingVerts().length === 2,
		JSON.stringify(L.pendingVerts()));

	click(500, 100);
	ok('the second NODE finishes the pipe', doc.links.length === 1, doc.links.length);
	const l = doc.links[0];
	ok('...between the two nodes that were clicked', l.from === a && l.to === b, l.from + '->' + l.to);
	ok('...carrying both bends, in the order they were picked',
		l.verts.length === 2 && l.verts[0].x === 200 && l.verts[0].y === 300
			&& l.verts[1].x === 400 && l.verts[1].y === 300, JSON.stringify(l.verts));
	ok('...and the drawing is over', L.pendingFrom() === null && L.pendingVerts().length === 0);
}

// ---------------------------------------------------------------------------
// 2. THE BEND IS THE LINK'S OWN, and a link's length knows about it. lenAuto
//    reads linkGeomLength(), which walks the vertex list -- so a bent pipe must
//    be LONGER than the straight line between its nodes, or the bend is
//    decoration and the solve is wrong.
// ---------------------------------------------------------------------------
console.log('\n--- a bend is geometry, not decoration ---');
{
	const doc = fresh();
	const a = L.addNode('junction', 0, 0).id;
	const b = L.addNode('junction', 400, 0).id;
	L.setMode('add-pipe');
	const straight = L.addLink('pipe', a, b);
	click(0, 0); click(200, 300); click(400, 0);
	const bent = doc.links[doc.links.length - 1];
	ok('the bent pipe is longer than the straight one between the same nodes',
		bent._length > straight._length, bent._length + ' > ' + straight._length);
	// Two legs of hypot(200, 300) each against a 400 chord -- the polyline, exactly, not an
	// inequality that a bend of any size would satisfy.
	const legs = 2 * Math.hypot(200, 300);
	ok('...and it is the polyline length, not the chord',
		Math.abs(bent._length - legs) < 1e-9, bent._length + ' vs ' + legs);
	// **COPIED, NOT ADOPTED.** The caller's array is view state that is emptied on the next
	// drawing; a link holding a reference to it would lose its bends the moment the user drew again.
	L.setMode('add-pipe');
	click(0, 0);
	ok('a new drawing does not empty the finished pipe\'s vertex list', bent.verts.length === 1,
		bent.verts.length);
	esc();
}

// ---------------------------------------------------------------------------
// 3. WHAT MUST NOT HAPPEN.
// ---------------------------------------------------------------------------
console.log('\n--- the drawing leaves nothing behind ---');
{
	const doc = fresh();
	L.addNode('junction', 100, 100);
	L.addNode('junction', 500, 100);
	L.setMode('add-pipe');

	// A press in open space with NO drawing in progress is still nothing at all. Without this the
	// tool would collect stray points from every idle click on the map.
	click(300, 400);
	ok('open space with no from-node picked records nothing',
		L.pendingFrom() === null && L.pendingVerts().length === 0);
	ok('...and creates nothing', doc.links.length === 0 && doc.nodes.length === 2);

	// Escape is the way out, and it is the ONLY way out now that an open-space click is a bend.
	const undo0 = L.undoDepth();
	click(100, 100); click(200, 300);
	ok('a drawing is in progress', L.pendingFrom() !== null && L.pendingVerts().length === 1);
	esc();
	ok('Escape abandons it', L.pendingFrom() === null && L.pendingVerts().length === 0);
	ok('...leaving no link', doc.links.length === 0, doc.links.length);
	// An abandoned drawing is not an edit, so it owes no undo press. The snapshot is taken at the
	// second node, not at the first click.
	ok('...and costing the user no dead press of Undo', L.undoDepth() === undo0,
		L.undoDepth() + ' vs ' + undo0);

	// The NEXT pipe must not inherit the abandoned one's bends -- every exit goes through
	// setPendingLinkFrom(), which is where the points die.
	click(100, 100); click(500, 100);
	ok('the next pipe drawn is straight', doc.links.length === 1 && doc.links[0].verts.length === 0,
		JSON.stringify(doc.links[0] && doc.links[0].verts));

	// Changing tool mid-drawing abandons it too, for the same reason and through the same door.
	click(100, 100);
	L.setMode('select');
	ok('changing tool abandons a half-drawn link',
		L.pendingFrom() === null && L.pendingVerts().length === 0);

	// A second press on the from-node is neither a bend nor a link. A zero-length self-loop is not
	// something the solver models, and reading it as a bend would put a vertex under its own node.
	L.setMode('add-pipe');
	click(100, 100); click(100, 100);
	ok('re-clicking the from-node makes no self-loop and no bend',
		doc.links.length === 1 && L.pendingVerts().length === 0 && L.pendingFrom() !== null,
		doc.links.length + ' links');
	esc();
}

// ---------------------------------------------------------------------------
// 4. THE FEEDBACK. Between two clicks the user must see what the next click
//    commits -- the reason the rubber band exists at all (Tom, 2026-07-30:
//    *"otherwise there's no indication that anything is working"*). With bends,
//    the band must start at the LAST point picked, not still at the node.
// ---------------------------------------------------------------------------
console.log('\n--- the drawing shows itself ---');
{
	fresh();
	L.addNode('junction', 100, 100);
	L.addNode('junction', 500, 100);
	L.setMode('add-pipe');
	const path = L.pendingPath(), band = L.rubberBand();

	ok('nothing is drawn before a from-node is picked', path.style.display === 'none',
		path.style.display);
	click(100, 100);
	ok('...nor with a from-node and no bends yet', path.style.display === 'none',
		path.style.display);
	click(200, 300);
	ok('the picked bend is drawn, from the node through it', path.style.display === ''
		&& path.getAttribute('points') === '100,100 200,300', path.getAttribute('points'));

	// The band's anchor: hovering after a bend must rubber-band from the BEND.
	fire('pointermove', { pointerId: 3, clientX: 260, clientY: 260, pointerType: 'mouse' });
	ok('the rubber band starts at the newest bend, not back at the node',
		+band.getAttribute('x1') === 200 && +band.getAttribute('y1') === 300,
		band.getAttribute('x1') + ',' + band.getAttribute('y1'));
	click(500, 100);
	ok('and the drawing is taken down when the pipe lands', path.style.display === 'none',
		path.style.display);
}

// ---------------------------------------------------------------------------
// 5. EVERY LINK TOOL, not just Pipe. A pump and a valve are drawn by the same
//    branch and get the same gesture. A valve stays zero-length whatever it is
//    drawn through -- its bends are display geometry only.
// ---------------------------------------------------------------------------
console.log('\n--- pumps and valves are drawn the same way ---');
{
	const doc = fresh();
	L.addNode('junction', 100, 100);
	L.addNode('junction', 500, 100);
	L.setMode('add-pump');
	click(100, 100); click(300, 250); click(500, 100);
	ok('a pump takes a bend', doc.links.length === 1 && doc.links[0].type === 'pump'
		&& doc.links[0].verts.length === 1, JSON.stringify(doc.links.map(l => l.type)));

	L.setMode('add-valve');
	click(100, 100); click(250, 400); click(500, 100);
	const v = doc.links[doc.links.length - 1];
	ok('a valve takes one too', v.type === 'valve' && v.verts.length === 1, v.verts.length);
	// **AND IS STILL EXACTLY ZERO-LENGTH.** A valve is a zero-length link by construction, not by a
	// small number standing in for one; a drawn bend must not put friction into it by the back door.
	ok('...and is still exactly zero-length, bend or no bend',
		v._length === 0 && v.lenAuto === false, v._length + ' lenAuto=' + v.lenAuto);
}

console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
process.exit(fails ? 1 : 0);
