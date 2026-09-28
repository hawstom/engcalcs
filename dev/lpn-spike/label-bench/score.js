// LABEL BENCH: THE SCORER. One view's layout in, the rules' numbers out.
//
// N1, N3, N4 and N5 are breaks and must be zero (dev/label-placement-rules.md §2). A leader
// crossing another leader is not one of them (there is no N2): it is a weighted crossing cost,
// like the other crossings in Tom's §3 table. Everything else -- crossing cost, coverage, leader
// length, churn, and the R5/R7/R9/R11 reported scores -- is REPORTED, never failing. Everything is
// counted in view pixels, on the ink contract.js derives.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const C = require('./contract.js');

// Tom's weights, dev/label-placement-rules.md §3.1 (Q05).
const WEIGHTS = {
	labelOnText: 1, labelOnSymbol: 1, labelOnLabel: 1, leaderOnLeader: 0.9,
	labelOnLeader: 0.7, labelOnLink: 0.3, leaderOnLink: 0.2, labelOnCustomer: 0
};

function ownersOf(scene) {
	const nodes = {}, links = {}, out = {};
	scene.nodes.forEach(function (n) { nodes[n.id] = n; });
	scene.links.forEach(function (l) { links[l.id] = l; });
	scene.labels.forEach(function (r) {
		out[r.id] = r.kind === 'node' ? { node: nodes[r.owner] } : (r.kind === 'link' ? { link: links[r.owner] } : {});
	});
	return out;
}
function segsOf(pts) {
	const out = [];
	for (let i = 1; i < pts.length; i++) { out.push([pts[i - 1], pts[i]]); }
	return out;
}
function bboxOf(boxes) {
	let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
	boxes.forEach(function (b) {
		C.corners(b).forEach(function (p) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
	});
	return { x0: x0, y0: y0, x1: x1, y1: y1 };
}
function bbHit(a, b, pad) { return a.x0 - pad < b.x1 && b.x0 - pad < a.x1 && a.y0 - pad < b.y1 && b.y0 - pad < a.y1; }

// The drawn state of one view: every shown label's ink and leader, ready to test.
function drawn(scene, layout) {
	const L = (layout && layout.labels) || {}, owners = ownersOf(scene), out = [], invalid = [];
	scene.labels.forEach(function (req) {
		const pl = L[req.id];
		if (!pl || !pl.shown) { return; }
		const why = C.invalidReason(req, pl, scene, owners);
		if (why) { invalid.push(req.id + ': ' + why); return; }
		const boxes = C.placementBoxes(req, pl, scene.text);
		const bs = C.blockSize(req, pl, scene.text);
		out.push({ id: req.id, req: req, pl: pl, boxes: boxes, bb: bboxOf(boxes), blockH: bs.h,
			leader: pl.leader && pl.leader.length >= 2 ? pl.leader : null, owner: owners[req.id] || {} });
	});
	return { items: out, invalid: invalid };
}

function scoreView(scene, layout) {
	const d = drawn(scene, layout), items = d.items;
	const breaks = { N1: [], N3: [], N4: [], N5: [], invalid: d.invalid };
	const crossings = { leaderOnLeader: [] };
	const counts = { labelOnText: 0, labelOnSymbol: 0, labelOnLabel: 0, leaderOnLeader: 0,
		labelOnLeader: 0, labelOnLink: 0, leaderOnLink: 0, labelOnCustomer: 0 };
	const symbols = [];
	scene.nodes.forEach(function (n) { symbols.push({ id: 'node ' + n.id, node: n.id, box: C.rectToOBox(n.symbol) }); });
	scene.links.forEach(function (l) { (l.symbols || []).forEach(function (b) { symbols.push({ id: 'link ' + l.id + ' symbol', box: b }); }); });
	symbols.forEach(function (s) { s.bb = bboxOf([s.box]); });
	const texts = scene.texts.map(function (t) { return { id: t.id, box: t.box, bb: bboxOf([t.box]), leader: t.leader || null }; });
	const customers = (scene.customers || []).map(function (c) { const b = C.rectToOBox(c.box); return { id: c.id, box: b, bb: bboxOf([b]) }; });
	const links = scene.links.map(function (l) { return { id: l.id, segs: segsOf(l.points), bb: bboxOf(l.points.map(function (p) { return { cx: p[0], cy: p[1], w: 0, h: 0 }; })) }; });

	function anyBoxHit(boxesA, boxesB) {
		for (let i = 0; i < boxesA.length; i++) { for (let j = 0; j < boxesB.length; j++) { if (C.boxesOverlap(boxesA[i], boxesB[j])) { return true; } } }
		return false;
	}
	function boxesOnSeg(boxes, p, q) {
		for (let i = 0; i < boxes.length; i++) { if (C.segHitsBox(p, q, boxes[i])) { return true; } }
		return false;
	}
	// ---- N1: a label on a symbol or another label. N5: a label on a Text object. ---------------
	items.forEach(function (it, i) {
		symbols.forEach(function (s) {
			if (bbHit(it.bb, s.bb, 0) && anyBoxHit(it.boxes, [s.box])) { counts.labelOnSymbol++; breaks.N1.push(it.id + ' on ' + s.id); }
		});
		texts.forEach(function (t) {
			if (bbHit(it.bb, t.bb, 0) && anyBoxHit(it.boxes, [t.box])) { counts.labelOnText++; breaks.N5.push(it.id + ' on Text ' + t.id); }
		});
		customers.forEach(function (c) {
			if (bbHit(it.bb, c.bb, 0) && anyBoxHit(it.boxes, [c.box])) { counts.labelOnCustomer++; }
		});
		for (let j = i + 1; j < items.length; j++) {
			const o = items[j];
			if (bbHit(it.bb, o.bb, 0) && anyBoxHit(it.boxes, o.boxes)) { counts.labelOnLabel++; breaks.N1.push(it.id + ' on ' + o.id); }
		}
	});
	// ---- leaders: every label leader, and the Text objects' own callouts (which are fixed) -----
	const leaders = [];
	items.forEach(function (it) { if (it.leader) { leaders.push({ id: it.id, pts: it.leader, segs: segsOf(it.leader), item: it }); } });
	texts.forEach(function (t) { if (t.leader) { leaders.push({ id: 'Text ' + t.id, pts: t.leader, segs: segsOf(t.leader), text: true }); } });
	leaders.forEach(function (ld) { ld.bb = bboxOf(ld.pts.map(function (p) { return { cx: p[0], cy: p[1], w: 0, h: 0 }; })); });
	// Leader on leader: no longer a break (N2 removed, Tom 2026-09-28); a weighted crossing cost.
	// Two of the user's own callouts crossing is not the placer's doing and is not counted.
	for (let i = 0; i < leaders.length; i++) {
		for (let j = i + 1; j < leaders.length; j++) {
			const a = leaders[i], b = leaders[j];
			if (a.text && b.text) { continue; }
			if (!bbHit(a.bb, b.bb, 1)) { continue; }
			let hit = false;
			a.segs.forEach(function (s) { b.segs.forEach(function (t) { if (!hit && C.segsCross(s[0], s[1], t[0], t[1])) { hit = true; } }); });
			if (hit) { counts.leaderOnLeader++; crossings.leaderOnLeader.push(a.id + ' x ' + b.id); }
		}
	}
	// N3: a label's leader through another node's symbol.
	leaders.forEach(function (ld) {
		if (ld.text) { return; }
		const own = ld.item.owner.node ? ld.item.owner.node.id : null;
		symbols.forEach(function (s) {
			if (s.node === undefined || s.node === own || !bbHit(ld.bb, s.bb, 0)) { return; }
			if (ld.segs.some(function (g) { return C.segHitsBox(g[0], g[1], s.box); })) { breaks.N3.push(ld.id + ' through ' + s.id); }
		});
	});
	// N4: a hand-placed label stays where the user put it, shown.
	const byId = {};
	items.forEach(function (it) { byId[it.id] = it; });
	scene.labels.forEach(function (req) {
		if (!req.hand) { return; }
		const it = byId[req.id], h = [req.hand.x, req.hand.y];
		if (!it) { breaks.N4.push(req.id + ' hidden'); return; }
		const onText = it.boxes.some(function (b) { return C.distToOBox(h, b) <= 1; });
		const onLeader = !it.leader || C.distToPolyline(h, it.leader) <= 1;
		if (!onText || !onLeader) {
			const b = it.boxes[0];
			breaks.N4.push(req.id + ' moved (' + Math.round(C.distToOBox(h, b)) + ' px from where the user put it)');
		}
	});
	// ---- the weighted costs --------------------------------------------------------------------
	items.forEach(function (it) {
		// Label on a leader not its own.
		leaders.forEach(function (ld) {
			if (ld.item === it || !bbHit(it.bb, ld.bb, 0)) { return; }
			if (ld.segs.some(function (g) { return boxesOnSeg(it.boxes, g[0], g[1]); })) { counts.labelOnLeader++; }
		});
		// Label on a link. A pipe label's own pipe is where it belongs.
		const ownLink = it.owner.link ? it.owner.link.id : null;
		links.forEach(function (lk) {
			if (lk.id === ownLink || !bbHit(it.bb, lk.bb, 0)) { return; }
			if (lk.segs.some(function (g) { return boxesOnSeg(it.boxes, g[0], g[1]); })) { counts.labelOnLink++; }
		});
		// Leader on a link: a crossing away from the leader's own start (every leader starts on a
		// node or a pipe, and the pipes meeting there are not crossed by it).
		if (it.leader) {
			const start = it.leader[0], ls = segsOf(it.leader);
			const lbb = bboxOf(it.leader.map(function (p) { return { cx: p[0], cy: p[1], w: 0, h: 0 }; }));
			links.forEach(function (lk) {
				if (lk.id === ownLink || !bbHit(lbb, lk.bb, 1)) { return; }
				let hit = false;
				ls.forEach(function (s) {
					lk.segs.forEach(function (g) {
						if (hit || !C.segsCross(s[0], s[1], g[0], g[1])) { return; }
						// Where they cross, measured along the link segment; near the start is not a crossing.
						const t = intersectPoint(s[0], s[1], g[0], g[1]);
						if (t && Math.hypot(t[0] - start[0], t[1] - start[1]) > 1) { hit = true; }
					});
				});
				if (hit) { counts.leaderOnLink++; }
			});
		}
	});
	let cost = 0;
	Object.keys(counts).forEach(function (k) { cost += counts[k] * WEIGHTS[k]; });

	// ---- coverage and leaders --------------------------------------------------------------------
	let rowsReq = 0, rowsShown = 0;
	scene.labels.forEach(function (req) { rowsReq += req.rows.length; });
	items.forEach(function (it) { rowsShown += it.pl.rows.length; });
	const leaderLH = items.filter(function (it) { return it.leader; }).map(function (it) {
		return C.polylineLength(it.leader) / (it.blockH || scene.text.rowHeightPx);
	});

	// ---- REPORTED, never failing: R5, R7 and R9 (dev/label-placement-rules.md §3) --------------
	// R5: a stacked label's rows are justified to the side its leader arrives from (the leader's
	// end is nearer the block's left edge -> align left; nearer the right edge -> align right).
	// Only a label with more than one row can disagree (a one-row block has nothing to justify).
	let r5Checked = 0, r5Mismatch = 0;
	items.forEach(function (it) {
		if (!it.leader || it.pl.rows.length < 2) { return; }
		if ((it.pl.layout || it.req.layout) !== 'stack') { return; }
		r5Checked++;
		const end = it.leader[it.leader.length - 1];
		const expected = (end[0] - it.bb.x0) <= (it.bb.x1 - end[0]) ? 'left' : 'right';
		if ((it.pl.align || 'left') !== expected) { r5Mismatch++; }
	});
	// R7: a pipe label sits beside its pipe by default, not on it. Its own pipe is not a crossing
	// cost (labelOnLink above skips it deliberately), so it needs its own reported count.
	let r7Checked = 0, r7OnOwnPipe = 0;
	items.forEach(function (it) {
		if (it.req.kind !== 'link' || !it.owner.link) { return; }
		r7Checked++;
		const ownSegs = segsOf(it.owner.link.points);
		if (ownSegs.some(function (g) { return boxesOnSeg(it.boxes, g[0], g[1]); })) { r7OnOwnPipe++; }
	});
	// R9: a pipe longer than the repeat spacing carries its label more than once. `repeatSpacingPx`
	// is set by the bench (run.js), from the viewport, as dev/label-placement-rules.md §3.1 says.
	let r9Should = 0, r9Has = 0;
	const spacing = scene.text.repeatSpacingPx;
	if (spacing > 0) {
		items.forEach(function (it) {
			if (it.req.kind !== 'link' || !it.owner.link) { return; }
			if (C.polylineLength(it.owner.link.points) <= spacing) { return; }
			r9Should++;
			if (it.pl.repeats && it.pl.repeats.length) { r9Has++; }
		});
	}

	return { breaks: breaks, crossings: crossings, counts: counts, cost: cost, labelsReq: scene.labels.length,
		labelsShown: items.length, rowsReq: rowsReq, rowsShown: rowsShown, leaderLH: leaderLH,
		r5: { checked: r5Checked, mismatch: r5Mismatch }, r7: { checked: r7Checked, onOwnPipe: r7OnOwnPipe },
		r9: { should: r9Should, has: r9Has } };
}
function intersectPoint(p, q, r, s) {
	const d = (q[0] - p[0]) * (s[1] - r[1]) - (q[1] - p[1]) * (s[0] - r[0]);
	if (!d) { return null; }
	const t = ((r[0] - p[0]) * (s[1] - r[1]) - (r[1] - p[1]) * (s[0] - r[0])) / d;
	return [p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])];
}

