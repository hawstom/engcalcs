// A CLICK ON A PIPE CONNECTS THE CUSTOMER TO THAT PIPE, SQUARE, AT THE LEG THAT WAS CLICKED.
// Run with:  node dev/lpn-spike/customer-connect-geometry-harness.js
//
// Tom, 2026-10-04: *"Customer won't connect to a pipe under a certain geometry."* His screenshot:
// a customer above a main that runs left to right and then bends up to junction J-TF. He clicked
// the main straight below the customer and the service went to J-TF instead.
//
// The cause: customerConnectionAt() took the station as the customer's nearest point on the WHOLE
// polyline. When the pipe bends up toward the customer, the far end of the rising leg (J-TF) is
// nearer than the foot on the leg that was clicked, so the station came out as 1, the node.
// The pointer names which leg; the station is the foot of the perpendicular on THAT leg.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { loadLoopedNetwork, setUnitSet, setHitTarget, byId } = require('./lpn-dom-stub.js');
const Geom = global.EngCalcs.lpnGeom;

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\taddNode: addNode, addLink: addLink, buildDom: buildDom,\n" +
	"\t\tapplySaved: applySaved, applyView: applyView, isLatLonProject: isLatLonProject,\n" +
	"\t\tdocOrigin: docOrigin, nodeAt: nodeAt, linkById: linkById, linkPointList: linkPointList,\n" +
	"\t\tcustomerAttachPoint: customerAttachPoint, customerPoint: customerPoint,\n" +
	"\t\tcustomerT: customerT, customerLink: customerLink,\n" +
	"\t\tsetPendingMeter: setPendingMeter, setSelection: setSelection,\n" +
	"\t\tcustBox: function (id) { return custEls[id] && custEls[id].box; },\n" +
	"\t\tdragNow: function () { return drag ? { type: drag.type, id: drag.id } : null; },\n" +
	"\t\tapplyDrag: function () { if (drag && dragDirty) { applyDrag(); dragDirty = false; } },\n" +
	"\t\twirePointerEvents: wirePointerEvents, setMode: setMode,\n" +
	"\t\tworldToScreen: worldToScreen,\n" +
	"\t\tsetScale: function (s) { state.s = s; state.tx = 0; state.ty = 0; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
setUnitSet('us');
global.fetch = () => Promise.reject(new Error('no network in this harness'));
global.requestAnimationFrame = global.window.requestAnimationFrame = () => 0;
L.buildLayers();
L.seedDefaultInputs();
L.setScale(1);
L.wirePointerEvents();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function near(a, b, tol) { return Math.abs(a - b) <= tol; }
const svg = byId.lpn_canvas;
function fire(type, ev, target) {
	setHitTarget(target || null);
	(svg._listeners[type] || []).forEach(function (fn) { fn(Object.assign({ target: target || svg }, ev)); });
}
// Drag a customer's own dot from where it is to world point `to`, through the real handlers.
function dragCustomer(c, to) {
	const from = L.customerPoint(c), box = L.custBox(c.id);
	const ev = (x, y) => ({ pointerId: 4, clientX: x, clientY: y, pointerType: 'mouse', button: 0 });
	L.setMode('select');
	fire('pointerdown', ev(from.x, from.y), box);
	const dg = L.dragNow();
	fire('pointermove', ev((from.x + to.x) / 2, (from.y + to.y) / 2), box);
	L.applyDrag();
	fire('pointermove', ev(to.x, to.y), box);
	L.applyDrag();
	fire('pointerup', ev(to.x, to.y), box);
	return dg;
}
function click(p) {
	const ev = { pointerId: 3, clientX: p.x, clientY: p.y, pointerType: 'mouse', button: 0 };
	fire('pointermove', ev); fire('pointerdown', ev); fire('pointerup', ev);
}
// Place a customer at world point m, then click screen point s; return the customer made.
function place(m, s) {
	const doc = L.getDoc();
	const before = (doc.customers || []).length;
	L.setMode('add-meter');
	L.setPendingMeter({ x: m.x, y: m.y });
	click(s);
	L.setMode('select');
	return (doc.customers || []).length > before ? doc.customers[doc.customers.length - 1] : null;
}
function freshXY() {
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0; doc.customers = [];
}
// The foot of the perpendicular from m onto segment a-b, unclamped.
function foot(m, a, b) {
	const vx = b.x - a.x, vy = b.y - a.y, t = ((m.x - a.x) * vx + (m.y - a.y) * vy) / (vx * vx + vy * vy);
	return { x: a.x + vx * t, y: a.y + vy * t, t: t };
}

// Tom's screenshot, in screen pixels (y down): main from (0,290), bending at (233,327), up to
// J-TF at (252,242); the customer at (137,70). Nearest point on the whole pipe from the
// customer is J-TF (207 px), not the foot on the long leg (about 230 px).
const M = { x: 137, y: 70 };

