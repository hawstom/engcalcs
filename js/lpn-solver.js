// Looped Pipe Network solver (prefix lpn_) -- steady-state hydraulics.
//
// Solves a pipe network WITH loops by the global gradient algorithm (Todini &
// Pilati 1988), the same method EPANET uses. Pure computation: no DOM, no units,
// no language strings. The map editor sits on top of this and is replaceable.
//
// WHY NOT HARDY CROSS. Hardy Cross needs an explicit independent-loop set,
// pseudo-loops through every pair of fixed-head sources, and an initial flow
// distribution that ALREADY satisfies continuity at every node. In a map editor
// the user adds a pipe every few seconds, so all of that setup would be re-derived
// constantly. GGA needs none of the three, and converges quadratically where Hardy
// Cross converges linearly and can stall. See dev/looped-network-calculator-scope.md.
//
// EVERYTHING HERE IS SI: Q in m3/s, H and lengths in m, d in m. Callers convert at
// the edges. The document format is SI for the same reason (see the scope doc).
//
// THE LINEAR SOLVE IS AN ENVELOPE CHOLESKY, NOT A DENSE ONE. It used to be dense, on the argument
// that the target scale was ~10-20 nodes; the whole-system fire flow sweep (Task 530) is 3,707
// solves of a network two orders of magnitude bigger than that, and a dense factorization is
// n^3/6 multiply-adds. See lpnSolveSPDDense, which is kept as the reference the fast path is
// proved bit-identical against, and lpnSolvePacked, which is what a solve calls.

// The browser gets js/PipeHydraulics.lib.js from its own <script> tag ahead of this
// one; Node (dev/lpn-spike/validate.js) has no script tags, so ask for it directly.
var EngCalcs = (typeof require === 'function' && typeof module !== 'undefined')
	? require('./PipeHydraulics.lib.js')
	: (EngCalcs || {});

EngCalcs.lpnG = EngCalcs.G;

// Guard against the zero-flow singularity.
//
// This is NOT an edge case, it is the state of every freshly drawn network on
// iteration 1: at Q = 0 with the Hazen-Williams exponent, dh/dQ -> 0, so the
// conductance 1/p -> infinity and the matrix blows up.
//
// The guard is a floor on the GRADIENT dh/dQ, not a cutoff on the flow, and the
// difference is not academic. A flow cutoff leaves the gradient unbounded for any
// flow just above the cutoff, so a link sitting near zero flow -- a dead end, or a
// pipe between two nearly balanced paths -- gets an enormous conductance and swings
// wildly from one iteration to the next. Net3 reproduces this exactly: with a flow
// cutoff, pipe 333 oscillated between 0 and -2.28 gpm forever and the network never
// converged past 6e-5, even though every other link had settled.
//
// Value matches EPANET's RQtol default of 1e-6 ft per cfs, converted to SI.
EngCalcs.lpnGradMin = 1e-6 * 0.3048 / (0.3048 * 0.3048 * 0.3048);

// A separate, much smaller floor used only to keep a flow OUT of expressions that
// are undefined at exactly zero: Q^(b-1) for a pump with b < 1, the Reynolds number
// in the friction factor, and the emitter derivative. It is not a head-loss guard --
// that is lpnGradMin above -- and it must not be used as one.
EngCalcs.lpnQMin = 1e-8;

// How converged a PLATEAUED iteration must already be before it is accepted as an
// answer rather than reported as a failure -- a fraction of the network's largest
// flow. This is EPANET's own default Accuracy, deliberately: it is the point that
// engine stops at, so accepting here can never be looser than the answer the user
// would have got from EPANET. It is NOT the convergence tolerance (that is
// `opts.tol`, and it is 1e-9); nothing reaches this test until Newton has stopped
// improving for five consecutive iterations. See the stall branch for the
// measurement that set it.
EngCalcs.lpnStallAccept = 1e-3;

// A flow small enough that the network carrying it is AT REST: 1 mL/s, which is
// 0.016 gpm. Not a tolerance and not a cutoff -- nothing is ever clamped to it. It
// answers one question, in the stall branch: with no demand anywhere, are these
// flows the decayed-to-nothing answer, or a real circulation still settling?
var LPN_AT_REST = 1e-6;

// The Hazen-Williams constants are the whole suite's single pair (EPANET's), in
// js/PipeHydraulics.lib.js. There is nothing to select between here.

// Darcy-Weisbach friction factor, 3-regime Swamee-Jain. Identical to
// EngCalcs.bpnDwFriction -- a private copy; change both together, or fold them into
// js/PipeHydraulics.lib.js.
EngCalcs.lpnDwFriction = function (q, d, e, visc) {
	'use strict';
	var a = Math.PI * d * d / 4,
		v = q / a,
		re = Math.abs(v) * d / visc,
		f;
	if (re === 0) {
		f = 0;
	} else if (re < 2000) {
		f = 64 / re;
	} else if (re < 4000) {
		var r = re / 2000,
			y2 = e / (3.7 * d) + 5.74 / Math.pow(re, 0.9),
			y3 = -0.86859 * Math.log(e / (3.7 * d) + 5.74 / Math.pow(4000, 0.9)),
			fa = Math.pow(y3, -2),
			fb = fa * (2 - 0.00514215 / (y2 * y3)),
			x1 = 7 * fa - fb,
			x2 = 0.128 - 17 * fa + 2.5 * fb,
			x3 = -0.128 + 13 * fa - 2 * fb,
			x4 = r * (0.032 - 3 * fa + 0.5 * fb);
		f = x1 + r * (x2 + r * (x3 + x4));
	} else {
		f = 0.25 / Math.pow(Math.log10(e / (3.7 * d) + 5.74 / Math.pow(re, 0.9)), 2);
	}
	return f;
};

// Resistance coefficient r and exponent n for h = r |Q|^(n-1) Q.
//
// Unlike bpnFriction, which returns a head loss for a known Q, GGA needs the
// coefficient itself so it can form both the SIGNED head loss and its derivative.
// That is why this is new code rather than reuse.
EngCalcs.lpnResistance = function (link, method, visc) {
	'use strict';
	var d = link.diameter,
		L = link.length,
		a;
	if (!(d > 0) || !(L > 0)) { return { r: 0, n: 2 }; }

	if (method === 'manning') {
		// V = (1/n) R^(2/3) Sf^(1/2) with full-pipe R = d/4, written as a resistance:
		// h = 10.294 n^2 L / d^(16/3) * Q^2.
		a = Math.PI * d * d / 4;
		return { r: link.roughness * link.roughness * L / (Math.pow(d / 4, 4 / 3) * a * a), n: 2 };
	}

	if (method === 'hw') {
		if (!(link.roughness > 0)) { return { r: 0, n: EngCalcs.hwExp }; }
		return {
			r: EngCalcs.hwCoef * L /
				(Math.pow(link.roughness, EngCalcs.hwExp) * Math.pow(d, EngCalcs.hwDiaExp)),
			n: EngCalcs.hwExp
		};
	}

	// Darcy-Weisbach. f depends on Q, so the caller recomputes r each iteration from
	// the previous iteration's flow and treats it as frozen when forming the
	// derivative -- what EPANET does, and convergence stays fast.
	a = Math.PI * d * d / 4;
	return { r: link.f * L / (d * 2 * EngCalcs.lpnG * a * a), n: 2 };
};

// DENSE Cholesky (LL^T) solve of A x = b for symmetric positive definite A.
//
// **This is the REFERENCE implementation and is no longer what a solve calls** --
// lpnSolveSPD below is an ENVELOPE factorization that computes the same numbers by
// skipping terms that are exactly zero. This one is kept, exported and tested
// against, because "the fast one agrees with the simple one BIT FOR BIT on every
// matrix a real solve forms" is the whole proof that the answers did not move
// (dev/lpn-spike/spd-envelope-harness.js).
//
// Returns null if A is not positive definite, which for this matrix means the
// network is not properly grounded -- the caller should have caught that already
// with a structural check, so null here is a bug, not a user error.
EngCalcs.lpnSolveSPDDense = function (A, b) {
	'use strict';
	var n = b.length,
		L = [],
		x = new Array(n),
		y = new Array(n),
		i,
		j,
		k,
		sum;

	for (i = 0; i < n; i++) { L.push(new Float64Array(n)); }

	for (i = 0; i < n; i++) {
		for (j = 0; j <= i; j++) {
			sum = A[i][j];
			for (k = 0; k < j; k++) { sum -= L[i][k] * L[j][k]; }
			if (i === j) {
				if (!(sum > 0)) { return null; }
				L[i][i] = Math.sqrt(sum);
			} else {
				L[i][j] = sum / L[j][j];
			}
		}
	}

	for (i = 0; i < n; i++) {
		sum = b[i];
		for (k = 0; k < i; k++) { sum -= L[i][k] * y[k]; }
		y[i] = sum / L[i][i];
	}
	for (i = n - 1; i >= 0; i--) {
		sum = y[i];
		for (k = i + 1; k < n; k++) { sum -= L[k][i] * x[k]; }
		x[i] = sum / L[i][i];
	}

	return x;
};

