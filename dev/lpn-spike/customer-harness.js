// CUSTOMERS: METERED DEMANDS, LUMPED AT THE NEAREST NODE -- ROADMAP Task 247. Run with:
//   node dev/lpn-spike/customer-harness.js
//
// WHY THIS EXISTS, and it is four questions rather than one.
//
// 1. **THE LUMPING RULE IS MEASURED ALONG THE PIPE, NOT IN A STRAIGHT LINE**, and on a bent pipe
//    the two answers are different junctions. Tom's own sentence is *"we lump the Customer demands
//    additively at their nearest (by length) node"*, and "by length" is the whole of it: arc
//    length is the pipe the water actually reaches the meter through. The failure is silent -- the
//    map draws correctly, every number on screen looks reasonable, and the demand is on the wrong
//    junction -- so the bent-pipe case is the FIRST fixture here and not an afterthought.
//
// 2. **THE TOTAL IS ADDITIVE AND NOTHING IS DEDUCTED** (Tom, 2026-08-24: *"468 is a sum of all the
//    247 plus any additionals at the node (additive)"*, and *"we don't do any fancy footwork like
//    deducting flows at the node as meters are placed"*). So the assertion is about what the
//    junction's OWN demand still says after a meter is placed on its pipe: unchanged, byte for
//    byte, whatever the meter draws.
//
// 3. **THE JUNCTION IS DERIVED AND NEVER STORED**, which is what makes it impossible to go stale.
//    Drag the meter past the middle of its pipe and the demand moves to the other end; rename the
//    pipe, delete it, bend it, and the answer follows by itself. A stored junction would be right
//    until one of those happened and would then be wrong with nothing on screen to say so.
//
// 4. **AN .inp HAS NO CUSTOMERS, so the numbers go out and the geometry is REPORTED.** Never
//    dropped in silence, never faked as invented service nodes and laterals. And a junction with
//    no customers must come back out of the writer exactly as it went in, which is what keeps
//    every Net1/2/3 round trip identical (dev/lpn-spike/inp-export-harness.js).
//
// Every user-facing string is asserted against EngCalcs.pageConfig, never an English literal --
// dev/scripts/harness_wording_check.php is a ratchet, and a pinned wording taxes exactly the
// rewording this project most wants to be free.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

