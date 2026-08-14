// Behavioural test of Manning Pipe Flow -- the first one this calculator has ever had.
//
//   node dev/calc-spike/mpf-harness.js
//
// ROADMAP Task 292. Until this file, nothing anywhere confirmed that Manning-Pipe-Flow.php still
// computes Manning pipe flow: `check_all.sh` verified that the page parsed, balanced its tags,
// resolved its language keys and supplied its pageConfig, and said nothing whatever about the
// number in the Q cell.
//
// WHAT IT CHECKS AGAINST, and why that is not circular. Three independent anchors, in order of
// how much they would catch:
//
//   1. THE PUBLISHED HYDRAULIC-ELEMENTS TABLE for a circular section flowing part full at
//      constant n -- the table reprinted in every drainage manual and sewer-design text (ASCE/WEF
//      MOP FD-5, HDS-5, Chow). It fixes A/A_full, R/R_full and Q/Q_full at given y/D, and it is
//      the strongest anchor available because it is DIMENSIONLESS: it depends on the geometry and
//      the Manning exponent alone, so no unit, no roughness and no slope can launder an error
//      past it. The landmarks used below:
//
//          y/D     A/A0      R/R0      Q/Q0
//          0.50    0.5000    1.0000    0.5000     <- the classic identity: half full carries half
//          0.80    0.8576    1.2168    0.9775        the full-bore flow at the full-bore velocity
//          0.90    0.9480    1.1921    1.0658
//          0.938   0.9743    1.1601    1.0757     <- the maximum; this is why the page's own
//                                                    solver refuses a target Q above it
//
//   2. ONE ABSOLUTE WORKED EXAMPLE in real units -- an 18 in pipe, n = 0.013, S = 0.005, half
//      full -- computed from the Manning equation by hand. The ratio table above cannot see a
//      wrong 1/n, a wrong slope exponent or a botched unit factor, because they cancel; this
//      catches all three.
//
//   3. THE PAGE'S OWN DEFAULTS OPENING ON A PASSING DESIGN, in BOTH unit presets. CLAUDE.md
//      requires it ("a page that greets a first-time visitor with a warning is worse than one
//      that greets them with a worked example") and says to verify it by running the page's own
//      pageCalculator against its rendered HTML rather than by inspection -- which is exactly
//      what this harness can now do and nothing could before.
//
// The form, the defaults and the unit factors are all read out of the rendered page (see
// dev/calc-spike/calc-page.js); nothing about the calculator is restated here except the physics.

const { loadCalculator, makeReporter } = require('./calc-page.js');

const r = makeReporter('Manning Pipe Flow (mpf_)');
const page = loadCalculator('Manning-Pipe-Flow.php');

// A tight tolerance is affordable: the page prints 4 decimals and the anchors are exact.
const TIGHT = 2e-4;   // absolute worked example, against hand arithmetic
const TABLE = 5e-4;   // published table values, quoted to 4 decimals

// ---- 1. the published hydraulic-elements table -------------------------------------------
// Run in SI so the numbers below are the raw ratios; the section is dimensionless anyway.
r.section('hydraulic elements (published table, constant n)');

function atDepth(ratio) {
	page.units('si').set({ d0: 450, n: 0.013, sf: 0.005, dd0: ratio }).run();
	return {
		aa0: page.num('aa0'),
		qq0: page.num('qq0'),
		rh: page.si('rh'),
		v: page.si('v'),
		q: page.si('q'),
		q0: page.si('q0')
	};
}

const half = atDepth(0.5);
r.close(half.aa0, 0.5000, TABLE, 'y/D=0.50  A/A0 = 0.5000');
r.close(half.qq0, 0.5000, TABLE, 'y/D=0.50  Q/Q0 = 0.5000  (half full carries half the flow)');
r.close(half.rh, 0.450 / 4, TIGHT, 'y/D=0.50  R = D/4, the same as full bore');

