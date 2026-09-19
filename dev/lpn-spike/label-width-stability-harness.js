// DOES A LABEL STAY WHERE IT IS WHEN ONLY ITS WIDTH CHANGES (ROADMAP Task 539). Run with:
//
//   node dev/lpn-spike/label-width-stability-harness.js
//   node dev/lpn-spike/label-width-stability-harness.js --selftest   (mutations; must go red)
//   node dev/lpn-spike/label-width-stability-harness.js --measure <prefix>
//
// **TOM'S OWN TEST CASE, 2026-09-18, AND IT IS ONE SENTENCE.** Take one drawing, one field (the
// node ID), and change ONLY that field's "Before" text -- `1=`, then `12=`, then `123=`. Nothing
// about the drawing, the zoom or the field set moves; the labels merely get wider. *"I say that
// there is no good reason for a single label of any type to place differently than any other type
// in these images."* He is right that the labels move, and this is the number.
//
// **WHAT IT IS NOT, MEASURED BEFORE ANYTHING WAS CHANGED.** The first diagnosis offered was the
// goal ladder: `distance` is ranked last in GOAL_WEIGHT at 1/64 of `labelLabel`, so proximity
// would never outrank a near-miss with something far away. **That ladder decides nothing here.**
// Node labels are placed by placeLabelsFirstFit(), which has no score at all -- a side is clear or
// it is not -- and the divergence is fully present with the gang repair switched off, before
// anything that scores has run. Replaying the pass from its own captured inputs reproduces it
// exactly (97 of 97 labels) and names a blocker for every change: in every case a REAL box overlap
// with a neighbour's label, nearer than one label width. There is no epsilon noise in it.
//
// **WHAT IT IS: a greedy sequential first-fit, and the cascade.** A label that cannot use any of
// its four corners falls through to the polar raster and commits there, on ground a label placed
// later was going to use from its own doorstep; that label then falls through too. Widen every
// label at once and the first such fall happens somewhere else, and the rest of the drawing follows
// it. So the sensitivity tracks how over-subscribed the view is, which is what part 2 records.
//
// **PART 3 ASSERTS THE SAME PROPERTY THROUGH THE WHOLE PAGE**, because part 1 proves it about the
// placer and his sentence is about the product: a real document, the real refresh, the real shed and
// repair, with a crowded control beside it so the open-ground zero cannot be a measurement that has
// gone blind. Section 16f.
//
// **PART 1 IS THE PROPERTY ITSELF, ON A DRAWING WHERE IT MUST HOLD.** Nodes spaced far apart
// relative to their labels: nothing touches at any width, so every label must choose the same
// candidate at every width. That is the assertion Tom can state in one sentence, and it should have
// existed already. Part 2 is his own drawing, where labels do touch, and is a RATCHET -- the counts
// may FALL and may not RISE.
//
// dev/label-placement-algorithms.md section 16 is the record, including the three candidate fixes
// that were built and measured and all cost drawn labels.

'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

