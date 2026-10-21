// A PUMP OR VALVE SYMBOL SITS ON ITS PIPE AT HALF ITS LENGTH, ON A BENT PIPE TOO. Run with:
//   node dev/lpn-spike/pump-valve-bent-pipe-harness.js
//
// **THE DEFECT** (the WaterGEMS import, 2026-10-19): positionPumpSymbol() put the symbol at the
// midpoint of the two END nodes and turned it to the end-to-end chord, ignoring [VERTICES]. On a
// bent pump or valve link the symbol floated off its pipe. The label, the DXF block and the arrows
// already measured along the polyline. The same wrong chord boxed the symbol as a label obstacle,
// and Find zoomed to it.
//
// Reads each symbol's own transform off the DOM (symbolG), not the helper's arithmetic. Asserts the
// centre lies ON the polyline at half its length and the rotation is that segment's angle.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const stub = require('./lpn-dom-stub.js');
const { ROOT, loadLoopedNetwork, setUnitSet } = stub;
require(ROOT + 'js/lpn-inp.js');

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

// Two bends well off the chord: a pump with three vertices, a valve with two, one running right to left.
const INP = [
	'[JUNCTIONS]', 'A 10 0', 'B 10 0', 'C 10 0', 'D 10 0', '[RESERVOIRS]', 'R 100', '[TANKS]',
	'[PIPES]', 'P1 R A 100 10 130 0 Open', 'P2 B C 100 10 130 0 Open',
	'[PUMPS]', 'PU1 A B HEAD CV1',
	'[VALVES]', 'VA1 C D 6 TCV 5 0',
	'[CURVES]', ';PUMP:', 'CV1 100 50',
	'[COORDINATES]', 'R -100 0', 'A 0 0', 'B 100 0', 'C 100 -50', 'D 0 -50',
	'[VERTICES]',
	'PU1 20 80', 'PU1 50 120', 'PU1 80 90',      // up and over: chord is flat, polyline is not
	'VA1 100 -300', 'VA1 0 -300',                 // down, across right to left, back up
	'[OPTIONS]', 'UNITS GPM', 'HEADLOSS H-W', '[END]', ''
].join('\n');

function along(pts, f) {
	const seg = []; let total = 0;
	for (let i = 0; i + 1 < pts.length; i++) { const d = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y); seg.push(d); total += d; }
	let want = f * total, run = 0;
	for (let i = 0; i < seg.length; i++) {
		if (run + seg[i] >= want) {
			const t = (want - run) / seg[i];
			return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * t, y: pts[i].y + (pts[i + 1].y - pts[i].y) * t,
				angle: Math.atan2(pts[i + 1].y - pts[i].y, pts[i + 1].x - pts[i].x) * 180 / Math.PI,
				flip: pts[i + 1].x - pts[i].x < 0, onSeg: i };
		}
		run += seg[i];
	}
}

(async function () {
	setUnitSet('us');
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
		"\t\tapplySaved: applySaved, buildDom: buildDom, noteMapSized: noteMapSized, migrateSaved: migrateSaved,\n" +
		"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections, applyUnitSelections: applyUnitSelections,\n" +
		"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
		"\t\tgetDoc: function () { return doc; }, nodeAt: nodeAt, linkPointList: linkPointList,\n" +
		"\t\tfindPointOf: findPointOf, linkEls: function () { return linkEls; }"
	);
	L.buildLayers();
	L.setCanvas(1400, 900);

	function open(text, name) {
		const parsed = EngCalcs.lpnInpParse(text);
		if (!parsed.ok) { throw new Error(name + ': ' + parsed.error); }
		L.applyUnitSelections(L.inpUnitSelections(parsed));
		L.applySaved(L.migrateSaved(L.docFromInp(parsed, name)));
		L.buildDom(); L.noteMapSized();
	}
	function drawn(le) {
		const m = /translate\(([-0-9.e]+),([-0-9.e]+)\) rotate\(([-0-9.e]+)\)( scale\(1,-1\))?/.exec(le.symbolG.getAttribute('transform') || '');
		if (!m) { throw new Error('symbol transform unreadable: ' + le.symbolG.getAttribute('transform')); }
		return { x: +m[1], y: +m[2], angle: +m[3], flip: !!m[4] };
	}
	function wrap(a) { return ((a % 360) + 540) % 360 - 180; }

	console.log('\n1. A PUMP AND A VALVE, EACH ON A BENT PIPE');
	open(INP, 'bent');
	const doc = L.getDoc(), els = L.linkEls();
	['PU1', 'VA1'].forEach((id) => {
		const l = doc.links.find((x) => x.id === id), le = els[id];
		ok(id + ': has vertices and a drawn symbol', l.verts.length >= 2 && !!le.symbolG, 'verts ' + l.verts.length);
		const pts = L.linkPointList(l), want = along(pts, 0.5), got = drawn(le);
		const chord = { x: (pts[0].x + pts[pts.length - 1].x) / 2, y: (pts[0].y + pts[pts.length - 1].y) / 2 };
		ok(id + ': the chord midpoint is well off the pipe (the scene is a real test)', Math.hypot(want.x - chord.x, want.y - chord.y) > 20,
			Math.hypot(want.x - chord.x, want.y - chord.y).toFixed(1));
		ok(id + ': centre is at half the polyline length', Math.hypot(got.x - want.x, got.y - want.y) < 1e-6,
			'drawn ' + got.x.toFixed(2) + ',' + got.y.toFixed(2) + ' want ' + want.x.toFixed(2) + ',' + want.y.toFixed(2));
		ok(id + ': rotation is the angle of the segment the centre falls on', Math.abs(wrap(got.angle - want.angle)) < 1e-6,
			'drawn ' + got.angle.toFixed(2) + ' want ' + want.angle.toFixed(2) + ' (segment ' + want.onSeg + ')');
		ok(id + ': mirrored exactly when that segment runs west', got.flip === want.flip);
		const fp = L.findPointOf({ group: 'link', el: l });
		ok(id + ': Find zooms to the same point', Math.hypot(fp.x - want.x, fp.y - want.y) < 1e-6);
	});

	console.log('\n2. TOM\'S WATERGEMS EXPORT (skipped when the file is not there)');
	const tom = process.env.WTG_TGH_INP || path.join(process.env.HOME || '', 'tom-files/2026-10-19/WTG-export-tgh-1-TGH-1.inp');
	if (!fs.existsSync(tom)) { console.log('  NOT RUN  ' + tom + ' not found'); } else {
		open(fs.readFileSync(tom, 'utf8'), 'tgh');
		const d2 = L.getDoc(), e2 = L.linkEls();
		const syms = d2.links.filter((l) => l.type === 'pump' || l.type === 'valve');
		ok('the file draws its pumps and valves', syms.length === 9, String(syms.length));
		let off = 0, bad = '';
		syms.forEach((l) => {
			const want = along(L.linkPointList(l), 0.5), got = drawn(e2[l.id]);
			if (Math.hypot(got.x - want.x, got.y - want.y) > 1e-6) { off++; bad += ' ' + l.id; }
		});
		ok('every symbol sits at half its link\'s length', off === 0, off + ' off:' + bad);
	}
	console.log(`\n${checks - failures}/${checks} checks passed`);
	process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
