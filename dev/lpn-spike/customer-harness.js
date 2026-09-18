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
	"\t\tlinkNormalAt: linkNormalAt, customerLink: customerLink,\n" +
	"\t\tmeterHalfWorld: meterHalfWorld, serviceStrokeWorld: serviceStrokeWorld,\n" +
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
	"\t\trenderCustomerFields: renderCustomerFields,\n" +
	"\t\tpopupFields: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tpaneTables: paneTables, paneCols: paneCols,\n" +
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
m1.account = '4417-A';
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
ok('2.10 the row is named with the account number',
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

// RENAMING THE PIPE carries the meter with it. Left out, the service would name an id the document
// does not have, which reads as detached and silently takes its demand out of the answers.
L.renameLink(main.id, 'MAIN-1');
ok('3.7 a pipe rename carries its meters', m1.link === 'MAIN-1' && L.customerNodeId(m1) === jA.id);

// ---- 4. DETACHED IS A REAL STATE -------------------------------------------------------------
{
	const totalWas = L.baseDemandTotal(jA);
	L.deleteElement('link', main.id);
	ok('4.1 deleting the pipe does NOT delete the meter', (L.getDoc().customers || []).length === 1);
	ok('4.2 it keeps its account number and its demand',
		m1.account === '4417-A' && near(L.customerFlow(m1), 12));
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
	ok('5.9 ...leading with the caution glyph',
		PC.lpn_customer_fixed_head.charAt(0) === '⚠');
	L.deleteElement('customer', m2.id);
	L.deleteElement('link', feeder.id);
}

// ---- 6. THE SYMBOL SIZE IS ONE max(), AND THE THRESHOLD FALLS OUT OF IT ----------------------
//
// Tom's hybrid rule (2026-08-24): the meter is drawn to its real size while the site is small, and
// held at a legible dot beyond. A symbol drawn to scale is constant in WORLD units; one held at a
// screen size is pixels / scale, which grows as you zoom out. So it is the larger of the two, and
// the crossover is where 2 m equals 3 px rather than a number anybody typed.
{
	const st = L.getState();
	const was = st.s;
	st.s = 1000;                       // deep zoom: one drawing unit is a thousand pixels
	const tight = L.meterHalfWorld(0, 0);
	st.s = 2000;                       // deeper still
	const tighter = L.meterHalfWorld(0, 0);
	st.s = 0.0001;                     // system zoom: the whole site is a few pixels across
	const wide = L.meterHalfWorld(0, 0);
	const wideStroke = L.serviceStrokeWorld(0, 0);
	st.s = was;
	// Zoomed in, the symbol is a CONSTANT SIZE IN THE GROUND: two zooms, one world size, so the
	// drawn box grows on the screen exactly as the pipework around it does.
	ok('6.1 zoomed in it is drawn to scale, so its world size does not move with the zoom',
		near(tight, tighter, 1e-12), tight + ' vs ' + tighter);
	// ...and it is comfortably above the pixel floor there, which is what says the real size and
	// not the floor is the number in force.
	ok('6.2 ...and the pixel floor is not what is in force there', tight * 1000 > 1.5,
		String(tight * 1000) + ' px');
	// Zoomed out, the floor takes over: to scale the box would be far under a pixel and invisible,
	// so it is held at a legible dot, which in WORLD units is very much bigger.
	ok('6.3 zoomed out the pixel floor wins, and the world size is larger for it',
		wide > tight * 100, tight + ' -> ' + wide);
	ok('6.4 the connector follows the same hybrid rule', wideStroke > L.serviceStrokeWorld(0, 0));
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
	ok('6.7 the account number is still IN the document, it is only not drawn',
		typeof c.account === 'string');
}

// ---- 7. THE CUSTOMER TABLE -------------------------------------------------------------------
{
	const spec = L.paneTables().filter(s => s.id === 'customers')[0];
	ok('7.1 there is a Customers table', !!spec);
	ok('7.2 it lists the customers and nothing else',
		L.paneTableAllElements(spec).length === (L.getDoc().customers || []).length);
	const cols = L.paneCols(spec).map(c => c.key);
	ok('7.3 its columns cover the account, the count and the junction',
		cols.indexOf('account') >= 0 && cols.indexOf('count') >= 0 && cols.indexOf('atNode') >= 0,
		cols.join(','));
	// **NO COLUMN CARRIES `prop`**, which is the table's half of the popup's rule: a customer has no
	// overridable property, so an override marker there would be a promise a scenario cannot keep.
	ok('7.4 no column claims an overridable property',
		L.paneCols(spec).every(c => c.prop === undefined),
		L.paneCols(spec).filter(c => c.prop).map(c => c.key).join(','));
	// The junction column is DERIVED, which is why it has no setter.
	const atNode = L.paneCols(spec).filter(c => c.key === 'atNode')[0];
	ok('7.5 the junction column is read-only', !atNode.set);
	ok('7.6 ...and reads the same answer the popup does', atNode.get(m1) === L.customerNodeId(m1));
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
	ok('8.4 ...with its account number, its demand and its count',
		now[0].account === '4417-A' && near(now[0].demand, 3) && now[0].count === 4,
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
	ok('9.3 the account number rides out as the row name, in a trailing comment',
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
