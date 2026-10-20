// lpn-durfire.js -- a fire flow for a stated duration inside an extended-period run. Computation only.
//
// THE PRACTICE (Bentley's wiki, "Running a fire flow analysis in EPS (a fire that lasts a certain
// duration)"): put the fire demand on one hydrant node as a demand that is on for a stated time,
// run the whole extended-period simulation, and read how the tanks drain and the pressures
// respond. Bentley's Automated Fire Flow tool is one instant; this is the manual practice, named.
//
// **THE FIRE IS A SECOND DEMAND CATEGORY ON THE JUNCTION, AT ITS OWN PATTERN.** The pattern is 1
// during the fire's periods and 0 in every other, so EPANET applies it on its own clock and the
// engine, not this file, does the run. The junction's own demands are untouched.
//
// **ON A COPY, ALWAYS.** The model handed in is assembleModel()'s; the junction and the pattern
// list are new objects here, and nothing the caller passed is written to. The user's project is
// never touched (CLAUDE.md: only the user touches a file's numbers).
//
// **THE FIRE STARTS AND ENDS ON PATTERN PERIODS.** One [TIMES] Pattern Timestep serves every
// pattern in a run, so a fire that begins between two periods cannot be stated without changing
// that step for every other demand. It is refused by name rather than rounded.
//
// PURE, like js/lpn-fireflow.js and js/lpn-criticality.js: values in, values out. No DOM, no
// `doc`, no strings, no engine of its own.

var EngCalcs = (typeof require === 'function' && typeof module !== 'undefined')
	? require('./PipeHydraulics.lib.js')
	: (EngCalcs || {});

