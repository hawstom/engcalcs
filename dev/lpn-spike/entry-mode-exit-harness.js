// THE TWO WAYS OUT OF AN ENTRY MODE -- Tom, 2026-09-05. Run with:
//   node dev/lpn-spike/entry-mode-exit-harness.js
//
// *"Clicking on a link (pipe, pump, or valve) while in entry mode should end entry mode. Esc should
// end entry mode."*
//
// **WHAT WOULD MAKE THIS PASS FOR THE WRONG REASON** is a harness that calls setMode('select') and
// then asserts the mode is 'select'. The whole change lives in the WIRING -- which press reaches
// which branch, and which Escape listener gets the key first -- so every assertion below drives the
// page's own pointerdown/pointerup handlers and its own keydown listeners, in registration order,
// with stopPropagation honoured so a capture-phase handler can really take the key.
//
// The half that is easy to forget is what must NOT change:
//   * a NODE within reach still outranks the exit, or the second click of a pipe drawn to a
//     junction that sits on another pipe would put the tool away instead of connecting;
//   * add-text still anchors a new Text to the pipe it was clicked on (Task 502);
//   * Delete and Vertices still act on the link, because a link click is the point of both;
//   * an abandoned half-drawn pipe leaves no link, no vertex and no undo press behind;
//   * Escape still closes an open box, and costs the box rather than the box AND the tool.

'use strict';

const { byId, setUnitSet, setHitTarget, loadLoopedNetwork } = require('./lpn-dom-stub.js');

// The stub's document.addEventListener is a no-op, so the page's four Escape listeners would be
// dropped on the floor. Recorded here, BEFORE the page is evaluated, in registration order -- which
// is also capture-before-bubble for this file, since every capture listener in it is registered
// above the one bubble listener that closes the boxes.
const keydownListeners = [];
global.document.addEventListener = function (type, fn) {
	if (type === 'keydown') { keydownListeners.push(fn); }
};

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, addLink: addLink, addText: addText, buildDom: buildDom,\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
	"\t\tgetMode: function () { return mode; },\n" +
	"\t\tlinkById: linkById,\n" +
	"\t\tselectedRef: function () { return selection; },\n" +
	"\t\topenPopupRef: function () { return currentPopup; },\n" +
	"\t\tclosePopup: closePopup,\n" +
	"\t\tundoDepth: function () { return undoStack.length; },\n" +
	"\t\tpendingFrom: function () { return pendingLinkFrom; },\n" +
	"\t\tpendingVerts: function () { return pendingLinkVerts.slice(); },\n" +
	"\t\tsetScale: function (s) { state.s = s; state.tx = 0; state.ty = 0; },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tlabelsByLinkAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: '', activeScenario: 'base' }; scenarios = defaultScenarios();\n" +
	"\t\t\tselection = null; currentPopup = null; undoStack.length = 0;\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world);\n" +
	"\t\t\tpendingPathEl = el('polyline', { style: 'display:none' }, world); }\n"
);
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const svg = byId.lpn_canvas;
byId.lpn_toolbar.querySelectorAll = function () { return []; };

// A hit element as the pointer handlers see one: the dataset names the subject, and a link's halo
// is not a vertex handle.
function hit(dataset) {
	return { dataset: dataset, classList: { contains: function () { return false; } } };
}
const BARE = null;   // bare map -- mapHitAt() answers with the <svg> itself

function fire(type, ev) {
	setHitTarget(ev.target && ev.target.dataset ? ev.target : null);
	(svg._listeners[type] || []).slice().forEach(function (fn) { fn(ev); });
}
function click(target, x, y) {
	fire('pointerdown', { pointerId: 1, clientX: x, clientY: y, target: target, pointerType: 'mouse', button: 0 });
	fire('pointerup', { pointerId: 1, clientX: x, clientY: y, target: target, pointerType: 'mouse' });
}
// **stopPropagation IS HONOURED**, and it has to be: the precedence this task decides is expressed
// entirely through one capture-phase listener taking the key away from the bubble one.
function esc() {
	let stopped = false;
	const ev = { key: 'Escape', stopPropagation: function () { stopped = true; }, preventDefault: function () {} };
	keydownListeners.slice().forEach(function (fn) { if (!stopped) { fn(ev); } });
}