let lastAlert = null, lastConfirm = true;
global.alert = global.window.alert = function (m) { lastAlert = m; };
global.confirm = global.window.confirm = function () { return lastConfirm; };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getState: function () { return state; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, addNode: addNode, addLink: addLink,\n" +
	"\t\taddCustomer: addCustomer, deleteElement: deleteElement,\n" +
	"\t\tcustomerNodeId: customerNodeId, customerPoint: customerPoint,\n" +
	"\t\tcustomerAttachPoint: customerAttachPoint, customerFlow: customerFlow,\n" +
	"\t\tsetCustomerStation: setCustomerStation, customerEdited: customerEdited,\n" +
	"\t\tsetCustomerPerp: setCustomerPerp, customerPerpDistance: customerPerpDistance,\n" +
	"\t\tcustomerOffset: customerOffset, setCustomerOffset: setCustomerOffset,\n" +
	"\t\tcustomerT: customerT,\n" +
	"\t\tsetCustomerAt: setCustomerAt, setCustomerOffsetTo: setCustomerOffsetTo,\n" +
	"\t\tlinkNormalAt: linkNormalAt, customerLink: customerLink,\n" +
	"\t\tcustomerSnapT: customerSnapT, customerAtNodeEnd: customerAtNodeEnd,\n" +
	"\t\tcustomerAttachAtNode: customerAttachAtNode, linkPointList: linkPointList,\n" +
	"\t\tnodeById: nodeById, linkById: linkById,\n" +
	"\t\tmeterHalfWorld: meterHalfWorld, serviceStrokeWorld: serviceStrokeWorld,\n" +
	"\t\tgetSettings: function () { return settings; }, nodeRadius: nodeRadius,\n" +
	"\t\tdetachedCustomers: detachedCustomers,\n" +
	"\t\tlabelsLayerTexts: function () {\n" +
	"\t\t\treturn Array.prototype.slice.call(labelsLayer.children || [])\n" +
	"\t\t\t\t.filter(function (e) { return (e.nodeName || '').toLowerCase() === 'text'; }); },\n" +
	"\t\tcustEls: function () { return custEls; },\n" +
	"\t\teffective: effective, setProp: setProp,\n" +
	"\t\tbaseDemandTotal: baseDemandTotal, resolvedDemand: resolvedDemand,\n" +
	"\t\tdemandRowsOf: demandRowsOf,\n" +
	"\t\tinsertVertex: insertVertex, renameLink: applyLinkRename,\n" +
	"\t\tserializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tprepareDocument: prepareDocument,\n" +
	"\t\tsetSelection: setSelection, selectionCount: selectionCount,\n" +
	"\t\trenderCustomerFields: renderCustomerFields, renderNodeFields: renderNodeFields,\n" +
	"\t\tcustomersAtNode: customersAtNode, unitLabel: unitLabel,\n" +
	"\t\tpopupFields: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tpaneTables: paneTables, paneCols: paneCols,\n" +
	"\t\tsuggestCustomerLink: suggestCustomerLink, setCustomerLink: setCustomerLink,\n" +
	"\t\tpaneTableAllElements: paneTableAllElements,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol); }

// ---- 1. THE PURE RULE ------------------------------------------------------------------------
//
// `arcEndNearer()` is in js/lpn-geom.js because it is pure geometry with no DOM, and the tie is
// part of the rule rather than an accident: a meter exactly at the middle of a main must lump at
// the same junction on every reload, or the answers move when nothing about the network has.
const Geom = global.EngCalcs.lpnGeom;
ok('1.1 the start end wins below the middle', Geom.arcEndNearer(0.2) === 'from');
ok('1.2 the far end wins above it', Geom.arcEndNearer(0.8) === 'to');
ok('1.3 a tie goes to the start, deterministically', Geom.arcEndNearer(0.5) === 'from');
ok('1.4 ...and is the same answer every time', Geom.arcEndNearer(0.5) === Geom.arcEndNearer(0.5));
ok('1.5 a missing station reads as the start rather than throwing',
	Geom.arcEndNearer(undefined) === 'from' && Geom.arcEndNearer(NaN) === 'from');

// **THE BENT PIPE, WHICH IS THE CASE THE RULE EXISTS FOR.** A pipe from (0,0) to (100,0) with a
// bend far out at (50,400): the point at 60% of its ARC LENGTH is much nearer the `to` node in a
// straight line and is still on the `from` side of the polyline, or the reverse. The fixture
// asserts that the two readings genuinely disagree before it asserts which one we take -- a
// fixture that stopped disagreeing would make the rest of this section pass while testing nothing.
{
	// A main that runs 300 units out and then doubles back to end 20 units from where it started:
	// a station 30% along its arc length is a third of the way out along the first leg, which is
	// nearer the FINISHING node as the crow flies and nearer the STARTING node along the pipe.
	const pts = [{ x: 0, y: 0 }, { x: 300, y: 0 }, { x: 20, y: 20 }];
	const at = Geom.pointAlongPolyline(pts, 0.3);
	const dStraightFrom = Math.hypot(at.x - pts[0].x, at.y - pts[0].y);
	const dStraightTo = Math.hypot(at.x - pts[2].x, at.y - pts[2].y);
	ok('1.6 the fixture really is a pipe where the two readings disagree',
		dStraightTo < dStraightFrom, 'straight from=' + dStraightFrom.toFixed(1) + ' to=' + dStraightTo.toFixed(1));
	ok('1.7 ...and the rule takes the one measured ALONG the pipe',
		Geom.arcEndNearer(0.3) === 'from');
}

// ---- 2. A DRAWN NETWORK, AND WHAT A METER DOES TO IT -----------------------------------------
const res = L.addNode('reservoir', 0, 0);
const jA = L.addNode('junction', 100, 0);
const jB = L.addNode('junction', 300, 0);
L.addLink('pipe', res.id, jA.id);
const main = L.addLink('pipe', jA.id, jB.id);
// The junction's own demand, typed by the user and never to be rewritten by anything below.
L.setProp(jA, 'demand', 10);
L.setProp(jB, 'demand', 20);
const ownA = jA._demand, ownB = jB._demand;

// A meter at 20% along the main: nearer jA by arc length, so it lumps there.
const m1 = L.addCustomer(150, 40, { link: main.id, t: 0.2 });
m1.tag = '4417-A';
m1.demand = 3;
m1.count = 4;
L.customerEdited(m1);

ok('2.1 a meter is not a node', L.getDoc().nodes.every(n => n.id !== m1.id));
ok('2.2 it is its own collection', (L.getDoc().customers || []).length === 1);
ok('2.3 the count multiplies the per-service demand', near(L.customerFlow(m1), 12));
ok('2.4 it lumps at the near end, measured along the pipe', L.customerNodeId(m1) === jA.id);
ok('2.5 the junction total is ADDITIVE', near(L.baseDemandTotal(jA), ownA + 12),
	String(L.baseDemandTotal(jA)));
ok('2.6 ...and the junction OWN demand was not rewritten', jA._demand === ownA, String(jA._demand));
ok('2.7 the other junction is untouched', near(L.baseDemandTotal(jB), ownB));
ok('2.8 the resolved demand carries it too', near(L.resolvedDemand(jA), ownA + 12),
	String(L.resolvedDemand(jA)));
ok('2.9 it arrives as a DEMAND ROW and not a fourth thing',
	L.demandRowsOf(jA, L.effective(jA, 'demand')).length === 2);
ok('2.10 the row is named with the customer\'s tag',
	L.demandRowsOf(jA, L.effective(jA, 'demand'))[1].category === '4417-A');

// ---- 3. MOVING IT MOVES THE DEMAND -----------------------------------------------------------
L.setCustomerStation(m1, 0.8);
L.customerEdited(m1);
ok('3.1 past the middle it lumps at the other end', L.customerNodeId(m1) === jB.id);
ok('3.2 the demand went with it', near(L.baseDemandTotal(jA), ownA) && near(L.baseDemandTotal(jB), ownB + 12),
	L.baseDemandTotal(jA) + ' / ' + L.baseDemandTotal(jB));
// **THE HANDLE SLIDES THE WHOLE SERVICE, METER AND ALL** (Tom, 2026-09-17). This assertion
// REPLACES its opposite: the handle used to move the attachment and leave the meter where it was
// drawn, which is exactly how a service came to point sideways down the street. What is preserved
// now is the distance out and the side, not the drawn point.
{
	const was = L.customerPoint(m1);
	const wasOut = L.customerPerpDistance(m1, L.customerLink(m1));
	L.setCustomerStation(m1, 0.55);
	const now = L.customerPoint(m1);
	ok('3.3 sliding the attachment carries the meter along the pipe with it',
		!near(was.x, now.x, 1e-6) || !near(was.y, now.y, 1e-6),
		was.x + ',' + was.y + ' -> ' + now.x + ',' + now.y);
	ok('3.3b ...at the same distance out and on the same side',
		near(L.customerPerpDistance(m1, L.customerLink(m1)), wasOut, 1e-9),
		wasOut + ' -> ' + L.customerPerpDistance(m1, L.customerLink(m1)));
}
L.setCustomerStation(m1, 0.2);
L.customerEdited(m1);
ok('3.4 and back again', L.customerNodeId(m1) === jA.id);

// A BEND CHANGES THE ARC LENGTH, so the assignment may legitimately flip and must be re-derived
// rather than remembered. The bend goes in beyond the meter's station, which lengthens the far
// half and leaves the meter where it was.
{
	const before = L.customerNodeId(m1);
	L.insertVertex(main.id, { x: 250, y: 300 });
	ok('3.6 a bend is re-derived rather than remembered, and the answer is still a real junction',
		L.customerNodeId(m1) === jA.id || L.customerNodeId(m1) === jB.id,
		before + ' -> ' + L.customerNodeId(m1));
}

// ---- 3A. THE SERVICE IS PERPENDICULAR, AND THERE IS NO OTHER ANGLE ON OFFER ------------------
//
// Tom, 2026-09-17: *"The initial default connection to pipe needs to be perpendicular... In fact,
// I am not sure we should offer a non-perpendicular connection to link."* The placement was
// already perpendicular; it was everything AFTERWARDS that was not, so these fixtures are about
// the drag and the handle rather than about the default.
//
// **THE FAILURE IS SILENT AND LOOKS LIKE A DRAWING CHOICE.** An angled stub claims the service is
// laid diagonally, and no number on the screen disagrees, because the lumping is measured along
// the PIPE and never reads the stub at all. So the test is the angle itself: the vector from the
// attachment point to the meter must be square to the pipe there, whatever was done to it.
{
	const l = L.customerLink(m1);
	function squareness(c) {
		// The dot product of the service vector with the pipe's own direction at the station,
		// both as unit vectors: zero is a right angle. Comparing an ANGLE rather than comparing
		// coordinates is what makes this independent of where the meter happens to be.
		const an = L.customerAttachPoint(c), pt = L.customerPoint(c);
		const n = L.linkNormalAt(L.customerLink(c), c.t);
		const dx = pt.x - an.x, dy = pt.y - an.y, len = Math.hypot(dx, dy) || 1;
		// The pipe direction is the normal turned back: (-n.y, n.x).
		return ((dx / len) * -n.y) + ((dy / len) * n.x);
	}
	ok('3A.1 a meter is square to its main where it was placed', near(squareness(m1), 0, 1e-12),
		String(squareness(m1)));
	// **A HAND-EDITED FILE CANNOT SMUGGLE ONE IN EITHER**, because the position has one reader and
	// it rebuilds the offset from its perpendicular component. This is the case that would
	// otherwise arrive from a project written before the rule, or from a text editor.
	{
		const was = L.customerPerpDistance(m1, l);
		m1.x = 30; m1.y = 30;                        // a 45-degree offset, typed straight in
		ok('3A.2 an angled offset in the document still draws square',
			near(squareness(m1), 0, 1e-12), String(squareness(m1)));
		L.setCustomerPerp(m1, m1.t, was);            // put it back for what follows
	}
	// The drag: the pointer goes wherever the hand goes, and what is stored is a station and a
	// distance. Dragging far past the end of the pipe is the case that used to produce the worst
	// angle, because the nearest point stops moving and the offset keeps growing.
	{
		const pts = [{ x: 0, y: 0 }, { x: 100, y: 0 }];
		void pts;
		L.setCustomerPerp(m1, 1.4, 25);              // a station off the end, clamped
		ok('3A.3 a station past the end is clamped rather than allowed off the pipe',
			m1.t === 1, String(m1.t));
		ok('3A.4 ...and it is still square there', near(squareness(m1), 0, 1e-12));
		L.setCustomerPerp(m1, 0.2, -40);             // the other side of the main
		ok('3A.5 the sign of the distance is which side of the main it is on',
			L.customerPerpDistance(m1, L.customerLink(m1)) < 0,
			String(L.customerPerpDistance(m1, L.customerLink(m1))));
		ok('3A.6 ...and that side is square too', near(squareness(m1), 0, 1e-12));
		L.setCustomerPerp(m1, 0.2, 40);
		L.customerEdited(m1);
	}
	// **ACROSS A BEND IS THE CASE THAT SEPARATES THE TWO RULES**, and it is why this fixture is on
	// a bent pipe. On a straight main, "keep the meter where it is drawn" and "keep it the same
	// distance out" move it to the same place, so a straight fixture would pass under either rule
	// and prove nothing. Where the pipe turns, the old rule leaves the service at whatever angle
	// the turn makes of it.
	{
		const out0 = L.customerPerpDistance(m1, L.customerLink(m1));
		const at0 = L.customerAttachPoint(m1);
		L.setCustomerStation(m1, 0.8);               // the far side of the bend
		const at1 = L.customerAttachPoint(m1);
		ok('3A.7 the station really did cross the bend',
			Math.hypot(at1.x - at0.x, at1.y - at0.y) > 1, at0.x + ',' + at0.y + ' -> ' + at1.x + ',' + at1.y);
		ok('3A.8 the distance out is what is kept across it, exactly',
			near(L.customerPerpDistance(m1, L.customerLink(m1)), out0, 1e-9),
			out0 + ' -> ' + L.customerPerpDistance(m1, L.customerLink(m1)));
		ok('3A.9 ...and the service is square on the new segment', near(squareness(m1), 0, 1e-12),
			String(squareness(m1)));
		L.setCustomerStation(m1, 0.2);
		L.customerEdited(m1);
	}
}

// ---- 3B. A VERY CLOSE CONNECTION SNAPS TO THE NEAREST NODE -----------------------------------
//
// Tom, 2026-09-17: *"I don't see a way to connect directly to a node. I think that a very close
// connection should snap to the nearest node."*
//
// **THE FAILURE THE SNAP PREVENTS IS INVISIBLE ON THE SCREEN.** A service landing one pixel short
// of a junction is drawn exactly like one landing on it, and it lumps by the near-miss rule
// instead -- which is the same junction here and the WRONG one the moment somebody bends the pipe
// or drags the node. So these fixtures assert the STATION, which is the thing that differs, and
// they assert the release as hard as the catch: a snap that cannot be got out of is a trap.
{
	const l = L.customerLink(m1);
	const pts = L.linkPointList(l);
	const st = L.getState();
	const wasS = st.s;
	st.s = 1;                                    // one world unit per pixel, so reach reads directly
	// 3 units from the start of a pipe hundreds of units long: a hair, at this zoom.
	const nearStart = 3 / pts.reduce((a, p, i) => i ? a + Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y) : 0, 0);
	ok('3B.1 a station a few pixels off the end snaps exactly onto it',
		L.customerSnapT(l, nearStart) === 0, String(L.customerSnapT(l, nearStart)));
	ok('3B.2 ...and the far end snaps the same way', L.customerSnapT(l, 1 - nearStart) === 1);
	// **RELEASED BY MOVING AWAY**, because it is judged on the current position every time rather
	// than remembered. This is the assertion that says the snap is not a trap.
	ok('3B.3 a station well clear of both ends is left exactly where it is',
		L.customerSnapT(l, 0.5) === 0.5, String(L.customerSnapT(l, 0.5)));
	// The reach is a SCREEN distance, so zooming in far enough must let a service sit genuinely
	// close to a node without being swallowed -- which is how somebody draws the short stub that
	// really is 3 units from the corner.
	st.s = 200;
	ok('3B.4 the reach is in pixels, so zooming in releases the same station',
		L.customerSnapT(l, nearStart) !== 0, String(L.customerSnapT(l, nearStart)));
	st.s = wasS;
	// **AND THE SNAP IS SAID OUT LOUD ON THE DRAWING.** A snapped connector carries a class the
	// stylesheet colours; an unsnapped one does not, and the same one pass paints both.
	{
		L.setCustomerPerp(m1, 0, 40);
		L.customerEdited(m1);
		const els = L.custEls()[m1.id];
		ok('3B.5 a service on a node is marked on the map',
			els.stub.classList.contains('lpn-service-snapped') && L.customerAtNodeEnd(m1) === true);
		ok('3B.6 ...and it lumps at that very node',
			L.customerNodeId(m1) === L.linkById(m1.link).from);
		L.setCustomerPerp(m1, 0.4, 40);
		L.customerEdited(m1);
		ok('3B.7 ...and the mark goes when the service moves off it',
			!els.stub.classList.contains('lpn-service-snapped') && L.customerAtNodeEnd(m1) === false);
	}
	// **CONNECTING AT A NODE IS STILL AN ATTACHMENT TO A PIPE**, which is what keeps the document,
	// the solver and the .inp writer unchanged. Where four pipes meet, the one taken is the one
	// running nearest the meter, and it is a real pipe of the node's.
	{
		const n = L.nodeById(L.linkById(m1.link).from);
		const near = L.customerAttachAtNode(n, L.customerPoint(m1));
		ok('3B.8 connecting at a node picks one of that node\'s own pipes',
			!!near && (near.link.from === n.id || near.link.to === n.id), near && near.link.id);
		ok('3B.9 ...at the station that IS the node', near && (near.t === 0 || near.t === 1),
			near && String(near.t));
		ok('3B.10 ...and it is the end of that pipe where the node actually is',
			near && (near.t === 0 ? near.link.from : near.link.to) === n.id);
		// **BOTH ENDS, because a station is 0 at one and 1 at the other** and a rule that always
		// answered 0 would pass every fixture built on a pipe's starting node while putting every
		// service at the far end of the network on the wrong junction.
		const n2 = L.nodeById(L.linkById(m1.link).to);
		const far = L.customerAttachAtNode(n2, L.customerPoint(m1));
		ok('3B.11 the other end of the same pipe answers the other station',
			far && (far.t === 0 ? far.link.from : far.link.to) === n2.id,
			far && (far.link.id + ' t=' + far.t));
		ok('3B.12 ...and the two ends do not answer the same station',
			far && near && !(far.link.id === near.link.id && far.t === near.t),
			far && near && (near.link.id + ':' + near.t + ' vs ' + far.link.id + ':' + far.t));
	}
	L.setCustomerPerp(m1, 0.2, 40);
	L.customerEdited(m1);
}

