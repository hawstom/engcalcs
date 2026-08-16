// A pipe too short to carry its own label does not carry one. Run with:
//   node dev/lpn-spike/short-line-label-harness.js
//
// Tom, 2026-08-14: "If a line is too short, its label must disappear even if the map is closer than
// the 'all-disappear' limit." The map-width threshold (Task 331) answers a question about the whole
// drawing -- is this being read or surveyed -- and cannot answer the per-pipe one. So a dense corner
// at a perfectly readable zoom still fills with numbers belonging to stubs a few pixels long.
//
// THE PART WORTH TESTING IS THE FRAME. The rule works because the two sides are measured in
// different currencies: labelBoxWidth() comes from getBBox(), so it is a SCREEN-pixel size expressed
// in world units and shrinks as you zoom in, while a pipe's length is a fixed world number. Give the
// label a fixed WORLD width instead -- the obvious-looking "a label is 3 units wide" -- and the ratio
// stops depending on zoom entirely: the label hides at every zoom or at none, and Tom's sentence
// about the map being "closer" becomes unsatisfiable. Section 2 is that assertion, and it is why the
// harness varies tw between passes instead of holding it fixed: that is precisely what a browser
// does to it, and a test that left tw alone could not tell the two designs apart.
//
// The headless DOM cannot measure text, so tw is imposed here exactly as leader-angle-harness.js
// does it, and for the same reason: the quantity the rule turns on would otherwise sit still.

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, refreshLabelText: refreshLabelText,\n" +
	"\t\tlabelSettings: function () { return labelSettings; }, relayoutLabels: relayoutLabels,\n" +
	"\t\tsetZoom: function (s) { state.s = s; },\n" +
	"\t\tsetLabelMaxWidth: function (w) { settings.labelMaxWidth = w; applyLabelVisibility(); },\n" +
	"\t\tglobalHide: function () { return svg.classList.contains('lpn-labels-hidden'); },\n" +
	// BOTH FIELDS, since 2026-08-15. A label's measured width is banked in PIXELS and divided by the
	// scale on read (labelBoxWidth), so writing only `tw` writes the field the code stopped reading
	// -- the harness would impose a width nothing consulted and every check here would answer from
	// the stale cache. Same shape as every other stub-lies-to-the-harness bug this file has met.
	"\t\tsetBox: function (id, tw) { linkEls[id].tw = tw; linkEls[id].twPx = tw * state.s; },\n" +
	"\t\tvis: function (id) { var e = linkEls[id];\n" +
	"\t\t\treturn { text: e.text.style.visibility,\n" +
	"\t\t\t\tleader: e.leader.style.visibility,\n" +
	"\t\t\t\tmarked: Array.prototype.filter.call(e.text.childNodes, function (t) {\n" +
	"\t\t\t\t\treturn t.getAttribute('text-decoration'); }).length }; },\n" +
	"\t\tnudgeOf: function (id) { return linkEls[id].nudge; },\n" +
	"\t\thiddenShort: function (id) { return !!linkEls[id].hiddenShort; },\n" +
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

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

// Three nodes in a row: a 200-unit main and a 5-unit stub off its far end. Both are real pipes with
// real labels; the only difference between them is length.
const a = L.addNode('junction', 0, 0);
const b = L.addNode('junction', 200, 0);
const c = L.addNode('junction', 205, 0);
const d = L.addNode('junction', 0, 200);
const long = L.addLink('pipe', a.id, b.id);
const stub = L.addLink('pipe', b.id, c.id);
// A third pipe only so the extrema exist at all: fieldExtrema() wants three defined values before
// it will call anything a max or a min, which is its own guard against decorating a two-element
// network where every value is simultaneously both.
const other = L.addLink('pipe', a.id, d.id);
// Diameter, not ID: it is numeric, so the two pipes take the network max and min and each earns an
// extrema badge. A label with nothing decorated would make the badge assertion below vacuous -- and
// it silently was, until a mutant that built the badges anyway passed.
// Written to the UNDERSCORED base field, which is where an element's own value lives (the bare name
// is the scenario-resolved read, through effective()). Whole inches, because the label rounds diameter to 0 decimals (a diameter is a whole-number
// standard in this trade). Three tenths of a metre and one tenth both print as "0", tie for max AND
// min at once, and earn no badge -- which is how this assertion first came out vacuous.
long._diameter = 6; stub._diameter = 2; other._diameter = 4;
L.labelSettings().link.id = true;
L.labelSettings().link.diameter = true;
L.refreshLabelText();

