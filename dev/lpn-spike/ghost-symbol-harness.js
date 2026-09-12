// **A PUMP SYMBOL OUTLIVING ITS DOCUMENT** (Tom, 2026-09-12).
//
//   node dev/lpn-spike/ghost-symbol-harness.js
//
// His report, which is the whole specification: *"I drew two junctions and a pump on a blank
// Project1 map. Then I closed the project without saving. The pump symbol remained. I can drag it
// around. I can't edit it or delete it even if I Delete the network."*
//
// THE MECHANISM. A pump and a valve draw their volute into `linkSymbolLayer`, a fourth layer that
// exists so the symbol paints over every pipe it crosses and so a press reaches what the reader
// can see. buildDom() emptied `linksLayer`, `nodesLayer` and `labelsLayer` and not that one, and
// buildDom() is what runs on every wholesale rebuild -- closing a project, opening one, Delete
// network. So the symbol survived the document.
//
// WHY IT LOOKED LIKE A BROKEN PAGE RATHER THAN A SMUDGE: the orphan keeps its grab silhouette, so
// it still answers the pointer, and its `data-link` names an id no document holds, so every edit
// and every delete finds nothing. Draggable and uneditable at once.
//
// The per-link path was never at fault -- removeLinkEls() takes the symbol with it -- and section
// 3 holds that, because a fix that emptied the layer and broke the ordinary delete would pass
// sections 1 and 2.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const stub = require('./lpn-dom-stub.js');

let checks = 0, failures = 0;
function check(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log((ok ? '  ok   ' : '  FAIL ') + label + (detail ? '   ' + detail : ''));
}

stub.setUnitSet('us');
global.fetch = () => Promise.reject(new Error('no network in this harness'));
global.EngCalcs.setIconLabel = () => {};
global.window.history = { replaceState: () => {} };
global.requestAnimationFrame = global.window.requestAnimationFrame = () => 0;

const canvas = stub.byId.lpn_canvas;
Object.defineProperty(canvas, 'clientWidth', { get() { return 1200; } });
Object.defineProperty(canvas, 'clientHeight', { get() { return 600; } });
canvas.getBoundingClientRect = function () {
	return { left: 0, top: 0, right: 1200, bottom: 600, width: 1200, height: 600 };
};

// **THE REAL LAYER STACK, BUILT THE WAY init() BUILDS IT.** A harness that hand-rolls its layers
// has no linkSymbolLayer at all, so buildLinkEls() falls back to nodesLayer -- which IS emptied,
// and the bug becomes invisible. That is the stub-removes-the-coupling trap in dev/testing-notes.md,
// and this harness exists precisely because of the layer it must therefore create.
const L = stub.loadLoopedNetwork(
	"\t\tapplySaved: applySaved, refreshAllFromDocument: refreshAllFromDocument,\n" +
	"\t\tbuildDom: buildDom, removeLinkEls: removeLinkEls,\n" +
	"\t\tnoteMapSized: noteMapSized,\n" +
	"\t\tgetDoc: function () { return doc; },\n" +
	// DIRECT CHILDREN ONLY. One symbolG holds a whole drawing, and several of its descendants
	// carry a class starting `lpn-link-symbol` too, so a recursive scan counts three per pump and
	// the assertions all read as off-by-a-factor rather than as the leak under test.
	"\t\tsymbolCount: function () { return (linkSymbolLayer.children || []).length; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg); modelLayer = el('g', {}, world);\n" +
	"\t\t\tbackdropLayer = el('g', {}, modelLayer); gridLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlinkSymbolLayer = el('g', { 'class': 'lpn-symbols' }, modelLayer);\n" +
	"\t\t\tnodesLayer = el('g', {}, modelLayer); labelsLayer = el('g', {}, modelLayer);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
if (L.noteMapSized) { L.noteMapSized(); }

// `verts: []` and the leading-underscore fields are not decoration: a link with no `verts` throws
// inside linkPoints() before any of this is reached, and those are the shapes serializeProject()
// writes. Copied from the fixture in curve-library-harness.js rather than invented.
function pump(id, from, to) {
	return { id: id, type: 'pump', from: from, to: to, verts: [],
		_diameter: 8, _roughness: 130, _length: 0, _k: 0, _status: 'open' };
}
function project(withPump) {
	return {
		v: 10, format: 'lpn', project: { name: 'Project1', coords: 'xy', activeScenario: 'base' },
		scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
		origin: { x: 0, y: 0 },
		nodes: [
			{ id: 'J1', type: 'junction', x: 0, y: 0, elev: 100, _demand: 0 },
			{ id: 'J2', type: 'junction', x: 100, y: 0, elev: 100, _demand: 0 }
		],
		links: withPump ? [pump('P1', 'J1', 'J2')] : [],
		labels: [], settings: {}, view: null
	};
}

// ---- 1. TOM'S GESTURE, EXACTLY ----------------------------------------------------------------
console.log("--- 1. two junctions and a pump, then the project is closed without saving ---");
{
	L.applySaved(JSON.parse(JSON.stringify(project(true))));
	L.refreshAllFromDocument();
	check(L.symbolCount() === 1, 'the pump draws one symbol', String(L.symbolCount()));

	// Closing without saving lands on a blank project: the same wholesale rebuild, with an empty
	// document. This is the exact moment the ghost was born.
	L.applySaved(JSON.parse(JSON.stringify(project(false))));
	L.refreshAllFromDocument();
	check(L.symbolCount() === 0,
		'THE SYMBOL GOES WITH THE DOCUMENT: nothing is left in the symbol layer',
		String(L.symbolCount()) + ' left');
	check((L.getDoc().links || []).length === 0, '...and the document really is empty');
}

// ---- 2. AND ON EVERY OTHER WHOLESALE REBUILD ---------------------------------------------------
// Close, open and Delete network all arrive at buildDom(). One of them passing is not the claim.
console.log('--- 2. opening another project does not inherit the last one\'s symbols ---');
{
	L.applySaved(JSON.parse(JSON.stringify(project(true))));
	L.refreshAllFromDocument();
	L.applySaved(JSON.parse(JSON.stringify(project(true))));
	L.refreshAllFromDocument();
	check(L.symbolCount() === 1,
		'a second project with one pump still shows exactly one symbol, not two',
		String(L.symbolCount()));

	// Delete network: the document is emptied in place and redrawn.
	var d = L.getDoc();
	d.nodes.length = 0; d.links.length = 0;
	L.buildDom();
	check(L.symbolCount() === 0, 'Delete network leaves no symbol behind', String(L.symbolCount()));
}

// ---- 3. THE ORDINARY DELETE STILL WORKS --------------------------------------------------------
// A fix that emptied the layer wholesale and broke removeLinkEls() would pass both sections above.
console.log('--- 3. deleting one pump of two removes that one and only that one ---');
{
	var two = project(true);
	two.nodes.push({ id: 'J3', type: 'junction', x: 200, y: 0, elev: 100, _demand: 0 });
	two.links.push(pump('P2', 'J2', 'J3'));
	L.applySaved(JSON.parse(JSON.stringify(two)));
	L.refreshAllFromDocument();
	check(L.symbolCount() === 2, 'two pumps draw two symbols', String(L.symbolCount()));
	L.removeLinkEls('P1');
	check(L.symbolCount() === 1, 'removing one link removes exactly one symbol',
		String(L.symbolCount()));
}

console.log('\n' + (failures ? 'FAIL ' : 'ok   ') + (checks - failures) + '/' + checks + ' checks');
process.exit(failures ? 1 : 0);