// A drawing with a pipe far away from every node, so a press on the pipe is a press on a LINK and
// nothing else: the exit is gated on there being no node within reach, and a test that pressed near
// a junction would pass whatever the gate did.
function build() {
	L.reset();
	svg._listeners = {};
	L.wirePointerEvents();
	L.setScale(1);
	L.setMode('select');
	const a = L.addNode('junction', 0, 0).id;
	const b = L.addNode('junction', 600, 0).id;
	const c = L.addNode('junction', 600, 600).id;
	const ab = L.addLink('pipe', a, b).id;
	const pump = L.addLink('pump', b, c).id;
	L.closePopup();
	return { a: a, b: b, c: c, ab: ab, pump: pump };
}
// The middle of pipe A-B: 300 world units from either end, far outside any reach.
const MIDX = 300, MIDY = 0;

const ADD_MODES = ['add-junction', 'add-reservoir', 'add-tank', 'add-pipe', 'add-pump', 'add-valve'];

// ---------------------------------------------------------------------------
// 1. A CLICK ON A LINK ENDS THE MODE, AND OPENS THE LINK.
// ---------------------------------------------------------------------------
console.log('\n--- clicking a link ends entry mode ---');
ADD_MODES.forEach(function (m) {
	const n = build();
	const nodes0 = L.getDoc().nodes.length, links0 = L.getDoc().links.length;
	L.setMode(m);
	click(hit({ link: n.ab }), MIDX, MIDY);
	ok(m + ': the tool is put away', L.getMode() === 'select', L.getMode());
	ok(m + ': ...the pipe is selected',
		!!L.selectedRef() && L.selectedRef().kind === 'link' && L.selectedRef().id === n.ab,
		JSON.stringify(L.selectedRef()));
	ok(m + ': ...its properties are showing',
		!!L.openPopupRef() && L.openPopupRef().kind === 'link' && L.openPopupRef().id === n.ab,
		JSON.stringify(L.openPopupRef()));
	ok(m + ': ...and nothing was drawn on top of it',
		L.getDoc().nodes.length === nodes0 && L.getDoc().links.length === links0,
		L.getDoc().nodes.length + '/' + L.getDoc().links.length);
});
{
	// A PUMP is a link too, and Tom named all three kinds.
	const n = build();
	L.setMode('add-junction');
	click(hit({ link: n.pump }), 600, 300);
	ok('a pump click ends the mode and opens the pump',
		L.getMode() === 'select' && !!L.openPopupRef() && L.openPopupRef().id === n.pump);
	// A link's own DATA LABEL is that link's data, and opens the same box in Select.
	const n2 = build();
	L.setMode('add-tank');
	click(hit({ linklbl: n2.ab }), MIDX, MIDY + 8);
	ok('a click on a link\'s data label does the same',
		L.getMode() === 'select' && !!L.openPopupRef() && L.openPopupRef().id === n2.ab,
		L.getMode() + ' ' + JSON.stringify(L.openPopupRef()));
}

