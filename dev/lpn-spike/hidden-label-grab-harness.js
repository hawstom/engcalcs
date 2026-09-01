// A THING THE USER CANNOT SEE CANNOT BE GRABBED. Run with:
//   node dev/lpn-spike/hidden-label-grab-harness.js
//
// Tom, 2026-09-01: *"A related bug I had a hard time isolating manifested related to dragging
// labels. I believe that somehow a node label is present but not (yet?) visible, and when I go to
// pan, the label that I did not see drags off the screen."*
//
// **THE CAUSE, MEASURED IN CHROMIUM BEFORE ANYTHING WAS CHANGED.** `.lpn-draglbl` -- worn by every
// draggable label on this map, a node's, a link's and a user's own Text -- carried
// `pointer-events: all`. SVG's `pointer-events` has two families, and the four names WITHOUT a
// `visible` prefix (`painted`, `fill`, `stroke`, `all`) hit-test the element regardless of its
// `visibility`. A sweep of a hidden <text>'s own bounding box, every 2 px, asking
// `elementsFromPoint()` whether it was there:
//
//     pointer-events: all,     visibility: hidden          100% of the box answered
//     pointer-events: visible, visibility: hidden            0%
//     pointer-events: visible, visible                     100%   (unchanged; nothing got harder)
//     ...and `visible` also honours a hidden PARENT, which `all` does not.
//
// So all four of the page's label-hiding mechanisms -- `.lpn-labels-hidden` (thematic colouring and
// the georeferencing wizard), `.lpn-lbl-hidden` (a Text switched off in this scenario), and
// setLabelAssemblyHidden()'s inline style for a node label DROPPED by the collision pass or a link
// label too short, crowded out or yielded -- left a fully grabbable, completely unpainted word lying
// on the map. A press on it began a label drag, and the pan the user wanted never happened.
//
// **WHAT THIS FILE CAN AND CANNOT SEE.** The stylesheet is not applied here, so section 3 reads the
// rule as text and section 1 drives the JS half -- mapHitAt() reads `visibility` too, so the two are
// one fact rather than two that can disagree. The browser half is asserted for real in
// dev/browser-pass/specs/hiddenlbl.js, which hides a label the way the page does and then presses
// on it.

'use strict';

const fs = require('fs');
const { ROOT, byId, loadLoopedNetwork, setUnitSet, setHitTarget } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, buildDom: buildDom, nodeById: nodeById,\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
	"\t\tworldToScreen: worldToScreen,\n" +
	"\t\tsetScale: function (s) { state.s = s; state.tx = 0; state.ty = 0; },\n" +
	"\t\tstateNow: function () { return { tx: state.tx, ty: state.ty, s: state.s }; },\n" +
	// tick()'s body, verbatim -- see touch-radius-harness.js: a harness that called applyDrag()
	// itself would remove the `dragDirty` coupling the gesture decisions live in.
	"\t\tapplyDrag: function () { if (drag && dragDirty) { applyDrag(); dragDirty = false; } },\n" +
	"\t\tdragNow: function () { return drag ? { type: drag.type, id: drag.id } : null; },\n" +
	"\t\tmapHitAt: mapHitAt,\n" +
	"\t\tnodeEl: function (id) { return nodeEls[id]; },\n" +
	// The two REAL calls the collision pass makes when it drops a node label (see layoutNodeLabel():
	// `setLabelAssemblyHidden(ne, !!ne.hiddenDropped)`). Not a stub for hiding -- the flag is the
	// page's own, and the page's own layout function is what acts on it.
	"\t\tlayoutNodeLabel: layoutNodeLabel,\n" +
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

// A fresh one-node map, wired to the real pointer handlers, at one world unit per pixel.
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
// One whole gesture: press on `stack` (topmost first), travel `dx,dy`, let go. The move is fired in
// two steps so the first one arms `gestureMoved` past the slop and the second is a real frame.
function gesture(stack, x, y, dx, dy) {
	setHitTarget(stack);
	fire('pointerdown', { pointerId: 7, clientX: x, clientY: y, pointerType: 'mouse', button: 0 });
	const began = L.dragNow();
	for (const f of [0.5, 1]) {
		fire('pointermove', { pointerId: 7, clientX: x + dx * f, clientY: y + dy * f, pointerType: 'mouse' });
		L.applyDrag();
	}
	fire('pointerup', { pointerId: 7, clientX: x + dx, clientY: y + dy, pointerType: 'mouse' });
	return began;
}