// ENVELOPE (profile) Cholesky -- the one a solve actually calls.
//
// WHY THIS EXISTS, in one measurement. The fire-flow sweep (Task 530) runs 3,707 solves on a
// 225-junction grid, and its solve COUNT grows linearly with junctions -- that half is fine. Its
// cost per solve does not: profiled at 49 / 121 / 225 junctions, the linear solve went from 24%
// of a solve to 90% of it, because a dense Cholesky is n^3/6 multiply-adds and 225^3/6 is 1.9
// million of them PER NEWTON ITERATION. The sweep's problem was never the sweep.
//
// WHAT IT DOES. In this matrix A[i][j] is nonzero only when junctions i and j share a link, so
// most of each row is zero, and the classical envelope theorem says Cholesky's fill-in cannot
// escape the band between each row's FIRST nonzero and its diagonal. So for each row i take
//   f[i] = the first column where A[i][.] is not zero
// and store and factor only columns f[i]..i. Everything skipped is a term whose value is exactly
// 0.0, which is why this is not an approximation of the dense answer but the same arithmetic with
// the `sum -= 0` steps left out.
//
// **BIT-IDENTICAL, AND THAT IS THE POINT** -- not "within tolerance". Every term dropped is a
// product with an exactly-zero factor, and the surviving terms are accumulated in the same order
// as before, so no rounding changes. A tolerance-grade speedup would have moved every number this
// suite reports; this one moves none, which is what let it ship without asking Tom to re-approve
// an answer. Proof, on every matrix real solves form: dev/lpn-spike/spd-envelope-harness.js.
//
// f[] IS READ FROM A'S OWN ZEROS, not from the link list. A numerically-zero entry inside the
// structural pattern only makes f[i] later, which the theorem allows (its induction needs the
// zeros to be zero, not to be structural), and it keeps this function's signature exactly what it
// was -- so the dense reference above can be handed the same argument and compared against.
//
// WHAT IS NOT DONE HERE, deliberately: no fill-reducing ORDERING (RCM, minimum degree). An
// ordering is what turns a badly-numbered network into a narrow envelope, and it would help --
// but permuting the matrix changes the order of the arithmetic, and therefore changes the answer
// in its last bits. That needs Tom, not a comment. Unordered, the envelope is as good as the
// user's own node numbering, which for anything drawn or imported in geographic order is already
// narrow.
//
// THE ENVELOPE ITSELF -- the row bands, the packed offsets, and the column occupancy the back
// substitution needs. Built from a `first[]` array, whatever produced it.
//
// It depends only on WHICH ENTRIES CAN BE NONZERO, so for one network it is the same on every
// Newton iteration and on every one of a fire-flow sweep's thousands of solves. That is why it is
// a value rather than something recomputed inside the factorization: lpnSolve builds it once from
// the link list and hands the same object back for each iteration.
EngCalcs.lpnEnvelope = function (first, n) {
	'use strict';
	var rowStart = new Int32Array(n + 1),
		diag = new Int32Array(n),
		colStart = new Int32Array(n + 2),
		colRow,
		total = 0,
		i,
		j;

	for (i = 0; i < n; i++) {
		rowStart[i] = total;
		diag[i] = total + i - first[i];
		total += i - first[i] + 1;
	}
	rowStart[n] = total;

	// Column occupancy, for the back substitution alone -- it walks a COLUMN of L, which packed
	// by rows is a scatter. A counting sort, so the rows within each column come out in increasing
	// order, which is the order the dense loop visited them in and therefore the order the sum
	// has to be accumulated in for the arithmetic to be unchanged.
	for (i = 0; i < n; i++) {
		for (j = first[i]; j < i; j++) { colStart[j + 2]++; }
	}
	for (j = 0; j < n; j++) { colStart[j + 2] += colStart[j + 1]; }
	colRow = new Int32Array(total - n);
	for (i = 0; i < n; i++) {
		for (j = first[i]; j < i; j++) { colRow[colStart[j + 1]++] = i; }
	}

	return { n: n, first: first, rowStart: rowStart, diag: diag, colStart: colStart,
		colRow: colRow, total: total };
};

// Solve for a matrix already PACKED into an envelope: M holds row i's columns first[i]..i at
// rowStart[i]..diag[i]. **M IS FACTORED IN PLACE and is destroyed**, which is not a compromise --
// the caller rebuilds it from scratch on the next Newton iteration anyway, and it is what keeps a
// solve from allocating a second matrix on every iteration.
//
// Returns null on a non-positive-definite matrix, exactly as the dense reference does. `fail`, when
// given, is told the ROW that failed (fail.row), which is what EPANET's badvalve() needs: the node
// at which the factorization broke, to ask whether an active control valve made it singular.
EngCalcs.lpnSolvePacked = function (env, M, b, fail) {
	'use strict';
	var n = env.n,
		first = env.first,
		rowStart = env.rowStart,
		diag = env.diag,
		colStart = env.colStart,
		colRow = env.colRow,
		x = new Array(n),
		y = new Array(n),
		i,
		j,
		k,
		kk,
		fi,
		fj,
		si,
		sj,
		sum;

	for (i = 0; i < n; i++) {
		fi = first[i];
		si = rowStart[i] - fi;
		for (j = fi; j <= i; j++) {
			sum = M[si + j];
			fj = first[j];
			sj = rowStart[j] - fj;
			for (k = (fi > fj ? fi : fj); k < j; k++) { sum -= M[si + k] * M[sj + k]; }
			if (i === j) {
				if (!(sum > 0)) { if (fail) { fail.row = i; } return null; }
				M[si + i] = Math.sqrt(sum);
			} else {
				M[si + j] = sum / M[diag[j]];
			}
		}
	}

	for (i = 0; i < n; i++) {
		fi = first[i];
		si = rowStart[i] - fi;
		sum = b[i];
		for (k = fi; k < i; k++) { sum -= M[si + k] * y[k]; }
		y[i] = sum / M[diag[i]];
	}
	for (i = n - 1; i >= 0; i--) {
		sum = y[i];
		for (kk = colStart[i]; kk < colStart[i + 1]; kk++) {
			k = colRow[kk];
			sum -= M[rowStart[k] - first[k] + i] * x[k];
		}
		x[i] = sum / M[diag[i]];
	}

	return x;
};

// The DENSE-IN adapter, with the dense reference's exact signature.
//
// A solve does not call this -- it assembles straight into the packed form. What this is for is
// the PROOF: dev/lpn-spike/spd-envelope-harness.js hands the same dense A to this and to
// lpnSolveSPDDense and requires the two answers to match bit for bit, which is a comparison that
// only exists if both take the same argument. Keeping it also means anything outside this file
// that ever held a dense matrix still works.
//
// The envelope here is read from A'S OWN ZEROS rather than from a link list. A numerically-zero
// entry inside the structural pattern only makes first[i] later, which the theorem allows -- its
// induction needs the zeros to BE zero, not to be structural.
//
// Returns null on a non-positive-definite A, exactly as the dense one does. A is not modified.
EngCalcs.lpnSolveSPD = function (A, b) {
	'use strict';
	var n = b.length,
		first = new Int32Array(n),
		env,
		M,
		Ai,
		i,
		j,
		f;

	for (i = 0; i < n; i++) {
		Ai = A[i];
		f = i;
		for (j = 0; j < i; j++) {
			if (Ai[j] !== 0) { f = j; break; }
		}
		first[i] = f;
	}
	env = EngCalcs.lpnEnvelope(first, n);
	M = new Float64Array(env.total);
	for (i = 0; i < n; i++) {
		Ai = A[i];
		for (j = first[i]; j <= i; j++) { M[env.rowStart[i] - first[i] + j] = Ai[j]; }
	}
	return EngCalcs.lpnSolvePacked(env, M, b);
};

// A FIXED-HEAD node: one whose head is boundary data rather than an unknown.
//
// Two types qualify and they are the same thing to a steady-state solve. A reservoir is an
// inexhaustible source at a stated head. A TANK is a storage vessel whose water surface is at a
// stated head AT THIS INSTANT -- and an instant is all a steady-state solve has. EPANET does
// exactly this too: at t = 0 of an extended-period run it solves the network with every tank
// held at its initial level, and only then integrates the level forward. So a tank here is not
// an approximation of EPANET, it is EPANET's own t = 0.
//
// The DIFFERENCE between the two is entirely about time, which is why the tank carries level,
// diameter and min/max fields this file never reads: they are what Task 248's extended-period
// phase integrates, and what the .inp round-trip has to preserve meanwhile.
//
// The caller passes a resolved `head` for both types (see assembleModel() in looped-network.js),
// so nothing below has to know how a tank's head is built from its bottom elevation and level.
EngCalcs.lpnIsFixedHead = function (node) {
	return node.type === 'reservoir' || node.type === 'tank';
};

// **A TANK HAS TWO ELEVATIONS** (Tom, 2026-10-11: *"Pressure is above ground. No special meaning at
// tanks."*). `elev` is the GROUND, the pressure datum, exactly as at a junction. `bottomElev` is the
// tank BASE -- EPANET's [TANKS] Elevation -- from which water depth and volume are measured and on
// which the hydraulics stand. BLANK MEANS THE BASE IS AT THE GROUND, the rule a reservoir's blank
// head already follows, so a newly drawn tank (whose ground may still be arriving from a terrain
// tile) is a tank standing on the ground. Read on a DOCUMENT node, in whatever unit it is stored.
EngCalcs.lpnTankBottom = function (nd) {
	var b = nd ? nd.bottomElev : undefined;
	if (typeof b === 'number' && isFinite(b)) { return b; }
	return (nd && typeof nd.elev === 'number') ? nd.elev : 0;
};
// What a pressure is measured above, on a MODEL node (SI). A model tank's `elev` is its base, because
// that is what both engines solve on; its `ground` is the datum a gauge reads from.
EngCalcs.lpnPressureDatum = function (node) {
	if (node && typeof node.ground === 'number' && isFinite(node.ground)) { return node.ground; }
	return (node && node.elev) || 0;
};

// ---------------------------------------------------------------------------
// VALVES
// ---------------------------------------------------------------------------
//
// A valve is a LINK with zero length. EPANET has five types and they split cleanly in two, along
// a line this file cares about more than any other:
//
//   TCV  -- a THROTTLE. Its setting is a minor-loss coefficient, so the whole element is
//           k V^2 / 2g on a link with no friction. That is arithmetic this solver already does
//           for every pipe's minor loss, so a TCV needs NO new numerics and solves natively.
//   PRV / PSV / FCV -- ACTIVE CONTROLS. Each one CHANGES STATE during the solve: a PRV is fully
//           open while the downstream pressure is below its setting, active (holding that
//           pressure) once it is reached, and shut if flow reverses. Which state it is in depends
//           on the pressures and flows being solved for, so the status is re-decided inside the
//           iteration. **THIS FILE DOES THAT NOW** (Task 733, phase 1), by EPANET's own rules,
//           transcribed function by function from OWA-EPANET 2.3.5 -- the engine vendored in
//           js/vendor/ -- and cited at each one below: the matrix coefficients from hydcoeffs.c,
//           the state changes from hydstatus.c, and when they are checked from hydsolver.c.
//           dev/lpn-spike/native-valve-harness.js holds both engines to the same answer.
//   PBV / GPV -- FIXED-LAW VALVES, native since Task 733 phase 2. A PBV forces its setting as
//           the head drop across it and a GPV follows a head-loss curve. Neither changes state
//           during the solve -- EPANET's hydstatus.c never looks at either -- so each is one more
//           head-loss law in the link loop, decided afresh from the current flow every iteration
//           exactly as hydcoeffs.c pbvcoeff() and gpvcoeff() decide it. Cited at each line below,
//           and held to EPANET's answer by dev/lpn-spike/native-pbv-gpv-harness.js.
//
// NO VALVE ROUTES TO EPANET ANY MORE (Tom, 2026-10-18). What is left are DATA faults, and they are
// lpnDiagnose()'s, the same in either engine: a valve pair EPANET's rule forbids
// (lpnValveConflicts) and a GPV curve whose flows do not increase (lpnGpvCurveProblem) are refused
// by name; a one-point GPV curve is solved, as a straight line through the origin, and said.
EngCalcs.lpnValveTypes = ['PRV', 'PSV', 'FCV', 'TCV', 'PBV', 'GPV'];

// The valves whose state this file decides inside the iteration.
EngCalcs.lpnValveIsControl = function (link) {
	var t = link && link.type === 'valve' ? String(link.valveType || 'TCV').toUpperCase() : '';
	return t === 'PRV' || t === 'PSV' || t === 'FCV';
};

// The valves whose head loss follows a fixed law this file evaluates each iteration (phase 2).
EngCalcs.lpnValveIsFixedLaw = function (link) {
	var t = link && link.type === 'valve' ? String(link.valveType || 'TCV').toUpperCase() : '';
	return t === 'PBV' || t === 'GPV';
};

