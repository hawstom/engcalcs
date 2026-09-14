// DRAGGING A PANEL, AND RESIZING A PANE, SURVIVE A REFUSED POINTER CAPTURE -- ROADMAP Task 660.
// Run with:
//   node dev/lpn-spike/panel-capture-harness.js
//
// The sibling of pointer-capture-harness.js, and it exists because that harness's own header was
// WRONG. It said the other setPointerCapture() calls in js/looped-network.js "were already wrapped
// in try/catch". They were not:
//
//   * the two pane grips were feature TESTED -- `if (grip.setPointerCapture)` -- which guards a
//     method that is MISSING, and does nothing at all about one that THROWS; and
//   * makePanelDraggable(), which carries every floating box on this page (the element popup,
//     Find, Settings, the two fire-flow boxes, the report box, the run panel), called it guarded
//     by NOTHING.
//
// setPointerCapture() throws NotFoundError when the browser has stopped treating the pointer as
// active, and Chromium's Wayland backend under WSLg is a place that happens -- that is the whole of
// Task 658, one line further up the same file.
//
// **THESE THREE SITES ARE LESS SEVERE THAN THE CANVAS ONE, AND SAYING SO IS THE POINT.** All three
// record their drag BEFORE asking for the capture, so a throw does not destroy the gesture the way
// Task 658's did -- the box still moves and the pane still resizes. What a throw takes is the
// `e.preventDefault()` on the very next line, which is what stops the browser running its own
// default over the press (a text-selection drag across the panel), plus an uncaught error out of a
// pointerdown handler on every single press. That is worth the guard on its own, and the ordering
// that makes it survivable is an accident nobody wrote down: put the capture first, as the canvas
// did, and these become the canvas defect.
//
// **THE ASSERTION IS NOT "CAPTURE WORKS".** Capture is an optimisation in all three places: it
// keeps pointermove arriving when the pointer leaves the element. So what is asserted is that a
// REFUSED capture leaves no throw behind and still calls preventDefault().
//
// ---------------------------------------------------------------------------------------------
// **THE ONE-MINUTE TEST FOR A MACHINE WHERE SOMETHING IS BROKEN AND THIS TREE LOOKS FINE.**
// Task 660 was opened on *"Double-click on file fails to open in Chrome. Must use 'Open' button."*
// (Tom, 2026-09-13, Ubuntu Chrome under WSLg). **That file list is not ours.** Opening a project
// goes through `window.showOpenFilePicker()` (js/looped-network.js, openFromFile), and where the
// File System Access API is absent through a hidden `<input type="file">`; both put up the
// BROWSER'S OWN file chooser, and this page is not running while it is on screen. There is no
// in-page list of files anywhere on this page -- the recent-files rows in the File menu open on a
// SINGLE click, and the only dblclick listeners in the file are the map canvas, the element popup
// and a table cell.
//
// So the question to settle first is whether double-click works AT ALL on that machine. Paste this
// into the DevTools console on the map page and then double-click a few things:
//
//   (function () {
//     var n = { click: 0, dblclick: 0, detail2: 0 };
//     ['click', 'dblclick'].forEach(function (k) {
//       document.addEventListener(k, function (e) {
//         n[k]++; if (e.detail >= 2) { n.detail2++; }
//         console.log(k, 'detail=' + e.detail, (e.target.id || e.target.nodeName));
//       }, true);
//     });
//     setTimeout(function () { console.log('TOTALS', n); }, 15000);
//   }());
//
// Read it this way. `dblclick` never appearing, or `click` arriving with `detail=1` twice in a row
// when you double-clicked, means the BROWSER is not pairing the two presses -- nothing in this page
// can cause that and nothing in this page can fix it, and the native file chooser will be failing
// the same way. `dblclick` appearing normally means the page is getting the gesture and the problem
// is inside the chooser alone. Either answer is worth a minute: a double-click that works here and
// fails there is the file chooser's; one that fails in both is the machine's, and the single-click
// route (select the file, press Open) is the one to demonstrate from.

'use strict';

