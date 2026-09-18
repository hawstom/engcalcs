// CUSTOMERS: WHAT THE HAND IS PROMISED, AND WHAT IT GETS -- ROADMAP Task 247. Run with:
//   node dev/lpn-spike/customer-grip-harness.js
//
// The OTHER customer harness (customer-harness.js) is about the model: which junction a demand
// lumps at, what a total adds up to, what an .inp says. This one is about the two gestures, and
// they fail in a way no model assertion can see -- the document ends up correct and the drawing
// told the user something else on the way there.
//
// 1. **THE PLACEMENT BAND MAY ONLY DRAW A CONNECTION THAT COULD BE MADE** (Tom, 2026-09-18: *"I
//    think that the rubber band after customer placement step 1 should be constrained to link
//    perpendiculars and nodes"*). It used to run from the meter to the raw pointer, so between the
//    two presses the page drew a service at an arbitrary angle ending in open space -- two things
//    this page does not offer -- and the station it then used was not the one the line pointed at.
//    The failure is invisible afterwards: the customer lands correctly and only the promise was
//    false.
//
// 2. **THE CONNECTION GRIP MOVES A CUSTOMER TO ANOTHER ASSET, AND THE LINE STAYS PUT UNTIL IT
//    ARRIVES** (Tom, 2026-09-18, his own design: *"you can drag the connection point to a different
//    asset, and while you drag, only the connection point drags. The line stays where it is until
//    you arrive at another asset, and at that point the service line snaps to the new asset,
//    repeating this until you drop the connection point on a new asset, all always either perp to
//    link or snapped to node."*). Every clause there is an assertion below, and the one that is
//    easy to lose is the middle one: over bare map NOTHING moves, which is what makes the gesture
//    readable instead of a rubber band flailing across the drawing.
//
// Every user-facing string is asserted against EngCalcs.pageConfig, never an English literal.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { ROOT, byId, loadLoopedNetwork, setUnitSet, setHitTarget } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\taddCustomer: addCustomer, customerById: customerById,\n" +
	"\t\tcustomerAttachPoint: customerAttachPoint, customerPoint: customerPoint,\n" +
	"\t\tcustomerConnectionAt: customerConnectionAt,\n" +
	"\t\tcustomerT: customerT, customerLink: customerLink,\n" +
	"\t\tsetPendingMeter: setPendingMeter,\n" +
	"\t\tpendingMeter: function () { return pendingMeter; },\n" +
	"\t\tpendingBand: function () { return pendingMeterBand; },\n" +
	"\t\tpendingDot: function () { return pendingMeterEl; },\n" +
	"\t\tcustHandle: function () { return custHandleEl; },\n" +
	"\t\tcustBox: function (id) { return custEls[id] && custEls[id].box; },\n" +
	"\t\tsetSelection: setSelection, selectedRef: selectedRef,\n" +
	"\t\tdragNow: function () { return drag ? { type: drag.type, id: drag.id } : null; },\n" +
	"\t\tapplyDrag: function () { if (drag && dragDirty) { applyDrag(); dragDirty = false; } },\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
	"\t\tworldToScreen: worldToScreen,\n" +
	"\t\tsetScale: function (s) { state.s = s; state.tx = 0; state.ty = 0; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
L.setScale(1);
L.wirePointerEvents();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-6 : tol); }
const svg = byId.lpn_canvas;
// Bare map under the pointer unless a test says otherwise: a junction is drawn seven pixels
// across, so the browser's own hit test finding nothing is the ordinary case, not the exception.
function fire(type, ev, target) {
	setHitTarget(target || null);
	(svg._listeners[type] || []).forEach(function (fn) { fn(Object.assign({ target: target || svg }, ev)); });
}
function move(x, y, target) {
	fire('pointermove', { pointerId: 3, clientX: x, clientY: y, pointerType: 'mouse' }, target);
}
function down(x, y, target) {
	fire('pointerdown', { pointerId: 3, clientX: x, clientY: y, pointerType: 'mouse', button: 0 }, target);
}
function up(x, y, target) {
	fire('pointerup', { pointerId: 3, clientX: x, clientY: y, pointerType: 'mouse', button: 0 }, target);
}
function bandVisible() {
	const b = L.pendingBand();
	return !!b && b.getAttribute('visibility') !== 'hidden';
}
function bandEnd() {
	const b = L.pendingBand();
	return { x: +b.getAttribute('x2'), y: +b.getAttribute('y2') };
}

