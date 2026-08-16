// Shared pipe-hydraulics constants and kernels.
//
// Load this BEFORE any calculator script that uses it. Under Node it is pulled in
// by require() from js/lpn-solver.js.
//
// Scope today is Hazen-Williams only. The Darcy-Weisbach and Manning kernels are
// still duplicated in js/branched-network.js and js/lpn-solver.js; they belong
// here, and moving them needs a behavior-preserving diff.

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

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
