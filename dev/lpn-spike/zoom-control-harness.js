// ZOOM ON A PC WITH NO WHEEL, AND FROM THE KEYBOARD -- ROADMAP Task 682. Run with:
//   node dev/lpn-spike/zoom-control-harness.js
//
// Tom, 2026-09-17: "How would a person zoom on a PC without a mouse wheel or, for that matter,
// with a keyboard." His own design for the toolbar half: "Make the Zoom to Fit toolbar button do
// double duty like the select area button. Give it a little triangle indicator. The second time
// you click it, it changes to Zoom Window." Ida's own half: +/- stacked top-right, hidden at the
// 640px breakpoint because a phone pinches instead.
//
// **WHAT WOULD MAKE THIS PASS FOR THE WRONG REASON** is a harness that calls zoomAbout() directly
// and asserts the arithmetic -- that only proves the wheel's own math, which nobody touched. Every
// assertion below drives the page's own keydown listeners and its own pointerdown/move/up handlers
// (the SAME wiring wirePointerEvents() gives the wheel and the pinch), so a binding that never
// reached the door it was supposed to reuse would show up here as a failure, not as a green run.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const stub = require('./lpn-dom-stub.js');
const ROOT = stub.ROOT;

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

global.fetch = () => Promise.reject(new Error('no network in this harness'));
global.EngCalcs = global.EngCalcs || {};
global.window.history = { replaceState: () => {} };
global.window.setTimeout = (f, t) => setTimeout(f, t);
global.window.clearTimeout = (t) => clearTimeout(t);
global.requestAnimationFrame = global.window.requestAnimationFrame = () => 0;

// A fixed 1000x500 canvas, top-left at the origin -- so a client coordinate IS a local one, and
// keyZoom()'s own "about the centre" claim is checkable against (500, 250) without translating.
const canvas = stub.byId.lpn_canvas;
Object.defineProperty(canvas, 'clientWidth', { get() { return 1000; } });
Object.defineProperty(canvas, 'clientHeight', { get() { return 500; } });
canvas.getBoundingClientRect = function () {
	return { left: 0, top: 0, right: 1000, bottom: 500, width: 1000, height: 500 };
};

const L = stub.loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tbuildDom: buildDom, setMode: setMode, getMode: function () { return mode; },\n" +
	"\t\twirePointerEvents: wirePointerEvents, wireZoomControl: wireZoomControl,\n" +
	"\t\tkeyZoom: keyZoom, getState: function () { return state; },\n" +
	"\t\tgetZoomToolShape: function () { return zoomToolShape; },\n" +
	"\t\tsetZoomToolShape: function (s) { zoomToolShape = s; },\n" +
	"\t\tzoomWindowOpen: function () { return !!zoomWinDrag; },\n" +
	"\t\tnoteMapSized: noteMapSized,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
stub.setUnitSet('us');
L.seedDefaultInputs();
const doc = L.getDoc();
doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
L.buildDom();
L.buildLayers();
if (L.noteMapSized) { L.noteMapSized(); }

const svg = canvas;
function reset() {
	const st = L.getState();
	st.s = 1; st.tx = 0; st.ty = 0;
	L.setMode('select');
	L.setZoomToolShape('fit');
}
function fire(type, ev) { stub.setHitTarget(null); (svg._listeners[type] || []).forEach(function (fn) { fn(ev); }); }
function keydown(props) {
	const ev = Object.assign({ key: '', ctrlKey: false, metaKey: false, altKey: false,
		target: { tagName: 'BODY' }, preventDefault: function () {} }, props);
	(global.document._listeners.keydown || []).slice().forEach(function (fn) { fn(ev); });
}

