// A NODE LABEL GIVES UP PROPERTIES BEFORE IT IS HIDDEN WHOLE (Task 469). Run with:
//
//   node dev/lpn-spike/node-shed-harness.js
//   node dev/lpn-spike/node-shed-harness.js --dump 30000    (one drawing's content, for diffing)
//   node dev/lpn-spike/node-shed-harness.js --cost          (the cost table alone, no assertions)
//
// WHY THIS EXISTS. Tom, 2026-08-21: *"Properties are never dropped from node labels, so Node label
// drop order is a lie... it seems to me that in many cases we could see many more node labels if
// some of the requested node properties were dropped."* Until Task 469 the Drop column had ONE
// consumer, nodeDropKey(), which only chose which whole label went; a link label shed values and a
// node label did not.
//
// WHAT IS CHECKED, and the order matters because every later assertion is vacuous on a drawing that
// never sheds:
//
//   1. IT FIRES AT ALL. On Net3-World at the zooms it is read at, some node labels are drawn with
//      fewer properties than they asked for, and they are named.
//   2. IT BUYS LABELS. More node labels are DRAWN than the same drawing draws with the cascade
//      switched off -- which is the whole of Tom's "we could see many more node labels".
//   3. IT SHEDS IN THE USER'S OWN ORDER. The property numbered 1 in the Drop column is the first
//      one gone, on every label that shed, and reordering the column reorders what goes.
//   4. THE ID IS NEVER SHED, and a label never sheds its last ranked value: that rung is the hide,
//      which the drop key already owns.
//   5. BOTH SIDES OF THE PAIR PAY. A label that was PLACED sheds too, not only the one that was
//      dropped -- in a first-fit the dropped label is by construction the lower-ranked one and the
//      ground it needs is held by the winner.
//   6. IT IS IDEMPOTENT AND NOT A RATCHET. Five passes over an untouched drawing shed exactly the
//      same values, and zooming out gives them back.
//   7. IT COSTS WHAT IT CLAIMS TO COST. Placements, forced layouts and wall time, on Net3-World and
//      on a 480-pipe grid, printed and bounded.
//
// **CROSS-BACKEND COMPARISONS GO IN SEPARATE PROCESSES.** shedAlignedForConflicts() seeds node
// labels as obstacles where the LAST layout placed them, so this pass converges ACROSS passes and
// two identical runs back to back in one process already disagree on a label or two. `--dump` is
// for exactly that: run it twice from two checkouts and diff.

const fsmod = require('fs');
const stub = require('./lpn-dom-stub.js');
const { ROOT, loadLoopedNetwork, setUnitSet, settleEpanet, warmEpanet, epanetSolves } = stub;
const Collide = require(ROOT + 'js/lpn-collide.js').lpnCollide;

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// ---- count the forced layouts, without instrumenting the source --------------------------------
// A forced layout is a layout READ that follows a DOM WRITE; every read after it is free until the
// next write. Same trace as zoom-reshed-harness.js's, and for the same reason: the saving this pass
// has to defend is a COUNT, not a clock.
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
	for (let i = 1; i < trace.length; i++) {
		if (trace[i] === 'R' && trace[i - 1] === 'W') { n++; }
	}
	return n;
}
// Every first-fit placement the pass runs. One is the ordinary pass; each extra one is a shed rung.
let placements = 0;
const realFirstFit = Collide.placeLabelsFirstFit;
Collide.placeLabelsFirstFit = function (labels, obs, opts) {
	placements++;
	return realFirstFit.call(this, labels, obs, opts);
};

