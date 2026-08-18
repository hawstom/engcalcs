// Behavioural test of Manning Pipe Head Loss (mphl_).
//
//   node dev/calc-spike/mphl-harness.js
//
// ROADMAP Task 292. This page shares its geometry with Manning Pipe Flow -- a circular pipe
// flowing full, so A = pi D^2/4 and R = D/4 -- and mpf-harness.js already anchors that against
// the published hydraulic-elements table. What is NOT covered anywhere else, and is what this
// file is for, is the HEAD-LOSS step: turning a flow into a friction slope, and the friction
// slope into an outlet-control energy line.
//
// WHAT IT ANCHORS AGAINST
//
//   1. THE MANNING EQUATION IN BOTH ITS CUSTOMARY FORMS, which is the real content of the one
//      magic number in js/manning-pipe-head-loss.js:
//
//          S_f = V^2 n^2 * 6.3496 / D^(4/3)
//
//      That 6.3496 is not a fitted constant and not a unit factor -- it is 4^(4/3), which is
//      what 1/R^(4/3) becomes when R = D/4 is substituted into the SI Manning equation
//      V = (1/n) R^(2/3) S^(1/2). So the anchor is Manning itself, in the two forms every
//      textbook states:
//        - SI:  V = (1/n) R^(2/3) S^(1/2), with R and V in metres and metres per second.
//        - US:  V = (1.486/n) R^(2/3) S^(1/2), with R in feet and V in feet per second. The
//          1.486 is not an independent constant either -- it is (1/0.3048)^(1/3) = 1.48592 --
//          and the page is checked against it in US display units, which is what catches a
//          conversion applied on the wrong side of an exponent.
//      Both are asserted directly, and 4^(4/3) is asserted against the truncated 6.3496 in the
//      source so that a future edit to that literal is measured rather than eyeballed.
//
//   2. THE OTHER MANNING PAGE. Manning-Pipe-Flow solves the same pipe forwards -- given a slope,
//      what flows -- and reports the full-bore discharge Q0 for the same D, n and S. Feeding
//      that Q0 back into this page must return the slope it started from. Two calculators, two
//      files, one round trip; neither can be wrong on its own without the trip failing.
//
//   3. THE EXPONENTS, dimensionlessly: S_f is proportional to Q^2 and to n^2 exactly, and to
//      D^(-16/3) exactly (the -4/3 from the hydraulic radius plus the -4 from the area appearing
//      squared in V^2). Ratios of the page against itself, so no unit factor or coefficient
//      survives them.
//
//   4. THE ENERGY LINE, which on this page runs the other way from Darcy-Weisbach and
//      Hazen-Williams and is the thing most likely to be got backwards. This is the OUTLET
//      CONTROL case: the user supplies the DOWNSTREAM energy grade (egl1) and the page solves
//      UPSTREAM for egl2 = egl1 + h_L. Head loss is ADDED, not subtracted, and the language keys
//      say so -- mphl_egl_1 is 'Downstream EGL' and mphl_egl_2 is 'Upstream EGL'.
//
// PROVED TO BITE. Four mutations were made on purpose and all four went red: 6.3496 -> 6.0
// (12 checks), the diameter exponent 4/3 -> 4/3.2 (13), the energy line solved the wrong way
// (egl2 = egl1 - h_L instead of + h_L, 5), and R = D/4 written as D/2 (12).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

const { loadCalculator, makeReporter } = require('./calc-page.js');

const r = makeReporter('Manning Pipe Head Loss (mphl_)');
const page = loadCalculator('Manning-Pipe-Head-Loss.php');
const G = page.EngCalcs.G;
const FT = 0.3048;                 // m, exact

