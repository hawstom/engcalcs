// The open-angle table: four cardinal corners, pruned by exact arcs (ROADMAP Task 411).
// Run with:
//   node dev/lpn-spike/open-angle-harness.js
//
// WHY THIS EXISTS. The table is a REJECTION test -- it decides which of the four fixed corners a
// label never even tries -- and every way it can be wrong looks like a taste problem on screen. A
// corner wrongly rejected shows up as a label on the far side of its node, which is a legal place
// for a label to be; a corner wrongly kept shows up as a label with a pipe through it, which is
// indistinguishable from ordinary congestion. Neither reads as "the table is broken".
//
// What can break quietly:
//   1. THE QUADRANTS ARE y-DOWN. Bearings come from atan2(dy, dx) with y increasing downward, so
//      TOP-right is 270-360 and not 0-90. Writing the table in school-maths quadrants is a
//      quarter-turn error that still rejects exactly one corner per link, so counts stay plausible
//      and only the position is wrong. Every assertion below therefore derives its bearings from
//      real NEIGHBOUR COORDINATES rather than from typed degrees -- that is the coupling a stub
//      would remove.
//   2. THE ORDER IS THE DESIGN. TR, TL, BR, BL, and pruning must preserve it: the order is what
//      makes the first-fit's "first clear side wins" mean Imhof's preference.
//   3. THE TOLERANCE IS THE TUNABLE THAT DECIDES WHETHER ANY OF THIS WORKS, and it must be read
//      LIVE out of ANGLE_TUNING. A copy taken at load time would leave the tester panel's knob
//      connected to nothing while every number in the panel still looked right.
//   4. SECTORS ARE EXACT ARCS. A 183-degree opening is one arc; bucketing into wedges would report
//      it as several, and the raster would then sample a fraction of the space that is really open.
//   5. PRUNING MUST NOT EMPTY THE SET. A node with pipes into all four quadrants would otherwise
//      never be labelled at all, which is a far worse defect than a tight label.
//   6. THE PASS STAYS IDEMPOTENT. placeLabelsFirstFit() promises the answer is a function of its
//      inputs alone; feeding it a generated side list must not introduce carried state.

const assert = require('assert');
const path = require('path');
const C = require(path.join(__dirname, '..', '..', 'js', 'lpn-collide.js')).lpnCollide;

let checks = 0;
function ok(name, cond, extra) {
	assert.ok(cond, name + (extra ? '  [' + extra + ']' : ''));
	checks++;
}
function eq(name, a, b, extra) {
	assert.deepStrictEqual(a, b, name + (extra ? '  [' + extra + ']' : ''));
	checks++;
}

const ORDER = C.CORNERS.map(function (c) { return c.name; });
eq('the attempt order is TR, TL, BR, BL', ORDER, ['TR', 'TL', 'BR', 'BL']);

// Bearings the way the editor makes them: from one node to its neighbours, y down.
function bearingsFrom(node, neighbours) {
	return neighbours.map(function (n) {
		return Math.atan2(n.y - node.y, n.x - node.x) * 180 / Math.PI;
	});
}
function names(list) { return list.map(function (i) { return C.CORNERS[i].name; }); }
function cornersFor(node, neighbours, tol) {
	return names(C.openCorners(C.openArcs(bearingsFrom(node, neighbours)), tol));
}

// ---- 1. a corner with a link arriving through it is rejected, and only that corner -------------
//
// One neighbour per quadrant, placed by COORDINATE, well inside the quadrant so no tolerance
// argument can reach it. Screen axes: y grows downward, so a neighbour ABOVE has the smaller y.
const HUB = { x: 100, y: 100 };
const THROUGH = {
	TR: { x: 140, y: 60 },     // up and to the right
	TL: { x: 60, y: 60 },      // up and to the left
	BR: { x: 140, y: 140 },    // down and to the right
	BL: { x: 60, y: 140 }      // down and to the left
};
Object.keys(THROUGH).forEach(function (name) {
	const got = cornersFor(HUB, [THROUGH[name]]);
	ok('a link through ' + name + ' rejects ' + name,
		got.indexOf(name) === -1, 'survivors ' + got.join(','));
	eq('a link through ' + name + ' rejects nothing else', got.length, 3, got.join(','));
});

