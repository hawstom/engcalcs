// Headless check of SELECTION and subject-then-verb Delete -- ROADMAP Task 415.
//
//   node dev/lpn-spike/selection-harness.js
//
// WHY THIS EXISTS. Selection is the foundation Task 266 (lasso) and everything after it stand on,
// and the two ways to get it wrong are both silent:
//
//   1. **It leaks into the document.** serializeProject() hands out doc.nodes/doc.links/doc.labels
//      BY REFERENCE, so a `selected` key written onto an element rides straight into the saved file,
//      into every undo snapshot and into the dirty-signature hash -- and worse, a `selected` written
//      through setProp() inside a scenario becomes an OVERRIDE (dev/scenario-seam-repair.md): the
//      document would then record "J3 is highlighted in the Fire-flow scenario". Nothing on screen
//      would look wrong on the day it happened. So this harness asserts the round trip carries no
//      selection at all, and that no element object grows the key.
//   2. **Delete acts on the wrong thing.** Verb-then-subject deleted whatever you clicked, which is
//      self-evidently right or wrong the instant you do it. Subject-then-verb deletes something you
//      picked EARLIER, possibly several gestures ago -- so "acts on the selection and on nothing
//      else", "a drag re-aims the selection", and "a cascade drops a selection it destroyed" are all
//      testable properties that a browser pass would only catch by accident.
//
// The gestures are driven through the REAL pointer handlers and the REAL keydown listener rather
// than by calling setSelection() directly, because the defect this is guarding lives in the wiring
// between them: selecting on pointerDOWN is what makes drag-then-Delete safe, and calling the
// selection API by hand would test the half that was never in doubt.

const { ROOT, byId, ensure, setUnitSet, setHitTarget, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const fs = require('fs');

// The stub's document.addEventListener is a no-op, so the page's own keydown listeners are dropped
// on the floor and the Delete KEY -- the whole point of this task -- would be untestable. Recorded
// here, BEFORE the page is evaluated, since its listeners are registered as its IIFE runs.
const keydownListeners = [];
global.document.addEventListener = function (type, fn) {
	if (type === 'keydown') { keydownListeners.push(fn); }
};

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, addLink: addLink, addText: addText,\n" +
	"\t\tbuildDom: buildDom, applySaved: applySaved,\n" +
	"\t\tsetSelection: setSelection, clearSelection: clearSelection,\n" +
	"\t\tselectedRef: selectedRef, isSelected: isSelected, deleteSelection: deleteSelection,\n" +
	"\t\tdeleteElement: deleteElement, serializeProject: serializeProject,\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
	"\t\tgetMode: function () { return mode; },\n" +
	// The MARK, read off the drawn element rather than off the variable -- a selection nothing
	// paints is invisible to the user, which is the same defect as no selection at all.
	"\t\tmarked: function (kind, id) {\n" +
	"\t\t\tvar e2 = kind === 'node' ? (nodeEls[id] && nodeEls[id].circle)\n" +
	"\t\t\t\t: kind === 'link' ? (linkEls[id] && linkEls[id].halo)\n" +
	"\t\t\t\t: (labelEls[id] && labelEls[id].text);\n" +
	"\t\t\treturn !!e2 && e2.classList.contains('lpn-selected');\n" +
	"\t\t},\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
	"\t\t\tproject = { name: '', activeScenario: 'base' }; scenarios = defaultScenarios();\n" +
	"\t\t\tselection = null;\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); } "
);

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const src = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
byId.lpn_toolbar.querySelectorAll = () => [];
setUnitSet('us');

// A hit element as the pointer handlers see one: the dataset is what names the subject.
function hit(dataset) {
	return { dataset: dataset, classList: { contains: () => false } };
}
const EMPTY = hit({});   // bare canvas -- the backdrop, or nothing at all

const svg = byId.lpn_canvas;
function fire(type, ev) {
	setHitTarget(ev.target && ev.target.dataset ? ev.target : null);
	(svg._listeners[type] || []).forEach(fn => fn(ev));
}
// A CLICK: down and up at the same point, which is what the 4px tap threshold calls a tap.
function click(target, x, y) {
	fire('pointerdown', { pointerId: 1, clientX: x, clientY: y, target: target, button: 0 });
	fire('pointerup', { pointerId: 1, clientX: x, clientY: y, target: target });
}
// A DRAG: press, move well past the threshold, release. Never a tap, so it must not reach the
// tap-time selection path -- the pointerdown one is what has to aim the selection here.
function drag(target, x1, y1, x2, y2) {
	fire('pointerdown', { pointerId: 2, clientX: x1, clientY: y1, target: target, button: 0 });
	fire('pointermove', { pointerId: 2, clientX: x2, clientY: y2, target: target });
	fire('pointerup', { pointerId: 2, clientX: x2, clientY: y2, target: target });
}
let prevented = 0;
function pressKey(key) {
	prevented = 0;
	keydownListeners.forEach(fn => fn({ key: key, preventDefault: function () { prevented++; } }));
}