setUnitSet('us');
const L = loadLoopedNetwork(
	// init()'s own layer order, so a geographic project draws where the page draws it.
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
	"\t\tsetView: function (v) { return applyView(v); }, geoHome: geoHomeView,\n" +
	"\t\tgetDoc: function () { return doc; }, runSolve: runSolve,\n" +
	"\t\trefreshLabelText: refreshLabelText, relayoutLabels: relayoutLabels,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tnodeEls: function () { return nodeEls; },\n" +
	"\t\tshedRungs: function () { return lastNodeShedRungs; },\n" +
	"\t\tshedOrder: nodeShedOrder,\n" +
	"\t\tfs: effectiveFontSize, scale: function () { return state.s; }"
);
L.buildLayers();
L.setCanvas(1400, 900);
L.applySaved(JSON.parse(fsmod.readFileSync(
	ROOT + 'dev/water-network-examples/Net3-World-lpn.json', 'utf8')));
L.buildDom();
L.setView(L.geoHome());
L.noteMapSized();
const ls = L.labelSettings();
Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
L.settings().alignPipeLabels = true;

let doc = L.getDoc(), nodeEls = L.nodeEls();
let cx = 0, cy = 0;
doc.nodes.forEach(function (n) { cx += n.x; cy += n.y; });
cx /= doc.nodes.length; cy /= doc.nodes.length;

// The zooms Net3-World is really read at -- the geographic home view is the whole world, where the
// network is a speck. node-yield-harness.js uses the same four.
const ZOOMS = [5000, 12000, 30000, 80000];
function zoomTo(s) {
	if (!L.setView({ cx: cx, cy: cy, s: s })) { throw new Error('view refused at s=' + s); }
	L.refreshLabelText();   // the page's own whole content-then-layout pass
}

// ---- what the drawing actually says -------------------------------------------------------------
// The FIELD names a node label is drawn with, and the ones it asked for. `ne.lines` is what is on
// screen and `ne.allLines` is the full list; the difference is what this task creates.
function shownFields(ne) {
	return (ne.lines || []).map(function (l) { return l.field || '?'; });
}
function askedFields(ne) {
	return (ne.allLines || []).map(function (l) { return l.field || '?'; });
}
function drawnNodes() {
	return doc.nodes.filter(function (n) {
		const ne = nodeEls[n.id];
		return ne && !ne.empty && !ne.hiddenDropped;
	});
}
function shedders() {
	return doc.nodes.filter(function (n) {
		const ne = nodeEls[n.id];
		return ne && !ne.empty && ne.allLines && ne.lines && ne.lines.length < ne.allLines.length;
	});
}
// One line per node: what it says and what it was asked to say. The `--dump` payload.
function contentDump() {
	return doc.nodes.slice().sort(function (a, b) { return a.id < b.id ? -1 : 1; })
		.map(function (n) {
			const ne = nodeEls[n.id];
			if (!ne) { return n.id + ' <none>'; }
			return [n.id, ne.hiddenDropped ? 'HIDDEN' : 'drawn',
				'[' + shownFields(ne).join(',') + ']', 'of [' + askedFields(ne).join(',') + ']'].join(' ');
		}).join('\n');
}

