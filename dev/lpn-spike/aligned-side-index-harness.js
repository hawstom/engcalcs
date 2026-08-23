// WHICH SIDE OF ITS PIPE A LABEL HANGS ON IS ANSWERED FROM AN INDEX, NOT A WALK (Task 472).
// Run with:
//   node dev/lpn-spike/aligned-side-index-harness.js
//
// WHY THIS EXISTS. alignedSideFor() decides whether an aligned pipe label sits above or below its
// own pipe by asking how close each candidate position comes to some OTHER pipe. It answered that
// by walking every link in the document, and linkPointList() rebuilds a link's point list on every
// call -- so one label cost one pass over the whole drawing, and the layout pass cost 480 x 480 of
// them on the 256-junction grid dev/browser-pass/specs/perf.js is measured against. With the four
// measurement quadratics fixed (Task 440) that was 21% of the self time of opening it, the largest
// remaining item and the only one left that is quadratic in the size of the drawing.
//
// The segments now go into a uniform grid (Geom.buildSegmentIndex) once per layout pass, and each
// query walks outward in rings until the ring is further off than the best distance already found.
//
// **THE DANGER IS A DRAWING THAT IS FASTER AND DIFFERENT.** A label placed on the other side of its
// pipe is a defect, not a saving, so the count is the second thing checked here and not the first:
//
//   1. THE INDEX IS EXACT. alignedSideFor()'s entire behaviour is a comparison of two nearest-pipe
//      distances, so if nearestSegmentDistance() returns what pointToPolylineDistance() over every
//      link returns, the side decision -- and therefore the placement -- cannot have moved. That
//      equivalence is asserted against the unchanged function, on the real geometry of a real
//      network and on geometry chosen to break a grid (a drawing collapsed onto one line, a main
//      spanning the whole map, a query point far outside the drawing).
//   2. THE WALK IS COUNTED, not timed. Every call to linkPointList() during one layout pass is
//      counted on a network and again on one four times the size. The count must grow with the
//      number of LINKS, not with links times labels -- which is the whole claim.
//
// A stub cannot lay anything out, so the millisecond saving is not observable here; the SHAPE is,
// and the shape is what regressed. dev/browser-pass/specs/perf.js carries the timing.

const fs = require('fs');
const stub = require('./lpn-dom-stub.js');
const { ROOT, setUnitSet } = stub;
const Geom = require('../../js/lpn-geom.js').lpnGeom;

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// ---- load the editor with linkPointList() counted -----------------------------------------------
//
// The count has to come from INSIDE the closure: wrapping the exported function would see only the
// harness's own calls, and every call this task is about is one the editor makes to itself. So the
// one function declaration is instrumented in the source text on the way in. loadLoopedNetwork()
// cannot do that for us, so its marker injection is repeated here -- see lpn-dom-stub.js for why
// the eval must be indirect.
const counts = { linkPointList: 0 };
global.__LPN_COUNTS = counts;
function loadCounted(injectSource) {
	let src = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
	const decl = '\tfunction linkPointList(l) {';
	if (src.indexOf(decl) < 0) { throw new Error('linkPointList() declaration not found'); }
	src = src.replace(decl, decl + ' global.__LPN_COUNTS.linkPointList++;');
	const marker = "\tdocument.addEventListener('DOMContentLoaded'";
	if (src.indexOf(marker) < 0) { throw new Error('injection marker not found'); }
	src = src.replace(marker, '\tglobal.__LPN = {\n' + injectSource + '\n\t};\n' + marker);
	(0, eval)(src);
	return global.__LPN;
}

