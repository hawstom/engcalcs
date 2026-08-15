// Task 293 — headless check of js/lpn-geom.js, the map editor's pure geometry.
//
//   node dev/lpn-spike/geom-harness.js
//
// FIRST HARNESS IN THIS DIRECTORY THAT SIMPLY require()s ITS SUBJECT. Every earlier one
// (backdrop-scale, recent-files, closed-link, ...) reads js/looped-network.js as TEXT and
// brace-matches a function out of it, because nothing in that file could be reached any
// other way. That trick works but it tests a copy of the code in a context the browser
// never has: a function lifted out of its closure sees whatever stubs the harness happens
// to define, so a harness can pass while the real call site is broken. Task 293 exists to
// stop paying that price. What is tested below is byte-for-byte the module the page loads.
//
// What can actually be wrong here:
//   * pointAlongPolyline measuring within one SEGMENT rather than the whole run -- the
//     exact defect Tom reported on 2026-07-30 ("link label is placing within last segment
//     instead of overall length"), invisible on a straight pipe and wrong on every bent one;
//   * the degenerate zero-length link, which must return a point and not NaN;
//   * the arrow dodge stepping off the end of a short pipe, or dodging the wrong way;
//   * the leader side-flip, whose whole job is to NOT flicker -- a hysteresis bug shows up
//     only as a jitter during a drag, which is precisely what a manual pass cannot catch;
//   * the mask rect's baseline-vs-centre alignment, where getting the vertical convention
//     backwards still draws a rect, just not behind the text.

const Geom = require('../../js/lpn-geom.js').lpnGeom;

let checks = 0, failures = 0;
function report(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol); }
function eq(actual, expected, label) {
	report(near(actual, expected), label, `got ${actual}, want ${expected}`);
}
function pt(p, x, y, label) {
	report(near(p.x, x) && near(p.y, y), label, `got (${p.x}, ${p.y}), want (${x}, ${y})`);
}

// ---- polylineLength ----------------------------------------------------
console.log('--- polylineLength ---');
eq(Geom.polylineLength([{ x: 0, y: 0 }, { x: 3, y: 4 }]), 5, 'straight 3-4-5');
eq(Geom.polylineLength([{ x: 0, y: 0 }, { x: 3, y: 4 }, { x: 3, y: 14 }]), 15, 'two segments sum');
eq(Geom.polylineLength([{ x: 7, y: 7 }]), 0, 'single point is zero');
eq(Geom.polylineLength([{ x: 2, y: 2 }, { x: 2, y: 2 }]), 0, 'coincident endpoints are zero');

// ---- pointAlongPolyline ------------------------------------------------
console.log('--- pointAlongPolyline ---');
const straight = [{ x: 0, y: 0 }, { x: 100, y: 0 }];
pt(Geom.pointAlongPolyline(straight, 0), 0, 0, 'f=0 is the start');
pt(Geom.pointAlongPolyline(straight, 1), 100, 0, 'f=1 is the end');
pt(Geom.pointAlongPolyline(straight, 0.5), 50, 0, 'f=0.5 on a straight run');
eq(Geom.pointAlongPolyline(straight, 0.25).dist, 25, 'dist is the along-distance');
eq(Geom.pointAlongPolyline(straight, 0.25).total, 100, 'total is the whole length');

// THE REGRESSION THIS FILE EXISTS FOR. An L of a 10-long leg and a 90-long leg: halfway by
// ARC LENGTH is 50 along, i.e. 40 into the second leg. The old midpoint-of-the-middle-
// segment code put it at the middle of the second leg (55 along) instead.
const bent = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 100, y: 0 }];
pt(Geom.pointAlongPolyline(bent, 0.5), 50, 0, 'halfway is by whole arc length, not by segment');

// A real corner, so the y coordinate has to be interpolated too: 30 across then 40 down,
// total 70; f = 50/70 lands 20 down the second leg.
const corner = [{ x: 0, y: 0 }, { x: 30, y: 0 }, { x: 30, y: 40 }];
eq(Geom.pointAlongPolyline(corner, 1).total, 70, 'corner total length');
pt(Geom.pointAlongPolyline(corner, 50 / 70), 30, 20, 'interpolates around a corner');
pt(Geom.pointAlongPolyline(corner, 30 / 70), 30, 0, 'lands exactly on the vertex');

