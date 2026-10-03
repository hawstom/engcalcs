// THE ZOOM LABEL PASS IS A FUNCTION OF THE DRAWING AND THE SCALE, NOT OF THE ZOOMS BEFORE IT.
// Run with:
//   node dev/lpn-spike/zoom-pass-determinism-harness.js
//
// Found 2026-10-03 by the label-cache build: the uncached zoom pass gave two different answers at
// one scale, depending on which notches led there, and the bank hid it on a revisit. Cause: the
// zoom pass's link shed (shedAlignedForConflicts() inside reshedLinkLabels()) predicts the node
// labels from whatever content the LAST pass left them with -- shed for the previous scale -- and
// only then does runLabelCollisionAvoidance() put them back to full. The content pass was cured of
// the same memory by Task 539 (unshedNodeLabels() before the shed); the zoom pass never was.
//
// What this pins, with the bank switched OFF so every settle is a real pass:
//   1. the same pass run twice in place at one scale draws the identical picture;
//   2. reaching one scale by different wheel histories (in and out, out and in, two deep, three
//      deep) draws the identical picture every time -- on Net3 with every label field on and
//      three meters, at three zooms, and on the geographic Novato with its own label settings.
// The picture is every label's text, position, rotation, anchor and visibility, as drawn.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const fs = require('fs');
const path = require('path');
const stub = require('./lpn-dom-stub.js');
const { loadLoopedNetwork, setUnitSet } = stub;

const L = loadLoopedNetwork(
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tcustomersLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h;\n" +
	"\t\t\tsvg.getBoundingClientRect = function () { return { left: 0, top: 0, right: w, bottom: h, width: w, height: h }; }; },\n" +
	"\t\tapplySaved: applySaved, prepare: prepareDocument, buildDom: buildDom, noteMapSized: noteMapSized,\n" +
	"\t\trefreshLabelText: refreshLabelText, zoomAbout: zoomAbout, reshedNow: reshedNow, addCustomer: addCustomer,\n" +
	"\t\tsolveNative: function () { applySolveResult(EngCalcs.lpnSolve(assembleModel(), { tol: solveAccuracy() })); },\n" +
	"\t\tlabelSettings: function () { return labelSettings; }, settings: function () { return settings; },\n" +
	"\t\tgetDoc: function () { return doc; }, state: function () { return state; },\n" +
	"\t\tlabelsHidden: function () { return dataLabelsHidden; },\n" +
	"\t\tpasses: function () { return labelCachePasses; },\n" +
	"\t\tsetCacheEnabled: function (v) { labelCacheEnabled = v; },\n" +
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
const W = 1400, H = 700, CX = W / 2, CY = H / 2;
L.setCanvas(W, H);
const doc = L.getDoc();
const st = L.state();
L.setCacheEnabled(false);
function settle() { const p = L.passes(); L.reshedNow(); return L.passes() - p; }
function notch(f) { L.zoomAbout(CX, CY, f); settle(); }

function open(file, setup) {
	const saved = JSON.parse(fs.readFileSync(path.join(__dirname, '../water-network-examples', file), 'utf8'));
	if (saved.settings) { saved.settings.labelMaxWidth = null; }
	L.applySaved(L.prepare(saved));   // migrated, as File > Open does
	L.buildDom();
	L.noteMapSized();
	if (setup) { setup(); }
	L.solveNative();
	L.refreshLabelText();
}
// The model's own centre, zoomed so it spans the canvas `zx` times over.
function frame(zx) {
	let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
	doc.nodes.forEach(function (n) { x0 = Math.min(x0, n.x); x1 = Math.max(x1, n.x); y0 = Math.min(y0, n.y); y1 = Math.max(y1, n.y); });
	st.s = Math.min(W / (x1 - x0), H / (y1 - y0)) * zx;
	st.tx = W / 2 - st.s * (x0 + x1) / 2;
	st.ty = H / 2 - st.s * (y0 + y1) / 2;
}
const I = 1.1, O = 1 / 1.1;
const HISTORIES = {
	'in, out': [I, O], 'out, in': [O, I], 'in, in, out, out': [I, I, O, O],
	'out, out, in, in': [O, O, I, I], 'in x3, out x3': [I, I, I, O, O, O], 'in, out, out, in': [I, O, O, I]
};
function check(title, zx) {
	frame(zx);
	settle();
	// The reference is the picture after one notch in and back out, so it is itself a ZOOM pass's
	// answer and not the content pass's that opened the file.
	notch(I); notch(O);
	const s0 = st.s, ref = L.picture();
	console.log('\n--- ' + title + ' ---');
	if (!ok('labels are drawn (or nothing below means anything)', shownCount(ref) > 40,
		shownCount(ref) + ' of ' + Object.keys(ref).length + ' shown')) { return; }
	const passes = settle(), again = L.picture(), d0 = differing(ref, again);
	ok('1. the same pass run again in place draws the identical picture', passes === 1 && d0.length === 0,
		passes + ' pass, ' + d0.length + ' labels differ');
	const bad = [];
	Object.keys(HISTORIES).forEach(function (h) {
		HISTORIES[h].forEach(notch);
		const p = L.picture(), d = differing(ref, p);
		if (Math.abs(st.s / s0 - 1) > 1e-9 || d.length) {
			bad.push(h + ': ' + d.length + ' differ (first ' + d[0] + '\n           ref ' + ref[d[0]] + '\n           got ' + p[d[0]] + ')');
		}
	});
	ok('2. ' + Object.keys(HISTORIES).length + ' different wheel histories to the same scale all draw the identical picture',
		!bad.length, bad.length + ' did not' + (bad.length ? ':\n         ' + bad.join('\n         ') : ''));
}

open('Net3.lwn', function () {
	const ls = L.labelSettings();
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
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
});
[3, 6, 12].forEach(function (zx) { check('Net3, every label field on, ' + zx + 'x the fit', zx); });
open('Net3-Novato-CA-World.lwn');
[4, 8].forEach(function (zx) { check('Novato (geographic), its own label settings, ' + zx + 'x the fit', zx); });

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
