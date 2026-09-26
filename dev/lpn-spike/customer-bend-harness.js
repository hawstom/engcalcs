// CUSTOMERS UNDER PIPES, CUSTOMERS AT BENDS, AND THE EXAMPLES' DISPLAY SIZES -- ROADMAP Task 247.
// Run with:
//   node dev/lpn-spike/customer-bend-harness.js
//
// Three of Tom's findings of 2026-09-25, each of which draws correctly in a way a glance misses:
//
// 1. *"Customer zindex is higher than Junction. Fix that. Make it just less than link?"* The
//    service and its dot must be painted BELOW every pipe and every node, because for a mouse the
//    paint order IS the pick order: a junction sitting on a customer has to be what the press gets.
//
// 2. *"We didn't account for vertices. If we are in the no-perp region outside a vertex, we need to
//    connect at the vertex. And we need to allow dragging a customer to this region while
//    intelligently tracking onto the vertex while appropriate."* Outside a convex bend no
//    perpendicular from the meter lands on either leg; the connection there is the vertex itself,
//    the meter stays where the hand put it, and the station is the arc length AT the vertex.
//
// 3. *"let's [set] the Text size and Symbol size=12 and the Link line thickness=4 for all example
//    projects."* Every published example, and its authoring source, carries exactly those three.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const { ROOT, byId, loadLoopedNetwork, setUnitSet, setHitTarget } = require('./lpn-dom-stub.js');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-6 : tol); }
function pt(p) { return p ? '(' + (+p.x).toFixed(3) + ',' + (+p.y).toFixed(3) + ')' : 'none'; }

setUnitSet('us');

// ---------------------------------------------------------------------------
console.log('\n--- 1. customers paint under every pipe and every node ---');
// ---------------------------------------------------------------------------
{
	// The REAL init(), so the layer stack under test is the page's own rather than a copy of it.
	global.fetch = () => Promise.reject(new Error('no network in this harness'));
	global.EngCalcs.setIconLabel = global.EngCalcs.setIconLabel || (() => {});
	global.window.history = global.window.history || { replaceState: () => {} };
	global.requestAnimationFrame = global.window.requestAnimationFrame = () => 0;
	// init() arms timers (a map-sizing retry, the autosave); none of them is this section's subject.
	const hadST = global.window.setTimeout, hadCT = global.window.clearTimeout;
	global.window.setTimeout = () => 0; global.window.clearTimeout = () => {};
	const L1 = loadLoopedNetwork(
		"\t\tinit: init, getDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
		"\t\taddCustomer: addCustomer, buildDom: buildDom,\n" +
		"\t\tcustEls: function () { return custEls; },\n" +
		"\t\tlayers: function () { return { model: modelLayer, customers: customersLayer,\n" +
		"\t\t\tlinks: linksLayer, linkSymbols: linkSymbolLayer, nodes: nodesLayer, labels: labelsLayer }; }\n"
	);
	L1.init();
	const doc = L1.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0; doc.customers = [];
	const a = L1.addNode('junction', 0, 0), b = L1.addNode('junction', 100, 0);
	const p = L1.addLink('pipe', a.id, b.id);
	L1.buildDom();
	const c = L1.addCustomer(50, 20, { link: p.id });
	const ly = L1.layers(), kids = Array.prototype.slice.call(ly.model.children || ly.model.childNodes || []);
	const at = (g) => kids.indexOf(g);
	ok('1.1 the page has a customers layer inside the drawing', !!ly.customers && at(ly.customers) >= 0);
	ok('1.2 ...painted before (under) the links layer', at(ly.customers) < at(ly.links),
		at(ly.customers) + ' vs ' + at(ly.links));
	ok('1.3 ...and so under the pump/valve symbols and the nodes as well',
		at(ly.customers) < at(ly.linkSymbols) && at(ly.customers) < at(ly.nodes));
	ok('1.4 ...and "just less than link": nothing of the drawing sits between it and the links',
		at(ly.links) - at(ly.customers) === 1);
	const ce = L1.custEls()[c.id];
	ok('1.5 a customer\'s dot is drawn in that layer', !!ce && ce.box.parentNode === ly.customers);
	ok('1.6 ...and so is its service line', !!ce && ce.stub.parentNode === ly.customers);
	// A wholesale rebuild must empty the layer, or a closed project leaves ghost customers behind.
	doc.customers.length = 0;
	L1.buildDom();
	ok('1.7 a rebuild empties the customers layer', (ly.customers.children || ly.customers.childNodes).length === 0);
	global.window.setTimeout = hadST; global.window.clearTimeout = hadCT;
}

