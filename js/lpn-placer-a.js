// LABEL PLACER A: free space first, labels before properties, near home before far.
//
// The recipe, round 7 (STRATEGY.md beside this file has the numbers, and each ingredient's switch):
//
// MAP THE GROUND. Symbols, Text, pipes and Text callouts go into a 24 px bucket grid (exact tests)
// and a 3 px raster with summed-area tables, "is this rectangle clear?" in four reads (S8, S9).
// Overlaps up to 1.45 px are leading, not ink, a hair inside the bench's 1.5 (own: 'lead').
//
// WHERE TO LOOK. Tier 0 touches home: eight Imhof positions and two centred ones beside a node (S2);
// for a pipe label the setting asks to turn, turned and beside its pipe at stations sliding out from
// the middle of its on-screen stretch, on either side, close or half a row clear (S4), with level
// places dearer and on-the-pipe places dearer still (R7, R14); a pipe label it does not ask to turn
// is never turned (R13). Tiers 1-4 hang the label on a straight leader one ring further out each, in
// the widest gaps between the node's pipes first (S1), then round the compass (S3). A stack may
// unwrap to one line or a line wrap to a stack, a little dearer (S5). A leader that arrives at the
// top or bottom lands near a corner, and the rows are justified to that side (R5).
//
// IN WHAT ORDER. Hand-placed labels hang at the user's point (N4). Labels shown in the last view are
// carried at the same offset if still legal and still clean (S13, own: 'holdclean'). Every other
// label then takes its smallest form (the value the drop order keeps longest), most crowded first
// (S12, S11). A label still hidden
// looks again on a fine tier, every 15 degrees and every half row (S15, built in); then far, along
// straight leaders in 48 directions to the first clean open ground (S7, own form: 'far'); then it
// may move one or two neighbours that stand where it could go (S16). Then a label that took a spot
// across a pipe or leader asks the fine tier for cleaner ground ('clean'). Then rounds of growth, a
// row per label per round: in place first ('inplace'), else re-seated, held labels too ('reseat',
// R11), coarse tiers and then the fine tier. Last, a level pipe label turns if it now can (R14).
//
// TIME. Pass A is not bounded, so no label is hidden for want of time (R1). Everything after it is
// bounded by time, never by count (S21): eviction and far stop at 250 ms, growth at 500 ms, well
// inside R10's second; a slower machine shows fewer values, not fewer labels. A search that failed
// is not repeated until something near it has changed (own: 'dirty', stamped regions).
//
// STILL DOES BADLY. Greedy plus local repair, no global optimum. In a dense core every straight
// leader outward meets another node's symbol (N3), so labels there stay hidden although the screen
// has open ground. A level pipe label that turns at the next zoom shows nothing more for the move,
// so the bench counts it as churn. The standard hook is never used. A hand point on the label's own
// symbol cannot satisfy both N1 and N4; N4 wins.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
(function (root) {
'use strict';

// ---- tuning ----------------------------------------------------------------------------------
const GAP = 1.5;          // clearance between a symbol and a label beside it
const DIRS = [];          // the compass, 16 ways
for (let k = 0; k < 16; k++) { DIRS.push(k * Math.PI / 8); }
const RINGS = [0.8, 1.6, 2.6, 4.0];   // leader lengths tried, in row heights
const RINGS_ALT = [0.8, 1.8];         // and for the other shape, which is lazier
const RS_ALT = [0, 4], NRS = 5;       // ring slots: RINGS are 0-3, RINGS_ALT reuse 0 and add 4
const NSLOT = (4 + 16) * NRS;         // leader slots per label: up to 4 gap directions and the compass
const DIRS8 = [];
for (let k = 0; k < 8; k++) { DIRS8.push(k * Math.PI / 4); }
const ALT_SHAPE = 0.6;     // H1: the other shape costs a little (lazy), used when it wins
const CS = 24;            // grid cell size, px
const MARGIN = 320;       // grid reaches this far beyond the viewport
const W = {
	row: 4,               // each value row given up
	hide: 10,             // on top of the rows, for hiding the whole label
	hideCustomer: 1,      // customer labels give way first and easily
	lblPipe: 8,           // a label on a pipe
	ldrPipe: 3,           // a leader across a pipe
	lblLdr: 20,           // a label on a leader
	ldrLdr: 24,           // a leader across a leader
	lblTextLdr: 20
};
// ---- ingredients, each switchable so its worth can be measured (STRATEGY.md) -----------------
// In node: PLACER_A_OFF=s4,s15 node run.js ... switches those off. On the page they are all on.
const ING = { s1: true, s4: true, s5: true, s11: true, s12: true, s13: true, s15: true, grow: true, r5: true, lead: true, dirty: true, s16: true, reseat: true, inplace: true, clean: true, far: true, holdclean: true };
(function () {
	const env = typeof process !== 'undefined' && process.env ? process.env.PLACER_A_OFF : '';
	(env || '').split(',').forEach(function (k) { k = k.trim(); if (k && Object.prototype.hasOwnProperty.call(ING, k)) { ING[k] = false; } });
}());
const SOFT_MS = +(typeof process !== "undefined" && process.env && process.env.PLACER_A_SOFT_MS) || 500;       // growth and repair stop here, well inside R10's one second
const EVICT_MS = +(typeof process !== "undefined" && process.env && process.env.PLACER_A_EVICT_MS) || 250;      // and eviction here, so growth has time after it
function nowMs() { return typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now(); }
// Overlap tolerance in px: a hair inside the bench's 1.5 px of leading (own ingredient 'lead'), or
// the stricter 1.0 of earlier rounds.
const TOL = ING.lead ? 1.45 : 1.0, HELD_TOL = ING.lead ? 1.45 : 1.4;
let tol = TOL;
const ON_OWN = 3.5;       // a pipe label over its own pipe (R7): just under a row, so a value still wins
const LEVEL = 2;          // a pipe label the setting asks to turn, left level (R14): under a row
function distCost(L) { return L > 0 ? 0.6 + 0.6 * L + 0.12 * L * L : 0; }   // L in row heights

// ---- geometry --------------------------------------------------------------------------------
function mkBox(cx, cy, w, h, angle) {
	const a = angle || 0;
	const b = { cx: cx, cy: cy, hw: w / 2, hh: h / 2, angle: a, c: 1, s: 0, x0: 0, y0: 0, x1: 0, y1: 0 };
	if (a) {
		const r = a * Math.PI / 180;
		b.c = Math.cos(r); b.s = Math.sin(r);
		const ex = Math.abs(b.c) * b.hw + Math.abs(b.s) * b.hh, ey = Math.abs(b.s) * b.hw + Math.abs(b.c) * b.hh;
		b.x0 = cx - ex; b.x1 = cx + ex; b.y0 = cy - ey; b.y1 = cy + ey;
	} else {
		b.x0 = cx - b.hw; b.x1 = cx + b.hw; b.y0 = cy - b.hh; b.y1 = cy + b.hh;
	}
	return b;
}
function rectBox(x, y, w, h) { return mkBox(x + w / 2, y + h / 2, w, h, 0); }
// Overlap by more than TOL on every separating axis.
function boxesOverlap(a, b) {
	if (Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) <= tol || Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) <= tol) { return false; }
	if (!a.angle && !b.angle) { return true; }
	return sepAxes(a, b) && sepAxes(b, a);
}
// Projections of both boxes onto a's two axes overlap by more than TOL.
function sepAxes(a, b) {
	const dx = b.cx - a.cx, dy = b.cy - a.cy;
	// axis u = (c, s), v = (-s, c)
	const bu = Math.abs(b.c * a.c + b.s * a.s) * b.hw + Math.abs(-b.s * a.c + b.c * a.s) * b.hh;
	const bv = Math.abs(b.c * -a.s + b.s * a.c) * b.hw + Math.abs(-b.s * -a.s + b.c * a.c) * b.hh;
	const du = Math.abs(dx * a.c + dy * a.s), dv = Math.abs(-dx * a.s + dy * a.c);
	if (a.hw + bu - du <= tol) { return false; }
	if (a.hh + bv - dv <= tol) { return false; }
	return true;
}
// Does segment p-q pass through the inside of box b shrunk by `sh`?
function segHitsBox(px, py, qx, qy, b, sh) {
	const hw = b.hw - sh, hh = b.hh - sh;
	if (hw <= 0 || hh <= 0) { return false; }
	let ax = px - b.cx, ay = py - b.cy, bx = qx - b.cx, by = qy - b.cy;
	if (b.angle) {
		const c = b.c, s = b.s;
		const ax2 = ax * c + ay * s, ay2 = -ax * s + ay * c, bx2 = bx * c + by * s, by2 = -bx * s + by * c;
		ax = ax2; ay = ay2; bx = bx2; by = by2;
	}
	// Liang-Barsky against [-hw,hw] x [-hh,hh]
	const dx = bx - ax, dy = by - ay;
	let t0 = 0, t1 = 1, t;
	if (dx === 0) { if (ax <= -hw || ax >= hw) { return false; } } else {
		const ta = (-hw - ax) / dx, tb = (hw - ax) / dx;
		if (ta < tb) { if (ta > t0) { t0 = ta; } if (tb < t1) { t1 = tb; } } else { if (tb > t0) { t0 = tb; } if (ta < t1) { t1 = ta; } }
		if (t0 >= t1) { return false; }
	}
	if (dy === 0) { if (ay <= -hh || ay >= hh) { return false; } } else {
		const ta = (-hh - ay) / dy, tb = (hh - ay) / dy;
		if (ta < tb) { t = ta; if (t > t0) { t0 = t; } if (tb < t1) { t1 = tb; } } else { if (tb > t0) { t0 = tb; } if (ta < t1) { t1 = ta; } }
	}
	return t1 - t0 > 1e-9;
}
function orient(ax, ay, bx, by, cx, cy) { return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax); }
function distSeg(px, py, a, b) {
	const vx = b[0] - a[0], vy = b[1] - a[1], L2 = vx * vx + vy * vy;
	let t = L2 ? ((px - a[0]) * vx + (py - a[1]) * vy) / L2 : 0;
	t = t < 0 ? 0 : (t > 1 ? 1 : t);
	return Math.hypot(px - a[0] - t * vx, py - a[1] - t * vy);
}
// Proper crossing: the parameter along p-q where it crosses r-s, or -1.
function segCrossT(px, py, qx, qy, rx, ry, sx, sy) {
	const d1 = orient(rx, ry, sx, sy, px, py), d2 = orient(rx, ry, sx, sy, qx, qy);
	if ((d1 > 0) === (d2 > 0) || d1 === 0 || d2 === 0) { return -1; }
	const d3 = orient(px, py, qx, qy, rx, ry), d4 = orient(px, py, qx, qy, sx, sy);
	if ((d3 > 0) === (d4 > 0) || d3 === 0 || d4 === 0) { return -1; }
	return d1 / (d1 - d2);
}
function near(ax, ay, bx, by, e) { return Math.abs(ax - bx) <= e && Math.abs(ay - by) <= e && Math.hypot(ax - bx, ay - by) <= e; }