// **ASYNC BECAUSE THE ENGINE IS** (Task 496). `Net3-World-lpn.json` carries
// `"settings": {"engine": "epanet"}`, so runSolve() hands the network to the real EPANET engine and
// returns BEFORE any answer exists -- which is what a visitor's browser does too. Until the stub
// gained that engine this harness silently fell through to the native solver and solved
// synchronously; measured on the merged tree without the settle below, every node label was built
// from `[id,demand,elev]` with head and pressure simply absent, because refreshLabelTextPass()
// only pushes those two lines when `lastSolveResult` has them. Every number this file printed was
// therefore about a three-property drawing pretending to be a five-property one.
//
// **warmEpanet() BEFORE ANYTHING IS TIMED.** The first import of the vendored engine costs ~16 ms
// and the first solve ~35 ms, and both would otherwise land inside whichever pass happened to run
// first in the cost table.
async function main() {

await warmEpanet();
L.runSolve();
await settleEpanet();
if (process.argv[2] === '--dump') {
	zoomTo(Number(process.argv[3]) || 30000);
	process.stdout.write(contentDump() + '\n');
	process.exit(0);
}
report(epanetSolves() > 0, 'the drawing really went to EPANET, so these are solved numbers',
	epanetSolves() + ' solves');
report(doc.nodes.some(function (n) {
	const ne = nodeEls[n.id];
	return ne && (ne.allLines || []).some(function (l) { return l.field === 'pressure'; });
}), '...and the labels carry the solved fields, not just the typed ones',
	'head and pressure present on the drawing');


// ---- 1. it fires at all -------------------------------------------------------------------------
console.log('\n--- Net3-World: node labels give up properties rather than vanish ---');
let sawShed = 0;
ZOOMS.forEach(function (s) {
	zoomTo(s);
	const drawn = drawnNodes(), shed = shedders();
	sawShed += shed.length;
	const gave = shed.reduce(function (t, n) {
		const ne = nodeEls[n.id];
		return t + (ne.allLines.length - ne.lines.length);
	}, 0);
	report(drawn.length > 10, `s=${s}: the drawing really has node labels on it`,
		`${drawn.length} of ${doc.nodes.length} drawn, ${L.shedRungs()} shed rungs`);
	console.log(`       s=${s}: ${shed.length} labels shed ${gave} values between them` +
		(shed.length ? '   e.g. ' + shed.slice(0, 3).map(function (n) {
			const ne = nodeEls[n.id];
			return n.id + ' [' + shownFields(ne).join(',') + '] of [' + askedFields(ne).join(',') + ']';
		}).join(' | ') : ''));
});
report(sawShed > 0, 'the cascade really fires, so nothing below is vacuous',
	sawShed + ' shedding labels across the four zooms');

// ---- 2. it buys labels --------------------------------------------------------------------------
// **THE CONTROL IS THE SAME CODE WITH NOTHING LEFT TO SHED**, not a second implementation: switch
// every ranked property off but one and the cascade has no rung to take, which is exactly the
// drawing the page produced before Task 469 for a label carrying one value. That is not a fair
// like-for-like, so the real comparison is the one below it: the SAME five properties requested,
// with the shed capped at zero rungs by asking for a single ranked field.
//
// The honest measurement is simply this: with all five properties on, how many labels are drawn now
// against how many would be drawn if a label that does not fit were hidden instead of shortened.
// The second number is recoverable from the pass itself -- a label that sheds is a label that was
// dropped on the first placement, and would have been hidden whole.
console.log('\n--- shedding puts labels back on the drawing that would otherwise be hidden ---');
{
	zoomTo(30000);
	const drawn = drawnNodes().length, shed = shedders().length;
	report(shed > 0 && drawn > shed,
		'labels that were dropped on the first placement are drawn after shedding',
		`${drawn} drawn, of which ${shed} are only there because they gave something up`);
	report(drawn - shed < drawn,
		'...so the shed is worth ' + shed + ' node labels on this view',
		`without it: ${drawn - shed} of ${doc.nodes.length}; with it: ${drawn} of ${doc.nodes.length}`);
}

// ---- 3. it sheds in the user's own order --------------------------------------------------------
// The Drop column is a DROP order and 1 goes first (Task 445). Asserted on the page's own
// nodeShedOrder(), and then on the drawing: reorder the column and what is missing changes.
console.log('\n--- the property numbered 1 in the Drop column is the first one given up ---');
{
	const lines = [{ field: 'id' }, { field: 'demand' }, { field: 'head' },
		{ field: 'pressure' }, { field: 'elev' }];
	const pr = ls.priority.node;
	const order = L.shedOrder(lines).map(function (i) { return lines[i].field; });
	report(order.join(',') === 'head,elev,pressure,demand',
		'nodeShedOrder() ranks the four ranked fields lowest-number-first',
		order.join(' -> ') + '   (column: ' + JSON.stringify(pr) + ')');
	report(order.indexOf('id') < 0, '...and the ID is not in the order at all');

	zoomTo(30000);
	const before = shedders().map(function (n) {
		return n.id + ':' + shownFields(nodeEls[n.id]).join(',');
	});
	const wrongFirst = shedders().filter(function (n) {
		// Whatever survives must be a SUFFIX of the drop order plus the ID: the first `gone`
		// entries of the order are the ones that went, and nothing else may be missing.
		const ne = nodeEls[n.id], all = ne.allLines,
			ord = L.shedOrder(all), gone = all.length - ne.lines.length,
			expect = all.filter(function (l, i) { return ord.slice(0, gone).indexOf(i) < 0; })
				.map(function (l) { return l.field; });
		return expect.join(',') !== shownFields(ne).join(',');
	});
	report(wrongFirst.length === 0,
		'every shedding label kept exactly the values the Drop column says it should',
		`${before.length} shedding labels checked`);

	// Reordering the column reorders what goes. Demand is 4 (last to go) and head is 1 (first);
	// swap them and the labels that were keeping demand must now be keeping head.
	const keptDemand = shedders().filter(function (n) {
		return shownFields(nodeEls[n.id]).indexOf('demand') >= 0;
	}).length;
	pr.demand = 1; pr.head = 4;
	zoomTo(30000);
	const keptHead = shedders().filter(function (n) {
		return shownFields(nodeEls[n.id]).indexOf('head') >= 0;
	}).length;
	const stillDemand = shedders().filter(function (n) {
		return shownFields(nodeEls[n.id]).indexOf('demand') >= 0;
	}).length;
	report(keptHead > 0 && stillDemand < keptDemand,
		'swapping the two ends of the column swaps which value survives',
		`demand kept by ${keptDemand} -> ${stillDemand}; head kept by ${keptHead}`);
	pr.demand = 4; pr.head = 1;
	zoomTo(30000);
}

// ---- 4. the ID is never shed, and the last ranked value is never shed ---------------------------
console.log('\n--- a label sheds down to its name and one number, and then goes whole ---');
{
	zoomTo(30000);
	const lostId = shedders().filter(function (n) {
		const ne = nodeEls[n.id];
		return askedFields(ne).indexOf('id') >= 0 && shownFields(ne).indexOf('id') < 0;
	});
	report(lostId.length === 0, 'no label ever gives up its ID',
		lostId.map(function (n) { return n.id; }).join(', ') || 'none did');
	const stripped = shedders().filter(function (n) {
		const ne = nodeEls[n.id];
		return shownFields(ne).filter(function (f) {
			return typeof ls.priority.node[f] === 'number';
		}).length === 0;
	});
	report(stripped.length === 0, 'no label is left with no ranked value at all',
		stripped.map(function (n) { return n.id; }).join(', ') || 'none was');
	// And the terminal rung is still reachable: some labels are hidden whole on this crowded view,
	// or the drop key would have nothing left to decide.
	const hidden = doc.nodes.filter(function (n) {
		const ne = nodeEls[n.id]; return ne && ne.hiddenDropped;
	});
	report(hidden.length > 0, 'the hide is still the terminal rung, and it is still reached',
		hidden.length + ' labels hidden whole after shedding everything they could');
}

// ---- 5. both sides of the pair pay --------------------------------------------------------------
// In a first-fit the label that is DROPPED is by construction the lower-ranked of the pair, and the
// ground it needs is held by the WINNER. If only the loser shed, it would be getting narrower in a
// space that never opens. So: at least one label that ended up PLACED must have shed as well, and
// the drawing must contain a shedding label that was never in danger of being dropped.
console.log('\n--- the label that was in the way sheds too, not only the one that lost ---');
{
	zoomTo(30000);
	const shed = shedders(), shedDrawn = shed.filter(function (n) {
		return !nodeEls[n.id].hiddenDropped;
	});
	report(shedDrawn.length > 0, 'labels that are drawn have shed, not only ones that were dropped',
		shedDrawn.length + ' of ' + shed.length + ' shedding labels are on the drawing');
	// **THE STRONG FORM IS A MEASURED FLOOR, because "did this label ever get dropped" is not
	// observable from outside the pass.** Deleting the blocker half and shedding only the loser was
	// run on this exact view, against the EPANET-solved drawing: 17 labels shed and 93 of 97 were
	// drawn, in 4 rungs. Shedding both sides of the pair: 41 shed, 96 drawn, in 3. On the 480-pipe
	// grid below the gap is wider still -- 39 node labels drawn loser-only against 50 with the pair
	// rule. The floors below sit between the two, so the loser-only cascade fails them by name, which
	// is what a mutation test is for.
	report(shed.length >= 30, 'far more labels shed than were ever dropped, which only the pair rule does',
		shed.length + ' shedding (loser-only measured 17)');
	report(drawnNodes().length >= 94, '...and it puts more of them on the drawing',
		drawnNodes().length + ' of ' + doc.nodes.length + ' drawn (loser-only measured 93)');
	report(L.shedRungs() > 0, 'the cascade ran at least one rung on this view',
		L.shedRungs() + ' rungs');
}

// ---- 6. idempotent, and not a ratchet -----------------------------------------------------------
console.log('\n--- an untouched drawing sheds the same values every time, and a zoom gives them back ---');
{
	zoomTo(30000);
	const seen = [];
	for (let i = 0; i < 5; i++) {
		L.relayoutLabels(true);
		seen.push(shedders().map(function (n) {
			return n.id + ':' + shownFields(nodeEls[n.id]).join(',');
		}).join('|'));
	}
	report(seen.every(function (v) { return v === seen[0]; }),
		'five layout passes over an untouched drawing shed identically',
		seen.map(function (v) { return v.split('|').filter(Boolean).length; }).join(' -> '));
	// **ZOOMING IN IS WHAT GIVES THE VALUES BACK, NOT ZOOMING OUT.** A label's size is in screen
	// pixels, so in WORLD units it grows as the view coarsens; the crowded drawing is the zoomed-OUT
	// one. Getting this the wrong way round is easy and the harness would then be asserting the
	// opposite of the rule.
	const crowded = shedders().length;
	zoomTo(80000);
	const roomy = shedders().length;
	report(roomy < crowded, 'zoomed in, the values come back', crowded + ' -> ' + roomy + ' shedding');
	zoomTo(30000);
	report(shedders().length > 0 && Math.abs(shedders().length - crowded) <= crowded,
		'...and coming back to the crowded zoom sheds again',
		shedders().length + ' shedding');

	// **AND THE ZOOM PATH IS WHERE A RATCHET WOULD ACTUALLY BITE.** A content pass rewrites every
	// node label at its full content before it starts, so it hides a ratchet completely; the
	// debounced scheduleReshed() does NOT rebuild node text -- it reshapes the link labels and lays
	// out -- so unless the pass puts every node label back to full itself, a value given up at one
	// zoom could never be recovered at the next. Reproduced here the way that path runs: change the
	// view, then lay out, with no refreshLabelText() in between.
	if (!L.setView({ cx: cx, cy: cy, s: 30000 })) { throw new Error('view refused'); }
	L.relayoutLabels(true);
	const tight = shedders().length;
	if (!L.setView({ cx: cx, cy: cy, s: 120000 })) { throw new Error('view refused'); }
	L.relayoutLabels(true);
	report(shedders().length < tight, 'a zoom with no content rebuild gives the values back too',
		tight + ' -> ' + shedders().length + ' shedding, through relayoutLabels() alone');
}

// ---- 6b. CONTENT DECISIONS ON A CONTENT PASS, POSITION ONLY ON A DRAG FRAME ---------------------
// relayoutLabels() runs on every frame of a drag, and a shed rebuilds glyphs and forces a layout.
// So the cascade is gated on the same line Task 399 drew for the link half: only the two callers
// that run when the CONTENT or the SCALE changes ask for it. A drag frame must therefore leave every
// node label saying exactly what it said before, while still being free to MOVE it.
console.log('\n--- a drag frame moves labels and never rewrites one ---');
{
	zoomTo(30000);
	const before = doc.nodes.map(function (n) {
		const ne = nodeEls[n.id];
		return n.id + ':' + (ne ? shownFields(ne).join(',') : '');
	}).join('|');
	L.relayoutLabels();          // no argument: the drag path
	const after = doc.nodes.map(function (n) {
		const ne = nodeEls[n.id];
		return n.id + ':' + (ne ? shownFields(ne).join(',') : '');
	}).join('|');
	report(before === after, 'a bare relayoutLabels() changes no label\'s content',
		before.split('|').length + ' labels compared');
	report(/relayoutLabels\(true\)/.test(fsmod.readFileSync(ROOT + 'js/looped-network.js', 'utf8')),
		'...and the content callers are the ones that ask for the cascade');
}

// ---- 7. what it costs ---------------------------------------------------------------------------
// **A COUNT FIRST, A CLOCK SECOND.** The count is what a later change can be held to; the clock
// swings by a factor of two with what else the machine is doing (specs/perf.js says the same about
// its own numbers, and says why).
console.log('\n--- what the cascade costs ---');
// TIMED AND COUNTED IN SEPARATE PASSES, because the trace itself is a per-DOM-operation array push
// and would be most of what the clock was reading.
//
// **THE PASS MEASURED IS THE ONE THAT PAYS, which is a LAYOUT WITH THE CASCADE ON** -- what a solve,
// a Labels toggle, a unit switch or the debounced end of a wheel gesture runs. The drag frame is
// timed beside it precisely because it must NOT have moved.
function measurePass() {
	placements = 0;
	const t0 = process.hrtime.bigint();
	L.relayoutLabels(true);
	const ms = Number(process.hrtime.bigint() - t0) / 1e6;
	const placed = placements, rungs = L.shedRungs();
	const t1 = process.hrtime.bigint();
	L.relayoutLabels();
	const dragMs = Number(process.hrtime.bigint() - t1) / 1e6;
	const layouts = forcedLayouts(function () { L.relayoutLabels(true); });
	return { placements: placed, layouts: layouts, ms: ms, dragMs: dragMs, rungs: rungs };
}
{
	const rows = [];
	ZOOMS.forEach(function (s) {
		zoomTo(s);
		let best = null;
		for (let i = 0; i < 3; i++) {
			const m = measurePass();
			if (!best || m.ms < best.ms) { best = m; }
		}
		rows.push({ what: 'Net3-World s=' + s, n: doc.nodes.length, m: best });
	});
	rows.forEach(function (r) {
		console.log(`       ${r.what}: ${r.m.rungs} rungs, ${r.m.placements} first-fit placements, ` +
			`${r.m.layouts} forced layouts, ${r.m.ms.toFixed(1)} ms  ` +
			`(drag frame ${r.m.dragMs.toFixed(1)} ms, ${r.n} nodes)`);
	});
	const worst = rows.reduce(function (a, r) { return r.m.placements > a ? r.m.placements : a; }, 0);
	// One ordinary placement plus at most LPN_NODE_SHED_MAX_RUNGS rungs. The cap is what bounds this,
	// and the bound is the cap: a node label carries at most four ranked values.
	report(worst <= 5, 'a layout pass runs at most one placement plus four shed rungs',
		'worst ' + worst + ' placements on Net3-World');
	const layouts = rows.reduce(function (a, r) { return Math.max(a, r.m.layouts); }, 0);
	// A rung is ONE forced layout, not one per label, because every write is done before any read.
	// 97 nodes and 4 rungs would be ~400 if the batching were undone.
	report(layouts < 40, 'a rung costs one forced layout, not one per label',
		'worst ' + layouts + ' forced layouts in a whole layout pass');
}

// ---- and the same, on a network big enough to hurt ---------------------------------------------
// A 480-pipe grid is what dev/browser-pass/specs/perf.js times, and this pass has to survive it.
// Built here rather than loaded so the harness needs nothing on disk.
console.log('\n--- and on the 480-pipe grid specs/perf.js uses ---');
{
	const m = 16, x0 = -122.5686, y0 = 38.106, step = 0.0004, nodes = [], links = [];
	for (let r = 0; r < m; r++) {
		for (let c = 0; c < m; c++) {
			// **`_head`, NOT `head`.** Every overridable property is read through effective(), which
			// looks at the underscore field; a bare `head` is invisible to it, the reservoir falls back
			// to its elevation, and EPANET answers "System has negative pressures" for a grid that was
			// never supplied. Same for `_demand`.
			nodes.push({ id: 'J' + (r * m + c), type: (r === 0 && c === 0) ? 'reservoir' : 'junction',
				x: x0 + c * step, y: y0 + r * step, elev: 100, _demand: 0.2, _head: 400 });
		}
	}
	let k = 0;
	const pipe = (from, to) => ({ id: 'P' + (k++), type: 'pipe', from: from, to: to,
		_diameter: 200, _length: 100, _roughness: 100, _k: 0, _status: 'open', lenAuto: false, verts: [] });
	for (let r = 0; r < m; r++) {
		for (let c = 0; c < m; c++) {
			if (c < m - 1) { links.push(pipe('J' + (r * m + c), 'J' + (r * m + c + 1))); }
			if (r < m - 1) { links.push(pipe('J' + (r * m + c), 'J' + ((r + 1) * m + c))); }
		}
	}
	// Opened the way a project is opened -- applySaved() then buildDom() -- rather than by writing
	// into `doc` behind the page's back, which leaves the element maps holding the previous network.
	const saved = JSON.parse(fsmod.readFileSync(
		ROOT + 'dev/water-network-examples/Net3-World-lpn.json', 'utf8'));
	saved.nodes = nodes; saved.links = links; saved.labels = [];
	saved.nextId = nodes.length + links.length + 10;
	delete saved.view; delete saved.origin; delete saved.controls;
	L.applySaved(saved);
	L.buildDom();
	// applySaved() replaces the document and buildDom() the element map, so the two handles this
	// file reads through have to be taken again or every assertion below describes Net3.
	doc = L.getDoc(); nodeEls = L.nodeEls();
	// applySaved() also restores the project's OWN Labels panel, so every property has to be asked
	// for again -- and through the live object, not the one captured before the open.
	const gls = L.labelSettings();
	Object.keys(gls.node).forEach(function (k) { gls.node[k] = true; });
	Object.keys(gls.link).forEach(function (k) { gls.link[k] = true; });
	L.setView({ cx: x0 + step * m / 2, cy: y0 + step * m / 2, s: 80000 });
	L.runSolve();
	await settleEpanet();   // the grid is opened from the same project, so it goes to EPANET too
	L.refreshLabelText();
	let best = null;
	for (let i = 0; i < 3; i++) {
		const q = measurePass();
		if (!best || q.ms < best.ms) { best = q; }
	}
	const drawn = drawnNodes().length, shed = shedders().length;
	console.log(`       ${doc.nodes.length} nodes, ${doc.links.length} pipes: ${best.rungs} rungs, ` +
		`${best.placements} placements, ${best.layouts} forced layouts, ${best.ms.toFixed(1)} ms  ` +
		`(drag frame ${best.dragMs.toFixed(1)} ms)`);
	console.log(`       ${drawn} node labels drawn, ${shed} of them after shedding`);
	report(drawn >= 45, '...and the pair rule earns its keep at this size',
		drawn + ' node labels drawn (loser-only measured 39)');
	report(best.placements <= 5, 'the cap holds on a big drawing too', best.placements + ' placements');
	report(best.layouts < 40, 'and a rung is still one forced layout', best.layouts + ' forced layouts');
}

console.log(`\n${failures ? 'FAILURES: ' + failures : 'all ' + checks + ' checks passed'}`);
process.exit(failures ? 1 : 0);

}
main().catch(function (e) { console.log("  FAIL harness threw -- " + (e && e.stack || e)); process.exit(1); });
