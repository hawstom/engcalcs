// **A MAP SYMBOL IS PLACED BY A TRANSFORM, NEVER BY A NESTED <svg>'s x/y** (Task 651).
//
//   node dev/lpn-spike/nested-viewport-harness.js
//
// Tom, 2026-09-13, with a screenshot of the shipped Net3 lat/lon example: *"Firefox Ubuntu shows
// tanks, pumps, and reservoirs away from their locations, and this is stable across zooms,
// reloads, and save/reopen."* The junctions, the pipes, the flow arrows, the labels and the
// basemap tiles beside them were all exactly right; the five vessels and the two pumps were
// scattered kilometres north and west, out over open space.
//
// **THE MECHANISM. GECKO LAYS A NESTED <svg> VIEWPORT OUT IN APP UNITS, WHICH ARE A SIXTIETH OF A
// USER UNIT**, so its `x` and `y` are FLOORED to 1/60 of whatever a world unit happens to be. On
// an XY project a world unit is a foot or a metre and a sixtieth of one is invisible, which is why
// this shipped for as long as it did. On a GEOGRAPHIC project a world unit is a DEGREE, so the same
// floor is one ARCMINUTE -- 1.85 km on the ground, always toward minus infinity on both axes, which
// with an internal y that points down is always west and always north. Measured in Playwright's
// Firefox against the served page: a symbol asked for at x = 0.041453 degrees was drawn at
// 2/60 = 0.033333, and one asked for at -0.000794 was drawn at -1/60.
//
// **IT IS A DISPLACEMENT IN WORLD UNITS, AND THAT IS WHY IT READS AS DATA RATHER THAN AS PAINT.**
// It does not move under zoom, it survives a reload, and it survives a save and reopen -- so the
// first honest reading of the screenshot is that the coordinates in the file are wrong. They are
// not. Every number in the document, and every number this page computes from one, was right; only
// the one attribute Gecko rounds was not. The grab shapes, which have always ridden a `transform`,
// answered the pointer at the node the whole time, so the pump you could not see was still the pump
// you could click.
//
// **THE PROPERTY THIS FILE HOLDS IS ENGINE-INDEPENDENT, WHICH IS THE ONLY REASON IT CAN BE HELD
// HERE.** Nothing in this repository rasterises anything and the failing engine is not in
// dev/browser-pass/run.js at all (it launches Chromium, where the defect is invisible). So the
// assertion is not "Firefox draws it in the right place" -- it is the mechanical invariant that
// makes that true in every engine: **a nested <svg> in the world layer carries nothing but its own
// integer 24 x 24 viewport, and the place and the size ride a <g> transform.** An SVG transform is
// a float matrix and is not laid out, so it has no app units to be rounded into.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const stub = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function check(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log((ok ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

stub.setUnitSet('us');
global.fetch = () => Promise.reject(new Error('no network in this harness'));
global.EngCalcs.setIconLabel = () => {};
global.window.history = { replaceState: () => {} };
global.requestAnimationFrame = global.window.requestAnimationFrame = () => 0;

const canvas = stub.byId.lpn_canvas;
Object.defineProperty(canvas, 'clientWidth', { get() { return 1200; } });
Object.defineProperty(canvas, 'clientHeight', { get() { return 600; } });
canvas.getBoundingClientRect = function () {
	return { left: 0, top: 0, right: 1200, bottom: 600, width: 1200, height: 600 };
};

