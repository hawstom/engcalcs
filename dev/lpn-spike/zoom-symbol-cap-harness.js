// THE MAXIMUM MAP SIZE OF A SYMBOL (ROADMAP Task 705). Run with:
//   node dev/lpn-spike/zoom-symbol-cap-harness.js
//
// Tom, 2026-09-21: *"a symbol may not grow past a size the network itself sets."* A symbol is drawn
// in SCREEN pixels, so its size on the GROUND grows without bound as the view widens.
//
// **ONE RULE, NOT TWO, SINCE 2026-09-22.** The first cut of this feature tried the labeling
// threshold first and fell back to the 10th-percentile link length only when no threshold was
// typed. Tom: *"10th %-ile and 'same as label limit' were competing ideas for this limit; I'd
// prefer not to have two rules. I like 10th %-ile a lot, probably better than piggybacking on the
// labels limit. Let's try a new setting for %-ile: 'Prevent nodes from scaling larger than __
// times the length of the __ percentile pipe' where we set the defaults at 0.5 and 20% for now."*
// The labeling threshold (`settings.labelMaxWidth`) no longer feeds the cap at all.
//
// What each section below holds:
//
//   1. With the default settings (multiple 0.5, percentile 20), a junction stops growing on the
//      ground once its diameter is 0.5 times the network's 20th-percentile link length. Checked
//      against a length list worked out by hand in this file.
//   2. Reservoirs and tanks are the declared exceptions: screen-constant at every zoom.
//   3. `settings.symbolCapMultiple` and `settings.symbolCapPercentile` move the cap directly, and
//      `settings.labelMaxWidth` (typed or not) has NO effect on it at all -- the removed piggyback.
//      Out-of-range values fall back to the defaults rather than producing a broken cap.
//   3b. The labeling threshold ITSELF is still reinterpreted, not converted, on a unit change --
//      unrelated to the symbol cap now, but still a real rule worth holding.
//   4. A geographic project, where a world unit is a degree: the cap needs no metres conversion at
//      all any more, because it never compares against a view width in a display unit.
//   5. The service line: 1 px until the drawing stops growing, then below a pixel (R-051 (2)).
//   6. A Text object's "Show at all zoom levels": ticked by default, and unticked it goes with the
//      labels.
//   6b. A resize alone still re-decides the labeling threshold (labels only -- the symbol cap does
//      not depend on the window at all any more).
//   7. The Settings row -- the label-threshold box, and the two new number boxes for the multiple
//      and the percentile -- through the real controls.
//   8. Invalidation: a new link, a new document, and NO recompute on the zoom path or on a resize
//      (the cap is now purely a function of link lengths, never of the window or the view).
//   9. Pipes shrink past the cap too, since 2026-09-22: *"Yes. Everything shrinks except
//      reservoirs and tanks."* Only reservoirs and tanks are exempt; a pipe is not.
//
// **AND THEN IT MUTATES THE PAGE AND REQUIRES ITSELF TO FAIL.** Each mutation below takes one piece
// of the rule out of the real source; the suite is re-run against it and must report at least one
// failure. A harness that passes against a broken page is asserting a property the page merely
// happens to have.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const stub = require('./lpn-dom-stub.js');

global.fetch = () => Promise.reject(new Error('no network in this harness'));
global.EngCalcs.setIconLabel = () => {};
global.window.history = { replaceState: () => {} };
global.requestAnimationFrame = global.window.requestAnimationFrame = () => 0;

// A LANDSCAPE window whose width can be changed, which sections 6b and 8 need for the resize.
let W = 1200, H = 600;
const canvas = stub.byId.lpn_canvas;
Object.defineProperty(canvas, 'clientWidth', { get() { return W; } });
Object.defineProperty(canvas, 'clientHeight', { get() { return H; } });
canvas.getBoundingClientRect = function () {
	return { left: 0, top: 0, right: W, bottom: H, width: W, height: H };
};