// The label is 10 world units wide at this zoom -- wider than the stub, far narrower than the main.
const TW = 10;
// NOTE ON WHAT layoutAt() NOW SIMULATES. The page banks a label's width in pixels and divides by
// the scale, so in a browser a "zoom" changes the world width without any re-measurement at all.
// Imposing a world width here and letting setBox convert it at the CURRENT scale reproduces the
// same arithmetic from the other end, and keeps this file's one variable ("how wide is the label,
// in world units") the one it has always had.
// One number to simulate a zoom, because since Task 333 the label's footprint IS its text: the
// extrema mark is the number's own text-decoration and adds nothing beside it. This used to have to
// scale a second quantity (the badge's reach) in step, or labelBoxWidth() stayed pinned at the
// badge's width and no label ever came back.
function layoutAt(tw) {
	[long.id, stub.id, other.id].forEach(function (id) { L.setBox(id, tw); });
	L.relayoutLabels();
}

console.log('=== a pipe shorter than its own label carries none ===');

layoutAt(TW);
ok('the short stub is suppressed', L.hiddenShort(stub.id));
ok('...text and leader hidden together',
	L.vis(stub.id).text === 'hidden' && L.vis(stub.id).leader === 'hidden',
	JSON.stringify(L.vis(stub.id)));
// The mark rides INSIDE the text now, so hiding the text hides it by construction -- there is no
// separate element left to forget, which is what the old ticks === 0 assertion was guarding.
ok('...and its extrema mark goes with the text, being part of it', L.vis(stub.id).text === 'hidden');
ok('the 200-unit main keeps its label', !L.hiddenShort(long.id));
ok('...visibly', L.vis(long.id).text !== 'hidden', JSON.stringify(L.vis(long.id)));
ok('...and DOES carry an extrema mark, so the line above is not vacuous', L.vis(long.id).marked > 0,
	String(L.vis(long.id).marked));

// ---- 2. It comes back when there is room, which is what "even if the map is closer" means -------
// Zooming in does not lengthen the pipe -- it shrinks the label's world width, because the label is
// a fixed number of SCREEN pixels. A five-times closer view puts a 2-unit-wide label on a 5-unit
// pipe, and the label fits.
layoutAt(TW / 5);
ok('zoomed in, the stub gets its label back', !L.hiddenShort(stub.id));
ok('...and it is visible again -- the hide is not one-way', L.vis(stub.id).text !== 'hidden',
	JSON.stringify(L.vis(stub.id)));
layoutAt(TW);
ok('zoomed back out, it goes away again', L.hiddenShort(stub.id));

// ---- 2b. A DRAGGED label is exempt: the user's own escape hatch -------------------------------
// Tom's hedge, and the reason it is the right one: dragging a label off a stub is exactly what you
// do when you want that number on the sheet, so the gesture already carries the intent and no
// setting is needed. Sending it home again (double-click clears lx/ly) puts the rule back.
layoutAt(TW);
ok('the stub is hidden while its label is where we put it', L.hiddenShort(stub.id));
stub.lx = 30; stub.ly = -20;
L.relayoutLabels();
ok('...and shows once the user has dragged it', !L.hiddenShort(stub.id));
ok('...visibly, badges and all', L.vis(stub.id).text !== 'hidden', JSON.stringify(L.vis(stub.id)));
delete stub.lx; delete stub.ly;
L.relayoutLabels();
ok('...and hides again when sent home', L.hiddenShort(stub.id));

// ---- 3. A suppressed label is not an obstacle ---------------------------------------------------
// It neither pushes its neighbours around nor keeps a nudge from the pass before it disappeared --
// otherwise it would come back displaced by a collision nobody could see.
ok('a suppressed label carries no nudge', L.nudgeOf(stub.id).x === 0 && L.nudgeOf(stub.id).y === 0,
	JSON.stringify(L.nudgeOf(stub.id)));

// ---- 4. The rule is per PIPE, independent of the map-width rule ---------------------------------
// Nothing above ever set settings.labelMaxWidth, so every one of these hides happened at a zoom the
// global threshold considers perfectly readable. That IS Tom's sentence, and it is worth asserting
// rather than leaving implicit in the setup.
L.setLabelMaxWidth(1e9);   // "show labels until the map is a billion units wide" -- i.e. always
ok('the global threshold says SHOW', !L.globalHide());
layoutAt(TW);
ok('...and the stub is hidden anyway -- the per-pipe rule is independent', L.hiddenShort(stub.id));
ok('...while the main is still shown, so this is per pipe and not a blanket', !L.hiddenShort(long.id));

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