const eight = atDepth(0.8);
r.close(eight.aa0, 0.8576, TABLE, 'y/D=0.80  A/A0 = 0.8576');
r.close(eight.qq0, 0.9775, TABLE, 'y/D=0.80  Q/Q0 = 0.9775');
r.close(eight.rh / (0.450 / 4), 1.2168, TABLE, 'y/D=0.80  R/R0 = 1.2168');

const nine = atDepth(0.9);
r.close(nine.aa0, 0.9480, TABLE, 'y/D=0.90  A/A0 = 0.9480');
r.close(nine.qq0, 1.0658, TABLE, 'y/D=0.90  Q/Q0 = 1.0658  (part full beats full bore)');

const peak = atDepth(0.938);
r.close(peak.qq0, 1.0757, TABLE, 'y/D=0.938 Q/Q0 = 1.0757, the maximum');

// The maximum is a maximum: nothing either side of it may carry more. This is the property the
// page's solver depends on when it refuses a target Q, and a sign error in the geometry would
// keep the table values right at each point while moving the peak.
let best = 0, bestAt = 0;
for (let i = 1; i <= 199; i++) {
	const ratio = i / 200;
	const qq0 = atDepth(ratio).qq0;
	if (qq0 > best) { best = qq0; bestAt = ratio; }
}
r.ok(Math.abs(bestAt - 0.938) < 0.01, 'Q peaks at y/D = 0.938', `peak found at y/D = ${bestAt}`);
r.ok(best <= 1.0758, 'no depth carries more than Q/Q0 = 1.0757', `max seen ${best.toFixed(4)}`);

// ---- 2. the absolute worked example ------------------------------------------------------
// 18 in pipe, n = 0.013, S = 0.005, flowing half full. By hand, in SI:
//   D  = 18/39.37       = 0.457201 m        (the page's own inch factor, so this is a pure
//   R  = D/4            = 0.114300 m         check of the hydraulics, not of the unit table)
//   A  = pi D^2 / 8     = 0.082087 m^2
//   V  = R^(2/3) S^(1/2) / n = 1.281071 m/s
//   Q  = V A            = 0.105159 m^3/s
//   hv = V^2 / 2g       = 0.083680 m         (g = 9.806, EngCalcs.G)
//   tau= R S            = 5.7150e-4 m of water = 0.1171 psf = gamma R S with gamma = 62.4 pcf
//   F  = V sqrt(T / (g A cos(atan S))) = 0.9655, subcritical -- just
r.section('worked example: 18 in, n=0.013, S=0.005, half full (US preset)');

page.units('us').set({ d0: 18, n: 0.013, sf: 0.005, dd0: 0.5 }).run();

r.close(page.num('y'), 9.0, TIGHT, 'depth y = 9.0000 in');
r.close(page.num('a'), 0.8836, TIGHT, 'flow area A = 0.8836 ft^2');
r.close(page.num('a0'), 1.7672, TIGHT, 'full area A0 = 1.7672 ft^2');
r.close(page.num('pw'), 28.2743, TIGHT, 'wetted perimeter Pw = 28.2743 in (half the circumference)');
r.close(page.num('rh'), 4.5000, TIGHT, 'hydraulic radius R = 4.5000 in = D/4');
r.close(page.num('t'), 18.0000, TIGHT, 'top width T = 18.0000 in = D at the springline');
r.close(page.num('v'), 4.2029, TIGHT, 'velocity V = 4.2029 ft/s');
r.close(page.num('hv'), 0.2745, TIGHT, 'velocity head = 0.2745 ft');
r.close(page.num('q'), 3.7135, TIGHT, 'flow Q = 3.7135 cfs');
r.close(page.num('q0'), 7.4270, TIGHT, 'full-bore Q0 = 7.4270 cfs = 2 x Q');
r.close(page.num('f'), 0.97, 2e-2, 'Froude number = 0.97, subcritical');
r.close(page.num('tau'), 0.1171, 1e-3, 'boundary shear = 0.1171 psf = 62.4 x 0.375 x 0.005');

