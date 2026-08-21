// Weir Flow Irregular (wi_) -- a worked example, anchored against the source method.
//
//   node dev/calc-spike/wi-harness.js
//
// WHAT THE PAGE IS. The broad-crested weir equation Q = Cw L h^(3/2) -- the one ws-harness.js
// anchors against the critical-flow result -- applied to a crest whose elevation VARIES. The
// crest is given as stations and elevations, so between two stations it is a straight line, and
// the discharge over that segment is the equation integrated along it:
//
//     Q = integral of Cw d(x)^(3/2) dx   over the segment,   d(x) = HWE - z(x), never below 0
//
// With z linear the integral has a closed form, and that closed form is what the page evaluates:
// substituting dx = -dd/s, where s = (z1 - z0)/L is the crest slope,
//
//     Q = Cw / (2.5 s) * ( d0^(5/2) - d1^(5/2) )        (s = 0 degenerates to Cw L d0^(3/2))
//
// SO THE ANCHOR IS THE INTEGRAL, NOT THE CLOSED FORM. This harness evaluates the same integral
// by Simpson's rule over each segment, in its own arithmetic, and requires the page's answer to
// match. A closed form derived with a slipped exponent or a missing 2.5 disagrees with the
// integral it claims to be; nothing else here could tell.
//
// The supporting anchors are all things the integral must obey no matter what the coefficient is:
//
//   * A LEVEL CREST must reduce exactly to Cw L h^(3/2), which is the ws_ page's whole equation.
//   * THE 3/2 EXPONENT, dimensionlessly: scale every depth by 4 and every discharge must be
//     multiplied by exactly 8, whatever the profile's shape.
//   * SUBDIVISION INVARIANCE: splitting a straight segment at its midpoint adds a station and
//     changes nothing. An integral has that property; a per-segment fudge factor does not.
//   * MIRROR SYMMETRY: surveying the same crest from the other bank gives the same discharge.
//   * THE WATERLINE: where the crest climbs out of the water partway along a segment, the
//     discharge must equal that of the segment truncated at the waterline -- the dry part
//     contributes nothing, and the depth clip is what makes the closed form land there.
//
// NO UNITS ARE INVOLVED ANYWHERE, by design: the page has no unit selects, because Cw carries the
// unit system (about 3.0 in US customary, about 1.84 in SI). Numbers go in as typed. That is the
// same design ws_ has, and ws-harness.js states the relation between the two coefficients.
//
// MUTATIONS TRIED, all caught:
//   1. the 2.5 in Cw/(2.5 s) -> 1.5              (the integral, on every sloping segment)
//   2. d^2.5 -> d^2 in the sloping branch        (the integral, and the 3/2 exponent)
//   3. the level-crest branch Cw*l*d0^1.5 -> Cw*l*d0    (the level-crest reduction)
//   4. d = max(hw - elev, 0) -> hw - elev        (the waterline case)
//   5. qc accumulates qi twice                   (the cumulative column)
// One mutation was tried and is EQUIVALENT rather than uncaught: swapping d0 for d1 in the
// level-crest branch. That branch runs only when s = 0, and s = 0 means d0 = d1, so there is no
// input that distinguishes them. Recorded here so nobody tries it again and reports a hole.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

const { loadCalculator, makeReporter } = require('./calc-page.js');

const r = makeReporter('Weir Flow Irregular (wi_) worked example');

// The qi/qc/d cells are written with .toFixed(2), so a displayed discharge is only good to half
// a hundredth. Comparisons are made against that, not against a relative tolerance, which would
// be far too strict on the small numbers and far too loose on the large ones.
function nearDisplayed(actual, expected, dp, label) {
	const slack = 0.5 * Math.pow(10, -dp) + Math.abs(expected) * 1e-9;
	r.report(Math.abs(actual - expected) <= slack, label,
		`got ${actual}, want ${expected.toFixed(6)} (±${slack})`);
}

// ---- the reference: the integral itself, by Simpson's rule -------------------------------
//
// One segment, z linear from z0 to z1 over length L. Simpson on 2000 panels; the integrand is
// smooth wherever the segment does not cross the waterline, and where it does the harness splits
// at the crossing first (below) rather than letting Simpson straddle the kink.
function simpsonSegment(x0, z0, x1, z1, hw, cw) {
	const n = 2000, L = x1 - x0;
	if (L === 0) { return 0; }
	const h = L / n;
	const f = function (x) {
		const z = z0 + (z1 - z0) * (x - x0) / L;
		const d = Math.max(hw - z, 0);
		return cw * Math.pow(d, 1.5);
	};
	let sum = f(x0) + f(x1);
	for (let i = 1; i < n; i += 1) {
		sum += f(x0 + i * h) * (i % 2 ? 4 : 2);
	}
	return sum * h / 3;
}