const ROOTJS = path.join(__dirname, '../../js/lpn-collide.js');
// The four widths are Tom's own: one, two, three and four characters of "Before" text ahead of the
// same node ID. Four rather than three because a three-point run cannot tell a step from a trend.
const PREFIXES = ['1=', '12=', '123=', '1234='];
const HEADLINE = 'Net3-Novato-CA-World.lwn';

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// ---- part 1: the property, on ground where nothing touches -----------------------------------
//
// Built straight against js/lpn-collide.js rather than through a document, because the claim is
// about the placer and a document would put the shed, the repair and the renderer between the
// assertion and the thing it is asserting. The geometry is the page's own: cardinalSides() with
// the same resting offset and the same three-offset raster reach nodeFirstFitSpec() uses.
function sparseLayout(Collide, width) {
	const off = { x: 12, y: -12 };        // a resting offset clear of the symbol, as the page's is
	const H = 12;                         // one row of text, in the same units
	// **THREE LABEL WIDTHS APART, NOT THIRTY.** Open ground has to be open and no wider: a fixture
	// spaced so far that nothing could ever reach anything is a fixture no mutation can fail, and a
	// guard nothing can fail is a guard that has already stopped working. At this spacing every
	// label is comfortably clear at all four widths, and a placer that grew its claim with the text
	// would run out of room at the widest.
	const SPACING = 200;
	const labels = [];
	for (let i = 0; i < 12; i++) {
		const anchor = { x: (i % 4) * SPACING, y: Math.floor(i / 4) * SPACING };
		// One pipe arriving from the west, so the open-arc table is not degenerate and the corner
		// pruning has something to do -- the same shape a real junction presents.
		const arcs = Collide.openArcs([180]);
		labels.push({
			id: 'n:' + i, anchor: anchor, home: { x: anchor.x + off.x, y: anchor.y + off.y },
			w: width, h: H, yOff: -H * 0.85, lines: [width], priority: 100 - i,
			sides: Collide.cardinalSides(anchor, off, arcs,
				{ raster: true, outer: Math.hypot(off.x, off.y) * 3 })
		});
	}
	const obstacles = { boxes: labels.map(function (l) {
		return Collide.box(l.anchor.x, l.anchor.y, 8, 8, 0, 'symbol', undefined);
	}), segments: [] };
	return Collide.placeLabelsFirstFit(labels, obstacles, { pad: 2 });
}
function sigOf(placed) {
	return placed.map(function (r) {
		return r.id + '@' + (r.dropped ? 'dropped'
			: r.side + ':' + r.x.toPrecision(12) + ',' + r.y.toPrecision(12));
	}).sort().join(' ');
}
// The WIDTHS a prefix produces, in the same units: one character is about 0.6 of the text height in
// the fonts this page uses, so the four prefixes differ by roughly 7 units on a 12-unit row. The
// exact ratio does not matter -- what matters is that four different widths go in.
function widthFor(prefix) { return 40 + prefix.length * 7; }

function partOne(Collide, quiet) {
	const sigs = PREFIXES.map(function (p) { return sigOf(sparseLayout(Collide, widthFor(p))); });
	const same = sigs.every(function (s) { return s === sigs[0]; });
	if (!quiet) {
		const dropped = sigs[0].split(' ').filter(function (t) { return /dropped/.test(t); }).length;
		report(same, 'open ground: 12 labels choose the same spot at every prefix width',
			same ? PREFIXES.join(' ') + ' all identical, ' + dropped + ' dropped'
				: 'first difference at width ' + PREFIXES[sigs.findIndex(function (s, i) { return i && s !== sigs[0]; })]);
	}
	return same;
}

// ---- part 2: Tom's own drawing, where labels do touch ----------------------------------------
//
// ONE EXAMPLE AND ONE PREFIX PER PROCESS, for label-crossing-measure.js's own reason: a second
// document loaded into a page that already holds one inherits its elements' measured widths.
//
// **THE RATCHET IS A CEILING, NOT AN EQUALITY.** How many labels move is a property of a greedy
// pass over a drawing that is over-subscribed at its wider zooms, so pinning the exact number would
// go red on any placement change that did not make the drawing worse. Measured 2026-09-18 on
// Net3-World with the node ID alone and every repair route on. The zooms are the fit scale and
// three steps in; the count is node labels choosing a different candidate than they did at `1=`.
const CEILING = { '12=': [27, 20, 2, 0], '123=': [44, 25, 4, 2], '1234=': [49, 28, 8, 2] };

function measureChild(prefix) {
	const r = spawnSync(process.execPath, [__filename, '--measure', prefix],
		{ cwd: __dirname, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 600000 });
	const m = /@@JSON@@(.*)/.exec(r.stdout || '');
	if (!m) { return { error: (r.stderr || r.stdout || 'no output').split('\n').slice(-6).join(' ') }; }
	return JSON.parse(m[1]);
}