// A main along y = 200 from x = 100 to x = 600, and a second one crossing it far away, so a test
// can aim at one without being in reach of the other.
const doc = L.getDoc();
doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0; doc.customers = [];
const jA = L.addNode('junction', 100, 200);
const jB = L.addNode('junction', 600, 200);
const jC = L.addNode('junction', 100, 800);
const jD = L.addNode('junction', 600, 800);
const main = L.addLink('pipe', jA.id, jB.id);
const other = L.addLink('pipe', jC.id, jD.id);
L.buildDom();

// ---------------------------------------------------------------------------
console.log('\n--- 1. the placement band draws a connection or nothing at all ---');
// ---------------------------------------------------------------------------
{
	L.setMode('add-meter');
	// The meter goes 60 units below the main, halfway along it. The perpendicular from there meets
	// the main at (350, 200) whatever the pointer then does.
	L.setPendingMeter({ x: 350, y: 260 });
	ok('1.1 a half-placed customer draws no band before the pointer has found anything',
		!bandVisible());

	// **OVER BARE MAP: NO BAND.** The old code drew one to the pointer here, which is the promise
	// this section exists to have removed.
	const empty = L.worldToScreen(350, 600);
	move(empty.x, empty.y);
	ok('1.2 over bare map there is no band, because that press would connect nothing',
		!bandVisible());

	// **OVER THE MAIN: THE BAND ENDS ON THE PERPENDICULAR FOOT, NOT UNDER THE POINTER.** The
	// pointer is 200 units up the pipe from the foot; if the band followed the hand it would end
	// at x = 550.
	const onPipe = L.worldToScreen(550, 200);
	move(onPipe.x, onPipe.y);
	ok('1.3 over a pipe the band appears', bandVisible());
	ok('1.4 ...and it ends square to the main, at the foot of the perpendicular from the customer',
		near(bandEnd().x, 350, 1e-6) && near(bandEnd().y, 200, 1e-6),
		JSON.stringify(bandEnd()));
	ok('1.5 ...which is NOT where the pointer is, and that is the whole correction',
		!near(bandEnd().x, 550, 1));

	// **OVER A NODE: THE BAND ENDS ON THE NODE.** Within reach of the junction at (100,200) the
	// connection is that node, so the line says so before the press rather than after it.
	const onNode = L.worldToScreen(100, 200);
	move(onNode.x + 3, onNode.y + 3);
	ok('1.6 within reach of a junction the band ends exactly on the node',
		bandVisible() && near(bandEnd().x, 100, 1e-6) && near(bandEnd().y, 200, 1e-6),
		JSON.stringify(bandEnd()));

	// **AND IT GOES AWAY AGAIN.** A band that appeared once and then stayed drawn to a pipe the
	// pointer has left is the same false promise in slow motion.
	move(empty.x, empty.y);
	ok('1.7 leaving every asset takes the band away again', !bandVisible());

	// **THE PRESS LANDS WHERE THE BAND POINTED.** One resolver, read twice -- this is the assertion
	// that makes 1.4 worth anything, because a preview that is right about a rule the commit does
	// not follow is worse than no preview.
	move(onPipe.x, onPipe.y);
	const promised = bandEnd();
	down(onPipe.x, onPipe.y);
	up(onPipe.x, onPipe.y);
	const made = (doc.customers || [])[0];
	ok('1.8 the press makes a customer', !!made);
	const got = made ? L.customerAttachPoint(made) : null;
	ok('1.9 ...connected exactly where the band promised',
		!!got && near(got.x, promised.x, 1e-6) && near(got.y, promised.y, 1e-6),
		got ? JSON.stringify(got) + ' promised ' + JSON.stringify(promised) : 'none');
	ok('1.10 ...and the customer itself is still where the first press put it',
		!!made && near(L.customerPoint(made).x, 350, 1e-6) && near(L.customerPoint(made).y, 260, 1e-6),
		made ? JSON.stringify(L.customerPoint(made)) : 'none');
	doc.customers.length = 0;
	L.buildDom();
	L.setMode('select');
}

console.log('');
if (fails) {
	console.log(fails + ' FAILURE(S)');
	process.exit(1);
}
console.log('All customer grip checks passed.');
