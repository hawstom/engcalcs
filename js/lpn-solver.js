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
// Target scale is ~10-20 nodes, which is why the linear solve is a dense Cholesky
// rather than anything sparse -- see solveSPD().

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
EngCalcs.lpnGradMin = 1e-6 * 0.3048 / 0.0283168466;

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
// Returns null on a non-positive-definite A, exactly as the dense one does.
EngCalcs.lpnSolveSPD = function (A, b) {
	'use strict';
	var n = b.length,
		first = new Int32Array(n),
		rowStart = new Int32Array(n + 1),
		colStart = new Int32Array(n + 2),
		L,
		colRow,
		x = new Array(n),
		y = new Array(n),
		Ai,
		i,
		j,
		k,
		kk,
		f,
		fi,
		fj,
		si,
		sj,
		sum,
		lii,
		total = 0;

	// Row envelopes, and the packed offsets they imply. Row i occupies columns f[i]..i.
	for (i = 0; i < n; i++) {
		Ai = A[i];
		f = i;
		for (j = 0; j < i; j++) {
			if (Ai[j] !== 0) { f = j; break; }
		}
		first[i] = f;
		rowStart[i] = total;
		total += i - f + 1;
	}
	rowStart[n] = total;
	L = new Float64Array(total);

	// Column occupancy, for the back substitution alone. Counting sort, so the rows in each
	// column come out in increasing order -- which is the order the dense loop visited them in,
	// and therefore the order the sum has to be accumulated in.
	for (i = 0; i < n; i++) {
		for (j = first[i]; j < i; j++) { colStart[j + 2]++; }
	}
	for (j = 0; j < n; j++) { colStart[j + 2] += colStart[j + 1]; }
	colRow = new Int32Array(total - n);
	for (i = 0; i < n; i++) {
		for (j = first[i]; j < i; j++) { colRow[colStart[j + 1]++] = i; }
	}

	for (i = 0; i < n; i++) {
		Ai = A[i];
		fi = first[i];
		si = rowStart[i] - fi;
		for (j = fi; j <= i; j++) {
			sum = Ai[j];
			fj = first[j];
			sj = rowStart[j] - fj;
			for (k = (fi > fj ? fi : fj); k < j; k++) { sum -= L[si + k] * L[sj + k]; }
			if (i === j) {
				if (!(sum > 0)) { return null; }
				L[si + i] = Math.sqrt(sum);
			} else {
				L[si + j] = sum / L[rowStart[j] + j - fj];
			}
		}
	}

	for (i = 0; i < n; i++) {
		fi = first[i];
		si = rowStart[i] - fi;
		sum = b[i];
		for (k = fi; k < i; k++) { sum -= L[si + k] * y[k]; }
		y[i] = sum / L[si + i];
	}
	for (i = n - 1; i >= 0; i--) {
		sum = y[i];
		for (kk = colStart[i]; kk < colStart[i + 1]; kk++) {
			k = colRow[kk];
			sum -= L[rowStart[k] - first[k] + i] * x[k];
		}
		x[i] = sum / L[rowStart[i] - first[i] + i];
	}

	return x;
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
//   PRV / PSV / FCV / PBV / GPV -- ACTIVE CONTROLS. Each one is a valve that CHANGES STATE during
//           the solve: a PRV is fully open while the downstream pressure is below its setting,
//           active (holding that pressure) once it is reached, and shut if flow reverses. Which
//           of the three it is depends on the pressures and flows being solved for, so the
//           status has to be re-decided inside the iteration and the whole system re-formed when
//           it changes. That is real numerics, not a coefficient.
//
// WE DO NOT WRITE THOSE NUMERICS, AND THAT IS A MEASUREMENT, NOT A SHRUG. This page ships a real
// EPANET engine that already implements status switching, and dev/lpn-spike/engine-bench.js
// measured it at 0.05 ms against this file's 0.43 ms on the same 21-node network -- EPANET is ~9x
// faster here and ~46x faster at 201 nodes.
//
// So an active valve routes the SOLVE to EPANET (see runSolve() in js/looped-network.js), and if
// EPANET is unreachable -- offline, blocked module -- this file refuses with a diagnostic that
// NAMES THE VALVES. That is the whole reason the diagnostics on this page are ours and not
// EPANET's numeric error codes: "valve V3 needs the EPANET engine" beats "error 110".
EngCalcs.lpnValveTypes = ['PRV', 'PSV', 'FCV', 'TCV', 'PBV', 'GPV'];

// The one place the native/EPANET-only line is drawn. A link that is not a valve is native.
EngCalcs.lpnValveIsNative = function (link) {
	return link.type !== 'valve' || (link.valveType || 'TCV').toUpperCase() === 'TCV';
};

// Ids of every valve in the model that only the EPANET engine can solve. Exported because the UI
// needs the same answer BEFORE it picks an engine, and two copies of this rule would drift.
EngCalcs.lpnEpanetOnlyValves = function (model) {
	var out = [], i;
	for (i = 0; i < model.links.length; i++) {
		if (!EngCalcs.lpnValveIsNative(model.links[i])) { out.push(model.links[i].id); }
	}
	return out;
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
// Everything below is engine-independent except one check -- an active valve
// is a perfectly valid network that this file alone cannot solve -- so that check fires only when
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
		epanetOnlyValves,
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
		if (link.type !== 'valve' || EngCalcs.lpnValveIsNative(link)) { continue; }
		if ((byId[link.from] && EngCalcs.lpnIsFixedHead(byId[link.from])) ||
			(byId[link.to] && EngCalcs.lpnIsFixedHead(byId[link.to]))) {
			badlyPlacedValves.push(link.id);
		}
	}
	if (badlyPlacedValves.length > 0) {
		issues.push({ code: 'valve-on-fixed-head', ids: badlyPlacedValves });
	}

	// The one engine-dependent check -- see the note on `options` above.
	if (opts.engine === 'native') {
		epanetOnlyValves = EngCalcs.lpnEpanetOnlyValves(model);
		if (epanetOnlyValves.length > 0) {
			issues.push({ code: 'valve-needs-epanet', ids: epanetOnlyValves });
		}
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

	return issues;
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
		k;

	// 'native' names THIS file, so lpnDiagnose adds the one check that is about this engine's
	// limits rather than about the network: an active valve it cannot switch. See its comment.
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
	var A = [],
		F = new Float64Array(nn),
		G = new Float64Array(links.length),
		y = new Float64Array(links.length);
	for (i = 0; i < nn; i++) { A.push(new Float64Array(nn)); }

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
			sumAbsDq = 0;

		for (i = 0; i < nn; i++) { A[i].fill(0); }
		F.fill(0);

		for (k = 0; k < links.length; k++) {
			link = links[k];
			if (link.status === 'closed') { G[k] = 0; y[k] = 0; continue; }

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
			} else {
				if (method === 'dw') {
					link.f = EngCalcs.lpnDwFriction(Math.max(aq, qMin), link.diameter, link.roughness, visc);
				}
				res = EngCalcs.lpnResistance(link, method, visc);
				// A VALVE ARRIVES HERE, and needs no branch of its own: lpnResistance returns
				// r = 0 for a zero-length link, so the friction term vanishes and what is left is
				// exactly the minor loss -- which is what a throttle valve IS. lpnLinkK() is the
				// one place that reads a TCV's loss out of its setting rather than out of k.
				var km = EngCalcs.lpnLinkK(link),
					m = km > 0
						? km / (2 * g * Math.pow(Math.PI * link.diameter * link.diameter / 4, 2))
						: 0;

				h = res.r * Math.pow(aq, res.n - 1) * q + m * aq * q;
				p = res.n * res.r * Math.pow(aq, res.n - 1) + 2 * m * aq;
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

			if (iIdx !== undefined) {
				A[iIdx][iIdx] += G[k];
				F[iIdx] -= (Q[k] - y[k]);
			}
			if (jIdx !== undefined) {
				A[jIdx][jIdx] += G[k];
				F[jIdx] += (Q[k] - y[k]);
			}
			if (iIdx !== undefined && jIdx !== undefined) {
				A[iIdx][jIdx] -= G[k];
				A[jIdx][iIdx] -= G[k];
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
				A[i][i] += ge;
				F[i] += ge * H[i] - qe;
			}
		}

		Hnew = EngCalcs.lpnSolveSPD(A, F);
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
			sumAbsDq += Math.abs(dq);
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
		if (maxFlowChange < tol || sumAbsDq < absTol) { converged = true; break; }

		// Stagnation. Newton converges quadratically until it reaches the roundoff
		// floor of the dense factorization, then stops improving -- measured on a
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
		// The floor is roundoff in the dense factorization and is network-dependent -- ill
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
		if (maxFlowChange < bestChange * 0.999) {
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
				converged = true;
				break;
			}
		}
	}

	return EngCalcs.lpnReport(model, junctions, junctionIndex, byId, H, Q, method,
		visc, iter, converged, maxFlowChange);
};