/** The same integral, split at the waterline first so Simpson never straddles the kink. */
function segmentQ(x0, z0, x1, z1, hw, cw) {
	if ((z0 - hw) * (z1 - hw) < 0) {
		const t = (hw - z0) / (z1 - z0);
		const xm = x0 + t * (x1 - x0);
		return simpsonSegment(x0, z0, xm, hw, hw, cw) + simpsonSegment(xm, hw, x1, z1, hw, cw);
	}
	return simpsonSegment(x0, z0, x1, z1, hw, cw);
}

/** The whole crest. */
function totalQ(stations, elevations, hw, cw) {
	let q = 0;
	for (let i = 1; i < stations.length; i += 1) {
		q += segmentQ(stations[i - 1], elevations[i - 1], stations[i], elevations[i], hw, cw);
	}
	return q;
}

// ---- driving the page --------------------------------------------------------------------
/** Loads the page, sizes its table to the profile, and enters it. Numbers as typed, no units. */
function loadProfile(stations, elevations, hw, cw) {
	const page = loadCalculator('Weir-Flow-Irregular.php');
	page.initRows();
	while (page.rowCount() > stations.length) { page.removeRow(); }
	while (page.rowCount() < stations.length) { page.addRow(); }
	page.set({ hw: hw, cw: cw });
	stations.forEach(function (x, i) {
		page.setRow(i, { station: x, elevation: elevations[i] });
	});
	page.run();
	return page;
}

/**
 * parseFloat of a result cell, NaN and all. Deliberately NOT page.rowNum(), which throws on a
 * cell that is not a number: a mutation that poisons a cell should turn this harness RED, not
 * abort it -- an aborted run reports nothing about the other thirty checks.
 */
function cell(page, name, row) { return parseFloat(page.rowHtml(name, row)); }

/** The page's total discharge: the cumulative column's last entry. */
function pageTotal(page, n) { return cell(page, 'qc', n - 1); }

// ---- the worked crest ---------------------------------------------------------------------
//
// A 40 ft natural crest surveyed at five stations, dipping and rising, with a high water
// elevation of 100.0 ft -- so the depths over the crest are 1.0, 1.5, 0.5, 2.0 and 0.8 ft. Every
// segment slopes (no accidental level-crest shortcut) and none of them is dry.
const X = [0, 10, 20, 30, 40];
const Z = [99.0, 98.5, 99.5, 98.0, 99.2];
const HW = 100.0;
const CW = 3.0;

// =========================================================================================
r.section('the page reads its own table and reports the depth over each station');

const page = loadProfile(X, Z, HW, CW);
r.eq(page.rowCount(), X.length, 'the table holds one row per surveyed station');
X.forEach(function (x, i) {
	nearDisplayed(cell(page, 'd', i), Math.max(HW - Z[i], 0), 2,
		`station ${x}: depth over the crest is HWE - elevation`);
});

// =========================================================================================
r.section('every segment against the integral it is the closed form of');

for (let i = 1; i < X.length; i += 1) {
	const want = segmentQ(X[i - 1], Z[i - 1], X[i], Z[i], HW, CW);
	nearDisplayed(cell(page, 'qi', i), want, 2,
		`segment ${X[i - 1]}-${X[i]}: discharge matches Simpson's rule on Cw d^1.5 dx`);
}
nearDisplayed(pageTotal(page, X.length), totalQ(X, Z, HW, CW), 2,
	'and the whole crest matches the integral over the whole crest');

// The cumulative column is the integral from the first station to this one -- compared against
// the exact partial sums rather than against the DISPLAYED qi values, which are rounded to two
// decimals and would accumulate their own rounding into the expectation.
(function () {
	let run = 0;
	for (let i = 1; i < X.length; i += 1) {
		run += segmentQ(X[i - 1], Z[i - 1], X[i], Z[i], HW, CW);
		nearDisplayed(cell(page, 'qc', i), run, 2, `the cumulative column at station ${X[i]}`);
	}
}());

// =========================================================================================
r.section('a level crest reduces to the broad-crested weir equation itself');

// Cw L h^(3/2) with Cw = 3.0, L = 40 ft, h = 2.5 ft: 3 * 40 * 2.5^1.5 = 474.34 cfs.
(function () {
	const level = [97.5, 97.5, 97.5, 97.5, 97.5];
	const p = loadProfile(X, level, HW, CW);
	const want = CW * 40 * Math.pow(2.5, 1.5);
	nearDisplayed(pageTotal(p, X.length), want, 2,
		'a level 40 ft crest under 2.5 ft of head passes Cw L h^1.5');
	// Segment by segment, too: each 10 ft length carries a quarter of it.
	for (let i = 1; i < X.length; i += 1) {
		nearDisplayed(cell(p, 'qi', i), CW * 10 * Math.pow(2.5, 1.5), 2,
			`each level 10 ft segment carries Cw * 10 * h^1.5`);
	}
}());

