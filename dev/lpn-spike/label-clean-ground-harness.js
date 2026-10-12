// CLEAN GROUND FIRST: a node label takes a spot that crosses nothing before any label takes one that
// crosses a pipe. Run with:
//   node dev/lpn-spike/label-clean-ground-harness.js
//
// **THE RULE** (the label bench's rule 1, fix/label-clean-ground): placeLabelsFirstFit() seats, in
// drop order, every label that has CLEAN ground -- clear of every hard obstacle, no pipe under any
// row, no pipe label it would make yield, and a leader through no other node's symbol. Only then does
// a last sweep give the labels still waiting the old answer: a clear side even with a pipe through
// it, else a yielding one. So a pipe crossing goes only to a label that would otherwise hide.
//
// **PART 1, THE PASS ITSELF**, on hand-built scenes small enough to read: a clean side beats a
// preferred dirty one; a waiting label's dirty ground does not take a later label's clean ground; a
// label with no clean ground is still placed; a leader across another node is not clean; and
// `clean: false` is the old single sweep, so the difference is the rule and nothing else.
//
// **PART 2, THE PAGE**, on Net3 and the bench's plain downtown fixture at the bench's zooms, the same
// views laid out twice by the page's own refreshLabelText(): once as shipped, once with the first-fit
// forced back to the single sweep. Node labels drawn over a pipe must fall by at least a fifth, and
// labels drawn must not fall by more than 1 in 100. Both sides are read off the placements the page
// drew, shown labels only, against the pipes in the obstacle list the pass was given.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');

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

	// ---- part 1 -----------------------------------------------------------------------------------
	console.log('=== the pass ===');
	function lbl(id, x, y, priority, sides) {
		return { id: id, anchor: { x: x, y: y }, home: sides[0], dragged: false, priority: priority,
			w: 40, h: 12, yOff: 0, sides: sides };
	}
	const pipeAt = function (y) { return { ax: -500, ay: y, bx: 500, by: y, kind: 'link', owner: 'l:P' }; };

	// A pipe runs under the preferred (first) side; the second side is clean.
	{
		const obs = { boxes: [], segments: [pipeAt(6)] };
		const mk = function () { return [lbl('n:a', 0, 0, 1, [{ x: 4, y: 0 }, { x: 4, y: -30 }])]; };
		const on = Collide.placeLabelsFirstFit(mk(), obs, {});
		const off = Collide.placeLabelsFirstFit(mk(), obs, { clean: false });
		report(on[0].side === 1, 'a clean side beats a preferred side with a pipe under it', 'side ' + on[0].side);
		report(off[0].side === 0, '...and clean: false keeps the old answer, the preferred side', 'side ' + off[0].side);
	}
	// The higher-ranked label has only pipe-crossing sides; its first would take the ground of the
	// lower-ranked label's only clean side. Clean ground first: the lower-ranked label sits clean,
	// the higher-ranked one takes its OTHER crossing side, and both are drawn.
	{
		// n:hi's two sides both sit on a pipe (one at y=6 that stops at x=10, one at y=-94). n:lo's
		// one side, right of x=10, is clean, and it is the ground n:hi's first side would cover.
		const obs = { boxes: [], segments: [{ ax: -500, ay: 6, bx: 10, by: 6, kind: 'link', owner: 'l:P' }, pipeAt(-94)] };
		const scene = [
			lbl('n:hi', 0, 0, 2, [{ x: 4, y: 0 }, { x: 4, y: -100 }]),
			lbl('n:lo', 10, -40, 1, [{ x: 14, y: 0 }])
		];
		const a = Collide.placeLabelsFirstFit(scene, obs, {}), byId = {};
		a.forEach(function (r) { byId[r.id] = r; });
		report(!byId['n:lo'].dropped, 'the lower-ranked label keeps its only ground, which is clean',
			JSON.stringify({ dropped: byId['n:lo'].dropped }));
		report(!byId['n:hi'].dropped && byId['n:hi'].side === 1,
			'...and the higher-ranked one, crossing a pipe anyway, takes its other side and is drawn',
			JSON.stringify({ dropped: byId['n:hi'].dropped, side: byId['n:hi'].side }));
		const b = Collide.placeLabelsFirstFit(scene, obs, { clean: false }), old = {};
		b.forEach(function (r) { old[r.id] = r; });
		report(old['n:hi'].side === 0 && old['n:lo'].dropped,
			'...where the single sweep let the crossing take the clean ground and hid the other label',
			JSON.stringify({ hi: old['n:hi'].side, loDropped: old['n:lo'].dropped }));
		report(a.map(function (r) { return r.id; }).join() === 'n:hi,n:lo', 'the result stays in drop order');
	}
	// No clean ground anywhere: the label is still placed (the last sweep), on its preferred side.
	{
		const obs = { boxes: [], segments: [pipeAt(6), pipeAt(-24)] };
		const r = Collide.placeLabelsFirstFit([lbl('n:a', 0, 0, 1, [{ x: 4, y: 0 }, { x: 4, y: -30 }])], obs, {});
		report(!r[0].dropped && r[0].side === 0, 'with no clean ground a label still sits on a pipe rather than hide',
			JSON.stringify({ dropped: r[0].dropped, side: r[0].side }));
	}
	// A leader across another node's symbol is not clean ground; one from inside its own is.
	{
		const sym = function (x, y) { const b = Collide.box(x, y, 6, 6, 0); b.kind = 'symbol'; return b; };
		const obs = { boxes: [sym(0, 0), sym(30, 0)], segments: [] };
		const mk = function () { return [lbl('n:a', 0, 0, 1, [{ x: 60, y: 0 }, { x: 4, y: -30 }])]; };
		const on = Collide.placeLabelsFirstFit(mk(), obs, {});
		report(on[0].side === 1, 'a side reached by a leader through another node is passed over for a clean one',
			'side ' + on[0].side);
		const own = Collide.placeLabelsFirstFit([lbl('n:a', 0, 0, 1, [{ x: 4, y: -30 }])], { boxes: [sym(0, 0)], segments: [] }, {});
		report(own[0].side === 0 && !own[0].dropped, '...but its own symbol does not count against it');
	}
	// Pure: the same answer twice, and the inputs come back as they went in.
	{
		const obs = { boxes: [], segments: [pipeAt(6)] };
		const scene = [lbl('n:a', 0, 0, 2, [{ x: 4, y: 0 }, { x: 4, y: -30 }]), lbl('n:b', 20, 0, 1, [{ x: 24, y: 0 }, { x: 24, y: -30 }])];
		const before = JSON.stringify(scene) + JSON.stringify(obs);
		const one = JSON.stringify(Collide.placeLabelsFirstFit(scene, obs, {}));
		const two = JSON.stringify(Collide.placeLabelsFirstFit(scene, obs, {}));
		report(one === two, 'the two sweeps are a pure function: the same answer twice');
		report(JSON.stringify(scene) + JSON.stringify(obs) === before, '...and they scribble on nothing');
	}

	// ---- part 2 -----------------------------------------------------------------------------------
	console.log('\n=== the page ===');
	const NODE_FIELDS = ['id', 'pressure', 'demand', 'elev'], LINK_FIELDS = ['id', 'flow', 'velocity'];
	const SCENES = [
		{ name: 'Net3', file: path.join(__dirname, '../water-network-examples/Net3.lwn'), view: 'fit', mults: [1, 2, 4] },
		{ name: 'bench plain downtown', file: path.join(__dirname, 'fixtures/plain-downtown-n600-seed71.lwn'),
			view: 'density', spacingPx: 28, mults: [1, 1.5, 2, 3, 4] }
	];
	let forceOff = false, lastFirstFit = null, lastObs = null;
	const realFF = Collide.placeLabelsFirstFit;
	Collide.placeLabelsFirstFit = function (labels, obs, opts) {
		if (forceOff) { opts = Object.assign({}, opts || {}, { clean: false }); }
		return (lastFirstFit = realFF.call(this, labels, obs, opts));
	};
	const realRepair = Collide.repairCrossingGangs;
	Collide.repairCrossingGangs = function (labels, placed, obs, opts) {
		const out = realRepair.call(this, labels, placed, obs, opts);
		lastFirstFit = out.results;
		lastObs = obs;
		return out;
	};
	setUnitSet('us');
	await warmEpanet();

	async function layout(sc, off) {
		forceOff = off;
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
			"\t\tnodeEls: function () { return nodeEls; }"
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
		const doc = L.getDoc(), nodeEls = L.nodeEls();
		let cx = 0, cy = 0, s1;
		if (sc.view === 'fit') {
			L.zoomExtent();
			s1 = L.state().s;
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
		const out = [];
		for (const m of sc.mults) {
			if (!L.setView({ cx: cx, cy: cy, s: s1 * m })) { throw new Error(sc.name + ': view refused at ' + m + 'x'); }
			L.refreshLabelText();
			const pipes = lastObs.segments.filter(function (g) { return g.kind === 'link'; });
			let shown = 0, onPipe = 0;
			lastFirstFit.forEach(function (r) {
				const ne = nodeEls[r.id.slice(2)];
				if (r.dropped || !ne || !ne.text || ne.text.style.visibility === 'hidden') { return; }
				const bs = (r.boxes && r.boxes.length) ? r.boxes : [r.box];
				shown++;
				if (pipes.some(function (g) { return bs.some(function (b) { return Collide.segmentInBoxFraction(g, b) > 0; }); })) { onPipe++; }
			});
			out.push({ m: m, shown: shown, onPipe: onPipe });
		}
		forceOff = false;
		return out;
	}

	let tOn = 0, tOff = 0, pOn = 0, pOff = 0;
	for (const sc of SCENES) {
		const off = await layout(sc, true), on = await layout(sc, false);
		on.forEach(function (v, i) {
			const o = off[i];
			console.log(`       ${sc.name} ${v.m}x: node labels drawn ${o.shown} -> ${v.shown}, over a pipe ${o.onPipe} -> ${v.onPipe}`);
			tOn += v.shown; tOff += o.shown; pOn += v.onPipe; pOff += o.onPipe;
		});
	}
	report(pOff > 0, 'the single sweep does draw node labels over pipes, so the comparison is not vacuous', pOff + ' of ' + tOff);
	report(pOn <= 0.8 * pOff, 'clean ground first draws at least a fifth fewer node labels over a pipe',
		pOff + ' -> ' + pOn + ' (' + (100 * (pOn - pOff) / pOff).toFixed(0) + '%)');
	report(tOn >= 0.99 * tOff, '...and gives up no more than 1 in 100 of the node labels drawn',
		tOff + ' -> ' + tOn);

	console.log(`\n${checks - failures}/${checks} checks passed`);
	process.exit(failures ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(1); });
