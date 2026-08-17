// Label priority, the drop-direction table, and the local feature context (ROADMAP Task 397).
// Run with:
//   node dev/lpn-spike/label-priority-harness.js
//
// WHY THIS EXISTS. Task 397 is Phase 0 of the label paradigm in dev/label-placement-goals.md: it
// ships STATE and a CONTROL and changes no placement behaviour at all. That is exactly the shape of
// change nothing catches. Nobody can see a wrong priority default on the map, because in Phase 0
// nothing reads it yet; by the time Phase 1 reads it, a wrong number looks like a bad placement
// algorithm rather than like a bad table.
//
// What can break quietly:
//   1. THE DEFAULTS ARE AN ORDER, NOT A SET. Tom gave two ordered lists on 2026-08-16, and a rank
//      that is merely present but in the wrong place produces a drawing that drops the wrong things
//      while every number in the panel still looks plausible. So the assertions are on the ORDER
//      recovered by sorting, never on a count or on membership.
//   2. THE TWO COLUMNS ORDER DIFFERENT THINGS. A link rank orders ROWS INSIDE one label; a node
//      rank orders LABELS AGAINST EACH OTHER. They share a control, so the day someone "unifies"
//      them the tests below are what says they were never the same quantity.
//   3. THE DIRECTIONS ARE COMPILED IN, and one of them was corrected the day it was written --
//      elevation went from 'extreme' to 'like'. The two disagree exactly on a flat network with one
//      hill, which is the case the rule exists for, so the table is asserted by name.
//   4. THE CONTEXT MUST NOT MOVE WITH THE VIEW. It is the whole reason the record exists. A
//      bearing is scale-invariant and a distance is not, so the test is a ZOOM: change the scale,
//      rebuild, and demand the same answer to the bit. This is the assertion that a future
//      "optimisation" reintroducing a pixel measurement will trip.
//   5. A ZERO-LENGTH LINK MUST NOT OCCUPY A DIRECTION. atan2(0, 0) is 0, which reads as "east is
//      taken" at a node where nothing is -- and it is silent, because a real east-going pipe looks
//      identical in the data.

const assert = require('assert');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const Geom = require(ROOT + 'js/lpn-geom.js').lpnGeom;

let checks = 0;
function ok(cond, what) { assert.ok(cond, what); checks++; }
function eq(a, b, what) { assert.deepStrictEqual(a, b, what); checks++; }

// ---- 1. the pure geometry, with no page at all --------------------------------------------------

// angularGap wraps, is symmetric, and never exceeds 180.
eq(Geom.angularGap(10, 350), 20, 'angularGap wraps across zero');
eq(Geom.angularGap(350, 10), 20, 'angularGap is symmetric');
eq(Geom.angularGap(-45, 315), 0, 'angularGap treats -45 and 315 as one direction');
eq(Geom.angularGap(0, 180), 180, 'opposite bearings are 180 apart');
ok([0, 37, 90, 181, 359, -720].every(function (a) {
	return [0, 12, 200, -95].every(function (b) {
		var g = Geom.angularGap(a, b);
		return g >= 0 && g <= 180 && Math.abs(g - Geom.angularGap(b, a)) < 1e-9;
	});
}), 'angularGap is in [0,180] and symmetric everywhere');

// Openness is the angle to the NEAREST occupied bearing, and an empty node is maximally open.
eq(Geom.directionOpenness([], -45), 180, 'nothing occupied means fully open');
eq(Geom.directionOpenness([0], 0), 0, 'a direction straight down a pipe is fully blocked');
eq(Geom.directionOpenness([0, 90], -45), 45, 'openness reads the nearest occupier, not the first');

