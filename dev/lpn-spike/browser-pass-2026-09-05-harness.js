// **TOM'S BROWSER PASS OF 2026-09-05, THE THREE FINDINGS THAT WERE DEFECTS.** Run with:
//
//   node dev/lpn-spike/browser-pass-2026-09-05-harness.js
//
// He tested the day's EPANET work and found five things. Two were wording and are fixed in the
// strings; the three here are behaviour, and each one is the kind a harness can hold for good:
//
//   1. **THE LIBRARIES BOX DID NOT FOLLOW A PROJECT SWITCH.** *"the Libraries don't automatically
//      update on switching projects. I have to change tabs."* Its patterns, curves, controls and
//      rules are all document data, so a box left open across a switch was showing the OUTGOING
//      project's library over the incoming project's map. Changing its section tab happened to
//      rebuild it, which is why it read as a refresh problem rather than a stale-document one.
//      **The danger was never the display**: editing a row in that stale box writes into the
//      project now on screen.
//   2. **A SPACE IN A TAG WAS DROPPED ON BLUR, NOT AS TYPED.** *"Tip says everything is dropped as
//      I type. But it's dropped only when I leave the field. Why not as I type?"* The tip described
//      behaviour the field did not have. Trimming on `change` lets somebody type a sentence, look
//      at it, tab away and watch most of it vanish -- the rule applied at the moment it can no
//      longer be seen.
//   3. **THE TWO SWITCHES WERE LAST UNDER Hydraulics.** *"Move 'Solve with EPANET solver' (2nd) and
//      'Recalculate automatically' (1st) to the top of the Hydraulics heading"*. They decide WHETHER
//      and WITH WHAT the network is solved; every row above them was a detail of a solve those two
//      had already settled. Build order, not reading order.

'use strict';

const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');
require(ROOT + 'js/lpn-epanet.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, setDoc: function (d) { doc = d; },\n" +
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\trefreshAll: refreshAllFromDocument, rebuildLibrary: rebuildLibraryBox,\n" +
	"\t\trebuildSettings: rebuildSettingsBox, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tsetLibSection: function (s) { libSection = s; },\n" +
	"\t\tpopupNode: function (id) { renderNodeFields(id); return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tnodeById: nodeById, addNode: addNode,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
const EngCalcs = global.EngCalcs;
L.buildLayers();
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name + (extra === undefined ? '' : '   ' + extra)); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function head(t) { console.log('\n' + t); }
function textOf(node) {
	let out = (node && node.textContent) || '';
	((node && node.children) || []).forEach(c => { out += ' ' + textOf(c); });
	return out;
}
// Walks for an <input> under a container: the stub's querySelectorAll() returns [] for everything,
// and teaching it a selector engine to satisfy an assertion is the stub-that-removes-the-coupling
// trap dev/testing-notes.md warns about.
// The stub's elements carry `_listeners` rather than a real event system, which is the seam every
// harness here fires through -- see find-harness.js's own `fire()`.
function fire(el, type) { ((el && el._listeners && el._listeners[type]) || []).forEach(f => f({})); }
function inputsUnder(node, out) {
	((node && node.children) || []).forEach(c => {
		if (String(c.tagName || '').toLowerCase() === 'input') { out.push(c); }
		inputsUnder(c, out);
	});
	return out;
}

