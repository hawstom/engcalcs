// lpn-criticality.js -- criticality analysis: break each asset in turn and report what the system
// loses. Computation only.
//
// THE QUESTION, in Tom's words, 2026-09-30, reading about WaterGEMS: *"Criticality analysis: This
// sounds like a fun report to build. Break each asset and report."* WaterGEMS's Criticality tool
// loops through the segments it is given, turning each off in turn. EPANET has no such tool and no
// term for it, so the industry's name is the one used.
//
// **ONE ASSET OUT AT A TIME, THE SAME STATE AS UNCHECKING "PART OF THIS NETWORK".** An inactive
// element is not in the model assembleModel() builds, so breaking a link here means the case model
// simply does not have it. Then, for that case:
//
//   CUT OFF       every junction left with no path, through open links, to a reservoir or a tank.
//                 Found by walking the graph, never by watching a solve fail: a junction with no
//                 source is not a small pressure, it is a question with no answer.
//   NOT SERVED    the sum of the cut-off junctions' demands at this time step.
//   BELOW MINIMUM every junction still connected whose pressure falls below the caller's minimum
//                 -- and that was NOT already below it with nothing broken. A junction that fails
//                 with the whole network intact would otherwise appear on every row, which says
//                 nothing about any one asset; the caller is told how many there were instead.
//
// The cut-off junctions are REMOVED from the case model before it is solved, with every link that
// touches them. Both engines would refuse, or invent pressures for, a junction with no source; the
// connected remainder is a well-posed network and its answer is the one the report wants.
//
// PURE, like js/lpn-fireflow.js: values in, values out. No DOM, no `doc`, no strings, no engine of
// its own (options.solve is injected, because a network holding a PRV/PSV/FCV goes to EPANET
// whatever the preference says). It never touches the caller's model: every case is a new object
// whose node and link lists are new arrays, and nothing here writes a field on a node or a link.

var EngCalcs = (typeof require === 'function' && typeof module !== 'undefined')
	? require('./PipeHydraulics.lib.js')
	: (EngCalcs || {});

