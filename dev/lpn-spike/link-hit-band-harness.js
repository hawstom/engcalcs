// A PIPE AND A PUMP ARE REACHABLE WITH A MOUSE -- Tom's 2026-09-08 worklist. Run with:
//   node dev/lpn-spike/link-hit-band-harness.js
//
// Tom, 2026-09-08: pipes and pumps are too hard to click on a PC without their label, and a pump on
// Net3 has to be zoomed into before it can be edited at all.
//
// **THE TWO FACTS UNDERNEATH IT.** `settings.linkWidth` ships at 2, and an SVG hit test is exactly
// the drawn stroke -- no tolerance of any kind -- so a pipe was two pixels of target. And a pump's
// drawn symbol is `.lpn-link-symbol`, which is `pointer-events: none` on purpose (a press on a pump
// must reach the LINK), so on a pump link two units long there was nothing to aim at but two units
// of two-pixel stroke.
//
// **THE FIX IS ON THE GEOMETRY, NOT ON THE LABEL**, which is Tom's own framing and is the thing
// this file is really guarding: a label is the ANSWER to "what is this pipe", and making the answer
// the only route to the question is the defect. So a link carries an invisible `.lpn-link-hit`
// stroke and a pump or valve carries a `.lpn-link-symbol-hit` square over its drawn extent.
//
// **WHY IT IS NOT A SECTION OF touch-radius-harness.js.** That file's whole thesis is ONE KNOB PER
// HAND -- one number for a finger, one for a pointer, across every object. This is not one of those
// knobs and must not be folded into them: they answer *how near may a hand land and still mean the
// thing*, measured by a finder in code, while this is the WIDTH OF A MARK on the drawing that the
// browser's own hit test then answers for. Section 4 asserts the two do not collide.
//
// **THE STUB IS TAUGHT NOTHING NEW AND THAT IS DELIBERATE.** Every assertion below is about what the
// page BUILDS -- which element, in which layer, with which points, which width, and which
// `data-link` -- and about the real `selectFromHit()` reading it. The stub's `elementsFromPoint()`
// is a fixture and could never answer whether a band is wide enough; a harness that faked it would
// be measuring its own arithmetic. What a band 12 px wide feels like under a hand is Tom's to say,
// and the browser-pass instruction is in the report.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\tlinkEls: function (id) { return linkEls[id]; },\n" +
	"\t\tnodeEls: function (id) { return nodeEls[id]; },\n" +
	"\t\tlinksLayer: function () { return linksLayer; },\n" +
	"\t\tnodesLayer: function () { return nodesLayer; },\n" +
	"\t\tsvgEl: function () { return svg; },\n" +
	"\t\tlinkHitPx: function () { return LPN_LINK_HIT_PX; },\n" +
	"\t\tpointerReachPx: function () { return POINTER_REACH_PX; },\n" +
	"\t\tpumpSymbolSize: pumpSymbolSize,\n" +
	"\t\trefreshSymbolSizes: refreshSymbolSizes,\n" +
	"\t\tsetScale: function (s) { state.s = s; state.tx = 0; state.ty = 0; },\n" +
	"\t\tupdateNode: updateNode,\n" +
	"\t\tdeleteLink: deleteLink,\n" +
	"\t\tselectFromHit: selectFromHit, selectedRef: selectedRef,\n" +
	"\t\tnodeOutranks: nodeOutranks,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol); }
function inLayer(el, layer) { return !!el && el.parentNode === layer; }

// One reservoir, two junctions, a pipe and a SHORT pump -- the Net3 shape Tom reported, where the
// pump's link is a fraction of the pipe's length and the symbol is the only thing worth aiming at.
L.seedDefaultInputs();
L.buildLayers();
const R1 = L.addNode('reservoir', 0, 0).id;
const J1 = L.addNode('junction', 3, 0).id;
const J2 = L.addNode('junction', 200, 0).id;
const PUMP = L.addLink('pump', R1, J1).id;
const PIPE = L.addLink('pipe', J1, J2).id;
L.buildDom();
L.setScale(4);
L.refreshSymbolSizes();

// ================================================================================================
console.log('\n--- 1. every link carries an invisible grab band ---');
// ================================================================================================
{
	[PIPE, PUMP].forEach(function (id) {
		const le = L.linkEls(id), hit = le && le.hit;
		ok(id + ' has a hit band', !!hit);
		ok('...classed .lpn-link-hit, so one CSS rule governs every one of them',
			hit && String(hit.getAttribute('class')).indexOf('lpn-link-hit') >= 0,
			hit && hit.getAttribute('class'));
		// **THE SAME data-link, NOT A SECOND VOCABULARY.** Every pointer branch in the page reads
		// `t.dataset.link`; a band with a name of its own would need a branch of its own in each.
		ok('...carrying the pipe\'s own data-link', hit && hit.dataset.link === id, hit && hit.dataset.link);
		ok('...drawn on exactly the pipe\'s own points, so it can never be beside the pipe',
			hit && hit.getAttribute('points') === le.line.getAttribute('points'));
	});
	// UNDER the nodes. A node's disc is 7 screen pixels and is the hardest thing on the map to aim
	// at; if the band painted over it, widening the pipe would have taken the node away.
	ok('the band is in the LINKS layer, so a node still paints over it and still wins a press on it',
		inLayer(L.linkEls(PIPE).hit, L.linksLayer()));
	ok('...and a node circle really is in the layer above', inLayer(L.nodeEls(J1).circle, L.nodesLayer()));
}

