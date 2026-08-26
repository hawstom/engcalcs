// Task 509 -- EDIT MODE ON THE PATH ITSELF, driven as a gesture. Run with:
//   node dev/lpn-spike/profile-edit-harness.js
//
// Tom, 2026-08-25, on the Edit door that shipped the same day: *"Task is not finished. The ideal UX
// would be for pressing the edit button to put the path in Edit mode so that you can drag any
// waypoint or not-yet-waypoint on the path including the start and end. And you can remove any
// manual waypoint by clicking. Simple UI, maybe not simple programming."*
//
// **THE ONE IDEA THIS EXISTS TO PIN: one gesture does two operations.** A node the route merely
// passes through and a node that is already a stop are dragged identically; what differs is what
// the drag MEANS, and that difference is a number (EngCalcs.lpnProfile.pathHandles' `stop`) decided
// before the pointer goes down. Every way of getting it wrong is silent in a still frame:
//
//   1. **A pass-through drag moves the wrong stop, or none.** Then "add a waypoint by dragging" is
//      really "move the nearest waypoint", and a three-stop path scrambles on the first drag.
//   2. **A stop drag inserts instead of moving**, which grows the stop list on every nudge.
//   3. **An end is not a handle.** Then the operation Task 506 took -- change ONE end -- is still
//      only in a pull-down, which is the half of the task Tom said was not finished.
//   4. **A click removes something that is not a manual waypoint.** An end is not removable (a path
//      with one end is not a path) and a pass-through has nothing to remove.
//   5. **A drag that lands on nothing does something.** Bare map is not a stop -- a stop IS a node
//      id -- so the only honest outcomes are "put it back" and "say why", and it must do both.
//   6. **The drag moves the junction.** A handle sits exactly on a node symbol, so without a rule
//      the gesture that re-routes a path also edits the network. This is the expensive one: it
//      writes to the document, and the user was not editing the document.
//   7. **Edit mode and the chooser are both on.** The chooser writes a stop list profileStops()
//      reads INSTEAD of from/to/waypoints, so a handle dragged while it runs edits a route nobody
//      can see.
//   8. **The overlay box is gone.** It is not superseded by this -- it is the discoverable form, it
//      is what a pointer-less reader gets, and it names the waypoints, which the drawing cannot.
//      Both are entered by the same press and both are asserted here.
//
// The gestures go through wirePointerEvents()'s REAL listeners, the REAL Edit button and the page's
// REAL keydown listener, exactly as profile-chooser-harness.js does: calling profileHandleDrop() by
// hand would test the half that was never in doubt.
//
// **THE CLOCK IS FAKE, ON PURPOSE**, for that harness's reason -- the tap/drag machinery this rides
// on reads Date.now() for the long-press and double-tap windows, and a real timer in a test is a
// flake waiting for a slow machine.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { byId, setUnitSet, setHitTarget, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const keydownListeners = [];
global.document.addEventListener = function (type, fn) {
	if (type === 'keydown') { keydownListeners.push(fn); }
};

