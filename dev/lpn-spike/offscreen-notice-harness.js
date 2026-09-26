// "A PROJECT THAT IS WHOLE BUT ENTIRELY OFF SCREEN SHOULD SAY SO" -- ROADMAP Task 647. Run with:
//   node dev/lpn-spike/offscreen-notice-harness.js
//
// WHY THIS EXISTS. Tom, 2026-09-13, on Task 628 as it shipped: "Could we check whether any of the
// network is present on the map and alert that project is intact, but entirely outside the current
// view?" -- and, naming the reason it matters: "a blank map is equally fatal as a lost project.
// User doesn't know the difference."
//
// Ida's design (dev/agents/interface-designer/journal.md, "Task 647"): a PERSISTENT centred
// overlay -- "Your network is intact." over a "Zoom to fit" button -- shown only while ZERO
// elements intersect the current view, evaluated only when a pan or a zoom gesture has SETTLED
// (never mid-drag, never per wheel notch), reusing viewShowsModel()'s own arithmetic rather than a
// second geometry. Never shown for an empty project. No "tiny sliver" threshold: any partial
// overlap, even one node's corner, is enough to suppress it.
//
// SIX SECTIONS, one per scenario the brief asked for:
//   1. baseline -- the shipped example, freshly fit, shows no overlay.
//   2. a real drag that pans the whole network off screen -- the overlay appears the instant the
//      pointer is released (the pan's own "at rest" moment), and not before.
//   3. pressing the overlay's OWN "Zoom to fit" button brings the network back and the overlay
//      clears -- through the same debounced settle a wheel zoom uses (scheduleReshed, 120 ms).
//   4. a view that keeps one corner node barely inside the window: no overlay, proving there is no
//      sliver threshold.
//   5. an empty project: never shown, dragged or not.
//   6. mid-drag: the overlay's display is untouched by any frame between pointerdown and release.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

'use strict';

const { setUnitSet, loadLoopedNetwork, setHitTarget } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS, openExample } = require('./example-fixture.js');