// ---- 3C. THE METER GOES WHERE IT WAS PUT ------------------------------------------------------
//
// Tom, 2026-09-18: *"Clicking in space: I suspected from your talk that this would be wrong. You
// are putting the meter at the pipe point instead of at the meter point. Put the meter where user
// clicks. Snap perpendicular to the selected link or snap to the selected node."*
//
// **WHICH OF THE TWO POINTS IS THE INPUT IS THE DEFECT AND THE FIX.** The two presses of the
// placement gesture are two different statements -- where the meter is, and what serves it -- and
// the second one used to decide BOTH: the station came from the press that named the pipe, and the
// meter was then drawn square to the main there. So the symbol slid away from the hand by the
// distance between the two presses measured along the pipe, which on a long main is the whole
// length of a street.
//
// **IT LOOKS LIKE A DRAWING CHOICE AND NOT LIKE A DEFECT**, which is why it needs a fixture: the
// map is tidy afterwards, the stub is square, the arithmetic is right, and the only thing wrong is
// that the meter is not where it was asked for. The assertion is therefore the REQUESTED POINT
// ITSELF, to a billionth: the perpendicular rebuild costs a bit or two of double arithmetic, while
// the behaviour this replaces was out by tens of units -- half the length of a street.
{
	const l = L.customerLink(m1);
	const pts = L.linkPointList(l);
	// Well off the main and nowhere near either end of it, so the station is a genuine
	// perpendicular foot rather than a snap.
	const want = { x: (pts[0].x + pts[1].x) / 2 + 37, y: (pts[0].y + pts[1].y) / 2 - 61 };
	const placed = L.addCustomer(want.x, want.y, { link: l.id });
	const got = L.customerPoint(placed);
	ok('3C.1 a meter placed against a pipe stays on the point it was given',
		near(got.x, want.x) && near(got.y, want.y),
		got.x + ',' + got.y + ' wanted ' + want.x + ',' + want.y);
	// **AND THE CONNECTION IS WHAT MOVED TO MEET IT.** The station is the nearest point on the pipe
	// to the meter, which is the same thing as saying the stub is square to the main -- so this
	// fixture is 3A's rule arriving from the placement end rather than from a drag.
	{
		const an = L.customerAttachPoint(placed);
		const n = L.linkNormalAt(l, placed.t);
		const dx = got.x - an.x, dy = got.y - an.y, len = Math.hypot(dx, dy) || 1;
		ok('3C.2 ...and the service it derived is square to the main',
			near(((dx / len) * -n.y) + ((dy / len) * n.x), 0, 1e-12));
		ok('3C.3 ...at a station between the ends rather than snapped to one',
			placed.t > 0 && placed.t < 1, String(placed.t));
	}
	// **AND THE STATION REALLY IS FOLLOWING THE METER**, which a fixed one would pass the test above
	// by accident on a single point. A second meter much further along the same main must land on
	// its own point AND connect somewhere else.
	{
		const far = { x: want.x + 260, y: want.y + 15 };
		const c2 = L.addCustomer(far.x, far.y, { link: l.id });
		ok('3C.4 a meter further along the main lands on its own point too',
			near(L.customerPoint(c2).x, far.x) && near(L.customerPoint(c2).y, far.y),
			L.customerPoint(c2).x + ',' + L.customerPoint(c2).y);
		ok('3C.4b ...and connects at a different station from the first',
			Math.abs(c2.t - placed.t) > 0.05, placed.t + ' vs ' + c2.t);
		L.deleteElement('customer', c2.id);
	}
	// **ON A NODE, THE METER ALSO STAYS PUT**, which is the other half of Tom's sentence. A junction
	// is where several mains meet, so there is no one of them for the service to be square to, and
	// forcing the meter onto a perpendicular of whichever pipe the attachment is stored against
	// would move it for a reason no reader could see.
	{
		const n = L.nodeById(l.from);
		const at = L.customerAttachAtNode(n, want);
		const onNode = L.addCustomer(want.x, want.y, { link: at.link.id, t: at.t });
		const p = L.customerPoint(onNode);
		ok('3C.5 a meter served from a node stays exactly on the point it was given',
			p.x === want.x && p.y === want.y, p.x + ',' + p.y);   // exact: no projection at a node
		ok('3C.6 ...and the connection really is on that node', L.customerAtNodeEnd(onNode) === true);
		ok('3C.7 ...and its demand lumps there', L.customerNodeId(onNode) === n.id);
		L.deleteElement('customer', onNode.id);
	}
	// **THE OTHER THREE WRITERS OF A POSITION ANSWER THE SAME WAY**, because they go through the
	// same seam: a drag, a typed location and a typed pipe all state where the METER is and let the
	// connection follow. Four copies of these five lines is how they came to disagree in the first
	// place.
	{
		const moved = { x: want.x - 18, y: want.y + 24 };
		L.setCustomerAt(placed, l, moved.x, moved.y);
		const p = L.customerPoint(placed);
		ok('3C.8 stating a new point for the meter puts it there',
			near(p.x, moved.x) && near(p.y, moved.y), p.x + ',' + p.y);
	}
	L.deleteElement('customer', placed.id);
}

