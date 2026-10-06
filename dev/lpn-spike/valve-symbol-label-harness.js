// NO LABEL IS WRITTEN OVER A PUMP OR VALVE SYMBOL. Run with:
//   node dev/lpn-spike/valve-symbol-label-harness.js
//
// **THE DEFECT** (label bench, round 6, dev/label-trials/round-6-2026-10-05.md section 2.8 on
// feat/label-placer): master 89248ed2 wrote 51 labels over valve symbols on one bent-and-valved
// network across five zooms (27, 16, 5, 2, 1). Two kinds: a node label over a nearby valve, and a
// valve's own label over its own symbol. **The cause:** staticObstacles() boxed every NODE symbol
// and no link symbol, so the placement pass could not see a volute at all.
//
// **THE SCENE IS THE BENCH'S OWN**: fixtures/bent-valves-n600-seed7.lwn is the network the bench's
// generator makes from {"family":"suburban","n":600,"seed":7,"bends":"many","valves":"many"}, opened
// through the page, solved through EPANET, node fields ID, P, Qb, Z and link fields ID, Q, V, and
// viewed as the bench views it: the median nearest-neighbour distance at 44 screen px, centred on
// the node nearest the centroid, then 1.5x, 2x, 3x and 4x.
//
// **BOTH SIDES ARE READ OFF THE PAGE.** The labels are the drawn placements (the same four sources
// label-crossing-measure.js assembles, shown ones only). The symbols are read from each volute's
// own transform on the DOM, NOT from the obstacle list, so this does not grade the fix by its own
// arithmetic.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');

const FIXTURE = path.join(__dirname, 'fixtures/bent-valves-n600-seed7.lwn');
const SPACING_PX = 44, MULTS = [1, 1.5, 2, 3, 4];
const NODE_FIELDS = ['id', 'pressure', 'demand', 'elev'], LINK_FIELDS = ['id', 'flow', 'velocity'];

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

	// The two placement passes' results and the obstacle list the ring pass was handed, captured
	// at the seams label-crossing-measure.js uses.
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
	const L = loadLoopedNetwork(
		// init()'s own layer order, link symbols in their own layer as on the page.
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
		"\t\tscale: function () { return state.s; },\n" +
		"\t\tgetDoc: function () { return doc; }, runSolve: runSolve,\n" +
		"\t\trefreshLabelText: refreshLabelText,\n" +
		"\t\tlabelSettings: function () { return labelSettings; },\n" +
		"\t\tsettings: function () { return settings; },\n" +
		"\t\tnodeAt: nodeAt,\n" +
		"\t\tnodeEls: function () { return nodeEls; }, linkEls: function () { return linkEls; },\n" +
		"\t\tlabelEls: function () { return labelEls; }"
	);
	L.buildLayers();
	L.setCanvas(1400, 900);
	const saved = JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));
	saved.settings.labelMaxWidth = null;
	L.applySaved(saved);
	L.buildDom();
	L.noteMapSized();
	const ls = L.labelSettings();
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = NODE_FIELDS.indexOf(k) >= 0; });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = LINK_FIELDS.indexOf(k) >= 0; });
	await warmEpanet();
	L.settings().engine = 'epanet';
	L.runSolve();
	await settleEpanet();

	const doc = L.getDoc(), nodeEls = L.nodeEls(), linkEls = L.linkEls(), labelEls = L.labelEls();

	// ---- the bench's view: median nearest-neighbour distance at 44 px, about the central node ----
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
	const s1 = SPACING_PX / nn[Math.floor(nn.length / 2)];

	// ---- the drawing, read back ------------------------------------------------------------------
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
	// Each volute as drawn: symbolG carries translate(mx,my) rotate(a), the inner box scale(k) of
	// the 24-unit icon frame.
	function drawnSymbols() {
		const out = [];
		doc.links.forEach(function (l) {
			const le = linkEls[l.id];
			if (!le || !le.symbolG || !le.symbolBox) { return; }
			const g = /translate\(([-0-9.e]+),([-0-9.e]+)\) rotate\(([-0-9.e]+)\)/.exec(le.symbolG.getAttribute('transform') || ''),
				k = /scale\(([-0-9.e]+),/.exec(le.symbolBox.getAttribute('transform') || '');
			if (!g || !k) { throw new Error('link ' + l.id + ': symbol transform unreadable'); }
			const size = +k[1] * 24;
			out.push({ id: l.id, type: l.type, box: Collide.box(+g[1], +g[2], size, size, +g[3]) });
		});
		return out;
	}

	const syms0 = drawnSymbols();
	report(syms0.length >= 60 && syms0.every(function (s) { return s.type === 'valve' || s.type === 'pump'; }),
		'the fixture draws its valve symbols', syms0.length + ' symbols');

	const perView = [];
	let totalShown = 0;
	MULTS.forEach(function (m) {
		if (!L.setView({ cx: cen.x, cy: cen.y, s: s1 * m })) { throw new Error('view refused at ' + m + 'x'); }
		L.refreshLabelText();
		// Read per view: a volute keeps its SCREEN size, so its world box shrinks as the view zooms.
		const drawn = drawnLabels(), syms = drawnSymbols(), hits = [];
		totalShown += drawn.length;
		drawn.forEach(function (d) {
			syms.forEach(function (s) {
				if (d.boxes.some(function (b) { return Collide.boxOverlapDepth(b, s.box) > 0; })) {
					hits.push(d.id + ' on ' + s.type + ' ' + s.id);
				}
			});
		});
		perView.push({ m: m, hits: hits, shown: drawn.length });
		report(hits.length === 0, `${m}x: no drawn label overlaps a valve symbol`,
			`${hits.length} overlap(s), ${drawn.length} labels drawn` + (hits.length ? '; e.g. ' + hits.slice(0, 3).join('; ') : ''));
	});
	// **THE VALVE'S OWN LABEL IS STILL DRAWN.** l:4448 sat on its own symbol at 3x and 4x on master;
	// the fix must move it, not merely hide it, where there is room beside the volute.
	const own = linkEls['4448'];
	report(shown(own), "4x: valve 4448's own label is drawn (moved off its symbol, not hidden)",
		own ? 'hiddenShort=' + !!own.hiddenShort + ' crowded=' + !!own.hiddenCrowded + ' yielded=' + !!own.hiddenYielded
			+ ' crossed=' + !!own.hiddenCrossed + ' dropped=' + !!own.hiddenDropped : 'no element');
	// A fix that hid everything would pass the overlap test vacuously.
	report(totalShown > 600, 'the drawing still carries its labels', totalShown + ' labels drawn over five views');

	console.log(`\n${checks - failures}/${checks} checks passed`);
	process.exit(failures ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(1); });