let clock = 1000000;
Date.now = function () { return clock; };
function advance(ms) { clock += ms; }

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, addLink: addLink,\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
	"\t\twirePane: wirePane, wireProfileEditPopup: wireProfileEditPopup,\n" +
	"\t\topenPane: openPane,\n" +
	"\t\tprofileTabBtn: function () {\n" +
	"\t\t\tvar strip = document.getElementById('lpn_pane_tabs');\n" +
	"\t\t\treturn (strip.children || []).filter(function (c) { return c.id === 'lpn_pane_tab_profile'; })[0] || null;\n" +
	"\t\t},\n" +
	// The REAL Edit button, off the panel rebuildProfileForm() built -- not a call to
	// toggleProfileEdit(), which would skip the wiring this task actually changed.
	// Found by walking the panel rebuildProfileForm() really built -- the stub's getElementById
	// knows only the ids it was seeded with, and this button is made at run time.
	"\t\tprofileEditBtn: function () {\n" +
	"\t\t\tvar out = null, box = document.getElementById('lpn_profile_form');\n" +
	"\t\t\t(function walk(e) {\n" +
	"\t\t\t\tif (!e) { return; }\n" +
	"\t\t\t\tif (e.id === 'lpn_profile_edit_btn') { out = e; }\n" +
	"\t\t\t\t(e.children || []).forEach(walk);\n" +
	"\t\t\t}(box));\n" +
	"\t\t\treturn out;\n" +
	"\t\t},\n" +
	"\t\tprofileState: function () { return profileState; },\n" +
	"\t\tprofileStops: profileStops,\n" +
	"\t\tprofilePath: profilePath,\n" +
	"\t\tprofileHandles: function () { return profileHandleSet().handles; },\n" +
	"\t\teditActive: function () { return profileEditActive(); },\n" +
	"\t\teditBoxOpen: function () { return profileEditIsOpen(); },\n" +
	"\t\tdragType: function () { return drag ? drag.type : null; },\n" +
	"\t\tpopupPending: function () { return !!pendingLinkPopupTimer; },\n" +
	"\t\tnodeXY: function (id) { var n = nodeById(id); return n ? [n.x, n.y] : null; },\n" +
	// **THE TICK BODY, NOT A SHORTCUT AROUND IT.** applyDrag() runs off requestAnimationFrame, which
	// the stub makes asynchronous; a synchronous harness would otherwise send a pointermove that
	// nothing ever acts on and then assert that nothing happened.
	"\t\tpumpDrag: function () { if (drag && dragDirty) { applyDrag(); dragDirty = false; } },\n" +
	"\t\tsayText: function () { return profileSayEl ? profileSayEl.textContent : null; },\n" +
	// Counted off the DRAWING, not off a variable: a handle nothing paints is a handle the user
	// cannot aim at, which is the same defect as no handle at all. Split by fill, which is how the
	// two kinds are told apart on screen.
	"\t\tmapHandles: function () {\n" +
	"\t\t\tvar out = { stop: 0, passing: 0 };\n" +
	"\t\t\tif (!profilePathLayer) { return out; }\n" +
	"\t\t\t(profilePathLayer.children || []).forEach(function (c) {\n" +
	"\t\t\t\tif (c['class'] !== 'lpn-profile-handle') { return; }\n" +
	"\t\t\t\tif (c.getAttribute('fill') === '#f60') { out.stop++; } else { out.passing++; }\n" +
	"\t\t\t});\n" +
	"\t\t\treturn out;\n" +
	"\t\t},\n" +
	"\t\tboxEls: function (tag) {\n" +
	"\t\t\tvar out = [], box = document.getElementById('lpn_profile_edit_form');\n" +
	"\t\t\t(function walk(e) {\n" +
	"\t\t\t\tif (!e) { return; }\n" +
	"\t\t\t\tif (e._tag === tag) { out.push(e); }\n" +
	"\t\t\t\t(e.children || []).forEach(walk);\n" +
	"\t\t\t}(box));\n" +
	"\t\t\treturn out;\n" +
	"\t\t},\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
	"\t\t\tproject = { name: '', activeScenario: 'base' }; scenarios = defaultScenarios();\n" +
	"\t\t\tselection = null; drag = null;\n" +
	"\t\t\tprofileState = { from: '', to: '', waypoints: [], draw: null, activeId: '',\n" +
	"\t\t\t\tediting: false, editDrag: null }; profileShown = false;\n" +
	"\t\t\tprofileTouch = false; profileLastTap = null; profileTouchEnded = 0;\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); } "
);

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function same(actual, expected, name) {
	const a = JSON.stringify(actual), b = JSON.stringify(expected);
	ok(name, a === b, a === b ? '' : `got ${a}, want ${b}`);
}

byId.lpn_toolbar.querySelectorAll = () => [];
setUnitSet('us');
const svg = byId.lpn_canvas;
L.wirePane();
L.wireProfileEditPopup();
let wired = false;

function hit(dataset) { return { dataset: dataset, classList: { contains: () => false } }; }
const EMPTY = hit({});
function fire(type, ev) {
	setHitTarget(ev.target && ev.target.dataset ? ev.target : null);
	(svg._listeners[type] || []).forEach(fn => fn(ev));
}
// A POINTER DRAG, in the three events a browser really sends -- and the tick between them, because
// the page applies a drag on an animation frame and not on the move event itself.
function dragTo(from, to, fromTarget, toTarget) {
	const t0 = fromTarget || EMPTY;
	fire('pointerdown', { pointerId: 1, clientX: from[0], clientY: from[1], target: t0, button: 0, pointerType: 'mouse' });
	fire('pointermove', { pointerId: 1, clientX: to[0], clientY: to[1], target: toTarget || EMPTY });
	L.pumpDrag();
	advance(20);
	fire('pointerup', { pointerId: 1, clientX: to[0], clientY: to[1], target: toTarget || EMPTY, pointerType: 'mouse' });
}
// A CLICK: down and up in the same place, under the 4px threshold that separates a tap from a drag.
function click(x, y, target) {
	const t = target || EMPTY;
	fire('pointerdown', { pointerId: 1, clientX: x, clientY: y, target: t, button: 0, pointerType: 'mouse' });
	advance(20);
	fire('pointerup', { pointerId: 1, clientX: x, clientY: y, target: t, pointerType: 'mouse' });
}
function pressEscape() {
	keydownListeners.forEach(fn => fn({
		key: 'Escape', preventDefault: function () {}, stopPropagation: function () {}
	}));
}