// ---------------------------------------------------------------------------
// The gesture harness, on a hand-rolled layer stack (the same one customer-grip-harness.js uses).
// ---------------------------------------------------------------------------
const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\taddCustomer: addCustomer, customerById: customerById,\n" +
	"\t\tcustomerAttachPoint: customerAttachPoint, customerPoint: customerPoint,\n" +
	"\t\tcustomerT: customerT, customerLink: customerLink, customerNodeId: customerNodeId,\n" +
	"\t\tcustomerOffset: customerOffset, setCustomerOffset: setCustomerOffset,\n" +
	"\t\tsetCustomerStation: setCustomerStation, customerAtBend: customerAtBend,\n" +
	"\t\tsetCustomerAt: setCustomerAt,\n" +
	"\t\tcustHandle: function () { return custHandleEl; },\n" +
	"\t\tcustBox: function (id) { return custEls[id] && custEls[id].box; },\n" +
	"\t\tcustStub: function (id) { return custEls[id] && custEls[id].stub; },\n" +
	"\t\tsetSelection: setSelection, selectedRef: selectedRef,\n" +
	"\t\tnodeHit: function (id) { return nodeEls[id] && (nodeEls[id].hit || nodeEls[id].circle); },\n" +
	"\t\tpopupNow: function () { return currentPopup ? { kind: currentPopup.kind || 'node', id: currentPopup.id } : null; },\n" +
	"\t\tnodeXY: function (id) { var n = nodeById(id); return { x: n.x, y: n.y }; },\n" +
	"\t\tdragNow: function () { return drag ? { type: drag.type, id: drag.id } : null; },\n" +
	"\t\tapplyDrag: function () { if (drag && dragDirty) { applyDrag(); dragDirty = false; } },\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
	"\t\tworldToScreen: worldToScreen,\n" +
	"\t\tsetScale: function (s) { state.s = s; state.tx = 0; state.ty = 0; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tcustomersLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
L.seedDefaultInputs();
L.setScale(1);
L.wirePointerEvents();
const svg = byId.lpn_canvas;
function fire(type, ev, target) {
	setHitTarget(target || null);
	(svg._listeners[type] || []).forEach(function (fn) { fn(Object.assign({ target: target || svg }, ev)); });
}
function move(x, y, target) { fire('pointermove', { pointerId: 4, clientX: x, clientY: y, pointerType: 'mouse' }, target); }
function down(x, y, target) { fire('pointerdown', { pointerId: 4, clientX: x, clientY: y, pointerType: 'mouse', button: 0 }, target); }
function up(x, y, target) { fire('pointerup', { pointerId: 4, clientX: x, clientY: y, pointerType: 'mouse', button: 0 }, target); }

// A bent main: A(100,200) east to a bend at (400,200), then south to B(400,800). Legs 300 and 600,
// so the bend is at a third of the arc length. The wedge outside the corner, where no perpendicular
// lands on either leg, is x > 400 and y < 200. A straight main far away is the other asset.
const doc = L.getDoc();
doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0; doc.customers = [];
const jA = L.addNode('junction', 100, 200);
const jB = L.addNode('junction', 400, 800);
const jC = L.addNode('junction', 1000, 100);
const jD = L.addNode('junction', 1000, 900);
const bent = L.addLink('pipe', jA.id, jB.id, [{ x: 400, y: 200 }]);
const other = L.addLink('pipe', jC.id, jD.id);
L.buildDom();
const BEND_T = 300 / 900;

