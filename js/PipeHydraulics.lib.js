// Shared pipe-hydraulics constants and kernels.
//
// Load this BEFORE any calculator script that uses it. Under Node it is pulled in
// by require() from js/lpn-solver.js.
//
// Scope today is Hazen-Williams, EPANET's default viscosity and gravity, and the
// Darcy-Weisbach friction factor. The Manning kernel is still duplicated in
// js/branched-network.js and js/lpn-solver.js.

var EngCalcs = EngCalcs || {};

// ---------------------------------------------------------------------------
// Hazen-Williams, on EPANET's constants.
//
// EPANET solves, in US units (Q cfs, L ft, d ft, h ft):
//
//     h = 4.727 L Q^1.852 / (C^1.852 d^4.871)
//
// Converting each length to metres (and cfs to m3/s, which is 0.3048^3 per cfs)
// turns the 4.727 into the SI coefficient below, 10.666829. The diameter exponent
// is untouched by the conversion and stays 4.871.
//
// THIS IS THE SUITE'S ONLY HAZEN-WILLIAMS PAIR -- do not reintroduce a second one.
// The common SI restatement (coefficient 10.674400, exponent 4.8704) disagrees
// diameter-dependently rather than by a constant offset, by up to 0.12% over
// 50 mm to 2 m. EPANET's form is used because it is the engine users check us
// against, and because .inp import would otherwise have to keep both sets alive.
//
// Derived in code rather than typed so the trace back to 4.727 stays visible.
EngCalcs.hwCoef = 4.727 * Math.pow(0.3048, 4.871) / Math.pow(0.3048 * 0.3048 * 0.3048, 1.852);
EngCalcs.hwDiaExp = 4.871;
EngCalcs.hwExp = 1.852;

// ---------------------------------------------------------------------------
// Head to pressure in psi and kPa, on EPANET's constants -- for the Looped Network calculator only.
//
// EPANET's types.h has PSIperFT = 0.4333 (psi per foot of water); the exact value is 0.4335275.
// A user checks lpn_ against EPANET's report, and with the exact one every psi reads 0.05% above
// it (Tom, 2026-10-03: "OK" to adopting EPANET's). The suite-wide $ec_units['psi'] stays exact,
// because other calculators use psi as a general pressure unit (lib/Units.lib.php). js/looped-
// network.js puts the factor below into its own copy of EngCalcs.unitFactors.psi, and
// js/lpn-fireflow.js and js/lpn-inp.js read these two, so there is one number on that page.
EngCalcs.EPANET_PSI_PER_FT = 0.4333;
EngCalcs.EPANET_PSI_PER_M = EngCalcs.EPANET_PSI_PER_FT / 0.3048;   // "psi per metre", a unitFactors entry
// kPa and bar too (Tom, 2026-10-03: "Yes"). OWA EPANET (github.com/OpenWaterAnalytics/EPANET),
// src/types.h: KPAperPSI 6.895 (exact 6.894757), BARperPSI 0.068948 (exact 0.0689476); src/input1.c
// initunits(): pcf = PSIperFT * SpGrav, times KPAperPSI for kPa or BARperPSI for bar, assigned to
// Ucf[PRESSURE]. So kPa per metre of head is 0.4333 * 6.895 / 0.3048 = 9.80185 (exact 9.80665,
// 0.049% lower), and bar per metre is 0.4333 * 0.068948 / 0.3048 = 0.098018.
EngCalcs.EPANET_KPA_PER_PSI = 6.895;
EngCalcs.EPANET_BAR_PER_PSI = 0.068948;
EngCalcs.EPANET_KPA_PER_M = EngCalcs.EPANET_PSI_PER_M * EngCalcs.EPANET_KPA_PER_PSI;
EngCalcs.EPANET_BAR_PER_M = EngCalcs.EPANET_PSI_PER_M * EngCalcs.EPANET_BAR_PER_PSI;

