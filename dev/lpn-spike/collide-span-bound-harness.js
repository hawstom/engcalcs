// An obstacle far bigger than the grid was sized for must not be rasterised cell by cell.
// ROADMAP Task 668.
//
//   node dev/lpn-spike/collide-span-bound-harness.js
//
// **THE CRASH THIS STANDS IN FOR IS A REAL ONE AND IT WAS NOT A RENDERING PROBLEM.** Tom,
// 2026-09-15, on the Open-to-new-coordinates wizard: Search by name or Go to froze the page for
// 13-15 s with no indicator, and Chrome then killed the tab on the next pan -- on Elm Street
// Center, EIGHTEEN NODES. It reproduces in node with no DOM at all: 2 GB of heap in 25 s.
//
// The mechanism, measured rather than guessed: `grid()` sizes its cell from the obstacles that
// exist when it is built, but `placeLabels()` PUSHES an obstacle for every label it commits --
// the label's box and its leader. After a georeference settle one committed leader measured
// **25.7 degrees of longitude, about 2,500 km**, against a cell of 0.0222, and span() tried to
// fill 1,158 x 1,182 = 1.37 million cells for that one segment.
//
// **WHY THE BOUND IS TESTED HERE AND NOT THROUGH THE WIZARD.** The wizard is one route in; the
// hole is in a pure module and any caller can reach it. A test that went through georeferencing
// would pass the day that path changed and leave the hole open for the next one.
//
// The two properties, and the second is the one that makes the first safe:
//   1. an absurd obstacle does not explode the index -- it finishes, quickly
//   2. near() STILL RETURNS IT. A broad phase that quietly drops an obstacle produces a layout
//      that looks fine and is wrong in one place nobody will ever find, which is exactly the
//      failure collide-harness.js compares against obstaclesInReach() to prevent.
'use strict';
const { lpnCollide: C } = require('../../js/lpn-collide.js');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// A tiny drawing, exactly the shape the wizard leaves behind: a model a hundredth of a degree
// across, and one obstacle thousands of times longer than the whole of it.
function label(id, x, y) {
	return { id: id, anchor: { x: x, y: y }, home: { x: x, y: y }, w: 0.002, h: 0.001,
		yOff: 0, lines: [0.002] };
}
const labels = [label('L1', -122.5700, 38.1070), label('L2', -122.5690, 38.1075)];
const obs = {
	boxes: [],
	segments: [
		// The drawing itself.
		{ ax: -122.5705, ay: 38.1068, bx: -122.5685, by: 38.1078, kind: 'pipe', id: 'P1' },
		// **THE ONE THAT USED TO KILL THE TAB**: 25.7 degrees, the measured leader.
		{ ax: -122.5724, ay: 38.1070, bx: -96.8764, by: 12.0000, kind: 'leader', id: 'HUGE' }
	]
};

console.log('--- an obstacle 2,500 km long does not explode the index ---');
const t0 = Date.now();
let placed = null, threw = null;
try {
	placed = C.placeLabels(labels, obs, { inner: 0.001, outer: 0.004, steps: [45, 30, 15], k: 0.25 });
} catch (e) { threw = e; }
const ms = Date.now() - t0;
ok('placeLabels returned rather than throwing', !threw, threw && threw.message);
ok('...and did it quickly', ms < 2000, ms + ' ms');
ok('...and placed every label', !!placed && placed.length === labels.length, placed && placed.length);

console.log('\n--- the overflow path was genuinely exercised, not skipped ---');
// **A GUARD AGAINST THIS TEST GOING BLIND.** Everything above would still pass if span() never
// overflowed at all -- a fast run that places two labels is also what a drawing with no oversized
// obstacle looks like. So the count is asserted: non-zero here, and zero on an ordinary drawing,
// which together say the fixture is still reaching the code the fixture exists for.
ok('the pathological fixture DID overflow a span', C.oversizedObstacles() > 0,
	C.oversizedObstacles());

const tame = {
	boxes: [],
	segments: [{ ax: -122.5705, ay: 38.1068, bx: -122.5685, by: 38.1078, kind: 'pipe', id: 'P1' }]
};
C.placeLabels(labels, tame, { inner: 0.001, outer: 0.004, steps: [45, 30, 15], k: 0.25 });
ok('an ordinary drawing overflows nothing', C.oversizedObstacles() === 0,
	C.oversizedObstacles());

console.log('\n--- and an oversized obstacle is REACHABLE, not dropped ---');
// The definition the index has to agree with. The overflow list is tested inside near() with the
// SAME predicate this uses, which is what makes the two sets equal; collide-harness.js holds the
// general grid-against-definition claim, and this holds that the huge one is in the definition at
// all -- without which the paragraph above would be about nothing.
const probe = { id: 'Q', anchor: { x: -122.5724, y: 38.1070 }, w: 0.002, h: 0.001 };
const byDefinition = C.obstaclesInReach(probe, obs, 0.004);
const names = byDefinition.segments.map(sg => sg.id).sort();
ok('the plain-list definition reaches the huge segment', names.indexOf('HUGE') >= 0, names.join(','));

console.log('\n--- a NaN coordinate takes the same path rather than looping on NaN bounds ---');
const nanObs = {
	boxes: [],
	segments: [
		{ ax: -122.5705, ay: 38.1068, bx: -122.5685, by: 38.1078, kind: 'pipe', id: 'P1' },
		{ ax: NaN, ay: 38.107, bx: -122.57, by: NaN, kind: 'leader', id: 'NAN' }
	]
};
const t1 = Date.now();
let nanOk = true;
try { C.placeLabels(labels, nanObs, { inner: 0.001, outer: 0.004, steps: [45, 30, 15], k: 0.25 }); }
catch (e) { nanOk = false; }
ok('a NaN obstacle does not hang the pass', nanOk && (Date.now() - t1) < 2000, (Date.now() - t1) + ' ms');

console.log('\n' + (fails ? fails + ' FAILED' : 'all checks passed'));
process.exit(fails ? 1 : 0);