(function () {
	// =====================================================================================
	head('1. THE LIBRARIES BOX FOLLOWS THE DOCUMENT (Tom: "I have to change tabs")');
	// =====================================================================================
	// **THE ASSERTION IS THAT refreshAllFromDocument() REBUILDS IT**, because that is the one
	// function every door into a different document goes through -- openProject(), newProject(),
	// an import and a file open all end in it. Asserting on openProject() alone would leave three
	// of the four doors uncovered, and it is a project SWITCH that Tom hit.
	const content = document.getElementById('lpn_libbox_content');
	ok('the stub has the Libraries content pane, or the rest of this section is vacuous', !!content);

	L.setLibSection('patterns');
	const docA = { nodes: [], links: [], labels: [], origin: { x: 0, y: 0 },
		patterns: [{ id: 'PAT-FROM-A', multipliers: [1, 1] }] };
	L.setDoc(docA);
	L.rebuildLibrary();
	// The pattern's id lives in an INPUT (it is renameable), so it is read off the values rather
	// than out of textContent -- which is also why the stale box was invisible to a text scan.
	function boxIds() { return inputsUnder(content, []).map(i => i.value).join('|'); }
	const shownA = boxIds();
	ok('project A\'s pattern is in the box', /PAT-FROM-A/.test(shownA), shownA.slice(0, 90));

	// The switch itself: a different document, and refreshAllFromDocument() is all that runs.
	// Before the fix this left PAT-FROM-A on screen over project B's map.
	const docB = { nodes: [], links: [], labels: [], origin: { x: 0, y: 0 },
		patterns: [{ id: 'PAT-FROM-B', multipliers: [2, 2] }] };
	L.setDoc(docB);
	L.refreshAll();
	const shownB = boxIds();
	ok('after the switch the box shows project B\'s pattern', /PAT-FROM-B/.test(shownB), shownB.slice(0, 90));
	ok('and project A\'s is gone, which is the half that was the hazard',
		!/PAT-FROM-A/.test(shownB), shownB.slice(0, 140));

	// =====================================================================================
	head('2. A SPACE IN A TAG IS REFUSED AS IT IS TYPED');
	// =====================================================================================
	const n = L.addNode('junction', 10, 10);
	const popup = L.popupNode(n.id);
	// The Tag row is the only text input on a junction popup that starts empty and is not a number,
	// so it is found by its VALUE being the element's own tag rather than by position -- position
	// would break the moment a row is added above it, which is exactly what happened this week.
	n.tag = 'SEED-1';
	L.popupNode(n.id);
	const tagInput = inputsUnder(document.getElementById('lpn_popup_fields'), [])
		.filter(i => i.value === 'SEED-1')[0];
	ok('the Tag row is on the popup and holds the element\'s tag', !!tagInput);
	if (tagInput) {
		// **THE DISCRIMINATING TEST: `input`, NOT `change`.** Firing only `input` is what a person
		// typing does, and before the fix nothing happened until focus left the field.
		tagInput.value = 'MAIN 1962 south';
		fire(tagInput, 'input');
		ok('the field itself keeps only the first word, without waiting for blur',
			tagInput.value === 'MAIN', tagInput.value);
		ok('and the document has it too', n.tag === 'MAIN', String(n.tag));

		tagInput.value = 'HYD-88';
		fire(tagInput, 'input');
		ok('a tag with no space is left exactly alone', tagInput.value === 'HYD-88' && n.tag === 'HYD-88',
			tagInput.value + '|' + n.tag);

		// Clearing it removes the property rather than storing an empty string: an empty tag writes
		// no [TAGS] row, and `''` and absent must not be two ways of saying the same thing.
		tagInput.value = '';
		fire(tagInput, 'input');
		ok('clearing the box deletes the tag rather than storing an empty one',
			n.tag === undefined && !('tag' in n), JSON.stringify(n.tag));
	}

	// =====================================================================================
	head('3. THE TWO SWITCHES COME FIRST UNDER Hydraulics');
	// =====================================================================================
	L.rebuildSettings();
	const comp = document.getElementById('lpn_set_hydraulics_fields');
	ok('the stub has the Hydraulics field host, or this section is vacuous', !!comp);
	const compText = textOf(comp);
	const iAuto = compText.indexOf('Recalculate automatically');
	const iEng = compText.indexOf('Solve with the EPANET solver');
	const iAcc = compText.indexOf('Accuracy');
	ok('all three rows are in the Calculation pane', iAuto >= 0 && iEng >= 0 && iAcc >= 0,
		[iAuto, iEng, iAcc].join('|'));
	// **ORDER, NOT POSITION.** Asserting an index would break the next time a row is added; what
	// Tom asked for is a relationship between three rows and that is what is held.
	ok('Recalculate automatically comes first, as Tom ordered them', iAuto < iEng, iAuto + ' < ' + iEng);
	ok('then Solve with the EPANET solver', iEng < iAcc, iEng + ' < ' + iAcc);
	ok('and both are above every numeric row, Accuracy included', iAuto < iAcc);

	console.log('\n' + (fails ? fails + ' FAILURE(S)' : 'All checks passed.'));
	process.exit(fails ? 1 : 0);
}());
