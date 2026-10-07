// ROOM CHECK: THE SELF-TEST FOR R1's FIRST HALF ("Hide a label only because there is no room for it
// on screen"). Builders may read and call this file.
//
//   node dev/lpn-spike/label-bench/run.js --placer <your-placer.js> --room
//
//   const { roomReport } = require('./room-check.js');
//   const r = roomReport(scene, layout);   // on your own output, in your own loop
//   // r.hidden, r.hiddenWithRoom, r.cut, r.cutWithRoom, r.ids.{hiddenWithRoom, cutWithRoom},
//   // r.spots: {labelId: placement}
//
// THE QUESTION. For each label a finished layout HID: is there free ground for its smallest form
// (the one row it keeps longest, the last in the user's drop order) within reach of its owner? For
// each label it CUT (fewer rows than requested): is there free ground for the whole label? A label
// hidden with room was not hidden for lack of room. R1's first half is SCORED, never passed or
// failed: this is the score.
//
// THE SEARCH, deliberately plain: a straight leader from the label's anchor every 15 degrees, every
// half row out to 3 rows (and the block touching its owner); the block hung on the edge its leader
// arrives at (R5); on screen; over no node symbol, pump or valve symbol, other label, Text object,
// page furniture or pipe (its own pipe excepted); its leader through no other node's symbol and
// across no other leader.
//
// WHAT IT DOES NOT SEE (read its number as a score, not as the truth):
//   - It asks about ONE LABEL AT A TIME against the finished layout. Two hidden labels may both be
//     told "room" for the same ground, and only one can have it, so the count is not how many more
//     labels could be shown at once. Placing one label changes the room for the others.
//   - It lets the label sit over another label's LEADER, and lets its own leader run through another
//     label's TEXT. Both are crossings the rules charge for (label on leader is the second worst).
//   - It never puts a label across a pipe, though the rules only charge for that. It tries pipe
//     labels level only, never turned along their pipe (R14), and never the standard hook.
//   - Reach is fixed at 3 rows. "Convenient" is undefined on purpose; 3 rows is only this tool's.
//   - Flow arrows and customers are not obstacles (the bench does not score them either).
// The judges score R1 with a stricter and finer version of this question that builders do not see.
//
// `spots` holds, for each label counted with room, one placement the search found for it, checked to
// be a valid placement (its leader reaches its text). Each was found alone; together they may
// overlap.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const C = require('./contract.js');

const REACH_ROWS = 3;

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
		// Calls fn on every item whose cells meet `b`, once each; true as soon as fn returns true.
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

// Everything a candidate must stay off, for one finished layout. You may add your own placements to
// it as you go with addPlacement(), which is how a repair pass would use it.
function makeIndex(scene, layout) {
	const L = (layout && layout.labels) || {}, req = {}, vp = scene.viewport;
	scene.labels.forEach(function (r) { req[r.id] = r; });
	const O = { boxes: Grid(vp, 48), segs: Grid(vp, 48), leaders: Grid(vp, 48), symbols: Grid(vp, 48), nodeById: {} };
	scene.nodes.forEach(function (n) {
		const b = C.rectToOBox(n.symbol), o = { box: b, bb: boxBB(b), node: n.id };
		O.boxes.add(o); O.symbols.add({ box: b, bb: o.bb, node: n.id });
		O.nodeById[n.id] = n;
	});
	scene.links.forEach(function (l) {
		(l.symbols || []).forEach(function (b) { O.boxes.add({ box: b, bb: boxBB(b) }); });
		for (let i = 1; i < l.points.length; i++) {
			const p = l.points[i - 1], q = l.points[i];
			O.segs.add({ p: p, q: q, link: l.id, bb: bb([p, q]) });
		}
	});
	(scene.furniture || []).forEach(function (f) { const b = C.rectToOBox(f); O.boxes.add({ box: b, bb: boxBB(b) }); });
	scene.texts.forEach(function (t) {
		O.boxes.add({ box: t.box, bb: boxBB(t.box) });
		if (t.leader) { O.leaders.add({ pts: t.leader, bb: bb(t.leader) }); }
	});
	Object.keys(L).forEach(function (id) {
		const p = L[id];
		if (p && p.shown && req[id]) { addPlacement(scene, O, req[id], p); }
	});
	return O;
}
function addPlacement(scene, O, req, pl) {
	C.placementBoxes(req, pl, scene.text).forEach(function (b) { O.boxes.add({ box: b, bb: boxBB(b), label: req.id }); });
	if (pl.leader && pl.leader.length >= 2) { O.leaders.add({ pts: pl.leader, bb: bb(pl.leader), label: req.id }); }
}

