// lpn-collide.js — label placement, as pure geometry and arithmetic (ROADMAP Tasks 293, 379).
//
// Kept separate from js/looped-network.js and free of DOM dependencies so a harness can load it
// alone: "that label looks about right" is not a verification.
//
// **THIS IS CANDIDATE SCORING, NOT RELAXATION, AND THE DIFFERENCE IS WHAT IT CAN SEE.** The
// relaxation it replaced was a LOCAL method -- pairwise separation along the axis of smaller
// overlap, four passes -- so a label knew only what it was touching at that instant. It had no term
// for open space and never considered a position it did not stumble into, which is why labels sat
// in conflicts with clear ground beside them (Tom, 2026-08-15: *"There is lots of free space that
// is being 'wasted' while bad conflicts persist"*). No adjustment of its weights could have
// answered that: they decided WHO YIELDED, not WHERE ANYONE WENT.
//
// Here each label generates a set of candidate placements, every candidate is scored against
// everything already on the drawing, and the best one wins. The goals and their order are Tom's,
// dated 2026-08-16, and live in dev/label-placement-goals.md. Two things about them are easy to get
// wrong and are settled:
//
//   * **RANK SETS MAGNITUDE. THERE IS NO SEPARATE WEIGHT OR LENIENCE TABLE.** A goal's position in
//     the list IS its weight -- see GOAL_WEIGHT below. Tom: *"The ranking includes the lenience. See
//     that pipes are low ranked? That means they factor least in the score. You can be on a pipe and
//     maybe still win."*
//   * **PLACEMENT HAS TWO OUTCOMES, AND WHICH ONE IS AVAILABLE DEPENDS ON THE PASS.** In the SCORER
//     (placeLabels) the best candidate always wins and nothing declares defeat -- a ladder with a
//     finite top always places something, so the worst placement on a drawing is indistinguishable
//     from a merely tight one and no threshold read off the score could separate them. In the
//     FIRST-FIT (placeLabelsFirstFit, Task 398) a position is clear or it is not, so "neither side
//     is clear" is a fact rather than a judgement, and a label can be DROPPED. That is why dropping
//     is expressible there and not here, and why the old blanket ruling -- "there is no failure
//     condition, and do not invent one" -- now reads as a statement about the scorer alone.
//
// Everything is values in, values out. The caller builds the labels and the obstacles -- that is
// where `doc`, the SVG handles and the current font size live -- and this file does the geometry.

var EngCalcs = EngCalcs || {};