// ---- the fixture ------------------------------------------------------------------------------
//
// The chooser harness's diamond, for its reason: two routes from A to D that differ in LENGTH and
// not in hop count, so "the route bent because I dragged" and "the route was going that way anyway"
// are different sentences.
//
//      B --- B2        the SHORT way: 50 + 25 + 25 = 100
//     /        \
//    A          D      plus E, connected to nothing at all
//     \        /
//        C            the LONG way: 400 + 400 = 800
const P = { A: [0, 0], B: [200, -100], B2: [300, -100], C: [200, 100], D: [400, 0], E: [900, 900] };
function build() {
	L.reset();
	if (!wired) { L.wirePointerEvents(); wired = true; }
	L.setMode('select');
	const id = {};
	Object.keys(P).forEach(function (k) { id[k] = L.addNode('junction', P[k][0], P[k][1]).id; });
	function mk(a, b, len) {
		const l = L.addLink('pipe', id[a], id[b]);
		l.lenAuto = false; l._length = len;
		return l.id;
	}
	const links = {
		AB: mk('A', 'B', 50), BB2: mk('B', 'B2', 25), B2D: mk('B2', 'D', 25),
		AC: mk('A', 'C', 400), CD: mk('C', 'D', 400)
	};
	L.openPane('profile');
	// The path every section starts from: A to D, which the router takes by the SHORT branch.
	L.profileState().from = id.A;
	L.profileState().to = id.D;
	L.profileState().waypoints = [];
	return { id: id, links: links };
}
function X(k) { return P[k][0]; }
function Y(k) { return P[k][1]; }
function at(k) { return [P[k][0], P[k][1]]; }
function pressEdit() {
	const b = L.profileEditBtn();
	(b._listeners.click || []).forEach(fn => fn({ preventDefault: function () {} }));
}
function pressProfile() {
	const b = L.profileTabBtn();
	(b._listeners.click || []).forEach(fn => fn({ preventDefault: function () {} }));
}

// ---- 1. the door, and what it opens -----------------------------------------------------------
{
	console.log('\n--- the Edit button arms the path AND the box ---');
	const n = build();
	ok('the Edit button is on the panel', !!L.profileEditBtn());
	ok('...and the path is NOT in edit mode until it is pressed', !L.editActive());

	pressEdit();
	ok('pressing Edit puts the path in edit mode', L.editActive());
	ok('...and the button says so', L.profileEditBtn().getAttribute('aria-pressed') === 'true');
	// **THE BOX IS NOT SUPERSEDED.** It is the discoverable form and the pointer-less way through
	// the same two operations, so the same press opens it and it keeps its two pull-downs.
	ok('...and the overlay box opens with it', L.editBoxOpen());
	ok('...still carrying the two ends as pull-downs', L.boxEls('select').length === 2,
		L.boxEls('select').length + ' selects');
	ok('...and the commentary line explains the gesture',
		/[Dd]rag/.test(L.sayText() || ''), JSON.stringify(L.sayText()));

	// EVERY node of the route is a handle, and the two kinds are told apart on the drawing.
	const hs = L.profileHandles();
	same(hs.map(h => h.node), [n.id.A, n.id.B, n.id.B2, n.id.D],
		'every node the route passes through is a handle');
	same(hs.map(h => h.stop), [0, -1, -1, 1],
		'...labelled as the two ends and two not-yet-waypoints');
	same(L.mapHandles(), { stop: 2, passing: 2 },
		'...and all four are PAINTED, ends solid and pass-throughs hollow');

	pressEdit();
	ok('a second press leaves edit mode', !L.editActive());
	ok('...and takes the box with it', !L.editBoxOpen());
	same(L.mapHandles(), { stop: 0, passing: 0 }, '...and the handles come off the drawing');
}

