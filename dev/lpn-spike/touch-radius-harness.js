// A FINGER GETS A BIGGER TAP RADIUS THAN A POINTER -- ROADMAP Task 417. Run with:
//   node dev/lpn-spike/touch-radius-harness.js
//
// Tom, 2026-08-25: *"417 phone radius needs to be larger more forgiving for the switch-to-edit-mode
// decision on tapping an asset (I assume any asset, not just a new asset)."* The parenthesis is the
// scope and it is his.
//
// **WHY THIS IS NOT A SECTION OF `small-screen-harness.js`, WHICH THE TASK ASKED FOR.** That file
// asserts at 360px because everything else it guards is a media query, and a media query is keyed
// to the SCREEN. This is not: the radius follows the POINTER, read from `e.pointerType` per press.
// A touchscreen laptop at 1400px has a finger and gets the finger's number; a phone with a stylus
// or a bluetooth mouse gets the pointer's. Keying it to a width would be wrong on both machines and
// would make an assertion at 360px prove something the code does not do. Said out loud here because
// it is a deliberate departure from the task's own words.
//
// **WHAT IS BEING PROTECTED ON THE OTHER SIDE.** CLAUDE.md: *say "pointer slop" when you mean
// hand-and-mouse tolerance, and a 44px touch target is not an argument here.* That rule keeps phone
// ergonomics out of the DESKTOP design, so section 1 asserts the pointer's number is untouched, and
// section 3 asserts a pointer press takes the same path it always did. The finger's number moving
// is not a violation of that rule; the pointer's number moving would be.
//
// **SECTION 4 IS THE OTHER HALF OF THE SAME TASK.** Tom, 2026-08-30: *"dragging a node can be very
// difficult"* on a phone. A TAP got the fallback above; a PRESS did not -- touchAssetNear() has one
// call site and it is the pointerUP handler -- so a finger could OPEN a node it could not GRAB. It
// asserts the GESTURE, driven through the real pointerdown/move/up handlers, because every number
// section 1 checks was already right while the drag was still broken.

'use strict';

const { ROOT, byId, loadLoopedNetwork, setUnitSet, setHitTarget } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\tpointerSlop: function () { return NODE_SNAP_PX; },\n" +
	"\t\ttouchSlop: function () { return NODE_SNAP_TOUCH_PX; },\n" +
	"\t\tslopFor: tapSlopPx,\n" +
	"\t\ttouchAssetNear: touchAssetNear,\n" +
	"\t\tgrabSlop: function () { return NODE_GRAB_TOUCH_PX; },\n" +
	"\t\ttouchNodeGrabNear: touchNodeGrabNear,\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
	"\t\tapplyDrag: function () { if (drag) { applyDrag(); } },\n" +
	"\t\tselectedRef: selectedRef,\n" +
	"\t\tdragNow: function () { return drag ? { type: drag.type, id: drag.id } : null; },\n" +
	"\t\tnearNode: nearestNodeNearScreen,\n" +
	"\t\tworldToScreen: worldToScreen,\n" +
	"\t\tsetScale: function (s) { state.s = s; state.tx = 0; state.ty = 0; },\n" +
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

// ---------------------------------------------------------------------------
// 1. Two numbers, and the pointer's is the one that did not move.
// ---------------------------------------------------------------------------
console.log('\n--- a finger and a pointer are different instruments ---');
{
	ok('the pointer slop is still 14, exactly as before Task 417', L.pointerSlop() === 14,
		L.pointerSlop());
	// 24 px radius = a 48 px target, the figure Apple's and Google's guidelines both settle on.
	ok('the touch slop is 24, a 48px target', L.touchSlop() === 24, L.touchSlop());
	ok('...which is larger, which is the whole point', L.touchSlop() > L.pointerSlop());
}

