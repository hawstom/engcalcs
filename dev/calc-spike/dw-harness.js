// Behavioural test of Darcy-Weisbach -- the friction factor is the whole calculator.
//
//   node dev/calc-spike/dw-harness.js
//
// ROADMAP Task 292. Before this file, nothing confirmed that Darcy-Weisbach.php still computes
// Darcy-Weisbach: the smoke harness checked that the page ran and wrote no NaN, which a wrong
// 3.7, a wrong 5.74 or a 64/Re written as 32/Re would sail straight through.
//
// WHAT IT ANCHORS AGAINST, and why none of it is circular. The page itself names its three
// regimes and the method it uses in each (it prints them in the `f_method` cell), so the source
// method is not in doubt -- only whether the code implements it. Each regime gets its own
// outside reference:
//
//   1. LAMINAR, Re < 2000: f = 64/Re. The Hagen-Poiseuille result, exact and not an
//      approximation of anything -- the one place in this calculator where the right answer is
//      a closed form with no reading error at all.
//
//   2. TURBULENT, Re > 4000: the page uses Swamee-Jain, which exists only as an explicit
//      approximation to the implicit COLEBROOK-WHITE equation
//
//          1/sqrt(f) = -2 log10( eps/(3.7 D) + 2.51/(Re sqrt(f)) )
//
//      so Colebrook-White is the reference and Swamee-Jain's published agreement with it is
//      the acceptance criterion. This harness solves Colebrook itself, by bisection on
//      x = 1/sqrt(f), and compares. Swamee-Jain (1976) is quoted as within 1% of Colebrook over
//      1e-6 <= eps/D <= 1e-2 and 5e3 <= Re <= 1e8; MEASURED on that grid by this file's own
//      solver the worst case is 2.7%, at the roughest/slowest corner (eps/D = 7.5e-3,
//      Re = 5000), so the bound used below is 3% and the reason it is not tighter is stated
//      rather than hidden. It is still a hard test. Five mutations were made to
//      js/darcy-weisbach.js on purpose to prove this file bites, and all five went red:
//      64/Re -> 32/Re (5 checks), 3.7 -> 3.0 (18), 5.74 -> 5.0 (16), the 2 in 2 g D -> 2.5 (9),
//      and one coefficient of the transitional cubic, 17 fa -> 16 fa (13).
//
//      Two limits of Colebrook are checked separately because they are closed forms and admit a
//      much tighter bound than the correlation does:
//        - FULLY ROUGH: as Re -> infinity the viscous term vanishes and
//          f -> [-2 log10(eps/(3.7 D))]^-2, the horizontal right-hand end of the Moody chart.
//        - SMOOTH: compared against the Blasius correlation f = 0.316 Re^-0.25, an independent
//          19th-century fit valid for smooth pipe over 4e3 < Re < 1e5. Colebrook and Blasius
//          differ by up to 2.5% over that band (measured), so the bound is 4%.
//
//   3. TRANSITIONAL, 2000 < Re < 4000: the cubic in the code is Dunlop's interpolation, the one
//      EPANET uses, and the entire point of it is that it JOINS the two regimes either side. So
//      the reference is the regimes it connects, and the test is continuity: f must approach
//      64/2000 = 0.032 at the lower end and the turbulent f at the upper end. That is a
//      property of the four x-coefficients jointly and no single one of them can be wrong
//      without breaking it -- summing the cubic by hand at r = 1 gives exactly 0.032 (all fa
//      and fb terms cancel) and at r = 2 gives exactly fa, which is algebraically identical to
//      Swamee-Jain evaluated at Re = 4000 because 0.86859 * ln(10) = 2.
//
//   4. THE DARCY-WEISBACH EQUATION ITSELF, which is the other half of the calculator and is
//      independent of how f was obtained: h_f = f (L/D) V^2/(2g), h_m = k_m V^2/(2g), and the
//      EGL/HGL bookkeeping that turns those into a downstream pressure.
//
//   5. THE PAGE'S FACTORY DEFAULTS opening on a passing design, in both unit presets, per
//      CLAUDE.md.
//
// The form, the defaults and the unit factors are read out of the rendered page; nothing about
// the calculator is restated here except the physics.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

const { loadCalculator, makeReporter } = require('./calc-page.js');

