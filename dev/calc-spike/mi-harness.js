// Manning Irregular (mi_) -- a worked example, anchored against the source methods.
//
//   node dev/calc-spike/mi-harness.js
//
// WHAT THE PAGE IS. A natural cross-section surveyed as stations and elevations, divided into
// REGIONS by bank markers (left overbank / main channel / right overbank), each region carrying
// its own Manning discharge. Four separate published results are stacked to get there, and this
// harness anchors each of them independently:
//
//   * SEGMENT GEOMETRY. Between two stations the bed is a straight line, so the wetted area is
//     the integral of depth along it, the wetted perimeter is the LENGTH OF THAT LINE where it is
//     under water, and the top width is its horizontal projection. All three are recomputed here
//     from the geometry itself -- the area by Simpson's rule on the depth, the perimeter as the
//     plain Euclidean distance between the two ends of the wetted bed -- never from the closed
//     forms the page evaluates.
//   * COMPOSITE ROUGHNESS, the Horton and Einstein equal-velocity formula, which the page's own
//     column heading calls 617 after its equation number in French, Open-Channel Hydraulics
//     (eq. 6-17; the same relation is Chow 1959 eq. 6-17):
//         n_c = [ sum( P_i n_i^(3/2) ) / P ]^(2/3)
//     Recomputed here from the segment perimeters and roughnesses.
//   * MANNING'S EQUATION for the region: V = (1/n_c) R^(2/3) S0^(1/2) in SI, R = A/P, Q = V A.
//     (Chow eq. 5-6.) The SI form is used because that is what the page solves in; the harness
//     converts to US units afterwards, from the exact definition of a foot.
//   * BOUNDARY SHEAR STRESS, tau = gamma d S0 -- the depth-slope product (Chow section 7-7),
//     with gamma = rho g re-derived here from 1000 kg/m3, standard gravity, and the exact
//     definitions of the pound-force and the foot.
//
// AND FOUR THINGS THE GEOMETRY MUST OBEY WHATEVER THE COEFFICIENTS ARE:
//
//   * a region of uniform roughness has that roughness as its composite;
//   * SUBDIVISION INVARIANCE -- a redundant station on a straight bank changes nothing;
//   * V goes as S0^(1/2) exactly, and as 1/n exactly;
//   * a segment that leaves the water partway along contributes exactly its wet part.
//
// WHY IT BUILDS ITS ROWS WITH addRow() AND NOT initRows(). This page's own initializer seeds its
// sample section THROUGH THE COOKIE -- it writes a cookie string and reads it back with
// cookieToForm(), which walks a real <form> element in document order. calc-page.js's form is a
// bag of named controls, not a document, so that path is out of reach here. What it would test --
// that the shipped default section is right in both presets -- is already covered by
// dev/browser-pass/mi-defaults.js, which drives the real page in a real browser (Task 233). What
// is NOT covered anywhere else is whether the arithmetic is right, and that is this file.
//
// THE REGION FROUDE NUMBER (fr617) IS A COMPOUND-SECTION ASSERTION ON PURPOSE.
// closeRegion() swaps the REGION totals for area, wetted perimeter AND top width in before it
// recomputes, so Fr = V sqrt(T/(g A)) is a region quantity throughout. It once swapped only the
// first two, leaving Manning.t holding the LAST SEGMENT's top width, and every multi-segment
// region came out low by sqrt(T_region/T_last_segment) -- on the section below the main channel
// spans stations 30-70 with T = 40 ft in three segments of 10, 20 and 10 ft, and the page printed
// 0.28 where the definition gives 0.554 (ROADMAP Task 474). A one-segment region was unaffected,
// which is why the two overbanks always agreed. So this file asserts fr617 on BOTH shapes: the
// single-segment overbanks prove the fix did not break the case that already worked, and the
// three-segment main channel is the case that was wrong.
//
// MUTATIONS TRIED, all caught:
//   1. Manning R^(2/3) -> R^(1/2)                  (every region's velocity and discharge)
//   2. composite n exponent (2/3) -> (1/2)          (the mixed-roughness region)
//   3. wedgeWettedPerimeter d/slope -> d*slope      (wetted perimeter, R, and Q)
//   4. segment area (d0^2-d1^2)/(2s) -> (d0-d1)/(2s)  (area, R and Q on every sloping segment)
//   5. tau = d * s0 -> d * s0 * s0                  (the shear-stress column)
//   6. top width t = l*pw/hypotenuse -> l           (the Froude number, on the sloping regions)
//   7. region top width tc dropped, t left per-segment  (the main channel's Froude number)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