// **A GPV's CURVE, READ AS EPANET 2.3.5 READS IT** (Task 733 phase 2; Tom, 2026-10-18, on what a
// curve EPANET cannot use should do). One of four answers, each EPANET's own:
//   'gpv-no-curve'  no points. js/lpn-epanet.js writes such a GPV as a TCV at zero loss, an open
//                   connection, because EPANET rejects a GPV naming a missing curve; the built-in
//                   solver does exactly what that TCV does (hydcoeffs.c tcvcoeff(), Km = 0, so
//                   valvecoeff()'s P = 1/CSMALL). Not a fault: a freshly chosen GPV has no curve.
//   'gpv-one-point' ONE point. hydcoeffs.c curvecoeff() reads the segment [k-1, k], which a
//                   one-point curve does not have, so EPANET reads past the end of its array; in
//                   the vendored build that slot holds (0, 0), and the loss comes out as the
//                   straight line through the origin and the one point (measured: 20 L/s -> 5 m
//                   gives 7.5 m at 30 L/s, 2.5 m at 10). That is also the one defensible reading of a
//                   single point, so the built-in solver adopts it ON PURPOSE rather than by
//                   accident, and the page says it did (a warning, not a refusal).
//   'gpv-order'     flows that do not strictly increase, or one point at zero or negative flow,
//                   which has no line through the origin. validate.c validatecurves() refuses the
//                   first (error 230, and openhyd() then fails with 110); EPANET returns NaN heads
//                   for the second. Refused by name, in both engines.
//   null            a usable curve.
EngCalcs.lpnGpvCurveProblem = function (link) {
	var pts = link.curvePoints || [], i;
	if (pts.length === 0) { return 'gpv-no-curve'; }
	for (i = 0; i < pts.length; i++) {
		if (!pts[i] || !isFinite(pts[i][0]) || !isFinite(pts[i][1])) { return 'gpv-order'; }
		if (i > 0 && !(pts[i][0] > pts[i - 1][0])) { return 'gpv-order'; }
	}
	if (pts.length === 1) { return pts[0][0] > 0 ? 'gpv-one-point' : 'gpv-order'; }
	return null;
};

// Ids of the GPVs in `model` whose curve problem is `code`.
EngCalcs.lpnGpvsWith = function (model, code) {
	var out = [], i, l;
	for (i = 0; i < model.links.length; i++) {
		l = model.links[i];
		if (l.type === 'valve' && String(l.valveType).toUpperCase() === 'GPV' &&
				EngCalcs.lpnGpvCurveProblem(l) === code) { out.push(l.id); }
	}
	return out;
};

// **VALVE PAIRS EPANET'S RULE FORBIDS ARE A DATA FAULT, REFUSED BY NAME IN BOTH ENGINES.** Input
// error 220, OWA-EPANET 2.3.5 project.c valvecheck(): two PRVs sharing a downstream node or in
// series, two PSVs sharing an upstream node or in series, a PSV on a PRV's downstream node, and a
// PRV or PSV on the wrong side of an FCV. Each such pair hands one node two boundary conditions.
// Status does not matter: EPANET checks the pair as it reads the file.
//
// **EPANET ITSELF ENFORCES THIS ONLY SOMETIMES.** input3.c valvedata() calls
// valvecheck(pr, net->Nlinks, ...) BEFORE it increments Nlinks, and valvecheck() skips
// `valve->Link == index` -- so the valve read immediately before is never compared. Measured on the
// vendored engine: two PRVs in series solve when they are adjacent in [VALVES] and are refused
// (error 200) with any other valve row between them. An answer that depends on row order is not
// one to copy, so the rule is applied as EPANET states it, to every pair, in both engines.
EngCalcs.lpnValveConflicts = function (model) {
	var vs = [], out = {}, i, j, a, b;
	for (i = 0; i < model.links.length; i++) {
		if (EngCalcs.lpnValveIsControl(model.links[i])) { vs.push(model.links[i]); }
	}
	function bad(v, w) {
		var vt = String(v.valveType).toUpperCase(), t = String(w.valveType).toUpperCase(),
			vj1 = v.from, vj2 = v.to, j1 = w.from, j2 = w.to;
		if (vt === 'PRV' && t === 'PRV' && (vj2 === j2 || vj2 === j1 || vj1 === j2)) { return true; }
		if (vt === 'PSV' && t === 'PSV' && (vj1 === j1 || vj1 === j2 || vj2 === j1)) { return true; }
		if (vt === 'PSV' && t === 'PRV' && vj1 === j2) { return true; }
		if (vt === 'PRV' && t === 'PSV' && vj2 === j1) { return true; }
		if (vt === 'FCV' && t === 'PSV' && vj2 === j1) { return true; }
		if (vt === 'FCV' && t === 'PRV' && vj1 === j2) { return true; }
		if (vt === 'PSV' && t === 'FCV' && vj1 === j2) { return true; }
		if (vt === 'PRV' && t === 'FCV' && vj2 === j1) { return true; }
		return false;
	}
	for (i = 0; i < vs.length; i++) {
		for (j = 0; j < i; j++) {
			a = vs[j]; b = vs[i];
			// EPANET checks each valve against the ones read before it; the rules are written for
			// that order, so the earlier valve is `v` and the later one `w`.
			if (bad(a, b)) { out[a.id] = true; out[b.id] = true; }
		}
	}
	return out;
};

// **PRESSURE-DRIVEN ANALYSIS IS EPANET'S ALONE** (Task 762), and since Task 733 the only thing in a
// model's hydraulics, as opposed to its clock, that draws the line between the engines. The built-in solver fixes every demand
// and never claims to solve PDA; a model asking for it routes to EPANET and is refused here.
EngCalcs.lpnDemandModelIsPda = function (model) {
	var h = model && model.hydraulics;
	return !!(h && String(h.demandModel || '').toUpperCase() === 'PDA');
};

// **IS THERE ENOUGH HERE FOR AN ANSWER TO MEAN ANYTHING?** (Task 608.)
//
// The page needs this to decide when to start fetching the EPANET engine in the background, and it
// must not grow a second opinion about what a solve needs. So the definition is borrowed rather
// than written: lpnDiagnose() below already refuses an unsound network BY NAME, and asked with no
// engine it answers the engine-independent question "is this network sound?". A network it accepts
// is a network either engine could be handed.
//
// The one thing lpnDiagnose() is silent about is a drawing with nothing in it to solve: a lone
// reservoir is perfectly sound and answers nothing, because a head with no link off it is not a
// hydraulic question. Hence the link count -- one fixed head and one link is the floor.
EngCalcs.lpnIsSolveable = function (model) {
	if (!model || !model.nodes || !model.links) { return false; }
	if (model.links.length === 0) { return false; }
	return EngCalcs.lpnDiagnose(model).length === 0;
};

// The minor-loss coefficient a link actually contributes, stated ONCE because it is read in two
// places (the iteration and the report) and they must not diverge.
//
// A TCV'S LOSS IS ITS SETTING AND NOTHING ELSE, and that is EPANET's behaviour rather than a
// simplification of it -- measured against js/vendor/epanet-js.js: a TCV with setting 16 and minor
// loss 0 gives 8.00 ft, setting 12 with minor loss 3 gives 6.00 ft (= 12/16 of it), and setting 0
// with minor loss 16 gives exactly zero. EPANET IGNORES the [VALVES] minor-loss column for a TCV;
// ADDING the two -- the obvious reading of the column heading -- puts ~10.6 m of phantom head into
// a real model. This page therefore never offers a separate minor loss on a TCV: one number, both
// engines, same answer.
EngCalcs.lpnLinkK = function (link) {
	if (link.type === 'valve' && (link.valveType || 'TCV').toUpperCase() === 'TCV') {
		return link.setting || 0;
	}
	return link.k || 0;
};

// Structural checks, run BEFORE the solve, never by watching it fail.
//
// Each returns a distinct machine-readable code so the UI can say something
// specific and highlight the offending elements. The dominant real-world error is
// 'unreachable': a pipe drawn near a junction but not snapped to it.
//
// `options.engine` NAMES THE ENGINE THE CALLER IS ABOUT TO USE, and it is opt-in on purpose.
// Everything below is engine-independent except one check -- a pressure-driven demand model is a
// perfectly valid network that this file alone cannot solve -- so that check fires only when
// the caller has said 'native'. A caller that names no engine is asking "is this network sound?",
// which is what the UI asks before it has chosen, and gets the engine-independent answer. The
// alternative, defaulting to 'native', would make EngCalcs.lpnSolveEpanet refuse a network it is
// perfectly able to solve.
EngCalcs.lpnDiagnose = function (model, options) {
	'use strict';
	var opts = options || {},
		fixed = [],
		byId = {},
		adj = {},
		issues = [],
		seen = {},
		queue = [],
		unreachable = [],
		badlyPlacedValves = [],
		i,
		id,
		link,
		node;

	for (i = 0; i < model.nodes.length; i++) {
		node = model.nodes[i];
		byId[node.id] = node;
		adj[node.id] = [];
		if (EngCalcs.lpnIsFixedHead(node)) { fixed.push(node.id); }
	}

	// AN ACTIVE VALVE MAY NOT SIT DIRECTLY ON A RESERVOIR OR A TANK. This is EPANET's own rule
	// (input error 219), and it exists because a PRV/PSV/FCV controls the pressure or flow at a
	// node whose head is already fixed by the vessel -- two boundary conditions on one node, so
	// there is nothing left for the valve to control. Checked for BOTH engines, because it is a
	// fact about the drawing rather than about who solves it, and because EPANET would otherwise
	// report it as a number with no element attached. Put a short pipe between them.
	for (i = 0; i < model.links.length; i++) {
		link = model.links[i];
		// Every type but the throttle: PRV/PSV/FCV are EPANET's rule 219 (project.c valvecheck), and
		// PBV/GPV were refused here before the native solver learnt the first three, and still are.
		if (link.type !== 'valve' || (link.valveType || 'TCV').toUpperCase() === 'TCV') { continue; }
		if ((byId[link.from] && EngCalcs.lpnIsFixedHead(byId[link.from])) ||
			(byId[link.to] && EngCalcs.lpnIsFixedHead(byId[link.to]))) {
			badlyPlacedValves.push(link.id);
		}
	}
	if (badlyPlacedValves.length > 0) {
		issues.push({ code: 'valve-on-fixed-head', ids: badlyPlacedValves });
	}

	// THE TWO VALVE DATA FAULTS (Task 733; Tom, 2026-10-18), refused by name whichever engine is
	// chosen, because EPANET refuses both too: a pair its valvecheck() rule forbids, and a GPV curve
	// it cannot read (see lpnGpvCurveProblem; a one-point curve is solved and said, not refused).
	var conflictMap = EngCalcs.lpnValveConflicts(model), conflictIds = [];
	for (i = 0; i < model.links.length; i++) {
		if (conflictMap[model.links[i].id]) { conflictIds.push(model.links[i].id); }
	}
	if (conflictIds.length > 0) { issues.push({ code: 'valve-conflict', ids: conflictIds }); }
	var badCurves = EngCalcs.lpnGpvsWith(model, 'gpv-order');
	if (badCurves.length > 0) { issues.push({ code: 'gpv-curve-order', ids: badCurves }); }

	if (EngCalcs.lpnDemandModelIsPda(model)) {
		var hy = model.hydraulics, mn = typeof hy.minPressure === 'number' ? hy.minPressure : 0;
		if (typeof hy.reqPressure === 'number' && hy.reqPressure <= mn) {
			issues.push({ code: 'pda-pressures', ids: [] });
		}
	}
	if (opts.engine === 'native' && EngCalcs.lpnDemandModelIsPda(model)) {
		issues.push({ code: 'pda-needs-epanet', ids: [] });
	}

	if (fixed.length === 0) {
		issues.push({ code: 'no-fixed-head', ids: [] });
		return issues;
	}

	for (i = 0; i < model.links.length; i++) {
		link = model.links[i];
		if (link.status === 'closed') { continue; }
		if (!byId[link.from] || !byId[link.to]) {
			issues.push({ code: 'dangling-link', ids: [link.id] });
			continue;
		}
		adj[link.from].push(link.to);
		adj[link.to].push(link.from);
	}

	queue = fixed.slice();
	for (i = 0; i < queue.length; i++) { seen[queue[i]] = true; }
	while (queue.length > 0) {
		id = queue.shift();
		for (i = 0; i < adj[id].length; i++) {
			if (!seen[adj[id][i]]) {
				seen[adj[id][i]] = true;
				queue.push(adj[id][i]);
			}
		}
	}

	for (i = 0; i < model.nodes.length; i++) {
		if (!seen[model.nodes[i].id]) { unreachable.push(model.nodes[i].id); }
	}
	if (unreachable.length > 0) { issues.push({ code: 'unreachable', ids: unreachable }); }

	// NOTHING LEFT TO SOLVE AFTER THE DISCONNECTED NODES WERE LEFT OUT (lpnOmitDisconnected below)
	// is the one case where leaving them out may not stand in for refusing: the answer would be a
	// bare reservoir. Say what the old refusal said, about the nodes that were left out.
	if (model.omitted && model.omitted.length > 0 && model.links.length === 0) {
		issues.push({ code: 'unreachable', ids: model.omitted.slice() });
	}

	return issues;
};

