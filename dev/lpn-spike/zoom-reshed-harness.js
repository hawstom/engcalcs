// A WHEEL NOTCH RE-DECIDES EVERY LINK LABEL'S CONTENT, AND IT DOES IT IN A BATCH (Task 436).
// Run with:
//   node dev/lpn-spike/zoom-reshed-harness.js
//
// WHY THIS EXISTS. A notch does not lay out per notch -- onZoomChanged() ends in the debounced
// scheduleReshed(), which fires 120 ms after the LAST notch and runs reshedLinkLabels() and then
// relayoutLabels(). That is the whole of a notch's label work, and measured in a real Chromium on
// the 480-pipe grid dev/browser-pass/specs/perf.js builds, it split like this:
//
//     reshedLinkLabels()   1,272 - 7,327 ms      <- the length cascade, one label at a time
//     relayoutLabels()        60 -   238 ms
//
// The cascade was the whole cost, and for the reason Task 440 had already found and fixed in the
// OTHER caller: getBBox() is a layout read, so "draw it, measure it, drop a value, draw it again"
// run to the bottom one label at a time forces one full layout per label per rung. refreshLabelText()
// was batched then and this path was not, so a wheel notch kept paying it. Batched, the same
// measurement gives 44 - 458 ms.
//
// **THE DANGER IS A DRAWING THAT IS FASTER AND DIFFERENT** -- a label that keeps a different set of
// values is a defect, not a saving. So the equivalence is the first thing checked and the count is
// the second:
//
//   1. THE BATCH DECIDES WHAT THE SEQUENTIAL CASCADE DECIDES. shedToSegment() still runs one
//      label's cascade to the bottom on its own, in the shipped file, as the reference
//      implementation. Every link's contents after a notch are compared against re-running its own
//      cascade sequentially, value for value.
//   2. THE FORCED LAYOUTS ARE COUNTED, not timed. Every DOM write and every layout read during one
//      notch is traced; a read that follows a write is one forced layout. The count must stay
//      per-RUNG rather than per-label-per-rung, so it is taken on a network and again on one four
//      times the size.
//
// A stub cannot lay anything out, so the millisecond saving is not observable here; the SHAPE is,
// and the shape is what was wrong. dev/browser-pass/specs/perf.js carries the clock.

const stub = require('./lpn-dom-stub.js');
const { setUnitSet, loadLoopedNetwork } = stub;

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// ---- trace every DOM write and every layout read ------------------------------------------------
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
// A forced layout is a READ that follows a WRITE. Every read after it is free until the next write.
function forcedLayouts(fn) {
	trace.length = 0; tracing = true;
	fn();
	tracing = false;
	let n = 0;
	for (let i = 1; i < trace.length; i++) {
		if (trace[i] === 'R' && trace[i - 1] === 'W') { n++; }
	}
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
	"\t\tdragged: labelIsDragged,\n" +
	"\t\tfs: effectiveFontSize,\n" +
	"\t\tfsNow: function () { return effectiveFontSize() + 'px'; },\n" +
	"\t\tshedOne: shedToSegment,\n" +
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

// An n x n grid on uneven spacing, so pipes differ in length and the cascade has something to
// decide. One corner is the reservoir.
const SP = 100;
const built = { ids: [] };
function linkBetween(a, b) {
	return L.getDoc().links.some(function (l) {
		return (l.from === a && l.to === b) || (l.from === b && l.to === a);
	});
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
			if (c + 1 < n && !linkBetween(built.ids[r][c], built.ids[r][c + 1])) {
				L.addLink('pipe', built.ids[r][c], built.ids[r][c + 1]);
			}
			if (r + 1 < n && !linkBetween(built.ids[r][c], built.ids[r + 1][c])) {
				L.addLink('pipe', built.ids[r][c], built.ids[r + 1][c]);
			}
		}
	}
	L.buildDom();
	L.runSolve();
	return doc.links.length;
}

const smallLinks = growTo(4);
const ls = L.labelSettings();
Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
// **THE LENGTH CASCADE ALONE.** The CROWDING cascade (shedAlignedForConflicts) sheds further and
// each of its decisions depends on every label placed before it -- which is exactly why it is
// deliberately still sequential, and why it is not what shedToSegment() reproduces. With aligned
// labels off and no pipe long enough for a repeated chain, it returns at its first test for every
// link and leaves the length cascade's answer standing, which is the answer being compared.
L.settings().alignPipeLabels = false;
L.refreshLabelText();

