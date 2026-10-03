// A PROJECT SWITCHED BACK TO AFTER ITS DRAWING WAS EVICTED DRAWS THE LABELS IT LEFT (ROADMAP Task
// 758). Run with:
//   node dev/lpn-spike/label-evict-return-harness.js
//
// Task 680 keeps four drawings and eight solves-with-label-layouts. A tab left for more than four
// others loses its DRAWING; coming back rebuilds the shapes and puts the kept label layout back on
// them. Perry, 2026-10-03, on master's code: visit Novato, zoom, visit five other tabs, return --
// 78 of 123 labels drawn differently at the same view. Valid layout, not stale values; but a label
// that moves on its own when the reader comes back is the thing Task 680 exists to prevent.
//
// What this pins, on the geographic Novato with its own label settings and on Net3 with every label
// field on, each zoomed a few wheel notches in so the labels are crowded and the shed has work:
//   1. return after eviction draws EXACTLY the labels on screen when the reader left (every label
//      text, position, rotation, anchor and visibility, customer labels included);
//   2. and a wheel notch in and back out after the return draws that same picture again -- the
//      first settle after the return runs a fresh pass (the bank was emptied with the drawing), so
//      this is the zoom pass reproducing itself (zoom-pass-determinism-harness.js);
//   3. after an ordinary return (the drawing KEPT, one tab away), a notch in and back out draws that
//      picture again too -- no pass runs on arrival, so the next one must not place by the other
//      tab's node context;
//   and the restore really ran (counted), so (1) cannot pass by a re-layout that happens to agree.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const stub = require('./lpn-dom-stub.js');
const { setUnitSet, loadLoopedNetwork } = stub;

const L = loadLoopedNetwork(
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tcustomersLayer = el('g', { 'class': 'lpn-customers' }, modelLayer);\n" +
	"\t\t\tlinksLayer = el('g', { 'class': 'lpn-symbols' }, modelLayer);\n" +
	"\t\t\tlinkSymbolLayer = el('g', { 'class': 'lpn-symbols' }, modelLayer);\n" +
	"\t\t\tnodesLayer = el('g', { 'class': 'lpn-symbols' }, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h;\n" +
	"\t\t\tsvg.getBoundingClientRect = function () { return { left: 0, right: w, top: 0, bottom: h, width: w, height: h }; }; },\n" +
	"\t\tmarkSized: noteMapSized,\n" +
	"\t\taddNode: addNode, addLink: addLink, getDoc: function () { return doc; },\n" +
	"\t\tnewProject: newProject, openProject: openProject,\n" +
	"\t\topenId: function () { return library.openId; },\n" +
	"\t\tsaveToStorage: saveToStorage, applySaved: applySaved, prepare: prepareDocument, refreshAll: refreshAllFromDocument,\n" +
	"\t\trefreshLabelText: refreshLabelText, addCustomer: addCustomer,\n" +
	"\t\tsolveNative: function () { applySolveResult(EngCalcs.lpnSolve(assembleModel(), { tol: solveAccuracy() })); },\n" +
	"\t\tlabelSettings: function () { return labelSettings; }, settings: function () { return settings; },\n" +
	"\t\tstate: function () { return state; }, zoomAbout: zoomAbout, labelsHidden: function () { return dataLabelsHidden; },\n" +
	"\t\tsettle: function () { if (reshedTimer) { clearTimeout(reshedTimer); reshedTimer = null; } reshedNow(); },\n" +
	"\t\tcounts: function () { return { built: drawingsBuilt, reused: drawingsReused, restores: switchRestoreCount, miss: keptLayoutMiss }; },\n" +
	"\t\tkeepMax: function () { return DRAWING_KEEP_MAX; },\n" +
	// THE LABELS AS A READER SEES THEM, one entry per label: hidden, or its text, position, rotation
	// and anchor -- every node, link (and each repeat station) and customer label.
	"\t\tpicture: function () {\n" +
	"\t\t\tvar out = {};\n" +
	"\t\t\tfunction shown(t) { return t && t.style.visibility !== 'hidden' && t.style.display !== 'none'; }\n" +
	"\t\t\tfunction txt(e) { return (e._text || '') + (e.children || []).map(txt).join('|'); }\n" +
	"\t\t\tfunction r(v) { return v === undefined || v === null || v === '' ? '' : (isFinite(+v) ? (+v).toFixed(4) : String(v)); }\n" +
	"\t\t\tfunction rt(v) { return String(v || '').replace(/-?[0-9.]+(e-?[0-9]+)?/g, function (m) { return (+m).toFixed(4); }); }\n" +
	"\t\t\tfunction one(t) { if (!shown(t)) { return 'hidden'; }\n" +
	"\t\t\t\treturn [txt(t), r(t.getAttribute('x')), r(t.getAttribute('y')), rt(t.getAttribute('transform')),\n" +
	"\t\t\t\t\tt.getAttribute('text-anchor') || ''].join(' ; '); }\n" +
	"\t\t\tObject.keys(nodeEls).forEach(function (id) { var h = nodeEls[id]; if (h.text) { out['n:' + id] = h.empty ? 'empty' : one(h.text); } });\n" +
	"\t\t\tObject.keys(linkEls).forEach(function (id) { var h = linkEls[id]; if (!h.text) { return; }\n" +
	"\t\t\t\tout['l:' + id] = h.empty ? 'empty' : [one(h.text)].concat((h.repeats || []).map(function (q) { return one(q.text); })).join(' // '); });\n" +
	"\t\t\tObject.keys(custLblEls).forEach(function (id) { out['c:' + id] = one(custLblEls[id].text); });\n" +
	"\t\t\treturn out; }"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name + (extra === undefined ? '' : '   ' + extra)); return true; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
	return false;
}
function differing(a, b) {
	return Object.keys(a).filter(function (k) { return a[k] !== b[k]; })
		.concat(Object.keys(b).filter(function (k) { return !(k in a); }));
}
function shownCount(p) { return Object.keys(p).filter(function (k) { return p[k] !== 'hidden' && p[k] !== 'empty'; }).length; }

