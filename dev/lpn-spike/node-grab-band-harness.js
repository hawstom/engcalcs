// THE POINTER CURSOR, AND THE NODE'S OWN GRAB BAND. Run with:
//   node dev/lpn-spike/node-grab-band-harness.js
//
// Tom, 2026-09-08, after two rounds of cursor work: *"The mouse is very unreliable to the point of
// rarely changing to an arrow and usually as a flicker, and I don't know why. Is my browser
// overloaded?"* and *"I get no help from the mouse pointer. It's just a pan cross the entire
// time."*
//
// **WHAT THIS FILE CANNOT SEE, SAID FIRST.** There is no CSS engine here and `getComputedStyle()`
// on the stub returns nothing, so THE RESOLVED CURSOR IS UNREACHABLE HEADLESSLY. Nothing below
// asserts what the browser would paint. What is asserted instead is the MECHANISM: which element
// answers a hit test, which class is on the canvas when, that no handler writes `style.cursor`
// outside the one seam that is allowed to, and that the stylesheet gives the band a cursor of its
// own. The resolved value is measured in a real Chromium by
// dev/browser-pass/specs/cursorflicker.js.
//
// **AND THERE WAS NO RACE TO FIND, WHICH IS THE FINDING.** Measured in Chromium on the example
// network, 23,821 sample points over a 1398 x 798 canvas, each resolved through
// `elementFromPoint()` and `getComputedStyle()`:
//
//     grab      90.3%     the bare map and the backdrop image, both correct
//     move       6.5%     .lpn-draglbl -- every draggable label, in the TOPMOST layer
//     pointer    3.2%     of which .lpn-node is 0.2%
//
// A MutationObserver over the whole <svg> recorded ZERO mutations across a sixty-step wander and
// ZERO across three stationary seconds on an object, so nothing was replacing the element under the
// pointer and nothing was re-adding a class. The fight is AREA. `move` is the four-headed arrow Tom
// himself named the "pan/drag cross" in Task 569, the labels wearing it cover twice the ground of
// everything saying `pointer` put together, and they sit exactly where a pointer approaches a node
// from -- so the sweep reads grab, move, one frame of pointer on a 7 px disc, move, grab. That
// frame is the flicker.
//
//
// **AFTER THE BAND, re-measured the same way: node `pointer` 0.2% -> 0.8%, total `pointer` 3.2% ->
// 3.5%, and a junction's target 10 px across -> 22 px.** Modest, and honestly so: 90% of that map
// is bare ground and an aerial, where `grab` is the correct answer. **The residual, named so it is
// recognised:** `.lpn-draglbl` still claims 6.5% -- twice everything saying `pointer` -- and `move`
// is the cursor Tom named the pan/drag cross. It is the standard cursor for a draggable thing and
// was not changed on our own judgement.
// The fix is the pipe's own, applied to the node: an invisible circle carrying `cursor: pointer`
// and the node's own `data-node`, LPN_NODE_HIT_PX across, in the nodes layer above the links.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, byId, loadLoopedNetwork, setUnitSet, setHitTarget } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, buildDom: buildDom, nodeById: nodeById,\n" +
	"\t\tdeleteNode: deleteNode, applyNodeRename: applyNodeRename,\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
	"\t\tmapHitAt: mapHitAt, nodeOutranks: nodeOutranks,\n" +
	"\t\tselectFromHit: selectFromHit, selectionsNow: function () { return selections.slice(); },\n" +
	"\t\tnodeEl: function (id) { return nodeEls[id]; },\n" +
	"\t\tnodesLayer: function () { return nodesLayer; },\n" +
	"\t\tlinksLayer: function () { return linksLayer; },\n" +
	"\t\tnodeRadius: nodeRadius, nodeHitSilhouette: nodeHitSilhouette,\n" +
	"\t\trefreshSymbolSizes: refreshSymbolSizes,\n" +
	"\t\tdragNow: function () { return drag ? { type: drag.type, id: drag.id } : null; },\n" +
	"\t\tapplyDrag: function () { if (drag && dragDirty) { applyDrag(); dragDirty = false; } },\n" +
	"\t\tsetScale: function (s) { state.s = s; state.tx = 0; state.ty = 0; },\n" +
	"\t\tsetPanning: setPanning,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function note(text) { console.log('  ..   ' + text); }