/** Drives the page in SI. d in mm, l in m, q in m^3/s (entered as m3ps). */
function runSI(o) {
	page.units('si')
		.unit('q', 'm3ps').unit('d', 'mm').unit('l', 'm')
		.unit('sf', 'gradePercent').unit('hf', 'mh2o').unit('hm', 'mh2o').unit('hl', 'mh2o')
		.set({ q: o.q, d: o.d, l: o.l === undefined ? 100 : o.l, n: o.n,
			k: o.k === undefined ? 0 : o.k, egl1: o.egl1 === undefined ? 0 : o.egl1 })
		.run();
	return {
		sf: page.num('sf') / 100,        // percent grade back to m/m
		v: page.num('v'),                // m/s
		hf: page.num('hf'),              // m
		hm: page.num('hm'),
		hl: page.num('hl')
	};
}

// ---- 1a. the SI Manning equation ------------------------------------------------------------
r.section('SI Manning: V = (1/n) R^(2/3) S^(1/2), with R = D/4');

// Read backwards: whatever S_f the page reports, recomputing V from it through Manning must give
// back the velocity the page also reports. Both come off the same page but through completely
// different arithmetic -- V from Q/A, S_f from the 6.3496 expression -- so agreement is a real
// statement about the constant.
//
// 0.1%: S_f is read in percent grade (five significant figures) and V is printed to 4 decimals,
// so at these velocities the quantisation is under 0.01%. Nothing physical is approximated.
for (const [dmm, q, n] of [[300, 0.1, 0.013], [600, 0.5, 0.013], [1200, 3.0, 0.024], [150, 0.02, 0.009]]) {
	const s = runSI({ q: q, d: dmm, n: n });
	const R = (dmm / 1000) / 4;
	const vManning = (1 / n) * Math.pow(R, 2 / 3) * Math.sqrt(s.sf);
	r.close(s.v, vManning, 1e-3,
		`D = ${dmm} mm, Q = ${q} m^3/s, n = ${n}: V = (1/n) R^(2/3) sqrt(S) = ${vManning.toFixed(4)} m/s`);
	// And the geometry the head loss is built on, once, here rather than in every case.
	// The area cell prints 4 decimals in m^2, so a 150 mm pipe's 0.0177 m^2 carries three
	// significant figures and the bound has to be the printed one rather than a round number.
	const wantA = Math.PI * Math.pow(dmm / 1000, 2) / 4;
	r.close(page.si('a'), wantA, 5e-5 / wantA, `D = ${dmm} mm: A = pi D^2/4`);
	r.close(page.si('rh'), R, 1e-3, `D = ${dmm} mm: R = D/4`);
	r.close(page.si('pw'), Math.PI * (dmm / 1000), 1e-3, `D = ${dmm} mm: Pw = pi D`);
}

// ---- 1b. the US Manning equation, and the 1.486 --------------------------------------------
r.section('US Manning: V = (1.486/n) R^(2/3) S^(1/2), with R in feet');

// 1.486 is (1/0.3048)^(1/3) = 1.4859..., the number that appears when the SI equation is
// rewritten for feet. Asserting the page against the US form in US DISPLAY units is what would
// catch a conversion applied on the wrong side of the 2/3 exponent -- an error that leaves the
// SI check above passing perfectly.
const K_US = Math.pow(1 / FT, 1 / 3);
r.close(K_US, 1.486, 1e-3, 'the customary 1.486 is (1/0.3048)^(1/3)', `= ${K_US.toFixed(5)}`);

for (const [dIn, qCfs, n] of [[24, 10, 0.013], [36, 40, 0.013], [12, 2, 0.011]]) {
	page.units('us')
		.unit('q', 'ft3ps').unit('d', 'in').unit('l', 'ft').unit('rh', 'ft')
		.unit('sf', 'gradePercent')
		.set({ q: qCfs, d: dIn, l: 200, n: n, k: 0, egl1: 0 }).run();
	const sf = page.num('sf') / 100;
	const rFt = page.num('rh');                 // ft, and must be D/4
	const vFps = page.num('v');                 // ft/s
	r.close(rFt, dIn / 12 / 4, 1e-3, `D = ${dIn} in: R = D/4 = ${(dIn / 48).toFixed(4)} ft`);
	const vUS = (K_US / n) * Math.pow(rFt, 2 / 3) * Math.sqrt(sf);
	r.close(vFps, vUS, 1e-3,
		`D = ${dIn} in, Q = ${qCfs} cfs, n = ${n}: V = (1.486/n) R^(2/3) sqrt(S) = ${vUS.toFixed(4)} ft/s`);
}