// ---- the real-estate grid: where things are, so free space can be asked about ---------------
function Grid(vp) {
	this.x0 = vp.x - MARGIN; this.y0 = vp.y - MARGIN;
	this.nx = Math.ceil((vp.w + 2 * MARGIN) / CS); this.ny = Math.ceil((vp.h + 2 * MARGIN) / CS);
	const n = this.nx * this.ny;
	this.L = [new Array(n), new Array(n), new Array(n)];   // 0 hard boxes, 1 pipe segments, 2 leader segments
	for (let k = 0; k < 3; k++) { for (let i = 0; i < n; i++) { this.L[k][i] = null; } }
	this.stamp = 1;
	this.buf = [];
	this.r = [0, 0, 0, 0];
	this.all = [[], [], []];
}
// A grid kept on the placer and emptied for the next view, so a layout makes little garbage.
function gridFor(pool, key, vp) {
	const g = pool[key];
	if (g && g.vx === vp.x && g.vy === vp.y && g.vw === vp.w && g.vh === vp.h) {
		for (let k = 0; k < 3; k++) { const L = g.L[k]; for (let i = 0; i < L.length; i++) { if (L[i] !== null && L[i].length) { L[i].length = 0; } } }
		g.all = [[], [], []];
		return g;
	}
	const n = new Grid(vp);
	n.vx = vp.x; n.vy = vp.y; n.vw = vp.w; n.vh = vp.h;
	pool[key] = n;
	return n;
}
Grid.prototype.range = function (x0, y0, x1, y1) {
	let i0 = Math.floor((x0 - this.x0) / CS), i1 = Math.floor((x1 - this.x0) / CS);
	let j0 = Math.floor((y0 - this.y0) / CS), j1 = Math.floor((y1 - this.y0) / CS);
	if (i1 < 0 || j1 < 0 || i0 >= this.nx || j0 >= this.ny) { return null; }
	const r = this.r;
	r[0] = i0 < 0 ? 0 : i0; r[2] = j0 < 0 ? 0 : j0;
	r[1] = i1 >= this.nx ? this.nx - 1 : i1; r[3] = j1 >= this.ny ? this.ny - 1 : j1;
	return r;
};
Grid.prototype.addBox = function (item) {
	this.all[0].push(item);
	const b = item.box, r = this.range(b.x0, b.y0, b.x1, b.y1), L = this.L[0];
	if (!r) { return; }
	for (let j = r[2]; j <= r[3]; j++) { for (let i = r[0]; i <= r[1]; i++) { const k = j * this.nx + i; (L[k] || (L[k] = [])).push(item); } }
};
// A segment goes into exactly the cells it passes through (row band by row band).
Grid.prototype.addSeg = function (layer, item) {
	this.all[layer].push(item);
	const L = this.L[layer];
	let ax = item.ax, ay = item.ay, bx = item.bx, by = item.by;
	if (ay > by) { let t = ax; ax = bx; bx = t; t = ay; ay = by; by = t; }
	const r = this.range(Math.min(ax, bx), ay, Math.max(ax, bx), by);
	if (!r) { return; }
	const dy = by - ay, dx = bx - ax;
	for (let j = r[2]; j <= r[3]; j++) {
		const yA = Math.max(ay, this.y0 + j * CS), yB = Math.min(by, this.y0 + (j + 1) * CS);
		let xa, xb;
		if (dy === 0) { xa = ax; xb = bx; } else { xa = ax + dx * (yA - ay) / dy; xb = ax + dx * (yB - ay) / dy; }
		let i0 = Math.floor((Math.min(xa, xb) - this.x0) / CS), i1 = Math.floor((Math.max(xa, xb) - this.x0) / CS);
		if (i1 < 0 || i0 >= this.nx) { continue; }
		if (i0 < 0) { i0 = 0; } if (i1 >= this.nx) { i1 = this.nx - 1; }
		for (let i = i0; i <= i1; i++) { const k = j * this.nx + i; (L[k] || (L[k] = [])).push(item); }
	}
};
// Gathers each live item near the rectangle once into this.buf; returns how many.
Grid.prototype.collect = function (layer, x0, y0, x1, y1) {
	const r = this.range(x0, y0, x1, y1);
	if (!r) { return 0; }
	const L = this.L[layer], st = ++this.stamp, buf = this.buf;
	let n = 0;
	for (let j = r[2]; j <= r[3]; j++) {
		for (let i = r[0]; i <= r[1]; i++) {
			const cell = L[j * this.nx + i];
			if (!cell) { continue; }
			for (let m = 0; m < cell.length; m++) {
				const it = cell[m];
				if (it.q === st || it.dead) { continue; }
				it.q = st;
				buf[n++] = it;
			}
		}
	}
	return n;
};
// Calls fn(item) once per live item near the rectangle; fn returns true to stop.
Grid.prototype.query = function (layer, x0, y0, x1, y1, fn) {
	const r = this.range(x0, y0, x1, y1);
	if (!r) { return false; }
	const L = this.L[layer], st = ++this.stamp;
	for (let j = r[2]; j <= r[3]; j++) {
		for (let i = r[0]; i <= r[1]; i++) {
			const cell = L[j * this.nx + i];
			if (!cell) { continue; }
			for (let m = 0; m < cell.length; m++) {
				const it = cell[m];
				if (it.q === st || it.dead) { continue; }
				it.q = st;
				if (fn(it)) { return true; }
			}
		}
	}
	return false;
};

// ---- the free-space raster: the static real estate at 2 px, as summed-area tables, so that
// "is this rectangle clear?" costs four reads ------------------------------------------------
const RR = 3, RMARGIN = 48;
function Raster(vp, G, pool) {
	const ox = vp.x - RMARGIN, oy = vp.y - RMARGIN;
	const nx = Math.ceil((vp.w + 2 * RMARGIN) / RR), ny = Math.ceil((vp.h + 2 * RMARGIN) / RR);
	this.ox = ox; this.oy = oy; this.nx = nx; this.ny = ny;
	// The buffers live on the placer and are reused from view to view (no garbage per layout).
	const n = nx * ny, n1 = (nx + 1) * (ny + 1);
	if (!pool.cell || pool.cell.length !== n) {
		pool.cell = new Uint8Array(n); pool.flag = new Uint8Array(n);
		pool.hard = new Int32Array(n1); pool.pipe = new Int32Array(n1); pool.tldr = new Int32Array(n1);
	} else { pool.cell.fill(0); pool.flag.fill(0); }
	const cell = pool.cell, flag = pool.flag;   // bit 1 hard, 2 pipe, 4 Text callout
	function markRect(v, x0, y0, x1, y1) {
		let i0 = Math.floor((x0 - ox) / RR), i1 = Math.floor((x1 - ox) / RR), j0 = Math.floor((y0 - oy) / RR), j1 = Math.floor((y1 - oy) / RR);
		if (i1 < 0 || j1 < 0 || i0 >= nx || j0 >= ny) { return; }
		if (i0 < 0) { i0 = 0; } if (j0 < 0) { j0 = 0; } if (i1 >= nx) { i1 = nx - 1; } if (j1 >= ny) { j1 = ny - 1; }
		for (let j = j0; j <= j1; j++) { for (let i = i0; i <= i1; i++) { cell[j * nx + i] |= v; } }
	}
	function markSeg(v, x0, y0, x1, y1) {
		const len = Math.hypot(x1 - x0, y1 - y0), m = Math.max(1, Math.ceil(len / 0.5));
		for (let k = 0; k <= m; k++) {
			const i = Math.floor((x0 + (x1 - x0) * k / m - ox) / RR), j = Math.floor((y0 + (y1 - y0) * k / m - oy) / RR);
			if (i >= 0 && j >= 0 && i < nx && j < ny) { cell[j * nx + i] |= v; }
		}
	}
	const X0 = ox, Y0 = oy, X1 = ox + nx * RR, Y1 = oy + ny * RR;
	function clipSeg(it) {
		// Liang-Barsky clip to the raster, so a long off-screen pipe costs nothing.
		let t0 = 0, t1 = 1;
		const dx = it.bx - it.ax, dy = it.by - it.ay;
		const P = [-dx, dx, -dy, dy], Q = [it.ax - X0, X1 - it.ax, it.ay - Y0, Y1 - it.ay];
		for (let i = 0; i < 4; i++) {
			if (P[i] === 0) { if (Q[i] < 0) { return null; } continue; }
			const t = Q[i] / P[i];
			if (P[i] < 0) { if (t > t1) { return null; } if (t > t0) { t0 = t; } } else { if (t < t0) { return null; } if (t < t1) { t1 = t; } }
		}
		return [it.ax + t0 * dx, it.ay + t0 * dy, it.ax + t1 * dx, it.ay + t1 * dy];
	}
	G.all[0].forEach(function (it) { const b = it.box; markRect(1, b.x0, b.y0, b.x1, b.y1); });
	G.all[1].forEach(function (it) { const c = clipSeg(it); if (c) { markSeg(2, c[0], c[1], c[2], c[3]); } });
	G.all[2].forEach(function (it) { const c = clipSeg(it); if (c) { markSeg(4, c[0], c[1], c[2], c[3]); } });
	// Summed-area tables, one per kind, in one sweep; and the walking flags, each mark spread by
	// one cell so a leader that passes within a pixel of a thing cannot miss it.
	const H = pool.hard, P = pool.pipe, T = pool.tldr, W1 = nx + 1;
	for (let j = 0; j < ny; j++) {
		let rh = 0, rp = 0, rt = 0;
		const base = j * nx, up = j * W1 + 1, dn = (j + 1) * W1 + 1;
		for (let i = 0; i < nx; i++) {
			const v = cell[base + i];
			if (v) {
				if (v & 1) { rh++; } if (v & 2) { rp++; } if (v & 4) { rt++; }
				const j0 = j > 0 ? j - 1 : 0, j1 = j < ny - 1 ? j + 1 : j, i0 = i > 0 ? i - 1 : 0, i1 = i < nx - 1 ? i + 1 : i;
				for (let jj = j0; jj <= j1; jj++) { for (let ii = i0; ii <= i1; ii++) { flag[jj * nx + ii] |= v; } }
			}
			H[dn + i] = H[up + i] + rh; P[dn + i] = P[up + i] + rp; T[dn + i] = T[up + i] + rt;
		}
	}
	this.hard = H; this.pipe = P; this.tldr = T; this.flag = flag;
}
// What a straight segment passes near: the OR of the flags of every cell it crosses (sampled
// every half pixel), or 7 (everything) when it leaves the raster.
Raster.prototype.walk = function (x0, y0, x1, y1) {
	const len = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.ceil(len * 2)), nx = this.nx, ny = this.ny;
	let v = 0;
	for (let k = 0; k <= n; k++) {
		const i = Math.floor((x0 + (x1 - x0) * k / n - this.ox) / RR), j = Math.floor((y0 + (y1 - y0) * k / n - this.oy) / RR);
		if (i < 0 || j < 0 || i >= nx || j >= ny) { return 7; }
		v |= this.flag[j * nx + i];
		if (v === 7) { return 7; }
	}
	return v;
};
Raster.prototype.covers = function (bb) {
	return bb[0] >= this.ox && bb[1] >= this.oy && bb[2] < this.ox + this.nx * RR && bb[3] < this.oy + this.ny * RR;
};
// Marked cells meeting the rectangle (cells it only touches at an edge count too).
Raster.prototype.sum = function (S, x0, y0, x1, y1) {
	if (x1 < x0 || y1 < y0) { return 0; }
	const nx = this.nx, ny = this.ny, W1 = nx + 1;
	let i0 = Math.floor((x0 - this.ox) / RR), i1 = Math.floor((x1 - this.ox) / RR) + 1;
	let j0 = Math.floor((y0 - this.oy) / RR), j1 = Math.floor((y1 - this.oy) / RR) + 1;
	if (i0 < 0) { i0 = 0; } if (j0 < 0) { j0 = 0; } if (i1 > nx) { i1 = nx; } if (j1 > ny) { j1 = ny; }
	if (i1 <= i0 || j1 <= j0) { return 0; }
	return S[j1 * W1 + i1] - S[j0 * W1 + i1] - S[j1 * W1 + i0] + S[j0 * W1 + i0];
};

