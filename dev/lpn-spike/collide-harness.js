// Task 293 — headless check of js/lpn-collide.js, the label collision relaxation.
//
//   node dev/lpn-spike/collide-harness.js
//
// This is the piece of the map editor a person genuinely cannot verify by looking at it.
// "That label looks about right" is not a check on a four-iteration weighted relaxation:
// the weights decide who yields to whom, and getting them backwards still produces a
// drawing with no overlapping labels — just the wrong one, with the user's deliberately
// dragged label shoved aside instead of the automatic one. That failure is invisible on a
// screenshot and obvious in an assertion.
//
// Like geom-harness.js this require()s the real module rather than brace-matching a copy
// out of looped-network.js, so what passes here is what the page loads.
//
// What can actually be wrong here:
//   * the weight SHARE formula — each box's share is proportional to the OTHER's strength,
//     so an immovable obstacle must absorb none of the separation and a peer must take half;
//   * a manually dragged label being moved at all (it must block, never yield);
//   * a label colliding with its OWN leader, which would push it further away every
//     iteration, forever — a slow drift nobody would trace back to here;
//   * the smaller-overlap axis choice, which is what keeps a nudge short;
//   * idempotence: the pass runs on every drag frame, so running it twice on an unchanged
//     drawing must give the same answer as running it once (it did not, once — the old code
//     accumulated drift on every frame of a drag).

const Collide = require('../../js/lpn-collide.js').lpnCollide;

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol); }

// A movable label box: `ref` is the holder the editor writes the nudge onto.
function label(x, y, w, h, opts) {
	const o = opts || {};
	return {
		ref: { nudge: { x: 0, y: 0 }, tag: o.tag },
		owner: null,
		movable: !o.manual,
		weight: o.manual ? Collide.WEIGHT.manual : Collide.WEIGHT.label,
		base: { x: x, y: y }, yOff: 0, w: w, h: h
	};
}
function obstacle(x, y, w, h, weight) {
	return { ref: null, owner: null, movable: false, weight: weight, base: { x: x, y: y }, yOff: 0, w: w, h: h };
}
function overlaps(a, b) {
	const A = Collide.boxTopLeft(a), B = Collide.boxTopLeft(b);
	return Math.min(A.x + a.w, B.x + b.w) - Math.max(A.x, B.x) > 1e-9
		&& Math.min(A.y + a.h, B.y + b.h) - Math.max(A.y, B.y) > 1e-9;
}

// ---- boxTopLeft --------------------------------------------------------
console.log('--- boxTopLeft ---');
const plain = obstacle(10, 20, 5, 5, Collide.WEIGHT.node);
report(near(Collide.boxTopLeft(plain).x, 10) && near(Collide.boxTopLeft(plain).y, 20),
	'an immovable box sits at its base');
const nudged = label(10, 20, 5, 5);
nudged.ref.nudge = { x: 3, y: -4 };
nudged.yOff = -8;
const tl = Collide.boxTopLeft(nudged);
report(near(tl.x, 13) && near(tl.y, 8), 'base + live nudge + baseline offset', JSON.stringify(tl));

// ---- two peer labels split the separation ------------------------------
console.log('--- peer labels ---');
{
	// Identical 10x10 boxes offset by 6 in x and 8 in y: overlap is 4 in x, 2 in y, so the
	// pass must move them apart along Y (the smaller overlap), not X.
	const a = label(0, 0, 10, 10, { tag: 'a' }), b = label(6, 8, 10, 10, { tag: 'b' });
	Collide.relax([a, b], [], null, 4);
	report(near(a.ref.nudge.x, 0) && near(b.ref.nudge.x, 0), 'separates along the SMALLER overlap axis (y)',
		`nudge.x a=${a.ref.nudge.x} b=${b.ref.nudge.x}`);
	report(near(a.ref.nudge.y, -(2 + 0.1) / 2) && near(b.ref.nudge.y, (2 + 0.1) / 2),
		'two peers split the separation 50/50', `a=${a.ref.nudge.y} b=${b.ref.nudge.y}`);
	report(!overlaps(a, b), 'and they no longer overlap');
}
{
	// Same boxes, overlap smaller in X this time.
	const a = label(0, 0, 10, 10), b = label(8, 6, 10, 10);
	Collide.relax([a, b], [], null, 4);
	report(near(a.ref.nudge.x, -(2 + 0.1) / 2) && near(b.ref.nudge.x, (2 + 0.1) / 2),
		'separates along x when x is the smaller overlap');
	report(near(a.ref.nudge.y, 0) && near(b.ref.nudge.y, 0), 'and leaves y alone');
}

