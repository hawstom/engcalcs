// EXTERNAL LABELS, AS PURE GEOMETRY (Task 539; Tom, 2026-10-20). Run with:
//   node dev/lpn-spike/label-external-harness.js
//
// Collide.placeExternalLabels() sets the labels the interior passes dropped out in the free ground,
// each on a straight leader (js/lpn-collide.js cites the method). Values in, values out, so this
// needs no browser. Held, on a grid network and on seeded random ones:
//   * a label is dropped only where no free ground lies within reach: on the grid, with open ground
//     all round it, every label is placed;
//   * no two of its leaders cross, and none crosses a leader already on the map;
//   * no placed box overlaps an obstacle box, a pipe, a leader, or another placed box;
//   * no leader runs through a box other than its own anchor's symbol, and none is longer than reach;
//   * labels in one column share the row lattice, so stacked labels touch without overlapping;
//   * the same input gives the same output, and the input is not written to;
//   * 300 labels on a 1,200-pipe network place in under BUDGET_MS.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { lpnCollide: C } = require('../../js/lpn-collide.js');

let checks = 0, failures = 0;
function ok(cond, label, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? 'PASS  ' : 'FAIL  ') + label + (detail === undefined ? '' : '   ' + detail));
}
const BUDGET_MS = 400;   // ~75 ms on an idle jasmine, ~200 ms under a full check_all
const FS = 10, ROW = 12, PAD = 2, YOFF = -FS * 0.85;
function hOf(k) { return FS * 1.1 + (k - 1) * ROW; }

function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

// A square grid of pipes, n x n nodes at spacing sp, a symbol at each node.
function gridNet(n, sp) {
	const obs = { boxes: [], segments: [] }, nodes = [];
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			const x = i * sp, y = j * sp;
			nodes.push({ x, y });
			const b = C.box(x, y, 6, 6, 0); b.kind = 'symbol'; obs.boxes.push(b);
			if (i + 1 < n) { obs.segments.push({ ax: x, ay: y, bx: x + sp, by: y, kind: 'link' }); }
			if (j + 1 < n) { obs.segments.push({ ax: x, ay: y, bx: x, by: y + sp, kind: 'link' }); }
		}
	}
	return { obs, nodes };
}
function randomNet(r, nNodes, span) {
	const obs = { boxes: [], segments: [] }, nodes = [];
	for (let i = 0; i < nNodes; i++) {
		const x = r() * span, y = r() * span;
		nodes.push({ x, y });
		const b = C.box(x, y, 6, 6, 0); b.kind = 'symbol'; obs.boxes.push(b);
	}
	for (let i = 1; i < nNodes; i++) {
		// each node to its nearest earlier node, a tree with the look of a network
		let best = 0, bd = Infinity;
		for (let j = Math.max(0, i - 40); j < i; j++) { const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y); if (d < bd) { bd = d; best = j; } }
		obs.segments.push({ ax: nodes[i].x, ay: nodes[i].y, bx: nodes[best].x, by: nodes[best].y, kind: 'link' });
	}
	// a few interior labels with their leaders, as the interior passes leave them
	for (let i = 0; i < nNodes; i += 3) {
		const n = nodes[i], bx = C.box(n.x + 20, n.y - 8, 30, hOf(2), 0); bx.kind = 'label'; obs.boxes.push(bx);
		obs.segments.push({ ax: n.x, ay: n.y, bx: n.x + 5, by: n.y - 12, kind: 'leader' });
	}
	return { obs, nodes };
}
function labelsAt(nodes, pick, r) {
	return pick.map((i, k) => {
		const lines = 1 + (k % 4);
		return { id: 'n' + i, anchor: { x: nodes[i].x, y: nodes[i].y }, w: 26 + (r ? Math.floor(r() * 30) : (k % 5) * 6), h: hOf(lines), yOff: YOFF };
	});
}
function clone(o) { return JSON.parse(JSON.stringify(o)); }

