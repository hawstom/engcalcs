// lpn-placer-d.js -- bake-off label placer "D" for the Looped Pipe Network map.
//
// A pure function of one view, per dev/lpn-spike/label-bench/contract.js: the network, the symbols,
// each label's measured rows and the view go in; each label's position, shown rows and leader come
// out. No DOM, no text measurement, no closure over the editor. Everything is in VIEW PIXELS.
//
// How it works, in one paragraph. Every label gets a list of CANDIDATES: each drop level (all rows,
// then the user's drop order applied one row at a time down to the ID alone) crossed with the
// places it could hang -- touching its node on eight sides, beside its pipe (along it or level),
// or further out on a straight leader or a leader with the one standard hook. A candidate's worth
// is the rows it shows (the label itself worth four rows, so rows go before labels), less the
// crossings it makes in Tom's cost order, less a little for distance from home. Hard rules
// (N1, N3, N4, N5, the viewport) are never traded: a candidate that breaks one is not a candidate.
// A greedy pass seats the hardest-placed labels first; a repair pass then tries to show more of
// every short-changed label by moving (or trimming) at most two neighbours out of its way, and a
// polish pass lets every label re-seat itself to cut crossings. The previous view's placement is
// offered back to each label with a small bonus, so a label only moves when that buys something.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

var EngCalcs = EngCalcs || {};