setUnitSet('us');
L.buildLayers();
const W = 1400, H = 700;
L.setCanvas(W, H);
L.markSized();
const CX = W / 2, CY = H / 2;
function notch(f) { L.zoomAbout(CX, CY, f); L.settle(); }

function load(name) {
	const saved = JSON.parse(fs.readFileSync(path.join(__dirname, '../water-network-examples', name), 'utf8'));
	if (saved.settings) { saved.settings.labelMaxWidth = null; }   // "always show labels" -- see switch-keep-harness.js
	return saved;
}
function smallProject(i) {
	L.newProject();
	const p = L.addNode('junction', i * 7, i * 3), q = L.addNode('junction', i * 7 + 100, i * 3 + 20);
	L.addLink('pipe', p.id, q.id);
	L.saveToStorage();
	return L.openId();
}

function scenario(title, file, setup, zoomNotches) {
	console.log('\n--- ' + title + ' ---');
	L.newProject();
	const big = L.openId();
	// Through the page's own migration, as File > Open does: a shipped example is an old version.
	L.applySaved(L.prepare(load(file)));
	L.refreshAll();
	if (setup) { setup(); }
	L.solveNative();
	L.refreshLabelText();
	L.saveToStorage();
	// Zoomed in from the fit until the labels are on, then a few notches more: a crowd.
	let k = 0;
	while (L.labelsHidden() && k++ < 60) { notch(1.1); }
	for (let i = 0; i < zoomNotches; i++) { notch(1.1); }
	L.saveToStorage();
	const before = L.picture(), s0 = L.state().s;
	ok('labels are drawn at the view left (or nothing below means anything)', shownCount(before) > 40,
		shownCount(before) + ' of ' + Object.keys(before).length + ' labels shown');
	// Away to more tabs than the drawing keep holds, so this drawing is evicted.
	const others = [];
	for (let i = 0; i <= L.keepMax(); i++) { others.push(smallProject(i)); }
	others.forEach(function (id) { L.openProject(id); });
	const c0 = L.counts();
	L.openProject(big);
	const c1 = L.counts();
	ok('the drawing was evicted, so the return BUILT it', c1.built === c0.built + 1 && c1.reused === c0.reused,
		JSON.stringify({ built: c1.built - c0.built, reused: c1.reused - c0.reused }));
	ok('...at the same view', Math.abs(L.state().s / s0 - 1) < 1e-9, L.state().s + ' vs ' + s0);
	ok('...and put the kept label layout back rather than laying out again', c1.restores === c0.restores + 1,
		'restores +' + (c1.restores - c0.restores) + (c1.miss ? ', refused: ' + c1.miss : ''));
	const after = L.picture(), d1 = differing(before, after);
	ok('1. every label is drawn exactly as it was when the reader left', d1.length === 0,
		d1.length + ' of ' + Object.keys(before).length + ' differ; first ' + d1[0] +
		(d1[0] ? '\n         before ' + before[d1[0]] + '\n         after  ' + after[d1[0]] : ''));
	notch(1.1); notch(1 / 1.1);
	const again = L.picture(), d2 = differing(before, again);
	ok('2. a notch in and back out after the return draws the same picture again', d2.length === 0,
		d2.length + ' of ' + Object.keys(before).length + ' differ; first ' + d2[0] +
		(d2[0] ? '\n         before ' + before[d2[0]] + '\n         after  ' + again[d2[0]] : ''));
	// And the ordinary return, the drawing KEPT: one tab away and back, then the same notch in and
	// out. No pass runs on arrival, so the first one after it must not place by the other tab's
	// node context (which only a content pass builds).
	const c2 = L.counts();
	L.openProject(others[0]); L.openProject(big);
	const c3 = L.counts();
	notch(1.1); notch(1 / 1.1);
	const kept = L.picture(), d3 = differing(before, kept);
	ok('3. after a return to the KEPT drawing, a notch in and back out draws the same picture again',
		c3.reused === c2.reused + 1 && d3.length === 0,
		'reused +' + (c3.reused - c2.reused) + ', ' + d3.length + ' of ' + Object.keys(before).length + ' differ; first ' + d3[0] +
		(d3[0] ? '\n         before ' + before[d3[0]] + '\n         after  ' + kept[d3[0]] : ''));
}

scenario('Novato (geographic), its own label settings', 'Net3-Novato-CA-World.lwn', null, 3);
scenario('Net3, every label field on, three meters', 'Net3.lwn', function () {
	const ls = L.labelSettings();
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
	const doc = L.getDoc();
	const byId = {}; doc.nodes.forEach(function (n) { byId[n.id] = n; });
	const longest = doc.links.slice().sort(function (a, b) {
		return Math.hypot(byId[b.from].x - byId[b.to].x, byId[b.from].y - byId[b.to].y) -
			Math.hypot(byId[a.from].x - byId[a.to].x, byId[a.from].y - byId[a.to].y);
	})[0];
	const a = byId[longest.from], b = byId[longest.to];
	for (let i = 1; i <= 3; i++) {
		const t = i / 4;
		L.addCustomer(a.x + (b.x - a.x) * t + 2, a.y + (b.y - a.y) * t + 2, { link: longest.id });
	}
}, 4);

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