// ---- 2. THE ONE GESTURE, BOTH MEANINGS --------------------------------------------------------
{
	console.log('\n--- drag a not-yet-waypoint: it BECOMES one ---');
	const n = build();
	pressEdit();
	// B2 is merely ON the route. Dragging it to C -- which is on the other branch entirely -- must
	// insert C as a waypoint, not move an end and not move the nearest existing stop.
	dragTo(at('B2'), at('C'), hit({ node: n.id.B2 }), hit({ node: n.id.C }));
	same(L.profileStops(), [n.id.A, n.id.C, n.id.D],
		'dragging a pass-through node makes the node it landed on a WAYPOINT');
	same(L.profilePath().links, [n.links.AC, n.links.CD],
		'...and the route re-routes through it, down the long branch');
	ok('...over the length that branch adds up to', L.profilePath().length === 800,
		L.profilePath().length);
	ok('...and the ends are untouched',
		L.profileState().from === n.id.A && L.profileState().to === n.id.D);
	same(L.mapHandles(), { stop: 3, passing: 0 },
		'...and the new waypoint is drawn as a stop, not as a pass-through');

	console.log('\n--- drag an existing waypoint: it MOVES ---');
	dragTo(at('C'), at('B'), hit({ node: n.id.C }), hit({ node: n.id.B }));
	same(L.profileStops(), [n.id.A, n.id.B, n.id.D],
		'dragging a stop MOVES that stop rather than inserting a second one');
	ok('...so the stop list did not grow', L.profileState().waypoints.length === 1,
		JSON.stringify(L.profileState().waypoints));

	console.log('\n--- drag an END: the path re-routes from its new end ---');
	const m = build();
	pressEdit();
	dragTo(at('D'), at('C'), hit({ node: m.id.D }), hit({ node: m.id.C }));
	same(L.profileStops(), [m.id.A, m.id.C],
		'dragging the far end changes THAT end, which no longer needs a pull-down');
	same(L.profilePath().links, [m.links.AC], '...and the route follows it');
	dragTo(at('A'), at('B'), hit({ node: m.id.A }), hit({ node: m.id.B }));
	same(L.profileStops(), [m.id.B, m.id.C], '...and the near end drags the same way');
}

// ---- 3. a click takes a manual waypoint off, and NOTHING else ---------------------------------
{
	console.log('\n--- click removes a manual waypoint only ---');
	const n = build();
	pressEdit();
	dragTo(at('B2'), at('C'), hit({ node: n.id.B2 }), hit({ node: n.id.C }));
	same(L.profileStops(), [n.id.A, n.id.C, n.id.D], 'a waypoint to remove');

	click(X('C'), Y('C'), hit({ node: n.id.C }));
	same(L.profileStops(), [n.id.A, n.id.D], 'clicking a manual waypoint takes it off the path');
	same(L.profilePath().links, [n.links.AB, n.links.BB2, n.links.B2D],
		'...and the route falls back to the suggested one');

	click(X('B'), Y('B'), hit({ node: n.id.B }));
	same(L.profileStops(), [n.id.A, n.id.D],
		'clicking a node that is merely ON the route removes NOTHING');
	ok('...and opens no property sheet over the route being edited', !L.popupPending());

	click(X('A'), Y('A'), hit({ node: n.id.A }));
	same(L.profileStops(), [n.id.A, n.id.D],
		'clicking an END removes nothing -- a path with one end is not a path');
	click(X('D'), Y('D'), hit({ node: n.id.D }));
	same(L.profileStops(), [n.id.A, n.id.D], '...and neither does clicking the other one');

	click(700, 700, EMPTY);
	same(L.profileStops(), [n.id.A, n.id.D], 'clicking bare map changes nothing');
	ok('...and still opens no property sheet', !L.popupPending());
}

