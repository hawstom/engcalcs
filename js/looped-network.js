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
	// Everything on the map that is drawn at a fixed world size was drawn against THIS size, so it
	// is expressed as "base dimension x textFactor()" -- tracking the user's Text size (and, in
	// 'screen' units, the zoom) everywhere else. Used by the extrema badges, the leader threshold,
	// the default label offset, and -- multiplied by the user's own symbolScale -- every symbol;
	// see symbolFactor().
	// NOT defaultSettings().textSize any more (2026-08-09, Task 254): that default moved to 20 and
	// this did NOT follow it, deliberately. This number's only job is to say what size the fixed
	// world dimensions below were drawn for, so that everything scales together; moving it in step
	// with the default would hold textFactor() at 1 and leave symbols and offsets at their old
	// absolute size while the lettering grew 8x. Leave it at 2.5 unless those base dimensions are
	// themselves re-drawn.
	var LPN_BASE_TEXT_SIZE = 2.5;
	// Leader slope for the example network's anchored callouts, degrees above horizontal.
	// 70, not the 60 Tom named on 2026-08-09, because he named it while approving the J3 callout he
	// was looking at -- and that one measures ~70 (a 60-unit rise over a 22.2-unit gap). He asked
	// for "60 degrees LIKE you make the 'lowest pressure' text"; the two halves of that sentence
	// disagree, so this keeps the appearance he approved rather than the number he estimated from
	// it. One constant to change if a true 60 turns out to read better.
	var LPN_CALLOUT_ANGLE = 70;
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
			// 'native' (js/lpn-solver.js) or 'epanet' (the real EPANET engine as WASM,
			// js/lpn-epanet.js). NATIVE IS THE DEFAULT AND SHOULD STAY THAT WAY: it is
			// synchronous and takes 0.4 ms at this page's 10-20 node target, where the EPANET
			// path costs a 678 KB lazy import and an async round trip on a page that re-solves
			// on every keystroke. The toggle exists because "does it run the actual EPANET
			// engine?" is a yes/no gate for some agencies (ROADMAP Tasks 222, 243), not because
			// the native solver needs help -- the two agree to 1e-5..1e-3 m of head
			// (dev/lpn-spike/validate_epanet.js).
			engine: 'native',
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
			sectionsOpen: { idPrefixes: false, defaults: true, mapDisplay: false, computation: false, files: false },
			// Map units -- the same units the drawing is in, so this number scales with the map and
			// means 20 ft or 20 m according to the Length/Map declaration (Tom, 2026-08-09: map
			// coordinates "follow length and elevation"; it is a size on the drawing, not a font
			// point size). 20 replaces the original 2.5, which was the old fixed LABEL_FONT_SIZE
			// constant carried over unexamined: 2.5 suits a drawing a few dozen units across, and
			// nobody draws a water system at that size -- at the scale real work arrives in it
			// renders as a hairline.
			// THIS ONLY REACHES A FIRST-TIME VISITOR. loadFromStorage() merges a saved settings
			// object ON TOP of these defaults, so anyone who used the page before this changed
			// keeps their stored 2.5 forever. That is why drawExampleNetwork() also sets 20
			// explicitly -- raising the default alone left Tom looking at the old size.
			textSize: 20,
			symbolScale: 1, // symbol size relative to text size -- see symbolFactor() above
			symbolOpacity: 1, // 0-1, applied to symbols only (never labels) -- see refreshSymbolSizes()
			backdropOpacity: 1, // 0-1, applied to the backdrop image -- the other half of the same control
			textSizeUnits: 'map', // 'map' | 'screen' -- see effectiveFontSize() above
			legendPosition: 'top-right', // one of LEGEND_POSITIONS' keys below -- matches the original hardcoded CSS
			// `fileAutosaveSeconds` was removed by Task 211 along with autosave-to-file itself. A saved
			// document may still carry one; applySaved() merges the save ONTO these defaults, so a
			// stale key is simply carried along and never read, and needs no migration step.
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
	// Set by applySaved() when the document just read was written before Task 263 (v2, SI numbers);
	// consumed once by offerUnitRestore() at the tail of refreshAllFromDocument().
	var pendingV2Restore = false;

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
		// h0/a/b are what js/lpn-solver.js reads, so they are SI -- but curvePoints are now what the
		// user typed, in the flow and head units on the strip (Task 263). This is the pump's own
		// crossing of the unit boundary, and it is why refreshPumpCurvesForUnits() has to re-run the
		// fit when a unit changes: the same three points mean a different pump under l/s than gpm.
		var curve = EngCalcs.lpnPumpFromCurve(pts.map(function (pt) {
			return [toSI(pt[0], 'lpn_u_flow'), toSI(pt[1], 'lpn_u_elevhead')];
		}));
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
	// Junction radius. 1.6 -> 0.72 earlier on 2026-08-09 ("about twice as large" next to text),
	// then 0.9 the same day once the node became a stroke-less solid dot: with the 1-unit ring
	// gone, 0.72 alone was too small to see, and 0.9 puts the WHOLE dot at 1.8 units -- one cap
	// height of the 2.5-unit base font, which is the "no larger than 1 text height" Tom asked
	// for. Total size fell 2.44 -> 1.8 even though the radius went up, because the ring was
	// adding 0.5 all round. One-line change if he wants it nudged either way.
	var JUNCTION_R = 0.9;
	// Reservoir is no longer a scaled-up copy of the junction circle's box -- it has its own
	// width/height (Tom, 2026-08-09: "the EPANET icon is more wide" than the tall/square tank this
	// shipped with, and he didn't want a uniform 0.5x shrink because that would also narrow it).
	// Half-height is the one number he gave exactly ("shortening its height to 0.5 its current
	// height": old full height was 2*2.2=4.4, so new full height is 4.4*0.5=2.2, half-height 1.1).
	// Half-width went through two passes the same day. First pass widened it to 3.3 (a starting
	// value, not a specified factor). Second pass (Tom): "make the map reservoir icon and its side
	// walls about 80% as wide as they are" -- but by then lib/Icons.lib.php's shared reservoir path
	// had ALSO been widened 1.5x (x:6-18 -> x:3-21, the "menu icon" half of that same request), and
	// this map box stretches that shared path with preserveAspectRatio="none", so a naive 3.3*0.8
	// would have landed 20% WIDER, not 20% narrower, once the wider path filled it. The math that
	// actually lands on "80% of the ORIGINAL map rendering":
	//   old wall width  = (old path fraction 12/24=0.5) x (old box width 2x3.3=6.6) = 3.3
	//   target           = 3.3 x 0.8 = 2.64
	//   new path fraction = 18/24 = 0.75 (from the widened shared path)
	//   new box width backs out to 2.64 / 0.75 = 3.52 -> new half-width 1.76
	// Third pass, same day: menu icon confirmed good ("approximately square looks as expected");
	// map still read "a bit too wide" while "its side walls are good now" -- i.e. the shared
	// path's own wall-to-box ratio (0.75, set in the second pass) is right, only the map's overall
	// box needs to shrink, uniformly, on top of that. No shared-path division this time (nothing
	// in lib/Icons.lib.php changed), so this IS a plain 1.76 x 0.8 = 1.408.
	// One-line change either way (both this and Icons.lib.php's path); this is explicitly an
	// experiment, not a settled number -- but if the SHARED PATH ever changes again, redo the
	// division two passes up, don't just scale by the requested percentage, or the two surfaces'
	// shared path will fight each other.
	var RESERVOIR_HALF_W = 1.408;
	var RESERVOIR_HALF_H = 1.1;
	function reservoirSize() {
		var k = symbolFactor();
		return { w: 2 * RESERVOIR_HALF_W * k, h: 2 * RESERVOIR_HALF_H * k };
	}
	// The single scalar every OTHER consumer of node geometry reads -- clear-run insets, label
	// mask/leader placement, hit-testing (the invisible-but-clickable circle under a reservoir
	// symbol), staticObstacleBoxes(), the zoom-extent bbox. A reservoir is no longer visually a
	// circle, so this is the circumscribing radius (half its LONGER side) rather than a true
	// radius -- generous rather than tight, so none of those consumers ever clips the wide/short
	// tank short on any one side (ROADMAP Task 146.10 and its 2026-08-09 follow-up).
	function nodeRadius(n) {
		if (n.type === 'reservoir') { var s = reservoirSize(); return Math.max(s.w, s.h) / 2; }
		return JUNCTION_R * symbolFactor();
	}
	// Positions/sizes a node's overlay symbol (currently: the reservoir tank -- see buildNodeEls()).
	// Only a reservoir ever has one (`ne.symbol` is null for a junction, which draws as the plain
	// circle above with no overlay), so this always sizes to reservoirSize() -- an independent
	// width/height, not nodeRadius()'s single circumscribing scalar; see buildNodeEls() for the
	// `preserveAspectRatio="none"` that makes the icon actually stretch to that box instead of
	// being letterboxed inside it.
	function positionNodeSymbol(id) {
		var n = nodeById(id), ne = nodeEls[id];
		if (!ne || !ne.symbol) { return; }
		var s = reservoirSize();
		ne.symbol.setAttribute('x', n.x - s.w / 2); ne.symbol.setAttribute('y', n.y - s.h / 2);
		ne.symbol.setAttribute('width', s.w); ne.symbol.setAttribute('height', s.h);
	}
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
			positionNodeSymbol(n.id);
		});
		doc.links.forEach(function (l) {
			var le = linkEls[l.id]; if (!le) { return; }
			le.handles.forEach(function (h) { h.setAttribute('r', VERTEX_HANDLE_R * k); });
			updateArrow(l.id);
			resizePumpSymbol(l.id);
		});
	}
	function buildNodeEls(n) {
		var circle = el('circle', {
			cx: n.x, cy: n.y, r: nodeRadius(n),
			'class': 'lpn-node lpn-node-' + n.type, 'data-node': n.id
		}, nodesLayer);
		// Reservoir renders as an open-top tank, not a circle (ROADMAP Task 146.10, Task 231 icon
		// set): a reservoir and a junction were the SAME mark, told apart only by size and colour,
		// which collapses to one mark in greyscale and for a red-green colour-blind reader (~8% of
		// men). `circle` above is untouched and stays the real hit target -- same radius, same
		// data-node, same click/drag/hit-test path as before. This is a second, non-interactive
		// element laid on top of it, built from the exact path data the toolbar's reservoir icon
		// uses (buildMapIconSvg() below) -- never a redrawn copy of that shape.
		var symbol = n.type === 'reservoir' ? buildMapIconSvg('reservoir', 'lpn-node-symbol lpn-node-symbol-reservoir') : null;
		if (symbol) {
			// The nested <svg>'s viewBox is square (0 0 24 24, same as every icon) but the box it's
			// placed into is not (reservoirSize() -- wide, short). Default preserveAspectRatio
			// ("xMidYMid meet") would keep the icon square and letterbox it inside that box; "none"
			// is what actually stretches the tank horizontally and squashes it vertically to fill
			// the box, which is the whole point of giving it an independent width/height.
			symbol.setAttribute('preserveAspectRatio', 'none');
			// Backdrop matches the tank's own silhouette in lib/Icons.lib.php's reservoir path (the
			// (3,4)-(21,20) box `M3 4v16h18V4` traces) -- same box, so the opaque patch never peeks
			// out past the tank's own outline nor leaves a sliver of it uncovered. It stretches
			// along with the rest of the icon's content since it lives in the same viewBox. Keep
			// this in sync with that path's own x-coordinates if it's ever widened/narrowed again.
			prependSymbolBackdrop(symbol, 'rect', { x: 3, y: 4, width: 18, height: 16 }, 'lpn-node-symbol-backdrop');
			nodesLayer.appendChild(symbol);
		}
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
		nodeEls[n.id] = { circle: circle, symbol: symbol, text: text, tw: tw, mask: mask, leader: leader, nudge: { x: 0, y: 0 }, lineCount: 1 };
		incidentLinks[n.id] = [];
		labelsByAnchor[n.id] = [];
		positionNodeSymbol(n.id);
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
		// A pump is a LINK, not a node (see the file header), so it had no symbol at all -- just a
		// line in its own colour. ROADMAP Task 146.10: casing + tangent discharge tail, the same
		// path data the toolbar's pump icon uses, rotated to point at the `to` node -- see
		// positionPumpSymbol() for the rotate/flip rule. symbolG is the rotate/flip pivot (drawn in
		// nodesLayer, same layer as node symbols, so a pump reads on top of every pipe it crosses);
		// symbolSvg inside it is the icon box itself, non-interactive -- clicking/dragging a pump
		// still goes through `line` above, unchanged.
		var symbolG = null, symbolSvg = null;
		if (l.type === 'pump') {
			symbolG = el('g', { 'class': 'lpn-link-symbol lpn-link-symbol-pump' }, nodesLayer);
			symbolSvg = buildMapIconSvg('pump', '');
			if (symbolSvg) {
				symbolG.appendChild(symbolSvg);
				// Backdrop matches the casing circle in lib/Icons.lib.php's pump path
				// (`<circle cx="9.8" cy="12.5" r="5"/>`) -- round, not the icon's own square box, so
				// it occludes exactly the casing's footprint rather than plastering a rectangle over
				// the pipe on both sides of it. The thin discharge tail gets no backdrop of its own;
				// a stroke-width line crossing a pipe reads as two lines crossing, not as seeing
				// through a symbol.
				prependSymbolBackdrop(symbolSvg, 'circle', { cx: 9.8, cy: 12.5, r: 5 }, 'lpn-link-symbol-backdrop');
			} else { symbolG.remove(); symbolG = null; }
		}
		linkEls[l.id] = {
			line: line, handles: handles, arrows: arrows, text: text, tw: 8, mask: mask, leader: leader,
			nudge: { x: 0, y: 0 }, lineCount: 1, symbolG: symbolG, symbolSvg: symbolSvg
		};
		if (symbolG) { resizePumpSymbol(l.id); positionPumpSymbol(l.id); }
		layoutLinkLabel(l.id);
	}
	// Icon box size for a pump's map symbol, in world units -- same "relative to text" scaling as
	// every other symbol (symbolFactor()). Confirmed right-sized as shipped (Tom, 2026-08-09: "the
	// pump icon is literally the same size as text, as advertised") -- leave this one alone.
	function pumpSymbolSize() { return 4 * symbolFactor(); }
	function resizePumpSymbol(id) {
		var le = linkEls[id];
		if (!le || !le.symbolSvg) { return; }
		var size = pumpSymbolSize(), half = size / 2;
		le.symbolSvg.setAttribute('x', -half); le.symbolSvg.setAttribute('y', -half);
		le.symbolSvg.setAttribute('width', size); le.symbolSvg.setAttribute('height', size);
	}
	// ROADMAP Task 146.10's pump-orientation rule, verified over all 25 angles at 15-degree steps:
	// always rotate to point the discharge at the `to` node, and flip vertically first whenever the
	// pipe runs west (dx < 0) -- otherwise the tail swings under the casing for every westward pump.
	// The boundary is on dx, never dy: at dx=0 the tail lands horizontal and either variant is right.
	// Positioned from the link's own from/to nodes only (ignoring verts, same as the spec) -- a
	// pump is drawn straight in practice, and the pivot is the icon's own box centre, not its
	// casing's, which only shifts where the mark sits, never the flip/rotate logic itself.
	function positionPumpSymbol(id) {
		var l = linkById(id), le = linkEls[id];
		if (!le || !le.symbolG) { return; }
		var a = nodeById(l.from), b = nodeById(l.to),
			mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2,
			angle = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI,
			flip = (b.x - a.x) < 0;
		le.symbolG.setAttribute('transform',
			'translate(' + mx + ',' + my + ') rotate(' + angle + ')' + (flip ? ' scale(1,-1)' : ''));
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
	// Where the flow arrow sits along its segment, as a fraction measured FROM THE UPSTREAM END.
	// The label is anchored at the segment midpoint, so anything other than 0.5 separates the two
	// (Tom, 2026-07-30: "flow arrows are colliding with pipe labels… maybe arrow at 30% from low
	// head and label at 50%?"), and an off-centre arrow makes the POSITION carry the flow direction
	// too, redundantly with the chevron, which helps at small symbol sizes.
	// Moved 0.3 -> 0.7 on 2026-08-03 (Tom: "more intuitive for the flow arrow to be downstream of
	// midpoint"). Same distance from the label, same redundancy, but the arrow now sits where the
	// water is going rather than where it came from -- it reads as leading the flow instead of
	// trailing it. Everything else follows the constant: flow < 0 mirrors it to 1 - ARROW_ALONG,
	// and linkLabelMid()'s collision test measures against arrowAlongDistances(), which derives
	// from this same value, so the label keeps clear of the arrow's new position automatically.
	var ARROW_ALONG = 0.7;
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
		positionPumpSymbol(id);
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
		positionNodeSymbol(id);
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
		if (linkEls[l.id].symbolG) { linkEls[l.id].symbolG.remove(); }
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
				halfW = le.width / 2,
				// Half the label's OWN rendered height, not a constant. buildLabelEls() sets
				// dominant-baseline:central, so py is the vertical centre and the text reaches
				// half a font size either side -- times the label's own sizeMult, which is the
				// part a constant cannot know. This was a hardcoded 2, correct only while the
				// text size was 2.5; at the shipped default of 20 a title at sizeMult 2 is 40
				// units tall and bbox() was reserving 4, so zoom-to-fit clipped it. Found
				// 2026-08-09 adding the example's title block (Task 254).
				halfH = effectiveFontSize(lb.sizeMult) / 2;
			inc(px - halfW, py - halfH); inc(px + halfW, py + halfH);
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
	// Height an absolutely-positioned canvas overlay occupies, measured rather than guessed --
	// #lpn_mode_hint and #lpn_coords are both 11px text whose height depends on the font that
	// actually rendered, and the mode hint wraps to two lines in several languages. Returns 0 for
	// an absent or empty overlay, so a hidden readout costs no margin.
	function overlayReserve(id) {
		var e = document.getElementById(id);
		if (!e || !e.offsetHeight || !e.textContent.trim()) { return 0; }
		return e.offsetHeight + 8;   // its own height plus a little clear air
	}

	// "Fit once the labels are real." zoomExtent() sizes the view to the RENDERED label text
	// (bbox() reads each label's measured width and line count), but a network created in code --
	// drawExampleNetwork(), drawTestGrid(), a freshly opened file -- is fitted before its first
	// solve has produced any label content, so the fit is to bare symbols and the labels then
	// overflow the map when they appear 300 ms later. Setting this asks for one more fit as soon
	// as the solve lands; consumeFitAfterSolve() below is called on every path out of a solve,
	// including the async EPANET one, so it fires exactly once whichever engine answered.
	var fitAfterSolve = false;
	function consumeFitAfterSolve() {
		if (!fitAfterSolve) { return; }
		fitAfterSolve = false;
		zoomExtent();
	}
	function zoomExtent() {
		// ASYMMETRIC PADDING, because the canvas has permanent furniture on it (Tom, 2026-08-09:
		// "it seems unforgivable to have a persistent message overwriting our map... maybe what we
		// really need to do is make Zoom to Fit account for this top margin"). The mode hint sits
		// top-left and the coordinate readout bottom-left, both inside the SVG's box, so a fit that
		// pads all four sides equally deliberately places drawing content underneath them. It is
		// the fit that is wrong here, not the overlays: they are live state, which is why they live
		// on the canvas at all.
		//
		// NOTE WHAT THIS DOES AND DOES NOT FIX. It guarantees nothing is under an overlay
		// IMMEDIATELY AFTER a fit. The user can still pan or zoom content back under one, because
		// the overlays are screen-fixed and the drawing is not. A guarantee would need the
		// overlays moved out of the canvas entirely -- see ROADMAP Task 253 for that argument and
		// the screenshot case that is the real reason to want it.
		var b = bbox(), r = svg.getBoundingClientRect(), pad = 16,
			padTop = Math.max(pad, overlayReserve('lpn_mode_hint')),
			padBottom = Math.max(pad, overlayReserve('lpn_coords')),
			w = Math.max(b.maxx - b.minx, 1), h = Math.max(b.maxy - b.miny, 1),
			availH = Math.max(r.height - padTop - padBottom, 1);
		state.s = Math.min((r.width - 2 * pad) / w, availH / h);
		state.tx = pad - b.minx * state.s + (r.width - 2 * pad - w * state.s) / 2;
		state.ty = padTop - b.miny * state.s + (availH - h * state.s) / 2;
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
	// The four backdrop commands, in ONE implementation with two doors: the toolbar's select and the
	// Insert > Background image submenu (Tom, 2026-08-04: "In EPANET, Backdrop has its submenu, so
	// that's what the paradigm calls us to do... Can we duplicate the toolbar item into the pull-down
	// menu?" -- yes, and duplication between a menu and a toolbar is the correct relationship, not
	// something to clean up).
	function backdropAction(v) {
		var pc = EngCalcs.pageConfig || {};
		var fileInput = document.getElementById('lpn_backdrop_file');
		if (v === 'add') { cancelActive(); if (fileInput) { fileInput.click(); } }
		else if (v === 'scale') { startBackdropScale(); }
		else if (v === 'position') { startBackdropPosition(); }
		else if (v === 'remove') {
			if (window.confirm(pc.lpn_backdrop_remove_confirm || 'Remove the background image?')) { removeBackdrop(); }
		}
	}
	function wireBackdropMenu(into) {
		var pc = EngCalcs.pageConfig || {}, menu = document.createElement('select');
		menu.id = 'lpn_backdrop_menu';
		menu.dataset.edits = '1'; // adding/scaling/removing a backdrop is a document change like any other
		function opt(value, text, disabled) {
			var o = document.createElement('option');
			o.value = value; o.textContent = text; if (disabled) { o.disabled = true; }
			menu.appendChild(o);
		}
		// An <option> can hold text and nothing else -- no element, so no SVG. These stay words, and
		// the identical commands in Insert > Background image carry the icons instead.
		opt('', pc.lpn_backdrop_menu || 'Background image...');
		opt('add', pc.lpn_backdrop_add || 'Add image');
		opt('scale', pc.lpn_backdrop_scale || 'Scale', true);
		opt('position', pc.lpn_backdrop_position || 'Position', true);
		opt('remove', pc.lpn_backdrop_remove || 'Remove image', true);
		var fileInput = document.getElementById('lpn_backdrop_file');
		menu.addEventListener('change', function () {
			var v = menu.value; menu.value = '';
			backdropAction(v);
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
		// Read-only no longer restricts the TOOLS (Tom, 2026-08-04, reconfirmed 2026-08-05: "if you
		// open a project read-only, you should be able to do with it anything you want, but you can't
		// save it to file"). The single enforcement point is writeOpenProjectToFile(), plus a disabled
		// Save in the File menu. Everything else is ordinary editing on a document that simply has
		// nowhere of its own to go yet -- Save as is the way out, exactly as for a browser project.
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
		if (nodeEls[id].symbol) { nodeEls[id].symbol.remove(); }
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
		if (linkEls[id].symbolG) { linkEls[id].symbolG.remove(); }
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
	// 3 (Task 263, 2026-08-10): inputs are stored AS DECLARED rather than in SI, and the document
	// records the unit selection it was written under. A v2 document holds SI numbers and says
	// nothing about units, which is why opening one runs the one-time restore offer below.
	var LPN_STORAGE_VERSION = 3;
	// The version at which inputs became declarative. A document below it holds SI numbers that have
	// not been ruled on, and that is the ONLY thing the restore offer keys off (Tom, 2026-08-10:
	// "The project receives no version number, right? Isn't that absence enough to trigger the offer
	// again?" -- yes, and a second flag beside it was one mechanism too many).
	var LPN_DECLARATIVE_VERSION = 3;
	// The version of the document currently open, which is NOT always LPN_STORAGE_VERSION.
	// serializeProject() writes THIS rather than the constant, so a project whose numbers have not
	// been ruled on saves as v2 and is asked again next time. Moving it forward is what "answered"
	// means: Convert does it, "Never ask again" does it, and Close deliberately does not.
	var openDocVersion = LPN_STORAGE_VERSION;
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
		// The identity (initials + opaque token) is part of "everything this page remembers about me"
		// and was missing here until 2026-08-04, when Tom noticed Clear/Wipe did not make the page
		// behave as a first-time visitor: the file training panel stayed suppressed and the old
		// initials were still being sent to the lock broker.
		var i, key, doomed = [LPN_LEGACY_KEY, LPN_INDEX_KEY, LPN_IDENTITY_KEY];
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
	// The whole-page reset, behind one confirm. Extracted from the Settings button's inline handler
	// (Task 211) so the Settings MENU can offer the same act -- one implementation, two doors, which
	// is the rule for every command that appears in both a menu and a control.
	function wipeEverything() {
		var pc = EngCalcs.pageConfig || {};
		if (!window.confirm(pc.lpn_confirm_wipe || 'Delete EVERYTHING saved for this page — every project, every background image, all settings, and your unit choices — and reload the page as a brand-new visitor would see it? This cannot be undone.')) { return; }
		wipeAllStorage();
		window.location.reload();
	}
	// Time-ordered prefix plus randomness: sortable for debugging, and collision-free even when two
	// projects are created in the same millisecond in two tabs.
	function newProjectId() {
		return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
	}
	function serializeProject() {
		return {
			v: openDocVersion, project: project, scenarios: scenarios,
			nodes: doc.nodes, links: doc.links, labels: doc.labels, nextId: nextId,
			labelSettings: labelSettings, backdrop: backdrop, settings: settings,
			// The units the numbers above are IN. Not a preference -- without it the document does
			// not say what it means, and a 400 mm main would open as a 400 inch main (Tom).
			units: readUnitSelections()
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
	// Nodes/links/labels only -- NOT scenarios/settings/backdrop, which every new project inherits
	// from whichever one was open (see newProject()) and so are never evidence that THIS project was
	// touched. Reads the live doc for the open project rather than round-tripping through storage,
	// since that is always current; a background tab is read from its own saved JSON.
	function projectIsEmpty(id) {
		var saved = id === library.openId ? doc : readJSON(projectKey(id));
		return !!saved && !(saved.nodes && saved.nodes.length) && !(saved.links && saved.links.length) && !(saved.labels && saved.labels.length);
	}
	function saveIndex() { return writeJSON(LPN_INDEX_KEY, library); }
	// ---- "differs from the file", the only thing the asterisk may mean ----
	// The flag used to be set by saveToStorage(), on the reasoning that every mutation funnels
	// through there. It does -- but so does a great deal that is NOT a mutation, and runSolve() calls
	// saveToStorage() unconditionally on a debounce. So merely OPENING a file, or switching to a tab,
	// scheduled a solve, which wrote storage, which raised the asterisk on a project identical to the
	// file it came from (Tom, 2026-08-04: "On opening a file on https, it immediately says it is
	// modified. This must be a mistake." It was).
	//
	// A signature answers the real question instead of a proxy for it: dirty means the document is
	// not what the file holds. That also makes edit-then-undo-back correctly clean, which no
	// call-site-counting scheme ever manages.
	function hash32(str) {
		var h = 5381, i = str.length;
		while (i) { h = (h * 33) ^ str.charCodeAt(--i); }
		return (h >>> 0).toString(36);
	}
	function docSignature() {
		var snap = serializeProject();
		// The backdrop's data URL is megabytes and changes only when the image itself is replaced, so
		// it is represented by its LENGTH plus its placement rather than hashed. Hashing it would put
		// a multi-megabyte string walk on the solve debounce, several times a second while drawing.
		var bd = snap.backdrop;
		snap = Object.assign({}, snap, {
			backdrop: bd ? { n: (bd.href || '').length, x: bd.x, y: bd.y, w: bd.width, h: bd.height, s: bd.s } : null
		});
		return hash32(JSON.stringify(snap));
	}
	// Autosave. Writes the OPEN project's document first and the index second, deliberately: if the
	// document write fails on quota, the index still describes the last state that actually made it
	// to disk, rather than advertising a project whose content never landed.
	function saveToStorage() {
		if (!library.openId) { return; }
		if (!writeJSON(projectKey(library.openId), serializeProject())) { return; }
		var entry = indexEntry(library.openId);
		if (entry) {
			entry.name = project.name;
			entry.updated = Date.now();
			// Recomputed here because this is still the one seam every change passes through -- what
			// changed is what it decides. `savedSig` is set only by a successful file write, so a
			// project that has never been written to a file has none and is always dirty, which is
			// exactly right: a browser project is in no file at all.
			//
			// The strip is redrawn only when the answer CHANGES. This runs on every pointer move of a
			// drag, and a full tab re-render per frame would be visible.
			var nowDirty = docSignature() !== entry.savedSig;
			if (nowDirty !== !!entry.dirty) { entry.dirty = nowDirty; renderTabs(); }
		}
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
		// **There is deliberately NO v2 -> v3 step here.** Every other migration in this function
		// converts the document and stamps it; this one cannot, because the conversion is the USER'S
		// to authorise. So the document stays at v2 until they answer, and the missing stamp IS the
		// pending question. An earlier cut stamped v3 on sight and carried a separate
		// `unitsUnconfirmed` flag beside it; Tom removed the flag by asking why the version alone was
		// not enough (2026-08-10). It is, and serializeProject() writes `openDocVersion` so a v2
		// document saves back as v2.
		return saved;
	}
	// Version-checks one already-parsed document and runs it up to the current version. Returns null
	// for "nothing usable here" -- not a project document at all, structurally impossible, or written
	// by a NEWER page than this one, which is refused loudly rather than silently half-read.
	// Split out of readDocument() for Task 195: an IMPORTED file has to go through exactly the same
	// gate a stored document does, and the only difference between the two is where the JSON came
	// from. Anything that runs here runs for both, by construction.
	function prepareDocument(saved) {
		if (!saved || typeof saved !== 'object' || typeof saved.v !== 'number') { return null; }
		if (saved.v > LPN_STORAGE_VERSION) {
			var pc = EngCalcs.pageConfig || {};
			alert(pc.lpn_storage_too_new || 'This project was saved by a newer version of the page, so it cannot be opened here.');
			return null;
		}
		// The three collections are the one part applySaved() takes on trust (`saved.nodes || []`),
		// so a file whose `nodes` is a string or a number would install and then break the renderer
		// rather than being refused here. Absent is fine -- that is an empty project; present and
		// not an array is not a project document.
		var lists = ['nodes', 'links', 'labels'], i;
		for (i = 0; i < lists.length; i++) {
			if (saved[lists[i]] !== undefined && !Array.isArray(saved[lists[i]])) { return null; }
		}
		return migrateSaved(saved);
	}
	// Reads one stored document and prepares it. Absent or unparseable JSON is "nothing usable here"
	// as well, and readJSON() already reports both as null.
	function readDocument(key) {
		return prepareDocument(readJSON(key));
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
		// THE PROJECT'S OWN UNITS, restored before anything renders (Task 263). A document written
		// under mm now opens under mm however this browser was last left, because its numbers only
		// mean anything alongside the units they were typed in.
		applyUnitSelections(saved.units);
		// A pre-declarative document holds SI numbers and has not been ruled on. offerUnitRestore(),
		// called by refreshAllFromDocument() once the network is on screen, asks about it there --
		// the question is unanswerable in the abstract and obvious next to the drawing.
		openDocVersion = (typeof saved.v === 'number') ? saved.v : LPN_STORAGE_VERSION;
		pendingV2Restore = openDocVersion < LPN_DECLARATIVE_VERSION;
		return true;
	}

	// ---- the project library ----
	// Since Task 211 a project's name is real, stored data from the moment it is created -- "Project 3"
	// is assigned by newProject(), not substituted at display time the way the old "Untitled" fallback
	// was. The fallback below is therefore a can't-happen path kept only so a hand-edited or truncated
	// index cannot render a nameless tab; initLibrary() names every blank it finds on sight.
	function projectDisplayName(p) {
		return (p && p.name) ? p.name : nextProjectName();
	}
	// "Project 3", where 3 is the LOWEST number not currently in use -- so closing Project 2 makes the
	// next new project Project 2 again. A counter that only ever went up would reach "Project 47" in an
	// afternoon and read as a leak (Tom, 2026-08-04). Same convention as Book1 / Untitled-1.
	//
	// The pattern is derived from the localized template rather than hardcoded, so a page running in
	// Spanish recognises its own "Proyecto 3" as numbered and does not start again at 1.
	function nextProjectName() {
		var pc = EngCalcs.pageConfig || {}, tpl = pc.lpn_project_numbered || 'Project{n}', used = {};
		// No space in the template -- "Project1", like Google Sheets' "Sheet1" (Tom, 2026-08-05).
		// That is a convention call, but it also makes the save round-trip LOSSLESS: safeFileName()
		// has no space to collapse, so a saved project comes back named exactly what it was, and the
		// numbering bug cannot recur by that route at all. Do not reintroduce the space without
		// re-reading the scan below.
		//
		// Match the WORD, then the FIRST INTEGER after it, whatever sits between (Tom, 2026-08-05).
		// The old pattern demanded the template exactly -- '^Project (\d+)$'. But saving renames a
		// project after its file, and safeFileName() collapses the space, so "Project 1" came back
		// as "Project-1", stopped matching, and 1 read as free: the next new project was ALSO
		// "Project 1". Anchored at the start so somebody else's "Notes on Project 3" is not counted,
		// and deliberately loose after the word so any future separator is already handled.
		var head = tpl.split('{n}')[0].trim();
		var rx = new RegExp('^' + head.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\D*(\\d+)');
		library.projects.forEach(function (p) {
			var m = rx.exec(p.name || '');
			if (m) { used[+m[1]] = true; }
		});
		var n = 1;
		while (used[n]) { n++; }
		return tpl.replace('{n}', n);
	}
	// Every project the library knows about is a TAB (Task 211) -- there is no separate open/closed
	// state, and closing a tab is what removes a project. These three read that state.
	//
	// `entry.fileName` is what makes a project a FILE project, and it is stored in the index rather
	// than only in the session's handle Map on purpose: the handle itself is kept in IndexedDB and
	// usually comes back (Task 212), but it can fail to -- permission withdrawn, private browsing, a
	// project last opened before that store existed -- and then we still know the tab came from
	// `Elm-Street.json` even though we cannot write to it. Keeping the name means the tab keeps its
	// identity instead of silently demoting itself to a browser project, which would be a lie about
	// where the work is.
	function isFileProject(entry) { return !!(entry && entry.fileName); }
	function handleFor(id) { return fileHandles.get(id) || null; }
	// True only when we can actually WRITE without asking again.
	function isLinked(id) { return !!handleFor(id); }
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
		//
		// **`openId` has to go with them** (fixed 2026-08-06, found by the browser pass). adoptOrphans()
		// drops an index entry whose document is missing -- and a brand-new project has no document
		// until its first edit, so arriving and reloading before touching anything dropped the only
		// project while `openId` went on pointing at it. init() then saw a truthy `openId`, decided a
		// project was already open, and registered none: an empty tab strip for the rest of the
		// session, with edits saving under an id no index entry knew about.
		if (!library.projects.length) { library.openId = null; return migrateLegacy(); }
		// Name every blank on sight (Task 211). Projects created before names were real data all
		// rendered as the same word "Untitled" -- Tom found four identically-named tabs in the library
		// and could not tell them apart. A tab strip makes that fatal rather than merely untidy, so
		// blanks are given a number ONCE, here, and become ordinary renameable names from then on.
		library.projects.forEach(function (p) {
			if (p.name) { return; }
			p.name = nextProjectName();
			var d = readJSON(projectKey(p.id));
			if (d && d.project) { d.project.name = p.name; writeJSON(projectKey(p.id), d); }
			repaired = true;
		});
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
		renderTabs();
		// The banner belongs to the project you are looking at: a read-only tab, a file that needs
		// re-opening after a page load, or neither.
		syncReadOnlyToOpenProject();
		// LAST, and only after the network is drawn: the question it asks is about the numbers the
		// user can now see.
		offerUnitRestore();
	}
	// ---- one-time restore of a pre-Task-263 project (Tom's design, 2026-08-10) ----
	//
	// A v2 document stored SI. Under declarative storage those same numbers now MEAN what they say,
	// so a US project's 0.2032 m pipe would read as a 0.2032 inch pipe. Multiplying every input by
	// the factor currently on the strip puts it back to the 8 the user typed -- and the strip is the
	// best evidence there is, because the unit selection is cookie-persisted per browser, so a
	// returning user is almost always looking at the units they drew in.
	//
	// **Almost always is not always, so it ASKS, and No is the default** (Tom). Getting this wrong
	// silently would rewrite somebody's whole network by a factor of 39.37. The dialog shows real
	// diameters out of THIS project, before and after, because that is the one thing that lets a
	// user recognise their own work: "0.2032 -> 8" is checkable at a glance in a way that no
	// explanation of storage models ever will be.
	//
	// Diameters are the evidence field on purpose. Elevations and demands can legitimately be
	// round-ish in either system, but a pipe is bought in a catalogue size, so a converted one is
	// conspicuous.
	function v2RestoreEvidence() {
		var f = unitFactor('lpn_u_diameter'), counts = {}, out = [];
		doc.links.forEach(function (l) {
			if (l.type === 'pump') { return; }
			var d = effective(l, 'diameter');
			if (typeof d !== 'number' || !(d > 0)) { return; }
			counts[d] = (counts[d] || 0) + 1;
		});
		Object.keys(counts).forEach(function (k) { out.push({ v: +k, n: counts[k] }); });
		// Most COMMON first (that is what makes them representative), then the chosen few sorted
		// smallest to largest so the list reads like a pipe schedule.
		out.sort(function (a, b) { return b.n - a.n; });
		out = out.slice(0, 5).sort(function (a, b) { return a.v - b.v; });
		return out.map(function (e) { return trimNumber(e.v) + ' → ' + trimNumber(e.v * f); });
	}
	function trimNumber(v) { return String(+(+v).toFixed(6)); }
	function applyV2Restore() {
		var hf = unitFactor('lpn_u_elevhead'), qf = unitFactor('lpn_u_flow'),
			df = unitFactor('lpn_u_diameter');
		function scale(obj, key, f) {
			if (obj && typeof obj[key] === 'number') { obj[key] = obj[key] * f; }
		}
		saveUndoSnapshot(); // one Ctrl-Z undoes the whole migration
		doc.nodes.forEach(function (n) {
			scale(n, 'elev', hf);
			scale(n, '_head', hf);
			scale(n, '_demand', qf);
		});
		doc.links.forEach(function (l) {
			scale(l, '_diameter', df);
			// _length was ALREADY declarative before this task (see linkLengthSI) -- scaling it here
			// would break the one field that was never wrong. _roughness and _k are dimensionless.
			(l.curvePoints || []).forEach(function (pt) {
				if (!pt) { return; }
				if (typeof pt[0] === 'number') { pt[0] = pt[0] * qf; }
				if (typeof pt[1] === 'number') { pt[1] = pt[1] * hf; }
			});
		});
		// SCENARIO OVERRIDES ARE DELIBERATELY NOT TOUCHED, because no v2 document can contain one.
		// The scenario machinery exists in the data model (defaultScenarios/effective/overrides) but
		// nothing in the UI has ever created a scenario -- there is no command, no lang key, and
		// `scenarios` is always exactly one empty Base. The first version of this migration scaled
		// them anyway and its comment claimed that omitting them would leave a scenario "39x out
		// from its Base"; that was wrong, and Tom caught it ("Scenarios: they don't exist yet. I am
		// confused."). Dead code in a one-time migration is worse than absent code: it reads as
		// evidence that the case is real. When scenarios do ship, every v2 document will long since
		// have been migrated or abandoned.
		recomputeAllPumpCurves();
		// Answered: the numbers are now in the units the strip names, so the document is current.
		//
		// A Ctrl-Z after this restores the NUMBERS but not the version, so the offer does not come
		// back. That is deliberate rather than an oversight -- undoing a conversion you just asked
		// for is the same verdict as "Never ask again", reached by a different route.
		stampDocAnswered();
		refreshAllFromDocument();
	}
	// "This document's numbers have been ruled on." The one place openDocVersion moves forward.
	function stampDocAnswered() {
		openDocVersion = LPN_STORAGE_VERSION;
		saveToStorage();
	}
	function offerUnitRestore() {
		if (!pendingV2Restore) { return; }
		pendingV2Restore = false;   // shown at most once per open; the persistent flag decides the rest
		var pc = EngCalcs.pageConfig || {};
		// Nothing to restore: with the base SI unit selected the factor is 1, so the stored number
		// and the declared number are the same number and there is no question to ask. An empty
		// project has no evidence and nothing to fix either. Both cases are SETTLED, not deferred,
		// so the flag is cleared -- the offer must not reappear for a project it can do nothing for.
		var rows = v2RestoreEvidence();
		if (!rows.length || unitFactor('lpn_u_diameter') === 1) { stampDocAnswered(); return; }
		openDialog(function (body) {
			var p1 = document.createElement('p');
			p1.style.margin = '0 0 8px';
			p1.textContent = (pc.lpn_v2_restore_prompt || 'This calculator stores project units and inputs as entered, but it formerly converted numbers to SI for storage. This project was saved before that change, so its numbers were stored in SI. Convert them one last time to the current units? For your evaluation, these are some diameters that will be converted. Before and after values are shown:');
			body.appendChild(p1);
			var p2 = document.createElement('p');
			p2.style.cssText = 'margin:0;font-weight:bold';
			p2.textContent = rows.join(', ');
			body.appendChild(p2);
		}, [
			// THREE answers, because there are three (Tom, 2026-08-10: "Third button: invent it").
			// Convert and Never both STAMP the version, which is what "answered" means here. Close
			// deliberately does not: its own label -- "so that I can check the current units first"
			// -- is a promise that the offer comes back, and it does, because the document is still
			// below LPN_DECLARATIVE_VERSION. Close still saves, so the units the project was opened
			// under are recorded even while its numbers stay unruled.
			{ label: pc.lpn_v2_restore_yes || 'Convert', fn: applyV2Restore },
			{ label: pc.lpn_v2_restore_never || 'No. Never ask again.', fn: stampDocAnswered },
			{ label: pc.lpn_v2_restore_no || 'Close so that I can check the current units first', fn: function () { saveToStorage(); } }
		]);
	}
	function openProject(id) {
		if (id === library.openId) { return true; }
		saveToStorage(); // flush the outgoing project before switching away from it
		flushOutgoingFile();
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
		flushOutgoingFile();
		var inheritedSettings = JSON.parse(JSON.stringify(settings));
		var inheritedLabels = JSON.parse(JSON.stringify(labelSettings));
		var id = newProjectId();
		// Computed BEFORE the push below, or the project would be counted against itself.
		var name = nextProjectName();
		doc = { nodes: [], links: [], labels: [] };
		nextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };
		scenarios = defaultScenarios();
		project = { name: name, activeScenario: 'base' };
		settings = inheritedSettings;
		labelSettings = inheritedLabels;
		backdrop = null;
		// A project created now is written by the current code, so its numbers are declarative and
		// its version is current. Without this it would inherit openDocVersion from whatever project
		// was open -- and a new project made while a v2 one was on screen would save as v2 and be
		// offered a conversion it does not need.
		openDocVersion = LPN_STORAGE_VERSION;
		library.projects.push({ id: id, name: name, updated: Date.now() });
		library.openId = id;
		clearUndo();
		saveToStorage();
		refreshAllFromDocument();
		// AFTER the refresh, not before: refreshAllFromDocument() schedules a solve, and that solve
		// calls saveToStorage(), which recomputes `dirty` against the baseline. Stamping first would
		// be undone by a network that has not changed. Same ordering landOpenedFile() uses.
		stampProjectSaved(id);
		return id;
	}
	// "As of right now, this project has no unsaved work." The baseline `dirty` is measured against.
	// A project with no baseline is dirty forever, which is what made a brand-new tab wear an
	// asterisk (Task 264 follow-up, Tom 2026-08-10).
	function stampProjectSaved(id) {
		var e = indexEntry(id || library.openId);
		if (!e) { return; }
		e.savedSig = docSignature();
		e.dirty = false;
		saveIndex();
		renderTabs();
	}
	// "Save as new project" -- Task 184's project-level copy, and the conventional reading of the
	// words (Tom, 2026-07-31: "New project" sounds like this, not like starting empty). Duplicates
	// the WHOLE project -- network, scenarios, overrides, backdrop and preferences together -- and
	// opens the copy, leaving the original on disk untouched. Task 184 wants copy at the PROJECT
	// level precisely because that is where a self-contained duplicate is what the user means.
	function saveProjectAs(name) {
		saveToStorage();
		flushOutgoingFile();
		var id = newProjectId(), copy = serializeProject();
		// A new docId, deliberately: a copy is a different document, and inheriting the original's
		// id would make the two fight over one lock -- and let a copy's autosave abort because
		// somebody was editing the original.
		copy.project = Object.assign({}, project, { name: name, docId: newDocId() });
		// Written and verified BEFORE anything switches: a backdrop image makes a project the one
		// thing here big enough to fail on quota, and a failed copy must leave the user exactly
		// where they were rather than half-moved into a project that does not exist.
		if (!writeJSON(projectKey(id), copy)) { return null; }
		library.projects.push({ id: id, name: name, updated: Date.now() });
		library.openId = id;
		project.name = name;
		// The in-memory document has to take the COPY's document id too, or the next saveToStorage()
		// would write the original's id back over the copy -- and the two would then fight over one
		// lock, which is the very thing the fresh id above exists to prevent. (Latent since Task 195
		// Phase 2 step 2; reachable now that Duplicate is a first-class tab-menu action.)
		project.docId = copy.project.docId;
		saveIndex();
		clearUndo();
		renderTabs();
		return id;
	}
	// ---- Export / import a project as a file (ROADMAP Task 195 Phase 1) ----
	// Everything above this line lives in localStorage and nowhere else, which a browser-data clear
	// wipes, which Safari evicts after roughly 7 unused days, and which private mode never persists
	// at all. These two functions are the way out of that -- a backup and hand-off of OUR format,
	// deliberately not EPANET `.inp` interop (Tom confirmed 2026-07-29 that interop is not wanted).
	// The stored shape is already exactly right for this: serializeProject() returns one
	// self-contained object per project, backdrop included, so the file IS the stored document.
	function safeFileName(name) {
		// Filesystem-illegal characters and control characters out; whitespace and dash runs
		// collapsed. Deliberately NOT a strip-to-ASCII, which would empty the filename of any
		// project named in a non-Latin script.
		var s = String(name)
			.replace(/[\\/:*?"<>|\u0000-\u001f]+/g, '-')
			.replace(/\s+/g, '-')
			.replace(/-{2,}/g, '-')
			.replace(/^-+|-+$/g, '');
		return s.slice(0, 60) || 'project';
	}
	// Indented on purpose. A project file is a backup and a hand-off, so someone will eventually
	// open one in an editor to see what is in it; the cost is a few percent on a small network,
	// and on a big one the backdrop's data URL dominates the size no matter what we do here.
	function projectFileText() { return JSON.stringify(serializeProject(), null, '\t'); }
	// Project name FIRST (Tom offered both orders, 2026-08-03). In an alphabetical folder listing a
	// common prefix makes every file look identical and pushes the one distinguishing part off the
	// end of the column; engineers scan these by project. The suffix still says where the file came
	// from, which is what someone finds a year later in a folder they have forgotten about.
	function projectFileName() { return safeFileName(projectDisplayName(project)) + '-lpn-hawsedc-engcalcs.json'; }
	// The Phase 1 path, and still the fallback wherever the File System Access API is missing
	// (Firefox and Safari today). A one-shot download: the browser owns where it lands and there is
	// no handle afterwards, so nothing can be written back to it.
	function downloadProjectFile() {
		var pcDl = EngCalcs.pageConfig || {};
		saveToStorage(); // export what is on screen, including edits not yet saved
		var text = projectFileText();
		var blob = new Blob([text], { type: 'application/json' });
		var url = URL.createObjectURL(blob), a = document.createElement('a');
		a.href = url;
		a.download = projectFileName();
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		// Deferred: revoking synchronously can beat the download off the mark in some browsers.
		setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
		// The download IS this browser's save, so record it as one. Without the baseline the asterisk
		// could never go out in Firefox, whatever the user did (punch-list finding 13).
		stampProjectSaved(library.openId);
		// Said every time, because it is the answer to the question this path always provokes:
		// "why did I get a second copy?" (Tom, 2026-08-03). The menu no longer carries that caveat
		// in its label, so this is where the fact lives.
		setNotice((pcDl.lpn_status_downloaded || 'Downloaded {file}. This browser cannot connect to a file, so this project stays marked as not saved to a file.')
			.replace('{file}', projectFileName()));
	}
	// Lands an imported document as a NEW project, never over the open one (the ROADMAP is explicit
	// about this, and it is what makes import safe to try). Written and verified BEFORE anything
	// switches, for the same reason saveProjectAs() is: an imported file carrying a backdrop is the
	// one thing here big enough to fail on quota, and a failed import must leave the user exactly
	// where they were. The second save, after applySaved(), rewrites the key with the STRUCTURALLY
	// REPAIRED document -- the missing-Base, dangling-activeScenario, reservoir-elevation and
	// merge-onto-current-defaults fixes applySaved() performs -- so an imported file is stored in
	// exactly the state a document that had always lived here would be.
	function importProject(saved) {
		var pc = EngCalcs.pageConfig || {};
		saveToStorage(); // flush the outgoing project before switching away from it
		flushOutgoingFile();
		var id = newProjectId();
		if (!writeJSON(projectKey(id), saved)) {
			alert(pc.lpn_import_no_room || 'There is not enough browser storage left to add this project. Delete a project you no longer need and try again.');
			return null;
		}
		applySaved(saved);
		library.projects.push({ id: id, name: project.name, updated: Date.now() });
		library.openId = id;
		clearUndo();
		saveToStorage();
		refreshAllFromDocument();
		// After refreshAllFromDocument(), which itself calls setStatus('') -- see the notice/
		// diagnostic split at setStatus(). Says where the user landed, the same way discardProject()
		// does: a project appearing on screen that was not there a moment ago wants narration.
		setNotice((pc.lpn_status_imported || 'Opened {name} from a file, and added it to this browser as a new project.')
			.replace('{name}', projectDisplayName(project)));
		return id;
	}
	// Text off a disk to a prepared document, or null with the reason already reported. Shared by
	// BOTH import paths -- the <input type=file> fallback and the File System Access handle -- so
	// the two can never drift into accepting different files.
	function acceptImportedText(text) {
		var pc = EngCalcs.pageConfig || {}, parsed = null;
		try { parsed = JSON.parse(text); } catch (err) { parsed = null; }
		var saved = prepareDocument(parsed);
		if (saved) { return saved; }
		// prepareDocument() reports a too-new file itself, and returns null either way; a second
		// alert on top of that one would be noise, so only the not-a-project case speaks here.
		if (parsed && typeof parsed.v === 'number' && parsed.v > LPN_STORAGE_VERSION) { return null; }
		alert(pc.lpn_import_bad_file || 'That file could not be read as a project saved from this page.');
		return null;
	}
	function importProjectFromFile(file) {
		var pc = EngCalcs.pageConfig || {}, reader = new FileReader();
		reader.onload = function (ev) {
			var saved = acceptImportedText(ev.target.result);
			if (!saved) { return; }
			var upId = importProject(saved);
			// **An uploaded project arrives SAVED, not modified** (Tom, 2026-08-10: "when you open a
			// file, it comes in immediately modified/asterisked. Fix that."). The same baseline the
			// download path records, for the same reason: a file the user just handed us off their
			// own disk is not unsaved work.
			//
			// It stays a BROWSER project and the star still comes back on the first edit (faint,
			// because this browser genuinely cannot write back to that file). What changed is only
			// that "unsaved" now starts false, which is the truth.
			if (upId) { stampProjectSaved(upId); }
			// Every time, not just the first: this is the fact that explains why the tab is named
			// after the project rather than the file, and why Save cannot go back where this came from.
			setNotice(pc.lpn_status_uploaded || '');
			renderTabs();
		};
		reader.onerror = function () { alert(pc.lpn_import_bad_file || 'That file could not be read as a project saved from this page.'); };
		reader.readAsText(file);
	}

	// ---- Live file handles (ROADMAP Task 195 Phase 2, step 1) ----
	// Phase 1 hands you a copy; this makes the FILE the thing you are working in. `showSaveFilePicker`
	// / `showOpenFilePicker` return a real `FileSystemFileHandle`, and a dirty-flag timer writes the
	// open project back to it as you work.
	//
	// **localStorage remains the authority; a file link is additive.** This resolves the ROADMAP's
	// second open question ("live inside the existing per-project document, or rework the project
	// library into a thin cache over real files") in favor of the first, and the browser-support
	// question above it is what decides: the API is Chromium-only, so a library that was really a
	// cache over files would have no story at all for Firefox and Safari except keeping the
	// localStorage path anyway -- two authorities, and every bug twice. Keeping localStorage
	// authoritative also means every Phase 1 guarantee (quota-safe writes, adoptOrphans() self-
	// healing, migrate-on-read) keeps working untouched, and a user can unlink and still have their
	// project.
	//
	// **NOTHING IS WRITTEN TO A FILE EXCEPT WHEN THE USER ASKS** (Task 211, 2026-08-04). Task 195 wrote
	// the open project back on a 60-180 s timer; that is gone, on Tom's argument that a program which
	// saves your file behind your back takes away your right to walk away from a session -- the
	// ordinary Save / Discard / Cancel conversation is only possible if the file has not already been
	// overwritten by the time you reach it. The crash net is localStorage, written on every edit
	// regardless. Deliberately NOT a sibling .bak file: that is a second artifact in the engineer's
	// folder that we cannot reliably clean up and that they would have to explain to somebody.
	//
	// This Map is **the live connections for this page**; the handles themselves outlive it in
	// IndexedDB (Task 212), and restoreHandlesOnBoot() refills this Map on the way back in. Where
	// that fails, `entry.fileName` still outlives the handle, so a reloaded tab keeps its identity
	// and says what it needs (lpn_file_needs_reopen) instead of silently demoting itself to a browser
	// project.
	//
	// async/await rather than this file's usual ES5 idiom: every one of these calls is a promise, and
	// the .then() version of acquire-write-close-recover is markedly harder to read. The syntax costs
	// nothing here -- it is older than the File System Access API this code path requires.
	var fileHandles = new Map(); // project id -> FileSystemFileHandle, live for this page

	// ---- Handles that outlive the page (ROADMAP Task 212) ----
	//
	// A FileSystemFileHandle is structured-cloneable, so IndexedDB can keep it across a reload --
	// localStorage cannot, which is why this needs a second store rather than joining the index.
	// The PERMISSION does not travel with it: on the way back queryPermission() answers 'granted'
	// (reconnect silently), 'prompt' (one click, and the click is the user gesture the API demands)
	// or 'denied'.
	//
	// Before this, every reload dropped every connection and the only route back was Save as or
	// opening the file again -- which Tom hit on every single reload while testing, three times in
	// one evening. Everything else about a reloaded file project was a workaround for this.
	var LPN_IDB_NAME = 'engcalcs-lpn';
	var LPN_IDB_STORE = 'handles';
	// Task 258: the recent-files list. A SECOND store rather than more rows in `handles`, because
	// the two have opposite lifetimes -- `handles` is keyed by project id and is deleted the moment
	// that project is closed (that is what makes a closed project gone), while the whole point of a
	// recent list is to outlive the project it came from.
	var LPN_IDB_RECENT = 'recent';
	function idbOpen() {
		return new Promise(function (resolve) {
			if (!window.indexedDB) { resolve(null); return; }
			var req;
			// Version 2 adds LPN_IDB_RECENT. The upgrade only ever CREATES missing stores, so a
			// browser arriving from version 1 keeps every handle it had.
			try { req = window.indexedDB.open(LPN_IDB_NAME, 2); }
			catch (err) { resolve(null); return; }
			req.onupgradeneeded = function () {
				var db = req.result;
				if (!db.objectStoreNames.contains(LPN_IDB_STORE)) { db.createObjectStore(LPN_IDB_STORE); }
				if (!db.objectStoreNames.contains(LPN_IDB_RECENT)) { db.createObjectStore(LPN_IDB_RECENT); }
			};
			req.onsuccess = function () { resolve(req.result); };
			// Private browsing, a disabled store, a quota refusal: all of them mean "no persistence",
			// never "no calculator". Every caller treats null as "behave as we did before Task 212".
			req.onerror = function () { resolve(null); };
			req.onblocked = function () { resolve(null); };
		});
	}
	function idbRun(mode, fn, storeName) {
		return idbOpen().then(function (db) {
			if (!db) { return null; }
			return new Promise(function (resolve) {
				var tx, store, out = null, which = storeName || LPN_IDB_STORE;
				try {
					tx = db.transaction(which, mode);
					store = tx.objectStore(which);
				} catch (err) { resolve(null); return; }
				try { out = fn(store); } catch (err) { resolve(null); return; }
				tx.oncomplete = function () { db.close(); resolve(out && out.result !== undefined ? out.result : out); };
				tx.onerror = function () { db.close(); resolve(null); };
				tx.onabort = function () { db.close(); resolve(null); };
			});
		});
	}
	function rememberHandle(id, handle) {
		// Every route that connects a project to a file lands here -- Open, Save as, and re-opening a
		// file that is already a tab -- so this is the one chokepoint the recent list needs. Boot
		// restoration deliberately does NOT come through here (restoreHandlesOnBoot sets the Map
		// directly): reopening the page is not using a file, and letting it reorder the list would
		// mean the list said "most recently reloaded" instead of "most recently opened".
		noteRecentFile(handle);
		return idbRun('readwrite', function (st) { return st.put(handle, id); });
	}
	function forgetHandle(id) { return idbRun('readwrite', function (st) { return st.delete(id); }); }

	// ---- Recent files (ROADMAP Task 258) ----
	//
	// Deferred out of Task 212 ("Still deferred: Open Recent") and asked for again by Tom
	// 2026-08-10. The list is FILES, not projects: a project you closed was discarded on purpose and
	// there is nothing left of it to reopen, whereas the file it was saved to is still on the disk
	// and is exactly what somebody means by "the thing I was working on yesterday".
	//
	// Stored as ONE record holding the whole array, not a row per file. The array is short and is
	// always read and written whole (dedupe and cap both need to see all of it), so a keyed store
	// would have bought nothing but a second round of key management. A FileSystemFileHandle is
	// structured-cloneable, and so is an array of them.
	var LPN_RECENT_MAX = 8;
	var recentFiles = [];   // [{handle, name, at}], most recent first; mirrors the store
	function loadRecentFiles() {
		return idbRun('readonly', function (st) { return st.get('list'); }, LPN_IDB_RECENT)
			.then(function (rows) {
				recentFiles = (Array.isArray(rows) ? rows : []).filter(function (r) { return r && r.handle; });
			})
			.catch(function () { recentFiles = []; });
	}
	function saveRecentFiles() {
		return idbRun('readwrite', function (st) { return st.put(recentFiles, 'list'); }, LPN_IDB_RECENT);
	}
	// Dedupe is by isSameEntry() where the browser has it -- the same question Save as asks before it
	// clobbers, and the only honest answer to "is this the same file?" Two different folders can hold
	// two different Main-St.json, and a name match would have quietly collapsed them into one row
	// pointing at whichever was touched last. Falls back to the name only where isSameEntry is
	// missing, which is the best that browser can do.
	async function sameFile(a, b) {
		if (!a || !b) { return false; }
		if (a === b) { return true; }
		if (a.isSameEntry) { try { return await a.isSameEntry(b); } catch (err) { /* fall through */ } }
		return a.name === b.name;
	}
	async function noteRecentFile(handle) {
		if (!handle || !handle.name) { return; }   // landOpenedFile reaches rememberHandle with no handle
		var kept = [];
		for (var i = 0; i < recentFiles.length; i++) {
			if (!(await sameFile(recentFiles[i].handle, handle))) { kept.push(recentFiles[i]); }
		}
		kept.unshift({ handle: handle, name: handle.name, at: Date.now() });
		recentFiles = kept.slice(0, LPN_RECENT_MAX);
		saveRecentFiles();
	}
	// A handle that no longer resolves -- the file was moved, renamed or deleted -- is dropped rather
	// than left in the menu to fail a second time.
	async function dropRecentFile(handle) {
		var kept = [];
		for (var i = 0; i < recentFiles.length; i++) {
			if (!(await sameFile(recentFiles[i].handle, handle))) { kept.push(recentFiles[i]); }
		}
		recentFiles = kept;
		saveRecentFiles();
	}
	function recallHandles() { return idbRun('readonly', function (st) { return st.getAll ? st.getAll() : null; }); }
	function recallHandleKeys() { return idbRun('readonly', function (st) { return st.getAllKeys ? st.getAllKeys() : null; }); }

	// 'granted' | 'prompt' | 'denied' | '' (API missing). Never throws.
	async function handlePermission(handle, ask) {
		if (!handle) { return ''; }
		var opts = { mode: 'readwrite' };
		try {
			if (ask) {
				if (!handle.requestPermission) { return ''; }
				return await handle.requestPermission(opts);
			}
			if (!handle.queryPermission) { return ''; }
			return await handle.queryPermission(opts);
		} catch (err) { return ''; }
	}
	var fileWriteBusy = false;   // a write is in flight; never start a second one over it
	var fileError = false;
	function fileApiAvailable() { return typeof window.showSaveFilePicker === 'function'; }
	function fileTypes() {
		var pc = EngCalcs.pageConfig || {};
		return [{ description: pc.lpn_file_type_desc || 'Project file', accept: { 'application/json': ['.json'] } }];
	}
	// Same honesty rule setStorageError() follows: a user who thinks they are editing a file must be
	// told the moment they are not. Cleared by the next write that succeeds.
	// A failed write is reported in the BANNER, not the status line, and carries the way out with it
	// (Tom, 2026-08-03: "Local file not found. Please select project file."). A status message that
	// tells someone to go and find a menu item is a worse answer than a button that does it.
	// Distinct from setFileError (the file is GONE) -- this one means the file is very much there and
	// is not ours any more. Same banner slot, different sentence, because the recovery differs: a
	// missing file wants relinking, a changed file wants Save as or Revert.
	var fileChangedFlag = false;
	function setFileChangedElsewhere(on) {
		var pc = EngCalcs.pageConfig || {};
		// **A fresh refusal always speaks, even after a Dismiss** (fixed 2026-08-06, found by the
		// browser pass). This used to return early whenever the flag was already set -- but Dismiss
		// clears the BANNER, not the flag, so the second Save refused in complete silence: the file
		// was protected and the user was told nothing at all. A Save that does nothing without
		// saying why is the same defect as a Save that overwrites without asking, seen from the
		// other side. Only the "all clear" direction is allowed to be a no-op.
		if (!on) {
			if (!fileChangedFlag) { return; }
			fileChangedFlag = false;
			clearWarn('changed');
			return;
		}
		fileChangedFlag = true;
		bannerWarn = {
			kind: 'changed',
			message: (pc.lpn_file_changed_elsewhere || 'Somebody else has saved to this file since you opened it, so saving now would write over their work. Use File, Save as to keep your changes in a file of your own, or File, Revert to throw yours away and load theirs.'),
			dismissable: true
		};
		renderBanner();
	}
	// **Every fresh failure speaks**, for the same reason setFileChangedElsewhere() does: the banner is
	// dismissable, so an early return on "we already knew that" turns the second failed Save into
	// silence. Only the all-clear direction is allowed to be a no-op.
	function setFileError(on) {
		if (!on) {
			if (!fileError) { return; }
			fileError = false;
			setFileMissing(false);
			return;
		}
		fileError = true;
		setFileMissing(true);
	}
	// What the file looked like the last time we read or wrote it, per project id. This is the whole
	// basis of the freshness check below: not a lock, not a name, but "is the file still the one I
	// last saw?". A number we own, so a broker outage cannot weaken it.
	//
	// **It outlives the page, in the index beside `fileName`** (fixed 2026-08-05, found by Tom:
	// "Still doesn't work with broker blocked. Save is apparently allowed as normal."). Held only in
	// this Map, the stamp died on every reload, and Task 212 then re-stamped the file on the way back
	// in -- so a reload silently ADOPTED whatever a colleague had written since as our own baseline,
	// and the next Save wrote our older copy straight over their work with nothing said. A reload is
	// the one moment this check most needs to survive, because it is the moment the page has been
	// away and the file has had time to change.
	var fileStamps = new Map();
	function knownStamp(id) {
		if (fileStamps.has(id)) { return fileStamps.get(id); }
		var e = indexEntry(id);
		return (e && e.fileStamp) || '';
	}
	// Returns the stamp it recorded, or '' if the file could not be read. The return value is what
	// makes it double as the post-write READBACK check below.
	async function stampFile(id, handle) {
		if (!handle || !handle.getFile) { return ''; }
		var entry = indexEntry(id), stamp = '';
		try { var f = await handle.getFile(); stamp = f.lastModified + ':' + f.size; }
		catch (err) { stamp = ''; }
		if (stamp) { fileStamps.set(id, stamp); } else { fileStamps.delete(id); }
		// Written through to the index, which is where it has to be to survive a page load. A file we
		// could not read leaves NO stamp rather than a stale one: an unanswerable question fails open
		// below, and a wrong answer here would fail closed on an innocent Save.
		if (entry && entry.fileStamp !== stamp) {
			if (stamp) { entry.fileStamp = stamp; } else { delete entry.fileStamp; }
			saveIndex();
		}
		return stamp;
	}
	// **Is the file we were connected to still there at all?**
	//
	// Tom, 2026-08-06, after the read-back fix went in: *"It saves silently."* He had moved the file
	// in Explorer, and the save still reported success — because it WAS a success. A handle whose
	// file has been moved or deleted does not fail on write: `createWritable()` RECREATES the file at
	// the old path, so the bytes land, the read-back matches, and every check we had was satisfied.
	// The user is then editing a file they did not choose, in a folder they moved it out of, with a
	// second copy of their project sitting where the first one used to be. (OPFS behaves the same
	// way, which is why the browser pass can now test this instead of skipping it.)
	//
	// **SAVE MUST NEVER CREATE A FILE.** That is the rule, and it is simpler and stronger than the
	// baseline test this started as (2026-08-06, third report of the same symptom: *"It saves silently
	// to a new file."*). The user chose this file in a picker once; if it cannot be read now, it is
	// not there, and writing anyway invents a file in a folder they moved it out of. Creating files is
	// Save AS's job, and Save as asks.
	//
	// Deliberately independent of `knownStamp()`: a missing baseline is a reason to be MORE careful,
	// not less, and tying the guard to one left exactly the hole the symptom kept coming back through.
	// A transient read error therefore refuses a save — with a banner and a picker to fix it — which
	// is the right way round for a page whose worst failure mode is believing it has saved.
	//
	// The pair asks two different questions: `fileChangedUnderneath` is "is this still the same
	// file?", and this is "is there a file here at all?".
	// **`getFile()` SUCCEEDING IS NOT PROOF THE FILE IS THERE** (Tom, 2026-08-06, fourth report of the
	// same silent save, with the file confirmed deleted before every attempt). `getFile()` hands back
	// a File object built from what the browser already knows -- name, size, lastModified -- and on
	// Windows it can do that for a path with nothing at it any more. The error surfaces when
	// something actually reads the bytes, which nothing here was doing. Every check built on top of
	// it was therefore asking the browser's memory, not the disk.
	//
	// So read a byte. One byte, off a slice, is a real disk touch and costs nothing next to the
	// several hundred kilobytes a save writes. This is also why `fileChangedUnderneath()` could not
	// be trusted to notice on its own: it compares metadata that may be as stale as this.
	async function fileVanished(id, handle) {
		if (!handle || !handle.getFile) { return false; }
		try {
			var f = await handle.getFile();
			await f.slice(0, 1).arrayBuffer();
			return false;
		} catch (err) { return true; }
	}
	// Has somebody else written to this file since we last saw it?
	//
	// Returns false when the question cannot be answered (unreadable file, no stamp on record). That
	// fails OPEN deliberately: this check exists to catch a KNOWN divergence, and must never become a
	// reason an ordinary Save stops working.
	async function fileChangedUnderneath(id, handle) {
		var known = knownStamp(id);
		if (!known || !handle || !handle.getFile) { return false; }
		try { var f = await handle.getFile(); return (f.lastModified + ':' + f.size) !== known; }
		catch (err) { return false; }
	}
	// Writes the OPEN project to its file. The ONLY function in this file that writes to disk, and it
	// runs only from an explicit Save. Resolves true only when bytes actually landed.
	async function writeOpenProjectToFile() {
		var id = library.openId, handle = handleFor(id);
		if (!handle || fileWriteBusy) { return false; }
		// **Read-only means read-only** (Tom, 2026-08-04). There is no path from here to writing
		// somebody else's file -- not on a timer, not on Save, and not if their lock frees up while we
		// are looking. Their file has moved on since we opened it, so our copy is OLDER; writing it
		// over theirs would destroy work. Save As is the only way out, and saveCurrent() routes there.
		if (readOnly) { return false; }
		fileWriteBusy = true;
		try {
			// Scenario C, the walk-away recovery: re-check the lock BEFORE the write. Re-acquiring a
			// lock we already hold doubles as the heartbeat, so this one call both proves we may still
			// write and refreshes lastActivity for whoever is looking from the other end.
			if (currentLockDocId()) {
				var lockNow = await postLock('acquire', currentLockDocId());
				if (lockNow && lockNow.ok && lockNow.held && lockUnavailable) {
					lockUnavailable = false;
					setLockUnavailable(false);
				}
				// **The onset was missing, only the recovery was here** (found by the browser pass,
				// 2026-08-06). This block would clear the "locking is not working" banner when the
				// broker came back, but nothing raised it when the broker went away DURING a session
				// -- so a Save that could not check the lock went through in silence, at the exact
				// moment the risk is real: writing to a shared file with nothing coordinating you.
				// The write itself is still allowed (the freshness check is the guarantee, not the
				// lock), but it must not be quiet about it.
				if (!lockNow || !lockNow.ok) {
					lockErrorCode = (lockNow && lockNow.error) || '';
					lockUnavailable = true;
					setLockUnavailable(true);
				}
				if (lockNow && lockNow.ok && !lockNow.held) {
					// Somebody else has it now. Abort rather than clobber their file. The work is not
					// lost -- localStorage has every edit -- and the banner says so.
					enterReadOnly(lockHolderName(lockNow));
					return false;
				}
			}
			// Gone entirely, rather than merely different. Checked BEFORE the freshness comparison
			// because that one cannot answer this: an unreadable file leaves it with nothing to
			// compare and it fails open, which is right for "we never had a baseline" and exactly
			// wrong for "the file we had is missing".
			if (await fileVanished(id, handle)) {
				setFileError(true);
				return false;
			}
			// **THE GUARANTEE** (Tom, 2026-08-05). The lock above is a courtesy and can be stale --
			// deliberately so, now that a claim survives a minimise. What actually protects a
			// colleague's work is this: if the bytes on disk are not the bytes we last saw, somebody
			// wrote to this file since, and our copy is older. Refuse, and let Save as or Revert be
			// the way out. This holds when the broker is down, when a lock was cleared by hand, and
			// when two people were simply never locked against each other at all.
			if (await fileChangedUnderneath(id, handle)) {
				setFileChangedElsewhere(true);
				return false;
			}
			// Captured WITH the text, and compared again after the awaits: an edit made while the
			// write is in flight must not be recorded as being in a file that does not contain it.
			var sigWritten = docSignature(), text = projectFileText();
			var writable = await handle.createWritable();
			await writable.write(text);
			await writable.close();
			// **A WRITE IS NOT A SAVE UNTIL YOU CAN READ IT BACK** (Tom, 2026-08-06, on a file he had
			// moved in Explorer: *"It neither complains nor creates a new file. It silently fails to
			// save."*). Everything above can resolve without a byte reaching the disk the user is
			// looking at -- a handle whose file has been moved or deleted, a revoked permission, a
			// sync client holding the path. So the file is read back and its SIZE compared with what
			// we just wrote. Cheap, because the stamp has to be re-read here anyway.
			//
			// Byte length, not `text.length`: the file is UTF-8, and a project with any non-ASCII in
			// a label would fail this check forever if it were compared in characters.
			lastSaveAt = Date.now();
			var stamped = await stampFile(id, handle);
			var wroteBytes = new Blob([text]).size;
			if (!stamped || parseInt(stamped.split(':')[1], 10) !== wroteBytes) {
				setFileError(true);
				return false;
			}
			setFileError(false);
			var entry = indexEntry(id);
			if (entry) {
				entry.savedSig = sigWritten;
				entry.dirty = docSignature() !== sigWritten;
				saveIndex();
				renderTabs();
			}
			return true;
		} catch (err) {
			// Most likely causes: the file was moved/deleted, or permission was withdrawn. We do NOT
			// call requestPermission() here -- it needs a user activation this may not have, so it
			// would fail a second time and teach the user nothing. The banner's "Choose the file
			// again" button DOES have an activation, and is the honest recovery.
			setFileError(true);
			return false;
		} finally {
			fileWriteBusy = false;
		}
	}
	// Called before any switch of library.openId. Under Task 211 a project that is not current is
	// still OPEN -- it is a tab -- so this does NOT release its lock or write its file. It only moves
	// the banner's attention: the warnings on screen describe the project you are looking at.
	//
	// Nothing is flushed here because nothing is ever written without being asked. The outgoing
	// project keeps its asterisk, and that asterisk is the whole reminder.
	function flushOutgoingFile() {
		setFileError(false);
		syncReadOnlyToOpenProject();
	}
	// Shown once per browser, before the first file picker ever opens (Tom, 2026-08-03). Built as a
	// PANEL with its own Continue button rather than a confirm() or alert(), for a hard technical
	// reason as well as a readability one: showSaveFilePicker() requires a live user activation, and
	// Chrome's transient activation expires after a few seconds -- long enough to read three
	// sentences and no longer. A blocking dialog would therefore work for a fast reader and throw
	// "must be handling a user gesture" for a careful one. Continue is a fresh click, so it always
	// has an activation of its own.
	var pendingFileAction = null;
	function requireFileIdentity(action) {
		if (loadIdentity()) { return true; }
		pendingFileAction = action;
		showFileTraining();
		return false;
	}
	function showFileTraining() {
		var pc = EngCalcs.pageConfig || {}, input = null;
		openDialog(function (body) {
			[pc.lpn_file_training_1, pc.lpn_file_training_2, pc.lpn_file_training_permission, pc.lpn_file_training_3].forEach(function (t) {
				if (!t) { return; }
				var p = document.createElement('p');
				p.style.margin = '0 0 8px';
				p.textContent = t;
				body.appendChild(p);
			});
			var label = document.createElement('label');
			label.textContent = (pc.lpn_file_training_name || 'Your initials') + ' ';
			input = document.createElement('input');
			input.type = 'text'; input.maxLength = 60; input.style.marginLeft = '4px';
			label.appendChild(input);
			body.appendChild(label);
		}, [
			{
				label: pc.lpn_file_training_continue || 'Continue',
				fn: function () {
					// An empty name is allowed. Colleagues then see lpn_lock_somebody, which is worse
					// for them but is the user's call to make -- refusing to continue would be a gate
					// on a feature whose whole point is that there is no login.
					identity = { holder: randomToken(24), name: input.value.trim().slice(0, 60) };
					writeJSON(LPN_IDENTITY_KEY, identity);
					var next = pendingFileAction;
					pendingFileAction = null;
					if (next === 'open') { openFromFile(); } else if (next === 'saveas') { saveAs(); } else { saveCurrent(); }
				}
			},
			// A way out. The panel is shown by an action the user chose, so backing out of it has to
			// be possible -- without this, a first-time visitor who pressed Save to see what it did
			// would have a dialog with no answer but "give me your initials".
			{
				label: pc.lpn_cancel || 'Cancel',
				fn: function () { pendingFileAction = null; }
			}
		]);
		if (input) { input.focus(); }
	}
	// A file project's project NAME is its file's base name -- one name, not two (Task 211,
	// Amendment 2). Task 195 had a Rename that renamed the project and a Save that wrote the file,
	// each correct alone and a permanent trap together: Tom renamed a project, pressed Save, and it
	// silently wrote the old file name. With the two fused, Rename on a file project IS Save As.
	function projectNameFromFileName(fname) {
		var s = String(fname).replace(/\.json$/i, '').replace(/-lpn-hawsedc-engcalcs$/i, '');
		return s || String(fname);
	}
	// File -> Save. Writes the file this project came from, and asks nothing.
	async function saveCurrent() {
		var pc = EngCalcs.pageConfig || {};
		// Unreachable from the menu where the API is missing -- the row is disabled there -- but
		// routed rather than left to fall through, so no future caller can make Save mean "download".
		if (!fileApiAvailable()) { await saveAs(); return; }
		if (!requireFileIdentity('save')) { return; }
		// Two different "we have no file we may write" cases, one answer. READ-ONLY: somebody else has
		// it, and their file is newer than ours, so Save As is the only honest destination -- there is
		// deliberately no "the file is free now, save over it?" offer (Tom, 2026-08-04: that would
		// overwrite a colleague's changes). NO LIVE HANDLE: a browser project that has never been
		// saved, or a file project whose page has been reloaded since -- a browser does not keep
		// permission to a file across a page load.
		// Read-only: Save does nothing at all. It is disabled in the File menu and this is the belt to
		// that brace. It deliberately does NOT fall through to Save as -- Tom, 2026-08-05: "Save is
		// disabled as it should be" -- because a Save that silently becomes a different command is
		// how someone ends up with a file they did not mean to create.
		if (readOnly) { return; }
		if (!isLinked(library.openId)) { await saveAs(); return; }
		saveToStorage();
		var entry = indexEntry(library.openId);
		if (await writeOpenProjectToFile()) {
			setNotice((pc.lpn_status_saved || 'Saved {file}.').replace('{file}', (entry && entry.fileName) || ''));
		}
	}
	function dirtyFileCount() {
		return library.projects.filter(function (p) { return isFileProject(p) && p.dirty; }).length;
	}
	// File -> Save all. Walks the dirty file projects, opening each in turn -- a save writes the OPEN
	// project, so there is no second write path to keep in step with the first. Read-only tabs and
	// tabs whose handle died with the last page load are skipped rather than made to interrupt with a
	// file picker each; "save all" must never turn into a queue of dialogs.
	async function saveAllFiles() {
		var startAt = library.openId;
		var todo = library.projects.filter(function (p) {
			return isFileProject(p) && p.dirty && isLinked(p.id) && !roProjects.has(p.id);
		}).map(function (p) { return p.id; });
		for (var i = 0; i < todo.length; i++) {
			if (todo[i] !== library.openId) { openProject(todo[i]); }
			saveToStorage();
			await writeOpenProjectToFile();
		}
		if (startAt && startAt !== library.openId) { openProject(startAt); }
		renderTabs();
	}
	// What is in the file we are about to write over? Two independent answers, because they have
	// very different reliability:
	//
	//   .heldBy  -- somebody has it open. Needs the broker, so it is ABSENT whenever the broker is.
	//   .foreign -- the file already holds a DIFFERENT project of ours. Needs nothing but the file.
	//
	// Tom's 2026-08-05 retest is why the second exists. The first version of this guard asked only
	// the broker, so on a server whose lock directory was not writable it answered "no collision" to
	// everything and Save as sailed over a colleague's file exactly as before -- the fix reproduced
	// the bug it was written for. A guard against destroying somebody's work must not depend on a
	// server being up. The file itself is always there to be read.
	async function inspectSaveTarget(handle) {
		var pc = EngCalcs.pageConfig || {};
		var out = { foreign: false, name: '', heldBy: '', stale: false };
		if (!handle || !handle.getFile) { return out; }
		var text, parsed, docId, r, f, stamp = '';
		try { f = await handle.getFile(); text = await f.text(); stamp = f.lastModified + ':' + f.size; }
		catch (err) { return out; }
		if (!text) { return out; }                  // a brand-new empty file: nothing to lose
		try { parsed = JSON.parse(text); } catch (err) { return out; }
		docId = parsed && parsed.project && parsed.project.docId;
		if (!docId) { return out; }                 // not one of ours; the user's business
		// **The freshness check belongs on THIS path too** (fixed 2026-08-06 -- Tom, twice: "Still
		// doesn't work with broker blocked. Save is apparently allowed as normal."). Save as is not a
		// lesser write: read-only routes Save straight here, and so does a tab that lost its handle,
		// so "our own file" is exactly the file a colleague is most likely to have moved on. The
		// exemption below said any file carrying our own docId was safe to overwrite -- which is true
		// of the file we last wrote and false of the file somebody else has written since. Needs the
		// broker for nothing: it is the same stamp comparison writeOpenProjectToFile() makes.
		var owner = projectWithDocId(docId), base = owner ? knownStamp(owner) : '';
		out.stale = !!(base && stamp && stamp !== base);
		out.name = (parsed.project && parsed.project.name) || '';
		// A file carrying our OWN docId is never "a different project" -- naming it as one would ask
		// the user about a collision with themselves. It can still be stale, and it can still be held
		// by somebody who took it, so it goes on to the broker rather than returning early as it used
		// to: that early return is why Save as could write over a file a colleague had just taken.
		if (docId !== (project && project.docId)) { out.foreign = true; }
		r = await postLock('check', docId);
		if (r && r.ok && r.locked && !r.mine) {
			out.heldBy = r.lockedBy || pc.lpn_lock_somebody || 'Somebody else';
		}
		return out;
	}
	// File -> Save as. Also the answer to Rename on a file project, to a read-only tab that wants to
	// keep its work, and to the first save of a browser project.
	async function saveAs() {
		var pc = EngCalcs.pageConfig || {};
		if (!fileApiAvailable()) { downloadProjectFile(); return; }
		if (!requireFileIdentity('saveas')) { return; }
		var id = library.openId, entry = indexEntry(id);
		if (!entry) { return; }
		var forking = readOnly || isFileProject(entry);
		var wasHandle = handleFor(id);
		// A copy needs a name of its own -- two projects cannot share one, and a picker pre-filled
		// with the original's name invites overwriting the very file we are copying away from.
		var suggested = forking
			? safeFileName(projectDisplayName(project) + ' ' + (pc.lpn_project_copy_suffix || '(copy)')) + '-lpn-hawsedc-engcalcs.json'
			: projectFileName();
		var handle;
		try { handle = await window.showSaveFilePicker({ suggestedName: suggested, types: fileTypes() }); }
		catch (err) { return; } // the user cancelled the picker -- not an error
		// **NEVER WRITE OVER A FILE SOMEBODY ELSE HAS OPEN** -- asked of the file actually chosen in
		// the picker, which is the only question that matters.
		//
		// The previous guard (`readOnly && wasHandle.isSameEntry(handle)`) was wrong twice and Tom's
		// 2026-08-05 browser pass destroyed a colleague's file through both holes: it ran only when
		// THIS tab was the locked-out one, so an ordinary editable project could overwrite anything;
		// and it compared against this project's own previous handle, so it could only ever protect
		// the single file you were already locked out of.
		//
		// Identity is the `docId` INSIDE the target file, never its name -- Tom overwrote
		// `Project2.json` from a project called `Project1`, and a same-name copy in another folder is
		// perfectly legitimate. So read the file we are about to clobber, and if it is one of ours
		// and somebody is holding it, refuse. A file that is empty, unreadable, or not one of our
		// projects has no docId and no lock: the user has chosen to overwrite something unrelated,
		// which is their business.
		var target = await inspectSaveTarget(handle);
		if (target.heldBy) {
			// Somebody is in it right now. Not negotiable.
			alert(pc.lpn_saveas_same_file || 'That is the same file somebody else has open, so it cannot be saved over. Choose a different file or a different name.');
			return;
		}
		// The file has moved on since we last saw it. Asked BEFORE the foreign question because it is
		// the more specific fact: a stale file is one we know somebody has written to, where "foreign"
		// only knows it holds a project that is not the one in front of us. Needs no server.
		if (target.stale) {
			var warnStale = (pc.lpn_saveas_overwrites_newer || 'That file has changed since you last saw it, so somebody else has almost certainly saved to it. Saving here replaces their version with yours. Continue?')
				.replace('{name}', target.name || (pc.lpn_lock_somebody || 'Somebody else'));
			if (!window.confirm(warnStale)) { return; }
		}
		if (target.foreign) {
			// Nobody has it open -- or nobody we can ASK, which from here is the same thing. Still a
			// whole project about to be destroyed, so name it and let the user decide. This branch
			// works with the broker down, which is the entire point.
			var warn = (pc.lpn_saveas_overwrites_project || 'That file already holds a different project, {name}. Saving here replaces it completely. Continue?')
				.replace('{name}', target.name || (pc.lpn_lock_somebody || 'Somebody else'));
			if (!window.confirm(warn)) { return; }
		}
		// Writing somewhere new makes this a DIFFERENT document, so it needs its own lock key: a copy
		// and its original must never contend over one lock, and a copy must never be able to abort
		// its own save because somebody is editing the original. Only a browser project's FIRST save
		// keeps its id, because there was no other file to be a copy of.
		if (forking) {
			releaseLock(id);
			project.docId = newDocId();
			roProjects.delete(id);
			syncReadOnlyToOpenProject();
		} else {
			// BEFORE the first write, not after (fixed 2026-08-04, found by Tom in browser testing).
			// The lock key used to be minted after the write, so the first file a project ever wrote
			// had none -- and a colleague opening that file minted a DIFFERENT one, so the two
			// browsers computed different lock keys and the broker never saw the conflict. The lock
			// key has to exist before the file that carries it does.
			ensureDocId();
		}
		fileHandles.set(id, handle);
		rememberHandle(id, handle); // survives the next reload (Task 212)
		await stampFile(id, handle); // adopt whatever is there now; the very next write is ours
		setFileChangedElsewhere(false); // a different file; the old warning does not follow us
		entry.fileName = handle.name;
		// **Saving must not RENAME the project** unless the user actually chose a different name in
		// the picker (found 2026-08-05 while verifying Tom's "Project1" change). A project called
		// "Main St. / Phase 2" is offered the filename "Main-St.-Phase-2-..." -- because a filesystem
		// cannot hold "/" -- and blindly reading the name back off the file imported those
		// substitutions into the project name, silently. The user never asked to be renamed; they
		// asked to be saved.
		//
		// So: if the file is the one we suggested, the name is unchanged. Only a filename the user
		// actually typed becomes the new project name, which is what makes Save-as-rename still work.
		if (handle.name !== suggested) { project.name = projectNameFromFileName(handle.name); }
		entry.name = project.name;
		saveToStorage();
		saveIndex();
		if (await writeOpenProjectToFile()) {
			setNotice((pc.lpn_status_saved || 'Saved {file}.').replace('{file}', handle.name));
		}
		renderTabs();
		// AFTER the handle is in place, not before (fixed 2026-08-04 -- Tom: the needs-reopen banner
		// "doesn't go away after I reconnect the file"). The forking branch above calls this too, but
		// it runs while isLinked() is still false, so it re-raised the very banner the user had just
		// answered. Anything that changes whether a project HAS a live handle has to end with this.
		syncReadOnlyToOpenProject();
		acquireLockForOpenProject();
	}
	// File -> Revert. The counterpart to Discard-on-close, and the only escape from a bad twenty
	// minutes now that nothing is written on a timer. Also the "re-read from disk" primitive a
	// repaired Take over will need (see Task 195's 2026-08-04 withdrawal of it).
	async function revertCurrent() {
		var pc = EngCalcs.pageConfig || {}, id = library.openId;
		var entry = indexEntry(id), handle = handleFor(id);
		if (!entry || !handle) { return; }
		if (!window.confirm((pc.lpn_revert_confirm || 'Throw away the changes you have made and load {file} again from the disk?').replace('{file}', entry.fileName))) { return; }
		var text;
		try { text = await (await handle.getFile()).text(); }
		catch (err) { setFileError(true); return; }
		var saved = acceptImportedText(text);
		if (!saved) { return; }
		applySaved(saved);
		entry.name = project.name;
		clearUndo();
		saveToStorage();
		// Just read from that very file, so this IS the file. Recorded as the baseline rather than
		// merely clearing a flag, or the next solve would recompute dirty against nothing and raise
		// the asterisk again.
		entry.savedSig = docSignature();
		entry.dirty = false;
		await stampFile(id, handle); // just re-read it
		setFileChangedElsewhere(false); // we have their version now
		saveIndex();
		refreshAllFromDocument();
		renderTabs();
		setNotice((pc.lpn_status_reverted || 'Loaded {file} again from the disk.').replace('{file}', entry.fileName));
	}
	async function openFromFile() {
		var pc = EngCalcs.pageConfig || {};
		if (!fileApiAvailable()) {
			// **Say what this open really is, before it happens** (Tom, 2026-08-04). Without the File
			// System Access API there is no handle, so the browser hands us the file's CONTENTS and
			// nothing else: no way to write back, no way to lock it, no way even to know it is the
			// same file next time. That is an upload, not an open, and a user who is not told will
			// reasonably expect Save to go back where it came from.
			//
			// **Shown EVERY time, not once per browser** (fixed 2026-08-04 -- Tom: "Any other
			// explanation does not fire"). The first version stored a once-per-browser flag AND wrote
			// that flag before the dialog had proved it appeared, so a single missed or dismissed
			// showing silenced it permanently with no way back. Two lessons, both worth keeping:
			//
			//   - Never spend a shown-once token before the thing it guards has actually happened.
			//   - "Once per browser" is the wrong default for a fact that CHANGES WHAT A COMMAND
			//     MEANS. This one changes what Save does. Opening a file is not a frequent act, and
			//     one extra click on it is a far smaller cost than a user who never learns that their
			//     work cannot go back where it came from.
			//
			// Task 209's snooze system is the right long-term home for this: shown by default, with
			// a way to say "I know" that is the USER's to give rather than ours to assume.
			openDialog(function (body) {
				[pc.lpn_file_upload_explain].forEach(function (txt) {
					if (!txt) { return; }
					var t = document.createElement('p');
					t.style.margin = '0 0 8px';
					t.textContent = txt;
					body.appendChild(t);
				});
			}, [
				{ label: pc.lpn_file_training_continue || 'Continue', fn: function () { pickUploadFile(); } },
				{ label: pc.lpn_cancel || 'Cancel', fn: function () { } }
			]);
			return;
		}
		if (!requireFileIdentity('open')) { return; }
		var picked;
		try { picked = await window.showOpenFilePicker({ multiple: false, types: fileTypes() }); }
		catch (err) { return; } // cancelled
		await openHandle(picked[0]);
	}
	// Everything that happens once a handle is in hand, split out of openFromFile() so the recent
	// list opens a file by exactly the same route the picker does -- same identity check, same
	// already-open rule, same lock question. A second copy of this would be a second place for the
	// lock protocol to drift.
	async function openHandle(handle) {
		var pc = EngCalcs.pageConfig || {}, text;
		try { text = await (await handle.getFile()).text(); }
		catch (err) {
			alert(pc.lpn_import_bad_file || 'That file could not be read as a project saved from this page.');
			return;
		}
		var saved = acceptImportedText(text);
		if (!saved) { return; }
		// **The lock is checked BEFORE the project lands** (Task 211). Task 195 opened the file, then
		// sprang read-only on the user afterwards; Tom's AutoCAD instinct -- and Word's, and Excel's --
		// is that this is a QUESTION asked at the moment of opening, with both real answers on it.
		var docId = (saved.project && saved.project.docId) || null;
		// **The same file must not become two tabs** (Tom, 2026-08-05: "It does open two live tabs
		// both claiming the same file"). Two tabs over one file is a merge conflict with yourself:
		// both wear the file's name, both think they own it, and whichever you Save last silently
		// wins. Every other document program answers this the same way -- opening what is already
		// open just brings it forward -- so this does too.
		//
		// Identity is the `docId` INSIDE the file, never the name: the same reason Save as reads the
		// file it is about to clobber. A copy saved under a new name is a different document and
		// legitimately opens as its own tab, which is exactly what the docId says and the name does
		// not.
		var already = docId ? projectWithDocId(docId) : null;
		if (already) { adoptAlreadyOpen(already, handle); return; }
		var r = docId ? await postLock('check', docId) : null;
		if (r && r.ok && r.locked && !r.mine) {
			presentOpenChoice(saved, handle, lockHolderName(r), r);
			return;
		}
		landOpenedFile(saved, handle, false);
	}
	// Opening a file from the recent list. The permission grant does not survive a reload, so this
	// usually has to ask -- and it can, because a click on a menu row IS the live user activation
	// requestPermission() demands. Where the grant is still warm the browser shows nothing at all,
	// which is the whole point of the list: no picker, no hunting for the folder again.
	async function openRecentFile(rec) {
		var pc = EngCalcs.pageConfig || {};
		if (!rec || !rec.handle) { return; }
		if (!requireFileIdentity('open')) { return; }
		var perm = await handlePermission(rec.handle, false);
		if (perm !== 'granted') { perm = await handlePermission(rec.handle, true); }
		if (perm !== 'granted') {
			// Refused, or a browser that cannot ask. Left in the list on purpose: the file is still
			// there and still the one they wanted, and a row that vanishes when you decline a
			// permission prompt reads as the app losing the file.
			setNotice(pc.lpn_recent_denied || 'Permission to open that file was not given, so it was not opened.');
			return;
		}
		// getFile() succeeding is the only proof the file is still where the handle says (see the
		// commit of that name): a moved, renamed or deleted file throws here, and a row that can
		// never work again is worse than no row.
		try { await rec.handle.getFile(); }
		catch (err) {
			dropRecentFile(rec.handle);
			setNotice((pc.lpn_recent_gone || 'Could not open {file}. It may have been moved, renamed, or deleted, so it was taken off the recent list.').replace('{file}', rec.name));
			return;
		}
		await openHandle(rec.handle);
	}
	// The three-answer dialog: look at it, keep your own copy, or think better of it. Cancel is a real
	// answer here and does nothing at all -- the project never lands, so backing out is free.
	// How long ago, in words. Coarse on purpose -- "3 hours ago" is the judgment a colleague can act
	// on; "3 h 12 m" invites false precision about a number that is only as good as the last report.
	function agoText(ms) {
		var pc = EngCalcs.pageConfig || {};
		if (!(ms > 0)) { return pc.lpn_ago_unknown || 'an unknown time'; }
		// **n is never 1** (Tom, 2026-08-08). A count of one forces a singular form, and these strings
		// have exactly one form each -- so English shipped "1 minutes" and every other language would
		// have had to pick a form that is wrong half the time. Dropping to the next smaller unit at
		// the boundary (1 hour -> "90 minutes") keeps n >= 2 in every language at once, which is the
		// cheap way out of plural rules rather than the expensive one. Buckets stay coarse on purpose
		// -- see the note above; the extra unit is a fourth bucket, not extra precision.
		var secs = Math.round(ms / 1000);
		if (secs < 120) { return (pc.lpn_ago_seconds || '{n} seconds').replace('{n}', Math.max(2, secs)); }
		var mins = Math.round(secs / 60);
		if (mins < 120) { return (pc.lpn_ago_minutes || '{n} minutes').replace('{n}', mins); }
		var hrs = Math.round(mins / 60);
		if (hrs < 48) { return (pc.lpn_ago_hours || '{n} hours').replace('{n}', hrs); }
		return (pc.lpn_ago_days || '{n} days').replace('{n}', Math.max(2, Math.round(hrs / 24)));
	}
	// The stale-claim conversation, worded by Tom 2026-08-05.
	//
	// THREE choices, in the order a decent colleague tries them (Tom, 2026-08-05): Cancel and go
	// ask is FIRST because it is the hoped-for outcome, not a way out of the dialog. The prose
	// enumeration and the button row are in the same order on purpose -- a numbered list that
	// disagrees with the buttons beneath it makes the reader re-derive the mapping every time.
	// The third is deliberately last and deliberately blunt. "Create a copy" is
	// gone from here: read-only now allows every edit, so open-read-only-then-Save-as IS making a
	// copy, and one fewer button is one fewer thing to weigh in a dialog that is already asking for
	// a judgment. It also retires the copy-keeps-the-same-name defect Tom found.
	//
	// **Breaking a lock is not overwriting a file.** It never was safe to conflate the two; it is now
	// structurally impossible to, because writeOpenProjectToFile() checks the bytes on disk before
	// every write. That is what allows this button to exist at all after Take over was withdrawn.
	// **"{name} has this file open." on its own is not enough to decide anything** (Tom, 2026-08-06:
	// "Are we going to add some numbers to this message?"). The whole dialog asks the reader to judge
	// a claim -- wait, look read-only, or break it -- and that judgment is entirely about time: how
	// long since they touched it, and how much of that is unsaved.
	//
	// The numbers were already reported by the holder and stored by the broker; only the richest of
	// the four sentences was ever used, and it needed BOTH an edit and a save in the holder's current
	// session, so the ordinary "opened it and went to lunch" case fell through to the bare sentence.
	// Each case below says the most it truthfully can:
	//
	//   unsaved work   -- the one that matters most: interrupting them costs them that work.
	//   all saved      -- safest to break; nothing of theirs is at risk.
	//   nothing edited -- they may only have it open; `lastActivity` says whether anyone is home.
	//   no numbers     -- an old record, or a broker that answered without them.
	//
	// `lastActivity` is the broker's own clock in SECONDS (it is `time()`); editedAt/savedAt are the
	// holder's clock in milliseconds. Mixing the two units silently turns "5 minutes" into "7 weeks".
	function lockHeadingText(who, info) {
		var pc = EngCalcs.pageConfig || {}, now = Date.now();
		var editedAt = (info && info.editedAt) || 0, savedAt = (info && info.savedAt) || 0;
		var seenAt = ((info && info.lastActivity) || 0) * 1000;
		var s;
		if (editedAt && savedAt && editedAt > savedAt) {
			s = (pc.lpn_lock_open_heading_times || '{name} has this file open; the last edit was {x} ago, {y} after the last save.')
				.replace('{x}', agoText(now - editedAt)).replace('{y}', agoText(editedAt - savedAt));
		} else if (editedAt && !savedAt) {
			s = (pc.lpn_lock_open_heading_unsaved || '{name} has this file open; the last edit was {x} ago, and none of it has been saved to this file yet.')
				.replace('{x}', agoText(now - editedAt));
		} else if (editedAt) {
			s = (pc.lpn_lock_open_heading_saved || '{name} has this file open; the last edit was {x} ago, and their work is saved to the file.')
				.replace('{x}', agoText(now - editedAt));
		} else if (seenAt) {
			s = (pc.lpn_lock_open_heading_seen || '{name} has this file open but has not edited it. Their browser last checked in {x} ago.')
				.replace('{x}', agoText(now - seenAt));
		} else {
			s = pc.lpn_lock_open_heading || '{name} has this file open.';
		}
		return s.replace('{name}', who);
	}
	function presentOpenChoice(saved, handle, who, info) {
		var pc = EngCalcs.pageConfig || {};
		openDialog(function (body) {
			var p = document.createElement('p');
			p.style.margin = '0 0 8px';
			p.textContent = lockHeadingText(who, info);
			body.appendChild(p);
			var q = document.createElement('p');
			q.style.margin = '0';
			q.textContent = pc.lpn_lock_open_choices || 'Your choices: (1) Cancel and ask them to open it if necessary and then close it properly (closing the browser does not close the project), (2) Open read-only, or (3) if all else fails, you can break their lock. Their unsaved work is not lost, but they will not be able to save over your changes, and somebody may have to merge the two by hand.';
			body.appendChild(q);
		}, [
			{ label: pc.lpn_cancel || 'Cancel', fn: function () { } },
			{ label: pc.lpn_lock_open_readonly || 'Open read-only', fn: function () { landOpenedFile(saved, handle, true, who); } },
			{
				label: pc.lpn_lock_break || 'Break their lock',
				fn: async function () {
					var docId = saved.project && saved.project.docId;
					if (docId) { await postLock('steal', docId); }
					landOpenedFile(saved, handle, false);
				}
			}
		]);
	}
	// Which open project, if any, IS this document? Reads the docId out of each stored project rather
	// than trusting the index, for the same reason reacquireLocksOnBoot() does: the docId lives in the
	// document, which is the thing that gets saved to and opened from a file.
	function projectWithDocId(docId) {
		if (!docId) { return null; }
		for (var i = 0; i < library.projects.length; i++) {
			var id = library.projects[i].id, d = readJSON(projectKey(id));
			if (d && d.project && d.project.docId === docId) { return id; }
		}
		return null;
	}
	// Opening a file this browser already has open: come forward, and take the connection with you.
	//
	// **Re-opening the file is a legitimate way to reconnect** -- it is the fallback the needs-reopen
	// banner names -- so the fresh handle is adopted even though the tab already existed. That is what
	// keeps this from being merely a refusal.
	//
	// The unsaved-changes case gets its own sentence because the two are genuinely different
	// situations: somebody who re-opens a file expecting the version on disk needs to be told they are
	// looking at their own newer edits instead, and pointed at Revert. Neither case throws anything
	// away -- this function does not touch the document at all.
	function adoptAlreadyOpen(id, handle) {
		var pc = EngCalcs.pageConfig || {}, entry = indexEntry(id);
		if (handle) {
			fileHandles.set(id, handle);
			rememberHandle(id, handle);
			if (entry) { entry.fileName = handle.name; }
			saveIndex();
			stampFile(id, handle); // just read it, so this IS the file
		}
		openProject(id);
		setNotice(((entry && entry.dirty)
			? (pc.lpn_status_already_open_dirty || 'That file is already open here as {name}, with changes you have not saved to it. This switched to it rather than opening a second copy. Use File, Revert if you want the version on disk instead.')
			: (pc.lpn_status_already_open || 'That file is already open here as {name}, so this switched to it rather than opening a second copy.')
		).replace('{name}', projectDisplayName(entry || project)));
		syncReadOnlyToOpenProject();
		renderTabs();
		// A tab opened read-only STAYS read-only (Tom, 2026-08-04) -- re-opening its file is not the
		// deliberate request that would change that, so it must not quietly go and take the lock.
		if (!roProjects.has(id)) { acquireLockForOpenProject(); }
	}
	// `heldBy` is the name of whoever the open-time dialog said has it, and it exists only for the
	// read-only path. **Without it the banner you then live with all session is anonymous** ("Somebody
	// else has this file open") even though the dialog you just answered named them -- found by the
	// browser pass 2026-08-06. The name is the whole difference between a wall and a person you can
	// walk over and talk to.
	function landOpenedFile(saved, handle, asReadOnly, heldBy) {
		var pc = EngCalcs.pageConfig || {};
		var id = importProject(saved); // lands as a NEW project, exactly as the Phase 1 path does
		if (!id) { return; }
		var entry = indexEntry(id);
		if (handle) {
			fileHandles.set(id, handle);
			if (entry) {
				entry.fileName = handle.name;
				// Freshly read from that very file, so this IS the file. The baseline has to be
				// RECORDED, not merely the flag cleared: refreshAllFromDocument() has already
				// scheduled a solve, and that solve calls saveToStorage(), which recomputes dirty.
				// Without a baseline to compare against, every freshly opened file came up modified.
				entry.savedSig = docSignature();
				entry.dirty = false;
			}
			saveIndex();
			setNotice((pc.lpn_status_file_opened || 'Opened {file}.').replace('{file}', handle.name));
		}
		// A read-only open takes NO lock -- that is what makes it read-only, and taking one would
		// contend with the person who already has the file.
		stampFile(id, handle); // just read it, so this IS the file
		rememberHandle(id, handle); // survives the next reload (Task 212)
		if (asReadOnly) {
			roProjects.add(id);
			if (heldBy) { lockedByName.set(id, heldBy); }
		} else { acquireLockForOpenProject(); }
		// Both paths, for the same reason as in saveAs(): this project has just gained (or not gained)
		// a live handle, and the banner is what says so.
		syncReadOnlyToOpenProject();
		renderTabs();
	}
	function pickUploadFile() {
		var input = document.getElementById('lpn_project_file');
		if (input) { input.click(); }
	}
	// Recovery from a file that moved, was renamed, or was deleted. The stale handle is dropped FIRST
	// -- otherwise Save would find it still linked and quietly try the same dead handle again instead
	// of asking where the file went.
	async function relinkFile() {
		if (!library.openId) { return; }
		fileHandles.delete(library.openId);
		forgetHandle(library.openId);
		fileError = false;
		setFileMissing(false);
		await saveAs();
	}

	// ---- Project locks (ROADMAP Task 195 Phase 2) ----
	// Coordinates "who is editing this file right now" for a team sharing project files off a
	// network share, against lpn-lock.php. See that file for the record format and the four actions.
	//
	// **It fails OPEN.** If the broker cannot be reached -- offline, a deploy hiccup, the endpoint
	// missing entirely -- editing continues normally and nothing is read-only. Locking is a courtesy
	// layer over an in-office honor system, so failing closed would let an unreachable server take
	// away a calculator that has always worked without one. That trade is the whole reason this is
	// safe to ship on a page that must keep working offline.
	var LPN_LOCK_URL = '/engcalcs/lpn-lock.php';
	var LPN_IDENTITY_KEY = 'lpn_identity';
	// The document id is baked into the FILE, not into our per-browser project id: two people
	// opening the same file off a share have different local project ids and must still compute the
	// same lock key. Matches lpn-lock.php's /^d[A-Za-z0-9]{8,48}$/.
	function newDocId() { return 'd' + Date.now().toString(36) + randomToken(8); }
	function randomToken(n) {
		var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', out = '';
		for (var i = 0; i < n; i++) { out += chars.charAt(Math.floor(Math.random() * chars.length)); }
		return out;
	}
	// Assigned lazily, on the first thing that needs one (linking a file), rather than by bumping the
	// storage version. A version bump would make every file this page writes unreadable to a page
	// that has not been updated yet, which is a hostile thing to do mid-preview for a key that older
	// code does not even look at.
	function ensureDocId() {
		if (!project.docId) { project.docId = newDocId(); saveToStorage(); }
		return project.docId;
	}
	// Identity is per BROWSER, not per project: an opaque token that decides what "mine" means, plus
	// a friendly name that is only ever shown to a human. No login, no server-side user table.
	// Returns null if the user declines to give a name, which simply means no locking for them.
	var identity = null;
	function loadIdentity() {
		if (identity) { return identity; }
		var saved = readJSON(LPN_IDENTITY_KEY);
		if (saved && saved.holder) { identity = saved; }
		return identity;
	}
	function ensureIdentity() {
		if (loadIdentity()) { return identity; }
		var pc = EngCalcs.pageConfig || {};
		var name = window.prompt(pc.lpn_lock_prompt_name || 'What should colleagues see when you have a project open? A first name or initials is plenty.', '');
		if (name === null) { return null; } // declined -- no locking, and we will not ask again this action
		identity = { holder: randomToken(24), name: name.trim().slice(0, 60) };
		writeJSON(LPN_IDENTITY_KEY, identity);
		return identity;
	}
	// null means "we could not get an answer" -- every caller treats that as fail-open. A non-null
	// result is the parsed response, INCLUDING an {ok:false,error:...} body from a 4xx/5xx, because
	// a server that answers "I cannot write the lock directory" is telling us something far more
	// useful than silence, and used to be flattened into the same null as a dead network. That cost
	// Tom an hour on 2026-08-05: lpn-locks/ was not writable by the web server user, every acquire
	// 500'd, and the page said only "could not reach the server".
	async function postLock(action, docId) {
		var idn = loadIdentity();
		// **"We never asked" is not "the server is down."** Returning the same null for both let the
		// page announce a server outage when the real state was a missing docId or missing initials
		// -- a lie that sends whoever is debugging it straight to the server for no reason. If there
		// is no request in the Network tab, this is the branch that ran.
		if (!idn || !docId || !window.fetch) {
			return { ok: false, error: 'notasked', asked: false };
		}
		try {
			var resp = await fetch(LPN_LOCK_URL, {
				method: 'POST',
				credentials: 'same-origin',
				body: new URLSearchParams({
				action: action, id: docId, holder: idn.holder, name: idn.name,
				// What a colleague needs to judge a stale claim. `lastActivity` on the server only
				// says "we heard from them", which a throttled background tab makes meaningless.
				editedAt: String(lastEditAt || 0), savedAt: String(lastSaveAt || 0)
			})
			});
			// Parse first, status second: the error body is the whole point.
			var data = null;
			try { data = await resp.json(); } catch (err2) { data = null; }
			if (data && typeof data === 'object') { return data; }
			return null;
		} catch (err) { return null; }
	}
	// **Locks are per TAB, not per current project** (Task 211). Every project in the library is an
	// open tab, so a file project keeps its lock while you work in a different tab -- releasing on
	// every tab switch would let a colleague take a file out from under unsaved work you are two
	// clicks away from. Both maps are session state and are deliberately NOT in the index: a lock we
	// hold and a read-only decision we made are facts about this browser session, and a reload starts
	// both again from what the server actually says.
	// Wall-clock ms of the last real edit and the last successful file write on the OPEN project.
	// Reported to the broker so a colleague sees "last edit 3 hours ago, 20 minutes after their last
	// save" rather than a heartbeat time that says nothing about whether work is at risk.
	var lastEditAt = 0, lastSaveAt = 0;
	function markEdited() { lastEditAt = Date.now(); }
	var heldLocks = new Map();   // project id -> docId we currently hold the lock for
	var roProjects = new Set();  // project ids opened read-only, by the user's own choice
	var lockedByName = new Map();// project id -> who has it, for the banner
	function currentLockDocId() { return heldLocks.get(library.openId) || null; }
	// **Read-only no longer takes editing away** (Task 211, and it deletes four enforcement seams).
	// It means exactly what it means in Word: you may change anything you like, you simply cannot save
	// it over that file. Save routes to Save As instead. The old version disabled the toolbar, the
	// pointer handler, setMode() and every property popup -- four places to get wrong, in service of a
	// restriction the user never agreed to and did not need.
	var readOnly = false;
	// Two things can want the banner at once -- read-only (someone else holds the project) and a
	// warning (we could not reach the broker, or the file write failed). They are kept as separate
	// state rather than one message string so that clearing one cannot silently erase the other, and
	// read-only wins when both are set: it is the one that changes what the user is allowed to do.
	var bannerRO = null;   // { message, stealFrom } | null
	var bannerWarn = null; // { message, actionLabel, action, dismissable } | null
	function renderBanner() {
		var banner = document.getElementById('lpn_lock_banner');
		if (!banner) { return; }
		var pc = EngCalcs.pageConfig || {}, state = bannerRO || bannerWarn;
		banner.innerHTML = '';
		if (!state) { banner.style.display = 'none'; return; }
		// Amber for a warning you may work through, red for a state that has taken editing away.
		banner.style.borderColor = bannerRO ? '#a00' : '#a80';
		banner.style.background = bannerRO ? '#fff0f0' : '#fffbe6';
		var text = document.createElement('span');
		text.textContent = state.message || '';
		banner.appendChild(text);
		function action(label, fn) {
			var btn = document.createElement('button');
			btn.type = 'button'; btn.style.marginLeft = '8px';
			btn.textContent = label;
			btn.addEventListener('click', fn);
			banner.appendChild(btn);
		}
		// One action, and it is the only one there can be: keep your work as a file of your own. There
		// is no Take over (withdrawn 2026-08-04 -- it wrote a copy older than the file over the top of
		// it) and no "the file is free now, save over it" (refused by Tom for the same physics: the
		// file on disk has moved on since we read it).
		// **Revert is the other real exit, and it was missing from both banners** (Tom, 2026-08-06:
		// "No revert offered, only Save as"). Save as keeps your work in a file of your own; Revert
		// says "fine, theirs wins" and re-reads the file. Both are honest answers to being locked out
		// or overtaken, and offering only the first makes a new file the price of giving in. It writes
		// nothing, so it is safe in read-only; it is offered only when there is something to revert
		// FROM (unsaved changes) and something to revert TO (a live connection).
		function offerRevert() {
			var e = indexEntry(library.openId);
			if (!(isLinked(library.openId) && e && e.dirty)) { return; }
			action(pc.lpn_file_revert || 'Revert', revertCurrent);
		}
		if (bannerRO) {
			action(pc.lpn_file_saveas || 'Save as…', saveAs);
			offerRevert();
		}
		if (!bannerRO && bannerWarn) {
			if (bannerWarn.action) { action(bannerWarn.actionLabel, bannerWarn.action); }
			if (bannerWarn.kind === 'changed') { action(pc.lpn_file_saveas || 'Save as…', saveAs); offerRevert(); }
			// Dismissable only where the missing server is a standing fact of how the page is being
			// used rather than a fault to be fixed -- offline, or installed as an app (Tom, 2026-08-03,
			// unsure which way this should go). Undismissable in the ordinary online case, because
			// there the warning describes a real, fixable risk to a colleague's work; permanently
			// undismissable in the offline case would be noise nobody can ever act on.
			if (bannerWarn.dismissable) {
				action(pc.lpn_lock_dismiss || 'Dismiss', function () { bannerWarn = null; renderBanner(); });
			}
		}
		banner.style.display = 'block';
	}
	// Recomputes read-only from the CURRENT tab and nothing else. Called on every tab switch and
	// whenever a lock answer changes: the banner describes the project you are looking at, and a tab
	// you opened read-only stays read-only for as long as it is open, whatever happens to the lock
	// afterwards (Tom, 2026-08-04: "Read only is read only"). Nothing promotes a tab behind the user's
	// back -- the promotion poll built for Task 195 is gone.
	function syncReadOnlyToOpenProject() {
		var pc = EngCalcs.pageConfig || {}, id = library.openId, entry = indexEntry(id);
		readOnly = roProjects.has(id);
		if (readOnly) {
			bannerRO = {
				message: (pc.lpn_lock_readonly_banner || 'Read-only: {name} has this file open. You can change anything you like here, but you cannot save it over their file. Use File, Save as to keep your own copy.')
					.replace('{name}', lockedByName.get(id) || (pc.lpn_lock_somebody || 'Somebody else'))
			};
		} else {
			bannerRO = null;
		}
		// A file project whose handle died with the last page load. We still know the file's NAME --
		// that is why entry.fileName lives in the index -- so the tab keeps its identity rather than
		// silently demoting itself to a browser project, and this says what to do about it. Only ever
		// replaces a warning of its own kind, so it cannot stomp a missing-file or no-server banner.
		if (!readOnly && entry && isFileProject(entry) && !isLinked(id)) {
			bannerWarn = {
				kind: 'reopen',
				message: (pendingHandles.has(id)
					? (pc.lpn_file_reconnect_prompt || 'This project came from {file}. Your browser needs your permission again before it can write to it. Reconnect below.')
					: (pc.lpn_file_needs_reopen || 'This project came from {file}, but the connection to that file has been lost. Choose the file again to connect to it.')
				).replace('{file}', entry.fileName),
				// One click when the handle survived the reload and only needs permission (Task 212);
				// the old find-it-again picker when it did not.
				actionLabel: pendingHandles.has(id)
					? (pc.lpn_file_reconnect || 'Reconnect to this file')
					: (pc.lpn_file_relink || 'Choose the file again'),
				action: pendingHandles.has(id) ? reconnectPendingFile : relinkFile,
				dismissable: true
			};
		} else {
			clearWarn('reopen');
		}
		renderBanner();
	}
	// Clears the banner warning only if it is the KIND being cleared. Two warnings can want the same
	// slot -- no server, a file that has gone missing, a file that needs re-opening -- and a blanket
	// clear from one of them would silently erase another that is still true.
	function clearWarn(kind) {
		if (bannerWarn && bannerWarn.kind !== kind) { return; }
		bannerWarn = null;
		renderBanner();
	}
	// Somebody else has taken the file since we opened it. Fold it into the same read-only state the
	// open-time choice produces, so there is exactly one way to be read-only and one way out of it.
	function enterReadOnly(who) {
		var id = library.openId;
		roProjects.add(id);
		if (who) { lockedByName.set(id, who); }
		heldLocks.delete(id);
		syncReadOnlyToOpenProject();
	}
	// True where having no server is a standing condition of this session rather than a fault.
	function lockWarningDismissable() {
		try {
			if (navigator.onLine === false) { return true; }
			if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) { return true; }
		} catch (err) { /* older browsers: treat as ordinary online use */ }
		return false;
	}
	// The moment of danger is opening a file we could not lock (Tom, 2026-08-03): from then on
	// nothing is stopping a colleague from editing the same file, and the user has to know. Stated as
	// a standing banner rather than a modal alert precisely because it PROMISES a follow-up -- a
	// modal cannot come back later to say the risk has passed, and this one can.
	function setLockUnavailable(on) {
		var pc = EngCalcs.pageConfig || {};
		if (!on) { clearWarn('lock'); return; }
		// A setup fault reads completely differently from an outage, and only one of the two is
		// somebody's to go and fix. Naming it is the difference between an afternoon of confusion
		// and one chmod.
		var msg = lockErrorCode === 'notasked'
			? (pc.lpn_lock_not_asked || 'Locking is not running for this project, so nothing is stopping a colleague from editing the same file at the same time. This browser has no name recorded for you yet, or the project has no identifier — saving the project to a file sets both.')
			: lockErrorCode === 'full'
			? (pc.lpn_lock_full_error || 'Beware: this site has run out of room to record who has which project open, so nothing is stopping a colleague from editing the same file at the same time. This is a setup fault on the server, not something you can fix here.')
			: lockErrorCode === 'storage'
			? (pc.lpn_lock_storage_error || 'Beware: this site cannot save lock records, so nothing is stopping a colleague from editing the same file at the same time. This is a setup fault on the server, not something you can fix here — the lock folder is not writable by the web server.')
			: (pc.lpn_lock_unavailable || 'Beware: could not reach the server to check or create a lock on this project, so nothing is stopping a colleague from editing the same file at the same time. You will be told if locking starts working again.');
		bannerWarn = {
			kind: 'lock',
			message: msg,
			action: null,
			dismissable: lockWarningDismissable()
		};
		renderBanner();
	}
	function setFileMissing(on) {
		var pc = EngCalcs.pageConfig || {};
		if (!on) { clearWarn('missing'); return; }
		bannerWarn = {
			kind: 'missing',
			message: pc.lpn_file_write_failed || 'Could not write to the file. It may have been moved, renamed, or deleted, or permission may have been withdrawn. Your work is still saved in this browser.',
			actionLabel: pc.lpn_file_relink || 'Choose the file again',
			action: relinkFile,
			dismissable: true
		};
		renderBanner();
	}
	function lockHolderName(r) {
		var pc = EngCalcs.pageConfig || {};
		return (r && r.lockedBy) ? r.lockedBy : (pc.lpn_lock_somebody || 'the other person');
	}
	// Called once a file has just been attached to the open project, by either route. Fails OPEN on
	// every path that is not an explicit "someone else holds this": an unreachable broker leaves the
	// file writable and says so, because a courtesy layer must never be able to take the calculator
	// away.
	async function acquireLockForOpenProject() {
		var id = library.openId, docId = ensureDocId();
		if (!ensureIdentity()) { return; }
		var r = await postLock('acquire', docId);
		if (!r || !r.ok) {
			lockErrorCode = (r && r.error) || '';
			// The moment of danger (Tom, 2026-08-03): from here on the file is unprotected. Editing
			// continues, but SAY SO -- and pollLockedFiles() below is what makes the promise in that
			// message ("you will be told if locking starts working again") a real one.
			lockUnavailable = true;
			setLockUnavailable(true);
			return;
		}
		lockUnavailable = false;
		setLockUnavailable(false);
		if (r.held) { heldLocks.set(id, docId); return; }
		// Somebody took it between the open-time check and here. Rare, but it is exactly the race the
		// pre-save re-check exists for, and the same read-only state answers it.
		enterReadOnly(lockHolderName(r));
	}
	// The heartbeat, on its OWN fixed timer (Task 211). Task 195 piggybacked this on the file-autosave
	// tick, which is why one user-facing number ended up governing the write interval, the heartbeat
	// AND the how-long-until-takeover threshold at once -- and why that number had to be clamped to
	// 60-180 s. With autosave gone the coupling goes too: this is 60 s, always, and no longer anybody's
	// setting.
	//
	// It refreshes every lock we hold (one per open file tab), and it keeps the one promise a
	// could-not-lock warning makes. It deliberately does NOT poll a tab the user opened read-only:
	// read-only is read-only, and nothing promotes a tab behind the user's back.
	var lockUnavailable = false;
	// Which flavour of "no locking" we are in, so the banner can say something a person can act on.
	// 'storage' is a server SETUP fault (the lock directory is not writable by the web server user)
	// and is worth naming, because nobody will ever guess it from "could not reach the server".
	var lockErrorCode = '';
	var LPN_HEARTBEAT_MS = 60000;
	async function pollLockedFiles() {
		var pc = EngCalcs.pageConfig || {};
		var pending = [];
		heldLocks.forEach(function (docId, id) { pending.push([id, docId]); });
		for (var i = 0; i < pending.length; i++) {
			var id = pending[i][0], r = await postLock('acquire', pending[i][1]);
			if (!r || !r.ok) { continue; }  // unreachable; the banner stays as it is, say nothing
			if (!r.held) {
				// Lost it while we were away. If it is the tab on screen the banner says so now;
				// otherwise the tab simply becomes read-only and will say so when it is next looked at.
				lockedByName.set(id, lockHolderName(r));
				roProjects.add(id);
				heldLocks.delete(id);
				if (id === library.openId) { syncReadOnlyToOpenProject(); }
			}
		}
		// The could-not-lock promise, kept. Only for the project on screen -- this message is about
		// what the user is looking at.
		if (lockUnavailable && library.openId && isLinked(library.openId)) {
			var back = await postLock('acquire', ensureDocId());
			if (back && back.ok && back.held) {
				lockUnavailable = false;
				setLockUnavailable(false);
				heldLocks.set(library.openId, project.docId);
				setNotice(pc.lpn_lock_restored || 'Locking is working again, and this file is now yours to save to.');
			}
		}
	}
	// Releases ONE project's lock (default: the open one). A tab that is closed hands its file back;
	// a tab that is merely switched away from does not, because it is still open.
	function releaseLock(id) {
		var pid = id || library.openId, docId = heldLocks.get(pid);
		if (!docId) { return; }
		var idn = loadIdentity();
		// sendBeacon, because the common case for releasing is the tab closing, and a fetch() started
		// during unload is not guaranteed to be sent. Same reason the usage logs use it.
		if (idn && navigator.sendBeacon) {
			try {
				navigator.sendBeacon(LPN_LOCK_URL, new URLSearchParams({
					action: 'release', id: docId, holder: idn.holder, name: idn.name
				}));
			} catch (err) { /* nothing to do; the record expires on its own eventually */ }
		}
		heldLocks.delete(pid);
	}
	// **A RELOAD MUST NOT DROP YOUR CLAIM** (Tom, 2026-08-05: "Across reloads, minimizes, browser
	// closes, and computer restarts, you still have your lock until you Close the file").
	//
	// beforeunload hands every lock back -- correct, the page really is going -- but nothing took
	// them up again on the way back in, so a reload quietly un-held every file. The docId lives in
	// localStorage beside the project, so this needs no file handle and works even though the handle
	// itself died with the page (that is Task 212's problem, and a different one).
	//
	// Being refused here is a normal outcome, not an error: somebody took the file while we were
	// gone, so that tab becomes read-only and says whose it is.
	// Put back the connections that died with the last page. Runs BEFORE the needs-reopen banner is
	// painted, so a file we can silently reconnect never flashes a warning about itself.
	//
	// A handle whose project has since been closed is dropped rather than restored -- otherwise the
	// store would grow forever, and closing a project would not really let go of its file.
	async function restoreHandlesOnBoot() {
		var handles = await recallHandles();
		var keys = await recallHandleKeys();
		if (!handles || !keys || handles.length !== keys.length) { return; }
		for (var i = 0; i < keys.length; i++) {
			var id = keys[i], handle = handles[i];
			if (!indexEntry(id)) { forgetHandle(id); continue; }
			var state = await handlePermission(handle, false);
			if (state === 'granted') {
				fileHandles.set(id, handle);
				// **Only where we have no baseline at all.** Re-stamping here is what made a reload
				// forgive a colleague's newer file: it recorded THEIR version as the one we last saw,
				// and the freshness check then had nothing to object to. The stamp we wrote before the
				// page went away is the truthful one, so it wins.
				if (!knownStamp(id)) { await stampFile(id, handle); }
			} else if (state === 'prompt') {
				// Keep it: the banner's button turns this into one click, which is the user gesture
				// requestPermission() insists on. Asking here without one would fail and teach the
				// user nothing -- the same reason writeOpenProjectToFile() does not ask either.
				pendingHandles.set(id, handle);
			} else {
				forgetHandle(id);   // denied, or the API is not here at all
			}
		}
		// Anything still pending wants a user activation, and the next gesture is one.
		if (pendingHandles.size) { armPendingReconnect(); }
	}
	// Handles we hold but may not yet write to. One click away from being real.
	var pendingHandles = new Map();
	// The banner button for that click. Deliberately NOT a file picker: the user already chose this
	// file, and making them find it again is the very friction Task 212 exists to remove.
	var reconnectBusy = false;
	async function reconnectPendingFile() {
		var id = library.openId, handle = pendingHandles.get(id);
		if (!handle) { await relinkFile(); return; }
		// One request at a time. The first gesture on the page and a click on the banner's own button
		// are the same click when that button IS the first thing touched -- and two overlapping
		// requestPermission() calls on one handle is how a browser ends up showing two bubbles.
		if (reconnectBusy) { return; }
		reconnectBusy = true;
		var state;
		try { state = await handlePermission(handle, true); }
		finally { reconnectBusy = false; }
		if (state !== 'granted') { return; }   // declined; the banner stays, nothing is lost
		pendingHandles.delete(id);
		fileHandles.set(id, handle);
		await stampFile(id, handle);
		clearWarn('reopen');
		syncReadOnlyToOpenProject();
		renderTabs();
		acquireLockForOpenProject();
	}
	// **A reload should cost the user nothing** (Tom, 2026-08-05: "I should get nothing, or a prompt
	// for single-click permission to reconnect"). Task 212 got as far as one click on a banner, which
	// is neither.
	//
	// queryPermission() answers 'prompt' after a reload even where the browser still remembers the
	// grant: the grant goes DORMANT rather than away, and requestPermission() revives a dormant grant
	// WITHOUT showing anything -- provided it is called with a live user activation. Boot has no
	// activation, which is why restoreHandlesOnBoot() must not ask. But the banner's button is not the
	// only activation available: the FIRST gesture the user makes on the page is one too, and spending
	// it here makes the ordinary case silent -- the banner is gone before it can be read.
	//
	// Where the grant really is gone, the browser shows its own permission bubble, which is exactly
	// the one-click prompt asked for, and a truthful one: we are asking for write access to somebody's
	// file, and that is a question the browser gets to put in its own words.
	//
	// Once per project, never more: one activation is one request, and a queue of permission bubbles
	// on a single click would be worse than the banner ever was. The listener stays (rather than
	// removing itself on first fire) so that switching to a second reloaded file tab gets its own
	// attempt on the next gesture, instead of being stranded by whichever tab happened to be on
	// screen when the page came back.
	var reconnectTried = new Set();
	function armPendingReconnect() {
		if (armPendingReconnect.armed) { return; }
		armPendingReconnect.armed = true;
		var fire = function () {
			var id = library.openId;
			if (!pendingHandles.has(id) || reconnectTried.has(id)) { return; }
			reconnectTried.add(id);
			reconnectPendingFile();
		};
		// Capture, so a click that something else swallows still counts; keydown as well as
		// pointerdown because a keyboard user's first move may never be a pointer at all.
		document.addEventListener('pointerdown', fire, true);
		document.addEventListener('keydown', fire, true);
	}
	async function reacquireLocksOnBoot() {
		if (!loadIdentity()) { return; }   // no identity means no locking at all; the banner says so
		var list = library.projects.filter(isFileProject);
		for (var i = 0; i < list.length; i++) {
			var id = list[i].id, d = readJSON(projectKey(id));
			var docId = d && d.project && d.project.docId;
			if (!docId) { continue; }
			var r = await postLock('acquire', docId);
			if (!r || !r.ok) { continue; }   // unreachable or a server fault; the banner covers it
			if (r.held) {
				heldLocks.set(id, docId);
			} else {
				lockedByName.set(id, lockHolderName(r));
				roProjects.add(id);
			}
		}
		syncReadOnlyToOpenProject();
	}
	function releaseAllLocks() {
		var ids = [];
		heldLocks.forEach(function (docId, id) { ids.push(id); });
		ids.forEach(function (id) { releaseLock(id); });
	}
	function renameProject(id, name) {
		var entry = indexEntry(id);
		if (!entry) { return; }
		entry.name = name;
		entry.updated = Date.now();
		if (id === library.openId) { project.name = name; saveToStorage(); renderTabs(); }
		else {
			// Rename a project that is not open by rewriting just its name in place -- read, patch,
			// write. Cheaper and safer than opening it, and it keeps the document (the authority)
			// and the index agreeing.
			var doc2 = readJSON(projectKey(id));
			if (doc2 && doc2.project) { doc2.project.name = name; writeJSON(projectKey(id), doc2); }
		}
		saveIndex();
	}
	// **Close IS the removal, and there is no Delete** (Task 211). Once every tab wears an asterisk
	// whenever it holds something that is not in a file, "close without saving" already IS "delete",
	// and a second verb for it was a distinction with nothing behind it. So this is the old
	// deleteProject() with the confirm lifted out: closeTab() below asks the question, in the words
	// the situation deserves, and this does the work.
	//
	// Removes the document first, then the index entry: the reverse order can leave a document with
	// no entry, which adoptOrphans() would helpfully resurrect on the next load.
	function discardProject(id) {
		var pc = EngCalcs.pageConfig || {}, entry = indexEntry(id),
			// Captured BEFORE the removal below -- after it there is nothing left to name.
			goneName = projectDisplayName(entry || { name: '' }),
			// Position in the TAB STRIP, not recency -- see the "library order, not recency" note at
			// renderTabs(). Every tab-strip paradigm in the world lands on the neighbor that slides
			// left into the closed tab's spot, not on whatever was touched last (punch list §4, Tom
			// 2026-08-06).
			closedIndex = library.projects.findIndex(function (p) { return p.id === id; });
		// Hand the file back so a colleague can have it, and drop the live link. The FILE ON DISK IS
		// NOT TOUCHED -- closing a tab has never meant deleting anything outside this browser.
		releaseLock(id);
		roProjects.delete(id);
		lockedByName.delete(id);
		fileHandles.delete(id);
		forgetHandle(id);
		try { localStorage.removeItem(projectKey(id)); } catch (err) { /* private mode */ }
		library.projects = library.projects.filter(function (p) { return p.id !== id; });
		if (id === library.openId) {
			library.openId = null;
			// Deleting the OPEN project has to leave something open. The tab that slides into the
			// closed one's spot -- the next one rightward, or the new last tab if it was the
			// rightmost -- is the best guess at "what I meant to look at next"; with no survivors at
			// all, a fresh empty project -- never a blank screen with no project.
			// Tom, 2026-07-31, on whether it should instead always land on a clean Untitled: no,
			// because newProject() pushes a real persisted row, so deleting 1 of 5 would leave 5
			// rows and read as a failed delete. He also ruled out warning BEFOREHAND -- the fix is
			// to say afterwards where you landed, since the alarm is "a network I did not ask for
			// just appeared", and that is answered by narration, not by a different landing spot.
			var rest = library.projects, landIndex = Math.min(closedIndex, rest.length - 1);
			if (rest.length) {
				var landed = rest[landIndex];
				library.openId = landed.id;
				var d = readDocument(projectKey(landed.id));
				if (d) { applySaved(d); }
				clearUndo();
				refreshAllFromDocument();
				// After refreshAllFromDocument(), which itself calls setStatus('') -- see the
				// notice/diagnostic split at setStatus().
				setNotice((pc.lpn_status_closed_opened || 'Closed {closed}. Now showing {opened}.')
					.replace('{closed}', goneName)
					.replace('{opened}', projectDisplayName(landed)));
			} else {
				newProject();
				setNotice((pc.lpn_status_closed_empty || 'Closed {closed}. Started a new empty project.')
					.replace('{closed}', goneName));
				return;
			}
		}
		saveIndex();
	}
	// ---- The tab strip, its menus, and the dialog (ROADMAP Task 211) ----
	// Every project in the library is a TAB. There is no "open the library" step and no popup listing
	// projects: the strip IS the library, permanently on screen above the toolbar, which is what
	// answers "which network am I looking at" without a click. It replaces Task 146.08's Projects
	// panel entirely.
	var LPN_TAB_NAME_MAX = 24;
	// Middle-truncated so the EXTENSION survives (Tom, 2026-08-04). Truncating from the end eats the
	// one character that proves the thing is a file, and hyphens prove nothing on their own -- a user
	// may well hyphenate a browser project's name in anticipation of saving it. That is also why no
	// file/disk GLYPH is needed: the name says "file", the asterisk says "unsaved", and the two facts
	// stay independent. The full name is on the tab's title attribute.
	function tabLabel(entry) {
		var name = isFileProject(entry) ? entry.fileName : projectDisplayName(entry);
		if (name.length <= LPN_TAB_NAME_MAX) { return name; }
		var tail = 5, dot = name.lastIndexOf('.');
		if (isFileProject(entry) && dot > 0) { tail = Math.min(12, name.length - dot); }
		var head = Math.max(4, LPN_TAB_NAME_MAX - tail - 1);
		return name.slice(0, head) + '…' + name.slice(name.length - tail);
	}
	// **THE ASTERISK DECIDES** -- the one rule the whole close/discard story falls out of. A browser
	// project is in no file at all, so it always wears one, faded, because it describes a standing
	// condition rather than something to go and do. A file project wears a full-strength one only
	// while it holds changes its file does not.
	//
	// A bold asterisk means "changes not in the file"; a faint one means "this lives only in the
	// browser". They are different facts and both are worth saying.
	//
	// **The `exported` flag this rule used to consult is GONE** (2026-08-10). It existed to answer
	// "does a copy of this project exist on disk at all", which the faint-asterisk-always rule needed
	// and the baseline rule below does not: every path that produces a copy -- download, upload, file
	// save -- now records a baseline instead, and `dirty` answers the question on its own. It had one
	// reader and no other purpose, so keeping it would have left a field nothing consults.
	// ONE RULE NOW: the asterisk follows `dirty`, and the fade says whether the project lives in a
	// file or only in this browser. A browser project no longer wears a STANDING asterisk.
	//
	// Tom, 2026-08-10: "New blank projects and from template appear with asterisk, which is bad. But
	// a blank project with asterisk closes without confirmation, which is bad." Both halves of that
	// are the same defect. The old rule showed the faint asterisk on any browser project that had
	// never been exported -- so a project created one second ago, containing nothing anybody would
	// miss, claimed to have unsaved work. closeTab() then had to special-case it back out again
	// (`projectIsEmpty`) to avoid a pointless prompt, and the mark and the behaviour disagreed in
	// plain view. The mark was the thing that was wrong.
	//
	// What makes this work is that a freshly created project now gets a BASELINE (see
	// stampProjectSaved(), called by newProject and newProjectFromExample): `savedSig` is recorded
	// at birth, so `dirty` is false until the user actually changes something. The faint asterisk
	// then means what the bold one means -- there is work here that is in no file -- and appears at
	// the first edit, which is the first moment there is anything to lose.
	function tabAsterisk(entry) {
		return { show: !!(entry && entry.dirty), faded: !isFileProject(entry) };
	}
	function buildTab(p) {
		var pc = EngCalcs.pageConfig || {}, isOpen = p.id === library.openId;
		var tab = document.createElement('span');
		tab.className = 'lpn-tab' + (isOpen ? ' lpn-tab-current' : '');
		var btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'lpn-tab-name';
		btn.title = isFileProject(p) ? p.fileName : projectDisplayName(p);
		var star = tabAsterisk(p);
		if (star.show) {
			var s = document.createElement('span');
			s.className = 'lpn-tab-star' + (star.faded ? ' lpn-tab-star-faint' : '');
			s.textContent = '*';
			btn.appendChild(s);
			if (pc.lpn_tab_unsaved) { btn.title += ' — ' + pc.lpn_tab_unsaved; }
		}
		btn.appendChild(document.createTextNode(tabLabel(p)));
		btn.addEventListener('click', function () { switchToTab(p.id); });
		tab.appendChild(btn);
		// The menu caret is on the CURRENT tab only, as a spreadsheet's sheet tabs behave: one click
		// to come here, a second to act on it.
		if (isOpen) {
			var menu = document.createElement('button');
			menu.type = 'button';
			menu.className = 'lpn-tab-caret';
			menu.textContent = '▾';
			menu.title = pc.lpn_tab_menu || 'Project menu';
			menu.addEventListener('click', function (e) { e.stopPropagation(); openProjectMenu(p.id, e.currentTarget); });
			tab.appendChild(menu);
		}
		// [X] ON EVERY TAB (Tom, 2026-08-04: "We need the [X] because we aren't inventing the
		// paradigm, we are adopting it. And file tabs have [X]."). The first version left it off, on
		// the argument that Close is now the only destructive act and deserves to sit behind a menu.
		// That argument loses: the whole return on adopting a paradigm is that nobody has to be taught
		// it, and an [X] is the single most recognised control in the tab paradigm. The safety it was
		// meant to buy is bought instead by the close prompt, which is where it belongs.
		var x = document.createElement('button');
		x.type = 'button';
		x.className = 'lpn-tab-x';
		x.textContent = '×';
		x.title = pc.lpn_file_close || 'Close';
		x.addEventListener('click', function (e) { e.stopPropagation(); closeTab(p.id); });
		tab.appendChild(x);
		return tab;
	}
	function renderTabs() {
		var pc = EngCalcs.pageConfig || {}, strip = document.getElementById('lpn_tabs');
		if (!strip) { return; }
		strip.innerHTML = '';
		// The vertical list lives at the LEFT edge of the strip (Tom's sketch). On a narrow screen it
		// is the only way in, because CSS hides the strip itself there: this page has no horizontal
		// room to spare on a phone, and a tab strip that wraps to three lines above a map is worse
		// than a list behind one button.
		var all = document.createElement('button');
		all.type = 'button';
		all.className = 'lpn-tab-btn';
		all.textContent = '≡';
		all.title = pc.lpn_tab_all || 'All projects';
		all.addEventListener('click', function (e) { e.stopPropagation(); openTabListMenu(e.currentTarget); });
		strip.appendChild(all);
		var holder = document.createElement('span');
		holder.className = 'lpn-tabs-scroll';
		// Library order, NOT recency. The old Projects list sorted by most-recently-updated, which is
		// right for a list you go and consult and wrong for tabs: a tab that moved every time you
		// touched a different project could never be found twice in the same place.
		library.projects.forEach(function (p) { holder.appendChild(buildTab(p)); });
		strip.appendChild(holder);
		var plus = document.createElement('button');
		plus.type = 'button';
		plus.className = 'lpn-tab-btn';
		plus.textContent = '+';
		plus.title = pc.lpn_tab_new || 'New project';
		plus.addEventListener('click', function () { newProject(); renderTabs(); });
		strip.appendChild(plus);
	}
	function switchToTab(id) {
		if (id === library.openId) { return; }
		openProject(id);
		renderTabs();
	}
	// ---- menus ----
	// One popover for all three menus (File, a tab's own, the overflow list). They differ only in
	// their rows, so three popovers would have been three copies of the same positioning and dismissal.
	// The three view popovers (Labels, Settings, Units). They are peers of the menus, so opening a
	// menu closes them and a click anywhere outside them closes them -- Tom, 2026-08-04: "Can the
	// Labels form go away when user clicks away or at least when another menu item is selected? We
	// are currently seeing the other menus while Labels persists." The property popup (#lpn_popup) is
	// deliberately NOT in this list: it has its own currentPopup machinery and its own dismissal.
	var VIEW_POPOVERS = ['lpn_labels_popup', 'lpn_settings_popup'];
	function closeViewPopovers(except) {
		VIEW_POPOVERS.forEach(function (id) {
			if (id === except) { return; }
			var el = document.getElementById(id);
			if (el) { el.style.display = 'none'; }
		});
	}
	// Which control opened the menu that is showing, so a second click on the SAME control closes it
	// instead of rebuilding it (Tom, 2026-08-04: the vertical-tabs icon "doesn't toggle"). The
	// document-level dismissal cannot do this on its own, because these controls stopPropagation --
	// they have to, or opening a menu would immediately dismiss it.
	var openMenuAnchor = null;

	// ---- Icons (ROADMAP Task 231) ----
	// Prefix, never replacement: every control keeps its word, and the icon rides in front of it.
	// Icon-only was rejected suite-wide -- it saves no translation work (the label stays) and spends
	// first-time comprehension, which is the audience a web calculator exists for.
	//
	// GEOMETRY IS NOT DEFINED HERE. It lives once in lib/Icons.lib.php and arrives as
	// EngCalcs.icons; the wrapper attributes arrive as EngCalcs.iconOpenTag, so stroke weight and
	// viewBox are one decision shared with PHP's ecIcon() rather than two that drift. Redrawing a
	// path here would be a second icon pretending to be the first.
	//
	// The first pass used emoji and Tom's review killed it (2026-08-08) on the two icons that carry
	// the most meaning: a reservoir is an open-top tank and a pump is a circle with a tangent tail,
	// and Unicode has neither. Those are the shapes this canvas already draws, so the icon that
	// teaches the notation beats an approximate glyph -- and unlike emoji, these inherit the row's
	// colour, so a disabled row greys its icon with no extra rule.
	// Both helpers live in js/Calculators.lib.js so every page in the suite builds an icon the same
	// way; these are just local names for them. setLabel() is the ONLY way a control here gets an
	// icon + word, so no call site can quietly grow a second convention -- which is exactly how the
	// toolbar's Settings popover shipped without its warning triangle (Tom, 2026-08-08: "I see it on
	// the pull-down menu Settings, but not on the toolbar Settings"). Two render sites, one missed.
	function iconEl(name) { return EngCalcs.iconEl(name); }
	function setLabel(el, iconName, text) { EngCalcs.setLabel(el, iconName, text); }
	// A map symbol (ROADMAP Task 146.10 -- real element symbols from this same icon set) is the
	// SAME markup iconEl() builds for a toolbar button, just re-homed onto the canvas: strip the
	// button-sizing 'ec-icon' class (its CSS width/height:1.05em would fight the explicit
	// world-unit x/y/width/height the caller sets) and give it the caller's own class instead.
	// Everything else -- paths, stroke weight, the currentColor hookup -- stays exactly what
	// iconEl() already built, so a map symbol and its toolbar icon are never two drawings of one
	// shape.
	function buildMapIconSvg(name, cls) {
		var svgEl = iconEl(name);
		if (!svgEl) { return null; }
		svgEl.setAttribute('class', cls);
		return svgEl;
	}
	// A toolbar icon is drawn stroke-only, fill:none (Icons.lib.php's EC_ICON_OPEN_TAG) -- correct
	// for a button, where nothing is ever behind it, but on the map a pipe can run right through
	// the open/translucent parts of a reservoir tank or a pump casing and show through (Tom,
	// 2026-08-09: "they should be opaque so that they hide the pipes under/through them"). This
	// prepends one opaque shape as the FIRST child of an icon built by buildMapIconSvg(), so it
	// paints underneath the icon's own (unmodified) linework rather than replacing any of it --
	// the shared paths from lib/Icons.lib.php are still never redrawn, this only adds an occlusion
	// backing behind them. Filled with --lpn-map-bg (css/engcalcs.css), matching the canvas's own
	// background, so the patch reads as "the icon is opaque," not as a colored blob.
	function prependSymbolBackdrop(svgEl, tag, attrs, cls) {
		if (!svgEl) { return; }
		var b = el(tag, attrs, null);
		b.setAttribute('class', cls);
		svgEl.insertBefore(b, svgEl.firstChild);
	}

	// TWO LEVELS (Task 264 rework, Tom 2026-08-10). Level 0 is a pull-down under its menubar or
	// toolbar button; level 1 is a FLY-OUT beside the row that opened it, with the parent still on
	// screen. The first cut replaced the parent's contents in the one popup, which is what Tom
	// rejected: "the universal convention is for that to be a fly-out submenu of New rather than a
	// visually disconnected replacement." He is right, and the disconnection is also what hid the
	// dismissal bug -- a menu that legitimately swaps its own contents looks exactly like one that
	// has been closed.
	function menuEls(level) {
		return level
			? { popup: document.getElementById('lpn_menu_popup2'), list: document.getElementById('lpn_menu_list2') }
			: { popup: document.getElementById('lpn_menu_popup'), list: document.getElementById('lpn_menu_list') };
	}
	function openMenu(anchor, rows, level) {
		var els = menuEls(level), popup = els.popup, list = els.list;
		if (!popup || !list) { return; }
		if (!level) {
			if (openMenuAnchor === anchor && popup.style.display === 'block') { closeMenu(); return; }
			openMenuAnchor = anchor;
			closeSubMenu();   // a new pull-down never inherits the previous one's fly-out
			closeViewPopovers();
		}
		list.innerHTML = '';
		rows.forEach(function (r) {
			if (r.hidden) { return; }
			if (r.separator) {
				var hr = document.createElement('hr');
				hr.style.cssText = 'margin:3px 0;border:0;border-top:1px solid #ccc';
				list.appendChild(hr);
				return;
			}
			// A group label, not a command: the recent-file rows below it carry file names, and
			// without a word over them a menu of bare filenames does not say what it will do with
			// one. A <div> rather than a disabled button so it is never in the tab order.
			if (r.heading) {
				var hd = document.createElement('div');
				hd.className = 'lpn-menu-heading';
				hd.textContent = r.label;
				list.appendChild(hd);
				return;
			}
			var b = document.createElement('button');
			b.type = 'button';
			b.className = 'lpn-menu-row';
			// A reserved icon column, not an inline prefix: a row with no natural glyph leaves the
			// cell EMPTY and its text still lines up with its neighbours. Prefixing inline instead
			// would ragged-edge the whole menu the moment one row went without.
			var ic = document.createElement('span');
			ic.className = 'lpn-menu-icon';
			var ic2 = r.icon ? iconEl(r.icon) : null;
			if (ic2) { ic.appendChild(ic2); }
			b.appendChild(ic);
			b.appendChild(document.createTextNode(r.label));
			// A menu row is its own click target, so the tip goes straight on it as a title matched to
			// .ec-help for touch -- the same pattern the toolbar buttons use.
			if (r.tip) { b.title = r.tip; b.className += ' ec-help'; }
			b.disabled = !!r.disabled;
			if (r.submenu) {
				// The universal marker for "there is more this way". Directional, so it wants a
				// mirrored glyph in the five RTL languages -- the same outstanding caveat the
				// Settings accordion's arrows already carry.
				var arrow = document.createElement('span');
				arrow.className = 'lpn-menu-arrow';
				arrow.textContent = '▸';
				b.appendChild(arrow);
				// Click AND hover, because both are the convention and they cost the same. Either way
				// the click is STOPPED: a row that opens a menu must not let its click reach the
				// document dismissal in wireTabs(), which by then cannot find the row inside the
				// popup and would close what was just opened. That was Tom's "File New has no
				// options. And it does nothing."
				b.addEventListener('click', function (e) { e.stopPropagation(); openMenu(b, r.submenu(), 1); });
				b.addEventListener('mouseenter', function () { cancelSubClose(); openMenu(b, r.submenu(), 1); });
			} else if (level) {
				// A row INSIDE the fly-out keeps it open. This is the whole of Tom's "it disappears
				// before the mouse can reach it; it honestly seems to disappear BECAUSE you reach
				// it" (2026-08-10) -- and it did: the dismiss-on-hover below was attached to every
				// plain row at every level, so entering "Blank project" closed the menu that
				// "Blank project" was in.
				b.addEventListener('mouseenter', cancelSubClose);
				b.addEventListener('click', function (e) { closeMenu(); r.fn(e); });
			} else {
				// Moving onto a plain row in the PARENT dismisses the fly-out, as every desktop menu
				// does -- otherwise it hangs beside a row it no longer belongs to. On a DELAY, because
				// the path from "New project…" to its fly-out is diagonal and crosses the rows
				// underneath: closing on the first of them is the other half of "you can't get to it".
				b.addEventListener('mouseenter', scheduleSubClose);
				b.addEventListener('click', function (e) { closeMenu(); r.fn(e); });
			}
			list.appendChild(b);
		});
		// Same position-from-the-anchor-rect-then-clamp dance the property popovers use. A fly-out
		// goes BESIDE its row (right edge, top aligned) rather than below it, which is what makes it
		// read as a branch of the parent instead of a replacement for it.
		var rect = anchor.getBoundingClientRect();
		var wantLeft = level ? rect.right : rect.left;
		var wantTop = level ? rect.top : rect.bottom;
		popup.style.left = wantLeft + 'px';
		popup.style.top = wantTop + 'px';
		popup.style.display = 'block';
		var pr = popup.getBoundingClientRect();
		// A fly-out with no room to its right flips to the LEFT of the parent row rather than being
		// clamped on top of it -- the clamp alone would slide it back over the words it branches from.
		if (level && wantLeft + pr.width > window.innerWidth - 4) { wantLeft = rect.left - pr.width; }
		popup.style.left = Math.max(4, Math.min(wantLeft, window.innerWidth - pr.width - 4)) + 'px';
		popup.style.top = Math.max(4, Math.min(wantTop, window.innerHeight - pr.height - 4)) + 'px';
		// Rows are built fresh on every open, so their tips are new DOM every time and need arming --
		// this is exactly the case ROADMAP Task 173 added initTips(root) for (a tooltip built after
		// page load is dead on touch without it).
		if (EngCalcs.initTips) { EngCalcs.initTips(popup); }
	}
	// The classic fly-out grace period. Travelling from the parent row to its fly-out is a DIAGONAL
	// move across the rows below, so dismissing on the first row entered makes the submenu
	// unreachable by pointer -- you can only ever get there in a straight line, and menus are not
	// laid out for that. Arm a close instead, and let anything inside the fly-out cancel it.
	var subCloseTimer = null;
	var SUB_CLOSE_MS = 350;
	function cancelSubClose() {
		if (subCloseTimer) { clearTimeout(subCloseTimer); subCloseTimer = null; }
	}
	function scheduleSubClose() {
		cancelSubClose();
		subCloseTimer = setTimeout(function () { subCloseTimer = null; closeSubMenu(); }, SUB_CLOSE_MS);
	}
	function closeSubMenu() {
		cancelSubClose();
		var p = document.getElementById('lpn_menu_popup2');
		if (p) { p.style.display = 'none'; }
	}
	function closeMenu() {
		var p = document.getElementById('lpn_menu_popup');
		if (p) { p.style.display = 'none'; }
		closeSubMenu();   // the fly-out belongs to the pull-down; it cannot outlive it
		openMenuAnchor = null;
	}
	// File > New project (ROADMAP Task 264, Tom 2026-08-10). A second popup off the same anchor
	// rather than a hover-out submenu: the menu machinery here is one flat popover, hover submenus are
	// a poor bargain on the touch screens this page is used on, and one extra click on a command used
	// once per project is not a cost worth new machinery.
	//
	// **Each example COMMITS TO A UNIT SYSTEM; it does not adapt to yours.** That is the whole point of
	// the rework. Every water-network example published anywhere -- EPANET's included -- is a US
	// example or an SI example, never one drawing that rewrites itself, and a user who opens "Basic US
	// units" and sees inches has been told the truth by the name they clicked. It also removes the only
	// thing in this page that needed inputs to convert when a unit changed, which is what unblocks
	// Task 263.
	function newProjectRows() {
		var pc = EngCalcs.pageConfig || {};
		return [
			// **A BLANK PROJECT COMMITS TO A UNIT SYSTEM TOO** (Tom, 2026-08-10: "to act more like
			// other software, let's just have 'Blank project, US units (gpm)' and 'Blank project, SI
			// units (l/s)'"). The single "Blank project" row inherited whatever units happened to be
			// on the strip, which is the one thing left on this page that decided a project's units
			// by accident -- and since Task 263 a project's units are part of the project. With this
			// the fly-out is a template list, which is the shape File > New has in every application
			// that has one.
			{ icon: 'new', label: pc.lpn_new_blank_us || 'Blank project, US units (gpm)', fn: function () { newBlankProject('us'); } },
			{ icon: 'new', label: pc.lpn_new_blank_si || 'Blank project, SI units (l/s)', fn: function () { newBlankProject('si'); } },
			{ separator: true },
			{ heading: true, label: pc.lpn_new_from_examples || 'From examples' },
			// The flow unit is IN THE LABEL, not merely implied by "US"/"SI" (Tom, 2026-08-10: "it's
			// important in this situation to show them what our preset flow units are"). gpm and l/s are
			// the concrete thing a water engineer recognises at a glance; the system name alone is a
			// category they have to translate into units themselves.
			{ icon: 'example', label: pc.lpn_new_example_us || 'Basic network, US units (gpm)', fn: function () { newProjectFromExample('us'); } },
			{ icon: 'example', label: pc.lpn_new_example_si || 'Basic network, SI units (l/s)', fn: function () { newProjectFromExample('si'); } }
		];
	}
	// The TOOLBAR route opens these as a pull-down under the button, not as a fly-out: there is no
	// parent row for it to branch from. Same rows either way, built once.
	function openNewProjectMenu(anchor) { openMenu(anchor, newProjectRows()); }
	// Blank project, then the units, then the drawing -- in that order, and the order is the design.
	// setUnits() moves the whole units strip to the preset and calls submitForm(), which re-enters
	// EngCalcs.pageCalculator; doing it on a project that is still empty means nothing is on screen to
	// be re-rendered against the new units. drawExampleNetwork() then reads those selects through
	// niceDefault() and lands on one branch deterministically, instead of on whatever the visitor
	// happened to have set.
	//
	// This ASKS FOR NOTHING. Tom's first sketch had a permission dialog ("Set project units to match
	// example network?"), and then answered it himself with the better version: make the choice the
	// menu item. The user has already said which system they want by which row they clicked, so a
	// dialog confirming it would be asking a question they just answered.
	// Blank project, then the units, then whatever content -- and the order is the design. setUnits()
	// moves the whole strip to the preset and re-enters EngCalcs.pageCalculator; doing it while the
	// project is still empty means nothing is on screen to be re-rendered against the new units.
	function newProjectWithUnits(system) {
		var id = newProject();
		if (EngCalcs.setUnits) { EngCalcs.setUnits(system); }
		return id;
	}
	function newBlankProject(system) {
		// stampProjectSaved AFTER setUnits: the unit switch is a change like any other and marks the
		// project dirty, so stamping first would leave a brand-new empty tab wearing an asterisk --
		// the very defect the baseline exists to remove.
		stampProjectSaved(newProjectWithUnits(system));
		renderTabs();
	}
	function newProjectFromExample(system) {
		var id = newProjectWithUnits(system);
		drawExampleNetwork();
		// The example is not the user's unsaved work either -- it arrived by their choosing it from a
		// menu, and it is two clicks to get back. So it starts clean, exactly as a blank project
		// does, and earns its asterisk at the first edit.
		stampProjectSaved(id);
		renderTabs();
	}
	function openFileMenu(anchor) {
		var pc = EngCalcs.pageConfig || {}, id = library.openId, entry = indexEntry(id);
		var linked = isLinked(id), api = fileApiAvailable();
		// Recent files sit directly under Open…, which is where thirty years of File menus have put
		// them, and are simply ABSENT when there are none -- an empty "Recent files" heading over
		// nothing teaches the user only that the feature does not work yet. They cannot appear at all
		// without the File System Access API, because a browser with no handle to keep has nothing to
		// remember: there, opening a file is an upload and there is no way back to it.
		var recentRows = [];
		if (api && recentFiles.length) {
			recentRows.push({ separator: true });
			recentRows.push({ heading: true, label: pc.lpn_file_recent || 'Recent files' });
			recentFiles.forEach(function (rec) {
				recentRows.push({
					icon: 'open',
					// The file NAME, not the project name: this list is about files on the disk, and
					// the project inside one may since have been renamed or may not exist here at all.
					label: rec.name,
					tip: (pc.lpn_recent_tip || 'Open {file} again, without looking for it.').replace('{file}', rec.name),
					fn: function () { openRecentFile(rec); }
				});
			});
		}
		openMenu(anchor, [
			// New project OPENS A SUBMENU now (Task 264, Tom 2026-08-10) rather than making a blank
			// one on the spot -- "Blank project" is still the first row of it, so the old act is one
			// extra click and every other way to start is finally reachable from the same place.
			{ icon: 'new', label: pc.lpn_file_new || 'New project…', submenu: newProjectRows },
			{ icon: 'open', label: pc.lpn_file_open || 'Open…', fn: openFromFile }
		].concat(recentRows, [
			{ separator: true },
			// **The menu says Save and Save as… in every browser** (Tom, 2026-08-04, overruling the
			// first version: *"'Download a copy' is a mistake, and the menu item we want is
			// 'Save as...'"*). He is right twice. A paradigm we are ADOPTING has two names for
			// writing a file, and this page already spends "copy" on Duplicate -- a third word for a
			// third thing nobody asked for is exactly the invention we are trying to stop doing. And
			// where there is no File System Access API, what the browser does IS a Save As: it writes
			// a new file and picks the location itself.
			//
			// What the fallback genuinely cannot do -- connect to that file -- is said AFTER the
			// act, by lpn_status_downloaded, and shown continuously by an asterisk that never clears.
			// That answers Tom's original complaint ("when I save again, I get a second copy") at the
			// moment it arises, without a menu label carrying the caveat forever.
			// DISABLED on a read-only project, not merely rerouted (Tom, 2026-08-04: "On Open
			// read-only, File, Save is not disabled. Read only is read only."). saveCurrent() still
			// routes to Save as if it is ever reached another way, but a live Save row on a project
			// that can never be saved is the menu telling a lie about what it will do.
			// **Save is DISABLED where no connection is possible** (Tom, 2026-08-04). Save means
			// "write to the connected file"; with no connection there is no file for it to write to,
			// and a Save that quietly produced a download instead was the command doing something
			// other than its name. Save as is then the only way out, which is the truth of that
			// browser stated as a menu rather than as a caveat.
			//
			// No tip on the disabled row: a disabled button fires no mouse events, so its title never
			// appears. The explanation lives on Save as, which IS reachable.
			{
				icon: 'save',
				label: pc.lpn_file_save || 'Save',
				tip: api ? pc.lpn_file_save_tip : null,
				fn: saveCurrent,
				disabled: readOnly || !api
			},
			// The Save as tip is where the browser-settings advice lives (Tom, 2026-08-04) -- it
			// answers the question at the moment the user is choosing where their work goes, rather
			// than in a dialog they met once on the way in.
			{
				icon: 'saveas',
				label: pc.lpn_file_saveas || 'Save as…',
				tip: api ? pc.lpn_file_saveas_tip : pc.lpn_file_saveas_tip_download,
				fn: saveAs
			},
			// **Present always, disabled when it would do nothing** (fixed 2026-08-05, Tom: "Save all
			// is not present"). It used to be HIDDEN below two dirty file projects, which is how a
			// command that exists became a command nobody can find: a row that appears and disappears
			// teaches no one it is there, and its absence reads as a missing feature rather than as a
			// state. Every sibling here -- Save, Revert -- greys out instead, and consistency inside
			// one short menu is worth more than the one row of clutter this costs.
			{ icon: 'saveall', label: pc.lpn_file_saveall || 'Save all', fn: saveAllFiles, disabled: dirtyFileCount() < 2 },
			// Only offered when there is something to revert TO and something to revert FROM.
			// Reachable in READ-ONLY on purpose (Tom, 2026-08-05: "Revert is not an option"). Revert
			// re-reads the file and throws your edits away -- which is exactly what somebody locked
			// out of a file wants when they decide the colleague's version wins. Disabling it there
			// left "Save as to a new file" as the only exit, and forked a project that did not need
			// forking. It writes nothing, so it is safe in every state.
			{ icon: 'revert', label: pc.lpn_file_revert || 'Revert', fn: revertCurrent, disabled: !(linked && entry && entry.dirty) },
			{ separator: true },
			{ icon: 'close', label: pc.lpn_file_close || 'Close', fn: function () { closeTab(id); } }
		]));
	}
	// ---- The menu bar (ROADMAP Task 211, 2026-08-04) ----
	// Every command on this page is reachable from here. The toolbar below is the high-use subset,
	// which is the conventional relationship between the two -- so a command appearing in both is
	// correct, not duplication to be cleaned up.
	//
	// The names are the ones desktop applications have used for thirty years (File, Edit, Insert,
	// View, Settings). Adopting a paradigm only pays if it is adopted whole: a menu bar with clever
	// names of our own would cost the user exactly what a menu bar is supposed to save them.
	//
	// Rows are data, not markup, so moving a command between menus is a one-line change. That is
	// deliberate -- where each command belongs is a judgement Tom will want to revise after seeing it.
	function openEditMenu(anchor) {
		var pc = EngCalcs.pageConfig || {};
		openMenu(anchor, [
			{ icon: 'undo', label: pc.lpn_tool_undo || 'Undo', fn: undo },
			{ separator: true },
			// Select all -> Delete is the paradigmatic route and this page cannot offer it yet: the
			// selection model is single-element. Until multi-select exists, this named command IS
			// that route, and it is the honest way to say so -- a greyed-out "Select all" would be a
			// promise with nothing behind it.
			{ icon: 'del', label: pc.lpn_tool_delete || 'Delete', fn: function () { setMode(mode === 'delete' ? 'select' : 'delete'); } },
			{ icon: 'delnetwork', label: pc.lpn_edit_delete_network || 'Delete network', fn: deleteNetwork }
		]);
	}
	function openInsertMenu(anchor) {
		var pc = EngCalcs.pageConfig || {};
		openMenu(anchor, [
			{ icon: 'reservoir', label: pc.lpn_tool_add_reservoir || 'Reservoir', fn: function () { setMode('add-reservoir'); } },
			{ icon: 'pump', label: pc.lpn_tool_add_pump || 'Pump', fn: function () { setMode('add-pump'); } },
			{ icon: 'junction', label: pc.lpn_tool_add_junction || 'Junction', fn: function () { setMode('add-junction'); } },
			{ icon: 'pipe', label: pc.lpn_tool_add_pipe || 'Pipe', fn: function () { setMode('add-pipe'); } },
			{ icon: 'text', label: pc.lpn_tool_add_text || 'Text', fn: function () { setMode('add-text'); } },
			{ separator: true },
			// The backdrop submenu, flattened into a labelled group. Scale/Position/Remove are greyed
			// with no image present, exactly as the toolbar select greys them -- one state, read from
			// the same place.
			{ icon: 'image', label: pc.lpn_backdrop_add || 'Add image', fn: function () { backdropAction('add'); } },
			{ icon: 'scale', label: pc.lpn_backdrop_scale || 'Scale', fn: function () { backdropAction('scale'); }, disabled: !backdrop },
			{ icon: 'position', label: pc.lpn_backdrop_position || 'Position', fn: function () { backdropAction('position'); }, disabled: !backdrop },
			{ icon: 'del', label: pc.lpn_backdrop_remove || 'Remove image', fn: function () { backdropAction('remove'); }, disabled: !backdrop },
			{ separator: true },
			// "Draw example network" is GONE from here (Task 264, Tom 2026-08-10). Insert adds an element
			// to the drawing you are in; an example is a whole network, and dropping one on top of your
			// work was never an insert. It is now File > New project > From examples, which is also what
			// lets each example commit to a unit system instead of adapting to yours.
			// Dev-only, and last, and still wearing its bracketed label so it reads as
			// not-a-real-feature (Tom, 2026-07-30, on the label). Deliberately NOT translated: it is
			// scaffolding for measuring how ~100 links performs, and it goes when that question is
			// settled -- see drawTestGrid(). Putting a throwaway through 26 languages would be worse
			// than leaving it in English.
			{ icon: 'devtest', label: '[dev] Draw large test network', fn: drawTestGrid }
		]);
	}
	function openViewMenu(anchor) {
		var pc = EngCalcs.pageConfig || {};
		openMenu(anchor, [
			{ icon: 'zoom', label: pc.lpn_tool_zoom_extent || 'Zoom to fit', fn: zoomExtent },
			{ separator: true },
			// The popover openers position themselves from evt.currentTarget, so a menu row hands them
			// the menu-bar button it came from -- the popover then opens under "View", where the eye
			// already is, rather than under a toolbar button that may not even be on screen.
			{ icon: 'labels', label: pc.lpn_tool_labels || 'Labels', fn: function () { toggleLabelsPopup({ currentTarget: document.getElementById('lpn_menu_view') }); } }
		]);
	}
	// openSettingsMenu() is GONE (Task 241). Its three rows now live where they belong: Settings
	// and Units are sections of the panel, and Clear calculator is the button at its foot --
	// which it already was, so the menu row was the duplicate, not the button.
	function buildMenuBar() {
		var pc = EngCalcs.pageConfig || {}, bar = document.getElementById('lpn_menubar');
		if (!bar) { return; }
		bar.innerHTML = '';
		[
			{ id: 'lpn_menu_file', icon: 'file', label: pc.lpn_tool_file || 'File', open: openFileMenu },
			{ id: 'lpn_menu_edit', icon: 'edit', label: pc.lpn_menu_edit || 'Edit', open: openEditMenu },
			{ id: 'lpn_menu_insert', icon: 'insert', label: pc.lpn_menu_insert || 'Insert', open: openInsertMenu },
			{ id: 'lpn_menu_view', icon: 'view', label: pc.lpn_menu_view || 'View', open: openViewMenu },
			// Settings is the one menu-bar item that opens a PANEL, not a pull-down (Task 241, Tom
			// 2026-08-08): "there be a duplicated identical Settings that lives on the Toolbar and in
			// the Menu". Identical label, identical element, both places -- which is the rule the old
			// arrangement broke by making the toolbar button open the panel and the menu open a list
			// whose first row was also called Settings.
			{ id: 'lpn_menu_settings', icon: 'settings', label: pc.lpn_menu_settings || 'Settings', open: function (a) { toggleSettingsPopup({ currentTarget: a }); } }
		].forEach(function (m) {
			var b = document.createElement('button');
			b.type = 'button';
			b.id = m.id;
			b.className = 'lpn-menubar-item';
			setLabel(b, m.icon, m.label);
			b.addEventListener('click', function (e) { e.stopPropagation(); m.open(e.currentTarget); });
			bar.appendChild(b);
		});
	}
	// Swaps the tab at `id` with its neighbor in the TAB STRIP order (library.projects, which is
	// display order, not recency -- see the note at renderTabs()). Task 252, Tom 2026-08-09: "Either
	// Drag or click an item on the tab menu. Either one is fine" -- the menu item is the cheaper of
	// the two and works on touch, where dragging a tab fights the scroll gesture.
	function moveTab(id, dir) {
		var idx = library.projects.findIndex(function (p) { return p.id === id; });
		var swapWith = idx + dir;
		if (idx < 0 || swapWith < 0 || swapWith >= library.projects.length) { return; }
		var tmp = library.projects[idx];
		library.projects[idx] = library.projects[swapWith];
		library.projects[swapWith] = tmp;
		saveIndex();
		renderTabs();
	}
	function openProjectMenu(id, anchor) {
		var pc = EngCalcs.pageConfig || {}, entry = indexEntry(id);
		if (!entry) { return; }
		// Rename IS Save As on a file project: its name and its file's name are one name (Amendment 2).
		// This is the label doing that work in the one place a user goes looking to rename something.
		var renameLabel = isFileProject(entry) ? (pc.lpn_file_saveas || 'Save as…') : (pc.lpn_project_rename || 'Rename');
		var idx = library.projects.findIndex(function (p) { return p.id === id; });
		openMenu(anchor, [
			{
				icon: isFileProject(entry) ? 'saveas' : 'edit',
				label: renameLabel,
				fn: function () {
					if (isFileProject(entry)) { saveAs(); return; }
					var v = window.prompt(pc.lpn_prompt_project_name || 'Name for this project', entry.name || '');
					if (v === null) { return; }
					renameProject(id, v.trim());
					renderTabs();
				}
			},
			{
				icon: 'duplicate',
				label: pc.lpn_tab_duplicate || 'Duplicate',
				fn: function () {
					var suggested = projectDisplayName(entry) + ' ' + (pc.lpn_project_copy_suffix || '(copy)');
					var v = window.prompt(pc.lpn_prompt_project_name || 'Name for this project', suggested);
					if (v === null) { return; }
					if (id !== library.openId) { openProject(id); }
					saveProjectAs(v.trim());
					renderTabs();
				}
			},
			{ separator: true },
			{ label: pc.lpn_tab_move_left || 'Move left', disabled: idx <= 0, fn: function () { moveTab(id, -1); } },
			{ label: pc.lpn_tab_move_right || 'Move right', disabled: idx < 0 || idx >= library.projects.length - 1, fn: function () { moveTab(id, 1); } },
			{ separator: true },
			{ icon: 'close', label: pc.lpn_file_close || 'Close', fn: function () { closeTab(id); } }
		]);
	}
	function openTabListMenu(anchor) {
		openMenu(anchor, library.projects.map(function (p) {
			var star = tabAsterisk(p);
			return {
				label: (star.show ? '*' : '') + (isFileProject(p) ? p.fileName : projectDisplayName(p)),
				fn: function () { switchToTab(p.id); }
			};
		}));
	}
	// ---- close ----
	// Closing a tab is the ONLY way a project leaves this browser, and the asterisk decides whether it
	// asks first. A clean file project goes quietly -- its work is on disk. Anything wearing an
	// asterisk gets the question, in the words its situation deserves: a dirty file project can be
	// saved, while a browser project has nowhere to be saved TO yet, so its first button is Save as
	// and its message says plainly that closing without saving ends it.
	function closeTab(id) {
		var pc = EngCalcs.pageConfig || {}, entry = indexEntry(id);
		if (!entry) { return; }
		// A browser-only project always carries the (faded) asterisk -- see tabAsterisk() -- because
		// it is in no file at all, not because anyone touched it. An untouched "+"-created project is
		// exactly that: nothing drawn, nothing to lose, so the "gone for good" prompt below would be
		// pure noise (punch list §4, Tom 2026-08-06).
		// THE ASTERISK DECIDES, and now it decides alone. The second clause here used to read
		// `|| (!isFileProject(entry) && projectIsEmpty(id))` -- a special case that closed an empty
		// browser project silently DESPITE its asterisk, because under the old rule every browser
		// project wore one from birth. That is the disagreement Tom named ("a blank project with
		// asterisk closes without confirmation, which is bad"): the mark said one thing and the
		// behaviour did another, and the special case existed only to paper over a mark that should
		// never have been there. With baselines the asterisk is right, so the exception is gone and
		// the rule is literally true again.
		//
		// Consequence, deliberate: a project you drew and then emptied is dirty, so closing it now
		// asks. It did not before. Asking about work somebody did is the safer side to err on.
		if (!tabAsterisk(entry).show) { discardProject(id); renderTabs(); return; }
		// A read-only project is offered Save as for the same reason its File menu is (Tom,
		// 2026-08-04: "this situation cannot allow Save. It must offer Save as..."). Treated exactly
		// like a project that has no file yet, because in the only sense that matters here it has
		// none: there is no file it may write.
		var mustSaveAs = !isFileProject(entry) || roProjects.has(id);
		var isBrowser = !isFileProject(entry), name = projectDisplayName(entry);
		openDialog(function (body) {
			var p = document.createElement('p');
			p.style.margin = '0';
			p.textContent = (isBrowser
				? (pc.lpn_close_browser_prompt || '{name} is kept only in this browser. If you close it without saving it to a file, it is gone for good.')
				: (pc.lpn_close_save_prompt || 'Save your changes to {name} before closing it?')).replace('{name}', name);
			body.appendChild(p);
		}, [
			{
				label: mustSaveAs ? (pc.lpn_file_saveas || 'Save as…') : (pc.lpn_file_save || 'Save'),
				fn: async function () {
					if (id !== library.openId) { switchToTab(id); }
					var downloaded = !fileApiAvailable();
					if (mustSaveAs) { await saveAs(); } else { await saveCurrent(); }
					// Close ONLY if the save really landed. A cancelled file picker or a failed write
					// must leave the project exactly where it was rather than discarding it on the
					// strength of having asked.
					//
					// The fallback is the one exception, and it has to be: a download can never clear
					// the asterisk, because there is no handle to write back through. Refusing to
					// close there would trap the user in a prompt whose first button can never
					// satisfy it. The file IS in their downloads, which is what they asked for.
					var after = indexEntry(id);
					if (downloaded || (after && !tabAsterisk(after).show)) { discardProject(id); renderTabs(); }
				}
			},
			{ label: pc.lpn_close_discard || 'Close without saving', fn: function () { discardProject(id); renderTabs(); } },
			{ label: pc.lpn_cancel || 'Cancel', fn: function () { } }
		]);
	}
	// ---- the dialog ----
	// Deliberately NOT window.confirm(): showSaveFilePicker() needs a live user activation, and
	// Chrome's transient activation expires after a few seconds -- so a blocking dialog would work for
	// a fast reader and throw "must be handling a user gesture" for a careful one. A button in here is
	// a fresh click. The dialog is dismissed BEFORE the action runs, so the action inherits that click.
	function openDialog(buildBody, buttons) {
		var dlg = document.getElementById('lpn_dialog');
		var body = document.getElementById('lpn_dialog_body');
		var bar = document.getElementById('lpn_dialog_buttons');
		if (!dlg || !body || !bar) { return; }
		body.innerHTML = '';
		bar.innerHTML = '';
		buildBody(body);
		buttons.forEach(function (b) {
			var btn = document.createElement('button');
			btn.type = 'button';
			btn.style.marginLeft = '6px';
			btn.textContent = b.label;
			btn.addEventListener('click', function () { closeDialog(); b.fn(); });
			bar.appendChild(btn);
		});
		// **MODAL MEANS MODAL** (Tom, 2026-08-05: "I still can change tabs/projects, and this can
		// confuse my feeble human mind"). The element has always claimed `aria-modal="true"`, but
		// with nothing behind it the claim was a lie to screen readers and no obstacle at all to a
		// mouse -- the tab strip, the toolbar and the map all stayed live underneath a question
		// about the very project you could switch away from. The backdrop is what makes it true.
		var back = document.getElementById('lpn_dialog_backdrop');
		if (back) { back.style.display = 'block'; }
		dlg.style.display = 'block';
		var first = bar.querySelector('button');
		if (first) { first.focus(); }
	}
	function closeDialog() {
		var d = document.getElementById('lpn_dialog');
		if (d) { d.style.display = 'none'; }
		var back = document.getElementById('lpn_dialog_backdrop');
		if (back) { back.style.display = 'none'; }
	}
	function wireTabs() {
		// Dismiss the menu, and the view popovers, on any click that is not inside them. The dialog is
		// deliberately NOT dismissed this way -- it asks a question that has to be answered, and
		// Cancel is one of the answers.
		// The fly-out's own box, not just its rows: the pointer crosses 4px of padding on the way in,
		// and a close armed by the parent must not fire in that gap.
		var subPopup = document.getElementById('lpn_menu_popup2');
		if (subPopup) { subPopup.addEventListener('mouseenter', cancelSubClose); }
		document.addEventListener('click', function (e) {
			var popup = document.getElementById('lpn_menu_popup');
			var sub = document.getElementById('lpn_menu_popup2');
			// `onAnchor` is belt, not the fix: a control that opens a menu should stop this click
			// itself. But "the click that opened it must not also close it" is a rule worth holding
			// in one place, because getting it wrong looks like the feature simply not working --
			// no error, no menu, twice now.
			var onAnchor = openMenuAnchor && (e.target === openMenuAnchor ||
				(openMenuAnchor.contains && openMenuAnchor.contains(e.target)));
			// A click in the FLY-OUT is a click in the menu. Without this the submenu's own rows
			// would dismiss the pull-down under them mid-click.
			var inSub = sub && sub.style.display === 'block' && sub.contains(e.target);
			if (popup && popup.style.display === 'block' && !popup.contains(e.target) && !inSub && !onAnchor) { closeMenu(); }
			// A click inside ANY of them leaves ALL of them alone: the popovers hold live controls
			// (unit selects, checkboxes, number fields), and closing one because the pointer went
			// down in another would be worse than leaving both open.
			var inside = VIEW_POPOVERS.some(function (id) {
				var el = document.getElementById(id);
				return el && el.style.display === 'block' && el.contains(e.target);
			});
			// The menu bar and the toolbar own their own opening logic; a click there must not be
			// read as "clicked away" before that logic runs.
			var onChrome = e.target.closest && e.target.closest('#lpn_menubar, #lpn_toolbar, #lpn_menu_popup');
			if (!inside && !onChrome) { closeViewPopovers(); }
		});
		// The hidden picker lives in the page, not in a popup body that gets replaced wholesale --
		// the same reason lpn_backdrop_file does. Cleared after every pick so re-choosing the SAME
		// file still fires a change event.
		var fileInput = document.getElementById('lpn_project_file');
		if (!fileInput) { return; }
		fileInput.addEventListener('change', function () {
			var f = fileInput.files[0];
			fileInput.value = '';
			if (f) { importProjectFromFile(f); }
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
	// **"Clear project" is gone; this is "Delete network"** (Task 211, Tom 2026-08-04). His own
	// diagnosis: clearing a project was a vestige of the single-project debut of this page -- with
	// tabs, "empty this project" is not a thing anyone needs, because starting a new tab and closing
	// the old one is the same act in fewer ideas. What survives is the narrower thing the workflow
	// actually wants: duplicate a project, delete its DRAWING, keep everything else.
	//
	// So the BACKGROUND IMAGE now survives too, where "Clear project" wiped it. That is the point of
	// the rename: a backdrop is not part of the network, and the workflow this command exists for --
	// a second scheme on the same site -- wants the site plan to stay. "Remove image" in the backdrop
	// menu is still there for the other case.
	//
	// The paradigmatic route is Edit -> Select all -> Delete, which this page cannot offer yet: the
	// selection model is single-element. Until multi-select exists, this named command IS that route.
	function deleteNetwork() {
		var pc = EngCalcs.pageConfig || {};
		if (!window.confirm(pc.lpn_confirm_delete_network || 'Delete every node, pipe, and text label in this project? The background image, the project name, and your settings are kept. This cannot be undone.')) { return; }
		doc = { nodes: [], links: [], labels: [] };
		nextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };
		// Empties the PROJECT, so the container resets with the network: scenarios back to Base alone
		// (their overrides key element IDs that no longer exist). Preferences (settings/labelSettings)
		// still survive, as below.
		//
		// **The NAME and the docId survive too** (changed by Task 211). They used to be wiped, which
		// was defensible when a project was a row in a list and indefensible now that it is a tab:
		// emptying the drawing would have left the tab you are looking at nameless, and a file project
		// would have quietly become a different document to the lock broker. Clearing the canvas is
		// not the same act as throwing the project away -- that is Close, and it asks first.
		scenarios = defaultScenarios();
		project = { name: project.name, docId: project.docId, activeScenario: 'base' };
		// The backdrop is deliberately NOT removed -- see the note above the function.
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
		} else if (!indexEntry(library.openId)) {
			// **`!indexEntry()`, not `!library.openId`** (fixed 2026-08-06): an id pointing at a
			// project that is no longer in the library is not an open project, and treating it as one
			// is how the page ended up with no tab at all. The question this branch is really asking
			// is "is there a project open?", and only the index can answer that.
			//
			// First visit, or nothing readable: the library always has exactly one open project, so
			// there is never a state where drawing has nowhere to be saved. Registered directly
			// rather than through newProject(), which repaints a UI that does not exist yet.
			var firstId = newProjectId(), firstName = nextProjectName();
			library.projects.push({ id: firstId, name: firstName, updated: Date.now() });
			library.openId = firstId;
			project.name = firstName; // the tab and the document have to agree from the first frame
			saveIndex();
		}
		wireLabelsPopup();
		// AFTER loadFromStorage() (so a saved default is never overwritten -- seedDefaultInputs()
		// fills nulls only) and BEFORE wireSettingsPopup() (which calls rebuildSettingsFields(),
		// where a still-null default would render as an empty box). Also necessarily after the
		// units strip is in the DOM, which is what the seeding exists to wait for.
		seedDefaultInputs();
		wireSettingsPopup();
		buildMenuBar();
		wireTabs();
		applyLegendPosition();
		applyMapHeight();
		// Node/vertex radii are already built at the right size (buildDom() reads symbolFactor()),
		// but the --lpn-sym custom property the stroke widths read is only ever written here and in
		// refreshSymbolSizes() -- so a saved non-default symbol size needs this call to take effect.
		refreshSymbolSizes();
		updateEmptyHint();
		updateModeHint(); // initial mode is 'select', set before setMode() ever runs -- render it now
		renderTabs();
		// **The banner has to be painted on the BOOT path too** (fixed 2026-08-05, found by Tom: "It
		// doesn't say anything. When? Where would it say this?"). refreshAllFromDocument() ends with
		// this call, but it is shared by openProject() and newProject() only -- boot never ran it. So
		// the one situation the needs-reopen banner exists for, a page load that dropped the file
		// handle, was the one situation in which it could not appear.
		// Order matters: reconnect first so the banner is painted against the truth, and take the
		// locks back last so a file we just reconnected is locked under the handle we actually have.
		restoreHandlesOnBoot().then(function () {
			syncReadOnlyToOpenProject();
			return reacquireLocksOnBoot();
		});
		// Independent of the above, and unordered against it: the File menu reads `recentFiles`
		// synchronously when it opens, so this only has to have finished before the user gets to the
		// menu -- which it will, being one small read. An empty list simply omits the section.
		loadRecentFiles();
		// Rotating a phone changes innerHeight, and with it the cap above -- without this, turning a
		// portrait phone to landscape leaves a canvas taller than the screen and re-creates exactly
		// the trap the cap exists to prevent. orientationchange as well as resize: some mobile
		// browsers fire only one of the two, and re-applying a height twice is free.
		window.addEventListener('resize', applyMapHeight);
		window.addEventListener('orientationchange', applyMapHeight);
		// **Nothing is flushed to a file on the way out any more** (Task 211). The locks ARE handed
		// back, so a colleague is never left waiting on a browser that has gone; `visibilitychange` ->
		// hidden is the one that actually fires on mobile, and `beforeunload` is the desktop net.
		// releaseLock() uses sendBeacon precisely because a fetch() started during unload may never
		// leave.
		// **A LOCK IS NOT RELEASED BECAUSE YOU LOOKED AWAY** (Tom, 2026-08-05: "If minimizing loses
		// the lock, then the lock is useless"). This listener used to release every lock on
		// `visibilitychange -> hidden`, which fires on an ordinary TAB SWITCH -- so a colleague who
		// glanced at their email came back holding nothing, silently. That was the intermittent
		// "B opened A's file with no dialog", and CC's first fix (release, then re-acquire on
		// `visible`) only narrowed the window instead of closing it.
		//
		// The AutoCAD model instead: the claim stands until you Close the file. What makes a
		// generous claim safe is NOT the lock's liveness but the freshness check in
		// writeOpenProjectToFile() -- a stale claim cannot cause an overwrite, so it is free to
		// outlive a minimise, a reload, or a reboot.
		// The browser's own "leave site?" prompt, and ONLY for a file project with unsaved changes.
		// A browser project is NOT a reason to prompt here: it lives in localStorage and survives the
		// browser closing perfectly well. It is only CLOSING ITS TAB that ends it, and closeTab() asks
		// that question itself, in words that fit it. Prompting on every page close for something that
		// is not at risk would teach people to click through the one prompt that matters.
		window.addEventListener('beforeunload', function (e) {
			releaseAllLocks();
			var unsaved = library.projects.some(function (p) { return isFileProject(p) && p.dirty; });
			if (!unsaved) { return; }
			e.preventDefault();
			e.returnValue = '';
			return '';
		});
		// The heartbeat, on its own fixed 60 s timer -- no longer anybody's setting. See
		// pollLockedFiles() for why that decoupling was the whole answer to Tom's "why must there be
		// limits at all?".
		setInterval(pollLockedFiles, LPN_HEARTBEAT_MS);
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
			// Prefix, so the pressed/unpressed word is still the thing being read.
			setLabel(btn, t.icon, pc[t.key] || t.mode);
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
		// The File/menu commands moved OUT of the toolbar and into the menu bar above it (Task 211).
		// What is left here is the high-use subset -- the drawing tools, Select/Delete/Undo, Zoom to
		// fit -- which is what a toolbar is for. "Clear project" is gone entirely; its replacement,
		// Edit -> Delete network, is a menu command because it is rare and destructive, and those two
		// properties together are the definition of something that does NOT belong on a toolbar.
		var fileGroup = group();
		// **"New project", not "Draw example network"** (Task 264, Tom 2026-08-10). The button is in
		// the same place and does the more general thing: it opens File > New project, whose first
		// row is Blank project and whose others are the examples. A toolbar button that could only
		// ever produce the example was the narrowest possible use of the most prominent slot, and it
		// read as "open a sample" to a user who wanted to start work.
		var newBtn = document.createElement('button');
		newBtn.type = 'button';
		setLabel(newBtn, 'new', pc.lpn_file_new || 'New project…');
		// stopPropagation for the same reason every menubar item does it (see buildMenuBar): without
		// it this click carries on to the document dismissal in wireTabs(), which sees a click
		// outside #lpn_menu_popup and closes the menu that was just opened.
		newBtn.addEventListener('click', function (e) { e.stopPropagation(); openNewProjectMenu(e.currentTarget); });
		newBtn.dataset.edits = '1';
		fileGroup.appendChild(newBtn);
		wireBackdropMenu(fileGroup);

		// `data-edits` is VESTIGIAL since Task 211 and nothing reads it. It marked the controls that
		// read-only used to disable -- back when read-only took editing away. It no longer does:
		// read-only now means only that you cannot save over somebody else's file, exactly as in Word,
		// and Save routes to Save As instead. The attributes are left in place because they are a
		// correct, maintained answer to "does this control change the network", which the next feature
		// that needs that question (a review mode, a locked scenario) can use without re-deriving it.
		var addGroup = group();
		addGroup.dataset.edits = '1';
		[
			{ mode: 'add-reservoir', key: 'lpn_tool_add_reservoir', icon: 'reservoir' },
			{ mode: 'add-pump', key: 'lpn_tool_add_pump', icon: 'pump' },
			{ mode: 'add-junction', key: 'lpn_tool_add_junction', icon: 'junction' },
			{ mode: 'add-pipe', key: 'lpn_tool_add_pipe', icon: 'pipe' },
			{ mode: 'add-text', key: 'lpn_tool_add_text', icon: 'text' }
		].forEach(function (t) { modeButton(t, addGroup); });

		var editGroup = group();
		editGroup.dataset.edits = '1';
		modeButton({ mode: 'select', key: 'lpn_tool_select', tip: pc.lpn_tip_select, icon: 'select' }, editGroup);
		modeButton({ mode: 'delete', key: 'lpn_tool_delete', icon: 'del' }, editGroup);
		var undoBtn = document.createElement('button');
		undoBtn.type = 'button';
		setLabel(undoBtn, 'undo', pc.lpn_tool_undo || 'Undo');
		undoBtn.addEventListener('click', undo);
		editGroup.appendChild(undoBtn);

		var viewGroup = group();
		var extentBtn = document.createElement('button');
		extentBtn.type = 'button';
		setLabel(extentBtn, 'zoom', pc.lpn_tool_zoom_extent || 'Zoom to fit');
		extentBtn.addEventListener('click', zoomExtent);
		viewGroup.appendChild(extentBtn);
		var labelsBtn = document.createElement('button');
		labelsBtn.type = 'button';
		setLabel(labelsBtn, 'labels', pc.lpn_tool_labels || 'Labels');
		if (pc.lpn_tip_labels_draggable) { labelsBtn.title = pc.lpn_tip_labels_draggable; labelsBtn.className = 'ec-help'; }
		labelsBtn.addEventListener('click', toggleLabelsPopup);
		viewGroup.appendChild(labelsBtn);
		var settingsBtn = document.createElement('button');
		settingsBtn.type = 'button';
		setLabel(settingsBtn, 'settings', pc.lpn_tool_settings || 'Settings');
		settingsBtn.addEventListener('click', toggleSettingsPopup);
		viewGroup.appendChild(settingsBtn);

		// The dev-only stress-test button moved OFF the toolbar and to the foot of the Insert menu
		// (Tom, 2026-08-04). A toolbar is the high-use subset of the menus, and a thing that reads
		// "[dev]" is by definition not that -- it was taking a permanent slot on the one strip where
		// space is scarcest. See openInsertMenu().
	}

	// A small RING MAIN: one reservoir, one pump (a link, per the header comment above), and a
	// closed loop of five junctions with varied demands and elevations. Exercises every element
	// type except Text, a fixed head, both link types, and vertex editing in one click. Confirms
	// before clobbering an existing network, and always leaves the toolbar back on Select --
	// otherwise whatever tool (e.g. Delete) was active before stays active after, which reads as
	// the example accidentally being deletable on the very next click.
	//
	// REWRITTEN 2026-08-09 (ROADMAP Task 254). What it replaced and why, so it is not walked back:
	//
	// TOPOLOGY. The old example was two parallel pipes between ONE pair of junctions. That is a
	// loop topologically and satisfies the solver, but it is not what a water system looks like,
	// and the calculator is named Looped Pipe Network. A five-junction ring fed at one point is
	// the smallest thing a practitioner recognises as a ring main, and it shows the one behaviour
	// the parallel pair cannot: flow leaves the tie-in BOTH ways round the ring and meets at a
	// hydraulic divide (here between J3 and J4, where the flow reverses and head loss crosses
	// zero). That divide is the whole reason looped networks need a solver at all.
	//
	// SCALE. The old example spanned 45 x 20 map units -- a plot, not a project. Tom, 2026-08-09:
	// a real network a user brings is "on the order of 1000 m (3000 ft)" across, and at that size
	// the default 2.5-unit text is invisible. So this sets BOTH the geometry and settings.textSize
	// together (see the comment on that line): they are one decision, not two, because what was
	// wrong was the RATIO between linework and lettering, not either one alone.
	//
	// UNITS AND PLACEMENT. ONE drawing serves both unit presets: the layout below is laid out once,
	// in map units, with no US/SI coordinate scaling. Only the real SI quantities (elevation,
	// demand, diameter, pump curve) go through niceDefault().
	//
	// **Map coordinates are NOT unitless -- they FOLLOW the Length/Map declaration** (Tom,
	// 2026-08-09, correcting his own earlier "map coordinates are unitless": *"The truth is that
	// they follow length and elevation."*). So this one drawing is a 1400 **ft** ring for a US
	// visitor and a 1400 **m** ring for a metric one -- the metric network is physically ~3.3x
	// larger, not the same system in other units. **That is accepted deliberately, not overlooked:**
	// both sizes are realistic systems, both solve to sensible pressures (checked in
	// dev/lpn-spike/example-network-harness.js), and with no backdrop registered there is nothing
	// on screen for the difference to contradict. Revisit if the example ever ships with a
	// background image, where a scale that means two different things would be visible and wrong.
	//
	// Anchored at 5000,5000 rather than at the origin (Tom, 2026-08-09: "center it or anchor it
	// around 5000,5000"), so the example lands in positive coordinates that look like a survey or
	// state-plane grid rather than like a sketch that starts at 0,0. Extent 1400 x 700, centre
	// exactly 5000,5000.
	function drawExampleNetwork() {
		if (doc.nodes.length > 0) {
			var pc = EngCalcs.pageConfig || {};
			if (!window.confirm(pc.lpn_confirm_example || 'This adds the example to the network you already have. Continue?')) { return; }
		}
		saveUndoSnapshot();
		// THIS FUNCTION DELIBERATELY DOES NOT TOUCH settings.textSize. It did, briefly, because
		// raising defaultSettings().textSize to 20 reaches only a first-time visitor -- a returning
		// one carries their stored value through loadFromStorage()'s
		// `Object.assign(defaultSettings(), savedSettings)`. Tom, 2026-08-09, chose the shipped
		// default as the whole answer: *"How about we circumvent the settings and doc issue by just
		// shipping with an initial default text size that works for our example network, namely 20?
		// ... Anything other is on the user, not us."* A visitor who has changed their text size has
		// expressed a preference, and an example is not a reason to overrule it. It also keeps
		// `settings` out of a function whose undo snapshot cannot restore it.
		// The reservoir sits at 50 ft / 15 m, in among the junctions it feeds (45-62 ft) rather
		// than perched above them (Tom, 2026-07-30). A source high above the network makes the
		// example a gravity system that would work with the pump deleted -- the pump's contribution
		// is invisible because the elevation is doing the work. Level with the network, the pump is
		// the only reason there is pressure anywhere, which is the point of including one. Its head
		// is left blank, so the water surface is the reservoir's own ground elevation.
		var r = addNode('reservoir', 4300, 5000);
		r.elev = niceDefault('lpn_u_elevhead', 'fth2o', 50, 15);
		// J1 is the tie-in: no demand of its own, it is where the pump discharges into the ring.
		var j1 = addNode('junction', 4500, 5000);
		j1.elev = niceDefault('lpn_u_elevhead', 'fth2o', 45, 14); j1._demand = 0;
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
		// The duty point is the ring's total demand (250 gpm / 15 L/s) at 140 ft / 42 m, chosen so
		// the network settles at 52-63 psi (365-422 kPa) -- distribution pressures a reviewer reads
		// as normal, rather than numbers that merely converge.
		var pump = addLink('pump', r.id, j1.id);
		pump.curvePoints = [
			[0, niceDefault('lpn_u_elevhead', 'fth2o', 165, 50)],
			[niceDefault('lpn_u_flow', 'gpm', 250, 0.015), niceDefault('lpn_u_elevhead', 'fth2o', 140, 42)],
			[niceDefault('lpn_u_flow', 'gpm', 500, 0.030), niceDefault('lpn_u_elevhead', 'fth2o', 60, 18)]
		];
		recomputePumpCurve(pump);
		// The ring. Demands and elevations both vary around it on purpose: equal demands at equal
		// elevations would put the hydraulic divide exactly opposite the tie-in and make the answer
		// look like symmetry rather than like a solve.
		var ring = [
			{ x: 4800, y: 4650, elev: [55, 17], demand: [60, 0.004] },
			{ x: 5400, y: 4700, elev: [62, 19], demand: [80, 0.005] },
			{ x: 5700, y: 5150, elev: [58, 18], demand: [50, 0.003] },
			{ x: 5000, y: 5350, elev: [52, 16], demand: [60, 0.003] }
		];
		// Bend vertices, by ring leg index. MORE THAN ONE, and on more than one pipe (Tom,
		// 2026-08-09: "it would be nice to have more than one vertex for demonstration") -- a single
		// vertex shows that pipes can bend but not that they are polylines. Leg 3 gets a two-vertex
		// dog-leg, the shape a main takes around an obstacle; leg 4 gets a single easy bend. The
		// other three stay straight, because a ring with a kink in every leg reads as sketchy
		// rather than as a plan.
		var bends = { 3: [{ x: 5550, y: 5300 }, { x: 5250, y: 5300 }], 4: [{ x: 4650, y: 5250 }] };
		// 6 in / 150 mm at C = 130 (ductile iron or PVC), not the 4 in / 0.1 m page default: a 6 in
		// ring at these demands runs well under the design velocity ceiling with a readable gradient
		// on every pipe, where the default diameter would read as a fire-flow-limited main and a
		// wider one would show head losses too small to see at two decimals.
		var dia = niceDefault('lpn_u_diameter', 'in', 6, 0.15), rough = 130;
		var nodes = [j1], i, n, pipe;
		for (i = 0; i < ring.length; i++) {
			n = addNode('junction', ring[i].x, ring[i].y);
			n.elev = niceDefault('lpn_u_elevhead', 'fth2o', ring[i].elev[0], ring[i].elev[1]);
			n._demand = niceDefault('lpn_u_flow', 'gpm', ring[i].demand[0], ring[i].demand[1]);
			nodes.push(n);
		}
		for (i = 0; i < nodes.length; i++) {
			pipe = addLink('pipe', nodes[i].id, nodes[(i + 1) % nodes.length].id);
			pipe._diameter = dia;
			pipe._roughness = rough;
			if (bends[i]) { bends[i].forEach(function (v) { pipe.verts.push({ x: v.x, y: v.y }); }); }
			// addLink() computed .length before those vertices existed (straight node-to-node
			// distance); rebuildLink() only rebuilds the DOM, not the length -- recompute
			// explicitly, or the initial displayed length undercounts the bend until the vertex is
			// next dragged (which goes through updateVertex()/updateLinkGeometry(), where lenAuto
			// recomputation already happens correctly). Tom caught this: 25 ft shown, jumped to
			// 28 ft only after a drag.
			pipe._length = linkGeomLength(pipe);
			rebuildLink(pipe);
		}
		// ---- a SECOND, SEPARATE system (Tom, 2026-08-09) ----
		// *"It still would be nice to demonstrate that separated systems are acceptable. A separate
		// simple reservoir, pipe, and demand isn't a bad demonstration."* Nothing else on the page
		// says this is allowed, and a user who assumes one drawing means one connected network will
		// never try it -- yet the solver handles disjoint components natively, needing only that
		// each has its own fixed head (lpnDiagnose's `unreachable` check is per component).
		//
		// It is a GRAVITY system, and that is the contrast worth drawing: a tank uphill at 200 ft /
		// 60 m feeding one demand, with no pump anywhere in it. Beside a ring main that only has
		// pressure because a pump gives it some, the two together say more than either alone.
		// (This does not undo the 2026-07-30 decision to keep the RING's reservoir level with its
		// network -- that exists so the ring's pump is visibly load-bearing, and it still is.)
		//
		// Its elevations are chosen so it stays ABOVE the ring's minimum pressure, deliberately: the
		// "Lowest pressure" callout below is pinned to a ring junction, and a separate system that
		// quietly stole the network minimum would make that callout a lie. The harness asserts it.
		//
		// DRAWN INSIDE THE RING, not below it (Tom, 2026-08-09: *"Drawing the separate system
		// outside our main loop effectively changes the scale of the project too much. We must draw
		// the separate system inside our main loop so that our text doesn't look too small."*). The
		// ring's interior is empty space the fit is already paying for, so a system placed there is
		// free; the same system slung underneath added ~350 units of height and shrank everything at
		// zoom-to-fit. Placed low-centre and kept clear of J1's multi-line data label, which grows
		// down and to the right into the interior from the tie-in at 4500,5000.
		var r2 = addNode('reservoir', 4900, 5080);
		r2.elev = niceDefault('lpn_u_elevhead', 'fth2o', 200, 60);
		var j6 = addNode('junction', 5320, 5080);
		j6.elev = niceDefault('lpn_u_elevhead', 'fth2o', 60, 18);
		j6._demand = niceDefault('lpn_u_flow', 'gpm', 100, 0.006);
		var sep = addLink('pipe', r2.id, j6.id);
		sep._diameter = dia;
		sep._roughness = rough;
		sep._length = linkGeomLength(sep);
		rebuildLink(sep);

		// ---- annotations (Tom, 2026-08-09) ----
		// A title block and two callouts, so the demonstration also demonstrates the Text element
		// itself and its per-label size multiplier -- the fifth element type, otherwise unused here.
		//
		// EVERY STRING IS ONE THAT ALREADY EXISTS AND IS ALREADY TRANSLATED, which was Tom's own
		// constraint ("to minimize translation load, we can compose it from existing lang strings").
		// `menu_brand` is suite chrome, so it is translated in all 26 languages; `lpn_main_menu` and
		// `lpn_tool_add_reservoir` are this page's own; `bpn_p_min` ("Lowest pressure") belongs to
		// the sibling branched-network calculator and is translated wherever lpn_ is. Net cost: zero
		// new keys.
		//
		// WHOLE LABELS ONLY -- never a clause cut out of a longer string. Tom asked for a callout
		// carrying "Double-click a pipe to add or remove a vertex", and that text exists ONLY as the
		// third sentence of `lpn_mode_select`. Splicing it out is exactly the fragment composition
		// CLAUDE.md bans (it breaks in gendered, word-order and RTL languages), so it is NOT done
		// here; it would need a key of its own. Same reason there is no velocity callout: there is
		// no "Highest velocity" string to borrow, only the bare word "Velocity".
		var pcx = EngCalcs.pageConfig || {};
		// side: 'left' | 'right', for an ANCHORED annotation only -- which side of its node the
		// whole label sits on. It is not a nicety.
		//
		// A Text label is `text-anchor: middle`, so lb.x/lb.y put its CENTRE at that offset from the
		// node, and updateLabelGeometry() runs the leader to the label's near EDGE (px ± halfW).
		// Offset the centre by less than half the text width and that near edge lands INSIDE the
		// text: the leader is then a short stub poking out from under the middle of the words, on
		// whichever side the flip rule happened to pick. That is what the first cut did (offsets of
		// 0 and 40 against labels a few hundred units wide) and Tom's verdict was exact -- "centered
		// over their anchor so that their leaders look worst of all possible positions... A centered
		// text looks better unanchored."
		//
		// So the offset is MEASURED, not guessed: render the text, read its real width, then push
		// the centre out by half that width plus a gap that clears the node symbol. The existing
		// left/right flip in updateLabelGeometry() then resolves the side by itself from the sign.
		function annotate(x, y, anchorNode, text, sizeMult, side) {
			if (!text) { return null; }   // key missing from pageConfig: draw nothing, never "Text"
			var lb = addText(x, y, anchorNode);
			lb.text = text;
			lb.sizeMult = sizeMult;
			// Same two steps the text/size fields in renderLabelFields() take after an edit: push the
			// new content into the existing element and re-measure, rather than rebuilding it (a
			// second buildLabelEls() would leave the first element orphaned in the DOM).
			var le = labelEls[lb.id];
			le.text.textContent = lb.text;
			le.text.style.fontSize = effectiveFontSize(lb.sizeMult) + 'px';
			try { le.width = le.text.getBBox().width; } catch (err) { /* pre-layout measure can throw; stale width stands */ }
			if (anchorNode && side) {
				var an = nodeById(anchorNode),
					gap = nodeRadius(an) + effectiveFontSize(sizeMult) * 0.5;
				lb.x = (side === 'left' ? -1 : 1) * (le.width / 2 + gap);
				// And the RISE that makes the leader slope. The leader is drawn from the node to the
				// label's near edge, which sits exactly `gap` away horizontally -- the text width
				// cancels out -- so the leader vector is (gap, lb.y) and its angle is set entirely
				// by this line. Tom, 2026-08-09: "Leaders don't look great horizontal. Ideal angle
				// is 60 degrees like you make the 'lowest pressure' text."
				// A FIXED dy would NOT hold the angle across the two callouts: nodeRadius() is
				// JUNCTION_R for a junction but half the tank's longer side for a reservoir, so the
				// same rise over a different gap is a different slope. Deriving from the angle is
				// what makes them match.
				lb.y = -Math.tan(LPN_CALLOUT_ANGLE * Math.PI / 180) * gap;
			}
			updateLabelGeometry(lb.id);
			return lb;
		}
		// Title block, centred on the drawing and just above it (labels are centred on their x, and
		// -y is up). Two lines at different sizes rather than one, so the size multiplier is visibly
		// doing something a reader can then go and change.
		//
		// TUCKED CLOSE TO THE RING ON PURPOSE. bbox() -- and therefore zoom-to-fit -- includes the
		// title, so every unit of white space between it and the drawing is a unit the fit has to
		// shrink everything else to accommodate. Tom, 2026-08-09, asked for the two lines 120 and 60
		// units further south for exactly that reason.
		// The SECOND line anchors the block and the FIRST is DERIVED from it, stacked by their own
		// half-heights plus a gap -- not moved by a flat amount. Tom asked for 120 and 60; 60 landed
		// the second line at 4620, but a flat 120 would have OVERLAPPED the two by 5 units, because
		// they are 40 and 30 units tall at the default text size. Deriving also keeps the block
		// tight if the visitor's text size is not the default.
		// Then back up 20 (4620 -> 4600): Tom, 2026-08-09, "I pushed too hard. Can you move them
		// both up or move J2 down about 20?" -- and moving the TITLE is the right half of that
		// choice. J2 is a ring vertex, and the ring's 1400 x 700 extent centred exactly on 5000,5000
		// is a property worth more than 20 units of clearance; dropping J2 would make it 1400 x 680
		// off-centre. The title block has no such constraint. Clearance from the second line's
		// bottom edge to the ring top is now ~35 units.
		var titleY = 4600;
		annotate(5000, titleY - (effectiveFontSize(2) + effectiveFontSize(1.5)) / 2 - 8, null, pcx.menu_brand, 2);
		annotate(5000, titleY, null, pcx.lpn_main_menu, 1.5);
		// Anchored callouts: the offset is from the node, and the label follows if the node moves.
		// The reservoir is the drawing's far-left node and its own data label sits to the upper
		// right, so its callout goes LEFT -- and UP, at the shared leader angle. It was level with
		// the node in the first cut, which put the leader dead horizontal; Tom, 2026-08-09:
		// "Leaders don't look great horizontal."
		// The x and y passed here are only seeds -- annotate() derives both offsets from the
		// measured text width and LPN_CALLOUT_ANGLE.
		annotate(r.x, r.y, r.id, pcx.lpn_tool_add_reservoir, 1.5, 'left');
		// "Lowest pressure" goes on nodes[2] -- the third ring junction -- which is the minimum in
		// BOTH unit sets. Hard-coded rather than computed, because the solve is 300 ms away on the
		// debounce and there are no pressures to compare yet at this point in the draw. That is only
		// safe because example-network-harness.js asserts it: if a future tweak to demands or
		// elevations moves the minimum elsewhere, the harness fails rather than the map lying.
		//
		// NOTE THE MINIMUM IS NOT THE ONE THE EXTREMA TICK MARKS. Tom found this and decided against
		// fixing it, 2026-08-09: the reservoir is at zero gauge pressure and is almost always the
		// network low, so it wins the "low" tick and no junction is marked. The fix would be a rule
		// and a checkbox ("ignore reservoirs during pressure extrema") or a silent special case, and
		// he judged both worse than the wart. This callout is the cheap way to point at the number
		// that actually matters.
		// RIGHT and above: J3 is the drawing's top-right node, and its own multi-line data label
		// grows downward from the upper right, so a callout level with it would collide. Tom
		// approved how this one looks; LPN_CALLOUT_ANGLE is set to reproduce it, and the reservoir
		// callout above now matches it rather than the other way round.
		annotate(nodes[2].x, nodes[2].y, nodes[2].id, pcx.bpn_p_min, 1.5, 'right');
		updateEmptyHint();
		saveToStorage();
		zoomExtent();
		// ...and again once the labels exist. zoomExtent() measures the RENDERED label text, and at
		// this instant there is none: the solve is 300 ms behind on the debounce, so every node's
		// data label is still a placeholder width. Fitting now is right for immediate feedback but
		// leaves labels hanging outside the map a third of a second later, which is the second half
		// of Task 254 ("it is not zoomed to fit after drawing. Some labels extend beyond the map").
		fitAfterSolve = true;
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
		fitAfterSolve = true; // labels are still placeholders at this instant -- see consumeFitAfterSolve()
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
	// The seven selectors this page owns, in one list, so reading and restoring a project's units
	// cannot drift out of step with each other or with Looped-Network.php's units strip.
	var LPN_UNIT_SELECTS = ['lpn_u_length', 'lpn_u_elevhead', 'lpn_u_pressure', 'lpn_u_diameter',
		'lpn_u_flow', 'lpn_u_velocity', 'lpn_u_gradient'];
	// {selectName: unitKey}, e.g. {lpn_u_diameter: 'in'}. Stored by KEY, never by factor: a factor is
	// a number whose meaning depends on a table that may be re-derived, while 'in' will mean inches
	// forever. Same reason the option carries data-unit at all.
	function readUnitSelections() {
		var out = {};
		LPN_UNIT_SELECTS.forEach(function (name) {
			var k = unitKey(name);
			if (k) { out[name] = k; }
		});
		return out;
	}
	// Restores a project's own units WITHOUT going through EngCalcs.setUnits(): that helper calls
	// submitForm(), which re-enters pageCalculator, which is exactly the code path that is calling
	// this. The selects are set directly and the caller re-renders once, in its own order.
	// A unit this browser does not offer (a family that changed) is skipped rather than forced --
	// leaving the current selection is a wrong unit; setting a missing one is a broken select.
	function applyUnitSelections(units) {
		if (!units) { return false; }
		var changed = false;
		LPN_UNIT_SELECTS.forEach(function (name) {
			var want = units[name], sel = unitEl(name), i;
			if (!want || !sel || !sel.options) { return; }
			// Walked as `options` + `selectedIndex` rather than a querySelector on [data-unit],
			// matching unitKey() two functions up. That is the idiom the rest of this file already
			// reads a select with, and it is the one a harness can stub -- an attribute selector on
			// a live <option> works only against a real DOM, so the check that this function does
			// its job at all could not have been written.
			for (i = 0; i < sel.options.length; i++) {
				if (sel.options[i].dataset && sel.options[i].dataset.unit === want) {
					if (sel.selectedIndex !== i) { sel.selectedIndex = i; changed = true; }
					return;
				}
			}
		});
		return changed;
	}
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
		// DECLARATIVE since Task 263: what comes back is in the unit the strip is SHOWING.
		//
		// The two arguments are therefore asymmetric, and the asymmetry is in the existing call
		// sites, not invented here. `usVal` is already a nice number IN usKey ("6" inches), so it is
		// returned untouched. `siVal` is a nice number in the SI BASE unit (0.15 m, 0.015 m³/s) --
		// which is not what the SI preset displays: it shows mm and l/s. So the SI branch scales to
		// the selected unit and 0.15 m becomes 150 mm, 0.015 m³/s becomes 15 l/s.
		//
		// Getting this wrong is silent and enormous: without the factor a 150 mm main is stored as
		// 0.15 mm and the solve returns pressures around -1.3e10 kPa. That is exactly what the
		// example-network harness caught the moment storage went declarative, which is the reason
		// that harness exists.
		return unitKey(unitId) === usKey ? usVal : siVal * unitFactor(unitId);
	}

	// ---- THE UNIT BOUNDARY (ROADMAP Task 263, Tom 2026-08-10) ----
	//
	// **Inputs are stored in the unit they were typed in, and NOTHING converts them.** Switching a
	// unit select reinterprets the number (8 in becomes 8 mm), exactly as every other calculator in
	// this suite behaves and exactly as EPANET behaves. The previous design stored SI and displayed
	// the conversion, so a unit switch silently rewrote every number on the map; Tom banned it:
	// *"a bad design decision was made without my knowledge to convert inputs when units are
	// switched. Scrub and ban this."*
	//
	// Conversion therefore happens in exactly TWO places and nowhere else:
	//   1. HERE, at the solver handoff (assembleModel, recomputePumpCurve) -- declared value to SI.
	//   2. On the way BACK, for solve RESULTS only (readonlyUnitField, numLine) -- SI to display.
	// A number that is an input never passes through either on its way to the screen. If you find
	// yourself adding a third conversion site, you are re-creating the banned behaviour.
	//
	// **The project stores its own units** (see serializeProject/applyUnitSelections). It has to:
	// declarative storage means a 400 written by a millimetre user is the number 400, and opening
	// that file in an inch browser without restoring its units would read it as a 400 INCH pipe.
	// Tom, 2026-08-10: *"it would be another disaster for projects not to be stored with their
	// units."*
	function toSI(value, unitId) {
		return (typeof value === 'number') ? value / unitFactor(unitId) : value;
	}
	function toDisplay(siValue, unitId) {
		return (typeof siValue === 'number') ? siValue * unitFactor(unitId) : siValue;
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
		// The units block is server-rendered ONCE (echoUnitSelect keeps each select's unit family and
		// option values) and MOVED in and out of this panel, never rebuilt. Park it back in its holder
		// before clearFields() runs, or the clear would destroy the only copy that exists.
		var unitsBlock = document.getElementById('lpn_units_block'),
			unitsHolder = document.getElementById('lpn_units_holder');
		if (unitsBlock && unitsHolder && unitsBlock.parentNode !== unitsHolder) { unitsHolder.appendChild(unitsBlock); }
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
		// `+v` FIRST, and it is load-bearing: defaultSettings() leaves settings.defaults full of
		// nulls until seedDefaultInputs() fills them, and any path that rebuilds this panel before
		// that has run hands a null in here. The pre-Task-263 code multiplied by a unit factor on the
		// way in, so `null * f` coerced to 0 and the null never surfaced; dropping the factor dropped
		// the accidental coercion with it and this threw. Coerce on purpose now, rather than rely on
		// arithmetic that is no longer there. (Caught by popup-tips-harness.js, which calls
		// rebuildSettingsFields() directly -- exactly the unseeded path.)
		function trimNum(v) { return String(+(+v).toFixed(6)); }
		// Unit-bearing rows show and accept the value AS DECLARED, the same convention
		// unitNumberField() uses in the element popup (Task 263) -- no factor either way. NO
		// scheduleSolve(): changing a default alters nothing that already exists.
		// EngCalcs.pageCalculator re-runs this whole rebuild on a unit switch, so the unit named in
		// the label is always the one the number is in. A default therefore REINTERPRETS along with
		// everything else -- a default diameter of 8 becomes 8 mm -- which is the point of the ban.
		// unitId null means dimensionless (roughness, K) -- no unit in the label.
		function defaultRow(target, labelText, unitId, key, isValid) {
			var input = document.createElement('input');
			input.type = 'number'; input.step = 'any';
			input.value = trimNum(settings.defaults[key]);
			input.addEventListener('change', function () {
				var v = +input.value;
				if (input.value !== '' && isFinite(v) && isValid(v)) { settings.defaults[key] = v; saveToStorage(); }
				else { input.value = trimNum(settings.defaults[key]); }
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
		// The "Saving to a file" section is GONE (Task 211). It held exactly one control -- how often
		// the open project was written back to its file -- and nothing is written to a file on a timer
		// any more, so there is no interval to set. Tom asked why the 60-180 s range existed at all;
		// the honest answer was that one number was doing three jobs (write interval, lock heartbeat,
		// and the how-long-before-a-colleague-may-take-over threshold), so the range was protecting a
		// coupling rather than the user. Splitting those apart removed the setting instead of widening
		// it, which is the better answer to the question he actually asked.
		// ---- units (Task 241, Tom 2026-08-08) ----
		// Last section before the panel's foot, because a unit system is set once and then left
		// alone -- it belongs with the settings, but not above the ones people actually revisit.
		if (unitsBlock) {
			var unitsBody = section('units', pc.lpn_view_units || 'Units');
			// The "[Hide this line]" collapse link is a leftover from when this row was permanent
			// page furniture. Inside a collapsible section with its own toggle it is a second, worse
			// control for the same job, so it goes.
			var hideLink = unitsBlock.querySelector('a[data-bs-toggle="collapse"]');
			if (hideLink) { hideLink.parentNode.removeChild(hideLink); }
			unitsBody.appendChild(unitsBlock);
		}
		// ---- computation (Tom, 2026-08-10) ----
		// Tolerance and the EPANET engine toggle sat loose in the headingless tail, which was right
		// while tolerance was the ONE genuine solver setting and a heading over a single row would
		// have been ceremony. With two of them the tail had become an unnamed group of settings
		// sitting among the panel's ACTIONS (Restore defaults, Clear calculator), and that is a
		// different thing: a reader could not tell where the settings stopped. So they get the
		// section every other group here has, and the tail goes back to holding only buttons.
		//
		// "Computation", not "Solver": the two rows are how the answer is computed and how close is
		// close enough -- and "solver" is jargon for the internals, while what the user is choosing
		// is the arithmetic they get.
		var compBody = section('computation', pc.lpn_settings_computation || 'Computation');
		// The panel's foot: ACTIONS only, no settings. Headingless on purpose -- a heading over
		// buttons that cannot collapse would behave unlike every other heading in this panel.
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
		row(compBody, pc.lpn_settings_tolerance || 'Convergence tolerance', tolInput, pc.lpn_settings_tolerance_tip);
		// ---- engine choice (ROADMAP Task 243) ----
		// A checkbox rather than a two-option select: there is a plain default and one opt-in,
		// and a select would imply the two are peers when the native path is the one this page
		// is built around.
		var engInput = document.createElement('input');
		engInput.type = 'checkbox';
		engInput.checked = (settings.engine === 'epanet');
		engInput.addEventListener('change', function () {
			settings.engine = engInput.checked ? 'epanet' : 'native';
			scheduleSolve();
		});
		row(compBody, pc.lpn_settings_engine_epanet || 'Solve with the EPANET engine', engInput, pc.lpn_settings_engine_epanet_tip);
		// ---- restore defaults (Tom, 2026-07-30) ----
		// Resets settings/labelSettings only -- the network (nodes/links/labels) and backdrop are
		// untouched, same "preferences vs. content" split clearNetwork()'s own comment documents.
		var restoreBtn = document.createElement('button');
		restoreBtn.type = 'button';
		restoreBtn.textContent = pc.calc_defaults || 'Restore defaults';
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
		// The second of this command's two render sites; the menu row is the other. Both wear the
		// warning triangle, because it is the same dangerous command either way.
		setLabel(wipeBtn, 'wipe', pc.lpn_settings_wipe_btn || 'Clear calculator');
		helpTip(wipeBtn, pc.lpn_reset_all_tip);
		wipeBtn.addEventListener('click', wipeEverything);
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
		// REBUILD ON EVERY OPEN. The panel used to be built once, by wireSettingsPopup() at init,
		// and then only rebuilt by the paths that happened to remember (Restore defaults, opening a
		// project). Anything else that wrote to `settings` left the panel showing the value from
		// page load -- Tom, 2026-08-09, found the example network drawing 20-unit text while the
		// Text size box still read 2.5, and said correctly that this condition "should be
		// impossible". It was possible for every setting, not just that one; a writer had to
		// remember to repaint, and one did not. Rebuilding here makes the panel a VIEW of
		// `settings` rather than a copy of it, so no future writer can desync it either. Cheap:
		// this is ~30 form controls, built only when the user actually opens the panel.
		rebuildSettingsFields();
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
	// get/set are DECLARED values, not SI (Task 263) -- what the user typed, in the unit the label
	// names. No factor in either direction; the solver does the converting at its own boundary.
	function unitNumberField(fields, labelText, unitId, get, set, tip) {
		var label = document.createElement('label'), input = document.createElement('input'), v0 = get();
		input.type = 'number';
		// Printed with trailing zeros stripped rather than a fixed toFixed(4). Under SI storage the
		// value was the result of a division and 4 places was a reasonable guess at it; now it is the
		// number the user typed, and showing "8" back as "8.0000" makes their own input look computed.
		input.value = (typeof v0 === 'number') ? String(+v0.toFixed(6)) : '';
		// scheduleSolve() here, not just inside set callbacks, centralizes it for every current
		// and future use of this helper (elev/demand/head's set already also calls updateNode(),
		// which itself schedules a solve -- calling it twice is harmless, debounced).
		input.addEventListener('change', function () { set(+input.value); scheduleSolve(); });
		setFieldLabel(label, labelText + ' (' + unitLabel(unitId) + ')', tip);
		label.appendChild(input);
		fields.appendChild(label);
		fields.appendChild(document.createElement('br'));
	}
	// Same as unitNumberField(), but the value may be BLANK, meaning "follow whatever this field
	// defaults to" -- currently a reservoir's head following its elevation (Tom, 2026-07-30).
	// placeholderSI is that fallback, shown greyed in the empty box so the field never looks like it
	// is missing a number; clearing the box stores undefined, which is what re-links the two.
	function unitNumberFieldBlank(fields, labelText, unitId, get, set, placeholder, tip) {
		var label = document.createElement('label'), input = document.createElement('input'),
			v = get();
		input.type = 'number';
		input.value = (v === undefined || v === null || v === '') ? '' : String(+(+v).toFixed(6));
		input.placeholder = String(+(+placeholder).toFixed(6));
		input.addEventListener('change', function () {
			set(input.value === '' ? undefined : +input.value);
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
			// The one place two DISPLAY units meet: head and elevation are declared in the Elevation/
			// Head unit, their difference is a pressure, and the Pressure selector may be showing
			// something else entirely (psi against ft of water). So it crosses to SI and back. This
			// is a conversion between two units the user chose, not a conversion of an input on a
			// unit change -- the number they typed is untouched.
			readonlyUnitField(fields, pc.lpn_result_pressure || 'Pressure', 'lpn_u_pressure',
				toSI(reservoirHead(n) - (n.elev || 0), 'lpn_u_elevhead'));
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
		// No factors here since Task 263: a curve point is stored in the units its column heading
		// names, so the table shows and accepts the number as typed.
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
				qInput.value = pt[0] !== undefined ? String(+pt[0].toFixed(6)) : '';
				hInput.type = 'number'; hInput.step = 'any'; hInput.size = 6;
				hInput.value = pt[1] !== undefined ? String(+pt[1].toFixed(6)) : '';
				function commit() {
					var qv = qInput.value === '' ? undefined : +qInput.value,
						hv = hInput.value === '' ? undefined : +hInput.value;
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
			// length to spread its head over. linkLengthSI(), not the declared length: see Task 255.
			if (l.type !== 'pump' && linkLengthSI(l)) {
				readonlyUnitField(fields, pc.lpn_result_gradient || 'Head loss gradient', 'lpn_u_gradient',
					lastSolveResult.headlosses[linkId] / linkLengthSI(l), pc.lpn_result_gradient_tip);
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
		markEdited(); // one seam, because every real mutation snapshots before it changes anything
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
	// A link's length in METRES, which is the only thing js/lpn-solver.js and js/lpn-epanet.js will
	// accept ("EVERYTHING HERE IS SI: Q in m3/s, H and lengths in m. Callers convert at the edges").
	// THIS FUNCTION IS THAT EDGE, and it did not exist until 2026-08-09 (ROADMAP Task 255).
	//
	// THE BUG IT FIXES. Length is DECLARATIVE: one map unit IS one foot or one metre by declaration,
	// with no conversion anywhere in the document, the popup or the labels -- a deliberate design
	// (see the lengthField() and units comments) and still the right one. But assembleModel() then
	// handed that declared number straight to an SI solver. With the Length/Map selector on `ft`, a
	// pipe the user drew and labelled 1000 ft was solved as 1000 METRES, while its elevation, head,
	// demand and diameter around it all WERE converted. Head loss came out 3.281x too high -- and
	// 3.281 is exactly 1 ft/m, which is the fingerprint. Measured before the fix: 1000 ft of 6 in at
	// C = 130 carrying 132 gpm reported 5.73 ft of loss where this suite's own Hazen-Williams says
	// 1.74 ft. SI users were never affected, because there the factor is 1.
	//
	// WHY NOTHING CAUGHT IT. dev/lpn-spike/validate.js and validate_epanet.js both feed the SOLVER
	// directly, in SI, so they never crossed this boundary; and the EPANET path reads the same
	// model, so both engines were wrong together and agreed with each other perfectly. Any future
	// check of this has to compare against a hand-computed US case, never against the other engine.
	//
	// Do NOT "fix" a future variant of this by making the map metric or by converting the stored
	// length. The stored number stays declarative; only the handoff converts.
	function linkLengthSI(l) {
		return effective(l, 'length') / unitFactor('lpn_u_length');
	}
	var lastSolveResult = null;
	function assembleModel() {
		var nodes = doc.nodes.map(function (n) {
			return n.type === 'reservoir'
				// Reservoirs pass a resolved head: the solver wants a real number, but the document
				// deliberately stores that field blank when the head just follows the elevation (see
				// reservoirHead()). Copying rather than filling the blank in keeps the document's
				// "still following elevation" state intact.
				? { id: n.id, type: n.type, elev: toSI(n.elev || 0, 'lpn_u_elevhead'), head: toSI(reservoirHead(n), 'lpn_u_elevhead') }
				: { id: n.id, type: n.type, elev: toSI(n.elev || 0, 'lpn_u_elevhead'), demand: toSI(effective(n, 'demand') || 0, 'lpn_u_flow'), emitter: effective(n, 'emitter') };
		});
		var links = doc.links.map(function (l) {
			return {
				id: l.id, type: l.type, from: l.from, to: l.to,
				// roughness (Hazen-Williams C) and k are dimensionless, so they cross this boundary
				// unchanged -- the same reason they use rawLine() rather than numLine() on the map.
				diameter: toSI(effective(l, 'diameter') || 0, 'lpn_u_diameter'), roughness: effective(l, 'roughness'),
				length: linkLengthSI(l), status: effective(l, 'status'), k: effective(l, 'k'),
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
	// Rule: a real (non-empty) status TEMPORARILY OUTRANKS a notice -- a live diagnostic like "Add a
	// reservoir" is shown in preference to a report of a completed action, but the notice is not
	// thrown away to make room for it. An EMPTY status falls back to the notice, so as soon as the
	// diagnostic clears (or its own timer expires), the notice reappears rather than having been
	// silently eaten (punch list §4, Tom 2026-08-06: closing a tab's "Closed X. Now showing Y." was
	// overwritten and gone for good the instant the freshly-opened project's own solve produced a
	// diagnostic). A timer expires the notice either way, so the bar does not keep narrating an
	// action from a minute ago once it does resurface.
	var statusNotice = '', statusNoticeTimer = null;
	var STATUS_NOTICE_MS = 8000;
	function clearNotice() {
		statusNotice = '';
		if (statusNoticeTimer) { clearTimeout(statusNoticeTimer); statusNoticeTimer = null; }
	}
	function setStatus(text) {
		var el = document.getElementById('lpn_status');
		if (!el) { return; }
		if (text) { el.textContent = text; return; }
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
			// INPUTS use plainRound() -- they are already in the displayed unit (Task 263), the same
			// treatment length/roughness/km have always had. Only solve RESULTS still come out of the
			// solver in SI and go through displayRound().
			elev: fieldExtrema(doc.nodes.map(function (n) { return plainRound(n.elev, nd.elev); })),
			demand: fieldExtrema(doc.nodes.map(function (n) { return n.type !== 'reservoir' ? plainRound(effective(n, 'demand'), nd.demand) : undefined; })),
			head: fieldExtrema(doc.nodes.map(function (n) {
				// Head is an INPUT on a reservoir and a RESULT on a junction, so the two halves of
				// this one field cross the boundary differently. Both end up in Elevation/Head units,
				// which is what makes them comparable for the extrema tick.
				if (n.type === 'reservoir') { return plainRound(reservoirHead(n), nd.head); }
				return lastSolveResult ? displayRound(lastSolveResult.heads[n.id], 'lpn_u_elevhead', nd.head) : undefined;
			})),
			pressure: fieldExtrema(doc.nodes.map(function (n) {
				if (n.type === 'reservoir') { return displayRound(toSI(reservoirHead(n) - (n.elev || 0), 'lpn_u_elevhead'), 'lpn_u_pressure', nd.pressure); }
				return lastSolveResult ? displayRound(lastSolveResult.pressures[n.id], 'lpn_u_pressure', nd.pressure) : undefined;
			})),
			diameter: fieldExtrema(doc.links.map(function (l) { return l.type !== 'pump' ? plainRound(effective(l, 'diameter'), ld.diameter) : undefined; })),
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
			// linkLengthSI(), NOT effective(l,'length'). A gradient is dimensionless, so BOTH sides
			// of the division must be in the same system, and the numerator is a solver head loss
			// in metres. This line used to divide by the DECLARED length and carried a comment
			// asserting that number "is already the real SI length the solver itself used" -- that
			// belief was the Task 255 bug (see linkLengthSI()), and it made the gradient wrong by
			// the same 3.281x in US units, on top of the head loss already being wrong.
			// Pump-excluded, same as headloss.
			gradient: fieldExtrema(doc.links.map(function (l) {
				var len = linkLengthSI(l);
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
			if (n.type !== 'reservoir' && ls.node.demand) { lines.push(rawLine(effective(n, 'demand'), extrema.demand, fc.demand, nd.demand)); }
			// Both are already IN Elevation/Head and Pressure units by the time they get here -- the
			// reservoir branch because those are declared inputs, the junction branch because the
			// solve result is converted on the spot. rawLine() then prints what it is given, so the
			// two halves of each field agree with the extrema computed above.
			var headVal = n.type === 'reservoir'
				? reservoirHead(n)
				: (lastSolveResult ? toDisplay(lastSolveResult.heads[n.id], 'lpn_u_elevhead') : undefined);
			var pressVal = n.type === 'reservoir'
				? toDisplay(toSI(reservoirHead(n) - (n.elev || 0), 'lpn_u_elevhead'), 'lpn_u_pressure')
				: (lastSolveResult ? toDisplay(lastSolveResult.pressures[n.id], 'lpn_u_pressure') : undefined);
			if (ls.node.head && headVal !== undefined) { lines.push(rawLine(headVal, extrema.head, fc.head, nd.head)); }
			if (ls.node.pressure && pressVal !== undefined) { lines.push(rawLine(pressVal, extrema.pressure, fc.pressure, nd.pressure)); }
			if (ls.node.elev) { lines.push(rawLine(n.elev, extrema.elev, fc.elev, nd.elev)); }
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
				if (ls.link.diameter) { lines.push(rawLine(effective(l, 'diameter'), extrema.diameter, fc.diameter, ld.diameter)); }
				if (ls.link.length) { lines.push(rawLine(effective(l, 'length'), extrema.length, fc.length, ld.length)); }
				if (ls.link.roughness) { lines.push(rawLine(effective(l, 'roughness'), extrema.roughness, fc.roughness, ld.roughness)); }
				if (ls.link.km) { lines.push(rawLine(effective(l, 'k') || 0, extrema.km, fc.km, ld.km)); }
			}
			if (lastSolveResult && lastSolveResult.flows[l.id] !== undefined) {
				if (ls.link.flow) { lines.push(numLine(lastSolveResult.flows[l.id], 'lpn_u_flow', extrema.flow, fc.flow, ld.flow)); }
				// Velocity is meaningless for a pump (no diameter -- see renderLinkFields() above).
				if (ls.link.velocity && l.type !== 'pump') { lines.push(numLine(lastSolveResult.velocities[l.id], 'lpn_u_velocity', extrema.velocity, fc.velocity, ld.velocity)); }
				if (ls.link.headloss) { lines.push(numLine(lastSolveResult.headlosses[l.id], 'lpn_u_elevhead', extrema.headloss, fc.headloss, ld.headloss)); }
				if (ls.link.gradient && l.type !== 'pump' && linkLengthSI(l)) { lines.push(numLine(lastSolveResult.headlosses[l.id] / linkLengthSI(l), 'lpn_u_gradient', extrema.gradient, fc.gradient, ld.gradient)); }
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
		// Usage logging, added 2026-08-03. Until now this page logged ZERO real usage: every other
		// calculator reaches maybeLogCalcUsage() through calcAndSave() <- submitForm(), and on this
		// page submitForm() fires ONLY from the seven unit dropdowns' hardcoded
		// onchange="EngCalcs.submitForm()" and the US/SI preset buttons. Drawing a network and
		// solving it goes scheduleSolve() -> runSolve() and never touches that path -- so the
		// "used" column counted unit-strip changes, not networks solved, and was not measuring the
		// same event as the other fifteen rows on the report.
		// Placed here, after the non-empty check and BEFORE the diagnostics, on purpose: the other
		// calculators log on interaction that triggers a recalculation, whether or not the result is
		// usable, so the comparable event here is "the user has drawn something and we attempted to
		// compute it" -- not "it converged". maybeLogCalcUsage() carries its own 10s-after-load gate
		// and per-page-load dedupe, so the initial load solve and the every-keystroke debounce do
		// not inflate it.
		if (EngCalcs.maybeLogCalcUsage) { EngCalcs.maybeLogCalcUsage(); }
		var model = assembleModel(), issues = EngCalcs.lpnDiagnose(model);
		if (issues.length > 0) {
			lastSolveResult = null;
			setStatus(issues.map(diagIssueText).join(' '));
			refreshLabelText();
			consumeFitAfterSolve();
			return;
		}
		if (settings.engine === 'epanet' && EngCalcs.lpnSolveEpanet) {
			runSolveEpanet(model);
			return;
		}
		applySolveResult(EngCalcs.lpnSolve(model, { tol: settings.tolerance }));
	}

	function applySolveResult(result) {
		var pc = EngCalcs.pageConfig || {};
		if (!result.ok || !result.converged) {
			lastSolveResult = null;
			setStatus(pc.lpn_diag_not_converged || 'Did not converge.');
			refreshLabelText();
			consumeFitAfterSolve();
			return;
		}
		lastSolveResult = result;
		// The only case where the two engines knowingly disagree, so say so rather than let a
		// user discover a 0.6% shift by switching the checkbox. See js/lpn-epanet.js.
		var manningNote = (result.warnings || []).some(function (w) { return w.code === 'manning-constant-differs'; });
		setStatus(manningNote ? (pc.lpn_engine_manning_note || '') : '');
		refreshLabelText();
		consumeFitAfterSolve();
	}

	// EPANET path. Async, so it needs a guard the synchronous path never did: this page solves
	// on a 300 ms debounce after every keystroke and drag, and the WASM round trip can easily
	// outlast the next edit. Without the token, a slow solve of an OLD network can land after a
	// fast solve of the CURRENT one and silently overwrite correct results with stale ones --
	// and it would look like a physics bug, not a race.
	var epanetToken = 0;
	function runSolveEpanet(model) {
		var pc = EngCalcs.pageConfig || {};
		var myToken = ++epanetToken;
		setStatus(pc.lpn_engine_loading || 'Loading the EPANET engine…');
		EngCalcs.lpnSolveEpanet(model, { tol: settings.tolerance }).then(function (result) {
			if (myToken !== epanetToken) { return; }   // a newer solve already started; drop this one
			applySolveResult(result);
		}, function (err) {
			if (myToken !== epanetToken) { return; }
			// Fall BACK to the native solver rather than leaving the user with no numbers. The
			// import can fail for reasons that have nothing to do with the network -- offline on
			// a first use, a blocked module request -- and the native answer is just as correct.
			lastSolveResult = null;
			setStatus(pc.lpn_engine_failed || 'The EPANET engine could not be loaded; showing the built-in solver instead.');
			applySolveResult(EngCalcs.lpnSolve(model, { tol: settings.tolerance }));
			if (window.console && console.warn) { console.warn('EPANET engine load/solve failed:', err); }
		});
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
	// **Required even though this page has nothing to initialise** (found 2026-08-06 driving the real
	// page in headless Chromium, on a profile with no cookie -- i.e. every first-time visitor).
	// `EngCalcs.readCookieAndCalc()` calls this unconditionally when `cookieToForm()` finds no cookie,
	// so its absence threw a TypeError that aborted the rest of that function -- taking `loadFromUrl()`
	// and the first `pageCalculator()` down with it. Every other calculator defines it, several as
	// exactly this empty stub; only this page had not, because this page is built in JS rather than
	// from `$arrayInputs` rows and never looked like it needed one.
	EngCalcs.pageCalculatorInitialize = function (objForm) {};
	EngCalcs.pageCalculator = function (objForm) {
		// A unit switch REINTERPRETS every input (Task 263), so it changes the physics rather than
		// the display: the same three curve points mean a different pump under l/s than under gpm,
		// and every solved head, pressure and velocity moves with them. Refit, then re-solve.
		// This is the whole visible consequence of the ban, and it is deliberate.
		recomputeAllPumpCurves();
		scheduleSolve();
		// The project's units are part of the project (serializeProject), so a switch is a change to
		// persist -- otherwise closing the tab would lose which units the numbers are in.
		saveToStorage();
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
