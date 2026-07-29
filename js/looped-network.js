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

	// The document. nodes: Junction/Reservoir (point elements). links: Pipe/Pump (two
	// endpoints + optional bend vertices). labels: Text elements with a leader to an
	// anchor node, OR a free-floating text with anchorNode === null.
	var doc = { nodes: [], links: [], labels: [] };
	var nextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };

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
		// font-size:2px inline, NOT the .lpn-lbl CSS class's 11px: SVG font-size is interpreted
		// in the local (world-unit) coordinate system, same as any other geometry under this
		// scaled <g> -- an "11-unit" font is enormous next to nodes spaced 10-40 units apart,
		// which is what was actually causing the zoom-extent overflow (not a missing bbox term
		// -- the geometry itself was oversized). Matches the spike's own convention.
		var text = el('text', { x: n.x + 2, y: n.y - 2, 'class': 'lpn-lbl', style: 'font-size:2px' }, nodesLayer);
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
		linkEls[l.id] = { line: line, handles: handles };
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
			'dominant-baseline': 'central', 'data-lbl': lb.id, style: 'font-size:3px'
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
	}
	function updateLinkGeometry(id) {
		var l = linkById(id);
		linkEls[id].line.setAttribute('points', linkPoints(l));
		if (l.lenAuto) { l.length = linkGeomLength(l); }
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
		ne.text.setAttribute('x', n.x + 2); ne.text.setAttribute('y', n.y - 2);
		for (i = 0; i < incidentLinks[id].length; i++) { updateLinkGeometry(incidentLinks[id][i]); }
		for (i = 0; i < labelsByAnchor[id].length; i++) { updateLabelGeometry(labelsByAnchor[id][i]); }
	}
	function updateVertex(linkId, vidx) {
		var l = linkById(linkId), v = l.verts[vidx], h = linkEls[linkId].handles[vidx];
		h.setAttribute('cx', v.x); h.setAttribute('cy', v.y);
		updateLinkGeometry(linkId);
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
		buildLinkEls(l);
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
			var n = doc.nodes[i], r = nodeRadius(n) + 0.2, tw = (nodeEls[n.id] && nodeEls[n.id].tw) || 8;
			inc(n.x - r, n.y - r); inc(n.x + r, n.y + r);
			inc(n.x + 2, n.y - 2 - 2); inc(n.x + 2 + tw, n.y - 2 + 0.6); // the "J1" id label beside the circle
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
			? { id: id, type: type, x: x, y: y, head: 100 }
			: { id: id, type: type, x: x, y: y, elev: 0, demand: 0 };
		doc.nodes.push(n);
		buildNodeEls(n);
		incidentLinks[id] = []; labelsByAnchor[id] = [];
		updateEmptyHint();
		return n;
	}
	function addLink(type, fromId, toId) {
		var prefix = type === 'pump' ? 'P' : 'L', id = prefix + (nextId[prefix]++);
		var l = { id: id, type: type, from: fromId, to: toId, verts: [], diameter: 0.1, roughness: 100, length: 0, lenAuto: true, status: 'open' };
		l.length = linkGeomLength(l);
		doc.links.push(l);
		incidentLinks[fromId].push(id); incidentLinks[toId].push(id);
		buildLinkEls(l);
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
		updateEmptyHint();
	}
	function updateEmptyHint() {
		var hint = document.getElementById('lpn_empty_hint');
		if (hint) { hint.style.display = doc.nodes.length === 0 ? 'block' : 'none'; }
	}
	function deleteLink(id) {
		var l = linkById(id);
		linkEls[id].line.remove();
		linkEls[id].handles.forEach(function (h) { h.remove(); });
		delete linkEls[id];
		incidentLinks[l.from] = incidentLinks[l.from].filter(function (x) { return x !== id; });
		incidentLinks[l.to] = incidentLinks[l.to].filter(function (x) { return x !== id; });
		doc.links = doc.links.filter(function (x) { return x.id !== id; });
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
		updateEmptyHint();
		zoomExtent();
		requestAnimationFrame(tick);
	}

	function wireToolbar() {
		var toolbar = document.getElementById('lpn_toolbar'), i;
		var tools = [
			{ mode: 'select', key: 'lpn_tool_select' },
			{ mode: 'add-junction', key: 'lpn_tool_add_junction' },
			{ mode: 'add-reservoir', key: 'lpn_tool_add_reservoir' },
			{ mode: 'add-pipe', key: 'lpn_tool_add_pipe' },
			{ mode: 'add-pump', key: 'lpn_tool_add_pump' },
			{ mode: 'add-text', key: 'lpn_tool_add_text' },
			{ mode: 'delete', key: 'lpn_tool_delete' }
		];
		var pc = EngCalcs.pageConfig || {};
		setModeUI = function () {
			toolbar.querySelectorAll('button[data-tool]').forEach(function (b) {
				b.setAttribute('aria-pressed', b.dataset.tool === mode ? 'true' : 'false');
			});
		};
		for (i = 0; i < tools.length; i++) {
			(function (t) {
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
				toolbar.appendChild(btn);
			}(tools[i]));
		}
		var extentBtn = document.createElement('button');
		extentBtn.type = 'button';
		extentBtn.textContent = pc.lpn_tool_zoom_extent || 'Zoom Extent';
		extentBtn.addEventListener('click', zoomExtent);
		toolbar.appendChild(extentBtn);

		var exampleBtn = document.createElement('button');
		exampleBtn.type = 'button';
		exampleBtn.textContent = pc.lpn_tool_example || 'Draw example network';
		exampleBtn.addEventListener('click', drawExampleNetwork);
		toolbar.appendChild(exampleBtn);

		var undoBtn = document.createElement('button');
		undoBtn.type = 'button';
		undoBtn.textContent = pc.lpn_tool_undo || 'Undo';
		undoBtn.addEventListener('click', undo);
		toolbar.appendChild(undoBtn);
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
		j1.elev = 10; j1.demand = 0;
		addLink('pump', r.id, j1.id);
		var j2 = addNode('junction', 40, 15);
		j2.elev = 8; j2.demand = 0.01;
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
			if (mode === 'add-junction') { saveUndoSnapshot(); addNode('junction', w.x, w.y); }
			else if (mode === 'add-reservoir') { saveUndoSnapshot(); addNode('reservoir', w.x, w.y); }
			else if (mode === 'add-text') { saveUndoSnapshot(); addText(w.x, w.y); }
			else if (mode === 'add-pipe' || mode === 'add-pump') {
				if (t.dataset.node) {
					if (!pendingLinkFrom) { pendingLinkFrom = t.dataset.node; }
					else if (t.dataset.node !== pendingLinkFrom) {
						saveUndoSnapshot();
						addLink(mode === 'add-pump' ? 'pump' : 'pipe', pendingLinkFrom, t.dataset.node);
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
				openLinkPopup(t.dataset.link, e.clientX, e.clientY);
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

	// ---- minimal property popup ----
	// Real, not a stub: id (readonly) plus the fields that already exist on the element
	// (Elevation+Demand for a junction, Fixed head for a reservoir, Diameter+Roughness+Length
	// for a pipe). Pump curve entry isn't implemented -- see the scope doc's design note.
	var currentPopup = null; // {kind:'node'|'link', id} -- lets a unit-strip change refresh the open popup in place
	function wirePopup() {
		document.getElementById('lpn_popup_close').addEventListener('click', function () {
			document.getElementById('lpn_popup').style.display = 'none';
			currentPopup = null;
		});
	}
	function unitNumberField(fields, labelText, unitId, getSI, setSI) {
		var f = unitFactor(unitId), label = document.createElement('label'), input = document.createElement('input');
		input.type = 'number'; input.value = (getSI() * f).toFixed(4);
		input.addEventListener('change', function () { setSI(+input.value / f); });
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
		input.addEventListener('change', function () { l.length = +input.value; l.lenAuto = false; auto.checked = false; });
		auto.type = 'checkbox'; auto.checked = l.lenAuto;
		auto.addEventListener('change', function () {
			l.lenAuto = auto.checked;
			if (l.lenAuto) { l.length = linkGeomLength(l); input.value = l.length.toFixed(2); }
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
	}
	function renameLink(oldId, newId) {
		var l = linkById(oldId);
		l.id = newId;
		linkEls[newId] = linkEls[oldId]; delete linkEls[oldId];
		linkEls[newId].line.setAttribute('data-link', newId);
		linkEls[newId].handles.forEach(function (h) { h.setAttribute('data-link', newId); });
		currentPopup = { kind: 'link', id: newId };
		renderLinkFields(newId);
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
		input.addEventListener('change', function () { onChange(+input.value); });
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

	// One-step undo (Tom, after losing a deleted pipe's data). A full multi-step undo with a
	// deeper history is ROADMAP Task 146 Phase 1's own listed scope ("Ctrl-Z... 20 in-memory
	// snapshots") -- this single-slot version is a cheap, immediate safety net pending that.
	var undoSnapshot = null;
	function saveUndoSnapshot() { undoSnapshot = JSON.parse(JSON.stringify(doc)); }
	function undo() {
		if (!undoSnapshot) { return; }
		doc = JSON.parse(JSON.stringify(undoSnapshot));
		undoSnapshot = null;
		nextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };
		doc.nodes.concat(doc.links, doc.labels).forEach(function (x) {
			var m = /^([A-Z])(\d+)$/.exec(x.id);
			if (m && nextId[m[1]] !== undefined) { nextId[m[1]] = Math.max(nextId[m[1]], +m[2] + 1); }
		});
		buildDom();
		updateEmptyHint();
	}
	document.addEventListener('keydown', function (e) {
		if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
	});

	// calcAndSave() calls this unconditionally -- from the units strip's own selects
	// (echoUnitSelect() hardcodes onchange="EngCalcs.submitForm()") and from echoUnitsRow()'s
	// US/SI preset buttons. Re-render the open popup in place so switching units doesn't leave
	// it showing a stale-unit number. The real debounced GGA solve wiring is still to come.
	EngCalcs.pageCalculator = function (objForm) {
		refreshPopupIfOpen();
	};

	document.addEventListener('DOMContentLoaded', function () {
		EngCalcs.initTips(document);
		init();
	});
}());
