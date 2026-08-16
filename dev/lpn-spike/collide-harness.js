// Label PLACEMENT, as pure arithmetic. Run with:
//   node dev/lpn-spike/collide-harness.js
//
// js/lpn-collide.js is values-in/values-out (ROADMAP Task 293), so everything below runs without a
// browser and without the DOM stub. That is the point of the split: "that label looks about right"
// is not a verification, and a screenshot cannot tell you whether the pass would have found a
// better place.
//
// WHAT IS BEING TESTED IS A SEARCH, NOT A PHYSICS (Task 379). The old relaxation was a local method
// -- push apart, four times -- so its tests were about who yielded. This pass scores candidate
// placements and takes the best, so the properties that matter are different ones:
//
//   * the geometry underneath is exact (separating axis, segment-in-box, segment crossing),
//   * the candidate SET obeys goals 1 and 7 by construction rather than by penalty,
//   * the RANKING behaves like a ranking -- a higher goal outweighs a lower one at comparable
//     severity, and a lower one still decides when the higher ones are equal,
//   * the neighbour term does what goal 11 asks and buys the stability goal 9 asks for,
//   * and the pass is idempotent, in range, and mutates none of its inputs.
//
// The last section MEASURES rather than asserts: `k` and the candidate count are the two things
// dev/label-placement-goals.md §3 leaves open, to be settled by measurement and not by argument.