// **A NODE WITH NO PATH TO A FIXED HEAD IS LEFT OUT OF THE RUN, NOT REFUSED** (Tom, 2026-10-09,
// after an Engineers Without Borders meeting: *"Do we have the power to relax this and to simply
// neglect disconnected junctions?"*). Every such node, and every link that touches one, is removed
// from the MODEL, exactly as if it were inactive for this run. The document is never touched, so
// nothing is marked inactive and an .inp export still writes the network as stored. A path runs
// through links that are not closed, the same walk lpnDiagnose() makes, and a pump the clock
// closes counts by its own status (`statusBase`), because being off at an instant is not being cut
// off. `model.omitted` carries the ids for the standing note. With no fixed head at all nothing is
// removed: that is lpnDiagnose()'s no-fixed-head, and every node would be "disconnected" from it,
// which is true and useless. Run it BEFORE lpnDiagnose, in one place, so both engines and the
// extended-period run read the same model.
EngCalcs.lpnOmitDisconnected = function (model) {
	'use strict';
	var byId = {}, adj = {}, seen = {}, queue = [], omitted = [], i, id, link, st, keep;
	model.omitted = [];
	for (i = 0; i < model.nodes.length; i++) {
		byId[model.nodes[i].id] = model.nodes[i];
		adj[model.nodes[i].id] = [];
		if (EngCalcs.lpnIsFixedHead(model.nodes[i])) { queue.push(model.nodes[i].id); seen[model.nodes[i].id] = true; }
	}
	if (queue.length === 0) { return model; }
	for (i = 0; i < model.links.length; i++) {
		link = model.links[i];
		st = Object.prototype.hasOwnProperty.call(link, 'statusBase') ? link.statusBase : link.status;
		if (st === 'closed' || !byId[link.from] || !byId[link.to]) { continue; }
		adj[link.from].push(link.to);
		adj[link.to].push(link.from);
	}
	for (i = 0; i < queue.length; i++) {
		id = queue[i];
		adj[id].forEach(function (nb) { if (!seen[nb]) { seen[nb] = true; queue.push(nb); } });
	}
	for (i = 0; i < model.nodes.length; i++) {
		if (!seen[model.nodes[i].id]) { omitted.push(model.nodes[i].id); }
	}
	if (omitted.length === 0) { return model; }
	keep = {};
	model.nodes.forEach(function (n) { if (seen[n.id]) { keep[n.id] = true; } });
	model.nodes = model.nodes.filter(function (n) { return keep[n.id]; });
	// A link whose end is a node that was never in the model stays: that is a dangling-link,
	// which lpnDiagnose() reports by name.
	model.links = model.links.filter(function (l) {
		return !((byId[l.from] && !keep[l.from]) || (byId[l.to] && !keep[l.to]));
	});
	model.omitted = omitted;
	return model;
};