// ---------------------------------------------------------------------------
// 1. keyZoom() IS THE WHEEL'S OWN FACTOR, ABOUT THE VIEW'S CENTRE
// ---------------------------------------------------------------------------
console.log('\n--- 1. keyZoom() zooms by the wheel\'s own 1.1x/notch, about the canvas centre ---');
{
	reset();
	L.keyZoom(1.1);
	const st = L.getState();
	ok('scale multiplies by 1.1', Math.abs(st.s - 1.1) < 1e-9, String(st.s));
	// zoomAbout() holds the point under (500, 250) -- the canvas centre -- fixed: world x/y there
	// was (500, 250) at s=1/tx=0/ty=0, so the new tx/ty are exactly lx - wx*s.
	ok('the centre point is held fixed (tx)', Math.abs(st.tx - (500 - 500 * 1.1)) < 1e-9, String(st.tx));
	ok('the centre point is held fixed (ty)', Math.abs(st.ty - (250 - 250 * 1.1)) < 1e-9, String(st.ty));
	L.keyZoom(1 / 1.1);
	ok('zooming back out round-trips the scale', Math.abs(L.getState().s - 1) < 1e-9, String(L.getState().s));
	ok('...and the pan', Math.abs(L.getState().tx) < 1e-9 && Math.abs(L.getState().ty) < 1e-9);
}

// ---------------------------------------------------------------------------
// 2. THE KEYS: plain + (and =) and -, guarded exactly like Ctrl+Z and the digit picker
// ---------------------------------------------------------------------------
console.log('\n--- 2. + / = / - zoom; Ctrl and a text field turn them away ---');
{
	reset();
	keydown({ key: '+' });
	ok('+ zooms in', Math.abs(L.getState().s - 1.1) < 1e-9, String(L.getState().s));

	reset();
	keydown({ key: '=' });
	ok('= (the unshifted key under +) zooms in too', Math.abs(L.getState().s - 1.1) < 1e-9, String(L.getState().s));

	reset();
	keydown({ key: '-' });
	ok('- zooms out', Math.abs(L.getState().s - 1 / 1.1) < 1e-9, String(L.getState().s));

	reset();
	keydown({ key: '+', ctrlKey: true });
	ok('Ctrl+plus is left for the browser\'s own page zoom', L.getState().s === 1, String(L.getState().s));

	reset();
	keydown({ key: '+', metaKey: true });
	ok('Cmd/Meta+plus likewise', L.getState().s === 1, String(L.getState().s));

	reset();
	keydown({ key: '+', target: { tagName: 'INPUT' } });
	ok('+ does nothing while typing in a field', L.getState().s === 1, String(L.getState().s));

	reset();
	keydown({ key: '-', target: { tagName: 'TEXTAREA' } });
	ok('- does nothing while typing in a field', L.getState().s === 1, String(L.getState().s));

	reset();
	keydown({ key: 'a' });
	ok('an unrelated key does nothing', L.getState().s === 1, String(L.getState().s));
}

// ---------------------------------------------------------------------------
// 3. THE TOOLBAR'S DOUBLE DUTY: a second entry into the tool arms Zoom Window,
//    which drags a box on the map and zooms to it -- through wirePointerEvents(),
//    the same door the wheel and the pinch already use.
// ---------------------------------------------------------------------------
console.log('\n--- 3. Zoom to fit\'s second mode drags a box and zooms to it ---');
{
	reset();
	svg._listeners = {};
	L.wirePointerEvents();

	// The button's own click handler does exactly this on its second press: show 'window', then
	// enter the mode. Simulating it through the exported primitives rather than a DOM click keeps
	// this harness testing the STATE MACHINE (what select-area's own harnesses do), not a button
	// object this stub cannot fully reconstruct.
	L.setZoomToolShape('window');
	L.setMode('zoom-window');
	ok('a second entry arms Zoom Window', L.getMode() === 'zoom-window');

	fire('pointerdown', { pointerId: 7, clientX: 200, clientY: 100, pointerType: 'mouse', button: 0 });
	ok('the box is open mid-drag', L.zoomWindowOpen());
	fire('pointermove', { pointerId: 7, clientX: 600, clientY: 400, pointerType: 'mouse' });
	fire('pointerup', { pointerId: 7, clientX: 600, clientY: 400, pointerType: 'mouse' });

	const st = L.getState();
	// Box (200,100)-(600,400) in a 1x/0,0 view is ALSO its own world box (screenToWorld is the
	// identity here) -- 400 wide, 300 tall. Fitting 1000x500 to that: min(1000/400, 500/300) =
	// min(2.5, 1.6667) = 1.6667, the y axis binding.
	const expectS = Math.min(1000 / 400, 500 / 300);
	ok('the view zooms to fit the dragged box', Math.abs(st.s - expectS) < 1e-6, String(st.s));
	// centred on the box's own centre, (400, 250): tx = w/2 - s*cx, ty = h/2 - s*cy.
	ok('...centred on the box (tx)', Math.abs(st.tx - (500 - expectS * 400)) < 1e-6, String(st.tx));
	ok('...centred on the box (ty)', Math.abs(st.ty - (250 - expectS * 250)) < 1e-6, String(st.ty));
	ok('a completed drag is one-shot -- back to Select', L.getMode() === 'select');
	ok('...and the toolbar button falls back to Zoom to fit', L.getZoomToolShape() === 'fit');
}

