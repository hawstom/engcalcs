// A long pipe writes its name more than once. Run with:
//   node dev/lpn-spike/label-repeat-harness.js
//
// Tom's spec, 2026-08-15, verbatim: "Set VD = max(map width, map height) and L = pipe length.
// Instead of putting 1 link label at midpoint of link, put n = ceiling(L/(0.25*VD)) with 0.25*VD
// spacing (friendly spec: 'Link labels spacing = 25% of view size')."
//
// THE ONE PROPERTY WORTH GUARDING ABOVE ALL OTHERS IS THAT n = 1 CHANGES NOTHING. Every pipe
// shorter than a quarter of the view -- which is most pipes on most drawings -- must come out of
// this exactly where it came out before: one label, at the half-way station, with its drag offset,
// its collision nudge, its leader and its aligned-station search all intact. A repeat feature that
// quietly moved every ordinary label by a hair would be a regression dressed as a feature, and it
// would be invisible in code review. Section 1 is that assertion and it is the reason the station
// formula is (i + 0.5)/n rather than i/(n-1): the latter is a perfectly good even spacing that puts
// a single label at station 0.
//
// THE SPACING IS IN VIEW UNITS, WHICH IS WHAT MAKES IT NEED NO NUMBER FROM ANYBODY. A quarter of
// the view means "about four labels across the screen" on a 400 ft subdivision and on a 40 mile
// transmission main alike. Section 2 measures that against the actual map width; section 3 checks
// it re-derives on zoom, since that is the difference between a rule and a setting.

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, refreshLabelText: refreshLabelText,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tsetSetting: function (k, v) { settings[k] = v; },\n" +
	"\t\tstations: linkLabelStations, drawn: drawnLinkLabelStations, spacing: labelRepeatSpacing,\n" +
	"\t\tplacement: alignedLabelPlacement, relayout: relayoutLabels, addText: addText,\n" +
	"\t\tpan: function (tx, ty) { state.tx = tx; state.ty = ty; },\n" +
	"\t\tpipeLength: function (id) { return Geom.polylineLength(linkPointList(linkById(id))); },\n" +
	"\t\tlinkEl: function (id) { return linkEls[id]; },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n" +
	"\t\tsetZoom: function (s) { state.s = s; },\n" +
	// Whether an element is still IN the drawing. Dropping a repeat from le.repeats is not the same
	// as taking it off the map, and the difference is a label the user can see and cannot select.
	"\t\tinLayers: function (e) { return labelsLayer.children.indexOf(e) >= 0 || maskLayer.children.indexOf(e) >= 0; },\n" +
	"\t\tvisibleMapWidth: visibleMapWidth, visibleMapHeight: visibleMapHeight,\n" +
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
function textOf(el) {
	return Array.prototype.map.call(el.childNodes, t => t.textContent || '').join('|');
}

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

// A 1000-unit view (the canvas is square at zoom 1, so VD = 1000 and the spacing is 250) with two
// pipes: one well inside a quarter-view, one four times it.
L.setCanvas(1000, 1000);
L.setZoom(1);
const a = L.addNode('junction', 0, 0);
const b = L.addNode('junction', 200, 0);        // short: 200 < 250
const c = L.addNode('junction', 1200, 0);       // long: 1000 from b
const short = L.addLink('pipe', a.id, b.id);
const long = L.addLink('pipe', b.id, c.id);
L.labelSettings().link.id = true;
L.refreshLabelText();

// ---- 1. n = 1 is the whole of today's behaviour, untouched -----------------------------------
console.log('--- a pipe shorter than the spacing is exactly as it was ---');
{
	ok('the spacing is a quarter of the view', near(L.spacing(), 250), L.spacing());
	ok('the short pipe really is shorter than that', L.pipeLength(short.id) < L.spacing(),
		L.pipeLength(short.id));
	const st = L.stations(short);
	ok('...so it gets ONE station', st.length === 1, JSON.stringify(st));
	// The half-way point, which is LINK_LABEL_ALONG and every existing test's assumption. This is
	// what makes (i + 0.5)/n the right formula rather than an even division of the endpoints.
	ok('...and that station is the half-way point, not station zero', near(st[0], 0.5), st[0]);
	ok('...and no repeat elements were built at all', (L.linkEl(short.id).repeats || []).length === 0);
}

