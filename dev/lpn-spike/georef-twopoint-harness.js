// The TWO KNOWN POINTS door onto EngCalcs.lpnGeorefFromTwoPoints() -- ROADMAP Task 436.
//
//   node dev/lpn-spike/georef-twopoint-harness.js
//
// dev/lpn-spike/georef-harness.js already proves the arithmetic of fromTwoPoints(). That function
// had no interface at all until this task, so what is new -- and what only an integration test can
// see -- is the DOOR:
//
//   1. **THE BUTTON IS REAL AND ITS LISTENER IS THE SHIPPED ONE.** The bar is built in
//      Looped-Network.php and wired in georefWireBar(), so this harness creates the bar's ids in the
//      shared stub, calls the real georefWireBar(), and then fires the button's own registered click
//      handler. Nothing here calls georefTwoPointStart() directly -- a test that reached past the
//      button would pass with no button on the page, which is exactly the defect this task closed.
//   2. **A PICK IS A POINTERDOWN ON THE CANVAS, THROUGH georefPointerDown().** That is the function
//      the page's own pointerdown listener calls while the wizard is armed, and it is where the pick
//      has to win the press away from the body polygon that covers the whole model.
//   3. **THE TRANSFORM PUTS THE TWO NODES EXACTLY WHERE THE USER SAID THEY WERE.** Graded by asking
//      the document, in the OUTWARD frame -- the longitude and latitude the page reports and stores
//      -- and not by re-running the transform, which would agree with itself whatever it did.
//   4. **EVERY REFUSAL parseLatLon() ALREADY KNOWS.** Prose, one number, three numbers, a latitude
//      past the pole; plus the two this door owns: the same node twice, and a cancelled prompt.
//   5. **IT IS NOT A SECOND COMMIT PATH.** After a two-point placement the wizard is still in step 2
//      with nothing else about the network touched, Cancel is still `===`, and Finish still commits.

const { ROOT, byId, ensure, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-georef.js');

// **THE BAR'S IDS ARE CREATED HERE, NOT IN THE SHARED STUB.** georefRefreshBar() and georefWireBar()
// both return at their first line when #lpn_georef_bar is missing, which is why no existing harness
// has ever exercised a control on this bar. They are ensured locally so that this harness gets the
// real wiring without changing what every other harness sees.
[
	'lpn_georef_bar', 'lpn_georef_step', 'lpn_georef_hint', 'lpn_georef_numbers',
	'lpn_georef_scale_in', 'lpn_georef_rot_in', 'lpn_georef_unit', 'lpn_georef_goto',
	'lpn_georef_asdeg', 'lpn_georef_twopt', 'lpn_georef_drop', 'lpn_georef_detach',
	'lpn_georef_finish', 'lpn_georef_cancel'
].forEach(ensure);

let promptQueue = [];
let promptSeen = [];
global.window.prompt = global.prompt = function (text) {
	promptSeen.push(String(text));
	return promptQueue.length ? promptQueue.shift() : null;
};
global.window.confirm = global.confirm = function () { return true; };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getProject: function () { return project; },\n" +
	"\t\taddNode: addNode, addLink: addLink,\n" +
	"\t\tgeorefStart: georefStart, georefAttach: georefAttach, georefDetach: georefDetach,\n" +
	"\t\tgeorefGoTo: georefGoTo, georefFinish: georefFinish, georefCancel: georefCancel,\n" +
	"\t\tgeorefState: function () { return georef; },\n" +
	// Tom's 2026-09-08 worklist: what the coordinate parser accepts, and the tab strip the wizard locks.
	"\t\tparseLatLon: parseLatLon,\n" +
	"\t\tswitchToTab: switchToTab, tabsLocked: function () {\n" +
	"\t\t\tvar t = document.getElementById('lpn_tabs');\n" +
	"\t\t\treturn !!t && t.classList.contains('lpn-tabs-locked'); },\n" +
	"\t\tgeorefWireBar: georefWireBar, georefRefreshBar: georefRefreshBar,\n" +
	"\t\tgeorefPointerDown: georefPointerDown,\n" +
	"\t\tviewState: function () { return state; },\n" +
	"\t\toutwardX: outwardX, outwardY: outwardY,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }, "
);
L.buildLayers();
byId.lpn_canvas.clientWidth = 1000;
byId.lpn_canvas.clientHeight = 500;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function notice() { return byId.lpn_map_notice.textContent; }
function clickTwoPt() {
	(byId.lpn_georef_twopt._listeners.click || []).forEach(function (fn) { fn({ target: byId.lpn_georef_twopt }); });
}
// Where a node is being DRAWN, in client pixels. The stub's canvas rect starts at (0, 0), so this is
// the page's own `world * scale + translate` and nothing else -- the exact inverse of
// screenToWorld(), which is what georefPointerSrc() will run on the way back.
function screenOfNode(i) {
	const st = L.viewState(), n = L.getDoc().nodes[i];
	return { clientX: n.x * st.s + st.tx, clientY: n.y * st.s + st.ty, pointerId: 1 };
}
function pressNode(i) { return L.georefPointerDown(screenOfNode(i)); }

