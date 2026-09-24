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
	"\t\tminScale: minScale,\n" +
	// The canvas is authored 10000px tall and only becomes real when applyMapHeight() sizes it.
	// A harness that never calls that has to say so, exactly as the page does.
	"\t\tmarkSized: noteMapSized, isSized: function () { return mapSized; },\n" +
	"\t\tnodeEl: function (id) { return nodeEls[id]; }, linkEl: function (id) { return linkEls[id]; },\n" +
	"\t\tboxWidth: labelBoxWidth,\n" +
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
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
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
	ok('...and so does fitting from a 0.02x view', same(view(), fromOne), fromOne + ' vs ' + view());
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
	// THE POINT OF THE WHOLE REDESIGN, stated as a number. The continuous part is solved in closed
	// form and the item list is built from the model, so nothing in the answer depends on a layout
	// -- which leaves exactly one re-layout, the one that draws the labels at the new scale. The
	// version this replaced spent eight, one per convergence pass.
	const layouts = L.countLayouts(() => L.zoomExtent());
	ok('a fit costs ONE re-layout, not eight', layouts === 1, layouts + ' re-layout(s)');
	// TOM'S OWN TEST, 2026-08-15: "open, reload, or switch and then zoom extents. Ideally nothing
	// happens." Nothing happening is IDEMPOTENCE, and it is a stronger property than the
	// start-independence above: a fit must be a fixed point of itself, to the last bit, or every
	// press of the button walks the view a little further.
	const settled = view();
	L.zoomExtent();
	ok('pressing Zoom to fit again changes NOTHING -- not nearly nothing', view() === settled,
		settled + ' vs ' + view());
	L.zoomExtent(); L.zoomExtent();
	ok('...and it is still exactly the same after three more presses', view() === settled, view());
	// NOT COVERED HERE, and said so rather than implied: the too-short-pipe rule inside fitItems()
	// never fires on this fixture, because every pipe in it is long compared with its label.
	// dev/lpn-spike/short-line-label-harness.js owns that rule; what is missing is a case where it
	// changes the FIT, which would need a stub pipe added to the network above.
}

