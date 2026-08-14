// Behavioural test of Manning Trapezoidal Channel -- the first one this calculator has ever had.
//
//   node dev/calc-spike/mtc-harness.js
//
// ROADMAP Task 292. mtc_ is one of the two CORE calculators (with mpf_) that carry the Task 203
// coverage cross, so a defect here is worth more than a defect anywhere else in the suite.
//
// It is also the harder of the two to test, and worth saying why: mpf_ evaluates a closed form,
// while mtc_ runs an ITERATION (`EngCalcs.Manning.mtc_iterate`) in which the roughness and the
// rock size chase each other -- pick "Strickler" and n depends on d50; pick "Isbash" as well and
// d50 depends on the velocity that n just produced. A converging loop is exactly the kind of code
// that fails quietly: it still returns a number, and the number is merely wrong.
//
// So the checks come in four kinds, weakest first:
//
//   1. GEOMETRY IDENTITIES, which are exact. A trapezoid with zero side slopes is a rectangle;
//      A = y(b + zy), P = b + 2y sqrt(1+z^2), T = b + 2zy. No hydraulics involved, so a failure
//      here can only be the section.
//   2. MANNING'S OWN PROPORTIONALITIES, also exact: V goes as S^(1/2) and as 1/n, so quadrupling
//      the slope doubles the velocity and halving n doubles it. These catch a wrong exponent that
//      a single worked example would sail past.
//   3. ONE ABSOLUTE WORKED EXAMPLE -- the page's own default channel, 4 ft bottom, 2:1 sides,
//      2 ft deep, n = 0.025, S = 0.001 -- computed by hand and quoted in the comments below.
//   4. THE ITERATION'S OWN FIXED POINT. Rather than restate Strickler, Isbash, Blodgett and
//      Maynord here (a second copy that would drift), the converged answer is fed back into the
//      defining equation: if the page says "Strickler", the n it settled on must equal
//      d50^(1/6)/21.1 for the d50 it settled on. That tests CONVERGENCE, which is the thing the
//      formulas alone cannot check and the thing most likely to break.

const { loadCalculator, makeReporter } = require('./calc-page.js');

const r = makeReporter('Manning Trapezoidal Channel (mtc_)');
const page = loadCalculator('Manning-Trap.php');

const TIGHT = 2e-4;
const FT = 3.2808;      // the page's own foot factor, read back below rather than assumed

// ---- 1. geometry identities ----------------------------------------------------------------
r.section('cross-section geometry');

// A rectangle is a trapezoid with vertical sides. 10 m wide, 2 m deep:
//   A = 20 m^2,  P = 10 + 2(2) = 14 m,  T = 10 m,  R = 20/14 = 1.428571 m
page.units('si').set({ b: 10, y: 2, z1: 0, z2: 0, s0: 0.001, n_in: 0.025 }).run();
r.close(page.si('a'), 20, TIGHT, 'z=0 gives a rectangle: A = b y = 20 m^2');
r.close(page.si('pw'), 14, TIGHT, 'z=0: Pw = b + 2y = 14 m');
r.close(page.si('t'), 10, TIGHT, 'z=0: T = b = 10 m');
r.close(page.si('rh'), 20 / 14, TIGHT, 'z=0: R = A/Pw = 1.4286 m');

// Asymmetric side slopes, because z1 and z2 are separate inputs and swapping them is a real
// editing mistake: b = 3, y = 2, z1 = 1, z2 = 4.
//   A = 2(3 + (1+4)2/2) = 16 m^2
//   P = 3 + 2(sqrt2 + sqrt17) = 3 + 2(1.414214 + 4.123106) = 14.074639 m
//   T = 3 + 2(1+4) = 13 m
page.set({ b: 3, y: 2, z1: 1, z2: 4 }).run();
r.close(page.si('a'), 16, TIGHT, 'asymmetric sides: A = y(b + (z1+z2)y/2) = 16 m^2');
r.close(page.si('pw'), 3 + 2 * (Math.SQRT2 + Math.sqrt(17)), TIGHT, 'asymmetric sides: Pw = 14.0746 m');
r.close(page.si('t'), 13, TIGHT, 'asymmetric sides: T = b + (z1+z2)y = 13 m');

// ---- 2. Manning's proportionalities -----------------------------------------------------
r.section("Manning's exponents");

page.units('si').set({ b: 3, y: 1, z1: 2, z2: 2, s0: 0.001, n_in: 0.025 }).run();
const baseV = page.si('v'), baseQ = page.si('q');

page.set({ s0: 0.004 }).run();
r.close(page.si('v') / baseV, 2, 1e-3, 'four times the slope doubles V  (V ∝ S^1/2)');

page.set({ s0: 0.001, n_in: 0.0125 }).run();
r.close(page.si('v') / baseV, 2, 1e-3, 'half the roughness doubles V  (V ∝ 1/n)');

page.set({ n_in: 0.025 }).run();
r.close(page.si('q') / baseQ, 1, 1e-3, 'and putting the inputs back restores Q');

