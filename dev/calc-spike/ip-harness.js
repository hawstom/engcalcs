// Irrigation Pressure (ip_) -- a worked example, anchored against the source methods.
//
//   node dev/calc-spike/ip-harness.js
//
// WHAT IT IS ANCHORED AGAINST. Every expected number below is recomputed here from a published
// equation, in this file's own arithmetic, and only then compared with what the page displays.
//
//   * EMITTER DISCHARGE: q = k h^x, the standard emitter characteristic (ASAE EP405; Keller &
//     Bliesner, Sprinkle and Trickle Irrigation, ch. 7), with k fixed by the design point,
//     k = q_design / h_design^x. The check used here is its DIMENSIONLESS form,
//     q_critical / q_design = (h_far / h_design)^x, which no unit factor can launder.
//   * MULTI-OUTLET REDUCTION: Christiansen's F(n) (Christiansen 1942; Keller & Bliesner Table
//     8.3), F = 1/(m+1) + 1/(2n) + sqrt(m-1)/(6 n^2). Checked against the PUBLISHED TABLE for the
//     m = 1.75 column -- F(2) = 0.650, F(5) = 0.469, F(10) = 0.415, F(20) = 0.389, F(100) = 0.369
//     -- which is a reference outside this repo entirely.
//   * FRICTION: Darcy-Weisbach h_f = f (L/d) V^2 / 2g with f from Swamee & Jain (1976),
//     f = 0.25 / [log10( e/(3.7 d) + 5.74 / Re^0.9 )]^2, cross-checked here against the equation
//     it approximates -- Colebrook-White, solved by fixed-point iteration.
//   * THE MARCH AND THE BISECTION, which are ip_'s own: the energy equation stepped reach by
//     reach from the critical emitter back to the supply. The test that matters for an ITERATIVE
//     calculator is not the formulas but the CONVERGENCE -- so the reported h_far is fed back
//     through an independent forward march written here, and that march must land on the supply
//     pressure the user actually entered. A bisection that stopped early fails that and cannot
//     fail anything else.
//   * APPLICATION DESIGN: A_e = Se x Sl, PR = q / A_e, and run time = depth / PR, which are
//     definitions rather than models, and are checked as such.
//
// THE ONE THING DELIBERATELY NOT ASSERTED. A reach's h_ds cell is the pressure at its downstream
// NODE, and where the reach below has a different diameter that node has two velocity heads and
// therefore two "pressures" -- the page uses this reach's own area for the continuing flow. That
// is a convention, not a result, so this harness asserts h_ds only on the LAST reach, where the
// continuing flow is zero and the convention cannot matter. h_us, which is unambiguous, carries
// the head bookkeeping instead.
//
// EVERY WORKED NETWORK HERE IS TURBULENT ON PURPOSE (Re > 4000, asserted). Between Re 2000 and
// 4000 the page blends with a bespoke cubic that approximates nothing published, so a worked
// example sited there would be testing an interpolation against itself.
//
// MUTATIONS TRIED, all caught:
//   1. christiansenM 1.75 -> 1.9                (the published F(n) table, and the lateral h_f)
//   2. christiansenF sqrt(m-1)/(6n^2) dropped   (the published F(n) table at small n)
//   3. ipMarch hf omits the F(n) factor          (the lateral reach's h_f, and h_far)
//   4. the bisection loop cut from 60 passes to 8  (the convergence residual)
//   5. k = q_design / h_design^x  ->  q_design * h_design^x   (the emitter identity)
//   6. ipMarch hUs keeps the velocity head       (h_us on every reach, and h_far)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

const { loadCalculator, makeReporter } = require('./calc-page.js');

const r = makeReporter('Irrigation Pressure (ip_) worked example');

// Row cells are written with .toFixed(4) and the summary cells with 2-4 decimals, so anything
// read out of the page is quantised at roughly 1e-5 relative. 1e-4 is the tightest honest
// tolerance on a displayed number; the mutations above miss by orders of magnitude more.
const TOL = 1e-4;

/**
 * Compares against a cell written with .toFixed(dp). A RELATIVE tolerance is the wrong tool for a
 * small number in a fixed-decimal cell: a velocity head of 0.0033 ft is displayed to within half
 * of 1e-4, which is 1.5% of itself. Half a displayed unit is the honest statement there, and TOL
 * relative takes over once the number is big enough for that to be the looser of the two.
 */
