// "IS THIS LABEL'S BOX CLEAR?" IS ANSWERED FROM AN INDEX, NOT A WALK (Task 436).
// Run with:
//   node dev/lpn-spike/aligned-shed-index-harness.js
//
// WHY THIS EXISTS. shedAlignedForConflicts() decides how many values a pipe label keeps by asking
// boxIsClear() whether its box has the map to itself, dropping one value and asking again. That
// question was answered by walking every obstacle box, and every label the pass places is PUSHED
// onto that same list -- so the walk grew at both ends: more labels asking, and a longer list each
// time. Measured through dev/lpn-spike/lpn-dom-stub.js on the grid dev/browser-pass/specs/perf.js
// builds, one pass cost 25,845 overlap tests on 112 pipes and 412,819 on 480 -- 231 per label
// against 860. The per-label rate rising with the drawing IS the defect; in a real Chromium it was
// 0.3-1.8 s of a wheel notch, and the whole of what was left of one.
//
// It now goes through Collide.boxIndex(): an append-only uniform grid that re-reads the caller's
// array on every query and bins whatever arrived since. That last part is the difference from
// Task 472's segment index, which is built once and held because a zoom changes scale and not
// topology -- this one must absorb an insert between every pair of queries.
//
// **THE DANGER IS A DRAWING THAT IS FASTER AND DIFFERENT.** A label that gives up a number it used
// to keep is a defect, not a saving, so the count is the LAST thing checked here:
//
//   1. THE INDEX IS EXACT -- it answers what the walk answers, box for box, on the real obstacle
//      set of a real network and on geometry chosen to break a grid: everything collinear, one box
//      spanning the whole map, an empty set, a list holding the query box itself, and boxes with
//      non-finite coordinates.
//   2. IT STAYS EXACT WHILE THE LIST MUTATES, which is this index's own hazard. Boxes are appended
//      one at a time and the two answers are compared after every single insert.
//   3. THE PLACEMENT IS UNCHANGED. The whole pass is run twice on the same drawing -- once through
//      the index, once through a drop-in backed by the walk -- and every label's station, side,
//      rotation, shed count, crowding verdict and rendered position is dumped and compared. It is
//      the byte-identical dump the change was accepted on, kept as an assertion.
//   4. THE OVERLAP TESTS ARE COUNTED, not timed, on two network sizes. The per-label rate must not
//      rise with the drawing.
//
// A stub cannot lay anything out, so the millisecond saving is not observable here -- node's own
// clock across this pass barely moves, because in the stub the pass is dominated by the fake text
// measurement rather than by the geometry. The SHAPE is observable, and the shape is what was
// wrong. dev/browser-pass/specs/perf.js carries the clock.

const stub = require('./lpn-dom-stub.js');
const { setUnitSet, loadLoopedNetwork } = stub;
const Collide = require('../../js/lpn-collide.js').lpnCollide;

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// ---- the editor, with the obstacle set and the shed pass reachable ------------------------------
setUnitSet('us');
const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, runSolve: runSolve,\n" +
	"\t\trefreshLabelText: refreshLabelText, relayoutLabels: relayoutLabels,\n" +
	"\t\tshedAligned: shedAlignedForConflicts,\n" +
	"\t\tstaticObstacles: staticObstacles,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tlinkEls: function () { return linkEls; },\n" +
	"\t\tnodeEls: function () { return nodeEls; },\n" +
	"\t\tfs: effectiveFontSize,\n" +
	"\t\tfsNow: function () { return effectiveFontSize() + 'px'; },\n" +
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

// The same n x n grid on uneven spacing the other zoom harnesses build, so the two are measuring
// the same drawing. One corner is the reservoir.
const SP = 100, built = { ids: [] };
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
function allLabelsOn() {
	const ls = L.labelSettings();
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
	// The pass this task is about only looks at labels BOUND to their pipe.
	L.settings().alignPipeLabels = true;
	L.refreshLabelText();
	L.relayoutLabels();
}

