// ROUND 6: THE MEASURES ROUND 5 DID NOT HAVE.
//
//   1. THE DROP-ORDER ARMS (Tom, 2026-10-06: "it might be best to prioritize more labels with a
//      single value left than less labels with more values left"). armScene() rewrites every label
//      request of a view: 'two' keeps its ID and its single most-wanted value (the LAST in the
//      user's drop order), 'one' keeps that value alone (the app's shipped default drops the ID
//      first, so a label down to one value shows P= or Q=). coverage() counts, against the FULL
//      request, what each layout shows.
//   2. THE GAPS BETWEEN A NODE'S PIPES (his R-079 ranked gap list, step 1 of the spot_prime hunt,
//      Task 539): the angular gaps between the pipes meeting at a node, widest first. For a node
//      label hidden although free ground was within reach, which gap holds that ground? For a shown
//      node label, which gap did the placer put it in?
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const C = require('../../lpn-spike/label-bench/contract.js');
const Mx = require('../round-5-2026-09-29/metrics.js');

// The row a label keeps last: the last field of the user's drop order that the label carries; a
// label with none keeps its first non-ID row, then its ID.
function topRow(scene, req) {
	const order = (scene.dropOrder && scene.dropOrder[req.kind]) || [];
	for (let k = order.length - 1; k >= 0; k--) {
		const i = req.rows.findIndex(function (r) { return r.field === order[k]; });
		if (i >= 0) { return i; }
	}
	const v = req.rows.findIndex(function (r) { return r.field !== 'id'; });
	return v >= 0 ? v : 0;
}

function armScene(scene, arm) {
	const out = Object.assign({}, scene, { id: scene.id + '#' + arm });
	out.labels = scene.labels.map(function (req) {
		const t = topRow(scene, req), id = req.rows.findIndex(function (r) { return r.field === 'id'; });
		const keep = arm === 'one' ? [t] : (id >= 0 && id !== t ? [id, t].sort(function (a, b) { return a - b; }) : [t]);
		return Object.assign({}, req, { rows: keep.map(function (i) { return req.rows[i]; }) });
	});
	return out;
}

// What a layout of (possibly rewritten) `scene` shows, counted against the FULL request `full`.
function coverage(full, scene, layout) {
	const L = (layout && layout.labels) || {}, req = {};
	scene.labels.forEach(function (r) { req[r.id] = r; });
	const o = { labels: 0, shown: 0, top: 0, ids: 0, values: 0, valuesReq: 0, topReq: 0 };
	full.labels.forEach(function (fr) {
		o.labels++;
		fr.rows.forEach(function (r) { if (r.field !== 'id') { o.valuesReq++; } });
		const topField = fr.rows[topRow(full, fr)].field;
		if (topField !== 'id') { o.topReq++; }
		const p = L[fr.id], r = req[fr.id];
		if (!p || !p.shown || !r) { return; }
		o.shown++;
		(p.rows || []).forEach(function (i) {
			const row = r.rows[i];
			if (!row) { return; }
			if (row.field === 'id') { o.ids++; } else { o.values++; }
			if (row.field === topField && topField !== 'id') { o.top++; }
		});
	});
	return o;
}

// ---- the gaps between a node's pipes -----------------------------------------------------------
function norm(a) { a %= 360; return a < 0 ? a + 360 : a; }
// The directions (degrees, screen: 0 east, 90 south) in which the pipes leave each node.
function pipeDirections(scene) {
	const at = {};
	scene.links.forEach(function (l) {
		const P = l.points;
		if (!P || P.length < 2) { return; }
		const a = P[0], b = P[1], z = P[P.length - 1], y = P[P.length - 2];
		(at[l.from] = at[l.from] || []).push(norm(Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI));
		(at[l.to] = at[l.to] || []).push(norm(Math.atan2(y[1] - z[1], y[0] - z[0]) * 180 / Math.PI));
	});
	return at;
}
// Gaps between consecutive directions, widest first: [{from, width}], from = start angle going
// clockwise on screen (increasing degrees).
function gaps(dirs) {
	const d = dirs.slice().sort(function (a, b) { return a - b; }), out = [];
	for (let i = 0; i < d.length; i++) {
		const a = d[i], b = i + 1 < d.length ? d[i + 1] : d[0] + 360;
		out.push({ from: a, width: b - a });
	}
	return out.sort(function (x, y) { return y.width - x.width || x.from - y.from; });
}
function rankOf(gs, deg) {
	for (let k = 0; k < gs.length; k++) {
		const off = norm(deg - gs[k].from);
		if (off > 0 && off < gs[k].width) { return k + 1; }
	}
	return null;   // exactly along a pipe
}

