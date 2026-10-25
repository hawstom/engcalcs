// A ZERO-LENGTH PUMP OR VALVE POINTS ALONG ITS DOWNSTREAM PIPE. Run with:
//   node dev/lpn-spike/zero-length-symbol-harness.js
//
// **THE DEFECT** (WaterGEMS export, 2026-10-19): a pump or valve whose two end nodes sit on one
// point has no direction, so linkSymbolPlace() gave atan2(0,0) = 0 and every such symbol pointed
// due east whatever its pipes did. Tom, 2026-10-21: Bentley points it at the downstream pipe; yes.
// Reads each symbol's own transform off the DOM (symbolG).
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


	function wrapd(a) { return Math.abs(wrap(a)); }
	// Node ids: U upstream pipe's far node; Q the zero-length link's two nodes (Qa, Qb) at (0,0); D the
	// downstream pipe's far node at the given angle. The upstream pipe runs from U (west) into Qa.
	function scene(kind, angDeg, opts) {
		opts = opts || {};
		const r = 100, dx = Math.round(r * Math.cos(angDeg * Math.PI / 180) * 1e6) / 1e6,
			dy = Math.round(r * Math.sin(angDeg * Math.PI / 180) * 1e6) / 1e6;
		const lines = ['[JUNCTIONS]', 'Qa 10 0', 'Qb 10 0', 'U 10 0', 'D 10 0', '[RESERVOIRS]', '[TANKS]', '[PIPES]'];
		if (!opts.noUp) { lines.push('PU U Qa 100 10 130 0 Open'); }
		if (!opts.noDown) { lines.push('PD Qb D 100 10 130 0 Open'); }
		if (kind === 'pump') { lines.push('[PUMPS]', 'ZL Qa Qb HEAD CV1', '[VALVES]'); }
		else { lines.push('[PUMPS]', '[VALVES]', 'ZL Qa Qb 6 TCV 5 0'); }
		lines.push('[CURVES]', ';PUMP:', 'CV1 100 50', '[COORDINATES]', 'Qa 0 0', 'Qb 0 0', 'U -100 30', 'D ' + dx + ' ' + dy,
			'[VERTICES]', '[OPTIONS]', 'UNITS GPM', 'HEADLOSS H-W', '[END]', '');
		return lines.join('\n');
	}
	function symbolOf(text, name) {
		open(text, name);
		const l = L.getDoc().links.find((x) => x.id === 'ZL');
		return drawn(L.linkEls()['ZL']);
	}
	// The canvas draws y down: a pipe running north (.inp y up) is drawn at -90.
	// A symbol "points" to angle t when rotate(angle) plus the flip leaves the discharge along t.
	// The flip is a vertical mirror applied BEFORE the rotate, so it never changes the axis: the axis is the rotation.
	console.log('\n1. DOWNSTREAM PIPE AT FOUR ANGLES, PUMP AND VALVE');
	[['east', 0], ['north', 90], ['south', -90], ['west', 180], ['30 degrees', 30], ['-150 degrees', -150]].forEach(([nm, ang]) => {
		['pump', 'valve'].forEach((kind) => {
			const g = symbolOf(scene(kind, ang), kind + nm);
			ok(kind + ', downstream pipe ' + nm + ': points along it', wrapd(g.angle + ang) < 1e-4, 'drawn ' + g.angle.toFixed(3) + ' want ' + (-ang));
			ok(kind + ', downstream pipe ' + nm + ': mirrored exactly when it runs west', g.flip === (Math.cos(ang * Math.PI / 180) < -1e-9));
		});
	});

	console.log('\n2. NO DOWNSTREAM PIPE: THE UPSTREAM ONE CARRIES THE FLOW THROUGH');
	['pump', 'valve'].forEach((kind) => {
		const g = symbolOf(scene(kind, 0, { noDown: true }), kind + 'noDown');
		// upstream pipe lies from (-100,30) to the point: flow direction is (100,-30) in .inp coordinates (y up);
		// the canvas draws y down, so the drawn angle is the negative
		const want = -Math.atan2(-30, 100) * 180 / Math.PI;
		ok(kind + ': points the way the upstream pipe runs into it', wrapd(g.angle - want) < 1e-4, 'drawn ' + g.angle.toFixed(3) + ' want ' + want.toFixed(3));
	});

	console.log('\n3. ISOLATED: NO OTHER LINK, STAYS AT 0 DEGREES');
	['pump', 'valve'].forEach((kind) => {
		const g = symbolOf(scene(kind, 0, { noDown: true, noUp: true }), kind + 'alone');
		ok(kind + ': 0 degrees, no flip, no NaN', g.angle === 0 && !g.flip && isFinite(g.x) && isFinite(g.y));
	});

	console.log('\n4. SEVERAL PIPES AT THE DOWNSTREAM NODE: THE FIRST IN LINK ORDER');
	{
		const t = scene('pump', 90).replace('[PUMPS]', 'PX Qb U 100 10 130 0 Open\n[PUMPS]');
		const g = symbolOf(t, 'several');
		ok('the first pipe at the node (PD, north) wins over a later one', wrapd(g.angle + 90) < 1e-4, g.angle.toFixed(3));
	}

	console.log('\n5. A NON-ZERO-LENGTH PUMP IS UNCHANGED');
	{
		const t = scene('pump', 90).replace('Qb 0 0', 'Qb 50 0');
		const g = symbolOf(t, 'long');
		ok('turns to its own segment (east), not to the pipe beyond', wrapd(g.angle) < 1e-4, g.angle.toFixed(3));
	}

	console.log('\n6. TOM\'S WATERGEMS EXPORT (skipped when the file is not there)');
	const tom = process.env.WTG_TGH_INP || path.join(process.env.HOME || '', 'tom-files/2026-10-19/WTG-export-tgh-1-TGH-1.inp');
	if (!fs.existsSync(tom)) { console.log('  NOT RUN  ' + tom + ' not found'); } else {
		open(fs.readFileSync(tom, 'utf8'), 'tgh');
		const d2 = L.getDoc(), e2 = L.linkEls();
		const syms = d2.links.filter((l) => l.type === 'pump' || l.type === 'valve');
		let zl = 0;
		syms.forEach((l) => {
			const pts = L.linkPointList(l);
			if (Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y) > 1e-6) { return; }
			zl++;
			const g = drawn(e2[l.id]), n2 = l.to;
			const o = d2.links.find((x) => x !== l && (x.from === n2 || x.to === n2));
			if (!o) { ok(l.id + ': no pipe at its downstream node', true, 'skipped'); return; }
			const far = o.from === n2 ? L.nodeAt(d2.nodes.find((n) => n.id === o.to)) : L.nodeAt(d2.nodes.find((n) => n.id === o.from));
			const want = Math.atan2(far.y - pts[0].y, far.x - pts[0].x) * 180 / Math.PI;
			ok(l.id + ' (' + l.type + '): points along its downstream pipe ' + o.id, wrapd(g.angle - want) < 1e-4, 'drawn ' + g.angle.toFixed(2) + ' want ' + want.toFixed(2));
		});
		ok('the file has zero-length pumps and valves', zl === 9, String(zl));
	}
	console.log(`\n${checks - failures}/${checks} checks passed`);
	process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