// ---------------------------------------------------------------------------
console.log('\n--- 2a. a customer placed in the wedge outside a bend connects AT the bend ---');
// ---------------------------------------------------------------------------
{
	const c = L.addCustomer(450, 150, { link: bent.id });
	ok('2a.1 it is attached to the bent pipe, not refused', !!L.customerLink(c) && L.customerLink(c).id === bent.id);
	ok('2a.2 ...at the vertex itself', near(L.customerAttachPoint(c).x, 400) && near(L.customerAttachPoint(c).y, 200),
		pt(L.customerAttachPoint(c)));
	ok('2a.3 ...with the station equal to the arc length at the vertex (1/3)', near(L.customerT(c), BEND_T, 1e-12),
		String(L.customerT(c)));
	ok('2a.4 ...and the customer stands exactly where it was put, not thrown onto a leg\'s perpendicular',
		near(L.customerPoint(c).x, 450) && near(L.customerPoint(c).y, 150), pt(L.customerPoint(c)));
	ok('2a.5 the page knows it is on a bend', L.customerAtBend(c));
	ok('2a.6 its demand lumps at the end nearer ALONG the pipe (the from end, 300 vs 600)',
		L.customerNodeId(c) === jA.id, L.customerNodeId(c));
	const off = L.customerOffset(c);
	ok('2a.7 its offset reads the whole length of the service (70.71), not one leg\'s component',
		near(Math.abs(off), Math.hypot(50, 50), 1e-6), String(off));
	// Typing an offset on a bend keeps the direction and changes the length.
	L.setCustomerOffset(c, off * 2);
	ok('2a.8 a typed offset on a bend keeps the service\'s direction and doubles its length',
		near(L.customerPoint(c).x, 500) && near(L.customerPoint(c).y, 100) && near(L.customerT(c), BEND_T, 1e-12),
		pt(L.customerPoint(c)));
	// A station typed off the bend carries the whole distance out, square to the new leg.
	L.setCustomerStation(c, 0.2);
	const d = Math.abs(L.customerPoint(c).y - 200);
	ok('2a.9 sliding the station off the bend keeps the house as far out as it stood',
		near(d, Math.hypot(100, 100), 1e-6) && near(L.customerPoint(c).x, 100 + 0.2 * 900), pt(L.customerPoint(c)));
	doc.customers.length = 0; L.buildDom();
}

// ---------------------------------------------------------------------------
console.log('\n--- 2b. dragging the customer tracks onto the bend and off it again ---');
// ---------------------------------------------------------------------------
{
	L.setMode('select');
	const c = L.addCustomer(350, 150, { link: bent.id });
	L.setSelection('customer', c.id);
	const box = L.custBox(c.id);
	const s0 = L.worldToScreen(350, 150);
	down(s0.x, s0.y, box);
	ok('2b.1 pressing the dot begins a customer drag', (L.dragNow() || {}).type === 'customer');
	function to(x, y) { const s = L.worldToScreen(x, y); move(s.x, s.y); L.applyDrag(); }
	to(380, 150);
	ok('2b.2 on the first leg the service is square to it',
		near(L.customerAttachPoint(c).x, 380) && near(L.customerAttachPoint(c).y, 200) &&
		near(L.customerPoint(c).x, 380) && near(L.customerPoint(c).y, 150), pt(L.customerAttachPoint(c)));
	to(450, 150);
	ok('2b.3 into the wedge: the drag is NOT refused, the customer follows the hand',
		near(L.customerPoint(c).x, 450) && near(L.customerPoint(c).y, 150), pt(L.customerPoint(c)));
	ok('2b.4 ...and the connection tracks onto the vertex', near(L.customerAttachPoint(c).x, 400) &&
		near(L.customerAttachPoint(c).y, 200) && near(L.customerT(c), BEND_T, 1e-12), pt(L.customerAttachPoint(c)));
	const stub = L.custStub(c.id);
	ok('2b.5 the drawn service line runs from the vertex to the customer',
		near(+stub.getAttribute('x1'), 400) && near(+stub.getAttribute('y1'), 200) &&
		near(+stub.getAttribute('x2'), 450) && near(+stub.getAttribute('y2'), 150));
	to(470, 190);
	ok('2b.6 moving within the wedge keeps it on the vertex while the customer keeps following',
		near(L.customerAttachPoint(c).x, 400) && near(L.customerAttachPoint(c).y, 200) &&
		near(L.customerPoint(c).x, 470) && near(L.customerPoint(c).y, 190), pt(L.customerPoint(c)));
	// Crossing the wedge's edge onto the second leg's perpendicular: continuous, no jump.
	to(470, 200.5);
	ok('2b.7 just past the wedge edge the connection leaves the vertex by half a unit, no more',
		near(L.customerAttachPoint(c).x, 400) && near(L.customerAttachPoint(c).y, 200.5) &&
		near(L.customerPoint(c).x, 470) && near(L.customerPoint(c).y, 200.5), pt(L.customerAttachPoint(c)));
	to(460, 300);
	ok('2b.8 on the second leg the service is square to that leg',
		near(L.customerAttachPoint(c).x, 400) && near(L.customerAttachPoint(c).y, 300) &&
		near(L.customerPoint(c).x, 460) && near(L.customerPoint(c).y, 300), pt(L.customerAttachPoint(c)));
	ok('2b.9 ...and its station is back on the arc length of the leg', near(L.customerT(c), 400 / 900, 1e-9),
		String(L.customerT(c)));
	to(450, 150);
	up(L.worldToScreen(450, 150).x, L.worldToScreen(450, 150).y);
	ok('2b.10 dropped in the wedge, it stays on the vertex with the customer where it was dropped',
		near(L.customerT(c), BEND_T, 1e-12) && near(L.customerPoint(c).x, 450) && near(L.customerPoint(c).y, 150));
	doc.customers.length = 0; L.buildDom();
}