const { byId, ensure, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');

// `mutate` is used in section 5 below, so the load is wrapped.
function load(mutate) {
	return loadLoopedNetwork(
		"\t\tmakePanelDraggable: makePanelDraggable,\n" +
		"\t\twirePane: wirePane, wireRightPane: wireRightPane,\n" +
		"\t\tpaneHeight: function () { return paneState.h; },\n" +
		"\t\trpaneWidth: function () { return rpaneState.w; },\n",
		null, mutate);
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

function makePanel(doc) {
	const p = doc.createElement('div');
	p.style.left = '100px'; p.style.top = '50px';
	p.style.width = '300px'; p.style.height = '200px';
	return p;
}
function fire(el, type, ev) { (el._listeners[type] || []).slice().forEach(function (fn) { fn(ev); }); }
function ev(el, x, y) {
	const e = { pointerId: 7, clientX: x, clientY: y, target: el, prevented: 0 };
	e.preventDefault = function () { e.prevented++; };
	return e;
}

// ---- 1 & 2: a floating box -------------------------------------------------------------------
function dragPanelCase(label, capture, L) {
	const panel = makePanel(global.document);
	panel.setPointerCapture = capture;
	panel.hasPointerCapture = function () { return false; };
	L.makePanelDraggable(panel, null);
	const press = ev(panel, 150, 80);
	let escaped = false;
	try { fire(panel, 'pointerdown', press); } catch (err) { escaped = true; }
	fire(panel, 'pointermove', ev(panel, 250, 180));
	fire(panel, 'pointerup', ev(panel, 250, 180));
	return { panel: panel, escaped: escaped, prevented: press.prevented };
}

const L = load();
setUnitSet('us');

console.log('--- 1. the ordinary case: a box drags, and capture is granted ---');
let calls = 0;
let r = dragPanelCase('granted', function () { calls++; }, L);
ok('the box was asked to capture the pointer', calls === 1, calls);
ok('and the box MOVED by the drag delta in x', r.panel.style.left === '200px', r.panel.style.left);
ok('...and in y', r.panel.style.top === '150px', r.panel.style.top);
ok('and the browser default was prevented', r.prevented === 1, r.prevented);

console.log('--- 2. THE DEFECT: the browser REFUSES the capture ---');
let thrown = 0;
r = dragPanelCase('refused', function () {
	thrown++; const e = new Error('NotFoundError'); e.name = 'NotFoundError'; throw e;
}, L);
ok('the browser did refuse the capture', thrown === 1, thrown);
ok('THE THROW DID NOT ESCAPE the pointerdown handler', !r.escaped);
ok('the box still dragged in x (it does either way -- a control)', r.panel.style.left === '200px', r.panel.style.left);
ok('...and in y', r.panel.style.top === '150px', r.panel.style.top);
ok('AND preventDefault() STILL RAN, which the throw used to skip -- this is the repair', r.prevented === 1, r.prevented);

console.log('--- 3. releasing a capture the browser already took back ---');
{
	const panel = makePanel(global.document);
	panel.setPointerCapture = function () { };
	// hasPointerCapture() says yes and release then throws: the capture was lost between the two
	// calls, which is exactly the window a guard written as `if (hasPointerCapture)` cannot close.
	panel.hasPointerCapture = function () { return true; };
	panel.releasePointerCapture = function () { const e = new Error('NotFoundError'); e.name = 'NotFoundError'; throw e; };
	L.makePanelDraggable(panel, null);
	fire(panel, 'pointerdown', ev(panel, 150, 80));
	fire(panel, 'pointermove', ev(panel, 260, 190));
	let escaped = false;
	try { fire(panel, 'pointerup', ev(panel, 260, 190)); } catch (err) { escaped = true; }
	ok('no throw escaped the pointerup handler', !escaped);
	ok('and the box is where the drag left it', panel.style.left === '210px', panel.style.left);
}

// **WHAT THE GRIPS LOSE IS NOT THE RESIZE, AND SAYING SO IS THE POINT.** In both grip handlers
// `dragFrom` is recorded BEFORE the capture is asked for, so the drag record survives a throw and
// the pane does still resize -- unlike the canvas press of Task 658, where the capture came first
// and the whole gesture died. What the throw takes is `e.preventDefault()` on the line after it,
// which is what stops the browser running its own default over the grip, plus an uncaught error
// out of a pointerdown handler on every press. So the resize is asserted as a control and the
// REPAIR is asserted on the escape and on preventDefault.
console.log('--- 4. the two pane grips: a feature test is not a throw guard ---');
function gripCase(which, lib) {
	ensure('lpn_pane'); ensure('lpn_pane_body'); ensure('lpn_rpane');
	const grip = ensure(which === 'pane' ? 'lpn_pane_grip' : 'lpn_rpane_grip');
	grip._listeners = {};
	grip.setPointerCapture = function () { const e = new Error('NotFoundError'); e.name = 'NotFoundError'; throw e; };
	const K = lib || L;
	if (which === 'pane') { K.wirePane(); } else { K.wireRightPane(); }
	const before = which === 'pane' ? K.paneHeight() : K.rpaneWidth();
	let escaped = false;
	const press = ev(grip, 400, 400);
	try { fire(grip, 'pointerdown', press); } catch (err) { escaped = true; }
	// UP IS TALLER for the bottom pane; LEFT IS WIDER for the right one. Either way the drag must
	// have reached the layout at all, which is what a dead pointerdown prevents.
	fire(grip, 'pointermove', which === 'pane' ? ev(grip, 400, 340) : ev(grip, 340, 400));
	const after = which === 'pane' ? K.paneHeight() : K.rpaneWidth();
	return { escaped: escaped, before: before, after: after, prevented: press.prevented };
}
{
	const g = gripCase('pane');
	ok('the bottom pane grip did not let the throw escape', !g.escaped);
	ok('and preventDefault() still ran', g.prevented === 1, g.prevented);
	ok('and the pane resized, as it does either way', g.after !== g.before, g.before + ' -> ' + g.after);
}
{
	const g = gripCase('rpane');
	ok('the right pane grip did not let the throw escape', !g.escaped);
	ok('and preventDefault() still ran', g.prevented === 1, g.prevented);
	ok('and the pane resized, as it does either way', g.after !== g.before, g.before + ' -> ' + g.after);
}

console.log('--- 5. MUTATION: take the panel guard out and section 2 must go red ---');
{
	// The live mutation this project requires of a check that passes by finding nothing. The guard
	// is removed from the SOURCE and the same drag is run again; a harness that still passed here
	// would be asserting a property the page happens to have rather than the repair.
	const M = load(function (src) {
		return src.replace(
			'try { popup.setPointerCapture(e.pointerId); } catch (err) { /* drag without capture */ }',
			'popup.setPointerCapture(e.pointerId);');
	});
	const m = dragPanelCase('mutated', function () {
		const e = new Error('NotFoundError'); e.name = 'NotFoundError'; throw e;
	}, M);
	ok('WITHOUT the guard the throw escapes', m.escaped);
	ok('...and preventDefault() never ran', m.prevented === 0, m.prevented);
}

console.log('--- 6. MUTATION: put the pane grip back to a feature test and section 4 must go red ---');
{
	// The shape the file actually shipped: `if (grip.setPointerCapture)`. It is a guard against a
	// method that does not exist, and the method DOES exist -- so this is the source line that let
	// the throw out, restored verbatim.
	const M = load(function (src) {
		return src.replace(
			'try { if (grip.setPointerCapture) { grip.setPointerCapture(e.pointerId); } } catch (err) { /* resize without capture */ }',
			'if (grip.setPointerCapture) { grip.setPointerCapture(e.pointerId); }');
	});
	const g = gripCase('pane', M);
	ok('WITH only the feature test the throw escapes', g.escaped);
	ok('...and preventDefault() never ran', g.prevented === 0, g.prevented);
}

console.log('');
console.log(fails === 0 ? 'All panel pointer-capture checks passed.' : fails + ' FAILURE(S)');
process.exit(fails === 0 ? 0 : 1);
