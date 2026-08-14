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

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