// ---------------------------------------------------------------------------
// 2. The gesture chooses, not the machine.
// ---------------------------------------------------------------------------
console.log('\n--- decided per press, from pointerType ---');
{
	ok('a touch press takes the touch slop', L.slopFor({ pointerType: 'touch' }) === L.touchSlop());
	ok('a mouse press takes the pointer slop', L.slopFor({ pointerType: 'mouse' }) === L.pointerSlop());
	// **A PEN IS A POINTER.** It is precise, and it is what a surveyor marking up a map on a tablet
	// is holding; giving it a finger's slop would make it worse at the thing it is good at.
	ok('...and so does a PEN, which is a precise instrument',
		L.slopFor({ pointerType: 'pen' }) === L.pointerSlop());
	// An event with no pointerType at all is the safe case, not an error case: some synthetic and
	// some legacy events carry none, and a pointer's number is the conservative answer.
	ok('an event that says nothing falls back to the pointer slop',
		L.slopFor({}) === L.pointerSlop() && L.slopFor(null) === L.pointerSlop());
}

// ---------------------------------------------------------------------------
// 3. The half Tom's parenthesis names: an EXISTING asset, in Select mode.
// ---------------------------------------------------------------------------
console.log('\n--- "any asset, not just a new asset" ---');
{
	L.seedDefaultInputs();
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
	L.buildDom();
	L.buildLayers();
	L.setScale(1);   // one world unit per screen pixel, so a distance IS a pixel count
	const a = L.addNode('junction', 200, 200).id;
	const b = L.addNode('junction', 500, 200).id;
	const pipe = L.addLink('pipe', a, b).id;
	const at = L.worldToScreen(200, 200);

	// The add-* branches have always had this snap. SELECT mode never did: it asked the browser what
	// was under the point and took it within HIT_SLOP_PX, which is 2. So a tap that missed a
	// junction's dot by a few pixels opened nothing, and the user could not tell that from a press
	// the page dropped.
	const near = L.touchAssetNear(at.x + 20, at.y);
	ok('a finger 20px from a junction finds it', !!near && near.getAttribute('data-node') === a,
		near && near.getAttribute('data-node'));
	// The pointer's own tolerance would NOT have found it, which is what makes the two numbers
	// different rather than decorative.
	ok('...where the pointer\'s 14px would not have',
		!L.nearNode(at.x + 20, at.y, L.pointerSlop()));
	// **MEASURED PERPENDICULAR TO THE PIPE, NOT ALONG IT**, and getting that wrong first is worth
	// recording: 30px along the x axis from this junction is still ON the pipe leaving it, so the
	// fallback correctly found the pipe and the assertion was the thing that was wrong. Off-axis,
	// nothing is within reach.
	ok('...and 30px away from everything is outside even the finger\'s reach',
		!L.touchAssetNear(at.x, at.y - 30), 'still bounded');

	// **A NODE WINS A TIE.** Near a junction both it and its pipe are in tolerance, and the node is
	// the more specific thing the user can have meant. Without this the commonest tap on any network
	// -- on a junction, which every pipe ends at -- would open a pipe.
	const onPipe = L.touchAssetNear(at.x + 10, at.y);
	ok('a press near a junction opens the junction, not the pipe leaving it',
		!!onPipe && onPipe.getAttribute('data-node') === a, onPipe && onPipe.getAttribute('data-node'));
	// But out along the pipe, away from both ends, the pipe is what it finds.
	const mid = L.worldToScreen(350, 200);
	const found = L.touchAssetNear(mid.x, mid.y + 15);
	ok('...and 15px off the middle of a pipe finds the pipe',
		!!found && found.getAttribute('data-link') === pipe,
		found && (found.getAttribute('data-link') || found.getAttribute('data-node')));
	// Bare map stays bare map. The fallback may only ever ADD a hit where the real test found
	// nothing; it must never invent one out in the open, or panning becomes impossible on a phone.
	const far = L.worldToScreen(350, 500);
	ok('a press in open space still finds nothing', !L.touchAssetNear(far.x, far.y));
}

