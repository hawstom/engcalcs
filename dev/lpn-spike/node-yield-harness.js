// A NODE LABEL AND THE PIPE LABEL IT OUTRANKS ARE NEVER DRAWN ON TOP OF EACH OTHER (Task 469).
// Run with:
//   node dev/lpn-spike/node-yield-harness.js
//   node dev/lpn-spike/node-yield-harness.js --dump 12000     (one placement dump, for diffing)
//
// WHY THIS EXISTS. Tom, 2026-08-23, on a geographic Net3 at a working zoom: a node's stacked
// readout printed straight through a `Q=` rotated along its own pipe, circled twice on one
// screenshot. Both participants were in the obstacle set and the rotated one was rotated -- the
// collision was DELIBERATE. boxClearOf()'s middle answer lets a node label take a position held
// only by link labels (Tom, 2026-08-17: "the node is supposed to have preference"), and nothing
// then made the link label leave the ground it had just given up. `yields` granted; the yielder
// stayed. The signature of a rule only one side obeys is on the numbers: measured here, 60 node
// label rows overprinting an aligned pipe label at 12,000 px per degree, up to 28 px deep, and
// ZERO node-on-node and ZERO pipe-on-pipe on the same drawing.
//
// WHAT IS CHECKED, and the order matters because assertion 1 passes vacuously on an empty drawing:
//
//   1. THE DRAWING IS REALLY THERE -- node labels drawn, aligned pipe labels drawn, at five zooms
//      over Net3-World, the geographic network Tom's screenshot came from.
//   2. NOTHING OVERPRINTS. Every drawn node label row against every drawn aligned pipe label box,
//      at the rotation each is really drawn at. Zero, at every zoom.
//   3. THE YIELD REALLY FIRED. Some pipe labels are gone and they are named -- otherwise 2 is
//      satisfied by a drawing that never had a conflict.
//   4. THE NODE DID NOT PAY FOR IT. The node labels' own placements are byte-identical to what
//      they were before the yield ran, which is the ruling: a node label is never dropped for a
//      link label. Asserted by clearing every flag and running the pass again.
//   5. IT IS STABLE. Five passes over an untouched drawing hide exactly the same labels. A yielded
//      label keeps its reservation for this reason -- see yieldStationedLabels()'s own note.
//   6. IT IS NOT A RATCHET. Zoom out and labels come back; a flag that only ever went true would
//      take labels off the drawing permanently with nothing on screen saying why.
//   7. A CHAIN YIELDS WHOLE. A repeated label is the same name said again; one station missing
//      from the middle of it reads as a different label (dev/label-placement-goals.md §3.5).
//
// The boxes here are rebuilt from the page's OWN stationedLabelBox() and the page's own node label
// position, width and row widths -- this harness measures where the page draws things, it does not
// re-derive them.

const fsmod = require('fs');
const stub = require('./lpn-dom-stub.js');
const { ROOT, loadLoopedNetwork, setUnitSet } = stub;
const Collide = require(ROOT + 'js/lpn-collide.js').lpnCollide;

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

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
	"\t\tlinkEls: function () { return linkEls; }, nodeEls: function () { return nodeEls; },\n" +
	"\t\tfs: effectiveFontSize,\n" +
	"\t\tstationedLabelBox: stationedLabelBox,\n" +
	"\t\tstations: linkLabelStations, drawnStations: drawnLinkLabelStations,\n" +
	"\t\taligned: linkLabelAligned,\n" +
	"\t\tnodeLabelPos: nodeLabelPos, labelBoxWidth: labelBoxWidth,\n" +
	"\t\trowWidths: labelRowWidths, boxH: dataLabelBoxHeight,\n" +
	"\t\tscale: function () { return state.s; }"
);
L.buildLayers();
L.setCanvas(1400, 900);
L.applySaved(JSON.parse(fsmod.readFileSync(
	ROOT + 'dev/water-network-examples/Net3-World-lpn.json', 'utf8')));
L.buildDom();
L.setView(L.geoHome());
L.noteMapSized();
L.runSolve();
const ls = L.labelSettings();
Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
// The pass this task is about only looks at labels BOUND to their pipe.
L.settings().alignPipeLabels = true;

const doc = L.getDoc(), linkEls = L.linkEls(), nodeEls = L.nodeEls();
let cx = 0, cy = 0;
doc.nodes.forEach(function (n) { cx += n.x; cy += n.y; });
cx /= doc.nodes.length; cy /= doc.nodes.length;

// A scale in px per degree of longitude. The geographic home view is the whole world, where the
// network is a speck and every label is hidden as too short for its own pipe; these are the zooms a
// person actually reads Net3-World at, and 12,000 is about where Tom's screenshot sits.
const ZOOMS = [5000, 12000, 30000, 80000];
function zoomTo(s) {
	if (!L.setView({ cx: cx, cy: cy, s: s })) { throw new Error('view refused at s=' + s); }
	L.refreshLabelText();   // ends in shedAlignedForConflicts() + relayoutLabels(), as the page does
}