// ---- an immovable obstacle absorbs none of the push --------------------
console.log('--- immovable obstacles ---');
{
	// A node SYMBOL is weight 0.5 against a label's 1, so the label takes only B/(A+B) =
	// 0.5/1.5 = ONE THIRD of the separation per iteration, and the obstacle takes none
	// because it cannot move. That is the documented intent ("worth stepping off, but not
	// worth flinging a label across the map"), and its arithmetic consequence is that four
	// iterations do not finish the job: each pass removes a third of what is left.
	//
	// FINDING, recorded rather than fixed (Task 293 is a lift-out, not a redesign): against
	// a half-strength obstacle the pass STOPS SHORT. From a 2-unit overlap it leaves about
	// 0.3 — a label resting slightly on a node symbol. Nobody had seen this because nothing
	// could measure it; whether 0.3 world units is worth another iteration or a different
	// weight is Tom's call, not the harness's. What is asserted here is the real behaviour,
	// so a future change to either number shows up as a diff instead of a surprise.
	const a = label(0, 0, 10, 10);
	const node = obstacle(6, 8, 10, 10, Collide.WEIGHT.node);
	const before = 2;                                  // y overlap at rest
	Collide.relax([a], [node], null, 4);
	report(a.ref.nudge.y < 0, 'pushed away from the obstacle, not into it');
	report(near(a.ref.nudge.y, -1.6851851851851851, 1e-9),
		'a half-strength obstacle is cleared by exactly a third per pass', `nudge.y=${a.ref.nudge.y}`);
	report(overlaps(a, node) && before + a.ref.nudge.y < 0.4,
		'four passes leave a small residual overlap on a node symbol (see note above)',
		`residual=${(before + a.ref.nudge.y).toFixed(4)}`);
	// Given enough passes it does converge — the weight slows it down, it does not stall.
	const b = label(0, 0, 10, 10);
	Collide.relax([b], [obstacle(6, 8, 10, 10, Collide.WEIGHT.node)], null, 40);
	report(!overlaps(b, node), 'and it does clear completely given enough passes',
		`nudge.y=${b.ref.nudge.y}`);
}
{
	// A MANUALLY dragged label is immovable and weight 1000, so the automatic one absorbs
	// essentially the whole separation. This is the case that is invisible on screen: both
	// orderings end with no overlap, but only one respects the user's drag.
	const auto = label(0, 0, 10, 10, { tag: 'auto' });
	const manual = label(6, 8, 10, 10, { manual: true, tag: 'manual' });
	Collide.relax([auto, manual], [], null, 4);
	report(near(manual.ref.nudge.x, 0) && near(manual.ref.nudge.y, 0),
		'a manually dragged label never moves', JSON.stringify(manual.ref.nudge));
	report(auto.ref.nudge.y < 0 && !overlaps(auto, manual),
		'the automatic label absorbs the whole separation', JSON.stringify(auto.ref.nudge));
}
{
	// Two immovable boxes overlapping each other must be skipped, not spun on.
	const a = obstacle(0, 0, 10, 10, Collide.WEIGHT.node);
	const b = obstacle(2, 2, 10, 10, Collide.WEIGHT.label);
	const iters = Collide.relax([], [a, b], null, 4);
	report(iters === 1, 'nothing movable settles on the first iteration', `iters=${iters}`);
}
{
	// Weight 0 on both sides would divide by zero; the pass must skip instead.
	const a = label(0, 0, 10, 10); a.weight = 0;
	const b = obstacle(2, 2, 10, 10, Collide.WEIGHT.pipe);
	Collide.relax([a], [b], null, 4);
	report(!Number.isNaN(a.ref.nudge.x) && !Number.isNaN(a.ref.nudge.y),
		'zero total weight does not produce NaN', JSON.stringify(a.ref.nudge));
}