function nearDisplayed(actual, expected, dp, label) {
	const slack = Math.max(0.5 * Math.pow(10, -dp), Math.abs(expected) * TOL);
	r.report(Math.abs(actual - expected) <= slack, label,
		`got ${actual}, want ${expected} (±${slack.toExponential(2)})`);
}

// ---- reference arithmetic, from the exact definitions ------------------------------------
const FT = 0.3048;                  // exactly, by definition
const GAL = 3.785411784e-3;         // m3, exactly, by definition
const IN = FT / 12;
const G = 9.80665;                  // m/s2, standard gravity
const GPH = GAL / 3600;             // m3/s per gal/h
const NU = 1e-6;                    // m2/s, the page's default kinematic viscosity

/** Swamee & Jain (1976) friction factor. */
function swameeJain(re, e, d) {
	return 0.25 / Math.pow(Math.log10(e / (3.7 * d) + 5.74 / Math.pow(re, 0.9)), 2);
}

/** Colebrook-White by fixed-point iteration -- the equation Swamee-Jain approximates. */
function colebrook(re, e, d) {
	let f = 0.02;
	for (let i = 0; i < 200; i += 1) {
		const rhs = -2 * Math.log10(e / (3.7 * d) + 2.51 / (re * Math.sqrt(f)));
		f = 1 / (rhs * rhs);
	}
	return f;
}

/** Christiansen's F, written straight from the published formula with m = 1.75. */
function christiansen(n, m) {
	if (n <= 1) { return 1; }
	const mm = (m === undefined) ? 1.75 : m;
	return 1 / (mm + 1) + 1 / (2 * n) + Math.sqrt(mm - 1) / (6 * n * n);
}

// ---- the worked network -------------------------------------------------------------------
//
// A 300 ft 2 in submain carrying the whole field flow to the head of the test lateral, then a
// 150 ft 3/4 in lateral with 50 emitters on it. Ground falls 165 -> 163 -> 160 ft, so the
// elevation term has a sign to get wrong. Nothing is left blank: a blank elevation takes the
// "flat" fallback, which is a separate behaviour and is checked on its own below.
const SUPPLY = { hSupplyFt: 40, elevSupplyFt: 165, qDesignGph: 2, hDesignFt: 15, x: 0.5 };
const REACHES = [
	{ isLateral: false, count: 50, lengthFt: 300, diaIn: 2, roughFt: 0.000005, k: 0, elevFt: 163 },
	{ isLateral: true, count: 50, lengthFt: 150, diaIn: 0.75, roughFt: 0.000005, k: 0, elevFt: 160 }
];

/**
 * An INDEPENDENT forward march, written from the energy equation rather than copied from the
 * page: given a pressure head at the critical emitter, what supply pressure does the system
 * need? Everything is SI here; the caller converts.
 */
function marchToSupply(hFarSi) {
	const kEmitter = (SUPPLY.qDesignGph * GPH) / Math.pow(SUPPLY.hDesignFt * FT, SUPPLY.x);
	const rows = REACHES.map(row => ({
		isLateral: row.isLateral, count: row.count,
		L: row.lengthFt * FT, d: row.diaIn * IN, e: row.roughFt * FT, k: row.k,
		elev: row.elevFt * FT
	}));
	let qDs = 0, hDs = hFarSi, elevDs = rows[rows.length - 1].elev;
	const out = [];
	for (let i = rows.length - 1; i >= 0; i -= 1) {
		const row = rows[i];
		const eglDs = hDs + elevDs;
		// A lateral's own emitters discharge at the pressure at its far end; a submain simply
		// carries the design flow of every emitter downstream of it.
		const draw = row.isLateral
			? kEmitter * Math.pow(Math.max(hDs, 0), SUPPLY.x) * row.count
			: SUPPLY.qDesignGph * GPH * row.count;
		const qUs = qDs + draw;
		const a = Math.PI * row.d * row.d / 4;
		const v = qUs / a;
		const re = v * row.d / NU;
		const f = swameeJain(re, row.e, row.d);
		const fN = row.isLateral ? christiansen(row.count) : 1;
		const hv = v * v / (2 * G);
		const hf = fN * f * (row.L / row.d) * hv;
		const hm = row.k * hv;
		const elevUs = (i === 0) ? SUPPLY.elevSupplyFt * FT : rows[i - 1].elev;
		const hUs = eglDs + hf + hm - elevUs - hv;
		out[i] = { qUs: qUs, qDs: qDs, v: v, hv: hv, hf: hf, hm: hm, hUs: hUs, re: re };
		qDs = qUs; elevDs = elevUs; hDs = hUs;
	}
	return { hSupply: hDs, rows: out, kEmitter: kEmitter };
}

