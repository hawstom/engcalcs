// lpn-fireflow.js -- the whole-system fire flow sweep (ROADMAP Task 530), computation only.
//
// THE QUESTION, in Tom's words, 2026-08-27: *"Which nodes in my system can provide fire flow
// (available vs required) or alternatively (separate Design question and analysis) provide it
// without causing other nodes to fail or links to have excessive velocity?"* -- and every junction
// comes back Passing, Failing, or causing a Design issue.
//
// So this is a SWEEP over junctions, not a calculation for one hydrant. Two questions are asked of
// every junction and the answers are stored together:
//
//   COMPLIANCE  How much can this junction deliver while it still holds the residual pressure?
//               Flow and pressure trade against each other, so there is no closed form -- it is a
//               SEARCH. Put a demand on the junction, solve, read its pressure, bisect.
//   DESIGN      With the REQUIRED flow drawn here, does anything else in the chosen scope fall
//               below its minimum pressure or run above its velocity limit?
//
// **RAW NODES. The demand goes on the junction itself and no hydrant is modelled** (Tom,
// 2026-08-27: *"If the modelled assembly is an innovation, I would rather not ship it... Why build
// something that nobody is asking for?"*). It is also what both inspectable tools do -- WaterCAD by
// default, and OptiWater's FireFlow steps demand at the node itself. A blanket assembly model
// imposes one guessed hydrant on every junction in the system at once. The modelled assembly is
// built and lives on the `fire-flow` branch; it is not shipping. `LOSS_ACCOUNTING` below names what
// this file does instead, as a value, so the interface can state it rather than imply it.
//
// **ONE RUN, ONE STORED RESULT SET, TWO REPORTS.** Two buttons would ask the user to choose between
// the two questions before they can see what either says, and the three-state colouring needs both
// answers for every junction at once.
//
// PURE, like js/lpn-geom.js and js/lpn-collide.js: values in, values out. No DOM, no `doc`, no
// settings, no language strings, no engine of its own. Everything here is SI -- m3/s, metres of
// head, m/s -- and every imperial number is converted HERE, once, in a derivation that stays
// visible rather than as a typed-in decimal.
//
// WHAT THIS FILE DELIBERATELY IS NOT:
//   * It is not an interface. A result carries machine-readable codes and numbers; the wording,
//     the units and the colours are somebody else's job.
//   * It does not choose an engine. The solve is INJECTED (options.solve) -- the native solver is
//     synchronous and EPANET's returns a promise, and a network holding a PRV/PSV/FCV is routed to
//     EPANET whatever the preference says. Which of those applies is the caller's business.
//   * It never touches the caller's model. Every probe is made on a COPY, and the copy's node
//     objects are copies too, so the one field this file writes -- a probe demand -- cannot reach
//     the document the caller assembled it from. That is also why nothing here needs to know about
//     setProp(): it writes no element property at all, and the results live in a record of their
//     own beside the document rather than on it.
//   * It has NO TIME DIMENSION. US practice loads fire flow onto maximum-day demand and evaluates
//     one steady-state condition; nobody targets "the extended-period run as a whole". The caller
//     hands over the model for the one condition it wants tested and says so in the interface.

var EngCalcs = (typeof require === 'function' && typeof module !== 'undefined')
	? require('./PipeHydraulics.lib.js')
	: (EngCalcs || {});

