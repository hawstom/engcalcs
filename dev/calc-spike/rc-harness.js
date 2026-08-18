// Behavioural test of Rock Chute Design (rc_).
//
//   node dev/calc-spike/rc-harness.js
//
// ROADMAP Task 292.
//
// WHAT IS *NOT* ANCHORED HERE, STATED FIRST BECAUSE IT IS THE IMPORTANT PART.
//
// This calculator implements Robinson, Rice & Kadavy, "Design of Rock Chutes", Transactions of
// the ASAE 41(3):621-626 (1998). Its five empirical constants -- 9.76e-7 and 8.07e-6 in the two
// D50 equations, the exponent 1.89 they share, and 0.0292 / 0.147 in the Manning-n equation --
// come from that paper's flume and full-scale tests, and NOTHING IN THIS FILE VERIFIES THEIR
// VALUES. The paper is paywalled at ASABE and the copy reachable at
// https://www.fs.usda.gov/biology/nsaec/fishxing/fplibrary/Robinson_1998_Design_of_Rock_Chutes.pdf
// is a page-image scan that could not be read in this environment. Rather than cite a source
// that was not actually read, this harness says so: **the coefficients of the Robinson equations
// remain unverified, and a worked example from the paper or from an NRCS design aid is the piece
// of work that would close that gap.** Everything below is what CAN be checked without it.
//
// WHAT IS ANCHORED
//
//   1. THE MANNING EQUATION, which the page uses to turn surface flow into surface depth. For a
//      wide channel taken per unit width, q_s = (1/n) d^(5/3) sqrt(S0), so d = (n q_s /
//      sqrt(S0))^(3/5) -- which is where the 0.6 exponent in the source comes from. The harness
//      recomputes q_s from the depth the page reports and requires the flow to come back. That
//      is a closed form, not a fit, and it is checked to the page's printed precision.
//
//   2. CONTINUITY. The total flow splits into flow THROUGH the rock mantle and flow OVER it:
//      q_t = q_m + q_s, with no third destination. And the mantle discharge must be its velocity
//      times its own thickness, q_m = V_m * (2 D50), using the same layer thickness the page
//      reports as a design dimension. That ties two outputs the user reads separately.
//
//   3. THE GEOMETRY MULTIPLES the paper's design recommendations are stated as: layer thickness
//      2 D50, crest radius 40 D50, apron length 15 D50 -- and the crest length as a circular ARC,
//      R * theta with theta = atan(S0), which is the one of the four that is a derivation rather
//      than a multiple and the one that could be wrong without looking wrong.
//
//   4. THE EXPONENT STRUCTURE of the two D50 equations, dimensionlessly. Whatever the leading
//      coefficients are, D50 must go as q_t^(1/1.89) in both branches, as S0^(1.50/1.89) below
//      the 10% threshold and as S0^(0.58/1.89) above it. These are ratios of the page against
//      itself, so the unverified coefficients cancel out completely and the exponents alone are
//      left -- which means this part of the check is valid whether or not the coefficients are.
//
//   5. THE TWO BRANCHES JOINING AT S0 = 0.10. This is the one test that says something about all
//      four D50 constants JOINTLY without knowing any of them: the paper's two equations are two
//      fits to one physical relationship, so at the slope where the page switches between them
//      they must very nearly agree. Measured here, the step is 0.31% in D50 -- a fit artefact,
//      not a discontinuity. A typo in any one of 9.76e-7, 8.07e-6, 1.50 or 0.58 would open that
//      seam by orders of magnitude, so this is a real guard on numbers this file cannot check
//      directly.
//
//   6. THE VALIDITY RANGE. The page refuses slopes outside 2% to 40%, and that range is the
//      experimental range of the paper -- its published abstract states the tests covered "rock
//      chutes with slopes ranging from 2 to 40%" and median stone sizes from 15 to 278 mm. The
//      abstract is public at https://elibrary.asabe.org/abstract.asp?JID=3&AID=17230 and is the
//      one part of the paper that was actually read for this file.
//
// PROVED TO BITE. Five mutations were made on purpose and all five went red: the crest length
// written R S0 instead of R atan(S0) (5 checks), the steep-slope exponent 0.58 -> 0.68 (5), the
// gentle-slope coefficient 9.76e-7 -> 9.76e-6 (7 -- caught by the branch-join test, which is the
// whole reason that test exists), the Manning depth exponent 0.6 -> 0.5 (6), and the mantle
// thickness 2 D50 -> 3 D50 (6).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

const { loadCalculator, makeReporter } = require('./calc-page.js');