// Degenerate: a link whose two nodes sit on top of each other (drawn, then one dragged onto
// the other). Must be a point, not NaN -- a NaN here propagates into an SVG attribute and
// the label silently vanishes.
const degenerate = Geom.pointAlongPolyline([{ x: 5, y: 6 }, { x: 5, y: 6 }], 0.5);
pt(degenerate, 5, 6, 'zero-length polyline returns its own point');
eq(degenerate.total, 0, 'zero-length reports total 0');
report(!Number.isNaN(degenerate.x) && !Number.isNaN(degenerate.y), 'zero-length is not NaN');

// Out-of-range fractions are clamped per segment, never extrapolated off the line.
pt(Geom.pointAlongPolyline(straight, 1.5), 100, 0, 'f>1 clamps to the end');
pt(Geom.pointAlongPolyline(straight, -0.5), 0, 0, 'f<0 clamps to the start');

// ---- polylinePointsAttr ------------------------------------------------
console.log('--- polylinePointsAttr ---');
report(Geom.polylinePointsAttr(corner) === '0,0 30,0 30,40', 'SVG points attribute',
	Geom.polylinePointsAttr(corner));

// ---- dodgeAlongPolyline ------------------------------------------------
console.log('--- dodgeAlongPolyline ---');
const CLEAR = 10;
// No obstacle anywhere near: stays put at the requested fraction.
pt(Geom.dodgeAlongPolyline(straight, 0.5, [], CLEAR, 0.12, 0.88), 50, 0, 'no obstacle, no dodge');
pt(Geom.dodgeAlongPolyline(straight, 0.5, [90], CLEAR, 0.12, 0.88), 50, 0, 'distant obstacle ignored');
// Exactly `clear` away counts as clear (>=), so still no move.
pt(Geom.dodgeAlongPolyline(straight, 0.5, [60], CLEAR, 0.12, 0.88), 50, 0, 'obstacle exactly clear away');
// An obstacle AHEAD pushes the label back to clear before it; one BEHIND pushes it forward.
pt(Geom.dodgeAlongPolyline(straight, 0.5, [55], CLEAR, 0.12, 0.88), 45, 0, 'dodges back from an obstacle ahead');
pt(Geom.dodgeAlongPolyline(straight, 0.5, [45], CLEAR, 0.12, 0.88), 55, 0, 'dodges forward from one behind');
// On a SHORT pipe the dodge would run off the end; the clamp keeps it inside.
const shortLink = [{ x: 0, y: 0 }, { x: 12, y: 0 }];
const dodged = Geom.dodgeAlongPolyline(shortLink, 0.5, [8], CLEAR, 0.12, 0.88);
report(dodged.x >= 12 * 0.12 - 1e-9 && dodged.x <= 12 * 0.88 + 1e-9,
	'short pipe: dodge stays clamped inside the ends', `x=${dodged.x}`);
// Degenerate link: nothing to dodge along, and it must not divide by zero.
const dodgeDegenerate = Geom.dodgeAlongPolyline([{ x: 1, y: 1 }, { x: 1, y: 1 }], 0.5, [0], CLEAR, 0.12, 0.88);
pt(dodgeDegenerate, 1, 1, 'zero-length link ignores obstacles');

// ---- leaderAttachX (no hysteresis) -------------------------------------
console.log('--- leaderAttachX ---');
// Box centre right of the anchor -> attach to the box's LEFT (near) edge, and vice versa.
eq(Geom.leaderAttachX(50, 10, 0), 40, 'label right of anchor attaches at its left edge');
eq(Geom.leaderAttachX(-50, 10, 0), -40, 'label left of anchor attaches at its right edge');
eq(Geom.leaderAttachX(0, 10, 0), -10, 'exactly on the anchor counts as right (>=)');