// ---- the placer ------------------------------------------------------------------------------
function createPlacer() {
	const memo = { sig: null, gaps: null }, pool = {};

	// Ranked gap list per node: angular gaps between the pipes leaving it, widest first. Angles
	// are the same at every zoom, so this is worked out once per network and kept (T2, T3).
	function gapsFor(scene) {
		const sig = scene.nodes.length + ':' + scene.links.length + ':' + scene.links.map(function (l) { return l.id + l.from + l.to; }).join(',');
		if (memo.sig === sig && memo.gaps) { return memo.gaps; }
		const dirs = {};
		scene.links.forEach(function (l) {
			const p = l.points, n = p.length;
			if (n < 2) { return; }
			(dirs[l.from] || (dirs[l.from] = [])).push(Math.atan2(p[1][1] - p[0][1], p[1][0] - p[0][0]));
			(dirs[l.to] || (dirs[l.to] = [])).push(Math.atan2(p[n - 2][1] - p[n - 1][1], p[n - 2][0] - p[n - 1][0]));
		});
		const gaps = {};
		Object.keys(dirs).forEach(function (id) {
			const a = dirs[id].slice().sort(function (x, y) { return x - y; }), out = [];
			for (let i = 0; i < a.length; i++) {
				const s = a[i], e = i + 1 < a.length ? a[i + 1] : a[0] + 2 * Math.PI;
				out.push({ mid: (s + e) / 2, width: e - s });
			}
			out.sort(function (x, y) { return y.width - x.width; });
			gaps[id] = out;
		});
		memo.sig = sig; memo.gaps = gaps;
		return gaps;
	}

	function place(scene, opts) {
		return run(scene, (opts && opts.prev) || null, gapsFor(scene), pool);
	}
	// The breathers. Every time: the network's gap lists (zoom-proof, so kept until the network
	// changes). When a project opens and there are seconds to spare: one rehearsal of the opening
	// view, thrown away, so the engine is warm for the first real layout and every zoom after it.
	let warmed = false;
	function idle(budgetMs, ctx) {
		if (!ctx || !ctx.scene) { return; }
		gapsFor(ctx.scene);
		if (!warmed && ctx.opening && budgetMs >= 1000) {
			warmed = true;
			run(ctx.scene, null, gapsFor(ctx.scene), pool);
		}
	}
	return { name: 'a (free space first, labels before properties, near before far)', place: place, idle: idle };
}