// ---- the placement dump, and the two ways of answering "is this box clear?" ---------------------
//
// The walk, wearing the index's interface. Swapping this in is the only way to run the SHIPPED pass
// both ways without keeping a second copy of it in the harness.
function walkIndex(boxes) {
	return { tests: 0, anyOverlap: function (q) { return Collide.anyBoxOverlap(q, boxes); } };
}
// Every decision the pass makes about every label: which station along the pipe, which side of it,
// what rotation, where the glyphs landed, how many values were given up, and whether it was hidden.
function dumpPlacements() {
	const doc = L.getDoc(), linkEls = L.linkEls(), nodeEls = L.nodeEls(), out = [];
	doc.links.slice().sort(function (a, b) { return a.id < b.id ? -1 : 1; }).forEach(function (l) {
		const le = linkEls[l.id];
		if (!le) { out.push(l.id + ' <none>'); return; }
		out.push([l.id, 'along=' + le.alignedAlong, 'sides=' + JSON.stringify(le.stationSides || []),
			'shed=' + le.shedCount, 'crowded=' + le.hiddenCrowded,
			'lines=' + JSON.stringify((le.lines || []).map(function (x) { return x.field; })),
			'x=' + (le.text && le.text.getAttribute('x')),
			'y=' + (le.text && le.text.getAttribute('y')),
			'rot=' + (le.text && le.text.getAttribute('transform'))].join(' '));
	});
	doc.nodes.slice().sort(function (a, b) { return a.id < b.id ? -1 : 1; }).forEach(function (n) {
		const ne = nodeEls[n.id];
		if (!ne) { out.push(n.id + ' <none>'); return; }
		out.push([n.id, 'nudge=' + JSON.stringify(ne.nudge || null),
			'dropped=' + ne.hiddenDropped,
			'x=' + (ne.text && ne.text.getAttribute('x')),
			'y=' + (ne.text && ne.text.getAttribute('y')),
			'anchor=' + (ne.text && ne.text.getAttribute('text-anchor'))].join(' '));
	});
	return out.join('\n') + '\n';
}
// `node aligned-shed-index-harness.js --dump walk|index`: build the drawing, run the pass once
// through the named backend, print the dump and stop. Section 3 spawns one of these each way.
if (process.argv[2] === '--dump') {
	const backend = process.argv[3] === 'walk' ? walkIndex : Collide.boxIndex;
	const real = Collide.boxIndex;
	Collide.boxIndex = backend;
	growTo(8);
	allLabelsOn();
	L.shedAligned(L.fsNow(), L.fs());
	Collide.boxIndex = real;
	process.stdout.write(dumpPlacements());
	process.exit(0);
}

// ---- 1. the index answers what the walk answers -------------------------------------------------
console.log('\n--- exact: index vs walk, on the obstacle set of a real network ---');
const smallLinks = growTo(8);
allLabelsOn();
{
	const obs = L.staticObstacles();
	const idx = Collide.boxIndex(obs.boxes);
	// Query boxes swept over the whole drawing at three angles and three sizes, so both a hit and a
	// clean miss are exercised many times over. A comparison that only ever asks about hits passes
	// for a broad phase that returns everything.
	let asked = 0, hits = 0, disagreed = 0;
	for (let x = -200; x <= 1800; x += 37) {
		for (let y = -200; y <= 1800; y += 53) {
			for (const spec of [[40, 12, 0], [90, 14, 33], [8, 8, -71]]) {
				const q = Collide.box(x, y, spec[0], spec[1], spec[2]);
				const a = idx.anyOverlap(q), b = Collide.anyBoxOverlap(q, obs.boxes);
				asked++;
				if (a) { hits++; }
				if (a !== b) { disagreed++; }
			}
		}
	}
	report(asked > 5000, 'the sweep really asked a lot of questions', asked + ' queries');
	report(hits > 50 && hits < asked - 50,
		"...and got both answers, so neither is vacuous",
		hits + ' clear-of-nothing hits out of ' + asked);
	report(disagreed === 0, 'the index agrees with the walk on every one of them',
		disagreed + ' disagreements');
}

