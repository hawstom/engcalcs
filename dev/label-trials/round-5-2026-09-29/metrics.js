// ROUND 5: THE METRICS THE BENCH LACKS, for rule G ("use convenient available space effectively,
// and drop properties, then labels, when all else fails").
//
// MISSED ROOM. For each label a layout HID, is there free ground within reach for its ID row
// alone? For each label it CUT (showed fewer rows than requested), is there free ground within
// reach for the whole label? Either is space left unused while something was dropped: what G says
// happens only "when all else fails".
//
// "Free ground within reach" is EXACTLY the judges' room.js test (judges/room.js,
// roomWithinReach(): every 15 degrees, every half row out to `reachRows` rows, on screen, over no
// symbol, label, Text, furniture or pipe, a straight leader through no other node's symbol and
// across no other leader). room.js scans every obstacle for every candidate, which is fine on
// Novato and hopeless at 3,000 labels, so this file answers the same question through a uniform
// grid. `selftest.js` in this folder proves the two agree on every label of a sample of scenes.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const C = require('../../lpn-spike/label-bench/contract.js');

function bb(pts) {
	let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
	for (let i = 0; i < pts.length; i++) { const p = pts[i]; if (p[0] < x0) { x0 = p[0]; } if (p[1] < y0) { y0 = p[1]; } if (p[0] > x1) { x1 = p[0]; } if (p[1] > y1) { y1 = p[1]; } }
	return { x0: x0, y0: y0, x1: x1, y1: y1 };
}
function boxBB(b) { return bb(C.corners(b)); }
function hit(a, b) { return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1; }

// A uniform grid over the viewport (plus a margin), holding items by their bounding boxes.
function Grid(vp, cell) {
	const x0 = vp.x - 64, y0 = vp.y - 64, nx = Math.ceil((vp.w + 128) / cell), ny = Math.ceil((vp.h + 128) / cell);
	const cells = new Array(nx * ny);
	let stamp = 0;
	function range(b) {
		return [Math.max(0, Math.floor((b.x0 - x0) / cell)), Math.min(nx - 1, Math.floor((b.x1 - x0) / cell)),
			Math.max(0, Math.floor((b.y0 - y0) / cell)), Math.min(ny - 1, Math.floor((b.y1 - y0) / cell))];
	}
	return {
		add: function (item) {
			const b = item.bb;
			if (b.x1 < x0 || b.y1 < y0 || b.x0 > x0 + nx * cell || b.y0 > y0 + ny * cell) { return; }
			const r = range(b);
			for (let i = r[0]; i <= r[1]; i++) { for (let j = r[2]; j <= r[3]; j++) { const k = j * nx + i; (cells[k] = cells[k] || []).push(item); } }
		},
		// Every item whose cell range meets `b`, once each.
		query: function (b, fn) {
			const r = range(b);
			stamp++;
			for (let i = r[0]; i <= r[1]; i++) {
				for (let j = r[2]; j <= r[3]; j++) {
					const c = cells[j * nx + i];
					if (!c) { continue; }
					for (let t = 0; t < c.length; t++) {
						const it = c[t];
						if (it._s === stamp) { continue; }
						it._s = stamp;
						if (fn(it)) { return true; }
					}
				}
			}
			return false;
		}
	};
}

// The obstacles of one finished layout, indexed. Same membership as room.js obstaclesOf().
function index(scene, layout) {
	const L = (layout && layout.labels) || {}, req = {}, vp = scene.viewport;
	scene.labels.forEach(function (r) { req[r.id] = r; });
	const boxes = Grid(vp, 48), segs = Grid(vp, 48), leaders = Grid(vp, 48), symbols = Grid(vp, 48);
	scene.nodes.forEach(function (n) {
		const b = C.rectToOBox(n.symbol), o = { box: b, bb: boxBB(b), node: n.id };
		boxes.add(o); symbols.add({ box: b, bb: o.bb, node: n.id });
	});
	scene.links.forEach(function (l) {
		(l.symbols || []).forEach(function (b) { boxes.add({ box: b, bb: boxBB(b) }); });
		for (let i = 1; i < l.points.length; i++) {
			const p = l.points[i - 1], q = l.points[i];
			segs.add({ p: p, q: q, link: l.id, bb: bb([p, q]) });
		}
	});
	(scene.furniture || []).forEach(function (f) { const b = C.rectToOBox(f); boxes.add({ box: b, bb: boxBB(b) }); });
	scene.texts.forEach(function (t) {
		boxes.add({ box: t.box, bb: boxBB(t.box) });
		if (t.leader) { leaders.add({ pts: t.leader, bb: bb(t.leader) }); }
	});
	Object.keys(L).forEach(function (id) {
		const p = L[id];
		if (!p || !p.shown || !req[id]) { return; }
		C.placementBoxes(req[id], p, scene.text).forEach(function (b) { boxes.add({ box: b, bb: boxBB(b), label: id }); });
		if (p.leader && p.leader.length >= 2) { leaders.add({ pts: p.leader, bb: bb(p.leader), label: id }); }
	});
	const nodeById = {};
	scene.nodes.forEach(function (n) { nodeById[n.id] = n; });
	return { boxes: boxes, segs: segs, leaders: leaders, symbols: symbols, nodeById: nodeById };
}

