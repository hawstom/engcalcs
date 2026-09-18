'use strict';
// **TOM'S BOX STRATEGIES 2026-09-18-A AND -B, MEASURED.** Run with:
//   node dev/lpn-spike/box-at-node-probe.js
//
// A PROBE, NOT A HARNESS, and the name says so: it asserts nothing and is not in the glob
// run_harnesses.sh sweeps. It exists so the numbers in section 15 of
// dev/label-placement-algorithms.md can be re-taken rather than trusted.
//
//   A: *"a box-at-node model, where we (iteratively?) draw the open rectangle with the largest area
//      possible that touches a node ... we don't have to store a box for every node."*
//   B: *"allow the box to be away from a node ... I am doing a concept where we allow the box to be
//      two text heights away."*
//
// What it measures, per view, on Net3-World at three zooms: what one search per NODE costs against
// the shipped one search per GANG; how many nodes yield a usable box at all; whether any returned
// box actually TOUCHES its node; how far from the node the nearest one really is, in text rows; and
// what a pairwise "most unique area" comparison costs on top of the search.
const fs = require('fs');
const path = require('path');
const stub = require('./lpn-dom-stub.js');
const { ROOT, loadLoopedNetwork, setUnitSet, settleEpanet, warmEpanet } = stub;
const Collide = require(ROOT + 'js/lpn-collide.js').lpnCollide;
const EXAMPLES = path.join(__dirname, '../water-network-examples');

let capturedObs = null, capturedLabels = null;
const realRepair = Collide.repairCrossingGangs;
Collide.repairCrossingGangs = function (labels, placed, obs, opts) {
	capturedObs = obs; capturedLabels = labels;
	return realRepair.call(this, labels, placed, obs, opts);
};