const { loadCalculator, makeReporter } = require('./calc-page.js');

const r = makeReporter('Manning Irregular (mi_) worked example');

// Every row cell is written with .toFixed(2), so what can be asserted about a displayed number is
// half a hundredth of whatever unit it is in -- not a relative tolerance, which would be absurdly
// strict on a composite n of 0.029 and far too loose on a discharge of 823.
function nearDisplayed(actual, expected, dp, label) {
	const slack = 0.5 * Math.pow(10, -dp) + Math.abs(expected) * 1e-9;
	r.report(Math.abs(actual - expected) <= slack, label,
		`got ${actual}, want ${expected.toFixed(6)} (±${slack})`);
}

/** parseFloat of a result cell, NaN and all, so a poisoned cell fails rather than aborting. */
function cell(page, name, row) { return parseFloat(page.rowHtml(name, row)); }

// ---- reference arithmetic, from the exact definitions --------------------------------------
const FT = 0.3048;                          // m, exactly
const LBF = 4.4482216152605;                // N, exactly
const G = 9.80665;                          // m/s2, standard gravity
const RHO = 1000;                           // kg/m3
const GAMMA_PCF = RHO * G * FT * FT * FT / LBF;   // lbf/ft3 -- 62.428

// ---- the surveyed section -------------------------------------------------------------------
//
// A 100 ft floodplain: a left overbank falling from elevation 6 to 3, a main channel from 3 down
// to 1 and back, and a right overbank climbing 3 to 6. The water surface is at 5.0 ft, so BOTH
// overbank end segments leave the water partway along -- the left one at station 10 and the right
// one at station 90 -- and the two innermost stations are equal, giving one exactly level segment
// beside four sloping ones. Roughness varies inside the main channel (0.035 / 0.025 / 0.030) so
// the composite formula has something to composite; the overbanks are a single segment each.
const X = [0, 30, 40, 60, 70, 100];
const Z = [6, 3, 1, 1, 3, 6];
const N = [null, 0.040, 0.035, 0.025, 0.030, 0.040];
const BANK = [null, true, false, false, true, true];
const WS = 5;
const S0 = 0.0025;

// Region i is the run of segments ending at each bank-marked station.
const REGIONS = (function () {
	const out = [];
	let start = 1;
	for (let i = 1; i < X.length; i += 1) {
		if (BANK[i]) { out.push({ from: start, to: i }); start = i + 1; }
	}
	return out;
}());

// ---- the reference geometry, computed from the definitions -----------------------------------
/** The wetted x-interval of one segment, or null if the segment is dry. */
function wetSpan(x0, z0, x1, z1, ws) {
	if (x1 === x0) { return null; }
	const at = x => z0 + (z1 - z0) * (x - x0) / (x1 - x0);
	let a = x0, b = x1;
	if (z0 >= ws && z1 >= ws) { return null; }
	if (z0 >= ws) { a = x0 + (ws - z0) / (z1 - z0) * (x1 - x0); }
	if (z1 >= ws) { b = x0 + (ws - z0) / (z1 - z0) * (x1 - x0); }
	return { a: a, b: b, za: at(a), zb: at(b) };
}

/** Wetted area, by Simpson's rule on the depth -- the definition A = integral of d dx. */
function segArea(x0, z0, x1, z1, ws) {
	const span = wetSpan(x0, z0, x1, z1, ws);
	if (!span || span.b === span.a) { return 0; }
	const n = 1000, h = (span.b - span.a) / n;
	const d = x => Math.max(ws - (z0 + (z1 - z0) * (x - x0) / (x1 - x0)), 0);
	let sum = d(span.a) + d(span.b);
	for (let i = 1; i < n; i += 1) { sum += d(span.a + i * h) * (i % 2 ? 4 : 2); }
	return sum * h / 3;
}

/** Wetted perimeter: the straight-line length of the bed between the ends of the wet span.
 *  A VERTICAL WALL has no wet SPAN and a real wet LENGTH -- the submerged height of the wall --
 *  so it is stated here directly from the two depths rather than through wetSpan(), which is
 *  parameterised by x and therefore has nothing to say about a segment of zero x-extent. */
