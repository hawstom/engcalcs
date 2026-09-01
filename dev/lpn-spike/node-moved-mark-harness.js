// A JUNCTION THAT MOVED SAYS SO. Run with:
//   node dev/lpn-spike/node-moved-mark-harness.js
//
// Tom, 2026-09-01: *"Unfortunately we have no way of knowing when a junction moves. Some sort of a
// fading highlight like the labels have when they are moved would help. And this doesn't apply only
// to the phone, of course."* -- and, in the same message, *"the blindness of tapping on a phone is
// dire."* A finger covers what it touches, so on a touch screen the mark is the ONLY confirmation.
//
// **ONE MECHANISM, TWO CALLERS.** The fading highlight already existed for labels (Tom, 2026-08-15,
// after dragging one by accident): markJustDragged() adds `.lpn-just-dragged`, a CSS animation
// paints it and then clears itself, and there is no timer, no object and nothing to tidy up. A node
// is marked by the same function with the same class; only the PAINTING differs, because a dot is
// not a word -- css/engcalcs.css gives `.lpn-node.lpn-just-dragged` a ring rather than a recolour,
// the fill being where the colour ramp lives.
//
// The four things this file holds, which are the four ways the feature could be wrong:
//   - it fires when a node MOVED, at the END of the gesture, once
//   - it does NOT fire on a tap, on a pan, or on a press that never travelled
//   - it fires when an UNDO moves a node, which is the other move nobody can see
//   - it is never in the document: not in a saved project, not in an undo snapshot

'use strict';

const { byId, loadLoopedNetwork, setUnitSet, setHitTarget } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom, nodeById: nodeById,\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
	"\t\tsetScale: function (s) { state.s = s; state.tx = 0; state.ty = 0; },\n" +
	"\t\tstateNow: function () { return { tx: state.tx, ty: state.ty }; },\n" +
	"\t\tapplyDrag: function () { if (drag && dragDirty) { applyDrag(); dragDirty = false; } },\n" +
	"\t\tdragNow: function () { return drag ? { type: drag.type, id: drag.id } : null; },\n" +
	"\t\tnodeEl: function (id) { return nodeEls[id]; },\n" +
	"\t\tupdateNode: updateNode, saveUndoSnapshot: saveUndoSnapshot, undo: undo,\n" +
	"\t\tserializeProject: serializeProject,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const MARK = 'lpn-just-dragged';
function marked(id) {
	const ne = L.nodeEl(id);
	return !!(ne && ne.circle && ne.circle.classList.contains(MARK));
}
function freshMap() {
	byId.lpn_toolbar.querySelectorAll = function () { return []; };
	L.seedDefaultInputs();
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
	L.buildDom();
	L.buildLayers();
	L.setScale(1);
	L.wirePointerEvents();
	L.setMode('select');
	return doc;
}
const svg = byId.lpn_canvas;
function fire(type, ev) { (svg._listeners[type] || []).forEach(function (fn) { fn(ev); }); }

// ---------------------------------------------------------------------------
// 1. A dragged node is marked, and only when the gesture is over.
// ---------------------------------------------------------------------------
console.log('\n--- a node that moved ---');
{
	freshMap();
	const id = L.addNode('junction', 200, 200).id;
	const ne = L.nodeEl(id), dot = ne.circle;
	setHitTarget([dot]);

	ok('a freshly drawn node carries no mark', !marked(id));

	fire('pointerdown', { pointerId: 3, clientX: 200, clientY: 200, pointerType: 'mouse', button: 0 });
	const began = L.dragNow();
	ok('the press begins a node drag', !!began && began.type === 'node' && began.id === id,
		began && began.type);
	fire('pointermove', { pointerId: 3, clientX: 240, clientY: 220, pointerType: 'mouse' });
	L.applyDrag();
	ok('the node has moved by mid-gesture', L.nodeById(id).x !== 200, 'x=' + L.nodeById(id).x);
	// **NOT ON EVERY FRAME.** The mark says a move HAPPENED; mid-drag the user is looking at their
	// own hand, and re-adding the class per frame would restart a 45-second animation sixty times a
	// second and never let it run.
	ok('...and is NOT marked while the pointer is still down', !marked(id));
	fire('pointermove', { pointerId: 3, clientX: 300, clientY: 260, pointerType: 'mouse' });
	L.applyDrag();
	ok('...still not, several frames in', !marked(id));

	fire('pointerup', { pointerId: 3, clientX: 300, clientY: 260, pointerType: 'mouse' });
	ok('releasing the node marks it', marked(id));
	ok('the mark is on the node\'s own circle, which every node type draws', dot === L.nodeEl(id).circle);
}