// ---- pipes as segments --------------------------------------------------
// Tom, 2026-08-15: "I see that pipes have no model/boxes. They need a model even if their weight is
// lower than other things... These ideally would make some attempt to avoid these pipe conflicts if
// it's not too hard to do. It's acceptable as is, but not preferable." WEIGHT.pipe was 0 and pipes
// were absent from the pass entirely -- a call made in the repo, not by him.
console.log('--- pushOffSegments ---');
function lbl(x, y, w, h) {
	return { ref: { nudge: { x: 0, y: 0 } }, owner: null, movable: true, weight: Collide.WEIGHT.label,
		base: { x: x, y: y }, yOff: 0, w: w, h: h };
}
{
	// A horizontal pipe straight through the middle of a label: the push must be VERTICAL and must
	// clear it. Perpendicular, not axis-of-least-overlap -- see the comment in pushOffSegments().
	const a = lbl(0, 0, 20, 6);
	Collide.pushOffSegments([a], [{ ax: -100, ay: 3, bx: 100, by: 3, weight: 1 }]);
	report(a.ref.nudge.x === 0, 'a horizontal pipe pushes straight up or down, never sideways',
		JSON.stringify(a.ref.nudge));
	report(Math.abs(a.ref.nudge.y) >= 3, '...far enough to clear the line', JSON.stringify(a.ref.nudge));
}
{
	// THE CASE AN AXIS-ALIGNED PUSH GETS WRONG. A pipe at 30 degrees crossing a wide label: pushing
	// along the smaller axis slides the label ALONG the pipe as often as off it, and it lands back
	// on the line a little further down. The push has to be along the segment's normal.
	const a = lbl(0, 0, 40, 6), ang = Math.PI / 6;
	Collide.pushOffSegments([a], [{ ax: 20 - 100 * Math.cos(ang), ay: 3 - 100 * Math.sin(ang),
		bx: 20 + 100 * Math.cos(ang), by: 3 + 100 * Math.sin(ang), weight: 1 }]);
	const n = a.ref.nudge, along = n.x * Math.cos(ang) + n.y * Math.sin(ang);
	report(Math.abs(along) < 1e-9, 'a diagonal pipe pushes perpendicular to itself, with no slide along it',
		'along=' + along.toFixed(6) + ' of ' + Math.hypot(n.x, n.y).toFixed(3));
}
{
	// A pipe that STOPS SHORT of the label must not push it. Without the segment-range test the
	// infinite line through a stub of pipe on the far side of the map would move labels.
	const a = lbl(0, 0, 20, 6);
	Collide.pushOffSegments([a], [{ ax: -100, ay: 3, bx: -50, by: 3, weight: 1 }]);
	report(a.ref.nudge.x === 0 && a.ref.nudge.y === 0,
		'a pipe that stops short of the label leaves it alone', JSON.stringify(a.ref.nudge));
}
{
	// An immovable label is not moved by a pipe either -- goal 4, and the same rule the box pass has.
	const a = lbl(0, 0, 20, 6); a.movable = false; a.weight = Collide.WEIGHT.manual;
	Collide.pushOffSegments([a], [{ ax: -100, ay: 3, bx: 100, by: 3, weight: 1 }]);
	report(a.ref.nudge.x === 0 && a.ref.nudge.y === 0, 'a manually placed label is not moved by a pipe');
}
{
	// THE SIDE IS KEPT. A label mostly above the line goes up; mostly below goes down. Choosing the
	// nearer exit rather than a fixed direction is what stops a label being dragged across its own
	// pipe to the wrong side of the drawing.
	const up = lbl(0, 0, 20, 6), down = lbl(0, 0, 20, 6);
	Collide.pushOffSegments([up], [{ ax: -100, ay: 5, bx: 100, by: 5, weight: 1 }]);
	Collide.pushOffSegments([down], [{ ax: -100, ay: 1, bx: 100, by: 1, weight: 1 }]);
	report(up.ref.nudge.y < 0 && down.ref.nudge.y > 0,
		'each label leaves by the side it was already on',
		JSON.stringify(up.ref.nudge) + ' / ' + JSON.stringify(down.ref.nudge));
}
{
	// A PREFERENCE, NOT A PROHIBITION (WEIGHT.pipe 0.25). A pipe moves a label a quarter as
	// insistently as another label would, so in a crowd the labels win and the number ends up lying
	// across the line -- which is the behaviour the old "pipes are absent by design" comment claimed
	// and the code did not have.
	report(Collide.WEIGHT.pipe > 0, 'a pipe is no longer weightless');
	report(Collide.WEIGHT.pipe < Collide.WEIGHT.node && Collide.WEIGHT.pipe < Collide.WEIGHT.label,
		'...but pushes less than a node symbol or another label', 'pipe=' + Collide.WEIGHT.pipe);
}
{
	// And it runs inside relax(), not merely as a function nobody calls -- pipes first, so a label
	// stepped off a line is then judged against its neighbours where it ended up.
	const a = lbl(0, 0, 20, 6);
	let asked = 0;
	Collide.relax([a], [], null, 4, function () { asked++; return [{ ax: -100, ay: 3, bx: 100, by: 3, weight: 1 }]; });
	// Twice, not four times, and that is the right answer: the first iteration clears the label and
	// the second finds nothing left to do, so the pass returns early. Asserting 4 would have been
	// asserting that the convergence check is broken.
	report(asked === 2, 'relax() asks for the pipes each iteration, and stops as soon as they settle',
		'asked=' + asked);
	report(Math.abs(a.ref.nudge.y) >= 3, '...and the label is off the pipe when it is done',
		JSON.stringify(a.ref.nudge));
}

