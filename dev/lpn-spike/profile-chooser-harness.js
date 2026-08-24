// Task 433 -- the profile's PATH CHOOSER, driven as a gesture.
//
//   node dev/lpn-spike/profile-chooser-harness.js
//
// WHAT THIS EXISTS TO CATCH. js/lpn-profile.js already has a harness for the routing arithmetic
// (profile-harness.js) and profile-eps-harness.js already proves the chart follows the transport.
// Neither can see the thing Tom actually asked for -- *"we just need a good UI"* -- which is a
// SEQUENCE of pointer events, and every way of getting it wrong is silent in a still frame:
//
//   1. **The hover shows nothing.** Then the gesture is a form with the fields painted on the map,
//      and the user learns which branch the route took only after committing to it. Asserted as a
//      real dashed candidate on the map BETWEEN clicks, and as the candidate CHANGING when the
//      pointer moves to a different branch.
//   2. **A click commits the wrong route.** Two branches of different length between the same pair
//      is the case that tells a length-weighted route from a hop-counted one; the waypoint click is
//      the whole point of the chooser, so the test is that a stop on the LONG branch actually bends
//      the committed route onto it.
//   3. **An unreachable stop is swallowed.** The chart would go blank with no way to tell which
//      stop was the bad one, so an unroutable click must be refused AND named.
//   4. **Escape destroys the route that was already there.** The worst of the four, because the user
//      pressed Escape precisely to not lose anything.
//   5. **The double-click that ends the gesture also does what a double-click normally does** --
//      inserts a vertex, or resets a label home. Its two taps run through the click handler first,
//      so a chooser that does not dedupe the last stop also doubles it.
//
// The gestures go through wirePointerEvents()'s REAL listeners and the page's REAL keydown listener,
// exactly as selection-harness.js does, because the wiring between them is where this task's work
// is: calling profileDrawClick() by hand would test the half that was never in doubt.

const { byId, setUnitSet, setHitTarget, loadLoopedNetwork } = require('./lpn-dom-stub.js');

// Recorded BEFORE the page is evaluated -- the stub's document.addEventListener is a no-op, so the
// page's own Escape listener would otherwise be dropped on the floor and the cancel path, which is
// half of this task's acceptance, would be untestable.
const keydownListeners = [];
global.document.addEventListener = function (type, fn) {
	if (type === 'keydown') { keydownListeners.push(fn); }
};

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, addLink: addLink,\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
	"\t\topenPane: openPane, closePane: closePane,\n" +
	"\t\tprofileState: function () { return profileState; },\n" +
	"\t\tprofileStops: profileStops,\n" +
	// The COMMITTED path, as every consumer sees it -- not a copy of the rule.
	"\t\tprofilePath: profilePath,\n" +
	"\t\trebuildProfileForm: rebuildProfileForm,\n" +
	// **READ OFF THE DRAWING, NOT OFF THE VARIABLE.** A candidate nothing paints is invisible to
	// the user, which is the same defect as no candidate at all. These two count the polylines the
	// map layer actually holds, split by which of the two strokes they wear.
	"\t\tmapSolid: function () {\n" +
	"\t\t\tif (!profilePathLayer) { return []; }\n" +
	"\t\t\treturn (profilePathLayer.children || []).filter(function (c) {\n" +
	"\t\t\t\treturn c.tagName === 'POLYLINE' && !c.getAttribute('stroke-dasharray'); });\n" +
	"\t\t},\n" +
	"\t\tmapGhost: function () {\n" +
	"\t\t\tif (!profilePathLayer) { return []; }\n" +
	"\t\t\treturn (profilePathLayer.children || []).filter(function (c) {\n" +
	"\t\t\t\treturn c.tagName === 'POLYLINE' && !!c.getAttribute('stroke-dasharray'); });\n" +
	"\t\t},\n" +
	// Off the ELEMENT the panel built, not off profileState.draw.say -- a commentary the page never
	// writes into the DOM is a commentary the user never reads.
	"\t\tsayText: function () { return profileSayEl ? profileSayEl.textContent : null; },\n" +
	// The panel's own controls, found by walking the tree the page built. A descendant walk rather
	// than querySelectorAll(): the point is to read the elements rebuildProfileForm() really
	// appended, and the harness must not depend on a selector engine to say so.
	"\t\tpanelEls: function (tag) {\n" +
	"\t\t\tvar out = [], box = document.getElementById('lpn_profile_form');\n" +
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
	"\t\t\tselection = null;\n" +
	"\t\t\tprofileState = { from: '', to: '', waypoints: [], draw: null };\n" +
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