// ---------------------------------------------------------------------------
// 2. And nothing that did not move is marked.
// ---------------------------------------------------------------------------
console.log('\n--- and nothing else ---');
{
	freshMap();
	const a = L.addNode('junction', 200, 200).id;
	const b = L.addNode('junction', 400, 200).id;
	const dotA = L.nodeEl(a).circle;

	// A TAP: down and up at the same point. `drag.snapped` is never set, because applyDrag() never
	// ran, so this cannot reach the mark even though a node drag record was opened.
	setHitTarget([dotA]);
	fire('pointerdown', { pointerId: 4, clientX: 200, clientY: 200, pointerType: 'mouse', button: 0 });
	fire('pointerup', { pointerId: 4, clientX: 200, clientY: 200, pointerType: 'mouse' });
	ok('a tap on a node does not mark it', !marked(a));
	ok('...and the node did not move', L.nodeById(a).x === 200);

	// A press that jiggles inside the slop and comes back.
	fire('pointerdown', { pointerId: 5, clientX: 200, clientY: 200, pointerType: 'mouse', button: 0 });
	fire('pointermove', { pointerId: 5, clientX: 202, clientY: 201, pointerType: 'mouse' });
	L.applyDrag();
	fire('pointerup', { pointerId: 5, clientX: 200, clientY: 200, pointerType: 'mouse' });
	ok('a press that never travelled past its slop does not mark', !marked(a));

	// A PAN. It moves the camera, not the document, and the neighbour it swept over is untouched.
	setHitTarget(null);
	const before = L.stateNow();
	fire('pointerdown', { pointerId: 6, clientX: 600, clientY: 400, pointerType: 'mouse', button: 0 });
	fire('pointermove', { pointerId: 6, clientX: 660, clientY: 430, pointerType: 'mouse' });
	L.applyDrag();
	fire('pointerup', { pointerId: 6, clientX: 660, clientY: 430, pointerType: 'mouse' });
	ok('a pan moved the camera', L.stateNow().tx !== before.tx);
	ok('...and marked nothing', !marked(a) && !marked(b));
}

// ---------------------------------------------------------------------------
// 3. Undo moves a node too, and that is the other move nobody can see.
// ---------------------------------------------------------------------------
// Read BEFORE the document is replaced and applied AFTER buildDom(), because buildDom() throws away
// every element -- a class put on the old circle would go with it.
console.log('\n--- undoing a move is a move ---');
{
	freshMap();
	const a = L.addNode('junction', 200, 200).id;
	const b = L.addNode('junction', 400, 200).id;

	L.saveUndoSnapshot();
	const n = L.nodeById(a);
	n.x = 700; n.y = 500;
	L.updateNode(a);
	ok('the node is somewhere else', L.nodeById(a).x === 700);
	ok('and carries no mark yet -- nothing here went through the gesture', !marked(a));

	L.undo();
	ok('undo put it back', L.nodeById(a).x === 200, 'x=' + L.nodeById(a).x);
	ok('...and marked it, on the element buildDom() has just rebuilt', marked(a));
	ok('...and left the node that did not move alone', !marked(b));

	// An undo of something that is not a move marks nothing. Same walk, different document.
	L.saveUndoSnapshot();
	L.nodeById(b)._elev = 123;
	L.undo();
	ok('undoing an edit that moved nothing marks nothing', !marked(a) && !marked(b));

	// A node the undo BRINGS BACK has not moved -- it was not there to move.
	L.saveUndoSnapshot();
	const c = L.addNode('junction', 900, 900).id;
	L.undo();
	ok('a node an undo removes is simply gone', !L.nodeEl(c));
}

// ---------------------------------------------------------------------------
// 4. It is a view fact, never a document one.
// ---------------------------------------------------------------------------
// A highlight is like which element is selected: true of this screen, this minute. It is a class on
// an element and nothing writes to the document at all, so there is no setProp() question here --
// but the saved file is where that would show, so the saved file is what is asserted.
console.log('\n--- and it is not part of the drawing ---');
{
	freshMap();
	const id = L.addNode('junction', 200, 200).id;
	setHitTarget([L.nodeEl(id).circle]);
	fire('pointerdown', { pointerId: 8, clientX: 200, clientY: 200, pointerType: 'mouse', button: 0 });
	fire('pointermove', { pointerId: 8, clientX: 280, clientY: 250, pointerType: 'mouse' });
	L.applyDrag();
	fire('pointerup', { pointerId: 8, clientX: 280, clientY: 250, pointerType: 'mouse' });
	ok('the node is marked', marked(id));

	const saved = JSON.stringify(L.serializeProject());
	ok('the saved project says nothing about it', saved.indexOf(MARK) < 0 &&
		saved.toLowerCase().indexOf('justdragged') < 0);
	ok('...nor anything about a highlight at all', saved.toLowerCase().indexOf('highlight') < 0);

	// And it survives being saved: serializing must not have quietly cleared the screen either.
	ok('the mark is still on screen after a save', marked(id));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall ok');
process.exit(fails ? 1 : 0);