// A two-node, one-pipe network plus a free Text label -- the smallest drawing with a cascade in it.
function build() {
	L.reset();
	L.wirePointerEvents();
	L.setMode('select');
	// addNode/addLink/addText each return the ELEMENT; the tests want ids.
	const a = L.addNode('junction', 0, 0).id, b = L.addNode('junction', 50, 0).id,
		c = L.addNode('junction', 50, 50).id;
	const ab = L.addLink('pipe', a, b).id, bc = L.addLink('pipe', b, c).id;
	const t = L.addText(10, 30, null).id;
	return { a: a, b: b, c: c, ab: ab, bc: bc, t: t };
}

// ---- 1. exactly ONE selection, and picking a second clears the first --------------------------
{
	console.log('\n--- one subject at a time ---');
	const n = build();
	click(hit({ node: n.a }), 10, 10);
	ok('clicking a node selects it', L.isSelected('node', n.a), JSON.stringify(L.selectedRef()));
	ok('...and the node is MARKED on the map', L.marked('node', n.a));

	click(hit({ node: n.b }), 60, 10);
	ok('clicking a second node selects that one instead', L.isSelected('node', n.b));
	ok('...and the first is no longer selected', !L.isSelected('node', n.a));
	ok('...nor still wearing the mark', !L.marked('node', n.a));

	click(hit({ link: n.ab }), 30, 5);
	ok('clicking a pipe selects the pipe', L.isSelected('link', n.ab));
	ok('...and no node is selected any more', !L.isSelected('node', n.b) && !L.marked('node', n.b));
	ok('...the pipe wears the mark on its halo', L.marked('link', n.ab));

	click(hit({ lbl: n.t }), 15, 35);
	ok('clicking a Text label selects the label', L.isSelected('label', n.t) && L.marked('label', n.t));

	// The PARTS of an element are the element: its own data label, its vertex handles.
	click(hit({ nodelbl: n.a }), 12, 12);
	ok("a node's own data label selects the NODE", L.isSelected('node', n.a));
	click(hit({ linklbl: n.bc }), 55, 25);
	ok("a pipe's label selects the PIPE", L.isSelected('link', n.bc));
}

// ---- 2. clicking empty space clears -----------------------------------------------------------
{
	console.log('\n--- empty space clears ---');
	const n = build();
	click(hit({ node: n.a }), 10, 10);
	ok('something is selected to begin with', !!L.selectedRef());
	click(EMPTY, 400, 400);
	ok('a click on bare canvas clears the selection', L.selectedRef() === null);
	ok('...and nothing is left wearing the mark', !L.marked('node', n.a));
}

// ---- 3. a drag re-aims the selection ----------------------------------------------------------
// The reason selection happens on pointerDOWN. A drag never reaches the tap branch (it fails the
// 4px threshold), so without this a user who selected J1, then nudged J2, then pressed Delete would
// have deleted J1 -- an element they were not looking at.
{
	console.log('\n--- a drag aims the verb at what was dragged ---');
	const n = build();
	click(hit({ node: n.a }), 10, 10);
	drag(hit({ node: n.b }), 60, 10, 200, 120);
	ok('dragging a node selects THAT node', L.isSelected('node', n.b), JSON.stringify(L.selectedRef()));
}

// ---- 4. the VERB: Delete acts on the selection and on nothing else ----------------------------
{
	console.log('\n--- Delete acts on the selection ---');
	const n = build();
	click(hit({ link: n.ab }), 30, 5);
	pressKey('Delete');
	const d = L.getDoc();
	ok('the selected pipe is gone', !d.links.some(l => l.id === n.ab));
	ok('...the other pipe is untouched', d.links.some(l => l.id === n.bc), d.links.length + ' links left');
	ok('...every node is untouched', d.nodes.length === 3, d.nodes.length + ' nodes');
	ok('...and the selection is empty afterwards', L.selectedRef() === null);
	ok('the key press was consumed', prevented === 1, prevented + ' preventDefault()');

	// The cascade contract, unchanged from the Delete tool: a node takes its incident links with it,
	// because a link to a node that is not there is the dangling-link diagnostic.
	click(hit({ node: n.b }), 60, 10);
	pressKey('Delete');
	const d2 = L.getDoc();
	ok('deleting a node removes the node', !d2.nodes.some(x => x.id === n.b));
	ok('...and takes its incident links with it', d2.links.length === 0, d2.links.length + ' links left');
	ok('...but leaves the other nodes standing', d2.nodes.length === 2, d2.nodes.map(x => x.id).join(','));
}

