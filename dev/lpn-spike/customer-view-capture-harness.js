// THE "USE CURRENT VIEW" BUTTON ON "WIDEST VIEW THAT ATTEMPTS TO DISPLAY CUSTOMER LABELS".
// Run with:  node dev/lpn-spike/customer-view-capture-harness.js
//
// Tom, 2026-09-21: *"'Use current view' button of 'Widest view that attempts to display customer
// labels' uses height (I think), not width. Then it's applied as advertised, to width. So it
// appears not to work."* He is right, and on BOTH halves of it.
//
// **THE BUTTON'S WHOLE PROMISE IS ONE SENTENCE: press it, and the view you are looking at is still
// labelled.** That is the invariant this harness holds, and it is the one the shipped code broke --
// not by drawing anything wrong, but by capturing a DIFFERENT QUANTITY from the one the gate then
// compares it against. Nothing renders incorrectly: the box fills with a plausible number, the
// setting takes, the labels simply go out at the moment the user asked to keep them.
//
//   - DIMENSION. customerLabelsAttempted() measures visibleMapMetres(), which is the WIDTH. The
//     capture read mapSpan('min') -- min(width, height) -- which on any landscape window is the
//     HEIGHT. A smaller number, written into a box compared against the width.
//   - UNIT. The gate converts the box to metres (customerLabelWidthLimitSI()) and compares metres.
//     mapSpan() returns WORLD units, which on a lat/lon project are DEGREES.
//
// The second half is invisible on a plain XY grid, where toDisplay(visibleMapMetres()) IS
// visibleMapWidth() exactly -- so a grid fixture alone would have measured the first defect and
// passed straight over the second. Both project kinds are therefore fixtures here.
//
// Section 4 holds the OTHER number in his message of the same day: the service line's floor, which
// is 1 px in his own words, at every zoom.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const stub = require('./lpn-dom-stub.js');
const Geom = global.EngCalcs.lpnGeom;

let failures = 0;
function check(ok, label, detail) {
	if (!ok) { failures++; }
	console.log((ok ? '  ok   ' : '  FAIL ') + label + (detail ? '   ' + detail : ''));
}

stub.setUnitSet('us');
global.fetch = () => Promise.reject(new Error('no network in this harness'));
global.EngCalcs.setIconLabel = () => {};
global.window.history = { replaceState: () => {} };
global.requestAnimationFrame = global.window.requestAnimationFrame = () => 0;

// **A LANDSCAPE WINDOW, AND THAT IS THE FIXTURE RATHER THAN A DETAIL.** min(w, h) and w are the
// same number on a square canvas, so a square fixture cannot see the dimension defect at all.
const W = 1200, H = 600;
const canvas = stub.byId.lpn_canvas;
Object.defineProperty(canvas, 'clientWidth', { get() { return W; } });
Object.defineProperty(canvas, 'clientHeight', { get() { return H; } });
canvas.getBoundingClientRect = function () {
	return { left: 0, top: 0, right: W, bottom: H, width: W, height: H };
};