console.log('\n--- 1. his geometry: a vertex-bearing main bending up toward the customer ---');
{
	freshXY();
	const a = L.addNode('junction', 0, 290);
	const jtf = L.addNode('junction', 252, 242);
	const main = L.addLink('pipe', a.id, jtf.id, [{ x: 233, y: 327 }]);
	L.buildDom();
	const f = foot(M, { x: 0, y: 290 }, { x: 233, y: 327 });
	ok('1.0 the foot falls well inside the clicked leg, and J-TF is nearer than it',
		f.t > 0.2 && f.t < 0.8 && Math.hypot(252 - M.x, 242 - M.y) < Math.hypot(f.x - M.x, f.y - M.y));
	// The click on the main straight below the customer (his red "No" line).
	const c = place(M, { x: 137, y: 290 + 37 * 137 / 233 });
	ok('1.1 a click on the main makes a customer', !!c);
	const at = c ? L.customerAttachPoint(c) : null;
	ok('1.2 ...served from that main', !!c && L.customerLink(c).id === main.id);
	ok('1.3 ...NOT at J-TF', !!c && L.customerT(c) !== 1, c && String(L.customerT(c)));
	ok('1.4 ...at the foot of the perpendicular on the clicked leg',
		!!at && near(at.x, f.x, 1e-6) && near(at.y, f.y, 1e-6),
		at ? JSON.stringify(at) + ' want ' + JSON.stringify(f) : 'none');
	ok('1.5 ...and the customer stays where it was put',
		!!c && near(L.customerPoint(c).x, M.x, 1e-6) && near(L.customerPoint(c).y, M.y, 1e-6),
		c && JSON.stringify(L.customerPoint(c)));
	// The node case: a click on J-TF still connects to J-TF.
	const c2 = place(M, { x: 254, y: 244 });
	ok('1.6 a click on J-TF connects exactly to J-TF',
		!!c2 && L.customerT(c2) === 1 && near(L.customerAttachPoint(c2).x, 252, 1e-9) &&
		near(L.customerAttachPoint(c2).y, 242, 1e-9), c2 && JSON.stringify(L.customerAttachPoint(c2)));
	// A click on the rising leg: the foot from M on that leg clamps to its J-TF end.
	const c3 = place(M, { x: 242, y: 285 });
	ok('1.7 a click on the rising leg lands on the end of that leg nearest the customer',
		!!c3 && L.customerLink(c3).id === main.id && L.customerT(c3) === 1, c3 && String(L.customerT(c3)));
}

console.log('\n--- 2. the same shape drawn as two pipes and a junction at the bend ---');
{
	freshXY();
	const a = L.addNode('junction', 0, 290);
	const b = L.addNode('junction', 233, 327);
	const jtf = L.addNode('junction', 252, 242);
	const p8 = L.addLink('pipe', a.id, b.id);
	L.addLink('pipe', b.id, jtf.id);
	L.buildDom();
	const f = foot(M, { x: 0, y: 290 }, { x: 233, y: 327 });
	const c = place(M, { x: 137, y: 290 + 37 * 137 / 233 });
	const at = c ? L.customerAttachPoint(c) : null;
	ok('2.1 a click on pipe 8 connects to pipe 8 at the perpendicular foot',
		!!c && L.customerLink(c).id === p8.id && near(at.x, f.x, 1e-6) && near(at.y, f.y, 1e-6),
		at ? L.customerLink(c).id + ' ' + JSON.stringify(at) : 'none');
	const c2 = place(M, { x: 254, y: 244 });
	ok('2.2 a click on J-TF connects to J-TF',
		!!c2 && near(L.customerAttachPoint(c2).x, 252, 1e-9) && near(L.customerAttachPoint(c2).y, 242, 1e-9),
		c2 && JSON.stringify(L.customerAttachPoint(c2)));
}

console.log('\n--- 3. a straight pipe is unchanged ---');
{
	freshXY();
	const a = L.addNode('junction', 100, 400);
	const b = L.addNode('junction', 600, 400);
	const p = L.addLink('pipe', a.id, b.id);
	L.buildDom();
	const c = place({ x: 300, y: 330 }, { x: 500, y: 400 });
	ok('3.1 square to the main at x = 300, wherever along it the click was',
		!!c && L.customerLink(c).id === p.id && near(L.customerAttachPoint(c).x, 300, 1e-6) &&
		near(L.customerAttachPoint(c).y, 400, 1e-6), c && JSON.stringify(L.customerAttachPoint(c)));
}