setUnitSet('us');
const L = loadCounted(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, runSolve: runSolve,\n" +
	"\t\trefreshLabelText: refreshLabelText, relayoutLabels: relayoutLabels,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tsettings: function () { return settings; },\n" +
	"\t\tlinkEls: function () { return linkEls; },\n" +
	"\t\tlinkPointList: linkPointList,\n" +
	"\t\tsideFor: alignedSideFor,\n" +
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

// The same grid label-batch-harness.js uses: uneven spacing, so pipes differ in length and the side
// decision has something to decide. One corner is the reservoir.
const SP = 100;
const built = { ids: [] };
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

const smallLinks = growTo(4);
const ls = L.labelSettings();
Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
// ALIGNED LABELS ON, because that is the only mode that asks the question at all.
L.settings().alignPipeLabels = true;
L.refreshLabelText();

// ---- 1. the index answers what the walk answers -------------------------------------------------
//
// Brute force, straight out of the function alignedSideFor() used to be. This is the reference
// implementation and it is deliberately the slow one.
function bruteNearest(px, py, excludeId) {
	let best = Infinity;
	L.getDoc().links.forEach(function (o) {
		if (o.id === excludeId) { return; }
		const d = Geom.pointToPolylineDistance(L.linkPointList(o), px, py);
		if (d < best) { best = d; }
	});
	return best;
}
console.log('\n--- the segment index returns the same distance as walking every pipe ---');
{
	const doc = L.getDoc();
	const idx = Geom.buildSegmentIndex(doc.links.map(function (l) {
		return { key: l.id, pts: L.linkPointList(l) };
	}));
	let probes = 0, worst = 0, worstAt = '';
	// Probe points on and around every pipe: its own mid-point, both sides of it, and points well
	// off the drawing entirely -- a label can be pushed anywhere and the answer must hold there too.
	// Each probe is asked twice, excluding the pipe it belongs to and excluding an unrelated one.
	doc.links.forEach(function (l) {
		const pts = L.linkPointList(l), a = pts[0], b = pts[pts.length - 1],
			mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
		[[mx, my], [mx + 13, my - 21], [mx - 40, my + 5], [mx, my + 250],
			[mx - 3000, my], [mx + 60, my - 4000]].forEach(function (p) {
			[l.id, doc.links[0].id].forEach(function (exId) {
				const want = bruteNearest(p[0], p[1], exId),
					got = Geom.nearestSegmentDistance(idx, p[0], p[1], exId),
					err = (want === Infinity && got === Infinity) ? 0 : Math.abs(want - got);
				probes++;
				if (err > worst) { worst = err; worstAt = exId + ' @ ' + p[0].toFixed(1) + ',' + p[1].toFixed(1); }
			});
		});
	});
	report(probes > 200, 'probed every pipe from six positions', probes + ' probes');
	report(worst === 0, '...and every one is bit-identical to the walk',
		worst === 0 ? '' : 'worst ' + worst + ' at ' + worstAt);
}

console.log('\n--- and on geometry chosen to break a grid ---');
{
	function agrees(entries, queries, label) {
		const idx = Geom.buildSegmentIndex(entries);
		let worst = 0;
		queries.forEach(function (q) {
			let want = Infinity;
			entries.forEach(function (e) {
				if (e.key === q[2]) { return; }
				const d = Geom.pointToPolylineDistance(e.pts, q[0], q[1]);
				if (d < want) { want = d; }
			});
			const got = Geom.nearestSegmentDistance(idx, q[0], q[1], q[2]);
			const err = (want === Infinity && got === Infinity) ? 0 : Math.abs(want - got);
			if (err > worst) { worst = err; }
		});
		report(worst === 0, label, worst === 0 ? queries.length + ' queries' : 'worst ' + worst);
	}
	// A drawing collapsed onto one line: the bounding box has no area, so a cell size cannot be
	// derived from it.
	const flat = [], flatQ = [];
	for (let i = 0; i < 60; i++) { flat.push({ key: 'F' + i, pts: [{ x: i * 10, y: 40 }, { x: i * 10 + 9, y: 40 }] }); }
	for (let i = 0; i < 200; i++) { flatQ.push([i * 3 - 60, (i % 17) - 8, 'F' + (i % 60)]); }
	agrees(flat, flatQ, 'every pipe on one line');
	// A main crossing the whole map among a cluster of short pipes: it belongs to no one cell.
	const span = [{ key: 'MAIN', pts: [{ x: -5000, y: -5000 }, { x: 5000, y: 5000 }] }], spanQ = [];
	for (let i = 0; i < 200; i++) {
		span.push({ key: 'S' + i, pts: [{ x: (i * 37) % 100, y: (i * 53) % 100 }, { x: (i * 71) % 100, y: (i * 29) % 100 }] });
	}
	for (let i = 0; i < 200; i++) { spanQ.push([(i * 13) % 240 - 60, (i * 7) % 240 - 60, 'S' + (i % 200)]); }
	agrees(span, spanQ, 'one main spanning the whole drawing');
	// A bent pipe, so the polyline half of the equivalence is exercised and not just the segment.
	const bent = [], bentQ = [];
	for (let i = 0; i < 40; i++) {
		bent.push({ key: 'B' + i, pts: [{ x: i * 20, y: 0 }, { x: i * 20 + 7, y: 60 }, { x: i * 20 + 25, y: 130 }] });
	}
	for (let i = 0; i < 200; i++) { bentQ.push([(i * 11) % 900 - 40, (i * 23) % 260 - 60, 'B' + (i % 40)]); }
	agrees(bent, bentQ, 'pipes with vertices in them');
	// Nothing to be near: Infinity, exactly as the walk over no other link returned.
	report(Geom.nearestSegmentDistance(Geom.buildSegmentIndex([]), 5, 5, 'x') === Infinity,
		'an empty drawing is Infinity away, as the walk was');
	const lone = Geom.buildSegmentIndex([{ key: 'A', pts: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }]);
	report(Geom.nearestSegmentDistance(lone, 5, 5, 'A') === Infinity,
		'...and so is a drawing holding nothing but the label own pipe');
}

// ---- 2. the walk is gone, counted ---------------------------------------------------------------
console.log('\n--- linkPointList() calls per layout pass grow with the LINKS, not links x labels ---');
function passCalls() {
	counts.linkPointList = 0;
	L.relayoutLabels();
	return counts.linkPointList;
}
const smallCalls = passCalls();
const bigLinks = growTo(8);
L.refreshLabelText();
const bigCalls = passCalls();
report(bigLinks > smallLinks * 3, 'the second network really is several times the first',
	smallLinks + ' links -> ' + bigLinks + ' links');
console.log(`       ${smallLinks} links: ${smallCalls} calls (${(smallCalls / smallLinks).toFixed(1)} per link)`);
console.log(`       ${bigLinks} links: ${bigCalls} calls (${(bigCalls / bigLinks).toFixed(1)} per link)`);
// The pass still calls it a fixed number of times per link for its own geometry -- a link's point
// list is what every placement is computed FROM. What must not come back is a call per link per
// label, which is the shape that made this the largest remaining cost of opening a project.
report(bigCalls < bigLinks * 25, 'a bounded number of calls per link', bigCalls + ' for ' + bigLinks + ' links');
report(bigCalls < smallCalls * (bigLinks / smallLinks) * 1.5,
	'...and the per-link rate did not rise with the drawing',
	(smallCalls / smallLinks).toFixed(1) + ' -> ' + (bigCalls / bigLinks).toFixed(1) + ' per link');
report(bigCalls * 5 < bigLinks * bigLinks, '...and it is a fraction of one walk per label',
	bigCalls + ' against the walk order of ' + (bigLinks * bigLinks));

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
