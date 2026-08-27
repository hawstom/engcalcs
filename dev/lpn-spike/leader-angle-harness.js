// THE LEADER ANGLE IS SACRED -- ROADMAP Task 328. Run with:
//   node dev/lpn-spike/leader-angle-harness.js
//
// Tom, 2026-08-14, three times, because it stayed broken through two of them: "we have to hold the
// leader angle sacred"; "angle is not constant. You must not be saving point B when you calculate
// it to draw the leader line"; "it appears that you have been still saving the top line text
// point". He was right every time. The label stored the TEXT BOX'S ORIGIN and point B was
// recomputed each render as one edge of that box -- and since Task 326 the box's width is a
// SCREEN-PIXEL quantity, so in world units it is ~1/zoom. B therefore slid by a whole box width
// as you zoomed, whenever the text hung on the far side of the anchor.
//
// WHY IT SURVIVED TWO REPORTS: it is invisible at any single zoom. Every screenshot looks correct,
// every leader points at its own label, and the number that is wrong -- the angle -- is only wrong
// by comparison with the same drawing at a different scale. A person cannot hold the first angle in
// their head accurately enough to catch a 5 degree drift; this file measures it.
//
// And Tom's other sentence is the one that says where to look: "this works fine for leaders dragged
// right. But only point B works for left and right." A right-hanging label was ALREADY correct,
// because there the box origin and B are the same point. So a test that drags right passes against
// the defect. Every assertion here is run on BOTH sides for exactly that reason.

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, refreshLabelText: refreshLabelText,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tlayoutNodeLabel: layoutNodeLabel, relayoutLabels: relayoutLabels,\n" +
	"\t\tsetZoom: function (s) { state.s = s; },\n" +
	"\t\tsetTextSize: function (t) { settings.textSize = t; },\n" +
	"\t\ttextSize: function () { return settings.textSize; },\n" +
	"\t\tleaderOf: function (id) { var e = nodeEls[id].leader;\n" +
	"\t\t\treturn e.style.display === 'none' ? null : { x1: +e.getAttribute('x1'), y1: +e.getAttribute('y1'),\n" +
	"\t\t\t\tx2: +e.getAttribute('x2'), y2: +e.getAttribute('y2') }; },\n" +
	"\t\ttextX: function (id) { return +nodeEls[id].text.getAttribute('x'); },\n" +
	"\t\tboxWidth: function (id) { return labelBoxWidth(nodeEls[id]); },\n" +
	"\t\tsideOf: function (id) { return nodeEls[id].side; },\n" +
	// The headless DOM cannot measure text, so refreshLabelText() leaves every tw at the stub's one
	// constant. In a browser tw comes from getBBox() and is therefore in WORLD units -- a
	// pixel-constant label is 1/zoom wide. The harness imposes that relationship itself rather than
	// pretending the stub has it; without it the very quantity whose drift caused this defect would
	// sit still and every assertion below would be vacuous.
	"\t\tsetTw: function (id, w) { nodeEls[id].tw = w; },\n" +
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
function angleOf(l) { return Math.atan2(l.y2 - l.y1, l.x2 - l.x1) * 180 / Math.PI; }

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

// Two junctions, so nothing is at the origin and no label is anywhere near its neighbour: this is
// about one label's own geometry, not about collision avoidance.
const a = L.addNode('junction', 0, 0);
const b = L.addNode('junction', 120, 0);
L.addLink('pipe', a.id, b.id);
L.labelSettings().node.id = true;
L.refreshLabelText();

console.log('=== the leader angle, across zoom and text size ===');

// The stored offset IS point B, on both sides: up and to the LEFT of the node is the case that was
// broken, up and to the RIGHT the one that always worked.
// Far enough out that the leader is drawn at every zoom below: leaderThreshold() itself scales with
// the text, so a label 50 units away has no leader once the text is four times its nominal size.
const CASES = [
	{ name: 'dragged LEFT of the anchor (the broken case)', lx: -120, ly: -90, side: 'left' },
	{ name: 'dragged RIGHT of the anchor (was already correct)', lx: 120, ly: -90, side: 'right' }
];
// The label's width in screen pixels -- constant, which is the paradigm (Task 326) and the reason
// its world width moves.
const TW_PX = 10;
// A wide zoom sweep and a text-size change: both feed effectiveFontSize(), which is
// settings.textSize / state.s, so either one alone could hide a dependence on the other.
const ZOOMS = [0.25, 1, 4, 16];

