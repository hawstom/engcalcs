// Behavioural test of Weir Flow Simple, the broad-crested weir page (ws_).
//
//   node dev/calc-spike/ws-harness.js
//
// ROADMAP Task 292.
//
// This is the thinnest calculator in the suite -- Q = Cw l h^1.5, three inputs, one output, and
// NO unit selects at all, by design: the coefficient carries the unit system, so the page takes
// the numbers as typed and hands them back. That makes the list of things that can be wrong
// short and specific, and it also makes the one thing an anchor is really needed for obvious:
// what a value of Cw MEANS.
//
// WHAT IT ANCHORS AGAINST
//
//   1. THE CRITICAL-FLOW RESULT FOR A BROAD-CRESTED WEIR, which is where the coefficient comes
//      from and is a closed form, not a fit. Flow over a broad, level crest passes through
//      critical depth, and for a rectangular section critical depth is y_c = 2H/3 where H is the
//      total head upstream of the crest. Discharge at critical depth is
//
//          q = sqrt(g) y_c^(3/2)   per unit width,   so   Q = sqrt(g) (2/3)^(3/2) l H^(3/2)
//
//      which makes the IDEAL weir coefficient sqrt(g) (2/3)^(3/2): 1.7047 in SI (m^(1/2)/s) and
//      3.0872 in US customary (ft^(1/2)/s). A real weir runs a little under that because of the
//      approach losses and the curvature of the streamlines over the upstream corner, which is
//      exactly why the page's default is 3.0 rather than 3.087 and why the coefficient is a
//      user input with a reference table linked from its label. So the anchor is: fed the IDEAL
//      coefficient, the page must return the critical-flow discharge computed independently.
//
//   2. THE EXPONENT 3/2, dimensionlessly. Quadrupling the head must multiply the flow by
//      exactly 8, and nine times the head by exactly 27. No coefficient and no unit convention
//      survives that ratio; only the exponent does.
//
//   3. THE UNIT-SYSTEM RELATION the page's design depends on. Because nothing is converted, a US
//      coefficient and an SI coefficient describe the same weir only when
//      Cw_SI = Cw_US * sqrt(0.3048) = Cw_US / 1.81120. The check is that a weir entered in feet
//      with Cw_US and the same weir entered in metres with that Cw_SI give the same PHYSICAL
//      discharge -- the same cubic feet per second, once converted by hand.
//
// PROVED TO BITE. Two mutations were made on purpose and both went red: the head exponent
// 1.5 -> 1.6 (12 checks) and a stray factor of two on the crest length (8).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

const { loadCalculator, makeReporter } = require('./calc-page.js');

const r = makeReporter('Weir Flow Simple (ws_)');
const page = loadCalculator('Weir-Flow-Simple.php');
const G = page.EngCalcs.G;
const FT = 0.3048;                       // m, exact
const G_FPS2 = G / FT;                   // 32.1740 ft/s^2, the same g in US units

/** Q as the page reports it, for the numbers as typed. No units are involved anywhere. */
function q(l, h, cw) {
	page.set({ l: l, h: h, cw: cw }).run();
	return page.num('q');
}

// ---- 1. the ideal broad-crested weir coefficient -------------------------------------------
r.section('the ideal coefficient is sqrt(g) (2/3)^(3/2), and the page reproduces critical flow');

const CW_IDEAL_SI = Math.sqrt(G) * Math.pow(2 / 3, 1.5);          // 1.70470 m^(1/2)/s
const CW_IDEAL_US = Math.sqrt(G_FPS2) * Math.pow(2 / 3, 1.5);     // 3.08722 ft^(1/2)/s

// The two are the same physical constant, and their ratio is fixed by the foot alone.
r.close(CW_IDEAL_US * Math.sqrt(FT), CW_IDEAL_SI, 1e-12,
	'the SI and US ideal coefficients differ by exactly sqrt(0.3048)',
	`${CW_IDEAL_SI.toFixed(5)} SI, ${CW_IDEAL_US.toFixed(5)} US`);

// SI: a 5.00 m weir under 0.80 m of head. Critical depth y_c = 2/3 * 0.80 = 0.53333 m, and
//   Q = l sqrt(g) y_c^(3/2) = 5.00 * 3.13156 * 0.389538 = 6.09954 m^3/s
// computed here from g and the geometry, with the weir equation never used.
for (const [l, h] of [[5.0, 0.80], [1.0, 0.25], [12.0, 1.50]]) {
	const yc = 2 * h / 3;
	const want = l * Math.sqrt(G) * Math.pow(yc, 1.5);
	// q prints to 2 decimals, so the bound is 0.005 absolute; expressed relatively that is
	// 0.08% on the smallest of these and 0.001% on the largest.
	r.close(q(l, h, CW_IDEAL_SI), want, 5e-3 / Math.max(want, 1e-9) + 1e-9,
		`SI: l = ${l} m, H = ${h} m: critical-flow Q = ${want.toFixed(4)} m^3/s (y_c = ${yc.toFixed(4)} m)`);
}