// The same physics through the other preset must be the same physics. This is the check that
// would have caught a unit family declared on one field and not its neighbour.
r.section('unit presets describe one pipe, not two');
const usQ = page.si('q'), usV = page.si('v');
page.units('si').set({ d0: 18 * 25.4, n: 0.013, sf: 0.005, dd0: 0.5 }).run();
// Tolerance is set by the page's OWN display precision, not by the arithmetic: results print at
// 4 decimals, so a Q of 0.1052 m^3/s is quantised to about 4 parts in 10,000.
r.close(page.si('q'), usQ, 1e-3, 'Q in SI matches Q in US for the same pipe');
r.close(page.si('v'), usV, 1e-3, 'V in SI matches V in US for the same pipe');

// ---- 3. the page's own defaults --------------------------------------------------------
r.section('factory defaults open on a passing design');

// 'en' renders the us defaults, any other language renders the si ones -- and the numbers
// themselves differ (18 in vs 450 mm), so the only honest way to test the si defaults is to
// render the page the way a Spanish-speaking visitor gets it.
for (const [preset, lang] of [['us', 'en'], ['si', 'es']]) {
	const fresh = loadCalculator('Manning-Pipe-Flow.php', { lang: lang });
	fresh.run();
	const v = fresh.si('v');
	const band = fresh.EngCalcs.VELOCITY_OK;
	r.ok(v >= band.min && v <= band.max,
		`${preset}: default velocity ${v.toFixed(3)} m/s is inside the OK band`,
		`band ${band.min}-${band.max} m/s`);
	r.ok(/✓/.test(fresh.html('vel_check')) && !/⚠/.test(fresh.html('vel_check')),
		`${preset}: the velocity check greets a first-time visitor with a tick`,
		fresh.html('vel_check'));
	r.ok(fresh.num('q') > 0 && isFinite(fresh.num('q')),
		`${preset}: the default Q is a real positive number`, `Q = ${fresh.num('q')}`);
}

// The two presets are supposed to describe the SAME default pipe -- 18 in and 450 mm are within
// 1.6% of each other on purpose (CLAUDE.md: a page's default number is in the DISPLAYED unit, and
// a scalar default is correct only for a dimensionless field). A scalar left on a unit-bearing
// field is silent and this is what it looks like.
const us = loadCalculator('Manning-Pipe-Flow.php', { lang: 'en' });
const si = loadCalculator('Manning-Pipe-Flow.php', { lang: 'es' });
us.run(); si.run();
const ratio = si.si('q') / us.si('q');
r.ok(ratio > 0.9 && ratio < 1.1,
	'the us and si defaults describe the same pipe (Q within 10%)',
	`si/us = ${ratio.toFixed(4)}`);

// ---- the depth solver ---------------------------------------------------------------------
// EngCalcs.solveForDd0 reads the page's solver box, bisects, writes y/d0 back into the form and
// recalculates. It is the one part of this page a user drives with a button, and it is exactly
// the kind of thing that used to need a browser.
r.section('solve-for-depth button');

const solver = loadCalculator('Manning-Pipe-Flow.php').units('us');
solver.set({ d0: 18, n: 0.013, sf: 0.005, dd0: 0.5, solver_q: 3.7135 }).run();
solver.EngCalcs.solveForDd0();
r.close(parseFloat(solver.input('dd0')), 0.5, 1e-3, 'solving for Q = 3.7135 cfs returns y/D = 0.5');
r.close(solver.num('q'), 3.7135, 1e-3, 'and the page then displays that Q');

solver.set({ solver_q: 99 }).run();
// textContent, not innerHTML: solveForDd0 writes its status with textContent, and reading the
// wrong property returns '' -- which would let this assertion pass whatever the solver did.
const beforeDd0 = solver.input('dd0');
solver.EngCalcs.solveForDd0();
r.ok(solver.text('solver_msg').length > 0,
	'a target Q above pipe capacity is refused with a message',
	JSON.stringify(solver.text('solver_msg')));
r.eq(solver.input('dd0'), beforeDd0, 'and the depth is left alone rather than given a wrong answer');

r.finish();