// ---------------------------------------------------------------------------
// 1. The defect, as a gesture: a press that lands on an invisible node label.
// ---------------------------------------------------------------------------
console.log('\n--- a press on a label nobody can see ---');
{
	const doc = freshMap();
	const id = L.addNode('junction', 200, 200).id;
	const n = L.nodeById(id), ne = L.nodeEl(id);
	const lbl = ne.text;

	ok('the node label is a drag target to begin with',
		lbl.classList.contains('lpn-draglbl') && lbl.dataset.nodelbl === id, lbl.dataset.nodelbl);

	// VISIBLE FIRST, so the rest of the file is about visibility and not about aim. This is the
	// control: the same press, on the same element, at the same point.
	const shown = gesture([lbl], 300, 180, 40, 25);
	ok('a press on a VISIBLE node label drags the label',
		!!shown && shown.type === 'nodelbl' && shown.id === id, shown && shown.type);
	const movedLx = n.lx, movedLy = n.ly;
	ok('...and the label really moved', movedLx !== undefined && movedLy !== undefined,
		'lx=' + movedLx);

	// Now hide it the way the collision pass does (Task 398): the page's own flag, acted on by the
	// page's own layout function.
	ne.hiddenDropped = true;
	L.layoutNodeLabel(id);
	ok('a dropped node label is hidden through the visibility seam',
		lbl.style.visibility === 'hidden', lbl.style.visibility || '(none)');
	ok('...and it is still IN the drawing, with its data and its class intact',
		lbl.dataset.nodelbl === id && lbl.classList.contains('lpn-draglbl'),
		'which is exactly why it could be grabbed');

	const before = L.stateNow();
	const hidden = gesture([lbl], 300, 180, 40, 25);
	ok('a press on the HIDDEN label pans instead',
		!!hidden && hidden.type === 'pan', hidden && hidden.type);
	const after = L.stateNow();
	ok('...and the map really moved, by the pointer\'s own travel',
		Math.abs((after.tx - before.tx) - 40) < 0.001 && Math.abs((after.ty - before.ty) - 25) < 0.001,
		'moved ' + (after.tx - before.tx) + ', ' + (after.ty - before.ty));
	ok('...and the label the user could not see did not move',
		n.lx === movedLx && n.ly === movedLy, 'lx=' + n.lx);

	// And it comes back. Hiding is not deletion, and a label that returns must be grabbable again --
	// otherwise the fix would have traded one silent state for another.
	ne.hiddenDropped = false;
	L.layoutNodeLabel(id);
	const back = gesture([lbl], 300, 180, 15, 15);
	ok('a label that comes back is grabbable again',
		!!back && back.type === 'nodelbl' && back.id === id, back && back.type);
	ok('the map did not pan that time', Math.abs(L.stateNow().tx - after.tx) < 0.001);
	void doc;
}

// ---------------------------------------------------------------------------
// 2. Rejecting the top of the stack must not take what is under it.
// ---------------------------------------------------------------------------
// mapHitAt() walks elementsFromPoint() rather than trusting elementFromPoint() precisely so that a
// candidate can be turned away without the real hit beneath it going with it -- and on this map a
// node's own label is drawn OVER the node, in the topmost layer. So this is the ordinary case.
console.log('\n--- the thing underneath still answers ---');
{
	freshMap();
	const id = L.addNode('junction', 200, 200).id;
	const ne = L.nodeEl(id), lbl = ne.text, dot = ne.circle;

	setHitTarget([lbl, dot]);
	const top = L.mapHitAt(300, 180);
	ok('with the label visible, the label is what the pointer finds',
		top === lbl, top === lbl ? 'the label' : (top === dot ? 'the node' : 'bare map'));

	ne.hiddenDropped = true;
	L.layoutNodeLabel(id);
	setHitTarget([lbl, dot]);
	const under = L.mapHitAt(300, 180);
	ok('with it hidden, the NODE underneath is what the pointer finds',
		under === dot, under === lbl ? 'the label -- still' : (under === dot ? 'the node' : 'bare map'));
	ok('...so the press grabs the node, not nothing and not the ghost',
		!!under && under.dataset && under.dataset.node === id, under && under.dataset && under.dataset.node);

	// Nothing but the invisible label under the pointer means bare map, which is what a pan needs.
	setHitTarget([lbl]);
	ok('an invisible label alone under the pointer reads as bare map',
		L.mapHitAt(300, 180) === byId.lpn_canvas);
}

// ---------------------------------------------------------------------------
// 3. The by-construction half, read out of the stylesheet.
// ---------------------------------------------------------------------------
// The rule the browser enforces cannot be driven from here, so it is read as text. This is the guard
// against the regression rather than against the defect: `pointer-events: all` is a plausible thing
// to type, it looks like it means "be a target", and nothing about the page LOOKS wrong afterwards.
console.log('\n--- no map rule may ignore visibility ---');
{
	const css = fs.readFileSync(ROOT + 'css/engcalcs.css', 'utf8');
	// Comments stripped: this file DESCRIBES the banned values at length, in the rule forbidding them.
	const code = css.replace(/\/\*[\s\S]*?\*\//g, '');
	const bad = [];
	const re = /pointer-events\s*:\s*(all|painted|fill|stroke)\b/g;
	let m;
	while ((m = re.exec(code))) { bad.push(m[1]); }
	ok('no declaration uses a visibility-ignoring pointer-events value', bad.length === 0,
		bad.length ? bad.join(', ') + ' -- use `visible`, which is `all` gated on visibility' : 'none');
	ok('the draggable-label rule says `visible`',
		/\.lpn-draglbl\s*\{[^}]*pointer-events:\s*visible/.test(code));
	// The unpainted reservoir/tank disc is the one place `all` was DELIBERATE, and `visible` keeps it
	// working: unpainted is not invisible -- what the user sees there is the symbol drawn over it.
	ok('the unpainted reservoir/tank hit disc is still a hit target',
		/\.lpn-node-reservoir[^{]*\{[^}]*pointer-events:\s*visible/.test(code));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall ok');
process.exit(fails ? 1 : 0);
