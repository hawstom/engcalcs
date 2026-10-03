// lpn-demandscale.js -- demand scaling: multiply the junction demands on a copy and solve, and find
// the largest multiplier the system can carry above a pressure limit. Computation only.
//
// THE QUESTION, in Tom's words. 2026-09-30, on WaterGEMS's Active Demand Adjustments: *"This also
// sounds fun and easy to provide."* *"Their Criticality and 'On-the-fly' are like our 'Fire flow'
// analysis; they do not touch the network. As such, our demand factors are similar and equivalent,
// but not the same UX or data state."* 2026-10-01: *"This is absurdly simple, but let's do it ...
// I guess while we are at it, we could do some cooler things like 'What demand scale can the system
// handle with this pressure limit?'"*
//
// **ON TOP OF THE SCENARIO'S OWN MULTIPLIER, NEVER INSTEAD OF IT.** The model handed in is
// assembleModel()'s, whose `demand` is already the active scenario's demand at the time step on
// screen, its own demand multiplier included. This file multiplies that number again, on a copy;
// the scenario's multiplier is data, and this is a question asked of it.
//
// **THE SEARCH IS A BISECTION ON A GRID OF THE TOLERANCE**, so its answer is a multiple of the
// step: m holds the limit and m + step does not, both measured, never interpolated. It assumes what
// a looped water network does -- that more demand never raises the lowest pressure -- and a network
// that broke that rule (a pump or a valve changing state mid-range) would be answered at one of its
// crossings, not necessarily the first.
//
// **THE JUNCTIONS SCALED ARE THE JUNCTIONS JUDGED** (Tom's browser pass, 2026-10-03, on Net3 at
// 7:00: *"The Time Series graph shows all the selected junctions above 55 psi at 7:00. But Scaling
// Find says '⚠ At least one junction is below 20 psi even with the scaled demands at zero.'"*). The
// verdict had been taken over every junction, so a junction beside a tank, low whatever the
// selection draws, answered a question about three others. Under "Selected junctions" the verdict,
// Find's lowest junction and Run's count below the limit are the selection's; Run's tables still
// list every junction, so what the scaling does elsewhere stays in view.
//
// PURE, like js/lpn-fireflow.js and js/lpn-criticality.js: values in, values out. No DOM, no `doc`,
// no strings, no engine of its own (options.solve is injected). It never writes to the caller's
// model: every case is a new model whose scaled junctions are new objects.

var EngCalcs = (typeof require === 'function' && typeof module !== 'undefined')
	? require('./PipeHydraulics.lib.js')
	: (EngCalcs || {});

