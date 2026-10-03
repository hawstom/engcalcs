// lpn-contour.js -- THE CONTOUR PLOT's pure half (ROADMAP Task 600).
//
// Copyright 2009 Thomas Gail Haws. Licensed under GNU GPL v3.0 or later.
//
// Split from js/looped-network.js by PURITY, the rule js/lpn-geom.js states: points, values and
// numbers in, triangles, polygons and numbers out. No DOM, no `doc`, no settings, no units. The
// page decides which nodes carry a value, which links join two nodes into one pressure zone, and
// what colour a band is; this file answers the geometry. dev/lpn-spike/contour-harness.js drives
// every function here in Node.
//
// THE DESIGN IS dev/epanet-js-contour-contribution.md (§2 and §2a), and the choices are its:
//
//   1. **LINEAR OVER A DELAUNAY TRIANGULATION OF THE NODES, NOT EPANET's IDW GRID.** A value inside
//      a triangle is a blend of exactly its three corners, so nothing is invented beyond the range
//      of the nodes around it: no bull's-eye, no overshoot. EPANET's own rule (Fcontour.pas: inverse
//      distance squared over the six nearest nodes, on a fixed 20 x 20 grid over the whole map) is
//      the one ITRC names as unsuitable for a smooth potential field at this density.
//   2. **NEVER PAINT OVER NOTHING.** Colour exists only inside a triangle, so never past the hull
//      of the nodes; and a triangle is dropped if any edge is longer than `maxEdge` (an alpha shape
//      stated as a length), so a river or an undeveloped parcel between two arms of the network is
//      left uncoloured rather than filled with confidence.
//   3. **NO COLOUR ACROSS A ZONE BOUNDARY.** A triangle whose corners are not joined by open pipes
//      -- a pump, a PRV, a closed valve between them -- is dropped, because head jumps there and a
//      smooth ramp across the jump does not exist.
//   4. **WITH A GROUND SURFACE, PRESSURE MAY LEAVE THE NODES' RANGE**, on purpose (§2a, Luke
//      Butler's proof of concept): head is interpolated, which IS the smooth field, and the ground
//      is subtracted per cell. rasterField() is that half.