function hit(dataset) { return { dataset: dataset, classList: { contains: () => false } }; }
const EMPTY = hit({});

function fire(type, ev) {
	setHitTarget(ev.target && ev.target.dataset ? ev.target : null);
	(svg._listeners[type] || []).forEach(fn => fn(ev));
}
// A CLICK: down and up at the same point, which is what the 4px tap threshold calls a tap.
function click(x, y, target) {
	const t = target || EMPTY;
	fire('pointerdown', { pointerId: 1, clientX: x, clientY: y, target: t, button: 0 });
	fire('pointerup', { pointerId: 1, clientX: x, clientY: y, target: t });
}
// A HOVER: one pointermove with no pointer registered, which is what a browser sends when nothing
// is pressed. Nothing else in the page acts on it.
function hover(x, y) {
	setHitTarget(null);
	(svg._listeners.pointermove || []).forEach(fn => fn({ pointerId: 0, clientX: x, clientY: y, target: EMPTY }));
}
// A DOUBLE-CLICK exactly as the browser delivers it: two full taps, THEN the dblclick event. Doing
// only the dblclick would hide defect 5 entirely.
function dblclick(x, y, target) {
	click(x, y, target);
	click(x, y, target);
	fire('dblclick', { clientX: x, clientY: y, target: target || EMPTY, preventDefault: function () {} });
}
let escPrevented = 0;
function pressEscape() {
	escPrevented = 0;
	keydownListeners.forEach(fn => fn({
		key: 'Escape',
		preventDefault: function () {},
		stopPropagation: function () { escPrevented++; }
	}));
}

// ---- the fixture ------------------------------------------------------------------------------
//
// A DIAMOND, so there are two genuinely different routes from A to D and they differ in LENGTH,
// not in hop count -- the only shape in which "the route bent through my waypoint" and "the route
// was going that way anyway" are different sentences:
//
//      B --- B2        the SHORT way: 50 + 25 + 25 = 100, over THREE links
//     /        \
//    A          D      plus E, connected to nothing at all
//     \        /
//        C            the LONG way: 400 + 400 = 800, over TWO links
//
// **THE SHORT ROUTE HAS MORE HOPS AND IS LONGER ON THE MAP.** Both of those are on purpose, and
// they are what makes this fixture able to fail: a router counting hops picks A-C-D (2 rather than
// 3), and a router measuring the drawing picks A-C-D too (447 rather than 465). Only a router
// weighting by LINK LENGTH picks A-B-B2-D, which is the rule this feature claims to use.
//
// screenToWorld() at the default identity view maps client x/y straight through, so a node placed
// at world (x, y) is hovered at client (x, y). setZoom is deliberately never touched: this harness
// has no business depending on the view, and the ONE quantity it needs from it -- that
// nearestNodeNearScreen() measures in SCREEN pixels -- holds at any scale.
const P = { A: [0, 0], B: [200, -100], B2: [300, -100], C: [200, 100], D: [400, 0], E: [900, 900] };
function build() {
	L.reset();
	L.wirePointerEvents();
	L.setMode('select');
	const id = {};
	Object.keys(P).forEach(function (k) { id[k] = L.addNode('junction', P[k][0], P[k][1]).id; });
	// A hand-entered length on every pipe, because the ROUTING RULE is link length and the map
	// distance disagrees with it on purpose -- see the sketch above.
	// lenAuto OFF and the length typed in, which is what a user does when the drawing is a sketch and
	// the pipe is the length the survey says. This is the whole reason map distance and link length
	// disagree in this fixture.
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
	return { id: id, links: links };
}
function X(k) { return P[k][0]; }
function Y(k) { return P[k][1]; }
function drawButton() {
	return L.panelEls('button').filter(function (b) {
		return String(b.className || '').indexOf('lpn-profile-draw') === 0;
	})[0] || null;
}
function selectCount() { return L.panelEls('select').length; }
// Pressing the button through ITS OWN listener, which is the only handler a real click would reach.
function startDraw() {
	const b = drawButton();
	(b._listeners.click || []).forEach(function (fn) { fn({ preventDefault: function () {} }); });
}