// ---- 2. a clear arc is taken, and the order survives the pruning -------------------------------
eq('a node with no links keeps all four, in order',
	cornersFor(HUB, []), ['TR', 'TL', 'BR', 'BL']);
eq('one link up-right leaves the other three IN ORDER',
	cornersFor(HUB, [THROUGH.TR]), ['TL', 'BR', 'BL']);
eq('links up-right and down-left leave TL then BR, in that order',
	cornersFor(HUB, [THROUGH.TR, THROUGH.BL]), ['TL', 'BR']);
// The preferred corner is still first whenever it is legal -- Imhof's order is not a weight that
// something emptier can outrank later, it is the attempt order among LEGAL candidates.
eq('TR is still tried first when TR is clear',
	cornersFor(HUB, [THROUGH.BL, THROUGH.BR])[0], 'TR');

// ---- 3. an orthogonal link sits on a quadrant BOUNDARY and blocks neither neighbour ------------
//
// This is the load-bearing constraint the four positions exist for: each label is contained in its
// own quadrant, so a link arriving due east passes between the bottom-right and top-right labels.
['east', 'west', 'north', 'south'].forEach(function (dir, i) {
	const d = [{ x: 200, y: 100 }, { x: 0, y: 100 }, { x: 100, y: 0 }, { x: 100, y: 200 }][i];
	eq('an exactly ' + dir + ' link rejects no corner',
		cornersFor(HUB, [d]).length, 4);
});

// ---- 4. the tolerance changes which corners survive --------------------------------------------
//
// A link 5 degrees off due north: inside the top-right quadrant, but only just. A tolerance wider
// than 5 shaves that sliver off the quadrant and TR survives; a narrower one does not.
const NEAR_NORTH = { x: 100 + Math.sin(5 * Math.PI / 180) * 50, y: 100 - Math.cos(5 * Math.PI / 180) * 50 };
ok('at tol 2 a link 5 degrees inside TR rejects TR',
	cornersFor(HUB, [NEAR_NORTH], 2).indexOf('TR') === -1);
ok('at tol 10 the same link leaves TR standing',
	cornersFor(HUB, [NEAR_NORTH], 10).indexOf('TR') !== -1);
ok('the two tolerances disagree, which is the point of the knob',
	cornersFor(HUB, [NEAR_NORTH], 2).length !== cornersFor(HUB, [NEAR_NORTH], 10).length);

// A WIDER TOLERANCE NEVER REJECTS MORE. Tolerance only shaves the quadrant, so the surviving set
// grows monotonically with it -- asserted over random networks rather than on one example, because
// a sign error inside the wrap arithmetic shows up only for particular bearings.
let seed = 20260817;
function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
for (let t = 0; t < 300; t++) {
	const nbrs = [];
	for (let i = 0, n = 1 + Math.floor(rnd() * 6); i < n; i++) {
		const a = rnd() * 2 * Math.PI, r = 10 + rnd() * 90;
		nbrs.push({ x: HUB.x + r * Math.cos(a), y: HUB.y + r * Math.sin(a) });
	}
	const arcs = C.openArcs(bearingsFrom(HUB, nbrs));
	const wide = names(C.openCorners(arcs, 20)), narrow = names(C.openCorners(arcs, 1));
	assert.ok(narrow.every(function (n) { return wide.indexOf(n) !== -1; }),
		'a wider tolerance must reject no more than a narrower one: ' + narrow + ' vs ' + wide);
	// Total openness: 360 degrees of circle are accounted for exactly once by the arcs.
	const total = arcs.reduce(function (s, a) { return s + (a.end - a.start); }, 0);
	assert.ok(Math.abs(total - 360) < 1e-9, 'arcs tile the circle: ' + total);
}
checks += 2;