// ---- where the page really draws things --------------------------------------------------------
//
// A node label's rows, hung off its placed endpoint on the side dataLabelOrigin() hangs them --
// which is Collide.labelBoxAtEnd()'s rule and must not be second-guessed here: building the box
// always to the right tests against ground nothing occupies.
function nodeRowBoxes() {
	const fs = L.fs(), out = [];
	doc.nodes.forEach(function (n) {
		const ne = nodeEls[n.id];
		if (!ne || ne.empty || ne.hiddenDropped) { return; }
		const at = L.nodeLabelPos(n), w = L.labelBoxWidth(ne), h = L.boxH(ne.lineCount),
			rows = L.rowWidths(ne), toRight = at.x >= n.x, top = at.y - fs * 0.85,
			nRows = (rows && rows.length) || 0;
		if (nRows < 2) {
			out.push({ id: n.id, box: Collide.boxFromRect({ x: toRight ? at.x : at.x - w, y: top, w: w, h: h }) });
			return;
		}
		const lh = h / nRows;
		for (let i = 0; i < nRows; i++) {
			const rw = rows[i] > 0 ? rows[i] : 0;
			if (!rw) { continue; }
			out.push({ id: n.id + '#' + i,
				box: Collide.boxFromRect({ x: toRight ? at.x : at.x - rw, y: top + lh * i, w: rw, h: lh }) });
		}
	});
	return out;
}
// Every station of every aligned link label that is actually on screen, at the rotation and on the
// side layoutLinkLabelAt() really draws it -- stationedLabelBox() is the page's own.
function alignedLinkBoxes() {
	const fs = L.fs(), out = [];
	doc.links.forEach(function (l) {
		const le = linkEls[l.id];
		if (!le || le.empty || le.hiddenShort || le.hiddenCrowded || le.hiddenYielded) { return; }
		if (!L.aligned(l)) { return; }
		const w = L.labelBoxWidth(le), h = L.boxH(le.lineCount), full = L.stations(l),
			lone = full.length === 1,
			stations = lone ? [le.alignedAlong === undefined ? 0.5 : le.alignedAlong] : L.drawnStations(l),
			sides = le.stationSides || [];
		stations.forEach(function (st, i) {
			out.push({ id: l.id, at: i,
				box: L.stationedLabelBox(l, le, st, w, h, fs, lone ? le.forceSide : sides[i]) });
		});
	});
	return out;
}
// A REAL overlap in PIXELS, not in world units: at 12,000 px per degree a "0.002" deep overlap is
// most of a line of text, and a world-unit tolerance would read it as nothing.
function overprints() {
	const nb = nodeRowBoxes(), lb = alignedLinkBoxes(), s = L.scale(), hits = [];
	nb.forEach(function (n) {
		lb.forEach(function (l) {
			const d = Collide.boxOverlapDepth(n.box, l.box) * s;
			if (d > 0.5) { hits.push(n.id + ' over ' + l.id + '@' + l.at + ' ' + d.toFixed(1) + 'px'); }
		});
	});
	return { nodes: nb, links: lb, hits: hits };
}
function yieldedIds() {
	return doc.links.filter(function (l) {
		const le = linkEls[l.id];
		return le && le.hiddenYielded;
	}).map(function (l) { return l.id; }).sort();
}
// Every decision the placement pass makes about every NODE label. This is what must not change:
// the whole point of the ruling is that the node keeps its place and the link gives one up.
function nodeDump() {
	return doc.nodes.slice().sort(function (a, b) { return a.id < b.id ? -1 : 1; })
		.map(function (n) {
			const ne = nodeEls[n.id];
			if (!ne) { return n.id + ' <none>'; }
			return [n.id, 'nudge=' + JSON.stringify(ne.nudge || null), 'dropped=' + !!ne.hiddenDropped,
				'side=' + ne.placedSide, 'x=' + (ne.text && ne.text.getAttribute('x')),
				'y=' + (ne.text && ne.text.getAttribute('y'))].join(' ');
		}).join('\n');
}
// `--dump <zoom>`: the placement of every label at one zoom, for diffing two code states from two
// separate processes. shedAlignedForConflicts() converges ACROSS passes -- it seeds node labels
// where the last layout put them -- so two runs in ONE process already disagree (Task 436).
if (process.argv[2] === '--dump') {
	zoomTo(Number(process.argv[3]) || 12000);
	const o = overprints();
	process.stdout.write(nodeDump() + '\n--- yielded ---\n' + yieldedIds().join('\n') +
		'\n--- overprints ---\n' + o.hits.join('\n') + '\n');
	process.exit(0);
}