function segPerimeter(x0, z0, x1, z1, ws) {
	if (x1 === x0) {
		return Math.abs(Math.max(ws - z0, 0) - Math.max(ws - z1, 0));
	}
	const span = wetSpan(x0, z0, x1, z1, ws);
	if (!span || span.b === span.a) { return 0; }
	return Math.hypot(span.b - span.a, span.zb - span.za);
}

/** Top width: the horizontal projection of that same wet span. */
function segTopWidth(x0, z0, x1, z1, ws) {
	const span = wetSpan(x0, z0, x1, z1, ws);
	if (!span) { return 0; }
	return span.b - span.a;
}

/** Horton and Einstein's equal-velocity composite roughness (eq. 6-17). */
function compositeN(perimeters, roughnesses) {
	let num = 0, den = 0;
	for (let i = 0; i < perimeters.length; i += 1) {
		num += perimeters[i] * Math.pow(roughnesses[i], 1.5);
		den += perimeters[i];
	}
	return Math.pow(num / den, 2 / 3);
}

/** A whole region, in SI. Areas and perimeters arrive in feet and are converted here. */
function regionSi(fromRow, toRow, x, z, n, ws, s0) {
	const p = [], rough = [];
	let aFt = 0, tFt = 0;
	for (let i = fromRow; i <= toRow; i += 1) {
		aFt += segArea(x[i - 1], z[i - 1], x[i], z[i], ws);
		p.push(segPerimeter(x[i - 1], z[i - 1], x[i], z[i], ws));
		rough.push(n[i]);
		tFt += segTopWidth(x[i - 1], z[i - 1], x[i], z[i], ws);
	}
	const pFt = p.reduce((s, v) => s + v, 0);
	const A = aFt * FT * FT, P = pFt * FT, T = tFt * FT;
	const nc = compositeN(p, rough);
	const R = A / P;
	const V = (1 / nc) * Math.pow(R, 2 / 3) * Math.sqrt(s0);
	return {
		nc: nc, A: A, P: P, T: T, R: R, V: V, Q: V * A,
		hv: V * V / (2 * G),
		// Fr = V / sqrt(g A / T), with the page's cos(theta) correction for the bed slope.
		fr: V * Math.sqrt(T / (G * A * Math.cos(Math.atan(s0))))
	};
}

// ---- driving the page ------------------------------------------------------------------------
function loadSection(x, z, n, bank, ws, s0) {
	const page = loadCalculator('Manning-Irregular.php');
	for (let i = 0; i < x.length; i += 1) { page.addRow(); }
	page.set({ ws: ws, s0: s0 });
	x.forEach(function (station, i) {
		const cells = { station: station, elevation: z[i] };
		if (i > 0) { cells.n = n[i]; cells.is_bank = bank[i]; }
		page.setRow(i, cells);
	});
	page.run();
	return page;
}

const page = loadSection(X, Z, N, BANK, WS, S0);

// =========================================================================================
r.section('segment geometry against the geometry itself');

r.eq(page.rowCount(), X.length, 'the table holds one row per surveyed station');
for (let i = 1; i < X.length; i += 1) {
	nearDisplayed(cell(page, 'a', i), segArea(X[i - 1], Z[i - 1], X[i], Z[i], WS), 2,
		`segment ${X[i - 1]}-${X[i]}: wetted area matches Simpson's rule on the depth`);
	nearDisplayed(cell(page, 'pw', i), segPerimeter(X[i - 1], Z[i - 1], X[i], Z[i], WS), 2,
		`segment ${X[i - 1]}-${X[i]}: wetted perimeter is the length of the wet bed line`);
	nearDisplayed(cell(page, 't', i), segTopWidth(X[i - 1], Z[i - 1], X[i], Z[i], WS), 2,
		`segment ${X[i - 1]}-${X[i]}: top width is its horizontal projection`);
}
// The two end segments leave the water at stations 10 and 90, so their wetted widths are 20 ft
// and not the 30 ft they are surveyed over. That is the check on the depth clip.
nearDisplayed(cell(page, 't', 1), 20, 2, 'the left overbank is wet for 20 ft of its 30 ft');
nearDisplayed(cell(page, 't', 5), 20, 2, 'the right overbank likewise');
// And the level segment is wet end to end.
nearDisplayed(cell(page, 't', 3), 20, 2, 'the level segment is wet across its whole width');
nearDisplayed(cell(page, 'pw', 3), 20, 2, 'and a level bed has perimeter equal to its width');