// Turns the raw H/Q vectors into per-id results, and recomputes each link's head
// loss from the constitutive equation rather than from the head difference, so that
// a residual check has two independent numbers to compare.
EngCalcs.lpnReport = function (model, junctions, junctionIndex, byId, H, Q, method,
	visc, iterations, converged, maxFlowChange) {
	'use strict';
	var heads = {},
		pressures = {},
		flows = {},
		headlosses = {},
		velocities = {},
		i,
		k,
		link,
		res,
		aq,
		m,
		kEff,
		g = EngCalcs.lpnG;

	// **SPECIFIC GRAVITY TURNS A HEAD INTO A PRESSURE, AND NOTHING ELSE** (Task 553). Every head in
	// this solver is a head OF THE FLUID -- the energy equation does not care what the fluid weighs,
	// so a denser one raises no head and changes no flow. It changes what a gauge reads: pressure in
	// metres of WATER is (H - z) x SG, which is exactly EPANET's own conversion. Applied here, at
	// the one place a pressure is produced, so the two engines report the same number for the same
	// file. Absent, it is 1 and every existing answer is bit-identical.
	var sg = (model.hydraulics && typeof model.hydraulics.specificGravity === 'number'
		&& isFinite(model.hydraulics.specificGravity)) ? model.hydraulics.specificGravity : 1;
	for (i = 0; i < model.nodes.length; i++) {
		if (EngCalcs.lpnIsFixedHead(model.nodes[i])) {
			// A reservoir now carries an elevation as well as a head, so its pressure is the same
			// head-minus-elevation a junction's is -- zero only when the water surface sits at the
			// reservoir's own ground elevation, which is the default but no longer the only case.
			// A TANK is the case where the two routinely differ: its elevation is the bottom of the
			// vessel and its head is the water surface, so the pressure reported here is the depth
			// of water standing in it -- which is exactly what a reader wants to see at a tank.
			heads[model.nodes[i].id] = model.nodes[i].head;
			pressures[model.nodes[i].id] = (model.nodes[i].head - (model.nodes[i].elev || 0)) * sg;
		}
	}
	for (i = 0; i < junctions.length; i++) {
		heads[junctions[i].id] = H[i];
		pressures[junctions[i].id] = (H[i] - (junctions[i].elev || 0)) * sg;
	}

	for (k = 0; k < model.links.length; k++) {
		link = model.links[k];
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
		velocities: velocities
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
