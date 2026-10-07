// LPN LABEL PLACER B: a pure function of one view (the label bench's contract), no DOM.
//
// APPROACH. First a map of the ground: every symbol, Text object and pipe goes into a hashed grid
// (hard ground: symbols, Text, placed labels; soft ground: pipes and leaders). Then each label is
// tried at a short list of spots, nearest home first: touching its symbol on the eight sides (the
// open sides between its pipes preferred), then on short straight leaders in rings a few pixels
// apart, toward the open gaps. A pipe label lies along its pipe, either side, sliding from the
// middle; failing that it sits level on a short leader from the pipe. A spot that covers a symbol,
// a Text object or a label is never taken; crossings are costed in the rules' order (leader on
// leader, label on leader, label on pipe, leader on pipe) plus a small price per pixel of travel.
// Hand-placed labels go first, hung at the user's point (the leader may start anywhere on the pipe
// or use the one hook to miss a symbol). Customer labels go last.
//
// FREE SPACE AND DROPPING (S3, S4). Pass one gives every label a place at its smallest (the ID, or
// the last property to go), crowded owners first, so labels outrank properties. Pass two lets each
// label look again with more rows; a row is worth about one pipe crossing. A label whose best spot
// still costs more than two pipe crossings is dropped rather than sent far away (four rings, about
// two label heights, is the furthest it travels).
//
// HOLDING STILL (T1). A label shown in the last view keeps its pixel offset from its owner and its
// rows, unless a symbol, Text, label, leader or a second pipe now lies under it. It may grow in place:
// a stack from the edge it hangs on (left, or right when it hangs west, S2), a pipe label along its
// pipe from the end that holds. Note: the bench counts a turned pipe label growing from its fixed
// end as a move, since it compares unturned corners; on screen it does not move.
//
// IDLE TIME (T2, T3). The breathers build a per-zoom lookup table: the whole network (every label
// ever requested, no viewport) laid out at a ladder of zooms a quarter-octave apart, each spot kept
// as an offset from its anchor, which holds at any pan of that zoom. On opening, rungs nearest the
// current zoom first; between views, the likeliest next zooms are rebuilt around what is on screen.
// A view then only checks each cached spot and searches for the few that fail. The table is thrown
// away when the network moves or is re-topologized, or the lettering or drop order changes; a label
// whose own rows changed loses only its own entry.
//
// KNOWN WEAKNESSES. Greedy, not optimal: a label placed early can take a spot a later one needed.
// Held labels do not relocate to show more rows, so a label that settled small on a crowded view
// can stay small after zooming in. No wrapping (H1) and no hook on automatic leaders. A single rung
// can overrun a short idle budget on a very large network. Without idle time, a first view of Net3
// takes 50-150 ms.
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
	const W_LDR_LDR = 3, W_LAB_LDR = 2.5, W_LAB_PIPE = 0.3, W_LDR_PIPE = 0.2, W_OWN_PIPE = 0.12;
	const ROW_VALUE = 0.25;     // one more property row is worth this much crossing cost
	const LABEL_CAP = (typeof process !== 'undefined' && process.env && +process.env.LPN_PLACER_B_CAP) || 0.35;   // a label whose best spot costs more than this is dropped (one pipe)
	const CLEAN_CAP = (typeof process !== 'undefined' && process.env && +process.env.LPN_PLACER_B_CLEAN) || 0.13;  // 'cleanfirst': at most its own pipe
	const KEEP_CAP = 0.3;       // a label held from the last view is let go if a leader or a second pipe now crosses it
	const RING_STEP = 7;        // px between leader rings
	const RING_MAX = 4;         // rings tried (S3: drop rather than travel)
	const RING_DIRS = 12;       // directions tried on each ring
	const RING_COST = 0.12;     // base cost of hanging on a leader
	const RING_PER_PX = 0.006;  // cost per px of travel
	const REACH_ROWS = 3;       // 'reach': leaders out to this many text rows, every 15 degrees
	const DEADLINE_MS = 700;
	const LITE_DEADLINE_MS = 400;
	const TIMING = typeof process !== 'undefined' && process.env && !!process.env.LPN_PLACER_B_TIMING;    // R10: a layout returns what it has placed by then (time, never a count)

	// ---- ingredients, each switchable (STRATEGY.md beside this file) ----------------------------
	// Switch one off with create({off: ['repair']}) or, under the bench, the environment variable
	// LPN_PLACER_B_OFF=repair,evict (comma separated).
	const INGREDIENTS = ['keep', 'table', 'crowd', 'smallfirst', 'wedge', 'reach', 'along', 'relocate', 'repair', 'evict', 'polish', 'unwrap', 'raster', 'cleanfirst', 'edgehang', 'rings', 'leaderevict', 'memo'];
	// Built, measured and left off by default (STRATEGY.md, "Tried and dropped"); LPN_PLACER_B_ON
	// switches one back on.
	const DEFAULT_OFF = ['repair'];
	function ingredientSwitches(opts) {
		const on = {};
		INGREDIENTS.forEach(function (k) { on[k] = DEFAULT_OFF.indexOf(k) < 0; });
		let off = (opts && opts.off) || [];
		try {
			if (!off.length && typeof process !== 'undefined' && process.env && process.env.LPN_PLACER_B_OFF) {
				off = process.env.LPN_PLACER_B_OFF.split(',');
			}
		} catch (e) { off = []; }
		off.forEach(function (k) { on[String(k).trim()] = false; });
		let onl = (opts && opts.on) || [];
		try {
			if (!onl.length && typeof process !== 'undefined' && process.env && process.env.LPN_PLACER_B_ON) {
				onl = process.env.LPN_PLACER_B_ON.split(',');
			}
		} catch (e) { onl = []; }
		onl.forEach(function (k) { on[String(k).trim()] = true; });
		return on;
	}

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
	// Proper crossing, ignoring shared end points (within 1.4 px).
	function segCross(a, b, c, d) {
		if (near(a, c) || near(a, d) || near(b, c) || near(b, d)) { return false; }
		const d1 = orient(c[0], c[1], d[0], d[1], a[0], a[1]), d2 = orient(c[0], c[1], d[0], d[1], b[0], b[1]);
		const d3 = orient(a[0], a[1], b[0], b[1], c[0], c[1]), d4 = orient(a[0], a[1], b[0], b[1], d[0], d[1]);
		return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0)) && d1 !== 0 && d2 !== 0 && d3 !== 0 && d4 !== 0;
	}
	// Proper crossing with no forgiveness for nearby ends.
	function segCrossTight(a, b, c, d) {
		const d1 = orient(c[0], c[1], d[0], d[1], a[0], a[1]), d2 = orient(c[0], c[1], d[0], d[1], b[0], b[1]);
		const d3 = orient(a[0], a[1], b[0], b[1], c[0], c[1]), d4 = orient(a[0], a[1], b[0], b[1], d[0], d[1]);
		return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0)) && d1 !== 0 && d2 !== 0 && d3 !== 0 && d4 !== 0;
	}
	function near(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]) <= 1.4; }   // the bench forgives 1.5
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

	// A label's content as a number: its kind, shape, and every row's field, text and size.
	function labelSig(req) {
		let h = 17;
		function str(t) { for (let i = 0; i < t.length; i++) { h = (Math.imul(h, 31) + t.charCodeAt(i)) | 0; } h = (Math.imul(h, 31) + 124) | 0; }
		str(req.kind); str(req.layout || '');
		for (let i = 0; i < req.rows.length; i++) {
			const r = req.rows[i];
			str(r.field); str(r.text);
			h = (Math.imul(h, 31) + Math.round(r.w * 100)) | 0;
			h = (Math.imul(h, 31) + Math.round(r.h * 100)) | 0;
		}
		return h;
	}

	// ---- the placer -----------------------------------------------------------------------------
	function create(createOpts) {
		const ON = ingredientSwitches(createOpts);
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
		// `lite`: the idle-time table rungs (the whole network) skip eviction and polish and keep
		// to a shorter bound, so the breathers can build more rungs.
		function solve(scene, prev, table, lite) {
			const tStart = now();
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
			// 'raster' (after S9): a count per 4 px cell of the hard boxes that cover the WHOLE cell.
			// A candidate with a point 2 px inside its ink on a counted cell surely overlaps hard
			// ground by more than OV, so it is refused without a search; the exact test still decides
			// every candidate the raster passes.
			const OC = 4, onx = Math.ceil((region.x1 - region.x0) / OC), ony = Math.ceil((region.y1 - region.y0) / OC);
			const occ = ON.raster && onx * ony <= 4e6 ? new Int16Array(onx * ony) : null;
			const occS = occ ? new Uint8Array(onx * ony) : null;   // symbols and Text only (eviction)
			function occAdd(b, d, fixed) {
				if (!occ || !b.ax) { return; }
				if (fixed) { occAddTo(occS, b, 1); }
				occAddTo(occ, b, d);
			}
			function occAddTo(grid, b, d) {
				const i0 = Math.ceil((b.x0 - region.x0) / OC), i1 = Math.floor((b.x1 - region.x0) / OC) - 1;
				const j0 = Math.ceil((b.y0 - region.y0) / OC), j1 = Math.floor((b.y1 - region.y0) / OC) - 1;
				for (let j = Math.max(0, j0); j <= Math.min(ony - 1, j1); j++) {
					const row = j * onx;
					for (let i = Math.max(0, i0); i <= Math.min(onx - 1, i1); i++) { grid[row + i] += d; }
				}
			}
			// Any counted cell meeting the rectangle (x0, y0)-(x1, y1)?
			function cellsHit(G, x0, y0, x1, y1) {
				if (x1 < x0 || y1 < y0) { return false; }
				const i0 = Math.max(0, Math.floor((x0 - region.x0) / OC)), i1 = Math.min(onx - 1, Math.floor((x1 - region.x0) / OC));
				const j0 = Math.max(0, Math.floor((y0 - region.y0) / OC)), j1 = Math.min(ony - 1, Math.floor((y1 - region.y0) / OC));
				for (let j = j0; j <= j1; j++) {
					const row = j * onx;
					for (let i = i0; i <= i1; i++) { if (G[row + i] > 0) { return true; } }
				}
				return false;
			}
			function occAt(x, y, grid) {
				const i = Math.floor((x - region.x0) / OC), j = Math.floor((y - region.y0) / OC);
				return i >= 0 && j >= 0 && i < onx && j < ony && (grid || occ)[j * onx + i] > 0;
			}
			function occBlocked(b) {
				const hw = b.w / 2 - 2, hh = b.h / 2 - 2;
				if (hw < 0 || hh < 0) { return occAt(b.cx, b.cy); }
				if (occAt(b.cx, b.cy)) { return true; }
				const sx = [-hw, hw, -hw, hw, 0, 0, -hw, hw], sy = [-hh, -hh, hh, hh, -hh, hh, 0, 0];
				for (let k = 0; k < 8; k++) {
					if (occAt(b.cx + sx[k] * b.c - sy[k] * b.s, b.cy + sx[k] * b.s + sy[k] * b.c)) { return true; }
				}
				return false;
			}
			// Static ground: node symbols, pump and valve symbols, Text objects and their callouts, pipes.
			scene.nodes.forEach(function (n) { const b = rectBox(n.symbol); GH.addBox({ t: 'sym', node: n.id, lid: null, box: b }); occAdd(b, 1, true); });
			scene.links.forEach(function (l) {
				(l.symbols || []).forEach(function (b) { GH.addBox({ t: 'sym', node: null, link: l.id, key: 'S' + l.id, lid: null, box: mkBox(b.cx, b.cy, b.w, b.h, b.angle) }); });
				for (let i = 1; i < l.points.length; i++) {
					GS.addSeg({ t: 'seg', key: 'L' + l.id, link: l.id, from: l.from, to: l.to, lid: null, p: l.points[i - 1], q: l.points[i] });
				}
			});
			scene.texts.forEach(function (t) {
				const tb = mkBox(t.box.cx, t.box.cy, t.box.w, t.box.h, t.box.angle);
				GH.addBox({ t: 'text', lid: null, box: tb }); occAdd(tb, 1, true);
				const L = t.leader;
				if (L) { for (let i = 1; i < L.length; i++) { GS.addSeg({ t: 'ldr', key: 'T:' + t.id, lid: 'T:' + t.id, p: L[i - 1], q: L[i] }); } }
			});

			const T = scene.text, VP = scene.viewport;
			const vx0 = VP.x, vy0 = VP.y, vx1 = VP.x + VP.w, vy1 = VP.y + VP.h;
			// ---- one label's geometry --------------------------------------------------------
			function rowSets(req) {
				// The user's drop order, first to go first; the ID is a value like any other, and a
				// scene that does not list it lets it go first (the contract's dropOrderOf). A field
				// the order does not list goes before every listed one.
				const order = ((scene.dropOrder && scene.dropOrder[req.kind]) || []).slice();
				if (order.indexOf('id') < 0) { order.unshift('id'); }
				const rank = function (f) { return order.indexOf(f); };
				const fields = [];
				req.rows.forEach(function (r) { if (fields.indexOf(r.field) < 0) { fields.push(r.field); } });
				fields.sort(function (a, b) { return rank(a) - rank(b); });
				const idx = req.rows.map(function (r, i) { return i; });
				const sets = [idx.slice()];
				let cur = idx.slice();
				fields.forEach(function (f) {
					const nx = cur.filter(function (i) { return req.rows[i].field !== f; });
					if (nx.length && nx.length < cur.length) { cur = nx; sets.push(cur.slice()); }
				});
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
				if (occ) { for (let k = 0; k < ink.length; k++) { if (occBlocked(ink[k])) { return Infinity; } } }
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
						// R7: a pipe label sits beside its own pipe, not on it (a small price).
						w = it.link === own.link ? W_OWN_PIPE : W_LAB_PIPE;
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
							// N3 is about NODE symbols. A pump or valve symbol on the way costs what
							// its pipe would; the label's own one costs nothing.
							if (it.node === null) {
								if (it.link === own.link || seen.indexOf(it.key) >= 0) { continue; }
								if (segBox(p[0], p[1], q[0], q[1], it.box, 0.5)) { seen.push(it.key); cost += W_LDR_PIPE; }
								continue;
							}
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
					if (!ON.wedge || !g || !g.pipes.length) { return 1; }
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
				// Leader rings, the open directions first ('wedge'). With 'reach': every 15 degrees,
				// every half row, out to REACH_ROWS rows; without it, 12 directions, 4 rings of 7 px.
				// With 'edgehang', the rings search only for a label's smallest form (a place at all).
				const smallest = rows.length === setsOf[req.id][setsOf[req.id].length - 1].length;
				if (!ON.edgehang || (ON.rings && smallest)) { ringsAround(req, rows, layout, W, H, nx, ny, rw, rh, 0, out); }
				if (ON.edgehang) { edgeHang(req, rows, layout, W, H, nx, ny, Math.max(rw, rh), openness, out); }
				// 'unwrap' (H-a, S5): the same rows as one line, beside the symbol and on the rings.
				if (ON.unwrap && rows.length > 1) {
					const lz = sizeOf(req, rows, 'line');
					out.push({ rows: rows, layout: 'line', align: 'left', x: E, y: ny - lz.h / 2, w: lz.w, h: lz.h, angle: 0, leader: null,
						pref: 0.05 + 0.1 * (1 - openness(0)) });
					out.push({ rows: rows, layout: 'line', align: 'right', x: nx - rw - GAP - lz.w, y: ny - lz.h / 2, w: lz.w, h: lz.h, angle: 0,
						leader: null, pref: 0.06 + 0.1 * (1 - openness(Math.PI)) });
					if (!ON.edgehang) { ringsAround(req, rows, 'line', lz.w, lz.h, nx, ny, rw, rh, 0.05, out); }
					else { edgeHang(req, rows, 'line', lz.w, lz.h, nx, ny, Math.max(rw, rh), openness, out, 0.05); }
				}
				function ringsAround(req, rows, layout, W, H, nx, ny, rw, rh, extra, out) {
					const hx = W / 2 + rw + GAP, hy = H / 2 + rh + GAP;
					const kMax = ON.reach ? REACH_ROWS * 2 : RING_MAX, dirs = ON.reach ? 24 : RING_DIRS;
					for (let k = 1; k <= kMax; k++) {
						for (let d = 0; d < dirs; d++) {
							const ang = d * 2 * Math.PI / dirs, ux = Math.cos(ang), uy = Math.sin(ang);
							const t = Math.min(Math.abs(ux) > 1e-9 ? hx / Math.abs(ux) : Infinity, Math.abs(uy) > 1e-9 ? hy / Math.abs(uy) : Infinity);
							const dist = ON.reach ? k * T.rowHeightPx / 2 : k * RING_STEP + 2;
							const cx = nx + ux * (t + dist), cy = ny + uy * (t + dist);
							const align = ux < -0.2 ? 'right' : 'left';
							out.push({ rows: rows, layout: layout, align: align, x: cx - W / 2, y: cy - H / 2, w: W, h: H, angle: 0, leader: 'auto',
								from: [nx, ny], pref: extra + RING_COST + RING_PER_PX * dist + 0.25 * (1 - openness(ang)), dist: dist });
						}
					}
				}
			}
			// A pipe label. When the setting asks (req.along, R14): lying along its pipe on either
			// side, turned into the scene's reading window, sliding from the middle of the pipe's
			// ON-SCREEN stretch ('along'; without it, from the middle of the whole pipe). Then level
			// beside the pipe, no leader; then level on a short leader from the pipe. A label the
			// setting does not ask to turn is never turned (R13).
			const WIN = (scene.settings && scene.settings.readableAngleDeg) || { min: -110, max: 70 };
			function readable(ang) {
				ang = ((ang % 360) + 360) % 360; if (ang > 180) { ang -= 360; }
				if (!(ang > WIN.min && ang <= WIN.max)) { ang += 180; ang = ((ang % 360) + 360) % 360; if (ang > 180) { ang -= 360; } }
				return ang;
			}
			const pipeGeo = {};
			function geoOf(l) {
				if (pipeGeo[l.id]) { return pipeGeo[l.id]; }
				const P = l.points, segs = [];
				let total = 0, on0 = Infinity, on1 = -Infinity;
				for (let i = 1; i < P.length; i++) {
					const a = P[i - 1], b = P[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
					if (L > 0) {
						const c = clip(a[0], a[1], b[0], b[1], { x0: vx0, y0: vy0, x1: vx1, y1: vy1 });
						if (c) {
							const s0 = total + Math.hypot(c[0] - a[0], c[1] - a[1]), s1 = total + Math.hypot(c[2] - a[0], c[3] - a[1]);
							on0 = Math.min(on0, s0); on1 = Math.max(on1, s1);
						}
					}
					segs.push({ a: a, b: b, s0: total, L: L });
					total += L;
				}
				if (!(on0 <= on1)) { on0 = 0; on1 = total; }
				return (pipeGeo[l.id] = { segs: segs, total: total, on0: on0, on1: on1 });
			}
			function stationAt(g, s) {
				for (let i = 0; i < g.segs.length; i++) {
					const sg = g.segs[i];
					if (s <= sg.s0 + sg.L || i === g.segs.length - 1) {
						if (!sg.L) { continue; }
						const t = Math.max(0, Math.min(1, (s - sg.s0) / sg.L));
						return { x: sg.a[0] + t * (sg.b[0] - sg.a[0]), y: sg.a[1] + t * (sg.b[1] - sg.a[1]),
							dir: Math.atan2(sg.b[1] - sg.a[1], sg.b[0] - sg.a[0]) * 180 / Math.PI, seg: sg, s: s };
					}
				}
				return null;
			}
			// Does a held spot agree with the setting? Turned only if asked; asked, then turned to
			// the pipe where it sits (a level label beside a level pipe is along it).
			function alongAgrees(req, angle, cx, cy) {
				const turned = Math.abs(angle % 180) > 0.5;
				if (!req.along) { return !turned; }
				const l = linkById[req.owner];
				if (!l) { return true; }
				let bd = Infinity, dir = 0;
				for (let i = 1; i < l.points.length; i++) {
					const a = l.points[i - 1], b = l.points[i], vx = b[0] - a[0], vy = b[1] - a[1], L2 = vx * vx + vy * vy;
					if (!L2) { continue; }
					const t = Math.max(0, Math.min(1, ((cx - a[0]) * vx + (cy - a[1]) * vy) / L2));
					const d = Math.hypot(a[0] + t * vx - cx, a[1] + t * vy - cy);
					if (d < bd) { bd = d; dir = Math.atan2(vy, vx) * 180 / Math.PI; }
				}
				let diff = Math.abs(((angle - dir) % 180 + 180) % 180);
				diff = Math.min(diff, 180 - diff);
				return diff <= 4 && Math.abs(readable(angle) - angle) < 0.5;
			}
			function nearestOnLink(l, x, y) {
				let bd = Infinity, bp = [x, y];
				for (let i = 1; i < l.points.length; i++) {
					const a = l.points[i - 1], b = l.points[i], vx = b[0] - a[0], vy = b[1] - a[1], L2 = vx * vx + vy * vy;
					const t = L2 ? Math.max(0, Math.min(1, ((x - a[0]) * vx + (y - a[1]) * vy) / L2)) : 0;
					const q = [a[0] + t * vx, a[1] + t * vy], d = Math.hypot(q[0] - x, q[1] - y);
					if (d < bd) { bd = d; bp = q; }
				}
				return bp;
			}
			// 'edgehang' (the self-test's own geometry, used to build with): a straight leader from
			// the anchor every 15 degrees and every half row out to REACH_ROWS rows, the block hung
			// by the edge its leader arrives at (R5), so its near corner or edge midpoint is the end.
			function edgeHang(req, rows, layout, W, H, ax, ay, r0, openness, out, extra) {
				const row = T.rowHeightPx;
				for (let k = 1; k <= REACH_ROWS * 2; k++) {
					const len = r0 + 1 + k * row / 2;
					for (let deg = 0; deg < 360; deg += 15) {
						const rad = deg * Math.PI / 180, cs = Math.cos(rad), sn = Math.sin(rad);
						const ex = ax + len * cs, ey = ay + len * sn;
						const east = cs > 0.26, west = cs < -0.26;
						const x = east ? ex : (west ? ex - W : ex - W / 2);
						const y = sn < -0.26 ? ey - H : (sn > 0.26 ? ey : ey - H / 2);
						out.push({ rows: rows, layout: layout, align: west ? 'right' : 'left', x: x, y: y, w: W, h: H, angle: 0, leader: 'auto',
							from: [ax, ay], pref: (extra || 0) + 0.01 + RING_COST + RING_PER_PX * len + (openness ? 0.25 * (1 - openness(rad)) : 0), dist: len });
					}
				}
			}
			function linkCandidates(req, rows, out) {
				const l = linkById[req.owner];
				const sz = sizeOf(req, rows, 'line'), W = sz.w, H = sz.h;
				let ax = req.anchor.x, ay = req.anchor.y;
				if (l && l.points.length >= 2) {
					const g = geoOf(l), wide = ON.along;
					const mid = wide ? (g.on0 + g.on1) / 2 : g.total / 2;
					const lo = wide ? g.on0 : 0, hi = wide ? g.on1 : g.total;
					const step = Math.max(6, Math.min(W / 2, 20));
					const nSt = wide ? Math.min(40, 2 * Math.ceil((hi - lo) / 2 / step)) : 8;
					const stations = [];
					for (let j = 0; j <= nSt; j++) {
						const s = mid + (j % 2 ? 1 : -1) * Math.ceil(j / 2) * step;
						if (s < lo || s > hi) { continue; }
						// Without 'along', the label keeps within the pipe's length; with it, a label
						// longer than a short pipe may overhang its ends (the symbols still refuse it).
						if (!wide && (s - W / 2 < 1 || g.total - s - W / 2 < 1)) { continue; }
						const st = stationAt(g, s);
						if (st) { st.j = j; stations.push(st); }
					}
					const midSt = stationAt(g, mid);
					if (midSt) { ax = midSt.x; ay = midSt.y; }
					stations.forEach(function (st) {
						const j = st.j;
						// Without 'along', the old rule: the label lies within one segment.
						if (!wide && (st.s - st.seg.s0 - W / 2 < 1 || st.seg.s0 + st.seg.L - st.s - W / 2 < 1)) { return; }
						if (req.along) {
							const ang = readable(st.dir), rad = ang * Math.PI / 180, nx = -Math.sin(rad), ny = Math.cos(rad);
							const offs = wide ? [H / 2 + GAP + 0.5, H / 2 + T.rowHeightPx / 2] : [H / 2 + GAP + 0.5];
							offs.forEach(function (off, oi) {
								[-1, 1].forEach(function (side, si) {
									const o = side * off;
									const angR = Math.round(ang * 100) / 100;
									out.push({ rows: rows, layout: 'line', align: 'left', x: st.x + nx * o - W / 2, y: st.y + ny * o - H / 2, w: W, h: H,
										angle: angR, leader: null, pref: 0.01 * Math.ceil(j / 2) + 0.005 * si + 0.003 * oi });
								});
							});
						}
						if (j > 6) { return; }
						// Level beside the pipe, clear of the line by its own extent across it.
						const rad = st.dir * Math.PI / 180, ux = Math.cos(rad), uy = Math.sin(rad), nx = -uy, ny = ux;
						const ext = Math.abs(nx) * W / 2 + Math.abs(ny) * H / 2 + GAP + 1;
						[-1, 1].forEach(function (side, si) {
							out.push({ rows: rows, layout: 'line', align: 'left', x: st.x + side * nx * ext - W / 2, y: st.y + side * ny * ext - H / 2,
								w: W, h: H, angle: 0, leader: null, pref: (req.along ? 0.1 : 0) + 0.012 * Math.ceil(j / 2) + 0.005 * si });
						});
					});
				}
				if (ON.edgehang) { edgeHang(req, rows, 'line', W, H, ax, ay, 0, null, out); }
				// Level, on a leader from the pipe's on-screen middle.
				const hx = W / 2 + 2, hy = H / 2 + 2;
				const kMax = ON.reach ? Math.ceil(REACH_ROWS * 2) : RING_MAX - 1, dirs = ON.reach ? 16 : 8;
				for (let k = 1; k <= kMax; k++) {
					for (let d = 0; d < dirs; d++) {
						const ang = d * 2 * Math.PI / dirs + Math.PI / dirs, ux = Math.cos(ang), uy = Math.sin(ang);
						const t = Math.min(hx / Math.abs(ux), hy / Math.abs(uy));
						const dist = ON.reach ? k * T.rowHeightPx / 2 : k * RING_STEP + 4;
						const cx = ax + ux * (t + dist), cy = ay + uy * (t + dist);
						out.push({ rows: rows, layout: 'line', align: 'left', x: cx - W / 2, y: cy - H / 2, w: W, h: H, angle: 0,
							leader: 'auto', from: [ax, ay], pref: RING_COST + 0.05 + (req.along ? 0.1 : 0) + RING_PER_PX * dist, dist: dist });
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
				ink.forEach(function (b) { const it = { t: 'lab', key: req.id, lid: req.id, box: b }; GH.addBox(it); occAdd(b, 1); items.push(it); });
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
				p.items.forEach(function (it) { it.dead = true; if (it.t === 'lab') { occAdd(it.box, -1); } });
				delete placed[id];
			}
			// A label's candidates for one row set, on screen, sorted, with their ink: the ground
			// does not move within one layout, so each list is built once.
			const candCache = {};
			function sortedCandidates(req, rows) {
				const key = req.id + '|' + rows.join(',');
				let cs = candCache[key];
				if (cs) { return cs; }
				const raw = candidates(req, rows);
				raw.sort(function (a, b) { return a.pref - b.pref; });
				cs = [];
				for (let k = 0; k < raw.length; k++) {
					const c0 = raw[k];
					if (!c0.angle && (c0.x < vx0 || c0.y < vy0 || c0.x + c0.w > vx1 || c0.y + c0.h > vy1)) { continue; }
					cs.push(c0);
				}
				return (candCache[key] = cs);
			}
			// The raster's look at a candidate before its ink is built: the middle of its first and
			// last rows (a line's middle, turned or not).
			// Every 4 px across each row, 2 px inside it: any counted cell there is a sure overlap.
			function quickBlocked(req, c, grid) {
				const G = grid || occ;
				if (c.layout === 'line' && !c.angle) { return cellsHit(G, c.x + 2, c.y + 2, c.x + c.w - 2, c.y + c.h - 2); }
				if (c.layout === 'line') {
					const a = (c.angle || 0) * Math.PI / 180, cs = Math.cos(a), sn = Math.sin(a);
					const cx = c.x + c.w / 2, cy = c.y + c.h / 2, hw = c.w / 2 - 2, hh = c.h / 2 - 2;
					for (let u = -hw; u <= hw + 0.01; u += OC) {
						for (let v = -hh; v <= hh + 0.01; v += OC) {
							if (occAt(cx + u * cs - v * sn, cy + u * sn + v * cs, G)) { return true; }
						}
					}
					return false;
				}
				let top = c.y;
				for (let k = 0; k < c.rows.length; k++) {
					const r = req.rows[c.rows[k]];
					const left = c.align === 'right' ? c.x + c.w - r.w : (c.align === 'center' ? c.x + (c.w - r.w) / 2 : c.x);
					if (cellsHit(G, left + 2, top + 2, left + r.w - 2, top + r.h - 2)) { return true; }
					top += r.h;
				}
				return false;
			}
			function score(c, cost) { return cost + c.pref - ROW_VALUE * c.rows.length; }
			// The best spot for one of the given row sets; null if none.
			// 'cleanfirst': every pass seats labels where they cross nothing (CLEAN_CAP) before a last
			// sweep lets a label still hidden cross a pipe (LABEL_CAP).
			let capNow = ON.cleanfirst ? CLEAN_CAP : LABEL_CAP;
			function best(req, sets, capped) {
				const own = ownOf(req);
				let bestC = null, bestS = Infinity, bestInk = null, bestCost = 0;
				for (let si = 0; si < sets.length; si++) {
					const rows = sets[si];
					// A bigger row set cannot beat a smaller one by more than its extra rows' value.
					if (bestC && -ROW_VALUE * rows.length >= bestS) { break; }
					const cs = sortedCandidates(req, rows);
					for (let k = 0; k < cs.length; k++) {
						const c0 = cs[k];
						if (c0.pref - ROW_VALUE * rows.length >= bestS) { break; }
						if (occ && quickBlocked(req, c0)) { continue; }
						const r = c0.real || (c0.real = realize(req, c0));
						let lim = bestS - (r.c.pref - ROW_VALUE * rows.length);
						if (capped) { lim = Math.min(lim, ON.reach ? capNow : capNow - r.c.pref); }
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
				const own = ownOf(req), hx = req.hand.x, hy = req.hand.y, hk = T.hookMaxPx;
				const n = req.kind === 'node' ? nodeById[req.owner] : null;
				const l = req.kind === 'link' ? linkById[req.owner] : null;
				// Where the leader may start: the node's centre, or anywhere on the pipe (nearest the
				// user's point first).
				const starts = n ? [[n.x, n.y]] : (l ? pointsOnLink(l, hx, hy, req.anchor) : [[req.anchor.x, req.anchor.y]]);
				const layout = req.layout === 'line' ? 'line' : 'stack';
				let chosen = null, chosenBad = Infinity;
				setsOf[req.id].some(function (rows) {
					const sz = sizeOf(req, rows, layout), W = sz.w, H = sz.h, h0 = req.rows[rows[0]].h;
					const ty = layout === 'line' ? hy - H / 2 : hy - h0 / 2;
					return starts.some(function (st) {
						const east = hx >= st[0];
						// Text to the east of the user's point, or to the west; the hook, if used,
						// comes in level from the side away from the text.
						const shapes = [];
						[east, !east].forEach(function (e) {
							const atts = e ? [['left', hx, ty], ['left', hx, hy], ['left', hx, hy - H]]
								: [['right', hx - W, ty], ['right', hx - W, hy], ['right', hx - W, hy - H]];
							atts.forEach(function (a) { shapes.push({ a: a, L: [st, [hx, hy]] }); });
							atts.forEach(function (a) { shapes.push({ a: a, L: [st, [e ? hx - hk : hx + hk, hy], [hx, hy]] }); });
						});
						return shapes.some(function (sh) {
							const a = sh.a;
							const c = { rows: rows, layout: layout, align: a[0], x: a[1], y: layout === 'line' ? hy - H / 2 : a[2], w: W, h: H,
								angle: 0, leader: null, pref: 0 };
							const ink = inkOf(req, c);
							const labelCost = evaluate(req, c, ink, own, false);
							const leadCost = leaderCost(req, sh.L, own, Infinity);
							c.leader = sh.L;
							const bad = (labelCost === Infinity ? 2 : 0) + (leadCost === Infinity ? 1 : 0);
							if (bad < chosenBad) {
								chosenBad = bad;
								chosen = { c: c, ink: ink, cost: bad ? 0 : labelCost + leadCost };
							}
							return bad === 0;
						});
					});
				});
				insert(req, chosen.c, chosen.ink, chosen.cost);
			});
			function pointsOnLink(l, hx, hy, anchor) {
				const P = l.points, out = [];
				let bd = Infinity, bp = null;
				for (let i = 1; i < P.length; i++) {
					const a = P[i - 1], b = P[i], vx = b[0] - a[0], vy = b[1] - a[1], L2 = vx * vx + vy * vy;
					const t = L2 ? Math.max(0, Math.min(1, ((hx - a[0]) * vx + (hy - a[1]) * vy) / L2)) : 0;
					const q = [a[0] + t * vx, a[1] + t * vy], d = Math.hypot(q[0] - hx, q[1] - hy);
					if (d < bd) { bd = d; bp = q; }
				}
				if (bp) { out.push(bp); }
				out.push([anchor.x, anchor.y]);
				for (let i = 1; i < P.length; i++) {
					for (let k = 1; k < 4; k++) {
						const a = P[i - 1], b = P[i];
						out.push([a[0] + (b[0] - a[0]) * k / 4, a[1] + (b[1] - a[1]) * k / 4]);
					}
				}
				// Not from inside another element's symbol.
				const clear = out.filter(function (q) {
					const m = GH.gather(q[0] - 1, q[1] - 1, q[0] + 1, q[1] + 1, BUF);
					for (let k = 0; k < m; k++) { if (BUF[k].t === 'sym') { return false; } }
					return true;
				});
				return clear.length ? clear : out;
			}

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
			if (ON.keep && prev && prev.layout && prev.layout.labels && prev.scene) {
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
					// R13/R14: a turned label the setting no longer asks for, or a level one it now
					// asks to turn, is looked at afresh.
					if (req.kind === 'link' && !alongAgrees(req, a.angle || 0, a.x - ra.anchor.x + req.anchor.x + sizeOf(ra, a.rows, layout).w / 2, a.y - ra.anchor.y + req.anchor.y + 7)) { return; }
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
						else if (req.kind === 'link' && linkById[req.owner]) { c.leader[0] = nearestOnLink(linkById[req.owner], c.leader[0][0], c.leader[0][1]); }
					}
					const ink = inkOf(req, c);
					// Held still unless the new view puts it on a leader or a leader on it (§3 item 1).
					// The view's edge cutting it is not a collision (T1): it holds still.
					const cost = evaluate(req, c, ink, ownOf(req), false, ON.cleanfirst ? Math.min(KEEP_CAP, CLEAN_CAP) : KEEP_CAP);
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
					if (req.kind === 'link' && !alongAgrees(req, sd.angle || 0, req.anchor.x + sd.dx + sizeOf(req, rows, sd.layout).w / 2, req.anchor.y + sd.dy + 7)) { return; }
					const sz = sizeOf(req, rows, sd.layout);
					const ax = req.anchor.x, ay = req.anchor.y;
					const c = { rows: rows, layout: sd.layout, align: sd.align, x: ax + sd.dx, y: ay + sd.dy, w: sz.w, h: sz.h,
						angle: sd.angle, leader: null, pref: 0 };
					if (sd.leader) {
						c.leader = sd.leader.map(function (q) { return [ax + q[0], ay + q[1]]; });
						const n = req.kind === 'node' ? nodeById[req.owner] : null;
						if (n) { c.leader[0] = [n.x, n.y]; }
						else if (req.kind === 'link' && linkById[req.owner]) { c.leader[0] = nearestOnLink(linkById[req.owner], c.leader[0][0], c.leader[0][1]); }
					}
					const ink = inkOf(req, c);
					if (c.leader && !leaderReaches(c.leader, ink)) { return; }
					const cost = evaluate(req, c, ink, ownOf(req), true, LABEL_CAP);
					if (cost === Infinity) { return; }
					insert(req, c, ink, cost);
					seeded.push(id);
				});
			}

			TIMING && console.log('p0', (now() - tStart).toFixed(1));
			// ---- 4. everyone else: first a place for each label at its smallest ------------------
			// 'table': a label the table had to drop at this zoom stays out of the first pass, unless
			// it stands near the viewport's edge, where the table's crowd may be off screen now. It
			// is not hidden for that: the repair pass looks for room for it like any other.
			const skip = {};
			if (table) {
				const closer = table.s < scene.view.s * 0.995;
				const was = prev && prev.layout && prev.layout.labels;
				const asked = {};
				if (was) { prev.scene.labels.forEach(function (r) { asked[r.id] = 1; }); }
				reqs.forEach(function (r) {
					const a = r.anchor;
					if (table.hidden[r.id] !== labelSig(r)) { return; }
					if (closer && !(was && asked[r.id] && !(was[r.id] && was[r.id].shown))) { return; }
					if (a.x > vx0 + EDGE && a.x < vx1 - EDGE && a.y > vy0 + EDGE && a.y < vy1 - EDGE) { skip[r.id] = 1; }
				});
			}
			const order = reqs.filter(function (r) { return !placed[r.id] && !skip[r.id] && !r.hand && r.kind !== 'text'; });
			// 'crowd' (S12): hardest first, the owner with the most symbols and pipes around it.
			const crowd = {};
			order.forEach(function (r) {
				let n = 0;
				const a = r.anchor;
				if (ON.crowd) { n += GH.gather(a.x - 30, a.y - 30, a.x + 30, a.y + 30, BUF) + GS.gather(a.x - 30, a.y - 30, a.x + 30, a.y + 30, BUF); }
				crowd[r.id] = n + (r.kind === 'link' ? 0.5 : 0);
			});
			// Customer labels give way first and easily: they go last.
			order.sort(function (a, b) {
				return ((a.kind === 'customer') - (b.kind === 'customer')) || crowd[b.id] - crowd[a.id] || (a.id < b.id ? -1 : 1);
			});
			// 'smallfirst' (S11): every label gets its smallest form before any label grows; without
			// it, each label takes as many rows as it can in turn.
			order.forEach(function (req) {
				const sets = setsOf[req.id];
				const b = best(req, ON.smallfirst ? [sets[sets.length - 1]] : sets, true);
				if (b) { insert(req, b.c, b.ink, b.cost); }
			});
			function late() { return now() - tStart > (lite ? LITE_DEADLINE_MS : DEADLINE_MS); }

			TIMING && console.log('p1', (now() - tStart).toFixed(1));
			// ---- 5. then grow: each shown label looks again with every row set -------------------
			// The current spot stays unless another is better; the label may move to show more, or
			// to lie along its pipe with the same rows (R14).
			const freed = [];   // the ink of spots given up by a move: ground a hidden label may now have
			const failedAt = {}, failedFrom = {}, PC = {};
			function nearFreed(req, from) {
				const a = req.anchor, R = 4 * T.rowHeightPx + 80;
				for (let i = from || 0; i < freed.length; i++) {
					const ink = freed[i];
					for (let k = 0; k < ink.length; k++) {
						const b = ink[k];
						if (a.x > b.x0 - R && a.x < b.x1 + R && a.y > b.y0 - R && a.y < b.y1 + R) { return true; }
					}
				}
				return false;
			}
			function regrow(req) {
				const cur = placed[req.id];
				if (!cur || req.hand || req.kind === 'text' || kept[req.id]) { return false; }
				const sets = setsOf[req.id];
				// Whole, uncrossed and (a pipe label) along its pipe if asked: nothing to gain.
				if (cur.c.rows.length === sets[0].length && cur.cost === 0
					&& (req.kind !== 'link' || !req.along || Math.abs((cur.c.angle || 0) % 180) > 0.5 || alongAgrees(req, 0, cur.c.x + cur.c.w / 2, cur.c.y + cur.c.h / 2))) { return false; }
				remove(req.id);
				// One row set at a time, upward from the one it shows: a set that finds no place at
				// all ends the climb, since a bigger block rarely fits where a smaller one did not.
				const curS = score(cur.c, cur.cost);
				let ci = sets.length - 1;
				while (ci > 0 && sets[ci].length < cur.c.rows.length) { ci--; }
				let b = null;
				const same = cur.cost > 0 || (req.kind === 'link' && req.along && !alongAgrees(req, cur.c.angle || 0, cur.c.x + cur.c.w / 2, cur.c.y + cur.c.h / 2));
				// 'memo': a climb that found no place, with no ground freed near it since, fails again.
				if (ON.memo && !same && failedAt[req.id] !== undefined && failedAt[req.id] >= ci - 1 && !nearFreed(req, failedFrom[req.id])) {
					insert(req, cur.c, cur.ink, cur.cost);
					return false;
				}
				for (let j = same ? ci : ci - 1; j >= 0; j--) {
					const bj = best(req, [sets[j]], true);
					if (!bj) { if (j < ci) { failedAt[req.id] = j; failedFrom[req.id] = freed.length; break; } continue; }
					if (!b || bj.s < b.s) { b = bj; }
				}
				if (b && b.s < curS - 1e-9) { freed.push(cur.ink); insert(req, b.c, b.ink, b.cost); return true; }
				insert(req, cur.c, cur.ink, cur.cost);
				return false;
			}
			const growOrder = order.concat(seeded.map(function (id) { return reqById[id]; }));
			for (let i = 0; i < growOrder.length && !late(); i++) { regrow(growOrder[i]); }
			TIMING && console.log('p2', (now() - tStart).toFixed(1));
			// Kept labels grow in place, on the edge they hang from; with 'relocate', a kept label
			// that cannot grow in place may move to where it shows more (a move that shows more).
			Object.keys(kept).forEach(function (id) {
				if (late()) { return; }
				const req = reqById[id];
				const cur = placed[id];
				const sets = setsOf[id];
				remove(id);
				let done = false;
				for (let si = 0; si < sets.length && !done; si++) {
					const rows = sets[si];
					if (rows.length <= cur.c.rows.length) { break; }
					const sz = sizeOf(req, rows, cur.c.layout);
					const tries = [];
					if (!cur.c.angle) {
						tries.push(cur.c.align === 'right' ? cur.c.x + cur.c.w - sz.w : cur.c.x);
					} else {
						// A label lying along its pipe grows along the pipe from one end, which stays
						// where it was; either end may be the one that holds.
						const a = cur.c.angle * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a);
						const cx = cur.c.x + cur.c.w / 2, cy = cur.c.y + cur.c.h / 2, d = (sz.w - cur.c.w) / 2;
						[1, -1].forEach(function (sgn) { tries.push([cx + sgn * d * ux - sz.w / 2, cy + sgn * d * uy - sz.h / 2]); });
					}
					for (let ti = 0; ti < tries.length && !done; ti++) {
						const t = tries[ti];
						const c = Object.assign({}, cur.c, typeof t === 'number' ? { rows: rows, x: t, w: sz.w, h: sz.h }
							: { rows: rows, x: t[0], y: t[1], w: sz.w, h: sz.h });
						const ink = inkOf(req, c);
						if (c.leader && !leaderReaches(c.leader, ink)) { continue; }
						const cost = evaluate(req, c, ink, ownOf(req), false);
						if (cost !== Infinity && cost - ROW_VALUE * rows.length < cur.cost - ROW_VALUE * cur.c.rows.length) {
							insert(req, c, ink, cost); done = true;
						}
					}
				}
				if (!done && ON.relocate && cur.c.rows.length < sets[0].length) {
					const bigger = sets.filter(function (r) { return r.length > cur.c.rows.length; });
					const b = best(req, bigger, true);
					if (b) { insert(req, b.c, b.ink, b.cost); done = true; }
				}
				if (!done) { insert(req, cur.c, cur.ink, cur.cost); }
			});

			TIMING && console.log('p3', (now() - tStart).toFixed(1));
			// ---- 6. 'repair' (S15): every label still hidden looks again for its smallest form ---
			// Moves in the grow pass free ground; the labels the table held out are asked here too.
			const repaired = [];
			if (ON.repair) {
				reqs.forEach(function (req) {
					if (placed[req.id] || req.hand || req.kind === 'text' || late()) { return; }
					// Only where ground was freed since the first pass, or a label the table held out.
					if (!skip[req.id] && !nearFreed(req)) { return; }
					const sets = setsOf[req.id];
					const b = best(req, [sets[sets.length - 1]], true);
					if (b) { insert(req, b.c, b.ink, b.cost); repaired.push(req); }
				});
			}
			TIMING && console.log('p4', (now() - tStart).toFixed(1));
			// ---- 7. 'evict' (S16): a label still hidden may move ONE blocking neighbour elsewhere,
			// if the neighbour finds another place (with as many rows as it can); never a kept
			// label's neighbour that is hand-placed or a Text.
			if (ON.evict && !lite) {
				reqs.forEach(function (req) {
					if (placed[req.id] || req.hand || req.kind === 'text' || late()) { return; }
					const sets = setsOf[req.id], rows = sets[sets.length - 1], own = ownOf(req);
					const cs = sortedCandidates(req, rows);
					const tried = {};
					let tries = 0;
					for (let k = 0; k < cs.length && k < 60 && tries < 4; k++) {
						if (occ && quickBlocked(req, cs[k], occS)) { continue; }
						const r = cs[k].real || (cs[k].real = realize(req, cs[k]));
						const victim = soleBlocker(req, r);
						if (!victim || tried[victim]) { continue; }
						tried[victim] = 1; tries++;
						const vreq = reqById[victim], vcur = placed[victim];
						remove(victim);
						const cost = evaluate(req, r.c, r.ink, own, true, LABEL_CAP);
						if (cost === Infinity) { insert(vreq, vcur.c, vcur.ink, vcur.cost); continue; }
						insert(req, r.c, r.ink, cost);
						// The neighbour keeps as many rows as it had if it can, else fewer.
						const vsets = setsOf[victim].filter(function (r) { return r.length <= vcur.c.rows.length; });
						let vb = null;
						for (let j = 0; j < vsets.length && !vb; j++) { vb = best(vreq, [vsets[j]], true); }
						if (vb) { insert(vreq, vb.c, vb.ink, vb.cost); repaired.push(req); return; }
						remove(req.id);
						insert(vreq, vcur.c, vcur.ink, vcur.cost);
					}
				});
			}
			// The one movable label in the way of candidate r, or null (none, several, or a fixed
			// thing in the way). With 'leaderevict', a label whose LEADER the candidate would lie
			// on or cross, or whose text the candidate's leader would cross, is in the way too.
			function soleBlocker(req, r) {
				const ink = r.ink;
				let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
				ink.forEach(function (b) { x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); });
				if (x0 < vx0 || y0 < vy0 || x1 > vx1 || y1 > vy1) { return null; }
				let who = null, bad = false;
				function take(lid) {
					const vr = reqById[lid];
					if (!vr || vr.hand || vr.kind === 'text' || (who && who !== lid)) { bad = true; return true; }
					who = lid; return false;
				}
				const n = GH.gather(x0, y0, x1, y1, BUF);
				for (let m = 0; m < n; m++) {
					const it = BUF[m];
					if (it.lid === req.id) { continue; }
					if (!ink.some(function (b) { return boxHit(b, it.box); })) { continue; }
					if (it.t !== 'lab') { return null; }
					if (take(it.lid)) { return null; }
				}
				if (ON.leaderevict) {
					const m2 = GS.gather(x0, y0, x1, y1, BUF);
					for (let m = 0; m < m2; m++) {
						const it = BUF[m];
						if (it.t !== 'ldr' || it.lid === req.id) { continue; }
						if (!ink.some(function (b) { return segBox(it.p[0], it.p[1], it.q[0], it.q[1], b, 1.0); })) { continue; }
						if (String(it.lid).indexOf('T:') === 0 || take(it.lid)) { return null; }
					}
					const L = r.c.leader;
					if (L) {
						for (let sg = 1; sg < L.length; sg++) {
							const p = L[sg - 1], q = L[sg];
							const lx0 = Math.min(p[0], q[0]), ly0 = Math.min(p[1], q[1]), lx1 = Math.max(p[0], q[0]), ly1 = Math.max(p[1], q[1]);
							let k2 = GH.gather(lx0, ly0, lx1, ly1, BUF);
							for (let m = 0; m < k2; m++) {
								const it = BUF[m];
								if (it.t === 'lab' && it.lid !== req.id && segBox(p[0], p[1], q[0], q[1], it.box, 1.0) && take(it.lid)) { return null; }
							}
							k2 = GS.gather(lx0, ly0, lx1, ly1, BUF);
							for (let m = 0; m < k2; m++) {
								const it = BUF[m];
								if (it.t === 'ldr' && it.lid !== req.id && segCrossTight(p, q, it.p, it.q)) {
									if (String(it.lid).indexOf('T:') === 0 || take(it.lid)) { return null; }
								}
							}
						}
					}
				}
				return bad ? null : who;
			}
			TIMING && console.log('p5', (now() - tStart).toFixed(1));
			// The last sweep: a label still hidden may now cross a pipe.
			if (ON.cleanfirst && capNow < LABEL_CAP) {
				capNow = LABEL_CAP;
				reqs.forEach(function (req) {
					if (placed[req.id] || req.hand || req.kind === 'text' || late()) { return; }
					const sets = setsOf[req.id];
					const b = best(req, [sets[sets.length - 1]], true);
					if (b) { insert(req, b.c, b.ink, b.cost); repaired.push(req); }
				});
			}
			// The labels repair, eviction and the sweep seated grow too.
			for (let i = 0; i < repaired.length && !late(); i++) { regrow(repaired[i]); }
			TIMING && console.log('p6', (now() - tStart).toFixed(1));
			// ---- 8. 'polish' (S17): one more look for every label, since later moves freed ground
			// (a pipe label seated level early may now lie along its pipe).
			if (ON.polish && !lite) {
				for (let i = 0; i < growOrder.length && !late(); i++) {
					const req = growOrder[i], cur = placed[req.id];
					if (!cur) { continue; }
					const cut = cur.c.rows.length < setsOf[req.id][0].length;
					const level = req.kind === 'link' && req.along && !alongAgrees(req, cur.c.angle || 0, cur.c.x + cur.c.w / 2, cur.c.y + cur.c.h / 2);
					if ((cut || level || cur.cost > 0) && nearFreed(req, 0)) { if (TIMING) { PC[(cut ? 'c' : '') + (level ? 'l' : '') + (cur.cost > 0 ? 'x' : '')] = (PC[(cut ? 'c' : '') + (level ? 'l' : '') + (cur.cost > 0 ? 'x' : '')] || 0) + 1; } regrow(req); }
				}
			}

			TIMING && console.log('p7', (now() - tStart).toFixed(1), JSON.stringify(PC));
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
		let tables = {}, tablesSig = null, baseS = null, lastScene = null, lastLayout = null, rungMs = 0;
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
			let topo = scene.text.sizePx + '|' + scene.text.separator + '|' + JSON.stringify(scene.dropOrder) + '|' + JSON.stringify(scene.settings || null);
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
				return { id: id, owner: e.req.owner, kind: e.req.kind, rows: e.req.rows, layout: e.req.layout, along: e.req.along,
					anchor: { x: e.mx * s2 + tx2, y: e.my * s2 + ty2 },
					hand: e.hand ? { x: e.hand[0] * s2 + tx2, y: e.hand[1] * s2 + ty2 } : null };
			});
			const pad = 150;
			return { id: 'synth', viewport: { x: x0 - pad, y: y0 - pad, w: x1 - x0 + 2 * pad, h: y1 - y0 + 2 * pad },
				view: { s: s2, tx: tx2, ty: ty2 }, text: scene.text, dropOrder: scene.dropOrder, settings: scene.settings,
				nodes: nodes, links: links, texts: texts, customers: scene.customers || [], labels: labels };
		}
		function now() { return typeof performance !== 'undefined' ? performance.now() : Date.now(); }
		function idle(budgetMs, ctx) {
			const t0 = now();
			if (ctx && ctx.scene) { remember(ctx.scene); }
			const scene = lastScene;
			if (!scene || !ON.table) { return; }
			const byId = {};
			scene.nodes.forEach(function (n) { byId[n.id] = n; });
			gapsOf(scene, byId);
			// Rungs nearest the current zoom first; zooming in matters more than zooming out.
			const k0 = rungOf(scene.view.s), want = [k0];
			for (let d = 1; d <= 12; d++) { want.push(k0 + d); if (d <= 6) { want.push(k0 - d); } }
			// Once a view is on screen, the rungs beside it are rebuilt around what it shows, so the
			// next zoom finds the held labels and the table in agreement (T1 and T2 together).
			const fromView = lastLayout && lastLayout.scene === scene ? lastLayout : null;
			// The likeliest next views first: one notch in, twice as close, a little closer, one
			// notch out, twice as far.
			if (fromView) {
				const first = [k0 + 1, k0 + 4, k0 + 2, k0 - 1, k0 - 4, k0 + 3];
				want.splice(0, want.length);
				first.forEach(function (k) { want.push(k); });
				for (let d = 5; d <= 12; d++) { want.push(k0 + d); if (d <= 6) { want.push(k0 - d + 3); } }
			}
			// Never start a rung the budget cannot finish: the page must stay free for the user.
			if (!rungMs) { rungMs = 0.4 * Object.keys(registry).length + 5; }
			for (let i = 0; i < want.length; i++) {
				const k = want[i];
				if (tables[k] && (!fromView || tables[k].from === fromView)) { continue; }
				if (now() - t0 + rungMs * 1.25 > budgetMs) { break; }
				const t1 = now();
				const f = baseS * Math.pow(2, k / 4) / scene.view.s;
				const out = solve(synth(scene, f), fromView, null, true);
				tables[k] = out.learned;
				tables[k].from = fromView;
				rungMs = 0.5 * rungMs + 0.5 * (now() - t1);
			}
		}

		function place(scene, opts) {
			const prev = opts && opts.prev;
			remember(scene);
			const table = ON.table ? tables[rungOf(scene.view.s)] || null : null;
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
