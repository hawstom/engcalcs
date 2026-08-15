// Zoom to fit gives the same answer every time. Run with:
//   node dev/lpn-spike/zoom-fit-harness.js
//
// THE PROPERTY UNDER TEST IS DETERMINISM, not prettiness: fitting a drawing must depend on the
// DRAWING, the VIEWPORT and the SETTINGS, and on nothing else. In particular it must not depend on
// the view you happened to be at when you pressed the button, or on how far through its own boot
// the page had got. Both of those had crept in by 2026-08-15, from opposite directions, and Tom hit
// them as one symptom: "The model that is current when the page is reloaded gets zoom in" and
// "Switching tabs still changes the zoom."
//
//   * THE OVERLAY RESERVE. zoomExtent() reserves room at the top for #lpn_mode_hint and at the
//     bottom for #lpn_map_footer, both of which are EMPTY IN THE MARKUP and filled in by JS. The old
//     overlayReserve() returned 0 for an element with no text, so a fit that ran before those were
//     filled took ~25px back as drawing room and came out zoomed in relative to every later fit.
//     Tom guessed this one from the outside — "Could it be affected by the Mode string?" — and he
//     was right.
//   * THE LABEL BOXES. Task 357 taught bbox() to skip labels the current zoom is not drawing, which
//     is the right answer to "fit what is on screen" and the wrong INPUT to the thing that decides
//     the zoom. Whether labels were hidden depended on the previous project's scale, so the same
//     drawing fitted differently after a reload than after a tab switch.
//
// Both are tested here by DOING IT TWICE FROM DIFFERENT STATES and comparing, which is the only
// form of this assertion that cannot pass by accident.

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, refreshLabelText: refreshLabelText,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tsetSetting: function (k, v) { settings[k] = v; },\n" +
	"\t\tzoomExtent: zoomExtent, bbox: bbox, reserve: overlayReserve,\n" +
	// The canvas is authored 10000px tall and only becomes real when applyMapHeight() sizes it.
	// A harness that never calls that has to say so, exactly as the page does.
	"\t\tmarkSized: noteMapSized, isSized: function () { return mapSized; },\n" +
	"\t\tscale: function () { return state.s; },\n" +
	// How many times a fit re-lays-out. This is the number the whole redesign is about, so it is
	// measured rather than described: the version before it spent eight, one per convergence pass.
	"\t\tcountLayouts: function (f) { var n = 0, real = onZoomChanged;\n" +
	"\t\t\tonZoomChanged = function () { n++; return real.apply(null, arguments); };\n" +
	"\t\t\ttry { f(); } finally { onZoomChanged = real; } return n; },\n" +
	"\t\tview: function () { return { tx: state.tx, ty: state.ty, s: state.s }; },\n" +
	// A REAL ZOOM RE-LAYS-OUT, and the harness has to as well. Every zoom path in the page goes
	// through onZoomChanged(), which re-measures every label at the new scale -- so a label's
	// measured width always corresponds to the scale in force. Setting state.s alone produces a
	// state the browser can never be in (widths belonging to one scale, transform at another), and
	// the fit reads both.
	"\t\tsetZoom: function (s) { state.s = s; setTransform(); onZoomChanged(); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h;\n" +
	"\t\t\tsvg.getBoundingClientRect = function () { return { top: 0, bottom: h, width: w, height: h }; }; },\n" +
	"\t\tsetOverlay: function (id, text, h) { var e = document.getElementById(id);\n" +
	"\t\t\te.textContent = text; e.offsetHeight = h; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tmaskLayer = el('g', {}, world); labelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
const view = () => JSON.stringify(L.view());
// EXACT EQUALITY IS THE WRONG ASSERTION AND IT TOOK A FAILING TEST TO SEE IT. The fit is a
// numerical FIXED POINT -- a label's world footprint is proportional to 1/scale, so the box being
// fitted is a function of the scale being solved for -- and an iteration to a fixed point agrees to
// its tolerance, not to the last bit. What must be true is that the residue is far below anything a
// reader could see. A tenth of a percent on a 700px canvas is under a pixel.
function same(a, b, tol) {
	const x = JSON.parse(a), y = JSON.parse(b), t = tol === undefined ? 1e-3 : tol;
	const rel = (p, q) => Math.abs(p - q) / Math.max(1, Math.abs(q));
	return rel(x.s, y.s) < t && rel(x.tx, y.tx) < t && rel(x.ty, y.ty) < t;
}