// Every free direction at the nearest reach where any is free: round 5's room search (metrics.js,
// itself room.js through a grid), enumerating instead of stopping at the first.
function freeDirections(scene, O, req, rows, reachRows) {
	const text = scene.text, row = text.rowHeightPx, vp = scene.viewport, a = req.anchor;
	const ownNode = req.owner, nodeSym = O.nodeById[ownNode];
	const r0 = nodeSym ? Math.max(nodeSym.symbol.w, nodeSym.symbol.h) / 2 : 0;
	function hit(p, q) { return p.x0 < q.x1 && q.x0 < p.x1 && p.y0 < q.y1 && q.y0 < p.y1; }
	function bb(pts) { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; pts.forEach(function (p) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }); return { x0: x0, y0: y0, x1: x1, y1: y1 }; }
	for (let k = 0; k <= reachRows * 2; k++) {
		const len = r0 + 1 + k * row / 2, free = [];
		for (let deg = 0; deg < 360; deg += 15) {
			const rad = deg * Math.PI / 180, ex = a.x + len * Math.cos(rad), ey = a.y + len * Math.sin(rad);
			const east = Math.cos(rad) > 0.26, west = Math.cos(rad) < -0.26;
			const pl = { shown: true, rows: rows, layout: req.layout, align: west ? 'right' : 'left', x: 0, y: 0 };
			const bs = C.blockSize(req, pl, text);
			pl.x = east ? ex : (west ? ex - bs.w : ex - bs.w / 2);
			pl.y = Math.sin(rad) < -0.26 ? ey - bs.h : (Math.sin(rad) > 0.26 ? ey : ey - bs.h / 2);
			if (pl.x < vp.x || pl.y < vp.y || pl.x + bs.w > vp.x + vp.w || pl.y + bs.h > vp.y + vp.h) { continue; }
			const mine = C.placementBoxes(req, pl, text), mbb = bb([].concat.apply([], mine.map(C.corners)));
			if (O.boxes.query(mbb, function (o) { return o.label !== req.id && hit(mbb, o.bb) && mine.some(function (m) { return C.boxesOverlap(m, o.box); }); })) { continue; }
			if (O.segs.query(mbb, function (s) { return hit(mbb, s.bb) && mine.some(function (m) { return C.segHitsBox(s.p, s.q, m); }); })) { continue; }
			if (k > 0) {
				const st = [a.x, a.y], en = [ex, ey], lbb = bb([st, en]);
				if (O.symbols.query(lbb, function (s) { return s.node !== ownNode && hit(lbb, s.bb) && C.segHitsBox(st, en, s.box); })) { continue; }
				if (O.leaders.query(lbb, function (ld) {
					if (ld.label === req.id || !hit(lbb, ld.bb)) { return false; }
					for (let i = 1; i < ld.pts.length; i++) { if (C.segsCross(st, en, ld.pts[i - 1], ld.pts[i])) { return true; } }
					return false;
				})) { continue; }
			}
			free.push(deg);
		}
		if (free.length) { return free; }
	}
	return [];
}

// Per view: node labels at nodes with two or more pipes on screen-relevant geometry.
//   hidden: hidden node labels with free ground for their ID row within 3 rows, by the best rank
//           of a gap holding any of that free ground (r1, r2, r3+), and how many gaps they had;
//   placed: shown node labels, by the rank of the gap holding the direction from the node to the
//           middle of the block (r1, r2, r3+), and the share of the circle the widest gap takes
//           (what a direction drawn at random would land in the widest gap).
function gapStats(scene, layout) {
	const L = (layout && layout.labels) || {}, dirs = pipeDirections(scene), O = Mx.index(scene, layout);
	const o = { hidRoom: 0, hid1: 0, hid2: 0, hid3: 0, placed: 0, pl1: 0, pl2: 0, pl3: 0, widestShare: 0 };
	scene.labels.forEach(function (req) {
		if (req.kind !== 'node' || req.hand) { return; }
		const d = dirs[req.owner];
		if (!d || d.length < 2) { return; }
		const gs = gaps(d), p = L[req.id];
		if (p && p.shown) {
			const bs = C.blockSize(req, p, scene.text);
			const cx = p.x + bs.w / 2, cy = p.y + bs.h / 2;
			const r = rankOf(gs, norm(Math.atan2(cy - req.anchor.y, cx - req.anchor.x) * 180 / Math.PI));
			if (r === null) { return; }
			o.placed++; o.widestShare += gs[0].width / 360;
			if (r === 1) { o.pl1++; } else if (r === 2) { o.pl2++; } else { o.pl3++; }
			return;
		}
		const idRows = req.rows.map(function (r, i) { return r.field === 'id' ? i : -1; }).filter(function (i) { return i >= 0; });
		const free = freeDirections(scene, O, req, idRows.length ? idRows : [0], 3);
		if (!free.length) { return; }
		let best = Infinity;
		free.forEach(function (deg) { const r = rankOf(gs, deg); if (r !== null && r < best) { best = r; } });
		if (best === Infinity) { return; }
		o.hidRoom++;
		if (best === 1) { o.hid1++; } else if (best === 2) { o.hid2++; } else { o.hid3++; }
	});
	o.widestShare = +o.widestShare.toFixed(3);   // a SUM over `placed`; divide to get the mean
	return o;
}

module.exports = { topRow, armScene, coverage, pipeDirections, gaps, rankOf, gapStats };