const r = makeReporter('Darcy-Weisbach (dw_)');
const page = loadCalculator('Darcy-Weisbach.php');

const G = page.EngCalcs.G;

// ---- the reference implementation, written here rather than imported -----------------------
// Colebrook-White, solved by bisection on x = 1/sqrt(f). g(x) is monotonically increasing in x
// (the 2.51*x/Re term grows, so its log grows, so -2 log10 shrinks -- and x - that is
// increasing), which is what makes plain bisection safe without a starting guess.
function colebrook(relRough, re) {
	let lo = 0.5, hi = 200;
	const g = x => x + 2 * Math.log10(relRough / 3.7 + 2.51 * x / re);
	for (let i = 0; i < 300; i++) {
		const m = (lo + hi) / 2;
		if (g(m) > 0) { hi = m; } else { lo = m; }
	}
	const x = (lo + hi) / 2;
	return 1 / (x * x);
}

// The page reads kinematic viscosity as a plain number in m^2/s (no unit select), so the whole
// Reynolds number is under the harness's control: Re = 4Q/(pi D nu).
const NU = 1e-6;          // water at about 20 C
const D_MM = 300;         // one pipe throughout, so only Re and eps/D vary
const D = D_MM / 1000;
const AREA = Math.PI * D * D / 4;

/** Drives the page at a chosen Reynolds number and relative roughness, in SI. */
function at(re, relRough) {
	const q = re * NU * Math.PI * D / 4;         // m^3/s
	page.units('si').set({
		q: q * 1000,                              // lps
		d: D_MM,                                  // mm
		l: 100,                                   // m
		e: relRough * D_MM,                       // mm
		v: NU,
		km: 0,
		z_up: 100, p_up: 0, z_down: 100
	}).run();
	return {
		q: q,
		u: q / AREA,
		f: page.num('f'),                          // printed to 4 decimals
		re: page.num('re'),
		sf: page.si('sf'),
		method: page.html('f_method')
	};
}

// ---- 1. laminar: f = 64/Re, exactly -------------------------------------------------------
r.section('laminar regime: Hagen-Poiseuille f = 64/Re');

// f prints to 4 decimals, so an f of 0.064 is quantised to about 0.08%; 0.5% is comfortably
// finer than any wrong constant would be (32/Re is 50% out, 32 vs 64 is not a near miss).
const LAMINAR_TOL = 5e-3;

for (const re of [500, 1000, 1600, 1999]) {
	const s = at(re, 0.001);
	r.close(s.re, re, 1e-3, `Re = ${re} is reproduced by the page from Q, D and nu`);
	r.close(s.f, 64 / re, LAMINAR_TOL, `Re = ${re}: f = 64/Re = ${(64 / re).toFixed(4)}`);
}
r.ok(/Pouseuille|Poiseuille/.test(at(1000, 0.001).method),
	'and the page names Hagen-Poiseuille as the method it used');

// Roughness cannot matter in laminar flow -- the viscous sublayer covers the wall. A code path
// that let eps leak into the laminar branch would still look plausible in the f cell.
const smooth = at(1000, 1e-6), rough = at(1000, 1e-2);
r.eq(smooth.f, rough.f, 'laminar f is independent of roughness (eps/D from 1e-6 to 1e-2)');

// ---- 2. turbulent: Swamee-Jain against Colebrook-White ------------------------------------
r.section('turbulent regime: Swamee-Jain vs an independent Colebrook-White solve');

// 3%, because that is the MEASURED worst-case disagreement between the two over the band
// Swamee-Jain is published for (see the header); it is not a tolerance chosen to make the test
// pass, and every corner of the grid below is inside it.
const SJ_TOL = 3e-2;

let worst = 0, worstAt = '';
for (const relRough of [1e-6, 1e-5, 1e-4, 1e-3, 5e-3, 1e-2]) {
	for (const re of [1e4, 1e5, 1e6, 1e7]) {
		const s = at(re, relRough);
		const want = colebrook(relRough, re);
		const err = Math.abs(s.f - want) / want;
		if (err > worst) { worst = err; worstAt = `eps/D=${relRough}, Re=${re}`; }
		r.close(s.f, want, SJ_TOL,
			`eps/D = ${relRough}, Re = ${re.toExponential(0)}: f = ${want.toFixed(5)} (Colebrook)`);
	}
}
r.ok(worst < SJ_TOL, 'worst Swamee-Jain / Colebrook disagreement over the grid',
	`${(worst * 100).toFixed(2)}% at ${worstAt}`);