// ---- 1. the gesture, end to end ---------------------------------------------------------------
{
	console.log('\n--- click, hover, click, double-click ---');
	const n = build();
	ok('the panel offers the chooser button', !!drawButton(),
		drawButton() ? JSON.stringify(drawButton().textContent) : '');

	startDraw();
	ok('pressing it arms the gesture', !!L.profileState().draw);
	ok('...and the panel says what the first click does',
		/starts/.test(L.sayText() || ''), JSON.stringify(L.sayText()));
	ok('...and the From/To pull-downs are out of the way while it runs',
		selectCount() === 0, selectCount() + ' selects');

	// FIRST CLICK: the node the path starts at.
	click(X('A'), Y('A'), hit({ node: n.id.A }));
	same(L.profileStops(), [n.id.A], 'the first click sets the start node and nothing else');
	ok('...and the prompt moves on to the rest of the gesture',
		/[Dd]ouble-click/.test(L.sayText() || ''), JSON.stringify(L.sayText()));

	// HOVER: the candidate a click WOULD commit, before committing it. This is the assertion the
	// whole task turns on.
	hover(X('D'), Y('D'));
	ok('hovering the far node draws a CANDIDATE on the map', L.mapGhost().length === 3,
		L.mapGhost().length + ' dashed polylines');
	ok('...and nothing is committed by a hover', L.profileStops().length === 1);
	ok('...and no committed leg is drawn yet either', L.mapSolid().length === 0);

	// The candidate must FOLLOW the pointer, not merely exist. Moving onto the long branch's own
	// node is a different route (one link, not two) and must redraw as one.
	hover(X('C'), Y('C'));
	ok('moving the pointer to another branch changes the candidate', L.mapGhost().length === 1,
		L.mapGhost().length + ' dashed polylines');
	hover(700, 700);
	ok('moving the pointer off every node clears the candidate', L.mapGhost().length === 0);

	// SECOND CLICK: a waypoint. C is on the LONG branch, so committing it must bend the route.
	hover(X('C'), Y('C'));
	click(X('C'), Y('C'), hit({ node: n.id.C }));
	same(L.profileStops(), [n.id.A, n.id.C], 'a click commits the hovered node as a stop');
	ok('...and the committed leg is drawn solid on the map', L.mapSolid().length === 1,
		L.mapSolid().length + ' solid polylines');
	ok('...and the candidate is gone until the pointer moves again', L.mapGhost().length === 0);

	// DOUBLE-CLICK: ends it. Both taps land on D; the second must not double the stop.
	dblclick(X('D'), Y('D'), hit({ node: n.id.D }));
	ok('a double-click ends the gesture', !L.profileState().draw);
	same(L.profileStops(), [n.id.A, n.id.C, n.id.D],
		'...and the double-clicked node is the last stop, exactly once');
	const path = L.profilePath();
	same(path.nodes, [n.id.A, n.id.C, n.id.D],
		'THE COMMITTED ROUTE RUNS THROUGH THE WAYPOINT, not down the shorter branch');
	same(path.links, [n.links.AC, n.links.CD], '...over the links that waypoint implies');
	ok('...with the length those links add up to', path.length === 800, path.length);
	ok('the committed stops become from / waypoints / to',
		L.profileState().from === n.id.A && L.profileState().to === n.id.D &&
		JSON.stringify(L.profileState().waypoints) === JSON.stringify([n.id.C]),
		JSON.stringify(L.profileState()));
	ok('no candidate is left on the map afterwards', L.mapGhost().length === 0);
	ok('...and the pull-downs come back', selectCount() === 2, selectCount() + ' selects');
}

// ---- 2. the ROUTING RULE, and what it is not --------------------------------------------------
{
	console.log('\n--- shortest by link length, through the active graph ---');
	const n = build();
	startDraw();
	click(X('A'), Y('A'), hit({ node: n.id.A }));
	dblclick(X('D'), Y('D'), hit({ node: n.id.D }));
	const path = L.profilePath();
	same(path.nodes, [n.id.A, n.id.B, n.id.B2, n.id.D],
		'with no waypoint the route is the SHORTEST BY LENGTH, not by hops or by map distance');
	ok('...and its length is the short branch total', path.length === 100, path.length);
}