// ================================================================================================
console.log('\n--- 2. the band is a constant number of SCREEN pixels ---');
// ================================================================================================
// A world-unit band would be enormous zoomed out and invisible zoomed in, which is the argument
// every other tolerance on this page already makes. --lpn-hit is published with --lpn-lw.
{
	const px = L.linkHitPx();
	ok('LPN_LINK_HIT_PX is a real number, read from the page', px > 0, String(px));
	[1, 4, 250].forEach(function (s) {
		L.setScale(s);
		L.refreshSymbolSizes();
		const w = parseFloat(L.svgEl().style.getPropertyValue('--lpn-hit'));
		ok('at scale ' + s + ' the band is ' + px + ' screen px wide', near(w * s, px, 1e-9),
			(w * s).toFixed(6) + ' px');
	});
	L.setScale(4);
	L.refreshSymbolSizes();
}

// ================================================================================================
console.log('\n--- 3. a pump\'s clickable area is its DRAWN EXTENT ---');
// ================================================================================================
// The whole of Tom's second report. The pump link R1->J1 is 3 units long; the symbol drawn at its
// midpoint is wider than that, and before this it was not hit-testable at all.
{
	const le = L.linkEls(PUMP), hit = le && le.symbolHit;
	ok('a pump has a hit square', !!hit);
	ok('...classed .lpn-link-symbol-hit', hit && String(hit.getAttribute('class')).indexOf('lpn-link-symbol-hit') >= 0);
	ok('...carrying the pump\'s own data-link', hit && hit.dataset.link === PUMP, hit && hit.dataset.link);
	const size = L.pumpSymbolSize('pump');
	ok('...sized to the symbol the page actually draws, never to a number of its own',
		hit && near(+hit.getAttribute('width'), size) && near(+hit.getAttribute('height'), size),
		hit && hit.getAttribute('width') + ' x ' + hit.getAttribute('height') + ' against ' + size);
	// The midpoint is read out of the DOCUMENT, never retyped: addNode() places a node from the
	// caller's coordinates through the page's own conversion, and a harness that assumed otherwise
	// would be asserting against its own arithmetic.
	const mid = function () {
		const a = L.getDoc().nodes.filter(function (n) { return n.id === R1; })[0],
			b = L.getDoc().nodes.filter(function (n) { return n.id === J1; })[0];
		return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
	};
	// Placed by a TRANSLATE and cornered locally, exactly as symbolG/symbolSvg are -- see
	// resizePumpSymbol(). Read back the way the browser would resolve it.
	const centre = function () {
		const m = /translate\(([-\d.e]+),([-\d.e]+)\)/.exec(String(hit.getAttribute('transform')) || '');
		if (!m) { return null; }
		return { x: +m[1] + +hit.getAttribute('x') + +hit.getAttribute('width') / 2,
			y: +m[2] + +hit.getAttribute('y') + +hit.getAttribute('height') / 2 };
	};
	const m0 = mid(), c0 = centre();
	ok('...centred on the link\'s midpoint', c0 && near(c0.x, m0.x) && near(c0.y, m0.y),
		c0 ? c0.x + ', ' + c0.y : String(hit.getAttribute('transform')));
	// **THIS IS THE ZOOM REPORT IN ARITHMETIC.** The symbol is wider than the link it sits on, so
	// the square is the only thing on this pump a reader can reach without zooming in.
	const linkLen = Math.hypot(
		L.getDoc().nodes.filter(function (n) { return n.id === R1; })[0].x -
			L.getDoc().nodes.filter(function (n) { return n.id === J1; })[0].x,
		L.getDoc().nodes.filter(function (n) { return n.id === R1; })[0].y -
			L.getDoc().nodes.filter(function (n) { return n.id === J1; })[0].y);
	ok('...and it is WIDER than the pump link itself, which is the report', size > linkLen,
		size.toFixed(2) + ' units across a ' + linkLen.toFixed(2) + '-unit link');
	// IN THE LINKS LAYER, not inside symbolG. symbolG is in the nodes layer so a pump reads over
	// every pipe it crosses; a hit square there would paint over the pump's own end nodes.
	ok('the square is in the LINKS layer, so it cannot steal the pump\'s own end nodes',
		inLayer(hit, L.linksLayer()));
	ok('...while the drawn symbol stays in the nodes layer, where it reads over the pipework',
		inLayer(le.symbolG, L.nodesLayer()));
	ok('a plain pipe gets no square at all', !L.linkEls(PIPE).symbolHit);

	// It FOLLOWS. Moving an end node runs positionPumpSymbol() through updateNode(); a square left
	// behind would be an invisible grab area sitting where the pump used to be.
	L.getDoc().nodes.filter(function (n) { return n.id === J1; })[0].x += 40;
	L.updateNode(J1);
	const m1 = mid();
	ok('moving an end node takes the square with the symbol',
		centre() && near(centre().x, m1.x) && !near(m1.x, m0.x),
		hit.getAttribute('transform') + ' for a midpoint now at ' + m1.x.toFixed(2));

	// **A ZOOM RE-SIZES THE SYMBOL AND DOES NOT RE-PLACE IT**, because the translate does not
	// depend on how big the symbol is (refreshSymbolSizes() calls resizePumpSymbol() alone). So the
	// square's corner has to be LOCAL to that translate. It was `mid - size/2` for one build of
	// this harness, and it drifted off the pump by half the size difference on the first wheel
	// notch -- silently, because a hit area draws nothing.
	L.setScale(40);
	L.refreshSymbolSizes();
	const zoomed = L.pumpSymbolSize('pump');
	ok('a zoom really does change the symbol\'s size', !near(zoomed, size),
		size.toFixed(3) + ' -> ' + zoomed.toFixed(3));
	ok('...and the square is still centred on the pump after it',
		centre() && near(centre().x, m1.x) && near(centre().y, m1.y) &&
			near(+hit.getAttribute('width'), zoomed),
		centre() ? centre().x + ', ' + centre().y : 'no transform');
	L.setScale(4);
	L.refreshSymbolSizes();
}