console.log('\n--- 3b. a click with no drag does nothing, and stays armed to retry ---');
{
	reset();
	svg._listeners = {};
	L.wirePointerEvents();
	L.setZoomToolShape('window');
	L.setMode('zoom-window');
	const before = Object.assign({}, L.getState());
	fire('pointerdown', { pointerId: 8, clientX: 300, clientY: 300, pointerType: 'mouse', button: 0 });
	fire('pointerup', { pointerId: 8, clientX: 300, clientY: 300, pointerType: 'mouse' });
	const after = L.getState();
	ok('the view is unchanged', after.s === before.s && after.tx === before.tx && after.ty === before.ty);
	ok('the tool stays armed for another try', L.getMode() === 'zoom-window');
}

console.log('\n--- 3c. leaving the mode mid-drag drops the half-drawn box (Task 266\'s own rule) ---');
{
	reset();
	svg._listeners = {};
	L.wirePointerEvents();
	L.setZoomToolShape('window');
	L.setMode('zoom-window');
	fire('pointerdown', { pointerId: 9, clientX: 50, clientY: 50, pointerType: 'mouse', button: 0 });
	ok('a box is open', L.zoomWindowOpen());
	L.setMode('select');
	ok('switching tools drops it, unfinished', !L.zoomWindowOpen());
	ok('...and it did not zoom to whatever it had so far', L.getState().s === 1);
}

// ---------------------------------------------------------------------------
// 4. THE ON-MAP CHIP IS HIDDEN BELOW THE 640PX BREAKPOINT (Ida, 2026-09-17) --
//    read as CSS source, the way basemap-credit-harness.js checks a rule it cannot render.
// ---------------------------------------------------------------------------
console.log('\n--- 4. the +/- chip is hidden at the phone breakpoint, and only there ---');
{
	const css = fs.readFileSync(ROOT + 'css/engcalcs.css', 'utf8');
	const needle = '#lpn_zoom_control { display: none; }';
	const i = css.indexOf(needle);
	ok('the hide rule exists', i >= 0);
	if (i >= 0) {
		// Walk back to the nearest preceding "@media (max-width: 640px)" and confirm the media
		// block is STILL OPEN at the point our rule appears -- i.e. depth never returns to 0
		// between the block's own "{" and our rule.
		const mq = '@media (max-width: 640px)';
		let mqAt = -1, next = css.indexOf(mq);
		while (next >= 0 && next < i) { mqAt = next; next = css.indexOf(mq, next + 1); }
		ok('...inside a max-width: 640px media query', mqAt >= 0);
		if (mqAt >= 0) {
			const openBrace = css.indexOf('{', mqAt);
			let depth = 0, stillOpen = true;
			for (let p = openBrace; p < i; p++) {
				if (css[p] === '{') { depth++; }
				else if (css[p] === '}') { depth--; if (depth === 0) { stillOpen = false; break; } }
			}
			ok('...and the block has not already closed before our rule', stillOpen);
		}
	}
	const php = fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8');
	ok('the chip is not itself hidden inline by default',
		!/id="lpn_zoom_control"[^>]*display:\s*none/.test(php));
	// An inline display of ANY value beats the stylesheet's hide rule, so the phone never hid it
	// (Perry, 2026-09-23, measured in a real touch-emulated Chromium: computed display "flex").
	ok('the chip carries no inline display, so the hide rule can win',
		!/id="lpn_zoom_control"[^>]*style="[^"]*display:/.test(php));
	ok('its flex layout lives in the stylesheet instead',
		css.indexOf('#lpn_zoom_control { display: flex;') >= 0);
}

console.log('\n' + checks + ' checks, ' + failures + ' failed');
process.exit(failures ? 1 : 0);
