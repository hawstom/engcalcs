// VERTICES ARE A MODE, NOT A GUESS -- ROADMAP Task 567. Run with:
//   node dev/lpn-spike/vertex-mode-harness.js
//
// Tom, 2026-09-01, testing on a phone: *"Vertices are a problem, and this opens a can of worms. Our
// vertices are hard to add or remove by double-clicking, and the link selection highlighting
// confuses the procedure."* The answer he found is EPANET's: *Vertices* is a MODE you turn on, and
// while it is off nothing in ordinary browsing reshapes a pipe. epanet-js does the same job with a
// deliberate Redraw; Esri Field Maps edits vertices only after the user explicitly starts editing;
// Vespucci needs a long-press "New" mode first. **All of them are foolproof because they never
// guess what the user is trying to do**, which is exactly what our double-click did.
//
// So the assertions come in two halves, and the second is the one the task is really about:
//   1. inside the mode, a SINGLE press adds, removes and moves a bend -- no double-click, which is
//      the gesture that could not be landed on a phone at all;
//   2. outside it, the double-click that used to bend a pipe does nothing.
//
// **THE STUB THAT WOULD MAKE THIS PASS FOR THE WRONG REASON** is one that calls insertVertex() and
// removeVertex() directly. Those two functions were never the defect -- closed Task 567's first
// strand had already moved the undo snapshot into them, and they worked before that. The defect was
// WHICH GESTURE REACHES THEM, so every assertion here drives the page's own pointer and dblclick
// handlers and reads the result out of `doc`.

'use strict';

const { byId, loadLoopedNetwork, setUnitSet, setHitTarget } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
	"\t\tmodeNow: function () { return mode; },\n" +
	"\t\tinsertVertex: insertVertex,\n" +
	"\t\tlinkById: linkById,\n" +
	"\t\tlinkLine: function (id) { return linkEls[id].line; },\n" +
	"\t\thandleEl: function (id, i) { return linkEls[id].handles[i]; },\n" +
	"\t\tundoDepth: function () { return undoStack.length; },\n" +
	"\t\tundo: undo,\n" +
	"\t\tnearVertex: nearestVertexNearScreen,\n" +
	"\t\tdragNow: function () { return drag ? { type: drag.type, id: drag.id, vidx: drag.vidx } : null; },\n" +
	"\t\tapplyDrag: function () { if (drag && dragDirty) { applyDrag(); dragDirty = false; } },\n" +
	"\t\ttouchSlop: function () { return TOUCH_REACH_PX; },\n" +
	"\t\tpointerSlop: function () { return POINTER_REACH_PX; },\n" +
	"\t\tworldToScreen: worldToScreen,\n" +
	"\t\tsetScale: function (s) { state.s = s; state.tx = 0; state.ty = 0; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world);\n" +
	"\t\t\tpendingPathEl = el('polyline', { style: 'display:none' }, world); }\n"
);
L.buildLayers();
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const svg = byId.lpn_canvas;
byId.lpn_toolbar.querySelectorAll = function () { return []; };

// One straight pipe from (100,100) to (500,100), one world unit per screen pixel.
function fresh() {
	L.seedDefaultInputs();
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
	L.buildDom();
	L.buildLayers();
	L.setScale(1);
	svg._listeners = {};   // wirePointerEvents() appends; see draw-vertex-harness.js
	L.wirePointerEvents();
	const a = L.addNode('junction', 100, 100).id;
	const b = L.addNode('junction', 500, 100).id;
	return { doc: doc, a: a, b: b, pipe: L.addLink('pipe', a, b) };
}
function fire(type, ev, hit) {
	setHitTarget(hit === undefined ? null : hit);
	(svg._listeners[type] || []).forEach(function (fn) { fn(ev); });
	setHitTarget(null);
}
function click(x, y, hit, kind) {
	fire('pointerdown', { pointerId: 5, clientX: x, clientY: y, pointerType: kind || 'mouse', button: 0 }, hit);
	fire('pointerup', { pointerId: 5, clientX: x, clientY: y, pointerType: kind || 'mouse' }, hit);
}
function dblclick(x, y, hit) {
	fire('dblclick', { clientX: x, clientY: y }, hit);
}