// ---- 3. an unreachable stop is refused, and named ---------------------------------------------
{
	console.log('\n--- no route: say so, do not swallow it ---');
	const n = build();
	startDraw();
	click(X('A'), Y('A'), hit({ node: n.id.A }));

	hover(X('E'), Y('E'));
	ok('hovering an unreachable node draws NO candidate', L.mapGhost().length === 0);
	ok('...and the panel names both ends of the leg that has no route',
		(L.sayText() || '').indexOf(n.id.A) >= 0 && (L.sayText() || '').indexOf(n.id.E) >= 0,
		JSON.stringify(L.sayText()));

	click(X('E'), Y('E'), hit({ node: n.id.E }));
	same(L.profileStops(), [n.id.A], 'clicking it does NOT add it to the path');
	ok('...the gesture is still running, so the user can aim somewhere else',
		!!L.profileState().draw);
	ok('...and the refusal is still on screen',
		(L.sayText() || '').indexOf(n.id.E) >= 0, JSON.stringify(L.sayText()));

	// And the recovery: a reachable node still works after the refusal.
	click(X('D'), Y('D'), hit({ node: n.id.D }));
	same(L.profileStops(), [n.id.A, n.id.D], 'a reachable node still commits after a refused one');
}

// ---- 4. Escape cancels, and the route already displayed comes back ----------------------------
{
	console.log('\n--- Escape restores the route that was there ---');
	const n = build();

	// Commit a route the ordinary way first, so there is something real to lose.
	startDraw();
	click(X('A'), Y('A'), hit({ node: n.id.A }));
	click(X('C'), Y('C'), hit({ node: n.id.C }));
	dblclick(X('D'), Y('D'), hit({ node: n.id.D }));
	const before = JSON.stringify(L.profileStops());
	const beforePath = JSON.stringify(L.profilePath().links);
	ok('a route is displayed to begin with', L.mapSolid().length === 2, before);

	// Now half-draw a different one and abandon it.
	startDraw();
	click(X('D'), Y('D'), hit({ node: n.id.D }));
	hover(X('B'), Y('B'));
	ok('the half-drawn path has replaced it on screen', L.mapSolid().length === 0,
		JSON.stringify(L.profileStops()));
	ok('...and a candidate is showing', L.mapGhost().length > 0);

	pressEscape();
	ok('Escape ends the gesture', !L.profileState().draw);
	ok('the key press was consumed, so no menu also closes', escPrevented === 1, escPrevented);
	same(L.profileStops(), JSON.parse(before), 'THE ROUTE THAT WAS DISPLAYED IS BACK, stop for stop');
	same(L.profilePath().links, JSON.parse(beforePath), '...and it routes over the same links');
	ok('...and it is drawn on the map again', L.mapSolid().length === 2);
	ok('...with no candidate left over', L.mapGhost().length === 0);

	// Escape BEFORE the first click must be just as harmless.
	startDraw();
	pressEscape();
	same(L.profileStops(), JSON.parse(before), 'Escape before the first click costs nothing either');
}

// ---- 5. the chooser gets out of the map's way when it is not running --------------------------
{
	console.log('\n--- an unarmed chooser is invisible to the map ---');
	const n = build();
	const stops0 = JSON.stringify(L.profileStops());
	hover(X('B'), Y('B'));
	ok('a hover with the chooser unarmed draws no candidate', L.mapGhost().length === 0);
	click(X('B'), Y('B'), hit({ node: n.id.B }));
	same(L.profileStops(), JSON.parse(stops0), 'a plain map click does not edit the path');

	// And closing the panel disarms it, rather than leaving a live gesture under a closed pane.
	startDraw();
	click(X('A'), Y('A'), hit({ node: n.id.A }));
	L.closePane();
	ok('closing the pane abandons a half-drawn path', !L.profileState().draw);
	same(L.profileStops(), JSON.parse(stops0), '...and restores what was displayed');
}

console.log('\n' + (fails ? `FAILED ${fails} of ${checks}` : `All ${checks} checks passed.`));
process.exit(fails ? 1 : 0);