const r = makeReporter('Rock Chute Design (rc_)');
const page = loadCalculator('Rock-Chute.php');
const G = page.EngCalcs.G;

/**
 * Drives the page in SI: slope as a grade, unit discharge in m^2/s, and every length read back
 * in metres so the harness never has to think about a display unit twice.
 */
function run(o) {
	page.units('si')
		.unit('rc_S0', 'grade').unit('rc_qt', 'm2ps')
		.unit('rc_D50', 'mm').unit('rc_layer', 'mm').unit('rc_crest_radius', 'm')
		.unit('rc_crest_length', 'm').unit('rc_apron_length', 'm')
		.unit('rc_Vm', 'mps').unit('rc_qm', 'm2ps').unit('rc_qs', 'm2ps')
		.unit('rc_d', 'm').unit('rc_Hp', 'm')
		.set({
			rc_S0: o.S0, rc_qt: o.qt,
			rc_np: o.np === undefined ? 0.45 : o.np,
			rc_sg: o.sg === undefined ? 2.65 : o.sg,
			rc_SD: o.SD === undefined ? 1.30 : o.SD,
			rc_yn: o.yn === undefined ? '' : o.yn
		}).run();
	// D50 and the layer thickness are read in MILLIMETRES and divided back, because every result
	// cell on this page prints four decimals and a 29 mm stone read in metres would carry two
	// significant figures. Everything the harness handles is still metres.
	return {
		D50: page.num('rc_D50') / 1000, layer: page.num('rc_layer') / 1000,
		radius: page.num('rc_crest_radius'), crest: page.num('rc_crest_length'),
		apron: page.num('rc_apron_length'), n: page.num('rc_n_chute'),
		Vm: page.num('rc_Vm'), qm: page.num('rc_qm'), qs: page.num('rc_qs'),
		d: page.num('rc_d'), Hp: page.num('rc_Hp')
	};
}

// A spread of designs inside the paper's tested range: 2% to 40% slope, and unit discharges
// that put D50 across the 15-278 mm band the tests covered.
const designs = [
	{ S0: 0.02, qt: 0.20 }, { S0: 0.05, qt: 0.50 }, { S0: 0.08, qt: 0.30 },
	{ S0: 0.15, qt: 0.40 }, { S0: 0.25, qt: 0.35 }, { S0: 0.40, qt: 0.30 }
];

// ---- 1. Manning, per unit width -------------------------------------------------------------
r.section('surface depth is Manning per unit width: q_s = (1/n) d^(5/3) sqrt(S0)');

for (const dz of designs) {
	const s = run(dz);
	// Recompute the surface flow from the depth the page reports, with the page's own n and the
	// user's slope. If the 0.6 exponent or the placement of sqrt(S0) were wrong, this fails.
	const qsFromDepth = (1 / s.n) * Math.pow(s.d, 5 / 3) * Math.sqrt(dz.S0);
	// The depth prints to 4 decimals in metres, so a 0.12 m depth carries four significant
	// figures and the 5/3 power magnifies that to about 0.014%; 0.5% is loose by a factor of 30
	// and still far tighter than any exponent error could survive.
	r.close(qsFromDepth, s.qs, 5e-3,
		`S0 = ${dz.S0}, q_t = ${dz.qt} m^2/s: depth ${s.d} m returns q_s = ${s.qs} m^2/s`);
}

// ---- 2. continuity ---------------------------------------------------------------------------
r.section('the flow splits into the mantle and the surface, and nowhere else');

for (const dz of designs) {
	const s = run(dz);
	r.close(s.qm + s.qs, dz.qt, 2e-3,
		`S0 = ${dz.S0}: q_m + q_s = q_t = ${dz.qt} m^2/s`, `${s.qm} + ${s.qs}`);
	// The mantle carries its flow through its own thickness, which is the layer thickness the
	// page reports to the user as a construction dimension.
	// q_m prints to 4 decimals in m^2/s, and on the gentlest design here it is 0.0010 m^2/s --
	// two significant figures. The bound is that half-count expressed relatively rather than a
	// round number, so it is 5% on the smallest case and 0.06% on the largest.
	r.close(s.qm, s.Vm * s.layer, 5e-5 / s.qm + 5e-4,
		`S0 = ${dz.S0}: q_m = V_m x layer thickness`);
	r.ok(s.qs > 0 && s.qs < dz.qt, `S0 = ${dz.S0}: and the surface flow is a proper fraction of it`,
		`q_s/q_t = ${(s.qs / dz.qt).toFixed(4)}`);
}

// ---- 3. the design geometry ------------------------------------------------------------------
r.section('the geometry is the published multiples of D50, and the crest is an arc');

