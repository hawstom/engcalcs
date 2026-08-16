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

	// The pure halves of this file, lifted out so they can be run without a browser
	// (ROADMAP Task 293). Geom is polyline/leader/label-box arithmetic; Collide is the
	// label relaxation. Both are values-in/values-out and know nothing about `doc`, the
	// SVG handles, or the settings below -- resolving those stays this file's job.
	// Their <script> tags precede this one in Looped-Network.php; the harnesses in
	// dev/lpn-spike/ require them directly.
	var Geom = EngCalcs.lpnGeom, Collide = EngCalcs.lpnCollide;

	var NS = 'http://www.w3.org/2000/svg';
	var svg, world, backdropLayer, gridLayer, linksLayer, nodesLayer, labelsLayer, debugBoxLayer;
	var state = { tx: 0, ty: 0, s: 1 };
	// `settings.textSize` is SCREEN PIXELS, full stop -- shared by a node's ID/pressure label, a
	// link's label, and a user-added Text label. It is returned in WORLD units (divided by the
	// current scale) because everything in this file is drawn in world coordinates; the division is
	// what holds the on-screen size constant as you zoom, so it must be re-applied whenever state.s
	// changes (refreshFontSizes(), from onZoomChanged()) rather than once at build time like every
	// other geometry here.
	//
	// **DO NOT REINTRODUCE MAP-UNIT TEXT SIZING.** Text and symbols are furniture of the VIEW, not
	// features of the model -- the GIS paradigm, and what every GIS does. A label is 11 px because
	// 11 px is legible; the map underneath is 400 ft or 4 miles wide and the lettering does not
	// care. A world-unit size is a size whose legibility depends on how far you happen to be zoomed
	// out, and no floor, warning or better default fixes that: Net3's map-unit text at 0.2 units is
	// a fraction of a pixel, so a correct network imports and shows nothing. What replaces it is
	// not a size setting at all but `settings.labelMaxWidth`, which decides whether a label is
	// drawn at this zoom rather than drawing it too small to read.
	//
	// Screen-pixel floors went with it: a pixel is a pixel at every zoom, so there is nothing left
	// to floor.
	//
	// mult: a Text label's own per-label size multiplier (lb.sizeMult, default 1), stacked on top
	// of the shared settings.textSize -- node/link labels never pass one.
	function effectiveFontSize(mult) {
		return (settings.textSize / (state.s || 1)) * (mult || 1);
	}
	function effectiveLineHeight() { return effectiveFontSize() * 1.2; }
	// Everything on the map that is drawn at a fixed world size relative to the LETTERING was drawn
	// against THIS size, so it is expressed as "base dimension x textFactor()". Used by the extrema
	// badges, the leader threshold and the default label offset. It no longer feeds symbolFactor():
	// symbols have had their own pixel size since Task 331, which is the decoupling Tom asked for.
	// This number's only job is to say what size those fixed world dimensions were drawn for, so
	// that they scale together with the text.
	var LPN_BASE_TEXT_SIZE = 2.5;

	// ---- Map-interface instrumentation (ROADMAP Task 200) ----
	// Two questions, and between them they name exactly where this page loses people: which of the
	// four ways INTO a network a visitor reaches for first, and which of the solver's pre-solve
	// complaints they hit most. The first-action histogram is also the first evidence that bears on
	// the empty-canvas decision (closed 2026-07-29, commit 7428ff0: a new project opens on
	// placeholder text rather than a worked example) -- which was made with no data at all, and
	// which this will either vindicate or overturn.
	//
	// FIRST means first: only one row per page load, so the counts are a histogram of opening moves
	// rather than of total activity. "Nothing" is not logged and does not need to be -- it is the
	// Looped-Network human-view rows that carry no first: row at all, which log/lang-log-stats.sh
	// reports as the residual.
	var lpnFirstActionLogged = false;
	function logLpnFirstAction(what) {
		if (lpnFirstActionLogged) { return; }
		lpnFirstActionLogged = true;
		if (EngCalcs.logSignal) { EngCalcs.logSignal('lpn', 'first:' + what); }
	}
	function logLpnDiag(code) {
		// Deduped per (page load, code) by EngCalcs.logSignal itself: runSolve() re-runs on a 300ms
		// debounce after every keystroke and drag, so counting every occurrence would measure typing
		// speed rather than how often a diagnostic is met.
		if (EngCalcs.logSignal) { EngCalcs.logSignal('lpn', 'diag:' + code); }
	}
	// Leader slope for the example network's anchored callouts, degrees above horizontal.
	// 70, not the 60 Tom named on 2026-08-09, because he named it while approving the J3 callout he
	// was looking at -- and that one measures ~70 (a 60-unit rise over a 22.2-unit gap). He asked
	// for "60 degrees LIKE you make the 'lowest pressure' text"; the two halves of that sentence
	// disagree, so this keeps the appearance he approved rather than the number he estimated from
	// it. One constant to change if a true 60 turns out to read better.
	var LPN_CALLOUT_ANGLE = 70;
	function textFactor(mult) { return effectiveFontSize(mult) / LPN_BASE_TEXT_SIZE; }

	// ---- Task 146.01: draggable node/link data labels (leader lines + collision avoidance) ----
	// A node/link's data label sits at a small fixed offset from its anchor (id/elev/demand/... text
	// beside the symbol) unless the user drags it -- n.lx/n.ly (or l.lx/l.ly) then record that as an
	// explicit offset, persisted with the element like any other property. undefined means "still at
	// the default" so an old saved network (no lx/ly at all) renders identically to before this task.
	//
	// **WHAT lx/ly LOCATE IS THE LEADER'S ENDPOINT -- point B -- NOT THE TEXT.** The leader angle is
	// sacred, and storing the text corner instead cannot hold it: B would be recomputed every
	// render as one edge of the text box, a box whose width is a SCREEN-PIXEL quantity and
	// therefore ~1/zoom in world units, so B slides by a whole box width as you zoom whenever the
	// text hangs on the far side, and the angle A->B slides with it.
	//
	// B is stored and the TEXT hangs off it (dataLabelOrigin()). The two are different kinds of
	// fact and that is the whole design: the endpoint is a fact about the DRAWING -- the user's,
	// world units, sacred -- while which side the text sits on is a fact about LEGIBILITY, ours,
	// and free to flip. One number cannot be both.
	//
	// A save written before this reads its lx/ly as B: exact for a label that hung to the RIGHT of
	// its anchor (there B already was the box origin), shifted by one box width for a left-hanging
	// one. Not migrated, because the old width is unrecoverable -- it depended on the zoom the
	// label was last rendered at, which is precisely the defect.
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
	// A link's centerline as a point list: its two end nodes with any user vertices between.
	// This is the one place link topology becomes plain geometry, and everything in
	// EngCalcs.lpnGeom takes its input in this form.
	function linkPointList(l) {
		return [nodeById(l.from)].concat(l.verts, [nodeById(l.to)]);
	}
	// The point a fraction `f` of the way along the WHOLE polyline, by arc length -- not the
	// midpoint of some chosen segment. Returns the point plus the along-distance it sits at, so
	// callers can reason about spacing between things placed on the same link.
	function pointAlongLink(l, f) {
		return Geom.pointAlongPolyline(linkPointList(l), f);
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
	// `along` overrides the default half-way station. Only the aligned-label station search passes
	// it: an aligned label that collides with another aligned label cannot be nudged sideways (it
	// would leave its pipe), so it SLIDES, which is what a GIS does with a road name. The arrow
	// dodge still applies at whatever station is asked for.
	function linkLabelMid(l, along) {
		var clear = (ARROW_NOMINAL_LEN * arrowFactor()) * 1.5;
		return Geom.dodgeAlongPolyline(linkPointList(l), along === undefined ? LINK_LABEL_ALONG : along,
			arrowAlongDistances(l), clear, 0.12, 0.88);
	}
	// ---- A LONG PIPE CARRIES ITS LABEL SEVERAL TIMES --------------------------------------------
	//
	// The other half of the GIS convention Task 329 brought in. A road name is not written once in
	// the middle of a highway; it is repeated along it, so whatever piece of the line you are
	// looking at names itself without your eye having to travel.
	//
	// THE SPACING IS IN VIEW UNITS, NOT MODEL UNITS, AND THAT IS THE WHOLE DESIGN. A fraction of
	// the view means "about this many labels across the screen" on every network ever drawn -- a
	// 400 ft subdivision and a 40 mile transmission main read the same way, and neither needs a
	// number typed by anybody. The count re-derives on every zoom: a zoom runs refreshFontSizes(),
	// which ends in refreshLabelText().
	//
	// n = 1 REPRODUCES A SINGLE CENTRED LABEL EXACTLY. Stations are (i + 0.5)/n, so one label lands
	// at 0.5 = LINK_LABEL_ALONG; the single-label path, the arrow dodge and the aligned-label
	// station search are untouched on any pipe shorter than one spacing.
	//
	// **THIS NUMBER IS A CEILING ON THE GAP, NOT THE GAP.** `linkLabelStations()` takes
	// n = ceil(L/s) and spaces at L/n, so what a reader SEES is anywhere in (s/2, s] -- a pipe
	// barely longer than one spacing gets two labels at half of it, and over pipes of 1-2s the mean
	// is 0.75 s. `ceil` is what guarantees a gap is never WIDER than the nominal; nominal and
	// realized cannot both equal s, they conflict by arithmetic. The guarantee was kept and the
	// number raised instead, so realized spacing is (0.375, 0.75] x min.
	//
	// The rejected alternative is a settings row ("% of minimum map dimension for label spacing").
	// Not built: a number nobody has yet wanted to change costs 26 translations, and the three
	// adjustments so far each moved a default everybody gets, not a preference one drawing needed.
	var LPN_LABEL_REPEAT_FRAC = 0.75;
	// **THE DIVISION IS UNCAPPED; WHAT IS BOUNDED IS WHAT GETS DRAWN.** A cap on n would be a cap
	// on the SPACING, so a very long pipe zoomed into would silently stop obeying the rule; a cap
	// on the drawing is just not building elements nobody can see. So n is exactly ceil(L/s) at
	// every zoom, and drawnLinkLabelStations() below keeps only the stations near the window.
	//
	// A LAST-RESORT GUARD, not a rule: a pipe that folds back and forth INSIDE the window can
	// legitimately have many stations in view, and a pathological one could have thousands. This
	// bounds the DOM without ever being reached by an ordinary drawing (a straight pipe crossing the
	// padded window has at most about 13).
	var LPN_LABEL_DRAWN_MAX = 40;
	function visibleMapHeight() {
		var h = svg && svg.clientHeight ? svg.clientHeight : 0;
		return h / (state.s || 1);
	}
	// ---- "SCREEN SIZE": SAY WHICH DIMENSION, EVERY TIME -----------------------------------------
	//
	// **THE STANDARD IS `min` EVERYWHERE**, because it is the only convention that is ever FORCED:
	// "must all of it be visible" is settled by the tighter dimension, by arithmetic rather than by
	// taste, so the fit and a restored view have no choice. The label-visibility threshold and the
	// label repeat spacing are both free, and they join the standard rather than keeping private
	// conventions nobody could have guessed -- the page once ran all three at once (`max` for the
	// repeat, `min` for the fit, WIDTH ALONE for visibility) with nothing naming any of them.
	//
	// One convention is what makes the rule sayable to a user in one sentence. `max`, `diag` and
	// the single axes stay available and named, so a call site that genuinely needs one must say so.
	//
	// A "field of view" is how much you can SEE, so a control reading on this says "smaller than",
	// never "narrower than" -- the latter invokes literal width and mismeasures the metaphor.
	//
	// AND IT IS NOT THE SCREEN. It is the map area -- the canvas, narrower than the window and much
	// shorter. Wording shown to a user should say map, not screen, or it promises a relationship to
	// the display that does not exist.
	function mapSpan(which) {
		var w = visibleMapWidth(), h = visibleMapHeight();
		if (which === 'w') { return w; }
		if (which === 'h') { return h; }
		if (which === 'min') { return Math.min(w, h); }
		if (which === 'diag') { return Math.hypot(w, h); }
		return Math.max(w, h);   // 'max' -- available, named, and no longer the house style
	}
	function labelRepeatSpacing() {
		// MIN, the house standard. Tom's original spec said max and he later called this one "fuzzy
		// and can use whatever" -- so it takes the standard rather than keeping a private rule.
		// Practically it means a wide, short window repeats labels a little more often, measured
		// against the dimension that runs out first.
		return LPN_LABEL_REPEAT_FRAC * mapSpan('min');
	}
	// The window, in world units, that a label has to be near to be worth building: the viewport
	// grown by one full view-span on every side. Panning by less than a screen therefore never
	// arrives at an unlabelled stretch, and the re-cull at the end of a pan fills in the rest.
	function viewWorldRect(pad) {
		var w = svg && svg.clientWidth ? svg.clientWidth : 0,
			h = svg && svg.clientHeight ? svg.clientHeight : 0,
			s = state.s || 1;
		return {
			x0: (-state.tx) / s - pad, y0: (-state.ty) / s - pad,
			x1: (w - state.tx) / s + pad, y1: (h - state.ty) / s + pad
		};
	}
	// THE SPEC'S n, in full: every station this pipe's label belongs at, whether or not any of them
	// is on screen. Always at least one entry, and exactly one unless the pipe is longer than the
	// spacing -- in which case the stations are (i + 0.5)/n, which puts a lone label back at the
	// half-way point and leaves every short pipe exactly as it was.
	//
	// A MANUALLY DRAGGED LABEL IS NEVER REPEATED. The user put that label in that spot; copying it
	// to five other spots is not what they asked for, and l.lx/l.ly can only describe one of them.
	// (Task 329's aligned path already opts out of alignment for the same reason.)
	function linkLabelStations(l) {
		var s = labelRepeatSpacing(), len = Geom.polylineLength(linkPointList(l)), n, i, out = [];
		if (labelIsDragged(l) || !(s > 0) || !(len > s)) { return [LINK_LABEL_ALONG]; }
		n = Math.ceil(len / s);
		for (i = 0; i < n; i++) { out.push((i + 0.5) / n); }
		return out;
	}
	// ...and the ones actually worth building elements for. Derived from the POLYLINE rather than
	// from each station's own position, so the cost is proportional to what is drawn instead of to
	// how long the pipe is: a segment whose bounding box misses the window contributes no stations,
	// and one that meets it contributes the index range its along-distances cover. A pipe a thousand
	// view-widths long therefore costs the same as a short one.
	function drawnLinkLabelStations(l) {
		var all = linkLabelStations(l);
		// An ordinary single-label pipe is never culled. Its <text> is the link's own element and
		// bbox() reads its position for zoom-to-fit, so removing it off-screen would make the fit
		// depend on the view it started from -- the circularity Task 332 exists to avoid.
		if (all.length === 1) { return all; }
		var pts = linkPointList(l), n = all.length,
			len = Geom.polylineLength(pts),
			rect = viewWorldRect(mapSpan('max')),   // the CULL window, deliberately generous: a full view-span of margin on every side
			out = [], run = 0, i, j, d, lo, hi, i0, i1, clip;
		for (i = 0; i + 1 < pts.length && out.length < LPN_LABEL_DRAWN_MAX; i++) {
			d = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
			// CLIPPED, not merely bounding-box tested. A single 1000-unit segment crossing a
			// 750-unit window has a bounding box that overlaps it, and accepting the whole segment
			// on that basis draws every station on the pipe -- which is the cull not happening.
			clip = Geom.segmentRectRange(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y, rect);
			if (clip && d > 0) {
				// Station j sits at along-distance (j + 0.5)·len/n, so the clipped part of this
				// segment covers the index range below.
				lo = run + clip.t0 * d; hi = run + clip.t1 * d;
				i0 = Math.max(0, Math.ceil(lo * n / len - 0.5));
				i1 = Math.min(n - 1, Math.floor(hi * n / len - 0.5));
				for (j = i0; j <= i1 && out.length < LPN_LABEL_DRAWN_MAX; j++) {
					if (out.indexOf(all[j]) < 0) { out.push(all[j]); }
				}
			}
			run += d;
		}
		return out;
	}
	function linkLabelBase(l) {
		var mid = linkLabelMid(l), d = defaultLabelOffset();
		return { x: mid.x + (l.lx !== undefined ? l.lx : d.x),
			y: mid.y + (l.ly !== undefined ? l.ly : d.y) };
	}
	// Final rendered offset from the anchor = the persisted drag offset (or default) PLUS this
	// element's current placement nudge.
	// **A MANUALLY PLACED LABEL MOVES ONLY ALONG ITS OWN LEADER, AND THAT IS GUARANTEED WHERE THE
	// NUDGE IS COMPUTED, NOT HERE.** Tom's rule is *"Store the user's leader endpoint and hold it
	// constant. If you extend it, don't overwrite it. Your extension is temporary."* -- so goal 1
	// of dev/label-placement-goals.md gives a dragged label candidates on the RAY through its
	// stored endpoint and nowhere else: it can be pushed further out at the same angle and can
	// never be moved sideways or nearer. This used to read the nudge as zero for such a label,
	// because the relaxation it fronted could push in any direction at all and there was no other
	// way to hold the angle. Scoring holds the angle by construction, so the extension Tom
	// described is now available. It stays temporary: every nudge is re-derived from scratch on
	// every pass and none is ever written into n.lx/n.ly.
	// A nudge computed for a label that was AUTO-placed is meaningless the instant that label
	// becomes dragged, and the other way round -- it was searched for on a different candidate set.
	// The pass stamps which kind it was solving (holder.nudgeManual) and this refuses the nudge
	// until the pass has caught up. Every gesture that sets lx/ly re-runs the pass immediately, so
	// this fires only in the window between, which is precisely where the old "a manual label takes
	// no nudge" rule was really earning its keep.
	function placementNudge(holder, manual) {
		return (holder && holder.nudge && !!holder.nudgeManual === !!manual)
			? holder.nudge : { x: 0, y: 0 };
	}
	function nodeLabelPos(n) {
		var base = nodeLabelBase(n), nudge = placementNudge(nodeEls[n.id], n.lx !== undefined);
		return { x: base.x + nudge.x, y: base.y + nudge.y };
	}
	function linkLabelPos(l) {
		var base = linkLabelBase(l), nudge = placementNudge(linkEls[l.id], l.lx !== undefined);
		return { x: base.x + nudge.x, y: base.y + nudge.y };
	}
	// The same quantity for one REPEAT of a chain: its own station's point plus the plain default
	// offset. No drag offset and no nudge, because a chain has neither (see layoutLinkLabelAt()).
	function repeatLabelPos(l, rep) {
		var mid = linkLabelMid(l, rep.along), d = defaultLabelOffset();
		return { x: mid.x + d.x, y: mid.y + d.y };
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
	function updateDataLeader(holder, anchor, end) {
		if (!holder.leader) { return; }
		if (holder.empty) { holder.leader.style.display = 'none'; return; }
		var d = Math.hypot(end.x - anchor.x, end.y - anchor.y);
		if (d <= leaderThreshold()) { holder.leader.style.display = 'none'; return; }
		// A -> B, both world points, nothing derived. This line is the whole of Task 328: the
		// endpoint used to be computed here from the label box, so it moved when the box's
		// pixel width did, and the angle moved with it.
		holder.leader.style.display = '';
		holder.leader.setAttribute('x1', anchor.x); holder.leader.setAttribute('y1', anchor.y);
		holder.leader.setAttribute('x2', end.x); holder.leader.setAttribute('y2', end.y);
	}
	// WHERE THE TEXT GOES, given the endpoint the user placed. The box hangs off B on whichever
	// side keeps it from lying across its own leader, which is a fact about legibility and is
	// therefore allowed to move with the zoom -- unlike B itself. labelBoxWidth() rather than tw
	// directly, because the box is a concept several places share; since Task 333 the two are equal
	// (the extrema mark no longer hangs past the digits), and this call is what keeps the
	// dependency in one place if that ever changes again.
	// holder.side persists across calls to carry the hysteresis, exactly as it did when this was
	// the leader's attachment edge.
	// **THE HYSTERESIS IS FOR A HAND ON A LABEL, AND FOR NOTHING ELSE.** Tom, 2026-08-16: *"we only
	// have to check for violation on the nearest side. We have no reason to check the other side
	// because we will never use it."*
	//
	// labelSideAtEnd() holds the PREVIOUS side inside a dead band either side of the anchor's
	// vertical line, so it can leave the box on the anchor's side -- and then the leader runs the
	// width of the text to reach its endpoint. That is the defect Tom photographed on 2026-08-16.
	// It is the right behaviour while a user DRAGS: without it a label pulled just past the line
	// flickers its text a full box-width from side to side.
	//
	// An auto-placed label is not dragged. Its endpoint is chosen by the placement pass from
	// seventeen discrete candidates, so there is no continuous sweep across the line to damp, and
	// nothing is gained by ever putting the box on the near side. Taking the nearest side
	// unconditionally also makes js/lpn-collide.js's labelBoxAtEnd() correct by construction rather
	// than by reproducing a render-time quirk -- the scorer and the renderer cannot disagree about
	// a rule neither of them has.
	function dataLabelOrigin(holder, anchor, end, dragged) {
		var w = labelBoxWidth(holder);
		holder.side = dragged
			? Geom.labelSideAtEnd(holder.side, end.x, anchor.x, w / 2, ADVERSE_FRAC)
			: (end.x >= anchor.x ? 'right' : 'left');
		return { x: holder.side === 'right' ? end.x : end.x - w, y: end.y };
	}
	// Approximate vertical box of a left-anchored, top-down multi-line <text> (node/link labels):
	// no exact ascent/descent metrics available cross-browser without layout, so this uses a
	// fraction of font size that reads right for the suite's actual label content (short numbers/
	// letters, no descenders like "g"/"y"). Good enough for collision boxes; not
	// meant to be pixel-exact.
	function dataLabelBoxHeight(lineCount) {
		return Geom.dataLabelBoxHeight(lineCount, effectiveFontSize(), effectiveLineHeight());
	}
	// LEGIBILITY BACKING IS A HALO ON THE GLYPHS AND LIVES ENTIRELY IN css/engcalcs.css (Task 376).
	// There is nothing to position here: `paint-order: stroke fill` with a white stroke follows the
	// letters, merges between close characters, rotates with the text because it IS the text, and
	// disappears with it. The rect it replaced needed an element per label, a pad constant, a
	// transform kept in step, and a hide call at every place a label could go empty.
	// Final per-frame layout of one node's data label -- text position and its leader (if
	// dragged/nudged past LABEL_LEADER_THRESHOLD). Called from buildNodeEls() (first layout),
	// updateNode() (node moved), and refreshLabelText() (after every collision-avoidance pass, since
	// a nudge or a toggled field changing tw/lineCount both move this label).
	function layoutNodeLabel(id) {
		var n = nodeById(id), ne = nodeEls[id]; if (!ne) { return; }
		var anchor = { x: n.x, y: n.y }, end = nodeLabelPos(n),
			org = dataLabelOrigin(ne, anchor, end, labelIsDragged(n));
		repositionMultilineText(ne.text, org.x, org.y);
		updateDataLeader(ne, anchor, end);
	}
	// Same as layoutNodeLabel() above, for a link's data label -- anchor is the link's own mid-
	// segment point (linkLabelMid()), which itself moves whenever a vertex/endpoint drags.
	// Local direction of the pipe AT the label's own point, not end-to-end: on a bent pipe the
	// straight line between endpoints can lie at a completely different angle from the piece of pipe
	// the label is actually sitting on, which is the difference between a label that reads as
	// attached and one that reads as loose. Falls back to the endpoints for a link with no usable
	// segment (all-coincident points), where any angle is as good as any other.
	function linkDirectionAt(l, at) {
		var pts = linkPointList(l), best = null, bestD = Infinity, i, ax, ay, bx, by, t, px, py, d;
		for (i = 0; i + 1 < pts.length; i++) {
			ax = pts[i].x; ay = pts[i].y; bx = pts[i + 1].x; by = pts[i + 1].y;
			var vx = bx - ax, vy = by - ay, len2 = vx * vx + vy * vy;
			if (!len2) { continue; }
			t = ((at.x - ax) * vx + (at.y - ay) * vy) / len2;
			t = t < 0 ? 0 : (t > 1 ? 1 : t);
			px = ax + vx * t; py = ay + vy * t;
			d = (px - at.x) * (px - at.x) + (py - at.y) * (py - at.y);
			if (d < bestD) { bestD = d; best = { ax: ax, ay: ay, bx: bx, by: by }; }
		}
		if (best) { return best; }
		var a = nodeById(l.from), b = nodeById(l.to);
		return a && b ? { ax: a.x, ay: a.y, bx: b.x, by: b.y } : { ax: 0, ay: 0, bx: 1, by: 0 };
	}
	// TRUE when this link's label should be drawn ALONG the pipe (the GIS way) rather than
	// horizontally beside it. A DRAGGED label always opts out: the user placed it, and rotating what
	// they positioned by hand would overrule a deliberate act -- alignment is what we do when nobody
	// has said otherwise. See ROADMAP Task 329.
	// Clamped where it is READ, not where it is written, so a document carrying a wild number from
	// some future edit still draws something readable rather than upside-down text.
	var LPN_FLIP_LEFT_MIN = 0, LPN_FLIP_LEFT_MAX = 45;
	function labelFlipLeftOfVertical() {
		var d = +settings.labelFlipLeftOfVertical;
		if (!isFinite(d)) { return 20; }
		return Math.max(LPN_FLIP_LEFT_MIN, Math.min(LPN_FLIP_LEFT_MAX, d));
	}
	// The renderer wants the top of its readable window, in the SVG frame where y is down and angles
	// run clockwise. A label's reading direction may lean `d` degrees LEFT of straight up -- so the
	// window is (-(90 + d), 90 - d], and `90 - d` is what alignedLabelAnchor() calls `bias`. At
	// angle -90 the text runs straight up the screen; at -(90 + d) it runs up and to the left.
	//
	// **THE SIGN IS THE ENTIRE BUG THIS FIXES.** With d = 0 the window is (-90, 90], which keeps a
	// pipe drawn at +80 reading TOP-TO-BOTTOM; every map ever printed reads a north-south name
	// bottom-to-top. A positive d moves the doorway the other way, so near-vertical pipes land at
	// about -100 and read upward as a family.
	function labelReadabilityBias() { return 90 - labelFlipLeftOfVertical(); }
	function linkLabelAligned(l) {
		return !!settings.alignPipeLabels && l.lx === undefined && l.ly === undefined;
	}
	// WHICH SIDE OF THE PIPE. Tom's two answers turn out to be one: prefer the top, and take the
	// other side when the top is congested (2026-08-14, on seeing a label lying across the pipe
	// below it -- *"Other side of pipe would have been very nice here"*). Congestion is measured as
	// distance to the nearest OTHER link, because that is what the picture showed and because
	// a link's own centreline has never been an obstacle to its own label: a data label has always
	// been free to sit straight on its pipe, and aligning labels along pipes is what made it
	// visible.
	//
	// A margin before switching, so the top stays the default rather than becoming "whichever side
	// won by a hair". A drawing whose labels sit above some pipes and below others for reasons no
	// reader can see is worse than one that is occasionally tight -- consistency IS legibility here,
	// which is the same argument that makes the readability flip non-negotiable in
	// alignedLabelAnchor(). So the bottom has to be clearly better, not merely better.
	var LPN_SIDE_SWITCH_MARGIN = 1.35;
	function alignedSideFor(l, top, bottom) {
		var clearTop = Infinity, clearBot = Infinity;
		doc.links.forEach(function (o) {
			if (o.id === l.id) { return; }
			var pts = linkPointList(o), dt, db;
			dt = Geom.pointToPolylineDistance(pts, top.x, top.y);
			db = Geom.pointToPolylineDistance(pts, bottom.x, bottom.y);
			if (dt < clearTop) { clearTop = dt; }
			if (db < clearBot) { clearBot = db; }
		});
		return clearBot > clearTop * LPN_SIDE_SWITCH_MARGIN ? -1 : 1;
	}
	// A PIPE TOO SHORT TO CARRY ITS OWN LABEL DOES NOT CARRY ONE (Tom, 2026-08-14: "if a line is too
	// short, its label must disappear even if the map is closer than the all-disappear limit"). The
	// map-width threshold answers "is this drawing being read or surveyed"; it cannot answer "is
	// there room on THIS pipe", so a dense corner of a network at a readable zoom still fills with
	// numbers belonging to stubs a few pixels long.
	// The test is the label against the pipe, and it needs no setting because it is already in the
	// right frame: labelBoxWidth() is derived from getBBox(), so it is a screen-pixel quantity
	// expressed in world units (~1/zoom), while the pipe's length is a fixed world number. Zooming
	// in shrinks the label relative to the pipe and the label comes back, at exactly the zoom where
	// it fits. The same comparison in pixels on both sides would be zoom-invariant and useless.
	// A DRAGGED LABEL IS EXEMPT, and that is Tom's own hedge on the rule, minutes after asking for it
	// (2026-08-14: "could we soften that as 'if not dragged' to give the user the ability to keep
	// short pipe labels from hiding?"). It makes the rule an automatic-placement rule rather than a
	// censor: the moment someone drags a label off a stub -- which is exactly what you do when you
	// want that number on the sheet -- it is authored, and this stops applying. So there is an escape
	// hatch, it needs no setting, and the gesture that reveals the intent is the one a user already
	// makes. Double-clicking the label sends it home and the rule resumes.
	var SHORT_LINE_MULT = 1;
	function linkLabelTooShort(l, le) {
		if (!le || le.empty) { return false; }
		if (l.lx !== undefined || l.ly !== undefined) { return false; }
		var w = labelBoxWidth(le);
		return w > 0 && Geom.polylineLength(linkPointList(l)) < w * SHORT_LINE_MULT;
	}
	// One label assembly, hidden together: text, leader and any extrema badges. `visibility`
	// rather than `display` for the same reason the map-width rule uses it (see css/engcalcs.css) --
	// it composes with each part's own show/hide logic instead of overwriting it.
	function setLabelAssemblyHidden(le, hidden) {
		var v = hidden ? 'hidden' : '';
		if (le.text) { le.text.style.visibility = v; }
		if (le.leader) { le.leader.style.visibility = v; }
		(le.repeats || []).forEach(function (r) { r.text.style.visibility = v; });
	}
	// The extra renderings of a long pipe's label (see linkLabelStations() above). Grown and shrunk
	// in place rather than rebuilt, because the count changes on every zoom step and rebuilding a
	// chain of elements per frame is how a map editor gets slow.
	//
	// A REPEAT IS NOT A SECOND LABEL. It carries neither `data-linklbl` nor `.lpn-draglbl`, so it is
	// invisible to hit testing and cannot be dragged, renamed or reset -- there is still exactly one
	// label per link as far as every interaction in this file is concerned, and the repeats are
	// pixels. It does carry the annotation class (Task 334), so it hides with everything else
	// generated. `side` is its own leader-hysteresis state, unused while unaligned repeats draw no
	// leader, kept so dataLabelOrigin() has somewhere to write.
	function ensureLabelRepeats(le, n, linkId) {
		if (!le.repeats) { le.repeats = []; }
		while (le.repeats.length > n) {
			var gone = le.repeats.pop();
			gone.text.remove();
		}
		while (le.repeats.length < n) {
			le.repeats.push({
				// EVERY COPY IS PICKABLE, and that is Tom's call on 2026-08-15: *"The problem is
				// that I can only drag one upstream label."* It carries the same `data-linklbl` and
				// the same `.lpn-draglbl` as the original, so grabbing any of them drags THE label,
				// opens THE link's properties, and double-click sends it home -- there is no magic
				// copy to learn. The alternative he offered, making the draggable one the UPSTREAM
				// label, was rejected on one fact he could not have known: upstream is a SOLVE
				// RESULT, so a reversing flow would move the drag target to the other end of the
				// pipe when an unrelated demand changed. A target that moves for invisible reasons
				// is not learnable.
				// `data-repeat` is how a pointerdown finds WHICH copy was grabbed, which is what
				// lets the chain collapse to exactly where the user took hold of it instead of
				// jumping to the half-way point first.
				text: annotationEl('text', {
					'class': 'lpn-lbl lpn-draglbl', 'data-linklbl': linkId,
					'data-repeat': le.repeats.length,
					style: 'font-size:' + effectiveFontSize() + 'px'
				}, labelsLayer),
				side: 'right', empty: false
			});
		}
	}
	// A repeat's glyphs, rebuilt only when the primary's content actually changed. refreshLabelText()
	// bumps le.rowsSeq; a layout pass runs on every drag frame and must not rebuild tspans it
	// already has.
	function syncRepeatText(le, part) {
		if (part.seq === le.rowsSeq || !le.rows) { return; }
		setMultilineText(part.text, 0, le.rows);
		part.seq = le.rowsSeq;
	}
	// WHERE AN ALIGNED LINK LABEL ACTUALLY LANDS: {ax, ay, angle}. Extracted from layoutLinkLabel()
	// on 2026-08-14 because it now has TWO callers, and the reason it needed two is the whole bug.
	//
	// ALIGNED means: text-anchor middle, rotated about its own anchor, no leader and no nudge. A
	// leader would be redundant by construction -- a label lying along the pipe already says which
	// pipe it belongs to by its ORIENTATION, which is the whole economy of the GIS convention and
	// the reason it survives on maps carrying thousands of labels.
	//
	// **"No nudge" was read as "not the collision pass's business", and that was the defect.** A
	// label that does not MOVE is still an OBSTACLE, and this one is an obstacle at a rotated
	// position that only this function can compute. While it was inlined in the layout function,
	// the collision pass had no way to ask where the label was, so it used the unaligned position
	// and the unrotated box -- see runLabelCollisionAvoidance(). Anything that needs to know where
	// an aligned label is must come through here; a second copy of this arithmetic would drift from
	// the drawing the moment either side changed, and drift here is invisible in code and obvious
	// on screen.
	function alignedLabelPlacement(l, le, along, force) {
		var mid = linkLabelMid(l, along),
			dir = linkDirectionAt(l, mid),
			opt = {
				// **THE GAP IS DERIVED FROM WHAT MUST BE CLEARED, NOT FROM A NODE'S RADIUS** (Tom,
				// 2026-08-15, after the mask pad was already shrunk: *"aligned labels still mask
				// their own pipes"* -- the halo that replaced the mask has the same job to do here).
				// It was `nodeRadius + 0.35 x fontSize`, and a node's radius has
				// nothing to do with a label lying halfway along a pipe -- it was a stand-in for
				// "some clearance", and it went out of step the moment anyone changed Symbol size.
				//
				// What actually has to clear the pipe is the bottom edge of the label's own box. In
				// the rotated frame the baseline sits `gap` above the pipe, the descender reaches
				// `dataLabelBoxHeight(1) - 0.85 x fontSize` = 0.25 x fontSize below that baseline,
				// and the halo (0.2em, half of it outside the glyph) adds 0.1 x fontSize more --
				// which is why that halo is sized in em rather than in screen pixels: this
				// arithmetic is written in fractions of the font size and has to stay true at every
				// text size. So the near edge clears the pipe's
				// half-width exactly when gap > halfWidth + 0.35 x fontSize, and 0.5 leaves a sixth of
				// a font size of air. Every term is a quantity the drawing really has, so this stays
				// true when the text, the symbols or the pipe width change independently.
				frac: 0, gap: settings.linkWidth / (2 * (state.s || 1)) + effectiveFontSize() * 0.5,
				fontSize: effectiveFontSize(), lineHeight: effectiveLineHeight(),
				nLines: le.lineCount || 1,
				// Where the 180-degree readability flip happens (Task 351), converted from the
				// "degrees left of vertical" the user sets -- see labelReadabilityBias().
				bias: labelReadabilityBias()
			},
			// Both candidates come from the same call, which is why alignedLabelAnchor() returns
			// a side rather than choosing one -- see ROADMAP Task 329.
			candTop = Geom.alignedLabelAnchor(dir.ax, dir.ay, dir.bx, dir.by,
				Object.assign({ side: 1 }, opt)),
			candBot = Geom.alignedLabelAnchor(dir.ax, dir.ay, dir.bx, dir.by,
				Object.assign({ side: -1 }, opt)),
			// The candidates are offsets from dir's own start point; re-base both onto the
			// label's dodged mid-point before measuring clearance, or we would be measuring
			// congestion at a place the label is never drawn.
			topPt = { x: mid.x + (candTop.x - dir.ax), y: mid.y + (candTop.y - dir.ay) },
			botPt = { x: mid.x + (candBot.x - dir.ax), y: mid.y + (candBot.y - dir.ay) },
			// `force` overrides the clearance choice: -1 bottom, 1 top. The station search cannot
			// slide a repeated chain (its even spacing IS the reading), so flipping a single link
			// of it to the other side of its pipe is the one degree of freedom it has left --
			// Tom, 2026-08-15: *"That applies to station, but I assume that side can still be
			// nudged?"* It can, and this is where. Left undefined, the clearance rule decides as
			// it always has.
			a = (force === -1 || (force !== 1 && alignedSideFor(l, topPt, botPt) < 0)) ? candBot : candTop;
		// alignedLabelAnchor() offsets from a point ALONG the segment it is given; we want it
		// offset from the label's own dodged mid-point, so pass frac 0 and re-base here.
		return { ax: mid.x + (a.x - dir.ax), ay: mid.y + (a.y - dir.ay), angle: a.angle,
			side: a === candBot ? -1 : 1 };
	}
	// One rendering of a link's label, at one station. `part` is {text} -- the link's own element
	// for the first station, a repeat's for the rest (see ensureLabelRepeats()). The two are laid
	// out by the SAME code on purpose: a repeat that drifted from the original in angle or side
	// would read as a different label rather than the same one said again.
	function layoutLinkLabelAt(l, le, part, along, isPrimary, single) {
		if (!isPrimary) { syncRepeatText(le, part); part.along = along; }
		if (linkLabelAligned(l)) {
			// le.alignedAlong is the station placeAlignedLabels() settled on during the collision
			// pass. Undefined until that has run once (and for an empty label), in which case
			// alignedLabelPlacement() falls back to the half-way default -- the same value the
			// search tries first, so the two agree on an uncrowded drawing.
			var a = alignedLabelPlacement(l, le, along, part.forceSide);
			part.text.setAttribute('text-anchor', 'middle');
			part.text.setAttribute('transform', 'rotate(' + a.angle.toFixed(3) + ' ' + a.ax + ' ' + a.ay + ')');
			repositionMultilineText(part.text, a.ax, a.ay);
			if (isPrimary && le.leader) { le.leader.style.display = 'none'; }
			return;
		}
		// Unaligned: exactly as before, and the transforms are CLEARED rather than left behind --
		// a stale rotate on an element that is no longer aligned is invisible in the code and
		// obvious on screen.
		part.text.removeAttribute('transform');
		part.text.setAttribute('text-anchor', 'start');
		// THE LONE LABEL'S PATH IS UNTOUCHED, and the branch is here because its two halves must
		// agree about WHICH POINT the label belongs to. linkLabelPos() is measured from the half-way
		// point -- it has to be, since that is where a drag offset and a collision nudge are stored
		// -- so a label rendered at any other station would draw its leader to a place it is not.
		// A chain therefore takes the plain default offset from its OWN station, and neither a drag
		// nor a nudge applies to it: a dragged label is never repeated (linkLabelStations()), and a
		// chain does not move, it obstructs (see placeStationedLabels()).
		var d = defaultLabelOffset(),
			lone = isPrimary && single,
			mid = lone ? linkLabelMid(l) : linkLabelMid(l, along),
			anchor = { x: mid.x, y: mid.y },
			end = lone ? linkLabelPos(l) : { x: mid.x + d.x, y: mid.y + d.y },
			org = dataLabelOrigin(isPrimary ? le : part, anchor, end, labelIsDragged(l));
		repositionMultilineText(part.text, org.x, org.y);
		if (isPrimary) { updateDataLeader(le, anchor, end); }
	}
	function layoutLinkLabel(id) {
		var l = linkById(id), le = linkEls[id]; if (!le) { return; }
		// Set BEFORE anything is placed, so every station obeys it.
		le.hiddenShort = linkLabelTooShort(l, le);
		setLabelAssemblyHidden(le, le.hiddenShort);
		var single = linkLabelStations(l).length === 1,
			stations = single ? [le.alignedAlong] : drawnLinkLabelStations(l), i;
		ensureLabelRepeats(le, Math.max(0, stations.length - 1), id);
		// The link's own elements take the FIRST DRAWN station, not a fixed one. With every copy
		// pickable that costs nothing -- they are interchangeable -- and it means a chain whose
		// first stations are off-screen still renders through the element bbox() and the popup
		// know about, rather than parking it somewhere nobody is looking.
		// For n = 1 the station is le.alignedAlong, which is what the aligned SEARCH settled on
		// (undefined until it has run, which falls back to the half-way default): a lone label may
		// slide to dodge a neighbour, a chain may not, since even spacing IS the reading.
		if (!stations.length) { setLabelAssemblyHidden(le, true); return; }
		// The side each station settled on, decided in placeStationedLabels() where the obstacles
		// are known and carried here by index. Undefined means "whatever the clearance rule says",
		// which is every case except a chain that had to step round something.
		var sides = le.stationSides || [];
		le.forceSide = sides[0];
		layoutLinkLabelAt(l, le, le, stations[0], true, single);
		for (i = 1; i < stations.length; i++) {
			le.repeats[i - 1].forceSide = sides[i];
			layoutLinkLabelAt(l, le, le.repeats[i - 1], stations[i], false, false);
		}
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
	// AUTOMATIC LABEL PLACEMENT (Task 146.01, rewritten as candidate scoring by Task 379). Each
	// auto-placed data label proposes a set of candidate positions, every one is scored against
	// everything already on the drawing, and the best wins. The goals, their order, the scoring and
	// the candidate sets are in js/lpn-collide.js and dev/label-placement-goals.md; **what stays
	// here is the GATHERING** -- turning `doc`, the element handles and the current font size into
	// plain boxes and segments. That split is what lets the placement be tested without a browser.
	//
	// A MANUALLY DRAGGED LABEL (n.lx/l.lx defined) keeps the endpoint the user gave it: its
	// candidates lie on the RAY through that endpoint, so it can only be pushed further out along
	// the same line, never sideways and never nearer. Tom's own rule -- *"Store the user's leader
	// endpoint and hold it constant. If you extend it, don't overwrite it. Your extension is
	// temporary."* The extension is the nudge, which is transient (re-derived from scratch on every
	// pass, never written into n.lx/l.ly), so it is neither undo-tracked nor persisted.
	//
	// **THE REACH IS A MULTIPLE OF THE LABEL'S OWN SIZE, NOT A PIXEL COUNT** (Tom, 2026-08-16).
	// It was 28 screen pixels, and a 3-line label at the default text size is 50 x 38.5 px -- so the
	// whole search disc fitted INSIDE the label and four of its seventeen candidates sat within the
	// label's own footprint. The pass could shuffle a label but never move it clear of anything.
	//
	// 28 px had been justified as a legibility cap, on the reasoning that a distant label cannot be
	// associated with its element. Tom rejected that reasoning: *"There is no such thing, or lets
	// say it's more than 5 * the label size. Leaders work. That's what they are for. This is not a
	// thing and too many leaders is a thing. Distance miserliness is solely a function of leaders
	// looking too busy and ugly, especially when they vary in angle."* The busy-and-ugly half is
	// answered by the 15-degree angle grid in js/lpn-collide.js, not by keeping labels near.
	//
	// **MEASURED IN TEXT HEIGHTS, AND ONE NUMBER FOR THE WHOLE MAP.** Tom asked for the control in
	// exactly those terms (*"in terms of text size per settings; text heights"*) and then ruled out
	// a per-label reach: *"A single one is better, I think. I didn't specify per label."* Text
	// heights make it scale with the lettering, which is what a fixed pixel count could not do.
	//
	// 30 text heights is about five times a typical 3-line label's diagonal (63 px at textSize 11,
	// which is 5.7 text heights), so it lands where Tom put the floor: *"more than 5 * the label
	// size."* The inner ring is a fifth of it -- roughly one label, the smallest step that can clear
	// a neighbour. Both are adjustable live under ?debug=labels.
	// **THE ANGLE STEP PER CIRCLE, INNERMOST FIRST -- and its LENGTH is how many circles there are.**
	// Tom's rule, 2026-08-16: multiples of 45 on ring 1, of 30 on ring 2, of 15 on ring 3, which
	// gives 4, 8 and 20 directions once the orthogonals are dropped. See js/lpn-collide.js for why
	// rings 1 and 2 deliberately share no direction. Editable live under ?debug=labels.
	var LPN_REACH_TEXT_HEIGHTS = 30, LPN_INNER_TEXT_HEIGHTS = 6,
		LPN_RING_STEPS = [45, 30, 15];
	// **THE NEIGHBOUR CREDIT, `k`.** Goal 11: a candidate is credited for the openness of the
	// directions AROUND it, so the pass prefers a placement with room beside it to an equally clear
	// one hemmed in.
	//
	// **0.25 IS MEASURED, AND IT IS NOT THE VALUE THAT WAS GUESSED.** dev/lpn-spike/collide-harness.js
	// runs its over-constrained 5x5 fixture at six values of k and reports two numbers: how many
	// placements change when one node is nudged (goal 9's stability) and how much conflict is left
	// on the drawing. 0.25 is the joint minimum of both -- 12 changed placements of 96 chances
	// against 20 at k = 0, and slightly less residual conflict as well. The first draft shipped 0.5
	// on the reasoning that more smoothing is more stability; it measured 30. Past a point a
	// smoothed field has broad flat minima, and the argmin inside one of them moves freely.
	// The curve is not monotone (that fixture is a perfect grid, so candidates tie in numbers), which
	// is exactly why this is a measurement and not a trend to extrapolate.
	var LPN_NEIGHBOUR_K = 0.25;
	// A label's own identity in the placement pass, namespaced because a node and a link may mint
	// the same number under different prefixes and ownership is compared by this string.
	function nodeLabelKey(id) { return 'n:' + id; }
	function linkLabelKey(id) { return 'l:' + id; }
	// Every obstacle the pass must go round, as ONE structure: oriented boxes and line segments.
	// Pipes are segments rather than boxes because the arithmetic does not survive sampling -- Net3
	// has 119 pipes, and chopped at three screen pixels a zoomed-in drawing would produce thousands
	// of boxes to test every candidate against. A diagonal pipe's bounding box is also mostly empty
	// space, and boxing it would push labels away from clear ground.
	function staticObstacles() {
		var out = { boxes: [], segments: [] };
		doc.nodes.forEach(function (n) {
			var r = nodeRadius(n);
			var sb = Collide.box(n.x, n.y, r * 2, r * 2, 0);
			sb.kind = 'symbol';
			out.boxes.push(sb);
		});
		// A TEXT LABEL IS AN OBSTACLE, NEVER A PARTICIPANT: the user typed those words and chose
		// that spot, so a data label goes round it and never the reverse.
		doc.labels.forEach(function (lb) {
			var le = labelEls[lb.id]; if (!le) { return; }
			var an = lb.anchorNode ? nodeById(lb.anchorNode) : null,
				px = an ? an.x + lb.x : lb.x, py = an ? an.y + lb.y : lb.y,
				b = Geom.orientedLabelBox(px, py, textLabelWidth(le), textLabelHeight(lb),
					labelHAlign(lb), labelVAlign(lb), textLabelSvgAngle(lb),
					effectiveFontSize(lb && lb.sizeMult));
			b.kind = 'label';
			out.boxes.push(b);
			if (!an) { return; }
			// Its leader, through the label's own box -- the same attachment updateLabelGeometry()
			// draws, since lb.align may put the text somewhere other than centred on its point.
			var box = textLabelBox(lb, le, px, py), halfW = box.w / 2;
			out.segments.push({ ax: an.x, ay: an.y,
				bx: Geom.leaderAttachX(box.x + halfW, halfW, an.x), by: box.y + box.h / 2,
				kind: 'leader' });
		});
		doc.links.forEach(function (l) {
			var pts = linkPointList(l), i;
			for (i = 1; i < pts.length; i++) {
				// OWNED BY ITS OWN LINK, exactly as a leader is owned by its own label. A link's
				// data label sits ON its pipe by design -- that is how a reader tells whose number
				// it is -- so its own centreline is not an obstacle to it. Every other pipe is.
				out.segments.push({ ax: pts[i - 1].x, ay: pts[i - 1].y, bx: pts[i].x, by: pts[i].y,
					kind: 'link', owner: linkLabelKey(l.id) });
			}
		});
		return out;
	}
	// The stations an aligned label will try, in order, as fractions along its own pipe. Half-way
	// first -- that is where it belongs and where it stays in an uncrowded drawing -- then
	// progressively farther out, alternating sides so the label does not drift consistently one
	// way along every pipe it is pushed on. Stops well short of the ends: a label sitting on top of
	// a junction is a worse picture than two labels a little close together, and dodgeAlongPolyline
	// clamps to 0.12/0.88 anyway.
	var LPN_ALIGNED_STATIONS = [0.5, 0.36, 0.64, 0.25, 0.75];
	// A little air between neighbours, in world units scaled off the font -- boxes that merely
	// touch still read as crowded.
	var LPN_ALIGNED_PAD_FRAC = 0.35;
	// **ALIGNED LABELS RESOLVE AMONG THEMSELVES BY SLIDING, NOT BY BEING PLACED.**
	//
	// A label bound to a pipe has one degree of freedom -- WHERE ALONG THE PIPE -- so it slides,
	// which is what every GIS does with a road name and why the convention scales. Sideways is not
	// available: moving perpendicular means leaving the line, and a rotated label off its own pipe
	// is no longer saying which pipe it belongs to, which was the entire justification for dropping
	// its leader. So it is not a participant in the candidate pass; it is an OBSTACLE that
	// everything else goes round, committed here rather than scored there.
	//
	// LONGEST PIPE FIRST is deliberate. Whoever is placed first gets the middle, and a long pipe has
	// the most room to give up later while still reading as "this pipe"; a short pipe has almost no
	// usable stations, so making it choose last is making it choose from nothing. It also makes the
	// pass STABLE -- the order does not depend on anything the user can change by clicking.
	// Does this box have the map to itself? Oriented, since Task 379: an aligned label's box turns
	// with its pipe, and the axis-aligned box around a diagonal one is up to 5.2x its own area, all
	// of it ground the label does not occupy.
	function boxIsClear(b, obs, pad) {
		var grown = Collide.box(b.cx, b.cy, b.w + 2 * pad, b.h + 2 * pad, b.a);
		return !obs.boxes.some(function (o) { return Collide.boxOverlapDepth(grown, o) > 0; });
	}
	function stationedLabelBox(l, le, along, w, h, fs, force) {
		if (linkLabelAligned(l)) {
			var ap = alignedLabelPlacement(l, le, along, force);
			return Geom.orientedLabelBox(ap.ax, ap.ay, w, h, 'middle', 'top', ap.angle, fs);
		}
		var mid = linkLabelMid(l, along), d = defaultLabelOffset();
		return Collide.boxFromRect({ x: mid.x + d.x, y: mid.y + d.y - fs * 0.85, w: w, h: h });
	}
	// **A REPEATED CHAIN IS IN THE SAME CATEGORY AS AN ALIGNED LABEL, AND FOR THE SAME REASON**
	// (extended 2026-08-15 for Tom's repeat spec). Both have spent their freedom: an aligned label
	// gave up sideways movement by lying on its pipe, and a chain gave up its station by being
	// evenly spaced -- move one link of the chain and the regular spacing that makes it read as one
	// repeated name is gone.
	function placeStationedLabels(list, obs, fs) {
		var pad = fs * LPN_ALIGNED_PAD_FRAC;
		list.map(function (l) {
			return { l: l, len: Geom.polylineLength(linkPointList(l)) };
		}).sort(function (a, b) { return b.len - a.len; }).forEach(function (rec) {
			var l = rec.l, le = linkEls[l.id];
			if (!le || le.empty) { if (le) { le.alignedAlong = undefined; } return; }
			// The boxes are for the stations that are actually DRAWN, so the indices here line up
			// with layoutLinkLabel()'s -- that is what lets le.stationSides carry a decision made
			// here into the render. Whether this is a lone label or a chain is decided by the FULL
			// station list, though: a chain whose other links are off-screen is still a chain and
			// must not start sliding.
			var w = labelBoxWidth(le), h = dataLabelBoxHeight(le.lineCount),
				full = linkLabelStations(l),
				stations = full.length === 1 ? full : drawnLinkLabelStations(l), boxes = [],
				best = null, bestBox = null, i, ap, b, clear, forced, natural, other;
			if (linkLabelAligned(l) && full.length === 1) {
				// THE SLIDE, which only a lone label gets.
				for (i = 0; i < LPN_ALIGNED_STATIONS.length; i++) {
					ap = alignedLabelPlacement(l, le, LPN_ALIGNED_STATIONS[i]);
					b = Geom.orientedLabelBox(ap.ax, ap.ay, w, h, 'middle', 'top', ap.angle, fs);
					clear = boxIsClear(b, obs, pad);
					// The FIRST clear station wins and the search stops -- it is already the most
					// central one available, because the list is ordered outward from the middle.
					if (clear) { best = LPN_ALIGNED_STATIONS[i]; bestBox = b; break; }
					if (!bestBox) { bestBox = b; best = LPN_ALIGNED_STATIONS[i]; } // fall back to the middle
				}
				le.alignedAlong = best;
				le.forceSide = undefined;
				le.stationSides = [];
				boxes.push(bestBox);
			} else {
				// A chain's stations are fixed by the spacing rule, so there is nothing to search
				// ALONG. What is still free is the SIDE of the pipe each link of the chain sits on
				// (Tom: "I assume that side can still be nudged?"). Each station keeps the side the
				// clearance rule chose unless that box is blocked and the other side is not -- so a
				// chain can step round an obstacle without ever losing its even spacing.
				le.alignedAlong = undefined;
				le.stationSides = [];
				for (i = 0; i < stations.length; i++) {
					b = stationedLabelBox(l, le, stations[i], w, h, fs);
					// RESET EVERY ITERATION. `var` is function-scoped, so a flip decided for one
					// station would otherwise carry into the next one and put a label on the wrong
					// side of a pipe nothing was blocking.
					forced = undefined;
					if (linkLabelAligned(l) && !boxIsClear(b, obs, pad)) {
						natural = alignedLabelPlacement(l, le, stations[i]).side;
						other = stationedLabelBox(l, le, stations[i], w, h, fs, -natural);
						if (boxIsClear(other, obs, pad)) { b = other; forced = -natural; }
					}
					le.stationSides[i] = forced;
					boxes.push(b);
				}
			}
			// Committed as obstacles for everyone placed after -- including the node and Text
			// labels the candidate pass is about to place.
			boxes.forEach(function (bx) { bx.kind = 'label'; obs.boxes.push(bx); });
		});
	}
	// **DRAW THE BOXES THE PLACEMENT PASS IS ACTUALLY REASONING ABOUT** (Tom, 2026-08-15: *"Would it
	// be possible for you to depict these imaginary boxes temporarily?"*). Add `?debug=boxes` to the
	// page URL and every box goes on screen in the colour of what it is; leave it off and this
	// function is one comparison and a return.
	//
	// A URL PARAMETER RATHER THAN A CHECKBOX, deliberately: a settings checkbox is a translated
	// string in 27 files and a permanent line in a panel, for a tool that exists to review one
	// algorithm. The address bar costs nothing and disappears on the next reload.
	function debugBoxesOn() {
		return typeof location !== 'undefined' && /(\?|&)debug=boxes(&|$)/.test(location.search || '');
	}
	// ---- ?debug=labels : a bench for the placement pass (Tom, 2026-08-16) -----------------------
	//
	// *"It might be good for you to give me a dev control panel for this so that I can play with
	// radius (in terms of text size per settings; text heights), rank scores, and any other
	// judgments that could affect this. I would like to ensure that it's really working and be able
	// to push buttons as I test."*
	//
	// A URL PARAMETER AND NOT A SETTINGS SECTION, for the same reason ?debug=boxes is one: a panel
	// in Settings is a translated string in 27 files and a permanent line in a UI, for a tool whose
	// whole purpose is to review one algorithm before its numbers are fixed. `?debug=labels` turns
	// it on, `?debug=labels,boxes` turns both on, and neither ships to anybody who does not type it.
	//
	// **REACH IS SHOWN IN LABEL HEIGHTS, WHICH IS THE UNIT TOM ASKED FOR AND THE UNIT THAT MEANS
	// SOMETHING.** It used to be 28 SCREEN PIXELS, which turned out to be smaller than a label, so
	// no candidate could ever clear a conflict. A pixel count also silently changes meaning when the
	// text size does. Everything here is a multiple of the label's own size and nothing is absolute.
	//
	// The weights are the RANKS. Editing them is how to find out whether the order in
	// dev/label-placement-goals.md is really the order Tom wants -- they are written straight into
	// Collide.GOAL_WEIGHT, which is the one table the scorer reads.
	function debugOn(name) {
		if (typeof location === 'undefined') { return false; }
		var m = /(?:\?|&)debug=([^&]*)/.exec(location.search || '');
		return !!m && m[1].split(',').indexOf(name) >= 0;
	}
	// Defaults live HERE and nowhere else, so the panel and the shipped page cannot disagree about
	// what the shipped value is -- the panel starts by showing exactly what a visitor gets.
	var labelTune = null;
	// "45,30,15" -> [45, 30, 15]. A step that does not divide 360, or is not a multiple of 15, would
	// put a leader off the shared grid, so it is refused rather than rounded.
	function parseRingSteps(text) {
		return String(text).split(',').map(function (x) { return parseFloat(x); })
			.filter(function (v) { return isFinite(v) && v >= 15 && v <= 180 && v % 15 === 0 && 360 % v === 0; });
	}
	function labelTuning() {
		if (!labelTune) {
			labelTune = { reach: LPN_REACH_TEXT_HEIGHTS, inner: LPN_INNER_TEXT_HEIGHTS,
				steps: LPN_RING_STEPS.join(','), k: LPN_NEIGHBOUR_K,
				fitRoom: FIT_LABEL_ROOM_TEXT_HEIGHTS };
		}
		return labelTune;
	}
	function labelDebugReport(labels, obs, placed, before) {
		drawCollisionBoxes(obs.boxes.slice(before), obs);
		if (!debugOn('labels')) { return; }
		// The COUNTS, because "that looks better" is not a verdict. Overlapping label pairs is the
		// one that matters (goal 2); mean travel is what it cost to get there.
		var boxes = obs.boxes.slice(before), i, j, pairs = 0, travel = 0;
		for (i = 0; i < boxes.length; i++) {
			for (j = i + 1; j < boxes.length; j++) {
				if (Collide.boxOverlapDepth(boxes[i], boxes[j]) > 0) { pairs++; }
			}
		}
		placed.forEach(function (r) { travel += Math.hypot(r.dx, r.dy); });
		var el2 = document.getElementById('lpn_label_bench_out');
		if (el2) {
			el2.textContent = labels.length + ' labels \u2022 ' + pairs + ' overlapping pairs \u2022 mean travel '
				+ (placed.length ? (travel / placed.length * (state.s || 1)).toFixed(1) : '0') + ' px';
		}
	}
	function buildLabelBench() {
		if (!debugOn('labels') || document.getElementById('lpn_label_bench')) { return; }
		var t = labelTuning(), box = document.createElement('div');
		box.id = 'lpn_label_bench';
		box.className = 'd-print-none';
		box.setAttribute('style', 'position:fixed;right:8px;bottom:8px;z-index:35;background:#fff;'
			+ 'border:1px solid #333;padding:8px;font:12px/1.4 monospace;box-shadow:2px 2px 6px rgba(0,0,0,.3);'
			+ 'max-height:70vh;overflow:auto');
		function row(label, get, set, step, hint) {
			var l = document.createElement('label'), i = document.createElement('input');
			l.setAttribute('style', 'display:flex;justify-content:space-between;gap:8px;align-items:center');
			l.appendChild(document.createTextNode(label));
			i.type = 'number'; i.step = String(step); i.value = String(get());
			i.setAttribute('style', 'width:6em');
			if (hint) { i.title = hint; }
			i.addEventListener('change', function () {
				var v = parseFloat(i.value);
				if (isFinite(v)) { set(v); refreshLabelText(); }
			});
			l.appendChild(i);
			box.appendChild(l);
		}
		function textRow(label, get, set, hint) {
			var l = document.createElement('label'), i = document.createElement('input');
			l.setAttribute('style', 'display:flex;justify-content:space-between;gap:8px;align-items:center');
			l.appendChild(document.createTextNode(label));
			i.type = 'text'; i.value = get();
			i.setAttribute('style', 'width:6em');
			if (hint) { i.title = hint; }
			i.addEventListener('change', function () {
				if (parseRingSteps(i.value).length) { set(i.value); refreshLabelText(); }
				else { i.value = get(); }
			});
			l.appendChild(i);
			box.appendChild(l);
		}
		var h = document.createElement('div');
		h.setAttribute('style', 'font-weight:bold;margin-bottom:4px');
		h.textContent = 'label placement bench';
		box.appendChild(h);
		row('reach (text heights)', function () { return t.reach; },
			function (v) { t.reach = v; }, 1, 'How far out the furthest ring sits, in multiples of the current text size. One number for the whole map.');
		row('inner ring (text heights)', function () { return t.inner; },
			function (v) { t.inner = v; }, 0.5, 'The nearest circle. About one label wide is the smallest step that can clear a neighbour.');
		textRow('angle step per circle', function () { return t.steps; },
			function (v) { t.steps = v; },
			'One angular step per circle, innermost first, comma separated. How many you type is how many circles there are. 45,30,15 gives 4, 8 and 20 directions \u2014 orthogonal directions are always dropped.');
		// LABELLED, not just named. Tom, 2026-08-16: *"Is k the coefficient on the neighbors? I may
		// need a word or two of labeling."* It is, so the panel says so and shows the formula rather
		// than making anyone infer it from a single letter.
		row('elbow room (k)', function () { return t.k; },
			function (v) { t.k = v; }, 0.05,
			'Goal 11, the coefficient on the neighbours. A spot is scored as itself PLUS k times the '
			+ 'average score of the spots around it, so a spot with room beside it beats an equally '
			+ 'clear one hemmed in. 0 = judge every spot alone. 1 = its surroundings matter as much '
			+ 'as the spot itself.');
		row('zoom-to-fit room (text heights)', function () { return t.fitRoom; },
			function (v) { t.fitRoom = v; }, 1, 'Extra room left on Zoom to fit\u2019s FIRST pass, before labels are placed. Bigger = the first pass sits further out, so labels land more comfortably at the final zoom. Press Zoom to fit to see it.');
		var g = document.createElement('div');
		g.setAttribute('style', 'margin-top:6px;border-top:1px solid #ccc;padding-top:4px');
		g.textContent = 'rank weights';
		box.appendChild(g);
		Object.keys(Collide.GOAL_WEIGHT).forEach(function (key) {
			row(key, function () { return Collide.GOAL_WEIGHT[key]; },
				function (v) { Collide.GOAL_WEIGHT[key] = v; }, 0.01);
		});
		var eq = document.createElement('div');
		eq.setAttribute('style', 'margin-top:2px;opacity:.7;font-size:11px');
		eq.textContent = 'score = spot + k \u00d7 mean(neighbours)';
		box.appendChild(eq);
		var out = document.createElement('div');
		out.id = 'lpn_label_bench_out';
		out.setAttribute('style', 'margin-top:6px;border-top:1px solid #ccc;padding-top:4px');
		box.appendChild(out);
		var btns = document.createElement('div');
		btns.setAttribute('style', 'margin-top:6px;display:flex;gap:6px');
		function btn(text, fn) {
			var b = document.createElement('button');
			b.type = 'button'; b.textContent = text;
			b.addEventListener('click', fn);
			btns.appendChild(b);
		}
		btn('re-run', function () { refreshLabelText(); });
		// The fit room only shows itself on a fit, so the bench offers one rather than making Tom
		// hunt for the menu item between every adjustment.
		btn('zoom to fit', zoomExtent);   // by reference, exactly as the toolbar button wires it
		btn('defaults', function () {
			labelTune = null;
			Object.keys(LPN_GOAL_WEIGHT_SHIPPED).forEach(function (key) {
				Collide.GOAL_WEIGHT[key] = LPN_GOAL_WEIGHT_SHIPPED[key];
			});
			document.getElementById('lpn_label_bench').remove();
			buildLabelBench();
			refreshLabelText();
		});
		box.appendChild(btns);
		document.body.appendChild(box);
	}
	// The shipped ranks, copied once at load so "defaults" restores them after any amount of
	// fiddling. Read from the module rather than restated, so it cannot drift from the real table.
	var LPN_GOAL_WEIGHT_SHIPPED = JSON.parse(JSON.stringify(Collide.GOAL_WEIGHT));
	function drawCollisionBoxes(placed, obs) {
		if (!debugBoxLayer) { return; }
		while (debugBoxLayer.firstChild) { debugBoxLayer.removeChild(debugBoxLayer.firstChild); }
		if (!debugBoxesOn()) { return; }
		// POLYGONS, NOT RECTS, because the boxes turn now (Task 379). A rect could only ever draw
		// the axis-aligned approximation -- the very thing the oriented boxes replaced -- so the
		// picture would show a shape the pass is no longer reasoning about.
		function draw(list, colour) {
			list.forEach(function (b) {
				el('polygon', {
					points: Collide.boxCorners(b).map(function (c) { return c.x + ',' + c.y; }).join(' '),
					fill: 'none', stroke: colour, 'stroke-width': 1 / state.s,
					'pointer-events': 'none'
				}, debugBoxLayer);
			});
		}
		// The three colours answer the three questions the pictures raise: what was placed (blue),
		// what it had to go round (green), and which lines are obstacles (red).
		draw(obs.boxes.filter(function (b) { return placed.indexOf(b) < 0; }), '#0a0');
		obs.segments.forEach(function (seg) {
			el('line', {
				x1: seg.ax, y1: seg.ay, x2: seg.bx, y2: seg.by,
				stroke: '#d00', 'stroke-width': 2 / state.s, 'stroke-opacity': 0.5,
				'pointer-events': 'none'
			}, debugBoxLayer);
		});
		draw(placed, '#00d');
	}
	function runLabelCollisionAvoidance() {
		var fs = effectiveFontSize(), labels = [], stationed = [], obs = staticObstacles(),
			holders = {};
		function addDataLabel(key, holder, anchor, home, dragged, lineCount) {
			// Every nudge is cleared and re-derived from scratch on every pass, dragged or not, so
			// the pass is IDEMPOTENT: running it twice on an unchanged drawing gives the same answer
			// as running it once. Keeping the previous nudge and searching from there is what made
			// the old relaxation accumulate drift on every frame of a drag.
			holder.nudge = { x: 0, y: 0 };
			holder.nudgeManual = !!dragged;
			if (holder.empty) { return; }   // nothing rendered -- no box to place
			holders[key] = holder;
			labels.push({
				id: key, anchor: anchor, home: home, dragged: !!dragged,
				w: labelBoxWidth(holder), h: dataLabelBoxHeight(lineCount), yOff: -fs * 0.85
			});
		}
		doc.nodes.forEach(function (n) {
			var ne = nodeEls[n.id]; if (!ne) { return; }
			addDataLabel(nodeLabelKey(n.id), ne, { x: n.x, y: n.y }, nodeLabelBase(n),
				n.lx !== undefined, ne.lineCount);
		});
		doc.links.forEach(function (l) {
			var le = linkEls[l.id]; if (!le) { return; }
			// A label nobody can see is not an obstacle. Skipping it here also clears its nudge, so
			// zooming back in restores it where it belongs rather than where it was last pushed.
			if (linkLabelTooShort(l, le)) { le.nudge = { x: 0, y: 0 }; return; }
			// **AN ALIGNED LABEL OR A REPEATED CHAIN DOES NOT MOVE, BUT IT IS STILL IN THE WAY**
			// (fixed 2026-08-14, Tom: "This conflict between pipe labels could and should have been
			// avoided"). It goes to placeStationedLabels(), which commits it as an obstacle at the
			// placement the drawing really uses, rotated as it is really drawn. The nudge is cleared
			// for it too: a nudge is measured from the half-way point, and a chain is not drawn
			// there.
			if (linkLabelAligned(l) || linkLabelStations(l).length > 1) {
				stationed.push(l); le.nudge = { x: 0, y: 0 }; return;
			}
			addDataLabel(linkLabelKey(l.id), le, linkLabelMid(l), linkLabelBase(l),
				l.lx !== undefined, le.lineCount);
		});
		// Stationed labels first: they have already spent their freedom, so everyone else should see
		// where they are before choosing.
		placeStationedLabels(stationed, obs, fs);
		// Every number the pass is steered by goes through ONE place, so ?debug=labels can override
		// them live without a second code path deciding anything (see labelTuning()).
		var t = labelTuning(),
			before = obs.boxes.length,
			placed = Collide.placeLabels(labels, obs, {
				inner: t.inner * fs, outer: t.reach * fs,
				steps: parseRingSteps(t.steps), k: t.k
			});
		placed.forEach(function (r) {
			var h = holders[r.id];
			if (h) { h.nudge = { x: r.dx, y: r.dy }; }
		});
		labelDebugReport(labels, obs, placed, before);
	}
	// Rebuilds a <text> element's tspans from scratch -- simplest correct approach given the line
	// count changes every time a label toggle is flipped.
	//
	// `rows` is an array of ROWS, and a row is an array of SEGMENTS: a label is normally ONE row
	// carrying several values. The first segment of each row repeats the same x (not a relative dx)
	// so every row stays anchor-aligned under the first, which is the standard SVG multi-line-text
	// idiom; every later segment in a row carries NO x, which is what makes it flow inline after
	// its predecessor.
	//
	// THE EXTREMA MARK IS THE SEGMENT'S OWN text-decoration, never a separate badge, and the reason
	// is structural rather than a matter of taste. A badge hung off the end of a number has to be
	// POSITIONED: measure the digits (getComputedTextLength()), know which row they are on, inherit
	// the label's transform, and be torn down and rebuilt whenever any of that moves. Every one of
	// those was a real bug -- orphaned glyphs beside a rotated label, a badge left behind by a
	// deleted pipe, a footprint four other things measured wrongly. A text-decoration is drawn by
	// the text engine at the exact extent of the characters it marks, at any rotation, in any row,
	// for free. It is unambiguous only because each value carries a PREFIX naming its quantity and
	// the values sit on one line; on a bare number in a stack of bare numbers it was not.
	//
	// Set as a presentation ATTRIBUTE rather than only a class: text-decoration on a tspan is SVG
	// 1.1, and an attribute needs no stylesheet to have loaded. The class rides along for anyone
	// who wants to restyle it.
	function setMultilineText(textEl, x, rows) {
		while (textEl.firstChild) { textEl.removeChild(textEl.firstChild); }
		rows.forEach(function (row, i) {
			row.forEach(function (seg, j) {
				// **dy IN `em`, NOT IN WORLD UNITS.** An em is resolved against the element's own
				// font-size, so line spacing follows a zoom by itself and the tspans never have to
				// be rebuilt for one. In world units this attribute was stale the instant the scale
				// changed, which is why every zoom used to run the whole of refreshLabelText().
				// 1.2 is effectiveLineHeight()'s own multiple of the font size, in one place now.
				var tspan = el('tspan', j === 0 ? { x: x, dy: i === 0 ? 0 : '1.2em' } : {}, textEl);
				if (seg.decoration) {
					tspan.setAttribute('text-decoration', seg.decoration === 'high' ? 'overline' : 'underline');
					tspan.setAttribute('class', seg.decoration === 'high' ? 'lpn-max' : 'lpn-min');
				}
				tspan.textContent = seg.text;
			});
		});
	}
	// The width every consumer of a data label's box should use. `holder` is nodeEls[id]/linkEls[id].
	//
	// It is now just the text, and that is the POINT of Task 333's extrema change rather than a
	// simplification made in passing. This used to be max(text, badge reach), because the old
	// chevron badge hung off the END of a decorated number and so stuck out past the <text>'s own
	// bbox -- a fact four separate consumers (leader attachment, collision boxes, the label box,
	// zoom-to-fit) each had to be taught, and each got wrong first (ROADMAP Task 298). An
	// underline/overline is drawn INSIDE the glyph box by the text engine, so the text's bbox is
	// the whole footprint again, by construction and for every consumer at once.
	function labelBoxWidth(holder) {
		// **MEASURED ONCE PER CONTENT CHANGE, RESCALED ARITHMETICALLY EVER AFTER.** A label's width
		// in PIXELS does not change with the zoom (Task 331), so its width in WORLD units is just
		// that pixel figure divided by the scale -- and every getBBox() saved is a forced synchronous
		// layout not performed. Net3 has ~220 labels; re-measuring them on every wheel notch was a
		// quarter of a second per notch (Tom, 2026-08-15).
		if (holder.twPx) { return holder.twPx / (state.s || 1); }
		return holder.tw || 0;
	}
	// The other half of the pair: call this instead of writing `.tw` from a getBBox() result, and the
	// pixel figure is banked at the same time. `worldWidth` is what getBBox() just returned.
	function noteMeasuredWidth(holder, worldWidth) {
		holder.tw = worldWidth;
		holder.twPx = worldWidth * (state.s || 1);
	}
	// Text labels keep their measured width on `.width` rather than `.tw` -- same rule, same reason.
	function textLabelWidth(le) {
		if (le && le.widthPx) { return le.widthPx / (state.s || 1); }
		return (le && le.width) || 0;
	}
	function noteTextWidth(le, worldWidth) {
		le.width = worldWidth;
		le.widthPx = worldWidth * (state.s || 1);
	}
	// Repositions an already-built multi-line label (drag/geometry updates) without touching its
	// content -- setMultilineText() gives each ROW's first tspan its own explicit x (needed for the
	// multi-line stacking idiom), so moving the parent <text>'s x/y alone would leave old tspans
	// stranded at the previous position; every row's x must move with it.
	//
	// ONLY the tspans that already HAVE an x are moved. Since Task 333 a row can hold several
	// segments, and every segment after the first deliberately carries no x -- that absence is what
	// makes it flow inline after its predecessor. Writing an x onto those would stack the whole
	// line on top of itself at one point.
	function repositionMultilineText(textEl, x, y) {
		textEl.setAttribute('x', x); textEl.setAttribute('y', y);
		var i, child;
		for (i = 0; i < textEl.childNodes.length; i++) {
			child = textEl.childNodes[i];
			// Element children only (tspans, from setMultilineText()) -- a freshly built node/link
			// label (Task 146.01's layoutNodeLabel()/layoutLinkLabel(), called before the first
			// refreshLabelText() pass converts it) still holds a single plain text node from its
			// initial textContent assignment, which has no setAttribute.
			if (child.nodeType === 1 && child.getAttribute('x') != null) { child.setAttribute('x', x); }
		}
	}
	// Network-wide max/min of a field's values, skipping undefined (element types that don't carry
	// it, or a solve result not yet available). Returns null when fewer than 3 defined values exist
	// (Tom, 2026-07-30) -- with only 1 or 2 members "the max" and "the min" aren't a finding, just
	// the two ends of a trivial set (with 1, the same value would be both at once).
	// DO NOT ADD A TIE RULE HERE. Suppressing the mark when many elements share an end has been
	// proposed and reverted twice (Tom, 2026-08-15 and again 2026-08-16): it costs code and comment
	// for a cosmetic gain, and a mark that vanishes once enough elements agree is MORE confusing to
	// a user than a shared mark, because nothing on screen explains why it went. The rule is the
	// plain one -- an element holding the extreme value is marked, however many others do too.
	function fieldExtrema(values) {
		var defined = values.filter(function (v) { return typeof v === 'number'; });
		if (defined.length < 3) { return null; }
		return { min: Math.min.apply(null, defined), max: Math.max.apply(null, defined) };
	}
	// 'high'/'low', not a boolean -- every member of a tie is marked, not just the first found,
	// since each element is judged independently against the same extrema.
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

	// The document. nodes: Junction/Reservoir/Tank (point elements). links: Pipe/Pump (two
	// endpoints + optional bend vertices). labels: Text elements with a leader to an
	// anchor node, OR a free-floating text with anchorNode === null.
	var doc = { nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } };

	// The structural ID letters. These are LOOKUP KEYS into nextId and settings.idPrefixes, not the
	// text an ID starts with -- that is settings.idPrefixes[key], which the user can change and
	// which merely defaults to the key itself.
	//
	// TEXT MOVED FROM 'T' TO 'X' WHEN TANKS ARRIVED (Task 248, 2026-08-14), because EPANET's tanks
	// are T1, T2 and a reader of the map should see that. Text was the one element that could give
	// the letter up for free: its ID is unreachable from every screen in the app (the settings row
	// for it was removed in Task 146 for exactly that reason), so nothing a user can see changed.
	// An OLD document is not migrated and does not need to be -- its text elements keep their T3
	// ids, recountNextId() counts them against the tank counter, and mintId() refuses to reissue an
	// id that is already taken. So the worst case is a first tank numbered T4, never a collision.
	// V is the valve (Task 248 phase 2, 2026-08-14) -- EPANET's own default letter for one, so an
	// imported V1 keeps its name and a drawn one reads the way a modeller expects.
	var LPN_ID_KEY = { junction: 'J', reservoir: 'R', tank: 'T', pipe: 'L', pump: 'P', valve: 'V', text: 'X' };
	function newNextId() { return { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 }; }
	var nextId = newNextId();
	// Re-derive the counters from the ids actually present. Matches against the CURRENT
	// settings.idPrefixes, not a hardcoded single-uppercase-letter regex (Task 146 gear panel,
	// 2026-07-30) -- a customized prefix can be any non-empty, space/quote-free string
	// (validatePrefix()), not necessarily one letter. Known limitation, not worth guarding further:
	// an element created under a PRIOR prefix (before the user renamed it mid-session) won't be
	// matched here after a prefix rename, so a counter could under-count for that letter. Starting
	// at 1 per key is already the safe floor, and mintId() below is the actual guarantee.
	function recountNextId() {
		nextId = newNextId();
		doc.nodes.concat(doc.links, doc.labels).forEach(function (x) {
			Object.keys(settings.idPrefixes).forEach(function (key) {
				var p = settings.idPrefixes[key] || key, rest = String(x.id).indexOf(p) === 0 ? String(x.id).slice(p.length) : null;
				if (rest !== null && /^\d+$/.test(rest) && nextId[key] !== undefined) { nextId[key] = Math.max(nextId[key], +rest + 1); }
			});
		});
	}
	// The ONE place an id is generated. The counter is a hint, not the guarantee: it can be behind
	// after an undo, after an import, or after a prefix rename, and two prefixes can be set to the
	// same text by a user who is entitled to do that. So the id is checked against every id in the
	// document and the counter walks forward until it is free.
	function mintId(key) {
		var prefix = settings.idPrefixes[key] || key, used = {}, id;
		allIds().forEach(function (x) { used[x] = 1; });
		if (nextId[key] === undefined) { nextId[key] = 1; }
		do { id = prefix + (nextId[key]++); } while (used[id]);
		return id;
	}

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
	// `level` joined the node list when the scenario UI landed (Task 184): a tank's starting water
	// level is a design variable in exactly the way a reservoir's head is, and the two sit in the
	// same popup a row apart. Widening is the cheap direction, per the note above.
	var LPN_OVERRIDABLE = {
		node: { demand: true, emitter: true, head: true, level: true, active: true },
		// `setting` is a VALVE's setting (Task 248 phase 2). It belongs here for the same reason
		// demand does: "what if the pressure reducing valve is set to 50 psi" is an operating
		// question, which is what a scenario asks, where the valve's diameter is what was built.
		link: { diameter: true, roughness: true, k: true, status: true, length: true, setting: true, active: true }
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
		var ov = activeScenario().overrides[ovKey(el)];
		if (ov && Object.prototype.hasOwnProperty.call(ov, prop)) { return ov[prop]; }
		// `active` has no stored property yet (nothing sets it) -- its absence must read as true, not
		// undefined/falsy, so a topology no scenario has touched is never mistaken for inactive. This
		// is the one property effective() defaults itself, per the trap note in Task 146.08 step 2.
		if (prop === 'active' && el['_' + prop] === undefined) { return true; }
		return el['_' + prop];
	}
	// ---- the write side (ROADMAP Task 184's scenario UI, 2026-08-14) ----
	// THE MARKER IS THE KEY'S PRESENCE, and it records INTENT at edit time -- never a diff. Writing
	// overrides[ovKey(el)][prop] says "I set this deliberately, here"; deleting it is the undo. Both hold
	// when the value equals Base's, because a diff cannot tell "I chose this number for this
	// scenario" from "Base happens to agree today", and those two need opposite treatment the
	// moment Base moves.
	//
	// A LINK IS TOLD FROM A NODE BY `from`, not by a list of type names: another element type
	// (a valve) can arrive at any time, and a hardcoded type list would silently classify it as a
	// node and quietly refuse every override on it.
	function elGroup(el) { return (el && el.from !== undefined) ? 'link' : 'node'; }
	// THE OVERRIDE MAP'S KEY, and it carries the element's GROUP because an id alone does not
	// identify an element (ROADMAP Task 324). EPANET keeps nodes and links in SEPARATE namespaces,
	// so a junction 20 and a pipe 20 are both legal and both ordinary -- re-measured 2026-08-14 on
	// the files in dev/epanet-models/: Net1 has 7 ids that name both a node and a link, Net2 has 35,
	// Net3 has 72. Keyed by the bare id, a demand typed on junction 20 was read back by pipe 20:
	// the halo Tom saw ("a remote pipe changed to orange along with the node") was the harmless
	// half, and `active` -- which is on BOTH groups -- was the dangerous one, because switching a
	// junction off silently dropped an unrelated pipe out of the solve.
	//
	// ONE SEAM, so the format is stated once: every read, write, count, rename and purge goes
	// through ovKey()/ovKeyFor() and none of them spells 'n:' or 'l:' itself.
	function ovKey(el) { return ovKeyFor(elGroup(el), el && el.id); }
	function ovKeyFor(group, id) { return (group === 'link' ? 'l:' : 'n:') + id; }
	function isOverridable(el, prop) { return !!(LPN_OVERRIDABLE[elGroup(el)] || {})[prop]; }
	function inBaseScenario() { return !!activeScenario().isBase; }
	function hasOverride(el, prop) {
		var ov = activeScenario().overrides[ovKey(el)];
		return !!(ov && Object.prototype.hasOwnProperty.call(ov, prop));
	}
	// Base's OWN value for a property, ignoring whatever the active scenario says -- what the
	// popup shows beside an overridden field, and what clearing a marker returns the field to.
	function baseValue(el, prop) {
		if (prop === 'active' && el['_' + prop] === undefined) { return true; }
		return el['_' + prop];
	}
	function setOverride(el, prop, value) {
		if (!el || !isOverridable(el, prop) || inBaseScenario()) { return; }
		var scn = activeScenario(), key = ovKey(el);
		if (!scn.overrides[key]) { scn.overrides[key] = {}; }
		// UNDEFINED BECOMES NULL, and the asymmetry is the point. In Base, `undefined` is a perfectly
		// good way to say "no head typed" -- it means the same thing as the key being absent. In an
		// override map absence means something ELSE entirely: "inherit Base". So a blank-capable
		// field (a reservoir head cleared inside a scenario) stored as undefined said "inherit"
		// rather than "deliberately blank" -- and worse, JSON.stringify DROPS an undefined value, so
		// the override evaporated on the next save, undo snapshot or file write, all three of which
		// round-trip through it.
		//
		// Fixed at the seam rather than at the call site, so every future blank-capable field is
		// covered without anyone remembering: null survives JSON, and every existing consumer
		// already handles it -- reservoirHead() tests undefined/null/'', formatPropValue() returns
		// '', and unitNumberFieldBlank's own setter tests all three.
		scn.overrides[key][prop] = (value === undefined) ? null : value;
	}
	function clearOverride(el, prop) {
		var scn = activeScenario(), key = ovKey(el), ov = scn.overrides[key];
		if (!ov) { return; }
		delete ov[prop];
		// An empty map is dropped rather than left behind: the override COUNT is a sum of key
		// counts, and an element with an empty object still occupying the map would otherwise
		// read to any future reader as "this element is touched here", which is exactly the claim
		// the marker exists to make precisely.
		if (!Object.keys(ov).length) { delete scn.overrides[key]; }
	}
	// THE ONE WRITE SEAM every property editor goes through. In Base it writes the element (which
	// IS the propagation -- there is no push upward in the delta model); in a scenario it records
	// an override. A call site that writes `el._diameter` directly is therefore not merely
	// impolite: inside a scenario it silently edits Base under every other scenario at once.
	function setProp(el, prop, value) {
		if (!inBaseScenario() && isOverridable(el, prop)) { setOverride(el, prop, value); return; }
		el['_' + prop] = value;
	}
	function overrideCount(scn) {
		var total = 0;
		Object.keys(scn.overrides || {}).forEach(function (key) { total += Object.keys(scn.overrides[key]).length; });
		return total;
	}
	// Every scenario's overrides on one element -- what a Base-side deletion is about to destroy,
	// which is why it is counted before the confirm rather than after it.
	// TAKES A KEY, not an id: the caller is the one that knows whether it is holding a node or a
	// link, and an id on its own cannot say (Task 324). Passing the bare id here counted -- and
	// purged -- whichever element of the pair the map happened to have.
	function overrideCountForElement(key) {
		var total = 0;
		scenarios.forEach(function (s) {
			if (s.isBase || !s.overrides[key]) { return; }
			total += Object.keys(s.overrides[key]).length;
		});
		return total;
	}
	function purgeOverrides(key) {
		scenarios.forEach(function (s) { delete s.overrides[key]; });
	}

	// ---- the scenario selector, and its "what am I working on right now" readout ----
	// The count is the half that makes the question answerable at a glance (Task 184), and it is
	// only cheap to compute because a scenario IS its overrides -- there is no second document to
	// diff against.
	function scenarioDisplayName(s) {
		var pc = EngCalcs.pageConfig || {};
		// Base's stored name is the language-free literal 'Base' (defaultScenarios()); the word on
		// screen comes from the lang file, so a user's data never carries an English word.
		return s.isBase ? (pc.lpn_scenario_base || 'Base') : (s.name || '');
	}
	function refreshScenarioStatus() {
		var btn = document.getElementById('lpn_scenario_btn'), pc = EngCalcs.pageConfig || {};
		if (!btn) { return; }
		var scn = activeScenario();
		// Same "Label: value | Label: value" shape as the units readout beside it (refreshMapStatus),
		// and no plural agreement anywhere -- "Overrides: 1" needs no rule in any of the 27 languages.
		btn.textContent = (pc.lpn_scenario_label || 'Scenario') + ': ' + scenarioDisplayName(scn)
			+ ' | ' + (pc.lpn_scenario_overrides || 'Overrides') + ': ' + overrideCount(scn);
	}
	// Everything a scenario can change at once: which values the solve reads, which links are
	// dashed, which elements are greyed out, which carry a halo, and what an open popup shows.
	// A full rebuild rather than a targeted refresh, because a scenario switch can change every
	// element on the map and the cost is one buildDom on a network of a few hundred elements.
	function applyScenarioChange() {
		closePopup();
		buildDom();
		refreshSymbolSizes();
		refreshScenarioStatus();
		scheduleSolve();
		saveToStorage();
	}
	function switchScenario(id) {
		if (project.activeScenario === id) { return; }
		project.activeScenario = id;
		applyScenarioChange();
	}
	function newScenarioId() {
		var n = 1, used = {};
		scenarios.forEach(function (s) { used[s.id] = true; });
		while (used['s' + n]) { n++; }
		return 's' + n;
	}
	function createScenario(name) {
		var s = { id: newScenarioId(), name: name, overrides: {} };
		scenarios.push(s);
		project.activeScenario = s.id;
		applyScenarioChange();
		return s;
	}
	function deleteScenario(id) {
		var s = scenarioById(id);
		if (!s || s.isBase) { return; }
		scenarios = scenarios.filter(function (x) { return x.id !== id; });
		if (project.activeScenario === id) { project.activeScenario = baseScenario().id; }
		applyScenarioChange();
	}
	function scenarioById(id) {
		for (var i = 0; i < scenarios.length; i++) { if (scenarios[i].id === id) { return scenarios[i]; } }
		return null;
	}
	function openScenarioMenu(anchor) {
		var pc = EngCalcs.pageConfig || {}, rows = [], scn = activeScenario();
		scenarios.forEach(function (s) {
			rows.push({
				// A tick on the row you are already in, the way every view menu in this file's
				// neighbourhood marks a current choice. No icon column entry, so the marker cannot
				// be mistaken for a command's glyph.
				label: (s.id === scn.id ? '✓ ' : '  ') + scenarioDisplayName(s)
					+ (s.isBase ? '' : ' (' + overrideCount(s) + ')'),
				fn: function () { switchScenario(s.id); }
			});
		});
		rows.push({ separator: true });
		rows.push({
			icon: 'insert', label: pc.lpn_scenario_new || 'New scenario…',
			fn: function () {
				var suggested = (pc.lpn_scenario_new_name || 'Scenario {n}').replace('{n}', scenarios.length);
				var v = window.prompt(pc.lpn_scenario_prompt_name || 'Name for this scenario', suggested);
				if (v === null) { return; }
				v = v.trim();
				if (!v) { return; }
				saveUndoSnapshot();
				createScenario(v);
			}
		});
		rows.push({
			// Base cannot be renamed away: its name is not stored in the user's language and the
			// selector keys off isBase, so a rename here would rename nothing a user can see.
			icon: 'edit', label: pc.lpn_scenario_rename || 'Rename scenario…', disabled: scn.isBase,
			fn: function () {
				var v = window.prompt(pc.lpn_scenario_prompt_name || 'Name for this scenario', scn.name || '');
				if (v === null || !v.trim()) { return; }
				saveUndoSnapshot();
				scn.name = v.trim();
				refreshScenarioStatus();
				saveToStorage();
			}
		});
		rows.push({
			icon: 'close', label: pc.lpn_scenario_delete || 'Delete scenario', disabled: scn.isBase,
			fn: function () {
				// The count is the whole of the warning: a scenario holding nothing is worth no
				// question, and one holding forty values is worth a specific one.
				var msg = (pc.lpn_scenario_delete_confirm || 'Delete the scenario {name}, and the {n} values it holds? The drawing itself is not changed.')
					.replace('{name}', scenarioDisplayName(scn)).replace('{n}', overrideCount(scn));
				if (!window.confirm(msg)) { return; }
				saveUndoSnapshot();
				deleteScenario(scn.id);
			}
		});
		rows.push({ separator: true });
		rows.push({
			label: pc.lpn_scenario_push_btn || 'Apply Base values to all scenarios',
			tip: pc.lpn_scenario_push_tip,
			// BASE-LEVEL ONLY, and disabled rather than hidden so the vocabulary stays learnable
			// (the menu convention this file already follows). Run from inside a scenario the
			// action has no meaning: it pushes Base's values outward, and Base is not where you
			// are standing.
			disabled: !scn.isBase || scenarios.length < 2,
			// Wrapped, NOT passed by reference: pushBaseToScenarios() now takes an element to scope
			// itself to, and openMenu() calling fn(anything) would silently turn the all-elements
			// push into a push against whatever it happened to hand over.
			fn: function () { pushBaseToScenarios(); }
		});
		openMenu(anchor, rows);
	}
	// THE SELECTOR AND THE READOUT ARE ONE CONTROL, in the map's bottom status strip beside the
	// units. Task 184 asks for both -- "what am I working on right now", answered at a glance, and
	// a way to switch -- and a readout you can click is one thing to find rather than two. It sits
	// in the strip because that is where this page already answers continuous questions about the
	// state of the map (units, friction method, cursor position).
	function wireScenarioButton() {
		var btn = document.getElementById('lpn_scenario_btn');
		if (!btn) { return; }
		var pc = EngCalcs.pageConfig || {};
		if (pc.lpn_scenario_tip) { btn.title = pc.lpn_scenario_tip; btn.className += ' ec-help'; }
		// stopPropagation for the same reason every other menu opener in this file does it: the
		// document-level dismissal in wireTabs() would otherwise close the menu this click opens.
		btn.addEventListener('click', function (e) { e.stopPropagation(); openScenarioMenu(e.currentTarget); });
		refreshScenarioStatus();
	}

	// The property list BOTH pushes share -- the Settings panel's "apply starting values to every
	// element" and the scenario menu's "apply Base values to every scenario". Lifted out of
	// rebuildSettingsFields() when the second one arrived, rather than copied: the two must agree
	// about which properties exist, which elements physically carry them, and what each is called,
	// and a second copy of that list is a second thing to keep in step.
	// `applies` is what keeps a push physical rather than blindly per-field: a reservoir has no
	// demand, and a pump has no diameter/roughness/km, so neither is counted or touched.
	function pushSpecList() {
		var pc = EngCalcs.pageConfig || {};
		return [
			{ key: 'nodeElev', group: 'node', field: 'elev', label: pc.lpn_field_elev || 'Elevation',
				// Elevation is survey data, not an overridable design variable (LPN_OVERRIDABLE), so
				// it has no `prop` and the scenario push skips it. It stays in the Settings push,
				// which writes Base.
				applies: function () { return true; }, get: function (n) { return n.elev; }, set: function (n, v) { n.elev = v; } },
			{ key: 'demand', group: 'node', field: 'demand', prop: 'demand', label: pc.bpn_demand || 'Demand',
				applies: function (n) { return !isFixedHeadNode(n); }, get: function (n) { return effective(n, 'demand'); }, set: function (n, v) { n._demand = v; } },   // base-write: pushSpecList: the documented Base-level push, refused outside Base
			{ key: 'diameter', group: 'link', field: 'diameter', prop: 'diameter', label: pc.lpn_field_diameter || 'Diameter',
				applies: function (l) { return l.type !== 'pump'; }, get: function (l) { return effective(l, 'diameter'); }, set: function (l, v) { l._diameter = v; } },   // base-write: pushSpecList: the documented Base-level push, refused outside Base
			// PIPE-ONLY, not merely not-a-pump (Task 248 phase 2, carried into this shared list when
			// Task 184 lifted it out of rebuildSettingsFields): a valve is a zero-length link, so no
			// friction formula ever reads its roughness. Offering a default for it would be a
			// control with no effect.
			{ key: 'roughness', group: 'link', field: 'roughness', prop: 'roughness', label: roughnessLabel(),
				applies: function (l) { return l.type === 'pipe'; }, get: function (l) { return effective(l, 'roughness'); }, set: function (l, v) { l._roughness = v; } },   // base-write: pushSpecList: the documented Base-level push, refused outside Base
			{ key: 'k', group: 'link', field: 'km', prop: 'k', label: pc.lpn_field_km || 'Minor (local) loss coefficient, k',
				applies: function (l) { return l.type !== 'pump'; }, get: function (l) { return effective(l, 'k'); }, set: function (l, v) { l._k = v; } }   // base-write: pushSpecList: the documented Base-level push, refused outside Base
		];
	}
	// **THE DANGEROUS ACTION** (Task 184, and it stays -- Tom, 2026-07-30: "still needed for good
	// UX"). Base-side, it forces the displayed properties onto every scenario, ignoring their
	// markers. In the delta model "forcing Base's value onto a scenario" IS clearing that
	// scenario's override: the value then follows Base, and no stale marker is left claiming an
	// intent the user has just overruled. Writing Base's number in as a fresh override would leave
	// every scenario permanently pinned to today's Base value, which is the opposite of what a
	// push is for.
	//
	// SCOPED BY THE DISPLAYED LABELS, the same filter the Settings push uses: the Labels panel is
	// already a per-property checkbox list and is already on screen, so the user's own current view
	// defines the blast radius and this needs no property picker of its own.
	// `only` (ROADMAP Task 317, Tom 2026-08-14: "I assume that Apply Base values to all scenarios
	// will be fine-grained; each property or element -- maybe start only with the element level")
	// narrows the same action to ONE element. It is a parameter rather than a second function on
	// purpose: the counting, the naming, the finger-wag and the undo snapshot are already right
	// here, and a fork of them would drift silently -- nothing about a wrong count is visible until
	// somebody has already lost values by trusting it.
	// The element-scoped push is the SAFE and COMMON case ("I corrected P-12 in Base and want that
	// one correction everywhere"), which is why it lives in the element's own popup while the
	// all-elements version stays in the scenario menu where it is deliberately harder to reach.
	function pushBaseToScenarios(only) {
		var pc = EngCalcs.pageConfig || {};
		if (!inBaseScenario()) { return; }
		var key = only ? ovKey(only) : null, group = only ? elGroup(only) : null;
		// Scoped to ONE element, the other group's properties are not merely absent -- they are
		// nonsense. A node has no diameter, so counting one would produce a confirm naming
		// properties this element cannot hold, and "nothing displayed" would be reported when the
		// user is looking at three displayed labels.
		var active = pushSpecList().filter(function (s) {
			return s.prop && labelSettings[s.group][s.field] && (!group || s.group === group);
		});
		if (!active.length) {
			alert(pc.lpn_push_none_displayed || 'No default input is showing as a label right now, so there is nothing to apply. Turn on the labels for the properties you want in the Labels panel, then try again.');
			return;
		}
		// Counted, not estimated: how many overrides would actually be discarded. Zero says so in
		// its own words, because "nothing to push" and "pushed nothing" look identical afterwards.
		var hits = 0, touched = 0;
		// The one place the scope is applied, to both the count and the delete below -- they read
		// the same list, so a confirm can never promise a different blast radius from the one that
		// happens.
		function scopedKeys(s) { return key ? (s.overrides[key] ? [key] : []) : Object.keys(s.overrides); }
		scenarios.forEach(function (s) {
			if (s.isBase) { return; }
			var any = false;
			// Walks the map by KEY and matches on the property NAME only -- deliberately group-blind,
			// because no property in pushSpecList() exists on both groups (`active` is the only name
			// LPN_OVERRIDABLE shares, and it is not pushable). Task 324.
			scopedKeys(s).forEach(function (k) {
				active.forEach(function (spec) {
					if (Object.prototype.hasOwnProperty.call(s.overrides[k], spec.prop)) { hits++; any = true; }
				});
			});
			if (any) { touched++; }
		});
		if (!hits) { alert(pc.lpn_scenario_push_none || 'No scenario has its own value for any of these properties, so nothing would change.'); return; }
		// NAMES the properties as well as counting them, exactly as the Settings push does -- a
		// bare count leaves the user guessing which properties, and this action is not one to guess at.
		// NAMES THE ELEMENT when the push is scoped to one, reusing lpn_field_id ("ID") rather than
		// minting a key: it is a whole label meaning exactly this, which is the reuse rule, and a
		// scoped confirm that did not say WHICH element would be the one thing worth saying missing.
		var msg = (pc.lpn_scenario_push_confirm || 'Make every scenario use the Base values for these properties? Values those scenarios hold of their own are discarded. You can undo this.')
			+ (only ? '\n\n' + (pc.lpn_field_id || 'ID') + ': ' + only.id : '')
			+ '\n\n' + (pc.lpn_push_properties || 'Properties:') + ' ' + active.map(function (s) { return s.label; }).join(', ')
			+ '\n' + (pc.lpn_scenario_push_scenarios || 'Scenarios:') + ' ' + touched
			+ '\n' + (pc.lpn_scenario_push_values || 'Values discarded:') + ' ' + hits;
		if (!window.confirm(msg)) { return; }
		saveUndoSnapshot();
		scenarios.forEach(function (s) {
			if (s.isBase) { return; }
			scopedKeys(s).forEach(function (k) {
				active.forEach(function (spec) { delete s.overrides[k][spec.prop]; });
				if (!Object.keys(s.overrides[k]).length) { delete s.overrides[k]; }
			});
		});
		applyScenarioChange();
	}

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
			// Per-field PREFIX and SUFFIX text (ROADMAP Task 333, Tom 2026-08-15), and the one
			// blanket separator that sits between either of them and the number.
			//
			// EMPTY IS NOT THE SAME AS UNSET, which is why these maps ship EMPTY rather than
			// pre-filled with the defaults. A field with no entry here uses labelDefaultPrefix()
			// below, which is allowed to be dynamic -- roughness prints C, n or e depending on the
			// friction method currently selected, and a stored 'C' could not follow that. Typing an
			// empty box stores an empty string, which is a real answer meaning "no prefix" and is
			// honoured. So: undefined -> ask the default; '' -> print nothing.
			//
			// The separator is blanket, per Tom: "One blanket separator and individual prefixes and
			// postfixes, of course." It goes BETWEEN VALUES on a one-line label ('Q=120 V=3.1'),
			// which is what he asked for a day later; ', ' and ' | ' are the other two he named. A
			// prefix's own punctuation is part of the prefix string, so the defaults carry '='.
			prefix: { node: {}, link: {} },
			suffix: { node: {}, link: {} },
			separator: ' ',
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
			// Keyed by the same structural letters nextId already uses (LPN_ID_KEY) -- changing a
			// prefix only affects IDs generated AFTER the change; existing element IDs are never
			// live-renamed by a settings edit.
			idPrefixes: { J: 'J', R: 'R', T: 'T', L: 'L', P: 'P', V: 'V', X: 'X' },
			// Matches js/lpn-solver.js's own default -- see assembleModel(). No UI edits this since
			// 2026-07-30: nothing can create an emitter yet, so the control was a no-op (ROADMAP
			// Task 191, and the longer note in rebuildSettingsFields()).
			emitterExponent: 0.5,
			tolerance: 1e-9, // matches js/lpn-solver.js's own default relative-flow-change tol -- see runSolve()
			// 'native' (js/lpn-solver.js) or 'epanet' (the real EPANET engine as WASM,
			// js/lpn-epanet.js). The two agree to 1e-5..1e-3 m of head
			// (dev/lpn-spike/validate_epanet.js).
			//
			// NATIVE IS THE DEFAULT, BUT NOT BECAUSE IT IS FASTER -- it is not. This comment used
			// to assert that it was, on the strength of a measured 0.4 ms native solve and an
			// UNMEASURED assumption about the other side. dev/lpn-spike/engine-bench.js measured
			// it on 2026-08-14: EPANET's own solve is ~0.05 ms at this page's target and ~0.78 ms
			// at 201 nodes, where ours is 0.43 ms and 36 ms. EPANET wins at every size, by more as
			// the network grows.
			//
			// The real and only cost of EPANET is the ONE-TIME 663 KB module load, which is a
			// genuine cost on a slow connection and is why the default has not moved yet. See
			// ROADMAP Task 313 -- the per-solve gap that remains is our own .inp round trip, not
			// the engine.
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
			defaults: { nodeElev: null, demand: null, diameter: null, roughness: null, k: null,
				// Tank geometry (Task 248). Null here and filled by seedDefaultInputs(), same as
				// every other row -- which is also what migrates a document saved before tanks
				// existed, with no migration step of its own.
				tankLevel: null, tankMinLevel: null, tankMaxLevel: null, tankDiameter: null },
			// Open/closed state of the settings panel's collapsible sections, persisted so a user
			// who lives in Default inputs is not re-opening it every session. Default inputs starts
			// OPEN because it is the mode-switching section above; the other two are set-once.
			sectionsOpen: { idPrefixes: false, defaults: true, mapDisplay: false, colors: false, computation: false, files: false },
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
			// SCREEN PIXELS since Task 331 (2026-08-14) -- see effectiveFontSize() above for why
			// map units went away entirely. 11 px is a legible small label at any zoom, and unlike
			// the 20 map units it replaces it means the same thing on every network ever imported.
			textSize: 11,
			// Junction dot DIAMETER in screen pixels; every other symbol is drawn against it.
			// 7 keeps a dot readable next to 11 px lettering without swallowing it.
			symbolSize: 7,
			// Pipe stroke in screen pixels, independent of both (Tom: "decouple label, link, and
			// node size"). 2 is a line that reads as a pipe rather than a hairline or a road.
			linkWidth: 2,
			symbolOpacity: 1, // 0-1, applied to symbols only (never labels) -- see refreshSymbolSizes()
			backdropOpacity: 1, // 0-1, applied to the backdrop image -- the other half of the same control
			// Labels are drawn only when the visible map is at most this many LENGTH UNITS wide
			// (Tom, 2026-08-14: "you specify zoom threshold in terms of how many units wide the map
			// is"). null = always draw, which is the pre-Task-331 behaviour and the right default
			// because no single number is meaningful across networks 400 ft and 40 miles wide. The
			// settings panel captures it from the current view instead of asking anyone to guess.
			labelMaxWidth: null,
			// Draw a link's label ALONG its pipe, GIS-style, instead of horizontally beside it
			// (ROADMAP Task 329).
			alignPipeLabels: true,
			// **HOW FAR LEFT OF VERTICAL A LABEL MAY LEAN BEFORE IT TURNS 180 DEGREES**, in degrees.
			//
			// A label reads along a direction, and the reading direction may lean this many degrees
			// ANTICLOCKWISE of straight up before the label turns 180 degrees to stay readable. Up
			// always wins -- a near-vertical name reads bottom to top, as on every map.
			//
			// **"LEFT OF", NOT "PAST", AND NEVER A BARE ANGLE.** Past what, and in which direction,
			// is the ambiguity that shipped this number mirrored: it was once stated as a CARTESIAN
			// bearing (counter-clockwise, y up) while the renderer works in SVG's frame, where y is
			// DOWN and the same arithmetic runs CLOCKWISE. The tolerance landed on the wrong side of
			// vertical and every near-vertical pipe rendered reading top-to-bottom. Phrased as
			// "degrees left of vertical" there is no frame left to get wrong, which is why the
			// PARAMETER changed and not just its value.
			// A project carrying the old key gets this default; the old key never survived a review.
			labelFlipLeftOfVertical: 20,
			// Draw the pale background patch behind every label (ROADMAP Task 330). ON, which is
			// what the page has always done and what keeps a label legible over a backdrop image --
			// the control exists because a clean drawing with no backdrop reads better without the
			// patches, which is a judgement about the sheet and therefore the user's to make.
			maskLabels: true,
			// LAST ENTRY. `mapHeight` used to follow this one and was removed 2026-08-14 -- see
			// LPN_MAP_MIN for why. Same shape as `fileAutosaveSeconds` below: a saved document may
			// still carry it, and applySaved() merges onto these defaults, so it rides along unread.
			legendPosition: 'top-right', // one of LEGEND_POSITIONS' keys below -- matches the original hardcoded CSS
			// ---- colour by value (Task 384) ----
			// FLAT KEYS, not one nested `colors` object, and that is load-bearing: applySaved()
			// merges a saved settings object onto these defaults with a TOP-LEVEL Object.assign and
			// hand-lists the three nested objects it merges a level deeper. A fourth nested object
			// would come back from an older save missing every key added after it was written. Flat
			// keys pick up new defaults for free.
			// OFF by default. The base drawing is black linework on purpose (css/engcalcs.css), and
			// colouring is a mode the user enters, never the state they are handed -- Task 327's
			// whole argument against EPANET is that it has only the coloured mode.
			colorNodeField: '',   // '' = none, else a key of COLOR_NODE_FIELDS
			colorLinkField: '',   // '' = none, else a key of COLOR_LINK_FIELDS
			colorRamp: 'epanet',  // a key of COLOR_RAMPS
			colorReverse: false,
			// Task 327's thematic map: colour is the whole message, so the labels come off. One CSS
			// class; it never touches labelSettings -- see applyThematicMode().
			colorThematic: false,
			// The colour key's own corner, separate from the labels legend's so the two do not
			// stack on top of each other. Opposite default corner for the same reason.
			colorLegendPosition: 'bottom-right',
			// PINNED break values, keyed 'node.pressure' / 'link.velocity', each an array of up to
			// four numbers IN THE DISPLAY UNIT. Empty/absent means automatic (equal intervals over
			// whatever is on the map now) -- see effectiveBreaks(). A whole saved object replacing
			// this one is correct: these are the user's numbers and a missing field simply reads as
			// automatic, so it needs no per-key merge.
			colorBreaks: {}
			// `fileAutosaveSeconds` was removed by Task 211 along with autosave-to-file itself. A saved
			// document may still carry one; applySaved() merges the save ONTO these defaults, so a
			// stale key is simply carried along and never read, and needs no migration step.
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
		// A TANK'S FOUR NUMBERS ARE ALL VERTICAL DISTANCES IN THE ELEVATION/HEAD UNIT, the vessel
		// diameter included -- EPANET's own convention, and the one that catches people out, since
		// a PIPE diameter two rows up is in inches or millimetres. Numbers chosen to describe an
		// ordinary municipal storage tank -- roughly 15 m across and 9 m tall, sitting about
		// two-thirds full -- so that a tank dropped on the map without being opened is a plausible
		// design rather than a shape that has to be fixed before the network will read sensibly.
		fill('tankLevel', niceDefault('lpn_u_elevhead', 'fth2o', 20, 6));
		fill('tankMinLevel', 0);
		fill('tankMaxLevel', niceDefault('lpn_u_elevhead', 'fth2o', 30, 9));
		fill('tankDiameter', niceDefault('lpn_u_elevhead', 'fth2o', 50, 15));
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

	// THERE ARE NO PER-FIELD LABEL COLOURS ANY MORE (ROADMAP Task 333, Tom 2026-08-15: "No more
	// label colors"). Every data label draws in the map's one text colour and says which quantity
	// it is with a PREFIX instead (labelPrefixFor() below).
	//
	// The trade is the same one that turned pumps and reservoirs black: colour is a budget, and it
	// is being saved for MEANING (Task 327's colour-by-value view), not spent on identity. A prefix
	// also survives greyscale, a printed sheet and a colour-blind reader -- none of which the old
	// colour key did, and the key itself was only ever readable beside the legend, so a number on a
	// map handed to someone else was unattributed either way.
	//
	// What used to be encoded in the palette and now has to live somewhere else:
	//   - demand and flow shared one colour because both are a flow rate, Q. They now share the
	//     PREFIX 'Q' by default, which says it out loud instead of asking the reader to match hues.
	//   - There is still no separate head-GAIN field (Tom, 2026-07-30: "I don't think we need a
	//     separate Head Gain. Negative head loss is fine."): a pump reports a negative head loss,
	//     under the same label, prefix and extrema bucket as every other link.

	function el(tag, attrs, parent) {
		var e = document.createElementNS(NS, tag), k;
		for (k in attrs) { if (attrs.hasOwnProperty(k)) { e.setAttribute(k, attrs[k]); } }
		if (parent) { parent.appendChild(e); }
		return e;
	}
	// GENERATED ANNOTATION, DECLARED WHERE IT IS BUILT (ROADMAP Task 334). Membership in "things
	// we generated to be read" is a fact about WHY an element exists, which only the code creating
	// it knows -- so it is declared here rather than remembered as a selector list in the
	// stylesheet by someone editing an unrelated feature months later. That list is exactly how
	// the extrema badge was missed in Task 331 and caught by Tom on screen the same day.
	//
	// One class, one rule (`.lpn-labels-hidden .lpn-annotation` in css/engcalcs.css). Every future
	// mark that annotates a label -- a units suffix, a warning glyph, a thematic swatch -- is
	// covered by being built through this instead of by an edit somewhere else.
	//
	// NOT annotation: the network itself (nodes, pipes, pumps, valves, tanks) and the user's own
	// Text labels, which are authored content. A Text label's own scale threshold is its size
	// ratio, handled per label in applyLabelVisibility() (Task 340), not by this class.
	function annotationEl(tag, attrs, parent) {
		var e = el(tag, attrs, parent), cls = e.getAttribute('class');
		e.setAttribute('class', (cls ? cls + ' ' : '') + 'lpn-annotation');
		return e;
	}
	function setTransform() {
		world.setAttribute('transform', 'translate(' + state.tx + ',' + state.ty + ') scale(' + state.s + ')');
	}
	// ---- ROADMAP Task 274: the user works in CARTESIAN coordinates (Y increases upward) ----
	//
	// Tom, 2026-08-10: *"EPANET uses normal cartesian coordinates, where up and right are positive.
	// But we have the opposite like a graphic arts software. We need to fix this. Cartesian is
	// engineering."*
	//
	// THE FLIP LIVES AT THE USER BOUNDARY, NOT IN THE DOCUMENT. Internally `doc` stays Y-down,
	// because that is SVG's own coordinate system and every drawing routine in this file -- text
	// baselines, extrema chevrons, the backdrop image, the reservoir tank, label
	// collision boxes and leader side-flips -- is written natively against it. Flipping the world
	// transform instead would mirror every glyph and every symbol, and each of the ~10 counter-flips
	// that repairs fails SILENTLY and visually (one upside-down number nobody notices for a month).
	// This way there is one negation, in one place, and it cannot mirror anything.
	//
	// The stored FILE is Cartesian from v4 (see LPN_CARTESIAN_VERSION and flipStoredY); memory stays
	// Y-down. So this negation is also what serialization crosses, and a backdrop world file's E
	// term is negative for the same reason -- world Y is up.
	//
	// Self-inverse on purpose: the same call converts both ways, so a display site and an entry site
	// can never drift into disagreeing about which direction they are going.
	function cartesianY(y) { return -y; }
	// ---- ROADMAP Task 354: LOCAL MAP COORDINATES -------------------------------------------------
	//
	// **A PIPE IN A STATE-PLANE MODEL VANISHES WHEN YOU ZOOM IN, AND THE RASTERISER IS WHY.** At
	// x ~ 579,350 and y ~ 1,304,070 a float32 -- which is what an SVG path coordinate becomes --
	// has a spacing of 0.0625 and 0.125 units. A pipe's stroke is `linkWidth / scale` WORLD units,
	// so on a map 30 units wide (scale ~47) a 3 px stroke is 0.064 world units, AT the quantum.
	// Widening the stroke does not fix it: at 20 px the failure moves three zoom steps out and the
	// 11 px text is then 0.079 units, so the glyphs go too. The labels rendering correctly while
	// the line disappeared is what identified it -- the arithmetic was never wrong.
	//
	// **SO THE DOCUMENT STORES COORDINATES LOCAL TO AN ORIGIN, AND NOTHING DOWNSTREAM EVER SEES A
	// BIG NUMBER.** The renderer, the bbox, the collision pass, the fit and the solver all work in
	// local units; the origin is added back at the handful of places that face OUTWARD -- the
	// coordinate readout, the property popups' X/Y, an .inp import, and the backdrop world file.
	// That is ~5 sites. The alternative -- subtract an offset at every coordinate WRITE and leave
	// the document's numbers huge -- is ~25 sites and leaves the file unreadable by the same
	// arithmetic that broke the screen.
	//
	// THE ORIGIN IS IN THE FILE'S OWN FRAME, WHICH IS CARTESIAN (Task 274), while memory is Y-down.
	// So the two conversions compose in one direction each and are NOT self-inverse the way
	// cartesianY() is. That is why they are four named functions rather than one clever one: a site
	// that needs the flip needs the shift too, and a reader should not have to work out which.
	//
	//     outward = origin + flip(internal)        internal = flip(outward - origin)
	//
	// **EVERY BOUNDARY GOES THROUGH THESE FOUR AND cartesianY() IS NO LONGER CALLED DIRECTLY
	// ANYWHERE ELSE.** dev/lpn-spike/local-origin-harness.js counts the call sites, for the same
	// reason the flip's own harness did: a sixth boundary added later without the shift is a
	// coordinate wrong by half a million, and it looks perfectly ordinary in a diff.
	function docOrigin() {
		return (doc && doc.origin && isFinite(doc.origin.x) && isFinite(doc.origin.y))
			? doc.origin : { x: 0, y: 0 };
	}
	function outwardX(x) { return x + docOrigin().x; }
	function outwardY(y) { return cartesianY(y) + docOrigin().y; }
	function inwardX(x) { return x - docOrigin().x; }
	function inwardY(y) { return cartesianY(y - docOrigin().y); }
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
	// The Text-label sibling of nearestNodeNearScreen(), added 2026-08-15 for the fat-finger rule.
	// Measured to the label's ANCHOR POINT rather than its box, and at the same NODE_SNAP_PX: "very
	// near where you just put something" is Tom's own framing, and an anchor distance cannot make a
	// large title block into a no-go zone the way its bounding box would.
	function nearestLabelNearScreen(clientX, clientY, pxTolerance) {
		var w = screenToWorld(clientX, clientY), best = null, bestPx = pxTolerance, i, lb, an, px, py, dPx;
		for (i = 0; i < doc.labels.length; i++) {
			lb = doc.labels[i];
			an = lb.anchorNode ? nodeById(lb.anchorNode) : null;
			px = an ? an.x + lb.x : lb.x;
			py = an ? an.y + lb.y : lb.y;
			dPx = Math.hypot(px - w.x, py - w.y) * state.s;
			if (dPx <= bestPx) { best = lb; bestPx = dPx; }
		}
		return best;
	}
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
	// The water surface at ANY fixed-head node, in the Elevation/Head display unit. A tank's is
	// derived rather than stored -- bottom elevation plus the level standing in the vessel -- which
	// is why there is no blank-means-follow rule for it: both halves are always real numbers.
	// Everything that draws, labels, solves or reports a fixed head goes through here, so the two
	// types' different arithmetic is stated once (Task 248).
	function nodeFixedHead(n) {
		if (n.type === 'tank') { return (n.elev || 0) + (effective(n, 'level') || 0); }
		return reservoirHead(n);
	}
	function isFixedHeadNode(n) { return !!n && (n.type === 'reservoir' || n.type === 'tank'); }
	function linkById(id) {
		var i;
		for (i = 0; i < doc.links.length; i++) { if (doc.links[i].id === id) { return doc.links[i]; } }
		return null;
	}
	// Pump curve support (Task 146, 2026-07-30). A pump's curvePoints are 1-3 [Q,H] pairs in the
	// units on the strip; curveRef, if set, names another pump link to copy points from (one hop
	// only -- resolveCurvePoints never chases a chain, so a ref-to-a-ref cannot create a cycle).
	// pumpFit() below turns whichever points are in effect into the SI h0/a/b js/lpn-solver.js
	// reads, and stores nothing.
	function resolveCurvePoints(l) {
		var base = l;
		if (l.curveRef) { var ref = linkById(l.curveRef); if (ref && ref.type === 'pump') { base = ref; } }
		return (base.curvePoints || []).filter(function (p) { return p && p[0] !== undefined && p[1] !== undefined; });
	}
	// A PUMP'S FITTED CURVE IS DERIVED, SO IT IS NOT STORED (ROADMAP Task 390 step 5).
	//
	// h0/a/b are the SI coefficients of H = h0 - a Q^b that js/lpn-solver.js reads. curvePoints are
	// the 1-3 [Q, H] pairs the USER typed, in the flow and head units on the strip. Those are two
	// different kinds of number -- one we computed and one the user supplied -- and they used to sit
	// side by side on the same link.
	//
	// That had the symptom this whole task is about: a REPAIR MECHANISM. Every unit switch had to
	// re-run the fit across the document, because the same three points mean a different pump under
	// l/s than under gpm, and a stored triple that nobody refreshed described a pump the user had
	// never entered. The repair was correct and worked; needing one at all was the defect.
	//
	// Derived here, at the solver handoff, there is nothing to keep in step, nothing to migrate, and
	// no field on a link that anything but the user writes. The cost is one three-point curve fit
	// per pump per solve, at this suite's target scale of ~10-20 nodes.
	function pumpFit(l) {
		var pts = resolveCurvePoints(l);
		if (pts.length === 0) {
			// No curve entered yet: h0 = a = 0, so H = h0 - a Q^b is identically zero and the pump
			// is simply a connection that neither adds nor loses head. The solver has its own
			// gradient floor for this (see the pump branch of lpnAssemble), so a curveless pump
			// behaves like a very short, very smooth pipe rather than dividing by zero.
			return { h0: 0, a: 0, b: 2 };
		}
		// The pump's own crossing of the unit boundary, and it is one of the two sanctioned
		// conversion sites (see toSI's block) rather than a third.
		return EngCalcs.lpnPumpFromCurve(pts.map(function (pt) {
			return [toSI(pt[0], 'lpn_u_flow'), toSI(pt[1], 'lpn_u_elevhead')];
		}));
	}
	// A pre-Task-390 document carries h0/a/b written into its links. They are read by nothing now,
	// and leaving them would leave a stale copy of a derived value sitting beside the points it was
	// derived from -- the exact arrangement this step removed. Dropped on load rather than in a
	// versioned migration step, because it changes no number the user can see and therefore has
	// nothing to ask about.
	function dropStoredPumpFit(links) {
		(links || []).forEach(function (l) {
			if (l.type !== 'pump') { return; }
			delete l.h0; delete l.a; delete l.b;
		});
	}
	function linkPoints(l) {
		return Geom.polylinePointsAttr(linkPointList(l));
	}
	// Schematic polyline distance in map/world units -- NOT a real ground length (that needs
	// the backdrop registration's scale, which is Phase 2). Good enough as the "auto" default
	// the CLAUDE.md/scope-doc "len is stored and overridable, never derived" rule calls for:
	// a real number to start from rather than a blank field, with lenAuto tracking whether the
	// user has taken control (per the Auto Length design note in the scope doc).
	function linkGeomLength(l) {
		return Geom.polylineLength(linkPointList(l));
	}

	// ---- one-time DOM build per element + incremental per-frame updates ----
	// Same architecture as the spike (dev/lpn-spike/phase0-acceptance.md round 1): a full
	// teardown-and-rebuild on every drag frame was measured at 20-45fps; touching only the
	// elements incident to what moved keeps drag at the display's real refresh rate.
	var nodeEls = {}, linkEls = {}, labelEls = {}, incidentLinks = {}, labelsByAnchor = {};
	// Whether generated annotation is currently suppressed by settings.labelMaxWidth. Written only
	// by applyLabelVisibility(); read by onZoomChanged() and bbox().
	var dataLabelsHidden = false;

	// Symbol size. SCREEN PIXELS and INDEPENDENT OF THE TEXT since 2026-08-14 (Task 331). Tom:
	// *"decouple label, link, and node size (in pixels? EPANET is fuzzy about that and epanet-js
	// seems to have it hard coded)"* -- and, the day before, *"I found myself wanting to control
	// symbol size and text size independently instead of having them linked."*
	//
	// `settings.symbolSize` is the DIAMETER OF A JUNCTION DOT in screen pixels, which is the one
	// dimension on this map a person can actually picture. Everything else on the drawing that has a
	// fixed shape -- reservoir, tank, pump, valve, vertex handle, arrow chevron, node outline -- was
	// drawn against JUNCTION_R and follows from it, so there is still exactly one number to turn.
	//
	// What went away is `settings.symbolScale`, the old "relative to text" multiplier. It existed
	// because symbols inherited the text's map-vs-screen units and could not have had their own; with
	// both in pixels that coupling buys nothing and costs the user a mental division every time they
	// want a bigger dot. Link width is likewise its own setting now -- see linkStrokeWidth() below.
	function symbolFactor() {
		return (settings.symbolSize / 2) / JUNCTION_R / (state.s || 1);
	}
	// Pipe stroke width in world units, from `settings.linkWidth` screen pixels. Published to CSS as
	// --lpn-lw (refreshSymbolSizes()), which is why the .lpn-link rules read that rather than
	// --lpn-sym: a pipe network's PIPES are its primary content and their weight is a drawing
	// decision of its own, not a consequence of how big the junction dots are.
	function linkStrokeWidth() {
		return settings.linkWidth / (state.s || 1);
	}
	// Junction radius. 1.6 -> 0.72 earlier on 2026-08-09 ("about twice as large" next to text),
	// then 0.9 the same day once the node became a stroke-less solid dot: with the 1-unit ring
	// gone, 0.72 alone was too small to see, and 0.9 puts the WHOLE dot at 1.8 units -- one cap
	// height of the 2.5-unit base font, which is the "no larger than 1 text height" Tom asked
	// for. Total size fell 2.44 -> 1.8 even though the radius went up, because the ring was
	// adding 0.5 all round. One-line change if he wants it nudged either way.
	var JUNCTION_R = 0.9;
	// The reservoir has its own width and height rather than being a scaled junction box: EPANET's
	// icon is wide, not tall and square, so a uniform shrink would narrow it too.
	//
	// **IF THE SHARED PATH IN lib/Icons.lib.php CHANGES, REDO THE DIVISION BELOW -- DO NOT JUST
	// SCALE THIS NUMBER BY THE REQUESTED PERCENTAGE.** This map box stretches that path with
	// preserveAspectRatio="none", so the visible wall width is (path fraction) x (box width), and
	// changing the path silently changes what a percentage of "this box" means. The worked example:
	// asked for 80% of the rendered width, while the shared path had just been widened,
	//   old wall width   = (path fraction 12/24 = 0.5) x (box width 2 x 3.3 = 6.6) = 3.3
	//   target           = 3.3 x 0.8 = 2.64
	//   new path fraction = 18/24 = 0.75
	//   new box width     = 2.64 / 0.75 = 3.52  ->  half-width 1.76
	// A naive 3.3 x 0.8 would have landed 20% WIDER, not narrower. The current value is a further
	// plain 1.76 x 0.8 = 1.408, with the path unchanged, so no division was owed that time.
	// Half-height 1.1 is half of the original 2.2.
	//
	// One-line change either way (this and Icons.lib.php's path); explicitly an experiment, not a
	// settled number -- but skip the division and the two surfaces'
	// shared path will fight each other.
	var RESERVOIR_HALF_W = 1.408;
	var RESERVOIR_HALF_H = 1.1;
	// A TANK is the reservoir's mirror image in proportion, deliberately (Task 248): narrower than
	// it is tall, where the reservoir is wider than it is tall. Together with the domed roof in
	// lib/Icons.lib.php that is the second of the two cues separating the two symbols, and it is
	// the one that still works in a thumbnail. Area is kept close to the reservoir's so neither
	// dominates a drawing containing both. Both numbers are one-line changes.
	var TANK_HALF_W = 1.0;
	var TANK_HALF_H = 1.45;
	// The drawn box for a node that has an overlay symbol. Sized per TYPE, not per node -- so the
	// map reads as a symbol set rather than as a set of scaled circles.
	function nodeSymbolSize(n) {
		var k = symbolFactor();
		if (n && n.type === 'tank') { return { w: 2 * TANK_HALF_W * k, h: 2 * TANK_HALF_H * k }; }
		return { w: 2 * RESERVOIR_HALF_W * k, h: 2 * RESERVOIR_HALF_H * k };
	}
	// The single scalar every OTHER consumer of node geometry reads -- clear-run insets, label
	// leader placement, hit-testing (the invisible-but-clickable circle under a reservoir
	// symbol), staticObstacles(), the zoom-extent bbox. A reservoir is no longer visually a
	// circle, so this is the circumscribing radius (half its LONGER side) rather than a true
	// radius -- generous rather than tight, so none of those consumers ever clips the wide/short
	// tank short on any one side (ROADMAP Task 146.10 and its 2026-08-09 follow-up).
	function nodeRadius(n) {
		if (n.type === 'reservoir' || n.type === 'tank') { var s = nodeSymbolSize(n); return Math.max(s.w, s.h) / 2; }
		return JUNCTION_R * symbolFactor();
	}
	// Positions/sizes a node's overlay symbol (the reservoir basin and the tank -- see
	// buildNodeEls()). Only those two ever have one (`ne.symbol` is null for a junction, which draws
	// as the plain circle above with no overlay), so this sizes to nodeSymbolSize() -- an independent
	// width/height per type, not nodeRadius()'s single circumscribing scalar; see buildNodeEls() for the
	// `preserveAspectRatio="none"` that makes the icon actually stretch to that box instead of
	// being letterboxed inside it.
	function positionNodeSymbol(id) {
		var n = nodeById(id), ne = nodeEls[id];
		if (!ne || !ne.symbol) { return; }
		var s = nodeSymbolSize(n);
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
		svg.style.setProperty('--lpn-lw', linkStrokeWidth());
		// ONE SCREEN PIXEL, in world units. Everything else here is scaled off the symbol size,
		// which is right for things that ARE symbols and wrong for a hairline: a leader is a rule
		// pointing at something, not a symbol, and at the shipped 7px symbol its old width worked
		// out at 0.49px -- a line the browser renders as a grey smudge and Tom reported as "no
		// leaders" while looking straight at them. Turn Symbol size down to 2 and it was 0.14px.
		svg.style.setProperty('--lpn-hair', 1 / (state.s || 1));
		// Symbols only, never labels (Tom, 2026-07-30: "symbols opacity would be a
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
		refreshValueColors();
	}

	// ---- COLOUR BY VALUE (ROADMAP Task 384, and Task 327's thematic mode) -------------------
	//
	// **This is preparation for extended-period simulation (Task 248), not decoration.** Tom,
	// 2026-08-15: *"numbers in animations or at very large scale are too overwhelming or crowded.
	// Colors become a gradient map that is intuitive to analyze or review visually."* A number per
	// element per timestep cannot be read as numbers; a colour can.
	//
	// **The base drawing spends no colour at all** (see css/engcalcs.css: every symbol went black
	// on 2026-08-14 precisely so this could be built). So everything painted here MEANS something,
	// and turning it off returns the map to a drawing.
	//
	// WHAT WAS COPIED FROM EPANET, and why copying beat inventing: EPANET 2.2 is US EPA work in the
	// public domain, and a water engineer already knows its legend. Taken outright ---
	//   * FOUR break boxes, five colour bands, values ascending, blanks allowed. Fewer values
	//     simply means fewer bands; it is not an error state.
	//   * The break values are STORED PER VARIABLE AND ARE ABSOLUTE -- a fixed number of psi, not a
	//     percentile of whatever the current timestep happens to hold. That is what makes two
	//     timesteps (and two networks) comparable by eye, which is the entire point under Task 248.
	//   * "Equal intervals" and "Equal counts" are ONE-SHOT BUTTONS that read the values on screen
	//     now and WRITE fixed numbers into those boxes. They are how the absolute numbers get
	//     chosen; they are not a live mode.
	//   * The default ramp is EPANET's own blue-cyan-green-yellow-red, and it is reversible.
	// Our one addition to that dialog: leaving every box blank means AUTOMATIC -- equal intervals
	// over the values presently on the map, recomputed each solve. EPANET has no such state, and it
	// exists here because a break value is in the DISPLAY unit, so no shipped default could be
	// right under both presets (25 psi and 25 m are not the same setting). Pressing either button
	// converts automatic into pinned absolute numbers, which is the state to be in before Task 248.
	//
	// epanetjs was read and NOT copied: it is FSL-1.1-MIT (MIT only for the pre-fork Placemark
	// code), whose field-of-use restriction is incompatible with this suite's GPL v3. The idea is
	// free; its code is not usable here.
	//
	// COLOURING IS READ-ONLY with respect to the document. Nothing below writes an element
	// property, so setProp() is not involved -- the values come from `lastSolveResult` and from
	// effective(), and the only writes are to settings and to inline SVG style.
	//
	// Values are compared in DISPLAY units against break values the user typed, which is the same
	// rule as everywhere else on this page: a stored number is what the user typed, and switching
	// units REINTERPRETS it rather than converting it (see toSI()'s comment). So a break of 40 is
	// 40 psi under the US preset and 40 m under SI, exactly like every other typed number here.
	var COLOR_RAMPS = {
		// EPANET's own five map colours, in its own order. Not softened: matching what the user
		// already reads in EPANET is worth more here than a prettier ramp.
		epanet: ['#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000'],
		// Perceptually uniform and safe for the ~8% of men with red-green colour blindness, for
		// whom the EPANET ramp's green/yellow/red end is three shades of one colour. Same reasoning
		// the reservoir/junction symbols were separated by SHAPE under.
		viridis: ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725'],
		// For a printed sheet and for photocopies. Light-to-dark reads as low-to-high with no key.
		gray: ['#dddddd', '#aaaaaa', '#777777', '#444444', '#000000']
	};
	var COLOR_BANDS = 5;   // EPANET's five bands -- four break boxes
	// Which fields can be coloured, and the unit each is read in. Node and link lists deliberately
	// match EPANET's own View menu (elevation/demand/head/pressure; diameter/roughness/flow/
	// velocity/head loss) so nobody has to learn a second vocabulary. The display NAME of each is
	// taken from nodeFieldDefs()/linkFieldDefs(), the same strings the Labels popover and the map
	// legend already use, so a colour key and a label key can never disagree about what a field is
	// called.
	var COLOR_NODE_FIELDS = { elev: 'lpn_u_elevhead', demand: 'lpn_u_flow', head: 'lpn_u_elevhead', pressure: 'lpn_u_pressure' };
	var COLOR_LINK_FIELDS = { diameter: 'lpn_u_diameter', roughness: '', flow: 'lpn_u_flow', velocity: 'lpn_u_velocity', headloss: 'lpn_u_elevhead', gradient: 'lpn_u_gradient' };
	// The value a node/link is coloured by, IN THE DISPLAYED UNIT -- the same expressions
	// refreshLabelText() prints, so the colour and the printed number can never describe different
	// quantities. undefined means "this element has no such value" (no solve yet, or the field does
	// not exist on this element type), and an undefined value is left BLACK rather than given the
	// bottom colour: a pump has no velocity, and painting it dark blue would assert that it has a
	// low one.
	function colorNodeValue(n, field) {
		if (field === 'elev') { return typeof n.elev === 'number' ? n.elev : undefined; }
		if (field === 'demand') { return isFixedHeadNode(n) ? undefined : effective(n, 'demand'); }
		if (field === 'head') {
			if (isFixedHeadNode(n)) { return nodeFixedHead(n); }
			return lastSolveResult ? toDisplay(lastSolveResult.heads[n.id], 'lpn_u_elevhead') : undefined;
		}
		if (field === 'pressure') {
			if (isFixedHeadNode(n)) { return toDisplay(toSI(nodeFixedHead(n) - (n.elev || 0), 'lpn_u_elevhead'), 'lpn_u_pressure'); }
			return lastSolveResult ? toDisplay(lastSolveResult.pressures[n.id], 'lpn_u_pressure') : undefined;
		}
		return undefined;
	}
	function colorLinkValue(l, field) {
		if (field === 'diameter') { return l.type === 'pump' ? undefined : effective(l, 'diameter'); }
		if (field === 'roughness') { return l.type === 'pipe' ? effective(l, 'roughness') : undefined; }
		if (!lastSolveResult || lastSolveResult.flows[l.id] === undefined) { return undefined; }
		if (field === 'flow') { return toDisplay(shownFlow(lastSolveResult.flows[l.id]), 'lpn_u_flow'); }
		if (field === 'velocity') { return l.type === 'pump' ? undefined : toDisplay(lastSolveResult.velocities[l.id], 'lpn_u_velocity'); }
		if (field === 'headloss') { return toDisplay(shownHeadloss(l, lastSolveResult.headlosses[l.id]), 'lpn_u_elevhead'); }
		if (field === 'gradient') {
			var len = linkLengthSI(l);
			if (l.type === 'pump' || !len) { return undefined; }
			return toDisplay(shownHeadloss(l, lastSolveResult.headlosses[l.id]) / len, 'lpn_u_gradient');
		}
		return undefined;
	}
	function colorFieldOf(group) { return group === 'node' ? settings.colorNodeField : settings.colorLinkField; }
	function colorValueOf(group, elem, field) {
		return group === 'node' ? colorNodeValue(elem, field) : colorLinkValue(elem, field);
	}
	// Every value presently on the map for one field, finite only -- the input to both auto-break
	// rules and to the buttons that pin them.
	function colorValues(group, field) {
		var src = group === 'node' ? doc.nodes : doc.links, out = [];
		src.forEach(function (e) {
			var v = colorValueOf(group, e, field);
			if (typeof v === 'number' && isFinite(v)) { out.push(v); }
		});
		return out;
	}
	// Equal intervals over the observed range: COLOR_BANDS equal-width bands, so COLOR_BANDS-1
	// breaks. EPANET's own "Equal Intervals" button, and also what an empty break list falls back
	// to.
	function equalIntervalBreaks(values) {
		if (values.length < 2) { return []; }
		var min = Math.min.apply(null, values), max = Math.max.apply(null, values), out = [], i;
		if (!isFinite(min) || !isFinite(max) || max === min) { return []; }
		for (i = 1; i < COLOR_BANDS; i++) { out.push(min + (max - min) * i / COLOR_BANDS); }
		return out;
	}
	// Equal counts (EPANET's "Equal Quantiles"): roughly the same number of elements per band,
	// which is what makes a skewed field -- a few long mains among many short services -- use its
	// whole ramp instead of one colour plus four empty bands.
	function equalCountBreaks(values) {
		if (values.length < 2) { return []; }
		var s = values.slice().sort(function (a, b) { return a - b; }), out = [], i, idx;
		for (i = 1; i < COLOR_BANDS; i++) {
			idx = Math.min(s.length - 1, Math.max(0, Math.round(i * s.length / COLOR_BANDS)));
			out.push(s[idx]);
		}
		return out;
	}
	function colorBreakKey(group, field) { return group + '.' + field; }
	// The break values the user PINNED, cleaned: numeric, ascending, at most COLOR_BANDS-1 of them.
	// An empty result means automatic.
	function pinnedBreaks(group, field) {
		var stored = (settings.colorBreaks || {})[colorBreakKey(group, field)] || [];
		var out = [];
		stored.forEach(function (v) {
			var x = (v === '' || v === null || v === undefined) ? NaN : +v;
			if (isFinite(x)) { out.push(x); }
		});
		return out.sort(function (a, b) { return a - b; }).slice(0, COLOR_BANDS - 1);
	}
	function effectiveBreaks(group, field) {
		var pinned = pinnedBreaks(group, field);
		if (pinned.length) { return pinned; }
		return equalIntervalBreaks(colorValues(group, field));
	}
	// Band index -> colour. With `n` bands the ramp's five stops are sampled evenly, so three bands
	// take the ends and the middle rather than the first three stops -- otherwise dropping a break
	// would silently drop the top of the ramp and a high value would stop reading as high.
	function bandColor(bandIdx, bandCount) {
		var cols = COLOR_RAMPS[settings.colorRamp] || COLOR_RAMPS.epanet;
		if (settings.colorReverse) { cols = cols.slice().reverse(); }
		if (bandCount <= 1) { return cols[cols.length - 1]; }
		return cols[Math.round(bandIdx * (cols.length - 1) / (bandCount - 1))];
	}
	function colorForValue(v, breaks) {
		if (typeof v !== 'number' || !isFinite(v)) { return ''; }
		var i = 0;
		while (i < breaks.length && v >= breaks[i]) { i++; }
		return bandColor(i, breaks.length + 1);
	}
	// Paints one node. The junction DOT takes the colour as a fill; a reservoir or tank has no
	// visible circle (css: fill:none -- the circle is the invisible hit target), so its overlay
	// icon takes the colour through currentColor instead, which is the same channel its black is
	// set through. Inline style, so clearing it restores the stylesheet's black exactly.
	function paintNodeColor(id) {
		var ne = nodeEls[id], n = nodeById(id);
		if (!ne || !n) { return; }
		var field = colorFieldOf('node');
		var col = field ? colorForValue(colorNodeValue(n, field), effectiveBreaks('node', field)) : '';
		if (isFixedHeadNode(n)) {
			if (ne.symbol) { ne.symbol.style.color = col; }
		} else {
			ne.circle.style.fill = col;
		}
	}
	function paintLinkColor(id) {
		var le = linkEls[id], l = linkById(id);
		if (!le || !l) { return; }
		var field = colorFieldOf('link');
		var col = field ? colorForValue(colorLinkValue(l, field), effectiveBreaks('link', field)) : '';
		le.line.style.stroke = col;
		// A pump's or valve's icon goes with its own line -- the two are one mark (css: the symbol
		// and the polyline are both black by the same argument).
		if (le.symbolSvg) { le.symbolSvg.style.color = col; }
	}
	// The one entry point. Cheap enough to call on every solve: it is two passes over the document
	// setting one inline style each, no measurement and no layout.
	function refreshValueColors() {
		if (!svg) { return; }
		applyThematicMode();
		doc.nodes.forEach(function (n) { paintNodeColor(n.id); });
		doc.links.forEach(function (l) { paintLinkColor(l.id); });
		renderColorLegend();
	}
	// TASK 327: the THEMATIC map is a MODE, not a default. Two honest products -- a DRAWING (dark
	// linework and labels, what you plot) and a THEMATIC MAP (colour by one field, no labels, what
	// you read at a glance across 97 nodes). EPANET's mistake was having only the second and making
	// the first hard; ours must not be the mirror of it.
	//
	// Implemented as ONE CLASS on the <svg> and a CSS rule, deliberately: label visibility has its
	// own settings, its own collision solver and its own popover, and a mode that reached in and
	// switched those off would be indistinguishable afterwards from the user having switched them
	// off. Turning the mode off restores exactly the labels that were there.
	function applyThematicMode() {
		if (!svg || !svg.classList) { return; }
		if (settings.colorThematic) { svg.classList.add('lpn-thematic'); }
		else { svg.classList.remove('lpn-thematic'); }
	}
	// The colour key. Its own overlay div, created here rather than in Looped-Network.php, and its
	// own corner setting: the labels legend rebuilds itself with innerHTML='' and would wipe any
	// child of it, and stacking two legends in one corner puts each in the other's way.
	// Held in a variable rather than re-found by id on every paint: this runs once per solve, and a
	// handle is also what keeps the element the SAME element across rebuilds.
	var colorLegendBox = null;
	function colorLegendEl() {
		if (colorLegendBox) { return colorLegendBox; }
		var host = document.getElementById('lpn_labels_legend');
		if (!host || !host.parentNode) { return null; }
		colorLegendBox = document.createElement('div');
		colorLegendBox.id = 'lpn_color_legend';
		colorLegendBox.className = 'lpn-color-legend';
		host.parentNode.appendChild(colorLegendBox);
		return colorLegendBox;
	}
	// Field name for the legend heading, read out of the SAME defs the Labels popover uses.
	function colorFieldLabel(group, field) {
		var pc = EngCalcs.pageConfig || {}, defs = group === 'node' ? nodeFieldDefs(pc) : linkFieldDefs(pc), i;
		for (i = 0; i < defs.length; i++) { if (defs[i][0] === field) { return defs[i][1]; } }
		return field;
	}
	// 3 significant figures, then trailing zeros stripped. A break the user typed prints back as
	// they typed it; an automatic one prints short enough to read in a corner overlay.
	function colorNum(v) {
		if (typeof v !== 'number' || !isFinite(v)) { return ''; }
		var s = Math.abs(v) >= 1000 ? String(Math.round(v)) : String(+v.toPrecision(3));
		return s;
	}
	function renderColorLegend() {
		var box = colorLegendEl(); if (!box) { return; }
		var pc = EngCalcs.pageConfig || {}, any = false;
		box.innerHTML = '';
		['node', 'link'].forEach(function (group) {
			var field = colorFieldOf(group); if (!field) { return; }
			var breaks = effectiveBreaks(group, field);
			if (!breaks.length && colorValues(group, field).length === 0) { return; }
			any = true;
			var unitId = (group === 'node' ? COLOR_NODE_FIELDS : COLOR_LINK_FIELDS)[field];
			var unit = unitId ? unitLabel(unitId) : (field === 'gradient' ? gradientSuffix() : '');
			var h = document.createElement('div');
			h.style.fontWeight = 'bold';
			h.textContent = colorFieldLabel(group, field) + (unit ? ' (' + unit + ')' : '');
			box.appendChild(h);
			// TOP BAND FIRST. A legend reads high-at-the-top the way a thermometer does, and the
			// map's own high values are the ones a reviewer is scanning for.
			var i;
			for (i = breaks.length; i >= 0; i--) {
				var row = document.createElement('div'), sw = document.createElement('span'),
					txt = document.createElement('span');
				row.style.cssText = 'display:flex;gap:0.5em;align-items:center';
				sw.className = 'lpn-color-swatch';
				sw.style.background = bandColor(i, breaks.length + 1);
				// Range text is built from glyphs, not words: '<', '≤' and an en dash are the
				// same marks in all 27 languages and need no key. (An RTL reader gets them mirrored
				// by the bidi algorithm, which is the correct rendering.)
				if (i === 0) { txt.textContent = '< ' + colorNum(breaks[0]); }
				else if (i === breaks.length) { txt.textContent = '≥ ' + colorNum(breaks[breaks.length - 1]); }
				else { txt.textContent = colorNum(breaks[i - 1]) + ' – ' + colorNum(breaks[i]); }
				row.appendChild(sw); row.appendChild(txt);
				box.appendChild(row);
			}
			if (!pinnedBreaks(group, field).length) {
				var note = document.createElement('div');
				note.style.cssText = 'font-size:0.85em;opacity:0.75';
				note.textContent = pc.lpn_settings_color_auto || 'Automatic';
				box.appendChild(note);
			}
		});
		box.style.display = any ? '' : 'none';
		applyColorLegendPosition();
	}
	function applyColorLegendPosition() {
		var box = colorLegendBox; if (!box) { return; }
		var pos = LEGEND_POSITIONS[settings.colorLegendPosition] || LEGEND_POSITIONS['bottom-right'];
		box.style.top = pos.top; box.style.bottom = pos.bottom;
		box.style.left = pos.left; box.style.right = pos.right;
		box.style.transform = pos.transform;
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
		// A TANK gets the same treatment on the same path (Task 248): its own icon over the same
		// invisible-but-clickable circle, so every consumer of node geometry keeps reading one
		// scalar radius and nothing else in the file had to learn about a third node type.
		var symbol = (n.type === 'reservoir' || n.type === 'tank')
			? buildMapIconSvg(n.type, 'lpn-node-symbol lpn-node-symbol-' + n.type)
			: null;
		if (symbol) {
			// The nested <svg>'s viewBox is square (0 0 24 24, same as every icon) but the box it's
			// placed into is not (nodeSymbolSize() -- wide and short for a reservoir, narrow and
			// tall for a tank). Default preserveAspectRatio
			// ("xMidYMid meet") would keep the icon square and letterbox it inside that box; "none"
			// is what actually stretches the tank horizontally and squashes it vertically to fill
			// the box, which is the whole point of giving it an independent width/height.
			symbol.setAttribute('preserveAspectRatio', 'none');
			// Backdrop matches the tank's own silhouette in lib/Icons.lib.php's reservoir path (the
			// (3,4)-(21,20) box `M3 4v16h18V4` traces) -- same box, so the opaque patch never peeks
			// out past the tank's own outline nor leaves a sliver of it uncovered. It stretches
			// along with the rest of the icon's content since it lives in the same viewBox. Keep
			// this in sync with that path's own x-coordinates if it's ever widened/narrowed again.
			// A tank's silhouette is domed, so its patch is that same path rather than a rect -- a
			// rect to the top of the dome would leave its corners standing outside the outline and
			// a pipe would appear to stop short of the tank instead of running behind it.
			if (n.type === 'tank') {
				prependSymbolBackdrop(symbol, 'path', { d: 'M5 6q7-3.5 14 0v14H5z' }, 'lpn-node-symbol-backdrop');
			} else {
				prependSymbolBackdrop(symbol, 'rect', { x: 3, y: 4, width: 18, height: 16 }, 'lpn-node-symbol-backdrop');
			}
			nodesLayer.appendChild(symbol);
		}
		// Leader+text go in labelsLayer, the topmost layer, so this label is never covered by a
		// LATER node/link's own symbol. The leader starts hidden until layoutNodeLabel() below
		// positions it for real.
		var leader = annotationEl('line', { 'class': 'lpn-leader', style: 'display:none' }, labelsLayer);
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
		var text = annotationEl('text', {
			'class': 'lpn-lbl lpn-draglbl', 'data-nodelbl': n.id, style: 'font-size:' + effectiveFontSize() + 'px'
		}, labelsLayer);
		text.textContent = n.id;
		var tw = 8;
		try { tw = text.getBBox().width; } catch (err) { /* pre-layout measurement can throw; fallback stands */ }
		// twPx is banked below, once nodeEls[n.id] exists to bank it on.
		nodeEls[n.id] = { circle: circle, symbol: symbol, text: text, tw: tw, leader: leader, nudge: { x: 0, y: 0 }, lineCount: 1 };
		noteMeasuredWidth(nodeEls[n.id], tw);
		incidentLinks[n.id] = [];
		labelsByAnchor[n.id] = [];
		positionNodeSymbol(n.id);
		layoutNodeLabel(n.id);
		paintNodeColor(n.id);   // a rebuilt element starts black; give it its colour immediately
	}
	function buildLinkEls(l) {
		// AUDIT HALO (ROADMAP Task 184) -- a wider line UNDER the pipe, so what the user sees is an
		// outline around it and never a fill: the pipe keeps its own colour, its dashes and every
		// future result-driven styling, and the halo composes with all of them instead of competing.
		// Built for every link and hidden by CSS until refreshScenarioMarks() marks it, which keeps
		// it out of the per-frame path entirely -- toggling a class is cheaper than creating and
		// destroying an element on every scenario switch.
		var halo = el('polyline', {
			points: linkPoints(l), fill: 'none', 'class': 'lpn-link-halo'
		}, linksLayer);
		// A closed link is DASHED (Task 146.07). Without a visual, a closed pipe is identical to an
		// open one on the map while carrying no water, which turns a one-click state into an
		// invisible cause of a network that will not solve. Read through effective(), so a future
		// scenario override changes the drawing too, not only the arithmetic.
		var line = el('polyline', {
			points: linkPoints(l), fill: 'none',
			'class': 'lpn-link lpn-link-' + l.type + (effective(l, 'status') === 'closed' ? ' lpn-link-closed' : ''),
			'data-link': l.id
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
			arrows.push(annotationEl('polyline', {
				points: '-0.8,-1.2 0.8,0 -0.8,1.2', fill: 'none',
				'class': 'lpn-arrow', 'data-link': l.id, style: 'display:none'
			}, linksLayer));
		}
		// Link label (Task 146 Phase 2 label toggles): a multi-line <text>, same convention as a
		// node's, positioned at the middle segment's midpoint -- content filled in by
		// refreshLabelText(), not here (this only creates the element; it starts empty).
		var leader = annotationEl('line', { 'class': 'lpn-leader', style: 'display:none' }, labelsLayer);
		var text = annotationEl('text', {
			'class': 'lpn-lbl lpn-draglbl', 'data-linklbl': l.id, style: 'font-size:' + effectiveFontSize() + 'px'
		}, labelsLayer);
		// A pump is a LINK, not a node (see the file header), so it had no symbol at all -- just a
		// line in its own colour. ROADMAP Task 146.10: casing + tangent discharge tail, the same
		// path data the toolbar's pump icon uses, rotated to point at the `to` node -- see
		// positionPumpSymbol() for the rotate/flip rule. symbolG is the rotate/flip pivot (drawn in
		// nodesLayer, same layer as node symbols, so a pump reads on top of every pipe it crosses);
		// symbolSvg inside it is the icon box itself, non-interactive -- clicking/dragging a pump
		// still goes through `line` above, unchanged.
		// A VALVE takes the identical path (Task 248 phase 2) -- its own icon, on the same rotate/
		// flip pivot, over the same interactive polyline. Nothing else in this file had to learn
		// about a third link type to draw it.
		var symbolG = null, symbolSvg = null;
		if (l.type === 'pump' || l.type === 'valve') {
			symbolG = el('g', { 'class': 'lpn-link-symbol lpn-link-symbol-' + l.type }, nodesLayer);
			symbolSvg = buildMapIconSvg(l.type, '');
			if (symbolSvg) {
				symbolG.appendChild(symbolSvg);
				// Backdrop matches the casing circle in lib/Icons.lib.php's pump path
				// (`<circle cx="9.8" cy="12.5" r="5"/>`) -- round, not the icon's own square box, so
				// it occludes exactly the casing's footprint rather than plastering a rectangle over
				// the pipe on both sides of it. The thin discharge tail gets no backdrop of its own;
				// a stroke-width line crossing a pipe reads as two lines crossing, not as seeing
				// through a symbol.
				// A VALVE'S backdrop is the bowtie itself, traced from lib/Icons.lib.php's own two
				// triangles -- a rectangle over its bounding box would blank out the pipe on both
				// sides of the waist, where the bowtie is at its thinnest and the pipe should still
				// be visible running through it.
				if (l.type === 'valve') {
					prependSymbolBackdrop(symbolSvg, 'path', { d: 'M4 5v14l8-7zM20 5v14l-8-7z' }, 'lpn-link-symbol-backdrop');
				} else {
					prependSymbolBackdrop(symbolSvg, 'circle', { cx: 9.8, cy: 12.5, r: 5 }, 'lpn-link-symbol-backdrop');
				}
			} else { symbolG.remove(); symbolG = null; }
		}
		linkEls[l.id] = {
			line: line, halo: halo, handles: handles, arrows: arrows, text: text, tw: 8, leader: leader,
			nudge: { x: 0, y: 0 }, lineCount: 1, symbolG: symbolG, symbolSvg: symbolSvg
		};
		if (symbolG) { resizePumpSymbol(l.id); positionPumpSymbol(l.id); }
		layoutLinkLabel(l.id);
		paintLinkColor(l.id);   // a rebuilt element starts black; give it its colour immediately
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
	// The arrow is drawn at 75% of every other symbol (Tom, 2026-08-14: "make the flow arrow about
	// 75% as large as it is relative to the other symbols"). It is a direction mark on a pipe, not
	// an element of the network like a node or a pump, so it should read as the smallest thing on
	// the drawing. Everything that measures the arrow goes through arrowFactor() -- the fit test
	// ("is this run long enough to hold one"), the label's dodge clearance, and the drawing itself
	// -- or a 75% arrow would still reserve 100% of the space.
	var ARROW_SIZE_MULT = 0.75;
	function arrowFactor() { return symbolFactor() * ARROW_SIZE_MULT; }
	// Along-the-whole-pipe distance of every arrow that is actually DRAWN on this link -- the same
	// two rules updateArrow() applies (skip a segment too short to hold an arrow; measure
	// ARROW_ALONG from the upstream end), expressed as one distance per arrow so linkLabelMid() can
	// keep the label clear of them. Returns [] before the first solve, when no arrow is shown.
	function arrowAlongDistances(l) {
		var mids = segmentMidpoints(l), flow = lastSolveResult ? lastSolveResult.flows[l.id] : undefined,
			k = arrowFactor(), minLen = ARROW_NOMINAL_LEN * k * 2, out = [], run = 0, i, t;
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
			k = arrowFactor(), minLen = ARROW_NOMINAL_LEN * k * 2, i;
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
	// THE SIGN OF Q IS A FACT ABOUT THE DRAWING ORDER, NOT ABOUT THE WATER (Tom, 2026-08-14: "pipe
	// flows are still displaying as negative... Q being negative is a simple oversight"). The solver
	// signs every flow against the link's own from->to direction, which is whichever end the user
	// happened to click first -- so "-38.75 gpm" tells a reader nothing except that they drew this
	// pipe backwards. Direction is already carried by the arrow, which is drawn FROM the same sign
	// (updateArrow above), so a magnitude on the readout loses nothing.
	// The solve itself keeps the sign: it is the model's truth, EPANET reports it the same way, and
	// validate_epanet.js compares the two. This is a display rule and lives only here.
	// The precedent is already in js/lpn-solver.js, on velocity: |Q|/A, "direction is already
	// carried twice over", and a signed value "quietly breaking any highest-velocity comparison,
	// since a fast reverse flow sorted to the BOTTOM of the range". Every word of that applies to
	// flow, which is why the extrema badges read these functions too.
	function shownFlow(q) { return typeof q === 'number' ? Math.abs(q) : q; }
	// Head loss is a LOSS, so it is a magnitude on a pipe or a valve for the same reason -- except
	// on a PUMP, where the negative sign is not an accident of drawing order but the entire way this
	// page expresses a head GAIN (Tom, 2026-07-30: "I don't think we need a separate Head Gain.
	// Negative head loss is fine."). So the type decides, and a pump keeps its sign.
	function shownHeadloss(l, h) { return (l && l.type === 'pump') || typeof h !== 'number' ? h : Math.abs(h); }
	// ---- A TEXT LABEL'S ATTACHMENT POINT (ROADMAP Task 332) --------------------------------
	//
	// `lb.x`/`lb.y` is a POINT; `lb.align`/`lb.valign` say which corner or edge of the text that
	// point is. Together they are AutoCAD's MTEXT attachment point, which is why they are stored
	// this way rather than as a flag: EPANET anchors a [LABELS] point at the text's TOP-LEFT and
	// we have always anchored at the centre, and that difference is an ALIGNMENT, not a
	// provenance (Tom, 2026-08-15 -- *"text alignment is very interesting to a user"*). Written
	// as an "imported" boolean it would have to be migrated the moment Task 342 turns alignment
	// into a control; written as `lb.align`, that task only adds the row in the popup.
	//
	// THE POINT OF STORING IT IS THAT NOTHING IS CONVERTED. reanchorImportedLabels() used to
	// translate EPANET's corner into our centre by measuring the label in WORLD units -- a
	// quantity a SCREEN-PIXEL-sized label does not have at any particular zoom -- so the same
	// file imported from two different views wrote two different sets of coordinates, and the
	// difference was saved. Rendering at EPANET's own anchor is exact at every zoom and involves
	// no arithmetic at all.
	//
	// Default is centre in both axes, so every label that already exists renders unchanged.
	function labelHAlign(lb) {
		var a = lb && lb.align;
		return a === 'left' ? 'start' : a === 'right' ? 'end' : 'middle';
	}
	function labelVAlign(lb) { return (lb && lb.valign === 'top') ? 'hanging' : 'middle'; }
	function textLabelHeight(lb) { return effectiveFontSize(lb && lb.sizeMult) * 1.2; }

	// ---- Task 337: a Text label's own boldface and its own rotation ----
	//
	// ROTATION IS A STORED NUMBER, NOT A LIVE REFERENCE TO A PIPE (Tom, 2026-08-14: *"Rotation as
	// number. Yes. It's just a helper/convenience, not a link. We can let them enter a number also
	// or pick among 0, 30, 45, 60, 90"*). A Text label is a street name or a title block, not a
	// property of one link, so it has no link to be slaved to and should not grow one. "Match a
	// pipe" fills the box from the nearest pipe at the moment the user asks; from then on the
	// label is independent of everything that happens to that pipe.
	//
	// THE NUMBER IS CARTESIAN -- counter-clockwise, y up -- because that is the frame the user
	// reads an angle in, and mixing the two frames is what once shipped a page of upside-down
	// labels (see settings.labelFlipLeftOfVertical). SVG rotates CLOCKWISE, so the render negates
	// it, and that negation happens in textLabelSvgAngle() and nowhere else.
	//
	// Both properties are absent on every label written before this, so `undefined` must read as
	// "0 degrees, not bold" -- which is what an old document opens as, unchanged.
	function normalizeDeg(a) {
		a = a % 360;
		if (a > 180) { a -= 360; }
		if (a <= -180) { a += 360; }
		return a;
	}
	// The half-turn that reads left-to-right. Text pointing leftward is upside down, so a matched
	// angle is turned 180 first; the flip button then undoes that when the automatic choice is the
	// wrong one. Exactly +90 (straight up) is left alone -- a north-south name reads bottom to top
	// on every map, the same convention alignedLabelAnchor() follows for pipe labels.
	function readableAngle(a) {
		a = normalizeDeg(a);
		return (a > 90 || a <= -90) ? normalizeDeg(a + 180) : a;
	}
	function textLabelRotation(lb) {
		var r = lb ? +lb.rot : 0;
		return isFinite(r) ? normalizeDeg(r) : 0;
	}
	function textLabelSvgAngle(lb) { return -textLabelRotation(lb); }
	function textLabelWeight(lb) { return (lb && lb.bold) ? 'bold' : 'normal'; }
	function textLabelStyle(lb) {
		return 'font-size:' + effectiveFontSize(lb && lb.sizeMult) + 'px;font-weight:' + textLabelWeight(lb);
	}
	// The attribute is REMOVED rather than set to a zero rotation when the label is upright: a stale
	// transform is invisible in the code and obvious on screen.
	function applyTextLabelRotation(lb, le, px, py) {
		var a = textLabelSvgAngle(lb),
			t = a ? 'rotate(' + a.toFixed(3) + ' ' + px + ' ' + py + ')' : null;
		if (!le.text) { return; }
		if (t) { le.text.setAttribute('transform', t); } else { le.text.removeAttribute('transform'); }
	}
	// AXIS-ALIGNED bounding box of a rotated box, turned about the same point the SVG transform
	// turns it about. An APPROXIMATION, said plainly: a 45-degree label claims more room than its
	// glyphs occupy, so the collision pass keeps data labels a little further away from it than it
	// strictly needs. The alternative is oriented-box collision in js/lpn-collide.js -- a much
	// larger change, for a label the user placed deliberately and can move by hand.
	function rotatedAabb(box, cx, cy, angleDeg) {
		var rad = angleDeg * Math.PI / 180, cos = Math.cos(rad), sin = Math.sin(rad),
			bx = box.x + box.w / 2 - cx, by = box.y + box.h / 2 - cy,
			rx = cx + bx * cos - by * sin, ry = cy + bx * sin + by * cos,
			halfW = (Math.abs(box.w * cos) + Math.abs(box.h * sin)) / 2,
			halfH = (Math.abs(box.w * sin) + Math.abs(box.h * cos)) / 2;
		return { x: rx - halfW, y: ry - halfH, w: halfW * 2, h: halfH * 2 };
	}
	// Cartesian angle of the pipe nearest a point, or null when the drawing has no pipes. The
	// nearest SEGMENT, not the link's end-to-end direction: on a bent main the two differ, and the
	// user is looking at the bend they put the label beside.
	function nearestLinkAngle(px, py) {
		var best = Infinity, ang = null;
		doc.links.forEach(function (l) {
			var pts = linkPointList(l), i, d;
			for (i = 0; i + 1 < pts.length; i++) {
				d = Geom.pointToSegmentDistance(px, py, pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y);
				if (d < best) {
					best = d;
					// Negated on the way out: doc coordinates are screen-frame (y down) in memory,
					// and lb.rot is Cartesian.
					ang = -Math.atan2(pts[i + 1].y - pts[i].y, pts[i + 1].x - pts[i].x) * 180 / Math.PI;
				}
			}
		});
		return ang === null ? null : readableAngle(ang);
	}
	// The label's box, wherever its anchor puts it -- the ONE place the two properties above are
	// turned into geometry, so the bounding box, the collision box and the leader attachment can
	// never disagree about where the same label is.
	function textLabelBox(lb, le, px, py) {
		var box = Geom.labelBoxAt(px, py, textLabelWidth(le), textLabelHeight(lb),
				labelHAlign(lb), labelVAlign(lb), effectiveFontSize(lb && lb.sizeMult)),
			a = textLabelSvgAngle(lb);
		return a ? rotatedAabb(box, px, py, a) : box;
	}
	function buildLabelEls(lb) {
		var an = lb.anchorNode ? nodeById(lb.anchorNode) : { x: lb.x, y: lb.y },
			px = lb.anchorNode ? an.x + lb.x : lb.x,
			py = lb.anchorNode ? an.y + lb.y : lb.y,
			leader = null, text;
		if (lb.anchorNode) {
			leader = el('line', { x1: an.x, y1: an.y, x2: px, y2: py, 'class': 'lpn-leader' }, labelsLayer);
		}
		text = el('text', {
			x: px, y: py, 'class': 'lpn-lbl lpn-draglbl', 'text-anchor': labelHAlign(lb),
			'dominant-baseline': labelVAlign(lb) === 'hanging' ? 'hanging' : 'central',
			'data-lbl': lb.id, style: textLabelStyle(lb)
		}, labelsLayer);
		text.textContent = lb.text;
		// MEASURED AFTER THE STYLE IS ON THE ELEMENT, which is the whole reason bold can be a
		// style rather than a second measurement path: bold glyphs are wider, so a width taken
		// before the weight was applied would size the collision box for the lighter text
		// (Task 337).
		var w = 10;
		try { w = text.getBBox().width; } catch (err) { /* pre-layout measurement can throw; fallback stands */ }
		labelEls[lb.id] = { leader: leader, text: text, side: 'right', width: w };
		noteTextWidth(labelEls[lb.id], w);
		applyTextLabelRotation(lb, labelEls[lb.id], px, py);
		if (lb.anchorNode) { labelsByAnchor[lb.anchorNode].push(lb.id); }
	}

	function buildDom() {
		var i;
		linksLayer.innerHTML = ''; nodesLayer.innerHTML = ''; labelsLayer.innerHTML = '';
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
		// Every element here is brand new and therefore carries no visibility class, so the current
		// threshold has to be re-applied to it (Task 340's per-Text-label half in particular -- the
		// one class on the <svg> would survive a rebuild, a class on a discarded <text> does not).
		applyLabelVisibility();
	}
	function updateLinkGeometry(id) {
		var l = linkById(id), le = linkEls[id];
		le.line.setAttribute('points', linkPoints(l));
		if (le.halo) { le.halo.setAttribute('points', linkPoints(l)); }
		layoutLinkLabel(id);
		if (l.lenAuto) { l._length = linkGeomLength(l); }   // base-write: auto length follows the drawing, and geometry is Base-owned
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
		var lb = labelById(id), le = labelEls[id], an, px, py, box, halfW, att;
		if (!lb.anchorNode) {
			le.text.setAttribute('x', lb.x); le.text.setAttribute('y', lb.y);
			applyTextLabelRotation(lb, le, lb.x, lb.y);
			return;
		}
		an = nodeById(lb.anchorNode); px = an.x + lb.x; py = an.y + lb.y;
		// THE LEADER ATTACHES TO THE BOX, NOT TO THE ANCHOR POINT. It used to read px straight as
		// the box centre, which was true only while every Text label was centred; with lb.align in
		// the document the two are different numbers, and the leader would otherwise reach for a
		// place the text is not. Centred labels get identical geometry to before, by construction.
		box = textLabelBox(lb, le, px, py);
		halfW = box.w / 2;
		att = Geom.leaderAttach(le.side, box.x + halfW, halfW, an.x, ADVERSE_FRAC);
		le.side = att.side;
		le.leader.setAttribute('x1', an.x); le.leader.setAttribute('y1', an.y);
		le.leader.setAttribute('x2', att.x); le.leader.setAttribute('y2', box.y + box.h / 2);
		le.text.setAttribute('x', px); le.text.setAttribute('y', py);
		applyTextLabelRotation(lb, le, px, py);
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
		if (linkEls[l.id].halo) { linkEls[l.id].halo.remove(); }
		linkEls[l.id].handles.forEach(function (h) { h.remove(); });
		linkEls[l.id].arrows.forEach(function (a) { a.remove(); });
		linkEls[l.id].text.remove();
		linkEls[l.id].leader.remove();
		if (linkEls[l.id].symbolG) { linkEls[l.id].symbolG.remove(); }
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
	function bbox(opts) {
		var ignoreDataLabels = !!(opts && opts.ignoreDataLabels);
		var minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity, i, j;
		function inc(x, y) {
			if (x < minx) { minx = x; } if (x > maxx) { maxx = x; }
			if (y < miny) { miny = y; } if (y > maxy) { maxy = y; }
		}
		if (doc.nodes.length === 0) { return { minx: 0, maxx: 10, miny: 0, maxy: 10 }; }
		for (i = 0; i < doc.nodes.length; i++) {
			var n = doc.nodes[i], r = nodeRadius(n) + 0.2, ne = nodeEls[n.id] || {},
				tw = labelBoxWidth(ne) || 8, lc = ne.lineCount || 1,
				nlx = ne.text ? +ne.text.getAttribute('x') : n.x + 2, nly = ne.text ? +ne.text.getAttribute('y') : n.y - 2;
			inc(n.x - r, n.y - r); inc(n.x + r, n.y + r);
			// **A LABEL THAT IS NOT DRAWN RESERVES NO ROOM** (Tom, 2026-08-15: *"Zoom to Fit is
			// giving me unexpected padding even with all labels off at that zoom."* — it was
			// reserving space for every hidden label). Zoom-to-fit is a question about what is on
			// the screen, so it has to ask the same question the renderer just answered.
			//
			// It settles at the state the user could SEE when they pressed the button, which is the
			// honest reading of "fit this". Fitting can zoom in far enough to bring the labels back,
			// and then they are outside the box that was fitted -- accepted deliberately, because
			// the alternative is a fit that re-decides its own inputs and never converges.
			if (ignoreDataLabels) { continue; }
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
				// The label's OWN box, at its OWN anchor (Task 332) -- px/py is not necessarily
				// its centre any more. The height is the label's own rendered height rather than
				// a constant: this was a hardcoded 2, correct only while the text size was 2.5,
				// and at the shipped default a title at sizeMult 2 is 40 units tall while bbox()
				// reserved 4, so zoom-to-fit clipped it. Found 2026-08-09 adding the example's
				// title block (Task 254).
				lbox = textLabelBox(lb, le, px, py);
			// Same rule for an authored label, which has its OWN threshold (Task 340): a note that
			// has vanished at this zoom is not part of what is being fitted, while a title block
			// pinned with "Always show" still is.
			if (ignoreDataLabels && le.text && le.text.classList &&
				le.text.classList.contains('lpn-lbl-hidden')) { continue; }
			inc(lbox.x, lbox.y); inc(lbox.x + lbox.w, lbox.y + lbox.h);
		}
		for (i = 0; i < doc.links.length; i++) {
			for (j = 0; j < doc.links[i].verts.length; j++) {
				var v = doc.links[i].verts[j];
				inc(v.x - 0.65, v.y - 0.65); inc(v.x + 0.65, v.y + 0.65);
			}
			var l = doc.links[i], lle = linkEls[l.id];
			// A REPEATED CHAIN CONTRIBUTES NOTHING HERE, ON PURPOSE. Its labels lie along the pipe,
			// whose own points are already counted above -- and reading their rendered positions
			// would make zoom-to-fit depend on the view it started from, because how many of them
			// exist and which are drawn are both functions of the current zoom. That circularity is
			// the Task 332 defect wearing different clothes; the cheapest way not to have it is not
			// to ask. A lone label still counts: it sits off to the side of its pipe and nothing
			// else in this loop knows where.
			// ALIGNED rather than "is it a chain": a chain's station count is a function of the
			// current zoom, and bbox() feeding zoom-dependent numbers into the fit is what made the
			// fit depend on the view it started from. Aligned is a SETTING, and an aligned label
			// lies along its pipe, whose own points are already counted -- so this is both the same
			// exclusion and a deterministic one.
			if (lle && (ignoreDataLabels || linkLabelAligned(l))) { continue; }
			if (lle) {
				var lx = +lle.text.getAttribute('x'), ly = +lle.text.getAttribute('y'),
					ltw = labelBoxWidth(lle) || 8, llc = lle.lineCount || 1;
				inc(lx, ly - 2); inc(lx + ltw, ly + 0.6 + (llc - 1) * effectiveLineHeight());
			}
		}
		return { minx: minx, maxx: maxx, miny: miny, maxy: maxy };
	}
	// Height an absolutely-positioned canvas overlay occupies, measured rather than guessed --
	// #lpn_mode_hint and #lpn_map_footer are both 11px text whose height depends on the font that
	// actually rendered, and either can wrap to two lines (the mode hint in several languages, the
	// footer on a narrow window). Returns 0 for an absent or empty overlay, so a hidden readout
	// costs no margin. Measured on the footer WRAPPER, not on the coordinate box inside it: the
	// wrapper is what actually occupies the bottom of the canvas once the strip wraps.
	// **THE RESERVE MUST NOT DEPEND ON WHETHER THE OVERLAY HAS BEEN FILLED IN YET** (Tom, 2026-08-15,
	// guessing the cause from the outside and getting it right: *"Switching tabs still changes the
	// zoom. Could it be affected by the Mode string?"* — it could, and it was).
	//
	// This used to return 0 for an element with no text, and both overlays it is asked about are
	// EMPTY IN THE MARKUP and filled by JS: `#lpn_mode_hint` by updateModeHint(), `#lpn_map_footer`
	// by refreshMapStatus(). So a fit that happened before those ran reserved nothing, took the
	// ~25px back as drawing room, and came out ZOOMED IN relative to every later fit — which is
	// exactly the pair of symptoms reported: the project open at reload zooms in, and switching to
	// it later gives a different answer.
	//
	// Both of these overlays are permanent furniture; neither is ever legitimately blank once the
	// page is running. So an empty one is not "no overlay", it is "not filled in yet", and the
	// honest reserve is the space it is ABOUT to take: one line of its own font.
	function overlayReserve(id) {
		var e = document.getElementById(id);
		if (!e) { return 0; }
		var h = e.offsetHeight;
		if (!h || !e.textContent.trim()) {
			// One line, derived from the element's own computed font-size rather than a constant, so
			// it stays right in a language whose glyphs are taller and at any browser text size.
			var fs = 11;
			if (window.getComputedStyle) {
				var cs = parseFloat(window.getComputedStyle(e).fontSize);
				if (cs > 0) { fs = cs; }
			}
			h = Math.ceil(fs * 1.35);
		}
		return h + 8;   // its own height plus a little clear air
	}

	// **THE POST-SOLVE RE-FIT IS GONE** (Tom, 2026-08-15: *"Post-solve re-fit: I am not a believer.
	// I say it's illegal. A little overhang in this case is okay now that views are saved."*).
	//
	// It existed because zoomExtent() measures RENDERED label text, and a network created in code is
	// fitted before its first solve has produced any label content -- so the fit was to bare symbols
	// and the labels overflowed the map when they appeared 300ms later. A second fit hid that.
	//
	// It is illegal under the rule Tom set the same day: the view is saved data, and the app does not
	// move saved data behind the user's back. The overhang it was hiding is a few pixels of label at
	// the edge of a view nobody had chosen yet, on a drawing that has just appeared -- against a
	// zoom that jumps under the reader's hands a third of a second after they arrive. The first is
	// a blemish; the second is the map moving on its own.

	var LPN_FIT_BISECTIONS = 60;
	// One drawn thing: a world anchor, and how far its ink reaches from that anchor in SCREEN
	// pixels. A reach may be NEGATIVE (ink that begins to the right of its own anchor); the
	// arithmetic does not care, and clamping it would move labels that were never in the way.
	function fitItem(out, x, y, l, r, t, b) {
		if (isFinite(x) && isFinite(y)) { out.push({ x: x, y: y, l: l, r: r, t: t, b: b }); }
	}
	// `atScale` is the scale being CONSIDERED, which is not the same as the one currently in force.
	// Two of the rules about what gets drawn are thresholds -- the map-width one that hides all
	// annotation, and the per-pipe one that hides a label longer than its own pipe -- and both must
	// be answered for the scale being tested, or the fit reserves room for labels that will not be
	// there (or crops ones that will). They are booleans, so they cannot be solved for directly;
	// zoomExtent() settles them by re-solving, which costs arithmetic and nothing else.
	function fitItems(atScale, modelOnly) {
		var out = [], sc = state.s || 1,
			lim = settings.labelMaxWidth,
			// The same MIN question the threshold itself asks (see mapSpan()), but asked about the
			// scale being considered rather than the one in force.
			mapW = Math.min(svg && svg.clientWidth ? svg.clientWidth : 0,
				svg && svg.clientHeight ? svg.clientHeight : 0) / (atScale || 1),
			ignoreDataLabels = modelOnly || (typeof lim === 'number' && lim > 0 && mapW > lim);
		function boxFor(x, y, bx, by, bw, bh) {
			fitItem(out, x, y, (x - bx) * sc, (bx + bw - x) * sc, (y - by) * sc, (by + bh - y) * sc);
		}
		// **EVERY QUANTITY IN HERE MUST BE px/s, OR IT IS NOT SCALE-INVARIANT AFTER ALL.** This is
		// the one trap in the whole approach and it caught me first time: the old bbox() carried
		// world-unit fudges (a bare `- 2` above the baseline, a `+ 0.6` below it, `+ 0.2` of air
		// round a node), and multiplying a WORLD constant by the scale produces a pixel figure that
		// changes with the zoom -- reintroducing, in miniature, the exact dependence this design
		// exists to remove. Everything below is now built from effectiveFontSize(), nodeRadius() and
		// symbolFactor(), all of which are a pixel size divided by the scale, so the multiplication
		// gives the pixel size straight back. Any constant added here belongs in PIXELS.
		var ascent = effectiveFontSize() * 0.85;
		// **BUILT FROM THE MODEL, NEVER FROM THE RENDERED POSITION** -- and this is what makes a fit
		// IDEMPOTENT, which is the property Tom went looking for: *"a simple test is to open,
		// reload, or switch and then zoom extents. Ideally nothing happens."*
		//
		// Reading each label's drawn x/y looks more accurate and is the thing that ruined it. Those
		// positions carry the collision pass's NUDGE and the arrow DODGE, both of which are computed
		// in world units against pipes whose length in pixels changes with the zoom -- so the fit's
		// input moved every time the fit moved the view, and pressing Zoom to fit twice gave two
		// answers. Using the label's HOME position instead (anchor + its own stored offset) leaves
		// nothing in the list that depends on the scale, so the second press has nothing left to
		// change.
		//
		// What that costs is a label the relaxation pushed outward by a few pixels being a few
		// pixels closer to the edge than the arithmetic thinks. The fit already reserves 16px, and a
		// nudge is small compared with that -- a fair price for an answer that holds still.
		doc.nodes.forEach(function (n) {
			var rad = nodeRadius(n) * sc + 1, ne = nodeEls[n.id] || {};
			fitItem(out, n.x, n.y, rad, rad, rad, rad);
			if (ignoreDataLabels || !ne.text || ne.empty) { return; }
			// **THE SIDE COMES FROM THE MODEL, NOT FROM ne.side.** ne.side is render state left over
			// from the last layout, so a fit arriving from a 0.02x view saw labels banked on the
			// opposite side from one arriving at 1x and landed 24 px away in tx -- the exact
			// dependence the paragraph above exists to remove, hiding in the one line that still
			// read the drawing. Derived here the way dataLabelOrigin() derives it for an
			// auto-placed label, from the HOME position, which is a model quantity.
			var tw = labelBoxWidth(ne) || 8, lc = ne.lineCount || 1, base = nodeLabelBase(n),
				lx = (base.x >= n.x) ? base.x : base.x - tw;
			boxFor(n.x, n.y, lx, base.y - ascent, tw, dataLabelBoxHeight(lc));
		});
		doc.links.forEach(function (l) {
			var le = linkEls[l.id], j, v, vr = VERTEX_HANDLE_R * symbolFactor() * sc;
			for (j = 0; j < l.verts.length; j++) {
				v = l.verts[j];
				fitItem(out, v.x, v.y, vr, vr, vr, vr);
			}
			// An ALIGNED label lies along its pipe, whose own points are already here, and so do a
			// repeated chain's copies. Counting them again would add a term that moves with the
			// zoom, which is the whole thing this design removes.
			if (!le || !le.text || le.empty || ignoreDataLabels || linkLabelAligned(l)) { return; }
			// The UNDODGED midpoint, for the same reason: the arrow dodge slides the label along the
			// pipe by a world distance derived from the arrow's pixel size, so it moves with the
			// zoom. It also never leaves the pipe, whose own points are already in this list.
			var pts = linkPointList(l), mid = Geom.pointAlongPolyline(pts, LINK_LABEL_ALONG),
				d = defaultLabelOffset(),
				tw = labelBoxWidth(le) || 8, lc = le.lineCount || 1,
				ex = mid.x + (l.lx !== undefined ? l.lx : d.x),
				ey = mid.y + (l.ly !== undefined ? l.ly : d.y),
				lx = (le.side === 'left') ? ex - tw : ex, ly = ey;
			// TOO SHORT A PIPE DRAWS NO LABEL, and whether a pipe is too short is a question about
			// the scale being tested: the label is a fixed width in pixels, so it covers more of a
			// pipe the further out you are. Asked here at atScale rather than at the current one.
			if (tw * sc / (atScale || 1) * SHORT_LINE_MULT > Geom.polylineLength(linkPointList(l))) { return; }
			boxFor(mid.x, mid.y, lx, ly - ascent, tw, dataLabelBoxHeight(lc));
		});
		doc.labels.forEach(function (lb) {
			var le = labelEls[lb.id]; if (!le) { return; }
			if (ignoreDataLabels && le.text && le.text.classList &&
				le.text.classList.contains('lpn-lbl-hidden')) { return; }
			var an = lb.anchorNode ? nodeById(lb.anchorNode) : null,
				px = an ? an.x + lb.x : lb.x, py = an ? an.y + lb.y : lb.y,
				box = textLabelBox(lb, le, px, py);
			boxFor(px, py, box.x, box.y, box.w, box.h);
		});
		// An empty drawing still needs two distinct points, or every scale "fits" and the bisection
		// returns MAX_SCALE on a blank canvas.
		if (out.length < 2) { fitItem(out, 0, 0, 0, 0, 0, 0); fitItem(out, 10, 10, 0, 0, 0, 0); }
		return out;
	}
	// The translation window for one axis at one scale. `need > room` means this scale does not fit;
	// the midpoint of the two centres the drawing in whatever slack is left over.
	function fitWindow(items, s, key, loKey, hiKey, span, padLo, padHi) {
		var need = -Infinity, room = Infinity, i, it;
		for (i = 0; i < items.length; i++) {
			it = items[i];
			need = Math.max(need, padLo + it[loKey] - s * it[key]);
			room = Math.min(room, span - padHi - it[hiKey] - s * it[key]);
		}
		return { need: need, room: room, fits: need <= room, t: (need + room) / 2 };
	}
	function fitScaleFor(items, key, loKey, hiKey, span, padLo, padHi) {
		function fits(s) { return fitWindow(items, s, key, loKey, hiKey, span, padLo, padHi).fits; }
		// Not even the smallest allowed zoom fits it, which happens when one label on its own is
		// wider than the canvas. There is nothing to solve; take the floor and let it overhang.
		if (!fits(MIN_SCALE)) { return MIN_SCALE; }
		if (fits(MAX_SCALE)) { return MAX_SCALE; }
		var lo = MIN_SCALE, hi = MAX_SCALE, k, mid;
		for (k = 0; k < LPN_FIT_BISECTIONS; k++) {
			mid = (lo + hi) / 2;
			if (fits(mid)) { lo = mid; } else { hi = mid; }
		}
		return lo;
	}
	// ---- REMEMBERING WHERE YOU WERE: in memory per tab, and saved to the file --------------------
	//
	// No fit, however exact, is as good as putting the reader back where they were.
	//
	// **A VIEW IS A CENTRE AND A SCALE, NOT A WORLD EXTENT**, for two independent reasons:
	//
	//   * IT MATCHES RESIZE. Shrinking the window keeps the SCALE and shows less of the drawing (us,
	//     and epanetjs). If reopening at that window size instead re-fitted the model into it, the
	//     app would answer one question two ways depending on whether the window changed while it
	//     was open.
	//   * IT IS EXACT. Restoring an extent recomputes the scale as min(W/w, H/h), so a canvas one
	//     pixel different -- which the height dead band permits -- comes back at a slightly
	//     different zoom, and cycling switch-window then zoom-to-fit visibly moves. A stored scale
	//     is copied verbatim and cannot drift.
	//
	// The COST, stated because it is real: opening a big model on a phone shows a fragment at the
	// desktop's magnification rather than the whole intended view, small. Tom's use case (b) is that
	// this is the honest outcome -- "you see the area of the pipe change. You blink your eyes. Good.
	// You should."
	function currentView() {
		var w = svg && svg.clientWidth ? svg.clientWidth : 0,
			h = svg && svg.clientHeight ? svg.clientHeight : 0,
			sc = state.s || 1;
		if (!w || !h) { return null; }
		// cx/cy: the world point in the middle. s: pixels per world unit, the same number a resize
		// holds constant.
		return { cx: (w / 2 - state.tx) / sc, cy: (h / 2 - state.ty) / sc, s: sc };
	}
	function validView(v) {
		if (!v || !isFinite(v.cx) || !isFinite(v.cy)) { return false; }
		// The w/h form is the world-extent record that stood between two rounds of review. Still
		// read so nothing saved in that window opens wrong; never written.
		if (isFinite(v.w) && isFinite(v.h) && v.w > 0 && v.h > 0) { return true; }
		return isFinite(v.s) && v.s > 0;
	}
	function applyView(v) {
		var w = svg && svg.clientWidth ? svg.clientWidth : 0,
			h = svg && svg.clientHeight ? svg.clientHeight : 0, sc;
		if (!validView(v) || !w || !h) { return false; }
		sc = isFinite(v.s) ? v.s : Math.min(w / v.w, h / v.h);
		sc = Math.max(MIN_SCALE, Math.min(MAX_SCALE, sc));
		state.s = sc;
		state.tx = w / 2 - sc * v.cx;
		state.ty = h / 2 - sc * v.cy;
		setTransform();
		// **A PAN IS NOT A ZOOM, AND ONLY A ZOOM NEEDS A RE-LAYOUT.** Everything onZoomChanged()
		// rebuilds -- font sizes, tspan spacing, label boxes, the collision pass -- depends on the
		// SCALE and on nothing else. Restoring a view at the scale already in force (switching to a
		// tab and back, which is the commonest case there is) therefore costs one transform, where
		// it used to cost a full relayout: over a second on Net3.
		//
		// **COMPARED AGAINST THE SCALE THE LAYOUT WAS COMPUTED AT, NOT THE ONE WE ARRIVED WITH.**
		// The first version asked "did the scale change in this call", which is the wrong question:
		// it answers "no" for a view restored at a scale that merely MATCHES the live transform,
		// while the labels on screen were laid out for some earlier one. Asking whether the layout
		// belongs to the scale being displayed is the honest test, and it self-heals any path that
		// changes the transform without saying so.
		if (state.s !== lastLayoutScale) { onZoomChanged(); }
		return true;
	}
	// Per TAB, in memory only, and deliberately not in the library index: this is where you were
	// looking a moment ago, which is a fact about this browsing session rather than about the
	// project. The file carries its own copy for the next time it is opened cold.
	var tabViews = {}, pendingView = null;
	function rememberCurrentView() {
		var v = currentView();
		if (v && library.openId) { tabViews[library.openId] = v; }
	}
	// Where a project open goes instead of straight to a fit. The in-memory view wins over the
	// file's: it is the more recent answer to the same question, and it is the one the user was
	// looking at thirty seconds ago.
	function restoreViewOrFit() {
		var v = tabViews[library.openId] || pendingView;
		pendingView = null;
		if (validView(v)) {
			if (!mapSized) { pendingRestore = v; fitWhenSized = true; return; }
			if (applyView(v)) { return; }
		}
		// Nothing to restore. **THE ONE AUTOMATIC FIT LEFT, AND WHY IT SURVIVES.** Tom, having had
		// the other six removed: *"Overall refitting and re-baselining: I see it as vanishingly
		// defensible."* Vanishingly, not entirely -- a document with no stored view has to be given
		// one, and there is no other candidate. That is every file written before views were saved
		// and every .inp ever imported. It happens ONCE per such document: the moment it is saved it
		// carries a view, and this never runs for it again.
		//
		// An EMPTY drawing is not such a document. It has no extent, so bbox() falls back to an
		// invented 0-10 square and the "fit" would be a zoom to nothing (Tom: *"Boot: Empty map? Why
		// is a zoom needed?"*).
		if (!doc.nodes.length) { return; }
		zoomExtent(true);
	}
	// `auto` marks a fit NOBODY ASKED FOR: boot, a freshly drawn example, a document with no stored
	// view, the deferred fit that runs once the canvas has a height. Those establish a view rather
	// than changing one, so they re-baseline a clean project instead of dirtying it. A fit the user
	// pressed the button for is an edit like any other -- Tom, 2026-08-15: *"AutoCAD registers a
	// zoom or pan as a change. But there are no automatic zooms or pans."*
	// Room left for the labels on the FIRST of zoomExtent()'s two passes, in text heights. Tom,
	// 2026-08-16: *"likely 6 (or whatever) text heights of padding will be zoomed out a little much
	// for most models. When we adjust zoom after placing all labels, they will fit just a little
	// better, and so we can leave them alone."* Exactly so -- the first pass is deliberately a touch
	// generous, so the labels it lays out are comfortable at the tighter scale the second pass
	// picks, and nothing has to be recomputed to check.
	var FIT_LABEL_ROOM_TEXT_HEIGHTS = 6;
	function zoomExtent(auto) {
		if (!mapSized) { fitWhenSized = true; autoFitWhenSized = autoFitWhenSized || !!auto; return; }
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
		var r = svg.getBoundingClientRect(), pad = 16,
			padTop = Math.max(pad, overlayReserve('lpn_mode_hint')),
			padBottom = Math.max(pad, overlayReserve('lpn_map_footer'));
		var items, s;
		function solve(extra) {
			var e = extra || 0;
			return Math.min(fitScaleFor(items, 'x', 'l', 'r', r.width, pad + e, pad + e),
				fitScaleFor(items, 'y', 't', 'b', r.height, padTop + e, padBottom + e));
		}
		function apply(v) {
			state.s = v;
			state.tx = fitWindow(items, v, 'x', 'l', 'r', r.width, pad, pad).t;
			state.ty = fitWindow(items, v, 'y', 't', 'b', r.height, padTop, padBottom).t;
			setTransform();
			onZoomChanged();
		}
		// **TWO SOLVES, NOT A CONVERGENCE LOOP.** Tom, 2026-08-16: *"we zoom to that, calculate
		// labels once, then zoom again without recalculating."*
		//
		//   1. fit the MODEL ALONE, with six text heights of extra room, so the answer cannot depend
		//      on the view we arrived from and the labels get somewhere comfortable to land.
		//   2. work out the labels ONCE, at that scale.
		//   3. fit again to the model plus those label boxes, without recomputing them.
		//
		// It replaced an iterate-until-stable loop, which was not deterministic: it seeded from
		// state.s, so arriving from a 0.02x view -- where a label is 550 world units of lettering --
		// gave a different answer from arriving at 1x, and no number of rounds fixed that because
		// the starting point was the problem.
		//
		// The rejected alternative was Tom's own first suggestion, a flat padding of about six text
		// heights: *"Is that too sloppy? It might cause trouble on small maps."* It is, and for that
		// reason -- a fixed pad is most of a small map and nothing on a large one.
		//
		// What this deliberately accepts: the labels are laid out for step 1's scale, not step 3's,
		// so a label can end fractionally outside the padding. A stable, predictable fit is worth
		// more than chasing a fixed point that moves as you approach it.
		items = fitItems(state.s, true);
		s = solve(labelTuning().fitRoom * settings.textSize);
		items = fitItems(s);
		s = solve();
		apply(s);
		if (auto) { rebaseSignatureIfClean(); }
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
	}
	// Cap the longest side at 1600px before storing (scope doc: "a scanned plan can be large, so
	// downscale on import and record the original dimensions") -- nothing else in this feature bounds
	// the localStorage footprint of a phone photo or a large scanned plan. PNG output, not JPEG: a
	// scanned plan's thin lines are exactly what a lossy re-encode would blur; size is bounded by
	// this cap instead.
	var BACKDROP_MAX_SIDE = 1600;
	// RE-ENCODE EVEN WHEN NOTHING IS RESIZED, AND KEEP WHICHEVER IS SMALLER.
	//
	// The cap alone does not bound the footprint, because an UNCOMPRESSED format can be enormous at
	// a perfectly ordinary pixel size. Tom's colleague exports utility maps as Windows BMP, and the
	// one he sent (2026-08-11) is 640 x 782 -- comfortably under the cap, so the old code stored it
	// exactly as it arrived: 1.5 MB, which is ~1.96 MB once base64 makes it a data URI, out of a
	// localStorage budget of about 5 MB for every project this browser holds. Re-encoded as PNG the
	// same picture is ~67 KB. That is 22x, on a file that needed no resizing at all.
	//
	// Whichever-is-smaller rather than always-PNG, because always-PNG is wrong in the other
	// direction: re-encoding a photographic JPEG as lossless PNG typically INFLATES it several
	// times over. Comparing the two lengths needs no format table, no sniffing, and no list of
	// exceptions to get out of date -- it just asks the question that actually matters.
	function downscaleImage(dataUrl, maxSide, cb) {
		var img = new Image();
		img.onload = function () {
			var scale = Math.min(1, maxSide / Math.max(img.width, img.height)),
				canvas = document.createElement('canvas'), out;
			canvas.width = Math.round(img.width * scale); canvas.height = Math.round(img.height * scale);
			canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
			// PNG, not JPEG: a scanned plan's thin lines are exactly what a lossy re-encode blurs.
			out = canvas.toDataURL('image/png');
			// Only a full-size re-encode is a fair swap for the original. A DOWNSCALED one has to
			// win by default -- the original is the wrong number of pixels, whatever it weighs.
			if (scale === 1 && dataUrl.length <= out.length) { out = dataUrl; }
			cb(out, img.width, img.height);
		};
		// A FILE THE BROWSER CANNOT DECODE MUST SAY SO. What we can accept is not a list we choose --
		// it is whatever this browser's own image decoder handles, and the picker cannot know that.
		// TIFF is the one that bites: no major browser decodes it, yet the OS reports it as
		// image/tiff, so it sailed through the type filter, failed here, and -- with only an onload
		// handler -- did NOTHING AT ALL. No image, no message, no way to tell that from a picture
		// placed somewhere off screen, which is the other half of Tom's "I cannot find the image".
		img.onerror = function () {
			var pc = EngCalcs.pageConfig || {};
			alert(pc.lpn_backdrop_unreadable || 'This picture cannot be shown by your web browser. Save it as a PNG or JPEG picture and add it again.');
		};
		img.src = dataUrl;
	}
	// Initial placement, SIZE AND POSITION TOGETHER: the new image's longer side roughly matches the
	// current network's own bbox extent (a fixed default when the network is empty), aspect-ratio-
	// preserved, CENTRED ON THAT BBOX -- Scale/Position are how the user then registers it precisely.
	// An explicit open question in the Phase 0 acceptance doc ("no way to *position* a freshly loaded
	// backdrop relative to a grid already on screen... decide in Phase 2, not now") -- the spike's own
	// arbitrary fixed 40x30 wasn't ported.
	//
	// THE CENTRING IS THE HALF THAT WAS MISSING, and without it the size was no help (Tom,
	// 2026-08-14: "I added a background image to an existing model, and I cannot find the image").
	// The image landed at tx/ty = 0, i.e. the world ORIGIN, which is nowhere near a network imported
	// with real survey or state-plane coordinates -- a correctly-sized picture, hundreds of thousands
	// of units off screen, with the only controls that could move it (Scale, Move) needing you to
	// click on the thing you cannot see. Sizing a picture to a model you are not putting it on top of
	// is a fit in one dimension only; the pair is what makes it "at least visible".
	function initialBackdropPlacement(iw, ih) {
		var b = bbox(), extent = Math.max(b.maxx - b.minx, b.maxy - b.miny, 1),
			target = doc.nodes.length > 0 ? extent : 40, longer = Math.max(iw, ih), scale = target / longer,
			width = iw * scale, height = ih * scale;
		// backdrop.x/y stay 0 and s stays 1 on a fresh image, so the world position of the image's
		// top-left corner is exactly tx/ty -- see applyBackdropTransform().
		return {
			width: width, height: height,
			tx: (b.minx + b.maxx) / 2 - width / 2,
			ty: (b.miny + b.maxy) / 2 - height / 2
		};
	}
	function addBackdropFromDataUrl(dataUrl, done) {
		logLpnFirstAction('backdrop');
		downscaleImage(dataUrl, BACKDROP_MAX_SIDE, function (href, iw, ih) {
			var p = initialBackdropPlacement(iw, ih);
			backdrop = { href: href, iw: iw, ih: ih, x: 0, y: 0, width: p.width, height: p.height, tx: p.tx, ty: p.ty, s: 1 };
			buildBackdropImg();
			saveToStorage();
			// Anything that wants to register the image has to wait for this: downscaleImage() is
			// asynchronous, so `backdrop` does not exist yet when the caller returns.
			if (done) { done(); }
		});
	}

	// ---- pixel size, typed rather than picked (Task 276) ----
	// Tom, 2026-08-10: "mouse (and hand!!!) picking is never precise". Picking stays as the coarse
	// step; this is the correction. `backdrop.s` scales the PLACEMENT BOX, not the image's own
	// pixels, so the number a user actually thinks in -- ground distance per ORIGINAL image pixel --
	// is one conversion away from it. `downscaleImage()` reports the original iw/ih rather than the
	// downscaled canvas size, which is what makes this hold for a big image that was shrunk on the
	// way in; do not "tidy" that callback into passing canvas.width.
	function backdropPixelSize() {
		if (!backdrop || !backdrop.width || !backdrop.iw) { return 0; }
		return backdrop.s * backdrop.width / backdrop.iw;
	}
	function setBackdropPixelSize(p) {
		if (!backdrop || !(p > 0) || !backdrop.width || !backdrop.iw) { return; }
		backdrop.s = p * backdrop.iw / backdrop.width;
		applyBackdropTransform();
		saveToStorage();
	}
	function formatPixelSize(p) { return p > 0 ? String(+p.toPrecision(8)) : ''; }

	// A world file is six numbers, one per line: A, D, B, E, C, F. A and E are the pixel size, E
	// negative because image rows run downward while map Y runs up; D and B are rotation terms; C and
	// F are the map coordinates of the CENTRE of the upper-left pixel. It gives pixel size directly,
	// which is strictly more than EPANET's own method asks for, at the cost of a six-line parse.
	function parseWorldFile(text) {
		var lines = String(text || '').split(/[\r\n]+/).map(function (s) { return s.trim(); })
			.filter(function (s) { return s !== ''; });
		if (lines.length !== 6) { return null; }
		var n = lines.map(Number), i;
		for (i = 0; i < 6; i++) { if (!isFinite(n[i])) { return null; } }
		return { A: n[0], D: n[1], B: n[2], E: n[3], C: n[4], F: n[5], ok: worldFileRepresentable(n) };
	}
	// Our transform is translate + ONE uniform positive scale (applyBackdropTransform) -- no rotation,
	// no skew, no mirroring, no independent X/Y. A file that asks for any of those cannot be honoured,
	// so it is refused with a message rather than half-applied from A alone.
	function worldFileRepresentable(n) {
		var A = n[0], D = n[1], B = n[2], E = n[3];
		if (D !== 0 || B !== 0) { return false; }
		if (!(A > 0) || !(E < 0)) { return false; }
		return Math.abs(A + E) <= 1e-9 * Math.abs(A);
	}
	// Scale AND location together -- that is the whole content of a world file, and applying half of
	// it would leave the image correctly sized in the wrong place.
	function applyWorldFile(w) {
		if (!backdrop || !backdrop.width || !backdrop.iw) { return; }
		backdrop.s = w.A * backdrop.iw / backdrop.width;
		// C,F name the pixel CENTRE, so the image's top-left CORNER is half a pixel out in each
		// direction; -E/2 is positive because E is negative. Both are Cartesian, which since Task 274
		// is also the document's own convention -- but the INTERNAL frame is still Y-down, so the Y
		// crosses the same boundary applySaved() crosses.
		var cornerX = w.C - w.A / 2, cornerY = w.F - w.E / 2;
		backdrop.tx = inwardX(cornerX) - backdrop.x * backdrop.s;
		backdrop.ty = inwardY(cornerY) - backdrop.y * backdrop.s;
		applyBackdropTransform();
		saveToStorage();
	}
	function readWorldFile(file) {
		var pc = EngCalcs.pageConfig || {}, reader = new FileReader();
		reader.onload = function (ev) {
			var w = parseWorldFile(ev.target.result);
			if (!w) { alert(pc.lpn_backdrop_scale_entry_bad || 'Type one number for the size of one pixel on the map, or paste all six lines of a world file.'); return; }
			if (!w.ok) { alert(pc.lpn_backdrop_wld_bad || 'This world file rotates, mirrors or unevenly stretches the picture. The map can only move a picture and resize it by the same amount in both directions, so the file was not used.'); return; }
			applyWorldFile(w);
		};
		reader.readAsText(file);
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
	// The typed half of Task 276. One box takes either form, because a user who has a world file and a
	// user who has a number are asking for the same thing. Tom's wording, used verbatim: "Enter pixel
	// size or paste the complete contents of the World File for the image" -- he wanted the paste
	// spelled out rather than left to be discovered ("I don't like the paste unless it's very clear;
	// it could get confusing").
	function startBackdropScaleEntry() {
		cancelActive();
		if (!backdrop) { return; }
		var pc = EngCalcs.pageConfig || {}, ta = null;
		openDialog(function (body) {
			var p = document.createElement('p');
			p.style.margin = '0 0 8px';
			p.textContent = (pc.lpn_backdrop_scale_entry_prompt || 'Enter the size of one pixel on the map, or paste the complete contents of the world file for the image')
				+ ' (' + unitLabel('lpn_u_length') + ')';
			body.appendChild(p);
			// A textarea, not a number input: a pasted world file is six lines, and a control that
			// cannot hold them would make half the label a lie.
			ta = document.createElement('textarea');
			ta.rows = 6; ta.style.width = '100%'; ta.style.boxSizing = 'border-box';
			ta.value = formatPixelSize(backdropPixelSize());
			body.appendChild(ta);
		}, [
			{ label: pc.lpn_backdrop_continue || 'Continue', fn: function () { applyScaleEntry(ta ? ta.value : ''); } },
			{ label: pc.lpn_cancel || 'Cancel', fn: function () { } }
		]);
		if (ta) { ta.focus(); ta.select(); }
	}
	function applyScaleEntry(text) {
		var pc = EngCalcs.pageConfig || {}, t = String(text || '').trim(), one = Number(t), w;
		// Number('1\n2') is NaN, so a six-line paste never reads as a single number by accident.
		if (t !== '' && isFinite(one)) {
			if (one > 0) { setBackdropPixelSize(one); return; }
		} else {
			w = parseWorldFile(t);
			if (w) {
				if (!w.ok) { alert(pc.lpn_backdrop_wld_bad || 'This world file rotates, mirrors or unevenly stretches the picture. The map can only move a picture and resize it by the same amount in both directions, so the file was not used.'); return; }
				applyWorldFile(w);
				return;
			}
		}
		alert(pc.lpn_backdrop_scale_entry_bad || 'Type one number for the size of one pixel on the map, or paste all six lines of a world file.');
	}
	// WE NEVER ASK FOR A WORLD FILE AS A FILE (Tom, 2026-08-13): "We don't ask for world file...
	// We ask for a paste of World File contents." An offerWorldFile() dialog used to open a SECOND
	// file picker the moment an image landed, and it is gone -- along with its three language keys
	// (lpn_backdrop_wld_ask/_none/_choose) and the hidden #lpn_backdrop_wld_file input.
	//
	// Nothing is lost, because both surviving doors already take the file's CONTENTS:
	//   - pick the image and its sidecar together in the one picker (readWorldFile, below), and
	//   - Background image > "Scale by world file or by the size of one pixel on the map", whose
	//     textarea accepts those same six lines pasted.
	// A sidecar still cannot be auto-detected in ANY browser -- a file picker returns the files the
	// user picked and nothing about their folder, and showDirectoryPicker is a far larger permission
	// ask and Chromium-only -- so a world file is always user-supplied, never discovered. That fact is
	// what made the deleted dialog's "No world file found" a report of a search that never ran.
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
			// ANCHORED ON THE MENUBAR, and it must stay something that is always in the DOM.
			// This hung off #lpn_backdrop_menu until Task 375's follow-up took the Background image
			// button off the toolbar: wireBackdropMenu() is now called with no argument and its
			// `if (into) { into.appendChild(menu); }` appends nothing, so the id resolved to null and
			// getBoundingClientRect() threw while evaluating the ARGUMENT -- before openPanelAtAnchor()
			// could set display:block. The panel never appeared and Move dead-ended after its second
			// alert with nothing on screen. Reported by Tom 2026-08-16.
			anchor = document.getElementById('lpn_menubar');
		// Placed and height-fitted by the one shared placer (Task 372), like every other panel that
		// hangs off a control. The fallback is a real rect, not a throw: a missing anchor is a
		// misplaced panel, which the user can still use, where a throw is an invisible one.
		openPanelAtAnchor(panel, anchor ? anchor.getBoundingClientRect()
			: { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 });
		activeCancel = function () { panel.style.display = 'none'; setRegMode(false); };
		document.getElementById('lpn_backdrop_target_continue').onclick = function () {
			var mode = document.getElementById('lpn_backdrop_target_mode').value, pc = EngCalcs.pageConfig || {};
			panel.style.display = 'none';
			if (mode === 'coords') {
				activeCancel = null; setRegMode(false);
				var txt = prompt((pc.lpn_backdrop_coords_prompt || 'Type the X,Y that point should move to') + ' (' + unitLabel('lpn_u_length') + '):', '');
				var parts = (txt || '').split(',').map(Number);
				// The one ENTRY site (Task 274): what the user types is Cartesian, and positionTo()
				// works in the internal Y-down frame.
				if (txt && !isNaN(parts[0]) && !isNaN(parts[1])) { positionTo(refWorld, { x: inwardX(parts[0]), y: inwardY(parts[1]) }); }
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
	// The five backdrop commands, in ONE implementation with two doors: the toolbar's button and the
	// Insert > Background image submenu (Tom, 2026-08-04: "In EPANET, Backdrop has its submenu, so
	// that's what the paradigm calls us to do... Can we duplicate the toolbar item into the pull-down
	// menu?" -- yes, and duplication between a menu and a toolbar is the correct relationship, not
	// something to clean up).
	function backdropAction(v) {
		var pc = EngCalcs.pageConfig || {};
		var fileInput = document.getElementById('lpn_backdrop_file');
		if (v === 'add') { cancelActive(); if (fileInput) { fileInput.click(); } }
		else if (v === 'scale') { startBackdropScale(); }
		else if (v === 'scale-entry') { startBackdropScaleEntry(); }
		else if (v === 'position') { startBackdropPosition(); }
		else if (v === 'remove') {
			if (window.confirm(pc.lpn_backdrop_remove_confirm || 'Remove the background image?')) { removeBackdrop(); }
		}
	}
	// The rows themselves, built fresh on every open so `disabled` is simply read from the current
	// state -- which is why the old updateBackdropMenuState() machinery is gone rather than kept as a
	// no-op. The COMMANDS are shared verbatim by both doors, so the two can no longer drift apart.
	//
	// The HEADING is what lets these be bare verbs. Tom, 2026-08-04, was right that "Scale"/"Position"
	// orphan in the Insert menu, "where nothing above them says what is being scaled" -- so something
	// does, and the object moves out of five labels into one word.
	//
	// But it belongs to ONE door, not both (Tom, 2026-08-13: "remove the top wording from the
	// Background image menu. It's unnecessarily redundant"). Off the toolbar button the heading
	// repeats the button you just clicked, which reads as a stutter; spliced into Insert it is the
	// only thing in sight that says what Add/Move/Remove act on. So `withHeading` is passed by the
	// Insert door alone. Do not "simplify" it back to always-on or always-off -- each door has been
	// ruled on separately, and the two rulings disagree for good reasons.
	function backdropRows(withHeading) {
		var pc = EngCalcs.pageConfig || {};
		return (withHeading ? [{ heading: true, label: pc.lpn_backdrop_menu || 'Background image…' }] : []).concat([
			{ icon: 'image', label: pc.lpn_backdrop_add || 'Add', fn: function () { backdropAction('add'); } },
			{ icon: 'scale', label: pc.lpn_backdrop_scale || 'Scale by picking', fn: function () { backdropAction('scale'); }, disabled: !backdrop },
			{ icon: 'scale', label: pc.lpn_backdrop_scale_entry || 'Scale by world file or by the size of one pixel on the map', fn: function () { backdropAction('scale-entry'); }, disabled: !backdrop },
			{ icon: 'position', label: pc.lpn_backdrop_position || 'Move', fn: function () { backdropAction('position'); }, disabled: !backdrop },
			{ icon: 'del', label: pc.lpn_backdrop_remove || 'Remove', fn: function () { backdropAction('remove'); }, disabled: !backdrop }
		]);
	}
	// `into` is optional as of 2026-08-15. The toolbar button is GONE (Tom: *"remove New project and
	// Background image from the toolbar"*) and Insert ▸ Background image is the only door -- but the
	// FILE INPUT's change handler still has to be attached, and it lived in here. Called with no
	// argument, this wires the picker and builds no button. Dropping the whole call would have left
	// the menu row opening a file dialog whose result nothing listened for: a picker that silently
	// does nothing, which is the worst kind of broken.
	function wireBackdropMenu(into) {
		var pc = EngCalcs.pageConfig || {}, menu = document.createElement('button');
		menu.type = 'button';
		// A BUTTON, not a <select> (Tom, 2026-08-13). A select is as wide as its widest option, so
		// "Scale by world file or by the size of one pixel on the map" set the width of a control that spends all its time
		// reading "Background image…" -- and the longer a command's name got, the more toolbar it
		// cost, which is a bad trade to have wired into the widget. A menu button is as wide as its
		// own label and nothing else. The id stays: showBackdropTargetPanel() positions the target
		// panel off this element's rect.
		menu.id = 'lpn_backdrop_menu';
		setLabel(menu, 'image', pc.lpn_backdrop_menu || 'Background image…');
		// stopPropagation for the same reason every menubar item does it -- see buildMenuBar().
		menu.addEventListener('click', function (e) { e.stopPropagation(); openMenu(e.currentTarget, backdropRows()); });
		var fileInput = document.getElementById('lpn_backdrop_file');
		fileInput.addEventListener('change', function () {
			// The picker accepts both the image and its world file, so sort what came back by type
			// rather than assuming files[0] is the picture.
			var picked = Array.prototype.slice.call(fileInput.files), img = null, sidecar = null, i;
			fileInput.value = '';
			// A world file is named by its EXTENSION, because it has no MIME type of its own -- an OS
			// may report it as text/plain, or as nothing at all. So the sidecar is identified first,
			// by name, and whatever else was picked is the picture. Testing the picture's type first
			// (the original order) went wrong in one silent way: a picture the OS reports with an
			// empty type left img null and the whole pick did nothing, which is the same dead end
			// Task 300 removed from downscaleImage().
			for (i = 0; i < picked.length; i++) {
				if (!sidecar && /\.(pgw|jgw|gfw|bpw|wld)$/i.test(picked[i].name)) { sidecar = picked[i]; }
				else if (!img) { img = picked[i]; }
			}
			if (!img) { return; }
			var reader = new FileReader();
			reader.onload = function (ev) {
				addBackdropFromDataUrl(ev.target.result, function () {
					// No sidecar picked means no prompt: the user scales from the Background image
					// menu when they are ready. We do not chase them for a file (see above).
					if (sidecar) { readWorldFile(sidecar); }
				});
			};
			reader.readAsDataURL(img);
		});
		if (into) { into.appendChild(menu); }
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
		'add-tank': 'lpn_mode_add_tank',
		'add-pipe': 'lpn_mode_add_pipe', 'add-pump': 'lpn_mode_add_pump',
		'add-valve': 'lpn_mode_add_valve', 'add-text': 'lpn_mode_add_text'
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
		var id = mintId(LPN_ID_KEY[type] || 'J');
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
		//
		// A TANK (Task 248, 2026-08-14) is the third node type and it is NOT a reservoir with a
		// head typed into it, even though a steady-state solve cannot tell the two apart. What
		// separates them is what happens next: a reservoir's level never moves, a tank's does.
		// Its `elev` is the BOTTOM of the vessel and its level is measured up from there, which is
		// EPANET's own convention and the reason the popup shows the water surface as a computed
		// row rather than as a second editable field -- two editable numbers that must agree is
		// exactly the "hidden curve" trap Tom named on the pump.
		var n;
		if (type === 'reservoir') {
			n = { id: id, type: type, x: x, y: y, elev: settings.defaults.nodeElev };
		} else if (type === 'tank') {
			n = { id: id, type: type, x: x, y: y, elev: settings.defaults.nodeElev,
				_level: settings.defaults.tankLevel,
				minLevel: settings.defaults.tankMinLevel,
				maxLevel: settings.defaults.tankMaxLevel,
				tankDiameter: settings.defaults.tankDiameter };
		} else {
			n = { id: id, type: type, x: x, y: y, elev: settings.defaults.nodeElev, _demand: settings.defaults.demand };
		}
		bornInScenario(n);
		doc.nodes.push(n);
		buildNodeEls(n);
		incidentLinks[id] = []; labelsByAnchor[id] = [];
		updateEmptyHint();
		scheduleSolve();
		return n;
	}
	function addLink(type, fromId, toId) {
		var id = mintId(LPN_ID_KEY[type] || 'L');
		var l = {
			id: id, type: type, from: fromId, to: toId, verts: [],
			_diameter: settings.defaults.diameter,
			// No `length` default, deliberately (Tom, 2026-07-30): lenAuto derives length from the
			// drawn geometry, so a default would be overwritten by linkGeomLength() on the next line.
			_roughness: settings.defaults.roughness, _length: 0, lenAuto: true, _status: 'open',
			_k: settings.defaults.k // pump ignores k -- only the pipe friction branch reads it
		};
		l._length = linkGeomLength(l);   // base-write: construction: a link is born in Base before any scenario can override it
		if (type === 'valve') {
			// A VALVE IS A ZERO-LENGTH LINK, and that is exact rather than a small number standing
			// in for one: EngCalcs.lpnResistance returns r = 0 for a zero-length link, so the
			// friction term vanishes and what is left is the pure local loss a valve is. lenAuto is
			// off, or linkGeomLength() would give it the drawn distance between its two nodes and
			// quietly add pipe friction to it.
			l._length = 0;   // base-write: construction: a valve is born with zero length in Base
			l.lenAuto = false;
			// TCV IS THE DEFAULT TYPE, deliberately: it is the one type both engines solve, so a
			// freshly drawn valve never changes which engine the page is using until the user asks
			// for a type that does. See EngCalcs.lpnValveIsNative.
			l.valveType = 'TCV';
			l._setting = defaultValveSetting('TCV');   // base-write: construction: a valve is born with its type default in Base
		}
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
			// nothing until a real one is typed into its popup -- see pumpFit().
			l.curvePoints = [];
			l.curveRef = null;
		}
		bornInScenario(l);
		doc.links.push(l);
		incidentLinks[fromId].push(id); incidentLinks[toId].push(id);
		buildLinkEls(l);
		scheduleSolve();
		return l;
	}
	// A NEW VALVE'S SETTING, per type -- and it has to be per type, because the setting is a
	// different QUANTITY for each one (see js/lpn-epanet.js): a pressure for a PRV or PSV, a flow
	// for an FCV, a dimensionless loss coefficient for a TCV. Carrying one number across a type
	// change would read 60 psi as a loss coefficient of 60, which is not a valve anybody built.
	// So changeValveType() re-seeds through here, and says so in the popup rather than silently.
	// Numbers chosen so a valve dropped on a network is a plausible design on arrival: a district
	// PRV holding 60 psi (40 m), a 250 gpm (15 l/s) flow limit, and a throttle at k = 2.
	function defaultValveSetting(type) {
		if (type === 'PRV' || type === 'PSV') { return niceDefault('lpn_u_pressure', 'psi', 60, 40); }
		if (type === 'FCV') { return niceDefault('lpn_u_flow', 'gpm', 250, 0.015); }
		return 2;
	}
	// anchorNode, if given, anchors the new Text to that node with a leader -- lb.x/lb.y become an
	// OFFSET from the node (matching buildLabelEls'/updateLabelGeometry's model), computed here so
	// the label still appears exactly where the user tapped, not snapped onto the node itself.
	function addText(x, y, anchorNode) {
		var id = mintId('X'), an = anchorNode ? nodeById(anchorNode) : null;
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
	// ---- drawing and deleting inside a scenario (ROADMAP Task 184) ----
	// DRAWING: the app silently creates the element in BASE as inactive and overrides it active
	// here. The user gets ordinary drawing; the model keeps ONE id space and ONE element set, which
	// is what makes "membership is overridable, identity is not" feel like no rule at all.
	function bornInScenario(el) {
		if (inBaseScenario()) { return; }
		el._active = false;   // base-write: born inactive in Base, then overridden active here -- the whole membership design
		setOverride(el, 'active', true);
	}
	// DELETING: inside a scenario it means "not in this network", so it sets inactive rather than
	// destroying an element every other scenario may be using. In BASE it is a real deletion and
	// takes every scenario's overrides on that element with it -- confirmed with a count, because
	// that is work in documents the user is not looking at.
	// A node carries its incident links with it either way: a link to a node that is not there is
	// the "dangling-link" diagnostic, and leaving one behind would trade a delete for an error.
	function deleteElement(kind, id) {
		var pc = EngCalcs.pageConfig || {}, el = kind === 'node' ? nodeById(id) : linkById(id);
		// One guard for both branches. A delete gesture can name an element that is already gone --
		// a cascade beat it to it, or a second tap landed on the same handle -- and the Base branch
		// would otherwise walk an incidentLinks entry that no longer exists.
		if (!el) { return; }
		if (!inBaseScenario()) {
			saveUndoSnapshot();
			setOverride(el, 'active', false);
			if (kind === 'node') {
				incidentLinks[id].forEach(function (lid) { setOverride(linkById(lid), 'active', false); });
			}
			afterPropertyEdit(el);
			if (kind === 'node') { buildDom(); }
			setNotice((pc.lpn_scenario_deactivated || '{id} is switched off in {scenario}. It is still in the drawing, and in your other scenarios.')
				.replace('{id}', id).replace('{scenario}', scenarioDisplayName(activeScenario())));
			return;
		}
		// The element itself, plus -- for a node -- every link the cascade is about to take with it.
		// Built as KEYS rather than ids, because those incident ones are links whatever `kind` is.
		var keys = [ovKeyFor(kind, id)];
		if (kind === 'node') {
			keys = keys.concat((incidentLinks[id] || []).map(function (lid) { return ovKeyFor('link', lid); }));
		}
		var lost = 0;
		keys.forEach(function (k) { lost += overrideCountForElement(k); });
		if (lost && !window.confirm((pc.lpn_delete_drops_overrides || 'Deleting this also throws away {n} values your scenarios hold for it. Continue?').replace('{n}', lost))) { return; }
		saveUndoSnapshot();
		if (kind === 'node') { deleteNode(id); } else { deleteLink(id); }
		refreshScenarioStatus();
	}
	function deleteNode(id) {
		var links = incidentLinks[id].slice(), i;
		for (i = 0; i < links.length; i++) { deleteLink(links[i]); }
		labelsByAnchor[id].slice().forEach(function (lid) { deleteLabelById(lid); });
		nodeEls[id].circle.remove(); nodeEls[id].text.remove();
		nodeEls[id].leader.remove();
		if (nodeEls[id].symbol) { nodeEls[id].symbol.remove(); }
		delete nodeEls[id]; delete incidentLinks[id]; delete labelsByAnchor[id];
		doc.nodes = doc.nodes.filter(function (n) { return n.id !== id; });
		// A real deletion drops every scenario's overrides on the element (Task 184). Left behind,
		// they would be a map entry keyed by an id nothing answers to -- silently counted in the
		// status bar, and silently reattached the day a new element minted the same id.
		purgeOverrides(ovKeyFor('node', id));
		if (currentPopup && currentPopup.kind === 'node' && currentPopup.id === id) { closePopup(); }
		updateEmptyHint();
		scheduleSolve();
	}
	// ---- The examples gallery (ROADMAP Task 314) ---------------------------------------------
	//
	// **A GALLERY IS A UNIVERSE OF WORKING EXAMPLES**, and it stands where a placeholder sentence
	// used to. Tom, 2026-08-14, overruling the objection that every other calculator in this suite
	// lands a visitor IN a worked example so a gallery costs them: *"A gallery is a universe of
	// working examples. The tension is small-minded. This is not a two-minute calculator."* He is
	// right, and the error was treating a rule about CALCULATORS as a rule about this page. "Open
	// on a worked example" earns its keep where a visitor can read the whole tool in one screen; a
	// network editor is not that, and the thing a visitor needs first is the RANGE of what can be
	// built, which one example cannot show.
	//
	// AN EXAMPLE IS A FILE, not a function. The two built-in examples are ~290 lines of drawing
	// code (drawExampleNetwork()), which cannot carry a description or a thumbnail, cannot be
	// authored by anyone who is not editing this file, and does not scale to a screen full of them.
	// The shelf is dev/water-network-examples/, published to examples/ by
	// dev/scripts/generate_examples.php together with a manifest and generated thumbnails.
	//
	// **OPENING ONE GIVES YOU A DOCUMENT YOU OWN.** Tom, on what HEC-RAS got right without ever
	// saying it: *"They were your copies because you downloaded and installed them."* Ours are
	// served rather than installed, so the equivalent is that an example lands as an ordinary new
	// project the user may Save As -- never a read-only view of a file on our server, and never
	// something that writes back. That is why this goes through acceptImportedText() and
	// importProject(), the very same pair the upload path uses, rather than a loader of its own:
	// a second import path would drift from the first, and the first is the one with the version
	// migration, the structural repair and the storage-quota handling already in it.
	var examplesManifest = null, examplesState = 'idle';
	function examplesPane() { return document.getElementById('lpn_examples_pane'); }
	// Cards are built from the manifest, which is FETCHED -- so this cannot be rendered by PHP, and
	// a PHP copy of the list would be a second index to keep in step with the generated one.
	function renderExamplesGallery() {
		var pane = examplesPane(), pc = EngCalcs.pageConfig || {};
		if (!pane) { return; }
		pane.textContent = '';
		if (examplesState === 'failed') {
			// The old placeholder sentence, kept for exactly this: the gallery is the shop window,
			// but a visitor whose network dropped the manifest still needs to be told how to start.
			pane.appendChild(elh('p', { 'class': 'lpn-examples-msg' },
				pc.lpn_examples_failed || pc.lpn_empty_hint || ''));
			return;
		}
		if (examplesState === 'loading' || !examplesManifest) {
			pane.appendChild(elh('p', { 'class': 'lpn-examples-msg' }, pc.lpn_examples_loading || ''));
			return;
		}
		pane.appendChild(elh('h2', { 'class': 'lpn-examples-h' }, pc.lpn_examples_heading || ''));
		pane.appendChild(elh('p', { 'class': 'lpn-examples-sub' }, pc.lpn_examples_sub || ''));
		// **THE WAY OUT IS ABOVE THE WALL, NOT BELOW IT** (Tom, 2026-08-14: "The link at the bottom
		// should be at the top"). Nothing here guarantees the cards fit the map's height -- the
		// count grows, the map height is a user setting, and a phone is short -- so anything placed
		// after the grid is the first thing to fall off the bottom. A visitor who wants to draw
		// their own network would then have to scroll a wall of examples to find out they need not
		// look at it. Put it where it is always seen and the fit question stops mattering for it.
		var blank = elh('button', { type: 'button', 'class': 'lpn-examples-blank' },
			pc.lpn_examples_blank || '');
		blank.addEventListener('click', function () { hideExamplesGallery(); });
		pane.appendChild(blank);
		var grid = elh('div', { 'class': 'lpn-examples-grid' });
		examplesManifest.forEach(function (ex) {
			// A BUTTON, not a div with a click handler: the whole card is the target, it reaches
			// the keyboard for free, and it announces itself to a screen reader as something that
			// can be activated. This page is used on touch screens where a small "Open" affordance
			// inside a big picture is the wrong hit area.
			var card = elh('button', { type: 'button', 'class': 'lpn-example-card' });
			if (ex.thumb) {
				// <img> rather than inlined markup: it is cacheable, it cannot collide with the
				// page's own ids or styles, and a broken one degrades to the title below it.
				card.appendChild(elh('img', {
					'class': 'lpn-example-thumb', src: 'examples/' + ex.thumb, alt: '', loading: 'lazy'
				}));
			}
			// **THE TRANSLATED STRING WINS; THE MANIFEST'S ENGLISH IS THE FALLBACK.** The card text
			// lives in lib/lang.ec.*.php like every other string on this page -- a string kept only
			// in the examples folder's own JSON would be one no translator ever sees, which would
			// have left six permanently-English cards on a page that ships in 27 languages. The
			// manifest still carries the English so a newly dropped-in example is a usable card
			// before anybody has written its keys.
			card.appendChild(elh('span', { 'class': 'lpn-example-title' },
				(ex.titleKey && pc[ex.titleKey]) || ex.title || ex.file));
			card.appendChild(elh('span', { 'class': 'lpn-example-desc' },
				(ex.descKey && pc[ex.descKey]) || ex.description || ''));
			card.appendChild(elh('span', { 'class': 'lpn-example-meta' },
				(pc.lpn_examples_size || '{nodes} / {links}')
					.replace('{nodes}', ex.nodes).replace('{links}', ex.links)));
			card.addEventListener('click', function () { openExample(ex); });
			grid.appendChild(card);
		});
		pane.appendChild(grid);
		// The legal row, in the gallery as well as in the Help menu -- this page has no footer to
		// carry it, and the gallery is what a first-time visitor actually looks at. epanet-js puts
		// its own Terms and Privacy in exactly this position, in the sidebar of the panel it shows
		// on arrival. Built here rather than rendered by PHP because the whole pane is; the strings
		// are the SUITE's existing keys, so this costs no translation and cannot word itself
		// differently from the same links on every other page.
		var legal = elh('p', { 'class': 'lpn-examples-legal' });
		[[pc.privacy_link || 'Privacy notice', 'privacy.php'],
			[pc.terms_link || 'Terms of use', 'terms.php']].forEach(function (pair) {
			var a = elh('a', { href: pair[1], target: '_blank', rel: 'noopener' }, pair[0]);
			legal.appendChild(a);
		});
		// The class is the whole mechanism: lib/Consent.lib.php listens for a click on
		// `.ec-consent-reopen` anywhere in the document, so this needs no wiring of its own and
		// cannot fall out of step with the identical control on every other page's footer.
		legal.appendChild(elh('a', { href: '#ec-consent', 'class': 'ec-consent-reopen' },
			pc.consent_settings_link || 'Cookie settings'));
		pane.appendChild(legal);
	}
	// Dismissed for THIS project only, and not persisted. The gallery's whole job is to appear on
	// an empty canvas; a visitor who dismissed it once a month ago and now has an empty drawing in
	// front of them is exactly who it is for. `galleryDismissed` resets whenever a project opens.
	//
	// `galleryForced` is the File > Open example… route: the user asked for the wall while a
	// network was already on screen, so "show it when the canvas is empty" is not the rule any
	// more. Two flags rather than one tri-state because they answer different questions and both
	// can be true -- "has this visitor waved the gallery away" and "did they just ask for it".
	var galleryDismissed = false, galleryForced = false;
	function showExamplesOverlay() {
		galleryForced = true;
		updateEmptyHint();
	}
	function hideExamplesGallery() {
		galleryDismissed = true;
		galleryForced = false;
		updateEmptyHint();
	}
	function loadExamplesManifest() {
		if (examplesState === 'loading' || examplesState === 'loaded') { return; }
		examplesState = 'loading';
		renderExamplesGallery();
		fetch('examples/manifest.json', { cache: 'no-cache' })
			.then(function (r) { if (!r.ok) { throw new Error(r.status); } return r.json(); })
			.then(function (j) {
				examplesManifest = (j && j.examples) || [];
				examplesState = examplesManifest.length ? 'loaded' : 'failed';
				renderExamplesGallery();
			})
			.catch(function () { examplesState = 'failed'; renderExamplesGallery(); });
	}
	function openExample(ex) {
		var pc = EngCalcs.pageConfig || {};
		logLpnFirstAction('example');
		fetch('examples/' + ex.file, { cache: 'no-cache' })
			.then(function (r) { if (!r.ok) { throw new Error(r.status); } return r.text(); })
			.then(function (text) {
				var saved = acceptImportedText(text);
				if (!saved) { return; }
				var id = importProject(saved);
				if (!id) { return; }
				// **The example's own name is the project name, not the file's.** The document
				// carries what it should be called; deriving it from the file name here would be a
				// third naming convention beside projectFileName() and projectNameFromFileName().
				//
				// It arrives SAVED, like an uploaded file and for the same reason: the user chose
				// it from a wall, it is two clicks to get back, and an asterisk on something they
				// have not touched is a lie. It earns the asterisk at the first edit.
				stampProjectSaved(id);
				galleryDismissed = false;
				galleryForced = false; // the wall has done its job; get out of the way of the drawing
				updateEmptyHint();
				renderTabs();
				setNotice((pc.lpn_status_example_opened || '')
					.replace('{name}', projectDisplayName(project)));
			})
			.catch(function () {
				examplesState = 'failed';
				renderExamplesGallery();
			});
	}
	// A tiny HTML-element helper. el() above builds SVG elements in the SVG namespace, which is
	// wrong for a <button> -- an SVG-namespaced button is invisible to CSS and to the accessibility
	// tree, and looks fine in the DOM inspector, which is how that mistake survives.
	function elh(tag, attrs, text) {
		var e = document.createElement(tag), k;
		for (k in attrs) { if (Object.prototype.hasOwnProperty.call(attrs, k)) { e.setAttribute(k, attrs[k]); } }
		if (text !== undefined && text !== null) { e.textContent = text; }
		return e;
	}
	function updateEmptyHint() {
		var hint = document.getElementById('lpn_empty_hint');
		if (!hint) { return; }
		var empty = doc.nodes.length === 0, show = galleryForced || (empty && !galleryDismissed);
		hint.style.display = show ? 'block' : 'none';
		// Fetched only when it is first actually going to be seen. A returning user with a network
		// on screen never pays for the manifest at all, which is the point of doing this here
		// rather than at boot.
		if (show) { loadExamplesManifest(); renderExamplesGallery(); }
	}
	function deleteLink(id) {
		var l = linkById(id);
		linkEls[id].line.remove();
		if (linkEls[id].halo) { linkEls[id].halo.remove(); }
		linkEls[id].handles.forEach(function (h) { h.remove(); });
		linkEls[id].arrows.forEach(function (a) { a.remove(); });
		linkEls[id].text.remove();
		linkEls[id].leader.remove();
		// Same reason the arrows are removed one line up: a repeat is a real element in a shared
		// layer, so a deleted pipe would leave its extra labels floating over the map -- Tom's
		// 2026-07-30 "when I delete a pipe, its orphaned labels are left behind", one more time.
		(linkEls[id].repeats || []).forEach(function (r) { r.text.remove(); });
		if (linkEls[id].symbolG) { linkEls[id].symbolG.remove(); }
		// The extrema mark needs no line of its own here any more (Task 333): it is the
		// text's own text-decoration, so removing the text removes it. It used to be a set of
		// separate elements that this had to hunt down, and forgetting to was Tom's 2026-07-30
		// "when I delete a pipe, its orphaned labels are left behind".
		delete linkEls[id];
		incidentLinks[l.from] = incidentLinks[l.from].filter(function (x) { return x !== id; });
		incidentLinks[l.to] = incidentLinks[l.to].filter(function (x) { return x !== id; });
		doc.links = doc.links.filter(function (x) { return x.id !== id; });
		purgeOverrides(ovKeyFor('link', id));   // see deleteNode()
		if (currentPopup && currentPopup.kind === 'link' && currentPopup.id === id) { closePopup(); }
		scheduleSolve();
	}
	function deleteLabelById(id) {
		var lb = labelById(id), le = labelEls[id];
		if (le.leader) { le.leader.remove(); }
		le.text.remove();
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
	// 5 (Task 324, 2026-08-14): a scenario override is keyed by GROUP AND id ('n:20' / 'l:20')
	// rather than by the bare id, because a node and a link may legally share one.
	// 7 (Task 354, 2026-08-16): coordinates are LOCAL to a `doc.origin`, which the file carries in
	// its own Cartesian frame. Every existing document migrates by having one computed for it, and
	// the ones near zero get {0, 0} and are byte-identical afterwards.
	var LPN_STORAGE_VERSION = 7;
	// ---- ROADMAP Task 274, second half (Tom, 2026-08-11: "Eventually needs to be Cartesian. If we
	// can do that now without causing trouble, let's do it.") ----
	//
	// From v4 the FILE stores Cartesian Y (up is positive), matching what the user sees and what
	// EPANET uses. `doc` in memory stays Y-down, which is SVG's own system and what every drawing
	// routine here is written against -- so the sign flips at the storage boundary, in exactly two
	// functions: serializeProject() on the way out and applySaved() on the way in.
	//
	// A v3 document is MIGRATED on open, like every other version step in migrateSaved(): converted
	// and stamped. "Let's not worry about doing anything with existing projects" (Tom) is satisfied
	// by the conversion being invisible and automatic, not by leaving old files behind -- the first
	// cut did leave them behind, and Tom caught it ("We always upgrade the file to the current
	// format. Right?").
	//
	// V2 IS THE ONE VERSION THAT LAGS, and only because the units question it carries is the user's
	// to answer. It keeps Y-down storage, correctly, since the read and write gates below key off the
	// same number -- and it picks up Cartesian for free the moment the units question is answered,
	// because stampDocAnswered() moves it to LPN_STORAGE_VERSION. That is why the two questions can
	// share one version number after all: the coordinate change needs no answer from anybody, so it
	// rides on a bump rather than needing one of its own.
	var LPN_CARTESIAN_VERSION = 4;
	// The six Y-bearing fields, and no others. Offsets (`ly`, a Text label's `y`, `backdrop.ty`) are
	// VECTORS and negate exactly like positions do -- a vector in a flipped frame flips with it.
	// `backdrop.y`/`height` are NOT here: the image is anchored by its top-left corner, and "extends
	// downward on screen" is the same visual fact in both frames, so only the anchor's sign moves.
	function flipStoredY(o) {
		(o.nodes || []).forEach(function (n) {
			if (typeof n.y === 'number') { n.y = -n.y; }
			if (typeof n.ly === 'number') { n.ly = -n.ly; }
		});
		(o.links || []).forEach(function (l) {
			(l.verts || []).forEach(function (v) { if (typeof v.y === 'number') { v.y = -v.y; } });
			if (typeof l.ly === 'number') { l.ly = -l.ly; }
		});
		(o.labels || []).forEach(function (lb) { if (typeof lb.y === 'number') { lb.y = -lb.y; } });
		if (o.backdrop && typeof o.backdrop.ty === 'number') { o.backdrop.ty = -o.backdrop.ty; }
		// The saved VIEW is a world REGION -- a centre point and an extent in drawing units (see
		// currentView()) -- so its centre's y belongs in this list for the same reason every other y
		// does. The extent is a size, and sizes do not flip. Storing a screen-space translation
		// instead would have put an unflipped convention into a file that is otherwise Cartesian.
		if (o.view && typeof o.view.cy === 'number') { o.view.cy = -o.view.cy; }
		return o;
	}
	// ---- Task 354: choosing and applying a document's local origin --------------------------------
	//
	// **THE THRESHOLD IS A MEASUREMENT, NOT A TASTE.** A float32's spacing at magnitude m is about
	// m / 2^23. A pipe's stroke is `linkWidth / scale` world units, so the drawing survives while
	// linkWidth / scale > m / 2^23 -- i.e. up to a working zoom of about 2^23 * linkWidth / m. At
	// Elm Street's 1.3e6 that is scale 19 for a 3 px stroke, and the map he was looking at was at
	// 47. At 1e4 it is scale 2,500, which is five times MAX_SCALE, so a document whose coordinates
	// are under ten thousand has nothing to gain from a rebase and is left exactly as it was --
	// including every example this repo ships (0 to ~5,000) and Net1/2/3 (0 to 100).
	var LPN_ORIGIN_THRESHOLD = 1e4;
	// Rounded so a human reading `origin` sees a number they could have typed, and so two documents
	// covering the same survey area are likely to share one. It also means a small edit to a network
	// never moves the origin: the rebase runs once, at the version step or at import, and the origin
	// is then a fixed property of the document.
	var LPN_ORIGIN_ROUND = 1e3;
	// Every ABSOLUTE coordinate a stored document holds, in its own (Cartesian) frame. A visitor is
	// called with {get, set} so one list serves both the bbox pass and the shift pass -- two lists
	// that had to agree would be the thing that drifts, and a coordinate missed by the shift is a
	// node half a million units from its pipe.
	//
	// WHAT IS DELIBERATELY NOT HERE: `n.lx`/`l.ly` and an ANCHORED label's x/y are OFFSETS from
	// something else, and an offset does not move when the frame's origin does. `backdrop.x/y/width`
	// are a size and an anchor within the image, not a place on the map; only `backdrop.tx/ty`, the
	// image's world translation, is a position. `view.extent` is a size for the same reason its
	// centre is a position.
	function eachStoredPoint(o, visit) {
		(o.nodes || []).forEach(function (n) { visit(n); });
		(o.links || []).forEach(function (l) { (l.verts || []).forEach(function (v) { visit(v); }); });
		(o.labels || []).forEach(function (lb) { if (!lb.anchorNode) { visit(lb); } });
		if (o.backdrop && typeof o.backdrop.tx === 'number') {
			visit({}, function () { return { x: o.backdrop.tx, y: o.backdrop.ty }; },
				function (x, y) { o.backdrop.tx = x; o.backdrop.ty = y; });
		}
		if (o.view && typeof o.view.cx === 'number') {
			visit({}, function () { return { x: o.view.cx, y: o.view.cy }; },
				function (x, y) { o.view.cx = x; o.view.cy = y; });
		}
	}
	// The origin this document SHOULD have, or null for "leave it alone". Uses the smallest x and y
	// present rather than the centre, so local coordinates come out small and positive, which is
	// what a person reading the raw JSON expects of a local grid.
	function chooseOrigin(o) {
		var minX = Infinity, minY = Infinity, maxAbs = 0;
		eachStoredPoint(o, function (pt, get) {
			var p = get ? get() : pt;
			if (!isFinite(p.x) || !isFinite(p.y)) { return; }
			if (p.x < minX) { minX = p.x; }
			if (p.y < minY) { minY = p.y; }
			maxAbs = Math.max(maxAbs, Math.abs(p.x), Math.abs(p.y));
		});
		if (!isFinite(minX) || !isFinite(minY) || maxAbs < LPN_ORIGIN_THRESHOLD) { return null; }
		return {
			x: Math.floor(minX / LPN_ORIGIN_ROUND) * LPN_ORIGIN_ROUND,
			y: Math.floor(minY / LPN_ORIGIN_ROUND) * LPN_ORIGIN_ROUND
		};
	}
	// Give a stored document an origin and make every coordinate in it local to that origin. The
	// absolute position of everything is unchanged BY CONSTRUCTION -- origin + local is what every
	// outward-facing site reports -- so this is invisible to the user, which is the whole reason it
	// can run automatically on open rather than asking a question the way the v2 units offer does.
	// Idempotent on a document that already has an origin: it returns without touching anything, so
	// a document cannot be rebased twice into oblivion.
	function rebaseDocument(o) {
		if (o.origin) { return o; }
		var org = chooseOrigin(o);
		o.origin = org || { x: 0, y: 0 };
		if (!org) { return o; }
		eachStoredPoint(o, function (pt, get, set) {
			var p = get ? get() : pt;
			if (!isFinite(p.x) || !isFinite(p.y)) { return; }
			if (set) { set(p.x - org.x, p.y - org.y); }
			else { pt.x = p.x - org.x; pt.y = p.y - org.y; }
		});
		return o;
	}
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
	// **WHAT THIS DOCUMENT IS, WRITTEN INSIDE THE DOCUMENT** (ROADMAP Task 315, 2026-08-14). Until
	// this landed there was NO format identifier in the file at all: `v` is a version number, but
	// nothing said what it was a version OF. So a saved project was identifiable only by its
	// filename -- which is precisely the thing a person renames -- and that is the real defect the
	// 30-character `-lpn-hawsedc-engcalcs` suffix was compensating for. Two additive keys fix it at
	// the layer that survives a rename, a re-download and a mail attachment.
	//
	// `app` is a URL rather than a product name on purpose: the product name is unsettled (Task 315
	// again, and LibreEPANET.org is unlaunched), and a URL is the one identifier that stays useful
	// to somebody who finds this file knowing nothing. Old readers ignore unknown keys, so nothing
	// needs to migrate and no version bump is owed.
	var LPN_FILE_FORMAT = 'hawsedc-lpn';
	// Matches CANONICAL_ORIGIN in lib/config.inc.php (no `www`). Hardcoded rather than derived from
	// location.origin on purpose: a file saved from a dev host would otherwise record the dev host
	// forever, and this key exists to tell a stranger where the format lives, not to log where one
	// particular save happened.
	var LPN_FILE_APP = 'https://hawsedc.com/engcalcs/Looped-Network.php';
	function serializeProject() {
		var out = {
			format: LPN_FILE_FORMAT, app: LPN_FILE_APP,
			v: openDocVersion, project: project, scenarios: scenarios,
			nodes: doc.nodes, links: doc.links, labels: doc.labels, nextId: nextId,
			// The frame every coordinate above is measured from (Task 354). Written unconditionally,
			// including the {0, 0} an ordinary drawing has, because a file that omits it is a file
			// whose reader has to guess -- and the guess is only right until somebody hand-edits one.
			origin: docOrigin(),
			labelSettings: labelSettings, backdrop: backdrop, settings: settings,
			// Where the reader was looking. Not a reason to SAVE -- panning marks nothing dirty --
			// but it rides along whenever something else does, so a file reopens where it was left.
			view: currentView(),
			// The units the numbers above are IN. Not a preference -- without it the document does
			// not say what it means, and a 400 mm main would open as a 400 inch main (Tom).
			units: readUnitSelections()
		};
		// From v4 the file is Cartesian. CLONED FIRST -- flipStoredY() mutates, and the object above
		// holds live references to doc.nodes/links/labels, so flipping in place would turn the
		// drawing upside down on screen every time it was saved.
		if (out.v >= LPN_CARTESIAN_VERSION) { return flipStoredY(JSON.parse(JSON.stringify(out))); }
		return out;
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
	// **WHAT COUNTS AS A CHANGE TO THE DOCUMENT.** This is what puts the asterisk on a tab, so
	// anything included here is something the user will be asked to save.
	function docSignature() {
		var snap = serializeProject();
		// The backdrop's data URL is megabytes and changes only when the image itself is replaced, so
		// it is represented by its LENGTH plus its placement rather than hashed. Hashing it would put
		// a multi-megabyte string walk on the solve debounce, several times a second while drawing.
		var bd = snap.backdrop;
		snap = Object.assign({}, snap, {
			backdrop: bd ? { n: (bd.href || '').length, x: bd.x, y: bd.y, w: bd.width, h: bd.height, s: bd.s } : null,
			// **THE VIEW IS PART OF THE DOCUMENT AND MOVING IT IS AN EDIT** -- and getting here took
			// a wrong turn worth recording. My first fix for Tom's inescapable asterisk was to drop
			// the view from this signature. He rejected the direction and named the real fault:
			// *"AutoCAD registers a zoom or pan as a change. But there are no automatic zooms or
			// pans. The paradigm mistake in our code right now is probably a holdover from zooming
			// to fit on every open... In a nutshell, our current paradigm forbids autozooms or
			// refits. Could you be hacking at this from the wrong direction?"*
			//
			// He was right. Excluding the view would have made a deliberate pan unsaveable in order
			// to excuse an automatic one. The view stays in the signature, exactly as it stays in
			// the file, and what changed instead is that an AUTOMATIC fit re-baselines the clean
			// signature rather than dirtying the project -- see zoomExtent()'s `auto` argument. A
			// fit that establishes a view the document never had is not a change to it.
			view: snap.view
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
	// The v4 -> v5 override re-keying, split out so the rule above sits beside the step that runs it
	// and the harness can drive it on its own. Returns a small report -- how many keys were re-keyed
	// and how many were dropped -- because a migration that guesses silently is worse than one that
	// states its rule, and nothing else in the document afterwards can say what it did.
	function migrateOverrideKeys(saved) {
		var nodeIds = {}, linkIds = {}, moved = 0, dropped = 0, both = 0;
		(saved.nodes || []).forEach(function (n) { if (n && n.id !== undefined) { nodeIds[n.id] = true; } });
		(saved.links || []).forEach(function (l) { if (l && l.id !== undefined) { linkIds[l.id] = true; } });
		(saved.scenarios || []).forEach(function (s) {
			if (!s || !s.overrides) { return; }
			var out = {};
			Object.keys(s.overrides).forEach(function (id) {
				if (nodeIds[id] && linkIds[id]) { both++; }
				var group = nodeIds[id] ? 'node' : (linkIds[id] ? 'link' : null);
				if (!group) { dropped++; return; }
				out[ovKeyFor(group, id)] = s.overrides[id];
				moved++;
			});
			s.overrides = out;
		});
		return { moved: moved, dropped: dropped, ambiguous: both };
	}
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
		// v3 -> v4: coordinates become Cartesian. A NORMAL migration -- convert and stamp -- because
		// it asks the user nothing (Tom, 2026-08-11: "We always upgrade the file to the current
		// format. Right?" Right, and the first cut of this wrongly left v3 documents at v3 forever,
		// relying on serializeProject() writing openDocVersion. That turned the ONE documented
		// exception below into two, the second undocumented and for no reason at all).
		if (saved.v === 3) {
			flipStoredY(saved);
			saved.v = 4;
		}
		// v4 -> v5: OVERRIDE KEYS GAIN THEIR ELEMENT'S GROUP (Task 324). A bare key in a v4 document
		// is genuinely ambiguous -- that ambiguity IS the defect -- so this cannot be a mechanical
		// re-spelling; it has to resolve each key against the elements the document actually holds,
		// and say out loud what it does when the answer is not unique:
		//
		//   - only a node has that id  -> 'n:<id>'   unambiguous
		//   - only a link has that id  -> 'l:<id>'   unambiguous
		//   - BOTH have it             -> 'n:<id>', the NODE. Not a coin toss: the old effective()
		//     read one flat map, so the value the user was actually looking at while they typed it
		//     was being applied to both elements at once, and every property in a v4 map that can
		//     belong to a node (demand, head, level, emitter) belongs to a node exclusively. A wrong
		//     guess here re-keys a value onto an element that has no such property, where it is
		//     dead; the node guess keeps it where it is most likely to still mean something.
		//   - NEITHER has it           -> dropped. It was already dead: purgeOverrides() removes a
		//     deleted element's overrides, so a key with no element is a leftover from a hand-edited
		//     or partially-written file, and carrying it forward would resurrect it the day someone
		//     minted that id again.
		//
		// A key is never pattern-matched for a leading 'n:'/'l:' -- at v4 every key is bare BY
		// DEFINITION, and an element legitimately named 'n:20' would be re-keyed to 'n:n:20', which
		// is right. Guessing from the shape of the string would break that one and gain nothing.
		if (saved.v === 4) {
			migrateOverrideKeys(saved);
			saved.v = 5;
		}
		// ---- v5 -> v6: sizes become SCREEN PIXELS (Task 331) --------------------------------------
		//
		// THE OLD VALUES ARE DISCARDED RATHER THAN CONVERTED, AND THAT IS THE HONEST ANSWER RATHER
		// THAN THE LAZY ONE. A v5 `textSize` in 'map' units is a WORLD size; the pixels it rendered
		// at depended on the zoom the reader happened to be at, so there is no scale factor to apply
		// -- the same stored 20 was a banner headline on one screen and invisible on another. That
		// ambiguity IS the defect this task removes, and inventing a conversion factor would carry it
		// forward wearing a number that looks authoritative.
		//
		// A v5 document written with textSizeUnits:'screen' *could* be carried across unchanged, and
		// deliberately is not. Splitting the migration by a flag would mean two classes of reopened
		// document behaving differently for a reason invisible to the person looking at them; every
		// v5 document opens at the new defaults, which is one sentence to explain and is what the
		// paradigm is FOR. Nothing about the network is touched -- only how it is drawn.
		//
		// The stale keys are deleted rather than left to be ignored, because settings is serialized
		// whole: leaving them would write textSizeUnits back out of every future save of a document
		// that has not had one since v5, and a key that reads as live but is never consulted is the
		// kind of thing that gets 'restored' by a well-meaning future edit.
		if (saved.v === 5) {
			if (saved.settings) {
				var d = defaultSettings();
				delete saved.settings.textSizeUnits;
				delete saved.settings.symbolScale;
				saved.settings.textSize = d.textSize;
				saved.settings.symbolSize = d.symbolSize;
				saved.settings.linkWidth = d.linkWidth;
			}
			saved.v = 6;
		}
		// ---- v6 -> v7: COORDINATES BECOME LOCAL TO doc.origin (Task 354) --------------------------
		//
		// A normal convert-and-stamp step, like v3 -> v4 and for the same reason: it asks the user
		// nothing, because origin + local is the same absolute coordinate every outward-facing site
		// was already reporting. Tom's rule -- "We always upgrade the file to the current format" --
		// applies straightforwardly.
		//
		// **AN ALREADY-IMPORTED SURVEY MODEL IS REBASED ON OPEN, not left as it is.** Leaving it
		// would exempt exactly the documents that have the bug, and the pipe that vanishes is not
		// less broken for having been imported last week. A document whose coordinates are already
		// small gets {0, 0} and is unchanged in every byte that matters.
		if (saved.v === 6) {
			rebaseDocument(saved);
			saved.v = 7;
		}
		// **There is deliberately NO v2 -> v3 step here, and v2 is the ONLY version that lags.**
		// Every other migration in this function converts the document and stamps it; this one
		// cannot, because the conversion is the USER'S to authorise. So the document stays at v2
		// until they answer, and the missing stamp IS the pending question. An earlier cut stamped v3
		// on sight and carried a separate `unitsUnconfirmed` flag beside it; Tom removed the flag by
		// asking why the version alone was not enough (2026-08-10). It is, and serializeProject()
		// writes `openDocVersion` so a v2 document saves back as v2.
		// A v2 document therefore keeps Y-down storage too -- correctly, since applySaved() and
		// serializeProject() both gate on the same version -- and picks up Cartesian for free the
		// moment the units question is answered, because stampDocAnswered() moves it to
		// LPN_STORAGE_VERSION.
		// A LAGGING v2 DOCUMENT THEREFORE NEVER REACHES THE v4 -> v5 STEP EITHER, and that is safe
		// rather than lucky: v2 predates the scenario UI entirely, so no v2 document can carry an
		// override at all (applyV2Restore() records the same fact and declines to scale them for the
		// same reason). Adding a re-keying pass for a case that cannot occur would be dead code in a
		// one-time migration -- which reads as evidence the case is real, and is worse than absent.
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
		// Cartesian file -> Y-down memory (Task 274). Mutates `saved` in place, which is safe and
		// deliberate: every caller hands over a freshly parsed object it does not reuse, and
		// doc.nodes/links/labels below are assigned BY REFERENCE from it, so a copy here would only
		// double the memory and create a second thing to keep in step.
		if (saved.v >= LPN_CARTESIAN_VERSION) { flipStoredY(saved); }
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
		dropStoredPumpFit(doc.links);
		// Task 354. Not flipped by flipStoredY() above and must not be: the origin is stated in the
		// FILE's Cartesian frame and outwardY()/inwardY() are written for exactly that -- flipping it
		// here would put the sign in twice and move a survey model a couple of million units.
		doc.origin = (saved.origin && isFinite(saved.origin.x) && isFinite(saved.origin.y))
			? { x: saved.origin.x, y: saved.origin.y } : { x: 0, y: 0 };
		// Consumed once, by the restoreViewOrFit() at the end of refreshAllFromDocument(). A file
		// written before this existed has none, and gets a fit exactly as it always did.
		pendingView = validView(saved.view) ? saved.view : null;
		// Reservoirs written before they had an elevation (2026-07-30) carry only a head. Giving
		// such a reservoir an elevation EQUAL to its head keeps the old network solving and reading
		// exactly as it did -- same fixed head, and a pressure of zero at the water surface --
		// rather than silently reinterpreting the whole thing as a tank standing on datum.
		doc.nodes.forEach(function (n) {
			if (n.type === 'reservoir' && n.elev === undefined) { n.elev = n._head || 0; }
		});
		nextId = saved.nextId || newNextId();
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
		// Task 333's affixes merge the same way, one level deeper. They ship EMPTY, so this is
		// really just a copy -- but written as a merge for the same reason as its siblings: the day
		// a field gains a stored default here, a document saved before it must still pick it up.
		var savedPre = savedLS.prefix || {}, savedSuf = savedLS.suffix || {};
		Object.assign(labelSettings.prefix.node, savedPre.node || {});
		Object.assign(labelSettings.prefix.link, savedPre.link || {});
		Object.assign(labelSettings.suffix.node, savedSuf.node || {});
		Object.assign(labelSettings.suffix.link, savedSuf.link || {});
		// A bare string, so it takes the same guarded assignment markExtrema does. An EMPTY string
		// is a real setting ("Q12.5", no gap) and must survive this, which is why the test is on the
		// type and not on truthiness.
		if (typeof savedLS.separator === 'string') { labelSettings.separator = savedLS.separator; }
		if (typeof savedLS.markExtrema === 'boolean') { labelSettings.markExtrema = savedLS.markExtrema; }
		backdrop = saved.backdrop || null;
		// Same one-level-deeper merge the labelSettings block above documents, and for the same
		// reason: `defaults` and `sectionsOpen` are nested objects, so a top-level Object.assign
		// swaps the saved one in whole and any default added AFTER that save comes back undefined
		// instead of at its default. Assigning the nested objects separately keeps every OLD saved
		// value while still picking up NEW keys (which seedDefaultInputs() then fills).
		var savedSettings = Object.assign({}, saved.settings || {});
		var savedDefaults = savedSettings.defaults || {}, savedSections = savedSettings.sectionsOpen || {};
		// idPrefixes joined this list when tanks arrived (Task 248): a document saved before then
		// carries {J,R,L,P,T} with no key for the tank, and a top-level assign would leave the new
		// element with no prefix at all rather than with its default.
		var savedPrefixes = savedSettings.idPrefixes || {};
		delete savedSettings.defaults; delete savedSettings.sectionsOpen; delete savedSettings.idPrefixes;
		settings = Object.assign(defaultSettings(), savedSettings);
		Object.assign(settings.defaults, savedDefaults);
		Object.assign(settings.sectionsOpen, savedSections);
		Object.assign(settings.idPrefixes, savedPrefixes);
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
		lastSolveResult = null;
		closePopup();
		buildDom();
		seedDefaultInputs();
		rebuildSettingsFields();
		rebuildLabelsFields();
		applyLegendPosition();
		// **NO applyMapHeight() HERE. THE BOTTOM OF THE MAP DOES NOT DEPEND ON THE MODEL** (Tom,
		// 2026-08-15, stating it as a rule: *"Bottom of map should not depend on the model."*). The
		// canvas height is a fact about the WINDOW and the page's own chrome; opening a different
		// project cannot change it, so re-deriving it on every open could only ever produce the same
		// answer or a wrong one -- and it was producing wrong ones, because this runs in the middle
		// of a rebuild, with the tab strip and the status row mid-flight.
		//
		// The one document-driven thing that CAN legitimately change it is the tab strip's own
		// height, when enough projects are open to wrap it onto another line. That is chrome, not
		// model, and renderTabs() re-measures for exactly that reason.
		refreshFontSizes();
		refreshSymbolSizes();
		renderLabelsLegend();
		applyMaskLabels();   // the setting belongs to the project, so opening one can change it
		updateEmptyHint();
		setStatus('');
		setMode('select');
		refreshMapStatus();   // units belong to the project now, so switching projects can change this
		refreshScenarioStatus();   // and so do the scenarios -- they are part of the document (Task 184)
		// The friction method belongs to the project too (Task 271), so opening one has to re-apply
		// the roughness unit selector's visibility -- otherwise a Darcy-Weisbach project opened
		// after a Hazen-Williams one shows a roughness length with no unit named anywhere.
		applyMethodUI();
		// A project or an .inp may ARRIVE holding a PRV/PSV/FCV, with the user never having picked a
		// type -- the case a warm-up hooked only to the type selector would miss entirely.
		warmEpanetIfNeeded();
		restoreViewOrFit();
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
		// ELEMENTS ONLY, and no override is scaled -- deliberately, not by omission. A v2 document
		// predates the scenario UI (Task 184), so nothing could ever have written an override into
		// one: the container shipped with Base as the only scenario and no write path at all. If a
		// v2 file ever turns up carrying overrides it was hand-edited, and guessing at its units
		// would be worse than leaving the numbers it states alone.
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
			p1.textContent = (pc.lpn_v2_restore_confirm || 'This calculator stores project units and inputs as entered, but it formerly converted numbers to SI for storage. This project was saved before that change, so its numbers were stored in SI. Convert them one last time to the current units? For your evaluation, these are some diameters that will be converted. Before and after values are shown:');
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
		rememberCurrentView();   // ...and where we were looking in it
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
		doc = { nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } };
		nextId = newNextId();
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
	// end of the column; engineers scan these by project.
	//
	// **THE SUFFIX IS `-lpn`, AND IT IS NO LONGER THE THING THAT IDENTIFIES THE FILE** (ROADMAP Task
	// 315, ratified by Tom 2026-08-14). It used to read `-lpn-hawsedc-engcalcs` -- 30 characters on
	// every file -- and it was that long for one reason: nothing INSIDE the document said what
	// format it was, so the whole burden of "findable a year later in a forgotten folder" sat on the
	// name. serializeProject() now writes `format`/`app`, which is strictly more durable than any
	// filename scheme, because a file in a forgotten folder is exactly the file somebody renamed.
	// With that carried inside, the suffix only has to disambiguate at a glance, and four characters
	// do that.
	//
	// Deliberately still `.json`: no generation-1 extension yet. The schema is moving weekly
	// (scenarios, valves, extended-period queued) and the product name is unsettled, so an extension
	// would encode a name that does not exist yet -- and a web page cannot deliver the only real
	// payoff of one (OS double-click association and a file-manager icon). The trigger that starts
	// that clock is written up in Task 315; until it fires, reading stays permissive and writing
	// stays boring.
	var LPN_FILE_SUFFIX = '-lpn';
	// Every file written before 2026-08-14 wears this. It is READ FOREVER -- see
	// projectNameFromFileName(), where stripping it in the wrong order silently renames a project.
	var LPN_FILE_SUFFIX_LEGACY = '-lpn-hawsedc-engcalcs';
	// Takes the name rather than reading the open project, so the copy branch in saveAs() can route
	// through it instead of spelling the convention out a second time. Two copies of a filename
	// convention is how they drift -- they had already drifted once by the time this was written.
	function projectFileName(name) {
		return safeFileName(name === undefined ? projectDisplayName(project) : name) + LPN_FILE_SUFFIX + '.json';
	}
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

	// ---- EPANET .inp import (ROADMAP Task 196) ----
	//
	// A DIFFERENT ACT FROM File > Open, and kept apart from it on purpose. Open is about OUR
	// documents: it carries a docId, a lock, a live file handle, and a Save that goes back where it
	// came from. An `.inp` has none of that -- it is somebody else's format, and writing our JSON
	// back into it would be a lie. So an import lands as a new BROWSER project, named after the
	// file, and Save as is the way to give it a home.
	//
	// The reading itself is js/lpn-inp.js, which is DOM-free and validated against the real EPANET
	// engine (dev/lpn-spike/validate_inp.js). Everything here is the other half: turning its SI
	// model into a document in the units the file was written in, and telling the user what the
	// import could not keep.

	// Which unit each selector should show for an imported file. The file's own units where this
	// page offers them -- EPANET's two systems are exactly the ft/in/psi/ft-of-water and
	// m/mm/m-of-water sets, so almost everything matches with no conversion at all. Only the flow
	// unit can miss (this page offers six, EPANET names ten), and a miss is harmless: every number
	// crosses through SI anyway, so the network is identical and only the label differs.
	// EVERY ONE OF EPANET'S TEN FLOW KEYWORDS NOW HAS A SELECTOR UNIT OF ITS OWN (Task 390 step 4).
	// `.inp` [OPTIONS] UNITS is a closed enumeration, so the `flow_epanet` family completes a finite
	// list rather than chasing one, and no import has to convert a flow to reach a unit this page
	// can show. Written as its own table rather than derived by comparing strings, because the
	// keyword and our unit key are spelled differently on purpose (CFS vs ft3ps).
	var LPN_INP_FLOW_UNIT = {
		GPM: 'gpm', MGD: 'mgd', IMGD: 'imgd', CFS: 'ft3ps', AFD: 'afd',
		LPS: 'lps', LPM: 'lpm', MLD: 'mld', CMH: 'cmh', CMD: 'cmd'
	};
	// The keywords whose unit the selector really shows, so the file's own number crosses untouched.
	// ALL TEN since the flow_epanet family landed -- kept as a table rather than deleted, because it
	// is the thing that would have to shrink again if a keyword ever lost its selector, and a table
	// that happens to be full says that far more plainly than a `true` would.
	var LPN_INP_FLOW_SAME = { GPM: 1, MGD: 1, IMGD: 1, CFS: 1, AFD: 1, LPS: 1, LPM: 1, MLD: 1, CMH: 1, CMD: 1 };
	function inpUnitSelections(parsed) {
		var us = parsed.unitSystem === 'us';
		return {
			lpn_u_length: us ? 'ft' : 'm',
			lpn_u_elevhead: us ? 'fth2o' : 'mh2o',
			lpn_u_pressure: us ? 'psi' : 'mh2o',
			lpn_u_diameter: us ? 'in' : 'mm',
			lpn_u_flow: LPN_INP_FLOW_UNIT[parsed.flowUnits] || (us ? 'gpm' : 'lps'),
			lpn_u_velocity: us ? 'ftps' : 'mps'
			// No lpn_u_gradient: head-loss gradient is dimensionless and an .inp does not name one.
		};
	}


	/**
	 * The parsed .inp as a saved document, ready for importProject().
	 *
	 * Must run with the units strip ALREADY on the file's units (inpUnitSelections above).
	 *
	 * **AN IMPORT MUST NOT REWRITE THE USER'S NUMBERS.** js/lpn-inp.js hands every quantity back
	 * in the file's own unit, and inpUnitSelections() has just put the selector on that same unit,
	 * so the number the file states is the number this document stores -- byte for byte, with no
	 * arithmetic anywhere on the path. This used to store `toDisplay(<SI>, unit)`, converting to SI
	 * in the parser and back out here through lib/Units.lib.php: a trip that is a no-op in
	 * principle and is not one in doubles. It stored 709.9913664 for a 710 ft elevation and
	 * 149.98747841154 for 150 gpm, and it does NOT go away with exact factors -- (x*f)/f is not an
	 * identity, and 35% of a random sample fails to return bit-identical even when the two factors
	 * are exact reciprocals. Pass-through is the fix; a better constant is not.
	 *
	 * The ONE thing that genuinely converts is a flow in a keyword this page has no selector for
	 * (see LPN_INP_FLOW_SAME). There the units really do differ, so arithmetic is the honest
	 * answer rather than a rounding error.
	 */
	// THE FILE'S OWN TEXT, carried onto the document beside the number it states (Task 390 step 3).
	// js/lpn-inp.js keeps a `tok` bag on every record it parses, keyed by the PARSER's field names;
	// the document spells several of those differently (a demand is `_demand`, a tank's vessel is
	// `tankDiameter`), so this is the one place the two vocabularies meet.
	//
	// THE SINGLE TEST IS `parseFloat(text) === storedValue`. A field that was converted on the way
	// in -- a flow in a keyword this page has no selector for, an emitter coefficient -- fails it
	// and arrives with no token at all, so nothing downstream has to know which fields converted.
	// Tokens for values NOT in `map` are simply not carried; a token is never invented.
	function carryInpTokens(src, dst, map) {
		var t = src && src.tok, out = null, k, dk;
		if (!t) { return dst; }
		for (k in t) {
			if (!Object.prototype.hasOwnProperty.call(t, k)) { continue; }
			dk = map[k];
			if (!dk || parseFloat(t[k]) !== dst[dk]) { continue; }
			(out || (out = {}))[dk] = t[k];
		}
		if (out) { dst.tok = out; }
		return dst;
	}
	var LPN_INP_TOK_JUNCTION = { elev: 'elev', demand: '_demand', x: 'x', y: 'y' },
		LPN_INP_TOK_RESERVOIR = { elev: 'elev', x: 'x', y: 'y' },
		LPN_INP_TOK_TANK = {
			elev: 'elev', level: '_level', minLevel: 'minLevel', maxLevel: 'maxLevel',
			diameter: 'tankDiameter', x: 'x', y: 'y'
		},
		LPN_INP_TOK_LINK = {
			length: '_length', diameter: '_diameter', roughness: '_roughness', k: '_k',
			setting: '_setting'
		},
		LPN_INP_TOK_POINT = { x: 'x', y: 'y' };

	function docFromInp(parsed, name) {
		// A flow from the file, in the unit the flow selector is now showing. `parsed.scale.flow`
		// is m3/s per one of the file's units, so the SI step is the parser's own constant and
		// this file keeps no second copy of it.
		var flowPassThrough = !!LPN_INP_FLOW_SAME[parsed.flowUnits];
		function inpFlow(v) {
			if (typeof v !== 'number') { return v; }
			return flowPassThrough ? v : toDisplay(v * parsed.scale.flow, 'lpn_u_flow');
		}
		var nodes = parsed.nodes.map(function (n) {
			if (n.type === 'reservoir') {
				// No `_head` written, deliberately: a blank head means "the water surface is at the
				// ground", and elevation already carries EPANET's total head. Writing the same
				// number into both would look identical and silently sever the link the page keeps
				// between them (see reservoirHead()).
				return carryInpTokens(n, { id: n.id, type: 'reservoir', x: n.x, y: n.y, elev: n.elev }, LPN_INP_TOK_RESERVOIR);
			}
			if (n.type === 'tank') {
				// A tank's four levels and its diameter are ALL in the Elevation/Head unit, because
				// they are all vertical distances measured on the same staff -- the diameter
				// included, which is the one that surprises people (see js/lpn-epanet.js). Nothing
				// here is blank-means-follow the way a reservoir's head is: EPANET states every one
				// of them, so every one is written.
				return carryInpTokens(n, {
					id: n.id, type: 'tank', x: n.x, y: n.y,
					elev: n.elev,
					// _level is scenario-overridable (leading underscore, read through effective())
					// because "what if the tank is drawn down to 2 m" is a scenario, and the same
					// treatment demand gets. The vessel's own geometry is not -- it sits beside
					// elev, which is a plain property for the same reason: a scenario changes
					// operating state, not what was built.
					_level: n.level,
					minLevel: n.minLevel,
					maxLevel: n.maxLevel,
					tankDiameter: n.diameter
				}, LPN_INP_TOK_TANK);
			}
			var j = {
				id: n.id, type: 'junction', x: n.x, y: n.y,
				elev: n.elev,
				_demand: inpFlow(n.demand)
			};
			// Dimensionless in the solver's own terms (m3/s per m^gamma), so it is stored as parsed
			// and never shown -- nothing in the UI edits an emitter yet, which is why the import
			// report names every junction that has one.
			if (n.emitter) { j._emitter = n.emitter; }   // base-write: import builds Base: an .inp arrives as one network with no scenarios
			return carryInpTokens(n, j, LPN_INP_TOK_JUNCTION);
		});
		var links = parsed.links.map(function (l) {
			var out = {
				id: l.id, type: l.type, from: l.from, to: l.to,
				verts: (l.verts || []).map(function (v) { return carryInpTokens(v, { x: v.x, y: v.y }, LPN_INP_TOK_POINT); }),
				_diameter: l.diameter,
				_roughness: l.roughness,
				// LENGTH IS THE FILE'S OWN NUMBER, and lenAuto is OFF. An EPANET length is the real
				// pipe length, which is routinely nothing like the distance between two symbols on
				// a schematic; letting linkGeomLength() recompute it on the first edit would quietly
				// redesign the network. Auto stays available in the popup for anyone who wants it.
				_length: l.length,
				lenAuto: false,
				_status: l.status,
				_k: l.k || 0
			};
			if (l.type === 'valve') {
				// A PRV/PSV setting is a pressure and an FCV's is a flow (js/lpn-inp.js's
				// valveSettingUnit names which); a throttle's is dimensionless. The pressure is
				// psi in a US file and metres of water in an SI one -- exactly what the pressure
				// selector is showing -- so it crosses untouched, and only a flow can need the
				// keyword conversion.
				out.valveType = (l.valveType || 'TCV').toUpperCase();
				out._setting = (out.valveType === 'FCV')   // base-write: import builds Base: an .inp arrives as one network with no scenarios
					? inpFlow(l.setting)
					: (l.setting || 0);
			}
			if (l.type === 'pump') {
				out.curvePoints = (l.curvePoints || []).map(function (pt) {
					return [inpFlow(pt[0]), pt[1]];
				});
				out.curveRef = null;
				// NO FITTED CURVE IS WRITTEN HERE (Task 390 step 5). An import used to fit h0/a/b
				// from the file's own points and store the triple beside them; pumpFit() derives it
				// at the solver handoff instead, so an imported pump carries exactly what the file
				// stated and nothing of ours.
			}
			return carryInpTokens(l, out, LPN_INP_TOK_LINK);
		});
		var nodeAt = {};
		nodes.forEach(function (n) { nodeAt[n.id] = n; });
		// A TEXT ELEMENT'S ID IS MINTED HERE AND MUST NOT COLLIDE WITH ONE THE FILE BROUGHT.
		//
		// This used to read 'T' + (i + 1), which was safe only while nothing else in the app used
		// the letter T -- and Task 248 gave it to tanks, which are T1, T2 in EPANET's own default
		// naming. An imported file with a tank T1 and a label would then have produced two elements
		// sharing an id, which allIds() treats as one: the rename validator would refuse a free
		// name and accept a taken one. So the prefix follows the text element's own key ('X') and
		// the number walks past anything already claimed.
		var takenIds = {};
		nodes.forEach(function (n) { takenIds[n.id] = 1; });
		links.forEach(function (l) { takenIds[l.id] = 1; });
		var textPrefix = settings.idPrefixes.X || 'X', textN = 0;
		function mintTextId() {
			var id;
			do { id = textPrefix + (++textN); } while (takenIds[id]);
			takenIds[id] = 1;
			return id;
		}
		var labels = parsed.labels.map(function (lb) {
			// An anchored label stores an OFFSET from its node, not a position (buildLabelEls'
			// model); EPANET stores the absolute point, so the anchor is subtracted here.
			var an = lb.anchorNode && nodeAt[lb.anchorNode] ? nodeAt[lb.anchorNode] : null;
			// An ANCHORED label stores an offset, so the file's text no longer states the number
			// this record holds and carryInpTokens refuses it without being told. A free label
			// stores the file's own point and keeps it.
			return carryInpTokens(lb, {
				id: mintTextId(), text: lb.text,
				x: an ? lb.x - an.x : lb.x,
				y: an ? lb.y - an.y : lb.y,
				anchorNode: an ? lb.anchorNode : null,
				sizeMult: 1,
				// EPANET's point is its label's TOP-LEFT CORNER, so that is what these two say and
				// the coordinate above is stored exactly as the file wrote it (Task 332). Not an
				// "imported" flag: it is an alignment, and Task 342 makes it a user control.
				align: 'left', valign: 'top'
			}, LPN_INP_TOK_POINT);
		});
		// nextId must clear every id the file brought, or the next element drawn would collide with
		// one. Only ids shaped like this page's own (prefix + number) can collide, so only those are
		// counted -- an EPANET id like "J-TF" is left alone and simply never reproduced.
		var next = newNextId();
		next.X = textN + 1;
		function claim(id, key) {
			var prefix = settings.idPrefixes[key] || key;
			if (id.slice(0, prefix.length) !== prefix) { return; }
			var n = parseInt(id.slice(prefix.length), 10);
			if (isFinite(n) && String(n) === id.slice(prefix.length) && n >= next[key]) { next[key] = n + 1; }
		}
		nodes.forEach(function (n) { claim(n.id, LPN_ID_KEY[n.type] || 'J'); });
		links.forEach(function (l) { claim(l.id, LPN_ID_KEY[l.type] || 'L'); });

		// **REBASED HERE, NOT BY THE MIGRATION CHAIN** (Task 354). An import is stamped at the
		// current version and therefore walks no migration steps at all, so the one entry point real
		// survey coordinates actually arrive through is the one that would have missed the origin.
		// A file drawn near zero gets {0, 0} and nothing moves.
		return rebaseDocument({
			v: LPN_STORAGE_VERSION,
			project: { name: name, activeScenario: 'base' },
			scenarios: defaultScenarios(),
			nodes: nodes, links: links, labels: labels, nextId: next,
			labelSettings: JSON.parse(JSON.stringify(labelSettings)),
			backdrop: null,   // an .inp names an image file; it never carries one. See the report.
			// SETTINGS ARE INHERITED WHOLE, and since Task 331 that needs no asterisk. An import
			// used to override `textSize` with a fortieth of the model's diagonal, because text was
			// sized in MAP UNITS and a file whose coordinates we had never seen could therefore
			// arrive unreadable -- which is exactly what Tom hit with Net3, a correct network whose
			// labels rendered at 0.2 units, a fraction of a pixel.
			//
			// Pixel sizing deletes the problem rather than estimating around it: 11 px is 11 px
			// whether the file is in feet, metres or State Plane coordinates, so there is nothing
			// left to guess and importTextSize() is gone. That heuristic was written on 2026-08-14
			// and removed the same week by the paradigm that made it unnecessary -- worth noting,
			// because a plausible estimate is the most expensive kind of workaround: it works well
			// enough that nobody looks for the cause.
			settings: JSON.parse(JSON.stringify(settings)),
			units: readUnitSelections()
		});
	}

	// One sentence per thing an import could not keep. Written as whole sentences rather than
	// composed from fragments (CLAUDE.md's key-reuse rule), and grouped so that closely related
	// EPANET features share one message instead of each buying its own translated string.
	function inpDropText(code) {
		var pc = EngCalcs.pageConfig || {};
		switch (code) {
			case 'headloss-formula': return pc.lpn_inp_drop_headloss || 'This file does not use the Hazen-Williams formula. This page computes Hazen-Williams, so the pipe roughness numbers were kept exactly as written but the results here will not match the results in EPANET.';
			// 'tanks' and 'links-on-tanks' are gone (Task 248): tanks are imported now, so neither
			// case can be reported. The lang keys are retired with them.
			case 'tank-volume-curve': return pc.lpn_inp_drop_tank_curve || 'These tanks have a volume curve, so they are not straight-sided. They were brought in as round tanks of the stated diameter. The water level in them is the level the file gives, so the results match; only the shape is simplified.';
			// 'valve-tcv-as-pipe' is gone (Task 248 phase 2): a throttle valve is a valve now, so
			// there is no substitution left to report. The remaining three say which of the three
			// outcomes a valve met -- kept and solvable here, kept but needing the EPANET engine,
			// or turned back into a pipe.
			case 'valve-tcv': return pc.lpn_inp_drop_tcv || 'These throttle valves came in as throttle valves, with the same loss the file gives them. Either solver can compute them.';
			case 'valve-active': return pc.lpn_inp_drop_valve_active || 'These valves control pressure or flow, and they open and close on their own as the water moves. They came in whole, and this page solves them with the EPANET engine, which it switches to on its own for this network.';
			case 'valve-dropped': return pc.lpn_inp_drop_valve || 'These valves are described by a curve or by a fixed pressure drop, and this page has no such element. They came in as open pipes, so the network is still connected but nothing is controlling it.';
			case 'check-valve': return pc.lpn_inp_drop_cv || 'These pipes only let water flow one way in EPANET. They came in as ordinary pipes, so water may now flow either way through them.';
			case 'demand-categories': return pc.lpn_inp_drop_demands || 'These junctions had more than one demand. The demands were added together into the one demand this page holds.';
			case 'demand-pattern':
			case 'head-pattern':
			case 'patterns': return pc.lpn_inp_drop_patterns || 'Demand patterns were left out. This page solves one moment in time, so every demand is the number written in the file.';
			case 'emitters-not-editable': return pc.lpn_inp_drop_emitters || 'These junctions have a sprinkler or leak coefficient. It was kept and it is being solved, but there is nowhere on this page to see or change it yet.';
			case 'pump-curve-reduced': return pc.lpn_inp_drop_curve_long || 'This pump curve had more than three points. Its lowest, middle and highest points were kept, which is the most this page fits a curve from.';
			case 'pump-curve-missing': return pc.lpn_inp_drop_curve_missing || 'This pump names a curve that is not in the file. It came in with no curve, so it adds no head.';
			case 'pump-constant-power':
			case 'pump-speed':
			case 'pump-pattern': return pc.lpn_inp_drop_pump_other || 'This pump is described by power, speed or a schedule rather than by a curve. It came in with no curve, so it adds no head.';
			case 'link-setting': return pc.lpn_inp_drop_setting || 'These links carry a setting this page cannot hold. They came in open.';
			case 'controls':
			case 'rules': return pc.lpn_inp_drop_controls || 'Controls and rules were left out. Every pipe, pump and valve came in at the state written in the file and stays there.';
			case 'extended-period': return pc.lpn_inp_drop_eps || 'This file runs over a period of time. This page solves one moment, so only the starting conditions came in.';
			case 'quality':
			case 'reactions':
			case 'sources':
			case 'mixing':
			case 'energy': return pc.lpn_inp_drop_quality || 'Water quality, chemical reaction and pump energy settings were left out. This page solves flow and pressure only.';
			case 'backdrop-not-embedded': return pc.lpn_inp_drop_backdrop || 'This file names a background picture but does not contain it. Add the picture yourself with Map, Backdrop.';
			case 'dangling-link': return pc.lpn_inp_drop_dangling || 'These pipes name a junction that is not in the file, so they were left out.';
			case 'unknown-flow-units': return pc.lpn_inp_drop_units || 'The flow units in this file were not recognised, so gallons per minute were assumed. Check every number before using the results.';
			default: return code;
		}
	}

	// The report. Shown ALWAYS, even when nothing was dropped -- a clean import is worth saying out
	// loud, because the one thing a user needs from an interop feature is to know whether to trust
	// it, and silence is the same answer as "something went wrong and nobody mentioned it".
	function showInpReport(parsed, fileName) {
		var pc = EngCalcs.pageConfig || {};
		// Several parse codes share one sentence, so they are merged here rather than printed twice.
		var byText = [], seen = {};
		parsed.dropped.forEach(function (d) {
			var text = inpDropText(d.code), at = seen[text];
			if (at === undefined) { seen[text] = byText.length; byText.push({ text: text, ids: d.ids.slice() }); }
			else { byText[at].ids = byText[at].ids.concat(d.ids); }
		});
		openDialog(function (body) {
			var h = document.createElement('p');
			h.style.margin = '0 0 8px';
			h.style.fontWeight = 'bold';
			h.textContent = (pc.lpn_inp_report_heading || 'Imported {file}').replace('{file}', fileName);
			body.appendChild(h);
			var sum = document.createElement('p');
			sum.style.margin = '0 0 8px';
			sum.textContent = (pc.lpn_inp_report_counts || '{nodes} junctions and reservoirs, {links} pipes and pumps, in {units}.')
				.replace('{nodes}', parsed.nodes.length)
				.replace('{links}', parsed.links.length)
				.replace('{units}', parsed.flowUnits);
			body.appendChild(sum);
			// The one place an anchor mode is worth mentioning, and only to someone whose file
			// actually had labels in it (Task 332). It is deliberately NOT a setting: an anchor mode
			// is not a preference anybody can hold an opinion about before they have seen it, and
			// this report already exists to say what is different about the file you just opened --
			// so it reaches the person who cares at the moment they care, for one string.
			if (parsed.labels && parsed.labels.length) {
				var anchorNote = document.createElement('p');
				anchorNote.style.margin = '0 0 8px';
				anchorNote.textContent = pc.lpn_inp_report_label_anchor
					|| 'Text labels are placed as EPANET places them, from their top left corner.';
				body.appendChild(anchorNote);
			}
			if (!byText.length) {
				var ok = document.createElement('p');
				ok.style.margin = '0';
				ok.textContent = pc.lpn_inp_report_clean || 'Everything in the file came across. Nothing was left out.';
				body.appendChild(ok);
				return;
			}
			var lead = document.createElement('p');
			lead.style.margin = '0 0 6px';
			lead.textContent = pc.lpn_inp_report_lead || 'This page does not hold everything EPANET does. Here is what changed on the way in:';
			body.appendChild(lead);
			var ul = document.createElement('ul');
			ul.style.margin = '0';
			ul.style.paddingLeft = '20px';
			byText.forEach(function (row) {
				var li = document.createElement('li');
				li.style.marginBottom = '4px';
				li.textContent = row.ids.length ? row.text + ' (' + row.ids.join(', ') + ')' : row.text;
				ul.appendChild(li);
			});
			body.appendChild(ul);
		}, [{ label: pc.lpn_dialog_ok || 'OK', fn: function () { } }]);
	}

	// ---- EPANET anchors a map label at its UPPER-LEFT CORNER; we STORE that and render it ----
	//
	// EPANET 2.2's [LABELS] documentation says "the coordinates refer to the upper left corner of
	// the label", and real files confirm it: two title-block lines 31 and 25 characters long have
	// stored X values 0.98 map units apart. Centre-anchored they would sit ~85 units apart at that
	// drawing's scale; left-anchored they share an edge, which is what a title block IS.
	//
	// **DO NOT CONVERT THE POINT INTO OUR CENTRE ANCHOR.** That is ill-posed: it moves the label by
	// half its own width and half a line height in WORLD units -- quantities a SCREEN-PIXEL-sized
	// label does not have at any particular zoom -- so the same file imported from two views writes
	// two different sets of coordinates and the difference is saved. Fitting the view first does
	// not rescue it: zoomExtent() derives its scale from bbox(), which measures the rendered label
	// text, so fit-then-convert is circular. Storing EPANET's own point and rendering from
	// lb.align/lb.valign is exact at every zoom and involves no arithmetic at all.

	// BOTH of EPANET's file formats, decided by the CONTENT rather than the extension.
	//
	// `.inp` is the documented text interchange format; `.net` is what EPANET's Windows UI saves
	// when you press Save, and is an undocumented binary. Tom's answer on 2026-08-11, the day after
	// `.inp` import shipped, settled it: every model he actually has is a `.net`, because that is
	// what the Save button makes. Telling a user to go and find File > Export > Network first is a
	// step most of them do not know exists.
	//
	// Sniffed, not guessed from the name: a file renamed `.inp` that is really binary would
	// otherwise be read as text and produce nonsense, and the reverse is just as easy to do. So
	// every file is read as BYTES, checked for the `.net` magic, converted if it has it, and
	// decoded as UTF-8 text if it does not.
	function inpTextFromBytes(buffer, fileName) {
		var pc = EngCalcs.pageConfig || {}, bytes = new Uint8Array(buffer);
		if (!EngCalcs.lpnLooksLikeNet || !EngCalcs.lpnLooksLikeNet(bytes)) {
			return new TextDecoder('utf-8').decode(bytes);
		}
		var conv = EngCalcs.lpnNetToInp(bytes, fileName);
		if (conv.ok) { return conv.inp; }
		// A `.net` we cannot read is refused outright, never half-read -- see the integrity check in
		// js/lpn-net.js. The way out is always available and always works, so the message names it.
		alert((pc.lpn_net_bad_file || 'This looks like an EPANET .net file, but this page could not read it. Open it in EPANET and use File, Export, Network to save it as an .inp file, then import that.') +
			(conv.detail ? ' (' + conv.detail + ')' : ''));
		return null;
	}

	function importInpFromFile(file) {
		// Logged on the attempt, not on success: somebody who arrives with an .inp file has already
		// told us how they mean to start, and a parse failure is a first action that went wrong --
		// which is a thing worth being able to see rather than a thing to hide from the histogram.
		logLpnFirstAction('import');
		var pc = EngCalcs.pageConfig || {}, reader = new FileReader();
		reader.onload = function (ev) {
			var text = inpTextFromBytes(ev.target.result, file.name);
			if (text === null) { return; }   // inpTextFromBytes already said why
			var parsed = EngCalcs.lpnInpParse ? EngCalcs.lpnInpParse(text) : { ok: false };
			if (!parsed.ok) {
				alert(pc.lpn_inp_bad_file || 'That file could not be read as an EPANET network file.');
				return;
			}
			// The units strip moves FIRST. docFromInp() is written against the selector state --
			// it stores the file's own numbers precisely BECAUSE the strip is already showing the
			// file's own units -- so this ordering is the fix, not a formality.
			applyUnitSelections(inpUnitSelections(parsed));
			var name = String(file.name).replace(/\.inp$/i, '') || String(file.name);
			var id = importProject(docFromInp(parsed, name));
			if (!id) { return; }   // importProject already reported the storage failure
			// NO RE-ANCHORING STEP HERE ANY MORE (Task 332): the labels are stored at EPANET's own
			// point and rendered from its own corner, so there is nothing to measure and nothing to
			// run after the document is on screen.
			// Arrives SAVED, for the same reason an uploaded project does: a file the user just
			// handed us off their own disk is not unsaved work. It earns its asterisk on the first
			// edit, and it can only ever go out as one of our own files, via Save as.
			stampProjectSaved(id);
			renderTabs();
			showInpReport(parsed, file.name);
		};
		reader.onerror = function () { alert(pc.lpn_inp_bad_file || 'That file could not be read as an EPANET network file.'); };
		// BYTES, not text: which of EPANET's two formats this is gets decided by the content (see
		// inpTextFromBytes), and decoding a binary .net as UTF-8 first would destroy it.
		reader.readAsArrayBuffer(file);
	}
	function pickInpFile() {
		var input = document.getElementById('lpn_inp_file');
		if (input) { input.click(); }
	}

	// ---- Live file handles ----
	// Download hands you a copy; this makes the FILE the thing you are working in.
	// `showSaveFilePicker` / `showOpenFilePicker` return a real `FileSystemFileHandle`.
	//
	// **localStorage remains the authority; a file link is additive.** The rejected alternative was
	// to rework the project library into a thin cache over real files, and browser support decides
	// it: the API is Chromium-only, so such a cache would have no story for Firefox and Safari
	// except keeping the localStorage path anyway -- two authorities, and every bug twice. Keeping
	// localStorage authoritative also keeps every quota-safe-write, adoptOrphans() and
	// migrate-on-read guarantee working untouched, and lets a user unlink and still have their
	// project.
	//
	// **NOTHING IS WRITTEN TO A FILE EXCEPT WHEN THE USER ASKS.** No autosave timer: a program that
	// saves your file behind your back takes away your right to walk away from a session, because
	// the ordinary Save / Discard / Cancel conversation is only possible if the file has not
	// already been overwritten by the time you reach it. The crash net is localStorage, written on
	// every edit regardless. Deliberately NOT a sibling .bak file -- a second artifact in the
	// engineer's folder that we cannot reliably clean up and they would have to explain.
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
	// **SAVE MUST NEVER CREATE A FILE.** A handle whose file has been moved or deleted does not
	// fail on write: `createWritable()` RECREATES it at the old path, so the bytes land, the
	// read-back matches, and every other check is satisfied while the user edits a file they did
	// not choose, with a second copy of their project where the first one used to be. (OPFS behaves
	// the same way, so the browser pass can test this rather than skip it.) Creating files is
	// Save as's job, and Save as asks.
	//
	// Deliberately independent of `knownStamp()`: a missing baseline is a reason to be MORE
	// careful, not less. A transient read error therefore refuses a save -- with a banner and a
	// picker to fix it -- which is the right way round for a page whose worst failure mode is
	// believing it has saved.
	//
	// The pair asks two different questions: `fileChangedUnderneath` is "is this still the same
	// file?", and this is "is there a file here at all?".
	//
	// **`getFile()` SUCCEEDING IS NOT PROOF THE FILE IS THERE.** It hands back a File object built
	// from what the browser already knows -- name, size, lastModified -- and on Windows it can do
	// that for a path with nothing at it any more. The error surfaces only when something reads the
	// BYTES. So read a byte: one byte off a slice is a real disk touch and costs nothing next to
	// the hundreds of kilobytes a save writes. Same reason `fileChangedUnderneath()` cannot be
	// trusted to notice on its own -- it compares metadata that may be as stale as this.
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
	//
	// **WHY A BAD STRIP HERE IS EXPENSIVE, AND IT IS NOT COSMETIC** (Task 315). saveCurrent() below
	// treats a filename differing from the SUGGESTED one as a DELIBERATE RENAME
	// (`if (handle.name !== suggested) { project.name = ... }`). Before 2026-08-14 a legacy file's
	// name and its suggestion were identical, so that branch stayed asleep; now they differ BY
	// CONSTRUCTION -- the suggestion carries `-lpn`, the file on disk carries the long form -- so
	// the branch fires on every re-save of every pre-existing file, and whatever this function
	// returns becomes what the user's project is called from then on.
	//
	// **Task 315 predicted the wrong hazard, and the correction is worth keeping.** It said the rule
	// was "longest suffix first", reasoning that `-lpn` matches INSIDE `-lpn-hawsedc-engcalcs`.
	// Measured 2026-08-14: with `$`-ANCHORED strips, which is what this has always used, order is
	// harmless -- `/-lpn$/` simply does not match a string ending in `engcalcs`, so either order
	// gives the right answer. Longest-first only matters if someone drops the anchors. The defect
	// that IS real is applying BOTH strips in sequence, which is what the obvious chained-replace
	// implementation does; see below. dev/lpn-spike/file-naming-harness.js pins both.
	//
	// EXACTLY ONE suffix is stripped, never both in sequence. A project a user genuinely named
	// `Z-lpn` was written by the old code as `Z-lpn-lpn-hawsedc-engcalcs.json`; strip the long form
	// and then also the short one and it re-opens as `Z`, having quietly lost a character the user
	// typed. Chaining two replaces reads as the obvious implementation and is wrong for that case.
	function projectNameFromFileName(fname) {
		var s = String(fname).replace(/\.json$/i, ''), lower = s.toLowerCase();
		if (lower.slice(-LPN_FILE_SUFFIX_LEGACY.length) === LPN_FILE_SUFFIX_LEGACY) {
			s = s.slice(0, -LPN_FILE_SUFFIX_LEGACY.length);
		} else if (lower.slice(-LPN_FILE_SUFFIX.length) === LPN_FILE_SUFFIX) {
			s = s.slice(0, -LPN_FILE_SUFFIX.length);
		}
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
			? projectFileName(projectDisplayName(project) + ' ' + (pc.lpn_project_copy_suffix || '(copy)'))
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
	// The stale-claim conversation.
	//
	// THREE choices, in the order a decent colleague tries them: Cancel and go ask is FIRST because
	// it is the hoped-for outcome, not a way out of the dialog; break it is last and blunt. The
	// prose enumeration and the button row are in the same order -- a numbered list that disagrees
	// with the buttons beneath it makes the reader re-derive the mapping every time. No "Create a
	// copy": read-only allows every edit, so open-read-only-then-Save-as IS making a copy, and one
	// fewer button is one fewer thing to weigh in a dialog already asking for a judgment.
	//
	// **Breaking a lock is not overwriting a file**, and that is structural rather than a promise:
	// writeOpenProjectToFile() checks the bytes on disk before every write. It is what allows the
	// break button to exist at all.
	//
	// **"{name} has this file open." on its own is not enough to decide anything.** The dialog asks
	// the reader to judge a claim -- wait, look read-only, or break it -- and that judgment is
	// entirely about time: how long since they touched it, and how much of that is unsaved. So each
	// case below says the most it truthfully can:
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
					? (pc.lpn_file_reconnect_alert || 'This project came from {file}. Your browser needs your permission again before it can write to it. Reconnect below.')
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
	// **ONE RULE: the asterisk follows `dirty`, and the fade says whether the project lives in a
	// file or only in this browser.** A browser project does NOT wear a standing asterisk. The
	// rejected alternative -- a faint asterisk on any browser project never exported -- made a
	// project created a moment ago, containing nothing anybody would miss, claim unsaved work;
	// closeTab() then had to special-case it back out (`projectIsEmpty`) to avoid a pointless
	// prompt, so the mark and the behaviour disagreed in plain view.
	//
	// What makes this work is that a freshly created project gets a BASELINE (stampProjectSaved(),
	// called by newBlankProject and by the gallery): `savedSig` is recorded at birth, so `dirty` is
	// false until the user changes something. The faint asterisk then means what the bold one means
	// -- there is work here that is in no file -- and appears at the first edit, the first moment
	// there is anything to lose.
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
		var stripHeightBefore = strip.getBoundingClientRect().height;
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
		// OPENS THE CHOOSER, exactly as File > New project does (Tom, 2026-08-10, agreeing it was a
		// defect: "it should open the chooser, which will become the units and method chooser").
		// It used to call newProject() directly, which inherits whatever units happened to be on the
		// strip -- the last place on this page where a project's units were decided by accident, and
		// the very thing Task 264 removed from the File menu. Both doors now ask the same question.
		// stopPropagation for the reason every menu opener here does it: see buildMenuBar().
		plus.addEventListener('click', function (e) { e.stopPropagation(); openNewProjectMenu(e.currentTarget); });
		strip.appendChild(plus);
		// THE ONLY DOCUMENT-DRIVEN THING THAT MAY MOVE THE MAP'S BOTTOM, and it is not the document:
		// it is this strip wrapping onto another line when enough projects are open. Measured rather
		// than assumed, so opening a project that does not change the strip's height re-measures
		// nothing -- which is the whole of Tom's rule that the bottom of the map must not depend on
		// the model (see refreshAllFromDocument()).
		if (strip.getBoundingClientRect().height !== stripHeightBefore) { applyMapHeight(); }
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
	var VIEW_POPOVERS = ['lpn_labels_popup', 'lpn_settings_popup', 'lpn_notes_popup'];
	// The control that opened the popover now showing -- the toolbar button, or the menu-bar item.
	// Same job openMenuAnchor does for the menus, and needed for the same reason: the click that
	// OPENED a popover must not also be read as a click away from it. Task 372 -- until then the
	// dismissal exempted the whole menu bar and the whole toolbar instead, which was a blunt way of
	// protecting these two buttons and cost Tom the thing he reported: "When Labels or Settings are
	// open, clicking in the top row of the menu bar does not close them."
	var viewPopoverAnchor = null;
	function closeViewPopovers(except) {
		VIEW_POPOVERS.forEach(function (id) {
			if (id === except) { return; }
			var el = document.getElementById(id);
			if (el) { el.style.display = 'none'; }
		});
		if (!except) { viewPopoverAnchor = null; }
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
		// Placed by the one shared placer (Task 372). A fly-out goes BESIDE its row (right edge, top
		// aligned) rather than below it, which is what makes it read as a branch of the parent
		// instead of a replacement for it; a top-level menu hangs under its menu-bar button and,
		// like every other panel here, gives up height rather than covering that button.
		openPanelAtAnchor(popup, anchor.getBoundingClientRect(), !!level);
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
	// Escape dismisses whatever pull-down is showing -- the other half of "these are menus, not
	// boxes" (Tom, 2026-08-13). It is what closed the panels before the X went away, and it is the
	// keyboard equivalent of clicking away. The DIALOG is deliberately untouched here: it asks a
	// question that has to be answered and Cancel is one of the answers, which is the same reason
	// the click-away dismissal skips it.
	document.addEventListener('keydown', function (e) {
		if (e.key !== 'Escape') { return; }
		closeMenu();
		closeViewPopovers();
	});
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
			{ icon: 'new', label: pc.lpn_new_blank_si || 'Blank project, SI units (l/s)', fn: function () { newBlankProject('si'); } }
			// **NO "FROM EXAMPLES" ROWS HERE** (Tom, 2026-08-15: *"Code-drawn: Remove the feature."*).
			// This fly-out used to carry two more rows that built the basic ring main in code. The
			// GALLERY ships the identical network as two files, with a description and a thumbnail
			// the code rows could never have -- so the second route was a duplicate that could only
			// drift, and it was the last caller of an automatic zoom-to-fit on content the user did
			// not open.
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
	function openFileMenu(anchor) {
		var pc = EngCalcs.pageConfig || {}, id = library.openId, entry = indexEntry(id);
		var linked = isLinked(id), api = fileApiAvailable();
		// **RECENT FILES GO LAST, BELOW EVERYTHING** (Tom, 2026-08-15: *"File, Save needs to be more
		// handy. It appears after Recents. Put Recents last."*). This block used to sit directly
		// under Open…, on the argument that thirty years of File menus put it there -- and the
		// argument was answered by using the menu: a recents list grows, and every row it grows
		// pushes SAVE further down a menu that Save is the most-used row of. A convention about
		// where a list goes does not outrank the cost it imposes on the command above it.
		//
		// Still ABSENT when there are none -- an empty "Recent files" heading over nothing teaches
		// the user only that the feature does not work yet. They cannot appear at all without the
		// File System Access API, because a browser with no handle to keep has nothing to remember:
		// there, opening a file is an upload and there is no way back to it.
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
			{ icon: 'open', label: pc.lpn_file_open || 'Open…', fn: openFromFile },
			// **UNDER OPEN, NOT UNDER NEW** (ROADMAP Tasks 305 and 314). Tom: *"currently we are
			// using New to 'open' examples, which is linguistically confusing"*, and on a proposed
			// reword of the old placeholder, *"Saying it differently doesn't change the lie."* New
			// creates something that did not exist; Open retrieves something that does. An example
			// exists. The row placed under New was right when there were two of them and is wrong
			// now that there is a library. Opening one drops a COPY into a new tab, which is what
			// keeps the word honest -- see openExample().
			{ icon: 'open', label: pc.lpn_examples_menu || 'Open example…',
				fn: function () { galleryDismissed = false; loadExamplesManifest(); showExamplesOverlay(); } },
			// A SEPARATE ROW FROM Open…, not a second file type on it (Task 196). Open means one of
			// our own documents, with everything that comes with it -- a lock, a live file handle, a
			// Save that writes back. An .inp has none of that and never will, so hiding it behind
			// the same word would promise a round trip we cannot make. Import says what it is.
			{ icon: 'open', label: pc.lpn_file_import_inp || 'Import EPANET file (.inp)…',
			  tip: pc.lpn_file_import_inp_tip, fn: pickInpFile }
		].concat([
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
			// **< 1, NOT < 2** (Tom, 2026-08-15: *"Save all should be gated on dirtyFileCount() < 1.
			// What was the purpose of 2? Indefensible, I think."* -- it was, and no reason for it was
			// ever written down). The old rule reasoned that with one dirty file Save all is merely
			// Save, which is true and is not a reason to grey out the row a user has just decided to
			// press: they are telling the app "make everything safe", and the answer "there is only
			// one, use the other button" is a refusal to do something it can plainly do.
			{ icon: 'saveall', label: pc.lpn_file_saveall || 'Save all', fn: saveAllFiles, disabled: dirtyFileCount() < 1 },
			// Only offered when there is something to revert TO and something to revert FROM.
			// Reachable in READ-ONLY on purpose (Tom, 2026-08-05: "Revert is not an option"). Revert
			// re-reads the file and throws your edits away -- which is exactly what somebody locked
			// out of a file wants when they decide the colleague's version wins. Disabling it there
			// left "Save as to a new file" as the only exit, and forked a project that did not need
			// forking. It writes nothing, so it is safe in every state.
			{ icon: 'revert', label: pc.lpn_file_revert || 'Revert', fn: revertCurrent, disabled: !(linked && entry && entry.dirty) },
			{ separator: true },
			{ icon: 'close', label: pc.lpn_file_close || 'Close', fn: function () { closeTab(id); } }
		], recentRows));
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
		// **NODES THEN LINKS, EACH IN THE ORDER YOU BUILD THEM** (Tom, 2026-08-15: *"Let's change to
		// Junction, Reservoir, Tank, Pipe, Pump, Valve. That's reasonable and follows both our
		// examples."*). The old order put reservoirs and tanks first and buried the junction and the
		// pipe -- the two tools that account for nearly every click -- in the middle of the row.
		// This one reads as the sentence a person draws in: junctions, then the sources that feed
		// them, then the pipe that joins them, then the two things you put ON a pipe. Text stays
		// last, being the only tool that adds nothing hydraulic.
		//
		// THE SAME ORDER APPEARS IN THREE PLACES and they must agree: this menu, the toolbar, and
		// the ID-prefix rows in Settings.
		openMenu(anchor, [
			{ icon: 'junction', label: pc.lpn_tool_add_junction || 'Junction', fn: function () { setMode('add-junction'); } },
			{ icon: 'reservoir', label: pc.lpn_tool_add_reservoir || 'Reservoir', fn: function () { setMode('add-reservoir'); } },
			{ icon: 'tank', label: pc.lpn_tool_add_tank || 'Tank', fn: function () { setMode('add-tank'); } },
			{ icon: 'pipe', label: pc.lpn_tool_add_pipe || 'Pipe', fn: function () { setMode('add-pipe'); } },
			{ icon: 'pump', label: pc.lpn_tool_add_pump || 'Pump', fn: function () { setMode('add-pump'); } },
			{ icon: 'valve', label: pc.lpn_tool_add_valve || 'Valve', fn: function () { setMode('add-valve'); } },
			{ icon: 'text', label: pc.lpn_tool_add_text || 'Text', fn: function () { setMode('add-text'); } },
			{ separator: true }
		].concat(backdropRows(true)).concat([
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
		]));
	}
	// The walkthroughs live on Tom's blog, not on this site, so this row is the one menu action in
	// the whole bar that leaves the page -- which is exactly why it is in Help and not a sixth
	// menu-bar button beside File/Edit/Insert/View/Settings, all of which act on the project.
	//
	// A NEW TAB, never a navigation: somebody reaching for a guide is mid-drawing, and taking the
	// map away to show them how to draw it is the wrong trade. noopener because the blog is not ours
	// to trust with a window handle.
	//
	// Plural is literal -- the one post contains three use-case walkthroughs -- so it links straight
	// there rather than to a blog label page (Tom, 2026-08-13).
	var LPN_WALKTHROUGHS_URL = 'https://tomsthird.blogspot.com/2026/08/hawsedc-free-unlimited-online-looped.html';
	// About and Contact are DELIBERATE REPEATS of the suite's own More menu (Tom, 2026-08-13: "We can
	// repeat About and Contact in this new Help menu"). Duplication is the right call because the two
	// menus serve different moments: the navbar is for somebody choosing a calculator, this is for
	// somebody already inside one who wants to know who wrote it or how to complain. Both reuse the
	// existing keys, so they cost no new translation and cannot drift from the navbar's wording.
	//
	// EVERY row here opens a NEW TAB, including the two internal pages, and that is not stylistic:
	// the beforeunload guard in init() prompts whenever a file project is dirty, so navigating this
	// tab to About.php would meet a browser "Leave site?" dialog mid-edit. The rule for this menu is
	// that it never takes your map away.
	function openHelpMenu(anchor) {
		var pc = EngCalcs.pageConfig || {};
		function ext(url) { return function () { window.open(url, '_blank', 'noopener'); }; }
		openMenu(anchor, [
			{ icon: 'help', label: pc.lpn_help_walkthroughs || 'Walkthroughs', fn: ext(LPN_WALKTHROUGHS_URL) },
			// The page's own Notes, which used to sit below the map (Tom, 2026-08-14). This is the
			// ONE row in this menu that does not open a new tab, because it does not leave the page
			// at all -- the notes are still in this document, hidden, and this reveals them. See the
			// comment on #lpn_notes_popup in Looped-Network.php for why the markup stayed in the
			// page rather than becoming a JS string.
			{ icon: 'help', label: pc.lpn_help_notes || 'Notes', fn: toggleNotesPopup },
			{ separator: true },
			// **A VERB, not a noun** (Tom, 2026-08-14, choosing it over "Contribute": both were a
			// downgrade for the old page-bottom invitation, and this one is the least of them).
			// "Contribute" reads as money or code to most visitors; the reports Tom actually gets
			// are a wrong word or a bad number, and "Fix something" is what invites those. The old
			// template_feedback prose moved to contact.php, so the invitation still exists in
			// words -- it is now read by somebody who has already decided to write.
			//
			// It REPLACES the Contact row rather than joining it, and that is deliberate: both go to
			// contact.php, and echoFeedback()'s own history in lib/Calculators.lib.php records what
			// happens when two links to one destination sit near each other -- "two collapsible
			// links to one destination halve each other's weight rather than doubling the
			// invitation" -- which is why echoHelpWanted() was absorbed into template_feedback in
			// the first place. The 2026-08-13 note calling Contact a deliberate repeat of the
			// navbar described it as being for somebody inside a calculator "who wants to know who
			// wrote it or how to complain"; About answers the first and this answers the second, in
			// a verb. Contact keeps its own place in the suite navbar for the other moment.
			{ icon: 'mail', label: pc.lpn_help_fix || 'Fix something', fn: ext('contact.php') },
			{ separator: true },
			// **THE LEGAL ROW LIVES HERE BECAUSE THIS PAGE HAS NO FOOTER** (2026-08-14). Task 286
			// required the notice to be FINDABLE and withdrawal to be as easy as consent; it never
			// required a particular piece of furniture, and a footer under a full-window map editor
			// is furniture this page cannot afford. Checked against epanet-js at Tom's suggestion:
			// their splash panel carries "Terms and conditions" and "Privacy policy" in its own
			// sidebar, not in a page footer. Same answer, arrived at independently.
			//
			// Also mirrored in the examples gallery, which is what a first-time visitor actually
			// sees -- again as epanet-js does it. Two placements, because the gallery is absent
			// once you have a network and the menu is absent until you open it.
			{ icon: 'info', label: pc.privacy_link || 'Privacy notice', fn: ext('privacy.php') },
			{ icon: 'info', label: pc.terms_link || 'Terms of use', fn: ext('terms.php') },
			// NOT ext(): this reopens the banner in place. window.ecReopenConsent is exported by
			// lib/Consent.lib.php so the two lines of "unhide and scroll" are not copied here, free
			// to drift from the banner they operate.
			{ icon: 'settings', label: pc.consent_settings_link || 'Cookie settings',
				fn: function () { if (window.ecReopenConsent) { window.ecReopenConsent(); } } },
			{ separator: true },
			// About last, where every other Help menu in the world puts it.
			{ icon: 'info', label: pc.about_main_menu || 'About', fn: ext('About.php') }
		]);
	}

	// The Notes, revealed. Centred rather than hung off the menu button, because this is a column of
	// prose to be read, not a control panel to be operated next to the thing it controls -- and it
	// is the only popover here that can be taller than the map it covers, so it takes its own
	// scrollbar via .lpn-popover-body.
	function toggleNotesPopup() {
		var popup = document.getElementById('lpn_notes_popup');
		if (!popup) { return; }
		if (popup.style.display === 'block') { popup.style.display = 'none'; return; }
		closeMenu();
		closeViewPopovers();
		popup.style.display = 'block';
		var h = fitPanelToViewport(popup);
		var pr = popup.getBoundingClientRect();
		popup.style.left = Math.max(POPUP_EDGE, (window.innerWidth - pr.width) / 2) + 'px';
		popup.style.top = Math.max(POPUP_EDGE, (window.innerHeight - h) / 2) + 'px';
	}
	function wireNotesPopup() {
		var x = document.getElementById('lpn_notes_close');
		if (x) { x.addEventListener('click', function () { document.getElementById('lpn_notes_popup').style.display = 'none'; }); }
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
	// openSettingsMenu() is GONE (Tom, 2026-08-08). Its three rows now live where they belong: Settings
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
			// Settings is the one menu-bar item that opens a PANEL, not a pull-down (Tom,
			// 2026-08-08): "there be a duplicated identical Settings that lives on the Toolbar and in
			// the Menu". Identical label, identical element, both places -- which is the rule the old
			// arrangement broke by making the toolbar button open the panel and the menu open a list
			// whose first row was also called Settings.
			{ id: 'lpn_menu_settings', icon: 'settings', label: pc.lpn_menu_settings || 'Settings', open: function (a) { toggleSettingsPopup({ currentTarget: a }); } },
			// Last, where a Help menu goes everywhere else. One row today (Walkthroughs); it is also
			// the home for the things that currently have none -- EPANET solver notes, keyboard
			// shortcuts, "report a problem".
			{ id: 'lpn_menu_help', icon: 'help', label: pc.lpn_menu_help || 'Help', open: openHelpMenu }
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
				? (pc.lpn_close_browser_confirm || '{name} is kept only in this browser. If you close it without saving it to a file, it is gone for good.')
				: (pc.lpn_close_save_confirm || 'Save your changes to {name} before closing it?')).replace('{name}', name);
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
			// TWO EXEMPTIONS, AND NO MORE THAN TWO (Task 372). The button that opened the popover,
			// because its own handler has already run and closing here would undo it; and a click on
			// a MENU ROW, because rows are what open Labels, Settings and the Notes from the View and
			// Help menus, and the row is not inside the popover it just opened.
			//
			// What is deliberately NOT exempt any more is the menu bar and the toolbar at large.
			// Exempting them was a blunt way of protecting the one button above, and it bought Tom's
			// report: clicking the top row of the menu bar left the panels open while clicking
			// anywhere else closed them. The menu-bar ITEMS never reach this handler at all -- they
			// stopPropagation so opening a menu does not immediately dismiss it -- so the exemption
			// was only ever covering the bar's empty space and the toolbar's other buttons, which are
			// exactly the clicks a user means as "away".
			var onOpener = viewPopoverAnchor && (e.target === viewPopoverAnchor ||
				(viewPopoverAnchor.contains && viewPopoverAnchor.contains(e.target)));
			var inMenu = e.target.closest && e.target.closest('#lpn_menu_popup, #lpn_menu_popup2');
			if (!inside && !onOpener && !inMenu) { closeViewPopovers(); }
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
		// Its own picker rather than a second accept type on the one above: the two land in
		// different places (our document reader vs the EPANET reader), and one input serving both
		// would have to guess which from the extension -- a guess with a silent wrong answer.
		var inpInput = document.getElementById('lpn_inp_file');
		if (!inpInput) { return; }
		inpInput.addEventListener('change', function () {
			var f = inpInput.files[0];
			inpInput.value = '';
			if (f) { importInpFromFile(f); }
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
		doc = { nodes: [], links: [], labels: [], origin: { x: 0, y: 0 } };
		nextId = newNextId();
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
		refreshScenarioStatus();
		// **NO FIT HERE** (Tom, 2026-08-15: *"Cleared network: Why rezoom? To what? Who cares? Did
		// you set some arbitrary initial standard?"* — yes, and it was arbitrary). An empty drawing
		// has no extent, so bbox() falls back to a 0-10 square and the "fit" was a zoom to an
		// invented ten-unit box. The reader keeps the view they were looking at, which is the only
		// answer that means anything: there is nothing to look at, and where they were is where
		// they will start drawing.
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
		// EVERY LABEL'S TEXT AND LEADER LIVES IN THIS ONE SHARED LAYER (Task 146.01 draw-order fix,
		// Tom, 2026-07-30), never appended alongside the element it belongs to: a label goes here
		// whether it belongs to a node, a link or a Text object, so ALL labels sit above ALL
		// node/link symbols. Building each label into nodesLayer/linksLayer the way the symbol next
		// to it does was the original design, and it broke exactly the way Tom described -- draw
		// order tracked creation order, so a later-built node's symbol painted over an earlier
		// node's already-placed label.
		labelsLayer = el('g', {}, world);
		// Topmost layer (after labelsLayer) so the rubber-band is never hidden under a node/link
		// while drawing a pipe/pump (Tom, 2026-07-30).
		rubberBandEl = el('line', { 'class': 'lpn-rubberband', style: 'display:none' }, world);
		// Above everything, and EMPTY unless ?debug=boxes is on the URL -- see drawCollisionBoxes().
		debugBoxLayer = el('g', {}, world);
		setTransform();
		wireToolbar();
		buildLabelBench();   // no-op unless ?debug=labels is on the URL
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
			library.openId = firstId;
			project.name = firstName; // the tab and the document have to agree from the first frame
			// **AND IT IS BORN CLEAN, WHICH THIS BRANCH FORGOT** (Tom, 2026-08-15: *"The gallery
			// project (initial project) gets an unwarranted asterisk. But revert is disabled."*).
			//
			// Dirtiness is `docSignature() !== entry.savedSig`, so an entry with NO savedSig is
			// dirty from its first breath -- and an empty project has nothing to save. Every other
			// way of making a project goes through stampProjectSaved(); this one registers the entry
			// by hand, precisely to avoid repainting a UI that does not exist yet, and skipped the
			// stamp along with it. The asterisk was then inescapable: Revert is for FILE projects, so
			// the one control that clears an asterisk was disabled on the only project that had an
			// unearned one.
			//
			// Stamped inline rather than by calling stampProjectSaved(), for the same reason the
			// entry is pushed inline: that function ends in renderTabs(), and the tab strip is not
			// wired yet. The name is set FIRST because the signature includes it.
			library.projects.push({
				id: firstId, name: firstName, updated: Date.now(), savedSig: docSignature()
			});
			saveIndex();
		}
		wireLabelsPopup();
		wireNotesPopup();
		// AFTER loadFromStorage() (so a saved default is never overwritten -- seedDefaultInputs()
		// fills nulls only) and BEFORE wireSettingsPopup() (which calls rebuildSettingsFields(),
		// where a still-null default would render as an empty box). Also necessarily after the
		// units strip is in the DOM, which is what the seeding exists to wait for.
		seedDefaultInputs();
		wireSettingsPopup();
		buildMenuBar();
		wireScenarioButton();
		wireTabs();
		applyLegendPosition();
		applyMapHeight();
		// Node/vertex radii are already built at the right size (buildDom() reads symbolFactor()),
		// but the --lpn-sym custom property the stroke widths read is only ever written here and in
		// refreshSymbolSizes() -- so a saved non-default symbol size needs this call to take effect.
		refreshSymbolSizes();
		applyLabelVisibility();
		applyMaskLabels();
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
		// COMING BACK TO THE TAB RE-MEASURES (Tom, 2026-08-15: *"Zoom changes for Net3 when I go to
		// another tab and then return."*). Nothing here changes state.s, so a "zoom change" on
		// return can only be the CANVAS changing size under a transform that did not -- i.e. a
		// height applied while the tab was hidden and the rects were unreliable. The guard in
		// applyMapHeight() stops the bad value being stored; this re-runs the measurement once the
		// page is visible and the numbers mean something again.
		document.addEventListener('visibilitychange', function () {
			if (!document.hidden) { applyMapHeight(); }
		});
		// **AND AGAIN ONCE THE PAGE HAS ACTUALLY FINISHED ASSEMBLING ITSELF.** init() runs at
		// DOMContentLoaded, which is before stylesheets finish applying, before the webfonts land,
		// and before the site navbar above the canvas has settled to its real height -- so the first
		// measurement is taken of a page that is still moving. That is stages 1 and 2 of Tom's
		// report, and no amount of arithmetic fixes a measurement of the wrong thing: the answer is
		// to measure again when there is something stable to measure.
		window.addEventListener('load', armMapSizing);
		if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
			document.fonts.ready.then(function () { applyMapHeight(); });
		}
		// One frame after init, for the common case where everything is cached and `load` fired
		// before this listener was attached -- pageSettled() decides whether it is too early.
		if (window.requestAnimationFrame) { window.requestAnimationFrame(function () { applyMapHeight(); }); }
		// THE FAILSAFE, and the only reason it exists: a canvas authored at height 0 stays invisible
		// until something sizes it, so a subresource that never finishes would leave the page with no
		// map at all. Two seconds is long enough that it never beats a real `load`, and short enough
		// that a broken one is not a dead page.
		window.setTimeout(armMapSizing, 2000);
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
		// **BOOT GOES THROUGH THE SAME DOOR AS EVERY OTHER OPEN, AND DID NOT.** It called
		// zoomExtent() outright, so a reload IGNORED the document's saved view and re-fitted --
		// which is both the autozoom Tom has just outlawed and a plain bug: the one path where a
		// user most expects to come back to where they were was the one path that would not.
		// refreshAllFromDocument() has always ended in restoreViewOrFit(); boot has its own
		// sequence and never picked that up.
		restoreViewOrFit();
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
		// **THE TWO COMMANDS ON THIS TOOLBAR ARE SAVE AND SAVE AS** (Tom, 2026-08-15: *"I'm thinking
		// optimal UX. Let's remove New project and Background image from the toolbar and add Save
		// and (since our paradigm often makes it the only choice) Save as…"*).
		//
		// A toolbar slot is the most expensive space on the page and it should hold what a person
		// does OFTEN. New project is once per project, and Background image is once per project at
		// most and never at all for the majority who have no aerial to hang the network on; both are
		// still in the menus, which is where a once-per-project command belongs. Saving is the thing
		// you do every few minutes, forever.
		//
		// AND SAVE AS IS NOT A SECOND-CLASS TWIN HERE, which is why it earns its own slot rather than
		// hiding behind Save: a browser project has no file yet and a read-only project cannot write
		// back to one, so on this page Save As is frequently the ONLY thing Save can mean. Both
		// buttons, always, so the one that will work is on screen.
		var fileGroup = group();
		var saveBtn = document.createElement('button');
		saveBtn.type = 'button';
		setLabel(saveBtn, 'save', pc.lpn_file_save || 'Save');
		if (pc.lpn_file_save_tip) { saveBtn.title = pc.lpn_file_save_tip; }
		saveBtn.addEventListener('click', function () { saveCurrent(); });
		fileGroup.appendChild(saveBtn);
		// The picker still needs its listener even though its button has gone -- see wireBackdropMenu().
		wireBackdropMenu();
		var saveAsBtn = document.createElement('button');
		saveAsBtn.type = 'button';
		setLabel(saveAsBtn, 'saveas', pc.lpn_file_saveas || 'Save as…');
		if (pc.lpn_file_saveas_tip) { saveAsBtn.title = pc.lpn_file_saveas_tip; }
		saveAsBtn.addEventListener('click', function () { saveAs(); });
		fileGroup.appendChild(saveAsBtn);

		// `data-edits` is VESTIGIAL since Task 211 and nothing reads it. It marked the controls that
		// read-only used to disable -- back when read-only took editing away. It no longer does:
		// read-only now means only that you cannot save over somebody else's file, exactly as in Word,
		// and Save routes to Save As instead. The attributes are left in place because they are a
		// correct, maintained answer to "does this control change the network", which the next feature
		// that needs that question (a review mode, a locked scenario) can use without re-deriving it.
		var addGroup = group();
		addGroup.dataset.edits = '1';
		// Junction, Reservoir, Tank, Pipe, Pump, Valve, Text -- the same order as the Insert menu and
		// the ID-prefix rows. See openInsertMenu() for why that order.
		[
			{ mode: 'add-junction', key: 'lpn_tool_add_junction', icon: 'junction' },
			{ mode: 'add-reservoir', key: 'lpn_tool_add_reservoir', icon: 'reservoir' },
			{ mode: 'add-tank', key: 'lpn_tool_add_tank', icon: 'tank' },
			{ mode: 'add-pipe', key: 'lpn_tool_add_pipe', icon: 'pipe' },
			{ mode: 'add-pump', key: 'lpn_tool_add_pump', icon: 'pump' },
			{ mode: 'add-valve', key: 'lpn_tool_add_valve', icon: 'valve' },
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
	// TOPOLOGY. A five-junction ring fed at one point, not the two parallel pipes between one pair
	// of junctions that a solver is equally happy with: only the ring shows flow leaving the tie-in
	// BOTH ways and meeting at a hydraulic divide (between J3 and J4, where flow reverses and head
	// loss crosses zero), which is the whole reason looped networks need a solver.
	//
	// SCALE. A real network a user brings is on the order of 1000 m (3000 ft) across, and at that
	// size the default 2.5-unit text is invisible. So the geometry and settings.textSize are set
	// TOGETHER (see the comment on that line): what matters is the RATIO between linework and
	// lettering, not either one alone.
	//
	// UNITS AND PLACEMENT. ONE drawing serves both presets: laid out once in map units, with no
	// US/SI coordinate scaling. Only the real SI quantities (elevation, demand, diameter, pump
	// curve) go through niceDefault().
	//
	// **Map coordinates are NOT unitless -- they FOLLOW the Length/Map declaration.** So this one
	// drawing is a 1400 **ft** ring for a US visitor and a 1400 **m** ring for a metric one; the
	// metric network is physically ~3.3x larger, not the same system in other units. **Accepted
	// deliberately:** both are realistic systems, both solve to sensible pressures (checked in
	// dev/lpn-spike/example-network-harness.js), and with no backdrop registered there is nothing
	// on screen for the difference to contradict. Revisit if the example ever ships with a
	// background image, where a scale meaning two different things would be visible and wrong.
	//
	// Anchored at 5000,5000 rather than the origin, so it lands in positive coordinates that look
	// like a survey or state-plane grid. Extent 1400 x 700, centre exactly 5000,5000.
	//
	// **NOTHING IN THE APP CALLS THIS.** The gallery ships the same ring main as
	// Basic-example-US/SI-units-lpn.json. It stays as the fixture SEVEN harnesses build their
	// network from -- closed-link, gradient-label, id-prefix, friction-method, label-affix,
	// readout-sign and example-network all export it and solve it. Retiring it means giving those
	// a network some other way (ROADMAP Task 378). Said plainly: this is 289 lines shipped to
	// every visitor for the benefit of the test suite.
	function drawExampleNetwork(system) {
		if (doc.nodes.length > 0) {
			var pc = EngCalcs.pageConfig || {};
			if (!window.confirm(pc.lpn_confirm_example || 'This adds the example to the network you already have. Continue?')) { return; }
		}
		saveUndoSnapshot();
		// THE EXAMPLE FORCES HAZEN-WILLIAMS (ROADMAP Task 271), for the same reason it forces its
		// units. Its pipe roughness is 130 -- an HW C. newProject() INHERITS settings from the
		// project you were in, so once the friction method became switchable, a visitor sitting on
		// Manning who chose Example got a ring main whose every pipe carried n = 130: a roughness
		// four orders of magnitude out, converging happily to nonsense, with nothing on screen to
		// say why. Tom's rule for units is exactly the rule here -- *"We never create an example
		// based on the current units... We should force the units we want and label thusly."*
		//
		// This is the one place the method is set without asking, and it is safe precisely because
		// it is not a switch: the network is being CREATED at this instant, so there are no
		// already-typed roughness numbers for it to invalidate. Contrast the settings-panel select,
		// which must confirm.
		settings.method = 'hw';
		applyMethodUI();
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
		j1.elev = niceDefault('lpn_u_elevhead', 'fth2o', 45, 14); j1._demand = 0;   // base-write: the example network is drawn into a fresh project, always Base
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
			n._demand = niceDefault('lpn_u_flow', 'gpm', ring[i].demand[0], ring[i].demand[1]);   // base-write: the example network is drawn into a fresh project, always Base
			nodes.push(n);
		}
		for (i = 0; i < nodes.length; i++) {
			pipe = addLink('pipe', nodes[i].id, nodes[(i + 1) % nodes.length].id);
			pipe._diameter = dia;   // base-write: the example network is drawn into a fresh project, always Base
			pipe._roughness = rough;   // base-write: the example network is drawn into a fresh project, always Base
			if (bends[i]) { bends[i].forEach(function (v) { pipe.verts.push({ x: v.x, y: v.y }); }); }
			// addLink() computed .length before those vertices existed (straight node-to-node
			// distance); rebuildLink() only rebuilds the DOM, not the length -- recompute
			// explicitly, or the initial displayed length undercounts the bend until the vertex is
			// next dragged (which goes through updateVertex()/updateLinkGeometry(), where lenAuto
			// recomputation already happens correctly). Tom caught this: 25 ft shown, jumped to
			// 28 ft only after a drag.
			pipe._length = linkGeomLength(pipe);   // base-write: the example network is drawn into a fresh project, always Base
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
		j6._demand = niceDefault('lpn_u_flow', 'gpm', 100, 0.006);   // base-write: the example network is drawn into a fresh project, always Base
		var sep = addLink('pipe', r2.id, j6.id);
		sep._diameter = dia;   // base-write: the example network is drawn into a fresh project, always Base
		sep._roughness = rough;   // base-write: the example network is drawn into a fresh project, always Base
		sep._length = linkGeomLength(sep);   // base-write: the example network is drawn into a fresh project, always Base
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
			try { noteTextWidth(le, le.text.getBBox().width); } catch (err) { /* pre-layout measure can throw; stale width stands */ }
			if (anchorNode && side) {
				var an = nodeById(anchorNode),
					gap = nodeRadius(an) + effectiveFontSize(sizeMult) * 0.5;
				lb.x = (side === 'left' ? -1 : 1) * (textLabelWidth(le) / 2 + gap);
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
		// 4600 -> 4572 when the units line was added below the anchor: the block grew downward by
		// (30 + 20)/2 + 8 = 33 units at the SHIPPED text size, so the whole thing moves up by
		// enough to hand the ring back the ~35 units of clearance Tom asked for. Sized against the
		// shipped default deliberately, not against this session's textSize -- see the harness note
		// on the default-size gap check, which is the assertion that would otherwise not notice.
		var titleY = 4572;
		annotate(5000, titleY - (effectiveFontSize(2) + effectiveFontSize(1.5)) / 2 - 8, null, pcx.menu_brand, 2);
		annotate(5000, titleY, null, pcx.lpn_main_menu, 1.5);
		// THIRD LINE: what the example is drawn in (Tom, 2026-08-10 -- "I do like having the units as
		// a title text on the example projects. And I don't see that."). He was not misunderstanding;
		// it was not there. It belongs here and not on the browser tab (see unitSetLabel()) because
		// this drawing is the one thing on the page that leaves the page: a screenshot of the example
		// carries no status strip, and Task 264 made each example COMMIT to a unit system, so the
		// drawing should say which one it committed to.
		//
		// Stacked DOWNWARD from the anchor line, mirroring how the first line is derived upward from
		// it -- by the two lines' own half-heights plus the same 8-unit gap, never a flat offset, so
		// the block stays tight at any text size. It lands between the title and the ring, which had
		// ~35 units of clearance; a 1.0-size line is 20 tall at the default, so the ring keeps room.
		annotate(5000, titleY + (effectiveFontSize(1.5) + effectiveFontSize(1)) / 2 + 8, null, unitSetLabel(system), 1);
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
		// ---- Re-anchor so the centre READS 5000,5000 (Task 274; Tom, 2026-08-11: "Center is now at
		// 5000,-5000. Should be at 5000,5000.") ----
		// Everything above is laid out around INTERNAL y = 5000, and internal is Y-down, so the
		// coordinate readout showed -5000. A pure TRANSLATION of -10000 puts the centre at internal
		// -5000, which reads +5000, and moves nothing relative to anything else -- so every
		// clearance, stacking and side-flip number reasoned about above still holds exactly as
		// written, and the drawing on screen is unchanged.
		//
		// ABSOLUTE coordinates only. A Text label anchored to a node stores an OFFSET in lb.x/lb.y,
		// and a data label likewise in n.lx/n.ly; translating a vector would drag every callout off
		// the element it points at.
		doc.nodes.forEach(function (n) { n.y -= 10000; });
		doc.links.forEach(function (l) { (l.verts || []).forEach(function (v) { v.y -= 10000; }); });
		doc.labels.forEach(function (lb) { if (!lb.anchorNode) { lb.y -= 10000; } });
		buildDom();   // every element above was built at its pre-shift position
		updateEmptyHint();
		saveToStorage();
		zoomExtent(true);   // automatic: a network drawn in code has no stored view
		// ...and again once the labels exist. zoomExtent() measures the RENDERED label text, and at
		// this instant there is none: the solve is 300 ms behind on the debounce, so every node's
		// data label is still a placeholder width. Fitting now is right for immediate feedback but
		// leaves labels hanging outside the map a third of a second later, which is the second half
		// of Task 254 ("it is not zoomed to fit after drawing. Some labels extend beyond the map").
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
					n._demand = demand;   // base-write: drawTestGrid builds a scratch network in Base
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
		zoomExtent(true);   // automatic: a network drawn in code has no stored view to restore
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
				coordsEl.textContent = 'X: ' + outwardX(w.x).toFixed(2) + '  Y: ' + outwardY(w.y).toFixed(2);
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
				// GRABBING A REPEAT COLLAPSES THE CHAIN TO WHERE IT WAS GRABBED, and this line is the
				// whole of why it does not jump first. A dragged link label is stored as ONE offset
				// from the pipe's half-way point (l.lx/l.ly), so the moment a drag starts the other
				// copies go away -- there is only one of them to describe. Seeding the offset from
				// the COPY's own station means the surviving label appears exactly under the cursor
				// rather than sliding to the middle of the pipe and then following.
				var ll = linkById(t.dataset.linklbl), le5 = linkEls[t.dataset.linklbl],
					rep5 = (t.dataset.repeat !== undefined && le5 && le5.repeats)
						? le5.repeats[+t.dataset.repeat] : null,
					posL = rep5 ? repeatLabelPos(ll, rep5) : linkLabelPos(ll),
					w5 = screenToWorld(e.clientX, e.clientY);
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
			// A PAN CHANGES WHICH REPEATED LABELS ARE WORTH DRAWING, so the cull is re-run when the
			// pan finishes -- not on every frame of it, which would rebuild elements at 60 Hz for a
			// gesture whose whole point is that nothing in the drawing changed. The cull keeps a
			// full view-span of margin on every side, so a pan shorter than a screen never reaches
			// a stretch that has not been labelled yet, and a longer one fills in on release.
			var wasPan = drag && drag.type === 'pan';
			if (drag && drag.type === 'pinch' && pointers.size < 2) { drag = null; dragDirty = false; return; }
			if (drag && drag.pointerId === e.pointerId) { drag = null; dragDirty = false; }
			if (wasPan && !drag) { relayoutLabels(); }
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
		// THE CLICK THAT ENDS A REGISTRATION IS NOT A TAP FOR A TOOL (Tom, 2026-08-14: "When moving a
		// background image, node select and delete needs to be disabled"). Every other pointer path
		// already checked regMode, and the pointerup below checks it too -- but the LAST click of a
		// Scale/Position sequence clears regMode in a CAPTURE-phase listener (startBackdropPosition(),
		// handler2), and the tool's own pointerup runs afterwards, in the bubble phase of that same
		// event, by which time the flag it depends on is already false. So picking a node as the
		// target of a Move also opened that node's popup -- or, with the Delete tool active, DELETED
		// the node you had just aimed at.
		// Gating the tap's START, not its end, is what makes this hold: the pointerdown happens while
		// regMode is unambiguously still on, and a tap with no beginning cannot be completed.
		svg.addEventListener('pointerdown', function (e) {
			if (regMode) { downPt = null; return; }
			downPt = { x: e.clientX, y: e.clientY };
		});
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
			if (mode === 'add-junction' || mode === 'add-reservoir' || mode === 'add-tank') {
				// Snap-on-create: a click within NODE_SNAP_PX of an existing node reuses it instead
				// of creating a new, overlapping one -- see nearestNodeNearScreen()'s comment.
				var onNode = nearestNodeNearScreen(e.clientX, e.clientY, NODE_SNAP_PX);
				if (onNode) {
					// **A MISS THAT LANDS ON WHAT YOU JUST PLACED OPENS IT** (Tom, 2026-08-15: *"If
					// they click very near to the same location they just added something, it puts
					// them in Select/edit mode and opens that element. This will remove a major 'fat
					// finger' issue."*).
					//
					// THE OLD BEHAVIOUR WAS WORSE THAN HE KNEW: this branch already refused to place
					// a second node on top of an existing one, and then did NOTHING AT ALL. The user
					// taps, nothing appears, nothing opens, and there is no way to tell a
					// suppressed duplicate from a click the page missed. Silence is the one response
					// that teaches nothing.
					//
					// Guessing what they meant is safe here precisely because the alternative was
					// nothing: at worst they wanted a node 14 pixels away, and the popup they get
					// tells them exactly where the existing one is. Switching to Select is Tom's
					// call and the right one -- placing a node ON a node is not a thing anyone does
					// twice on purpose, so the tap is far likelier to be the end of the add spree
					// than the middle of it.
					setMode('select');
					openPopup(onNode.id, e.clientX, e.clientY);
				} else {
					saveUndoSnapshot();
					logLpnFirstAction('element');
					addNode(mode.slice('add-'.length), w.x, w.y);
				}
			}
			else if (mode === 'add-text') {
				// **THE OTHER HALF OF THE FAT-FINGER RULE, AND TOM NAMED IT FROM THE OUTSIDE**
				// (2026-08-15, on being told the node tools answered a near-miss with silence:
				// *"Well, that sheds some light. Actually I think it's schizophrenic. Maybe no-op
				// for the elements and double-insert for the text? That would explain my
				// experience."*). Exactly right: this branch had no such guard at all, so a tap on
				// the Text you had just placed made a SECOND one directly on top of it -- two labels
				// where one was wanted, the top one dragging away to reveal the other later.
				//
				// Two tools, two different wrong answers to the same gesture. Now both open what is
				// already there. The node branch above has the argument for switching to Select.
				var onLabel = nearestLabelNearScreen(e.clientX, e.clientY, NODE_SNAP_PX);
				if (onLabel) {
					setMode('select');
					openLabelPopup(onLabel.id, e.clientX, e.clientY);
					return;
				}
				saveUndoSnapshot();
				// Snap to a nearby node the same way add-pipe/add-pump do (Tom, 2026-07-30: "I
				// thought we programmed a leader for it if placed near a node... now it's gone" --
				// it turns out this creation-time snap was never actually wired up; the leader-
				// rendering machinery in buildLabelEls()/updateLabelGeometry() was already there and
				// ready, waiting on this). A tap within NODE_SNAP_PX anchors the new Text to that
				// node, so it drags with it and grows a leader; otherwise it's free-floating.
				var nearNode = nearestNodeNearScreen(e.clientX, e.clientY, NODE_SNAP_PX);
				logLpnFirstAction('element');
				addText(w.x, w.y, nearNode ? nearNode.id : null);
			}
			else if (mode === 'add-pipe' || mode === 'add-pump' || mode === 'add-valve') {
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
						logLpnFirstAction('element');
						addLink(mode.slice('add-'.length), pendingLinkFrom, hitId);
						setPendingLinkFrom(null);
					}
				} else { setPendingLinkFrom(null); }
			} else if (mode === 'delete') {
				// One-step undo (Tom: lost a pipe's data to an accidental delete) -- snapshot the
				// whole document just before any destructive action, not inside the delete
				// functions themselves, so a cascade (deleting a node also deletes its links)
				// captures one clean "before" state rather than a partial one.
				// deleteElement() owns the snapshot for the two real elements: inside a scenario the
				// gesture is not a deletion at all but an `active` override, and in Base it may have
				// to ask first -- neither of which a snapshot taken out here could know about.
				if (t.dataset.node) { deleteElement('node', t.dataset.node); }
				else if (t.classList.contains('lpn-vhandle')) { saveUndoSnapshot(); removeVertex(t.dataset.link, +t.dataset.vidx); }
				else if (t.dataset.link !== undefined) { deleteElement('link', t.dataset.link); }
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

	// ---- ROADMAP Task 277: a move is undoable ----
	//
	// Until this, NO drag handler snapshotted. The consequence was not "Undo skips the drag" -- it
	// was worse: Undo reverted the last DISCRETE act instead, leaving the drag in place and taking
	// back something the user did earlier. Tom, 2026-08-10: "277 is an ugly bug."
	//
	// LAZILY, on the first frame that actually moves something -- not on pointerdown. Every click in
	// select mode opens a drag record (that is how a click can become a drag), so snapshotting at
	// pointerdown would push a document copy for every tap that merely opened a popup: the stack
	// would fill with 20 identical states and Undo would appear to do nothing, which is the same
	// complaint from the other side. applyDrag() only runs once the pointer has actually moved, so
	// this fires exactly when there is a change to take back.
	//
	// ONCE PER GESTURE, via drag.snapped, so a 200-frame drag costs one snapshot and one Undo
	// returns the whole gesture rather than one frame of it. `drag` is replaced wholesale on each
	// pointerdown, so the flag resets itself and cannot leak into the next drag.
	//
	// Pan and pinch are deliberately absent: they move the CAMERA, not the document, and
	// saveUndoSnapshot() deep-clones `doc`. Undoing a pan is not a thing this stack is for.
	var LABEL_DRAG_TYPES = { label: true, nodelbl: true, linklbl: true }, LABEL_DRAG_SLOP_PX = 3;
	// The mark is DECORATION and lives entirely in CSS -- no timer, no cleanup, nothing to leak if
	// the tab is switched or the element is rebuilt mid-fade. Removing and re-adding the class in
	// two frames is the standard way to restart a CSS animation; without the reflow read between
	// them the browser coalesces the two changes and nothing happens.
	function markJustDragged(el2) {
		if (!el2 || !el2.classList) { return; }
		el2.classList.remove('lpn-just-dragged');
		if (el2.getBoundingClientRect) { el2.getBoundingClientRect(); }
		el2.classList.add('lpn-just-dragged');
	}
	function snapshotDragOnce() {
		if (drag.snapped) { return; }
		drag.snapped = true;
		saveUndoSnapshot();
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
		// **A LABEL DRAG NEEDS A REAL MOVEMENT BEFORE IT COMMITS** (Tom, 2026-08-15: *"I accidentally
		// dragged it? To there? OK. I reset it, and that fixed it. What a wild goose chase."*).
		//
		// The first pixel of movement used to make a label MANUAL for good, and the offset it stored
		// was `nodeLabelPos()` -- the base PLUS the collision pass's current nudge. So a stray jiggle
		// on a crowded label froze that label at wherever the automatic pass happened to have put it,
		// permanently, and the pass then had one more immovable weight-1000 obstacle to work around.
		// Tom's own statement of the rule: *"Store the user's leader endpoint and hold it constant.
		// If you extend it, don't overwrite it. Your extension is temporary."* A nudge is our
		// extension; it must not become his endpoint by accident.
		//
		// Three pointer-slop pixels. A deliberate drag clears it in the first frame and feels
		// identical; a click that wobbles does not. Applies to the three LABEL drags only -- a node
		// or vertex drag moves a thing that is already where the user put it, so there is nothing to
		// freeze and no threshold needed.
		if (LABEL_DRAG_TYPES[drag.type] && !drag.committed) {
			if (Math.hypot(p.x - drag.startX, p.y - drag.startY) < LABEL_DRAG_SLOP_PX) { return; }
			drag.committed = true;
			// **SAY SO, TEMPORARILY** (Tom, 2026-08-15, on his own accidental drag: *"It's all user
			// error, and I don't know how to avoid it unless we do something like put a timed box or
			// highlight on dragged labels for about a minute, maybe fading, maybe dashed, maybe
			// animated so it's obviously temporary."*). The class drives a dashed outline that fades
			// out on its own; re-adding it restarts the animation, so each drag re-announces.
			markJustDragged(drag.type === 'nodelbl' ? (nodeEls[drag.id] && nodeEls[drag.id].text)
				: drag.type === 'linklbl' ? (linkEls[drag.id] && linkEls[drag.id].text)
				: (labelEls[drag.id] && labelEls[drag.id].text));
		}
		if (drag.type === 'pan') {
			state.tx = drag.tx0 + (p.x - drag.startX); state.ty = drag.ty0 + (p.y - drag.startY);
			setTransform();
		} else if (drag.type === 'node') {
			snapshotDragOnce();
			var w = screenToWorld(p.x, p.y), n = nodeById(drag.id);
			n.x = w.x + drag.offX; n.y = w.y + drag.offY; updateNode(drag.id);
			relayoutLabels();
		} else if (drag.type === 'vertex') {
			snapshotDragOnce();
			var w2 = screenToWorld(p.x, p.y);
			linkById(drag.id).verts[drag.vidx] = { x: w2.x + drag.offX, y: w2.y + drag.offY };
			updateVertex(drag.id, drag.vidx);
			relayoutLabels();
		} else if (drag.type === 'label') {
			snapshotDragOnce();
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
			snapshotDragOnce();
			var w6 = screenToWorld(p.x, p.y), nn2 = nodeById(drag.id);
			nn2.lx = (w6.x + drag.offX) - nn2.x; nn2.ly = (w6.y + drag.offY) - nn2.y;
			layoutNodeLabel(drag.id);
			relayoutLabels();
			scheduleSolve();
		} else if (drag.type === 'linklbl') {
			snapshotDragOnce();
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
	// forever. Since Task 390 that is also what the <option>'s own value is, so this is no longer a
	// document-only convention -- the key is a unit's identity everywhere in the suite.
	//
	// ---- A UNIT THIS PAGE DOES NOT OFFER (ROADMAP Task 390 step 4) -------------------------------
	//
	// A unit is a LABEL and a MAGNITUDE, and they have different requirements. The label is a
	// string: always storable, always displayable, and always the user's. The magnitude is a factor,
	// and ONLY A SOLVE NEEDS ONE. So a name we have no factor for has one honest outcome and it is
	// neither of the two obvious ones: not "reject the document", and not "guess a factor".
	//
	//   open the file, draw it faithfully, keep the name verbatim -- and REFUSE TO SOLVE, saying
	//   which unit and why.
	//
	// The refusal is the work. EngCalcs.unitFactor() answers 1 for a name it has no factor for,
	// which is right for a page RENDERING (a label still draws) and silently catastrophic for a page
	// SOLVING (every length in the network would be off by whatever that unit really is), and
	// nothing about the number on screen would look wrong. Two different messages are owed, and
	// they are different facts: "we do not know this unit" and "so we cannot give you answers".
	//
	// {selectName: unitName}. Written ONLY by applyUnitSelections(), which is the one place a
	// document's units are installed, so this object always describes the open document and never a
	// leftover of the last one.
	var unresolvedUnits = {};
	function unresolvedUnitNames() {
		return LPN_UNIT_SELECTS.map(function (name) { return unresolvedUnits[name]; })
			.filter(function (u, i, all) { return u && all.indexOf(u) === i; });
	}
	function readUnitSelections() {
		var out = {};
		LPN_UNIT_SELECTS.forEach(function (name) {
			// THE CARRIED NAME WINS. A selector that could not be set is showing some other unit,
			// and writing that one back would rewrite the user's own declaration -- the exact
			// failure this task exists to end, one level up from the numbers. The name goes back
			// out as it came in, so a browser that later learns the unit reads a correct document.
			var k = unresolvedUnits[name] || unitKey(name);
			if (k) { out[name] = k; }
		});
		return out;
	}
	// Restores a project's own units WITHOUT going through EngCalcs.setUnits(): that helper calls
	// submitForm(), which re-enters pageCalculator, which is exactly the code path that is calling
	// this. The selects are set directly and the caller re-renders once, in its own order.
	//
	// A UNIT THIS BROWSER DOES NOT OFFER is not forced onto the select and not thrown away either:
	// it is recorded in unresolvedUnits above, kept verbatim by readUnitSelections(), shown by
	// unitLabel(), and it stops the solve. See the block on unresolvedUnits for why that trio and
	// not a rejection.
	function applyUnitSelections(units) {
		// Cleared unconditionally, INCLUDING on the early return: this function is the one place a
		// document's units are installed, so it owns the whole of that state. Clearing only in the
		// matched branch would leave one document's unknown unit refusing to solve the next one.
		unresolvedUnits = {};
		if (!units) { return false; }
		var changed = false;
		LPN_UNIT_SELECTS.forEach(function (name) {
			var want = units[name], sel = unitEl(name), i;
			if (!want || !sel || !sel.options) { return; }
			// Walked as `options` + `selectedIndex` rather than a querySelector on [value],
			// matching unitKey() two functions up. That is the idiom the rest of this file already
			// reads a select with, and it is the one a harness can stub -- an attribute selector on
			// a live <option> works only against a real DOM, so the check that this function does
			// its job at all could not have been written.
			for (i = 0; i < sel.options.length; i++) {
				if (sel.options[i].value === want) {
					if (sel.selectedIndex !== i) { sel.selectedIndex = i; changed = true; }
					return;
				}
			}
			unresolvedUnits[name] = want;
		});
		return changed;
	}
	// Task 390: the select's value IS the unit's key ('in'), and the factor is a lookup from it
	// through EngCalcs.unitFactors -- lib/Units.lib.php's own table, emitted by echoHTMLHead().
	function unitFactor(name) { return EngCalcs.unitFactor(unitEl(name)); }
	// THE LABEL IS THE ONE PART OF AN UNKNOWN UNIT WE CAN ALWAYS HONOUR, so a readout shows the
	// document's own name rather than the name of whatever unit the select fell back to. Every
	// readout on the page comes through here, so that is one place rather than a rule.
	function unitLabel(name) {
		if (unresolvedUnits[name]) { return unresolvedUnits[name]; }
		var s = unitEl(name); return s ? s.options[s.selectedIndex].textContent : '';
	}
	function unitKey(name) { var s = unitEl(name); return s ? s.options[s.selectedIndex].value : null; }
	// The map label's one unit token -- see numLine()'s `suffix` for why the gradient gets one and
	// nothing else does. Not translated: '%' is the same mark in all 27 languages, including RTL.
	function gradientSuffix() { return unitKey('lpn_u_gradient') === 'gradePercent' ? '%' : ''; }
	// The friction method. HARDCODED to Hazen-Williams today -- this page has no control for it,
	// unlike bpn_ -- but read through a function rather than written as a literal in two places,
	// because js/lpn-solver.js already implements all three (hw, dw, manning) and the control is
	// ROADMAP Task 271. When it lands, assembleModel() and this readout both already ask the right
	// question.
	function frictionMethod() { return settings.method || 'hw'; }
	function frictionMethodLabel() {
		var pc = EngCalcs.pageConfig || {};
		var m = frictionMethod();
		if (m === 'dw') { return pc.bpn_method_dw || 'Darcy-Weisbach'; }
		if (m === 'manning') { return pc.bpn_method_manning || 'Manning'; }
		return pc.bpn_method_hw || 'Hazen-Williams';
	}
	// ---- ROUGHNESS IS THREE DIFFERENT QUANTITIES WEARING ONE FIELD (ROADMAP Task 271) ----
	//
	// Manning n and Hazen-Williams C are dimensionless; Darcy-Weisbach roughness height e is a
	// LENGTH. bpn_ solved this years ago with one column whose symbol and units follow the method
	// (bpnUpdateMethodUI()), and this is deliberately the same design rather than a second one:
	// three separate fields would mean three stored properties, three defaults, and a document that
	// remembers two numbers nobody can see.
	//
	// The symbols n / C / e are NOT translated and match bpn_'s exactly. CLAUDE.md's `symbol` rule:
	// a variable letter keeps its letters in every language. Using "e" rather than the prettier
	// Greek epsilon is a consistency call -- the same quantity must not be called two things in two
	// calculators of the same suite.
	function roughnessSymbol() {
		var m = frictionMethod();
		return m === 'manning' ? 'n' : m === 'dw' ? 'e' : 'C';
	}
	// "Roughness, C" -- the same shape as lpn_field_km's "Minor (local) loss coefficient, k", so the
	// translated word carries the meaning and the untranslated letter carries the identity.
	function roughnessLabel() {
		var pc = EngCalcs.pageConfig || {};
		return (pc.lpn_field_roughness || 'Roughness') + ', ' + roughnessSymbol();
	}
	// Under Hazen-Williams the page keeps its own HW-specific tip, which is more useful than a
	// generic one ("about 150 for new plastic, 130 for new steel"). Under the other two it borrows
	// bpn_roughness_tip, which names all three methods' roughness in one already-translated string.
	// Both keys stay live and no new key is created.
	function roughnessTip() {
		var pc = EngCalcs.pageConfig || {};
		return frictionMethod() === 'hw'
			? pc.lpn_field_roughness_tip
			: (pc.bpn_roughness_tip || pc.lpn_field_roughness_tip);
	}
	// The declared roughness as the SOLVER wants it. Dimensionless for Manning/HW, so the number
	// passes through untouched; a length for Darcy-Weisbach, so it crosses the same unit boundary
	// every other quantity does (Task 263: the document stores what was typed, the handoff
	// converts). js/lpn-solver.js hands this straight to lpnDwFriction(q, d, roughness, visc),
	// where d is already SI metres -- so e MUST be metres too or the relative roughness e/d is
	// wrong by the unit factor, silently and in a direction nothing else would reveal.
	function roughnessSI(l) {
		var r = effective(l, 'roughness');
		return frictionMethod() === 'dw' ? toSI(r, 'lpn_u_roughness') : r;
	}
	// Typical roughness for a method, in the unit the roughness field is currently showing. Used
	// only for settings.defaults.roughness when the method changes -- never to rewrite an existing
	// pipe, per the Default inputs section's own "future, not retroactive" rule.
	// C = 130 and n = 0.013 are dimensionless. e = 0.0015 m (0.15 mm, commercial steel) is a
	// length, so it is scaled into the displayed unit exactly as niceDefault() does.
	function defaultRoughnessFor(method) {
		if (method === 'manning') { return 0.013; }
		if (method === 'dw') { return +(0.0015 * unitFactor('lpn_u_roughness')).toPrecision(3); }
		return 130;
	}
	// The roughness unit selector is the one unit control on this page that is conditional: it is
	// meaningless under Manning and Hazen-Williams, where the number has no units at all. Hidden
	// rather than removed, so the select keeps its unit family and stays visible to the us/si
	// preset buttons (CLAUDE.md: a select with no family is invisible to the presets).
	function applyMethodUI() {
		var row = document.getElementById('lpn_u_roughness_row');
		if (row) { row.style.display = frictionMethod() === 'dw' ? '' : 'none'; }
	}
	// The bottom-right map overlay: the few facts you need in order to read the numbers on the map at
	// all. Map labels are bare numbers by design (Tom, 2026-07-30 -- "no units and no prefix"), which
	// is right for the drawing and left a first-time visitor no way to tell gpm from l/s. They get US
	// on an English page and SI on every other (EC_DEFAULT_UNIT_SET, from the language), and until
	// now nothing on screen said which. Tom, 2026-08-10: "what units do they get, and is there a way
	// they should know?"
	//
	// EVERY LABEL HERE IS BORROWED, no new keys: lpn_units_flow, lpn_units_pressure, bpn_method and
	// bpn_method_hw/dw/manning all exist and are already translated in every language this page is.
	// That is CLAUDE.md's concept-level reuse rule paying for itself -- this shipped at zero
	// translation cost.
	function refreshMapStatus() {
		var el = document.getElementById('lpn_map_status'), pc = EngCalcs.pageConfig || {};
		if (!el) { return; }
		// A PIPE, not spaces (Tom, 2026-08-10). Three "Label: value" pairs run together are one
		// undifferentiated string at 11px, and whitespace is the weakest divider there is.
		//
		// This corrects the previous comment here, which refused a glyph on the grounds that "a
		// bullet or pipe would need its own RTL thinking". That was overcautious and wrong about
		// this glyph specifically: U+007C is BiDi class ON (Other Neutral) and is VERTICALLY
		// SYMMETRIC, so it needs no mirrored counterpart and renders identically whichever direction
		// the run around it takes -- the three pairs reorder in Arabic or Hebrew, as they should, and
		// the dividers simply stay between them. The caution was right for a DIRECTIONAL glyph
		// (an arrow, a guillemet, the fly-out's own U+25B8); it was never right for a pipe. And a
		// pipe carries no language at all, which is Tom's reason for preferring it.
		el.textContent = [
			(pc.lpn_units_flow || 'Flow') + ': ' + unitLabel('lpn_u_flow'),
			(pc.lpn_units_pressure || 'Pressure') + ': ' + unitLabel('lpn_u_pressure'),
			(pc.bpn_method || 'Friction method') + ': ' + frictionMethodLabel()
		].join(' | ');
	}
	// "US Units" / "SI Units", for the example network's title block. `system` is the preset the
	// caller just committed the project to, never a reading of the live strip: an example FORCES the
	// units it wants and then says which it forced (Tom, 2026-08-10, cutting the derived version --
	// *"We never create an example based on the current units, or we shouldn't. We should force the
	// units we want and label thusly."* The derivation was answering a question nobody asks).
	//
	// Not on the browser tab: Task 265 put it there and Tom reversed it the same day -- the map's
	// status strip already answers "what units am I in" continuously, where you are already looking.
	// The title block is different because a screenshot of the example travels without that strip.
	function unitSetLabel(system) {
		var pc = EngCalcs.pageConfig || {};
		return (pc.lpn_title_units || '{units} Units')
			.replace('{units}', system === 'us' ? (pc.calc_units_us || 'US') : (pc.calc_units_si || 'SI'));
	}
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
	//   1. HERE, at the solver handoff (assembleModel, pumpFit) -- declared value to SI.
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
	// (page-wide preferences). `affix` (Task 333) is the same bargain for the prefix/suffix boxes.
	// The row is a flex line so those three controls form COLUMNS down the panel: the field names
	// are of wildly different lengths, and boxes that stagger with them are unreadable as a set.
	function labelCheckbox(container, labelText, checked, onChange, decimals, affixOpt) {
		var row = document.createElement('div'), label = document.createElement('label'),
			input = document.createElement('input'), span = document.createElement('span');
		row.style.display = 'flex'; row.style.alignItems = 'center'; row.style.gap = '6px';
		input.type = 'checkbox'; input.checked = checked;
		input.addEventListener('change', function () { onChange(input.checked); saveToStorage(); refreshLabelText(); });
		span.textContent = labelText;
		label.appendChild(input);
		label.appendChild(document.createTextNode(' '));
		label.appendChild(span);
		label.style.flex = '1 1 auto';
		row.appendChild(label);
		if (affixOpt) { row.appendChild(affixBox(affixOpt.prefix)); row.appendChild(affixBox(affixOpt.suffix)); }
		// A ROW WITH NO DECIMALS STILL RESERVES THE COLUMN (Tom, 2026-08-15: "Can you make their
		// inputs align with the others?"). ID is the only such row, and without this its two boxes
		// slide right by the width of the spinner every other row has, which reads as a different
		// kind of row rather than as the same row missing one control.
		if (affixOpt && !decimals) {
			var spacer = document.createElement('span');
			spacer.style.width = '4.5em'; spacer.style.flex = '0 0 auto';
			row.appendChild(spacer);
		}
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
			row.appendChild(dec);
		}
		container.appendChild(row);
	}
	// One prefix or suffix box. `spec` is {value, placeholder, title, onChange}. The VALUE shown is
	// always the EFFECTIVE one (labelPrefixFor() resolves an unset field to its default), so the box
	// reads as what the map is actually printing rather than as an empty box beside a label that
	// visibly carries a letter. Typing into it stores whatever is there, empty string included --
	// that is the user saying "none", and it is honoured (see defaultLabelSettings()).
	// `input`, not `change`: a prefix is one or two characters and the map should follow the
	// keystroke, the way the rest of this panel follows a click.
	function affixBox(spec) {
		var box = document.createElement('input');
		box.type = 'text';
		box.value = spec.value;
		box.title = spec.title;
		box.setAttribute('aria-label', spec.title);
		box.style.width = '3.5em'; box.style.flex = '0 0 auto';
		box.addEventListener('input', function () { spec.onChange(box.value); saveToStorage(); refreshLabelText(); });
		return box;
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
			// Carries the method's symbol like every other roughness label (Task 271) -- the Labels
			// popover is the map's only legend, so "Roughness" alone would leave the map's numbers
			// unattributed to a method.
			['roughness', roughnessLabel()], ['km', pc.lpn_field_km_short || 'Minor loss, k'],
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
		// The prefix/suffix pair for one row. Both boxes show the EFFECTIVE text (so an untouched
		// row still displays the default the map is printing) and write into labelSettings, which
		// is what makes them per-project and what carries them into a saved file.
		// TWO ROWS GET THEIR OWN TIP, and both answer a question the user is going to ask AT THAT BOX:
		//   * ID ships blank while every other row shows a letter, which looks like an omission until
		//     you know an ID already begins with its own automatic prefix (J1, L1).
		//   * The gradient prints a '%' nobody typed (Tom: "This may need a tip or something. 'No %
		//     here. It is automatic.'").
		// A tip and not a parenthetical in the row's LABEL, which was the other option Tom offered:
		// those label strings are shared with renderLabelsLegend(), so a parenthetical would print
		// on the map legend too, where it is noise on a printed sheet.
		function affixFor(group, key) {
			return {
				prefix: {
					value: labelPrefixFor(group, key),
					title: (key === 'id' ? pc.lpn_labels_prefix_id_tip : pc.lpn_labels_prefix_tip) ||
						'Text printed before this value on the map',
					onChange: function (v) { labelSettings.prefix[group][key] = v; }
				},
				suffix: {
					value: labelSuffixFor(group, key),
					title: (key === 'gradient' ? pc.lpn_labels_suffix_gradient_tip : pc.lpn_labels_suffix_tip) ||
						'Text printed after this value on the map',
					onChange: function (v) { labelSettings.suffix[group][key] = v; }
				}
			};
		}
		nodeFieldDefs(pc).forEach(function (f) {
			labelCheckbox(nodeBox, f[1], labelSettings.node[f[0]],
				function (v) { labelSettings.node[f[0]] = v; }, decimalsFor('node', f[0]), affixFor('node', f[0]));
		});
		linkFieldDefs(pc).forEach(function (f) {
			labelCheckbox(linkBox, f[1], labelSettings.link[f[0]],
				function (v) { labelSettings.link[f[0]] = v; }, decimalsFor('link', f[0]), affixFor('link', f[0]));
		});
		// Options applying to every field at once, below both field lists rather than on any one row:
		// Task 190's high/low mark, and Task 333's one blanket separator (Tom, 2026-08-15: "One
		// blanket separator and individual prefixes and postfixes, of course").
		if (optBox) {
			optBox.innerHTML = '';
			labelCheckbox(optBox, pc.lpn_labels_mark_extrema || 'Mark highest and lowest values',
				labelSettings.markExtrema, function (v) { labelSettings.markExtrema = v; });
			var sepRow = document.createElement('div'), sepLabel = document.createElement('span');
			sepRow.style.display = 'flex'; sepRow.style.alignItems = 'center'; sepRow.style.gap = '6px';
			sepLabel.textContent = pc.lpn_labels_separator || 'Separator';
			sepLabel.style.flex = '1 1 auto';
			sepRow.appendChild(sepLabel);
			sepRow.appendChild(affixBox({
				value: labelSeparator(),
				title: pc.lpn_labels_separator_tip || 'Text between one value and the next on a label. A space by default.',
				// Stored EXACTLY as typed, spaces included -- a space is the default value of this
				// very box, and ", " and " | " carry their own, so trimming would rewrite two of the
				// three forms Tom named.
				onChange: function (v) { labelSettings.separator = v; }
			}));
			optBox.appendChild(sepRow);
		}
	}
	function wireLabelsPopup() {
		// No close button to wire: this is a pull-down (see Looped-Network.php). It is dismissed by
		// clicking away, by Escape, by its own toolbar button, or by opening another menu/panel.
		rebuildLabelsFields();
	}
	// The key that survives printing (Tom, 2026-07-30): the Labels popover itself is toolbar
	// chrome (d-print-none), so a legend that only lived there would vanish on a printed page --
	// this renders into #lpn_labels_legend, which is NOT d-print-none, and is kept live by being
	// called from refreshLabelText() (every toggle change, solve, and unit switch already calls
	// that). Hidden entirely when no field is toggled on, so it costs nothing by default.
	// Since Task 333 it keys on the PREFIX/SUFFIX rather than on a colour swatch, so a set the user
	// has changed is still readable by someone else looking at the sheet -- and it now works in
	// greyscale, which the colour key never did. A field with neither affix (diameter, length, ID)
	// is listed with a blank key: it is identified on the map by its unit and by its position in
	// the stack, which is the same order this list is in.
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
				var group = fieldSettings === labelSettings.node ? 'node' : 'link',
					div = document.createElement('div'), key = document.createElement('span'),
					p = labelPrefixFor(group, f[0]), suf = labelSuffixFor(group, f[0]);
				div.style.display = 'flex'; div.style.gap = '0.5em';
				// The key column is fixed-width so the field names line up under each other whether
				// or not a given row has a prefix -- a ragged left edge is what made the original
				// horizontal legend unreadable.
				key.style.minWidth = '2.5em'; key.style.fontWeight = 'bold';
				key.textContent = p + (p && suf ? '\u2026' : '') + suf;
				div.appendChild(key);
				div.appendChild(document.createTextNode(f[1]));
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
		if (popup.style.display === 'block') { popup.style.display = 'none'; viewPopoverAnchor = null; return; }
		// ONE PULL-DOWN AT A TIME. Tom, 2026-08-13: "When I click Settings then Labels, Labels opens
		// beneath Settings. I expect Settings to close." openMenu() has always closed these; they
		// never closed each other, because the document-level dismissal cannot tell the click that
		// opened this one from a click away from that one -- so the opener is the only place that
		// can do it. (Since Task 372 the dismissal knows the OPENER by name rather than exempting
		// the whole toolbar, but this is still the only code that runs on the way in.)
		closeMenu();
		closeViewPopovers('lpn_labels_popup');
		viewPopoverAnchor = evt.currentTarget;
		openPanelAtAnchor(popup, evt.currentTarget.getBoundingClientRect());
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
	// THE RULE IS "THE PAGE MUST NOT NEED SCROLLING". The canvas height is MEASURED: fill the
	// window exactly, minus whatever is genuinely above and below the canvas in normal flow.
	//
	// The trap it exists to avoid: #lpn_canvas carries `touch-action: none` so the app can own
	// pan/zoom, so every touch landing on the canvas is swallowed and CANNOT scroll the page. A
	// canvas taller than the viewport with content below it leaves no reachable page to touch.
	// The rejected alternative is a flat fraction of innerHeight (it was 0.72): that reserves a
	// strip of viewport in case something is out of reach, where measuring leaves nothing out of
	// reach, and it self-corrects if a future change puts something tall back under the map.
	//
	// THERE IS NO "MAP HEIGHT" SETTING -- this function does on every screen what the control was
	// for. Its two lang keys are PARKED, not deleted (see lib/lang.ec.en.php); the tip is wrong
	// and must be rewritten before the row is ever restored. A document carrying the stale
	// `settings.mapHeight` needs no migration: applySaved() merges saved settings onto the
	// defaults, so it rides along unread.
	// A FLOOR, not just a cap: something stays on screen when the window is too short for a real
	// canvas. The floor does not decide whether the map is usable -- the WINDOW does. All it
	// decides is whether such a window gets a small map that fits the page or a bigger one that
	// pushes the status strip off the bottom. Not zero, which would leave nothing to aim at.
	var LPN_MAP_MIN = 80;
	// How much ordinary page sits BELOW the canvas, in document flow. The popovers do not count:
	// every one of them is position:fixed and display:none, so they occupy no flow at all -- which
	// is why this measures the document rather than listing elements by id, a list that would go
	// stale the first time somebody added one.
	function flowBelowMap() {
		if (!svg || !document.body) { return 0; }
		// **MEASURED FROM THE BODY'S OWN BOX, NOT FROM scrollHeight** -- and the difference is the
		// whole bug Tom photographed on 2026-08-14 ("The bottom still isn't at the bottom").
		//
		// documentElement.scrollHeight NEVER REPORTS LESS THAN THE VIEWPORT. So the moment the page
		// became shorter than the window -- which is precisely what this whole feature is trying to
		// achieve -- `scrollHeight - canvasBottom` stopped measuring content below the canvas and
		// started measuring the EMPTY SPACE below it. Subtracting that is circular: with
		// below = vh - above - H, the formula collapses to room = H - 8, so every recompute simply
		// shrank the map by the slack and re-created the gap it was trying to close. It could never
		// converge, because the gap was its own input.
		//
		// body's rect is the CONTENT box: it is not clamped to the viewport, and position:fixed
		// popovers are out of flow so they never inflate it. That is what makes it the honest
		// measure of "what is actually under the map".
		var b = document.body.getBoundingClientRect(), s = svg.getBoundingClientRect();
		var below = b.bottom - s.bottom;
		return below > 0 ? below : 0;
	}
	function effectiveMapHeight() {
		var vh = window.innerHeight || 800;
		if (!svg) { return vh; }
		var docEl = document.documentElement;
		var rect = svg.getBoundingClientRect();
		var above = rect.top + (window.pageYOffset || docEl.scrollTop || 0);
		// **NO SLACK CONSTANT. FLOOR INSTEAD** (Tom, 2026-08-15: *"Slack: I don't really like it. But
		// I can live with it only if you insist."* — I do not insist, because it was never the right
		// tool). The slack existed so a sub-pixel layout rounding could not leave the page one
		// stubborn pixel scrollable, and it was 8px, then 2. But the only way rounding can leave the
		// page scrollable is by rounding UP, and the fix for that is to round DOWN: `floor` can never
		// return more room than there is. A guard that cannot overshoot needs no margin for
		// overshooting, so the wasted strip below the map is gone rather than merely smaller.
		var room = Math.floor(vh - above - flowBelowMap());
		// **A MAP TALLER THAN THE WINDOW IS NEVER THE RIGHT ANSWER, AND THE OLD FORMULA COULD
		// PRODUCE ONE** (guard added 2026-08-15 after Tom hit an unrecoverable state: *"The bottom
		// of the map overflowed the bottom of the screen. And status line is gone. Reload doesn't
		// fix."*). Every term above is a measurement, and `above` in particular goes NEGATIVE if the
		// rect and the scroll offset ever disagree -- at which point room exceeds the viewport, the
		// map runs off the bottom, and #lpn_map_footer goes with it because it is pinned to the
		// map's own bottom edge. Worse, that state feeds itself: an overflowing map makes the page
		// scrollable, and the next resize measures a scrolled page.
		//
		// The clamp costs nothing in the healthy case -- with above and below both >= 0 the formula
		// already yields at most vh - 8 -- so it bites only when an input was wrong, which is
		// exactly when a floor and a ceiling earn their keep.
		room = Math.min(room, Math.floor(vh));
		return Math.max(LPN_MAP_MIN, room);
	}
	// A canvas resize must not slide the drawing, and until 2026-08-15 it did. The world transform
	// anchors content at the TOP-LEFT, so growing the canvas by 12px revealed 12px more at the
	// bottom and moved everything relative to the frame -- which is what Tom saw as *"zoom changes
	// for Net3 when I go to another tab and then return"*, and what a window resize has always done.
	// Half the delta on each axis keeps the view CENTRE where it was, which is what every map
	// application does and what makes a resize feel like a window changing rather than a pan.
	var LPN_MAP_HEIGHT_DEADBAND = 1;
	// **A HEIGHT IS NOT APPLIED UNTIL ONE CAN BE CALCULATED** (Tom, 2026-08-15). Everything this
	// measures -- the site navbar above the canvas, the footer below it -- is still moving while the
	// page loads: stylesheets are applying, webfonts are swapping, Bootstrap has not collapsed the
	// nav. A number derived then is not a measurement, it is a guess with arithmetic in front of it,
	// and applying it makes the user watch the map jump when the truth arrives.
	//
	// `readyState === 'complete'` is the browser's own answer to "has everything finished", so it is
	// the gate. Before it, the canvas keeps the height="0" it is authored with and the space is
	// simply blank. The failsafe below covers the one way this could strand the page: a subresource
	// that never finishes, which would otherwise mean a map that never appears.
	var mapSizingArmed = false;
	// **THE CANVAS IS 10000px TALL UNTIL IT IS SIZED, AND A FIT AGAINST THAT IS NONSENSE** (Tom,
	// 2026-08-15: *"Reload still zooms the current tab in drastically. Did you use a markup map
	// height of..."* — yes, 10000, and this is the price of it). zoomExtent() divides the available
	// HEIGHT by the drawing's height and takes the smaller of that and the width ratio. With 10000
	// of height available the height term never wins, so the drawing is fitted to WIDTH ALONE, which
	// on anything taller than it is wide is a drastic zoom-in.
	//
	// The curtain is still right — see the markup comment for why 0 was worse — so the answer is
	// that a fit asked for before the canvas has a real height is DEFERRED rather than answered
	// wrongly. Remember that one was wanted, and do it when the
	// missing fact arrives.
	var mapSized = false, fitWhenSized = false, autoFitWhenSized = false, pendingRestore = null;
	// **AN AUTOMATIC FIT MOVES THE BASELINE, IT DOES NOT DIRTY THE PROJECT.** Only when the project
	// is already clean: if there are real unsaved edits, the asterisk stays, because the fit is not
	// what put it there and clearing it would lose them silently.
	//
	// For a FILE project this claims the file contains a view it does not. That is deliberate and
	// cheap: the view in question is one the app chose, not one the user did, so losing it on close
	// costs nothing and prompting for it would be asking about a decision they never made.
	function rebaseSignatureIfClean() {
		var e = indexEntry(library.openId);
		if (e && !e.dirty) { e.savedSig = docSignature(); saveIndex(); }
	}
	// The canvas box as it was when applyMapHeight() last finished. A resize is only observable by
	// comparing against it: the WIDTH is CSS and changes before any handler of ours runs.
	var lastMapBox = null;
	function armMapSizing() {
		if (mapSizingArmed) { return; }
		mapSizingArmed = true;
		applyMapHeight();
	}
	function pageSettled() { return mapSizingArmed || document.readyState === 'complete'; }
	function noteMapSized() {
		if (mapSized) { return; }
		mapSized = true;
		if (!fitWhenSized) { return; }
		fitWhenSized = false;
		var wasAuto = autoFitWhenSized;
		autoFitWhenSized = false;
		var v = pendingRestore;
		pendingRestore = null;
		if (validView(v) && applyView(v)) { return; }
		zoomExtent(wasAuto);
	}
	function applyMapHeight(secondPass) {
		if (!svg) { return; }
		if (!pageSettled()) { return; }
		// NOT LAID OUT YET, so every measurement below is a fiction -- a hidden tab, a display:none
		// ancestor, or a call before first layout. Doing nothing leaves the last good height in
		// place, which is strictly better than replacing it with an answer derived from zeros.
		var before = svg.getBoundingClientRect();
		if (!before.width && !before.height) { return; }
		// Measure with the CURRENT height already applied, then apply the answer. flowBelowMap()
		// reads scrollHeight, which includes the canvas itself, so the two cancel -- but only if
		// nothing else moved in between, which is why this is one statement and not a loop.
		var h = effectiveMapHeight();
		// A DEAD BAND, because sub-pixel churn is not a change worth making. Layout settles slightly
		// differently after fonts load, after a tab comes back, after a scrollbar appears -- and
		// re-applying a height that differs by half a pixel would move the drawing for no reason a
		// reader could name.
		if (Math.abs(h - before.height) >= LPN_MAP_HEIGHT_DEADBAND) { svg.setAttribute('height', h); }
		// **RE-CENTRED FROM AN ANCHOR, NOT BY ACCUMULATING DELTAS**, and against the size at the END
		// of the LAST call rather than the start of this one. Three of Tom's observations on
		// 2026-08-15 were one design fault between them:
		//
		//   (1) *"left offset/margin is fixed when changing window width; arguably staying centered
		//       would be better."* The width is CSS (`width="100%"`), so by the time a resize handler
		//       runs the browser has already applied it and there is no delta left to observe --
		//       and the old code only looked at all when the HEIGHT changed. Hence: remember the box
		//       from last time.
		//   (2) *"very active resizing gradually pans the map until it disappears left."* Same cause:
		//       a resize that was not OBSERVED was not corrected for, and the shortfall accumulated
		//       across a drag that fires dozens of events. **The anchor form is not what fixes this
		//       -- a mutation test proved that, and the note is worth keeping.** `tx = W/2 - s*cx`
		//       with `cx` from the old box is algebraically identical to `tx += (W - Wold)/2`; what
		//       fixes the drift is that the baseline is now the box as of the LAST CALL, so every
		//       change is seen exactly once. The absolute form is kept because it says what it means
		//       and cannot be half-applied, not because it computes anything different.
		//   (3) *"same view stays centered when changing height UNLESS height is less than ~100px,
		//       at which point the map stops centering and starts cropping from the bottom."* That
		//       one is LPN_MAP_MIN doing its job: past the floor the canvas stops shrinking, so
		//       there is no size change to re-centre against and the page scrolls instead. Left
		//       alone deliberately -- see the floor's own comment.
		var now = svg.getBoundingClientRect(), sc = state.s || 1, cx, cy;
		if (lastMapBox && (Math.abs(now.width - lastMapBox.w) > 0.5 ||
				Math.abs(now.height - lastMapBox.h) > 0.5)) {
			// The world point that was under the middle of the canvas BEFORE the resize.
			cx = (lastMapBox.w / 2 - state.tx) / sc;
			cy = (lastMapBox.h / 2 - state.ty) / sc;
			state.tx = now.width / 2 - sc * cx;
			state.ty = now.height / 2 - sc * cy;
			setTransform();
		}
		lastMapBox = { w: now.width, h: now.height };
		before = now;
		// **IF IT STILL RUNS OFF THE BOTTOM, MEASURE ONCE MORE AND BELIEVE THE SECOND ANSWER.**
		//
		// Tom's staged report, 2026-08-15, is what this is for: *"(1) map bottom is about half-way
		// up from screen bottom and page is partway loaded. (2) map bottom is below screen bottom
		// and page is finished loading."* Every term in the formula is a measurement of a page that
		// is still assembling itself -- the site's own navbar above the canvas, and the footer below
		// it, both change height as Bootstrap's CSS and the webfonts land. A height computed at
		// stage 1 is simply the wrong answer by stage 2, and the clamp cannot save it: the clamp
		// bounds the HEIGHT to the window, while what went wrong is WHERE THE MAP STARTS.
		//
		// So: one bounded re-measure, never a loop (see the note on applyMapHeight above). By the
		// time this runs the new height has been applied and the page has re-laid out around it, so
		// `above` and `below` are finally being read from the arrangement the user is looking at.
		// The floor is exempt because a canvas at LPN_MAP_MIN is allowed to overflow -- that
		// overflow is a decision, and re-measuring would only re-derive the same number.
		var vh = window.innerHeight || 800;
		if (!secondPass && before.bottom > vh + 1 && before.height > LPN_MAP_MIN) {
			applyMapHeight(true);
		}
		// The canvas now has a height derived from the window rather than from the markup, so any
		// fit that was waiting for one can have its answer.
		noteMapSized();
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
	// needed both when the user edits Text size directly and whenever state.s changes
	// (zoomAbout()/zoomExtent() call onZoomChanged() below), since a pixel size is by definition
	// state.s-dependent while every other geometry in this file is left to the SVG's own transform.
	// The user's own Text labels only: re-apply the font size AND re-measure. Called where a Text
	// label's content or size really changed. The zoom path does not use it -- it sets font sizes
	// without measuring, because a measured width is banked in pixels and rescaled on read.
	function refreshTextLabelSizes() {
		Object.keys(labelEls).forEach(function (id) {
			var le = labelEls[id], lb = labelById(id);
			le.text.style.fontSize = effectiveFontSize(lb && lb.sizeMult) + 'px';
			try { noteTextWidth(le, le.text.getBBox().width); } catch (err) { /* pre-layout measurement can throw; stale width stands */ }
			updateLabelGeometry(id);
		});
	}
	// **A ZOOM CHANGES SIZES, NOT CONTENT** (2026-08-15). This used to end in refreshLabelText(),
	// which recomposes every node's and every link's text, rebuilds its tspans and re-measures each
	// one with getBBox() -- ~220 forced synchronous layouts on Net3, per wheel notch, to redraw
	// glyphs that had not changed. Tom measured the result: a quarter of a second per scroll zoom.
	//
	// Nothing about the CONTENT depends on the scale. Two things did, and both are now gone:
	//   * the tspan `dy` spacing, which is expressed in `em` and follows the font-size by itself;
	//   * each label's measured width, which is banked in PIXELS and divided by the scale on read
	//     (labelBoxWidth / textLabelWidth).
	// So a zoom sets font sizes, republishes the symbol custom properties, and re-lays-out. The
	// content path is left for the things that actually change content: a solve, a toggle, an edit.
	function refreshFontSizes() {
		var fs = effectiveFontSize() + 'px';
		Object.keys(nodeEls).forEach(function (id) { nodeEls[id].text.style.fontSize = fs; });
		Object.keys(linkEls).forEach(function (id) {
			linkEls[id].text.style.fontSize = fs;
			(linkEls[id].repeats || []).forEach(function (r) { r.text.style.fontSize = fs; });
		});
		Object.keys(labelEls).forEach(function (id) {
			var le = labelEls[id], lb = labelById(id);
			le.text.style.fontSize = effectiveFontSize(lb && lb.sizeMult) + 'px';
		});
		refreshSymbolSizes(); // publishes --lpn-sym / --lpn-lw, both of which are state.s-dependent too
		relayoutLabels();     // positions only: no recompose, no re-measure
	}
	// Called from zoomAbout()/zoomExtent(). NO LONGER CONDITIONAL (Task 331): with text, symbols and
	// pipe width all specified in screen pixels, every one of them is state.s-dependent, so a zoom
	// always invalidates all three. The old 'map' fast path -- where text scaled for free via the
	// SVG's own transform and this was a no-op -- went away with map-unit sizing itself.
	// refreshFontSizes() calls refreshSymbolSizes(), which publishes --lpn-sym and --lpn-lw, so one
	// call still covers the lot.
	// Visible width of the map in MODEL LENGTH UNITS -- the quantity Tom named as the control:
	// *"you specify zoom threshold in terms of how many units wide the map is"* (2026-08-14). It is
	// the honest way to say "when should this be readable", because it is a statement about the
	// DRAWING rather than about the viewport: 400 ft across means the same thing on a phone and on a
	// 32-inch monitor, whereas a zoom factor or a pixels-per-foot ratio does not.
	function visibleMapWidth() {
		var w = svg && svg.clientWidth ? svg.clientWidth : 0;
		return w / (state.s || 1);
	}
	// GENERATED ANNOTATION only -- the right line is annotation, not "labels", and the flow arrow is
	// what shows it. An arrow is a symbol by construction and an annotation by purpose: nobody drew
	// it, it exists to be read, and zoomed out it is noise over the network whose shape you are
	// trying to see. A node/link data label is the same kind of thing, so suppressing either costs
	// the user nothing they authored. Each label's leader is built through
	// annotationEl() beside it, so both pieces of one assembly hide together, the arrow hides
	// with them, and the network itself never does. Full rule in css/engcalcs.css by the selector.
	//
	// visibility rather than display, so this composes with the leader's own show/hide logic instead
	// of fighting it -- a leader that is display:none for its own reasons stays gone, and one that is
	// visible is merely made invisible. One class on the <svg>, so a zoom step costs nothing per
	// element however large the network is.
	//
	// A TEXT LABEL GETS ITS OWN THRESHOLD, SCALED BY ITS OWN SIZE. A user typed those words and
	// chose that spot, so it must not vanish under a threshold that never mentions Text labels --
	// but exempting Text labels entirely is too blunt: a title block and a small note are both
	// authored and do not deserve the same survival, exactly as sheet lettering works (the drawing
	// title is legible from across the room, the callouts are not). So the threshold is
	// `labelMaxWidth x lb.sizeMult`: a label at 3x survives to 3x the map width, one at 1x has
	// exactly the data labels' threshold. It falls out of a property already in the document, so
	// there is no new per-label setting.
	//
	// Per label, so it cannot ride the one class on the <svg>: doc.labels is the user's own Text
	// labels only (typically a handful), never the per-element data labels, so the loop is cheap.
	function applyLabelVisibility() {
		var lim = settings.labelMaxWidth,
			on = typeof lim === 'number' && lim > 0,
			// MIN: "how much can I see" is answered by the dimension that runs out first, and the
			// control says "smaller than" to match. See mapSpan().
			vw = mapSpan('min');
		// Recorded, not just applied. Two things need to KNOW whether generated annotation is on
		// screen rather than merely being styled by it: the zoom path, which can skip the whole
		// label pipeline when nothing readable is drawn, and bbox(), which must not reserve space
		// for labels nobody can see. Both used to re-derive it and one of them got it wrong.
		dataLabelsHidden = !!(on && vw > lim);
		if (svg) { svg.classList.toggle('lpn-labels-hidden', dataLabelsHidden); }
		doc.labels.forEach(function (lb) {
			var le = labelEls[lb.id];
			if (!le) { return; }
			// AND ONE LABEL MAY OPT OUT ENTIRELY (Tom, 2026-08-15: *"Is it possible to have a 'Show
			// always' checkbox in the text properties box? The non-customizable way to do this would
			// be to show always the largest text, but we don't want to do that."*). He is right that
			// the automatic version is the wrong shape: "the biggest one survives" makes a legend or
			// a north arrow compete on font size for a property it should just declare, and it
			// silently changes which label is permanent whenever somebody resizes another one.
			var mult = +lb.sizeMult > 0 ? +lb.sizeMult : 1,
				gone = on && !lb.alwaysShow && vw > lim * mult;
			[le.text, le.leader].forEach(function (e) {
				if (e && e.classList) { e.classList.toggle('lpn-lbl-hidden', gone); }
			});
		});
	}
	// Task 330. A saved setting that is merely absent (any project written before this) reads as
	// undefined and must draw the halo -- `=== false` rather than a truthiness test, so an old document is
	// not silently restyled by an upgrade.
	function applyMaskLabels() {
		if (svg) { svg.classList.toggle('lpn-masks-off', settings.maskLabels === false); }
	}
	// **A ZOOM STEP DOES NOT REBUILD LABELS NOBODY CAN SEE** (Tom, 2026-08-15: *"the Net3 example is
	// a little sluggish to zoom even when labels are all hidden. Is recalc triggering on zoom and can
	// be turned off? Maybe labels are being handled at all zoom levels."* — the second guess was the
	// right one, and no, nothing hydraulic runs here: `scheduleSolve()` is never called from a zoom).
	//
	// The full path is refreshFontSizes() -> refreshLabelText(), which recomposes every node's and
	// every link's text, re-measures each one with getBBox(), and then runs four iterations of the
	// collision relaxation over the lot. On Net3 that is ~200 elements of work per wheel notch,
	// every notch, to update text that `.lpn-labels-hidden` is not drawing.
	//
	// So when annotation is hidden and STAYS hidden, only two things still change with the zoom:
	// the symbol/stroke custom properties, and the user's own Text labels, which have their own
	// size-scaled threshold and may still be on screen. The transition in either direction takes
	// the full path, so nothing comes back stale.
	function onZoomChanged() {
		var wasHidden = dataLabelsHidden;
		applyLabelVisibility();
		if (wasHidden && dataLabelsHidden) {
			refreshSymbolSizes();
			refreshTextLabelSizes();
			return;
		}
		refreshFontSizes();
		// applyLabelVisibility() again, because refreshFontSizes() can change a Text label's own
		// width and therefore nothing about the threshold -- but buildDom-time elements created
		// inside refreshLabelText() have no visibility class yet.
		applyLabelVisibility();
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
	// ---- Page-title visibility (ROADMAP Task 289) ----
	// THE FIRST SETTING ON THIS PAGE THAT IS NOT PART OF THE PROJECT, and the reason it is not:
	// Task 263 made everything here project-scoped because a bare number is meaningless without
	// the units it was typed in -- "imagine opening a 400 diameter pipe into an inch browser!"
	// That reasoning does not reach this one. Whether the heading above the drawing is showing is
	// not data about the network; it is about the window the person is sitting in front of, and
	// carrying it inside a project file would mean a colleague opening your work inherits your
	// screen preference. So it lives in localStorage, per browser, and serializeProject() must
	// never learn about it.
	//
	// Tom, 2026-08-12, on the label: *"I say 'Saved in this calculator' even though it is
	// literally in the browser; it affects only this calculator."* Right -- the user-facing
	// distinction that matters is project vs everywhere-else, not localStorage vs a file.
	var PAGE_TITLES_KEY = 'lpn_show_titles';
	function pageTitlesShown() {
		try { return localStorage.getItem(PAGE_TITLES_KEY) !== '0'; } catch (e) { return true; }
	}
	function applyPageTitles(show) {
		// The h2 page description goes with them (Tom, 2026-08-12): with the box unchecked he wants
		// the calculator's own toolbar to sit directly under the site navbar, and a lone subtitle
		// floating where the heading used to be is worse than either state.
		['ec-page-title', 'ec-page-welcome', 'ec-page-desc'].forEach(function (id) {
			var el = document.getElementById(id);
			// Not display:none -- these are already d-print-none, and hiding them for the screen
			// must not change what a print does.
			if (el) { el.style.display = show ? '' : 'none'; }
		});
	}
	function setPageTitlesShown(show) {
		try { localStorage.setItem(PAGE_TITLES_KEY, show ? '1' : '0'); } catch (e) {}
		applyPageTitles(show);
	}

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
		// A group heading with no collapse. Task 289: the two scope markers ("Project settings",
		// "Calculator settings") are labels over what follows, not sections in their own right --
		// they have no body to hide, and a disclosure triangle on something that cannot disclose
		// would be a lie about the control. Same weight and spacing as a section head so the panel
		// reads as one hierarchy.
		function groupHeading(titleText) {
			var h = document.createElement('div');
			h.style.cssText = 'margin-top:8px;font-weight:bold';
			h.textContent = titleText;
			fields.appendChild(h);
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
		// ---- 0. What this whole panel IS (Tom, 2026-08-10) ----
		// Verified before writing it: every control below, plus the Units block adopted above and
		// the Labels popover, is carried by serializeProject() (`settings`, `labelSettings`,
		// `units`, `backdrop`). So the sentence is true of the panel entire, with no exceptions to
		// hedge. It is the line that makes the New User checklist's template flow make sense --
		// there is no "save as my defaults" here because saving the PROJECT is that (CLAUDE.md,
		// "there are no browser units, only project units"), and nothing said so on screen.
		// The one thing not carried is the map viewport: zoom and pan re-fit on load. That is not
		// a setting and is not in this panel, so it does not qualify the claim.
		groupHeading(pc.lpn_settings_scope_project || 'Project settings');
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
		// Same order as the Insert menu and the toolbar -- see openInsertMenu(). A valve has had its
		// own prefix and its own counter since Task 248 phase 2; it is a LINK, like a pipe and a
		// pump, and the three of them are keyed L, P and V.
		[
			['J', pc.lpn_tool_add_junction || 'Junction'],
			['R', pc.lpn_tool_add_reservoir || 'Reservoir'],
			['T', pc.lpn_tool_add_tank || 'Tank'],
			['L', pc.lpn_tool_add_pipe || 'Pipe'],
			['P', pc.lpn_tool_add_pump || 'Pump'],
			['V', pc.lpn_tool_add_valve || 'Valve']
		].forEach(function (f) {
			var key = f[0], input = document.createElement('input'), wrap = document.createElement('span');
			input.type = 'text'; input.size = 4; input.value = settings.idPrefixes[key];
			input.addEventListener('change', function () {
				if (!validatePrefix(input.value)) { alert(pc.lpn_id_invalid || 'Enter an ID with no spaces and no quotation marks.'); input.value = settings.idPrefixes[key]; return; }
				settings.idPrefixes[key] = input.value;
				saveToStorage();
			});
			// "Apply to all" beside each row rather than one button for the panel: the prefixes are
			// edited one at a time and are independent, so a single button would have to mean "all
			// six", which is a bigger and less reversible thing than anyone pressing it intends.
			var apply = document.createElement('button');
			apply.type = 'button';
			apply.textContent = pc.lpn_settings_apply_to_all || 'Apply to all';
			apply.style.marginLeft = '6px';
			helpTip(apply, pc.lpn_settings_apply_to_all_tip);
			apply.addEventListener('click', function () {
				// Committed FIRST, so pressing Apply straight after typing (without leaving the box,
				// which is what a hurried user does) applies what is on screen rather than the last
				// committed value.
				if (validatePrefix(input.value)) { settings.idPrefixes[key] = input.value; }
				else { input.value = settings.idPrefixes[key]; }
				applyIdPrefixToAll(key);
				rebuildSettingsFields();
			});
			wrap.appendChild(input); wrap.appendChild(apply);
			row(idBody, f[1], wrap);
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
		// unitId is the roughness selector under Darcy-Weisbach (e is a length) and null otherwise
		// (n and C are dimensionless) -- the one row here whose units depend on another setting.
		defaultRow(defBody, roughnessLabel(), frictionMethod() === 'dw' ? 'lpn_u_roughness' : null, 'roughness', positive);
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
		// TASK 184 LANDED AND THIS STAYED A BASE-LEVEL ACTION, exactly as this note required: run
		// inside a scenario it would mint an override on every element at once, which is never
		// what anyone means by it. The guard is in the click handler below.
		var pushSpecs = pushSpecList();
		note(defBody, pc.lpn_settings_push_note || 'Only the properties whose labels are showing right now are applied.');
		var pushBtn = document.createElement('button');
		pushBtn.type = 'button';
		pushBtn.textContent = pc.lpn_settings_push_btn || 'Apply defaults to all elements';
		pushBtn.addEventListener('click', function () {
			// Base-level, and it SAYS SO rather than doing something defensible-looking. Inside a
			// scenario this would write an override onto every element in one click -- the single
			// most expensive thing this page can do to a document, from a button whose label says
			// nothing about scenarios.
			if (!inBaseScenario()) {
				alert((pc.lpn_push_base_only || 'This applies your starting values to the drawing itself, so it can only be done in {base}. Switch to {base} and try again.')
					.replace(/\{base\}/g, pc.lpn_scenario_base || 'Base'));
				return;
			}
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
		sizeInput.type = 'number'; sizeInput.step = '1'; sizeInput.min = '1'; sizeInput.value = settings.textSize;
		sizeInput.addEventListener('change', function () {
			if (+sizeInput.value > 0) { settings.textSize = +sizeInput.value; refreshFontSizes(); saveToStorage(); }
			else { sizeInput.value = settings.textSize; }
		});
		row(mapBody, pc.lpn_settings_text_size || 'Text size (pixels)', sizeInput);
		// THREE INDEPENDENT PIXEL SIZES, and no units selector anywhere (Task 331). The "Text size
		// units" map/screen dropdown is gone with map-unit sizing itself, and the old "Symbol size
		// (relative to text)" multiplier is gone with the coupling that forced it -- a symbol size
		// expressed as a multiple of a text size made the user do a division to answer "how big is
		// the dot", which is the only question they were ever asking.
		var symInput = document.createElement('input');
		symInput.type = 'number'; symInput.step = '1'; symInput.min = '1'; symInput.value = settings.symbolSize;
		symInput.addEventListener('change', function () {
			if (+symInput.value > 0) { settings.symbolSize = +symInput.value; refreshSymbolSizes(); relayoutLabels(); saveToStorage(); }
			else { symInput.value = settings.symbolSize; }
		});
		row(mapBody, pc.lpn_settings_symbol_size || 'Symbol size (pixels)', symInput);
		var lwInput = document.createElement('input');
		lwInput.type = 'number'; lwInput.step = '0.5'; lwInput.min = '0.5'; lwInput.value = settings.linkWidth;
		lwInput.addEventListener('change', function () {
			if (+lwInput.value > 0) { settings.linkWidth = +lwInput.value; refreshSymbolSizes(); saveToStorage(); }
			else { lwInput.value = settings.linkWidth; }
		});
		row(mapBody, pc.lpn_settings_link_width || 'Pipe width (pixels)', lwInput);
		// Task 329, and it ships OFF: aligned-vs-horizontal is a visual judgement, and turning it on
		// by default would be making that judgement for the user rather than offering it to them.
		var alignInput = document.createElement('input');
		alignInput.type = 'checkbox'; alignInput.checked = !!settings.alignPipeLabels;
		alignInput.addEventListener('change', function () {
			settings.alignPipeLabels = alignInput.checked;
			relayoutLabels(); saveToStorage();
		});
		row(mapBody, pc.lpn_settings_align_labels || 'Align pipe labels with pipes', alignInput);
		// Task 351, and it belongs directly under the checkbox it only means anything for. A number
		// rather than a checkbox because the right value depends on the drawing: a subdivision of
		// north-south mains wants the doorway well clear of vertical, and a diagonal transmission
		// main barely cares.
		var biasInput = document.createElement('input');
		biasInput.type = 'number'; biasInput.step = '5'; biasInput.min = LPN_FLIP_LEFT_MIN; biasInput.max = LPN_FLIP_LEFT_MAX;
		biasInput.value = labelFlipLeftOfVertical();
		biasInput.addEventListener('change', function () {
			var v = +biasInput.value;
			if (!isFinite(v)) { biasInput.value = labelFlipLeftOfVertical(); return; }
			settings.labelFlipLeftOfVertical = Math.max(LPN_FLIP_LEFT_MIN, Math.min(LPN_FLIP_LEFT_MAX, v));
			biasInput.value = settings.labelFlipLeftOfVertical;
			relayoutLabels(); saveToStorage();
		});
		row(mapBody, pc.lpn_settings_readability_bias || 'Degrees left of vertical before labels flip', biasInput);
		// Task 330, and it ships ON because that is what the page has always drawn -- a label over a
		// backdrop image is unreadable without it, and an upgrade must not restyle anyone's drawing.
		var maskInput = document.createElement('input');
		maskInput.type = 'checkbox'; maskInput.checked = settings.maskLabels !== false;
		maskInput.addEventListener('change', function () {
			settings.maskLabels = maskInput.checked;
			applyMaskLabels(); saveToStorage();
		});
		row(mapBody, pc.lpn_settings_mask_labels || 'Background mask behind labels', maskInput);
		// ---- Scale-dependent label visibility ----
		// THE CONTROL IS A CAPTURE BUTTON, NOT JUST A NUMBER, AND THAT IS THE WHOLE USABILITY OF IT.
		// The threshold is a width in model length units, and no default is meaningful across
		// networks that are 400 ft and 40 miles across -- so asking someone to type one blind asks
		// them to predict a number they can only recognise by seeing it. Instead: zoom until the
		// labels are as sparse as you want them, press the button, and the current view's width
		// becomes the threshold. The number stays editable for anyone who does know what they want.
		// Blank means always show, which is both the default and the pre-Task-331 behaviour.
		var lmwWrap = document.createElement('span');
		var lmwInput = document.createElement('input');
		lmwInput.type = 'number'; lmwInput.step = 'any'; lmwInput.min = '0';
		lmwInput.style.width = '7em';
		lmwInput.placeholder = pc.lpn_settings_label_always || 'Always show labels';
		lmwInput.value = settings.labelMaxWidth === null || settings.labelMaxWidth === undefined ? '' : settings.labelMaxWidth;
		lmwInput.addEventListener('change', function () {
			var v = lmwInput.value.trim();
			settings.labelMaxWidth = (v === '' || !(+v > 0)) ? null : +v;
			if (settings.labelMaxWidth === null) { lmwInput.value = ''; }
			applyLabelVisibility(); saveToStorage();
		});
		var lmwBtn = document.createElement('button');
		lmwBtn.type = 'button'; lmwBtn.className = 'lpn-btn';
		lmwBtn.textContent = pc.lpn_settings_label_use_view || 'Use current view';
		lmwBtn.addEventListener('click', function () {
			// Rounded to three significant figures: the captured number is a JUDGEMENT ("about this
			// zoomed in"), and writing 1283.4177 into the box would present an accident of the
			// current pan as a decision worth preserving.
			// MIN, matching the threshold it is capturing for -- see mapSpan().
			var w = mapSpan('min');
			if (!(w > 0)) { return; }
			settings.labelMaxWidth = +w.toPrecision(3);
			lmwInput.value = settings.labelMaxWidth;
			applyLabelVisibility(); saveToStorage();
		});
		lmwWrap.appendChild(lmwInput);
		lmwWrap.appendChild(document.createTextNode(' '));
		lmwWrap.appendChild(lmwBtn);
		row(mapBody, pc.lpn_settings_label_max_width || 'Show labels when the view is smaller than (map units)', lmwWrap);
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
		// ---- 4. Colour by value (Task 384) ----
		// A SECTION OF THE SETTINGS PANEL, not a popup of its own. EPANET reaches its legend editor
		// by right-clicking the legend, which is a gesture nothing else on this page uses and which
		// has no keyboard equivalent; the settings panel is where every other map-appearance choice
		// already lives, so this is one place to look instead of two.
		var colBody = section('colors', pc.lpn_settings_colors || 'Color by value');
		// Rebuilt in place after a break-value button writes numbers, so the boxes show what was
		// just computed. Declared before the selects because their handlers call it.
		function refreshColorSection() { rebuildSettingsFields(); }
		function fieldSelect(group, defsMap) {
			var sel = document.createElement('select'), cur = colorFieldOf(group);
			var noneOpt = document.createElement('option');
			noneOpt.value = ''; noneOpt.textContent = pc.lpn_color_none || 'No color';
			if (!cur) { noneOpt.selected = true; }
			sel.appendChild(noneOpt);
			Object.keys(defsMap).forEach(function (key) {
				var opt = document.createElement('option');
				opt.value = key; opt.textContent = colorFieldLabel(group, key);
				if (key === cur) { opt.selected = true; }
				sel.appendChild(opt);
			});
			sel.addEventListener('change', function () {
				if (group === 'node') { settings.colorNodeField = sel.value; }
				else { settings.colorLinkField = sel.value; }
				refreshValueColors(); saveToStorage(); refreshColorSection();
			});
			return sel;
		}
		row(colBody, pc.lpn_settings_color_node_field || 'Color nodes by', fieldSelect('node', COLOR_NODE_FIELDS));
		row(colBody, pc.lpn_settings_color_link_field || 'Color pipes by', fieldSelect('link', COLOR_LINK_FIELDS));
		var rampSelect = document.createElement('select');
		[
			['epanet', pc.lpn_color_ramp_epanet || 'Blue to red (EPANET)'],
			['viridis', pc.lpn_color_ramp_viridis || 'Purple to yellow (easier to tell apart)'],
			['gray', pc.lpn_color_ramp_gray || 'Light to dark gray']
		].forEach(function (o) {
			var opt = document.createElement('option');
			opt.value = o[0]; opt.textContent = o[1];
			if (o[0] === settings.colorRamp) { opt.selected = true; }
			rampSelect.appendChild(opt);
		});
		rampSelect.addEventListener('change', function () {
			settings.colorRamp = rampSelect.value; refreshValueColors(); saveToStorage();
		});
		row(colBody, pc.lpn_settings_color_ramp || 'Color ramp', rampSelect);
		var revInput = document.createElement('input');
		revInput.type = 'checkbox'; revInput.checked = !!settings.colorReverse;
		revInput.addEventListener('change', function () {
			settings.colorReverse = revInput.checked; refreshValueColors(); saveToStorage();
		});
		row(colBody, pc.lpn_settings_color_reverse || 'Reverse the colors', revInput);
		var themInput = document.createElement('input');
		themInput.type = 'checkbox'; themInput.checked = !!settings.colorThematic;
		themInput.addEventListener('change', function () {
			settings.colorThematic = themInput.checked; refreshValueColors(); saveToStorage();
		});
		row(colBody, pc.lpn_settings_color_thematic || 'Thematic map: colors only, no labels', themInput,
			pc.lpn_settings_color_thematic_tip);
		var colLegendSelect = document.createElement('select');
		[
			['top-left', pc.lpn_settings_legend_top_left || 'Top left'],
			['top-right', pc.lpn_settings_legend_top_right || 'Top right'],
			['middle-left', pc.lpn_settings_legend_middle_left || 'Middle left'],
			['middle-right', pc.lpn_settings_legend_middle_right || 'Middle right'],
			['bottom-left', pc.lpn_settings_legend_bottom_left || 'Bottom left'],
			['bottom-right', pc.lpn_settings_legend_bottom_right || 'Bottom right']
		].forEach(function (o) {
			var opt = document.createElement('option');
			opt.value = o[0]; opt.textContent = o[1];
			if (o[0] === settings.colorLegendPosition) { opt.selected = true; }
			colLegendSelect.appendChild(opt);
		});
		colLegendSelect.addEventListener('change', function () {
			settings.colorLegendPosition = colLegendSelect.value;
			applyColorLegendPosition(); saveToStorage();
		});
		row(colBody, pc.lpn_settings_color_key_position || 'Color key position', colLegendSelect);
		// THE BREAK EDITOR, one per coloured group -- EPANET's own dialog: four boxes, ascending,
		// blanks allowed. A group with no field selected gets no boxes rather than four dead ones.
		['node', 'link'].forEach(function (group) {
			var field = colorFieldOf(group); if (!field) { return; }
			var head = document.createElement('div');
			head.style.cssText = 'margin-top:6px;font-weight:bold';
			head.textContent = (pc.lpn_settings_color_breaks || 'Break values') + ': ' + colorFieldLabel(group, field);
			colBody.appendChild(head);
			note(colBody, pc.lpn_settings_color_breaks_note ||
				'Leave these blank and the colors spread over whatever is on the map now. Type numbers, or press a button below, and the same number always means the same color.');
			var pinned = pinnedBreaks(group, field), wrap = document.createElement('div'), i;
			wrap.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap';
			var boxes = [];
			function writeBreaks() {
				var vals = boxes.map(function (b) { return b.value; })
					.filter(function (v) { return v !== '' && isFinite(+v); }).map(Number);
				vals.sort(function (a, b) { return a - b; });
				settings.colorBreaks = settings.colorBreaks || {};
				settings.colorBreaks[colorBreakKey(group, field)] = vals;
				refreshValueColors(); saveToStorage();
			}
			for (i = 0; i < COLOR_BANDS - 1; i++) {
				var box = document.createElement('input');
				box.type = 'number'; box.step = 'any';
				box.style.width = '5em';
				box.value = (pinned[i] === undefined) ? '' : pinned[i];
				box.setAttribute('aria-label', (pc.lpn_settings_color_breaks || 'Break values') + ' ' + (i + 1));
				box.addEventListener('change', writeBreaks);
				boxes.push(box);
				wrap.appendChild(box);
			}
			colBody.appendChild(wrap);
			// EPANET's two auto-assign buttons, and they behave exactly as EPANET's do: they READ
			// the values on the map right now and WRITE fixed numbers into the boxes above. They
			// are not a live mode -- which is the whole point, because a break value that moved
			// with the timestep would make two timesteps incomparable by eye.
			var btnWrap = document.createElement('div');
			btnWrap.style.marginTop = '4px';
			function autoBtn(text, fn) {
				var b = document.createElement('button');
				b.type = 'button'; b.textContent = text; b.style.marginRight = '4px';
				b.addEventListener('click', function () {
					var vals = colorValues(group, field), out = fn(vals);
					if (!out.length) {
						alert(pc.lpn_settings_color_no_values || 'There are no values to work from yet. Solve the network first.');
						return;
					}
					settings.colorBreaks = settings.colorBreaks || {};
					settings.colorBreaks[colorBreakKey(group, field)] = out.map(function (v) { return +v.toPrecision(3); });
					refreshValueColors(); saveToStorage(); refreshColorSection();
				});
				return b;
			}
			btnWrap.appendChild(autoBtn(pc.lpn_settings_color_equal_intervals || 'Equal intervals', equalIntervalBreaks));
			btnWrap.appendChild(autoBtn(pc.lpn_settings_color_equal_counts || 'Equal counts', equalCountBreaks));
			var clearBtn = document.createElement('button');
			clearBtn.type = 'button';
			clearBtn.textContent = pc.lpn_settings_color_auto || 'Automatic';
			clearBtn.addEventListener('click', function () {
				settings.colorBreaks = settings.colorBreaks || {};
				delete settings.colorBreaks[colorBreakKey(group, field)];
				refreshValueColors(); saveToStorage(); refreshColorSection();
			});
			btnWrap.appendChild(clearBtn);
			colBody.appendChild(btnWrap);
		});
		// The "Saving to a file" section is GONE (Task 211). It held exactly one control -- how often
		// the open project was written back to its file -- and nothing is written to a file on a timer
		// any more, so there is no interval to set. Tom asked why the 60-180 s range existed at all;
		// the honest answer was that one number was doing three jobs (write interval, lock heartbeat,
		// and the how-long-before-a-colleague-may-take-over threshold), so the range was protecting a
		// coupling rather than the user. Splitting those apart removed the setting instead of widening
		// it, which is the better answer to the question he actually asked.
		// ---- units (Tom, 2026-08-08) ----
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
		// ---- friction method (ROADMAP Task 271) ----
		// FIRST row in Computation, above tolerance and the engine toggle, because it is the only
		// one of the three that changes the ANSWER's physics rather than how precisely or by whose
		// code it is reached. It lives under "Project settings" (the heading above) and not
		// "Calculator settings": the method decides what every roughness number in this document
		// MEANS, so it belongs to the document, exactly as the units do.
		//
		// Every label is borrowed from bpn_ -- bpn_method, bpn_method_hw/_dw/_manning are already
		// translated everywhere this page is, so the control costs no new keys.
		var methodSelect = document.createElement('select');
		[
			['hw', pc.bpn_method_hw || 'Hazen-Williams'],
			['dw', pc.bpn_method_dw || 'Darcy-Weisbach'],
			['manning', pc.bpn_method_manning || 'Manning']
		].forEach(function (o) {
			var opt = document.createElement('option');
			opt.value = o[0]; opt.textContent = o[1];
			if (o[0] === frictionMethod()) { opt.selected = true; }
			methodSelect.appendChild(opt);
		});
		methodSelect.addEventListener('change', function () {
			var was = frictionMethod(), now = methodSelect.value;
			if (was === now) { return; }
			// SWITCHING METHOD DOES NOT CONVERT ANYTHING, and on a network that already has pipes
			// that is worth saying out loud. C = 130 read as Manning n is not a rough answer, it is
			// nonsense by four orders of magnitude -- and unlike a unit switch, nothing on screen
			// changes to show it happened except one letter in a label. Tom, on this exact risk:
			// "being unaware of those on a new project (model) is dangerous."
			//
			// This is the same principle as the suite-wide ban on converting inputs when units
			// switch (CLAUDE.md, Unit Sets): the stored number is what the user typed. The
			// difference is only that here we ASK first, because there is no unit strip to make the
			// change self-evident afterwards.
			if (doc.links.some(function (l) { return l.type !== 'pump'; })) {
				if (!confirm(pc.lpn_method_switch_confirm
					|| 'Changing the friction method does not change the roughness numbers already typed on your pipes, and a roughness for one method is meaningless for another. Check every pipe after this. Change it anyway?')) {
					methodSelect.value = was;
					return;
				}
			}
			settings.method = now;
			// The DEFAULT follows the method -- future elements only, never existing ones, per the
			// Default inputs section's own stated rule. Without this, a user who switches to Manning
			// and draws a pipe gets C = 130 as an n.
			settings.defaults.roughness = defaultRoughnessFor(now);
			applyMethodUI();
			saveToStorage();
			// Rebuild rather than patch: the roughness row's LABEL and its unit both changed, and so
			// did this select's own read of frictionMethod(). refreshPopupIfOpen() catches an open
			// element popup showing the old symbol.
			rebuildSettingsFields();
			refreshPopupIfOpen();
			refreshMapStatus();
			scheduleSolve();
		});
		row(compBody, pc.bpn_method || 'Friction method', methodSelect, pc.bpn_roughness_tip);
		// ---- Calculator settings (Task 289) ----
		// Built HERE, before `tail`, purely for DOM order: headings and sections append to `fields`
		// as they are called, and the actions in `tail` must stay last.
		//
		// TWO WORDS, NOT A SENTENCE, and no collapsible wrapper (Tom, 2026-08-12, correcting the
		// first build). Scope is carried by two parallel headings -- "Project settings" above,
		// "Calculator settings" here -- which say the same thing the prose notes said in a quarter
		// of the space and let the reader compare them at a glance. The old wording buried the
		// contrast in two sentences that had to be read to be told apart, and wrapped a single
		// checkbox in a section that could collapse to hide one row.
		groupHeading(pc.lpn_settings_scope_calculator || 'Calculator settings');
		var titlesInput = document.createElement('input');
		titlesInput.type = 'checkbox';
		titlesInput.checked = pageTitlesShown();
		titlesInput.addEventListener('change', function () { setPageTitlesShown(titlesInput.checked); });
		row(fields, pc.lpn_settings_show_titles || 'Show page titles', titlesInput, pc.lpn_settings_show_titles_tip);
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
			// Fetch it now rather than on the next solve: the user just asked for this engine, so
			// this is the moment to spend the 664 KB and the moment they will understand the wait.
			if (settings.engine === 'epanet') { warmEpanetEngine('engine'); }
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
			// No applyMapHeight() -- the canvas height stopped being a setting when the Map height
			// row was retired, and it is a fact about the ENVIRONMENT (Tom, 2026-08-15: *"Map bottom
			// has nothing to do with the model at all. It's the environment."*). Restoring defaults
			// cannot change how much room the window has.
			applyLegendPosition();
			refreshFontSizes();
			// refreshLabelText(), not renderLabelsLegend(): resetting labelSettings changes which
			// fields are printed and what prefix each carries, so the labels themselves have to be
			// rebuilt -- and that call renders the legend on its way through. Restoring defaults
			// used to redraw only the legend, which left the map showing the old label set.
			refreshLabelText();
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
		// No close button to wire -- pull-down, same as Labels above.
		rebuildSettingsFields();
	}
	function toggleSettingsPopup(evt) {
		var popup = document.getElementById('lpn_settings_popup');
		if (popup.style.display === 'block') { popup.style.display = 'none'; viewPopoverAnchor = null; return; }
		// One pull-down at a time -- see the same two lines in toggleLabelsPopup().
		closeMenu();
		closeViewPopovers('lpn_settings_popup');
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
		viewPopoverAnchor = evt.currentTarget;
		openPanelAtAnchor(popup, evt.currentTarget.getBoundingClientRect());
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
	// DRAGGING THE PROPERTY POPUP (Tom, 2026-08-15). The grab surface is the popup's own CHROME --
	// the padded band around the body, where `e.target` is the popup element itself -- and never a
	// child. That is what makes this safe to add to a panel full of text inputs, spinners and
	// checkboxes: a control is always a child, so a drag can never start on one, and no control had
	// to be re-wired. It also needs no drag bar, no extra row of pixels, and no new string.
	//
	// Pointer events, not mouse events, so a touch drag works identically -- and with
	// setPointerCapture the drag survives the pointer leaving the popup, which is the failure that
	// makes hand-rolled drags feel broken at speed.
	//
	// Double-click the same chrome to send it home, the same gesture that resets a dragged map
	// label. Without it a popup parked somewhere awkward could only be recovered by reloading.
	function wirePopup() {
		var popup = document.getElementById('lpn_popup');
		document.getElementById('lpn_popup_close').addEventListener('click', closePopup);
		var drag = null;
		popup.addEventListener('pointerdown', function (e) {
			if (e.target !== popup) { return; }   // a child is a control; only the chrome drags
			var r = popup.getBoundingClientRect();
			drag = { dx: e.clientX - r.left, dy: e.clientY - r.top, w: r.width, h: r.height };
			popup.setPointerCapture(e.pointerId);
			e.preventDefault();
		});
		popup.addEventListener('pointermove', function (e) {
			if (!drag) { return; }
			var at = clampPanel(e.clientX - drag.dx, e.clientY - drag.dy, drag.w, drag.h,
				window.innerWidth, window.innerHeight);
			popup.style.left = at.left + 'px'; popup.style.top = at.top + 'px';
			// Remembered as it moves rather than on release: a drag that ends off-window, or is
			// interrupted by the pointer being cancelled, still leaves the popup where it looks.
			popupUserPos = at;
		});
		function endDrag(e) {
			if (!drag) { return; }
			drag = null;
			if (popup.hasPointerCapture && popup.hasPointerCapture(e.pointerId)) { popup.releasePointerCapture(e.pointerId); }
		}
		popup.addEventListener('pointerup', endDrag);
		popup.addEventListener('pointercancel', endDrag);
		popup.addEventListener('dblclick', function (e) {
			if (e.target !== popup) { return; }
			popupUserPos = null;
			if (currentPopup) { reopenPopupAtElement(); }
		});
	}
	// Re-opens whatever is currently open at its AUTOMATIC place -- used by the double-click reset
	// above. Goes through the same renderers a fresh click does, so there is one path to being open.
	function reopenPopupAtElement() {
		var c = currentPopup;
		if (!c) { return; }
		if (c.kind === 'node') { openPopup(c.id); }
		else if (c.kind === 'link') { openLinkPopup(c.id); }
		else if (c.kind === 'label') { openLabelPopup(c.id); }
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
	// ---- the override marker (ROADMAP Task 184) ----
	// EVERY EDIT IN A NON-BASE SCENARIO IS AN OVERRIDE, FULL STOP -- even when the typed value
	// equals Base's. The tick records INTENT at edit time and is never computed by diffing, because
	// a diff cannot tell "I chose this deliberately here" from "Base happens to agree with me
	// today", and those two need opposite treatment the moment Base moves. Clearing the tick is the
	// undo, and the field goes straight back to Base's value.
	//
	// Base's value is shown BESIDE the scenario's whenever the tick is set. That is the cheap fix
	// for the one genuinely confusing case the delta model leaves (Task 184): you correct a
	// diameter in Base, and a scenario that overrode it does not move. Seeing what you are
	// diverging from, at the moment you can act on it, needs no change-tracking and no "Base
	// changed since" bookkeeping.
	function formatPropValue(v) {
		if (v === undefined || v === null || v === '') { return ''; }
		// A boolean reads as a MARK, not as a word: "Base: ✓" beside a checkbox is exactly the box's
		// own vocabulary, it is language-free and RTL-safe (the same reason the suite's verdict
		// strings lead with a glyph), and it costs no key in 27 languages to say Yes and No.
		if (typeof v === 'boolean') { return v ? '✓' : '—'; }
		return (typeof v === 'number') ? String(+v.toFixed(6)) : String(v);
	}
	// What every property editor calls after it writes: redraw the element (its dash, its grey, its
	// halo), re-solve, re-count the status bar, persist. One seam, so a new field cannot forget a
	// third of it.
	function afterPropertyEdit(el) {
		if (elGroup(el) === 'link') { rebuildLink(el); } else if (nodeEls[el.id]) { updateNode(el.id); }
		refreshScenarioMarks();
		refreshScenarioStatus();
		scheduleSolve();
		saveToStorage();
	}
	function overrideMarker(fields, el, prop, format) {
		var pc = EngCalcs.pageConfig || {};
		// Nothing at all in Base: there is no scenario to belong to, and a permanently-unticked box
		// on every row of every popup would be noise the overwhelming majority of the time.
		if (!el || inBaseScenario() || !isOverridable(el, prop)) { return; }
		var label = document.createElement('label'), box = document.createElement('input'),
			text = document.createElement('span'), on = hasOverride(el, prop);
		label.className = 'lpn-ov-marker';
		box.type = 'checkbox';
		box.checked = on;
		box.addEventListener('change', function () {
			saveUndoSnapshot();
			// Ticking records the value the field is ALREADY showing -- which is Base's, since
			// nothing overrode it yet. That is deliberate: the tick is a claim about intent, not an
			// edit, so it must not change any number by itself.
			if (box.checked) { setOverride(el, prop, effective(el, prop)); } else { clearOverride(el, prop); }
			afterPropertyEdit(el);
			refreshPopupIfOpen();
		});
		setFieldLabel(text, pc.lpn_scenario_override || 'Only in this scenario', pc.lpn_scenario_override_tip);
		label.appendChild(box);
		label.appendChild(document.createTextNode(' '));
		label.appendChild(text);
		if (on) {
			var base = document.createElement('span');
			base.className = 'lpn-ov-base';
			base.textContent = (pc.lpn_scenario_base_value || 'Base: {value}')
				.replace('{value}', (format || formatPropValue)(baseValue(el, prop)));
			label.appendChild(base);
		}
		fields.appendChild(label);
		fields.appendChild(document.createElement('br'));
	}
	// Completes an ordinary value edit. The three field helpers below all used to end at
	// scheduleSolve(), which is a THIRD of the job: afterPropertyEdit() also refreshes the audit
	// halos, refreshes the "Custom values" count in the status strip, and saves. Its own comment
	// says "one seam, so a new field cannot forget a third of it" -- and the ordinary edit path,
	// the commonest action on the page, was simply never reaching it, so the count in the status
	// strip was wrong in the common case (2026-08-14).
	//
	// Only when `ov` is present, deliberately: a row with no overridable property (X, Y, a read-only
	// result) has no marks, no count and no override to save, and routing it here would rebuild the
	// element for nothing. Those rows keep the plain scheduleSolve().
	function completeEdit(ov) {
		if (ov && ov.el) { afterPropertyEdit(ov.el); } else { scheduleSolve(); }
	}
	// get/set are DECLARED values, not SI (Task 263) -- what the user typed, in the unit the label
	// names. No factor in either direction; the solver does the converting at its own boundary.
	// `ov` (optional) is {el, prop}: the element and the overridable property this row edits, which
	// is what earns the row its override marker inside a scenario.
	function unitNumberField(fields, labelText, unitId, get, set, tip, ov) {
		var label = document.createElement('label'), input = document.createElement('input'), v0 = get();
		input.type = 'number';
		// Printed with trailing zeros stripped rather than a fixed toFixed(4). Under SI storage the
		// value was the result of a division and 4 places was a reasonable guess at it; now it is the
		// number the user typed, and showing "8" back as "8.0000" makes their own input look computed.
		input.value = (typeof v0 === 'number') ? String(+v0.toFixed(6)) : '';
		// scheduleSolve() here, not just inside set callbacks, centralizes it for every current
		// and future use of this helper (elev/demand/head's set already also calls updateNode(),
		// which itself schedules a solve -- calling it twice is harmless, debounced).
		input.addEventListener('change', function () { set(+input.value); completeEdit(ov); });
		setFieldLabel(label, labelText + ' (' + unitLabel(unitId) + ')', tip);
		label.appendChild(input);
		fields.appendChild(label);
		fields.appendChild(document.createElement('br'));
		if (ov) { overrideMarker(fields, ov.el, ov.prop); }   // and see completeEdit() on the setter
	}
	// Same as unitNumberField(), but the value may be BLANK, meaning "follow whatever this field
	// defaults to" -- currently a reservoir's head following its elevation (Tom, 2026-07-30).
	// placeholderSI is that fallback, shown greyed in the empty box so the field never looks like it
	// is missing a number; clearing the box stores undefined, which is what re-links the two.
	function unitNumberFieldBlank(fields, labelText, unitId, get, set, placeholder, tip, ov) {
		var label = document.createElement('label'), input = document.createElement('input'),
			v = get();
		input.type = 'number';
		input.value = (v === undefined || v === null || v === '') ? '' : String(+(+v).toFixed(6));
		input.placeholder = String(+(+placeholder).toFixed(6));
		input.addEventListener('change', function () {
			set(input.value === '' ? undefined : +input.value);
			completeEdit(ov);
		});
		setFieldLabel(label, labelText + ' (' + unitLabel(unitId) + ')', tip);
		label.appendChild(input);
		fields.appendChild(label);
		fields.appendChild(document.createElement('br'));
		if (ov) { overrideMarker(fields, ov.el, ov.prop); }   // and see completeEdit() on the setter
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
		input.addEventListener('change', function () {
			setProp(l, 'length', +input.value);
			// lenAuto IS BASE-OWNED and a scenario must not touch it. The Auto handler directly below
			// already says why -- geometry is shared, because a node cannot be in two places at once
			// in one rendered map -- and this line used to clear the flag unconditionally, so typing
			// a length inside a scenario silently switched EVERY scenario, and Base, off Auto.
			//
			// WHAT A SCENARIO WITH A LENGTH OVERRIDE ON AN AUTO LINK SHOWS, since the next reader
			// will ask: the override wins. effective() finds the override before it ever reaches
			// Base's auto-derived value, so the box shows the typed number and the solve uses it,
			// while Base and every other scenario go on following the drawing. The Auto checkbox
			// keeps showing Base's state, which is the truth about the link -- and unticking the
			// override marker hands the value straight back to that.
			if (inBaseScenario()) { l.lenAuto = false; auto.checked = false; }
			refreshPopupIfOpen();
			scheduleSolve();
		});
		auto.type = 'checkbox'; auto.checked = l.lenAuto;
		auto.addEventListener('change', function () {
			l.lenAuto = auto.checked;
			// The auto length writes BASE, never an override, and clears any override on the way:
			// geometry is Base-owned (a node cannot be in two places at once in one rendered map),
			// so "follow the drawing" is a statement about the drawing, which every scenario shares.
			// `lenAuto` itself is that same kind of flag and is deliberately not overridable.
			if (l.lenAuto) {
				l._length = linkGeomLength(l);   // base-write: Auto reverts to the drawing, which every scenario shares; the override is cleared on the next line
				if (!inBaseScenario()) { clearOverride(l, 'length'); }
				input.value = effective(l, 'length').toFixed(2);
				refreshPopupIfOpen();
			}
			scheduleSolve();
		});
		setFieldLabel(label, (pc.lpn_field_length || 'Length') + ' (' + unitLabel('lpn_u_length') + ')',
			pc.lpn_field_length_tip);
		label.appendChild(input);
		autoLabel.appendChild(auto);
		autoLabel.appendChild(document.createTextNode(' ' + (pc.lpn_field_auto || 'Auto')));
		fields.appendChild(label); fields.appendChild(autoLabel);
		fields.appendChild(document.createElement('br'));
		overrideMarker(fields, l, 'length');
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
	// it against. Instead it opens off to the RIGHT of that element's own data label, clear of it by
	// about a node across ("roughly a node size to the right of the extrema location" -- Tom's own
	// measure, from when a badge hung off the end of the digits; the label's own right edge is that
	// same place now that the mark is inside the text). The popup then sits in the horizontal gap
	// beside the element rather than on top of its neighbours, and its position still reads as
	// belonging to the element because it lines up with that element's label.
	// Falls back to the click point when the element has no rendered label to hang off.
	function popupAnchorFor(holder, labelPos, gapUnits, fallbackX, fallbackY) {
		if (!holder || labelPos === null) { return { x: fallbackX, y: fallbackY }; }
		var fs = effectiveFontSize();
		var x = labelPos.x + (holder.tw || 0) + gapUnits;
		var y = labelPos.y - fs * 0.85;
		return worldToScreen(x, y);
	}
	// Keeps a fixed-position panel of size w x h fully inside a vw x vh viewport, with a 4px margin.
	// Pure, and shared by the two things that place the property popup -- opening it at a point on
	// the map, and dragging it -- so a panel can never be parked half off the screen by one route
	// after being clamped by the other. Smaller-than-margin viewports fall back to the left/top
	// edge rather than going negative.
	var POPUP_EDGE = 4;
	function clampPanel(left, top, w, h, vw, vh) {
		return {
			left: Math.max(POPUP_EDGE, Math.min(left, vw - w - POPUP_EDGE)),
			top: Math.max(POPUP_EDGE, Math.min(top, vh - h - POPUP_EDGE))
		};
	}
	// WHERE A PULL-DOWN GOES, given the rect of the control that opened it (Task 372). Pure, so the
	// one rule every popover on this page obeys can be asserted without a browser.
	//
	// **IT MAY NEVER COVER ITS OWN BUTTON.** Tom, 2026-08-15: "Settings box opens, if its expanded
	// options are too long, too tall for the screen, and its top extends to cover its button." That
	// was a clamp doing exactly what it had been told: the panel was placed at the button's bottom
	// edge and then pulled back up by `vh - h`, and once h is most of the viewport that pull-back
	// lands on top of the anchor -- the one place the user is looking, and the control they will
	// click to dismiss it. So height is not something to clamp AROUND; it is something to give up.
	// The panel takes whichever side of the anchor has more room and, if it does not fit there, is
	// CAPPED to that room and scrolls inside itself.
	//
	// Only the horizontal axis is still clamped, because sliding sideways never hides the anchor.
	// `maxHeight` is null when the natural height fitted -- callers must then leave the panel's
	// height alone rather than pinning it to what they measured, or a panel whose contents change
	// (Settings rebuilds its fields on every open) would be frozen at the size it had last time.
	function panelPlacement(ar, w, h, vw, vh) {
		var below = vh - ar.bottom - POPUP_EDGE, above = ar.top - POPUP_EDGE;
		// Below is the default and stays the default whenever it is no worse than above: a pull-down
		// that flips upward to gain a few pixels reads as a different control.
		var useBelow = (h <= below) || (below >= above);
		var room = Math.max(useBelow ? below : above, 0);
		var height = Math.min(h, room);
		return {
			side: useBelow ? 'below' : 'above',
			left: Math.max(POPUP_EDGE, Math.min(ar.left, vw - w - POPUP_EDGE)),
			top: useBelow ? ar.bottom : ar.top - height,
			maxHeight: height < h ? height : null
		};
	}
	// Cap a panel to `avail` pixels, putting the scrollbar on its BODY rather than on the panel.
	// That distinction is the whole reason .lpn-popover-body exists (see the CSS): #lpn_popup's
	// close button is absolutely positioned in the panel's own corner, so a scrolling panel would
	// scroll the way out of itself off the top. A panel with no body wrapper -- the menus -- scrolls
	// itself, which is right there because it is nothing but rows.
	//
	// `naturalH` is passed in rather than re-measured: the caller has just measured it uncapped, and
	// measuring again after a style write is what turns one layout pass into three.
	function capPanelHeight(panel, body, avail, naturalH) {
		panel.style.maxHeight = avail + 'px';
		if (body) {
			var chrome = naturalH - body.getBoundingClientRect().height;
			body.style.maxHeight = Math.max(0, avail - chrome) + 'px';
		} else {
			panel.style.overflowY = 'auto';
		}
	}
	// Undo any previous cap BEFORE measuring. A panel is opened many times and the viewport it was
	// last capped for is not the one it is being opened in; measuring a still-capped panel would
	// ratchet it smaller on every open and never let it grow back.
	function resetPanelHeight(panel, body) {
		panel.style.maxHeight = ''; panel.style.overflowY = '';
		if (body) { body.style.maxHeight = ''; }
	}
	function panelBody(panel) {
		return panel.querySelector ? panel.querySelector('.lpn-popover-body') : null;
	}
	// THE ONE ENTRY POINT for every panel that hangs off a control: Labels, Settings, the menus and
	// their fly-outs, and the backdrop-position panel. One pass over all of them rather than a fix
	// per box (Task 372) -- they were four copies of the same six lines and had already drifted.
	// `ar` is the anchor's rect; `beside` is the fly-out case, which sits at the anchor's right edge
	// and top rather than under it, so it is allowed to share the anchor's rows.
	function openPanelAtAnchor(panel, ar, beside) {
		var body = panelBody(panel), r, at;
		panel.style.display = 'block';
		resetPanelHeight(panel, body);
		r = panel.getBoundingClientRect();
		if (beside) {
			// A fly-out with no room to its right flips to the LEFT of the parent row rather than
			// being clamped on top of it -- the clamp alone would slide it back over the words it
			// branches from. Its VERTICAL rule is the viewport, not the anchor.
			var h = fitPanelToViewport(panel);
			var wantLeft = (ar.right + r.width > window.innerWidth - POPUP_EDGE) ? ar.left - r.width : ar.right;
			panel.style.left = Math.max(POPUP_EDGE, Math.min(wantLeft, window.innerWidth - r.width - POPUP_EDGE)) + 'px';
			panel.style.top = Math.max(POPUP_EDGE, Math.min(ar.top, window.innerHeight - h - POPUP_EDGE)) + 'px';
			return null;
		}
		at = panelPlacement(ar, r.width, r.height, window.innerWidth, window.innerHeight);
		if (at.maxHeight != null) { capPanelHeight(panel, body, at.maxHeight, r.height); }
		panel.style.left = at.left + 'px';
		panel.style.top = at.top + 'px';
		return at;
	}
	// For the panels that are NOT hung off a control -- the property popup (opened at a point on the
	// map, or wherever the user dragged it) and the Notes box (centred). There is no anchor to
	// avoid, so the cap is simply the viewport. Returns the height to place with, which is the
	// capped one; the caller must use it rather than its own earlier measurement.
	function fitPanelToViewport(panel) {
		var body = panelBody(panel), avail = window.innerHeight - 2 * POPUP_EDGE, h;
		resetPanelHeight(panel, body);
		h = panel.getBoundingClientRect().height;
		if (h <= avail) { return h; }
		capPanelHeight(panel, body, avail, h);
		return avail;
	}
	// WHERE THE PROPERTY POPUP OPENS, once the user has moved it: exactly where they left it.
	// EPANET's own property window behaves this way and Tom asked for it by name (2026-08-15:
	// "EPANET has an element properties box. But it is draggable... Our UX suffers because our
	// properties box is not draggable"). Null until the first drag, so the automatic placement
	// beside the element (popupAnchorFor()) is what a user who has never dragged it still gets.
	// Session-scoped on purpose: it is a transient view choice, not a project setting, and putting
	// it in the document would mean a colleague opening your file inherits where your screen's
	// popup sat.
	var popupUserPos = null;
	function openPopupAt(sx, sy) {
		var popup = document.getElementById('lpn_popup'), r, h, at;
		if (popupUserPos) { sx = popupUserPos.left; sy = popupUserPos.top; }
		popup.style.left = sx + 'px'; popup.style.top = sy + 'px'; popup.style.display = 'block';
		// Clamp into the viewport (Tom, tall/phone mode: the popup opened partly off-screen).
		// Measured after display:block since an element's size isn't known while display:none.
		// The HEIGHT is capped first (Task 372) and the clamp is then given the capped height: an
		// element with many properties can be taller than the window, and clamping such a box only
		// ever chooses which end of it to lose.
		h = fitPanelToViewport(popup);
		r = popup.getBoundingClientRect();
		at = clampPanel(sx, sy, r.width, h, window.innerWidth, window.innerHeight);
		popup.style.left = at.left + 'px'; popup.style.top = at.top + 'px';
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
	// AN OVERRIDE MAP IS KEYED BY ELEMENT ID, so a rename has to carry it (Task 184). Missing this
	// is silent in the worst way: the scenario's values simply stop applying, the map falls back to
	// Base, and the status bar still counts them -- there is nothing on screen that says a number
	// went away. Renames are cheap and we own the path, which is the same reasoning the "compare
	// with base ID" field records for following a rename.
	// The GROUP comes in with the ids because the key carries it (Task 324) -- and a rename is the
	// one path where getting it wrong would be invisible twice over: it would strand the values
	// under the old key AND hand them to whatever element of the other group answers to the new id.
	function renameOverrides(group, oldId, newId) {
		var oldKey = ovKeyFor(group, oldId), newKey = ovKeyFor(group, newId);
		scenarios.forEach(function (s) {
			if (!s.overrides[oldKey]) { return; }
			s.overrides[newKey] = s.overrides[oldKey];
			delete s.overrides[oldKey];
		});
	}
	// The rename itself, with nothing about the popup in it -- so a BULK rename (applyIdPrefixToAll()
	// below) goes through exactly the same code a hand rename does. A second implementation of this
	// is how a bulk operation quietly forgets one of the six places an id is written.
	function applyNodeRename(oldId, newId) {
		var n = nodeById(oldId);
		n.id = newId;
		renameOverrides('node', oldId, newId);
		nodeEls[newId] = nodeEls[oldId]; delete nodeEls[oldId];
		incidentLinks[newId] = incidentLinks[oldId]; delete incidentLinks[oldId];
		labelsByAnchor[newId] = labelsByAnchor[oldId]; delete labelsByAnchor[oldId];
		nodeEls[newId].circle.setAttribute('data-node', newId);
		doc.links.forEach(function (l) {
			if (l.from === oldId) { l.from = newId; }
			if (l.to === oldId) { l.to = newId; }
		});
		doc.labels.forEach(function (lb) { if (lb.anchorNode === oldId) { lb.anchorNode = newId; } });
	}
	function renameNode(oldId, newId) {
		applyNodeRename(oldId, newId);
		currentPopup = { kind: 'node', id: newId };
		renderNodeFields(newId);
		// lastSolveResult's pressures are keyed by the OLD id -- without a fresh solve, the
		// pressure label would silently vanish for this node until the next unrelated edit.
		scheduleSolve();
	}
	function applyLinkRename(oldId, newId) {
		var l = linkById(oldId);
		l.id = newId;
		renameOverrides('link', oldId, newId);
		// Any OTHER pump referencing this one by curveRef must follow the rename, or its curve
		// silently reverts to nothing (resolveCurvePoints() only matches an exact id).
		doc.links.forEach(function (other) { if (other.curveRef === oldId) { other.curveRef = newId; } });
		linkEls[newId] = linkEls[oldId]; delete linkEls[oldId];
		linkEls[newId].line.setAttribute('data-link', newId);
		linkEls[newId].handles.forEach(function (h) { h.setAttribute('data-link', newId); });
	}
	function renameLink(oldId, newId) {
		applyLinkRename(oldId, newId);
		currentPopup = { kind: 'link', id: newId };
		renderLinkFields(newId);
		scheduleSolve();
	}
	// ---- "Apply to all": re-prefix every element of one kind (Tom, 2026-08-15) ----
	//
	// An ID prefix has always been "future, not retroactive" -- change it and the next junction you
	// draw is N1 while J1..J40 stay as they are. That is the right default (a rename is destructive
	// and an id is referenced from six places), but it left no way at all to say "I meant all of
	// them", which is what you want the day you inherit a model or decide mid-drawing.
	//
	// WHAT IT WILL AND WILL NOT TOUCH, and the rule is deliberately conservative:
	//   * An id ending in DIGITS keeps its digits and swaps its head: J12 -> N12. The number is the
	//     thing the user knows the element by and the thing every note on their desk refers to.
	//   * An id with no trailing number (an imported 'J-TF', a hand-typed 'Tank Farm') is LEFT
	//     ALONE. There is no number to keep, so any rename would be an invention, and these are
	//     exactly the ids somebody chose on purpose.
	//   * A rename that would collide with an id NOT in this batch is skipped rather than resolved
	//     by inventing a number.
	// Both skips are counted and reported, because a silent partial rename is worse than none.
	//
	// THE TWO-PHASE RENAME (everything parks on a temporary id, then takes its real one) is
	// INSURANCE, not a requirement today, and it is worth saying which. A batch is one element type
	// with one prefix, so a member's target is `prefix + its own digits` -- which means any member
	// holding another's target must already start with that prefix, and is therefore not moving at
	// all. There is no cycle to break. It stays because it is four lines and it takes ORDERING out
	// of the reasoning entirely: the day this grows an "apply all six prefixes at once" button,
	// cycles become reachable, and the failure would be a corrupted drawing rather than a refusal.
	function elementsForIdKey(key) {
		return doc.nodes.filter(function (n) { return (LPN_ID_KEY[n.type] || 'J') === key; })
			.concat(doc.links.filter(function (l) { return (LPN_ID_KEY[l.type] || 'L') === key; }));
	}
	function isNodeId(id) { return !!nodeById(id); }
	function applyIdPrefixToAll(key) {
		var pc = EngCalcs.pageConfig || {}, prefix = settings.idPrefixes[key] || key,
			batch = elementsForIdKey(key), moving = [], skipped = 0, taken = {}, highest = 0;
		allIds().forEach(function (id) { taken[id] = true; });
		batch.forEach(function (x) {
			var m = /^(.*?)(\d+)$/.exec(String(x.id));
			if (m && +m[2] > highest) { highest = +m[2]; }
			if (!m) { skipped++; return; }               // no trailing number: nothing to keep
			var want = prefix + m[2];
			if (want !== x.id) { moving.push({ id: x.id, want: want, isNode: isNodeId(x.id) }); }
		});
		// WHICH TARGETS ARE ACTUALLY FREE, settled by iterating to a fixed point rather than in one
		// pass. An id is free if nothing holds it, or if the thing holding it is itself moving away.
		// The catch is that dropping one mover (because ITS target was blocked) re-occupies the id
		// that mover was going to vacate, which can block a second mover -- so one pass can approve
		// a rename that a later decision invalidates. Looping until nothing new is dropped is a few
		// lines and removes the whole class; the alternative is an ordering rule that is right for
		// the cases someone thought of.
		var plan = moving, dropped;
		do {
			dropped = false;
			var vacating = {}, claimed = {};
			plan.forEach(function (st) { vacating[st.id] = true; });
			plan = plan.filter(function (st) {
				var blocked = (taken[st.want] && !vacating[st.want]) || claimed[st.want];
				if (blocked) { skipped++; dropped = true; return false; }
				claimed[st.want] = true;
				return true;
			});
		} while (dropped && plan.length);
		if (!plan.length) {
			setNotice((pc.lpn_prefix_applied || 'Renamed {n} elements. {skipped} were left alone.')
				.replace('{n}', '0').replace('{skipped}', String(skipped)));
			return;
		}
		if (!window.confirm((pc.lpn_confirm_apply_prefix || 'Rename {n} elements so their IDs start with {prefix}? Each one keeps its number.')
			.replace('{n}', String(plan.length)).replace('{prefix}', prefix))) { return; }
		saveUndoSnapshot();
		// Phase 1 parks every one of them on an id nothing can answer to: '#' is rejected by
		// validateNewId()'s rules for a typed id, so no user-authored id can be sitting on one.
		plan.forEach(function (step, i) {
			step.tmp = '#tmp' + i;
			if (step.isNode) { applyNodeRename(step.id, step.tmp); } else { applyLinkRename(step.id, step.tmp); }
		});
		plan.forEach(function (step) {
			if (step.isNode) { applyNodeRename(step.tmp, step.want); } else { applyLinkRename(step.tmp, step.want); }
		});
		// The next element drawn must not land on a number now in use.
		if (nextId[key] === undefined || nextId[key] <= highest) { nextId[key] = highest + 1; }
		if (currentPopup) { closePopup(); }   // it names an id that may no longer exist
		refreshLabelText();
		scheduleSolve();
		saveToStorage();
		setNotice((pc.lpn_prefix_applied || 'Renamed {n} elements. {skipped} were left alone.')
			.replace('{n}', String(plan.length)).replace('{skipped}', String(skipped)));
	}
	function renderNodeFields(nodeId) {
		var n = nodeById(nodeId), fields = document.getElementById('lpn_popup_fields'), pc = EngCalcs.pageConfig || {};
		idField(n.id, function (newId) { renameNode(nodeId, newId); });
		clearFields(fields);
		if (n.type === 'tank') {
			// FIVE INPUTS AND ONE COMPUTED ROW, in the order a person builds a tank: where the
			// bottom sits, how much water is in it right now, how far it can go either way, and how
			// wide it is. The WATER SURFACE is deliberately read-only and derived (Task 248): it is
			// the number the solve actually uses, so the user must be able to see it, but making it
			// a second editable field would be two numbers that have to agree -- the "hidden curve"
			// trap Tom named on the pump (see addLink()).
			unitNumberField(fields, pc.lpn_field_elev || 'Elevation', 'lpn_u_elevhead',
				function () { return n.elev; },
				function (v) { n.elev = v; updateNode(nodeId); refreshPopupIfOpen(); },
				pc.lpn_tank_elev_tip);
			unitNumberField(fields, pc.lpn_field_tank_level || 'Water level', 'lpn_u_elevhead',
				function () { return effective(n, 'level'); },
				function (v) { setProp(n, 'level', v); updateNode(nodeId); refreshPopupIfOpen(); },
				pc.lpn_field_tank_level_tip, { el: n, prop: 'level' });
			unitNumberField(fields, pc.lpn_field_tank_minlevel || 'Lowest water level', 'lpn_u_elevhead',
				function () { return n.minLevel; },
				function (v) { n.minLevel = v; updateNode(nodeId); refreshPopupIfOpen(); },
				pc.lpn_field_tank_minlevel_tip);
			unitNumberField(fields, pc.lpn_field_tank_maxlevel || 'Highest water level', 'lpn_u_elevhead',
				function () { return n.maxLevel; },
				function (v) { n.maxLevel = v; updateNode(nodeId); refreshPopupIfOpen(); },
				pc.lpn_field_tank_maxlevel_tip);
			// The Elevation/Head unit, NOT the pipe-diameter unit, and the tip says so. A tank
			// diameter is a distance across the ground, of the same order as the elevations beside
			// it; reading it in inches or millimetres would put a 15 m tank on screen as 15000.
			unitNumberField(fields, pc.lpn_field_tank_diameter || 'Tank diameter', 'lpn_u_elevhead',
				function () { return n.tankDiameter; },
				function (v) { n.tankDiameter = v; updateNode(nodeId); refreshPopupIfOpen(); },
				pc.lpn_field_tank_diameter_tip);
			readonlyUnitField(fields, pc.lpn_result_head || 'Head', 'lpn_u_elevhead',
				toSI(nodeFixedHead(n), 'lpn_u_elevhead'), pc.lpn_tank_head_tip);
		} else if (n.type === 'reservoir') {
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
				function (v) { setProp(n, 'head', v); updateNode(nodeId); refreshPopupIfOpen(); },
				n.elev || 0, pc.lpn_field_head_tip, { el: n, prop: 'head' });
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
				function () { return effective(n, 'demand'); },
				function (v) { setProp(n, 'demand', v); updateNode(nodeId); refreshPopupIfOpen(); },
				pc.lpn_demand_tip, { el: n, prop: 'demand' });
			if (lastSolveResult && lastSolveResult.pressures[nodeId] !== undefined) {
				readonlyUnitField(fields, pc.lpn_result_head || 'Head', 'lpn_u_elevhead', lastSolveResult.heads[nodeId],
					pc.lpn_result_head_tip);
				readonlyUnitField(fields, pc.lpn_result_pressure || 'Pressure', 'lpn_u_pressure', lastSolveResult.pressures[nodeId]);
			}
		}
		activeField(fields, n);
		pushHereButton(fields, n);
		readonlyField(fields, pc.lpn_field_x || 'X', outwardX(n.x));
		readonlyField(fields, pc.lpn_field_y || 'Y', outwardY(n.y));
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
		if (l.type === 'valve') {
			renderValveFields(fields, l, linkId);
		} else if (l.type === 'pump') {
			renderPumpCurveFields(fields, l, linkId);
		} else {
			unitNumberField(fields, pc.lpn_field_diameter || 'Diameter', 'lpn_u_diameter',
				function () { return effective(l, 'diameter'); },
				function (v) { setProp(l, 'diameter', v); refreshPopupIfOpen(); }, null,
				{ el: l, prop: 'diameter' });
			// Label, symbol and tip all follow settings.method (Task 271). Under Darcy-Weisbach the
			// unit is named too, because e is a length and the bare number would be ambiguous.
			numberFieldPlain(fields,
				roughnessLabel() + (frictionMethod() === 'dw' ? ' (' + unitLabel('lpn_u_roughness') + ')' : ''),
				effective(l, 'roughness'),
				function (v) { setProp(l, 'roughness', v); refreshPopupIfOpen(); }, roughnessTip(),
				{ el: l, prop: 'roughness' });
			// Minor (local) loss coefficient, k_m -- dimensionless, so no unit conversion (same as
			// Roughness above). Defaults from settings.defaults.k at creation (addLink()); editable
			// per-pipe here, same pattern as every other pipe property. Plain-text wording only
			// (no <sub> markup) -- this popup's fields are built via textContent, and the suite's
			// existing "k<sub>m</sub>" label (mphl_total_junction_k) is HTML-bearing, incompatible
			// with that call site; CLAUDE.md's concept-level reuse rule is about wording, not
			// forcing markup into a plain-text slot.
			numberFieldPlain(fields, pc.lpn_field_km || 'Minor (local) loss coefficient, k', effective(l, 'k') || 0,
				function (v) { setProp(l, 'k', v); refreshPopupIfOpen(); }, pc.lpn_field_km_tip,
				{ el: l, prop: 'k' });
			lengthField(fields, l);
		}
		closedField(fields, l, linkId);
		activeField(fields, l);
		pushHereButton(fields, l);
		if (lastSolveResult && lastSolveResult.flows[linkId] !== undefined) {
			readonlyUnitField(fields, pc.lpn_result_flow || 'Flow', 'lpn_u_flow', shownFlow(lastSolveResult.flows[linkId]));
			// A pump has no diameter (Tom, 2026-07-30: "how can a pump have a velocity if it has no
			// diameter?") -- js/lpn-solver.js can only compute velocity = Q/area from a real
			// diameter, so a pump's stored velocity is always the fallback 0, which reads as "no
			// flow" and is actively misleading. Velocity is a pipe-only result.
			if (l.type !== 'pump') {
				readonlyUnitField(fields, pc.lpn_result_velocity || 'Velocity', 'lpn_u_velocity', lastSolveResult.velocities[linkId]);
			}
			// Head loss, for a pump too: lpn-solver.js reports a pump's contribution as a NEGATIVE
			// head loss, which is the whole of how a head gain is expressed on this page.
			readonlyUnitField(fields, pc.lpn_result_headloss || 'Head loss', 'lpn_u_elevhead', shownHeadloss(l, lastSolveResult.headlosses[linkId]));
			// Gradient is per unit of pipe LENGTH, so it is a pipe-only result -- a pump has no
			// length to spread its head over. linkLengthSI(), not the declared length: see Task 255.
			if (l.type !== 'pump' && linkLengthSI(l)) {
				readonlyUnitField(fields, pc.lpn_result_gradient || 'Head loss gradient', 'lpn_u_gradient',
					shownHeadloss(l, lastSolveResult.headlosses[linkId]) / linkLengthSI(l), pc.lpn_result_gradient_tip);
			}
		}
		tipsIn(fields);
	}
	// THE VALVE POPUP. Its shape changes with the type, and that is the point rather than an
	// awkwardness: a valve's SETTING is a different physical quantity per type, so the field has a
	// different label AND a different unit selector behind it (see js/lpn-epanet.js for the three
	// conventions and why getting one wrong is silent). Rendering one "Setting" box in whatever
	// unit happened to be last would be the trap this whole task is about.
	// EVERY WRITE HERE GOES THROUGH setProp, AND EVERY ROW CARRIES ITS `ov`. Both halves were missing
	// until 2026-08-14 and both were user-reachable: the setters wrote l._setting / l._diameter / l._k
	// directly, which inside a scenario edits BASE under every other scenario at once -- the exact
	// failure setProp's own comment predicts in words -- and with no `ov` a valve was the only
	// element type in the page with no scenario marker on any row at all.
	//
	// HOW IT GOT THROUGH, because the mechanism matters more than the bug: valves (Task 248 phase 2)
	// and scenarios (Task 184) were built in parallel worktrees the same day with DISJOINT FILE
	// TERRITORY, exactly as CLAUDE.md requires -- and they still collided, because they shared a
	// SEAM rather than a file. Neither harness could see it either: scenario-harness.js never says
	// "valve" and valve-harness.js never says "scenario". The file rule protects files; nothing
	// protected the seam. dev/scripts/scenario_seam_check.php does now.
	function renderValveFields(fields, l, linkId) {
		var pc = EngCalcs.pageConfig || {}, vt = (l.valveType || 'TCV').toUpperCase();
		selectFieldPlain(fields, pc.lpn_field_valve_type || 'Valve type', [
			['TCV', pc.lpn_valve_type_tcv || 'Throttle (TCV)'],
			['PRV', pc.lpn_valve_type_prv || 'Pressure reducing (PRV)'],
			['PSV', pc.lpn_valve_type_psv || 'Pressure sustaining (PSV)'],
			['FCV', pc.lpn_valve_type_fcv || 'Flow control (FCV)']
		], vt, function (v) {
			if (v === vt) { return; }
			saveUndoSnapshot();
			l.valveType = v;
			// The moment an active type is chosen is the moment the 664 KB engine becomes necessary,
			// and the moment the user is most likely to still be online. See warmEpanetEngine().
			if (EngCalcs.lpnValveIsNative && !EngCalcs.lpnValveIsNative({ type: 'valve', valveType: v })) {
				warmEpanetEngine('valve');
			}
			// RE-SEEDED, NOT CARRIED ACROSS. The old number was a pressure, a flow or a loss
			// coefficient, and none of the three means anything as one of the other two -- 60 psi
			// read as a loss coefficient of 60 is a valve nobody built. The tip on the setting
			// field says this happens, so the change is not a surprise.
			// BASE, and every scenario's override on `setting` is DROPPED with it. The brief that
			// found the other seam defects flagged this line as a judgement call rather than
			// guessing at it, and the answer follows from what is overridable and what is not:
			// `valveType` is NOT in LPN_OVERRIDABLE, so a type change is Base-wide by construction.
			// A setting that belongs to a type must therefore be Base-wide too.
			//
			// And the overrides have to go, which is the part that is easy to miss. The comment
			// above says a number carried across a type change is "a valve nobody built" -- 60 psi
			// read as a loss coefficient of 60. That is exactly as true of a scenario's override as
			// of Base's own value, and the override would have SURVIVED, silently, as a stale
			// pressure sitting under a valve that now wants a flow.
			l._setting = defaultValveSetting(v);   // base-write: valveType is Base-owned, so the setting that belongs to it is too
			scenarios.forEach(function (sc) {
				var ovv = sc.overrides[ovKey(l)];
				if (ovv) { delete ovv.setting; }
			});
			refreshPopupIfOpen();
			scheduleSolve();
		}, pc.lpn_field_valve_type_tip);
		// GPV IS ABSENT FROM THAT LIST ON PURPOSE. A general purpose valve's whole behaviour is a
		// head-loss CURVE, and this page has no curve element outside the pump. Offering the type
		// with nowhere to enter the curve would be a control that does nothing. An imported GPV is
		// reported and comes in as an open pipe (js/lpn-inp.js).
		if (vt === 'PRV' || vt === 'PSV') {
			unitNumberField(fields, pc.lpn_field_valve_setting_pressure || 'Pressure setting', 'lpn_u_pressure',
				function () { return effective(l, 'setting'); },
				function (v) { setProp(l, 'setting', v); refreshPopupIfOpen(); },
				pc.lpn_field_valve_setting_pressure_tip, { el: l, prop: 'setting' });
		} else if (vt === 'FCV') {
			unitNumberField(fields, pc.lpn_field_valve_setting_flow || 'Flow setting', 'lpn_u_flow',
				function () { return effective(l, 'setting'); },
				function (v) { setProp(l, 'setting', v); refreshPopupIfOpen(); },
				pc.lpn_field_valve_setting_flow_tip, { el: l, prop: 'setting' });
		} else {
			numberFieldPlain(fields, pc.lpn_field_valve_setting_loss || 'Loss coefficient',
				effective(l, 'setting') || 0,
				function (v) { setProp(l, 'setting', v); refreshPopupIfOpen(); },
				pc.lpn_field_valve_setting_loss_tip, { el: l, prop: 'setting' });
		}
		unitNumberField(fields, pc.lpn_field_diameter || 'Diameter', 'lpn_u_diameter',
			function () { return effective(l, 'diameter'); },
			function (v) { setProp(l, 'diameter', v); refreshPopupIfOpen(); },
			pc.lpn_field_valve_diameter_tip, { el: l, prop: 'diameter' });
		// A TCV GETS NO SEPARATE MINOR LOSS, and that is EPANET's behaviour rather than a
		// simplification of ours: it ignores the [VALVES] minor-loss column for a throttle valve,
		// whose loss is its setting alone (measured -- see EngCalcs.lpnLinkK). A box here would be
		// a number the user types and neither engine reads.
		if (vt !== 'TCV') {
			numberFieldPlain(fields, pc.lpn_field_km || 'Minor (local) loss coefficient, k',
				effective(l, 'k') || 0,
				function (v) { setProp(l, 'k', v); refreshPopupIfOpen(); },
				pc.lpn_field_valve_km_tip, { el: l, prop: 'k' });
		}
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
			try { noteTextWidth(le, le.text.getBBox().width); } catch (err) { /* pre-layout measurement can throw; stale width stands */ }
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
			try { noteTextWidth(le, le.text.getBBox().width); } catch (err) { /* pre-layout measurement can throw; stale width stands */ }
			updateLabelGeometry(labelId);
			applyLabelVisibility();   // the size IS this label's own hide threshold (Task 340)
			saveToStorage();
		});
		sizeLabel.textContent = (pc.lpn_field_text_size || 'Size ×') + ' ';
		sizeLabel.appendChild(sizeInput);
		fields.appendChild(sizeLabel);
		fields.appendChild(document.createElement('br'));
		// Task 340's escape hatch, and it sits immediately under the size because the size IS the
		// threshold this overrides: a title block at 3x survives to 3x the map width, and this is
		// the label that must survive whatever the reader does. Undefined on every existing label,
		// so nothing changes shape on upgrade.
		var alwaysLabel = document.createElement('label'), alwaysInput = document.createElement('input');
		alwaysInput.type = 'checkbox';
		alwaysInput.checked = !!lb.alwaysShow;
		alwaysInput.addEventListener('change', function () {
			saveUndoSnapshot();
			lb.alwaysShow = alwaysInput.checked;
			applyLabelVisibility();
			saveToStorage();
		});
		alwaysLabel.textContent = (pc.lpn_field_show_always || 'Always show') + ' ';
		alwaysLabel.appendChild(alwaysInput);
		fields.appendChild(alwaysLabel);
		fields.appendChild(document.createElement('br'));
		// ---- Task 337: Bold, and rotation with its two convenience buttons ----
		// Redrawing after either property changes goes through ONE function, because bold and
		// rotation both invalidate the same three things and in the same order: the measured width
		// (bold glyphs are wider), then the geometry that is computed from it, then the visibility
		// threshold that reads the geometry.
		function relayoutThisLabel() {
			var le = labelEls[labelId];
			le.text.setAttribute('style', textLabelStyle(lb));
			try { noteTextWidth(le, le.text.getBBox().width); } catch (err) { /* pre-layout measurement can throw; stale width stands */ }
			updateLabelGeometry(labelId);
			applyLabelVisibility();
			saveToStorage();
		}
		var boldLabel = document.createElement('label'), boldInput = document.createElement('input');
		boldInput.type = 'checkbox';
		boldInput.checked = !!lb.bold;
		boldInput.addEventListener('change', function () {
			saveUndoSnapshot();
			lb.bold = boldInput.checked;
			relayoutThisLabel();
		});
		boldLabel.textContent = (pc.lpn_field_text_bold || 'Bold') + ' ';
		boldLabel.appendChild(boldInput);
		fields.appendChild(boldLabel);
		fields.appendChild(document.createElement('br'));
		// THE BOX IS THE CONTROL AND THE BUTTONS ONLY FILL IT (Tom, 2026-08-14). A control whose
		// only input is "match a pipe" is unusable on a label nowhere near a pipe, and a preset is
		// what people reach for nine times in ten -- so free numeric entry first, a preset list
		// hanging off it, and the pipe as a convenience beside it.
		var rotLabel = document.createElement('label'), rotInput = document.createElement('input'),
			presets = document.createElement('datalist'), presetId = 'lpn_rot_presets';
		presets.id = presetId;
		[0, 30, 45, 60, 90, -30, -45, -60].forEach(function (d) {
			var o = document.createElement('option');
			o.value = String(d);
			presets.appendChild(o);
		});
		rotInput.type = 'number'; rotInput.step = 'any'; rotInput.setAttribute('list', presetId);
		rotInput.value = textLabelRotation(lb);
		function setRotation(deg) {
			var v = normalizeDeg(+deg);
			if (!isFinite(v)) { rotInput.value = textLabelRotation(lb); return; }
			if (v === textLabelRotation(lb)) { rotInput.value = v; return; }
			saveUndoSnapshot();
			lb.rot = v;
			rotInput.value = v;
			relayoutThisLabel();
		}
		rotInput.addEventListener('change', function () { setRotation(rotInput.value); });
		rotLabel.textContent = (pc.lpn_field_text_rotation || 'Rotation') + ' ';
		rotLabel.appendChild(rotInput);
		rotLabel.appendChild(presets);
		fields.appendChild(rotLabel);
		var matchBtn = document.createElement('button');
		matchBtn.type = 'button';
		matchBtn.textContent = pc.lpn_field_text_match_pipe || 'Match pipe';
		matchBtn.addEventListener('click', function () {
			// Read at the label's RENDERED point, which for an anchored label is its node plus its
			// offset -- not lb.x/lb.y, which is the offset alone and would find the pipe nearest
			// the map origin.
			var a = nearestLinkAngle(an ? an.x + lb.x : lb.x, an ? an.y + lb.y : lb.y);
			if (a === null) { return; }   // no pipes drawn: nothing to match, and nothing to say
			setRotation(a);
		});
		fields.appendChild(matchBtn);
		// +180 and nothing else. It exists because the readable normalisation in readableAngle()
		// picks the half-turn that reads left to right, and on a near-vertical pipe either choice
		// is defensible -- so the user gets the other one on request, rather than an automatic rule
		// that is right most of the time and unarguable when it is not.
		var flipBtn = document.createElement('button');
		flipBtn.type = 'button';
		flipBtn.textContent = pc.lpn_field_text_flip || 'Flip';
		flipBtn.addEventListener('click', function () { setRotation(textLabelRotation(lb) + 180); });
		fields.appendChild(flipBtn);
		fields.appendChild(document.createElement('br'));
		readonlyField(fields, pc.lpn_field_x || 'X', outwardX(an ? an.x + lb.x : lb.x));
		readonlyField(fields, pc.lpn_field_y || 'Y', outwardY(an ? an.y + lb.y : lb.y));
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
	// Open/Closed link state (ROADMAP Task 146.07). Tom, 2026-07-29: explicitly NOT a "valve" and
	// NOT modelled by abusing the minor-loss coefficient -- a plain boolean, kept small.
	//
	// Everything under this checkbox already existed and was simply unreachable: `_status` is set to
	// 'open' at addLink(), serialized with the project, listed in LPN_OVERRIDABLE, read by
	// assembleModel() through effective(), honoured in four places by js/lpn-solver.js, and already
	// parsed from an EPANET .inp by js/lpn-inp.js. This function is the whole feature.
	//
	// The checkbox says "Closed", not "Open", although 'open' is the stored default. The state worth
	// SEEING is the exceptional one: a ticked box next to the word Closed reads as a deliberate act,
	// where an unticked box next to "Open" would make every ordinary pipe look like something had
	// been switched off. Same reason the map dashes closed links rather than styling open ones.
	//
	// Offered on pumps as well as pipes: the solver's status check is on the link, not the type, and
	// EPANET can close a pump too. It sits OUTSIDE renderLinkFields' pipe/pump branch for that
	// reason -- a pump renders a curve table instead of diameter/roughness, but still gets this.
	function closedField(fields, l, linkId) {
		var pc = EngCalcs.pageConfig || {}, label = document.createElement('label'),
			input = document.createElement('input');
		input.type = 'checkbox';
		input.checked = effective(l, 'status') === 'closed';
		input.addEventListener('change', function () {
			saveUndoSnapshot();
			setProp(l, 'status', input.checked ? 'closed' : 'open');
			// rebuildLink() rather than a classList toggle: the dashed/solid state is applied in
			// buildLinkEls(), so going through the one builder keeps a single source of truth for
			// how a link is drawn. Then solve -- closing a pipe can isolate a node, which the
			// solver's pre-solve diagnostics already name by id.
			// afterPropertyEdit() rather than rebuildLink + scheduleSolve by hand. This row DREW an
			// override marker and then never refreshed it, so ticking Closed inside a scenario left
			// the marker beside it unticked -- the page contradicting itself in the same popup. The
			// seam exists precisely so a field cannot forget a third of the job; this one was not
			// reaching it. refreshPopupIfOpen() re-renders so the marker catches up.
			afterPropertyEdit(l);
			refreshPopupIfOpen();
		});
		// The text goes in its own <span>, NOT straight into the <label>: setFieldLabel() assigns
		// textContent, which would wipe a checkbox already appended to the same element. Box first,
		// then words -- matching the "Auto" checkbox in lengthField() rather than inventing a second
		// order for the same control shape on the same popup.
		var text = document.createElement('span');
		setFieldLabel(text, pc.lpn_field_closed || 'Closed', pc.lpn_field_closed_tip);
		label.appendChild(input);
		label.appendChild(document.createTextNode(' '));
		label.appendChild(text);
		fields.appendChild(label);
		fields.appendChild(document.createElement('br'));
		// Base's status is reported as an answer to the word on THIS box ("Closed"), not as the
		// stored token: "Base: open" beside a box labelled Closed is one negation more than a
		// reader should have to do, and it needs no key of its own.
		overrideMarker(fields, l, 'status', function (v) { return formatPropValue(v === 'closed'); });
	}
	// A dropdown field. `options` is [[value, label], ...]. The only popup control that is not a
	// number or a checkbox, added for the valve type (Task 248 phase 2) -- a valve's type decides
	// what its other fields MEAN, so it cannot be a free-text or numeric input.
	function selectFieldPlain(fields, labelText, options, current, onChange, tip) {
		var label = document.createElement('label'), sel = document.createElement('select'), i, o;
		for (i = 0; i < options.length; i++) {
			o = document.createElement('option');
			o.value = options[i][0];
			o.textContent = options[i][1];
			if (options[i][0] === current) { o.selected = true; }
			sel.appendChild(o);
		}
		sel.addEventListener('change', function () { onChange(sel.value); });
		setFieldLabel(label, labelText, tip);
		label.appendChild(sel);
		fields.appendChild(label);
		fields.appendChild(document.createElement('br'));
	}
	function numberFieldPlain(fields, labelText, value, onChange, tip, ov) {
		var label = document.createElement('label'), input = document.createElement('input');
		input.type = 'number'; input.value = value;
		input.addEventListener('change', function () { onChange(+input.value); completeEdit(ov); });
		setFieldLabel(label, labelText, tip);
		label.appendChild(input);
		fields.appendChild(label);
		fields.appendChild(document.createElement('br'));
		if (ov) { overrideMarker(fields, ov.el, ov.prop); }   // and see completeEdit() on the setter
	}
	// ---- `active`: an ordinary overridable boolean, and the whole of how topology varies ----
	// Task 184's corrected rule -- MEMBERSHIP is overridable, IDENTITY is not. A proposed loop lives
	// in Base inactive and a scenario overrides it active; deleting inside a scenario sets it
	// inactive. No new delta type and no second element set, which is exactly why the "with the new
	// 12 inch loop vs. without" case stays coherent.
	// Offered on every node and every link, in Base too: unticking here in Base is how a proposed
	// element is parked without deleting it.
	// THE EVERYDAY PUSH, in the element's own popup (ROADMAP Task 317). Same action and the same two
	// strings as the scenario menu's row -- it IS that action, narrowed by WHERE the button is, so a
	// second label would be two names for one thing in 27 languages.
	// Base only, and ABSENT rather than disabled outside Base: the menu row is disabled there
	// because a menu teaches its own vocabulary by staying the same shape, but a popup is a list of
	// this element's properties and a permanently dead button on every one of them is noise. It is
	// also absent when there are no scenarios, where the action has nothing to act on.
	function pushHereButton(fields, el) {
		var pc = EngCalcs.pageConfig || {};
		if (!el || !inBaseScenario() || scenarios.length < 2) { return; }
		var btn = document.createElement('button');
		btn.type = 'button';
		btn.textContent = pc.lpn_scenario_push_btn || 'Apply Base values to all scenarios';
		helpTip(btn, pc.lpn_scenario_push_tip);
		btn.addEventListener('click', function () {
			pushBaseToScenarios(el);
			refreshPopupIfOpen();
		});
		fields.appendChild(btn);
		fields.appendChild(document.createElement('br'));
	}
	function activeField(fields, el) {
		var pc = EngCalcs.pageConfig || {}, label = document.createElement('label'),
			input = document.createElement('input'), text = document.createElement('span');
		input.type = 'checkbox';
		input.checked = effective(el, 'active') !== false;
		input.addEventListener('change', function () {
			saveUndoSnapshot();
			setProp(el, 'active', input.checked);
			afterPropertyEdit(el);
			refreshPopupIfOpen();
		});
		// Box first, then words, in its own <span> -- setFieldLabel() assigns textContent, which
		// would wipe a checkbox already appended to the same element. Same order as closedField().
		setFieldLabel(text, pc.lpn_field_active || 'In this network', pc.lpn_field_active_tip);
		label.appendChild(input);
		label.appendChild(document.createTextNode(' '));
		label.appendChild(text);
		fields.appendChild(label);
		fields.appendChild(document.createElement('br'));
		overrideMarker(fields, el, 'active');
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
	// THE SCENARIOS RIDE WITH THE DOCUMENT (ROADMAP Task 184: "one document, one undo stack"), which
	// is the one-line change the container's own comment anticipated. They have to: an override edit
	// changes what the map shows and what the solver reads exactly as an element edit does, and a
	// stack that restored the elements while leaving the overrides behind would undo half of a
	// scenario-side change -- or, after undoing a Base-side deletion, resurrect an element whose
	// overrides the deletion had purged.
	function saveUndoSnapshot() {
		markEdited(); // one seam, because every real mutation snapshots before it changes anything
		undoStack.push(JSON.parse(JSON.stringify({ doc: doc, scenarios: scenarios, active: project.activeScenario })));
		if (undoStack.length > UNDO_LIMIT) { undoStack.shift(); }
	}
	// Switching projects drops the undo history (Task 146.08). The stack holds snapshots of the
	// OUTGOING project's doc; leaving them in place would let one Undo in the newly-opened project
	// paste the previous project's network over it -- silently, and with no way back.
	function clearUndo() { undoStack.length = 0; }
	function undo() {
		if (undoStack.length === 0) { return; }
		var snap = undoStack.pop();
		doc = snap.doc;
		scenarios = snap.scenarios;
		// Restored too, because a snapshot taken in one scenario and undone from another would
		// otherwise leave the map showing a scenario the restored values were never about.
		if (scenarios.some(function (s) { return s.id === snap.active; })) { project.activeScenario = snap.active; }
		recountNextId();
		closePopup(); // whatever it referenced may no longer exist post-undo (e.g. undoing an Add)
		buildDom();
		updateEmptyHint();
		refreshScenarioStatus();
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
	// THIS FUNCTION IS THAT EDGE.
	//
	// Length is DECLARATIVE: one map unit IS one foot or one metre by declaration, with no
	// conversion anywhere in the document, the popup or the labels. Hand that declared number to an
	// SI solver and a pipe drawn and labelled 1000 ft solves as 1000 METRES while the elevation,
	// head, demand and diameter around it are all converted -- head loss 3.281x too high, and
	// 3.281 = 1 ft/m is the fingerprint. SI users are never affected, because there the factor is 1.
	//
	// **NEITHER ENGINE CAN CATCH THIS AND NEITHER CAN A SOLVER HARNESS.** validate.js and
	// validate_epanet.js feed the SOLVER directly in SI, so they never cross this boundary, and the
	// EPANET path reads the same model, so both engines are wrong together and agree perfectly. Any
	// check of this must compare against a hand-computed US case, never against the other engine.
	//
	// Do NOT "fix" a future variant by making the map metric or by converting the stored length.
	// The stored number stays declarative; only the handoff converts.
	function linkLengthSI(l) {
		return effective(l, 'length') / unitFactor('lpn_u_length');
	}
	var lastSolveResult = null;
	// AN INACTIVE ELEMENT IS NOT IN THE NETWORK (Task 184). `active` is an ordinary overridable
	// boolean, so this is the whole of how a scenario varies topology: the proposed loop is in the
	// document, drawn greyed, and simply absent from the model handed to the solver.
	// A link whose END is inactive goes with it, or the solver is handed the dangling reference its
	// own diagnostics exist to complain about -- and a "delete this node" in a scenario would report
	// an error instead of doing what it said.
	function isActive(el) { return effective(el, 'active') !== false; }
	function assembleModel() {
		var live = {};
		doc.nodes.forEach(function (n) { if (isActive(n)) { live[n.id] = true; } });
		var nodes = doc.nodes.filter(isActive).map(function (n) {
			if (n.type === 'tank') {
				// A tank passes BOTH its resolved surface head (what the steady-state solve reads,
				// see EngCalcs.lpnIsFixedHead) AND its vessel geometry, which the native solver
				// ignores and js/lpn-epanet.js writes into [TANKS]. All five are lengths in the
				// Elevation/Head unit, the vessel diameter included -- it is a vertical distance's
				// unit because it is measured on the same staff, not a pipe diameter.
				return {
					id: n.id, type: n.type,
					elev: toSI(n.elev || 0, 'lpn_u_elevhead'),
					head: toSI(nodeFixedHead(n), 'lpn_u_elevhead'),
					level: toSI(effective(n, 'level') || 0, 'lpn_u_elevhead'),
					minLevel: toSI(n.minLevel || 0, 'lpn_u_elevhead'),
					maxLevel: toSI(n.maxLevel || 0, 'lpn_u_elevhead'),
					diameter: toSI(n.tankDiameter || 0, 'lpn_u_elevhead')
				};
			}
			return n.type === 'reservoir'
				// Reservoirs pass a resolved head: the solver wants a real number, but the document
				// deliberately stores that field blank when the head just follows the elevation (see
				// reservoirHead()). Copying rather than filling the blank in keeps the document's
				// "still following elevation" state intact.
				? { id: n.id, type: n.type, elev: toSI(n.elev || 0, 'lpn_u_elevhead'), head: toSI(reservoirHead(n), 'lpn_u_elevhead') }
				: { id: n.id, type: n.type, elev: toSI(n.elev || 0, 'lpn_u_elevhead'), demand: toSI(effective(n, 'demand') || 0, 'lpn_u_flow'), emitter: effective(n, 'emitter') };
		});
		// Both halves of this line are load-bearing and arrived from different worktrees on the
		// same day. The FILTER is Task 184: an inactive element, or a link whose end is inactive,
		// is not in this scenario's network at all. The `var out` is Task 248 phase 2: a valve
		// needs fields added after the common ones, so the object is named rather than returned
		// inline.
		var links = doc.links.filter(function (l) {
			return isActive(l) && live[l.from] && live[l.to];
		}).map(function (l) {
			var out = {
				id: l.id, type: l.type, from: l.from, to: l.to,
				// roughness (Hazen-Williams C) and k are dimensionless, so they cross this boundary
				// unchanged -- the same reason they use rawLine() rather than numLine() on the map.
				diameter: toSI(effective(l, 'diameter') || 0, 'lpn_u_diameter'), roughness: roughnessSI(l),
				length: linkLengthSI(l), status: effective(l, 'status'), k: effective(l, 'k')
			};
			// THE FITTED PUMP CURVE IS DERIVED HERE AND NOWHERE ELSE (Task 390 step 5). It used to
			// be read off the link, where a stored copy had to be repaired on every unit switch.
			// Only a pump gets one: js/lpn-solver.js and js/lpn-epanet.js both test the type first,
			// so putting h0/a/b on a pipe only ever meant three undefined properties per link.
			if (l.type === 'pump') {
				var fit = pumpFit(l);
				out.h0 = fit.h0; out.a = fit.a; out.b = fit.b;
			}
			if (l.type === 'valve') {
				// THE SETTING CROSSES THIS BOUNDARY IN THE UNIT ITS TYPE NAMES, which is the whole
				// reason a valve needs a line here at all. A pressure setting is a head in metres,
				// a flow setting is m3/s, and a throttle's loss coefficient is dimensionless and
				// must NOT be put through a converter -- feeding it to toSI('lpn_u_pressure') would
				// divide a loss coefficient by 1.42 under the US preset and the network would still
				// solve. Downstream, js/lpn-epanet.js converts each one again into EPANET's own
				// convention; this half only has to get it into SI.
				out.valveType = (l.valveType || 'TCV').toUpperCase();
				out.length = 0;
				if (out.valveType === 'PRV' || out.valveType === 'PSV') {
					out.setting = toSI(effective(l, 'setting') || 0, 'lpn_u_pressure');
				} else if (out.valveType === 'FCV') {
					out.setting = toSI(effective(l, 'setting') || 0, 'lpn_u_flow');
				} else {
					out.setting = effective(l, 'setting') || 0;
				}
			}
			return out;
		});
		return { nodes: nodes, links: links, method: frictionMethod(), visc: 1.007e-6, emitterExponent: settings.emitterExponent };
	}
	function diagIssueText(issue) {
		var pc = EngCalcs.pageConfig || {};
		if (issue.code === 'no-fixed-head') { return pc.lpn_diag_no_fixed_head || 'Add a reservoir or a tank. The network needs at least one known water level before it can be solved.'; }
		if (issue.code === 'dangling-link') { return (pc.lpn_diag_dangling_link || 'A pipe or pump connects to a node that no longer exists:') + ' ' + issue.ids.join(', '); }
		if (issue.code === 'unreachable') { return (pc.lpn_diag_unreachable || 'These nodes have no path to a reservoir:') + ' ' + issue.ids.join(', '); }
		// NAMES THE VALVES, which is the entire reason this page keeps its own diagnostics instead
		// of surfacing EPANET's numeric error codes. A user staring at a drawing can act on "V3".
		if (issue.code === 'valve-needs-epanet') { return (pc.lpn_diag_valve_needs_epanet || 'These valves open and close on their own, and only the EPANET engine can compute them. The EPANET engine could not be loaded, so these results are missing:') + ' ' + issue.ids.join(', '); }
		if (issue.code === 'valve-on-fixed-head') { return (pc.lpn_diag_valve_on_fixed_head || 'These valves are joined straight onto a reservoir or a tank, which already sets the water level there, so there is nothing left for the valve to control. Put a short pipe between them:') + ' ' + issue.ids.join(', '); }
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
	// ---- label prefixes and suffixes (ROADMAP Task 333) ----
	//
	// A prefix makes any SUBSET of a stacked label self-describing, which is the whole reason the
	// per-field colours could go: a bare stack of numbers is only readable while all of it is
	// present, because taking a line away leaves the reader no way to tell which quantity survived.
	//
	// The default set: Q flow and demand, V velocity, S gradient, H head, P pressure, Z elevation,
	// Hl head loss, km minor loss, C/n/e roughness, blank diameter, blank length, blank ID.
	// Elevation is Z, not E: Z is the surveyor's and the hydraulic engineer's letter for a vertical
	// ordinate, and it does not collide with the E that Darcy-Weisbach roughness would want.
	//
	// A PREFIX ONLY HAS TO BE UNAMBIGUOUS IN ITS SLOT, not globally unique. A link's velocity line
	// and a node's pressure line are different slots, so V and P doing double duty elsewhere costs
	// no reader anything.
	//
	// BLANK FOR DIAMETER AND LENGTH IS DELIBERATE: those are the two a reader identifies from the
	// magnitude and its unit, so a prefix would be noise on the fields with the least room.
	//
	// BLANK FOR ID, because the letter is already there: an ID is generated as
	// settings.idPrefixes[key] + n, so a junction is literally named 'J12' and a prefix would print
	// 'J J12'. The box still exists on that row for the user who renames their junctions to '12'.
	//
	// THE '=' IS PART OF THE PREFIX STRING, NOT A SEPARATOR THE PAGE ADDS. The prefix is printed
	// exactly as typed, hard against the number, which is what lets someone type 'Q ', 'Q:' or
	// nothing at all and get precisely that. The blanket separator is a different thing: it goes
	// BETWEEN values, not between a prefix and its value.
	var LPN_DEFAULT_LABEL_PREFIX = {
		node: { id: '', demand: 'Q=', head: 'H=', pressure: 'P=', elev: 'Z=' },
		link: { id: '', diameter: '', length: '', km: 'km=', flow: 'Q=', velocity: 'V=', headloss: 'Hl=', gradient: 'S=' }
	};
	// Roughness is the one dynamic default: the symbol IS the friction method (C, n or e), so it
	// follows the method selector rather than being frozen at the moment defaults were built.
	function labelDefaultPrefix(group, field) {
		if (group === 'link' && field === 'roughness') { return roughnessSymbol() + '='; }
		var m = LPN_DEFAULT_LABEL_PREFIX[group] || {};
		return typeof m[field] === 'string' ? m[field] : '';
	}
	function labelDefaultSuffix() { return ''; }
	// undefined -> the default; '' -> the user's own answer of "none". See defaultLabelSettings().
	function labelPrefixFor(group, field) {
		var m = (labelSettings.prefix || {})[group] || {};
		return typeof m[field] === 'string' ? m[field] : labelDefaultPrefix(group, field);
	}
	function labelSuffixFor(group, field) {
		var m = (labelSettings.suffix || {})[group] || {};
		return typeof m[field] === 'string' ? m[field] : labelDefaultSuffix();
	}
	// WHAT THE BLANKET SEPARATOR SEPARATES: one value from the NEXT value on the same line (Tom,
	// 2026-08-15: "Make the blanket separator be what comes between multiple labels on a link.
	// (', ', ' ', '|')"). Not the prefix from its number -- that gap, if wanted, is typed into the
	// prefix itself.
	function labelSeparator() {
		return typeof labelSettings.separator === 'string' ? labelSettings.separator : ' ';
	}
	// Wraps a built line's text in its field's prefix/suffix. Applied HERE, to the finished line,
	// and never inside numLine()/rawLine(): the extrema comparison upstream of both works on the
	// rounded NUMBER, so affixing afterwards is what guarantees a prefix can never change which
	// value is marked highest or lowest.
	// THE AFFIXES ARE THEIR OWN SEGMENTS, and that is what keeps an extrema mark the length of the
	// NUMBER (Tom, 2026-08-15, of a mark spanning a whole line: "The underline needs to be only as
	// long as the ID"). A mark that covers 'Q=749.94' starts at the label's left edge, which in a
	// stacked label is exactly where the line above would be underlined -- so it reads as belonging
	// to the wrong row. Marking '749.94' alone indents the mark past the prefix, which says which
	// row it belongs to without any convention to learn.
	//
	// `line.text` is still the whole thing, because that is what a reader of the code (and every
	// harness) means by "what does this label say".
	function affix(group, field, line) {
		var p = labelPrefixFor(group, field), s = labelSuffixFor(group, field);
		line.parts = [];
		if (p) { line.parts.push({ text: p }); }
		line.parts.push({ text: line.text, decoration: line.decoration });
		if (s) { line.parts.push({ text: s }); }
		line.text = p + line.text + s;
		return line;
	}
	// A field line's drawable segments. A line that never went through affix() (the empty
	// placeholder) is its own single segment.
	function segmentsOf(line) { return line.parts || [line]; }
	// A label the user has dragged. n.lx/l.lx is the manual offset; the same test already decides
	// whether collision avoidance may move a label and whether the short-pipe rule applies to it.
	function labelIsDragged(x) { return x.lx !== undefined || x.ly !== undefined; }
	// The field lines as ROWS OF SEGMENTS for setMultilineText().
	//
	// A LINK LABEL IS ONE LINE UNLESS DRAGGED; A NODE LABEL IS ALWAYS A STACK (Tom, 2026-08-15,
	// after seeing both: "I think that either junction labels in home position should be multiline
	// or it should be a project toggle. Probably just multiline.").
	//
	// The asymmetry is not a compromise, it is the geometry. A link label has to lie along a PIPE
	// and compete with everything else strung out around that pipe, so one line is what buys it
	// room -- which is the whole argument for concatenating in the first place. A node label hangs
	// off a POINT with open space above and below it, where a stack is the more readable shape and
	// costs nothing. And a node carries up to five fields against a link's typical two, so the
	// one-line form is where it hurts most.
	//
	// A DRAGGED link label stacks too: it has been placed deliberately, in space its author chose,
	// which is the same reading of a drag that exempts it from the short-pipe rule and from the
	// collision nudge. Double-clicking sends it home and back to one line.
	//
	// The separator is its own SEGMENT rather than being appended to the value before it, so that an
	// extrema mark underlines the number alone and never the punctuation after it.
	function composeRows(lines, stacked) {
		if (stacked || lines.length < 2) { return lines.map(segmentsOf); }
		var sep = labelSeparator(), row = [];
		lines.forEach(function (line, i) {
			if (i) { row.push({ text: sep }); }
			row = row.concat(segmentsOf(line));
		});
		return [row];
	}
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
	// One line of a numeric label field: the number alone, decorated
	// with a high/low tick when it ties the network-wide max/min for that field
	// (fieldExtrema()/decorationFor() above, drawn as the segment's own text-decoration). Whatever names the
	// quantity is added afterwards by affix(), never here -- see its comment.
	// `suffix` here is the UNIT-DERIVED one, not the user's: the head loss gradient's '%' (Tom,
	// 2026-08-14: "we are omitting all other units as excessively redundant, I think that the % is
	// crucial"). It stays automatic rather than becoming a default in labelSettings.suffix because
	// it is read from the units strip on every rebuild -- this family also offers plain rise/run,
	// where the same token would be a lie rather than a redundancy, and 0.43 is a plausible reading
	// in BOTH forms. A static stored suffix could not follow that switch. The user's own suffix, if
	// they set one, lands outside this one. Extrema compare the NUMBER, so neither affects which
	// label gets a tick.
	function numLine(siValue, unitId, extrema, decimals, suffix) {
		var displayValue = displayRound(siValue, unitId, decimals);
		return { text: displayValue.toFixed(fieldDecimals(decimals)) + (suffix || ''), decoration: decorationFor(extrema, displayValue) };
	}
	// Length is declarative, not SI-converted (see the lengthField() comment above: "1 grid unit IS
	// 1 ft or 1 m, whichever is currently selected, by declaration") -- unlike every other field
	// here, effective(l,'length') is already in the displayed unit, so this must NOT run it through
	// unitFactor.
	function rawLine(value, extrema, decimals) {
		var displayValue = plainRound(value, decimals);
		return { text: displayValue.toFixed(fieldDecimals(decimals)), decoration: decorationFor(extrema, displayValue) };
	}
	// Rebuilds every node's and link's map-label text from `labelSettings` + `lastSolveResult`.
	// Extrema are computed ONCE per field, network-wide, before any label is built, so every
	// element's decoration is judged against the same snapshot (Tom: ties all get marked, not just
	// the first one found -- decorationFor() already does this per element).
	function refreshLabelText() {
		var ls = labelSettings, nd = ls.decimals.node, ld = ls.decimals.link,
			// One string, computed once for the whole pass -- see the measurement comment below.
			fsNow = effectiveFontSize() + 'px';
		// Every field below is rounded through the same displayRound()/per-field-decimals rule the
		// label text itself uses (see the comment on displayRound()), so a tie in what's actually
		// printed is always a tie in what gets decorated.
		//
		// ---- DEMAND AND FLOW ARE JUDGED SEPARATELY, and that has now been decided TWICE ----
		//
		// They print with the same prefix (a demand IS a flow -- the flow leaving the network at that
		// point), so pooling them into one Q comparison looks obviously right, and it was tried on
		// 2026-08-15 and reverted the same day. Two reasons, and the second is the one that decides:
		//
		//   * The report that prompted it was a misreading. Two "highest Q" marks on one drawing
		//     turned out to be a junction's DEMAND and a pump's FLOW, not the pipe-versus-pump split
		//     it looked like. Nothing was actually inconsistent.
		//   * **A pooled Q can only ever be answered by a link.** A source carries the sum of every
		//     demand downstream of it, so the top mark lands on a pump or a supply main every time
		//     and "which junction draws the most" -- a question a designer genuinely asks -- stops
		//     being answerable at all. Consistency of the PREFIX is not worth the loss of a whole
		//     comparison.
		//
		// So: two pools, on purpose. If a future reader is about to merge them for tidiness, this is
		// the note saying it was tried, and `dev/lpn-spike/label-affix-harness.js` asserts the split.
		var extrema = {
			// Elevation and pressure now include reservoirs -- a reservoir has a real elevation of
			// its own, and a real pressure (head minus that elevation) whenever its head has been
			// raised above it. Demand still excludes them: a reservoir supplies whatever the network
			// draws rather than demanding an amount.
			// INPUTS use plainRound() -- they are already in the displayed unit (Task 263), the same
			// treatment length/roughness/km have always had. Only solve RESULTS still come out of the
			// solver in SI and go through displayRound().
			elev: fieldExtrema(doc.nodes.map(function (n) { return plainRound(n.elev, nd.elev); })),
			demand: fieldExtrema(doc.nodes.map(function (n) { return !isFixedHeadNode(n) ? plainRound(effective(n, 'demand'), nd.demand) : undefined; })),
			head: fieldExtrema(doc.nodes.map(function (n) {
				// Head is an INPUT on a reservoir or tank and a RESULT on a junction, so the two
				// halves of this one field cross the boundary differently. Both end up in
				// Elevation/Head units, which is what makes them comparable for the extrema tick.
				if (isFixedHeadNode(n)) { return plainRound(nodeFixedHead(n), nd.head); }
				return lastSolveResult ? displayRound(lastSolveResult.heads[n.id], 'lpn_u_elevhead', nd.head) : undefined;
			})),
			pressure: fieldExtrema(doc.nodes.map(function (n) {
				if (isFixedHeadNode(n)) { return displayRound(toSI(nodeFixedHead(n) - (n.elev || 0), 'lpn_u_elevhead'), 'lpn_u_pressure', nd.pressure); }
				return lastSolveResult ? displayRound(lastSolveResult.pressures[n.id], 'lpn_u_pressure', nd.pressure) : undefined;
			})),
			diameter: fieldExtrema(doc.links.map(function (l) { return l.type !== 'pump' ? plainRound(effective(l, 'diameter'), ld.diameter) : undefined; })),
			// PIPE-ONLY, not merely not-a-pump (Task 248 phase 2). A valve has no length by
			// definition and no roughness to speak of, so including it would drag the low end of
			// both ranges to zero and put a "smallest" tick on every valve on the map.
			length: fieldExtrema(doc.links.map(function (l) { return l.type === 'pipe' ? plainRound(effective(l, 'length'), ld.length) : undefined; })),
			// Both dimensionless, so they use rawLine()/plainRound() like Length, not displayRound().
			roughness: fieldExtrema(doc.links.map(function (l) { return l.type === 'pipe' ? plainRound(effective(l, 'roughness'), ld.roughness) : undefined; })),
			km: fieldExtrema(doc.links.map(function (l) { return l.type === 'pipe' ? plainRound(effective(l, 'k') || 0, ld.km) : undefined; })),
			flow: fieldExtrema(doc.links.map(function (l) { return lastSolveResult ? displayRound(shownFlow(lastSolveResult.flows[l.id]), 'lpn_u_flow', ld.flow) : undefined; })),
			velocity: fieldExtrema(doc.links.map(function (l) { return (l.type !== 'pump' && lastSolveResult) ? displayRound(lastSolveResult.velocities[l.id], 'lpn_u_velocity', ld.velocity) : undefined; })),
			// One head-loss bucket for every link type, pumps included: a pump reports a negative
			// head loss (Tom, 2026-07-30), so it lands at the min end of this same range rather
			// than needing a field of its own.
			headloss: fieldExtrema(doc.links.map(function (l) {
				if (!lastSolveResult || lastSolveResult.headlosses[l.id] === undefined) { return undefined; }
				return displayRound(shownHeadloss(l, lastSolveResult.headlosses[l.id]), 'lpn_u_elevhead', ld.headloss);
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
				return displayRound(shownHeadloss(l, lastSolveResult.headlosses[l.id]) / len, 'lpn_u_gradient', ld.gradient);
			}))
		};
		var nodeLines = {}, linkLines = {};
		doc.nodes.forEach(function (n) {
			var ne = nodeEls[n.id]; if (!ne) { return; }
			var lines = [];
			// Order (Tom, 2026-07-30, thinking physically): ID, Demand, Head, Pressure, Elevation --
			// demand is the thing the user set as a design target, head/pressure are what the solve
			// produced from it, and elevation (the input least likely to change page to page) trails.
			if (ls.node.id) { lines.push(affix('node', 'id', { text: n.id })); }
			if (!isFixedHeadNode(n) && ls.node.demand) { lines.push(affix('node', 'demand', rawLine(effective(n, 'demand'), extrema.demand, nd.demand))); }
			// Both are already IN Elevation/Head and Pressure units by the time they get here -- the
			// fixed-head branch because those are declared inputs, the junction branch because the
			// solve result is converted on the spot. rawLine() then prints what it is given, so the
			// two halves of each field agree with the extrema computed above. A TANK's pressure is
			// the depth of water standing in it, which is the same head-minus-elevation subtraction
			// a reservoir makes -- see nodeFixedHead().
			var headVal = isFixedHeadNode(n)
				? nodeFixedHead(n)
				: (lastSolveResult ? toDisplay(lastSolveResult.heads[n.id], 'lpn_u_elevhead') : undefined);
			var pressVal = isFixedHeadNode(n)
				? toDisplay(toSI(nodeFixedHead(n) - (n.elev || 0), 'lpn_u_elevhead'), 'lpn_u_pressure')
				: (lastSolveResult ? toDisplay(lastSolveResult.pressures[n.id], 'lpn_u_pressure') : undefined);
			if (ls.node.head && headVal !== undefined) { lines.push(affix('node', 'head', rawLine(headVal, extrema.head, nd.head))); }
			if (ls.node.pressure && pressVal !== undefined) { lines.push(affix('node', 'pressure', rawLine(pressVal, extrema.pressure, nd.pressure))); }
			if (ls.node.elev) { lines.push(affix('node', 'elev', rawLine(n.elev, extrema.elev, nd.elev))); }
			// EMPTY IS CAPTURED BEFORE THE PLACEHOLDER BELOW: a label with no fields toggled on still gets
			// an empty line pushed so getBBox() never throws, and everything downstream (the leader, the
			// collision box) must know it is really empty rather than really one blank line.
			ne.empty = lines.length === 0;
			if (lines.length === 0) { lines.push({ text: '' }); } // keep an empty tspan so getBBox() doesn't throw
			// x here is a placeholder -- layoutNodeLabel() below (after collision avoidance) sets the
			// real, final x/y on both the <text> and its tspans via repositionMultilineText().
			var nRows = composeRows(lines, true);   // a node label always stacks -- see composeRows()
			setMultilineText(ne.text, nodeLabelBase(n).x, nRows);
			ne.lineCount = nRows.length;
			nodeLines[n.id] = lines;
			ne.lines = lines; // the FIELD lines, one per value, whatever shape they were drawn in
			// **THE FONT SIZE MUST BE RIGHT FOR THIS SCALE BEFORE THE TAPE MEASURE COMES OUT.**
			// (Tom, 2026-08-15, with two screenshots of the same view: *"See the size of these boxes
			// before and after I drag."* The green obstacle boxes were several times the label in
			// one and tight around it in the other.)
			//
			// getBBox() returns WORLD units, and noteMeasuredWidth() multiplies by the CURRENT scale
			// to bank a pixel width. Both halves have to belong to the same moment. A label's
			// font-size is itself in world units (textSize / s), so if this runs after a zoom but
			// before refreshFontSizes() has updated the element, we measure text drawn at the OLD
			// scale and multiply it by the NEW one -- and the banked pixel width is wrong by exactly
			// the zoom ratio, in the direction that makes boxes enormous when you zoom out. It
			// healed on the next drag only because a drag ends in a solve, which re-enters here with
			// the sizes by then agreeing.
			ne.text.style.fontSize = fsNow;
			try { noteMeasuredWidth(ne, ne.text.getBBox().width); } catch (err) { /* pre-layout measurement can throw; stale tw stands */ }
		});
		doc.links.forEach(function (l) {
			var le = linkEls[l.id]; if (!le) { return; }
			var lines = [];
			if (ls.link.id) { lines.push(affix('link', 'id', { text: l.id })); }
			if (l.type === 'pipe') {
				if (ls.link.diameter) { lines.push(affix('link', 'diameter', rawLine(effective(l, 'diameter'), extrema.diameter, ld.diameter))); }
				if (ls.link.length) { lines.push(affix('link', 'length', rawLine(effective(l, 'length'), extrema.length, ld.length))); }
				if (ls.link.roughness) { lines.push(affix('link', 'roughness', rawLine(effective(l, 'roughness'), extrema.roughness, ld.roughness))); }
				if (ls.link.km) { lines.push(affix('link', 'km', rawLine(effective(l, 'k') || 0, extrema.km, ld.km))); }
			} else if (l.type === 'valve') {
				// A VALVE PRINTS ITS DIAMETER AND NOTHING ELSE FROM THIS GROUP. Length and
				// roughness do not exist on it, and its loss lives in a SETTING whose meaning
				// changes with the type -- so a bare number beside a pipe's k would be read as the
				// same quantity when it is a pressure or a flow. The setting belongs in the popup,
				// where it is labelled, until a label toggle of its own is worth 26 translations.
				if (ls.link.diameter) { lines.push(affix('link', 'diameter', rawLine(effective(l, 'diameter'), extrema.diameter, ld.diameter))); }
			}
			if (lastSolveResult && lastSolveResult.flows[l.id] !== undefined) {
				if (ls.link.flow) { lines.push(affix('link', 'flow', numLine(shownFlow(lastSolveResult.flows[l.id]), 'lpn_u_flow', extrema.flow, ld.flow))); }
				// Velocity is meaningless for a pump (no diameter -- see renderLinkFields() above).
				if (ls.link.velocity && l.type !== 'pump') { lines.push(affix('link', 'velocity', numLine(lastSolveResult.velocities[l.id], 'lpn_u_velocity', extrema.velocity, ld.velocity))); }
				if (ls.link.headloss) { lines.push(affix('link', 'headloss', numLine(shownHeadloss(l, lastSolveResult.headlosses[l.id]), 'lpn_u_elevhead', extrema.headloss, ld.headloss))); }
				// The '%' is read from the SELECT, not assumed: this family offers rise/run too, and
				// a "%" on a ratio would be a lie rather than a redundancy. Blank in that form --
				// there is no token for a bare ratio that is shorter than the ambiguity it fixes.
				if (ls.link.gradient && l.type !== 'pump' && linkLengthSI(l)) { lines.push(affix('link', 'gradient', numLine(shownHeadloss(l, lastSolveResult.headlosses[l.id]) / linkLengthSI(l), 'lpn_u_gradient', extrema.gradient, ld.gradient, gradientSuffix()))); }
			}
			le.empty = lines.length === 0;
			if (lines.length === 0) { lines.push({ text: '' }); }
			var lRows = composeRows(lines, labelIsDragged(l));
			setMultilineText(le.text, linkLabelBase(l).x, lRows);
			le.lineCount = lRows.length;
			// Kept so a repeat can be rendered from the same rows without composing them twice, and
			// stamped so a layout pass (which runs on every drag frame) only rebuilds a repeat's
			// tspans when the content really changed. See syncRepeatText().
			le.rows = lRows;
			le.rowsSeq = (le.rowsSeq || 0) + 1;
			linkLines[l.id] = lines;
			le.lines = lines;
			// Same reason as the node branch above: size it for this scale, then measure it.
			le.text.style.fontSize = fsNow;
			(le.repeats || []).forEach(function (r) { r.text.style.fontSize = fsNow; });
			try { noteMeasuredWidth(le, le.text.getBBox().width); } catch (err) { /* pre-layout measurement can throw; stale tw stands */ }
		});
		// Collision avoidance runs on the freshly measured tw/lineCount above, THEN every label is
		// laid out for real (text and leader) at its final, possibly-nudged position. The extrema
		// marks need no third pass of their own any more (Task 333): they are text-decoration on the
		// tspans set above, so they move with the text whatever moves it.
		relayoutLabels();
		doc.links.forEach(function (l) { updateArrow(l.id); });
		renderLabelsLegend();
		// Called from HERE and not from every caller of it, because the halos are filtered by the
		// Labels panel and this function is what every label-affecting change already goes through:
		// a toggle, a solve, a unit switch, a rebuild. Anything that can change which properties are
		// on screen therefore re-decides which halos are on screen, with nothing to remember.
		refreshScenarioMarks();
	}
	// ---- audit halos, and the greying of inactive elements (ROADMAP Task 184) ----
	// A halo marks an element carrying an override IN THE CURRENT SCENARIO, filtered by the same
	// Labels-panel checkboxes the rest of the page uses as its property filter (Task 184; the same
	// reuse the two pushes make). This is why the overrides REPORT is explicitly low priority --
	// the halo puts the same information in the place the user is already looking.
	//
	// A property with no Labels checkbox (status, active, a tank's level) is ALWAYS shown: the
	// filter can only hide what it is able to name, and silently dropping an override the panel has
	// no row for would make the halos quietly incomplete rather than filtered.
	var LPN_OVERRIDE_LABEL_FIELD = {
		node: { demand: 'demand', head: null, level: null, emitter: null, active: null },
		link: { diameter: 'diameter', roughness: 'roughness', k: 'km', length: 'length', status: null, active: null }
	};
	function overrideIsDisplayed(el, prop) {
		var group = elGroup(el), field = (LPN_OVERRIDE_LABEL_FIELD[group] || {})[prop];
		return field ? !!labelSettings[group][field] : true;
	}
	function hasDisplayedOverride(el) {
		var ov = activeScenario().overrides[ovKey(el)];
		if (!ov) { return false; }
		return Object.keys(ov).some(function (p) { return overrideIsDisplayed(el, p); });
	}
	function refreshScenarioMarks() {
		doc.nodes.forEach(function (n) {
			var ne = nodeEls[n.id], off = !isActive(n);
			if (!ne) { return; }
			ne.circle.classList.toggle('lpn-override', hasDisplayedOverride(n));
			ne.circle.classList.toggle('lpn-inactive', off);
			if (ne.symbol) { ne.symbol.classList.toggle('lpn-inactive', off); }
			ne.text.classList.toggle('lpn-inactive', off);
		});
		doc.links.forEach(function (l) {
			var le = linkEls[l.id], off = !isActive(l);
			if (!le) { return; }
			if (le.halo) { le.halo.classList.toggle('lpn-override', hasDisplayedOverride(l)); }
			le.line.classList.toggle('lpn-inactive', off);
			le.text.classList.toggle('lpn-inactive', off);
			if (le.symbolG) { le.symbolG.classList.toggle('lpn-inactive', off); }
		});
	}
	// The layout half of refreshLabelText(), without rebuilding any text: re-run collision
	// avoidance, then place every label (text and leader) and its extrema ticks at the resulting
	// position. Split out so a DRAG can call it on every frame (Tom, 2026-07-30: "collisions aren't
	// recalculated after drag; leaders stay unchanged") -- moving one label changes what every other
	// label collides with, but none of the NUMBERS change while dragging, so rebuilding all the
	// tspans 60 times a second would be pure waste. Safe to call repeatedly because the collision
	// pass is idempotent (see addDataLabel()). Ticks reuse the lines cached by the last full
	// refreshLabelText().
	// **ALL THREE KINDS OF LABEL, THE USER'S OWN TEXT LABELS INCLUDED.** A Text label's leader and
	// its collision box are both derived from a pixel width, so leaving it un-laid-out across a zoom
	// leaves them at the old scale. Nothing else lays them out -- refreshFontSizes() stopped doing
	// so when the zoom path stopped re-measuring (Task 366). It costs nothing to be right: a drawing
	// holds a handful of Text labels against hundreds of data labels, and this path does no
	// measuring.
	//
	// **THE LAYOUT BELONGS TO A SCALE, AND THIS IS WHERE THAT IS RECORDED.** Every label is sized
	// in screen pixels, so at a coarse scale it is enormous in WORLD units and the collision pass
	// moves it correspondingly far. Measured on Net3, a model 37 units across: a layout computed at
	// scale 1 has a MEDIAN nudge of 43 world units and a worst of 68 -- labels flung clean off the
	// far side of the network. At scale 20, where that drawing is actually read, the median is 3.9.
	// Those nudges are CORRECT for the scale that produced them and nonsense at any other, so
	// displaying a layout at a scale it was not computed for is the whole defect. A drag re-runs
	// this pass, which is why one gesture puts every label right at once.
	var lastLayoutScale = null;
	function relayoutLabels() {
		lastLayoutScale = state.s;
		runLabelCollisionAvoidance();
		doc.nodes.forEach(function (n) { if (nodeEls[n.id]) { layoutNodeLabel(n.id); } });
		doc.links.forEach(function (l) { if (linkEls[l.id]) { layoutLinkLabel(l.id); } });
		doc.labels.forEach(function (lb) { if (labelEls[lb.id]) { updateLabelGeometry(lb.id); } });
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
		// A UNIT WE HAVE NO FACTOR FOR STOPS THE SOLVE AND NOTHING ELSE (Task 390 step 4). The
		// drawing is already on screen and every number is already the user's own; what cannot be
		// done is arithmetic, because EngCalcs.unitFactor() answers 1 for a name it does not know
		// and a network solved through that would look perfectly ordinary and be wrong. Checked
		// BEFORE assembleModel(), which is the first thing that would multiply by it.
		var unknownUnits = unresolvedUnitNames();
		if (unknownUnits.length) {
			lastSolveResult = null;
			setStatus(((EngCalcs.pageConfig || {}).lpn_unit_unknown ||
				'This drawing states a unit this page does not offer: {unit}. Everything is kept and shown exactly as it came in, and nothing was changed. No answers can be worked out until this page knows that unit, because there is no way to tell how big it is.')
				.replace('{unit}', unknownUnits.join(', ')));
			refreshLabelText();
			return;
		}
		var model = assembleModel(), issues = EngCalcs.lpnDiagnose(model);
		if (issues.length > 0) {
			lastSolveResult = null;
			issues.forEach(function (issue) { logLpnDiag(issue.code); });
			setStatus(issues.map(diagIssueText).join(' '));
			refreshLabelText();
			return;
		}
		// AN ACTIVE VALVE ROUTES THE SOLVE TO EPANET, whatever the engine PREFERENCE says, and the
		// status bar says so out loud (Task 248 phase 2, 2026-08-14).
		//
		// The setting is a preference; the routing is a fact about THIS network. A PRV, PSV or FCV
		// switches its own state during the solve and js/lpn-solver.js deliberately does not
		// implement that -- EPANET already does, and measured ~9x faster than our own solver at the
		// 21-node target (ROADMAP Task 313), so a second implementation would have been slower code
		// for a solved problem. So the routing is automatic, because refusing to solve a network we
		// can solve would be absurd, and it is VISIBLE, because a user who ticked "built-in solver"
		// and silently got a different engine has been lied to. settings.engine is NOT rewritten:
		// delete the valve and the page goes straight back to the engine the user chose.
		var epanetOnly = EngCalcs.lpnEpanetOnlyValves ? EngCalcs.lpnEpanetOnlyValves(model) : [];
		valveRouteNote = '';
		if ((settings.engine === 'epanet' || epanetOnly.length > 0) && EngCalcs.lpnSolveEpanet) {
			if (epanetOnly.length > 0 && settings.engine !== 'epanet') {
				valveRouteNote = ((EngCalcs.pageConfig || {}).lpn_engine_valve_route ||
					'Worked out with the EPANET engine, because these valves open and close on their own:') +
					' ' + epanetOnly.join(', ');
			}
			runSolveEpanet(model);
			return;
		}
		applySolveResult(EngCalcs.lpnSolve(model, { tol: settings.tolerance }));
	}
	// Set by runSolve() when a network was routed to EPANET by its own contents rather than by the
	// user's choice; read by applySolveResult(), which owns the status bar after a successful solve.
	var valveRouteNote = '';

	// ---- Warming the EPANET engine (Tom, 2026-08-14) ----
	//
	// js/vendor/epanet-js.js is 664 KB and is deliberately NOT precached by the service worker: it
	// loads only for a visitor who actually needs it, because precaching it would multiply the
	// install cost for exactly the low-bandwidth audience this suite exists for (ROADMAP Task 318).
	// The cost of that decision was a real gap -- offline, a network holding a PRV, PSV or FCV could
	// not be solved at all unless the engine happened to have been fetched at some earlier point.
	//
	// Tom's framing is what turned this from a copy problem into a fetch-timing one: *"Can we disable
	// those elements unless the EPANET engine is on or alert and turn it on or some other gatekeeping
	// late-loading?"* The engine only ever needs downloading ONCE. So fetch it at the first moment a
	// network can only be solved by it -- when the user picks an active valve type, or turns the
	// engine on -- because they are necessarily online then, having just loaded the page. After that
	// one fetch the browser and the service worker both hold it, and the network solves offline for
	// good.
	//
	// IT IS NOT A GATE, and that is deliberate. A user who is offline right now may still build a
	// PRV: refusing would block them from DESIGNING a network they intend to solve later, which is
	// ordinary work. What changes is WHEN they are told -- at the moment they choose the type, while
	// they can still act on it, instead of after a solve quietly refuses.
	//
	// Waiting for the debounced solve to trigger the load would mostly work and is not enough: the
	// gap between choosing a valve type and the solve firing is exactly where a phone drops its
	// connection, and the solve's own failure message arrives after the user has moved on.
	var epanetWarmState = 'cold';   // cold | warming | ready | unavailable
	// `why` is 'valve' or 'engine'. THE SAME FETCH HAS TWO REASONS and one message cannot be true of
	// both: Tom turned the solver on and was told about valves he had not created (2026-08-14).
	function warmEpanetEngine(why) {
		var pc = EngCalcs.pageConfig || {},
			suffix = (why === 'valve') ? '_valve' : '';
		if (!EngCalcs.lpnEpanetLoad) { return; }
		// 'unavailable' is retried on purpose -- the engine load no longer caches a failure
		// (js/lpn-epanet.js), so a user who was offline a moment ago gets another attempt the next
		// time they touch a valve, which is the moment they care.
		if (epanetWarmState === 'warming' || epanetWarmState === 'ready') { return; }
		epanetWarmState = 'warming';
		setNotice(pc['lpn_engine_fetching' + suffix] || 'Getting the EPANET solver.');
		EngCalcs.lpnEpanetLoad().then(function () {
			epanetWarmState = 'ready';
			setNotice(pc['lpn_engine_ready' + suffix] || 'The EPANET solver is on this device now, and works offline.');
		}, function () {
			epanetWarmState = 'unavailable';
			setNotice(pc.lpn_engine_unavailable || 'Could not get the EPANET solver, which is what works out valves that open and close on their own. Connect to the internet once and it is kept on this device from then on.');
		});
	}
	// Warm if the document ALREADY holds a valve only EPANET can solve -- opening a saved project or
	// importing an .inp, where the user never picked a type at all. assembleModel() is the one place
	// that knows the current scenario's real link list, so ask it rather than re-deriving.
	function warmEpanetIfNeeded() {
		if (!EngCalcs.lpnEpanetOnlyValves) { return; }
		try {
			if (EngCalcs.lpnEpanetOnlyValves(assembleModel()).length > 0) { warmEpanetEngine('valve'); }
		} catch (e) { /* a half-built document is not a reason to shout */ }
	}

	function applySolveResult(result) {
		var pc = EngCalcs.pageConfig || {};
		if (!result.ok || !result.converged) {
			lastSolveResult = null;
			// A REFUSAL AND A FAILURE TO CONVERGE ARE DIFFERENT THINGS, and until Task 248 phase 2
			// both printed "Did not converge". They separated the moment the native solver gained a
			// reason to refuse a perfectly sound network (an active valve, when EPANET could not be
			// loaded): telling that user their network did not converge sends them to look for a
			// zero diameter that is not there.
			if (result.issues && result.issues.length > 0) {
				result.issues.forEach(function (issue) { logLpnDiag(issue.code); });
				setStatus(result.issues.map(diagIssueText).join(' '));
				refreshLabelText();
				refreshValueColors();   // Task 384: the colours came from results that no longer exist
					return;
			}
			// Not one of lpnDiagnose()'s pre-solve codes -- this is the solver itself giving up, and
			// it belongs in the same histogram because to the user it is the same kind of dead end.
			logLpnDiag('not-converged');
			setStatus(pc.lpn_diag_not_converged || 'Did not converge.');
			refreshLabelText();
			refreshValueColors();
			return;
		}
		lastSolveResult = result;
		// The only case where the two engines knowingly disagree, so say so rather than let a
		// user discover a 0.6% shift by switching the checkbox. See js/lpn-epanet.js.
		var manningNote = (result.warnings || []).some(function (w) { return w.code === 'manning-constant-differs'; });
		setStatus([valveRouteNote, manningNote ? (pc.lpn_engine_manning_note || '') : '']
			.filter(function (t) { return !!t; }).join(' '));
		refreshLabelText();
		refreshValueColors();
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
		// and every solved head, pressure and velocity moves with them. This is the whole visible
		// consequence of the ban, and it is deliberate.
		//
		// A refit used to have to happen HERE, on every unit switch, because the fitted curve was
		// stored on the link. It is derived at the solver handoff now (pumpFit), so re-solving is
		// the whole of the response and there is nothing left to repair (Task 390 step 5).
		scheduleSolve();
		refreshMapStatus();   // a unit switch is exactly when this readout has to be right
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