// The incumbent wins ties and narrow contests. This is the property that keeps a drawing's labels
// on one side of their nodes instead of scattering for differences nobody can see.
const SIDES = [-45, 225];   // up-right, then up-left: what nodeLabelSideBearings() produces
eq(Geom.mostOpenDirection([], SIDES, 1.35), 0, 'an unconnected node keeps the preferred side');
eq(Geom.mostOpenDirection([-45], SIDES, 1.35), 1, 'a pipe straight through the preferred side forces the jump');
eq(Geom.mostOpenDirection([-50], SIDES, 1.35), 1, 'a near-miss on the preferred side still loses to a clear one');
// 90 degrees away from side 0 and 135 from side 1: side 1 is better by 1.5x, which clears 1.35.
eq(Geom.mostOpenDirection([45], SIDES, 1.35), 1, 'a clearly better side wins');
// A pipe near the BISECTOR of the two sides is the case the margin exists for: at -85 the gaps are
// 40 and 50, so the far side is only 1.25x better -- inside the margin, and the incumbent holds.
eq(Geom.mostOpenDirection([-85], SIDES, 1.35), 0, 'a narrow win does not move the label');
eq(Geom.mostOpenDirection([-85], SIDES, 1), 1, 'margin 1 is a plain argmax');
eq(Geom.mostOpenDirection([-90], SIDES, 1.35), 0, 'a pipe on the bisector is a dead tie and holds');

// ---- 2. the page: defaults, the table, and the context ------------------------------------------

const L = loadLoopedNetwork(
	"\t\tdrawExample: drawExampleNetwork, refreshLabelText: refreshLabelText,\n" +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tdefaultLabelSettings: defaultLabelSettings,\n" +
	"\t\tdropRule: function () { return LPN_NODE_DROP_RULE; },\n" +
	"\t\tsideBearings: nodeLabelSideBearings,\n" +
	"\t\tcontextFor: nodeContextFor,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, runSolve: runSolve,\n" +
	// The layer stack the page normally builds in init(). Same minimal set the other label
	// harnesses raise, and for the same reason: nothing here reads the SVG, but buildNodeEls()
	// appends to it, so it has to exist.
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tsetScale: function (s) { state.s = s; },\n" +
	"\t\tgetScale: function () { return state.s; }"
);

// Rank order recovered by SORTING, so the test says what Tom said -- an order -- rather than
// pinning the particular integers, which are free to be renumbered.
function orderOf(map) {
	return Object.keys(map).sort(function (a, b) { return map[a] - map[b]; });
}

const def = L.defaultLabelSettings();

// Tom, 2026-08-16, verbatim: "Link (drop last first): q flow, v velocity, H head loss, s gradient,
// d diameter, C roughness, Km local losses" -- plus `id` at the head, which never sheds because it
// is the key every other number on the label is attributed by, and `length` placed with the other
// inputs before roughness on his ruling the same day.
eq(orderOf(def.priority.link),
	['id', 'flow', 'velocity', 'headloss', 'gradient', 'diameter', 'length', 'roughness', 'km'],
	'link shed order is Tom\'s list, id first and km last');

// Tom's node list read LAST FIRST, which is how he wrote it: "use last first if on".
eq(orderOf(def.priority.node), ['demand', 'pressure', 'elev', 'head'],
	'node drop order is demand, pressure, elevation, head');

// The two columns are not the same axis and must not converge on one list.
ok(orderOf(def.priority.node).length !== orderOf(def.priority.link).length,
	'node and link priority maps are separate lists');
ok(def.priority.node.id === undefined,
	'a node ID carries no rank: an ID is never the reason one label beats another');
eq(def.priority.link.id, 0, 'a link ID is rank 0 and never sheds');

// Every ranked field is a real field, and every numeric field is ranked. A rank on a field that
// does not exist is invisible; a field with no rank is undefined in a comparator, which is not a
// mild defect but a non-total order.
Object.keys(def.priority.node).forEach(function (k) {
	ok(def.node[k] !== undefined, 'node priority ' + k + ' names a real label field');
});
Object.keys(def.priority.link).forEach(function (k) {
	ok(def.link[k] !== undefined, 'link priority ' + k + ' names a real label field');
});
Object.keys(def.decimals.node).forEach(function (k) {
	ok(def.priority.node[k] !== undefined, 'numeric node field ' + k + ' carries a rank');
});
Object.keys(def.decimals.link).forEach(function (k) {
	ok(def.priority.link[k] !== undefined, 'numeric link field ' + k + ' carries a rank');
});

