// Behavioural test of Hazen-Williams -- and of the suite having exactly ONE constant pair.
//
//   node dev/calc-spike/hw-harness.js
//
// ROADMAP Task 292. Two different things are at risk on this page and they need different
// anchors.
//
// A. IS THE ARITHMETIC RIGHT? The reference is EPANET's own Hazen-Williams head-loss formula,
//    which in US units (Q in cfs, L and d in ft, h in ft) is
//
//        h = 4.727 L Q^1.852 / (C^1.852 d^4.871)
//
//    That equation is stated in js/PipeHydraulics.lib.js as the definition the suite works
//    from, and it is EPANET's published form -- the engine users check us against, and the one
//    js/lpn-epanet.js is measured against elsewhere in this repo (see its comment at line 278,
//    where our solver agrees with the 4.727 equation to 6.7e-16). This harness computes that
//    right-hand side in US units, from scratch, with nothing borrowed from the suite but the
//    exact foot (0.3048 m), and compares it with the head loss the page prints. Nothing in the comparison passes through EngCalcs.hwCoef, so a slip in the
//    metric derivation of that constant shows up here as a disagreement rather than cancelling.
//
//    The EXPONENTS get their own tests, because they are dimensionless and therefore cannot be
//    laundered by any unit factor or coefficient: doubling Q must multiply h_f by 2^1.852,
//    doubling C must divide it by 2^1.852, and doubling d must divide it by 2^4.871. A wrong
//    coefficient leaves all three intact; a wrong exponent breaks the one that names it, and
//    the two kinds of error are separated rather than confounded.
//
// B. IS THERE STILL ONLY ONE CONSTANT PAIR? CLAUDE.md makes this the defect to catch on this
//    calculator by name -- "THIS IS THE SUITE'S ONLY HAZEN-WILLIAMS PAIR -- do not reintroduce
//    a second one" -- because the common SI restatement (10.674400 with exponent 4.8704)
//    disagrees with EPANET's DIAMETER-DEPENDENTLY, by up to 0.12% over 50 mm to 2 m, so a
//    second pair would not announce itself as a constant offset anywhere. Prose has never
//    stopped anyone; the last section of this file reads js/ and fails if a Hazen-Williams
//    constant is assigned anywhere but js/PipeHydraulics.lib.js.
//
// C. and the page's factory defaults opening on a passing design, in both presets, per
//    CLAUDE.md.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

const fs = require('fs');
const path = require('path');
const { loadCalculator, makeReporter, ROOT } = require('./calc-page.js');

const r = makeReporter('Hazen-Williams (hw_)');
const page = loadCalculator('Hazen-Williams.php');
const G = page.EngCalcs.G;

// The only two conversions this file needs, both exact by definition and both written out here
// rather than read from the suite -- the point is to arrive at EPANET's equation from outside.
const FT = 0.3048;                    // m, exact
const CFS = FT * FT * FT;             // m^3/s per cfs

/** EPANET's Hazen-Williams head loss, in feet. q cfs, l ft, d ft. */
function epanetHeadLossFt(qCfs, lFt, dFt, c) {
	return 4.727 * lFt * Math.pow(qCfs, 1.852) / (Math.pow(c, 1.852) * Math.pow(dFt, 4.871));
}

/**
 * Drives the page in US units and returns what it printed. Everything is set in the display
 * units the page is showing, exactly as a user would type them.
 */
function runUS(qCfs, lFt, dFt, c, km) {
	page.units('us')
		.unit('q', 'ft3ps').unit('d', 'ft').unit('l', 'ft')
		.unit('hf', 'fth2o').unit('hm', 'fth2o').unit('hl', 'fth2o').unit('p_down', 'fth2o')
		.unit('p_up', 'fth2o').unit('sf', 'gradePercent')
		.set({ q: qCfs, d: dFt, l: lFt, c: c, km: km === undefined ? 0 : km,
			z_up: 0, p_up: 0, z_down: 0 })
		.run();
	return {
		hf: page.num('hf'),              // ft of water
		hm: page.num('hm'),
		hl: page.num('hl'),
		sf: page.num('sf') / 100,        // percent grade back to ft/ft (dimensionless either way)
		v: page.num('v'),                // ft/s
		a: page.num('a')                 // ft^2
	};
}

// ---- A1. the absolute anchor: EPANET's 4.727 equation, in US units ------------------------
r.section("EPANET's h = 4.727 L Q^1.852 / (C^1.852 d^4.871), computed independently");