// Solves the network. Returns
//   { ok, issues, iterations, converged, heads: {id: m}, flows: {id: m3/s},
//     headlosses: {id: m}, velocities: {id: m/s}, maxFlowChange }
// All SI.
EngCalcs.lpnSolve = function (model, options) {
	'use strict';
	var opts = options || {},
		method = model.method || 'hw',
		visc = model.visc || 1.007e-6,
		// Relative flow change. EPANET's default is 1e-3; this is far tighter
		// because at the 10-20 node target the extra iterations are free, and
		// because Darcy-Weisbach carries an additional inconsistency of the same
		// order: its friction factor is frozen at the previous iteration's flow, so
		// the head loss implied by the final f lags the final Q by O(tol).
		tol = opts.tol || 1e-9,
		absTol = opts.absTol || 1e-12,
		// At the 10-20 node target a solve takes 5-9 iterations, so this cap is not
		// about the target at all -- it is headroom. A 200-node grid measured 61
		// iterations, because a regular grid puts many links near zero flow where
		// the gradient floor applies and Newton degrades to linear convergence.
		// A cap of 60 would have failed that network by one iteration.
		// **AND A PROJECT MAY STATE ITS OWN** (Task 553): EPANET's `[OPTIONS] Trials` is exactly this
		// number, so a file that names one is honoured here rather than only in the other engine.
		// Absent, the 100 above stands, which is what every project without an `.inp` behind it has
		// always used.
		maxIter = opts.maxIter || (model.hydraulics && model.hydraulics.trials) || 100,
		qMin = EngCalcs.lpnQMin,
		gradMin = EngCalcs.lpnGradMin,
		emitterExp = model.emitterExponent || 0.5,
		g = EngCalcs.lpnG,
		nodes = model.nodes,
		links = model.links,
		byId = {},
		junctionIndex = {},
		junctions = [],
		issues,
		Q = [],
		H = [],
		nn,
		iter,
		converged = false,
		maxFlowChange = Infinity,
		bestChange = Infinity,
		stall = 0,
		demandScale = 0,
		i,
		j2,
		k;

	// 'native' names THIS file, so lpnDiagnose adds the one check that is about this engine's
	// limits rather than about the network: a pressure-driven demand model. See its comment.
	issues = EngCalcs.lpnDiagnose(model, { engine: 'native' });
	if (issues.length > 0) {
		return { ok: false, issues: issues, converged: false, iterations: 0 };
	}

	for (i = 0; i < nodes.length; i++) {
		byId[nodes[i].id] = nodes[i];
		if (!EngCalcs.lpnIsFixedHead(nodes[i])) {
			junctionIndex[nodes[i].id] = junctions.length;
			junctions.push(nodes[i]);
		}
	}
	nn = junctions.length;

	for (i = 0; i < nn; i++) { demandScale += Math.abs(junctions[i].demand || 0); }

	// Initial guess. Any nonzero flow works because of the gradient floor; a
	// velocity-scaled seed simply starts closer than a constant would.
	for (k = 0; k < links.length; k++) {
		Q[k] = links[k].status === 'closed'
			? 0
			: 0.3 * Math.PI * links[k].diameter * links[k].diameter / 4;
	}
	// Junction heads start at their own elevation; only emitters read H before the
	// first solve, and they need something physical rather than zero.
	for (i = 0; i < nn; i++) { H[i] = junctions[i].elev || 0; }

	// THE SYSTEM'S SHAPE DOES NOT CHANGE BETWEEN NEWTON ITERATIONS, so its storage is allocated
	// once per solve and reused. This used to be four fresh typed arrays per iteration, of which A
	// is nn x nn -- 225 allocations totalling 405 KB on every one of a 225-junction network's 13
	// iterations, which is 2,925 allocations per solve and 3,707 solves in one fire-flow sweep.
	// Measured on its own at 225 junctions: 0.65 ms to allocate the matrix against 0.018 ms to
	// zero the reused one, a 35x difference, and after the envelope factorization landed this
	// allocation was two thirds of a solve.
	//
	// A is zeroed each iteration because it is ACCUMULATED into (`+=` per link); F likewise. G and
	// y are not, because every link writes both on every iteration in both branches. `fill(0)`
	// writes +0.0, which is what a fresh Float64Array holds, so nothing about the arithmetic
	// changes -- and that is asserted, not assumed (dev/lpn-spike/spd-envelope-harness.js compares
	// every reported number against the dense reference).
	//
	// AND THE MATRIX IS THE ENVELOPE ITSELF, not a square filled mostly with zeros. Once the
	// factorization stopped touching the zeros, the two things still SIZED by nn squared were
	// zeroing the square each iteration and re-deriving the envelope from it -- at 961 junctions
	// that is 924,000 writes and 460,000 comparisons per iteration against 462,000 useful
	// multiply-adds, so the overhead had become bigger than the work. Assembling straight into
	// the packed band makes both proportional to the network's own connectivity instead.
	//
	// THE PATTERN COMES FROM THE LINK LIST, which is where it actually lives: junction i's row can
	// only be nonzero at itself and at the junctions it shares a link with. A CLOSED link is
	// counted too. Its conductance is zero so it contributes nothing numerically, but leaving it
	// in keeps the pattern the same whatever a valve is doing, and a WIDER envelope is always safe
	// -- the extra entries are exactly the zeros the dense reference also computes.
	var F = new Float64Array(nn),
		G = new Float64Array(links.length),
		y = new Float64Array(links.length),
		linkR = new Float64Array(links.length),
		linkN = new Float64Array(links.length),
		linkM = new Float64Array(links.length),
		resFixed = method !== 'dw',
		envFirst = new Int32Array(nn),
		env,
		M,
		envDiag,
		envRowStart,
		resK,
		aKm,
		aArea,
		lo,
		hi;

	for (i = 0; i < nn; i++) { envFirst[i] = i; }
	for (k = 0; k < links.length; k++) {
		i = junctionIndex[links[k].from];
		j2 = junctionIndex[links[k].to];
		if (i === undefined || j2 === undefined) { continue; }
		lo = i < j2 ? i : j2;
		hi = i < j2 ? j2 : i;
		if (lo < envFirst[hi]) { envFirst[hi] = lo; }
	}
	env = EngCalcs.lpnEnvelope(envFirst, nn);
	envDiag = env.diag;
	envRowStart = env.rowStart;
	M = new Float64Array(env.total);

	// WHAT DOES NOT DEPEND ON THE FLOW IS COMPUTED ONCE, not once per Newton iteration.
	//
	// A link's resistance r and its minor-loss coefficient m are functions of its GEOMETRY --
	// length, diameter, roughness -- and the flow appears nowhere in either. Under Hazen-Williams
	// each one costs two Math.pow calls and an object allocation, and the old code paid all of
	// that for every link on every iteration: 421 links x 13 iterations is 5,473 repeats of an
	// answer that never changed, on each of a sweep's 3,707 solves.
	//
	// DARCY-WEISBACH IS THE EXCEPTION AND IT IS NOT AN OVERSIGHT. Its friction factor f is a
	// function of the Reynolds number, so r genuinely moves with the flow and has to be re-formed
	// each iteration -- see the note on lpnResistance. `resFixed` is that distinction, stated
	// once, so it cannot be half-applied.
	//
	// Identical arithmetic, so identical bits: the same expressions on the same inputs, evaluated
	// fewer times. dev/lpn-spike/spd-envelope-harness.js compares every reported number against
	// the unmodified reference and would see any drift.
	for (k = 0; k < links.length; k++) {
		aKm = EngCalcs.lpnLinkK(links[k]);
		aArea = Math.PI * links[k].diameter * links[k].diameter / 4;
		// Written with the same operations in the same order as the line it replaces, Math.pow
		// and all. `aArea * aArea` would be one rounding away, which is exactly the kind of
		// "obviously the same" edit that turns a bit-identical change into a tolerance-grade one.
		linkM[k] = aKm > 0 ? aKm / (2 * g * Math.pow(aArea, 2)) : 0;
		if (resFixed) {
			resK = EngCalcs.lpnResistance(links[k], method, visc);
			linkR[k] = resK.r;
			linkN[k] = resK.n;
		}
	}

	// ---- CONTROL VALVES (Task 733, phase 1) ---------------------------------------------------
	//
	// A PRV, PSV or FCV that the user has not closed starts ACTIVE, as EPANET starts it
	// (hydraul.c inithyd(): "Start active control valves in ACTIVE position"). From there its state
	// is one of EPANET's five, by the same names: 'active', 'open', 'closed' (closed BY THE SOLVE,
	// against reverse flow -- not the user's Closed, which never reaches this list and is skipped
	// like any closed link), 'xpressure' (a PRV/PSV that made the matrix singular and was forced
	// open, hydsolver.c badvalve()) and 'xfcv' (an FCV that cannot pass its setting, or has head
	// against it, and is acting as an open valve).
	//
	// EPANET WORKS IN FEET AND CFS, so each of its constants is converted here, once, by the unit it
	// carries, and the arithmetic below is EPANET's in SI. The two BIGs are conductances (cfs per
	// ft), the two smalls are resistances (ft per cfs), the tolerances a head and a flow.
	var vStat = [], vc = [], vSet = [], vHset = [],
		hydIn = model.hydraulics || {},
		VFT = 0.3048,
		VCFS = VFT * VFT * VFT,
		V_CBIG = 1e8 * VCFS / VFT,          // hydcoeffs.c CBIG, as the penalty that pins a head
		V_CBIG_INV = 1e-8 * VCFS / VFT,     // 1/CBIG, the conductance of a closed valve
		V_CSMALL = 1e-6 * VFT / VCFS,       // hydcoeffs.c CSMALL, an open valve with no minor loss
		V_RQTOL = 1e-7 * VFT / VCFS,        // input1.c RQTOL, the floor on a valve's loss gradient
		V_HTOL = 0.0005 * VFT,              // input1.c HTOL
		V_QTOL = 0.0001 * VCFS,             // input1.c QTOL
		checkFreq = typeof hydIn.checkFreq === 'number' && hydIn.checkFreq > 0 ? hydIn.checkFreq : 2,
		maxCheck = typeof hydIn.maxCheck === 'number' ? hydIn.maxCheck : 10,
		dampLimit = typeof hydIn.dampLimit === 'number' && hydIn.dampLimit > 0 ? hydIn.dampLimit : 0,
		nextCheck = checkFreq,
		relax = 1,
		X = null;
	for (k = 0; k < links.length; k++) {
		if (links[k].status === 'closed' || !EngCalcs.lpnValveIsControl(links[k])) { continue; }
		vStat[k] = 'active';
		vc.push(k);
		vSet[k] = links[k].setting || 0;
		// A PRV holds the head at its DOWNSTREAM node, a PSV at its UPSTREAM one, each at that
		// node's elevation plus the setting (hydstatus.c valvestatus(), hydcoeffs.c prvcoeff() and
		// psvcoeff()). The setting is in metres of head as stored, exactly what lpnToInp writes
		// under `Units LPS`, whose pressure unit EPANET does not scale by specific gravity
		// (input1.c: under METERS the pressure factor is MperFT alone).
		var vt0 = String(links[k].valveType).toUpperCase();
		if (vt0 === 'PRV') { vHset[k] = (byId[links[k].to].elev || 0) + vSet[k]; }
		if (vt0 === 'PSV') { vHset[k] = (byId[links[k].from].elev || 0) + vSet[k]; }
		// EPANET's first guess for a valve: the flow at 1 ft/s (hydraul.c initlinkflow()).
		Q[k] = Math.PI * links[k].diameter * links[k].diameter / 4 * VFT;
	}
	if (vc.length) { X = new Float64Array(nn); }

	// ---- PBV AND GPV (Task 733, phase 2) ------------------------------------------------------
	//
	// NEITHER HAS A STATE TO SWITCH. EPANET's hydstatus.c never examines a PBV or a GPV, and its
	// hydcoeffs.c headlosscoeffs() assembles both in the ordinary link loop, beside the pipes --
	// not in valvecoeffs(), which is for the three whose flow comes from the node balance. So they
	// are assembled here in link order too, and they count in X like any pipe. What a PBV does
	// differ on, iteration by iteration, is WHICH LAW applies, and pbvcoeff() decides that from the
	// flow at the start of the iteration; fStat records the answer, for the report.
	//
	// The user's Closed is the main loop's, as for every link: G = 0 and skipped. EPANET puts
	// 1/CBIG there instead (valvecoeff(), "Valve is closed"); phase 1 measured the two agreeing on
	// a closed PRV and FCV to the last reported digit, and the same harness case holds it here.
	var fStat = [], gpvX = [], gpvY = [],
		V_TINY_Q = 1e-6 * VCFS,            // types.h TINY, as gpvcoeff() floors the flow (cfs)
		V_TINY_R = 1e-6 * VFT / VCFS;      // ...and as it floors the curve's slope (ft per cfs)
	for (k = 0; k < links.length; k++) {
		if (links[k].status === 'closed' || !EngCalcs.lpnValveIsFixedLaw(links[k])) { continue; }
		if (String(links[k].valveType).toUpperCase() === 'GPV') {
			fStat[k] = 'open';
			// No points: the open TCV js/lpn-epanet.js hands EPANET (see lpnGpvCurveProblem), so
			// gpvCoeff() below sees an empty curve. One point: the line through the origin and it.
			var gpts = (links[k].curvePoints || []).slice();
			if (gpts.length === 1) { gpts.unshift([0, 0]); }
			gpvX[k] = gpts.map(function (pt) { return pt[0]; });
			gpvY[k] = gpts.map(function (pt) { return pt[1]; });
		} else {
			fStat[k] = 'active';
		}
		// The same first guess as every EPANET valve: 1 ft/s (hydraul.c initlinkflow()).
		Q[k] = Math.PI * links[k].diameter * links[k].diameter / 4 * VFT;
	}

	// hydcoeffs.c pbvcoeff(). A setting of zero is EPANET's "fixed OPEN or CLOSED" branch and an
	// ordinary open valve. Otherwise, while the valve's own fully-open minor loss Km Q^2 would
	// take out MORE than the setting it is just an open valve; below that it forces the head drop
	// from its start node to its end node to equal the setting: P = CBIG, Y = setting x CBIG, so
	// the flow update Q - Y + P (H1 - H2) pins H1 - H2 to the setting. That drop is UNSIGNED --
	// EPANET's Y carries no SGN(flow) -- so with the water running backwards the valve still
	// holds its start node above its end node by the setting, and the harness holds us to that.
	function pbvCoeff(k2) {
		var setting = links[k2].setting || 0, q2 = Q[k2];
		if (setting === 0 || linkM[k2] * q2 * q2 > setting) {
			valveOpenCoeff(k2);
			fStat[k2] = 'open';
			return;
		}
		G[k2] = V_CBIG;
		y[k2] = setting * V_CBIG;
		fStat[k2] = 'active';
	}

	// hydcoeffs.c gpvcoeff() with curvecoeff(): the straight segment of the head-loss curve that
	// brackets |Q| -- the first segment below the curve, the last above it -- linearized at |Q|,
	// with EPANET's two TINY floors. P = 1/r and Y = (h0/r + |Q|) sgn(Q), where h0 + r|Q| is the
	// segment's head loss: the curve read the same both ways, the loss signed with the flow. An
	// open GPV's minor-loss column plays no part (gpvcoeff never reads Km); EPANET's SGN() of a
	// zero flow is +1, and so is this one's.
	function gpvCoeff(k2) {
		var xs = gpvX[k2], ys = gpvY[k2], npts = xs.length, q2 = Math.abs(Q[k2]), k1, kk = 0, r, h0;
		// A curveless GPV is EPANET's open TCV at zero loss: hydcoeffs.c tcvcoeff() sets Km = 0 and
		// valvecoeff() then gives the low-resistance line P = 1/CSMALL, Y = Q.
		if (npts === 0) { G[k2] = 1 / V_CSMALL; y[k2] = Q[k2]; return; }
		if (q2 < V_TINY_Q) { q2 = V_TINY_Q; }
		while (kk < npts && xs[kk] < q2) { kk++; }
		if (kk === 0) { kk++; } else if (kk === npts) { kk--; }
		k1 = kk - 1;
		r = (ys[kk] - ys[k1]) / (xs[kk] - xs[k1]);
		h0 = ys[k1] - r * xs[k1];
		if (!(r >= V_TINY_R)) { r = V_TINY_R; }
		G[k2] = 1 / r;
		y[k2] = (h0 / r + q2) * (Q[k2] < 0 ? -1 : 1);
	}

	// One off-diagonal write, with the self-loop case the main assembly also handles.
	function addOff(a, b, val) {
		if (a === b) { M[envDiag[a]] -= 2 * val; return; }
		var l0 = a < b ? a : b, h0 = a < b ? b : a;
		M[envRowStart[h0] - envFirst[h0] + l0] -= val;
	}

	// hydcoeffs.c valvecoeff(): a valve that is not holding anything -- open, closed by the solve,
	// or forced open -- is a plain minor loss Km Q^2, with EPANET's own floors.
	function valveOpenCoeff(k2) {
		var q2 = Q[k2], km = linkM[k2], hg, hl;
		if (vStat[k2] === 'closed') { G[k2] = V_CBIG_INV; y[k2] = q2; return; }
		if (km > 0) {
			hg = 2 * km * Math.abs(q2);
			if (hg < V_RQTOL) { hg = V_RQTOL / 2; hl = q2 * hg; } else { hl = q2 * hg / 2; }
			G[k2] = 1 / hg;
			y[k2] = hl / hg;
		} else {
			G[k2] = 1 / V_CSMALL;
			y[k2] = q2;
		}
	}

	// hydcoeffs.c valvecoeffs(), prvcoeff(), psvcoeff(), fcvcoeff(): called AFTER every other link,
	// demand and emitter is in, because an active PRV or PSV takes its flow from what the rest of
	// the network leaves at its node (X, EPANET's Xflow). In valve order, as EPANET's Valve[] is,
	// because an active FCV moves X for the valves after it.
	function valveCoeffs() {
		var v, k2, lk, i2, j2b, st, t, q2, qs;
		for (v = 0; v < vc.length; v++) {
			k2 = vc[v];
			lk = links[k2];
			i2 = junctionIndex[lk.from];
			j2b = junctionIndex[lk.to];
			st = vStat[k2];
			t = String(lk.valveType).toUpperCase();
			q2 = Q[k2];
			if (st === 'active' && t === 'PRV') {
				// Pin the downstream head to the setting and pass whatever that node is short of.
				G[k2] = 0;
				y[k2] = q2 + X[j2b];
				F[j2b] += vHset[k2] * V_CBIG;
				M[envDiag[j2b]] += V_CBIG;
				if (X[j2b] < 0) { F[i2] += X[j2b]; }
				continue;
			}
			if (st === 'active' && t === 'PSV') {
				// Pin the upstream head and pass whatever that node has to spare.
				G[k2] = 0;
				y[k2] = q2 - X[i2];
				F[i2] += vHset[k2] * V_CBIG;
				M[envDiag[i2]] += V_CBIG;
				if (X[i2] > 0) { F[j2b] += X[i2]; }
				addOff(i2, j2b, V_CBIG_INV);   // "Preserve connectivity"
				M[envDiag[j2b]] += V_CBIG_INV;
				continue;
			}
			if (st === 'active' && t === 'FCV') {
				// Break the network at the valve: the setting leaves the upstream node as a demand
				// and arrives at the downstream one as a supply.
				qs = vSet[k2];
				X[i2] -= qs;
				X[j2b] += qs;
				y[k2] = q2 - qs;
				F[i2] -= qs;
				F[j2b] += qs;
				G[k2] = V_CBIG_INV;
				addOff(i2, j2b, G[k2]);
				M[envDiag[i2]] += G[k2];
				M[envDiag[j2b]] += G[k2];
				continue;
			}
			valveOpenCoeff(k2);
			addOff(i2, j2b, G[k2]);
			M[envDiag[i2]] += G[k2];
			M[envDiag[j2b]] += G[k2];
			F[i2] += (y[k2] - q2);
			F[j2b] -= (y[k2] - q2);
		}
	}

	function headAt(id, Hv) {
		var ix = junctionIndex[id];
		return ix === undefined ? byId[id].head : Hv[ix];
	}

	// hydstatus.c prvstatus() / psvstatus(), through valvestatus(): checked after EVERY iteration
	// (DampLimit 0, EPANET's default), with the heads and flows just solved for.
	function pressureValveStatus(Hv) {
		var change = false, v, k2, lk, t, s0, s1, h1, h2, hset, hml, q2;
		for (v = 0; v < vc.length; v++) {
			k2 = vc[v];
			lk = links[k2];
			t = String(lk.valveType).toUpperCase();
			if (t !== 'PRV' && t !== 'PSV') { continue; }
			s0 = vStat[k2];
			s1 = s0;
			h1 = headAt(lk.from, Hv);
			h2 = headAt(lk.to, Hv);
			hset = vHset[k2];
			q2 = Q[k2];
			hml = linkM[k2] * q2 * q2;   // head loss when fully open
			if (t === 'PRV') {
				if (s0 === 'active') {
					if (q2 < -V_QTOL) { s1 = 'closed'; } else if (h1 - hml < hset - V_HTOL) { s1 = 'open'; }
				} else if (s0 === 'open') {
					if (q2 < -V_QTOL) { s1 = 'closed'; } else if (h2 >= hset + V_HTOL) { s1 = 'active'; }
				} else if (s0 === 'closed') {
					if (h1 >= hset + V_HTOL && h2 < hset - V_HTOL) { s1 = 'active'; }
					else if (h1 < hset - V_HTOL && h1 > h2 + V_HTOL) { s1 = 'open'; }
				} else if (s0 === 'xpressure') {
					if (q2 < -V_QTOL) { s1 = 'closed'; }
				}
			} else {
				if (s0 === 'active') {
					if (q2 < -V_QTOL) { s1 = 'closed'; } else if (h2 + hml > hset + V_HTOL) { s1 = 'open'; }
				} else if (s0 === 'open') {
					if (q2 < -V_QTOL) { s1 = 'closed'; } else if (h1 < hset - V_HTOL) { s1 = 'active'; }
				} else if (s0 === 'closed') {
					if (h2 > hset + V_HTOL && h1 > h2 + V_HTOL) { s1 = 'open'; }
					else if (h1 >= hset + V_HTOL && h1 > h2 + V_HTOL) { s1 = 'active'; }
				} else if (s0 === 'xpressure') {
					if (q2 < -V_QTOL) { s1 = 'closed'; }
				}
			}
			if (s1 !== s0) { vStat[k2] = s1; change = true; }
		}
		return change;
	}

	// hydstatus.c fcvstatus(), through linkstatus(): checked every CheckFreq iterations up to
	// MaxCheck, and again whenever the solve has converged.
	function flowValveStatus(Hv) {
		var change = false, v, k2, lk, s0, s1, dh, q2;
		for (v = 0; v < vc.length; v++) {
			k2 = vc[v];
			lk = links[k2];
			if (String(lk.valveType).toUpperCase() !== 'FCV') { continue; }
			s0 = vStat[k2];
			s1 = s0;
			dh = headAt(lk.from, Hv) - headAt(lk.to, Hv);
			q2 = Q[k2];
			if (dh < -V_HTOL) { s1 = 'xfcv'; }
			else if (q2 < -V_QTOL) { s1 = 'xfcv'; }
			else if (s0 === 'xfcv' && q2 >= vSet[k2]) { s1 = 'active'; }
			// "Active valve's loss coeff. can't be < fully open loss coeff."
			else if (s1 === 'active' && dh / (q2 * q2) < linkM[k2]) { s1 = 'xfcv'; }
			if (s1 !== s0) { vStat[k2] = s1; change = true; }
		}
		return change;
	}

	// hydsolver.c badvalve(): the factorization broke at junction row `row`. If the FIRST valve
	// touching that node is an active PRV, PSV or FCV, its setting is what made the equations
	// inconsistent; it is forced open and the iteration is repeated. Otherwise the network is
	// singular for some other reason and the solve stops, as EPANET's does.
	function badValve(row) {
		var id = junctions[row] && junctions[row].id, k2, lk;
		for (k2 = 0; k2 < links.length; k2++) {
			lk = links[k2];
			if (lk.type !== 'valve' || (lk.from !== id && lk.to !== id)) { continue; }
			if (vStat[k2] === 'active') {
				vStat[k2] = String(lk.valveType).toUpperCase() === 'FCV' ? 'xfcv' : 'xpressure';
				return true;
			}
			return false;
		}
		return false;
	}

	for (iter = 1; iter <= maxIter; iter++) {
		var link,
			res,
			q,
			aq,
			p,
			h,
			iIdx,
			jIdx,
			Hnew,
			dq,
			sumAbsDq = 0,
			sumAbsQ = 0,
			done = false,
			valveChange = false;

		M.fill(0);
		F.fill(0);
		if (X !== null) { X.fill(0); }

		for (k = 0; k < links.length; k++) {
			link = links[k];
			if (link.status === 'closed') { G[k] = 0; y[k] = 0; continue; }
			// A control valve is assembled after everything else -- see valveCoeffs().
			if (vStat[k] !== undefined) { continue; }

			q = Q[k];
			aq = Math.abs(q);

			if (link.type === 'pump') {
				// Head GAIN: H_to - H_from = H0 - a Q^b, so h = -(H0 - a Q^b).
				var qp = Math.max(aq, qMin);
				if (!(link.h0 > 0) && !(link.a > 0)) {
					// NO CURVE ENTERED -- the state every newly drawn pump is in, since nothing
					// assigns a pump a curve it was not given. It neither adds nor loses head, in
					// EITHER direction, so it is a plain lossless connection: the same gradient
					// floor the pipe branch below uses, with h = p*q ~ 0.
					// Handled BEFORE the backwards check on purpose. Without a curve there is no
					// "backwards" to guard against, and routing it through that check produced a
					// visible artifact: with zero net demand the flow settles at ~1e-10, which
					// wanders negative, and the check's near-zero G = 1e-8 then floats the
					// downstream junction ~0.1 ft off the reservoir's head for no physical reason.
					p = gradMin;
					h = p * q;
					G[k] = 1 / p;
					y[k] = h / p;
				} else if (q < 0) {
					// A pump WITH a curve, pushed backwards, is treated as closed for this iteration.
					G[k] = 1e-8;
					y[k] = 0;
				} else {
					h = -(link.h0 - link.a * Math.pow(qp, link.b));
					p = link.a * link.b * Math.pow(qp, link.b - 1);
					// Same floor again, for a degenerate curve (e.g. a shutoff head with no droop):
					// p = 0 would otherwise give an infinite conductance.
					if (!(p > gradMin)) { p = gradMin; h = p * q; }
					G[k] = 1 / p;
					y[k] = h / p;
				}
			} else if (fStat[k] !== undefined) {
				// A PBV or a GPV: no friction (it has no length) and its own law, from above.
				if (String(link.valveType).toUpperCase() === 'PBV') { pbvCoeff(k); } else { gpvCoeff(k); }
			} else {
				if (!resFixed) {
					link.f = EngCalcs.lpnDwFriction(Math.max(aq, qMin), link.diameter, link.roughness, visc);
					res = EngCalcs.lpnResistance(link, method, visc);
					linkR[k] = res.r;
					linkN[k] = res.n;
				}
				// A VALVE ARRIVES HERE, and needs no branch of its own: lpnResistance returns
				// r = 0 for a zero-length link, so the friction term vanishes and what is left is
				// exactly the minor loss -- which is what a throttle valve IS. lpnLinkK() is the
				// one place that reads a TCV's loss out of its setting rather than out of k, and
				// it is read above the loop now because a setting does not change during a solve.
				var rk = linkR[k],
					nk = linkN[k],
					m = linkM[k],
					// Q^(n-1) appears in both the head loss and its derivative and was raised
					// twice. One Math.pow, two uses, same value.
					pw = Math.pow(aq, nk - 1);

				h = rk * pw * q + m * aq * q;
				p = nk * rk * pw + 2 * m * aq;
				if (!(p > gradMin)) {
					// Below the gradient floor the relation is replaced by a straight
					// line of that slope through the origin, so h and p stay
					// consistent with each other.
					p = gradMin;
					h = p * q;
				}
				G[k] = 1 / p;
				y[k] = h / p;
			}

			// Assemble. Derivation in the scope doc; the identity used here is
			//   Q_k = (Q_k^0 - y_k) + G_k (H_from - H_to)
			// substituted into continuity at each junction.
			iIdx = junctionIndex[link.from];
			jIdx = junctionIndex[link.to];
			if (X !== null) {
				if (iIdx !== undefined) { X[iIdx] -= Q[k]; }
				if (jIdx !== undefined) { X[jIdx] += Q[k]; }
			}

			if (iIdx !== undefined) {
				M[envDiag[iIdx]] += G[k];
				F[iIdx] -= (Q[k] - y[k]);
			}
			if (jIdx !== undefined) {
				M[envDiag[jIdx]] += G[k];
				F[jIdx] += (Q[k] - y[k]);
			}
			if (iIdx !== undefined && jIdx !== undefined) {
				// ONE write, not two: the factorization reads only the lower triangle, and the
				// upper half of a symmetric matrix was never anything but storage.
				//
				// UNLESS THE LINK IS A SELF-LOOP, in which case the two writes the dense form made
				// were to the SAME cell and both have to survive. A pipe drawn from a junction
				// back to itself is nonsense hydraulically and cancels to nothing either way, but
				// "either way" is the claim being made here, and it is only true if this branch
				// exists. Nothing rejects such a link upstream.
				if (iIdx === jIdx) {
					M[envDiag[iIdx]] -= G[k];
					M[envDiag[iIdx]] -= G[k];
				} else {
					lo = iIdx < jIdx ? iIdx : jIdx;
					hi = iIdx < jIdx ? jIdx : iIdx;
					M[envRowStart[hi] - envFirst[hi] + lo] -= G[k];
				}
			} else if (iIdx !== undefined) {
				F[iIdx] += G[k] * byId[link.to].head;
			} else if (jIdx !== undefined) {
				F[jIdx] += G[k] * byId[link.from].head;
			}
		}

		for (i = 0; i < nn; i++) {
			F[i] -= (junctions[i].demand || 0);
			if (junctions[i].emitter > 0) {
				// Outflow C (H - z)^gamma, linearized about the current head.
				var dh = Math.max(H[i] - (junctions[i].elev || 0), 0),
					qe = junctions[i].emitter * Math.pow(dh, emitterExp),
					ge = dh > qMin
						? emitterExp * junctions[i].emitter * Math.pow(dh, emitterExp - 1)
						: junctions[i].emitter;
				M[envDiag[i]] += ge;
				F[i] += ge * H[i] - qe;
				if (X !== null) { X[i] -= qe; }
			}
			if (X !== null) { X[i] -= (junctions[i].demand || 0); }
		}
		if (X !== null) { valveCoeffs(); }

		var failAt = {};
		Hnew = EngCalcs.lpnSolvePacked(env, M, F, failAt);
		if (Hnew === null && X !== null && failAt.row !== undefined && badValve(failAt.row)) {
			// EPANET `continue`s without counting the trial; so does this.
			X.fill(0);
			iter--;
			continue;
		}
		if (Hnew === null) {
			return {
				ok: false,
				issues: [{ code: 'singular', ids: [] }],
				converged: false,
				iterations: iter
			};
		}

		for (k = 0; k < links.length; k++) {
			link = links[k];
			if (link.status === 'closed') { continue; }
			iIdx = junctionIndex[link.from];
			jIdx = junctionIndex[link.to];
			var hi = iIdx === undefined ? byId[link.from].head : Hnew[iIdx],
				hj = jIdx === undefined ? byId[link.to].head : Hnew[jIdx],
				qNew = (Q[k] - y[k]) + G[k] * (hi - hj);
			dq = qNew - Q[k];
			// EPANET's RelaxFactor (hydsolver.c newlinkflows()): 1 unless the project states a
			// DampLimit and the solve is already within it. Applied only then, so every network
			// without one does exactly the arithmetic it always did.
			if (relax !== 1) { dq *= relax; qNew = Q[k] + dq; }
			sumAbsDq += Math.abs(dq);
			sumAbsQ += Math.abs(qNew);
			Q[k] = qNew;
		}

		H = Hnew;
		// Normalised by the network's TOTAL DEMAND, not by the current total flow.
		// Total flow is the wrong yardstick twice over: it grows with the number of
		// links, so the same physical accuracy reads as a different number on a
		// bigger network, and it shrinks alongside the change itself when the
		// solution decays toward zero, which makes the ratio constant and hides
		// progress entirely. Total demand is fixed, physical, and comparable.
		maxFlowChange = demandScale > 0 ? sumAbsDq / demandScale : sumAbsDq;

		if (opts.onIteration) { opts.onIteration(iter, maxFlowChange, Q, H); }

		// absTol catches the no-flow network, where demandScale is zero and
		// maxFlowChange is therefore already an absolute quantity. 1e-12 m3/s is a
		// nanolitre per second.
		// THE PRESSURE VALVES ARE RE-DECIDED EVERY ITERATION, before convergence is judged
		// (hydsolver.c hydsolve()), so a state change on the iteration that would have converged
		// keeps the solve going. EPANET's relative error is its own, total change over total flow,
		// and it is read here only against a stated DampLimit.
		if (X !== null) {
			var relErrE = sumAbsQ > 0 ? sumAbsDq / sumAbsQ : sumAbsDq;
			relax = 1;
			valveChange = false;
			if (dampLimit > 0) {
				if (relErrE <= dampLimit) { relax = 0.6; valveChange = pressureValveStatus(H); }
			} else {
				valveChange = pressureValveStatus(H);
			}
		}

		if (maxFlowChange < tol || sumAbsDq < absTol) { done = true; }

		// Stagnation. Newton converges quadratically until it reaches the roundoff
		// floor of the factorization, then stops improving -- measured on a
		// 201-node grid: 8e-1, 8e-2, 4e-3, 3e-5, 2e-7, 2e-8, then a plateau at ~5e-8
		// forever. Without this the solver would spend 100 iterations and 330 ms
		// reaching the answer it already had at iteration 6, on every keystroke.
		//
		// The ABSOLUTE change has to be negligible too, and that second condition is
		// not belt-and-braces -- without it this check is actively wrong. A network
		// with every demand zero (again: the state a network is in while being drawn)
		// starts with a circulation in each loop that decays geometrically to zero.
		// Both the change and the flow shrink together, so the RELATIVE measure sits
		// at a constant 1.174 forever while the flows are still falling by half every
		// iteration. Judged on that alone the solver would stop after 7 iterations and
		// report a circulating 0.04 L/s in a network with no demand at all.
		// **THE NEGLIGIBILITY GATE IS RELATIVE TO THE NETWORK'S OWN FLOW SCALE, AND IT IS EPANET'S
		// OWN DEFAULT ACCURACY.** It used to read `sumAbsDq < 1e-6 * demandScale`, i.e. "and we are
		// already within 1e-6 relative" -- a hardcoded number that is not reachable on every
		// network, and when it is not, this escape never fires and a perfectly good answer is
		// reported as a failure.
		//
		// Measured on Elm Street Center with its two 750 gpm demands set to 0 (Tom, 2026-08-17,
		// "it can't solve the loop... but the EPANET solver works"): Newton reaches 3e-6 relative by
		// iteration 7 and then sits on a NOISY plateau between 3e-6 and 1.2e-5 forever. The
		// remaining imbalance is 1.4e-7 m3/s -- 0.002 gpm, against 460 gpm of demand. It ran to 100
		// iterations and told the user their network was impossible. Zeroing a demand is not what
		// broke it: it lowered demandScale by 4x, which is a 4x rise in every RELATIVE measure,
		// and 1e-6 happened to sit between the old plateau and the new one.
		//
		// The floor is roundoff in the factorization and is network-dependent -- ill
		// conditioning from the zero-flow links' clamped gradient (lpnGradMin), which EPANET has
		// too. So no fixed number is right, and the honest test is a COMPARISON: we have stopped
		// improving, and we are already at least as converged as EPANET's own default Accuracy
		// (0.001) would demand before it stopped. A network that is genuinely oscillating -- Net3's
		// pipe 333 swinging between 0 and -2.28 gpm, the case lpnGradMin exists for -- is orders of
		// magnitude above this and is still reported as a failure.
		//
		// SCALE, not demand, because a zero-demand network must still be judged against something:
		// the largest flow in it. Using demandScale alone left `sumAbsDq < absTol` (1e-12 m3/s) as
		// the only route, which no network reaches. This cannot resurrect the decaying-circulation
		// mistake the comment above describes -- that case never gets here, because its absolute
		// change is still halving every iteration, so `stall` never accumulates.
		if (done) {
			// (nothing: judged below)
		} else if (maxFlowChange < bestChange * 0.999) {
			bestChange = maxFlowChange;
			stall = 0;
		} else if (++stall >= 5) {
			var qMax = 0;
			for (k = 0; k < Q.length; k++) { qMax = Math.max(qMax, Math.abs(Q[k])); }
			// **A NETWORK AT REST IS SOLVED, and its plateau is a limit cycle around zero.** With
			// no demand anywhere the flows decay to nothing, and once they are down at the
			// factorization's roundoff floor they jitter about zero by MORE than their own
			// magnitude -- measured on Elm Street with every demand zeroed: largest flow
			// 8.8e-8 m3/s, change 4.5e-7. So the relative test above cannot pass however long it
			// runs, and this is the state a network is in for the whole time it is being drawn.
			// Judged on the FLOWS, not on the change, because it is the flows that are the answer:
			// every one below 1 mL/s is zero for any purpose a water network has.
			// Scaled on DEMAND, not on the flows. Scaling on the largest flow was written first and
			// then removed: no network could be built where it changed the verdict -- one with real
			// circulation and no demand (two reservoirs at different heads, in the harness) reaches
			// the main test long before it stalls. It is left out rather than kept "for safety",
			// because a branch no test can justify is a branch nobody can maintain.
			if (qMax < LPN_AT_REST ||
					sumAbsDq < Math.max(EngCalcs.lpnStallAccept * demandScale, absTol)) {
				done = true;
			}
		}

		if (done) {
			// CONVERGED, BUT ONLY IF NO VALVE WANTS TO CHANGE: the pressure valves were checked
			// above, and the FCVs are checked now (hydsolver.c: "Quit if no status changes occur").
			// A change restarts the count toward the next periodic check and the stall watch.
			if (X !== null) {
				var flowChange = flowValveStatus(H);
				if (valveChange || flowChange) {
					nextCheck = iter + checkFreq;
					bestChange = Infinity;
					stall = 0;
					continue;
				}
			}
			converged = true;
			break;
		}
		// The periodic check on FCVs, every CheckFreq trials up to MaxCheck (hydsolver.c).
		if (X !== null && iter <= maxCheck && iter === nextCheck) {
			flowValveStatus(H);
			nextCheck += checkFreq;
		}
	}

	// The report reads one state per valve; a PBV's or GPV's is the law it was last solved under.
	for (k = 0; k < links.length; k++) { if (fStat[k] !== undefined) { vStat[k] = fStat[k]; } }
	var report = EngCalcs.lpnReport(model, junctions, junctionIndex, byId, H, Q, method,
		visc, iter, converged, maxFlowChange, vStat);
	// A one-point GPV curve was read as a line through the origin (lpnGpvCurveProblem); say so, under
	// the same code js/lpn-epanet.js gives it, so the page says it whichever engine answered.
	var onePoint = EngCalcs.lpnGpvsWith(model, 'gpv-one-point');
	if (onePoint.length > 0) { report.warnings = [{ code: 'gpv-one-point', ids: onePoint }]; }
	return report;
};