// US, the same three weirs in feet -- the point being that the coefficient, not a unit factor,
// is what carries the unit system on this page.
for (const [l, h] of [[16.4, 2.62], [3.28, 0.82], [40.0, 5.0]]) {
	const yc = 2 * h / 3;
	const want = l * Math.sqrt(G_FPS2) * Math.pow(yc, 1.5);
	r.close(q(l, h, CW_IDEAL_US), want, 5e-3 / Math.max(want, 1e-9) + 1e-9,
		`US: l = ${l} ft, H = ${h} ft: critical-flow Q = ${want.toFixed(3)} cfs`);
}

// ---- 2. the exponent, which nothing can launder --------------------------------------------
r.section('the head exponent is exactly 3/2');

// Ratios of the page against itself: the coefficient, the length and any unit convention all
// cancel, leaving the exponent alone. The bound is the printed precision of the two flows.
const base = q(10, 1, 3);
r.close(q(10, 4, 3) / base, 8, 1e-4, 'quadrupling the head multiplies Q by 4^1.5 = 8');
r.close(q(10, 9, 3) / base, 27, 1e-4, 'and nine times the head by 9^1.5 = 27');
r.close(q(10, 2.25, 3) / base, Math.pow(2.25, 1.5), 1e-3, 'and 2.25 times the head by 2.25^1.5');

r.section('Q is strictly proportional to the crest length and to the coefficient');
r.close(q(20, 1, 3) / base, 2, 1e-4, 'doubling the crest length doubles Q');
r.close(q(10, 1, 6) / base, 2, 1e-4, 'doubling the coefficient doubles Q');
r.close(q(37, 1, 3) / base, 3.7, 1e-4, 'and length scales linearly at a non-round factor too');

// Zero head is zero flow, and the page must say 0 rather than something undefined -- a weir with
// water exactly at the crest is a perfectly ordinary thing for a user to type.
r.eq(q(10, 0, 3), 0, 'no head over the crest is no flow');

// ---- 3. the unit-system relation the design depends on -------------------------------------
r.section('a US coefficient and an SI coefficient describe the same weir');

// The page converts nothing, so this relation is the entire contract between the two unit
// systems on this calculator: Cw_SI = Cw_US sqrt(0.3048). If it did not hold, the "Cw is
// unit-system-specific" comment at the top of js/weir-flow-simple.js would be describing
// something the page does not actually do.
const CFS_PER_M3S = 1 / (FT * FT * FT);
for (const [lFt, hFt, cwUS] of [[16.4, 2.62, 3.0], [100.0, 3.0, 3.33], [50.0, 4.0, 2.6]]) {
	const qUS = q(lFt, hFt, cwUS);                                  // cfs
	const qSI = q(lFt * FT, hFt * FT, cwUS * Math.sqrt(FT));        // m^3/s
	// Both sides are printed to 2 decimals, and the SI number is 35 times smaller than the US
	// one, so IT sets the bound: half a count in the last place of qSI, expressed relative to
	// qUS. Derived, not chosen -- at these sizes it works out between 0.02% and 0.2%.
	const tol = (0.005 * CFS_PER_M3S + 0.005) / qUS;
	r.close(qSI * CFS_PER_M3S, qUS, tol,
		`l = ${lFt} ft, H = ${hFt} ft, Cw = ${cwUS}: ${qUS} cfs entered in feet is ` +
		`${qSI} m^3/s entered in metres`);
}

// ---- the page's own defaults ----------------------------------------------------------------
r.section('factory defaults');

// This page has no unit selects, so both presets render the same three numbers and there is
// nothing for the preset buttons to change -- which is itself worth asserting, because a unit
// family added to one of these fields later would silently start converting a coefficient.
for (const [preset, lang] of [['us', 'en'], ['si', 'es']]) {
	const fresh = loadCalculator('Weir-Flow-Simple.php', { lang: lang });
	fresh.run();
	r.ok(fresh.num('q') > 0 && isFinite(fresh.num('q')),
		`${preset}: the default weir passes a real positive flow`, `Q = ${fresh.num('q')}`);
	const selects = Object.values(fresh.form).filter(e => e && e._family);
	r.eq(selects.length, 0,
		`${preset}: no field on this page carries a unit family (the coefficient carries the units)`);
	r.close(fresh.num('q'),
		parseFloat(fresh.input('cw')) * parseFloat(fresh.input('l')) *
		Math.pow(parseFloat(fresh.input('h')), 1.5), 1e-3,
		`${preset}: and the default Q is Cw l h^1.5 of the defaults as rendered`);
}

r.finish();