// ---- 4. A DRAG THAT LANDS ON NOTHING: put it back, and say why --------------------------------
{
	console.log('\n--- the drop with nowhere to land ---');
	const n = build();
	pressEdit();
	dragTo(at('B2'), at('C'), hit({ node: n.id.B2 }), hit({ node: n.id.C }));
	const before = JSON.stringify(L.profileStops());

	dragTo(at('C'), [700, 700], hit({ node: n.id.C }), EMPTY);
	same(L.profileStops(), JSON.parse(before),
		'a drag released over bare map leaves the path EXACTLY as it was');
	ok('...and the line says why, rather than failing silently',
		/unchanged/.test(L.sayText() || ''), JSON.stringify(L.sayText()));

	// AND A DROP WITH NO ROUTE: refused, and the two nodes named -- the chooser's own refusal,
	// reached by the other gesture.
	dragTo(at('C'), at('E'), hit({ node: n.id.C }), hit({ node: n.id.E }));
	same(L.profileStops(), JSON.parse(before),
		'a drop on a node with no route to its neighbours leaves the path alone');
	ok('...and names both ends of the leg that has no route',
		(L.sayText() || '').indexOf(n.id.E) >= 0, JSON.stringify(L.sayText()));

	// A drag that goes nowhere at all is not a change either -- and it is a CLICK by the 4px rule,
	// so it must also not remove the end it started on.
	dragTo(at('A'), at('A'), hit({ node: n.id.A }), hit({ node: n.id.A }));
	same(L.profileStops(), JSON.parse(before), 'dropping a handle back on itself changes nothing');
}

// ---- 5. THE EXPENSIVE ONE: the drag must not edit the network ---------------------------------
{
	console.log('\n--- a handle drag re-routes a path; it never moves a junction ---');
	const n = build();
	pressEdit();
	const wasB2 = JSON.stringify(L.nodeXY(n.id.B2));

	fire('pointerdown', { pointerId: 1, clientX: X('B2'), clientY: Y('B2'), target: hit({ node: n.id.B2 }), button: 0, pointerType: 'mouse' });
	ok('the press on a handle starts a PATH drag, not a node drag',
		L.dragType() === 'profilehandle', String(L.dragType()));
	fire('pointermove', { pointerId: 1, clientX: X('C'), clientY: Y('C'), target: hit({ node: n.id.C }) });
	L.pumpDrag();
	ok('...and the route follows the pointer BEFORE the button comes up',
		JSON.stringify(L.profileStops()) === JSON.stringify([n.id.A, n.id.C, n.id.D]),
		JSON.stringify(L.profileStops()));
	fire('pointerup', { pointerId: 1, clientX: X('C'), clientY: Y('C'), target: hit({ node: n.id.C }), pointerType: 'mouse' });
	ok('the junction it was aimed at did not move',
		JSON.stringify(L.nodeXY(n.id.B2)) === wasB2, JSON.stringify(L.nodeXY(n.id.B2)));

	// A press that is NOT on a handle pans, which is how an off-screen node is reached -- and still
	// does not drag the element under it.
	const wasE = JSON.stringify(L.nodeXY(n.id.E));
	fire('pointerdown', { pointerId: 1, clientX: X('E'), clientY: Y('E'), target: hit({ node: n.id.E }), button: 0, pointerType: 'mouse' });
	ok('a press on a node that is not on the path pans instead', L.dragType() === 'pan',
		String(L.dragType()));
	fire('pointermove', { pointerId: 1, clientX: X('E') + 40, clientY: Y('E'), target: EMPTY });
	L.pumpDrag();
	fire('pointerup', { pointerId: 1, clientX: X('E') + 40, clientY: Y('E'), target: EMPTY, pointerType: 'mouse' });
	ok('...and that node did not move either', JSON.stringify(L.nodeXY(n.id.E)) === wasE);
}

// ---- 6. the two modes are never both on, and Escape leaves this one ---------------------------
{
	console.log('\n--- edit mode, the chooser, and Escape ---');
	build();
	pressEdit();
	ok('edit mode is on', L.editActive());
	// Pressing Profile while the tab is already showing ARMS THE CHOOSER (Task 506). It must put
	// edit mode away: the chooser's stop list is what profileStops() reads while it runs.
	pressProfile();
	ok('arming the chooser turns edit mode off', !L.editActive() && !!L.profileState().draw);
	ok('...and closes the box, which edits stops nothing is reading', !L.editBoxOpen());
	pressProfile();   // cancel the chooser

	const m = build();
	pressEdit();
	dragTo(at('B2'), at('C'), hit({ node: m.id.B2 }), hit({ node: m.id.C }));
	const kept = JSON.stringify(L.profileStops());
	pressEscape();
	ok('Escape leaves edit mode', !L.editActive());
	same(L.profileStops(), JSON.parse(kept),
		'...and costs nothing -- every edit made in the mode was committed as it was made');
	ok('...and the button no longer reads as pressed',
		L.profileEditBtn().getAttribute('aria-pressed') === 'false');
}

console.log('\n' + (fails ? fails + ' FAILED of ' : 'all ') + checks + ' checks');
process.exit(fails ? 1 : 0);
