// lpn-contour.js -- THE CONTOUR PLOT's pure half (ROADMAP Task 600).
//
// Copyright 2009 Thomas Gail Haws. Licensed under GNU GPL v3.0 or later.
//
// Split from js/looped-network.js by PURITY, the rule js/lpn-geom.js states: points, values and
// numbers in, grids, polylines and numbers out. No DOM, no `doc`, no settings, no units. The page
// decides which links carry a value, which links are barriers and what colour a value is; this
// file answers the geometry. dev/lpn-spike/contour-harness.js drives every function here in Node.
//
// THE DESIGN IS dev/epanet-js-contour-contribution.md (§2, §2a and §2b), and the choices are these:
//
//   1. **FROM A LINK, NOT FROM THE NETWORK** (Tom, 2026-10-03: *"Instead of 'from the network',
//      maybe the expression, logic, and algorithm should be 'from a link'. Every link has contours
//      along it"*). A value is known all along every open pipe, linear between its two end nodes by
//      length; a point near the network takes a weighted average of the pipes around it (Franke
//      and Nielson's modified Shepard weight, ((R - d) / (R d))^2, which is the pipe's own value on
//      the pipe and falls smoothly to nothing at R). A weighted average of node values never
//      invents a value outside their range: no bull's-eye, no overshoot.
//   2. **COLOUR ONLY ALONGSIDE A PIPE.** A point is coloured iff it lies within R of some pipe, R a
//      generous multiple of the median pipe length; the union of those corridors fills a loop of
//      ordinary size and leaves a river or an empty parcel between two arms of the network bare.
//      The colour fades out over the outer part of the corridor rather than stopping at a line.
//   3. **A PUMP OR A VALVE IS A WALL** (Tom: *"It should stop. There should be a clear discontinuity
//      and a break line like at a retaining wall."*). Pipes in different ZONES (no open pipe joins
//      them) are never averaged together: a point takes the zone of its nearest pipe, so the colour
//      jumps where the two zones are equally near, and zoneBreaks() traces that line. A barrier
//      whose two sides are still one zone (a booster pump inside a loop) carries a FAULT instead, a
//      line across the corridor at its midpoint through which no pipe is seen: ITRC's fault, the
//      line "across which the interpolation model does not exchange information".
//   4. **WITH A GROUND SURFACE, PRESSURE MAY LEAVE THE NODES' RANGE**, on purpose (§2a, Luke
//      Butler's proof of concept): head is the field interpolated, and the page subtracts the ground
//      per cell.

