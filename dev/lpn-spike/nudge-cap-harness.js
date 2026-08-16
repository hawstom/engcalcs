// How far the label placement pass may carry a label. Run with:
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
// MEASURED ON NET3 BEFORE ANY LIMIT, at the scale zoom-to-fit chooses for it: the MEDIAN node label
// was pushed 85 screen pixels from its node and the worst 301, on a 1400px canvas.
//
// **THE LIMIT IS NO LONGER A CAP APPLIED AFTERWARDS, AND THAT IS WHAT TASK 379 CHANGED HERE.**
// capNudges() ran after the relaxation and scaled an over-long push back along its own vector,
// which frequently landed the label back inside the collision the pass had just solved, with
// nothing re-run -- a defect in the shape of a fix. Candidate scoring has nowhere to put one: every
// candidate is generated within LPN_LABEL_REACH_PX of the anchor, so the range holds by
// construction and no answer is ever revised after it is chosen. The assertions below therefore
// measure the SAME property against the real page and say nothing about how it is achieved.
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
	"\t\treachPx: function () { return LPN_LABEL_REACH_PX; },\n" +
	// MEASURED FROM THE ANCHOR, NOT FROM THE LABEL'S HOME. The reach is a statement about how far a
	// number may sit from the element it describes, which is the reader's problem; the nudge is an
	// implementation detail measured from the default offset and is a slightly different quantity.
	"\t\tlabelDistPx: function (id) { var n = nodeById(id), p = nodeLabelPos(n);\n" +
	"\t\t\treturn Math.hypot(p.x - n.x, p.y - n.y) * state.s; },\n" +
	"\t\tleaderThresholdPx: function () { return leaderThreshold() * state.s; },\n" +
	"\t\tsetZoom: function (s) { state.s = s; setTransform(); onZoomChanged(); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
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

console.log('--- no label is carried further than the reach, at any zoom ---');
{
	const reach = L.reachPx();
	[8, 22, 60, 150].forEach(function (s) {
		L.setZoom(s);
		L.relayout();
		const worst = ids.reduce(function (m, id) { return Math.max(m, L.labelDistPx(id)); }, 0);
		ok('at scale ' + s + ', the furthest label is within the reach', worst <= reach + 1e-6,
			worst.toFixed(0) + 'px against a ' + reach + 'px reach');
	});
	// THE REACH IS A SCREEN DISTANCE, and the proof is that it binds at the SAME NUMBER OF PIXELS at
	// two different zooms -- which means a different world distance each time. Asserting a world
	// figure would assert nothing: the same world distance is a hair at one scale and half the
	// canvas at another, which is the trap this whole subject is made of.
	function worstPx(s) {
		L.setZoom(s);
		L.relayout();
		return ids.reduce(function (m, id) { return Math.max(m, L.labelDistPx(id)); }, 0);
	}
	const a11 = worstPx(11), a22 = worstPx(22);
	ok('...and it BINDS, at both zooms, so the checks above are not vacuous',
		Math.abs(a11 - reach) < 0.01 && Math.abs(a22 - reach) < 0.01,
		a11.toFixed(1) + 'px at 11x, ' + a22.toFixed(1) + 'px at 22x, reach ' + reach);
}

console.log('\n--- a label at the reach is still attached to its element ---');
{
	// The reach has to sit ABOVE the leader threshold, or the worst case is a label as far away as
	// the rule allows with no line drawn to say whose it is -- which is what Tom photographed, and
	// the half of the symptom that made it hard to read as a placement problem at all.
	L.setZoom(22);
	ok('the reach is comfortably above the distance at which a leader appears',
		L.reachPx() > L.leaderThresholdPx() * 1.2,
		'reach ' + L.reachPx() + 'px, leader appears past ' + L.leaderThresholdPx().toFixed(0) + 'px');
	// And that relationship must hold at every zoom, since both are pixel quantities derived
	// differently -- one a constant, the other from the font and symbol sizes.
	let holds = true;
	[8, 22, 60, 150].forEach(function (s) {
		L.setZoom(s);
		if (!(L.reachPx() > L.leaderThresholdPx() * 1.2)) { holds = false; }
	});
	ok('...at every zoom, since the two are derived differently', holds);
}

console.log('\n--- the limit is a property of the candidates, not a correction applied after ---');
{
	// **THE ASSERTION THAT REPLACES "the direction is kept, only the distance is discarded".** That
	// sentence described capNudges() scaling an over-long push back along its own vector, and the
	// reason it is gone is that revising an answer after it is chosen re-creates the conflicts the
	// pass had just solved. So the check is now the stronger one: nothing is revised at all, and the
	// evidence is that running the pass twice changes not one label.
	L.setZoom(22);
	const before = ids.map(function (id) { return L.labelDistPx(id); });
	L.relayout();
	const after = ids.map(function (id) { return L.labelDistPx(id); });
	ok('running the pass again moves nothing -- it is idempotent, with no correction stage',
		before.every(function (v, i) { return Math.abs(v - after[i]) < 1e-9; }));
	const atReach = after.filter(function (v) { return Math.abs(v - L.reachPx()) < L.reachPx() * 0.01; });
	ok('several labels really are out at the reach, so this section is not vacuous',
		atReach.length > 0, atReach.length + ' of ' + ids.length + ' at the reach');
	ok('...and not one is beyond it', after.every(function (v) { return v <= L.reachPx() * 1.0001; }),
		Math.max.apply(null, after).toFixed(2) + 'px');
	// The source says it too: a limit that is applied afterwards leaves a function behind. Matched
	// on the CALL, so the one mention left -- the comment recording why it went -- does not count as
	// the thing coming back.
	const src = require('fs').readFileSync(
		require('path').resolve(__dirname, '../../js/looped-network.js'), 'utf8');
	ok('and capNudges() is gone from the file, not merely unused',
		!/^[^\/\n]*capNudges\(/m.test(src));
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