async function measure(prefix) {
	const Collide = require(ROOTJS).lpnCollide;
	// The FINAL placement of each view, which is the repair's result where it ran and the
	// first-fit's where it did not. Captured the way label-crossing-measure.js captures it: by
	// wrapping the pass, so nothing here recomputes geometry that could drift from the drawing's.
	let lastFF = null, lastRep = null;
	const views = [];
	const realFF = Collide.placeLabelsFirstFit;
	Collide.placeLabelsFirstFit = function (l, o, p) {
		const out = realFF.call(this, l, o, p); lastFF = out; return out;
	};
	const realRep = Collide.repairCrossingGangs;
	Collide.repairCrossingGangs = function (l, pl, o, p) {
		const out = realRep.call(this, l, pl, o, p); lastRep = out.results; return out;
	};
	const realXing = Collide.labelCrossings;
	Collide.labelCrossings = function (p, o) {
		const src = lastRep || lastFF || [], m = {};
		src.forEach(function (e) {
			if (e.id.charAt(0) !== 'n') { return; }
			m[e.id] = e.dropped ? 'dropped' : e.side + ':' + e.x.toPrecision(12) + ',' + e.y.toPrecision(12);
		});
		views.push(m);
		lastFF = null; lastRep = null;
		return realXing.call(this, p, o);
	};
	const { measure: pageMeasure } = require('./label-crossing-measure.js');
	await pageMeasure(HEADLINE, 'all+shed',
		{ passes: 1, fields: { node: ['id'], link: [] }, prefix: { node: { id: prefix } } });
	return views;
}

function partTwo() {
	const got = {};
	let bad = false;
	PREFIXES.forEach(function (p) {
		const r = measureChild(p);
		if (r.error) { report(false, 'measured ' + HEADLINE + ' at "' + p + '"', r.error); bad = true; return; }
		got[p] = r;
	});
	if (bad) { return; }
	const base = got[PREFIXES[0]];
	PREFIXES.slice(1).forEach(function (p) {
		const cur = got[p], cap = CEILING[p];
		const counts = base.map(function (bv, i) {
			let n = 0;
			Object.keys(bv).forEach(function (k) { if (cur[i] && cur[i][k] !== bv[k]) { n++; } });
			return n;
		});
		const over = counts.filter(function (n, i) { return n > (cap[i] === undefined ? 0 : cap[i]); });
		report(!over.length,
			HEADLINE + ' "' + p + '": node labels that move, against the ceiling',
			counts.join('/') + ' moved of ' + Object.keys(base[0]).length
				+ ', ceiling ' + cap.join('/') + ' (zooms x1/x2/x4/x8)');
	});
}

// ---- part 3: the same property, through the WHOLE PAGE ----------------------------------------
//
// **PART 1 PROVES IT ABOUT THE PLACER; THIS PROVES IT ABOUT THE PRODUCT, and they are not the same
// claim.** Part 1 calls placeLabelsFirstFit() directly with hand-built specs, so everything between
// the drawing and the placement is missing: nodeFirstFitSpec()'s candidate set, the value shed,
// the gang repair, the crossing shed, and dataLabelOrigin()'s choice of which side of the endpoint
// the text hangs on. Tom does not drive placeLabelsFirstFit(); he types into the Before box on a
// drawing. So the invariant has to be asserted where he states it.
//
// **THE FIXTURE IS OPEN GROUND AND NO MORE THAN OPEN**, for the reason part 1 gives: nodes are
// spaced about three of the widest label's widths apart, so nothing touches at any affix and a
// placer whose claim grew with its text would run out of room at the widest. The positive control
// below is the same drawing at a quarter of the spacing, where labels genuinely collide -- if that
// does NOT move, the measurement has stopped being able to see movement and the open-ground result
// means nothing.
//
// **BOTH AFFIXES, because his sentence names both**: *"Placement in the open area should be
// identical for ID regardless of length of prefix or suffix."*
// The scale both fixtures are read at: it frames the 400-unit grid with room round it.
const OPEN_SCALE = 700 / (400 * 4);
const AFFIXES = [
	{ tag: 'none', prefix: '', suffix: '' },
	{ tag: 'prefix 1=', prefix: '1=', suffix: '' },
	{ tag: 'prefix 1234=', prefix: '1234=', suffix: '' },
	{ tag: 'suffix =1234', prefix: '', suffix: '=1234' },
	{ tag: 'both', prefix: '1234=', suffix: '=1234' }
];