console.log('\n--- exact: on geometry chosen to break a grid ---');
function agreesOver(boxes, queries) {
	const idx = Collide.boxIndex(boxes);
	let bad = 0;
	queries.forEach(function (q) {
		if (idx.anyOverlap(q) !== Collide.anyBoxOverlap(q, boxes)) { bad++; }
	});
	return bad;
}
{
	// EVERYTHING COLLINEAR. A degenerate bounding box is the case that makes a grid built from an
	// extent divide by zero; this one is built from a box SIZE, so it has nothing to divide, and
	// this asserts that.
	const collinear = [];
	for (let i = 0; i < 60; i++) { collinear.push(Collide.box(i * 10, 500, 8, 8, 0)); }
	const qs = [];
	for (let i = -50; i < 700; i += 7) {
		qs.push(Collide.box(i, 500, 6, 6, 0));
		qs.push(Collide.box(i, 520, 6, 6, 0));
		qs.push(Collide.box(i, 500, 6, 6, 45));
	}
	report(agreesOver(collinear, qs) === 0, 'every box on one line', qs.length + ' queries');

	// ONE BOX SPANNING THE WHOLE MAP, both as an obstacle and as a query. Either way it touches more
	// cells than the index will bin, so both overflow paths are exercised.
	const huge = [Collide.box(0, 0, 4e6, 4e6, 0), Collide.box(30, 40, 10, 10, 0)];
	const hq = [Collide.box(0, 0, 5, 5, 0), Collide.box(1e6, 1e6, 5, 5, 0),
		Collide.box(3e6, 3e6, 5, 5, 0), Collide.box(0, 0, 4e6, 4e6, 17)];
	report(agreesOver(huge, hq) === 0, 'one box across the whole map, and a query the same size');

	// AN EMPTY SET. There is nothing to pick a cell size from, and the answer is false.
	report(agreesOver([], [Collide.box(0, 0, 10, 10, 0), Collide.box(9e9, 9e9, 1, 1, 30)]) === 0,
		'an empty obstacle set');

	// THE LIST HOLDING THE QUERY BOX ITSELF. There is no exclusion in this question -- a label is
	// asked about BEFORE it is pushed, never after -- so a box in the list overlaps itself and both
	// sides must say so. That is the assertion, not an exemption.
	const self = Collide.box(100, 100, 20, 10, 0);
	report(agreesOver([self], [self]) === 0 && Collide.anyBoxOverlap(self, [self]),
		'a list holding nothing but the query box: both say it is NOT clear');

	// NON-FINITE COORDINATES. boxOverlapDepth() decides what a NaN box overlaps; the index must not
	// quietly drop one on the way past.
	const nan = [Collide.box(NaN, 0, 10, 10, 0), Collide.box(0, Infinity, 10, 10, 0),
		Collide.box(50, 50, 10, 10, 0)];
	report(agreesOver(nan, [Collide.box(50, 50, 4, 4, 0), Collide.box(NaN, NaN, 4, 4, 0),
		Collide.box(900, 900, 4, 4, 0)]) === 0, 'boxes with non-finite coordinates');

	// AND A FUZZ, because the cases above are the ones we thought of.
	let seed = 12345;
	function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
	let fuzzBad = 0, fuzzQ = 0;
	for (let trial = 0; trial < 40; trial++) {
		const boxes = [];
		for (let i = 0; i < 40; i++) {
			boxes.push(Collide.box(rnd() * 800, rnd() * 800, 4 + rnd() * 120, 4 + rnd() * 40,
				rnd() * 360 - 180));
		}
		const idx = Collide.boxIndex(boxes);
		for (let i = 0; i < 60; i++) {
			const q = Collide.box(rnd() * 900 - 50, rnd() * 900 - 50, 4 + rnd() * 90,
				4 + rnd() * 30, rnd() * 360 - 180);
			fuzzQ++;
			if (idx.anyOverlap(q) !== Collide.anyBoxOverlap(q, boxes)) { fuzzBad++; }
		}
	}
	report(fuzzBad === 0, 'and 2,400 random oriented boxes agree too', fuzzQ + ' queries');
}