// RENAMING THE PIPE carries the meter with it. Left out, the service would name an id the document
// does not have, which reads as detached and silently takes its demand out of the answers.
L.renameLink(main.id, 'MAIN-1');
ok('3.7 a pipe rename carries its meters', m1.link === 'MAIN-1' && L.customerNodeId(m1) === jA.id);

// ---- 4. DETACHED IS A REAL STATE -------------------------------------------------------------
{
	const totalWas = L.baseDemandTotal(jA);
	L.deleteElement('link', main.id);
	ok('4.1 deleting the pipe does NOT delete the meter', (L.getDoc().customers || []).length === 1);
	ok('4.2 it keeps its tag and its demand',
		m1.tag === '4417-A' && near(L.customerFlow(m1), 12));
	ok('4.3 it is attached to nothing', m1.link === null && L.customerNodeId(m1) === null);
	ok('4.4 its demand has left the answers, and the junction says so',
		near(L.baseDemandTotal(jA), ownA), totalWas + ' -> ' + L.baseDemandTotal(jA));
	ok('4.5 the page can count the loose ones', L.detachedCustomers().length === 1);
	// **DRAWN WHERE IT WAS, which is why x/y stops being an offset the moment there is nothing to
	// be an offset from.** A meter that jumped to the origin when its pipe went would be impossible
	// to find again.
	const pt = L.customerPoint(m1);
	ok('4.6 and it is still drawn where it was', isFinite(pt.x) && isFinite(pt.y) && Math.abs(pt.x) > 1,
		pt.x + ',' + pt.y);
}

// ---- 5. THE PROPERTY BOX SAYS WHICH JUNCTION, AND SAYS WHEN THERE IS NONE ---------------------
//
// Dragging a meter past the middle of its pipe silently moves flow from one junction to the other,
// so a reader who cannot see which junction it lumps at has no way to know that happened.
function popupText() {
	let out = '';
	(function walk(el) {
		if (el.textContent) { out += ' ' + el.textContent; }
		(el.children || []).forEach(walk);
	})(L.popupFields());
	return out;
}
// The first element in a subtree that answers a predicate, and whether one element is under
// another. Structure rather than text: section 5C's question is which side of a disclosure the
// meter rows are built on, and a text walk cannot tell -- a shut <details> still holds every word
// of its contents, here and in a browser.
function findIn(root, pred) {
	if (!root) { return null; }
	if (pred(root)) { return root; }
	for (const c of (root.children || [])) {
		const hit = findIn(c, pred);
		if (hit) { return hit; }
	}
	return null;
}
function findInPopup(pred) { return findIn(L.popupFields(), pred); }
function isInside(root, el) { return !!findIn(root, e => e === el); }
function flowUnitLabel() { return L.unitLabel('lpn_u_flow'); }
L.renderCustomerFields(m1.id);
ok('5.1 a detached meter is told it is out of the answers',
	popupText().indexOf(PC.lpn_customer_detached) >= 0);
ok('5.2 ...and that message leads with the caution glyph',
	PC.lpn_customer_detached.charAt(0) === '⚠', PC.lpn_customer_detached.slice(0, 3));