// ---- 1 & 2 & 3. the drawing is there, nothing overprints, and the yield really fired ------------
console.log('\n--- Net3-World: a node label never prints through the pipe label it outranks ---');
let sawYield = 0, sawLinks = 0;
ZOOMS.forEach(function (s) {
	zoomTo(s);
	const o = overprints(), y = yieldedIds();
	sawYield += y.length;
	sawLinks += o.links.length;
	report(o.nodes.length > 10 && o.links.length > 0,
		`s=${s}: the drawing has both kinds of label on it`,
		`${o.nodes.length} node rows, ${o.links.length} aligned pipe labels drawn`);
	report(o.hits.length === 0, `s=${s}: no node label row overprints an aligned pipe label`,
		o.hits.length ? o.hits.slice(0, 6).join(' | ') : '0 overprints');
});
report(sawYield > 0, 'the yield really fires on this drawing, so the check above is not vacuous',
	sawYield + ' pipe labels given up across the five zooms');
report(sawLinks > 100, '...and it is not clearing the drawing to do it',
	sawLinks + ' aligned pipe labels still drawn across the five zooms');

// ---- 4. THE NODE DID NOT PAY FOR IT ------------------------------------------------------------
// The ruling is "a node label is never dropped for a link label". So the yield must be a pure
// consequence of the placement and never an input to it: clear every flag, run the pass again, and
// the node half of the drawing must come back byte-identical.
console.log('\n--- the node labels are placed exactly as they were before anything yielded ---');
zoomTo(12000);
{
	const before = nodeDump(), yBefore = yieldedIds();
	doc.links.forEach(function (l) { const le = linkEls[l.id]; if (le) { le.hiddenYielded = false; } });
	L.relayoutLabels();
	report(nodeDump() === before, 'every node label keeps its side, its nudge and its place',
		yBefore.length + ' labels had yielded to them');
	report(yieldedIds().join(',') === yBefore.join(','),
		'...and the same pipe labels yield again from a cleared state',
		yBefore.join(', ') || '(none)');
	const dropped = doc.nodes.filter(function (n) {
		const ne = nodeEls[n.id]; return ne && ne.hiddenDropped;
	}).length;
	report(dropped < doc.nodes.length,
		'...and node labels are still being drawn, not dropped wholesale',
		(doc.nodes.length - dropped) + ' of ' + doc.nodes.length + ' node labels placed');
}

// ---- 5. IT IS STABLE ---------------------------------------------------------------------------
console.log('\n--- an untouched drawing hides the same labels every time ---');
{
	const seen = [];
	for (let i = 0; i < 5; i++) { L.relayoutLabels(); seen.push(yieldedIds().join(',')); }
	report(seen.every(function (v) { return v === seen[0]; }),
		'five passes over an untouched drawing yield the same labels',
		seen.map(function (v) { return v.split(',').filter(Boolean).length; }).join(' -> '));
	report(overprints().hits.length === 0, '...and none of them overprints after any of the passes');
}

// ---- 6. IT IS NOT A RATCHET --------------------------------------------------------------------
// A flag that only ever goes true takes labels off the drawing permanently and nothing on screen
// says why. **The set is compared by SIZE and by membership at one zoom, never for equality across
// a zoom round trip:** shedAlignedForConflicts() seeds node labels where the LAST layout put them
// and so converges across passes (Task 436), which makes an exact set the same distance either side
// of a zoom a thing this pass never promised.
console.log('\n--- a label given up for one crowded moment comes back ---');
{
	zoomTo(12000);
	const crowded = yieldedIds();
	report(crowded.length > 0, 'the crowded zoom really gave some up', crowded.join(', '));
	zoomTo(5000);
	const roomy = yieldedIds();
	report(roomy.length < crowded.length, 'zoomed out, most of them are back',
		crowded.length + ' -> ' + roomy.length + ' given up');
	report(crowded.some(function (id) { return roomy.indexOf(id) < 0; }),
		'...and the ones that came back are named, so this is a release and not a reshuffle',
		crowded.filter(function (id) { return roomy.indexOf(id) < 0; }).join(', '));
	zoomTo(12000);
	report(overprints().hits.length === 0 && yieldedIds().length > 0,
		'...and coming back to the crowded zoom is crowded again, with nothing overprinting',
		yieldedIds().length + ' given up');
}

// ---- 7. A CHAIN YIELDS WHOLE -------------------------------------------------------------------
console.log('\n--- a repeated label is the same name said again, so it goes as one ---');
{
	zoomTo(80000);
	const chains = doc.links.filter(function (l) {
		const le = linkEls[l.id];
		return le && le.hiddenYielded && L.stations(l).length > 1;
	});
	const drawn = alignedLinkBoxes();
	const partial = chains.filter(function (l) {
		return drawn.some(function (b) { return b.id === l.id; });
	});
	report(partial.length === 0, 'no chain is drawn at some stations and missing at others',
		chains.length + ' repeated labels yielded, ' + partial.length + ' of them partially drawn');
}

console.log(`\n${failures ? 'FAILURES: ' + failures : 'all ' + checks + ' checks passed'}`);
process.exit(failures ? 1 : 0);