(function () {
	'use strict';

	var STATES = {
		IMPACT: 'impact',   // something was cut off or fell below the minimum
		NONE: 'none',       // nothing was lost
		ERROR: 'error'      // the connected remainder did not solve
	};
	// The two solve codes are fire flow's own values, on purpose: one page function turns either
	// sweep's code into words, and two spellings of "did not converge" would be two keys.
	var CODES = {
		OK: 'ok',
		UNKNOWN_LINK: 'link-not-found',
		NO_CONVERGENCE: 'solve-did-not-converge',
		SOLVE_FAILED: 'solve-reported-issues',
		BASELINE_FAILED: 'baseline-did-not-solve'
	};

	function isFixed(n) {
		return EngCalcs.lpnIsFixedHead ? EngCalcs.lpnIsFixedHead(n) : (n.type === 'reservoir' || n.type === 'tank');
	}

	// Which nodes can reach a reservoir or a tank through links that are not closed. The same walk
	// EngCalcs.lpnDiagnose makes for its 'unreachable' check, so the two agree on what "no path"
	// means: a closed link carries nothing, and every other link carries in both directions.
	function reachable(nodes, links) {
		var adj = {}, seen = {}, queue = [], i, id, l;
		for (i = 0; i < nodes.length; i++) { adj[nodes[i].id] = []; }
		for (i = 0; i < links.length; i++) {
			l = links[i];
			if (l.status === 'closed' || !adj[l.from] || !adj[l.to]) { continue; }
			adj[l.from].push(l.to);
			adj[l.to].push(l.from);
		}
		for (i = 0; i < nodes.length; i++) {
			if (isFixed(nodes[i])) { seen[nodes[i].id] = true; queue.push(nodes[i].id); }
		}
		while (queue.length) {
			id = queue.shift();
			for (i = 0; i < adj[id].length; i++) {
				if (!seen[adj[id][i]]) { seen[adj[id][i]] = true; queue.push(adj[id][i]); }
			}
		}
		return seen;
	}

	// The case model: the caller's model with `links` in place of its own, and without the nodes in
	// `drop` or any link touching them. A rule naming a dropped element is dropped too, because
	// EPANET rejects the whole input over one (assembleModel()'s modelRules() says so), and a rule
	// cannot change a single-instant answer anyway.
	function caseModel(model, links, drop) {
		var out = {}, k;
		for (k in model) {
			if (Object.prototype.hasOwnProperty.call(model, k)) { out[k] = model[k]; }
		}
		out.nodes = model.nodes.filter(function (n) { return !drop[n.id]; });
		out.links = links.filter(function (l) { return !drop[l.from] && !drop[l.to]; });
		if (Array.isArray(model.rules) && model.rules.length) {
			var gone = {};
			model.links.forEach(function (l) { gone[l.id] = true; });
			out.links.forEach(function (l) { delete gone[l.id]; });
			out.rules = model.rules.filter(function (r) {
				return !(r.nodes || []).some(function (id) { return drop[id]; }) &&
					!(r.links || []).some(function (id) { return gone[id]; });
			});
		}
		return out;
	}

	function solveOnce(solve, m) {
		return Promise.resolve().then(function () { return solve(m); });
	}
	function badResult(r) {
		if (!r || !r.ok) { return { code: CODES.SOLVE_FAILED, issues: (r && r.issues) || [] }; }
		if (r.converged === false) { return { code: CODES.NO_CONVERGENCE, issues: [] }; }
		return null;
	}
	function defaultYield() {
		if (typeof setTimeout === 'function') {
			return new Promise(function (resolve) { setTimeout(resolve, 0); });
		}
		return Promise.resolve();
	}

	/**
	 * EngCalcs.lpnCriticalitySweep(model, options) -> Promise<resultSet>
	 *
	 * options:
	 *   solve        REQUIRED function(model) -> result | Promise<result>, in lpnSolve's shape
	 *   links        REQUIRED array of link ids to break, one at a time. THE CALLER CHOOSES THE SET.
	 *   minPressure  metres of head; a connected junction below it is counted. 0 when omitted.
	 *   onProgress   function({ done, total, id, result }) after every asset.
	 *   shouldStop   function() -> true to stop between assets; what is done is kept.
	 *   yield        function() -> Promise, between assets, so a long run paints and can be stopped.
	 *
	 * Resolves to { ok, results, byId, requested, minPressure, baselineBelow, baselineCutOff,
	 * solves, stopped } -- or { ok: false, code, issues } when the intact network itself did not
	 * solve, because every row would then be measured against nothing.
	 */
	function sweep(model, options) {
		var opts = options || {},
			ids = opts.links || [],
			minPressure = (typeof opts.minPressure === 'number' && isFinite(opts.minPressure)) ? opts.minPressure : 0,
			yieldTo = opts.yield || defaultYield,
			results = [],
			solves = 0,
			stopped = false,
			linkById = {},
			demandOf = {},
			isJunction = {},
			reach0,
			drop0 = {},
			baseBelow = {},
			baseCut = 0;

		if (typeof opts.solve !== 'function') {
			throw new TypeError('lpnCriticalitySweep: options.solve must be a function(model).');
		}
		model.links.forEach(function (l) { linkById[l.id] = l; });
		model.nodes.forEach(function (n) {
			if (n.type === 'junction') {
				isJunction[n.id] = true;
				demandOf[n.id] = (typeof n.demand === 'number' && isFinite(n.demand)) ? n.demand : 0;
			}
		});

		// THE INTACT NETWORK, ONCE. Its unreachable junctions are nobody's fault in this report, and
		// its low-pressure junctions are said once above the table rather than on every row.
		reach0 = reachable(model.nodes, model.links);
		model.nodes.forEach(function (n) {
			if (!reach0[n.id]) { drop0[n.id] = true; if (isJunction[n.id]) { baseCut++; } }
		});

		function belowIn(result, m) {
			var out = [];
			m.nodes.forEach(function (n) {
				var p = result.pressures ? result.pressures[n.id] : undefined;
				if (isJunction[n.id] && typeof p === 'number' && isFinite(p) && p < minPressure) {
					out.push({ id: n.id, pressure: p });
				}
			});
			return out;
		}

		function breakOne(id) {
			var links, reach, drop = {}, cut = [], unserved = 0, m, rec;
			rec = { id: id };
			if (!linkById[id]) {
				rec.state = STATES.ERROR;
				rec.code = CODES.UNKNOWN_LINK;
				return Promise.resolve(rec);
			}
			rec.type = linkById[id].type;
			links = model.links.filter(function (l) { return l.id !== id; });
			reach = reachable(model.nodes, links);
			model.nodes.forEach(function (n) {
				if (reach[n.id]) { return; }
				drop[n.id] = true;
				if (isJunction[n.id] && reach0[n.id]) { cut.push(n.id); unserved += demandOf[n.id]; }
			});
			rec.cutOff = cut;
			rec.unserved = unserved;
			m = caseModel(model, links, drop);
			if (!m.nodes.some(function (n) { return isJunction[n.id]; })) {
				rec.below = [];
				rec.state = cut.length ? STATES.IMPACT : STATES.NONE;
				rec.code = CODES.OK;
				return Promise.resolve(rec);
			}
			solves++;
			return solveOnce(opts.solve, m).then(function (r) {
				var bad = badResult(r);
				if (bad) {
					rec.state = STATES.ERROR;
					rec.code = bad.code;
					rec.issues = bad.issues;
					return rec;
				}
				rec.below = belowIn(r, m).filter(function (b) { return !baseBelow[b.id]; });
				rec.code = CODES.OK;
				rec.state = (cut.length || rec.below.length) ? STATES.IMPACT : STATES.NONE;
				return rec;
			}, function (err) {
				rec.state = STATES.ERROR;
				rec.code = CODES.SOLVE_FAILED;
				rec.issues = [];
				rec.thrown = String(err && err.message || err);
				return rec;
			});
		}

		function next(k) {
			if (k >= ids.length) { return Promise.resolve(); }
			if (opts.shouldStop && opts.shouldStop()) { stopped = true; return Promise.resolve(); }
			return breakOne(ids[k]).then(function (rec) {
				results.push(rec);
				if (opts.onProgress) {
					opts.onProgress({ done: results.length, total: ids.length, id: rec.id, result: rec });
				}
				return yieldTo().then(function () { return next(k + 1); });
			});
		}

		var base = caseModel(model, model.links, drop0);
		solves++;
		return solveOnce(opts.solve, base).then(function (r) {
			var bad = badResult(r);
			if (bad) { return { ok: false, code: CODES.BASELINE_FAILED, cause: bad.code, issues: bad.issues }; }
			belowIn(r, base).forEach(function (b) { baseBelow[b.id] = true; });
			return next(0).then(function () {
				var byId = {};
				results.forEach(function (rec) { byId[rec.id] = rec; });
				return {
					ok: true,
					results: results,
					byId: byId,
					requested: ids.length,
					minPressure: minPressure,
					baselineBelow: Object.keys(baseBelow).length,
					baselineCutOff: baseCut,
					solves: solves,
					stopped: stopped
				};
			});
		}, function (err) {
			return { ok: false, code: CODES.BASELINE_FAILED, cause: CODES.SOLVE_FAILED, issues: [],
				thrown: String(err && err.message || err) };
		});
	}

	// The reading order: what the system loses most first. Demand not served, then the number of
	// junctions pushed below the minimum; a row whose remainder did not solve sorts after every row
	// that lost something it can measure, and before the rows that lost nothing.
	function severityOrder(results) {
		function rank(r) {
			if (r.state === STATES.IMPACT || (r.state === STATES.ERROR && r.unserved > 0)) { return 0; }
			return r.state === STATES.ERROR ? 1 : 2;
		}
		return results.map(function (r, i) { return { r: r, i: i }; }).sort(function (a, b) {
			var ra = rank(a.r), rb = rank(b.r), da, db, ba, bb;
			if (ra !== rb) { return ra - rb; }
			da = a.r.unserved || 0; db = b.r.unserved || 0;
			if (da !== db) { return db - da; }
			ba = a.r.below ? a.r.below.length : -1; bb = b.r.below ? b.r.below.length : -1;
			if (ba !== bb) { return bb - ba; }
			return a.i - b.i;
		}).map(function (x) { return x.r; });
	}

	EngCalcs.lpnCriticalitySweep = sweep;
	EngCalcs.lpnCriticalityStates = STATES;
	EngCalcs.lpnCriticalityCodes = CODES;
	EngCalcs.lpnCriticalityOrder = severityOrder;
	EngCalcs.lpnCriticalityReachable = reachable;
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