// ---------------------------------------------------------------------------
// 1. THE MODE EXISTS AND IT IS A MODE: one door, and the same door back out.
// ---------------------------------------------------------------------------
console.log('\n--- a mode, with a way back out of it ---');
{
	fresh();
	L.setMode('vertices');
	ok('the mode is reachable', L.modeNow() === 'vertices', L.modeNow());
	// **THE GRIPS ARE A CLASS ON THE CANVAS**, not a redraw: every handle already exists in the
	// drawing, so entering the mode creates nothing and leaving it destroys nothing.
	ok('...and the canvas says so, so the grips are one CSS rule',
		svg.classList.contains('lpn-vertexmode'));
	L.setMode('select');
	ok('leaving takes the grips off again', !svg.classList.contains('lpn-vertexmode'));
	// A mode with no way out is a trap on a screen with no keyboard, which is the screen this whole
	// task is about. The toolbar button and the Edit row both toggle; this is the state behind them.
	ok('...and the page is back in Select', L.modeNow() === 'select', L.modeNow());
}

// ---------------------------------------------------------------------------
// 2. ONE PRESS ADDS, ONE PRESS REMOVES. No double-click anywhere in the mode:
//    the double-click is the gesture Tom could not land on a phone, and inside
//    a mode that consumes every press there is nothing to disambiguate.
// ---------------------------------------------------------------------------
console.log('\n--- inside the mode, a single press does the work ---');
{
	const f = fresh();
	L.setMode('vertices');
	const line = L.linkLine(f.pipe.id);

	// The browser answers a press on the middle of the pipe with the pipe -- its stroke is wide.
	click(300, 100, line);
	ok('a press on a pipe puts a bend there', f.pipe.verts.length === 1,
		JSON.stringify(f.pipe.verts));
	ok('...exactly where it was pressed',
		f.pipe.verts[0].x === 300 && f.pipe.verts[0].y === 100, JSON.stringify(f.pipe.verts[0]));

	// A press ON the bend takes it out again -- the same press, on a different thing.
	click(300, 100, L.handleEl(f.pipe.id, 0));
	ok('a press on the bend takes it out', f.pipe.verts.length === 0,
		JSON.stringify(f.pipe.verts));

	// **AND A GRIP OUTRANKS THE PIPE IT SITS ON.** A bend is always on its own pipe, so without
	// this the commonest press in the mode -- on a bend -- would add a second bend beside it.
	click(300, 100, line);
	click(300, 100, line);   // the browser still says "pipe"; the finder must say "bend"
	ok('...even when the browser still answers with the pipe underneath it',
		f.pipe.verts.length === 0, JSON.stringify(f.pipe.verts));

	// Bare map is bare map. A mode that consumes every press must still not invent an edit out in
	// the open, or panning to look at the far end of a network reshapes something on the way.
	click(300, 400);
	ok('a press in open space changes nothing', f.pipe.verts.length === 0,
		JSON.stringify(f.pipe.verts));
}

// ---------------------------------------------------------------------------
// 3. THE HALF Tom MEASURED: *"dragging one is fine on PC, even near nodes, but
//    not on phone anywhere."* A grip is grabbed by the same reach every other
//    object on this page is grabbed by, so a finger gets the finger's number.
// ---------------------------------------------------------------------------
console.log('\n--- a grip is grabbable with a finger ---');
{
	const f = fresh();
	L.insertVertex(f.pipe.id, { x: 300, y: 100 });
	L.setMode('vertices');

	// 20 px off the bend: past the pointer's reach, inside the finger's. The browser's own hit test
	// finds nothing there -- a handle is drawn a couple of world units across, which is the whole
	// measured symptom.
	ok('the finger\'s reach finds the grip 20px away',
		!!L.nearVertex(320, 100, L.touchSlop()), L.touchSlop());
	ok('...where the pointer\'s would not', !L.nearVertex(320, 100, L.pointerSlop()));

	const undo0 = L.undoDepth();
	fire('pointerdown', { pointerId: 5, clientX: 320, clientY: 100, pointerType: 'touch', button: 0 });
	const d = L.dragNow();
	ok('a finger 20px off the grip begins a VERTEX drag',
		!!d && d.type === 'vertex' && d.id === f.pipe.id && d.vidx === 0,
		d && (d.type + ' ' + d.id + ' ' + d.vidx));
	// The snapshot is taken at the START of the drag: applyDrag() writes the coordinate every
	// frame, so a snapshot taken at the end would restore a half-dragged bend.
	ok('...taking its undo snapshot before the first frame', L.undoDepth() === undo0 + 1,
		L.undoDepth() + ' vs ' + undo0);
	fire('pointermove', { pointerId: 5, clientX: 320, clientY: 220, pointerType: 'touch' });
	L.applyDrag();
	ok('...and it really moves the bend', f.pipe.verts[0].y === 220, JSON.stringify(f.pipe.verts[0]));
	fire('pointerup', { pointerId: 5, clientX: 320, clientY: 220, pointerType: 'touch' });
	L.undo();
	// Re-read by ID: undo() restores a whole document from the snapshot, so the object this harness
	// was holding is no longer the one in `doc`. Asserting on the stale reference passes or fails
	// for reasons that have nothing to do with undo.
	const after = L.linkById(f.pipe.id);
	ok('...and one Undo puts it back', after.verts.length === 1 && after.verts[0].y === 100,
		JSON.stringify(after.verts));

	// **A PRESS THAT IS NOT ON A GRIP PANS**, exactly as it does in the profile's edit mode and for
	// the same reason: a bend can sit on top of a node, and the mode whose subject is the bend must
	// never move the pipework under it. Panning is also how a bend off the edge is reached.
	fire('pointerdown', { pointerId: 5, clientX: 300, clientY: 400, pointerType: 'touch', button: 0 });
	const p = L.dragNow();
	ok('a press away from every grip pans', !!p && p.type === 'pan', p && p.type);
	fire('pointerup', { pointerId: 5, clientX: 300, clientY: 400, pointerType: 'touch' });

	// And a press on a NODE, in this mode, does not drag the node.
	const at = L.worldToScreen(100, 100);
	fire('pointerdown', { pointerId: 5, clientX: at.x, clientY: at.y, pointerType: 'mouse', button: 0 });
	const n = L.dragNow();
	ok('...and so does a press on a junction: the pipework does not move in this mode',
		!!n && n.type === 'pan', n && n.type);
	fire('pointerup', { pointerId: 5, clientX: at.x, clientY: at.y, pointerType: 'mouse' });
}