// THE KNOB IS READ LIVE. A copy taken at load time would leave the tester panel connected to
// nothing, and every number in the panel would still look right.
ok('the default tolerance is in Tom\'s 5-10 band',
	C.ANGLE_TUNING.cornerTolerance >= 5 && C.ANGLE_TUNING.cornerTolerance <= 10,
	String(C.ANGLE_TUNING.cornerTolerance));
ok('ANGLE_TUNING is a flat table of numbers, like GOAL_WEIGHT, so a panel row needs no new code',
	Object.keys(C.ANGLE_TUNING).length > 0
	&& Object.keys(C.ANGLE_TUNING).every(function (k) { return typeof C.ANGLE_TUNING[k] === 'number'; }));
const shipped = C.ANGLE_TUNING.cornerTolerance;
C.ANGLE_TUNING.cornerTolerance = 2;
ok('turning the knob changes the answer with no other call',
	cornersFor(HUB, [NEAR_NORTH]).indexOf('TR') === -1);
C.ANGLE_TUNING.cornerTolerance = 10;
ok('and back again', cornersFor(HUB, [NEAR_NORTH]).indexOf('TR') !== -1);
C.ANGLE_TUNING.cornerTolerance = shipped;

// ---- 5. sectors are exact arcs, not wedges ------------------------------------------------------
//
// Two pipes 183 degrees apart. The opening between them is ONE arc of 183 degrees, and the fact it
// is 183 and not 180 or 4x45 is precision we were handed free with the bearings.
const A = { x: 200, y: 100 };                                    // due east, bearing 0
const B = { x: 100 + 100 * Math.cos(183 * Math.PI / 180), y: 100 + 100 * Math.sin(183 * Math.PI / 180) };
const twoArcs = C.openArcs(bearingsFrom(HUB, [A, B]));
eq('two links give exactly two arcs', twoArcs.length, 2);
const widths = twoArcs.map(function (a) { return Math.round((a.end - a.start) * 1e6) / 1e6; }).sort();
ok('a 183 degree opening is ONE arc of 183 degrees, not four wedges',
	Math.abs(widths[1] - 183) < 1e-6 && Math.abs(widths[0] - 177) < 1e-6, widths.join(' + '));
eq('the widest arc is the 183', Math.round(C.widestArc(twoArcs).end - C.widestArc(twoArcs).start), 183);
eq('an unconnected node is one arc of the whole circle', C.openArcs([]), [{ start: 0, end: 360 }]);
eq('two pipes on the SAME bearing block once',
	C.openArcs([30, 30]).length, 1);
ok('openArcs does not touch its argument', (function () {
	const src = [90, 10, 200];
	C.openArcs(src);
	return src.join(',') === '90,10,200';
}()));

// ---- 6. the endpoints, and what "contained in its quadrant" means -------------------------------
const OFFSET = { x: 2, y: -2 };
const sides = C.cardinalSides(HUB, OFFSET, C.openArcs(bearingsFrom(HUB, [THROUGH.TR])));
eq('three corners survive as three endpoints', sides.length, 3);
eq('and they are TL, BR, BL in order', sides.map(function (s) { return C.CORNERS[s.corner].name; }),
	['TL', 'BR', 'BL']);
sides.forEach(function (s) {
	const c = C.CORNERS[s.corner];
	ok(c.name + ' endpoint lies in its own quadrant',
		Math.sign(s.x - HUB.x) === c.sx && Math.sign(s.y - HUB.y) === c.sy,
		s.x + ',' + s.y);
	ok(c.name + ' endpoint is the resting offset away',
		Math.abs(Math.hypot(s.x - HUB.x, s.y - HUB.y) - Math.hypot(OFFSET.x, OFFSET.y)) < 1e-9);
});
// A stored offset signed the other way must give the same four corners: the MAGNITUDE is what the
// table is built from, or the corners would silently rotate with an editor default.
eq('the offset\'s sign does not move the corners',
	C.cardinalSides(HUB, { x: -2, y: 2 }, C.openArcs([])).map(function (s) { return [s.x, s.y]; }),
	C.cardinalSides(HUB, OFFSET, C.openArcs([])).map(function (s) { return [s.x, s.y]; }));

