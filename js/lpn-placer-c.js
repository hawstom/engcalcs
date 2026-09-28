// lpn-placer-c.js -- label placer "C" for the Looped Pipe Network map (the label bake-off).
//
// A PURE FUNCTION OF ONE VIEW, per dev/lpn-spike/label-bench/contract.js: the network, the
// symbols, each label's measured rows and the view go in; each label's position, shown rows and
// leader come out. No DOM, no text measurement, no closure over the editor. The rules it answers
// to are dev/label-placement-rules.md Part A (§1-§5).
//
// HOW IT THINKS, in four passes over one view:
//
//   1. KEEP.  Every label shown in the previous view first tries the very spot and rows it had
//      (same offset from its anchor), so a pan or zoom does not reshuffle the map.
//   2. SHOW.  Every other label is placed with its ID row only, the smallest footprint it has,
//      most crowded first. A label is worth more than any neighbour's property (G).
//   3. GROW.  In rounds, each label tries to take back one more property (reverse drop order),
//      so neighbours share the room fairly (R2) instead of the first-placed one taking it all.
//   4. MEND.  A label still hidden may evict one blocking neighbour, if that neighbour can go
//      somewhere else, even with fewer rows (labels before properties).
//
// Free space is a uniform grid over the viewport holding every obstacle: node, pump and valve
// symbols and Text objects (never covered), placed labels (never covered), pipes and leaders
// (crossed at a cost, in Tom's order). A candidate is scored by what it covers and how far it
// strays; candidates are tried cheapest-first and the search stops as soon as no cheaper one can
// exist, which is what keeps a pan or zoom fast (R10).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

var EngCalcs = EngCalcs || {};