r.ok(/Swamee/.test(at(1e5, 1e-3).method), 'and the page names Swamee-Jain as the method it used');

// The two closed-form limits, which admit a much tighter bound than the correlation does.
r.section('turbulent limits: fully rough, and smooth-pipe against Blasius');

for (const relRough of [1e-3, 5e-3, 1e-2]) {
	// Re = 1e8 is the top of Swamee-Jain's published band; the viscous term is 5.74/Re^0.9,
	// which is 1.4e-7 there -- three orders below eps/3.7D at the roughest of these, so f is
	// within reading distance of the Moody chart's flat right-hand end.
	const s = at(1e8, relRough);
	const want = Math.pow(-2 * Math.log10(relRough / 3.7), -2);
	r.close(s.f, want, 1.5e-2,
		`eps/D = ${relRough}: f -> [-2 log10(eps/3.7D)]^-2 = ${want.toFixed(5)} at Re = 1e8`);
}

for (const re of [1e4, 3e4, 1e5]) {
	// Blasius, f = 0.316 Re^-0.25, smooth pipe, 4e3 < Re < 1e5. It and Colebrook differ by up
	// to 2.5% over this band on their own account, so 4% is the honest bound for a THIRD
	// correlation being compared to it.
	const s = at(re, 1e-7);
	const want = 0.316 * Math.pow(re, -0.25);
	r.close(s.f, want, 4e-2, `smooth pipe, Re = ${re.toExponential(0)}: Blasius f = ${want.toFixed(5)}`);
}

// ---- 3. transitional: the Dunlop cubic must join the regimes it sits between ---------------
r.section('transitional regime: Dunlop cubic joins the regimes either side, in value and slope');

// The f cell prints to 4 decimals, which is far too coarse to say anything about a SLOPE. So
// this section reads f back out of S_f instead, in percent grade, where five significant
// figures survive -- and to make S_f itself large enough to print, it runs the pipe on a fluid
// a thousand times more viscous than water. Kinematic viscosity is a plain input on this page,
// so that is a legitimate thing to ask it, and f depends on nothing but Re and eps/D anyway:
// at Re = 2000 water gives V = 0.0067 m/s and S_f = 2.4e-7, while nu = 1e-3 m^2/s (a heavy oil)
// gives V = 6.7 m/s and S_f = 0.24. Same Re, same f, five more digits of it.
const NU_VISCOUS = 1e-3;

function fPrecise(re, relRough) {
	const q = re * NU_VISCOUS * Math.PI * D / 4;
	const u = q / AREA;
	page.units('si').unit('sf', 'gradePercent').set({
		q: q * 1000, d: D_MM, l: 100, e: relRough * D_MM, v: NU_VISCOUS,
		km: 0, z_up: 100, p_up: 0, z_down: 100
	}).run();
	return (page.num('sf') / 100) * 2 * D * G / (u * u);
}

for (const relRough of [1e-4, 1e-3, 1e-2]) {
	// VALUE at the lower join. The page switches branch at exactly Re = 2000, so Re = 2000.1 is
	// the transitional cubic evaluated a whisker inside its own domain, and it must land on the
	// laminar value 64/2000 = 0.032. Summing the cubic by hand at r = 1 gives exactly that,
	// with every fa and fb term cancelling, so this is a joint check on all four x-coefficients.
	r.close(fPrecise(2000.1, relRough), 0.032, 1e-4,
		`eps/D = ${relRough}: f(2000+) = 64/2000 = 0.032`);

	// SLOPE at the lower join, which is the other half of what the interpolation exists to do
	// and the half a value-only check cannot see. df/dRe on the laminar side is -64/Re^2.
	// A one-sided difference over 5 units of Re; 3% covers the cubic's own curvature over that
	// window, and is nowhere near loose enough to accept a discontinuous slope.
	const slopeLo = (fPrecise(2006, relRough) - fPrecise(2001, relRough)) / 5;
	r.close(slopeLo, -64 / Math.pow(2003.5, 2), 3e-2,
		`eps/D = ${relRough}: df/dRe at Re = 2000+ matches the laminar tangent -64/Re^2`);

	// VALUE at the upper join. At r = 2 the cubic collapses to fa, which is Swamee-Jain
	// evaluated at Re = 4000 written with a natural logarithm -- 0.86859 * ln(10) = 2.0000 makes
	// (-0.86859 ln X)^-2 and 0.25/log10(X)^2 the same number. So the two branches either side of
	// Re = 4000 must agree to many more digits than a merely "continuous" join would give.
	const belowHi = fPrecise(3999.9, relRough), aboveHi = fPrecise(4000.1, relRough);
	r.close(belowHi, aboveHi, 1e-4,
		`eps/D = ${relRough}: f is continuous across Re = 4000 (transitional -> Swamee-Jain)`);

	// SLOPE at the upper join. Both sides by the same one-sided difference over 5 units of Re so
	// the truncation error is comparable; 10% is what a first-order difference on a curve of
	// this curvature can resolve, and a slope discontinuity here is a factor-of-several effect.
	const dLo = (fPrecise(3999, relRough) - fPrecise(3994, relRough)) / 5;
	const dHi = (fPrecise(4006, relRough) - fPrecise(4001, relRough)) / 5;
	r.close(dLo, dHi, 1e-1,
		`eps/D = ${relRough}: df/dRe is continuous across Re = 4000 too`);
}