// The literal in the source is a truncation of 4^(4/3), and truncating it is the one degree of
// freedom a future editor has here. 6.3496 vs 6.349604... is 6.6e-7 relative, which is far
// below anything a page printing four decimals can show; this asserts that it stays that way.
r.section('the 6.3496 in the source is 4^(4/3)');
const FOUR_43 = Math.pow(4, 4 / 3);
r.close(6.3496, FOUR_43, 1e-6, '4^(4/3) = 6.349604...', `truncated to 6.3496, 6.6e-7 relative`);
// Measured through the page rather than asserted about the literal: S_f D^(4/3) / (V^2 n^2)
// must be that constant, whatever units the page happens to be showing.
for (const [dmm, q, n] of [[300, 0.1, 0.013], [1200, 3.0, 0.024]]) {
	const s = runSI({ q: q, d: dmm, n: n });
	const got = s.sf * Math.pow(dmm / 1000, 4 / 3) / (s.v * s.v * n * n);
	r.close(got, FOUR_43, 2e-3, `D = ${dmm} mm: S_f D^(4/3) / (V n)^2 = 4^(4/3)`, `got ${got.toFixed(5)}`);
}

// ---- 2. the round trip through Manning Pipe Flow ---------------------------------------------
r.section('round trip: Manning-Pipe-Flow solves the same pipe forwards');

// mpf reports Q0, the full-bore discharge, for a given D, n and S. Feeding that Q0 into this
// page as the flow must return S. The two calculators are different files with different code;
// the only thing they share is the physics, which is the point.
const mpf = loadCalculator('Manning-Pipe-Flow.php');
for (const [dmm, n, slope] of [[300, 0.013, 0.005], [600, 0.013, 0.002], [1200, 0.024, 0.01]]) {
	mpf.units('si').unit('q0', 'm3ps').unit('d0', 'mm')
		.set({ d0: dmm, n: n, sf: slope, dd0: 0.5 }).run();
	const q0 = mpf.num('q0');                    // m^3/s, full bore
	const back = runSI({ q: q0, d: dmm, n: n });
	r.close(back.sf, slope, 3e-3,
		`D = ${dmm} mm, n = ${n}, S = ${slope}: mpf says Q0 = ${q0.toFixed(4)} m^3/s, ` +
		`mphl gives that slope back`);
}

// ---- 3. the exponents ------------------------------------------------------------------------
r.section('exponents: S_f goes as Q^2, as n^2, and as D^(-16/3)');

// Ratios of the page against itself. The coefficient and the whole unit chain cancel; only the
// exponent is left, and the bound is the printed precision of the two slopes.
// Q = 1 m^3/s rather than something smaller so that BOTH slopes in the diameter ratio print
// with five significant figures: the 800 mm pipe's slope is 40 times the 400 mm one's, and at a
// gentler flow the smaller of the two would be quantised at the 0.1% level all on its own.
const baseSf = runSI({ q: 1.0, d: 400, n: 0.013 }).sf;
r.close(runSI({ q: 2.0, d: 400, n: 0.013 }).sf / baseSf, 4, 1e-3, 'doubling Q multiplies S_f by 4');
r.close(runSI({ q: 1.0, d: 400, n: 0.026 }).sf / baseSf, 4, 1e-3, 'doubling n multiplies S_f by 4');
r.close(baseSf / runSI({ q: 1.0, d: 800, n: 0.013 }).sf, Math.pow(2, 16 / 3), 1e-3,
	'doubling D divides S_f by 2^(16/3) = ' + Math.pow(2, 16 / 3).toFixed(3));
