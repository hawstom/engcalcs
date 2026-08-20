// Harness for ROADMAP Task 446 -- COLOURING MUST NOT COST A ZOOM, and hoisting the class breaks
// out of the paint loop must not move a single element's colour. Run with:
//   node dev/lpn-spike/color-perf-harness.js
//
// WHY THIS EXISTS. Both halves of Task 446 are invisible in a browser. A map coloured by a
// per-element recomputation of the breaks looks exactly like one coloured by a hoisted set; the
// only symptom is that a wheel notch on a 120-link network went slow, and the only symptom of
// getting the fix wrong would be one element in a neighbouring class, which nobody can see either.
// So this file asserts three things a person cannot:
//   * a repaint calls js/lpn-ramps.js's breaksFor() a number of times that does NOT grow with the
//     network -- O(1) per group, not O(L);
//   * a zoom calls it ZERO times, because nothing about the data changed;
//   * every element's painted colour is identical to what the per-element path produces.
// The third is the one that makes the first two safe to believe.

const { byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

setUnitSet('us');
const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom, setProp: setProp,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, runSolve: runSolve,\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\trefreshValueColors: refreshValueColors,\n" +
	"\t\trefreshSymbolSizes: refreshSymbolSizes,\n" +
	"\t\tonZoomChanged: onZoomChanged,\n" +
	"\t\tstate: function () { return state; },\n" +
	"\t\tpaintNodeColor: paintNodeColor, paintLinkColor: paintLinkColor,\n" +
	"\t\tclearBreaks: function (g, f) { delete settings.colorBreaks[g + '.' + f]; },\n" +
	"\t\tnodeFill: function (id) { return nodeEls[id] ? (nodeEls[id].circle.style.fill || '') : null; },\n" +
	"\t\tnodeSymbolColor: function (id) { return (nodeEls[id] && nodeEls[id].symbol) ? (nodeEls[id].symbol.style.color || '') : null; },\n" +
	"\t\tlinkStroke: function (id) { return linkEls[id] ? (linkEls[id].line.style.stroke || '') : null; },\n" +
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
// The colour key is created as a SIBLING of #lpn_labels_legend; the stub creates every id as an
// orphan, so without this renderColorLegend() has nowhere to append and the legend half of a
// repaint would not run at all. Same fix, same reason, as color-ramp-harness.js.
byId.lpn_canvas.appendChild(byId.lpn_labels_legend);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

// The counter goes on the SHIPPED module object, which is what looped-network.js's ramps() hands
// back and calls the method on -- so this counts the real call site rather than a copy of it.
const R = EngCalcs.lpnRamps;
const realBreaksFor = R.breaksFor;
let breakCalls = 0;
R.breaksFor = function () { breakCalls++; return realBreaksFor.apply(this, arguments); };
function count(fn) { breakCalls = 0; fn(); return breakCalls; }

// An n x n grid: one reservoir corner, junctions elsewhere, uneven elevations and demands so the
// values being classed are genuinely spread rather than all in one band.
const SP = 100;
const ids = [];
function growTo(n) {
	for (let r = 0; r < n; r++) {
		if (!ids[r]) { ids[r] = []; }
		for (let c = 0; c < n; c++) {
			if (ids[r][c]) { continue; }
			const nd = L.addNode(r === 0 && c === 0 ? 'reservoir' : 'junction',
				c * SP + (c % 3) * 17, r * SP + (r % 4) * 11);
			if (nd.elev !== undefined) { nd.elev = 100 + ((r * 8 + c) % 13) * 3; }
			if (nd.demand !== undefined) { nd.demand = 10 + ((r * 3 + c * 5) % 11); }
			ids[r][c] = nd.id;
		}
	}
	const d = L.getDoc();
	function between(a, b) {
		return d.links.some(l => (l.from === a && l.to === b) || (l.from === b && l.to === a));
	}
	for (let r = 0; r < n; r++) {
		for (let c = 0; c < n; c++) {
			if (c + 1 < n && !between(ids[r][c], ids[r][c + 1])) { L.addLink('pipe', ids[r][c], ids[r][c + 1]); }
			if (r + 1 < n && !between(ids[r][c], ids[r + 1][c])) { L.addLink('pipe', ids[r][c], ids[r + 1][c]); }
		}
	}
	// A spread of diameters, so the link field being coloured is not one constant value.
	d.links.forEach(function (l, i) { L.setProp(l, 'diameter', [6, 8, 10, 12, 16, 20][i % 6]); });
	L.buildDom();
	L.runSolve();
	return { nodes: d.nodes.length, links: d.links.length };
}

// Both groups on a DATA-DRIVEN field. The default node mode is a criterion mode, which returns from
// computedBreaks() with no data pass at all -- exactly why Tom saw the cost on links only. A node
// field with no criterion is just as slow, so both halves are measured here.
const s = L.settings();
s.colorNodeField = 'elev';
s.colorLinkField = 'diameter';

// ---- 1. a repaint's cost does not grow with the network ---------------------------------------
console.log('== breaksFor() per repaint ==');
// **THE LIMITS ARE EMPTIED BEFORE EACH MEASUREMENT, or the measurement is vacuous.** Since Task
// 448 a repaint of a field whose limits are filled in computes nothing at all, and a harness
// counting zero on both sizes would report O(1) about a code path it never entered. Emptying them
// puts the work back so there is a cost to be shown not to grow.
function emptyBoth() { L.clearBreaks('node', 'elev'); L.clearBreaks('link', 'diameter'); }
const small = growTo(5);
emptyBoth();
const cSmall = count(() => L.refreshValueColors());
const big = growTo(11);
emptyBoth();
const cBig = count(() => L.refreshValueColors());
console.log('   ' + small.links + ' links -> ' + cSmall + ' calls;  ' + big.links + ' links -> ' + cBig + ' calls');
ok('a repaint computes the breaks ONCE PER GROUP, not once per element',
	cSmall <= 4 && cBig <= 4, cSmall + '/' + cBig);   // two groups, and the legend reads each once
ok('...so the count does not grow with the network', cSmall === cBig, cSmall + ' vs ' + cBig);
// **TASK 448 REMOVED THE REST OF THE COST.** The limits are FILLED IN the first time they are
// asked for, so the one-element callers (paint*Color with no breaks argument, which is what a single
// rebuilt element still uses) read a stored array and never reach the mode at all. The pre-hoist
// shape -- one call per element, the measurement Task 446 recorded -- can no longer be reproduced,
// which is the strongest form the fix can take.
const doc = L.getDoc();
const perElement = count(function () {
	doc.nodes.forEach(n => L.paintNodeColor(n.id));
	doc.links.forEach(l => L.paintLinkColor(l.id));
});
console.log('   per-element path over ' + (big.nodes + big.links) + ' elements: ' +
	perElement + ' calls');
ok('the per-element path costs NOTHING once the limits are filled in', perElement === 0,
	String(perElement));
// Where the cost went, measured rather than asserted: an emptied field re-derives ONCE PER GROUP, at
// the first element painted, and every element after it is free. Two groups, two calls, whatever
// the size of the network.
L.clearBreaks('node', 'elev');
L.clearBreaks('link', 'diameter');
const afterEmpty = count(function () {
	doc.nodes.forEach(n => L.paintNodeColor(n.id));
	doc.links.forEach(l => L.paintLinkColor(l.id));
});
console.log('   ...and after emptying both fields: ' + afterEmpty + ' calls');
ok('an emptied field costs one call per GROUP, once, and nothing thereafter', afterEmpty === 2,
	String(afterEmpty));

// ---- 2. the colours are unchanged -------------------------------------------------------------
// A perf fix that moves one element into a neighbouring class is a regression, so the hoisted
// result is compared element by element against the per-element result painted just above.
console.log('\n== the colours are unchanged ==');
function snapshot() {
	return doc.nodes.map(n => n.id + ':' + L.nodeFill(n.id) + '|' + L.nodeSymbolColor(n.id))
		.concat(doc.links.map(l => l.id + ':' + L.linkStroke(l.id))).join(',');
}
const perElementPaint = snapshot();
L.refreshValueColors();
const hoisted = snapshot();
ok('every element takes the same colour hoisted as it did per element',
	hoisted === perElementPaint,
	hoisted.split(',').find((v, i) => v !== perElementPaint.split(',')[i]));
ok('...and the map is genuinely coloured, so that comparison is not two empty strings',
	new Set(doc.links.map(l => L.linkStroke(l.id))).size >= 3,
	String(new Set(doc.links.map(l => L.linkStroke(l.id))).size));

// ---- 3. a zoom does not colour at all ---------------------------------------------------------
// Task 446's real answer: nothing about the data changes on a wheel notch. refreshSymbolSizes()
// used to end in refreshValueColors(), which put the whole paint on the zoom path.
console.log('\n== a zoom repaints nothing ==');
const beforeZoom = snapshot();
const zoomCalls = count(function () {
	const st = L.state();
	st.s = st.s * 1.2;
	L.refreshSymbolSizes();
	L.onZoomChanged();
});
ok('a zoom notch computes no breaks at all', zoomCalls === 0, String(zoomCalls));
ok('...and leaves every colour exactly as it was', snapshot() === beforeZoom);

console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILURE(S)');
process.exit(fails === 0 ? 0 : 1);
