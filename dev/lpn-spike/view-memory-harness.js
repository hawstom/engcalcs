// The map remembers where you were looking. Run with:
//   node dev/lpn-spike/view-memory-harness.js
//
// Tom, 2026-08-15, after asking whether the zoom was saved anywhere and being told it was not:
// "In-memory per tab now and saved to file." Two stores, one shape.
//
// WHY THIS IS THE REAL ANSWER TO A WEEK OF ZOOM COMPLAINTS. Every project open used to run a fit,
// which is why switching tabs re-zoomed -- and no fit, however exact, is as good as simply putting
// the reader back where they were. The fit is now the FALLBACK, for a project nobody has looked at
// yet.
//
// THE ONE DESIGN DECISION WORTH TESTING IS THE STORED SHAPE. The view is kept as a world CENTRE
// plus a scale, never as the raw tx/ty translation:
//
//   * tx/ty are screen-space, so restoring them on a different-sized window puts the same CORNER
//     back and shows a different part of the drawing. Section 2 is that difference.
//   * a centre is a world point, so it flips into the Cartesian file frame with every other
//     coordinate instead of being a private convention inside a public format. Section 4.

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, refreshLabelText: refreshLabelText,\n" +
	"\t\tcurrentView: currentView, applyView: applyView, validView: validView,\n" +
	"\t\tremember: rememberCurrentView, restoreOrFit: restoreViewOrFit,\n" +
	"\t\tserialize: serializeProject, flip: flipStoredY,\n" +
	"\t\tsetOpenId: function (id) { library.openId = id; },\n" +
	"\t\tmarkSized: noteMapSized,\n" +
	"\t\tview: function () { return { tx: state.tx, ty: state.ty, s: state.s }; },\n" +
	"\t\tsetViewRaw: function (tx, ty, s) { state.tx = tx; state.ty = ty; state.s = s; setTransform(); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h;\n" +
	"\t\t\tsvg.getBoundingClientRect = function () { return { top: 0, bottom: h, width: w, height: h }; }; },\n" +
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
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
L.setCanvas(1000, 600);
L.markSized();
const a = L.addNode('junction', 0, 0);
const b = L.addNode('junction', 400, 300);
L.addLink('pipe', a.id, b.id);
L.refreshLabelText();

// ---- 1. A view survives a round trip through its own representation ---------------------------
console.log('--- centre and scale describe the same view as tx/ty and scale ---');
{
	L.setViewRaw(-120, 45, 2.5);
	const before = L.view();
	const v = L.currentView();
	// The centre of a 1000x600 canvas, in world units, at scale 2.5.
	ok('the centre is the world point under the middle of the canvas',
		near(v.cx, (500 + 120) / 2.5) && near(v.cy, (300 - 45) / 2.5), JSON.stringify(v));
	ok('...and the scale comes along unchanged', v.s === 2.5);
	L.setViewRaw(0, 0, 1);
	L.applyView(v);
	ok('applying it puts the transform back exactly',
		near(L.view().tx, before.tx) && near(L.view().ty, before.ty) && L.view().s === before.s,
		JSON.stringify(L.view()) + ' vs ' + JSON.stringify(before));
}

// ---- 2. ...and it means the same thing on a different-sized window -----------------------------
console.log('\n--- a remembered view is about the drawing, not about the window ---');
{
	L.setCanvas(1000, 600);
	L.setViewRaw(-120, 45, 2.5);
	const v = L.currentView();
	// The window changes -- a resized browser, a second monitor, or simply the file being opened by
	// somebody else. THE SAME THING MUST STILL BE IN THE MIDDLE, at the same size.
	L.setCanvas(1600, 900);
	L.applyView(v);
	const after = L.currentView();
	ok('the same world point is still under the middle of the canvas',
		near(after.cx, v.cx) && near(after.cy, v.cy), JSON.stringify(after) + ' vs ' + JSON.stringify(v));
	ok('...at the same scale', after.s === v.s);
	// The corner deliberately does NOT survive, which is the whole reason for storing a centre. If
	// tx had been stored raw it would be unchanged here, and a third of the drawing would have
	// slid off the left of the wider window.
	ok('...and the raw translation has moved, as it must have', !near(L.view().tx, -120),
		L.view().tx);
	L.setCanvas(1000, 600);
}

// ---- 3. Switching away and back restores it, rather than fitting -------------------------------
console.log('\n--- the per-tab memory ---');
{
	L.setOpenId('P1');
	L.setViewRaw(-300, -80, 3);
	const mine = L.currentView();
	L.remember();
	// Off to another project, which leaves its own scale behind...
	L.setOpenId('P2');
	L.setViewRaw(0, 0, 0.4);
	// ...and back.
	L.setOpenId('P1');
	L.restoreOrFit();
	const back = L.currentView();
	ok('coming back to a tab restores the view it was left at',
		near(back.cx, mine.cx, 1e-6) && near(back.cy, mine.cy, 1e-6) && near(back.s, mine.s, 1e-9),
		JSON.stringify(back) + ' vs ' + JSON.stringify(mine));
	// A project nobody has looked at yet has nothing to restore, so it gets the fit -- which is the
	// old behaviour, now the fallback rather than the rule.
	L.setOpenId('P3');
	L.setViewRaw(0, 0, 0.4);
	L.restoreOrFit();
	ok('a tab with no remembered view is fitted instead', L.currentView().s !== 0.4,
		L.currentView().s);
}

// ---- 4. The file carries one too, in the file's own frame --------------------------------------
console.log('\n--- saved to file, in the Cartesian frame the rest of the file uses ---');
{
	L.setOpenId('P1');
	L.setViewRaw(-300, -80, 3);
	const live = L.currentView();
	const saved = L.serialize();
	ok('a saved project carries its view', L.validView(saved.view), JSON.stringify(saved.view));
	ok('...at the scale that was on screen', near(saved.view.s, live.s));
	// THE FLIP. The document is stored Cartesian (Task 274), so the view's centre -- being a world
	// point -- is stored negated in y like every other y in the file. Storing tx/ty instead would
	// have put an unflipped screen-space translation in a flipped file.
	ok('...with its y in the file frame, not the internal one', near(saved.view.cy, -live.cy),
		saved.view.cy + ' vs internal ' + live.cy);
	// flipStoredY is an involution, and reading applies it again -- so a round trip is the identity.
	const readBack = L.flip(JSON.parse(JSON.stringify(saved)));
	ok('...and reading it back gives the view that was saved',
		near(readBack.view.cx, live.cx) && near(readBack.view.cy, live.cy),
		JSON.stringify(readBack.view));
}

// ---- 5. Nothing is restored from a view that does not make sense -------------------------------
console.log('\n--- a malformed or missing view falls back to fitting ---');
{
	ok('no view at all is not a view', !L.validView(null) && !L.validView(undefined));
	ok('a partial one is not a view', !L.validView({ cx: 1, cy: 2 }));
	ok('NaN is not a view', !L.validView({ cx: NaN, cy: 0, s: 1 }));
	ok('a zero or negative scale is not a view',
		!L.validView({ cx: 0, cy: 0, s: 0 }) && !L.validView({ cx: 0, cy: 0, s: -2 }));
	// A file written before this feature has no view and must still open, fitted.
	L.setViewRaw(0, 0, 0.4);
	ok('applying a bad view changes nothing and says so', L.applyView({ cx: 1 }) === false);
	ok('...leaving the transform where it was', L.view().s === 0.4);
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
