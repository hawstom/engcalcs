// The label pass is BATCHED, and batching decided exactly what one-at-a-time decided (Task 440).
// Run with:
//   node dev/lpn-spike/label-batch-harness.js
//
// WHY THIS EXISTS. getBBox() is a layout read: taken between two DOM writes it forces a synchronous
// layout of the whole drawing. refreshLabelText() used to write one link label and measure it
// before touching the next, and its shed cascade ("draw it, measure it, drop a value, do it again")
// measured inside the same iteration -- so a 480-pipe network paid one full layout per label per
// rung, and closing a project that landed on one took nine seconds. The pass now writes every
// label, measures every label, and then iterates the CASCADE a rung at a time across all of them.
//
// **THE DANGER IS A PIPELINE THAT IS FAST AND WRONG**, because a shed decision depends on a
// measurement and the next rung's measurement depends on the shed. Two things are checked here, and
// the first is the one that matters:
//
//   1. EQUIVALENCE, against the code that was not changed. shedToSegment() still runs one label's
//      cascade to the bottom on its own -- it is what a zoom's reshed calls -- so it is a reference
//      implementation sitting in the same file. Every link's batched outcome is compared against
//      re-running its own cascade sequentially. They must agree value for value.
//   2. THE BATCHING ITSELF, counted rather than asserted structurally: every write and every layout
//      read is traced, and a WRITE-THEN-READ transition is one forced layout. That count must not
//      grow with the number of links -- which is the whole claim -- so it is measured on a small
//      network and again on one four times the size.
//
// The stub cannot lay anything out, so the COST is not observable here; the SHAPE is, and the shape
// is what regressed. dev/browser-pass/specs/perf.js carries the millisecond number.

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
// A forced layout is a READ that follows a WRITE. Every read after it is free until the next write,
// which is exactly the property the three passes are for.
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
	"\t\trefreshLabelText: refreshLabelText,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tlinkEls: function () { return linkEls; },\n" +
	"\t\tdragged: labelIsDragged,\n" +
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

// An n x n grid of junctions on uneven spacing, so pipes differ in length and the cascade has
// something to decide. One corner is the reservoir.
const SP = 100;
const built = { ids: [] };
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
function linkBetween(a, b) {
	return L.getDoc().links.some(function (l) {
		return (l.from === a && l.to === b) || (l.from === b && l.to === a);
	});
}

const smallLinks = growTo(4);
const ls = L.labelSettings();
Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
// The LENGTH cascade alone, for the equivalence check: with aligned labels on, the CROWDING cascade
// sheds further and its decisions depend on every label placed before it, which is why that one is
// deliberately still sequential and is not what shedToSegment() reproduces.
L.settings().alignPipeLabels = false;

console.log('\n--- forced layouts do not grow with the drawing ---');
const smallLayouts = forcedLayouts(function () { L.refreshLabelText(); });
const bigLinks = growTo(8);
const bigLayouts = forcedLayouts(function () { L.refreshLabelText(); });
report(bigLinks > smallLinks * 3, 'the second network really is several times the first',
	smallLinks + ' links -> ' + bigLinks + ' links');
// The cascade's DEPTH may rise a little with the drawing (more labels means a deeper worst case),
// so this is not "the same number" -- it is "nothing like the number of labels". Interleaved, the
// big network cost about one forced layout per link per rung, which was over a thousand.
report(bigLayouts < 40, 'the whole pass forces well under forty layouts', bigLayouts + ' layouts');
report(bigLayouts < bigLinks / 4, '...which is a small fraction of the link count',
	bigLayouts + ' vs ' + bigLinks);
report(bigLayouts <= smallLayouts + 12, '...and it barely moved when the drawing quadrupled',
	smallLayouts + ' -> ' + bigLayouts);

console.log('\n--- and the batched cascade decided what the sequential one decides ---');
{
	const doc = L.getDoc(), linkEls = L.linkEls(), fsNow = L.fsNow();
	const batched = {};
	doc.links.forEach(function (l) {
		const le = linkEls[l.id];
		if (!le) { return; }
		batched[l.id] = (le.lines || []).map(function (x) { return x.field; });
	});
	// Re-run each link's own cascade the old way -- one label, to the bottom, on its own.
	let compared = 0, disagreed = [], shedSome = 0;
	doc.links.forEach(function (l) {
		const le = linkEls[l.id];
		if (!le || le.empty || L.dragged(l)) { return; }
		const all = le.allLines || [];
		if (all.length < 2) { return; }
		const kept = L.shedOne(le, l, all, fsNow).map(function (x) { return x.field; });
		compared++;
		if (kept.length < all.length) { shedSome++; }
		if (JSON.stringify(kept) !== JSON.stringify(batched[l.id])) {
			disagreed.push(l.id + ': batched ' + JSON.stringify(batched[l.id]) +
				' vs sequential ' + JSON.stringify(kept));
		}
	});
	report(compared > 100, 'every link label was compared', compared + ' labels');
	// **WITHOUT THIS THE COMPARISON PASSES VACUOUSLY.** If nothing sheds, both paths agree on the
	// full list and the test is asserting that a cascade which never ran is equivalent to another
	// that never ran.
	report(shedSome > 20, '...and a real number of them actually shed', shedSome + ' shed at least one value');
	report(disagreed.length === 0, '...and not one of them decided differently',
		disagreed.length ? disagreed.slice(0, 3).join(' | ') : 'identical');
}

console.log('\n--- zoomed out until every label is far too wide, the deepest cascade ---');
{
	L.state().s = 0.15;
	const doc = L.getDoc(), linkEls = L.linkEls();
	const layouts = forcedLayouts(function () { L.refreshLabelText(); });
	const fsNow = L.fsNow();
	const batched = {};
	doc.links.forEach(function (l) {
		if (linkEls[l.id]) { batched[l.id] = (linkEls[l.id].lines || []).map(function (x) { return x.field; }); }
	});
	let disagreed = 0, atFloor = 0;
	doc.links.forEach(function (l) {
		const le = linkEls[l.id];
		if (!le || le.empty || L.dragged(l)) { return; }
		const all = le.allLines || [];
		if (all.length < 2) { return; }
		const kept = L.shedOne(le, l, all, fsNow).map(function (x) { return x.field; });
		if (kept.length === 1) { atFloor++; }
		if (JSON.stringify(kept) !== JSON.stringify(batched[l.id])) { disagreed++; }
	});
	// The cascade's floor: one value survives however badly the label overruns -- dropping the last
	// is the HIDE, which linkLabelTooShort() owns, not the shed.
	report(atFloor > 100, 'the cascade ran to its floor on every label', atFloor + ' labels down to one value');
	report(disagreed === 0, '...and the batched pass agreed on every one of them', disagreed + ' disagreements');
	// A cascade eight rungs deep costs eight forced layouts batched, and eight per LABEL interleaved.
	report(layouts < 40, '...at a cost that is still per-rung, not per-label', layouts + ' layouts');
}

console.log(failures === 0 ? `\nALL PASS (${checks} checks)` : `\n${failures} of ${checks} FAILED`);
process.exit(failures === 0 ? 0 : 1);
