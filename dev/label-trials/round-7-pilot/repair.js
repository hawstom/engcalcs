// ROUND 7 PILOT: A PLACER BUILT ON THE MEASURER. JUDGES' SIDE: builders must not read dev/label-trials/.
//
// Tom, 2026-10-06, on the R1 measurer: "If we can measure it, does that mean we can build it?" This
// is the most direct answer: a REPAIR PASS. Some placer lays the view out; then, for each label it
// hid, ask the measurer (judges/room.js's search: every 15 degrees, every half row out to 3 rows, on
// screen, over no symbol, label, Text or pipe, a straight leader through no other node's symbol and
// across no other leader) for a free spot, and put the label there. Each placement becomes an
// obstacle for the next, which is the whole difficulty: the measurer asks about one label against a
// FINISHED layout, and placing one label changes the room for every other.
//
// Two orders, to show that it matters:
//   rich: each hidden label, in request order, takes the most rows that fit (all of them, then
//         dropping in the user's drop order), so early labels can eat the room of later ones.
//   strict: lean, but refusing a spot that puts the label over another label's leader or runs its
//         leader through another label's text (the measurer allows both; see draw-room.js).
//   lean: first every hidden label takes its smallest form (the last value in the drop order), so
//         as many labels as possible come back; then each repaired label grows in place if it can.
// Obstacles only ever grow in one pass, so a second pass would find nothing: one pass is the fixed
// point, and after `lean` no hidden label has room for its smallest form by the measurer's own test.
// That is circular by construction, which is why the report leans on the other numbers.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const C = require('../../lpn-spike/label-bench/contract.js');
const Mx = require('../round-5-2026-09-29/metrics.js');

function bb(pts) {
	let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
	for (let i = 0; i < pts.length; i++) { const p = pts[i]; if (p[0] < x0) { x0 = p[0]; } if (p[1] < y0) { y0 = p[1]; } if (p[0] > x1) { x1 = p[0]; } if (p[1] > y1) { y1 = p[1]; } }
	return { x0: x0, y0: y0, x1: x1, y1: y1 };
}
function boxBB(b) { return bb(C.corners(b)); }
function shrink(b) { return { cx: b.cx, cy: b.cy, w: Math.max(0, b.w - 2 * C.EPS), h: Math.max(0, b.h - 2 * C.EPS), angle: b.angle || 0 }; }
function hit(a, b) { return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1; }

// room.js roomWithinReach(), candidate for candidate (through round 5's grid index), returning the
// placement rather than true. Items marked `dead` (a label's own old ink, when it grows) are skipped.
function spot(scene, O, req, rows, reachRows, valid, strict) {
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
				if (o.dead || o.label === req.id || !hit(mbb, o.bb)) { return false; }
				return mine.some(function (m) { return C.boxesOverlap(m, o.box); });
			});
			if (bad) { continue; }
			bad = O.segs.query(mbb, function (s) {
				if (s.link === ownLink || !hit(mbb, s.bb)) { return false; }
				return mine.some(function (m) { return C.segHitsBox(s.p, s.q, m); });
			});
			if (bad) { continue; }
			// STRICT (not the measurer): the block must not lie over another label's leader either. The
			// measurer lets it, so "room" may be ground under a leader: label on leader, the rules'
			// second-worst crossing.
			if (strict && O.leaders.query(mbb, function (ld) {
				if (ld.dead || ld.label === req.id || !hit(mbb, ld.bb)) { return false; }
				return mine.some(function (m) { const sm = shrink(m); for (let i = 1; i < ld.pts.length; i++) { if (C.segHitsBox(ld.pts[i - 1], ld.pts[i], sm)) { return true; } } return false; });
			})) { continue; }
			const start = [a.x, a.y], end = [ex, ey];
			if (k > 0) {
				const lbb = bb([start, end]);
				bad = O.symbols.query(lbb, function (s) { return s.node !== ownNode && hit(lbb, s.bb) && C.segHitsBox(start, end, s.box); })
					|| O.leaders.query(lbb, function (ld) {
						if (ld.dead || ld.label === req.id || !hit(lbb, ld.bb)) { return false; }
						for (let i = 1; i < ld.pts.length; i++) { if (C.segsCross(start, end, ld.pts[i - 1], ld.pts[i])) { return true; } }
						return false;
					});
				if (bad) { continue; }
				// STRICT: nor may its leader run through another label's text.
				if (strict && O.boxes.query(lbb, function (o) { return !o.dead && o.label && o.label !== req.id && hit(lbb, o.bb) && C.segHitsBox(start, end, shrink(o.box)); })) { continue; }
				pl.leader = [start, end];
				// The measurer hangs a stack centred over or under its node with its rows LEFT-aligned, so
				// a narrow end row can miss the leader's end: the bench calls that placement invalid. The
				// measurer counts it as room anyway (a blind spot); a placer must not use it.
				if (valid && !mine.some(function (m) { return C.distToOBox(end, m) <= 1.5; })) { continue; }
			} else {
				pl.leader = null;
			}
			return pl;
		}
	}
	return null;
}