// What the debounced reshed runs, and nothing else: this is scheduleReshed()'s whole body. The
// notch itself only republishes font sizes -- measured at 1.5-5 ms in Chromium against hundreds for
// this -- so this IS a wheel notch's label work.
function notch(zoom) {
	L.state().s *= zoom;
	L.reshed(L.fsNow(), L.fs());
	L.relayoutLabels();
}

console.log('\n--- one wheel notch: forced layouts do not grow with the drawing ---');
// ZOOMING OUT, because a label's run in world units is its pixel width divided by the scale: out is
// the direction in which labels stop fitting and the cascade has work to do.
const smallLayouts = forcedLayouts(function () { notch(0.55); });
const bigLinks = growTo(8);
L.refreshLabelText();
const bigLayouts = forcedLayouts(function () { notch(0.55); });
report(bigLinks > smallLinks * 3, 'the second network really is several times the first',
	smallLinks + ' links -> ' + bigLinks + ' links');
console.log(`       ${smallLinks} links: ${smallLayouts} forced layouts`);
console.log(`       ${bigLinks} links: ${bigLayouts} forced layouts`);
// The cascade's DEPTH may rise a little with the drawing, so this is not "the same number" -- it is
// "nothing like the number of labels". One label at a time, the big network cost about one forced
// layout per shedding label per rung, which was several hundred.
report(bigLayouts < 40, 'a whole notch forces well under forty layouts', bigLayouts + ' layouts');
report(bigLayouts < bigLinks / 4, '...which is a small fraction of the link count',
	bigLayouts + ' vs ' + bigLinks);
report(bigLayouts <= smallLayouts + 12, '...and it barely moved when the drawing quadrupled',
	smallLayouts + ' -> ' + bigLayouts);

console.log('\n--- and the notch left every label showing what the sequential cascade shows ---');
{
	const doc = L.getDoc(), linkEls = L.linkEls(), fsNow = L.fsNow();
	const after = {};
	doc.links.forEach(function (l) {
		const le = linkEls[l.id];
		if (le) { after[l.id] = (le.lines || []).map(function (x) { return x.field; }); }
	});
	let compared = 0, shedSome = 0, disagreed = [];
	doc.links.forEach(function (l) {
		const le = linkEls[l.id];
		if (!le || le.empty || L.dragged(l)) { return; }
		const all = le.allLines || [];
		if (all.length < 2) { return; }
		const kept = L.shedOne(le, l, all, fsNow).map(function (x) { return x.field; });
		compared++;
		if (kept.length < all.length) { shedSome++; }
		if (JSON.stringify(kept) !== JSON.stringify(after[l.id])) {
			disagreed.push(l.id + ': notch ' + JSON.stringify(after[l.id]) +
				' vs sequential ' + JSON.stringify(kept));
		}
	});
	report(compared > 100, 'every link label was compared', compared + ' labels');
	// **WITHOUT THIS THE COMPARISON PASSES VACUOUSLY.** If nothing shed, both paths agree on the
	// full list and the check asserts that a cascade which never ran matches another that never ran.
	report(shedSome > 20, '...and a real number of them actually shed on the notch',
		shedSome + ' shed at least one value');
	report(disagreed.length === 0, '...and not one of them decided differently',
		disagreed.length ? disagreed.slice(0, 3).join(' | ') : 'identical');
}

console.log('\n--- and a notch that changes nothing costs nothing ---');
{
	// **THE CHEAP CASE IS WHAT MAKES A ZOOM AFFORDABLE AT ALL** and it survives the batching: a
	// label already showing everything, whose banked width still fits, is filtered out before a
	// single glyph is written. Zoomed far enough IN that every label fits, a notch writes nothing.
	L.state().s = 60;
	L.refreshLabelText();
	const layouts = forcedLayouts(function () { notch(1.1); });
	const linkEls = L.linkEls();
	let full = 0;
	L.getDoc().links.forEach(function (l) {
		const le = linkEls[l.id];
		if (le && le.lines && le.allLines && le.lines.length === le.allLines.length) { full++; }
	});
	report(full > 100, 'zoomed in, every label is showing everything it has', full + ' at full content');
	report(layouts <= 4, '...and the notch forces almost no layouts at all', layouts + ' layouts');
}

console.log(failures === 0 ? `\nALL PASS (${checks} checks)` : `\n${failures} of ${checks} FAILED`);
process.exit(failures === 0 ? 0 : 1);
