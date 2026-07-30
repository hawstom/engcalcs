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
	var svg, world, backdropLayer, gridLayer, linksLayer, nodesLayer, labelsLayer;
	var state = { tx: 0, ty: 0, s: 1 };
	// World-unit font size shared by a node's ID/pressure label and a user-added Text label (Tom,
	// 2026-07-30) -- no reason for the two to render at different sizes by default.
	var LABEL_FONT_SIZE = 2.5;
	// Line spacing for multi-line node/link labels (Task 146 Phase 2 label toggles), world units.
	var LABEL_LINE_HEIGHT = LABEL_FONT_SIZE * 1.2;
	// Rebuilds a <text> element's tspans from scratch -- simplest correct approach given the line
	// count changes every time a label toggle is flipped. Each tspan repeats the same x (not a
	// relative dx) so every line stays left/anchor-aligned under the first, which is the standard
	// SVG multi-line-text idiom. line.decoration is undefined/'overline'/'underline', driven by the
	// extrema check in refreshLabelText() below.
	function setMultilineText(textEl, x, lines) {
		while (textEl.firstChild) { textEl.removeChild(textEl.firstChild); }
		lines.forEach(function (line, i) {
			var tspan = el('tspan', { x: x, dy: i === 0 ? 0 : LABEL_LINE_HEIGHT }, textEl);
			if (line.decoration) { tspan.style.textDecoration = line.decoration; }
			tspan.textContent = line.text;
		});
	}
	// Repositions an already-built multi-line label (drag/geometry updates) without touching its
	// content -- setMultilineText() gives each tspan its own explicit x (needed for the multi-line
	// stacking idiom), so moving the parent <text>'s x/y alone would leave old tspans stranded at
	// the previous position; every tspan's x must move with it.
	function repositionMultilineText(textEl, x, y) {
		textEl.setAttribute('x', x); textEl.setAttribute('y', y);
		var i;
		for (i = 0; i < textEl.childNodes.length; i++) { textEl.childNodes[i].setAttribute('x', x); }
	}
	// Network-wide max/min of a field's values, skipping undefined (element types that don't carry
	// it, or a solve result not yet available). Returns null when fewer than 2 defined values exist
	// -- a lone value getting both an overline AND underline reads as a rendering glitch, not a
	// finding, so it is deliberately left undecorated rather than marked as "the extreme."
	function fieldExtrema(values) {
		var defined = values.filter(function (v) { return typeof v === 'number'; });
		if (defined.length < 2) { return null; }
		return { min: Math.min.apply(null, defined), max: Math.max.apply(null, defined) };
	}
	function decorationFor(extrema, value) {
		if (!extrema || typeof value !== 'number') { return undefined; }
		if (value === extrema.max && value === extrema.min) { return undefined; }
		if (value === extrema.max) { return 'overline'; }
		if (value === extrema.min) { return 'underline'; }
		return undefined;
	}

	// The document. nodes: Junction/Reservoir (point elements). links: Pipe/Pump (two
	// endpoints + optional bend vertices). labels: Text elements with a leader to an
	// anchor node, OR a free-floating text with anchorNode === null.
	var doc = { nodes: [], links: [], labels: [] };
	var nextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };

	// Map label toggles (Task 146 Phase 2) -- a VIEW preference, not network content, so it is
	// deliberately NOT part of the undo-snapshotted `doc` and is untouched by clearNetwork()/undo().
	// Defaults reproduce exactly what Phase 1 already showed (node ID+pressure, nothing on links),
	// so shipping this is a visual no-op until a user opts in.
	function defaultLabelSettings() {
		return {
			node: { id: true, elev: false, demand: false, head: false, pressure: true },
			link: { id: false, diameter: false, length: false, flow: false, velocity: false, headloss: false }
		};
	}
	var labelSettings = defaultLabelSettings();

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
	function linkById(id) {
		var i;
		for (i = 0; i < doc.links.length; i++) { if (doc.links[i].id === id) { return doc.links[i]; } }
		return null;
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

	function nodeRadius(n) { return n.type === 'reservoir' ? 2.2 : 1.6; }
	function buildNodeEls(n) {
		var circle = el('circle', {
			cx: n.x, cy: n.y, r: nodeRadius(n),
			'class': 'lpn-node lpn-node-' + n.type, 'data-node': n.id
		}, nodesLayer);
		// font-size inline, NOT the .lpn-lbl CSS class's 11px: SVG font-size is interpreted in the
		// local (world-unit) coordinate system, same as any other geometry under this scaled <g> --
		// an "11-unit" font is enormous next to nodes spaced 10-40 units apart, which is what was
		// actually causing the zoom-extent overflow (not a missing bbox term -- the geometry itself
		// was oversized). Matches the spike's own convention. Same LABEL_FONT_SIZE as a user Text
		// label (Tom, 2026-07-30: no reason for these to differ) -- the two are still visually
		// distinguishable by position (node ID sits fixed at the node) and role, not by size.
		var text = el('text', { x: n.x + 2, y: n.y - 2, 'class': 'lpn-lbl', style: 'font-size:' + LABEL_FONT_SIZE + 'px' }, nodesLayer);
		text.textContent = n.id;
		var tw = 8;
		try { tw = text.getBBox().width; } catch (err) { /* pre-layout measurement can throw; fallback stands */ }
		nodeEls[n.id] = { circle: circle, text: text, tw: tw };
		incidentLinks[n.id] = [];
		labelsByAnchor[n.id] = [];
	}
	function buildLinkEls(l) {
		var line = el('polyline', {
			points: linkPoints(l), fill: 'none',
			'class': 'lpn-link lpn-link-' + l.type, 'data-link': l.id
		}, linksLayer);
		var handles = [], i;
		for (i = 0; i < l.verts.length; i++) {
			handles.push(el('circle', {
				cx: l.verts[i].x, cy: l.verts[i].y, r: 0.9,
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
		// refreshLabelText(), not here (this only creates the element; it starts empty).
		var midIdx = Math.floor(segCount / 2), mid = segmentMidpoints(l)[midIdx],
			text = el('text', { x: mid.x + 2, y: mid.y - 2, 'class': 'lpn-lbl', style: 'font-size:' + LABEL_FONT_SIZE + 'px' }, linksLayer);
		linkEls[l.id] = { line: line, handles: handles, arrows: arrows, text: text, tw: 8 };
	}
	// Midpoint and local tangent angle of every segment, walking a->verts->b -- one entry per
	// straight run, so a bent pipe's arrows follow each segment's own direction.
	function segmentMidpoints(l) {
		var pts = [nodeById(l.from)].concat(l.verts, [nodeById(l.to)]), out = [], i, a, b;
		for (i = 0; i < pts.length - 1; i++) {
			a = pts[i]; b = pts[i + 1];
			out.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, angle: Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI });
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
		var mids = segmentMidpoints(linkById(id)), flow = lastSolveResult ? lastSolveResult.flows[id] : undefined, i;
		for (i = 0; i < le.arrows.length; i++) {
			if (!mids[i] || flow === undefined) { le.arrows[i].style.display = 'none'; continue; }
			var angle = mids[i].angle + (flow < 0 ? 180 : 0);
			le.arrows[i].setAttribute('transform', 'translate(' + mids[i].x + ',' + mids[i].y + ') rotate(' + angle + ')');
			le.arrows[i].style.display = '';
		}
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
			x: px, y: py, 'class': 'lpn-lbl lpn-draglbl', 'text-anchor': 'middle',
			'dominant-baseline': 'central', 'data-lbl': lb.id, style: 'font-size:' + LABEL_FONT_SIZE + 'px'
		}, labelsLayer);
		text.textContent = lb.text;
		var w = 10;
		try { w = text.getBBox().width; } catch (err) { /* pre-layout measurement can throw; fallback stands */ }
		labelEls[lb.id] = { leader: leader, text: text, side: 'right', width: w };
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
	}
	function updateLinkGeometry(id) {
		var l = linkById(id), le = linkEls[id], segCount = l.verts.length + 1,
			midIdx = Math.floor(segCount / 2), mid = segmentMidpoints(l)[midIdx];
		le.line.setAttribute('points', linkPoints(l));
		repositionMultilineText(le.text, mid.x + 2, mid.y - 2);
		if (l.lenAuto) { l.length = linkGeomLength(l); }
		updateArrow(id);
	}

	// Same leader math as the spike: text is always text-anchor:middle and tracks the drag
	// point continuously (never jumps); only the leader's attachment edge flips, at 75% of
	// the label's own width past the anchor's vertical line (Tom: 50-100% acceptable, 0% =
	// near edge at the line, 100% = far edge at the line -- flipping later means the leader
	// has to reach clear across the text).
	var ADVERSE_FRAC = 0.75;
	function updateLabelGeometry(id) {
		var lb = labelById(id), le = labelEls[id], an, px, py, halfW, trigger, leaderX;
		if (!lb.anchorNode) {
			le.text.setAttribute('x', lb.x); le.text.setAttribute('y', lb.y);
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
	}
	function labelById(id) {
		var i;
		for (i = 0; i < doc.labels.length; i++) { if (doc.labels[i].id === id) { return doc.labels[i]; } }
		return null;
	}
	function updateNode(id) {
		var n = nodeById(id), ne = nodeEls[id], i;
		ne.circle.setAttribute('cx', n.x); ne.circle.setAttribute('cy', n.y);
		repositionMultilineText(ne.text, n.x + 2, n.y - 2);
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
				tw = ne.tw || 8, lc = ne.lineCount || 1;
			inc(n.x - r, n.y - r); inc(n.x + r, n.y + r);
			// "J1"-style id/data label beside the circle -- extended downward per extra toggled-on
			// line (Task 146 Phase 2 label toggles), since multi-line labels grow toward +y (dy>0).
			inc(n.x + 2, n.y - 2 - 2); inc(n.x + 2 + tw, n.y - 2 + 0.6 + (lc - 1) * LABEL_LINE_HEIGHT);
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
				inc(v.x - 1.1, v.y - 1.1); inc(v.x + 1.1, v.y + 1.1);
			}
			var l = doc.links[i], lle = linkEls[l.id];
			if (lle) {
				var lx = +lle.text.getAttribute('x'), ly = +lle.text.getAttribute('y'),
					ltw = lle.tw || 8, llc = lle.lineCount || 1;
				inc(lx, ly - 2); inc(lx + ltw, ly + 0.6 + (llc - 1) * LABEL_LINE_HEIGHT);
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

	function setMode(newMode) {
		mode = newMode; pendingLinkFrom = null;
		if (setModeUI) { setModeUI(); }
	}

	function addNode(type, x, y) {
		var prefix = type === 'reservoir' ? 'R' : 'J', id = prefix + (nextId[prefix]++);
		// Reservoir carries a fixed head (js/lpn-solver.js reads node.head directly as the
		// boundary condition); junction carries elevation + demand. Different fields on
		// purpose -- conflating them was a real trap early on (see lpn-solver.js's own notes).
		var n = type === 'reservoir'
			? { id: id, type: type, x: x, y: y, head: niceDefault('lpn_u_elevhead', 'fth2o', 100, 30) }
			: { id: id, type: type, x: x, y: y, elev: 0, demand: 0 };
		doc.nodes.push(n);
		buildNodeEls(n);
		incidentLinks[id] = []; labelsByAnchor[id] = [];
		updateEmptyHint();
		scheduleSolve();
		return n;
	}
	function addLink(type, fromId, toId) {
		var prefix = type === 'pump' ? 'P' : 'L', id = prefix + (nextId[prefix]++);
		var l = {
			id: id, type: type, from: fromId, to: toId, verts: [],
			diameter: niceDefault('lpn_u_diameter', 'in', 4, 0.1),
			roughness: 100, length: 0, lenAuto: true, status: 'open'
		};
		l.length = linkGeomLength(l);
		if (type === 'pump') {
			// Pump curve entry isn't implemented (see the scope doc's design note) -- without
			// h0/a/b, EngCalcs.lpnSolve()'s pump branch reads undefined and produces NaN, which
			// would silently break any network containing one. A generic single-point curve
			// (nice numbers per the current unit system, not one SI pair) keeps the solve
			// meaningful until real curve entry exists.
			var curveQ = niceDefault('lpn_u_flow', 'gpm', 150, 0.01),
				curveH = niceDefault('lpn_u_elevhead', 'fth2o', 65, 20),
				curve = EngCalcs.lpnPumpFromCurve([[curveQ, curveH]]);
			l.h0 = curve.h0; l.a = curve.a; l.b = curve.b;
		}
		doc.links.push(l);
		incidentLinks[fromId].push(id); incidentLinks[toId].push(id);
		buildLinkEls(l);
		scheduleSolve();
		return l;
	}
	function addText(x, y) {
		var id = 'T' + (nextId.T++);
		var lb = { id: id, text: EngCalcs.pageConfig.lpn_new_text || 'Text', x: x, y: y, anchorNode: null };
		doc.labels.push(lb);
		buildLabelEls(lb);
		return lb;
	}
	function deleteNode(id) {
		var links = incidentLinks[id].slice(), i;
		for (i = 0; i < links.length; i++) { deleteLink(links[i]); }
		labelsByAnchor[id].slice().forEach(function (lid) { deleteLabelById(lid); });
		nodeEls[id].circle.remove(); nodeEls[id].text.remove();
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
		delete labelEls[id];
		if (lb.anchorNode) {
			labelsByAnchor[lb.anchorNode] = labelsByAnchor[lb.anchorNode].filter(function (x) { return x !== id; });
		}
		doc.labels = doc.labels.filter(function (x) { return x.id !== id; });
	}

	// ---- localStorage autosave (single network) ----
	// Versioned per the scope doc's schema rules: v > CURRENT refuses to load and says so, never
	// silently drops unknown fields; v < CURRENT would run an ordered migration chain, keeping a
	// _backup copy first. No migrations exist yet -- this is Phase 1's only version.
	var LPN_STORAGE_KEY = 'lpn_document';
	var LPN_STORAGE_VERSION = 1;
	function saveToStorage() {
		try {
			localStorage.setItem(LPN_STORAGE_KEY, JSON.stringify({
				v: LPN_STORAGE_VERSION, nodes: doc.nodes, links: doc.links, labels: doc.labels, nextId: nextId,
				labelSettings: labelSettings
			}));
		} catch (err) { /* localStorage can throw (private mode, quota) -- autosave is best-effort */ }
	}
	function loadFromStorage() {
		var raw, saved;
		try { raw = localStorage.getItem(LPN_STORAGE_KEY); } catch (err) { return false; }
		if (!raw) { return false; }
		try { saved = JSON.parse(raw); } catch (err) { return false; }
		if (!saved || typeof saved.v !== 'number') { return false; }
		if (saved.v > LPN_STORAGE_VERSION) {
			var pc = EngCalcs.pageConfig || {};
			alert(pc.lpn_storage_too_new || 'The saved network was created by a newer version of this page and cannot be loaded here.');
			return false;
		}
		doc.nodes = saved.nodes || []; doc.links = saved.links || []; doc.labels = saved.labels || [];
		nextId = saved.nextId || { J: 1, R: 1, L: 1, P: 1, T: 1 };
		labelSettings = saved.labelSettings || defaultLabelSettings();
		return true;
	}
	// A dedicated button, not a repurposed "Restore Defaults" (Tom asked "do we dare"): that
	// button's suite-wide behavior (lib/Calculators.lib.php's EngCalcs.resetToDefaults) expires a
	// cookie this page never uses and reloads, which wouldn't touch localStorage at all --
	// unifying the two is a real design question logged in the scope doc, not resolved here.
	function clearNetwork() {
		var pc = EngCalcs.pageConfig || {};
		if (!window.confirm(pc.lpn_confirm_clear || 'This will permanently delete the current network. Continue?')) { return; }
		doc = { nodes: [], links: [], labels: [] };
		nextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };
		try { localStorage.removeItem(LPN_STORAGE_KEY); } catch (err) { /* best-effort */ }
		lastSolveResult = null;
		closePopup();
		buildDom();
		updateEmptyHint();
		setStatus('');
		setMode('select');
		zoomExtent();
	}

	function init() {
		svg = document.getElementById('lpn_canvas');
		world = el('g', {}, svg);
		backdropLayer = el('g', {}, world);
		gridLayer = el('g', {}, world);
		linksLayer = el('g', {}, world);
		nodesLayer = el('g', {}, world);
		labelsLayer = el('g', {}, world);
		setTransform();
		wireToolbar();
		wirePointerEvents();
		wirePopup();
		if (loadFromStorage()) { buildDom(); scheduleSolve(); }
		wireLabelsPopup();
		updateEmptyHint();
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
		var clearBtn = document.createElement('button');
		clearBtn.type = 'button';
		clearBtn.textContent = pc.lpn_tool_clear || 'Clear / New';
		clearBtn.addEventListener('click', clearNetwork);
		fileGroup.appendChild(clearBtn);
		var exampleBtn = document.createElement('button');
		exampleBtn.type = 'button';
		exampleBtn.textContent = pc.lpn_tool_example || 'Draw example network';
		exampleBtn.addEventListener('click', drawExampleNetwork);
		fileGroup.appendChild(exampleBtn);

		var addGroup = group();
		[
			{ mode: 'add-reservoir', key: 'lpn_tool_add_reservoir' },
			{ mode: 'add-pump', key: 'lpn_tool_add_pump' },
			{ mode: 'add-junction', key: 'lpn_tool_add_junction' },
			{ mode: 'add-pipe', key: 'lpn_tool_add_pipe' },
			{ mode: 'add-text', key: 'lpn_tool_add_text' }
		].forEach(function (t) { modeButton(t, addGroup); });

		var editGroup = group();
		modeButton({ mode: 'select', key: 'lpn_tool_select' }, editGroup);
		modeButton({ mode: 'delete', key: 'lpn_tool_delete' }, editGroup);
		var undoBtn = document.createElement('button');
		undoBtn.type = 'button';
		undoBtn.textContent = pc.lpn_tool_undo || 'Undo';
		undoBtn.addEventListener('click', undo);
		editGroup.appendChild(undoBtn);

		var viewGroup = group();
		var extentBtn = document.createElement('button');
		extentBtn.type = 'button';
		extentBtn.textContent = pc.lpn_tool_zoom_extent || 'Zoom Extent';
		extentBtn.addEventListener('click', zoomExtent);
		viewGroup.appendChild(extentBtn);
		var labelsBtn = document.createElement('button');
		labelsBtn.type = 'button';
		labelsBtn.textContent = pc.lpn_tool_labels || 'Labels';
		labelsBtn.addEventListener('click', toggleLabelsPopup);
		viewGroup.appendChild(labelsBtn);

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
			if (!window.confirm(pc.lpn_confirm_example || 'This will add to the existing network. Continue?')) { return; }
		}
		saveUndoSnapshot();
		var r = addNode('reservoir', 0, 0);
		var j1 = addNode('junction', 20, 0);
		j1.elev = niceDefault('lpn_u_elevhead', 'fth2o', 50, 15); j1.demand = 0;
		addLink('pump', r.id, j1.id);
		var j2 = addNode('junction', 40, 15);
		j2.elev = niceDefault('lpn_u_elevhead', 'fth2o', 40, 12);
		j2.demand = niceDefault('lpn_u_flow', 'gpm', 100, 0.006);
		var pipe = addLink('pipe', j1.id, j2.id);
		pipe.verts.push({ x: 30, y: -5 });
		// addLink() computed .length before this vertex existed (straight node-to-node distance);
		// rebuildLink() only rebuilds the DOM, not the length -- recompute explicitly, or the
		// initial displayed length undercounts the bend until the vertex is next dragged (which
		// goes through updateVertex()/updateLinkGeometry(), where lenAuto recomputation already
		// happens correctly). Tom caught this: 25ft shown, jumped to 28ft only after a drag.
		pipe.length = linkGeomLength(pipe);
		rebuildLink(pipe);
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
					n.demand = demand;
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

		svg.addEventListener('pointerdown', function (e) {
			svg.setPointerCapture(e.pointerId);
			pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
			if (pointers.size === 2) {
				var pts = Array.from(pointers.values());
				drag = { type: 'pinch', d0: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y), s0: state.s };
				return;
			}
			var t = e.target, common = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY };
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
			if (pendingLinkPopupTimer) { clearTimeout(pendingLinkPopupTimer); pendingLinkPopupTimer = null; }
			var t = document.elementFromPoint(e.clientX, e.clientY);
			if (!t || !t.dataset) { return; }
			if (t.classList.contains('lpn-vhandle')) { removeVertex(t.dataset.link, +t.dataset.vidx); }
			else if (t.dataset.link !== undefined) { insertVertex(t.dataset.link, screenToWorld(e.clientX, e.clientY)); }
		});

		// Add-* and Delete tools act on a plain click (tap without drag), same threshold as
		// the spike's tap-vs-drag detection.
		var downPt = null;
		svg.addEventListener('pointerdown', function (e) { downPt = { x: e.clientX, y: e.clientY }; });
		svg.addEventListener('pointerup', function (e) {
			if (!downPt || Math.hypot(e.clientX - downPt.x, e.clientY - downPt.y) >= 4) { downPt = null; return; }
			downPt = null;
			// elementFromPoint, not e.target: setPointerCapture(svg) retargets pointerup's
			// target to the capturing element (svg itself) on desktop Chrome, so e.target here
			// is never the actual node/link/label clicked -- see phase0-acceptance.md round 2.
			var w = screenToWorld(e.clientX, e.clientY), t = document.elementFromPoint(e.clientX, e.clientY);
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
			else if (mode === 'add-text') { saveUndoSnapshot(); addText(w.x, w.y); }
			else if (mode === 'add-pipe' || mode === 'add-pump') {
				// Same snap: elementFromPoint requires landing exactly on the node's small hit
				// area, which a real tap on a real screen routinely misses by a few pixels -- that
				// miss is diagnostic #2's dominant cause ("a pipe drawn near a junction but not
				// snapped to it"). Falling back to the nearest node within screen-pixel tolerance
				// makes a close tap connect anyway.
				var hitId = t.dataset.node || (nearestNodeNearScreen(e.clientX, e.clientY, NODE_SNAP_PX) || {}).id;
				if (hitId) {
					if (!pendingLinkFrom) { pendingLinkFrom = hitId; }
					else if (hitId !== pendingLinkFrom) {
						saveUndoSnapshot();
						addLink(mode === 'add-pump' ? 'pump' : 'pipe', pendingLinkFrom, hitId);
						pendingLinkFrom = null;
					}
				} else { pendingLinkFrom = null; }
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
		} else if (drag.type === 'vertex') {
			var w2 = screenToWorld(p.x, p.y);
			linkById(drag.id).verts[drag.vidx] = { x: w2.x + drag.offX, y: w2.y + drag.offY };
			updateVertex(drag.id, drag.vidx);
		} else if (drag.type === 'label') {
			var w3 = screenToWorld(p.x, p.y), lb = labelById(drag.id), an = lb.anchorNode ? nodeById(lb.anchorNode) : { x: 0, y: 0 };
			if (lb.anchorNode) { lb.x = (w3.x + drag.offX) - an.x; lb.y = (w3.y + drag.offY) - an.y; }
			else { lb.x = w3.x + drag.offX; lb.y = w3.y + drag.offY; }
			updateLabelGeometry(drag.id);
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
	function labelCheckbox(container, labelText, checked, onChange) {
		var label = document.createElement('label'), input = document.createElement('input');
		input.type = 'checkbox'; input.checked = checked;
		input.addEventListener('change', function () { onChange(input.checked); saveToStorage(); refreshLabelText(); });
		label.appendChild(input);
		label.appendChild(document.createTextNode(' ' + labelText));
		container.appendChild(label);
		container.appendChild(document.createElement('br'));
	}
	function wireLabelsPopup() {
		var pc = EngCalcs.pageConfig || {}, nodeBox = document.getElementById('lpn_labels_node_fields'),
			linkBox = document.getElementById('lpn_labels_link_fields');
		document.getElementById('lpn_labels_popup_close').addEventListener('click', function () {
			document.getElementById('lpn_labels_popup').style.display = 'none';
		});
		[
			['id', pc.lpn_field_id || 'ID'], ['elev', pc.lpn_field_elev || 'Elevation'],
			['demand', pc.bpn_demand || 'Demand'], ['head', pc.lpn_result_head || 'Head'],
			['pressure', pc.lpn_result_pressure || 'Pressure']
		].forEach(function (f) {
			labelCheckbox(nodeBox, f[1], labelSettings.node[f[0]], function (v) { labelSettings.node[f[0]] = v; });
		});
		[
			['id', pc.lpn_field_id || 'ID'], ['diameter', pc.lpn_field_diameter || 'Diameter'],
			['length', pc.lpn_field_length || 'Length'], ['flow', pc.lpn_result_flow || 'Flow'],
			['velocity', pc.lpn_result_velocity || 'Velocity'], ['headloss', pc.lpn_result_headloss || 'Head loss']
		].forEach(function (f) {
			labelCheckbox(linkBox, f[1], labelSettings.link[f[0]], function (v) { labelSettings.link[f[0]] = v; });
		});
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
	function unitNumberField(fields, labelText, unitId, getSI, setSI) {
		var f = unitFactor(unitId), label = document.createElement('label'), input = document.createElement('input');
		input.type = 'number'; input.value = (getSI() * f).toFixed(4);
		// scheduleSolve() here, not just inside setSI callbacks, centralizes it for every current
		// and future use of this helper (elev/demand/head's setSI already also calls updateNode(),
		// which itself schedules a solve -- calling it twice is harmless, debounced).
		input.addEventListener('change', function () { setSI(+input.value / f); scheduleSolve(); });
		label.textContent = labelText + ' (' + unitLabel(unitId) + ') ';
		label.appendChild(input);
		fields.appendChild(label);
		fields.appendChild(document.createElement('br'));
	}
	// Read-only, like EPANET's own property-form coordinate display (Tom) -- also doubles as
	// the touch answer to "show coordinates of the selected element": the corner tracker
	// below is hover-driven (PC only), but this field is visible in the popup on any device.
	function readonlyField(fields, labelText, value) {
		var label = document.createElement('label'), span = document.createElement('span');
		span.textContent = typeof value === 'number' ? value.toFixed(2) : value;
		label.textContent = labelText + ' ';
		label.appendChild(span);
		fields.appendChild(label);
		fields.appendChild(document.createElement('br'));
	}
	// SI value -> current display unit, read-only. Used for solve results: the property popups
	// are the canonical results location (Tom, 2026-07-30) -- Map labels and a Report/table view
	// are later presentation layers over this same computed data (scope doc Phase 2), not a
	// separate source of truth.
	function readonlyUnitField(fields, labelText, unitId, siValue) {
		readonlyField(fields, labelText + ' (' + unitLabel(unitId) + ')', siValue * unitFactor(unitId));
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
		input.type = 'number'; input.value = l.length.toFixed(2);
		input.addEventListener('change', function () { l.length = +input.value; l.lenAuto = false; auto.checked = false; scheduleSolve(); });
		auto.type = 'checkbox'; auto.checked = l.lenAuto;
		auto.addEventListener('change', function () {
			l.lenAuto = auto.checked;
			if (l.lenAuto) { l.length = linkGeomLength(l); input.value = l.length.toFixed(2); }
			scheduleSolve();
		});
		label.textContent = (pc.lpn_field_length || 'Length') + ' (' + unitLabel('lpn_u_length') + ') ';
		label.appendChild(input);
		autoLabel.appendChild(auto);
		autoLabel.appendChild(document.createTextNode(' ' + (pc.lpn_field_auto || 'Auto')));
		fields.appendChild(label); fields.appendChild(autoLabel);
		fields.appendChild(document.createElement('br'));
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
		if (!newId || /[\s'"]/.test(newId)) { return pc.lpn_id_invalid || 'ID must be non-empty with no spaces or quotes.'; }
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
		fields.innerHTML = '';
		if (n.type === 'reservoir') {
			unitNumberField(fields, pc.lpn_field_head || 'Fixed head', 'lpn_u_elevhead',
				function () { return n.head; }, function (v) { n.head = v; updateNode(nodeId); });
		} else {
			unitNumberField(fields, pc.lpn_field_elev || 'Elevation', 'lpn_u_elevhead',
				function () { return n.elev; }, function (v) { n.elev = v; updateNode(nodeId); });
			unitNumberField(fields, pc.bpn_demand || 'Demand', 'lpn_u_flow',
				function () { return n.demand; }, function (v) { n.demand = v; updateNode(nodeId); });
			if (lastSolveResult && lastSolveResult.pressures[nodeId] !== undefined) {
				readonlyUnitField(fields, pc.lpn_result_head || 'Head', 'lpn_u_elevhead', lastSolveResult.heads[nodeId]);
				readonlyUnitField(fields, pc.lpn_result_pressure || 'Pressure', 'lpn_u_pressure', lastSolveResult.pressures[nodeId]);
			}
		}
		readonlyField(fields, pc.lpn_field_x || 'X', n.x);
		readonlyField(fields, pc.lpn_field_y || 'Y', n.y);
	}
	function openPopup(nodeId, sx, sy) {
		currentPopup = { kind: 'node', id: nodeId };
		renderNodeFields(nodeId);
		openPopupAt(sx, sy);
	}
	function renderLinkFields(linkId) {
		var l = linkById(linkId), fields = document.getElementById('lpn_popup_fields'), pc = EngCalcs.pageConfig || {};
		idField(l.id, function (newId) { renameLink(linkId, newId); });
		fields.innerHTML = '';
		if (l.type === 'pump') {
			fields.appendChild(document.createTextNode(pc.lpn_pump_notice || 'Pump curve entry is not yet implemented.'));
			fields.appendChild(document.createElement('br'));
		} else {
			unitNumberField(fields, pc.lpn_field_diameter || 'Diameter', 'lpn_u_diameter',
				function () { return l.diameter; }, function (v) { l.diameter = v; });
			numberFieldPlain(fields, pc.lpn_field_roughness || 'Roughness', l.roughness, function (v) { l.roughness = v; });
			lengthField(fields, l);
		}
		if (lastSolveResult && lastSolveResult.flows[linkId] !== undefined) {
			readonlyUnitField(fields, pc.lpn_result_flow || 'Flow', 'lpn_u_flow', lastSolveResult.flows[linkId]);
			readonlyUnitField(fields, pc.lpn_result_velocity || 'Velocity', 'lpn_u_velocity', lastSolveResult.velocities[linkId]);
			// lpn-solver.js stores a pump's headlosses as -(head gain) -- same sign convention as
			// a head LOSS across the link (h_to - h_from), so a pump's actual gain is the negation.
			if (l.type === 'pump') {
				readonlyUnitField(fields, pc.lpn_result_headgain || 'Head gain', 'lpn_u_elevhead', -lastSolveResult.headlosses[linkId]);
			} else {
				readonlyUnitField(fields, pc.lpn_result_headloss || 'Head loss', 'lpn_u_elevhead', lastSolveResult.headlosses[linkId]);
			}
		}
	}
	function openLinkPopup(linkId, sx, sy) {
		currentPopup = { kind: 'link', id: linkId };
		renderLinkFields(linkId);
		openPopupAt(sx, sy);
	}
	// Roughness has no unit selector for now: Phase 1 assumes Hazen-Williams (js/lpn-solver.js's
	// default), whose C-factor is dimensionless. Darcy-Weisbach's roughness HEIGHT does need
	// units (the scope doc's roughness family is "DW only") -- revisit once a friction-method
	// selector exists (matching bpn_'s own method switch) and this can be genuinely conditional.
	function numberFieldPlain(fields, labelText, value, onChange) {
		var label = document.createElement('label'), input = document.createElement('input');
		input.type = 'number'; input.value = value;
		input.addEventListener('change', function () { onChange(+input.value); scheduleSolve(); });
		label.textContent = labelText + ' ';
		label.appendChild(input);
		fields.appendChild(label);
		fields.appendChild(document.createElement('br'));
	}
	function refreshPopupIfOpen() {
		var popup = document.getElementById('lpn_popup');
		if (!currentPopup || popup.style.display !== 'block') { return; }
		if (currentPopup.kind === 'node') { renderNodeFields(currentPopup.id); }
		else { renderLinkFields(currentPopup.id); }
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
	function undo() {
		if (undoStack.length === 0) { return; }
		doc = undoStack.pop();
		nextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };
		doc.nodes.concat(doc.links, doc.labels).forEach(function (x) {
			var m = /^([A-Z])(\d+)$/.exec(x.id);
			if (m && nextId[m[1]] !== undefined) { nextId[m[1]] = Math.max(nextId[m[1]], +m[2] + 1); }
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
	// doc.nodes/doc.links already carry the field names the solver expects (id/type/elev/demand/
	// head for nodes; id/type/from/to/diameter/roughness/length/status/h0/a/b for links) --
	// assembling a model is just wrapping them, no field renaming needed. method is fixed to
	// 'hw' for now (no friction-method selector yet -- see the numberFieldPlain() comment on
	// Roughness). visc is fresh water at ~20C; not user-editable yet.
	var lastSolveResult = null;
	function assembleModel() { return { nodes: doc.nodes, links: doc.links, method: 'hw', visc: 1.007e-6 }; }
	function diagIssueText(issue) {
		var pc = EngCalcs.pageConfig || {};
		if (issue.code === 'no-fixed-head') { return pc.lpn_diag_no_fixed_head || 'Add a Reservoir.'; }
		if (issue.code === 'dangling-link') { return (pc.lpn_diag_dangling_link || 'Dangling link:') + ' ' + issue.ids.join(', '); }
		if (issue.code === 'unreachable') { return (pc.lpn_diag_unreachable || 'Unreachable:') + ' ' + issue.ids.join(', '); }
		return issue.code;
	}
	function setStatus(text) {
		var el = document.getElementById('lpn_status');
		if (el) { el.textContent = text || ''; }
	}
	// Rounds to the same 2 decimals the label actually displays, in the DISPLAY unit -- extrema and
	// decoration must compare on this, not the raw SI value. Two series links carrying what is
	// physically the same flow can differ by solver roundoff far past the 2nd decimal (continuity
	// is satisfied to a tolerance, not bit-exact); comparing un-rounded SI values marked one as max
	// and the other min even though both printed "100.00 gpm" -- a decoration the display can't
	// justify. Rounding first is what fieldExtrema()'s "tie -> no decoration" rule is actually for.
	function displayRound(siValue, unitId) {
		if (typeof siValue !== 'number') { return undefined; } // guards a stray NaN contaminating Math.min/max in fieldExtrema
		return Math.round(siValue * unitFactor(unitId) * 100) / 100;
	}
	// One line of a numeric label field: "Label: 12.34 unit", decorated overline/underline when it
	// ties the network-wide max/min for that field (fieldExtrema()/decorationFor() above).
	function numLine(labelText, siValue, unitId, extrema) {
		var displayValue = displayRound(siValue, unitId);
		return { text: labelText + ': ' + displayValue.toFixed(2) + ' ' + unitLabel(unitId), decoration: decorationFor(extrema, displayValue) };
	}
	// Length is declarative, not SI-converted (see the lengthField() comment above: "1 grid unit IS
	// 1 ft or 1 m, whichever is currently selected, by declaration") -- unlike every other field
	// here, l.length is already in the displayed unit, so this must NOT run it through unitFactor.
	function rawLine(labelText, value, unitId, extrema) {
		var displayValue = Math.round(value * 100) / 100;
		return { text: labelText + ': ' + displayValue.toFixed(2) + ' ' + unitLabel(unitId), decoration: decorationFor(extrema, displayValue) };
	}
	// Rebuilds every node's and link's map-label text from `labelSettings` + `lastSolveResult`.
	// Extrema are computed ONCE per field, network-wide, before any label is built, so every
	// element's decoration is judged against the same snapshot (Tom: ties all get marked, not just
	// the first one found -- decorationFor() already does this per element).
	function refreshLabelText() {
		var pc = EngCalcs.pageConfig || {}, ls = labelSettings, i;
		// Every field below is rounded through the same displayRound()/2-decimal rule the label
		// text itself uses (see the comment on displayRound()), so a tie in what's actually printed
		// is always a tie in what gets decorated.
		var extrema = {
			elev: fieldExtrema(doc.nodes.map(function (n) { return n.type !== 'reservoir' ? displayRound(n.elev, 'lpn_u_elevhead') : undefined; })),
			demand: fieldExtrema(doc.nodes.map(function (n) { return n.type !== 'reservoir' ? displayRound(n.demand, 'lpn_u_flow') : undefined; })),
			head: fieldExtrema(doc.nodes.map(function (n) {
				if (n.type === 'reservoir') { return displayRound(n.head, 'lpn_u_elevhead'); }
				return lastSolveResult ? displayRound(lastSolveResult.heads[n.id], 'lpn_u_elevhead') : undefined;
			})),
			pressure: fieldExtrema(doc.nodes.map(function (n) {
				if (n.type === 'reservoir' || !lastSolveResult) { return undefined; }
				return displayRound(lastSolveResult.pressures[n.id], 'lpn_u_pressure');
			})),
			diameter: fieldExtrema(doc.links.map(function (l) { return l.type !== 'pump' ? displayRound(l.diameter, 'lpn_u_diameter') : undefined; })),
			length: fieldExtrema(doc.links.map(function (l) { return l.type !== 'pump' ? Math.round(l.length * 100) / 100 : undefined; })),
			flow: fieldExtrema(doc.links.map(function (l) { return lastSolveResult ? displayRound(lastSolveResult.flows[l.id], 'lpn_u_flow') : undefined; })),
			velocity: fieldExtrema(doc.links.map(function (l) { return lastSolveResult ? displayRound(lastSolveResult.velocities[l.id], 'lpn_u_velocity') : undefined; })),
			// Displayed value, not the raw stored headloss -- a pump shows head GAIN (-headloss) per
			// the same sign convention as the property popup, so extrema are judged on what's shown.
			headloss: fieldExtrema(doc.links.map(function (l) {
				if (!lastSolveResult || lastSolveResult.headlosses[l.id] === undefined) { return undefined; }
				return displayRound(l.type === 'pump' ? -lastSolveResult.headlosses[l.id] : lastSolveResult.headlosses[l.id], 'lpn_u_elevhead');
			}))
		};
		doc.nodes.forEach(function (n) {
			var ne = nodeEls[n.id]; if (!ne) { return; }
			var lines = [];
			if (ls.node.id) { lines.push({ text: n.id }); }
			if (n.type !== 'reservoir') {
				if (ls.node.elev) { lines.push(numLine(pc.lpn_field_elev || 'Elevation', n.elev, 'lpn_u_elevhead', extrema.elev)); }
				if (ls.node.demand) { lines.push(numLine(pc.bpn_demand || 'Demand', n.demand, 'lpn_u_flow', extrema.demand)); }
			}
			var headSI = n.type === 'reservoir' ? n.head : (lastSolveResult ? lastSolveResult.heads[n.id] : undefined);
			if (ls.node.head && headSI !== undefined) { lines.push(numLine(pc.lpn_result_head || 'Head', headSI, 'lpn_u_elevhead', extrema.head)); }
			if (ls.node.pressure && n.type !== 'reservoir' && lastSolveResult && lastSolveResult.pressures[n.id] !== undefined) {
				lines.push(numLine(pc.lpn_result_pressure || 'Pressure', lastSolveResult.pressures[n.id], 'lpn_u_pressure', extrema.pressure));
			}
			if (lines.length === 0) { lines.push({ text: '' }); } // keep an empty tspan so getBBox() doesn't throw
			setMultilineText(ne.text, n.x + 2, lines);
			ne.lineCount = lines.length;
			try { ne.tw = ne.text.getBBox().width; } catch (err) { /* pre-layout measurement can throw; stale tw stands */ }
		});
		doc.links.forEach(function (l) {
			var le = linkEls[l.id]; if (!le) { return; }
			var lines = [];
			if (ls.link.id) { lines.push({ text: l.id }); }
			if (l.type !== 'pump') {
				if (ls.link.diameter) { lines.push(numLine(pc.lpn_field_diameter || 'Diameter', l.diameter, 'lpn_u_diameter', extrema.diameter)); }
				if (ls.link.length) { lines.push(rawLine(pc.lpn_field_length || 'Length', l.length, 'lpn_u_length', extrema.length)); }
			}
			if (lastSolveResult && lastSolveResult.flows[l.id] !== undefined) {
				if (ls.link.flow) { lines.push(numLine(pc.lpn_result_flow || 'Flow', lastSolveResult.flows[l.id], 'lpn_u_flow', extrema.flow)); }
				if (ls.link.velocity) { lines.push(numLine(pc.lpn_result_velocity || 'Velocity', lastSolveResult.velocities[l.id], 'lpn_u_velocity', extrema.velocity)); }
				if (ls.link.headloss) {
					if (l.type === 'pump') {
						lines.push(numLine(pc.lpn_result_headgain || 'Head gain', -lastSolveResult.headlosses[l.id], 'lpn_u_elevhead', extrema.headloss));
					} else {
						lines.push(numLine(pc.lpn_result_headloss || 'Head loss', lastSolveResult.headlosses[l.id], 'lpn_u_elevhead', extrema.headloss));
					}
				}
			}
			if (lines.length === 0) { lines.push({ text: '' }); }
			setMultilineText(le.text, +le.text.getAttribute('x'), lines);
			le.lineCount = lines.length;
			try { le.tw = le.text.getBBox().width; } catch (err) { /* pre-layout measurement can throw; stale tw stands */ }
		});
		doc.links.forEach(function (l) { updateArrow(l.id); });
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
		var result = EngCalcs.lpnSolve(model);
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
	};

	document.addEventListener('DOMContentLoaded', function () {
		EngCalcs.initTips(document);
		init();
	});
}());
