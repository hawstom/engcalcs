// What is ON the toolbar, and what a tap that lands on an existing node does. Run with:
//   node dev/lpn-spike/toolbar-harness.js
//
// TWO CHANGES FROM ONE MESSAGE (Tom, 2026-08-15), and they are both about the same thing: the most
// expensive space on the page should hold what a person does OFTEN, and a control should never
// answer a tap with silence.
//
//   * "Let's remove New project and Background image from the toolbar and add Save and (since our
//     paradigm often makes it the only choice) Save as…" New project is once per project and a
//     background image is once per project AT MOST -- most networks never get one. Saving is every
//     few minutes, forever. Both removed commands are still in the menus.
//
//   * "If they click very near to the same location they just added something, it puts them in
//     Select/edit mode and opens that element. This will remove a major 'fat finger' issue." The
//     old behaviour was worse than he knew: the add branch already refused to place a node on top
//     of an existing one, and then did nothing at all -- no node, no popup, no way to tell a
//     suppressed duplicate from a click the page missed.
//
// THE ONE THING THAT COULD BREAK QUIETLY, and the reason this file exists rather than a pair of
// eyeballs: the toolbar's Background image button was built by wireBackdropMenu(), which ALSO
// attached the change handler to the file input. Deleting the button by deleting the call would
// leave Insert > Background image opening a file dialog that nothing listens to -- a picker that
// silently does nothing, which is exactly the failure mode the second change exists to remove.

const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '../../js/looped-network.js'), 'utf8');
const code = src.replace(/^[ \t]*\/\/.*$/gm, '');   // comments explain what is NOT done; ignore them

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tnearest: nearestNodeNearScreen, nearestLabel: nearestLabelNearScreen,\n" +
	"\t\tsnapPx: function () { return NODE_SNAP_PX; }, addText: addText,\n" +
	"\t\tsetZoom: function (s) { state.s = s; },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h;\n" +
	"\t\t\tsvg.getBoundingClientRect = function () { return { left: 0, top: 0, right: w, bottom: h, width: w, height: h }; }; },\n" +
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
function fn(name) {
	const at = code.indexOf('function ' + name);
	if (at < 0) { throw new Error('not found: ' + name); }
	let i = code.indexOf('{', at), depth = 0, end = i;
	for (; end < code.length; end++) {
		if (code[end] === '{') { depth++; }
		else if (code[end] === '}') { depth--; if (depth === 0) { end++; break; } }
	}
	return code.slice(at, end);
}

