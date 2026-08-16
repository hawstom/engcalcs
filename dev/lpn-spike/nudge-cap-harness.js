// How far the collision pass may carry a label. Run with:
//   node dev/lpn-spike/nudge-cap-harness.js
//
// Tom, 2026-08-15, pointing at two node labels in open space on a Net3 screenshot: "A. Far away...
// They should be on the opposite side of the model."
//
// NOTHING WAS BROKEN, WHICH IS WHY IT TOOK THREE GUESSES TO FIND. The relaxation was doing exactly
// what it is asked to do. In a network whose nodes sit about a label's width apart -- which is every
// real distribution model at its own fit scale -- the only arrangement with no overlaps at all IS
// far-flung. An unbounded solver in an over-constrained problem does not fail; it wanders, and it
// reports success.
//
// MEASURED ON NET3 BEFORE THE CAP, at the scale zoom-to-fit chooses for it: the MEDIAN node label
// was pushed 85 screen pixels from its node and the worst 301, on a 1400px canvas. After: 45, by
// construction.
//
// THE JUDGEMENT, which is the part a test cannot make: a reader can follow a label that overlaps
// its neighbour, and cannot follow one that has been carried across the map. So the pass keeps its
// freedom and loses its range.

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, refreshLabelText: refreshLabelText,\n" +
	"\t\tlabelSettings: function () { return labelSettings; }, relayout: relayoutLabels,\n" +
	"\t\tnudgeOf: function (id) { return nodeEls[id].nudge; },\n" +
	// THE HEADLESS DOM CANNOT MEASURE TEXT, so a label's width has to be imposed -- the same
	// concession every harness here makes, and the same trap: the page banks a width in PIXELS and
	// divides by the scale on read, so the number to impose is the PIXEL one. Left to the stub's
	// constant getBBox() these labels come out under half a world unit wide on a two-unit grid,
	// which is no crowd at all and would make every check below pass for nothing.
	"\t\tsetLabelPx: function (id, px) { nodeEls[id].twPx = px; },\n" +
	"\t\tcapPx: function () { return LPN_NUDGE_CAP_PX; },\n" +
	"\t\tleaderThresholdPx: function () { return leaderThreshold() * state.s; },\n" +
	"\t\tsetZoom: function (s) { state.s = s; setTransform(); onZoomChanged(); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tmaskLayer = el('g', {}, world); labelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
L.setCanvas(1400, 700);

// A CROWD, on purpose: twenty-five nodes on a 5x5 grid ONE unit apart, each carrying three lines of
// label about 60 screen pixels wide. At the scale such a drawing fits at, that is a label several
// times the gap between the nodes -- Net3's own situation, and one with no overlap-free answer at
// all. The fixture has to be genuinely over-constrained or the cap never binds and every check
// below passes without testing anything, which is how the first draft of this file read.
const ids = [];
for (let r = 0; r < 5; r++) {
	for (let c = 0; c < 5; c++) { ids.push(L.addNode('junction', c, r).id); }
}
for (let i = 1; i < ids.length; i++) { L.addLink('pipe', ids[i - 1], ids[i]); }
L.labelSettings().node.id = true;
L.labelSettings().node.elev = true;
L.labelSettings().node.demand = true;
L.refreshLabelText();
// Three lines of "J13 / Z=42.00 / Q=0.00" is about 60 screen pixels wide.
ids.forEach(function (id) { L.setLabelPx(id, 60); });
L.relayout();

console.log('--- no label is carried further than the cap, at any zoom ---');
{
	const cap = L.capPx();
	[8, 22, 60, 150].forEach(function (s) {
		L.setZoom(s);
		const worst = ids.reduce(function (m, id) {
			const n = L.nudgeOf(id);
			return Math.max(m, Math.hypot(n.x, n.y) * s);
		}, 0);
		ok('at scale ' + s + ', the worst push is within the cap', worst <= cap + 1e-6,
			worst.toFixed(0) + 'px against a ' + cap + 'px cap');
	});
	// THE CAP IS A SCREEN DISTANCE, and the proof is that it binds at the SAME NUMBER OF PIXELS at
	// two different zooms -- which means a different world distance each time. Asserting a world
	// figure would assert nothing: the same world distance is a hair at one scale and half the
	// canvas at another, which is the trap this whole subject is made of.
	function worstPx(s) {
		L.setZoom(s);
		return ids.reduce(function (m, id) {
			const n = L.nudgeOf(id);
			return Math.max(m, Math.hypot(n.x, n.y) * s);
		}, 0);
	}
	const a22 = worstPx(11), a44 = worstPx(22);
	ok('...and it BINDS, at both zooms, so the checks above are not vacuous',
		Math.abs(a22 - cap) < 0.01 && Math.abs(a44 - cap) < 0.01,
		a22.toFixed(1) + 'px at 11x, ' + a44.toFixed(1) + 'px at 22x, cap ' + cap);
}

console.log('\n--- a label at the cap is still attached to its element ---');
{
	// The cap has to sit ABOVE the leader threshold, or the worst case is a label as far away as the
	// rule allows with no line drawn to say whose it is -- which is what Tom photographed, and the
	// half of the symptom that made it hard to read as a nudge at all.
	L.setZoom(22);
	ok('the cap is comfortably above the distance at which a leader appears',
		L.capPx() > L.leaderThresholdPx() * 1.2,
		'cap ' + L.capPx() + 'px, leader appears past ' + L.leaderThresholdPx().toFixed(0) + 'px');
	// And that relationship must hold at every zoom, since both are pixel quantities derived
	// differently -- one a constant, the other from the font and symbol sizes.
	let holds = true;
	[8, 22, 60, 150].forEach(function (s) {
		L.setZoom(s);
		if (!(L.capPx() > L.leaderThresholdPx() * 1.2)) { holds = false; }
	});
	ok('...at every zoom, since the two are derived differently', holds);
}

console.log('\n--- the direction the relaxation chose is kept; only the distance is discarded ---');
{
	// Scaling the vector back along itself, rather than clamping x and y separately, is what keeps
	// the informed part of the answer. Clamping per axis would rotate the push toward the diagonal
	// and put labels somewhere the pass never suggested.
	L.setZoom(22);
	const cap = L.capPx() / 22;
	const atCap = ids.map(function (id) { return L.nudgeOf(id); })
		.filter(function (n) { return Math.abs(Math.hypot(n.x, n.y) - cap) < cap * 0.01; });
	ok('several labels really are at the cap, so this section is not vacuous',
		atCap.length > 0, atCap.length + ' of ' + ids.length + ' at the cap');
	// A vector scaled along itself keeps its angle; one clamped per axis does not. With a cap of C,
	// per-axis clamping can only ever produce |x| <= C and |y| <= C, so a push at 45 degrees would
	// come out at length C*sqrt(2) -- longer than the cap. Nothing here may exceed it.
	ok('...and none exceeds the cap in LENGTH, which per-axis clamping would allow',
		atCap.every(function (n) { return Math.hypot(n.x, n.y) <= cap * 1.0001; }));
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
