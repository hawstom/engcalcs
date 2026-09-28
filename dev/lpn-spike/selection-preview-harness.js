// Headless check of the SELECTION PREVIEW hover highlight -- Ida's wishlist item 1
// (dev/agents/interface-designer/wishlist.md, journal 2026-09-10).
//
//   node dev/lpn-spike/selection-preview-harness.js
//
// WHY THIS EXISTS. Task 618 made the Select-mode cursor deliberately `default` over an object and
// over nothing -- "what you can click is what you can see" was about hit AREAS, not about telling
// the user what a click would DO. Nothing on screen answered that question, which is what this
// feature is for: a `.lpn-hover` class on the one element under the pointer, toggled from the SAME
// hit-test (`mapHitAt`) and the SAME dataset reading (`selectFromHit`'s) a click uses, so the
// preview can never promise a hit a click would not make.
//
// The two ways this could be wrong and still look green in a casual read:
//   1. **It drifts from the click.** A hover rule built from its own copy of "what counts as an
//      element" could highlight something a click does not select, or vice versa -- so this harness
//      hovers, reads the preview, THEN clicks the same target and asserts the two agree.
//   2. **It does work it was told not to.** A pointermove that ran outside Select mode, on a touch
//      pointer, or that triggered a full label pass, would be invisible to a browser pass that only
//      looks at whether the highlight itself appears -- so this harness asserts silence as directly
//      as it asserts the highlight.