// =========================================================================================
r.section('the 3/2 exponent, dimensionlessly');

// Scaling every depth by 4 must multiply every discharge by exactly 4^1.5 = 8, whatever the
// shape of the crest. Depths are scaled by moving the CREST, not the water, so the profile keeps
// its irregularity.
(function () {
	const deeper = Z.map(z => HW - 4 * (HW - z));
	const p = loadProfile(X, deeper, HW, CW);
	r.close(pageTotal(p, X.length) / pageTotal(page, X.length), 8, 1e-4,
		'four times the depth is eight times the discharge');
	const nine = Z.map(z => HW - 9 * (HW - z));
	const p9 = loadProfile(X, nine, HW, CW);
	r.close(pageTotal(p9, X.length) / pageTotal(page, X.length), 27, 1e-4,
		'nine times the depth is twenty-seven times the discharge');
}());

// Cw is a plain multiplier -- the one thing in the equation that is linear.
(function () {
	const p = loadProfile(X, Z, HW, CW * 2);
	r.close(pageTotal(p, X.length) / pageTotal(page, X.length), 2, 1e-4,
		'doubling the coefficient doubles the discharge');
}());

// =========================================================================================
r.section('subdivision invariance -- a station added on a straight segment changes nothing');

// Split the 20-30 segment at station 25. Its crest elevation there is the midpoint of a straight
// line, so the surveyed crest is the identical crest, and the discharge must be identical.
(function () {
	const xs = [0, 10, 20, 25, 30, 40];
	const zs = [99.0, 98.5, 99.5, (99.5 + 98.0) / 2, 98.0, 99.2];
	const p = loadProfile(xs, zs, HW, CW);
	nearDisplayed(pageTotal(p, xs.length), pageTotal(page, X.length), 2,
		'adding a redundant station leaves the total discharge unchanged');
	nearDisplayed(cell(p, 'qi', 3) + cell(p, 'qi', 4), cell(page, 'qi', 3), 2,
		'and the split segment\'s two halves add up to the segment it replaced');
}());

// =========================================================================================
r.section('mirror symmetry -- the same crest surveyed from the other bank');

(function () {
	const xs = X.map(x => X[X.length - 1] - x).reverse();
	const zs = Z.slice().reverse();
	const p = loadProfile(xs, zs, HW, CW);
	nearDisplayed(pageTotal(p, xs.length), pageTotal(page, X.length), 2,
		'reversing the survey gives the same discharge');
}());

// =========================================================================================
r.section('the waterline -- a crest that climbs out of the water partway along a segment');

// Stations 0-10 with the crest rising from 99.0 to 101.0 ft: the water ends at station 5.
// The discharge must be that of the WET half alone, 0 to 5, and nothing beyond it.
(function () {
	const xs = [0, 10, 20];
	const zs = [99.0, 101.0, 101.0];
	const p = loadProfile(xs, zs, HW, CW);
	const want = segmentQ(0, 99.0, 10, 101.0, HW, CW);
	nearDisplayed(cell(p, 'qi', 1), want, 2,
		'a segment crossing the waterline passes only what its wet part passes');
	// Stated the other way, because it is the physically meaningful statement: it equals the
	// discharge of the same crest surveyed with a station AT the waterline and stopping there.
	const truncated = loadProfile([0, 5], [99.0, 100.0], HW, CW);
	nearDisplayed(cell(p, 'qi', 1), cell(truncated, 'qi', 1), 2,
		'which is exactly the crest truncated at the waterline');
	nearDisplayed(cell(p, 'qi', 2), 0, 2, 'and a wholly dry segment passes nothing');
	nearDisplayed(cell(p, 'd', 1), 0, 2, 'a crest above the water shows zero depth, never a negative one');
}());

// =========================================================================================
r.section('degenerate geometry does not produce a degenerate answer');

(function () {
	// Two stations at the same place: zero length, zero discharge, and no division by zero.
	const p = loadProfile([0, 0, 10], [99.0, 99.0, 99.0], HW, CW);
	nearDisplayed(cell(p, 'qi', 1), 0, 2, 'a zero-length segment passes nothing');
	nearDisplayed(cell(p, 'qi', 2), CW * 10 * Math.pow(1.0, 1.5), 2,
		'and the real segment beside it is unaffected');
	// A crest exactly at the water surface passes nothing, from either branch of the formula.
	const flush = loadProfile([0, 10], [100.0, 100.0], HW, CW);
	nearDisplayed(cell(flush, 'qi', 1), 0, 2, 'a crest flush with the water surface passes nothing');
}());

r.finish();
