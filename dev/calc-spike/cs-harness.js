// Canal Seepage and Conveyance Efficiency (cs_) -- a worked example.
//
//   node dev/calc-spike/cs-harness.js
//
// WHAT THERE IS TO ANCHOR. Unlike the rest of the suite this page has NO empirical coefficient
// and no iteration: it is the inflow-outflow (ponding) seepage measurement written out, and every
// figure on it is a definition.
//
//     seepage loss      Q_loss = Q_in - Q_out
//     conveyance eff.   Ec     = Q_out / Q_in           (FAO I&D Paper 26; USDA NEH part 623)
//     loss per length   Q_loss / L
//     daily volume      Q_loss x 86 400 s
//     annual volume     Q_loss x 86 400 x 365.25 s      (a Julian year)
//     lining area       L x wetted perimeter
//     simple payback    capital cost / annual saving
//
// So the anchor is not "a published coefficient" -- there is none to be wrong -- it is that each
// of those identities holds in the units the page displays, and that the UNIT CONVERSIONS around
// them are right. That second half is the whole risk on this page, and it is where the defect
// below lives.
//
// THE TWO CURRENCY INPUTS ARE RATES, AND CONVERT BY THE RECIPROCAL. `cs_water_value` is a price
// PER UNIT VOLUME and `cs_lining_cost` a price PER UNIT AREA, so each converts by the RECIPROCAL
// of its unit's factor: a cubic metre of water costs 35.3147 times what a cubic foot costs. Both
// were once read with `readFormInput(..., true)`, which DIVIDES, so each was wrong by the factor
// SQUARED -- and invisible under SI, where every factor is 1. The page now reads them through
// `readFormInputPerUnit()` (Task 473), and the US money figures below are ASSERTED, not printed:
//
//     20 cfs in, 18 cfs out, 5,000 ft of canal, 20 ft wetted perimeter, water at $1.00/ft3,
//     lining at $2.00/ft2, target Ec 0.95, under the US preset:
//       annual value lost        63,115,200 ft3 x $1/ft3 = $63,115,200   (was $50,608.53)
//       annual value recovered   31,557,600 ft3 x $1/ft3 = $31,557,600   (was $25,304.27)
//       total lining cost        100,000 ft2 x $2/ft2    = $200,000      (was $1,726.19)
//     -- the old page was low by 35.3147^2 = 1,247 on the two water figures and by
//     10.7639^2 = 115.9 on the lining, with the payback years 10.76x too long.
//
// The RESULT side needs no such care: every currency result is a plain amount with no unit
// select, written with hasUnits = false, and cs_payback_years is written straight into its cell.
//
// MUTATIONS TRIED, all caught:
//   1. cs_Vol_year 365.25 -> 365                  (the annual volume and the SI money figures)
//   2. Ec = Q_out/Q_in -> Q_loss/Q_in             (efficiency, its status band, and the recovery)
//   3. the Ec_target > Ec_now clamp removed       (a target below the present efficiency)
//   4. lining_area = L * wp -> L + wp             (lining area and the SI lining cost)
//   5. cs_Vol_day 86400 -> 3600                   (the daily volume)
//   6. readFormInputPerUnit -> readFormInput       (the US money figures and the US payback)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

const { loadCalculator, makeReporter } = require('./calc-page.js');

const r = makeReporter('Canal Seepage (cs_) worked example');

/** Compares against a cell written with .toFixed(dp): half a displayed unit. */
function nearDisplayed(actual, expected, dp, label) {
	const slack = 0.5 * Math.pow(10, -dp) + Math.abs(expected) * 1e-9;
	r.report(Math.abs(actual - expected) <= slack, label,
		`got ${actual}, want ${expected} (±${slack})`);
}

// ---- reference arithmetic, from the exact definitions ------------------------------------
const FT = 0.3048;                       // m, exactly
const FT3 = FT * FT * FT;                // m3 per ft3
const FT2 = FT * FT;                     // m2 per ft2
const DAY = 86400;                       // s
const YEAR = 86400 * 365.25;             // s in a Julian year