function freshMap() {
	byId.lpn_toolbar.querySelectorAll = function () { return []; };
	L.seedDefaultInputs();
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
	L.buildDom();
	L.buildLayers();
	L.setScale(1);
	L.wirePointerEvents();
	L.setMode('select');
	return doc;
}
const svg = byId.lpn_canvas;
function fire(type, ev) { (svg._listeners[type] || []).forEach(function (fn) { fn(ev); }); }

// ================================================================================================
// 1. EVERY NODE CARRIES A BAND, AND IT IS THE NODE
// ================================================================================================
console.log('\n--- the band exists, and answers as its own node ---');
{
	freshMap();
	const id = L.addNode('junction', 200, 200).id;
	const ne = L.nodeEl(id);
	ok('a junction is built with a hit band beside its disc', !!ne.hit);
	ok('...classed so the stylesheet can give it a cursor',
		ne.hit.classList.contains('lpn-node-hit'));
	ok('...carrying the SAME data-node as the disc, so there is one vocabulary and not two',
		ne.hit.dataset.node === id && ne.circle.dataset.node === id, ne.hit.dataset.node);
	ok('...and it is UNDER the disc in the layer, so the drawn node still paints over it',
		Array.prototype.indexOf.call(L.nodesLayer().childNodes, ne.hit) <
		Array.prototype.indexOf.call(L.nodesLayer().childNodes, ne.circle));

	// The whole point: a press within the band resolves to the node, not to bare map.
	L.selectFromHit(ne.hit);
	const sel = L.selectionsNow();
	ok('selectFromHit() on the band selects the NODE',
		sel.length === 1 && sel[0].kind === 'node' && sel[0].id === id,
		sel.length ? sel[0].kind + ' ' + sel[0].id : 'nothing');
	// nodeOutranks() answers "would a nearby node beat this hit". The band IS a node, so the honest
	// answer is no -- and it must be the same answer the disc gets, or a finger landing on the band
	// would be promoted onto a different node than one landing on the dot.
	ok('...and nodeOutranks() gives the band the disc\'s own answer',
		L.nodeOutranks(ne.hit) === L.nodeOutranks(ne.circle) && L.nodeOutranks(ne.hit) === false,
		String(L.nodeOutranks(ne.hit)));
}