// The shape between the joins is NOT monotone and must not be asserted to be: matching the
// steep negative laminar slope at Re = 2000 forces the cubic to dip below 0.032 -- to about
// 0.029 -- before climbing to the turbulent value near 0.041. That dip is the interpolation
// working, not a defect. What can be asserted is that it stays inside a physically sane band.
const band = [];
for (let re = 2000; re <= 4000; re += 50) { band.push(fPrecise(re, 1e-3)); }
const bandMin = Math.min(...band), bandMax = Math.max(...band);
r.ok(bandMin > 0.028 && bandMax < 0.043,
	'f stays between the laminar and turbulent values it is interpolating (no runaway)',
	`${bandMin.toFixed(4)} to ${bandMax.toFixed(4)}`);
r.ok(/Dunlop|EPANET|Moody/.test(at(3000, 1e-3).method),
	'and the page names the interpolation it used', at(3000, 1e-3).method);

// ---- 4. the Darcy-Weisbach equation, given f ----------------------------------------------
// This half is independent of the friction factor: whatever f the page decided on, the head
// loss it reports must be f (L/D) V^2/(2g). Working in SI, with L = 100 m, D = 0.3 m.
r.section('the equation itself: h_f = f (L/D) V^2/2g');

// Operating points chosen so the printed results are of order one: every result cell on this
// page prints to 4 decimals, so a head of 0.0057 m carries only two significant figures and no
// assertion finer than 1% could be made about it. At these Re the quantisation is under 0.05%.
for (const re of [5e5, 2e6]) {
	const s = at(re, 1e-3);
	const u = s.u;
	const hv = u * u / (2 * G);
	// S_f prints to 4 decimals like everything else, and a slope of 0.0096 in the 'grade' unit
	// therefore carries only two significant figures. Selecting percent grade moves the decimal
	// point two places and buys back the precision this section needs.
	page.unit('sf', 'gradePercent').set({ km: 2.5 }).run();
	const sf = page.num('sf') / 100;              // percent grade back to m/m
	const fPrinted = page.num('f');

	r.close(page.si('a'), AREA, 3e-4, `Re = ${re.toExponential(0)}: A = pi D^2/4 = ${AREA.toFixed(6)} m^2`);
	r.close(page.si('pw'), Math.PI * D, 1e-4, 'Pw = pi D');
	r.close(page.si('rh'), D / 4, 1e-4, 'R = D/4 for a full circular pipe');
	r.close(page.si('u'), u, 1e-3, `V = Q/A = ${u.toFixed(4)} m/s`);
	r.close(page.si('hv'), hv, 1e-3, `velocity head = V^2/2g = ${hv.toFixed(6)} m`);

	// The Darcy-Weisbach equation, read backwards: whatever f the page chose, S_f must be
	// f V^2/(2 g D). Recovering f from S_f and comparing it with the f the page PRINTED closes
	// the loop without either side borrowing the other's rounding -- and the tolerance is set by
	// the printed f's own last digit (5e-5 absolute), not chosen.
	const fFromSf = sf * 2 * D * G / (u * u);
	r.close(fFromSf, fPrinted, 5e-5 / fPrinted, 'S_f = f V^2/(2 g D), with f as the page printed it');
	r.close(page.si('hf'), sf * 100, 1e-3, 'h_f = S_f L over L = 100 m');
	r.close(page.si('hm'), 2.5 * hv, 2e-3, 'h_m = k_m V^2/2g with k_m = 2.5');
	r.close(page.si('hl'), page.si('hf') + page.si('hm'), 2e-3, 'h_L = h_f + h_m');
	// tau prints in N/m^2 and the page carries it internally as R S_f in metres of water, so the
	// displayed number is gamma R S_f with gamma = rho g = 9806.65 N/m^3.
	r.close(page.num('tau'), 1000 * G * (D / 4) * sf, 1e-3, 'boundary shear tau = gamma R S_f');

	// h_m is the only term k_m touches, and it must be strictly proportional to it.
	page.set({ km: 5 }).run();
	r.close(page.si('hm'), 2 * (2.5 * hv), 2e-3, 'doubling k_m doubles the minor loss and nothing else');
	r.close(page.si('hf'), sf * 100, 1e-3, 'and leaves the friction loss alone');
}