// ---------------------------------------------------------------------------
// 4. **THE HALF THE TASK IS REALLY ABOUT.** In `select` -- the mode a person is
//    in while doing nothing but reading -- a double-click no longer reshapes
//    the model. It was reachable by accident: a single tap on a link opens its
//    popup only after a 300 ms debounce, deliberately, so somebody taps a pipe
//    to read it, sees nothing happen, taps again, and has bent it.
// ---------------------------------------------------------------------------
console.log('\n--- and outside the mode, nothing bends a pipe by accident ---');
{
	const f = fresh();
	const line = L.linkLine(f.pipe.id);
	L.setMode('select');

	const undo0 = L.undoDepth();
	dblclick(300, 100, line);
	ok('a double-click on a pipe in Select mode adds NO bend', f.pipe.verts.length === 0,
		JSON.stringify(f.pipe.verts));
	ok('...and costs no undo snapshot either', L.undoDepth() === undo0,
		L.undoDepth() + ' vs ' + undo0);

	// Nor does it remove one that is already there, which is the same accident in reverse and the
	// more expensive one: a bend somebody placed deliberately, gone from a stray second tap.
	L.insertVertex(f.pipe.id, { x: 300, y: 100 });
	dblclick(300, 100, L.handleEl(f.pipe.id, 0));
	ok('a double-click on a bend in Select mode does not remove it', f.pipe.verts.length === 1,
		JSON.stringify(f.pipe.verts));

	// **IT STILL WORKS INSIDE THE MODE**, where a second press on the same bend is a remove and then
	// an add, and harmless: a mode that has already been asked for is not an accident.
	L.setMode('vertices');
	dblclick(300, 100, L.handleEl(f.pipe.id, 0));
	ok('...but it still works inside the Vertices mode', f.pipe.verts.length === 0,
		JSON.stringify(f.pipe.verts));

	// **AND THE THREE LABEL-HOME RESETS ARE UNTOUCHED.** Sending a dragged label back where it came
	// from is not an edit to the network, and it is the other thing this same handler does.
	const src = require('fs').readFileSync(require('./lpn-dom-stub.js').ROOT + 'js/looped-network.js', 'utf8');
	const gate = src.indexOf("else if (mode !== 'vertices') { void 0; }");
	ok('the gate is below the three label-home resets, not above them',
		gate > src.indexOf('resetNodeLabelHome(t.dataset.nodelbl)')
		&& gate > src.indexOf('resetTextLabelHome(t.dataset.lbl)')
		&& gate < src.indexOf("removeVertex(t.dataset.link, +t.dataset.vidx); }\n\t\t\telse if (t.dataset.link"),
		gate);
	// The English must not still promise the gesture that is gone. This is the sentence a reader of
	// the mode line actually sees, and it said "Double-click a pipe to add or remove a vertex."
	const en = require('fs').readFileSync(require('./lpn-dom-stub.js').ROOT + 'lib/lang.ec.en.php', 'utf8');
	const sel = (en.match(/\$ec_lang\['lpn_mode_select'\]='([^']*)'/) || [])[1] || '';
	ok('and the Select mode line no longer promises the double-click',
		!/[Dd]ouble-click/.test(sel), sel);
	ok('...it names the tool instead', /Vertices/.test(sel), sel);
}

console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
process.exit(fails ? 1 : 0);
