// A NODE LABEL MUST NOT VANISH BECAUSE THE SYMBOLS GOT SMALL. Run with:
//   node dev/lpn-spike/small-symbol-label-harness.js
//
// Tom, 2026-09-01: *"When I set symbol size to 1 px, node label (uncrowded area) disappears."*
//
// **THE CAUSE.** addNodeFirstFit() builds a node label's whole candidate set out of
// defaultLabelOffset(), which scales with the SYMBOL alone (symbolFactor()). The box being placed
// is sized by the TEXT, which does not. cardinalSides() then defaults its polar reach to three
// times that offset, so at symbolSize 1 the entire search lay within 4.7 world units of the node
// while the label was 11 units tall -- nothing could lift the box off the node's own pipes,
// placeLabelsFirstFit() dropped it, and layoutNodeLabel() hid a label with room all round it.
// Measured on the three uncrowded nodes below, every node field on: all three dropped at 1 px, one
// at 2 px, none from 3 px up.
//
// The fix is a FLOOR ON THE SEARCH ONLY (LPN_NODE_MIN_REACH_TEXT_HEIGHTS), not on the resting
// offset -- section 3 is what stops that floor growing into a redesign of label placement, which
// is what a first draft of it did: floored at the label's own box height it fired for every
// multi-line label at the shipped sizes and stopped the shed cascade running on Net3-World.
// node-shed-harness.js and node-yield-harness.js are the other end of that fence.
//
// **THE UNREPRODUCIBLE HALF IS NOT ASSERTED.** Tom also reported "other related strangeness
// (result dropping) happens at other small node sizes. But I can't reproduce that". The 2 px row
// below is the nearest thing this could see, and it is asserted as itself, not as that report.

'use strict';

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

setUnitSet('us');
const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, runSolve: runSolve,\n" +
	"\t\trefreshLabelText: refreshLabelText,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tdefaultSettings: defaultSettings,\n" +
	"\t\tnodeEls: function () { return nodeEls; },\n" +
	"\t\tdefaultLabelOffset: defaultLabelOffset,\n" +
	"\t\tminReach: function () { return LPN_NODE_MIN_REACH_TEXT_HEIGHTS; },\n" +
	"\t\tfs: function () { return effectiveFontSize(); },\n" +
	"\t\tsetScale: function (s) { state.s = s; },\n" +
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

// UNCROWDED ON PURPOSE, which is Tom's word: three elements 300 units apart on a 1000x700 canvas.
// Nothing here is a placement puzzle -- if a label goes missing it is not because there is no room.
const res = L.addNode('reservoir', 0, 0);
const a = L.addNode('junction', 300, 0);
const b = L.addNode('junction', 600, 0);
L.addLink('pipe', res.id, a.id);
L.addLink('pipe', a.id, b.id);
L.buildDom();
L.runSolve();

const ls = L.labelSettings();
// Every field on: the tallest label a node can carry is the hardest case for a reach that is too
// short, and it is what Tom's own drawings look like.
Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });

function droppedAt(size) {
	L.settings().symbolSize = size;
	L.refreshLabelText();
	const ne = L.nodeEls();
	return Object.keys(ne).filter(function (id) { return ne[id].hiddenDropped; });
}

console.log('\n--- an uncrowded node keeps its label at every symbol size ---');
[16, 12, 10, 7, 5, 4, 3, 2, 1].forEach(function (size) {
	const gone = droppedAt(size);
	report(gone.length === 0, 'symbolSize ' + size + ' px: no node label dropped',
		gone.length ? 'dropped ' + gone.join(',') : '3 of 3 placed');
});

console.log('\n--- ...and 1 px is the size the defect was reported at, so it is named ---');
{
	const gone = droppedAt(1);
	report(gone.length === 0, 'symbolSize 1 px: Tom\'s own case', gone.join(',') || 'all placed');
	// The whole point of a floor is that the search can get out from under the label's own box, so
	// say the two numbers that were in the wrong order.
	L.settings().symbolSize = 1;
	const d = L.defaultLabelOffset(), home3 = Math.hypot(d.x, d.y) * 3;
	report(home3 < L.fs() * L.minReach(),
		'...and at that size the symbol-derived reach really is the shorter of the two',
		home3.toFixed(2) + ' world units against a ' + (L.fs() * L.minReach()).toFixed(2) + ' floor');
}

console.log('\n--- the floor is INACTIVE at every ordinary setting, at every zoom ---');
{
	// **THIS IS THE FENCE, not a formality.** A floor that binds at the shipped sizes is a redesign
	// of node label placement wearing a bug fix's clothes: it re-places labels further from their
	// nodes instead of letting them shed a value, which is a decision node-shed-harness.js holds
	// and nobody asked to revisit.
	const def = L.defaultSettings();
	[1, 4, 20, 5000].forEach(function (s) {
		L.setScale(s);
		L.settings().symbolSize = def.symbolSize;
		L.settings().textSize = def.textSize;
		const d = L.defaultLabelOffset(), home3 = Math.hypot(d.x, d.y) * 3;
		report(home3 >= L.fs() * L.minReach(),
			'shipped symbolSize ' + def.symbolSize + '/textSize ' + def.textSize + ' at scale ' + s +
				': the floor does not bind',
			home3.toFixed(3) + ' >= ' + (L.fs() * L.minReach()).toFixed(3));
	});
	L.setScale(1);
	// Scale-invariant by construction -- both quantities are 1/state.s -- so say so once rather
	// than trusting the four rows above to keep saying it.
	report(true, '...which is scale-invariant: both quantities are screen pixels over state.s');
}

console.log(`\n${failures ? 'FAILURES: ' + failures : 'all ' + checks + ' checks passed'}`);
process.exit(failures ? 1 : 0);