// One free spot for `req` showing `rows` (ascending indices into req.rows), or null. With `valid`,
// a candidate whose leader would not reach its own text (a stack hung straight above or below its
// node, left-aligned, with a narrow end row) is skipped; without it, it counts, as the judges' plain
// search counts it.
function findSpot(scene, O, req, rows, opts) {
	opts = opts || {};
	const reachRows = opts.reachRows === undefined ? REACH_ROWS : opts.reachRows;
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
			if (O.boxes.query(mbb, function (o) {
				if (o.label === req.id || !hit(mbb, o.bb)) { return false; }
				return mine.some(function (m) { return C.boxesOverlap(m, o.box); });
			})) { continue; }
			if (O.segs.query(mbb, function (s) {
				if (s.link === ownLink || !hit(mbb, s.bb)) { return false; }
				return mine.some(function (m) { return C.segHitsBox(s.p, s.q, m); });
			})) { continue; }
			const start = [a.x, a.y], end = [ex, ey];
			if (k > 0) {
				const lbb = bb([start, end]);
				if (O.symbols.query(lbb, function (s) { return s.node !== ownNode && hit(lbb, s.bb) && C.segHitsBox(start, end, s.box); })
					|| O.leaders.query(lbb, function (ld) {
						if (ld.label === req.id || !hit(lbb, ld.bb)) { return false; }
						for (let i = 1; i < ld.pts.length; i++) { if (C.segsCross(start, end, ld.pts[i - 1], ld.pts[i])) { return true; } }
						return false;
					})) { continue; }
				if (opts.valid && !mine.some(function (m) { return C.distToOBox(end, m) <= 1.5; })) { continue; }
				pl.leader = [start, end];
			} else {
				pl.leader = null;
			}
			return pl;
		}
	}
	return null;
}

// The one row a label keeps longest: the last field in the user's drop order that it carries.
function smallestRows(scene, req) {
	const order = C.dropOrderOf(scene, req.kind);
	for (let k = order.length - 1; k >= 0; k--) {
		const i = req.rows.findIndex(function (r) { return r.field === order[k]; });
		if (i >= 0) { return [i]; }
	}
	return [0];
}

// The score for one view. Hand-placed labels are N4's business and are skipped.
function roomReport(scene, layout, opts) {
	opts = opts || {};
	const L = (layout && layout.labels) || {}, O = makeIndex(scene, layout);
	const out = { hidden: 0, hiddenWithRoom: 0, cut: 0, cutWithRoom: 0, ids: { hiddenWithRoom: [], cutWithRoom: [] }, spots: {} };
	scene.labels.forEach(function (req) {
		if (req.hand) { return; }
		const p = L[req.id];
		let rows, kind;
		if (!p || !p.shown) { out.hidden++; rows = smallestRows(scene, req); kind = 'hiddenWithRoom'; }
		else if ((p.rows || []).length < req.rows.length) { out.cut++; rows = req.rows.map(function (r, i) { return i; }); kind = 'cutWithRoom'; }
		else { return; }
		if (!findSpot(scene, O, req, rows, { reachRows: opts.reachRows })) { return; }
		out[kind]++;
		out.ids[kind].push(req.id);
		const spot = findSpot(scene, O, req, rows, { reachRows: opts.reachRows, valid: true });
		if (spot) { out.spots[req.id] = spot; }
	});
	return out;
}

module.exports = { roomReport, findSpot, makeIndex, addPlacement, smallestRows, Grid, REACH_ROWS };
