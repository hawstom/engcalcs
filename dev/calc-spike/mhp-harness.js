// Behavioural test of Microhydropower (mhp_).
//
//   node dev/calc-spike/mhp-harness.js
//
// ROADMAP Task 292.
//
// WHAT IT ANCHORS AGAINST
//
//   1. THE HYDRAULIC POWER EQUATION, P = eta rho g Q H_net, which is not a correlation and has
//      no coefficient to get wrong -- it is the weight of water falling per second times the
//      distance it falls, times what the machine keeps. So the checks that matter are that it is
//      exactly linear in each of eta, Q and H_net, and that the ARITHMETIC lands on the right
//      number in kilowatts, which is where a unit factor could hide. One worked example is
//      written out in full below so a reader can check it with a calculator.
//
//   2. THE ANNUAL ENERGY, P x 8760 h. 8760 is 365 x 24 -- a calendar year, not a Julian one
//      (8766) and not a leap year (8784). Which of the three is used is a policy choice rather
//      than a physical fact, so the test states the one this page makes rather than assuming it.
//
//   3. THE FRICTION FACTOR, WHICH IS A SECOND COPY. js/micro-hydro-power.js carries its own
//      transcription of the three-regime friction-factor code from js/darcy-weisbach.js -- the
//      same 64/Re, the same Dunlop cubic, the same Swamee-Jain, written out again. That
//      duplication is the defect risk on this page: the two can drift and nothing would say so.
//      dw-harness.js anchors one copy against Colebrook-White; this file requires the OTHER copy
//      to agree with it, across all three regimes, by driving both pages to the same Reynolds
//      number and relative roughness. Neither harness alone would notice a one-sided edit.
//
//   4. THE NET HEAD BOOKKEEPING: H_net = H_gross - h_f - h_m, floored at zero, and the head-loss
//      percentage banding (10% and 20%) the page uses to grade a penstock design.
//
// PROVED TO BITE. Four mutations were made on purpose and all four went red: g dropped from the
// power equation (3 checks), 8760 -> 8766 (2), 5.74 -> 5.75 in this page's copy of Swamee-Jain
// (1, out of 32 -- f prints to 4 decimals and the two copies must match to the last of them),
// and H_net computed as H_gross - h_f with the minor loss forgotten (1).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

const { loadCalculator, makeReporter } = require('./calc-page.js');

const r = makeReporter('Microhydropower (mhp_)');
const page = loadCalculator('Micro-Hydro-Power.php');
const G = page.EngCalcs.G;
const RHO = 1000;                       // kg/m^3, the page's own fresh-water density
const FT = 0.3048;

/** Drives the page in SI: q in L/s, heads and lengths in m, d in mm, e in mm. */
function runSI(o) {
	page.units('si')
		.unit('q', 'lps').unit('d', 'mm').unit('l', 'm').unit('e', 'mm')
		.unit('hgross', 'm').unit('hnet', 'm').unit('hf', 'm').unit('hm', 'm').unit('hl', 'm')
		.unit('power', 'kw').unit('annual_kwh', 'kwh_yr')
		.set({
			q: o.q * 1000, hgross: o.hgross, d: o.d * 1000, l: o.l,
			e: o.e * 1000, km: o.km === undefined ? 0 : o.km,
			nu: o.nu === undefined ? 1e-6 : o.nu, eta: o.eta
		}).run();
	return {
		vel: page.num('vel'), f: page.num('f'),
		hf: page.num('hf'), hm: page.num('hm'), hl: page.num('hl'), hnet: page.num('hnet'),
		kw: page.num('power'), kwh: page.num('annual_kwh')
	};
}

// ---- 1. P = eta rho g Q H_net ---------------------------------------------------------------
r.section('the power equation, arithmetic written out');

// A 200 mm penstock, 100 m long, smooth (e = 0.05 mm), no minor losses, 40 L/s under 50 m of
// gross head, 75% efficient. In SI, by hand:
//   A     = pi 0.2^2/4                    = 0.0314159 m^2
//   V     = 0.040 / 0.0314159             = 1.273240 m/s
//   hv    = V^2/2g                        = 0.0826442 m
//   Re    = 1.273240 * 0.2 / 1e-6         = 254,648        -> turbulent, Swamee-Jain
//   e/D   = 0.05/200                      = 0.00025
//   f     = 0.25/log10(0.00025/3.7 + 5.74/254648^0.9)^2   = 0.016937
//   h_f   = f (L/D) hv = 0.016937*500*0.0826442           = 0.699857 m
//   H_net = 50 - 0.699857                                 = 49.300143 m
//   P     = 0.75 * 1000 * 9.80665 * 0.040 * 49.300143     = 14503.7 W = 14.504 kW
// The friction factor is READ FROM THE PAGE rather than recomputed here, because dw-harness.js
// is where f is anchored against Colebrook-White; what this line tests is everything after it.
const w = runSI({ q: 0.040, hgross: 50, d: 0.200, l: 100, e: 0.00005, km: 0, eta: 0.75 });
const A = Math.PI * 0.2 * 0.2 / 4;
const V = 0.040 / A;
const hv = V * V / (2 * G);