console.log('--- the toolbar holds the commands you use every few minutes ---');
{
	const bar = fn('wireToolbar');
	ok('Save is on the toolbar', /lpn_file_save \|\|/.test(bar) && /saveCurrent\(\)/.test(bar));
	// Save As earns its own slot rather than hiding behind Save, because on this page it is often
	// the ONLY thing Save can mean: a browser project has no file yet, and a read-only project
	// cannot write back to the one it came from.
	ok('...and so is Save as, which is frequently the only one that can work',
		/lpn_file_saveas \|\|/.test(bar) && /saveAs\(\)/.test(bar));
	ok('New project has left the toolbar', !/lpn_file_new/.test(bar));
	ok('...and so has Background image', !/lpn_backdrop_menu/.test(bar));
	// Both are still reachable. A command that leaves the toolbar must not leave the app.
	ok('New project is still in the File menu', /lpn_file_new/.test(fn('openFileMenu')));
	ok('...and Background image is still in Insert', /backdropRows\(/.test(fn('openInsertMenu')));
}

console.log('\n--- the background picker is still listening, button or no button ---');
{
	const bar = fn('wireToolbar');
	ok('the toolbar still calls wireBackdropMenu, with no container to put a button in',
		/wireBackdropMenu\(\)/.test(bar), 'this is the line that keeps the file input alive');
	const w = fn('wireBackdropMenu');
	ok('...and wireBackdropMenu tolerates that', /if \(into\) \{ into\.appendChild/.test(w));
	ok('...while still wiring the picker unconditionally',
		/getElementById\('lpn_backdrop_file'\)/.test(w) && /addEventListener\('change'/.test(w));
}

console.log('\n--- a tap that lands on a node opens it instead of doing nothing ---');
{
	setUnitSet('us');
	L.buildLayers();
	L.seedDefaultInputs();
	L.setCanvas(1000, 600);
	L.setZoom(1);
	const n = L.addNode('junction', 100, 100);
	const snap = L.snapPx();
	// The geometry the rule turns on: within the snap radius in SCREEN pixels, not world units.
	ok('a node is found under a tap on top of it', L.nearest(100, 100, snap) === n);
	ok('...and under a click a few pixels off, which is the miss being caught', !!L.nearest(100 + snap - 2, 100, snap));
	ok('...but not one well clear of it', !L.nearest(100 + snap + 6, 100, snap));
	// Screen pixels, so zooming OUT widens the world-space catch and zooming in narrows it. That is
	// the right behaviour for POINTER SLOP, which is a property of the hand and the mouse and does
	// not change with the zoom. (Not "finger-sized": this app is a desktop map editor. Tom,
	// 2026-08-15: "Don't forget to keep telling yourself 'A phone is almost impossible for this
	// app.'" A touch target would be 44px, which here would swallow every neighbouring node.)
	L.setZoom(4);
	ok('the catch is a screen distance, so it shrinks in world units as you zoom in',
		!L.nearest(100 * 4 + snap + 6, 100 * 4, snap) && !!L.nearest(100 * 4 + 2, 100 * 4, snap));
	L.setZoom(1);

	// And the response. Asserted from the source because the branch lives inside a pointerup
	// handler that needs real pointer events -- but what it does is three statements, and the one
	// that must never come back is the empty `if`.
	const up = code.slice(code.indexOf("if (mode === 'add-junction'"));
	const branch = up.slice(0, up.indexOf('else if (mode ==='));
	ok('the add branch opens the node it landed on', /openPopup\(onNode\.id/.test(branch), branch.slice(0, 200));
	ok('...and switches to Select, which is what makes it an edit rather than a peek',
		/setMode\('select'\)/.test(branch));
	ok('...and does NOT also add a node', /else \{[\s\S]*addNode\(/.test(branch));
	// THE REGRESSION TO GUARD: the old code was `if (!nearestNodeNearScreen(...)) { add }` with no
	// else -- a tap on a node fell through to nothing. Any future edit that drops the else branch
	// brings the silence back.
	ok('...and the silent no-op is gone: the on-node case has a body',
		!/if \(!nearestNodeNearScreen\([^)]*\)\) \{/.test(branch));
}

console.log('\n--- ...and the Text tool no longer stacks a second label on the first ---');
{
	// TOM NAMED THIS ONE FROM THE OUTSIDE, having only been told what the node tools did: "Actually
	// I think it's schizophrenic. Maybe no-op for the elements and double-insert for the text? That
	// would explain my experience." Exactly right -- add-text had no guard at all, so a tap on the
	// Text you had just placed made a SECOND one directly on top of it. Two tools, two different
	// wrong answers to one gesture.
	const t = L.addText(300, 200, null);
	const snap = L.snapPx();
	ok('a Text label is found under a tap on top of it', L.nearestLabel(300, 200, snap) === t);
	ok('...and under a tap a few pixels off', !!L.nearestLabel(300 + snap - 2, 200, snap));
	ok('...but not one well clear of it', !L.nearestLabel(300 + snap + 6, 200, snap));
	const up = code.slice(code.indexOf("else if (mode === 'add-text')"));
	const branch = up.slice(0, up.indexOf('\n\t\t\telse if') > 0 ? up.indexOf('\n\t\t\telse if') : 1200);
	ok('the Text branch opens the label it landed on', /openLabelPopup\(onLabel\.id/.test(branch));
	ok('...switches to Select, like the node tools', /setMode\('select'\)/.test(branch));
	ok('...and RETURNS, so it cannot also place one', /return;/.test(branch.slice(0, branch.indexOf('addText('))));
	// The node snap in this branch is a different thing and must survive: a tap near a NODE anchors
	// the new Text to it, which is what gives it a leader.
	ok('...while a tap near a NODE still anchors a new Text to it, which is not the same rule',
		/nearestNodeNearScreen\(e\.clientX/.test(branch) && /addText\(w\.x, w\.y, nearNode/.test(branch));
}

console.log('\n--- ...and a stray jiggle no longer freezes a label where the pass put it ---');
{
	// THE SAME FAMILY AS THE FAT-FINGER RULE ABOVE: an input the user did not mean to give, answered
	// as though they had. The first pixel of movement used to make a label manual for good, storing
	// the base PLUS the collision nudge -- so a wobble froze the label at wherever the automatic
	// pass had put it, and handed the pass one more immovable weight-1000 obstacle. Tom, 2026-08-15:
	// "I accidentally dragged it? To there? OK... What a wild goose chase."
	//
	// Asserted from the source: applyDrag() runs off real pointer events, but the guard is three
	// statements and their SHAPE is what matters -- an early return before anything is written.
	const d = fn('applyDrag');
	ok('a label drag is gated on a movement threshold',
		/LABEL_DRAG_TYPES\[drag\.type\] && !drag\.committed/.test(d));
	ok('...which RETURNS rather than merely noting it, so nothing is stored below',
		/< LABEL_DRAG_SLOP_PX\) \{ return; \}/.test(d));
	ok('...and latches, so a drag that has started is never re-tested mid-gesture',
		/drag\.committed = true;/.test(d));
	// The gate must sit ABOVE every branch that writes, or it guards nothing. The pan branch is the
	// first of them and is the marker for "top of the dispatch".
	ok('...and it is above the first branch that writes anything',
		d.indexOf('LABEL_DRAG_TYPES') < d.indexOf("drag.type === 'pan'"));
	// THE THREE LABEL TYPES AND ONLY THOSE. A node or vertex drag moves a thing that is already
	// where the user put it -- there is nothing to freeze -- and adding slop there would make the
	// map feel sticky for no gain.
	ok('the three label drags are gated',
		/LABEL_DRAG_TYPES = \{ label: true, nodelbl: true, linklbl: true \}/.test(code));
	ok('...at pointer slop, not a touch target', /LABEL_DRAG_SLOP_PX = 3\b/.test(code));
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
