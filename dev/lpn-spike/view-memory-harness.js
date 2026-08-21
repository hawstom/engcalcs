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
// THE ONE DESIGN DECISION WORTH TESTING IS THE STORED SHAPE, and it took three goes.
//
//   1. tx/ty and a scale. Wrong: a translation is screen-space, so restoring it on a different
//      window puts the same CORNER back and shows a different part of the drawing.
//   2. A centre and a world EXTENT -- AutoCAD's VIEWCTR/VIEWSIZE. Defensible, and what Tom asked
//      for first: "if the drawing was 50% of the view, it opens at 50% of the view."
//   3. A centre and a SCALE, which is what this file now tests. Tom settled it by walking the use
//      cases: "I think I just convinced myself to save and open scale, not extent, since that's how
//      we resize. Both are okay, but we should be parallel." Shrinking a window keeps the scale and
//      shows less; if reopening at that size re-fitted instead, the app would answer one question
//      two ways depending on whether the window changed while it was open.
//
//      It is also EXACT where the extent form was not: restoring an extent recomputes the scale
//      from the canvas size, so a one-pixel difference comes back at a slightly different zoom --
//      which Tom saw as "cycling switch window and zoom to fit still produces a change".
//
// A centre is a world point either way, so it flips into the Cartesian file frame with every other
// coordinate instead of being a private convention inside a public format. Section 4.

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, refreshLabelText: refreshLabelText,\n" +
	"\t\tcurrentView: currentView, applyView: applyView, validView: validView,\n" +
	"\t\tremember: rememberCurrentView, restoreOrFit: restoreViewOrFit,\n" +
	"\t\tserialize: serializeProject, flip: flipStoredY, signature: docSignature,\n" +
	"\t\tsetOpenId: function (id) { library.openId = id; },\n" +
	"\t\tmarkSized: noteMapSized,\n" +
	"\t\tcountLayouts: function (f) { var n = 0, real = onZoomChanged;\n" +
	"\t\t\tonZoomChanged = function () { n++; return real.apply(null, arguments); };\n" +
	"\t\t\ttry { f(); } finally { onZoomChanged = real; } return n; },\n" +
	"\t\tview: function () { return { tx: state.tx, ty: state.ty, s: state.s }; },\n" +
	// SETTING A SCALE RE-LAYS-OUT, because every real path that changes one does (zoomAbout and
	// zoomExtent both end in onZoomChanged). Leaving it out puts the module in a state a browser
	// cannot reach -- a transform at one scale over a layout computed for another -- which is
	// exactly the state applyView() now checks for, so the harness would be testing its own lie.
	"\t\tsetViewRaw: function (tx, ty, s) { state.tx = tx; state.ty = ty; state.s = s;\n" +
	"\t\t\tsetTransform(); relayoutLabels(); },\n" +
	// The one thing a harness needs that no real path does: move the transform WITHOUT laying out,
	// so the mismatch the new rule exists to catch can be built on purpose.
	"\t\tsetScaleOnly: function (s) { state.s = s; setTransform(); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h;\n" +
	"\t\t\tsvg.getBoundingClientRect = function () { return { top: 0, bottom: h, width: w, height: h }; }; },\n" +
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
	ok('...and the scale is recorded as it stands, not derived from the canvas',
		v.s === 2.5 && v.w === undefined, JSON.stringify(v));
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
	// AT THE SAME SCALE, which is the point of storing one: the drawing is the same size on the
	// bigger window and you simply see more of it. That is exactly what shrinking the window does
	// while the page is open, and the parallel is the reason this shape was chosen.
	ok('...at the same scale, so the drawing is the same size and you see more of it',
		L.view().s === 2.5, 'scale now ' + L.view().s);
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
	// EXACT, not nearly: a stored scale is copied verbatim. The extent form recomputed it from the
	// canvas and came back a hair different, which is what Tom saw when he switched tabs and then
	// pressed Zoom to fit.
	ok('coming back to a tab restores the view it was left at, exactly',
		back.cx === mine.cx && back.cy === mine.cy && back.s === mine.s,
		JSON.stringify(back) + ' vs ' + JSON.stringify(mine));
	// A project nobody has looked at yet has nothing to restore, so it gets the fit -- which is the
	// old behaviour, now the fallback rather than the rule.
	L.setOpenId('P3');
	L.setViewRaw(0, 0, 0.4);
	L.restoreOrFit();
	ok('a tab with no remembered view is fitted instead', L.view().s !== 0.4, L.view().s);
	// **RESTORING AT THE SCALE ALREADY IN FORCE COSTS NO RE-LAYOUT**, which is the commonest case
	// there is -- switching to a tab and back. Everything onZoomChanged() rebuilds depends on the
	// scale and nothing else, so a pure pan has nothing to rebuild. On Net3 the difference is over
	// a second (Tom, 2026-08-15: "Net3 with labels showing takes over 1 second to render on tab
	// refocus").
	L.setOpenId('P1');
	L.setViewRaw(-300, -80, 3);
	L.remember();
	L.setViewRaw(0, 0, 3);          // panned, same scale
	var layouts = L.countLayouts(function () { L.restoreOrFit(); });
	ok('restoring a view at the same scale re-lays-out nothing', layouts === 0, layouts);
	L.setViewRaw(0, 0, 1.5);        // a different scale
	layouts = L.countLayouts(function () { L.restoreOrFit(); });
	ok('...and restoring one at a different scale still does', layouts === 1, layouts);

	// **THE TEST IS AGAINST THE SCALE THE LAYOUT WAS COMPUTED AT, NOT THE ONE WE ARRIVED WITH**, and
	// the difference is a real defect Tom photographed on Net3: node labels sitting on the far side
	// of the model, all snapping home the moment he started to drag one. Every label is sized in
	// screen pixels, so at a coarse scale it is enormous in world units and the collision pass moves
	// it correspondingly far -- measured on Net3, a model 37 units across, a layout computed at
	// scale 1 gives a MEDIAN nudge of 43 units. Those nudges are correct for that scale and nonsense
	// at any other, and a drag fixed everything because it re-ran the pass.
	//
	// Here: the transform is already at the target scale while the LAYOUT belongs to a different
	// one. Asking "did this call change the scale" answers no and leaves the wrong layout on screen;
	// asking "does the layout belong to the scale being displayed" answers yes, relayout.
	L.setViewRaw(0, 0, 3);              // the layout now belongs to scale 3
	L.setScaleOnly(7);                  // ...and something moves the transform without saying so
	layouts = L.countLayouts(function () { L.applyView({ cx: 0, cy: 0, s: 7 }); });
	ok('a view whose scale matches the TRANSFORM but not the LAYOUT still re-lays-out',
		layouts === 1, layouts + ' -- asking "did this call change the scale" would answer 0 here');
}