for (const dz of designs) {
	const s = run(dz);
	r.close(s.layer, 2 * s.D50, 1e-3, `S0 = ${dz.S0}: layer thickness = 2 D50`);
	r.close(s.radius, 40 * s.D50, 1e-3, `S0 = ${dz.S0}: crest radius = 40 D50`);
	r.close(s.apron, 15 * s.D50, 1e-3, `S0 = ${dz.S0}: apron length = 15 D50`);
	// The one that is a derivation rather than a multiple: the crest is a circular arc of radius
	// 40 D50 turned through the chute angle, so its length is R theta with theta = atan(S0) --
	// NOT R S0, which is the plausible-looking mistake and is 5% out at a 40% slope.
	r.close(s.crest, s.radius * Math.atan(dz.S0), 2e-3,
		`S0 = ${dz.S0}: crest length = R atan(S0), the arc through the chute angle`);
}
// And that the distinction actually bites at the steep end, so the check above is not vacuous.
const steep = run({ S0: 0.40, qt: 0.30 });
r.ok(Math.abs(steep.radius * 0.40 - steep.crest) / steep.crest > 0.02,
	'R S0 and R atan(S0) are far enough apart at a 40% slope for that to be a real distinction',
	`${(Math.abs(steep.radius * 0.40 - steep.crest) / steep.crest * 100).toFixed(1)}% apart`);

// ---- 4. the exponents, which survive whatever the coefficients are ----------------------------
r.section('exponents of the D50 equations (the coefficients cancel out of these)');

// Below the 10% threshold: D50 ~ (q_t S0^1.50)^(1/1.89).
const lowA = run({ S0: 0.05, qt: 0.50 }).D50;
r.close(run({ S0: 0.05, qt: 1.00 }).D50 / lowA, Math.pow(2, 1 / 1.89), 2e-3,
	'S0 < 10%: doubling q_t multiplies D50 by 2^(1/1.89) = ' + Math.pow(2, 1 / 1.89).toFixed(4));
r.close(run({ S0: 0.025, qt: 0.50 }).D50 / lowA, Math.pow(0.5, 1.5 / 1.89), 2e-3,
	'S0 < 10%: halving the slope multiplies D50 by 0.5^(1.50/1.89)');

// Above it: the same 1/1.89 on q_t, but a much weaker 0.58/1.89 on slope.
const highA = run({ S0: 0.20, qt: 0.50 }).D50;
r.close(run({ S0: 0.20, qt: 1.00 }).D50 / highA, Math.pow(2, 1 / 1.89), 2e-3,
	'S0 > 10%: doubling q_t multiplies D50 by 2^(1/1.89) as well');
r.close(run({ S0: 0.40, qt: 0.50 }).D50 / highA, Math.pow(2, 0.58 / 1.89), 2e-3,
	'S0 > 10%: doubling the slope multiplies D50 by 2^(0.58/1.89) = ' +
	Math.pow(2, 0.58 / 1.89).toFixed(4));

// Manning n rises with both stone size and slope, as the paper's n = 0.0292 (D50 S0)^0.147 says.
// Only the exponent survives the ratio; 0.0292 does not, and is not claimed here.
const nA = run({ S0: 0.15, qt: 0.50 }).n;
const nB = run({ S0: 0.30, qt: 0.50 });
r.close(nB.n / nA, Math.pow((nB.D50 * 1000 * 0.30) / (run({ S0: 0.15, qt: 0.50 }).D50 * 1000 * 0.15), 0.147),
	3e-3, 'n goes as (D50 S0)^0.147');

// ---- 5. the two branches join at the 10% threshold --------------------------------------------
r.section('the two published D50 equations agree where the page switches between them');

for (const qt of [0.20, 0.50, 1.00, 2.00]) {
	const below = run({ S0: 0.0999, qt: qt }).D50;
	const above = run({ S0: 0.1001, qt: qt }).D50;
	const step = Math.abs(above - below) / below;
	r.ok(step < 0.01,
		`q_t = ${qt} m^2/s: D50 steps by ${(step * 100).toFixed(2)}% across S0 = 0.10`,
		`${(below * 1000).toFixed(1)} mm -> ${(above * 1000).toFixed(1)} mm`);
}
// The step is a fit artefact and is REAL -- asserting it is exactly zero would be asserting the
// two equations are one equation, which they are not.
const j1 = run({ S0: 0.0999, qt: 0.50 }).D50, j2 = run({ S0: 0.1001, qt: 0.50 }).D50;
r.ok(j1 !== j2, 'and the two equations are genuinely different fits, not the same one twice',
	`${(Math.abs(j2 - j1) / j1 * 100).toFixed(3)}% apart`);