(function () {
	'use strict';

	var CODES = {
		OK: 'ok',
		NO_CLOCK: 'no-clock',          // the project has no extended-period duration
		NOT_JUNCTION: 'not-junction',  // the named node is not a junction of this model
		BAD_FLOW: 'bad-flow',
		MISALIGNED: 'misaligned',      // start or end is not on a pattern period
		OUTSIDE: 'outside-the-run'     // the fire starts at or after the end of the run
	};
	var PATTERN_ID = 'DURATION_FIRE';
	// How far a tank or a junction may sit from its no-fire value at the last step and still be
	// called recovered: a tenth of a metre of head, about 0.14 psi.
	var RECOVERED_TOL = 0.1;
	// A fire flow delivered within this fraction of what was asked counts as delivered.
	var DELIVERED_TOL = 0.01;

	function patternIdFor(patterns) {
		var id = PATTERN_ID, k = 1, used = {};
		(patterns || []).forEach(function (p) { used[String(p.id)] = true; });
		while (used[id]) { id = PATTERN_ID + '_' + (++k); }
		return id;
	}

	/**
	 * model, { nodeId, flow (m3/s), start (s), duration (s) } ->
	 *   { ok: true, model, fire: { nodeId, flow, start, end, pattern } }
	 *   { ok: false, code }
	 * `model` is a new object; the caller's is not changed.
	 */
	function fireModel(model, opts) {
		var times = model && model.time && model.time.times,
			step, shift, runLen, node, k0, k1, n, mults = [], k, pid, pats, mult, base, rows, fire;
		if (!times || !(times.duration > 0)) { return { ok: false, code: CODES.NO_CLOCK }; }
		node = null;
		model.nodes.forEach(function (x) { if (x.id === opts.nodeId && x.type === 'junction') { node = x; } });
		if (!node) { return { ok: false, code: CODES.NOT_JUNCTION }; }
		if (!(opts.flow > 0) || !isFinite(opts.flow)) { return { ok: false, code: CODES.BAD_FLOW }; }
		step = times.patternStep > 0 ? times.patternStep : 3600;
		shift = times.patternStart > 0 ? times.patternStart : 0;
		runLen = times.duration;
		if (!(opts.duration > 0) || !(opts.start >= 0) || !isFinite(opts.start) || !isFinite(opts.duration)) {
			return { ok: false, code: CODES.MISALIGNED, step: step };
		}
		if (opts.start >= runLen) { return { ok: false, code: CODES.OUTSIDE }; }
		if (Math.abs((opts.start + shift) / step - Math.round((opts.start + shift) / step)) > 1e-9 ||
			Math.abs(opts.duration / step - Math.round(opts.duration / step)) > 1e-9) {
			return { ok: false, code: CODES.MISALIGNED, step: step };
		}
		k0 = Math.round((opts.start + shift) / step);
		k1 = k0 + Math.round(opts.duration / step);
		// Long enough that the run never wraps back to its first period (EPANET repeats a pattern).
		n = Math.max(k1, Math.floor((runLen + shift) / step) + 1) + 1;
		for (k = 0; k < n; k++) { mults.push(k >= k0 && k < k1 ? 1 : 0); }
		pats = (model.time.patterns || []).slice();
		pid = patternIdFor(pats);
		pats.push({ id: pid, multipliers: mults });
		// The scenario's demand multiplier is an [OPTIONS] value EPANET applies to every demand
		// category, this one included. The fire is stated as the flow drawn, so it is divided out.
		mult = model.hydraulics && model.hydraulics.demandMultiplier;
		base = opts.flow / (typeof mult === 'number' && mult > 0 ? mult : 1);
		rows = (node.demands && node.demands.length)
			? node.demands.map(function (d) { return Object.assign({}, d); })
			: [{ base: node.demandBase !== undefined ? node.demandBase : (node.demand || 0), pattern: node.demandPattern || null }];
		rows.push({ base: base, pattern: pid });
		fire = Object.assign({}, node, { demands: rows });
		return {
			ok: true,
			model: Object.assign({}, model, {
				nodes: model.nodes.map(function (x) { return x === node ? fire : x; }),
				time: Object.assign({}, model.time, { patterns: pats })
			}),
			fire: { nodeId: opts.nodeId, flow: opts.flow, start: opts.start, end: opts.start + opts.duration, pattern: pid }
		};
	}

	function emptyAt(frames, node) {
		var i, lvl;
		for (i = 0; i < frames.length; i++) {
			lvl = frames[i].levels ? frames[i].levels[node.id] : undefined;
			if (typeof lvl === 'number' && lvl <= (node.minLevel || 0) + 1e-3) { return { id: node.id, t: frames[i].t }; }
		}
		return null;
	}

	/**
	 * What the run says, from two EPANET runs of the same project -- `base` without the fire and
	 * `fired` with it -- and the model they were built from.
	 * opts: { model, fire (from fireModel), residual (m of head), base, fired }
	 */
	function digest(opts) {
		var model = opts.model, fire = opts.fire, base = opts.base, fired = opts.fired,
			frames = (fired && fired.frames) || [], baseFrames = (base && base.frames) || [],
			junctions = model.nodes.filter(function (n) { return n.type === 'junction'; }),
			tanks = model.nodes.filter(function (n) { return n.type === 'tank'; }),
			stopT = Infinity, firstEmpty = null, out, baseAt = {}, usable, last, lastBase, i, j, p;
		if (!fired || (!fired.ok && !frames.length)) { return { ok: false }; }
		baseFrames.forEach(function (f) { baseAt[f.t] = f; });
		tanks.forEach(function (t) {
			var e = emptyAt(frames, t);
			if (e && (!firstEmpty || e.t < firstEmpty.t)) { firstEmpty = e; }
		});
		if (firstEmpty) { stopT = firstEmpty.t; }
		if (!fired.ok && typeof fired.stoppedAt === 'number') { stopT = Math.min(stopT, fired.stoppedAt); }
		// Pressures are read only before a tank empties: EPANET closes an empty tank and reports a
		// head of minus millions of metres for every junction left without a source.
		usable = frames.filter(function (f) { return f.t < stopT; });
		out = {
			ok: true, fire: fire, residual: opts.residual,
			lowest: null, lowestAtFire: null, delivered: null, shortfall: false, series: [], tanks: [],
			emptyAt: firstEmpty, stoppedAt: (!fired.ok && typeof fired.stoppedAt === 'number') ? fired.stoppedAt : null,
			steps: frames.length, usableSteps: usable.length,
			recovery: null, recoveryNote: null
		};
		for (i = 0; i < usable.length; i++) {
			for (j = 0; j < junctions.length; j++) {
				p = usable[i].pressures ? usable[i].pressures[junctions[j].id] : undefined;
				if (typeof p === 'number' && isFinite(p) && (!out.lowest || p < out.lowest.pressure)) {
					out.lowest = { id: junctions[j].id, pressure: p, t: usable[i].t };
				}
			}
		}
		frames.forEach(function (f) {
			var pf = f.pressures ? f.pressures[fire.nodeId] : undefined,
				b = baseAt[f.t], pb = b && b.pressures ? b.pressures[fire.nodeId] : undefined,
				on = f.t >= fire.start && f.t < fire.end, reliable = f.t < stopT;
			out.series.push({
				t: f.t, fire: on, reliable: reliable,
				pressure: reliable && typeof pf === 'number' ? pf : undefined,
				pressureNoFire: typeof pb === 'number' ? pb : undefined
			});
			if (on && reliable && typeof pf === 'number' && (!out.lowestAtFire || pf < out.lowestAtFire.pressure)) {
				out.lowestAtFire = { pressure: pf, t: f.t };
			}
		});
		// The fire flow actually delivered: the junction's demand with the fire less its demand
		// without it. A demand-driven run always delivers the stated flow; a pressure-driven run
		// delivers less where the pressure falls, and the residual test means nothing then.
		frames.forEach(function (f) {
			var b = baseAt[f.t], dF = f.demands ? f.demands[fire.nodeId] : undefined,
				dB = b && b.demands ? b.demands[fire.nodeId] : undefined, got;
			if (!(f.t >= fire.start && f.t < fire.end) || !(f.t < stopT) ||
				typeof dF !== 'number' || typeof dB !== 'number') { return; }
			got = dF - dB;
			if (!out.delivered || got < out.delivered.flow) { out.delivered = { flow: got, t: f.t }; }
		});
		out.shortfall = !!(out.delivered && out.delivered.flow < fire.flow * (1 - DELIVERED_TOL));
		out.holds = out.lowestAtFire ? out.lowestAtFire.pressure >= opts.residual : null;
		tanks.forEach(function (t) {
			var low = null, e = emptyAt(frames, t);
			frames.forEach(function (f) {
				var v = f.levels ? f.levels[t.id] : undefined;
				if (typeof v === 'number' && isFinite(v) && (!low || v < low.level)) { low = { level: v, t: f.t }; }
			});
			last = frames[frames.length - 1];
			lastBase = baseFrames[baseFrames.length - 1];
			var start = frames.length && frames[0].levels ? frames[0].levels[t.id] : undefined;
			out.tanks.push({
				id: t.id, lowest: low, emptyAt: e,
				min: t.minLevel || 0, start: start,
				margin: low ? low.level - (t.minLevel || 0) : undefined,
				drop: (low && typeof start === 'number') ? start - low.level : undefined,
				final: last && last.levels ? last.levels[t.id] : undefined,
				finalNoFire: lastBase && lastBase.levels ? lastBase.levels[t.id] : undefined
			});
		});
		// Recovery: at the last reporting step, how far any junction or tank is from the same run
		// without the fire. A fire that lasts to the end of the run, or a run cut short, has none.
		last = frames[frames.length - 1];
		lastBase = baseFrames[baseFrames.length - 1];
		if (fire.end >= (model.time.times.duration || 0)) {
			out.recoveryNote = 'to-end';
		} else if (stopT < Infinity || !last || !lastBase || last.t !== lastBase.t) {
			out.recoveryNote = 'cut-short';
		} else {
			var worstJ = null, worstT = null;
			model.nodes.forEach(function (n) {
				var x, y, d;
				if (n.type === 'reservoir') { return; }
				x = last.pressures ? last.pressures[n.id] : undefined;
				y = lastBase.pressures ? lastBase.pressures[n.id] : undefined;
				if (typeof x !== 'number' || typeof y !== 'number' || !isFinite(x) || !isFinite(y)) { return; }
				d = Math.abs(x - y);
				// A tank's pressure is its water depth, so its difference is a LEVEL difference.
				if (n.type === 'tank') { if (!worstT || d > worstT.diff) { worstT = { id: n.id, diff: d }; } }
				else if (!worstJ || d > worstJ.diff) { worstJ = { id: n.id, diff: d }; }
			});
			out.recovery = {
				t: last.t, tol: RECOVERED_TOL,
				junction: worstJ && worstJ.diff > RECOVERED_TOL ? worstJ : null,
				tank: worstT && worstT.diff > RECOVERED_TOL ? worstT : null
			};
			out.recovery.recovered = !out.recovery.junction && !out.recovery.tank;
		}
		return out;
	}

	EngCalcs.lpnDurFireModel = fireModel;
	EngCalcs.lpnDurFireDigest = digest;
	EngCalcs.lpnDurFireCodes = CODES;
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