// ---- leaderAttach (hysteresis) -----------------------------------------
console.log('--- leaderAttach ---');
// ADVERSE_FRAC in looped-network.js is 0.75, so trigger = halfW * (1 - 1.5) = -halfW/2.
// Starting 'right', the side only flips left once the centre is more than halfW/2 PAST the
// anchor on the left -- flipping later means the leader never has to reach across the text.
const AF = 0.75, HW = 10;   // trigger = -5
report(Geom.leaderAttach(undefined, 50, HW, 0, AF).side === 'right', 'no previous side defaults right');
report(Geom.leaderAttach('right', 50, HW, 0, AF).side === 'right', 'stays right well right of anchor');
report(Geom.leaderAttach('right', -2, HW, 0, AF).side === 'right', 'stays right just left of anchor (hysteresis)');
report(Geom.leaderAttach('right', -8, HW, 0, AF).side === 'left', 'flips left past the trigger');
report(Geom.leaderAttach('left', -8, HW, 0, AF).side === 'left', 'stays left once flipped');
// The band is symmetric: [-halfW/2, +halfW/2]. Coming from 'left' the centre must get more
// than halfW/2 to the RIGHT of the anchor before it flips back, so +2 is not enough and +8 is.
report(Geom.leaderAttach('left', 2, HW, 0, AF).side === 'left', 'stays left just right of anchor (hysteresis)');
report(Geom.leaderAttach('left', 8, HW, 0, AF).side === 'right', 'flips back right past +trigger');
report(Geom.leaderAttach('left', -3, HW, 0, AF).side === 'left', 'does not flip back inside the dead band');
// The dead band is what stops the flicker: one offset, two answers, depending on history.
const bandRight = Geom.leaderAttach('right', -3, HW, 0, AF).side;
const bandLeft = Geom.leaderAttach('left', -3, HW, 0, AF).side;
report(bandRight === 'right' && bandLeft === 'left',
	'same position, different side by history (this IS the hysteresis)');
// And the attachment x agrees with the no-hysteresis helper whenever the side agrees.
eq(Geom.leaderAttach('right', 50, HW, 0, AF).x, Geom.leaderAttachX(50, HW, 0), 'attach x matches when side agrees');

// ---- dataLabelBoxHeight ------------------------------------------------
console.log('--- dataLabelBoxHeight ---');
eq(Geom.dataLabelBoxHeight(1, 10, 12), 11, 'one line is fontSize * 1.1');
eq(Geom.dataLabelBoxHeight(3, 10, 12), 11 + 24, 'each extra line adds a line height');
eq(Geom.dataLabelBoxHeight(0, 10, 12), 11, 'zero lines never goes below one');

// ---- maskRect ----------------------------------------------------------
console.log('--- maskRect ---');
// Node/link label: x is the LEFT edge, y is the first line's BASELINE, so the box top sits
// 0.85 of a font size above y.
const m1 = Geom.maskRect(100, 200, 30, 11, 'start', 'top', 10, 0.4);
report(near(m1.x, 99.6) && near(m1.y, 200 - 8.5 - 0.4) && near(m1.width, 30.8) && near(m1.height, 11.8),
	'left-anchored, baseline-relative', JSON.stringify(m1));
// Text label: x/y are the box CENTRE both ways.
const m2 = Geom.maskRect(100, 200, 30, 12, 'middle', 'middle', 10, 0.4);
report(near(m2.x, 85 - 0.4) && near(m2.y, 194 - 0.4) && near(m2.width, 30.8) && near(m2.height, 12.8),
	'centred both ways', JSON.stringify(m2));
// Padding widens on both sides, never one.
const m3 = Geom.maskRect(0, 0, 10, 10, 'start', 'top', 0, 1);
report(near(m3.width, 12) && near(m3.height, 12) && near(m3.x, -1), 'pad applies on both sides');

// ---- labelBoxAt (Task 332) ----------------------------------------------
console.log('--- labelBoxAt ---');
// maskRect is now nothing but padding on top of this, and the reason the box moved out into its
// own function is that FOUR call sites need it: the mask, bbox(), the collision obstacle, and the
// leader attachment. While every Text label was centred those four could each do the arithmetic
// themselves and agree by luck; with lb.align in the document they cannot, and a leader reaching
// for a box that is not where the mask was painted is the failure that would follow.
const b1 = Geom.labelBoxAt(100, 200, 30, 12, 'middle', 'middle', 10);
report(near(b1.x, 85) && near(b1.y, 194), 'centred: the point is the box centre', JSON.stringify(b1));
// EPANET's own convention, and the whole reason this vocabulary grew two new words: the stored
// point is the TOP-LEFT CORNER, so the box hangs down and to the right of it with no arithmetic.
const b2 = Geom.labelBoxAt(100, 200, 30, 12, 'start', 'hanging', 10);
report(near(b2.x, 100) && near(b2.y, 200), 'top-left: the box hangs off the point itself', JSON.stringify(b2));
// Right-justified, which Task 342 puts in the popup. The box ends at the point.
const b3 = Geom.labelBoxAt(100, 200, 30, 12, 'end', 'middle', 10);
report(near(b3.x, 70) && near(b3.y, 194), 'right-justified: the box ends at the point', JSON.stringify(b3));
// Unchanged for a data label: y is the first line's BASELINE, so the top is an ascent above it.
const b4 = Geom.labelBoxAt(100, 200, 30, 11, 'start', 'top', 10);
report(near(b4.x, 100) && near(b4.y, 191.5), 'baseline-relative is untouched', JSON.stringify(b4));
// The three horizontal modes must actually be three: a left-anchored and a right-anchored label at
// one point differ by a full width, which is exactly the distance an EPANET title block was wrong
// by before Task 332 -- and the check is worth stating because 'end' was the newly added branch.
report(near(b2.x - b3.x, 30) && near(b3.x + b3.w, b2.x),
	'left and right anchoring differ by a whole width, meeting at the point', (b2.x - b3.x));