// **CHURN BETWEEN TWO VIEWS OF ONE SET** (dev/label-placement-rules.md §5: "churn (a label that
// moves between two views and shows nothing more for it)"; there is no stillness rule). A label
// MOVED if it was shown in both and its text block sits at a different offset from its anchor
// (more than 1 px), or turned, or re-aligned; or if it was shown and is now hidden. A label that
// appears, or that moved but now shows MORE (more rows than before -- regrowing a dropped row on
// zoom-in is never churn), is not churn. Of what is left, a move is CHURN unless it was FORCED:
// the old placement, carried to the new view unchanged (same offset from the anchor), would now
// lie on a symbol, a Text object, or a label of the new layout -- i.e. it fixed a break.
function stability(sceneA, layoutA, sceneB, layoutB) {
	const A = (layoutA && layoutA.labels) || {}, B = (layoutB && layoutB.labels) || {};
	const reqA = {}, reqB = {};
	sceneA.labels.forEach(function (r) { reqA[r.id] = r; });
	sceneB.labels.forEach(function (r) { reqB[r.id] = r; });
	const newItems = drawn(sceneB, layoutB).items;
	const symBoxes = sceneB.nodes.map(function (n) { return C.rectToOBox(n.symbol); });
	sceneB.links.forEach(function (l) { (l.symbols || []).forEach(function (b) { symBoxes.push(b); }); });
	const textBoxes = sceneB.texts.map(function (t) { return t.box; });
	let compared = 0, moved = 0, churn = 0;
	const list = [];
	Object.keys(A).forEach(function (id) {
		const a = A[id], b = B[id], ra = reqA[id], rb = reqB[id];
		if (!a || !a.shown || !ra || !rb) { return; }
		compared++;
		let isMove = false;
		if (!b || !b.shown) { isMove = true; } else {
			const dxA = a.x - ra.anchor.x, dyA = a.y - ra.anchor.y, dxB = b.x - rb.anchor.x, dyB = b.y - rb.anchor.y;
			// The block may grow by a changed row set; the edge it hangs on is what must hold still.
			const wA = C.blockSize(ra, a, sceneA.text).w, wB = C.blockSize(rb, b, sceneB.text).w;
			const leftSame = Math.abs(dxA - dxB) <= 1, rightSame = Math.abs((dxA + wA) - (dxB + wB)) <= 1;
			if (!(leftSame || rightSame) || Math.abs(dyA - dyB) > 1 || (a.angle || 0) !== (b.angle || 0)) { isMove = true; }
		}
		if (!isMove) { return; }
		moved++;
		// Shows nothing more for it: same or fewer rows shown (a hidden label shows 0), not more.
		// A move that regrows a dropped row, or shows a hidden label, is never churn.
		const rowsA = a.rows.length, rowsB = (b && b.shown) ? b.rows.length : 0;
		if (rowsB > rowsA) { return; }
		// Would the OLD placement still have been legal here? If so, this move fixed no break.
		const kept = Object.assign({}, a, { x: rb.anchor.x + (a.x - ra.anchor.x), y: rb.anchor.y + (a.y - ra.anchor.y), repeats: [] });
		const keptReq = Object.assign({}, rb, { rows: ra.rows });
		const boxes = C.placementBoxes(keptReq, kept, sceneB.text);
		let fixedABreak = false;
		boxes.forEach(function (bx) {
			if (fixedABreak) { return; }
			if (symBoxes.some(function (s) { return C.boxesOverlap(bx, s); })) { fixedABreak = true; return; }
			if (textBoxes.some(function (s) { return C.boxesOverlap(bx, s); })) { fixedABreak = true; return; }
			if (newItems.some(function (it) { return it.id !== id && it.boxes.some(function (o) { return C.boxesOverlap(bx, o); }); })) { fixedABreak = true; }
		});
		if (!fixedABreak) { churn++; list.push(id); }
	});
	return { compared: compared, moved: moved, churn: churn, churnIds: list };
}

