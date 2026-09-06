// THE CROWDING CASCADE IS ARITHMETIC -- ROADMAP Task 436. Run with:
//   node dev/lpn-spike/shed-pricing-harness.js
//
// **WHAT THIS GUARDS, AND WHY IT IS THE LAST OF FOUR.** Three shed paths already batch or index:
// refreshLabelText's (Task 440), reshedLinkLabels' (Task 436's first half) and the obstacle walk
// (aligned-shed-index-harness.js). What was left was shedAlignedForConflicts()'s own `while` loop,
// which redrew and re-measured the label at EVERY rung. Measured in Chromium on a 736-element
// geographic grid: 1,391 getBBox calls in one wheel notch, 1,076-1,672 ms, 73-79% of the block, and
// a 1-in-7 stack sample put 198 of 198 samples in that loop.
//
// **THE FIX PRICES A KEEP-SET INSTEAD OF DRAWING IT.** noteRowWidths() banks a width per SEGMENT
// while it is already reading every tspan; shedWidthFor() adds the survivors up and multiplies by
// `k = box / sum`, the calibration that converts an ADVANCE-width sum into the INK box every other
// consumer of the label uses. The rung decisions then cost no layout at all, and the label is
// written and measured once, at the content it settles on.
//
// **THIS IS THE FIRST REFACTOR OF THIS PASS NOT HELD TO BYTE-IDENTICAL PLACEMENT, and that is a
// ruling rather than a slip.** Tom, 2026-09-06: *"Relax it."* getBBox is the ink box and
// getComputedTextLength is the advance width; they differ by the side bearings at the two ends
// (0.636% mean, 1.801% worst, measured), and shedding changes which glyph is last, so no arithmetic
// can be exact. Sections 2 and 3 therefore assert a BOUND and a DIRECTION rather than equality:
//   * the priced width is within a stated tolerance of what redrawing measures, and
//   * where the two disagree about a rung at all, it is countable and small.
//
// **AND THE FALLBACK IS THE OLD CODE, WHICH IS THE SAFETY PROPERTY.** shedWidthFor() returns null
// when it cannot price honestly -- no banked widths, a length mismatch, a zero sum -- and the
// original redraw loop then finishes the job unchanged. Section 4 asserts that path still works,
// because it is the one nobody exercises by accident and the one that makes a wrong width
// impossible rather than merely unlikely.

'use strict';

const { ROOT, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// ---- trace every DOM write and every layout read, as zoom-reshed-harness.js does ---------------
const trace = [];
let tracing = false;
const origCreate = global.document.createElementNS;
global.document.createElementNS = function (ns, tag) {
	const el = origCreate(ns, tag);
	const gb = el.getBBox, gc = el.getComputedTextLength, ac = el.appendChild, rc = el.removeChild;
	el.getBBox = function () { if (tracing) { trace.push('R'); } return gb.call(this); };
	el.getComputedTextLength = function () { if (tracing) { trace.push('R'); } return gc.call(this); };
	el.appendChild = function (c) { if (tracing) { trace.push('W'); } return ac.call(this, c); };
	el.removeChild = function (c) { if (tracing) { trace.push('W'); } return rc.call(this, c); };
	return el;
};
function forcedLayouts(fn) {
	trace.length = 0; tracing = true;
	fn();
	tracing = false;
	let n = 0;
	for (let i = 1; i < trace.length; i++) { if (trace[i] === 'R' && trace[i - 1] === 'W') { n++; } }
	return n;
}

setUnitSet('us');
const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, runSolve: runSolve,\n" +
	"\t\trefreshLabelText: refreshLabelText, relayoutLabels: relayoutLabels,\n" +
	"\t\treshed: reshedLinkLabels,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tlinkEls: function () { return linkEls; },\n" +
	"\t\tpriceKeep: shedWidthFor, keepSet: shedKeepSet, shedOrder: shedOrder,\n" +
	"\t\tboxWidth: labelBoxWidth,\n" +
	"\t\tfs: effectiveFontSize,\n" +
	"\t\tfsNow: function () { return effectiveFontSize() + 'px'; },\n" +
	"\t\trender: renderLinkLabel, measure: measureLabelWidths,\n" +
	"\t\tstate: function () { return state; },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }"
);
L.buildLayers();
L.setCanvas(1000, 700);
L.seedDefaultInputs();