// ---- leader samples ----------------------------------------------------
console.log('--- pushLeaderSamples ---');
{
	const out = [];
	Collide.pushLeaderSamples(out, 0, 0, 10, 0, null);          // px omitted -> 1 world unit per pixel
	// step 3 over a length of 10 -> 4 intervals -> 5 samples, ends inclusive.
	report(out.length === 5, 'samples the whole line at the step', `n=${out.length}`);
	report(near(Collide.boxTopLeft(out[0]).x, -Collide.LEADER_SAMPLE_HALF_PX), 'first sample is centred on the start');
	report(near(Collide.boxTopLeft(out[out.length - 1]).x, 10 - Collide.LEADER_SAMPLE_HALF_PX),
		'last sample is centred on the end');
	report(out.every(function (b) { return b.weight === Collide.WEIGHT.leader && !b.movable; }),
		'every sample is an immovable leader-weight box');
	// The step must stay under a sample box's own width or the chain has gaps a label can sit in.
	report(Collide.LEADER_SAMPLE_STEP_PX <= Collide.LEADER_SAMPLE_HALF_PX * 2,
		'sample step is fine enough that boxes cannot slip between samples');
}
{
	// THE UNITS, which is the whole point of the fix. The constants are SCREEN PIXELS and the
	// caller passes world-units-per-pixel, so the same leader sampled at two zooms must produce
	// the same number of boxes of the same SCREEN size -- and a different world size each time.
	// Asserting a world figure would assert nothing: 0.3 world units is 11 screen pixels on Net3
	// and a third of a pixel on the basic example, which is exactly how the old fixed constants
	// managed to over-avoid one drawing and ignore another.
	const zoomedIn = [], zoomedOut = [];
	Collide.pushLeaderSamples(zoomedIn, 0, 0, 40, 0, null, 1);       // 40 world units = 40 px
	Collide.pushLeaderSamples(zoomedOut, 0, 0, 400, 0, null, 10);    // 400 world units = 40 px
	report(zoomedIn.length === zoomedOut.length,
		'a leader of the same SCREEN length gets the same number of samples at any zoom',
		`${zoomedIn.length} vs ${zoomedOut.length}`);
	report(near(zoomedOut[0].w, zoomedIn[0].w * 10),
		'...and each box is ten times the WORLD size when a pixel is ten times as wide',
		`${zoomedIn[0].w} vs ${zoomedOut[0].w}`);
	report(near(zoomedIn[0].w, Collide.LEADER_SAMPLE_HALF_PX * 2),
		'...which is the pixel width the line is drawn at, not a world constant');
}
{
	// A very long leader is capped rather than generating an unbounded chain. The cap has to sit
	// well above a real one: a leader runs from a node to a label at most the nudge cap away, so
	// 200 samples at 3px is 600px of leader -- longer than any that can occur.
	const out = [];
	Collide.pushLeaderSamples(out, 0, 0, 100000, 0, null);
	report(out.length === Collide.LEADER_SAMPLE_MAX + 1, 'a long leader is capped', `n=${out.length}`);
	report(Collide.LEADER_SAMPLE_MAX * Collide.LEADER_SAMPLE_STEP_PX > 500,
		'...but not before any leader a drawing can actually produce');
}
{
	// Zero-length leader still yields at least one sample and no NaN.
	const out = [];
	Collide.pushLeaderSamples(out, 4, 4, 4, 4, null);
	report(out.length === 2 && !Number.isNaN(out[0].base.x), 'zero-length leader is safe', `n=${out.length}`);
}