// ---------------------------------------------------------------------------
console.log('\n--- 2c. the connection grip, dropped on a bent pipe from the wedge, lands on the vertex ---');
// ---------------------------------------------------------------------------
{
	// A customer in the bent pipe's wedge, served for now from the far main.
	const c = L.addCustomer(450, 150, { link: other.id });
	ok('2c.0 it starts on the other main', L.customerLink(c).id === other.id);
	L.setSelection('customer', c.id);
	const grip = L.custHandle();
	const a0 = L.customerAttachPoint(c), s0 = L.worldToScreen(a0.x, a0.y);
	down(s0.x, s0.y, grip);
	ok('2c.1 pressing the grip begins a connection drag', (L.dragNow() || {}).type === 'custanchor');
	const onBent = L.worldToScreen(400, 400);
	move(onBent.x, onBent.y); L.applyDrag();
	ok('2c.2 arriving at the bent pipe re-serves the customer from it', L.customerLink(c).id === bent.id);
	ok('2c.3 ...at the vertex, the nearest point on it to where the house stands',
		near(L.customerAttachPoint(c).x, 400) && near(L.customerAttachPoint(c).y, 200) &&
		near(L.customerT(c), BEND_T, 1e-12), pt(L.customerAttachPoint(c)));
	ok('2c.4 ...and the house has not moved', near(L.customerPoint(c).x, 450) && near(L.customerPoint(c).y, 150),
		pt(L.customerPoint(c)));
	up(onBent.x, onBent.y);
	doc.customers.length = 0; L.buildDom();
}

