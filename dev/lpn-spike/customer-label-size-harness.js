// A CUSTOMER LABEL IS THE SAME SIZE AS A NODE LABEL AND A LINK LABEL -- ROADMAP Task 247.
// Run with:  node dev/lpn-spike/customer-label-size-harness.js
//
// **THIS EXISTS BECAUSE A PASS CLOSED THE DEFECT BY REASONING AND THE REASONING WAS WRONG.** Tom
// reported customer labels "a vastly different size than other labels" and was told there was no
// separate text size and that the STACKING made them look taller. There is no separate text size
// -- that part was true -- and his next screenshot showed them plainly LARGER, not merely taller.
//
// The cause is the ZOOM PATH, and it is one missing line rather than a size of its own. Every
// label's font-size is `settings.textSize / state.s` (effectiveFontSize()), written onto the
// element as an inline pixel size; so every zoom invalidates every one of them. Two functions
// re-write them and they cover different sets:
//
//   * refreshLabelTextPass() -- the CONTENT pass, run on a solve, a toggle or an edit -- writes
//     node, link AND customer.
//   * refreshFontSizes() -- the ZOOM path, run on every wheel notch and every zoom-to-extent, and
//     deliberately NOT a content pass -- wrote node, link and the user's own Text labels, and
//     **never custLblEls**.
//
// So from the first zoom until the next content pass, a customer label carries the font size of
// whatever scale it was last composed at while everything around it follows the view. Zoom in 4x
// and it is four times the height of the junction label beside it. Nothing warns anybody: the
// drawing is correct, the text is right, and only the size is stale.
//
// Section 1 is the MEASUREMENT Tom asked for -- three numbers, printed, at one zoom. Section 2 is
// the regression: the three must stay equal across a sweep of zooms through the zoom path alone.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\taddCustomer: addCustomer, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\trefreshLabelText: refreshLabelText, refreshFontSizes: refreshFontSizes,\n" +
	"\t\tsetZoom: function (s) { state.s = s; },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\ttextSize: function () { return settings.textSize; },\n" +
	"\t\tnodeFont: function (id) { return nodeEls[id].text.style.fontSize; },\n" +
	"\t\tlinkFont: function (id) { return linkEls[id].text.style.fontSize; },\n" +
	"\t\tcustFont: function (id) { return custLblEls[id].text.style.fontSize; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name + (extra === undefined ? '' : '   ' + extra)); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function px(s) { return parseFloat(s); }

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
L.setCanvas(900, 600);

// A reservoir feeding a horizontal main with services hanging off it -- Tom's own screenshot.
const r = L.addNode('reservoir', 0, 0);
const j = L.addNode('junction', 800, 0);
const main = L.addLink('pipe', r.id, j.id);
const cust = [];
for (let i = 1; i <= 8; i++) { cust.push(L.addCustomer(i * 80, -60, { link: main.id })); }
L.refreshLabelText();

// ---- 1. THE THREE NUMBERS, AT ONE ZOOM, THROUGH THE ZOOM PATH ----------------------------------
console.log('--- the three rendered font sizes at 4x, after a zoom and nothing else ---');
L.setZoom(4);
L.refreshFontSizes();
const n1 = px(L.nodeFont(j.id)), l1 = px(L.linkFont(main.id)), c1 = px(L.custFont(cust[0].id));
console.log('       node label   ' + n1 + ' px');
console.log('       link label   ' + l1 + ' px');
console.log('       customer     ' + c1 + ' px');
ok('1.1 a customer label is the size of a node label', n1 === c1, 'node ' + n1 + ' vs customer ' + c1);
ok('1.2 a customer label is the size of a link label', l1 === c1, 'link ' + l1 + ' vs customer ' + c1);
ok('1.3 and all three are settings.textSize / scale', n1 === L.textSize() / 4);

// ---- 2. ACROSS THE WHOLE ZOOM RANGE, THE ZOOM PATH ALONE ---------------------------------------
//
// The zoom path on purpose: a content pass would repair the defect on its way past and the check
// would pass for the wrong reason, which is the stub trap dev/testing-notes.md names.
console.log('--- every scale, zoom path only, no content pass ---');
[0.05, 0.5, 1, 2, 7.5, 40, 300].forEach(function (s) {
	L.setZoom(s);
	L.refreshFontSizes();
	const n = px(L.nodeFont(j.id)), lk = px(L.linkFont(main.id));
	let bad = 0, worst = 0;
	cust.forEach(function (c) {
		const v = px(L.custFont(c.id));
		if (v !== n || v !== lk) { bad++; worst = Math.max(worst, Math.abs(v - n)); }
	});
	ok('2.x scale ' + s + ': all 8 customers match node and link', bad === 0,
		bad + ' differ, worst by ' + worst + ' px (node ' + n + ')');
});

console.log(fails ? ('FAILED: ' + fails) : 'All customer label size checks passed.');
process.exit(fails ? 1 : 0);
