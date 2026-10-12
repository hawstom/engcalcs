// NO PIPE LABEL IS WRITTEN OVER A NODE SYMBOL, AND NO LABEL OVER A PUMP OR VALVE SYMBOL. Run with:
//   node dev/lpn-spike/label-node-symbol-harness.js
//
// **THE DEFECT** (label bench, 2026-10-07, dev/label-trials/placement-report-vs-production.md on
// feat/label-placer): on round 7's 64 scene sets master 8c88e689 wrote 204 pipe labels over node
// symbols on the plain networks, where production 9c71d54f wrote none. 9ce21702 made the shed test a
// lone aligned label at every station of its slide, so it kept labels the slide could not seat; the
// slide, finding no clear station, fell back to the middle of the pipe, which on a short pipe lies on
// its end junctions. The fix hides such a label (`hiddenBlocked`) and stops committing a label the
// shed already hid as an obstacle.
//
// **THE SCENES**: Net3 at its fit view and 2x, 4x, 8x; and fixtures/plain-downtown-n600-seed71.lwn,
// the network the bench's generator makes from
// {"family":"downtown","n":600,"seed":71,"spacingPx":28,"bends":"none","valves":"none"}, viewed as
// the bench views it (median nearest-neighbour distance at 28 screen px about the node nearest the
// centroid, then 1.5x, 2x, 3x, 4x), node fields ID, P, Qb, Z and link fields ID, Q, V, solved
// through EPANET. valve-symbol-label-harness.js holds the valved scene.
//
// **BOTH SIDES ARE READ OFF THE PAGE**: the labels are the drawn placements, shown ones only; the
// node symbols are each node's own <circle> (cx, cy, r) and the pump and valve symbols each volute's
// own transform, NOT the obstacle list. An overlap is the bench's: deeper than 1.5 screen px.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');

const NODE_FIELDS = ['id', 'pressure', 'demand', 'elev'], LINK_FIELDS = ['id', 'flow', 'velocity'];
const EPS_PX = 1.5;
const SCENES = [
	{ name: 'Net3', file: path.join(__dirname, '../water-network-examples/Net3.lwn'), view: 'fit',
		mults: [1, 2, 4, 8], minShown: 300 },
	{ name: 'bench plain downtown', file: path.join(__dirname, 'fixtures/plain-downtown-n600-seed71.lwn'),
		view: 'density', spacingPx: 28, mults: [1, 1.5, 2, 3, 4], minShown: 1100 }
];

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