// ================================================================================================
// 2. THE BAND IS A SCREEN SIZE, AND NEVER SMALLER THAN THE SYMBOL
// ================================================================================================
console.log('\n--- the band is a constant number of screen pixels ---');
{
	freshMap();
	const id = L.addNode('junction', 200, 200).id;
	const n = L.nodeById(id), ne = L.nodeEl(id);

	// Read the constant out of the file rather than retyping it -- a harness carrying its own copy
	// of a number goes on passing after the number moves.
	const src = fs.readFileSync(path.join(ROOT, 'js/looped-network.js'), 'utf8');
	const m = src.match(/var LPN_NODE_HIT_PX = (\d+);/);
	ok('LPN_NODE_HIT_PX is declared and is read out of the file', !!m, m && m[1]);
	const HIT = m ? Number(m[1]) : 0;
	ok('...and it is the pipe band\'s own number, so the two slops cannot disagree',
		HIT === Number((src.match(/var LPN_LINK_HIT_PX = (\d+);/) || [])[1]), String(HIT));

	L.setScale(1);
	L.refreshSymbolSizes();
	const at1 = Number(ne.hit.getAttribute('r')), disc1 = L.nodeRadius(n);
	// **THE SLOP IS A STROKE ROUND THE DRAWN SHAPE SINCE 2026-09-10, NOT A BIGGER SHAPE** (Task
	// 618). A junction's band is geometrically what it always was -- the disc plus half of
	// LPN_NODE_HIT_PX in every direction -- but the two halves are now written separately, because
	// only a stroke can follow an outline that is not a circle. So `r` is the DRAWN radius and the
	// slop is `--lpn-nhit`, published on the element in its own units.
	function slopPx(el, scale) { return Number(el.style.getPropertyValue('--lpn-nhit')) * scale; }
	ok('the band circle is exactly the drawn disc', Math.abs(at1 - disc1) < 1e-9, at1 + ' vs ' + disc1);
	ok('...and the slop rides its stroke, LPN_NODE_HIT_PX wide, so it reaches half that past the ink',
		Math.abs(slopPx(ne.hit, 1) - HIT) < 1e-9, String(slopPx(ne.hit, 1)));
	ok('...and still inside POINTER_REACH_PX, so it cannot out-reach the node finder',
		HIT / 2 < Number((src.match(/var POINTER_REACH_PX = (\d+);/) || [])[1]),
		(HIT / 2) + ' < ' + (src.match(/var POINTER_REACH_PX = (\d+);/) || [])[1]);

	L.setScale(4);
	L.refreshSymbolSizes();
	ok('zoomed in four times the slop is a quarter of the world units it was',
		Math.abs(slopPx(ne.hit, 4) - HIT) < 1e-6, String(slopPx(ne.hit, 4)));
	ok('...which is the same number of screen pixels, which is the promise',
		Math.abs(slopPx(ne.hit, 4) - HIT) < 1e-6 &&
		Math.abs(Number(ne.hit.style.getPropertyValue('--lpn-nhit')) * 4 - HIT) < 1e-6);

	L.setScale(0.01);
	L.refreshSymbolSizes();
	ok('zoomed far out the slop grows in world units rather than vanishing',
		Number(ne.hit.style.getPropertyValue('--lpn-nhit')) > HIT,
		ne.hit.style.getPropertyValue('--lpn-nhit'));

	// ============================================================================================
	// **A VESSEL'S BAND IS ITS OWN OUTLINE AND NOT THE CIRCLE THAT CONTAINS IT** (Tom, 2026-09-10:
	// *"I can visually trace the outline of the reservoir's halo, and if I am not mistaken, it is
	// circular. Fix that."*, and *"Tank is not clean; it's a circle too."*). Before this the band
	// was one `<circle>` per node at nodeRadius() + 6 px, and nodeRadius() of a reservoir is the
	// radius that CONTAINS its triangle -- so the corners answered too. The shape is read out of
	// the file's own table rather than retyped, and compared with lib/Icons.lib.php by
	// symbol-backdrop-harness.js, which owns that half.
	L.setScale(1);
	['reservoir', 'tank'].forEach(function (type) {
		const vid = L.addNode(type, type === 'tank' ? 500 : 400, 400).id;
		L.refreshSymbolSizes();
		const vne = L.nodeEl(vid), vn = L.nodeById(vid);
		ok('a ' + type + '\'s band is a PATH, not a circle round the symbol',
			String(vne.hit.tagName).toLowerCase() === 'path' && vne.hit.getAttribute('r') == null,
			String(vne.hit.tagName));
		ok('...and its outline is the one the symbol is drawn from',
			vne.hit.getAttribute('d') === L.nodeHitSilhouette(vn), vne.hit.getAttribute('d'));
		ok('...placed on the node, in the symbol\'s own box',
			/^translate\(/.test(vne.hit.getAttribute('transform') || '') &&
			/scale\(/.test(vne.hit.getAttribute('transform') || ''),
			vne.hit.getAttribute('transform'));
		// The slop is in the path's LOCAL units, inside that scale -- so the screen figure is what
		// has to come back out, and a junction and a reservoir must agree on it or one of them is
		// easier to hit than the other for no reason a reader could see.
		const k = (/scale\(([-\d.e+]+)/.exec(vne.hit.getAttribute('transform') || '') || [])[1];
		ok('...and its slop is the SAME number of screen pixels a junction gets',
			Math.abs(Number(vne.hit.style.getPropertyValue('--lpn-nhit')) * Number(k) - HIT) < 1e-9,
			String(Number(vne.hit.style.getPropertyValue('--lpn-nhit')) * Number(k)));
		ok('...while the drawn radius the rest of the page reads is unchanged',
			L.nodeRadius(vn) > disc1, String(L.nodeRadius(vn)));
	});
}

// ================================================================================================
// 3. THE BAND FOLLOWS ITS NODE THROUGH EVERY LIFE EVENT
// ================================================================================================
// A hit target that stops tracking its node is worse than none: it answers for a place the node has
// left, so a press on empty map opens a junction that is somewhere else.
console.log('\n--- it moves, renames and dies with its node ---');
{
	freshMap();
	const id = L.addNode('junction', 200, 200).id;
	const n = L.nodeById(id), ne = L.nodeEl(id);
	ok('the band starts on the node', Number(ne.hit.getAttribute('cx')) === 200 &&
		Number(ne.hit.getAttribute('cy')) === 200);

	setHitTarget([ne.circle]);
	fire('pointerdown', { pointerId: 3, clientX: 200, clientY: 200, pointerType: 'mouse', button: 0 });
	for (const f of [0.5, 1]) {
		fire('pointermove', { pointerId: 3, clientX: 200 + 60 * f, clientY: 200 + 40 * f, pointerType: 'mouse' });
		L.applyDrag();
	}
	fire('pointerup', { pointerId: 3, clientX: 260, clientY: 240, pointerType: 'mouse' });
	ok('after a real drag the node has moved', Math.abs(n.x - 260) < 1 && Math.abs(n.y - 240) < 1,
		n.x + ',' + n.y);
	ok('...and the band went with it, through updateNode()\'s one seam',
		Math.abs(Number(ne.hit.getAttribute('cx')) - n.x) < 1e-9 &&
		Math.abs(Number(ne.hit.getAttribute('cy')) - n.y) < 1e-9,
		ne.hit.getAttribute('cx') + ',' + ne.hit.getAttribute('cy'));

	L.applyNodeRename(id, 'RENAMED');
	ok('a rename carries the band\'s data-node with the disc\'s',
		L.nodeEl('RENAMED').hit.dataset.node === 'RENAMED',
		L.nodeEl('RENAMED').hit.dataset.node);

	const layer = L.nodesLayer();
	const before = layer.childNodes.length;
	L.deleteNode('RENAMED');
	ok('deleting the node takes the band out of the drawing with it',
		layer.childNodes.length <= before - 2 &&
		Array.prototype.every.call(layer.childNodes, function (c) {
			return !(c.classList && c.classList.contains('lpn-node-hit'));
		}), before + ' -> ' + layer.childNodes.length);
}

// ================================================================================================
// 4. NOTHING FIGHTS FOR THE CURSOR -- THE MECHANISM, NOT THE RESOLVED VALUE
// ================================================================================================
// The resolved cursor is unreachable here (see the header). These are the three ways the page could
// take a cursor away from an object without any stylesheet being wrong, and all three are read out
// of the source.
console.log('\n--- nothing writes over the stylesheet (mechanism only; the value is unreachable here) ---');
{
	const src = fs.readFileSync(path.join(ROOT, 'js/looped-network.js'), 'utf8');
	// Comments blanked, so a comment ABOUT a cursor is not read as a write of one.
	const code = src.replace(/\/\*[\s\S]*?\*\//g, '').split('\n')
		.map(function (l) { const i = l.indexOf('//'); return i < 0 ? l : l.slice(0, i); }).join('\n');

	const writes = (code.match(/\.style\.cursor\s*=/g) || []).length;
	ok('no shipped line writes style.cursor at all, so nothing can race the class',
		writes === 0, writes + ' write(s)');

	// The ONE seam that toggles a cursor class on the canvas, and the one timer that reasserts it.
	const toggles = (code.match(/svg\.classList\.(toggle|add|remove)\(/g) || []).length;
	note(toggles + ' class writes on the canvas: regmode, regmode-node, lpn-panning, lpn-vertexmode, lpn-labels-hidden, lpn-masks-off');
	ok('lpn-panning is written in exactly ONE place, and it is setPanning()',
		(code.match(/'lpn-panning'/g) || []).length === 1 &&
		/function setPanning\(on\) \{\s*if \(svg && svg\.classList\) \{ svg\.classList\.toggle\('lpn-panning'/.test(code));
	ok('...and the periodic cursor reassert is still gated on regMode alone',
		/setRegMode\(v\) \{[\s\S]{0,400}?cursorNudgeTimer = setInterval\(nudgeCursor, 200\)/.test(code));

	// The hand opens on EVERY release, guarded by nothing -- the 2026-09-07 fix, kept.
	ok('setPanning(false) still runs on every release, guarded by nothing',
		/\n\t\t\tsetPanning\(false\);\n/.test(code));

	// A pointermove listener that toggled a class would be the race Tom guessed at. There is none.
	const moveBodies = code.split("svg.addEventListener('pointermove'").slice(1);
	ok('no pointermove listener on the canvas touches a class at all',
		moveBodies.every(function (b) { return b.slice(0, 900).indexOf('classList') < 0; }),
		moveBodies.length + ' listener(s) read');
}

// ================================================================================================
// 5. THE STYLESHEET GIVES THE BAND A CURSOR, AND THE MODES THAT OVERRULE IT
// ================================================================================================
console.log('\n--- the stylesheet half ---');
{
	// Comments BLANKED, because this file argues about cursors in prose -- the sentence that
	// forbids `#lpn_canvas.lpn-panning *` contains it, and an unblanked scan reads the prohibition
	// as the rule.
	const css = fs.readFileSync(path.join(ROOT, 'css/engcalcs.css'), 'utf8')
		.replace(/\/\*[\s\S]*?\*\//g, '');
	const rule = (css.match(/(?:^|\n)\.lpn-node-hit \{[^}]*\}/) || [''])[0];
	ok('.lpn-node-hit has a rule of its own', !!rule, rule);
	// **THE BAND STOPPED SAYING `pointer` ON 2026-09-09, AND THAT IS THIS SECTION'S OWN ARGUMENT
	// CARRIED ONE STEP FURTHER, not a retreat from it.** This harness exists because a junction is
	// 7 screen pixels of drawn disc and the cursor almost never found it; the band fixed the REACH.
	// But the band is 12 screen pixels wide at every zoom, so on a dense drawing at the fit zoom it
	// is most of the canvas -- measured on the geographic Net3 example, 60.2% of the map computed
	// `pointer` and the bare `<svg>` never appeared in a mid-line scan at all. Tom, that day:
	// *"The cursor for the open map should be grab panning hand since that's all it can do. But
	// it's a pointer finger ... we want the cursor to clearly become a pointer when pointing is
	// appropriate, not all over the map."*
	//
	// So the band keeps its HIT and gives up its CURSOR: `cursor: inherit` shows whatever the canvas
	// is saying, while `pointer-events` below is unchanged and the 12 px of reach this whole file
	// was written to win is untouched. The FEEDBACK now lives on the drawn disc, which is asserted
	// here too so it cannot quietly move onto nothing.
	// **IT CARRIES `default` SINCE 2026-09-10, AND THAT IS THIS SECTION'S ARGUMENT COMPLETING, not
	// reversing.** The complaint here was that a band claiming `pointer` over 12 px of map made the
	// whole canvas a pointer finger; `inherit` fixed that while the band was SLOP. Task 618 made the
	// band the drawn silhouette and made the drawn vessel `pointer-events: none`, so this shape is
	// now the topmost hit target over a reservoir or a tank -- and `inherit` then told the reader the
	// map was pannable while they pointed at an asset (Tom, at 100 px symbols: *"Reservoir and Pump
	// cursor is a grab except for a single pixel at its anchor point"*). Ink carries the object
	// cursor; slop inherits. `.lpn-link-hit` is still slop and still inherits.
	ok('...and it carries the object cursor, because the band IS the ink now',
		/cursor:\s*default/.test(rule));
	ok('...while the DRAWN disc still carries the object cursor, or the feedback moved onto nothing',
		/(?:^|\n)\.lpn-node \{[^}]*cursor:\s*default/.test(css));
	// **`visible` WITH A DECLARED STROKE-WIDTH, WHICH IS NOT THE 2026-09-09 DEFECT COMING BACK.**
	// That defect was `pointer-events: visible` with NO `stroke-width` at all: the perimeter then
	// takes the initial value, ONE USER UNIT, which on this page is one WORLD unit -- 11.5 px of
	// invisible reach on the XY Net3 example and 4,215 px on the same network as a geographic
	// project, where one node answered 42% of the canvas. It was fixed with `visibleFill`, which
	// drops the stroke from the hit test entirely.
	//
	// Task 618 needs the stroke BACK, because a stroke is the only thing that can put a constant
	// slop round an outline that is not a circle -- and it is safe now for the reason it was never
	// safe before: syncNodeHit() DECLARES the width, in the element's own units, on every zoom, and
	// the stylesheet's fallback is ZERO. So a publish that never runs shrinks the band to bare ink
	// rather than growing it to a wall. Both halves are asserted, because either alone is the bug.
	// **A POINTER GETS NO SLOP AT ALL SINCE 2026-09-10** (Tom: *"No slop for nodes."*), so the base
	// rule declares ZERO and the 12 px this file measures is published for a COARSE pointer only.
	// Both halves are asserted: a base rule that carried the variable would put the skirt back on
	// every desktop, and a missing media rule would take it off every phone.
	const coarse = (css.match(/@media \(pointer: coarse\) \{\s*\.lpn-node-hit \{[^}]*\}/) || [''])[0];
	const nhw = /stroke-width:\s*0\s*;/.test(rule) && /stroke-width:\s*var\(--lpn-nhit,\s*0\)/.test(coarse);
	ok('...it is hittable by its fill AND its stroke -- `visible`, not `visibleFill`',
		/pointer-events:\s*visible\s*;/.test(rule), rule);
	ok('...with NO slop on a pointer, and the 12 px skirt kept for a coarse one',
		nhw, rule + coarse);
	const js = fs.readFileSync(path.join(ROOT, 'js/looped-network.js'), 'utf8');
	ok('...and the file that publishes it does so in the element\'s own units, every zoom',
		/hit\.style\.setProperty\('--lpn-nhit'/.test(js) &&
		(js.match(/--lpn-nhit/g) || []).length >= 2);
	// The other half of the same halo: the unpainted disc under a reservoir used to be
	// `pointer-events: visible` in its own right, so it answered over the circle that circumscribes
	// the symbol whatever `.lpn-node-hit` was shaped like.
	ok('...and the unpainted vessel disc no longer answers the pointer at all',
		/\.lpn-node-reservoir, \.lpn-node-tank \{[^}]*pointer-events:\s*none/.test(css),
		(css.match(/\.lpn-node-reservoir, \.lpn-node-tank \{[^}]*\}/) || [''])[0]);
	ok('...with a transparent fill, so it is reachable and cannot be seen',
		/fill:\s*transparent/.test(rule));
	ok('vertices mode overrules it, the way it already overrules the pipe band',
		/\.lpn-vertexmode \.lpn-node-hit \{[^}]*crosshair/.test(css));
	ok('the registration wizard\'s node exception covers the band too',
		/regmode-node \.lpn-node-hit \{[^}]*pointer/.test(css));
	// The 2026-09-08 fix that must not come back: the `*` half of the panning rule.
	ok('the panning rule still does NOT reach every child of the canvas',
		css.indexOf('#lpn_canvas.lpn-panning *') < 0);
	ok('the bare map still offers the open hand', /#lpn_canvas \{[^}]*cursor:\s*grab/.test(css));
}

console.log(fails ? '\n' + fails + ' FAILURE(S)' : '\nall checks passed');
process.exit(fails ? 1 : 0);