console.log('\n--- 4. dragging a customer on a bent pipe keeps it on its leg ---');
{
	freshXY();
	L.setScale(1);
	const a = L.addNode('junction', 0, 290);
	const jtf = L.addNode('junction', 252, 242);
	const main = L.addLink('pipe', a.id, jtf.id, [{ x: 233, y: 327 }]);
	L.buildDom();
	const A = { x: 0, y: 290 }, V = { x: 233, y: 327 }, T = { x: 252, y: 242 };
	const c = place(M, { x: 137, y: 290 + 37 * 137 / 233 });
	ok('4.0 the customer starts on the long leg', !!c && L.customerT(c) > 0 && L.customerT(c) < 1);
	// Along the long leg, still above it: J-TF is nearer (186) than the foot (about 240).
	const to1 = { x: 180, y: 70 }, f1 = foot(to1, A, V);
	ok('4.0b ...and at the drag end J-TF is nearer than the foot on the long leg',
		Math.hypot(T.x - to1.x, T.y - to1.y) < Math.hypot(f1.x - to1.x, f1.y - to1.y));
	const dg = dragCustomer(c, to1);
	ok('4.1 pressing the customer begins a customer drag', !!dg && dg.type === 'customer', dg && dg.type);
	const at1 = L.customerAttachPoint(c);
	ok('4.2 a drag along the long leg keeps the service on that leg, NOT at J-TF',
		L.customerT(c) !== 1 && near(at1.x, f1.x, 1e-6) && near(at1.y, f1.y, 1e-6),
		L.customerT(c) + ' ' + JSON.stringify(at1) + ' want ' + JSON.stringify(f1));
	ok('4.3 ...and the customer is where it was dragged',
		near(L.customerPoint(c).x, to1.x, 1e-6) && near(L.customerPoint(c).y, to1.y, 1e-6),
		JSON.stringify(L.customerPoint(c)));
	// Clearly beside the rising leg, its foot inside that leg and shorter: it may move there.
	const to2 = { x: 300, y: 285 }, f2 = foot(to2, V, T);
	const dg2 = dragCustomer(c, to2);
	const at2 = L.customerAttachPoint(c);
	ok('4.4 dragged clearly beside the rising leg, the service moves to that leg, square',
		!!dg2 && f2.t > 0 && f2.t < 1 && L.customerLink(c).id === main.id &&
		near(at2.x, f2.x, 1e-6) && near(at2.y, f2.y, 1e-6),
		JSON.stringify(at2) + ' want ' + JSON.stringify(f2));
}

console.log('\n--- 5. a geographic (lon/lat) project, the satellite case ---');
{
	const LAT = 38.1, LON = -122.56, D = 0.001;   // about 90 m per D east-west
	// His shape, scaled: a thousandth of a degree per 250 px.
	const g = (px, py) => ({ x: LON + px / 250 * D, y: LAT - py / 250 * D });
	const A = g(0, 290), V = g(233, 327), T = g(252, 242);
	L.applySaved({
		v: 4, project: { coords: 'geo', units: { lpn_u_length: 'ft' } },
		nodes: [{ id: 'A', type: 'junction', x: A.x, y: A.y, elev: 0 },
			{ id: 'JTF', type: 'junction', x: T.x, y: T.y, elev: 0 }],
		links: [{ id: '8', type: 'pipe', from: 'A', to: 'JTF', verts: [{ x: V.x, y: V.y }] }],
		customers: [], view: null
	});
	ok('5.0 the fixture installed as geographic', L.isLatLonProject());
	L.setScale(250 / D);   // the world origin sits at the network, so the screen is a plain scale of it
	const pts = L.linkPointList(L.linkById('8'));
	ok('5.0b the pipe has its bend', pts.length === 3, String(pts.length));
	// The customer straight above the long leg, in world units, at his proportions.
	const w0 = pts[0], w1 = pts[1], w2 = pts[2];
	const mWorld = { x: w0.x + (w1.x - w0.x) * 137 / 233, y: w2.y - (w0.y - w2.y) * 172 / 48 };
	const f = foot(mWorld, w0, w1);
	const clickWorld = { x: w0.x + (w1.x - w0.x) * 137 / 233, y: w0.y + (w1.y - w0.y) * 137 / 233 };
	const c = place(mWorld, L.worldToScreen(clickWorld.x, clickWorld.y));
	const at = c ? L.customerAttachPoint(c) : null;
	const tol = Math.abs(w1.x - w0.x) * 1e-6;
	ok('5.1 a click on the main connects to the main at the perpendicular foot, not J-TF',
		!!c && L.customerT(c) !== 1 && near(at.x, f.x, tol) && near(at.y, f.y, tol),
		at ? L.customerT(c) + ' ' + JSON.stringify(at) + ' want ' + JSON.stringify(f) : 'none');
	const sT = L.worldToScreen(w2.x, w2.y);
	const c2 = place(mWorld, { x: sT.x + 2, y: sT.y + 2 });
	ok('5.2 a click on J-TF connects to J-TF', !!c2 && L.customerT(c2) === 1,
		c2 && String(L.customerT(c2)));
}

console.log('');
if (fails) {
	console.log(fails + ' FAILURE(S)');
	process.exit(1);
}
console.log('All customer connect geometry checks passed.');
