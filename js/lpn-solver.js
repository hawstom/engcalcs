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

var EngCalcs = EngCalcs || {};

EngCalcs.lpnG = 9.806;

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

// Head-loss constants, selectable so that agreement with EPANET can be measured
// separately from agreement with the rest of this suite.
//
// They are NOT identical, and the difference is real rather than a rounding
// artifact: this suite's Hazen-Williams (hazen-williams.js, and bpnFriction in
// branched-network.js) uses Sf = 7.8828/d^4.8704 * (Q/(0.849 C))^1.852, while
// EPANET uses hL = 4.727 L Q^1.852 / (C^1.852 d^4.871) in US units. Converted to
// SI those give slightly different coefficients and a slightly different diameter
// exponent, worth a few tenths of a percent in head loss.
//
// 'engcalcs' is the default because a new page disagreeing with the suite's own
// Hazen-Williams calculator is a defect our users would actually see, whereas
// agreeing with EPANET to 4 decimal places is something only we check. 'epanet'
// exists so the validation harness can isolate solver error from constant choice.
EngCalcs.lpnConstants = {
	engcalcs: {
		// 7.8828 / 0.849^1.852, computed rather than typed so the relationship to
		// hazen-williams.js stays visible.
		hwCoef: 7.8828 / Math.pow(0.849, 1.852),
		hwDiaExp: 4.8704
	},
	epanet: {
		// EPANET's US-unit constant 4.727 converted to SI (Q m3/s, L m, d m, h m).
		// Derived in code for the same reason.
		hwCoef: 4.727 * Math.pow(0.3048, 4.871) / Math.pow(0.3048 * 0.3048 * 0.3048, 1.852),
		hwDiaExp: 4.871
	}
};

// Darcy-Weisbach friction factor, 3-regime Swamee-Jain. Identical to
// EngCalcs.bpnDwFriction; kept as a private copy for now on purpose -- the shared
// js/PipeHydraulics.lib.js extraction happens AFTER this page ships, so that a
// behavior-preserving diff can be run against a calculator that already works.
// See the scope doc, "Reuse".
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
EngCalcs.lpnResistance = function (link, method, visc, consts) {
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
		if (!(link.roughness > 0)) { return { r: 0, n: 1.852 }; }
		return {
			r: consts.hwCoef * L / (Math.pow(link.roughness, 1.852) * Math.pow(d, consts.hwDiaExp)),
			n: 1.852
		};
	}

	// Darcy-Weisbach. f depends on Q, so the caller recomputes r each iteration from
	// the previous iteration's flow and treats it as frozen when forming the
	// derivative -- what EPANET does, and convergence stays fast.
	a = Math.PI * d * d / 4;
	return { r: link.f * L / (d * 2 * EngCalcs.lpnG * a * a), n: 2 };
};