EngCalcs.lpnCollide = (function () {
	'use strict';

	// ---- the goals, as weights ----------------------------------------------------------------
	//
	// A GEOMETRIC LADDER, so a higher-ranked goal outweighs a lower one at comparable severity while
	// never silencing it: two halves of an overlap of a pipe still beat a sliver of a label. That is
	// the whole of "you can be on a pipe and maybe still win", and it is why these are one halving
	// apart rather than orders of magnitude apart.
	//
	// The numbers are the RANKS in dev/label-placement-goals.md §1 and nothing else -- read the
	// order off the key names. Goals 1 and 7 are absent on purpose: goal 1 (a dragged label's stored
	// endpoint) is a candidate GENERATOR, and goal 7 (leaders avoid orthogonality) is satisfied by
	// the angles the generator uses, so an orthogonal placement is never proposed rather than
	// proposed and then penalised. Goal 9 (leave padding for later) and goal 11 (seek the direction
	// of least congestion) are the neighbourhood term, not a penalty -- see effectiveScores().
	var GOAL_WEIGHT = {
		labelLabel: 1,          // 2. Labels avoid Labels
		labelLeader: 0.5,       // 3. Labels avoid Leaders, including their own
		labelSymbol: 0.25,      // 4. Labels avoid Symbols
		leaderSymbol: 0.125,    // 5. Leaders avoid Symbols
		labelLink: 0.0625,      // 6. Labels avoid Links
		leaderLink: 0.03125,    // 8. Leaders avoid Links
		distance: 0.015625      // 10. Labels minimize distance
	};

	// ---- oriented boxes ------------------------------------------------------------------------
	//
	// **BOXES ROTATE, AND THE UNROTATED ONE IS THE SAME CODE AT ANGLE ZERO.** An aligned pipe label
	// lies along its pipe, and the axis-aligned bounding box of a 100x12 label at 45 degrees is
	// **5.2 times** the label's own area -- a ratio that grows without limit with the label's length.
	// Every one of those empty square units used to push real labels out of ground nothing occupies.
	// The separating-axis theorem gives both the answer and the depth in a few lines, so there is no
	// reason to keep approximating.
	//
	// A box is { cx, cy, w, h, a } with `a` in DEGREES, turning the same way SVG's rotate() does
	// (clockwise, y down). `kind` rides along for scoring and is ignored here.
	// **EVERY BOX IS BUILT WITH ALL SEVEN FIELDS, INCLUDING THE ONES THAT ARE UNDEFINED.** A box
	// that gains `kind` or `owner` after construction is a different hidden class to the engine, and
	// the inner loop then reads every box property through a megamorphic lookup. One shape here is
	// worth a large fraction of the pass's running time on a 220-label drawing -- which is why the
	// two scoring fields live on the same object as the geometry rather than in a parallel table.
	function box(cx, cy, w, h, a, kind, owner) {
		return { cx: cx, cy: cy, w: w, h: h, a: a || 0, kind: kind, owner: owner };
	}
	// A box from a TOP-LEFT rect, which is the shape the rest of the editor speaks in.
	function boxFromRect(r, kind, owner) {
		return box(r.x + r.w / 2, r.y + r.h / 2, r.w, r.h, r.a || 0, kind, owner);
	}
	// The same, for a line obstacle -- one shape, for the same reason.
	function segment(ax, ay, bx, by, kind, owner) {
		return { ax: ax, ay: ay, bx: bx, by: by, kind: kind, owner: owner };
	}
	// The four corners, for DRAWING a box rather than for testing one -- ?debug=boxes puts every box
	// the pass reasoned about on screen as a polygon. Nothing in the inner loop calls this; the tests
	// there are written in scalars, for the reason boxOverlapDepth() gives.
	function boxAxes(b) {
		var rad = (b.a || 0) * Math.PI / 180, c = Math.cos(rad), s = Math.sin(rad);
		return [{ x: c, y: s }, { x: -s, y: c }];
	}
	function boxCorners(b) {
		var ax = boxAxes(b), hw = b.w / 2, hh = b.h / 2, out = [], i,
			signs = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
		for (i = 0; i < 4; i++) {
			out.push({
				x: b.cx + ax[0].x * hw * signs[i][0] + ax[1].x * hh * signs[i][1],
				y: b.cy + ax[0].y * hw * signs[i][0] + ax[1].y * hh * signs[i][1]
			});
		}
		return out;
	}
	// PENETRATION DEPTH of two oriented boxes: 0 when they are apart, otherwise the smallest
	// distance either would have to move along any separating-axis candidate to be apart. Four axes
	// suffice in 2D (each box's own two), which is the whole of SAT here.
	//
	// **WRITTEN IN SCALARS, WITH NO ARRAYS AND NO OBJECTS, AND THE REASON IS THE CLOCK.** This is
	// the innermost thing the pass does -- on a 220-label drawing it runs a few hundred thousand
	// times per frame of a drag -- and the readable version that builds axis and corner objects cost
	// about twenty allocations a call and made the whole pass 140ms. Same arithmetic, same answers
	// (fuzzed against the allocating version in dev/lpn-spike/collide-harness.js), a tenth of the
	// time. Two shortcuts do most of it: a circle reject, and an axis-aligned fast path for the pair
	// that is by far the most common -- two unrotated boxes.
	function boxOverlapDepth(A, B) {
		var tx = B.cx - A.cx, ty = B.cy - A.cy,
			ahw = A.w / 2, ahh = A.h / 2, bhw = B.w / 2, bhh = B.h / 2,
			reach = (Math.hypot(A.w, A.h) + Math.hypot(B.w, B.h)) / 2;
		// Further apart than the sum of their half-diagonals: cannot overlap, whatever their angles.
		if (tx * tx + ty * ty > reach * reach) { return 0; }
		var aa = A.a || 0, ba = B.a || 0, ox, oy;
		if (aa === 0 && ba === 0) {
			ox = ahw + bhw - Math.abs(tx);
			if (ox <= 0) { return 0; }
			oy = ahh + bhh - Math.abs(ty);
			if (oy <= 0) { return 0; }
			return ox < oy ? ox : oy;
		}
		var ra = aa * Math.PI / 180, rb = ba * Math.PI / 180,
			a0x = Math.cos(ra), a0y = Math.sin(ra), a1x = -a0y, a1y = a0x,
			b0x = Math.cos(rb), b0y = Math.sin(rb), b1x = -b0y, b1y = b0x,
			best = Infinity, o;
		// One axis at a time: the two boxes' extents along it, less the distance between centres.
		o = ahw + Math.abs(bhw * (b0x * a0x + b0y * a0y)) + Math.abs(bhh * (b1x * a0x + b1y * a0y))
			- Math.abs(tx * a0x + ty * a0y);
		if (o <= 0) { return 0; }
		if (o < best) { best = o; }
		o = ahh + Math.abs(bhw * (b0x * a1x + b0y * a1y)) + Math.abs(bhh * (b1x * a1x + b1y * a1y))
			- Math.abs(tx * a1x + ty * a1y);
		if (o <= 0) { return 0; }
		if (o < best) { best = o; }
		o = bhw + Math.abs(ahw * (a0x * b0x + a0y * b0y)) + Math.abs(ahh * (a1x * b0x + a1y * b0y))
			- Math.abs(tx * b0x + ty * b0y);
		if (o <= 0) { return 0; }
		if (o < best) { best = o; }
		o = bhh + Math.abs(ahw * (a0x * b1x + a0y * b1y)) + Math.abs(ahh * (a1x * b1x + a1y * b1y))
			- Math.abs(tx * b1x + ty * b1y);
		if (o <= 0) { return 0; }
		return o < best ? o : best;
	}
	// Shortest distance from a point to a SEGMENT (not to the infinite line): the cheap reject both
	// tests below open with.
	function pointToSegmentDistance(px, py, seg) {
		var vx = seg.bx - seg.ax, vy = seg.by - seg.ay, len2 = vx * vx + vy * vy, t;
		if (!len2) { return Math.hypot(px - seg.ax, py - seg.ay); }
		t = ((px - seg.ax) * vx + (py - seg.ay) * vy) / len2;
		t = t < 0 ? 0 : (t > 1 ? 1 : t);
		return Math.hypot(px - (seg.ax + vx * t), py - (seg.ay + vy * t));
	}
	// HOW MUCH OF A SEGMENT LIES INSIDE A BOX, as a fraction of its own length. Liang-Barsky in the
	// box's own frame, which is what makes rotation free: turn the segment into the box's axes and
	// the box is a plain rectangle again. In scalars for the same reason boxOverlapDepth() is -- this
	// is the other function the inner loop lives in.
	function segmentInBoxFraction(seg, b) {
		// A segment whose nearest point is further from the box's centre than its own half-diagonal
		// cannot enter it. One cheap test, and it rejects the overwhelming majority of pairs.
		var hw = b.w / 2, hh = b.h / 2;
		if (pointToSegmentDistance(b.cx, b.cy, seg) > Math.hypot(b.w, b.h) / 2) { return 0; }
		var rad = (b.a || 0) * Math.PI / 180, ux, uy, vx, vy;
		if (b.a) { ux = Math.cos(rad); uy = Math.sin(rad); } else { ux = 1; uy = 0; }
		vx = -uy; vy = ux;
		var ex = seg.ax - b.cx, ey = seg.ay - b.cy,
			fx = seg.bx - b.cx, fy = seg.by - b.cy,
			p0x = ex * ux + ey * uy, p0y = ex * vx + ey * vy,
			p1x = fx * ux + fy * uy, p1y = fx * vx + fy * vy,
			dx = p1x - p0x, dy = p1y - p0y, t0 = 0, t1 = 1, r;
		// The four edges, unrolled: p is the direction against that edge's outward normal, q the
		// distance to it.
		if (dx === 0) { if (p0x + hw < 0 || hw - p0x < 0) { return 0; } }
		else {
			r = (p0x + hw) / -dx;
			if (-dx < 0) { if (r > t1) { return 0; } if (r > t0) { t0 = r; } }
			else { if (r < t0) { return 0; } if (r < t1) { t1 = r; } }
			r = (hw - p0x) / dx;
			if (dx < 0) { if (r > t1) { return 0; } if (r > t0) { t0 = r; } }
			else { if (r < t0) { return 0; } if (r < t1) { t1 = r; } }
		}
		if (dy === 0) { if (p0y + hh < 0 || hh - p0y < 0) { return 0; } }
		else {
			r = (p0y + hh) / -dy;
			if (-dy < 0) { if (r > t1) { return 0; } if (r > t0) { t0 = r; } }
			else { if (r < t0) { return 0; } if (r < t1) { t1 = r; } }
			r = (hh - p0y) / dy;
			if (dy < 0) { if (r > t1) { return 0; } if (r > t0) { t0 = r; } }
			else { if (r < t0) { return 0; } if (r < t1) { t1 = r; } }
		}
		return t1 > t0 ? t1 - t0 : 0;
	}
	// Do two segments cross? Sign-of-cross-product test, no division, so a zero-length or parallel
	// pair answers false rather than NaN.
	function segmentsCross(p, q) {
		function cross(ax, ay, bx, by, cx, cy) {
			return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
		}
		var d1 = cross(p.ax, p.ay, p.bx, p.by, q.ax, q.ay),
			d2 = cross(p.ax, p.ay, p.bx, p.by, q.bx, q.by),
			d3 = cross(q.ax, q.ay, q.bx, q.by, p.ax, p.ay),
			d4 = cross(q.ax, q.ay, q.bx, q.by, p.bx, p.by);
		return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
	}

	// ---- candidates ----------------------------------------------------------------------------
	//
	// **THE ANGLE SET IS THE WHOLE OF THE "LEADERS LOOK BUSY" PROBLEM.** Tom, 2026-08-16, asked to
	// drop a leaders-agree-in-angle score term in favour of constraining the angles we ever propose:
	// *"constrain leader angles to be at multiples of 15 degrees and not orthogonal. In other words,
	// we don't check oddball angles, so we don't look ugly."*
	//
	// So every leader on the map lands on a shared 15-degree grid and none is horizontal or
	// vertical. Two goals collapse into this one list and stop being scored at all: the old goal 7
	// (leaders avoid orthogonality) is satisfied because an orthogonal direction is never generated,
	// and a leaders-agree-in-angle term is unnecessary because they cannot disagree by less than 15
	// degrees or land at an oddball angle in the first place.
	var RING_ANGLES = (function () {
		var out = [], d;
		for (d = 15; d < 360; d += 15) {
			if (d % 90 !== 0) { out.push(d); }
		}
		return out;   // 20 directions
	}());
	// **A COARSER ANGLE STEP ON EVERY CIRCLE INWARD.** Tom, 2026-08-16, having asked to *"economize
	// by omitting some of the angles on the nearer circle(s)"*, then designed the rule:
	//
	//     ring 1  multiples of 45   ->   4 directions
	//     ring 2  multiples of 30   ->   8 directions
	//     ring 3  multiples of 15   ->  20 directions
	//
	// (Orthogonal directions are dropped throughout, which is what makes those counts 4/8/20 rather
	// than 8/12/24.) It replaced a derivation that computed a step per circle from a target arc
	// length; this gets the same answer from a rule a person can hold in their head. Measured at the
	// shipped radii the arc between neighbours is 104 px on ring 1, 77-155 on ring 2 and 86-173 on
	// ring 3 -- near enough constant, which was the whole aim.
	//
	// **RINGS 1 AND 2 SHARE NO DIRECTION**, and that is by construction, not by accident: a
	// direction on both would be a multiple of 45 and of 30, hence of 90, and every multiple of 90
	// is orthogonal and already excluded. So ring 1 falls exactly between ring 2's directions and
	// the two interleave rather than repeat, which covers the plane better than nesting would. Both
	// are subsets of ring 3. Worth knowing before anyone "fixes" the gap.
	var RING_STEPS = [45, 30, 15];
	function anglesAt(step) {
		var out = [], d;
		for (d = 0; d < 360; d += step) {
			if (d % 90 !== 0) { out.push(d); }
		}
		return out;
	}
	// `steps` is one angular step per circle, innermost first; its LENGTH is how many circles there
	// are. Radii are geometric from `inner` to `outer`, so the near ones sit closer together, where
	// most placements land.
	function ringCandidates(anchor, inner, outer, steps) {
		var out = [], radii = [], i, ri, ai, rad, angs, ringOf = [], base, rings;
		steps = (steps && steps.length) ? steps : RING_STEPS;
		rings = steps.length;
		if (!(outer > inner)) { outer = inner; }
		base = rings > 1 ? Math.pow(outer / inner, 1 / (rings - 1)) : 1;
		for (i = 0; i < rings; i++) { radii.push(inner * Math.pow(base, i)); }
		for (ri = 0; ri < radii.length; ri++) {
			angs = anglesAt(steps[ri]);
			ringOf.push({ start: out.length, n: angs.length });
			for (ai = 0; ai < angs.length; ai++) {
				rad = angs[ai] * Math.PI / 180;
				out.push({
					x: anchor.x + radii[ri] * Math.cos(rad),
					y: anchor.y + radii[ri] * Math.sin(rad),
					radiusFrac: outer > 0 ? radii[ri] / outer : 0,
					_ri: ri, _ai: ai
				});
			}
		}
		// Neighbours are what the goal-11 term reads, and they are declared STRUCTURALLY: the two
		// directions either side on the same circle, plus the NEAREST direction on each adjacent
		// circle -- "nearest" because the circles deliberately do not share an angle list.
		out.forEach(function (c) {
			var me = ringOf[c._ri], n = me.n, list = [
				me.start + (c._ai + 1) % n,
				me.start + (c._ai + n - 1) % n
			], deg = Math.atan2(c.y - anchor.y, c.x - anchor.x);
			[c._ri - 1, c._ri + 1].forEach(function (rj) {
				if (rj < 0 || rj >= ringOf.length) { return; }
				var r2 = ringOf[rj], best = r2.start, bestD = Infinity, j, d2, a2;
				for (j = 0; j < r2.n; j++) {
					a2 = Math.atan2(out[r2.start + j].y - anchor.y, out[r2.start + j].x - anchor.x);
					d2 = Math.abs(Math.atan2(Math.sin(a2 - deg), Math.cos(a2 - deg)));
					if (d2 < bestD) { bestD = d2; best = r2.start + j; }
				}
				list.push(best);
			});
			c.neighbours = list;
			delete c._ri; delete c._ai;
		});
		return out;
	}
	// A DRAGGED LABEL'S CANDIDATES LIE ON A RAY, NOT ON A RING (goal 1). The user placed the
	// endpoint, so every candidate passes through it or is further out along the same line: *"They
	// can be stretched longer at the same angle."* The stored endpoint is first, and the distance
	// term keeps it there unless something is genuinely in the way -- so a dragged label that is
	// clear of everything does not move at all.
	var RAY_STRETCH = [1, 1.3, 1.7, 2.2];
	function rayCandidates(anchor, home) {
		var dx = home.x - anchor.x, dy = home.y - anchor.y, out = [], i;
		if (!dx && !dy) { return [{ x: home.x, y: home.y, neighbours: [] }]; }
		for (i = 0; i < RAY_STRETCH.length; i++) {
			out.push({
				x: anchor.x + dx * RAY_STRETCH[i], y: anchor.y + dy * RAY_STRETCH[i],
				neighbours: i === 0 ? [1] : (i === RAY_STRETCH.length - 1 ? [i - 1] : [i - 1, i + 1])
			});
		}
		return out;
	}
	// Every candidate a label will be scored at. `home` -- where it sits now -- is always in the set
	// so that "leave it alone" is a placement the pass can choose rather than a case it has to
	// special-case, and it carries the ring's two nearest directions as its neighbours.
	function candidatesFor(lbl, inner, outer, steps) {
		var cands, i, best = [0, 1], bestD = [Infinity, Infinity], d;
		if (lbl.dragged) { return rayCandidates(lbl.anchor, lbl.home); }
		cands = ringCandidates(lbl.anchor, inner, outer, steps);
		for (i = 0; i < cands.length; i++) {
			d = Math.hypot(cands[i].x - lbl.home.x, cands[i].y - lbl.home.y);
			if (d < bestD[0]) { bestD[1] = bestD[0]; best[1] = best[0]; bestD[0] = d; best[0] = i; }
			else if (d < bestD[1]) { bestD[1] = d; best[1] = i; }
		}
		cands.push({ x: lbl.home.x, y: lbl.home.y, neighbours: best });
		return cands;
	}

	// ---- the open-angle table: four cardinal corners, pruned by exact arcs (Task 411) -----------
	//
	// **THIS IS A REJECTION TEST, NOT A GENERATOR.** Tom, 2026-08-17: the four positions stay fixed
	// and cardinal -- top-right, top-left, bottom-right, bottom-left, tried in that order -- and the
	// table is what lets the placer SKIP one *"without looking at our model again at this moment."*
	// So nothing below queries the network. It is handed the incident bearings once, turns them into
	// arcs once, and every later question is answered against that little table.
	//
	// **WHY FOUR AND NOT EIGHT IS AN ANGULAR ARGUMENT.** A top-centre or bottom-centre label straddles
	// the vertical and blocks nearly half the circle as seen from the anchor; a corner label kept
	// entirely inside its own quadrant blocks only 70-80 degrees, so four of them still leave gaps for
	// a link to arrive through. Adding the centres closes those gaps, which is what disqualifies them.
	// Do not put them back. (Top-first is Imhof's ascender argument; right-first is convention.)
	//
	// **BEARINGS ARE y-DOWN, the sense atan2(dy, dx) returns**, so 0 is east, 90 is south, 270 north.
	// The quadrant a corner occupies is therefore 270-360 for TOP-right, not 0-90. The ROADMAP block
	// states the same test in y-up terms ("any dirty angle in 10-80 degrees for TR"); it is the same
	// question, one quarter turn round.
	var CORNERS = [
		{ name: 'TR', sx: 1, sy: -1, q0: 270, q1: 360 },
		{ name: 'TL', sx: -1, sy: -1, q0: 180, q1: 270 },
		{ name: 'BR', sx: 1, sy: 1, q0: 0, q1: 90 },
		{ name: 'BL', sx: -1, sy: 1, q0: 90, q1: 180 }
	];
	// **THE ONE TUNABLE, AND IT IS THE TUNABLE THAT DECIDES WHETHER ANY OF THIS WORKS.** A link is
	// never exactly orthogonal, so a corner's quadrant has to be narrowed at both ends before it is
	// asked whether anything arrives through it -- narrow by too little and every corner is rejected
	// on links that miss it by a degree; by too much and nothing is ever rejected at all. Tom's
	// estimate, 2026-08-17: 30 degrees is not practical, 15 may be, **5-10 is almost essential**.
	//
	// **THE DEFAULT BELOW IS PROVISIONAL AND AWAITS A MEASURED ANSWER FROM THE TESTER PANEL** (Task
	// 416). It is a live, mutable table of numbers with exactly the shape of GOAL_WEIGHT above, for
	// exactly the reason: the panel walks Object.keys() and builds a row per key, so a tunable added
	// here needs no panel code at all. Read it through the object on every call -- never copy the
	// number into a local at load time, or turning the knob would change nothing until a reload.
	var ANGLE_TUNING = {
		cornerTolerance: 8        // degrees shaved off EACH end of a corner's quadrant
	};
	function norm360(deg) {
		var d = deg % 360;
		return d < 0 ? d + 360 : d;
	}
	// THE TABLE. The open sectors at an anchor as EXACT ARCS -- the gaps between the incident
	// bearings, in order round the circle -- because the bearings are known exactly and bucketing
	// them into fixed wedges throws away precision we were handed free. A 183-degree opening is ONE
	// arc here, not four wedges that each read "clear".
	//
	// { start, end } in degrees, start in [0, 360) and end > start, so an arc that crosses zero says
	// so by running past 360 rather than by splitting in two. Nothing occupied is one arc of 360.
	// A pure function of the bearings, so it is view-independent and safe to cache beside them.
	function openArcs(bearings) {
		var bs = [], out = [], i, b, prev = null, n;
		for (i = 0; i < (bearings ? bearings.length : 0); i++) {
			b = bearings[i];
			if (typeof b === 'number' && isFinite(b)) { bs.push(norm360(b)); }
		}
		bs.sort(function (x, y) { return x - y; });
		// TWO PIPES ON THE SAME BEARING BLOCK ONCE. Without this the pair yields a zero-width gap and
		// a node with one direction on it yields no arc at all rather than the whole circle but a ray.
		for (i = 0; i < bs.length; i++) {
			if (prev === null || bs[i] - prev > 1e-9) { out.push(bs[i]); prev = bs[i]; }
		}
		bs = out;
		n = bs.length;
		if (!n) { return [{ start: 0, end: 360 }]; }
		if (n === 1) { return [{ start: bs[0], end: bs[0] + 360 }]; }
		out = [];
		for (i = 0; i < n; i++) {
			b = bs[(i + 1) % n];
			out.push({ start: bs[i], end: bs[i] + (i + 1 < n ? b - bs[i] : b + 360 - bs[i]) });
		}
		return out;
	}
	// Does any ONE arc hold the whole range [a0, a1]? Asked in the arc's own frame, so the wrap is
	// arithmetic rather than a case: how far a0 lies round from the arc's start, plus the range's own
	// width, against the arc's width.
	function arcHolds(arcs, a0, a1) {
		var i, arc, d0, w = a1 - a0;
		if (w <= 0) { return true; }
		for (i = 0; i < (arcs ? arcs.length : 0); i++) {
			arc = arcs[i];
			d0 = norm360(a0 - arc.start);
			if (d0 + w <= arc.end - arc.start + 1e-9) { return true; }
		}
		return false;
	}
	// THE LOOKUP THE PLACER MAKES, once per corner: is this corner's narrowed quadrant free of every
	// incident bearing? One walk of an array with as many entries as the node has pipes -- two on
	// most of a real network -- and no access to the model at all. That is the whole saving.
	function cornerIsOpen(arcs, i, tol) {
		var c = CORNERS[i];
		tol = tol >= 0 ? tol : ANGLE_TUNING.cornerTolerance;
		if (tol >= 45) { tol = 44.9; }   // a tolerance that eats its own quadrant rejects nothing
		return arcHolds(arcs, c.q0 + tol, c.q1 - tol);
	}
	// The corners that survive, as indices into CORNERS, in the fixed attempt order.
	function openCorners(arcs, tol) {
		var out = [], i;
		for (i = 0; i < CORNERS.length; i++) { if (cornerIsOpen(arcs, i, tol)) { out.push(i); } }
		return out;
	}
	// The widest arc, for the raster to sample inside. A tie goes to the earlier one, which is the
	// lower bearing, so the answer does not depend on the order the links were drawn in.
	function widestArc(arcs) {
		var best = null, i, w, bw = -1;
		for (i = 0; i < (arcs ? arcs.length : 0); i++) {
			w = arcs[i].end - arcs[i].start;
			if (w > bw) { bw = w; best = arcs[i]; }
		}
		return best;
	}
	// **POLAR, NOT RECTANGULAR, AND THAT FOLLOWS FROM THE SHAPE OF WHAT IS BEING SAMPLED.** A sector
	// is bounded by two angles and a radius, so a polar grid needs no rejection step at all, where a
	// rectangular one samples a square and throws most of it away. Radii are geometric inner->outer
	// for the reason ringCandidates() uses them: the near ones sit closer together, where placements
	// land.
	//
	// Nearest radius first, and within a ring the angles nearest the arc's BISECTOR first, so a
	// first-fit walking this list in order meets the most open direction at the shortest leader
	// before anything else. Orthogonal directions are dropped throughout, exactly as the ring
	// generator drops them: a horizontal or vertical leader is what the 15-degree grid exists to
	// avoid, and a raster is not an excuse to reintroduce one.
	function polarCandidates(anchor, arc, inner, outer, opts) {
		opts = opts || {};
		var step = opts.angleStep > 0 ? opts.angleStep : 15,
			rings = opts.rings > 0 ? opts.rings : 3,
			tol = opts.tol >= 0 ? opts.tol : ANGLE_TUNING.cornerTolerance,
			max = opts.max > 0 ? opts.max : 24,
			out = [], angs = [], radii = [], a, base, i, j, mid, lo, hi, rad;
		if (!arc || !(inner > 0)) { return out; }
		if (!(outer > inner)) { outer = inner; }
		lo = arc.start + tol; hi = arc.end - tol;
		if (!(hi > lo)) { return out; }
		mid = (lo + hi) / 2;
		for (a = Math.ceil(lo / step) * step; a <= hi + 1e-9; a += step) {
			if (norm360(a) % 90 === 0) { continue; }
			angs.push(a);
		}
		angs.sort(function (x, y) { return Math.abs(x - mid) - Math.abs(y - mid); });
		base = rings > 1 ? Math.pow(outer / inner, 1 / (rings - 1)) : 1;
		for (i = 0; i < rings; i++) { radii.push(inner * Math.pow(base, i)); }
		for (i = 0; i < radii.length; i++) {
			for (j = 0; j < angs.length; j++) {
				if (out.length >= max) { return out; }
				rad = angs[j] * Math.PI / 180;
				out.push({
					x: anchor.x + radii[i] * Math.cos(rad),
					y: anchor.y + radii[i] * Math.sin(rad),
					corner: -1, deg: norm360(angs[j])
				});
			}
		}
		return out;
	}
	/**
	 * THE WHOLE PIPELINE, in the shape of the `sides` list placeLabelsFirstFit() consumes: the four
	 * corners in their fixed order with the blocked ones dropped, then -- and only then -- a polar
	 * raster inside the widest open arc.
	 *
	 *   anchor   {x, y}
	 *   offset   {x, y}, the resting label offset; its MAGNITUDE is what the corners are built from,
	 *            so a corner sits the same distance out whichever way the stored offset is signed.
	 *   arcs     openArcs(bearings) -- the table, computed once per node and cached with the bearings
	 *   opts     { tol, outer, raster, angleStep, rings, max }
	 *
	 * **RASTER ONLY AFTER THE FOUR ARE EXHAUSTED** is preserved by the ORDER, not by a second call:
	 * the first-fit stops at the first clear side, so a raster point is reached only once all four
	 * corners have been rejected here or found occupied there. Generating them costs no obstacle
	 * query, which is why the ordering is enough.
	 *
	 * **PRUNING MUST NOT EMPTY THE SET.** A node with pipes into every quadrant rejects all four, and
	 * returning nothing there would mean its label is never placed even where there is ample room
	 * further out -- so the four come back in their fixed order as the last resort. Rejection is an
	 * ordering and skipping device; it is not a veto on labelling a node.
	 */
	function cardinalSides(anchor, offset, arcs, opts) {
		opts = opts || {};
		var dx = Math.abs((offset && offset.x) || 0), dy = Math.abs((offset && offset.y) || 0),
			tol = opts.tol >= 0 ? opts.tol : ANGLE_TUNING.cornerTolerance,
			open = openCorners(arcs, tol), out = [], i,
			home = Math.hypot(dx, dy), outer = opts.outer > 0 ? opts.outer : home * 3;
		function endpointOf(k) {
			var c = CORNERS[k];
			return { x: anchor.x + c.sx * dx, y: anchor.y + c.sy * dy, corner: k, deg: null };
		}
		if (!open.length) {
			for (i = 0; i < CORNERS.length; i++) { out.push(endpointOf(i)); }
		} else {
			for (i = 0; i < open.length; i++) { out.push(endpointOf(open[i])); }
		}
		if (opts.raster) {
			polarCandidates(anchor, widestArc(arcs), home, outer, opts).forEach(function (p) {
				out.push(p);
			});
		}
		return out;
	}

	// ---- scoring -------------------------------------------------------------------------------
	//
	// WHERE THE TEXT SITS relative to a candidate ENDPOINT: it hangs off the endpoint on the side
	// AWAY from the anchor, so the leader stops at the box's near edge and never runs through its
	// own text. That is goal 3 for a label's own leader, satisfied by construction.
	//
	// **AND IT IS THE RENDERER'S RULE, because the renderer was changed to match rather than this
	// pass being taught to predict it.** dataLabelOrigin() used to apply Geom.labelSideAtEnd()'s
	// hysteresis to auto-placed labels too, which holds the PREVIOUS side inside a dead band either
	// side of the anchor's vertical line and so could draw the box back over the node -- the leader
	// then crossed the width of its own text, which is the defect Tom photographed on 2026-08-16.
	// Tom: *"we only have to check for violation on the nearest side. We have no reason to check the
	// other side because we will never use it."* The hysteresis now applies only while a user drags
	// a label, so the far side is genuinely unreachable here and there is nothing to model.
	function labelBoxAtEnd(lbl, c) {
		var left = c.x >= lbl.anchor.x ? c.x : c.x - lbl.w;
		return box(left + lbl.w / 2, c.y + lbl.yOff + lbl.h / 2, lbl.w, lbl.h, 0, 'label', lbl.id);
	}
	// **ONE BOX PER LINE, NOT ONE BOX FOR THE STACK** (ROADMAP Task 406).
	//
	// A stacked label is a STAIRCASE, not a rectangle. Its lines have different widths -- "J12"
	// over "48.3 psi" over "0.5 L/s" -- and one box around all of them claims the empty ground to
	// the right of every short line, which is exactly where a neighbour's label would otherwise fit.
	// The block box was also unable to express the thing Task 399 creates: once shedding drops some
	// lines and keeps others, the footprint is a different shape, not merely a shorter one.
	//
	// `lbl.lines` is an array of per-line WIDTHS, top to bottom, in the same units as `lbl.w`. When
	// it is absent -- a Text object, a single-line label, any caller that has not measured its rows
	// -- this returns the one whole box, so nothing changes for them by construction.
	//
	// The lines are anchored on the SAME EDGE the block is: a label to the right of its endpoint is
	// start-aligned there, a label to the left is end-aligned, which is how the renderer's
	// text-anchor works. Getting that backwards would make the staircase lean the wrong way and be
	// nearly invisible on screen.
	function labelLineBoxes(lbl, c) {
		var whole = labelBoxAtEnd(lbl, c), n = lbl.lines && lbl.lines.length,
			toRight = c.x >= lbl.anchor.x, top = whole.cy - lbl.h / 2, lh, out = [], i, w, left;
		if (!n || n < 2) { return [whole]; }
		lh = lbl.h / n;
		for (i = 0; i < n; i++) {
			w = lbl.lines[i] > 0 ? lbl.lines[i] : 0;
			if (!w) { continue; }   // a blank row occupies no ground and must not claim any
			left = toRight ? c.x : c.x - w;
			out.push(box(left + w / 2, top + lh * (i + 0.5), w, lh, 0, 'label', lbl.id));
		}
		return out.length ? out : [whole];
	}
	// Every penalty is normalised into roughly [0, 1] before its goal weight is applied, so the
	// ranks compare like with like: a box overlap is measured in the label's own heights, a line
	// through a box as the fraction of that line inside it, and distance against the outer radius.
	// Without that a term would be loud or quiet according to the units it happens to be in, and the
	// ranking would say nothing.
	// **THE WORST LINE, NOT THE SUM OF THE LINES** (Task 406). Every term here is normalised into
	// roughly [0, 1] so the goal ranks compare like with like; summing over rows would make a
	// three-line label's overlap score three times a one-line label's for the same collision, and
	// the ranking would start describing the label's height instead of the conflict.
	function worstOverLines(boxes, fn) {
		var m = 0, i, v;
		for (i = 0; i < boxes.length; i++) { v = fn(boxes[i]); if (v > m) { m = v; } }
		return m;
	}
	function rawScore(lbl, c, obs, outer) {
		var lines = labelLineBoxes(lbl, c),
			leader = segment(lbl.anchor.x, lbl.anchor.y, c.x, c.y, 'leader', lbl.id),
			s = 0, i, o, depth;
		for (i = 0; i < obs.boxes.length; i++) {
			o = obs.boxes[i];
			if (o.owner !== undefined && o.owner === lbl.id) { continue; }
			depth = worstOverLines(lines, function (lb) { return boxOverlapDepth(lb, o); });
			if (depth > 0) {
				s += (o.kind === 'symbol' ? GOAL_WEIGHT.labelSymbol : GOAL_WEIGHT.labelLabel)
					* Math.min(1, depth / lbl.h);
			}
			if (o.kind === 'symbol') {
				s += GOAL_WEIGHT.leaderSymbol * segmentInBoxFraction(leader, o);
			}
		}
		for (i = 0; i < obs.segments.length; i++) {
			o = obs.segments[i];
			// A LINK LABEL SITS ON ITS OWN PIPE BY DESIGN -- that is how a reader tells whose number
			// it is -- so its own LINK is exempt by ownership rather than by a special case.
			// ITS OWN LEADER IS NOT EXEMPT. Goal 3 is "Labels avoid Leaders **including their
			// own**", and this line used to exempt every segment it owned, leader included, so the
			// one violation a reader notices most could not be scored even in principle.
			if (o.owner !== undefined && o.owner === lbl.id && o.kind !== 'leader') { continue; }
			s += (o.kind === 'leader' ? GOAL_WEIGHT.labelLeader : GOAL_WEIGHT.labelLink)
				* worstOverLines(lines, function (lb) { return segmentInBoxFraction(o, lb); });
			if (o.kind === 'link' && segmentsCross(leader, o)) { s += GOAL_WEIGHT.leaderLink; }
		}
		// Goal 3 for THIS label's own leader. It is not in obs.segments yet -- the pass commits each
		// leader only once its label is placed -- so it is scored here, and it is 0 for every
		// correctly attached leader.
		s += GOAL_WEIGHT.distance * Math.min(1, Math.hypot(c.x - lbl.anchor.x, c.y - lbl.anchor.y) / outer);
		return s;
	}
	// **GOAL 11 IS NOT A RANK. IT IS A TERM ON THE SCORE FIELD.** Tom, 2026-08-16: *"Not only
	// consider the point with lowest score. Also give some algorithmic credit for having neighbors
	// with low scores."*
	//
	//     effective(c) = raw(c) + k * mean(raw over c's neighbours)
	//
	// Not circular: neighbours contribute their RAW scores, so this is one pass and never an
	// iteration. "Favour open space" stops being a goal to arrange for and becomes a property of the
	// field being searched. It is also most of goal 9 for free -- the minimum of a smoothed field
	// moves less under a small perturbation than the minimum of a raw one, which is exactly "a small
	// change nearby should not rearrange the whole map".
	function effectiveScores(raw, cands, k) {
		var out = [], i, j, sum, n;
		for (i = 0; i < raw.length; i++) {
			sum = 0; n = cands[i].neighbours.length;
			for (j = 0; j < n; j++) { sum += raw[cands[i].neighbours[j]]; }
			out.push(raw[i] + (n ? k * sum / n : 0));
		}
		return out;
	}

	// ---- the pass ------------------------------------------------------------------------------
	//
	// **HARDEST FIRST.** Tom, 2026-08-16: *"high order junctions are more difficult, not more
	// important. Let the easy ones go last."* Difficulty is measured as how much is already within
	// reach of the label -- a junction in a thicket has few good candidates and should choose while
	// there are still any; a label in open country will be fine whenever it goes. Dragged labels are
	// placed before all of them because they barely move, so everyone else should see where they are
	// before choosing.
	//
	// The order must not depend on anything a user changes by clicking, or labels rearrange
	// themselves for reasons nobody can see; congestion and the id are both stable.
	function difficultyOf(lbl, obs, reach) {
		var n = 0, i, o, r2 = reach * reach, dx, dy;
		for (i = 0; i < obs.boxes.length; i++) {
			o = obs.boxes[i];
			dx = o.cx - lbl.anchor.x; dy = o.cy - lbl.anchor.y;
			if (dx * dx + dy * dy < r2) { n++; }
		}
		for (i = 0; i < obs.segments.length; i++) {
			o = obs.segments[i];
			dx = (o.ax + o.bx) / 2 - lbl.anchor.x; dy = (o.ay + o.by) / 2 - lbl.anchor.y;
			if (dx * dx + dy * dy < r2) { n++; }
		}
		return n;
	}
	/**
	 * Place every label in `labels`, hardest first, each against everything already committed.
	 *
	 *   labels    [{ id, anchor:{x,y}, home:{x,y}, w, h, yOff, dragged }]
	 *   obstacles { boxes: [{cx,cy,w,h,a,kind,owner}], segments: [{ax,ay,bx,by,kind,owner}] }
	 *             kinds: box 'label' | 'symbol'; segment 'leader' | 'link'.
	 *   opts      { inner, outer, k }
	 *
	 * Returns [{ id, x, y, dx, dy, score }] -- the chosen endpoint, its offset from `home` (which is
	 * what the caller writes as the label's nudge), and its effective score. Nothing is mutated:
	 * every input object is read and none is written, which is what lets a harness score the same
	 * arrangement twice and compare.
	 *
	 * IDEMPOTENT BY CONSTRUCTION: the answer is a function of the inputs alone, with no carried
	 * state and no previous nudge read anywhere. Running it twice on an unchanged drawing gives the
	 * same answer as running it once, to the bit.
	 *
	 * **AND IT HAS NO RANGE PROBLEM TO CAP.** The relaxation it replaced could carry a label most of
	 * the way across the map (median 85 screen pixels on Net3, worst 301) because an unbounded
	 * solver in an over-constrained problem does not fail, it wanders -- so a cap had to be bolted
	 * on afterwards, and scaling an over-long push back along its own vector frequently landed the
	 * label back inside the collision the pass had just solved, with nothing re-run. Here every
	 * candidate is within `outer` of the anchor by construction, so there is nothing to cap and
	 * nothing to undo.
	 */
	// **EVERY CANDIDATE IS WITHIN `outer` OF THE ANCHOR, SO EVERYTHING FURTHER THAN THAT IS NOT AN
	// OBSTACLE TO THIS LABEL -- AND THE PASS IS UNUSABLE WITHOUT SAYING SO.** Measured on 220 labels,
	// which is Net3's own count, and the pass re-runs on every frame of a drag: scoring every
	// candidate against every obstacle took **1.5 seconds**. Against only what is in range, through
	// the grid below, it is a few tens of milliseconds.
	//
	// A UNIFORM GRID rather than a scan, because the scan is O(labels x obstacles) and that term
	// grows as the pass commits each label it places -- so the cost is quadratic in exactly the
	// drawings that need the pass most. The cell is the query radius, so a query is always the 3x3
	// block around the anchor whatever the drawing looks like.
	//
	// The radius is generous on purpose: `outer` reaches the furthest candidate ENDPOINT, and the
	// label hangs off that endpoint, so the far corner of its box is another half-diagonal out.
	// Erring wide here costs a few tests; erring narrow silently stops seeing real conflicts, which
	// is the kind of defect that looks like a taste problem.
	// **THE INDEX HOLDS INDICES, NOT THE CALLER'S OBJECTS, AND THE DEDUPLICATION IS A STAMP ARRAY
	// BESIDE THEM.** An obstacle that spans two cells is found twice by a 3x3 query and would be
	// scored twice -- a silent doubling of one goal's weight, for no reason a reader could ever see.
	// The obvious fix is a visit mark on the obstacle itself; this one writes the mark into the
	// index's own array instead, so the caller's obstacles come back exactly as they went in. That
	// matters more than it looks: a pass that scribbles on its inputs cannot be run twice on the
	// same data to check that it agrees with itself, which is the cheapest strong assertion there is.
	function grid(cell, obs) {
		// A ZERO OR NON-FINITE CELL IS FATAL, NOT MERELY WRONG: span() divides by it, so Math.floor
		// gives +/-Infinity and the fill loop never terminates. The reach became a function of the
		// labels themselves (Tom's 5-label-sizes ruling), so an EMPTY label set now yields 0 here
		// where the old fixed-pixel reach could not -- a drawing with no labels at all crashed the
		// pass. Guarded at the seam rather than at each caller.
		if (!(cell > 0) || !isFinite(cell)) { cell = 1; }
		// **AND A CELL THAT IS MERELY TINY IS FATAL IN THE SAME WAY, one order of magnitude at a
		// time.** span() fills every cell an obstacle's bounding box touches, so a link L long
		// indexed at cell c occupies (L/c)^2 cells. The reach is derived from the LABEL sizes and
		// the obstacles are the DRAWING, and nothing ties the two together: arriving at Net3 with
		// the scale still set by a lat/lon project made the labels microscopic in world units while
		// the pipes stayed thousands of units long, and one tab switch spent **16.4 s, 97% of it in
		// span() and the garbage collector it fed** (measured 2026-08-19 by CPU profile).
		//
		// RAISING the cell is always SAFE and only ever costs speed: near() answers a query of
		// radius r with the 3x3 block around the point, which covers r for any cell >= r, and every
		// candidate it returns is then put through the same exact distance test obstaclesInReach()
		// uses. So a bigger cell can only hand the narrow phase more candidates to reject, never
		// fewer to consider. LOWERING it would be the unsafe direction, and nothing here does that.
		var extent = 0, ii;
		for (ii = 0; ii < obs.segments.length; ii++) {
			extent = Math.max(extent, Math.abs(obs.segments[ii].bx - obs.segments[ii].ax),
				Math.abs(obs.segments[ii].by - obs.segments[ii].ay));
		}
		for (ii = 0; ii < obs.boxes.length; ii++) {
			extent = Math.max(extent, Math.hypot(obs.boxes[ii].w, obs.boxes[ii].h));
		}
		// 64 cells across the largest obstacle: still a fine grid for the drawing it is indexing,
		// and it caps the index at 64^2 entries for the worst obstacle instead of unbounded.
		if (isFinite(extent) && extent > 0 && extent / cell > 64) { cell = extent / 64; }
		var cells = new Map(), stamp = 0, bStamp = [], sStamp = [];
		function key(i, j) { return i * 4294967296 + j; }
		function put(list, i, j, idx) {
			var k = key(i, j), c = cells.get(k);
			if (!c) { c = { boxes: [], segments: [] }; cells.set(k, c); }
			c[list].push(idx);
		}
		function span(x0, y0, x1, y1, list, idx) {
			var i, j, i0 = Math.floor(x0 / cell), i1 = Math.floor(x1 / cell),
				j0 = Math.floor(y0 / cell), j1 = Math.floor(y1 / cell);
			for (i = i0; i <= i1; i++) { for (j = j0; j <= j1; j++) { put(list, i, j, idx); } }
		}
		return {
			addBox: function (idx) {
				var b = obs.boxes[idx], r = Math.hypot(b.w, b.h) / 2;
				span(b.cx - r, b.cy - r, b.cx + r, b.cy + r, 'boxes', idx);
			},
			addSegment: function (idx) {
				var g = obs.segments[idx];
				span(Math.min(g.ax, g.bx), Math.min(g.ay, g.by),
					Math.max(g.ax, g.bx), Math.max(g.ay, g.by), 'segments', idx);
			},
			// The 3x3 block around a point -- every cell a query of radius `cell` can reach -- and
			// then the SAME distance test obstaclesInReach() applies, so the set that comes out is
			// exactly the set the definition would have produced and the scores cannot differ.
			//
			// **BOTH HALVES ARE LOAD-BEARING.** Without the grid the scan is O(obstacles) per label
			// and quadratic overall. Without the distance test the 3x3 block is a square of side
			// three radii, about three times the area of the circle it stands in for, and the extra
			// obstacles are then scored against all seventeen candidates -- measured at 79ms against
			// 43ms for the honest circle on a 220-label drawing. A broad-phase index that hands its
			// output straight to the narrow phase is not an optimisation, it is a bigger problem.
			near: function (x, y, r, out) {
				var i0 = Math.floor(x / cell) - 1, j0 = Math.floor(y / cell) - 1, i, j, c, k, idx, o;
				stamp++;
				out.boxes.length = 0; out.segments.length = 0;
				for (i = i0; i <= i0 + 2; i++) {
					for (j = j0; j <= j0 + 2; j++) {
						c = cells.get(key(i, j));
						if (!c) { continue; }
						for (k = 0; k < c.boxes.length; k++) {
							idx = c.boxes[k];
							if (bStamp[idx] === stamp) { continue; }
							bStamp[idx] = stamp;
							o = obs.boxes[idx];
							if (Math.hypot(o.cx - x, o.cy - y) < r + Math.hypot(o.w, o.h) / 2) {
								out.boxes.push(o);
							}
						}
						for (k = 0; k < c.segments.length; k++) {
							idx = c.segments[k];
							if (sStamp[idx] === stamp) { continue; }
							sStamp[idx] = stamp;
							o = obs.segments[idx];
							if (pointToSegmentDistance(x, y, o) < r) { out.segments.push(o); }
						}
					}
				}
				return out;
			}
		};
	}
	// The same question asked of a plain list. Kept because it is the DEFINITION the grid has to
	// agree with, and collide-harness.js compares the two member by member for every label on its
	// crowded fixture -- which is the only thing that makes the index safe to trust. A broad phase
	// that quietly drops an obstacle produces a layout that looks fine and is wrong in one place
	// nobody will ever find.
	function obstaclesInReach(lbl, obs, reach) {
		var r = reach + Math.hypot(lbl.w, lbl.h),
			out = { boxes: [], segments: [] }, i, o;
		for (i = 0; i < obs.boxes.length; i++) {
			o = obs.boxes[i];
			if (Math.hypot(o.cx - lbl.anchor.x, o.cy - lbl.anchor.y) < r + Math.hypot(o.w, o.h) / 2) {
				out.boxes.push(o);
			}
		}
		for (i = 0; i < obs.segments.length; i++) {
			o = obs.segments[i];
			if (pointToSegmentDistance(lbl.anchor.x, lbl.anchor.y, o) < r) { out.segments.push(o); }
		}
		return out;
	}
	// **"DOES THIS BOX TOUCH ANYTHING?" ASKED OF A PLAIN LIST -- THE DEFINITION.** boxIndex() below
	// has to give this answer, box for box, on every input; aligned-shed-index-harness.js compares
	// the two before it counts anything.
	function anyBoxOverlap(q, boxes) {
		var i;
		for (i = 0; i < boxes.length; i++) {
			if (boxOverlapDepth(q, boxes[i]) > 0) { return true; }
		}
		return false;
	}
	// A box bigger than this many cells is not binned at all -- it goes in `big` and is tested on
	// every query. One box across a whole map would otherwise fill the index by itself.
	var BOX_INDEX_MAX_CELLS = 4096;
	/**
	 * THE SAME QUESTION THROUGH A UNIFORM GRID, AND IT IS THE SAME ANSWER (ROADMAP Task 436).
	 *
	 * WHY IT EXISTS. shedAlignedForConflicts() asks boxIsClear() about one label at a time and each
	 * label it places becomes an obstacle for the next, so the walk it was doing grew with the
	 * drawing twice over: more labels asking, and more boxes to walk each time. Measured on the grid
	 * dev/browser-pass/specs/perf.js builds, 112 pipes cost 231 overlap tests per label and 480 pipes
	 * cost 860 -- the per-label rate rising with the drawing is the whole defect.
	 *
	 * **EXACT, NOT APPROXIMATE, AND THE REASON IS THAT THIS IS NOT A SCORE.** A near-miss here does
	 * not cost a fraction of a point, it takes a number off an engineering drawing. So the broad
	 * phase can only ever hand the narrow phase MORE candidates than it needs, never fewer: two
	 * boxes that overlap have bounding boxes that overlap, floor() is monotone, so their cell ranges
	 * overlap and they always share a cell. Every candidate then goes through the same
	 * boxOverlapDepth() the walk used, so the boolean cannot differ.
	 *
	 * **AN APPEND-ONLY GRID THAT SYNCS ON QUERY, rather than a tree.** The obstacle list MUTATES
	 * during the pass -- this is the difference from Task 472's segment index, which could be built
	 * once and held because a zoom changes scale and not topology. The choice was between a
	 * structure that rebalances on insert (an R-tree) and one that does not, and a grid does not:
	 * an insert is a floor() and a push into each cell the box's bounding box touches, with no
	 * rebalance and no comparison against anything already stored. It also means the index need not
	 * be told about the insert at all. It reads `boxes.length` on each query and bins whatever
	 * arrived since, so **any code anywhere that pushes onto the caller's array is picked up** and
	 * no call site had to change. That holds because the array is APPEND-ONLY; a splice would strand
	 * indices, which is why the index stores indices and would notice.
	 *
	 * The cell is the MEDIAN box diagonal of whatever is present at the first query -- a median
	 * rather than a maximum so that one map-wide Text label cannot coarsen the grid into a single
	 * cell, and that outlier lands in `big` instead.
	 */
	function boxIndex(boxes) {
		var cells = new Map(), big = [], next = 0, cell = 0,
			stamp = 0, seen = [], self;
		function key(i, j) { return i * 4294967296 + j; }
		// The AXIS-ALIGNED bounds of an oriented box. Tighter than the half-diagonal circle grid()
		// bins by, which matters here because an aligned label lying along a diagonal pipe is long
		// and thin and its circle is mostly empty.
		function bounds(b) {
			var c = boxCorners(b), i,
				x0 = c[0].x, y0 = c[0].y, x1 = c[0].x, y1 = c[0].y;
			for (i = 1; i < 4; i++) {
				if (c[i].x < x0) { x0 = c[i].x; }
				if (c[i].x > x1) { x1 = c[i].x; }
				if (c[i].y < y0) { y0 = c[i].y; }
				if (c[i].y > y1) { y1 = c[i].y; }
			}
			return { x0: x0, y0: y0, x1: x1, y1: y1 };
		}
		function finite(bb) {
			return isFinite(bb.x0) && isFinite(bb.y0) && isFinite(bb.x1) && isFinite(bb.y1);
		}
		function pickCell() {
			var ds = [], i, d;
			for (i = 0; i < boxes.length; i++) {
				d = Math.hypot(boxes[i].w, boxes[i].h);
				if (isFinite(d) && d > 0) { ds.push(d); }
			}
			if (!ds.length) { return 0; }
			ds.sort(function (a, b) { return a - b; });
			return ds[ds.length >> 1];
		}
		function insert(idx) {
			var bb = bounds(boxes[idx]);
			// A box with a non-finite corner cannot be binned and must not be LOST: boxOverlapDepth()
			// decides what a NaN box overlaps, not this.
			if (!finite(bb)) { big.push(idx); return; }
			var i0 = Math.floor(bb.x0 / cell), i1 = Math.floor(bb.x1 / cell),
				j0 = Math.floor(bb.y0 / cell), j1 = Math.floor(bb.y1 / cell), i, j, k, c;
			if ((i1 - i0 + 1) * (j1 - j0 + 1) > BOX_INDEX_MAX_CELLS) { big.push(idx); return; }
			for (i = i0; i <= i1; i++) {
				for (j = j0; j <= j1; j++) {
					k = key(i, j); c = cells.get(k);
					if (!c) { c = []; cells.set(k, c); }
					c.push(idx);
				}
			}
		}
		function sync() {
			if (next >= boxes.length) { return; }
			// Deferred until there is something to measure: a cell chosen from an EMPTY list is a
			// guess, and it would then stand for the whole pass.
			if (!cell) {
				cell = pickCell();
				if (!(cell > 0) || !isFinite(cell)) { cell = 1; }
			}
			for (; next < boxes.length; next++) { insert(next); }
		}
		function hit(idx, q) {
			if (seen[idx] === stamp) { return false; }
			seen[idx] = stamp;
			self.tests++;
			return boxOverlapDepth(q, boxes[idx]) > 0;
		}
		self = {
			// Overlap tests actually performed, for a harness to count. The point of the index is
			// that this rises with the QUERY's neighbourhood and not with the drawing.
			tests: 0,
			// True iff any box in the list overlaps `q` -- the same boolean anyBoxOverlap() gives.
			anyOverlap: function (q) {
				sync();
				// A FRESH STAMP FIRST, before anything reads seen[]: the deduplication is what
				// stops a box that spans several cells being tested twice, and a stamp bumped
				// half way through the query would let one through.
				stamp++;
				var i;
				for (i = 0; i < big.length; i++) {
					if (hit(big[i], q)) { return true; }
				}
				if (!boxes.length) { return false; }
				var bb = bounds(q);
				if (!finite(bb)) {
					// Nothing to bin a query by, so ask the definition. Exact, merely slow, and it
					// is the case boxOverlapDepth() rejects on its first line anyway.
					for (i = 0; i < boxes.length; i++) {
						if (hit(i, q)) { return true; }
					}
					return false;
				}
				var i0 = Math.floor(bb.x0 / cell), i1 = Math.floor(bb.x1 / cell),
					j0 = Math.floor(bb.y0 / cell), j1 = Math.floor(bb.y1 / cell), j, c, k;
				if ((i1 - i0 + 1) * (j1 - j0 + 1) > BOX_INDEX_MAX_CELLS) {
					for (i = 0; i < boxes.length; i++) {
						if (hit(i, q)) { return true; }
					}
					return false;
				}
				for (i = i0; i <= i1; i++) {
					for (j = j0; j <= j1; j++) {
						c = cells.get(key(i, j));
						if (!c) { continue; }
						for (k = 0; k < c.length; k++) {
							if (hit(c[k], q)) { return true; }
						}
					}
				}
				return false;
			}
		};
		return self;
	}
	function placeLabels(labels, obstacles, opts) {
		opts = opts || {};
		// **ONE REACH FOR THE WHOLE PASS, NOT ONE PER LABEL.** Tom, 2026-08-16: *"A single one is
		// better, I think. I didn't specify per label."* The caller sets it from the text size, so
		// it already scales with the lettering; deriving it from each label's own box as well would
		// give a four-line label a bigger world to search than a two-line one beside it, for no
		// reason a reader could see.
		var inner = opts.inner > 0 ? opts.inner : 1,
			outer = opts.outer > 0 ? opts.outer : inner * 5,
			steps = (opts.steps && opts.steps.length) ? opts.steps : RING_STEPS,
			k = opts.k === undefined ? 0.25 : opts.k,
			obs = { boxes: obstacles.boxes.slice(), segments: obstacles.segments.slice() },
			order = labels.slice(), out = [], maxDiag = 0,
			local = { boxes: [], segments: [] }, index;
		labels.forEach(function (l) { maxDiag = Math.max(maxDiag, Math.hypot(l.w, l.h)); });
		index = grid(outer + maxDiag, obs);
		obs.boxes.forEach(function (b, i) { index.addBox(i); });
		obs.segments.forEach(function (g, i) { index.addSegment(i); });
		order.forEach(function (l) {
			l._diff = difficultyOf(l, index.near(l.anchor.x, l.anchor.y, outer + Math.hypot(l.w, l.h), local), outer);
		});
		order.sort(function (a, b) {
			if (!!b.dragged !== !!a.dragged) { return b.dragged ? 1 : -1; }
			if (b._diff !== a._diff) { return b._diff - a._diff; }
			return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
		});
		order.forEach(function (lbl) {
			var cands = candidatesFor(lbl, inner, outer, steps), raw = [], eff, i, best = 0,
				bandStart, bandBound, bestRaw = Infinity;
			index.near(lbl.anchor.x, lbl.anchor.y, outer + Math.hypot(lbl.w, lbl.h), local);
			// **RADIUS-ORDERED WITH AN EXACT LOWER-BOUND CUT-OFF, NOT A HEURISTIC.** Every candidate
			// at radius r pays at least GOAL_WEIGHT.distance * min(1, r/outer) and every other term
			// is non-negative, so once the best score found so far is below that bound, nothing at r
			// or beyond can win and the rest of the rings need not be scored at all. The answer is
			// identical to scoring all of them; only the work differs.
			//
			// It matters because the reach is now five label-diagonals (Tom, 2026-08-16), and most
			// labels on a real drawing are not in conflict: their first ring scores near zero and
			// the outer rings are never touched. A label that IS boxed in pays the full price, which
			// is the one that deserves it.
			for (i = 0; i < cands.length; i++) {
				bandStart = cands[i].radiusFrac;
				if (bandStart !== undefined && bandStart !== bandBound) {
					bandBound = bandStart;
					if (bestRaw <= GOAL_WEIGHT.distance * Math.min(1, bandStart)) { break; }
				}
				raw.push(rawScore(lbl, cands[i], local, outer));
				if (raw[i] < bestRaw) { bestRaw = raw[i]; }
			}
			// `home` is always scored: it is the last candidate and carries no radiusFrac, so a cut
			// above must not be allowed to drop it -- "leave it alone" has to stay reachable.
			while (raw.length < cands.length) {
				i = raw.length;
				if (cands[i].radiusFrac === undefined) { raw.push(rawScore(lbl, cands[i], local, outer)); }
				else { raw.push(Infinity); }
			}
			eff = effectiveScores(raw, cands, k);
			for (i = 1; i < eff.length; i++) { if (eff[i] < eff[best]) { best = i; } }
			var c = cands[best];
			// COMMITTED AS AN OBSTACLE FOR EVERYONE PLACED AFTER, box and leader both. Without the
			// leader, goal 3 would be satisfied only against labels that happened to be dragged.
			var placedBox = labelBoxAtEnd(lbl, c),
				placedLines = labelLineBoxes(lbl, c),
				placedLeader = segment(lbl.anchor.x, lbl.anchor.y, c.x, c.y, 'leader', lbl.id);
			// The STAIRCASE goes into the index, not the block (Task 406) -- what this label
			// reserves is the ground its rows actually cover.
			placedLines.forEach(function (pb) { index.addBox(obs.boxes.push(pb) - 1); });
			index.addSegment(obs.segments.push(placedLeader) - 1);
			// **THE COMMITTED BOX AND LEADER COME BACK WITH THE RESULT.** They are pushed onto a
			// PRIVATE copy of the obstacle list above (`obs` is sliced from the caller's), so a
			// caller that tried to read them off its own array got nothing -- which is exactly what
			// happened: ?debug=boxes drew every obstacle and not one placed label, and the bench's
			// overlap count read 0 on a map Tom could see overlaps in. Returning them is also the
			// only way a caller can have them without recomputing labelBoxAtEnd(), and a recomputed
			// box is a box that can drift from the one the pass actually used.
			out.push({ id: lbl.id, x: c.x, y: c.y,
				dx: c.x - lbl.home.x, dy: c.y - lbl.home.y, score: eff[best],
				box: placedBox, boxes: placedLines, leader: placedLeader });
		});
		order.forEach(function (l) { delete l._diff; });
		return out;
	}

	// ---- Phase 1: priority-ordered first-fit, with a drop (ROADMAP Task 398) --------------------
	//
	// **THIS IS THE BEGINNING OF THE STANDARD PIPELINE, AND placeLabels() ABOVE IS ITS END.** QGIS
	// PAL's shape is candidates -> costs -> obstacles -> conflicts -> a fast first approximation
	// (`init_sol_falp`) -> a bounded search. We built the search first and had no first
	// approximation at all, which is why a crowded drawing cost the same as an empty one and why
	// nothing could ever be left unlabelled. This is that first approximation. Tom's Phase 1, and
	// MapLibre's whole per-frame algorithm, are the same thing under different names.
	//
	// Two positions, not thirty-three: the label goes at the most open side of its node, jumps to
	// the other side if that side is taken, and is dropped if neither is free.
	//
	// **THERE IS A DROP NOW, AND THE OLD RULING THAT THERE COULD NOT BE ONE IS REVERSED.** It read:
	// "there is no failure condition, and do not invent one." That was right while every label was
	// scored on a ladder with a finite top -- such a ladder always places something, so the worst
	// placement on the drawing is indistinguishable from a merely tight one and no threshold read
	// off the score can separate them. A first-fit has no score to threshold: a position is clear or
	// it is not, and "neither side is clear" is a fact rather than a judgement. That is what makes
	// dropping expressible here and not there.
	//
	// **THE ORDER IS THE DROP RULE.** Read globally, "drop the node with the lowest demand" sounds
	// like a search over the whole drawing. It is not one, and building it as one would be a mistake:
	// place in rank order and whoever arrives at a full space is by construction the worse-ranked of
	// the pair. So the caller sorts, and this function never compares two labels' importance at all.
	//
	// `labels[i]` carries `sides` -- an array of candidate ENDPOINTS, best first, which the caller
	// builds from the local feature context -- and `priority`, already resolved to a number.
	// **PRIORITY IS A DROP ORDER, LOW FIRST** (Task 445): the SMALLEST number is the first to be
	// given up, so placement runs from the largest down and an absent priority (read as 0) is the
	// first to go rather than the last. The user's column reads the same way -- "Drop".
	// **The caller keeps ownership of both**, because deciding which side is open needs the network's
	// topology and deciding which label matters needs to know what a demand is, and this file is not
	// allowed to know either. It is the same purity line placeLabels() draws.
	function placeLabelsFirstFit(labels, obstacles, opts) {
		opts = opts || {};
		var pad = opts.pad > 0 ? opts.pad : 0,
			obs = { boxes: obstacles.boxes.slice(), segments: obstacles.segments.slice() },
			order = labels.slice(), out = [], maxReach = 0,
			local = { boxes: [], segments: [] }, index;
		// **THE QUERY IS CENTRED ON THE ANCHOR, BUT THE BOX HANGS OFF THE ENDPOINT, AND THE REACH
		// MUST COVER BOTH.** Getting this wrong is silent and looks like a taste problem: the pass
		// simply never sees the obstacle, calls the side clear, and commits an overlap. It was wrong
		// here first -- reach was the label's own diagonal, which does not even span the resting
		// offset -- and `dev/lpn-spike/label-priority-harness.js`'s soundness assertion is what
		// found it. So: furthest candidate endpoint, plus the label's full diagonal beyond it, plus
		// the pad. Erring wide costs a few tests; erring narrow drops the assertion's whole point.
		labels.forEach(function (l) {
			var far = 0, i, s = l.sides && l.sides.length ? l.sides : [l.home];
			for (i = 0; i < s.length; i++) {
				far = Math.max(far, Math.hypot(s[i].x - l.anchor.x, s[i].y - l.anchor.y));
			}
			l._reach = far + Math.hypot(l.w, l.h) + pad;
			maxReach = Math.max(maxReach, l._reach);
		});
		index = grid(maxReach, obs);
		obs.boxes.forEach(function (b, i) { index.addBox(i); });
		obs.segments.forEach(function (g, i) { index.addSegment(i); });
		// **PRIORITY FIRST, DIFFICULTY ONLY AS A TIEBREAK, AND THAT IS A REVERSAL.** While nothing
		// could be dropped, difficulty was the sort key on the reasoning that a junction in a thicket
		// should choose while there are still candidates left -- Tom: "high order junctions are more
		// difficult, not more important." Still true, and still the tiebreak. But once a drop is
		// possible the order decides the VICTIM, so it cannot be a congestion heuristic alone.
		// Dragged labels are placed before all of them and are never dropped: the user put them there.
		order.sort(function (a, b) {
			if (!!b.dragged !== !!a.dragged) { return b.dragged ? 1 : -1; }
			// HIGHEST PRIORITY PLACES FIRST, because the number is a drop order and 1 drops first.
			if ((a.priority || 0) !== (b.priority || 0)) { return (b.priority || 0) - (a.priority || 0); }
			return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
		});
		order.forEach(function (lbl) {
			var sides = lbl.sides && lbl.sides.length ? lbl.sides : [lbl.home],
				chosen = null, chosenBox = null, i, c, b, verdict,
				fallback = null, fallbackBox = null;
			index.near(lbl.anchor.x, lbl.anchor.y, lbl._reach, local);
			for (i = 0; i < sides.length; i++) {
				c = sides[i];
				// The STAIRCASE, not the block (Task 406): asking about the block would call a side
				// occupied because of ground the short rows never cover.
				b = labelLineBoxes(lbl, c);
				verdict = lbl.dragged ? 'clear' : boxesClearOf(b, local, pad, lbl.id);
				if (verdict === 'clear') { chosen = c; chosenBox = b; break; }
				// **A SIDE HELD ONLY BY SOMETHING THIS LABEL OUTRANKS IS KEPT AS A FALLBACK, not
				// taken immediately.** A genuinely clear side on the other hand is still better, so
				// the preferred-side-first order has to finish before this is used. Dropping while
				// such a side existed is the ranking working backwards.
				if (verdict === 'yielding' && !fallback) { fallback = c; fallbackBox = b; }
			}
			if (!chosen && fallback) { chosen = fallback; chosenBox = fallbackBox; }
			if (!chosen) {
				// **DROPPED: NOTHING IS COMMITTED.** A label nobody can see is not an obstacle, so it
				// must not go into the index -- otherwise it keeps ground clear for a label that is
				// not drawn, and the drawing ends up emptier than the conflict warranted.
				out.push({ id: lbl.id, x: lbl.home.x, y: lbl.home.y, dx: 0, dy: 0,
					dropped: true, side: -1, box: null, leader: null });
				return;
			}
			// EVERY line box is committed, so the next label sees the staircase this one really
			// occupies rather than a rectangle around it.
			chosenBox.forEach(function (cb) { index.addBox(obs.boxes.push(cb) - 1); });
			out.push({ id: lbl.id, x: chosen.x, y: chosen.y,
				dx: chosen.x - lbl.home.x, dy: chosen.y - lbl.home.y,
				dropped: false, side: sides.indexOf(chosen),
				// `box` stays the ONE box a reader draws and counts (?debug=boxes, the bench's
				// overlap count); `boxes` is what the pass actually reserved.
				box: labelBoxAtEnd(lbl, chosen), boxes: chosenBox, leader: null });
		});
		// **THE INPUTS COME BACK EXACTLY AS THEY WENT IN.** placeLabels() makes the same promise, and
		// for the same reason: a pass that scribbles on its arguments cannot be run twice on one
		// drawing to check that it agrees with itself, which is the cheapest strong assertion there
		// is -- and it is asserted.
		labels.forEach(function (l) { delete l._reach; });
		return out;
	}
	// **CLEAR MEANS CLEAR OF THE HARD OBSTACLES, AND THE RANKS SAY WHICH THOSE ARE.** A first-fit has
	// no score, so the goal ladder cannot be read as magnitudes here -- but it still says everything
	// needed, as a partition. Labels, Symbols and Leaders (goals 2, 3, 4, 5) block a position; Links
	// (goals 6 and 7) and distance (goal 8) do not.
	//
	// That is not a convenience. It preserves Tom's own ruling -- "See that pipes are low ranked?
	// That means they factor least in the score. You can be on a pipe and maybe still win" -- where
	// treating every obstacle alike would silently promote pipes to blockers and empty the drawing.
	// It is independently right for a second reason: a haloed number over a pipe is already legible,
	// and every published engine draws that same line, halos for label-over-linework and collision
	// detection for label-over-label.
	//
	// A label never blocks itself: `owner` carries the ownership placeLabels() already established.
	// Returns 'clear', 'yielding' (everything in the way is an obstacle the caller marked as one this
	// label OUTRANKS), or 'blocked'.
	//
	// **THE MIDDLE ANSWER IS WHAT STOPS A NODE LABEL LOSING TO A PIPE LABEL.** `o.yields` is set by
	// the caller, which is the only party that knows the ranking -- this file must not learn what a
	// link is. Tom, 2026-08-17, on a node with no label beside one with: *"There's no reason why this
	// node must be hidden except that it may conflict with the link. But the node is supposed to have
	// preference."* Exactly so: a position occupied only by things this label outranks is a position
	// it may take, and dropping instead would be the ranking working backwards.
	function boxClearOf(b, obs, pad, ownerId) {
		var grown = pad > 0 ? box(b.cx, b.cy, b.w + 2 * pad, b.h + 2 * pad, b.a) : b, i, o,
			yielding = false;
		for (i = 0; i < obs.boxes.length; i++) {
			o = obs.boxes[i];
			if (o.owner !== undefined && o.owner === ownerId) { continue; }
			if (boxOverlapDepth(grown, o) > 0) {
				if (!o.yields) { return 'blocked'; }
				yielding = true;
			}
		}
		for (i = 0; i < obs.segments.length; i++) {
			o = obs.segments[i];
			if (o.kind !== 'leader') { continue; }   // a Link is a soft obstacle -- see above
			if (o.owner !== undefined && o.owner === ownerId) { continue; }
			if (segmentInBoxFraction(o, grown) > 0) { return 'blocked'; }
		}
		return yielding ? 'yielding' : 'clear';
	}
	// The same question asked of a STAIRCASE (Task 406): a stack of line boxes is clear only if
	// every line is, and the worst answer any line gives is the answer -- 'blocked' beats
	// 'yielding' beats 'clear', because one blocked row is a row of text sitting on something.
	function boxesClearOf(boxes, obs, pad, ownerId) {
		var worst = 'clear', i, v;
		for (i = 0; i < boxes.length; i++) {
			v = boxClearOf(boxes[i], obs, pad, ownerId);
			if (v === 'blocked') { return 'blocked'; }
			if (v === 'yielding') { worst = 'yielding'; }
		}
		return worst;
	}

	// ---- ROADMAP Task 539, phase one: COUNT the crossings ---------------------------------------
	//
	// **THIS MEASURES; IT DOES NOT MOVE ANYTHING.** Tom, 2026-08-26, on a screenshot of two node
	// labels whose leaders cross: *"when it looks so easy (to a human) to resolve, it's
	// embarrassing"*, and in the same breath *"I don't want to be forever tweaking this."* So the
	// first thing built is the number, not the remedy: how many crossings are there, and where, on
	// the drawings we already ship.
	//
	// **TWO TRIGGERS, AND THE SECOND IS THE ONE THE FIRST WOULD MISS** (his own rule, same day:
	// *"if two leaders cross or if a label crosses a leader, try stacking their labels"*):
	//
	//   1. LEADER x LEADER -- two leaders properly crossing. A segment-intersection test.
	//   2. LABEL  x LEADER -- somebody else's leader running through this label's box. Not a
	//      crossing of two leaders, and just as ugly. A label whose own leader is too short to be
	//      drawn still takes part HERE, on its box alone, which is why the second trigger cannot be
	//      folded into the first.
	//
	// A placement is `{id, box|boxes, leader}` -- exactly what placeLabels() returns, and what a
	// caller can assemble for a first-fit label whose leader the renderer draws. Boxes are the
	// STAIRCASE where there is one (Task 406): a leader crosses a label when it crosses any row.
	//
	// **A PAIR IS UNORDERED AND COUNTED ONCE, and that is the number to hold against Tom's five
	// marked gangs.** The ?debug=labels bench counts label-on-leader INCIDENCES (ordered), a
	// different number that stays as it is; both are returned here so neither has to be recovered
	// from the other. `gangs` groups the flagged pairs into connected components, because a gang is
	// what his strategy moves -- his cluster D is three labels competing for one open sector, not
	// three unrelated pairs.
	//
	// O(n^2) over the DRAWN labels, deliberately: a diagnostic run on demand, not a per-frame pass,
	// and an index here would be a second copy of a structure the placement passes already own. If
	// it ever moves inside the frame budget, index it then and say so here.
	function crossingBoxes(p) {
		return (p.boxes && p.boxes.length) ? p.boxes : (p.box ? [p.box] : []);
	}
	function labelCrossings(placements, opts) {
		opts = opts || {};
		// A grazed corner is still a crossing by default, so the measurement is the raw one; a
		// caller raises the bar deliberately rather than inheriting a threshold nobody chose.
		var minFrac = opts.minLeaderFraction > 0 ? opts.minLeaderFraction : 0,
			live = [], leaderPairs = [], labelOnLeader = [], i, j, k, b, f;
		(placements || []).forEach(function (p) {
			var bs = crossingBoxes(p);
			if (!bs.length && !p.leader) { return; }
			live.push({ id: p.id, boxes: bs, leader: p.leader || null });
		});
		for (i = 0; i < live.length; i++) {
			for (j = i + 1; j < live.length; j++) {
				if (live[i].leader && live[j].leader
						&& segmentsCross(live[i].leader, live[j].leader)) {
					leaderPairs.push({ a: live[i].id, b: live[j].id });
				}
			}
			// Its OWN leader is excluded: it stops at the box's near edge by construction, so
			// counting it would report the same constant on every drawing.
			for (j = 0; j < live.length; j++) {
				if (j === i || !live[j].leader) { continue; }
				for (k = 0; k < live[i].boxes.length; k++) {
					b = live[i].boxes[k];
					f = segmentInBoxFraction(live[j].leader, b);
					if (f > minFrac) {
						labelOnLeader.push({ label: live[i].id, leader: live[j].id, fraction: f });
						break;
					}
				}
			}
		}
		// The union of the two triggers, unordered and de-duplicated, then grouped. Union-find with
		// no ranking: the components are tiny by construction and a plain walk is easier to read.
		var seen = {}, pairs = [], parent = {}, groups = {}, gangs = [];
		function root(x) { while (parent[x] !== x) { x = parent[x] = parent[parent[x]]; } return x; }
		function join(x, y) {
			if (parent[x] === undefined) { parent[x] = x; }
			if (parent[y] === undefined) { parent[y] = y; }
			var rx = root(x), ry = root(y);
			if (rx !== ry) { parent[rx] = ry; }
		}
		function note(x, y) {
			var key = x < y ? x + ' ' + y : y + ' ' + x;
			if (!seen[key]) { seen[key] = true; pairs.push(x < y ? [x, y] : [y, x]); }
			join(x, y);
		}
		leaderPairs.forEach(function (p) { note(p.a, p.b); });
		labelOnLeader.forEach(function (p) { note(p.label, p.leader); });
		Object.keys(parent).forEach(function (id) {
			var r = root(id);
			if (!groups[r]) { groups[r] = []; gangs.push(groups[r]); }
			groups[r].push(id);
		});
		gangs.forEach(function (g) { g.sort(); });
		gangs.sort(function (a, b) { return a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0); });
		return {
			leaderPairs: leaderPairs,
			labelOnLeader: labelOnLeader,
			pairs: pairs,
			gangs: gangs,
			counts: {
				labels: live.length,
				leaders: live.filter(function (p) { return !!p.leader; }).length,
				leaderCross: leaderPairs.length,
				labelOnLeader: labelOnLeader.length,
				pairs: pairs.length,
				gangs: gangs.length
			}
		};
	}

	return {
		GOAL_WEIGHT: GOAL_WEIGHT,
		ANGLE_TUNING: ANGLE_TUNING,
		CORNERS: CORNERS,
		openArcs: openArcs,
		arcHolds: arcHolds,
		cornerIsOpen: cornerIsOpen,
		openCorners: openCorners,
		widestArc: widestArc,
		polarCandidates: polarCandidates,
		cardinalSides: cardinalSides,
		placeLabelsFirstFit: placeLabelsFirstFit,
		boxClearOf: boxClearOf,
		boxesClearOf: boxesClearOf,
		labelLineBoxes: labelLineBoxes,
		RING_ANGLES: RING_ANGLES,
		RAY_STRETCH: RAY_STRETCH,
		box: box,
		segment: segment,
		boxFromRect: boxFromRect,
		boxCorners: boxCorners,
		boxOverlapDepth: boxOverlapDepth,
		segmentInBoxFraction: segmentInBoxFraction,
		segmentsCross: segmentsCross,
		candidatesFor: candidatesFor,
		anglesAt: anglesAt,
		RING_STEPS: RING_STEPS,
		labelBoxAtEnd: labelBoxAtEnd,
		obstaclesInReach: obstaclesInReach,
		grid: grid,
		anyBoxOverlap: anyBoxOverlap,
		boxIndex: boxIndex,
		rawScore: rawScore,
		effectiveScores: effectiveScores,
		placeLabels: placeLabels,
		labelCrossings: labelCrossings
	};
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
