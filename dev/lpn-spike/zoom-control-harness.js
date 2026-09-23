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
	"\t\tsetZoomToolArmed: function (v) { zoomToolArmed = v; },\n" +
	"\t\tzoomWindowOpen: function () { return !!zoomWinDrag; },\n" +
	"\t\tclearPointers: function () { pointers.clear(); },\n" +
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
	// setMode('select') above is a no-op on `zoomToolArmed` whenever the mode was ALREADY 'select'
	// (its own reset only fires `if (newMode !== mode)`), so a test block left armed by the one
	// before it would otherwise start the next block with a stale "second press" already loaded.
	L.setZoomToolArmed(false);
	// A section that leaves the mode mid-drag (3e) never fires a matching pointerup -- its whole
	// point is testing what happens when the pointer is never released -- so the module's own
	// `pointers` Map (the multi-touch/pinch tracker) can carry a stale entry into the next block.
	// Left alone, a later section's first real press would misread `pointers.size === 2` as a
	// pinch and skip its own pointerdown handling entirely.
	L.clearPointers();
}
function fire(type, ev) { stub.setHitTarget(null); (svg._listeners[type] || []).forEach(function (fn) { fn(ev); }); }
function keydown(props) {
	const ev = Object.assign({ key: '', ctrlKey: false, metaKey: false, altKey: false,
		target: { tagName: 'BODY' }, preventDefault: function () {} }, props);
	(global.document._listeners.keydown || []).slice().forEach(function (fn) { fn(ev); });
}
// **A DOCUMENT-LEVEL pointerdown, the way `wireZoomArmReset()`'s capture listener actually
// receives one** -- this stub does not model event bubbling (dev/testing-notes.md's own reason for
// document._listeners existing at all: a listener there is only ever exercised by dispatching to it
// directly), so a click that lands on the CANVAS still has to be delivered to `document`'s own
// listeners by hand, exactly as `fire()` above does for `svg`'s.
function docPointerdown(target) {
	(global.document._listeners.pointerdown || []).slice().forEach(function (fn) { fn({ target: target }); });
}
// Shared by every toolbar-button test below.
function findByDataTool(root, tool) {
	if (!root || !root.children) { return null; }
	for (const c of root.children) {
		if (c.dataset && c.dataset.tool === tool && String(c.tagName) === 'BUTTON') { return c; }
		const found = findByDataTool(c, tool);
		if (found) { return found; }
	}
	return null;
}
function clickBtn(btn) { (btn._listeners.click || []).forEach(function (fn) { fn({}); }); }
// Built once per test that needs it: a clean strip (wireToolbar() APPENDS, it does not replace)
// with the real click/pointerdown/keydown wiring, and the button `findByDataTool()` then locates.
function buildZoomToolButton() {
	svg._listeners = {};
	L.wirePointerEvents();
	stub.byId.lpn_toolbar.children.length = 0;
	L.wireToolbar();
	return findByDataTool(stub.byId.lpn_toolbar, 'zoom-window');
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
	const pc = global.EngCalcs.pageConfig;
	reset();
	const btn = buildZoomToolButton();
	ok('the button is on the strip', !!btn);
	if (btn) {
		// **WORDING ASSERTED THROUGH pageConfig KEYS, NEVER AN ENGLISH LITERAL** (harness_wording_check.php).
		ok('it opens showing Zoom to fit', btn.getAttribute('aria-label') === pc.lpn_tool_zoom_extent);

		clickBtn(btn);
		ok('...the face still says Zoom to fit after the first press -- R-181\'s whole point',
			btn.getAttribute('aria-label') === pc.lpn_tool_zoom_extent);
		ok('...and the tool has NOT entered zoom-window mode yet', L.getMode() !== 'zoom-window');
		ok('...armed, waiting for a second press', L.getZoomToolArmed());

		clickBtn(btn);
		ok('the SECOND, CONSECUTIVE press flips the face to Zoom Window',
			btn.getAttribute('aria-label') === pc.lpn_tool_zoom_window);
		ok('...and enters the mode', L.getMode() === 'zoom-window');
		ok('...un-arming itself', !L.getZoomToolArmed());

		// Exit and start over, to test the intervening-action reset in isolation.
		L.setMode('select');
		L.setZoomToolShape('fit');

		clickBtn(btn);
		ok('re-armed after a fresh first press', L.getZoomToolArmed());
		// **ANY OTHER MODE CHANGE IN BETWEEN RESETS IT** (Ida's spec) -- picking a different tool is
		// exactly the "something else pressed in between" case R-181 is about.
		L.setMode('select-area');
		ok('an intervening tool change un-arms it', !L.getZoomToolArmed());
		L.setMode('select');
		clickBtn(btn);
		ok('...so the very next press is a first press again, not a second one',
			btn.getAttribute('aria-label') === pc.lpn_tool_zoom_extent && L.getMode() !== 'zoom-window');
	}
}

// ---------------------------------------------------------------------------
// 6b-6d. THE GAP THE PRE-REVIEW FOUND, 2026-09-23: setMode()'s own reset only fires on a change of
// MODE, and an ordinary click on the map that selects or deselects something NEVER changes mode --
// Select mode stays 'select' throughout. Confirmed live in Chromium: press Zoom to fit, click a map
// element, press the button again, and it jumped straight to Zoom Window with no drag or
// click-click ever asked for. These three drive the REAL document-level pointerdown/keydown
// listeners `wireZoomArmReset()` installs (never the internal setMode()/zoomToolArmed primitives
// directly), because the whole defect was in what reaches those listeners.
// ---------------------------------------------------------------------------
console.log('\n--- 6b. an ordinary pointerdown on the map, between two presses, also un-arms it ---');
{
	reset();
	const btn = buildZoomToolButton();
	clickBtn(btn);
	ok('armed after the first press', L.getZoomToolArmed());
	// The map itself -- an ordinary select/deselect click, never a mode change (`mode` stays
	// 'select' throughout; setMode() is never called).
	docPointerdown(svg);
	ok('an ordinary map click un-arms it, even though mode never changed', !L.getZoomToolArmed());
	clickBtn(btn);
	ok('so the next press fits again rather than entering Zoom Window',
		L.getMode() !== 'zoom-window' && L.getZoomToolArmed());
}