const { lpnCollide: C } = require('../../js/lpn-collide.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol); }

// ---- 1. oriented boxes ------------------------------------------------------------------------
console.log('--- the separating-axis theorem, which is what lets a box turn ---');
{
	const a = C.box(0, 0, 10, 4, 0);
	report(C.boxOverlapDepth(a, C.box(100, 100, 10, 4, 0)) === 0, 'boxes far apart do not overlap');
	report(C.boxOverlapDepth(a, C.box(10.01, 0, 10, 4, 0)) === 0, 'and neither do boxes just touching');
	// Identical boxes: the shallowest way out is across the SHORT side, which is the height here.
	report(near(C.boxOverlapDepth(a, a), 4), 'two identical boxes penetrate by their smaller dimension',
		C.boxOverlapDepth(a, a));
	report(near(C.boxOverlapDepth(a, C.box(6, 0, 10, 4, 0)), 4), 'a half-shifted pair, same answer');
	report(near(C.boxOverlapDepth(a, C.box(0, 3, 10, 4, 0)), 1), 'a vertical shift penetrates by the leftover',
		C.boxOverlapDepth(a, C.box(0, 3, 10, 4, 0)));
	report(C.boxOverlapDepth(a, C.box(0, 4.01, 10, 4, 0)) === 0, '...and clears just past it');
	report(near(C.boxOverlapDepth(a, C.box(6, 0, 10, 4, 0)), C.boxOverlapDepth(C.box(6, 0, 10, 4, 0), a)),
		'the depth is symmetric, whichever box is asked first');

	// **THE ROTATION IS THE WHOLE REASON THIS EXISTS.** A long thin label at 45 degrees and a second
	// one beside it: their AABBs overlap heavily and the boxes themselves do not touch at all. Under
	// the old axis-aligned pass the second label was pushed out of ground the first never occupied.
	const diag = C.box(0, 0, 40, 6, 45);
	const beside = C.box(18, -18, 40, 6, 45);
	report(C.boxOverlapDepth(diag, beside) === 0, 'two parallel diagonal labels side by side are clear');
	const aabbA = { x: -16.3, y: -16.3, w: 32.5, h: 32.5 };   // the AABB of `diag`, near enough
	const aabbB = { x: 1.7, y: -34.3, w: 32.5, h: 32.5 };
	report(C.rectsOverlap(aabbA, aabbB), '...while their AXIS-ALIGNED boxes do overlap -- the defect this replaces');
	report(C.boxOverlapDepth(diag, C.box(0, 0, 40, 6, -45)) > 0, 'and a crossing pair really does collide');
	// A 90-degree turn is the same box with w and h swapped, which is the cheapest check that the
	// axes are being built and not merely assumed.
	report(near(C.boxOverlapDepth(C.box(0, 0, 10, 4, 90), C.box(0, 0, 4, 10, 0)), 4),
		'a box turned 90 degrees equals the same box with its sides exchanged');
}

console.log('\n--- a line through a box, and two lines crossing ---');
{
	const b = C.box(0, 0, 10, 4, 0);
	report(near(C.segmentInBoxFraction({ ax: -20, ay: 0, bx: 20, by: 0 }, b), 10 / 40),
		'a line straight through: the fraction inside is the box width over the line length');
	report(C.segmentInBoxFraction({ ax: -20, ay: 10, bx: 20, by: 10 }, b) === 0, 'a line clear of it: nothing');
	report(near(C.segmentInBoxFraction({ ax: 0, ay: 0, bx: 20, by: 0 }, b), 5 / 20),
		'a line starting inside counts only the part that is inside');
	report(near(C.segmentInBoxFraction({ ax: -2, ay: 0, bx: 2, by: 0 }, b), 1),
		'a line wholly inside is all of it');
	// Rotated: the same line and the same box, turned together, must give the same answer.
	const rb = C.box(0, 0, 10, 4, 30), rad = 30 * Math.PI / 180;
	const p = { ax: -20 * Math.cos(rad), ay: -20 * Math.sin(rad), bx: 20 * Math.cos(rad), by: 20 * Math.sin(rad) };
	report(near(C.segmentInBoxFraction(p, rb), 10 / 40, 1e-9),
		'turn the line and the box together and nothing changes -- the test is in the box frame');
	report(C.segmentInBoxFraction({ ax: -20, ay: 0, bx: 20, by: 0 }, C.box(0, 0, 10, 4, 90)) > 0,
		'a box turned across a line still catches it');

	report(C.segmentsCross({ ax: 0, ay: 0, bx: 10, by: 0 }, { ax: 5, ay: -5, bx: 5, by: 5 }), 'two lines cross');
	report(!C.segmentsCross({ ax: 0, ay: 0, bx: 10, by: 0 }, { ax: 5, ay: 1, bx: 5, by: 5 }), '...and stop short');
	report(!C.segmentsCross({ ax: 0, ay: 0, bx: 10, by: 0 }, { ax: 0, ay: 2, bx: 10, by: 2 }), 'parallel lines never cross');
	report(!C.segmentsCross({ ax: 0, ay: 0, bx: 0, by: 0 }, { ax: -1, ay: 0, bx: 1, by: 0 }),
		'a zero-length segment answers false rather than NaN');
}

// ---- 2. the candidate set ---------------------------------------------------------------------
console.log('\n--- the candidates, which is where two of the goals live ---');
const LBL = { id: 'n:J1', anchor: { x: 0, y: 0 }, home: { x: 4, y: -4 }, w: 20, h: 8, yOff: -6 };
{
	const cands = C.candidatesFor(LBL, 10, 25);
	report(cands.length === 17, 'eight directions at two radii, plus where it already is', cands.length);
	// **GOAL 7 IS SATISFIED BY CONSTRUCTION, NOT BY A PENALTY.** Every ring angle is at least 10
	// degrees off horizontal and off vertical, so an orthogonal leader is never proposed. Asserted
	// on the angles the generator actually produces, not on the constant, so a "tidy-up" that
	// rounds the ring back onto the compass points fails here.
	const offAxis = cands.slice(0, 16).every(c => {
		const deg = Math.abs(Math.atan2(c.y, c.x) * 180 / Math.PI);
		return [0, 90, 180].every(o => Math.abs(deg - o) > 9.99);
	});
	report(offAxis, 'no candidate direction is horizontal or vertical (goal 7)');
	report(cands.every(c => Math.hypot(c.x, c.y) <= 25 + 1e-9),
		'every candidate is inside the reach, so there is nothing to cap afterwards');
	report(cands[16].x === LBL.home.x && cands[16].y === LBL.home.y,
		'"leave it where it is" is one of the candidates, not a special case');
	report(cands.every(c => c.neighbours.length > 0 && c.neighbours.every(i => i >= 0 && i < cands.length)),
		'every candidate has neighbours, and they are real indices');
	// The ring's neighbours are DIRECTIONS, so the two either side and the same direction at the
	// other radius -- never a distance test, which would give the outer ring fewer neighbours than
	// the inner one purely because it is bigger.
	report(cands[0].neighbours.length === 3 && cands[0].neighbours.indexOf(8) >= 0,
		'a ring candidate is a neighbour of the same direction at the other radius');

	// GOAL 1: a dragged label's candidates lie on the RAY through the endpoint the user gave it.
	const dragged = Object.assign({}, LBL, { dragged: true, home: { x: 30, y: -40 } });
	const ray = C.candidatesFor(dragged, 10, 25);
	report(ray[0].x === 30 && ray[0].y === -40, 'the stored endpoint is the first candidate');
	const cross = ray.every(c => near(c.x * -40 - c.y * 30, 0, 1e-9));
	report(cross, 'and every other candidate is collinear with it -- stretched, never turned');
	report(ray.every(c => Math.hypot(c.x, c.y) >= 50 - 1e-9), '...and never nearer than the user put it');
	report(C.candidatesFor(Object.assign({}, LBL, { dragged: true, home: { x: 0, y: 0 } }), 10, 25).length === 1,
		'a dragged label sitting on its own anchor has no ray, and does not produce NaN');
}

// ---- 3. the ranking ---------------------------------------------------------------------------
console.log('\n--- rank sets magnitude, and that is the whole weight table ---');
{
	const W = C.GOAL_WEIGHT;
	report(W.labelLabel > W.labelLeader && W.labelLeader > W.labelSymbol &&
		W.labelSymbol > W.leaderSymbol && W.leaderSymbol > W.labelLink &&
		W.labelLink > W.leaderLink && W.leaderLink > W.distance,
		'the weights descend in Tom\'s own goal order, 2 3 4 5 6 8 10');
	// **"You can be on a pipe and maybe still win."** A candidate lying across a pipe beats one
	// lying across another label, which is the sentence turned into arithmetic. If a future edit
	// makes the ladder steep enough to silence the low goals, or flat enough to lose the order,
	// this is where it shows.
	const obs = {
		boxes: [Object.assign({ kind: 'label' }, C.box(30, 0, 20, 8, 0))],
		segments: [{ ax: -30, ay: 0, bx: -10, by: 0, kind: 'link' }]
	};
	const l = { id: 'n:J1', anchor: { x: 0, y: 0 }, home: { x: 0, y: 0 }, w: 20, h: 8, yOff: -4 };
	const onPipe = C.rawScore(l, { x: -20, y: 0 }, obs, 40);
	const onLabel = C.rawScore(l, { x: 30, y: 0 }, obs, 40);
	report(onPipe > 0 && onLabel > onPipe, 'sitting on a pipe costs something, and less than sitting on a label',
		onPipe.toFixed(4) + ' vs ' + onLabel.toFixed(4));
	// And the bottom of the ladder still decides when everything above it is equal: two placements
	// in empty space differ only by distance.
	const near1 = C.rawScore(l, { x: 0, y: -12 }, { boxes: [], segments: [] }, 40);
	const far1 = C.rawScore(l, { x: 0, y: -36 }, { boxes: [], segments: [] }, 40);
	report(far1 > near1, 'with nothing in the way, the nearer placement wins on goal 10 alone',
		near1.toFixed(4) + ' vs ' + far1.toFixed(4));
	// A label's own pipe and its own leader are not obstacles to it -- a link label sits ON its pipe
	// by design, which is how a reader tells whose number it is.
	const own = { boxes: [], segments: [{ ax: -30, ay: 0, bx: 30, by: 0, kind: 'link', owner: 'l:P1' }] };
	const mine = { id: 'l:P1', anchor: { x: 0, y: 0 }, home: { x: 0, y: 0 }, w: 20, h: 8, yOff: -4 };
	const other = { id: 'l:P2', anchor: { x: 0, y: 0 }, home: { x: 0, y: 0 }, w: 20, h: 8, yOff: -4 };
	report(C.rawScore(mine, { x: 10, y: 0 }, own, 40) < C.rawScore(other, { x: 10, y: 0 }, own, 40),
		'a link label may sit on its OWN pipe, and pays for anyone else\'s');
}

console.log('\n--- the neighbourhood term (goal 11), which is not a rank ---');
{
	const raw = [1, 0, 0, 0];
	const cands = [{ neighbours: [1] }, { neighbours: [0, 2] }, { neighbours: [1, 3] }, { neighbours: [2] }];
	report(C.effectiveScores(raw, cands, 0).every((v, i) => v === raw[i]),
		'k = 0 is the raw field, unchanged -- the term is switchable off');
	const eff = C.effectiveScores(raw, cands, 0.5);
	report(eff[1] > eff[2], 'a clear candidate NEXT TO a bad one loses to an equally clear one in the open',
		eff.map(v => v.toFixed(3)).join(' / '));
	// NOT CIRCULAR, and this is the assertion that says so: neighbours contribute their RAW scores,
	// so the pass is one sweep and cannot feed on its own output.
	const twice = C.effectiveScores(raw, cands, 0.5);
	report(twice.every((v, i) => v === eff[i]), 'and it is one pass -- computing it again changes nothing');
}

// ---- 4. the pass ------------------------------------------------------------------------------
// A CROWD, on purpose: twenty-five labels on a 5x5 grid one unit apart, each about a label's width
// wide. That is Net3's own situation at its fit scale -- a problem with no conflict-free answer at
// all -- and it has to be genuinely over-constrained or every property below holds for nothing.
function crowd(shiftX) {
	const labels = [], obs = { boxes: [], segments: [] };
	for (let r = 0; r < 5; r++) {
		for (let c = 0; c < 5; c++) {
			const x = c * 10 + (r === 2 && c === 2 ? shiftX || 0 : 0), y = r * 10;
			labels.push({
				id: 'n:J' + (r * 5 + c), anchor: { x: x, y: y }, home: { x: x + 3, y: y - 3 },
				w: 14, h: 5, yOff: -4
			});
			const b = C.box(x, y, 3, 3, 0); b.kind = 'symbol';
			obs.boxes.push(b);
			if (c > 0) { obs.segments.push({ ax: x - 10, ay: y, bx: x, by: y, kind: 'link' }); }
		}
	}
	return { labels, obs };
}
console.log('\n--- the pass itself ---');
{
	const { labels, obs } = crowd(0);
	const frozen = JSON.stringify({ labels, obs });
	const a = C.placeLabels(labels, obs, { inner: 6, outer: 15, k: 0.5 });
	report(JSON.stringify({ labels, obs }) === frozen,
		'NOTHING IS MUTATED -- the caller\'s labels and obstacles come back untouched');
	const b = C.placeLabels(labels, obs, { inner: 6, outer: 15, k: 0.5 });
	report(JSON.stringify(a) === JSON.stringify(b),
		'IDEMPOTENT to the bit: no carried state, so running it twice equals running it once');
	report(a.length === 25, 'every label is placed -- there is no failure condition and nothing is skipped',
		a.length);
	// **NOTHING TO CAP.** The old relaxation could carry a label 301 screen pixels from its node,
	// and the cap that fixed that frequently put it back inside the collision it had just left.
	const byId = {};
	labels.forEach(l => { byId[l.id] = l; });
	report(a.every(r => Math.hypot(r.x - byId[r.id].anchor.x, r.y - byId[r.id].anchor.y) <= 15 + 1e-9),
		'and every placement is within reach of its own anchor, by construction');
	// Hardest first: the middle of a 5x5 grid is the most constrained place in it, and it must not
	// be left to choose last out of what is left.
	const order = a.map(r => r.id);
	report(order.indexOf('n:J12') < order.indexOf('n:J0'),
		'the most crowded label chooses before the one in the corner', order.slice(0, 5).join(' '));

	// GOAL 1 END TO END: a dragged label in the middle of the crowd stays on its own ray.
	const dl = crowd(0);
	dl.labels[12].dragged = true;
	dl.labels[12].home = { x: 20 + 12, y: 20 - 9 };
	const res = C.placeLabels(dl.labels, dl.obs, { inner: 6, outer: 15, k: 0.5 })
		.filter(r => r.id === 'n:J12')[0];
	report(near((res.x - 20) * -9 - (res.y - 20) * 12, 0, 1e-6),
		'a dragged label placed among 24 others is still on the line the user drew', res.x + ',' + res.y);
	report(Math.hypot(res.x - 20, res.y - 20) >= 15 - 1e-9,
		'...and is never pulled back nearer than the endpoint it was given');
}

console.log('\n--- the index agrees with the definition it stands in for ---');
{
	// **THE INDEX IS ONLY SAFE IF IT ANSWERS THE SAME QUESTION AS THE SCAN.** placeLabels() queries a
	// uniform grid for what is in reach of each label; obstaclesInReach() is the same question asked
	// of a plain list, and is the definition. A broad phase that quietly drops an obstacle produces a
	// layout that looks fine and is wrong in one place nobody will find, so the two are compared
	// here member by member, on the crowded fixture, for every label.
	const { labels, obs } = crowd(0);
	const outer = 15, maxDiag = Math.max.apply(null, labels.map(l => Math.hypot(l.w, l.h)));
	const index = C.grid(outer + maxDiag, obs);
	obs.boxes.forEach((b, i) => index.addBox(i));
	obs.segments.forEach((g, i) => index.addSegment(i));
	const scratch = { boxes: [], segments: [] };
	let same = true, worst = '';
	labels.forEach(l => {
		const want = C.obstaclesInReach(l, obs, outer);
		const got = index.near(l.anchor.x, l.anchor.y, outer + Math.hypot(l.w, l.h), scratch);
		const key = o => JSON.stringify(o.cx !== undefined ? [o.cx, o.cy, o.w, o.h, o.a] : [o.ax, o.ay, o.bx, o.by]);
		const a1 = want.boxes.map(key).sort().join('|'), b1 = got.boxes.map(key).sort().join('|');
		const a2 = want.segments.map(key).sort().join('|'), b2 = got.segments.map(key).sort().join('|');
		if (a1 !== b1 || a2 !== b2) { same = false; worst = l.id; }
	});
	report(same, 'every grid query returns exactly the obstacles the scan would have found', worst);
	// AND NO DUPLICATES: an obstacle spanning two cells is found by more than one of the nine, and
	// counting it twice would silently double one goal's weight. This is the check that says the
	// visit stamp is doing its job -- without it the assertion above still passes, since a duplicate
	// survives the sort-and-join comparison as a repeated member only if it is really repeated.
	const got = index.near(labels[12].anchor.x, labels[12].anchor.y, outer + 15, scratch);
	report(new Set(got.boxes).size === got.boxes.length && new Set(got.segments).size === got.segments.length,
		'...and returns each of them exactly once');
}

// ---- 5. what is left open, and is settled by measurement -------------------------------------
// dev/label-placement-goals.md §3 leaves `k` and the candidate count open ON PURPOSE, to be decided
// by measurement rather than by argument. Tom, on a proposal to open with 48 candidates: *"Not so
// fast. Let's try it."* So these PRINT rather than assert, except for the one property the numbers
// are there to support.
console.log('\n--- measurements: k, stability, and whether the thin set is enough ---');
{
	// GOAL 9, "a small change nearby should not rearrange the whole map", measured as: move one node
	// by a fiftieth of the grid spacing and count how many of the 25 labels choose a different
	// placement. The smoothing is expected to buy most of goal 9 for free, because the minimum of a
	// smoothed field moves less under a small perturbation than the minimum of a raw one.
	// Summed over four shift sizes rather than measured at one, because a single perturbation
	// measures as much luck as stability.
	const SHIFTS = [0.1, 0.2, 0.35, 0.5];
	function churn(k) {
		const base = crowd(0);
		const A = C.placeLabels(base.labels, base.obs, { inner: 6, outer: 15, k: k });
		const pos = {};
		A.forEach(r => { pos[r.id] = r; });
		return SHIFTS.reduce(function (sum, sh) {
			const moved = crowd(sh);
			const B = C.placeLabels(moved.labels, moved.obs, { inner: 6, outer: 15, k: k });
			return sum + B.filter(r => r.id !== 'n:J12')
				.filter(r => Math.hypot(r.x - pos[r.id].x, r.y - pos[r.id].y) > 1e-6).length;
		}, 0);
	}
	const ks = [0, 0.1, 0.25, 0.5, 1, 2];
	const churns = ks.map(churn);
	console.log('       label placements that change when ONE node shifts, over four shift sizes (96 chances):');
	ks.forEach((k, i) => console.log(`         k = ${k}:  ${churns[i]}`));
	// **THE SHIPPED k IS THE ONE THAT MEASURED BEST, and it is not the one that was guessed.** The
	// first draft shipped 0.5 on the reasoning that more smoothing is more stability; the numbers
	// say the opposite past a point, because a heavily smoothed field has broad flat minima and the
	// argmin inside one of them moves freely. So this asserts the shipped value against the two
	// quantities it was chosen on, and a future retune has to beat both.
	const SHIPPED = 0.25;
	report(churns[ks.indexOf(SHIPPED)] <= churns[0],
		'the shipped k is at least as stable as no neighbour term at all',
		churns[0] + ' -> ' + churns[ks.indexOf(SHIPPED)]);
	// And the total conflict the pass is left with, per k -- the other half of the trade, since a
	// layout that never moves is easy to get by never moving.
	function residual(k) {
		const { labels, obs } = crowd(0);
		const res = C.placeLabels(labels, obs, { inner: 6, outer: 15, k: k });
		const byId = {};
		labels.forEach(l => { byId[l.id] = l; });
		const o = { boxes: obs.boxes.slice(), segments: obs.segments.slice() };
		res.forEach(r => {
			o.boxes.push(Object.assign({ kind: 'label', owner: r.id }, C.labelBoxAtEnd(byId[r.id], r)));
		});
		return res.reduce((s, r) => s + C.rawScore(byId[r.id], r, o, 15), 0);
	}
	const resid = ks.map(residual);
	console.log('       total remaining conflict at that k (lower is better):');
	ks.forEach((k, i) => console.log(`         k = ${k}:  ${resid[i].toFixed(3)}`));
	report(resid[ks.indexOf(SHIPPED)] <= resid[0] + 1e-9,
		'...and leaves no more conflict on the drawing than no neighbour term at all',
		resid[0].toFixed(3) + ' -> ' + resid[ks.indexOf(SHIPPED)].toFixed(3));

	// THE CANDIDATE COUNT. The thin set is 8 directions x 2 radii; the question §3 asks is whether
	// the neighbourhood term means anything at that spacing, which it does not if a denser ring
	// finds materially better places. Compared here by scoring the same crowd against a set four
	// times as dense, using the module's own scorer so the comparison is like for like.
	function bestOverDenser(mult) {
		const { labels, obs } = crowd(0);
		const res = C.placeLabels(labels, obs, { inner: 6, outer: 15, k: 0.5 });
		const byId = {};
		labels.forEach(l => { byId[l.id] = l; });
		let gain = 0;
		res.forEach(r => {
			const l = byId[r.id], at = C.rawScore(l, r, obs, 15);
			let best = at;
			for (let i = 0; i < 8 * mult; i++) {
				for (const rad of [6, 10.5, 15]) {
					const t = (10 + i * 360 / (8 * mult)) * Math.PI / 180;
					const s = C.rawScore(l, { x: l.anchor.x + rad * Math.cos(t), y: l.anchor.y + rad * Math.sin(t) }, obs, 15);
					if (s < best) { best = s; }
				}
			}
			gain += at - best;
		});
		return gain;
	}
	console.log('       score a 4x denser ring could have found, summed over 25 labels: ' +
		bestOverDenser(4).toFixed(3) + '   (measured against the thin set actually shipped)');
}

// ---- 6. cost, because this runs on every frame of a drag -------------------------------------
// **THE PASS IS RE-RUN WHENEVER A LABEL MOVES, SO ITS COST IS A FEATURE OF THE DRAG.** Measured on
// whatever machine runs it, and the absolute numbers are not the assertion -- the SHAPE is. The
// first draft scored every candidate against every obstacle and took 1.5 seconds on 220 labels,
// which is Net3's own count; the uniform index took that to a few tens of milliseconds, and more to
// the point made it linear. The relaxation this replaced was faster at 220 and slower at 1000, for
// the same reason: it was quadratic and this is not.
console.log('\n--- cost ---');
{
	function net(n) {
		const labels = [], obs = { boxes: [], segments: [] }, side = Math.ceil(Math.sqrt(n));
		for (let i = 0; i < n; i++) {
			const x = (i % side) * 12, y = Math.floor(i / side) * 12;
			labels.push({ id: 'n:J' + i, anchor: { x, y }, home: { x: x + 3, y: y - 3 }, w: 14, h: 5, yOff: -4 });
			obs.boxes.push(C.box(x, y, 3, 3, 0, 'symbol'));
			if (i % side > 0) { obs.segments.push(C.segment(x - 12, y, x, y, 'link')); }
		}
		return { labels, obs };
	}
	function msPerPass(n) {
		const { labels, obs } = net(n);
		for (let w = 0; w < 3; w++) { C.placeLabels(labels, obs, { inner: 6, outer: 15, k: 0.25 }); }
		const t = process.hrtime.bigint();
		for (let i = 0; i < 5; i++) { C.placeLabels(labels, obs, { inner: 6, outer: 15, k: 0.25 }); }
		return Number(process.hrtime.bigint() - t) / 5 / 1e6;
	}
	const small = msPerPass(220), big = msPerPass(1000);
	console.log(`       220 labels (Net3's own count): ${small.toFixed(1)} ms per pass`);
	console.log(`       1000 labels:                   ${big.toFixed(1)} ms per pass`);
	// THE ASSERTION IS THE SLOPE, not the clock, so it means the same thing on any machine. Linear
	// work gives a flat cost per label; drop the index and the cost per label rises with the size of
	// the drawing, which is the regression that matters and the only one a timing test can catch
	// without being flaky.
	const perLabel = (big / 1000) / (small / 220);
	report(perLabel < 2, 'the cost per label barely grows from 220 labels to 1000 -- the pass is linear',
		perLabel.toFixed(2) + 'x the per-label cost at 4.5x the size');
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures === 0 ? 0 : 1);