CASES.forEach(function (c) {
	const n = L.getDoc().nodes[0];
	n.lx = c.lx; n.ly = c.ly;
	const angles = [], widths = [], ends = [];
	ZOOMS.forEach(function (z) {
		L.setZoom(z);
		L.setTw(n.id, TW_PX / z);
		L.layoutNodeLabel(n.id);
		const ldr = L.leaderOf(n.id);
		if (!ldr) { ok(c.name + ': a leader is drawn at zoom ' + z, false); return; }
		angles.push(angleOf(ldr));
		widths.push(L.boxWidth(n.id));
		ends.push(ldr.x2 + ',' + ldr.y2);
	});
	console.log('  ' + c.name);
	ok('  the angle is IDENTICAL at every zoom',
		angles.length === ZOOMS.length && angles.every(function (v) { return Math.abs(v - angles[0]) < 1e-9; }),
		angles.map(function (v) { return v.toFixed(4); }).join(' / '));
	// Non-vacuous: the box really is a different world width at each zoom, so an angle that held
	// still did so because B is stored, not because nothing moved.
	ok('  ...and the box width really did change underneath it',
		new Set(widths.map(function (w) { return w.toFixed(6); })).size === ZOOMS.length,
		widths.map(function (w) { return w.toFixed(3); }).join(' / '));
	ok('  the endpoint itself never moves -- it is the stored point',
		new Set(ends).size === 1, ends.join(' / '));
	ok('  ...and it IS the stored offset from the node',
		Math.abs(L.leaderOf(n.id).x2 - (n.x + c.lx)) < 1e-9 && Math.abs(L.leaderOf(n.id).y2 - (n.y + c.ly)) < 1e-9,
		L.leaderOf(n.id).x2 + ',' + L.leaderOf(n.id).y2 + ' vs ' + (n.x + c.lx) + ',' + (n.y + c.ly));
	ok('  the text hangs on the side that keeps it off its own leader', L.sideOf(n.id) === c.side, L.sideOf(n.id));
	// The text placement is the half that IS allowed to move with the zoom -- that is the whole
	// separation. Asserted so a future "simplification" that pins the text in world units, and
	// silently reintroduces the old coupling, fails here.
	const at = [];
	ZOOMS.forEach(function (z) { L.setZoom(z); L.setTw(n.id, TW_PX / z); L.layoutNodeLabel(n.id); at.push(L.textX(n.id)); });
	if (c.side === 'left') {
		ok('  the TEXT does move with the zoom -- it is placed in pixels, and that is correct',
			new Set(at.map(function (v) { return v.toFixed(6); })).size === ZOOMS.length, at.map(function (v) { return v.toFixed(2); }).join(' / '));
	} else {
		ok('  hanging right, the text starts ON the endpoint at every zoom',
			at.every(function (v) { return Math.abs(v - (n.x + c.lx)) < 1e-9; }), at.join(' / '));
	}
});

// Text size, independently of zoom: same invariant, different input.
{
	const n = L.getDoc().nodes[0];
	n.lx = -120; n.ly = -90;
	L.setZoom(1);
	const angles = [];
	[1.5, 2.5, 6].forEach(function (t) {
		L.setTextSize(t); L.setTw(n.id, TW_PX * t / 2.5); L.layoutNodeLabel(n.id);
		angles.push(angleOf(L.leaderOf(n.id)));
	});
	ok('the angle survives a text-size change too',
		angles.every(function (v) { return Math.abs(v - angles[0]) < 1e-9; }),
		angles.map(function (v) { return v.toFixed(4); }).join(' / '));
}

// ---- THE OPTIONAL ANGLE SNAP IS WIRED TO EVERY LABEL DRAG (ROADMAP Task 408) -------------------
//
// The magnet itself is arithmetic and is asserted in dev/lpn-spike/geom-harness.js, where it can be
// fed angles directly. What CANNOT be asserted there is the thing that would actually ship broken:
// **three separate drag branches store a label offset**, and a snap wired into two of them is a
// feature that works on node labels and silently does nothing on link labels.
{
	const fs = require('fs');
	const src = fs.readFileSync(require('path').join(__dirname, '../../js/looped-network.js'), 'utf8');
	// Anchored on the `else if` of applyDrag()'s chain, not on the bare comparison: `nodelbl` is
	// also named in markJustDragged() a few lines above, and matching that instead would read a
	// branch with no offset arithmetic in it at all.
	function branch(name) {
		const at = src.indexOf("} else if (drag.type === '" + name + "')");
		if (at < 0) { return ''; }
		const end = src.indexOf('} else if', at + 4);
		return src.substring(at, end < 0 ? at + 2000 : end);
	}
	['nodelbl', 'linklbl', 'label'].forEach(function (kind) {
		const body = branch(kind);
		ok('the ' + kind + ' drag stores its offset through the snap', /snapLeaderOffset\(/.test(body),
			body ? 'branch found, no call' : 'branch not found at all');
	});
	// ONE reader of the setting, so "what step is in force?" has one answer.
	ok('there is exactly one place the setting is read',
		(src.match(/settings\.leaderSnapDeg/g) || []).length === 2,   // the reader, and the picker writing it
		JSON.stringify((src.match(/.{0,30}settings\.leaderSnapDeg.{0,20}/g) || [])));
	// **OFF BY DEFAULT.** A snap that arrives switched on has made the user's choice for them, and
	// Tom's ruling was that free dragging must stay available.
	ok('a new project drags freely until somebody asks otherwise',
		/leaderSnapDeg: 0,/.test(src));
	// An unknown step from some future version reads as Off rather than as a grid this page has no
	// control for.
	ok('only the increments the picker offers are honoured',
		/var LEADER_SNAP_STEPS = \[0, 15, 30, 45\];/.test(src) &&
		/LEADER_SNAP_STEPS\.indexOf\(d\) > 0 \? d : 0/.test(src));
	// **NOTHING ALREADY DRAWN IS RE-SNAPPED.** The picker writes the setting and saves; if it also
	// relaid the labels out, changing the setting would rewrite offsets the user put there by hand.
	const at = src.indexOf('settings.leaderSnapDeg = +snapSelect.value;');
	const handler = src.substring(at, src.indexOf('});', at));
	ok('changing the setting moves nothing that is already on the drawing',
		at > 0 && !/relayoutLabels|refreshLabelText/.test(handler), handler.trim());
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