// ---- 2. A long pipe repeats, at the spacing it was given -------------------------------------
console.log('\n--- a pipe longer than the spacing repeats along itself ---');
{
	const len = L.pipeLength(long.id), st = L.stations(long);
	ok('the long pipe is four spacings long', near(len, 1000), len);
	ok('...so it gets ceil(L / spacing) = 4 stations', st.length === 4, JSON.stringify(st));
	// The spacing is what the spec asks for and the thing a reader actually perceives; the station
	// numbers are only how it is expressed. Measured in world units, adjacent labels must be no
	// further apart than the spacing -- never MORE, or the drawing has a gap the rule promised to
	// fill.
	let maxGap = 0;
	for (let i = 1; i < st.length; i++) { maxGap = Math.max(maxGap, (st[i] - st[i - 1]) * len); }
	ok('...spaced no further apart than the spacing', maxGap <= L.spacing() + 1e-9, maxGap);
	// Symmetric about the middle, so the chain reads as belonging to the pipe rather than starting
	// at one end of it -- and so a two-label pipe does not put both labels in one half.
	ok('...and the chain is centred on the pipe',
		near(st[0] + st[st.length - 1], 1), st[0] + ' .. ' + st[st.length - 1]);
	ok('...with no label at either end, where it would crowd a node',
		st[0] > 0 && st[st.length - 1] < 1, JSON.stringify(st));
	// The DOM half: three extra renderings for four stations.
	const le = L.linkEl(long.id);
	ok('three repeat elements were built for the other three stations', le.repeats.length === 3,
		le.repeats.length);
	ok('...each saying the same thing as the original',
		le.repeats.every(r => textOf(r.text) === textOf(le.text)),
		textOf(le.text) + ' vs ' + le.repeats.map(r => textOf(r.text)).join(' / '));
	// EVERY COPY IS PICKABLE (Tom, 2026-08-15: "The problem is that I can only drag one upstream
	// label"). The first version made repeats inert, which left one magic copy per pipe that could
	// be dragged and no way to tell which. Now they are all the same: same link id, same drag class.
	ok('every repeat is a drag target, so there is no magic copy to find', le.repeats.every(r =>
		/lpn-draglbl/.test(r.text.getAttribute('class') || '')),
		le.repeats.map(r => r.text.getAttribute('class')).join(' / '));
	ok('...and every one of them names the SAME link, so a grab drags that link\'s label',
		le.repeats.every(r => r.text.getAttribute('data-linklbl') === long.id),
		le.repeats.map(r => r.text.getAttribute('data-linklbl')).join(' / '));
	// The index is how a pointerdown knows WHICH copy was grabbed, which is what lets the chain
	// collapse to that spot instead of jumping to the half-way point first.
	ok('...and carries its own index, so a grab knows which copy it took hold of',
		le.repeats.every((r, k) => +r.text.getAttribute('data-repeat') === k),
		le.repeats.map(r => r.text.getAttribute('data-repeat')).join(' / '));
	ok('...and each remembers its station, which is where that grab starts from',
		le.repeats.every(r => typeof r.along === 'number'),
		le.repeats.map(r => r.along).join(' / '));
	// But it IS generated annotation (Task 334), so it hides with everything else at low zoom.
	ok('...while still being generated annotation, so it hides with the rest',
		le.repeats.every(r => /lpn-annotation/.test(r.text.getAttribute('class') || '') &&
			/lpn-annotation/.test(r.mask.getAttribute('class') || '')));
}

// ---- 3. The count re-derives on zoom, which is what makes it a rule ---------------------------
console.log('\n--- the count follows the view, not the model ---');
{
	// Zoom IN 4x: the view is 250 units across, the spacing 62.5, and the same pipe wants 16.
	// Nothing about the network changed; the reader's distance did.
	L.setZoom(4);
	L.refreshLabelText();
	const st = L.stations(long);
	ok('zooming in asks for more labels', st.length === 16, st.length);
	// **THE DIVISION IS UNCAPPED AND THE DRAWING IS BOUNDED** (Tom: "Do you want only to draw the 4
	// that appear on the screen? That makes most sense. No cap on the division?"). A cap on n would
	// be a cap on the SPACING -- the rule would quietly stop holding on a long pipe at high zoom --
	// whereas not building elements nobody can see costs the reader nothing at all.
	const dr = L.drawn(long);
	ok('...but only the ones near the window are built', dr.length < st.length,
		dr.length + ' of ' + st.length);
	ok('...and the elements followed the DRAWN count, not n',
		L.linkEl(long.id).repeats.length === dr.length - 1, L.linkEl(long.id).repeats.length);
	// The window is the viewport plus a full view-span on each side, so panning by less than a
	// screen never reaches a stretch that was never labelled.
	ok('...every drawn station is inside the padded window',
		dr.every(f => f * 1000 >= -1000 && f * 1000 <= 1500), JSON.stringify(dr));
	// PANNING TO THE FAR END DRAWS THE FAR END'S LABELS, which is the half a count-based cap could
	// never do: twelve labels spread over a pipe is not the same as the four you can see.
	L.pan(-4400, 0);      // world x ~1100-1350 in view at zoom 4
	const far = L.drawn(long);
	ok('panning down the pipe draws the stations that are now in view',
		far.length > 0 && far[0] > dr[dr.length - 1], JSON.stringify(dr) + ' -> ' + JSON.stringify(far));
	ok('...and none of the ones it left behind', far.every(f => dr.indexOf(f) < 0));
	L.pan(0, 0);

	// Zoom OUT until the whole pipe is inside a quarter-view: back to one label, and the repeat
	// elements are REMOVED rather than parked off-screen -- a stale repeat left in the layer is a
	// label lying on a map that no longer wants it.
	// Captured BEFORE they are dropped: asking the emptied list whether its members left the map
	// is a question with no members in it, and it passes for a version that leaks every one of
	// them into the layer forever. (It did. That is why this line reads the way it does.)
	const dropped = L.linkEl(long.id).repeats.slice();
	L.setZoom(0.2);     // 5000-unit view, spacing 1250, pipe 1000
	L.refreshLabelText();
	ok('zooming out returns it to a single label', L.stations(long).length === 1);
	ok('...and takes the repeat elements away with it', L.linkEl(long.id).repeats.length === 0);
	ok('...removing them from the map, not merely forgetting them',
		dropped.length > 0 && dropped.every(r => !L.inLayers(r.text) && !L.inLayers(r.mask)),
		dropped.length + ' dropped');
}