// 0.01%. The page prints h_f to 4 decimals, so a 30 ft head loss is quantised to about 1e-7,
// and the only other error is the round trip through the suite's metric internals (ft -> m ->
// ft), good to about 1e-15. Nothing physical is being approximated on either side of this
// comparison, so the bound is a printing bound and not an engineering one -- it is tight enough
// to fail a 4.727 mistyped as 4.73.
const EPANET_TOL = 1e-4;

const cases = [
	// q cfs,  L ft,   d ft,   C
	[3.0, 1000, 0.5, 130],
	[0.5, 500, 0.3333, 100],
	[10.0, 2500, 1.0, 150],
	[25.0, 1000, 1.5, 120],
	[0.05, 100, 0.1667, 80]
];
for (const [q, l, d, c] of cases) {
	const got = runUS(q, l, d, c);
	const want = epanetHeadLossFt(q, l, d, c);
	r.close(got.hf, want, EPANET_TOL,
		`Q=${q} cfs, L=${l} ft, d=${d} ft, C=${c}: h_f = ${want.toFixed(4)} ft`);
}

// The same equation restated as a slope, which is what the page actually carries internally --
// h_f/L must be S_f, exactly, for every one of those cases.
for (const [q, l, d, c] of cases) {
	const got = runUS(q, l, d, c);
	r.close(got.sf, epanetHeadLossFt(q, l, d, c) / l, 2e-3,
		`Q=${q} cfs, d=${d} ft: S_f = h_f/L = ${(epanetHeadLossFt(q, l, d, c) / l).toExponential(4)}`);
}

// And in SI, entered as a user in a metric country would enter it: the SAME pipe must give the
// SAME head loss. This is the check that a unit factor cannot hide behind -- both sides go
// through the suite, but through different factors.
r.section('the same pipe entered in SI gives the same head loss');
for (const [q, l, d, c] of cases) {
	page.units('si')
		.unit('q', 'lps').unit('d', 'mm').unit('l', 'm')
		.unit('hf', 'mh2o').unit('p_up', 'mh2o')
		.set({ q: q * CFS * 1000, d: d * FT * 1000, l: l * FT, c: c, km: 0,
			z_up: 0, p_up: 0, z_down: 0 })
		.run();
	const wantM = epanetHeadLossFt(q, l, d, c) * FT;
	r.close(page.num('hf'), wantM, 1e-3,
		`Q=${(q * CFS * 1000).toFixed(3)} L/s, d=${(d * FT * 1000).toFixed(1)} mm: h_f = ${wantM.toFixed(4)} m`);
}

// ---- A2. the exponents, which no unit factor can launder ----------------------------------
r.section('exponents: 1.852 on Q, 1.852 on C, 4.871 on d');

// These are pure ratios of two runs of the page against itself, so both the coefficient and the
// whole unit chain cancel out and what is left is the exponent alone. Tolerance is set by the
// printed precision of the two head losses, not by anything physical.
const base = runUS(3.0, 1000, 0.5, 130);

r.close(runUS(6.0, 1000, 0.5, 130).hf / base.hf, Math.pow(2, 1.852), 1e-3,
	'doubling Q multiplies h_f by 2^1.852 = ' + Math.pow(2, 1.852).toFixed(4));
r.close(base.hf / runUS(3.0, 1000, 0.5, 260).hf, Math.pow(2, 1.852), 1e-3,
	'doubling C divides h_f by 2^1.852');
r.close(base.hf / runUS(3.0, 1000, 1.0, 130).hf, Math.pow(2, 4.871), 1e-3,
	'doubling d divides h_f by 2^4.871 = ' + Math.pow(2, 4.871).toFixed(2));
r.close(runUS(3.0, 3000, 0.5, 130).hf / base.hf, 3, 1e-3,
	'h_f is strictly proportional to L (exponent 1, and no hidden entrance term)');

// ---- A3. the rest of the page: geometry, minor loss, EGL/HGL ------------------------------
r.section('geometry, minor loss and the energy line');

const dFt = 0.5, qCfs = 3.0;
const withK = runUS(qCfs, 1000, dFt, 130, 2.5);
const areaFt2 = Math.PI * dFt * dFt / 4;
const vFps = qCfs / areaFt2;
const hvFt = (vFps * FT) * (vFps * FT) / (2 * G) / FT;    // V^2/2g, computed in SI, reported in ft