// ---- segmentRectRange (repeated link labels) ----------------------------
console.log('--- segmentRectRange ---');
// WHY THIS IS A CLIP AND NOT A BOUNDING-BOX TEST, which is the mistake it was written to fix: a
// 1000-unit pipe crossing a 750-unit window has a bounding box that overlaps the window, so a
// box test accepts the WHOLE pipe and every label on it. The cull then culls nothing. Only the
// clipped RANGE says which part of the line is actually on screen.
const R = { x0: 0, y0: 0, x1: 100, y1: 100 };
const c1 = Geom.segmentRectRange(-100, 50, 300, 50, R);
report(c1 && near(c1.t0, 0.25) && near(c1.t1, 0.5), 'a line crossing right through is clipped at both ends',
	JSON.stringify(c1));
const c2 = Geom.segmentRectRange(10, 10, 90, 90, R);
report(c2 && near(c2.t0, 0) && near(c2.t1, 1), 'a line wholly inside keeps all of itself', JSON.stringify(c2));
report(Geom.segmentRectRange(200, 200, 300, 300, R) === null, 'a line wholly outside is null');
report(Geom.segmentRectRange(-50, 50, -10, 50, R) === null, 'and so is one that stops short of the rect');
const c3 = Geom.segmentRectRange(50, 50, 200, 50, R);
report(c3 && near(c3.t0, 0) && near(c3.t1, 1 / 3), 'a line starting inside is clipped only at the far end',
	JSON.stringify(c3));
// A zero-length segment is a real case (a duplicated vertex) and must not divide by zero.
const c4 = Geom.segmentRectRange(50, 50, 50, 50, R);
report(c4 && c4.t0 === 0 && c4.t1 === 1, 'a zero-length segment inside the rect is inside it', JSON.stringify(c4));
report(Geom.segmentRectRange(500, 500, 500, 500, R) === null, '...and outside it is outside it');
// Exactly along an edge counts as inside: for a cull, keeping a borderline label is the harmless
// direction to err in.
const c5 = Geom.segmentRectRange(-10, 0, 110, 0, R);
report(c5 && near(c5.t1 - c5.t0, 100 / 120), 'a line along the top edge is kept, not dropped',
	JSON.stringify(c5));