// ---- 2. it stays exact while the list mutates ---------------------------------------------------
console.log('\n--- exact under mutation: the answer holds after every single insert ---');
{
	let seed = 777;
	function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
	const boxes = [Collide.box(400, 400, 30, 12, 0)];
	const idx = Collide.boxIndex(boxes);
	let bad = 0, inserts = 0, flipped = 0;
	// A probe that starts CLEAR, so an insert has something to change. One already sitting on a box
	// can only ever answer "not clear" and the flip counter below would be zero for that reason.
	const probe = Collide.box(640, 300, 26, 10, 12);
	let last = idx.anyOverlap(probe);
	for (let i = 0; i < 300; i++) {
		// The insert the pass itself makes: a placed label becoming an obstacle for the next one.
		boxes.push(Collide.box(rnd() * 800, rnd() * 800, 10 + rnd() * 90, 6 + rnd() * 20,
			rnd() * 360 - 180));
		inserts++;
		for (let k = 0; k < 12; k++) {
			const q = Collide.box(rnd() * 800, rnd() * 800, 8 + rnd() * 60, 6 + rnd() * 20,
				rnd() * 360 - 180);
			if (idx.anyOverlap(q) !== Collide.anyBoxOverlap(q, boxes)) { bad++; }
		}
		const now = idx.anyOverlap(probe);
		if (now !== last) { flipped++; }
		last = now;
	}
	report(inserts === 300, 'three hundred boxes arrived one at a time');
	// **WITHOUT THIS THE MUTATION TEST PASSES VACUOUSLY.** If no insert ever changed an answer, the
	// check asserts that an index which ignores every insert agrees with a walk that also saw none.
	report(flipped > 0, '...and at least one insert changed a standing answer',
		flipped + ' flips of the fixed probe');
	report(bad === 0, '...and the index agreed with the walk after every one of them',
		bad + ' disagreements in 3,600 queries');
}

