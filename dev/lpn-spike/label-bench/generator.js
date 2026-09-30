// LABEL BENCH: THE NETWORK GENERATOR ("the infinite map", Task 741). Makes a water network of any
// size, shape and density on demand, as a project document the app opens (.lwn), so a placer can
// be scored on scenes nobody tuned against. Pure JS: no DOM, no page, no clock, no Math.random.
//
//   node dev/lpn-spike/label-bench/generator.js --family grid --n 500 --seed 1 > /tmp/g.lwn
//   node dev/lpn-spike/label-bench/generator.js --spec '{"family":"tree","n":2000,"seed":7}' --stats
//
// **EVERY NETWORK REPRODUCES EXACTLY FROM (family, params, seed).** One seeded generator
// (mulberry32 over a hash of the canonical spec) drives every choice, in a fixed order, and no
// output depends on object key order, time or platform. `specKey(spec)` is the canonical name.
//
// Families (model units are feet; `d` is the nominal node spacing, 100 ft):
//   grid       a street grid, jittered, with a few blocks merged (links removed, loops kept)
//   tree       rural branched: mains run out from a source and branch, no loops
//   suburban   random points (a minimum spacing), joined by a minimum spanning tree, then a
//              looping pass adds short non-crossing links; a few pipes curve (vertices)
//   downtown   a dense core that thins out: most points drawn close to the centre, the rest spread
//              wide, joined like suburban with more loops
//
// Parameters (all optional but family):
//   n          node count, 50 to 5000 (default 500)
//   spacingPx  the median distance from a node to its nearest neighbour, in SCREEN px, at the
//              first view of a scene set; the extractor sets the zoom from it (default 40)
//   ids        ID length distribution: 'short' (1, 2, 3 ... sequential), 'epanet' (2-4 digit
//              numbers, scattered, as the EPA examples), 'long' ('J-10234-A' style), 'mixed' (60%
//              short, 25% 'J-1234', 15% 'J-10234-A-N')
//   fields     which properties are shown: 'id' (IDs only), 'novato' (node ID, P, Qb, Z; pipe ID,
//              flow, velocity: what the Novato scenes show), 'full' (node ID, Z, Qb, H, P; pipe ID,
//              D, L, flow, velocity)
//   jitter     grid only: node jitter as a fraction of d (default 0.2)
//   seed       any integer (default 1)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const D = 100;   // nominal spacing, ft
const FAMILIES = ['grid', 'tree', 'suburban', 'downtown'];
const ID_STYLES = ['short', 'epanet', 'long', 'mixed'];
const FIELD_SETS = {
	id: { node: ['id'], link: ['id'] },
	novato: { node: ['id', 'pressure', 'demand', 'elev'], link: ['id', 'flow', 'velocity'] },
	full: { node: ['id', 'elev', 'demand', 'head', 'pressure'], link: ['id', 'diameter', 'length', 'flow', 'velocity'] }
};
const NODE_FIELDS = ['id', 'elev', 'demand', 'demandActual', 'head', 'pressure', 'quality', 'initQuality'];
const LINK_FIELDS = ['id', 'diameter', 'length', 'roughness', 'km', 'flow', 'velocity', 'headloss', 'gradient',
	'friction', 'status', 'quality', 'rate'];