// =========================================================================================
r.section('boundary shear stress, tau = gamma d S0');

X.forEach(function (station, i) {
	const d = Math.max(WS - Z[i], 0);
	nearDisplayed(cell(page, 'tau', i), GAMMA_PCF * d * S0, 2,
		`station ${station}: the depth-slope product, lbf/ft2`);
});

// =========================================================================================
r.section('composite roughness and Manning, region by region');

REGIONS.forEach(function (reg, k) {
	const ref = regionSi(reg.from, reg.to, X, Z, N, WS, S0);
	const row = reg.to;
	const label = `region ${k + 1} (stations ${X[reg.from - 1]}-${X[reg.to]})`;
	nearDisplayed(cell(page, 'n617', row), ref.nc, 2, `${label}: composite n by Horton-Einstein`);
	nearDisplayed(cell(page, 'rh', row), ref.R / FT, 2, `${label}: hydraulic radius A/P, ft`);
	nearDisplayed(cell(page, 'v617', row), ref.V / FT, 2, `${label}: velocity by Manning, ft/s`);
	nearDisplayed(cell(page, 'hv617', row), ref.hv / FT, 2, `${label}: velocity head V^2/2g, ft`);
	// Asserted on single- and multi-segment regions alike -- see the note at the top of the file.
	nearDisplayed(cell(page, 'fr617', row), ref.fr, 2,
		`${label}: Froude number, from the REGION top width (${reg.to - reg.from + 1} segment(s))`);
	nearDisplayed(cell(page, 'q617', row), ref.Q / (FT * FT * FT), 2, `${label}: discharge V A, ft3/s`);
});

// The compound main channel, stated as the bare number a person can check by hand: T = 40 ft in
// three segments of 10, 20 and 10 ft, and Fr is 0.554 -- not the 0.28 the page printed while the
// region top width was missing.
(function () {
	const mc = REGIONS[1];
	nearDisplayed(regionSi(mc.from, mc.to, X, Z, N, WS, S0).T / FT, 40, 9,
		'the main channel\'s top width is the sum of its three segments, 40 ft');
	nearDisplayed(cell(page, 'fr617', mc.to), 0.554, 2,
		'and its Froude number is 0.554, not the 0.28 of Task 474');
}());

// The composite roughness of the two single-segment overbanks must be the segment's own n --
// the formula's own degenerate case, and the cheapest way to see it is not misapplied.
nearDisplayed(cell(page, 'n617', 1), N[1], 3, 'a one-roughness region composites to that roughness');
// The main channel mixes three, and its composite must land strictly between the smallest and
// the largest of them -- true of any weighted power mean, and false of an arithmetic slip.
(function () {
	const nc = regionSi(2, 4, X, Z, N, WS, S0).nc;
	r.ok(nc > 0.025 && nc < 0.035,
		'a mixed-roughness region composites to a value between its extremes',
		`n_c = ${nc.toFixed(5)}`);
}());

// =========================================================================================
r.section('the total is the sum of the regions');

(function () {
	const want = REGIONS.reduce((s, reg) =>
		s + regionSi(reg.from, reg.to, X, Z, N, WS, S0).Q, 0) / (FT * FT * FT);
	nearDisplayed(parseFloat(page.html('q_617')), want, 2,
		'the section discharge is the sum of the region discharges');
	// Stated the other way, from the page's own cells, since that is the sum a user checks.
	const fromCells = REGIONS.reduce((s, reg) => s + cell(page, 'q617', reg.to), 0);
	nearDisplayed(parseFloat(page.html('q_617')), fromCells, 1,
		'and it agrees with the region cells the page prints beside it');
}());

// =========================================================================================
r.section('the exponents, dimensionlessly');

// A RATIO OF TWO CELLS IS NOT THE WAY TO STATE THESE. Both are rounded to two decimals, so on an
// overbank velocity of 1.85 ft/s the ratio is only good to about 0.6% -- looser than the identity
// is worth. Each scaled run is compared against the REFERENCE velocity scaled by the same exact
// factor instead, which keeps the statement at half a displayed unit.
(function () {
	const steeper = loadSection(X, Z, N, BANK, WS, S0 * 4);
	REGIONS.forEach(function (reg, k) {
		const ref = regionSi(reg.from, reg.to, X, Z, N, WS, S0);
		nearDisplayed(cell(steeper, 'v617', reg.to), 2 * ref.V / FT, 2,
			`region ${k + 1}: four times the slope is twice the velocity`);
	});
}());

