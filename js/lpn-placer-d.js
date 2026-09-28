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

	// Worth, in one currency. A shown row is 10; the label itself (its ID) is 40, so every property
	// row goes before any label does (G, R1). Costs follow Tom's order, worst first.
	var V_LABEL = 40, V_ROW = 10, V_ROW_ORDER = 0.5;
	var C_LEADER_LEADER = 9, C_LABEL_LEADER = 7, C_LABEL_PIPE = 2.5, C_LEADER_PIPE = 0.8;
	var C_LABEL_OWN_PIPE = 4;       // R7: beside its pipe, not on it
	var C_ARROW = 0.8;              // text on a flow arrow (not scored; ugly)
	var C_LEADER_LINKSYM = 5;       // a leader through a pump or valve (not N3; ugly)
	var C_LEADER_BASE = 0.4, C_LEADER_PER_ROW = 0.45;   // nearness (R1: first to give way)
	var C_ALT_LAYOUT = 0.8;         // the label's other shape (line for a node, stack for a pipe)
	var B_STICK = 3;                // staying where it was last view (no churn for nothing)
	var HARD_HAND = 1000;           // a hand-placed label cannot move: hard hits become costs

	var DIRS = 16;
	var DISTS = [0.8, 1.6, 2.6, 3.8, 5.2];   // leader lengths beyond the symbol, in row heights
	var MAX_EVALS = 400000;                 // work cap per place(); deterministic, not wall-clock
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
		return { cx: cx, cy: cy, hw: hw, hh: hh, c: c, s: s, rot: a !== 0,
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
		var axes = [[a.c, a.s], [-a.s, a.c], [b.c, b.s], [-b.s, b.c]];
		for (var i = 0; i < 4; i++) {
			var ax = axes[i][0], ay = axes[i][1];
			var ra = a.hw * Math.abs(ax * a.c + ay * a.s) + a.hh * Math.abs(-ax * a.s + ay * a.c);
			var rb = b.hw * Math.abs(ax * b.c + ay * b.s) + b.hh * Math.abs(-ax * b.s + ay * b.c);
			if (ra + rb - Math.abs(dx * ax + dy * ay) <= tol) { return false; }
		}
		return true;
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
		var dx = x1 - x0, dy = y1 - y0, t0 = 0, t1 = 1;
		var P = [-dx, dx, -dy, dy], Q = [x0 + hw, hw - x0, y0 + hh, hh - y0];
		for (var i = 0; i < 4; i++) {
			if (P[i] === 0) { if (Q[i] <= 0) { return false; } continue; }
			var r = Q[i] / P[i];
			if (P[i] < 0) { if (r > t0) { t0 = r; } } else if (r < t1) { t1 = r; }
			if (t0 >= t1) { return false; }
		}
		return t0 < t1;
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
	function Grid(vp) {
		this.x0 = vp.x - CELL * 4; this.y0 = vp.y - CELL * 4;
		this.nx = Math.ceil((vp.w + CELL * 8) / CELL); this.ny = Math.ceil((vp.h + CELL * 8) / CELL);
		this.cells = new Array(this.nx * this.ny);
		this.stamp = 0;
	}
	Grid.prototype.range = function (x0, y0, x1, y1) {
		var i0 = Math.floor((x0 - this.x0) / CELL), i1 = Math.floor((x1 - this.x0) / CELL);
		var j0 = Math.floor((y0 - this.y0) / CELL), j1 = Math.floor((y1 - this.y0) / CELL);
		if (i1 < 0 || j1 < 0 || i0 >= this.nx || j0 >= this.ny) { return null; }
		return [Math.max(0, i0), Math.max(0, j0), Math.min(this.nx - 1, i1), Math.min(this.ny - 1, j1)];
	};
	Grid.prototype.add = function (item, x0, y0, x1, y1) {
		var r = this.range(x0, y0, x1, y1);
		if (!r) { return; }
		for (var j = r[1]; j <= r[3]; j++) {
			for (var i = r[0]; i <= r[2]; i++) {
				var k = j * this.nx + i;
				(this.cells[k] || (this.cells[k] = [])).push(item);
			}
		}
	};
	Grid.prototype.remove = function (item, x0, y0, x1, y1) {
		var r = this.range(x0, y0, x1, y1);
		if (!r) { return; }
		for (var j = r[1]; j <= r[3]; j++) {
			for (var i = r[0]; i <= r[2]; i++) {
				var c = this.cells[j * this.nx + i], n = c ? c.indexOf(item) : -1;
				if (n >= 0) { c.splice(n, 1); }
			}
		}
	};
	// Calls fn(item) once per item whose cells meet the box.
	Grid.prototype.each = function (x0, y0, x1, y1, fn) {
		var r = this.range(x0, y0, x1, y1);
		if (!r) { return; }
		var st = ++this.stamp;
		for (var j = r[1]; j <= r[3]; j++) {
			for (var i = r[0]; i <= r[2]; i++) {
				var c = this.cells[j * this.nx + i];
				if (!c) { continue; }
				for (var n = 0; n < c.length; n++) {
					var it = c[n];
					if (it.st === st) { continue; }
					it.st = st;
					if (fn(it) === false) { return; }
				}
			}
		}
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
	function create() {
		return {
			name: 'D (candidate search, ejection repair, sticky)',
			place: place
		};
	}

	function place(scene, opts) {
		var text = scene.text, vp = scene.viewport, rowH = text.rowHeightPx || 14.4;
		var hookLen = Math.min(text.hookMaxPx || 0, 9);
		var spacing = text.repeatSpacingPx || 0;
		var evals = 0;

		// ---- the fixed world: symbols, Text objects, pipes, arrows, callouts ----
		var fixed = new Grid(vp), nodesById = {}, linksById = {}, custById = {};
		function addFixed(it, b) { it.b = b; fixed.add(it, b.x0, b.y0, b.x1, b.y1); }
		scene.nodes.forEach(function (n) {
			nodesById[n.id] = n;
			addFixed({ t: 'sym', node: n.id }, rectBox(n.symbol));
		});
		scene.links.forEach(function (l) {
			linksById[l.id] = l;
			(l.symbols || []).forEach(function (s) { addFixed({ t: 'lsym', link: l.id }, oBox(s)); });
			(l.arrows || []).forEach(function (s) { addFixed({ t: 'arrow', link: l.id }, oBox(s)); });
			for (var i = 1; i < l.points.length; i++) {
				var a = l.points[i - 1], b = l.points[i];
				fixed.add({ t: 'pipe', link: l.id, ax: a[0], ay: a[1], bx: b[0], by: b[1] },
					Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1]));
			}
		});
		(scene.texts || []).forEach(function (t) {
			addFixed({ t: 'text' }, oBox(t.box));
			var L = t.leader;
			for (var i = 1; L && i < L.length; i++) {
				fixed.add({ t: 'tlead', ax: L[i - 1][0], ay: L[i - 1][1], bx: L[i][0], by: L[i][1] },
					Math.min(L[i - 1][0], L[i][0]), Math.min(L[i - 1][1], L[i][1]), Math.max(L[i - 1][0], L[i][0]), Math.max(L[i - 1][1], L[i][1]));
			}
		});
		(scene.customers || []).forEach(function (c) { custById[c.id] = c; });

		var reqs = scene.labels, N = reqs.length;
		var prev = opts && opts.prev, prevReq = {}, prevPl = (prev && prev.layout && prev.layout.labels) || {};
		if (prev && prev.scene) { prev.scene.labels.forEach(function (r) { prevReq[r.id] = r; }); }

		// ---- candidates ----
		function Cand(li, lv, layout, align, x, y, w, h, angle, leader, pref) {
			this.li = li; this.lv = lv; this.layout = layout; this.align = align;
			this.x = x; this.y = y; this.w = w; this.h = h; this.angle = angle || 0; this.leader = leader;
			this.reps = null; this.boxes = null; this.fx = undefined; this.stick = false;
			var len = 0;
			if (leader) {
				for (var i = 1; i < leader.length; i++) { len += Math.hypot(leader[i][0] - leader[i - 1][0], leader[i][1] - leader[i - 1][1]); }
				pref += C_LEADER_BASE + C_LEADER_PER_ROW * len / rowH;
			}
			this.base = lv.value - pref;
		}

		// Ink of a candidate: one box per stacked row (the staircase), one for a line, and the same
		// for every repeat along a long pipe.
		function build(c) {
			if (c.boxes) { return c; }
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
			bbOf(c);
			return c;
		}
		function bbOf(c) {
			var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, i;
			for (i = 0; i < c.boxes.length; i++) {
				var b = c.boxes[i];
				if (b.x0 < x0) { x0 = b.x0; } if (b.y0 < y0) { y0 = b.y0; } if (b.x1 > x1) { x1 = b.x1; } if (b.y1 > y1) { y1 = b.y1; }
			}
			for (i = 0; c.leader && i < c.leader.length; i++) {
				var p = c.leader[i];
				if (p[0] < x0) { x0 = p[0]; } if (p[1] < y0) { y0 = p[1]; } if (p[0] > x1) { x1 = p[0]; } if (p[1] > y1) { y1 = p[1]; }
			}
			c.x0 = x0; c.y0 = y0; c.x1 = x1; c.y1 = y1;
		}

		// The fixed cost of a candidate against the fixed world: NaN if it breaks a hard rule.
		// `hand` turns hard hits into large costs instead (a hand label cannot be refused).
		function fixedCost(c, hand) {
			if (c.fx !== undefined) { return c.fx; }
			build(c);
			evals++;
			var req = reqs[c.li], ownLink = req.kind === 'link' ? req.owner : null;
			var ownNode = req.kind === 'node' ? req.owner : null;
			var cost = 0, hard = 0, links = {}, i, b, keep = [];
			for (i = 0; i < c.boxes.length; i++) {
				b = c.boxes[i];
				var bad = b.x0 < vp.x + 1 || b.y0 < vp.y + 1 || b.x1 > vp.x + vp.w - 1 || b.y1 > vp.y + vp.h - 1;
				var own = false, ncost = 0;
				if (!bad) {
					fixed.each(b.x0, b.y0, b.x1, b.y1, function (it) {
						if (it.t === 'pipe') {
							if (segHitsBox(it.ax, it.ay, it.bx, it.by, b, 1.5)) {
								if (it.link === ownLink) { own = true; } else if (!links[it.link]) { links[it.link] = 1; ncost += C_LABEL_PIPE; }
							}
						} else if (it.t === 'tlead') {
							if (segHitsBox(it.ax, it.ay, it.bx, it.by, b, 1.5)) { ncost += C_LABEL_LEADER; }
						} else if (boxesOverlap(b, it.b, TOL)) {
							if (it.t === 'arrow') { ncost += C_ARROW; } else { bad = true; if (!hand) { return false; } }
						}
					});
				}
				if (bad && b.rep && !hand) { continue; }      // a repeat that does not fit is left off
				if (bad) { if (!hand) { c.fx = NaN; return NaN; } hard++; }
				if (own && !b.rep) { cost += C_LABEL_OWN_PIPE; }
				cost += ncost;
				keep.push(b);
			}
			if (keep.length !== c.boxes.length) {
				// Rebuild the repeat list from the boxes that survived.
				var per = c.layout === 'line' ? 1 : c.lv.rows.length, reps = [];
				for (i = 0; c.reps && i < c.reps.length; i++) {
					var ok = true;
					for (var k = 0; k < per; k++) { if (keep.indexOf(c.boxes[per * (i + 1) + k]) < 0) { ok = false; } }
					if (ok) { reps.push(c.reps[i]); }
				}
				c.reps = reps.length ? reps : null;
				c.boxes = null; build(c);
			}
			var L = c.leader, lk = {};
			for (i = 1; L && i < L.length; i++) {
				var ax = L[i - 1][0], ay = L[i - 1][1], bx = L[i][0], by = L[i][1], sx = L[0][0], sy = L[0][1];
				var dead = false;
				fixed.each(Math.min(ax, bx), Math.min(ay, by), Math.max(ax, bx), Math.max(ay, by), function (it) {
					if (it.t === 'sym') {
						if (it.node !== ownNode && segHitsBox(ax, ay, bx, by, it.b, -1)) { dead = true; if (!hand) { return false; } hard++; }
					} else if (it.t === 'text') {
						if (segHitsBox(ax, ay, bx, by, it.b, -1)) { dead = true; if (!hand) { return false; } hard++; }
					} else if (it.t === 'lsym') {
						if (it.link !== ownLink && segHitsBox(ax, ay, bx, by, it.b, 0)) { cost += C_LEADER_LINKSYM; }
					} else if (it.t === 'pipe') {
						if (it.link === ownLink || lk[it.link]) { return; }
						var t = segCross(ax, ay, bx, by, it.ax, it.ay, it.bx, it.by);
						if (t >= 0 && Math.hypot(ax + t * (bx - ax) - sx, ay + t * (by - ay) - sy) > 1.5) { lk[it.link] = 1; cost += C_LEADER_PIPE; }
					} else if (it.t === 'tlead') {
						if (segCross(ax, ay, bx, by, it.ax, it.ay, it.bx, it.by) >= 0) { cost += C_LEADER_LEADER; }
					}
				});
				if (dead && !hand) { c.fx = NaN; return NaN; }
			}
			c.fx = cost + hard * HARD_HAND;
			return c.fx;
		}

		// Pairwise: NaN when the two cannot both stand (N1), else the crossing cost between them.
		function pairCost(a, b) {
			var i, j, cost = 0;
			if (a.x1 <= b.x0 || b.x1 <= a.x0 || a.y1 <= b.y0 || b.y1 <= a.y0) { return 0; }
			for (i = 0; i < a.boxes.length; i++) {
				for (j = 0; j < b.boxes.length; j++) { if (boxesOverlap(a.boxes[i], b.boxes[j], TOL)) { return NaN; } }
			}
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

		// ---- the placed labels ----
		var cur = new Array(N), dyn = new Grid(vp), isHand = new Array(N);
		function seat(li, c) {
			if (cur[li]) { dyn.remove(cur[li], cur[li].x0, cur[li].y0, cur[li].x1, cur[li].y1); }
			cur[li] = c;
			if (c) { dyn.add(c, c.x0, c.y0, c.x1, c.y1); }
		}
		// Crossing cost of c against every seated label except `li` and those in `skip`; NaN if
		// blocked. With `blockers`, collects who blocks instead of stopping at the first.
		function dynCost(c, skip, blockers) {
			var cost = 0, blocked = false;
			evals++;
			dyn.each(c.x0, c.y0, c.x1, c.y1, function (o) {
				if (o.li === c.li || (skip && skip[o.li])) { return; }
				var p = pairCost(c, o);
				if (p !== p) { blocked = true; if (blockers) { blockers.push(o.li); return; } return false; }
				cost += p;
			});
			return blocked ? NaN : cost;
		}
		function worth(c, skip) {
			var f = fixedCost(c, isHand[c.li]);
			if (f !== f) { return NaN; }
			var d = dynCost(c, skip);
			return d !== d ? NaN : c.base - f - d;
		}
		// The best candidate for label li as things stand; hidden (null, worth 0) if nothing fits
		// or nothing is worth showing. A hand-placed label is always shown.
		function bestFor(li, skip) {
			var list = cands[li], best = null, bs = isHand[li] ? -Infinity : 0;
			for (var i = 0; i < list.length; i++) {
				var c = list[i];
				if (c.base <= bs) { break; }
				if (evals > MAX_EVALS && best) { break; }
				var f = fixedCost(c, isHand[li]);
				if (f !== f || c.base - f <= bs) { continue; }
				var d = dynCost(c, skip);
				if (d !== d) { continue; }
				if (c.base - f - d > bs) { bs = c.base - f - d; best = c; }
			}
			return { c: best, w: best ? bs : 0 };
		}

		// ---- candidate generation ----
		var cands = new Array(N);
		for (var li = 0; li < N; li++) {
			var req = reqs[li], list = [], levels = levelsOf(req, scene.dropOrder);
			isHand[li] = !!req.hand;
			if (req.hand) { genHand(li, req, levels, list); } else {
				if (req.kind === 'link' && linksById[req.owner]) { genPipe(li, req, levels, list); } else { genPoint(li, req, levels, list); }
				genSticky(li, req, levels, list);
			}
			list.sort(function (a, b) { return b.base - a.base; });
			cands[li] = list;
		}

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
		// on DIRS directions at DISTS distances, the text justified to the side the leader arrives
		// from (R5); a steep leader ends in the standard short hook instead (R6).
		function genLeadered(li, o, lv, layout, d, pref, list, dirSet) {
			for (var k = 0; k < dirSet.length; k++) {
				var ux = dirSet[k][0], uy = dirSet[k][1];
				for (var j = 0; j < DISTS.length; j++) {
					var rr = o.r + DISTS[j] * rowH, px = o.x + ux * rr, py = o.y + uy * rr;
					var row = uy < -0.2 ? d.mids.length - 1 : 0;
					if (Math.abs(ux) >= 0.5) {
						var right = ux > 0;
						if (layout === 'line' && Math.abs(ux) < 0.7) { continue; }
						list.push(new Cand(li, lv, layout, right ? 'left' : 'right', right ? px : px - d.w, py - d.mids[row],
							d.w, d.h, 0, leaderFrom(o, [[px, py]]), pref));
					} else if (hookLen > 0) {
						for (var sd = -1; sd <= 1; sd += 2) {
							var ex = px + sd * hookLen;
							list.push(new Cand(li, lv, layout, sd > 0 ? 'left' : 'right', sd > 0 ? ex : ex - d.w, py - d.mids[row],
								d.w, d.h, 0, leaderFrom(o, [[px, py], [ex, py]]), pref + 0.1));
						}
					}
				}
			}
		}

		function genPoint(li, req, levels, list) {
			var o = ownerPoint(req), L = o.x - o.hw - GAP, R = o.x + o.hw + GAP, T = o.y - o.hh - GAP, B = o.y + o.hh + GAP;
			levels.forEach(function (lv) {
				var layouts = lv.rows.length > 1 ? ['stack', 'line'] : ['stack'];
				if (req.layout === 'line') { layouts.reverse(); }
				layouts.forEach(function (layout, li2) {
					var d = dims(req, lv.rows, layout, text), alt = li2 ? C_ALT_LAYOUT : 0, n = d.mids.length, k;
					function put(align, x, y, pref) { list.push(new Cand(li, lv, layout, align, x, y, d.w, d.h, 0, null, pref + alt)); }
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
					genLeadered(li, o, lv, layout, d, alt, list, DIRSET);
				});
			});
		}

		function genPipe(li, req, levels, list) {
			var link = linksById[req.owner], pts = link.points, cum = cumLengths(pts), Ltot = cum[cum.length - 1];
			var long = spacing > 0 && Ltot > spacing, fr, reps = null, k;
			if (long) {
				var n = Math.ceil(Ltot / spacing);
				fr = []; reps = [];
				for (k = 0; k < n; k++) { reps.push((k + 0.5) / n); }
				fr = reps.slice().sort(function (a, b) { return Math.abs(a - 0.5) - Math.abs(b - 0.5); });
			} else {
				fr = [0.5];
			}
			levels.forEach(function (lv) {
				var layouts = lv.rows.length > 1 ? ['line', 'stack'] : ['line'];
				if (req.layout === 'stack') { layouts.reverse(); }
				layouts.forEach(function (layout, li2) {
					var d = dims(req, lv.rows, layout, text), alt = li2 ? C_ALT_LAYOUT : 0;
					var ff = long ? fr : (Ltot > 2.2 * d.w ? [0.5, 0.33, 0.67, 0.2, 0.8] : (Ltot > 1.2 * d.w ? [0.5, 0.35, 0.65] : fr));
					ff.forEach(function (f) {
						var fpref = alt + 3 * Math.abs(f - 0.5);
						for (var side = -1; side <= 1; side += 2) {
							['along', 'level'].forEach(function (kind) {
								var c = besidePipe(li, lv, layout, d, pts, cum, f * Ltot, side, kind, fpref);
								if (!c) { return; }
								if (long) {
									var rr = [];
									reps.forEach(function (g) {
										if (g === f) { return; }
										var r = besidePipe(li, lv, layout, d, pts, cum, g * Ltot, side, kind, 0);
										if (r) { rr.push({ x: r.x, y: r.y, angle: r.angle }); }
									});
									c.reps = rr.length ? rr : null;
								}
								list.push(c);
							});
						}
					});
					// Out on a leader from the pipe's middle, when there is no room beside it.
					var P = pointAt(pts, cum, Ltot / 2), nx = -P.uy, ny = P.ux, dirs = [];
					[-1, 1].forEach(function (s) {
						[0, 35, -35, 65, -65].forEach(function (deg) {
							var r = deg * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
							dirs.push([s * (nx * c - ny * sn), s * (nx * sn + ny * c)]);
						});
					});
					genLeadered(li, { x: P.x, y: P.y, r: 0, hw: 0, hh: 0 }, lv, layout, d, alt + 0.3, list, dirs);
				});
			});
		}
		// A pipe label beside its pipe (R7): 'along' lies parallel to it, 'level' stays horizontal
		// and stands just clear of the pipe's line.
		function besidePipe(li, lv, layout, d, pts, cum, s, side, kind, pref) {
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
			return new Cand(li, lv, layout, align, cx - d.w / 2, cy - d.h / 2, d.w, d.h, 0, null,
				pref + sidePref + (Math.abs(ang) <= 45 && ang !== 0 ? 0.3 : 0));
		}

		// A hand-placed label (N4): it hangs from the user's point on the side away from its owner,
		// the leader running from the owner to that point. Only its rows and which row the point
		// meets are free.
		function genHand(li, req, levels, list) {
			var H = req.hand, start, owner;
			if (req.kind === 'link' && linksById[req.owner]) {
				start = nearestOnPolyline(linksById[req.owner].points, H.x, H.y);
				owner = { x: start[0], y: start[1], r: 0 };
			} else {
				owner = ownerPoint(req);
			}
			var dx = H.x - owner.x, dy = H.y - owner.y, far = Math.hypot(dx, dy) > owner.r + 2;
			var right = dx >= 0;
			levels.forEach(function (lv) {
				var d = dims(req, lv.rows, req.layout, text);
				for (var k = 0; k < d.mids.length; k++) {
					var leader = far ? (owner.hw !== undefined ? leaderFrom(owner, [[H.x, H.y]]) : [[owner.x, owner.y], [H.x, H.y]]) : null;
					list.push(new Cand(li, lv, req.layout, right ? 'left' : 'right', right ? H.x : H.x - d.w, H.y - d.mids[k],
						d.w, d.h, 0, leader, 0.1 * k));
				}
			});
		}

		// The last view's placement, held at the same offset from its anchor, at every drop level:
		// a label that stays put is not churn, so it wins ties.
		function genSticky(li, req, levels, list) {
			var pl = prevPl[req.id], pr = prevReq[req.id];
			if (!pl || !pl.shown || !pr) { return; }
			var ox = pl.x - pr.anchor.x, oy = pl.y - pr.anchor.y;
			var layout = pl.layout || pr.layout;
			var pd = dims(pr, pl.rows, layout, text);
			var rightEdge = ox + pd.w;
			var o = req.kind === 'link' ? null : ownerPoint(req);
			levels.forEach(function (lv) {
				var d = dims(req, lv.rows, layout, text);
				var x = pl.align === 'right' ? req.anchor.x + rightEdge - d.w
					: (pl.align === 'center' ? req.anchor.x + ox + (pd.w - d.w) / 2 : req.anchor.x + ox);
				var y = req.anchor.y + oy, leader = null;
				if (pl.leader) {
					var L = pl.leader, e = L[L.length - 1];
					var ey = req.anchor.y + (e[1] - pr.anchor.y);
					if (ey < y || ey > y + d.h) { ey = y + (ey < y ? d.mids[0] : d.mids[d.mids.length - 1]); }
					var ex = e[0] - pl.x <= pl.x + pd.w - e[0] ? x : x + d.w;
					var tail = [[ex, ey]];
					if (L.length === 3) { tail.unshift([req.anchor.x + (L[1][0] - pr.anchor.x), ey]); }
					if (o) { leader = leaderFrom(o, tail); } else {
						var s0 = [req.anchor.x + (L[0][0] - pr.anchor.x), req.anchor.y + (L[0][1] - pr.anchor.y)];
						var lk = linksById[req.owner];
						if (lk) { s0 = nearestOnPolyline(lk.points, s0[0], s0[1]); }
						leader = [s0].concat(tail);
					}
					if (L.length === 3 && Math.abs(tail[0][0] - ex) > (text.hookMaxPx || 0)) { return; }
				}
				var c = new Cand(li, lv, layout, pl.align || 'left', x, y, d.w, d.h, pl.angle || 0, leader, 0);
				c.base += B_STICK; c.stick = true;
				if (pl.repeats && pl.repeats.length) {
					c.reps = pl.repeats.map(function (r) {
						return { x: x + (r.x - pl.x), y: y + (r.y - pl.y), angle: r.angle === undefined ? pl.angle : r.angle };
					});
				}
				list.push(c);
			});
		}

		// ---- 1. hand-placed labels: fixed, seated first ----
		var order = [], i;
		for (i = 0; i < N; i++) { if (isHand[i]) { seat(i, bestFor(i).c); } else { order.push(i); } }

		// ---- 2. greedy, hardest first: fewest free places for the whole label ----
		var room = new Array(N);
		order.forEach(function (li) {
			var n = 0, list = cands[li];
			for (var k = 0; k < list.length; k++) {
				if (list[k].lv !== list[0].lv && !list[k].stick) { continue; }
				var f = fixedCost(list[k], false);
				if (f === f) { n++; }
			}
			room[li] = n;
		});
		order.sort(function (a, b) { return (room[a] - room[b]) || (a - b); });
		order.forEach(function (li) { seat(li, bestFor(li).c); });

		// ---- 3. repair: show more of each short-changed label, moving at most two neighbours ----
		function valueOf(li) { return cur[li] ? cur[li].lv.value : 0; }
		function contrib(set) {
			// Worth of the labels in `set` as seated, each pair counted once; unseats them.
			var tot = 0;
			for (var k = 0; k < set.length; k++) {
				var c = cur[set[k]];
				if (c) { seat(set[k], null); tot += c.base - fixedCost(c, isHand[set[k]]) - dynCost(c, null); }
			}
			return tot;
		}
		function tryUpgrade(li) {
			var list = cands[li], curV = valueOf(li), tried = 0;
			for (var k = 0; k < list.length && tried < 40; k++) {
				var c = list[k];
				if (c.lv.value <= curV) { continue; }
				var f = fixedCost(c, false);
				if (f !== f) { continue; }
				var bl = [];
				var d = dynCost(c, null, bl);
				if (d === d) {
					// Free room: take it if it is worth more.
					var old = cur[li], oldW = old ? worth(old) : 0;
					if (c.base - f - d > oldW + 1e-6) { seat(li, c); return true; }
					continue;
				}
				tried++;
				if (bl.length > 2 || bl.some(function (b) { return isHand[b]; })) { continue; }
				if (evals > MAX_EVALS) { return false; }
				var set = [li].concat(bl), saved = set.map(function (s) { return cur[s]; });
				var before = contrib(set);
				var skipNone = null, after = 0;
				seat(li, c);
				after += c.base - f - dynCost(c, skipNone);
				for (var m = 0; m < bl.length; m++) {
					var b = bestFor(bl[m]);
					seat(bl[m], b.c);
					after += b.w;
				}
				if (after > before + 1e-6) { return true; }
				for (m = 0; m < set.length; m++) { seat(set[m], null); }
				for (m = 0; m < set.length; m++) { seat(set[m], saved[m]); }
			}
			return false;
		}
		function deficit(li) { var lv = cands[li].length ? cands[li][0].lv : null; return lv ? lv.value - valueOf(li) : 0; }
		for (var pass = 0; pass < 3; pass++) {
			var todo = order.filter(function (li) { return deficit(li) > 0; });
			todo.sort(function (a, b) { return (valueOf(a) ? 1 : 0) - (valueOf(b) ? 1 : 0) || deficit(b) - deficit(a) || a - b; });
			var changed = false;
			for (i = 0; i < todo.length; i++) { if (tryUpgrade(todo[i])) { changed = true; } }
			// ---- 4. polish: every label re-seats itself if that is worth more ----
			for (i = 0; i < order.length; i++) {
				var li3 = order[i], was = cur[li3], wasW = was ? worth(was) : 0;
				var b = bestFor(li3);
				if (b.c && b.c !== was && b.w > wasW + 1e-6) { seat(li3, b.c); changed = true; }
			}
			if (!changed || evals > MAX_EVALS) { break; }
		}

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