const INJECT =
	"\t\tapplySaved: applySaved, applyView: applyView, buildDom: buildDom,\n" +
	"\t\tisLatLonProject: isLatLonProject, docOrigin: docOrigin,\n" +
	"\t\tvisibleMapWidth: visibleMapWidth, visibleMapMetres: visibleMapMetres,\n" +
	"\t\tsymbolCapScale: symbolCapScale, symbolFactor: symbolFactor,\n" +
	"\t\tsymbolCapMultiple: symbolCapMultiple, symbolCapPercentile: symbolCapPercentile,\n" +
	"\t\tinvalidateSymbolCap: invalidateSymbolCap, invalidateLinkLengths: invalidateLinkLengths,\n" +
	"\t\tlinkStrokeWidth: linkStrokeWidth,\n" +
	"\t\tnodeRadius: nodeRadius, nodeSymbolSize: nodeSymbolSize,\n" +
	"\t\tserviceStrokeWorld: serviceStrokeWorld, meterHalfWorld: meterHalfWorld,\n" +
	"\t\tlabelsPastThreshold: labelsPastThreshold, labelWidthLimitSI: labelWidthLimitSI,\n" +
	"\t\tcaptureViewWidth: captureViewWidth, applyLabelVisibility: applyLabelVisibility,\n" +
	"\t\trefreshSymbolSizes: refreshSymbolSizes, onZoomChanged: onZoomChanged,\n" +
	"\t\tapplyOneUnit: applyOneUnit, afterUnitChange: afterUnitChange,\n" +
	"\t\tapplyMapHeight: applyMapHeight, fitItems: fitItems, labelThresholdChanged: labelThresholdChanged,\n" +
	"\t\trebuildSettings: function () { rebuildSettingsBox(); },\n" +
	"\t\tdataLabelsHidden: function () { return dataLabelsHidden; },\n" +
	"\t\tlabelEls: function () { return labelEls; },\n" +
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\tgetState: function () { return state; },\n" +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); linkSymbolLayer = el('g', {}, world);\n" +
	"\t\t\tnodesLayer = el('g', {}, world); labelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n";

// A COUNTER, added by the harness and never shipped: how many times the cap is actually derived.
// Section 8 needs it to say the zoom path costs nothing. It is a test instrument, so it rides the
// same `mutate` door the mutations do rather than living in the page.
const COUNT_SITE = '\tfunction computeSymbolCapScale() {\n';
function instrument(src) {
	if (src.indexOf(COUNT_SITE) < 0) { throw new Error('count site not found'); }
	return src.replace(COUNT_SITE, COUNT_SITE + '\t\tglobal.__capComputes = (global.__capComputes || 0) + 1;\n');
}

function fire(el, type) { (el._listeners[type] || []).forEach(function (f) { f({ preventDefault() {} }); }); }
function ceil3(v) {
	const mag = Math.pow(10, 3 - 1 - Math.floor(Math.log(v) / Math.LN10));
	return Math.ceil(v * mag) / mag;
}
// ---- THE FIXTURE -------------------------------------------------------------------------------
// A straight chain of junctions whose 21 pipes are 5, 10, 15, ... 105 ft, plus a reservoir and a
// tank on 200 ft and 300 ft pipes. 23 lengths, already sorted ascending by construction.
// 20th percentile: element floor(0.2 x 22) = 4 of the sorted list (0-indexed), which is 25 ft.
// 50th percentile: element floor(0.5 x 22) = 11, which is 60 ft. Both worked out here, by hand.
const P20_BY_HAND = 25, P50_BY_HAND = 60;
function chainDoc(extraSettings) {
	const nodes = [], links = [];
	let x = 0;
	nodes.push({ id: 'J0', type: 'junction', x: 0, y: 0, elev: 0, _demand: 0 });
	for (let i = 1; i <= 21; i++) {
		x += 5 * i;
		nodes.push({ id: 'J' + i, type: 'junction', x: x, y: 0, elev: 0, _demand: 0 });
		links.push({ id: 'P' + i, type: 'pipe', from: 'J' + (i - 1), to: 'J' + i, verts: [], _length: 5 * i, _diameter: 8, _roughness: 130, _status: 'open', _k: 0 });
	}
	nodes.push({ id: 'R1', type: 'reservoir', x: 0, y: 200, head: 100 });
	links.push({ id: 'PR', type: 'pipe', from: 'R1', to: 'J0', verts: [], _length: 200, _diameter: 8, _roughness: 130, _status: 'open', _k: 0 });
	nodes.push({ id: 'T1', type: 'tank', x: x, y: 300, elev: 50, init: 10, min: 0, max: 20, diam: 50 });
	links.push({ id: 'PT', type: 'pipe', from: 'T1', to: 'J21', verts: [], _length: 300, _diameter: 8, _roughness: 130, _status: 'open', _k: 0 });
	return {
		version: 10, project: { coords: 'xy', units: { lpn_u_length: 'ft' } },
		nodes: nodes, links: links,
		labels: [
			{ id: 'X1', text: 'Kept note', x: 50, y: 50, anchorNode: null, sizeMult: 1 },
			{ id: 'X2', text: 'Fading note', x: 80, y: 50, anchorNode: null, sizeMult: 1, allZoom: false }
		],
		settings: Object.assign({}, extraSettings || {}), view: null
	};
}