// V goes as 1/n: doubling every roughness halves every velocity. The composite formula is
// homogeneous of degree one in n, so this holds for the mixed region too.
(function () {
	const rough = N.map(v => (v === null ? null : v * 2));
	const p = loadSection(X, Z, rough, BANK, WS, S0);
	REGIONS.forEach(function (reg, k) {
		const ref = regionSi(reg.from, reg.to, X, Z, N, WS, S0);
		nearDisplayed(cell(p, 'v617', reg.to), ref.V / FT / 2, 2,
			`region ${k + 1}: doubling the roughness halves the velocity`);
	});
}());

// =========================================================================================
r.section('subdivision invariance -- a redundant station changes nothing');

// Station 50 is added in the middle of the level main-channel segment, with the same roughness
// and no bank marker. It describes the same section, so every region result must be unchanged.
(function () {
	const x = [0, 30, 40, 50, 60, 70, 100];
	const z = [6, 3, 1, 1, 1, 3, 6];
	const n = [null, 0.040, 0.035, 0.025, 0.025, 0.030, 0.040];
	const bank = [null, true, false, false, false, true, true];
	const p = loadSection(x, z, n, bank, WS, S0);
	nearDisplayed(parseFloat(p.html('q_617')), parseFloat(page.html('q_617')), 2,
		'splitting a segment leaves the section discharge unchanged');
	nearDisplayed(cell(p, 'v617', 5), cell(page, 'v617', 4), 2,
		'and the main channel\'s velocity unchanged');
	nearDisplayed(cell(p, 'rh', 5), cell(page, 'rh', 4), 2,
		'and its hydraulic radius unchanged');
}());

// =========================================================================================
r.section('a dry section is dry, and says so rather than dividing by zero');

(function () {
	// The water surface below the lowest point of the bed: nothing is wet anywhere.
	const p = loadSection(X, Z, N, BANK, 0.5, S0);
	nearDisplayed(parseFloat(p.html('q_617')), 0, 2, 'a bed above the water carries no flow');
	X.forEach(function (station, i) {
		nearDisplayed(cell(p, 'tau', i), 0, 2, `station ${station}: no depth, no shear stress`);
	});
}());

// =========================================================================================
r.section('a vertical wall is a real segment, not a NaN (Task 475)');

// TWO STATIONS AT THE SAME STATION VALUE IS A VERTICAL WALL, and a wall is how anyone draws a
// rectangular channel, a box culvert or a lined ditch. It is not a mistake to reject: it has zero
// area and zero top width, and a WETTED PERIMETER equal to its submerged height. This section is
// the smallest thing that says so, and the arithmetic is checkable in the head:
//
//     10 ft wide, walls 10 ft tall, water 5 ft deep, n = 0.030 throughout
//     A = 50 ft2      P = 5 + 10 + 5 = 20 ft      T = 10 ft      R = A/P = 2.5 ft
//
// The pre-fix page put BOTH walls on the dry branch -- zero area was read as "nothing here" --
// and reported P = 10 ft, R = 5 ft. Manning goes as R^(2/3), so it overstated the discharge of a
// plain rectangular channel by 2^(2/3) = 1.587. That is the assertion that matters here; the
// absence of NaN is the cheap half.
(function () {
	const x = [0, 0, 10, 10];
	const z = [10, 0, 0, 10];
	// 0.030 and not, say, 0.013, only so the composite is checkable against the cell: every
	// result is printed to two decimals, and a roughness of 0.013 reaches the reader as 0.01.
	const n = [null, 0.030, 0.030, 0.030];
	const bank = [null, false, false, true];
	const p = loadSection(x, z, n, bank, WS, S0);

	// The wall segments themselves, cell by cell.
	[1, 3].forEach(function (i) {
		nearDisplayed(cell(p, 'a', i), 0, 2, `the wall at station ${x[i]} has no wetted area`);
		nearDisplayed(cell(p, 't', i), 0, 2, `the wall at station ${x[i]} has no top width`);
		nearDisplayed(cell(p, 'pw', i), 5, 2,
			`the wall at station ${x[i]} is wetted over its submerged height, 5 ft`);
	});
	nearDisplayed(cell(p, 'pw', 2), 10, 2, 'and the bed between them over its full 10 ft');

	// The region, against Manning worked from those numbers.
	const ref = regionSi(1, 3, x, z, n, WS, S0);
	nearDisplayed(ref.P / FT, 20, 9, 'so the reference perimeter is 5 + 10 + 5 = 20 ft');
	nearDisplayed(ref.A / (FT * FT), 50, 9, 'and the reference area is 50 ft2');
	nearDisplayed(cell(p, 'rh', 3), 2.5, 2, 'the hydraulic radius is A/P = 2.5 ft, not the 5 ft');
	nearDisplayed(cell(p, 'n617', 3), 0.030, 3, 'a wall of the same roughness leaves n composite');
	nearDisplayed(cell(p, 'v617', 3), ref.V / FT, 2, 'the velocity is Manning on that R');
	nearDisplayed(cell(p, 'fr617', 3), ref.fr, 2, 'and the Froude number uses T = 10 ft');
	nearDisplayed(cell(p, 'q617', 3), ref.Q / (FT * FT * FT), 2, 'and Q = V A');
	// Stated once more as the bare ratio the defect was, so a regression names itself.
	r.ok(Math.abs(cell(p, 'rh', 3) - 5) > 1,
		'the hydraulic radius is not the walls-ignored 5 ft', String(cell(p, 'rh', 3)), 'not ~5');

	// A wall carries its own roughness into the composite like any other wetted boundary: rough
	// walls on a smooth bed must composite ABOVE the bed's n and BELOW the walls'.
	const rough = loadSection(x, z, [null, 0.050, 0.020, 0.050], bank, WS, S0);
	const ncRough = cell(rough, 'n617', 3);
	r.ok(ncRough > 0.020 && ncRough < 0.050,
		'rough walls raise the composite roughness above the bed\'s own',
		`n_c = ${ncRough}`, 'between 0.020 and 0.050');
}());

