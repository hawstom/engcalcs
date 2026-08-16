// lpn-collide.js — label collision avoidance, as pure box arithmetic (ROADMAP Task 293).
//
// Kept separate from js/looped-network.js and free of DOM dependencies so a harness can load
// it alone: this is a four-iteration relaxation over weighted boxes, and "that label looks
// about right" is not a verification.
//
// Everything here is values in, values out. A "box" is a plain object:
//
//   { ref, owner, movable, weight, base: {x, y}, yOff, w, h }
//
//   ref      the holder whose .nudge {x, y} this box moves; null for an immovable box.
//   owner    for a leader, the holder whose OWN label that leader belongs to -- that one
//            label is exempt from it; see pushOffSegments().
//   movable  whether this box absorbs any of a separation.
//   base     the persisted/default top-left, BEFORE the live nudge.
//   yOff     the box's own baseline-to-top offset (labels are positioned by baseline).
//
// The caller builds the boxes -- that is where `doc`, the SVG handles and the current
// font size live -- and this file does the physics.

var EngCalcs = EngCalcs || {};

EngCalcs.lpnCollide = (function () {
	'use strict';

	// Per-OBJECT repel strength -- how much of an overlap this thing insists be gone when the
	// iteration ends. It decides who gives way, never WHERE a label goes: it is not a distance,
	// a priority, or a radius.
	//
	//   Two movable boxes: each moves a share of the separation proportional to the OTHER one's
	//   weight, so two labels at 1 and 1 split it evenly.
	//   One movable box against an immovable obstacle: the movable one absorbs the whole
	//   separation, scaled by the obstacle's insistence -- 1 clears completely, 0 does nothing.
	//   This resolves in ONE iteration rather than asymptotically. A proportional share here
	//   would leave the label partly inside the obstacle forever, since four iterations of
	//   "move a fixed fraction of the way out" never arrive.
	//
	// Every real obstacle is 1: a number sitting on a pipe, a symbol, or a leader is a number the
	// reader has to work at, so the pass always tries to clear it. `manual` is not a fraction --
	// it is a flag wearing a number, so a manually-dragged label (also flagged immovable) comes
	// out "practically immovable" from the same formula instead of needing a second code path.
	//
	// **Do not put a fractional weight here.** A fraction tells the pass to clear only part of the
	// overlap ALWAYS, even when the label had somewhere perfectly good to go -- which is why labels
	// sat on pipes with open space beside them. What a fraction is reaching for is LENIENCE (how
	// willing we are to tolerate a given conflict when they cannot all be avoided), a comparison
	// between two candidate PLACEMENTS. This pass never compares placements, so there is nowhere
	// here to put it; it belongs in the placement score. Section 4.1 of
	// dev/label-placement-goals.md holds the lenience values.
	var WEIGHT = { pipe: 1, node: 1, label: 1, leader: 1, manual: 1000 };

	function insistence(w) { return w > 1 ? 1 : (w < 0 ? 0 : w); }

	// Top-left corner of a box at its CURRENT position: the persisted/default base, plus
	// this element's live nudge (movable labels only), plus the box's own baseline-to-top
	// offset.
	function boxTopLeft(b) {
		var nx = b.ref ? b.ref.nudge.x : 0, ny = b.ref ? b.ref.nudge.y : 0;
		return { x: b.base.x + nx, y: b.base.y + ny + b.yOff };
	}

	// Nudge each label box off whatever it overlaps -- another label, a node symbol, a Text
	// label, or a leader line -- along whichever axis has the smaller overlap, a few
	// iterations toward a stable layout. Only the boxes in `labels` ever move; `statics`
	// are immovable obstacles and are built once by the caller.
	//
	// `segmentsFn` is called ONCE PER ITERATION and returns every line obstacle -- pipes and
	// leaders together, each with its own weight and, for a leader, its owner. Per iteration
	// because a leader follows its own label: nudging the label moves the line, which changes what
	// that line crosses. Pipes do not move and are rebuilt with them only to keep one contract.
	//
	// Mutates `ref.nudge` on the movable boxes and returns the number of iterations run --
	// the caller has already zeroed every nudge, which is what makes the pass IDEMPOTENT:
	// running it twice on an unchanged drawing gives the same answer as running it once.
	function relax(labels, statics, segmentsFn, iterations) {
		var boxes, segs, i, j, iter, moved, iters = iterations === undefined ? 4 : iterations;
		for (iter = 0; iter < iters; iter++) {
			moved = false;
			// Pipes first, so a label that has been stepped off a line is then judged against its
			// neighbours where it actually ended up. The reverse order lets a box be settled among
			// labels and then shoved back into one of them by a pipe, with no iteration left to
			// notice.
			segs = segmentsFn ? segmentsFn() : null;
			if (segs && segs.length && pushOffSegments(labels, segs)) { moved = true; }
			// The label boxes are first in `boxes`, so an outer loop over just those, with
			// the inner loop starting at i+1, visits every label-label pair exactly once and
			// every label-obstacle pair exactly once, and never wastes a comparison on two
			// obstacles (neither of which could move anyway).
			boxes = labels.concat(statics);
			for (i = 0; i < labels.length; i++) {
				for (j = i + 1; j < boxes.length; j++) {
					var A = boxes[i], B = boxes[j];
					if (!A.movable && !B.movable) { continue; } // nothing can absorb the push; skip rather than spin
					if (B.owner === A.ref) { continue; }        // a label never collides with its own leader
					var At = boxTopLeft(A), Bt = boxTopLeft(B);
					var overlapX = Math.min(At.x + A.w, Bt.x + B.w) - Math.max(At.x, Bt.x);
					var overlapY = Math.min(At.y + A.h, Bt.y + B.h) - Math.max(At.y, Bt.y);
					if (overlapX <= 0 || overlapY <= 0) { continue; }
					moved = true;
					// A's share of the separation is proportional to B's strength (and vice
					// versa) -- a stronger object moves the other one more than it moves itself.
					var wSum = A.weight + B.weight;
					if (wSum <= 0) { continue; }
					// Both movable: split the whole separation by weight, as before. Only one
					// movable: it absorbs the whole separation, scaled by the obstacle's insistence
					// -- see insistence() for why the old proportional share was wrong here.
					var soloA = A.movable && !B.movable, soloB = B.movable && !A.movable;
					if (overlapX < overlapY) {
						var shareAx = soloA ? (overlapX + 0.1) * insistence(B.weight) : (overlapX + 0.1) * B.weight / wSum,
							shareBx = soloB ? (overlapX + 0.1) * insistence(A.weight) : (overlapX + 0.1) * A.weight / wSum;
						var dirX = (At.x + A.w / 2 <= Bt.x + B.w / 2) ? -1 : 1;
						if (A.movable) { A.ref.nudge.x += dirX * shareAx; }
						if (B.movable) { B.ref.nudge.x -= dirX * shareBx; }
					} else {
						var shareAy = soloA ? (overlapY + 0.1) * insistence(B.weight) : (overlapY + 0.1) * B.weight / wSum,
							shareBy = soloB ? (overlapY + 0.1) * insistence(A.weight) : (overlapY + 0.1) * A.weight / wSum;
						var dirY = (At.y + A.h / 2 <= Bt.y + B.h / 2) ? -1 : 1;
						if (A.movable) { A.ref.nudge.y += dirY * shareAy; }
						if (B.movable) { B.ref.nudge.y -= dirY * shareBy; }
					}
				}
			}
			if (!moved) { return iter + 1; }
		}
		return iters;
	}

	// Line obstacles -- pipes and leaders -- as SEGMENTS rather than as sampled boxes, because the
	// arithmetic does not survive sampling. Net3 has 119 pipes; chopped at 3 screen pixels a
	// zoomed-in drawing would produce thousands of boxes, and the pass is labels x boxes x
	// iterations. A segment test is exact, is O(1) per pair, and needs nothing sampled: project the
	// box's half-extents onto the segment's normal to get how far the box reaches that way, compare
	// against the box centre's distance from the line, and push along the normal by the shortfall.
	//
	// The push is PERPENDICULAR, not along the smaller axis. A label lying across a pipe at 30
	// degrees should step off the pipe, which is sideways from the pipe -- an axis-aligned push
	// sends it along the pipe as often as off it, and it lands back on the line a little further
	// down.
	function pushOffSegments(labels, segments) {
		var i, j, A, seg, At, cx, cy, dx, dy, len, nx, ny, reach, dist, gap, share, moved = false;
		for (i = 0; i < labels.length; i++) {
			A = labels[i];
			if (!A.movable) { continue; }
			At = boxTopLeft(A);
			cx = At.x + A.w / 2; cy = At.y + A.h / 2;
			for (j = 0; j < segments.length; j++) {
				seg = segments[j];
				// A label is never pushed by its OWN leader, which by construction ends on the
				// label's near edge -- without this it would walk a little further away on every
				// iteration, forever.
				if (seg.owner && seg.owner === A.ref) { continue; }
				dx = seg.bx - seg.ax; dy = seg.by - seg.ay;
				len = Math.hypot(dx, dy);
				if (len === 0) { continue; }
				nx = -dy / len; ny = dx / len;
				// How far this box reaches along the segment's normal: the support function of an
				// axis-aligned box, which is why no rotation is needed here yet.
				reach = Math.abs(A.w / 2 * nx) + Math.abs(A.h / 2 * ny);
				dist = (cx - seg.ax) * nx + (cy - seg.ay) * ny;
				if (Math.abs(dist) >= reach) { continue; }        // clear of the infinite line
				// ...and the segment has to actually pass through the box, not merely lie on the
				// line that does. Without this a label is pushed off a pipe that stops short of it.
				if (!rangeHitsBox(seg, At, A)) { continue; }
				gap = reach - Math.abs(dist);
				share = (gap + 0.1) * insistence(seg.weight === undefined ? WEIGHT.pipe : seg.weight);
				if (share <= 0) { continue; }
				moved = true;
				// Away from the line, keeping the side the box is already on. A box sitting exactly
				// on the centreline (dist 0) has no preferred side, so it takes the normal's.
				if (dist < 0) { A.ref.nudge.x -= nx * share; A.ref.nudge.y -= ny * share; }
				else { A.ref.nudge.x += nx * share; A.ref.nudge.y += ny * share; }
			}
		}
		return moved;
	}
	// Liang-Barsky, inline rather than reaching into lpn-geom.js: this file is deliberately free of
	// dependencies so a harness can load it alone.
	function rangeHitsBox(seg, At, A) {
		var dx = seg.bx - seg.ax, dy = seg.by - seg.ay, t0 = 0, t1 = 1, i, r,
			p = [-dx, dx, -dy, dy],
			q = [seg.ax - At.x, At.x + A.w - seg.ax, seg.ay - At.y, At.y + A.h - seg.ay];
		for (i = 0; i < 4; i++) {
			if (p[i] === 0) { if (q[i] < 0) { return false; } continue; }
			r = q[i] / p[i];
			if (p[i] < 0) { if (r > t1) { return false; } if (r > t0) { t0 = r; } }
			else { if (r < t0) { return false; } if (r < t1) { t1 = r; } }
		}
		return true;
	}

	// Do two PLAIN rects {x, y, w, h} overlap? The same test relax() runs inline, exposed for
	// callers that need to ASK rather than to push -- specifically the aligned-pipe-label station
	// search, which cannot use the relaxation at all: an aligned label is not free to move in x and
	// y, only to slide along its own pipe, so it picks a station by trying and testing rather than
	// by absorbing a share of a separation. Shared so the two never disagree about what "clear"
	// means; a search that used a different predicate from the relaxation would hand back positions
	// the relaxation then considers collided.
	function rectsOverlap(a, b, pad) {
		var p = pad || 0;
		return Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) > -p
			&& Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) > -p;
	}

	return {
		WEIGHT: WEIGHT,
		rectsOverlap: rectsOverlap,
		pushOffSegments: pushOffSegments,
		insistence: insistence,
		boxTopLeft: boxTopLeft,
		relax: relax
	};
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