// ---- 3. the placement is unchanged --------------------------------------------------------------
console.log('\n--- the drawing is the same drawing: indexed pass vs walked pass ---');
{
	// **EVERY QUESTION THE REAL PASS ASKS, ANSWERED BOTH WAYS.** This is the strong form of the
	// comparison and the reason the dump below can be trusted: the pass's output is a function of
	// these booleans alone, so if the index and the walk agree on all of them the placement cannot
	// have moved. It also sidesteps the trap in the obvious version -- see below.
	const real = Collide.boxIndex;
	let asked = 0, hits = 0, disagreed = 0;
	Collide.boxIndex = function (boxes) {
		const ix = real(boxes), any = ix.anyOverlap;
		ix.anyOverlap = function (q) {
			const a = any.call(ix, q), b = Collide.anyBoxOverlap(q, boxes);
			asked++;
			if (b) { hits++; }
			if (a !== b) { disagreed++; }
			return a;
		};
		return ix;
	};
	try { allLabelsOn(); L.shedAligned(L.fsNow(), L.fs()); } finally { Collide.boxIndex = real; }
	report(asked > 100, 'the pass asked the question many times', asked + ' boxIsClear() calls');
	report(hits > 10 && hits < asked - 10, '...and the answer went both ways',
		hits + ' of ' + asked + ' found something in the way');
	report(disagreed === 0, 'index and walk agreed on every question the real pass asked',
		disagreed + ' disagreements');
}
{
	// **AND THE WHOLE PASS, DUMPED AND DIFFED, IN A FRESH PROCESS EACH WAY.** A fresh process is not
	// fussiness: THIS PASS CONVERGES ACROSS PASSES. It seeds node labels as obstacles at the
	// positions the last layout actually PLACED them at, so running it a second time in the same
	// process starts from a different drawing -- measured here, two identical walk-backed runs
	// back to back already disagree on one label. Comparing two backends inside one process
	// therefore measures the sequencing, not the backend, and would have reported a defect that
	// is not there.
	const child = require('child_process');
	function dumpFrom(backend) {
		return child.execFileSync(process.execPath, [__filename, '--dump', backend],
			{ encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
	}
	const walked = dumpFrom('walk'), indexed = dumpFrom('index');
	const shed = (walked.match(/shed=[1-9]/g) || []).length;
	const crowded = (walked.match(/crowded=true/g) || []).length;
	report(shed > 50 && crowded > 5, 'the dumped pass really made decisions to compare',
		shed + ' labels shed, ' + crowded + ' hidden');
	report(walked === indexed, 'every placement is byte-identical', walked.length + ' bytes');
	if (walked !== indexed) {
		const a = walked.split('\n'), b = indexed.split('\n');
		for (let i = 0; i < Math.max(a.length, b.length); i++) {
			if (a[i] !== b[i]) {
				console.log('       walk:  ' + a[i] + '\n       index: ' + b[i]);
				break;
			}
		}
	}
}

// ---- 4. the overlap tests are counted -----------------------------------------------------------
console.log('\n--- overlap tests per label do not rise with the drawing ---');
// Counted from INSIDE the index: boxIsClear() reaches boxOverlapDepth() through the module's own
// closure, so wrapping the exported one would see nothing.
function countedIndex(boxes) {
	const ix = countedIndex.real(boxes), any = ix.anyOverlap;
	ix.anyOverlap = function (q) {
		const before = ix.tests, r = any.call(ix, q);
		countedIndex.calls++; countedIndex.tests += ix.tests - before;
		return r;
	};
	return ix;
}
countedIndex.real = Collide.boxIndex;
function passTests() {
	countedIndex.calls = 0; countedIndex.tests = 0;
	const real = Collide.boxIndex;
	Collide.boxIndex = countedIndex;
	try { L.shedAligned(L.fsNow(), L.fs()); } finally { Collide.boxIndex = real; }
	return { calls: countedIndex.calls, tests: countedIndex.tests };
}
allLabelsOn();
const small = passTests();
const bigLinks = growTo(16);
allLabelsOn();
const big = passTests();
const smallRate = small.tests / smallLinks, bigRate = big.tests / bigLinks;
report(bigLinks > smallLinks * 3, 'the second network really is several times the first',
	smallLinks + ' links -> ' + bigLinks + ' links');
console.log(`       ${smallLinks} links: ${small.tests} overlap tests in ${small.calls} boxIsClear() calls (${smallRate.toFixed(1)} per label)`);
console.log(`       ${bigLinks} links: ${big.tests} overlap tests in ${big.calls} boxIsClear() calls (${bigRate.toFixed(1)} per label)`);
// Un-indexed the same two passes cost 25,845 and 412,819 tests, at 231 and 860 per label. The rate
// is what matters: a walk cannot help but rise with the drawing, an index need not.
report(bigRate < smallRate * 1.5, 'the per-label rate did not rise with the drawing',
	smallRate.toFixed(1) + ' -> ' + bigRate.toFixed(1) + ' tests per label');
report(bigRate < 40, '...and it is a small bounded number, not a walk', bigRate.toFixed(1));
report(big.tests * 20 < bigLinks * big.calls,
	'...so the pass is a long way off one walk per question',
	big.tests + ' against the walk order of ' + (bigLinks * big.calls));

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