function run(scene, prev, gaps, pool) {
	const t0 = nowMs();
	function overTime() { return nowMs() - t0 > SOFT_MS; }
	const vp = scene.viewport, T = scene.text, RH = T.rowHeightPx;
	const rw = scene.settings && scene.settings.readableAngleDeg;
	const WIN = rw && isFinite(rw.min) && isFinite(rw.max) ? rw : { min: -110, max: 70 };
	const G = gridFor(pool, 'G', vp);   // static real estate: symbols, Text, pipes, Text callouts
	const D = gridFor(pool, 'D', vp);   // what this pass has placed: label ink and label leaders
	const nodes = {}, links = {};
	scene.nodes.forEach(function (n) { nodes[n.id] = n; });
	scene.links.forEach(function (l, i) { links[l.id] = l; l._i = i; });

	scene.nodes.forEach(function (n) {
		const s = n.symbol;
		G.addBox({ box: rectBox(s.x, s.y, s.w, s.h), sym: true, node: n.id, lab: -1 });
	});
	scene.links.forEach(function (l) {
		(l.symbols || []).forEach(function (b) { G.addBox({ box: mkBox(b.cx, b.cy, b.w, b.h, b.angle), sym: true, node: null, link: l._i, lab: -1 }); });
		const p = l.points;
		for (let i = 1; i < p.length; i++) {
			G.addSeg(1, { ax: p[i - 1][0], ay: p[i - 1][1], bx: p[i][0], by: p[i][1], link: l._i });
		}
	});
	let ldrSeq = 0;
	scene.texts.forEach(function (t) {
		const b = t.box;
		G.addBox({ box: mkBox(b.cx, b.cy, b.w, b.h, b.angle), text: true, sym: false, lab: -1 });
		const L = t.leader;
		if (L && L.length > 1) {
			const id = ldrSeq++;
			for (let i = 1; i < L.length; i++) { G.addSeg(2, { ax: L[i - 1][0], ay: L[i - 1][1], bx: L[i][0], by: L[i][1], ld: id, lab: -1 }); }
		}
	});
	const Rs = new Raster(vp, G, pool);
	const custBox = {};
	(scene.customers || []).forEach(function (c) { custBox[c.id] = c.box; });

	const reqs = scene.labels, N = reqs.length;
	const linkSeen = new Int32Array(scene.links.length), ldrSeen = [], labSeen = new Int32Array(N + 1);
	let evalStamp = 0;

	// ---- per-label facts ----
	const info = reqs.map(function (req, li) {
		const f = { req: req, li: li, kind: req.kind, pt: null, sym: null, link: null, node: null, cc: [], lgA: new Array(NSLOT), lcA: new Float64Array(NSLOT), dmA: new Int32Array(NSLOT) };
		if (req.kind === 'node' && nodes[req.owner]) {
			f.node = nodes[req.owner]; f.pt = [f.node.x, f.node.y]; f.sym = f.node.symbol;
		} else if (req.kind === 'link' && links[req.owner]) {
			f.link = links[req.owner]; f.pt = [req.anchor.x, req.anchor.y];
			// A pump or valve symbol at the anchor: level places hang round it, as round a node.
			(f.link.symbols || []).forEach(function (b) {
				const ex = Math.abs(Math.cos(b.angle * Math.PI / 180)) * b.w / 2 + Math.abs(Math.sin(b.angle * Math.PI / 180)) * b.h / 2;
				const ey = Math.abs(Math.sin(b.angle * Math.PI / 180)) * b.w / 2 + Math.abs(Math.cos(b.angle * Math.PI / 180)) * b.h / 2;
				if (Math.abs(b.cx - f.pt[0]) <= ex + 2 && Math.abs(b.cy - f.pt[1]) <= ey + 2) { f.lsym = { x: b.cx - ex, y: b.cy - ey, w: 2 * ex, h: 2 * ey, r: Math.max(b.w, b.h) / 2 }; }
			});
		} else if (req.kind === 'customer' && custBox[req.owner]) {
			f.sym = custBox[req.owner]; f.pt = [f.sym.x + f.sym.w / 2, f.sym.y + f.sym.h / 2];
		} else {
			f.pt = [req.anchor.x, req.anchor.y];
		}
		if (!f.sym) { f.sym = { x: f.pt[0], y: f.pt[1], w: 0, h: 0 }; }
		f.subsets = rowSubsets(req, dropOrderOf(scene, req.kind));
		f.R = req.rows.length;
		return f;
	});

	// The drop order, FIRST TO GO first, with the ID in it like any other value; a scene that does
	// not name the ID puts it first to go (the contract's dropOrderOf()).
	function dropOrderOf(sc, kind) {
		const o = ((sc.dropOrder && sc.dropOrder[kind]) || []).slice();
		if (o.indexOf('id') < 0) { o.unshift('id'); }
		return o;
	}
	function rowSubsets(req, order) {
		const n = req.rows.length, keep = [];
		for (let i = 0; i < n; i++) { keep.push(true); }
		const out = [allIdx(keep)];
		const droppable = [];
		// A row whose field the order does not name goes before every named one.
		for (let i = 0; i < n; i++) { if (order.indexOf(req.rows[i].field) < 0) { droppable.push(i); } }
		order.forEach(function (fld) { for (let i = 0; i < n; i++) { if (req.rows[i].field === fld) { droppable.push(i); } } });
		for (let k = 0; k < droppable.length; k++) {
			keep[droppable[k]] = false;
			const idx = allIdx(keep);
			if (!idx.length) { break; }
			out.push(idx);
		}
		return out;
	}
	function allIdx(keep) { const o = []; for (let i = 0; i < keep.length; i++) { if (keep[i]) { o.push(i); } } return o; }

	// Size and row boxes of one shape.
	function shape(f, rows, layout) {
		const R = f.req.rows;
		if (layout === 'line') {
			let w = 0, h = 0;
			for (let i = 0; i < rows.length; i++) { w += R[rows[i]].w; h = Math.max(h, R[rows[i]].h); }
			w += (rows.length - 1) * T.separatorW;
			return { w: w, h: h, h0: h, layout: layout, rows: rows, rw: null, rh: null };
		}
		let w = 0, h = 0;
		const rw = [], rh = [];
		for (let i = 0; i < rows.length; i++) { const r = R[rows[i]]; rw.push(r.w); rh.push(r.h); w = Math.max(w, r.w); h += r.h; }
		return { w: w, h: h, h0: rh[0], layout: layout, rows: rows, rw: rw, rh: rh };
	}
	function boxesOf(sh, x, y, align, angle) {
		if (sh.layout === 'line' || sh.rows.length === 1) {
			return [mkBox(x + sh.w / 2, y + sh.h / 2, sh.w, sh.h, angle || 0)];
		}
		const out = [];
		let top = y;
		for (let i = 0; i < sh.rw.length; i++) {
			const rw = sh.rw[i], rh = sh.rh[i];
			const left = align === 'right' ? x + sh.w - rw : (align === 'center' ? x + (sh.w - rw) / 2 : x);
			out.push(mkBox(left + rw / 2, top + rh / 2, rw, rh, 0));
			top += rh;
		}
		return out;
	}
	function boxesFor(c) { return c.boxes || (c.boxes = boxesOf(c.sh, c.x, c.y, c.align, c.angle)); }

	// ---- evaluation, in two halves ----
	function aabbOf(boxes) {
		let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
		for (let i = 0; i < boxes.length; i++) {
			const b = boxes[i];
			if (b.x0 < x0) { x0 = b.x0; } if (b.y0 < y0) { y0 = b.y0; } if (b.x1 > x1) { x1 = b.x1; } if (b.y1 > y1) { y1 = b.y1; }
		}
		return [x0, y0, x1, y1];
	}
	function anyBoxHitsSeg(boxes, it) {
		for (let j = 0; j < boxes.length; j++) { if (segHitsBox(it.ax, it.ay, it.bx, it.by, boxes[j], tol)) { return true; } }
		return false;
	}
	// STATIC: against the network and the Text (the same in every pass, so worked out once per
	// candidate). Infinity when a never-rule would break.
	function evalStatic(f, cand, needInView) {
		if (needInView && !cand.angle && (cand.x < vp.x + 1 || cand.y < vp.y + 1 || cand.x + cand.sh.w > vp.x + vp.w - 1 || cand.y + cand.sh.h > vp.y + vp.h - 1)) { return Infinity; }
		const boxes = boxesFor(cand), bb = cand.bb || (cand.bb = aabbOf(boxes));
		if (needInView && (bb[0] < vp.x + 1 || bb[1] < vp.y + 1 || bb[2] > vp.x + vp.w - 1 || bb[3] > vp.y + vp.h - 1)) { return Infinity; }
		let cost = cand.base;
		if (cand.leader) {
			let lc = cand.lcFixed !== undefined ? cand.lcFixed : (cand.lk === undefined ? leaderStatic(f, cand.leader) : f.lcA[cand.lk]);
			if (lc === Infinity) { return Infinity; }
			cost += lc;
		}
		const ownLink = f.link ? f.link._i : -1, buf = G.buf, fast = !cand.angle && Rs.covers(bb);
		// Hard: a symbol or Text under the ink. The raster answers "certainly clear" at once.
		for (let j = 0; j < boxes.length; j++) {
			const b = boxes[j];
			if (fast && Rs.sum(Rs.hard, b.x0 + tol / 2, b.y0 + tol / 2, b.x1 - tol / 2, b.y1 - tol / 2) === 0) { continue; }
			const n = G.collect(0, b.x0, b.y0, b.x1, b.y1);
			for (let i = 0; i < n; i++) { if (boxesOverlap(b, buf[i].box)) { return Infinity; } }
		}
		const es = ++evalStamp;
		if (!fast || Rs.sum(Rs.pipe, bb[0], bb[1], bb[2], bb[3]) > 0) {
			const n = G.collect(1, bb[0], bb[1], bb[2], bb[3]);
			for (let i = 0; i < n; i++) {
				const it = buf[i];
				if (linkSeen[it.link] === es) { continue; }
				if (anyBoxHitsSeg(boxes, it)) { linkSeen[it.link] = es; if (it.link === ownLink) { cost += ON_OWN; cand.onOwn = true; } else { cost += W.lblPipe; } }
			}
		}
		if (!fast || Rs.sum(Rs.tldr, bb[0], bb[1], bb[2], bb[3]) > 0) {
			const n = G.collect(2, bb[0], bb[1], bb[2], bb[3]);
			for (let i = 0; i < n; i++) {
				const it = buf[i];
				if (ldrSeen[it.ld] === es) { continue; }
				if (anyBoxHitsSeg(boxes, it)) { ldrSeen[it.ld] = es; cost += W.lblLdr; }
			}
		}
		return cost;
	}
	// A leader's own static cost; the same for every shape and row set hung on it, so it is
	// worked out once per label and direction.
	function leaderStatic(f, L) {
		let cost = 0;
		const ownLink = f.link ? f.link._i : -1, ownNode = f.node ? f.node.id : null, buf = G.buf;
		const es = ++evalStamp, sx = L[0][0], sy = L[0][1];
		for (let s = 1; s < L.length; s++) {
			const px = L[s - 1][0], py = L[s - 1][1], qx = L[s][0], qy = L[s][1];
			const x0 = Math.min(px, qx), x1 = Math.max(px, qx), y0 = Math.min(py, qy), y1 = Math.max(py, qy);
			const near = Rs.walk(px, py, qx, qy);
			let n;
			if (near & 1) {
				n = G.collect(0, x0, y0, x1, y1);
				for (let i = 0; i < n; i++) {
					const it = buf[i];
					if (it.sym) {
						if (it.node === null) {
							// A pump or valve symbol: its own is where the leader starts; another's is no
							// never-rule (N3 is node symbols), but it costs like crossing two pipes.
							if (it.link !== ownLink && segHitsBox(px, py, qx, qy, it.box, tol)) { cost += 2 * W.ldrPipe; }
						} else if (it.node !== ownNode && segHitsBox(px, py, qx, qy, it.box, tol)) { return Infinity; }
					} else if (segHitsBox(px, py, qx, qy, it.box, tol)) { cost += 1; }
				}
			}
			if (near & 2) {
				n = G.collect(1, x0, y0, x1, y1);
				for (let i = 0; i < n; i++) {
					const it = buf[i];
					if (it.link === ownLink || linkSeen[it.link] === es) { continue; }
					const t = segCrossT(px, py, qx, qy, it.ax, it.ay, it.bx, it.by);
					if (t >= 0 && Math.hypot(px + t * (qx - px) - sx, py + t * (qy - py) - sy) > 1) { linkSeen[it.link] = es; cost += W.ldrPipe; }
				}
			}
			if (near & 4) {
				n = G.collect(2, x0, y0, x1, y1);
				for (let i = 0; i < n; i++) {
					const it = buf[i];
					if (ldrSeen[it.ld] === es) { continue; }
					if (segCrossT(px, py, qx, qy, it.ax, it.ay, it.bx, it.by) >= 0) { ldrSeen[it.ld] = es; cost += W.ldrLdr; }
				}
			}
		}
		return cost;
	}
	// DYNAMIC: against the labels placed so far. Adds to the static cost `st`.
	function evalDyn(f, cand, st, bound) {
		let cost = st;
		if (cost >= bound) { return Infinity; }
		const boxes = boxesFor(cand), bb = cand.bb || (cand.bb = aabbOf(boxes)), li = f.li, buf = D.buf;
		let n = D.collect(0, bb[0], bb[1], bb[2], bb[3]);
		for (let i = 0; i < n; i++) {
			const it = buf[i];
			if (it.lab === li) { continue; }
			for (let j = 0; j < boxes.length; j++) { if (boxesOverlap(boxes[j], it.box)) { return Infinity; } }
		}
		const es = ++evalStamp;
		const L = cand.leader;
		if (L) {
			for (let s = 1; s < L.length; s++) {
				const px = L[s - 1][0], py = L[s - 1][1], qx = L[s][0], qy = L[s][1];
				const x0 = Math.min(px, qx), x1 = Math.max(px, qx), y0 = Math.min(py, qy), y1 = Math.max(py, qy);
				n = D.collect(0, x0, y0, x1, y1);
				for (let i = 0; i < n; i++) {
					const it = buf[i];
					if (it.lab === li || labSeen[it.lab] === es) { continue; }
					if (segHitsBox(px, py, qx, qy, it.box, tol)) { labSeen[it.lab] = es; cost += W.lblLdr; }
				}
				n = D.collect(2, x0, y0, x1, y1);
				for (let i = 0; i < n; i++) {
					const it = buf[i];
					if (it.lab === li || ldrSeen[it.ld] === es) { continue; }
					if (near(px, py, it.ax, it.ay, 1.5) || near(px, py, it.bx, it.by, 1.5) || near(qx, qy, it.ax, it.ay, 1.5) || near(qx, qy, it.bx, it.by, 1.5)) { continue; }
					if (segCrossT(px, py, qx, qy, it.ax, it.ay, it.bx, it.by) >= 0) { ldrSeen[it.ld] = es; cost += W.ldrLdr; }
				}
				if (cost >= bound) { return Infinity; }
			}
		}
		n = D.collect(2, bb[0], bb[1], bb[2], bb[3]);
		for (let i = 0; i < n; i++) {
			const it = buf[i];
			if (it.lab === li || ldrSeen[it.ld] === es) { continue; }
			if (anyBoxHitsSeg(boxes, it)) { ldrSeen[it.ld] = es; cost += W.lblLdr; }
		}
		return cost >= bound ? Infinity : cost;
	}
	function evalFull(f, cand, needInView) {
		const st = evalStatic(f, cand, needInView);
		return st === Infinity ? st : evalDyn(f, cand, st, Infinity);
	}

	// Dirty regions (own ingredient 'dirty'): every commit and uncommit stamps the cells it touches,
	// so a label whose search failed is not searched again until something near it has changed.
	const DC = 48, dx0 = vp.x - MARGIN, dy0 = vp.y - MARGIN;
	const dnx = Math.ceil((vp.w + 2 * MARGIN) / DC), dny = Math.ceil((vp.h + 2 * MARGIN) / DC);
	const dirty = new Int32Array(dnx * dny);
	let ver = 1;
	function dcell(v, n0, d) { const i = Math.floor((v - n0) / DC); return i < 0 ? 0 : (i >= d ? d - 1 : i); }
	function stamp(cand) {
		const bb = cand.bb || (cand.bb = aabbOf(boxesFor(cand)));
		let x0 = bb[0], y0 = bb[1], x1 = bb[2], y1 = bb[3];
		if (cand.leader) { const L = cand.leader; for (let i = 0; i < L.length; i++) { x0 = Math.min(x0, L[i][0]); y0 = Math.min(y0, L[i][1]); x1 = Math.max(x1, L[i][0]); y1 = Math.max(y1, L[i][1]); } }
		ver++;
		const i0 = dcell(x0, dx0, dnx), i1 = dcell(x1, dx0, dnx), j0 = dcell(y0, dy0, dny), j1 = dcell(y1, dy0, dny);
		for (let j = j0; j <= j1; j++) { for (let i = i0; i <= i1; i++) { dirty[j * dnx + i] = ver; } }
	}
	function regionVer(f) {
		if (f.reach === undefined) {
			let w = 0;
			f.req.rows.forEach(function (r) { w += r.w + T.separatorW; });
			f.reach = Math.max(f.sym.w, f.sym.h) / 2 + 4.6 * RH + w + 8;
		}
		const r = f.reach, i0 = dcell(f.pt[0] - r, dx0, dnx), i1 = dcell(f.pt[0] + r, dx0, dnx), j0 = dcell(f.pt[1] - r, dy0, dny), j1 = dcell(f.pt[1] + r, dy0, dny);
		let m = 0;
		for (let j = j0; j <= j1; j++) { for (let i = i0; i <= i1; i++) { if (dirty[j * dnx + i] > m) { m = dirty[j * dnx + i]; } } }
		return m;
	}
	// True when the same search for f (row sets from k0) already failed and nothing near changed.
	function unchanged(f, k0) { return ING.dirty && f.memoK0 === k0 && regionVer(f) <= f.memoVer; }
	function remember(f, k0) { f.memoK0 = k0; f.memoVer = ver; }
	const placed = new Array(N);      // {cand, cost, items}
	function commit(f, cand, cost) {
		stamp(cand);
		const items = [];
		boxesFor(cand).forEach(function (b) { const it = { box: b, lab: f.li }; D.addBox(it); items.push(it); });
		if (cand.leader) {
			const id = ldrSeq++, L = cand.leader;
			for (let i = 1; i < L.length; i++) {
				const it = { ax: L[i - 1][0], ay: L[i - 1][1], bx: L[i][0], by: L[i][1], ld: id, lab: f.li };
				D.addSeg(2, it); items.push(it);
			}
		}
		placed[f.li] = { cand: cand, cost: cost, items: items };
	}
	function uncommit(f) {
		const p = placed[f.li];
		if (!p) { return null; }
		p.items.forEach(function (it) { it.dead = true; });
		stamp(p.cand);
		placed[f.li] = null;
		return p;
	}

	// The least ink any shape hung at P on this side must cover: the narrowest row, one row high.
	function coreBox(f, side, px, py) {
		if (f.minW === undefined) {
			f.minW = Infinity; f.minH = Infinity;
			f.req.rows.forEach(function (r) { f.minW = Math.min(f.minW, r.w); f.minH = Math.min(f.minH, r.h); });
		}
		// Above or below, a leader lands near a corner (R5), so only the middle is certain.
		const h = f.minH, w = side === 'E' || side === 'W' ? f.minW : (ING.r5 ? 2 * Math.min(5, f.minW / 2) : f.minW);
		const cx = side === 'E' ? px + w / 2 : (side === 'W' ? px - w / 2 : px), cy = side === 'N' ? py - h / 2 : (side === 'S' ? py + h / 2 : py);
		const b = CORE;
		b.cx = cx; b.cy = cy; b.hw = w / 2; b.hh = h / 2; b.x0 = cx - w / 2; b.x1 = cx + w / 2; b.y0 = cy - h / 2; b.y1 = cy + h / 2;
		return b;
	}
	const CORE = mkBox(0, 0, 0, 0, 0), CBB = [0, 0, 0, 0];
	function coreHits(grid, b, li) {
		CBB[0] = b.x0; CBB[1] = b.y0; CBB[2] = b.x1; CBB[3] = b.y1;
		if (grid === G && Rs.covers(CBB) && Rs.sum(Rs.hard, b.x0 + tol / 2, b.y0 + tol / 2, b.x1 - tol / 2, b.y1 - tol / 2) === 0) { return false; }
		const n = grid.collect(0, b.x0, b.y0, b.x1, b.y1), buf = grid.buf;
		for (let i = 0; i < n; i++) { if (buf[i].lab !== li && boxesOverlap(b, buf[i].box)) { return true; } }
		return false;
	}

	// ---- candidates ----
	function hang(sh, px, py, side, base, leader) {
		let x, y, align;
		if (side === 'E') { x = px; y = py - sh.h0 / 2; align = 'left'; }
		else if (side === 'W') { x = px - sh.w; y = py - sh.h0 / 2; align = 'right'; }
		else if (!ING.r5 || !leader) { x = px - sh.w / 2; y = side === 'N' ? py - sh.h : py; align = 'center'; }
		else {
			// R5: a leader arriving at the top or bottom edge lands near one corner, and the rows
			// are justified to that side, the side the leader leans toward.
			const lean = leader[leader.length - 1][0] - leader[0][0], inset = Math.min(5, minRowW(sh) / 2);
			y = side === 'N' ? py - sh.h : py;
			if (lean >= 0) { x = px - inset; align = 'left'; } else { x = px - sh.w + inset; align = 'right'; }
		}
		return { x: x, y: y, align: align, angle: 0, sh: sh, leader: leader, base: base };
	}
	function minRowW(sh) {
		if (!sh.rw) { return sh.w; }
		let m = Infinity;
		for (let i = 0; i < sh.rw.length; i++) { if (sh.rw[i] < m) { m = sh.rw[i]; } }
		return m;
	}
	function sideFor(ux, uy) {
		if (ux > 0.38) { return 'E'; }
		if (ux < -0.38) { return 'W'; }
		return uy < 0 ? 'N' : 'S';
	}

	// The candidates for one row set come in TIERS, made only when a search could still use them:
	// tier 0 is every place touching home (beside the symbol, along the pipe); tier t is the t-th
	// ring of leaders. Each tier is sorted by its own base cost and cached on the label; the static
	// half of a candidate's cost is worked out the first time a search reaches it, and kept.
	const NT = 1 + RINGS.length;
	function tierFloor(f, k, t) {
		return W.row * (f.R - f.subsets[k].length) + (t === 0 ? 0 : distCost(Math.min(RINGS[t - 1], RINGS_ALT[t - 1] || Infinity)));
	}
	function cands(f, k, t) {
		const key = k * NT + t;
		if (f.cc[key]) { return f.cc[key]; }
		const rows = f.subsets[k], rowPen = W.row * (f.R - rows.length), raw = [];
		if (f.link && f.link.points.length > 1 && f.req.layout === 'line') { linkCandidates(f, rows, rowPen, raw, t); } else { pointCandidates(f, rows, rowPen, raw, t); }
		for (let i = 0; i < raw.length; i++) { raw[i].k = k; }
		raw.sort(function (a, b) { return a.base - b.base; });
		f.cc[key] = raw;
		return raw;
	}
	function pointCandidates(f, rows, rowPen, out, t) {
		const usual = f.req.layout === 'line' ? 'line' : 'stack';
		around(f, shape(f, rows, usual), f.sym, rowPen, out, DIRS, RINGS, t);
		// H1: the other shape too (a stack unwrapped to one line, or the reverse), a little dearer.
		if (rows.length > 1) { around(f, shape(f, rows, usual === 'line' ? 'stack' : 'line'), f.sym, rowPen + ALT_SHAPE, out, DIRS8, RINGS_ALT, t); }
		return out;
	}
	function dirsFor(f, D) {
		const key = D === DIRS ? 'd16' : 'd8';
		if (f[key]) { return f[key]; }
		const dirs = [], gl = f.node ? gaps[f.node.id] : null;
		if (gl) { for (let i = 0; i < gl.length && i < 4; i++) { if (gl[i].width > 0.5) { dirs.push(gl[i].mid); } } }
		for (let i = 0; i < D.length; i++) { dirs.push(D[i]); }
		f[key] = dirs;
		return dirs;
	}
	// A label beside a point symbol, then out on leaders into open ground: the widest pipe gaps
	// first, then the compass.
	function around(f, sh, s, extra, out, D, RG, t) {
		const g = GAP, cx = f.pt[0], cy = f.pt[1];
		const sx0 = s.x - g, sx1 = s.x + s.w + g, sy0 = s.y - g, sy1 = s.y + s.h + g;
		const w = sh.w, H = sh.h;
		if (t === 0) {
			function put(x, y, align, pref) { out.push({ x: x, y: y, align: align, angle: 0, sh: sh, leader: null, base: extra + pref }); }
			put(sx1, sy0 - H, 'left', 0);
			put(sx1, cy - sh.h0 / 2, 'left', 0.1);
			put(sx1, sy1, 'left', 0.15);
			put(sx0 - w, sy0 - H, 'right', 0.2);
			put(sx0 - w, cy - sh.h0 / 2, 'right', 0.25);
			put(sx0 - w, sy1, 'right', 0.3);
			put(cx - w / 2, sy0 - H, 'center', 0.35);
			put(cx - w / 2, sy1, 'center', 0.4);
			put(sx1, cy - H / 2, 'left', 0.3);
			put(sx0 - w, cy - H / 2, 'right', 0.45);
			return;
		}
		if (t - 1 >= RG.length) { return; }
		// A pipe label's leader starts on its pipe, at the anchor, even through its own symbol.
		const rs = f.link ? 0 : Math.min(s.w, s.h) / 2, rOut = Math.max(s.w, s.h) / 2 + 2;
		const dirs = dirsFor(f, D), ng = dirs.length - D.length;
		for (let d = 0; d < dirs.length; d++) {
			const ux = Math.cos(dirs[d]), uy = Math.sin(dirs[d]), side = sideFor(ux, uy);
			for (let r = t - 1; r < t; r++) {
				const dist = rOut + RG[r] * RH;
				const px = cx + ux * dist, py = cy + uy * dist;
				// One leader serves every shape and row set hung on it: judged once, kept.
				const lk = (D === DIRS || d < ng ? d : ng + 2 * (d - ng)) * NRS + (RG === RINGS ? r : RS_ALT[r]);
				let L = f.lgA[lk];
				if (L === undefined) {
					L = [[cx + ux * rs, cy + uy * rs], [px, py]];
					// ... and so does the core every shape hung there must cover: if a symbol or
					// Text sits on it, nothing hung on this leader can stand.
					let lc = leaderStatic(f, L);
					if (lc < Infinity && coreHits(G, coreBox(f, side, px, py), -1)) { lc = Infinity; }
					f.lcA[lk] = lc;
					if (lc === Infinity) { L = null; }
					f.lgA[lk] = L;
				}
				if (L === null) { continue; }
				const c = hang(sh, px, py, side, extra + distCost((dist - rs) / RH), L);
				c.lk = lk; c.side = side;
				out.push(c);
			}
		}
	}
	// A pipe label. When the setting asks (req.along, R14): turned to the pipe and beside it, on
	// either side, at stations sliding out from the middle of the pipe's on-screen stretch (S4);
	// level only as the fallback, a little dearer. When it does not ask: level, never turned (R13).
	function linkCandidates(f, rows, rowPen, out, t) {
		const sh = shape(f, rows, 'line');
		const along = !!f.req.along, lvl = along ? LEVEL : 0;
		const pt0 = f.lsym || { x: f.pt[0], y: f.pt[1], w: 0, h: 0 };
		if (t > 0) {
			around(f, sh, pt0, rowPen + lvl, out, DIRS8, RINGS, t);
			if (rows.length > 1 && ING.s5) { around(f, shape(f, rows, 'stack'), pt0, rowPen + lvl + ALT_SHAPE, out, DIRS8, RINGS_ALT, t); }
			return out;
		}
		const st = stationsOf(f);
		if (along) {
			const off = sh.h / 2 + GAP + 0.5;
			for (let k = 0; k < st.length; k++) {
				const q = st[k], r = q.ang * Math.PI / 180, nx = Math.sin(r), ny = -Math.cos(r);
				const o = k === 0 && f.lsym ? Math.max(off, f.lsym.r + sh.h / 2 + GAP) : off;
				for (let side = 1; side >= -1; side -= 2) {
					// Close beside the pipe, or half a row clear of it.
					for (let m = 0; m < 2; m++) {
						const oo = m ? Math.max(o, sh.h / 2 + RH / 2 + 0.5) : o;
						if (m && oo - o < 2) { continue; }
						const ccx = q.x + nx * oo * side, ccy = q.y + ny * oo * side;
						out.push({ x: ccx - sh.w / 2, y: ccy - sh.h / 2, align: 'left', angle: q.ang, sh: sh, leader: null,
							base: rowPen + q.pen + (side < 0 ? 0.1 : 0) + m * 0.15 });
					}
				}
				// On its own pipe: dearer than beside it (R7), cheaper than giving up a value.
				out.push({ x: q.x - sh.w / 2, y: q.y - sh.h / 2, align: 'left', angle: q.ang, sh: sh, leader: null, base: rowPen + q.pen + 0.2 });
			}
		}
		// Level, touching the pipe at the anchor and at the nearer stations; as one line or a stack.
		const lim = Math.min(st.length, 3);
		for (let k = 0; k < lim; k++) {
			const pt = k === 0 && f.lsym ? f.lsym : { x: st[k].x, y: st[k].y, w: 0, h: 0 };
			around(f, sh, pt, rowPen + lvl + st[k].pen, out, DIRS8, RINGS, 0);
			if (rows.length > 1 && ING.s5) { around(f, shape(f, rows, 'stack'), pt, rowPen + lvl + st[k].pen + ALT_SHAPE, out, DIRS8, RINGS_ALT, 0); }
		}
		return out;
	}
	// Stations along a pipe's on-screen stretch: the anchor first, then the middle of what is on
	// screen and out from it by tenths of that stretch (S4), each with its local direction, turned
	// into the reading window, and a small cost for sliding away from the anchor.
	function stationsOf(f) {
		if (f.stations) { return f.stations; }
		const P = f.link.points, segs = [];
		let total = 0;
		for (let i = 1; i < P.length; i++) {
			const L = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
			if (L > 0) { segs.push({ a: P[i - 1], b: P[i], s0: total, L: L }); total += L; }
		}
		const out = [];
		function at(s) {
			for (let i = 0; i < segs.length; i++) {
				const g = segs[i];
				if (s <= g.s0 + g.L || i === segs.length - 1) {
					const u = Math.max(0, Math.min(1, (s - g.s0) / g.L));
					return { x: g.a[0] + u * (g.b[0] - g.a[0]), y: g.a[1] + u * (g.b[1] - g.a[1]), ang: readable(Math.atan2(g.b[1] - g.a[1], g.b[0] - g.a[0]) * 180 / Math.PI), g: g };
				}
			}
			return null;
		}
		if (!segs.length) { f.stations = [{ x: f.pt[0], y: f.pt[1], ang: 0, pen: 0 }]; return f.stations; }
		// The anchor, on its nearest segment.
		let sA = 0, best = Infinity;
		segs.forEach(function (g) {
			const vx = g.b[0] - g.a[0], vy = g.b[1] - g.a[1];
			let u = ((f.pt[0] - g.a[0]) * vx + (f.pt[1] - g.a[1]) * vy) / (g.L * g.L);
			u = Math.max(0, Math.min(1, u));
			const d = Math.hypot(g.a[0] + u * vx - f.pt[0], g.a[1] + u * vy - f.pt[1]);
			if (d < best) { best = d; sA = g.s0 + u * g.L; }
		});
		const q0 = at(sA);
		q0.pen = 0; out.push(q0);
		if (ING.s4) {
			// The on-screen stretch, as arc length.
			let on0 = Infinity, on1 = -Infinity;
			const m = 40;
			for (let k = 0; k <= m; k++) {
				const q = at(total * k / m);
				if (q.x >= vp.x && q.y >= vp.y && q.x <= vp.x + vp.w && q.y <= vp.y + vp.h) { on0 = Math.min(on0, k / m); on1 = Math.max(on1, k / m); }
			}
			if (on0 <= on1) {
				const mid = (on0 + on1) / 2, span = on1 - on0;
				[0, -0.1, 0.1, -0.2, 0.2, -0.3, 0.3, -0.4, 0.4].forEach(function (o, i) {
					const fr = mid + o * span;
					if (fr < on0 || fr > on1) { return; }
					const s = total * fr;
					if (Math.abs(s - sA) < 4) { return; }
					const q = at(s);
					q.pen = 0.05 + 0.04 * i;
					out.push(q);
				});
			}
		}
		f.stations = out;
		return out;
	}
	function readable(a) {
		a = ((a % 360) + 360) % 360; if (a > 180) { a -= 360; }
		if (!(a > WIN.min && a <= WIN.max)) { a += 180; a = ((a % 360) + 360) % 360; if (a > 180) { a -= 360; } }
		return a;
	}

	// Best candidate for label f among row sets k0..k1, given everything placed.
	let searchStamp = 0;
	function search(f, bound, k0, k1) {
		let best = null, bestCost = bound;
		const ss = ++searchStamp, dm = f.dmA;
		for (let k = k0; k <= k1; k++) {
			const rowPen = W.row * (f.R - f.subsets[k].length);
			if (rowPen >= bestCost) { continue; }
			for (let t = 0; t < NT; t++) {
			if (tierFloor(f, k, t) >= bestCost) { continue; }
			const list = cands(f, k, t);
			for (let i = 0; i < list.length; i++) {
				const c0 = list[i];
				if (c0.base >= bestCost) { break; }
				if (c0.lk !== undefined) {
					// A leader whose core another label already covers: skip every shape on it.
					const m = dm[c0.lk];
					if (m === ss) { continue; }
					if (m !== -ss) {
						if (coreHits(D, coreBox(f, c0.side, c0.leader[1][0], c0.leader[1][1]), f.li)) { dm[c0.lk] = ss; continue; }
						dm[c0.lk] = -ss;
					}
				}
				if (c0.st === undefined) { c0.st = evalStatic(f, c0, true); }
				if (c0.st >= bestCost) { continue; }
				const c = evalDyn(f, c0, c0.st, bestCost);
				if (c < bestCost) { bestCost = c; best = c0; }
			}
			}
		}
		return best ? { cand: best, cost: bestCost } : null;
	}
	function hideCost(f) { return W.row * f.R + (f.kind === 'customer' ? W.hideCustomer : W.hide); }

	// ---- 1. hand-placed labels: hung at the user's point, shown whatever happens (N4) ----
	const kept = new Array(N);
	info.forEach(function (f) { if (!f.R) { kept[f.li] = 'empty'; } });
	info.forEach(function (f) {
		if (!f.req.hand || kept[f.li]) { return; }
		const H = [f.req.hand.x, f.req.hand.y];
		const start = ownerPointToward(f, H);
		const ux = H[0] - start[0], uy = H[1] - start[1], len = Math.hypot(ux, uy);
		const side0 = len > 0.5 ? sideFor(ux / len, uy / len) : 'E';
		const sides = [side0].concat(['E', 'W', 'N', 'S'].filter(function (s) { return s !== side0; }));
		let leader = len > 3 ? [start, H] : null;
		if (leader && leaderHitsSymbol(f, leader)) { leader = null; }
		const layout = f.req.layout === 'line' ? 'line' : 'stack';
		let chosen = null, first = null;
		for (let k = 0; k < f.subsets.length && !chosen; k++) {
			const sh = shape(f, f.subsets[k], layout);
			for (let i = 0; i < sides.length && !chosen; i++) {
				const c = hang(sh, H[0], H[1], sides[i], W.row * (f.R - f.subsets[k].length), leader);
				if (!first) { first = c; }
				const cost = evalFull(f, c, false);
				if (cost < Infinity) { chosen = { cand: c, cost: cost }; }
			}
		}
		if (!chosen) { chosen = { cand: first, cost: 0 }; }
		commit(f, chosen.cand, chosen.cost);
		kept[f.li] = 'hand';
	});
	function ownerPointToward(f, H) {
		if (f.link) {
			const P = f.link.points;
			let best = Infinity, bp = f.pt;
			for (let i = 1; i < P.length; i++) {
				const a = P[i - 1], b = P[i], vx = b[0] - a[0], vy = b[1] - a[1], L2 = vx * vx + vy * vy;
				let t = L2 ? ((H[0] - a[0]) * vx + (H[1] - a[1]) * vy) / L2 : 0;
				t = t < 0 ? 0 : (t > 1 ? 1 : t);
				const q = [a[0] + t * vx, a[1] + t * vy], d = Math.hypot(H[0] - q[0], H[1] - q[1]);
				if (d < best) { best = d; bp = q; }
			}
			return bp;
		}
		return [f.pt[0], f.pt[1]];
	}
	function leaderHitsSymbol(f, L) {
		const ownNode = f.node ? f.node.id : null;
		for (let s = 1; s < L.length; s++) {
			const px = L[s - 1][0], py = L[s - 1][1], qx = L[s][0], qy = L[s][1];
			if (G.query(0, Math.min(px, qx), Math.min(py, qy), Math.max(px, qx), Math.max(py, qy), function (it) {
				return it.sym && it.node !== null && it.node !== ownNode && segHitsBox(px, py, qx, qy, it.box, TOL);
			})) { return true; }
		}
		return false;
	}

	// ---- 2. labels shown in the previous view hold still unless forced (T1) ----
	const prevPl = {}, prevReq = {};
	if (prev && prev.layout && prev.layout.labels && prev.scene) {
		prev.scene.labels.forEach(function (r) { prevReq[r.id] = r; });
		const PL = prev.layout.labels;
		Object.keys(PL).forEach(function (id) { prevPl[id] = PL[id]; });
	}
	info.forEach(function (f) {
		if (kept[f.li] || !ING.s13) { return; }
		const pl = prevPl[f.req.id];
		if (!pl || !pl.shown || !prevReq[f.req.id]) { return; }
		const c = carried(f, pl, prevReq[f.req.id]);
		if (!c) { return; }
		// R14: a level pipe label the setting asks to turn takes a clean turned spot with the same
		// rows when one has opened up, rather than holding still level.
		if (f.link && f.req.along && !c.angle) {
			const k = subsetIndex(f, c.sh.rows), a = k < 0 ? null : bestAligned(f, k);
			if (a) { commit(f, a.cand, a.cost); kept[f.li] = 'held'; return; }
		}
		// The bench's own tolerance, a hair inside it: a symbol that grew by a pixel on zooming in
		// does not force a label to jump.
		c.k = subsetIndex(f, c.sh.rows);
		if (c.k < 0) { return; }
		tol = HELD_TOL;
		const cost = evalFull(f, c, false);
		tol = TOL;
		// Held only while it crosses nothing worse than a pipe with its leader ('holdclean'): a
		// carried label that now lies across a pipe or a leader looks again like any other.
		if (cost < Infinity && (!ING.holdclean || cost - c.base < W.lblPipe - 0.01)) { commit(f, c, cost); kept[f.li] = 'held'; }
	});
	function subsetIndex(f, rows) {
		for (let k = 0; k < f.subsets.length; k++) {
			const s = f.subsets[k];
			if (s.length === rows.length && s.every(function (v, i) { return v === rows[i]; })) { return k; }
		}
		return -1;
	}
	// The cheapest clean turned spot beside its pipe for row set k, or null.
	function bestAligned(f, k) {
		const list = cands(f, k, 0), rowPen = W.row * (f.R - f.subsets[k].length);
		let best = null, bestCost = rowPen + 1.5;
		for (let i = 0; i < list.length; i++) {
			const c = list[i];
			if (!c.angle || c.base >= bestCost) { continue; }
			if (c.st === undefined) { c.st = evalStatic(f, c, true); }
			if (c.st >= bestCost || c.onOwn) { continue; }
			const v = evalDyn(f, c, c.st, bestCost);
			if (v < bestCost) { best = c; bestCost = v; }
		}
		return best ? { cand: best, cost: bestCost } : null;
	}
	function carried(f, pl, r0) {
		// R13: when the setting no longer asks, a turned label does not stay turned.
		if (f.link && !f.req.along && Math.abs((+pl.angle || 0) % 180) > 0.5) { return null; }
		const fields = pl.rows.map(function (i) { return r0.rows[i] && r0.rows[i].field; });
		const rows = [];
		f.req.rows.forEach(function (r, i) { if (fields.indexOf(r.field) >= 0) { rows.push(i); } });
		if (!rows.length) { return null; }
		const dx = f.req.anchor.x - r0.anchor.x, dy = f.req.anchor.y - r0.anchor.y;
		const sh = shape(f, rows, pl.layout || f.req.layout);
		const leader = pl.leader ? pl.leader.map(function (p) { return [p[0] + dx, p[1] + dy]; }) : null;
		if (leader && f.link && distToLink(leader[0], f.link) > 0.8) { return null; }
		if (leader && f.node && Math.hypot(leader[0][0] - f.pt[0], leader[0][1] - f.pt[1]) > Math.max(f.sym.w, f.sym.h) / 2 + 0.9) { return null; }
		const lead = leader ? distCost(Math.hypot(leader[1][0] - leader[0][0], leader[1][1] - leader[0][1]) / RH) : 0;
		return { x: pl.x + dx, y: pl.y + dy, align: pl.align || 'left', angle: pl.angle || 0, sh: sh, leader: leader,
			base: W.row * (f.R - rows.length) + lead, lead: lead };
	}
	function distToLink(p, l) {
		let d = Infinity;
		for (let i = 1; i < l.points.length; i++) { d = Math.min(d, distSeg(p[0], p[1], l.points[i - 1], l.points[i])); }
		return d;
	}
	// Growth for a held label: more rows on the same anchored edge and the same top (T1, S2).
	function growHeld(f) {
		const p = placed[f.li];
		if (!p) { return; }
		const c0 = p.cand, n0 = c0.sh.rows.length;
		if (c0.align === 'center' && !c0.angle) { return; }
		for (let k = 0; k < f.subsets.length; k++) {
			const rows = f.subsets[k];
			if (rows.length <= n0) { break; }
			if (rows.length > n0 + 1) { continue; }
			if (!containsAll(rows, c0.sh.rows)) { continue; }
			const sh = shape(f, rows, c0.sh.layout);
			let x = c0.align === 'right' ? c0.x + c0.sh.w - sh.w : c0.x, y = c0.y;
			if (c0.angle) {
				// A turned label keeps where its text starts, and grows along its pipe.
				const r = c0.angle * Math.PI / 180, dw = (sh.w - c0.sh.w) / 2;
				const cx = c0.x + c0.sh.w / 2 + dw * Math.cos(r), cy = c0.y + c0.sh.h / 2 + dw * Math.sin(r);
				x = cx - sh.w / 2; y = cy - sh.h / 2;
			}
			const c = { x: x, y: y, align: c0.align, angle: c0.angle, sh: sh,
				leader: c0.leader, base: c0.base - W.row * (rows.length - n0), lead: c0.lead };
			if (c.leader && !leaderTouches(c)) { continue; }
			const cur = placed[f.li];
			uncommit(f);
			const cost = evalFull(f, c, true);
			if (cost < cur.cost && !(c.onOwn && !c0.onOwn)) { c.k = k; commit(f, c, cost); return; }
			commit(f, cur.cand, cur.cost);
		}
	}
	function containsAll(a, b) { for (let i = 0; i < b.length; i++) { if (a.indexOf(b[i]) < 0) { return false; } } return true; }
	function leaderTouches(c) {
		const e = c.leader[c.leader.length - 1];
		return boxesFor(c).some(function (b) {
			return Math.max(0, Math.abs(e[0] - b.cx) - b.hw) <= 1 && Math.max(0, Math.abs(e[1] - b.cy) - b.hh) <= 1;
		});
	}

	// ---- 3. everything else: labels first, then properties ----
	const free = info.filter(function (f) { return !kept[f.li]; });
	// Customer labels give way first (they choose last); otherwise the most crowded choose first.
	const kindRank = { text: -1, node: 0, link: 0, customer: 1 };
	free.forEach(function (f) {
		const min = f.subsets.length - 1, l = cands(f, min, 0);
		let c = 0;
		for (let i = 0; i < l.length; i++) { if (l[i].st === undefined) { l[i].st = evalStatic(f, l[i], true); } if (l[i].st < l[i].base + 2) { c++; } }
		f.room = c;
	});
	free.sort(function (a, b) { return (kindRank[a.kind] || 0) - (kindRank[b.kind] || 0) || (ING.s12 ? a.room - b.room : a.li - b.li); });
	// Pass A: every label in its smallest form, near home, so as many as possible get a place.
	free.forEach(function (f) {
		const min = f.subsets.length - 1;
		// Smallest form first (S11); switched off, each label takes all it can in turn.
		const r = search(f, hideCost(f), ING.s11 ? min : 0, min);
		if (r) { commit(f, r.cand, r.cost); }
	});
	// ---- 4. repair (S15, built in): a label still hidden looks again, finely: a straight leader
	// every 15 degrees and every half row out to 4 rows, against everything now placed. Then the
	// rounds run again so what was seated may grow, until nothing changes or time runs short (R10:
	// bounded by time, never by how many labels there are). ----
		const FINE_DIRS = [], FINE_LENS = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
	for (let d = 0; d < 24; d++) { FINE_DIRS.push(d * Math.PI / 12); }
	function fineCands(f, k) {
		const key = 'fine' + k;
		if (f[key]) { return f[key]; }
		const rows = f.subsets[k], rowPen = W.row * (f.R - rows.length), out = [];
		const isLink = f.link && f.req.layout === 'line', lvl = isLink && f.req.along ? LEVEL : 0;
		const usual = f.req.layout === 'line' ? 'line' : 'stack';
		const shapes = [[shape(f, rows, usual), 0]];
		if (rows.length > 1 && ING.s5) { shapes.push([shape(f, rows, usual === 'line' ? 'stack' : 'line'), ALT_SHAPE]); }
		const s = isLink ? (f.lsym || { x: f.pt[0], y: f.pt[1], w: 0, h: 0 }) : f.sym, cx = f.pt[0], cy = f.pt[1];
		const rs = f.link ? 0 : Math.min(s.w, s.h) / 2, rOut = Math.max(s.w, s.h) / 2 + 1;
		f.fineL = f.fineL || {};
		for (let li = 0; li < FINE_LENS.length; li++) {
			for (let d = 0; d < FINE_DIRS.length; d++) {
				const ux = Math.cos(FINE_DIRS[d]), uy = Math.sin(FINE_DIRS[d]), side = sideFor(ux, uy);
				const dist = rOut + FINE_LENS[li] * RH, px = cx + ux * dist, py = cy + uy * dist;
				const lkey = li * 24 + d;
				let L = f.fineL[lkey];
				if (L === undefined) {
					L = FINE_LENS[li] === 0 && !f.lsym && !isLink ? 'none' : [[cx + ux * rs, cy + uy * rs], [px, py]];
					if (L !== 'none') {
						const lc = leaderStatic(f, L);
						if (lc === Infinity) { L = null; } else { L.lc = lc; }
					}
					f.fineL[lkey] = L;
				}
				if (L === null) { continue; }
				for (let i = 0; i < shapes.length; i++) {
					const c = hang(shapes[i][0], px, py, side, rowPen + lvl + shapes[i][1] + distCost((dist - rs) / RH), L === 'none' ? null : L);
					if (L !== 'none') { c.lcFixed = L.lc; }
					c.k = k;
					out.push(c);
				}
			}
		}
		out.sort(function (a, b) { return a.base - b.base; });
		f[key] = out;
		return out;
	}
	function searchFine(f, bound, k) {
		const list = fineCands(f, k);
		let best = null, bestCost = bound;
		for (let i = 0; i < list.length; i++) {
			const c = list[i];
			if (c.base >= bestCost) { break; }
			if (c.st === undefined) { c.st = evalStatic(f, c, true); }
			if (c.st >= bestCost) { continue; }
			const v = evalDyn(f, c, c.st, bestCost);
			if (v < bestCost) { best = c; bestCost = v; }
		}
		return best ? { cand: best, cost: bestCost } : null;
	}
	// One round of growth: each label may take back one row, re-seating itself to do it. Returns how
	// many grew. The first round may also re-seat a label at the rows it has, if that is cheaper.
	function growRound(fine, first) {
		let changed = 0;
		info.forEach(function (f) {
			if (overTime()) { return; }
			if (kept[f.li] === 'hand' || kept[f.li] === 'empty') { return; }
			if (kept[f.li] === 'held' || ING.inplace) {
				// Grow where it stands first: cheap, and the label holds still.
				const before = placed[f.li] && placed[f.li].cand;
				if (before) { growHeld(f); }
				if (placed[f.li] && placed[f.li].cand !== before) { changed++; return; }
				// R11: a held label that cannot grow where it stands may move to show more.
				if (kept[f.li] === 'held' && !ING.reseat) { return; }
			}
			const p = placed[f.li];
			if (!p) { return; }
			const n = f.subsets.length, curK = p.cand.k;
			if (curK === 0) { return; }
			if (p.cand.st === undefined) { p.cand.st = evalStatic(f, p.cand, false); }
			const cur = evalDyn(f, p.cand, p.cand.st, Infinity);
			const k0 = Math.max(0, curK - 1);
			if (unchanged(f, k0) && (!fine || f.fineTried === k0)) { return; }
			let r = unchanged(f, k0) ? null : search(f, cur, k0, first ? Math.min(curK, n - 1) : k0);
			if ((!r || r.cand === p.cand) && fine && f.fineTried !== curK - 1 && !overTime()) {
				// The fine tier once per row set and view: it is dear, and what is placed near a
				// label rarely gives way between two rounds.
				f.fineTried = curK - 1;
				r = searchFine(f, cur, curK - 1);
			}
			if (r && r.cand !== p.cand && (kept[f.li] !== 'held' || r.cand.k < curK)) {
				uncommit(f); commit(f, r.cand, r.cost);
				if (r.cand.k < curK) { changed++; if (kept[f.li] === 'held') { kept[f.li] = undefined; } } else { remember(f, k0); }
			} else { remember(f, k0); }
		});
		return changed;
	}
	// R14, last: a pipe label the setting asks to turn, still level, turns when a clean spot beside
	// its pipe has opened up for the same rows.
	function alignPass() {
		info.forEach(function (f) {
			const p = placed[f.li];
			if (!p || !f.link || !f.req.along || p.cand.angle || kept[f.li] === 'hand') { return; }
			const k = p.cand.k !== undefined ? p.cand.k : subsetIndex(f, p.cand.sh.rows);
			if (k < 0) { return; }
			uncommit(f);
			const a = bestAligned(f, k);
			if (a) { commit(f, a.cand, a.cost); } else { commit(f, p.cand, p.cost); }
		});
	}
	// Labels before properties (S11): a label still hidden after pass A looks again, finely.
	if (ING.s15) {
		free.forEach(function (f) {
			if (placed[f.li] || overTime()) { return; }
			const min = f.subsets.length - 1;
			const r = searchFine(f, hideCost(f), min);
			if (r) { commit(f, r.cand, r.cost); }
		});
	}
	// Far (S7, own form): R1 gives up nearness to home first. A label still hidden walks a straight
	// leader out, in 48 directions, past where the near tiers stop, and takes the first landing on
	// clean open ground: no symbol, Text, pipe, label or leader under the text. A direction ends at
	// the first node symbol, Text, label or leader its leader would cross (N3, and the two worst
	// crossings); crossing pipes is allowed and counted. The shortest landing over all directions wins.
	const FAR_BASE = 8, FAR_PIPE = 0.3, FAR_LEN = 0.05;
	function segBlocked(f, ax, ay, bx, by) {
		const x0 = Math.min(ax, bx), x1 = Math.max(ax, bx), y0 = Math.min(ay, by), y1 = Math.max(ay, by), ownNode = f.node ? f.node.id : null;
		if (G.query(0, x0, y0, x1, y1, function (it) {
			if (it.sym && (it.node === null || it.node === ownNode)) { return false; }
			return segHitsBox(ax, ay, bx, by, it.box, tol);
		})) { return true; }
		if (G.query(2, x0, y0, x1, y1, function (it) { return segCrossT(ax, ay, bx, by, it.ax, it.ay, it.bx, it.by) >= 0; })) { return true; }
		if (D.query(0, x0, y0, x1, y1, function (it) { return it.lab !== f.li && segHitsBox(ax, ay, bx, by, it.box, tol); })) { return true; }
		return D.query(2, x0, y0, x1, y1, function (it) { return it.lab !== f.li && segCrossT(ax, ay, bx, by, it.ax, it.ay, it.bx, it.by) >= 0; });
	}
	function pipesCrossed(f, ax, ay, bx, by, sx, sy) {
		const ownLink = f.link ? f.link._i : -1, es = ++evalStamp;
		let n = 0;
		G.query(1, Math.min(ax, bx), Math.min(ay, by), Math.max(ax, bx), Math.max(ay, by), function (it) {
			if (it.link === ownLink || linkSeen[it.link] === es) { return false; }
			const t = segCrossT(ax, ay, bx, by, it.ax, it.ay, it.bx, it.by);
			if (t >= 0 && Math.hypot(ax + t * (bx - ax) - sx, ay + t * (by - ay) - sy) > 1) { linkSeen[it.link] = es; n++; }
			return false;
		});
		return n;
	}
	// Clean ground for the text alone: nothing under it at all, and on screen.
	function cleanGround(f, c) {
		const boxes = boxesFor(c), bb = c.bb || (c.bb = aabbOf(boxes));
		if (bb[0] < vp.x + 1 || bb[1] < vp.y + 1 || bb[2] > vp.x + vp.w - 1 || bb[3] > vp.y + vp.h - 1) { return false; }
		if (Rs.covers(bb) && Rs.sum(Rs.hard, bb[0], bb[1], bb[2], bb[3]) + Rs.sum(Rs.pipe, bb[0], bb[1], bb[2], bb[3]) + Rs.sum(Rs.tldr, bb[0], bb[1], bb[2], bb[3]) > 0) { return false; }
		const buf = D.buf;
		let n = D.collect(0, bb[0], bb[1], bb[2], bb[3]);
		for (let i = 0; i < n; i++) { for (let j = 0; j < boxes.length; j++) { if (boxesOverlap(boxes[j], buf[i].box)) { return false; } } }
		n = D.collect(2, bb[0], bb[1], bb[2], bb[3]);
		for (let i = 0; i < n; i++) { if (anyBoxHitsSeg(boxes, buf[i])) { return false; } }
		return true;
	}
	function farSearch(f, k) {
		const rows = f.subsets[k], sh = shape(f, rows, f.req.layout === 'line' ? 'line' : 'stack');
		const rowPen = W.row * (f.R - rows.length), lvl = f.link && f.req.along ? LEVEL : 0;
		const s0 = f.link ? (f.lsym || { x: f.pt[0], y: f.pt[1], w: 0, h: 0 }) : f.sym, cx = f.pt[0], cy = f.pt[1];
		const rs = f.link ? 0 : Math.min(s0.w, s0.h) / 2, rOut = Math.max(s0.w, s0.h) / 2 + 1;
		const step = RH / 2, maxLen = Math.hypot(vp.w, vp.h);
		let best = null, bestCost = hideCost(f);
		for (let d = 0; d < 48; d++) {
			const a = d * Math.PI / 24, ux = Math.cos(a), uy = Math.sin(a), side = sideFor(ux, uy);
			const sx = cx + ux * rs, sy = cy + uy * rs;
			let dist = rOut + 4.5 * RH, px = cx + ux * dist, py = cy + uy * dist;
			if (segBlocked(f, sx, sy, px, py)) { continue; }
			for (; dist < maxLen; dist += step) {
				const nx = cx + ux * dist, ny = cy + uy * dist;
				if (nx < vp.x || ny < vp.y || nx > vp.x + vp.w || ny > vp.y + vp.h) { break; }
				if (dist > rOut + 4.5 * RH && segBlocked(f, px, py, nx, ny)) { break; }
				px = nx; py = ny;
				const L = [[sx, sy], [px, py]];
				const base = rowPen + lvl + FAR_BASE + FAR_LEN * (dist - rs) / RH;
				if (base >= bestCost) { break; }
				const c = hang(sh, px, py, side, base, L);
				if (!cleanGround(f, c)) { continue; }
				const pc = pipesCrossed(f, sx, sy, px, py, sx, sy);
				c.lcFixed = FAR_PIPE * pc;
				c.k = k; c.far = true;
				if (base + c.lcFixed < bestCost) { best = c; bestCost = base + c.lcFixed; }
				break;
			}
		}
		if (!best) { return null; }
		best.st = evalStatic(f, best, true);
		const v = best.st < Infinity ? evalDyn(f, best, best.st, Infinity) : Infinity;
		return v < hideCost(f) ? { cand: best, cost: v } : null;
	}
	if (ING.far) {
		free.forEach(function (f) {
			if (placed[f.li] || nowMs() - t0 > EVICT_MS) { return; }
			const r = farSearch(f, f.subsets.length - 1);
			if (r) { commit(f, r.cand, r.cost); }
		});
	}
	// Eviction (S16): a label still hidden may move one or two neighbours that stand on a spot it
	// could use, if each of them finds another place (with fewer values, if need be), so that more
	// labels show in all.
	function blockersOf(f, c) {
		const boxes = boxesFor(c), bb = c.bb || (c.bb = aabbOf(boxes)), buf = D.buf, out = [];
		let n = D.collect(0, bb[0], bb[1], bb[2], bb[3]);
		for (let i = 0; i < n; i++) {
			const it = buf[i];
			if (it.lab === f.li || out.indexOf(it.lab) >= 0) { continue; }
			for (let j = 0; j < boxes.length; j++) { if (boxesOverlap(boxes[j], it.box)) { out.push(it.lab); break; } }
		}
		n = D.collect(2, bb[0], bb[1], bb[2], bb[3]);
		for (let i = 0; i < n; i++) { const it = buf[i]; if (it.lab !== f.li && out.indexOf(it.lab) < 0 && anyBoxHitsSeg(boxes, it)) { out.push(it.lab); } }
		return out;
	}
	function evict(f) {
		const min = f.subsets.length - 1, hc = hideCost(f);
		const list = fineCands(f, min).concat(cands(f, min, 0));
		let tried = 0;
		for (let i = 0; i < list.length && tried < 10 && nowMs() - t0 < EVICT_MS; i++) {
			const c = list[i];
			if (c.base >= hc) { continue; }
			if (c.st === undefined) { c.st = evalStatic(f, c, true); }
			if (c.st >= hc) { continue; }
			const B = blockersOf(f, c);
			if (!B.length || B.length > 2 || B.some(function (li) { return kept[li] === 'hand'; })) { continue; }
			tried++;
			const saved = B.map(function (li) { return { f: info[li], p: uncommit(info[li]), kept: kept[li] }; });
			const v = evalDyn(f, c, c.st, hc);
			let ok = v < hc;
			if (ok) {
				commit(f, c, v);
				const moved = [];
				for (let j = 0; j < saved.length && ok; j++) {
					const g = saved[j].f, gm = g.subsets.length - 1, gk = saved[j].p.cand.k >= 0 ? saved[j].p.cand.k : 0;
					let r = search(g, hideCost(g), gk, gm);
					if (!r) { r = searchFine(g, hideCost(g), gm); }
					if (r) { commit(g, r.cand, r.cost); moved.push(g); } else { ok = false; }
				}
				if (!ok) { moved.forEach(function (g) { uncommit(g); }); uncommit(f); }
			}
			if (ok) { saved.forEach(function (sv) { if (kept[sv.f.li] === 'held') { kept[sv.f.li] = undefined; } }); return true; }
			saved.forEach(function (sv) { commit(sv.f, sv.p.cand, sv.p.cost); });
		}
		return false;
	}
	if (ING.s16) {
		free.forEach(function (f) { if (!placed[f.li] && nowMs() - t0 < EVICT_MS) { evict(f); } });
	}
	// Cleaner ground (own ingredient 'clean'): a label that took a spot across a pipe or a leader,
	// because the coarse tiers had nothing better, asks the fine tier for a clean one, same rows.
	if (ING.clean) {
		info.forEach(function (f) {
			const p = placed[f.li];
			if (!p || kept[f.li] || overTime() || p.cand.k === undefined) { return; }
			if (p.cand.st === undefined) { p.cand.st = evalStatic(f, p.cand, true); }
			const cur = evalDyn(f, p.cand, p.cand.st, Infinity);
			if (cur - p.cand.base < W.ldrPipe) { return; }
			const r = searchFine(f, cur, p.cand.k);
			if (r && r.cand !== p.cand) { uncommit(f); commit(f, r.cand, r.cost); }
		});
	}
	// Pass B: rounds in which each label may take back one row (a better place for it, given the
	// others), so room is shared out fairly rather than to whoever asks first; then the same with
	// the fine tier. Bounded by time, never by how many labels there are (S21, R10).
	for (let g = 0; g < 32 && !overTime(); g++) { if (!growRound(false, g === 0)) { break; } }
	if (ING.grow) {
		for (let g = 0; g < 32 && !overTime(); g++) { if (!growRound(true, false)) { break; } }
	}
	if (ING.s4) { alignPass(); }

	// ---- out ----
	const out = {};
	info.forEach(function (f) {
		const p = placed[f.li];
		if (!p) { out[f.req.id] = { shown: false }; return; }
		const c = p.cand;
		out[f.req.id] = { shown: true, rows: c.sh.rows.slice(), layout: c.sh.layout, align: c.align,
			x: c.x, y: c.y, angle: c.angle || 0, leader: c.leader ? c.leader.map(function (q) { return [q[0], q[1]]; }) : null };
	});
	return { labels: out };
}

const shared = createPlacer();
const mod = { name: shared.name, create: createPlacer, place: shared.place, idle: shared.idle };
if (typeof module !== 'undefined' && module.exports) { module.exports = mod; }
const EC = typeof EngCalcs !== 'undefined' ? EngCalcs : (root && root.EngCalcs);   // eslint-disable-line no-undef
if (EC) { EC.lpnPlacers = EC.lpnPlacers || {}; EC.lpnPlacers.a = mod; }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