// PRUNING MUST NOT EMPTY THE SET.
const boxedIn = [THROUGH.TR, THROUGH.TL, THROUGH.BR, THROUGH.BL];
eq('a node with a pipe into every quadrant rejects all four',
	cornersFor(HUB, boxedIn).length, 0);
eq('...and still gets all four sides back, in the fixed order',
	C.cardinalSides(HUB, OFFSET, C.openArcs(bearingsFrom(HUB, boxedIn)))
		.map(function (s) { return C.CORNERS[s.corner].name; }),
	['TR', 'TL', 'BR', 'BL']);

// ---- 7. the raster comes AFTER the four, is polar, and stays inside the open sector -------------
const arcsTR = C.openArcs(bearingsFrom(HUB, [THROUGH.TR]));
const withRaster = C.cardinalSides(HUB, OFFSET, arcsTR, { raster: true, outer: 20, max: 12 });
ok('the raster is appended, never interleaved',
	withRaster.slice(0, 3).every(function (s) { return s.corner >= 0; })
	&& withRaster.slice(3).every(function (s) { return s.corner === -1; }),
	withRaster.map(function (s) { return s.corner; }).join(','));
ok('there are raster points at all', withRaster.length > 3);
const arc = C.widestArc(arcsTR), tol = C.ANGLE_TUNING.cornerTolerance;
// Is a bearing inside this arc once the tolerance is shaved off both ends? Written here rather than
// borrowed from the module, so the module cannot agree with itself into a green run.
function inArc(a, deg, t) {
	const d = (((deg - (a.start + t)) % 360) + 360) % 360;
	return d <= (a.end - a.start) - 2 * t + 1e-9;
}
withRaster.slice(3).forEach(function (p) {
	const r = Math.hypot(p.x - HUB.x, p.y - HUB.y);
	ok('a raster point is within outer', r <= 20 + 1e-9, String(r));
	ok('a raster point is no nearer than the resting offset', r >= Math.hypot(OFFSET.x, OFFSET.y) - 1e-9);
	ok('a raster point lies inside the open sector, tolerance included',
		inArc(arc, p.deg, tol), p.deg + ' vs ' + arc.start + '-' + arc.end);
	ok('no raster point is orthogonal', p.deg % 90 !== 0, String(p.deg));
});
// The nearest, most central point comes first: a first-fit that reaches the raster at all should
// meet the shortest leader in the most open direction before anything else.
const first = withRaster[3];
ok('the first raster point is on the innermost radius',
	Math.abs(Math.hypot(first.x - HUB.x, first.y - HUB.y) - Math.hypot(OFFSET.x, OFFSET.y)) < 1e-9);
// POLAR, NOT A SQUARE GRID: every point sits on one of a few radii, and no point falls outside the
// sector -- which is exactly what a rectangular grid would have to discard.
const radii = {};
withRaster.slice(3).forEach(function (p) { radii[Math.round(Math.hypot(p.x - HUB.x, p.y - HUB.y) * 1e6)] = 1; });
ok('raster points share a handful of radii, which is what makes it polar',
	Object.keys(radii).length <= 4, Object.keys(radii).length + ' distinct radii');
eq('no open sector means no raster points',
	C.polarCandidates(HUB, null, 3, 20, {}).length, 0);
// A NARROW SECTOR IS WHERE THE CONTAINMENT ACTUALLY BITES. With one link the open arc is nearly the
// whole circle and any sampling stays inside it by luck; with four links round a 100-degree gap, a
// generator that forgot to shave the tolerance off the ends puts points straight down a pipe. So the
// second fixture is the tight one, and the cap is lifted so the edge angles are actually generated.
const tightBearings = [0, 100, 150, 250];
const tightArcs = C.openArcs(tightBearings);
const tight = C.widestArc(tightArcs);
eq('the widest gap of the tight fixture is the 110 between 250 and 0',
	Math.round(tight.end - tight.start), 110);