const { ROOT, byId, ensure, setUnitSet, setHitTarget, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const fs = require('fs');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\taddNode: addNode, addLink: addLink, addText: addText,\n" +
	"\t\tbuildDom: buildDom,\n" +
	"\t\tsetSelection: setSelection, clearSelection: clearSelection, selectedRef: selectedRef,\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
	"\t\tgetMode: function () { return mode; },\n" +
	// The mark, read off the drawn element exactly as selection-harness.js reads .lpn-selected.
	"\t\tmarks: function (kind, id) {\n" +
	"\t\t\tvar e2 = kind === 'node' ? (nodeEls[id] && nodeEls[id].circle)\n" +
	"\t\t\t\t: kind === 'link' ? (linkEls[id] && linkEls[id].halo)\n" +
	"\t\t\t\t: (labelEls[id] && labelEls[id].text);\n" +
	"\t\t\tif (!e2) { return null; }\n" +
	"\t\t\tvar tags = [];\n" +
	"\t\t\tif (e2.classList.contains('lpn-hover')) { tags.push('hover'); }\n" +
	"\t\t\tif (e2.classList.contains('lpn-selected')) { tags.push('selected'); }\n" +
	"\t\t\treturn tags.join(' ');\n" +
	"\t\t},\n" +
	// The variable itself, so a harness can assert "nothing is hovered" without guessing which
	// element that would have been marked on.
	"\t\tgetHoverPreview: function () { return hoverPreview; },\n" +
	// The label-pass counter perfDebugCounts already keeps for the on-screen debug readout (see its
	// definition and refreshLabelText()'s perfDebugCount('labelPasses') call) -- the one existing
	// instrument for "did a network-wide label pass run", read rather than duplicated.
	"\t\tlabelPasses: function () { return perfDebugCounts.labelPasses; },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
	"\t\t\tproject = { name: '', activeScenario: 'base' }; scenarios = defaultScenarios();\n" +
	"\t\t\tselection = null; hoverPreview = null;\n" +
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
const css = fs.readFileSync(ROOT + 'css/engcalcs.css', 'utf8');
byId.lpn_toolbar.querySelectorAll = () => [];
setUnitSet('us');

// **THE FRAME LOOP, RUN SYNCHRONOUSLY.** The real page throttles the highlight to one update per
// animation frame; a harness that let the stub's `setTimeout(f, 0)` stand would have to go async for
// every single move, so it is made to run its callback immediately instead -- the same technique
// zoom-control-harness.js uses. What is under test is which frame did the work, never how many
// frames a browser would spend getting there.
global.requestAnimationFrame = function (fn) { fn(); return 0; };

function hit(dataset) {
	return { dataset: dataset, classList: { contains: () => false } };
}
const EMPTY = hit({});

const svg = byId.lpn_canvas;
function fire(type, ev) {
	setHitTarget(ev.target && ev.target.dataset ? ev.target : null);
	(svg._listeners[type] || []).slice().forEach(function (fn) { fn(ev); });
}
function move(target, x, y, pointerType) {
	fire('pointermove', { pointerId: 1, clientX: x, clientY: y, target: target, pointerType: pointerType || 'mouse' });
}
function leave(pointerType) {
	fire('pointerleave', { pointerId: 1, pointerType: pointerType || 'mouse' });
}
function click(target, x, y, pointerType) {
	fire('pointerdown', { pointerId: 1, clientX: x, clientY: y, target: target, button: 0, pointerType: pointerType || 'mouse' });
	fire('pointerup', { pointerId: 1, clientX: x, clientY: y, target: target, pointerType: pointerType || 'mouse' });
}

function build() {
	L.reset();
	L.wirePointerEvents();
	L.setMode('select');
	const a = L.addNode('junction', 0, 0).id, b = L.addNode('junction', 50, 0).id;
	const ab = L.addLink('pipe', a, b).id;
	const t = L.addText(10, 30, null).id;
	return { a: a, b: b, ab: ab, t: t };
}

// ---- 1. hovering a node highlights it, and moving off clears it -------------------------------
{
	console.log('\n--- hover on, hover off ---');
	const n = build();
	move(hit({ node: n.a }), 10, 10);
	ok('hovering a node sets the preview', JSON.stringify(L.getHoverPreview()) === JSON.stringify({ kind: 'node', id: n.a }));
	ok('...and the node wears the hover mark', L.marks('node', n.a) === 'hover');

	move(hit({ node: n.b }), 60, 10);
	ok('moving to a second node hovers that one instead', L.marks('node', n.b) === 'hover');
	ok('...and the first stops wearing it', L.marks('node', n.a) === '');

	leave();
	ok('leaving the canvas clears the preview', L.getHoverPreview() === null);
	ok('...and nothing is left wearing the mark', L.marks('node', n.b) === '');

	move(hit({ link: n.ab }), 30, 5);
	ok('hovering a pipe marks the pipe (halo)', L.marks('link', n.ab) === 'hover');
	move(hit({ lbl: n.t }), 15, 35);
	ok('hovering a Text label marks the label, and the pipe stops', L.marks('label', n.t) === 'hover' && L.marks('link', n.ab) === '');
	move(EMPTY, 400, 400);
	ok('hovering bare canvas clears the preview', L.getHoverPreview() === null);
}

// ---- 2. the preview always agrees with what a click would select ------------------------------
{
	console.log('\n--- preview matches the click, on the same hit ---');
	const n = build();
	[hit({ node: n.a }), hit({ link: n.ab }), hit({ lbl: n.t })].forEach(function (t, i) {
		const xy = [[10, 10], [30, 5], [15, 35]][i];
		move(t, xy[0], xy[1]);
		const hovered = L.getHoverPreview();
		click(t, xy[0], xy[1]);
		const selected = L.selectedRef();
		ok('hover and click agree on hit #' + i, hovered && selected &&
			hovered.kind === selected.kind && hovered.id === selected.id,
			JSON.stringify({ hovered: hovered, selected: selected }));
	});
}

// ---- 3. no highlight outside Select mode --------------------------------------------------------
{
	console.log('\n--- silent outside Select mode ---');
	const n = build();
	L.setMode('delete');
	move(hit({ node: n.a }), 10, 10);
	ok('hovering a node in Delete mode sets no preview', L.getHoverPreview() === null);
	ok('...and nothing is marked', L.marks('node', n.a) === '');
	L.setMode('vertices');
	move(hit({ node: n.a }), 10, 10);
	ok('...nor in Vertices mode', L.getHoverPreview() === null);

	// Entering Select mode WHILE hovering something is Select mode's own next move to make; the
	// rule under test here is that leaving Select drops a stale preview rather than that entering
	// it grows one with no pointermove of its own.
	L.setMode('select');
	move(hit({ node: n.a }), 10, 10);
	ok('back in Select mode, hovering works again', L.marks('node', n.a) === 'hover');
	L.setMode('vertices');
	ok('switching OUT of Select mode drops a live preview', L.getHoverPreview() === null && L.marks('node', n.a) === '');
	L.setMode('select');
}

// ---- 4. no highlight on touch, and nothing sticks after a tap ----------------------------------
{
	console.log('\n--- touch reports no hover ---');
	const n = build();
	move(hit({ node: n.a }), 10, 10, 'touch');
	ok('a touch pointermove sets no preview', L.getHoverPreview() === null);
	ok('...and nothing is marked', L.marks('node', n.a) === '');
	// A tap (pointerdown+up) still selects on touch, same as any other pointer -- and must leave
	// no hover class behind it, since a finger has no hover to report either before or after.
	click(hit({ node: n.a }), 10, 10, 'touch');
	ok('the tap still selects', L.selectedRef() && L.selectedRef().id === n.a);
	ok('...but leaves no hover mark', L.marks('node', n.a) === 'selected');
	L.clearSelection();
}

// ---- 5. selected AND hovered shows the selected look -------------------------------------------
{
	console.log('\n--- selected beats hovered ---');
	const n = build();
	click(hit({ node: n.a }), 10, 10);
	move(hit({ node: n.a }), 10, 10);
	ok('a selected, hovered node wears both classes', L.marks('node', n.a) === 'hover selected');
	// The CSS itself is the part a DOM harness cannot execute -- so the rule that makes selected
	// WIN when both classes land on the same element is asserted structurally here, the same way
	// selection-harness.js asserts the setProp() seam it cannot run a browser to prove.
	ok('CSS guarantees the selected look wins on a node',
		/\.lpn-node\.lpn-hover:not\(\.lpn-selected\)/.test(css));
	ok('...on a pipe halo', /\.lpn-link-halo\.lpn-hover:not\(\.lpn-selected\)/.test(css));
	ok('...on a label', /\.lpn-lbl\.lpn-hover:not\(\.lpn-selected\)/.test(css));
	ok('...on a customer/meter', /\.lpn-meter\.lpn-hover:not\(\.lpn-selected\)/.test(css));
}

// ---- 6. no label pass, ever, from a pointermove -------------------------------------------------
{
	console.log('\n--- no label pass from hover ---');
	const n = build();
	const before = L.labelPasses();
	move(hit({ node: n.a }), 10, 10);
	move(hit({ link: n.ab }), 30, 5);
	move(hit({ lbl: n.t }), 15, 35);
	move(EMPTY, 400, 400);
	leave();
	ok('none of those moves ran a label pass', L.labelPasses() === before, 'before ' + before + ' after ' + L.labelPasses());
}

// ---- 7. structural: one rAF-throttled listener, doing no work while a gesture is in progress ---
{
	console.log('\n--- structural: throttled, and quiet during a drag ---');
	ok('the pointermove listener is rAF-throttled',
		/hoverPreviewRaf = requestAnimationFrame/.test(src));
	ok("...and reads `drag` before doing anything, so it is silent while panning/zooming/dragging",
		/mode !== 'select' \|\| drag\) \{ return; \}[\s\S]{0,200}hoverPreviewAt = /.test(src));
}

console.log(fails ? '\n' + fails + ' FAILURES' : '\nall selection preview assertions passed');
process.exit(fails ? 1 : 0);
