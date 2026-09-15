// A LABEL OFFSET IS A VECTOR, AND A REPROJECTION CHANGES THE UNIT IT IS WRITTEN IN -- Task 668.
//
//   node dev/lpn-spike/georef-offset-harness.js
//
// Tom, 2026-09-15, after Open xy file on map: *"If I zoom out, I see labels thousands of miles
// away, not in Sedona or Arizona, but in Canada, China, the Atlantic, and south Pacific. And they
// are persistent there."*
//
// **THE CAUSE WAS A DISTINCTION THAT IS CORRECT EVERYWHERE ELSE.** `eachStoredPoint()` visits
// POSITIONS and deliberately does not visit a label offset, because the local-origin shift must
// not apply to a vector (Task 354) -- and an anchored Text is skipped for the same reason, its
// `x/y` being an offset rather than a place. But a reprojection changes the UNIT, and nothing was
// re-deriving them: Elm Street Center's stored `lx = -57` went from 57 FEET to 57 DEGREES, about
// 6,300 km. The anchor-to-home delta came out byte-identical before and after the settle.
//
// **THE TEST IS A RATIO, NOT A POSITION.** What must hold is that an offset keeps its meaning
// relative to the drawing: a label 24.877 units from its node, on a model rescaled to 1 km, must
// end up 24.877/638 of a kilometre from that node. Asserting a coordinate instead would pin this
// to one destination and one site width and would have to be rewritten every time either moved.
'use strict';
const path = require('path');
const fs = require('fs');
const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-georef.js');

global.confirm = global.window.confirm = () => true;
global.alert = global.window.alert = () => {};

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\tprepareDocument: prepareDocument, applySaved: applySaved,\n" +
	"\t\tgeorefStart: georefStart, georefGoTo: georefGoTo,\n" +
	"\t\tgeorefState: function () { return georef; },\n" +
	"\t\tstate: function () { return state; },\n" +
	"\t\toutwardX: outwardX, outwardY: outwardY,\n" +
	"\t\tnodeLabelBase: nodeLabelBase, zoomExtent: zoomExtent,\n" +
	"\t\tsetMapSized: function () { mapSized = true; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }, "
);
L.buildLayers();
byId.lpn_canvas.clientWidth = 1000;
byId.lpn_canvas.clientHeight = 500;
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// The real published example, because the stored offsets are what this is about and a synthetic
// document would have whatever offsets the test chose to give it.
const FILE = path.join(ROOT, 'dev/water-network-examples/Elm-Street-Center.lwn');
const raw = JSON.parse(fs.readFileSync(FILE, 'utf8'));
L.applySaved(L.prepareDocument(JSON.parse(JSON.stringify(raw))));
const doc = L.getDoc();

const withOffsets = raw.nodes.filter(n => n.lx !== undefined || n.ly !== undefined);
console.log('--- the fixture still has what this is about ---');
ok('the example carries stored label offsets', withOffsets.length > 0, withOffsets.length + ' nodes');

// The offset as a FRACTION of the drawing's own span, which is the quantity a reprojection must
// preserve. Measured on the node with the largest one, since that is the label that flew furthest.
function spanOf(nodes) {
	let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
	nodes.forEach(n => {
		minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x);
		minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y);
	});
	return Math.max(maxX - minX, maxY - minY);
}
const worst = withOffsets.slice().sort(
	(a, b) => Math.hypot(b.lx || 0, b.ly || 0) - Math.hypot(a.lx || 0, a.ly || 0))[0];
const before = { span: spanOf(raw.nodes), off: Math.hypot(worst.lx || 0, worst.ly || 0) };
const ratioBefore = before.off / before.span;
console.log('  the furthest-offset node is %s, %s units from its node on a %s-unit drawing',
	worst.id, before.off.toFixed(3), before.span.toFixed(1));

console.log('\n--- place it on the world map, then send it to a 1 km site ---');
L.georefStart();
const SPAN_M = 1000;
L.georefGoTo({ lon: -111.7610, lat: 34.8697 }, SPAN_M);   // Sedona, Tom's own destination

const live = doc.nodes.filter(n => n.id === worst.id)[0];
const after = { span: spanOf(doc.nodes), off: Math.hypot(live.lx || 0, live.ly || 0) };
const ratioAfter = after.off / after.span;
ok('the offset survived as a number at all', isFinite(after.off), after.off);
ok('the drawing is now degrees across, not feet', after.span < 1, after.span.toFixed(6));
// The one assertion that matters. 1% covers the mercY non-linearity across the model's own
// height; the defect this stands against was a factor of about 7,000.
ok('the offset kept its size RELATIVE to the drawing',
	Math.abs(ratioAfter - ratioBefore) / ratioBefore < 0.01,
	'before ' + ratioBefore.toFixed(6) + '  after ' + ratioAfter.toFixed(6));

// And in metres, which is the number a person would recognise.
const MPD_LON = EngCalcs.lpnGeorefMetersPerDegree(34.8697).lon;
const metres = after.off * MPD_LON;
const expected = (before.off / before.span) * SPAN_M;
ok('...which is the right distance on the ground',
	Math.abs(metres - expected) / expected < 0.02,
	metres.toFixed(1) + ' m, expected about ' + expected.toFixed(1) + ' m');
ok('...and nowhere near another continent', metres < 10000, metres.toFixed(1) + ' m');

console.log('\n--- every offset, not just the worst one ---');
let worstDrift = 0, worstId = '';
withOffsets.forEach(function (src) {
	const now = doc.nodes.filter(n => n.id === src.id)[0];
	if (!now) { return; }
	const r0 = Math.hypot(src.lx || 0, src.ly || 0) / before.span;
	const r1 = Math.hypot(now.lx || 0, now.ly || 0) / after.span;
	const drift = Math.abs(r1 - r0) / (r0 || 1);
	if (drift > worstDrift) { worstDrift = drift; worstId = src.id; }
});
ok('no label drifted relative to the drawing', worstDrift < 0.01,
	'worst ' + worstId + ' ' + (worstDrift * 100).toFixed(3) + '%');

// **AND THE SYMPTOM TOM ACTUALLY SAW, tied to the cause.** zoomExtent() fits the model PLUS the
// label boxes, so a label 8,478 km out makes the fit frame a continent and the 18-node drawing
// becomes a sub-pixel dot -- which reads as "the map stays blank" and as "zoom to fit does
// nothing". Asserting the fit SCALE keeps that connection in the test rather than in a comment.
console.log('\n--- and zoom to fit frames the drawing, not a continent ---');
L.setMapSized();
L.zoomExtent();
const sFit = L.state().s;
// A 1 km site in a 1000 px canvas is about 0.011 degrees across, so a sane fit is ~10^5 px/degree.
// A fit that had to include a continent would be four or more orders of magnitude smaller.
ok('the fit scale frames a 1 km site', sFit > 1000, sFit.toExponential(3) + ' px/degree');
const acrossPx = after.span * sFit;
ok('...so the drawing fills a useful part of the canvas',
	acrossPx > 100 && acrossPx < 1200, acrossPx.toFixed(0) + ' px across');

console.log('\n' + (fails ? fails + ' FAILED' : 'all checks passed'));
process.exit(fails ? 1 : 0);
