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
	"\t\tgetZoomToolArmed: function () { return zoomToolArmed; },\n" +
	"\t\tzoomWindowOpen: function () { return !!zoomWinDrag; },\n" +
	"\t\twireToolbar: wireToolbar,\n" +
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

console.log('\n--- 3b. a click with no drag does nothing YET, and leaves the box open for a second click (R-180) ---');
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
	// **THE DEFECT R-180 NAMED**: before the fix, `zoomWinFinish()`'s own zero-movement guard
	// nulled `zoomWinDrag` unconditionally, so a plain click silently threw the box away instead of
	// leaving it open for a second click -- click-click could never work no matter how the button
	// or the pointer handlers wired it. This is the one assertion that would have caught it.
	ok('...and the half-open box survives the click, unlike before this fix', L.zoomWindowOpen());
}

console.log('\n--- 3c. click-a-corner, click-the-opposite-corner zooms to the SAME box a drag would (R-180) ---');
{
	reset();
	svg._listeners = {};
	L.wirePointerEvents();
	L.setZoomToolShape('window');
	L.setMode('zoom-window');
	// Same box as section 3's drag: (200,100)-(600,400), so the expected view is identical --
	// EXACTLY Tom's ask, "a consistent idiom" for the same result.
	fire('pointerdown', { pointerId: 12, clientX: 200, clientY: 100, pointerType: 'mouse', button: 0 });
	fire('pointerup', { pointerId: 12, clientX: 200, clientY: 100, pointerType: 'mouse' });
	ok('the first click opens the box rather than committing it', L.zoomWindowOpen());
	ok('...and stays in the mode, unchanged', L.getMode() === 'zoom-window');
	// The SECOND click's PRESS commits, exactly as areaPress()'s second call falls through to
	// commitArea() -- select-area's own window/lasso shape never waits for that click's release.
	fire('pointerdown', { pointerId: 12, clientX: 600, clientY: 400, pointerType: 'mouse', button: 0 });
	const st = L.getState();
	const expectS = Math.min(1000 / 400, 500 / 300);
	ok('the second click commits the identical box a drag would', Math.abs(st.s - expectS) < 1e-6, String(st.s));
	ok('...centred the same way (tx)', Math.abs(st.tx - (500 - expectS * 400)) < 1e-6, String(st.tx));
	ok('...centred the same way (ty)', Math.abs(st.ty - (250 - expectS * 250)) < 1e-6, String(st.ty));
	ok('a completed click-click is one-shot -- back to Select, same as a drag', L.getMode() === 'select');
	fire('pointerup', { pointerId: 12, clientX: 600, clientY: 400, pointerType: 'mouse' });   // the real up event that follows any down, no-op once mode has left zoom-window
	ok('...and the toolbar button falls back to Zoom to fit', L.getZoomToolShape() === 'fit');
}

console.log('\n--- 3d. Escape cancels a half-drawn box, click-click or drag alike ---');
{
	reset();
	svg._listeners = {};
	L.wirePointerEvents();
	L.setZoomToolShape('window');
	L.setMode('zoom-window');
	fire('pointerdown', { pointerId: 13, clientX: 50, clientY: 50, pointerType: 'mouse', button: 0 });
	fire('pointerup', { pointerId: 13, clientX: 50, clientY: 50, pointerType: 'mouse' });
	ok('a half-drawn box is open after one click', L.zoomWindowOpen());
	keydown({ key: 'Escape' });
	ok('Escape drops it', !L.zoomWindowOpen());
	ok('...and returns to Select', L.getMode() === 'select');
	ok('...it did not zoom to the half-drawn box', L.getState().s === 1);
}

console.log('\n--- 3e. leaving the mode mid-drag drops the half-drawn box (Task 266\'s own rule) ---');
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