// The compiled directions. Asserted by name because they are not user-settable and because
// elevation's was corrected on the day it was written.
eq(L.dropRule(), { demand: 'low', pressure: 'extreme', elev: 'like', head: 'like' },
	'drop directions: demand lowest, pressure least extreme, elevation and head most like neighbours');
Object.keys(L.dropRule()).forEach(function (k) {
	ok(def.priority.node[k] !== undefined, 'every drop rule ' + k + ' has a rank to be consulted in');
});

// The two side bearings come from DEFAULT_LABEL_OFFSET rather than being restated, so the preferred
// one is up-and-right -- Imhof's own first choice, and where an untouched label already sits.
const sides = L.sideBearings();
eq(sides.length, 2, 'a node label has exactly two sides in Phase 1');
ok(sides[0] > -90 && sides[0] < 0, 'the preferred side is up and to the right');
eq(Geom.angularGap(sides[0], sides[1]), 90, 'the two sides are mirrored about vertical');

// ---- 3. the context on a real network -----------------------------------------------------------

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
L.drawExample();
L.runSolve();
L.refreshLabelText();

const doc = L.getDoc();
ok(doc.nodes.length > 0, 'the example network has nodes to build a context from');
doc.nodes.forEach(function (n) {
	ok(L.contextFor(n.id), 'every node has a context record: ' + n.id);
});

// A context's openSide is an INDEX into the two sides, not a point -- a point would be a world
// coordinate and would need recomputing at every zoom, which is what this record exists to avoid.
doc.nodes.forEach(function (n) {
	const c = L.contextFor(n.id);
	ok(c.openSide === 0 || c.openSide === 1, 'openSide is a side index: ' + n.id);
	ok(Array.isArray(c.bearings), 'bearings is an array: ' + n.id);
	ok(c.bearings.every(function (b) { return isFinite(b); }), 'no NaN bearing at ' + n.id);
});

// THE ASSERTION THE WHOLE DESIGN RESTS ON: rebuild at a different zoom and nothing moves. Every
// label dimension on this page is a pixel figure divided by the scale, so anything measured in
// world distance would differ here. Bearings do not.
function contextSnapshot() {
	return doc.nodes.map(function (n) {
		const c = L.contextFor(n.id);
		return [n.id, c.openSide, c.bearings.join(','), c.demand, c.pressure, c.elev, c.head,
			c.nbrElev, c.nbrHead].join('|');
	}).join('\n');
}
const atOne = contextSnapshot();
L.setScale(L.getScale() * 4);
L.refreshLabelText();
eq(contextSnapshot(), atOne, 'the local feature context is identical after a 4x zoom');
L.setScale(L.getScale() / 16);
L.refreshLabelText();
eq(contextSnapshot(), atOne, 'the local feature context is identical after zooming out again');

// The neighbour means really do read the TOPOLOGY: a node with no incident link has nothing to be
// like, and undefined is the honest answer rather than a fabricated zero.
const isolated = doc.nodes.filter(function (n) {
	return !doc.links.some(function (l) { return l.from === n.id || l.to === n.id; });
});
isolated.forEach(function (n) {
	const c = L.contextFor(n.id);
	eq(c.nbrHead, undefined, 'an unconnected node has no neighbour head: ' + n.id);
	eq(c.bearings.length, 0, 'an unconnected node occupies no direction: ' + n.id);
	eq(c.openSide, 0, 'an unconnected node keeps the preferred side: ' + n.id);
});

// A connected node's bearings must number its incident links -- minus any zero-length one, which
// has no direction and must not be reported as occupying east.
doc.nodes.forEach(function (n) {
	const incident = doc.links.filter(function (l) { return l.from === n.id || l.to === n.id; });
	const degenerate = incident.filter(function (l) {
		const a = doc.nodes.filter(function (m) { return m.id === l.from; })[0];
		const b = doc.nodes.filter(function (m) { return m.id === l.to; })[0];
		return a && b && !l.verts.length && a.x === b.x && a.y === b.y;
	});
	eq(L.contextFor(n.id).bearings.length, incident.length - degenerate.length,
		'bearings count matches real incident directions at ' + n.id);
});