// ---- 6. the validity range, which is the paper's experimental range ---------------------------
r.section("the page refuses slopes outside the paper's tested 2% to 40%");

run({ S0: 0.015, qt: 0.50 });
r.ok(/⚠/.test(page.html('rc_eq_used')), 'a 1.5% slope is refused, below the tested range',
	page.html('rc_eq_used'));
run({ S0: 0.45, qt: 0.50 });
r.ok(/⚠/.test(page.html('rc_eq_used')), 'a 45% slope is refused, above the tested range',
	page.html('rc_eq_used'));
run({ S0: 0.05, qt: 0.50 });
const eq1 = page.html('rc_eq_used');
r.ok(!/⚠/.test(eq1), 'a 5% slope is accepted, and the page names the equation it used', eq1);
run({ S0: 0.25, qt: 0.50 });
const eq2 = page.html('rc_eq_used');
r.ok(!/⚠/.test(eq2), 'so is a 25% slope, with the other equation named', eq2);
r.ok(eq1 !== eq2, 'and the two slopes are told apart in the equation the page reports');

// The stone sizes these designs call for land inside the 15-278 mm the paper tested, which is
// the check that the harness is exercising the calculator in the range it is valid for at all.
for (const dz of designs) {
	const D50mm = run(dz).D50 * 1000;
	r.ok(D50mm >= 15 && D50mm <= 278,
		`S0 = ${dz.S0}, q_t = ${dz.qt}: D50 = ${D50mm.toFixed(0)} mm is inside the tested 15-278 mm`);
}

r.section('the rock quality checks fire at their stated boundaries');
// Specific gravity 2.54-2.82 and gradation 1.15-1.47 are the page's own stated acceptance bands.
for (const [sg, ok] of [[2.53, false], [2.54, true], [2.65, true], [2.82, true], [2.83, false]]) {
	run({ S0: 0.20, qt: 0.50, sg: sg });
	r.eq(/✓/.test(page.html('rc_sg_check')), ok, `specific gravity ${sg} is ${ok ? 'accepted' : 'refused'}`);
}
for (const [sd, ok] of [[1.14, false], [1.15, true], [1.30, true], [1.47, true], [1.48, false]]) {
	run({ S0: 0.20, qt: 0.50, SD: sd });
	r.eq(/✓/.test(page.html('rc_SD_check')), ok, `gradation SD ${sd} is ${ok ? 'accepted' : 'refused'}`);
}

r.section('the inlet ponding check');
// Hp is the weir head that passes q_t over the crest, from q = Cw Hp^1.5 -- so inverting it must
// return the unit discharge that was asked for. The coefficient is the page's; the inversion is
// what is checked, and it is exact.
for (const qt of [0.20, 0.50, 1.20]) {
	const s = run({ S0: 0.20, qt: qt, yn: 0.5 });
	r.close(1.45 * Math.pow(s.Hp, 1.5), qt, 5e-3,
		`q_t = ${qt} m^2/s: the weir head Hp = ${s.Hp} m passes exactly that flow back`);
}
// Ponding is reported when the weir head needed exceeds the normal depth in the approach channel.
const ponds = run({ S0: 0.20, qt: 1.20, yn: 0.2 });
r.ok(ponds.Hp > 0.2 && /✓/.test(page.html('rc_ponding_check')),
	'a weir head above the approach normal depth is reported as ponding', page.html('rc_ponding_check'));
const noPond = run({ S0: 0.20, qt: 0.20, yn: 2.0 });
r.ok(noPond.Hp < 2.0 && /⚠/.test(page.html('rc_ponding_check')),
	'and a deep approach channel that will not pond is flagged instead', page.html('rc_ponding_check'));

// ---- the page's own defaults ------------------------------------------------------------------
r.section('factory defaults open on a valid design');
for (const [preset, lang] of [['us', 'en'], ['si', 'es']]) {
	const fresh = loadCalculator('Rock-Chute.php', { lang: lang });
	fresh.run();
	r.ok(!/⚠/.test(fresh.html('rc_eq_used')),
		`${preset}: the default slope is inside the equations' validity range`, fresh.html('rc_eq_used'));
	r.ok(/✓/.test(fresh.html('rc_sg_check')) && /✓/.test(fresh.html('rc_SD_check')),
		`${preset}: and the default rock passes both quality checks`);
	r.ok(fresh.si('rc_D50') > 0 && isFinite(fresh.si('rc_D50')),
		`${preset}: with a real stone size`, `D50 = ${(fresh.si('rc_D50') * 1000).toFixed(0)} mm`);
}

r.finish();
