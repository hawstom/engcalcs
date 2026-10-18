// Why master hides pipe labels: the hide flag on each pipe label touching the view, on Net3 and Novato
// (fit, 2x, 4x, 8x) and the 600-junction downtown fixture (the bench's five zooms). Run:
//   node dev/label-trials/preprocessing/hide-reasons.js <repo>
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const fs = require('fs'), path = require('path');
const REPO = path.resolve(process.argv[2]);
const NODE_FIELDS = ['id', 'pressure', 'demand', 'elev'], LINK_FIELDS = ['id', 'flow', 'velocity'];
const SCENES = [
	{ name: 'Net3', file: REPO + '/dev/water-network-examples/Net3.lwn', view: 'fit', mults: [1, 2, 4, 8] },
	{ name: 'Novato', file: REPO + '/dev/water-network-examples/Net3-Novato-CA-World.lwn', view: 'fit', mults: [1, 2, 4, 8] },
	{ name: 'n600', file: REPO + '/dev/lpn-spike/fixtures/plain-downtown-n600-seed71.lwn', view: 'density', spacingPx: 28, mults: [1, 1.5, 2, 3, 4] }
];
(async function () {
	const stub = require(REPO + '/dev/lpn-spike/lpn-dom-stub.js');
	const { loadLoopedNetwork, setUnitSet, settleEpanet, warmEpanet } = stub;
	setUnitSet('us');
	await warmEpanet();
	for (const sc of SCENES) {
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
			"\t\taligned: function (l) { return linkLabelAligned(l); },\n" +
			"\t\tnodeAt: nodeAt,\n" +
			"\t\tnodeEls: function () { return nodeEls; }, linkEls: function () { return linkEls; }"
		);
		L.buildLayers(); L.setCanvas(1400, 900);
		const saved = JSON.parse(fs.readFileSync(sc.file, 'utf8'));
		saved.settings = saved.settings || {}; saved.settings.labelMaxWidth = null;
		L.applySaved(saved); L.buildDom(); L.noteMapSized();
		const ls = L.labelSettings();
		Object.keys(ls.node).forEach(k => { ls.node[k] = NODE_FIELDS.indexOf(k) >= 0; });
		Object.keys(ls.link).forEach(k => { ls.link[k] = LINK_FIELDS.indexOf(k) >= 0; });
		L.settings().engine = 'epanet';
		L.runSolve(); await settleEpanet();
		const doc = L.getDoc(), nodeEls = L.nodeEls(), linkEls = L.linkEls();
		let cx = 0, cy = 0, s1;
		const pts = doc.nodes.filter(n => n.type !== 'reservoir').map(n => L.nodeAt(n));
		if (sc.view === 'fit') { L.zoomExtent(); s1 = L.state().s; pts.forEach(p => { cx += p.x; cy += p.y; }); cx /= pts.length; cy /= pts.length; }
		else {
			let gx = 0, gy = 0; pts.forEach(p => { gx += p.x; gy += p.y; }); gx /= pts.length; gy /= pts.length;
			let cen = pts[0]; pts.forEach(p => { if (Math.hypot(p.x - gx, p.y - gy) < Math.hypot(cen.x - gx, cen.y - gy)) { cen = p; } });
			const nn = pts.map((p, i) => { let b = Infinity; pts.forEach((q, j) => { if (j !== i) b = Math.min(b, Math.hypot(q.x - p.x, q.y - p.y)); }); return b; }).sort((a, b) => a - b);
			s1 = sc.spacingPx / nn[Math.floor(nn.length / 2)]; cx = cen.x; cy = cen.y;
		}
		const shown = h => !!h && !!h.text && h.text.style.visibility !== 'hidden';
		console.log('\n' + sc.name + ' (aligned setting: ' + (doc.links[0] ? L.aligned(doc.links[0]) : '?') + ')');
		console.log('view   pipes  shown  short crowded blocked yielded crossed other | nodes shown dropped');
		for (const m of sc.mults) {
			L.setView({ cx: cx, cy: cy, s: s1 * m });
			const t0 = Date.now(); L.refreshLabelText(); const ms = Date.now() - t0;
			const st = L.state(), inView = p => { const x = p.x * st.s + st.tx, y = p.y * st.s + st.ty; return x >= 0 && x <= 1400 && y >= 0 && y <= 900; };
			const c = { pipes: 0, shown: 0, short: 0, crowded: 0, blocked: 0, yielded: 0, crossed: 0, other: 0, nodes: 0, nshown: 0, ndrop: 0 };
			doc.links.forEach(l => {
				const le = linkEls[l.id]; if (!le || le.empty) return;
				const a = L.nodeAt(doc.nodes.find(n => n.id === l.from)), b = L.nodeAt(doc.nodes.find(n => n.id === l.to));
				if (!a || !b || !(inView(a) || inView(b))) return;
				c.pipes++;
				if (shown(le)) { c.shown++; return; }
				if (le.hiddenShort) c.short++; else if (le.hiddenCrowded) c.crowded++; else if (le.hiddenBlocked) c.blocked++;
				else if (le.hiddenYielded) c.yielded++; else if (le.hiddenCrossed) c.crossed++; else c.other++;
			});
			doc.nodes.forEach(n => { const ne = nodeEls[n.id]; if (!ne || ne.empty || !inView(L.nodeAt(n))) return; c.nodes++; if (shown(ne)) c.nshown++; else c.ndrop++; });
			console.log((m + 'x').padEnd(6), [c.pipes, c.shown, c.short, c.crowded, c.blocked, c.yielded, c.crossed, c.other].map(v => String(v).padStart(6)).join(' '), '|', c.nodes, c.nshown, c.ndrop, ' ', ms + ' ms');
		}
	}
})().catch(e => { console.error(e); process.exit(1); });