// ================================================================================================
console.log('\n--- 4. the band does not take the map away from anything else ---');
// ================================================================================================
{
	// **HALF THE BAND IS THE SLOP, AND IT STAYS UNDER THE NODE'S REACH.** Near a junction both are
	// in play, and Tom has ruled twice that a node wins ("nodes need to get precedence always").
	ok('half the band is less than the pointer\'s own reach, so a node stays the easier target',
		L.linkHitPx() / 2 < L.pointerReachPx(),
		(L.linkHitPx() / 2) + ' px against ' + L.pointerReachPx() + ' px');
	// A FINGER'S RULE IS UNCHANGED: nodeOutranks() decides what a nearby node may overrule, and it
	// reads dataset.link -- which the band and the square both carry, so both are outranked with no
	// edit to that function at all.
	ok('a node still outranks the band on touch', L.nodeOutranks(L.linkEls(PIPE).hit));
	ok('...and outranks the pump square too', L.nodeOutranks(L.linkEls(PUMP).symbolHit));
	// PANNING IS UNTOUCHED, and this is the reason widening cost nothing: wirePointerEvents() arms
	// a drag for a node, a vertex and the three label kinds, and for a LINK it falls through to a
	// pan. So a press inside the band selects the pipe and still pans the map.
	const fs = require('fs');
	const src = fs.readFileSync(require('path').resolve(__dirname, '..', '..', 'js', 'looped-network.js'), 'utf8');
	const down = src.slice(src.indexOf("svg.addEventListener('pointerdown'"));
	ok('a press on a link arms no drag -- only a vertex handle does -- so a pan still starts there',
		/dataset\.link !== undefined && t\.classList\.contains\('lpn-vhandle'\)/.test(down));
}

// ================================================================================================
console.log('\n--- 5. a press on either one selects the link ---');
// ================================================================================================
// The real selectFromHit(), which is the function every pointer path hands its hit to.
{
	L.selectFromHit(L.linkEls(PIPE).hit);
	let sel = L.selectedRef();
	ok('the band selects its pipe', !!sel && sel.kind === 'link' && sel.id === PIPE, JSON.stringify(sel));
	L.selectFromHit(L.linkEls(PUMP).symbolHit);
	sel = L.selectedRef();
	ok('the square selects its pump', !!sel && sel.kind === 'link' && sel.id === PUMP, JSON.stringify(sel));
}

// ================================================================================================
console.log('\n--- 6. and both are torn down with the link ---');
// ================================================================================================
// THE ZOMBIE-LABEL LESSON, in a new pair of elements. removeLinkEls() replaces linkEls[id] whole,
// so anything of the old one left in a shared layer is orphaned with a live data-link on it: an
// invisible grab area that still opens a pipe that is not there. Two elements added, two lines in
// that teardown, and this is what says so.
{
	const before = L.linksLayer().children.length;
	L.deleteLink(PIPE);
	const orphans = L.linksLayer().children.filter(function (c) {
		return c.dataset && c.dataset.link === PIPE;
	});
	ok('deleting a pipe leaves no orphan band behind it', orphans.length === 0,
		orphans.length + ' left of ' + before + ' children');
	L.deleteLink(PUMP);
	const pumpOrphans = L.linksLayer().children.filter(function (c) {
		return c.dataset && c.dataset.link === PUMP;
	});
	ok('...and deleting a pump leaves neither its band nor its square', pumpOrphans.length === 0,
		pumpOrphans.length + ' left');
}

console.log('\n' + (fails ? fails + ' FAILURE(S)' : 'all checks passed'));
process.exit(fails ? 1 : 0);