// A section 8x larger in every linear dimension has 8^(2/3) = 4x the hydraulic radius exponent
// effect: R scales with length, so V scales as L^(2/3) and Q = VA as L^(8/3).
page.set({ b: 3, y: 1, z1: 2, z2: 2 }).run();
const smallQ = page.si('q');
page.set({ b: 6, y: 2 }).run();
r.close(page.si('q') / smallQ, Math.pow(2, 8 / 3), 2e-3, 'doubling every length multiplies Q by 2^(8/3)');

// ---- 3. the absolute worked example -----------------------------------------------------
// The page's own default channel, in US units: b = 4 ft, z = 2:1 both sides, y = 2 ft,
// n = 0.025 (typed, no radio), S = 0.001. By hand, in SI (b = 1.219 m, y = 0.6096 m):
//   A  = y(b + (z1+z2)y/2)  = 1.486485 m^2  = 16.0005 ft^2
//   P  = b + y(2 sqrt 5)    = 3.945462 m    = 12.9443 ft
//   R  = A/P                = 0.376758 m    =  1.2361 ft
//   T  = b + (z1+z2)y       = 3.657644 m    = 12.0000 ft
//   V  = R^(2/3) S^(1/2)/n  = 0.659835 m/s  =  2.1648 ft/s
//   Q  = V A                = 0.980834 m3/s = 34.6362 cfs
//   hv = V^2/2g             = 0.022200 m    =  0.0728 ft
//   F  = 0.3305, firmly subcritical
//   tau= R S = 3.7676e-4 m of water = 0.0772 psf
r.section('worked example: the page default channel (4 ft bottom, 2:1, 2 ft deep)');

const dflt = loadCalculator('Manning-Trap.php', { lang: 'en' });
dflt.run();
r.close(dflt.num('a'), 16.0005, TIGHT, 'A = 16.0005 ft^2');
r.close(dflt.num('pw'), 12.9443, TIGHT, 'Pw = 12.9443 ft');
r.close(dflt.num('rh'), 1.2361, TIGHT, 'R = 1.2361 ft');
r.close(dflt.num('t'), 12.0000, TIGHT, 'T = 12.0000 ft');
r.close(dflt.num('v'), 2.1648, TIGHT, 'V = 2.1648 ft/s');
r.close(dflt.num('q'), 34.6362, TIGHT, 'Q = 34.6362 cfs');
r.close(dflt.num('hv'), 0.0728, 1e-2, 'velocity head = 0.0728 ft');
r.close(dflt.num('froude'), 0.33, 2e-2, 'Froude = 0.33, subcritical');
r.close(dflt.num('tau'), 0.0772, 1e-3, 'boundary shear = 0.0772 psf');

// The roughness estimators, all evaluated at the default d50 of 6 in (0.15240 m) and the
// default section. Published forms, each computed by hand:
//   Strickler  n = d50^(1/6)/21.1                                  = 0.034638
//   Blodgett   n = 0.319 da^(1/6) / (2.25 + 5.23 log10(da/d50))    = 0.061312   (da = A/T)
//   Bathurst   (Bathurst 1985, as coded in Manning.lib.js)         = 0.041305
//   P&I        n = 0.0926 R_ft^(1/6) / (1.46 + 2.23 log10(R/d50))  = 0.041056
r.close(dflt.num('n_strickler'), 0.0346, 1e-2, 'Strickler n = 0.0346');
r.close(dflt.num('n_blodgett'), 0.0613, 1e-2, 'Blodgett n = 0.0613');
r.close(dflt.num('n_bathurst'), 0.0413, 1e-2, 'Bathurst n = 0.0413');
r.close(dflt.num('n_pi'), 0.0411, 1e-2, 'P&I n = 0.0411');

// da/d50 = 0.4064/0.1524 = 2.667, which is between 1.5 and 185, so the page must name Blodgett.
r.eq(dflt.html('blodgett_v_bathurst'), 'Blodgett', 'relative submergence 2.67 selects Blodgett');

// d50 = 6 in = 0.5 ft, and the P&I relation is only calibrated over 0.28-0.36 ft, so the page
// must warn. This is a verdict string, so it is checked as one.
r.ok(/⚠/.test(dflt.html('pi_range_check')),
	'd50 = 0.5 ft is outside the P&I calibration range, and the page says so',
	dflt.html('pi_range_check'));

// ---- 4. the iteration's fixed point -------------------------------------------------------
// Nothing below restates a formula the app already contains. Each check takes the answer the
// iteration converged to and asserts it satisfies the equation that DEFINES that choice. If the
// loop stops early, oscillates, or converges on the wrong branch, these fail; if the formula
// itself is wrong they do not, which is what section 3's published numbers are for.
r.section('auto-iteration converges on its own defining equation');

const it = loadCalculator('Manning-Trap.php', { lang: 'en' });
it.radio('n_radio', 'strickler').run();
{
	const n = parseFloat(it.input('n_in'));
	const d50 = 6 / 39.37;                          // still the typed d50: no rock radio is on
	// 3e-3, not 1e-3: the write-back into the form is .toFixed(4), so an n of 0.0346377 reaches
	// the box as 0.0346 -- a 0.11% quantisation that is the page's own rounding, not an error.
	r.close(n, Math.pow(d50, 1 / 6) / 21.1, 3e-3,
		'Strickler: the n written back to the form is d50^(1/6)/21.1');
	r.close(it.num('n_strickler'), n, 1e-3, 'and it matches the Strickler column');
}