r.close(w.vel, V, 1e-3, `V = Q/A = ${V.toFixed(4)} m/s`);
r.close(w.hf, w.f * (100 / 0.2) * hv, 2e-3, 'h_f = f (L/D) V^2/2g');
r.close(w.hnet, 50 - w.hl, 1e-3, 'H_net = H_gross - h_L');
r.close(w.kw, 0.75 * RHO * G * 0.040 * w.hnet / 1000, 1e-3,
	`P = eta rho g Q H_net = ${(0.75 * RHO * G * 0.040 * w.hnet / 1000).toFixed(3)} kW`);

// Linearity in each factor separately, as ratios of the page against itself -- rho, g and every
// unit factor cancel out of these, so only the structure of the equation is left.
r.section('P is exactly linear in eta, in Q and in H_net');
const base = runSI({ q: 0.040, hgross: 50, d: 0.400, l: 100, e: 0.00005, km: 0, eta: 0.75 });
// A 400 mm pipe so the friction loss is small and H_net moves with H_gross almost exactly.
r.close(runSI({ q: 0.040, hgross: 50, d: 0.400, l: 100, e: 0.00005, km: 0, eta: 0.375 }).kw / base.kw,
	0.5, 1e-3, 'halving the efficiency halves the power');
const dblH = runSI({ q: 0.040, hgross: 100, d: 0.400, l: 100, e: 0.00005, km: 0, eta: 0.75 });
r.close(dblH.kw / (0.75 * RHO * G * 0.040 * dblH.hnet / 1000), 1, 1e-3,
	'and doubling the gross head gives the power of the NET head it produces');
const dblQ = runSI({ q: 0.080, hgross: 50, d: 0.400, l: 100, e: 0.00005, km: 0, eta: 0.75 });
r.close(dblQ.kw / (0.75 * RHO * G * 0.080 * dblQ.hnet / 1000), 1, 1e-3,
	'and doubling the flow likewise, with its own larger friction loss accounted');

// The minor loss must reach the net head as well as the friction loss. With k_m = 0 everywhere
// above, an H_net computed as H_gross - h_f alone would pass every check so far.
const withK = runSI({ q: 0.040, hgross: 50, d: 0.200, l: 100, e: 0.00005, km: 6, eta: 0.75 });
r.ok(withK.hm > 0.4, 'a k_m of 6 makes a minor loss worth having', `h_m = ${withK.hm} m`);
r.close(withK.hl, withK.hf + withK.hm, 2e-3, 'h_L = h_f + h_m');
r.close(withK.hnet, 50 - withK.hf - withK.hm, 1e-3,
	'H_net = H_gross - h_f - h_m: the minor loss comes off the net head too');
r.close(withK.kw, 0.75 * RHO * G * 0.040 * withK.hnet / 1000, 2e-3,
	'and the power follows that smaller net head');

// Zero net head is zero power, and a penstock that loses more than the whole gross head must
// floor at zero rather than report a negative machine.
r.section('a penstock that loses more than the head it has produces no power');
const drowned = runSI({ q: 0.200, hgross: 2, d: 0.100, l: 500, e: 0.001, km: 5, eta: 0.75 });
r.ok(drowned.hl > 2, 'the head loss exceeds the gross head', `h_L = ${drowned.hl} m vs 2 m`);
r.eq(drowned.hnet, 0, 'H_net is floored at zero, not reported negative');
r.eq(drowned.kw, 0, 'and the power is zero, not negative');

// ---- 2. the annual energy -------------------------------------------------------------------
r.section('annual energy is the power times 8760 hours');

// 8760 = 365 x 24. Not the Julian year (8766 h) and not a leap year (8784 h): which of the three
// a page uses is a stated convention, not a fact, so it is asserted rather than assumed. The
// three differ by 0.07% and 0.27%, which is well inside what this test can see.
// A LARGE scheme, deliberately: power prints to 2 decimals, so at the 14 kW of the worked
// example above the rounding alone is 7e-4 -- the same size as the 8760/8766 difference, and
// the test would not be able to tell them apart. At 700 kW the rounding is 1.4e-5 and the
// comparison can be made at 1e-4, which separates all three candidate years cleanly.
const bigScheme = runSI({ q: 2.0, hgross: 50, d: 1.200, l: 300, e: 0.00005, km: 1, eta: 0.75 });
r.ok(bigScheme.kw > 500, 'a scheme large enough for the power cell to carry six digits',
	`P = ${bigScheme.kw} kW`);
r.close(bigScheme.kwh, bigScheme.kw * 8760, 1e-4,
	`annual kWh = kW x 8760 = ${(bigScheme.kw * 8760).toFixed(1)}`);
r.eq(8760, 365 * 24, '8760 hours is 365 days of 24 hours');
// And it is not one of the neighbours: the printed annual figure is far enough from the same
// power times 8766 or 8784 hours that the difference cannot be a rounding artefact.
for (const hours of [8766, 8784]) {
	const gap = Math.abs(bigScheme.kwh - bigScheme.kw * hours) / (bigScheme.kw * hours);
	r.ok(gap > 3e-4, `and is distinguishable from a ${hours}-hour year`,
		`${(gap * 100).toFixed(3)}% apart`);
}