// ---------------------------------------------------------------------------
// 5. R-179 (Tom, 2026-09-23): "The + and - glyphs are not centered in their boxes."
//    A stub with no real layout engine cannot measure a rendered glyph's bounding box, so this is
//    SOURCE-LEVEL -- it checks the fix is actually in place, not that it renders true. The
//    render-true half was measured separately in a real headless Chromium
//    (dev/browser-pass/lib/env.js, playwright-core, under flock /tmp/engcalcs-browser.lock) and is
//    reported in the build's own report rather than duplicated here as a number this harness
//    cannot reproduce: both buttons' glyph bounding-box centre landed within 0.5 px of the
//    button's own centre (#lpn_zoom_in: 0.01 px both axes; #lpn_zoom_out: 0.01 px / 0.49 px).
// ---------------------------------------------------------------------------
console.log('\n--- 5. R-179: the +/- buttons flex-centre their glyph, and carry no inline display to beat it ---');
{
	const css = fs.readFileSync(ROOT + 'css/engcalcs.css', 'utf8');
	const php = fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8');
	ok('#lpn_zoom_in flex-centres its own content',
		/#lpn_zoom_in,\s*#lpn_zoom_out\s*\{[^}]*display:\s*flex[^}]*align-items:\s*center[^}]*justify-content:\s*center/.test(css)
		|| /#lpn_zoom_in,\s*#lpn_zoom_out\s*\{[^}]*display:\s*flex[^}]*justify-content:\s*center[^}]*align-items:\s*center/.test(css));
	ok('...and the icon\'s own trailing-word margin is zeroed for these two icon-only buttons',
		/#lpn_zoom_in\s*>\s*\.ec-icon,\s*#lpn_zoom_out\s*>\s*\.ec-icon\s*\{[^}]*margin-inline-end:\s*0/.test(css));
	// Both buttons carried an inline `display:block` until this fix -- an inline display beats any
	// stylesheet rule (the same lesson the chip's own container already learned, bcaa8319), so the
	// flex centring above would have been dead code with that inline value still in the markup.
	ok('#lpn_zoom_in carries no inline display of its own',
		!/id="lpn_zoom_in"[^>]*style="[^"]*display:/.test(php));
	ok('#lpn_zoom_out carries no inline display of its own',
		!/id="lpn_zoom_out"[^>]*style="[^"]*display:/.test(php));
}

// ---------------------------------------------------------------------------
// 6. R-181 (Tom, 2026-09-23): "With Select area, the first time you click, it does not change
//    modes... I think that it should act like Select area. Click twice in a row to get mode
//    change." Driven through the REAL toolbar button and its own click handler -- not the
//    zoomToolShape/setMode primitives sections 3-3e use directly -- because the whole defect was
//    in what the CLICK HANDLER did before reaching those primitives.
// ---------------------------------------------------------------------------
console.log('\n--- 6. the toolbar button: first press fits and says so; only a SECOND, CONSECUTIVE press enters Zoom Window ---');
{
	function findByDataTool(root, tool) {
		if (!root || !root.children) { return null; }
		for (const c of root.children) {
			if (c.dataset && c.dataset.tool === tool && String(c.tagName) === 'BUTTON') { return c; }
			const found = findByDataTool(c, tool);
			if (found) { return found; }
		}
		return null;
	}
	function click(btn) { (btn._listeners.click || []).forEach(function (fn) { fn({}); }); }
	const pc = global.EngCalcs.pageConfig;

	reset();
	svg._listeners = {};
	L.wirePointerEvents();
	stub.byId.lpn_toolbar.children.length = 0;   // a clean strip: wireToolbar() appends, it does not replace
	L.wireToolbar();
	const btn = findByDataTool(stub.byId.lpn_toolbar, 'zoom-window');
	ok('the button is on the strip', !!btn);
	if (btn) {
		// **WORDING ASSERTED THROUGH pageConfig KEYS, NEVER AN ENGLISH LITERAL** (harness_wording_check.php).
		ok('it opens showing Zoom to fit', btn.getAttribute('aria-label') === pc.lpn_tool_zoom_extent);

		click(btn);
		ok('...the face still says Zoom to fit after the first press -- R-181\'s whole point',
			btn.getAttribute('aria-label') === pc.lpn_tool_zoom_extent);
		ok('...and the tool has NOT entered zoom-window mode yet', L.getMode() !== 'zoom-window');
		ok('...armed, waiting for a second press', L.getZoomToolArmed());

		click(btn);
		ok('the SECOND, CONSECUTIVE press flips the face to Zoom Window',
			btn.getAttribute('aria-label') === pc.lpn_tool_zoom_window);
		ok('...and enters the mode', L.getMode() === 'zoom-window');
		ok('...un-arming itself', !L.getZoomToolArmed());

		// Exit and start over, to test the intervening-action reset in isolation.
		L.setMode('select');
		L.setZoomToolShape('fit');

		click(btn);
		ok('re-armed after a fresh first press', L.getZoomToolArmed());
		// **ANY OTHER MODE CHANGE IN BETWEEN RESETS IT** (Ida's spec) -- picking a different tool is
		// exactly the "something else pressed in between" case R-181 is about.
		L.setMode('select-area');
		ok('an intervening tool change un-arms it', !L.getZoomToolArmed());
		L.setMode('select');
		click(btn);
		ok('...so the very next press is a first press again, not a second one',
			btn.getAttribute('aria-label') === pc.lpn_tool_zoom_extent && L.getMode() !== 'zoom-window');
	}
}

console.log('\n' + checks + ' checks, ' + failures + ' failed');
process.exit(failures ? 1 : 0);
