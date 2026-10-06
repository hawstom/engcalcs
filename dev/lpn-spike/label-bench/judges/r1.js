// JUDGES ONLY. BUILDERS MUST NOT READ THIS DIRECTORY (dev/label-placement-rules.md §5, Tom's Q11).
//
// R1, TOM'S SENTENCE OF 2026-10-05: "Hide a label only because there is no room for it on screen.
// Never hide it because of how many labels are already showing." Two halves, two measures.
//
//   1. NO ROOM. A label hidden although free ground within reach could hold its smallest form (its
//      last-in-order value; the ID is in the drop order like any other value) in that same finished layout: room.js's search,
//      the one R-075 and round 5's G use. That label was not hidden for lack of room.
//
//   2. NOT BY COUNT. The counterfactual: the same view laid out again with the labels on the far
//      HALF of the screen not asked for (the nodes, pipes and everything else still there). A label
//      a long way from that half -- more than FAR_FRACTION of the screen width beyond the cut, far
//      past where any label's text and leader can reach -- has exactly the room it had. If it was
//      hidden with every label asked for and SHOWN with half of them gone, it was hidden because of
//      how many labels were showing, not for lack of room ("revived"). Both halves are cut in turn.
//      The same view is laid out twice with nothing changed as a control: a placer that answers
//      differently each time (a clock budget, a random restart) flips labels there too, and that is
//      reported beside the revivals so the two are not confused.
//
// The placer is called afresh for each layout (a new instance, the opening idle budget, no `prev`),
// so every layout in a comparison is made the same way.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { roomWithinReach } = require('./room.js');
const C = require('../contract.js');

// A label more than this share of the viewport width beyond the cut is "far": at the bench's 1400 px
// canvas, 350 px, about 24 text rows. No placer's leader runs that far (round 5's longest p90 was a
// few label heights).
const FAR_FRACTION = 0.25;
const REACH_ROWS = 3;

// The smallest form a label can take is the one value the user's drop order keeps longest (Tom,
// 2026-10-06: "Keep the last dropped property."), the ID included in that order like any other.
function smallestRows(req, scene) {
	const order = scene ? C.dropOrderOf(scene, req.kind) : [];
	for (let k = order.length - 1; k >= 0; k--) {
		const i = req.rows.findIndex(function (r) { return r.field === order[k]; });
		if (i >= 0) { return [i]; }
	}
	return [0];
}

// Half 1: hidden labels that had room. Hand-placed labels are N4's business, not this.
function hiddenWithRoom(scene, layout, reach) {
	const L = (layout && layout.labels) || {}, out = { hidden: 0, withRoom: 0, ids: [] };
	scene.labels.forEach(function (req) {
		if (req.hand) { return; }
		const p = L[req.id];
		if (p && p.shown) { return; }
		out.hidden++;
		if (roomWithinReach(scene, { labels: L }, req, smallestRows(req, scene), { reachRows: reach === undefined ? REACH_ROWS : reach })) {
			out.withRoom++;
			out.ids.push(req.id);
		}
	});
	return out;
}

function makerOf(placer) {
	const mod = typeof placer === 'string' ? require(placer) : placer;
	return function () { return typeof mod.create === 'function' ? mod.create() : mod; };
}
function layOut(make, scene, idleMs) {
	const p = make();
	if (typeof p.idle === 'function') { p.idle(idleMs, { scene: scene, opening: true }); }
	const out = p.place(scene, { prev: null });
	return (out && out.labels) || {};
}
function shown(L, id) { return !!(L[id] && L[id].shown); }

// Half 2: the counterfactual. Returns counts over both cuts of one view.
function countProbe(placer, scene, opts) {
	opts = opts || {};
	const make = makerOf(placer), idle = opts.idleMs === undefined ? 3000 : opts.idleMs;
	const vp = scene.viewport, mid = vp.x + vp.w / 2, far = FAR_FRACTION * vp.w;
	const full = layOut(make, scene, idle), again = layOut(make, scene, idle);
	const out = { farHidden: 0, revived: 0, farShown: 0, lostFar: 0, controlFlips: 0, controlLabels: 0, ids: [] };
	scene.labels.forEach(function (r) {
		if (r.hand) { return; }
		out.controlLabels++;
		if (shown(full, r.id) !== shown(again, r.id)) { out.controlFlips++; }
	});
	[-1, 1].forEach(function (side) {
		// side -1: the LEFT half is not asked for, the far labels are on the right; +1 the mirror.
		const keep = function (r) { return side < 0 ? r.anchor.x >= mid : r.anchor.x < mid; };
		const isFar = function (r) { return side < 0 ? r.anchor.x >= mid + far : r.anchor.x < mid - far; };
		const half = Object.assign({}, scene, { id: scene.id + (side < 0 ? '#right-half' : '#left-half'),
			labels: scene.labels.filter(function (r) { return keep(r) || r.hand; }) });
		const H = layOut(make, half, idle);
		scene.labels.forEach(function (r) {
			if (r.hand || !isFar(r)) { return; }
			if (shown(full, r.id)) {
				out.farShown++;
				if (!shown(H, r.id)) { out.lostFar++; }
			} else {
				out.farHidden++;
				if (shown(H, r.id)) { out.revived++; out.ids.push(r.id); }
			}
		});
	});
	return out;
}

module.exports = { hiddenWithRoom, countProbe, smallestRows, FAR_FRACTION, REACH_ROWS };
