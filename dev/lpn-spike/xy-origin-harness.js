// A NEW XY PROJECT PRODUCES POSITIVE COORDINATES -- ROADMAP Task 673.
//
//   node dev/lpn-spike/xy-origin-harness.js
//
// Tom, 2026-09-15: *"It might be nice for a new non-geo project to have 0,0 at the lower, not
// upper left, so that initial coordinates are all positive."*
//
// **THE DEFECT WAS A CAMERA, NOT ARITHMETIC, which is why nothing else had to move.** A file
// stores y UP and memory runs y DOWN (`cartesianY`), so with the world origin parked at the TOP
// left every point on the canvas was below it and every northing came out negative. The fix
// points the camera at the first quadrant instead. No converter changed, no stored number changed
// meaning, and no existing project was touched -- this is only the view a project gets before it
// has one of its own.
//
// **THE TEST IS THE OUTWARD NUMBER, never the internal one.** Asserting `cy` would pin the camera
// and pass just as happily if the flip were reversed underneath it; what Tom asked for is about
// the coordinate a PERSON reads in the table, which is what outwardX/outwardY produce.
'use strict';
const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\tdefaultViewForCoords: defaultViewForCoords, applyView: applyView,\n" +
	"\t\tstate: function () { return state; },\n" +
	"\t\tscreenToWorld: screenToWorld, outwardX: outwardX, outwardY: outwardY,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }, "
);
L.buildLayers();
const W = 1000, H = 500;
byId.lpn_canvas.clientWidth = W;
byId.lpn_canvas.clientHeight = H;
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const v = L.defaultViewForCoords();
ok('a new XY project has a default view', !!v, JSON.stringify(v));
L.applyView(v);

// The four corners of the canvas, as the numbers a person would read off the status bar.
function at(px, py) {
	const w = L.screenToWorld(px, py);
	return { x: L.outwardX(w.x), y: L.outwardY(w.y) };
}
const tl = at(0, 0), tr = at(W, 0), bl = at(0, H), br = at(W, H);
console.log('\n--- the coordinates a person reads at each corner ---');
console.log('  top-left     %s, %s', tl.x.toFixed(1), tl.y.toFixed(1));
console.log('  top-right    %s, %s', tr.x.toFixed(1), tr.y.toFixed(1));
console.log('  bottom-left  %s, %s', bl.x.toFixed(1), bl.y.toFixed(1));
console.log('  bottom-right %s, %s', br.x.toFixed(1), br.y.toFixed(1));

console.log('\n--- 0,0 is at the BOTTOM left, and nothing on screen is negative ---');
ok('the origin sits at the bottom-left corner',
	Math.abs(bl.x) < 1e-9 && Math.abs(bl.y) < 1e-9, bl.x + ', ' + bl.y);
[['top-left', tl], ['top-right', tr], ['bottom-left', bl], ['bottom-right', br]].forEach(function (p) {
	ok('no negative coordinate at the ' + p[0],
		p[1].x >= -1e-9 && p[1].y >= -1e-9, p[1].x.toFixed(1) + ', ' + p[1].y.toFixed(1));
});
// y must still INCREASE upward for the reader, or "positive" was bought by breaking the compass.
ok('north is still up', tl.y > bl.y, tl.y.toFixed(1) + ' above ' + bl.y.toFixed(1));
ok('east is still right', tr.x > tl.x, tr.x.toFixed(1) + ' right of ' + tl.x.toFixed(1));

console.log('\n--- and the scale is one pixel per drawing unit, deliberately ---');
ok('s is exactly 1', L.state().s === 1, L.state().s);
ok('...so the canvas frames its own size in drawing units',
	Math.abs((tr.x - tl.x) - W) < 1e-9 && Math.abs((tl.y - bl.y) - H) < 1e-9,
	(tr.x - tl.x).toFixed(1) + ' x ' + (tl.y - bl.y).toFixed(1));

console.log('\n' + (fails ? fails + ' FAILED' : 'all checks passed'));
process.exit(fails ? 1 : 0);