// Everything the result must hold, whatever the scene.
function audit(name, labels, obs, out, reach) {
	const placed = out.filter((r) => !r.dropped);
	const leaders = placed.map((r) => r.leader);
	ok(C.leaderCrossingCount(leaders) === 0, name + ': no two external leaders cross', String(C.leaderCrossingCount(leaders)));
	let vsMap = 0, boxHit = [], thru = [], long = [];
	placed.forEach((r, i) => {
		const lbl = labels[out.indexOf(r)];
		obs.segments.forEach((g) => {
			if (g.kind === 'leader' && C.segmentsCross(r.leader, g)) { vsMap++; }
			if (C.segmentInBoxFraction(g, C.box(r.box.cx, r.box.cy, r.box.w - 0.01, r.box.h - 0.01, 0)) > 0) { boxHit.push(r.id + ' on a ' + g.kind); }
		});
		obs.boxes.forEach((b) => {
			if (C.boxOverlapDepth(C.box(r.box.cx, r.box.cy, r.box.w - 0.01, r.box.h - 0.01, 0), b) > 0) { boxHit.push(r.id + ' on a ' + b.kind); }
			const own = Math.abs(lbl.anchor.x - b.cx) <= b.w / 2 && Math.abs(lbl.anchor.y - b.cy) <= b.h / 2;
			if (!own && C.segmentInBoxFraction(r.leader, b) > 0) { thru.push(r.id + ' through a ' + b.kind); }
		});
		placed.forEach((q, j) => {
			if (j === i) { return; }
			if (j > i && C.boxOverlapDepth(C.box(r.box.cx, r.box.cy, r.box.w - 0.01, r.box.h - 0.01, 0), q.box) > 0) { boxHit.push(r.id + ' on ' + q.id); }
			if (C.segmentInBoxFraction(r.leader, C.box(q.box.cx, q.box.cy, q.box.w - 0.01, q.box.h - 0.01, 0)) > 0) { thru.push(r.id + ' through ' + q.id); }
			if (j > i && C.segmentInBoxFraction(q.leader, C.box(r.box.cx, r.box.cy, r.box.w - 0.01, r.box.h - 0.01, 0)) > 0) { boxHit.push(r.id + ' on leader of ' + q.id); }
		});
		if (Math.hypot(r.leader.bx - r.leader.ax, r.leader.by - r.leader.ay) > reach + 1e-9) { long.push(r.id); }
	});
	ok(vsMap === 0, name + ': no external leader crosses a leader already on the map', String(vsMap));
	ok(boxHit.length === 0, name + ': no external label stands on anything', boxHit.slice(0, 4).join('; '));
	ok(thru.length === 0, name + ': no external leader runs through a label or symbol', thru.slice(0, 4).join('; '));
	ok(long.length === 0, name + ': no leader longer than reach', long.join(' '));
	return placed.length;
}

// ---- 1. a grid with open ground all round: every label is placed -------------------------------
{
	const { obs, nodes } = gridNet(6, 40), reach = 160;
	const pick = nodes.map((n, i) => i);
	const labels = labelsAt(nodes, pick, null);
	const before = clone(obs), lb = clone(labels);
	const out = C.placeExternalLabels(labels, obs, { rowH: ROW, pad: PAD, reach, linkCost: 15 });
	const n = audit('grid 6x6, every node', labels, obs, out, reach);
	// Packed this tight (pipes 40 apart, labels up to 50 x 47) not all 36 fit; printed, not held.
	console.log('      grid 6x6 at 40 apart, every node: ' + n + ' of 36 placed');
	ok(JSON.stringify(obs) === JSON.stringify(before) && JSON.stringify(labels) === JSON.stringify(lb), 'the input is not written to');
	const again = C.placeExternalLabels(labels, obs, { rowH: ROW, pad: PAD, reach, linkCost: 15 });
	ok(JSON.stringify(again) === JSON.stringify(out), 'the same input gives the same output');
	// the row lattice: every external box's top sits on a multiple of the row height
	ok(out.filter((r) => !r.dropped).every((r) => { const t = (r.box.cy - r.box.h / 2) / ROW; return Math.abs(t - Math.round(t)) < 1e-6; }), 'every external label sits on the shared row lattice');
	// a label on the grid's west edge goes west, out of the network, not into its middle
	const west = out[labels.findIndex((l) => l.id === 'n2')];
	ok(west && !west.dropped && west.box.cx + west.box.w / 2 <= 0, 'a node on the west edge is labelled outside the network, to the west', west && (west.box.cx + west.box.w / 2).toFixed(1));
	// and its text hangs left of its end, right-justified at the end nearest the anchor
	ok(west && west.side === 'left' && Math.abs(west.x - (west.box.cx + west.box.w / 2)) < 1e-9, 'a label west of its anchor ends at its leader');
}