r.section('EGL/HGL bookkeeping');
// Solved downstream from the known upstream end (Task 168). Velocity head is the same at both
// ends -- one diameter, one flow -- so it must cancel out of the downstream pressure entirely,
// leaving p_down = z_up + p_up - h_L - z_down. Everything here is in metres of water.
page.units('si').set({
	q: 100, d: 300, l: 500, e: 0.3, v: NU, km: 3,
	z_up: 100, p_up: 40, z_down: 88
}).unit('p_up', 'mh2o').unit('p_down', 'mh2o').run();

const hL = page.si('hl');
r.close(page.si('hgl_up'), 140, 1e-4, 'HGL_up = z_up + p_up = 140 m');
r.close(page.si('egl_up'), 140 + page.si('hv'), 1e-3, 'EGL_up = HGL_up + velocity head');
r.close(page.si('egl_down'), page.si('egl_up') - hL, 1e-3, 'EGL_down = EGL_up - h_L');
r.close(page.si('hgl_down'), page.si('egl_down') - page.si('hv'), 1e-3, 'HGL_down = EGL_down - hv');
r.close(page.si('p_down'), 140 - hL - 88, 2e-3,
	'p_down = z_up + p_up - h_L - z_down, with the velocity head cancelled');
r.ok(page.si('p_down') > 0 && /✓/.test(page.html('p_check')),
	'a positive downstream pressure is reported as positive', page.html('p_check'));

// And the negative case, which is the one that means the answer is not valid at all.
page.set({ z_down: 200 }).run();
r.ok(page.si('p_down') < 0 && /⚠/.test(page.html('p_check')),
	'an uphill run that cannot deliver is flagged, not printed as if it were fine',
	page.html('p_check'));

// ---- 5. the page's own defaults ------------------------------------------------------------
r.section('factory defaults open on a passing design');

for (const [preset, lang] of [['us', 'en'], ['si', 'es']]) {
	const fresh = loadCalculator('Darcy-Weisbach.php', { lang: lang });
	fresh.run();
	const u = fresh.si('u');
	const b = fresh.EngCalcs.VELOCITY_OK;
	r.ok(u >= b.min && u <= b.max, `${preset}: default velocity ${u.toFixed(3)} m/s is inside the OK band`,
		`band ${b.min}-${b.max} m/s`);
	r.ok(/✓/.test(fresh.html('vel_check')) && !/⚠/.test(fresh.html('vel_check')),
		`${preset}: the velocity check greets a first-time visitor with a tick`, fresh.html('vel_check'));
	// The defaults must also be turbulent -- a default pipe in the laminar or transitional band
	// would be showing a first-time visitor a regime almost no water main is ever in.
	r.ok(fresh.num('re') > 4000, `${preset}: the default pipe is turbulent`, `Re = ${fresh.num('re')}`);
	const f = fresh.num('f');
	const want = colebrook(fresh.EngCalcs.var.e / fresh.EngCalcs.var.d, fresh.num('re'));
	r.close(f, want, SJ_TOL, `${preset}: the default f agrees with Colebrook-White`);
}

r.finish();