// ---------------------------------------------------------------------------------------------
// 7. alignedLabelAnchor — GIS-style labels drawn ALONG the pipe (Task 329)
//
// What can actually be wrong here, in rough order of how bad it looks on screen:
//   * text rendering UPSIDE DOWN on any pipe drawn right-to-left -- the whole reason the angle is
//     normalised before anything else happens;
//   * the flip changing which side the label lands on, so that one physical pipe labels
//     differently depending on which end the user clicked first. That is the assertion below that
//     matters most, because it is invisible on a test network drawn all one way and glaring on a
//     real one;
//   * the offset normal pointing DOWN-screen, which silently makes "top" mean bottom;
//   * a multi-line block straddling the pipe instead of sitting entirely on one side.
{
	const near = (a, b, tol) => Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol);
	const O = { gap: 5, fontSize: 10, lineHeight: 12, nLines: 3 };

	// -- readability: never upside down, whatever direction the pipe runs
	let worstAngle = 0;
	for (let deg = -180; deg < 180; deg += 7) {
		const r = Math.PI * deg / 180;
		const a = Geom.alignedLabelAnchor(0, 0, 100 * Math.cos(r), 100 * Math.sin(r), O);
		worstAngle = Math.max(worstAngle, Math.abs(a.angle));
	}
	report(worstAngle <= 90 + 1e-9, 'aligned: text is never upside down at any pipe bearing',
		`max |angle| = ${worstAngle.toFixed(1)}°`);

	// -- THE READABILITY BIAS: where the flip happens (Task 351, Tom 2026-08-15)
	//
	// THE DEFECT THE NUMBER FIXES IS A KNIFE EDGE ON VERTICAL. The window is (bias - 180, bias],
	// so at 90 the decision boundary sits exactly where most water mains are drawn -- and two
	// parallel vertical pipes drawn in opposite directions land either side of it and read in
	// opposite directions, over a difference of a tenth of a degree. These four checks are the
	// before and after of exactly that pair.
	{
		// TWO DIFFERENT PIPES, not one pipe drawn twice -- that distinction is the whole point, and
		// the first draft of this check got it wrong. A pipe and its own reverse always agree (the
		// direction-invariance check below guarantees it). These two lean a tenth of a degree to
		// OPPOSITE sides of vertical, so they are genuinely different bearings, and at bias 90 they
		// sit either side of the doorway.
		const leanA = { x: 0.1, y: -100 };   // a hair west of straight up  (deg -89.94)
		const leanB = { x: 0.1, y: 100 };    // a hair west of straight down (deg +89.94)
		const a90 = Geom.alignedLabelAnchor(0, 0, leanA.x, leanA.y, Object.assign({ bias: 90 }, O));
		const b90 = Geom.alignedLabelAnchor(0, 0, leanB.x, leanB.y, Object.assign({ bias: 90 }, O));
		report(Math.abs(a90.angle - b90.angle) > 170,
			'bias 90: two pipes a tenth of a degree apart read in OPPOSITE directions -- the defect',
			`${a90.angle.toFixed(2)}° vs ${b90.angle.toFixed(2)}°`);
		const a110 = Geom.alignedLabelAnchor(0, 0, leanA.x, leanA.y, Object.assign({ bias: 110 }, O));
		const b110 = Geom.alignedLabelAnchor(0, 0, leanB.x, leanB.y, Object.assign({ bias: 110 }, O));
		report(Math.abs(a110.angle - b110.angle) < 1,
			'bias 110: the same two pipes read the same way',
			`${a110.angle.toFixed(2)}° vs ${b110.angle.toFixed(2)}°`);
		// The window really is (bias - 180, bias], so the worst tilt a label can take is the bias
		// itself -- 20 degrees past vertical at the default. A head-tilt, never upside down.
		let worst = 0;
		for (let deg = -180; deg < 180; deg += 1) {
			const r = Math.PI * deg / 180;
			const a = Geom.alignedLabelAnchor(0, 0, 100 * Math.cos(r), 100 * Math.sin(r),
				Object.assign({ bias: 110 }, O));
			worst = Math.max(worst, Math.abs(a.angle));
		}
		report(worst <= 110 + 1e-9, 'bias 110: no label is ever tilted further than the bias itself',
			`max |angle| = ${worst.toFixed(1)}°`);
		// A horizontal pipe must stay horizontal at every legal bias, or the setting has broken the
		// commonest case in the drawing while fixing the second commonest.
		let horizOk = true;
		for (let b = 90; b <= 135; b += 5) {
			const e = Geom.alignedLabelAnchor(0, 0, 100, 0, Object.assign({ bias: b }, O));
			const w = Geom.alignedLabelAnchor(0, 0, -100, 0, Object.assign({ bias: b }, O));
			if (Math.abs(e.angle) > 1e-9 || Math.abs(w.angle) > 1e-9) { horizOk = false; }
		}
		report(horizOk, 'an east-west pipe reads horizontally at every bias in range');
	}

	// -- THE ONE THAT MATTERS: drawing direction must not change the result
	let maxDrift = 0;
	for (let deg = -180; deg < 180; deg += 7) {
		const r = Math.PI * deg / 180, X = 100 * Math.cos(r), Y = 100 * Math.sin(r);
		const f = Geom.alignedLabelAnchor(0, 0, X, Y, O);
		const b = Geom.alignedLabelAnchor(X, Y, 0, 0, O);
		maxDrift = Math.max(maxDrift, Math.hypot(f.x - b.x, f.y - b.y), Math.abs(f.angle - b.angle));
	}
	report(near(maxDrift, 0, 1e-9), 'aligned: same pipe labels identically drawn either direction',
		`max drift = ${maxDrift.toExponential(1)}`);

	// -- "top" really is up-screen (SVG y grows downward, so a top label has the smaller y)
	const eastTop = Geom.alignedLabelAnchor(0, 0, 100, 0, Object.assign({ side: 1 }, O));
	const eastBot = Geom.alignedLabelAnchor(0, 0, 100, 0, Object.assign({ side: -1 }, O));
	report(eastTop.y < 0 && eastBot.y > 0, 'aligned: side +1 is above the pipe, -1 below',
		`top y=${eastTop.y.toFixed(1)}, bottom y=${eastBot.y.toFixed(1)}`);

	// -- the two sides are genuine CANDIDATES: distinct, and neither one on the pipe
	report(Math.abs(eastTop.y - eastBot.y) > O.gap, 'aligned: the two sides are distinct candidates');

	// -- a multi-line block sits ENTIRELY on its side. Rotation maps +y' to the bottom side, so
	//    every subsequent line steps by +lineHeight along -n; check the far line has not crossed.
	for (const side of [1, -1]) {
		const a = Geom.alignedLabelAnchor(0, 0, 100, 0, Object.assign({}, O, { side }));
		const lastY = a.y + (O.nLines - 1) * O.lineHeight;   // horizontal pipe: +y' is +y
		const ys = [a.y, lastY];
		report(ys.every(y => side > 0 ? y < 0 : y > 0),
			`aligned: a ${O.nLines}-line block stays wholly ${side > 0 ? 'above' : 'below'} the pipe`,
			`lines span y ${Math.min(...ys).toFixed(1)}..${Math.max(...ys).toFixed(1)}`);
	}

	// -- degenerate zero-length link returns a point, not NaN
	const z = Geom.alignedLabelAnchor(40, 40, 40, 40, O);
	report(isFinite(z.x) && isFinite(z.y) && isFinite(z.angle), 'aligned: zero-length link is finite',
		`(${z.x.toFixed(1)}, ${z.y.toFixed(1)}) @ ${z.angle}°`);

	// -- frac addresses a position along the pipe, not just the midpoint
	const q = Geom.alignedLabelAnchor(0, 0, 100, 0, Object.assign({ frac: 0.25 }, O));
	report(near(q.x, 25), 'aligned: frac positions the label along the pipe', `x=${q.x}`);
}


