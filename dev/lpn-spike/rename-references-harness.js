// RENAMING AN ELEMENT CHASES EVERY REFERENCE TO IT -- ROADMAP Task 533. Run with:
//   node dev/lpn-spike/rename-references-harness.js
//
// **THE REPRODUCTION IS TWO GESTURES: rename a link, then drag one of its nodes.** `incidentLinks`
// is keyed by NODE and holds LINK ids, so a link rename does not rekey it -- it has to rewrite the
// ids inside two of its arrays, and applyLinkRename() did not. The index kept the old id,
// updateNode() walks that list into `linkEls`, and the drag throws on an entry that is not there.
// Found 2026-08-25 by the Task 502 agent and left unfixed on purpose, as outside that track's
// territory; `text-link-anchor-harness.js` still carries the note saying where it declined to
// assert it.
//
// **AND THE TASK ASKED FOR THE OTHERS, WHICH IS WHERE THE WORSE ONE WAS.** A CONTROL names its link
// and may name a node, and it holds each of them TWICE -- in the parsed record and in `raw`, the
// sentence the file stated. `raw` is what the exporter writes. So a link rename that missed it
// produced an `.inp` naming a link the file does not declare, **which EPANET rejects outright**:
// a corrupt export is a worse failure than a throw the user can undo. Saved paths (`doc.profiles`)
// name nodes the same way.
//
// The four indexes that were ALREADY right are asserted here too, and that is not padding: they
// are what makes the missing one a gap rather than a design, and a later refactor that unifies
// them must keep all five.

'use strict';