// A plain XY project: a 4 x 3 grid of junctions chained into one run, plus a reservoir feeding it.
// No solve is needed and none is run -- only the node ID is switched on, so the label is one row of
// text and its width is the only thing the affixes move.
function sparseDoc(spacing) {
	const nodes = [], links = [];
	for (let i = 0; i < 12; i++) {
		nodes.push({ id: 'J' + (i + 1), type: 'junction',
			x: (i % 4) * spacing, y: Math.floor(i / 4) * spacing, elev: 100, _demand: 5 });
	}
	nodes.push({ id: 'R1', type: 'reservoir', x: -spacing, y: 0, head: 200 });
	for (let i = 0; i + 1 < 12; i++) {
		links.push({ id: 'P' + (i + 1), type: 'pipe', from: nodes[i].id, to: nodes[i + 1].id,
			diam: 200, rough: 130, verts: [] });
	}
	links.push({ id: 'P0', type: 'pipe', from: 'R1', to: 'J1', diam: 300, rough: 130, verts: [] });
	return { format: 'hawsedc-lpn', v: 6,
		project: { name: 'open-ground', activeScenario: 'base' },
		scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
		nodes: nodes, links: links, labels: [] };
}

// Where each node's label ended up, AS AN OFFSET FROM ITS OWN NODE -- which is the quantity Tom's
// sentence is about. An absolute position would move with the node and say nothing.
function offsetsAt(L, spacing) {
	const doc = L.getDoc(), nodeEls = L.nodeEls(), out = {};
	doc.nodes.forEach(function (n) {
		const ne = nodeEls[n.id];
		if (!ne) { out[n.id] = 'missing'; return; }
		if (ne.hiddenDropped || ne.hiddenCrossed) { out[n.id] = 'hidden'; return; }
		const at = L.nodeAt(n), end = L.nodeLabelPos(n);
		// Rounded to a thousandth of the node spacing: the assertion is "the same spot", not "the
		// same float", and a spacing-relative tolerance keeps the two fixtures comparable.
		const q = function (v) { return Math.round(v / spacing * 1000) / 1000; };
		out[n.id] = ne.side + ':' + q(end.x - at.x) + ',' + q(end.y - at.y);
	});
	return out;
}

function runDocument(spacing) {
	const fsmod = require('fs');
	const stub = require('./lpn-dom-stub.js');
	const { loadLoopedNetwork, setUnitSet } = stub;
	setUnitSet('us');
	const L = loadLoopedNetwork(
		"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
		"\t\t\tworld = el('g', {}, svg);\n" +
		"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
		"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
		"\t\t\tmodelLayer = el('g', {}, world);\n" +
		"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
		"\t\t\tlabelsLayer = el('g', {}, world);\n" +
		"\t\t\trubberBandEl = el('line', {}, world); },\n" +
		"\t\tapplySaved: applySaved, buildDom: buildDom, noteMapSized: noteMapSized,\n" +
		"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
		"\t\tsetView: function (v) { return applyView(v); },\n" +
		"\t\tgetDoc: function () { return doc; },\n" +
		"\t\trefreshLabelText: refreshLabelText,\n" +
		"\t\tlabelSettings: function () { return labelSettings; },\n" +
		"\t\tsettings: function () { return settings; },\n" +
		"\t\tnodeEls: function () { return nodeEls; },\n" +
		"\t\tnodeAt: nodeAt, nodeLabelPos: nodeLabelPos"
	);
	L.buildLayers();
	L.setCanvas(1400, 900);
	L.applySaved(sparseDoc(spacing));
	L.buildDom();
	L.noteMapSized();
	const ls = L.labelSettings();
	// THE NODE ID ALONE, which is Tom's own test case. Every other field off, so the label is one
	// row and the affix is the only thing that can change its width.
	Object.keys(ls.node).forEach(function (k) { ls.node[k] = (k === 'id'); });
	Object.keys(ls.link).forEach(function (k) { ls.link[k] = false; });
	// **THE SCALE IS FIXED AND THE SPACING VARIES, which is the only way the two fixtures differ at
	// all.** Deriving the scale from the spacing was tried first and is the trap: a label is sized
	// in SCREEN units, so scaling the view with the drawing reproduces the identical picture and the
	// crowded control was byte-for-byte the open one -- a control that varies nothing.
	if (!L.setView({ cx: spacing * 1.5, cy: spacing, s: OPEN_SCALE })) {
		throw new Error('view refused at spacing ' + spacing);
	}
	const seen = [];
	AFFIXES.forEach(function (a) {
		ls.prefix.node.id = a.prefix;
		ls.suffix.node.id = a.suffix;
		L.refreshLabelText();
		seen.push({ tag: a.tag, off: offsetsAt(L, spacing) });
	});
	return seen;
}