// ---- the worked canal ----------------------------------------------------------------------
//
// 20 cfs diverted, 18 cfs delivered 5,000 ft downstream: 2 cfs of seepage, Ec = 0.90. The wetted
// perimeter is 20 ft, so lining the reach covers 100,000 ft2. Round numbers throughout, so every
// expected figure below can be read off by hand.
const CASE = {
	qIn: 20, qOut: 18, lengthFt: 5000, wpFt: 20,
	waterValue: 1, liningCost: 2, ecTarget: 0.95
};

function loadCase(preset, over) {
	const o = over || {};
	const page = loadCalculator('Canal-Seepage.php', { lang: preset === 'si' ? 'es' : 'en' });
	page.units(preset);
	page.set({
		cs_Q_in: (o.qIn === undefined ? CASE.qIn : o.qIn),
		cs_Q_out: (o.qOut === undefined ? CASE.qOut : o.qOut),
		cs_L: CASE.lengthFt, cs_wp: CASE.wpFt,
		cs_water_value: (o.waterValue === undefined ? CASE.waterValue : o.waterValue),
		cs_lining_cost: (o.liningCost === undefined ? CASE.liningCost : o.liningCost),
		cs_Ec_target: (o.ecTarget === undefined ? CASE.ecTarget : o.ecTarget)
	});
	page.run();
	return page;
}

// =========================================================================================
r.section('the inflow-outflow identities, in the units the page displays');

const us = loadCase('us');
nearDisplayed(us.num('cs_Q_loss'), CASE.qIn - CASE.qOut, 4, 'seepage loss is inflow minus outflow');
nearDisplayed(us.num('cs_pct_loss'), 100 * (CASE.qIn - CASE.qOut) / CASE.qIn, 2,
	'percentage lost is that loss over the inflow');
nearDisplayed(us.num('cs_Ec'), 100 * CASE.qOut / CASE.qIn, 2,
	'conveyance efficiency is delivered over diverted');
nearDisplayed(us.num('cs_Vol_day'), (CASE.qIn - CASE.qOut) * DAY, 1,
	'the daily volume is the loss over 86,400 s');
nearDisplayed(us.num('cs_Vol_year'), (CASE.qIn - CASE.qOut) * YEAR, 0,
	'the annual volume is the loss over a Julian year, 365.25 d');
nearDisplayed(us.num('cs_Q_loss_per_L'), (CASE.qIn - CASE.qOut) / CASE.lengthFt, 6,
	'the loss per unit length is the loss over the reach length');
nearDisplayed(us.num('cs_lining_area'), CASE.lengthFt * CASE.wpFt, 0,
	'the lining area is length times wetted perimeter');

// The percentage and the efficiency are two views of one number and must add to 100.
r.close(us.num('cs_pct_loss') + us.num('cs_Ec'), 100, 1e-9,
	'percentage lost and conveyance efficiency add to 100');

// =========================================================================================
r.section('the same canal in SI -- the identities are unit-free, so they must survive');

// Entering the identical PHYSICAL canal in metric, and expecting the identical physical answers.
(function () {
	const page = loadCalculator('Canal-Seepage.php', { lang: 'es' });
	page.units('si');
	page.set({
		cs_Q_in: CASE.qIn * FT3, cs_Q_out: CASE.qOut * FT3,
		cs_L: CASE.lengthFt * FT, cs_wp: CASE.wpFt * FT,
		cs_water_value: CASE.waterValue, cs_lining_cost: CASE.liningCost,
		cs_Ec_target: CASE.ecTarget
	});
	page.run();
	nearDisplayed(page.num('cs_Q_loss'), (CASE.qIn - CASE.qOut) * FT3, 4,
		'the seepage loss in m3/s is the same physical loss');
	r.close(page.num('cs_Ec'), us.num('cs_Ec'), 1e-9,
		'efficiency is a ratio and does not move with the units');
	nearDisplayed(page.num('cs_Vol_year'), (CASE.qIn - CASE.qOut) * YEAR * FT3, 0,
		'the annual volume in m3 is the same physical volume');
	nearDisplayed(page.num('cs_lining_area'), CASE.lengthFt * CASE.wpFt * FT2, 0,
		'the lining area in m2 is the same physical area');
	nearDisplayed(page.num('cs_Q_loss_per_L'), (CASE.qIn - CASE.qOut) * FT3 / (CASE.lengthFt * FT), 6,
		'and the loss per metre is the same physical unit discharge');
}());