// ---- 1b. the edge of a network with room round it: every label on the edge is placed -------------
{
	const { obs, nodes } = gridNet(6, 90), reach = 200;
	const pick = nodes.map((n, i) => i).filter((i) => { const a = nodes[i]; return a.x === 0 || a.y === 0 || a.x === 450 || a.y === 450; });
	const labels = labelsAt(nodes, pick, null);
	const out = C.placeExternalLabels(labels, obs, { rowH: ROW, pad: PAD, reach, linkCost: 15 });
	const n = audit('grid 6x6 at 90 apart, the 20 edge nodes', labels, obs, out, reach);
	ok(n === 20, 'every one of the 20 edge labels is placed', n + ' of 20');
}

// ---- 2. enclosed with no free ground in reach: dropped, not forced ------------------------------
{
	const { obs, nodes } = gridNet(3, 40);
	// fill everything within reach with label boxes
	for (let x = -200; x <= 280; x += 20) { for (let y = -200; y <= 280; y += 12) { const b = C.box(x, y, 20, 12, 0); b.kind = 'label'; obs.boxes.push(b); } }
	const labels = labelsAt(nodes, [4], null);
	const out = C.placeExternalLabels(labels, obs, { rowH: ROW, pad: PAD, reach: 120, linkCost: 15 });
	ok(out.length === 1 && out[0].dropped, 'a label with no free ground within reach is dropped');
}

// ---- 2b. forms: the first that has a place ------------------------------------------------------
{
	const { obs, nodes } = gridNet(3, 60);
	const lbl = { id: 'n0', anchor: { x: nodes[0].x, y: nodes[0].y }, w: 30, h: hOf(1), yOff: YOFF,
		forms: [{ w: 40, h: hOf(3) }, { w: 30, h: hOf(1) }] };
	const out = C.placeExternalLabels([lbl], obs, { rowH: ROW, pad: PAD, reach: 120, linkCost: 15 });
	ok(!out[0].dropped && out[0].form === 0 && Math.abs(out[0].box.h - hOf(3)) < 1e-9, 'the first form is taken where it has a place', JSON.stringify({ form: out[0].form }));
	// walled in by boxes everywhere but one free slot one row high: only the second form fits
	const walled = { boxes: [], segments: [] };
	for (let y = -144; y <= 144; y += ROW) {
		if (y === 0) { continue; }
		const b = C.box(0, y + ROW / 2, 300, ROW, 0); b.kind = 'label'; walled.boxes.push(b);
	}
	const out2 = C.placeExternalLabels([Object.assign({}, lbl, { anchor: { x: 0, y: 6 } })], { boxes: walled.boxes, segments: [] }, { rowH: ROW, pad: 0, reach: 120, linkCost: 15 });
	ok(!out2[0].dropped && out2[0].form === 1, 'where only a one-row slot is free, the one-row form is taken', JSON.stringify({ form: out2[0].form, dropped: out2[0].dropped }));
}

// ---- 3. seeded random networks ------------------------------------------------------------------
for (const seed of [1, 7, 42, 99, 2026]) {
	const r = rng(seed), { obs, nodes } = randomNet(r, 120, 900), reach = 180;
	const pick = []; for (let i = 0; i < nodes.length; i += 2) { pick.push(i); }
	const labels = labelsAt(nodes, pick, r);
	const out = C.placeExternalLabels(labels, obs, { rowH: ROW, pad: PAD, reach, linkCost: 15 });
	const n = audit('random network, seed ' + seed, labels, obs, out, reach);
	console.log('      seed ' + seed + ': ' + n + ' of ' + labels.length + ' placed');
}

// ---- 4. time ------------------------------------------------------------------------------------
{
	const r = rng(5), { obs, nodes } = randomNet(r, 1200, 4000), reach = 200;
	const pick = []; for (let i = 0; i < nodes.length; i += 4) { pick.push(i); }
	const labels = labelsAt(nodes, pick, r);
	const t0 = process.hrtime.bigint();
	const out = C.placeExternalLabels(labels, obs, { rowH: ROW, pad: PAD, reach, linkCost: 15 });
	const ms = Number(process.hrtime.bigint() - t0) / 1e6;
	ok(ms < BUDGET_MS, labels.length + ' labels on a 1,200-pipe network in under ' + BUDGET_MS + ' ms', ms.toFixed(1) + ' ms, ' + out.filter((x) => !x.dropped).length + ' placed');
}

console.log('\nlabel-external-harness: ' + (checks - failures) + '/' + checks + ' checks passed');
if (failures) { process.exitCode = 1; }