function pct(a, q) {
	if (!a.length) { return 0; }
	const s2 = a.slice().sort(function (x, y) { return x - y; });
	return s2[Math.min(s2.length - 1, Math.floor(q * s2.length))];
}
async function main() {
	setUnitSet('us');
	const L = loadLoopedNetwork(
		"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
		"\t\t\tworld = el('g', {}, svg);\n" +
		"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
		"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
		"\t\t\tmodelLayer = el('g', {}, world);\n" +
		"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
		"\t\t\tlabelsLayer = el('g', {}, world);\n" +
		"\t\t\trubberBandEl = el('line', {}, world); },\n" +
		"\t\tapplySaved: applySaved, buildDom: buildDom, noteMapSized: noteMapSized,\n" +
		"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
		"\t\tsetView: function (v) { return applyView(v); },\n" +
		"\t\tzoomExtent: function () { return zoomExtent(true); },\n" +
		"\t\tscale: function () { return state.s; },\n" +
		"\t\tgetDoc: function () { return doc; }, runSolve: runSolve,\n" +
		"\t\trefreshLabelText: refreshLabelText,\n" +
		"\t\tlabelSettings: function () { return labelSettings; },\n" +
		"\t\tsettings: function () { return settings; },\n" +
		"\t\tfs: effectiveFontSize,\n" +
		"\t\tnodeEls: function () { return nodeEls; }"
	);
	L.buildLayers();
	L.setCanvas(1400, 900);
	L.applySaved(JSON.parse(fs.readFileSync(path.join(EXAMPLES, 'Net3-Novato-CA-World.lwn'), 'utf8')));
	L.buildDom();
	L.noteMapSized();
	const ls = L.labelSettings();
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
	await warmEpanet();
	L.settings().engine = 'epanet';
	L.runSolve();
	await settleEpanet();

	const doc = L.getDoc(), nodeEls = L.nodeEls();
	L.zoomExtent();
	const sFit = L.scale();
	let cx = 0, cy = 0;
	doc.nodes.forEach(function (n) { cx += n.x; cy += n.y; });
	cx /= doc.nodes.length; cy /= doc.nodes.length;

	[1, 2, 4].forEach(function (mult) {
		L.setView({ cx: cx, cy: cy, s: sFit * mult });
		L.refreshLabelText();
		if (!capturedObs) { console.log('no obstacle field captured'); return; }
		const obs = capturedObs;
		const fs0 = L.fs(), rowH = fs0 * 1.2;
		// A typical node label footprint at this zoom: the widest drawn node label.
		let need = { w: 0, h: rowH * 2 };
		doc.nodes.forEach(function (n) {
			const ne = nodeEls[n.id];
			if (ne && ne.twPx) { need.w = Math.max(need.w, ne.twPx / L.scale()); }
		});

		// ---- STRATEGY A: one search per NODE, boxes touching the node ------------------------
		// "Touching" is read as: the node lies on the boundary of the returned extreme box, within
		// half a cell. Reach is one candidate reach, so the raster is the node's own neighborhood.
		const reach = need.w * 2 + rowH * 4;
		const t0 = process.hrtime.bigint();
		let stored = 0, touching = 0, totalSpots = 0, areaSum = 0; const gaps = [];
		doc.nodes.forEach(function (n) {
			const spots = Collide.spotPrime({ x: n.x, y: n.y }, reach, obs, { need: need });
			totalSpots += spots.length;
			if (!spots.length) { return; }
			stored++;
			// Does any extreme box of the nearest spot actually TOUCH the node?
			const s = spots[0];
			let gap = Infinity;
			['tall', 'squat', 'square'].forEach(function (k) {
				const b = s[k];
				if (!b) { return; }
				const dx = Math.abs(n.x - b.cx) - b.w / 2, dy = Math.abs(n.y - b.cy) - b.h / 2;
				gap = Math.min(gap, Math.max(0, Math.max(dx, dy)));
				areaSum += b.w * b.h;
			});
			if (gap < 1e-12) { touching++; }
			if (isFinite(gap)) { gaps.push(gap / rowH); }
		});
		const msA = Number(process.hrtime.bigint() - t0) / 1e6;

		// ---- "MOST UNIQUE AREA": what the pairwise comparison costs on top ---------------------
		// Every kept box against every other kept box, which is the cheapest honest reading of
		// "keep the one that has most unique area".
		const keep = [];
		doc.nodes.forEach(function (n) {
			const spots = Collide.spotPrime({ x: n.x, y: n.y }, reach, obs, { need: need });
			spots.slice(0, 2).forEach(function (sp) {
				['tall', 'squat', 'square'].forEach(function (k) {
					if (sp[k]) { keep.push(sp[k]); }
				});
			});
		});
		const t2 = process.hrtime.bigint();
		let overlapTests = 0;
		for (let a = 0; a < keep.length; a++) {
			for (let b = a + 1; b < keep.length; b++) {
				const p2 = keep[a], q2 = keep[b];
				const ox = Math.min(p2.cx + p2.w / 2, q2.cx + q2.w / 2) - Math.max(p2.cx - p2.w / 2, q2.cx - q2.w / 2);
				const oy = Math.min(p2.cy + p2.h / 2, q2.cy + q2.h / 2) - Math.max(p2.cy - p2.h / 2, q2.cy - q2.h / 2);
				if (ox > 0 && oy > 0) { overlapTests++; }
			}
		}
		const msU = Number(process.hrtime.bigint() - t2) / 1e6;

		// ---- STRATEGY B: the same, but the box may sit two text heights away -----------------
		const t1 = process.hrtime.bigint();
		let storedB = 0, extra = 0;
		doc.nodes.forEach(function (n) {
			const spots = Collide.spotPrime({ x: n.x, y: n.y }, reach + rowH * 2, obs, { need: need });
			if (spots.length) { storedB++; }
			if (spots.length && spots[0].dist > rowH * 2) { extra++; }
		});
		const msB = Number(process.hrtime.bigint() - t1) / 1e6;

		console.log(JSON.stringify({ zoom: mult + 'x', nodes: doc.nodes.length,
			need: +need.w.toPrecision(3) + 'x' + (+need.h.toPrecision(3)),
			A_nodesWithABox: stored, A_spotsFound: totalSpots, A_boxesTouchingNode: touching,
			A_ms: +msA.toFixed(1),
			A_gapRowsMed: +pct(gaps, 0.5).toPrecision(3), A_gapRowsP90: +pct(gaps, 0.9).toPrecision(3),
			A_within2rows: gaps.filter(function (g) { return g <= 2; }).length,
			A_symbolRadiusRows: +(L.settings().symbolSize / 2 / L.scale() / rowH).toPrecision(3),
			U_boxes: keep.length, U_overlappingPairs: overlapTests, U_pairwiseMs: +msU.toFixed(1),
			B_nodesWithABox: storedB, B_nearestSpotBeyondTwoRows: extra, B_ms: +msB.toFixed(1) }));
	});
}
main().catch(function (e) { console.error(e); process.exit(1); });