function documentChild(spacing) {
	const r = spawnSync(process.execPath, [__filename, '--document', String(spacing)],
		{ cwd: __dirname, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 300000 });
	const m = /@@JSON@@(.*)/.exec(r.stdout || '');
	if (!m) { return { error: (r.stderr || r.stdout || 'no output').split('\n').slice(-8).join(' ') }; }
	return JSON.parse(m[1]);
}

// How many node labels sit somewhere else than they did with no affix at all.
function movedAgainstBase(seen) {
	const base = seen[0].off;
	return seen.slice(1).map(function (s) {
		let n = 0;
		Object.keys(base).forEach(function (k) { if (s.off[k] !== base[k]) { n++; } });
		return { tag: s.tag, moved: n };
	});
}

function partThree() {
	// **ONE DOCUMENT PER PROCESS** -- lpn-dom-stub's own rule, and the reason both fixtures are
	// spawned rather than run here: a second document loaded into a page that already holds one
	// inherits its elements' measured widths.
	const open = documentChild(400);
	if (open.error) { report(false, 'open ground, through the page', open.error); return; }
	const rows = movedAgainstBase(open);
	const total = Object.keys(open[0].off).length;
	const hidden = Object.keys(open[0].off).filter(function (k) {
		return open[0].off[k] === 'hidden' || open[0].off[k] === 'missing';
	}).length;
	const worst = rows.reduce(function (m, r) { return Math.max(m, r.moved); }, 0);
	report(!hidden, 'open ground: every node label is drawn before anything is asserted',
		total - hidden + ' of ' + total + ' drawn');
	report(worst === 0, 'open ground, through the page: the affix does not move a label',
		rows.map(function (r) { return r.tag + ' ' + r.moved; }).join(', ') + ' of ' + total);

	// **THE POSITIVE CONTROL, and it is the whole defence of the result above.** The same drawing at
	// a quarter of the spacing, where the labels genuinely reach each other. If this does NOT move,
	// the measurement has gone blind and the open-ground zero means nothing.
	const tight = documentChild(100);
	if (tight.error) { report(false, 'control: the crowded drawing', tight.error); return; }
	const trows = movedAgainstBase(tight);
	const tworst = trows.reduce(function (m, r) { return Math.max(m, r.moved); }, 0);
	report(tworst > 0, 'control: the same drawing crowded, where the affix DOES move labels',
		trows.map(function (r) { return r.tag + ' ' + r.moved; }).join(', ')
			+ ' of ' + Object.keys(tight[0].off).length);
}

