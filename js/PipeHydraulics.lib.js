// Shared pipe-hydraulics constants and kernels (ROADMAP Task 213).
//
// Load this BEFORE any calculator script that uses it. Under Node it is pulled in
// by require() from js/lpn-solver.js.
//
// Scope today is Hazen-Williams only. It is deliberately the first tenant of the
// js/PipeHydraulics.lib.js extraction that js/lpn-solver.js defers -- the
// Darcy-Weisbach and Manning kernels still live in duplicate in
// js/branched-network.js and js/lpn-solver.js, and move here later under a
// behavior-preserving diff.

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
// The suite used to carry a second pair -- coefficient 10.674400 with exponent
// 4.8704, from the Wikipedia SI restatement -- in all three of hazen-williams.js,
// branched-network.js and lpn-solver.js. Because the exponents differed too, the
// disagreement was diameter-dependent rather than a constant offset: ours divided
// by EPANET's ran 0.9989 at d = 50 mm through 1.0000 near 300 mm to 1.0011 at
// d = 2 m, so at most 0.12% and far inside the uncertainty in C itself. EPANET's
// form won (Tom, 2026-08-05) because it is the engine users check us against and
// because .inp import (Task 196) would otherwise have to keep both sets alive
// forever.
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