// ---- 4. The file carries one too, in the file's own frame --------------------------------------
console.log('\n--- saved to file, in the Cartesian frame the rest of the file uses ---');
{
	L.setOpenId('P1');
	L.setViewRaw(-300, -80, 3);
	const live = L.currentView();
	const saved = L.serialize();
	ok('a saved project carries its view', L.validView(saved.view), JSON.stringify(saved.view));
	ok('...at the scale that was on screen', saved.view.s === live.s, JSON.stringify(saved.view));
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
// ---- 4b. Moving the view IS an edit; moving it automatically is not ---------------------------
// Tom, 2026-08-15, on being shown a fix that dropped the view from the dirty signature: "AutoCAD
// registers a zoom or pan as a change. But there are no automatic zooms or pans. The paradigm
// mistake in our code right now is probably a holdover from zooming to fit on every open... In a
// nutshell, our current paradigm forbids autozooms or refits. Could you be hacking at this from the
// wrong direction?"
//
// He was. Excluding the view would have made a DELIBERATE pan unsaveable in order to excuse an
// AUTOMATIC one. The view stays in the signature, exactly as it stays in the file; what changed is
// that an automatic fit re-baselines a clean project instead of dirtying it. A fit that establishes
// a view the document never had is not a change to it.
console.log('\n--- moving the view is an edit, unless the app moved it ---');
{
	L.setOpenId('P1');
	L.setViewRaw(-300, -80, 3);
	const before = L.signature();
	L.setViewRaw(140, 260, 11);        // pan and zoom: a different view of the same network
	ok('panning and zooming DOES change the document signature, as in AutoCAD',
		L.signature() !== before, before + ' vs ' + L.signature());
	ok('...and the file carries the view, which is why it counts',
		L.validView(L.serialize().view), JSON.stringify(L.serialize().view));
	// The half that fixes Tom's trap: every automatic fit is marked as such at its call site, so it
	// can re-baseline rather than dirty. If one is ever added without the flag, the inescapable
	// asterisk comes straight back -- revert re-fits, the re-fit dirties, repeat.
	const src = require('fs').readFileSync(
		require('path').join(__dirname, '../../js/looped-network.js'), 'utf8');
	const code = src.replace(/^[ \t]*\/\/.*$/gm, '');
	const bare = (code.match(/[^a-zA-Z]zoomExtent\(\)/g) || []).length;
	ok('every automatic fit says so, so none of them can dirty a project', bare === 0,
		bare + ' bare zoomExtent() call(s) -- each one is a fit nobody asked for that would set an asterisk');
	// **AND THERE ARE ALMOST NONE LEFT TO MARK** (Tom, 2026-08-15, going through the list one by one
	// and rejecting nearly all of it: the post-solve re-fit "illegal"; the cleared network "Why
	// rezoom? To what? Who cares?"; boot on an empty map "Why is a zoom needed?"; and overall,
	// "refitting and re-baselining: I see it as vanishingly defensible"). Seven became two, both of
	// them the same case: a document that has no stored view has to be given one, once.
	// The cap went 3 -> 4 on 2026-08-21, for georefArmAsDegrees(): pressing "These are already
	// lon/lat" says the coordinates need no placing, and the camera then has to go to where those
	// numbers put the network -- which by then is nowhere near the whole-Earth view step 1 opens
	// on. Marked automatic because the user asked to reinterpret coordinates, not to move the view.
	// **A FIFTH NEEDS THE SAME KIND OF SENTENCE, not a bumped number.**
	const autos = (code.match(/zoomExtent\(true\)/g) || []).length;
	ok('...and there are at most four of them left, each one named and argued for',
		autos <= 4, autos + ' automatic fit(s)');
	// **BOOT MUST GO THROUGH restoreViewOrFit(), NOT STRAIGHT TO A FIT**, or a reload ignores the
	// document's saved view -- the one path where a user most expects to come back to where they
	// were was the one path that would not. It had its own sequence and never picked up the call
	// that refreshAllFromDocument() has always ended with.
	// Counted rather than sliced out of init(): a brace-matched slice of a 150-line function is
	// fragile, and the first version of this check silently passed a mutant that had put the fit
	// straight back. Both open paths -- refreshAllFromDocument() and boot -- must go through the
	// same door, so the call appears at least twice, and the only fits left are the three counted
	// above.
	const doors = (code.match(/restoreViewOrFit\(\)/g) || []).length;
	ok('both open paths restore the view rather than fitting outright', doors >= 3,
		doors + ' call site(s): the function, refreshAllFromDocument, and boot');
	ok('...and the button the user presses is NOT marked automatic, since that one is an edit',
		/fn: zoomExtent\b/.test(code) && /addEventListener\('click', zoomExtent\)/.test(code));
	ok('...with a re-baseline that only ever fires on an already-clean project',
		/function rebaseSignatureIfClean/.test(code) && /if \(e && !e\.dirty\)/.test(code));
}

// ---- 4c. Every way of making a project makes a CLEAN one ---------------------------------------
// Tom, 2026-08-15: "The gallery project (initial project) gets an unwarranted asterisk. But revert
// is disabled." Two facts that trap each other -- Revert is for FILE projects, so the one control
// that clears an asterisk was disabled on the only project carrying an unearned one.
//
// Dirtiness is `docSignature() !== entry.savedSig`, so an entry with NO savedSig is dirty from its
// first breath. Every path that makes a project goes through stampProjectSaved() EXCEPT the one in
// init() that registers the first project by hand -- deliberately, to avoid repainting a UI that
// does not exist yet -- and it skipped the stamp along with the repaint.
console.log('\n--- a project is born clean, however it was born ---');
{
	const src = require('fs').readFileSync(
		require('path').join(__dirname, '../../js/looped-network.js'), 'utf8');
	const at = src.indexOf('var firstId = newProjectId()');
	const branch = src.slice(at, at + 1400);
	// **AND THE STAMP IS TAKEN AFTER THE SEEDING** (Task 418). Stamped in the branch it was still
	// too early: seedDefaultInputs() runs afterwards and fills settings.defaults, which
	// docSignature() covers, so the first autosave found a document nobody had touched already
	// changed and the asterisk never cleared. What the baseline describes has to be the document
	// the visitor is first shown.
	ok('the boot branch does NOT stamp the signature inline — the document is not finished yet',
		!/savedSig: docSignature\(\)/.test(branch), branch.slice(0, 120));
	ok('...it flags the project as born clean instead', /bornClean = true;/.test(branch));
	const seedAt = src.indexOf('\t\tseedDefaultInputs();', at);   // init()'s own, not the one in refreshAllFromDocument()
	const after = src.slice(seedAt, seedAt + 600);
	ok('...and the stamp is taken after seedDefaultInputs()',
		/if \(bornClean\)/.test(after) && /savedSig = docSignature\(\);/.test(after),
		after.slice(0, 120));
	// The name is part of the signature, so it has to be set before the signature is taken or the
	// entry is stamped against a document it does not describe.
	ok('...which is after its name is set, since the name is part of the signature',
		src.indexOf('project.name = firstName') < seedAt);
	// And the reason it is inline rather than a call: stampProjectSaved() ends in renderTabs().
	// Comments stripped: the code EXPLAINS why it does not call stampProjectSaved(), and a naive
	// search finds the explanation and calls it a call. Third time this file's family has met that.
	ok('...inline, because stampProjectSaved would repaint a tab strip that is not wired yet',
		!/stampProjectSaved/.test((branch + after).replace(/^[ \t]*\/\/.*$/gm, '')));
}

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
