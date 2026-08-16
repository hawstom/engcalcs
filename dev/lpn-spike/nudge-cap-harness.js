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
	// THE REACH IS 30 TEXT HEIGHTS NOW (Tom, 2026-08-16), not a fixed 28 screen pixels -- the old
	// constant was SMALLER THAN THE LABEL, so no candidate could ever clear a conflict. ONE number
	// for the whole map, not one per label: *"A single one is better, I think."* Computed here the
	// way runLabelCollisionAvoidance() computes it, and returned in SCREEN pixels because that is
	// the quantity that binds.
	"\t\treachPx: function () { return LPN_REACH_TEXT_HEIGHTS * effectiveFontSize() * state.s; },\n" +
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
	[8, 22, 60, 150].forEach(function (s) {
		L.setZoom(s);
		L.relayout();
		let over = 0, worstRatio = 0;
		ids.forEach(function (id) {
			const r = L.labelDistPx(id) / L.reachPx();
			if (r > 1 + 1e-6) { over++; }
			worstRatio = Math.max(worstRatio, r);
		});
		ok('at scale ' + s + ', every label is within ITS OWN reach', over === 0,
			'worst ' + (worstRatio * 100).toFixed(0) + '% of its reach');
	});
	// THE REACH IS A SCREEN DISTANCE, and the proof is that it binds at the SAME NUMBER OF PIXELS at
	// two different zooms -- which means a different world distance each time. Asserting a world
	// figure would assert nothing: the same world distance is a hair at one scale and half the
	// canvas at another, which is the trap this whole subject is made of.
	// **AND THE REACH IS NOT SUPPOSED TO BIND ANY MORE**, which is the whole of Tom's 2026-08-16
	// ruling: *"Leaders work. That's what they are for. This is not a thing."* At five label sizes
	// the limit exists only to keep the search finite, and a label that ends up near it is a label
	// that had nowhere better -- not a label that was clipped. So what is asserted is the ABSENCE of
	// clipping: nothing sits at the limit merely because the limit is there.
	//
	// Placements legitimately DIFFER between zooms and that is not a defect: labels are a constant
	// screen size while the network scales, so at 22x the nodes are twice as far apart in pixels and
	// genuinely conflict less. An assertion that the same label lands at the same fraction of its
	// reach at both zooms was written here first and was simply wrong about the physics.
	// A FRACTION, not zero. This fixture is built so that no conflict-free answer exists, so a few
	// labels genuinely have nowhere better and end up far out -- that is the reach bounding the
	// search, which is its job. What must NOT happen is the old behaviour, where the limit was
	// smaller than the label and therefore bound nearly every one of them.
	L.setZoom(11); L.relayout();
	const near = ids.filter(function (id) { return L.labelDistPx(id) > L.reachPx() * 0.95; });
	ok('the reach bounds the search without shaping the usual answer',
		near.length <= ids.length / 4,
		near.length + ' of ' + ids.length + ' within 5% of their reach, on a fixture with no clean answer');
}

console.log('\n--- a label at the reach is still attached to its element ---');
{
	// The reach has to sit ABOVE the leader threshold, or the worst case is a label as far away as
	// the rule allows with no line drawn to say whose it is -- which is what Tom photographed, and
	// the half of the symptom that made it hard to read as a placement problem at all.
	L.setZoom(22);
	ok('the reach is comfortably above the distance at which a leader appears',
		L.reachPx() > L.leaderThresholdPx() * 1.2,
		'reach ' + L.reachPx().toFixed(0) + 'px, leader appears past ' + L.leaderThresholdPx().toFixed(0) + 'px');
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
	// NON-VACUITY, restated for a reach that no longer binds: the section is worth reading only if
	// the pass MOVED something. It used to be "several labels are out at the cap", which cannot be
	// true any more and would fail forever if left.
	const moved = after.filter(function (v) { return v > 1e-6; });
	ok('the pass really moved labels, so this section is not vacuous',
		moved.length > 0, moved.length + ' of ' + ids.length + ' moved');
	ok('...and not one is beyond its reach', after.every(function (v) { return v <= L.reachPx() * 1.0001; }),
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
