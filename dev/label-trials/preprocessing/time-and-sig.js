// Label pass time (median of REPS runs) and a layout fingerprint per view, on Net3, Novato and the
// 600-junction downtown fixture, for comparing two copies of the page code. Run:
//   node dev/label-trials/preprocessing/time-and-sig.js <repo-or-patched-copy>
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
		const reps = Number(process.env.REPS || 5), sig = [], times = [];
		for (const m of sc.mults) {
			L.setView({ cx: cx, cy: cy, s: s1 * m });
			const ts = [];
			for (let r = 0; r < reps; r++) { const t0 = process.hrtime.bigint(); L.refreshLabelText(); ts.push(Number(process.hrtime.bigint() - t0) / 1e6); }
			ts.sort((a, b) => a - b); times.push(ts[Math.floor(ts.length / 2)]);
			const parts = [];
			doc.nodes.forEach(n => { const e = nodeEls[n.id]; if (!e) return; parts.push('n' + n.id + ':' + shown(e) + ':' + (e.nudge ? e.nudge.x.toFixed(6) + ',' + e.nudge.y.toFixed(6) : '') + ':' + (e.lines || []).length); });
			doc.links.forEach(l => { const e = linkEls[l.id]; if (!e) return; parts.push('l' + l.id + ':' + shown(e) + ':' + (e.nudge ? e.nudge.x.toFixed(6) + ',' + e.nudge.y.toFixed(6) : '') + ':' + (e.lines || []).length); });
			sig.push(require('crypto').createHash('sha1').update(parts.join('|')).digest('hex').slice(0, 12));
		}
		console.log(JSON.stringify({ scene: sc.name, mults: sc.mults, ms: times.map(t => +t.toFixed(1)), sig: sig }));
	}
})().catch(e => { console.error(e); process.exit(1); });