// ---- 5. Delete with nothing selected destroys nothing ------------------------------------------
{
	console.log('\n--- no subject, no verb ---');
	const n = build();
	click(EMPTY, 400, 400);
	pressKey('Delete');
	const d = L.getDoc();
	ok('nothing is deleted when nothing is selected', d.nodes.length === 3 && d.links.length === 2);
	// The one-shot notice slot, NOT #lpn_status: "press Delete with nothing selected" is a report of
	// what just happened, so it goes on the canvas and expires. #lpn_status carries standing
	// diagnostics about the network and nothing else -- see the split at setStatus().
	ok('...and the page says so rather than doing nothing silently',
		(document.getElementById('lpn_map_notice').textContent || '').length > 0,
		JSON.stringify(document.getElementById('lpn_map_notice').textContent));

	// Backspace inside a field belongs to the field, always -- otherwise renaming an element in the
	// property popup deletes the element.
	click(hit({ node: n.a }), 10, 10);
	global.document.activeElement = { tagName: 'INPUT' };
	pressKey('Delete');
	pressKey('Backspace');
	ok('a Delete typed into an input does not reach the map',
		L.getDoc().nodes.length === 3 && L.isSelected('node', n.a));
	global.document.activeElement = null;
}

// ---- 6. a cascade drops a selection it destroyed -----------------------------------------------
{
	console.log('\n--- a destroyed subject is not still the subject ---');
	const n = build();
	click(hit({ link: n.ab }), 30, 5);       // select the pipe...
	L.deleteElement('node', n.a);            // ...then delete one of its ends, taking it with it
	ok('the pipe went with its node', !L.getDoc().links.some(l => l.id === n.ab));
	ok('...and the selection went with the pipe', L.selectedRef() === null, JSON.stringify(L.selectedRef()));
}

// ---- 7. the mark survives a rebuild ------------------------------------------------------------
// buildDom() throws every drawn element away, so a selection whose mark is not re-applied is a
// selection the user cannot see -- and one naming an element the rebuild no longer holds must go.
{
	console.log('\n--- rebuild ---');
	const n = build();
	click(hit({ node: n.a }), 10, 10);
	L.buildDom();
	ok('the selection survives buildDom()', L.isSelected('node', n.a));
	ok('...and so does its mark', L.marked('node', n.a));
}

// ---- 8. SELECTION IS NOT IN THE DOCUMENT -------------------------------------------------------
// The seam assertion. Selection is view state; it may not enter serializeProject(), and it may not
// be written through setProp() (which would make it a scenario OVERRIDE -- see the file header).
{
	console.log('\n--- selection is view state, not document state ---');
	const n = build();
	click(hit({ node: n.a }), 10, 10);
	const saved = L.serializeProject();
	const json = JSON.stringify(saved);
	ok('a round trip through serializeProject() carries no selection',
		json.indexOf('select') < 0, json.length + ' chars');
	const el = L.getDoc().nodes.find(x => x.id === n.a);
	ok('...and the selected element object grew no key of its own',
		Object.keys(el).every(k => k.toLowerCase().indexOf('select') < 0), Object.keys(el).join(','));
	// The scenario override map is the other place a document-flavoured write would land.
	ok('...and no scenario recorded an override for it',
		saved.scenarios.every(s => !Object.keys(s.overrides || {}).length));

	// Structural, because the two mistakes above are ones a future edit makes rather than this one:
	// setProp() is the overridable-property write seam and selection must never reach it.
	ok('no setProp() call names a selection property',
		!/setProp\([^;]*['"]selected['"]/.test(src) && !/setOverride\([^;]*['"]selected['"]/.test(src));
	// One variable holds it. The only `.selected =` writes in the file are on <option> elements,
	// which are a different thing wearing the same word; a write on a node/link/label is the defect.
	ok('the selection variable is the only home for it',
		/var selection = null;/.test(src)
		&& !/\b(n|n2|l|l2|lb|el|el2|node|link|label)\.selected\s*=/.test(src));

	// Opening another document must not leave the highlight on the new project's J1 -- ids repeat.
	L.applySaved(JSON.parse(json));
	ok('opening a project clears the selection', L.selectedRef() === null);
}

// ---- 9. the Delete TOOL still works ------------------------------------------------------------
// Kept deliberately: it is the only way to delete on a touch screen with no keyboard, and a delete
// spree is quicker with it. The Edit > Delete row is the one command that means both things.
{
	console.log('\n--- the verb-then-subject tool is still there ---');
	const n = build();
	L.setMode('delete');
	click(hit({ node: n.c }), 55, 55);
	ok('the Delete tool still deletes what you click', !L.getDoc().nodes.some(x => x.id === n.c));
	L.setMode('select');

	ok('deleteSelection() reports "no subject" so the menu row can fall back to the tool',
		L.deleteSelection() === false);
	ok('...and the Edit > Delete row really does try the selection first',
		/if \(deleteSelection\(\)\) \{ return; \}\n\s*setMode\(mode === 'delete' \? 'select' : 'delete'\);/.test(src));
}

console.log(fails ? '\n' + fails + ' FAILURES' : '\nall selection assertions passed');
process.exit(fails ? 1 : 0);