EngCalcs.lpnPlacerC = (function () {
	'use strict';

	// ---- what things cost (Tom's order, worst first: leader on leader, label on leader, label
	// on pipe, leader on pipe; a label on a customer is free) ------------------------------------
	var COST = {
		LDR_LDR: 9,      // leader crosses a leader
		LBL_LDR: 4.5,    // label covers a leader
		LBL_PIPE: 1.1,   // label covers a pipe that is not its own
		LBL_ARROW: 0.8,  // label covers a flow arrow
		LDR_PIPE: 0.25,  // leader crosses a pipe
		LDR_LSYM: 3,     // leader through a pump or valve symbol
		LDR_TEXT: 3,     // leader through a Text object
		OWN_PIPE: 3.5    // a pipe label on its own pipe (R7: beside it, not on it)
	};
	var ROW_GAIN = 3.2;        // one more property is worth this much crossing
	var SHAPE = 1.8;           // a label not in its usual shape (R1: wholeness goes after nearness)
	var LDR_BASE = 0.35;       // having a leader at all
	var LDR_PER_PX = 0.02;     // and each pixel of it
	var PREV_BONUS = -1.6;     // staying where it was last view
	var LEADER_LENS = [8, 18, 30, 46, 64];
	var HOOK = 8;              // the one standard short hook (clamped to text.hookMaxPx)
	var GAP = 2;               // clear space between a label and its own symbol or pipe
	var SYM_PAD = 1;           // clear space kept round every symbol and Text object
	var LBL_TOL = 0.5;         // two labels may share this much (the row pitch carries leading)
	var CELL = 36;
	var MEND_BUDGET_MS = 12;

	var SYM = 1, LSYM = 2, TEXT = 3, TLEAD = 4, PIPE = 5, LABEL = 6, LEAD = 7, ARROW = 8;

	function now() {
		return (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
	}

	// ---- geometry -------------------------------------------------------------------------
	function obox(cx, cy, w, h, angle) {
		var b = { cx: cx, cy: cy, w: w, h: h, angle: angle || 0 };
		b.bb = obBB(b);
		return b;
	}
	function obBB(b) {
		if (!b.angle) { return { x0: b.cx - b.w / 2, y0: b.cy - b.h / 2, x1: b.cx + b.w / 2, y1: b.cy + b.h / 2 }; }
		var r = b.angle * Math.PI / 180, c = Math.abs(Math.cos(r)), s = Math.abs(Math.sin(r));
		var ex = (b.w * c + b.h * s) / 2, ey = (b.w * s + b.h * c) / 2;
		return { x0: b.cx - ex, y0: b.cy - ey, x1: b.cx + ex, y1: b.cy + ey };
	}
	function inflate(b, by) { return obox(b.cx, b.cy, b.w + 2 * by, b.h + 2 * by, b.angle); }
	function bbHit(a, b) { return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1; }
	function segBB(s) {
		return { x0: Math.min(s[0], s[2]), y0: Math.min(s[1], s[3]), x1: Math.max(s[0], s[2]), y1: Math.max(s[1], s[3]) };
	}
	function cornersOf(b) {
		if (b.cs) { return b.cs; }
		var r = b.angle * Math.PI / 180, c = Math.cos(r), s = Math.sin(r), hw = b.w / 2, hh = b.h / 2;
		b.cs = [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]].map(function (p) {
			return [b.cx + p[0] * c - p[1] * s, b.cy + p[0] * s + p[1] * c];
		});
		return b.cs;
	}
	// Do two boxes overlap by more than `tol` on every separating axis?
	function obOverlap(a, b, tol) {
		if (!a.angle && !b.angle) {
			return Math.min(a.bb.x1, b.bb.x1) - Math.max(a.bb.x0, b.bb.x0) > tol
				&& Math.min(a.bb.y1, b.bb.y1) - Math.max(a.bb.y0, b.bb.y0) > tol;
		}
		if (!bbHit(a.bb, b.bb)) { return false; }
		var A = cornersOf(a), B = cornersOf(b), qs = [a, b], k, j, i;
		for (k = 0; k < 2; k++) {
			var r = qs[k].angle * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
			var axes = [[c, s], [-s, c]];
			for (j = 0; j < 2; j++) {
				var ax = axes[j], amin = Infinity, amax = -Infinity, bmin = Infinity, bmax = -Infinity, v;
				for (i = 0; i < 4; i++) {
					v = A[i][0] * ax[0] + A[i][1] * ax[1]; if (v < amin) { amin = v; } if (v > amax) { amax = v; }
					v = B[i][0] * ax[0] + B[i][1] * ax[1]; if (v < bmin) { bmin = v; } if (v > bmax) { bmax = v; }
				}
				if (Math.min(amax, bmax) - Math.max(amin, bmin) <= tol) { return false; }
			}
		}
		return true;
	}
	// Does segment a-b pass through box `b` shrunk by `shrink` (negative grows it)?
	function segHitsOB(ax, ay, bx, by, b, shrink) {
		var hw = b.w / 2 - shrink, hh = b.h / 2 - shrink;
		if (hw <= 0 || hh <= 0) { return false; }
		var px = ax - b.cx, py = ay - b.cy, qx = bx - b.cx, qy = by - b.cy, t;
		if (b.angle) {
			var r = b.angle * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
			t = px * c + py * s; py = -px * s + py * c; px = t;
			t = qx * c + qy * s; qy = -qx * s + qy * c; qx = t;
		}
		var dx = qx - px, dy = qy - py, t0 = 0, t1 = 1;
		var P = [-dx, dx, -dy, dy], Q = [px + hw, hw - px, py + hh, hh - py];
		for (var i = 0; i < 4; i++) {
			if (P[i] === 0) { if (Q[i] < 0) { return false; } continue; }
			t = Q[i] / P[i];
			if (P[i] < 0) { if (t > t1) { return false; } if (t > t0) { t0 = t; } } else { if (t < t0) { return false; } if (t < t1) { t1 = t; } }
		}
		return t0 < t1;
	}
	function orient(ax, ay, bx, by, cx, cy) { return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax); }
	// A proper crossing of two segments; touching at an end point is not one.
	function segsCross(s, t) {
		var d1 = orient(t[0], t[1], t[2], t[3], s[0], s[1]), d2 = orient(t[0], t[1], t[2], t[3], s[2], s[3]);
		var d3 = orient(s[0], s[1], s[2], s[3], t[0], t[1]), d4 = orient(s[0], s[1], s[2], s[3], t[2], t[3]);
		if (!d1 || !d2 || !d3 || !d4) { return false; }
		if ((d1 > 0) === (d2 > 0) || (d3 > 0) === (d4 > 0)) { return false; }
		function near(x0, y0, x1, y1) { return Math.abs(x0 - x1) <= 1.5 && Math.abs(y0 - y1) <= 1.5; }
		if (near(s[0], s[1], t[0], t[1]) || near(s[0], s[1], t[2], t[3]) || near(s[2], s[3], t[0], t[1]) || near(s[2], s[3], t[2], t[3])) { return false; }
		return true;
	}
	function crossPoint(s, t) {
		var d = (s[2] - s[0]) * (t[3] - t[1]) - (s[3] - s[1]) * (t[2] - t[0]);
		if (!d) { return null; }
		var u = ((t[0] - s[0]) * (t[3] - t[1]) - (t[1] - s[1]) * (t[2] - t[0])) / d;
		return [s[0] + u * (s[2] - s[0]), s[1] + u * (s[3] - s[1])];
	}
	// Clip a segment to a rectangle; null when it misses.
	function clipSeg(s, r) {
		var dx = s[2] - s[0], dy = s[3] - s[1], t0 = 0, t1 = 1, P = [-dx, dx, -dy, dy],
			Q = [s[0] - r.x0, r.x1 - s[0], s[1] - r.y0, r.y1 - s[1]], t;
		for (var i = 0; i < 4; i++) {
			if (P[i] === 0) { if (Q[i] < 0) { return null; } continue; }
			t = Q[i] / P[i];
			if (P[i] < 0) { if (t > t1) { return null; } if (t > t0) { t0 = t; } } else { if (t < t0) { return null; } if (t < t1) { t1 = t; } }
		}
		if (t0 > t1) { return null; }
		return [s[0] + t0 * dx, s[1] + t0 * dy, s[0] + t1 * dx, s[1] + t1 * dy];
	}
	function normAngle(a) {
		while (a > 90) { a -= 180; }
		while (a <= -90) { a += 180; }
		return Math.round(a * 10) / 10;
	}

	// ---- the free-space model: a uniform grid of obstacles over the viewport ---------------
	function Grid(bb, cell) {
		this.x0 = bb.x0; this.y0 = bb.y0; this.cell = cell;
		this.nx = Math.max(1, Math.ceil((bb.x1 - bb.x0) / cell));
		this.ny = Math.max(1, Math.ceil((bb.y1 - bb.y0) / cell));
		this.cells = [];
		for (var i = 0; i < this.nx * this.ny; i++) { this.cells.push([]); }
		this.stamp = 0;
	}
	Grid.prototype.range = function (bb) {
		var i0 = Math.floor((bb.x0 - this.x0) / this.cell), i1 = Math.floor((bb.x1 - this.x0) / this.cell);
		var j0 = Math.floor((bb.y0 - this.y0) / this.cell), j1 = Math.floor((bb.y1 - this.y0) / this.cell);
		if (i1 < 0 || j1 < 0 || i0 >= this.nx || j0 >= this.ny) { return null; }
		return [Math.max(0, i0), Math.min(this.nx - 1, i1), Math.max(0, j0), Math.min(this.ny - 1, j1)];
	};
	Grid.prototype.insert = function (it) {
		var r = this.range(it.bb), i, j, idx = [];
		if (!r) { it.cellIdx = idx; return; }
		var n = (r[1] - r[0] + 1) * (r[3] - r[2] + 1);
		if (it.s && n > 9) {
			// A long segment: only the cells it runs through, sampled at a third of a cell.
			var s = it.s, L = Math.hypot(s[2] - s[0], s[3] - s[1]), steps = Math.ceil(L / (this.cell / 3)), seen = {};
			for (var k = 0; k <= steps; k++) {
				var x = s[0] + (s[2] - s[0]) * k / steps, y = s[1] + (s[3] - s[1]) * k / steps;
				var ci = Math.floor((x - this.x0) / this.cell), cj = Math.floor((y - this.y0) / this.cell);
				for (var di = -1; di <= 1; di++) {
					for (var dj = -1; dj <= 1; dj++) {
						var ii = ci + di, jj = cj + dj;
						if (ii < 0 || jj < 0 || ii >= this.nx || jj >= this.ny) { continue; }
						var key = jj * this.nx + ii;
						if (!seen[key]) { seen[key] = 1; idx.push(key); }
					}
				}
			}
		} else {
			for (j = r[2]; j <= r[3]; j++) { for (i = r[0]; i <= r[1]; i++) { idx.push(j * this.nx + i); } }
		}
		for (i = 0; i < idx.length; i++) { this.cells[idx[i]].push(it); }
		it.cellIdx = idx;
	};
	Grid.prototype.remove = function (it) {
		for (var i = 0; i < it.cellIdx.length; i++) {
			var arr = this.cells[it.cellIdx[i]], k = arr.indexOf(it);
			if (k >= 0) { arr.splice(k, 1); }
		}
		it.cellIdx = [];
	};
	// Calls fn(item) once per item near bb; stops and returns true when fn does.
	Grid.prototype.query = function (bb, fn) {
		var r = this.range(bb);
		if (!r) { return false; }
		var st = ++this.stamp;
		for (var j = r[2]; j <= r[3]; j++) {
			for (var i = r[0]; i <= r[1]; i++) {
				var arr = this.cells[j * this.nx + i];
				for (var k = 0; k < arr.length; k++) {
					var it = arr[k];
					if (it.q === st) { continue; }
					it.q = st;
					if (fn(it)) { return true; }
				}
			}
		}
		return false;
	};

	// ---- a pipe's polyline, walked by arc length -------------------------------------------
	function polyOf(points) {
		var cum = [0];
		for (var i = 1; i < points.length; i++) {
			cum.push(cum[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
		}
		return { pts: points, cum: cum, len: cum[cum.length - 1] };
	}
	function pointAt(poly, s) {
		var p = poly.pts, c = poly.cum, j = 0;
		s = Math.max(0, Math.min(poly.len, s));
		while (j < p.length - 2 && c[j + 1] < s) { j++; }
		var L = (c[j + 1] - c[j]) || 1, t = (s - c[j]) / L;
		var dx = (p[j + 1][0] - p[j][0]) / L, dy = (p[j + 1][1] - p[j][1]) / L;
		return { x: p[j][0] + t * (p[j + 1][0] - p[j][0]), y: p[j][1] + t * (p[j + 1][1] - p[j][1]), seg: j, dx: dx, dy: dy, s: s };
	}
	function nearestOn(poly, x, y) {
		var p = poly.pts, best = null;
		for (var j = 1; j < p.length; j++) {
			var ax = p[j - 1][0], ay = p[j - 1][1], vx = p[j][0] - ax, vy = p[j][1] - ay, L2 = vx * vx + vy * vy;
			var t = L2 ? Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / L2)) : 0;
			var qx = ax + t * vx, qy = ay + t * vy, d = Math.hypot(x - qx, y - qy);
			if (!best || d < best.d) { best = { x: qx, y: qy, d: d, s: poly.cum[j - 1] + t * Math.sqrt(L2) }; }
		}
		return best;
	}

	// ---- one label's ink: one box per stacked row, one for a line (as contract.js draws it) --
	function blockDims(rows, layout, sepW) {
		var w = 0, h = 0, i;
		if (layout === 'line') {
			for (i = 0; i < rows.length; i++) { w += rows[i].w; h = Math.max(h, rows[i].h); }
			w += (rows.length - 1) * sepW;
		} else {
			for (i = 0; i < rows.length; i++) { w = Math.max(w, rows[i].w); h += rows[i].h; }
		}
		return { w: w, h: h };
	}
	function inkBoxes(rows, layout, align, x, y, angle, sepW) {
		var d = blockDims(rows, layout, sepW), out = [];
		var rad = (angle || 0) * Math.PI / 180, cos = Math.cos(rad), sin = Math.sin(rad);
		var bcx = x + d.w / 2, bcy = y + d.h / 2;
		function put(cx, cy, w, h) {
			var dx = cx - bcx, dy = cy - bcy;
			out.push(obox(bcx + dx * cos - dy * sin, bcy + dx * sin + dy * cos, w, h, angle || 0));
		}
		if (layout === 'line') { put(bcx, bcy, d.w, d.h); return out; }
		var top = y;
		for (var i = 0; i < rows.length; i++) {
			var r = rows[i], left = align === 'right' ? x + d.w - r.w : (align === 'center' ? x + (d.w - r.w) / 2 : x);
			put(left + r.w / 2, top + r.h / 2, r.w, r.h);
			top += r.h;
		}
		return out;
	}

	// ---- direction preferences round a point label (y down: -45 degrees is north-east) -----
	// Cartographic habit: upper right first, then right, lower right, upper left, left ...
	var PREF = [
		[-45, 0], [0, 0.05], [-22.5, 0.03], [45, 0.1], [22.5, 0.08], [-135, 0.15], [180, 0.18],
		[-157.5, 0.17], [135, 0.22], [157.5, 0.2], [-67.5, 0.12], [-90, 0.25], [-112.5, 0.2],
		[67.5, 0.2], [90, 0.3], [112.5, 0.28]
	];
	function angDiff(a, b) { var d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; }
	function prefOf(deg) {
		var best = Infinity, bd = Infinity;
		for (var i = 0; i < PREF.length; i++) {
			var d = angDiff(deg, PREF[i][0]);
			if (d < bd) { bd = d; best = PREF[i][1]; }
		}
		return best + bd / 400;
	}

	// ---- the placer ------------------------------------------------------------------------
	function create() {
		var dirCache = {};   // node id -> signature and directions of the pipes meeting there

		function place(scene, opts) {
			var t0 = now();
			var prev = opts && opts.prev && opts.prev.layout && opts.prev.scene ? opts.prev : null;
			var st = setup(scene, prev);
			var labels = st.labels, i;

			// 0. Hand-placed labels: where the user put them, whole, always (N4).
			labels.forEach(function (L) { if (L.req.hand) { commit(st, L, handCand(st, L)); } });

			var order = labels.filter(function (L) { return !L.req.hand && L.rowsets.length; });
			order.sort(function (a, b) { return (a.prevPl ? 0 : 1) - (b.prevPl ? 0 : 1) || b.dens - a.dens || (a.id < b.id ? -1 : 1); });

			// 1. KEEP: last view's spot and rows, if still legal and not much worse.
			order.forEach(function (L) {
				if (!L.prevPl) { return; }
				var rsI = L.prevRs;
				if (rsI < 0) { return; }
				var c = matPrev(st, L, rsI);
				if (!c) { return; }
				var cost = evalCand(st, L, c, 3.0);
				if (cost < 3.0) { c.cost = cost; commit(st, L, c); }
			});
			// 2. SHOW: everything else, ID row only.
			order.forEach(function (L) {
				if (L.cur) { return; }
				var c = bestFor(st, L, L.rowsets.length - 1, Infinity);
				if (c) { commit(st, L, c); }
			});
			// 3. GROW, in rounds.
			grow(st, order);
			// 4. MEND: a hidden label may evict one neighbour who can move.
			if (mend(st, order, now() + MEND_BUDGET_MS)) { grow(st, order); }
			// 5. Repeats along long pipes (R9), in whatever room is left.
			for (i = 0; i < order.length; i++) { if (order[i].cur && order[i].kind === 'link') { repeats(st, order[i]); } }
			labels.forEach(function (L) { if (L.req.hand && L.kind === 'link') { repeats(st, L); } });

			var out = {};
			labels.forEach(function (L) {
				var c = L.cur;
				if (!c) { out[L.id] = { shown: false }; return; }
				var pl = { shown: true, rows: c.rows.slice(), layout: c.layout, align: c.align, x: c.x, y: c.y, leader: c.leader };
				if (c.angle) { pl.angle = c.angle; }
				if (c.reps && c.reps.length) { pl.repeats = c.reps.map(function (r) { return { x: r.x, y: r.y, angle: r.angle }; }); }
				out[L.id] = pl;
			});
			return { labels: out };
		}

		// ---- scene setup: obstacles into the grid, labels into working records -------------
		function setup(scene, prev) {
			var vp = scene.viewport, text = scene.text;
			var vpbb = { x0: vp.x, y0: vp.y, x1: vp.x + vp.w, y1: vp.y + vp.h };
			var gbb = { x0: vpbb.x0 - CELL, y0: vpbb.y0 - CELL, x1: vpbb.x1 + CELL, y1: vpbb.y1 + CELL };
			var grid = new Grid(gbb, CELL);
			var nodes = {}, links = {}, incident = {};
			scene.nodes.forEach(function (n) {
				nodes[n.id] = n;
				var raw = obox(n.symbol.x + n.symbol.w / 2, n.symbol.y + n.symbol.h / 2, n.symbol.w, n.symbol.h, 0);
				if (!bbHit(raw.bb, gbb)) { return; }
				var ob = inflate(raw, SYM_PAD);
				grid.insert({ k: SYM, ob: ob, raw: raw, bb: ob.bb, own: n.id });
			});
			scene.links.forEach(function (l) {
				links[l.id] = l;
				(incident[l.from] = incident[l.from] || []).push(l);
				(incident[l.to] = incident[l.to] || []).push(l);
				(l.symbols || []).forEach(function (b) {
					var ob = inflate(obox(b.cx, b.cy, b.w, b.h, b.angle), SYM_PAD);
					if (bbHit(ob.bb, gbb)) { grid.insert({ k: LSYM, ob: ob, bb: ob.bb, own: l.id }); }
				});
				(l.arrows || []).forEach(function (b) {
					var ob = obox(b.cx, b.cy, b.w * 0.8, b.h * 0.8, b.angle);
					if (bbHit(ob.bb, gbb)) { grid.insert({ k: ARROW, ob: ob, bb: ob.bb, own: l.id }); }
				});
				for (var i = 1; i < l.points.length; i++) {
					var s = clipSeg([l.points[i - 1][0], l.points[i - 1][1], l.points[i][0], l.points[i][1]], gbb);
					if (s) { grid.insert({ k: PIPE, s: s, bb: segBB(s), own: l.id }); }
				}
			});
			(scene.texts || []).forEach(function (t) {
				var ob = inflate(obox(t.box.cx, t.box.cy, t.box.w, t.box.h, t.box.angle), SYM_PAD);
				if (bbHit(ob.bb, gbb)) { grid.insert({ k: TEXT, ob: ob, bb: ob.bb, own: t.id }); }
				var ld = t.leader;
				if (ld && ld.length > 1) {
					for (var i = 1; i < ld.length; i++) {
						var s = clipSeg([ld[i - 1][0], ld[i - 1][1], ld[i][0], ld[i][1]], gbb);
						if (s) { grid.insert({ k: TLEAD, s: s, bb: segBB(s), own: 'T' + t.id }); }
					}
				}
			});
			var customers = {};
			(scene.customers || []).forEach(function (c) { customers[c.id] = c; });

			var prevL = prev ? prev.layout.labels || {} : {}, prevReq = {};
			if (prev) { prev.scene.labels.forEach(function (r) { prevReq[r.id] = r; }); }

			var st = { scene: scene, text: text, vp: vpbb, grid: grid, nodes: nodes, links: links, labels: [] };
			scene.labels.forEach(function (req) {
				var L = mkLabel(st, req, nodes, links, incident, customers);
				if (!L) { return; }
				var pp = prevL[req.id], pr = prevReq[req.id];
				if (pp && pp.shown && pr && pp.rows && pp.rows.length) {
					L.prevPl = pp; L.prevReq = pr;
					L.prevRs = rowsetMatching(L, pp.rows, pr);
				}
				st.labels.push(L);
			});
			// How crowded each label's home is: the most crowded are placed first.
			st.labels.forEach(function (L) {
				var a = L.anchor, n = 0, bb = { x0: a.x - 45, y0: a.y - 45, x1: a.x + 45, y1: a.y + 45 };
				grid.query(bb, function (it) { if (it.k === SYM || it.k === PIPE || it.k === TEXT) { n++; } return false; });
				L.dens = n;
			});
			return st;
		}

		// The rows, in the user's drop order: rowsets[0] is every row, each next one has dropped
		// one more property, the last is the label itself (the rows the drop order never names).
		function mkLabel(st, req, nodes, links, incident, customers) {
			var rows = req.rows || [];
			if (!rows.length) { return null; }
			var drop = (st.scene.dropOrder && st.scene.dropOrder[req.kind]) || [];
			var keep = rows.map(function (r, i) { return i; }), rowsets = [keep.slice()];
			drop.forEach(function (f) {
				var k = keep.filter(function (i) { return rows[i].field !== f; });
				if (k.length && k.length < keep.length) { keep = k; rowsets.push(keep.slice()); }
			});
			var L = { id: req.id, req: req, kind: req.kind, rows: rows, rowsets: rowsets, anchor: req.anchor,
				usual: req.layout === 'line' ? 'line' : 'stack', cur: null, items: [], dimC: {} };
			if (req.kind === 'link' && links[req.owner] && links[req.owner].points.length > 1) {
				var lk = links[req.owner], poly = polyOf(lk.points);
				var na = nearestOn(poly, req.anchor.x, req.anchor.y);
				var pad = function (id) {
					var n = nodes[id];
					return n ? Math.max(n.symbol.w, n.symbol.h) / 2 + GAP + 1 : GAP;
				};
				L.owner = { t: 'link', linkId: lk.id, poly: poly, sA: na.s, pad0: pad(lk.from), pad1: pad(lk.to) };
				L.specs = linkSpecs(L);
			} else {
				var o;
				if (req.kind === 'node' && nodes[req.owner]) {
					var n = nodes[req.owner];
					o = { t: 'node', nodeId: n.id, x: n.x, y: n.y, sw: n.symbol.w / 2, sh: n.symbol.h / 2 };
				} else if (req.kind === 'customer' && customers[req.owner]) {
					var b = customers[req.owner].box;
					o = { t: 'pt', x: b.x + b.w / 2, y: b.y + b.h / 2, sw: b.w / 2, sh: b.h / 2 };
				} else {
					o = { t: 'pt', x: req.anchor.x, y: req.anchor.y, sw: 2, sh: 2 };
				}
				L.owner = o;
				L.specs = pointSpecs(L, o.nodeId ? pipeDirs(o.nodeId, nodes, incident) : []);
			}
			return L;
		}
		function rowsetMatching(L, rows, prevReq) {
			// The rowset showing the same fields the previous view showed; else the richest that
			// shows no more than it did.
			var fields = rows.map(function (i) { return prevReq.rows[i] && prevReq.rows[i].field; }).join('|');
			for (var k = 0; k < L.rowsets.length; k++) {
				var f = L.rowsets[k].map(function (i) { return L.rows[i].field; }).join('|');
				if (f === fields) { return k; }
			}
			for (k = 0; k < L.rowsets.length; k++) { if (L.rowsets[k].length <= rows.length) { return k; } }
			return L.rowsets.length - 1;
		}
		// Directions (degrees) of the pipes leaving a node, cached across views: a zoom does
		// not turn them (H-b).
		function pipeDirs(id, nodes, incident) {
			var ls = incident[id] || [], n = nodes[id], out = [], sig = [];
			ls.forEach(function (l) {
				var p = l.points, q = l.from === id ? p[1] : p[p.length - 2];
				if (!q) { return; }
				var a = Math.atan2(q[1] - n.y, q[0] - n.x) * 180 / Math.PI;
				out.push(a); sig.push(Math.round(a));
			});
			var key = sig.join(',');
			var c = dirCache[id];
			if (c && c.key === key) { return c.dirs; }
			dirCache[id] = { key: key, dirs: out };
			return out;
		}

		// ---- candidate SPECS: where to try, cheapest first; positions come later -----------
		function pointSpecs(L, pipes) {
			var dirs = [], i;
			for (i = 0; i < 16; i++) { dirs.push(i * 22.5 - 180); }
			// The bisectors of the open sectors between the pipes (H-d).
			if (pipes.length > 1) {
				var s = pipes.slice().sort(function (a, b) { return a - b; });
				for (i = 0; i < s.length; i++) {
					var a = s[i], b = i + 1 < s.length ? s[i + 1] : s[0] + 360, gap = b - a;
					if (gap >= 50) { dirs.push(((a + gap / 2 + 180) % 360) - 180); }
				}
			} else if (pipes.length === 1) {
				dirs.push(((pipes[0] + 360) % 360) - 180);
			}
			var specs = [];
			dirs.forEach(function (deg) {
				var r = deg * Math.PI / 180, ux = Math.cos(r), uy = Math.sin(r), pref = prefOf(deg);
				var nearPipe = 180;
				pipes.forEach(function (p) { nearPipe = Math.min(nearPipe, angDiff(p, deg)); });
				['stack', 'line'].forEach(function (layout) {
					var sh = layout === L.usual ? 0 : SHAPE;
					specs.push({ t: 'adj', ux: ux, uy: uy, layout: layout, base: pref + sh });
					LEADER_LENS.forEach(function (len) {
						var along = nearPipe < 14 ? 0.8 : 0;
						specs.push({ t: 'ldr', ux: ux, uy: uy, len: len, layout: layout,
							base: LDR_BASE + len * LDR_PER_PX + pref * 0.5 + along + sh });
					});
				});
			});
			specs.sort(function (a, b) { return a.base - b.base; });
			return specs;
		}
		function linkSpecs(L) {
			var o = L.owner, pa = pointAt(o.poly, o.sA), specs = [];
			var ang = normAngle(Math.atan2(pa.dy, pa.dx) * 180 / Math.PI), steep = Math.abs(ang) > 60 ? 0.35 : Math.abs(ang) / 200;
			var nx = -pa.dy, ny = pa.dx;   // one normal of the pipe at its middle
			['line', 'stack'].forEach(function (layout) {
				var sh = layout === L.usual ? 0 : SHAPE;
				[0, 1, -1, 2, -2, 3, -3, 4, -4, 6, -6].forEach(function (k) {
					[1, -1].forEach(function (side) {
						specs.push({ t: 'along', k: k, side: side, layout: layout, base: steep + Math.abs(k) * 0.12 + (side < 0 ? 0.04 : 0) + sh });
					});
				});
				for (var i = 0; i < 16; i++) {
					var deg = i * 22.5 - 180, r = deg * Math.PI / 180, ux = Math.cos(r), uy = Math.sin(r);
					var dn = ux * nx + uy * ny;
					if (Math.abs(dn) < 0.5) { continue; }
					var pref = prefOf(deg);
					specs.push({ t: 'beside', ux: ux, uy: uy, layout: layout, base: 0.3 + pref * 0.5 + sh });
					LEADER_LENS.forEach(function (len) {
						specs.push({ t: 'ldr', ux: ux, uy: uy, len: len, layout: layout, base: 0.3 + LDR_BASE + len * LDR_PER_PX + pref * 0.5 + sh });
					});
				}
			});
			specs.sort(function (a, b) { return a.base - b.base; });
			return specs;
		}

		// ---- materialising a spec for one rowset -------------------------------------------
		function dims(st, L, rsI, layout) {
			var key = rsI + layout;
			if (!L.dimC[key]) { L.dimC[key] = blockDims(L.rowsets[rsI].map(function (i) { return L.rows[i]; }), layout, st.text.separatorW); }
			return L.dimC[key];
		}
		function mkCand(st, L, rsI, layout, align, x, y, angle, leader, base, spec) {
			var rows = L.rowsets[rsI], rr = rows.map(function (i) { return L.rows[i]; });
			var boxes = inkBoxes(rr, layout, align, x, y, angle, st.text.separatorW);
			var bb = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
			boxes.forEach(function (b) {
				bb.x0 = Math.min(bb.x0, b.bb.x0); bb.y0 = Math.min(bb.y0, b.bb.y0);
				bb.x1 = Math.max(bb.x1, b.bb.x1); bb.y1 = Math.max(bb.y1, b.bb.y1);
			});
			var segs = [];
			if (leader) { for (var i = 1; i < leader.length; i++) { segs.push([leader[i - 1][0], leader[i - 1][1], leader[i][0], leader[i][1]]); } }
			return { rs: rsI, rows: rows, layout: layout, align: align, x: x, y: y, angle: angle || 0, leader: leader,
				segs: segs, boxes: boxes, bb: bb, base: base, spec: spec };
		}
		function hookLen(st) { return Math.min(HOOK, st.text.hookMaxPx || HOOK); }
		// A block hung from the leader's end E, on the side away from the leader (R5: the text is
		// justified to the side the leader arrives from).
		function hangFrom(st, L, rsI, layout, ex, ey, side, uy, d) {
			var x = side > 0 ? ex : ex - d.w, y;
			var rows = L.rowsets[rsI], first = L.rows[rows[0]].h, last = L.rows[rows[rows.length - 1]].h;
			if (layout === 'line') { y = ey - d.h / 2; } else if (uy < -0.35) { y = ey - d.h + last / 2; } else if (uy > 0.35) { y = ey - first / 2; } else { y = ey - d.h / 2; }
			return { x: x, y: y, align: side > 0 ? 'left' : 'right' };
		}
		function leaderFrom(st, sx, sy, ux, uy, hx, hy, side) {
			// Straight, or the one standard short hook when the leader climbs steeply.
			if (Math.abs(uy) > 0.72) {
				var hk = hookLen(st), ex = hx + side * hk;
				return { pts: [[sx, sy], [hx, hy], [ex, hy]], ex: ex, ey: hy };
			}
			return { pts: [[sx, sy], [hx, hy]], ex: hx, ey: hy };
		}
		function materialize(st, L, spec, rsI) {
			var d = dims(st, L, rsI, spec.layout), o = L.owner;
			if (o.t === 'link') { return matLink(st, L, spec, rsI, d); }
			var ux = spec.ux, uy = spec.uy;
			if (spec.t === 'adj') {
				// On the square ring round the symbol: corners are the classic quadrant positions.
				var m = Math.max(Math.abs(ux), Math.abs(uy)), qx = ux / m, qy = uy / m;
				var cx = o.x + qx * (o.sw + GAP + d.w / 2), cy = o.y + qy * (o.sh + GAP + d.h / 2);
				var align = ux > 0.3 ? 'left' : (ux < -0.3 ? 'right' : 'center');
				return mkCand(st, L, rsI, spec.layout, align, cx - d.w / 2, cy - d.h / 2, 0, null, spec.base, spec);
			}
			var side = ux >= -1e-9 ? 1 : -1;
			var rb = Math.min(Math.abs(ux) > 1e-9 ? o.sw / Math.abs(ux) : Infinity, Math.abs(uy) > 1e-9 ? o.sh / Math.abs(uy) : Infinity);
			var r0 = Math.min(o.sw, o.sh);
			var hx = o.x + ux * (rb + spec.len), hy = o.y + uy * (rb + spec.len);
			var ld = leaderFrom(st, o.x + ux * r0, o.y + uy * r0, ux, uy, hx, hy, side);
			var hg = hangFrom(st, L, rsI, spec.layout, ld.ex, ld.ey, side, uy, d);
			return mkCand(st, L, rsI, spec.layout, hg.align, hg.x, hg.y, 0, ld.pts, spec.base, spec);
		}
		function matLink(st, L, spec, rsI, d) {
			var o = L.owner, poly = o.poly;
			if (spec.t === 'along') {
				var step = 14 + d.w * 0.35, s = o.sA + spec.k * step;
				if (s < 0 || s > poly.len) { return null; }
				var pa = pointAt(poly, s), j = pa.seg, last = poly.pts.length - 2;
				var lo = poly.cum[j] + (j === 0 ? o.pad0 : GAP) + d.w / 2, hi = poly.cum[j + 1] - (j === last ? o.pad1 : GAP) - d.w / 2;
				if (lo > hi) { return null; }
				if (s < lo || s > hi) {
					if (spec.k === 0) { return null; }
					s = Math.max(lo, Math.min(hi, s));
					if (Math.abs(s - (o.sA + spec.k * step)) > step * 0.6) { return null; }
					pa = pointAt(poly, s);
				}
				var ang = normAngle(Math.atan2(pa.dy, pa.dx) * 180 / Math.PI), rad = ang * Math.PI / 180;
				var nx = Math.sin(rad), ny = -Math.cos(rad), off = spec.side * (d.h / 2 + GAP + 0.5);
				var cx = pa.x + nx * off, cy = pa.y + ny * off;
				var c = mkCand(st, L, rsI, spec.layout, 'left', cx - d.w / 2, cy - d.h / 2, ang, null, spec.base, spec);
				c.s = s; c.side = spec.side;
				return c;
			}
			var P = pointAt(poly, o.sA), ux = spec.ux, uy = spec.uy;
			if (spec.t === 'beside') {
				var qx = -P.dy, qy = P.dx, dn = ux * qx + uy * qy;
				if (Math.abs(dn) < 0.45) { return null; }
				var e = d.w / 2 * Math.abs(qx) + d.h / 2 * Math.abs(qy), t = (e + GAP + 1) / Math.abs(dn);
				var bx = P.x + ux * t, by = P.y + uy * t;
				var al = ux > 0.3 ? 'left' : (ux < -0.3 ? 'right' : 'center');
				return mkCand(st, L, rsI, spec.layout, al, bx - d.w / 2, by - d.h / 2, 0, null, spec.base, spec);
			}
			var side = ux >= -1e-9 ? 1 : -1;
			var hx = P.x + ux * (spec.len + 4), hy = P.y + uy * (spec.len + 4);
			var ld = leaderFrom(st, P.x, P.y, ux, uy, hx, hy, side);
			var hg = hangFrom(st, L, rsI, spec.layout, ld.ex, ld.ey, side, uy, d);
			return mkCand(st, L, rsI, spec.layout, hg.align, hg.x, hg.y, 0, ld.pts, spec.base, spec);
		}
		// Last view's spot, carried by its offset from the anchor.
		function matPrev(st, L, rsI) {
			var pp = L.prevPl, pr = L.prevReq, layout = pp.layout || pr.layout || L.usual;
			if (layout !== 'stack' && layout !== 'line') { return null; }
			var d = dims(st, L, rsI, layout), dp = blockDims(pp.rows.map(function (i) { return pr.rows[i]; }).filter(Boolean), layout, st.text.separatorW);
			var ax = L.anchor.x, ay = L.anchor.y, px = pr.anchor.x, py = pr.anchor.y, align = pp.align || 'left';
			var x, y, angle = pp.angle || 0;
			if (angle) {
				if (L.owner.t !== 'link') { return null; }
				var pa = pointAt(L.owner.poly, L.owner.sA), now_ = Math.atan2(pa.dy, pa.dx) * 180 / Math.PI;
				if (angDiff(normAngle(now_), angle) > 3 && angDiff(normAngle(now_) + 180, angle) > 3) { return null; }
				var ccx = pp.x + dp.w / 2 - px, ccy = pp.y + dp.h / 2 - py;
				x = ax + ccx - d.w / 2; y = ay + ccy - d.h / 2;
				return mkCand(st, L, rsI, layout, align, x, y, angle, null, PREV_BONUS, { t: 'prev' });
			}
			if (align === 'right') { x = ax + (pp.x - px) + dp.w - d.w; } else if (align === 'center') { x = ax + (pp.x - px) + dp.w / 2 - d.w / 2; } else { x = ax + (pp.x - px); }
			var above = pp.y + dp.h / 2 < py - 2;
			y = above ? ay + (pp.y - py) + dp.h - d.h : ay + (pp.y - py);
			var leader = null;
			if (pp.leader && pp.leader.length >= 2) {
				var pe = pp.leader[pp.leader.length - 1];
				var ex = align === 'right' ? x + d.w : x;
				var rows = L.rowsets[rsI], half = L.rows[rows[0]].h / 2;
				var ey = Math.max(y + half, Math.min(y + d.h - half, ay + (pe[1] - py)));
				var hx = ex, hy = ey;
				if (pp.leader.length === 3) { hx = ex + (pp.leader[1][0] - pe[0]); }
				var o = L.owner, sx, sy;
				if (o.t === 'link') {
					var ps = pp.leader[0], q = nearestOn(o.poly, ax + ps[0] - px, ay + ps[1] - py);
					sx = q.x; sy = q.y;
				} else {
					var vx = hx - o.x, vy = hy - o.y, vl = Math.hypot(vx, vy) || 1, r0 = Math.min(o.sw, o.sh);
					if (vl <= r0) { return null; }
					sx = o.x + vx / vl * r0; sy = o.y + vy / vl * r0;
				}
				leader = pp.leader.length === 3 ? [[sx, sy], [hx, hy], [ex, ey]] : [[sx, sy], [ex, ey]];
				if ((align === 'right' && sx < ex - 0.5) || (align !== 'right' && sx > ex + 0.5)) { return null; }
			}
			return mkCand(st, L, rsI, layout, align, x, y, 0, leader, PREV_BONUS, { t: 'prev' });
		}
		// A hand-placed label hangs at the user's point, on the side away from its owner.
		function handCand(st, L) {
			var h = L.req.hand, o = L.owner, rsI = 0, layout = L.usual, d = dims(st, L, rsI, layout);
			var ox = o.t === 'link' ? L.anchor.x : o.x;
			var side = h.x >= ox ? 1 : -1, align = side > 0 ? 'left' : 'right';
			var rows = L.rowsets[0], first = L.rows[rows[0]].h, last = L.rows[rows[rows.length - 1]].h;
			var ys = layout === 'line' ? [h.y - d.h / 2] : [h.y - first / 2, h.y - d.h / 2, h.y - d.h + last / 2];
			var sides = [side, -side];
			var best = null, bestBad = Infinity;
			sides.forEach(function (sd) {
				ys.forEach(function (y) {
					var x = sd > 0 ? h.x : h.x - d.w, al = sd > 0 ? 'left' : 'right';
					var starts = leaderStarts(st, L, h);
					starts.forEach(function (sp) {
						var c = mkCand(st, L, rsI, layout, al, x, y, 0, [[sp[0], sp[1]], [h.x, h.y]], 0, { t: 'hand' });
						var bad = hardCount(st, L, c) * 10 + (sd === side ? 0 : 1) + Math.hypot(sp[0] - h.x, sp[1] - h.y) / 1000;
						if (bad < bestBad) { bestBad = bad; best = c; }
					});
				});
			});
			void align;
			return best;
		}
		function leaderStarts(st, L, h) {
			var o = L.owner, out = [];
			if (o.t === 'link') {
				var q = nearestOn(o.poly, h.x, h.y), a = pointAt(o.poly, o.sA);
				out.push([q.x, q.y], [a.x, a.y]);
				for (var k = 1; k < 8; k++) { var p = pointAt(o.poly, o.poly.len * k / 8); out.push([p.x, p.y]); }
			} else {
				var vx = h.x - o.x, vy = h.y - o.y, vl = Math.hypot(vx, vy), r0 = Math.min(o.sw, o.sh);
				out.push(vl > r0 ? [o.x + vx / vl * r0, o.y + vy / vl * r0] : [h.x, h.y], [o.x, o.y]);
			}
			return out;
		}
		function hardCount(st, L, c) {
			var n = 0, g = st.grid, own = L.owner.nodeId;
			c.boxes.forEach(function (b) {
				g.query(b.bb, function (it) {
					if ((it.k === SYM || it.k === LSYM || it.k === TEXT) && obOverlap(b, it.ob, 0)) { n++; }
					if (it.k === LABEL && it.own !== L.id && obOverlap(b, it.ob, LBL_TOL)) { n++; }
					return false;
				});
			});
			c.segs.forEach(function (s) {
				g.query(segBB(s), function (it) {
					if (it.k === SYM && it.own !== own && segHitsOB(s[0], s[1], s[2], s[3], it.raw, -0.5)) { n++; }
					return false;
				});
			});
			return n;
		}

		// ---- judging one candidate: Infinity if it breaks a never-rule, else its cost -------
		function evalCand(st, L, c, bound) {
			var vp = st.vp, g = st.grid, i, j;
			if (c.bb.x0 < vp.x0 || c.bb.y0 < vp.y0 || c.bb.x1 > vp.x1 || c.bb.y1 > vp.y1) { return Infinity; }
			var ownNode = L.owner.nodeId, ownLink = L.owner.linkId, id = L.id;
			for (i = 0; i < c.boxes.length; i++) {
				var b = c.boxes[i];
				var hit = g.query(b.bb, function (it) {
					if (it.k === SYM || it.k === LSYM || it.k === TEXT) { return obOverlap(b, it.ob, 0); }
					if (it.k === LABEL) { return it.own !== id && obOverlap(b, it.ob, LBL_TOL); }
					return false;
				});
				if (hit) { return Infinity; }
			}
			for (j = 0; j < c.segs.length; j++) {
				var s = c.segs[j];
				var bad = g.query(segBB(s), function (it) {
					return it.k === SYM && it.own !== ownNode && segHitsOB(s[0], s[1], s[2], s[3], it.raw, -0.5);
				});
				if (bad) { return Infinity; }
			}
			var cost = c.base, pipes = [], leads = [], labs = [], xld = [], xpipe = [], own = false, arrows = [];
			for (i = 0; i < c.boxes.length && cost < bound; i++) {
				var bx = c.boxes[i];
				g.query(bx.bb, function (it) {
					if (it.k === PIPE) {
						if (it.own === ownLink) {
							if (!own && segHitsOB(it.s[0], it.s[1], it.s[2], it.s[3], bx, 1)) { own = true; cost += COST.OWN_PIPE; }
						} else if (pipes.indexOf(it.own) < 0 && segHitsOB(it.s[0], it.s[1], it.s[2], it.s[3], bx, 1)) {
							pipes.push(it.own); cost += COST.LBL_PIPE;
						}
					} else if (it.k === LEAD || it.k === TLEAD) {
						if (it.own !== id && leads.indexOf(it.own) < 0 && segHitsOB(it.s[0], it.s[1], it.s[2], it.s[3], bx, 1)) {
							leads.push(it.own); cost += COST.LBL_LDR;
						}
					} else if (it.k === ARROW) {
						if (arrows.indexOf(it) < 0 && obOverlap(bx, it.ob, 0.5)) { arrows.push(it); cost += COST.LBL_ARROW; }
					}
					return cost >= bound;
				});
			}
			for (j = 0; j < c.segs.length && cost < bound; j++) {
				var sg = c.segs[j], start = c.segs[0];
				g.query(segBB(sg), function (it) {
					if (it.k === LABEL) {
						if (it.own !== id && labs.indexOf(it.own) < 0 && segHitsOB(sg[0], sg[1], sg[2], sg[3], it.ob, 1)) { labs.push(it.own); cost += COST.LBL_LDR; }
					} else if (it.k === LEAD || it.k === TLEAD) {
						if (it.own !== id && xld.indexOf(it.own) < 0 && segsCross(sg, it.s)) { xld.push(it.own); cost += COST.LDR_LDR; }
					} else if (it.k === PIPE) {
						if (it.own !== ownLink && xpipe.indexOf(it.own) < 0 && segsCross(sg, it.s)) {
							var p = crossPoint(sg, it.s);
							if (!p || Math.hypot(p[0] - start[0], p[1] - start[1]) > 1.5) { xpipe.push(it.own); cost += COST.LDR_PIPE; }
						}
					} else if (it.k === LSYM) {
						if (segHitsOB(sg[0], sg[1], sg[2], sg[3], it.ob, 0)) { cost += COST.LDR_LSYM; }
					} else if (it.k === TEXT) {
						if (segHitsOB(sg[0], sg[1], sg[2], sg[3], it.ob, 0)) { cost += COST.LDR_TEXT; }
					}
					return cost >= bound;
				});
			}
			return cost;
		}

		// The cheapest legal spot for label L showing rowset rsI, or null. Specs are tried in
		// order of their own cost; once that alone reaches the best found, nothing cheaper is left.
		function bestFor(st, L, rsI, bound) {
			var best = null, bestCost = bound, specs = L.specs, c, cost, i;
			if (L.prevPl) {
				c = matPrev(st, L, rsI);
				if (c) { cost = evalCand(st, L, c, bestCost); if (cost < bestCost) { bestCost = cost; best = c; } }
			}
			for (i = 0; i < specs.length; i++) {
				var sp = specs[i];
				if (sp.base >= bestCost) { break; }
				c = materialize(st, L, sp, rsI);
				if (!c) { continue; }
				cost = evalCand(st, L, c, bestCost);
				if (cost < bestCost) { bestCost = cost; best = c; }
			}
			if (best) { best.cost = bestCost; }
			return best;
		}

		function commit(st, L, c) {
			uncommit(st, L);
			if (!c) { return; }
			L.cur = c;
			c.boxes.forEach(function (b) { var it = { k: LABEL, ob: b, bb: b.bb, own: L.id }; st.grid.insert(it); L.items.push(it); });
			c.segs.forEach(function (s) { var it = { k: LEAD, s: s, bb: segBB(s), own: L.id }; st.grid.insert(it); L.items.push(it); });
		}
		function uncommit(st, L) {
			L.items.forEach(function (it) { st.grid.remove(it); });
			L.items = []; L.cur = null;
		}

		// GROW: each round every shown label may take back one more property, if a spot for the
		// bigger label costs no more than the property is worth.
		function grow(st, order) {
			for (var round = 0; round < 6; round++) {
				var changed = false;
				for (var i = 0; i < order.length; i++) {
					var L = order[i], c0 = L.cur;
					if (!c0 || c0.rs === 0) { continue; }
					uncommit(st, L);
					var cur = evalCand(st, L, c0, Infinity);
					// A label regrowing to what it showed last view may take its old spot back first.
					var c = bestFor(st, L, c0.rs - 1, cur + ROW_GAIN);
					if (c) { commit(st, L, c); changed = true; } else { commit(st, L, c0); }
				}
				if (!changed) { break; }
			}
		}

		// MEND: a hidden label looks for a spot blocked by exactly one movable label; if that one
		// can go somewhere else (with fewer rows if it must), both are shown.
		function mend(st, order, deadline) {
			var any = false;
			for (var i = 0; i < order.length; i++) {
				if (now() > deadline) { break; }
				var L = order[i];
				if (L.cur) { continue; }
				var rsI = L.rowsets.length - 1, specs = L.specs, tried = {};
				for (var k = 0; k < specs.length && k < 60; k++) {
					var c = materialize(st, L, specs[k], rsI);
					if (!c) { continue; }
					var bl = blockers(st, L, c);
					if (!bl || tried[bl.id]) { continue; }
					tried[bl.id] = 1;
					var old = bl.cur;
					uncommit(st, bl);
					if (evalCand(st, L, c, Infinity) === Infinity) { commit(st, bl, old); continue; }
					commit(st, L, c);
					var moved = null;
					for (var r = old.rs; r < bl.rowsets.length && !moved; r++) { moved = bestFor(st, bl, r, Infinity); }
					if (moved) { commit(st, bl, moved); any = true; break; }
					uncommit(st, L);
					commit(st, bl, old);
				}
			}
			return any;
		}
		// The one placed label (not hand-placed) that alone keeps c from being legal, or null.
		function blockers(st, L, c) {
			var vp = st.vp;
			if (c.bb.x0 < vp.x0 || c.bb.y0 < vp.y0 || c.bb.x1 > vp.x1 || c.bb.y1 > vp.y1) { return null; }
			var g = st.grid, found = null, fatal = false, ownNode = L.owner.nodeId;
			c.boxes.forEach(function (b) {
				g.query(b.bb, function (it) {
					if ((it.k === SYM || it.k === LSYM || it.k === TEXT) && obOverlap(b, it.ob, 0)) { fatal = true; return true; }
					if (it.k === LABEL && it.own !== L.id && obOverlap(b, it.ob, LBL_TOL)) {
						if (found && found !== it.own) { fatal = true; return true; }
						found = it.own;
					}
					return false;
				});
			});
			if (fatal || !found) { return null; }
			c.segs.forEach(function (s) {
				g.query(segBB(s), function (it) {
					if (it.k === SYM && it.own !== ownNode && segHitsOB(s[0], s[1], s[2], s[3], it.raw, -0.5)) { fatal = true; return true; }
					return false;
				});
			});
			if (fatal) { return null; }
			var B = null;
			st.labels.forEach(function (M) { if (M.id === found) { B = M; } });
			return B && !B.req.hand ? B : null;
		}

		// R9: a pipe longer than the repeat spacing carries its label again, evenly along it,
		// wherever the copy fits beside the pipe.
		function repeats(st, L) {
			var c = L.cur, o = L.owner, sp = st.text.repeatSpacingPx;
			if (!c || o.t !== 'link' || !(sp > 0) || o.poly.len <= sp) { return; }
			var n = Math.max(3, 2 * Math.round(o.poly.len / (2 * sp)) + 1), gap = o.poly.len / n;
			var d = dims(st, L, c.rs, c.layout), reps = [];
			var mainS = c.s !== undefined ? c.s : o.sA;
			for (var k = 0; k < n; k++) {
				var s0 = (k + 0.5) * gap;
				if (Math.abs(s0 - mainS) < gap / 2) { continue; }
				var done = false;
				[0, 0.15, -0.15, 0.3, -0.3].forEach(function (f) {
					if (done) { return; }
					[c.side || 1, -(c.side || 1)].forEach(function (side) {
						if (done) { return; }
						var s = s0 + f * gap, pa = pointAt(o.poly, s), j = pa.seg, last = o.poly.pts.length - 2;
						var lo = o.poly.cum[j] + (j === 0 ? o.pad0 : GAP) + d.w / 2, hi = o.poly.cum[j + 1] - (j === last ? o.pad1 : GAP) - d.w / 2;
						if (s < lo || s > hi) { return; }
						var ang = normAngle(Math.atan2(pa.dy, pa.dx) * 180 / Math.PI), rad = ang * Math.PI / 180;
						var off = side * (d.h / 2 + GAP + 0.5), cx = pa.x + Math.sin(rad) * off, cy = pa.y - Math.cos(rad) * off;
						var rc = mkCand(st, L, c.rs, c.layout, c.align, cx - d.w / 2, cy - d.h / 2, ang, null, 0, null);
						if (evalCand(st, L, rc, 1.5) < 1.5) {
							rc.boxes.forEach(function (b) { var it = { k: LABEL, ob: b, bb: b.bb, own: L.id }; st.grid.insert(it); L.items.push(it); });
							reps.push({ x: rc.x, y: rc.y, angle: ang });
							done = true;
						}
					});
				});
			}
			c.reps = reps;
		}

		// H-b: nothing needs thinking ahead of a view yet beyond the per-node pipe directions,
		// which place() caches as it meets them; opening a project clears that cache.
		function idle(budgetMs, info) {
			if (info && info.opening) { dirCache = {}; }
		}

		return { name: 'C (keep, show, grow, mend)', place: place, idle: idle };
	}

	return { name: 'C (keep, show, grow, mend)', create: create };
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs.lpnPlacerC;
}