(function () {
	'use strict';

	// The solve codes are fire flow's own values, so the page turns them into words through the one
	// function it already has.
	var CODES = {
		OK: 'ok',
		NO_CONVERGENCE: 'solve-did-not-converge',
		SOLVE_FAILED: 'solve-reported-issues'
	};
	var OUTCOMES = {
		FOUND: 'found',             // the largest multiplier that holds, inside the range
		HOLDS_TO_MAX: 'holds-to-max', // holds at the top of the range; the true answer is larger
		BELOW_AT_ZERO: 'below-at-zero' // fails even with the scaled demands at zero
	};
	var DEFAULTS = { max: 20, step: 0.01 };

	// The case model: the caller's model with every junction in `scaled` (or every junction, when
	// `scaled` is null) carrying `m` times its demand. Nothing else differs, and nothing is shared
	// that this file writes.
	function scaledModel(model, m, scaled) {
		var out = {}, k, inScope = null;
		if (scaled) { inScope = {}; scaled.forEach(function (id) { inScope[id] = true; }); }
		for (k in model) {
			if (Object.prototype.hasOwnProperty.call(model, k)) { out[k] = model[k]; }
		}
		out.nodes = model.nodes.map(function (n) {
			var c, j;
			if (n.type !== 'junction' || (inScope && !inScope[n.id])) { return n; }
			c = {};
			for (j in n) { if (Object.prototype.hasOwnProperty.call(n, j)) { c[j] = n[j]; } }
			c.demand = ((typeof n.demand === 'number' && isFinite(n.demand)) ? n.demand : 0) * m;
			return c;
		});
		return out;
	}

	function badResult(r) {
		if (!r || !r.ok) { return { code: CODES.SOLVE_FAILED, issues: (r && r.issues) || [] }; }
		if (r.converged === false) { return { code: CODES.NO_CONVERGENCE, issues: [] }; }
		return null;
	}
	function solveCase(solve, model, m, scaled) {
		var cm = scaledModel(model, m, scaled);
		return Promise.resolve().then(function () { return solve(cm); }).then(function (r) {
			var bad = badResult(r);
			if (bad) { return { ok: false, multiplier: m, code: bad.code, issues: bad.issues }; }
			return { ok: true, multiplier: m, code: CODES.OK, result: r };
		}, function (err) {
			return { ok: false, multiplier: m, code: CODES.SOLVE_FAILED, issues: [],
				thrown: String(err && err.message || err) };
		});
	}
	function defaultYield() {
		if (typeof setTimeout === 'function') {
			return new Promise(function (resolve) { setTimeout(resolve, 0); });
		}
		return Promise.resolve();
	}
	function junctionIds(model) {
		return model.nodes.filter(function (n) { return n.type === 'junction'; }).map(function (n) { return n.id; });
	}
	// Every junction's pressure, lowest first, or only those in `only` (an id list) when it is given.
	// A junction the result does not answer is left out.
	function pressureList(model, r, only) {
		var out = [], keep = null;
		if (only) { keep = {}; only.forEach(function (id) { keep[id] = true; }); }
		junctionIds(model).forEach(function (id) {
			var p = r.pressures ? r.pressures[id] : undefined;
			if (keep && !keep[id]) { return; }
			if (typeof p === 'number' && isFinite(p)) { out.push({ id: id, pressure: p }); }
		});
		return out.sort(function (a, b) { return a.pressure - b.pressure; });
	}
	// Every link's velocity, highest first, without the pumps: a pump has no bore to move water
	// through, and the velocity an engine reports for one is not a design reading.
	function velocityList(model, r) {
		var out = [];
		model.links.forEach(function (l) {
			var v = r.velocities ? r.velocities[l.id] : undefined;
			if (l.type === 'pump' || typeof v !== 'number' || !isFinite(v)) { return; }
			out.push({ id: l.id, velocity: Math.abs(v) });
		});
		return out.sort(function (a, b) { return b.velocity - a.velocity; });
	}
	function minPressureOf(opts) {
		return (typeof opts.minPressure === 'number' && isFinite(opts.minPressure)) ? opts.minPressure : 0;
	}

	/**
	 * EngCalcs.lpnDemandScaleRun(model, options) -> Promise<run>
	 *
	 * options:
	 *   solve        REQUIRED function(model) -> result | Promise<result>, in lpnSolve's shape
	 *   multiplier   REQUIRED, zero or more
	 *   junctions    ids whose demands are scaled, and whose pressures are judged; null or omitted
	 *                for every junction
	 *   minPressure  metres of head; 0 when omitted
	 *
	 * Two solves: the scaled case, and the same copy unscaled, so every row can show both.
	 * Resolves to { ok, multiplier, minPressure, pressures: [{id, pressure, unscaled}],
	 * velocities: [{id, velocity, unscaled}], below: [{id, pressure}], solves } -- or { ok: false,
	 * `pressures` is every junction's; `below` only the judged ones' (see `junctions`). `outside` is
	 * the junctions NOT judged that are below minPressure, listed so the page can disclose them: they
	 * never limit an answer (Tom, 2026-10-03).
	 * code, issues, multiplier, solves } when the scaled case did not solve.
	 */
	function run(model, options) {
		var opts = options || {}, m = opts.multiplier, minP = minPressureOf(opts), scaled = opts.junctions || null;
		if (typeof opts.solve !== 'function') {
			throw new TypeError('lpnDemandScaleRun: options.solve must be a function(model).');
		}
		if (typeof m !== 'number' || !isFinite(m) || m < 0) {
			throw new RangeError('lpnDemandScaleRun: options.multiplier must be a number, zero or more.');
		}
		return solveCase(opts.solve, model, m, scaled).then(function (c) {
			if (!c.ok) { return { ok: false, code: c.code, issues: c.issues, multiplier: m, minPressure: minP, solves: 1 }; }
			return solveCase(opts.solve, model, 1, scaled).then(function (b) {
				var pBase = {}, vBase = {}, pressures, velocities, judged = null;
				if (scaled) { judged = {}; scaled.forEach(function (id) { judged[id] = true; }); }
				if (b.ok) {
					pressureList(model, b.result).forEach(function (x) { pBase[x.id] = x.pressure; });
					velocityList(model, b.result).forEach(function (x) { vBase[x.id] = x.velocity; });
				}
				pressures = pressureList(model, c.result).map(function (x) {
					return { id: x.id, pressure: x.pressure, unscaled: pBase[x.id] };
				});
				velocities = velocityList(model, c.result).map(function (x) {
					return { id: x.id, velocity: x.velocity, unscaled: vBase[x.id] };
				});
				return {
					ok: true,
					multiplier: m,
					minPressure: minP,
					pressures: pressures,
					velocities: velocities,
					below: pressures.filter(function (x) { return x.pressure < minP && (!judged || judged[x.id]); })
						.map(function (x) { return { id: x.id, pressure: x.pressure }; }),
					outside: pressures.filter(function (x) { return judged && !judged[x.id] && x.pressure < minP; })
						.map(function (x) { return { id: x.id, pressure: x.pressure }; }),
					unscaledCode: b.code,
					solves: 2
				};
			});
		});
	}

	/**
	 * EngCalcs.lpnDemandScaleSearch(model, options) -> Promise<search>
	 *
	 * The largest multiplier, on a grid of `step` from 0 to `max`, at which every judged junction's
	 * pressure is at or above minPressure (the scaled ones; every junction when `junctions` is null). A case that does not solve counts as not holding, and says why.
	 *
	 * options:
	 *   solve, junctions, minPressure   as for lpnDemandScaleRun
	 *   max          the top of the search, 20 when omitted
	 *   step         the tolerance and the grid, 0.01 when omitted
	 *   onProgress   function({ solves, multiplier, holds }) after every solve
	 *   shouldStop   function() -> true to stop between solves
	 *   yield        function() -> Promise, between solves
	 *
	 * Resolves to { ok: true, outcome, multiplier, holding, failing, belowAtOne, max, step,
	 * minPressure, solves, stopped }. `holding` is the probe at `multiplier` and `failing` the probe
	 * one step above it (or at zero, for BELOW_AT_ZERO; absent for HOLDS_TO_MAX); each is
	 * { multiplier, ok, code, lowest: {id, pressure}, outside: [{id, pressure}] } -- `outside` being
	 * the unselected junctions below minPressure there, which do not limit the answer. A stopped search resolves with outcome null.
	 */
	function search(model, options) {
		var opts = options || {},
			minP = minPressureOf(opts),
			max = (opts.max > 0) ? opts.max : DEFAULTS.max,
			step = (opts.step > 0) ? opts.step : DEFAULTS.step,
			top = Math.round(max / step),
			one = Math.round(1 / step),
			scaled = opts.junctions || null,
			yieldTo = opts.yield || defaultYield,
			solves = 0,
			probes = {};
		if (typeof opts.solve !== 'function') {
			throw new TypeError('lpnDemandScaleSearch: options.solve must be a function(model).');
		}
		// The multiplier at grid point k, rounded so a printed 1.37 is the number that was solved.
		function mAt(k) { return +(k * step).toFixed(10); }
		function probe(k) {
			if (probes[k]) { return Promise.resolve(probes[k]); }
			solves++;
			return solveCase(opts.solve, model, mAt(k), scaled).then(function (c) {
				var rec = { multiplier: mAt(k), ok: c.ok, code: c.code }, list;
				if (c.ok) {
					list = pressureList(model, c.result, scaled);
					rec.lowest = list.length ? list[0] : null;
					rec.holds = !list.length || list[0].pressure >= minP;
					// Junctions outside the selection that are below the limit at this scale: disclosed,
					// never judged, so they leave `holds` alone.
					rec.outside = scaled ? pressureList(model, c.result).filter(function (x) {
						return scaled.indexOf(x.id) < 0 && x.pressure < minP;
					}) : [];
				} else {
					rec.holds = false;
				}
				probes[k] = rec;
				if (opts.onProgress) { opts.onProgress({ solves: solves, multiplier: rec.multiplier, holds: rec.holds }); }
				return yieldTo().then(function () { return rec; });
			});
		}
		function stopped() { return !!(opts.shouldStop && opts.shouldStop()); }
		function done(outcome, lo, hi) {
			return {
				ok: true,
				outcome: outcome,
				multiplier: lo === null ? undefined : mAt(lo),
				holding: lo === null ? undefined : probes[lo],
				failing: hi === null ? undefined : probes[hi],
				belowAtOne: probes[one] ? !probes[one].holds : undefined,
				max: mAt(top),
				step: step,
				minPressure: minP,
				solves: solves,
				stopped: outcome === null
			};
		}
		function bisect(lo, hi) {
			var mid;
			if (hi - lo <= 1) { return Promise.resolve(done(OUTCOMES.FOUND, lo, hi)); }
			if (stopped()) { return Promise.resolve(done(null, null, null)); }
			mid = Math.floor((lo + hi) / 2);
			return probe(mid).then(function (r) { return r.holds ? bisect(mid, hi) : bisect(lo, mid); });
		}
		// 1x first: it is the question a reader asks before any other, and it halves the range.
		return probe(one).then(function (r1) {
			if (stopped()) { return done(null, null, null); }
			if (r1.holds) {
				return probe(top).then(function (rTop) {
					if (rTop.holds) { return done(OUTCOMES.HOLDS_TO_MAX, top, null); }
					return bisect(one, top);
				});
			}
			return probe(0).then(function (r0) {
				if (!r0.holds) { return done(OUTCOMES.BELOW_AT_ZERO, null, 0); }
				return bisect(0, one);
			});
		});
	}

	EngCalcs.lpnDemandScaleModel = scaledModel;
	EngCalcs.lpnDemandScaleRun = run;
	EngCalcs.lpnDemandScaleSearch = search;
	EngCalcs.lpnDemandScaleOutcomes = OUTCOMES;
	EngCalcs.lpnDemandScaleCodes = CODES;
	EngCalcs.lpnDemandScaleDefaults = DEFAULTS;
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