function near(a, b, rel) { return Math.abs(a - b) <= (rel || 1e-9) * Math.max(1, Math.abs(a), Math.abs(b)); }

// ================================================================================================
// THE SUITE. Returns its failure count; `quiet` is for the mutation runs.
// ================================================================================================
function suite(mutate, quiet) {
	let failures = 0;
	function check(ok, label, detail) {
		if (!ok) { failures++; }
		if (!quiet) { console.log((ok ? '  ok   ' : '  FAIL ') + label + (detail ? '   ' + detail : '')); }
	}
	function head(t) { if (!quiet) { console.log(t); } }

	W = 1200; H = 600;
	stub.setUnitSet('us');
	global.__capComputes = 0;
	const L = stub.loadLoopedNetwork(INJECT, null, function (src) {
		return instrument(mutate ? mutate(src) : src);
	});
	L.buildLayers();
	const st = () => L.getSettings();
	const setS = (s) => { L.getState().s = s; };

	// ============================================================================================
	head('--- 1. the default cap: 0.5 times the network\'s own 20th-percentile link length ---');
	L.applySaved(chainDoc());
	check(st().symbolCapMultiple === 0.5 && st().symbolCapPercentile === 20,
		'1.0 a project that never set the rule carries the defaults (0.5, 20)',
		st().symbolCapMultiple + ', ' + st().symbolCapPercentile);
	const capLen = 0.5 * P20_BY_HAND;
	const cap = L.symbolCapScale();
	check(near(cap, st().symbolSize / capLen),
		'1.1 the cap is the scale where a junction is 0.5 x the 20th-percentile link across',
		cap.toFixed(6) + ' px/ft against ' + (st().symbolSize / capLen).toFixed(6) + ' by hand');
	const J = L.getDoc().nodes[5];
	const screenPx = [cap * 50, cap * 4, cap * 1.0001].map(function (s) { setS(s); return 2 * L.nodeRadius(J) * s; });
	check(screenPx.every(function (p) { return near(p, st().symbolSize); }),
		'1.2 closer in than the cap, a junction is its full screen size',
		screenPx.map(function (p) { return p.toFixed(3); }).join(', ') + ' px');
	const ground = [cap * 0.999, cap * 0.5, cap * 0.01, cap * 1e-6].map(function (s) { setS(s); return 2 * L.nodeRadius(J); });
	check(ground.every(function (g) { return near(g, capLen); }),
		'1.3 further out, its diameter ON THE GROUND stops growing at 0.5 x the 20th-percentile length',
		ground.map(function (g) { return g.toFixed(4); }).join(', ') + ' ft');
	setS(cap * 0.01);
	check(2 * L.nodeRadius(J) * cap * 0.01 < st().symbolSize / 50,
		'1.4 ...so on the SCREEN it shrinks with the zoom', (2 * L.nodeRadius(J) * cap * 0.01).toFixed(4) + ' px');
	// Every capped symbol goes through the one door -- a customer meter is the other kind drawn.
	const m1 = (setS(cap * 0.5), L.meterHalfWorld()), m2 = (setS(cap * 0.05), L.meterHalfWorld());
	check(near(m1, m2), '1.5 a customer meter goes through the same door and stops with it',
		m1.toFixed(4) + ' and ' + m2.toFixed(4) + ' ft');

	// ============================================================================================
	head('--- 2. reservoirs and tanks are the declared exceptions ---');
	const R = L.getDoc().nodes.filter(function (n) { return n.type === 'reservoir'; })[0];
	const T = L.getDoc().nodes.filter(function (n) { return n.type === 'tank'; })[0];
	const scales = [cap * 50, cap, cap * 0.1, cap * 1e-4];
	const rPx = scales.map(function (s) { setS(s); return L.nodeRadius(R) * s; });
	const tPx = scales.map(function (s) { setS(s); return L.nodeSymbolSize(T).w * s; });
	check(rPx.every(function (p) { return near(p, rPx[0]); }),
		'2.1 a reservoir keeps its SCREEN size at every zoom', rPx.map(function (p) { return p.toFixed(3); }).join(', '));
	check(tPx.every(function (p) { return near(p, tPx[0]); }),
		'2.2 a tank keeps its SCREEN size at every zoom', tPx.map(function (p) { return p.toFixed(3); }).join(', '));

	// ============================================================================================
	head('--- 3. the multiple and percentile move the cap directly; the labeling threshold does not ---');
	L.applySaved(chainDoc());
	const capDefault = L.symbolCapScale();
	st().labelMaxWidth = 900;
	L.labelThresholdChanged();
	L.invalidateSymbolCap();   // force a recompute even though a real settings row also would not
	check(near(L.symbolCapScale(), capDefault),
		'3.1 typing a labeling threshold does NOT move the cap (the removed piggyback)',
		L.symbolCapScale().toFixed(6) + ' against ' + capDefault.toFixed(6));
	st().labelMaxWidth = null;
	st().symbolCapMultiple = 2;
	L.invalidateSymbolCap();
	check(near(L.symbolCapScale(), st().symbolSize / (2 * P20_BY_HAND)),
		'3.2 doubling the multiple halves the cap scale', L.symbolCapScale().toFixed(6));
	st().symbolCapPercentile = 50;
	L.invalidateLinkLengths();
	check(near(L.symbolCapScale(), st().symbolSize / (2 * P50_BY_HAND)),
		'3.3 moving to the 50th percentile reads the LONGER pipe', L.symbolCapScale().toFixed(6));
	st().symbolCapMultiple = -5;
	check(L.symbolCapMultiple() === 0.5, '3.4 an invalid (non-positive) multiple falls back to 0.5',
		String(L.symbolCapMultiple()));
	st().symbolCapPercentile = 150;
	check(L.symbolCapPercentile() === 20, '3.5 an out-of-range (>100) percentile falls back to 20',
		String(L.symbolCapPercentile()));
	st().symbolCapMultiple = 0.5; st().symbolCapPercentile = 20;
	L.invalidateSymbolCap();

	// ============================================================================================
	head('--- 3b. the labeling threshold itself: still reinterpreted, not converted, on a unit change ---');
	head('       (unrelated to the symbol cap now, but still a real rule worth holding) ---');
	L.applySaved(chainDoc({ labelMaxWidth: 900 }));
	L.applyOneUnit('lpn_u_length', 'm');
	try { L.afterUnitChange(); } catch (e) { /* the stub cannot rebuild every panel; the settings are what is asserted */ }
	check(st().labelMaxWidth === 900, '3b.1 changing the unit to metres leaves the typed 900 as typed',
		String(st().labelMaxWidth));
	check(near(L.labelWidthLimitSI(), 900), '3b.2 ...and it now MEANS 900 m', L.labelWidthLimitSI().toFixed(3) + ' m');
	L.applyOneUnit('lpn_u_length', 'ft');

	// ============================================================================================
	head('--- 4. a geographic project: the cap reads WORLD-UNIT (degree) lengths directly, no metres ---');
	{
		const LAT = 38.1, LON = -122.56;
		L.applySaved({
			version: 10, project: { coords: 'geo', units: { lpn_u_length: 'ft' } },
			nodes: [{ id: 'A', type: 'junction', x: LON, y: LAT, elev: 0 },
				{ id: 'B', type: 'junction', x: LON + 0.01, y: LAT, elev: 0 }],
			links: [{ id: 'P', type: 'pipe', from: 'A', to: 'B', verts: [] }], labels: [], view: null
		});
		const capG = L.symbolCapScale();
		check(near(capG, st().symbolSize / (0.5 * 0.01), 1e-6),
			'4.1 the cap is symbolSize / (multiple x percentile length), in degrees -- no metres conversion',
			capG.toFixed(1) + ' px/deg against ' + (st().symbolSize / (0.5 * 0.01)).toFixed(1));
	}

	// ============================================================================================
	head('--- 5. the service line: 1 px until the drawing stops growing, then below a pixel ---');
	L.applySaved(chainDoc());
	st().linkWidth = 2;
	const capS = L.symbolCapScale();
	const svcIn = [capS * 40, capS * 1.0001].map(function (s) { setS(s); return L.serviceStrokeWorld(0, 0) * s; });
	check(svcIn.every(function (p) { return near(p, 1); }), '5.1 closer in than the cap it is his 1 px floor',
		svcIn.map(function (p) { return p.toFixed(4); }).join(', ') + ' px');
	setS(capS * 0.25);
	const svcOut = L.serviceStrokeWorld(0, 0) * capS * 0.25;
	check(svcOut < 0.5 && svcOut > 0, '5.2 further out it goes below a pixel, held on the ground',
		svcOut.toFixed(4) + ' px at a quarter of the cap scale');

	// ============================================================================================
	head('--- 6. a Text object\'s "Show at all zoom levels" ---');
	L.applySaved(chainDoc({ labelMaxWidth: 900 }));
	setS(1200 / 899);
	L.buildDom();
	L.applyLabelVisibility();
	const els = L.labelEls();
	const hid = function (id) { return !!(els[id] && els[id].text.classList.contains('lpn-lbl-hidden')); };
	check(els.X1 && els.X2 && !hid('X1') && !hid('X2'), '6.1 inside the threshold both notes show');
	setS(1200 / 2000);
	L.applyLabelVisibility();
	check(L.dataLabelsHidden(), '6.2 past it the generated labels go');
	check(!hid('X1'), '6.3 ...a note left at its default (ticked) stays');
	check(hid('X2'), '6.4 ...and a note with the box UNticked goes with the labels');

	// ============================================================================================
	head('--- 6b. a resize alone still re-decides the labeling threshold (labels only, not the cap) ---');
	global.document.readyState = 'complete';
	L.applySaved(chainDoc({ labelMaxWidth: 900 }));
	W = 1200; L.applyMapHeight();
	setS(1200 / 850);
	L.applyLabelVisibility();
	check(!L.dataLabelsHidden(), '6b.1 at 1200 px wide, an 850 ft view keeps its labels');
	W = 1800; L.applyMapHeight();
	check(L.dataLabelsHidden(),
		'6b.2 widening the window to 1800 px pushes the SAME scale past 900 ft, and a resize alone hides them');
	W = 1200; L.applyMapHeight();

	// ============================================================================================
	head('--- 7. the Settings row, through the real controls ---');
	L.applySaved(chainDoc());
	setS(1200 / 600);
	L.buildDom();
	L.rebuildSettings();
	const all = [];
	(function walk(e) {
		if (!e) { return; }
		all.push(e);
		(e.children || []).forEach(walk);
	})(global.document.getElementById('lpn_set_map_fields'));
	const byId = function (id) { return all.filter(function (e) { return e.id === id; })[0]; };
	const box = byId('lpn_set_label_max_width');
	check(!!box, '7.1 the labeling threshold row is on the Settings box');
	if (box) {
		const btn = box.parentNode && (box.parentNode.children || [])
			.filter(function (c) { return c.tagName && String(c.tagName).toLowerCase() === 'button'; })[0];
		check(box.value === '' && /Always/i.test(box.placeholder || ''), '7.2 blank, and the placeholder says what blank means',
			JSON.stringify(box.placeholder));
		box.value = '500'; fire(box, 'change');
		check(st().labelMaxWidth === 500, '7.3 a typed 500 is stored as typed', String(st().labelMaxWidth));
		check(L.dataLabelsHidden() === true, '7.4 ...and a 600 ft view is now past it, so the labels went');
		check(!!btn, '7.5 the Use current view button sits beside the box');
		if (btn) {
			fire(btn, 'click');
			check(st().labelMaxWidth === ceil3(L.visibleMapMetres() / 0.3048),
				'7.6 the button writes the view width in feet, rounded UP', String(st().labelMaxWidth));
			check(L.dataLabelsHidden() === false, '7.7 ...and the view it captured is labelled again');
		}
		box.value = ''; fire(box, 'change');
		check(st().labelMaxWidth === null, '7.8 clearing the box stores no threshold', String(st().labelMaxWidth));
	}
	const multBox = byId('lpn_set_symbol_cap_mult'), pctBox = byId('lpn_set_symbol_cap_pct');
	check(!!multBox && !!pctBox, '7.9 the multiple and percentile boxes are on the Settings box');
	if (multBox && pctBox) {
		check(multBox.value === '0.5' && pctBox.value === '20', '7.10 they start at his defaults',
			multBox.value + ', ' + pctBox.value);
		multBox.value = '1'; fire(multBox, 'change');
		check(st().symbolCapMultiple === 1, '7.11 the multiple box writes settings.symbolCapMultiple');
		check(near(L.symbolCapScale(), st().symbolSize / (1 * P20_BY_HAND)),
			'7.12 ...and the cap moved with it, without a reload', L.symbolCapScale().toFixed(6));
		pctBox.value = '50'; fire(pctBox, 'change');
		check(st().symbolCapPercentile === 50, '7.13 the percentile box writes settings.symbolCapPercentile');
		check(near(L.symbolCapScale(), st().symbolSize / (1 * P50_BY_HAND)),
			'7.14 ...and the cap moved to the 50th-percentile pipe', L.symbolCapScale().toFixed(6));
	}

	// ============================================================================================
	head('--- 8. invalidation: a new link, a new document, no move on a resize, none on the zoom path ---');
	L.applySaved(chainDoc());
	const c0 = L.symbolCapScale();
	// A 1 ft pipe is shorter than everything; 24 lengths, floor(0.2 x 23) = 4 is now 20 ft.
	const d = L.getDoc();
	d.nodes.push({ id: 'JX', type: 'junction', x: 0, y: 1, elev: 0 });
	d.links.push({ id: 'PX', type: 'pipe', from: 'J0', to: 'JX', verts: [] });
	check(near(L.symbolCapScale(), st().symbolSize / (0.5 * 20)), '8.1 a new pipe moves the cap without being told',
		c0.toFixed(4) + ' -> ' + L.symbolCapScale().toFixed(4));
	L.applySaved(chainDoc({ symbolCapMultiple: 1, symbolCapPercentile: 50 }));
	check(near(L.symbolCapScale(), st().symbolSize / (1 * P50_BY_HAND)),
		'8.2 opening another document does too, honoring ITS OWN stored multiple and percentile');
	// The cap is now purely a function of link lengths -- a resize must NOT move it (unlike the old
	// piggyback, which read the window every time through the labeling threshold).
	L.applySaved(chainDoc());
	const c1 = L.symbolCapScale();
	global.document.readyState = 'complete';
	W = 1200; L.applyMapHeight();
	W = 1800; L.applyMapHeight();
	check(near(L.symbolCapScale(), c1), '8.3 a resize does NOT move the cap any more',
		c1.toFixed(6) + ' against ' + L.symbolCapScale().toFixed(6));
	W = 1200; L.applyMapHeight();
	L.symbolCapScale();
	const before = global.__capComputes;
	for (let i = 0; i < 40; i++) { setS(L.getState().s * (i % 2 ? 1.1 : 1 / 1.1)); L.refreshSymbolSizes(); }
	check(global.__capComputes === before, '8.4 forty zoom steps derive the cap zero times',
		(global.__capComputes - before) + ' recomputes');

	// ============================================================================================
	head('--- 9. pipes shrink past the cap too (Tom, 2026-09-22: "Everything shrinks except reservoirs and tanks") ---');
	L.applySaved(chainDoc());
	st().linkWidth = 2;
	const cap9 = L.symbolCapScale();
	setS(cap9 * 50);
	check(near(L.linkStrokeWidth() * cap9 * 50, st().linkWidth), '9.1 inside the cap a pipe is its full screen width',
		(L.linkStrokeWidth() * cap9 * 50).toFixed(4) + ' px');
	const groundVals = [cap9 * 0.999, cap9 * 0.5, cap9 * 0.01].map(function (s) { setS(s); return L.linkStrokeWidth(); });
	check(groundVals.every(function (g) { return near(g, groundVals[0]); }),
		'9.2 past the cap a pipe\'s stroke stops growing ON THE GROUND',
		groundVals.map(function (g) { return g.toFixed(5); }).join(', ') + ' ft');
	setS(cap9 * 0.01);
	check(L.linkStrokeWidth() * cap9 * 0.01 < st().linkWidth / 10,
		'9.3 ...so ON THE SCREEN it shrinks with the zoom, exactly like a junction',
		(L.linkStrokeWidth() * cap9 * 0.01).toFixed(4) + ' px');

	return failures;
}