// ---- the canonical spec and its random stream ----------------------------------------------------
function normSpec(spec) {
	const s = {
		family: spec.family,
		n: Math.round(spec.n === undefined ? 500 : +spec.n),
		spacingPx: spec.spacingPx === undefined ? 40 : +spec.spacingPx,
		ids: spec.ids || 'epanet',
		fields: spec.fields || 'novato',
		jitter: spec.jitter === undefined ? 0.2 : +spec.jitter,
		seed: spec.seed === undefined ? 1 : Math.round(+spec.seed)
	};
	if (FAMILIES.indexOf(s.family) < 0) { throw new Error('family must be one of ' + FAMILIES.join(', ')); }
	if (!(s.n >= 20 && s.n <= 20000)) { throw new Error('n out of range: ' + s.n); }
	if (ID_STYLES.indexOf(s.ids) < 0) { throw new Error('ids must be one of ' + ID_STYLES.join(', ')); }
	if (!FIELD_SETS[s.fields]) { throw new Error('fields must be one of ' + Object.keys(FIELD_SETS).join(', ')); }
	return s;
}
// The name a generated set goes by: every parameter, in a fixed order.
function specKey(spec) {
	const s = normSpec(spec);
	return ['gen', s.family, 'n' + s.n, 's' + s.spacingPx, s.ids, s.fields, 'j' + s.jitter, 'seed' + s.seed].join('-');
}
function hashStr(str) {
	let h = 2166136261 >>> 0;
	for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0; }
	return h >>> 0;
}
function mulberry32(a) {
	return function () {
		a = (a + 0x6D2B79F5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
function makeRng(key) {
	const r = mulberry32(hashStr(key));
	const rng = { u: r,
		range: function (a, b) { return a + (b - a) * r(); },
		int: function (a, b) { return a + Math.floor(r() * (b - a + 1)); },
		pick: function (arr) { return arr[Math.floor(r() * arr.length)]; },
		gauss: function () { const u1 = Math.max(1e-12, r()), u2 = r(); return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); }
	};
	return rng;
}
function r1(v) { return Math.round(v * 10) / 10; }
function r2(v) { return Math.round(v * 100) / 100; }

// ---- a uniform grid hash over points, for "anything within r of here?" -------------------------
function PointHash(cell) {
	const m = new Map();
	function k(ix, iy) { return ix + ',' + iy; }
	return {
		add: function (i, x, y) { const kk = k(Math.floor(x / cell), Math.floor(y / cell)); if (!m.has(kk)) { m.set(kk, []); } m.get(kk).push(i); },
		near: function (x, y, r, pts) {
			const out = [], ix0 = Math.floor((x - r) / cell), ix1 = Math.floor((x + r) / cell);
			const iy0 = Math.floor((y - r) / cell), iy1 = Math.floor((y + r) / cell);
			for (let ix = ix0; ix <= ix1; ix++) {
				for (let iy = iy0; iy <= iy1; iy++) {
					const a = m.get(k(ix, iy));
					if (!a) { continue; }
					for (let j = 0; j < a.length; j++) {
						const p = pts[a[j]];
						if ((p.x - x) * (p.x - x) + (p.y - y) * (p.y - y) <= r * r) { out.push(a[j]); }
					}
				}
			}
			return out;
		}
	};
}

// ---- graph helpers -----------------------------------------------------------------------------
function UnionFind(n) {
	const p = new Int32Array(n);
	for (let i = 0; i < n; i++) { p[i] = i; }
	function f(i) { while (p[i] !== i) { p[i] = p[p[i]]; i = p[i]; } return i; }
	return { find: f, union: function (a, b) { a = f(a); b = f(b); if (a === b) { return false; } p[a] = b; return true; } };
}
function segCross(a, b, c, d) {
	function o(p, q, r) { return (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x); }
	const d1 = o(c, d, a), d2 = o(c, d, b), d3 = o(a, b, c), d4 = o(a, b, d);
	return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0)) && d1 && d2 && d3 && d4;
}
// k nearest neighbours of every point, as candidate edges [i, j, dist], each pair once, sorted.
function knnEdges(pts, k) {
	const hash = PointHash(D);
	pts.forEach(function (p, i) { hash.add(i, p.x, p.y); });
	const seen = new Set(), edges = [];
	pts.forEach(function (p, i) {
		let r = D * 1.5, near = [];
		while (near.length <= k && r < D * 200) { near = hash.near(p.x, p.y, r, pts); r *= 2; }
		near = near.filter(function (j) { return j !== i; })
			.map(function (j) { return [j, Math.hypot(pts[j].x - p.x, pts[j].y - p.y)]; })
			.sort(function (a, b) { return a[1] - b[1] || a[0] - b[0]; }).slice(0, k);
		near.forEach(function (q) {
			const a = Math.min(i, q[0]), b = Math.max(i, q[0]), key = a + ',' + b;
			if (!seen.has(key)) { seen.add(key); edges.push([a, b, q[1]]); }
		});
	});
	edges.sort(function (e, f) { return e[2] - f[2] || e[0] - f[0] || e[1] - f[1]; });
	return edges;
}
// Minimum spanning tree over the kNN graph, then a looping pass: a candidate edge is added with
// probability `loopP` if it crosses no edge already laid and meets every edge at its two ends at
// more than 25 degrees (streets do not meet at slivers). Any components left are joined nearest
// first.
function spanAndLoop(pts, rng, loopP, maxLoopLen) {
	const cand = knnEdges(pts, 6), uf = UnionFind(pts.length), edges = [], extra = [];
	cand.forEach(function (e) { if (uf.union(e[0], e[1])) { edges.push([e[0], e[1]]); } else { extra.push(e); } });
	// Join leftover components (a kNN graph can split): nearest pair between a component and the rest.
	let comps = new Map();
	pts.forEach(function (p, i) { const r = uf.find(i); if (!comps.has(r)) { comps.set(r, []); } comps.get(r).push(i); });
	while (comps.size > 1) {
		const list = Array.from(comps.values()).sort(function (a, b) { return a.length - b.length || a[0] - b[0]; });
		const small = list[0], smallSet = new Set(small);
		let best = null;
		small.forEach(function (i) {
			pts.forEach(function (q, j) {
				if (smallSet.has(j)) { return; }
				const dd = Math.hypot(q.x - pts[i].x, q.y - pts[i].y);
				if (!best || dd < best[2]) { best = [i, j, dd]; }
			});
		});
		uf.union(best[0], best[1]);
		edges.push([Math.min(best[0], best[1]), Math.max(best[0], best[1])]);
		comps = new Map();
		pts.forEach(function (p, i) { const r = uf.find(i); if (!comps.has(r)) { comps.set(r, []); } comps.get(r).push(i); });
	}
	// The looping pass. Edges are filed in a coarse hash for the crossing test.
	const cell = D * 3, eh = new Map(), adj = pts.map(function () { return []; });
	function fileEdge(ei) {
		const e = edges[ei], a = pts[e[0]], b = pts[e[1]];
		const x0 = Math.floor(Math.min(a.x, b.x) / cell), x1 = Math.floor(Math.max(a.x, b.x) / cell);
		const y0 = Math.floor(Math.min(a.y, b.y) / cell), y1 = Math.floor(Math.max(a.y, b.y) / cell);
		for (let x = x0; x <= x1; x++) { for (let y = y0; y <= y1; y++) { const k = x + ',' + y; if (!eh.has(k)) { eh.set(k, []); } eh.get(k).push(ei); } }
		adj[e[0]].push(e[1]); adj[e[1]].push(e[0]);
	}
	edges.forEach(function (e, i) { fileEdge(i); });
	function crosses(i, j) {
		const a = pts[i], b = pts[j];
		const x0 = Math.floor(Math.min(a.x, b.x) / cell), x1 = Math.floor(Math.max(a.x, b.x) / cell);
		const y0 = Math.floor(Math.min(a.y, b.y) / cell), y1 = Math.floor(Math.max(a.y, b.y) / cell);
		for (let x = x0; x <= x1; x++) {
			for (let y = y0; y <= y1; y++) {
				const l = eh.get(x + ',' + y);
				if (!l) { continue; }
				for (let t = 0; t < l.length; t++) {
					const e = edges[l[t]];
					if (e[0] === i || e[1] === i || e[0] === j || e[1] === j) { continue; }
					if (segCross(a, b, pts[e[0]], pts[e[1]])) { return true; }
				}
			}
		}
		return false;
	}
	function sliver(i, j) {
		const ang = Math.atan2(pts[j].y - pts[i].y, pts[j].x - pts[i].x);
		return adj[i].some(function (k) {
			let d = Math.abs(Math.atan2(pts[k].y - pts[i].y, pts[k].x - pts[i].x) - ang);
			d = Math.min(d, 2 * Math.PI - d);
			return d < 25 * Math.PI / 180;
		});
	}
	extra.forEach(function (e) {
		const u = rng.u();   // drawn for every candidate, so the stream does not depend on the tests
		if (u >= loopP || e[2] > maxLoopLen) { return; }
		if (adj[e[0]].indexOf(e[1]) >= 0 || sliver(e[0], e[1]) || sliver(e[1], e[0]) || crosses(e[0], e[1])) { return; }
		edges.push([e[0], e[1]]);
		fileEdge(edges.length - 1);
	});
	return edges;
}
// Dart throwing with a minimum spacing, inside `inside(x, y)`, drawing candidates from `draw()`.
function scatter(n, rng, minDist, draw) {
	const pts = [], hash = PointHash(Math.max(minDist, 1));
	let tries = 0;
	while (pts.length < n && tries < n * 60) {
		tries++;
		const p = draw();
		if (hash.near(p.x, p.y, minDist, pts).length) { continue; }
		hash.add(pts.length, p.x, p.y);
		pts.push(p);
	}
	return pts;
}