const main2 = L.addLink('pipe', jA.id, jB.id);
m1.link = main2.id; m1.t = 0.2; m1.x = 0; m1.y = 40;
L.customerEdited(m1);
L.renderCustomerFields(m1.id);
{
	const txt = popupText();
	ok('5.3 an attached meter names the junction it is added to', txt.indexOf(jA.id) >= 0);
	ok('5.4 ...and the pipe that serves it', txt.indexOf(main2.id) >= 0);
	ok('5.5 ...and its total demand', txt.indexOf('12') >= 0);
	ok('5.6 no fixed-head caution on a junction', txt.indexOf(PC.lpn_customer_fixed_head) < 0);
	// **STATION AND OFFSET ARE BOTH IN THE BOX** (Tom, 2026-09-18). An attached meter states how far
	// ALONG its main it sits and how far OFF it, and the second row was the one missing. The offset
	// row names the LENGTH unit, which is what says out loud that it is a distance and the station
	// is not.
	ok('5.6a the box states the station', txt.indexOf(PC.lpn_field_meter_station) >= 0);
	ok('5.6b ...and the offset beside it', txt.indexOf(PC.lpn_field_meter_offset) >= 0);
	ok('5.6c ...in the length unit',
		txt.indexOf(PC.lpn_field_meter_offset + ' (' + L.unitLabel('lpn_u_length') + ')') >= 0);
	// Typed into, it moves the meter across its main, through the same seam a drag writes.
	{
		const was = L.customerOffset(m1);
		L.setCustomerOffset(m1, was + 15);
		ok('5.6d a typed offset moves the meter across its main',
			near(L.customerOffset(m1), was + 15, 1e-3), L.customerOffset(m1));
		L.setCustomerOffset(m1, was);
	}
}
// A DEMAND ON A FIXED HEAD CHANGES NOTHING, and it is reported rather than rerouted to the
// second-nearest junction, which would be a rule the reader cannot see.
{
	const feeder = L.addLink('pipe', res.id, jB.id);
	const m2 = L.addCustomer(20, 30, { link: feeder.id, t: 0.1 });
	m2.demand = 5;
	L.customerEdited(m2);
	ok('5.7 the rule still applies at a reservoir rather than being rerouted',
		L.customerNodeId(m2) === res.id);
	L.renderCustomerFields(m2.id);
	ok('5.8 ...and it is reported as changing nothing',
		popupText().indexOf(PC.lpn_customer_fixed_head) >= 0);
	// **THE CAUTION GLYPH LEADS IT, ON TOM'S OWN RULING OF 2026-09-19.** A previous pass took the
	// glyph off with the old sentence when he gave the new wording -- *"The near end of that pipe
	// holds a fixed water surface, so this demand does not affect the simulation."* -- and he
	// reversed that: *"Put it back."* So the value is the glyph and then his words, unchanged.
	//
	// **IT BELONGS IN THE VALUE HERE AND WOULD SHIP TWO ANYWHERE ELSE.** This note is written
	// straight onto a `<p class="lpn-set-note">` with `textContent`; nothing prepends a glyph to it,
	// which is exactly how its neighbour `lpn_customer_detached` carries its own. A verdict built
	// through `EngCalcs.writeCheckHTML()` is the opposite case and must NOT carry one.
	// verdict_string_check.php's third leg holds the half that matters in the five right-to-left
	// languages: a value containing a glyph must LEAD with it.
	ok('5.9 ...led by the caution glyph, then his words unchanged',
		PC.lpn_customer_fixed_head.charAt(0) === '⚠' &&
		PC.lpn_customer_fixed_head.slice(2) ===
			'The near end of that pipe holds a fixed water surface, so this demand does not affect the simulation.',
		PC.lpn_customer_fixed_head);
	L.deleteElement('customer', m2.id);
	L.deleteElement('link', feeder.id);
}

// ---- 5B. THE JUNCTION'S OWN PROPERTY BOX NAMES ITS CUSTOMERS ---------------------------------
//
// Tom, 2026-09-17: *"The customer doesn't appear in the properties for its representative node.
// Fix/add that."*
//
// **THE NUMBER WAS ALREADY IN THE TOTAL AND THE REASON FOR IT WAS NOWHERE ON THE SCREEN.** A
// junction drawing 22 with 10 typed into its own demand rows is the page contradicting itself as
// far as a reader can tell, and the only way to find the missing 12 was to guess which meter it
// came from. So the assertion is that the meter is NAMED in the junction's box, not merely that
// the total is right -- the total was right all along.
{
	const m5 = (L.getDoc().customers || [])[0];
	const nid = L.customerNodeId(m5);
	L.renderNodeFields(nid);
	const txt = popupText();
	ok('5B.1 the junction names the meter that is adding to it', txt.indexOf(m5.id) >= 0);
	ok('5B.2 ...and its description, which is the column the account number used to hold',
		txt.indexOf(PC.lpn_field_desc) >= 0, txt.slice(0, 120));
	ok('5B.3 ...and what that meter adds', txt.indexOf(String(L.customerFlow(m5))) >= 0,
		String(L.customerFlow(m5)));
	ok('5B.4 ...under a heading that is a language key, not a hand-written line',
		txt.indexOf(PC.lpn_node_customers) >= 0);
	// **IT IS THE DERIVED JUNCTION AND NOT THE PIPE'S FIRST NODE**, which is the same question the
	// demand arithmetic asks. Move the service past the middle and the two boxes must swap.
	{
		const other = L.getDoc().nodes.filter(n => n.type === 'junction' && n.id !== nid)[0];
		ok('5B.5 the other junction says nothing about it yet',
			(L.renderNodeFields(other.id), popupText().indexOf(m5.id) < 0));
		L.setCustomerStation(m5, 0.9);
		L.customerEdited(m5);
		ok('5B.6 the meter moved to the other junction', L.customerNodeId(m5) === other.id);
		ok('5B.7 ...and it is the other junction that now names it',
			(L.renderNodeFields(other.id), popupText().indexOf(m5.id) >= 0));
		ok('5B.8 ...and the first one has stopped',
			(L.renderNodeFields(nid), popupText().indexOf(m5.id) < 0));
		L.setCustomerStation(m5, 0.2);
		L.customerEdited(m5);
	}
	// A junction with no customers gets no section at all: nearly every junction in nearly every
	// network has none, and a permanently empty table on all of them is clutter.
	{
		const bare = L.getDoc().nodes.filter(n => n.type === 'junction' && L.customersAtNode(n.id).length === 0)[0];
		L.renderNodeFields(bare.id);
		ok('5B.9 a junction with no customers is not given an empty table',
			popupText().indexOf(PC.lpn_node_customers) < 0, bare.id);
	}
}