// ================================================================================================
const fails = suite(null, false);
console.log(fails ? '\n' + fails + ' FAILURE(S) against the real page' : '\nall checks passed against the real page');

// ---- THE MUTATIONS ----------------------------------------------------------------------------
// Each removes one piece of the rule. The suite must go red against every one of them.
function swap(a, b) {
	return function (src) {
		if (src.indexOf(a) < 0) { throw new Error('mutation site not found: ' + a.slice(0, 60)); }
		return src.replace(a, b);
	};
}
const MUTATIONS = [
	['no cap at all: symbolFactor() divides by the scale',
		swap('\t\treturn (settings.symbolSize / 2) / JUNCTION_R / symbolScaleAt();',
			'\t\treturn (settings.symbolSize / 2) / JUNCTION_R / (state.s || 1);')],
	['the reservoir and tank lose their exception',
		swap("if (n.type === 'reservoir' || n.type === 'tank') { return JUNCTION_UNIT_W * symbolFactorFull(); }",
			"if (n.type === 'reservoir' || n.type === 'tank') { return JUNCTION_UNIT_W * symbolFactor(); }")],
	['the tank\'s drawn box loses its exception',
		swap('\t\tvar k = symbolFactorFull();   // reservoir and tank only', '\t\tvar k = symbolFactor();   // reservoir and tank only')],
	['a Text object hides with the labels unless ticked (the default reversed)',
		swap('(past && lb.allZoom === false)', '(past && lb.allZoom !== true)')],
	['the wrong percentile used (always the 50th, ignoring the setting)',
		swap('\t\tpctLinkLengthCache = lens[Math.floor((pct / 100) * (lens.length - 1))];',
			'\t\tpctLinkLengthCache = lens[Math.floor(0.5 * (lens.length - 1))];')],
	['the threshold compared raw, not in metres (a converted-not-reinterpreted defect)',
		swap("\t\treturn toSI(v, 'lpn_u_length');\n\t}\n\tfunction customerLabelWidthLimitSI()",
			"\t\treturn v;\n\t}\n\tfunction customerLabelWidthLimitSI()")],
	['the piggyback comes back: the labeling threshold feeds the cap again',
		swap('\tfunction computeSymbolCapScale() {\n\t\tvar lp = pLinkLengthWorld(symbolCapPercentile()), capLen = symbolCapMultiple() * lp;\n\t\treturn (capLen > 0 && settings.symbolSize > 0) ? settings.symbolSize / capLen : 0;\n\t}',
			"\tfunction computeSymbolCapScale() {\n\t\tvar limSI = labelWidthLimitSI(), px = mapBox().w, v, mpu, wWorld;\n\t\tif (limSI > 0 && px > 0) {\n\t\t\tv = currentView();\n\t\t\tmpu = metresPerWorldUnit(v ? v.cx : 0, v ? v.cy : 0);\n\t\t\twWorld = (mpu > 0) ? limSI / mpu : 0;\n\t\t\tif (wWorld > 0 && isFinite(wWorld)) { return px / wWorld; }\n\t\t}\n\t\tvar lp = pLinkLengthWorld(symbolCapPercentile()), capLen = symbolCapMultiple() * lp;\n\t\treturn (capLen > 0 && settings.symbolSize > 0) ? settings.symbolSize / capLen : 0;\n\t}")],
	['the service line divides by the scale, never below a pixel',
		swap('Math.max(LPN_SERVICE_STROKE_FRAC * lw, LPN_SERVICE_MIN_PX)) / symbolScaleAt();',
			'Math.max(LPN_SERVICE_STROKE_FRAC * lw, LPN_SERVICE_MIN_PX)) / (state.s || 1);')],
	['an unticked Text object stays',
		swap('var gone = !isActive(lb) || (past && lb.allZoom === false);', 'var gone = !isActive(lb);')],
	['the multiple box does not invalidate the cap',
		swap('settings.symbolCapMultiple = v; invalidateSymbolCap(); refreshSymbolSizes(); saveToStorage();',
			'settings.symbolCapMultiple = v; refreshSymbolSizes(); saveToStorage();')],
	['the percentile box does not invalidate the link lengths',
		swap('settings.symbolCapPercentile = v; invalidateLinkLengths(); refreshSymbolSizes(); saveToStorage();',
			'settings.symbolCapPercentile = v; refreshSymbolSizes(); saveToStorage();')],
	['the link-length cache ignores a new link',
		swap('\t\tif (list !== p10LinkKeyArr || n !== p10LinkKeyLen) {', '\t\tif (list !== p10LinkKeyArr) {')],
	['a resize does not re-decide the labeling threshold',
		swap('if (widthMoved && labelWidthLimitSI() > 0) { labelThresholdChanged(); }', '')],
	['the cap is re-derived on every call (a per-frame cost on the zoom path)',
		swap('\t\tif (symbolCapCache === null) { symbolCapCache = computeSymbolCapScale(); }\n\t\treturn symbolCapCache;',
			'\t\tsymbolCapCache = computeSymbolCapScale();\n\t\treturn symbolCapCache;')],
	['pipes ignore the cap and keep growing on the ground',
		swap('\tfunction linkStrokeWidth() {\n\t\treturn settings.linkWidth / symbolScaleAt();\n\t}',
			'\tfunction linkStrokeWidth() {\n\t\treturn settings.linkWidth / (state.s || 1);\n\t}')]
];
let unkilled = 0;
console.log('\n--- mutations: every one must turn the suite red ---');
MUTATIONS.forEach(function (m) {
	let n;
	try { n = suite(m[1], true); } catch (e) { n = 'threw: ' + e.message.split('\n')[0]; }
	const killed = n !== 0;
	if (!killed) { unkilled++; }
	console.log((killed ? '  ok   killed   ' : '  FAIL SURVIVED ') + m[0] + '   (' + n + ')');
});

if (fails || unkilled) {
	console.log('\nZoom symbol cap harness: ' + fails + ' failure(s), ' + unkilled + ' surviving mutation(s).');
	process.exit(1);
}
console.log('\nZoom symbol cap harness complete: all checks passed and all ' + MUTATIONS.length + ' mutations killed.');