// =========================================================================================
r.section('the money section, asserted where its unit conversions are the identity');

// Under SI every factor is 1, so the arithmetic is visible on its own; the US block below is the
// one that exercises the reciprocal conversion of the two price inputs.
const si = loadCase('si');
(function () {
	const qLoss = CASE.qIn - CASE.qOut;
	const volYear = qLoss * YEAR;                                  // m3, the SI entry is unconverted
	const area = CASE.lengthFt * CASE.wpFt;                        // m2, likewise
	nearDisplayed(si.num('cs_annual_value_lost'), volYear * CASE.waterValue, 2,
		'the annual value lost is the annual volume times the price of water');
	// Lining takes the canal from Ec = 0.90 to the 0.95 target, so it recovers 5% of the inflow.
	const recovered = CASE.qIn * (CASE.ecTarget - CASE.qOut / CASE.qIn) * YEAR;
	nearDisplayed(si.num('cs_annual_value_recovered'), recovered * CASE.waterValue, 2,
		'the value recovered is the inflow times the efficiency gained');
	nearDisplayed(si.num('cs_lining_total_cost'), area * CASE.liningCost, 2,
		'the lining bill is the area times the unit cost');
}());

// Payback needs a case of its own. On the numbers above it comes to two days, and a cell carrying
// one decimal cannot say anything about a division that lands on 0.0. Concrete lining at $40/m2
// against water worth 2 cents a cubic metre pays back in years, where the figure means something.
(function () {
	const slow = loadCase('si', { waterValue: 0.02, liningCost: 40 });
	const recovered = CASE.qIn * (CASE.ecTarget - CASE.qOut / CASE.qIn) * YEAR * 0.02;
	const cost = CASE.lengthFt * CASE.wpFt * 40;
	nearDisplayed(parseFloat(slow.html('cs_payback_years')), cost / recovered, 1,
		'simple payback is the capital cost over the annual saving');
	r.ok(cost / recovered > 1 && cost / recovered < 50,
		'and the case chosen has a payback long enough for the cell to resolve it',
		`${(cost / recovered).toFixed(2)} years`);
}());

// The same money, entered in US units -- the case that was wrong by the factor squared.
(function () {
	const qLoss = CASE.qIn - CASE.qOut;
	const volYearFt3 = qLoss * YEAR;                               // ft3 lost in a Julian year
	const areaFt2 = CASE.lengthFt * CASE.wpFt;                     // ft2 of lining
	nearDisplayed(us.num('cs_annual_value_lost'), volYearFt3 * CASE.waterValue, 2,
		'ft3 lost per year at a price per ft3 is that many dollars');
	const recoveredFt3 = CASE.qIn * (CASE.ecTarget - CASE.qOut / CASE.qIn) * YEAR;
	nearDisplayed(us.num('cs_annual_value_recovered'), recoveredFt3 * CASE.waterValue, 2,
		'and the ft3 recovered by lining likewise');
	nearDisplayed(us.num('cs_lining_total_cost'), areaFt2 * CASE.liningCost, 2,
		'ft2 of lining at a price per ft2 is that many dollars');
	// Currency is currency: the same physical canal at the same physical price must cost the
	// same in either preset, and that invariance is what proves the direction of the conversion.
	const siEquiv = loadCalculator('Canal-Seepage.php', { lang: 'es' });
	siEquiv.units('si');
	siEquiv.set({
		cs_Q_in: CASE.qIn * FT3, cs_Q_out: CASE.qOut * FT3,
		cs_L: CASE.lengthFt * FT, cs_wp: CASE.wpFt * FT,
		cs_water_value: CASE.waterValue / FT3,      // the same price, per cubic metre
		cs_lining_cost: CASE.liningCost / FT2,      // the same price, per square metre
		cs_Ec_target: CASE.ecTarget
	});
	siEquiv.run();
	r.close(siEquiv.num('cs_annual_value_lost'), us.num('cs_annual_value_lost'), 1e-6,
		'the annual value lost is the same money in SI as in US');
	r.close(siEquiv.num('cs_lining_total_cost'), us.num('cs_lining_total_cost'), 1e-6,
		'and so is the lining bill');
}());