// ---- the four families: points and edges -------------------------------------------------------
function famGrid(s, rng) {
	const cols = Math.max(2, Math.round(Math.sqrt(s.n * 1.5))), pts = [], idx = {};
	for (let i = 0; pts.length < s.n; i++) {
		const c = i % cols, r = Math.floor(i / cols);
		idx[c + ',' + r] = pts.length;
		pts.push({ x: c * D + rng.range(-1, 1) * s.jitter * D, y: r * D + rng.range(-1, 1) * s.jitter * D, c: c, r: r });
	}
	let edges = [];
	pts.forEach(function (p, i) {
		const e = idx[(p.c + 1) + ',' + p.r], s2 = idx[p.c + ',' + (p.r + 1)];
		if (e !== undefined) { edges.push([i, e]); }
		if (s2 !== undefined) { edges.push([i, s2]); }
	});
	// Merge some blocks: drop 8% of links, never one whose loss would leave a node with fewer than two
	// links (a grid keeps its loops) -- and put back any that disconnects the whole.
	const deg = pts.map(function () { return 0; });
	edges.forEach(function (e) { deg[e[0]]++; deg[e[1]]++; });
	const dropped = [];
	const keep = edges.filter(function (e) {
		const u = rng.u();
		if (u < 0.08 && deg[e[0]] > 2 && deg[e[1]] > 2) { deg[e[0]]--; deg[e[1]]--; dropped.push(e); return false; }
		return true;
	});
	const uf = UnionFind(pts.length);
	keep.forEach(function (e) { uf.union(e[0], e[1]); });
	dropped.forEach(function (e) { if (uf.union(e[0], e[1])) { keep.push(e); } });
	edges = keep;
	return { pts: pts, edges: edges, trunkEvery: 5 };
}
function famTree(s, rng) {
	const pts = [{ x: 0, y: 0, dir: 0, depth: 0 }], edges = [], hash = PointHash(D);
	hash.add(0, 0, 0);
	// Mains leave the source in 3 to 5 directions; each step either continues a line (most often) or
	// branches off it at about a right angle.
	const mains = rng.int(3, 5), tips = [];
	for (let m = 0; m < mains; m++) { tips.push({ i: 0, dir: 2 * Math.PI * m / mains + rng.range(-0.3, 0.3) }); }
	let guard = 0;
	while (pts.length < s.n && guard < s.n * 50) {
		guard++;
		let t;
		if (tips.length && rng.u() < 0.8) { t = tips.splice(rng.int(0, tips.length - 1), 1)[0]; } else {
			const i = rng.int(0, pts.length - 1);
			t = { i: i, dir: pts[i].dir + (rng.u() < 0.5 ? 1 : -1) * Math.PI / 2 + rng.range(-0.3, 0.3) };
		}
		const len = D * rng.range(0.7, 1.6), dir = t.dir + rng.range(-0.35, 0.35);
		const p0 = pts[t.i], x = p0.x + len * Math.cos(dir), y = p0.y + len * Math.sin(dir);
		if (hash.near(x, y, 0.55 * D, pts).length) { continue; }
		const j = pts.length;
		pts.push({ x: x, y: y, dir: dir, depth: p0.depth + 1 });
		hash.add(j, x, y);
		edges.push([t.i, j]);
		tips.push({ i: j, dir: dir });
		if (rng.u() < 0.12) { tips.push({ i: j, dir: dir + (rng.u() < 0.5 ? 1 : -1) * Math.PI / 2 }); }
	}
	return { pts: pts, edges: edges, tree: true };
}
function famSuburban(s, rng) {
	const side = Math.sqrt(s.n) * D * 1.05;
	const pts = scatter(s.n, rng, 0.6 * D, function () { return { x: rng.range(0, side * 1.3), y: rng.range(0, side / 1.3) }; });
	return { pts: pts, edges: spanAndLoop(pts, rng, 0.3, 2.2 * D), curvy: 0.15 };
}
function famDowntown(s, rng) {
	const sigma = Math.sqrt(s.n) * D * 0.28, spread = Math.sqrt(s.n) * D * 1.6;
	const pts = scatter(s.n, rng, 0.3 * D, function () {
		if (rng.u() < 0.75) { return { x: sigma * rng.gauss(), y: sigma * rng.gauss() }; }
		return { x: rng.range(-spread / 2, spread / 2), y: rng.range(-spread / 2.6, spread / 2.6) };
	});
	return { pts: pts, edges: spanAndLoop(pts, rng, 0.55, 3 * D), curvy: 0.05 };
}