// ---- the selftest: a check that passes by finding nothing is a check that can die -------------
//
// Part 1 passes today, so it is a GUARD and not a repair -- which is exactly the shape that stops
// working silently. So the mutations are made in the SOURCE and required as a separate module, not
// monkeypatched onto the exports: placeLabelsFirstFit() calls labelLineBoxes() and boxesClearOf()
// through the module's own closure, so replacing the exported names changes nothing at all and a
// selftest built that way passes every mutation while asserting nothing. That was measured here
// before it was written this way.
//
// **TWO OF THE THREE ARE CONTROLS AND MUST NOT BE CAUGHT.** A part that fails everything is as
// useless as one that fails nothing, and the distinction this makes is the whole claim: a placement
// may depend on anything it likes EXCEPT the width of the text.
function mutantModule(tag, from, to) {
	const fs = require('fs');
	const os = require('os');
	const src = fs.readFileSync(ROOTJS, 'utf8');
	if (src.indexOf(from) < 0) {
		throw new Error('label-width-stability-harness: the mutation "' + tag + '" no longer matches '
			+ 'js/lpn-collide.js. Re-aim it at the current source -- a mutation that cannot be applied '
			+ 'is a selftest asserting nothing.');
	}
	const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'lpn-mut-')), 'lpn-collide.js');
	fs.writeFileSync(file, src.replace(from, to));
	return require(file).lpnCollide;
}
function selftest() {
	report(partOne(require(ROOTJS).lpnCollide, true), 'selftest: the unmutated placer passes part 1');
	const MUTATIONS = [
		// CAUGHT: the label claims ground that grows faster than its own text, so the two narrow
		// prefixes still fit between the nodes and the two wide ones do not. This is the only way
		// width can reach a placement decision on ground where nothing touches, and it is therefore
		// the whole class part 1 exists to hold.
		[true, 'a claim that grows faster than the text',
			"		var left = c.x >= lbl.anchor.x ? c.x : c.x - lbl.w;\n"
				+ "		return box(left + lbl.w / 2, c.y + lbl.yOff + lbl.h / 2, lbl.w, lbl.h, 0, 'label', lbl.id);",
			"		var mw = lbl.w * lbl.w / 16;\n"
				+ "		var left = c.x >= lbl.anchor.x ? c.x : c.x - mw;\n"
				+ "		return box(left + mw / 2, c.y + lbl.yOff + lbl.h / 2, mw, lbl.h, 0, 'label', lbl.id);"],
		// CONTROL: every candidate moved by the same constant. The drawing changes; the answer to
		// "does it depend on the width" does not.
		[false, 'every candidate endpoint shifted by a constant',
			"			return { x: anchor.x + c.sx * dx, y: anchor.y + c.sy * dy, corner: k, deg: null };",
			"			return { x: anchor.x + c.sx * dx + 3, y: anchor.y + c.sy * dy, corner: k, deg: null };"],
		// CONTROL: nothing blocks anything, so every label takes its first candidate. Width cannot
		// matter, and the part must say so rather than reporting a win.
		[false, 'every side reported clear',
			"	function boxClearOf(b, obs, pad, ownerId) {",
			"	function boxClearOf(b, obs, pad, ownerId) { if (b) { return 'clear'; }"]
	];
	MUTATIONS.forEach(function (m) {
		const still = partOne(mutantModule(m[1], m[2], m[3]), true);
		report(m[0] ? !still : still,
			'selftest: ' + (m[0] ? 'caught -- ' : 'control, not caught -- ') + m[1]);
	});
}

async function main() {
	if (process.argv[2] === '--document') {
		const seen = runDocument(Number(process.argv[3]));
		process.stdout.write('@@JSON@@' + JSON.stringify(seen) + '\n', function () { process.exit(0); });
		return;
	}
	if (process.argv[2] === '--measure') {
		const views = await measure(process.argv[3]);
		process.stdout.write('@@JSON@@' + JSON.stringify(views) + '\n', function () { process.exit(0); });
		return;
	}
	// **THE SELFTEST RUNS BY DEFAULT.** run_harnesses.sh runs each file with no arguments, so a
	// selftest behind a flag is a selftest nothing ever runs -- and this one guards a part that
	// passes by finding nothing, which is the shape that rots silently. It costs three module loads.
	console.log('--- only the label width changes; the placement must not ---');
	partOne(require(ROOTJS).lpnCollide);
	selftest();
	if (process.argv[2] !== '--selftest') { partThree(); partTwo(); }
	console.log(`\n${checks - failures}/${checks} checks passed.`);
	process.exit(failures ? 1 : 0);
}

main().catch(function (e) { console.error(e); process.exit(1); });
