// PANNING SURVIVES A REFUSED POINTER CAPTURE -- ROADMAP Task 658. Run with:
//   node dev/lpn-spike/pointer-capture-harness.js
//
// Tom, 2026-09-13, on Ubuntu Chrome under WSLg: *"I couldn't pan (I can edit and zoom) on reload,
// even repeated reload... Even Page, Start fresh doesn't restore pan."* Firefox on the same machine
// panned normally; a new install, a private window and a guest profile all failed the same way, so
// it was never profile state. The browser-pass spec could not reproduce it under a CDP mouse.
//
// **THE SHAPE OF THE FAILURE IS THE CLUE, AND IT IS ALL IN ONE LINE.** `svg.setPointerCapture()` sat
// UNGUARDED at the top of the canvas pointerdown handler, BEFORE `pointers.set()` and before any
// `drag` record is made. setPointerCapture() throws NotFoundError when the browser no longer treats
// the pointer as active, and Chromium's Wayland backend is a place that happens. One throw and the
// handler dies before the gesture exists: no drag, no pan, FOREVER -- while every click still works
// and the wheel still zooms, because those are other handlers. A map that draws perfectly and
// cannot be dragged is exactly what he described.
//
// **THE TREE HAD DECIDED THIS TWICE IN OPPOSITE DIRECTIONS**, which is this project's standing
// signature for a rule nobody wrote down: the two pane-grip setPointerCapture() calls were already
// wrapped in try/catch, and this one was not.
//
// **CAPTURE IS AN OPTIMISATION HERE, NOT A REQUIREMENT.** It keeps pointermove arriving when the
// pointer leaves the svg. Losing it degrades a drag at the edges; losing the gesture loses the map.
// So the assertion below is not "capture works" -- it is that a REFUSED capture still pans.

'use strict';

const { byId, loadLoopedNetwork, setUnitSet, setHitTarget } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tbuildDom: buildDom, wirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
	"\t\tapplyDrag: function () { applyDrag(); },\n" +
	"\t\thasDrag: function () { return !!drag; },\n" +
	"\t\tdragType: function () { return drag && drag.type; },\n" +
	"\t\ttx: function () { return state.tx; }, ty: function () { return state.ty; },\n" +
	"\t\tscale: function () { return state.s; },\n" +
	"\t\tsetScale: function (s) { state.s = s; state.tx = 0; state.ty = 0; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); }\n"
);
L.buildLayers();
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const svg = byId.lpn_canvas;
byId.lpn_toolbar.querySelectorAll = function () { return []; };

function fresh() {
	L.seedDefaultInputs();
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
	L.buildDom();
	L.buildLayers();
	L.setScale(1);
	svg._listeners = {};
	L.wirePointerEvents();
	L.setMode('select');
	return doc;
}
function fire(type, ev) { setHitTarget(null); (svg._listeners[type] || []).forEach(function (fn) { fn(ev); }); }
function press(x, y) { fire('pointerdown', { pointerId: 1, clientX: x, clientY: y, button: 0, target: svg, preventDefault: function () {} }); }
function move(x, y) { fire('pointermove', { pointerId: 1, clientX: x, clientY: y, target: svg, preventDefault: function () {} }); }
function lift(x, y) { fire('pointerup', { pointerId: 1, clientX: x, clientY: y, target: svg, preventDefault: function () {} }); }

// A drag that is unambiguously past the tap threshold in both axes.
let sawDragType = null;
function dragBy(dx, dy) {
	press(400, 300);
	move(400 + dx, 300 + dy);
	// CAPTURED DURING the gesture: `drag` is cleared on the lift, so asking afterwards always
	// says null and an assertion on it would pass whatever happened. That is the shape of a test
	// that reads green while measuring nothing.
	sawDragType = L.dragType();
	if (L.hasDrag()) { L.applyDrag(); }
	lift(400 + dx, 300 + dy);
}

console.log('--- 1. the ordinary case: capture is granted ---');
let captureCalls = 0;
svg.setPointerCapture = function () { captureCalls++; };
fresh();
let tx0 = L.tx(), ty0 = L.ty(), s0 = L.scale();
dragBy(120, -80);
ok('the canvas was asked to capture the pointer', captureCalls === 1, captureCalls);
ok('THE MAP PANNED by exactly the drag delta in x', Math.abs((L.tx() - tx0) - 120) < 0.5, L.tx() - tx0);
ok('...and in y', Math.abs((L.ty() - ty0) - -80) < 0.5, L.ty() - ty0);
ok('and the zoom was not touched', L.scale() === s0, L.scale());

console.log('--- 2. THE DEFECT: the browser REFUSES the capture ---');
// Chromium under Wayland throws NotFoundError here when it no longer considers the pointer active.
let thrown = 0;
svg.setPointerCapture = function () { thrown++; const e = new Error('NotFoundError'); e.name = 'NotFoundError'; throw e; };
fresh();
tx0 = L.tx(); ty0 = L.ty(); s0 = L.scale();
let threwOut = false;
try { dragBy(120, -80); } catch (err) { threwOut = true; }
ok('the browser did refuse the capture', thrown === 1, thrown);
ok('THE THROW DID NOT ESCAPE the pointerdown handler', !threwOut);
ok('A PAN DRAG WAS STILL CREATED, which the throw used to prevent', sawDragType === 'pan', String(sawDragType));
ok('AND THE MAP STILL PANNED in x -- this is the whole bug', Math.abs((L.tx() - tx0) - 120) < 0.5, L.tx() - tx0);
ok('...and in y', Math.abs((L.ty() - ty0) - -80) < 0.5, L.ty() - ty0);
ok('and the zoom is still untouched', L.scale() === s0, L.scale());

console.log('--- 3. a SECOND gesture still works, which is what "forever" means ---');
tx0 = L.tx(); ty0 = L.ty();
dragBy(-40, 25);
ok('the second drag panned too', Math.abs((L.tx() - tx0) - -40) < 0.5, L.tx() - tx0);
ok('...in y as well', Math.abs((L.ty() - ty0) - 25) < 0.5, L.ty() - ty0);
ok('the refusal happened on that gesture as well, so nothing cached it away', thrown === 2, thrown);

console.log('--- 4. a capture that throws a DIFFERENT error is survived too ---');
svg.setPointerCapture = function () { throw new TypeError('not a function of this element'); };
fresh();
tx0 = L.tx(); ty0 = L.ty();
threwOut = false;
try { dragBy(60, 60); } catch (err) { threwOut = true; }
ok('no throw escaped', !threwOut);
ok('and the map panned', Math.abs((L.tx() - tx0) - 60) < 0.5, L.tx() - tx0);

console.log('');
console.log(fails === 0 ? 'All pointer-capture checks passed.' : fails + ' FAILURE(S)');
process.exit(fails === 0 ? 0 : 1);