r.close(withK.a, areaFt2, 1e-3, `A = pi d^2/4 = ${areaFt2.toFixed(4)} ft^2`);
r.close(page.num('pw'), Math.PI * dFt * 12, 1e-3, 'Pw = pi d (printed in inches)');
r.close(page.num('rh'), dFt * 12 / 4, 1e-3, 'R = d/4 for a full circular pipe');
r.close(withK.v, vFps, 1e-3, `V = Q/A = ${vFps.toFixed(4)} ft/s`);
r.close(page.num('hv'), hvFt, 2e-3, `velocity head = V^2/2g = ${hvFt.toFixed(4)} ft`);
r.close(withK.hm, 2.5 * hvFt, 2e-3, 'h_m = k_m V^2/2g');
r.close(withK.hl, withK.hf + withK.hm, 1e-3, 'h_L = h_f + h_m');
r.close(withK.hf, base.hf, 1e-3, 'and a minor loss does not disturb the friction loss');
// tau prints in psf and is carried internally as R S_f in metres of water; the displayed number
// is therefore gamma R S_f with gamma = rho g.
r.close(page.si('tau'), (dFt * FT / 4) * withK.sf, 3e-3, 'boundary shear tau = gamma R S_f');

r.section('EGL/HGL bookkeeping');
// Solved downstream from the known upstream end (Task 167). One diameter and one flow means the
// velocity head is identical at both ends, so it must cancel out of p_down entirely.
page.units('si').unit('p_up', 'mh2o').unit('p_down', 'mh2o').unit('hl', 'mh2o')
	.set({ q: 100, d: 300, l: 500, c: 130, km: 3, z_up: 100, p_up: 40, z_down: 88 }).run();
const hL = page.si('hl');
r.close(page.si('hgl_up'), 140, 1e-4, 'HGL_up = z_up + p_up = 140 m');
r.close(page.si('egl_up'), 140 + page.si('hv'), 1e-3, 'EGL_up = HGL_up + velocity head');
r.close(page.si('egl_down'), page.si('egl_up') - hL, 1e-3, 'EGL_down = EGL_up - h_L');
r.close(page.si('hgl_down'), page.si('egl_down') - page.si('hv'), 1e-3, 'HGL_down = EGL_down - hv');
r.close(page.si('p_down'), 140 - hL - 88, 2e-3,
	'p_down = z_up + p_up - h_L - z_down, with the velocity head cancelled');
r.ok(page.si('p_down') > 0 && /✓/.test(page.html('p_check')),
	'a positive downstream pressure is reported as positive', page.html('p_check'));
page.set({ z_down: 300 }).run();
r.ok(page.si('p_down') < 0 && /⚠/.test(page.html('p_check')),
	'and a run that cannot deliver is flagged rather than printed as if it were fine',
	page.html('p_check'));

// A degenerate input must not poison the page: hwSlope returns 0 rather than Infinity/NaN for a
// missing C or diameter, which is what keeps a half-filled row from taking a whole solve down.
r.section('degenerate inputs return 0, not NaN');
page.set({ c: 0 }).run();
r.eq(page.si('sf'), 0, 'C = 0 gives S_f = 0, not Infinity');
page.set({ c: 130, d: 0 }).run();
r.eq(page.si('hf'), 0, 'd = 0 gives h_f = 0, not NaN');

// ---- B. exactly one Hazen-Williams constant pair in the whole suite ------------------------
r.section('the suite still has exactly ONE Hazen-Williams constant pair');

// The rule this enforces is CLAUDE.md's, and it is enforced here rather than by reading the
// file because a second pair is invisible in use: 10.674400/4.8704 and EPANET's 4.727/4.871
// differ diameter-dependently by at most 0.12%, so every page would still look right.
//
// A "Hazen-Williams constant" is one of the numbers that only appear in this equation. Matching
// is on CODE lines only -- js/PipeHydraulics.lib.js explains the rejected alternative in its own
// comments and lpn-epanet.js cites 4.727 in a measurement note, and neither is a second pair.
const HW_CONSTANTS = [
	/\b4\.727\b/,        // EPANET's US coefficient
	/\b10\.6[0-9]{2,}\b/, // any SI restatement of it, 10.66... or 10.67...
	/\b0\.2785\b/,       // the US flow form, Q = 0.2785 C d^2.63 S^0.54
	/\b1\.318\b/,        // the US velocity form, V = 1.318 C R^0.63 S^0.54
	/\b1\.852\b/,        // the flow exponent
	/\b4\.87[0-9]*\b/,   // the diameter exponent, 4.871 or the restated 4.8704
	/\b2\.63\b/, /\b0\.54\b/, /\b0\.63\b/
];
const OWNER = 'PipeHydraulics.lib.js';

