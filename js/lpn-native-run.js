// lpn-native-run.js -- THE BUILT-IN SOLVER'S EXTENDED-PERIOD LOOP, SLICE 1 (Task 733, phase 3).
//
// js/lpn-solver.js solves ONE INSTANT. This file walks the clock around it, the way EPANET's own
// runH()/nextH() loop does (hydraul.c), and holds the one piece of state an instant does not have:
// each tank's water level. It adds no hydraulics. Every step builds the model for that moment --
// demands at their pattern multiplier, a reservoir at its head pattern, a tank standing at its
// current level -- and hands it to EngCalcs.lpnSolve, which already knows a tank is a fixed head
// and already shuts a link that would push water into a full tank or draw it from an empty one.
//
// WHAT IS TRANSCRIBED, from OWA-EPANET 2.3.5 (the engine vendored in js/vendor/):
//   timestep()      hydraul.c -- the next step is the shortest of the hydraulic step, the time to the
//                   next pattern period, the time to the next reporting time, and the time for any
//                   tank to fill or drain.
//   tanktimestep()  hydraul.c -- the time to fill or drain is the volume still to go over the net
//                   inflow, rounded to the whole second, and only counted when it falls inside the step.
//   tanklevels()    hydraul.c -- volume moves by inflow x step; within one second of full or empty
//                   it is taken to be full or empty.
//   demands()       hydraul.c -- pattern period = (time + pattern start) / pattern step, modulo the
//                   pattern's length; a reservoir's head is its Head x its pattern.
//   [TIMES]         input1.c -- the hydraulic step is cut to the pattern step and the report step.
// Times are whole seconds, as EPANET's are.
//
// WHAT IT REFUSES, by name, so the caller can hand the network to the EPANET engine exactly as it
// does for anything the built-in solver cannot do (see EngCalcs.lpnNativeRunRefusals): simple
// controls, rules, a pump on a speed pattern, a tank on a volume curve, water quality, EPANET-MSX,
// pump energy, and what lpnDiagnose refuses of the built-in solver (a pressure-driven demand model).
// Each one is a later slice (dev/native-eps-plan.md).
//
// NOT WIRED TO THE PAGE. js/lpn-time.js still sends every period run to EPANET, and this file is
// loaded by nothing a visitor loads. It is here, and held to EPANET's answer by
// dev/lpn-spike/native-eps-harness.js, so that the slices after it have a floor to stand on.