// **R11, ZOOM-IN ROW CHANGE.** Between two views of a set where the scale (view.s) increases, how
// many rows of labels present in both views were REGAINED (shown now that were not, or more of
// them) versus LOST (shown before that are not now, or fewer of them). Reported, never failing --
// R11 says zooming in should free room and bring dropped properties and labels back; this is the
// bench's honest measure of whether that happened, not a pass/fail line.
function zoomRowChange(sceneA, layoutA, sceneB, layoutB) {
	if (!(sceneB.view.s > sceneA.view.s)) { return null; }
	const A = (layoutA && layoutA.labels) || {}, B = (layoutB && layoutB.labels) || {};
	const reqA = {}, reqB = {};
	sceneA.labels.forEach(function (r) { reqA[r.id] = r; });
	sceneB.labels.forEach(function (r) { reqB[r.id] = r; });
	let regained = 0, lost = 0;
	Object.keys(reqA).forEach(function (id) {
		if (!reqB[id]) { return; }
		const a = A[id], b = B[id];
		const rowsA = (a && a.shown) ? a.rows.length : 0, rowsB = (b && b.shown) ? b.rows.length : 0;
		if (rowsB > rowsA) { regained += rowsB - rowsA; } else if (rowsA > rowsB) { lost += rowsA - rowsB; }
	});
	return { regained: regained, lost: lost };
}

module.exports = { WEIGHTS, scoreView, stability, zoomRowChange, drawn };