const L = stub.loadLoopedNetwork(
	"\t\tapplySaved: applySaved, applyView: applyView, currentView: currentView,\n" +
	"\t\tisLatLonProject: isLatLonProject, docOrigin: docOrigin,\n" +
	"\t\tmapSpan: mapSpan, visibleMapWidth: visibleMapWidth,\n" +
	"\t\tvisibleMapHeight: visibleMapHeight, visibleMapMetres: visibleMapMetres,\n" +
	"\t\tcaptureCustomerViewWidth: captureViewWidth,\n" +
	"\t\tcustomerLabelsAttempted: customerLabelsAttempted,\n" +
	"\t\tserviceStrokeWorld: serviceStrokeWorld,\n" +
	"\t\trebuildSettings: function () { rebuildSettingsBox(); },\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\tgetState: function () { return state; },\n" +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
L.buildLayers();

// The capture as it stood before 2026-09-21, reproduced here so the two can be printed side by
// side. A harness that only asserts the new answer cannot say what was wrong with the old one.
function oldCapture() {
	const w = L.mapSpan('min');
	return w > 0 ? ceil3(w) : 0;
}
// The stub records listeners on an element rather than implementing dispatchEvent, which is what
// every other harness here drives a control through.
function fire(el, type) { (el._listeners[type] || []).forEach(function (f) { f({}); }); }
function ceil3(v) {
	if (!(v > 0) || !isFinite(v)) { return v; }
	const mag = Math.pow(10, 3 - 1 - Math.floor(Math.log(v) / Math.LN10));
	return Math.ceil(v * mag) / mag;
}
// THE BUTTON, minus its DOM: capture, store, and that is the whole press.
function press() {
	const w = L.captureCustomerViewWidth();
	if (!(w > 0)) { return 0; }
	L.labelSettings().customerMaxWidth = w;
	return w;
}

// ================================================================================================
// 1. AN XY GRID PROJECT IN FEET -- THE DIMENSION HALF
// ================================================================================================
console.log('--- 1. a landscape window on a grid project: which dimension was captured ---');
{
	L.applySaved({
		version: 10, project: { coords: 'xy', units: { lpn_u_length: 'ft' } },
		nodes: [{ id: 'A', type: 'junction', x: 0, y: 0, elev: 0 },
			{ id: 'B', type: 'junction', x: 1000, y: 0, elev: 0 }],
		links: [], view: null
	});
	L.getState().s = 0.6;
	const wWorld = L.visibleMapWidth(), hWorld = L.visibleMapHeight();
	const before = oldCapture(), after = L.captureCustomerViewWidth();
	console.log('       view width   ' + wWorld.toFixed(3) + ' ft');
	console.log('       view height  ' + hWorld.toFixed(3) + ' ft');
	console.log('       captured BEFORE (mapSpan min)  ' + before);
	console.log('       captured AFTER  (the gate\'s own width)  ' + after);

	check(hWorld < wWorld, '1.1 the fixture window really is wider than it is tall',
		wWorld.toFixed(1) + ' by ' + hWorld.toFixed(1));
	check(Math.abs(before - ceil3(hWorld)) < 1e-9,
		'1.2 the old capture was the HEIGHT, which is what he suspected', String(before));
	check(after >= wWorld && Math.abs(after - ceil3(wWorld)) < 1e-9,
		'1.3 the new capture is the WIDTH, rounded UP', String(after));
	check(before < after, '1.4 ...and the old number was the smaller of the two',
		before + ' against ' + after);

	// **THE PROMISE ITSELF.** Everything above is arithmetic; this is the thing a user would say.
	L.labelSettings().customerMaxWidth = before;
	check(L.customerLabelsAttempted() === false,
		'1.5 pressing the OLD button turned the labels OFF at the very view it captured');
	press();
	check(L.customerLabelsAttempted() === true,
		'1.6 pressing the NEW button leaves this view labelled, which is the whole promise');

	// A threshold that says yes to everything is not a threshold. Zoom out past the capture.
	const kept = L.labelSettings().customerMaxWidth;
	L.getState().s = 0.6 / 1.5;
	check(L.customerLabelsAttempted() === false,
		'1.7 ...and zooming out past the captured view still turns them off',
		L.visibleMapWidth().toFixed(1) + ' ft against a threshold of ' + kept);
	L.getState().s = 0.6;
}

// ================================================================================================
// 2. THE SAME PROJECT IN METRES -- ROUND TRIP THROUGH THE BOX'S OWN UNIT
// ================================================================================================
console.log('--- 2. the number written in the box is in the box\'s own length unit ---');
{
	stub.setUnitSet('si');
	L.applySaved({
		version: 10, project: { coords: 'xy', units: { lpn_u_length: 'm' } },
		nodes: [{ id: 'A', type: 'junction', x: 0, y: 0, elev: 0 }],
		links: [], view: null
	});
	L.getState().s = 0.6;
	const after = press();
	check(after > 0 && L.customerLabelsAttempted() === true,
		'2.1 a metric project captures its own view and keeps it labelled', String(after));
	check(Math.abs(after - ceil3(L.visibleMapWidth())) < 1e-9,
		'2.2 ...and the number is the view width in metres, not a converted twin', String(after));
	stub.setUnitSet('us');
}

// ================================================================================================
// 3. A GEOGRAPHIC PROJECT -- THE UNIT HALF, WHICH A GRID FIXTURE CANNOT SEE
// ================================================================================================
console.log('--- 3. a geographic project: world units are DEGREES and the gate reads METRES ---');
{
	const LAT = 38.1, LON = -122.56;
	L.applySaved({
		version: 10, project: { coords: 'geo', units: { lpn_u_length: 'ft' } },
		nodes: [{ id: 'A', type: 'junction', x: LON, y: LAT, elev: 0 },
			{ id: 'B', type: 'junction', x: LON + 0.01, y: LAT, elev: 0 }],
		links: [], view: null
	});
	check(L.isLatLonProject(), '3.1 the fixture installed as geographic');
	const org = L.docOrigin();
	// About a hundredth of a degree across the window: a plausible working zoom on a street.
	const s = W / 0.01;
	L.applyView({ cx: LON - org.x, cy: -(Geom.mercY(LAT) - org.y), s: s });
	const before = oldCapture(), after = L.captureCustomerViewWidth();
	console.log('       view width   ' + L.visibleMapWidth().toExponential(4) + ' degrees');
	console.log('       captured BEFORE  ' + before + '  (degrees, into a box read as feet)');
	console.log('       captured AFTER   ' + after + '  (feet, which is what the box says)');
	check(after / Math.max(before, 1e-12) > 1e4,
		'3.2 the old capture was out by four orders of magnitude, not by a rounding',
		(after / before).toExponential(2) + 'x');
	L.labelSettings().customerMaxWidth = before;
	check(L.customerLabelsAttempted() === false,
		'3.3 so the old press turned every customer label off on a geographic project');
	press();
	check(L.customerLabelsAttempted() === true,
		'3.4 the new press keeps this street labelled', String(L.labelSettings().customerMaxWidth));
}

// ================================================================================================
// 4. THE SERVICE LINE'S FLOOR IS 1 PIXEL, AT EVERY ZOOM
// ================================================================================================
//
// Tom, same message: *"The service line is fixed map width. It should be a lesser multiple of the
// link width or always just 1 px..."* A stroke in WORLD units renders at `world x scale` pixels, so
// "screen-constant" is the claim to test and the only way to test it is to vary the scale.
console.log('--- 4. the service line is screen-constant, and always lighter than its own main ---');
{
	const st = L.getSettings();
	// **EVERY LINK WIDTH THAT IS REACHABLE, NOT THE COMFORTABLE ONES.** 1 is what the Settings box
	// declares as its minimum, and 0.5 is what a stored project or an older file can still carry.
	// The first version of this section PRINTED `link width 0.2 -> service 1.000` and asserted the
	// "lesser multiple" claim against 4 alone, so its own output showed the defect and walked past
	// it. The sweep and the assertion now cover the same list.
	const widths = [0.5, 1, 2, 4, 12];
	// Both ends of anything a wheel can reach, because "screen-constant" is a claim about scale.
	const scales = [1e-6, 0.05, 1, 7.5, 300, 1e8];
	let worstDrift = 0, thinnest = Infinity, worstRatio = 0;
	widths.forEach(function (lw) {
		st.linkWidth = lw;
		const px = scales.map(function (s) {
			L.getState().s = s;
			return L.serviceStrokeWorld(0, 0) * s;
		});
		px.forEach(function (p) {
			worstDrift = Math.max(worstDrift, Math.abs(p - px[0]));
			thinnest = Math.min(thinnest, p);
		});
		worstRatio = Math.max(worstRatio, px[0] / lw);
		console.log('       link width ' + lw + ' px  ->  service ' + px[0].toFixed(3) +
			' px at every zoom  (' + (100 * px[0] / lw).toFixed(0) + '% of the main)');
	});
	check(worstDrift < 1e-9, '4.1 the service stroke is the same on SCREEN at every zoom',
		worstDrift.toExponential(2) + ' px of drift, from 1e-6 to 1e8');
	// **THE ASSERTION THAT WAS MISSING**, and it is the one his sentence actually makes. A floor
	// alone overtakes the pipe below 2 px: at a 1 px main a 1 px floor draws the service exactly as
	// heavy as the main, and below that heavier, so the connector reads as the more important line.
	check(worstRatio < 1 - 1e-9,
		'4.2 the service is a LESSER multiple of the main at EVERY reachable link width',
		'worst ' + (100 * worstRatio).toFixed(0) + '% of the main');
	// The pixel floor still governs wherever the main is thick enough to allow it -- which is every
	// width from 2 px up, the whole of the range the Settings spinner walks through.
	st.linkWidth = 2;
	L.getState().s = 1;
	check(Math.abs(L.serviceStrokeWorld(0, 0) - 1) < 1e-9,
		'4.3 ...and his 1 px floor still governs wherever the main can afford it',
		L.serviceStrokeWorld(0, 0).toFixed(3) + ' px at a 2 px main');
	check(thinnest > 0, '4.4 ...and it is never drawn away to nothing', thinnest.toFixed(3) + ' px');
	st.linkWidth = 4;
	L.getState().s = 1;
}

// ================================================================================================
// 5. THE SETTINGS BOX REFUSES A LINK WIDTH ITS OWN MARKUP FORBIDS
// ================================================================================================
//
// `min="1"` is advice to a spinner and nothing at all to a typed entry. The handler checked `> 0`,
// so 0.5 went in through the ordinary dialog -- which is the only door by which section 4's
// sub-1 widths are reachable at all. Driven through the REAL control, because the defect is the
// disagreement between the markup and the handler and neither half carries both facts.
console.log('--- 5. the link width box honours the minimum it declares ---');
{
	const st = L.getSettings();
	st.linkWidth = 3;
	L.rebuildSettings();
	const els = [];
	(function walk(e) {
		if (!e) { return; }
		els.push(e);
		(e.children || []).forEach(walk);
	})(document.getElementById('lpn_set_map_fields'));
	const lw = els.filter(function (e) {
		return String(e.nodeName || '').toLowerCase() === 'input' && e.type === 'number' &&
			e.min === '1' && e.step === '1' && String(e.value) === '3';
	})[0];
	check(!!lw, '5.1 the link width box is on the Settings dialog and declares min 1');
	if (lw) {
		lw.value = '0.5';
		fire(lw, 'change');
		check(st.linkWidth === 3, '5.2 a typed 0.5 is REFUSED rather than taken',
			String(st.linkWidth));
		check(String(lw.value) === '3',
			'5.3 ...and the box is put back to the value the document holds', String(lw.value));
		lw.value = '5';
		fire(lw, 'change');
		check(st.linkWidth === 5, '5.4 a legal entry still takes', String(st.linkWidth));
	}
	st.linkWidth = 4;
}

console.log(failures === 0
	? 'Customer view-capture harness complete: all checks passed.'
	: 'Customer view-capture harness: ' + failures + ' FAILED.');
process.exit(failures === 0 ? 0 : 1);
