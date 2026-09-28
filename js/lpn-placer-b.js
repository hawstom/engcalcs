// LPN LABEL PLACER B.
// (write-up to follow)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
(function (root) {
	'use strict';

	// ---- tunables ------------------------------------------------------------------------------
	const GAP = 2;          // px between a symbol and a label that touches it
	const OV = 1.25;        // px of overlap we already call ink (the bench forgives 1.5, as leading)
	const CELL = 32;        // spatial grid cell, px
	const MARGIN = 400;     // px beyond the viewport that the real-estate map covers
	const EDGE = 80;        // px: a label this near the viewport's edge is always looked at afresh
	// Costs, in the order of §3.1 (worst first), and what a shown row is worth.
	const W_LDR_LDR = 3, W_LAB_LDR = 2.5, W_LAB_PIPE = 0.3, W_LDR_PIPE = 0.2;
	const ROW_VALUE = 0.25;     // one more property row is worth this much crossing cost
	const LABEL_CAP = 1.0;      // a label whose best spot costs more than this is dropped
	const KEEP_CAP = 1.0;       // a label held from the last view is let go above this cost
	const RING_STEP = 7;        // px between leader rings
	const RING_MAX = 4;         // rings tried (S3: drop rather than travel)
	const RING_DIRS = 12;       // directions tried on each ring
	const RING_COST = 0.12;     // base cost of hanging on a leader
	const RING_PER_PX = 0.006;  // cost per px of travel

	// ---- small geometry ------------------------------------------------------------------------
	function mkBox(cx, cy, w, h, angDeg) {
		const a = (angDeg || 0) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
		const ex = Math.abs(c) * w / 2 + Math.abs(s) * h / 2, ey = Math.abs(s) * w / 2 + Math.abs(c) * h / 2;
		return { cx: cx, cy: cy, w: w, h: h, c: c, s: s, ax: !angDeg || Math.abs(s) < 1e-9 && Math.abs(Math.abs(c) - 1) < 1e-9,
			x0: cx - ex, y0: cy - ey, x1: cx + ex, y1: cy + ey };
	}
	function rectBox(r) { return mkBox(r.x + r.w / 2, r.y + r.h / 2, r.w, r.h, 0); }
	// Overlap by more than OV on every separating axis.
	function boxHit(a, b) {
		if (a.x1 - b.x0 <= OV || b.x1 - a.x0 <= OV || a.y1 - b.y0 <= OV || b.y1 - a.y0 <= OV) { return false; }
		if (a.ax && b.ax) { return true; }
		return satAxis(a, b, a.c, a.s) && satAxis(a, b, -a.s, a.c) && satAxis(a, b, b.c, b.s) && satAxis(a, b, -b.s, b.c);
	}
	function proj(b, ux, uy) {
		const c = b.cx * ux + b.cy * uy;
		const r = Math.abs((b.c * ux + b.s * uy) * b.w / 2) + Math.abs((-b.s * ux + b.c * uy) * b.h / 2);
		return [c - r, c + r];
	}
	function satAxis(a, b, ux, uy) {
		const A = proj(a, ux, uy), B = proj(b, ux, uy);
		return Math.min(A[1], B[1]) - Math.max(A[0], B[0]) > OV;
	}
	// Does segment p-q pass through box b shrunk by `sh`? (Liang-Barsky in the box frame.)
	function segBox(px, py, qx, qy, b, sh) {
		const hw = b.w / 2 - sh, hh = b.h / 2 - sh;
		if (hw <= 0 || hh <= 0) { return false; }
		let ax = px - b.cx, ay = py - b.cy, bx = qx - b.cx, by = qy - b.cy;
		if (!b.ax) {
			const x1 = ax * b.c + ay * b.s, y1 = -ax * b.s + ay * b.c, x2 = bx * b.c + by * b.s, y2 = -bx * b.s + by * b.c;
			ax = x1; ay = y1; bx = x2; by = y2;
		}
		const dx = bx - ax, dy = by - ay;
		let t0 = 0, t1 = 1;
		const P = [-dx, dx, -dy, dy], Q = [ax + hw, hw - ax, ay + hh, hh - ay];
		for (let i = 0; i < 4; i++) {
			if (P[i] === 0) { if (Q[i] < 0) { return false; } } else {
				const t = Q[i] / P[i];
				if (P[i] < 0) { if (t > t1) { return false; } if (t > t0) { t0 = t; } } else { if (t < t0) { return false; } if (t < t1) { t1 = t; } }
			}
		}
		return t0 < t1;
	}
	function orient(ax, ay, bx, by, cx, cy) { return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax); }
	// Proper crossing, ignoring shared end points (within 2 px).
	function segCross(a, b, c, d) {
		if (near(a, c) || near(a, d) || near(b, c) || near(b, d)) { return false; }
		const d1 = orient(c[0], c[1], d[0], d[1], a[0], a[1]), d2 = orient(c[0], c[1], d[0], d[1], b[0], b[1]);
		const d3 = orient(a[0], a[1], b[0], b[1], c[0], c[1]), d4 = orient(a[0], a[1], b[0], b[1], d[0], d[1]);
		return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0)) && d1 !== 0 && d2 !== 0 && d3 !== 0 && d4 !== 0;
	}
	function near(a, b) { return Math.abs(a[0] - b[0]) <= 2 && Math.abs(a[1] - b[1]) <= 2; }
	// Nearest point of an axis-aligned box to p.
	function nearestOnBox(b, px, py) {
		return [Math.max(b.x0, Math.min(b.x1, px)), Math.max(b.y0, Math.min(b.y1, py))];
	}

	// ---- the real-estate map: a hashed grid of everything on the ground -------------------------
	function Grid(region) {
		this.cells = new Map();
		this.region = region;
		this.q = 0;
	}
	Grid.prototype.key = function (ix, iy) { return (ix + 50000) * 100000 + (iy + 50000); };
	Grid.prototype.addBB = function (it, x0, y0, x1, y1) {
		const R = this.region;
		x0 = Math.max(x0, R.x0); y0 = Math.max(y0, R.y0); x1 = Math.min(x1, R.x1); y1 = Math.min(y1, R.y1);
		if (x0 > x1 || y0 > y1) { return; }
		const i0 = Math.floor(x0 / CELL), i1 = Math.floor(x1 / CELL), j0 = Math.floor(y0 / CELL), j1 = Math.floor(y1 / CELL);
		for (let i = i0; i <= i1; i++) {
			for (let j = j0; j <= j1; j++) {
				const k = this.key(i, j);
				let a = this.cells.get(k);
				if (!a) { a = []; this.cells.set(k, a); }
				if (a[a.length - 1] !== it) { a.push(it); }
			}
		}
	};
	Grid.prototype.addBox = function (it) {
		it.x0 = it.box.x0; it.y0 = it.box.y0; it.x1 = it.box.x1; it.y1 = it.box.y1;
		this.addBB(it, it.box.x0, it.box.y0, it.box.x1, it.box.y1); };
	// A segment goes in cell by cell (the bounding box of each sub-step no longer than a cell).
	Grid.prototype.addSeg = function (it) {
		const p = it.p, q = it.q, R = this.region;
		it.x0 = Math.min(p[0], q[0]); it.y0 = Math.min(p[1], q[1]); it.x1 = Math.max(p[0], q[0]); it.y1 = Math.max(p[1], q[1]);
		// Clip to the region first; a pipe on an 8x zoom can run for thousands of px.
		const c = clip(p[0], p[1], q[0], q[1], R);
		if (!c) { return; }
		const L = Math.hypot(c[2] - c[0], c[3] - c[1]), n = Math.max(1, Math.ceil(L / CELL));
		let ax = c[0], ay = c[1];
		for (let k = 1; k <= n; k++) {
			const bx = c[0] + (c[2] - c[0]) * k / n, by = c[1] + (c[3] - c[1]) * k / n;
			this.addBB(it, Math.min(ax, bx), Math.min(ay, by), Math.max(ax, bx), Math.max(ay, by));
			ax = bx; ay = by;
		}
	};
	// Calls fn(item) once for every live item whose cells meet the box; fn returning true stops.
	Grid.prototype.each = function (x0, y0, x1, y1, fn) {
		const q = ++this.q;
		const i0 = Math.floor(x0 / CELL), i1 = Math.floor(x1 / CELL), j0 = Math.floor(y0 / CELL), j1 = Math.floor(y1 / CELL);
		for (let i = i0; i <= i1; i++) {
			for (let j = j0; j <= j1; j++) {
				const a = this.cells.get(this.key(i, j));
				if (!a) { continue; }
				for (let m = 0; m < a.length; m++) {
					const it = a[m];
					if (it.dead || it.qs === q) { continue; }
					it.qs = q;
					if (fn(it)) { return true; }
				}
			}
		}
		return false;
	};
	Grid.prototype.gather = function (x0, y0, x1, y1, buf) {
		const q = ++this.q;
		let n = 0;
		const i0 = Math.floor(x0 / CELL), i1 = Math.floor(x1 / CELL), j0 = Math.floor(y0 / CELL), j1 = Math.floor(y1 / CELL);
		for (let i = i0; i <= i1; i++) {
			for (let j = j0; j <= j1; j++) {
				const a = this.cells.get(this.key(i, j));
				if (!a) { continue; }
				for (let m = 0; m < a.length; m++) {
					const it = a[m];
					if (it.dead || it.qs === q) { continue; }
					it.qs = q;
					if (it.x1 !== undefined && (it.x1 < x0 || it.x0 > x1 || it.y1 < y0 || it.y0 > y1)) { continue; }
					buf[n++] = it;
				}
			}
		}
		return n;
	};
	function clip(x0, y0, x1, y1, R) {
		let t0 = 0, t1 = 1;
		const dx = x1 - x0, dy = y1 - y0;
		const P = [-dx, dx, -dy, dy], Q = [x0 - R.x0, R.x1 - x0, y0 - R.y0, R.y1 - y0];
		for (let i = 0; i < 4; i++) {
			if (P[i] === 0) { if (Q[i] < 0) { return null; } } else {
				const t = Q[i] / P[i];
				if (P[i] < 0) { if (t > t1) { return null; } if (t > t0) { t0 = t; } } else { if (t < t0) { return null; } if (t < t1) { t1 = t; } }
			}
		}
		return [x0 + t0 * dx, y0 + t0 * dy, x0 + t1 * dx, y0 + t1 * dy];
	}

	function labelSig(req) {
		let s = req.kind + req.layout;
		for (let i = 0; i < req.rows.length; i++) { const r = req.rows[i]; s += '|' + r.field + '=' + r.text + '@' + r.w + 'x' + r.h; }
		return s;
	}

	// ---- the placer -----------------------------------------------------------------------------
	function create() {
		// Zoom-invariant knowledge, keyed on the network's shape (T2, T3): per node, the directions
		// of its pipes and the open gaps between them, widest first.
		let cacheSig = null, gapCache = {};

		function netSig(scene) {
			let h = scene.nodes.length * 131 + scene.links.length;
			for (let i = 0; i < scene.links.length; i++) {
				const l = scene.links[i];
				h = (h * 31 + l.points.length + l.id.length + l.from.length * 7 + l.to.length * 13) | 0;
			}
			return h + ':' + scene.nodes.length + ':' + scene.links.length;
		}
		function gapsOf(scene, nodeById) {
			const sig = netSig(scene);
			if (sig !== cacheSig) { cacheSig = sig; gapCache = {}; }
			if (gapCache.__done) { return gapCache; }
			const dirs = {};
			scene.links.forEach(function (l) {
				const P = l.points;
				if (P.length < 2) { return; }
				const f = nodeById[l.from], t = nodeById[l.to];
				if (f) { (dirs[f.id] = dirs[f.id] || []).push(Math.atan2(P[1][1] - P[0][1], P[1][0] - P[0][0])); }
				if (t) { const n = P.length; (dirs[t.id] = dirs[t.id] || []).push(Math.atan2(P[n - 2][1] - P[n - 1][1], P[n - 2][0] - P[n - 1][0])); }
			});
			scene.nodes.forEach(function (n) {
				const a = (dirs[n.id] || []).slice().sort(function (x, y) { return x - y; });
				const gaps = [];
				if (!a.length) { gaps.push({ mid: -Math.PI / 4, width: 2 * Math.PI }); } else {
					for (let i = 0; i < a.length; i++) {
						const s = a[i], e = i + 1 < a.length ? a[i + 1] : a[0] + 2 * Math.PI;
						gaps.push({ mid: (s + e) / 2, width: e - s });
					}
				}
				gaps.sort(function (x, y) { return y.width - x.width; });
				gapCache[n.id] = { pipes: a, gaps: gaps };
			});
			gapCache.__done = true;
			return gapCache;
		}

		// ONE LAYOUT. `table` (optional) is a per-zoom lookup table of spots found in idle time;
		// each is tried first and kept if it is still good here.
		function solve(scene, prev, table) {
			const nodeById = {}, linkById = {};
			scene.nodes.forEach(function (n) { nodeById[n.id] = n; });
			scene.links.forEach(function (l) { linkById[l.id] = l; });
			const gaps = gapsOf(scene, nodeById);

			const V0 = scene.viewport;
			const region = { x0: V0.x - MARGIN, y0: V0.y - MARGIN, x1: V0.x + V0.w + MARGIN, y1: V0.y + V0.h + MARGIN };
			scene.labels.forEach(function (r) {
				if (r.hand) {
					region.x0 = Math.min(region.x0, r.hand.x - MARGIN); region.x1 = Math.max(region.x1, r.hand.x + MARGIN);
					region.y0 = Math.min(region.y0, r.hand.y - MARGIN); region.y1 = Math.max(region.y1, r.hand.y + MARGIN);
				}
			});
			const GH = new Grid(region), GS = new Grid(region);   // hard ground, soft ground
			// Static ground: node symbols, pump and valve symbols, Text objects and their callouts, pipes.
			scene.nodes.forEach(function (n) { GH.addBox({ t: 'sym', node: n.id, lid: null, box: rectBox(n.symbol) }); });
			scene.links.forEach(function (l) {
				(l.symbols || []).forEach(function (b) { GH.addBox({ t: 'sym', node: null, lid: null, box: mkBox(b.cx, b.cy, b.w, b.h, b.angle) }); });
				for (let i = 1; i < l.points.length; i++) {
					GS.addSeg({ t: 'seg', key: 'L' + l.id, link: l.id, from: l.from, to: l.to, lid: null, p: l.points[i - 1], q: l.points[i] });
				}
			});
			scene.texts.forEach(function (t) {
				GH.addBox({ t: 'text', lid: null, box: mkBox(t.box.cx, t.box.cy, t.box.w, t.box.h, t.box.angle) });
				const L = t.leader;
				if (L) { for (let i = 1; i < L.length; i++) { GS.addSeg({ t: 'ldr', key: 'T:' + t.id, lid: 'T:' + t.id, p: L[i - 1], q: L[i] }); } }
			});

			const T = scene.text, VP = scene.viewport;
			const vx0 = VP.x, vy0 = VP.y, vx1 = VP.x + VP.w, vy1 = VP.y + VP.h;
			// ---- one label's geometry --------------------------------------------------------
			function rowSets(req) {
				const order = (scene.dropOrder && scene.dropOrder[req.kind]) || [];
				const idx = req.rows.map(function (r, i) { return i; });
				const sets = [idx.slice()];
				let cur = idx.slice();
				order.forEach(function (f) {
					const nx = cur.filter(function (i) { return req.rows[i].field !== f; });
					if (nx.length && nx.length < cur.length) { cur = nx; sets.push(cur.slice()); }
				});
				// A label with no ID row keeps its single last property (S4).
				return sets;
			}
			function sizeOf(req, rows, layout) {
				if (layout === 'line') {
					let w = 0, h = 0;
					rows.forEach(function (i) { w += req.rows[i].w; h = Math.max(h, req.rows[i].h); });
					return { w: w + (rows.length - 1) * T.separatorW, h: h };
				}
				let w = 0, h = 0;
				rows.forEach(function (i) { w = Math.max(w, req.rows[i].w); h += req.rows[i].h; });
				return { w: w, h: h };
			}
			// The ink boxes of a candidate (same staircase the bench draws).
			function inkOf(req, c) {
				const out = [];
				if (c.layout === 'line') {
					out.push(mkBox(c.x + c.w / 2, c.y + c.h / 2, c.w, c.h, c.angle || 0));
					return out;
				}
				let top = c.y;
				for (let k = 0; k < c.rows.length; k++) {
					const r = req.rows[c.rows[k]];
					const left = c.align === 'right' ? c.x + c.w - r.w : (c.align === 'center' ? c.x + (c.w - r.w) / 2 : c.x);
					out.push(mkBox(left + r.w / 2, top + r.h / 2, r.w, r.h, 0));
					top += r.h;
				}
				return out;
			}

			// ---- evaluation of one candidate against the map ---------------------------------
			// Returns Infinity for a hard break (or a soft cost over `limit`), else the soft cost.
			const BUF = [];
			function evaluate(req, c, ink, own, strictView, limit) {
				if (limit === undefined) { limit = Infinity; }
				let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
				for (let k = 0; k < ink.length; k++) {
					const b = ink[k];
					if (b.x0 < x0) { x0 = b.x0; } if (b.y0 < y0) { y0 = b.y0; } if (b.x1 > x1) { x1 = b.x1; } if (b.y1 > y1) { y1 = b.y1; }
				}
				if (strictView && (x0 < vx0 || y0 < vy0 || x1 > vx1 || y1 > vy1)) { return Infinity; }
				if (x0 < region.x0 || y0 < region.y0 || x1 > region.x1 || y1 > region.y1) { return Infinity; }
				// Hard first: symbols, Text, other labels.
				let n = GH.gather(x0, y0, x1, y1, BUF);
				for (let m = 0; m < n; m++) {
					const it = BUF[m];
					if (it.lid === req.id) { continue; }
					for (let k = 0; k < ink.length; k++) { if (boxHit(ink[k], it.box)) { return Infinity; } }
				}
				let cost = 0;
				// The leader: N3 is hard, crossings cost.
				if (c.leader) {
					cost = leaderCost(req, c.leader, own, limit);
					if (cost > limit) { return Infinity; }
				}
				n = GS.gather(x0, y0, x1, y1, BUF);
				const seen = SEEN; seen.length = 0;
				for (let m = 0; m < n; m++) {
					const it = BUF[m];
					let w;
					if (it.t === 'seg') {
						if (it.link === own.link) { continue; }
						w = W_LAB_PIPE;
					} else {
						if (it.lid === req.id) { continue; }
						w = W_LAB_LDR;
					}
					const key = it.key;
					if (seen.indexOf(key) >= 0) { continue; }
					for (let k = 0; k < ink.length; k++) {
						if (segBox(it.p[0], it.p[1], it.q[0], it.q[1], ink[k], 1.0)) {
							seen.push(key); cost += w;
							if (cost > limit) { return Infinity; }
							break;
						}
					}
				}
				return cost;
			}
			const SEEN = [], SEEN2 = [], BUF2 = [];
			function leaderCost(req, L, own, limit) {
				let cost = 0;
				const seen = SEEN2; seen.length = 0;
				for (let s = 1; s < L.length; s++) {
					const p = L[s - 1], q = L[s];
					const x0 = Math.min(p[0], q[0]), y0 = Math.min(p[1], q[1]), x1 = Math.max(p[0], q[0]), y1 = Math.max(p[1], q[1]);
					let n = GH.gather(x0, y0, x1, y1, BUF2);
					for (let m = 0; m < n; m++) {
						const it = BUF2[m];
						if (it.t === 'sym') {
							if (own.node !== undefined && it.node === own.node) { continue; }
							if (segBox(p[0], p[1], q[0], q[1], it.box, 0.5)) { return Infinity; }
						} else if (it.t === 'lab') {
							if (it.lid === req.id || seen.indexOf(it.key) >= 0) { continue; }
							if (segBox(p[0], p[1], q[0], q[1], it.box, 1.0)) { seen.push(it.key); cost += W_LAB_LDR; }
						}
					}
					n = GS.gather(x0, y0, x1, y1, BUF2);
					for (let m = 0; m < n; m++) {
						const it = BUF2[m];
						let w;
						if (it.t === 'seg') {
							if (it.link === own.link) { continue; }
							if (own.node !== undefined && (it.from === own.node || it.to === own.node)) { continue; }
							w = W_LDR_PIPE;
						} else {
							if (it.lid === req.id) { continue; }
							w = W_LDR_LDR;
						}
						if (seen.indexOf(it.key) >= 0) { continue; }
						if (segCross(p, q, it.p, it.q)) { seen.push(it.key); cost += w; }
					}
					if (cost > limit) { return Infinity; }
				}
				return cost;
			}

			// ---- candidates ------------------------------------------------------------------
			// A node label: first the places touching the symbol, then rings of short leaders
			// toward the open gaps between its pipes.
			function nodeCandidates(req, rows, out) {
				const n = nodeById[req.owner];
				const layout = 'stack', sz = sizeOf(req, rows, layout), W = sz.w, H = sz.h;
				const nx = n ? n.x : req.anchor.x, ny = n ? n.y : req.anchor.y;
				const rw = n ? n.symbol.w / 2 : 0, rh = n ? n.symbol.h / 2 : 0;
				const h0 = req.rows[rows[0]].h;
				const g = gaps[req.owner];
				// Which side is open: score each of the eight compass sides by pipe clearance.
				function openness(ang) {
					if (!g || !g.pipes.length) { return 1; }
					let m = Math.PI;
					g.pipes.forEach(function (a) { let d = Math.abs(ang - a) % (2 * Math.PI); if (d > Math.PI) { d = 2 * Math.PI - d; } if (d < m) { m = d; } });
					return m / Math.PI;
				}
				function add(x, align, y, pref, ang) {
					out.push({ rows: rows, layout: layout, align: align, x: x, y: y, w: W, h: H, angle: 0, leader: null,
						pref: pref + 0.1 * (1 - openness(ang)) });
				}
				const E = nx + rw + GAP, Wr = nx - rw - GAP - W;
				const topMid = ny - h0 / 2;
				const above = ny - rh - GAP - H, below = ny + rh + GAP;
				add(E, 'left', topMid, 0.00, 0);
				add(Wr, 'right', topMid, 0.02, Math.PI);
				add(nx + rw, 'left', above, 0.04, -Math.PI / 4);
				add(nx + rw, 'left', below, 0.05, Math.PI / 4);
				add(nx - rw - W, 'right', above, 0.06, -3 * Math.PI / 4);
				add(nx - rw - W, 'right', below, 0.07, 3 * Math.PI / 4);
				add(E, 'left', ny - H / 2, 0.06, 0);
				add(Wr, 'right', ny - H / 2, 0.07, Math.PI);
				add(E, 'left', ny + h0 / 2 - H, 0.08, 0);
				add(Wr, 'right', ny + h0 / 2 - H, 0.09, Math.PI);
				add(nx - W / 2, 'left', above, 0.08, -Math.PI / 2);
				add(nx - W / 2, 'left', below, 0.09, Math.PI / 2);
				// Leader rings, 16 directions, the open ones first.
				const hx = W / 2 + rw + GAP, hy = H / 2 + rh + GAP;
				for (let k = 1; k <= RING_MAX; k++) {
					for (let d = 0; d < RING_DIRS; d++) {
						const ang = d * 2 * Math.PI / RING_DIRS, ux = Math.cos(ang), uy = Math.sin(ang);
						const t = Math.min(Math.abs(ux) > 1e-9 ? hx / Math.abs(ux) : Infinity, Math.abs(uy) > 1e-9 ? hy / Math.abs(uy) : Infinity);
						const dist = k * RING_STEP + 2;
						const cx = nx + ux * (t + dist), cy = ny + uy * (t + dist);
						const align = ux < -0.2 ? 'right' : 'left';
						const x = cx - W / 2, y = cy - H / 2;
						out.push({ rows: rows, layout: layout, align: align, x: x, y: y, w: W, h: H, angle: 0, leader: 'auto',
							from: [nx, ny], pref: RING_COST + RING_PER_PX * dist + 0.25 * (1 - openness(ang)), dist: dist });
					}
				}
			}
			// A pipe label: lying along its pipe on either side, sliding from the middle; then flat
			// on a short leader from the middle of the pipe.
			function linkCandidates(req, rows, out) {
				const l = linkById[req.owner];
				const sz = sizeOf(req, rows, 'line'), W = sz.w, H = sz.h;
				if (l && l.points.length >= 2) {
					const P = l.points;
					let total = 0;
					const segL = [];
					for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); segL.push(d); total += d; }
					const mid = total / 2;
					const step = Math.max(6, Math.min(W / 2, 20));
					for (let j = 0; j <= 8; j++) {
						const off = (j % 2 ? 1 : -1) * Math.ceil(j / 2) * step;
						const s = mid + off;
						if (s < 0 || s > total) { continue; }
						// Locate s.
						let acc = 0, i = 0;
						while (i < segL.length - 1 && acc + segL[i] < s) { acc += segL[i]; i++; }
						const L = segL[i];
						if (!L) { continue; }
						const a = P[i], b = P[i + 1], u = (s - acc) / L;
						// The label must lie within its segment, clear of the end nodes.
						if (s - acc - W / 2 < 1 || acc + L - s - W / 2 < 1) { continue; }
						const px = a[0] + (b[0] - a[0]) * u, py = a[1] + (b[1] - a[1]) * u;
						let ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
						if (ang > 90) { ang -= 180; } else if (ang <= -90) { ang += 180; }
						const rad = ang * Math.PI / 180, nx = -Math.sin(rad), ny = Math.cos(rad);
						[-1, 1].forEach(function (side, si) {
							const o = side * (H / 2 + GAP + 0.5);
							const cx = px + nx * o, cy = py + ny * o;
							const angR = Math.round(ang * 100) / 100;
							out.push({ rows: rows, layout: 'line', align: 'left', x: cx - W / 2, y: cy - H / 2, w: W, h: H,
								angle: angR, leader: null, pref: 0.01 * Math.ceil(j / 2) + 0.005 * si });
						});
					}
				}
				// Flat, on a leader from the pipe's middle.
				const ax = req.anchor.x, ay = req.anchor.y;
				const hx = W / 2 + 2, hy = H / 2 + 2;
				for (let k = 1; k <= RING_MAX - 1; k++) {
					for (let d = 0; d < 8; d++) {
						const ang = d * Math.PI / 4 + Math.PI / 8, ux = Math.cos(ang), uy = Math.sin(ang);
						const t = Math.min(hx / Math.abs(ux), hy / Math.abs(uy));
						const dist = k * RING_STEP + 4;
						const cx = ax + ux * (t + dist), cy = ay + uy * (t + dist);
						out.push({ rows: rows, layout: 'line', align: 'left', x: cx - W / 2, y: cy - H / 2, w: W, h: H, angle: 0,
							leader: 'auto', from: [ax, ay], pref: RING_COST + 0.05 + RING_PER_PX * dist, dist: dist });
					}
				}
			}
			function candidates(req, rows) {
				const out = [];
				if (req.kind === 'link') { linkCandidates(req, rows, out); } else { nodeCandidates(req, rows, out); }
				return out;
			}
			function ownOf(req) {
				if (req.kind === 'node') { return { node: req.owner, link: null }; }
				if (req.kind === 'link') { return { node: undefined, link: req.owner }; }
				return { node: undefined, link: null };
			}
			// Materialize a leader to the nearest ink of the block.
			function realize(req, c) {
				const ink = inkOf(req, c);
				if (c.leader === 'auto') {
					const f = c.from;
					let best = null, bd = Infinity;
					ink.forEach(function (b) {
						const p = nearestOnBox(b, f[0], f[1]);
						// Never meet a row square on its side: a short level leader there reads as a
						// minus sign. Take the nearer corner of that side instead.
						if (p[1] > b.y0 && p[1] < b.y1) { p[1] = (p[1] - b.y0 < b.y1 - p[1]) ? b.y0 : b.y1; }
						const d = Math.hypot(p[0] - f[0], p[1] - f[1]);
						if (d < bd) { bd = d; best = p; }
					});
					c = Object.assign({}, c, { leader: [[f[0], f[1]], best] });
				}
				return { c: c, ink: ink };
			}

			// ---- the layout being built ------------------------------------------------------
			const placed = {};   // id -> {c, ink, items, cost}
			function insert(req, c, ink, cost) {
				const items = [];
				ink.forEach(function (b) { const it = { t: 'lab', key: req.id, lid: req.id, box: b }; GH.addBox(it); items.push(it); });
				if (c.leader) {
					for (let s = 1; s < c.leader.length; s++) {
						const it = { t: 'ldr', key: 'D:' + req.id, lid: req.id, p: c.leader[s - 1], q: c.leader[s] };
						GS.addSeg(it); items.push(it);
					}
				}
				placed[req.id] = { c: c, ink: ink, items: items, cost: cost };
			}
			function remove(id) {
				const p = placed[id];
				if (!p) { return; }
				p.items.forEach(function (it) { it.dead = true; });
				delete placed[id];
			}
			function score(c, cost) { return cost + c.pref - ROW_VALUE * c.rows.length; }
			// The best spot for one of the given row sets; null if none.
			function best(req, sets, capped) {
				const own = ownOf(req);
				let bestC = null, bestS = Infinity, bestInk = null, bestCost = 0;
				for (let si = 0; si < sets.length; si++) {
					const rows = sets[si];
					// A bigger row set cannot beat a smaller one by more than its extra rows' value.
					if (bestC && -ROW_VALUE * rows.length >= bestS) { break; }
					const cs = candidates(req, rows);
					cs.sort(function (a, b) { return a.pref - b.pref; });
					for (let k = 0; k < cs.length; k++) {
						const c0 = cs[k];
						if (c0.pref - ROW_VALUE * rows.length >= bestS) { break; }
						if (!c0.angle && (c0.x < vx0 || c0.y < vy0 || c0.x + c0.w > vx1 || c0.y + c0.h > vy1)) { continue; }
						const r = realize(req, c0);
						let lim = bestS - (r.c.pref - ROW_VALUE * rows.length);
						if (capped) { lim = Math.min(lim, LABEL_CAP - r.c.pref); }
						const cost = evaluate(req, r.c, r.ink, own, true, lim);
						if (cost === Infinity) { continue; }
						const s = score(r.c, cost);
						if (s < bestS) { bestS = s; bestC = r.c; bestInk = r.ink; bestCost = cost; }
						if (cost === 0) { break; } // sorted by pref: nothing later in this set beats it
					}
				}
				return bestC ? { c: bestC, ink: bestInk, cost: bestCost, s: bestS } : null;
			}

			// ---- 1. hand-placed labels: hung where the user put them (N4) --------------------
			const reqs = scene.labels.filter(function (r) { return r.rows && r.rows.length; });
			const setsOf = {};
			reqs.forEach(function (r) { setsOf[r.id] = rowSets(r); });
			reqs.forEach(function (req) {
				if (!req.hand) { return; }
				const own = ownOf(req), hx = req.hand.x, hy = req.hand.y;
				const n = req.kind === 'node' ? nodeById[req.owner] : null;
				let start = n ? [n.x, n.y] : [req.anchor.x, req.anchor.y];
				const layout = req.layout === 'line' ? 'line' : 'stack';
				let chosen = null;
				setsOf[req.id].some(function (rows) {
					const sz = sizeOf(req, rows, layout), W = sz.w, H = sz.h, h0 = req.rows[rows[0]].h;
					const east = hx >= start[0];
					const opts = east
						? [['left', hx, hy - h0 / 2], ['left', hx, hy], ['left', hx, hy - H], ['right', hx - W, hy - h0 / 2]]
						: [['right', hx - W, hy - h0 / 2], ['right', hx - W, hy], ['right', hx - W, hy - H], ['left', hx, hy - h0 / 2]];
					return opts.some(function (o) {
						const c = { rows: rows, layout: layout, align: o[0], x: o[1], y: layout === 'line' ? hy - H / 2 : o[2], w: W, h: H,
							angle: 0, leader: [start, [hx, hy]], pref: 0 };
						const ink = inkOf(req, c);
						const cost = evaluate(req, c, ink, own, false);
						if (!chosen) { chosen = { c: c, ink: ink, cost: 0 }; }
						if (cost !== Infinity) { chosen = { c: c, ink: ink, cost: cost }; return true; }
						return false;
					});
				});
				insert(req, chosen.c, chosen.ink, chosen.cost);
			});

			// Text is user-placed and never gives way: a Text label stands on its own anchor.
			reqs.forEach(function (req) {
				if (req.kind !== 'text' || req.hand) { return; }
				const rows = req.rows.map(function (r, i) { return i; }), layout = req.layout === 'line' ? 'line' : 'stack';
				const sz = sizeOf(req, rows, layout);
				const c = { rows: rows, layout: layout, align: 'left', x: req.anchor.x - sz.w / 2, y: req.anchor.y - sz.h / 2,
					w: sz.w, h: sz.h, angle: 0, leader: null, pref: 0 };
				const ink = inkOf(req, c);
				insert(req, c, ink, 0);
			});

			// ---- 2. labels shown in the previous view stay put while they can (T1) -----------
			const kept = {};
			if (prev && prev.layout && prev.layout.labels && prev.scene) {
				const pA = {};
				prev.scene.labels.forEach(function (r) { pA[r.id] = r; });
				reqs.forEach(function (req) {
					if (req.hand || placed[req.id]) { return; }
					const a = prev.layout.labels[req.id], ra = pA[req.id];
					if (!a || !a.shown || !ra) { return; }
					const fields = a.rows.map(function (i) { return ra.rows[i] && ra.rows[i].field; });
					const rows = [];
					req.rows.forEach(function (r, i) { if (fields.indexOf(r.field) >= 0) { rows.push(i); } });
					if (!rows.length) { return; }
					const layout = a.layout || ra.layout;
					const sz = sizeOf(req, rows, layout);
					const dx = a.x - ra.anchor.x, dy = a.y - ra.anchor.y;
					const oldW = sizeOf(ra, a.rows, layout).w;
					// Hold the edge it hangs on.
					const x = a.align === 'right' ? req.anchor.x + dx + oldW - sz.w : req.anchor.x + dx;
					const c = { rows: rows, layout: layout, align: a.align || 'left', x: x, y: req.anchor.y + dy, w: sz.w, h: sz.h,
						angle: a.angle || 0, leader: null, pref: 0 };
					if (a.leader) {
						const L0 = a.leader;
						const sx = L0[0][0] - ra.anchor.x + req.anchor.x, sy = L0[0][1] - ra.anchor.y + req.anchor.y;
						if (L0.length === 2) {
							c.leader = [[sx, sy], [L0[1][0] - ra.anchor.x + req.anchor.x, L0[1][1] - ra.anchor.y + req.anchor.y]];
						} else {
							c.leader = L0.map(function (p) { return [p[0] - ra.anchor.x + req.anchor.x, p[1] - ra.anchor.y + req.anchor.y]; });
						}
						// The start must still be on the owner (a node's centre, or on its pipe).
						const n = req.kind === 'node' ? nodeById[req.owner] : null;
						if (n) { c.leader[0] = [n.x, n.y]; }
					}
					const ink = inkOf(req, c);
					// Held still unless the new view puts it on a leader or a leader on it (§3 item 1).
					// The view's edge cutting it is not a collision (T1): it holds still.
					const cost = evaluate(req, c, ink, ownOf(req), false, KEEP_CAP);
					if (cost === Infinity) { return; }
					if (c.leader && !leaderReaches(c.leader, ink)) { return; }
					insert(req, c, ink, cost);
					kept[req.id] = { a: a, ra: ra, dx: dx, dy: dy, oldW: oldW };
				});
			}
			function leaderReaches(L, ink) {
				const e = L[L.length - 1];
				return ink.some(function (b) {
					const p = nearestOnBox(b, e[0], e[1]);
					return Math.hypot(p[0] - e[0], p[1] - e[1]) <= 1;
				});
			}

			// ---- 3. the lookup table's spots, where they still hold (T2) -----------------------
			const reqById = {};
			reqs.forEach(function (r) { reqById[r.id] = r; });
			const seeded = [];
			if (table) {
				table.order.forEach(function (id) {
					const req = reqById[id], sd = table.labels[id];
					if (!req || !sd || placed[id] || req.hand || sd.sig !== labelSig(req)) { return; }
					const rows = [];
					req.rows.forEach(function (r, i) { if (sd.fields.indexOf(r.field) >= 0) { rows.push(i); } });
					if (rows.length !== sd.fields.length) { return; }
					const sz = sizeOf(req, rows, sd.layout);
					const ax = req.anchor.x, ay = req.anchor.y;
					const c = { rows: rows, layout: sd.layout, align: sd.align, x: ax + sd.dx, y: ay + sd.dy, w: sz.w, h: sz.h,
						angle: sd.angle, leader: null, pref: 0 };
					if (sd.leader) {
						c.leader = sd.leader.map(function (q) { return [ax + q[0], ay + q[1]]; });
						const n = req.kind === 'node' ? nodeById[req.owner] : null;
						if (n) { c.leader[0] = [n.x, n.y]; }
					}
					const ink = inkOf(req, c);
					if (c.leader && !leaderReaches(c.leader, ink)) { return; }
					const cost = evaluate(req, c, ink, ownOf(req), true, LABEL_CAP);
					if (cost === Infinity) { return; }
					insert(req, c, ink, cost);
					seeded.push(id);
				});
			}

			// ---- 4. everyone else: first a place for each label at its smallest ------------------
			// A label the table had to drop at this zoom or closer in stays dropped, unless it stands
			// near the viewport's edge, where the table's crowd may be off screen now.
			const skip = {};
			if (table && table.s >= scene.view.s * 0.995) {
				reqs.forEach(function (r) {
					const a = r.anchor;
					if (table.hidden[r.id] === labelSig(r) && a.x > vx0 + EDGE && a.x < vx1 - EDGE && a.y > vy0 + EDGE && a.y < vy1 - EDGE) { skip[r.id] = 1; }
				});
			}
			const order = reqs.filter(function (r) { return !placed[r.id] && !skip[r.id]; });
			// Hardest first: the owner with the most symbols and pipes around it.
			const crowd = {};
			order.forEach(function (r) {
				let n = 0;
				const a = r.anchor;
				n += GH.gather(a.x - 30, a.y - 30, a.x + 30, a.y + 30, BUF) + GS.gather(a.x - 30, a.y - 30, a.x + 30, a.y + 30, BUF);
				crowd[r.id] = n + (r.kind === 'link' ? 0.5 : 0);
			});
			// Customer labels give way first and easily: they go last.
			order.sort(function (a, b) {
				return ((a.kind === 'customer') - (b.kind === 'customer')) || crowd[b.id] - crowd[a.id] || (a.id < b.id ? -1 : 1);
			});
			order.forEach(function (req) {
				const sets = setsOf[req.id];
				const b = best(req, [sets[sets.length - 1]], true);
				if (b) { insert(req, b.c, b.ink, b.cost); }
			});

			// ---- 5. then grow: each shown label looks again with its whole row set -----------------
			order.forEach(function (req) {
				const cur = placed[req.id];
				if (!cur) { return; }
				const sets = setsOf[req.id];
				if (sets.length < 2) { return; }
				remove(req.id);
				const b = best(req, sets.slice(0, -1), true);
				const curS = score(cur.c, cur.cost);
				if (b && b.s < curS - 1e-9) {
					insert(req, b.c, b.ink, b.cost);
				} else {
					insert(req, cur.c, cur.ink, cur.cost);
				}
			});
			// Kept labels grow only in place, on the edge they hang from.
			Object.keys(kept).forEach(function (id) {
				const req = reqs.find(function (r) { return r.id === id; });
				const cur = placed[id];
				const sets = setsOf[id];
				remove(id);
				let done = false;
				for (let si = 0; si < sets.length && !done; si++) {
					const rows = sets[si];
					if (rows.length <= cur.c.rows.length) { break; }
					const sz = sizeOf(req, rows, cur.c.layout);
					if (cur.c.angle) { continue; }
					const x = cur.c.align === 'right' ? cur.c.x + cur.c.w - sz.w : cur.c.x;
					const c = Object.assign({}, cur.c, { rows: rows, x: x, w: sz.w, h: sz.h });
					const ink = inkOf(req, c);
					if (c.leader && !leaderReaches(c.leader, ink)) { continue; }
					const cost = evaluate(req, c, ink, ownOf(req), false);
					if (cost !== Infinity && cost - ROW_VALUE * rows.length < cur.cost - ROW_VALUE * cur.c.rows.length) {
						insert(req, c, ink, cost); done = true;
					}
				}
				if (!done) { insert(req, cur.c, cur.ink, cur.cost); }
			});

			// ---- out -------------------------------------------------------------------------
			// What this layout teaches the lookup table: each label's spot as an offset from its
			// anchor, which holds at any pan of the same zoom.
			const learned = { labels: {}, order: [], hidden: {}, s: scene.view.s };
			reqs.forEach(function (r) { if (!placed[r.id] && !r.hand) { learned.hidden[r.id] = labelSig(r); } });
			const prio = reqs.filter(function (r) { return r.hand; }).map(function (r) { return r.id; })
				.concat(Object.keys(kept), seeded, order.map(function (r) { return r.id; }));
			prio.forEach(function (id) {
				const p = placed[id], req = reqById[id];
				if (!p || req.hand || learned.labels[id]) { return; }
				const c = p.c, ax = req.anchor.x, ay = req.anchor.y;
				learned.labels[id] = { sig: labelSig(req), fields: c.rows.map(function (i) { return req.rows[i].field; }),
					layout: c.layout, align: c.align, angle: c.angle || 0, dx: c.x - ax, dy: c.y - ay,
					leader: c.leader ? c.leader.map(function (q) { return [q[0] - ax, q[1] - ay]; }) : null };
				learned.order.push(id);
			});
			const labels = {};
			reqs.forEach(function (req) {
				const p = placed[req.id];
				if (!p) { labels[req.id] = { shown: false }; return; }
				const c = p.c;
				const o = { shown: true, rows: c.rows.slice(), layout: c.layout, align: c.align, x: c.x, y: c.y, leader: c.leader || null };
				if (c.angle) { o.angle = c.angle; }
				labels[req.id] = o;
			});
			return { labels: labels, learned: learned };
		}

		// ---- T2: the per-zoom lookup table, built during the breathers -------------------------
		// A layout of the WHOLE network (every label ever requested, no viewport) at a ladder of
		// zooms, quarter-octave apart. A spot is stored as an offset from its label's anchor, which
		// is the same at any pan of that zoom, so one table serves every view near its zoom.
		const registry = {};     // label id -> {req, mx, my (model anchor), hx, hy (model hand)}
		let tables = {}, tablesSig = null, baseS = null, lastScene = null, lastLayout = null;
		function remember(scene) {
			const v = scene.view;
			scene.labels.forEach(function (r) {
				registry[r.id] = { req: r, mx: (r.anchor.x - v.tx) / v.s, my: (r.anchor.y - v.ty) / v.s,
					hand: r.hand ? [(r.hand.x - v.tx) / v.s, (r.hand.y - v.ty) / v.s] : null };
			});
			const snap = netSnap(scene);
			if (!sameNet(snap, tablesSig)) { tables = {}; baseS = v.s; }
			tablesSig = snap;
			lastScene = scene;
		}
		// T3: the network in model space, the lettering, the symbology. A label's own content is
		// checked per label (labelSig), so an edited label loses only its own entry. Coordinates
		// are compared with a tolerance, since a view rounds them to its own pixels.
		function netSnap(scene) {
			const v = scene.view, xs = [];
			let topo = scene.text.sizePx + '|' + scene.text.separator + '|' + JSON.stringify(scene.dropOrder);
			scene.nodes.forEach(function (n) { xs.push((n.x - v.tx) / v.s, (n.y - v.ty) / v.s); topo += '|' + n.id + ':' + n.type; });
			scene.links.forEach(function (l) {
				l.points.forEach(function (q) { xs.push((q[0] - v.tx) / v.s, (q[1] - v.ty) / v.s); });
				topo += '|' + l.id + ':' + l.from + '>' + l.to + ':' + l.points.length + ':' + (l.symbols || []).length;
			});
			// A Text object hangs at a fixed pixel offset from its point, so its box is not in model
			// space; its spots are checked against it at every view instead.
			scene.texts.forEach(function (t) { topo += '|T' + t.id + ':' + t.text; });
			return { topo: topo, xs: xs, tol: 0.05 / v.s };
		}
		function sameNet(a, b) {
			if (!a || !b || a.topo !== b.topo || a.xs.length !== b.xs.length) { return false; }
			const tol = Math.max(a.tol, b.tol);
			for (let i = 0; i < a.xs.length; i++) { if (Math.abs(a.xs[i] - b.xs[i]) > tol) { return false; } }
			return true;
		}
		function rungOf(s) { return Math.round(4 * Math.log(s / baseS) / Math.LN2); }
		// The same network at another zoom, about the viewport centre.
		function synth(scene, f) {
			const VP = scene.viewport, cx = VP.x + VP.w / 2, cy = VP.y + VP.h / 2;
			const v = scene.view, s2 = v.s * f, tx2 = (v.tx - cx) * f + cx, ty2 = (v.ty - cy) * f + cy;
			function M(x, y) { return [cx + (x - cx) * f, cy + (y - cy) * f]; }
			function grow(sz, lo, hi) { return Math.max(Math.min(sz, lo), Math.min(Math.max(sz, hi), sz * f)); }
			let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
			const nodes = scene.nodes.map(function (n) {
				const q = M(n.x, n.y), w = grow(n.symbol.w, 3, 12), h = grow(n.symbol.h, 3, 12);
				x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]);
				return { id: n.id, type: n.type, x: q[0], y: q[1], symbol: { x: q[0] - w / 2, y: q[1] - h / 2, w: w, h: h } };
			});
			const links = scene.links.map(function (l) {
				return { id: l.id, type: l.type, from: l.from, to: l.to,
					points: l.points.map(function (q) { return M(q[0], q[1]); }),
					symbols: (l.symbols || []).map(function (b) {
						const q = M(b.cx, b.cy), w = grow(b.w, 9, 37);
						return { cx: q[0], cy: q[1], w: w, h: w * b.h / b.w, angle: b.angle };
					}), arrows: [] };
			});
			const texts = scene.texts.map(function (t) {
				const q = M(t.box.cx, t.box.cy);
				return { id: t.id, text: t.text, box: { cx: q[0], cy: q[1], w: t.box.w, h: t.box.h, angle: t.box.angle },
					leader: t.leader ? t.leader.map(function (p) { return M(p[0], p[1]); }) : undefined };
			});
			const labels = Object.keys(registry).sort().map(function (id) {
				const e = registry[id];
				return { id: id, owner: e.req.owner, kind: e.req.kind, rows: e.req.rows, layout: e.req.layout,
					anchor: { x: e.mx * s2 + tx2, y: e.my * s2 + ty2 },
					hand: e.hand ? { x: e.hand[0] * s2 + tx2, y: e.hand[1] * s2 + ty2 } : null };
			});
			const pad = 150;
			return { id: 'synth', viewport: { x: x0 - pad, y: y0 - pad, w: x1 - x0 + 2 * pad, h: y1 - y0 + 2 * pad },
				view: { s: s2, tx: tx2, ty: ty2 }, text: scene.text, dropOrder: scene.dropOrder,
				nodes: nodes, links: links, texts: texts, customers: scene.customers || [], labels: labels };
		}
		function now() { return typeof performance !== 'undefined' ? performance.now() : Date.now(); }
		function idle(budgetMs, ctx) {
			const t0 = now();
			if (ctx && ctx.scene) { remember(ctx.scene); }
			const scene = lastScene;
			if (!scene) { return; }
			const byId = {};
			scene.nodes.forEach(function (n) { byId[n.id] = n; });
			gapsOf(scene, byId);
			// Rungs nearest the current zoom first; zooming in matters more than zooming out.
			const k0 = rungOf(scene.view.s), want = [k0];
			for (let d = 1; d <= 12; d++) { want.push(k0 + d); if (d <= 6) { want.push(k0 - d); } }
			// Once a view is on screen, the rungs beside it are rebuilt around what it shows, so the
			// next zoom finds the held labels and the table in agreement (T1 and T2 together).
			const fromView = lastLayout && lastLayout.scene === scene ? lastLayout : null;
			if (fromView) { want.splice(0, 1); want.sort(function (a, b) { return (Math.abs(a - k0) - (a > k0 ? 0.5 : 0)) - (Math.abs(b - k0) - (b > k0 ? 0.5 : 0)); }); }
			let last = 0;
			for (let i = 0; i < want.length; i++) {
				const k = want[i];
				if (tables[k] && (!fromView || tables[k].from === fromView)) { continue; }
				const spent = now() - t0;
				if (spent + Math.max(last, 5) * 1.5 > budgetMs) { break; }
				const t1 = now();
				const f = baseS * Math.pow(2, k / 4) / scene.view.s;
				const out = solve(synth(scene, f), fromView, null);
				tables[k] = out.learned;
				tables[k].from = fromView;
				last = now() - t1;
			}
		}

		function place(scene, opts) {
			const prev = opts && opts.prev;
			remember(scene);
			const table = tables[rungOf(scene.view.s)] || null;
			// A table a whole rung away is still a good seed; a spot that no longer holds is re-searched.
			const out = solve(scene, prev, table);
			lastLayout = { scene: scene, layout: { labels: out.labels } };
			return { labels: out.labels };
		}

		return { name: 'b (free-space first, grow in place)', place: place, idle: idle };
	}

	const api = { name: 'b (free-space first, grow in place)', create: create };
	if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
	if (root && root.EngCalcs) {
		root.EngCalcs.lpnPlacers = root.EngCalcs.lpnPlacers || {};
		root.EngCalcs.lpnPlacers.b = api;
	}
})(typeof globalThis !== 'undefined' ? globalThis : this);
