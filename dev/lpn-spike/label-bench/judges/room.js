// JUDGES ONLY. BUILDERS MUST NOT READ THIS DIRECTORY (dev/label-placement-rules.md §5, Tom's Q11).
//
// "WHERE FREE SPACE EXISTS WITHIN REACH": the one question R-075 asks of a label a longer ID hid or
// cut. Given a finished layout, is there a spot for this label (or for the rows it lost) that is
// FREE GROUND in that same layout -- on screen, over no symbol, no other label, no Text object and
// no pipe -- reached by a straight leader of at most `reachRows` text rows that passes through no
// other node's symbol and crosses no other leader? If so, the placer hid or cut it with room to
// spare. If not, hiding it was the honest answer to a crowded map.
//
// The search is deliberately plain (every 15 degrees, every half row out to the reach, the block
// hung on the edge its leader arrives at, R5), so a "no room" answer means "no room a simple search
// finds", never a claim that no cleverer arrangement exists. It never moves anything else: the rest
// of the layout is taken as the placer left it.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const C = require('../contract.js');

function bb(pts) {
	let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
	pts.forEach(function (p) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
	return { x0: x0, y0: y0, x1: x1, y1: y1 };
}
function boxBB(b) { return bb(C.corners(b)); }
function hit(a, b) { return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1; }

// Everything a candidate must stay off, built once per (scene, layout).
const cache = new WeakMap();
function obstaclesOf(scene, layout) {
	const key = layout || {};
	if (cache.has(key)) { return cache.get(key); }
	const L = (layout && layout.labels) || {}, req = {};
	scene.labels.forEach(function (r) { req[r.id] = r; });
	const boxes = [], segs = [], leaders = [], symbols = [];
	scene.nodes.forEach(function (n) {
		const b = C.rectToOBox(n.symbol);
		const o = { box: b, bb: boxBB(b), node: n.id };
		boxes.push(o); symbols.push(o);
	});
	scene.links.forEach(function (l) {
		(l.symbols || []).forEach(function (b) { boxes.push({ box: b, bb: boxBB(b) }); });
		for (let i = 1; i < l.points.length; i++) {
			const p = l.points[i - 1], q = l.points[i];
			segs.push({ p: p, q: q, link: l.id, bb: bb([p, q]) });
		}
	});
	(scene.furniture || []).forEach(function (f) { const b = C.rectToOBox(f); boxes.push({ box: b, bb: boxBB(b) }); });
	scene.texts.forEach(function (t) {
		boxes.push({ box: t.box, bb: boxBB(t.box) });
		if (t.leader) { leaders.push({ pts: t.leader, bb: bb(t.leader) }); }
	});
	Object.keys(L).forEach(function (id) {
		const p = L[id];
		if (!p || !p.shown || !req[id]) { return; }
		C.placementBoxes(req[id], p, scene.text).forEach(function (b) { boxes.push({ box: b, bb: boxBB(b), label: id }); });
		if (p.leader && p.leader.length >= 2) { leaders.push({ pts: p.leader, bb: bb(p.leader), label: id }); }
	});
	const out = { boxes: boxes, segs: segs, leaders: leaders, symbols: symbols };
	cache.set(key, out);
	return out;
}

// A candidate for `req` showing rows `rows` (indices into req.rows): null when no free ground is
// within reach, else {x, y, align, leader} (a Placement without `shown`).
function roomWithinReach(scene, layout, req, rows, opts) {
	opts = opts || {};
	const reachRows = opts.reachRows === undefined ? 3 : opts.reachRows;
	const O = obstaclesOf(scene, layout), text = scene.text, row = text.rowHeightPx, vp = scene.viewport;
	const ownLink = req.kind === 'link' ? req.owner : null, ownNode = req.kind === 'node' ? req.owner : null;
	const nodeSym = ownNode ? scene.nodes.find(function (n) { return n.id === ownNode; }) : null;
	const r0 = nodeSym ? Math.max(nodeSym.symbol.w, nodeSym.symbol.h) / 2 : 0;
	const layoutKind = req.layout;
	const a = req.anchor;
	for (let k = 0; k <= reachRows * 2; k++) {
		const len = r0 + 1 + k * row / 2;
		for (let deg = 0; deg < 360; deg += 15) {
			const rad = deg * Math.PI / 180, ex = a.x + len * Math.cos(rad), ey = a.y + len * Math.sin(rad);
			const east = Math.cos(rad) > 0.26, west = Math.cos(rad) < -0.26;
			const align = west ? 'right' : 'left';
			const pl = { shown: true, rows: rows, layout: layoutKind, align: align, x: 0, y: 0 };
			const bs = C.blockSize(req, pl, text);
			pl.x = east ? ex : (west ? ex - bs.w : ex - bs.w / 2);
			pl.y = Math.sin(rad) < -0.26 ? ey - bs.h : (Math.sin(rad) > 0.26 ? ey : ey - bs.h / 2);
			if (pl.x < vp.x || pl.y < vp.y || pl.x + bs.w > vp.x + vp.w || pl.y + bs.h > vp.y + vp.h) { continue; }
			const mine = C.placementBoxes(req, pl, text), mbb = bb([].concat.apply([], mine.map(C.corners)));
			let bad = O.boxes.some(function (o) {
				if (o.label === req.id || !hit(mbb, o.bb)) { return false; }
				return mine.some(function (m) { return C.boxesOverlap(m, o.box); });
			});
			if (bad) { continue; }
			bad = O.segs.some(function (s) {
				if (s.link === ownLink || !hit(mbb, s.bb)) { return false; }
				return mine.some(function (m) { return C.segHitsBox(s.p, s.q, m); });
			});
			if (bad) { continue; }
			// The leader, when the block does not already touch the owner.
			const start = [a.x, a.y], end = [ex, ey];
			if (k > 0) {
				const lbb = bb([start, end]);
				bad = O.symbols.some(function (s) { return s.node !== ownNode && hit(lbb, s.bb) && C.segHitsBox(start, end, s.box); })
					|| O.leaders.some(function (ld) {
						if (ld.label === req.id || !hit(lbb, ld.bb)) { return false; }
						for (let i = 1; i < ld.pts.length; i++) { if (C.segsCross(start, end, ld.pts[i - 1], ld.pts[i])) { return true; } }
						return false;
					});
				if (bad) { continue; }
				pl.leader = [start, end];
			} else {
				pl.leader = null;
			}
			return pl;
		}
	}
	return null;
}

module.exports = { roomWithinReach, obstaclesOf };