const SP = 100;
const built = { ids: [] };
function linkBetween(a, b) {
	return L.getDoc().links.some(l => (l.from === a && l.to === b) || (l.from === b && l.to === a));
}
function growTo(n) {
	const doc = L.getDoc();
	for (let r = 0; r < n; r++) {
		if (!built.ids[r]) { built.ids[r] = []; }
		for (let c = 0; c < n; c++) {
			if (built.ids[r][c]) { continue; }
			const nd = L.addNode(r === 0 && c === 0 ? 'reservoir' : 'junction',
				c * SP + (c % 3) * 17, r * SP + (r % 4) * 11);
			if (nd.elev !== undefined) { nd.elev = 100 + ((r * 8 + c) % 7) * 3; }
			if (nd.demand !== undefined) { nd.demand = 10 + ((r * 3 + c * 5) % 11); }
			built.ids[r][c] = nd.id;
		}
	}
	for (let r = 0; r < n; r++) {
		for (let c = 0; c < n; c++) {
			if (c + 1 < n && !linkBetween(built.ids[r][c], built.ids[r][c + 1])) { L.addLink('pipe', built.ids[r][c], built.ids[r][c + 1]); }
			if (r + 1 < n && !linkBetween(built.ids[r][c], built.ids[r + 1][c])) { L.addLink('pipe', built.ids[r][c], built.ids[r + 1][c]); }
		}
	}
	L.buildDom(); L.runSolve();
	return doc.links.length;
}

const links = growTo(7);
const ls = L.labelSettings();
Object.keys(ls.link).forEach(k => { ls.link[k] = true; });
Object.keys(ls.node).forEach(k => { ls.node[k] = true; });
// **ALIGNED LABELS ON**, which is the whole point: shedAlignedForConflicts() returns at its first
// test for every link when they are off, so with them off this harness would guard nothing.
L.settings().alignPipeLabels = true;
L.refreshLabelText();
L.relayoutLabels();

console.log('1. A PRICED WIDTH LANDS WITHIN TOLERANCE OF WHAT REDRAWING MEASURES');
{
	// For every label that has something to shed: price the full set arithmetically, then redraw at
	// that same content and measure it for real. The two should agree to the bearing error.
	const les = L.linkEls();
	let n = 0, worst = 0, sum = 0, priced = 0;
	Object.keys(les).forEach(function (id) {
		const le = les[id];
		if (!le || le.empty || !le.allLines || le.allLines.length < 2) { return; }
		// **PRICE WHAT IS DRAWN, which is not always the full list.** A label reaching here has often
		// already shed in the LENGTH cascade, so le.lines is a subset of le.allLines and the banked
		// segments describe that subset. The first version of this harness compared a nine-line
		// keep-set against a two-line drawing and read the mismatch as a measurement error.
		const all = le.allLines, order = L.shedOrder(all);
		const keep = L.keepSet(all, order, all.length - le.lines.length);   // exactly what is drawn
		const w = L.priceKeep(le, keep, all);
		if (w === null) { return; }
		priced++;
		const real = (le.twPx !== undefined && le.twPx !== null) ? le.twPx : null;
		if (real === null || !(real > 0)) { return; }
		const rel = Math.abs(w - real) / real;
		n++; sum += rel;
		if (rel > worst) { worst = rel; }
	});
	report(priced > 10, 'there are labels with something to shed, and they price', priced + ' priced');
	report(n > 0, 'and their real measured width is available to compare against', n + ' compared');
	// At the FULL keep-set the calibration is exact by construction -- k = box / sum means
	// k * sum === box. That is the property being asserted: the arithmetic reproduces the
	// measurement it was calibrated on, so any later disagreement is the bearing shift alone.
	report(worst < 1e-9, 'at full content the priced width IS the measured width, by construction',
		'worst relative error ' + worst.toExponential(2));
	console.log(`       mean relative error ${(100 * sum / Math.max(1, n)).toExponential(2)}%`);
}