// **THE STUB MUST MODEL THE ONE PHYSICAL FACT THIS BUG IS MADE OF**, or the harness cannot see it.
// A label is sized in SCREEN PIXELS, so the world width getBBox() reports shrinks as you zoom in --
// which is precisely why the box being fitted depends on the scale being solved for. The default
// stub returns a constant 10 and would let a one-pass fit look convergent. Here every element
// created from now on reports a 60px run of text converted into world units at the CURRENT scale,
// the way a browser does.
const rawCreate = document.createElementNS;
document.createElementNS = function (ns, tag) {
	const e = rawCreate.call(document, ns, tag);
	e.getBBox = function () {
		const s = L.scale() || 1;
		return { x: 0, y: 0, width: 60 / s, height: 11 / s };
	};
	return e;
};

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
L.setCanvas(1400, 700);

// ---- 0. A fit asked for before the canvas is sized is DEFERRED, not answered wrongly ----------
console.log('--- a fit against an unsized canvas waits instead of guessing ---');
{
	// This runs first because it is the only state the page passes through exactly once: the canvas
	// still carries its markup height, which is a deliberate curtain far taller than any window.
	// Fitting against it divides the drawing into 10000px of height, so the height ratio never wins
	// and the drawing is fitted to WIDTH ALONE -- a drastic zoom-in, and the one Tom saw on reload.
	const a0 = L.addNode('junction', 0, 0), b0 = L.addNode('junction', 100, 0);
	L.addLink('pipe', a0.id, b0.id);
	L.setZoom(1);
	const before = view();
	ok('the canvas starts unsized', !L.isSized());
	L.zoomExtent();
	ok('...so a fit asked for now changes nothing at all', view() === before, view());
	L.markSized();
	ok('...and the deferred fit runs the moment the canvas has a real height', view() !== before,
		view());
	// Cleaned up so the sections below start from the network they expect.
	L.getDoc().nodes.length = 0; L.getDoc().links.length = 0;
}

// A network big enough that label boxes matter to the fit.
const a = L.addNode('junction', 0, 0);
const b = L.addNode('junction', 600, 0);
const c = L.addNode('junction', 600, 400);
L.addLink('pipe', a.id, b.id);
L.addLink('pipe', b.id, c.id);
L.labelSettings().link.id = true;
L.labelSettings().node.id = true;
L.refreshLabelText();

// ---- 1. The same drawing fits the same way from any starting view -----------------------------
console.log('--- the fit does not depend on the view it started from ---');
{
	L.setOverlay('lpn_mode_hint', 'Select', 17);
	L.setOverlay('lpn_map_footer', 'Flow: gpm', 17);

	L.setZoom(1);
	L.zoomExtent();
	const fromOne = view();
	// Arrive from somewhere wildly different -- which is what switching projects does, since the
	// previous project leaves its own scale behind.
	L.setZoom(37);
	L.zoomExtent();
	ok('fitting from a 37x view lands where fitting from 1x did', same(view(), fromOne),
		fromOne + ' vs ' + view());
	L.setZoom(0.02);
	L.zoomExtent();
	ok('...and so does fitting from a 0.02x view', same(view(), fromOne), view());
	// The residue is worth measuring rather than merely bounding, and worth stating in PIXELS --
	// the unit the reader actually has. A relative scale difference of d puts the far edge of a
	// 1400px canvas d*1400 pixels from where the other pass put it.
	const drift = Math.abs(JSON.parse(view()).s - JSON.parse(fromOne).s) / JSON.parse(fromOne).s;
	ok('...to well under a pixel across the whole canvas',
		drift * 1400 < 1, (drift * 1400).toFixed(3) + 'px across a 1400px canvas');
	// WHICH CONSTANT IS LOAD-BEARING: the PASS CAP, not the tolerance. Convergence is geometric, so
	// by the time consecutive passes differ by even 1% the answer is already far closer than that --
	// loosening LPN_FIT_TOLERANCE alone does not move the result, while dropping to one pass fails
	// six of these checks. Recorded because a future reader tuning the wrong knob would find it
	// does nothing and conclude the loop is decorative.
	// Twice in a row from the same place is the weakest form and would pass even for the broken
	// version, so it is here only to prove the fit is not accumulating anything.
	L.zoomExtent();
	ok('...and fitting twice in a row changes nothing', same(view(), fromOne), view());
	// THE POINT OF THE WHOLE REDESIGN, stated as a number. Solving the continuous part in closed
	// form means the re-layouts are no longer a convergence budget -- they only confirm that the
	// layout belongs to the scale that was chosen, which takes two.
	const layouts = L.countLayouts(() => L.zoomExtent());
	ok('a fit costs two re-layouts, not eight', layouts <= 2, layouts + ' re-layout(s)');
	// NOT COVERED HERE, and said so rather than implied: the too-short-pipe rule inside fitItems()
	// never fires on this fixture, because every pipe in it is long compared with its label.
	// dev/lpn-spike/short-line-label-harness.js owns that rule; what is missing is a case where it
	// changes the FIT, which would need a stub pipe added to the network above.
}

