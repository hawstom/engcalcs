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
// FREE SPACE is modelled three ways, cheapest first: a raster of cells that some obstacle covers
// completely (a candidate lying over one is certainly illegal), grids of the exact obstacles
// (symbols and Text objects, which are never covered; pipes, arrows and callouts, which are
// crossed at a cost; the labels and leaders placed so far), and, per label, the list of places
// worth trying: the corners and sides of its symbol, the open sectors between its pipes, and
// leaders of a few standard lengths. Candidates are tried cheapest-first and the search stops as
// soon as no cheaper one can exist, which is what keeps a pan or zoom fast (R10).
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
	var ALONG_TRIES = 16;      // spots along the pipe a quick search judges, apart from the level ones
	var LEVEL = 6;             // (halved) a level pipe label where the user asked for it along its pipe (R14)
	var SHAPE = 1.8;           // a label not in its usual shape (R1: wholeness goes after nearness)
	var LDR_BASE = 0.35;       // having a leader at all
	var LDR_PER_PX = 0.02;     // and each pixel of it
	var PREV_BONUS = -1.6;     // staying where it was last view
	var KEEP_MAX = 3.0;        // last view's spot is kept unless it now costs this much
	var LEADER_LENS = [8, 18, 30, 44];
	var HOOK = 8;              // the one standard short hook (clamped to text.hookMaxPx)
	var GAP = 2.5;               // clear space between a label and its own symbol or pipe
	var SYM_PAD = 0.5;           // clear space kept round every symbol and Text object
	var LBL_TOL = 0.5;         // two labels may share this much up and down (the row pitch carries leading)
	var HGAP = 4;              // and keep this much apart side by side, or they read as one
	var EDGE = 160;            // px from the view's edge where a pan can change what fits
	var CELL = 36;             // the obstacle grids' cell, px
	var RES = 3;               // the free-space raster's cell, px
	var SHOW_MAX = 4.4;          // dearer than this, a label is better hidden
	// How hard a pan or zoom may look: a label looks this far down its list before giving up,
	// growing looks only this far (convenient space), and MEND and NUDGE judge at most this many
	// spots each.
	var QUICK = { show: 120, grow: 50, mend: 2000, nudge: 600, deadline: 0 };
	var NAME = 'C (keep, show, grow, mend)';

	var SYM = 1, LSYM = 2, TEXT = 3, TLEAD = 4, PIPE = 5, LABEL = 6, LEAD = 7, ARROW = 8;
	var D2R = Math.PI / 180;

	function now() {
		return (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
	}

	// ---- boxes: centred, turned `angle` degrees; the box is its own bounding box -----------
	function newBox() {
		var b = { cx: 0, cy: 0, w: 0, h: 0, angle: 0, ca: 1, sa: 0, x0: 0, y0: 0, x1: 0, y1: 0, bb: null };
		b.bb = b;
		return b;
	}
	function setBox(b, cx, cy, w, h, angle) {
		b.cx = cx; b.cy = cy; b.w = w; b.h = h; b.angle = angle || 0;
		if (!b.angle) {
			b.ca = 1; b.sa = 0;
			b.x0 = cx - w / 2; b.x1 = cx + w / 2; b.y0 = cy - h / 2; b.y1 = cy + h / 2;
			return b;
		}
		var c = Math.cos(b.angle * D2R), s = Math.sin(b.angle * D2R), ac = Math.abs(c), as = Math.abs(s);
		var ex = (w * ac + h * as) / 2, ey = (w * as + h * ac) / 2;
		b.ca = c; b.sa = s; b.x0 = cx - ex; b.x1 = cx + ex; b.y0 = cy - ey; b.y1 = cy + ey;
		return b;
	}
	function obox(cx, cy, w, h, angle) { return setBox(newBox(), cx, cy, w, h, angle); }
	function inflate(b, by) { return obox(b.cx, b.cy, b.w + 2 * by, b.h + 2 * by, b.angle); }
	var WIDE = { x0: 0, y0: 0, x1: 0, y1: 0 };
	function widened(b) { WIDE.x0 = b.x0 - HGAP; WIDE.x1 = b.x1 + HGAP; WIDE.y0 = b.y0; WIDE.y1 = b.y1; return WIDE; }
	function bbHit(a, b) { return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1; }
	function segBB(s) {
		return s.bb || (s.bb = { x0: Math.min(s[0], s[2]), y0: Math.min(s[1], s[3]), x1: Math.max(s[0], s[2]), y1: Math.max(s[1], s[3]) });
	}
	// Overlap of the two boxes' shadows on the axis (ux, uy).
	function axisOverlap(a, b, ux, uy) {
		var ra = a.w / 2 * Math.abs(a.ca * ux + a.sa * uy) + a.h / 2 * Math.abs(-a.sa * ux + a.ca * uy);
		var rb = b.w / 2 * Math.abs(b.ca * ux + b.sa * uy) + b.h / 2 * Math.abs(-b.sa * ux + b.ca * uy);
		var pa = a.cx * ux + a.cy * uy, pb = b.cx * ux + b.cy * uy;
		return Math.min(pa + ra, pb + rb) - Math.max(pa - ra, pb - rb);
	}
	// Do two boxes overlap by more than `tol` on every separating axis?
	function obOverlap(a, b, tol) {
		if (!a.angle && !b.angle) {
			return Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) > tol && Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) > tol;
		}
		if (!bbHit(a, b)) { return false; }
		return axisOverlap(a, b, a.ca, a.sa) > tol && axisOverlap(a, b, -a.sa, a.ca) > tol
			&& axisOverlap(a, b, b.ca, b.sa) > tol && axisOverlap(a, b, -b.sa, b.ca) > tol;
	}
	// Do two labels' boxes clash: overlap up and down, or come closer than HGAP side by side?
	function clash(a, b) {
		if (!a.angle && !b.angle) {
			return Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) > -HGAP && Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) > LBL_TOL;
		}
		return obOverlap(a, b, -1);
	}
	// Does segment a-b pass through box `b` shrunk by `shrink` (negative grows it)?
	function segHitsOB(ax, ay, bx, by, b, shrink) {
		var hw = b.w / 2 - shrink, hh = b.h / 2 - shrink;
		if (hw <= 0 || hh <= 0) { return false; }
		var px = ax - b.cx, py = ay - b.cy, qx = bx - b.cx, qy = by - b.cy, t;
		if (b.angle) {
			var c = b.ca, s = b.sa;
			t = px * c + py * s; py = -px * s + py * c; px = t;
			t = qx * c + qy * s; qy = -qx * s + qy * c; qx = t;
		}
		var dx = qx - px, dy = qy - py, t0 = 0, t1 = 1, ta, tb;
		if (dx === 0) { if (px <= -hw || px >= hw) { return false; } } else {
			ta = (-hw - px) / dx; tb = (hw - px) / dx;
			if (ta > tb) { t = ta; ta = tb; tb = t; }
			if (ta > t0) { t0 = ta; } if (tb < t1) { t1 = tb; }
			if (t0 >= t1) { return false; }
		}
		if (dy === 0) { if (py <= -hh || py >= hh) { return false; } } else {
			ta = (-hh - py) / dy; tb = (hh - py) / dy;
			if (ta > tb) { t = ta; ta = tb; tb = t; }
			if (ta > t0) { t0 = ta; } if (tb < t1) { t1 = tb; }
		}
		return t0 < t1;
	}
	function orient(ax, ay, bx, by, cx, cy) { return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax); }
	function near(x0, y0, x1, y1) { return Math.hypot(x0 - x1, y0 - y1) <= 1; }
	// A proper crossing of two segments; touching at an end point is not one.
	function segsCross(s, t) {
		var d1 = orient(t[0], t[1], t[2], t[3], s[0], s[1]), d2 = orient(t[0], t[1], t[2], t[3], s[2], s[3]);
		if (!d1 || !d2 || (d1 > 0) === (d2 > 0)) { return false; }
		var d3 = orient(s[0], s[1], s[2], s[3], t[0], t[1]), d4 = orient(s[0], s[1], s[2], s[3], t[2], t[3]);
		if (!d3 || !d4 || (d3 > 0) === (d4 > 0)) { return false; }
		return !(near(s[0], s[1], t[0], t[1]) || near(s[0], s[1], t[2], t[3]) || near(s[2], s[3], t[0], t[1]) || near(s[2], s[3], t[2], t[3]));
	}
	function ptSegDist(px, py, t) {
		var vx = t[2] - t[0], vy = t[3] - t[1], L2 = vx * vx + vy * vy;
		var u = L2 ? Math.max(0, Math.min(1, ((px - t[0]) * vx + (py - t[1]) * vy) / L2)) : 0;
		return Math.hypot(px - t[0] - u * vx, py - t[1] - u * vy);
	}
	// Two leaders touch if they cross or pass within 2 px of each other at an end.
	function leadersTouch(s, t) {
		var d1 = orient(t[0], t[1], t[2], t[3], s[0], s[1]), d2 = orient(t[0], t[1], t[2], t[3], s[2], s[3]);
		var d3 = orient(s[0], s[1], s[2], s[3], t[0], t[1]), d4 = orient(s[0], s[1], s[2], s[3], t[2], t[3]);
		if ((d1 > 0) !== (d2 > 0) && (d3 > 0) !== (d4 > 0)) { return true; }
		return ptSegDist(s[0], s[1], t) < 2 || ptSegDist(s[2], s[3], t) < 2 || ptSegDist(t[0], t[1], s) < 2 || ptSegDist(t[2], t[3], s) < 2;
	}
	// Distance from s's start to where s crosses t.
	function crossDist(s, t) {
		var d = (s[2] - s[0]) * (t[3] - t[1]) - (s[3] - s[1]) * (t[2] - t[0]);
		if (!d) { return Infinity; }
		var u = ((t[0] - s[0]) * (t[3] - t[1]) - (t[1] - s[1]) * (t[2] - t[0])) / d;
		return Math.abs(u) * Math.hypot(s[2] - s[0], s[3] - s[1]);
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
	// A reading angle: text is never upside down. The window is the user's own
	// (scene.settings.readableAngleDeg), set per view in setup(); (-90, 90] until then.
	var WIN = { min: -90, max: 90 };
	function normAngle(a) {
		while (a > WIN.max) { a -= 180; }
		while (a <= WIN.min) { a += 180; }
		return Math.round(a * 10) / 10;
	}
	function steepOf(a) {
		while (a > 90) { a -= 180; }
		while (a <= -90) { a += 180; }
		return Math.abs(a);
	}
	function angDiff(a, b) { var d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; }

	// ---- the exact obstacles: a uniform grid over the viewport -----------------------------
	function Grid(bb, cell) {
		this.x0 = bb.x0; this.y0 = bb.y0; this.cell = cell;
		this.nx = Math.max(1, Math.ceil((bb.x1 - bb.x0) / cell));
		this.ny = Math.max(1, Math.ceil((bb.y1 - bb.y0) / cell));
		this.cells = [];
		for (var i = 0; i < this.nx * this.ny; i++) { this.cells.push([]); }
		this.stamp = 0;
		this.rr = [0, 0, 0, 0];
	}
	Grid.prototype.range = function (bb) {
		var i0 = Math.floor((bb.x0 - this.x0) / this.cell), i1 = Math.floor((bb.x1 - this.x0) / this.cell);
		var j0 = Math.floor((bb.y0 - this.y0) / this.cell), j1 = Math.floor((bb.y1 - this.y0) / this.cell);
		if (i1 < 0 || j1 < 0 || i0 >= this.nx || j0 >= this.ny) { return null; }
		var r = this.rr;
		r[0] = Math.max(0, i0); r[1] = Math.min(this.nx - 1, i1); r[2] = Math.max(0, j0); r[3] = Math.min(this.ny - 1, j1);
		return r;
	};
	Grid.prototype.insert = function (it) {
		var r = this.range(it.bb), i, j, idx = [];
		if (!r) { it.cellIdx = idx; return; }
		if (it.s && (r[1] - r[0] + 1) * (r[3] - r[2] + 1) > 4) {
			// A long segment: only the cells it runs through (a grid walk, Amanatides and Woo).
			var c = this.cell, sx = it.s[0] - this.x0, sy = it.s[1] - this.y0, ex = it.s[2] - this.x0, ey = it.s[3] - this.y0;
			var ci = Math.floor(sx / c), cj = Math.floor(sy / c), ei = Math.floor(ex / c), ej = Math.floor(ey / c);
			var dx = ex - sx, dy = ey - sy, stepI = dx > 0 ? 1 : -1, stepJ = dy > 0 ? 1 : -1;
			var tMaxX = dx ? ((stepI > 0 ? (ci + 1) * c : ci * c) - sx) / dx : Infinity;
			var tMaxY = dy ? ((stepJ > 0 ? (cj + 1) * c : cj * c) - sy) / dy : Infinity;
			var tDX = dx ? c / Math.abs(dx) : Infinity, tDY = dy ? c / Math.abs(dy) : Infinity;
			for (var guard = 0; guard < 4 * (this.nx + this.ny); guard++) {
				if (ci >= 0 && cj >= 0 && ci < this.nx && cj < this.ny) { idx.push(cj * this.nx + ci); }
				if (ci === ei && cj === ej) { break; }
				if (tMaxX < tMaxY) { tMaxX += tDX; ci += stepI; } else { tMaxY += tDY; cj += stepJ; }
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
	// Every item near bb, once each, into `out` (reused, so no garbage per query).
	Grid.prototype.collect = function (bb, out) {
		out.length = 0;
		var r = this.range(bb);
		if (!r) { return out; }
		var st = ++this.stamp;
		for (var j = r[2]; j <= r[3]; j++) {
			for (var i = r[0]; i <= r[1]; i++) {
				var arr = this.cells[j * this.nx + i];
				for (var k = 0; k < arr.length; k++) {
					var it = arr[k], b = it.bb;
					if (it.q !== st) {
						it.q = st;
						if (b.x0 <= bb.x1 && bb.x0 <= b.x1 && b.y0 <= bb.y1 && bb.y0 <= b.y1) { out.push(it); }
					}
				}
			}
		}
		return out;
	};

	// ---- the free-space raster: a quick "certainly taken" test before the exact one ---------
	// A cell (RES px square) is marked while some obstacle covers ALL of it. A candidate box that
	// wholly contains a marked cell overlaps that obstacle by at least RES px both ways, so it
	// is certainly illegal; only a candidate that passes goes on to the exact geometry.
	function Raster(bb, res) {
		this.x0 = bb.x0; this.y0 = bb.y0; this.r = res;
		this.nx = Math.max(1, Math.ceil((bb.x1 - bb.x0) / res));
		this.ny = Math.max(1, Math.ceil((bb.y1 - bb.y0) / res));
		this.a = new Uint16Array(this.nx * this.ny);
	}
	Raster.prototype.mark = function (b, d) {
		var i, j, a = this.a, nx = this.nx, r = this.r;
		if (!b.angle) {
			var i0 = Math.max(0, Math.ceil((b.x0 - this.x0) / r)), i1 = Math.min(nx, Math.floor((b.x1 - this.x0) / r));
			var j0 = Math.max(0, Math.ceil((b.y0 - this.y0) / r)), j1 = Math.min(this.ny, Math.floor((b.y1 - this.y0) / r));
			for (j = j0; j < j1; j++) { for (i = i0; i < i1; i++) { a[j * nx + i] += d; } }
			return;
		}
		var k0 = Math.max(0, Math.floor((b.x0 - this.x0) / r)), k1 = Math.min(nx - 1, Math.floor((b.x1 - this.x0) / r));
		var m0 = Math.max(0, Math.floor((b.y0 - this.y0) / r)), m1 = Math.min(this.ny - 1, Math.floor((b.y1 - this.y0) / r));
		for (j = m0; j <= m1; j++) {
			for (i = k0; i <= k1; i++) {
				var x = this.x0 + i * r, y = this.y0 + j * r;
				if (inOB(x, y, b) && inOB(x + r, y, b) && inOB(x, y + r, b) && inOB(x + r, y + r, b)) { a[j * nx + i] += d; }
			}
		}
	};
	Raster.prototype.solidUnder = function (b) {
		var r = this.r, nx = this.nx, a = this.a, i, j;
		if (b.angle) {
			// A turned box: the cells round points on its long centre line that lie wholly inside
			// it (a cell's diagonal from the edges), every RES px along it.
			var dg = r * 1.5, half = b.w / 2 - dg;
			if (b.h / 2 < dg || half < 0) { return false; }
			for (var t = -half; t <= half; t += r) {
				i = Math.floor((b.cx + t * b.ca - this.x0) / r); j = Math.floor((b.cy + t * b.sa - this.y0) / r);
				if (i >= 0 && j >= 0 && i < nx && j < this.ny && a[j * nx + i]) { return true; }
			}
			return false;
		}
		var i0 = Math.max(0, Math.ceil((b.x0 - this.x0) / r)), i1 = Math.min(nx, Math.floor((b.x1 - this.x0) / r));
		var j0 = Math.max(0, Math.ceil((b.y0 - this.y0) / r)), j1 = Math.min(this.ny, Math.floor((b.y1 - this.y0) / r));
		if (i0 >= i1 || j0 >= j1) { return false; }
		var S = this.sat;
		if (S) {
			var w = nx + 1;
			return S[j1 * w + i1] - S[j0 * w + i1] - S[j1 * w + i0] + S[j0 * w + i0] > 0;
		}
		for (j = j0; j < j1; j++) { for (i = i0; i < i1; i++) { if (a[j * nx + i]) { return true; } } }
		return false;
	};
	// Freeze a raster that will not change again this view: a summed-area table answers
	// solidUnder() for a level box in four reads.
	Raster.prototype.freeze = function () {
		var nx = this.nx, ny = this.ny, w = nx + 1, a = this.a, S = new Int32Array(w * (ny + 1));
		for (var j = 0; j < ny; j++) {
			var run = 0;
			for (var i = 0; i < nx; i++) { run += a[j * nx + i] ? 1 : 0; S[(j + 1) * w + i + 1] = S[j * w + i + 1] + run; }
		}
		this.sat = S;
	};
	function inOB(x, y, b) {
		var dx = x - b.cx, dy = y - b.cy;
		return Math.abs(dx * b.ca + dy * b.sa) <= b.w / 2 && Math.abs(-dx * b.sa + dy * b.ca) <= b.h / 2;
	}

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

	// ---- one label's block --------------------------------------------------------------------
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

	// ---- a CANDIDATE: one label's block, its ink and its leader. The search fills one reusable
	// candidate per view (no garbage per try) and copies out only the ones worth keeping. -----
	function newCand() {
		return { rs: 0, rows: null, layout: 'stack', align: 'left', x: 0, y: 0, w: 0, h: 0, angle: 0, base: 0, spec: null,
			s: undefined, side: 0, single: true, blk: newBox(), boxes: [], nb: 0,
			segs: [[0, 0, 0, 0], [0, 0, 0, 0]], ns: 0, pts: [[0, 0], [0, 0], [0, 0]], np: 0, stat: undefined, cost: 0, reps: null };
	}
	// Fill c with the block of rowset rsI of label L at (x, y), and its ink: one box per stacked
	// row (the staircase, so the ground beside a short row stays free), one for a line.
	function fillBlock(st, L, c, rsI, layout, align, x, y, angle) {
		var d = dims(st, L, rsI, layout), rows = L.rowsets[rsI];
		c.rs = rsI; c.rows = rows; c.layout = layout; c.align = align; c.x = x; c.y = y; c.w = d.w; c.h = d.h;
		c.angle = angle || 0; c.stat = undefined; c.s = undefined; c.side = 0; c.np = 0; c.ns = 0; c.reps = null;
		var bcx = x + d.w / 2, bcy = y + d.h / 2;
		setBox(c.blk, bcx, bcy, d.w, d.h, c.angle);
		c.single = layout === 'line' || rows.length === 1;
		if (c.single) {
			if (!c.boxes.length) { c.boxes.push(newBox()); }
			setBox(c.boxes[0], bcx, bcy, d.w, d.h, c.angle);
			c.nb = 1;
			return c;
		}
		var cos = Math.cos(c.angle * D2R), sin = Math.sin(c.angle * D2R), top = y;
		for (var i = 0; i < rows.length; i++) {
			var r = L.rows[rows[i]], left = align === 'right' ? x + d.w - r.w : (align === 'center' ? x + (d.w - r.w) / 2 : x);
			var dx = left + r.w / 2 - bcx, dy = top + r.h / 2 - bcy;
			if (c.boxes.length <= i) { c.boxes.push(newBox()); }
			setBox(c.boxes[i], bcx + dx * cos - dy * sin, bcy + dx * sin + dy * cos, r.w, r.h, c.angle);
			top += r.h;
		}
		c.nb = rows.length;
		return c;
	}
	function setLeader(c, n, ax, ay, bx, by, ex, ey) {
		c.np = n;
		c.pts[0][0] = ax; c.pts[0][1] = ay; c.pts[1][0] = bx; c.pts[1][1] = by;
		if (n === 3) { c.pts[2][0] = ex; c.pts[2][1] = ey; }
		c.ns = n - 1;
		for (var i = 0; i < c.ns; i++) {
			var s = c.segs[i];
			s[0] = c.pts[i][0]; s[1] = c.pts[i][1]; s[2] = c.pts[i + 1][0]; s[3] = c.pts[i + 1][1];
			s.bb = null; segBB(s);
		}
	}
	// A kept copy of a candidate (the reusable one is overwritten by the next try).
	function keep(c) {
		var k = newCand(), i;
		k.rs = c.rs; k.rows = c.rows; k.layout = c.layout; k.align = c.align; k.x = c.x; k.y = c.y; k.w = c.w; k.h = c.h;
		k.angle = c.angle; k.base = c.base; k.spec = c.spec; k.s = c.s; k.side = c.side; k.single = c.single;
		k.stat = c.stat; k.cost = c.cost;
		setBox(k.blk, c.blk.cx, c.blk.cy, c.blk.w, c.blk.h, c.blk.angle);
		for (i = 0; i < c.nb; i++) { k.boxes.push(obox(c.boxes[i].cx, c.boxes[i].cy, c.boxes[i].w, c.boxes[i].h, c.boxes[i].angle)); }
		k.nb = c.nb;
		if (c.np) { setLeader(k, c.np, c.pts[0][0], c.pts[0][1], c.pts[1][0], c.pts[1][1], c.pts[2][0], c.pts[2][1]); }
		return k;
	}
	function leaderOf(c) {
		if (!c.np) { return null; }
		var out = [];
		for (var i = 0; i < c.np; i++) { out.push([c.pts[i][0], c.pts[i][1]]); }
		return out;
	}
	function dims(st, L, rsI, layout) {
		var arr = L.dimC[layout === 'line' ? 1 : 0];
		if (!arr[rsI]) { arr[rsI] = blockDims(L.rowsets[rsI].map(function (i) { return L.rows[i]; }), layout, st.text.separatorW); }
		return arr[rsI];
	}

	// ---- direction preferences round a point label (y down: -45 degrees is north-east) -----
	// Cartographic habit: upper right first, then right, lower right, upper left, left ...
	var PREF = [
		[-45, 0], [0, 0.05], [-22.5, 0.03], [45, 0.1], [22.5, 0.08], [-135, 0.15], [180, 0.18],
		[-157.5, 0.17], [135, 0.22], [157.5, 0.2], [-67.5, 0.12], [-90, 0.25], [-112.5, 0.2],
		[67.5, 0.2], [90, 0.3], [112.5, 0.28]
	];
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
		var dirCache = {};   // node id -> the directions of the pipes meeting there (H-b)
		var specCache = {};  // label id -> its candidate specs (H-b)

		var last = null;     // the view place() answered last: {scene, prev, fp, layout}
		var ready = null;    // a layout idle() thought out ahead: {fp, layout}

		function place(scene, opts) {
			var prev = opts && opts.prev && opts.prev.layout && opts.prev.scene ? opts.prev : null;
			var fp = fingerprint(scene, prev), out;
			if (ready && ready.fp === fp) { out = ready.layout; } else { out = layout(scene, prev, QUICK); }
			ready = null;
			last = { scene: scene, prev: prev, fp: fp, layout: out };
			return out;
		}

		// H-b: hard thinking waits for the pauses. Opening a project lays out its first view with
		// a far deeper search than a pan or zoom can afford; a pause after a view deepens that
		// view's layout, starting from exactly what is on screen so nothing already shown moves,
		// and place() hands it over if it is asked for the same view again. Either is thrown
		// away if it cannot finish inside the budget.
		function idle(budgetMs, info) {
			var deadline = now() + Math.max(0, (budgetMs || 0) - 5), out;
			if (info && info.opening) {
				dirCache = {}; specCache = {}; ready = null; last = null;
				if (!info.scene) { return; }
				out = layout(info.scene, null, deep(deadline));
				if (out) { ready = { fp: fingerprint(info.scene, null), layout: out }; }
				return;
			}
			if (!last || (info && info.scene && info.scene !== last.scene) || last.deepened) { return; }
			last.deepened = true;
			out = layout(last.scene, { scene: last.scene, layout: last.layout, again: true }, deep(deadline));
			if (out) { ready = { fp: last.fp, layout: out }; }
		}
		function deep(deadline) { return { show: 400, grow: 90, mend: 8000, nudge: 8000, deadline: deadline }; }

		// A cheap signature of everything a layout depends on: the view, the lettering, the
		// labels and their rows, where every node is, and which layout the last view had (R13).
		function fingerprint(scene, prev) {
			var h = 0, i;
			function mix(v) { h = (h * 31 + (typeof v === 'number' ? Math.round(v * 100) : hashStr(String(v)))) | 0; }
			function hashStr(t) { var k = 0; for (var j = 0; j < t.length; j++) { k = (k * 33 + t.charCodeAt(j)) | 0; } return k; }
			mix(scene.view.s); mix(scene.view.tx); mix(scene.view.ty); mix(scene.viewport.w); mix(scene.viewport.h);
			mix(scene.text.sizePx); mix(JSON.stringify(scene.dropOrder || {}));
			for (i = 0; i < scene.nodes.length; i++) { mix(scene.nodes[i].x); mix(scene.nodes[i].y); mix(scene.nodes[i].symbol.w); }
			for (i = 0; i < scene.links.length; i++) {
				var l = scene.links[i];
				mix(l.id); mix((l.symbols || []).length);
				for (var k = 0; k < l.points.length; k++) { mix(l.points[k][0]); mix(l.points[k][1]); }
			}
			for (i = 0; i < (scene.customers || []).length; i++) { mix(scene.customers[i].box.x); mix(scene.customers[i].box.y); }
			for (i = 0; i < (scene.texts || []).length; i++) { mix(scene.texts[i].box.cx); mix(scene.texts[i].box.cy); mix(scene.texts[i].text); }
			for (i = 0; i < scene.labels.length; i++) {
				var r = scene.labels[i];
				mix(r.id); mix(r.layout); mix(r.hand ? r.hand.x + ',' + r.hand.y : '-');
				for (var j = 0; j < r.rows.length; j++) { mix(r.rows[j].text); mix(r.rows[j].w); }
			}
			mix(prev ? (prev.layout === (last && last.layout) ? 'last' : 'other') : 'none');
			return h;
		}

		function layout(scene, prev, effort) {
			var st = setup(scene, prev);
			var labels = st.labels, i;
			st.effort = effort;

			// 0. Hand-placed labels: where the user put them, whole, always (N4).
			labels.forEach(function (L) { if (L.req.hand) { commit(st, L, handCand(st, L)); } });

			var order = labels.filter(function (L) { return !L.req.hand; });
			order.sort(function (a, b) { return (a.prevPl ? 0 : 1) - (b.prevPl ? 0 : 1) || a.dens - b.dens || (a.id < b.id ? -1 : 1); });

			// 1. KEEP: last view's spot and rows, if still legal and not much worse.
			order.forEach(function (L) {
				if (!L.prevPl || !fillPrev(st, L, L.prevRs, st.probe)) { return; }
				var cap = prev.again ? Infinity : KEEP_MAX + PREV_BONUS;
				var cost = judge(st, L, st.probe, cap);
				if (cost < cap) { st.probe.cost = cost; commit(st, L, keep(st.probe)); L.settled = L.panKept = st.pan && !L.nearEdge; }
			});
			// 1b. HOME (R1, R7): a kept label out on a leader, or out of its usual shape, goes
			// back beside its owner as soon as there is room there for the same rows.
			order.forEach(function (L) {
				var c0 = L.cur;
				if (!c0) { return; }
				// R14: a pipe label the user asked for along its pipe, kept level, turns to its pipe
				// as soon as there is room beside it for the same rows.
				var level = L.along && !c0.angle && !L.panKept && !alignedNow(L, c0);
				if (!c0.ns && c0.layout === L.usual && !level) { return; }
				uncommit(st, L);
				commit(st, L, bestFor(st, L, c0.rs, c0.cost - PREV_BONUS + (level ? LEVEL / 2 : 0), 40, level ? 'along' : true) || c0);
			});
			// 2. SHOW: everything else, with the label itself only.
			order.forEach(function (L) {
				if (L.cur || (st.pan && L.prevHidden && !L.nearEdge)) { return; }
				commit(st, L, bestFor(st, L, L.rowsets.length - 1, SHOW_MAX, effort.show));
			});
			// 3. GROW, in rounds.
			grow(st, order);
			// 4. MEND: a hidden label may evict one neighbour who can move.
			var touched = [];
			mend(st, order, touched);
			// 4b. NUDGE (R2): a label that cannot grow may move one neighbour, rows and all, to
			// other convenient space, if that gives it room for its next property.
			nudge(st, order, touched);
			grow(st, touched);
			// 5. Repeats along long pipes (R9), in whatever room is left.
			for (i = 0; i < labels.length; i++) { if (labels[i].cur && labels[i].owner.t === 'link') { repeats(st, labels[i]); } }

			var out = {};
			labels.forEach(function (L) {
				var c = L.cur;
				if (!c) { out[L.id] = { shown: false }; return; }
				var pl = { shown: true, rows: c.rows.slice(), layout: c.layout, align: c.align, x: c.x, y: c.y, leader: leaderOf(c) };
				if (c.angle) { pl.angle = c.angle; }
				if (c.reps && c.reps.length) { pl.repeats = c.reps; }
				out[L.id] = pl;
			});
			scene.labels.forEach(function (req) { if (!out[req.id]) { out[req.id] = { shown: false }; } });
			return st.late ? null : { labels: out };
		}

		// ---- scene setup: obstacles into the grids, labels into working records ------------
		// Three grids: HARD (node, pump and valve symbols, Text objects: never covered), SOFT
		// (pipes, flow arrows, Text callouts: crossed at a cost) and PLACED (the labels and
		// leaders placed so far). The first two are fixed for the view, so what a candidate
		// costs against them is worked out once per view and kept.
		function setup(scene, prev) {
			var vp = scene.viewport, text = scene.text, rw = scene.settings && scene.settings.readableAngleDeg;
			WIN = rw && isFinite(rw.min) && isFinite(rw.max) && rw.max - rw.min >= 179.9 ? { min: rw.min, max: rw.max } : { min: -90, max: 90 };
			var vpbb = { x0: vp.x, y0: vp.y, x1: vp.x + vp.w, y1: vp.y + vp.h };
			var gbb = { x0: vpbb.x0 - CELL, y0: vpbb.y0 - CELL, x1: vpbb.x1 + CELL, y1: vpbb.y1 + CELL };
			var hg = new Grid(gbb, CELL), sg = new Grid(gbb, CELL), dg = new Grid(gbb, CELL);
			var hr = new Raster(gbb, RES), dr = new Raster(gbb, RES);
			var nodes = {}, links = {}, incident = {};
			scene.nodes.forEach(function (n) {
				nodes[n.id] = n;
				var raw = obox(n.symbol.x + n.symbol.w / 2, n.symbol.y + n.symbol.h / 2, n.symbol.w, n.symbol.h, 0);
				if (!bbHit(raw, gbb)) { return; }
				var ob = inflate(raw, SYM_PAD);
				hg.insert({ k: SYM, ob: ob, raw: raw, bb: ob, own: n.id });
				hr.mark(ob, 1);
			});
			scene.links.forEach(function (l) {
				links[l.id] = l;
				(incident[l.from] = incident[l.from] || []).push(l);
				(incident[l.to] = incident[l.to] || []).push(l);
				(l.symbols || []).forEach(function (b) {
					var ob = inflate(obox(b.cx, b.cy, b.w, b.h, b.angle), SYM_PAD);
					if (bbHit(ob, gbb)) { hg.insert({ k: LSYM, ob: ob, bb: ob, own: l.id }); hr.mark(ob, 1); }
				});
				(l.arrows || []).forEach(function (b) {
					var ob = obox(b.cx, b.cy, b.w * 0.8, b.h * 0.8, b.angle);
					if (bbHit(ob, gbb)) { sg.insert({ k: ARROW, ob: ob, bb: ob, own: l.id }); }
				});
				for (var i = 1; i < l.points.length; i++) {
					var s = clipSeg([l.points[i - 1][0], l.points[i - 1][1], l.points[i][0], l.points[i][1]], gbb);
					if (s) { sg.insert({ k: PIPE, s: s, bb: segBB(s), own: l.id }); }
				}
			});
			(scene.texts || []).forEach(function (t) {
				var ob = inflate(obox(t.box.cx, t.box.cy, t.box.w, t.box.h, t.box.angle), SYM_PAD);
				if (bbHit(ob, gbb)) { hg.insert({ k: TEXT, ob: ob, bb: ob, own: t.id }); hr.mark(ob, 1); }
				var ld = t.leader;
				if (ld && ld.length > 1) {
					for (var i = 1; i < ld.length; i++) {
						var s = clipSeg([ld[i - 1][0], ld[i - 1][1], ld[i][0], ld[i][1]], gbb);
						if (s) { sg.insert({ k: TLEAD, s: s, bb: segBB(s), own: 'T' + t.id }); }
					}
				}
			});
			hr.freeze();
			var customers = {};
			(scene.customers || []).forEach(function (c) { customers[c.id] = c; });

			var prevL = prev ? prev.layout.labels || {} : {}, prevReq = {};
			if (prev) { prev.scene.labels.forEach(function (r) { prevReq[r.id] = r; }); }

			// A pure pan: the same scale and lettering, so everything keeps its shape and a label
			// that could not show or grow last view cannot now either, unless the edge of the
			// view was what stopped it.
			var pan = !!prev && Math.abs(prev.scene.view.s - scene.view.s) <= 1e-9 * Math.abs(scene.view.s)
				&& prev.scene.text.sizePx === text.sizePx && !prev.again;
			var st = { pan: pan, scene: scene, text: text, vp: vpbb, hg: hg, sg: sg, dg: dg, hr: hr, dr: dr, labels: [], byId: {},
				buf: [], seen: [], seen2: [], probe: newCand(), work: 0 };
			scene.labels.forEach(function (req) {
				var L = mkLabel(st, req, nodes, links, incident, customers);
				if (!L) { return; }
				var pp = prevL[req.id], pr = prevReq[req.id];
				if (pp && pp.shown && pr && pp.rows && pp.rows.length && !pr.hand) {
					L.prevPl = pp; L.prevReq = pr;
					L.prevRs = rowsetMatching(L, pp.rows, pr);
				}
				L.prevHidden = !!(pr && !(pp && pp.shown));
				var a = req.anchor;
				L.nearEdge = a.x - vpbb.x0 < EDGE || vpbb.x1 - a.x < EDGE || a.y - vpbb.y0 < EDGE || vpbb.y1 - a.y < EDGE;
				st.labels.push(L);
				st.byId[L.id] = L;
			});
			// How crowded each label's home is: the least crowded are placed first (they take the
			// obvious spots; the crowded then search round them).
			st.labels.forEach(function (L) {
				var a = L.anchor, bb = { x0: a.x - 45, y0: a.y - 45, x1: a.x + 45, y1: a.y + 45 };
				L.dens = hg.collect(bb, st.buf).length + sg.collect(bb, st.buf).length;
			});
			return st;
		}

		// The rows, in the user's drop order: rowsets[0] is every row, each next one has dropped
		// one more property, the last is the label itself (the rows the drop order never names).
		function mkLabel(st, req, nodes, links, incident, customers) {
			var rows = req.rows || [];
			if (!rows.length) { return null; }
			var drop = (st.scene.dropOrder && st.scene.dropOrder[req.kind]) || [];
			var keepRows = rows.map(function (r, i) { return i; }), rowsets = [keepRows.slice()];
			drop.forEach(function (f) {
				var k = keepRows.filter(function (i) { return rows[i].field !== f; });
				if (k.length && k.length < keepRows.length) { keepRows = k; rowsets.push(keepRows.slice()); }
			});
			var L = { id: req.id, req: req, kind: req.kind, rows: rows, rowsets: rowsets, anchor: req.anchor,
				usual: req.layout === 'line' ? 'line' : 'stack', cur: null, items: [], dimC: [[], []], sc: [] };
			if (req.kind === 'link' && links[req.owner] && links[req.owner].points.length > 1) {
				var lk = links[req.owner], poly = polyOf(lk.points);
				var pa = pointAt(poly, homeArc(poly, nearestOn(poly, req.anchor.x, req.anchor.y).s, st.vp));
				var pad = function (id) {
					var n = nodes[id];
					return n ? Math.max(n.symbol.w, n.symbol.h) / 2 + GAP + 1 : GAP;
				};
				L.owner = { t: 'link', linkId: lk.id, poly: poly, sA: pa.s, P: pa, pad0: pad(lk.from), pad1: pad(lk.to) };
				L.along = !!req.along;
				L.specs = cachedSpecs(L, 'l' + Math.round(Math.atan2(pa.dy, pa.dx) * 90 / Math.PI) + (L.along ? 'A' : '-'), function () { return linkSpecs(L); });
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
				var pd = o.nodeId ? pipeDirs(o.nodeId, nodes, incident) : [];
				L.specs = cachedSpecs(L, 'n' + pd.map(Math.round).join(','), function () { return pointSpecs(L, pd); });
			}
			return L;
		}
		// Where along its pipe a pipe label is at home: the middle of the pipe (its anchor) when
		// that is well inside the view, else the middle of the longest stretch of the pipe that is.
		function homeArc(poly, sMid, vp) {
			var m = 12, r = { x0: vp.x0 + m, y0: vp.y0 + m, x1: vp.x1 - m, y1: vp.y1 - m }, best = null, p = poly.pts;
			for (var j = 1; j < p.length; j++) {
				var seg = [p[j - 1][0], p[j - 1][1], p[j][0], p[j][1]], cl = clipSeg(seg, r), L = poly.cum[j] - poly.cum[j - 1];
				if (!cl || !L) { continue; }
				var a = poly.cum[j - 1] + Math.hypot(cl[0] - seg[0], cl[1] - seg[1]), b = poly.cum[j - 1] + Math.hypot(cl[2] - seg[0], cl[3] - seg[1]);
				if (sMid >= a && sMid <= b) { return sMid; }
				if (best && Math.abs(best[1] - a) < 0.01) { best[1] = b; } else if (!best || b - a > best[1] - best[0]) { best = [a, b]; }
			}
			return best ? (best[0] + best[1]) / 2 : sMid;
		}
		// A label's spec list depends only on the shape of the pipes at its owner, which a pan or
		// zoom does not change: kept across views (H-b), rebuilt when the network changes (R13).
		function cachedSpecs(L, key, make) {
			key += L.usual;
			var c = specCache[L.id];
			if (!c || c.key !== key) { c = specCache[L.id] = { key: key, specs: make() }; }
			return c.specs;
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
		// Directions (degrees) of the pipes leaving a node. A zoom does not turn them, so they
		// are kept across views (H-b) and recomputed only when the pipes change.
		function pipeDirs(id, nodes, incident) {
			var ls = incident[id] || [], n = nodes[id], out = [], sig = '';
			ls.forEach(function (l) {
				var p = l.points, q = l.from === id ? p[1] : p[p.length - 2];
				if (!q) { return; }
				var a = Math.atan2(q[1] - n.y, q[0] - n.x) * 180 / Math.PI;
				out.push(a); sig += Math.round(a) + ',';
			});
			var c = dirCache[id];
			if (c && c.key === sig) { return c.dirs; }
			dirCache[id] = { key: sig, dirs: out };
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
					if (gap >= 50) { dirs.push(((a + gap / 2 + 540) % 360) - 180); }
				}
			} else if (pipes.length === 1) {
				dirs.push(((pipes[0] + 360) % 360) - 180);
			}
			var specs = [];
			dirs.forEach(function (deg) {
				var ux = Math.cos(deg * D2R), uy = Math.sin(deg * D2R), pref = prefOf(deg), nearPipe = 180;
				pipes.forEach(function (p) { nearPipe = Math.min(nearPipe, angDiff(p, deg)); });
				['stack', 'line'].forEach(function (layout) {
					var sh = layout === L.usual ? 0 : SHAPE;
					specs.push({ t: 'adj', ux: ux, uy: uy, layout: layout, base: pref + sh });
					LEADER_LENS.forEach(function (len) {
						specs.push({ t: 'ldr', ux: ux, uy: uy, len: len, layout: layout,
							base: LDR_BASE + len * LDR_PER_PX + pref * 0.5 + (nearPipe < 14 ? 0.8 : 0) + sh });
					});
				});
			});
			return finishSpecs(specs);
		}
		function linkSpecs(L) {
			var pa = L.owner.P, specs = [];
			var sa = steepOf(Math.atan2(pa.dy, pa.dx) * 180 / Math.PI), steep = sa > 60 ? 0.35 : sa / 200;
			var nx = -pa.dy, ny = pa.dx;   // a normal of the pipe at its middle
			['line', 'stack'].forEach(function (layout) {
				var sh = layout === L.usual ? 0 : SHAPE;
				// Along the pipe only as one line (a turned stack reads badly), and only when the
				// user's setting asks for it (R14); a level label is then the dearer fallback.
				[0, 1, -1, 2, -2, 3, -3, 4, -4, 6, -6].forEach(function (k) {
					if (layout !== 'line' || !L.along) { return; }
					[1, -1].forEach(function (side) {
						(Math.abs(k) <= 3 ? [0, 1] : [0]).forEach(function (far) {
							specs.push({ t: 'along', k: k, side: side, far: far, layout: layout,
								base: steep + Math.abs(k) * 0.12 + (side < 0 ? 0.04 : 0) + far * 0.15 + sh });
						});
					});
				});
				for (var i = 0; i < 16; i++) {
					var deg = i * 22.5 - 180, ux = Math.cos(deg * D2R), uy = Math.sin(deg * D2R);
					if (Math.abs(ux * nx + uy * ny) < 0.5) { continue; }
					var pref = prefOf(deg) + (L.along ? LEVEL : 0);
					specs.push({ t: 'beside', ux: ux, uy: uy, layout: layout, base: 0.3 + pref * 0.5 + sh });
					LEADER_LENS.forEach(function (len) {
						specs.push({ t: 'ldr', ux: ux, uy: uy, len: len, layout: layout, base: 0.3 + LDR_BASE + len * LDR_PER_PX + pref * 0.5 + sh });
					});
				}
			});
			return finishSpecs(specs);
		}
		function finishSpecs(specs) {
			specs.sort(function (a, b) { return a.base - b.base; });
			specs.forEach(function (s, i) { s.i = i; });
			return specs;
		}

		// ---- filling the candidate for one spec and rowset --------------------------------
		function hookLen(st) { return Math.min(HOOK, st.text.hookMaxPx || HOOK); }
		// A block hung from the leader's end (ex, ey), on the side away from the leader (R5: the
		// text is justified to the side the leader arrives from). Straight, or with the one
		// standard short hook when the leader climbs steeply (R6).
		function hang(st, L, c, rsI, layout, sx, sy, hx, hy, ux, uy) {
			var side = ux >= -1e-9 ? 1 : -1, d = dims(st, L, rsI, layout), ex = hx, ey = hy, hooked = Math.abs(uy) > 0.72;
			if (hooked) { ex = hx + side * hookLen(st); }
			var rows = L.rowsets[rsI], first = L.rows[rows[0]].h, last = L.rows[rows[rows.length - 1]].h, y;
			if (layout === 'line') { y = ey - d.h / 2; } else if (uy < -0.35) { y = ey - d.h + last / 2; } else if (uy > 0.35) { y = ey - first / 2; } else { y = ey - d.h / 2; }
			fillBlock(st, L, c, rsI, layout, side > 0 ? 'left' : 'right', side > 0 ? ex : ex - d.w, y, 0);
			if (hooked) { setLeader(c, 3, sx, sy, hx, hy, ex, ey); } else { setLeader(c, 2, sx, sy, ex, ey); }
			return true;
		}
		function fillSpec(st, L, spec, rsI, c) {
			if (spec.layout !== L.usual && L.rowsets[rsI].length === 1) { return false; }   // the same block twice
			var d = dims(st, L, rsI, spec.layout), o = L.owner, ux = spec.ux, uy = spec.uy;
			c.base = spec.base; c.spec = spec;
			if (o.t === 'link') { return fillLink(st, L, spec, rsI, c, d); }
			if (spec.t === 'adj') {
				// On the square ring round the symbol: its corners are the classic quadrant positions.
				var m = Math.max(Math.abs(ux), Math.abs(uy)), qx = ux / m, qy = uy / m;
				var cx = o.x + qx * (o.sw + GAP + d.w / 2), cy = o.y + qy * (o.sh + GAP + d.h / 2);
				fillBlock(st, L, c, rsI, spec.layout, ux > 0.3 ? 'left' : (ux < -0.3 ? 'right' : 'center'), cx - d.w / 2, cy - d.h / 2, 0);
				return true;
			}
			var rb = Math.min(Math.abs(ux) > 1e-9 ? o.sw / Math.abs(ux) : Infinity, Math.abs(uy) > 1e-9 ? o.sh / Math.abs(uy) : Infinity);
			var r0 = Math.min(o.sw, o.sh);
			return hang(st, L, c, rsI, spec.layout, o.x + ux * r0, o.y + uy * r0, o.x + ux * (rb + spec.len), o.y + uy * (rb + spec.len), ux, uy);
		}
		function fillLink(st, L, spec, rsI, c, d) {
			var o = L.owner, poly = o.poly, P = o.P;
			if (spec.t === 'along') {
				var j = P.seg, last = poly.pts.length - 2, s, pa;
				var span = function (jj) {
					return [poly.cum[jj] + (jj === 0 ? o.pad0 : GAP) + d.w / 2, poly.cum[jj + 1] - (jj === last ? o.pad1 : GAP) - d.w / 2];
				};
				var lh = span(j), clear = spec.far ? Math.max(GAP + 0.5, st.text.rowHeightPx / 2) : GAP + 0.5;
				if (lh[0] > lh[1]) {
					// The stretch at home is shorter than the label: it may still lie beside it,
					// overhanging its ends, if it stands off far enough to clear the symbols there
					// (the judging decides whether it does). Stations are tenths either side of the
					// stretch's middle.
					if (Math.abs(spec.k) > 3 || !spec.far) { return false; }
					s = (poly.cum[j] + poly.cum[j + 1]) / 2 + spec.k * 0.1 * (poly.cum[j + 1] - poly.cum[j]);
					pa = pointAt(poly, s);
					c.base += 0.3;
				} else {
					var step = 14 + d.w * 0.35, s0 = o.sA + spec.k * step;
					s = s0;
					if (s < 0 || s > poly.len) { return false; }
					pa = spec.k ? pointAt(poly, s) : P;
					lh = span(pa.seg);
					if (lh[0] > lh[1]) { return false; }
					if (s < lh[0] || s > lh[1]) {
						s = Math.max(lh[0], Math.min(lh[1], s));
						if (Math.abs(s - s0) > step * 0.6) { return false; }
						pa = pointAt(poly, s);
					}
				}
				var ang = normAngle(Math.atan2(pa.dy, pa.dx) * 180 / Math.PI), off = spec.side * (d.h / 2 + clear);
				var cx = pa.x + Math.sin(ang * D2R) * off, cy = pa.y - Math.cos(ang * D2R) * off;
				var base = c.base;
				fillBlock(st, L, c, rsI, spec.layout, 'left', cx - d.w / 2, cy - d.h / 2, ang);
				c.base = base; c.s = s; c.side = spec.side;
				return true;
			}
			var ux = spec.ux, uy = spec.uy;
			if (spec.t === 'beside') {
				var qx = -P.dy, qy = P.dx, dn = ux * qx + uy * qy;
				if (Math.abs(dn) < 0.45) { return false; }
				var t = (d.w / 2 * Math.abs(qx) + d.h / 2 * Math.abs(qy) + GAP + 1) / Math.abs(dn);
				var bx = P.x + ux * t, by = P.y + uy * t;
				// Beside the pipe means touching distance from the middle of it, or it needs a leader.
				if (Math.max(0, Math.abs(bx - P.x) - d.w / 2) + Math.max(0, Math.abs(by - P.y) - d.h / 2) > GAP + 6) { return false; }
				fillBlock(st, L, c, rsI, spec.layout, ux > 0.3 ? 'left' : (ux < -0.3 ? 'right' : 'center'), bx - d.w / 2, by - d.h / 2, 0);
				return true;
			}
			return hang(st, L, c, rsI, spec.layout, P.x, P.y, P.x + ux * (spec.len + 4), P.y + uy * (spec.len + 4), ux, uy);
		}
		// Last view's spot, carried by its offset from the anchor.
		function fillPrev(st, L, rsI, c) {
			var pp = L.prevPl, pr = L.prevReq, layout = pp.layout || pr.layout || L.usual;
			if (rsI < 0 || (layout !== 'stack' && layout !== 'line')) { return false; }
			var d = dims(st, L, rsI, layout);
			var dp = L.prevDims || (L.prevDims = blockDims(pp.rows.map(function (i) { return pr.rows[i]; }).filter(Boolean), layout, st.text.separatorW));
			var ax = L.anchor.x, ay = L.anchor.y, px = pr.anchor.x, py = pr.anchor.y, align = pp.align || 'left';
			var x, y, angle = pp.angle || 0, o = L.owner;
			c.base = PREV_BONUS; c.spec = null;
			if (angle) {
				if (o.t !== 'link') { return false; }
				var a = normAngle(Math.atan2(o.P.dy, o.P.dx) * 180 / Math.PI);
				if (angDiff(a, angle) > 3 && angDiff(a + 180, angle) > 3) { return false; }
				var ccx = pp.x + dp.w / 2 - px, ccy = pp.y + dp.h / 2 - py;
				fillBlock(st, L, c, rsI, layout, align, ax + ccx - d.w / 2, ay + ccy - d.h / 2, angle);
				var q = nearestOn(o.poly, ax + ccx, ay + ccy);
				c.s = q.s;
				c.side = ((ax + ccx - q.x) * Math.sin(angle * D2R) - (ay + ccy - q.y) * Math.cos(angle * D2R)) >= 0 ? 1 : -1;
				return true;
			}
			if (align === 'right') { x = ax + (pp.x - px) + dp.w - d.w; } else if (align === 'center') { x = ax + (pp.x - px) + dp.w / 2 - d.w / 2; } else { x = ax + (pp.x - px); }
			// A block that hung above its anchor keeps its bottom edge; any other keeps its top.
			y = pp.y + dp.h / 2 < py - 2 ? ay + (pp.y - py) + dp.h - d.h : ay + (pp.y - py);
			fillBlock(st, L, c, rsI, layout, align, x, y, 0);
			if (pp.leader && pp.leader.length >= 2) {
				var pe = pp.leader[pp.leader.length - 1], half = L.rows[L.rowsets[rsI][0]].h / 2;
				var ex = align === 'right' ? x + d.w : x;
				var ey = Math.max(y + half, Math.min(y + d.h - half, ay + (pe[1] - py)));
				var hx = pp.leader.length === 3 ? ex + (pp.leader[1][0] - pe[0]) : ex, sx, sy;
				if (o.t === 'link') {
					var ps = pp.leader[0], qq = nearestOn(o.poly, ax + ps[0] - px, ay + ps[1] - py);
					sx = qq.x; sy = qq.y;
				} else {
					var vx = hx - o.x, vy = ey - o.y, vl = Math.hypot(vx, vy) || 1, r0 = Math.min(o.sw, o.sh);
					if (vl <= r0) { return false; }
					sx = o.x + vx / vl * r0; sy = o.y + vy / vl * r0;
				}
				if ((align === 'right' && sx < ex - 0.5) || (align !== 'right' && sx > ex + 0.5)) { return false; }
				if (pp.leader.length === 3) { setLeader(c, 3, sx, sy, hx, ey, ex, ey); } else { setLeader(c, 2, sx, sy, ex, ey); }
			}
			return true;
		}
		// A hand-placed label hangs at the user's point, on the side away from its owner, whole.
		function handCand(st, L) {
			var h = L.req.hand, o = L.owner, layout = L.usual, d = dims(st, L, 0, layout);
			var side = h.x >= (o.t === 'link' ? L.anchor.x : o.x) ? 1 : -1;
			var rows = L.rowsets[0], first = L.rows[rows[0]].h, last = L.rows[rows[rows.length - 1]].h;
			var ys = layout === 'line' ? [h.y - d.h / 2] : [h.y - first / 2, h.y - d.h / 2, h.y - d.h + last / 2];
			var starts = leaderStarts(L, h), best = null, bestBad = Infinity, c = st.probe;
			[side, -side].forEach(function (sd) {
				ys.forEach(function (y) {
					starts.forEach(function (sp) {
						fillBlock(st, L, c, 0, layout, sd > 0 ? 'left' : 'right', sd > 0 ? h.x : h.x - d.w, y, 0);
						setLeader(c, 2, sp[0], sp[1], h.x, h.y);
						c.base = 0; c.spec = null;
						var bad = hardCount(st, L, c) * 10 + (sd === side ? 0 : 1) + Math.hypot(sp[0] - h.x, sp[1] - h.y) / 1000;
						if (bad < bestBad) { bestBad = bad; best = keep(c); }
					});
				});
			});
			return best;
		}
		function leaderStarts(L, h) {
			var o = L.owner, out = [];
			if (o.t === 'link') {
				var q = nearestOn(o.poly, h.x, h.y);
				out.push([q.x, q.y], [o.P.x, o.P.y]);
				for (var k = 1; k < 8; k++) { var p = pointAt(o.poly, o.poly.len * k / 8); out.push([p.x, p.y]); }
			} else {
				var vx = h.x - o.x, vy = h.y - o.y, vl = Math.hypot(vx, vy), r0 = Math.min(o.sw, o.sh);
				out.push(vl > r0 ? [o.x + vx / vl * r0, o.y + vy / vl * r0] : [h.x, h.y], [o.x, o.y]);
			}
			return out;
		}
		function hardCount(st, L, c) {
			var n = 0, own = L.owner.nodeId, arr, i, k;
			for (i = 0; i < c.nb; i++) {
				var b = c.boxes[i];
				arr = st.hg.collect(b, st.buf);
				for (k = 0; k < arr.length; k++) { if (obOverlap(b, arr[k].ob, 0)) { n++; } }
				arr = st.dg.collect(widened(b), st.buf);
				for (k = 0; k < arr.length; k++) { if (arr[k].k === LABEL && arr[k].own !== L.id && clash(b, arr[k].ob)) { n++; } }
			}
			for (i = 0; i < c.ns; i++) {
				var s = c.segs[i];
				arr = st.hg.collect(s.bb, st.buf);
				for (k = 0; k < arr.length; k++) { if (arr[k].k === SYM && arr[k].own !== own && segHitsOB(s[0], s[1], s[2], s[3], arr[k].raw, -0.5)) { n++; } }
			}
			return n;
		}

		// ---- judging a candidate: Infinity if it breaks a never-rule, else its cost ---------
		// The bounding box of a candidate's block and leader together: one grid query each.
		function ubbOf(c) {
			var u = c.ubb || (c.ubb = { x0: 0, y0: 0, x1: 0, y1: 0 }), b = c.blk;
			u.x0 = b.x0 - HGAP; u.y0 = b.y0; u.x1 = b.x1 + HGAP; u.y1 = b.y1;
			for (var j = 0; j < c.ns; j++) {
				var q = c.segs[j].bb;
				if (q.x0 < u.x0) { u.x0 = q.x0; } if (q.y0 < u.y0) { u.y0 = q.y0; }
				if (q.x1 > u.x1) { u.x1 = q.x1; } if (q.y1 > u.y1) { u.y1 = q.y1; }
			}
			return u;
		}
		function inkOn(c, ob, tol) {
			if (!bbHit(c.blk, ob) || !obOverlap(c.blk, ob, tol)) { return false; }
			if (c.single) { return true; }
			for (var i = 0; i < c.nb; i++) { if (obOverlap(c.boxes[i], ob, tol)) { return true; } }
			return false;
		}
		function inkClash(c, ob) {
			if (!clash(c.blk, ob)) { return false; }
			if (c.single) { return true; }
			for (var i = 0; i < c.nb; i++) { if (clash(c.boxes[i], ob)) { return true; } }
			return false;
		}
		function inkOnSeg(c, s) {
			if (!(s.bb.x0 <= c.blk.x1 && c.blk.x0 <= s.bb.x1 && s.bb.y0 <= c.blk.y1 && c.blk.y0 <= s.bb.y1)) { return false; }
			for (var i = 0; i < c.nb; i++) { if (segHitsOB(s[0], s[1], s[2], s[3], c.boxes[i], 1)) { return true; } }
			return false;
		}
		// The part of a candidate's cost that depends only on the fixed map.
		function staticCost(st, L, c) {
			var vp = st.vp, i, j, k, arr, it, s;
			st.work++;
			if (c.blk.x0 < vp.x0 || c.blk.y0 < vp.y0 || c.blk.x1 > vp.x1 || c.blk.y1 > vp.y1) { return Infinity; }
			for (i = 0; i < c.nb; i++) { if (st.hr.solidUnder(c.boxes[i])) { return Infinity; } }
			var ownNode = L.owner.nodeId, ownLink = L.owner.linkId, cost = c.base, u = ubbOf(c);
			// Symbols and Text objects: never under the ink (N1, N5), never a node's symbol under
			// a leader (N3); a pump, valve or Text object under a leader at a cost.
			arr = st.hg.collect(u, st.buf);
			for (k = 0; k < arr.length; k++) {
				it = arr[k];
				if (inkOn(c, it.ob, 0)) { return Infinity; }
				for (j = 0; j < c.ns; j++) {
					s = c.segs[j];
					if (!bbHit(s.bb, it.ob)) { continue; }
					if (it.k === SYM) {
						if (it.own !== ownNode && segHitsOB(s[0], s[1], s[2], s[3], it.raw, -0.5)) { return Infinity; }
					} else if (segHitsOB(s[0], s[1], s[2], s[3], it.ob, 0)) {
						cost += it.k === TEXT ? COST.LDR_TEXT : COST.LDR_LSYM;
					}
				}
			}
			// Pipes, arrows and Text callouts: under the ink, and across the leader.
			arr = st.sg.collect(u, st.buf);
			if (arr.length) {
				var seen = st.seen, xs = st.seen2, own = false, start = c.segs[0];
				seen.length = 0; xs.length = 0;
				for (k = 0; k < arr.length; k++) {
					it = arr[k];
					if (it.k === ARROW) {
						if (inkOn(c, it.ob, 0.5)) { cost += COST.LBL_ARROW; }
						continue;
					}
					if (it.own === ownLink) {
						if (!own && inkOnSeg(c, it.s)) {
							// A label turned along its pipe, or hung on a leader from it, is there to lie
							// beside it (R7, R14), never back across it.
							if (c.angle || c.ns) { return Infinity; }
							own = true; cost += COST.OWN_PIPE;
						}
						continue;
					}
					if (seen.indexOf(it.own) < 0 && inkOnSeg(c, it.s)) { seen.push(it.own); cost += it.k === TLEAD ? COST.LBL_LDR : COST.LBL_PIPE; }
					for (j = 0; j < c.ns; j++) {
						s = c.segs[j];
						if (xs.indexOf(it.own) >= 0 || !bbHit(s.bb, it.bb)) { continue; }
						if (it.k === TLEAD) { if (leadersTouch(s, it.s)) { xs.push(it.own); cost += COST.LDR_LDR; } continue; }
						if (segsCross(s, it.s) && (j > 0 || crossDist(start, it.s) > 1.5)) { xs.push(it.own); cost += COST.LDR_PIPE; }
					}
				}
			}
			return cost;
		}
		// Everything else: the labels and leaders placed so far.
		function dynCost(st, L, c, cost, bound) {
			var id = L.id, i, j, k, arr, it, s;
			for (i = 0; i < c.nb; i++) { if (st.dr.solidUnder(c.boxes[i])) { return Infinity; } }
			arr = st.dg.collect(ubbOf(c), st.buf);
			for (k = 0; k < arr.length; k++) {
				it = arr[k];
				if (it.k === LABEL && it.own !== id && inkClash(c, it.ob)) { return Infinity; }
			}
			var seen = st.seen, labs = st.seen2;
			seen.length = 0; labs.length = 0;
			for (k = 0; k < arr.length && cost < bound; k++) {
				it = arr[k];
				if (it.own === id) { continue; }
				if (it.k === LEAD) {
					if (seen.indexOf(it.own) < 0 && inkOnSeg(c, it.s)) { seen.push(it.own); cost += COST.LBL_LDR; }
					for (j = 0; j < c.ns; j++) {
						s = c.segs[j];
						var q = it.bb, r = s.bb;
						if (r.x0 < q.x1 + 2 && q.x0 - 2 < r.x1 && r.y0 < q.y1 + 2 && q.y0 - 2 < r.y1 && labs.indexOf(it) < 0 && leadersTouch(s, it.s)) { labs.push(it); cost += COST.LDR_LDR; }
					}
				} else {
					for (j = 0; j < c.ns; j++) {
						s = c.segs[j];
						if (labs.indexOf(it.own) < 0 && bbHit(s.bb, it.ob) && segHitsOB(s[0], s[1], s[2], s[3], it.ob, 1)) { labs.push(it.own); cost += COST.LBL_LDR; }
					}
				}
			}
			return cost < bound ? cost : Infinity;
		}
		// Judge a whole candidate (its static part is kept on it).
		function judge(st, L, c, bound) {
			if (c.stat === undefined) { c.stat = staticCost(st, L, c); }
			return c.stat < bound ? dynCost(st, L, c, c.stat, bound) : Infinity;
		}

		// The cheapest legal spot for label L showing rowset rsI, or null. Specs are tried in
		// order of their own cost; once that alone reaches the best found, nothing cheaper is left.
		// What a spec costs against the fixed map is remembered for the rest of the view.
		function bestFor(st, L, rsI, bound, maxTries, homeOnly) {
			var best = null, bestCost = bound + (L.along ? LEVEL / 2 : 0), specs = L.specs, c = st.probe, cost, i, tries = 0, alongTries = 0, sv;
			if (L.prevPl && !homeOnly && fillPrev(st, L, rsI, c)) {
				// Its bonus buys it preference, never the right to cost more than the bound.
				cost = judge(st, L, c, bound + PREV_BONUS);
				if (cost < bestCost) { bestCost = cost; c.cost = cost; best = keep(c); }
			}
			var sc = L.sc[rsI];
			if (!sc) { sc = L.sc[rsI] = new Float64Array(specs.length); sc.fill(NaN); }
			for (i = 0; i < specs.length; i++) {
				if (specs[i].base >= bestCost) { break; }
				if (st.effort.deadline && (i & 31) === 31 && now() > st.effort.deadline) { st.late = true; break; }
				sv = sc[i];
				// A level spot for a label asked along its pipe carries the LEVEL penalty in its
				// cost, which ranks it behind a spot along the pipe but never bars it: the bound is
				// raised by as much for it. A spot along the pipe keeps to the bound itself.
				var along = specs[i].t === 'along', lim = along ? Math.min(bestCost, bound) : bestCost;
				if (sv >= lim) { continue; }            // known illegal, or too dear already
				if (homeOnly && (homeOnly === 'along' ? !along : (specs[i].t === 'ldr' || specs[i].layout !== L.usual))) { continue; }
				// Spots along the pipe are counted apart, so trying them never uses up the level ones.
				if (along && maxTries && alongTries >= ALONG_TRIES) { continue; }
				if (!fillSpec(st, L, specs[i], rsI, c)) { sc[i] = Infinity; continue; }
				if (along) { alongTries++; } else if (maxTries && ++tries > maxTries) { break; }
				if (sv !== sv) { sv = sc[i] = staticCost(st, L, c); if (sv >= lim) { continue; } }
				c.stat = sv;
				cost = dynCost(st, L, c, sv, lim);
				if (cost < lim) { bestCost = cost; c.cost = cost; best = keep(c); }
			}
			return best;
		}

		// The LEVEL penalty a spot carries in its cost, for bounds that must not count it.
		function pen(L, spec) { return L.along && spec && spec.t !== 'along' ? LEVEL / 2 : 0; }
		// Is a level block already along its pipe (a pipe level on screen, within 5 degrees)?
		function alignedNow(L, c) {
			var q = nearestOn(L.owner.poly, c.blk.cx, c.blk.cy), p = pointAt(L.owner.poly, q.s);
			var a = Math.abs(Math.atan2(p.dy, p.dx) * 180 / Math.PI) % 180;
			return Math.min(a, 180 - a) <= 4;
		}
		function commit(st, L, c) {
			uncommit(st, L);
			if (!c) { return; }
			L.cur = c;
			for (var i = 0; i < c.nb; i++) { addInk(st, L, c.boxes[i]); }
			for (i = 0; i < c.ns; i++) { var it = { k: LEAD, s: c.segs[i], bb: c.segs[i].bb, own: L.id }; st.dg.insert(it); L.items.push(it); }
		}
		function addInk(st, L, b) {
			var it = { k: LABEL, ob: b, bb: b, own: L.id };
			st.dg.insert(it); st.dr.mark(b, 1); L.items.push(it);
		}
		function uncommit(st, L) {
			L.items.forEach(function (it) { st.dg.remove(it); if (it.k === LABEL) { st.dr.mark(it.ob, -1); } });
			L.items = []; L.cur = null;
		}

		// GROW: each round every shown label may take back one more property, if a spot for the
		// bigger label costs no more than the property is worth. Space only shrinks as others
		// grow, so a label that cannot grow this round is not asked again.
		function grow(st, order) {
			order.forEach(function (L) { L.stuck = !!L.settled; L.settled = false; });
			for (var round = 0; round < 8; round++) {
				var changed = false;
				for (var i = 0; i < order.length; i++) {
					var L = order[i], c0 = L.cur;
					if (!c0 || c0.rs === 0 || L.stuck) { continue; }
					uncommit(st, L);
					var cur = dynCost(st, L, c0, c0.stat === undefined ? (c0.stat = staticCost(st, L, c0)) : c0.stat, Infinity);
					if (cur === Infinity) { cur = c0.cost || 0; }
					// A label asked along its pipe may grow into a level spot at no loss for being level:
					// the setting chooses between spots, it never costs a property (R14 yields to G).
					// What the spot is worth, without the bonus for staying put or the LEVEL penalty: a
					// kept label may grow as freely as a new one.
					cur -= pen(L, c0.spec) + (c0.spec ? 0 : Math.min(0, c0.base));
					var c = bestFor(st, L, c0.rs - 1, Math.min(cur + ROW_GAIN, Math.max(cur, SHOW_MAX)), st.effort.grow);
					if (c) { commit(st, L, c); changed = true; } else { commit(st, L, c0); L.stuck = true; }
				}
				if (!changed) { break; }
			}
		}

		// MEND: a hidden label looks for a spot blocked by exactly one movable label; if that one
		// can go somewhere else (with fewer rows if it must), both are shown.
		function mend(st, order, touched) {
			var any = false, limit = st.work + st.effort.mend, c = st.probe;
			for (var i = 0; i < order.length && st.work < limit; i++) {
				var L = order[i];
				if (L.cur || (st.pan && L.prevHidden && !L.nearEdge)) { continue; }
				var rsI = L.rowsets.length - 1, tried = {};
				var sc = L.sc[rsI] || (L.sc[rsI] = new Float64Array(L.specs.length).fill(NaN));
				for (var k = 0; k < L.specs.length && k < 60 && st.work < limit; k++) {
					if (sc[k] === Infinity || !fillSpec(st, L, L.specs[k], rsI, c)) { continue; }
					if (sc[k] !== sc[k]) { sc[k] = staticCost(st, L, c); }
					if (sc[k] === Infinity) { continue; }
					c.stat = sc[k];
					var bl = blocker(st, L, c);
					if (!bl || tried[bl.id]) { continue; }
					tried[bl.id] = 1;
					var mine = keep(c), old = bl.cur;
					uncommit(st, bl);
					var cap = SHOW_MAX + pen(L, mine.spec);
					var cost = mine.stat < cap ? dynCost(st, L, mine, mine.stat, cap) : Infinity;
					if (cost === Infinity) { commit(st, bl, old); continue; }
					mine.cost = cost;
					commit(st, L, mine);
					var moved = bestFor(st, bl, old.rs, SHOW_MAX, 50);
					if (!moved && old.rs < bl.rowsets.length - 1) { moved = bestFor(st, bl, bl.rowsets.length - 1, SHOW_MAX, 50); }
					if (moved) { commit(st, bl, moved); touched.push(L, bl); any = true; break; }
					uncommit(st, L);
					commit(st, bl, old);
				}
			}
			return any;
		}
		function nudge(st, order, touched) {
			var any = false, limit = st.work + st.effort.nudge, c = st.probe;
			for (var i = 0; i < order.length && st.work < limit; i++) {
				var L = order[i], c0 = L.cur;
				if (!c0 || c0.rs === 0 || L.panKept) { continue; }
				var rsI = c0.rs - 1, tried = {};
				var sc = L.sc[rsI] || (L.sc[rsI] = new Float64Array(L.specs.length).fill(NaN));
				uncommit(st, L);
				var done = false;
				for (var k = 0; k < L.specs.length && k < 24 && st.work < limit && !done; k++) {
					if (sc[k] === Infinity || !fillSpec(st, L, L.specs[k], rsI, c)) { continue; }
					if (sc[k] !== sc[k]) { sc[k] = staticCost(st, L, c); }
					var pk = pen(L, L.specs[k]) - pen(L, c0.spec);
					if (sc[k] >= c0.cost + ROW_GAIN + pk || sc[k] >= SHOW_MAX + pk) { continue; }
					c.stat = sc[k];
					var bl = blocker(st, L, c);
					if (!bl || tried[bl.id] || !bl.cur) { continue; }
					tried[bl.id] = 1;
					var mine = keep(c), old = bl.cur;
					uncommit(st, bl);
					var cost = dynCost(st, L, mine, mine.stat, Math.min(c0.cost + ROW_GAIN, SHOW_MAX) + pk);
					if (cost === Infinity) { commit(st, bl, old); continue; }
					mine.cost = cost;
					commit(st, L, mine);
					// The neighbour keeps every row it had, in space no dearer than a row is worth.
					var moved = bestFor(st, bl, old.rs, Math.min((old.cost || 0) + ROW_GAIN / 2, SHOW_MAX), 40);
					if (moved) { commit(st, bl, moved); touched.push(L); any = true; done = true; break; }
					uncommit(st, L);
					commit(st, bl, old);
				}
				if (!done) { commit(st, L, c0); }
			}
			return any;
		}
		// The one placed label (not hand-placed) whose ink alone keeps c from being legal, or null.
		function blocker(st, L, c) {
			var found = null, arr, k, i;
			for (i = 0; i < c.nb; i++) {
				var b = c.boxes[i];
				arr = st.dg.collect(widened(b), st.buf);
				for (k = 0; k < arr.length; k++) {
					var it = arr[k];
					if (it.k === LABEL && it.own !== L.id && clash(b, it.ob)) {
						if (found && found !== it.own) { return null; }
						found = it.own;
					}
				}
			}
			var B = found ? st.byId[found] : null;
			return B && !B.req.hand ? B : null;
		}

		// R9: a pipe longer than the repeat spacing carries its label again, evenly along it,
		// wherever a copy fits beside the pipe.
		function repeats(st, L) {
			var c = L.cur, o = L.owner, sp = st.text.repeatSpacingPx;
			if (!c || o.t !== 'link' || !(sp > 0) || o.poly.len <= sp) { return; }
			var n = Math.max(3, 2 * Math.round(o.poly.len / (2 * sp)) + 1), gap = o.poly.len / n;
			var d = dims(st, L, c.rs, c.layout), reps = [], rc = st.probe;
			var mainS = c.s !== undefined ? c.s : o.sA, sd0 = c.side || 1;
			for (var k = 0; k < n; k++) {
				var s0 = (k + 0.5) * gap;
				if (Math.abs(s0 - mainS) < gap / 2) { continue; }
				var done = false;
				[0, 0.15, -0.15, 0.3, -0.3].forEach(function (f) {
					[sd0, -sd0].forEach(function (side) {
						if (done) { return; }
						var s = s0 + f * gap, pa = pointAt(o.poly, s), j = pa.seg, last = o.poly.pts.length - 2;
						var lo = o.poly.cum[j] + (j === 0 ? o.pad0 : GAP) + d.w / 2, hi = o.poly.cum[j + 1] - (j === last ? o.pad1 : GAP) - d.w / 2;
						if (s < lo || s > hi) { return; }
						var ang = normAngle(Math.atan2(pa.dy, pa.dx) * 180 / Math.PI), off = side * (d.h / 2 + GAP + 0.5);
						var cx = pa.x + Math.sin(ang * D2R) * off, cy = pa.y - Math.cos(ang * D2R) * off;
						fillBlock(st, L, rc, c.rs, c.layout, c.align, cx - d.w / 2, cy - d.h / 2, ang);
						rc.base = 0;
						if (judge(st, L, rc, 1.5) < 1.5) {
							for (var i = 0; i < rc.nb; i++) { addInk(st, L, obox(rc.boxes[i].cx, rc.boxes[i].cy, rc.boxes[i].w, rc.boxes[i].h, rc.boxes[i].angle)); }
							reps.push({ x: rc.x, y: rc.y, angle: ang });
							done = true;
						}
					});
				});
			}
			c.reps = reps;
		}

		return { name: NAME, place: place, idle: idle };
	}

	return { name: NAME, create: create };
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs.lpnPlacerC;
}
// The page's ?placer=c looks here (EngCalcs.lpnPlacers[name]); without this line the switch silently
// shows today's labels.
EngCalcs.lpnPlacers = EngCalcs.lpnPlacers || {};
EngCalcs.lpnPlacers.c = EngCalcs.lpnPlacerC;