console.log('\n2. A SHED SUBSET PRICES WITHIN THE MEASURED BEARING TOLERANCE');
{
	// Drop one value, price it, then actually draw that content and measure. The gap is the side
	// bearing shift -- the thing that makes this arithmetic inexact and the reason Tom relaxed the
	// byte-identical bar. Bounded here so a regression that made it WILDLY wrong would fail.
	const les = L.linkEls();
	const doc = L.getDoc();
	let n = 0, worst = 0, sum = 0;
	doc.links.forEach(function (l) {
		const le = les[l.id];
		if (!le || le.empty || !le.allLines || le.allLines.length < 2) { return; }
		const all = le.allLines, order = L.shedOrder(all);
		const drawn = all.length - le.lines.length;
		if (drawn >= all.length - 1) { return; }        // nothing left to shed
		const before = le.lines;
		const keep = L.keepSet(all, order, drawn + 1);  // ONE more value gone than is drawn now
		const w = L.priceKeep(le, keep, all);
		if (w === null) { return; }
		const kept = all.filter((line, i) => keep[i]);
		L.render(le, l, kept, L.fs() + 'px');           // draw that same content and measure it
		const real = le.twPx;
		if (!(real > 0)) { return; }
		const rel = Math.abs(w - real) / real;
		n++; sum += rel; if (rel > worst) { worst = rel; }
		L.render(le, l, before, L.fs() + 'px');         // put back exactly what was drawn
	});
	report(n > 5, 'enough labels shed a value to measure the gap', n + ' compared');
	const mean = sum / Math.max(1, n);
	console.log(`       mean ${(100 * mean).toFixed(3)}%   worst ${(100 * worst).toFixed(3)}%`);
	// 5% is a fence, not a target. The browser measurement was 0.636% mean / 1.801% worst; the
	// headless stub's metrics differ, so the number here is not the browser's. What a fence this
	// size catches is the arithmetic going structurally wrong -- a dropped separator, a mis-scaled
	// k, an owner list out of step -- which would be tens of percent, not one.
	report(worst < 0.05, 'a shed subset prices within 5% of its real width', (100 * worst).toFixed(3) + '%');
	report(mean < 0.02, '...and the mean is far inside that', (100 * mean).toFixed(3) + '%');
}

console.log('\n3. THE PASS COSTS FAR FEWER FORCED LAYOUTS THAN IT HAS SHEDDING LABELS');
{
	// The point of the whole change. One relayout with aligned labels on, counted.
	const n = forcedLayouts(function () { L.relayoutLabels(); });
	console.log(`       ${links} links: ${n} forced layouts in a full relayout`);
	report(n < links, 'a full relayout forces fewer layouts than there are links',
		n + ' layouts, ' + links + ' links');
}

console.log('\n4. THE FALLBACK IS THE OLD CODE AND STILL WORKS');
{
	// The safety property: when pricing cannot answer, the original redraw loop finishes the job.
	// Exercised by taking the banked widths away, which is exactly the state a first pass is in.
	const les = L.linkEls();
	const some = Object.keys(les).filter(id => les[id] && les[id].allLines && les[id].allLines.length > 1);
	report(some.length > 0, 'there is a label to test the fallback on', some.length + ' candidates');
	const le = les[some[0]];
	const savedSeg = le.segW, savedOwn = le.segOwners;
	le.segW = null;
	report(L.priceKeep(le, L.keepSet(le.allLines, L.shedOrder(le.allLines), 1)) === null,
		'with no banked widths, pricing refuses rather than guessing');
	le.segW = savedSeg; le.segOwners = null;
	report(L.priceKeep(le, L.keepSet(le.allLines, L.shedOrder(le.allLines), 1)) === null,
		'...and with no owner list, likewise');
	le.segOwners = savedOwn;
	// A length mismatch is the shape a future change to composeRows() would produce.
	le.segOwners = (savedOwn || []).slice(0, Math.max(0, (savedOwn || []).length - 1));
	report(L.priceKeep(le, L.keepSet(le.allLines, L.shedOrder(le.allLines), 1)) === null,
		'...and when the two lists disagree in length, which is how a composeRows change would show');
	le.segOwners = savedOwn;
	// And the whole pass still completes with the widths gone from every label.
	Object.keys(les).forEach(id => { if (les[id]) { les[id].segW = null; } });
	let threw = null;
	try { L.relayoutLabels(); } catch (e) { threw = e; }
	report(!threw, 'a full relayout with nothing banked still completes', threw ? String(threw.message) : 'no throw');
}

console.log(failures === 0 ? `\nshed pricing harness: all ${checks} checks passed`
	: `\nshed pricing harness: ${failures} of ${checks} FAILED`);
process.exit(failures === 0 ? 0 : 1);