const tightPts = C.polarCandidates(HUB, tight, 3, 20, { max: 200, rings: 3 });
ok('the tight sector still yields points', tightPts.length > 6, String(tightPts.length));
tightPts.forEach(function (p) {
	ok('a point in the tight sector clears both pipes by the tolerance',
		inArc(tight, p.deg, tol), p.deg + ' vs ' + tight.start + '-' + tight.end);
});

// ---- 8. the placer still agrees with itself ------------------------------------------------------
//
// IDEMPOTENCE IS THE CHEAPEST STRONG ASSERTION. Generated sides must not introduce carried state:
// the same drawing placed twice has to give the same answer to the bit, and the inputs have to come
// back exactly as they went in.
const nodes = [
	{ id: 'J1', x: 40, y: 40 }, { id: 'J2', x: 90, y: 45 },
	{ id: 'J3', x: 60, y: 95 }, { id: 'J4', x: 130, y: 100 }
];
const links = [['J1', 'J2'], ['J2', 'J4'], ['J1', 'J3'], ['J3', 'J4']];
function neighboursOf(id) {
	const out = [];
	links.forEach(function (l) {
		if (l[0] === id) { out.push(nodes.filter(function (n) { return n.id === l[1]; })[0]); }
		if (l[1] === id) { out.push(nodes.filter(function (n) { return n.id === l[0]; })[0]); }
	});
	return out;
}
const labels = nodes.map(function (n) {
	return {
		id: n.id, anchor: { x: n.x, y: n.y }, home: { x: n.x + 2, y: n.y - 2 },
		w: 18, h: 6, yOff: -5, priority: 0, dragged: false,
		sides: C.cardinalSides({ x: n.x, y: n.y }, OFFSET,
			C.openArcs(bearingsFrom(n, neighboursOf(n.id))), { raster: true, outer: 24 })
	};
});
const obstacles = {
	boxes: nodes.map(function (n) { return C.box(n.x, n.y, 4, 4, 0, 'symbol', null); }),
	segments: links.map(function (l, i) {
		const a = nodes.filter(function (n) { return n.id === l[0]; })[0];
		const b = nodes.filter(function (n) { return n.id === l[1]; })[0];
		return C.segment(a.x, a.y, b.x, b.y, 'link', 'L' + i);
	})
};
const before = JSON.stringify({ labels: labels, obstacles: obstacles });
const first1 = C.placeLabelsFirstFit(labels, obstacles, { pad: 1 });
const again = C.placeLabelsFirstFit(labels, obstacles, { pad: 1 });
eq('placement with generated sides is idempotent, to the bit',
	JSON.stringify(first1), JSON.stringify(again));
eq('the inputs come back exactly as they went in',
	JSON.stringify({ labels: labels, obstacles: obstacles }), before);
ok('every label was placed somewhere', first1.every(function (r) { return !r.dropped; }),
	first1.filter(function (r) { return r.dropped; }).map(function (r) { return r.id; }).join(','));
first1.forEach(function (r) {
	const l = labels.filter(function (x) { return x.id === r.id; })[0];
	ok(r.id + ' was placed at one of its own candidate sides',
		l.sides.some(function (s) { return s.x === r.x && s.y === r.y; }));
	ok(r.id + ' is within reach of its anchor',
		Math.hypot(r.x - l.anchor.x, r.y - l.anchor.y) <= 24 + 1e-9);
});
// `home` is unchanged by any of this: cardinalSides() is a SIDES generator and never touches the
// ring pass, whose own candidate set still contains home by construction.
const ring = C.candidatesFor({ anchor: { x: 0, y: 0 }, home: { x: 3, y: -3 }, dragged: false }, 4, 20);
ok('the ring pass still carries home in its candidate set',
	ring.some(function (c) { return c.x === 3 && c.y === -3; }));

console.log('open-angle-harness: ' + checks + ' checks passed  (tolerance '
	+ C.ANGLE_TUNING.cornerTolerance + ' degrees; corner order ' + ORDER.join(' ') + ')');
