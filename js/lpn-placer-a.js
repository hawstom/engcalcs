// LABEL PLACER A. (write-up to come)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
(function (root) {
'use strict';

// ---- tuning ----------------------------------------------------------------------------------
const TOL = 1.0;          // our overlap tolerance in px (the bench forgives 1.5; we stay stricter)
const HELD_TOL = 1.4;     // for a label held still from the last view
const GAP = 1.5;          // clearance between a symbol and a label beside it
const DIRS = [];          // the compass, 16 ways
for (let k = 0; k < 16; k++) { DIRS.push(k * Math.PI / 8); }
const RINGS = [0.8, 1.6, 2.6, 4.0];   // leader lengths tried, in row heights
const RINGS_ALT = [0.8, 1.8];         // and for the other shape, which is lazier
const SIDES = [[1, 0], [-1, 0.15], [0, 1.5]];   // a pipe label above, below, or on its pipe: [side, cost]
let tol = TOL;
const DIRS8 = [];
for (let k = 0; k < 8; k++) { DIRS8.push(k * Math.PI / 4); }
const ALT_SHAPE = 0.6;     // H1: the other shape costs a little (lazy), used when it wins
const LINK_OFF_PIPE = 2; // a pipe label that leaves its pipe for the horizontal
const CS = 24;            // grid cell size, px
const MARGIN = 320;       // grid reaches this far beyond the viewport
const W = {
	row: 4,               // each value row given up
	hide: 10,             // on top of the rows, for hiding the whole label
	lblPipe: 8,           // a label on a pipe
	ldrPipe: 3,           // a leader across a pipe
	lblLdr: 20,           // a label on a leader
	ldrLdr: 24,           // a leader across a leader
	lblTextLdr: 20
};
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
// Proper crossing; returns the crossing point or null. Shared end points (within 1.5) never cross.
function segCross(px, py, qx, qy, rx, ry, sx, sy) {
	const d1 = orient(rx, ry, sx, sy, px, py), d2 = orient(rx, ry, sx, sy, qx, qy);
	if ((d1 > 0) === (d2 > 0) || d1 === 0 || d2 === 0) { return null; }
	const d3 = orient(px, py, qx, qy, rx, ry), d4 = orient(px, py, qx, qy, sx, sy);
	if ((d3 > 0) === (d4 > 0) || d3 === 0 || d4 === 0) { return null; }
	const t = d1 / (d1 - d2);
	return [px + t * (qx - px), py + t * (qy - py)];
}
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
	this.touch = new Int32Array(n);
	this.tick = 0;
}
// Records that something changed over a rectangle (for the "has anything near me moved?" test).
Grid.prototype.mark = function (x0, y0, x1, y1) {
	const r = this.range(x0, y0, x1, y1);
	if (!r) { return; }
	const t = this.tick;
	for (let j = r[2]; j <= r[3]; j++) { for (let i = r[0]; i <= r[1]; i++) { this.touch[j * this.nx + i] = t; } }
};
Grid.prototype.lastTouch = function (bb) {
	const r = this.range(bb[0], bb[1], bb[2], bb[3]);
	if (!r) { return 0; }
	let m = 0;
	for (let j = r[2]; j <= r[3]; j++) { for (let i = r[0]; i <= r[1]; i++) { const v = this.touch[j * this.nx + i]; if (v > m) { m = v; } } }
	return m;
};
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
const RR = 2, RMARGIN = 48;
function Raster(vp, G) {
	const ox = vp.x - RMARGIN, oy = vp.y - RMARGIN;
	const nx = Math.ceil((vp.w + 2 * RMARGIN) / RR), ny = Math.ceil((vp.h + 2 * RMARGIN) / RR);
	this.ox = ox; this.oy = oy; this.nx = nx; this.ny = ny;
	const hard = new Uint8Array(nx * ny), pipe = new Uint8Array(nx * ny), tldr = new Uint8Array(nx * ny);
	const self = this;
	function markRect(a, x0, y0, x1, y1) {
		let i0 = Math.floor((x0 - ox) / RR), i1 = Math.floor((x1 - ox) / RR), j0 = Math.floor((y0 - oy) / RR), j1 = Math.floor((y1 - oy) / RR);
		if (i1 < 0 || j1 < 0 || i0 >= nx || j0 >= ny) { return; }
		if (i0 < 0) { i0 = 0; } if (j0 < 0) { j0 = 0; } if (i1 >= nx) { i1 = nx - 1; } if (j1 >= ny) { j1 = ny - 1; }
		for (let j = j0; j <= j1; j++) { for (let i = i0; i <= i1; i++) { a[j * nx + i] = 1; } }
	}
	function markSeg(a, x0, y0, x1, y1) {
		const len = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.ceil(len / 0.5));
		for (let k = 0; k <= n; k++) {
			const x = x0 + (x1 - x0) * k / n, y = y0 + (y1 - y0) * k / n;
			const i = Math.floor((x - ox) / RR), j = Math.floor((y - oy) / RR);
			if (i >= 0 && j >= 0 && i < nx && j < ny) { a[j * nx + i] = 1; }
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
	G.all[0].forEach(function (it) { const b = it.box; markRect(hard, b.x0, b.y0, b.x1, b.y1); });
	G.all[1].forEach(function (it) { const c = clipSeg(it); if (c) { markSeg(pipe, c[0], c[1], c[2], c[3]); } });
	G.all[2].forEach(function (it) { const c = clipSeg(it); if (c) { markSeg(tldr, c[0], c[1], c[2], c[3]); } });
	this.hard = sat(hard); this.pipe = sat(pipe); this.tldr = sat(tldr);
	// One byte per cell for walking a leader: bit 1 hard, 2 pipe, 4 Text callout, each spread by
	// one cell so a walk that passes within a pixel of a thing cannot miss it.
	const flag = new Uint8Array(nx * ny);
	for (let j = 0; j < ny; j++) {
		for (let i = 0; i < nx; i++) {
			const k = j * nx + i, v = (hard[k] ? 1 : 0) | (pipe[k] ? 2 : 0) | (tldr[k] ? 4 : 0);
			if (!v) { continue; }
			for (let dj = -1; dj <= 1; dj++) {
				const jj = j + dj;
				if (jj < 0 || jj >= ny) { continue; }
				for (let di = -1; di <= 1; di++) { const ii = i + di; if (ii >= 0 && ii < nx) { flag[jj * nx + ii] |= v; } }
			}
		}
	}
	this.flag = flag;
	function sat(a) {
		const W1 = nx + 1, S = new Int32Array(W1 * (ny + 1));
		for (let j = 0; j < ny; j++) {
			let row = 0;
			for (let i = 0; i < nx; i++) { row += a[j * nx + i]; S[(j + 1) * W1 + i + 1] = S[j * W1 + i + 1] + row; }
		}
		return S;
	}
	void self;
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
	const memo = { sig: null, gaps: null };

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
		return run(scene, (opts && opts.prev) || null, gapsFor(scene));
	}
	function idle(budgetMs, ctx) {
		if (ctx && ctx.scene) { gapsFor(ctx.scene); }
	}
	return { name: 'a (free-space grid, near home first, drop before travel)', place: place, idle: idle };
}

function run(scene, prev, gaps) {
	const vp = scene.viewport, T = scene.text, RH = T.rowHeightPx;
	const G = new Grid(vp);   // static real estate: symbols, Text, pipes, Text callouts
	const D = new Grid(vp);   // what this pass has placed: label ink and label leaders
	const nodes = {}, links = {};
	scene.nodes.forEach(function (n) { nodes[n.id] = n; });
	scene.links.forEach(function (l, i) { links[l.id] = l; l._i = i; });

	scene.nodes.forEach(function (n) {
		const s = n.symbol;
		G.addBox({ box: rectBox(s.x, s.y, s.w, s.h), sym: true, node: n.id, lab: -1 });
	});
	scene.links.forEach(function (l) {
		(l.symbols || []).forEach(function (b) { G.addBox({ box: mkBox(b.cx, b.cy, b.w, b.h, b.angle), sym: true, node: null, lab: -1 }); });
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
	const Rs = new Raster(vp, G);
	const custBox = {};
	(scene.customers || []).forEach(function (c) { custBox[c.id] = c.box; });

	const reqs = scene.labels, N = reqs.length;
	const linkSeen = new Int32Array(scene.links.length), ldrSeen = [], labSeen = new Int32Array(N + 1);
	let evalStamp = 0;

	// ---- per-label facts ----
	const info = reqs.map(function (req, li) {
		const f = { req: req, li: li, kind: req.kind, pt: null, sym: null, link: null, node: null, cc: [], lc: new Map(), lg: new Map(), tick: -1, k0: 0, k1: -1, region: null };
		if (req.kind === 'node' && nodes[req.owner]) {
			f.node = nodes[req.owner]; f.pt = [f.node.x, f.node.y]; f.sym = f.node.symbol;
		} else if (req.kind === 'link' && links[req.owner]) {
			f.link = links[req.owner]; f.pt = [req.anchor.x, req.anchor.y];
		} else if (req.kind === 'customer' && custBox[req.owner]) {
			f.sym = custBox[req.owner]; f.pt = [f.sym.x + f.sym.w / 2, f.sym.y + f.sym.h / 2];
		} else {
			f.pt = [req.anchor.x, req.anchor.y];
		}
		if (!f.sym) { f.sym = { x: f.pt[0], y: f.pt[1], w: 0, h: 0 }; }
		f.subsets = rowSubsets(req, scene.dropOrder[req.kind] || []);
		f.R = req.rows.length;
		return f;
	});

	function rowSubsets(req, order) {
		const n = req.rows.length, keep = [];
		for (let i = 0; i < n; i++) { keep.push(true); }
		const out = [allIdx(keep)];
		const droppable = [];
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
			let lc = f.lc.get(cand.lk);
			if (lc === undefined) { lc = leaderStatic(f, cand.leader); f.lc.set(cand.lk, lc); }
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
				if (it.link === ownLink || linkSeen[it.link] === es) { continue; }
				if (anyBoxHitsSeg(boxes, it)) { linkSeen[it.link] = es; cost += W.lblPipe; }
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
						if (!(it.node !== null && it.node === ownNode) && segHitsBox(px, py, qx, qy, it.box, tol)) { return Infinity; }
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

	const placed = new Array(N);      // {cand, cost, items}
	function commit(f, cand, cost) {
		const items = [];
		D.tick++;
		boxesFor(cand).forEach(function (b) { const it = { box: b, lab: f.li }; D.addBox(it); items.push(it); D.mark(b.x0, b.y0, b.x1, b.y1); });
		if (cand.leader) {
			const id = ldrSeq++, L = cand.leader;
			for (let i = 1; i < L.length; i++) {
				const it = { ax: L[i - 1][0], ay: L[i - 1][1], bx: L[i][0], by: L[i][1], ld: id, lab: f.li };
				D.addSeg(2, it); items.push(it);
				D.mark(Math.min(it.ax, it.bx), Math.min(it.ay, it.by), Math.max(it.ax, it.bx), Math.max(it.ay, it.by));
			}
		}
		placed[f.li] = { cand: cand, cost: cost, items: items };
	}
	function uncommit(f) {
		const p = placed[f.li];
		if (!p) { return null; }
		D.tick++;
		p.items.forEach(function (it) {
			it.dead = true;
			if (it.box) { D.mark(it.box.x0, it.box.y0, it.box.x1, it.box.y1); } else { D.mark(Math.min(it.ax, it.bx), Math.min(it.ay, it.by), Math.max(it.ax, it.bx), Math.max(it.ay, it.by)); }
		});
		placed[f.li] = null;
		return p;
	}

	// The least ink any shape hung at P on this side must cover: the narrowest row, one row high.
	function coreBox(f, side, px, py) {
		if (f.minW === undefined) {
			f.minW = Infinity; f.minH = Infinity;
			f.req.rows.forEach(function (r) { f.minW = Math.min(f.minW, r.w); f.minH = Math.min(f.minH, r.h); });
		}
		const w = f.minW, h = f.minH;
		if (side === 'E') { return mkBox(px + w / 2, py, w, h, 0); }
		if (side === 'W') { return mkBox(px - w / 2, py, w, h, 0); }
		if (side === 'N') { return mkBox(px, py - h / 2, w, h, 0); }
		return mkBox(px, py + h / 2, w, h, 0);
	}
	function coreHits(grid, b, li) {
		if (grid === G && Rs.covers([b.x0, b.y0, b.x1, b.y1]) && Rs.sum(Rs.hard, b.x0 + tol / 2, b.y0 + tol / 2, b.x1 - tol / 2, b.y1 - tol / 2) === 0) { return false; }
		const n = grid.collect(0, b.x0, b.y0, b.x1, b.y1), buf = grid.buf;
		for (let i = 0; i < n; i++) { if (buf[i].lab !== li && boxesOverlap(b, buf[i].box)) { return true; } }
		return false;
	}

	// ---- candidates ----
	function hang(sh, px, py, side, base, leader) {
		let x, y, align;
		if (side === 'E') { x = px; y = py - sh.h0 / 2; align = 'left'; }
		else if (side === 'W') { x = px - sh.w; y = py - sh.h0 / 2; align = 'right'; }
		else if (side === 'N') { x = px - sh.w / 2; y = py - sh.h; align = 'center'; }
		else { x = px - sh.w / 2; y = py; align = 'center'; }
		return { x: x, y: y, align: align, angle: 0, sh: sh, leader: leader, base: base };
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
		if (f.kind === 'link' && f.req.layout === 'line') { linkCandidates(f, rows, rowPen, raw, t); } else { pointCandidates(f, rows, rowPen, raw, t); }
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
		const rs = Math.min(s.w, s.h) / 2, rOut = Math.max(s.w, s.h) / 2 + 2;
		const dirs = dirsFor(f, D);
		for (let d = 0; d < dirs.length; d++) {
			const ux = Math.cos(dirs[d]), uy = Math.sin(dirs[d]), side = sideFor(ux, uy);
			for (let r = t - 1; r < t; r++) {
				const dist = rOut + RG[r] * RH;
				const px = cx + ux * dist, py = cy + uy * dist;
				// One leader serves every shape and row set hung on it: judged once, kept.
				const lk = Math.round(dirs[d] * 1e4) * 64 + Math.round(RG[r] * 10);
				let L = f.lg.get(lk);
				if (L === undefined) {
					L = [[cx + ux * rs, cy + uy * rs], [px, py]];
					// ... and so does the core every shape hung there must cover: if a symbol or
					// Text sits on it, nothing hung on this leader can stand.
					let lc = leaderStatic(f, L);
					if (lc < Infinity && coreHits(G, coreBox(f, side, px, py), -1)) { lc = Infinity; }
					f.lc.set(lk, lc);
					if (lc === Infinity) { L = null; }
					f.lg.set(lk, L);
				}
				if (L === null) { continue; }
				const c = hang(sh, px, py, side, extra + distCost((dist - rs) / RH), L);
				c.lk = lk; c.side = side;
				out.push(c);
			}
		}
	}
	function linkCandidates(f, rows, rowPen, out, t) {
		const sh = shape(f, rows, 'line');
		const pt0 = { x: f.pt[0], y: f.pt[1], w: 0, h: 0 };
		if (t > 0) {
			around(f, sh, pt0, rowPen + LINK_OFF_PIPE, out, DIRS8, RINGS, t);
			if (rows.length > 1) { around(f, shape(f, rows, 'stack'), pt0, rowPen + LINK_OFF_PIPE + ALT_SHAPE, out, DIRS8, RINGS_ALT, t); }
			return out;
		}
		const P = f.link.points, ax = f.pt[0], ay = f.pt[1];
		let best = Infinity, si = 1;
		for (let i = 1; i < P.length; i++) {
			const d = distSeg(ax, ay, P[i - 1], P[i]);
			if (d < best) { best = d; si = i; }
		}
		const A = P[si - 1], B = P[si];
		let ang = Math.atan2(B[1] - A[1], B[0] - A[0]) * 180 / Math.PI;
		if (ang > 90) { ang -= 180; } else if (ang <= -90) { ang += 180; }
		const r = ang * Math.PI / 180, tx = Math.cos(r), ty = Math.sin(r), nx = Math.sin(r), ny = -Math.cos(r);
		const segLen = Math.hypot(B[0] - A[0], B[1] - A[1]);
		const ta = ((ax - A[0]) * (B[0] - A[0]) + (ay - A[1]) * (B[1] - A[1])) / (segLen * segLen || 1);
		const lo = -ta * segLen, hi = (1 - ta) * segLen;
		const dirSign = ((B[0] - A[0]) * tx + (B[1] - A[1]) * ty) >= 0 ? 1 : -1;
		const step = Math.max(10, sh.w * 0.4);
		const slides = [0, step, -step, 2 * step, -2 * step];
		const off = sh.h / 2 + GAP;
		for (let k = 0; k < slides.length; k++) {
			const sl = slides[k], along = sl * dirSign;
			if (along < lo || along > hi) { continue; }
			const qx = ax + tx * sl, qy = ay + ty * sl, pk = Math.abs(sl) / RH * 0.35;
			for (let sd = 0; sd < SIDES.length; sd++) {
				const ccx = qx + nx * off * SIDES[sd][0], ccy = qy + ny * off * SIDES[sd][0];
				out.push({ x: ccx - sh.w / 2, y: ccy - sh.h / 2, align: 'left', angle: ang, sh: sh, leader: null, base: rowPen + SIDES[sd][1] + pk });
			}
		}
		// Horizontal, beside the anchor or out on a leader from it; as one line or as a stack.
		const pt = { x: ax, y: ay, w: 0, h: 0 };
		around(f, sh, pt, rowPen + LINK_OFF_PIPE, out, DIRS8, RINGS, 0);
		if (rows.length > 1) { around(f, shape(f, rows, 'stack'), pt, rowPen + LINK_OFF_PIPE + ALT_SHAPE, out, DIRS8, RINGS_ALT, 0); }
		return out;
	}

	// Best candidate for label f among row sets k0..k1, given everything placed.
	let searchStamp = 0;
	function search(f, bound, k0, k1) {
		let best = null, bestCost = bound;
		const ss = ++searchStamp, dm = f.dm || (f.dm = new Map());
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
					const m = dm.get(c0.lk);
					if (m === ss) { continue; }
					if (m !== -ss) {
						if (coreHits(D, coreBox(f, c0.side, c0.leader[1][0], c0.leader[1][1]), f.li)) { dm.set(c0.lk, ss); continue; }
						dm.set(c0.lk, -ss);
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
	function hideCost(f) { return W.row * f.R + W.hide; }

	// ---- 1. hand-placed labels: hung at the user's point, shown whatever happens (N4) ----
	const kept = new Array(N);
	info.forEach(function (f) {
		if (!f.req.hand) { return; }
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
				return it.sym && !(it.node !== null && it.node === ownNode) && segHitsBox(px, py, qx, qy, it.box, TOL);
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
		if (kept[f.li]) { return; }
		const pl = prevPl[f.req.id];
		if (!pl || !pl.shown || !prevReq[f.req.id]) { return; }
		const c = carried(f, pl, prevReq[f.req.id]);
		if (!c) { return; }
		// The bench's own tolerance, a hair inside it: a symbol that grew by a pixel on zooming in
		// does not force a label to jump.
		tol = HELD_TOL;
		const cost = evalFull(f, c, false);
		tol = TOL;
		if (cost < Infinity) { commit(f, c, cost); kept[f.li] = 'held'; }
	});
	function carried(f, pl, r0) {
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
	function growHeld(f, any) {
		const p = placed[f.li];
		if (!p) { return; }
		const c0 = p.cand, n0 = c0.sh.rows.length;
		if (c0.align === 'center' || c0.angle) { return; }
		for (let k = 0; k < f.subsets.length; k++) {
			const rows = f.subsets[k];
			if (rows.length <= n0) { break; }
			if (!any && rows.length > n0 + 1) { continue; }
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
				leader: c0.leader, base: W.row * (f.R - rows.length) + (c0.lead || 0), lead: c0.lead };
			if (c.leader && !leaderTouches(c)) { continue; }
			const cur = placed[f.li];
			uncommit(f);
			const cost = evalFull(f, c, true);
			if (cost < cur.cost) { commit(f, c, cost); return; }
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
	const kindRank = { node: 0, text: 0, link: 1, customer: 2 };
	free.sort(function (a, b) { return (kindRank[a.kind] || 0) - (kindRank[b.kind] || 0); });
	// Pass A: every label in its smallest form, near home, so as many as possible get a place.
	free.forEach(function (f) {
		const min = f.subsets.length - 1;
		const r = search(f, hideCost(f), min, min);
		if (r) { commit(f, r.cand, r.cost); }
	});
	// Pass B: rounds in which each label may take back one row (a better place for it, given
	// the others), so the room is shared out fairly; then one round with no limit.
	let maxSets = 1;
	info.forEach(function (f) { if (f.subsets.length > maxSets) { maxSets = f.subsets.length; } });
	for (let round = 0; round < maxSets; round++) {
		const last = false;
		info.forEach(function (f) {
			if (kept[f.li] === 'hand') { return; }
			if (kept[f.li] === 'held') { growHeld(f, last); return; }
			const n = f.subsets.length, p = placed[f.li];
			const curK = p ? p.cand.k : n;
			const k0 = last ? 0 : Math.max(0, curK - 1), k1 = last ? n - 1 : Math.min(curK, n - 1);
			// Nothing near it has changed since it last looked over these row sets: nothing new to find.
			if (f.tick >= 0 && k0 >= f.k0 && k1 <= f.k1 && D.lastTouch(regionOf(f)) <= f.tick) { return; }
			f.tick = D.tick; f.k0 = k0; f.k1 = k1;
			const cur = p ? evalDyn(f, p.cand, p.cand.st, Infinity) : hideCost(f);
			const r = search(f, cur, k0, k1);
			if (r && (!p || r.cand !== p.cand)) {
				if (p) { uncommit(f); }
				commit(f, r.cand, r.cost);
				f.tick = D.tick;
			} else if (p) { p.cost = cur; }
		});
	}
	function regionOf(f) {
		if (f.region) { return f.region; }
		const R = f.req.rows;
		let wLine = 0, hStack = 0, wMax = 0;
		for (let i = 0; i < R.length; i++) { wLine += R[i].w + T.separatorW; hStack += R[i].h; wMax = Math.max(wMax, R[i].w); }
		const r = Math.max(f.sym.w, f.sym.h) / 2 + 4 + RINGS[RINGS.length - 1] * RH + 1.5 * Math.max(wLine, wMax) + hStack;
		f.region = [f.pt[0] - r, f.pt[1] - r, f.pt[0] + r, f.pt[1] + r];
		return f.region;
	}

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
if (root && root.EngCalcs) { root.EngCalcs.lpnPlacers = root.EngCalcs.lpnPlacers || {}; root.EngCalcs.lpnPlacers.a = mod; }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