// Dense Cholesky (LL^T) solve of A x = b for symmetric positive definite A.
//
// Dense on purpose, and now measured rather than estimated (dev/lpn-spike):
//   21 nodes  / 32 links   0.4 ms per solve,  5 iterations
//   97 nodes  / 119 links  (EPANET Net3)     16 iterations
//   201 nodes / 371 links  30 ms per solve,  11 iterations
// The 200-node figure is headroom, not a target, and it is ~30 ms rather than the
// "few milliseconds" first estimated -- that estimate counted one factorization and
// forgot to multiply by the iteration count. It is still comfortably inside a
// debounced edit, so the conclusion holds even though the arithmetic did not.
//
// The sparse machinery this replaces (CSR, conjugate gradient, fill-reducing
// ordering, cached symbolic factorization) is cut, not deferred. Everything routes
// through this one function so that decision stays reversible.
//
// Returns null if A is not positive definite, which for this matrix means the
// network is not properly grounded -- the caller should have caught that already
// with a structural check, so null here is a bug, not a user error.
EngCalcs.lpnSolveSPD = function (A, b) {
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

// Structural checks, run BEFORE the solve, never by watching it fail.
//
// Each returns a distinct machine-readable code so the UI can say something
// specific and highlight the offending elements. The dominant real-world error is
// 'unreachable': a pipe drawn near a junction but not snapped to it.
EngCalcs.lpnDiagnose = function (model) {
	'use strict';
	var fixed = [],
		byId = {},
		adj = {},
		issues = [],
		seen = {},
		queue = [],
		unreachable = [],
		i,
		id,
		link,
		node;

	for (i = 0; i < model.nodes.length; i++) {
		node = model.nodes[i];
		byId[node.id] = node;
		adj[node.id] = [];
		if (node.type === 'reservoir') { fixed.push(node.id); }
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
		consts = EngCalcs.lpnConstants[opts.constants || 'engcalcs'],
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
		maxIter = opts.maxIter || 100,
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

	issues = EngCalcs.lpnDiagnose(model);
	if (issues.length > 0) {
		return { ok: false, issues: issues, converged: false, iterations: 0 };
	}

	for (i = 0; i < nodes.length; i++) {
		byId[nodes[i].id] = nodes[i];
		if (nodes[i].type !== 'reservoir') {
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

	for (iter = 1; iter <= maxIter; iter++) {
		var A = [],
			F = new Float64Array(nn),
			G = new Float64Array(links.length),
			y = new Float64Array(links.length),
			link,
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

		for (i = 0; i < nn; i++) { A.push(new Float64Array(nn)); }

		for (k = 0; k < links.length; k++) {
			link = links[k];
			if (link.status === 'closed') { G[k] = 0; y[k] = 0; continue; }

			q = Q[k];
			aq = Math.abs(q);

			if (link.type === 'pump') {
				// Head GAIN: H_to - H_from = H0 - a Q^b, so h = -(H0 - a Q^b).
				// A pump pushed backwards is treated as closed for this iteration.
				var qp = Math.max(aq, qMin);
				if (q < 0) {
					G[k] = 1e-8;
					y[k] = 0;
				} else {
					h = -(link.h0 - link.a * Math.pow(qp, link.b));
					p = link.a * link.b * Math.pow(qp, link.b - 1);
					G[k] = 1 / p;
					y[k] = h / p;
				}
			} else {
				if (method === 'dw') {
					link.f = EngCalcs.lpnDwFriction(Math.max(aq, qMin), link.diameter, link.roughness, visc);
				}
				res = EngCalcs.lpnResistance(link, method, visc, consts);
				var m = link.k > 0
					? link.k / (2 * g * Math.pow(Math.PI * link.diameter * link.diameter / 4, 2))
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
		if (maxFlowChange < bestChange * 0.999) {
			bestChange = maxFlowChange;
			stall = 0;
		} else if (++stall >= 5 && sumAbsDq < Math.max(1e-6 * demandScale, absTol)) {
			converged = true;
			break;
		}
	}

	return EngCalcs.lpnReport(model, junctions, junctionIndex, byId, H, Q, method,
		visc, consts, iter, converged, maxFlowChange);
};

// Turns the raw H/Q vectors into per-id results, and recomputes each link's head
// loss from the constitutive equation rather than from the head difference, so that
// a residual check has two independent numbers to compare.
EngCalcs.lpnReport = function (model, junctions, junctionIndex, byId, H, Q, method,
	visc, consts, iterations, converged, maxFlowChange) {
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
		g = EngCalcs.lpnG;

	for (i = 0; i < model.nodes.length; i++) {
		if (model.nodes[i].type === 'reservoir') {
			heads[model.nodes[i].id] = model.nodes[i].head;
			pressures[model.nodes[i].id] = 0;
		}
	}
	for (i = 0; i < junctions.length; i++) {
		heads[junctions[i].id] = H[i];
		pressures[junctions[i].id] = H[i] - (junctions[i].elev || 0);
	}

	for (k = 0; k < model.links.length; k++) {
		link = model.links[k];
		flows[link.id] = Q[k];
		velocities[link.id] = link.diameter > 0
			? Q[k] / (Math.PI * link.diameter * link.diameter / 4)
			: 0;
		if (link.type === 'pump') {
			headlosses[link.id] = -(link.h0 - link.a * Math.pow(Math.max(Math.abs(Q[k]), EngCalcs.lpnQMin), link.b));
		} else {
			aq = Math.abs(Q[k]);
			if (method === 'dw') {
				link.f = EngCalcs.lpnDwFriction(Math.max(aq, EngCalcs.lpnQMin), link.diameter, link.roughness, visc);
			}
			res = EngCalcs.lpnResistance(link, method, visc, consts);
			m = link.k > 0
				? link.k / (2 * g * Math.pow(Math.PI * link.diameter * link.diameter / 4, 2))
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