// Turns the raw H/Q vectors into per-id results, and recomputes each link's head
// loss from the constitutive equation rather than from the head difference, so that
// a residual check has two independent numbers to compare.
EngCalcs.lpnReport = function (model, junctions, junctionIndex, byId, H, Q, method,
	visc, iterations, converged, maxFlowChange, vStat) {
	'use strict';
	var heads = {},
		pressures = {},
		flows = {},
		headlosses = {},
		velocities = {},
		valveStatus = {},
		i,
		k,
		link,
		res,
		aq,
		m,
		kEff,
		vs,
		g = EngCalcs.lpnG;

	// **SPECIFIC GRAVITY TURNS A HEAD INTO A PRESSURE, AND NOTHING ELSE** (Task 553). Every head in
	// this solver is a head OF THE FLUID -- the energy equation does not care what the fluid weighs,
	// so a denser one raises no head and changes no flow. It changes what a gauge reads: pressure in
	// metres of WATER is (H - z) x SG, which is exactly EPANET's own conversion. Applied here, at
	// the one place a pressure is produced; the EPANET bridge multiplies at tankGroundPressure(), so
	// the two engines report the same number for the same file. Absent, it is 1 and every existing answer is bit-identical.
	var sg = (model.hydraulics && typeof model.hydraulics.specificGravity === 'number'
		&& isFinite(model.hydraulics.specificGravity)) ? model.hydraulics.specificGravity : 1;
	for (i = 0; i < model.nodes.length; i++) {
		if (EngCalcs.lpnIsFixedHead(model.nodes[i])) {
			// A reservoir now carries an elevation as well as a head, so its pressure is the same
			// head-minus-elevation a junction's is -- zero only when the water surface sits at the
			// reservoir's own ground elevation, which is the default but no longer the only case.
			// A TANK's pressure is measured above its GROUND, like any other node's, and not above
			// the vessel's base (see EngCalcs.lpnTankBottom): a raised tank reads its water
			// surface's height above the street.
			heads[model.nodes[i].id] = model.nodes[i].head;
			pressures[model.nodes[i].id] = (model.nodes[i].head - EngCalcs.lpnPressureDatum(model.nodes[i])) * sg;
		}
	}
	for (i = 0; i < junctions.length; i++) {
		heads[junctions[i].id] = H[i];
		pressures[junctions[i].id] = (H[i] - (junctions[i].elev || 0)) * sg;
	}

	for (k = 0; k < model.links.length; k++) {
		link = model.links[k];
		// **A CONTROL VALVE REPORTS AS EPANET REPORTS IT** (epanet.c EN_getlinkvalue), and so does a
		// PBV and a GPV, whose loss is likewise no minor-loss formula's: closed by the
		// solve, its flow, velocity and head loss are zero; otherwise its head loss is the head
		// difference across it, which for an active valve is the pressure it is taking out -- the
		// minor-loss formula would report only the fully-open part of that.
		vs = vStat ? vStat[k] : undefined;
		if (EngCalcs.lpnValveIsControl(link) || EngCalcs.lpnValveIsFixedLaw(link)) {
			valveStatus[link.id] = vs === undefined ? 'closed' : vs;
		}
		if (vs !== undefined) {
			var vClosed = vs === 'closed';
			flows[link.id] = vClosed ? 0 : Q[k];
			velocities[link.id] = vClosed || !(link.diameter > 0) ? 0
				: Math.abs(Q[k]) / (Math.PI * link.diameter * link.diameter / 4);
			headlosses[link.id] = vClosed ? 0
				: (junctionIndex[link.from] === undefined ? byId[link.from].head : H[junctionIndex[link.from]]) -
				(junctionIndex[link.to] === undefined ? byId[link.to].head : H[junctionIndex[link.to]]);
			continue;
		}
		flows[link.id] = Q[k];
		// Velocity is a SPEED, so it is never negative -- |Q|/A, matching EPANET, which reports
		// signed flow and unsigned velocity from the same solve (verified against its own output
		// in dev/lpn-spike/reference/ref_Net1-3.json, where negative flows carry positive
		// velocities). Keep it unsigned: EngCalcs.lpnSolveEpanet reads EN_VELOCITY, which is
		// unsigned, so a signed velocity here makes the two engines disagree, and it breaks any
		// "highest velocity" comparison by sorting a fast reverse flow to the BOTTOM of the range.
		// Direction is already carried by the sign of the flow and by the arrow the map draws.
		velocities[link.id] = link.diameter > 0
			? Math.abs(Q[k]) / (Math.PI * link.diameter * link.diameter / 4)
			: 0;
		if (link.type === 'pump') {
			// Sign convention: a pump's head loss is the negation of its head gain, so a working
			// pump reports a NEGATIVE head loss. There is no separate head-gain quantity anywhere on
			// this page, and no floor/extrapolation check on the curve either: a pump has exactly
			// the curve the user entered for it and does exactly what that curve says, including
			// past its own zero-head flow.
			headlosses[link.id] = -(link.h0 - link.a * Math.pow(Math.max(Math.abs(Q[k]), EngCalcs.lpnQMin), link.b));
		} else {
			aq = Math.abs(Q[k]);
			if (method === 'dw') {
				link.f = EngCalcs.lpnDwFriction(Math.max(aq, EngCalcs.lpnQMin), link.diameter, link.roughness, visc);
			}
			res = EngCalcs.lpnResistance(link, method, visc);
			// lpnLinkK(), not link.k -- the same rule the iteration used above, so the reported
			// head loss on a throttle valve is the one the solve actually developed.
			kEff = EngCalcs.lpnLinkK(link);
			m = kEff > 0
				? kEff / (2 * g * Math.pow(Math.PI * link.diameter * link.diameter / 4, 2))
				: 0;
			headlosses[link.id] = res.r * Math.pow(aq, res.n - 1) * Q[k] + m * aq * Q[k];
		}
	}

	return {
		ok: true,
		issues: [],
		iterations: iterations,
		converged: converged,
		maxFlowChange: maxFlowChange,
		heads: heads,
		pressures: pressures,
		flows: flows,
		headlosses: headlosses,
		velocities: velocities,
		// Each PRV, PSV and FCV's state at the answer: 'active', 'open', 'closed', 'xpressure' or
		// 'xfcv' (see lpnSolve). A PBV's is 'active' (holding its drop) or 'open' (its minor loss
		// already exceeds it), a GPV's 'open'. A valve the user closed is 'closed'.
		valveStatus: valveStatus
	};
};