console.log('\n--- 6c. pressing a DIFFERENT toolbar button (e.g. opening a menu) also un-arms it ---');
{
	reset();
	const btn = buildZoomToolButton();
	clickBtn(btn);
	ok('armed after the first press', L.getZoomToolArmed());
	// Any other control -- a menu bar button, a different toolbar tool -- is simply "not this
	// button", and the reset listener does not special-case which one it was.
	docPointerdown(document.body);
	ok('pressing something else on the page un-arms it', !L.getZoomToolArmed());
	clickBtn(btn);
	ok('so the next press fits again rather than entering Zoom Window',
		L.getMode() !== 'zoom-window' && L.getZoomToolArmed());
}

console.log('\n--- 6d. a keydown that is not this button\'s own activation un-arms it; the button\'s own does not ---');
{
	reset();
	let btn = buildZoomToolButton();
	clickBtn(btn);
	ok('armed after the first press', L.getZoomToolArmed());
	keydown({ key: 'Tab' });   // an ordinary keydown elsewhere, default target {tagName:'BODY'}
	ok('an unrelated keydown un-arms it', !L.getZoomToolArmed());

	btn = buildZoomToolButton();
	clickBtn(btn);
	ok('armed again after a fresh first press', L.getZoomToolArmed());
	// The button's OWN keyboard activation (Enter/Space while it holds focus) must not un-arm the
	// very press it is in the middle of -- a real Enter on a focused button fires 'keydown' with
	// the button as target, then the browser's own synthesized 'click'.
	keydown({ key: 'Enter', target: btn });
	ok('...but a keydown ON THE BUTTON ITSELF leaves it armed', L.getZoomToolArmed());
}

// ---------------------------------------------------------------------------
// 7. TOM'S OWN VERBATIM SEQUENCE, 2026-09-23: "When I click twice, then zoom to a window with two
// map clicks, then click Zoom to Fit, it doesn't work... Note that all the worse with this bug,
// when I fail to get Zoom to Fit and I click the button a second time, it gives me Zoom Window."
// Driven end to end through the REAL button and the REAL document-capture listener
// `wireZoomArmReset()` installs -- a map pointerdown is delivered to `document`'s capture-phase
// listener FIRST, exactly as a real browser's capturing phase runs before the target's own
// listener, and only then to the canvas's own handler, so a defect in that ordering (the "map
// clicks that define the window are not counted as a map click for the reset" half of the brief)
// would show up here, not just in the internal-primitive drives sections 3-3e already do.
// ---------------------------------------------------------------------------
console.log('\n--- 7. Tom\'s sequence: press, press, click, click, press => fitted; press => armed ---');
{
	reset();
	const btn = buildZoomToolButton();
	function mapDown(props) { docPointerdown(svg); fire('pointerdown', props); }
	function mapUp(props) { fire('pointerup', props); }
	function pressBtn() { docPointerdown(btn); clickBtn(btn); }

	pressBtn();
	ok('first press fits, and stays on Zoom to fit', L.getMode() !== 'zoom-window' && L.getZoomToolArmed());
	const fitS = L.getState().s;

	pressBtn();
	ok('second, consecutive press arms Zoom Window', L.getMode() === 'zoom-window');

	// The two map clicks that draw the window -- click a corner, click the opposite corner.
	mapDown({ pointerId: 21, clientX: 150, clientY: 120, pointerType: 'mouse', button: 0 });
	mapUp({ pointerId: 21, clientX: 150, clientY: 120, pointerType: 'mouse' });
	ok('the first map click opens the box, not yet committed', L.zoomWindowOpen());
	mapDown({ pointerId: 21, clientX: 650, clientY: 420, pointerType: 'mouse', button: 0 });
	mapUp({ pointerId: 21, clientX: 650, clientY: 420, pointerType: 'mouse' });
	ok('the second map click commits the window and returns to Select',
		L.getMode() === 'select' && !L.zoomWindowOpen());
	ok('...and the button face falls back to Zoom to fit', L.getZoomToolShape() === 'fit');
	const windowS = L.getState().s;
	ok('the window actually changed the view (a real zoom happened)', windowS !== fitS);

	// Tom's defect: the VERY NEXT press of the button, right after the window completes.
	pressBtn();
	ok('the next press fits the whole network again, not a no-op and not blank',
		Math.abs(L.getState().s - fitS) < 1e-6, 'got s=' + L.getState().s + ' want ' + fitS);
	ok('...it did NOT jump straight into Zoom Window', L.getMode() !== 'zoom-window');
	ok('...and it is now armed for a genuine second press', L.getZoomToolArmed());

	// A press right after THAT, in a row, is what arms Zoom Window -- never a dead end.
	pressBtn();
	ok('a press after that, in a row, arms Zoom Window (no sequence is ever a no-op)',
		L.getMode() === 'zoom-window');
}

console.log('\n' + checks + ' checks, ' + failures + ' failed');
process.exit(failures ? 1 : 0);
