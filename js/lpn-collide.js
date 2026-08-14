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
	// itself (Tom, 2026-07-30, restating the strengths he had already given after an
	// earlier cut misread them as "node labels resist harder than link labels"):
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
	var WEIGHT = { pipe: 0, node: 0.5, label: 1, leader: 1, manual: 1000 };

	// A leader line is sampled into a chain of small boxes rather than intersected
	// analytically -- the same overlap/push code then handles it with no second geometry
	// path. The step is well under a label box's smallest dimension, so a box cannot slip
	// between two samples; the cap keeps a very long leader from generating an unbounded
	// chain.
	var LEADER_SAMPLE_STEP = 0.5, LEADER_SAMPLE_MAX = 60, LEADER_SAMPLE_HALF = 0.15;

	function pushLeaderSamples(out, ax, ay, bx, by, owner) {
		var len = Math.hypot(bx - ax, by - ay), i, t,
			n = Math.min(LEADER_SAMPLE_MAX, Math.max(1, Math.ceil(len / LEADER_SAMPLE_STEP)));
		for (i = 0; i <= n; i++) {
			t = i / n;
			out.push({
				ref: null, owner: owner || null, movable: false, weight: WEIGHT.leader,
				base: { x: ax + (bx - ax) * t - LEADER_SAMPLE_HALF, y: ay + (by - ay) * t - LEADER_SAMPLE_HALF },
				yOff: 0, w: LEADER_SAMPLE_HALF * 2, h: LEADER_SAMPLE_HALF * 2
			});
		}
	}

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
	function relax(labels, statics, leaderBoxesFn, iterations) {
		var boxes, i, j, iter, moved, iters = iterations === undefined ? 4 : iterations;
		for (iter = 0; iter < iters; iter++) {
			moved = false;
			// The label boxes are first in `boxes`, so an outer loop over just those, with
			// the inner loop starting at i+1, visits every label-label pair exactly once and
			// every label-obstacle pair exactly once, and never wastes a comparison on two
			// obstacles (neither of which could move anyway).
			boxes = labels.concat(statics, leaderBoxesFn ? leaderBoxesFn() : []);
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
					if (overlapX < overlapY) {
						var shareAx = (overlapX + 0.1) * B.weight / wSum, shareBx = (overlapX + 0.1) * A.weight / wSum;
						var dirX = (At.x + A.w / 2 <= Bt.x + B.w / 2) ? -1 : 1;
						if (A.movable) { A.ref.nudge.x += dirX * shareAx; }
						if (B.movable) { B.ref.nudge.x -= dirX * shareBx; }
					} else {
						var shareAy = (overlapY + 0.1) * B.weight / wSum, shareBy = (overlapY + 0.1) * A.weight / wSum;
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

	return {
		WEIGHT: WEIGHT,
		LEADER_SAMPLE_STEP: LEADER_SAMPLE_STEP,
		LEADER_SAMPLE_MAX: LEADER_SAMPLE_MAX,
		LEADER_SAMPLE_HALF: LEADER_SAMPLE_HALF,
		pushLeaderSamples: pushLeaderSamples,
		boxTopLeft: boxTopLeft,
		relax: relax
	};
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