// Pump curve H = h0 - a Q^b from 1, 2 or 3 points, matching EPANET so that the
// same curve means the same thing in both tools.
//
//   1 point  -- EPANET's rule: shutoff head is 1.33334 x the design head and
//               maximum flow is 2 x the design flow, which forces b = 2 exactly.
//   2 points -- b = 2 with the vertex at zero flow, the same parabola
//               bpnParabolaHead uses in branched-network.js.
//   3 points -- the general power-law fit. If the first point is at Q = 0 it gives
//               h0 directly; otherwise h0, a and b are all fitted.
EngCalcs.lpnPumpFromCurve = function (points) {
	'use strict';
	var p = points.slice().sort(function (u, v) { return u[0] - v[0]; }),
		q1,
		h1,
		q2,
		h2,
		q3,
		h3,
		h0,
		b,
		lo,
		hi,
		mid,
		i,
		target,
		f;

	if (p.length === 1) {
		h0 = 1.33334 * p[0][1];
		return { h0: h0, a: (h0 - p[0][1]) / (p[0][0] * p[0][0]), b: 2 };
	}

	if (p.length === 2) {
		// Vertex at zero flow: h = h0 - a Q^2 through both points.
		q1 = p[0][0]; h1 = p[0][1];
		q2 = p[1][0]; h2 = p[1][1];
		if (q1 === 0) { return { h0: h1, a: (h1 - h2) / (q2 * q2), b: 2 }; }
		var aa = (h1 - h2) / (q2 * q2 - q1 * q1);
		return { h0: h1 + aa * q1 * q1, a: aa, b: 2 };
	}

	q1 = p[0][0]; h1 = p[0][1];
	q2 = p[1][0]; h2 = p[1][1];
	q3 = p[2][0]; h3 = p[2][1];

	if (q1 === 0) {
		// h0 is given. (h0-h2)/(h0-h3) = (q2/q3)^b solves for b directly.
		h0 = h1;
		b = Math.log((h0 - h2) / (h0 - h3)) / Math.log(q2 / q3);
		return { h0: h0, a: (h0 - h2) / Math.pow(q2, b), b: b };
	}

	// General case: eliminate h0 and a, leaving one monotone equation in b.
	target = (h1 - h2) / (h1 - h3);
	f = function (bb) {
		return (Math.pow(q2, bb) - Math.pow(q1, bb)) / (Math.pow(q3, bb) - Math.pow(q1, bb));
	};
	lo = 0.1;
	hi = 10;
	for (i = 0; i < 200; i++) {
		mid = (lo + hi) / 2;
		if (f(mid) > target) { lo = mid; } else { hi = mid; }
	}
	b = (lo + hi) / 2;
	var a = (h1 - h2) / (Math.pow(q2, b) - Math.pow(q1, b));
	return { h0: h1 + a * Math.pow(q1, b), a: a, b: b };
};

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