// A node's own printed values ride along, so the drop comparator never has to reach back into the
// solve. They are the ROUNDED display values, which is what makes a rank agree with the number on
// screen; a raw float would let two labels printing "12.5" rank differently.
const junction = doc.nodes.filter(function (n) { return n.type === 'junction'; })[0];
if (junction) {
	const c = L.contextFor(junction.id);
	ok(typeof c.demand === 'number', 'a junction context carries its demand');
	ok(c.pressure === undefined || typeof c.pressure === 'number', 'pressure is a number or absent');
	ok(c.head === undefined || typeof c.head === 'number', 'head is a number or absent');
}

console.log('label-priority-harness: ' + checks + ' checks passed');

// ---- 4. Phase 1: the first-fit really is a first-fit (ROADMAP Task 398) --------------------------
//
// The pure pass, driven directly, because the page cannot show what it refused to do. Everything
// here is values in and values out -- no DOM, no doc.
const Collide = require(ROOT + 'js/lpn-collide.js').lpnCollide;

function ff(n, spacing, obstacles) {
	// n labels in a row `spacing` apart, each offered right-then-left at +-20, boxes 40x12.
	const labels = [];
	for (let i = 0; i < n; i++) {
		const x = i * spacing;
		labels.push({
			id: 'n' + i, anchor: { x: x, y: 0 }, home: { x: x + 20, y: -20 },
			dragged: false, priority: i, w: 40, h: 12, yOff: 0,
			sides: [{ x: x + 20, y: -20 }, { x: x - 20, y: -20 }]
		});
	}
	return { labels: labels, out: Collide.placeLabelsFirstFit(labels, obstacles || { boxes: [], segments: [] }, {}) };
}

// Wide apart: everybody gets their preferred side and nothing is dropped.
let r = ff(5, 400);
eq(r.out.filter(function (o) { return o.dropped; }).length, 0, 'an uncrowded row drops nothing');
eq(r.out.map(function (o) { return o.side; }), [0, 0, 0, 0, 0], 'an uncrowded row keeps the preferred side');

// Every placement is one of the two offered ENDPOINTS, to the bit. This is the assertion that says
// the pass really has two candidates and is not quietly searching.
// Spacing 12 against a 40-wide box: tight enough that neither side can hold everyone, which is what
// makes the drop reachable at all. (At 45 the boxes clear each other and nothing drops -- worth
// knowing, because a "crowded" fixture that is not crowded asserts nothing.)
r = ff(12, 12);
r.out.forEach(function (o) {
	if (o.dropped) { return; }
	const lbl = r.labels.filter(function (l) { return l.id === o.id; })[0];
	ok(lbl.sides.some(function (s) { return s.x === o.x && s.y === o.y; }),
		'placement ' + o.id + ' is exactly one of its two sides');
});

// Crowd it and something has to give -- and what gives is the WORSE PRIORITY. The strong form, not
// the vacuous one: for a dropped label, EVERY side must really have been occupied, and every
// occupier must outrank it. "The dropped one had a worse rank" would be true by construction and
// would test nothing.
const placedBoxes = r.out.filter(function (o) { return o.box; });
ok(r.out.some(function (o) { return o.dropped; }), 'a crowded row drops something');
r.out.filter(function (o) { return o.dropped; }).forEach(function (d) {
	const lbl = r.labels.filter(function (l) { return l.id === d.id; })[0];
	lbl.sides.forEach(function (s, si) {
		const b = Collide.labelBoxAtEnd(lbl, s);
		const hits = placedBoxes.filter(function (p) { return Collide.boxOverlapDepth(b, p.box) > 0; });
		ok(hits.length > 0, d.id + ' side ' + si + ' was really occupied when it was refused');
		// **A BETTER-RANKED LABEL MUST BE AMONG THE OCCUPIERS -- not all of them.** The stronger
		// form ("every occupier outranks it") is FALSE, and the reason is worth knowing rather than
		// asserting away: placement runs in rank order, so a label is refused by whoever is already
		// down, and labels placed AFTERWARDS may end up overlapping the side it was refused. That
		// is inherent to a first approximation and is exactly what a repair phase exists to mop up
		// (Task 400). It is not a wrong drop -- the later label sits at its own node, not in the
		// spot this one wanted -- but the final picture cannot be read as if order did not exist.
		ok(hits.some(function (h) {
			const other = r.labels.filter(function (l) { return l.id === h.id; })[0];
			return other.priority < lbl.priority;
		}), d.id + ' was refused by a label that outranks it');
	});
});