(function (root) {
	'use strict';

	var EC = root.EngCalcs = root.EngCalcs || {};

	// ============================================================================================
	// ZONES -- which nodes are joined into one continuous head field. `links` is [[i, j], ...] of
	// node INDICES, and the caller passes only the links that join (open pipes); everything else
	// it leaves out is a barrier. Returns an Int32Array of a zone label per node.
	// ============================================================================================
	function zones(n, links) {
		var parent = new Int32Array(n), i;
		for (i = 0; i < n; i++) { parent[i] = i; }
		function find(a) { while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a]; } return a; }
		(links || []).forEach(function (l) {
			var a = l[0], b = l[1];
			if (!(a >= 0 && a < n && b >= 0 && b < n)) { return; }
			var ra = find(a), rb = find(b);
			if (ra !== rb) { parent[ra] = rb; }
		});
		var out = new Int32Array(n);
		for (i = 0; i < n; i++) { out[i] = find(i); }
		return out;
	}

	// The median of a list of positive lengths, or 0 for none. The corridor's reach is a multiple
	// of the median pipe length as drawn: a length an engineer can read off the map, and one that
	// scales with the network rather than with the drawing's units.
	function median(list) {
		var a = (list || []).filter(function (v) { return typeof v === 'number' && isFinite(v) && v > 0; })
			.sort(function (p, q) { return p - q; });
		if (!a.length) { return 0; }
		var m = a.length >> 1;
		return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
	}

	// ============================================================================================
	// THE DATA SEGMENTS. `list` is [{x0, y0, x1, y1, v0, v1, zone}]: one straight piece of an open
	// pipe and its value at each end (the page splits a bent pipe at its vertices, the value linear
	// in length along the whole pipe). A zero-length piece is a lone node. Packed into typed arrays.
	// ============================================================================================
	function segmentSet(list) {
		var n = list.length, S = {
			n: n, x0: new Float64Array(n), y0: new Float64Array(n), x1: new Float64Array(n), y1: new Float64Array(n),
			v0: new Float64Array(n), v1: new Float64Array(n), zone: new Int32Array(n)
		}, i;
		for (i = 0; i < n; i++) {
			var s = list[i];
			S.x0[i] = s.x0; S.y0[i] = s.y0; S.x1[i] = s.x1; S.y1[i] = s.y1;
			S.v0[i] = s.v0; S.v1[i] = s.v1; S.zone[i] = s.zone | 0;
		}
		return S;
	}

	// THE FAULT AT A BARRIER LINK: a straight line across the corridor at the midpoint of the link
	// (by length, along its own vertices), perpendicular to the link there, reaching `half` each
	// side. `pts` is the link's polyline [{x, y}, ...]. Returns {x0, y0, x1, y1, mx, my} or null.
	function faultAcross(pts, half) {
		var L = 0, i, seg = [];
		for (i = 0; i + 1 < pts.length; i++) {
			var d = Math.sqrt(Math.pow(pts[i + 1].x - pts[i].x, 2) + Math.pow(pts[i + 1].y - pts[i].y, 2));
			seg.push(d); L += d;
		}
		if (!(L > 0) || !(half > 0)) { return null; }
		var want = L / 2, run = 0;
		for (i = 0; i < seg.length; i++) {
			if (run + seg[i] >= want && seg[i] > 0) {
				var f = (want - run) / seg[i], a = pts[i], b = pts[i + 1];
				var mx = a.x + f * (b.x - a.x), my = a.y + f * (b.y - a.y);
				var ux = (b.x - a.x) / seg[i], uy = (b.y - a.y) / seg[i];
				// The normal: the link turned a quarter.
				return { x0: mx - uy * half, y0: my + ux * half, x1: mx + uy * half, y1: my - ux * half, mx: mx, my: my };
			}
			run += seg[i];
		}
		return null;
	}

	// ============================================================================================
	// THE GRID: the bounding box of the segments grown by R, square cells, `long` of them on the
	// longer side. Cell (i, j) is centred at (x0 + (i + 0.5) dx, y0 + (j + 0.5) dy) and stored at
	// j * nx + i, so row j runs the same way as the drawing's y.
	// ============================================================================================
	function gridAround(S, R, long) {
		var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity, i;
		for (i = 0; i < S.n; i++) {
			minX = Math.min(minX, S.x0[i], S.x1[i]); maxX = Math.max(maxX, S.x0[i], S.x1[i]);
			minY = Math.min(minY, S.y0[i], S.y1[i]); maxY = Math.max(maxY, S.y0[i], S.y1[i]);
		}
		if (!isFinite(minX) || !(R > 0)) { return null; }
		minX -= R; minY -= R; maxX += R; maxY += R;
		var w = maxX - minX, h = maxY - minY, cell = Math.max(w, h) / (long || 512);
		var nx = Math.max(2, Math.ceil(w / cell)), ny = Math.max(2, Math.ceil(h / cell));
		return { x0: minX, y0: minY, dx: cell, dy: cell, nx: nx, ny: ny };
	}

	// A bucket index over items with bounding boxes, buckets `size` square: every item is filed in
	// every bucket its box grown by `grow` touches, so ONE bucket lookup finds everything within
	// `grow` of a point. Compressed rows: start[b]..start[b+1] in `items`.
	function bucketIndex(n, boxOf, grid, size, grow) {
		var bnx = Math.max(1, Math.ceil(grid.nx * grid.dx / size) + 1), bny = Math.max(1, Math.ceil(grid.ny * grid.dy / size) + 1);
		var count = new Int32Array(bnx * bny + 1), i, bx, by, box = [0, 0, 0, 0], ranges = [];
		for (i = 0; i < n; i++) {
			boxOf(i, box);
			var r = [Math.max(0, Math.floor((box[0] - grow - grid.x0) / size)), Math.min(bnx - 1, Math.floor((box[2] + grow - grid.x0) / size)),
				Math.max(0, Math.floor((box[1] - grow - grid.y0) / size)), Math.min(bny - 1, Math.floor((box[3] + grow - grid.y0) / size))];
			ranges.push(r);
			for (by = r[2]; by <= r[3]; by++) { for (bx = r[0]; bx <= r[1]; bx++) { count[by * bnx + bx + 1]++; } }
		}
		for (i = 1; i < count.length; i++) { count[i] += count[i - 1]; }
		var items = new Int32Array(count[count.length - 1]), fill = count.slice(0, count.length - 1);
		for (i = 0; i < n; i++) {
			var q = ranges[i];
			for (by = q[2]; by <= q[3]; by++) { for (bx = q[0]; bx <= q[1]; bx++) { items[fill[by * bnx + bx]++] = i; } }
		}
		return { start: count, items: items, nx: bnx, ny: bny, size: size };
	}
	function bucketOf(B, grid, x, y) {
		var bx = Math.floor((x - grid.x0) / B.size), by = Math.floor((y - grid.y0) / B.size);
		if (bx < 0 || by < 0 || bx >= B.nx || by >= B.ny) { return -1; }
		return by * B.nx + bx;
	}

	// Do segments PQ and AB cross (touching counts)?
	function crosses(px, py, qx, qy, ax, ay, bx, by) {
		var d1 = (bx - ax) * (py - ay) - (by - ay) * (px - ax);
		var d2 = (bx - ax) * (qy - ay) - (by - ay) * (qx - ax);
		var d3 = (qx - px) * (ay - py) - (qy - py) * (ax - px);
		var d4 = (qx - px) * (by - py) - (qy - py) * (bx - px);
		if (d1 === 0 && d2 === 0) { return false; }
		return ((d1 > 0) !== (d2 > 0) || d1 === 0 || d2 === 0) && ((d3 > 0) !== (d4 > 0) || d3 === 0 || d4 === 0);
	}

	// ============================================================================================
	// THE FIELD -- at the centre of every cell: the value, how strongly it is coloured (1 inside the
	// corridor, fading to 0 over its outer `fade` fraction, 0 beyond R), and the zone it belongs to.
	//
	//   S       segmentSet()
	//   F       [{x0, y0, x1, y1}] faults, or []
	//   grid    gridAround()
	//   R       the corridor's reach, in drawing units
	//   opts    {fade: 0.4}
	//
	// Returns {val: Float64Array (NaN where uncoloured), alpha: Float32Array, zone: Int32Array (-1),
	// cut: Uint8Array (1 where a fault runs through the square whose lower corner is that cell),
	// edge: Float32Array (how much nearer the cell's own zone is than any other, capped at R)}.
	// ============================================================================================
	function corridorField(S, F, grid, R, opts) {
		var nx = grid.nx, ny = grid.ny, N = nx * ny, fade = (opts && opts.fade >= 0) ? opts.fade : 0.4;
		var val = new Float64Array(N), alpha = new Float32Array(N), zone = new Int32Array(N), cut = new Uint8Array(N);
		var edge = new Float32Array(N), faults = F || [], i, j, k, b;
		var SB = bucketIndex(S.n, function (s, bx) {
			bx[0] = Math.min(S.x0[s], S.x1[s]); bx[1] = Math.min(S.y0[s], S.y1[s]);
			bx[2] = Math.max(S.x0[s], S.x1[s]); bx[3] = Math.max(S.y0[s], S.y1[s]);
		}, grid, R, R);
		var FB = bucketIndex(faults.length, function (f, bx) {
			var q = faults[f];
			bx[0] = Math.min(q.x0, q.x1); bx[1] = Math.min(q.y0, q.y1); bx[2] = Math.max(q.x0, q.x1); bx[3] = Math.max(q.y0, q.y1);
		}, grid, R, R);
		// Scratch per cell, sized for the most crowded bucket.
		var most = 0;
		for (b = 0; b + 1 < SB.start.length; b++) { most = Math.max(most, SB.start[b + 1] - SB.start[b]); }
		var cd = new Float64Array(most), cv = new Float64Array(most), cz = new Int32Array(most);
		var R2 = R * R, inner = R * (1 - fade), tiny = 1e-9 * R;
		for (j = 0; j < ny; j++) {
			var y = grid.y0 + (j + 0.5) * grid.dy;
			for (i = 0; i < nx; i++) {
				var x = grid.x0 + (i + 0.5) * grid.dx, c = j * nx + i;
				val[c] = NaN; zone[c] = -1;
				b = bucketOf(SB, grid, x, y);
				if (b < 0) { continue; }
				var m = 0, fb = bucketOf(FB, grid, x, y), f0 = fb >= 0 ? FB.start[fb] : 0, f1 = fb >= 0 ? FB.start[fb + 1] : 0;
				for (k = SB.start[b]; k < SB.start[b + 1]; k++) {
					var s = SB.items[k], ex = S.x1[s] - S.x0[s], ey = S.y1[s] - S.y0[s], L2 = ex * ex + ey * ey;
					var t0 = L2 > 0 ? ((x - S.x0[s]) * ex + (y - S.y0[s]) * ey) / L2 : 0;
					// THE WALL: only the part of a pipe on this side of a fault is seen. Its nearest
					// point may lie through a fault while the rest of it is in plain view (a pipe the
					// fault cuts across), so the visible part is narrowed and its own nearest point
					// taken, rather than the whole pipe dropped: dropping it left a bare hole with a
					// ragged edge beside Net3's pump 335 when the pump was off (Tom, 2026-10-03).
					var tlo = 0, thi = 1, tries = 0, seen = false, t, px, py, d2;
					for (;;) {
						t = t0 < tlo ? tlo : (t0 > thi ? thi : t0);
						px = S.x0[s] + t * ex; py = S.y0[s] + t * ey; d2 = (x - px) * (x - px) + (y - py) * (y - py);
						if (d2 >= R2) { break; }
						var block = null, q;
						for (q = f0; q < f1 && !block; q++) {
							var fl = faults[FB.items[q]];
							if (crosses(x, y, px, py, fl.x0, fl.y0, fl.x1, fl.y1)) { block = fl; }
						}
						if (!block) { seen = true; break; }
						if (++tries > 4 || !(L2 > 0)) { break; }
						// Where the pipe crosses the fault's line, and which end of it is on this side.
						var gx = block.x1 - block.x0, gy = block.y1 - block.y0;
						var sA = gx * (S.y0[s] - block.y0) - gy * (S.x0[s] - block.x0), sB = gx * (S.y1[s] - block.y0) - gy * (S.x1[s] - block.x0);
						var sC = gx * (y - block.y0) - gy * (x - block.x0);
						if ((sA > 0) === (sB > 0) || sA === sB || sC === 0) { break; }
						var tc = sA / (sA - sB), eps = 1e-9;
						if ((sC > 0) === (sA > 0)) { thi = Math.min(thi, tc - eps); } else { tlo = Math.max(tlo, tc + eps); }
						if (!(tlo <= thi)) { break; }
					}
					if (!seen) { continue; }
					cd[m] = Math.sqrt(d2); cv[m] = S.v0[s] + t * (S.v1[s] - S.v0[s]); cz[m] = S.zone[s]; m++;
				}
				if (!m) { continue; }
				// The nearest pipe decides the zone; only that zone's pipes are averaged.
				var best = 0;
				for (k = 1; k < m; k++) { if (cd[k] < cd[best]) { best = k; } }
				var z = cz[best], d1 = cd[best], dOther = R;
				for (k = 0; k < m; k++) { if (cz[k] !== z && cd[k] < dOther) { dOther = cd[k]; } }
				edge[c] = dOther - d1;
				if (d1 <= tiny) {
					val[c] = cv[best];
				} else {
					var sw = 0, sv = 0;
					for (k = 0; k < m; k++) {
						if (cz[k] !== z) { continue; }
						var d = cd[k] > tiny ? cd[k] : tiny, w = (R - d) / (R * d);
						w *= w; sw += w; sv += w * cv[k];
					}
					val[c] = sv / sw;
				}
				zone[c] = z;
				if (d1 <= inner) { alpha[c] = 1; }
				else { var u = (R - d1) / (R - inner); alpha[c] = u * u * (3 - 2 * u); }
			}
		}
		// THE SQUARES A FAULT RUNS THROUGH, so no contour line is drawn along the jump. Sampled at a
		// quarter of a cell, so no square it crosses is missed.
		faults.forEach(function (fl) {
			var len = Math.sqrt(Math.pow(fl.x1 - fl.x0, 2) + Math.pow(fl.y1 - fl.y0, 2)), steps = Math.max(2, Math.ceil(4 * len / grid.dx)), st;
			for (st = 0; st <= steps; st++) {
				var fx = fl.x0 + (fl.x1 - fl.x0) * st / steps, fy = fl.y0 + (fl.y1 - fl.y0) * st / steps;
				var si = Math.floor((fx - grid.x0) / grid.dx - 0.5), sj = Math.floor((fy - grid.y0) / grid.dy - 0.5);
				if (si >= 0 && sj >= 0 && si < nx && sj < ny) { cut[sj * nx + si] = 1; }
			}
		});
		return { val: val, alpha: alpha, zone: zone, cut: cut, edge: edge };
	}

	// The field's value at an arbitrary point, by bilinear interpolation of the four cell centres
	// round it, or NaN where any of them is uncoloured. For a harness, and for checking a label.
	function sampleField(vals, grid, x, y) {
		var fx = (x - grid.x0) / grid.dx - 0.5, fy = (y - grid.y0) / grid.dy - 0.5;
		var i = Math.floor(fx), j = Math.floor(fy);
		if (i < 0 || j < 0 || i + 1 >= grid.nx || j + 1 >= grid.ny) { return NaN; }
		var u = fx - i, v = fy - j, nx = grid.nx;
		var a = vals[j * nx + i], b = vals[j * nx + i + 1], c = vals[(j + 1) * nx + i], d = vals[(j + 1) * nx + i + 1];
		return (1 - v) * ((1 - u) * a + u * b) + v * ((1 - u) * c + u * d);
	}
	// The cell a point falls in, or -1.
	function cellAt(grid, x, y) {
		var i = Math.floor((x - grid.x0) / grid.dx), j = Math.floor((y - grid.y0) / grid.dy);
		if (i < 0 || j < 0 || i >= grid.nx || j >= grid.ny) { return -1; }
		return j * grid.nx + i;
	}

	// ============================================================================================
	// CONTOUR LINES -- marching squares over the cell centres, then joined into polylines and
	// smoothed. A square is used only when its four corners are coloured at least `minAlpha`, all
	// in one zone, and no fault runs through it, so a line never crosses a wall or runs out over
	// bare map. Returns one entry per level: [{pts: [x0, y0, x1, y1, ...], closed: bool}, ...].
	// ============================================================================================
	function contourLines(field, grid, levels, opts) {
		var nx = grid.nx, ny = grid.ny, V = field.val, A = field.alpha, Z = field.zone, CUT = field.cut;
		var minAlpha = (opts && opts.minAlpha >= 0) ? opts.minAlpha : 0.35, smooth = (opts && opts.smooth >= 0) ? opts.smooth : 2;
		var out = [], li, i, j;
		// The crossing on one edge, computed ONE way whichever square asks, so two squares sharing
		// an edge produce bit-identical points and the join below can match them by key.
		function crossing(p, q, L) {
			var f = (L - V[p]) / (V[q] - V[p]);
			var pi = p % nx, pj = (p - pi) / nx, qi = q % nx, qj = (q - qi) / nx;
			return [grid.x0 + (pi + 0.5 + f * (qi - pi)) * grid.dx, grid.y0 + (pj + 0.5 + f * (qj - pj)) * grid.dy];
		}
		var usable = new Uint8Array(nx * ny);
		for (j = 0; j + 1 < ny; j++) {
			for (i = 0; i + 1 < nx; i++) {
				var a = j * nx + i, b = a + 1, c = a + nx + 1, d = a + nx;
				if (CUT && CUT[a]) { continue; }
				if (!(A[a] >= minAlpha && A[b] >= minAlpha && A[c] >= minAlpha && A[d] >= minAlpha)) { continue; }
				if (Z[a] !== Z[b] || Z[a] !== Z[c] || Z[a] !== Z[d]) { continue; }
				if (!isFinite(V[a]) || !isFinite(V[b]) || !isFinite(V[c]) || !isFinite(V[d])) { continue; }
				usable[a] = 1;
			}
		}
		for (li = 0; li < levels.length; li++) {
			var L = levels[li], segs = [];
			for (j = 0; j + 1 < ny; j++) {
				for (i = 0; i + 1 < nx; i++) {
					var p0 = j * nx + i;
					if (!usable[p0]) { continue; }
					// Corners round the square, and the edge after each with its key: bottom 2*a,
					// right 2*b+1, top 2*d, left 2*a+1 (a horizontal edge keyed by its left cell, a
					// vertical one by its lower cell).
					var cs = [p0, p0 + 1, p0 + nx + 1, p0 + nx];
					var keys = [2 * p0, 2 * (p0 + 1) + 1, 2 * (p0 + nx), 2 * p0 + 1];
					var hits = [], e;
					for (e = 0; e < 4; e++) {
						var p = cs[e], q = cs[(e + 1) % 4];
						if ((V[p] < L) !== (V[q] < L)) {
							hits.push({ k: keys[e], pt: crossing(p < q ? p : q, p < q ? q : p, L) });
						}
					}
					if (hits.length === 2) { segs.push(hits[0], hits[1]); }
					else if (hits.length === 4) {
						// A saddle: pair by which side the centre falls on.
						var centreAbove = (V[cs[0]] + V[cs[1]] + V[cs[2]] + V[cs[3]]) / 4 >= L, aAbove = V[cs[0]] >= L;
						if (centreAbove === aAbove) { segs.push(hits[0], hits[1], hits[2], hits[3]); }
						else { segs.push(hits[0], hits[3], hits[1], hits[2]); }
					}
				}
			}
			out.push(joinSegments(segs).map(function (pl) { return smoothLine(pl, smooth); }));
		}
		return out;
	}

	// Pairs of {k, pt} (each consecutive pair one segment) into polylines, by shared edge key.
	function joinSegments(segs) {
		var n = segs.length / 2, byKey = {}, used = new Uint8Array(n), s, out = [];
		for (s = 0; s < n; s++) {
			(byKey[segs[2 * s].k] = byKey[segs[2 * s].k] || []).push(s);
			(byKey[segs[2 * s + 1].k] = byKey[segs[2 * s + 1].k] || []).push(s);
		}
		function other(t, k) { return segs[2 * t].k === k ? segs[2 * t + 1] : segs[2 * t]; }
		function nextFrom(k) {
			var list = byKey[k] || [], i;
			for (i = 0; i < list.length; i++) { if (!used[list[i]]) { return list[i]; } }
			return -1;
		}
		// Walk from segment t, entering through end `enter`; returns the points after `enter`.
		function walk(t, enter) {
			var pts = [], cur = t, ent = enter;
			for (;;) {
				used[cur] = 1;
				var ex = other(cur, ent.k);
				pts.push(ex);
				var nx2 = nextFrom(ex.k);
				if (nx2 < 0) { return pts; }
				cur = nx2; ent = ex;
			}
		}
		for (s = 0; s < n; s++) {
			if (used[s]) { continue; }
			var A0 = segs[2 * s], fwd = walk(s, A0), back = [];
			var closed = fwd[fwd.length - 1].k === A0.k;
			if (!closed) {
				var t2 = nextFrom(A0.k);
				if (t2 >= 0) { back = walk(t2, A0).reverse(); }
			}
			var all = back.concat([A0], fwd), flat = [];
			if (closed) { all.pop(); }
			all.forEach(function (h) { flat.push(h.pt[0], h.pt[1]); });
			if (flat.length >= 4) { out.push({ pts: flat, closed: closed }); }
		}
		return out;
	}

	// ============================================================================================
	// THE ZONE BOUNDARIES -- where the colour jumps from one zone to the next: the line on which a
	// cell is as near one zone's pipes as the other's, traced by marching squares over `edge` with
	// its sign taken from the zone, wherever both sides are coloured at least `minAlpha`. A square
	// touching three zones is left out. Returns polylines [{pts, closed}], smoothed.
	// ============================================================================================
	function zoneBreaks(field, grid, opts) {
		var nx = grid.nx, ny = grid.ny, A = field.alpha, Z = field.zone, E = field.edge, i, j, segs = [];
		var minAlpha = (opts && opts.minAlpha >= 0) ? opts.minAlpha : 0.2, smooth = (opts && opts.smooth >= 0) ? opts.smooth : 2;
		function crossing(p, q) {
			var f = E[p] / ((E[p] + E[q]) || 1);
			var pi = p % nx, pj = (p - pi) / nx, qi = q % nx, qj = (q - qi) / nx;
			return [grid.x0 + (pi + 0.5 + f * (qi - pi)) * grid.dx, grid.y0 + (pj + 0.5 + f * (qj - pj)) * grid.dy];
		}
		for (j = 0; j + 1 < ny; j++) {
			for (i = 0; i + 1 < nx; i++) {
				var p0 = j * nx + i, cs = [p0, p0 + 1, p0 + nx + 1, p0 + nx], e, ok = true, za = Z[p0], zb = -1;
				for (e = 0; e < 4; e++) {
					var zc = Z[cs[e]];
					if (!(A[cs[e]] >= minAlpha) || zc < 0) { ok = false; break; }
					if (zc !== za) { if (zb < 0) { zb = zc; } else if (zc !== zb) { ok = false; break; } }
				}
				if (!ok || zb < 0) { continue; }
				var keys = [2 * p0, 2 * (p0 + 1) + 1, 2 * (p0 + nx), 2 * p0 + 1], hits = [];
				for (e = 0; e < 4; e++) {
					var p = cs[e], q = cs[(e + 1) % 4];
					if (Z[p] !== Z[q]) { hits.push({ k: keys[e], pt: crossing(p < q ? p : q, p < q ? q : p) }); }
				}
				if (hits.length === 2) { segs.push(hits[0], hits[1]); }
				else if (hits.length === 4) {
					// Diagonal corners share a zone: the pair holding the larger margin stays joined.
					if (E[cs[0]] + E[cs[2]] >= E[cs[1]] + E[cs[3]]) { segs.push(hits[0], hits[1], hits[2], hits[3]); }
					else { segs.push(hits[0], hits[3], hits[1], hits[2]); }
				}
			}
		}
		return joinSegments(segs).map(function (pl) { return smoothLine(pl, smooth); });
	}

	// ============================================================================================
	// A BREAK LINE IS A RETAINING WALL AT ITS PUMP OR VALVE: it crosses the corridor there and no
	// further (Tom, 2026-10-03: *"its length should match our buffer width"*). `polys` are
	// [{pts, closed}] or flat arrays, `guides` the barrier links as polylines [[{x, y}, ...]], and
	// what is kept is every stretch within `reach` of some guide, each cut where it leaves.
	// Returns flat arrays.
	// ============================================================================================
	function distToPolyline(x, y, pl) {
		var best = Infinity, i;
		for (i = 0; i + 1 < pl.length || (i === 0 && pl.length === 1); i++) {
			var a = pl[i], b = pl[i + 1] || pl[i], ex = b.x - a.x, ey = b.y - a.y, L2 = ex * ex + ey * ey;
			var t = L2 > 0 ? ((x - a.x) * ex + (y - a.y) * ey) / L2 : 0;
			if (t < 0) { t = 0; } else if (t > 1) { t = 1; }
			var dx = x - a.x - t * ex, dy = y - a.y - t * ey, d = Math.sqrt(dx * dx + dy * dy);
			if (d < best) { best = d; }
		}
		return best;
	}
	function clipNear(polys, guides, reach) {
		var out = [];
		function near(x, y) {
			for (var g = 0; g < guides.length; g++) { if (distToPolyline(x, y, guides[g]) <= reach) { return true; } }
			return false;
		}
		// The point on a -> b where it crosses the reach, by halving: `inA` says which end is in.
		function edgePoint(ax, ay, bx, by, inA) {
			var lo = 0, hi = 1, it;
			for (it = 0; it < 30; it++) {
				var mid = (lo + hi) / 2, isIn = near(ax + mid * (bx - ax), ay + mid * (by - ay));
				if (isIn === inA) { lo = mid; } else { hi = mid; }
			}
			var f = inA ? lo : hi;
			return [ax + f * (bx - ax), ay + f * (by - ay)];
		}
		(polys || []).forEach(function (pl) {
			var p = pl.pts || pl, closed = pl.pts ? pl.closed : false, n = p.length / 2, i;
			if (n < 2) { return; }
			var q = p.slice();
			if (closed) { q.push(p[0], p[1]); n++; }
			var cur = null;
			for (i = 0; i < n; i++) {
				var x = q[2 * i], y = q[2 * i + 1], isIn = near(x, y);
				if (isIn) {
					if (!cur) { cur = []; if (i > 0) { var e0 = edgePoint(q[2 * i - 2], q[2 * i - 1], x, y, false); cur.push(e0[0], e0[1]); } }
					cur.push(x, y);
				} else if (cur) {
					var e1 = edgePoint(q[2 * i - 2], q[2 * i - 1], x, y, true);
					cur.push(e1[0], e1[1]);
					if (cur.length >= 4) { out.push(cur); }
					cur = null;
				}
			}
			if (cur && cur.length >= 4) { out.push(cur); }
		});
		return out;
	}

	// Chaikin's corner cutting, `iters` times: each pass replaces every corner with two points a
	// quarter and three quarters along its edges. An open line keeps its two ends exactly, so a
	// line still stops where the corridor or a wall stops it.
	function smoothLine(pl, iters) {
		var pts = pl.pts, closed = pl.closed, it;
		for (it = 0; it < (iters || 0); it++) {
			var n = pts.length / 2, out = [], i;
			if (n < 3) { break; }
			var last = closed ? n : n - 1;
			for (i = 0; i < last; i++) {
				var ax = pts[2 * i], ay = pts[2 * i + 1], bx = pts[2 * ((i + 1) % n)], by = pts[2 * ((i + 1) % n) + 1];
				out.push(0.75 * ax + 0.25 * bx, 0.75 * ay + 0.25 * by, 0.25 * ax + 0.75 * bx, 0.25 * ay + 0.75 * by);
			}
			if (!closed) {
				// The first and last cut points give way to the true ends.
				out[0] = pts[0]; out[1] = pts[1];
				out[out.length - 2] = pts[2 * (n - 1)]; out[out.length - 1] = pts[2 * (n - 1) + 1];
			}
			pts = out;
		}
		return { pts: pts, closed: closed };
	}

	// ============================================================================================
	// LEVELS -- every multiple of `step` inside [lo, hi], or null if there would be more than `cap`.
	// ============================================================================================
	function levelsFor(lo, hi, step, cap) {
		if (!(step > 0) || !isFinite(lo) || !isFinite(hi)) { return []; }
		var k0 = Math.ceil(lo / step - 1e-9), k1 = Math.floor(hi / step + 1e-9), out = [], k;
		if (k1 - k0 + 1 > (cap || 200)) { return null; }
		for (k = k0; k <= k1; k++) { out.push(+(k * step).toPrecision(12)); }
		return out;
	}
	// A round step giving about `target` lines over [lo, hi]: 1, 2 or 5 times a power of ten.
	function niceStep(lo, hi, target) {
		var span = hi - lo;
		if (!(span > 0)) { return 1; }
		var raw = span / (target || 10), p = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), m = raw / p;
		return +((m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p).toPrecision(12);
	}
	// A level as the label prints it: as many decimals as the step needs, and no more.
	function levelText(v, step) {
		var dec = 0, s = step;
		while (dec < 6 && Math.abs(Math.round(s) - s) > 1e-9 * Math.max(1, Math.abs(s))) { s *= 10; dec++; }
		var t = v.toFixed(dec);
		return /^-0(\.0*)?$/.test(t) ? t.slice(1) : t;
	}

	// ============================================================================================
	// LABELS ALONG A LINE -- where each label sits, at the SCREEN scale it will be read at:
	//   lines   [{level, pts, closed}] in drawing units
	//   opts    {scale: screen px per drawing unit, width(level) -> label width in px,
	//            height: px, spacing: px between labels on one line, pad: px kept from an open end,
	//            clip: {x0, y0, x1, y1} in drawing units, the part of the drawing on screen, optional}
	// Labels go where the line is nearly straight across the label's own width, upright (never
	// upside down), and never within a label's width of one already placed, longest lines first.
	// Returns [{level, x, y, angle (degrees, SVG's clockwise sense)}].
	// ============================================================================================
	function placeLabels(lines, opts) {
		var sc = opts.scale, placed = [], H = opts.height || 11, spacing = opts.spacing || 220, pad = opts.pad || 8;
		function lenOf(p, closed) {
			var len = 0, i;
			for (i = 2; i < p.length; i += 2) { len += Math.sqrt(Math.pow(p[i] - p[i - 2], 2) + Math.pow(p[i + 1] - p[i - 1], 2)); }
			if (closed && p.length >= 4) { len += Math.sqrt(Math.pow(p[0] - p[p.length - 2], 2) + Math.pow(p[1] - p[p.length - 1], 2)); }
			return len;
		}
		var order = lines.map(function (l) { return { l: l, len: lenOf(l.pts, l.closed) * sc }; })
			.sort(function (a, b) { return b.len - a.len; });
		var K = opts.clip;
		function onScreen(p) { return !K || (p[0] >= K.x0 && p[0] <= K.x1 && p[1] >= K.y0 && p[1] <= K.y1); }
		order.forEach(function (o) {
			var l = o.l, W = opts.width(l.level) + 6;
			if (o.len < W + 2 * pad) { return; }
			var p = l.pts.slice(), i;
			if (l.closed) { p.push(p[0], p[1]); }
			var cum = [0];
			for (i = 2; i < p.length; i += 2) { cum.push(cum[cum.length - 1] + Math.sqrt(Math.pow(p[i] - p[i - 2], 2) + Math.pow(p[i + 1] - p[i - 1], 2)) * sc); }
			var k = 1;
			function at(s) {
				k = 1;
				while (k < cum.length - 1 && cum[k] < s) { k++; }
				var seg = cum[k] - cum[k - 1], f = seg > 0 ? (s - cum[k - 1]) / seg : 0;
				return [p[2 * (k - 1)] + f * (p[2 * k] - p[2 * (k - 1)]), p[2 * (k - 1) + 1] + f * (p[2 * k + 1] - p[2 * (k - 1) + 1])];
			}
			var lo = l.closed ? W / 2 : W / 2 + pad, hi = o.len - lo, s = Math.max(lo, Math.min(spacing / 2, (lo + hi) / 2)), tries = 0;
			while (s <= hi && tries++ < 2000) {
				var A = at(s - W / 2), B = at(s + W / 2), C = at(s);
				var ux = B[0] - A[0], uy = B[1] - A[1], ul = Math.sqrt(ux * ux + uy * uy);
				// Straight enough: the chord nearly the label's own length, and no vertex inside the
				// label's span more than a fifth of the text height off it.
				var straight = ul * sc > 0.85 * W, v;
				for (v = 0; straight && v < cum.length; v++) {
					if (cum[v] <= s - W / 2 || cum[v] >= s + W / 2) { continue; }
					if (Math.abs((p[2 * v] - A[0]) * uy - (p[2 * v + 1] - A[1]) * ux) / (ul || 1) * sc > H / 5) { straight = false; }
				}
				var clear = straight && onScreen(C) && placed.every(function (q) {
					var dx = (q.x - C[0]) * sc, dy = (q.y - C[1]) * sc;
					return Math.sqrt(dx * dx + dy * dy) > (q.w + W) / 2 + H;
				});
				if (clear) {
					var ang = Math.atan2(uy, ux) * 180 / Math.PI;
					if (ang > 90) { ang -= 180; } else if (ang <= -90) { ang += 180; }
					placed.push({ level: l.level, x: C[0], y: C[1], angle: ang, w: W });
					s += spacing;
				} else {
					s += Math.max(3, W / 5);
				}
			}
		});
		return placed.map(function (q) { return { level: q.level, x: q.x, y: q.y, angle: q.angle }; });
	}

	// ============================================================================================
	// COLOUR -- the RGBA bytes of the fill. `mode` 'smooth' blends between the class colours placed
	// at the middle of each class; 'bands' paints each class flat with the edge between two classes
	// anti-aliased over one cell. Alpha is the corridor's own. `cols` are [r, g, b] per class,
	// `breaks` the class limits (n - 1 of them, the convention of js/lpn-ramps.js).
	// ============================================================================================
	function classStops(breaks, n) {
		var stops = [], k;
		if (!breaks.length) { return [0]; }
		var first = breaks.length > 1 ? breaks[1] - breaks[0] : 1, last = breaks.length > 1 ? breaks[breaks.length - 1] - breaks[breaks.length - 2] : 1;
		for (k = 0; k < n; k++) {
			if (k === 0) { stops.push(breaks[0] - first / 2); }
			else if (k === n - 1) { stops.push(breaks[breaks.length - 1] + last / 2); }
			else { stops.push((breaks[k - 1] + breaks[k]) / 2); }
		}
		return stops;
	}
	// Band index per value, the convention of js/lpn-ramps.js classIndex(): a value on a break
	// belongs to the band above it. NaN answers -1 (no colour).
	function bandOf(v, breaks) {
		if (!isFinite(v)) { return -1; }
		var k = 0;
		while (k < breaks.length && v >= breaks[k]) { k++; }
		return k;
	}
	function fillRGBA(field, grid, breaks, cols, mode, out) {
		var V = field.val, A = field.alpha, nx = grid.nx, ny = grid.ny, N = nx * ny, n = cols.length, i;
		var data = out || new Uint8ClampedArray(4 * N), stops = classStops(breaks, n);
		for (i = 0; i < N; i++) {
			var v = V[i], o = 4 * i, r, g, b;
			if (!(A[i] > 0) || !isFinite(v)) { data[o] = data[o + 1] = data[o + 2] = data[o + 3] = 0; continue; }
			if (mode === 'bands') {
				var k = bandOf(v, breaks), c = cols[Math.min(n - 1, k)];
				r = c[0]; g = c[1]; b = c[2];
				// Anti-aliased: the nearest class limit, and how far the value is from it in cells.
				var ii = i % nx, jj = (i - ii) / nx, gx = 0, gy = 0;
				if (ii > 0 && ii + 1 < nx && isFinite(V[i - 1]) && isFinite(V[i + 1])) { gx = (V[i + 1] - V[i - 1]) / 2; }
				if (jj > 0 && jj + 1 < ny && isFinite(V[i - nx]) && isFinite(V[i + nx])) { gy = (V[i + nx] - V[i - nx]) / 2; }
				var gr = Math.sqrt(gx * gx + gy * gy);
				if (gr > 0 && breaks.length) {
					var lim = (k > 0 && (k === breaks.length || v - breaks[k - 1] < breaks[k] - v)) ? k - 1 : k;
					var t = (v - breaks[lim]) / gr + 0.5;
					if (t > 0 && t < 1) {
						var below = cols[lim], above = cols[Math.min(n - 1, lim + 1)];
						r = below[0] + t * (above[0] - below[0]); g = below[1] + t * (above[1] - below[1]); b = below[2] + t * (above[2] - below[2]);
					}
				}
			} else if (n === 1 || v <= stops[0]) {
				r = cols[0][0]; g = cols[0][1]; b = cols[0][2];
			} else if (v >= stops[n - 1]) {
				r = cols[n - 1][0]; g = cols[n - 1][1]; b = cols[n - 1][2];
			} else {
				var s = 0;
				while (s < n - 2 && v > stops[s + 1]) { s++; }
				var u = (v - stops[s]) / (stops[s + 1] - stops[s]), c0 = cols[s], c1 = cols[s + 1];
				r = c0[0] + u * (c1[0] - c0[0]); g = c0[1] + u * (c1[1] - c0[1]); b = c0[2] + u * (c1[2] - c0[2]);
			}
			data[o] = r; data[o + 1] = g; data[o + 2] = b; data[o + 3] = Math.round(255 * A[i]);
		}
		return data;
	}

	// A number short enough for an SVG path without losing anything visible: `digits` decimals,
	// chosen by the caller from the extent so a degrees-of-longitude drawing keeps its precision.
	// `polys` are flat arrays, or {pts, closed} as contourLines() returns them.
	function pathOf(polys, digits, closed) {
		var parts = [], i, j;
		function f(v) { return String(+v.toFixed(digits)); }
		for (i = 0; i < polys.length; i++) {
			var p = polys[i].pts || polys[i], cl = polys[i].pts ? polys[i].closed : closed;
			if (p.length < 4) { continue; }
			var s = 'M' + f(p[0]) + ' ' + f(p[1]);
			for (j = 2; j + 1 < p.length; j += 2) { s += 'L' + f(p[j]) + ' ' + f(p[j + 1]); }
			parts.push(cl ? s + 'Z' : s);
		}
		return parts.join('');
	}
	function digitsFor(span) {
		if (!(span > 0)) { return 2; }
		return Math.max(0, Math.min(12, Math.ceil(5 - Math.log(span) / Math.LN10)));
	}

	EC.lpnContour = {
		zones: zones,
		median: median,
		segmentSet: segmentSet,
		faultAcross: faultAcross,
		gridAround: gridAround,
		corridorField: corridorField,
		sampleField: sampleField,
		cellAt: cellAt,
		contourLines: contourLines,
		zoneBreaks: zoneBreaks,
		clipNear: clipNear,
		distToPolyline: distToPolyline,
		smoothLine: smoothLine,
		levelsFor: levelsFor,
		niceStep: niceStep,
		levelText: levelText,
		placeLabels: placeLabels,
		classStops: classStops,
		bandOf: bandOf,
		fillRGBA: fillRGBA,
		pathOf: pathOf,
		digitsFor: digitsFor
	};

	if (typeof module !== 'undefined' && module.exports) { module.exports = EC.lpnContour; }
}(typeof globalThis !== 'undefined' ? globalThis : this));