(async function () {
	const stub = require('./lpn-dom-stub.js');
	const { ROOT, loadLoopedNetwork, setUnitSet, settleEpanet, warmEpanet } = stub;
	const Collide = require(ROOT + 'js/lpn-collide.js').lpnCollide;

	let lastFirstFit = null, lastRing = null, lastObs = null;
	const realFF = Collide.placeLabelsFirstFit;
	Collide.placeLabelsFirstFit = function (labels, obs, opts) {
		return (lastFirstFit = realFF.call(this, labels, obs, opts));
	};
	const realRepair = Collide.repairCrossingGangs;
	Collide.repairCrossingGangs = function (labels, placed, obs, opts) {
		const out = realRepair.call(this, labels, placed, obs, opts);
		lastFirstFit = out.results;
		return out;
	};
	const realRing = Collide.placeLabels;
	Collide.placeLabels = function (labels, obs, opts) {
		lastObs = obs;
		return (lastRing = realRing.call(this, labels, obs, opts));
	};

	setUnitSet('us');
	await warmEpanet();

	for (const sc of SCENES) {
		lastFirstFit = lastRing = lastObs = null;
		const L = loadLoopedNetwork(
			"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
			"\t\t\tworld = el('g', {}, svg);\n" +
			"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
			"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
			"\t\t\tmodelLayer = el('g', {}, world);\n" +
			"\t\t\tlinksLayer = el('g', {}, modelLayer); linkSymbolLayer = el('g', {}, modelLayer);\n" +
			"\t\t\tnodesLayer = el('g', {}, modelLayer);\n" +
			"\t\t\tlabelsLayer = el('g', {}, world);\n" +
			"\t\t\trubberBandEl = el('line', {}, world); },\n" +
			"\t\tapplySaved: applySaved, buildDom: buildDom, noteMapSized: noteMapSized,\n" +
			"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
			"\t\tsetView: function (v) { return applyView(v); },\n" +
			"\t\tzoomExtent: function () { return zoomExtent(true); },\n" +
			"\t\tstate: function () { return state; },\n" +
			"\t\tgetDoc: function () { return doc; }, runSolve: runSolve,\n" +
			"\t\trefreshLabelText: refreshLabelText,\n" +
			"\t\tlabelSettings: function () { return labelSettings; },\n" +
			"\t\tsettings: function () { return settings; },\n" +
			"\t\tnodeAt: nodeAt,\n" +
			"\t\tnodeEls: function () { return nodeEls; }, linkEls: function () { return linkEls; }"
		);
		L.buildLayers();
		L.setCanvas(1400, 900);
		const saved = JSON.parse(fs.readFileSync(sc.file, 'utf8'));
		saved.settings = saved.settings || {};
		saved.settings.labelMaxWidth = null;   // Net3's threshold hides every label at these views
		L.applySaved(saved);
		L.buildDom();
		L.noteMapSized();
		const ls = L.labelSettings();
		Object.keys(ls.node).forEach(function (k) { ls.node[k] = NODE_FIELDS.indexOf(k) >= 0; });
		Object.keys(ls.link).forEach(function (k) { ls.link[k] = LINK_FIELDS.indexOf(k) >= 0; });
		L.settings().engine = 'epanet';
		L.runSolve();
		await settleEpanet();
		const doc = L.getDoc(), nodeEls = L.nodeEls(), linkEls = L.linkEls();

		let cx, cy, s1;
		if (sc.view === 'fit') {
			L.zoomExtent();
			s1 = L.state().s;
			cx = 0; cy = 0;
			doc.nodes.forEach(function (n) { const p = L.nodeAt(n); cx += p.x; cy += p.y; });
			cx /= doc.nodes.length; cy /= doc.nodes.length;
		} else {
			const pts = doc.nodes.filter(function (n) { return n.type !== 'reservoir'; }).map(function (n) { return L.nodeAt(n); });
			let gx = 0, gy = 0;
			pts.forEach(function (p) { gx += p.x; gy += p.y; });
			gx /= pts.length; gy /= pts.length;
			let cen = pts[0];
			pts.forEach(function (p) { if (Math.hypot(p.x - gx, p.y - gy) < Math.hypot(cen.x - gx, cen.y - gy)) { cen = p; } });
			const nn = pts.map(function (p, i) {
				let best = Infinity;
				pts.forEach(function (q, j) { if (j !== i) { best = Math.min(best, Math.hypot(q.x - p.x, q.y - p.y)); } });
				return best;
			}).sort(function (a, b) { return a - b; });
			s1 = sc.spacingPx / nn[Math.floor(nn.length / 2)];
			cx = cen.x; cy = cen.y;
		}

		function shown(h) { return !!h && !!h.text && h.text.style.visibility !== 'hidden'; }
		function drawnLabels() {
			const out = [];
			[lastFirstFit, lastRing].forEach(function (set) {
				(set || []).forEach(function (r) {
					if (r.dropped || !(r.box || (r.boxes && r.boxes.length))) { return; }
					const h = r.id.charAt(0) === 'n' ? nodeEls[r.id.slice(2)] : linkEls[r.id.slice(2)];
					if (!shown(h)) { return; }
					out.push({ id: r.id, boxes: (r.boxes && r.boxes.length) ? r.boxes : [r.box] });
				});
			});
			const byLink = {};
			((lastObs && lastObs.boxes) || []).forEach(function (b) {
				if (b.kind !== 'label' || b.linkOwner === undefined) { return; }
				(byLink[b.linkOwner] = byLink[b.linkOwner] || []).push(b);
			});
			Object.keys(byLink).forEach(function (id) {
				if (shown(linkEls[id])) { out.push({ id: 'l:' + id, boxes: byLink[id] }); }
			});
			return out;
		}
		function nodeSymbols() {
			const out = [];
			doc.nodes.forEach(function (n) {
				const ne = nodeEls[n.id];
				if (!ne || !ne.circle) { return; }
				const r = +ne.circle.getAttribute('r');
				out.push({ id: n.id, box: Collide.box(+ne.circle.getAttribute('cx'), +ne.circle.getAttribute('cy'), 2 * r, 2 * r, 0) });
			});
			return out;
		}
		function linkSymbols() {
			const out = [];
			doc.links.forEach(function (l) {
				const le = linkEls[l.id];
				if (!le || !le.symbolG || !le.symbolBox) { return; }
				const g = /translate\(([-0-9.e]+),([-0-9.e]+)\) rotate\(([-0-9.e]+)\)/.exec(le.symbolG.getAttribute('transform') || ''),
					k = /scale\(([-0-9.e]+),/.exec(le.symbolBox.getAttribute('transform') || '');
				if (!g || !k) { throw new Error('link ' + l.id + ': symbol transform unreadable'); }
				const size = +k[1] * 24;
				out.push({ id: l.id, box: Collide.box(+g[1], +g[2], size, size, +g[3]) });
			});
			return out;
		}

		let total = 0;
		sc.mults.forEach(function (m) {
			if (!L.setView({ cx: cx, cy: cy, s: s1 * m })) { throw new Error(sc.name + ': view refused at ' + m + 'x'); }
			L.refreshLabelText();
			const s = L.state().s, eps = EPS_PX / s;
			const drawn = drawnLabels(), nsym = nodeSymbols(), lsym = linkSymbols(), onNode = [], onLink = [];
			total += drawn.length;
			drawn.forEach(function (d) {
				d.boxes.forEach(function (b) {
					if (d.id.charAt(0) === 'l') {
						nsym.forEach(function (q) {
							if (Collide.boxOverlapDepth(b, q.box) > eps) { onNode.push(d.id + ' on node ' + q.id); }
						});
					}
					lsym.forEach(function (q) {
						if (Collide.boxOverlapDepth(b, q.box) > eps) { onLink.push(d.id + ' on symbol ' + q.id); }
					});
				});
			});
			report(onNode.length === 0, `${sc.name} ${m}x: no pipe label over a node symbol`,
				`${onNode.length} overlap(s), ${drawn.length} labels drawn` + (onNode.length ? '; e.g. ' + onNode.slice(0, 3).join('; ') : ''));
			report(onLink.length === 0, `${sc.name} ${m}x: no label over a pump or valve symbol`,
				`${onLink.length} overlap(s) against ${lsym.length} symbols` + (onLink.length ? '; e.g. ' + onLink.slice(0, 3).join('; ') : ''));
		});
		// A fix that hid everything would pass vacuously.
		report(total >= sc.minShown, `${sc.name}: the drawing still carries its labels`, total + ' labels drawn over ' + sc.mults.length + ' views');
	}

	console.log(`\n${checks - failures}/${checks} checks passed`);
	process.exit(failures ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(1); });