const jsDir = path.join(ROOT, 'js');
const offenders = [];
let scanned = 0;
for (const name of fs.readdirSync(jsDir)) {
	if (!name.endsWith('.js') || name === OWNER) { continue; }
	const full = path.join(jsDir, name);
	if (!fs.statSync(full).isFile()) { continue; }
	scanned++;
	const lines = fs.readFileSync(full, 'utf8').split('\n');
	lines.forEach((line, i) => {
		const code = line.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
		if (!/\S/.test(code)) { return; }
		for (const re of HW_CONSTANTS) {
			if (re.test(code)) { offenders.push(`${name}:${i + 1}: ${line.trim()}`); return; }
		}
	});
}
r.ok(scanned > 5, 'the scan actually read the js directory', `${scanned} files scanned`);
r.ok(offenders.length === 0,
	`no Hazen-Williams constant is written outside js/${OWNER}`,
	offenders.length ? '\n      ' + offenders.join('\n      ') : '');

// And the owner's own pair is still EPANET's, derived rather than typed.
const HW = page.EngCalcs;
r.close(HW.hwCoef, 4.727 * Math.pow(FT, 4.871) / Math.pow(CFS, 1.852), 1e-12,
	'hwCoef is 4.727 converted to SI (10.666829...)', `got ${HW.hwCoef}`);
r.eq(HW.hwDiaExp, 4.871, 'hwDiaExp is EPANET\'s 4.871, not the restated 4.8704');
r.eq(HW.hwExp, 1.852, 'hwExp is 1.852');
// The rejected alternative, measured: if a second pair had been introduced it would be wrong by
// a diameter-dependent amount rather than by a constant, which is exactly why prose was not
// enough. This asserts the disagreement is real and in the range CLAUDE.md quotes.
const spread = [0.05, 0.15, 0.5, 1.0, 2.0].map(d => {
	const ours = HW.hwSlope(0.1, d, 130);
	const other = 10.674400 * Math.pow(0.1, 1.852) / (Math.pow(130, 1.852) * Math.pow(d, 4.8704));
	return (other - ours) / ours;
});
r.ok(Math.max(...spread) - Math.min(...spread) > 1e-4,
	'the restated pair disagrees diameter-dependently, not by a constant offset',
	`${(Math.min(...spread) * 100).toFixed(3)}% at 50 mm to ${(Math.max(...spread) * 100).toFixed(3)}% at 2 m`);

// The page must reach the kernel, not carry its own copy: every S_f it prints has to be the one
// EngCalcs.hwSlope returns for the same three numbers.
r.section('the page computes S_f through EngCalcs.hwSlope and not a local copy');
for (const [q, l, d, c] of cases) {
	const got = runUS(q, l, d, c);
	r.close(got.sf, HW.hwSlope(q * CFS, d * FT, c), 2e-3,
		`Q=${q} cfs, d=${d} ft, C=${c}: S_f matches the shared kernel`);
}

// ---- C. the page's own defaults ------------------------------------------------------------
r.section('factory defaults open on a passing design');
for (const [preset, lang] of [['us', 'en'], ['si', 'es']]) {
	const fresh = loadCalculator('Hazen-Williams.php', { lang: lang });
	fresh.run();
	const v = fresh.si('v');
	const b = fresh.EngCalcs.VELOCITY_OK;
	r.ok(v >= b.min && v <= b.max, `${preset}: default velocity ${v.toFixed(3)} m/s is inside the OK band`,
		`band ${b.min}-${b.max} m/s`);
	r.ok(/✓/.test(fresh.html('vel_check')) && !/⚠/.test(fresh.html('vel_check')),
		`${preset}: the velocity check greets a first-time visitor with a tick`, fresh.html('vel_check'));
	r.ok(fresh.si('hf') > 0 && isFinite(fresh.si('hf')),
		`${preset}: the default h_f is a real positive number`, `h_f = ${fresh.num('hf')}`);
}

r.finish();