/** Loads the page, trims its sample table to two reaches and enters the network above. */
function loadWorked(overrides) {
	const o = overrides || {};
	const page = loadCalculator('Irrigation-Pressure.php');
	page.initRows();
	while (page.rowCount() > REACHES.length) { page.removeRow(); }
	page.units('us');
	// Heads in feet of water, so this file's arithmetic stays in the units the energy equation
	// is written in rather than in psi.
	['h_supply', 'h_design', 'dp_avg', 'h_far', 'h_us', 'h_ds', 'hf', 'hm', 'hl', 'hv', 'h_max_allow']
		.forEach(n => page.unit(n, 'fth2o'));
	page.set({
		h_supply: (o.hSupplyFt === undefined ? SUPPLY.hSupplyFt : o.hSupplyFt),
		elev_supply: SUPPLY.elevSupplyFt,
		q_design: SUPPLY.qDesignGph,
		h_design: SUPPLY.hDesignFt,
		x: (o.x === undefined ? SUPPLY.x : o.x),
		dp_avg: 0, visc: NU, h_max_allow: '',
		se: 2, sl: 5, n_e: 10, n_l: 10, d: 0.75
	});
	REACHES.forEach(function (row, i) {
		page.setRow(i, {
			is_lateral: row.isLateral, count: row.count,
			l: (o.lengthFt && o.lengthFt[i] !== undefined) ? o.lengthFt[i] : row.lengthFt,
			diameter: row.diaIn, roughness: row.roughFt, k_minor: row.k,
			elev_ds: (o.elevFt && o.elevFt[i] !== undefined) ? o.elevFt[i] : row.elevFt
		});
	});
	page.run();
	return page;
}

// =========================================================================================
r.section('Christiansen\'s F(n), against the published m = 1.75 column');

const probe = loadCalculator('Irrigation-Pressure.php');
r.eq(probe.EngCalcs.christiansenM, 1.75, 'the loss exponent is Blasius smooth-turbulent, m = 1.75');
// Keller & Bliesner, Sprinkle and Trickle Irrigation, Table 8.3 (m = 1.75). Three decimals is
// all the table carries, which is why these compare to 5e-4 and not to TOL.
[[1, 1.000], [2, 0.650], [5, 0.469], [10, 0.415], [20, 0.389], [100, 0.369]].forEach(function (p) {
	r.close(probe.EngCalcs.christiansenF(p[0]), p[1], 5e-4 / p[1],
		`F(${p[0]}) matches the published table`);
});
r.close(probe.EngCalcs.christiansenF(50), christiansen(50), 1e-12,
	'and F(50), the value this harness\'s worked example needs');

// =========================================================================================
r.section('the worked network -- reach results against an independent march');

const page = loadWorked();
const hFarFt = page.num('h_far');
const ref = marchToSupply(hFarFt * FT);

r.ok(ref.rows.every(row => row.re > 4000),
	'both reaches are fully turbulent, where Swamee-Jain applies',
	ref.rows.map(row => 'Re = ' + row.re.toFixed(0)).join(', '));

for (let i = 0; i < REACHES.length; i += 1) {
	r.close(page.rowNum('q_us', i), ref.rows[i].qUs / GPH, TOL, `reach ${i}: flow entering it, gal/h`);
	r.close(page.rowNum('q_ds', i), ref.rows[i].qDs / GPH, TOL, `reach ${i}: flow leaving it, gal/h`);
	r.close(page.rowNum('v', i), ref.rows[i].v / FT, TOL, `reach ${i}: velocity, ft/s`);
	nearDisplayed(page.rowNum('hv', i), ref.rows[i].hv / FT, 4, `reach ${i}: velocity head, ft`);
	r.close(page.rowNum('hf', i), ref.rows[i].hf / FT, TOL, `reach ${i}: friction loss, ft`);
	r.close(page.rowNum('h_us', i), ref.rows[i].hUs / FT, TOL, `reach ${i}: upstream pressure head, ft`);
}
// The lateral's friction is REDUCED by F(50) -- 50 outlets, not one end discharge. Removing the
// factor would raise it by 1/0.3737, so this is the check that the reduction is applied at all,
// and applied only to the lateral.
(function () {
	const lateral = ref.rows[1];
	const noF = lateral.hf / christiansen(50);
	r.ok(Math.abs(page.rowNum('hf', 1) - noF / FT) / (noF / FT) > 0.5,
		'the lateral\'s friction carries Christiansen\'s reduction, not the full-flow loss',
		`${page.rowNum('hf', 1).toFixed(4)} ft, vs ${(noF / FT).toFixed(4)} ft undiscounted`);
	r.close(christiansen(50), 0.37371, 1e-3, 'F(50) is about 0.374');
}());