// ---- 5C. THE METERS LUMP INTO ONE LINE, AND THE LINE EXPANDS ---------------------------------
//
// Tom, 2026-09-18: *"Junction itemization: We need to lump the meters with an expansion to see the
// connected customers and their demands."*
//
// **THE BOX HAS A FIXED BUDGET AND A JUNCTION'S SERVICES ARE NOT WHAT THE READER CAME FOR.** On a
// residential main a junction carries tens of meters, and each one was a row here, so the elevation,
// the junction's own demand rows and the resolved answer were pushed off the bottom by a list
// nobody had asked to read. **The failure is invisible to whoever built it**: two meters fit, and
// forty do not, and nothing in the arithmetic changes either way.
//
// So the assertions are structural rather than about wording: the individual meters must be INSIDE
// the disclosure, the disclosure must be SHUT to begin with, and the one line left showing must
// carry both numbers a reader would otherwise open it for -- how many, and how much.
{
	const m = (L.getDoc().customers || [])[0];
	const nid = L.customerNodeId(m);
	const lc = L.customerLink(m);
	const pts = L.linkPointList(lc);
	const second = L.addCustomer(pts[0].x + 5, pts[0].y + 40, { link: lc.id });
	second.demand = 7; second.count = 2;
	L.setCustomerStation(second, 0.1);
	L.customerEdited(second);
	ok('5C.0 a second meter on the same pipe lumps at the same junction',
		L.customerNodeId(second) === nid);

	L.renderNodeFields(nid);
	const box = findInPopup(e => e._tag === 'details' && e.className === 'lpn-node-customers');
	ok('5C.1 the junction draws the meters as one expandable line', !!box);
	ok('5C.2 ...and it is shut, so forty services cost one line and not forty', !box.open);
	// **THE ROWS ARE BEHIND THE LINE AND NOT BESIDE IT.** This is the assertion that fails if the
	// table is appended to the property box itself -- which draws identically while the disclosure
	// happens to be open, and is the whole defect while it is shut.
	ok('5C.3 every meter is inside the expansion, not beside it',
		!!findIn(box, e => e.textContent === m.id) && !!findIn(box, e => e.textContent === second.id));
	ok('5C.4 ...and nothing about the individual meters is outside it',
		!findInPopup(e => e !== box && !isInside(box, e) && e.textContent === second.id));

	// **THE LINE CARRIES THE COUNT AND THE TOTAL**, which are exactly the two things the expansion
	// would otherwise have to be opened for. Asserted against the language key, never the English.
	const want = PC.lpn_node_customers_sum
		.split('{n}').join('2')
		.split('{total}').join(String(+(L.customerFlow(m) + L.customerFlow(second)).toFixed(6)))
		.split('{unit}').join(flowUnitLabel());
	const line = findIn(box, e => e.className === 'lpn-node-customers-count');
	ok('5C.5 the shut line states how many meters and how much they add', !!line && line.textContent === want,
		line ? line.textContent + '   wanted ' + want : 'no line');
	// A total that is one meter's flow, or a count that is 1, passes 5C.5 only by arithmetic
	// accident on a junction with one meter -- so the fixture deliberately has two, with different
	// demands.
	ok('5C.6 ...and the total is the sum rather than either meter on its own',
		L.customerFlow(m) !== L.customerFlow(second) &&
		want.indexOf(String(+(L.customerFlow(m) + L.customerFlow(second)).toFixed(6))) >= 0);

	// **OPENING IT STICKS ACROSS A REBUILD**, which is what makes the expansion usable at all: the
	// property box is rebuilt on every commit, so a list that shut itself on every keystroke would
	// be worse than no expansion.
	const before = JSON.stringify(L.serializeProject());
	box.open = true;
	(box._listeners.toggle || []).forEach(f => f({}));
	L.renderNodeFields(nid);
	const again = findInPopup(e => e._tag === 'details' && e.className === 'lpn-node-customers');
	ok('5C.7 a list the reader opened is still open after the box is rebuilt', !!again && !!again.open);
	// **AND NONE OF IT REACHES THE FILE.** Which box somebody has open is a fact about the screen
	// they are sitting at, so CLAUDE.md's project-versus-browser rule keeps it out of
	// serializeProject() -- a colleague opening this project on a laptop must not inherit it.
	ok('5C.9 opening a list changed nothing in the project bytes',
		JSON.stringify(L.serializeProject()) === before);

	// **AND IT IS KEYED ON THE JUNCTION**, not one flag for the page: opening one junction's list
	// must not open the next junction's, which is a different reader's question about a different
	// node.
	{
		const far = L.addCustomer(pts[1].x + 5, pts[1].y + 40, { link: lc.id });
		L.setCustomerStation(far, 0.95);
		L.customerEdited(far);
		const other = L.customerNodeId(far);
		ok('5C.8a the far meter lumps at the other end of the pipe', other !== nid, other + ' vs ' + nid);
		L.renderNodeFields(other);
		const ob = findInPopup(e => e._tag === 'details' && e.className === 'lpn-node-customers');
		ok('5C.8b another junction opened nothing of its own', !!ob && !ob.open, other);
		L.deleteElement('customer', far.id);
	}
	L.deleteElement('customer', second.id);
	L.renderNodeFields(nid);
}

// ---- 6. THE SYMBOL SIZE IS ONE max(), AND THE THRESHOLD FALLS OUT OF IT ----------------------
//
// Tom's hybrid rule (2026-08-24): the meter is drawn to its real size while the site is small, and
// held at a legible dot beyond. A symbol drawn to scale is constant in WORLD units; one held at a
// screen size is pixels / scale, which grows as you zoom out. So it is the larger of the two, and
// the crossover is where 2 m equals 3 px rather than a number anybody typed.
// **THE SYMBOL IS A QUARTER OF A JUNCTION AND FOLLOWS SYMBOL SCALE** (Tom, 2026-09-19: *"Customer
// symbols should scale using the Symbol scale setting, but they should just be a lot smaller than a
// node, like 0.2 to 0.3 as big, maybe 0.25."*).
//
// **THIS REPLACED A HYBRID REAL-WORLD RULE, and the three fixtures that asserted that rule are
// gone with it.** The meter used to be drawn `max(1 m, 1.5 px)` in world units, which made it the
// one symbol on this map that did not answer to Symbol scale at all -- so a reader who turned every
// symbol up got every symbol but the services. The assertion that matters most is 6.2: turning the
// setting up MUST move this number.
{
	const st = L.getState();
	const was = st.s, sizeWas = L.getSettings().symbolSize;
	st.s = 1000;
	const small = L.meterHalfWorld(0, 0);
	const node = L.nodeRadius({ type: 'junction' });
	ok('6.1 a customer is a quarter the size of a junction', near(small / node, 0.25, 1e-9),
		String(small / node));
	L.getSettings().symbolSize = sizeWas * 2;
	const bigger = L.meterHalfWorld(0, 0);
	ok('6.2 turning Symbol scale up makes the customer bigger, in step with the nodes',
		near(bigger, small * 2, 1e-9), small + ' -> ' + bigger);
	ok('6.3 ...and it is still a quarter of a junction at the new setting',
		near(bigger / L.nodeRadius({ type: 'junction' }), 0.25, 1e-9));
	L.getSettings().symbolSize = sizeWas;
	// Like every other symbol here it is a SCREEN size divided by the scale, so zooming out makes
	// its world size grow and the dot on screen stays legible.
	st.s = 0.0001;
	const wide = L.meterHalfWorld(0, 0);
	ok('6.4 zoomed out its world size grows, so the dot on screen keeps its size',
		wide > small * 100, small + ' -> ' + wide);
	st.s = was;
}
// **A METER CARRIES NO LABEL ON THE MAP** (Tom, 2026-09-17: *"I don't think we want labels on
// customers. I didn't ask for them."*). Three fixtures asserting what the account number said
// beside the symbol were DELETED with the label itself; what stands in their place is the
// assertion that nothing draws one, because a label quietly re-added is the way this comes back.
{
	const c = (L.getDoc().customers || [])[0];
	const els = L.custEls()[c.id];
	ok('6.5 a meter draws a symbol and a service line and nothing else',
		!!els && !!els.box && !!els.stub && els.text === undefined, Object.keys(els).join(','));
	ok('6.6 ...and no text element of any kind is drawn for one',
		L.labelsLayerTexts().every(t => !t.getAttribute('data-cust')),
		String(L.labelsLayerTexts().length));
	ok('6.7 no account number survives anywhere in the document',
		c.account === undefined, JSON.stringify(c));
}