// A small L-shaped grid network -- L-shaped so a missing north-south flip cannot hide behind
// symmetry, the same reason dev/lpn-spike/georef-place-harness.js uses one.
setUnitSet('us');
const R = L.addNode('reservoir', 0, 0);
const A = L.addNode('junction', 1000, 0);
const B = L.addNode('junction', 1000, -800);   // internal y is DOWN, so this is 800 units NORTH
A._demand = 120; B._demand = 80; R._head = 250;
L.addLink('pipe', R.id, A.id);
L.addLink('pipe', A.id, B.id);
const doc = L.getDoc();

const before = JSON.stringify(doc.nodes.map(n => [n.id, n.x, n.y]));
const lengthsBefore = JSON.stringify(doc.links.map(l => [l.id, l._length, l._diameter, l.lenAuto]));
const elevBefore = JSON.stringify(doc.nodes.map(n => [n.id, n.elev, n._demand]));

// ---------------------------------------------------------------------------
// 1. The button exists, is wired, and belongs to step 2.
// ---------------------------------------------------------------------------
console.log('\n--- the door is a real button on the placement bar ---');
{
	const php = require('fs').readFileSync(ROOT + 'Looped-Network.php', 'utf8');
	ok('Looped-Network.php carries #lpn_georef_twopt inside #lpn_georef_bar',
		php.indexOf('id="lpn_georef_bar"') >= 0 &&
		php.indexOf('id="lpn_georef_twopt"') > php.indexOf('id="lpn_georef_bar"') &&
		php.indexOf('id="lpn_georef_twopt"') < php.indexOf('id="lpn_georef_cancel"'));
}
L.georefWireBar();
ok('...and georefWireBar() registered a listener on it',
	(byId.lpn_georef_twopt._listeners.click || []).length === 1);

L.georefStart();
ok('the wizard opens in step 1', L.georefState() && L.georefState().step === 1);
ok('...where the two-point button is HIDDEN, because a pick cannot be read while the model is held still',
	byId.lpn_georef_twopt.style.display === 'none', byId.lpn_georef_twopt.style.display);
clickTwoPt();
ok('...and pressing it there arms nothing', !L.georefState().pick);

const SITE = { lat: 38.106067, lon: -122.5686103 };
L.georefGoTo(SITE, 3000 * 0.3048);
L.georefAttach();
ok('step 2 shows the button', byId.lpn_georef_twopt.style.display === '',
	JSON.stringify(byId.lpn_georef_twopt.style.display));

// ---------------------------------------------------------------------------
// 2. The refusals, before the success -- so a pass cannot be an accident of ordering.
// ---------------------------------------------------------------------------
console.log('\n--- what it refuses ---');
clickTwoPt();
ok('the button arms the pick', !!L.georefState().pick);
ok('...and says what to click', notice().indexOf('Click a point') === 0, notice());