// =========================================================================================
r.section('convergence -- the reported answer must satisfy the equation it was solved from');
//
// This is the check a set of formulas cannot make. h_far is found by bisection; feeding it back
// through the march must reproduce the supply pressure the user entered. A loop that stopped
// early, or a bracket set too narrow, fails here and nowhere else.

r.close(ref.hSupply / FT, SUPPLY.hSupplyFt, 1e-5,
	'marching forward from the reported h_far lands on the entered supply pressure');
r.close(page.rowNum('h_us', 0), SUPPLY.hSupplyFt, TOL,
	'and the page says so itself: the first reach\'s upstream pressure IS the supply pressure');
// The last reach's downstream node carries no continuing flow, so its pressure is h_far exactly.
r.close(page.rowNum('h_ds', REACHES.length - 1), hFarFt, TOL,
	'the last reach\'s downstream pressure is the critical emitter pressure');

// =========================================================================================
r.section('the emitter equation, in its dimensionless form');

r.close(page.num('q_critical') / SUPPLY.qDesignGph,
	Math.pow(hFarFt / SUPPLY.hDesignFt, SUPPLY.x), TOL,
	'q_critical / q_design = (h_far / h_design)^x');
// x = 0 is a perfectly pressure-compensating emitter: the same discharge at any pressure.
const compensating = loadWorked({ x: 0 });
r.close(compensating.num('q_critical'), SUPPLY.qDesignGph, TOL,
	'x = 0 (pressure-compensating) gives the design discharge whatever the pressure');
// x = 1 makes discharge proportional to pressure, so the ratio is the pressure ratio itself.
const linear = loadWorked({ x: 1 });
r.close(linear.num('q_critical') / SUPPLY.qDesignGph,
	linear.num('h_far') / SUPPLY.hDesignFt, TOL,
	'x = 1 makes discharge proportional to pressure head');

// =========================================================================================
r.section('Swamee-Jain against Colebrook-White');

(function () {
	const row = REACHES[1], d = row.diaIn * IN, e = row.roughFt * FT;
	const re = ref.rows[1].re;
	const fSj = swameeJain(re, e, d), fCw = colebrook(re, e, d);
	r.close(fSj, fCw, 0.01,
		'the lateral\'s friction factor is within Swamee-Jain\'s claimed 1% of Colebrook-White',
		`f = ${fSj.toFixed(6)} vs ${fCw.toFixed(6)}`);
}());

// =========================================================================================
r.section('friction is linear in length -- dimensionless, so no unit factor can launder it');

// AT CONSTANT FLOW, which on this page means x = 0: with pressure-compensating emitters every
// discharge is fixed, so lengthening a pipe changes its loss and nothing else. With the default
// x = 0.5 the extra loss lowers the emitter pressure, which lowers the flow, which lowers the
// loss -- a true feedback, and asserting exact linearity through it would be asserting a
// coincidence.
const fixedFlow = loadWorked({ x: 0 });
const fixedFlowLonger = loadWorked({ x: 0, lengthFt: [600, 150] });
// The submain loss is about 0.2 ft in a 4-decimal cell, so the RATIO of two of them is only
// good to about 5e-4 -- looser than TOL, and for the display's reasons rather than the physics'.
r.close(fixedFlowLonger.rowNum('hf', 0) / fixedFlow.rowNum('hf', 0), 2, 1e-3,
	'doubling the submain doubles its friction loss');
r.close(fixedFlowLonger.rowNum('hf', 1), fixedFlow.rowNum('hf', 1), TOL,
	'and leaves the lateral it feeds untouched');
