// looped-network.js — Task 146 Phase 1 (Looped Pipe Network, Map Interface, prefix lpn_)
//
// The SVG canvas mechanics below are a direct port of the technology validated in
// dev/lpn-spike/canvas-spike.html (13 rounds of on-device iteration + an Opus review —
// see dev/lpn-spike/phase0-acceptance.md for the full record of what was tried and why).
// This first pass ports the canvas engine and just enough toolbar to create the five
// element types from an empty canvas. Hydraulic property fields, unit-aware popups, the
// solver wire-up, diagnostics, autosave and undo are a following pass (ROADMAP Task 146
// Phase 1 continues).
//
// Pump is a LINK type here, not a node type, even though the ROADMAP phrasing lists it
// alongside Junction/Reservoir as if it were a fifth point element: js/lpn-solver.js's
// own model treats a pump exactly like EPANET does, as a link carrying a curve
// (link.type === 'pump'), not a node. The toolbar mirrors that: Add Pipe and Add Pump both
// work by clicking a from-node then a to-node; Junction/Reservoir/Text place with one click.

var EngCalcs = EngCalcs || {};

(function () {
	'use strict';

	var NS = 'http://www.w3.org/2000/svg';
	var svg, world, backdropLayer, gridLayer, linksLayer, nodesLayer, maskLayer, labelsLayer;
	var state = { tx: 0, ty: 0, s: 1 };
	// Text size (Task 146 gear/settings panel, 2026-07-30): user-configurable via `settings.textSize`/
	// `settings.textSizeUnits` (see defaultSettings() below), shared by a node's ID/pressure label,
	// a link's label, and a user-added Text label -- no reason for these to render at different sizes
	// by default. 'map' units (the default, reproducing the original fixed LABEL_FONT_SIZE=2.5
	// behavior byte-for-byte) means the size is a world-unit constant that scales with zoom, same as
	// the network geometry itself. 'screen' units means the text stays a constant ON-SCREEN size
	// regardless of zoom -- achieved by dividing the world-unit size by the current scale, so it must
	// be recomputed (see refreshFontSizes() below) whenever state.s changes, not just once at build
	// time like every other geometry in this file.
	// mult (Task 146.03): a Text label's own per-label size multiplier (lb.sizeMult, default 1),
	// stacked on top of the shared settings.textSize -- node/link labels never pass one, so they
	// are unaffected.
	function effectiveFontSize(mult) {
		var base = settings.textSizeUnits === 'screen' ? settings.textSize / state.s : settings.textSize;
		return base * (mult || 1);
	}
	function effectiveLineHeight() { return effectiveFontSize() * 1.2; }
	// Everything on the map that is drawn at a fixed world size was drawn for the DEFAULT text size,
	// so it is expressed as "base dimension x textFactor()" -- 1 at the default, and tracking the
	// user's Text size (and, in 'screen' units, the zoom) everywhere else. Used by the extrema
	// badges, the leader threshold, the default label offset, and -- multiplied by the user's own
	// symbolScale -- every symbol; see symbolFactor().
	var LPN_BASE_TEXT_SIZE = 2.5; // defaultSettings().textSize
	function textFactor(mult) { return effectiveFontSize(mult) / LPN_BASE_TEXT_SIZE; }

	// ---- Task 146.01: draggable node/link data labels (leader lines + collision avoidance + mask) ----
	// A node/link's data label sits at a small fixed offset from its anchor (id/elev/demand/... text
	// beside the symbol) unless the user drags it -- n.lx/n.ly (or l.lx/l.ly) then record that as an
	// explicit offset, persisted with the element like any other property. undefined means "still at
	// the default" so an old saved network (no lx/ly at all) renders identically to before this task.
	// Scaled with the symbols, not fixed (Tom, 2026-07-30): the offset exists to clear the node or
	// pipe the label belongs to, so at 2x symbols a fixed +2,-2 would start the label inside its own
	// node. A label the user has DRAGGED keeps the exact offset they dropped it at (n.lx/n.ly are
	// absolute world units) -- only the resting position follows the size.
	var DEFAULT_LABEL_OFFSET = { x: 2, y: -2 };
	function defaultLabelOffset() {
		var k = symbolFactor();
		return { x: DEFAULT_LABEL_OFFSET.x * k, y: DEFAULT_LABEL_OFFSET.y * k };
	}
	// Past this distance between the anchor point and the label's rendered position (drag OR
	// automatic collision-avoidance nudge -- whichever pushed it there), a leader line is drawn so
	// the label still reads as belonging to its anchor. Comfortably above the default offset's own
	// resting distance (hypot(2,2) ~= 2.8) so an untouched label never shows one -- which is only
	// true if it scales with that offset, hence textFactor() (Tom, 2026-07-30: "leader toggle
	// decision distance isn't scaling, I think"). Text rather than symbol factor: what the threshold
	// is really protecting is the reader's ability to tie a number back to its element by proximity,
	// and that judgment is made at the scale of the text.
	var LABEL_LEADER_THRESHOLD = 4;
	function leaderThreshold() { return LABEL_LEADER_THRESHOLD * Math.max(textFactor(), symbolFactor()); }
	function nodeLabelBase(n) {
		var d = defaultLabelOffset();
		return { x: n.x + (n.lx !== undefined ? n.lx : d.x),
			y: n.y + (n.ly !== undefined ? n.ly : d.y) };
	}
	// The point a fraction `f` of the way along the WHOLE polyline, by arc length -- not the
	// midpoint of some chosen segment. Returns the point plus the along-distance it sits at, so
	// callers can reason about spacing between things placed on the same link.
	function pointAlongLink(l, f) {
		var pts = [nodeById(l.from)].concat(l.verts, [nodeById(l.to)]), segs = [], total = 0, i, d, want, run;
		for (i = 0; i < pts.length - 1; i++) {
			d = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
			segs.push(d); total += d;
		}
		if (!(total > 0)) { return { x: pts[0].x, y: pts[0].y, dist: 0, total: 0 }; }
		want = f * total; run = 0;
		for (i = 0; i < segs.length; i++) {
			if (run + segs[i] >= want || i === segs.length - 1) {
				var t = segs[i] > 0 ? (want - run) / segs[i] : 0;
				t = Math.max(0, Math.min(1, t));
				return {
					x: pts[i].x + (pts[i + 1].x - pts[i].x) * t,
					y: pts[i].y + (pts[i + 1].y - pts[i].y) * t,
					dist: want, total: total
				};
			}
			run += segs[i];
		}
		return { x: pts[0].x, y: pts[0].y, dist: 0, total: total };
	}
	// A link's label anchors at the halfway point OF THE WHOLE PIPE, measured along its length
	// (Tom, 2026-07-30: "link label is placing within last segment instead of overall length. Not
	// good."). The old version took the midpoint of the middle SEGMENT, which on a bent pipe with an
	// even segment count is nowhere near halfway along the pipe -- on a two-segment link it landed
	// in the middle of the second leg.
	var LINK_LABEL_ALONG = 0.5;
	// ...then stepped away from any flow arrow it would land on top of ("but don't conflict with an
	// arrow"). Arrows sit at ARROW_ALONG of each SEGMENT, so on some geometries the two coincide.
	// The label moves along the pipe rather than off it, keeping it on the thing it labels, and is
	// clamped well inside the ends so it never crowds a node.
	function linkLabelMid(l) {
		var here = pointAlongLink(l, LINK_LABEL_ALONG);
		if (!(here.total > 0)) { return here; }
		var clear = (ARROW_NOMINAL_LEN * symbolFactor()) * 1.5,
			arrows = arrowAlongDistances(l), i, f;
		for (i = 0; i < arrows.length; i++) {
			if (Math.abs(arrows[i] - here.dist) >= clear) { continue; }
			// Step to whichever side of this arrow is farther from the pipe's own ends, so the
			// dodge never pushes the label off the end of a short pipe.
			f = (arrows[i] > here.dist)
				? (arrows[i] - clear) / here.total
				: (arrows[i] + clear) / here.total;
			f = Math.max(0.12, Math.min(0.88, f));
			return pointAlongLink(l, f);
		}
		return here;
	}
	function linkLabelBase(l) {
		var mid = linkLabelMid(l), d = defaultLabelOffset();
		return { x: mid.x + (l.lx !== undefined ? l.lx : d.x),
			y: mid.y + (l.ly !== undefined ? l.ly : d.y) };
	}
	// Final rendered offset from the anchor = the persisted drag offset (or default) PLUS this
	// element's current collision-avoidance nudge (0,0 for a manually-dragged label -- see
	// runLabelCollisionAvoidance() below, which only ever nudges labels still at their default).
	function nodeLabelPos(n) {
		var base = nodeLabelBase(n), ne = nodeEls[n.id], nudge = (ne && ne.nudge) || { x: 0, y: 0 };
		return { x: base.x + nudge.x, y: base.y + nudge.y };
	}
	function linkLabelPos(l) {
		var base = linkLabelBase(l), le = linkEls[l.id], nudge = (le && le.nudge) || { x: 0, y: 0 };
		return { x: base.x + nudge.x, y: base.y + nudge.y };
	}
	// Shared leader-line show/hide + endpoint math for a node or link data label -- anchor is the
	// node center or the link's mid-segment point; pos is the label's final rendered position
	// (base offset + nudge). `holder` is nodeEls[id]/linkEls[id] (needs .leader, .tw, and a
	// persistent .side to track across calls -- same role as a Text label's le.side).
	// Same side-flip hysteresis as a Text label's leader (updateLabelGeometry() below, ADVERSE_FRAC):
	// a data label is left-anchored (box is [pos.x, pos.x+tw], not centered like a Text label), so
	// the "offset from anchor" this compares against trigger is the BOX CENTER's offset
	// (pos.x + tw/2 - anchor.x) -- the exact analog of a Text label's lb.x, which IS its box
	// center's offset since Text is text-anchor:middle. Tom, 2026-07-30: "leaders need to jump
	// following the same rule as the Text leaders" -- without this a data label dragged to the left
	// of its anchor drew its leader to the label's LEFT edge, running the line straight through the
	// text instead of attaching to the near (right) edge.
	function updateDataLeader(holder, anchor, pos) {
		if (!holder.leader) { return; }
		if (holder.empty) { holder.leader.style.display = 'none'; return; }
		var d = Math.hypot(pos.x - anchor.x, pos.y - anchor.y);
		if (d <= leaderThreshold()) { holder.leader.style.display = 'none'; return; }
		var halfW = holder.tw / 2, boxCenterX = pos.x + halfW, offset = boxCenterX - anchor.x,
			trigger = halfW * (1 - 2 * ADVERSE_FRAC);
		if (!holder.side) { holder.side = 'right'; }
		if (holder.side === 'right' && offset < trigger) { holder.side = 'left'; }
		else if (holder.side === 'left' && offset > -trigger) { holder.side = 'right'; }
		var leaderX = holder.side === 'right' ? pos.x : pos.x + holder.tw;
		holder.leader.style.display = '';
		holder.leader.setAttribute('x1', anchor.x); holder.leader.setAttribute('y1', anchor.y);
		holder.leader.setAttribute('x2', leaderX); holder.leader.setAttribute('y2', pos.y);
	}
	// Approximate vertical box of a left-anchored, top-down multi-line <text> (node/link labels):
	// no exact ascent/descent metrics available cross-browser without layout, so this uses a
	// fraction of font size that reads right for the suite's actual label content (short numbers/
	// letters, no descenders like "g"/"y"). Good enough for a mask rect and collision boxes; not
	// meant to be pixel-exact.
	function dataLabelBoxHeight(lineCount) {
		var fs = effectiveFontSize();
		return fs * 1.1 + Math.max(0, lineCount - 1) * effectiveLineHeight();
	}
	// Background mask (Task 146.01): a plain rect behind a label's text so it stays legible over a
	// backdrop image, colored fill, or another element -- sized from the SAME w/h the label's own
	// geometry uses (dataLabelBoxHeight() above for a node/link label, effectiveFontSize()*1.2 for a
	// single-line Text label), so it never drifts out of sync with what it's supposed to cover.
	// hAlign/vAlign describe what x/y MEAN for the label being masked, matching each label type's own
	// text-anchor/dominant-baseline: 'start'/'top' for a node or link label (x = left edge, y = first
	// line's baseline); 'middle'/'middle' for a Text label (x = center, y = vertical center).
	function positionMaskRect(mask, x, y, w, h, hAlign, vAlign) {
		var pad = 0.4, fs = effectiveFontSize();
		var left = hAlign === 'middle' ? x - w / 2 : x;
		var top = vAlign === 'middle' ? y - h / 2 : y - fs * 0.85;
		mask.setAttribute('x', left - pad);
		mask.setAttribute('y', top - pad);
		mask.setAttribute('width', w + 2 * pad);
		mask.setAttribute('height', h + 2 * pad);
	}
	// Final per-frame layout of one node's data label -- text position, its mask, and its leader (if
	// dragged/nudged past LABEL_LEADER_THRESHOLD). Called from buildNodeEls() (first layout),
	// updateNode() (node moved), and refreshLabelText() (after every collision-avoidance pass, since
	// a nudge or a toggled field changing tw/lineCount both move this label).
	// A label with no fields toggled on (or a reservoir/pump with only type-inapplicable fields
	// toggled) still gets an empty placeholder line pushed in refreshLabelText() so getBBox() never
	// throws -- but rendering a mask/leader for genuinely empty content produced a small floating
	// white "ghost" box near the node with nothing in it (Tom, 2026-07-30). ne.empty/le.empty (set
	// in refreshLabelText(), BEFORE the placeholder is pushed) skips both here.
	function hideMask(mask) { mask.setAttribute('width', 0); mask.setAttribute('height', 0); }
	function layoutNodeLabel(id) {
		var n = nodeById(id), ne = nodeEls[id]; if (!ne) { return; }
		var pos = nodeLabelPos(n);
		repositionMultilineText(ne.text, pos.x, pos.y);
		if (ne.empty) { hideMask(ne.mask); } else { positionMaskRect(ne.mask, pos.x, pos.y, ne.tw, dataLabelBoxHeight(ne.lineCount), 'start', 'top'); }
		updateDataLeader(ne, { x: n.x, y: n.y }, pos);
	}
	// Same as layoutNodeLabel() above, for a link's data label -- anchor is the link's own mid-
	// segment point (linkLabelMid()), which itself moves whenever a vertex/endpoint drags.
	function layoutLinkLabel(id) {
		var l = linkById(id), le = linkEls[id]; if (!le) { return; }
		var pos = linkLabelPos(l), mid = linkLabelMid(l);
		repositionMultilineText(le.text, pos.x, pos.y);
		if (le.empty) { hideMask(le.mask); } else { positionMaskRect(le.mask, pos.x, pos.y, le.tw, dataLabelBoxHeight(le.lineCount), 'start', 'top'); }
		updateDataLeader(le, { x: mid.x, y: mid.y }, pos);
	}
	// Double-click-to-reset (Tom, 2026-07-30): clears a manually-dragged label's offset entirely
	// (n.lx/n.ly back to undefined), so it falls back to DEFAULT_LABEL_OFFSET and the leader --
	// which only shows past LABEL_LEADER_THRESHOLD -- disappears with it. A discrete, deliberate
	// action like Delete/Add, so it gets its own undo snapshot (a drag itself does not -- see the
	// comment on the 'label' drag case in applyDrag()).
	function resetNodeLabelHome(id) {
		var n = nodeById(id); if (!n || n.lx === undefined) { return; }
		saveUndoSnapshot();
		delete n.lx; delete n.ly;
		layoutNodeLabel(id);
		scheduleSolve();
	}
	function resetLinkLabelHome(id) {
		var l = linkById(id); if (!l || l.lx === undefined) { return; }
		saveUndoSnapshot();
		delete l.lx; delete l.ly;
		layoutLinkLabel(id);
		scheduleSolve();
	}
	// Automatic conflict avoidance (Task 146.01): nudges a node/link data label off whatever it
	// overlaps -- another label, a node symbol, a Text label, or a leader line -- along whichever
	// axis has the smaller overlap, a few iterations toward a stable layout. Only data labels ever
	// move; everything else is an immovable obstacle.
	// A MANUALLY dragged label (n.lx/l.lx defined) never moves -- it still blocks others (its box is
	// still checked), but only an auto-placed label absorbs the push, so a deliberate drag is never
	// silently undone by this pass. Nudges are transient (recomputed every refreshLabelText() call,
	// never written into n.lx/l.ly), so they are not undo-tracked or persisted -- only an actual
	// user drag is.
	// Per-OBJECT repel strength -- how hard a given thing on the map pushes a label out of itself
	// (Tom, 2026-07-30, restating the strengths he had already given after an earlier cut misread
	// them as "node labels resist harder than link labels"):
	//   pipe   0    -- a pipe never pushes a label at all. Pipe routes cross the whole drawing and a
	//                  number sitting on one still reads perfectly well, so pipes are simply left out
	//                  of the pass below rather than added with a zero that can never do anything.
	//   node   0.5  -- a node SYMBOL pushes at half strength: worth stepping off, but not worth
	//                  flinging a label across the map to avoid.
	//   label  1    -- another label pushes at full strength. Text over text is the unreadable case.
	//   leader 1    -- so does a leader LINE: a rule drawn straight through a number is just as bad.
	// Node data labels and link data labels are the same kind of object and therefore carry the same
	// strength (1); there is no node-vs-link distinction here.
	// A box's push SHARE is proportional to the OTHER object's strength, so two labels split a
	// separation 50/50 while an immovable obstacle (node symbol, leader, or a manually-dragged label)
	// absorbs none of it. A manually-dragged label is flagged immovable AND given a very large
	// strength, so "practically immovable" falls out of the same formula instead of being a second
	// code path.
	var LPN_COLLIDE_WEIGHT = { pipe: 0, node: 0.5, label: 1, leader: 1, manual: 1000 };
	// A leader line is sampled into a chain of small boxes rather than intersected analytically --
	// the same overlap/push code then handles it with no second geometry path. The step is well
	// under a label box's smallest dimension, so a box cannot slip between two samples; the cap
	// keeps a very long leader from generating an unbounded chain.
	var LEADER_SAMPLE_STEP = 0.5, LEADER_SAMPLE_MAX = 60, LEADER_SAMPLE_HALF = 0.15;
	// owner is the holder whose OWN label this leader belongs to -- that one label is exempt below,
	// or the leader (which by construction ends on the label's near edge) would push its own label
	// a little farther away on every iteration, forever.
	function pushLeaderSamples(out, ax, ay, bx, by, owner) {
		var len = Math.hypot(bx - ax, by - ay), i, t,
			n = Math.min(LEADER_SAMPLE_MAX, Math.max(1, Math.ceil(len / LEADER_SAMPLE_STEP)));
		for (i = 0; i <= n; i++) {
			t = i / n;
			out.push({
				ref: null, owner: owner || null, movable: false, weight: LPN_COLLIDE_WEIGHT.leader,
				base: { x: ax + (bx - ax) * t - LEADER_SAMPLE_HALF, y: ay + (by - ay) * t - LEADER_SAMPLE_HALF },
				yOff: 0, w: LEADER_SAMPLE_HALF * 2, h: LEADER_SAMPLE_HALF * 2
			});
		}
	}
	// Top-left corner of a box at its CURRENT position: the persisted/default base, plus this
	// element's live nudge (movable labels only), plus the box's own baseline-to-top offset.
	function collideBoxTopLeft(b) {
		var nx = b.ref ? b.ref.nudge.x : 0, ny = b.ref ? b.ref.nudge.y : 0;
		return { x: b.base.x + nx, y: b.base.y + ny + b.yOff };
	}
	// Every leader currently drawn, as sample boxes -- recomputed inside the relaxation loop because
	// a leader follows its own label: nudging the label moves the line, which changes what that line
	// collides with. Mirrors updateDataLeader()/updateLabelGeometry()'s own geometry, minus the
	// side-flip hysteresis (which needs render state and cannot change the line by more than the
	// label's own width).
	function currentLeaderBoxes() {
		var out = [];
		function dataLeader(holder, anchor, pos) {
			if (!holder || holder.empty) { return; }
			if (Math.hypot(pos.x - anchor.x, pos.y - anchor.y) <= leaderThreshold()) { return; }
			var right = (pos.x + holder.tw / 2) >= anchor.x;
			pushLeaderSamples(out, anchor.x, anchor.y, right ? pos.x : pos.x + holder.tw, pos.y, holder);
		}
		doc.nodes.forEach(function (n) { dataLeader(nodeEls[n.id], { x: n.x, y: n.y }, nodeLabelPos(n)); });
		doc.links.forEach(function (l) { dataLeader(linkEls[l.id], linkLabelMid(l), linkLabelPos(l)); });
		doc.labels.forEach(function (lb) {
			var le = labelEls[lb.id], an = lb.anchorNode ? nodeById(lb.anchorNode) : null;
			if (!le || !an) { return; }
			var halfW = le.width / 2, px = an.x + lb.x, py = an.y + lb.y;
			pushLeaderSamples(out, an.x, an.y, lb.x >= 0 ? px - halfW : px + halfW, py, null);
		});
		return out;
	}
	// Immovable, non-leader obstacles: node symbols (strength 0.5) and Text labels (strength 1,
	// since a Text is a label the user placed deliberately -- a data label yields to it, never the
	// reverse). Pipes are absent by design; see LPN_COLLIDE_WEIGHT above.
	function staticObstacleBoxes() {
		var out = [];
		doc.nodes.forEach(function (n) {
			var r = nodeRadius(n);
			out.push({
				ref: null, owner: null, movable: false, weight: LPN_COLLIDE_WEIGHT.node,
				base: { x: n.x - r, y: n.y - r }, yOff: 0, w: r * 2, h: r * 2
			});
		});
		doc.labels.forEach(function (lb) {
			var le = labelEls[lb.id]; if (!le) { return; }
			var an = lb.anchorNode ? nodeById(lb.anchorNode) : null,
				cx = an ? an.x + lb.x : lb.x, cy = an ? an.y + lb.y : lb.y,
				h = effectiveFontSize(lb.sizeMult) * 1.2;
			out.push({
				ref: null, owner: null, movable: false, weight: LPN_COLLIDE_WEIGHT.label,
				base: { x: cx - le.width / 2, y: cy - h / 2 }, yOff: 0, w: le.width, h: h
			});
		});
		return out;
	}
	function runLabelCollisionAvoidance() {
		var fs = effectiveFontSize(), labels = [], statics = staticObstacleBoxes(), boxes, i, j, iter, moved;
		function addDataLabel(holder, base, manual, lineCount) {
			// Every nudge is cleared and re-derived from scratch on every pass, manual or not, so the
			// pass is IDEMPOTENT: running it twice on an unchanged drawing gives the same answer as
			// running it once. It used to keep an auto label's previous nudge and push further from
			// there, which meant a label stayed pushed long after whatever it collided with had moved
			// away, and made re-running it during a drag (which is what makes collisions and leaders
			// track a label being dragged, Tom 2026-07-30) accumulate drift on every frame.
			holder.nudge = { x: 0, y: 0 };
			if (holder.empty) { return; } // nothing rendered -- no box to collide with
			labels.push({
				ref: holder, owner: null, movable: !manual,
				weight: manual ? LPN_COLLIDE_WEIGHT.manual : LPN_COLLIDE_WEIGHT.label,
				base: base, yOff: -fs * 0.85, w: holder.tw, h: dataLabelBoxHeight(lineCount)
			});
		}
		doc.nodes.forEach(function (n) {
			var ne = nodeEls[n.id]; if (!ne) { return; }
			addDataLabel(ne, nodeLabelBase(n), n.lx !== undefined, ne.lineCount);
		});
		doc.links.forEach(function (l) {
			var le = linkEls[l.id]; if (!le) { return; }
			addDataLabel(le, linkLabelBase(l), l.lx !== undefined, le.lineCount);
		});
		for (iter = 0; iter < 4; iter++) {
			moved = false;
			// Leaders are rebuilt every iteration (they track their labels); node symbols and Text
			// labels do not move, so they are built once above.
			// The label boxes are first in `boxes`, so an outer loop over just those, with the inner
			// loop starting at i+1, visits every label-label pair exactly once and every
			// label-obstacle pair exactly once, and never wastes a comparison on two obstacles
			// (neither of which could move anyway).
			boxes = labels.concat(statics, currentLeaderBoxes());
			for (i = 0; i < labels.length; i++) {
				for (j = i + 1; j < boxes.length; j++) {
					var A = boxes[i], B = boxes[j];
					if (!A.movable && !B.movable) { continue; } // nothing can absorb the push; skip rather than spin
					if (B.owner === A.ref) { continue; }        // a label never collides with its own leader
					var At = collideBoxTopLeft(A), Bt = collideBoxTopLeft(B);
					var overlapX = Math.min(At.x + A.w, Bt.x + B.w) - Math.max(At.x, Bt.x);
					var overlapY = Math.min(At.y + A.h, Bt.y + B.h) - Math.max(At.y, Bt.y);
					if (overlapX <= 0 || overlapY <= 0) { continue; }
					moved = true;
					// A's share of the separation is proportional to B's strength (and vice versa) --
					// a stronger object moves the other one more than it moves itself.
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
			if (!moved) { break; }
		}
	}
	// Rebuilds a <text> element's tspans from scratch -- simplest correct approach given the line
	// count changes every time a label toggle is flipped. Each tspan repeats the same x (not a
	// relative dx) so every line stays left/anchor-aligned under the first, which is the standard
	// SVG multi-line-text idiom. line.color tints the field per lpnFieldColors; the extrema
	// tick mark (line.decoration) is drawn separately by applyExtremaTicks() below, not here --
	// text-decoration on the number itself (the original design) read as ambiguous (Tom, 2026-07-30:
	// "I don't know if there is something else"), so the mark lives beside the number, not on it.
	function setMultilineText(textEl, x, lines) {
		while (textEl.firstChild) { textEl.removeChild(textEl.firstChild); }
		lines.forEach(function (line, i) {
			var tspan = el('tspan', { x: x, dy: i === 0 ? 0 : effectiveLineHeight() }, textEl);
			if (line.color) { tspan.setAttribute('fill', line.color); }
			tspan.textContent = line.text;
		});
	}
	// A two-rail badge just after a decorated number -- a chevron pointing UP at the top rail for the
	// network-wide max, DOWN at the bottom rail for the min (Tom, 2026-07-30, replacing an
	// overline/underline-the-number design that read as ambiguous and unfamiliar). Positioned from
	// the number tspan's OWN rendered width
	// (getComputedTextLength(), only meaningful once the tspan is attached and laid out -- i.e.
	// called right after setMultilineText()), so it sits immediately after the digits regardless of
	// how wide they are. `holder` is nodeEls[id]/linkEls[id]; old ticks are removed first since the
	// line count/decorations can change on every toggle or solve.
	// Per Tom's reference sketch (2026-07-30): the rail and the chevron TOUCH -- the chevron's vertex
	// KISSES the rail it points at (the visible tip lands on that rail's near edge without crossing
	// it) and its two legs splay from there back toward the digit, between the rails. A single
	// connected mark, rail-then-caret, not two marks with daylight between them.
	// Every dimension below is per unit of TEXT FACTOR (textFactor(), = 1 at the default 2.5 text
	// size), not a fixed world size: the badge decorates a number, so it has to grow and shrink with
	// that number or it stops reading as part of it (Tom, 2026-07-30: "extrema indicators aren't
	// scaling"). The rise/drop constants below were already × font size; these were the ones that
	// were not.
	var TICK_STROKE = 0.3;
	var CARET_LEG_DROP = 0.45; // vertex-to-leg-end vertical size of the caret itself
	var CARET_LEG_HALF = 0.5;  // vertex-to-leg-end horizontal half-width
	var TICK_LENGTH = 1.6;
	var TICK_GAP = 0.3;        // digits-to-rail gap
	// A stroked polyline's mitered vertex extends past its GEOMETRIC vertex by
	// halfWidth / sin(half-angle between the legs) -- so a vertex placed exactly on the tick pokes
	// visibly through it (Tom, 2026-07-30: "the points of the chevrons are extending past the
	// lines"). Backing the vertex off by that overshoot plus the tick's own half-width puts the tip
	// on the tick's near edge instead. Scale-free (a ratio of two lengths that scale together), so
	// it is still computed once.
	var CARET_TIP_INSET = (TICK_STROKE / 2) *
		(Math.sqrt(CARET_LEG_HALF * CARET_LEG_HALF + CARET_LEG_DROP * CARET_LEG_DROP) / CARET_LEG_HALF) +
		TICK_STROKE / 2;
	// Tick line placement relative to the number's baseline. "high" sits near the digit's cap height
	// above the baseline; "low" sits so its OUTSIDE (lower) edge is even with the outside (baseline)
	// of the digits -- pulled 1/8 of a text height back toward the middle from the first cut
	// (Tom, 2026-07-30, reference sketch "FIX MIN POSITION").
	var TICK_HIGH_RISE = 0.62;  // × font size, above baseline
	var TICK_LOW_DROP = 0.125;  // × font size, subtracted from the old +0.2 below baseline
	function applyExtremaTicks(holder, textEl, layer, lines) {
		if (holder.tickEls) { holder.tickEls.forEach(function (t) { t.remove(); }); }
		holder.tickEls = [];
		var x = +textEl.getAttribute('x'), baseY = +textEl.getAttribute('y'), fs = effectiveFontSize(),
			tf = textFactor(), stroke = TICK_STROKE * tf,
			i, tspan, width, y, lineY, yHigh, yLow, x0, x1, dir, vertexY, legY, vertexX, chevronPts;
		for (i = 0; i < lines.length; i++) {
			if (!lines[i].decoration) { continue; }
			tspan = textEl.childNodes[i];
			try { width = tspan.getComputedTextLength(); } catch (err) { width = 0; }
			x0 = x + width + TICK_GAP * tf; x1 = x0 + TICK_LENGTH * tf;
			// dir points from the marked rail back toward the baseline -- down for a "high" mark
			// (which nests under the top rail), up for a "low" one (which nests over the bottom rail).
			dir = lines[i].decoration === 'high' ? 1 : -1;
			lineY = baseY + i * effectiveLineHeight();
			yHigh = lineY - fs * TICK_HIGH_RISE;
			yLow = lineY + 0.2 * tf - fs * TICK_LOW_DROP;
			// BOTH rails are drawn on every mark (Tom, 2026-07-30) -- the badge's footprint is then
			// identical for a max and a min, so the only thing the eye decodes is which way the
			// chevron points, an absolute judgment. The earlier single-rail design asked the reader to
			// judge where one line sat relative to digits it wasn't touching, a relative one.
			y = lines[i].decoration === 'high' ? yHigh : yLow;
			holder.tickEls.push(el('line', {
				x1: x0, y1: yHigh, x2: x1, y2: yHigh, stroke: lines[i].color || '#000',
				'stroke-width': stroke, 'class': 'lpn-tick'
			}, layer));
			holder.tickEls.push(el('line', {
				x1: x0, y1: yLow, x2: x1, y2: yLow, stroke: lines[i].color || '#000',
				'stroke-width': stroke, 'class': 'lpn-tick'
			}, layer));
			vertexY = y + dir * CARET_TIP_INSET * tf;
			legY = vertexY + dir * CARET_LEG_DROP * tf;
			vertexX = (x0 + x1) / 2;
			chevronPts = (vertexX - CARET_LEG_HALF * tf) + ',' + legY + ' ' + vertexX + ',' + vertexY + ' ' +
				(vertexX + CARET_LEG_HALF * tf) + ',' + legY;
			holder.tickEls.push(el('polyline', {
				points: chevronPts, fill: 'none', stroke: lines[i].color || '#000',
				'stroke-width': stroke, 'class': 'lpn-tick'
			}, layer));
		}
	}
	// Repositions an already-built multi-line label (drag/geometry updates) without touching its
	// content -- setMultilineText() gives each tspan its own explicit x (needed for the multi-line
	// stacking idiom), so moving the parent <text>'s x/y alone would leave old tspans stranded at
	// the previous position; every tspan's x must move with it.
	function repositionMultilineText(textEl, x, y) {
		textEl.setAttribute('x', x); textEl.setAttribute('y', y);
		var i, child;
		for (i = 0; i < textEl.childNodes.length; i++) {
			child = textEl.childNodes[i];
			// Element children only (tspans, from setMultilineText()) -- a freshly built node/link
			// label (Task 146.01's layoutNodeLabel()/layoutLinkLabel(), called before the first
			// refreshLabelText() pass converts it) still holds a single plain text node from its
			// initial textContent assignment, which has no setAttribute.
			if (child.nodeType === 1) { child.setAttribute('x', x); }
		}
	}
	// Network-wide max/min of a field's values, skipping undefined (element types that don't carry
	// it, or a solve result not yet available). Returns null when fewer than 3 defined values exist
	// (Tom, 2026-07-30) -- with only 1 or 2 members "the max" and "the min" aren't a finding, just
	// the two ends of a trivial set (with 1, the same value would be both at once).
	function fieldExtrema(values) {
		var defined = values.filter(function (v) { return typeof v === 'number'; });
		if (defined.length < 3) { return null; }
		return { min: Math.min.apply(null, defined), max: Math.max.apply(null, defined) };
	}
	// 'high'/'low', not a boolean -- ties (2+ elements sharing the extreme) all get marked, not
	// just the first found, since each element is judged independently against the same extrema.
	function decorationFor(extrema, value) {
		// Task 190's global toggle is enforced HERE, not by suppressing the extrema themselves: the
		// extrema objects stay computed and correct, so turning the marks back on needs no recompute
		// and nothing else that reads them can go stale while they are hidden.
		if (!labelSettings.markExtrema) { return undefined; }
		if (!extrema || typeof value !== 'number') { return undefined; }
		if (value === extrema.max && value === extrema.min) { return undefined; }
		if (value === extrema.max) { return 'high'; }
		if (value === extrema.min) { return 'low'; }
		return undefined;
	}

	// The document. nodes: Junction/Reservoir (point elements). links: Pipe/Pump (two
	// endpoints + optional bend vertices). labels: Text elements with a leader to an
	// anchor node, OR a free-floating text with anchorNode === null.
	var doc = { nodes: [], links: [], labels: [] };
	var nextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };

	// ---- Project / scenario container (ROADMAP Task 184, shipped by 146.08) ----
	// A save is a PROJECT: one network (doc above) plus a list of SCENARIOS. Base is canon and has
	// no overrides; every other scenario is nothing but a collection of overrides. Base is a row in
	// the same array, flagged isBase -- so the (future) scenario selector has no special case, and
	// because nothing carries a parent pointer a scenario-of-a-scenario is UNREPRESENTABLE rather
	// than merely discouraged. That structural asymmetry is the model, not a convention.
	// Shipped with Base as the only scenario and NO scenario UI: the container has to exist from day
	// one so scenarios are purely additive later and there is never a second storage migration.
	// Like settings/backdrop and unlike doc, these are not undo-snapshotted. That costs nothing
	// today (Base's overrides are permanently empty, so nothing here can change under an undo);
	// whether an override edit joins the undo stack is a real question for the scenario-UI build,
	// and Task 184 already answers it "yes, one document, one undo stack" -- so expect this to move
	// into the snapshot then, which is a one-line change while the map is still empty.
	function defaultScenarios() {
		// name 'Base' is the shape Task 184 documents; display code should key off isBase and render
		// its own localized word, never echo this string, so the stored data stays language-free.
		return [{ id: 'base', name: 'Base', isBase: true, overrides: {} }];
	}
	var scenarios = defaultScenarios();
	// A blank name means "not named yet"; the UI renders its own localized "Untitled" for that case
	// rather than storing an English word in the user's data.
	var project = { name: '', activeScenario: 'base' };
	function baseScenario() {
		for (var i = 0; i < scenarios.length; i++) { if (scenarios[i].isBase) { return scenarios[i]; } }
		return scenarios[0];
	}
	function activeScenario() {
		for (var i = 0; i < scenarios.length; i++) { if (scenarios[i].id === project.activeScenario) { return scenarios[i]; } }
		return baseScenario();
	}

	// Overridable-property whitelist -- cheap to widen, expensive to narrow (Task 184). The line is
	// MEMBERSHIP is overridable, IDENTITY is not: a link's from/to and a node's x/y/verts are
	// Base-owned and never override (a node cannot be in two places at once in one rendered map),
	// and so are id and type. Junction `elev` is survey data, not a design variable.
	// `active` is an ordinary boolean here and is how topology varies: a proposed loop lives in Base
	// inactive and a scenario overrides it active. Nothing sets `active` yet -- effective() treats
	// its absence as true.
	// `status` is this file's existing name for the open/closed state (Task 146.07 will surface it);
	// `length` is the escape valve for "same drawing, different length", since a drag recomputes
	// Base's auto length for every scenario.
	var LPN_OVERRIDABLE = {
		node: { demand: true, emitter: true, head: true, active: true },
		link: { diameter: true, roughness: true, k: true, status: true, length: true, active: true }
	};

	// The one resolver seam. Solver, renderer, labels and popups read element properties through
	// this, so that adding scenarios later changes only what this function finds -- not its callers.
	// Every lookup falls through to the element today, because Base's overrides are empty.
	// `prop` is always the PLAIN public name (the override map's documented shape, Task 184); the
	// element itself stores the same property underscored (`el._diameter`, Task 184/146.08 step 2) so
	// that a call site that forgets to route through effective() reads undefined immediately, rather
	// than silently working today and breaking invisibly once a second scenario exists.
	function effective(el, prop) {
		if (!el) { return undefined; }
		var ov = activeScenario().overrides[el.id];
		if (ov && Object.prototype.hasOwnProperty.call(ov, prop)) { return ov[prop]; }
		// `active` has no stored property yet (nothing sets it) -- its absence must read as true, not
		// undefined/falsy, so a topology no scenario has touched is never mistaken for inactive. This
		// is the one property effective() defaults itself, per the trap note in Task 146.08 step 2.
		if (prop === 'active' && el['_' + prop] === undefined) { return true; }
		return el['_' + prop];
	}
	// The write side (setOverride/clearOverride) and the status-bar override count deliberately do
	// NOT exist yet: with Base the only scenario there is nothing they could do but write into a map
	// that must stay empty, and an untestable write path is how a marker convention drifts before it
	// ever runs. They land with the scenario UI, against LPN_OVERRIDABLE above.

	// Map label toggles (Task 146 Phase 2) -- a VIEW preference, not network content, so it is
	// deliberately NOT part of the undo-snapshotted `doc` and is untouched by clearNetwork()/undo().
	// Defaults reproduce exactly what Phase 1 already showed (node ID+pressure, nothing on links),
	// so shipping this is a visual no-op until a user opts in.
	function defaultLabelSettings() {
		// Node defaults ID/Demand/Pressure/Elevation, link defaults ID/Flow/Velocity (Tom, 2026-07-30,
		// after using the Labels panel for the first time) -- the previous defaults (node: ID+Pressure
		// only; link: nothing) reproduced the original hardcoded pre-panel behavior, but that was never
		// a considered choice about what's actually useful to see on first load.
		return {
			node: { id: true, elev: true, demand: true, head: false, pressure: true },
			// Every INPUT property a link carries is offered, not just the ones a result depends on
			// (Tom, 2026-07-30: "add all input properties to the Labels choices") -- roughness and
			// the minor-loss coefficient are typed per pipe and are exactly the numbers you want to
			// see spread across a drawing when checking someone's model. Off by default, like the
			// other inputs: turning every one on by default would bury the results.
			link: { id: true, diameter: false, length: false, roughness: false, km: false, flow: true, velocity: true, headloss: false, gradient: false },
			// Per-field decimal places (ROADMAP Task 189, Tom 2026-07-30). Kept in a PARALLEL map
			// rather than turning each field's boolean into an object: the boolean maps are read on
			// every label rebuild and merged key-by-key out of localStorage, and a shape change there
			// would silently reinterpret every already-saved network's toggles. 2 everywhere is the
			// single hardcoded value this replaces, so shipping it is a visual no-op. Non-numeric
			// fields (ID) have no entry -- there is nothing to round.
			// Three fields depart from 2 (Tom, 2026-07-30), each for a reason about the QUANTITY, not
			// about taste:
			//   roughness 0 -- this page is Hazen-Williams only (assembleModel() hardcodes method:'hw'),
			//     and a C-factor is a dimensionless integer by convention: 100, 130, 140. Nobody writes
			//     C = 130.00. REVISIT IF A FRICTION-METHOD SELECTOR IS EVER ADDED: Darcy-Weisbach's
			//     roughness is a HEIGHT (0.00015 m), which prints as "0" at 0 decimals. See
			//     renderLinkFields()'s own note about the same pending change.
			//   diameter 0 -- inches and millimetres are both whole-number standards in this trade
			//     (6 in, 150 mm); a fractional diameter is the exception, and the user can raise it.
			//   gradient 4 -- the only field whose unit family offers two forms differing by 100x
			//     (gradePercent and plain rise/run). 2 decimals is fine as a percent and useless as a
			//     ratio, where a typical pipe gradient is 0.0043; 4 covers both.
			decimals: {
				node: { demand: 2, head: 2, pressure: 2, elev: 2 },
				link: { diameter: 0, length: 2, roughness: 0, km: 2, flow: 2, velocity: 2, headloss: 2, gradient: 4 }
			},
			// Whether a label's network-wide highest/lowest value gets its tick mark (Task 190).
			// Global, not per field: the mark answers one network-wide question per field, and Tom
			// described it as a single toggle. Lives here with its siblings and NOT in `settings`
			// because a label mark is a property of a label -- and, like the rest of labelSettings,
			// is a view preference deliberately kept out of the undo-snapshotted `doc`.
			markExtrema: true
		};
	}
	var labelSettings = defaultLabelSettings();

	// Gear/settings panel (Task 146 Phase 2, 2026-07-30) -- like labelSettings, a VIEW/preference
	// object, not network content: persisted to localStorage as a sibling key, deliberately NOT part
	// of the undo-snapshotted `doc`, and untouched by clearNetwork() ("New" clears the network, not
	// your preferences). Every default below reproduces EXACTLY the fixed behavior that shipped
	// before this panel existed, so adding it is a visual/behavioral no-op until a user opens it.
	function defaultSettings() {
		return {
			// Keyed by the same structural letters nextId already uses (J/R/L/P/T) -- changing a
			// prefix only affects IDs generated AFTER the change; existing element IDs are never
			// live-renamed by a settings edit.
			idPrefixes: { J: 'J', R: 'R', L: 'L', P: 'P', T: 'T' },
			// Matches js/lpn-solver.js's own default -- see assembleModel(). No UI edits this since
			// 2026-07-30: nothing can create an emitter yet, so the control was a no-op (ROADMAP
			// Task 191, and the longer note in rebuildSettingsFields()).
			emitterExponent: 0.5,
			tolerance: 1e-9, // matches js/lpn-solver.js's own default relative-flow-change tol -- see runSolve()
			// Default input values for NEWLY created elements (Tom, 2026-07-30). Generalizes what
			// used to be a lone `kmDefault`: the workflow Tom described is "mostly 8-inch, 0 demand,
			// 150 roughness, K=2, elevation 826" decided BEFORE drawing, and then switched mid-draw
			// ("OK, now all the 8 inch pipes") -- so these are a mode the user re-enters, not a
			// one-time setup. Same "future, not retroactive" rule as idPrefixes: changing one never
			// touches an element that already exists.
			// Values are null here and seeded by seedDefaultInputs() at init() instead of being
			// written literally, because the unit-set-dependent ones go through niceDefault(), which
			// reads the units strip out of the DOM -- and `var settings = defaultSettings()` below
			// runs at module scope, before DOMContentLoaded, where every lookup would silently fall
			// back to SI. Seeding after the DOM exists is what makes a US visitor's diameter default
			// read 4 in rather than 0.1 m.
			// NO reservoir head default, deliberately: reservoirHead() treats a blank head as "same
			// as the elevation" and keeps the two linked as the reservoir moves. Writing this same
			// number into head would look identical on screen while silently severing that link.
			// nodeElev covers junctions AND reservoirs (Tom, 2026-07-30). Note this drops the old
			// asymmetry where a new reservoir sat 100 ft above a new junction: a from-scratch
			// reservoir now has no head until the user gives it one, which is the same "squash the
			// secrets" call already made for the pump curve in addLink() -- no invisible driving
			// head the user never entered. Change this one number if that trade reads wrong.
			defaults: { nodeElev: null, demand: null, diameter: null, roughness: null, k: null },
			// Open/closed state of the settings panel's collapsible sections, persisted so a user
			// who lives in Default inputs is not re-opening it every session. Default inputs starts
			// OPEN because it is the mode-switching section above; the other two are set-once.
			sectionsOpen: { idPrefixes: false, defaults: true, mapDisplay: false },
			textSize: 2.5, // world units -- the original fixed LABEL_FONT_SIZE constant's value
			symbolScale: 1, // symbol size relative to text size -- see symbolFactor() above
			symbolOpacity: 1, // 0-1, applied to symbols only (never labels) -- see refreshSymbolSizes()
			backdropOpacity: 1, // 0-1, applied to the backdrop image -- the other half of the same control
			textSizeUnits: 'map', // 'map' | 'screen' -- see effectiveFontSize() above
			legendPosition: 'top-right', // one of LEGEND_POSITIONS' keys below -- matches the original hardcoded CSS
			mapHeight: 500 // px -- the original fixed <svg height="500"> value; see applyMapHeight()
		};
	}
	var settings = defaultSettings();
	// Fills any null in settings.defaults with its real starting value. Called from init() (after
	// the units strip exists, so niceDefault() can see it) and again after Restore defaults. Only
	// nulls are touched, so it doubles as the forward-migration for a save written before a given
	// default existed -- the merge in loadFromStorage() leaves such a key null and this fills it.
	function seedDefaultInputs() {
		var d = settings.defaults;
		function fill(key, value) { if (d[key] === null || d[key] === undefined) { d[key] = value; } }
		fill('nodeElev', 0);
		fill('demand', 0);
		fill('diameter', niceDefault('lpn_u_diameter', 'in', 4, 0.1));
		fill('roughness', 100);
		fill('k', 2);
	}

	// User-supplied backdrop image (Task 146 Phase 2), ported from dev/lpn-spike/canvas-spike.html
	// (see phase0-acceptance.md rounds 4/5/8-10 for the validated interaction design). Deliberately
	// NOT part of `doc`/the undo-snapshotted document: saveUndoSnapshot() deep-clones doc via
	// JSON.parse(JSON.stringify(doc)) on every discrete mutation, keeping up to 20 snapshots -- a
	// multi-hundred-KB-to-multi-MB embedded data URI in there would multiply badly. Still persisted
	// to localStorage as a sibling key (see saveToStorage()/loadFromStorage() below), just not
	// undo-tracked.
	var backdrop = null; // { href, iw, ih, x, y, width, height, tx, ty, s } | null

	// One color per data field, matching js/branched-network.js's EngCalcs.bpnFieldColors
	// convention (Tom, 2026-07-30): a colored number on the map, a colored span in the checkbox
	// label as the only legend -- no unit suffix, no field-name prefix cluttering the map itself.
	// Reused verbatim where the concept overlaps bpn's palette (id/length/diameter/flow/elevation/
	// pressure); demand/head/velocity/headloss are new colors, chosen to stay visually distinct
	// from every other entry here.
	// demand and flow share one color (Tom, 2026-07-30): both are a flow rate, Q -- a node's demand
	// IS the flow leaving the network at that point, so the legend should read them as the same
	// quantity, not as two unrelated fields that happen to both be numbers.
	// There is no separate head-GAIN field or color (Tom, 2026-07-30: "I don't think we need a
	// separate Head Gain. Negative head loss is fine."): a pump's contribution is reported as a
	// negative head loss, under the same label, color, and extrema bucket as every other link.
	var lpnFieldColors = {
		id: '#000', elev: '#8b5a2b', demand: '#1565c0', head: '#00838f', pressure: '#455a64',
		diameter: '#bf4b2b', length: '#2e7d32', roughness: '#00695c', km: '#827717',
		flow: '#1565c0', velocity: '#ad1457', headloss: '#4527a0', gradient: '#8e24aa'
	};

	function el(tag, attrs, parent) {
		var e = document.createElementNS(NS, tag), k;
		for (k in attrs) { if (attrs.hasOwnProperty(k)) { e.setAttribute(k, attrs[k]); } }
		if (parent) { parent.appendChild(e); }
		return e;
	}
	function setTransform() {
		world.setAttribute('transform', 'translate(' + state.tx + ',' + state.ty + ') scale(' + state.s + ')');
	}
	function screenToWorld(sx, sy) {
		var r = svg.getBoundingClientRect();
		return { x: (sx - r.left - state.tx) / state.s, y: (sy - r.top - state.ty) / state.s };
	}
	function nodeById(id) {
		var i;
		for (i = 0; i < doc.nodes.length; i++) { if (doc.nodes[i].id === id) { return doc.nodes[i]; } }
		return null;
	}
	// Snap-on-create (scope doc): "a click within N screen pixels of an existing node reuses it
	// rather than creating a new one." The scope doc names this as the real fix for diagnostic #2
	// ("a pipe drawn near a junction but not snapped to it" -- the dominant map-editor user error),
	// so it belongs on node-hit-testing itself, not on Text labels. N is in SCREEN pixels, not world
	// units, so the tap target stays a constant physical size regardless of zoom level -- a tight
	// world-unit tolerance at 10% zoom would be visually huge, and a loose one at 500% zoom would
	// be invisible.
	var NODE_SNAP_PX = 14;
	function nearestNodeNearScreen(clientX, clientY, pxTolerance) {
		var w = screenToWorld(clientX, clientY), best = null, bestPx = pxTolerance, i, n, dPx;
		for (i = 0; i < doc.nodes.length; i++) {
			n = doc.nodes[i];
			dPx = Math.hypot(n.x - w.x, n.y - w.y) * state.s;
			if (dPx <= bestPx) { best = n; bestPx = dPx; }
		}
		return best;
	}
	// A reservoir's effective fixed head: whatever the user typed, or -- when that field is blank --
	// its own elevation (Tom, 2026-07-30). Blank is stored as undefined rather than as a copy of the
	// elevation, so the two stay linked: moving the reservoir's elevation moves its water surface
	// with it until the user takes control by typing a head. Every consumer (the solver model, the
	// map labels, the popup) goes through this one function so "blank means elevation" is stated
	// once instead of being re-derived at each call site.
	function reservoirHead(n) {
		var h = effective(n, 'head');
		return (h === undefined || h === null || h === '') ? (n.elev || 0) : h;
	}
	function linkById(id) {
		var i;
		for (i = 0; i < doc.links.length; i++) { if (doc.links[i].id === id) { return doc.links[i]; } }
		return null;
	}
	// Pump curve support (Task 146, 2026-07-30). A pump's curvePoints are 1-3 [Q,H] pairs in SI;
	// curveRef, if set, names another pump link to copy points from (one hop only -- resolveCurvePoints
	// never chases a chain, so a ref-to-a-ref can't create a cycle). recomputePumpCurve() re-fits
	// h0/a/b (what js/lpn-solver.js actually reads) from whichever points are in effect.
	function resolveCurvePoints(l) {
		var base = l;
		if (l.curveRef) { var ref = linkById(l.curveRef); if (ref && ref.type === 'pump') { base = ref; } }
		return (base.curvePoints || []).filter(function (p) { return p && p[0] !== undefined && p[1] !== undefined; });
	}
	function recomputePumpCurve(l) {
		var pts = resolveCurvePoints(l);
		if (pts.length === 0) {
			// No curve entered yet: h0 = a = 0, so H = h0 - a Q^b is identically zero and the pump
			// is simply a connection that neither adds nor loses head. The solver has its own
			// gradient floor for this (see the pump branch of lpnAssemble), so a curveless pump
			// behaves like a very short, very smooth pipe rather than dividing by zero.
			l.h0 = 0; l.a = 0; l.b = 2;
			return;
		}
		var curve = EngCalcs.lpnPumpFromCurve(pts);
		l.h0 = curve.h0; l.a = curve.a; l.b = curve.b;
	}
	// Editing one pump's points can change what OTHER pumps compute too (any referencing it via
	// curveRef), so every curve edit recomputes the whole set rather than just the one link --
	// cheap at this suite's target scale (~10-20 nodes, ROADMAP Task 146's own sizing decision).
	function recomputeAllPumpCurves() {
		doc.links.forEach(function (l) { if (l.type === 'pump') { recomputePumpCurve(l); } });
	}
	function linkPoints(l) {
		var a = nodeById(l.from), b = nodeById(l.to), pts = [a].concat(l.verts, [b]), i, out = [];
		for (i = 0; i < pts.length; i++) { out.push(pts[i].x + ',' + pts[i].y); }
		return out.join(' ');
	}
	// Schematic polyline distance in map/world units -- NOT a real ground length (that needs
	// the backdrop registration's scale, which is Phase 2). Good enough as the "auto" default
	// the CLAUDE.md/scope-doc "len is stored and overridable, never derived" rule calls for:
	// a real number to start from rather than a blank field, with lenAuto tracking whether the
	// user has taken control (per the Auto Length design note in the scope doc).
	function linkGeomLength(l) {
		var a = nodeById(l.from), b = nodeById(l.to), pts = [a].concat(l.verts, [b]), i, sum = 0;
		for (i = 0; i < pts.length - 1; i++) { sum += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y); }
		return sum;
	}

	// ---- one-time DOM build per element + incremental per-frame updates ----
	// Same architecture as the spike (dev/lpn-spike/phase0-acceptance.md round 1): a full
	// teardown-and-rebuild on every drag frame was measured at 20-45fps; touching only the
	// elements incident to what moved keeps drag at the display's real refresh rate.
	var nodeEls = {}, linkEls = {}, labelEls = {}, incidentLinks = {}, labelsByAnchor = {};

	// Symbol size (Tom, 2026-07-30: "we need a symbol size and units setting too"). Deliberately
	// NOT a second size-and-units pair: symbols are sized RELATIVE TO THE TEXT, so they inherit the
	// text's map-vs-screen units for free and there is only one place to change how big everything
	// on the map is. settings.symbolScale is the "relative to text" multiplier on top of that, so
	// 1 reproduces exactly the fixed sizes that shipped before this setting existed.
	// A per-element breakdown (separate pipe width, node size, pump size, reservoir size) is the
	// obvious next step and is deliberately not built yet -- this is the two-dimensional control
	// Tom asked for, with the fine-grained one left for when someone actually needs it.
	function symbolFactor() {
		return textFactor() * (settings.symbolScale > 0 ? settings.symbolScale : 1);
	}
	function nodeRadius(n) { return (n.type === 'reservoir' ? 2.2 : 1.6) * symbolFactor(); }
	var VERTEX_HANDLE_R = 0.45;
	// Stroke widths (pipe, node outline, arrow, vertex handle, leader, rubber band) live in
	// css/engcalcs.css, so they read this one custom property rather than being set per element
	// from here -- see the .lpn-* rules there. Node/vertex radii and the arrow chevron are geometry
	// attributes, so those are re-applied in JS below.
	function refreshSymbolSizes() {
		var k = symbolFactor(), op = settings.symbolOpacity;
		svg.style.setProperty('--lpn-sym', k);
		// Symbols only, never labels or their masks (Tom, 2026-07-30: "symbols opacity would be a
		// very nice setting during layout") -- the point is to see the backdrop THROUGH the network
		// while placing it against an aerial or a plan, and fading the numbers at the same time
		// would defeat the reason you are looking at both together.
		svg.style.setProperty('--lpn-opacity', (op === undefined || op === null) ? 1 : op);
		// Backdrop fade, the other half of the same idea (Tom, 2026-07-30: "my backdrop is busy and
		// dark… I can't see my pipes and flow arrows"). Fading the REFERENCE material rather than
		// thickening the drawing is the standard move in every CAD and GIS tool (AutoCAD's image
		// fade, a QGIS layer's transparency) for exactly this situation, and unlike a heavier stroke
		// it changes nothing about the network itself -- so a drawing tuned against a busy aerial
		// still prints and reads correctly on white.
		var bop = settings.backdropOpacity;
		svg.style.setProperty('--lpn-backdrop-opacity', (bop === undefined || bop === null) ? 1 : bop);
		doc.nodes.forEach(function (n) {
			var ne = nodeEls[n.id]; if (ne) { ne.circle.setAttribute('r', nodeRadius(n)); }
		});
		doc.links.forEach(function (l) {
			var le = linkEls[l.id]; if (!le) { return; }
			le.handles.forEach(function (h) { h.setAttribute('r', VERTEX_HANDLE_R * k); });
			updateArrow(l.id);
		});
	}
	function buildNodeEls(n) {
		var circle = el('circle', {
			cx: n.x, cy: n.y, r: nodeRadius(n),
			'class': 'lpn-node lpn-node-' + n.type, 'data-node': n.id
		}, nodesLayer);
		// Mask (Task 146.01) goes in the shared maskLayer, not here alongside the circle -- see
		// maskLayer's declaration comment for why. Leader+text go in labelsLayer, the topmost
		// layer, same reasoning: this label must never be covered by a LATER node/link's own
		// symbol. Both mask and leader start effectively invisible (mask sized 0, leader hidden)
		// until layoutNodeLabel() below positions them for real.
		var mask = el('rect', { 'class': 'lpn-lbl-mask' }, maskLayer);
		var leader = el('line', { 'class': 'lpn-leader', style: 'display:none' }, labelsLayer);
		// font-size inline, NOT the .lpn-lbl CSS class's 11px: SVG font-size is interpreted in the
		// local (world-unit) coordinate system, same as any other geometry under this scaled <g> --
		// an "11-unit" font is enormous next to nodes spaced 10-40 units apart, which is what was
		// actually causing the zoom-extent overflow (not a missing bbox term -- the geometry itself
		// was oversized). Matches the spike's own convention. Same effectiveFontSize() as a user Text
		// label (Tom, 2026-07-30: no reason for these to differ) -- the two are still visually
		// distinguishable by position (node ID sits fixed at the node) and role, not by size.
		// lpn-draglbl (Task 146.01): draggable off its default offset, same pointer-events:all/
		// cursor:move convention as a Text label -- data-nodelbl (not data-node, already claimed by
		// the circle above) is this label's own drag/hit-test key.
		var text = el('text', {
			'class': 'lpn-lbl lpn-draglbl', 'data-nodelbl': n.id, style: 'font-size:' + effectiveFontSize() + 'px'
		}, labelsLayer);
		text.textContent = n.id;
		var tw = 8;
		try { tw = text.getBBox().width; } catch (err) { /* pre-layout measurement can throw; fallback stands */ }
		nodeEls[n.id] = { circle: circle, text: text, tw: tw, mask: mask, leader: leader, nudge: { x: 0, y: 0 }, lineCount: 1 };
		incidentLinks[n.id] = [];
		labelsByAnchor[n.id] = [];
		layoutNodeLabel(n.id);
	}
	function buildLinkEls(l) {
		var line = el('polyline', {
			points: linkPoints(l), fill: 'none',
			'class': 'lpn-link lpn-link-' + l.type, 'data-link': l.id
		}, linksLayer);
		var handles = [], i;
		for (i = 0; i < l.verts.length; i++) {
			handles.push(el('circle', {
				cx: l.verts[i].x, cy: l.verts[i].y, r: VERTEX_HANDLE_R * symbolFactor(),
				'class': 'lpn-vhandle', 'data-link': l.id, 'data-vidx': i
			}, linksLayer));
		}
		// Flow-direction arrows (Tom, 2026-07-30, matching EPANET): an open chevron ">" per
		// POLYLINE SEGMENT, not just one at the overall midpoint (Tom asked for this once the
		// single-arrow version looked good) -- a bent pipe gets one arrow on each straight run.
		// Not a filled triangle -- that read as absorbed into the pipe's own color. Hidden until
		// a solve result exists. Points +x by default, protruding to +-1.2 world units above/
		// below the line -- well past the pipe's own 0.5-unit stroke width. Positioned/rotated
		// entirely via `transform` in updateArrow() below, never via its own x/y/points.
		var segCount = l.verts.length + 1, arrows = [], j;
		for (j = 0; j < segCount; j++) {
			arrows.push(el('polyline', {
				points: '-0.8,-1.2 0.8,0 -0.8,1.2', fill: 'none',
				'class': 'lpn-arrow', 'data-link': l.id, style: 'display:none'
			}, linksLayer));
		}
		// Link label (Task 146 Phase 2 label toggles): a multi-line <text>, same convention as a
		// node's, positioned at the middle segment's midpoint -- content filled in by
		// refreshLabelText(), not here (this only creates the element; it starts empty). Mask goes
		// in maskLayer, leader+text in labelsLayer -- see maskLayer's declaration comment.
		var mask = el('rect', { 'class': 'lpn-lbl-mask' }, maskLayer);
		var leader = el('line', { 'class': 'lpn-leader', style: 'display:none' }, labelsLayer);
		var text = el('text', {
			'class': 'lpn-lbl lpn-draglbl', 'data-linklbl': l.id, style: 'font-size:' + effectiveFontSize() + 'px'
		}, labelsLayer);
		linkEls[l.id] = { line: line, handles: handles, arrows: arrows, text: text, tw: 8, mask: mask, leader: leader, nudge: { x: 0, y: 0 }, lineCount: 1 };
		layoutLinkLabel(l.id);
	}
	// Midpoint and local tangent angle of every segment, walking a->verts->b -- one entry per
	// straight run, so a bent pipe's arrows follow each segment's own direction.
	function segmentMidpoints(l) {
		var pts = [nodeById(l.from)].concat(l.verts, [nodeById(l.to)]), out = [], i, a, b,
			k = symbolFactor(), vr = VERTEX_HANDLE_R * k, len, ia, ib, clearLen, ux, uy;
		for (i = 0; i < pts.length - 1; i++) {
			a = pts[i]; b = pts[i + 1];
			len = Math.hypot(b.x - a.x, b.y - a.y);
			// CLEAR RUN (Tom, 2026-07-30: "exclude the two endpoint node or vertex radii"). Each
			// segment's usable span starts at the EDGE of whatever symbol sits at its ends, not at
			// that symbol's center: a node circle (radius by type -- a reservoir is visibly larger
			// than a junction) at the two outer ends, a vertex handle at every interior joint. The
			// centerline is what the geometry is made of; the clear run is what the eye actually
			// reads as pipe, and it is what an arrow should be centered in and measured against.
			// Asymmetric on purpose: a pipe from a reservoir to a junction has a bigger bite taken
			// out of its reservoir end, so splitting one combined inset evenly would be wrong.
			ia = (i === 0) ? nodeRadius(pts[0]) : vr;
			ib = (i === pts.length - 2) ? nodeRadius(pts[pts.length - 1]) : vr;
			clearLen = len - ia - ib;
			// A segment shorter than the symbols on its ends has no clear run at all. Reported as 0
			// rather than a negative, so the "does an arrow fit" test below reads as a plain length
			// comparison and the inset endpoints stay inside the segment instead of crossing over.
			if (!(clearLen > 0)) { clearLen = 0; ia = len / 2; }
			ux = len > 0 ? (b.x - a.x) / len : 0;
			uy = len > 0 ? (b.y - a.y) / len : 0;
			out.push({
				x: (a.x + b.x) / 2, y: (a.y + b.y) / 2,
				angle: Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI,
				len: len,
				ax: a.x, ay: a.y, bx: b.x, by: b.y,
				// The clear run's own endpoints and length. `insetA` is also the distance from the
				// segment's start to the clear run's start, which arrowAlongDistances() needs to
				// convert a position within the clear run back into a distance along the full
				// centerline -- the space pointAlongLink() and the label logic measure in.
				insetA: ia, clearLen: clearLen,
				sx: a.x + ux * ia, sy: a.y + uy * ia,
				ex: a.x + ux * (ia + clearLen), ey: a.y + uy * (ia + clearLen)
			});
		}
		return out;
	}
	// Where the flow arrow sits along its segment, as a fraction measured FROM THE UPSTREAM END
	// (Tom, 2026-07-30: "flow arrows are colliding with pipe labels… maybe arrow at 30% from low
	// head and label at 50%?"). The label is anchored at the segment midpoint, so anything other
	// than 0.5 separates them; 0.3 from upstream also makes the arrow's position itself carry the
	// flow direction, redundantly with the chevron, which helps at small sizes.
	var ARROW_ALONG = 0.3;
	// Nominal chevron length along the pipe: the polyline spans -0.8..0.8 in its own coordinates
	// before symbolFactor() scales it.
	var ARROW_NOMINAL_LEN = 1.6;
	// Along-the-whole-pipe distance of every arrow that is actually DRAWN on this link -- the same
	// two rules updateArrow() applies (skip a segment too short to hold an arrow; measure
	// ARROW_ALONG from the upstream end), expressed as one distance per arrow so linkLabelMid() can
	// keep the label clear of them. Returns [] before the first solve, when no arrow is shown.
	function arrowAlongDistances(l) {
		var mids = segmentMidpoints(l), flow = lastSolveResult ? lastSolveResult.flows[l.id] : undefined,
			k = symbolFactor(), minLen = ARROW_NOMINAL_LEN * k * 2, out = [], run = 0, i, t;
		if (flow === undefined) { return out; }
		for (i = 0; i < mids.length; i++) {
			// Measured within the CLEAR RUN, then shifted back into whole-centerline distance by
			// insetA -- `run` still accumulates full segment lengths because that is the space
			// pointAlongLink()/linkLabelMid() compare against. Must stay in step with updateArrow()
			// below: these two compute the same arrow position for different consumers, and a
			// divergence would let the label dodge a phantom.
			if (mids[i].clearLen >= minLen) {
				t = flow < 0 ? 1 - ARROW_ALONG : ARROW_ALONG;
				out.push(run + mids[i].insetA + mids[i].clearLen * t);
			}
			run += mids[i].len;
		}
		return out;
	}
	// Direction only makes sense once flows are known -- hidden until lastSolveResult exists,
	// then rotated 180 degrees from the link's own from->to direction when Q is negative (flow
	// actually runs to->from; the same sign applies to every segment of one link, since it's a
	// single pipe/pump, not a per-segment flow). Called both on geometry changes (drag) and
	// after every solve.
	function updateArrow(id) {
		var le = linkEls[id]; if (!le || !le.arrows) { return; }
		var mids = segmentMidpoints(linkById(id)), flow = lastSolveResult ? lastSolveResult.flows[id] : undefined,
			k = symbolFactor(), minLen = ARROW_NOMINAL_LEN * k * 2, i;
		for (i = 0; i < le.arrows.length; i++) {
			if (!mids[i] || flow === undefined) { le.arrows[i].style.display = 'none'; continue; }
			// A segment with no room for the arrow shows none (Tom, 2026-07-30: "toggle off flow
			// arrows if they don't fit between vertices") -- a chevron longer than the run it sits
			// on overhangs both vertices and reads as a mark on the network rather than on that
			// pipe. Twice the chevron's own length is the shortest run that still leaves visible
			// pipe on each side of it. Measured against the CLEAR run, not the centerline, so a
			// short pipe between two big symbols now correctly shows nothing instead of an arrow
			// buried under a reservoir.
			if (mids[i].clearLen < minLen) { le.arrows[i].style.display = 'none'; continue; }
			var angle = mids[i].angle + (flow < 0 ? 180 : 0);
			// ARROW_ALONG measured from the UPSTREAM end, WITHIN THE CLEAR RUN (sx,sy -> ex,ey): at
			// positive flow that is the run's own start, at negative flow its end. Interpolating the
			// raw centerline instead put the 30% mark inside the upstream symbol on short pipes --
			// worst exactly where space is tightest.
			var t = flow < 0 ? 1 - ARROW_ALONG : ARROW_ALONG,
				px = mids[i].sx + (mids[i].ex - mids[i].sx) * t,
				py = mids[i].sy + (mids[i].ey - mids[i].sy) * t;
			// scale() last, so the chevron's own -0.8..0.8 geometry grows about its anchor point
			// rather than the rotation being applied to an already-offset shape.
			le.arrows[i].setAttribute('transform', 'translate(' + px + ',' + py +
				') rotate(' + angle + ') scale(' + k + ')');
			le.arrows[i].style.display = '';
		}
	}
	function buildLabelEls(lb) {
		var an = lb.anchorNode ? nodeById(lb.anchorNode) : { x: lb.x, y: lb.y },
			px = lb.anchorNode ? an.x + lb.x : lb.x,
			py = lb.anchorNode ? an.y + lb.y : lb.y,
			leader = null, text, mask;
		if (lb.anchorNode) {
			leader = el('line', { x1: an.x, y1: an.y, x2: px, y2: py, 'class': 'lpn-leader' }, labelsLayer);
		}
		// Mask (Task 146.01) goes in the shared maskLayer, not labelsLayer -- see maskLayer's
		// declaration comment: every mask stays below every label's text regardless of type or
		// creation order.
		mask = el('rect', { 'class': 'lpn-lbl-mask' }, maskLayer);
		text = el('text', {
			x: px, y: py, 'class': 'lpn-lbl lpn-draglbl', 'text-anchor': 'middle',
			'dominant-baseline': 'central', 'data-lbl': lb.id, style: 'font-size:' + effectiveFontSize(lb.sizeMult) + 'px'
		}, labelsLayer);
		text.textContent = lb.text;
		var w = 10;
		try { w = text.getBBox().width; } catch (err) { /* pre-layout measurement can throw; fallback stands */ }
		labelEls[lb.id] = { leader: leader, text: text, side: 'right', width: w, mask: mask };
		positionMaskRect(mask, px, py, w, effectiveFontSize(lb.sizeMult) * 1.2, 'middle', 'middle');
		if (lb.anchorNode) { labelsByAnchor[lb.anchorNode].push(lb.id); }
	}

	function buildDom() {
		var i;
		linksLayer.innerHTML = ''; nodesLayer.innerHTML = ''; maskLayer.innerHTML = ''; labelsLayer.innerHTML = '';
		nodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};
		for (i = 0; i < doc.nodes.length; i++) { buildNodeEls(doc.nodes[i]); }
		for (i = 0; i < doc.links.length; i++) {
			incidentLinks[doc.links[i].from].push(doc.links[i].id);
			incidentLinks[doc.links[i].to].push(doc.links[i].id);
			buildLinkEls(doc.links[i]);
		}
		for (i = 0; i < doc.labels.length; i++) {
			buildLabelEls(doc.labels[i]);
			updateLabelGeometry(doc.labels[i].id);
		}
		refreshLabelText();
	}
	function updateLinkGeometry(id) {
		var l = linkById(id), le = linkEls[id];
		le.line.setAttribute('points', linkPoints(l));
		layoutLinkLabel(id);
		if (l.lenAuto) { l._length = linkGeomLength(l); }
		updateArrow(id);
	}

	// Same leader math as the spike: text is always text-anchor:middle and tracks the drag
	// point continuously (never jumps); only the leader's attachment edge flips, at 75% of
	// the label's own width past the anchor's vertical line (Tom: 50-100% acceptable, 0% =
	// near edge at the line, 100% = far edge at the line -- flipping later means the leader
	// has to reach clear across the text).
	var ADVERSE_FRAC = 0.75;
	function updateLabelGeometry(id) {
		var lb = labelById(id), le = labelEls[id], an, px, py, halfW, trigger, leaderX,
			maskH = effectiveFontSize(lb.sizeMult) * 1.2;
		if (!lb.anchorNode) {
			le.text.setAttribute('x', lb.x); le.text.setAttribute('y', lb.y);
			positionMaskRect(le.mask, lb.x, lb.y, le.width, maskH, 'middle', 'middle');
			return;
		}
		an = nodeById(lb.anchorNode); px = an.x + lb.x; py = an.y + lb.y; halfW = le.width / 2;
		trigger = halfW * (1 - 2 * ADVERSE_FRAC);
		if (le.side === 'right' && lb.x < trigger) { le.side = 'left'; }
		else if (le.side === 'left' && lb.x > -trigger) { le.side = 'right'; }
		leaderX = le.side === 'right' ? px - halfW : px + halfW;
		le.leader.setAttribute('x1', an.x); le.leader.setAttribute('y1', an.y);
		le.leader.setAttribute('x2', leaderX); le.leader.setAttribute('y2', py);
		le.text.setAttribute('x', px); le.text.setAttribute('y', py);
		positionMaskRect(le.mask, px, py, le.width, maskH, 'middle', 'middle');
	}
	// Double-click-to-reset for a Text label (Tom, 2026-07-30) -- only meaningful when anchored: an
	// anchored Text's lb.x/lb.y is an offset from its node, same convention as a node/link label's,
	// so "home" is the same DEFAULT_LABEL_OFFSET they use. A free-floating Text (no anchorNode) has
	// no anchor to offset from -- lb.x/lb.y already ARE its absolute position, so there is no
	// "default" to reset to, and this is a no-op.
	function resetTextLabelHome(id) {
		var lb = labelById(id);
		if (!lb || !lb.anchorNode) { return; }
		var home = defaultLabelOffset();
		if (lb.x === home.x && lb.y === home.y) { return; }
		saveUndoSnapshot();
		lb.x = home.x; lb.y = home.y;
		labelEls[id].side = 'right';
		updateLabelGeometry(id);
		scheduleSolve();
	}
	function labelById(id) {
		var i;
		for (i = 0; i < doc.labels.length; i++) { if (doc.labels[i].id === id) { return doc.labels[i]; } }
		return null;
	}
	// A node/link data label's visible glyphs live in <tspan> children (setMultilineText()) -- a
	// hit-test (e.target on pointerdown, or elementFromPoint() on click/tap) lands on the tspan
	// itself, which carries none of its parent <text>'s data-nodelbl/data-linklbl/data-lbl
	// attributes. Both hit-test paths below resolve a tspan hit up to its label <text> first, so
	// drag/click detection sees the same element regardless of which pixel of the label was hit.
	function resolveLabelHit(t) {
		return (t && t.nodeName && t.nodeName.toLowerCase() === 'tspan' && t.parentNode) ? t.parentNode : t;
	}
	function updateNode(id) {
		var n = nodeById(id), ne = nodeEls[id], i;
		ne.circle.setAttribute('cx', n.x); ne.circle.setAttribute('cy', n.y);
		layoutNodeLabel(id);
		for (i = 0; i < incidentLinks[id].length; i++) { updateLinkGeometry(incidentLinks[id][i]); }
		for (i = 0; i < labelsByAnchor[id].length; i++) { updateLabelGeometry(labelsByAnchor[id][i]); }
		scheduleSolve();
	}
	function updateVertex(linkId, vidx) {
		var l = linkById(linkId), v = l.verts[vidx], h = linkEls[linkId].handles[vidx];
		h.setAttribute('cx', v.x); h.setAttribute('cy', v.y);
		updateLinkGeometry(linkId);
		scheduleSolve();
	}
	function distToSegment(p, a, b) {
		var dx = b.x - a.x, dy = b.y - a.y, len2 = dx * dx + dy * dy,
			t = len2 ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2 : 0;
		t = Math.max(0, Math.min(1, t));
		return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
	}
	function rebuildLink(l) {
		linkEls[l.id].line.remove();
		linkEls[l.id].handles.forEach(function (h) { h.remove(); });
		linkEls[l.id].arrows.forEach(function (a) { a.remove(); });
		linkEls[l.id].text.remove();
		linkEls[l.id].mask.remove();
		linkEls[l.id].leader.remove();
		// tick marks (applyExtremaTicks()) are separate elements, not text children -- buildLinkEls()
		// below replaces linkEls[l.id] wholesale, which would otherwise orphan them on screen.
		if (linkEls[l.id].tickEls) { linkEls[l.id].tickEls.forEach(function (t) { t.remove(); }); }
		buildLinkEls(l);
		refreshLabelText();
	}
	function insertVertex(linkId, pt) {
		var l = linkById(linkId), pts = [nodeById(l.from)].concat(l.verts, [nodeById(l.to)]),
			bestI = 0, bestD = Infinity, i, d;
		for (i = 0; i < pts.length - 1; i++) {
			d = distToSegment(pt, pts[i], pts[i + 1]);
			if (d < bestD) { bestD = d; bestI = i; }
		}
		l.verts.splice(bestI, 0, { x: pt.x, y: pt.y });
		rebuildLink(l);
	}
	function removeVertex(linkId, vidx) {
		var l = linkById(linkId);
		l.verts.splice(vidx, 1);
		rebuildLink(l);
	}

	// ---- zoom-extent: fits the actual rendered extent (symbol radius, label text box, link
	// vertices), not bare coordinates -- see phase0-acceptance.md round 5 for why bare
	// coordinates clip a symbol or crop a line of text at the edge.
	function bbox() {
		var minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity, i, j;
		function inc(x, y) {
			if (x < minx) { minx = x; } if (x > maxx) { maxx = x; }
			if (y < miny) { miny = y; } if (y > maxy) { maxy = y; }
		}
		if (doc.nodes.length === 0) { return { minx: 0, maxx: 10, miny: 0, maxy: 10 }; }
		for (i = 0; i < doc.nodes.length; i++) {
			var n = doc.nodes[i], r = nodeRadius(n) + 0.2, ne = nodeEls[n.id] || {},
				tw = ne.tw || 8, lc = ne.lineCount || 1,
				nlx = ne.text ? +ne.text.getAttribute('x') : n.x + 2, nly = ne.text ? +ne.text.getAttribute('y') : n.y - 2;
			inc(n.x - r, n.y - r); inc(n.x + r, n.y + r);
			// "J1"-style id/data label beside the circle -- extended downward per extra toggled-on
			// line (Task 146 Phase 2 label toggles), since multi-line labels grow toward +y (dy>0).
			// Read from the label's OWN rendered x/y (Task 146.01), not a hardcoded n.x+2/n.y-2--
			// a dragged-away or collision-nudged label can sit well outside that default offset.
			inc(nlx, nly - 2); inc(nlx + tw, nly + 0.6 + (lc - 1) * effectiveLineHeight());
		}
		for (i = 0; i < doc.labels.length; i++) {
			var lb = doc.labels[i], le = labelEls[lb.id] || { width: 10 },
				an = lb.anchorNode ? nodeById(lb.anchorNode) : { x: 0, y: 0 },
				px = lb.anchorNode ? an.x + lb.x : lb.x, py = lb.anchorNode ? an.y + lb.y : lb.y,
				halfW = le.width / 2;
			inc(px - halfW, py - 2); inc(px + halfW, py + 2);
		}
		for (i = 0; i < doc.links.length; i++) {
			for (j = 0; j < doc.links[i].verts.length; j++) {
				var v = doc.links[i].verts[j];
				inc(v.x - 0.65, v.y - 0.65); inc(v.x + 0.65, v.y + 0.65);
			}
			var l = doc.links[i], lle = linkEls[l.id];
			if (lle) {
				var lx = +lle.text.getAttribute('x'), ly = +lle.text.getAttribute('y'),
					ltw = lle.tw || 8, llc = lle.lineCount || 1;
				inc(lx, ly - 2); inc(lx + ltw, ly + 0.6 + (llc - 1) * effectiveLineHeight());
			}
		}
		return { minx: minx, maxx: maxx, miny: miny, maxy: maxy };
	}
	function zoomExtent() {
		var b = bbox(), r = svg.getBoundingClientRect(), pad = 16,
			w = Math.max(b.maxx - b.minx, 1), h = Math.max(b.maxy - b.miny, 1);
		state.s = Math.min((r.width - 2 * pad) / w, (r.height - 2 * pad) / h);
		state.tx = pad - b.minx * state.s + (r.width - 2 * pad - w * state.s) / 2;
		state.ty = pad - b.miny * state.s + (r.height - 2 * pad - h * state.s) / 2;
		setTransform();
		onZoomChanged();
	}

	// ---- backdrop image (Task 146 Phase 2, ported from dev/lpn-spike/canvas-spike.html) ----
	var backdropImg = null;
	function applyBackdropTransform() {
		if (!backdropImg) { return; }
		backdropImg.setAttribute('transform', 'translate(' + backdrop.tx + ',' + backdrop.ty + ') scale(' + backdrop.s + ')');
	}
	// Converts a world-space click back into the image's own pre-transform space, so a second Scale
	// pass measures true image-local distance rather than one already stretched by a previous scale
	// factor -- matches the spike's worldToImageLocal() verbatim.
	function worldToImageLocal(w) {
		return { x: (w.x - backdrop.tx) / backdrop.s, y: (w.y - backdrop.ty) / backdrop.s };
	}
	function buildBackdropImg() {
		backdropLayer.innerHTML = '';
		backdropImg = el('image', {
			href: backdrop.href, x: backdrop.x, y: backdrop.y, width: backdrop.width, height: backdrop.height
		}, backdropLayer);
		applyBackdropTransform();
	}
	function removeBackdrop() {
		backdrop = null; backdropImg = null;
		backdropLayer.innerHTML = '';
		saveToStorage();
		updateBackdropMenuState();
	}
	// Cap the longest side at 1600px before storing (scope doc: "a scanned plan can be large, so
	// downscale on import and record the original dimensions") -- nothing else in this feature bounds
	// the localStorage footprint of a phone photo or a large scanned plan. PNG output, not JPEG: a
	// scanned plan's thin lines are exactly what a lossy re-encode would blur; size is bounded by
	// this cap instead.
	var BACKDROP_MAX_SIDE = 1600;
	function downscaleImage(dataUrl, maxSide, cb) {
		var img = new Image();
		img.onload = function () {
			var scale = Math.min(1, maxSide / Math.max(img.width, img.height));
			if (scale === 1) { cb(dataUrl, img.width, img.height); return; }
			var canvas = document.createElement('canvas');
			canvas.width = Math.round(img.width * scale); canvas.height = Math.round(img.height * scale);
			canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
			cb(canvas.toDataURL('image/png'), img.width, img.height);
		};
		img.src = dataUrl;
	}
	// Initial placement size: the new image's longer side roughly matches the current network's own
	// bbox extent (a fixed default when the network is empty), aspect-ratio-preserved -- Scale/
	// Position are how the user then registers it precisely. An explicit open question in the Phase 0
	// acceptance doc ("no way to *position* a freshly loaded backdrop relative to a grid already on
	// screen... decide in Phase 2, not now") -- the spike's own arbitrary fixed 40x30 wasn't ported.
	function initialBackdropSize(iw, ih) {
		var b = bbox(), extent = Math.max(b.maxx - b.minx, b.maxy - b.miny, 1),
			target = doc.nodes.length > 0 ? extent : 40, longer = Math.max(iw, ih), scale = target / longer;
		return { width: iw * scale, height: ih * scale };
	}
	function addBackdropFromDataUrl(dataUrl) {
		downscaleImage(dataUrl, BACKDROP_MAX_SIDE, function (href, iw, ih) {
			var size = initialBackdropSize(iw, ih);
			backdrop = { href: href, iw: iw, ih: ih, x: 0, y: 0, width: size.width, height: size.height, tx: 0, ty: 0, s: 1 };
			buildBackdropImg();
			saveToStorage();
			updateBackdropMenuState();
		});
	}

	// ---- backdrop registration wizard (regMode gate, Scale, Position) ----
	// While a Scale/Position click sequence is pending, normal interaction (node drag, tap-to-open-
	// popup, vertex insert) is suppressed entirely -- otherwise a click meant for registration also
	// starts a node drag or opens a popup underneath it, since both listen on the same pointer
	// events. Ported verbatim from the spike, validated through 8 rounds of Tom's on-device
	// iteration (phase0-acceptance.md rounds 4/5/8-10), including the regmode-node cursor gate and
	// the periodic cursor-reassert workaround for a real Chrome cursor-caching quirk found there.
	var regMode = false;
	var cursorNudgeTimer = null;
	function nudgeCursor() {
		svg.classList.remove('regmode');
		void svg.getBoundingClientRect(); // forces a real reflow/style recalc, not just a class-membership change
		svg.classList.add('regmode');
	}
	function setRegMode(v) {
		regMode = v;
		if (v) {
			nudgeCursor();
			if (!cursorNudgeTimer) { cursorNudgeTimer = setInterval(nudgeCursor, 200); }
		} else {
			svg.classList.remove('regmode');
			if (cursorNudgeTimer) { clearInterval(cursorNudgeTimer); cursorNudgeTimer = null; }
		}
	}
	function setNodeCursorAllowed(v) { svg.classList.toggle('regmode-node', v); }
	// Single mutual-exclusion point: every sequence below registers a teardown function here, and
	// every entry point calls cancelActive() first, so re-picking the same action mid-sequence tears
	// down and restarts it, and picking a different action tears down whatever else was running.
	var activeCancel = null;
	function cancelActive() {
		if (activeCancel) { var c = activeCancel; activeCancel = null; c(); }
	}
	// Escape is the one dedicated "get me out" affordance -- without it, the only way to abandon a
	// Scale/Position sequence is to re-open the dropdown and pick something else, which isn't
	// discoverable as a cancel action, and regMode blanks all normal interaction in the meantime.
	document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { cancelActive(); } });

	function startBackdropScale() {
		cancelActive();
		var pc = EngCalcs.pageConfig || {}, clicks = [];
		setRegMode(true);
		alert(pc.lpn_backdrop_scale_prompt1 || 'Click two points on the background image, such as the two ends of a bar scale. Then type the real distance between them.');
		var handler = function (e) {
			clicks.push(worldToImageLocal(screenToWorld(e.clientX, e.clientY)));
			if (clicks.length === 2) {
				svg.removeEventListener('pointerup', handler, true);
				activeCancel = null; setRegMode(false);
				var pxDist = Math.hypot(clicks[1].x - clicks[0].x, clicks[1].y - clicks[0].y);
				var promptText = (pc.lpn_backdrop_scale_prompt2 || 'Real distance between the two points') + ' (' + unitLabel('lpn_u_length') + '):';
				var real = +prompt(promptText, '');
				if (real > 0) { backdrop.s = real / pxDist; applyBackdropTransform(); saveToStorage(); }
			}
		};
		svg.addEventListener('pointerup', handler, true);
		activeCancel = function () { svg.removeEventListener('pointerup', handler, true); setRegMode(false); };
	}
	function positionTo(refWorld, target) {
		backdrop.tx += target.x - refWorld.x; backdrop.ty += target.y - refWorld.y;
		applyBackdropTransform();
		saveToStorage();
	}
	// Per the spike's exact sequence: (a) click Backdrop > Position, (b) alert asking for a reference
	// point, (c) user clicks it, (d) alert announcing the target-mode step, (e) a floating panel
	// (mirroring #lpn_labels_popup's static-PHP-plus-JS-clamped-position pattern) offering
	// Node/Free point/Coords, (f) Continue. Each step registers its own activeCancel so an
	// interruption at any point tears down cleanly instead of leaving orphaned listeners or regMode
	// stuck on.
	function startBackdropPosition() {
		cancelActive();
		var pc = EngCalcs.pageConfig || {};
		setRegMode(true);
		alert(pc.lpn_backdrop_position_prompt1 || 'Click any point on the background image. This is the point you will move.');
		var handler = function (e) {
			svg.removeEventListener('pointerup', handler, true);
			var refWorld = screenToWorld(e.clientX, e.clientY);
			alert(pc.lpn_backdrop_position_prompt2 || 'Choose where that point should go, then click Continue.');
			showBackdropTargetPanel(refWorld);
		};
		svg.addEventListener('pointerup', handler, true);
		activeCancel = function () { svg.removeEventListener('pointerup', handler, true); setRegMode(false); };
	}
	function showBackdropTargetPanel(refWorld) {
		var panel = document.getElementById('lpn_backdrop_target_panel'),
			menu = document.getElementById('lpn_backdrop_menu'), r = menu.getBoundingClientRect();
		panel.style.left = r.left + 'px'; panel.style.top = (r.bottom + 4) + 'px'; panel.style.display = 'block';
		// Clamp into the viewport, same as openPopupAt()/toggleLabelsPopup() -- measured after
		// display:block since size is unknown while display:none.
		var pr = panel.getBoundingClientRect();
		panel.style.left = Math.max(4, Math.min(r.left, window.innerWidth - pr.width - 4)) + 'px';
		panel.style.top = Math.max(4, Math.min(r.bottom + 4, window.innerHeight - pr.height - 4)) + 'px';
		activeCancel = function () { panel.style.display = 'none'; setRegMode(false); };
		document.getElementById('lpn_backdrop_target_continue').onclick = function () {
			var mode = document.getElementById('lpn_backdrop_target_mode').value, pc = EngCalcs.pageConfig || {};
			panel.style.display = 'none';
			if (mode === 'coords') {
				activeCancel = null; setRegMode(false);
				var txt = prompt((pc.lpn_backdrop_coords_prompt || 'Type the X,Y that point should move to') + ' (' + unitLabel('lpn_u_length') + '):', '');
				var parts = (txt || '').split(',').map(Number);
				if (txt && !isNaN(parts[0]) && !isNaN(parts[1])) { positionTo(refWorld, { x: parts[0], y: parts[1] }); }
				return;
			}
			// No further blocking dialog here -- the panel + Continue already made the transition
			// clear enough (matching the spike).
			if (mode === 'node') { setNodeCursorAllowed(true); }
			var handler2 = function (e2) {
				if (mode === 'node') {
					var t = document.elementFromPoint(e2.clientX, e2.clientY);
					if (!t || !t.dataset || !t.dataset.node) { return; } // not a node -- keep waiting, don't fall back to a free point
					svg.removeEventListener('pointerup', handler2, true);
					activeCancel = null; setNodeCursorAllowed(false); setRegMode(false);
					positionTo(refWorld, nodeById(t.dataset.node));
				} else {
					svg.removeEventListener('pointerup', handler2, true);
					activeCancel = null; setRegMode(false);
					positionTo(refWorld, screenToWorld(e2.clientX, e2.clientY)); // 'free': the raw point, never snapped
				}
			};
			svg.addEventListener('pointerup', handler2, true);
			activeCancel = function () { svg.removeEventListener('pointerup', handler2, true); setNodeCursorAllowed(false); setRegMode(false); };
		};
	}
	// Menu-select build + Scale/Position/Remove enablement, wired from wireToolbar() below.
	var updateBackdropMenuStateFn = null;
	function updateBackdropMenuState() { if (updateBackdropMenuStateFn) { updateBackdropMenuStateFn(); } }
	function wireBackdropMenu(into) {
		var pc = EngCalcs.pageConfig || {}, menu = document.createElement('select');
		menu.id = 'lpn_backdrop_menu';
		function opt(value, text, disabled) {
			var o = document.createElement('option');
			o.value = value; o.textContent = text; if (disabled) { o.disabled = true; }
			menu.appendChild(o);
		}
		opt('', pc.lpn_backdrop_menu || 'Background image...');
		opt('add', pc.lpn_backdrop_add || 'Add image');
		opt('scale', pc.lpn_backdrop_scale || 'Scale', true);
		opt('position', pc.lpn_backdrop_position || 'Position', true);
		opt('remove', pc.lpn_backdrop_remove || 'Remove image', true);
		var fileInput = document.getElementById('lpn_backdrop_file');
		menu.addEventListener('change', function () {
			var v = menu.value; menu.value = '';
			if (v === 'add') { cancelActive(); fileInput.click(); }
			else if (v === 'scale') { startBackdropScale(); }
			else if (v === 'position') { startBackdropPosition(); }
			else if (v === 'remove') {
				if (window.confirm(pc.lpn_backdrop_remove_confirm || 'Remove the background image?')) { removeBackdrop(); }
			}
		});
		fileInput.addEventListener('change', function () {
			var f = fileInput.files[0]; fileInput.value = ''; if (!f) { return; }
			var reader = new FileReader();
			reader.onload = function (ev) { addBackdropFromDataUrl(ev.target.result); };
			reader.readAsDataURL(f);
		});
		updateBackdropMenuStateFn = function () {
			menu.options[2].disabled = !backdrop; menu.options[3].disabled = !backdrop; menu.options[4].disabled = !backdrop;
		};
		updateBackdropMenuStateFn();
		into.appendChild(menu);
	}

	// ---- pan / zoom / pinch / drag ----
	var MIN_SCALE = 0.05, MAX_SCALE = 500;
	var pointers = new Map();
	var drag = null;
	var dragDirty = false;
	function zoomAbout(sx, sy, factor) {
		var r = svg.getBoundingClientRect(), lx = sx - r.left, ly = sy - r.top,
			wx = (lx - state.tx) / state.s, wy = (ly - state.ty) / state.s;
		state.s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, state.s * factor));
		state.tx = lx - wx * state.s; state.ty = ly - wy * state.s;
		setTransform();
		onZoomChanged();
	}

	// ---- toolbar mode ----
	// 'select' (default): drag nodes/vertices/labels, pan the background, click to open a
	// property popup. 'add-*': place a new element. Pipe/Pump need two clicks (from-node,
	// to-node) since the solver's model connects links by node id, never by floating
	// coordinates. (A dedicated 'pan' tool was tried and cut -- Select's background-drag
	// fallback already pans, so the separate tool was redundant on desktop; Tom's call.)
	var mode = 'select';
	var pendingLinkFrom = null;
	var setModeUI = null; // wired by wireToolbar(); lets non-toolbar code (Draw Example) reset the UI too
	var pendingLinkPopupTimer = null; // see wirePointerEvents(): delays a link-tap popup so a double-click (add vertex) can cancel it
	var rubberBandEl = null; // built in init(); a dashed line from pendingLinkFrom to the live pointer

	// Sets/clears pendingLinkFrom AND its visual feedback together (Tom, 2026-07-30: "otherwise
	// there's no indication that anything is working" between the first and second click of
	// add-pipe/add-pump) -- a highlighted ring on the picked node, plus the rubber-band line
	// (positioned on pointermove in wirePointerEvents()). Every call site that used to assign
	// pendingLinkFrom directly goes through this now, so the highlight/rubber-band can never drift
	// out of sync with the actual pending state.
	function setPendingLinkFrom(id) {
		if (pendingLinkFrom && nodeEls[pendingLinkFrom]) { nodeEls[pendingLinkFrom].circle.classList.remove('lpn-node-pending'); }
		pendingLinkFrom = id;
		if (id && nodeEls[id]) { nodeEls[id].circle.classList.add('lpn-node-pending'); }
		if (rubberBandEl) { rubberBandEl.style.display = id ? '' : 'none'; }
	}

	// Maps a tool mode to its pageConfig mode-hint key -- see the lang keys' own comment for why
	// each is a whole sentence rather than "Mode:" + the tool's own label composed at render time.
	var MODE_HINT_KEYS = {
		'select': 'lpn_mode_select', 'delete': 'lpn_mode_delete',
		'add-junction': 'lpn_mode_add_junction', 'add-reservoir': 'lpn_mode_add_reservoir',
		'add-pipe': 'lpn_mode_add_pipe', 'add-pump': 'lpn_mode_add_pump', 'add-text': 'lpn_mode_add_text'
	};
	function updateModeHint() {
		var el = document.getElementById('lpn_mode_hint'); if (!el) { return; }
		var pc = EngCalcs.pageConfig || {}, key = MODE_HINT_KEYS[mode];
		el.textContent = key ? (pc[key] || '') : '';
	}
	function setMode(newMode) {
		mode = newMode; setPendingLinkFrom(null);
		if (setModeUI) { setModeUI(); }
		updateModeHint();
	}

	function addNode(type, x, y) {
		// key is the structural nextId/settings.idPrefixes lookup letter; the ID's actual leading
		// text is settings.idPrefixes[key] (customizable via the gear/settings panel, Task 146 Phase
		// 2) -- defaults to the key itself, so this reproduces the original hardcoded J1/R1 behavior
		// until a user changes it.
		var key = type === 'reservoir' ? 'R' : 'J', id = (settings.idPrefixes[key] || key) + (nextId[key]++);
		// Both node types carry an elevation. A reservoir ALSO carries a head -- the fixed-head
		// boundary condition js/lpn-solver.js solves against -- and that head is left blank by
		// default, meaning "same as the elevation" (Tom, 2026-07-30: a reservoir with both fields
		// is also a tank; the head "can default to Elevation and literally auto-fill from elevation
		// if blank"). So a plain reservoir is a water surface at its own ground elevation, and
		// typing a head turns it into a tank of that depth, with the difference reported as the
		// pressure there. See reservoirHead() for the one place that resolution happens.
		// Both node types now take the SAME settings.defaults.nodeElev (Tom, 2026-07-30) -- see the
		// note on settings.defaults for why the old reservoir-sits-100-ft-higher asymmetry went away.
		// A reservoir still gets no `head` key at all, which is what keeps it following its elevation.
		var n = type === 'reservoir'
			? { id: id, type: type, x: x, y: y, elev: settings.defaults.nodeElev }
			: { id: id, type: type, x: x, y: y, elev: settings.defaults.nodeElev, _demand: settings.defaults.demand };
		doc.nodes.push(n);
		buildNodeEls(n);
		incidentLinks[id] = []; labelsByAnchor[id] = [];
		updateEmptyHint();
		scheduleSolve();
		return n;
	}
	function addLink(type, fromId, toId) {
		var key = type === 'pump' ? 'P' : 'L', id = (settings.idPrefixes[key] || key) + (nextId[key]++);
		var l = {
			id: id, type: type, from: fromId, to: toId, verts: [],
			_diameter: settings.defaults.diameter,
			// No `length` default, deliberately (Tom, 2026-07-30): lenAuto derives length from the
			// drawn geometry, so a default would be overwritten by linkGeomLength() on the next line.
			_roughness: settings.defaults.roughness, _length: 0, lenAuto: true, _status: 'open',
			_k: settings.defaults.k // pump ignores k -- only the pipe friction branch reads it
		};
		l._length = linkGeomLength(l);
		if (type === 'pump') {
			// Pump curve entry (Task 146, 2026-07-30): l.curvePoints holds 1-3 [Q,H] pairs in SI,
			// fitted to h0/a/b by EngCalcs.lpnPumpFromCurve (see its own comment for the 1/2/3-point
			// forms -- same math bpn_'s supply curve uses). l.curveRef, when set, names another
			// pump link whose curvePoints this one copies instead of using its own -- so several
			// identical pumps in one network need the curve entered only once.
			// A brand-new pump has NO curve at all (Tom, 2026-07-30: "the entire issue was that
			// there was a hidden curve... just squash the secrets"). An invisible default design
			// point made a pump silently deliver head the user never entered, and then behave
			// strangely once demand ran past that unseen curve. With no curve it adds and loses
			// nothing until a real one is typed into its popup -- see recomputePumpCurve().
			l.curvePoints = [];
			l.curveRef = null;
			recomputePumpCurve(l);
		}
		doc.links.push(l);
		incidentLinks[fromId].push(id); incidentLinks[toId].push(id);
		buildLinkEls(l);
		scheduleSolve();
		return l;
	}
	// anchorNode, if given, anchors the new Text to that node with a leader -- lb.x/lb.y become an
	// OFFSET from the node (matching buildLabelEls'/updateLabelGeometry's model), computed here so
	// the label still appears exactly where the user tapped, not snapped onto the node itself.
	function addText(x, y, anchorNode) {
		var id = (settings.idPrefixes.T || 'T') + (nextId.T++), an = anchorNode ? nodeById(anchorNode) : null;
		var lb = an
			? { id: id, text: EngCalcs.pageConfig.lpn_new_text || 'Text', x: x - an.x, y: y - an.y, anchorNode: anchorNode, sizeMult: 1 }
			: { id: id, text: EngCalcs.pageConfig.lpn_new_text || 'Text', x: x, y: y, anchorNode: null, sizeMult: 1 };
		doc.labels.push(lb);
		buildLabelEls(lb);
		// A newly-added Text was never actually persisted (Task 146 Phase 1 gap, found while
		// wiring the text-edit popup, 2026-07-30) -- addNode()/addLink() reach saveToStorage()
		// via scheduleSolve(); a Text never triggers a solve, so nothing else was saving it.
		saveToStorage();
		return lb;
	}
	function deleteNode(id) {
		var links = incidentLinks[id].slice(), i;
		for (i = 0; i < links.length; i++) { deleteLink(links[i]); }
		labelsByAnchor[id].slice().forEach(function (lid) { deleteLabelById(lid); });
		nodeEls[id].circle.remove(); nodeEls[id].text.remove();
		nodeEls[id].mask.remove(); nodeEls[id].leader.remove();
		// Same orphaned-tick-mark bug as deleteLink()/rebuildLink() -- these are separate elements,
		// not text children.
		if (nodeEls[id].tickEls) { nodeEls[id].tickEls.forEach(function (t) { t.remove(); }); }
		delete nodeEls[id]; delete incidentLinks[id]; delete labelsByAnchor[id];
		doc.nodes = doc.nodes.filter(function (n) { return n.id !== id; });
		if (currentPopup && currentPopup.kind === 'node' && currentPopup.id === id) { closePopup(); }
		updateEmptyHint();
		scheduleSolve();
	}
	function updateEmptyHint() {
		var hint = document.getElementById('lpn_empty_hint');
		if (hint) { hint.style.display = doc.nodes.length === 0 ? 'block' : 'none'; }
	}
	function deleteLink(id) {
		var l = linkById(id);
		linkEls[id].line.remove();
		linkEls[id].handles.forEach(function (h) { h.remove(); });
		linkEls[id].arrows.forEach(function (a) { a.remove(); });
		linkEls[id].text.remove();
		linkEls[id].mask.remove(); linkEls[id].leader.remove();
		// Extrema tick marks (applyExtremaTicks()) are separate elements, not text children --
		// orphaned on screen otherwise (Tom, 2026-07-30: "when I delete a pipe, its orphaned labels
		// are left behind"). Same fix rebuildLink() already needed for the same reason.
		if (linkEls[id].tickEls) { linkEls[id].tickEls.forEach(function (t) { t.remove(); }); }
		delete linkEls[id];
		incidentLinks[l.from] = incidentLinks[l.from].filter(function (x) { return x !== id; });
		incidentLinks[l.to] = incidentLinks[l.to].filter(function (x) { return x !== id; });
		doc.links = doc.links.filter(function (x) { return x.id !== id; });
		if (currentPopup && currentPopup.kind === 'link' && currentPopup.id === id) { closePopup(); }
		scheduleSolve();
	}
	function deleteLabelById(id) {
		var lb = labelById(id), le = labelEls[id];
		if (le.leader) { le.leader.remove(); }
		le.text.remove();
		le.mask.remove();
		delete labelEls[id];
		if (lb.anchorNode) {
			labelsByAnchor[lb.anchorNode] = labelsByAnchor[lb.anchorNode].filter(function (x) { return x !== id; });
		}
		doc.labels = doc.labels.filter(function (x) { return x.id !== id; });
		if (currentPopup && currentPopup.kind === 'label' && currentPopup.id === id) { closePopup(); }
	}

	// ---- Project library storage (Task 146.08 step 3) ----
	// ONE localStorage key per project (`lpn_project_<id>`) plus a small index (`lpn_index`), rather
	// than one blob holding everything. Two reasons, both from the ROADMAP:
	//   - autosave rewrites only the OPEN project, so typing in a small network does not re-serialize
	//     every other network you own on every keystroke; and
	//   - one large backdrop image cannot take the whole library down with a single quota error. A
	//     project that will not fit fails alone, and the others stay readable.
	// The index carries only what a project LIST needs (id, name, updated). It is a cache, not the
	// authority: `project.name` inside the project document is the source of truth, and
	// adoptOrphans() below rebuilds an index entry for any project key the index has lost.
	var LPN_STORAGE_VERSION = 2;
	var LPN_LEGACY_KEY = 'lpn_document';   // the pre-library single-document key (v1 and v2 alike)
	var LPN_INDEX_KEY = 'lpn_index';
	var LPN_PROJECT_PREFIX = 'lpn_project_';
	var library = { v: LPN_STORAGE_VERSION, openId: null, projects: [] };
	// True once a write has failed (quota, private mode). Autosave stays best-effort -- it must never
	// throw into a mouse handler -- but with a LIBRARY the old silent swallow is no longer honest:
	// a user with several projects and a full quota would go on drawing into a document that is not
	// being saved. setStorageError() surfaces it in the status bar instead.
	var storageError = false;
	function setStorageError(on) {
		var pc = EngCalcs.pageConfig || {};
		if (on === storageError) { return; }
		storageError = on;
		if (on) { setStatus(pc.lpn_storage_full || 'Not saved. Browser storage is full or unavailable, so your recent changes will be lost when you close this tab.'); }
	}
	function projectKey(id) { return LPN_PROJECT_PREFIX + id; }
	// The full reset behind "?lpn_wipe=1" and the Wipe memory button. Now that a library exists it
	// must clear EVERY project key plus the index, not just the old single document -- a wipe that
	// left ten project keys behind would repopulate the library on the next load via adoptOrphans()
	// and read as the wipe having silently failed. Collected before deleting: removing while
	// iterating localStorage by index skips entries.
	function wipeAllStorage() {
		var i, key, doomed = [LPN_LEGACY_KEY, LPN_INDEX_KEY];
		try {
			for (i = 0; i < localStorage.length; i++) {
				key = localStorage.key(i);
				if (key && key.indexOf(LPN_PROJECT_PREFIX) === 0) { doomed.push(key); }
			}
			doomed.forEach(function (k) { localStorage.removeItem(k); });
		} catch (err) { /* private mode -- nothing to remove */ }
		// ALSO expire the suite unit cookie, or the promise this button makes is not kept
		// (found 2026-07-31 while checking whether Tom's "returns to a new machine state" wording
		// was true). Looped-Network.php calls echoCookieScript(), and echoUnitSelect() hardcodes
		// onchange="EngCalcs.submitForm()", so the seven unit dropdowns ARE saved to a cookie and
		// ARE restored on load. Without this, "reloads the page exactly as a first-time visitor
		// sees it" was false: a returning visitor who had switched to SI came back to SI.
		// (An older comment in clearNetwork() calls this "a cookie this page never uses" -- that
		// was true when it was written and has not been for some time; corrected there too.)
		try { if (EngCalcs.expireCookie) { EngCalcs.expireCookie(); } } catch (err) { /* non-fatal */ }
	}
	// Time-ordered prefix plus randomness: sortable for debugging, and collision-free even when two
	// projects are created in the same millisecond in two tabs.
	function newProjectId() {
		return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
	}
	function serializeProject() {
		return {
			v: LPN_STORAGE_VERSION, project: project, scenarios: scenarios,
			nodes: doc.nodes, links: doc.links, labels: doc.labels, nextId: nextId,
			labelSettings: labelSettings, backdrop: backdrop, settings: settings
		};
	}
	function writeJSON(key, obj) {
		try { localStorage.setItem(key, JSON.stringify(obj)); setStorageError(false); return true; }
		catch (err) { setStorageError(true); return false; }
	}
	function readJSON(key) {
		var raw;
		try { raw = localStorage.getItem(key); } catch (err) { return null; }
		if (!raw) { return null; }
		try { return JSON.parse(raw); } catch (err) { return null; }
	}
	function indexEntry(id) {
		for (var i = 0; i < library.projects.length; i++) { if (library.projects[i].id === id) { return library.projects[i]; } }
		return null;
	}
	function saveIndex() { return writeJSON(LPN_INDEX_KEY, library); }
	// Autosave. Writes the OPEN project's document first and the index second, deliberately: if the
	// document write fails on quota, the index still describes the last state that actually made it
	// to disk, rather than advertising a project whose content never landed.
	function saveToStorage() {
		if (!library.openId) { return; }
		if (!writeJSON(projectKey(library.openId), serializeProject())) { return; }
		var entry = indexEntry(library.openId);
		if (entry) { entry.name = project.name; entry.updated = Date.now(); }
		saveIndex();
	}
	// Versioned per the scope doc's schema rules: v > CURRENT refuses to load and says so, never
	// silently drops unknown fields; v < CURRENT runs an ordered migration chain.
	// v1 -> v2 (Task 184/146.08, 2026-07-30) is a pure WRAP, with no data loss and nothing to
	// reinterpret: the same nodes/links/labels/nextId/labelSettings/backdrop/settings keys sit
	// alongside a new `project` and a `scenarios` array holding Base and nothing else. A v1 save
	// therefore migrates by supplying two defaults, which is exactly what migrateSaved() does below
	// -- and it is why the container had to ship before scenarios rather than after.
	// Ordered, one step per version, each taking the object from v(n) to v(n+1). A save older than
	// the newest migration therefore walks the whole chain rather than needing a special case per
	// starting version.
	function migrateSaved(saved) {
		if (saved.v === 1) {
			// The single autosaved network becomes the project's Base. Its name is left blank, not
			// set to "Untitled": that word is UI, and the UI localizes it (see `project` above).
			saved.project = { name: '', activeScenario: 'base' };
			saved.scenarios = defaultScenarios();
			// Rename every LPN_OVERRIDABLE property to its underscored storage key (Task 184/146.08
			// step 2). Same rename effective() expects going forward -- done here, once, rather than
			// leaving v1's plain names to silently read as undefined through the new resolver. A
			// legitimately falsy 0 is preserved (hasOwnProperty, not truthiness); an absent key stays
			// absent rather than being defaulted -- that is loadFromStorage()'s job, not this one's.
			function renameOverridable(el, whitelist) {
				Object.keys(whitelist).forEach(function (prop) {
					if (Object.prototype.hasOwnProperty.call(el, prop)) {
						el['_' + prop] = el[prop];
						delete el[prop];
					}
				});
			}
			(saved.nodes || []).forEach(function (n) { renameOverridable(n, LPN_OVERRIDABLE.node); });
			(saved.links || []).forEach(function (l) { renameOverridable(l, LPN_OVERRIDABLE.link); });
			saved.v = 2;
		}
		return saved;
	}
	// Reads one stored document, version-checks it and runs it up to the current version. Returns
	// null for "nothing usable here" -- absent, unparseable, or written by a NEWER page than this
	// one, which is refused loudly rather than silently half-read.
	function readDocument(key) {
		var saved = readJSON(key);
		if (!saved || typeof saved.v !== 'number') { return null; }
		if (saved.v > LPN_STORAGE_VERSION) {
			var pc = EngCalcs.pageConfig || {};
			alert(pc.lpn_storage_too_new || 'This project was saved by a newer version of the page, so it cannot be opened here.');
			return null;
		}
		return migrateSaved(saved);
	}
	// Installs an already-read, already-migrated document as the live network. Split out of the old
	// loadFromStorage() so the library can apply a document from ANY project key, not just the one.
	function applySaved(saved) {
		// Project/scenario container. Rebuilt from defaults and merged, for the same reason the
		// labelSettings and settings blocks below spell out: a key added after this save was written
		// must come back at its default, not as undefined.
		project = Object.assign({ name: '', activeScenario: 'base' }, saved.project || {});
		scenarios = Array.isArray(saved.scenarios) && saved.scenarios.length ? saved.scenarios : defaultScenarios();
		// Two structural guarantees the rest of the model leans on, restored here rather than
		// trusted: exactly one Base exists, and the active scenario names a scenario that is really
		// in the list. Both are cheap to check and both are unrecoverable to get wrong later.
		if (!scenarios.some(function (s) { return s.isBase; })) { scenarios = defaultScenarios().concat(scenarios); }
		scenarios.forEach(function (s) { if (!s.overrides) { s.overrides = {}; } });
		baseScenario().overrides = {}; // Base is canon and has no overrides, by definition
		if (!scenarios.some(function (s) { return s.id === project.activeScenario; })) { project.activeScenario = baseScenario().id; }
		doc.nodes = saved.nodes || []; doc.links = saved.links || []; doc.labels = saved.labels || [];
		// Reservoirs written before they had an elevation (2026-07-30) carry only a head. Giving
		// such a reservoir an elevation EQUAL to its head keeps the old network solving and reading
		// exactly as it did -- same fixed head, and a pressure of zero at the water surface --
		// rather than silently reinterpreting the whole thing as a tank standing on datum.
		doc.nodes.forEach(function (n) {
			if (n.type === 'reservoir' && n.elev === undefined) { n.elev = n._head || 0; }
		});
		nextId = saved.nextId || { J: 1, R: 1, L: 1, P: 1, T: 1 };
		// Object.assign onto the current defaults, not saved.x || defaults() -- a plain "||" swaps in
		// a saved object wholesale, so a preference added AFTER a user's last save (e.g. Task 146.03's
		// mapHeight) is simply missing from it and reads as undefined rather than falling back to its
		// default. That bug is what made the map render at the browser's tiny intrinsic SVG height the
		// first time mapHeight shipped -- svg.setAttribute('height', undefined) is not the same as
		// leaving the attribute at its default. Merging keeps every OLD saved value while still
		// picking up any NEW default key that didn't exist when the save was written.
		// Merged one level DEEPER than the comment above describes, because labelSettings is nested
		// ({node:{...}, link:{...}}): a top-level Object.assign swaps in the saved `link` object
		// whole, so a toggle added after that save (gradient, and every future one) would come back
		// undefined instead of at its default. Same reasoning, applied per sub-object.
		// Groups named explicitly rather than looped over Object.keys(labelSettings): since Task
		// 189/190 the object is no longer uniformly two flat sub-objects -- `decimals` is nested one
		// level deeper and `markExtrema` is a bare boolean, which Object.assign() onto a primitive
		// would have silently discarded (it boxes the boolean and throws the result away).
		labelSettings = defaultLabelSettings();
		var savedLS = saved.labelSettings || {}, savedDec = savedLS.decimals || {};
		Object.assign(labelSettings.node, savedLS.node || {});
		Object.assign(labelSettings.link, savedLS.link || {});
		Object.assign(labelSettings.decimals.node, savedDec.node || {});
		Object.assign(labelSettings.decimals.link, savedDec.link || {});
		if (typeof savedLS.markExtrema === 'boolean') { labelSettings.markExtrema = savedLS.markExtrema; }
		backdrop = saved.backdrop || null;
		// Same one-level-deeper merge the labelSettings block above documents, and for the same
		// reason: `defaults` and `sectionsOpen` are nested objects, so a top-level Object.assign
		// swaps the saved one in whole and any default added AFTER that save comes back undefined
		// instead of at its default. Assigning the nested objects separately keeps every OLD saved
		// value while still picking up NEW keys (which seedDefaultInputs() then fills).
		var savedSettings = Object.assign({}, saved.settings || {});
		var savedDefaults = savedSettings.defaults || {}, savedSections = savedSettings.sectionsOpen || {};
		delete savedSettings.defaults; delete savedSettings.sectionsOpen;
		settings = Object.assign(defaultSettings(), savedSettings);
		Object.assign(settings.defaults, savedDefaults);
		Object.assign(settings.sectionsOpen, savedSections);
		// `kmDefault` was the single-purpose predecessor of settings.defaults.k (renamed 2026-07-30
		// when defaults grew to cover every input). Carry a saved one across so a user who set it
		// does not silently lose it, then drop the old key so it cannot drift.
		if (typeof settings.kmDefault === 'number') { settings.defaults.k = settings.kmDefault; }
		delete settings.kmDefault;
		return true;
	}

	// ---- the project library ----
	// A project with no name renders as "Untitled" HERE, at display time, rather than being stored
	// with that word -- see the note on `project` above for why the data stays language-free.
	function projectDisplayName(p) {
		var pc = EngCalcs.pageConfig || {};
		return (p && p.name) ? p.name : (pc.lpn_project_untitled || 'Untitled');
	}
	// The index is a cache and is repaired from the real project keys, never trusted blindly: a
	// quota failure can land a project document while the index write that follows it fails, and a
	// project the user can no longer SEE is indistinguishable from one that was lost. Scanning the
	// prefix is cheap (localStorage is synchronous and small) and makes the library self-healing.
	function adoptOrphans() {
		var i, key, doc2, id, changed = false;
		try {
			for (i = 0; i < localStorage.length; i++) {
				key = localStorage.key(i);
				if (!key || key.indexOf(LPN_PROJECT_PREFIX) !== 0) { continue; }
				id = key.slice(LPN_PROJECT_PREFIX.length);
				if (indexEntry(id)) { continue; }
				doc2 = readJSON(key);
				if (!doc2) { continue; }
				library.projects.push({ id: id, name: (doc2.project && doc2.project.name) || '', updated: 0 });
				changed = true;
			}
		} catch (err) { /* private mode -- nothing to scan */ }
		// The reverse repair: an index entry whose document is gone (a partial delete, or a user
		// clearing one key by hand) would otherwise show a project that cannot be opened.
		var before = library.projects.length;
		library.projects = library.projects.filter(function (p) {
			try { return localStorage.getItem(projectKey(p.id)) !== null; } catch (err) { return true; }
		});
		return changed || library.projects.length !== before;
	}
	// One-time move of the pre-library single document into the library. A MOVE, not a copy: the
	// legacy key is removed only AFTER the project key has been written and read back successfully,
	// so a quota failure mid-migration leaves the original exactly where it was. Copying instead
	// would double a multi-megabyte backdrop, which is the one thing most likely to hit quota here.
	function migrateLegacy() {
		var saved = readDocument(LPN_LEGACY_KEY);
		if (!saved) { return null; }
		var id = newProjectId();
		if (!writeJSON(projectKey(id), saved)) { return null; }
		if (readJSON(projectKey(id)) === null) { return null; }
		try { localStorage.removeItem(LPN_LEGACY_KEY); } catch (err) { /* leave it; harmless duplicate */ }
		library.projects.push({ id: id, name: (saved.project && saved.project.name) || '', updated: Date.now() });
		library.openId = id;
		saveIndex();
		return saved;
	}
	// Returns the document to install, or null for "start empty". Called once, from init().
	function initLibrary() {
		var saved = readJSON(LPN_INDEX_KEY);
		if (saved && Array.isArray(saved.projects)) {
			library.projects = saved.projects;
			library.openId = saved.openId || null;
		}
		var repaired = adoptOrphans();
		// No index and no projects: either a first visit, or a preview user whose only network is
		// still under the old single-document key.
		if (!library.projects.length) { return migrateLegacy(); }
		if (repaired) { saveIndex(); }
		if (!indexEntry(library.openId)) { library.openId = library.projects[0].id; }
		var doc2 = readDocument(projectKey(library.openId));
		if (!doc2) { return null; }
		return doc2;
	}
	// Everything a freshly-installed document has to push back out to the UI. Shared by
	// openProject() and newProject() so the two can never drift into repainting different subsets.
	function refreshAllFromDocument() {
		backdropImg = null;
		backdropLayer.innerHTML = '';
		if (backdrop) { buildBackdropImg(); }
		updateBackdropMenuState();
		lastSolveResult = null;
		closePopup();
		buildDom();
		seedDefaultInputs();
		rebuildSettingsFields();
		rebuildLabelsFields();
		applyLegendPosition();
		applyMapHeight();
		refreshFontSizes();
		refreshSymbolSizes();
		renderLabelsLegend();
		updateEmptyHint();
		setStatus('');
		setMode('select');
		zoomExtent();
		scheduleSolve();
		updateProjectName();
	}
	function openProject(id) {
		if (id === library.openId) { return true; }
		saveToStorage(); // flush the outgoing project before switching away from it
		var doc2 = readDocument(projectKey(id));
		if (!doc2) { return false; }
		library.openId = id;
		saveIndex();
		applySaved(doc2);
		clearUndo();
		refreshAllFromDocument();
		return true;
	}
	// A new project inherits the CURRENT project's settings and label choices rather than starting
	// at factory defaults. This is what preserves the behavior Tom set up before the library existed
	// -- "New" clears the network, not your preferences -- now that preferences live per project.
	// The workflow it protects is his own: set 8-inch/150/K=2 defaults, then draw.
	function newProject() {
		saveToStorage();
		var inheritedSettings = JSON.parse(JSON.stringify(settings));
		var inheritedLabels = JSON.parse(JSON.stringify(labelSettings));
		var id = newProjectId();
		doc = { nodes: [], links: [], labels: [] };
		nextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };
		scenarios = defaultScenarios();
		project = { name: '', activeScenario: 'base' };
		settings = inheritedSettings;
		labelSettings = inheritedLabels;
		backdrop = null;
		library.projects.push({ id: id, name: '', updated: Date.now() });
		library.openId = id;
		clearUndo();
		saveToStorage();
		refreshAllFromDocument();
		return id;
	}
	// "Save as new project" -- Task 184's project-level copy, and the conventional reading of the
	// words (Tom, 2026-07-31: "New project" sounds like this, not like starting empty). Duplicates
	// the WHOLE project -- network, scenarios, overrides, backdrop and preferences together -- and
	// opens the copy, leaving the original on disk untouched. Task 184 wants copy at the PROJECT
	// level precisely because that is where a self-contained duplicate is what the user means.
	function saveProjectAs(name) {
		saveToStorage();
		var id = newProjectId(), copy = serializeProject();
		copy.project = Object.assign({}, project, { name: name });
		// Written and verified BEFORE anything switches: a backdrop image makes a project the one
		// thing here big enough to fail on quota, and a failed copy must leave the user exactly
		// where they were rather than half-moved into a project that does not exist.
		if (!writeJSON(projectKey(id), copy)) { return null; }
		library.projects.push({ id: id, name: name, updated: Date.now() });
		library.openId = id;
		project.name = name;
		saveIndex();
		clearUndo();
		updateProjectName();
		return id;
	}
	function renameProject(id, name) {
		var entry = indexEntry(id);
		if (!entry) { return; }
		entry.name = name;
		entry.updated = Date.now();
		if (id === library.openId) { project.name = name; saveToStorage(); updateProjectName(); }
		else {
			// Rename a project that is not open by rewriting just its name in place -- read, patch,
			// write. Cheaper and safer than opening it, and it keeps the document (the authority)
			// and the index agreeing.
			var doc2 = readJSON(projectKey(id));
			if (doc2 && doc2.project) { doc2.project.name = name; writeJSON(projectKey(id), doc2); }
		}
		saveIndex();
	}
	// Deletes the document first, then the index entry: the reverse order can leave a document with
	// no entry, which adoptOrphans() would helpfully resurrect on the next load.
	function deleteProject(id) {
		var pc = EngCalcs.pageConfig || {}, entry = indexEntry(id),
			// Captured BEFORE the removal below -- after it there is nothing left to name.
			goneName = projectDisplayName(entry || { name: '' });
		try { localStorage.removeItem(projectKey(id)); } catch (err) { /* private mode */ }
		library.projects = library.projects.filter(function (p) { return p.id !== id; });
		if (id === library.openId) {
			library.openId = null;
			// Deleting the OPEN project has to leave something open. The most recently updated
			// survivor is the best guess at "what I was working on before this one"; with no
			// survivors at all, a fresh empty project -- never a blank screen with no project.
			// Tom, 2026-07-31, on whether it should instead always land on a clean Untitled: no,
			// because newProject() pushes a real persisted row, so deleting 1 of 5 would leave 5
			// rows and read as a failed delete. He also ruled out warning BEFOREHAND -- the fix is
			// to say afterwards where you landed, since the alarm is "a network I did not ask for
			// just appeared", and that is answered by narration, not by a different landing spot.
			var rest = library.projects.slice().sort(function (a, b) { return (b.updated || 0) - (a.updated || 0); });
			if (rest.length) {
				library.openId = rest[0].id;
				var d = readDocument(projectKey(rest[0].id));
				if (d) { applySaved(d); }
				clearUndo();
				refreshAllFromDocument();
				// After refreshAllFromDocument(), which itself calls setStatus('') -- see the
				// notice/diagnostic split at setStatus().
				setNotice((pc.lpn_status_deleted_opened || 'Deleted {deleted}. Now showing {opened}.')
					.replace('{deleted}', goneName)
					.replace('{opened}', projectDisplayName(rest[0])));
			} else {
				newProject();
				setNotice((pc.lpn_status_deleted_empty || 'Deleted {deleted}. Started a new empty project.')
					.replace('{deleted}', goneName));
				return;
			}
		}
		saveIndex();
	}
	// ---- Projects panel ----
	// The open project's name lives on its own toolbar button, which both SHOWS what you are working
	// on and opens the library -- the "what am I working on right now" question Task 184 names, in
	// the place you would look for it. Renamed in place; no separate name field to keep in sync.
	function updateProjectName() {
		var btn = document.getElementById('lpn_projects_btn');
		var pc = EngCalcs.pageConfig || {};
		if (btn) { btn.textContent = (pc.lpn_tool_projects || 'Projects') + ': ' + projectDisplayName(project); }
	}
	function rebuildProjectsList() {
		var pc = EngCalcs.pageConfig || {}, list = document.getElementById('lpn_projects_list');
		if (!list) { return; }
		list.innerHTML = '';
		// Most recently updated first: with no folders and no search, recency is the only ordering
		// that keeps the project you actually want near the top as a library grows.
		var rows = library.projects.slice().sort(function (a, b) { return (b.updated || 0) - (a.updated || 0); });
		rows.forEach(function (p) {
			var isOpen = p.id === library.openId;
			var row = document.createElement('div');
			row.style.margin = '3px 0';
			var name = document.createElement('span');
			name.textContent = projectDisplayName(p);
			if (isOpen) { name.style.fontWeight = 'bold'; }
			row.appendChild(name);
			if (isOpen) {
				var here = document.createElement('span');
				here.textContent = ' (' + (pc.lpn_project_open_now || 'Open now') + ')';
				row.appendChild(here);
			} else {
				var openBtn = document.createElement('button');
				openBtn.type = 'button'; openBtn.style.marginLeft = '6px';
				openBtn.textContent = pc.lpn_project_open || 'Open';
				openBtn.addEventListener('click', function () { openProject(p.id); rebuildProjectsList(); });
				row.appendChild(openBtn);
			}
			var renameBtn = document.createElement('button');
			renameBtn.type = 'button'; renameBtn.style.marginLeft = '4px';
			renameBtn.textContent = pc.lpn_project_rename || 'Rename';
			renameBtn.addEventListener('click', function () {
				var v = window.prompt(pc.lpn_prompt_project_name || 'Name for this project', p.name || '');
				// null is Cancel; an empty string is a deliberate "clear the name", which is legal --
				// the project falls back to displaying Untitled.
				if (v === null) { return; }
				renameProject(p.id, v.trim());
				rebuildProjectsList();
			});
			row.appendChild(renameBtn);
			var delBtn = document.createElement('button');
			delBtn.type = 'button'; delBtn.style.marginLeft = '4px';
			delBtn.textContent = pc.lpn_project_delete || 'Delete';
			delBtn.addEventListener('click', function () {
				if (!window.confirm(pc.lpn_confirm_project_delete || 'Delete this project and everything in it? This cannot be undone.')) { return; }
				deleteProject(p.id);
				rebuildProjectsList();
			});
			row.appendChild(delBtn);
			list.appendChild(row);
		});
		// Two ways to get a new project, deliberately named apart (Tom, 2026-07-31): "Save as new
		// project" duplicates what is on screen, "Start empty project" does not. A single "New
		// project" reads as the first to most people and does the second, which is the worst
		// possible combination.
		var saveAsBtn = document.createElement('button');
		saveAsBtn.type = 'button'; saveAsBtn.style.marginTop = '6px';
		saveAsBtn.textContent = pc.lpn_project_saveas || 'Save as new project';
		saveAsBtn.addEventListener('click', function () {
			var suggested = (project.name || projectDisplayName(project)) + (pc.lpn_project_copy_suffix || ' (copy)');
			var v = window.prompt(pc.lpn_prompt_project_name || 'Name for this project', suggested);
			if (v === null) { return; }
			saveProjectAs(v.trim());
			rebuildProjectsList();
		});
		list.appendChild(saveAsBtn);
		var newBtn = document.createElement('button');
		newBtn.type = 'button'; newBtn.style.marginTop = '6px'; newBtn.style.marginLeft = '4px';
		newBtn.textContent = pc.lpn_project_new || 'Start empty project';
		newBtn.addEventListener('click', function () { newProject(); rebuildProjectsList(); });
		list.appendChild(newBtn);
	}
	function toggleProjectsPopup(evt) {
		var popup = document.getElementById('lpn_projects_popup');
		if (popup.style.display === 'block') { popup.style.display = 'none'; return; }
		rebuildProjectsList();
		// Same position-from-the-button-rect-then-clamp dance the other two popovers use.
		var r = evt.currentTarget.getBoundingClientRect();
		popup.style.left = r.left + 'px'; popup.style.top = r.bottom + 'px'; popup.style.display = 'block';
		var pr = popup.getBoundingClientRect();
		popup.style.left = Math.max(4, Math.min(r.left, window.innerWidth - pr.width - 4)) + 'px';
		popup.style.top = Math.max(4, Math.min(r.bottom, window.innerHeight - pr.height - 4)) + 'px';
	}
	function wireProjectsPopup() {
		document.getElementById('lpn_projects_popup_close').addEventListener('click', function () {
			document.getElementById('lpn_projects_popup').style.display = 'none';
		});
	}

	// A dedicated button, not a repurposed "Restore Defaults" (Tom asked "do we dare"): that
	// button's suite-wide behavior (EngCalcs.resetToDefaults) expires the page cookie and reloads,
	// which wouldn't touch localStorage at all -- unifying the two is a real design question logged
	// in the scope doc, not resolved here.
	// CORRECTION 2026-07-31: this comment used to say "a cookie this page never uses". It does use
	// one -- Looped-Network.php calls echoCookieScript(), and the units strip's selects carry
	// echoUnitSelect()'s hardcoded onchange="EngCalcs.submitForm()", so the unit choices round-trip
	// through the suite cookie like any other page. wipeAllStorage() now expires it.
	function clearNetwork() {
		var pc = EngCalcs.pageConfig || {};
		if (!window.confirm(pc.lpn_confirm_clear || 'This permanently deletes the network, the background image, and the project name. Your settings are kept. Continue?')) { return; }
		doc = { nodes: [], links: [], labels: [] };
		nextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };
		// "New" means a blank PROJECT, so the container resets with the network: scenarios back to
		// Base alone (their overrides key element IDs that no longer exist) and the project name
		// back to unnamed. Preferences (settings/labelSettings) still survive, as below.
		scenarios = defaultScenarios();
		project = { name: '', activeScenario: 'base' };
		// "New" means a genuinely blank project (Task 146 Phase 2) -- the separate "Remove image"
		// menu action clears just the backdrop without touching the network.
		backdrop = null; backdropImg = null;
		backdropLayer.innerHTML = '';
		updateBackdropMenuState();
		// saveToStorage(), not removeItem() (fixed 2026-07-30, found while verifying the gear/settings
		// panel): labelSettings/settings are preferences, not network content, and are meant to survive
		// "New / Clear" -- removeItem() wiped them out of localStorage too, leaving them intact only in
		// memory until some later, unrelated mutation happened to call saveToStorage() again. Saving the
		// now-blank doc immediately keeps storage and memory in sync at every point, not just eventually.
		saveToStorage();
		lastSolveResult = null;
		closePopup();
		buildDom();
		updateEmptyHint();
		setStatus('');
		setMode('select');
		zoomExtent();
	}

	function init() {
		// True first-visit reset (Tom, 2026-07-30): wipes the ONE localStorage key that carries
		// everything -- network, backdrop, and settings/labelSettings preferences alike -- so the
		// page loads exactly as a brand-new visitor would see it. Strictly more destructive than
		// New/Clear (clearNetwork(), content only) or Restore defaults (rebuildSettingsFields()'s
		// button, preferences only). Also reachable via "?lpn_wipe=1" in the URL for a scripted
		// reset with no click needed.
		try {
			if (/[?&]lpn_wipe=1(&|$)/.test(window.location.search)) {
				wipeAllStorage();
				var url = window.location.href.replace(/([?&])lpn_wipe=1&?/, '$1').replace(/[?&]$/, '');
				window.history.replaceState(null, '', url);
			}
		} catch (err) { /* localStorage/history can throw (private mode) -- non-fatal, just skip the wipe */ }
		svg = document.getElementById('lpn_canvas');
		world = el('g', {}, svg);
		backdropLayer = el('g', { 'class': 'lpn-backdrop' }, world);
		gridLayer = el('g', {}, world);
		// Classed so the symbol-opacity setting can fade both symbol layers as ONE drawing -- see
		// the .lpn-symbols rule in css/engcalcs.css.
		linksLayer = el('g', { 'class': 'lpn-symbols' }, world);
		nodesLayer = el('g', { 'class': 'lpn-symbols' }, world);
		// Every label mask lives in this ONE shared layer (Task 146.01 draw-order fix, Tom,
		// 2026-07-30), never appended alongside the element it masks: a mask is placed here
		// regardless of whether it belongs to a node, a link, or a Text label, so ALL masks sit
		// above ALL node/link symbols, and (since labelsLayer below holds every label's text) BELOW
		// every label's text. Appending a mask into nodesLayer/linksLayer/labelsLayer the way the
		// symbol next to it does was the original design, and it broke exactly the way Tom
		// described: a later-built node's own elements sit later in that shared layer's DOM order,
		// so its mask painted OVER an earlier node's already-placed label text if the two
		// overlapped on screen -- draw order tracked creation order, not "masks behind everything,
		// text on top" as intended.
		maskLayer = el('g', {}, world);
		labelsLayer = el('g', {}, world);
		// Topmost layer (after labelsLayer) so the rubber-band is never hidden under a node/link
		// while drawing a pipe/pump (Tom, 2026-07-30).
		rubberBandEl = el('line', { 'class': 'lpn-rubberband', style: 'display:none' }, world);
		setTransform();
		wireToolbar();
		// The toolbar is built here, AFTER Calculators.lib.js's own DOMContentLoaded listener
		// already ran EngCalcs.initTips(document) once (script load order puts that listener
		// first) -- so a button's .ec-help[title] tip (Select, Labels) would otherwise never get
		// its touch-tap tooltip wired up (ROADMAP Task 173's exact gap). Call it again now that
		// the buttons actually exist.
		if (EngCalcs.initTips) { EngCalcs.initTips(document); }
		wirePointerEvents();
		wirePopup();
		var opening = initLibrary();
		if (opening) {
			applySaved(opening);
			buildDom(); scheduleSolve();
			if (backdrop) { buildBackdropImg(); }
			updateBackdropMenuState();
		} else if (!library.openId) {
			// First visit, or nothing readable: the library always has exactly one open project, so
			// there is never a state where drawing has nowhere to be saved. Registered directly
			// rather than through newProject(), which repaints a UI that does not exist yet.
			var firstId = newProjectId();
			library.projects.push({ id: firstId, name: '', updated: Date.now() });
			library.openId = firstId;
			saveIndex();
		}
		wireLabelsPopup();
		// AFTER loadFromStorage() (so a saved default is never overwritten -- seedDefaultInputs()
		// fills nulls only) and BEFORE wireSettingsPopup() (which calls rebuildSettingsFields(),
		// where a still-null default would render as an empty box). Also necessarily after the
		// units strip is in the DOM, which is what the seeding exists to wait for.
		seedDefaultInputs();
		wireSettingsPopup();
		wireProjectsPopup();
		applyLegendPosition();
		applyMapHeight();
		// Node/vertex radii are already built at the right size (buildDom() reads symbolFactor()),
		// but the --lpn-sym custom property the stroke widths read is only ever written here and in
		// refreshSymbolSizes() -- so a saved non-default symbol size needs this call to take effect.
		refreshSymbolSizes();
		updateEmptyHint();
		updateModeHint(); // initial mode is 'select', set before setMode() ever runs -- render it now
		updateProjectName();
		// Rotating a phone changes innerHeight, and with it the cap above -- without this, turning a
		// portrait phone to landscape leaves a canvas taller than the screen and re-creates exactly
		// the trap the cap exists to prevent. orientationchange as well as resize: some mobile
		// browsers fire only one of the two, and re-applying a height twice is free.
		window.addEventListener('resize', applyMapHeight);
		window.addEventListener('orientationchange', applyMapHeight);
		zoomExtent();
		requestAnimationFrame(tick);
	}

	// Three visually separated groups (Tom, 2026-07-30): Add (the five element types), Edit
	// (Delete, Undo, Select -- in that order), and everything else (Zoom Extent, Draw Example).
	function wireToolbar() {
		var toolbar = document.getElementById('lpn_toolbar'), pc = EngCalcs.pageConfig || {};
		setModeUI = function () {
			toolbar.querySelectorAll('button[data-tool]').forEach(function (b) {
				b.setAttribute('aria-pressed', b.dataset.tool === mode ? 'true' : 'false');
			});
		};
		function group() {
			var g = document.createElement('span');
			g.className = 'lpn-toolbar-group';
			toolbar.appendChild(g);
			return g;
		}
		function modeButton(t, into) {
			var btn = document.createElement('button');
			btn.type = 'button';
			btn.textContent = pc[t.key] || t.mode;
			btn.setAttribute('aria-pressed', t.mode === mode ? 'true' : 'false');
			// Optional hover/tap tip (Tom, 2026-07-30) -- the button itself is already the click
			// target, so the tip goes straight on it as a title, matched to .ec-help for touch
			// (EngCalcs.initTips(), called again below once the toolbar is built).
			if (t.tip) { btn.title = t.tip; btn.className = 'ec-help'; }
			btn.addEventListener('click', function () {
				// Clicking the already-active tool toggles back to Select (Tom) rather than
				// leaving no way to "turn off" Add/Delete except picking a different tool.
				setMode(mode === t.mode && t.mode !== 'select' ? 'select' : t.mode);
			});
			btn.dataset.tool = t.mode;
			into.appendChild(btn);
		}

		// Four groups, in the classic File/Edit/Insert/View order (Tom, 2026-07-30): File (New,
		// then Draw Example -- as though it were "Open a sample"), Add/Insert (Reservoir first,
		// then in the same order the example network builds: Pump, Junction, Pipe), Edit (Select,
		// Delete, Undo -- Select first for safety, per Tom's own correction of an earlier order),
		// View (Zoom Extent).
		var fileGroup = group();
		// First in the File group and first on the toolbar: it names the open project, so it is also
		// the page's answer to "which network am I looking at" (Task 146.08).
		var projectsBtn = document.createElement('button');
		projectsBtn.type = 'button';
		projectsBtn.id = 'lpn_projects_btn';
		projectsBtn.textContent = pc.lpn_tool_projects || 'Projects';
		projectsBtn.addEventListener('click', toggleProjectsPopup);
		fileGroup.appendChild(projectsBtn);
		var clearBtn = document.createElement('button');
		clearBtn.type = 'button';
		clearBtn.textContent = pc.lpn_tool_clear || 'Clear project';
		// One of the three reset controls -- see helpTip() for why each states only its own scope.
		helpTip(clearBtn, pc.lpn_tool_clear_tip);
		clearBtn.addEventListener('click', clearNetwork);
		fileGroup.appendChild(clearBtn);
		var exampleBtn = document.createElement('button');
		exampleBtn.type = 'button';
		exampleBtn.textContent = pc.lpn_tool_example || 'Draw example network';
		exampleBtn.addEventListener('click', drawExampleNetwork);
		fileGroup.appendChild(exampleBtn);
		wireBackdropMenu(fileGroup);

		var addGroup = group();
		[
			{ mode: 'add-reservoir', key: 'lpn_tool_add_reservoir' },
			{ mode: 'add-pump', key: 'lpn_tool_add_pump' },
			{ mode: 'add-junction', key: 'lpn_tool_add_junction' },
			{ mode: 'add-pipe', key: 'lpn_tool_add_pipe' },
			{ mode: 'add-text', key: 'lpn_tool_add_text' }
		].forEach(function (t) { modeButton(t, addGroup); });

		var editGroup = group();
		modeButton({ mode: 'select', key: 'lpn_tool_select', tip: pc.lpn_tip_select }, editGroup);
		modeButton({ mode: 'delete', key: 'lpn_tool_delete' }, editGroup);
		var undoBtn = document.createElement('button');
		undoBtn.type = 'button';
		undoBtn.textContent = pc.lpn_tool_undo || 'Undo';
		undoBtn.addEventListener('click', undo);
		editGroup.appendChild(undoBtn);

		var viewGroup = group();
		var extentBtn = document.createElement('button');
		extentBtn.type = 'button';
		extentBtn.textContent = pc.lpn_tool_zoom_extent || 'Zoom to fit';
		extentBtn.addEventListener('click', zoomExtent);
		viewGroup.appendChild(extentBtn);
		var labelsBtn = document.createElement('button');
		labelsBtn.type = 'button';
		labelsBtn.textContent = pc.lpn_tool_labels || 'Labels';
		if (pc.lpn_tip_labels_draggable) { labelsBtn.title = pc.lpn_tip_labels_draggable; labelsBtn.className = 'ec-help'; }
		labelsBtn.addEventListener('click', toggleLabelsPopup);
		viewGroup.appendChild(labelsBtn);
		var settingsBtn = document.createElement('button');
		settingsBtn.type = 'button';
		settingsBtn.textContent = pc.lpn_tool_settings || 'Settings';
		settingsBtn.addEventListener('click', toggleSettingsPopup);
		viewGroup.appendChild(settingsBtn);

		// Temporary dev-only stress-test button (Tom, 2026-07-30): visually set apart (its own
		// group, bracketed label) so it reads as not-a-real-feature. Remove once satisfied with
		// how ~100 links performs -- see drawTestGrid() below.
		var devGroup = group();
		var testBtn = document.createElement('button');
		testBtn.type = 'button';
		testBtn.textContent = '[dev] Draw large test network';
		testBtn.addEventListener('click', drawTestGrid);
		devGroup.appendChild(testBtn);
	}

	// One reservoir, one pump (a link, per the header comment above), one junction between
	// them, and a bent pipe to a second junction -- exercises a node, a fixed head, both
	// link types, and vertex editing in one click, per Tom's request. Confirms before
	// clobbering an existing network, and always leaves the toolbar back on Select --
	// otherwise whatever tool (e.g. Delete) was active before stays active after, which
	// reads as the example accidentally being deletable on the very next click.
	function drawExampleNetwork() {
		if (doc.nodes.length > 0) {
			var pc = EngCalcs.pageConfig || {};
			if (!window.confirm(pc.lpn_confirm_example || 'This adds the example to the network you already have. Continue?')) { return; }
		}
		saveUndoSnapshot();
		// The reservoir sits at 55 ft / 17 m, in among the junctions it feeds (50 ft and 40 ft)
		// rather than 50 ft above them (Tom, 2026-07-30). A source perched high above the network
		// makes the example a gravity system that would work with the pump deleted -- the pump's
		// contribution is invisible because the elevation is doing the work. Level with the network,
		// the pump is the only reason there is pressure anywhere, which is the point of including
		// one. Its head is left blank, so the water surface is the reservoir's own ground elevation.
		var r = addNode('reservoir', 0, 0);
		r.elev = niceDefault('lpn_u_elevhead', 'fth2o', 55, 17);
		var j1 = addNode('junction', 20, 0);
		j1.elev = niceDefault('lpn_u_elevhead', 'fth2o', 50, 15); j1._demand = 0;
		// The example's pump gets a curve explicitly, as document content the user can see and edit
		// in its popup -- addLink() no longer invents one (see its comment). Everything else in this
		// example is pre-filled the same way (elevations, demands, diameters), so a worked pump
		// curve belongs here rather than hiding inside every pump anyone ever draws.
		// THREE points, not one (Tom, 2026-07-30: "1-point is not very readable, and not good for
		// our Example even if it's legal"). A single design point is legal and is EPANET's own rule,
		// but it DERIVES the shutoff head and maximum flow from that one number, so the example
		// would again show a pump doing things the visible numbers don't explain. Three points is
		// how a manufacturer publishes a curve and how a user will read one off a datasheet: a
		// shutoff head at zero flow, a duty point, and a run-out point.
		var pump = addLink('pump', r.id, j1.id);
		pump.curvePoints = [
			[0, niceDefault('lpn_u_elevhead', 'fth2o', 90, 27)],
			[niceDefault('lpn_u_flow', 'gpm', 150, 0.010), niceDefault('lpn_u_elevhead', 'fth2o', 65, 20)],
			[niceDefault('lpn_u_flow', 'gpm', 300, 0.020), niceDefault('lpn_u_elevhead', 'fth2o', 20, 6)]
		];
		recomputePumpCurve(pump);
		var j2 = addNode('junction', 40, 15);
		j2.elev = niceDefault('lpn_u_elevhead', 'fth2o', 40, 12);
		j2._demand = niceDefault('lpn_u_flow', 'gpm', 100, 0.006);
		var pipe = addLink('pipe', j1.id, j2.id);
		pipe.verts.push({ x: 30, y: -5 });
		// addLink() computed .length before this vertex existed (straight node-to-node distance);
		// rebuildLink() only rebuilds the DOM, not the length -- recompute explicitly, or the
		// initial displayed length undercounts the bend until the vertex is next dragged (which
		// goes through updateVertex()/updateLinkGeometry(), where lenAuto recomputation already
		// happens correctly). Tom caught this: 25ft shown, jumped to 28ft only after a drag.
		pipe._length = linkGeomLength(pipe);
		rebuildLink(pipe);
		// Second, straight J1-J2 pipe (Tom, 2026-07-30): the bent pipe alone made this a tree/series
		// network with no cycle at all, despite being the example for a LOOPED network calculator --
		// two parallel paths between the same two nodes is the simplest genuine loop. A bend on this
		// one too (Tom's own suggested point) so the two parallel pipes visibly separate and meet
		// J1/J2 at closer to a right angle, instead of running the second pipe as a straight overlap.
		var pipe2 = addLink('pipe', j1.id, j2.id);
		pipe2.verts.push({ x: 27, y: 15 });
		pipe2._length = linkGeomLength(pipe2);
		rebuildLink(pipe2);
		updateEmptyHint();
		zoomExtent();
		setMode('select');
	}

	// Temporary dev-only stress-test generator (Tom, 2026-07-30: "see how this handles 100
	// links/pipes"). An 8x8 grid gives 64 nodes and 112 pipes with genuine loops on every interior
	// cell -- a realistic worst case for the 300ms debounced solve, unlike a tree which the
	// two-pass bpn_ solver would handle trivially. One corner is a reservoir (the solver's only
	// fixed-head boundary condition); every other node is a junction with a small demand. Remove
	// this function and its toolbar button once satisfied with how the debounce/solve holds up.
	function drawTestGrid() {
		if (doc.nodes.length > 0) {
			if (!window.confirm('This will add to the existing network. Continue?')) { return; }
		}
		saveUndoSnapshot();
		var SIZE = 8, SPACING = 20, grid = [], row, col, n, demand = niceDefault('lpn_u_flow', 'gpm', 5, 0.0003);
		for (row = 0; row < SIZE; row++) {
			grid.push([]);
			for (col = 0; col < SIZE; col++) {
				if (row === 0 && col === 0) {
					n = addNode('reservoir', 0, 0);
				} else {
					n = addNode('junction', col * SPACING, row * SPACING);
					n._demand = demand;
				}
				grid[row].push(n);
			}
		}
		for (row = 0; row < SIZE; row++) {
			for (col = 0; col < SIZE; col++) {
				if (col < SIZE - 1) { addLink('pipe', grid[row][col].id, grid[row][col + 1].id); }
				if (row < SIZE - 1) { addLink('pipe', grid[row][col].id, grid[row + 1][col].id); }
			}
		}
		updateEmptyHint();
		zoomExtent();
		setMode('select');
	}

	function wirePointerEvents() {
		svg.addEventListener('wheel', function (e) {
			e.preventDefault();
			zoomAbout(e.clientX, e.clientY, e.deltaY < 0 ? 1.1 : 1 / 1.1);
		}, { passive: false });

		// Corner coordinate tracker (Tom) -- PC-oriented (hover-driven); the popup's read-only
		// X/Y fields above are the touch equivalent, since touch has no hover to drive this.
		var coordsEl = document.getElementById('lpn_coords');
		if (coordsEl) {
			svg.addEventListener('pointermove', function (e) {
				var w = screenToWorld(e.clientX, e.clientY);
				coordsEl.textContent = 'X: ' + w.x.toFixed(2) + '  Y: ' + w.y.toFixed(2);
			});
		}
		// Rubber-band line while drawing a pipe/pump (Tom, 2026-07-30) -- tracks the live pointer
		// from the first-picked node (setPendingLinkFrom() shows/hides it); independent of the
		// coords-tracker listener above so it works even if #lpn_coords is ever removed.
		svg.addEventListener('pointermove', function (e) {
			if (!pendingLinkFrom) { return; }
			var from = nodeById(pendingLinkFrom), w = screenToWorld(e.clientX, e.clientY);
			if (!from) { return; }
			rubberBandEl.setAttribute('x1', from.x); rubberBandEl.setAttribute('y1', from.y);
			rubberBandEl.setAttribute('x2', w.x); rubberBandEl.setAttribute('y2', w.y);
		});

		svg.addEventListener('pointerdown', function (e) {
			if (regMode) { return; } // a Scale/Position registration click sequence is pending -- see wireBackdropMenu()
			svg.setPointerCapture(e.pointerId);
			pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
			if (pointers.size === 2) {
				var pts = Array.from(pointers.values());
				drag = { type: 'pinch', d0: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y), s0: state.s };
				return;
			}
			var t = resolveLabelHit(e.target), common = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY };
			if (mode.indexOf('add-') === 0) { return; } // handled on click below, not drag
			if (mode === 'delete') { return; }
			// 'select' mode
			if (t.dataset.node) {
				var n = nodeById(t.dataset.node), w0 = screenToWorld(e.clientX, e.clientY);
				drag = { type: 'node', id: t.dataset.node, offX: n.x - w0.x, offY: n.y - w0.y };
				Object.assign(drag, common);
			} else if (t.dataset.link !== undefined && t.classList.contains('lpn-vhandle')) {
				var v = linkById(t.dataset.link).verts[+t.dataset.vidx], w1 = screenToWorld(e.clientX, e.clientY);
				drag = { type: 'vertex', id: t.dataset.link, vidx: +t.dataset.vidx, offX: v.x - w1.x, offY: v.y - w1.y };
				Object.assign(drag, common);
			} else if (t.dataset.lbl !== undefined) {
				var lb = labelById(t.dataset.lbl), an = lb.anchorNode ? nodeById(lb.anchorNode) : { x: 0, y: 0 },
					w2 = screenToWorld(e.clientX, e.clientY);
				drag = { type: 'label', id: t.dataset.lbl, offX: (an.x + lb.x) - w2.x, offY: (an.y + lb.y) - w2.y };
				Object.assign(drag, common);
			} else if (t.dataset.nodelbl !== undefined) {
				// Task 146.01: dragging a node's OWN data label (id/elev/demand/... beside the
				// symbol), distinct from dragging the node itself (data-node, above) -- offset is
				// stored as n.lx/n.ly, world units from the node center, same convention as a Text
				// label's lb.x/lb.y offset from its anchor.
				var nn = nodeById(t.dataset.nodelbl), posN = nodeLabelPos(nn), w4 = screenToWorld(e.clientX, e.clientY);
				drag = { type: 'nodelbl', id: t.dataset.nodelbl, offX: posN.x - w4.x, offY: posN.y - w4.y };
				Object.assign(drag, common);
			} else if (t.dataset.linklbl !== undefined) {
				var ll = linkById(t.dataset.linklbl), posL = linkLabelPos(ll), w5 = screenToWorld(e.clientX, e.clientY);
				drag = { type: 'linklbl', id: t.dataset.linklbl, offX: posL.x - w5.x, offY: posL.y - w5.y };
				Object.assign(drag, common);
			} else {
				drag = { type: 'pan', tx0: state.tx, ty0: state.ty }; Object.assign(drag, common);
			}
		});
		svg.addEventListener('pointermove', function (e) {
			if (!pointers.has(e.pointerId)) { return; }
			pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
			if (drag) { dragDirty = true; }
		});
		function endPointer(e) {
			pointers.delete(e.pointerId);
			if (drag && drag.type === 'pinch' && pointers.size < 2) { drag = null; dragDirty = false; return; }
			if (drag && drag.pointerId === e.pointerId) { drag = null; dragDirty = false; }
		}
		svg.addEventListener('pointerup', endPointer);
		svg.addEventListener('pointercancel', endPointer);

		svg.addEventListener('dblclick', function (e) {
			// Cancel a pending "open the link popup" from the first tap (see below) -- otherwise
			// that popup opens right at the click point, covering it, so the second tap of this
			// same double-click lands on the popup instead of the canvas and this dblclick event
			// never fires at all. Tom caught this: double-click stopped adding vertices entirely.
			if (regMode) { return; } // otherwise two registration clicks landing on the same link also bend it
			if (pendingLinkPopupTimer) { clearTimeout(pendingLinkPopupTimer); pendingLinkPopupTimer = null; }
			var t = resolveLabelHit(document.elementFromPoint(e.clientX, e.clientY));
			if (!t || !t.dataset) { return; }
			// Double-click a dragged label to send it home (Tom, 2026-07-30: "Can we double-click a
			// dragged label to send it home without a leader?") -- clears the manual offset, so the
			// label falls back to its default position and the leader (which only shows past
			// LABEL_LEADER_THRESHOLD) disappears along with it.
			if (t.dataset.nodelbl !== undefined) { resetNodeLabelHome(t.dataset.nodelbl); }
			else if (t.dataset.linklbl !== undefined) { resetLinkLabelHome(t.dataset.linklbl); }
			else if (t.dataset.lbl !== undefined) { resetTextLabelHome(t.dataset.lbl); }
			else if (t.classList.contains('lpn-vhandle')) { removeVertex(t.dataset.link, +t.dataset.vidx); }
			else if (t.dataset.link !== undefined) { insertVertex(t.dataset.link, screenToWorld(e.clientX, e.clientY)); }
		});

		// Add-* and Delete tools act on a plain click (tap without drag), same threshold as
		// the spike's tap-vs-drag detection.
		var downPt = null;
		svg.addEventListener('pointerdown', function (e) { downPt = { x: e.clientX, y: e.clientY }; });
		svg.addEventListener('pointerup', function (e) {
			if (regMode) { downPt = null; return; } // a Scale/Position registration click sequence is pending
			if (!downPt || Math.hypot(e.clientX - downPt.x, e.clientY - downPt.y) >= 4) { downPt = null; return; }
			downPt = null;
			// elementFromPoint, not e.target: setPointerCapture(svg) retargets pointerup's
			// target to the capturing element (svg itself) on desktop Chrome, so e.target here
			// is never the actual node/link/label clicked -- see phase0-acceptance.md round 2.
			var w = screenToWorld(e.clientX, e.clientY), t = resolveLabelHit(document.elementFromPoint(e.clientX, e.clientY));
			// No zoomExtent() after placing an element (Tom): rescaling the whole view on every
			// click while building a network is disorienting. Zoom Extent stays an explicit,
			// user-requested action only.
			// Undo covers Add too, not just Delete (Tom) -- snapshot before every mutation so
			// "Undo" stays honest about what it does rather than needing a narrower name.
			if (mode === 'add-junction' || mode === 'add-reservoir') {
				// Snap-on-create: a click within NODE_SNAP_PX of an existing node reuses it instead
				// of creating a new, overlapping one -- see nearestNodeNearScreen()'s comment.
				if (!nearestNodeNearScreen(e.clientX, e.clientY, NODE_SNAP_PX)) {
					saveUndoSnapshot();
					addNode(mode === 'add-reservoir' ? 'reservoir' : 'junction', w.x, w.y);
				}
			}
			else if (mode === 'add-text') {
				saveUndoSnapshot();
				// Snap to a nearby node the same way add-pipe/add-pump do (Tom, 2026-07-30: "I
				// thought we programmed a leader for it if placed near a node... now it's gone" --
				// it turns out this creation-time snap was never actually wired up; the leader-
				// rendering machinery in buildLabelEls()/updateLabelGeometry() was already there and
				// ready, waiting on this). A tap within NODE_SNAP_PX anchors the new Text to that
				// node, so it drags with it and grows a leader; otherwise it's free-floating.
				var nearNode = nearestNodeNearScreen(e.clientX, e.clientY, NODE_SNAP_PX);
				addText(w.x, w.y, nearNode ? nearNode.id : null);
			}
			else if (mode === 'add-pipe' || mode === 'add-pump') {
				// Same snap: elementFromPoint requires landing exactly on the node's small hit
				// area, which a real tap on a real screen routinely misses by a few pixels -- that
				// miss is diagnostic #2's dominant cause ("a pipe drawn near a junction but not
				// snapped to it"). Falling back to the nearest node within screen-pixel tolerance
				// makes a close tap connect anyway.
				var hitId = t.dataset.node || (nearestNodeNearScreen(e.clientX, e.clientY, NODE_SNAP_PX) || {}).id;
				if (hitId) {
					if (!pendingLinkFrom) { setPendingLinkFrom(hitId); }
					else if (hitId !== pendingLinkFrom) {
						saveUndoSnapshot();
						addLink(mode === 'add-pump' ? 'pump' : 'pipe', pendingLinkFrom, hitId);
						setPendingLinkFrom(null);
					}
				} else { setPendingLinkFrom(null); }
			} else if (mode === 'delete') {
				// One-step undo (Tom: lost a pipe's data to an accidental delete) -- snapshot the
				// whole document just before any destructive action, not inside the delete
				// functions themselves, so a cascade (deleting a node also deletes its links)
				// captures one clean "before" state rather than a partial one.
				if (t.dataset.node) { saveUndoSnapshot(); deleteNode(t.dataset.node); }
				else if (t.classList.contains('lpn-vhandle')) { saveUndoSnapshot(); removeVertex(t.dataset.link, +t.dataset.vidx); }
				else if (t.dataset.link !== undefined) { saveUndoSnapshot(); deleteLink(t.dataset.link); }
				else if (t.dataset.lbl !== undefined) { saveUndoSnapshot(); deleteLabelById(t.dataset.lbl); }
			} else if (mode === 'select' && t.dataset.node) {
				openPopup(t.dataset.node, e.clientX, e.clientY);
			} else if (mode === 'select' && t.dataset.link !== undefined && !t.classList.contains('lpn-vhandle')) {
				// Delayed, not immediate: gives the native dblclick listener above a chance to
				// cancel this if a second tap arrives (add-a-vertex), matching the browser's own
				// double-click timing window. Clear any PRIOR pending timer first -- the second
				// tap of the double-click also lands here, and without this the first tap's timer
				// was silently orphaned (its reference overwritten) rather than cancelled, so it
				// fired anyway regardless of what dblclick cleared. Tom caught this too.
				if (pendingLinkPopupTimer) { clearTimeout(pendingLinkPopupTimer); }
				(function (linkId, sx, sy) {
					pendingLinkPopupTimer = setTimeout(function () {
						pendingLinkPopupTimer = null;
						openLinkPopup(linkId, sx, sy);
					}, 300);
				}(t.dataset.link, e.clientX, e.clientY));
			} else if (mode === 'select' && t.dataset.lbl !== undefined) {
				// Delayed, not immediate (Tom, 2026-07-30: double-click-to-reset a dragged label
				// stopped working -- the popup opened on the FIRST tap and ate the second one).
				// Same debounce as a link's own popup below.
				if (pendingLinkPopupTimer) { clearTimeout(pendingLinkPopupTimer); }
				(function (labelId, sx, sy) {
					pendingLinkPopupTimer = setTimeout(function () {
						pendingLinkPopupTimer = null;
						// Tom, 2026-07-30: "there is no way to edit it" -- a Text label could be
						// moved (drag) or deleted, but never have its content changed after creation.
						openLabelPopup(labelId, sx, sy);
					}, 300);
				}(t.dataset.lbl, e.clientX, e.clientY));
			} else if (mode === 'select' && t.dataset.nodelbl !== undefined) {
				// Delayed, not immediate -- same reason as the Text label case just above.
				if (pendingLinkPopupTimer) { clearTimeout(pendingLinkPopupTimer); }
				(function (nodeId, sx, sy) {
					pendingLinkPopupTimer = setTimeout(function () {
						pendingLinkPopupTimer = null;
						// Task 146.01: a click (not a drag) on a node's data label opens the same
						// popup as clicking the node itself -- the label IS that node's data, just
						// relocated.
						openPopup(nodeId, sx, sy);
					}, 300);
				}(t.dataset.nodelbl, e.clientX, e.clientY));
			} else if (mode === 'select' && t.dataset.linklbl !== undefined) {
				if (pendingLinkPopupTimer) { clearTimeout(pendingLinkPopupTimer); }
				(function (linkId, sx, sy) {
					pendingLinkPopupTimer = setTimeout(function () {
						pendingLinkPopupTimer = null;
						openLinkPopup(linkId, sx, sy);
					}, 300);
				}(t.dataset.linklbl, e.clientX, e.clientY));
			}
		});
	}

	function applyDrag() {
		if (drag.type === 'pinch') {
			if (pointers.size !== 2) { return; }
			var pts = Array.from(pointers.values());
			var d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
			var mx = (pts[0].x + pts[1].x) / 2, my = (pts[0].y + pts[1].y) / 2;
			zoomAbout(mx, my, (d / drag.d0) * drag.s0 / state.s);
			return;
		}
		var p = pointers.get(drag.pointerId);
		if (!p) { return; }
		if (drag.type === 'pan') {
			state.tx = drag.tx0 + (p.x - drag.startX); state.ty = drag.ty0 + (p.y - drag.startY);
			setTransform();
		} else if (drag.type === 'node') {
			var w = screenToWorld(p.x, p.y), n = nodeById(drag.id);
			n.x = w.x + drag.offX; n.y = w.y + drag.offY; updateNode(drag.id);
			relayoutLabels();
		} else if (drag.type === 'vertex') {
			var w2 = screenToWorld(p.x, p.y);
			linkById(drag.id).verts[drag.vidx] = { x: w2.x + drag.offX, y: w2.y + drag.offY };
			updateVertex(drag.id, drag.vidx);
			relayoutLabels();
		} else if (drag.type === 'label') {
			var w3 = screenToWorld(p.x, p.y), lb = labelById(drag.id), an = lb.anchorNode ? nodeById(lb.anchorNode) : { x: 0, y: 0 };
			if (lb.anchorNode) { lb.x = (w3.x + drag.offX) - an.x; lb.y = (w3.y + drag.offY) - an.y; }
			else { lb.x = w3.x + drag.offX; lb.y = w3.y + drag.offY; }
			updateLabelGeometry(drag.id);
			// Every label drag ends in relayoutLabels(), not just a layout of the one being dragged:
			// the label that moved is an obstacle to every other label (and so is the leader that
			// appears behind it), so the rest of the drawing has to settle around it live rather
			// than staying frozen until some unrelated edit happens to trigger a full refresh
			// (Tom, 2026-07-30).
			relayoutLabels();
			// Dragging a Text was never persisted either (same gap as addText() above, found the
			// same way) -- scheduleSolve() is a convenient existing debounce that reaches
			// saveToStorage() unconditionally, even though a Text has nothing to solve.
			scheduleSolve();
		} else if (drag.type === 'nodelbl') {
			var w6 = screenToWorld(p.x, p.y), nn2 = nodeById(drag.id);
			nn2.lx = (w6.x + drag.offX) - nn2.x; nn2.ly = (w6.y + drag.offY) - nn2.y;
			layoutNodeLabel(drag.id);
			relayoutLabels();
			scheduleSolve();
		} else if (drag.type === 'linklbl') {
			var w7 = screenToWorld(p.x, p.y), ll2 = linkById(drag.id), mid2 = linkLabelMid(ll2);
			ll2.lx = (w7.x + drag.offX) - mid2.x; ll2.ly = (w7.y + drag.offY) - mid2.y;
			layoutLinkLabel(drag.id);
			relayoutLabels();
			scheduleSolve();
		}
	}

	function tick() {
		if (drag && dragDirty) { applyDrag(); dragDirty = false; }
		requestAnimationFrame(tick);
	}

	// ---- units ----
	// Every stored value is SI (CLAUDE.md's schema rule) -- the units strip's <select> options
	// carry the "number of that unit per SI unit" factor directly as their `value` (the same
	// mechanism echoUnitSelect()/EngCalcs.setUnits() already use suite-wide), so reading it back
	// needs no separate JS-side unit table. Multiply SI by the factor to display; divide a typed
	// value by the factor to store it back as SI.
	// Looked up by element id, not by unit family: Length/Map and Elevation/Head both draw their
	// option list from a distance-flavored family (distance_site / total_head) but must stay
	// independently selectable (Tom, 2026-07-30) -- Length/Map is a declarative label with no
	// real conversion (see lengthField() below), Elevation/Head is a real SI-converted quantity,
	// and conflating them under one shared control was confusing once seen in practice.
	// x/y positions are deliberately NOT run through this at all: they're schematic map/canvas
	// coordinates with no established real-world scale until Task 145's backdrop registration.
	// By [name=], not getElementById: echoUnitSelect() (lib/Calculators.lib.php) emits name=
	// only, never id= -- these names double as the lookup key here.
	function unitEl(name) { return document.querySelector('select[name="' + name + '"]'); }
	function unitFactor(name) { var s = unitEl(name); return s ? parseFloat(s.value) : 1; }
	function unitLabel(name) { var s = unitEl(name); return s ? s.options[s.selectedIndex].textContent : ''; }
	function unitKey(name) { var s = unitEl(name); return s ? s.options[s.selectedIndex].dataset.unit : null; }
	// Suite-wide convention (CLAUDE.md's Unit Sets section): a default is Array('us'=>x,'si'=>y),
	// not one SI number that happens to convert to something ugly in the other system (Tom,
	// 2026-07-30 -- the example network's plain-SI elevations read as non-round once shown in
	// ft). usKey is the family's US unit ("in", "gpm", "fth2o", ...); usVal is a nice number IN
	// THAT UNIT; siVal is a separately-chosen nice number in SI. Reads the CURRENTLY selected
	// unit, not the page's original load-time default, so this stays correct even after the user
	// switches units mid-session.
	function niceDefault(unitId, usKey, usVal, siVal) {
		return unitKey(unitId) === usKey ? usVal / unitFactor(unitId) : siVal;
	}

	// ---- label toggle popover (Task 146 Phase 2) ----
	// Deliberately separate from #lpn_popup/currentPopup below: this is a static settings panel,
	// not a per-element property sheet, and touching none of the rename/undo machinery keeps it
	// zero-risk to the existing popup.
	// `decimals` (Task 189) is optional: pass {value, onChange} to put a 0-4 spinner on this field's
	// row, or omit it for a non-numeric field (ID) that has nothing to round. The spinner sits on the
	// SAME row as the checkbox because decimal places are a property of that one field -- the Labels
	// popover is already the per-field row list, which is why this lives here and not in Settings
	// (page-wide preferences).
	function labelCheckbox(container, labelText, color, checked, onChange, decimals) {
		var label = document.createElement('label'), input = document.createElement('input'),
			span = document.createElement('span');
		input.type = 'checkbox'; input.checked = checked;
		input.addEventListener('change', function () { onChange(input.checked); saveToStorage(); refreshLabelText(); });
		span.style.color = color;
		span.textContent = labelText;
		label.appendChild(input);
		label.appendChild(document.createTextNode(' '));
		label.appendChild(span);
		container.appendChild(label);
		if (decimals) {
			var pc = EngCalcs.pageConfig || {}, dec = document.createElement('input');
			// Upper bound 32, not a defensible-looking 4 (Tom, 2026-07-30): "possibly some absurd limit
			// like 32 instead of a debatable limit like 4." A limit low enough to argue about is a
			// limit someone will hit and resent; one nobody will ever reach needs no argument. 32 is
			// safely inside toFixed()'s own 0-100 range and comfortably past the ~17 significant digits
			// a double actually carries, so the only thing beyond ~15 decimals is float noise -- which
			// is the user's business, not ours to forbid. Zero stays the floor: negative decimals have
			// no meaning here (rounding to tens would be a different feature).
			dec.type = 'number'; dec.min = '0'; dec.max = '32'; dec.step = '1';
			dec.value = decimals.value;
			// .ec-spin restores the native up/down arrows, which css/engcalcs.css strips suite-wide --
			// see that file's comment: right for a physical quantity, wrong for a small bounded integer
			// like this one, where clicking the arrows is the natural gesture. Width allows for them.
			dec.className = 'ec-spin';
			dec.style.width = '4.5em'; dec.style.marginLeft = '6px';
			dec.title = pc.lpn_labels_decimals_tip || 'Decimal places shown for this label';
			dec.addEventListener('change', function () {
				// Clamped rather than rejected: a spinner held down runs past its own max, and silently
				// snapping back to the nearest legal value reads better than an alert for a field where
				// every out-of-range value has an obvious intended meaning.
				var v = Math.round(+dec.value);
				if (!isFinite(v)) { v = decimals.value; }
				v = Math.max(0, Math.min(32, v));
				dec.value = v;
				decimals.onChange(v);
				saveToStorage();
				refreshLabelText();
			});
			container.appendChild(dec);
		}
		container.appendChild(document.createElement('br'));
	}
	// Shared with renderLabelsLegend() below -- one place naming which fields exist and what their
	// checkbox/legend text says, so the popover and the legend can never drift out of sync.
	// Order (Tom, 2026-07-30, thinking physically): ID, Demand, Head, Pressure, Elevation -- matches
	// the same reordering in refreshLabelText()'s node loop above, so the checkbox list, the
	// on-map label, and the legend all agree.
	function nodeFieldDefs(pc) {
		return [
			['id', pc.lpn_field_id || 'ID'], ['demand', pc.bpn_demand || 'Demand'],
			['head', pc.lpn_result_head || 'Head'], ['pressure', pc.lpn_result_pressure || 'Pressure'],
			['elev', pc.lpn_field_elev || 'Elevation']
		];
	}
	function linkFieldDefs(pc) {
		return [
			['id', pc.lpn_field_id || 'ID'], ['diameter', pc.lpn_field_diameter || 'Diameter'],
			['length', pc.lpn_field_length || 'Length'],
			// The two new inputs sit with the other inputs (after Length, before the solved
			// results), rather than appended at the end -- inputs-then-results is the order the
			// existing list already follows, and Tom left the placement open ("do something and we
			// can change later"), so this follows the pattern already there.
			['roughness', pc.lpn_field_roughness || 'Roughness'], ['km', pc.lpn_field_km_short || 'Minor loss, k'],
			['flow', pc.lpn_result_flow || 'Flow'],
			['velocity', pc.lpn_result_velocity || 'Velocity'], ['headloss', pc.lpn_result_headloss || 'Head loss'],
			['gradient', pc.lpn_result_gradient || 'Head loss gradient']
		];
	}
	// Extracted from wireLabelsPopup() (Tom, 2026-07-30: "Restore defaults" button) so the checkbox
	// list can be rebuilt in place after labelSettings is reset, without re-wiring the close button.
	function rebuildLabelsFields() {
		var pc = EngCalcs.pageConfig || {}, nodeBox = document.getElementById('lpn_labels_node_fields'),
			linkBox = document.getElementById('lpn_labels_link_fields'),
			optBox = document.getElementById('lpn_labels_options');
		nodeBox.innerHTML = ''; linkBox.innerHTML = '';
		// A field gets a decimals spinner exactly when labelSettings.decimals carries an entry for it
		// -- that map is the one place naming which fields are numeric, so ID (and any future
		// non-numeric field) is skipped without a second list to keep in sync.
		function decimalsFor(group, key) {
			var map = labelSettings.decimals[group];
			if (typeof map[key] !== 'number') { return null; }
			return { value: map[key], onChange: function (v) { map[key] = v; } };
		}
		nodeFieldDefs(pc).forEach(function (f) {
			labelCheckbox(nodeBox, f[1], lpnFieldColors[f[0]], labelSettings.node[f[0]],
				function (v) { labelSettings.node[f[0]] = v; }, decimalsFor('node', f[0]));
		});
		linkFieldDefs(pc).forEach(function (f) {
			labelCheckbox(linkBox, f[1], lpnFieldColors[f[0]], labelSettings.link[f[0]],
				function (v) { labelSettings.link[f[0]] = v; }, decimalsFor('link', f[0]));
		});
		// Task 190's toggle: one row, no color swatch and no decimals, sitting below both field lists
		// because it applies to every field at once rather than to any one row.
		if (optBox) {
			optBox.innerHTML = '';
			labelCheckbox(optBox, pc.lpn_labels_mark_extrema || 'Mark highest and lowest values', 'inherit',
				labelSettings.markExtrema, function (v) { labelSettings.markExtrema = v; });
		}
	}
	function wireLabelsPopup() {
		document.getElementById('lpn_labels_popup_close').addEventListener('click', function () {
			document.getElementById('lpn_labels_popup').style.display = 'none';
		});
		rebuildLabelsFields();
	}
	// A color key that survives printing (Tom, 2026-07-30): the Labels popover itself is toolbar
	// chrome (d-print-none), so a legend that only lived there would vanish on a printed page --
	// this renders into #lpn_labels_legend, which is NOT d-print-none, and is kept live by being
	// called from refreshLabelText() (every toggle change, solve, and unit switch already calls
	// that). Hidden entirely when no field is toggled on, so it costs nothing by default.
	function renderLabelsLegend() {
		var box = document.getElementById('lpn_labels_legend'); if (!box) { return; }
		var pc = EngCalcs.pageConfig || {}, any = false;
		box.innerHTML = '';
		// One field per line (Tom, 2026-07-30: the original horizontal row read poorly) -- matches
		// the vertical, upper-right-corner overlay this now renders into.
		// Nodes/Links headings, the same two the Labels popover already carries (Tom, 2026-07-30) --
		// without them the legend is one undifferentiated color list, and several field names (ID,
		// Head, Flow/Demand) read plausibly as either kind of element. The heading is only emitted
		// when that group actually has a visible field, so a nodes-only or links-only legend does
		// not grow a lone heading over nothing.
		function addGroup(defs, fieldSettings, headingText) {
			var shown = defs.filter(function (f) { return fieldSettings[f[0]]; });
			if (shown.length === 0) { return; }
			any = true;
			var h = document.createElement('div');
			h.style.fontWeight = 'bold';
			h.textContent = headingText;
			box.appendChild(h);
			shown.forEach(function (f) {
				var div = document.createElement('div');
				div.style.color = lpnFieldColors[f[0]];
				div.textContent = f[1];
				box.appendChild(div);
			});
		}
		addGroup(nodeFieldDefs(pc), labelSettings.node, pc.lpn_labels_heading_node || 'Node labels');
		addGroup(linkFieldDefs(pc), labelSettings.link, pc.lpn_labels_heading_link || 'Link labels');
		box.style.display = any ? '' : 'none';
		applyLegendPosition();
	}
	function toggleLabelsPopup(evt) {
		var popup = document.getElementById('lpn_labels_popup');
		if (popup.style.display === 'block') { popup.style.display = 'none'; return; }
		var r = evt.currentTarget.getBoundingClientRect();
		popup.style.left = r.left + 'px'; popup.style.top = r.bottom + 'px'; popup.style.display = 'block';
		// Clamp into the viewport same as openPopupAt() -- measured after display:block since size
		// is unknown while display:none.
		var pr = popup.getBoundingClientRect();
		popup.style.left = Math.max(4, Math.min(r.left, window.innerWidth - pr.width - 4)) + 'px';
		popup.style.top = Math.max(4, Math.min(r.bottom, window.innerHeight - pr.height - 4)) + 'px';
	}

	// ---- gear/settings popover (Task 146 Phase 2, 2026-07-30) ----
	// Deliberately separate from #lpn_popup/currentPopup, same reasoning as the Labels popover above:
	// a static settings panel, not a per-element property sheet.
	// Six positions: Tom's own framing is {top, middle, bottom} x {left, right}, not an 8-way compass
	// rose -- a stacked legend block has no meaningful top-center/bottom-center variant. Style deltas
	// only (top/bottom/left/right/transform); applyLegendPosition() below clears the unused axis on
	// each call so switching, say, top-right to bottom-left doesn't leave a stale `top` alongside the
	// new `bottom`.
	var LEGEND_POSITIONS = {
		'top-left': { top: '4px', bottom: '', left: '4px', right: '', transform: '' },
		'top-right': { top: '4px', bottom: '', left: '', right: '4px', transform: '' },
		'middle-left': { top: '50%', bottom: '', left: '4px', right: '', transform: 'translateY(-50%)' },
		'middle-right': { top: '50%', bottom: '', left: '', right: '4px', transform: 'translateY(-50%)' },
		'bottom-left': { top: '', bottom: '4px', left: '4px', right: '', transform: '' },
		'bottom-right': { top: '', bottom: '4px', left: '', right: '4px', transform: '' }
	};
	// Map height (settings panel): the page is scrollable, so a user working on a large monitor
	// can size the map view up toward the full screen instead of the original fixed 500px.
	// The map is never allowed to fill the screen (Tom, 2026-07-31, on a phone: "a phone can get
	// stuck on the canvas when it fills the screen... I recovered safely by reloading the page").
	// #lpn_canvas carries `touch-action: none` so the app can own pan/zoom gestures -- which means
	// every touch that lands on the canvas is swallowed and CANNOT scroll the page. With a canvas
	// taller than the viewport there is then no reachable page left to touch, and the only way out
	// is a reload. Capping the rendered height guarantees a strip of ordinary page is always within
	// reach, which is the invariant that actually prevents the trap; a scroll affordance or a
	// two-finger-pan rule would each be a bigger change to reach the same place.
	// settings.mapHeight keeps the user's UNCLAMPED number -- this is a render-time cap, so a 900px
	// map set on a desktop is not permanently rewritten by one visit on a phone.
	function effectiveMapHeight() {
		var room = Math.max(240, Math.round((window.innerHeight || 800) * 0.72));
		return Math.min(settings.mapHeight, room);
	}
	function applyMapHeight() {
		if (svg) { svg.setAttribute('height', effectiveMapHeight()); }
	}
	function applyLegendPosition() {
		var box = document.getElementById('lpn_labels_legend'); if (!box) { return; }
		var pos = LEGEND_POSITIONS[settings.legendPosition] || LEGEND_POSITIONS['top-right'];
		box.style.top = pos.top; box.style.bottom = pos.bottom;
		box.style.left = pos.left; box.style.right = pos.right;
		box.style.transform = pos.transform;
	}
	// Re-applies the current effectiveFontSize() to every already-built text element and reflows
	// whatever depends on it (multi-line spacing, extrema ticks, a Text label's own width/leader) --
	// needed both when the user edits Text size/units directly (settings.textSize/textSizeUnits
	// changed) and, in 'screen' mode only, whenever state.s changes (zoomAbout()/zoomExtent() call
	// onZoomChanged() below), since 'screen' mode's effective size is state.s-dependent while every
	// other geometry in this file is left to the SVG's own scale transform.
	function refreshFontSizes() {
		var fs = effectiveFontSize() + 'px';
		Object.keys(nodeEls).forEach(function (id) { nodeEls[id].text.style.fontSize = fs; });
		Object.keys(linkEls).forEach(function (id) { linkEls[id].text.style.fontSize = fs; });
		Object.keys(labelEls).forEach(function (id) {
			var le = labelEls[id], lb = labelById(id);
			le.text.style.fontSize = effectiveFontSize(lb && lb.sizeMult) + 'px';
			try { le.width = le.text.getBBox().width; } catch (err) { /* pre-layout measurement can throw; stale width stands */ }
			updateLabelGeometry(id);
		});
		refreshSymbolSizes(); // symbols are sized relative to the text, so they follow it everywhere it changes
		refreshLabelText(); // recomputes multi-line tspan dy spacing and extrema tick positions at the new size
	}
	// Cheap no-op in 'map' mode (the default): map-mode text scales for free via the SVG's own
	// world-to-screen transform, exactly like the network geometry, so there is nothing to redo on
	// zoom. Called from zoomAbout()/zoomExtent() below.
	function onZoomChanged() {
		if (settings.textSizeUnits === 'screen') { refreshFontSizes(); }
	}
	// ID-prefix validation, same illegal-character set as validateNewId() (no spaces/quotes) plus
	// non-empty -- a prefix becomes the leading substring of every future auto-generated ID for that
	// element type, so the same rules that keep a renamed ID EPANET-legal apply here too.
	function validatePrefix(p) { return !!p && !/[\s'"]/.test(p); }
	// Extracted from wireSettingsPopup() (Tom, 2026-07-30: "Restore defaults" button) so the field
	// list can be rebuilt in place, showing the reset values, without re-wiring the close button.
	// The panel outgrew a flat list once every input got a default (Tom, 2026-07-30), so it is now
	// three collapsible sections plus a short always-visible tail.
	// ACCORDION, NOT TABS: this is a narrow floating panel over a map, on a page used on phones.
	// Tabs need horizontal room they do not have, truncate their labels when they do not get it,
	// force a "which tab opens first" decision, and show only one group at a time. Sections stack
	// vertically, work at any width, degrade to a plain scrolling list, and let two be open at once.
	// Open/closed state lives in settings.sectionsOpen, so it survives both this rebuild and the
	// session -- a user who lives in Default inputs is not re-opening it every time.
	// ORDER is Tom's: the three groups first, then the uncollapsed rows, then Reset. The tail rows
	// deliberately carry NO heading of their own rather than sitting under an "Other" that alone
	// cannot collapse -- a heading that behaves unlike every other heading in the panel misrepresents
	// the affordance. The old "Solver" heading is gone with them: km was never a solver setting (it
	// is a default input) and tolerance was the only genuine one.
	function rebuildSettingsFields() {
		var pc = EngCalcs.pageConfig || {}, fields = document.getElementById('lpn_settings_fields');
		clearFields(fields);
		function row(target, labelText, input, tip) {
			var label = document.createElement('label');
			setFieldLabel(label, labelText, tip);
			label.appendChild(input);
			target.appendChild(label);
			target.appendChild(document.createElement('br'));
		}
		function note(target, text) {
			var p = document.createElement('div');
			p.style.cssText = 'font-size:0.85em;opacity:0.75;margin:2px 0 4px';
			p.textContent = text;
			target.appendChild(p);
		}
		function section(key, titleText) {
			var head = document.createElement('button'), body = document.createElement('div');
			// A real <button>, not a styled <div>: keyboard focus and Enter/Space activation come
			// free, and the browser's own chrome is removed rather than re-implemented.
			head.type = 'button';
			head.style.cssText = 'display:block;width:100%;text-align:left;background:none;border:0;padding:0;margin-top:6px;font:inherit;font-weight:bold;cursor:pointer';
			body.style.marginLeft = '8px';
			function apply() {
				var open = !!settings.sectionsOpen[key];
				body.style.display = open ? 'block' : 'none';
				// The CLOSED glyph is direction-bearing and wants an RTL mirror (U+25C2) when Task
				// 146.06 translates this page; the open one (U+25BE) points down and is safe as is.
				head.textContent = (open ? '▾ ' : '▸ ') + titleText;
				head.setAttribute('aria-expanded', open ? 'true' : 'false');
			}
			head.addEventListener('click', function () {
				settings.sectionsOpen[key] = !settings.sectionsOpen[key];
				apply();
				saveToStorage();
			});
			apply();
			fields.appendChild(head);
			fields.appendChild(body);
			return body;
		}
		// Trailing zeros stripped rather than the popup's fixed toFixed(4): a default is a round
		// number the user typed ("8", "150"), and showing it back as 8.0000 makes the panel look
		// like a readout of a computed value instead of the field they set.
		function trimNum(v) { return String(+v.toFixed(6)); }
		// Unit-bearing rows show and accept the CURRENT display unit and store SI, the same
		// convention unitNumberField() uses in the element popup -- but with NO scheduleSolve():
		// changing a default alters nothing that already exists, so there is nothing to re-solve.
		// EngCalcs.pageCalculator re-runs this whole rebuild on a unit switch, so these rows can
		// never sit showing a number in a unit the strip has since changed away from.
		// unitId null means dimensionless (roughness, K) -- no factor, no unit in the label.
		function defaultRow(target, labelText, unitId, key, isValid) {
			var f = unitId ? unitFactor(unitId) : 1, input = document.createElement('input');
			input.type = 'number'; input.step = 'any';
			input.value = trimNum(settings.defaults[key] * f);
			input.addEventListener('change', function () {
				var v = +input.value;
				if (input.value !== '' && isFinite(v) && isValid(v)) { settings.defaults[key] = v / f; saveToStorage(); }
				else { input.value = trimNum(settings.defaults[key] * f); }
			});
			row(target, unitId ? labelText + ' (' + unitLabel(unitId) + ')' : labelText, input);
		}
		function any() { return true; }
		function positive(v) { return v > 0; }
		function nonNegative(v) { return v >= 0; }
		// ---- 1. ID prefixes ----
		var idBody = section('idPrefixes', pc.lpn_settings_id_prefixes || 'ID prefixes');
		// Reuses the existing Add-tool labels (Junction/Reservoir/Pipe/Pump) per CLAUDE.md's
		// concept-level label reuse rule -- these already name the element type, no new key needed.
		// TEXT ('T') IS DELIBERATELY ABSENT (Tom, 2026-07-30, asking "User never sees Text ID... is
		// this future-proof or YAGNI?"). Verified: openLabelPopup() renders Text/Size/X/Y with no ID
		// field, text elements are not in the Labels popover's ID checkbox (node/link only), and no
		// report lists them -- a text element's ID is unreachable from every screen in the app. So
		// the row was not merely unused but VISIBLY inert: four rows here do something and a fifth
		// did nothing, with no way to tell which from looking. settings.idPrefixes.T and nextId.T
		// both stay -- IDs must still be generated and unique -- so this removes the control, not
		// the concept. Restore the row (one array entry) if Task 146.05's element browser ever
		// lists text elements the way EPANET's own Browser does.
		[
			['R', pc.lpn_tool_add_reservoir || 'Reservoir'], ['J', pc.lpn_tool_add_junction || 'Junction'],
			['P', pc.lpn_tool_add_pump || 'Pump'], ['L', pc.lpn_tool_add_pipe || 'Pipe']
		].forEach(function (f) {
			var key = f[0], input = document.createElement('input');
			input.type = 'text'; input.size = 4; input.value = settings.idPrefixes[key];
			input.addEventListener('change', function () {
				if (!validatePrefix(input.value)) { alert(pc.lpn_id_invalid || 'Enter an ID with no spaces and no quotation marks.'); input.value = settings.idPrefixes[key]; return; }
				settings.idPrefixes[key] = input.value;
				saveToStorage();
			});
			row(idBody, f[1], input);
		});
		// ---- 2. Default inputs ----
		// Starts EXPANDED (see settings.sectionsOpen): the other two sections are set-once, but this
		// one is a mode the user re-enters mid-drawing ("OK, now all the 8 inch pipes").
		var defBody = section('defaults', pc.lpn_settings_defaults || 'Default inputs');
		// Stated ONCE for the whole section rather than implied per row -- the "future, not
		// retroactive" rule used to govern two controls and now governs five.
		note(defBody, pc.lpn_settings_defaults_note || 'Used for elements you create from now on. Existing elements are not changed.');
		// One elevation for BOTH junctions and reservoirs (Tom, 2026-07-30). A reservoir's head is
		// absent by design and follows this elevation -- see reservoirHead() and addNode().
		defaultRow(defBody, pc.lpn_field_elev || 'Elevation', 'lpn_u_elevhead', 'nodeElev', any);
		// bpn_demand, not an lpn_ key of its own -- CLAUDE.md's concept-level label reuse rule, and
		// the same borrow the junction popup and the Labels panel already make for this concept.
		defaultRow(defBody, pc.bpn_demand || 'Demand', 'lpn_u_flow', 'demand', any);
		defaultRow(defBody, pc.lpn_field_diameter || 'Diameter', 'lpn_u_diameter', 'diameter', positive);
		// Roughness and K are dimensionless, so no unit factor and no unit in the label -- same
		// reasoning as refreshLabelText()'s plainRound() treatment of these two fields.
		defaultRow(defBody, pc.lpn_field_roughness || 'Roughness', null, 'roughness', positive);
		// No Length row, deliberately (Tom, 2026-07-30): lenAuto derives a pipe's length from the
		// drawn geometry, so any default here would be overwritten the moment the pipe is drawn.
		defaultRow(defBody, pc.lpn_field_km || 'Minor (local) loss coefficient, k', null, 'k', nonNegative);
		// ---- push defaults to existing elements (Tom, 2026-07-30) ----
		// A HARD push, deliberately. The gentler "update only elements still holding the OLD
		// default" was designed and then rejected: it cannot tell a deliberately-typed 6 from an
		// untouched 6, so it is not non-destructive, it is SILENTLY destructive -- worse than an
		// overwrite you watched happen. And in the case it exists for (Tom's "draw it all up, then
		// think about numbers" crowd -- really an oops recovery) every element still holds the old
		// default anyway, so it would degenerate into a hard push with extra machinery.
		// SCOPED BY THE DISPLAYED LABELS, in Tom's words "only the displayed values will be pushed":
		// the Labels panel is already a per-property checkbox list and is already on screen, so the
		// user's own current view defines the blast radius and this tool needs no property picker of
		// its own. That same mechanism is wanted by ROADMAP Task 185 (Match/Copy) and Task 184's
		// push-to-scenarios, which is why it is worth reusing rather than inventing a third picker.
		// Result fields (flow, velocity, pressure, head loss, gradient) have no default at all, so
		// the effective filter is "displayed INTERSECT has-a-default".
		// WHEN TASK 184 LANDS this must stay a Base-level action: run inside a scenario it would
		// mint an override on every element at once, which is never what anyone means by it.
		var pushSpecs = [
			// `applies` is what keeps the push physical rather than blindly per-field: a reservoir
			// has no demand, and a pump has no diameter/roughness/km, so neither is counted or touched.
			{ key: 'nodeElev', group: 'node', field: 'elev', label: pc.lpn_field_elev || 'Elevation',
				applies: function () { return true; }, get: function (n) { return n.elev; }, set: function (n, v) { n.elev = v; } },
			{ key: 'demand', group: 'node', field: 'demand', label: pc.bpn_demand || 'Demand',
				applies: function (n) { return n.type !== 'reservoir'; }, get: function (n) { return effective(n, 'demand'); }, set: function (n, v) { n._demand = v; } },
			{ key: 'diameter', group: 'link', field: 'diameter', label: pc.lpn_field_diameter || 'Diameter',
				applies: function (l) { return l.type !== 'pump'; }, get: function (l) { return effective(l, 'diameter'); }, set: function (l, v) { l._diameter = v; } },
			{ key: 'roughness', group: 'link', field: 'roughness', label: pc.lpn_field_roughness || 'Roughness',
				applies: function (l) { return l.type !== 'pump'; }, get: function (l) { return effective(l, 'roughness'); }, set: function (l, v) { l._roughness = v; } },
			{ key: 'k', group: 'link', field: 'km', label: pc.lpn_field_km || 'Minor (local) loss coefficient, k',
				applies: function (l) { return l.type !== 'pump'; }, get: function (l) { return effective(l, 'k'); }, set: function (l, v) { l._k = v; } }
		];
		note(defBody, pc.lpn_settings_push_note || 'Only the properties whose labels are showing right now are applied.');
		var pushBtn = document.createElement('button');
		pushBtn.type = 'button';
		pushBtn.textContent = pc.lpn_settings_push_btn || 'Apply defaults to all elements';
		pushBtn.addEventListener('click', function () {
			var active = pushSpecs.filter(function (s) { return labelSettings[s.group][s.field]; });
			// An empty intersection SAYS SO rather than silently doing nothing: with no input labels
			// displayed this button would otherwise look broken, and the reason is off-screen in
			// another panel. Naming that panel is the whole value of the message.
			if (!active.length) {
				alert(pc.lpn_push_none_displayed || 'No default input is showing as a label right now, so there is nothing to apply. Turn on the labels for the properties you want in the Labels panel, then try again.');
				return;
			}
			// TWO different counts, because "nothing to do" has two different causes and they need
			// different messages (Tom, 2026-07-30 -- "no count if no change because already at that
			// value"). `carriers` is how many elements the properties even apply to; `targets` is
			// how many would ACTUALLY change. Reporting carriers would overstate the action --
			// "Elements: 40" when 38 already hold the value reads as a much bigger swing than it is,
			// and after a push the same button would still offer to change 40 things.
			// Exact === is the right comparison, not an epsilon: a value that came from this default
			// was assigned from this same number, so it is bit-identical. An epsilon here would
			// instead start silently skipping elements a user had deliberately set very close by.
			function counts(list, group) {
				var carriers = 0, changing = 0;
				list.forEach(function (el) {
					var applied = false, differs = false;
					active.forEach(function (s) {
						if (s.group !== group || !s.applies(el)) { return; }
						applied = true;
						if (s.get(el) !== settings.defaults[s.key]) { differs = true; }
					});
					if (applied) { carriers++; }
					if (differs) { changing++; }
				});
				return { carriers: carriers, changing: changing };
			}
			var nodeCounts = counts(doc.nodes, 'node'), linkCounts = counts(doc.links, 'link');
			var carriers = nodeCounts.carriers + linkCounts.carriers;
			var targets = nodeCounts.changing + linkCounts.changing;
			if (!carriers) { alert(pc.lpn_push_nothing || 'No existing element has any of the properties being applied.'); return; }
			// Distinct from the message above on purpose: "nothing carries these properties" and
			// "everything already has these values" are opposite situations, and telling a user the
			// first when the second is true would send them hunting for a problem that isn't there.
			if (!targets) { alert(pc.lpn_push_no_change || 'Every element already has these values, so nothing would change.'); return; }
			// The confirm NAMES the properties, it does not merely count them -- a count alone
			// ("push 2 properties?") leaves the user guessing which two, and this action is not
			// something to guess at. Assembled from already-translated label text plus two short
			// heading keys, with no plural agreement anywhere: "Elements: 17" needs no plural rule,
			// while "17 pipes and 5 junctions" would need one in every target language.
			var msg = (pc.lpn_push_confirm || 'Replace these properties on every existing element with the current default inputs? Values you have typed will be overwritten. You can undo this.')
				+ '\n\n' + (pc.lpn_push_properties || 'Properties:') + ' ' + active.map(function (s) { return s.label; }).join(', ')
				+ '\n' + (pc.lpn_push_elements || 'Elements:') + ' ' + targets;
			if (!window.confirm(msg)) { return; }
			saveUndoSnapshot();
			doc.nodes.forEach(function (n) {
				active.forEach(function (s) { if (s.group === 'node' && s.applies(n)) { s.set(n, settings.defaults[s.key]); } });
			});
			doc.links.forEach(function (l) {
				active.forEach(function (s) { if (s.group === 'link' && s.applies(l)) { s.set(l, settings.defaults[s.key]); } });
			});
			// refreshPopupIfOpen() because an open element popup is now showing stale numbers for
			// the very element that just changed under it.
			refreshPopupIfOpen();
			refreshLabelText();
			scheduleSolve();
			saveToStorage();
		});
		defBody.appendChild(pushBtn);
		defBody.appendChild(document.createElement('br'));
		// ---- 3. Map display ----
		// "Display" rather than Tom's first "Map sizes": the section also holds symbol and backdrop
		// opacity, which are not sizes, and stranding those two in a group of their own would be
		// more clicking than it saves.
		var mapBody = section('mapDisplay', pc.lpn_settings_map_display || 'Map display and sizes');
		var sizeInput = document.createElement('input');
		sizeInput.type = 'number'; sizeInput.step = 'any'; sizeInput.min = '0.1'; sizeInput.value = settings.textSize;
		sizeInput.addEventListener('change', function () {
			if (+sizeInput.value > 0) { settings.textSize = +sizeInput.value; refreshFontSizes(); saveToStorage(); }
			else { sizeInput.value = settings.textSize; }
		});
		row(mapBody, pc.lpn_settings_text_size || 'Text size', sizeInput);
		var unitsSelect = document.createElement('select');
		[
			['map', pc.lpn_settings_text_size_map || 'Map units'],
			['screen', pc.lpn_settings_text_size_screen || 'Screen pixels']
		].forEach(function (o) {
			var opt = document.createElement('option');
			opt.value = o[0]; opt.textContent = o[1]; if (o[0] === settings.textSizeUnits) { opt.selected = true; }
			unitsSelect.appendChild(opt);
		});
		unitsSelect.addEventListener('change', function () {
			settings.textSizeUnits = unitsSelect.value;
			refreshFontSizes();
			saveToStorage();
		});
		row(mapBody, pc.lpn_settings_text_size_units || 'Text size units', unitsSelect);
		// Symbol size rides on the text-size block on purpose: it is expressed as a multiple of the
		// text size and inherits its map-vs-screen units, so it belongs beside it rather than
		// looking like an independent size system with its own units selector.
		var symInput = document.createElement('input');
		symInput.type = 'number'; symInput.step = 'any'; symInput.min = '0.1'; symInput.value = settings.symbolScale;
		symInput.addEventListener('change', function () {
			if (+symInput.value > 0) { settings.symbolScale = +symInput.value; refreshSymbolSizes(); relayoutLabels(); saveToStorage(); }
			else { symInput.value = settings.symbolScale; }
		});
		row(mapBody, pc.lpn_settings_symbol_size || 'Symbol size (relative to text)', symInput);
		var opacityInput = document.createElement('input');
		opacityInput.type = 'number'; opacityInput.step = '0.05'; opacityInput.min = '0.05'; opacityInput.max = '1';
		opacityInput.value = settings.symbolOpacity;
		opacityInput.addEventListener('change', function () {
			var v = +opacityInput.value;
			if (v > 0 && v <= 1) { settings.symbolOpacity = v; refreshSymbolSizes(); saveToStorage(); }
			else { opacityInput.value = settings.symbolOpacity; }
		});
		row(mapBody, pc.lpn_settings_symbol_opacity || 'Symbol opacity (0 to 1)', opacityInput);
		var backdropOpacityInput = document.createElement('input');
		backdropOpacityInput.type = 'number'; backdropOpacityInput.step = '0.05';
		backdropOpacityInput.min = '0.05'; backdropOpacityInput.max = '1';
		backdropOpacityInput.value = settings.backdropOpacity;
		backdropOpacityInput.addEventListener('change', function () {
			var v = +backdropOpacityInput.value;
			if (v > 0 && v <= 1) { settings.backdropOpacity = v; refreshSymbolSizes(); saveToStorage(); }
			else { backdropOpacityInput.value = settings.backdropOpacity; }
		});
		row(mapBody, pc.lpn_settings_backdrop_opacity || 'Background image opacity (0 to 1)', backdropOpacityInput);
		var heightInput = document.createElement('input');
		heightInput.type = 'number'; heightInput.step = 'any'; heightInput.min = '100'; heightInput.value = settings.mapHeight;
		heightInput.addEventListener('change', function () {
			if (+heightInput.value >= 100) { settings.mapHeight = +heightInput.value; applyMapHeight(); saveToStorage(); }
			else { heightInput.value = settings.mapHeight; }
		});
		row(mapBody, pc.lpn_settings_map_height_px || 'Map height (screen pixels)', heightInput,
			pc.lpn_settings_map_height_tip);
		var legendSelect = document.createElement('select');
		[
			['top-left', pc.lpn_settings_legend_top_left || 'Top left'],
			['top-right', pc.lpn_settings_legend_top_right || 'Top right'],
			['middle-left', pc.lpn_settings_legend_middle_left || 'Middle left'],
			['middle-right', pc.lpn_settings_legend_middle_right || 'Middle right'],
			['bottom-left', pc.lpn_settings_legend_bottom_left || 'Bottom left'],
			['bottom-right', pc.lpn_settings_legend_bottom_right || 'Bottom right']
		].forEach(function (o) {
			var opt = document.createElement('option');
			opt.value = o[0]; opt.textContent = o[1]; if (o[0] === settings.legendPosition) { opt.selected = true; }
			legendSelect.appendChild(opt);
		});
		legendSelect.addEventListener('change', function () {
			settings.legendPosition = legendSelect.value;
			applyLegendPosition();
			saveToStorage();
		});
		// Legend position lives INSIDE Map display (Tom, 2026-07-30), not loose above it: it is a
		// map-display property by any plain reading, and it is a set-once choice -- which is the
		// weakest case there is for promoting a row out of its section. The earlier "fiddled with
		// often" justification for keeping it loose did not survive contact with the section it
		// obviously belongs to.
		row(mapBody, pc.lpn_settings_legend_position || 'Legend position', legendSelect);
		// ---- always visible: the one row worth never burying ----
		// Tolerance, because it is the one setting that changes whether the answer is right.
		// Headingless, per the note above.
		var tail = document.createElement('div');
		tail.style.marginTop = '6px';
		fields.appendChild(tail);
		// "Emitter exponent" was REMOVED from this panel 2026-07-30 (Tom asked "Do we have emitters?
		// Do we do something with this?" -- the honest answer was no). js/lpn-solver.js implements
		// emitters properly (qe = K*dH^n, with the matching Jacobian term and a guarded derivative at
		// dH -> 0), but nothing in this app ever sets a junction's `emitter`, so the > 0 test never
		// passes and the exponent adjusted nothing. It was also the most technical-looking control
		// here -- the one a user is most likely to assume matters. settings.emitterExponent itself
		// STAYS (assembleModel() passes it, and it is the value the feature will use); only the
		// no-op control is gone. Restore this row when ROADMAP Task 191 lands -- the language key
		// lpn_settings_emitter_exponent is deliberately left in lib/lang.ec.en.php for that.
		var tolInput = document.createElement('input');
		tolInput.type = 'number'; tolInput.step = 'any'; tolInput.value = settings.tolerance;
		tolInput.addEventListener('change', function () {
			if (+tolInput.value > 0) { settings.tolerance = +tolInput.value; scheduleSolve(); }
			else { tolInput.value = settings.tolerance; }
		});
		row(tail, pc.lpn_settings_tolerance || 'Convergence tolerance', tolInput, pc.lpn_settings_tolerance_tip);
		// ---- restore defaults (Tom, 2026-07-30) ----
		// Resets settings/labelSettings only -- the network (nodes/links/labels) and backdrop are
		// untouched, same "preferences vs. content" split clearNetwork()'s own comment documents.
		var restoreBtn = document.createElement('button');
		restoreBtn.type = 'button';
		restoreBtn.textContent = pc.lpn_settings_restore_btn || 'Restore all settings';
		helpTip(restoreBtn, pc.lpn_settings_restore_tip);
		restoreBtn.addEventListener('click', function () {
			if (!window.confirm(pc.lpn_confirm_restore_defaults || 'Reset all settings (ID prefixes, default inputs, solver settings, map display, legend position, and visible labels) to their defaults? Your network is not changed. Settings belong to the open project, so your other projects keep their own.')) { return; }
			settings = defaultSettings();
			// defaultSettings() leaves settings.defaults full of nulls on purpose -- refill them
			// here, or every default input would come back blank instead of at its starting value.
			seedDefaultInputs();
			labelSettings = defaultLabelSettings();
			applyMapHeight();
			applyLegendPosition();
			refreshFontSizes();
			renderLabelsLegend();
			rebuildSettingsFields();
			rebuildLabelsFields();
			saveToStorage();
		});
		tail.appendChild(restoreBtn);
		// "Wipe memory" (Tom, 2026-07-30, temporary): the full reset above the URL-param path
		// already does, exposed as a button for convenience while this page is a preview. Unlike
		// Restore defaults, this also deletes the network and backdrop -- confirm text says so.
		var wipeBtn = document.createElement('button');
		wipeBtn.type = 'button';
		wipeBtn.style.marginLeft = '4px';
		wipeBtn.textContent = pc.lpn_settings_wipe_btn || 'Clear calculator';
		helpTip(wipeBtn, pc.lpn_reset_all_tip);
		wipeBtn.addEventListener('click', function () {
			if (!window.confirm(pc.lpn_confirm_wipe || 'Delete EVERYTHING saved for this page — every project, every background image, all settings, and your unit choices — and reload the page as a brand-new visitor would see it? This cannot be undone.')) { return; }
			wipeAllStorage();
			window.location.reload();
		});
		tail.appendChild(wipeBtn);
		tipsIn(fields);
	}
	function wireSettingsPopup() {
		document.getElementById('lpn_settings_popup_close').addEventListener('click', function () {
			document.getElementById('lpn_settings_popup').style.display = 'none';
		});
		rebuildSettingsFields();
	}
	function toggleSettingsPopup(evt) {
		var popup = document.getElementById('lpn_settings_popup');
		if (popup.style.display === 'block') { popup.style.display = 'none'; return; }
		var r = evt.currentTarget.getBoundingClientRect();
		popup.style.left = r.left + 'px'; popup.style.top = r.bottom + 'px'; popup.style.display = 'block';
		var pr = popup.getBoundingClientRect();
		popup.style.left = Math.max(4, Math.min(r.left, window.innerWidth - pr.width - 4)) + 'px';
		popup.style.top = Math.max(4, Math.min(r.bottom, window.innerHeight - pr.height - 4)) + 'px';
	}

	// ---- minimal property popup ----
	// Real, not a stub: id (readonly) plus the fields that already exist on the element
	// (Elevation+Demand for a junction, Fixed head for a reservoir, Diameter+Roughness+Length
	// for a pipe). Pump curve entry isn't implemented -- see the scope doc's design note.
	var currentPopup = null; // {kind:'node'|'link', id} -- lets a unit-strip change refresh the open popup in place
	function closePopup() {
		document.getElementById('lpn_popup').style.display = 'none';
		currentPopup = null;
	}
	function wirePopup() {
		document.getElementById('lpn_popup_close').addEventListener('click', closePopup);
	}
	// ---- field labels, with an optional definitional tip (Task 193) ----
	// CLAUDE.md's tip-only convention: .ec-help carries the title and wraps the label WORDS plus a
	// nested .ec-tip "?" glyph, so the tap target is the whole name rather than one character. The
	// tip is where a trap term (head, roughness, demand) gets its definition -- visible to the user
	// AND, because it is translated with the label, an anchor for the 26-language sprint.
	// These labels are built long after DOMContentLoaded, so js/Calculators.lib.js's page-load pass
	// cannot see them; initTips() has to be called on the container afterwards. See setFieldLabel's
	// callers, each of which ends with tipsIn(fields).
	function setFieldLabel(label, text, tip) {
		if (!tip) { label.textContent = text + ' '; return; }
		var help = document.createElement('span'), glyph = document.createElement('span');
		help.className = 'ec-help'; help.title = tip;
		help.appendChild(document.createTextNode(text + ' '));
		glyph.className = 'ec-tip'; glyph.textContent = '?';
		help.appendChild(glyph);
		label.textContent = '';
		label.appendChild(help);
		label.appendChild(document.createTextNode(' '));
	}
	function tipsIn(root) {
		if (EngCalcs && EngCalcs.initTips) { EngCalcs.initTips(root); }
	}
	// Hover/tap tip straight on a button: the button is already the click target, so no separate
	// "?" glyph -- .ec-help is what makes the title reachable on touch (js/Calculators.lib.js only
	// wires tap-triggered tooltips on .ec-help[title]).
	//
	// The three reset controls -- Clear project (toolbar), Restore all settings and Delete all
	// projects (Settings panel) -- get THREE tips, not one shared one. The first version shared a
	// single key saying they had to be "used together" to reach a first-time-visitor state. That
	// was FALSE, and Tom caught it (2026-07-31): settings live INSIDE each project document
	// (serializeProject()), so deleting every project deletes every setting too. Delete all
	// projects alone IS the full reset -- exactly what init()'s own comment already said, "strictly
	// more destructive than New/Clear (content only) or Restore defaults (preferences only)".
	// Three scoped tips cannot be wrong about each other; one shared tip had to describe all three
	// and got it wrong. Cheaper key economy is not worth a false statement.
	function helpTip(btn, text) {
		if (!text) { return; }
		btn.title = text;
		btn.className = (btn.className ? btn.className + ' ' : '') + 'ec-help';
	}
	// Popups re-render in place (refreshPopupIfOpen), which throws away the elements Bootstrap
	// attached tooltip instances to. A tooltip that is OPEN at that moment lives in document.body,
	// not in the popup, so wiping innerHTML would strand it on screen with nothing to close it.
	// Dispose first, then clear.
	function clearFields(fields) {
		if (window.bootstrap && bootstrap.Tooltip) {
			Array.prototype.forEach.call(fields.querySelectorAll('.ec-help'), function (el) {
				var t = bootstrap.Tooltip.getInstance(el);
				if (t) { t.dispose(); }
			});
		}
		fields.innerHTML = '';
	}
	function unitNumberField(fields, labelText, unitId, getSI, setSI, tip) {
		var f = unitFactor(unitId), label = document.createElement('label'), input = document.createElement('input');
		input.type = 'number'; input.value = (getSI() * f).toFixed(4);
		// scheduleSolve() here, not just inside setSI callbacks, centralizes it for every current
		// and future use of this helper (elev/demand/head's setSI already also calls updateNode(),
		// which itself schedules a solve -- calling it twice is harmless, debounced).
		input.addEventListener('change', function () { setSI(+input.value / f); scheduleSolve(); });
		setFieldLabel(label, labelText + ' (' + unitLabel(unitId) + ')', tip);
		label.appendChild(input);
		fields.appendChild(label);
		fields.appendChild(document.createElement('br'));
	}
	// Same as unitNumberField(), but the value may be BLANK, meaning "follow whatever this field
	// defaults to" -- currently a reservoir's head following its elevation (Tom, 2026-07-30).
	// placeholderSI is that fallback, shown greyed in the empty box so the field never looks like it
	// is missing a number; clearing the box stores undefined, which is what re-links the two.
	function unitNumberFieldBlank(fields, labelText, unitId, getSI, setSI, placeholderSI, tip) {
		var f = unitFactor(unitId), label = document.createElement('label'), input = document.createElement('input'),
			v = getSI();
		input.type = 'number';
		input.value = (v === undefined || v === null || v === '') ? '' : (v * f).toFixed(4);
		input.placeholder = (placeholderSI * f).toFixed(4);
		input.addEventListener('change', function () {
			setSI(input.value === '' ? undefined : +input.value / f);
			scheduleSolve();
		});
		setFieldLabel(label, labelText + ' (' + unitLabel(unitId) + ')', tip);
		label.appendChild(input);
		fields.appendChild(label);
		fields.appendChild(document.createElement('br'));
	}
	// Read-only, like EPANET's own property-form coordinate display (Tom) -- also doubles as
	// the touch answer to "show coordinates of the selected element": the corner tracker
	// below is hover-driven (PC only), but this field is visible in the popup on any device.
	function readonlyField(fields, labelText, value, tip) {
		var label = document.createElement('label'), span = document.createElement('span');
		span.textContent = typeof value === 'number' ? value.toFixed(2) : value;
		setFieldLabel(label, labelText, tip);
		label.appendChild(span);
		fields.appendChild(label);
		fields.appendChild(document.createElement('br'));
	}
	// SI value -> current display unit, read-only. Used for solve results: the property popups
	// are the canonical results location (Tom, 2026-07-30) -- Map labels and a Report/table view
	// are later presentation layers over this same computed data (scope doc Phase 2), not a
	// separate source of truth.
	function readonlyUnitField(fields, labelText, unitId, siValue, tip) {
		readonlyField(fields, labelText + ' (' + unitLabel(unitId) + ')', siValue * unitFactor(unitId), tip);
	}
	// Length pairs with an Auto checkbox (the lenAuto design logged in the scope doc): typing a
	// value takes manual control; re-checking Auto snaps back to the live geometric distance.
	// Auto and manual get IDENTICAL treatment (Tom, 2026-07-30) -- no SI conversion for length at
	// all, in either mode. Canvas/grid units are declared, AutoCAD-style: the distance_site
	// selector's current unit is just the LABEL for what a grid unit means, not a multiplier: 1
	// grid unit IS 1 ft or 1 m, whichever is currently selected, by declaration. This is
	// different from Elevation/Demand/Head/Diameter, which are independently-typed real
	// quantities with genuine SI storage -- length is tied to drawn geometry, so it isn't.
	function lengthField(fields, l) {
		var pc = EngCalcs.pageConfig || {}, label = document.createElement('label'),
			input = document.createElement('input'), autoLabel = document.createElement('label'),
			auto = document.createElement('input');
		input.type = 'number'; input.value = effective(l, 'length').toFixed(2);
		input.addEventListener('change', function () { l._length = +input.value; l.lenAuto = false; auto.checked = false; scheduleSolve(); });
		auto.type = 'checkbox'; auto.checked = l.lenAuto;
		auto.addEventListener('change', function () {
			l.lenAuto = auto.checked;
			if (l.lenAuto) { l._length = linkGeomLength(l); input.value = effective(l, 'length').toFixed(2); }
			scheduleSolve();
		});
		setFieldLabel(label, (pc.lpn_field_length || 'Length') + ' (' + unitLabel('lpn_u_length') + ')',
			pc.lpn_field_length_tip);
		label.appendChild(input);
		autoLabel.appendChild(auto);
		autoLabel.appendChild(document.createTextNode(' ' + (pc.lpn_field_auto || 'Auto')));
		fields.appendChild(label); fields.appendChild(autoLabel);
		fields.appendChild(document.createElement('br'));
	}
	// World -> screen, the inverse of screenToWorld() above. Both are client (viewport) coordinates,
	// which is what a position:fixed popup wants.
	function worldToScreen(wx, wy) {
		var r = svg.getBoundingClientRect();
		return { x: r.left + state.tx + wx * state.s, y: r.top + state.ty + wy * state.s };
	}
	// Where an element's property popup opens (Tom, 2026-07-30). NOT at the click point: on an
	// orthogonal network -- which is most real ones -- a popup centred on the element covers the
	// elements directly north and south of it, which are exactly the ones you are usually comparing
	// it against. Instead it opens off to the RIGHT of that element's own data label, just past
	// where its extrema glyph would sit, plus about a node across ("roughly a node size to the right
	// of the extrema location" -- Tom's own measure). The popup then sits in the horizontal gap
	// beside the element rather than on top of its neighbours, and its position still reads as
	// belonging to the element because it lines up with that element's label.
	// Falls back to the click point when the element has no rendered label to hang off.
	function popupAnchorFor(holder, labelPos, gapUnits, fallbackX, fallbackY) {
		if (!holder || labelPos === null) { return { x: fallbackX, y: fallbackY }; }
		var tf = textFactor(), fs = effectiveFontSize();
		var x = labelPos.x + (holder.tw || 0) + (TICK_GAP + TICK_LENGTH) * tf + gapUnits;
		var y = labelPos.y - fs * 0.85;
		return worldToScreen(x, y);
	}
	function openPopupAt(sx, sy) {
		var popup = document.getElementById('lpn_popup'), r;
		popup.style.left = sx + 'px'; popup.style.top = sy + 'px'; popup.style.display = 'block';
		// Clamp into the viewport (Tom, tall/phone mode: the popup opened partly off-screen).
		// Measured after display:block since an element's size isn't known while display:none.
		r = popup.getBoundingClientRect();
		popup.style.left = Math.max(4, Math.min(sx, window.innerWidth - r.width - 4)) + 'px';
		popup.style.top = Math.max(4, Math.min(sy, window.innerHeight - r.height - 4)) + 'px';
		EngCalcs.initTips(popup);
	}
	// ---- rename (Tom: EPANET allows editing an element's ID, so must this) ----
	function allIds() {
		return doc.nodes.map(function (x) { return x.id; })
			.concat(doc.links.map(function (x) { return x.id; }))
			.concat(doc.labels.map(function (x) { return x.id; }));
	}
	function validateNewId(newId, oldId) {
		var pc = EngCalcs.pageConfig || {};
		if (newId === oldId) { return true; }
		if (!newId || /[\s'"]/.test(newId)) { return pc.lpn_id_invalid || 'Enter an ID with no spaces and no quotation marks.'; }
		if (allIds().indexOf(newId) !== -1) { return pc.lpn_id_taken || 'That ID is already in use.'; }
		return true;
	}
	// A text input in place of the static title -- shared by both popups since the validation/
	// cascading-reference-update logic (below) only differs in which maps get re-keyed.
	function idField(currentId, onRename) {
		var title = document.getElementById('lpn_popup_title'), input = document.createElement('input');
		title.textContent = '';
		input.type = 'text'; input.value = currentId;
		input.addEventListener('change', function () {
			var newId = input.value, result = validateNewId(newId, currentId);
			if (result !== true) { alert(result); input.value = currentId; return; }
			if (newId !== currentId) { saveUndoSnapshot(); onRename(newId); }
		});
		title.appendChild(input);
	}
	function renameNode(oldId, newId) {
		var n = nodeById(oldId), i;
		n.id = newId;
		nodeEls[newId] = nodeEls[oldId]; delete nodeEls[oldId];
		incidentLinks[newId] = incidentLinks[oldId]; delete incidentLinks[oldId];
		labelsByAnchor[newId] = labelsByAnchor[oldId]; delete labelsByAnchor[oldId];
		nodeEls[newId].circle.setAttribute('data-node', newId);
		doc.links.forEach(function (l) {
			if (l.from === oldId) { l.from = newId; }
			if (l.to === oldId) { l.to = newId; }
		});
		doc.labels.forEach(function (lb) { if (lb.anchorNode === oldId) { lb.anchorNode = newId; } });
		currentPopup = { kind: 'node', id: newId };
		renderNodeFields(newId);
		// lastSolveResult's pressures are keyed by the OLD id -- without a fresh solve, the
		// pressure label would silently vanish for this node until the next unrelated edit.
		scheduleSolve();
	}
	function renameLink(oldId, newId) {
		var l = linkById(oldId);
		l.id = newId;
		// Any OTHER pump referencing this one by curveRef must follow the rename, or its curve
		// silently reverts to nothing (resolveCurvePoints() only matches an exact id).
		doc.links.forEach(function (other) { if (other.curveRef === oldId) { other.curveRef = newId; } });
		linkEls[newId] = linkEls[oldId]; delete linkEls[oldId];
		linkEls[newId].line.setAttribute('data-link', newId);
		linkEls[newId].handles.forEach(function (h) { h.setAttribute('data-link', newId); });
		currentPopup = { kind: 'link', id: newId };
		renderLinkFields(newId);
		scheduleSolve();
	}
	function renderNodeFields(nodeId) {
		var n = nodeById(nodeId), fields = document.getElementById('lpn_popup_fields'), pc = EngCalcs.pageConfig || {};
		idField(n.id, function (newId) { renameNode(nodeId, newId); });
		clearFields(fields);
		if (n.type === 'reservoir') {
			unitNumberField(fields, pc.lpn_field_elev || 'Elevation', 'lpn_u_elevhead',
				function () { return n.elev; },
				function (v) { n.elev = v; updateNode(nodeId); refreshPopupIfOpen(); },
				pc.lpn_field_elev_tip);
			// Blank = follow the elevation, which is also what the placeholder shows -- so the field
			// reads as already filled in with the elevation without pretending the user typed it.
			// Clearing it hands the head back to the elevation; this is the tank/reservoir switch.
			// Both setters re-render the popup: each of the two fields feeds the other's display --
			// the elevation is the head's placeholder, and the pressure row below is the difference
			// between them. That row is computed straight from the document (not from a solve
			// result), so it can and should be right the moment either number is committed.
			unitNumberFieldBlank(fields, pc.lpn_field_head || 'Head', 'lpn_u_elevhead',
				function () { return effective(n, 'head'); },
				function (v) { n._head = v; updateNode(nodeId); refreshPopupIfOpen(); },
				n.elev || 0, pc.lpn_field_head_tip);
			// No read-only Head row here (a junction gets one because its head is a solve RESULT) --
			// the editable field above already shows this reservoir's head, typed or inherited.
			readonlyUnitField(fields, pc.lpn_result_pressure || 'Pressure', 'lpn_u_pressure', reservoirHead(n) - (n.elev || 0));
		} else {
			unitNumberField(fields, pc.lpn_field_elev || 'Elevation', 'lpn_u_elevhead',
				function () { return n.elev; }, function (v) { n.elev = v; updateNode(nodeId); },
				pc.lpn_field_elev_tip);
			// Label borrowed from bpn_demand (concept-level reuse), but the TIP is lpn_'s own:
			// bpn_demand_tip says "at this line's downstream end", which is branched-network
			// wording and false here, where a demand sits on a node.
			unitNumberField(fields, pc.bpn_demand || 'Demand', 'lpn_u_flow',
				function () { return effective(n, 'demand'); }, function (v) { n._demand = v; updateNode(nodeId); },
				pc.lpn_demand_tip);
			if (lastSolveResult && lastSolveResult.pressures[nodeId] !== undefined) {
				readonlyUnitField(fields, pc.lpn_result_head || 'Head', 'lpn_u_elevhead', lastSolveResult.heads[nodeId],
					pc.lpn_result_head_tip);
				readonlyUnitField(fields, pc.lpn_result_pressure || 'Pressure', 'lpn_u_pressure', lastSolveResult.pressures[nodeId]);
			}
		}
		readonlyField(fields, pc.lpn_field_x || 'X', n.x);
		readonlyField(fields, pc.lpn_field_y || 'Y', n.y);
		tipsIn(fields);
	}
	function openPopup(nodeId, sx, sy) {
		var n = nodeById(nodeId), ne = nodeEls[nodeId];
		currentPopup = { kind: 'node', id: nodeId };
		renderNodeFields(nodeId);
		var at = popupAnchorFor(ne, n ? nodeLabelPos(n) : null, nodeRadius(n) * 2, sx, sy);
		openPopupAt(at.x, at.y);
	}
	// Pump curve entry (Task 146, 2026-07-30): up to 3 [Q,H] points, or a reference to another
	// pump's curve. Point 1 is required (a pump needs at least a design point); 2 and 3 are
	// optional and refine the fit toward EPANET's 2- and 3-point forms -- see
	// EngCalcs.lpnPumpFromCurve()'s own comment for exactly what each point count produces.
	function renderPumpCurveFields(fields, l, linkId) {
		var pc = EngCalcs.pageConfig || {};
		var refLabel = document.createElement('label'), refSelect = document.createElement('select');
		refLabel.textContent = (pc.lpn_pump_curve_source || 'Curve') + ' ';
		var ownOpt = document.createElement('option');
		ownOpt.value = ''; ownOpt.textContent = pc.lpn_pump_curve_own || 'Enter points below';
		refSelect.appendChild(ownOpt);
		doc.links.forEach(function (other) {
			if (other.type !== 'pump' || other.id === l.id) { return; }
			var o = document.createElement('option');
			o.value = other.id; o.textContent = other.id;
			if (l.curveRef === other.id) { o.selected = true; }
			refSelect.appendChild(o);
		});
		refSelect.addEventListener('change', function () {
			saveUndoSnapshot();
			l.curveRef = refSelect.value || null;
			recomputeAllPumpCurves();
			scheduleSolve();
			renderLinkFields(linkId); // rebuild: show/hide point rows, refresh the read-only result
		});
		refLabel.appendChild(refSelect);
		fields.appendChild(refLabel);
		fields.appendChild(document.createElement('br'));

		if (l.curveRef) {
			var note = document.createElement('div');
			// {id} placeholder, not concatenation (Task 193): a language that puts the pump ID
			// before the verb, or wraps it in its own punctuation, cannot express that as a
			// prefix + ID + '.' sandwich. Same convention as mpf_solver_no_solution's {qmax}.
			note.textContent = (pc.lpn_pump_curve_ref_note || 'Using the curve entered for pump {id}.')
				.replace('{id}', l.curveRef);
			fields.appendChild(note);
			return;
		}

		if (!l.curvePoints || l.curvePoints.length === 0) { l.curvePoints = [[undefined, undefined]]; }
		var pointLabels = [
			pc.lpn_pump_point1 || 'Point 1 (required)',
			pc.lpn_pump_point2 || 'Point 2 (optional)',
			pc.lpn_pump_point3 || 'Point 3 (optional)'
		];
		var qf = unitFactor('lpn_u_flow'), hf = unitFactor('lpn_u_elevhead');
		// A real <table> with real column headings (Tom, 2026-07-30) -- the point rows were two
		// unlabelled number boxes whose only clue as to which was which lived in a title= tooltip,
		// invisible on touch. Flow first, then head, matching both the [Q,H] storage order and the
		// way a manufacturer's curve is read (a head AT a flow).
		var table = document.createElement('table'), thead = document.createElement('thead'),
			hrow = document.createElement('tr'), tbody = document.createElement('tbody');
		table.className = 'lpn-curve-table';
		[ '', (pc.lpn_result_flow || 'Flow') + ' (' + unitLabel('lpn_u_flow') + ')',
			(pc.lpn_result_head || 'Head') + ' (' + unitLabel('lpn_u_elevhead') + ')' ].forEach(function (t) {
			var th = document.createElement('th');
			th.textContent = t;
			hrow.appendChild(th);
		});
		thead.appendChild(hrow); table.appendChild(thead); table.appendChild(tbody);
		fields.appendChild(table);
		// One line pointing at the "Pump curve" note on the page, rather than the equation and its
		// three fitting cases inline: this popup floats over the map and has to stay readable on a
		// phone (Tom, 2026-07-30, weighing the two placements). See lpn_notes_5_def.
		var curveNote = document.createElement('div');
		curveNote.style.fontSize = '0.9em';
		curveNote.textContent = pc.lpn_pump_curve_note || 'One, two, or three points — see "Pump curve" in the Notes below.';
		fields.appendChild(curveNote);
		var pi;
		for (pi = 0; pi < 3; pi++) {
			(function (pi) {
				var pt = l.curvePoints[pi] || [undefined, undefined];
				var row = document.createElement('tr'), labCell = document.createElement('th'),
					qCell = document.createElement('td'), hCell = document.createElement('td'),
					lab = document.createElement('span'),
					qInput = document.createElement('input'), hInput = document.createElement('input');
				lab.textContent = pointLabels[pi];
				qInput.type = 'number'; qInput.step = 'any'; qInput.size = 6;
				qInput.value = pt[0] !== undefined ? (pt[0] * qf).toFixed(4) : '';
				hInput.type = 'number'; hInput.step = 'any'; hInput.size = 6;
				hInput.value = pt[1] !== undefined ? (pt[1] * hf).toFixed(4) : '';
				function commit() {
					var qv = qInput.value === '' ? undefined : (+qInput.value / qf),
						hv = hInput.value === '' ? undefined : (+hInput.value / hf);
					saveUndoSnapshot();
					// Both fields or neither -- a lone Q or lone H is not a point the curve fit can use.
					l.curvePoints[pi] = (qv !== undefined && hv !== undefined) ? [qv, hv] : undefined;
					l.curvePoints = l.curvePoints.filter(function (x) { return x; });
					recomputeAllPumpCurves();
					scheduleSolve();
				}
				qInput.addEventListener('change', commit);
				hInput.addEventListener('change', commit);
				labCell.appendChild(lab); qCell.appendChild(qInput); hCell.appendChild(hInput);
				row.appendChild(labCell); row.appendChild(qCell); row.appendChild(hCell);
				tbody.appendChild(row);
			})(pi);
		}
	}
	function renderLinkFields(linkId) {
		var l = linkById(linkId), fields = document.getElementById('lpn_popup_fields'), pc = EngCalcs.pageConfig || {};
		idField(l.id, function (newId) { renameLink(linkId, newId); });
		clearFields(fields);
		if (l.type === 'pump') {
			renderPumpCurveFields(fields, l, linkId);
		} else {
			unitNumberField(fields, pc.lpn_field_diameter || 'Diameter', 'lpn_u_diameter',
				function () { return effective(l, 'diameter'); }, function (v) { l._diameter = v; });
			numberFieldPlain(fields, pc.lpn_field_roughness || 'Roughness', effective(l, 'roughness'),
				function (v) { l._roughness = v; }, pc.lpn_field_roughness_tip);
			// Minor (local) loss coefficient, k_m -- dimensionless, so no unit conversion (same as
			// Roughness above). Defaults from settings.defaults.k at creation (addLink()); editable
			// per-pipe here, same pattern as every other pipe property. Plain-text wording only
			// (no <sub> markup) -- this popup's fields are built via textContent, and the suite's
			// existing "k<sub>m</sub>" label (mphl_total_junction_k) is HTML-bearing, incompatible
			// with that call site; CLAUDE.md's concept-level reuse rule is about wording, not
			// forcing markup into a plain-text slot.
			numberFieldPlain(fields, pc.lpn_field_km || 'Minor (local) loss coefficient, k', effective(l, 'k') || 0,
				function (v) { l._k = v; }, pc.lpn_field_km_tip);
			lengthField(fields, l);
		}
		if (lastSolveResult && lastSolveResult.flows[linkId] !== undefined) {
			readonlyUnitField(fields, pc.lpn_result_flow || 'Flow', 'lpn_u_flow', lastSolveResult.flows[linkId]);
			// A pump has no diameter (Tom, 2026-07-30: "how can a pump have a velocity if it has no
			// diameter?") -- js/lpn-solver.js can only compute velocity = Q/area from a real
			// diameter, so a pump's stored velocity is always the fallback 0, which reads as "no
			// flow" and is actively misleading. Velocity is a pipe-only result.
			if (l.type !== 'pump') {
				readonlyUnitField(fields, pc.lpn_result_velocity || 'Velocity', 'lpn_u_velocity', lastSolveResult.velocities[linkId]);
			}
			// Head loss, for a pump too: lpn-solver.js reports a pump's contribution as a NEGATIVE
			// head loss, which is the whole of how a head gain is expressed on this page.
			readonlyUnitField(fields, pc.lpn_result_headloss || 'Head loss', 'lpn_u_elevhead', lastSolveResult.headlosses[linkId]);
			// Gradient is per unit of pipe LENGTH, so it is a pipe-only result -- a pump has no
			// length to spread its head over.
			if (l.type !== 'pump' && effective(l, 'length')) {
				readonlyUnitField(fields, pc.lpn_result_gradient || 'Head loss gradient', 'lpn_u_gradient',
					lastSolveResult.headlosses[linkId] / effective(l, 'length'), pc.lpn_result_gradient_tip);
			}
		}
		tipsIn(fields);
	}
	function openLinkPopup(linkId, sx, sy) {
		var l = linkById(linkId), le = linkEls[linkId];
		currentPopup = { kind: 'link', id: linkId };
		renderLinkFields(linkId);
		// A link has no radius of its own; a junction's is the right "one node across" measure, and
		// keeps the offset consistent between the two popup kinds.
		var at = popupAnchorFor(le, l ? linkLabelPos(l) : null, nodeRadius({ type: 'junction' }) * 2, sx, sy);
		openPopupAt(at.x, at.y);
	}
	// Editable text content for a Text label (Tom, 2026-07-30: "there is no way to edit it") -- no
	// idField()/rename here, unlike node/link popups; a Text's id has no user-facing meaning to
	// rename. Reuses pc.lpn_tool_add_text ("Text") for both the popup title and the field label,
	// per CLAUDE.md's concept-level label reuse rule, rather than adding a near-duplicate key.
	function renderLabelFields(labelId) {
		var lb = labelById(labelId), fields = document.getElementById('lpn_popup_fields'),
			pc = EngCalcs.pageConfig || {}, title = document.getElementById('lpn_popup_title'),
			label = document.createElement('label'), input = document.createElement('input'),
			an = lb.anchorNode ? nodeById(lb.anchorNode) : null;
		title.textContent = pc.lpn_tool_add_text || 'Text';
		clearFields(fields);
		input.type = 'text'; input.value = lb.text;
		input.addEventListener('change', function () {
			if (input.value === lb.text) { return; }
			saveUndoSnapshot();
			lb.text = input.value;
			var le = labelEls[labelId];
			le.text.textContent = lb.text;
			try { le.width = le.text.getBBox().width; } catch (err) { /* pre-layout measurement can throw; stale width stands */ }
			updateLabelGeometry(labelId);
			saveToStorage();
		});
		label.textContent = (pc.lpn_tool_add_text || 'Text') + ' ';
		label.appendChild(input);
		fields.appendChild(label);
		fields.appendChild(document.createElement('br'));
		// Task 146.03: per-label size multiplier, stacked on top of the shared settings.textSize
		// (effectiveFontSize(lb.sizeMult) in buildLabelEls/refreshFontSizes above).
		var sizeLabel = document.createElement('label'), sizeInput = document.createElement('input');
		sizeInput.type = 'number'; sizeInput.step = 'any'; sizeInput.min = '0.1';
		sizeInput.value = lb.sizeMult || 1;
		sizeInput.addEventListener('change', function () {
			var v = +sizeInput.value;
			if (!(v > 0)) { sizeInput.value = lb.sizeMult || 1; return; }
			if (v === (lb.sizeMult || 1)) { return; }
			saveUndoSnapshot();
			lb.sizeMult = v;
			var le = labelEls[labelId];
			le.text.style.fontSize = effectiveFontSize(lb.sizeMult) + 'px';
			try { le.width = le.text.getBBox().width; } catch (err) { /* pre-layout measurement can throw; stale width stands */ }
			updateLabelGeometry(labelId);
			saveToStorage();
		});
		sizeLabel.textContent = (pc.lpn_field_text_size || 'Size ×') + ' ';
		sizeLabel.appendChild(sizeInput);
		fields.appendChild(sizeLabel);
		fields.appendChild(document.createElement('br'));
		readonlyField(fields, pc.lpn_field_x || 'X', an ? an.x + lb.x : lb.x);
		readonlyField(fields, pc.lpn_field_y || 'Y', an ? an.y + lb.y : lb.y);
	}
	function openLabelPopup(labelId, sx, sy) {
		currentPopup = { kind: 'label', id: labelId };
		renderLabelFields(labelId);
		openPopupAt(sx, sy);
	}
	// Roughness has no unit selector for now: Phase 1 assumes Hazen-Williams (js/lpn-solver.js's
	// default), whose C-factor is dimensionless. Darcy-Weisbach's roughness HEIGHT does need
	// units (the scope doc's roughness family is "DW only") -- revisit once a friction-method
	// selector exists (matching bpn_'s own method switch) and this can be genuinely conditional.
	function numberFieldPlain(fields, labelText, value, onChange, tip) {
		var label = document.createElement('label'), input = document.createElement('input');
		input.type = 'number'; input.value = value;
		input.addEventListener('change', function () { onChange(+input.value); scheduleSolve(); });
		setFieldLabel(label, labelText, tip);
		label.appendChild(input);
		fields.appendChild(label);
		fields.appendChild(document.createElement('br'));
	}
	function refreshPopupIfOpen() {
		var popup = document.getElementById('lpn_popup');
		if (!currentPopup || popup.style.display !== 'block') { return; }
		if (currentPopup.kind === 'node') { renderNodeFields(currentPopup.id); }
		else if (currentPopup.kind === 'link') { renderLinkFields(currentPopup.id); }
		else { renderLabelFields(currentPopup.id); }
	}

	// Multi-step undo, in memory only (not localStorage) -- ROADMAP Task 146 Phase 1's own listed
	// scope ("Ctrl-Z... 20 in-memory snapshots"). A stack, not a single slot: the single-slot
	// version (Tom, after losing a deleted pipe's data to a second accidental edit before undoing
	// the first) only protected the most recent mutation -- a second Add or Delete before Ctrl-Z
	// silently overwrote the one saved snapshot. UNDO_LIMIT matches the scope doc's number exactly;
	// shift() drops the oldest snapshot once the stack is full rather than growing unbounded.
	var UNDO_LIMIT = 20;
	var undoStack = [];
	function saveUndoSnapshot() {
		undoStack.push(JSON.parse(JSON.stringify(doc)));
		if (undoStack.length > UNDO_LIMIT) { undoStack.shift(); }
	}
	// Switching projects drops the undo history (Task 146.08). The stack holds snapshots of the
	// OUTGOING project's doc; leaving them in place would let one Undo in the newly-opened project
	// paste the previous project's network over it -- silently, and with no way back.
	function clearUndo() { undoStack.length = 0; }
	function undo() {
		if (undoStack.length === 0) { return; }
		doc = undoStack.pop();
		nextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };
		// Matches against the CURRENT settings.idPrefixes, not a hardcoded single-uppercase-letter
		// regex (Task 146 gear panel, 2026-07-30) -- a customized prefix can be any non-empty,
		// space/quote-free string (validatePrefix()), not necessarily one letter. Known limitation,
		// not worth guarding further on a preview page: an element created under a PRIOR prefix
		// (before the user renamed it mid-session) won't be matched here after a prefix rename, so
		// nextId could under-count for that letter post-undo. Renaming a prefix mid-session is rare;
		// starting nextId at 1 per key is already the safe floor.
		doc.nodes.concat(doc.links, doc.labels).forEach(function (x) {
			Object.keys(settings.idPrefixes).forEach(function (key) {
				var p = settings.idPrefixes[key] || key, rest = x.id.indexOf(p) === 0 ? x.id.slice(p.length) : null;
				if (rest !== null && /^\d+$/.test(rest)) { nextId[key] = Math.max(nextId[key], +rest + 1); }
			});
		});
		closePopup(); // whatever it referenced may no longer exist post-undo (e.g. undoing an Add)
		buildDom();
		updateEmptyHint();
		scheduleSolve();
	}
	document.addEventListener('keydown', function (e) {
		if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
	});

	// ---- solve: EngCalcs.lpnSolve() (js/lpn-solver.js), debounced on every edit ----
	// js/lpn-solver.js is a separate interface: its model shape (id/type/elev/demand/emitter/head for
	// nodes; id/type/from/to/diameter/roughness/length/status/k/h0/a/b for links) is the solver's own
	// API and is NOT renamed here. But doc.nodes/doc.links themselves now store every overridable
	// property underscored (Task 184/146.08 step 2), so passing them through untouched would hand the
	// solver a model with no demand/diameter/etc. at all. Every node/link is therefore rebuilt into a
	// plain-keyed COPY, reading each overridable property through effective() -- this is also where a
	// scenario's overrides take effect for the solver, once scenarios exist. Fields the solver reads
	// that are NOT overridable (elev, from/to, h0/a/b, curve-derived) pass through unchanged.
	// method is fixed to 'hw' for now (no friction-method selector yet -- see the numberFieldPlain()
	// comment on Roughness). visc is fresh water at ~20C; not user-editable yet.
	var lastSolveResult = null;
	function assembleModel() {
		var nodes = doc.nodes.map(function (n) {
			return n.type === 'reservoir'
				// Reservoirs pass a resolved head: the solver wants a real number, but the document
				// deliberately stores that field blank when the head just follows the elevation (see
				// reservoirHead()). Copying rather than filling the blank in keeps the document's
				// "still following elevation" state intact.
				? { id: n.id, type: n.type, elev: n.elev || 0, head: reservoirHead(n) }
				: { id: n.id, type: n.type, elev: n.elev || 0, demand: effective(n, 'demand'), emitter: effective(n, 'emitter') };
		});
		var links = doc.links.map(function (l) {
			return {
				id: l.id, type: l.type, from: l.from, to: l.to,
				diameter: effective(l, 'diameter'), roughness: effective(l, 'roughness'),
				length: effective(l, 'length'), status: effective(l, 'status'), k: effective(l, 'k'),
				h0: l.h0, a: l.a, b: l.b
			};
		});
		return { nodes: nodes, links: links, method: 'hw', visc: 1.007e-6, emitterExponent: settings.emitterExponent };
	}
	function diagIssueText(issue) {
		var pc = EngCalcs.pageConfig || {};
		if (issue.code === 'no-fixed-head') { return pc.lpn_diag_no_fixed_head || 'Add a reservoir. The network needs at least one known water level before it can be solved.'; }
		if (issue.code === 'dangling-link') { return (pc.lpn_diag_dangling_link || 'A pipe or pump connects to a node that no longer exists:') + ' ' + issue.ids.join(', '); }
		if (issue.code === 'unreachable') { return (pc.lpn_diag_unreachable || 'These nodes have no path to a reservoir:') + ' ' + issue.ids.join(', '); }
		return issue.code;
	}
	// The status bar has two writers with different lifetimes, and a naive setStatus() call loses to
	// the other one every time. runSolve() owns the bar for DIAGNOSTICS and rewrites it on a 300ms
	// debounce after every mutation -- including the empty string on a clean solve. So a one-shot
	// notice ("here is what just happened") set by a command would be wiped ~300ms later, which is
	// exactly long enough for the user not to see it.
	//
	// Rule: a real (non-empty) status supersedes a notice and discards it -- a live diagnostic like
	// "Add a reservoir" always matters more than a report of a completed action. An EMPTY status
	// falls back to the notice instead of blanking the bar, which is what lets a notice survive the
	// clean solve that follows the command that set it. A timer expires it either way, so the bar
	// does not keep narrating an action from a minute ago.
	var statusNotice = '', statusNoticeTimer = null;
	var STATUS_NOTICE_MS = 8000;
	function clearNotice() {
		statusNotice = '';
		if (statusNoticeTimer) { clearTimeout(statusNoticeTimer); statusNoticeTimer = null; }
	}
	function setStatus(text) {
		var el = document.getElementById('lpn_status');
		if (!el) { return; }
		if (text) { clearNotice(); el.textContent = text; return; }
		el.textContent = statusNotice || '';
	}
	function setNotice(text) {
		clearNotice();
		statusNotice = text || '';
		if (statusNotice) {
			statusNoticeTimer = setTimeout(function () { clearNotice(); setStatus(''); }, STATUS_NOTICE_MS);
		}
		setStatus('');
	}
	// Rounds to the same number of decimals the label actually displays, in the DISPLAY unit --
	// extrema and decoration must compare on this, not the raw SI value. Two series links carrying
	// what is physically the same flow can differ by solver roundoff far past the last printed
	// decimal (continuity is satisfied to a tolerance, not bit-exact); comparing un-rounded SI values
	// marked one as max and the other min even though both printed "100.00 gpm" -- a decoration the
	// display can't justify. Rounding first is what fieldExtrema()'s "tie -> no decoration" rule is
	// actually for.
	// `decimals` (Task 189) is per field, from labelSettings.decimals, and MUST be fed through here
	// rather than applied at print time: the whole point of this function is that the extrema and the
	// printed text agree, so a field shown to 0 decimals has to have its extrema judged at 0 decimals
	// too, or two links both printing "100" could still be marked max and min.
	// Above roughly 15 decimals, Math.pow(10, d) pushes the product past 2^53 and Math.round() becomes
	// the identity, so displayRound() degrades to returning the value unrounded. That is harmless: the
	// extrema/decoration invariant only requires that two labels printing the SAME text compare equal,
	// and at that precision two labels printing the same text ARE bit-identical. Nothing to guard.
	function fieldDecimals(decimals) { return typeof decimals === 'number' ? decimals : 2; }
	function displayRound(siValue, unitId, decimals) {
		if (typeof siValue !== 'number') { return undefined; } // guards a stray NaN contaminating Math.min/max in fieldExtrema
		var p = Math.pow(10, fieldDecimals(decimals));
		return Math.round(siValue * unitFactor(unitId) * p) / p;
	}
	// The non-SI-converted counterpart of displayRound(), for the declarative/dimensionless fields
	// (see rawLine() below). Same rounding rule, no unit factor.
	function plainRound(value, decimals) {
		if (typeof value !== 'number') { return undefined; }
		var p = Math.pow(10, fieldDecimals(decimals));
		return Math.round(value * p) / p;
	}
	// One line of a numeric label field: a bare number, colored per lpnFieldColors (Tom, 2026-07-30:
	// "make all the labels pure numbers, no units and no prefix/description... color code like we
	// did for bpn" -- the color-coded checkbox in the Labels popover is the only legend), decorated
	// with a high/low tick when it ties the network-wide max/min for that field
	// (fieldExtrema()/decorationFor() above, drawn by applyExtremaTicks()).
	function numLine(siValue, unitId, extrema, color, decimals) {
		var displayValue = displayRound(siValue, unitId, decimals);
		return { text: displayValue.toFixed(fieldDecimals(decimals)), color: color, decoration: decorationFor(extrema, displayValue) };
	}
	// Length is declarative, not SI-converted (see the lengthField() comment above: "1 grid unit IS
	// 1 ft or 1 m, whichever is currently selected, by declaration") -- unlike every other field
	// here, effective(l,'length') is already in the displayed unit, so this must NOT run it through
	// unitFactor.
	function rawLine(value, extrema, color, decimals) {
		var displayValue = plainRound(value, decimals);
		return { text: displayValue.toFixed(fieldDecimals(decimals)), color: color, decoration: decorationFor(extrema, displayValue) };
	}
	// Rebuilds every node's and link's map-label text from `labelSettings` + `lastSolveResult`.
	// Extrema are computed ONCE per field, network-wide, before any label is built, so every
	// element's decoration is judged against the same snapshot (Tom: ties all get marked, not just
	// the first one found -- decorationFor() already does this per element).
	function refreshLabelText() {
		var ls = labelSettings, nd = ls.decimals.node, ld = ls.decimals.link;
		// Every field below is rounded through the same displayRound()/per-field-decimals rule the
		// label text itself uses (see the comment on displayRound()), so a tie in what's actually
		// printed is always a tie in what gets decorated.
		var extrema = {
			// Elevation and pressure now include reservoirs -- a reservoir has a real elevation of
			// its own, and a real pressure (head minus that elevation) whenever its head has been
			// raised above it. Demand still excludes them: a reservoir supplies whatever the network
			// draws rather than demanding an amount.
			elev: fieldExtrema(doc.nodes.map(function (n) { return displayRound(n.elev, 'lpn_u_elevhead', nd.elev); })),
			demand: fieldExtrema(doc.nodes.map(function (n) { return n.type !== 'reservoir' ? displayRound(effective(n, 'demand'), 'lpn_u_flow', nd.demand) : undefined; })),
			head: fieldExtrema(doc.nodes.map(function (n) {
				if (n.type === 'reservoir') { return displayRound(reservoirHead(n), 'lpn_u_elevhead', nd.head); }
				return lastSolveResult ? displayRound(lastSolveResult.heads[n.id], 'lpn_u_elevhead', nd.head) : undefined;
			})),
			pressure: fieldExtrema(doc.nodes.map(function (n) {
				if (n.type === 'reservoir') { return displayRound(reservoirHead(n) - (n.elev || 0), 'lpn_u_pressure', nd.pressure); }
				return lastSolveResult ? displayRound(lastSolveResult.pressures[n.id], 'lpn_u_pressure', nd.pressure) : undefined;
			})),
			diameter: fieldExtrema(doc.links.map(function (l) { return l.type !== 'pump' ? displayRound(effective(l, 'diameter'), 'lpn_u_diameter', ld.diameter) : undefined; })),
			length: fieldExtrema(doc.links.map(function (l) { return l.type !== 'pump' ? plainRound(effective(l, 'length'), ld.length) : undefined; })),
			// Both dimensionless, so they use rawLine()/plainRound() like Length, not displayRound().
			roughness: fieldExtrema(doc.links.map(function (l) { return l.type !== 'pump' ? plainRound(effective(l, 'roughness'), ld.roughness) : undefined; })),
			km: fieldExtrema(doc.links.map(function (l) { return l.type !== 'pump' ? plainRound(effective(l, 'k') || 0, ld.km) : undefined; })),
			flow: fieldExtrema(doc.links.map(function (l) { return lastSolveResult ? displayRound(lastSolveResult.flows[l.id], 'lpn_u_flow', ld.flow) : undefined; })),
			velocity: fieldExtrema(doc.links.map(function (l) { return (l.type !== 'pump' && lastSolveResult) ? displayRound(lastSolveResult.velocities[l.id], 'lpn_u_velocity', ld.velocity) : undefined; })),
			// One head-loss bucket for every link type, pumps included: a pump reports a negative
			// head loss (Tom, 2026-07-30), so it lands at the min end of this same range rather
			// than needing a field of its own.
			headloss: fieldExtrema(doc.links.map(function (l) {
				if (!lastSolveResult || lastSolveResult.headlosses[l.id] === undefined) { return undefined; }
				return displayRound(lastSolveResult.headlosses[l.id], 'lpn_u_elevhead', ld.headloss);
			})),
			// Head loss GRADIENT (ROADMAP Task 177, Tom agreed 2026-07-30): headloss/length as a
			// dimensionless ratio, reusing the same grade/gradePercent OPTIONS as mpf_/mphl_'s own
			// friction-slope 'slope' family, but its own 'gradient' family (lib/Units.lib.php) so it
			// can default to gradePercent -- lpn_'s generic 2-decimal label formatter needs the %
			// form to read as anything but "0.00" for a typical small pipe gradient; see that
			// family's own comment. Not a per-1000-length form (EPANET's convention) by design,
			// matching this suite's own established slope convention instead.
			// effective(l,'length') is NOT divided by unitFactor('lpn_u_length') here -- per the
			// scope doc's "declarative units" design, it is already the real SI length the
			// solver itself used (the Length/Map selector only relabels the popup's input, it does
			// not convert the stored number), so dividing by that selector's factor would double-
			// convert. Pump-excluded, same as headloss.
			gradient: fieldExtrema(doc.links.map(function (l) {
				var len = effective(l, 'length');
				if (l.type === 'pump' || !len || !lastSolveResult || lastSolveResult.headlosses[l.id] === undefined) { return undefined; }
				return displayRound(lastSolveResult.headlosses[l.id] / len, 'lpn_u_gradient', ld.gradient);
			}))
		};
		var fc = lpnFieldColors, nodeLines = {}, linkLines = {};
		doc.nodes.forEach(function (n) {
			var ne = nodeEls[n.id]; if (!ne) { return; }
			var lines = [];
			// Order (Tom, 2026-07-30, thinking physically): ID, Demand, Head, Pressure, Elevation --
			// demand is the thing the user set as a design target, head/pressure are what the solve
			// produced from it, and elevation (the input least likely to change page to page) trails.
			if (ls.node.id) { lines.push({ text: n.id, color: fc.id }); }
			if (n.type !== 'reservoir' && ls.node.demand) { lines.push(numLine(effective(n, 'demand'), 'lpn_u_flow', extrema.demand, fc.demand, nd.demand)); }
			var headSI = n.type === 'reservoir' ? reservoirHead(n) : (lastSolveResult ? lastSolveResult.heads[n.id] : undefined);
			var pressSI = n.type === 'reservoir'
				? reservoirHead(n) - (n.elev || 0)
				: (lastSolveResult ? lastSolveResult.pressures[n.id] : undefined);
			if (ls.node.head && headSI !== undefined) { lines.push(numLine(headSI, 'lpn_u_elevhead', extrema.head, fc.head, nd.head)); }
			if (ls.node.pressure && pressSI !== undefined) { lines.push(numLine(pressSI, 'lpn_u_pressure', extrema.pressure, fc.pressure, nd.pressure)); }
			if (ls.node.elev) { lines.push(numLine(n.elev, 'lpn_u_elevhead', extrema.elev, fc.elev, nd.elev)); }
			ne.empty = lines.length === 0; // captured BEFORE the placeholder below -- see hideMask()'s comment
			if (lines.length === 0) { lines.push({ text: '' }); } // keep an empty tspan so getBBox() doesn't throw
			// x here is a placeholder -- layoutNodeLabel() below (after collision avoidance) sets the
			// real, final x/y on both the <text> and its tspans via repositionMultilineText().
			setMultilineText(ne.text, nodeLabelBase(n).x, lines);
			ne.lineCount = lines.length;
			nodeLines[n.id] = lines;
			ne.lines = lines; // cached for relayoutLabels(), which re-runs layout without rebuilding text
			try { ne.tw = ne.text.getBBox().width; } catch (err) { /* pre-layout measurement can throw; stale tw stands */ }
		});
		doc.links.forEach(function (l) {
			var le = linkEls[l.id]; if (!le) { return; }
			var lines = [];
			if (ls.link.id) { lines.push({ text: l.id, color: fc.id }); }
			if (l.type !== 'pump') {
				if (ls.link.diameter) { lines.push(numLine(effective(l, 'diameter'), 'lpn_u_diameter', extrema.diameter, fc.diameter, ld.diameter)); }
				if (ls.link.length) { lines.push(rawLine(effective(l, 'length'), extrema.length, fc.length, ld.length)); }
				if (ls.link.roughness) { lines.push(rawLine(effective(l, 'roughness'), extrema.roughness, fc.roughness, ld.roughness)); }
				if (ls.link.km) { lines.push(rawLine(effective(l, 'k') || 0, extrema.km, fc.km, ld.km)); }
			}
			if (lastSolveResult && lastSolveResult.flows[l.id] !== undefined) {
				if (ls.link.flow) { lines.push(numLine(lastSolveResult.flows[l.id], 'lpn_u_flow', extrema.flow, fc.flow, ld.flow)); }
				// Velocity is meaningless for a pump (no diameter -- see renderLinkFields() above).
				if (ls.link.velocity && l.type !== 'pump') { lines.push(numLine(lastSolveResult.velocities[l.id], 'lpn_u_velocity', extrema.velocity, fc.velocity, ld.velocity)); }
				if (ls.link.headloss) { lines.push(numLine(lastSolveResult.headlosses[l.id], 'lpn_u_elevhead', extrema.headloss, fc.headloss, ld.headloss)); }
				if (ls.link.gradient && l.type !== 'pump' && effective(l, 'length')) { lines.push(numLine(lastSolveResult.headlosses[l.id] / effective(l, 'length'), 'lpn_u_gradient', extrema.gradient, fc.gradient, ld.gradient)); }
			}
			le.empty = lines.length === 0;
			if (lines.length === 0) { lines.push({ text: '' }); }
			setMultilineText(le.text, linkLabelBase(l).x, lines);
			le.lineCount = lines.length;
			linkLines[l.id] = lines;
			le.lines = lines;
			try { le.tw = le.text.getBBox().width; } catch (err) { /* pre-layout measurement can throw; stale tw stands */ }
		});
		// Collision avoidance runs on the freshly measured tw/lineCount above, THEN every label is
		// laid out for real (text/mask/leader) at its final, possibly-nudged position, THEN extrema
		// ticks are placed from that final <text> x/y -- ticks read textEl.getAttribute('x'/'y')
		// directly (see applyExtremaTicks()), so they must come last or they'd be measured from the
		// placeholder position set above and go stale the moment a nudge or a drag moves the label.
		relayoutLabels();
		doc.links.forEach(function (l) { updateArrow(l.id); });
		renderLabelsLegend();
	}
	// The layout half of refreshLabelText(), without rebuilding any text: re-run collision
	// avoidance, then place every label (text, mask, leader) and its extrema ticks at the resulting
	// position. Split out so a DRAG can call it on every frame (Tom, 2026-07-30: "collisions aren't
	// recalculated after drag; leaders stay unchanged") -- moving one label changes what every other
	// label collides with, but none of the NUMBERS change while dragging, so rebuilding all the
	// tspans 60 times a second would be pure waste. Safe to call repeatedly because the collision
	// pass is idempotent (see addDataLabel()). Ticks reuse the lines cached by the last full
	// refreshLabelText().
	function relayoutLabels() {
		runLabelCollisionAvoidance();
		doc.nodes.forEach(function (n) {
			var ne = nodeEls[n.id]; if (!ne) { return; }
			layoutNodeLabel(n.id);
			// labelsLayer, not nodesLayer -- ticks decorate the label TEXT, which now lives in
			// labelsLayer (Task 146.01 draw-order fix), not beside the node's own circle. A tick
			// appended into nodesLayer would render underneath maskLayer/labelsLayer and never be seen.
			applyExtremaTicks(ne, ne.text, labelsLayer, ne.lines || []);
		});
		doc.links.forEach(function (l) {
			var le = linkEls[l.id]; if (!le) { return; }
			layoutLinkLabel(l.id);
			applyExtremaTicks(le, le.text, labelsLayer, le.lines || []);
		});
	}
	function runSolve() {
		// Autosave piggybacks on the same debounce as the solve, not a separate timer -- one
		// mutation, one save, regardless of solve outcome (a manual delete-to-empty must persist
		// too, or a reload would resurrect the stale pre-delete network).
		saveToStorage();
		if (doc.nodes.length === 0) { lastSolveResult = null; setStatus(''); return; }
		var model = assembleModel(), issues = EngCalcs.lpnDiagnose(model);
		if (issues.length > 0) {
			lastSolveResult = null;
			setStatus(issues.map(diagIssueText).join(' '));
			refreshLabelText();
			return;
		}
		var result = EngCalcs.lpnSolve(model, { tol: settings.tolerance });
		if (!result.ok || !result.converged) {
			lastSolveResult = null;
			setStatus(EngCalcs.pageConfig.lpn_diag_not_converged || 'Did not converge.');
			refreshLabelText();
			return;
		}
		lastSolveResult = result;
		setStatus('');
		refreshLabelText();
	}
	// Debounced, not run synchronously on every call site: a node drag alone calls updateNode()
	// (and therefore this) on every animation frame while dragging (see the tick()/applyDrag()
	// architecture ported from the spike) -- solving on every one of those would both be wasted
	// work and would fight the drag for the main thread.
	var solveTimer = null;
	function scheduleSolve() {
		if (solveTimer) { clearTimeout(solveTimer); }
		solveTimer = setTimeout(runSolve, 300);
	}

	// calcAndSave() calls this unconditionally -- from the units strip's own selects
	// (echoUnitSelect() hardcodes onchange="EngCalcs.submitForm()") and from echoUnitsRow()'s
	// US/SI preset buttons. A unit switch doesn't need a fresh solve (the underlying SI values
	// didn't change) -- just re-render whatever's already cached in the new unit.
	EngCalcs.pageCalculator = function (objForm) {
		refreshPopupIfOpen();
		refreshLabelText();
		// The Default inputs rows show their value in the CURRENT display unit and put that unit in
		// their label, so a unit switch has to re-render them for the same reason the open popup
		// does -- otherwise a US number sits under an SI label. Cheap: the panel is small, and the
		// collapsible sections' open/closed state lives in settings, so a rebuild does not close them.
		rebuildSettingsFields();
	};

	document.addEventListener('DOMContentLoaded', function () {
		EngCalcs.initTips(document);
		init();
	});
}());