// ---------------------------------------------------------------------------
// 2. A HALF-DRAWN PIPE IS ABANDONED CLEANLY.
// ---------------------------------------------------------------------------
console.log('\n--- a half-drawn pipe is abandoned, not left dangling ---');
{
	const n = build();
	const doc = L.getDoc();
	const links0 = doc.links.length, undo0 = L.undoDepth();
	L.setMode('add-pipe');
	click(BARE, 0, 0);                    // the from-node, picked by the snap
	ok('a drawing is in progress', L.pendingFrom() === n.a, L.pendingFrom());
	click(BARE, 100, 200);                // one bend in open space
	ok('...with a bend picked', L.pendingVerts().length === 1);
	click(hit({ link: n.ab }), MIDX, MIDY);
	ok('a link click ends the tool', L.getMode() === 'select', L.getMode());
	ok('...the from-node is released', L.pendingFrom() === null, L.pendingFrom());
	ok('...the picked bends are gone', L.pendingVerts().length === 0,
		JSON.stringify(L.pendingVerts()));
	ok('...no link was created', doc.links.length === links0, doc.links.length);
	ok('...no vertex reached any existing link',
		doc.links.every(function (l) { return l.verts.length === 0; }));
	ok('...and it cost no dead press of Undo', L.undoDepth() === undo0,
		L.undoDepth() + ' vs ' + undo0);
	// The NEXT pipe must not inherit the abandoned one's bend.
	L.setMode('add-pipe');
	click(BARE, 0, 0); click(BARE, 600, 0);
	const made = doc.links[doc.links.length - 1];
	ok('the next pipe drawn is straight', made.verts.length === 0, JSON.stringify(made.verts));
}

// ---------------------------------------------------------------------------
// 3. WHAT THE EXIT MUST NOT TAKE.
// ---------------------------------------------------------------------------
console.log('\n--- the drawing gesture is untouched ---');
{
	// A NODE WITHIN REACH OUTRANKS THE LINK. Pressing on node B -- which every pipe here ends at --
	// while add-pipe holds node A is the CONNECTION, not the exit.
	const n = build();
	const doc = L.getDoc();
	L.setMode('add-pipe');
	click(BARE, 0, 0);
	click(hit({ link: n.ab }), 600, 0);   // the browser says "pipe"; node B is under the point
	ok('a press on a node still finishes the pipe, even where the hit test says link',
		L.getMode() === 'add-pipe' && doc.links.length === 3, L.getMode() + ' ' + doc.links.length);
	const made = doc.links[doc.links.length - 1];
	ok('...between the two nodes', made.from === n.a && made.to === n.b, made.from + '->' + made.to);
}
{
	// ADD-TEXT ANCHORS TO THE PIPE IT WAS CLICKED ON (Task 502), and the exception is about the
	// ANCHOR and nothing else.
	//
	// **IT PUTS THE TOOL DOWN NOW, WHICH SUPERSEDES THIS SECTION'S 2026-09-05 ASSERTION** (Tom,
	// 2026-09-08: *"I add a Text. It can't be dragged."*). It kept the tool, and pointerdown
	// returns before it arms any drag while the mode still begins with `add-`, so the Text you had
	// just placed was the one Text on the drawing you could not pick up. Nothing about the element
	// was wrong; an OLD Text behaved differently only because reaching one meant leaving the tool
	// first.
	//
	// **THE 2026-09-05 RULE IS UNTOUCHED, and this is why the two do not collide**: that rule is
	// that a link click in an entry mode ends the mode, with add-text carved out so its click can
	// ANCHOR instead of exiting. The anchor is asserted below and still happens; what changed is
	// what the tool does AFTER placing, which that rule says nothing about. A Text is a one-shot
	// placement, unlike a junction, where drawing ten in a row is the normal way to use the tool.
	const n = build();
	const doc = L.getDoc();
	L.setMode('add-text');
	click(hit({ link: n.ab }), MIDX, MIDY);
	ok('add-text puts its tool down, so the Text just placed can be dragged',
		L.getMode() === 'select', L.getMode());
	ok('...and anchors the new Text to that pipe',
		doc.labels.length === 1 && doc.labels[0].anchorLink === n.ab,
		JSON.stringify(doc.labels[0] && doc.labels[0].anchorLink));
}
{
	// DELETE and VERTICES are not entry modes: a link click is the whole point of both.
	const n = build();
	L.setMode('delete');
	click(hit({ link: n.ab }), MIDX, MIDY);
	ok('Delete still deletes the link it was clicked on',
		L.getMode() === 'delete' && !L.linkById(n.ab), L.getMode());

	const n2 = build();
	L.setMode('vertices');
	click(hit({ link: n2.ab }), MIDX, 40);
	ok('Vertices still bends the link it was clicked on',
		L.getMode() === 'vertices' && L.linkById(n2.ab).verts.length === 1,
		L.getMode() + ' ' + JSON.stringify(L.linkById(n2.ab).verts));

	// And SELECT mode is not an entry mode either -- its link tap is on a 300 ms debounce, so the
	// popup is deliberately NOT open at the end of the gesture.
	const n3 = build();
	L.setMode('select');
	click(hit({ link: n3.ab }), MIDX, MIDY);
	ok('Select mode is unchanged: the link is selected, the popup still debounced',
		L.getMode() === 'select' && L.selectedRef().id === n3.ab && !L.openPopupRef(),
		JSON.stringify(L.openPopupRef()));
}