// ---------------------------------------------------------------------------
console.log('\n--- 2d. a customer square to a leg is unchanged ---');
// ---------------------------------------------------------------------------
{
	const c = L.addCustomer(250, 260, { link: bent.id });
	ok('2d.1 an ordinary customer is not on a bend', !L.customerAtBend(c));
	ok('2d.2 ...and is square to its leg', near(L.customerAttachPoint(c).x, 250) && near(L.customerAttachPoint(c).y, 200) &&
		near(L.customerPoint(c).y, 260));
	ok('2d.3 ...with its perpendicular offset', near(Math.abs(L.customerOffset(c)), 60));
	doc.customers.length = 0; L.buildDom();
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
console.log('\n--- 2e. a click on a junction under a selected customer\'s grip picks the junction ---');
// ---------------------------------------------------------------------------
{
	// Perry's pre-review: a node-connected customer is selected on placement, and its grip sits
	// exactly on the junction. The grip stays on top so it can be dragged; a CLICK hands through.
	L.setMode('select');
	const c = L.addCustomer(60, 150, { link: bent.id, t: 0 });
	ok('2e.0 the customer is connected exactly at junction A', L.customerT(c) === 0 &&
		near(L.customerAttachPoint(c).x, 100) && near(L.customerAttachPoint(c).y, 200));
	L.setSelection('customer', c.id);
	const grip = L.custHandle(), nodeEl = L.nodeHit(jA.id);
	ok('2e.1 the selected customer\'s grip sits on the junction', !!grip &&
		near(+grip.getAttribute('cx'), 100) && near(+grip.getAttribute('cy'), 200));
	const s = L.worldToScreen(100, 200);
	// The browser's stack at that point: the grip on top, the junction under it.
	down(s.x, s.y, [grip, nodeEl]);
	up(s.x, s.y, [grip, nodeEl]);
	const sel = L.selectedRef(), pop = L.popupNow();
	ok('2e.2 a plain click there selects the JUNCTION, not the customer',
		!!sel && sel.kind === 'node' && sel.id === jA.id, JSON.stringify(sel));
	ok('2e.3 ...and opens the junction\'s box', !!pop && pop.id === jA.id, JSON.stringify(pop));
	ok('2e.4 ...and the customer\'s connection is untouched', L.customerT(c) === 0 && L.customerLink(c).id === bent.id);

	// The drag still belongs to the grip.
	L.setSelection('customer', c.id);
	const g2 = L.custHandle();
	down(s.x, s.y, [g2, nodeEl]);
	ok('2e.5 a press on the grip over the junction still begins a CONNECTION drag',
		(L.dragNow() || {}).type === 'custanchor', JSON.stringify(L.dragNow()));
	const onOther = L.worldToScreen(1000, 400);
	move(onOther.x, onOther.y); L.applyDrag();
	up(onOther.x, onOther.y);
	ok('2e.6 ...which carries the connection to the other main', L.customerLink(c).id === other.id);
	ok('2e.7 ...and the junction it started on did not move', near(L.nodeXY(jA.id).x, 100) && near(L.nodeXY(jA.id).y, 200));
	ok('2e.8 ...and the customer stays selected', (L.selectedRef() || {}).kind === 'customer');

	// A click on the grip over bare map (nothing but the grip there) still means the customer.
	const c2 = L.addCustomer(700, 150, { link: other.id });
	L.setSelection('customer', c2.id);
	const g3 = L.custHandle(), a3 = L.customerAttachPoint(c2), s3 = L.worldToScreen(a3.x, a3.y);
	down(s3.x, s3.y, [g3]);
	up(s3.x, s3.y, [g3]);
	ok('2e.9 a click on a grip with nothing under it keeps the customer',
		(L.selectedRef() || {}).kind === 'customer' && L.selectedRef().id === c2.id, JSON.stringify(L.selectedRef()));
	doc.customers.length = 0; L.buildDom();
}

console.log('\n--- 3. every example project opens at Text 12, Symbol 12, Link line width 4 ---');
// ---------------------------------------------------------------------------
{
	const dirs = ['examples', 'dev/water-network-examples'];
	const manifest = JSON.parse(fs.readFileSync(ROOT + 'examples/manifest.json', 'utf8'));
	const names = manifest.examples.map((e) => e.file);
	ok('3.0 the gallery lists examples', names.length > 0, String(names.length));
	dirs.forEach(function (dir) {
		names.forEach(function (n) {
			const f = ROOT + dir + '/' + n;
			if (!fs.existsSync(f)) { ok('3 ' + dir + '/' + n + ' exists', false); return; }
			const s = (JSON.parse(fs.readFileSync(f, 'utf8')).settings) || {};
			ok('3 ' + dir + '/' + n, s.textSize === 12 && s.symbolSize === 12 && s.linkWidth === 4,
				'text ' + s.textSize + ', symbol ' + s.symbolSize + ', link ' + s.linkWidth);
		});
	});
}

console.log('');
if (fails) {
	console.log(fails + ' FAILURE(S)');
	process.exit(1);
}
console.log('All customer bend checks passed.');
// init() in section 1 leaves the page's own intervals running; they are not this harness's subject.
process.exit(0);