// ---- 2. ...and the two-pass fit really is two passes -------------------------------------------
// Pass 1 fits the MODEL ALONE (fitItems(scale, true)) so the answer cannot depend on the view we
// arrived from; pass 2 adds the label boxes worked out at pass 1's scale. If the two bounding boxes
// were the same the second pass would be a no-op and the first check in this file would be vacuous.
console.log('\n--- the model-only bbox and the full bbox differ, so pass 2 is doing something ---');
{
	L.setZoom(1);
	L.zoomExtent();
	const full = L.bbox(), tight = L.bbox({ ignoreDataLabels: true });
	ok('the two bounding boxes really are different',
		JSON.stringify(full) !== JSON.stringify(tight),
		JSON.stringify(full) + ' vs ' + JSON.stringify(tight));
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

// ---- 3b. A ZOOM DOES NOT MEASURE ANYTHING --------------------------------------------------
// Tom, 2026-08-15, with numbers: "Net3 with labels showing takes over 1 second to render on tab
// refocus. It takes 3/4 second to zoom to fit. Scroll zooms are about 1/4 second each."
//
// The cost was getBBox(): a zoom ran refreshLabelText(), which recomposes every node's and every
// link's text, rebuilds its tspans and re-measures each one -- ~220 forced synchronous layouts per
// wheel notch, to redraw glyphs that had not changed. Nothing about the CONTENT depends on the
// scale. The two things that did are gone: tspan `dy` is in `em` and follows the font-size by
// itself, and a measured width is banked in PIXELS and divided by the scale on read.
console.log('\n--- a zoom re-measures nothing ---');
{
	let measures = 0;
	const doc2 = L.getDoc();
	[...doc2.nodes, ...doc2.links].forEach(function (x) {
		const el = (L.nodeEl && L.nodeEl(x.id)) || (L.linkEl && L.linkEl(x.id));
		if (!el || !el.text || el.text._counted) { return; }
		const real = el.text.getBBox;
		el.text._counted = true;
		el.text.getBBox = function () { measures++; return real.apply(this, arguments); };
	});
	L.setZoom(2.5);
	ok('zooming measures no label at all', measures === 0, measures + ' getBBox call(s)');
	// And the width still tracks the scale, or the saving would be a lie told by a stale number.
	const le = L.linkEl(doc2.links[0].id);
	const wAt2 = L.boxWidth(le);
	L.setZoom(5);
	ok('...yet the world width still halves when the scale doubles',
		Math.abs(L.boxWidth(le) * 2 - wAt2) < 1e-9, wAt2 + ' -> ' + L.boxWidth(le));
}

// ---- 4. "Screen size" always says WHICH dimension ---------------------------------------------
// Tom, 2026-08-15: "One question is how transparent and pedantic to be about 'screen size'. I
// assume that we use, and possibly disclose, minimum or maximum or diagonal dimension. Being
// intentional and consistent about that... can only be a good thing." An audit that day found three
// conventions in use and not one of them named: max for the label repeat spacing, min for the fit,
// width alone for the label-visibility threshold that has since been removed altogether.
//
// CONSISTENCY IS NOT THE GOAL AND THAT IS THE POINT. Each answers a different question and the
// question picks the dimension -- min because "must all of it fit" is decided by the tighter side,
// max because a repeat should not crowd a wide window. What was wrong was that none of them said
// so. This asserts they still do.
// **A BIG LOCAL DRAWING MUST FIT ON A LAPTOP, AND THE ZOOM FLOOR MUST NOT STOP IT** (Tom,
// 2026-09-16, on the EWB demo file he was presenting the next morning: *"my zoom out is limited"*
// and *"Zoom to fit ... does not show the entire network. It's close, but it's not what we aim
// for."* Both symptoms, one cause.)
//
// `MIN_SCALE_GRID` is 0.05 whatever a drawing unit means, which caps the window at 20,000 units
// across. A sketch in inches never notices; a real site surveyed in feet -- his is about 13,000
// units across -- hits it, and then TWO things go wrong at once. The zoom stops, and Zoom to fit
// stops with it: `fitScaleFor()` answers the floor when nothing fits even there, so the fit is
// pinned at 0.05 and the network hangs off the top and the bottom of the window.
//
// **THE SHAPE IS MEASURED, NOT IMAGINED: 13,000 x 13,000 drawing units** is his file's extent to
// the nearest thousand, and 1400 x 640 is a laptop browser's map area. The case fails on the tree
// as it stood: fit 0.05, network 650 px tall, 10 px off each edge.
console.log('\n--- a big local drawing fits a laptop window, and can be pulled back from ---');
{
	L.getDoc().nodes.length = 0; L.getDoc().links.length = 0;
	L.setCanvas(1400, 640);
	const a = L.addNode('junction', 0, 0), b = L.addNode('junction', 13000, 0),
		c = L.addNode('junction', 13000, 13000), d = L.addNode('junction', 0, 13000);
	L.addLink('pipe', a.id, b.id); L.addLink('pipe', b.id, c.id);
	L.addLink('pipe', c.id, d.id); L.addLink('pipe', d.id, a.id);
	L.setZoom(0.05);
	L.zoomExtent();
	const v = L.view(), sc = v.s;
	// The four corners, on screen, against the window. A fit that does not show all four is not a
	// fit however close it looks.
	const px = (x) => v.tx + sc * x, py = (y) => v.ty + sc * y;
	const xs = [px(0), px(13000)], ys = [py(0), py(13000)];
	ok('the whole network is on screen after Zoom to fit',
		Math.min.apply(null, xs) >= 0 && Math.max.apply(null, xs) <= 1400 &&
		Math.min.apply(null, ys) >= 0 && Math.max.apply(null, ys) <= 640,
		'scale ' + sc.toExponential(3) + ', x ' + xs.map(Math.round).join('..')
			+ ', y ' + ys.map(Math.round).join('..') + ' in 1400x640');
	// **AND THE FLOOR IS THE OTHER HALF OF THE SAME BUG.** A fit that fits is no use if the reader
	// cannot then pull back to see the ground around it; 0.05 was 10% away from the fit on his file.
	ok('...and the zoom can still be pulled a long way back from there',
		L.minScale() < sc / 4,
		'fit ' + sc.toExponential(3) + ' against a floor of ' + L.minScale().toExponential(3));
	// **THE FLOOR MAY ONLY EVER LOOSEN, NEVER TIGHTEN**, which is the property that makes this safe
	// to change at all: no drawing loses zoom range it has today. A 100-unit sketch gets a slightly
	// LOWER floor than the old constant (4 px / 100 units = 0.04), which is the same rule applied
	// honestly rather than an exception -- it is still the scale at which the drawing is a four
	// pixel mark.
	L.getDoc().nodes.length = 0; L.getDoc().links.length = 0;
	const s1 = L.addNode('junction', 0, 0), s2 = L.addNode('junction', 100, 100);
	L.addLink('pipe', s1.id, s2.id);
	ok('...and no drawing is given a TIGHTER floor than the old fixed one',
		L.minScale() <= 0.05, String(L.minScale()));
	L.setCanvas(1400, 700);
}

// ---- 5. A DRAGGED LABEL DOES NOT THROW THE FIT OFF THE DRAWING (R-184) ------------------------
// Tom, 2026-09-23: after zooming in hard, *"Zoom to fit ... doesn't work. This presents as a
// catastrophic loss because my screen is blank."* Net1 as shipped carries dragged node labels, whose
// `lx`/`ly` are DRAWING UNITS; fitItems() counted them in the pixel reach at the scale it started
// from, so from scale 500 ten units of offset became 5,000 px and the fit framed empty paper. Section
// 1 missed it because nothing there had been dragged. Asserted from starting scales across the whole
// range, up to the ceiling: every node on the canvas, and the same scale as a fit from 1x.
console.log('\n--- a fit from any starting zoom, with dragged labels, shows every node ---');
{
	L.getDoc().nodes.length = 0; L.getDoc().links.length = 0;
	const p = L.addNode('junction', 0, 0), q = L.addNode('junction', 600, 0),
		r = L.addNode('junction', 600, 400), t = L.addNode('junction', 0, 400);
	L.addLink('pipe', p.id, q.id); L.addLink('pipe', q.id, r.id);
	const lk = L.addLink('pipe', r.id, t.id);
	// World offsets of the size a shipped example carries relative to its extent.
	p.lx = 30; p.ly = -25; q.lx = -40; q.ly = 20; r.lx = 25; r.ly = 30; lk.lx = 10; lk.ly = -35;
	L.refreshLabelText();
	L.setZoom(1);
	L.zoomExtent();
	const ref = L.view(), nodes = L.getDoc().nodes;
	const inside = (v) => nodes.every((n) => {
		const x = v.tx + v.s * n.x, y = v.ty + v.s * n.y;
		return x >= 0 && x <= 1400 && y >= 0 && y <= 700;
	});
	ok('fitting from 1x shows every node', inside(ref), JSON.stringify(ref));
	[0.05, 0.3, 3, 10, 30, 100, 250, 500].forEach((z) => {
		L.setZoom(z);
		L.zoomExtent();
		const v = L.view(), rel = Math.abs(v.s - ref.s) / ref.s;
		ok('from scale ' + z + ': every node on the canvas, scale within 2% of the 1x fit',
			inside(v) && rel < 0.02, 'scale ' + v.s.toFixed(4) + ' vs ' + ref.s.toFixed(4)
				+ ', tx ' + v.tx.toFixed(1) + ' vs ' + ref.tx.toFixed(1));
	});
	L.getDoc().nodes.length = 0; L.getDoc().links.length = 0;
}

console.log('\n--- every "map size" names its own dimension ---');
{
	const fs2 = require('fs');
	const src = fs2.readFileSync(require('path').join(__dirname, '../../js/looped-network.js'), 'utf8');
	const code = src.replace(/^[ \t]*\/\/.*$/gm, '');
	ok('there is one place that defines the vocabulary', /function mapSpan\(which\)/.test(code));
	ok('...offering min, max, diagonal and each axis',
		/'min'/.test(code) && /'diag'/.test(code) && /'w'/.test(code) && /'h'/.test(code));
	// The raw pair is what an unnamed convention looks like: Math.max(visibleMapWidth(),
	// visibleMapHeight()) tells a reader the answer but never the reason.
	ok('and nothing combines the two axes behind its back any more',
		!/Math\.(max|min|hypot)\(\s*visibleMapWidth\(\)/.test(code),
		'a raw Math.max/min over the two accessors is the unnamed form this replaced');
	// It is the MAP AREA, not the display -- narrower than the window and much shorter. No setting
	// row may promise a relationship to the SCREEN that is not there.
	ok('no settings row talks about the screen size',
		!/lpn_settings_[a-z_]*:[^\n]*screen (size|width|height)/i.test(src));
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