// ---------------------------------------------------------------------------
// 4. ESCAPE ENDS AN ENTRY MODE.
// ---------------------------------------------------------------------------
console.log('\n--- Escape ends entry mode ---');
// **AND ESCAPE ENDS EVERY TOOL, NOT ONLY AN ENTRY ONE** (Task 589). Tom, 2026-09-05, asked
// whether Delete and Vertices wanted both exits and answered his own question: *"The answer is no.
// But they can have [Esc] as a way out. Select is the 'home' mode."* So the LINK CLICK stays the
// six entry tools' alone -- section 3 above is what holds that line, and deleting a pipe and
// bending it are what those two tools are FOR -- while Escape is every tool's, because it asks for
// nothing and being in Delete without knowing it is the scariest of the three.
ADD_MODES.concat(['delete', 'vertices']).forEach(function (m) {
	build();
	L.setMode(m);
	esc();
	ok(m + ': Escape puts the tool away', L.getMode() === 'select', L.getMode());
});
{
	// Escape in Select costs nothing, which is the mutant: a handler that fired setMode() on every
	// press would look identical from every assertion above.
	build();
	L.setMode('select');
	esc();
	ok('select: Escape in the home mode is a no-op', L.getMode() === 'select', L.getMode());
}
{
	const n = build();
	const doc = L.getDoc();
	const links0 = doc.links.length;
	L.setMode('add-pipe');
	click(BARE, 0, 0);
	click(BARE, 100, 200);
	ok('a half-drawn pipe is in flight', L.pendingFrom() === n.a && L.pendingVerts().length === 1);
	// **ONE ESCAPE COSTS ONE THING.** The drawing is inner, so the first Escape abandons it and the
	// tool stays -- that is Task 567's behaviour and it must not change.
	esc();
	ok('the first Escape abandons the drawing', L.pendingFrom() === null && L.pendingVerts().length === 0);
	ok('...and keeps the tool', L.getMode() === 'add-pipe', L.getMode());
	ok('...leaving no link behind', doc.links.length === links0, doc.links.length);
	esc();
	ok('the second Escape puts the tool away', L.getMode() === 'select', L.getMode());
}

// ---------------------------------------------------------------------------
// 5. AND ESCAPE STILL CLOSES A BOX -- the box, and not the box AND the tool.
// ---------------------------------------------------------------------------
console.log('\n--- an open box takes the Escape first ---');
[['lpn_settings_box', 'flex'], ['lpn_library_box', 'flex'], ['lpn_popup', 'block']].forEach(function (pair) {
	const id = pair[0];
	build();
	L.setMode('add-junction');
	const box = byId[id];
	box.style.display = pair[1];
	esc();
	ok(id + ' closes on Escape', box.style.display === 'none', box.style.display);
	ok('...and the tool survives that press', L.getMode() === 'add-junction', L.getMode());
	esc();
	ok('...the next Escape puts the tool away', L.getMode() === 'select', L.getMode());
});
{
	// A box that Escape does NOT close must not stand between the reader and their tool. Find is
	// that box today.
	build();
	L.setMode('add-valve');
	byId.lpn_find_popup.style.display = 'block';
	esc();
	ok('an open Find box does not block the exit', L.getMode() === 'select', L.getMode());
	byId.lpn_find_popup.style.display = 'none';
}

console.log(fails ? '\n' + fails + ' FAILURES' : '\nall entry-mode-exit assertions pass');
process.exit(fails ? 1 : 0);