// ---- 4. VD is the LARGER of the two view dimensions -------------------------------------------
console.log('\n--- VD = max(map width, map height) ---');
{
	// A tall narrow window. Tom specified max, not width, and the reason shows here: on a portrait
	// phone the width alone would quarter a dimension the drawing is not actually being read along,
	// and every long north-south main would fill with labels.
	L.setCanvas(400, 1600);
	L.setZoom(1);
	ok('the view is taller than it is wide', L.visibleMapHeight() > L.visibleMapWidth(),
		L.visibleMapWidth() + ' x ' + L.visibleMapHeight());
	ok('...and the spacing is a quarter of the HEIGHT, the larger of the two',
		near(L.spacing(), 400), L.spacing());
}

// ---- 4b. The station is fixed; the SIDE is not -------------------------------------------------
console.log('\n--- a chain cannot slide, but it can change sides ---');
{
	L.setCanvas(1000, 1000);
	L.setZoom(1);
	L.setSetting('alignPipeLabels', true);
	L.relayout();
	// The mechanism, first: alignedLabelPlacement() takes a forced side, and the two sides are
	// really on opposite sides of the pipe. Without this the flip below could "work" by returning
	// the same placement twice.
	const le = L.linkEl(long.id);
	const top = L.placement(long, le, 0.5, 1), bot = L.placement(long, le, 0.5, -1);
	ok('a placement can be forced to either side of the pipe', top.side === 1 && bot.side === -1,
		top.side + ' / ' + bot.side);
	ok('...and the two really are on opposite sides', (top.ay - 0) * (bot.ay - 0) < 0,
		top.ay + ' vs ' + bot.ay);
	// The natural choice is the top, unless the clearance rule sees a reason -- the pipe here is
	// alone, so it is the top.
	ok('...with the top as the natural choice on an uncrowded pipe',
		L.placement(long, le, 0.5).side === 1);
	// Now the flip in anger. A Text label parked exactly where one station's top-side box lands is
	// an immovable obstacle, and the chain has no station to slide to -- so if the side is not free,
	// that label lies on top of the obstacle and Tom's question is answered "no".
	const st = L.drawn(long), blocked = st[1], at = L.placement(long, le, blocked, 1);
	// Sized 1x on purpose: a taller blocker would straddle the pipe and block BOTH sides, and the
	// station would have nowhere to go -- which is a real outcome but not the one under test here.
	L.addText(at.ax, at.ay, null);
	L.relayout();
	ok('the blocked station moved to the other side of its pipe',
		L.linkEl(long.id).stationSides[1] === -1,
		JSON.stringify(L.linkEl(long.id).stationSides));
	// BOTH neighbours, and the one AFTER matters more than the one before: the flip is decided in a
	// loop, so a decision that leaked into the next iteration would put a label on the wrong side of
	// a pipe nothing was blocking, and only a later station can catch that.
	ok('...and its neighbours, which nothing was blocking, stayed where they were',
		L.linkEl(long.id).stationSides[0] === undefined &&
		L.linkEl(long.id).stationSides[2] === undefined &&
		L.linkEl(long.id).stationSides[3] === undefined,
		JSON.stringify(L.linkEl(long.id).stationSides));
	// THE SPACING SURVIVED, which is the whole reason the side is the freedom being spent rather
	// than the station: an evenly spaced chain that shuffles along its pipe to dodge things stops
	// reading as one name repeated.
	ok('...and the stations did NOT move -- the even spacing is intact',
		JSON.stringify(L.drawn(long)) === JSON.stringify(st), JSON.stringify(L.drawn(long)));
	L.getDoc().labels.length = 0;
	L.relayout();
}

// ---- 5. A label the user placed by hand is never copied ---------------------------------------
console.log('\n--- a dragged label is one label ---');
{
	L.setCanvas(1000, 1000);
	L.setZoom(1);
	L.refreshLabelText();
	ok('the long pipe is repeating again before the drag', L.stations(long).length === 4);
	// lx/ly is the persisted drag offset. There is exactly one of it, so it can only describe one
	// label -- and copying a label the user deliberately positioned to five other places is not
	// what they asked for.
	long.lx = 40; long.ly = -20;
	L.refreshLabelText();
	ok('once dragged, it is a single label again', L.stations(long).length === 1,
		JSON.stringify(L.stations(long)));
	ok('...and the copies are gone from the drawing', L.linkEl(long.id).repeats.length === 0);
	delete long.lx; delete long.ly;
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