// h_f is strictly proportional to L, and L appears nowhere else.
const hf100 = runSI({ q: 0.2, d: 400, n: 0.013, l: 100 }).hf;
r.close(runSI({ q: 0.2, d: 400, n: 0.013, l: 350 }).hf / hf100, 3.5, 1e-3,
	'h_f is strictly proportional to the pipe length');

// ---- 4. the energy line, which runs UPSTREAM on this page ------------------------------------
r.section('outlet control: the page solves upstream from a known downstream EGL');

const e = runSI({ q: 0.3, d: 500, n: 0.013, l: 250, k: 2.5, egl1: 100 });
const hv = page.si('hv');

r.close(e.hm, 2.5 * hv, 2e-3, 'h_m = k V^2/2g');
r.close(e.hl, e.hf + e.hm, 2e-3, 'h_L = h_f + h_m');
r.close(page.si('hgl1'), 100 - hv, 1e-3, 'downstream HGL = downstream EGL - velocity head');
r.close(page.si('egl2'), 100 + e.hl, 1e-3,
	'UPSTREAM EGL = downstream EGL + h_L -- head loss is ADDED going upstream');
r.close(page.si('hgl2'), page.si('egl2') - hv, 1e-3, 'upstream HGL = upstream EGL - velocity head');
r.ok(page.si('egl2') > page.si('hgl1'),
	'and the upstream end is higher than the downstream end, as water running downhill requires',
	`EGL2 = ${page.num('egl2')} > HGL1 = ${page.num('hgl1')}`);

// One diameter and one flow, so the velocity head is identical at both ends and must drop out of
// the difference of the two grade lines entirely.
r.close(page.si('egl2') - page.si('egl1'), e.hl, 2e-3, 'EGL2 - EGL1 = h_L');
r.close(page.si('hgl2') - page.si('hgl1'), e.hl, 2e-3,
	'HGL2 - HGL1 = h_L too, with the velocity head cancelled');

// The datum is the user's: shifting the downstream EGL shifts every grade line by the same
// amount and changes no loss.
const shifted = runSI({ q: 0.3, d: 500, n: 0.013, l: 250, k: 2.5, egl1: 140 });
r.close(page.si('egl2'), 140 + e.hl, 1e-3, 'raising the downstream EGL by 40 m raises the upstream EGL by 40 m');
r.close(shifted.hl, e.hl, 1e-3, 'and changes no head loss');

// ---- the page's own defaults ------------------------------------------------------------------
r.section('factory defaults open on a passing design');
for (const [preset, lang] of [['us', 'en'], ['si', 'es']]) {
	const fresh = loadCalculator('Manning-Pipe-Head-Loss.php', { lang: lang });
	fresh.run();
	const v = fresh.si('v');
	const b = fresh.EngCalcs.VELOCITY_OK;
	r.ok(v >= b.min && v <= b.max, `${preset}: default velocity ${v.toFixed(3)} m/s is inside the OK band`,
		`band ${b.min}-${b.max} m/s`);
	r.ok(/✓/.test(fresh.html('vel_check')) && !/⚠/.test(fresh.html('vel_check')),
		`${preset}: the velocity check greets a first-time visitor with a tick`, fresh.html('vel_check'));
	r.ok(fresh.si('hf') > 0 && isFinite(fresh.si('hf')),
		`${preset}: the default h_f is a real positive number`, `h_f = ${fresh.num('hf')}`);
	// Both presets are supposed to describe about the same pipe -- 24 in and 600 mm.
	r.ok(fresh.si('rh') > 0.1 && fresh.si('rh') < 0.2,
		`${preset}: and the default pipe is the same pipe in both presets (R about 0.15 m)`,
		`R = ${fresh.si('rh').toFixed(4)} m`);
}

r.finish();
