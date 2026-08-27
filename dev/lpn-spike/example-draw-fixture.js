// THE CODE-DRAWN EXAMPLE NETWORK -- injected source, NOT a node module. Do not require() this file.
//
// These lines were MOVED here verbatim from js/looped-network.js (ROADMAP Task 378). They are read
// as text by example-fixture.js and spliced into the module's own scope by
// lpn-dom-stub.js's loadLoopedNetwork(), so drawExampleNetwork() still closes over the REAL doc,
// settings, setProp(), el(), addNode(), niceDefault() and setMode() -- the same seams it always
// called, resolved in the same closure. Nothing here is a re-implementation.
//
// WHY MOVED RATHER THAN MIGRATED. Seven harnesses now open the shipped gallery file through
// example-fixture.js, which is the path a visitor takes. Three cannot, and not for want of effort:
// example-network-harness asserts 16 things about this drawing specifically; color-ramp is about a
// NEW project's default of seven colour classes, and the gallery file predates the per-group colour
// keys so applySaved() pins it to five; label-shed is about the shipped textSize of 11, and the
// gallery file carries 9, which runs the length cascade 9->9->7->3->1 instead of 9->9->6->2->1.
// Migrating those three would mean re-fitting their assertions to a different network, i.e.
// changing what they test to make a refactor land. Moving the fixture changes nothing they assert
// and takes 279 lines out of what every visitor downloads.
//
// THE COST, STATED PLAINLY: a fixture in the test folder can rot away from the app. The hedge is
// that it is injected rather than reimplemented -- if a seam it calls is renamed or removed, all
// three harnesses throw a ReferenceError on the next run rather than quietly passing. That is the
// only guard, and it is why this must never be edited into a stub-friendly copy of itself.

	// A small RING MAIN: one reservoir, one pump (a LINK), and a closed loop of five junctions with
	// varied demands and elevations. Exercises every element type except Text, a fixed head, both
	// link types and vertex editing in one click. Always leaves the toolbar back on Select, or
	// whatever tool was active before (e.g. Delete) reads as the example being deletable on the very
	// next click.
	//
	// TOPOLOGY. A five-junction ring fed at one point, not two parallel pipes between one pair of
	// junctions: only the ring shows flow leaving the tie-in BOTH ways and meeting at a hydraulic
	// divide (between J3 and J4, where flow reverses and head loss crosses zero), which is the whole
	// reason looped networks need a solver.
	//
	// UNITS AND PLACEMENT. ONE drawing serves both presets: laid out once in map units, with no
	// US/SI coordinate scaling. Only the real SI quantities go through niceDefault().
	//
	// **Map coordinates are NOT unitless -- they FOLLOW the Length/Map declaration.** So this one
	// drawing is a 1400 **ft** ring for a US visitor and a 1400 **m** ring for a metric one, the
	// metric network being physically ~3.3x larger. **Accepted deliberately:** both are realistic
	// systems, both solve to sensible pressures (dev/lpn-spike/example-network-harness.js), and with
	// no backdrop registered there is nothing on screen for the difference to contradict. Revisit if
	// the example ever ships with a background image.
	//
	// Anchored at 5000,5000 rather than the origin, so it lands in positive coordinates that look
	// like a survey or state-plane grid. Extent 1400 x 700, centre exactly 5000,5000.
	//
	// **NOTHING IN THE APP CALLS THIS, AND NOTHING SHIPS IT.** The gallery ships the same ring main
	// as Basic-example-US/SI-units.lwn, which is what a visitor opens. This is the fixture the
	// three harnesses named in the file header build their network from; see them for why they hold
	// it rather than the gallery file.
	function drawExampleNetwork(system) {
		if (doc.nodes.length > 0) {
			var pc = EngCalcs.pageConfig || {};
			if (!window.confirm(pc.lpn_confirm_example || 'This adds the example to the network you already have. Continue?')) { return; }
		}
		saveUndoSnapshot();
		// THE EXAMPLE FORCES HAZEN-WILLIAMS (Task 271), for the same reason it forces its units. Its
		// pipe roughness is 130 -- an HW C -- and newProject() INHERITS settings from the project you
		// were in, so a visitor sitting on Manning would get a ring main whose every pipe carried
		// n = 130: a roughness four orders of magnitude out, converging happily to nonsense.
		//
		// This is the one place the method is set without asking, and it is safe precisely because it
		// is not a switch: the network is being CREATED at this instant, so there are no
		// already-typed roughness numbers for it to invalidate. The settings-panel select must confirm.

		settings.method = 'hw';
		applyMethodUI();
		// THIS FUNCTION DELIBERATELY DOES NOT TOUCH settings.textSize. A visitor who has changed
		// their text size has expressed a preference, and an example is not a reason to overrule it.
		// The shipped default is the whole answer. It also keeps `settings` out of a function whose
		// undo snapshot cannot restore it.
		// The reservoir sits at 50 ft / 15 m, in among the junctions it feeds (45-62 ft) rather than
		// perched above them: a source high above the network makes the example a gravity system that
		// would work with the pump deleted. Level with the network, the pump is the only reason there
		// is pressure anywhere. Its head is left blank, so the water surface is its ground elevation.
		var r = addNode('reservoir', 4300, 5000);
		r.elev = niceDefault('lpn_u_elevhead', 'fth2o', 50, 15);
		// J1 is the tie-in: no demand of its own, it is where the pump discharges into the ring.
		var j1 = addNode('junction', 4500, 5000);
		j1.elev = niceDefault('lpn_u_elevhead', 'fth2o', 45, 14); j1._demand = 0;   // base-write: the example network is drawn into a fresh project, always Base
		// The example's pump gets a curve explicitly, as document content the user can see and edit
		// in its popup -- addLink() invents none. Everything else here is pre-filled the same way.
		// THREE points, not one. A single design point is legal and is EPANET's own rule, but it
		// DERIVES the shutoff head and maximum flow from that one number, so the example would show a
		// pump doing things the visible numbers do not explain. Three is how a manufacturer publishes
		// a curve: shutoff head at zero flow, a duty point, and a run-out point.
		// The duty point is the ring's total demand (250 gpm / 15 L/s) at 140 ft / 42 m, chosen so the
		// network settles at 52-63 psi (365-422 kPa) -- distribution pressures a reviewer reads as
		// normal, rather than numbers that merely converge.

		var pump = addLink('pump', r.id, j1.id);
		pump.curvePoints = [
			[0, niceDefault('lpn_u_elevhead', 'fth2o', 165, 50)],
			[niceDefault('lpn_u_flow', 'gpm', 250, 0.015), niceDefault('lpn_u_elevhead', 'fth2o', 140, 42)],
			[niceDefault('lpn_u_flow', 'gpm', 500, 0.030), niceDefault('lpn_u_elevhead', 'fth2o', 60, 18)]
		];
		// The ring. Demands and elevations both vary around it on purpose: equal demands at equal
		// elevations would put the hydraulic divide exactly opposite the tie-in and make the answer
		// look like symmetry rather than like a solve.
		var ring = [
			{ x: 4800, y: 4650, elev: [55, 17], demand: [60, 0.004] },
			{ x: 5400, y: 4700, elev: [62, 19], demand: [80, 0.005] },
			{ x: 5700, y: 5150, elev: [58, 18], demand: [50, 0.003] },
			{ x: 5000, y: 5350, elev: [52, 16], demand: [60, 0.003] }
		];
		// Bend vertices, by ring leg index. MORE THAN ONE, and on more than one pipe (Tom,
		// 2026-08-09: "it would be nice to have more than one vertex for demonstration") -- a single
		// vertex shows that pipes can bend but not that they are polylines. Leg 3 gets a two-vertex
		// dog-leg, the shape a main takes around an obstacle; leg 4 gets a single easy bend. The
		// other three stay straight, because a ring with a kink in every leg reads as sketchy
		// rather than as a plan.
		var bends = { 3: [{ x: 5550, y: 5300 }, { x: 5250, y: 5300 }], 4: [{ x: 4650, y: 5250 }] };
		// 6 in / 150 mm at C = 130 (ductile iron or PVC), not the 4 in / 0.1 m page default: a 6 in
		// ring at these demands runs well under the design velocity ceiling with a readable gradient
		// on every pipe, where the default diameter would read as a fire-flow-limited main and a
		// wider one would show head losses too small to see at two decimals.
		var dia = niceDefault('lpn_u_diameter', 'in', 6, 0.15), rough = 130;
		var nodes = [j1], i, n, pipe;
		for (i = 0; i < ring.length; i++) {
			n = addNode('junction', ring[i].x, ring[i].y);
			n.elev = niceDefault('lpn_u_elevhead', 'fth2o', ring[i].elev[0], ring[i].elev[1]);
			n._demand = niceDefault('lpn_u_flow', 'gpm', ring[i].demand[0], ring[i].demand[1]);   // base-write: the example network is drawn into a fresh project, always Base
			nodes.push(n);
		}
		for (i = 0; i < nodes.length; i++) {
			pipe = addLink('pipe', nodes[i].id, nodes[(i + 1) % nodes.length].id);
			pipe._diameter = dia;   // base-write: the example network is drawn into a fresh project, always Base
			pipe._roughness = rough;   // base-write: the example network is drawn into a fresh project, always Base
			if (bends[i]) { bends[i].forEach(function (v) { pipe.verts.push({ x: v.x, y: v.y }); }); }
			// addLink() computed .length before those vertices existed (straight node-to-node
			// distance); rebuildLink() only rebuilds the DOM, not the length -- recompute
			// explicitly, or the initial displayed length undercounts the bend until the vertex is
			// next dragged (which goes through updateVertex()/updateLinkGeometry(), where lenAuto
			// recomputation already happens correctly). Tom caught this: 25 ft shown, jumped to
			// 28 ft only after a drag.
			pipe._length = linkGeomLength(pipe);   // base-write: the example network is drawn into a fresh project, always Base
			rebuildLink(pipe);
		}
		// ---- a SECOND, SEPARATE system ----
		// Nothing else on the page says disjoint components are allowed, and a user who assumes one
		// drawing means one connected network will never try it -- yet the solver handles them
		// natively, needing only that each has its own fixed head (lpnDiagnose's `unreachable` check
		// is per component).
		//
		// It is a GRAVITY system, and that is the contrast worth drawing: a tank uphill at 200 ft /
		// 60 m feeding one demand, with no pump anywhere in it, beside a ring main that only has
		// pressure because a pump gives it some.
		//
		// Its elevations keep it ABOVE the ring's minimum pressure deliberately: the "Lowest
		// pressure" callout is pinned to a ring junction, and a separate system that quietly stole
		// the network minimum would make that callout a lie. The harness asserts it.
		//
		// DRAWN INSIDE THE RING, not below it. The ring's interior is empty space the fit is already
		// paying for, so a system placed there is free; the same system slung underneath added ~350
		// units of height and shrank everything at zoom-to-fit. Placed low-centre and kept clear of
		// J1's multi-line data label, which grows down and right into the interior from the tie-in.

		var r2 = addNode('reservoir', 4900, 5080);
		r2.elev = niceDefault('lpn_u_elevhead', 'fth2o', 200, 60);
		var j6 = addNode('junction', 5320, 5080);
		j6.elev = niceDefault('lpn_u_elevhead', 'fth2o', 60, 18);
		j6._demand = niceDefault('lpn_u_flow', 'gpm', 100, 0.006);   // base-write: the example network is drawn into a fresh project, always Base
		var sep = addLink('pipe', r2.id, j6.id);
		sep._diameter = dia;   // base-write: the example network is drawn into a fresh project, always Base
		sep._roughness = rough;   // base-write: the example network is drawn into a fresh project, always Base
		sep._length = linkGeomLength(sep);   // base-write: the example network is drawn into a fresh project, always Base
		rebuildLink(sep);

		// ---- annotations ----
		// A title block and two callouts, so the demonstration also demonstrates the Text element and
		// its per-label size multiplier.
		//
		// EVERY STRING IS ONE THAT ALREADY EXISTS AND IS ALREADY TRANSLATED. Net cost: zero new keys.
		//
		// WHOLE LABELS ONLY -- never a clause cut out of a longer string. "Double-click a pipe to add
		// or remove a vertex" exists ONLY as the third sentence of `lpn_mode_select`, and splicing it
		// out is the fragment composition CLAUDE.md bans (it breaks in gendered, word-order and RTL
		// languages); it would need a key of its own. Same reason there is no velocity callout: there
		// is no "Highest velocity" string to borrow, only the bare word "Velocity".

		var pcx = EngCalcs.pageConfig || {};
		// side: 'left' | 'right', for an ANCHORED annotation only -- which side of its node the whole
		// label sits on. A callout must sit ENTIRELY to one side, or the leader is a stub emerging
		// from under the middle of the words.
		//
		// **THE OFFSET IS THE LABEL'S NEAR EDGE, NOT ITS CENTRE, so the text width cancels and
		// nothing is measured** (Task 403). Centring the label and pushing the centre out by half a
		// MEASURED width is correct at the instant it is drawn and stale ever after, because a
		// label's world width follows the font size (textSize / scale). `lb.align` says which edge
		// the point is, so a right-side callout is start-anchored at +gap and a left-side one
		// end-anchored at -gap: entirely to one side by construction, at every size.

		function annotate(x, y, anchorNode, text, sizeMult, side) {
			if (!text) { return null; }   // key missing from pageConfig: draw nothing, never "Text"
			var lb = addText(x, y, anchorNode);
			setProp(lb, 'text', text);   // the one write seam, as every property editor does
			lb.sizeMult = sizeMult;
			// Same two steps the text/size fields in renderLabelFields() take after an edit: push the
			// new content into the existing element and re-measure, rather than rebuilding it (a
			// second buildLabelEls() would leave the first element orphaned in the DOM).
			var le = labelEls[lb.id];
			setTextLabelContent(le.text, lb, lb.x);
			le.text.style.fontSize = effectiveFontSize(lb.sizeMult) + 'px';
			try { noteTextWidth(le, le.text.getBBox().width); } catch (err) { /* pre-layout measure can throw; stale width stands */ }
			if (anchorNode && side) {
				var an = nodeById(anchorNode),
					gap = nodeRadius(an) + effectiveFontSize(sizeMult) * 0.5;
				// The SIGN of the offset is the whole of it now: labelHAlign() derives the anchored
				// edge from it, so there is nothing to store and nothing that can be stored wrong.
				lb.x = (side === 'left' ? -1 : 1) * gap;
				// And the RISE that makes the leader slope. The leader runs from the node to the
				// label's near edge, which is lb.x itself, so the leader vector is (gap, lb.y) and
				// its angle is set entirely by this line -- horizontal leaders do not look good.
				// A FIXED dy would NOT hold the angle across the two callouts: nodeRadius() is
				// JUNCTION_R for a junction but half the tank's longer side for a reservoir, so the
				// same rise over a different gap is a different slope.
				lb.y = -Math.tan(LPN_CALLOUT_ANGLE * Math.PI / 180) * gap;
			}
			updateLabelGeometry(lb.id);
			return lb;
		}
		// Title block, centred on the drawing and just above it. Two lines at different sizes rather
		// than one, so the size multiplier is visibly doing something a reader can go and change.
		//
		// TUCKED CLOSE TO THE RING ON PURPOSE: bbox(), and therefore zoom-to-fit, includes the title,
		// so every unit of white space between it and the drawing is a unit the fit has to shrink
		// everything else to accommodate. Clearance to the ring top is ~35 units.
		// The SECOND line anchors the block and the FIRST is DERIVED from it, stacked by their own
		// half-heights plus a gap -- never moved by a flat amount, which OVERLAPS them by 5 units at
		// the default text size (they are 40 and 30 units tall). Deriving also keeps the block tight
		// if the visitor's text size is not the default.
		// The anchor is 4572, not 4600: the units line added below it grew the block downward by
		// (30 + 20)/2 + 8 = 33 units at the SHIPPED text size, so the whole thing moves up to hand
		// the ring back that clearance. Sized against the SHIPPED default deliberately, not against
		// this session's textSize -- see the harness's default-size gap check. Moving J2 instead is
		// wrong: the ring's 1400 x 700 extent centred exactly on 5000,5000 is worth more than 20
		// units of clearance.

		var titleY = 4572;
		annotate(5000, titleY - (effectiveFontSize(2) + effectiveFontSize(1.5)) / 2 - 8, null, pcx.menu_brand, 2);
		annotate(5000, titleY, null, pcx.lpn_main_menu, 1.5);
		// THIRD LINE: what the example is drawn in. Here and not on the browser tab (see
		// unitSetLabel()) because this drawing is the one thing on the page that leaves the page -- a
		// screenshot carries no status strip, and each example COMMITS to a unit system.
		//
		// Stacked DOWNWARD from the anchor line, mirroring how the first is derived upward -- by the
		// two lines' own half-heights plus the same 8-unit gap, never a flat offset, so the block
		// stays tight at any text size. A 1.0-size line is 20 tall at the default, inside the ~35
		// units of clearance to the ring.

		annotate(5000, titleY + (effectiveFontSize(1.5) + effectiveFontSize(1)) / 2 + 8, null, unitSetLabel(system), 1);
		// Anchored callouts: the offset is from the node, and the label follows if the node moves.
		// The reservoir is the drawing's far-left node and its own data label sits to the upper
		// right, so its callout goes LEFT -- and UP, at the shared leader angle. It was level with
		// the node in the first cut, which put the leader dead horizontal; Tom, 2026-08-09:
		// "Leaders don't look great horizontal."
		// The x and y passed here are only seeds -- annotate() derives both offsets from the
		// measured text width and LPN_CALLOUT_ANGLE.
		annotate(r.x, r.y, r.id, pcx.lpn_tool_add_reservoir, 1.5, 'left');
		// "Lowest pressure" goes on nodes[2] -- the third ring junction -- which is the minimum in
		// BOTH unit sets. Hard-coded rather than computed, because the solve is 300 ms away on the
		// debounce and there are no pressures to compare yet at this point in the draw. That is only
		// safe because example-network-harness.js asserts it: if a future tweak to demands or
		// elevations moves the minimum elsewhere, the harness fails rather than the map lying.
		//
		// NOTE THE MINIMUM IS NOT THE ONE THE EXTREMA TICK MARKS. Tom found this and decided against
		// fixing it, 2026-08-09: the reservoir is at zero gauge pressure and is almost always the
		// network low, so it wins the "low" tick and no junction is marked. The fix would be a rule
		// and a checkbox ("ignore reservoirs during pressure extrema") or a silent special case, and
		// he judged both worse than the wart. This callout is the cheap way to point at the number
		// that actually matters.
		// RIGHT and above: J3 is the drawing's top-right node, and its own multi-line data label
		// grows downward from the upper right, so a callout level with it would collide. Tom
		// approved how this one looks; LPN_CALLOUT_ANGLE is set to reproduce it, and the reservoir
		// callout above now matches it rather than the other way round.
		annotate(nodes[2].x, nodes[2].y, nodes[2].id, pcx.bpn_p_min, 1.5, 'right');
		// ---- Re-anchor so the centre READS 5000,5000 (Task 274; Tom, 2026-08-11: "Center is now at
		// 5000,-5000. Should be at 5000,5000.") ----
		// Everything above is laid out around INTERNAL y = 5000, and internal is Y-down, so the
		// coordinate readout showed -5000. A pure TRANSLATION of -10000 puts the centre at internal
		// -5000, which reads +5000, and moves nothing relative to anything else -- so every
		// clearance, stacking and side-flip number reasoned about above still holds exactly as
		// written, and the drawing on screen is unchanged.
		//
		// ABSOLUTE coordinates only. A Text label anchored to a node stores an OFFSET in lb.x/lb.y,
		// and a data label likewise in n.lx/n.ly; translating a vector would drag every callout off
		// the element it points at.
		doc.nodes.forEach(function (n) { n.y -= 10000; });
		doc.links.forEach(function (l) { (l.verts || []).forEach(function (v) { v.y -= 10000; }); });
		doc.labels.forEach(function (lb) { if (!lb.anchorNode) { lb.y -= 10000; } });
		buildDom();   // every element above was built at its pre-shift position
		updateEmptyHint();
		saveToStorage();
		zoomExtent(true);   // automatic: a network drawn in code has no stored view
		// ...and again once the labels exist. zoomExtent() measures the RENDERED label text, and at
		// this instant there is none: the solve is 300 ms behind on the debounce, so every node's
		// data label is still a placeholder width. Fitting now is right for immediate feedback but
		// leaves labels hanging outside the map a third of a second later, which is the second half
		// of Task 254 ("it is not zoomed to fit after drawing. Some labels extend beyond the map").
		setMode('select');
	}