// ---- 2. ...including when a label threshold is in force ----------------------------------------
console.log('\n--- with a label threshold set, which is where the zoom-dependence lived ---');
{
	// A threshold the fitted view will be on the far side of, so the second pass really runs.
	L.setSetting('labelMaxWidth', 100);
	L.setZoom(1);
	L.zoomExtent();
	const fromOne = view();
	L.setZoom(80);
	L.zoomExtent();
	ok('a threshold does not make the fit depend on the previous scale', same(view(), fromOne),
		fromOne + ' vs ' + view());
	// And the two-pass rule must actually be doing something, or the check above is vacuous: the
	// tighter bbox (labels ignored) has to differ from the full one.
	const full = L.bbox(), tight = L.bbox({ ignoreDataLabels: true });
	ok('...and the two bounding boxes really are different, so pass 2 is not a no-op',
		JSON.stringify(full) !== JSON.stringify(tight),
		JSON.stringify(full) + ' vs ' + JSON.stringify(tight));
	L.setSetting('labelMaxWidth', null);
}

// ---- 3. The overlay reserve is not a function of when you asked --------------------------------
console.log('\n--- an overlay reserves its space before it has any text in it ---');
{
	// THE BOOT CASE. #lpn_mode_hint and #lpn_map_footer are empty in the markup and filled by JS, so
	// a fit during boot used to see two empty elements and reserve nothing at all.
	L.setOverlay('lpn_mode_hint', '', 0);
	L.setOverlay('lpn_map_footer', '', 0);
	const empty = L.reserve('lpn_mode_hint');
	ok('an unfilled overlay still reserves about a line', empty >= 15 && empty <= 40, empty);

	L.setZoom(1);
	L.zoomExtent();
	const beforeFill = view();
	// Now the page finishes booting and the strings arrive.
	L.setOverlay('lpn_mode_hint', 'Select', 17);
	L.setOverlay('lpn_map_footer', 'Flow: gpm', 17);
	L.setZoom(1);
	L.zoomExtent();
	// Not identical to the pixel -- a real one-line overlay may measure a couple of pixels off the
	// fallback -- but the SCALE must not jump, which is what "the reloaded model is zoomed in" was.
	const s0 = JSON.parse(beforeFill).s, s1 = JSON.parse(view()).s;
	ok('fitting before the overlays are filled gives the same scale as after',
		Math.abs(s0 - s1) / s1 < 0.02, s0 + ' vs ' + s1);
	// And the old behaviour, for contrast: reserving nothing would have handed the drawing the
	// overlay's whole height as extra room. On a 700px canvas that is a scale ~7% larger, which is
	// the "zoomed in" a reader notices.
	ok('...and NOT the several percent larger that reserving nothing would give',
		s0 / s1 < 1.02, (s0 / s1).toFixed(4));
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