// ---------------------------------------------------------------------------------------------
// 8. pointToPolylineDistance — how "the side with least congestion" is actually measured (Task 329)
//
// staticObstacleBoxes() collects nodes and Text labels and has NEVER contained links, so a data
// label has always been free to sit straight on top of a pipe. Aligning labels along pipes is what
// made that visible (Tom's Elm Street screenshot). Distance to the LINE is the right measure rather
// than to a bounding box: a diagonal pipe's box is mostly empty space, and boxing it would push
// labels away from ground that is actually clear -- which is the assertion on the diagonal below.
{
	const near = (a, b) => Math.abs(a - b) < 1e-9;
	const seg = [{ x: -10, y: 0 }, { x: 10, y: 0 }];
	report(near(Geom.pointToPolylineDistance(seg, 0, 5), 5), 'dist: perpendicular from mid-segment');
	report(near(Geom.pointToPolylineDistance(seg, 20, 0), 10), 'dist: past the end measures to the ENDPOINT, not the infinite line',
		'20 -> ' + Geom.pointToPolylineDistance(seg, 20, 0));
	report(near(Geom.pointToPolylineDistance([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }], 12, 5), 2),
		'dist: a bent polyline measures to the NEAREST segment, not the first');
	// A 45-degree pipe from (0,0) to (100,100): the point (90,10) is far from the LINE and well
	// inside its bounding box. Boxing the pipe would call this congested; it is not.
	const diag = [{ x: 0, y: 0 }, { x: 100, y: 100 }];
	const d = Geom.pointToPolylineDistance(diag, 90, 10);
	report(d > 50, 'dist: a diagonal pipe does not block its own bounding box', d.toFixed(1) + ' units clear');
	report(Geom.pointToPolylineDistance([], 0, 0) === Infinity, 'dist: no points is infinitely far, never 0',
		'a 0 here would read as "congested" and flip every label');
	report(near(Geom.pointToPolylineDistance([{ x: 3, y: 4 }], 0, 0), 5), 'dist: a single point is handled, not skipped');
	// Degenerate zero-length segment inside a real polyline (coincident vertices happen on import).
	report(near(Geom.pointToPolylineDistance([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 8 }], 0, 4), 0),
		'dist: a repeated vertex does not produce NaN');
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
