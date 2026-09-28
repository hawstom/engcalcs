// LABEL PLACER A. (write-up to come)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
(function (root) {
'use strict';

// ---- tuning ----------------------------------------------------------------------------------
const TOL = 1.0;          // our overlap tolerance in px (the bench forgives 1.5; we stay stricter)
const CS = 24;            // grid cell size, px
const MARGIN = 320;       // grid reaches this far beyond the viewport
const W = {
	row: 4,               // each value row given up
	hide: 10,             // on top of the rows, for hiding the whole label
	lblPipe: 3,           // a label on a pipe
	ldrPipe: 2,           // a leader across a pipe
	lblLdr: 7,            // a label on a leader
	ldrLdr: 9,            // a leader across a leader
	lblTextLdr: 7
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
	if (Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) <= TOL || Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) <= TOL) { return false; }
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
	if (a.hw + bu - du <= TOL) { return false; }
	if (a.hh + bv - dv <= TOL) { return false; }
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
	let t0 = 0, t1 = 1;
	const dx = bx - ax, dy = by - ay;
	const P = [-dx, dx, -dy, dy], Q = [ax + hw, hw - ax, ay + hh, hh - ay];
	for (let i = 0; i < 4; i++) {
		if (P[i] === 0) { if (Q[i] <= 0) { return false; } continue; }
		const t = Q[i] / P[i];
		if (P[i] < 0) { if (t > t1) { return false; } if (t > t0) { t0 = t; } } else { if (t < t0) { return false; } if (t < t1) { t1 = t; } }
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
function near(ax, ay, bx, by, e) { return Math.abs(ax - bx) <= e && Math.abs(ay - by) <= e && Math.hypot(ax - bx, ay - by) <= e; }

// ---- the real-estate grid: where things are, so free space can be asked about ---------------
function Grid(vp) {
	this.x0 = vp.x - MARGIN; this.y0 = vp.y - MARGIN;
	this.nx = Math.ceil((vp.w + 2 * MARGIN) / CS); this.ny = Math.ceil((vp.h + 2 * MARGIN) / CS);
	const n = this.nx * this.ny;
	this.L = [new Array(n), new Array(n), new Array(n)];   // 0 hard boxes, 1 pipe segments, 2 leader segments
	for (let k = 0; k < 3; k++) { for (let i = 0; i < n; i++) { this.L[k][i] = null; } }
	this.stamp = 1;
}
Grid.prototype.range = function (x0, y0, x1, y1) {
	let i0 = Math.floor((x0 - this.x0) / CS), i1 = Math.floor((x1 - this.x0) / CS);
	let j0 = Math.floor((y0 - this.y0) / CS), j1 = Math.floor((y1 - this.y0) / CS);
	if (i1 < 0 || j1 < 0 || i0 >= this.nx || j0 >= this.ny) { return null; }
	if (i0 < 0) { i0 = 0; } if (j0 < 0) { j0 = 0; }
	if (i1 >= this.nx) { i1 = this.nx - 1; } if (j1 >= this.ny) { j1 = this.ny - 1; }
	return [i0, i1, j0, j1];
};
Grid.prototype.addBox = function (item) {
	const b = item.box, r = this.range(b.x0, b.y0, b.x1, b.y1), L = this.L[0];
	if (!r) { return; }
	for (let j = r[2]; j <= r[3]; j++) { for (let i = r[0]; i <= r[1]; i++) { const k = j * this.nx + i; (L[k] || (L[k] = [])).push(item); } }
};
// A segment goes into exactly the cells it passes through (row band by row band).
Grid.prototype.addSeg = function (layer, item) {
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
	const G = new Grid(vp);
	const nodes = {}, links = {};
	scene.nodes.forEach(function (n) { nodes[n.id] = n; });
	scene.links.forEach(function (l, i) { links[l.id] = l; l._i = i; });

	// Static real estate: symbols and Text are hard; pipes and Text callouts are soft.
	scene.nodes.forEach(function (n) {
		const s = n.symbol;
		G.addBox({ box: rectBox(s.x, s.y, s.w, s.h), sym: true, node: n.id, lab: -1 });
	});
	scene.links.forEach(function (l) {
		(l.symbols || []).forEach(function (b) { G.addBox({ box: mkBox(b.cx, b.cy, b.w, b.h, b.angle), sym: true, node: null, link: l.id, lab: -1 }); });
		const p = l.points;
		for (let i = 1; i < p.length; i++) {
			G.addSeg(1, { ax: p[i - 1][0], ay: p[i - 1][1], bx: p[i][0], by: p[i][1], link: l._i });
		}
	});
	let ldrSeq = 0;
	scene.texts.forEach(function (t) {
		const b = t.box;
		G.addBox({ box: mkBox(b.cx, b.cy, b.w, b.h, b.angle), text: true, lab: -1 });
		const L = t.leader;
		if (L && L.length > 1) {
			const id = ldrSeq++;
			for (let i = 1; i < L.length; i++) { G.addSeg(2, { ax: L[i - 1][0], ay: L[i - 1][1], bx: L[i][0], by: L[i][1], ld: id, lab: -1 }); }
		}
	});
	const custBox = {};
	(scene.customers || []).forEach(function (c) { custBox[c.id] = c.box; });

	const reqs = scene.labels, N = reqs.length;
	const linkSeen = new Int32Array(scene.links.length), ldrSeen = [], labSeen = new Int32Array(N + 1);
	let evalStamp = 0;

	// ---- per-label facts ----
	const info = reqs.map(function (req, li) {
		const f = { req: req, li: li, kind: req.kind, pt: null, sym: null, link: null, node: null };
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

	// ---- evaluation: the cost of one candidate against everything placed so far ----
	// cand: {x, y, align, angle, sh, leader, base}. Returns Infinity when a never-rule would break.
	function evaluate(f, cand, bound, needInView) {
		let cost = cand.base;
		if (cost >= bound) { return Infinity; }
		const boxes = cand.boxes || (cand.boxes = boxesOf(cand.sh, cand.x, cand.y, cand.align, cand.angle));
		const li = f.li, ownLink = f.link ? f.link._i : -1, ownNode = f.node ? f.node.id : null;
		let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
		for (let i = 0; i < boxes.length; i++) {
			const b = boxes[i];
			if (b.x0 < bx0) { bx0 = b.x0; } if (b.y0 < by0) { by0 = b.y0; } if (b.x1 > bx1) { bx1 = b.x1; } if (b.y1 > by1) { by1 = b.y1; }
		}
		if (needInView && (bx0 < vp.x + 1 || by0 < vp.y + 1 || bx1 > vp.x + vp.w - 1 || by1 > vp.y + vp.h - 1)) { return Infinity; }
		// Hard: symbols, Text, other labels.
		for (let i = 0; i < boxes.length; i++) {
			const b = boxes[i];
			if (G.query(0, b.x0, b.y0, b.x1, b.y1, function (it) { return it.lab !== li && boxesOverlap(b, it.box); })) { return Infinity; }
		}
		const es = ++evalStamp;
		const L = cand.leader;
		if (L) {
			for (let s = 1; s < L.length; s++) {
				const px = L[s - 1][0], py = L[s - 1][1], qx = L[s][0], qy = L[s][1];
				const x0 = Math.min(px, qx), x1 = Math.max(px, qx), y0 = Math.min(py, qy), y1 = Math.max(py, qy);
				let dead = false;
				G.query(0, x0, y0, x1, y1, function (it) {
					if (it.lab === li) { return false; }
					if (it.sym) {
						if (it.node !== null && it.node === ownNode) { return false; }
						if (segHitsBox(px, py, qx, qy, it.box, TOL)) { dead = true; return true; }
					} else if (it.lab >= 0) {
						if (labSeen[it.lab] !== es && segHitsBox(px, py, qx, qy, it.box, TOL)) { labSeen[it.lab] = es; cost += W.lblLdr; }
					} else if (it.text) {
						if (segHitsBox(px, py, qx, qy, it.box, TOL)) { cost += 1; }
					}
					return false;
				});
				if (dead) { return Infinity; }
				const sx = L[0][0], sy = L[0][1];
				G.query(1, x0, y0, x1, y1, function (it) {
					if (it.link === ownLink || linkSeen[it.link] === es) { return false; }
					const c = segCross(px, py, qx, qy, it.ax, it.ay, it.bx, it.by);
					if (c && Math.hypot(c[0] - sx, c[1] - sy) > 1) { linkSeen[it.link] = es; cost += W.ldrPipe; }
					return false;
				});
				G.query(2, x0, y0, x1, y1, function (it) {
					if (it.lab === li || ldrSeen[it.ld] === es) { return false; }
					if (near(px, py, it.ax, it.ay, 1.5) || near(px, py, it.bx, it.by, 1.5) || near(qx, qy, it.ax, it.ay, 1.5) || near(qx, qy, it.bx, it.by, 1.5)) { return false; }
					if (segCross(px, py, qx, qy, it.ax, it.ay, it.bx, it.by)) { ldrSeen[it.ld] = es; cost += W.ldrLdr; }
					return false;
				});
				if (cost >= bound) { return Infinity; }
			}
		}
		// Soft: label on pipes, label on leaders.
		for (let i = 0; i < boxes.length; i++) {
			const b = boxes[i];
			G.query(1, b.x0, b.y0, b.x1, b.y1, function (it) {
				if (it.link === ownLink || linkSeen[it.link] === es) { return false; }
				if (segHitsBox(it.ax, it.ay, it.bx, it.by, b, TOL)) { linkSeen[it.link] = es; cost += W.lblPipe; }
				return false;
			});
			G.query(2, b.x0, b.y0, b.x1, b.y1, function (it) {
				if (it.lab === li || ldrSeen[it.ld] === es) { return false; }
				if (segHitsBox(it.ax, it.ay, it.bx, it.by, b, TOL)) { ldrSeen[it.ld] = es; cost += it.lab < 0 ? W.lblTextLdr : W.lblLdr; }
				return false;
			});
			if (cost >= bound) { return Infinity; }
		}
		return cost;
	}

	const placed = new Array(N);      // {cand, cost, items}
	function commit(f, cand, cost) {
		const items = [];
		const boxes = cand.boxes || (cand.boxes = boxesOf(cand.sh, cand.x, cand.y, cand.align, cand.angle));
		boxes.forEach(function (b) { const it = { box: b, lab: f.li, sym: false }; G.addBox(it); items.push(it); });
		if (cand.leader) {
			const id = ldrSeq++, L = cand.leader;
			for (let i = 1; i < L.length; i++) {
				const it = { ax: L[i - 1][0], ay: L[i - 1][1], bx: L[i][0], by: L[i][1], ld: id, lab: f.li };
				G.addSeg(2, it); items.push(it);
			}
		}
		placed[f.li] = { cand: cand, cost: cost, items: items };
	}
	function uncommit(f) {
		const p = placed[f.li];
		if (!p) { return null; }
		p.items.forEach(function (it) { it.dead = true; });
		placed[f.li] = null;
		return p;
	}

	// ---- candidates ----
	// A stack or a horizontal line hung from point P on its given side.
	function hang(f, sh, px, py, side, base, leader) {
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
	const DIRS = [];
	for (let k = 0; k < 16; k++) { DIRS.push(k * Math.PI / 8); }
	const RINGS = [0.8, 1.6, 2.6, 4.0];

	// Every candidate for one row set, cheapest-looking first is not needed: bounds prune.
	function candidatesFor(f, rows, rowPen, out) {
		const req = f.req;
		if (f.kind === 'link' && req.layout === 'line') { return linkCandidates(f, rows, rowPen, out); }
		const sh = shape(f, rows, req.layout === 'line' ? 'line' : 'stack');
		const s = f.sym, g = 1, cx = f.pt[0], cy = f.pt[1];
		const sx0 = s.x, sx1 = s.x + s.w, sy0 = s.y, sy1 = s.y + s.h;
		const w = sh.w, H = sh.h;
		const adj = [
			[sx1, sy0 - H, 'left', 0],
			[sx1 + g, cy - sh.h0 / 2, 'left', 0.1],
			[sx1, sy1, 'left', 0.15],
			[sx0 - w, sy0 - H, 'right', 0.2],
			[sx0 - g - w, cy - sh.h0 / 2, 'right', 0.25],
			[sx0 - w, sy1, 'right', 0.3],
			[cx - w / 2, sy0 - g - H, 'center', 0.35],
			[cx - w / 2, sy1 + g, 'center', 0.4],
			[sx1 + g, cy - H / 2, 'left', 0.3],
			[sx0 - g - w, cy - H / 2, 'right', 0.45]
		];
		for (let i = 0; i < adj.length; i++) {
			out.push({ x: adj[i][0], y: adj[i][1], align: adj[i][2], angle: 0, sh: sh, leader: null, base: rowPen + adj[i][3] });
		}
		// Leaders out into open ground: the widest pipe gaps first, then the compass.
		const rs = Math.min(s.w, s.h) / 2, rOut = Math.max(s.w, s.h) / 2;
		const dirs = [];
		const gl = f.node ? gaps[f.node.id] : null;
		if (gl) { for (let i = 0; i < gl.length && i < 4; i++) { if (gl[i].width > 0.5) { dirs.push(gl[i].mid); } } }
		for (let i = 0; i < DIRS.length; i++) { dirs.push(DIRS[i]); }
		for (let d = 0; d < dirs.length; d++) {
			const ux = Math.cos(dirs[d]), uy = Math.sin(dirs[d]), side = sideFor(ux, uy);
			for (let r = 0; r < RINGS.length; r++) {
				const dist = rOut + RINGS[r] * RH;
				const px = cx + ux * dist, py = cy + uy * dist;
				const L = [[cx + ux * rs, cy + uy * rs], [px, py]];
				const len = (dist - rs) / RH;
				out.push(hang(f, sh, px, py, side, rowPen + distCost(len) + (d < (gl ? gl.length : 0) ? 0 : 0.05), L));
			}
		}
		return out;
	}
	function linkCandidates(f, rows, rowPen, out) {
		const sh = shape(f, rows, 'line');
		const P = f.link.points, ax = f.pt[0], ay = f.pt[1];
		// The segment holding the anchor.
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
		// Where along the segment the anchor sits, so slides stay on the pipe.
		const ta = ((ax - A[0]) * (B[0] - A[0]) + (ay - A[1]) * (B[1] - A[1])) / (segLen * segLen || 1);
		const room = [ -ta * segLen, (1 - ta) * segLen ];   // along-offsets from the anchor to the ends (signed along A->B)
		const dirSign = ((B[0] - A[0]) * tx + (B[1] - A[1]) * ty) >= 0 ? 1 : -1;
		const step = Math.max(10, sh.w * 0.4);
		const slides = [0, step, -step, 2 * step, -2 * step];
		const off = sh.h / 2 + 1.5;
		for (let k = 0; k < slides.length; k++) {
			const sl = slides[k], along = sl * dirSign;
			if (along < room[0] || along > room[1]) { continue; }
			const qx = ax + tx * sl, qy = ay + ty * sl;
			const pk = Math.abs(sl) / RH * 0.35;
			[[1, 0], [-1, 0.15], [0, 1.5]].forEach(function (sd) {
				const ccx = qx + nx * off * sd[0], ccy = qy + ny * off * sd[0];
				out.push({ x: ccx - sh.w / 2, y: ccy - sh.h / 2, align: 'left', angle: ang, sh: sh, leader: null, base: rowPen + sd[1] + pk });
			});
		}
		// Horizontal, beside the anchor.
		const hs = { x: ax - 2, y: ay - 2, w: 4, h: 4 };
		[[hs.x + hs.w, hs.y - sh.h, 0.8], [hs.x - sh.w, hs.y - sh.h, 0.9], [hs.x + hs.w, hs.y + hs.h, 0.9], [hs.x - sh.w, hs.y + hs.h, 1.0]].forEach(function (c) {
			out.push({ x: c[0], y: c[1], align: 'left', angle: 0, sh: sh, leader: null, base: rowPen + c[2] });
		});
		// Leaders from the anchor, out to either side and round the compass.
		const dirs = [Math.atan2(ny, nx), Math.atan2(-ny, -nx)];
		for (let i = 0; i < 8; i++) { dirs.push(i * Math.PI / 4); }
		for (let d = 0; d < dirs.length; d++) {
			const ux = Math.cos(dirs[d]), uy = Math.sin(dirs[d]), side = sideFor(ux, uy);
			for (let k = 0; k < RINGS.length; k++) {
				const dist = 2 + RINGS[k] * RH;
				const px = ax + ux * dist, py = ay + uy * dist;
				out.push(hang(f, sh, px, py, side, rowPen + distCost(dist / RH) + 0.3, [[ax, ay], [px, py]]));
			}
		}
		return out;
	}
	function distSeg(px, py, a, b) {
		const vx = b[0] - a[0], vy = b[1] - a[1], L2 = vx * vx + vy * vy;
		let t = L2 ? ((px - a[0]) * vx + (py - a[1]) * vy) / L2 : 0;
		t = t < 0 ? 0 : (t > 1 ? 1 : t);
		return Math.hypot(px - a[0] - t * vx, py - a[1] - t * vy);
	}

	// Best candidate for label f, across row sets from `minSet` (fewest rows allowed) up.
	function search(f, bound, maxSets) {
		let best = null, bestCost = bound;
		const sets = f.subsets, nset = Math.min(sets.length, maxSets || sets.length);
		for (let k = 0; k < nset; k++) {
			const rowPen = W.row * (f.R - sets[k].length);
			if (rowPen >= bestCost) { break; }
			const cands = candidatesFor(f, sets[k], rowPen, []);
			cands.sort(function (a, b) { return a.base - b.base; });
			for (let i = 0; i < cands.length; i++) {
				if (cands[i].base >= bestCost) { break; }
				const c = evaluate(f, cands[i], bestCost, true);
				if (c < bestCost) { bestCost = c; best = cands[i]; }
			}
		}
		return best ? { cand: best, cost: bestCost } : null;
	}
	function hideCost(f) { return W.row * f.R + W.hide; }

	// ---- 1. hand-placed labels: hung at the user's point, shown whatever happens (N4) ----
	const hand = [], kept = new Array(N);
	info.forEach(function (f) { if (f.req.hand) { hand.push(f); } });
	hand.forEach(function (f) {
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
				const c = hang(f, sh, H[0], H[1], sides[i], W.row * (f.R - f.subsets[k].length), leader);
				if (!first) { first = c; }
				const cost = evaluate(f, c, Infinity, false);
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
	const heldOrder = info.filter(function (f) { return !kept[f.li] && prevPl[f.req.id] && prevPl[f.req.id].shown && prevReq[f.req.id]; });
	heldOrder.forEach(function (f) {
		const c = carried(f);
		if (!c) { return; }
		const cost = evaluate(f, c, Infinity, false);
		if (cost < Infinity) { commit(f, c, cost); kept[f.li] = 'held'; }
	});
	function carried(f) {
		const pl = prevPl[f.req.id], r0 = prevReq[f.req.id];
		// Rows by field, so a changed row list still maps.
		const fields = pl.rows.map(function (i) { return r0.rows[i] && r0.rows[i].field; });
		const rows = [];
		f.req.rows.forEach(function (r, i) { if (fields.indexOf(r.field) >= 0) { rows.push(i); } });
		if (!rows.length) { return null; }
		const dx = f.req.anchor.x - r0.anchor.x, dy = f.req.anchor.y - r0.anchor.y;
		const layout = pl.layout || f.req.layout;
		const sh = shape(f, rows, layout);
		const old = shape(f, rows, layout);
		const x = pl.x + dx, y = pl.y + dy;
		const leader = pl.leader ? pl.leader.map(function (p) { return [p[0] + dx, p[1] + dy]; }) : null;
		if (leader && f.link && distToLink(leader[0], f.link) > 0.8) { return null; }
		const c = { x: x, y: y, align: pl.align || 'left', angle: pl.angle || 0, sh: sh, leader: leader,
			base: W.row * (f.R - rows.length) + (leader ? distCost(Math.hypot(leader[1][0] - leader[0][0], leader[1][1] - leader[0][1]) / RH) : 0) };
		void old;
		return c;
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
		const c0 = p.cand, sets = f.subsets;
		if (c0.align === 'center' && c0.sh.layout !== 'line') { return; }
		for (let k = 0; k < sets.length; k++) {
			if (sets[k].length <= c0.sh.rows.length) { break; }
			if (!containsAll(sets[k], c0.sh.rows)) { continue; }
			const sh = shape(f, sets[k], c0.sh.layout);
			const x = c0.align === 'right' ? c0.x + c0.sh.w - sh.w : c0.x;
			const c = { x: x, y: c0.y, align: c0.align, angle: c0.angle, sh: sh, leader: c0.leader,
				base: W.row * (f.R - sets[k].length) + (c0.base - W.row * (f.R - c0.sh.rows.length)) };
			if (c0.angle && c0.sh.layout === 'line') { continue; }
			if (c.leader && !leaderTouches(c)) { continue; }
			uncommit(f);
			const cost = evaluate(f, c, Infinity, false);
			if (cost < Infinity && cost < p.cost + 0.001) { commit(f, c, cost); return; }
			commit(f, c0, p.cost);
			p.items = placed[f.li].items;
		}
	}
	function containsAll(a, b) { for (let i = 0; i < b.length; i++) { if (a.indexOf(b[i]) < 0) { return false; } } return true; }
	function leaderTouches(c) {
		const e = c.leader[c.leader.length - 1];
		const bs = boxesOf(c.sh, c.x, c.y, c.align, c.angle);
		return bs.some(function (b) {
			return Math.max(0, Math.abs(e[0] - b.cx) - b.hw) <= 1 && Math.max(0, Math.abs(e[1] - b.cy) - b.hh) <= 1;
		});
	}

	// ---- 3. everything else: labels first, then properties ----
	const free = info.filter(function (f) { return !kept[f.li]; });
	const kindRank = { node: 0, link: 1, text: 0, customer: 2 };
	free.sort(function (a, b) { return (kindRank[a.kind] || 0) - (kindRank[b.kind] || 0); });
	// Pass A: every label in its smallest form, near home, so as many as possible get a place.
	free.forEach(function (f) {
		const min = f.subsets.length - 1;
		const r = searchSets(f, hideCost(f), min, min);
		if (r) { commit(f, r.cand, r.cost); }
	});
	function searchSets(f, bound, k0, k1) {
		let best = null, bestCost = bound;
		for (let k = k0; k <= k1; k++) {
			const rowPen = W.row * (f.R - f.subsets[k].length);
			if (rowPen >= bestCost) { continue; }
			const cands = candidatesFor(f, f.subsets[k], rowPen, []);
			cands.sort(function (a, b) { return a.base - b.base; });
			for (let i = 0; i < cands.length; i++) {
				if (cands[i].base >= bestCost) { break; }
				const c = evaluate(f, cands[i], bestCost, true);
				if (c < bestCost) { bestCost = c; best = cands[i]; }
			}
		}
		return best ? { cand: best, cost: bestCost } : null;
	}
	// Pass B: each label in turn looks for a better place with more rows, given the others.
	for (let round = 0; round < 2; round++) {
		info.forEach(function (f) {
			if (kept[f.li] === 'hand') { return; }
			if (kept[f.li] === 'held') { growHeld(f); return; }
			const p = uncommit(f);
			let cur = hideCost(f), curCand = null;
			if (p) { cur = evaluate(f, p.cand, Infinity, true); curCand = p.cand; if (cur === Infinity) { cur = hideCost(f); curCand = null; } }
			const r = searchSets(f, cur, 0, f.subsets.length - 1);
			if (r) { commit(f, r.cand, r.cost); } else if (curCand) { commit(f, curCand, cur); }
		});
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