// ---- a label never collides with its own leader ------------------------
console.log('--- own-leader exemption ---');
{
	// The leader ends ON the label's near edge by construction, so without the exemption the
	// label would be pushed a little farther away on every single iteration, forever.
	const a = label(0, 0, 10, 10, { tag: 'owner' });
	function ownLeader() {
		const out = [];
		Collide.pushLeaderSamples(out, -20, 5, Collide.boxTopLeft(a).x, 5, a.ref);
		return out;
	}
	Collide.relax([a], [], ownLeader, 4);
	report(near(a.ref.nudge.x, 0) && near(a.ref.nudge.y, 0),
		'a label is not pushed by its own leader', JSON.stringify(a.ref.nudge));
}
{
	// Someone ELSE's leader does push it.
	const a = label(0, 0, 10, 10, { tag: 'a' });
	const other = { nudge: { x: 0, y: 0 }, tag: 'other' };
	function foreignLeader() {
		const out = [];
		Collide.pushLeaderSamples(out, -20, 5, 5, 5, other);
		return out;
	}
	Collide.relax([a], [], foreignLeader, 4);
	report(a.ref.nudge.x !== 0 || a.ref.nudge.y !== 0,
		"another element's leader does push it", JSON.stringify(a.ref.nudge));
}
{
	// The leader function is rebuilt EVERY iteration, because a leader follows its own label.
	let calls = 0;
	const a = label(0, 0, 10, 10), b = label(6, 8, 10, 10);
	Collide.relax([a, b], [], function () { calls++; return []; }, 4);
	report(calls >= 2, 'leaders are recomputed per iteration, not once', `calls=${calls}`);
}

// ---- convergence and idempotence ---------------------------------------
console.log('--- convergence ---');
{
	// A settled drawing must stop immediately rather than burning all four passes.
	const a = label(0, 0, 10, 10), b = label(100, 100, 10, 10);
	const iters = Collide.relax([a, b], [], null, 4);
	report(iters === 1, 'a drawing with no overlaps settles in one iteration', `iters=${iters}`);
}
{
	// IDEMPOTENCE. The caller zeroes every nudge before each pass (runLabelCollisionAvoidance()
	// does), so running the pass twice on an unchanged drawing must give the same answer.
	const boxes = [label(0, 0, 10, 10), label(6, 8, 10, 10), label(9, 3, 10, 10)];
	Collide.relax(boxes, [], null, 4);
	const first = boxes.map(function (b) { return { x: b.ref.nudge.x, y: b.ref.nudge.y }; });
	boxes.forEach(function (b) { b.ref.nudge = { x: 0, y: 0 }; });   // what the caller does each frame
	Collide.relax(boxes, [], null, 4);
	const second = boxes.map(function (b) { return { x: b.ref.nudge.x, y: b.ref.nudge.y }; });
	const same = first.every(function (n, i) {
		return near(n.x, second[i].x) && near(n.y, second[i].y);
	});
	report(same, 'running the pass twice from zeroed nudges gives the same answer',
		JSON.stringify([first, second]));
}
{
	// Three mutually overlapping labels: the point of the iteration is that they end apart.
	const a = label(0, 0, 10, 10), b = label(4, 4, 10, 10), c = label(8, 2, 10, 10);
	Collide.relax([a, b, c], [], null, 8);
	report(!overlaps(a, b) && !overlaps(b, c) && !overlaps(a, c),
		'three overlapping labels all end up clear of each other',
		JSON.stringify([a, b, c].map(function (x) { return x.ref.nudge; })));
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