// ---- IDs ---------------------------------------------------------------------------------------
function makeIds(n, style, rng, prefix, used) {
	const out = [];
	function uniq(f) { let id; let k = 0; do { id = f(k++); } while (used.has(id)); used.add(id); return id; }
	for (let i = 0; i < n; i++) {
		let id;
		if (style === 'short') {
			id = uniq(function (k) { return String(i + 1 + k * 100000); });
		} else if (style === 'epanet') {
			id = uniq(function () { return String(rng.int(10, n < 900 ? 999 : 9999)); });
		} else if (style === 'long') {
			id = uniq(function () { return prefix + '-' + String(rng.int(10000, 99999)) + (rng.u() < 0.5 ? '-' + 'ABCDEFGH'.charAt(rng.int(0, 7)) : ''); });
		} else {
			const u = rng.u();
			id = uniq(function () {
				if (u < 0.6) { return String(rng.int(1, 9999)); }
				if (u < 0.85) { return prefix + '-' + rng.int(1000, 9999); }
				return prefix + '-' + rng.int(10000, 99999) + '-' + 'ABCDEFGH'.charAt(rng.int(0, 7)) + '-' + 'NSEW'.charAt(rng.int(0, 3));
			});
		}
		out.push(id);
	}
	return out;
}

// ---- the document --------------------------------------------------------------------------------
function generate(specIn) {
	// **THREE INDEPENDENT STREAMS, SO FACTORS PAIR.** The network (geometry, values) comes from
	// (family, n, jitter, seed) alone, the IDs from (ids, seed) and the node count, and spacingPx and
	// fields do not touch the document's network at all. So one seed at three densities, or with
	// three ID styles, is the SAME network: a paired comparison by construction.
	const s = normSpec(specIn), key = specKey(s);
	const rng = makeRng(['net', s.family, s.n, s.jitter, s.seed].join('|'));
	const rngId = makeRng(['ids', s.ids, s.n, s.seed].join('|'));
	const g = s.family === 'grid' ? famGrid(s, rng) : s.family === 'tree' ? famTree(s, rng)
		: s.family === 'suburban' ? famSuburban(s, rng) : famDowntown(s, rng);
	const pts = g.pts, n = pts.length;
	// Terrain: a smooth surface from a few waves, plus a little noise, 60 to 260 ft.
	const waves = [];
	for (let w = 0; w < 4; w++) { waves.push({ a: rng.range(10, 35), kx: rng.range(-1, 1) / (D * rng.range(6, 30)), ky: rng.range(-1, 1) / (D * rng.range(6, 30)), ph: rng.range(0, 6.28) }); }
	function elevAt(p) { let z = 160; waves.forEach(function (w) { z += w.a * Math.sin(p.x * w.kx * 6.28 + p.y * w.ky * 6.28 + w.ph); }); return z; }
	// The source: the grid's corner, the tree's root, the point nearest the others' lower-left.
	let src = 0;
	if (!g.tree) { pts.forEach(function (p, i) { if (p.x + p.y < pts[src].x + pts[src].y) { src = i; } }); }
	const used = new Set(), nodeIds = makeIds(n, s.ids, rngId, 'J', used);
	// Tanks: one per 1000 nodes, at nodes far from the source; the rest junctions.
	const nTanks = Math.floor(n / 1000), isTank = {};
	for (let t = 0; t < nTanks; t++) { isTank[rng.int(0, n - 1)] = true; }
	delete isTank[src];
	let zmax = -Infinity;
	const nodes = pts.map(function (p, i) {
		const z = r1(elevAt(p) + rng.range(-2, 2));
		zmax = Math.max(zmax, z);
		if (isTank[i]) {
			return { id: nodeIds[i], type: 'tank', x: r2(p.x), y: r2(p.y), elev: r1(z + 120), _level: 15, minLevel: 1, maxLevel: 30, tankDiameter: 50 };
		}
		const dem = rng.u() < 0.25 ? 0 : r1(rng.range(0.5, 12));
		return { id: nodeIds[i], type: 'junction', x: r2(p.x), y: r2(p.y), elev: z, _demand: dem };
	});
	// The reservoir, a short way outside the source node, feeds it through a 24-inch main.
	const sp = pts[src], resId = used.has('R1') ? 'R-SRC' : 'R1';
	used.add(resId);
	nodes.push({ id: resId, type: 'reservoir', x: r2(sp.x - 0.8 * D), y: r2(sp.y - 0.8 * D), _head: r1(zmax + 180) });
	// Diameters: the tree by how much it carries downstream; the looped families by street class.
	const diam = {};
	if (g.tree) {
		const kids = pts.map(function () { return []; }), below = pts.map(function () { return 1; });
		g.edges.forEach(function (e) { kids[e[0]].push(e[1]); });
		for (let i = n - 1; i >= 0; i--) { kids[i].forEach(function (k) { below[i] += below[k]; }); }
		g.edges.forEach(function (e, k) { const b = below[e[1]]; diam[k] = b > 400 ? 16 : b > 120 ? 12 : b > 30 ? 8 : b > 6 ? 6 : 4; });
	} else {
		g.edges.forEach(function (e, k) {
			const u = rng.u();
			if (g.trunkEvery) {
				const a = pts[e[0]], b = pts[e[1]];
				const trunk = (a.r === b.r && a.r % g.trunkEvery === 0) || (a.c === b.c && a.c % g.trunkEvery === 0);
				diam[k] = trunk ? 16 : (u < 0.2 ? 12 : 8);
			} else {
				diam[k] = u < 0.08 ? 16 : u < 0.3 ? 12 : 8;
			}
		});
	}
	const linkIds = makeIds(g.edges.length + 1, s.ids, rngId, 'P', new Set());   // links name apart from nodes, as EPANET's do
	const links = [{ id: linkIds[g.edges.length], type: 'pipe', from: resId, to: nodeIds[src], verts: [],
		_diameter: 24, _roughness: 130, _length: r1(0.8 * D * Math.SQRT2), lenAuto: false, _status: 'open', _k: 0 }];
	g.edges.forEach(function (e, k) {
		const a = pts[e[0]], b = pts[e[1]];
		const u = rng.u(), v = rng.u(), off = rng.range(-0.25, 0.25);
		const L = Math.hypot(b.x - a.x, b.y - a.y);
		// A valve on one link in 150 (a TCV, open: a symbol on the map, no hydraulic effect).
		if (u < 1 / 150 && L > 0.5 * D) {
			links.push({ id: linkIds[k], type: 'valve', from: nodeIds[e[0]], to: nodeIds[e[1]], verts: [], _diameter: diam[k],
				_roughness: 130, _length: 0, lenAuto: false, _status: 'open', _k: 0, valveType: 'TCV', _setting: 0 });
			return;
		}
		const verts = [];
		if (g.curvy && v < g.curvy && L > 0.8 * D) {
			// One bend, a quarter of the length off the straight line at most.
			const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, nx = -(b.y - a.y) / L, ny = (b.x - a.x) / L;
			verts.push([r2(mx + nx * off * L), r2(my + ny * off * L)]);
		}
		let len = L;
		if (verts.length) { len = Math.hypot(verts[0][0] - a.x, verts[0][1] - a.y) + Math.hypot(b.x - verts[0][0], b.y - verts[0][1]); }
		links.push({ id: linkIds[k], type: 'pipe', from: nodeIds[e[0]], to: nodeIds[e[1]], verts: verts,
			_diameter: diam[k], _roughness: 130, _length: r1(len), lenAuto: false, _status: 'open', _k: 0 });
	});
	const fs = FIELD_SETS[s.fields], ls = { node: {}, link: {}, separator: ', ', markExtrema: false };
	NODE_FIELDS.forEach(function (f) { ls.node[f] = fs.node.indexOf(f) >= 0; });
	LINK_FIELDS.forEach(function (f) { ls.link[f] = fs.link.indexOf(f) >= 0; });
	let cx = 0, cy = 0;
	pts.forEach(function (p) { cx += p.x; cy += p.y; });
	return {
		format: 'hawsedc-lpn', app: 'https://hawsedc.com/engcalcs/Looped-Network.php', v: 6,
		project: { name: key, activeScenario: 'base', docId: 'gen' + hashStr(key).toString(36) },
		generator: { spec: s, key: key, nodes: n, links: links.length },
		scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
		nodes: nodes, links: links, labels: [], nextId: {},
		labelSettings: ls,
		settings: {
			idPrefixes: { J: 'J', R: 'R', T: 'T', L: 'L', P: 'P', V: 'V', X: 'X' },
			hydraulics: { specificGravity: 1, viscosity: 1, trials: 40, accuracy: 0.001, checkFreq: 2, maxCheck: 10, dampLimit: 0,
				unbalanced: 'continue', unbalancedTrials: 10, demandMultiplier: 1, emitterExponent: 0.5 },
			engine: 'epanet', textSize: 12, symbolSize: 12, linkWidth: 4, symbolOpacity: 1, alignPipeLabels: true,
			labelFlipLeftOfVertical: 20, maskLabels: true, legendPosition: 'top-right', labelReadabilityBias: 110,
			labelMaxWidth: null, method: 'hw'
		},
		view: { cx: r2(cx / n), cy: r2(cy / n), s: 1 },
		units: { lpn_u_length: 'ft', lpn_u_diameter: 'in', lpn_u_elevhead: 'fth2o', lpn_u_pressure: 'psi',
			lpn_u_flow: 'gpm', lpn_u_velocity: 'ftps', lpn_u_gradient: 'gradePercent' }
	};
}