// Friction slope Sf (m of head per m of pipe) for full-pipe flow.
//   q  flow (m3/s, sign ignored)
//   d  inside diameter (m)
//   c  Hazen-Williams C
// Returns 0 rather than Infinity/NaN for a missing diameter or C, so a
// half-filled input row does not poison a whole network solve.
EngCalcs.hwSlope = function (q, d, c) {
	'use strict';
	if (!(d > 0) || !(c > 0)) { return 0; }
	return EngCalcs.hwCoef * Math.pow(Math.abs(q), EngCalcs.hwExp) /
		(Math.pow(c, EngCalcs.hwExp) * Math.pow(d, EngCalcs.hwDiaExp));
};

// ---------------------------------------------------------------------------
// Darcy-Weisbach, on EPANET's constants.
//
// EPANET's default kinematic viscosity is VISCOS = 1.1e-5 ft2/s (types.h), which is 1.0219e-6 m2/s.
// It is NOT water at 20 degC (1.004e-6) and the looped network once hard-coded 1.007e-6 in its own
// model, so the built-in solver and EPANET ran different fluids. One definition, here. A relative
// "Viscosity 1.3" option multiplies this; js/lpn-native-run.js reads the ft2/s form.
EngCalcs.EPANET_VISCOS_FT2S = 1.1e-5;
EngCalcs.EPANET_VISCOS = EngCalcs.EPANET_VISCOS_FT2S * 0.3048 * 0.3048;

// EPANET's hydcoeffs.c resistcoeff() writes a Darcy-Weisbach pipe's resistance with g = 32.2 ft/s2,
// not 32.174, which is 9.81456 m/s2 against the suite's EngCalcs.G = 9.80665 (0.08 % more head loss).
// Used for the friction term only: EPANET's minor loss has its own rounded 0.02517 (see lpn-solver.js).
EngCalcs.EPANET_G_DW = 32.2 * 0.3048;

// Darcy-Weisbach friction factor, branch for branch with EPANET's hydcoeffs.c frictionFactor():
//   Re <= 2000   Hagen-Poiseuille, f = 64/Re
//   Re >= 4000   Swamee-Jain, f = 0.25 / log10(e/(3.7 d) + 5.74/Re^0.9)^2
//   between      Dunlop's cubic in Re/2000, whose two anchors (fa, fb) are Swamee-Jain at Re = 4000,
//                so y2 below carries 5.74/4000^0.9 and NOT the actual Re. A copy that put the actual
//                Re there ran 1 to 2.6 % off EPANET's head loss between Re 2000 and 4000.
// q flow (m3/s, sign ignored), d diameter (m), e roughness LENGTH (m), visc kinematic viscosity (m2/s).
// Returns 0 at no flow. The constants are EPANET's own (hydcoeffs.c A1 to AC), not rounded.
EngCalcs.dwFriction = function (q, d, e, visc) {
	'use strict';
	var w = Math.abs(q) / (visc * d),      // Re * pi / 4
		r = e / (3.7 * d),
		y1, y2, y3, fa, fb, x, x1, x2, x3, x4;
	if (!(w > 0)) { return 0; }
	if (w <= 1570.7963267948966) { return 16 * Math.PI / w; }
	if (w >= 3141.592653589793) {
		y1 = 4.618413198590667 / Math.pow(w, 0.9);
		y3 = -0.8685889638065037 * Math.log(r + y1);
		return 1 / (y3 * y3);
	}
	y2 = r + 3.2889547634539906e-3;
	y3 = -0.8685889638065037 * Math.log(y2);
	fa = 1 / (y3 * y3);
	fb = (2 - 5.142149657990939e-3 / (y2 * y3)) * fa;
	x = w / 1570.7963267948966;
	x1 = 7 * fa - fb;
	x2 = 0.128 - 17 * fa + 2.5 * fb;
	x3 = -0.128 + 13 * fa - 2 * fb;
	x4 = 0.032 - 3 * fa + 0.5 * fb;
	return x1 + x * (x2 + x * (x3 + x * x4));
};

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