// =========================================================================================
r.section('a duplicated station contributes nothing, and never NaN (Task 475)');

// The degenerate wall -- same station AND same elevation -- is a wall of zero height. Zero area,
// zero perimeter, zero top width: it describes no bed at all, so it must leave the section it was
// typed into exactly as it was. That is a strictly stronger statement than "no cell says NaN",
// and it is the subdivision-invariance test with a zero-length subdivision.
(function () {
	const x = [0, 30, 30, 40, 60, 70, 100];
	const z = [6, 3, 3, 1, 1, 3, 6];
	const n = [null, 0.040, 0.040, 0.035, 0.025, 0.030, 0.040];
	const bank = [null, false, true, false, false, true, true];
	const p = loadSection(x, z, n, bank, WS, S0);

	// Every cell of the doubled section is a number or a blank, never NaN. Asserted on the RAW
	// cell text: parseFloat('NaN') and parseFloat('') are both NaN, so a numeric check here would
	// pass on the very defect it is meant to catch.
	['rh', 'n617', 'v617', 'hv617', 'fr617', 'q617', 't', 'pw', 'a', 'tau'].forEach(function (name) {
		const bad = x.map((_, i) => p.rowHtml(name, i)).filter(t => /nan|infinity/i.test(String(t)));
		r.ok(bad.length === 0, `${name}: no cell says NaN or Infinity`, bad.join(', '), '');
	});
	// The zero-length segment's own cells are three zeroes, not three blanks -- it is computable,
	// it just computes to nothing.
	nearDisplayed(cell(p, 'a', 2), 0, 2, 'the duplicated station spans no area');
	nearDisplayed(cell(p, 'pw', 2), 0, 2, 'wets no perimeter');
	nearDisplayed(cell(p, 't', 2), 0, 2, 'and spans no top width');
	// And the section it sits in is the section from the top of this file, unchanged.
	nearDisplayed(parseFloat(p.html('q_617')), parseFloat(page.html('q_617')), 2,
		'the section discharge is unchanged by the duplicate');
	REGIONS.forEach(function (reg, k) {
		const row = [2, 5, 6][k];
		nearDisplayed(cell(p, 'v617', row), cell(page, 'v617', reg.to), 2,
			`region ${k + 1}: velocity unchanged by the duplicate`);
		nearDisplayed(cell(p, 'fr617', row), cell(page, 'fr617', reg.to), 2,
			`region ${k + 1}: Froude number unchanged by the duplicate`);
		nearDisplayed(cell(p, 'rh', row), cell(page, 'rh', reg.to), 2,
			`region ${k + 1}: hydraulic radius unchanged by the duplicate`);
	});
}());

r.finish();