// THE REAL LAYER STACK, including linkSymbolLayer -- a pump built without one falls back to
// nodesLayer, and half of what is under test here is the pump's own box. Same reason
// ghost-symbol-harness.js builds it.
const L = stub.loadLoopedNetwork(
	"\t\tapplySaved: applySaved, prepareDocument: prepareDocument,\n" +
	"\t\trefreshAllFromDocument: refreshAllFromDocument, buildDom: buildDom,\n" +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tnodeEl: function (id) { return nodeEls[id]; },\n" +
	"\t\tlinkEl: function (id) { return linkEls[id]; },\n" +
	"\t\tsetScale: function (s) { state.s = s; publishScaleSizes(true); },\n" +
	"\t\tresizeAllSymbols: function () { doc.links.forEach(function (l) {\n" +
	"\t\t\tif (linkEls[l.id] && linkEls[l.id].symbolG) { resizePumpSymbol(l.id); positionPumpSymbol(l.id); } });\n" +
	"\t\t\tdoc.nodes.forEach(function (n) { positionNodeSymbol(n.id); }); },\n" +
	"\t\tworldLayer: function () { return world; },\n" +
	"\t\tstorageVersion: function () { return LPN_STORAGE_VERSION; },\n" +
	"\t\tsymbolViewBox: function () { return SYMBOL_VIEWBOX; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg); modelLayer = el('g', {}, world);\n" +
	"\t\t\tbackdropLayer = el('g', {}, modelLayer); gridLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlinkSymbolLayer = el('g', { 'class': 'lpn-symbols' }, modelLayer);\n" +
	"\t\t\tnodesLayer = el('g', {}, modelLayer); labelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

// Novato, California -- the place the shipped example is on, so this file and Tom's screenshot are
// talking about the same ground. The junction, the tank and the reservoir are at the IDENTICAL
// longitude and latitude on purpose: that is the assertion. Three element types, one place, and
// the drawing has to agree with itself.
const LON = -122.5694, LAT = 38.1074;

function geoDoc() {
	return {
		v: L.storageVersion(),
		format: 'lpn',
		project: { name: 'novato', activeScenario: 'base', coords: 'geo' },
		scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
		origin: { x: 0, y: 0 },
		nodes: [
			{ id: 'J1', type: 'junction', x: LON, y: LAT, elev: 100, _demand: 0 },
			{ id: 'TK1', type: 'tank', x: LON, y: LAT, elev: 100, _level: 10 },
			{ id: 'R1', type: 'reservoir', x: LON, y: LAT, _head: 200 },
			{ id: 'J2', type: 'junction', x: LON + 0.004, y: LAT + 0.003, elev: 100, _demand: 0 }
		],
		links: [{ id: 'PU1', type: 'pump', from: 'J1', to: 'J2', verts: [],
			_diameter: 8, _roughness: 130, _length: 0, _k: 0, _status: 'open' }],
		labels: [], settings: {}, view: null,
		nextId: { J: 3, R: 2, L: 1, P: 2, T: 2, X: 1 }
	};
}

// `translate(a,b) scale(c,d)` -- the one shape symbolBoxTransform() writes, and the only shape this
// file has any business parsing. A transform that is not that shape is a finding, not a parse
// failure, so the caller is told rather than thrown at.
function readBox(el) {
	if (!el) { return null; }
	const t = String(el.getAttribute('transform') || '');
	const m = /^translate\(([-\d.eE+]+),([-\d.eE+]+)\) scale\(([-\d.eE+]+),([-\d.eE+]+)\)$/.exec(t);
	if (!m) { return { raw: t }; }
	const vb = L.symbolViewBox();
	return { raw: t, x: +m[1], y: +m[2], w: +m[3] * vb, h: +m[4] * vb,
		cx: +m[1] + (+m[3] * vb) / 2, cy: +m[2] + (+m[4] * vb) / 2 };
}
// **THE CENTRE IS COMPARED TO A TOLERANCE AND IT IS NOT A FUDGE.** The page writes `w / 24` into
// the transform and this file multiplies it back, and `(w / 24) * 24` is not `w` for every double
// -- one unit in the last place, which at these magnitudes is a departure of about 1e-19 degrees,
// or a ten-billionth of a millimetre on the ground. The defect this file guards is 1/60 of a
// degree, which is 1.85 km. Anything between those two numbers is a real finding.
const SAME_PLACE = 1e-12;
function samePlace(a, b) { return Math.abs(a - b) < SAME_PLACE; }

// Every nested <svg> anywhere under the world layer. The scan is the point: a THIRD symbol added
// later, by somebody who has never read this file, is caught by it without being named here.
function nestedSvgs(node, out) {
	out = out || [];
	(node.childNodes || []).forEach(function (k) {
		if (String(k.tagName || '').toLowerCase() === 'svg') { out.push(k); }
		nestedSvgs(k, out);
	});
	return out;
}

L.applySaved(L.prepareDocument(geoDoc()));
L.refreshAllFromDocument();

console.log('--- 1. a tank and a reservoir are drawn where a junction at the same place is ---');
{
	const j = L.nodeEl('J1');
	// The junction's own disc is the reference: a <circle>'s cx/cy is a plain SVG geometry
	// attribute, which no engine rounds, and it is where the pipes and the label already agree the
	// node is.
	const jx = parseFloat(j.circle.getAttribute('cx')), jy = parseFloat(j.circle.getAttribute('cy'));
	check(isFinite(jx) && isFinite(jy), 'the junction draws its disc at a finite place', jx + ', ' + jy);

	[['TK1', 'tank'], ['R1', 'reservoir']].forEach(function (row) {
		const ne = L.nodeEl(row[0]);
		check(!!ne && !!ne.symbolG, 'the ' + row[1] + ' has a symbol box');
		const box = readBox(ne && ne.symbolG);
		check(!!box && box.cx !== undefined,
			'...placed by a translate/scale transform', box && box.raw);
		if (box && box.cx !== undefined) {
			// IDENTICAL, not close. Both are computed from the same n.x/n.y by ordinary
			// arithmetic, so there is nothing here for a tolerance to absorb.
			check(samePlace(box.cx, jx) && samePlace(box.cy, jy),
				'...CENTRED ON THE NODE, the same place the junction is',
				box.cx + ', ' + box.cy + '  vs  ' + jx + ', ' + jy);
			check(box.w > 0 && box.h > 0, '...and its box has a real size', box.w + ' x ' + box.h);
		}
	});

	// A pump sits at the MIDPOINT of its link, so its own <g> carries the place and the rotation
	// and the inner box carries the size. What must be true of the inner box is that it is centred
	// on nothing but the origin of that frame.
	const le = L.linkEl('PU1');
	check(!!le && !!le.symbolBox, 'the pump has a symbol box');
	const pb = readBox(le && le.symbolBox);
	check(!!pb && pb.cx !== undefined, '...placed by a translate/scale transform', pb && pb.raw);
	if (pb && pb.cx !== undefined) {
		check(samePlace(pb.cx, 0) && samePlace(pb.cy, 0),
			'...centred on its link midpoint, which is its own frame origin',
			pb.cx + ', ' + pb.cy);
	}
}

console.log('\n--- 2. THE RULE: a nested <svg> carries nothing a layout engine can round ---');
{
	// This is the assertion that would have caught Task 651 before it shipped, and the one to keep
	// if any of the rest of this file is ever rewritten. A world coordinate on one of these four
	// attributes is floored to 1/60 of a user unit by Gecko -- an arcminute on a geographic map.
	const svgs = nestedSvgs(L.worldLayer());
	check(svgs.length >= 3, 'the world layer holds the symbols under test', svgs.length + ' nested <svg>');
	let bad = 0;
	svgs.forEach(function (s) {
		['x', 'y', 'width', 'height'].forEach(function (a) {
			const v = s.getAttribute(a);
			if (v === null || v === undefined || v === '') { return; }
			const n = parseFloat(v);
			if (!isFinite(n) || n !== Math.round(n)) {
				bad++;
				console.log('       ' + (s.getAttribute('class') || '<no class>') + ' ' + a + '=' + v);
			}
		});
	});
	check(bad === 0, 'NO NESTED <svg> CARRIES A FRACTIONAL COORDINATE OR SIZE', bad + ' attribute(s)');
	// And the viewport really is the icon frame, so the transform's scale means what readBox()
	// says it means.
	const vb = L.symbolViewBox();
	const wrong = svgs.filter(function (s) {
		return parseFloat(s.getAttribute('width')) !== vb || parseFloat(s.getAttribute('height')) !== vb;
	});
	check(wrong.length === 0, '...and each is the icon\'s own ' + vb + ' x ' + vb + ' frame', wrong.length + ' other');
}

console.log('\n--- 3. and it stays true after a zoom, which is what resizes every symbol ---');
{
	// symbolFactor() is 1/state.s at heart, so a zoom is the one thing that rewrites every box on
	// the map. A fix that held only at the scale the document opened at would pass section 2.
	L.setScale(6478.75);        // the shipped Net3 lat/lon example's own opening scale
	L.resizeAllSymbols();
	const svgs = nestedSvgs(L.worldLayer());
	let bad = 0;
	svgs.forEach(function (s) {
		['x', 'y', 'width', 'height'].forEach(function (a) {
			const n = parseFloat(s.getAttribute(a));
			if (isFinite(n) && n !== Math.round(n)) { bad++; }
		});
	});
	check(bad === 0, 'at 6,478 px per degree, still nothing fractional on a nested <svg>', String(bad));

	const j = L.nodeEl('J1');
	const jx = parseFloat(j.circle.getAttribute('cx')), jy = parseFloat(j.circle.getAttribute('cy'));
	['TK1', 'R1'].forEach(function (id) {
		const box = readBox(L.nodeEl(id).symbolG);
		check(samePlace(box.cx, jx) && samePlace(box.cy, jy),
			id + ' is still centred on the node after the zoom', box.cx + ', ' + box.cy);
	});
}

console.log('\n' + (checks - failures) + '/' + checks + ' checks passed.');
process.exit(failures ? 1 : 0);