// room.js roomWithinReach(), candidate for candidate, through the index.
function roomWithinReach(scene, O, req, rows, reachRows) {
	reachRows = reachRows === undefined ? 3 : reachRows;
	const text = scene.text, row = text.rowHeightPx, vp = scene.viewport;
	const ownLink = req.kind === 'link' ? req.owner : null, ownNode = req.kind === 'node' ? req.owner : null;
	const nodeSym = ownNode ? O.nodeById[ownNode] : null;
	const r0 = nodeSym ? Math.max(nodeSym.symbol.w, nodeSym.symbol.h) / 2 : 0;
	const a = req.anchor;
	for (let k = 0; k <= reachRows * 2; k++) {
		const len = r0 + 1 + k * row / 2;
		for (let deg = 0; deg < 360; deg += 15) {
			const rad = deg * Math.PI / 180, ex = a.x + len * Math.cos(rad), ey = a.y + len * Math.sin(rad);
			const east = Math.cos(rad) > 0.26, west = Math.cos(rad) < -0.26;
			const pl = { shown: true, rows: rows, layout: req.layout, align: west ? 'right' : 'left', x: 0, y: 0 };
			const bs = C.blockSize(req, pl, text);
			pl.x = east ? ex : (west ? ex - bs.w : ex - bs.w / 2);
			pl.y = Math.sin(rad) < -0.26 ? ey - bs.h : (Math.sin(rad) > 0.26 ? ey : ey - bs.h / 2);
			if (pl.x < vp.x || pl.y < vp.y || pl.x + bs.w > vp.x + vp.w || pl.y + bs.h > vp.y + vp.h) { continue; }
			const mine = C.placementBoxes(req, pl, text), mbb = bb([].concat.apply([], mine.map(C.corners)));
			let bad = O.boxes.query(mbb, function (o) {
				if (o.label === req.id || !hit(mbb, o.bb)) { return false; }
				return mine.some(function (m) { return C.boxesOverlap(m, o.box); });
			});
			if (bad) { continue; }
			bad = O.segs.query(mbb, function (s) {
				if (s.link === ownLink || !hit(mbb, s.bb)) { return false; }
				return mine.some(function (m) { return C.segHitsBox(s.p, s.q, m); });
			});
			if (bad) { continue; }
			const start = [a.x, a.y], end = [ex, ey];
			if (k > 0) {
				const lbb = bb([start, end]);
				bad = O.symbols.query(lbb, function (s) { return s.node !== ownNode && hit(lbb, s.bb) && C.segHitsBox(start, end, s.box); })
					|| O.leaders.query(lbb, function (ld) {
						if (ld.label === req.id || !hit(lbb, ld.bb)) { return false; }
						for (let i = 1; i < ld.pts.length; i++) { if (C.segsCross(start, end, ld.pts[i - 1], ld.pts[i])) { return true; } }
						return false;
					});
				if (bad) { continue; }
			}
			return true;
		}
	}
	return false;
}

// G for one view: hidden labels with room for their ID row; cut labels with room for all rows.
function missedRoom(scene, layout, reachRows) {
	const L = (layout && layout.labels) || {}, O = index(scene, layout);
	let hidden = 0, hiddenWithRoom = 0, cut = 0, cutWithRoom = 0;
	scene.labels.forEach(function (req) {
		if (req.hand) { return; }
		const p = L[req.id], all = req.rows.map(function (r, i) { return i; });
		if (!p || !p.shown) {
			hidden++;
			const idRows = req.rows.map(function (r, i) { return r.field === 'id' ? i : -1; }).filter(function (i) { return i >= 0; });
			if (roomWithinReach(scene, O, req, idRows.length ? idRows : [0], reachRows)) { hiddenWithRoom++; }
		} else if (p.rows.length < req.rows.length) {
			cut++;
			if (roomWithinReach(scene, O, req, all, reachRows)) { cutWithRoom++; }
		}
	});
	return { hidden: hidden, hiddenWithRoom: hiddenWithRoom, cut: cut, cutWithRoom: cutWithRoom };
}

// Values (non-ID rows) requested and shown.
function values(scene, layout) {
	const L = (layout && layout.labels) || {};
	let req = 0, shown = 0;
	scene.labels.forEach(function (r) {
		r.rows.forEach(function (row) { if (row.field !== 'id') { req++; } });
		const p = L[r.id];
		if (p && p.shown && Array.isArray(p.rows)) { p.rows.forEach(function (i) { if (r.rows[i] && r.rows[i].field !== 'id') { shown++; } }); }
	});
	return { req: req, shown: shown };
}

module.exports = { index, roomWithinReach, missedRoom, values };