r.close(fixedFlowLonger.rowNum('q_us', 0), fixedFlow.rowNum('q_us', 0), TOL,
	'the flows really are unmoved -- that is what makes the ratio exact');

// =========================================================================================
r.section('application design -- definitions, checked as definitions');
//
//   A_e = Se x Sl = 2 ft x 5 ft = 10 ft2
//   PR  = q_avg_field / A_e
//   q_lat = n_e x q_avg_field;  q_sys = n_l x q_lat
//   run time = depth / PR

r.close(page.num('a_e'), 10, TOL, 'the emitter wetted area is Se x Sl = 10 ft2');
(function () {
	const qAvg = page.num('q_avg_field');          // gal/h
	const prInPerH = page.num('pr');               // in/h
	// gal/h over ft2, expressed in inches per hour.
	const expected = (qAvg * GPH) / (10 * FT * FT) / IN * 3600;
	nearDisplayed(prInPerH, expected, 2, 'the precipitation rate is q_avg_field / A_e');
	r.close(page.num('q_lat'), 10 * qAvg, 1e-3, 'a lateral draws n_e x q_avg_field');
	r.close(page.num('q_sys'), 10 * page.num('q_lat'), 1e-3, 'the system draws n_l x q_lat');
	// 0.75 in of water at that rate, in hours.
	r.close(parseFloat(page.html('t_run')), 0.75 / prInPerH, 1e-2,
		'the run time is the application depth divided by the precipitation rate');
}());

// =========================================================================================
r.section('the same network in SI -- the display factors are a lens, not a second calculator');

(function () {
	const si = loadCalculator('Irrigation-Pressure.php');
	si.initRows();
	while (si.rowCount() > REACHES.length) { si.removeRow(); }
	si.units('si');
	['h_supply', 'h_design', 'dp_avg', 'h_far', 'h_us', 'h_ds', 'hf', 'hm', 'hl', 'hv']
		.forEach(n => si.unit(n, 'mh2o'));
	si.set({
		h_supply: SUPPLY.hSupplyFt * FT, elev_supply: SUPPLY.elevSupplyFt * FT,
		q_design: SUPPLY.qDesignGph * GPH * 3600 * 1000,   // L/h
		h_design: SUPPLY.hDesignFt * FT, x: SUPPLY.x,
		dp_avg: 0, visc: NU, h_max_allow: '', se: 2 * FT, sl: 5 * FT, n_e: 10, n_l: 10, d: 0.75 * IN * 1000
	});
	REACHES.forEach(function (row, i) {
		si.setRow(i, {
			is_lateral: row.isLateral, count: row.count,
			l: row.lengthFt * FT, diameter: row.diaIn * 25.4,
			roughness: row.roughFt * FT * 1000, k_minor: row.k, elev_ds: row.elevFt * FT
		});
	});
	si.run();
	r.close(si.num('h_far'), hFarFt * FT, TOL,
		'the critical emitter pressure in metres matches the US-unit worked example');
	for (let i = 0; i < REACHES.length; i += 1) {
		nearDisplayed(si.rowNum('hf', i), ref.rows[i].hf, 4,
			`reach ${i}: friction loss in metres matches the US-unit worked example`);
		nearDisplayed(si.rowNum('v', i), ref.rows[i].v, 4,
			`reach ${i}: velocity in m/s matches the US-unit worked example`);
	}
}());

// =========================================================================================
r.section('a design that cannot be delivered says so, rather than answering');

// The field is 15 ft ABOVE the supply and the supply has 5 ft of pressure: even a critical
// emitter at zero pressure needs more than the supply can give, so the bisection has no bracket
// at all. The page must say so rather than print the end of its search.
// (Simply lowering the supply pressure does NOT do this -- the default field falls 5 ft, and the
// elevation it gains back is exactly what the bracket's upper bound is widened by.)
const starved = loadWorked({ hSupplyFt: 5, elevFt: [172, 180] });
r.ok(starved.text('ip_msg') !== '', 'no bracket -> the page states there is no solution',
	starved.text('ip_msg'));
r.ok(!/\d/.test(starved.html('h_far')), 'and h_far is dashed rather than a number',
	starved.html('h_far'));
r.ok(page.text('ip_msg') === '', 'a deliverable design carries no such message');

r.finish();
