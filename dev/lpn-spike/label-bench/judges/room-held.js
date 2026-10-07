// JUDGES ONLY. BUILDERS MUST NOT READ THIS DIRECTORY (dev/label-placement-rules.md §5, Tom's Q11).
//
// R1's FIRST HALF, THE TWO SCORES THE BUILDERS DO NOT SEE (round 7, dev/label-trials/round-7-plan.md
// §4.4). The builders self-test with room-check.js, which asks about one label at a time with a
// plain search that has known blind spots. A builder tuned to it could exploit them, so the judges
// also score:
//
//   1. HELD-BACK ROOM: the same question ("was there room for this hidden label's smallest form?")
//      with a finer, stricter search: every 5 degrees, every quarter row, out to 5 rows, and refusing
//      ground under another label's leader and a leader through another label's text.
//   2. REALIZABLE ROOM: how many hidden labels a strict repair pass (smallest form first, each seated
//      label an obstacle for the next; the public search's grid, strict) actually brings back. It
//      does not double-count ground two labels both "had", so it answers "how many more labels could
//      this layout have shown at once, without moving anything already shown?" Per view: brought
//      back, and labels requested.
//
// The round-7 pilot (dev/label-trials/round-7-pilot/) measured why both are needed: 52-66% of the
// public search's spots overlap another's, and 34-58% lie under a leader or run a leader through text.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const C = require('../contract.js');
const RC = require('../room-check.js');

function bb(pts) {
	let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
	for (let i = 0; i < pts.length; i++) { const p = pts[i]; if (p[0] < x0) { x0 = p[0]; } if (p[1] < y0) { y0 = p[1]; } if (p[0] > x1) { x1 = p[0]; } if (p[1] > y1) { y1 = p[1]; } }
	return { x0: x0, y0: y0, x1: x1, y1: y1 };
}
function hit(a, b) { return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1; }

const HELD = { reachRows: 5, stepDeg: 5, radialRows: 0.25 };
const PLAIN = { reachRows: RC.REACH_ROWS, stepDeg: 15, radialRows: 0.5 };

// A strict spot: the public search's geometry with its own step sizes, always a valid placement,
// never over another label's leader, its leader never through another label's text (the boxes exactly as the scorer draws them, with no leading allowance).
function strictSpot(scene, O, req, rows, g) {
	const text = scene.text, row = text.rowHeightPx, vp = scene.viewport;
	const ownLink = req.kind === 'link' ? req.owner : null, ownNode = req.kind === 'node' ? req.owner : null;
	const nodeSym = ownNode ? O.nodeById[ownNode] : null;
	const r0 = nodeSym ? Math.max(nodeSym.symbol.w, nodeSym.symbol.h) / 2 : 0;
	const a = req.anchor, nk = Math.round(g.reachRows / g.radialRows);
	for (let k = 0; k <= nk; k++) {
		const len = r0 + 1 + k * row * g.radialRows;
		for (let deg = 0; deg < 360; deg += g.stepDeg) {
			const rad = deg * Math.PI / 180, ex = a.x + len * Math.cos(rad), ey = a.y + len * Math.sin(rad);
			const east = Math.cos(rad) > 0.26, west = Math.cos(rad) < -0.26;
			const pl = { shown: true, rows: rows, layout: req.layout, align: west ? 'right' : 'left', x: 0, y: 0 };
			const bs = C.blockSize(req, pl, text);
			pl.x = east ? ex : (west ? ex - bs.w : ex - bs.w / 2);
			pl.y = Math.sin(rad) < -0.26 ? ey - bs.h : (Math.sin(rad) > 0.26 ? ey : ey - bs.h / 2);
			if (pl.x < vp.x || pl.y < vp.y || pl.x + bs.w > vp.x + vp.w || pl.y + bs.h > vp.y + vp.h) { continue; }
			const mine = C.placementBoxes(req, pl, text), mbb = bb([].concat.apply([], mine.map(C.corners)));
			if (O.boxes.query(mbb, function (o) { return o.label !== req.id && hit(mbb, o.bb) && mine.some(function (m) { return C.boxesOverlap(m, o.box); }); })) { continue; }
			if (O.segs.query(mbb, function (s) { return s.link !== ownLink && hit(mbb, s.bb) && mine.some(function (m) { return C.segHitsBox(s.p, s.q, m); }); })) { continue; }
			if (O.leaders.query(mbb, function (ld) {
				if (ld.label === req.id || !hit(mbb, ld.bb)) { return false; }
				return mine.some(function (m) { const sm = m; for (let i = 1; i < ld.pts.length; i++) { if (C.segHitsBox(ld.pts[i - 1], ld.pts[i], sm)) { return true; } } return false; });
			})) { continue; }
			const start = [a.x, a.y], end = [ex, ey];
			if (k > 0) {
				const lbb = bb([start, end]);
				if (O.symbols.query(lbb, function (s) { return s.node !== ownNode && hit(lbb, s.bb) && C.segHitsBox(start, end, s.box); })) { continue; }
				if (O.leaders.query(lbb, function (ld) {
					if (ld.label === req.id || !hit(lbb, ld.bb)) { return false; }
					for (let i = 1; i < ld.pts.length; i++) { if (C.segsCross(start, end, ld.pts[i - 1], ld.pts[i])) { return true; } }
					return false;
				})) { continue; }
				if (O.boxes.query(lbb, function (o) { return o.label && o.label !== req.id && hit(lbb, o.bb) && C.segHitsBox(start, end, o.box); })) { continue; }
				if (!mine.some(function (m) { return C.distToOBox(end, m) <= 1.5; })) { continue; }
				pl.leader = [start, end];
			} else {
				pl.leader = null;
			}
			return pl;
		}
	}
	return null;
}

function hiddenOf(scene, layout) {
	const L = (layout && layout.labels) || {};
	return scene.labels.filter(function (r) { return !r.hand && !(L[r.id] && L[r.id].shown); });
}

// 1. Held-back room: of the hidden labels, those with strict, finer room (one at a time).
function heldBackRoom(scene, layout) {
	const O = RC.makeIndex(scene, layout), hidden = hiddenOf(scene, layout), ids = [];
	hidden.forEach(function (req) { if (strictSpot(scene, O, req, RC.smallestRows(scene, req), HELD)) { ids.push(req.id); } });
	return { hidden: hidden.length, withRoom: ids.length, ids: ids };
}

// 2. Realizable room: hidden labels a strict repair pass seats, smallest form first, in request order.
function realizableRoom(scene, layout) {
	const O = RC.makeIndex(scene, layout), hidden = hiddenOf(scene, layout), placed = {};
	hidden.forEach(function (req) {
		const pl = strictSpot(scene, O, req, RC.smallestRows(scene, req), PLAIN);
		if (pl) { placed[req.id] = pl; RC.addPlacement(scene, O, req, pl); }
	});
	return { hidden: hidden.length, brought: Object.keys(placed).length, requested: scene.labels.filter(function (r) { return !r.hand; }).length, placed: placed };
}

module.exports = { heldBackRoom, realizableRoom, strictSpot, HELD, PLAIN };