(function () {
	'use strict';

	// ---------------------------------------------------------------------------
	// UNIT BRIDGE -- the boundary, and the only place imperial appears
	// ---------------------------------------------------------------------------
	//
	// The conventions this feature is built on are American and are stated in psi and gpm. The
	// house rule is SI throughout with conversion at the boundary, so the conversions happen once,
	// here, DERIVED from the suite's exact definitions (CLAUDE.md: ft = 0.3048 m,
	// gal = 3.785411784 L, lbf = 4.4482216152605 N) rather than retyped as decimals.
	var M_PER_FT = 0.3048,
		M_PER_IN = M_PER_FT / 12,
		M3_PER_GAL = 3.785411784e-3,
		// 1 psi = 1 lbf / in^2, in pascals.
		PA_PER_PSI = 4.4482216152605 / (M_PER_IN * M_PER_IN),
		// Water at ordinary distribution temperatures. 1000 kg/m3 is the density every
		// pressure-to-head conversion in this suite assumes; g is the suite's one gravity.
		RHO = 1000;

	// Pressure in psi -> head in metres of water. Exported because a caller that wants to offer
	// "20 psi" in an interface must convert with THIS function, not its own.
	function psiToHead(psi) {
		return psi * PA_PER_PSI / (RHO * EngCalcs.G);
	}
	function gpmToSI(gpm) {
		return gpm * M3_PER_GAL / 60;
	}

	// **HOW HYDRANT LOSSES ARE ACCOUNTED FOR, AS A VALUE RATHER THAN AS A SILENCE** (Tom,
	// 2026-08-25: *"I want to be very explicit and transparent, maybe even selectable, about how we
	// account if at all for hydrant losses beyond the node."*). There is exactly one method here
	// and it is the profession's default: none at all. The flow reported is the flow AT THE
	// JUNCTION, with nothing modelled between the main and the pumper nozzle -- so a real hydrant
	// on a real lateral delivers less than this says. The result set carries this string so the
	// interface has to state it rather than leave the reader to assume.
	var LOSS_ACCOUNTING = 'raw-node';

	var DEFAULTS = {
		// 20 psi residual: the AWWA M31 / NFPA 291 convention for available fire flow.
		residualPsi: 20,

		// The search ceiling. 10,000 gpm is about 6.7x the ISO single-hydrant credit cap and far
		// past any real hydrant. A junction whose pressure still holds there is reported as
		// delivering AT LEAST the ceiling; the ceiling is never presented as the answer.
		maxFlow: gpmToSI(10000),

		// Stop bisecting when the bracket is this narrow, relative to the ceiling. 1e-4 of
		// 10,000 gpm is 1 gpm -- far finer than any fire-flow number is ever quoted to.
		flowTol: 1e-4
	};

	// ISO caps the credit given to a single hydrant at 1,500 gpm whatever the hydraulics say.
	// REPORTED AS A NOTE BESIDE THE COMPUTED NUMBER, NEVER SILENTLY CLAMPED: a clamped number is a
	// lie with a tidy face, while a computed number the reader is told to cap is the truth.
	var ISO_SINGLE_HYDRANT_CAP = gpmToSI(1500);

	// ---------------------------------------------------------------------------
	// The three states, and the fourth thing that is not a state
	// ---------------------------------------------------------------------------
	//
	// Tom asked for every junction to be highlighted Passing, Failing, or causing a Design issue.
	// A junction whose solve did not produce an answer is none of those three, and calling it a
	// failure would report a broken model as a starved neighbourhood. So it is named, it is
	// counted, and the interface can say how many junctions it could not answer for.
	//
	// The four are exhaustive and mutually exclusive by construction: sweep() assigns exactly one
	// to every junction it was given, and dev/lpn-spike/fireflow-harness.js asserts the partition.
	var STATES = {
		PASS: 'pass',       // available >= required, and nothing in scope was hurt by drawing it
		FAIL: 'fail',       // available < required -- this junction cannot deliver the fire flow
		DESIGN: 'design',   // available >= required, but drawing it breaks something else in scope
		ERROR: 'error'      // no answer: the network did not solve or did not settle
	};

	// Every outcome is NAMED, and no failure is ever a number.
	//
	// BELOW_AT_REST is the one worth reading twice. "There is no available fire flow" must never
	// come back as 0 gpm, because THE QUESTION HAS NO ANSWER RATHER THAN AN ANSWER OF ZERO:
	// available fire flow is DEFINED as the flow at which the junction still holds the residual,
	// and if the residual is already unmet with nothing drawn, no flow satisfies the definition.
	// The state is FAIL -- the junction certainly cannot deliver the required flow -- but the
	// record carries no `available` field at all, and the code says why.
	var CODES = {
		OK: 'ok',
		AT_LEAST: 'search-ceiling-reached',
		BELOW_AT_REST: 'below-residual-at-rest',
		NOT_A_JUNCTION: 'node-not-a-junction',
		UNKNOWN_NODE: 'node-not-found',
		NO_CONVERGENCE: 'solve-did-not-converge',
		SOLVE_FAILED: 'solve-reported-issues',
		STOPPED: 'stopped'
	};

	// ---------------------------------------------------------------------------
	// The copy
	// ---------------------------------------------------------------------------
	//
	// ONE copy per sweep, not one per probe: the only thing a probe writes is a single node's
	// demand, and it is put back before the next junction is tested. Copying 225 nodes sixteen
	// times per junction would cost more than the solves.
	//
	// The node objects are copied too, so `demand = q` below writes to this file's own object and
	// can never reach the model the caller assembled. Links are shared by reference and are never
	// written -- a solver may cache a friction factor on one (js/lpn-solver.js writes `link.f`
	// under Darcy-Weisbach), which is the same thing an ordinary solve does to the same objects.
	function copyModel(model) {
		var out = {}, key;
		for (key in model) {
			if (Object.prototype.hasOwnProperty.call(model, key)) { out[key] = model[key]; }
		}
		out.nodes = model.nodes.map(function (n) {
			var c = {}, k;
			for (k in n) { if (Object.prototype.hasOwnProperty.call(n, k)) { c[k] = n[k]; } }
			return c;
		});
		out.links = model.links.slice();
		return out;
	}

	// ---------------------------------------------------------------------------
	// Yielding, so a sweep of minutes is not a frozen page
	// ---------------------------------------------------------------------------
	//
	// The native solver is SYNCHRONOUS, so a promise chain over it runs entirely in microtasks and
	// never gives the browser a frame: the progress line would not paint and the Stop button would
	// not answer. A macrotask between junctions is what makes both work. It is one timer per
	// junction, not per solve -- at ~16 solves a junction the timer is a rounding error, and
	// yielding per solve measurably lengthened the sweep.
	//
	// Overridable so a harness can run without timers; absent a scheduler this degrades to a
	// microtask and the answers are identical.
	function defaultYield() {
		if (typeof setTimeout === 'function') {
			return new Promise(function (resolve) { setTimeout(resolve, 0); });
		}
		return Promise.resolve();
	}

	function solveOnce(solve, m) {
		return Promise.resolve().then(function () { return solve(m); });
	}

	// ---------------------------------------------------------------------------
	// One junction
	// ---------------------------------------------------------------------------
	//
	// THE ORDER OF THE PROBES IS THE DESIGN, and it is what makes the design half nearly free.
	//
	// The roadmap's own cost note assumed the side-effect readings would have to come from an
	// extra solve, because the bisection's last iterate is at the AVAILABLE flow while the design
	// question is asked at the REQUIRED one. That is true of a bisection that starts at the
	// ceiling. Probing the REQUIRED flow FIRST answers both at once:
	//
	//   probe(0)         static pressure, and the at-rest test
	//   probe(required)  the compliance verdict outright (does it hold the residual at the flow the
	//                    code asks for?) AND every reading the design half needs, at exactly the
	//                    flow the design question is asked at
	//   probe(ceiling)   is the answer past any real hydrant?
	//   bisect           between whichever pair of those brackets the answer
	//
	// So the design half costs NO extra solve, and the compliance verdict is known after three.
	// The bisection that follows is only there to put a NUMBER on the available flow.
	function testJunction(ctx, node) {
		var solves = 0,
			required = ctx.requiredFor(node.id),
			residual = ctx.residual,
			maxFlow = ctx.maxFlow,
			base = (typeof node.demand === 'number' && isFinite(node.demand)) ? node.demand : 0,
			rec = {
				id: node.id,
				required: required,
				residual: residual,
				baseDemand: base
			};

		// **THE FIRE FLOW IS DRAWN IN ADDITION TO WHAT THIS JUNCTION ALREADY USES.** A fire is not
		// a substitute for the neighbourhood's ordinary demand; it is on top of it. That is what
		// every agency's max-day-plus-fire-flow criterion means, and it is what both inspectable
		// tools do.
		function probe(q) {
			node.demand = base + q;
			solves++;
			return solveOnce(ctx.solve, ctx.model).then(function (r) {
				return { q: q, result: r, pressure: r && r.pressures ? r.pressures[node.id] : undefined };
			});
		}

		// A trial that did not produce a trustworthy pressure is NAMED, never folded into the
		// search as though it meant "cannot deliver". A non-converged solve is not a small flow; it
		// is an unknown one, and reporting it as a flow would be inventing an answer.
		function bad(p) {
			if (!p.result || !p.result.ok) {
				return { code: CODES.SOLVE_FAILED, issues: (p.result && p.result.issues) || [] };
			}
			if (!p.result.converged) { return { code: CODES.NO_CONVERGENCE }; }
			if (!isFinite(p.pressure)) { return { code: CODES.SOLVE_FAILED, issues: [] }; }
			return null;
		}
		function errorOut(problem, q) {
			rec.state = STATES.ERROR;
			rec.code = problem.code;
			rec.issues = problem.issues || [];
			rec.flowAtFailure = q;
			rec.solves = solves;
			return rec;
		}

		return probe(0).then(function (rest) {
			var problem = bad(rest);
			if (problem) { return errorOut(problem, 0); }
			rec.staticPressure = rest.pressure;

			// Available fire flow is the flow at which this junction still holds the residual. If
			// the residual is already unmet with nothing drawn, NO SUCH FLOW EXISTS -- the network
			// fails the criterion before a hydrant is opened. That is a FAIL with no number, not an
			// available flow of zero, and the record carries no `available` field to say so.
			if (rest.pressure < residual) {
				rec.state = STATES.FAIL;
				rec.code = CODES.BELOW_AT_REST;
				rec.solves = solves;
				return rec;
			}

			return probe(required).then(function (atReq) {
				var problem2 = bad(atReq);
				if (problem2) { return errorOut(problem2, required); }
				// THE COMPLIANCE VERDICT, from this one solve. Everything after it is arithmetic
				// about how much MORE (or less) than the requirement is there.
				rec.holdsAtRequired = (atReq.pressure >= residual);
				rec.pressureAtRequired = atReq.pressure;
				// **AND THE DESIGN READINGS, TAKEN AT THE REQUIRED FLOW, WHICH IS THE FLOW THE
				// DESIGN QUESTION IS ASKED AT.** Read here whether or not the junction passes:
				// where it fails, `sideEffects` is simply not consulted, and no solve was spent on
				// it either way.
				if (ctx.design) { rec.effects = ctx.sideEffects(atReq.result, node.id); }

				return probe(maxFlow).then(function (top) {
					var problem3 = bad(top), lo, hi, loPressure;
					if (problem3) { return errorOut(problem3, maxFlow); }

					// The residual still holds at a flow past any real hydrant. Report AT LEAST the
					// ceiling; never report the ceiling as though the search had found it.
					if (top.pressure >= residual) {
						rec.available = maxFlow;
						rec.atLeast = true;
						rec.code = CODES.AT_LEAST;
						rec.residualAt = top.pressure;
						rec.solves = solves;
						return finish(rec);
					}

					// Step 3: bisect. `lo` always MEETS the residual and `hi` always fails, so the
					// answer reported is `lo` -- the largest flow KNOWN to hold the residual.
					// Erring on the low side is the right direction for a fire-flow number.
					//
					// The bracket starts already halved by the probe at the required flow, which is
					// why the requirement is tested before the ceiling and not after it.
					if (rec.holdsAtRequired) {
						lo = required; loPressure = atReq.pressure; hi = maxFlow;
					} else {
						lo = 0; loPressure = rest.pressure; hi = required;
					}

					function step() {
						var aborted = null;
						if (hi - lo <= ctx.flowTol * maxFlow) {
							rec.available = lo;
							rec.code = CODES.OK;
							rec.residualAt = loPressure;
							rec.bracket = { low: lo, high: hi };
							rec.solves = solves;
							return finish(rec);
						}
						return probe((lo + hi) / 2).then(function (p) {
							var b = bad(p);
							if (b) { aborted = b; return errorOut(aborted, p.q); }
							if (p.pressure >= residual) { lo = p.q; loPressure = p.pressure; }
							else { hi = p.q; }
							return step();
						});
					}
					return step();
				});
			});
		}).then(function (out) {
			// The probe demand is put back whatever happened, including on an error path: the next
			// junction's answers would otherwise be taken with this one's fire still burning.
			node.demand = base;
			return out;
		});

		// The three states, decided in ONE place from the two answers. Compliance first: a junction
		// that cannot deliver the flow is Failing whatever it does to its neighbours, because the
		// design question is not asked at a flow that cannot be drawn.
		function finish(r) {
			if (!(r.available >= r.required)) {
				r.state = STATES.FAIL;
				return r;
			}
			if (r.effects && (r.effects.nodes.length || r.effects.links.length)) {
				r.state = STATES.DESIGN;
				return r;
			}
			r.state = STATES.PASS;
			return r;
		}
	}

	/**
	 * EngCalcs.lpnFireFlowSweep(model, options) -> Promise<resultSet>
	 *
	 * options:
	 *   solve        REQUIRED function(model) -> result | Promise<result>, in lpnSolve's shape
	 *   junctions    REQUIRED array of node ids to test. THE CALLER CHOOSES THE SET -- this file
	 *                never decides what "the system" means, and there is no automatic radius and no
	 *                stop-when-the-drawdown-is-small rule anywhere in it.
	 *   required     REQUIRED fire flow in m3/s: a number for every junction, or a function(id).
	 *   residual     metres of head every tested junction must hold; omit for 20 psi.
	 *   design       omit or null for the compliance half alone. To ask the design question, pass
	 *                { nodes: [ids], links: [ids], minPressure: m, maxVelocity: m/s } -- the SET is
	 *                the caller's, picked before the run.
	 *   maxFlow      search ceiling, SI. flowTol: bracket tolerance relative to it.
	 *   onProgress   function({ done, total, id, result }) after every junction.
	 *   shouldStop   function() -> true to abandon the sweep between junctions. The results already
	 *                taken are returned, and `stopped` says so -- a stopped sweep is a partial
	 *                answer, never a discarded one.
	 *   yield        function() -> Promise, called between junctions. See defaultYield().
	 *
	 * The result set carries { ok, results, byId, counts, order, solves, stopped, residual,
	 * lossAccounting, isoCap }.
	 */
	function sweep(model, options) {
		var opts = options || {},
			m,
			byId = {},
			ids = opts.junctions || [],
			residual = (typeof opts.residual === 'number' && isFinite(opts.residual))
				? opts.residual : psiToHead(DEFAULTS.residualPsi),
			maxFlow = (typeof opts.maxFlow === 'number' && opts.maxFlow > 0)
				? opts.maxFlow : DEFAULTS.maxFlow,
			flowTol = (typeof opts.flowTol === 'number' && opts.flowTol > 0)
				? opts.flowTol : DEFAULTS.flowTol,
			design = opts.design || null,
			yieldTo = opts.yield || defaultYield,
			results = [],
			counts = { pass: 0, fail: 0, design: 0, error: 0 },
			totalSolves = 0,
			stopped = false,
			ctx,
			i;

		if (typeof opts.solve !== 'function') {
			// A wiring error, not a network result: there is no honest answer to return.
			throw new TypeError('lpnFireFlowSweep: options.solve must be a function(model) ' +
				'returning a solve result or a promise of one. The engine is the caller\'s choice.');
		}
		if (typeof opts.required !== 'function' && !(opts.required > 0)) {
			throw new TypeError('lpnFireFlowSweep: options.required must be a flow in m3/s, or a ' +
				'function(id) returning one. There is no default fire flow requirement; it comes ' +
				'from a code or a standard and only the caller knows which.');
		}

		m = copyModel(model);
		for (i = 0; i < m.nodes.length; i++) { byId[m.nodes[i].id] = m.nodes[i]; }

		ctx = {
			model: m,
			solve: opts.solve,
			residual: residual,
			maxFlow: maxFlow,
			flowTol: flowTol,
			design: design,
			requiredFor: typeof opts.required === 'function'
				? opts.required
				: function () { return opts.required; },
			// **WHAT DRAWING THE REQUIRED FLOW HERE DID TO EVERYTHING ELSE IN SCOPE.** The tested
			// junction is excluded from the node list by construction: it is expected to be pulled
			// down -- that is what the residual criterion is FOR -- and counting it as its own
			// casualty would report every passing junction as a design issue.
			sideEffects: function (result, testedId) {
				var out = { nodes: [], links: [] }, j, id, p, v;
				if (!result || !result.pressures) { return out; }
				for (j = 0; j < design.nodes.length; j++) {
					id = design.nodes[j];
					if (id === testedId) { continue; }
					p = result.pressures[id];
					if (typeof p === 'number' && isFinite(p) && p < design.minPressure) {
						out.nodes.push({ id: id, pressure: p });
					}
				}
				for (j = 0; j < design.links.length; j++) {
					id = design.links[j];
					v = result.velocities ? result.velocities[id] : undefined;
					if (typeof v === 'number' && isFinite(v) && v > design.maxVelocity) {
						out.links.push({ id: id, velocity: v });
					}
				}
				return out;
			}
		};

		function record(rec) {
			results.push(rec);
			totalSolves += rec.solves || 0;
			counts[rec.state]++;
			if (opts.onProgress) {
				opts.onProgress({ done: results.length, total: ids.length, id: rec.id, result: rec });
			}
		}

		function next(k) {
			var node;
			if (k >= ids.length) { return Promise.resolve(); }
			if (opts.shouldStop && opts.shouldStop()) { stopped = true; return Promise.resolve(); }
			node = byId[ids[k]];
			// A junction that is not in the model, or is not a junction, is REPORTED rather than
			// skipped. A sweep that silently tested fewer junctions than it was asked to would
			// report a clean system by leaving out the part that is not.
			if (!node) {
				record({ id: ids[k], state: STATES.ERROR, code: CODES.UNKNOWN_NODE, solves: 0 });
				return next(k + 1);
			}
			if (node.type !== 'junction') {
				record({ id: ids[k], state: STATES.ERROR, code: CODES.NOT_A_JUNCTION,
					type: node.type, solves: 0 });
				return next(k + 1);
			}
			return testJunction(ctx, node).then(function (rec) {
				record(rec);
				return yieldTo().then(function () { return next(k + 1); });
			});
		}

		return next(0).then(function () {
			var index = {}, j;
			for (j = 0; j < results.length; j++) { index[results[j].id] = results[j]; }
			return {
				ok: true,
				results: results,
				byId: index,
				counts: counts,
				// What was asked, carried with the answers: a report that does not state its own
				// criteria is a table of numbers nobody can check.
				requested: ids.length,
				residual: residual,
				maxFlow: maxFlow,
				design: design ? { minPressure: design.minPressure, maxVelocity: design.maxVelocity,
					nodes: design.nodes.length, links: design.links.length } : null,
				solves: totalSolves,
				stopped: stopped,
				// STATED, NOT IMPLIED. See LOSS_ACCOUNTING above.
				lossAccounting: LOSS_ACCOUNTING,
				isoCap: ISO_SINGLE_HYDRANT_CAP
			};
		});
	}

	EngCalcs.lpnFireFlowSweep = sweep;
	EngCalcs.lpnFireFlowStates = STATES;
	EngCalcs.lpnFireFlowCodes = CODES;
	EngCalcs.lpnFireFlowDefaults = DEFAULTS;
	EngCalcs.lpnFireFlowIsoCap = ISO_SINGLE_HYDRANT_CAP;
	EngCalcs.lpnFireFlowLossAccounting = LOSS_ACCOUNTING;
	EngCalcs.lpnFireFlowPsiToHead = psiToHead;
	EngCalcs.lpnFireFlowGpmToSI = gpmToSI;
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