// Payback in US units, on the slow case, so the reciprocal reaches the years figure too.
(function () {
	// Water worth 2 cents a cubic foot against $4/ft2 lining: a payback of years, where the
	// one-decimal cell means something.
	const slowUs = loadCase('us', { waterValue: 0.02, liningCost: 4 });
	const recovered = CASE.qIn * (CASE.ecTarget - CASE.qOut / CASE.qIn) * YEAR * 0.02;
	const cost = CASE.lengthFt * CASE.wpFt * 4;
	nearDisplayed(parseFloat(slowUs.html('cs_payback_years')), cost / recovered, 1,
		'simple payback in US units is the capital cost over the annual saving');
}());

// =========================================================================================
r.section('the recovery clamp, and a payback that does not exist');

// A target no better than what the canal already delivers recovers nothing, and a payback period
// computed from nothing is not a number -- the page must say so rather than print a huge one.
(function () {
	const none = loadCase('si', { ecTarget: 0.90 });
	nearDisplayed(none.num('cs_annual_value_recovered'), 0, 2,
		'a target equal to the present efficiency recovers nothing');
	r.eq(none.html('cs_payback_years'), '—', 'and the payback cell is an em dash, not a number');
	const worse = loadCase('si', { ecTarget: 0.5 });
	nearDisplayed(worse.num('cs_annual_value_recovered'), 0, 2,
		'a target BELOW the present efficiency recovers nothing either, never a negative saving');
	r.eq(worse.html('cs_payback_years'), '—', 'and it too declines to name a payback period');
}());

// =========================================================================================
r.section('the status lines say what the numbers mean');

(function () {
	r.ok(/seepage|infiltra/i.test(us.text('cs_loss_check')) || us.html('cs_loss_check') !== '',
		'a canal losing water reports that it is losing water',
		us.html('cs_loss_check').replace(/<[^>]*>/g, ''));
	// Ec = 0.90 is above the page's 0.80 line, so a tick.
	r.ok(/✓/.test(us.html('cs_Ec_check')), 'Ec = 90% is reported as good',
		us.html('cs_Ec_check').replace(/<[^>]*>/g, ''));
	// 0.70 is the middle band, 0.50 the bottom one; both carry the caution glyph, and the wording
	// must differ or the bands are not doing anything.
	const fair = loadCase('us', { qOut: 14 });     // Ec = 0.70
	const poor = loadCase('us', { qOut: 10 });     // Ec = 0.50
	r.ok(/⚠/.test(fair.html('cs_Ec_check')), 'Ec = 70% is a caution',
		fair.html('cs_Ec_check').replace(/<[^>]*>/g, ''));
	r.ok(/⚠/.test(poor.html('cs_Ec_check')), 'Ec = 50% is a caution',
		poor.html('cs_Ec_check').replace(/<[^>]*>/g, ''));
	r.ok(fair.html('cs_Ec_check') !== poor.html('cs_Ec_check'),
		'and the fair and poor bands do not say the same thing');
	// A canal that GAINS water is a measurement to question, not a negative seepage rate.
	const gaining = loadCase('us', { qOut: 22 });
	nearDisplayed(gaining.num('cs_Q_loss'), -2, 4, 'more out than in reports a negative loss');
	r.ok(/⚠/.test(gaining.html('cs_loss_check')),
		'and flags it, rather than reporting a gain as a result',
		gaining.html('cs_loss_check').replace(/<[^>]*>/g, ''));
}());

// =========================================================================================
r.section('a canal with no measured loss');

(function () {
	const tight = loadCase('us', { qOut: 20 });
	nearDisplayed(tight.num('cs_Q_loss'), 0, 4, 'equal inflow and outflow is zero seepage');
	nearDisplayed(tight.num('cs_Ec'), 100, 2, 'and 100% conveyance efficiency');
	nearDisplayed(tight.num('cs_Vol_year'), 0, 0, 'and no annual volume lost');
	r.ok(tight.html('cs_loss_check') !== '' && !/⚠/.test(tight.html('cs_loss_check')),
		'reported neutrally -- it is neither a finding nor a fault',
		tight.html('cs_loss_check').replace(/<[^>]*>/g, ''));
}());

r.finish();