// ---------------------------------------------------------------------------
// 4. THE GESTURE, not the number: a finger must be able to GRAB a node, and a
//    pan must survive. Driven through the real pointerdown/move/up handlers,
//    because the defect lived in the wiring -- touchAssetNear() was already
//    correct and reachable, from the pointerUP path alone.
// ---------------------------------------------------------------------------
console.log('\n--- a press, not a tap: grabbing a node with a finger ---');
{
	ok('the grab radius is smaller than the tap radius', L.grabSlop() < L.touchSlop(),
		L.grabSlop() + ' < ' + L.touchSlop());

	byId.lpn_toolbar.querySelectorAll = function () { return []; };
	L.seedDefaultInputs();
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
	L.buildDom();
	L.buildLayers();
	L.setScale(1);
	L.wirePointerEvents();
	L.setMode('select');
	const svg = byId.lpn_canvas;
	const a = L.addNode('junction', 200, 200).id;
	L.addNode('junction', 500, 200);
	const at = L.worldToScreen(200, 200);

	// BARE MAP under the pointer, every time. That is the whole premise: the browser's own hit test
	// finds nothing (a junction is drawn 7px across), and the question is what the page does next.
	function fire(type, ev) { setHitTarget(null); (svg._listeners[type] || []).forEach(function (fn) { fn(ev); }); }
	function press(kind, x, y) {
		fire('pointerdown', { pointerId: 9, clientX: x, clientY: y, pointerType: kind, button: 0 });
		return L.dragNow();
	}
	function release(x, y) { fire('pointerup', { pointerId: 9, clientX: x, clientY: y, pointerType: 'touch' }); }

	const near = press('touch', at.x + 12, at.y);
	ok('a finger pressing 12px from a junction begins a NODE drag',
		!!near && near.type === 'node' && near.id === a, near && (near.type + ' ' + near.id));
	// **AND THE PROMOTED NODE IS THE SELECTED ONE** -- the Task 415 rule, on a touch near-miss drag.
	const selDuring = L.selectedRef();
	ok('...and that node is selected on the DOWN stroke, before any movement',
		!!selDuring && selDuring.kind === 'node' && selDuring.id === a,
		selDuring && (selDuring.kind + ' ' + selDuring.id));
	// It really moves the node, through the page's own applyDrag -- not just a record that says so.
	fire('pointermove', { pointerId: 9, clientX: at.x + 62, clientY: at.y, pointerType: 'touch' });
	L.applyDrag();
	const moved = doc.nodes.filter(function (n) { return n.id === a; })[0];
	ok('...and moving the finger 50px moves the node 50 world units', Math.round(moved.x) === 250,
		moved.x);
	release(at.x + 62, at.y);
	ok('the drag ends on release', L.dragNow() === null);

	// THE POINTER PATH IS UNTOUCHED. The identical press from a mouse still pans, which is what
	// makes this a touch fix rather than a change to the desktop map.
	const byMouse = press('mouse', at.x + 12, at.y);
	ok('the IDENTICAL press from a mouse still pans',
		!!byMouse && byMouse.type === 'pan', byMouse && byMouse.type);
	release(at.x + 12, at.y);

	// **A PAN INSIDE THE TAP RADIUS BUT OUTSIDE THE GRAB RADIUS STILL PANS.** This is the price of
	// the two numbers being different and it is the assertion that records it: 20px from a junction
	// a TAP opens that junction (section 3) and a PRESS pans.
	const between = press('touch', at.x + 20, at.y);
	ok('a finger pressing 20px away -- inside the tap radius, outside the grab -- PANS',
		!!between && between.type === 'pan', between && between.type);
	release(at.x + 20, at.y);

	// And out in the open, nothing has changed at all: panning is how an off-screen part of the
	// network is reached, and it must stay reachable from anywhere that is not a node.
	const far = press('touch', at.x, at.y + 120);
	ok('a finger pressing far from every node still pans',
		!!far && far.type === 'pan', far && far.type);
	release(at.x, at.y + 120);

	// The helper itself is nodes-only: a pipe is a stroke with a halo and is already finger-sized,
	// and a grab corridor down every pipe is exactly where a pan most needs to start.
	const mid = L.worldToScreen(350, 200);
	ok('the grab fallback offers no LINK, only nodes', !L.touchNodeGrabNear(mid.x, mid.y));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