let checks = 0, failures = 0;
function ok(cond, label, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tnoteMapSized: noteMapSized,\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
	"\t\tcurrentView: currentView, modelExtent: modelExtent, viewShowsModel: viewShowsModel,\n" +
	"\t\tzoomExtent: zoomExtent, applyView: applyView,\n" +
	"\t\tupdateOffscreenNotice: updateOffscreenNotice, wireOffscreenNotice: wireOffscreenNotice,\n" +
	"\t\thasDrag: function () { return !!drag; },\n" +
	"\t\tapplyDrag: function () { applyDrag(); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);

setUnitSet('us');
global.window.setTimeout = (f, t) => setTimeout(f, t);
global.window.clearTimeout = (t) => clearTimeout(t);

L.buildLayers();
const CANVAS_W = 1200, CANVAS_H = 700;
const svg = require('./lpn-dom-stub.js').byId.lpn_canvas;
svg.clientWidth = CANVAS_W; svg.clientHeight = CANVAS_H;
svg.getBoundingClientRect = () => ({ left: 0, top: 0, right: CANVAS_W, bottom: CANVAS_H, width: CANVAS_W, height: CANVAS_H });
require('./lpn-dom-stub.js').byId.lpn_toolbar.querySelectorAll = () => [];

const overlay = require('./lpn-dom-stub.js').byId.lpn_offscreen_notice;
const shown = () => overlay.style.display === 'flex';

function fire(type, ev) { setHitTarget(null); (svg._listeners[type] || []).forEach((fn) => fn(ev)); }
function press(x, y) { fire('pointerdown', { pointerId: 1, clientX: x, clientY: y, button: 0, target: svg, preventDefault() {} }); }
function move(x, y) {
	fire('pointermove', { pointerId: 1, clientX: x, clientY: y, target: svg, preventDefault() {} });
	// **PANNING IS APPLIED FROM A dragDirty FLAG, NOT SYNCHRONOUSLY IN THE MOVE HANDLER** -- the
	// real page reads it off a requestAnimationFrame loop (dev/lpn-spike/pointer-capture-harness.js
	// found this first). A harness without this line would see `state.tx/ty` sit still forever.
	if (L.hasDrag()) { L.applyDrag(); }
}
function lift(x, y) { fire('pointerup', { pointerId: 1, clientX: x, clientY: y, target: svg, preventDefault() {} }); }

function settle() { return new Promise((resolve) => setTimeout(resolve, 200)); }

async function main() {

openExample(L, 'us');
L.noteMapSized();
L.wirePointerEvents();
L.setMode('select');
L.wireOffscreenNotice();
const doc = L.getDoc();
ok(doc.nodes.length > 0, 'the shipped example opened with a real network', doc.nodes.length + ' nodes');

// ---- 1. BASELINE: a fresh fit shows nothing ---------------------------------------------------
console.log('--- 1. freshly fit, the network is on screen, no overlay ---');
L.zoomExtent();
await settle();
ok(L.viewShowsModel(L.currentView()), 'the fit view does show the model (the oracle agrees)');
ok(!shown(), 'and the overlay is not shown');

// ---- 2. A REAL PAN, FAR ENOUGH TO LOSE THE WHOLE NETWORK ---------------------------------------
console.log('--- 2. panning the network off screen, by a real drag-and-release ---');
ok(!shown(), 'still hidden before the drag starts');
press(600, 350);
move(700, 400);   // past the tap threshold -- this is unambiguously a drag, not a click
ok(!shown(), 'MID-DRAG: still whatever it was -- the overlay is not evaluated per frame');
move(60000, 60000);   // a fling far past the model's own extent, in one gesture
ok(!shown(), 'still not evaluated on an intermediate pointermove frame either');
lift(60000, 60000);
ok(!L.hasDrag(), 'the gesture ended');
ok(!L.viewShowsModel(L.currentView()), 'and the oracle agrees the model is off screen now');
ok(shown(), 'THE OVERLAY APPEARED THE INSTANT THE POINTER WAS RELEASED');
ok(L.modelExtent() !== null, 'the network is still there -- this is "intact", not "lost"', JSON.stringify(L.modelExtent()));

// ---- 3. THE OVERLAY'S OWN BUTTON BRINGS IT BACK -------------------------------------------------
console.log('--- 3. pressing the overlay\'s own Zoom to fit clears it ---');
const zoomBtn = require('./lpn-dom-stub.js').byId.lpn_offscreen_zoom_btn;
ok(!!zoomBtn.textContent, 'the button carries the reused lpn_tool_zoom_extent label', zoomBtn.textContent);
(zoomBtn._listeners.click || []).forEach((fn) => fn({}));
// Zoom to fit now lays labels out synchronously at the target zoom (R-214, reshedNow()), and that
// pass decides the overlay too -- so an explicit fit may clear it on the same tick. Either tick is
// right; what matters is that it is gone once the zoom has settled, asserted below.
await settle();
ok(L.viewShowsModel(L.currentView()), 'the network is back in view');
ok(!shown(), 'and the overlay is gone, with no fade -- one style write');

// ---- 4. NO TINY-SLIVER THRESHOLD ----------------------------------------------------------------
console.log('--- 4. one corner node barely inside the window: still no overlay ---');
{
	L.zoomExtent();
	await settle();
	const ext = L.modelExtent();
	const view0 = L.currentView();
	const corner = doc.nodes.reduce((a, b) => (a.x + a.y >= b.x + b.y ? a : b));
	const halfW = (CANVAS_W / 2) / view0.s, halfH = (CANVAS_H / 2) / view0.s;
	const margin = 4;   // world units inside the window edge -- "barely"
	const sliver = { cx: corner.x - halfW + margin, cy: corner.y - halfH + margin, s: view0.s };
	L.applyView(sliver);
	L.updateOffscreenNotice();
	const inWindow = (n) => n.x >= sliver.cx - halfW && n.x <= sliver.cx + halfW &&
		n.y >= sliver.cy - halfH && n.y <= sliver.cy + halfH;
	ok(inWindow(corner), 'the corner node really is inside this window', JSON.stringify(corner));
	ok(doc.nodes.some((n) => !inWindow(n)), 'and at least one other node is not -- this is a sliver, not a full view');
	ok(ext !== null && ext.maxx - ext.minx > 0, 'sanity: the model has real extent', JSON.stringify(ext));
	ok(!shown(), 'NO OVERLAY -- one node in view is enough, whatever the coverage fraction');
}

// ---- 5. AN EMPTY PROJECT NEVER SHOWS IT, DRAGGED OR NOT ------------------------------------------
console.log('--- 5. an empty project: never shown ---');
{
	doc.nodes.length = 0; doc.links.length = 0;
	L.buildDom();
	L.buildLayers();
	svg.clientWidth = CANVAS_W; svg.clientHeight = CANVAS_H;
	svg.getBoundingClientRect = () => ({ left: 0, top: 0, right: CANVAS_W, bottom: CANVAS_H, width: CANVAS_W, height: CANVAS_H });
	svg._listeners = {};
	L.wirePointerEvents();
	L.setMode('select');
	L.updateOffscreenNotice();
	ok(L.modelExtent() === null, 'modelExtent() agrees there is nothing to be off screen');
	ok(!shown(), 'no overlay for a bare canvas -- Task 314\'s shop window owns that state, not this one');
	press(600, 350); move(700, 400); move(60000, 60000); lift(60000, 60000);
	ok(!shown(), 'and panning an empty canvas around does not conjure one either');
}

// ---- 6. IT WEARS AN EXISTING STYLE, NOT ONE OF ITS OWN (R-227) ----------------------------------
console.log('--- 6. the card uses the neutral panel class, not the warning pair ---');
{
	const fs = require('fs'), path = require('path');
	const php = fs.readFileSync(path.join(__dirname, '../../Looped-Network.php'), 'utf8');
	const m = php.match(/<div id="lpn_offscreen_notice"[\s\S]*?<\/div>\s*<\/div>/);
	ok(!!m && /class="lpn-offscreen-card"/.test(m[0]), 'the card carries .lpn-offscreen-card');
	ok(!!m && !/#fffbe6|#a80\b/i.test(m[0]), 'and no inline warning colours (it is reassurance, not a warning)');
}

console.log('');
console.log(failures ? failures + ' of ' + checks + ' FAILED' : 'all ' + checks + ' checks passed');
process.exit(failures ? 1 : 0);

}
main().catch((e) => { console.log('  FAIL harness threw -- ' + (e && e.stack || e)); process.exit(1); });
