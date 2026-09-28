// LPN LABEL PLACER B.
// (write-up to follow)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
(function (root) {
	'use strict';

	// ---- tunables ------------------------------------------------------------------------------
	const GAP = 2;          // px between a symbol and a label that touches it
	const OV = 0.5;         // px of overlap we already call ink (the bench forgives 1.5)
	const CELL = 32;        // spatial grid cell, px
	const MARGIN = 400;     // px beyond the viewport that the real-estate map covers
	// Costs, in the order of §3.1 (worst first), and what a shown row is worth.
	const W_LDR_LDR = 0.9, W_LAB_LDR = 0.7, W_LAB_PIPE = 0.3, W_LDR_PIPE = 0.2;
	const ROW_VALUE = 0.45;     // one more property row is worth this much crossing cost
	const LABEL_CAP = 1.25;     // a label whose best spot costs more than this is dropped
	const RING_STEP = 7;        // px between leader rings
	const RING_MAX = 5;         // rings tried (S3: drop rather than travel)
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
	Grid.prototype.addBox = function (it) { this.addBB(it, it.box.x0, it.box.y0, it.box.x1, it.box.y1); };
	// A segment goes in cell by cell (the bounding box of each sub-step no longer than a cell).
	Grid.prototype.addSeg = function (it) {
		const p = it.p, q = it.q, R = this.region;
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
					if (it.dead || it.q === q) { continue; }
					it.q = q;
					if (fn(it)) { return true; }
				}
			}
		}
		return false;
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

		function idle(budgetMs, ctx) {
			if (ctx && ctx.scene) {
				const byId = {};
				ctx.scene.nodes.forEach(function (n) { byId[n.id] = n; });
				gapsOf(ctx.scene, byId);
			}
		}

		function place(scene, opts) {
			const prev = opts && opts.prev;
			const T = scene.text, VP = scene.viewport;
			const vx0 = VP.x, vy0 = VP.y, vx1 = VP.x + VP.w, vy1 = VP.y + VP.h;
			const nodeById = {}, linkById = {};
			scene.nodes.forEach(function (n) { nodeById[n.id] = n; });
			scene.links.forEach(function (l) { linkById[l.id] = l; });
			const gaps = gapsOf(scene, nodeById);

			const region = { x0: vx0 - MARGIN, y0: vy0 - MARGIN, x1: vx1 + MARGIN, y1: vy1 + MARGIN };
			scene.labels.forEach(function (r) {
				if (r.hand) {
					region.x0 = Math.min(region.x0, r.hand.x - MARGIN); region.x1 = Math.max(region.x1, r.hand.x + MARGIN);
					region.y0 = Math.min(region.y0, r.hand.y - MARGIN); region.y1 = Math.max(region.y1, r.hand.y + MARGIN);
				}
			});
			const G = new Grid(region);
			// Static ground: node symbols, pump and valve symbols, Text objects and their callouts, pipes.
			scene.nodes.forEach(function (n) { G.addBox({ t: 'sym', node: n.id, box: rectBox(n.symbol) }); });
			scene.links.forEach(function (l) {
				(l.symbols || []).forEach(function (b) { G.addBox({ t: 'sym', node: null, box: mkBox(b.cx, b.cy, b.w, b.h, b.angle) }); });
				for (let i = 1; i < l.points.length; i++) {
					G.addSeg({ t: 'seg', link: l.id, from: l.from, to: l.to, p: l.points[i - 1], q: l.points[i] });
				}
			});
			scene.texts.forEach(function (t) {
				G.addBox({ t: 'text', box: mkBox(t.box.cx, t.box.cy, t.box.w, t.box.h, t.box.angle) });
				const L = t.leader;
				if (L) { for (let i = 1; i < L.length; i++) { G.addSeg({ t: 'ldr', lid: 'T:' + t.id, p: L[i - 1], q: L[i] }); } }
			});

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
			// Returns Infinity for a hard break, else the soft crossing cost.
			function evaluate(req, c, ink, own, strictView) {
				let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
				for (let k = 0; k < ink.length; k++) {
					const b = ink[k];
					if (b.x0 < x0) { x0 = b.x0; } if (b.y0 < y0) { y0 = b.y0; } if (b.x1 > x1) { x1 = b.x1; } if (b.y1 > y1) { y1 = b.y1; }
				}
				if (strictView && (x0 < vx0 || y0 < vy0 || x1 > vx1 || y1 > vy1)) { return Infinity; }
				if (x0 < region.x0 || y0 < region.y0 || x1 > region.x1 || y1 > region.y1) { return Infinity; }
				let cost = 0, bad = false;
				const seenLink = {}, seenLdr = {};
				G.each(x0, y0, x1, y1, function (it) {
					const t = it.t;
					if (t === 'sym' || t === 'text' || t === 'lab') {
						if (t === 'lab' && it.lid === req.id) { return false; }
						for (let k = 0; k < ink.length; k++) { if (boxHit(ink[k], it.box)) { bad = true; return true; } }
					} else if (t === 'seg') {
						if (it.link === own.link || seenLink[it.link]) { return false; }
						for (let k = 0; k < ink.length; k++) {
							if (segBox(it.p[0], it.p[1], it.q[0], it.q[1], ink[k], 1.0)) { seenLink[it.link] = 1; cost += W_LAB_PIPE; break; }
						}
					} else if (t === 'ldr') {
						if (it.lid === req.id || seenLdr[it.lid]) { return false; }
						for (let k = 0; k < ink.length; k++) {
							if (segBox(it.p[0], it.p[1], it.q[0], it.q[1], ink[k], 1.0)) { seenLdr[it.lid] = 1; cost += W_LAB_LDR; break; }
						}
					}
					return false;
				});
				if (bad) { return Infinity; }
				if (c.leader) {
					const lc = leaderCost(req, c.leader, own);
					if (lc === Infinity) { return Infinity; }
					cost += lc;
				}
				return cost;
			}
			function leaderCost(req, L, own) {
				let cost = 0, bad = false;
				const seenLink = {}, seenLdr = {}, seenLab = {};
				for (let s = 1; s < L.length; s++) {
					const p = L[s - 1], q = L[s];
					if (bad) { break; }
					G.each(Math.min(p[0], q[0]), Math.min(p[1], q[1]), Math.max(p[0], q[0]), Math.max(p[1], q[1]), function (it) {
						const t = it.t;
						if (t === 'sym') {
							if (own.node !== undefined && it.node === own.node) { return false; }
							if (segBox(p[0], p[1], q[0], q[1], it.box, 0.5)) { bad = true; return true; }
						} else if (t === 'seg') {
							if (it.link === own.link || seenLink[it.link]) { return false; }
							if (own.node !== undefined && (it.from === own.node || it.to === own.node)) { return false; }
							if (segCross(p, q, it.p, it.q)) { seenLink[it.link] = 1; cost += W_LDR_PIPE; }
						} else if (t === 'ldr') {
							if (it.lid === req.id || seenLdr[it.lid]) { return false; }
							if (segCross(p, q, it.p, it.q)) { seenLdr[it.lid] = 1; cost += W_LDR_LDR; }
						} else if (t === 'lab') {
							if (it.lid === req.id || seenLab[it.lid]) { return false; }
							if (segBox(p[0], p[1], q[0], q[1], it.box, 1.0)) { seenLab[it.lid] = 1; cost += W_LAB_LDR; }
						}
						return false;
					});
				}
				return bad ? Infinity : cost;
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
					for (let d = 0; d < 16; d++) {
						const ang = d * Math.PI / 8, ux = Math.cos(ang), uy = Math.sin(ang);
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
						const p = nearestOnBox(b, f[0], f[1]), d = Math.hypot(p[0] - f[0], p[1] - f[1]);
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
				ink.forEach(function (b) { const it = { t: 'lab', lid: req.id, box: b }; G.addBox(it); items.push(it); });
				if (c.leader) {
					for (let s = 1; s < c.leader.length; s++) {
						const it = { t: 'ldr', lid: req.id, p: c.leader[s - 1], q: c.leader[s] };
						G.addSeg(it); items.push(it);
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
						const r = realize(req, c0);
						const cost = evaluate(req, r.c, r.ink, own, true);
						if (cost === Infinity || (capped && cost + r.c.pref > LABEL_CAP)) { continue; }
						const s = score(r.c, cost);
						if (s < bestS) { bestS = s; bestC = r.c; bestInk = r.ink; bestCost = cost; }
						if (cost === 0) { break; } // sorted by pref: nothing later in this set beats it
					}
				}
				return bestC ? { c: bestC, ink: bestInk, cost: bestCost, s: bestS } : null;
			}

			// ---- 1. hand-placed labels: hung where the user put them (N4) --------------------
			const reqs = scene.labels;
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
					const cost = evaluate(req, c, ink, ownOf(req), false);
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

			// ---- 3. everyone else: first a place for each label at its smallest ------------------
			const order = reqs.filter(function (r) { return !placed[r.id]; });
			// Hardest first: the owner with the most symbols and pipes around it.
			const crowd = {};
			order.forEach(function (r) {
				let n = 0;
				const a = r.anchor;
				G.each(a.x - 30, a.y - 30, a.x + 30, a.y + 30, function (it) { if (it.t !== 'text') { n++; } return false; });
				crowd[r.id] = n + (r.kind === 'link' ? 0.5 : 0);
			});
			order.sort(function (a, b) { return crowd[b.id] - crowd[a.id] || (a.id < b.id ? -1 : 1); });
			order.forEach(function (req) {
				const sets = setsOf[req.id];
				const b = best(req, [sets[sets.length - 1]], true);
				if (b) { insert(req, b.c, b.ink, b.cost); }
			});

			// ---- 4. then grow: each shown label looks again with its whole row set -----------------
			order.forEach(function (req) {
				const cur = placed[req.id];
				if (!cur) { return; }
				const sets = setsOf[req.id];
				if (sets.length < 2) { return; }
				remove(req.id);
				const b = best(req, sets, true);
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
			const labels = {};
			reqs.forEach(function (req) {
				const p = placed[req.id];
				if (!p) { labels[req.id] = { shown: false }; return; }
				const c = p.c;
				const o = { shown: true, rows: c.rows.slice(), layout: c.layout, align: c.align, x: c.x, y: c.y, leader: c.leader || null };
				if (c.angle) { o.angle = c.angle; }
				labels[req.id] = o;
			});
			return { labels: labels };
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
