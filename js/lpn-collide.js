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
				// One circle round the whole label first: this loop is every label against every
				// leader, and on a drawing of 190 labels the overwhelming majority of those pairs
				// are nowhere near each other.
				if (leaderMissesLabel(live[j].leader, live[i])) { continue; }
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

	// ---- ROADMAP Task 539, phase two: MOVE the gangs phase one counts ---------------------------
	//
	// **PHASE ONE COUNTED; THIS ONE REPAIRS, AND IT IS A REPAIR PASS RATHER THAN A REPLACEMENT.**
	// The first-fit has already placed every node label one at a time, each treating the last as an
	// obstacle, which is exactly how two labels end up each locally reasonable and jointly absurd
	// (Tom, 2026-08-26, on a screenshot of two crossed leaders: *"when it looks so easy (to a human)
	// to resolve, it's embarrassing"*). So this runs AFTER that pass, over the few labels
	// labelCrossings() flags, and leaves every other placement exactly where it was. Running it as a
	// repair keeps every number in dev/label-placement-algorithms.md section 8 comparable before and
	// after, which is the whole measurement.
	//
	// **TWO ROUTES, ONE SCORER, BECAUSE TOM ASKED FOR BOTH TO BE MEASURED** (his own framing,
	// 2026-09-08: *"we can try to be smart about geometry or we can just add another trick to our
	// brute force hunting... We could scientifically try both approaches to see which works
	// better."*). `opts.strategies` names which routes generate candidate layouts, so a harness can
	// run either alone and compare:
	//
	//   'brute' -- try the flagged labels' OWN candidate endpoints against each other, in a small
	//              cartesian product. It knows nothing about geometry; it re-searches jointly what
	//              the first-fit searched one label at a time.
	//   'gang'  -- STACK the gang and order the stack by the ANGLE of the node each label belongs
	//              to. Two leaders cross when the upper label belongs to the lower node, so an
	//              angle-sorted stack is the arrangement in which that cannot happen. This is Tom's
	//              step 4 (section 9a) with the stack put where the gang already stands rather than
	//              at a `spot_prime` found by searching open ground -- that search is the part he
	//              flagged as unspecified and it is deliberately not built here.
	//
	// **THE BASELINE IS ALWAYS TRIAL ZERO AND A MOVE MUST BEAT IT STRICTLY**, which is what makes
	// the pass safe to run on every content pass: the worst it can do is leave the drawing alone.
	//
	// **THE SCORE IS LEXICOGRAPHIC AND THE CROSSING IS THIRD, NOT FIRST.** Boxes on hard obstacles,
	// then boxes on other labels, then the crossings, then yielded ground, then total leader length.
	// A crossed leader is ugly; a number printed on a node symbol or on another label is unreadable,
	// and the first-fit treats a hard obstacle as absolute rather than as a cost. Ranking the
	// crossing first would let this pass buy back, one gang at a time, exactly what every pass
	// before it refused -- and it did, in the fixture that now guards it. The last term is what
	// stops a label wandering to the far side of the map to break a tie.
	//
	// **THE COUNT IS THE DELTA, NOT THE TOTAL, AND IT IS EXACT.** Only the gang moves, so a pair
	// with no gang member in it cannot change; counting only the pairs that touch a member is
	// therefore the same comparison as re-counting the drawing, at O(members x labels) per trial
	// instead of O(labels^2).
	//
	// `labels` is the placement spec list (the one placeLabelsFirstFit() read), `placed` its result.
	// `opts.foreign` carries the labels that are drawn but cannot move -- stationed pipe labels and
	// Text objects -- as `{id, boxes, leader}`: they are half of most flagged pairs (section 8: 76
	// label-on-leader against 9 leader-leader) and a repair blind to them would optimize a drawing
	// nobody sees. `opts.leaderMin` is the renderer's own leaderThreshold(): a label nearer its
	// anchor than that draws NO leader, and counting one it does not draw would have the pass
	// chasing a crossing the reader cannot see.
	// **ONE CIRCLE ROUND A WHOLE LABEL, CACHED, AND IT IS WHAT MAKES THE REPAIR AFFORDABLE.** A
	// staircase of four rows against another of four rows is sixteen oriented-box tests, and the
	// overwhelming majority of the pairs a repair trial looks at are nowhere near each other:
	// boxOverlapDepth() was 18% of the whole measured run before this. The circle is the union of
	// the rows' own half-diagonal circles, so a rejection is exact and an acceptance falls through
	// to the real test.
	function labelBound(o) {
		var i, b, r, x0, y0, x1, y1;
		if (o._bound) { return o._bound; }
		for (i = 0; i < o.boxes.length; i++) {
			b = o.boxes[i];
			r = Math.hypot(b.w, b.h) / 2;
			if (i === 0) { x0 = b.cx - r; y0 = b.cy - r; x1 = b.cx + r; y1 = b.cy + r; } else {
				if (b.cx - r < x0) { x0 = b.cx - r; }
				if (b.cy - r < y0) { y0 = b.cy - r; }
				if (b.cx + r > x1) { x1 = b.cx + r; }
				if (b.cy + r > y1) { y1 = b.cy + r; }
			}
		}
		o._bound = o.boxes.length
			? { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, r: Math.hypot(x1 - x0, y1 - y0) / 2 }
			: { cx: 0, cy: 0, r: -1 };
		return o._bound;
	}
	function labelsApart(a, b) {
		var p = labelBound(a), q = labelBound(b);
		if (p.r < 0 || q.r < 0) { return true; }
		return Math.hypot(p.cx - q.cx, p.cy - q.cy) > p.r + q.r;
	}
	function leaderMissesLabel(g, o) {
		var p = labelBound(o);
		return p.r < 0 || pointToSegmentDistance(p.cx, p.cy, g) > p.r;
	}
	function repairPairFlagged(a, b) {
		var i;
		if (a.leader && b.leader && segmentsCross(a.leader, b.leader)) { return true; }
		if (b.leader && !leaderMissesLabel(b.leader, a)) {
			for (i = 0; i < a.boxes.length; i++) {
				if (segmentInBoxFraction(b.leader, a.boxes[i]) > 0) { return true; }
			}
		}
		if (a.leader && !leaderMissesLabel(a.leader, b)) {
			for (i = 0; i < b.boxes.length; i++) {
				if (segmentInBoxFraction(a.leader, b.boxes[i]) > 0) { return true; }
			}
		}
		return false;
	}
	function anyBoxOverlapAny(a, b) {
		var i, j;
		for (i = 0; i < a.length; i++) {
			for (j = 0; j < b.length; j++) {
				if (boxOverlapDepth(a[i], b[j]) > 0) { return true; }
			}
		}
		return false;
	}
	function repairCrossingGangs(labels, placed, obstacles, opts) {
		opts = opts || {};
		var pad = opts.pad > 0 ? opts.pad : 0,
			leaderMin = opts.leaderMin > 0 ? opts.leaderMin : 0,
			strategies = opts.strategies || ['brute', 'gang'],
			useBrute = strategies.indexOf('brute') >= 0,
			useGang = strategies.indexOf('gang') >= 0,
			maxCands = opts.maxCandidates > 0 ? opts.maxCandidates : 6,
			maxTrials = opts.maxTrials > 0 ? opts.maxTrials : 512,
			obs = obstacles || { boxes: [], segments: [] },
			out = (placed || []).slice(), specs = {}, live = [], slotOf = {},
			// `after` is deliberately absent until it is computed: a zero sitting there would read
			// as "no crossings left" on every pass that never took the closing count.
			stats = { gangs: 0, considered: 0, moved: 0, trials: 0, brute: 0, gang: 0, before: 0 };
		(labels || []).forEach(function (l) { specs[l.id] = l; });
		function leaderAt(spec, c) {
			return Math.hypot(c.x - spec.anchor.x, c.y - spec.anchor.y) > leaderMin
				? segment(spec.anchor.x, spec.anchor.y, c.x, c.y, 'leader', spec.id) : null;
		}
		out.forEach(function (r, i) {
			var spec = specs[r.id], bs;
			if (r.dropped || !spec || spec.dragged) { return; }
			bs = (r.boxes && r.boxes.length) ? r.boxes : (r.box ? [r.box] : []);
			if (!bs.length) { return; }
			slotOf[r.id] = live.length;
			live.push({ id: r.id, boxes: bs, leader: leaderAt(spec, { x: r.x, y: r.y }),
				spec: spec, at: { x: r.x, y: r.y }, out: i, movable: true });
		});
		(opts.foreign || []).forEach(function (f) {
			// A leader with no box of its own is a legitimate foreigner: a Text object's callout
			// line is drawn and can be crossed, and the box it belongs to is pushed separately.
			if (!f || (!(f.boxes && f.boxes.length) && !f.leader)) { return; }
			live.push({ id: f.id, boxes: f.boxes || [], leader: f.leader || null, movable: false,
				yields: !!f.yields });
		});
		// **A YIELDING LABEL IS ON THE MAP ONLY WHILE NO MOVABLE LABEL IS STANDING ON IT**, which is
		// the caller's node-outranks-link ruling stated as geometry rather than as a snapshot. It
		// has to be re-asked per trial: a move that lifts a node label off a pipe label REVEALS it,
		// and a revealed label can be crossed. Modeling it as a fixed set instead is what made this
		// pass raise the drawn count while its own score said it had lowered it.
		// `over` is the movable labels that could be standing on it -- every one of them for the
		// whole-drawing counts, the neighborhood alone inside a trial, which is the same set
		// because two boxes that overlap are near each other by construction.
		function shownIn(o, over) {
			var j;
			if (!o.yields) { return true; }
			for (j = 0; j < over.length; j++) {
				if (over[j] !== o && over[j].movable && !labelsApart(over[j], o)
						&& anyBoxOverlapAny(over[j].boxes, o.boxes)) {
					return false;
				}
			}
			return true;
		}
		function drawnNow() {
			return live.filter(function (o) { return shownIn(o, live); });
		}
		var found = labelCrossings(drawnNow());
		stats.before = found.counts.pairs;
		// The pairs themselves, not just the count. Free -- labelCrossings() has just built them --
		// and it is the only way to ask WHICH pair the model and the drawing disagree about, which
		// is the question every surprise from this pass has come down to.
		stats.pairsBefore = found.pairs;
		// One trial's arrangement of one gang: an endpoint per member, already turned into the boxes
		// and the leader the drawing would really have. **CACHED PER MEMBER PER ENDPOINT**, because
		// a gang of three at six candidates each is 216 arrangements over 18 distinct pieces, and
		// labelLineBoxes() is not free -- it was 40% of the pass before the cache.
		function pieceFor(m, c, local) {
			var k = c.x + ',' + c.y, g, bs;
			if (!m.pieces) { m.pieces = {}; }
			if (!m.pieces[k]) {
				g = leaderAt(m.spec, c);
				bs = labelLineBoxes(m.spec, c);
				m.pieces[k] = { end: c, boxes: bs, leader: g,
					// **THE OBSTACLE VERDICT AND THE LEADER LENGTH BELONG TO THE PIECE, not to the
					// trial.** Nothing in the obstacle list moves during a search, so asking
					// boxesClearOf() per trial asked the same question of the same neighborhood a
					// thousand times over -- and it was most of the pass.
					clear: boxesClearOf(bs, local, pad, m.id),
					len: g ? Math.hypot(g.bx - g.ax, g.by - g.ay) : 0 };
			}
			return m.pieces[k];
		}
		function arrange(members, ends, local) {
			return members.map(function (m, i) { return pieceFor(m, ends[i], local); });
		}
		// **SCORED AGAINST THE NEIGHBORHOOD, WHICH IS EXACT AND NOT AN APPROXIMATION.** Every
		// geometry a member can reach in any trial lies inside `reach` of the gang centre, so a
		// label or leader that never comes that close cannot be in a pair with one -- the same
		// argument obstaclesInReach() makes, applied to the placements. Scoring against the whole
		// drawing instead cost 2.3 s a pass on Net3-World at the 4x zoom; this is the whole
		// difference between a pass that can run on a drag frame and one that cannot.
		function score(members, arr, ctx) {
			var isMem = ctx.isMem, near = ctx.near,
				i, j, o, c = 0, blocked = 0, yielding = 0, hits = 0, len = 0, v, mine;
			members.forEach(function (m, k) {
				var L = live[slotOf[m.id]];
				L.boxes = arr[k].boxes;
				L.leader = arr[k].leader;
				// The piece's own circle, never a stale one: a member's boxes are replaced on every
				// trial, so a bound cached on the live entry would describe the trial before this.
				L._bound = labelBound(arr[k]);
			});
			// Which of the neighborhood's yielding labels this trial leaves ON THE MAP. Asked
			// first, because a label a member has just covered is not a crossing partner and a
			// label a member has just uncovered is one again. **Only the MEMBERS are re-asked**:
			// nothing else in the drawing moves, so who else covers what was settled once per gang
			// -- the difference between a neighborhood scan per trial and a members scan, which on
			// Net3-World is most of the pass.
			for (j = 0; j < near.length; j++) {
				o = near[j];
				if (!live[o].yields) { continue; }
				ctx.shown[o] = !ctx.covered[o];
				for (i = 0; ctx.shown[o] && i < members.length; i++) {
					if (!labelsApart(arr[i], live[o])
							&& anyBoxOverlapAny(arr[i].boxes, live[o].boxes)) {
						ctx.shown[o] = false;
					}
				}
			}
			for (i = 0; i < members.length; i++) {
				mine = slotOf[members[i].id];
				for (j = 0; j < near.length; j++) {
					o = near[j];
					if (o === mine || (isMem[o] && o < mine)) { continue; }
					if (live[o].yields && !ctx.shown[o]) { continue; }   // covered: not on the map
					if (repairPairFlagged(live[mine], live[o])) { c++; }
					// A node label is never in the obstacle list -- placeLabelsFirstFit() commits
					// its boxes to a private copy -- so label-on-label is asked of the placements
					// instead, and asked of the STAIRCASE on both sides (Task 406). A YIELDING label
					// is not counted here at all: a node box on a pipe label is not two labels
					// overprinting, it is the pipe label leaving, and boxesClearOf() scores that as
					// the yield it is.
					if (!live[o].yields && !labelsApart(arr[i], live[o])
							&& anyBoxOverlapAny(arr[i].boxes, live[o].boxes)) { hits++; }
				}
				v = arr[i].clear;
				if (v === 'blocked') { blocked++; } else if (v === 'yielding') { yielding++; }
				len += arr[i].len;
			}
			return [c, blocked, hits, yielding, len];
		}
		// **A TRIAL MAY NOT SPEND A HARD OVERLAP TO BUY A CROSSING, and that is a gate rather than a
		// weight.** A crossed leader is ugly; a number printed on a node symbol or on top of another
		// label is unreadable, and every pass before this one treats a hard obstacle as absolute
		// rather than as a cost. So a trial is admissible only while it holds those two at or below
		// what the layout already had, and the ranking inside the admissible set is the crossing
		// count, which is what Task 539 is about. Ranking the crossing first without the gate let
		// the repair buy back, one gang at a time, exactly what the first-fit refused -- measured on
		// Net3-World, where it RAISED the count from 7 pairs to 9.
		function admissible(sc, base) {
			return sc[1] <= base[1] && sc[2] <= base[2];
		}
		function better(a, b) {
			var i;
			for (i = 0; i < a.length; i++) {
				if (a[i] !== b[i]) { return a[i] < b[i]; }
			}
			return false;
		}
		// The candidate endpoints one member may be tried at: where it already is, then its own
		// first-fit candidate list. Capped, because the product over the gang is what costs.
		function candidatesOf(m) {
			var outc = [m.at], s = (m.spec.sides || []), i;
			for (i = 0; i < s.length && outc.length < maxCands; i++) {
				if (Math.abs(s[i].x - m.at.x) > 1e-9 || Math.abs(s[i].y - m.at.y) > 1e-9) {
					outc.push(s[i]);
				}
			}
			return outc;
		}
		// **THE ANGLE RULE, WHICH IS THE WHOLE GANG IDEA** (Tom's section 9a, step 4). Given a
		// column of slots, the label whose node bears most upward from the stack takes the top row.
		// Leaders from one place to a set of targets cannot cross when their order round the stack
		// is the order of their targets' bearings, and a stack is one place to within its own
		// height.
		function stackTrials(members) {
			var trials = [], rowH = 0;
			members.forEach(function (m) { rowH = Math.max(rowH, m.spec.h); });
			rowH += pad;
			function assign(slots) {
				var mid = { x: 0, y: 0 }, order, ends = [], s = slots.slice();
				s.forEach(function (p) { mid.x += p.x; mid.y += p.y; });
				mid.x /= s.length; mid.y /= s.length;
				s.sort(function (a, b) { return a.y - b.y; });
				order = members.slice().sort(function (a, b) {
					return Math.atan2(-(b.spec.anchor.y - mid.y), b.spec.anchor.x - mid.x)
						- Math.atan2(-(a.spec.anchor.y - mid.y), a.spec.anchor.x - mid.x);
				});
				order.forEach(function (m, k) { ends[members.indexOf(m)] = s[k]; });
				return ends;
			}
			// (a) the slots the gang ALREADY occupies, merely re-dealt by angle. The cheapest gang
			// move there is: every position is one the first-fit already found room for.
			trials.push(assign(members.map(function (m) { return m.at; })));
			// (b) a fresh column hung at each member's own endpoint, downward and upward.
			members.forEach(function (m) {
				[1, -1].forEach(function (dir) {
					var slots = [], k;
					for (k = 0; k < members.length; k++) {
						slots.push({ x: m.at.x, y: m.at.y + dir * k * rowH });
					}
					trials.push(assign(slots));
				});
			});
			return trials;
		}
		found.gangs.forEach(function (gang) {
			var members = [], center = { x: 0, y: 0 }, reach = 0, local, ctx, base, best, bestArr,
				bestBy = null, cands, total = 1, rowSpan, i, k, b, idx, ends, was, arr, sc;
			gang.forEach(function (id) {
				var s = slotOf[id];
				if (s !== undefined && live[s].movable) { members.push(live[s]); }
			});
			stats.gangs++;
			if (!members.length) { return; }
			if (members.length < 2 && !useBrute) { return; }
			stats.considered++;
			members.forEach(function (m) { center.x += m.spec.anchor.x; center.y += m.spec.anchor.y; });
			center.x /= members.length; center.y /= members.length;
			// **THE RADIUS HAS TO COVER EVERY TRIAL, INCLUDING THE STACK, and a radius that fell
			// short would fail silently in the worst way**: the obstacle set would simply not
			// contain the symbol a stacked row was about to be placed on, and boxesClearOf() would
			// call it clear. So it is the furthest candidate endpoint OR the full height of a
			// column of members, plus a label's diagonal beyond either -- the same argument
			// placeLabelsFirstFit() makes about its own reach.
			rowSpan = 0;
			members.forEach(function (m) { rowSpan = Math.max(rowSpan, m.spec.h); });
			rowSpan = (rowSpan + pad) * members.length;
			members.forEach(function (m) {
				(m.spec.sides || []).concat([m.at]).forEach(function (p) {
					reach = Math.max(reach, Math.hypot(p.x - center.x, p.y - center.y) + rowSpan
						+ Math.hypot(m.spec.w, m.spec.h) + pad);
				});
			});
			// The obstacle neighborhood, taken ONCE per gang through the definition rather than
			// the grid: near() is only sound out to its own cell size, and this radius is the
			// gang's, not the one placeLabelsFirstFit() built its index for.
			local = obstaclesInReach({ anchor: center, w: 0, h: 0 }, obs, reach);
			// The PLACEMENTS in reach, by the same definition: a box whose centre is within the
			// radius plus its own half-diagonal, or a leader that passes inside it. Members are
			// always in, whatever their own geometry says.
			ctx = { isMem: [], near: [], covered: [], shown: [], obs: local };
			members.forEach(function (m) { ctx.isMem[slotOf[m.id]] = true; });
			for (i = 0; i < live.length; i++) {
				if (ctx.isMem[i]) { ctx.near.push(i); continue; }
				if (live[i].leader
						&& pointToSegmentDistance(center.x, center.y, live[i].leader) < reach) {
					ctx.near.push(i);
					continue;
				}
				for (k = 0; k < live[i].boxes.length; k++) {
					b = live[i].boxes[k];
					if (Math.hypot(b.cx - center.x, b.cy - center.y)
							< reach + Math.hypot(b.w, b.h) / 2) {
						ctx.near.push(i);
						break;
					}
				}
			}
			// Who covers a yielding neighbour APART from this gang: fixed for the whole search,
			// because nothing but the gang moves.
			ctx.near.forEach(function (o) {
				if (!live[o].yields) { return; }
				ctx.covered[o] = ctx.near.some(function (p) {
					return !ctx.isMem[p] && live[p].movable
						&& anyBoxOverlapAny(live[p].boxes, live[o].boxes);
				});
			});
			bestArr = arrange(members, members.map(function (m) { return m.at; }), local);
			base = score(members, bestArr, ctx);
			best = base;
			if (useGang) {
				stackTrials(members).forEach(function (e) {
					stats.trials++;
					arr = arrange(members, e, local);
					sc = score(members, arr, ctx);
					if (admissible(sc, base) && better(sc, best)) {
						best = sc; bestArr = arr; bestBy = 'gang';
					}
				});
			}
			if (useBrute) {
				cands = members.map(candidatesOf);
				cands.forEach(function (c) { total *= c.length; });
				if (total <= maxTrials) {
					// **EVERY COMBINATION, while there are few enough of them.** A flagged pair at
					// six candidates each is 36 layouts, and this is the control the geometry route
					// is measured against: it knows nothing and tries everything.
					for (i = 0; i < total; i++) {
						idx = i; ends = [];
						for (k = 0; k < members.length; k++) {
							ends.push(cands[k][idx % cands[k].length]);
							idx = Math.floor(idx / cands[k].length);
						}
						stats.trials++;
						arr = arrange(members, ends, local);
						sc = score(members, arr, ctx);
						if (admissible(sc, base) && better(sc, best)) {
							best = sc; bestArr = arr; bestBy = 'brute';
						}
					}
				} else {
					// **AND ONE MEMBER AT A TIME ONCE THE PRODUCT RUNS AWAY, which is a bounded
					// search and not a truncated one.** Cutting the odometer off at N layouts would
					// vary the first member and never the last, so the third label in a gang of
					// three would simply never be tried -- a silent bias, and one nothing in the
					// numbers would reveal. Two rounds of "hold the others, try this one's own
					// candidates" is k x c x 2 layouts instead of c^k, and the second round is what
					// lets a member answer a move the first round made.
					ends = members.map(function (m) { return m.at; });
					for (i = 0; i < 2; i++) {
						for (k = 0; k < members.length; k++) {
							for (idx = 0; idx < cands[k].length; idx++) {
								was = ends[k];
								ends[k] = cands[k][idx];
								stats.trials++;
								arr = arrange(members, ends, local);
								sc = score(members, arr, ctx);
								if (admissible(sc, base) && better(sc, best)) {
									best = sc; bestArr = arr; bestBy = 'brute';
								} else {
									ends[k] = was;
								}
							}
						}
					}
				}
			}
			// Whatever won, the live list must end holding it -- score() writes as it goes.
			score(members, bestArr, ctx);
			if (!bestBy) { return; }
			stats.moved += members.length;
			stats[bestBy]++;
			members.forEach(function (m, j) {
				var r = out[m.out], spec = m.spec, c = bestArr[j].end, sides = spec.sides || [];
				live[slotOf[m.id]].at = { x: c.x, y: c.y };
				out[m.out] = { id: r.id, x: c.x, y: c.y,
					dx: c.x - spec.home.x, dy: c.y - spec.home.y,
					dropped: false, side: sides.indexOf(c),
					box: labelBoxAtEnd(spec, c), boxes: bestArr[j].boxes, leader: null };
			});
		});
		// **THE CLOSING COUNT IS A REPORT, NOT A DECISION, so it is asked for rather than always
		// taken.** It is a second O(labels^2) sweep of the whole drawing for a number nothing in the
		// pass reads -- measured at a third of a gang-route pass on Net3-World -- and the harness
		// that wants it measures the DRAWING anyway, which is the stronger statement.
		if (opts.report) { stats.after = labelCrossings(drawnNow()).counts.pairs; }
		return { results: out, stats: stats };
	}

	// ---- ROADMAP Task 539, phase three: WHERE A CROSSING SURVIVES, HIDE ONE OF THE TWO ----------
	//
	// **THE TARGET IS ZERO AND THE REMEDY OF LAST RESORT IS HIDING** (Tom, 2026-09-09: *"if there
	// are crossing leaders we need to hide one. The count has to get down to 0. We have to know
	// what we are doing here, and not show them if we can't show them beautifully."*). Phase two
	// took Net3-World from 43 flagged pairs to 31 over its four views by MOVING labels; this pass
	// runs after it and closes the remainder the only way that is left. It is not a failure mode:
	// this page already sheds values, yields ground and drops labels it cannot place, so a hidden
	// label is an existing idiom and the terminal rung of a cascade that has run out of rungs.
	//
	// **WHICH OF THE TWO GOES IS A STATED RULE, because the same label must go on every redraw.**
	// Whichever-comes-first-in-the-array is a layout that flickers as you pan. The order, worst
	// first, and each term earns its place:
	//
	//   1. HIDEABILITY IS A GATE, NOT A TERM. A hand-placed label is the user's own drawing and an
	//      automatic pass may never hide it; a Text object is the user's own words. If only one of a
	//      pair may be hidden, that one goes whatever the rest of this says. If NEITHER may be, the
	//      pair stands and is reported as a residual -- overruling the user is not on the ladder.
	//   2. `rank` -- how important the thing the label NAMES is, lowest kept longest. A reservoir or
	//      a tank is what a reader navigates by and is one of a handful on a drawing; a pump or a
	//      valve is the next thing they look for; a junction is one of hundreds; a pipe's numbers
	//      are the most recoverable from its neighbours. The caller supplies it, because what a
	//      label names is a fact about the document and this file knows nothing about hydraulics.
	//   3. DEGREE, highest first -- how many flagged pairs this label is in. This is the cost side
	//      of his ruling: hiding a label that is in three crossings buys three, and the greedy
	//      choice by degree is the standard approximation to the minimum vertex cover this problem
	//      really is. It sits BELOW rank on purpose: clearing a cluster of junction labels is worth
	//      more than clearing it by hiding the one tank in it.
	//   4. LEADER LENGTH, longest first -- the weakest attachment left. A label far from what it
	//      names is the one whose association a reader is least sure of anyway.
	//   5. The id, so the order is total. Nothing should reach here; without it, two identical
	//      labels would be chosen by array order, which is the flicker term 1 exists to avoid.
	//
	// **THE YIELD RULE IS PART OF THE MODEL, because otherwise this counts labels nobody sees.** A
	// stationed pipe label is drawn only while no node label stands on it, so the ones already
	// covered are off the map before this pass starts and may not be half of a crossing. `covers`
	// marks the entries that can hide a yielder (the node placements, which is what
	// stationedYieldSet() reads); `yields` marks the ones that can be hidden by them. Unlike the
	// repair one pass down, this does NOT have to re-ask it as it goes -- see coveredNow(), where a
	// hidden label keeps its reservation and the reason that is not thrift.
	//
	// Entries are `{id, boxes, leader, hideable, rank, yields, covers}`. Terminates because every
	// round hides one entry permanently and there are finitely many.
	function shedCrossingSurvivors(entries, opts) {
		opts = opts || {};
		var live = (entries || []).slice(),
			maxRounds = opts.maxRounds > 0 ? opts.maxRounds : live.length + 1,
			hidden = {}, order = [], residual = [], before = 0, after = 0, rounds = 0, r;
		function coveredNow(e) {
			var j, o;
			for (j = 0; j < live.length; j++) {
				o = live[j];
				// **A HIDDEN LABEL KEEPS ITS RESERVATION, which reads backwards and is what makes
				// this stable.** The label is not drawn, but the ground it stands on is still its
				// own, so a yielding label under it does NOT come back when it goes. Releasing it
				// instead was measured on Net3-World and produced a two-cycle -- five passes over an
				// untouched drawing hid {185,199}, {184,205}, {185,199}, {184,205}, {185,199}, which
				// on screen is a pair of labels blinking on a map nobody touched. It is the same
				// ruling yieldStationedLabels() already makes for the same reason, and it also
				// keeps the shed's coverage answer fixed for the whole run rather than per round.
				if (o === e || !o.covers) { continue; }
				if (labelsApart(o, e)) { continue; }
				if (anyBoxOverlapAny(o.boxes, e.boxes)) { return true; }
			}
			return false;
		}
		function drawnNow() {
			return live.filter(function (e) {
				return !hidden[e.id] && (!e.yields || !coveredNow(e));
			});
		}
		function leaderLen(e) {
			return e.leader ? Math.hypot(e.leader.bx - e.leader.ax, e.leader.by - e.leader.ay) : 0;
		}
		function worse(a, b) {
			if (a.rank !== b.rank) { return a.rank > b.rank; }
			if (a.deg !== b.deg) { return a.deg > b.deg; }
			if (a.len !== b.len) { return a.len > b.len; }
			return a.id > b.id;
		}
		for (rounds = 0; rounds <= maxRounds; rounds++) {
			var drawn = drawnNow(), deg = {}, pool, victim;
			r = labelCrossings(drawn);
			if (rounds === 0) { before = r.counts.pairs; }
			after = r.counts.pairs;
			residual = r.pairs;
			if (!r.pairs.length) { break; }
			r.pairs.forEach(function (p) {
				deg[p[0]] = (deg[p[0]] || 0) + 1;
				deg[p[1]] = (deg[p[1]] || 0) + 1;
			});
			pool = drawn.filter(function (e) { return e.hideable && deg[e.id]; });
			// **EVERY REMAINING PAIR IS THE USER'S OWN, so it stands and is REPORTED.** This is the
			// one exit that does not reach zero and it is the correct one: two hand-placed labels
			// crossing is a drawing somebody made on purpose.
			if (!pool.length) { break; }
			pool.forEach(function (e) { e.deg = deg[e.id]; e.len = leaderLen(e); });
			victim = pool[0];
			pool.forEach(function (e) { if (worse(e, victim)) { victim = e; } });
			hidden[victim.id] = true;
			order.push(victim.id);
		}
		return { hidden: order, hiddenSet: hidden, residual: residual, rounds: rounds,
			before: before, after: after };
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
		labelCrossings: labelCrossings,
		repairCrossingGangs: repairCrossingGangs,
		shedCrossingSurvivors: shedCrossingSurvivors
	};
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