// Median nearest-neighbour distance of the nodes, model units (the extractor's zoom reference).
function medianNN(doc) {
	const pts = doc.nodes.filter(function (n) { return n.type !== 'reservoir'; }).map(function (n) { return { x: n.x, y: n.y }; });
	const hash = PointHash(D);
	pts.forEach(function (p, i) { hash.add(i, p.x, p.y); });
	const dd = pts.map(function (p, i) {
		let r = D, near = [];
		while (near.length < 2 && r < D * 100) { near = hash.near(p.x, p.y, r, pts); r *= 2; }
		let best = Infinity;
		near.forEach(function (j) { if (j !== i) { best = Math.min(best, Math.hypot(pts[j].x - p.x, pts[j].y - p.y)); } });
		return best;
	}).sort(function (a, b) { return a - b; });
	return dd[Math.floor(dd.length / 2)];
}

// A seeded index in [0, n): the extractor's view centre on a benchmark network (seed > 1).
function pickIndex(n, key) { return Math.floor(makeRng(key).u() * n); }

module.exports = { generate, normSpec, specKey, medianNN, pickIndex, FAMILIES, ID_STYLES, FIELD_SETS, D };

if (require.main === module) {
	const a = process.argv.slice(2);
	function opt(k) { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined; }
	const spec = opt('--spec') ? JSON.parse(opt('--spec')) : { family: opt('--family'), n: opt('--n'),
		spacingPx: opt('--spacing'), ids: opt('--ids'), fields: opt('--fields'), seed: opt('--seed') };
	Object.keys(spec).forEach(function (k) { if (spec[k] === undefined) { delete spec[k]; } });
	const doc = generate(spec);
	if (a.indexOf('--stats') >= 0) {
		const deg = {};
		doc.links.forEach(function (l) { deg[l.from] = (deg[l.from] || 0) + 1; deg[l.to] = (deg[l.to] || 0) + 1; });
		const dg = Object.keys(deg).map(function (k) { return deg[k]; });
		console.log(JSON.stringify({ key: doc.generator.key, nodes: doc.nodes.length, links: doc.links.length,
			loops: doc.links.length - doc.nodes.length + 1, medianNN: +medianNN(doc).toFixed(1),
			meanDegree: +(dg.reduce(function (x, y) { return x + y; }, 0) / dg.length).toFixed(2),
			valves: doc.links.filter(function (l) { return l.type === 'valve'; }).length,
			tanks: doc.nodes.filter(function (x) { return x.type === 'tank'; }).length,
			idSample: doc.nodes.slice(0, 6).map(function (x) { return x.id; }) }));
	} else {
		process.stdout.write(JSON.stringify(doc, null, 1) + '\n');
	}
}