it.radio('n_radio', 'pi').run();
r.close(parseFloat(it.input('n_in')), it.num('n_pi'), 1e-3,
	'P&I: the n written back to the form is the P&I column');

it.radio('n_radio', 'bb').run();
r.close(parseFloat(it.input('n_in')), it.num('n_blodgett'), 1e-3,
	'B/B at this submergence picks the Blodgett column, matching the selector');

// Isbash sizes the rock from the velocity, and the velocity depends on n, which (with a roughness
// radio also on) depends on the rock. Both loops run together here -- the hardest case the page
// has -- and the converged rock size must still be exactly the safety factor times the largest of
// the three Isbash sizes the page reports.
it.radio('n_radio', 'strickler').radio('d50_radio', 'isbash').run();
{
	const safety = parseFloat(it.input('d50_safety'));
	const worst = Math.max(it.num('d50_bottom'), it.num('d50_z1'), it.num('d50_z2'));
	r.close(parseFloat(it.input('d50_in')), safety * worst, 2e-3,
		`Isbash: converged d50 = ${safety} x the largest of bottom/z1/z2`);
	r.close(parseFloat(it.input('n_in')), it.num('n_strickler'), 2e-3,
		'and the coupled Strickler n is still consistent with that same rock');
}

it.radio('d50_radio', 'maynord').run();
r.close(parseFloat(it.input('d50_in')),
	parseFloat(it.input('d50_safety')) * it.num('d50_mra'), 2e-3,
	'Maynord: converged d50 = safety x the Maynord column');

it.radio('d50_radio', 'searcy').run();
r.close(parseFloat(it.input('d50_in')),
	parseFloat(it.input('d50_safety')) * it.num('d50_searcy'), 2e-3,
	'Searcy: converged d50 = safety x the Searcy column');

// And with no radio on, the page must leave the typed values alone. This is the branch every
// other one falls back to, and a regression that made it iterate anyway would overwrite what the
// user typed -- the most annoying possible failure of this page.
const typed = loadCalculator('Manning-Trap.php', { lang: 'en' });
typed.set({ n_in: 0.031, d50_in: 9 }).run();
r.eq(typed.input('n_in'), '0.031', 'no roughness radio: the typed n is left exactly as typed');
r.eq(typed.input('d50_in'), '9', 'no rock radio: the typed d50 is left exactly as typed');

// ---- the page's own defaults ---------------------------------------------------------------
r.section('factory defaults open on a passing design');

for (const [preset, lang] of [['us', 'en'], ['si', 'es']]) {
	const fresh = loadCalculator('Manning-Trap.php', { lang: lang });
	fresh.run();
	const v = fresh.si('v');
	const band = fresh.EngCalcs.VELOCITY_OK;
	r.ok(v >= band.min && v <= band.max,
		`${preset}: default velocity ${v.toFixed(3)} m/s is inside the OK band`,
		`band ${band.min}-${band.max} m/s`);
	r.ok(/✓/.test(fresh.html('v_check')) && !/⚠/.test(fresh.html('v_check')),
		`${preset}: the velocity check greets a first-time visitor with a tick`,
		fresh.html('v_check'));
	r.ok(fresh.num('q') > 0 && isFinite(fresh.num('q')),
		`${preset}: the default Q is a real positive number`, `Q = ${fresh.num('q')}`);
}

const usD = loadCalculator('Manning-Trap.php', { lang: 'en' });
const siD = loadCalculator('Manning-Trap.php', { lang: 'es' });
usD.run(); siD.run();
const ratio = siD.si('q') / usD.si('q');
r.ok(ratio > 0.85 && ratio < 1.15,
	'the us and si defaults describe roughly the same channel (Q within 15%)',
	`si/us = ${ratio.toFixed(4)}`);

// ---- the depth solver -----------------------------------------------------------------------
r.section('solve-for-depth button');

const solver = loadCalculator('Manning-Trap.php', { lang: 'en' });
solver.set({ solver_q: 34.6362 }).run();
solver.EngCalcs.solveForY();
r.close(parseFloat(solver.input('y')), 2.0, 1e-3, 'solving for Q = 34.6362 cfs returns y = 2 ft');
r.close(solver.num('q'), 34.6362, 1e-3, 'and the page then displays that Q');

// Unlike a circular pipe, a trapezoid has no capacity ceiling -- Q rises with y forever -- so a
// large target must be SOLVED, not refused. The two pages differ here on purpose.
solver.set({ solver_q: 5000 }).run();
solver.EngCalcs.solveForY();
r.eq(solver.text('solver_msg'), '', 'a large target Q is solved rather than refused');
r.close(solver.num('q'), 5000, 1e-3, 'and a 5000 cfs channel is found');

r.finish();