// SOUNDNESS: nothing that was placed overlaps anything else that was placed. This is what earns the
// right to drop at all -- a pass that drops AND still overlaps has given up nothing for nothing.
for (let i = 0; i < placedBoxes.length; i++) {
	for (let j = i + 1; j < placedBoxes.length; j++) {
		eq(Collide.boxOverlapDepth(placedBoxes[i].box, placedBoxes[j].box), 0,
			'placed labels do not overlap: ' + placedBoxes[i].id + ' vs ' + placedBoxes[j].id);
	}
}

// IDEMPOTENT AND NON-MUTATING, the same two properties placeLabels() carries. A pass that scribbles
// on its inputs cannot be run twice on the same data to check that it agrees with itself, which is
// the cheapest strong assertion there is.
const again = Collide.placeLabelsFirstFit(r.labels, { boxes: [], segments: [] }, {});
eq(JSON.stringify(again), JSON.stringify(r.out), 'the first-fit is idempotent');

// MONOTONE IN CROWDING: more room can never drop more labels.
let prev = Infinity;
[10, 12, 20, 45, 400].forEach(function (sp) {
	const d = ff(12, sp).out.filter(function (o) { return o.dropped; }).length;
	ok(d <= prev, 'drop count does not rise as spacing grows (' + sp + ': ' + d + ')');
	prev = d;
});

// A DRAGGED LABEL IS NEVER DROPPED AND NEVER JUMPS. The user put it there; goal 1 outranks all of
// this. Placed inside a wall of obstacles it would otherwise lose to.
const wall = { boxes: [Collide.box(0, 0, 400, 400, 0, 'label', 'other')], segments: [] };
const dragged = [{ id: 'd', anchor: { x: 0, y: 0 }, home: { x: 20, y: -20 }, dragged: true,
	priority: 99, w: 40, h: 12, yOff: 0, sides: [{ x: 20, y: -20 }, { x: -20, y: -20 }] }];
const dr = Collide.placeLabelsFirstFit(dragged, wall, {});
eq(dr[0].dropped, false, 'a dragged label survives a wall of obstacles');
eq(dr[0].side, 0, 'a dragged label does not jump sides');

// A LINK IS A SOFT OBSTACLE AND A LEADER IS A HARD ONE. This is the rank ladder read as a partition,
// and it is the thing a future "treat every obstacle alike" tidy-up would silently break.
const onPipe = Collide.placeLabelsFirstFit(
	[{ id: 'a', anchor: { x: 0, y: 0 }, home: { x: 20, y: -20 }, dragged: false, priority: 0,
		w: 40, h: 12, yOff: 0, sides: [{ x: 20, y: -20 }, { x: -20, y: -20 }] }],
	{ boxes: [], segments: [{ ax: -200, ay: -20, bx: 200, by: -20, kind: 'link' }] }, {});
eq(onPipe[0].dropped, false, 'a label may sit on a pipe and still win');
const onLeader = Collide.placeLabelsFirstFit(
	[{ id: 'a', anchor: { x: 0, y: 0 }, home: { x: 20, y: -20 }, dragged: false, priority: 0,
		w: 40, h: 12, yOff: 0, sides: [{ x: 20, y: -20 }, { x: -20, y: -20 }] }],
	{ boxes: [], segments: [{ ax: -200, ay: -20, bx: 200, by: -20, kind: 'leader' }] }, {});
eq(onLeader[0].dropped, true, 'a label may not sit on a leader');

console.log('label-priority-harness: phase 1 section passed');