(function (root) {
	'use strict';

	var EC = root.EngCalcs = root.EngCalcs || {};

	// ============================================================================================
	// DELAUNAY TRIANGULATION -- Bowyer-Watson, with a walk to find the containing triangle and a
	// flood over neighbours to find the cavity, so a typical insertion touches a handful of
	// triangles rather than all of them. Coordinates are normalised to the unit square first, which
	// keeps the in-circle determinant well scaled whatever frame the drawing is in (a geographic
	// project is drawn in degrees of longitude, so a whole network spans 0.05 units).
	//
	// Returns a flat array [a0, b0, c0, a1, b1, c1, ...] of indices into xs/ys, every triangle
	// counter-clockwise in the y-up sense. Duplicate points are triangulated once (the first wins).
	// Triangles touching the enclosing super-triangle are dropped, which can leave a sliver of the
	// true hull uncovered at its edge -- a conservative loss, given rule 2 above.
	// ============================================================================================
	function triangulate(xs, ys) {
		var n = xs.length, i;
		if (n < 3) { return []; }
		var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
		for (i = 0; i < n; i++) {
			if (xs[i] < minX) { minX = xs[i]; } if (xs[i] > maxX) { maxX = xs[i]; }
			if (ys[i] < minY) { minY = ys[i]; } if (ys[i] > maxY) { maxY = ys[i]; }
		}
		var span = Math.max(maxX - minX, maxY - minY);
		if (!(span > 0)) { return []; }
		// Normalised working copies, plus the three super-triangle corners at n, n+1, n+2.
		var px = new Float64Array(n + 3), py = new Float64Array(n + 3);
		for (i = 0; i < n; i++) { px[i] = (xs[i] - minX) / span; py[i] = (ys[i] - minY) / span; }
		px[n] = -100; py[n] = -100;
		px[n + 1] = 101; py[n + 1] = -100;
		px[n + 2] = 0.5; py[n + 2] = 101;

		// Triangle store: v (3 per triangle), nb (neighbour across edge k = v[k] -> v[k+1]), alive.
		var cap = 2 * n + 16;
		var V = new Int32Array(cap * 3), NB = new Int32Array(cap * 3), alive = new Uint8Array(cap), tCount = 0;
		function grow() {
			var nc = cap * 2, V2 = new Int32Array(nc * 3), N2 = new Int32Array(nc * 3), A2 = new Uint8Array(nc);
			V2.set(V); N2.set(NB); A2.set(alive);
			V = V2; NB = N2; alive = A2; cap = nc;
		}
		function addTri(a, b, c) {
			if (tCount >= cap) { grow(); }
			var t = tCount++;
			V[3 * t] = a; V[3 * t + 1] = b; V[3 * t + 2] = c;
			NB[3 * t] = -1; NB[3 * t + 1] = -1; NB[3 * t + 2] = -1;
			alive[t] = 1;
			return t;
		}
		function orient(a, b, x, y) { return (px[b] - px[a]) * (y - py[a]) - (py[b] - py[a]) * (x - px[a]); }
		function inCircle(t, x, y) {
			var a = V[3 * t], b = V[3 * t + 1], c = V[3 * t + 2];
			var adx = px[a] - x, ady = py[a] - y, bdx = px[b] - x, bdy = py[b] - y, cdx = px[c] - x, cdy = py[c] - y;
			var ad = adx * adx + ady * ady, bd = bdx * bdx + bdy * bdy, cd = cdx * cdx + cdy * cdy;
			return adx * (bdy * cd - bd * cdy) - ady * (bdx * cd - bd * cdx) + ad * (bdx * cdy - bdy * cdx) > 0;
		}
		addTri(n, n + 1, n + 2);

		// INSERTION ORDER: a snake through a coarse grid, so consecutive points are near each other
		// and the walk from the last triangle is short.
		var order = [], rows = Math.max(1, Math.round(Math.sqrt(n / 4)));
		for (i = 0; i < n; i++) { order.push(i); }
		order.sort(function (p, q) {
			var rp = Math.min(rows - 1, Math.floor(py[p] * rows)), rq = Math.min(rows - 1, Math.floor(py[q] * rows));
			if (rp !== rq) { return rp - rq; }
			return (rp % 2 === 0) ? (px[p] - px[q]) : (px[q] - px[p]);
		});

		var seen = {}, last = 0, stack = [], bad = [], mark = new Int32Array(cap), stamp = 0;
		var k, oi;
		for (oi = 0; oi < n; oi++) {
			var p = order[oi], x = px[p], y = py[p];
			var key = x + ',' + y;
			if (seen[key]) { continue; }
			seen[key] = 1;
			// ---- locate: walk towards p ----
			var t = alive[last] ? last : -1, steps = 0;
			if (t < 0) { for (t = tCount - 1; t >= 0 && !alive[t]; t--) { /* find any live one */ } }
			for (;;) {
				var moved = false;
				for (k = 0; k < 3; k++) {
					var a = V[3 * t + k], b = V[3 * t + (k + 1) % 3];
					if (orient(a, b, x, y) < 0 && NB[3 * t + k] >= 0) { t = NB[3 * t + k]; moved = true; break; }
				}
				if (!moved) { break; }
				if (++steps > 4 * tCount + 16) { t = -1; break; }
			}
			if (t < 0 || !inCircle(t, x, y)) {
				// A degenerate walk (collinear runs can cycle) or a point on an edge: find any
				// triangle whose circumcircle holds p, by brute force. Rare.
				t = -1;
				for (k = 0; k < tCount; k++) { if (alive[k] && inCircle(k, x, y)) { t = k; break; } }
				if (t < 0) { continue; }
			}
			// ---- cavity: flood over neighbours whose circumcircle holds p ----
			if (mark.length < cap) { var m2 = new Int32Array(cap); m2.set(mark); mark = m2; }
			stamp++;
			bad.length = 0; stack.length = 0;
			stack.push(t); mark[t] = stamp;
			while (stack.length) {
				var u = stack.pop();
				bad.push(u);
				for (k = 0; k < 3; k++) {
					var w = NB[3 * u + k];
					if (w >= 0 && mark[w] !== stamp && inCircle(w, x, y)) { mark[w] = stamp; stack.push(w); }
				}
			}
			// ---- boundary edges, then the fan of new triangles round p ----
			var startOf = {}, endOf = {}, made = [];
			for (i = 0; i < bad.length; i++) {
				var bt = bad[i];
				for (k = 0; k < 3; k++) {
					var nbT = NB[3 * bt + k];
					if (nbT >= 0 && mark[nbT] === stamp) { continue; }
					var ea = V[3 * bt + k], eb = V[3 * bt + (k + 1) % 3];
					made.push([ea, eb, nbT]);
				}
			}
			for (i = 0; i < bad.length; i++) { alive[bad[i]] = 0; }
			for (i = 0; i < made.length; i++) {
				var e = made[i], nt = addTri(e[0], e[1], p);
				NB[3 * nt] = e[2];
				if (e[2] >= 0) {
					for (k = 0; k < 3; k++) {
						if (V[3 * e[2] + k] === e[1] && V[3 * e[2] + (k + 1) % 3] === e[0]) { NB[3 * e[2] + k] = nt; break; }
					}
				}
				startOf[e[0]] = nt; endOf[e[1]] = nt;
			}
			for (i = 0; i < made.length; i++) {
				var tt = tCount - made.length + i, va = V[3 * tt], vb = V[3 * tt + 1];
				// Edge 1 is b -> p: shared with the triangle that STARTS at b. Edge 2 is p -> a:
				// shared with the triangle that ENDS at a.
				NB[3 * tt + 1] = startOf[vb] !== undefined ? startOf[vb] : -1;
				NB[3 * tt + 2] = endOf[va] !== undefined ? endOf[va] : -1;
			}
			last = tCount - 1;
		}
		var out = [];
		for (t = 0; t < tCount; t++) {
			if (!alive[t]) { continue; }
			var A = V[3 * t], B = V[3 * t + 1], C = V[3 * t + 2];
			if (A >= n || B >= n || C >= n) { continue; }
			out.push(A, B, C);
		}
		return out;
	}

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

	// The median of a list of positive lengths, or 0 for none. The page's fill limit is a multiple
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
	// THE MASK -- which triangles may carry colour. Keeps a triangle only if its three corners are
	// in one zone and none of its edges is longer than maxEdge (no limit when maxEdge is not a
	// positive number). Returns a new flat triangle array.
	// ============================================================================================
	function maskTriangles(tris, xs, ys, zoneOf, maxEdge) {
		var out = [], lim2 = (maxEdge > 0) ? maxEdge * maxEdge : Infinity, i;
		function d2(a, b) { var dx = xs[a] - xs[b], dy = ys[a] - ys[b]; return dx * dx + dy * dy; }
		for (i = 0; i + 2 < tris.length; i += 3) {
			var a = tris[i], b = tris[i + 1], c = tris[i + 2];
			if (zoneOf && (zoneOf[a] !== zoneOf[b] || zoneOf[b] !== zoneOf[c])) { continue; }
			if (d2(a, b) > lim2 || d2(b, c) > lim2 || d2(c, a) > lim2) { continue; }
			out.push(a, b, c);
		}
		return out;
	}

	// ============================================================================================
	// LINEAR INTERPOLATION at a point -- the value the plot claims there, or undefined outside every
	// kept triangle. Used by the harness to prove the surface; the drawing paths below never call it.
	// ============================================================================================
	function valueAt(tris, xs, ys, zs, x, y) {
		var i;
		for (i = 0; i + 2 < tris.length; i += 3) {
			var a = tris[i], b = tris[i + 1], c = tris[i + 2];
			var det = (ys[b] - ys[c]) * (xs[a] - xs[c]) + (xs[c] - xs[b]) * (ys[a] - ys[c]);
			if (det === 0) { continue; }
			var l1 = ((ys[b] - ys[c]) * (x - xs[c]) + (xs[c] - xs[b]) * (y - ys[c])) / det;
			var l2 = ((ys[c] - ys[a]) * (x - xs[c]) + (xs[a] - xs[c]) * (y - ys[c])) / det;
			var l3 = 1 - l1 - l2, eps = -1e-9;
			if (l1 >= eps && l2 >= eps && l3 >= eps) { return l1 * zs[a] + l2 * zs[b] + l3 * zs[c]; }
		}
		return undefined;
	}

	// ============================================================================================
	// FILLED CONTOURS -- each kept triangle clipped to each band [lo, hi). Band k lies between
	// breaks[k-1] and breaks[k]; band 0 is unbounded below and the last unbounded above, the
	// convention js/lpn-ramps.js states. Returns an array of bands, each an array of polygons, each
	// polygon a flat [x0, y0, x1, y1, ...].
	// ============================================================================================
	function clipHalf(poly, keepAbove, level) {
		// poly: array of [x, y, z]. Keeps z >= level (keepAbove) or z <= level.
		var out = [], i, n = poly.length;
		for (i = 0; i < n; i++) {
			var P = poly[i], Q = poly[(i + 1) % n];
			var pin = keepAbove ? P[2] >= level : P[2] <= level;
			var qin = keepAbove ? Q[2] >= level : Q[2] <= level;
			if (pin) { out.push(P); }
			if (pin !== qin) {
				var f = (level - P[2]) / (Q[2] - P[2]);
				out.push([P[0] + f * (Q[0] - P[0]), P[1] + f * (Q[1] - P[1]), level]);
			}
		}
		return out;
	}
	function isobands(tris, xs, ys, zs, breaks) {
		var nb = breaks.length + 1, bands = [], i, k;
		for (k = 0; k < nb; k++) { bands.push([]); }
		for (i = 0; i + 2 < tris.length; i += 3) {
			var a = tris[i], b = tris[i + 1], c = tris[i + 2];
			var za = zs[a], zb = zs[b], zc = zs[c];
			if (!isFinite(za) || !isFinite(zb) || !isFinite(zc)) { continue; }
			var lo = Math.min(za, zb, zc), hi = Math.max(za, zb, zc);
			var tri = [[xs[a], ys[a], za], [xs[b], ys[b], zb], [xs[c], ys[c], zc]];
			for (k = 0; k < nb; k++) {
				var bLo = k === 0 ? -Infinity : breaks[k - 1], bHi = k === nb - 1 ? Infinity : breaks[k];
				if (hi < bLo || lo >= bHi) { continue; }
				var poly = tri;
				if (bLo > lo) { poly = clipHalf(poly, true, bLo); }
				if (poly.length >= 3 && bHi <= hi) { poly = clipHalf(poly, false, bHi); }
				if (poly.length < 3) { continue; }
				var flat = [];
				poly.forEach(function (P) { flat.push(P[0], P[1]); });
				bands[k].push(flat);
			}
		}
		return bands;
	}

	// ============================================================================================
	// LINE CONTOURS -- where each level crosses each kept triangle. Returns an array (one per level)
	// of segments, each a flat [x0, y0, x1, y1].
	// ============================================================================================
	function isolines(tris, xs, ys, zs, levels) {
		var out = [], i, k;
		for (k = 0; k < levels.length; k++) { out.push([]); }
		for (i = 0; i + 2 < tris.length; i += 3) {
			var v = [tris[i], tris[i + 1], tris[i + 2]];
			for (k = 0; k < levels.length; k++) {
				var L = levels[k], pts = [], e;
				for (e = 0; e < 3; e++) {
					var p = v[e], q = v[(e + 1) % 3], zp = zs[p], zq = zs[q];
					// Half-open on the upper end, so a corner exactly on the level is counted once.
					if ((zp < L && zq >= L) || (zq < L && zp >= L)) {
						var f = (L - zp) / (zq - zp);
						pts.push(xs[p] + f * (xs[q] - xs[p]), ys[p] + f * (ys[q] - ys[p]));
					}
				}
				if (pts.length === 4) { out[k].push(pts); }
			}
		}
		return out;
	}

	// ============================================================================================
	// THE RASTER -- the interpolated value at the centre of every cell of a grid, NaN where no kept
	// triangle covers it. `grid` is {x0, y0, dx, dy, nx, ny}; cell (i, j) is centred at
	// (x0 + (i + 0.5) dx, y0 + (j + 0.5) dy) and stored at j * nx + i. Scanned triangle by triangle
	// over each one's own bounding box, so the cost is the area the network covers, not the grid.
	// ============================================================================================
	function rasterField(tris, xs, ys, zs, grid) {
		var nx = grid.nx, ny = grid.ny, out = new Float64Array(nx * ny), t, i, j;
		for (i = 0; i < out.length; i++) { out[i] = NaN; }
		for (t = 0; t + 2 < tris.length; t += 3) {
			var a = tris[t], b = tris[t + 1], c = tris[t + 2];
			var det = (ys[b] - ys[c]) * (xs[a] - xs[c]) + (xs[c] - xs[b]) * (ys[a] - ys[c]);
			if (det === 0) { continue; }
			var i0 = Math.max(0, Math.floor((Math.min(xs[a], xs[b], xs[c]) - grid.x0) / grid.dx - 0.5));
			var i1 = Math.min(nx - 1, Math.ceil((Math.max(xs[a], xs[b], xs[c]) - grid.x0) / grid.dx - 0.5));
			var j0 = Math.max(0, Math.floor((Math.min(ys[a], ys[b], ys[c]) - grid.y0) / grid.dy - 0.5));
			var j1 = Math.min(ny - 1, Math.ceil((Math.max(ys[a], ys[b], ys[c]) - grid.y0) / grid.dy - 0.5));
			for (j = j0; j <= j1; j++) {
				var y = grid.y0 + (j + 0.5) * grid.dy;
				for (i = i0; i <= i1; i++) {
					var x = grid.x0 + (i + 0.5) * grid.dx;
					var l1 = ((ys[b] - ys[c]) * (x - xs[c]) + (xs[c] - xs[b]) * (y - ys[c])) / det;
					if (l1 < -1e-9) { continue; }
					var l2 = ((ys[c] - ys[a]) * (x - xs[c]) + (xs[a] - xs[c]) * (y - ys[c])) / det;
					if (l2 < -1e-9) { continue; }
					var l3 = 1 - l1 - l2;
					if (l3 < -1e-9) { continue; }
					out[j * nx + i] = l1 * zs[a] + l2 * zs[b] + l3 * zs[c];
				}
			}
		}
		return out;
	}

	// LINE CONTOURS OVER THE RASTER -- marching squares on the cell centres, for the one case where
	// the surface is not linear in the triangles (pressure with the ground subtracted). A square
	// with any NaN corner draws nothing, so a line never runs past the coloured area. Saddles are
	// resolved by the centre average, the usual choice. Same output shape as isolines().
	function isolinesGrid(vals, grid, levels) {
		var nx = grid.nx, ny = grid.ny, out = [], i, j, k;
		for (k = 0; k < levels.length; k++) { out.push([]); }
		function cx(ii) { return grid.x0 + (ii + 0.5) * grid.dx; }
		function cy(jj) { return grid.y0 + (jj + 0.5) * grid.dy; }
		for (j = 0; j + 1 < ny; j++) {
			for (i = 0; i + 1 < nx; i++) {
				var a = vals[j * nx + i], b = vals[j * nx + i + 1], c = vals[(j + 1) * nx + i + 1], d = vals[(j + 1) * nx + i];
				if (!isFinite(a) || !isFinite(b) || !isFinite(c) || !isFinite(d)) { continue; }
				// Corners in order round the square: a (i,j), b (i+1,j), c (i+1,j+1), d (i,j+1).
				var P = [[cx(i), cy(j), a], [cx(i + 1), cy(j), b], [cx(i + 1), cy(j + 1), c], [cx(i), cy(j + 1), d]];
				for (k = 0; k < levels.length; k++) {
					var L = levels[k], pts = [], e;
					for (e = 0; e < 4; e++) {
						var p = P[e], q = P[(e + 1) % 4];
						if ((p[2] < L && q[2] >= L) || (q[2] < L && p[2] >= L)) {
							var f = (L - p[2]) / (q[2] - p[2]);
							pts.push(p[0] + f * (q[0] - p[0]), p[1] + f * (q[1] - p[1]));
						}
					}
					if (pts.length === 4) { out[k].push(pts); }
					else if (pts.length === 8) {
						// A saddle: pair the crossings by which side the centre falls on.
						var centreAbove = (a + b + c + d) / 4 >= L, aAbove = a >= L;
						// Centre on a's side: a and c are joined, so b and d are cut off.
						if (centreAbove === aAbove) {
							out[k].push([pts[0], pts[1], pts[2], pts[3]], [pts[4], pts[5], pts[6], pts[7]]);
						} else {
							out[k].push([pts[6], pts[7], pts[0], pts[1]], [pts[2], pts[3], pts[4], pts[5]]);
						}
					}
				}
			}
		}
		return out;
	}

	// The grid over the kept triangles' extent, `long` cells on its longer side.
	function gridFor(tris, xs, ys, long) {
		var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity, i;
		for (i = 0; i < tris.length; i++) {
			var v = tris[i];
			if (xs[v] < minX) { minX = xs[v]; } if (xs[v] > maxX) { maxX = xs[v]; }
			if (ys[v] < minY) { minY = ys[v]; } if (ys[v] > maxY) { maxY = ys[v]; }
		}
		if (!(maxX > minX) || !(maxY > minY)) { return null; }
		var w = maxX - minX, h = maxY - minY, cell = Math.max(w, h) / (long || 200);
		var nx = Math.max(1, Math.ceil(w / cell)), ny = Math.max(1, Math.ceil(h / cell));
		return { x0: minX, y0: minY, dx: w / nx, dy: h / ny, nx: nx, ny: ny };
	}

	// Band index per value, the convention of js/lpn-ramps.js classIndex(): a value on a break
	// belongs to the band above it. NaN answers -1 (no colour).
	function bandOf(v, breaks) {
		if (!isFinite(v)) { return -1; }
		var k = 0;
		while (k < breaks.length && v >= breaks[k]) { k++; }
		return k;
	}

	// A number short enough for an SVG path without losing anything visible: `digits` decimals,
	// chosen by the caller from the extent so a degrees-of-longitude drawing keeps its precision.
	function pathOf(polys, digits, closed) {
		var parts = [], i, j;
		function f(v) { return String(+v.toFixed(digits)); }
		for (i = 0; i < polys.length; i++) {
			var p = polys[i];
			if (p.length < 4) { continue; }
			var s = 'M' + f(p[0]) + ' ' + f(p[1]);
			for (j = 2; j + 1 < p.length; j += 2) { s += 'L' + f(p[j]) + ' ' + f(p[j + 1]); }
			parts.push(closed ? s + 'Z' : s);
		}
		return parts.join('');
	}
	function digitsFor(span) {
		if (!(span > 0)) { return 2; }
		return Math.max(0, Math.min(12, Math.ceil(5 - Math.log(span) / Math.LN10)));
	}

	EC.lpnContour = {
		triangulate: triangulate,
		zones: zones,
		median: median,
		maskTriangles: maskTriangles,
		valueAt: valueAt,
		isobands: isobands,
		isolines: isolines,
		rasterField: rasterField,
		isolinesGrid: isolinesGrid,
		gridFor: gridFor,
		bandOf: bandOf,
		pathOf: pathOf,
		digitsFor: digitsFor
	};

	if (typeof module !== 'undefined' && module.exports) { module.exports = EC.lpnContour; }
}(typeof globalThis !== 'undefined' ? globalThis : this));