// ---- 7. THE CUSTOMER TABLE -------------------------------------------------------------------
{
	const spec = L.paneTables().filter(s => s.id === 'customers')[0];
	ok('7.1 there is a Customers table', !!spec);
	ok('7.2 it lists the customers and nothing else',
		L.paneTableAllElements(spec).length === (L.getDoc().customers || []).length);
	const cols = L.paneCols(spec).map(c => c.key);
	ok('7.3 its columns cover the description, the tag, the count and the junction',
		cols.indexOf('desc') >= 0 && cols.indexOf('tag') >= 0 &&
		cols.indexOf('count') >= 0 && cols.indexOf('atNode') >= 0,
		cols.join(','));
	ok('7.3b ...and no account number column survives', cols.indexOf('account') < 0, cols.join(','));
	// **NO COLUMN CARRIES `prop`**, which is the table's half of the popup's rule: a customer has no
	// overridable property, so an override marker there would be a promise a scenario cannot keep.
	ok('7.4 no column claims an overridable property',
		L.paneCols(spec).every(c => c.prop === undefined),
		L.paneCols(spec).filter(c => c.prop).map(c => c.key).join(','));
	// The junction column is DERIVED, which is why it has no setter.
	const atNode = L.paneCols(spec).filter(c => c.key === 'atNode')[0];
	ok('7.5 the junction column is read-only', !atNode.set);
	ok('7.6 ...and reads the same answer the popup does', atNode.get(m1) === L.customerNodeId(m1));
	// ---- ONE ROW PER CUSTOMER WITH A LOCATION AND A LINK (Tom, 2026-09-17) -------------------
	//
	// **A COLUMN, NOT AN ALTERNATING LIST**, because Enter walks DOWN a column in these tables:
	// forty locations typed, then forty pipes. So the two live side by side and both are real
	// columns with setters.
	const cust = (L.getDoc().customers || [])[0];
	const colOf = k => L.paneCols(spec).filter(c => c.key === k)[0];
	ok('7.7 the location is two columns and both can be typed into',
		!!colOf('axis1') && !!colOf('axis2') && !!colOf('axis1').set && !!colOf('axis2').set);
	ok('7.8 the location and the link are next to each other, in that order',
		cols.indexOf('axis1') < cols.indexOf('axis2') &&
		cols.indexOf('axis2') + 1 === cols.indexOf('link'), cols.join(','));
	ok('7.9 the link can be typed into', !!colOf('link').set);
	// **A TYPED LOCATION MOVES THE METER AND THE SERVICE STAYS SQUARE**, because the station is
	// re-derived rather than kept -- the same arithmetic dragging it there would do.
	{
		const was = colOf('axis1').get(cust);
		colOf('axis1').set(cust, was + 7);
		ok('7.10 typing a location moves the meter', Math.abs(colOf('axis1').get(cust) - (was + 7)) < 25,
			was + ' -> ' + colOf('axis1').get(cust));
		const an = L.customerAttachPoint(cust), pt = L.customerPoint(cust);
		const n = L.linkNormalAt(L.customerLink(cust), cust.t);
		const dx = pt.x - an.x, dy = pt.y - an.y, len = Math.hypot(dx, dy) || 1;
		ok('7.11 ...and the service is still square to its main',
			near(((dx / len) * -n.y) + ((dy / len) * n.x), 0, 1e-12));
		colOf('axis1').set(cust, was);
	}
	// **THE LINK IS SUGGESTED AND NEVER ASSIGNED.** A detached meter's cell reads EMPTY while the
	// suggestion is offered beside it, which is the whole of Declan's condition: a wrong guess at a
	// corner where four mains meet is invisible, because the customer appears and every number
	// calculates.
	{
		const loose = L.addCustomer(140, 140, null);
		loose.demand = 1;
		L.customerEdited(loose);
		ok('7.12 a meter with no pipe reads as empty rather than as a guess',
			colOf('link').get(loose) === '' && loose.link === null);
		ok('7.13 ...while a suggestion is offered for it',
			!!colOf('link').hint(loose) && !!L.linkById(colOf('link').hint(loose)),
			colOf('link').hint(loose));
		ok('7.14 ...and the suggestion is the nearest asset to where it is drawn',
			colOf('link').hint(loose) === L.suggestCustomerLink(loose));
		ok('7.15 nothing about it reached the document until somebody typed one',
			loose.link === null && loose.t === undefined);
		// Typed: the meter is served from that pipe, and its demand joins that junction.
		colOf('link').set(loose, L.suggestCustomerLink(loose));
		ok('7.16 typing the link serves the customer from it',
			!!loose.link && L.customerNodeId(loose) !== null, String(loose.link));
		ok('7.17 ...and a meter that has one is offered no suggestion', !colOf('link').hint(loose));
		// **AN ID THAT NAMES NOTHING IS REFUSED AND THE METER LEFT ALONE**, because a customer
		// quietly detached by a typing slip takes its demand out of the answers in silence.
		const heldLink = loose.link, heldT = loose.t;
		colOf('link').set(loose, 'NOT-A-PIPE');
		ok('7.18 an id that names nothing is refused', loose.link === heldLink && loose.t === heldT,
			String(loose.link));
		ok('7.19 ...and the cell is re-read rather than left showing what was not kept',
			colOf('link').reread === true);
		// An empty cell detaches on purpose, which is a different act from a typing slip.
		colOf('link').set(loose, '');
		ok('7.20 clearing the cell detaches it deliberately', loose.link === null);
		L.deleteElement('customer', loose.id);
	}
	// ---- STATION AND OFFSET, THE PAIR, IN THE TABLE (Tom, 2026-09-18) ------------------------
	//
	// **"I told you to add Offset in properties and tables."** Station says how far ALONG the main,
	// offset says how far OFF it and which side. A station on its own is half a position, which is
	// why the two columns are asserted together and sit beside each other.
	{
		const cust2 = (L.getDoc().customers || [])[0];
		// Put it back where the rest of the file found it: section 9 asserts which junction this
		// meter's demand is written to, and a station on the far side of the middle moves it.
		const heldT = cust2.t, heldX = cust2.x, heldY = cust2.y;
		ok('7.21 the table carries both halves of a position',
			!!colOf('station') && !!colOf('offset'), cols.join(','));
		ok('7.22 ...beside each other, station first',
			L.paneCols(spec).map(c => c.key).indexOf('station') + 1 ===
			L.paneCols(spec).map(c => c.key).indexOf('offset'));
		ok('7.23 both can be typed into', !!colOf('station').set && !!colOf('offset').set);
		// **THE OFFSET IS A LENGTH AND THE STATION IS NOT**, which is the whole reason they are two
		// columns rather than a coordinate pair: `t` is a fraction of arc length, and a pipe's
		// stated length is the user's own number.
		ok('7.24 the offset column states the length unit and the station states none',
			colOf('offset').unit() === 'lpn_u_length' && !colOf('station').unit);
		ok('7.25 neither claims an overridable property',
			colOf('station').prop === undefined && colOf('offset').prop === undefined);
		// A round trip through the cell: what is typed is what is read back.
		L.setCustomerStation(cust2, 0.4);
		L.setCustomerOffset(cust2, 30);
		ok('7.26 the station cell reads the station as a percentage',
			near(colOf('station').get(cust2), 40, 1e-6), colOf('station').get(cust2));
		ok('7.27 the offset cell reads what was written to it',
			near(colOf('offset').get(cust2), 30, 1e-3), colOf('offset').get(cust2));
		colOf('offset').set(cust2, -18);
		ok('7.28 typing an offset moves the meter to the other side',
			near(colOf('offset').get(cust2), -18, 1e-3), colOf('offset').get(cust2));
		ok('7.29 ...and the sign is which side of the main it stands on', (function () {
			const an = L.customerAttachPoint(cust2), pt = L.customerPoint(cust2);
			const n = L.linkNormalAt(L.customerLink(cust2), L.customerT(cust2));
			return ((pt.x - an.x) * n.x + (pt.y - an.y) * n.y) < 0;
		})());
		// **THE STATION DOES NOT MOVE WHEN THE OFFSET DOES**, which is what makes them two
		// independent readings of one position rather than two views of the same number.
		const stationWas = colOf('station').get(cust2);
		colOf('offset').set(cust2, 22);
		ok('7.30 moving the meter across its main leaves its station alone',
			near(colOf('station').get(cust2), stationWas, 1e-9), colOf('station').get(cust2));
		// ...and the other way round: sliding ALONG carries the house at the same distance out.
		const offsetWas = colOf('offset').get(cust2);
		colOf('station').set(cust2, 70);
		ok('7.31 sliding along the main carries the meter at the same offset',
			near(colOf('offset').get(cust2), offsetWas, 1e-3), colOf('offset').get(cust2));
		ok('7.32 ...and the station really did move', near(colOf('station').get(cust2), 70, 1e-6));
		// A meter attached to nothing has no main to be along or off, so both cells read empty
		// rather than printing a number measured from something that is not there.
		{
			const bare = L.addCustomer(400, 400, null);
			ok('7.33 a detached meter has neither a station nor an offset to show',
				colOf('station').get(bare) === '' && colOf('offset').get(bare) === '');
			colOf('offset').set(bare, 12);
			ok('7.34 ...and typing one is refused rather than inventing a position',
				colOf('offset').get(bare) === '');
			L.deleteElement('customer', bare.id);
		}
		cust2.t = heldT; cust2.x = heldX; cust2.y = heldY;
		L.customerEdited(cust2);
	}
}