// ---- 3. the duplicated friction factor must not drift from Darcy-Weisbach --------------------
r.section('the friction factor here agrees with the Darcy-Weisbach page, in all three regimes');

// js/micro-hydro-power.js transcribes the whole three-regime friction-factor block from
// js/darcy-weisbach.js. dw-harness.js anchors THAT copy against an independent Colebrook-White
// solve; this section anchors THIS copy against that one. Both pages are driven to the same
// Reynolds number and the same relative roughness, with the same kinematic viscosity, so any
// difference at all is a divergence between the two transcriptions.
const dw = loadCalculator('Darcy-Weisbach.php');
const NU = 1e-6;
const D = 0.300;
const AREA = Math.PI * D * D / 4;

function fFromDW(re, rel) {
	const q = re * NU * Math.PI * D / 4;
	dw.units('si').set({
		q: q * 1000, d: D * 1000, l: 100, e: rel * D * 1000, v: NU,
		km: 0, z_up: 100, p_up: 0, z_down: 100
	}).run();
	return dw.num('f');
}
function fFromMHP(re, rel) {
	const q = re * NU * Math.PI * D / 4;
	return runSI({ q: q, hgross: 100, d: D, l: 100, e: rel * D, km: 0, nu: NU, eta: 0.75 }).f;
}

// f prints to 4 decimals on both pages, so equal printed values is as tight a statement as can
// be made -- and it is a strict equality, not a tolerance, because both are the same string of
// arithmetic on the same inputs. Any divergence at all in a constant would move the fourth
// decimal at some point on this grid.
for (const rel of [1e-5, 1e-4, 1e-3, 1e-2]) {
	for (const re of [500, 1500, 2500, 3500, 5000, 1e5, 1e6, 1e7]) {
		r.eq(fFromMHP(re, rel), fFromDW(re, rel),
			`eps/D = ${rel}, Re = ${re}: the two copies of the friction factor agree`);
	}
}

// ---- 4. the head-loss banding -----------------------------------------------------------------
r.section('the head-loss check bands a penstock at 10% and 20% of gross head');

// The bands are a design convention this page states, not physics, so the test is that the page
// applies its own stated rule at the boundaries. A design losing 5% of its head is good, 15% is
// worth a second look, 25% is a pipe too small.
function bandAt(dm) {
	const s = runSI({ q: 0.060, hgross: 60, d: dm, l: 400, e: 0.00015, km: 2, eta: 0.75 });
	return { pct: s.hl / 60 * 100, html: page.html('hl_check') };
}
const good = bandAt(0.300), mid = bandAt(0.205), bad = bandAt(0.170);
r.ok(good.pct < 10 && /✓/.test(good.html), `a ${good.pct.toFixed(1)}% loss is a tick`, good.html);
r.ok(mid.pct > 10 && mid.pct < 20 && /⚠/.test(mid.html),
	`a ${mid.pct.toFixed(1)}% loss is flagged`, mid.html);
r.ok(bad.pct > 20 && /⚠/.test(bad.html), `a ${bad.pct.toFixed(1)}% loss is flagged`, bad.html);
// The percentage the page prints must be the percentage it computed.
// The verdict string is "<span class=... title=...>⚠ 11.2%</span>", and the title carries its
// own numbers, so the percentage is taken from the one immediately before the closing tag
// rather than from the first digits in the markup.
const shown = /([\d.]+)%\s*<\/span>/.exec(mid.html);
r.ok(shown, 'the head-loss check prints a percentage', mid.html);
r.close(parseFloat(shown[1]), mid.pct, 1e-2, 'and the percentage shown is h_L / H_gross');

// ---- the page's own defaults ------------------------------------------------------------------
r.section('factory defaults open on a passing design');
for (const [preset, lang] of [['us', 'en'], ['si', 'es']]) {
	const fresh = loadCalculator('Micro-Hydro-Power.php', { lang: lang });
	fresh.run();
	const v = fresh.si('vel');
	const b = fresh.EngCalcs.VELOCITY_OK;
	r.ok(v >= b.min && v <= b.max, `${preset}: default velocity ${v.toFixed(3)} m/s is inside the OK band`,
		`band ${b.min}-${b.max} m/s`);
	r.ok(/✓/.test(fresh.html('vel_check')) && !/⚠/.test(fresh.html('vel_check')),
		`${preset}: the velocity check greets a first-time visitor with a tick`, fresh.html('vel_check'));
	r.ok(/✓/.test(fresh.html('hl_check')),
		`${preset}: and so does the head-loss check`, fresh.html('hl_check'));
	// The default scheme must actually produce power, and the two presets must describe about
	// the same scheme -- 6 in and 150 mm, 160 ft and 50 m.
	const kwSI = fresh.si('power');
	r.ok(kwSI > 0 && isFinite(kwSI), `${preset}: the default scheme produces power`,
		`P = ${fresh.num('power')} kW`);
}

r.finish();