// The row sets a label may show, richest first: all rows, then dropping in the user's drop order
// (first to go first; a field not in the order goes before every listed one), down to one row.
function rowSets(scene, req) {
	const order = C.dropOrderOf(scene, req.kind);
	const idx = req.rows.map(function (r, i) { return i; });
	const byGo = idx.slice().sort(function (i, j) { return order.indexOf(req.rows[i].field) - order.indexOf(req.rows[j].field); });
	const out = [];
	for (let k = 0; k < byGo.length; k++) { out.push(byGo.slice(k).sort(function (a, b) { return a - b; })); }
	return out;
}

function addPlaced(scene, O, req, pl) {
	const items = [];
	C.placementBoxes(req, pl, scene.text).forEach(function (b) { const it = { box: b, bb: boxBB(b), label: req.id }; O.boxes.add(it); items.push(it); });
	if (pl.leader) { const it = { pts: pl.leader, bb: bb(pl.leader), label: req.id }; O.leaders.add(it); items.push(it); }
	return items;
}

// Repairs `layout` in place for `scene`. Returns how many labels it brought back.
function repair(scene, layout, mode, reachRows) {
	reachRows = reachRows === undefined ? 3 : reachRows;
	const strict = mode === 'strict';
	const L = layout.labels = layout.labels || {};
	const O = Mx.index(scene, layout);
	const hidden = scene.labels.filter(function (r) { return !r.hand && !(L[r.id] && L[r.id].shown); });
	let back = 0;
	if (mode === 'rich') {
		hidden.forEach(function (req) {
			const sets = rowSets(scene, req);
			for (let s = 0; s < sets.length; s++) {
				const pl = spot(scene, O, req, sets[s], reachRows, true, strict);
				if (pl) { L[req.id] = pl; addPlaced(scene, O, req, pl); back++; return; }
			}
		});
		return back;
	}
	// lean
	const placed = [];
	hidden.forEach(function (req) {
		const sets = rowSets(scene, req), pl = spot(scene, O, req, sets[sets.length - 1], reachRows, true, strict);
		if (pl) { L[req.id] = pl; placed.push({ req: req, items: addPlaced(scene, O, req, pl), sets: sets }); back++; }
	});
	placed.forEach(function (p) {
		for (let s = 0; s < p.sets.length - 1; s++) {
			const pl = spot(scene, O, p.req, p.sets[s], reachRows, true, strict);
			if (pl) {
				p.items.forEach(function (it) { it.dead = true; });
				L[p.req.id] = pl;
				addPlaced(scene, O, p.req, pl);
				return;
			}
		}
	});
	return back;
}

// With no placer underneath, hand-placed labels still hang at their user's point (N4), as
// placers/trivial.js hangs them; the generated scenes of the pilot have none, so its numbers are
// unchanged by this (added for round 7's public scenes).
function handOnly(scene) {
	const out = {};
	scene.labels.forEach(function (req) {
		if (!req.hand) { return; }
		const rows = req.rows.map(function (r, i) { return i; });
		out[req.id] = { shown: true, rows: rows, layout: req.layout, align: 'left', x: req.hand.x, y: req.hand.y - req.rows[0].h / 2, leader: null };
	});
	return out;
}

// A placer module wrapping another with the repair pass. `inner` is a module path or null (null:
// the measurer is the whole placer, starting from an empty map).
function wrap(innerPath, mode) {
	const mod = innerPath ? require(innerPath) : null;
	return {
		create: function () {
			const inner = mod ? (typeof mod.create === 'function' ? mod.create() : mod) : null;
			return {
				name: (inner ? inner.name || innerPath : 'empty') + '+' + mode,
				idle: inner && typeof inner.idle === 'function' ? function (ms, ctx) { return inner.idle(ms, ctx); } : undefined,
				place: function (scene, opts) {
					const out = inner ? inner.place(scene, opts) : { labels: handOnly(scene) };
					// A copy, so the inner placer's own record of what it returned is untouched.
					const labels = Object.assign({}, (out && out.labels) || {});
					const lay = { labels: labels };
					if (mode !== 'none') { repair(scene, lay, mode); }
					return lay;
				}
			};
		}
	};
}

module.exports = { repair, wrap, rowSets, spot };