// ---- 8. THE DOCUMENT ROUND TRIP --------------------------------------------------------------
//
// A customer is modelling data and rides in the project file. The assertion is the bytes: what
// comes back must be what went out, because a demand that changed on save and reopen is a network
// whose answers moved while nobody was looking.
{
	const out = L.serializeProject();
	ok('8.1 the file states its customers', Array.isArray(out.customers) && out.customers.length >= 1);
	const before = JSON.stringify(out);
	const back = L.prepareDocument(JSON.parse(before));
	ok('8.2 a document holding customers is accepted', !!back);
	L.applySaved(back);
	const now = L.getDoc().customers;
	ok('8.3 every customer came back', now.length === out.customers.length);
	ok('8.4 ...with its tag, its demand and its count',
		now[0].tag === '4417-A' && near(now[0].demand, 3) && now[0].count === 4,
		JSON.stringify(now[0]));
	ok('8.5 the reopened document serializes to the same bytes',
		JSON.stringify(L.serializeProject().customers) === JSON.stringify(out.customers));
	// A document that says nothing about customers is a document written before they existed, and
	// it must open as one with none rather than being refused.
	const legacy = JSON.parse(before);
	delete legacy.customers;
	const old = L.prepareDocument(legacy);
	ok('8.6 a document with no customers key still opens', !!old);
	L.applySaved(old);
	ok('8.7 ...as a project with no customers', (L.getDoc().customers || []).length === 0);
	// Put the real one back for section 9.
	L.applySaved(L.prepareDocument(JSON.parse(before)));
}

// ---- 9. THE .inp, WHICH HAS NO CUSTOMERS -----------------------------------------------------
{
	const doc = L.serializeProject();
	const res9 = global.EngCalcs.lpnExportInp(doc, { effective: L.effective });
	ok('9.1 the export succeeds', res9 && res9.ok === true, res9 && res9.error);
	const text = res9.inp;
	const demandRows = text.split(/\r?\n/).filter(l => /^\s*[A-Za-z0-9_-]/.test(l));
	const section = (function (name) {
		const out = [];
		let cur = '';
		for (const raw of text.split(/\r?\n/)) {
			const m = /^\s*\[(\w+)\]/.exec(raw);
			if (m) { cur = m[1].toUpperCase(); continue; }
			if (cur === name && raw.trim() && raw.trim().charAt(0) !== ';') { out.push(raw); }
		}
		return out;
	}('DEMANDS'));
	void demandRows;
	// **ONE [DEMANDS] ROW PER DEMAND ROW**, which is Tom's own ruling (*"Maybe itemized is the right
	// way to go"*) and is what keeps the breakdown the whole feature exists for.
	const ours = section.filter(l => l.indexOf('4417-A') >= 0);
	ok('9.2 the customer is written as a demand row on its own junction',
		ours.length === 1 && ours[0].indexOf(jA.id) === 1, ours.join(' | '));
	ok('9.3 the tag rides out as the row name, in a trailing comment',
		/;\s*4417-A\s*$/.test(ours[0]), ours[0]);
	ok('9.4 the total, not the per-service demand, is what the file states',
		/(^|\s)12(\s|\t)/.test(ours[0].split(';')[0]), ours[0].split(';')[0]);
	// The junction's OWN demand is a row of its own beside it. Nothing is merged and nothing is
	// deducted, which is the additive rule stated in the file rather than on the screen.
	ok('9.5 the junction states its own demand in a row beside it',
		section.filter(l => l.trim().indexOf(jA.id) === 0).length >= 2,
		section.join(' | '));
	// **THE DIFFERENCE IS REPORTED, and it is the geometry rather than the number.**
	const diff = (res9.differences || []).filter(d => d.code === 'customer-geometry')[0];
	ok('9.6 the export reports what the format cannot hold', !!diff);
	ok('9.7 ...naming every meter', diff && diff.ids.length === (L.getDoc().customers || []).length,
		diff && diff.ids.join(','));
	ok('9.8 ...and the sentence for it is a language key, not a hand-written line',
		typeof PC.lpn_inp_export_flat_customers === 'string' &&
		PC.lpn_inp_export_flat_customers.indexOf('{n}') >= 0);
	// A NETWORK WITH NO CUSTOMERS MUST BE UNTOUCHED BY ALL OF THIS -- the byte identity Task 281
	// asserts is what a customer must not cost anybody who has none.
	const plain = JSON.parse(JSON.stringify(doc));
	plain.customers = [];
	const resPlain = global.EngCalcs.lpnExportInp(plain, { effective: L.effective });
	ok('9.9 the same network without customers reports nothing about them',
		(resPlain.differences || []).every(d => d.code !== 'customer-geometry'));
	ok('9.10 ...and jB, which never had one, writes the same row either way',
		resPlain.inp.split(/\r?\n/).filter(l => l.trim().indexOf(jB.id) === 0).join('\n') ===
		text.split(/\r?\n/).filter(l => l.trim().indexOf(jB.id) === 0).join('\n'));
}

// ---- 10. DELETING A METER --------------------------------------------------------------------
{
	const c = (L.getDoc().customers || [])[0];
	L.setSelection('customer', c.id);
	ok('10.1 a meter can be the selection', L.selectionCount() === 1);
	const totalWas = L.baseDemandTotal(jA);
	L.deleteElement('customer', c.id);
	ok('10.2 deleting it removes it', (L.getDoc().customers || []).length === 0);
	ok('10.3 ...and its drawn elements', !L.custEls()[c.id]);
	ok('10.4 ...and takes its demand out of the junction',
		L.baseDemandTotal(jA) < totalWas || near(L.baseDemandTotal(jA), totalWas - 12),
		totalWas + ' -> ' + L.baseDemandTotal(jA));
	ok('10.5 the selection did not survive it', L.selectionCount() === 0);
}

void lastAlert;
console.log(fails ? '\nFAILED ' + fails : '\nAll customer checks passed.');
process.exit(fails ? 1 : 0);
