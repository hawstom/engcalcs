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
//   * **THERE IS NO FAILURE CONDITION.** The best candidate wins; nothing declares defeat. Hiding
//     and dropping lines are separate decisions, not a threshold in here.
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
	// **THE ANGLES ARE OFF-ORTHOGONAL BY CONSTRUCTION (goal 7).** Eight of them, 45 degrees apart,
	// with the whole ring turned 10 degrees so that none of them is horizontal or vertical -- every
	// one lands 10 or 35 degrees off an axis, which is what Tom asked for (*"They try to be 10
	// degrees away from orthogonal"*) without a penalty term and without a placement that has to be
	// rejected after it is proposed.
	//
	// **DELIBERATELY THIN: eight directions at two radii, plus where the label already is.** Tom, on
	// a proposal to open with 48 candidates: *"Not so fast. Let's try it."* Densify only on a
	// measurement, never on an argument.
	var RING_ANGLES = [10, 55, 100, 145, 190, 235, 280, 325];
	// Neighbours are what goal 11 reads, so they are declared STRUCTURALLY rather than by a distance
	// test: a ring candidate's neighbours are the two directions either side of it and the same
	// direction at the other radius. A distance test would give the outer ring fewer neighbours than
	// the inner one purely because it is bigger, and "the direction of least congestion" would then
	// mean something different at each radius.
	function ringCandidates(anchor, inner, outer) {
		var out = [], radii = [inner, outer], ri, ai, n = RING_ANGLES.length, rad;
		for (ri = 0; ri < radii.length; ri++) {
			for (ai = 0; ai < n; ai++) {
				rad = RING_ANGLES[ai] * Math.PI / 180;
				out.push({
					x: anchor.x + radii[ri] * Math.cos(rad),
					y: anchor.y + radii[ri] * Math.sin(rad),
					neighbours: [
						ri * n + (ai + 1) % n,
						ri * n + (ai + n - 1) % n,
						(1 - ri) * n + ai
					]
				});
			}
		}
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
	function candidatesFor(lbl, inner, outer) {
		var cands, i, best = [0, 1], bestD = [Infinity, Infinity], d;
		if (lbl.dragged) { return rayCandidates(lbl.anchor, lbl.home); }
		cands = ringCandidates(lbl.anchor, inner, outer);
		for (i = 0; i < cands.length; i++) {
			d = Math.hypot(cands[i].x - lbl.home.x, cands[i].y - lbl.home.y);
			if (d < bestD[0]) { bestD[1] = bestD[0]; best[1] = best[0]; bestD[0] = d; best[0] = i; }
			else if (d < bestD[1]) { bestD[1] = d; best[1] = i; }
		}
		cands.push({ x: lbl.home.x, y: lbl.home.y, neighbours: best });
		return cands;
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
	// Every penalty is normalised into roughly [0, 1] before its goal weight is applied, so the
	// ranks compare like with like: a box overlap is measured in the label's own heights, a line
	// through a box as the fraction of that line inside it, and distance against the outer radius.
	// Without that a term would be loud or quiet according to the units it happens to be in, and the
	// ranking would say nothing.
	function rawScore(lbl, c, obs, outer) {
		var b = labelBoxAtEnd(lbl, c),
			leader = segment(lbl.anchor.x, lbl.anchor.y, c.x, c.y, 'leader', lbl.id),
			s = 0, i, o, depth;
		for (i = 0; i < obs.boxes.length; i++) {
			o = obs.boxes[i];
			if (o.owner !== undefined && o.owner === lbl.id) { continue; }
			depth = boxOverlapDepth(b, o);
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
				* segmentInBoxFraction(o, b);
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
	function placeLabels(labels, obstacles, opts) {
		opts = opts || {};
		var inner = opts.inner > 0 ? opts.inner : 1,
			outer = opts.outer > 0 ? opts.outer : inner * 2.5,
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
			var cands = candidatesFor(lbl, inner, outer), raw = [], eff, i, best = 0;
			index.near(lbl.anchor.x, lbl.anchor.y, outer + Math.hypot(lbl.w, lbl.h), local);
			for (i = 0; i < cands.length; i++) { raw.push(rawScore(lbl, cands[i], local, outer)); }
			eff = effectiveScores(raw, cands, k);
			for (i = 1; i < eff.length; i++) { if (eff[i] < eff[best]) { best = i; } }
			var c = cands[best];
			// COMMITTED AS AN OBSTACLE FOR EVERYONE PLACED AFTER, box and leader both. Without the
			// leader, goal 3 would be satisfied only against labels that happened to be dragged.
			var placedBox = labelBoxAtEnd(lbl, c),
				placedLeader = segment(lbl.anchor.x, lbl.anchor.y, c.x, c.y, 'leader', lbl.id);
			index.addBox(obs.boxes.push(placedBox) - 1);
			index.addSegment(obs.segments.push(placedLeader) - 1);
			out.push({ id: lbl.id, x: c.x, y: c.y,
				dx: c.x - lbl.home.x, dy: c.y - lbl.home.y, score: eff[best] });
		});
		order.forEach(function (l) { delete l._diff; });
		return out;
	}

	return {
		GOAL_WEIGHT: GOAL_WEIGHT,
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
		labelBoxAtEnd: labelBoxAtEnd,
		obstaclesInReach: obstaclesInReach,
		grid: grid,
		rawScore: rawScore,
		effectiveScores: effectiveScores,
		placeLabels: placeLabels
	};
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
