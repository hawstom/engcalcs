// The label views the port plan measures (dev/label-trials/port-plan.md), on the DOM stub: Net3 and
// Net3 on the world map near Novato at their fit view and closer, and the bench's 600-junction
// downtown network at its five zooms. Node fields ID, P, Qb, Z; link fields ID, Q, V; solved through
// EPANET. Shared by label-pass-memo-harness.js and pipe-label-level-harness.js, so the two count
// the same views.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');

const NODE_FIELDS = ['id', 'pressure', 'demand', 'elev'], LINK_FIELDS = ['id', 'flow', 'velocity'];
const EX = path.join(__dirname, '..', 'water-network-examples');
const SCENES = [
	{ name: 'Net3', file: path.join(EX, 'Net3.lwn'), view: 'fit', mults: [1, 2, 4, 8] },
	{ name: 'Novato', file: path.join(EX, 'Net3-Novato-CA-World.lwn'), view: 'fit', mults: [1, 2, 4, 8] },
	{ name: 'n600', file: path.join(__dirname, 'fixtures', 'plain-downtown-n600-seed71.lwn'), view: 'density', spacingPx: 28, mults: [1, 1.5, 2, 3, 4] }
];
const W = 1400, H = 900;

const INJECT =
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
	"\t\tlabelsLayer: function () { return labelsLayer; },\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario, setOverride: setOverride,\n" +
	"\t\tsetScenarioSetting: setScenarioSetting, activeScenario: activeScenario,\n" +
	"\t\tnodeAt: nodeAt,\n" +
	"\t\tnodeEls: function () { return nodeEls; }, linkEls: function () { return linkEls; }";

// Opens one scene, solved, and returns the page handle with the scale and centre of its first view.
async function openScene(stub, sc, mutate) {
	const { loadLoopedNetwork, settleEpanet } = stub;
	const L = loadLoopedNetwork(INJECT, null, mutate);
	L.buildLayers(); L.setCanvas(W, H);
	const saved = JSON.parse(fs.readFileSync(sc.file, 'utf8'));
	saved.settings = saved.settings || {}; saved.settings.labelMaxWidth = null;
	L.applySaved(saved); L.buildDom(); L.noteMapSized();
	const ls = L.labelSettings();
	Object.keys(ls.node).forEach((k) => { ls.node[k] = NODE_FIELDS.indexOf(k) >= 0; });
	Object.keys(ls.link).forEach((k) => { ls.link[k] = LINK_FIELDS.indexOf(k) >= 0; });
	L.settings().engine = 'epanet';
	L.runSolve(); await settleEpanet();
	return Object.assign({ L: L }, viewOrigin(L, sc));
}

function viewOrigin(L, sc) {
	const doc = L.getDoc();
	const pts = doc.nodes.filter((n) => n.type !== 'reservoir').map((n) => L.nodeAt(n));
	let cx = 0, cy = 0, s1;
	if (sc.view === 'fit') {
		L.zoomExtent(); s1 = L.state().s;
		pts.forEach((p) => { cx += p.x; cy += p.y; }); cx /= pts.length; cy /= pts.length;
	} else {
		let gx = 0, gy = 0; pts.forEach((p) => { gx += p.x; gy += p.y; }); gx /= pts.length; gy /= pts.length;
		let cen = pts[0]; pts.forEach((p) => { if (Math.hypot(p.x - gx, p.y - gy) < Math.hypot(cen.x - gx, cen.y - gy)) { cen = p; } });
		const nn = pts.map((p, i) => { let b = Infinity; pts.forEach((q, j) => { if (j !== i) { b = Math.min(b, Math.hypot(q.x - p.x, q.y - p.y)); } }); return b; }).sort((a, b) => a - b);
		s1 = sc.spacingPx / nn[Math.floor(nn.length / 2)]; cx = cen.x; cy = cen.y;
	}
	return { cx: cx, cy: cy, s1: s1 };
}

function shown(h) { return !!h && !!h.text && h.text.style.visibility !== 'hidden'; }

// Every element under the label layer as drawn: tag, the placing attributes, visibility and text.
const ATTRS = ['x', 'y', 'x1', 'y1', 'x2', 'y2', 'dx', 'dy', 'transform', 'd', 'points', 'text-anchor', 'class'];
function drawnLabels(L) {
	const out = [];
	(function walk(e, depth) {
		(e.children || []).forEach((c) => {
			if (c.nodeType !== 1) { return; }
			const vis = (c.style && (c.style.visibility || c.style.display)) || '';
			const parts = [depth, c._tag || c.tagName, vis];
			ATTRS.forEach((a) => { const v = c.getAttribute ? c.getAttribute(a) : undefined; if (v !== undefined && v !== null && v !== '') { parts.push(a + '=' + v); } });
			if (!(c.children || []).some((k) => k.nodeType === 1)) { parts.push('"' + (c.textContent || '') + '"'); }
			out.push(parts.join(' '));
			walk(c, depth + 1);
		});
	})(L.labelsLayer(), 0);
	return out;
}

// Pipe and node labels whose element touches the view, and how many of each are shown, and the
// values (rows) they show. A pipe touches the view if either end is in it.
function countShown(L) {
	const doc = L.getDoc(), st = L.state(), nodeEls = L.nodeEls(), linkEls = L.linkEls();
	const inView = (p) => { const x = p.x * st.s + st.tx, y = p.y * st.s + st.ty; return x >= 0 && x <= W && y >= 0 && y <= H; };
	const byId = {}; doc.nodes.forEach((n) => { byId[n.id] = n; });
	const c = { pipes: 0, pipesShown: 0, pipeRows: 0, pipeRowsAsked: 0, nodes: 0, nodesShown: 0, nodeRows: 0, nodeRowsAsked: 0, level: 0, along: 0 };
	doc.links.forEach((l) => {
		const le = linkEls[l.id]; if (!le || le.empty) { return; }
		const a = L.nodeAt(byId[l.from]), b = L.nodeAt(byId[l.to]);
		if (!a || !b || !(inView(a) || inView(b))) { return; }
		c.pipes++; c.pipeRowsAsked += (le.allLines || le.lines || []).length;
		if (shown(le)) {
			c.pipesShown++; c.pipeRows += (le.lines || []).length;
			if (le.levelBeside) { c.level++; } else { c.along++; }
		}
	});
	doc.nodes.forEach((n) => {
		const ne = nodeEls[n.id]; if (!ne || ne.empty || !inView(L.nodeAt(n))) { return; }
		c.nodes++; c.nodeRowsAsked += (ne.allLines || ne.lines || []).length;
		if (shown(ne)) { c.nodesShown++; c.nodeRows += (ne.lines || []).length; }
	});
	return c;
}

module.exports = { SCENES, NODE_FIELDS, LINK_FIELDS, W, H, openScene, viewOrigin, shown, drawnLabels, countShown };