const { ROOT, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, addLink: addLink, addText: addText, buildDom: buildDom,\n" +
	"\t\tlabelById: labelById, linkById: linkById, nodeById: nodeById,\n" +
	"\t\tapplyLinkRename: applyLinkRename, applyNodeRename: applyNodeRename,\n" +
	"\t\tserializeProject: serializeProject,\n" +
	"\t\tincident: function (id) { return (incidentLinks[id] || []).slice(); },\n" +
	"\t\thasLinkEl: function (id) { return !!linkEls[id]; },\n" +
	"\t\tmoveNode: function (id, x, y) { var n = nodeById(id); n.x = x; n.y = y; updateNode(id); },\n" +
	"\t\texport: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
// Section 2 exports, and lpnExportInp() refuses ("detail: length") when the project's unit
// selections are empty -- it cannot know what a length means. Nothing to do with a rename.
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// A reservoir, two junctions, two pipes, a control naming both a link and a node, and a saved path
// through every node. Everything a rename has to chase.
//
// **THE IDS ARE READ BACK, NEVER ASSUMED.** addNode() and addLink() MINT their own ids from
// `nextId` and the prefix settings; they take no id argument. A fixture that named them itself
// happened to be right for the first network built in a process and wrong for the second, because
// `nextId` had moved on -- so the assertions below all speak in terms of what was actually made.
let R1, J1, J2, L1, L2;
function build() {
	L.seedDefaultInputs();
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
	doc.controls = []; doc.profiles = [];
	L.buildDom();
	L.buildLayers();
	R1 = L.addNode('reservoir', 0, 0).id;
	J1 = L.addNode('junction', 100, 0).id;
	J2 = L.addNode('junction', 200, 0).id;
	// The exporter refuses a pipe with no length ("detail: length"), and the stub's geometry does
	// not fill lenAuto. Section 2 exports, so both pipes are given one here -- a fixture gap, and
	// nothing to do with what is being asserted.
	const p1 = L.addLink('pipe', R1, J1), p2 = L.addLink('pipe', J1, J2);
	p1._length = 100; p2._length = 100;
	L1 = p1.id;
	L2 = p2.id;
	doc.controls.push({
		link: L1, action: { status: 'CLOSED' },
		condition: { kind: 'node', node: J2, cmp: 'above', value: 30 },
		raw: 'LINK ' + L1 + ' CLOSED IF NODE ' + J2 + ' ABOVE 30', text: {}
	});
	doc.profiles.push({ id: 'p1', name: 'Main line', stops: [R1, J1, J2] });
	return doc;
}

// ---------------------------------------------------------------------------
// 1. A link rename, and then the drag that used to throw.
// ---------------------------------------------------------------------------
console.log('\n--- rename a link, then drag one of its nodes ---');
{
	const doc = build();
	L.applyLinkRename(L1, 'MAIN-A');
	ok('the link itself carries the new id', !!L.linkById('MAIN-A') && !L.linkById(L1));
	// BOTH ENDS. `from` and `to` each hold the link in their own list, so a fix that walked one of
	// them would pass a one-ended test and leave the drag broken from the other node.
	ok('the FROM node\'s incident list names the new id', L.incident(R1).indexOf('MAIN-A') >= 0,
		JSON.stringify(L.incident(R1)));
	ok('the TO node\'s incident list names it too', L.incident(J1).indexOf('MAIN-A') >= 0,
		JSON.stringify(L.incident(J1)));
	ok('...and neither still holds the old one',
		L.incident(R1).indexOf(L1) < 0 && L.incident(J1).indexOf(L1) < 0);
	// **THE REPRODUCTION, RUN.** updateNode() walks incidentLinks into linkEls; before the fix this
	// threw on `linkEls['L1']`, which no longer exists.
	let threw = null;
	try { L.moveNode(J1, 120, 40); } catch (e) { threw = e; }
	ok('dragging a node of the renamed link no longer throws', threw === null, threw && threw.message);
	ok('...and the link element it walked to is the renamed one', L.hasLinkEl('MAIN-A') && !L.hasLinkEl(L1));
}

// ---------------------------------------------------------------------------
// 2. The control follows, in the record AND in the sentence.
// ---------------------------------------------------------------------------
console.log('\n--- a control names a link, twice ---');
{
	const doc = build();
	L.applyLinkRename(L1, 'MAIN-A');
	ok('the control record names the renamed link', doc.controls[0].link === 'MAIN-A',
		doc.controls[0].link);
	// **`raw` IS WHAT THE EXPORTER WRITES**, so the record alone is not enough.
	ok('...and so does its sentence', doc.controls[0].raw === 'LINK MAIN-A CLOSED IF NODE ' + J2 + ' ABOVE 30',
		JSON.stringify(doc.controls[0].raw));
	// The rest of the sentence is untouched: it is the user's own text, and only one token moved.
	ok('...with every other token of the user\'s sentence untouched',
		doc.controls[0].raw.replace('MAIN-A', L1) === 'LINK ' + L1 + ' CLOSED IF NODE ' + J2 + ' ABOVE 30');
	// **AND THE EXPORTED FILE IS ONE EPANET WOULD ACCEPT.** This is the assertion that says why the
	// control half of this task mattered more than the throw: a [CONTROLS] line naming a link the
	// [PIPES] section does not declare makes EPANET refuse the whole file.
	const inp = L.export();
	ok('the exported file declares the link its control names',
		inp.ok && /^\s*MAIN-A\b/m.test(inp.inp.split(/^\[PIPES\]/m)[1] || '') &&
			/LINK\s+MAIN-A\b/.test(inp.inp), inp.ok);
	ok('...and names the old id nowhere at all', inp.ok && !new RegExp('\\b' + L1 + '\\b').test(inp.inp));
}

// ---------------------------------------------------------------------------
// 3. A node rename: the control's condition, and every saved path.
// ---------------------------------------------------------------------------
console.log('\n--- a node rename reaches the condition and the saved paths ---');
{
	const doc = build();
	L.applyNodeRename(J2, 'TANK-FEED');
	ok('the control condition names the renamed node',
		doc.controls[0].condition.node === 'TANK-FEED', doc.controls[0].condition.node);
	ok('...and its sentence does too',
		doc.controls[0].raw === 'LINK ' + L1 + ' CLOSED IF NODE TANK-FEED ABOVE 30',
		JSON.stringify(doc.controls[0].raw));
	// A saved path is the stops the USER chose, kept verbatim -- which is the rule for an id their
	// file states, and not a reason to ignore one we have just changed ourselves.
	ok('every saved path that stops there follows the rename',
		doc.profiles[0].stops.join(',') === [R1, J1, 'TANK-FEED'].join(','), doc.profiles[0].stops.join(','));
	// The four that were already right, asserted so a later unification cannot quietly drop one.
	ok('the links at that node still point at it',
		L.linkById(L2).to === 'TANK-FEED', L.linkById(L2).to);
	ok('...and its incident list moved with it', L.incident('TANK-FEED').indexOf(L2) >= 0,
		JSON.stringify(L.incident('TANK-FEED')));
	ok('...and nothing is left under the old key', L.incident(J2).length === 0);
	let threw = null;
	try { L.moveNode('TANK-FEED', 220, 10); } catch (e) { threw = e; }
	ok('...and the renamed node drags', threw === null, threw && threw.message);
}

// ---------------------------------------------------------------------------
// 4. A rename that matches nothing changes nothing.
// ---------------------------------------------------------------------------
console.log('\n--- and a rename touches only what it names ---');
{
	const doc = build();
	const before = JSON.stringify(doc.controls);
	// L2 is not the link this control names, so the control must come through untouched -- token
	// replacement that matched on position instead of on value would rewrite it anyway.
	L.applyLinkRename(L2, 'BRANCH');
	ok('a control naming a DIFFERENT link is left alone', JSON.stringify(doc.controls) === before,
		JSON.stringify(doc.controls[0].raw));
	L.applyNodeRename(J1, 'MID');
	ok('...and so is a condition naming a different node',
		doc.controls[0].condition.node === J2 &&
		doc.controls[0].raw === 'LINK ' + L1 + ' CLOSED IF NODE ' + J2 + ' ABOVE 30',
		JSON.stringify(doc.controls[0].raw));
	// But the saved path DOES contain J1, so it must have moved.
	ok('...while the saved path that did stop there followed it',
		doc.profiles[0].stops.join(',') === [R1, 'MID', J2].join(','), doc.profiles[0].stops.join(','));
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