EngCalcs.lpnPlacerD = (function () {
	'use strict';

	// ---- tuning --------------------------------------------------------------------------------
	var TOL = 1.0;          // box overlap tolerated as leading (the bench tolerates 1.5)
	var GAP = 1.5;          // clearance between a node symbol and text touching it
	var PIPE_GAP = 3;       // clearance between a pipe and a label beside it
	var CELL = 48;          // spatial grid cell, px
	var PADX = 8, PADY = 3; // clearance between two different labels, so each reads as its own

	// Worth, in one currency. A shown row is 10; the label itself (its ID) is 40, so every property
	// row goes before any label does (G, R1). Costs follow Tom's order, worst first.
	var V_LABEL = 40, V_ROW = 10, V_ROW_ORDER = 0.5;
	var C_LEADER_LEADER = 90, C_LABEL_LEADER = 80, C_LABEL_PIPE = 9, C_LEADER_PIPE = 2;
	var C_LABEL_OWN_PIPE = 4;       // R7: beside its pipe, not on it
	var C_ARROW = 0.8;              // text on a flow arrow (not scored; ugly)
	var C_LEADER_LINKSYM = 5;       // a leader through a pump or valve (not N3; ugly)
	var C_LEADER_BASE = 0.4, C_LEADER_PER_ROW = 0.45;   // nearness (R1: first to give way)
	var C_ALT_LAYOUT = 0.8;         // the label's other shape (line for a node, stack for a pipe)
	var B_KEEP = 6;                 // keeping last view's rows on a zoom-in (R11)
	var B_STICK = 6;                // staying where it was last view (no churn for nothing)
	var HARD_HAND = 1000;           // a hand-placed label cannot move: hard hits become costs

	var DIRS = 8;
	var DISTS = [1, 2.2, 3.8];          // leader lengths beyond the symbol, in row heights
	var MAX_EVALS = 25000;                 // work cap per place(); deterministic, not wall-clock
	var TRIES = 2;                          // blocked places a short-changed label tries per level
	var PASSES = 1;
	var DIRSET = [];
	(function () {
		for (var k = 0; k < DIRS; k++) {
			var th = k * 2 * Math.PI / DIRS;
			DIRSET.push([Math.round(Math.cos(th) * 1e9) / 1e9, Math.round(Math.sin(th) * 1e9) / 1e9]);
		}
	}());

	// ---- boxes and segments --------------------------------------------------------------------
	function mkBox(cx, cy, w, h, angDeg) {
		var a = angDeg || 0, r = a * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
		var hw = w / 2, hh = h / 2;
		var ex = hw * Math.abs(c) + hh * Math.abs(s), ey = hw * Math.abs(s) + hh * Math.abs(c);
		return { cx: cx, cy: cy, hw: hw, hh: hh, c: c, s: s, rot: a !== 0, rep: false,
			x0: cx - ex, y0: cy - ey, x1: cx + ex, y1: cy + ey };
	}
	function rectBox(r) { return mkBox(r.x + r.w / 2, r.y + r.h / 2, r.w, r.h, 0); }
	function oBox(b) { return mkBox(b.cx, b.cy, b.w, b.h, b.angle || 0); }

	// Two boxes overlap by more than tol on every separating axis.
	function boxesOverlap(a, b, tol) {
		if (Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) <= tol) { return false; }
		if (Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) <= tol) { return false; }
		if (!a.rot && !b.rot) { return true; }
		var dx = b.cx - a.cx, dy = b.cy - a.cy;
		return sepAxis(a, b, dx, dy, a.c, a.s, tol) && sepAxis(a, b, dx, dy, -a.s, a.c, tol) &&
			sepAxis(a, b, dx, dy, b.c, b.s, tol) && sepAxis(a, b, dx, dy, -b.s, b.c, tol);
	}
	// Do the projections of a and b on the axis (ax, ay) overlap by more than tol?
	function sepAxis(a, b, dx, dy, ax, ay, tol) {
		var ra = a.hw * Math.abs(ax * a.c + ay * a.s) + a.hh * Math.abs(-ax * a.s + ay * a.c);
		var rb = b.hw * Math.abs(ax * b.c + ay * b.s) + b.hh * Math.abs(-ax * b.s + ay * b.c);
		return ra + rb - Math.abs(dx * ax + dy * ay) > tol;
	}

	// Does segment a-b pass through the inside of box b shrunk by `shrink` (negative grows it)?
	function segHitsBox(ax, ay, bx, by, b, shrink) {
		var m = shrink < 0 ? -shrink * 1.5 : 0;
		if (Math.max(ax, bx) <= b.x0 - m || Math.min(ax, bx) >= b.x1 + m ||
			Math.max(ay, by) <= b.y0 - m || Math.min(ay, by) >= b.y1 + m) { return false; }
		var hw = b.hw - shrink, hh = b.hh - shrink;
		if (hw <= 0 || hh <= 0) { return false; }
		var x0 = ax - b.cx, y0 = ay - b.cy, x1 = bx - b.cx, y1 = by - b.cy, t;
		if (b.rot) {
			t = x0 * b.c + y0 * b.s; y0 = -x0 * b.s + y0 * b.c; x0 = t;
			t = x1 * b.c + y1 * b.s; y1 = -x1 * b.s + y1 * b.c; x1 = t;
		}
		// Liang-Barsky, one slab at a time.
		var dx = x1 - x0, dy = y1 - y0;
		CLIP[0] = 0; CLIP[1] = 1;
		return clip(-dx, x0 + hw) && clip(dx, hw - x0) && clip(-dy, y0 + hh) && clip(dy, hh - y0) && CLIP[0] < CLIP[1];
	}
	var CLIP = [0, 1];
	function clip(p, q) {
		if (p === 0) { return q > 0; }
		var r = q / p;
		if (p < 0) { if (r > CLIP[0]) { CLIP[0] = r; } } else if (r < CLIP[1]) { CLIP[1] = r; }
		return CLIP[0] < CLIP[1];
	}

	function orient(ax, ay, bx, by, cx, cy) { return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax); }
	// Proper crossing of a-b and c-d; returns the parameter along a-b, or -1.
	function segCross(ax, ay, bx, by, cx, cy, dx, dy) {
		var d1 = orient(cx, cy, dx, dy, ax, ay), d2 = orient(cx, cy, dx, dy, bx, by);
		if ((d1 > 0) === (d2 > 0) || d1 === 0 || d2 === 0) { return -1; }
		var d3 = orient(ax, ay, bx, by, cx, cy), d4 = orient(ax, ay, bx, by, dx, dy);
		if ((d3 > 0) === (d4 > 0) || d3 === 0 || d4 === 0) { return -1; }
		return d1 / (d1 - d2);
	}

	// ---- a uniform grid over the view ------------------------------------------------------------
	function Grid(vp, cell) {
		this.cs = cell || CELL;
		this.x0 = vp.x - this.cs * 4; this.y0 = vp.y - this.cs * 4;
		this.nx = Math.ceil((vp.w + this.cs * 8) / this.cs); this.ny = Math.ceil((vp.h + this.cs * 8) / this.cs);
		this.cells = new Array(this.nx * this.ny);
		this.stamp = 0;
	}
	// Sets this.i0..j1 to the cells a box meets; false if none.
	Grid.prototype.range = function (x0, y0, x1, y1) {
		var cs = this.cs, i0 = Math.floor((x0 - this.x0) / cs), i1 = Math.floor((x1 - this.x0) / cs);
		var j0 = Math.floor((y0 - this.y0) / cs), j1 = Math.floor((y1 - this.y0) / cs);
		if (i1 < 0 || j1 < 0 || i0 >= this.nx || j0 >= this.ny || !(i1 >= i0 && j1 >= j0)) { return false; }
		this.i0 = i0 < 0 ? 0 : i0; this.j0 = j0 < 0 ? 0 : j0;
		this.i1 = i1 >= this.nx ? this.nx - 1 : i1; this.j1 = j1 >= this.ny ? this.ny - 1 : j1;
		return true;
	};
	Grid.prototype.add = function (item, x0, y0, x1, y1) {
		if (!this.range(x0, y0, x1, y1)) { return; }
		for (var j = this.j0; j <= this.j1; j++) {
			for (var i = this.i0; i <= this.i1; i++) {
				var k = j * this.nx + i;
				(this.cells[k] || (this.cells[k] = [])).push(item);
			}
		}
	};
	Grid.prototype.remove = function (item, x0, y0, x1, y1) {
		if (!this.range(x0, y0, x1, y1)) { return; }
		for (var j = this.j0; j <= this.j1; j++) {
			for (var i = this.i0; i <= this.i1; i++) {
				var c = this.cells[j * this.nx + i], n = c ? c.indexOf(item) : -1;
				if (n >= 0) { c.splice(n, 1); }
			}
		}
	};
	// Fills `out` with each item whose cells meet the box, once, and returns it.
	Grid.prototype.query = function (x0, y0, x1, y1, out) {
		out.length = 0;
		if (!this.range(x0, y0, x1, y1)) { return out; }
		var st = ++this.stamp, i1 = this.i1, j1 = this.j1, nx = this.nx, cells = this.cells;
		for (var j = this.j0; j <= j1; j++) {
			for (var i = this.i0; i <= i1; i++) {
				var c = cells[j * nx + i];
				if (!c) { continue; }
				for (var n = 0; n < c.length; n++) {
					var it = c[n];
					if (it.st !== st) { it.st = st; out.push(it); }
				}
			}
		}
		return out;
	};
	// ---- polylines -------------------------------------------------------------------------------
	function cumLengths(pts) {
		var cum = [0];
		for (var i = 1; i < pts.length; i++) {
			cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
		}
		return cum;
	}
	function pointAt(pts, cum, s) {
		var i = 1;
		while (i < pts.length - 1 && cum[i] < s) { i++; }
		var a = pts[i - 1], b = pts[i], L = cum[i] - cum[i - 1] || 1, t = Math.max(0, Math.min(1, (s - cum[i - 1]) / L));
		var ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
		if (!isFinite(ux) || (!ux && !uy)) { ux = 1; uy = 0; }
		return { x: a[0] + t * (b[0] - a[0]), y: a[1] + t * (b[1] - a[1]), ux: ux, uy: uy };
	}
	function nearestOnPolyline(pts, px, py) {
		var best = null, bd = Infinity;
		for (var i = 1; i < pts.length; i++) {
			var a = pts[i - 1], b = pts[i], vx = b[0] - a[0], vy = b[1] - a[1], L2 = vx * vx + vy * vy;
			var t = L2 ? ((px - a[0]) * vx + (py - a[1]) * vy) / L2 : 0;
			t = Math.max(0, Math.min(1, t));
			var x = a[0] + t * vx, y = a[1] + t * vy, d = Math.hypot(px - x, py - y);
			if (d < bd) { bd = d; best = [x, y]; }
		}
		return best;
	}

	// ---- the lettering of one row set ------------------------------------------------------------
	// Block size and each row's vertical middle, for a stack or a line.
	function dims(req, rows, layout, text) {
		var w = 0, h = 0, mids = [], i, r;
		if (layout === 'line') {
			for (i = 0; i < rows.length; i++) { r = req.rows[rows[i]]; w += r.w; h = Math.max(h, r.h); }
			w += (rows.length - 1) * text.separatorW;
			return { w: w, h: h, mids: [h / 2] };
		}
		for (i = 0; i < rows.length; i++) { r = req.rows[rows[i]]; w = Math.max(w, r.w); mids.push(h + r.h / 2); h += r.h; }
		return { w: w, h: h, mids: mids };
	}

	// The drop levels: level 0 shows every row; each further level drops the next field in the
	// user's drop order. A row whose field is not in the order (the ID) is never dropped.
	function levelsOf(req, dropOrder) {
		var order = (dropOrder && dropOrder[req.kind]) || [], present = [], dropped = {}, out = [], k, i;
		for (k = 0; k < order.length; k++) {
			for (i = 0; i < req.rows.length; i++) { if (req.rows[i].field === order[k]) { present.push(order[k]); break; } }
		}
		for (k = 0; k <= present.length; k++) {
			var rows = [], val = V_LABEL;
			for (i = 0; i < req.rows.length; i++) {
				var f = req.rows[i].field;
				if (dropped[f]) { continue; }
				rows.push(i);
				if (f === 'id') { continue; }
				var pos = order.indexOf(f);
				val += V_ROW + (pos >= 0 ? V_ROW_ORDER * pos : V_ROW_ORDER * order.length);
			}
			if (rows.length) { out.push({ rows: rows, value: val }); }
			if (k < present.length) { dropped[present[k]] = true; }
		}
		return out;
	}

	// ---- the placer ------------------------------------------------------------------------------
	// A placer instance per project. It keeps its raster buffers across views, and (hint H-b)
	// uses a pause to lay out a view it has been shown but not yet asked for -- the project's
	// opening view -- so that view costs nothing when it is asked for. The cache is keyed on the
	// whole input, so any change to the network, the text or the settings misses it (R13).
	function create() {
		var mem = { occ: null, sat: null }, cache = null;
		function keyOf(scene, opts) {
			var p = opts && opts.prev;
			return JSON.stringify(scene) + '|' + (p ? JSON.stringify(p.layout) : '');
		}
		return {
			name: 'D (candidate search, ejection repair, sticky)',
			place: function (scene, opts) {
				if (cache && cache.scene === scene) {
					var k = keyOf(scene, opts);
					if (k === cache.key) { var out = cache.out; cache = null; return out; }
				}
				cache = null;
				return place(scene, opts, mem);
			},
			idle: function (budgetMs, info) {
				if (!info || !info.opening || !info.scene || budgetMs < 500) { return; }
				var scene = info.scene;
				cache = { scene: scene, key: keyOf(scene, null), out: place(scene, null, mem) };
			}
		};
	}

	function place(scene, opts, mem) {
		var text = scene.text, vp = scene.viewport, rowH = text.rowHeightPx || 14.4;
		var hookLen = Math.min(text.hookMaxPx || 0, 9);
		var spacing = text.repeatSpacingPx || 0;
		var evals = 0;
		var DBG = typeof process !== 'undefined' && process.env && process.env.PD_DEBUG, T0 = Date.now(), tl = [];
		function mark(k) { if (DBG) { tl.push(k + ' ' + (Date.now() - T0) + 'ms/' + evals + '/' + nDyn + '/' + nGen); } }

		// ---- the fixed world: symbols and Text objects (hard), pipes, arrows, callouts (soft) ----
		var hardG = new Grid(vp), softG = new Grid(vp), nodesById = {}, linksById = {}, custById = {};
		var hardRects = [], qa = [], qb = [];
		// Every indexed thing has one shape, so the hot loops stay monomorphic.
		function Item(t, node, link, b, ax, ay, bx, by) {
			this.t = t; this.node = node; this.link = link; this.b = b;
			this.ax = ax; this.ay = ay; this.bx = bx; this.by = by; this.st = 0; this.li = -1; this.c = null;
		}
		function addHard(it, b) { hardG.add(it, b.x0, b.y0, b.x1, b.y1); hardRects.push(b); }
		scene.nodes.forEach(function (n) {
			nodesById[n.id] = n;
			var sb = rectBox(n.symbol);
			addHard(new Item('sym', n.id, null, sb, 0, 0, 0, 0), sb);
		});
		scene.links.forEach(function (l) {
			linksById[l.id] = l;
			(l.symbols || []).forEach(function (s) { var b = oBox(s); addHard(new Item('lsym', null, l.id, b, 0, 0, 0, 0), b); });
			(l.arrows || []).forEach(function (s) { var b = oBox(s); softG.add(new Item('arrow', null, l.id, b, 0, 0, 0, 0), b.x0, b.y0, b.x1, b.y1); });
			for (var i = 1; i < l.points.length; i++) {
				var a = l.points[i - 1], b = l.points[i];
				softG.add(new Item('pipe', null, l.id, null, a[0], a[1], b[0], b[1]),
					Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1]));
			}
		});
		(scene.texts || []).forEach(function (t) {
			var tb = oBox(t.box);
			addHard(new Item('text', null, null, tb, 0, 0, 0, 0), tb);
			var L = t.leader;
			for (var i = 1; L && i < L.length; i++) {
				softG.add(new Item('tlead', null, null, null, L[i - 1][0], L[i - 1][1], L[i][0], L[i][1]),
					Math.min(L[i - 1][0], L[i][0]), Math.min(L[i - 1][1], L[i][1]), Math.max(L[i - 1][0], L[i][0]), Math.max(L[i - 1][1], L[i][1]));
			}
		});
		(scene.customers || []).forEach(function (c) { custById[c.id] = c; });

		// ---- the free-space model: two summed-area tables of every symbol and Text object ----
		// Cells of RC px over the view. TOUCHED marks a cell any obstacle touches, so a box whose
		// touched sum is zero is clear; CORE marks a cell lying wholly inside an obstacle, so a box
		// holding a core cell is blocked. Only a box neither table decides gets the exact test.
		var RC = 2, RW = Math.max(1, Math.ceil(vp.w / RC)), RH = Math.max(1, Math.ceil(vp.h / RC)), SW = RW + 1;
		if (!mem.occ || mem.occ.length !== RW * RH) {
			mem.occ = new Uint8Array(RW * RH); mem.core = new Uint8Array(RW * RH);
			mem.sat = new Int32Array(SW * (RH + 1)); mem.csat = new Int32Array(SW * (RH + 1));
		} else { mem.occ.fill(0); mem.core.fill(0); }
		var occ = mem.occ, core = mem.core, sat = mem.sat, csat = mem.csat;
		hardRects.forEach(function (b) {
			var fx0 = (b.x0 - vp.x) / RC, fx1 = (b.x1 - vp.x) / RC, fy0 = (b.y0 - vp.y) / RC, fy1 = (b.y1 - vp.y) / RC, j;
			var i0 = Math.max(0, Math.floor(fx0)), i1 = Math.min(RW, Math.ceil(fx1));
			var j0 = Math.max(0, Math.floor(fy0)), j1 = Math.min(RH, Math.ceil(fy1));
			for (j = j0; j < j1; j++) { if (i1 > i0) { occ.fill(1, j * RW + i0, j * RW + i1); } }
			if (b.rot) { return; }
			i0 = Math.max(0, Math.ceil(fx0)); i1 = Math.min(RW, Math.floor(fx1));
			j0 = Math.max(0, Math.ceil(fy0)); j1 = Math.min(RH, Math.floor(fy1));
			for (j = j0; j < j1; j++) { if (i1 > i0) { core.fill(1, j * RW + i0, j * RW + i1); } }
		});
		(function () {
			for (var j = 0; j < RH; j++) {
				var run = 0, crun = 0, o = j * RW, s0 = j * SW, s1 = (j + 1) * SW;
				for (var i = 0; i < RW; i++) {
					run += occ[o + i]; sat[s1 + i + 1] = sat[s0 + i + 1] + run;
					crun += core[o + i]; csat[s1 + i + 1] = csat[s0 + i + 1] + crun;
				}
			}
		}());
		function satSum(t, i0, j0, i1, j1) {
			i0 = Math.max(0, i0); j0 = Math.max(0, j0); i1 = Math.min(RW, i1); j1 = Math.min(RH, j1);
			if (i1 <= i0 || j1 <= j0) { return 0; }
			return t[j1 * SW + i1] - t[j0 * SW + i1] - t[j1 * SW + i0] + t[j0 * SW + i0];
		}
		// Does an unturned box overlap a symbol or Text object by more than TOL?
		function rasterRect(x0, y0, x1, y1) {
			var a0 = (x0 + TOL - vp.x) / RC, a1 = (x1 - TOL - vp.x) / RC, b0 = (y0 + TOL - vp.y) / RC, b1 = (y1 - TOL - vp.y) / RC;
			if (a1 <= a0 || b1 <= b0) { return false; }
			if (!satSum(sat, Math.floor(a0), Math.floor(b0), Math.ceil(a1), Math.ceil(b1))) { return false; }
			if (satSum(csat, Math.ceil(a0), Math.ceil(b0), Math.floor(a1), Math.floor(b1))) { return true; }
			var box = mkBox((x0 + x1) / 2, (y0 + y1) / 2, x1 - x0, y1 - y0, 0), q = hardG.query(x0, y0, x1, y1, qa);
			for (var n = 0; n < q.length; n++) { if (boxesOverlap(box, q[n].b, TOL)) { return true; } }
			return false;
		}
		function rasterHit(b) { return rasterRect(b.x0, b.y0, b.x1, b.y1); }
		mark('world');

		var reqs = scene.labels, N = reqs.length;
		var prev = opts && opts.prev, prevReq = {}, prevPl = (prev && prev.layout && prev.layout.labels) || {};
		if (prev && prev.scene) { prev.scene.labels.forEach(function (r) { prevReq[r.id] = r; }); }

		// R11: on a zoom-in, a label keeps what it showed last view unless keeping it costs more
		// than this; what it gains is then a bonus on top.
		var zoomIn = !!(prev && prev.scene && prev.scene.view && scene.view && scene.view.s > prev.scene.view.s * 1.001);
		function keepBonus(li, lv) {
			if (!zoomIn) { return 0; }
			var pl = prevPl[reqs[li].id];
			if (!pl || !pl.shown) { return 0; }
			return lv.rows.length >= pl.rows.length ? B_KEEP : 0;
		}

		// ---- candidates ----
		function Cand(li, lv, layout, align, x, y, w, h, angle, leader, pref) {
			this.li = li; this.lv = lv; this.layout = layout; this.align = align;
			this.x = x; this.y = y; this.w = w; this.h = h; this.angle = angle || 0; this.leader = leader;
			this.reps = null; this.boxes = null; this.fx = undefined; this.ok = false; this.stick = false;
			this.bl = null; this.items = null; this.st = 0;
			this.x0 = 0; this.y0 = 0; this.x1 = 0; this.y1 = 0; this.bx0 = 0; this.by0 = 0; this.bx1 = 0; this.by1 = 0;
			var len = 0;
			if (leader) {
				for (var i = 1; i < leader.length; i++) { len += Math.hypot(leader[i][0] - leader[i - 1][0], leader[i][1] - leader[i - 1][1]); }
				pref += C_LEADER_BASE + C_LEADER_PER_ROW * len / rowH;
			}
			this.base = lv.value - pref + keepBonus(li, lv);
		}

		// Ink of a candidate: one box per stacked row (the staircase), one for a line, and the same
		// for every repeat along a long pipe.
		function build(c) {
			CNT.build++;
			var req = reqs[c.li], out = [];
			function at(x, y, ang, rep) {
				var bcx = x + c.w / 2, bcy = y + c.h / 2, r = ang * Math.PI / 180, co = Math.cos(r), si = Math.sin(r);
				function put(cx, cy, w, h) {
					var dx = cx - bcx, dy = cy - bcy, b = mkBox(bcx + dx * co - dy * si, bcy + dx * si + dy * co, w, h, ang);
					b.rep = rep; out.push(b);
				}
				if (c.layout === 'line') { put(bcx, bcy, c.w, c.h); return; }
				var top = y, rows = c.lv.rows;
				for (var i = 0; i < rows.length; i++) {
					var rw = req.rows[rows[i]].w, rh = req.rows[rows[i]].h;
					var left = c.align === 'right' ? x + c.w - rw : (c.align === 'center' ? x + (c.w - rw) / 2 : x);
					put(left + rw / 2, top + rh / 2, rw, rh);
					top += rh;
				}
			}
			at(c.x, c.y, c.angle, false);
			(c.reps || []).forEach(function (r) { at(r.x, r.y, r.angle, true); });
			c.boxes = out;
			var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, i;
			for (i = 0; i < out.length; i++) {
				var b = out[i];
				if (b.x0 < x0) { x0 = b.x0; } if (b.y0 < y0) { y0 = b.y0; } if (b.x1 > x1) { x1 = b.x1; } if (b.y1 > y1) { y1 = b.y1; }
			}
			c.bx0 = x0; c.by0 = y0; c.bx1 = x1; c.by1 = y1;
			for (i = 0; c.leader && i < c.leader.length; i++) {
				var p = c.leader[i];
				if (p[0] < x0) { x0 = p[0]; } if (p[1] < y0) { y0 = p[1]; } if (p[0] > x1) { x1 = p[0]; } if (p[1] > y1) { y1 = p[1]; }
			}
			c.x0 = x0; c.y0 = y0; c.x1 = x1; c.y1 = y1;
		}

		// The fixed cost of a candidate against the fixed world: NaN if it breaks a hard rule.
		// `hand` turns hard hits into large costs instead (a hand label cannot be refused).
		function fixedCost(c, hand) {
			build(c);
			var req0 = reqs[c.li];
			evals++;
			var req = reqs[c.li], ownLink = req.kind === 'link' ? req.owner : null;
			var ownNode = req.kind === 'node' ? req.owner : null;
			var boxes = c.boxes, nb = boxes.length, bad = null, hard = 0, cost = 0, i, j, b, it, n, q;
			// Hard: inside the view, clear of every symbol and Text object (N1, N5).
			for (i = 0; i < nb; i++) {
				b = boxes[i];
				// A repeat may lie off screen (it is still kept clear of everything).
				var hit = !b.rep && (b.x0 < vp.x + 1 || b.y0 < vp.y + 1 || b.x1 > vp.x + vp.w - 1 || b.y1 > vp.y + vp.h - 1);
				if (!hit) {
					if (!b.rot && !hand) { hit = rasterHit(b); } else {
						q = hardG.query(b.x0, b.y0, b.x1, b.y1, qa);
						for (n = 0; n < q.length; n++) { if (boxesOverlap(b, q[n].b, TOL)) { hit = true; if (hand) { hard++; } else { break; } } }
						if (hand) { hit = false; }
					}
				}
				if (!hit) { continue; }
				if (!b.rep && !hand) { return NaN; }
				(bad || (bad = []))[i] = true;
			}
			// Leaders: never through another node's symbol (N3), nor a Text object.
			var L = c.leader;
			for (j = 1; L && j < L.length; j++) {
				var ax = L[j - 1][0], ay = L[j - 1][1], bx = L[j][0], by = L[j][1];
				q = hardG.query(Math.min(ax, bx), Math.min(ay, by), Math.max(ax, bx), Math.max(ay, by), qa);
				for (n = 0; n < q.length; n++) {
					it = q[n];
					if (it.t === 'sym') {
						if (it.node === ownNode || !segHitsBox(ax, ay, bx, by, it.b, -1)) { continue; }
					} else if (it.t === 'text') {
						if (!segHitsBox(ax, ay, bx, by, it.b, -1)) { continue; }
					} else {
						continue;
					}
					if (!hand) { return NaN; }
					hard++;
				}
			}
			if (bad) {
				// Leave off the repeats that do not fit.
				var per = c.layout === 'line' ? 1 : c.lv.rows.length, reps = [];
				for (i = 0; c.reps && i < c.reps.length; i++) {
					var ok = true;
					for (var k = 0; k < per; k++) { if (bad[per * (i + 1) + k]) { ok = false; } }
					if (ok) { reps.push(c.reps[i]); }
				}
				c.reps = reps.length ? reps : null;
				build(c);
				boxes = c.boxes; nb = boxes.length;
			}
			return softCost(c) + hard * HARD_HAND;
		}

		// Is a (non-hand) candidate clear of the fixed world? Unturned text is tested against the
		// free-space raster row by row without building anything; turned text, repeats and leaders
		// take the exact tests.
		function blockFree(req, rows, layout, d, align, x, y) {
			evals++;
			if (x < vp.x + 1 || y < vp.y + 1 || x + d.w > vp.x + vp.w - 1 || y + d.h > vp.y + vp.h - 1) { return false; }
			if (layout === 'line') { return !rasterRect(x, y, x + d.w, y + d.h); }
			for (var i = 0, top = y; i < rows.length; i++) {
				var rw = req.rows[rows[i]].w, rh = req.rows[rows[i]].h;
				var left = align === 'right' ? x + d.w - rw : (align === 'center' ? x + (d.w - rw) / 2 : x);
				if (rasterRect(left, top, left + rw, top + rh)) { return false; }
				top += rh;
			}
			return true;
		}
		function hardOK(c) {
			if (c.angle || c.reps) { var f = fixedCost(c, false); if (f === f) { c.fx = f; return true; } return false; }
			if (!blockFree(reqs[c.li], c.lv.rows, c.layout, c, c.align, c.x, c.y)) { return false; }
			return !c.leader || leaderFree(c.leader, reqs[c.li].kind === 'node' ? reqs[c.li].owner : null);
		}
		function leaderFree(L, ownNode) {
			for (var j = 1; j < L.length; j++) {
				if (!segFree(L[j - 1][0], L[j - 1][1], L[j][0], L[j][1], ownNode)) { return false; }
			}
			return true;
		}
		// A leader leg clear of every other node's symbol (N3) and every Text object.
		function segFree(ax, ay, bx, by, ownNode) {
			var q = hardG.query(Math.min(ax, bx), Math.min(ay, by), Math.max(ax, bx), Math.max(ay, by), qa);
			for (var n = 0; n < q.length; n++) {
				var it = q[n];
				if (it.t === 'sym' ? it.node !== ownNode : it.t === 'text') {
					if (segHitsBox(ax, ay, bx, by, it.b, -1)) { return false; }
				}
			}
			return true;
		}

		// The soft cost of a candidate against the fixed world, in Tom's order.
		function softCost(c) {
			CNT.soft++;
			if (!c.boxes) { build(c); }
			var req = reqs[c.li], ownLink = req.kind === 'link' ? req.owner : null;
			var boxes = c.boxes, nb = boxes.length, cost = 0, i, j, b, it, n, q, L = c.leader;
			// Leaders through a pump or valve.
			for (j = 1; L && j < L.length; j++) {
				var ax = L[j - 1][0], ay = L[j - 1][1], bx = L[j][0], by = L[j][1];
				q = hardG.query(Math.min(ax, bx), Math.min(ay, by), Math.max(ax, bx), Math.max(ay, by), qa);
				for (n = 0; n < q.length; n++) {
					it = q[n];
					if (it.t === 'lsym' && it.link !== ownLink && segHitsBox(ax, ay, bx, by, it.b, 0)) { cost += C_LEADER_LINKSYM; }
				}
			}
			// Pipes, flow arrows and Text callouts under the text.
			var links = null, own = false;
			q = softG.query(c.bx0, c.by0, c.bx1, c.by1, qa);
			for (n = 0; n < q.length; n++) {
				it = q[n];
				for (i = 0; i < nb; i++) {
					b = boxes[i];
					if (it.t === 'arrow') {
						if (boxesOverlap(b, it.b, TOL)) { cost += C_ARROW; break; }
					} else if (segHitsBox(it.ax, it.ay, it.bx, it.by, b, 1.5)) {
						if (it.t === 'tlead') { cost += C_LABEL_LEADER; break; }
						if (it.link === ownLink) { if (!b.rep) { own = true; } break; }
						if (!links) { links = {}; }
						if (!links[it.link]) { links[it.link] = 1; cost += C_LABEL_PIPE; }
						break;
					}
				}
			}
			if (own) { cost += C_LABEL_OWN_PIPE; }
			// Soft: pipes and Text callouts the leader crosses, away from its own start.
			var lk = null;
			for (j = 1; L && j < L.length; j++) {
				var sx = L[0][0], sy = L[0][1], px = L[j - 1][0], py = L[j - 1][1], ex = L[j][0], ey = L[j][1];
				q = softG.query(Math.min(px, ex), Math.min(py, ey), Math.max(px, ex), Math.max(py, ey), qb);
				for (n = 0; n < q.length; n++) {
					it = q[n];
					if (it.t === 'arrow') { continue; }
					if (it.t === 'tlead') {
						if (segCross(px, py, ex, ey, it.ax, it.ay, it.bx, it.by) >= 0) { cost += C_LEADER_LEADER; }
						continue;
					}
					if (it.link === ownLink || (lk && lk[it.link])) { continue; }
					var t = segCross(px, py, ex, ey, it.ax, it.ay, it.bx, it.by);
					if (t >= 0 && Math.hypot(px + t * (ex - px) - sx, py + t * (ey - py) - sy) > 1.5) {
						(lk || (lk = {}))[it.link] = 1; cost += C_LEADER_PIPE;
					}
				}
			}
			return cost;
		}

		// Two different labels keep a clearance, so each reads as its own.
		function padOverlap(a, b) {
			if (!a.rot && !b.rot) {
				return !(b.x1 - a.x0 <= -PADX || a.x1 - b.x0 <= -PADX || b.y1 - a.y0 <= -PADY || a.y1 - b.y0 <= -PADY);
			}
			return boxesOverlap(a, b, -PADY);
		}
		function pairSoft(a, b) {
			var cost = 0;
			if (a.x1 <= b.x0 || b.x1 <= a.x0 || a.y1 <= b.y0 || b.y1 <= a.y0) { return 0; }
			if (b.leader && boxesOnLeader(a.boxes, b.leader)) { cost += C_LABEL_LEADER; }
			if (a.leader && boxesOnLeader(b.boxes, a.leader)) { cost += C_LABEL_LEADER; }
			if (a.leader && b.leader && leadersCross(a.leader, b.leader)) { cost += C_LEADER_LEADER; }
			return cost;
		}
		function boxesOnLeader(boxes, L) {
			for (var k = 1; k < L.length; k++) {
				for (var i = 0; i < boxes.length; i++) {
					if (segHitsBox(L[k - 1][0], L[k - 1][1], L[k][0], L[k][1], boxes[i], 1.5)) { return true; }
				}
			}
			return false;
		}
		function leadersCross(A, B) {
			for (var i = 1; i < A.length; i++) {
				for (var j = 1; j < B.length; j++) {
					if (segCross(A[i - 1][0], A[i - 1][1], A[i][0], A[i][1], B[j - 1][0], B[j - 1][1], B[j][0], B[j][1]) >= 0) { return true; }
				}
			}
			return false;
		}

		// ---- the labels, their levels, and their candidate lists (built a level at a time) ----
		var lab = new Array(N), li, nGen = 0, nValid = 0, nDyn = 0, CNT = { best: 0, pair: 0, soft: 0, build: 0, near: 0, att1: 0, att2: 0, ok1: 0, ok2: 0, free: 0 };
		for (li = 0; li < N; li++) {
			lab[li] = { req: reqs[li], hand: !!reqs[li].hand, levels: levelsOf(reqs[li], scene.dropOrder), lists: [] };
		}
		// The candidates of one drop level, clear of the fixed world, best first.
		// Tier 0 is the places touching the owner (and last view's place); tier 1 the leadered
		// places, built only when tier 0 cannot win.
		var TIER1_PEN = C_LEADER_BASE + C_LEADER_PER_ROW * DISTS[0];
		function ensure(li, k, t) {
			var L = lab[li], key = 2 * k + t;
			if (L.lists[key]) { return L.lists[key]; }
			var req = L.req, lv = L.levels[k], raw = [], out = [];
			if (L.hand) { if (!t) { genHand(li, req, lv, raw); } } else {
				if (req.kind === 'link' && linksById[req.owner]) { genPipe(li, req, lv, raw, t); } else { genPoint(li, req, lv, raw, t); }
				if (!t) { genSticky(li, req, lv, raw); }
			}
			for (var i = 0; i < raw.length; i++) {
				var c = raw[i];
				if (L.hand) { c.fx = fixedCost(c, true); out.push(c); } else if (c.ok || hardOK(c)) { out.push(c); }
			}
			out.sort(function (a, b) { return b.base - a.base; });
			nGen += raw.length; nValid += out.length;
			L.lists[key] = out;
			return out;
		}
		function tierMax(li, k, t) { var lv = lab[li].levels[k]; return lv.value + keepBonus(li, lv) + (t ? -TIER1_PEN : B_STICK); }

		// ---- the placed labels ----
		// Two indexes of the seated labels: each whole label by its extent, leader included (for
		// crossings), and each row box on its own (for the block test, the common case).
		var cur = new Array(N), dyn = new Grid(vp), dynB = new Grid(vp, 24);
		function seat(li, c) {
			var o = cur[li], i, b;
			if (o) {
				dyn.remove(o, o.x0, o.y0, o.x1, o.y1);
				for (i = 0; i < o.items.length; i++) { b = o.items[i].b; dynB.remove(o.items[i], b.x0, b.y0, b.x1, b.y1); }
			}
			cur[li] = c;
			if (c) {
				if (!c.boxes) { build(c); }
				dyn.add(c, c.x0, c.y0, c.x1, c.y1);
				if (!c.items) { c.items = c.boxes.map(function (bx) { var it = new Item('lbl', null, null, bx, 0, 0, 0, 0); it.li = li; it.c = c; return it; }); }
				for (i = 0; i < c.items.length; i++) { b = c.items[i].b; dynB.add(c.items[i], b.x0, b.y0, b.x1, b.y1); }
			}
		}
		// Crossing cost of c against every seated label but its own and those in `skip`; NaN if
		// blocked. With `blockers`, collects who blocks instead of stopping at the first.
		// Crossing cost of c against every seated label but its own; NaN if one blocks it (N1).
		// With `blockers`, collects every label that blocks it. A candidate remembers the seated
		// label that last blocked it, which answers again for as long as that label stays put.
		var qd = [];
		function dynCost(c, blockers) {
			var cost = 0, n, i, it, o, top;
			evals++; nDyn++;
			if (!blockers && c.bl && cur[c.bl.li] === c.bl) { return NaN; }
			var hit = false, q, b;
			if (!c.boxes && !c.angle && !c.reps) {
				// Unturned rows as plain rectangles: no ink is built for a candidate that is blocked.
				var req = reqs[c.li], rows = c.lv.rows, line = c.layout === 'line';
				q = dynB.query(c.x - PADX, c.y - PADY, c.x + c.w + PADX, c.y + c.h + PADY, qd);
				for (n = 0; n < q.length; n++) {
					it = q[n];
					if (it.li === c.li || (blockers && blockers.indexOf(it.li) >= 0)) { continue; }
					b = it.b;
					if (b.x1 - c.x <= -PADX || c.x + c.w - b.x0 <= -PADX || b.y1 - c.y <= -PADY || c.y + c.h - b.y0 <= -PADY) { continue; }
					var h1 = false;
					for (i = 0, top = c.y; i < (line ? 1 : rows.length); i++) {
						var rw = line ? c.w : req.rows[rows[i]].w, rh = line ? c.h : req.rows[rows[i]].h;
						var left = line || c.align === 'left' ? c.x : (c.align === 'right' ? c.x + c.w - rw : c.x + (c.w - rw) / 2);
						var top0 = top;
						top += rh;
						CNT.pair++;
						if (b.x1 - left <= -PADX || left + rw - b.x0 <= -PADX || b.y1 - top0 <= -PADY || top - b.y0 <= -PADY) { continue; }
						if (b.rot && !boxesOverlap(mkBox(left + rw / 2, top0 + rh / 2, rw, rh, 0), b, -PADY)) { continue; }
						c.bl = it.c; hit = h1 = true;
						break;
					}
					if (h1 && !blockers) { return NaN; }
					if (h1 && blockers.indexOf(it.li) < 0) { blockers.push(it.li); }
				}
				if (hit) { return NaN; }
				build(c);
			} else {
				if (!c.boxes) { build(c); }
				q = dynB.query(c.bx0 - PADX, c.by0 - PADY, c.bx1 + PADX, c.by1 + PADY, qd);
				for (n = 0; n < q.length; n++) {
					it = q[n];
					if (it.li === c.li || (blockers && blockers.indexOf(it.li) >= 0)) { continue; }
					b = it.b;
					for (i = 0; i < c.boxes.length; i++) {
						CNT.pair++;
						if (padOverlap(c.boxes[i], b)) {
							c.bl = it.c; hit = true;
							if (!blockers) { return NaN; }
							blockers.push(it.li);
							break;
						}
					}
				}
				if (hit) { return NaN; }
			}
			q = dyn.query(c.x0, c.y0, c.x1, c.y1, qd);
			for (n = 0; n < q.length; n++) {
				o = q[n];
				if (o.li !== c.li) { cost += pairSoft(c, o); }
			}
			return cost;
		}
		function dynCostN(c, nb, skip, blockers) { return dynCost(c, blockers); }
		function near() { return null; }
		function keyOf(c) { if (c.fx === undefined) { c.fx = softCost(c); } return c.base - c.fx; }
		function worthNow(li) { var c = cur[li]; return c ? keyOf(c) - dynCost(c, null) : 0; }
		// The best candidate for label li as things stand; hidden (null, worth 0) if nothing fits
		// or nothing is worth showing. A hand-placed label is always shown.
		// With `floor`, only a place worth more than it will do (null if none).
		function bestFor(li, minK, floor) {
			CNT.best++;
			var L = lab[li], best = null, bs = L.hand ? -Infinity : 0;
			if (floor !== undefined && floor > bs) { bs = floor; }
			for (var k = minK ? Math.max(0, L.levels.length - 1) : 0; k < L.levels.length; k++) {
				if (tierMax(li, k, 0) <= bs) { break; }
				for (var t = 0; t < 2; t++) {
					if (tierMax(li, k, t) <= bs) { continue; }
					var list = ensure(li, k, t), nb = near(list);
					for (var i = 0; i < list.length; i++) {
						var c = list[i];
						if (c.base <= bs) { break; }
						if (nDyn > MAX_EVALS && best) { break; }
						if (c.fx !== undefined && c.base - c.fx <= bs) { continue; }
						var d = dynCostN(c, nb, null);
						if (d !== d) { if (!L.hand) { continue; } d = HARD_HAND; }
						if (keyOf(c) - d > bs) { bs = c.base - c.fx - d; best = c; }
					}
				}
			}
			return { c: best, w: best ? bs : 0 };
		}

		// ---- candidate generation ----
		function ownerPoint(req) {
			var n = req.kind === 'node' ? nodesById[req.owner] : null;
			if (n) { return { x: n.x, y: n.y, hw: n.symbol.w / 2, hh: n.symbol.h / 2, r: Math.min(n.symbol.w, n.symbol.h) / 2 }; }
			var cu = req.kind === 'customer' ? custById[req.owner] : null;
			if (cu) {
				var b = cu.box;
				return { x: b.x + b.w / 2, y: b.y + b.h / 2, hw: b.w / 2, hh: b.h / 2, r: Math.min(b.w, b.h) / 2 };
			}
			return { x: req.anchor.x, y: req.anchor.y, hw: 0, hh: 0, r: 0 };
		}
		// The leader from the owner to its text: it starts on the symbol's edge, toward its first bend.
		function leaderFrom(o, pts) {
			var fx = pts[0][0] - o.x, fy = pts[0][1] - o.y, d = Math.hypot(fx, fy) || 1;
			return [[o.x + fx / d * o.r, o.y + fy / d * o.r]].concat(pts);
		}

		// Leadered places around a point (a node, or a point on a pipe with r = 0): straight out
		// on each direction at DISTS distances, the text justified to the side the leader arrives
		// from (R5); a steep leader ends in the standard short hook instead (R6).
		function genLeadered(li, o, lv, layout, d, pref, list, dirSet) {
			var req = reqs[li], own = req.kind === 'node' ? req.owner : null;
			for (var k = 0; k < dirSet.length; k++) {
				var ux = dirSet[k][0], uy = dirSet[k][1];
				for (var j = 0; j < DISTS.length; j++) {
					var rr = o.r + DISTS[j] * rowH, px = o.x + ux * rr, py = o.y + uy * rr;
					var sx = o.x + ux * o.r, sy = o.y + uy * o.r;   // on the symbol's edge
					var row = uy < -0.2 ? d.mids.length - 1 : 0, x, al, legFree = null;
					if (Math.abs(ux) >= 0.5) {
						var right = ux > 0;
						if (layout === 'line' && Math.abs(ux) < 0.7) { continue; }
						al = right ? 'left' : 'right'; x = right ? px : px - d.w;
						if (!blockFree(req, lv.rows, layout, d, al, x, py - d.mids[row])) { continue; }
						if (!segFree(sx, sy, px, py, own)) { continue; }
						var c = new Cand(li, lv, layout, al, x, py - d.mids[row], d.w, d.h, 0, [[sx, sy], [px, py]], pref);
						c.ok = true; list.push(c);
					} else if (hookLen > 0) {
						for (var sd = -1; sd <= 1; sd += 2) {
							var ex = px + sd * hookLen;
							al = sd > 0 ? 'left' : 'right'; x = sd > 0 ? ex : ex - d.w;
							if (!blockFree(req, lv.rows, layout, d, al, x, py - d.mids[row])) { continue; }
							if (legFree === null) { legFree = segFree(sx, sy, px, py, own); }
							if (!legFree || !segFree(px, py, ex, py, own)) { continue; }
							var c2 = new Cand(li, lv, layout, al, x, py - d.mids[row], d.w, d.h, 0, [[sx, sy], [px, py], [ex, py]], pref + 0.1);
							c2.ok = true; list.push(c2);
						}
					}
				}
			}
		}

		function genPoint(li, req, lv, list, tier) {
			var o = ownerPoint(req), L = o.x - o.hw - GAP, R = o.x + o.hw + GAP, T = o.y - o.hh - GAP, B = o.y + o.hh + GAP;
			var layouts = lv.rows.length > 1 ? ['stack', 'line'] : ['stack'];
			if (req.layout === 'line') { layouts.reverse(); }
			layouts.forEach(function (layout, li2) {
				var d = dims(req, lv.rows, layout, text), alt = li2 ? C_ALT_LAYOUT : 0, n = d.mids.length, k;
				if (tier) { genLeadered(li, o, lv, layout, d, alt, list, DIRSET); return; }
				function put(align, x, y, pref) {
					if (blockFree(req, lv.rows, layout, d, align, x, y)) {
						var c = new Cand(li, lv, layout, align, x, y, d.w, d.h, 0, null, pref + alt);
						c.ok = true; list.push(c);
					}
				}
				// Touching the symbol: the standard quadrants, then the sides with each row beside it.
				put('left', R, T - d.h, 0);
				put('left', R, B, 0.3);
				put('right', L - d.w, T - d.h, 0.4);
				put('right', L - d.w, B, 0.6);
				for (k = 0; k < n; k++) {
					put('left', R, o.y - d.mids[k], 0.15 + 0.1 * k);
					put('right', L - d.w, o.y - d.mids[k], 0.45 + 0.1 * k);
				}
				put('center', o.x - d.w / 2, T - d.h, 0.8);
				put('center', o.x - d.w / 2, B, 0.9);
				put('left', o.x - o.hw, T - d.h, 0.85);
				put('right', o.x + o.hw - d.w, T - d.h, 0.85);
				put('left', o.x - o.hw, B, 0.95);
				put('right', o.x + o.hw - d.w, B, 0.95);
			});
		}

		// The stretch of a pipe that is on screen, as arc lengths [a, b], or null.
		function visibleSpan(pts, cum) {
			var L = cum[cum.length - 1], a = Infinity, b = -Infinity, n = 64;
			for (var i = 0; i <= n; i++) {
				var P = pointAt(pts, cum, L * i / n);
				if (P.x >= vp.x && P.x <= vp.x + vp.w && P.y >= vp.y && P.y <= vp.y + vp.h) { a = Math.min(a, L * i / n); b = Math.max(b, L * i / n); }
			}
			return a <= b ? [a, b] : null;
		}
		function genPipe(li, req, lv, list, tier) {
			var link = linksById[req.owner], pts = link.points, cum = cumLengths(pts), Ltot = cum[cum.length - 1];
			var long = spacing > 0 && Ltot > spacing, k, j;
			// Home is the pipe's middle, or the middle of what is on screen when that is not.
			var vis = visibleSpan(pts, cum), mid = Ltot / 2;
			if (vis && (mid < vis[0] || mid > vis[1])) { mid = (vis[0] + vis[1]) / 2; }
			// R9: a long pipe carries its label every `step` along it (step <= the repeat spacing),
			// in one of two phases: centred on the pipe, or with a copy at the middle of the view.
			var phases = [];
			if (long) {
				var n = Math.ceil(Ltot / spacing), step = Ltot / n, ph = [];
				for (k = 0; k < n; k++) { ph.push((k + 0.5) * step); }
				phases.push(ph);
				if (vis) {
					var vm = (vis[0] + vis[1]) / 2, ph2 = [];
					for (j = -n; j <= n; j++) { var at = vm + j * step; if (at >= 0.1 * step && at <= Ltot - 0.1 * step) { ph2.push(at); } }
					if (ph2.length > 1) { phases.push(ph2); }
				}
			}
			var layouts = lv.rows.length > 1 ? ['line', 'stack'] : ['line'];
			if (req.layout === 'stack') { layouts.reverse(); }
			layouts.forEach(function (layout, li2) {
				var d = dims(req, lv.rows, layout, text), alt = li2 ? C_ALT_LAYOUT : 0;
				if (tier) {
					// Out on a leader from the pipe's middle, when there is no room beside it.
					var P = pointAt(pts, cum, mid), nx = -P.uy, ny = P.ux, dirs = [];
					[-1, 1].forEach(function (s) {
						[0, 40, -40].forEach(function (deg) {
							var r = deg * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
							dirs.push([s * (nx * c - ny * sn), s * (nx * sn + ny * c)]);
						});
					});
					genLeadered(li, { x: P.x, y: P.y, r: 0, hw: 0, hh: 0 }, lv, layout, d, alt + 0.3, list, dirs);
					return;
				}
				function beside(at, pref, reps) {
					for (var side = -1; side <= 1; side += 2) {
						['along', 'level'].forEach(function (kind) {
							var c = besidePipe(li, lv, layout, d, pts, cum, at, side, kind, pref, !reps);
							if (!c) { return; }
							if (reps) {
								var rr = [];
								reps.forEach(function (g) {
									var r = besidePipe(li, lv, layout, d, pts, cum, g, side, kind, 0);
									if (r) { rr.push({ x: r.x, y: r.y, angle: r.angle }); }
								});
								c.reps = rr.length ? rr : null;
							}
							list.push(c);
						});
					}
				}
				if (long) {
					phases.forEach(function (ph) {
						ph.forEach(function (at, i) {
							var P = pointAt(pts, cum, at);
							if (P.x < vp.x || P.x > vp.x + vp.w || P.y < vp.y || P.y > vp.y + vp.h) { return; }
							beside(at, alt + 3 * Math.abs(at - mid) / Ltot, ph.filter(function (g, m) { return m !== i; }));
						});
					});
					return;
				}
				var ff = Ltot > 2.2 * d.w ? [0, -0.17, 0.17, -0.3, 0.3] : (Ltot > 1.2 * d.w ? [0, -0.15, 0.15] : [0]);
				ff.forEach(function (f) {
					var at = mid + f * Ltot;
					if (at >= 0 && at <= Ltot) { beside(at, alt + 3 * Math.abs(f), null); }
				});
			});
		}
		// A pipe label beside its pipe (R7): 'along' lies parallel to it, 'level' stays horizontal
		// and stands just clear of the pipe's line.
		function besidePipe(li, lv, layout, d, pts, cum, s, side, kind, pref, check) {
			var P = pointAt(pts, cum, s), nx = -P.uy * side, ny = P.ux * side;
			var ang = Math.atan2(P.uy, P.ux) * 180 / Math.PI;
			if (ang > 90) { ang -= 180; } else if (ang <= -90) { ang += 180; }
			if (Math.abs(ang) < 0.5) { ang = 0; }
			var off, cx, cy, align = 'left';
			var sidePref = ny < -0.1 ? 0 : (ny > 0.1 ? 0.15 : (nx > 0 ? 0.05 : 0.1));
			if (kind === 'along') {
				if (layout !== 'line' || ang === 0 || Math.abs(ang) > 70) { return null; }
				off = d.h / 2 + PIPE_GAP;
				cx = P.x + nx * off; cy = P.y + ny * off;
				return new Cand(li, lv, layout, 'left', cx - d.w / 2, cy - d.h / 2, d.w, d.h, ang, null,
					pref + sidePref + (Math.abs(ang) > 45 ? 0.5 : 0));
			}
			off = d.w / 2 * Math.abs(nx) + d.h / 2 * Math.abs(ny) + PIPE_GAP;
			cx = P.x + nx * off; cy = P.y + ny * off;
			if (layout === 'stack') { align = nx > 0.3 ? 'left' : (nx < -0.3 ? 'right' : 'center'); }
			if (check && !blockFree(reqs[li], lv.rows, layout, d, align, cx - d.w / 2, cy - d.h / 2)) { return null; }
			var c = new Cand(li, lv, layout, align, cx - d.w / 2, cy - d.h / 2, d.w, d.h, 0, null,
				pref + sidePref + (Math.abs(ang) <= 45 && ang !== 0 ? 0.3 : 0));
			c.ok = !!check;
			return c;
		}

		// A hand-placed label (N4): it hangs from the user's point on the side away from its owner,
		// the leader running from the owner to that point. Only its rows and which row the point
		// meets are free.
		function genHand(li, req, lv, list) {
			var H = req.hand, start, owner;
			if (req.kind === 'link' && linksById[req.owner]) {
				start = nearestOnPolyline(linksById[req.owner].points, H.x, H.y);
				owner = { x: start[0], y: start[1], r: 0 };
			} else {
				owner = ownerPoint(req);
			}
			var dx = H.x - owner.x, dy = H.y - owner.y, far = Math.hypot(dx, dy) > owner.r + 2;
			var right = dx >= 0, d = dims(req, lv.rows, req.layout, text);
			for (var k = 0; k < d.mids.length; k++) {
				var leader = far ? (owner.hw !== undefined ? leaderFrom(owner, [[H.x, H.y]]) : [[owner.x, owner.y], [H.x, H.y]]) : null;
				list.push(new Cand(li, lv, req.layout, right ? 'left' : 'right', right ? H.x : H.x - d.w, H.y - d.mids[k],
					d.w, d.h, 0, leader, 0.1 * k));
			}
		}

		// The last view's placement, held at the same offset from its anchor: a label that stays
		// put is not churn, so it wins ties.
		function genSticky(li, req, lv, list) {
			var pl = prevPl[req.id], pr = prevReq[req.id];
			if (!pl || !pl.shown || !pr) { return; }
			var ox = pl.x - pr.anchor.x, oy = pl.y - pr.anchor.y;
			var layout = pl.layout || pr.layout;
			var pd = dims(pr, pl.rows, layout, text);
			var o = req.kind === 'link' ? null : ownerPoint(req);
			var d = dims(req, lv.rows, layout, text);
			var x = pl.align === 'right' ? req.anchor.x + ox + pd.w - d.w
				: (pl.align === 'center' ? req.anchor.x + ox + (pd.w - d.w) / 2 : req.anchor.x + ox);
			var y = req.anchor.y + oy, leader = null;
			if (pl.leader) {
				var L = pl.leader, e = L[L.length - 1];
				var ey = req.anchor.y + (e[1] - pr.anchor.y);
				if (ey < y || ey > y + d.h) { ey = y + (ey < y ? d.mids[0] : d.mids[d.mids.length - 1]); }
				var ex = e[0] - pl.x <= pl.x + pd.w - e[0] ? x : x + d.w;
				var tail = [[ex, ey]];
				if (L.length === 3) {
					var hx = req.anchor.x + (L[1][0] - pr.anchor.x);
					if (Math.abs(hx - ex) > (text.hookMaxPx || 0)) { return; }
					tail.unshift([hx, ey]);
				}
				if (o) { leader = leaderFrom(o, tail); } else {
					var s0 = [req.anchor.x + (L[0][0] - pr.anchor.x), req.anchor.y + (L[0][1] - pr.anchor.y)];
					var lk = linksById[req.owner];
					if (lk) { s0 = nearestOnPolyline(lk.points, s0[0], s0[1]); }
					leader = [s0].concat(tail);
				}
			}
			var c = new Cand(li, lv, layout, pl.align || 'left', x, y, d.w, d.h, pl.angle || 0, leader, 0);
			c.base += B_STICK;
			if (pl.repeats && pl.repeats.length) {
				c.reps = pl.repeats.map(function (r) {
					return { x: x + (r.x - pl.x), y: y + (r.y - pl.y), angle: r.angle === undefined ? pl.angle : r.angle };
				});
			}
			list.push(c);
		}

		// ---- 1. hand-placed labels: fixed, seated first ----
		var order = [], i;
		for (i = 0; i < N; i++) { if (lab[i].hand) { seat(i, bestFor(i).c); } else { order.push(i); } }

		// ---- 2. greedy, most crowded first ----
		var crowd = new Array(N), anchors = new Grid(vp), qn = [];
		reqs.forEach(function (r, k) { var it = new Item('anchor', null, null, null, 0, 0, 0, 0); it.li = k; anchors.add(it, r.anchor.x, r.anchor.y, r.anchor.x, r.anchor.y); });
		order.forEach(function (li) {
			var a = reqs[li].anchor, R = 4 * rowH, n = 0, q = anchors.query(a.x - R, a.y - R, a.x + R, a.y + R, qn);
			for (var k = 0; k < q.length; k++) { var b = reqs[q[k].li].anchor; if (Math.hypot(b.x - a.x, b.y - a.y) < R) { n++; } }
			crowd[li] = n;
		});
		// R11: on a zoom-in, the labels shown last view are seated first, so none is lost to room.
		function wasShown(li) { var pl = prevPl[reqs[li].id]; return zoomIn && pl && pl.shown ? 0 : 1; }
		order.sort(function (a, b) { return (wasShown(a) - wasShown(b)) || (crowd[b] - crowd[a]) || (a - b); });
		mark('setup');
		// Every label first, as small as it comes (G: properties go before labels) ...
		order.forEach(function (li) { seat(li, bestFor(li, true).c); });
		mark('labels');
		// ... then each grows into the room around it.
		order.forEach(function (li) { var b = bestFor(li); if (b.c && b.w > worthNow(li) + 1e-6) { seat(li, b.c); } });
		mark('greedy');

		// ---- 3. repair: show more of each short-changed label, moving at most two neighbours ----
		function levelOf(li) { return cur[li] ? lab[li].levels.indexOf(cur[li].lv) : lab[li].levels.length; }
		function unseatAll(set) {
			// Worth of the labels in `set` as seated, each pair counted once; unseats them.
			var tot = 0;
			for (var k = 0; k < set.length; k++) {
				var c = cur[set[k]];
				if (c) { seat(set[k], null); tot += keyOf(c) - dynCost(c, null); }
			}
			return tot;
		}
		function tryUpgrade(li) {
			var cl = levelOf(li), here = worthNow(li);
			for (var kt = 0; kt < 2 * cl; kt++) {
				var k = kt >> 1;
				if (tierMax(li, k, kt & 1) <= here) { continue; }
				var list = ensure(li, k, kt & 1), tried = 0, nb = near(list);
				for (var m = 0; m < list.length && tried < TRIES; m++) {
					var c = list[m];
					if (c.base <= here) { break; }
					if (c.fx !== undefined && c.base - c.fx <= here) { continue; }
					var bl = [], d = dynCostN(c, nb, null, bl);
					if (d === d) {
						if (keyOf(c) - d > here + 1e-6) { CNT.free++; seat(li, c); return true; }
						continue;
					}
					if (keyOf(c) <= here) { continue; }
					tried++;
					if (bl.length > 2 || bl.some(function (b) { return lab[b].hand; })) { continue; }
					if (nDyn > MAX_EVALS) { return false; }
					CNT['att' + bl.length]++;
					var set = [li].concat(bl), saved = set.map(function (s) { return cur[s]; });
					var before = unseatAll(set);
					seat(li, c);
					var after = keyOf(c) - dynCost(c, null), ok = true;
					for (var q = 0; q < bl.length && ok; q++) {
						// What this blocker must still be worth for the move to pay.
						var rest = 0;
						for (var r = q + 1; r < bl.length; r++) { rest += lab[bl[r]].levels[0].value + B_STICK + B_KEEP; }
						var need = before - after - rest, b = bestFor(bl[q], false, need);
						if (!b.c && need >= 0) { ok = false; break; }
						seat(bl[q], b.c);
						after += b.w;
					}
					if (ok && after > before + 1e-6) { CNT['ok' + bl.length]++; return true; }
					for (q = 0; q < set.length; q++) { seat(set[q], null); }
					for (q = 0; q < set.length; q++) { seat(set[q], saved[q]); }
				}
			}
			return false;
		}
		for (var pass = 0; pass < PASSES; pass++) {
			var todo = order.filter(function (li) { return levelOf(li) > 0; });
			todo.sort(function (a, b) { return (cur[a] ? 1 : 0) - (cur[b] ? 1 : 0) || levelOf(b) - levelOf(a) || a - b; });
			var changed = false;
			for (i = 0; i < todo.length; i++) { if (tryUpgrade(todo[i])) { changed = true; } }
			mark('repair' + pass);
			// ---- 4. polish: every label re-seats itself if that is worth more ----
			for (i = 0; i < order.length; i++) {
				var lj = order[i], here = worthNow(lj), b = bestFor(lj);
				if (b.c && b.c !== cur[lj] && b.w > here + 1e-6) { seat(lj, b.c); changed = true; }
			}
			mark('polish' + pass);
			if (!changed || nDyn > MAX_EVALS) { break; }
		}
		if (DBG) { console.error(scene.id + ': gen ' + nGen + ' valid ' + nValid + ' dyn ' + nDyn + ' ' + JSON.stringify(CNT) + ' ' + tl.join(', ')); }

		// ---- answer ----
		var out = {};
		for (i = 0; i < N; i++) {
			var c = cur[i];
			if (!c) { out[reqs[i].id] = { shown: false }; continue; }
			var pl = { shown: true, rows: c.lv.rows.slice(), layout: c.layout, align: c.align, x: c.x, y: c.y,
				leader: c.leader ? c.leader.map(function (p) { return [p[0], p[1]]; }) : null };
			if (c.angle) { pl.angle = c.angle; }
			if (c.reps && c.reps.length) { pl.repeats = c.reps.map(function (r) { return { x: r.x, y: r.y, angle: r.angle }; }); }
			out[reqs[i].id] = pl;
		}
		return { labels: out };
	}

	return { name: 'D (candidate search, ejection repair, sticky)', create: create };
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs.lpnPlacerD;
}