(function (root) {
	'use strict';

	var EC = root.EngCalcs = root.EngCalcs || {};

	// **A TANK IS CARRIED IN EPANET'S OWN UNITS, FOR ONE REASON.** The bridge always hands the
	// engine an LPS-and-metres file, which EPANET turns into feet and cubic feet with the constants
	// below (consts.h, input1.c). Two things then depend on that arithmetic and not on physics:
	//   1. a litre per second is 1/28.317 cfs while a cubic foot is 28.3168466 L, so a tank's volume
	//      moves 5.6e-6 faster than exact SI says (about a tenth of a millimetre over a 20 m swing);
	//   2. whether a tank AT ITS MAXIMUM is full is decided by `head >= Hmax` on a head rebuilt from
	//      the volume (hydraul.c tankgrade), and that comparison goes either way in the last bit. A
	//      full tank whose rebuilt head lands a hair under Hmax is NOT closed to inflow by EPANET
	//      (hydstatus.c tankstatus), so it keeps taking water at its limit. Measured on a 10 m tank
	//      with a 12 m limit; a 3 m limit on the same tank went the other way. The built-in solver
	//      is handed the answer to that comparison as a level just under the limit, so both engines
	//      shut the same links.
	// The emptiness test cannot go the other way: a snapped-empty head is Hmin + 0.
	var FT = 0.3048,                       // m per ft            (MperFT)
		FT3 = FT * FT * FT,                // m3 per ft3          (Ucf[VOLUME], input1.c)
		LPS_PER_CFS = 28.317,              // L/s per cfs         (LPSperCFS, which is NOT 1000 / 0.0283168466)
		QZERO = 1e-6,                      // cfs                 (consts.h)
		EDGE = 1e-9;                       // m, the hair a not-quite-full level is kept under its limit

	function tankHasArea(n) { return n.type === 'tank' && n.diameter > 0; }

	/**
	 * The reasons the built-in solver cannot run this model's period, as `{code, ids}` records, or
	 * an empty list when it can. Pure: nothing is solved.
	 */
	EC.lpnNativeRunRefusals = function (model) {
		var out = [], time = (model && model.time) || {}, ids, q;
		function add(code, list, always) { if (always || list.length) { out.push({ code: code, ids: list }); } }
		if ((time.controls || []).length) {
			add('native-run-controls', time.controls.map(function (c) { return String(c.link); }));
		}
		if (model.rules && model.rules.length) { add('native-run-rules', [], true); }
		ids = [];
		(model.links || []).forEach(function (l) { if (l.type === 'pump' && l.speedPattern) { ids.push(l.id); } });
		add('native-run-speed-pattern', ids);
		ids = [];
		(model.nodes || []).forEach(function (n) {
			if (n.type === 'tank' && (n.volCurve || n.volCurveName)) { ids.push(n.id); }
		});
		add('native-run-volume-curve', ids);
		ids = [];
		(model.nodes || []).forEach(function (n) {
			if (tankHasArea(n) && !(n.minLevel <= n.level && n.level <= n.maxLevel && n.minLevel < n.maxLevel)) {
				ids.push(n.id);
			}
		});
		add('native-run-tank-levels', ids);
		q = model.quality;
		if (q && q.mode && q.mode !== 'none') { add('native-run-quality', [], true); }
		if (model.msx) { add('native-run-quality', [], true); }
		if (model.energy && (model.links || []).some(function (l) { return l.type === 'pump'; })) {
			add('native-run-energy', [], true);
		}
		return out;
	};

	/**
	 * Run the period. Returns `{ok:true, engine:'native', frames, warnings, duration}` in the shape
	 * EngCalcs.lpnEpanetRun resolves to (frames carry t, heads, pressures, demands, levels, flows,
	 * velocities, headlosses, statuses and the step's convergence), or `{ok:false, refused:true,
	 * issues}` when it cannot, which is the caller's cue to use EPANET. A network the built-in
	 * solver refuses at any step (lpnDiagnose) comes back `{ok:false, issues}`.
	 *
	 * `options.tol` is the per-step solve tolerance (lpnSolve's own default when absent).
	 */
	EC.lpnNativeRun = function (model, options) {
		var opts = options || {}, refusals = EC.lpnNativeRunRefusals(model), tm, times, dur,
			patStep, patStart, repStep, hydStep, byPat = {}, dm, tanks = [], frames = [], warnings = [],
			htime = 0, rtime, guard = 0, i, res, stepModel, tstep, t, nextPat, dmult, levelNow = {}, cur;
		if (refusals.length) { return { ok: false, refused: true, issues: refusals }; }
		tm = model.time || {};
		times = Object.assign({}, EC.lpnTimesDefaults(), tm.times || {});
		dur = times.duration > 0 ? times.duration : 0;
		patStep = times.patternStep > 0 ? times.patternStep : 3600;
		patStart = times.patternStart > 0 ? times.patternStart : 0;
		repStep = times.reportStep > 0 ? times.reportStep : 3600;
		// input1.c: the hydraulic step is never longer than the pattern step or the report step.
		hydStep = times.hydraulicStep > 0 ? times.hydraulicStep : 3600;
		if (hydStep > patStep) { hydStep = patStep; }
		if (hydStep > repStep) { hydStep = repStep; }
		(tm.patterns || []).forEach(function (p) { byPat[String(p.id)] = p; });
		dm = model.hydraulics && typeof model.hydraulics.demandMultiplier === 'number'
			? model.hydraulics.demandMultiplier : 1;
		dmult = dm;

		model.nodes.forEach(function (n) {
			if (tankHasArea(n)) {
				tanks.push(tankState(n));
				levelNow[n.id] = solverLevel(tanks[tanks.length - 1]);
			}
		});

		function mult(patId, time) {
			var p = patId ? byPat[String(patId)] : null;
			return p ? EC.lpnPatternValue(p, time, patStep, patStart) : 1;
		}
		function stepNodes(time) {
			return model.nodes.map(function (n) {
				var c, rows, sum;
				if (n.type === 'junction') {
					if (n.demands && n.demands.length) {
						sum = 0;
						n.demands.forEach(function (r) { sum += (r.base || 0) * mult(r.pattern, time) * dmult; });
						c = Object.assign({}, n); c.demand = sum;
						return c;
					}
					if (typeof n.demandBase === 'number') {
						c = Object.assign({}, n); c.demand = n.demandBase * mult(n.demandPattern, time) * dmult;
						return c;
					}
					return n;
				}
				if (n.type === 'reservoir' && n.headPattern && typeof n.headBase === 'number') {
					c = Object.assign({}, n); c.head = n.headBase * mult(n.headPattern, time);
					return c;
				}
				if (tankHasArea(n)) {
					c = Object.assign({}, n);
					c.level = levelNow[n.id];
					c.head = (n.elev || 0) + levelNow[n.id];
					return c;
				}
				return n;
			});
		}
		function isReportTime(now) {
			return now >= times.reportStart && ((now - times.reportStart) % repStep) === 0 && now <= dur;
		}
		rtime = repStep;

		for (;;) {
			cur = stepNodes(htime);
			stepModel = Object.assign({}, model, { nodes: cur });
			delete stepModel.time;
			res = EC.lpnSolve(stepModel, opts.tol ? { tol: opts.tol } : undefined);
			if (!res.ok) { return { ok: false, issues: res.issues || [], t: htime }; }
			// A tank's net inflow, from the link flows the solve returned (a link a full or empty tank
			// shut reports no flow, which is what keeps the level from passing its limits).
			tanks.forEach(function (tk) {
				var s = 0;
				model.links.forEach(function (l) {
					var q = res.flows[l.id] || 0;
					if (l.to === tk.id) { s += q; }
					if (l.from === tk.id) { s -= q; }
				});
				tk.q = s * 1000 / LPS_PER_CFS;   // cfs, as EPANET holds it
			});
			if (isReportTime(htime)) {
				frames.push(frameOf(model, cur, res, htime, levelNow, tanks));
			}
			if (!(htime < dur)) { break; }
			// ---- hydraul.c timestep() ----
			tstep = hydStep;
			nextPat = (Math.floor((htime + patStart) / patStep) + 1) * patStep - htime;
			if (nextPat > 0 && nextPat < tstep) { tstep = nextPat; }
			t = rtime - htime;
			if (t > 0 && t < tstep) { tstep = t; }
			tanks.forEach(function (tk) {   // tanktimestep()
				var q = tk.q, v, xt, ts;
				if (Math.abs(q) <= QZERO) { return; }
				if (q > 0 && tk.h < tk.Hmax) { v = tk.Vmax - tk.V; }
				else if (q < 0 && tk.h > tk.Hmin) { v = tk.Vmin - tk.V; }
				else { return; }
				xt = v / q;
				if (Math.abs(xt) > tstep + 1) { return; }
				ts = Math.floor(xt + 0.5);
				if (ts > 0 && ts < tstep) { tstep = ts; }
			});
			tanks.forEach(function (tk) {   // tanklevels()
				var q = tk.q;
				if (Math.abs(q) <= QZERO) { return; }
				tk.V += q * tstep;
				if (tk.V + q >= tk.Vmax) { tk.V = tk.Vmax; }
				else if (tk.V - q <= tk.Vmin) { tk.V = tk.Vmin; }
				tk.h = tk.Hmin + (tk.V - tk.Vmin) / tk.A;
				levelNow[tk.id] = solverLevel(tk);
			});
			htime += tstep;
			if (htime >= rtime) { rtime += repStep; }
			if (++guard >= 100000) { break; }
		}
		return { ok: true, engine: 'native', frames: frames, warnings: warnings, duration: dur };
	};

	// One tank in EPANET's internal units (input1.c, input3.c).
	function tankState(n) {
		var area = Math.PI * n.diameter * n.diameter / 4,
			vminM = area * n.minLevel,
			El = (n.elev || 0) / FT,
			tk = {
				id: n.id, node: n, El: El,
				Hmin: El + n.minLevel / FT, Hmax: El + n.maxLevel / FT,
				A: Math.PI * Math.pow(n.diameter / FT, 2) / 4,
				Vmin: vminM / FT3,
				Vmax: (vminM + area * (n.maxLevel - n.minLevel)) / FT3,
				V: (vminM + area * (n.level - n.minLevel)) / FT3
			};
		tk.h = El + n.level / FT;   // hydraul.c initialises the grade to H0, not to tankgrade(V0)
		return tk;
	}
	// The level (m above the base) the built-in solver is handed: the limit itself when EPANET
	// would call the tank full or empty, and otherwise a level kept a hair inside the limits.
	function solverLevel(tk) {
		var n = tk.node, lvl = (tk.h - tk.El) * FT;
		if (tk.h >= tk.Hmax) { return n.maxLevel; }
		if (tk.h <= tk.Hmin) { return n.minLevel; }
		return Math.min(n.maxLevel - EDGE, Math.max(n.minLevel + EDGE, lvl));
	}

	function frameOf(model, cur, res, t, levelNow, tanks) {
		var f = {
			t: t, heads: Object.assign({}, res.heads), pressures: Object.assign({}, res.pressures),
			demands: {}, levels: {}, flows: Object.assign({}, res.flows),
			velocities: Object.assign({}, res.velocities), headlosses: Object.assign({}, res.headlosses),
			statuses: {}, converged: res.converged, relativeError: res.relativeError,
			accuracy: res.accuracy, iterations: res.iterations
		}, byTank = {}, tk;
		tanks.forEach(function (tk) { byTank[tk.id] = tk; });
		cur.forEach(function (n) {
			if (byTank[n.id]) {
				tk = byTank[n.id];
				f.demands[n.id] = tk.q * LPS_PER_CFS / 1000;
				f.levels[n.id] = (tk.h - tk.El) * FT;
				f.heads[n.id] = tk.h * FT;
				return;
			}
			f.demands[n.id] = n.type === 'junction' ? (n.demand || 0) : 0;
		});
		model.links.forEach(function (l) {
			var vs = res.valveStatus && res.valveStatus[l.id];
			f.statuses[l.id] = (l.status === 'closed' || vs === 'closed') ? 'closed' : 'open';
		});
		return f;
	}
}(typeof globalThis !== 'undefined' ? globalThis : this));