// The English a notice must equal, read out of the language file the DOM stub already loads --
// never retyped here. Two harnesses broke on 2026-09-08 by pinning a wording Tom had just changed.
function langValue(k) {
	var v = (EngCalcs.pageConfig || {})[k];
	if (v !== undefined) { return v; }
	var lang = require('fs').readFileSync(
		require('path').join(__dirname, '..', '..', 'lib', 'lang.ec.en.php'), 'utf8');
	var m = new RegExp("\\$ec_lang\\['" + k + "'\\]='((?:[^'\\\\]|\\\\.)*)'").exec(lang);
	return m ? m[1].replace(/\\'/g, "'") : null;
}

const beforeRefusals = JSON.stringify(L.georefState().t);

// parseLatLon()'s own refusals, each reaching this door through the same prompt.
[
	['prose', 'somewhere near the tank'],
	// NOT '38.106' any more: Tom ruled int.int a pair on 2026-09-08, so that string is now 38 N
	// 106 E and is accepted. A lone bare integer is still not two numbers by any reading.
	['one bare integer, which is not a pair', '38'],
	['three numbers, which is what a thousands separator makes', '1,234.5 -122.5'],
	['a latitude past the pole', '138 -122'],
	['a longitude past the antimeridian', '38 -222']
].forEach(function (c) {
	promptQueue = [c[1]];
	pressNode(1);
	// Matched on the KEY'S OWN VALUE rather than on words: Tom rewrote this sentence on 2026-09-08
	// and a harness pinning English is a harness that breaks on an edit that changed nothing.
	ok('refused: ' + c[0], L.georefState().pick.pts.length === 0 &&
		notice() === langValue('lpn_goto_bad'), notice());
});
ok('...and every refusal left the pick armed on the same point, so a typo costs one click',
	!!L.georefState().pick && L.georefState().pick.pts.length === 0);
ok('...and moved nothing', JSON.stringify(L.georefState().t) === beforeRefusals);

// The two this door owns. First: the same node twice.
promptQueue = ['38.106067 -122.5686103'];
pressNode(1);
ok('a good first point is taken', L.georefState().pick.pts.length === 1);
ok('...and the prompt named the node it snapped to',
	promptSeen[promptSeen.length - 1].indexOf('(' + A.id + ')') > 0, promptSeen[promptSeen.length - 1]);
ok('...and asks for the second one', notice().indexOf('second known point') > 0, notice());
promptQueue = ['38.2 -122.4'];
pressNode(1);
ok('the same point twice is refused by name',
	L.georefState().pick.pts.length === 1 && notice().indexOf('picked first') > 0, notice());
ok('...without even asking for a coordinate',
	promptSeen[promptSeen.length - 1].indexOf('(' + A.id + ')') > 0);

// Second: a cancelled prompt puts the tool down and says what you are back to.
promptQueue = [];   // the stub prompt answers null when the queue is empty
pressNode(2);
ok('cancelling the prompt disarms the pick', !L.georefState().pick);
ok('...and the notice is step 2\'s own instructions again',
	notice().indexOf('on the ground now') > 0, notice());

// ---------------------------------------------------------------------------
// 3. The placement itself.
// ---------------------------------------------------------------------------
console.log('\n--- two known points place the model exactly ---');
// Two real coordinates a surveyor might hand over: the reservoir at the corner of the site, and the
// far junction 1000 units east and 800 units north of it. They are NOT the placement the wizard
// currently holds -- Go to… put the model somewhere plausible and this moves it to the truth.
const P0 = { lat: 38.100000, lon: -122.560000 };
const P1 = { lat: 38.106500, lon: -122.548000 };
clickTwoPt();
promptQueue = ['38.1, -122.56'];              // a comma between them, which is what a map hands you
pressNode(0);
promptQueue = ['38,1065 -122,548'];           // and a decimal COMMA, which most of our languages write
pressNode(2);
ok('two points finish the pick', !L.georefState().pick);
ok('...and say so', notice().indexOf('two points you gave') > 0, notice());

{
	const n = doc.nodes;
	const dLat0 = Math.abs(L.outwardY(n[0].y) - P0.lat), dLon0 = Math.abs(L.outwardX(n[0].x) - P0.lon);
	const dLat1 = Math.abs(L.outwardY(n[2].y) - P1.lat), dLon1 = Math.abs(L.outwardX(n[2].x) - P1.lon);
	// 1e-9 degrees is about 0.1 mm. The residual is the mercY/mercLat round trip the drawing frame
	// costs, not the transform, which is exact at both control points by construction.
	ok('the first control point landed on the coordinate the user gave',
		dLat0 < 1e-9 && dLon0 < 1e-9, dLat0.toExponential(2) + ' / ' + dLon0.toExponential(2));
	ok('the second control point landed on the coordinate the user gave',
		dLat1 < 1e-9 && dLon1 < 1e-9, dLat1.toExponential(2) + ' / ' + dLon1.toExponential(2));
	// The third node was never named, and the whole claim of a similarity transform is that it comes
	// along rigidly. R->A is 1000 units east in the drawing and R->B is 1000 east and 800 north, so
	// B must sit north-east of A by exactly the drawing's own proportion.
	ok('the node nobody named came along rigidly, north of the one east of the origin',
		L.outwardY(n[2].y) > L.outwardY(n[1].y) && L.outwardX(n[1].x) > L.outwardX(n[0].x));
	// **AND THE SCALE IS THE ONE THE TWO POINTS IMPLY, not the one Go to… guessed.** The reservoir
	// and the far junction are 1281 drawing units apart; the ground distance between the two
	// coordinates given divided by that is what metersPerUnit must be, measured with js/lpn-geom.js's
	// own geodesic rather than with the transform's arithmetic.
	const Geom = require(ROOT + 'js/lpn-geom.js').lpnGeom;
	const ground = Geom.geodesicMeters(P0.lon, P0.lat, P1.lon, P1.lat);
	const units = Math.hypot(1000 - 0, -800 - 0);
	const mpu = L.georefState().t.metersPerUnit;
	ok('the scale is the one the two points imply',
		Math.abs(mpu - ground / units) / (ground / units) < 2e-4,
		mpu.toFixed(6) + ' vs ' + (ground / units).toFixed(6) + ' m per unit');
	ok('...and it is NOT the scale Go to… had guessed',
		Math.abs(mpu - 3 * 0.3048) > 0.05, mpu.toFixed(6));
}

// ---------------------------------------------------------------------------
// 4. It is the same wizard, not a second one.
// ---------------------------------------------------------------------------
console.log('\n--- and it is not a second commit path ---');
ok('the wizard is still armed, still in step 2', L.georefState() && L.georefState().step === 2);
ok('nothing but the coordinates moved -- lengths, diameters, the Auto flag',
	JSON.stringify(doc.links.map(l => [l.id, l._length, l._diameter, l.lenAuto])) === lengthsBefore);
ok('...nor elevations and demands',
	JSON.stringify(doc.nodes.map(n => [n.id, n.elev, n._demand])) === elevBefore);

// Pick it up again puts the tool down with it, or a step-1 press would be read through a transform
// that no longer says where anything is drawn.
L.georefDetach();
ok('Pick it up again disarms any pick', !L.georefState().pick);
L.georefAttach();

L.georefCancel();
ok('Cancel after a two-point placement is still EXACT',
	JSON.stringify(doc.nodes.map(n => [n.id, n.x, n.y])) === before,
	JSON.stringify(doc.nodes.map(n => [n.id, n.x, n.y])));
ok('...and the project is an XY grid again', L.getProject().coords !== 'geo');

// And Finish still commits a two-point placement, through the one path it always used.
L.georefStart();
L.georefAttach();
clickTwoPt();
promptQueue = ['38.1 -122.56'];
pressNode(0);
promptQueue = ['38.1065 -122.548'];
pressNode(2);
const placed = JSON.stringify(doc.nodes.map(n => [n.id, L.outwardX(n.x), L.outwardY(n.y)]));
L.georefFinish();
ok('Finish commits a two-point placement and leaves no tool armed', L.georefState() === null);
ok('...on the world map', L.getProject().coords === 'geo');
ok('...with the two-point coordinates the ones that survive',
	JSON.stringify(doc.nodes.map(n => [n.id, L.outwardX(n.x), L.outwardY(n.y)])) === placed);

// ---------------------------------------------------------------------------
// 5. Every string it reads is a real key.
// ---------------------------------------------------------------------------
console.log('\n--- and every sentence it says is a language key ---');
{
	const fs = require('fs');
	const lang = fs.readFileSync(ROOT + 'lib/lang.ec.en.php', 'utf8');
	const php = fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8');
	const js = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
	const keys = ['lpn_georef_twopt', 'lpn_georef_twopt_tip', 'lpn_georef_twopt_pick1',
		'lpn_georef_twopt_pick2', 'lpn_georef_twopt_same', 'lpn_georef_twopt_done'];
	keys.forEach(function (k) {
		ok(k + ' exists in lang.ec.en.php', lang.indexOf("$ec_lang['" + k + "']='") >= 0);
	});
	// The two the PHP renders and the four the JS reads are disjoint, and each set has to reach its
	// own consumer: a pageConfig entry for a key only PHP renders would be dead weight, and a missing
	// one for a key the JS reads is the "undefined" a visitor sees.
	['lpn_georef_twopt', 'lpn_georef_twopt_tip'].forEach(function (k) {
		ok(k + ' is rendered by Looped-Network.php', php.indexOf("$ec_lang['" + k + "']") >= 0);
	});
	['lpn_georef_twopt_pick1', 'lpn_georef_twopt_pick2', 'lpn_georef_twopt_same',
		'lpn_georef_twopt_done'].forEach(function (k) {
		ok(k + ' is read from pageConfig and emitted into it',
			js.indexOf('pc.' + k) >= 0 && php.indexOf('\t' + k + ':') >= 0);
	});
	// **parseLatLon() IS THE ONLY READER.** A second one here would be a second chance to get a
	// decimal comma wrong; the door is asserted to go through the one that is already guarded.
	const door = js.slice(js.indexOf('function georefTwoPointClick'));
	ok('the door reads its coordinate with parseLatLon() and reuses the Go to… prompt',
		/parseLatLon\(typed\)/.test(door.slice(0, 3000)) &&
		/pc\.lpn_goto_prompt/.test(door.slice(0, 3000)));
}

// ================================================================================================
// GO TO ACCEPTS A COMMA (Tom's 2026-09-08 worklist)
// ================================================================================================
//
// Tom, 2026-09-08, asked for `lat,lon`. The greedy-match rule already read every practical comma
// form and only the three STRINGS said space; this pins the acceptance so a future tidy-up of that
// regex cannot quietly narrow it, and pins the one shape that is refused ON PURPOSE.
console.log('\n--- Go to: a comma separates them, and one shape is refused on purpose ---');
{
	const p = L.parseLatLon;
	const at = (s, lat, lon) => {
		const r = p(s);
		return !!r && Math.abs(r.lat - lat) < 1e-9 && Math.abs(r.lon - lon) < 1e-9;
	};
	ok('a space alone', at('38.106 -122.569', 38.106, -122.569));
	ok('a comma and a space -- what every map on Earth hands you', at('38.106, -122.569', 38.106, -122.569));
	ok('a bare comma, no space', at('38.106,-122.569', 38.106, -122.569));
	ok('a bare comma between two integers, second signed', at('38,-122', 38, -122));
	ok('a comma and a space between two integers', at('38, 122', 38, 122));
	ok('spaces around the comma', at('  38 , -122  ', 38, -122));
	// THE DECIMAL COMMA, which is what half of this suite's languages write. A comma INSIDE a
	// number binds tighter than a comma between two, so this is a European coordinate and not four.
	ok('a decimal-comma locale\'s rendering of the same pair', at('38,106 -122,569', 38.106, -122.569));
	ok('...and with a separating comma as well', at('38,106, -122,569', 38.106, -122.569));
	// **`38,122` AND `38.122` ARE A PAIR NOW, ON TOM'S RULING** (2026-09-08: *"I disagree with
	// rejecting int,int or int.int. Both are obvious. Accept them."*). They used to be refused, and
	// THE REASON IS STILL TRUE: in about half of this suite's 26 languages `38,122` IS the single
	// number 38.122. What changed is the answer. A lone decimal number is not a coordinate at all,
	// so the pair is the only reading that can do anything, and lpn_goto_tip states it in words --
	// asserted below, because a rule the reader is not told about is the surprise the old refusal
	// was avoiding.
	ok('int,int is a pair', at('38,122', 38, 122));
	ok('int.int is the same pair', at('38.122', 38, 122));
	ok('...signed', at('-38.122', -38, 122));
	ok('...and with a plus', at('+38,122', 38, 122));
	// STILL REFUSED, and the narrowness is what keeps the shapes above from swallowing them.
	ok('a thousands separator makes three numbers and is refused', p('1,234.5 -122.5') === null);
	ok('prose is refused', p('Petaluma, California') === null);
	ok('a latitude past the pole is refused', p('91, 0') === null);
	ok('...including the one-token form: 91.5 is 91 north, which is nowhere', p('91.5') === null);
	ok('a longitude past 180 is refused', p('38.106, -190') === null);
	ok('one bare integer is still not a pair', p('38') === null);
	ok('a single number with anything else typed around it is refused', p('lat 38.122') === null);
	ok('four numbers are refused', p('38.1 -122.5 12 3') === null);
	// A pair the tip's own example produces still reads as that pair and not as two split tokens:
	// the split fires only when the WHOLE box is one integer-separator-integer token.
	ok('the tip\'s own example is untouched by the split rule', at('38.106, -122.569', 38.106, -122.569));

	// **THE STRINGS ARE TOM'S OWN, 2026-09-08**, and the shape of them is his ruling as much as the
	// words: the tip says what the box is FOR in one sentence, and the EXAMPLES live in the refusal,
	// which is where somebody whose last attempt failed is actually reading. He struck an explanation
	// of the int,int ambiguity outright -- *"The tip clarification is pointless IMO because nobody
	// thinks that a single number is a lat/lon."* -- so nothing here asks the tip to teach the
	// parser. Matched on the ACCEPTED SHAPES, never on wording, so an editor may reword and a
	// translator may render.
	const lang = require('fs').readFileSync(
		require('path').join(__dirname, '..', '..', 'lib', 'lang.ec.en.php'), 'utf8');
	const val = (k) => {
		const m = new RegExp("\\$ec_lang\\['" + k + "'\\]='((?:[^'\\\\]|\\\\.)*)'").exec(lang);
		return m ? m[1].replace(/\\'/g, "'") : null;
	};
	{
		const tip = val('lpn_goto_tip');
		ok('lpn_goto_tip names both separators it accepts', !!tip && /lat lon/.test(tip) && /lat,lon/.test(tip), tip);
		ok('...and does not explain the parser, which Tom struck', !!tip && tip.length < 120, tip && String(tip.length));
	}
	{
		// **EVERY EXAMPLE IN THE REFUSAL REALLY PARSES.** The one way this string can be wrong is by
		// offering a shape the parser turns away, which would leave a reader copying it and failing
		// again -- so they are pulled out of the sentence and run through parseLatLon() itself.
		const bad = val('lpn_goto_bad');
		ok('lpn_goto_bad exists and carries examples', !!bad && /Examples:/.test(bad), bad);
		const egs = (bad || '').split('Examples:')[1].split(' or ').map(function (x) { return x.trim(); });
		ok('...three of them, one per accepted shape', egs.length === 3, JSON.stringify(egs));
		egs.forEach(function (e) { ok('...and "' + e + '" really parses', p(e) !== null); });
		ok('...covering the bare comma, the single decimal and the space',
			egs.some(function (e) { return /^\S+,\S+$/.test(e); }) &&
			egs.some(function (e) { return /^[-+]?\d+\.\d+$/.test(e); }) &&
			egs.some(function (e) { return / /.test(e); }), JSON.stringify(egs));
	}
	{
		const prompt = val('lpn_goto_prompt');
		ok('lpn_goto_prompt still names the comma as well as the space',
			!!prompt && /comma/.test(prompt) && /space/.test(prompt), prompt);
	}
}

// ================================================================================================
// THE TAB STRIP IS LOCKED WHILE THE WIZARD RUNS (Tom's 2026-09-08 worklist)
// ================================================================================================
//
// Tom, 2026-09-08: switching project tabs mid xy-to-lat/lon wizard is fatal to BOTH projects.
//
// `georef` holds the untransformed source coordinates of every node, the backdrop's three original
// numbers and the undo snapshot taken before anything moved -- all about ONE document, in a module
// variable openProject() knows nothing about. Switch tabs and the incoming drawing is transformed
// by a matrix derived from coordinates it never had; finish or cancel and the OUTGOING document's
// source coordinates are written over it.
console.log('\n--- the project tabs refuse to switch while a model is being placed ---');
{
	// **THE STRIP ITSELF, ADDED TO THE STUB HERE AND NOT IN lpn-dom-stub.js.** The real page always
	// has #lpn_tabs; the shared stub does not, and giving it one would make renderTabs() build a
	// strip in every harness that has never had one. This adds the element the page really has, in
	// the one file that asks about it -- which is the opposite of a stub removing a coupling.
	ensure('lpn_tabs');
	if (L.georefState()) { L.georefCancel(); }
	// The sections above finish the wizard, which makes this project geographic -- and georefStart()
	// refuses a project that is already on lat/lon, correctly. Put the kind back so the wizard can
	// be started again; nothing else in the document is touched.
	L.getProject().coords = 'xy';
	const before = notice();
	L.georefStart();
	ok('the wizard is running', !!L.georefState());
	ok('...and the tab strip says so, so the reach stops before the press',
		L.tabsLocked());
	L.switchToTab('some-other-project');
	ok('a tab press refuses rather than switching', !!L.georefState());
	// **IT SAYS WHY.** A control that silently does nothing teaches nothing, and there is no way
	// for a reader to guess that the wizard is what is holding them.
	const said = notice();
	ok('...and it says why, naming the two commands that end the wizard',
		said !== before && /placement/i.test(said) && /Cancel/.test(said), said);

	const src = require('fs').readFileSync(
		require('path').join(__dirname, '..', '..', 'js', 'looped-network.js'), 'utf8');
	// ONE DOOR, three callers. closeTab() discards a document and opens whatever is left, and
	// newProject() opens the project it just made -- both are a project switch by another name.
	// Comments blanked first: the note beside closeTab() names the function, and a name in a
	// sentence is not a call site.
	const bare = src.split('\n').filter(function (ln) { return !/^\s*\/\//.test(ln); }).join('\n');
	//
	// **AND THE FILE MENU AND THE OPEN BUTTON JOINED THEM** (Tom, 2026-09-08: *"I think the File
	// menu and Open toolbar also must be disabled just for consistency and intuition."*). Open,
	// Open example, Import and New all end in a project switch, so the menu refuses at its own
	// door rather than opening and then refusing every row; openFromFile() carries the guard
	// separately because the toolbar button reaches it without passing the menu.
	const guards = (bare.match(/^\s*if \(georefBlocksProjectSwitch\(\)\)/gm) || []).length;
	ok('the refusal is one function, called from every door that changes project', guards === 5,
		guards + ' call sites (switchToTab, closeTab, newProject, openFileMenu, openFromFile)');
	['function switchToTab(', 'function closeTab(', 'function newProject(coords)',
		'function openFileMenu(', 'async function openFromFile('].forEach(function (f) {
		const at = src.indexOf(f);
		ok(f.replace('function ', '').replace('async ', '').replace('coords', '') + ' asks it',
			at >= 0 && src.slice(at, at + 900).indexOf('georefBlocksProjectSwitch()') >= 0);
	});
	// The tabs stay CLICKABLE: a control that is inert cannot explain itself.
	const css = require('fs').readFileSync(
		require('path').join(__dirname, '..', '..', 'css', 'engcalcs.css'), 'utf8');
	const rule = /\.lpn-tabs-locked[^}]*\{([^}]*)\}/.exec(css);
	ok('the locked strip is faded, never made inert', !!rule && !/pointer-events\s*:\s*none/.test(css.slice(css.indexOf('.lpn-tabs-locked'), css.indexOf('.lpn-tabs-locked') + 400)),
		rule && rule[1].trim());

	// The File menu and the Open button take the SAME fade, and it is a fade rather than a
	// `disabled`: an inert control cannot say why it is inert.
	ok('there is a fade class for the other two doors, and it does not make them inert',
		/\.lpn-ctl-locked\s*\{[^}]*opacity/.test(css) &&
		!/\.lpn-ctl-locked\s*\{[^}]*pointer-events\s*:\s*none/.test(css));
	ok('...and the wizard toggles it on the held File menu button and the held Open button',
		/fileMenuButton[\s\S]{0,200}lpn-ctl-locked/.test(src) &&
		/openToolButton[\s\S]{0,200}lpn-ctl-locked/.test(src));
	ok('...where the Open button is HELD by the toolbar, not looked up, because the strip is rebuilt',
		/openToolButton = openBtn;/.test(src));

	L.georefCancel();
	ok('cancelling the wizard unlocks the strip', !L.tabsLocked());
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
