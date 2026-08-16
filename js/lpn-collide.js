// lpn-collide.js — label collision avoidance, as pure box arithmetic (ROADMAP Task 293).
//
// Lifted out of js/looped-network.js for the same reason as js/lpn-geom.js: this is the
// one piece of the map editor whose output a person genuinely cannot check by looking at
// the screen (it is a four-iteration relaxation over weighted boxes, and "that label
// looks about right" is not a verification), and it was unreachable without a browser.
//
// Everything here is values in, values out. A "box" is a plain object:
//
//   { ref, owner, movable, weight, base: {x, y}, yOff, w, h }
//
//   ref      the holder whose .nudge {x, y} this box moves; null for an immovable box.
//   owner    for a leader sample, the holder whose OWN label that leader belongs to --
//            that one label is exempt below, or the leader (which by construction ends on
//            the label's near edge) would push its own label a little farther away on
//            every iteration, forever.
//   movable  whether this box absorbs any of a separation.
//   base     the persisted/default top-left, BEFORE the live nudge.
//   yOff     the box's own baseline-to-top offset (labels are positioned by baseline).
//
// The caller builds the boxes -- that is where `doc`, the SVG handles and the current
// font size live -- and this file does the physics.

var EngCalcs = EngCalcs || {};

EngCalcs.lpnCollide = (function () {
	'use strict';

	// Per-OBJECT repel strength -- how hard a given thing on the map pushes a label out of
	// itself.
	//
	// **THE PROVENANCE LINE THAT USED TO BE HERE WAS WRONG AND IS REMOVED** (2026-08-15).
	// It read "Tom, 2026-07-30, restating the strengths he had already given", and he says
	// otherwise: *"Weights aren't mine, and I have never seen them before. And I don't know
	// what weights mean and do."* Whatever was said in July, these four numbers and the
	// share formula below them were chosen here, and a comment that hands them to him makes
	// them harder to change than they should be -- which is the actual cost of a wrong
	// attribution in a file nobody re-reads. They are ours, they are up for revision, and
	// Task 379 revises them.
	//
	// What a weight DOES, since the comment never said: it decides who gives way. When two
	// boxes overlap, each moves a share of the separation proportional to the OTHER one's
	// weight -- so two labels at 1 and 1 split it evenly, a label at 1 pushed by a node at
	// 0.5 does two thirds of the moving, and an immovable obstacle absorbs none of it. It
	// is NOT a distance, a priority, or a radius; it never decides WHERE a label goes, only
	// how much of a given shove each side absorbs:
	//   pipe   0    -- a pipe never pushes a label at all. Pipe routes cross the whole
	//                  drawing and a number sitting on one still reads perfectly well, so
	//                  pipes are simply left out of the pass rather than added with a zero
	//                  that can never do anything.
	//   node   0.5  -- a node SYMBOL pushes at half strength: worth stepping off, but not
	//                  worth flinging a label across the map to avoid.
	//   label  1    -- another label pushes at full strength. Text over text is the
	//                  unreadable case.
	//   leader 1    -- so does a leader LINE: a rule drawn straight through a number is
	//                  just as bad.
	// Node data labels and link data labels are the same kind of object and therefore carry
	// the same strength (1); there is no node-vs-link distinction here.
	// A manually-dragged label is flagged immovable AND given a very large strength, so
	// "practically immovable" falls out of the same formula instead of being a second code
	// path.
	// **EVERY OBSTACLE IS 1, AND TOM IS RIGHT THAT THE FRACTIONS WERE A CATEGORY ERROR** (2026-08-15:
	// *"Obviously you mistook pipe avoidance preference for weight. Right? Are you still mistaking
	// that? Pipes and nodes are both weight 1. Is there really any place for preference as in 'move
	// this way if you must'?"*)
	//
	// No, there is not — not here. Under insistence a weight answers "how much of this overlap must
	// be gone", and the honest answer for every real obstacle is "all of it": a number sitting on a
	// pipe, on a symbol, or on a leader is a number the reader has to work at. What the fractions
	// were really trying to express is a PREFERENCE — which conflict to accept when they cannot all
	// be avoided — and a per-obstacle multiplier cannot express that. It is a property of the
	// alternatives, not of the obstacle: it needs a placement to compare against another placement,
	// which is Task 379's score and nothing this pass can hold.
	//
	// So 0.5 for a node and 0.4 for a pipe are gone. The one number that is not 1 is `manual`, and
	// it is not a fraction — it is a flag wearing a number, so that "practically immovable" falls
	// out of the same formula instead of needing a second code path.
	// **WEIGHT AND PREFERENCE ARE TWO DIFFERENT QUANTITIES AND THIS FILE HOLDS ONLY ONE OF THEM.**
	// Tom, 2026-08-15, after I put his number in the wrong one twice: *"pipe weight = 1. Pipe
	// preference = less than 1. Why do you keep confusing them?"*
	//
	//   WEIGHT (this array) = how much of an overlap must be gone when the iteration ends. For every
	//   real obstacle that is ALL of it, pipes included: a number lying across a pipe is a number
	//   the reader has to work at, so the pass should always try to clear it. Pipe = 1.
	//
	//   PREFERENCE = which conflict to ACCEPT when they cannot all be avoided. A pipe is the one
	//   thing a number may legitimately end up lying across, so its preference is below a symbol's
	//   or another label's. That is a comparison between two candidate PLACEMENTS, not a property of
	//   the obstacle, and this pass never compares placements -- it only pushes pairs apart. **There
	//   is nowhere here to put it.** It lives in Task 379's score, and is written down in section 4
	//   of dev/label-placement-goals.md so it is not lost in the meantime.
	//
	// Writing a preference into the weight field says something entirely different and wrong: it
	// tells the pass to clear only part of the overlap ALWAYS, even when the label had somewhere
	// perfectly good to go. That is what 0.4 and then 0.5 did, and it is why labels sat on pipes
	// with open space beside them.
	var WEIGHT = { pipe: 1, node: 1, label: 1, leader: 1, manual: 1000 };

	// **LEADERS ARE SEGMENTS TOO, AND THE SAMPLER IS GONE** (Tom, 2026-08-15: *"Why not do segment
	// testing on the leaders if it can be done?"*). It can, it is the same pushOffSegments() the
	// pipes use, and it is better in three ways at once: exact instead of a chain of squares that a
	// box could in principle slip between, O(1) per pair instead of one pair per 3 pixels of line,
	// and PERPENDICULAR -- a label crossing a diagonal leader now steps off it rather than sliding
	// along it. It also deletes the three constants that had been wrong in world units, the cap that
	// existed only to bound the chain, and the question of how fat a one-pixel line should be.
	//
	// The one thing that had to come with it is the OWNER exemption; see pushOffSegments().

	// Top-left corner of a box at its CURRENT position: the persisted/default base, plus
	// this element's live nudge (movable labels only), plus the box's own baseline-to-top
	// offset.
	// **WHAT A WEIGHT MEANS WHEN THE OTHER THING CANNOT MOVE** (rewritten 2026-08-15, after Tom:
	// *"Node labels still not avoiding pipes at all."*)
	//
	// The original formula gave the movable box a share of the separation proportional to the other
	// box's weight -- correct and self-evident for two labels, which move half each and are fully
	// apart after one iteration. Against something IMMOVABLE it quietly loses the rest: a label
	// pushed by a node symbol at 0.5 moved 0.5/1.5 = a THIRD of the way out per iteration, so after
	// the four iterations it was still 20% inside the symbol; a pipe at 0.25 got 20% per iteration
	// and cleared 59%, which on screen is a label sitting on the line exactly as before. **The pass
	// was not failing to push. It was pushing a fraction of the way and stopping.**
	//
	// So for an immovable obstacle the weight now means INSISTENCE: how much of the overlap must be
	// gone when this iteration ends. 1 clears completely, 0.4 leaves a little, 0 does nothing. It
	// resolves in ONE iteration instead of asymptotically, and it makes the number mean something a
	// person can predict from the value.
	function insistence(w) { return w > 1 ? 1 : (w < 0 ? 0 : w); }
	function boxTopLeft(b) {
		var nx = b.ref ? b.ref.nudge.x : 0, ny = b.ref ? b.ref.nudge.y : 0;
		return { x: b.base.x + nx, y: b.base.y + ny + b.yOff };
	}

	// Nudge each label box off whatever it overlaps -- another label, a node symbol, a Text
	// label, or a leader line -- along whichever axis has the smaller overlap, a few
	// iterations toward a stable layout. Only the boxes in `labels` ever move; `statics`
	// are immovable obstacles.
	//
	// `leaderBoxesFn` is called ONCE PER ITERATION and returns the leader sample boxes,
	// because a leader follows its own label: nudging the label moves the line, which
	// changes what that line collides with. Node symbols and Text labels do not move, so
	// `statics` is built once by the caller.
	//
	// Mutates `ref.nudge` on the movable boxes and returns the number of iterations run --
	// the caller has already zeroed every nudge, which is what makes the pass IDEMPOTENT:
	// running it twice on an unchanged drawing gives the same answer as running it once.
	// `segmentsFn` is called ONCE PER ITERATION and returns every line obstacle -- pipes and
	// leaders together, each with its own weight and, for a leader, its owner. Per iteration
	// because a leader follows its own label: nudging the label moves the line, which changes what
	// that line crosses. Pipes do not move and are rebuilt with them only to keep one contract.
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

	// **PIPES, AS SEGMENTS RATHER THAN AS SAMPLED BOXES** (Tom, 2026-08-15: *"I see that pipes have
	// no model/boxes. They need a model even if their weight is lower than other things... These
	// ideally would make some attempt to avoid these pipe conflicts if it's not too hard to do. It's
	// acceptable as is, but not preferable."*)
	//
	// Reversing a call made here, not by him: WEIGHT.pipe was 0 and pipes were left out of the pass
	// entirely, on the argument that "a number sitting on a pipe still reads perfectly well." True
	// of one number crossing one pipe; false in a dense network, where it is part of why labels
	// crowd the middle of a drawing while its margins sit empty.
	//
	// **NOT sampled into boxes the way a leader is, because the arithmetic does not survive it.**
	// Net3 has 119 pipes; chopped at 3 screen pixels a zoomed-in drawing would produce thousands of
	// boxes, and the pass is labels x boxes x iterations. A segment test is exact, is O(1) per
	// pair, and needs nothing sampled: project the box's half-extents onto the segment's normal to
	// get how far the box reaches that way, compare against the box centre's distance from the
	// line, and push along the normal by the shortfall.
	//
	// PERPENDICULAR, not along the smaller axis. A label lying across a pipe at 30 degrees should
	// step off the pipe, which is sideways from the pipe -- an axis-aligned push sends it along the
	// pipe as often as off it, and it lands back on the line a little further down.
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
				// iteration, forever. Same exemption the sampled boxes carried.
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
