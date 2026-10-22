// lpn-native-run.js -- THE BUILT-IN SOLVER'S EXTENDED-PERIOD LOOP, SLICES 1 AND 2 (Task 733, phase 3).
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
// SLICE 2, SIMPLE CONTROLS ([CONTROLS]), also from OWA-EPANET 2.3.5:
//   controldata()   input3.c -- what a control line means: OPEN/CLOSED, or a number that is a pump's
//                   speed, a valve's setting, or a pipe's open (> 0) or closed (0); and input1.c
//                   adjustdata()'s conversions (a tank's level and a junction's pressure become a
//                   head above the node's elevation; AT TIME is truncated to the whole second).
//   controls()      hydraul.c -- before each solve: a tank control fires when the tank's volume is
//                   within one second's inflow of the control level, AT TIME when the clock equals
//                   it, AT CLOCKTIME when the time of day does; in file order, so the last control
//                   to fire on a link wins. A status or setting changes only if it differs.
//   pswitch()       hydsolver.c -- a control on a JUNCTION's pressure is decided inside the solve,
//                   on each converged trial (lpnSolve's `opts.pswitch`), not between steps.
//   controltimestep() hydraul.c -- the step is cut to land on the second a tank reaches a control
//                   level, an AT TIME, or an AT CLOCKTIME, but only for a control that would change
//                   its link's status or setting.
//   setlinkstatus()/pumpcoeff() -- a pump's setting is its speed, applied to the curve by the
//                   affinity laws (h0 s^2, a s^(2-b)); OPEN is speed 1, CLOSED speed 0.
// Times are whole seconds, as EPANET's are.
//
// WHAT IT REFUSES, by name, so the caller can hand the network to the EPANET engine exactly as it
// does for anything the built-in solver cannot do (see EngCalcs.lpnNativeRunRefusals): rules, a
// pump on a speed pattern, a tank on a volume curve, water quality, EPANET-MSX, pump energy, a
// control on a junction's pressure that acts on a valve, a control conditioned on a reservoir, and
// what lpnDiagnose refuses of the built-in solver (a pressure-driven demand model). Each one is a
// later slice (dev/native-eps-plan.md), or a case nobody has asked for that EPANET's own code makes
// awkward to copy exactly.
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
		ids = [];
		var nodeType = {}, linkOf = {};
		(model.nodes || []).forEach(function (n) { nodeType[String(n.id)] = n.type; });
		(model.links || []).forEach(function (l) { linkOf[String(l.id)] = l; });
		(time.controls || []).forEach(function (c) {
			var cond = c.condition || {}, l = linkOf[String(c.link)], act = c.action || {};
			if (!l) { return; }   // left out of the run, as js/lpn-epanet.js leaves it out
			if (cond.kind === 'node' && nodeType[String(cond.node)] === 'reservoir') { ids.push(String(c.link)); return; }
			if (cond.kind === 'node' && nodeType[String(cond.node)] === 'junction' && l.type === 'valve') { ids.push(String(c.link)); return; }
			// EPANET refuses these when it reads the file (input3.c controldata(): error 207, 211).
			if (!act.status && l.type === 'valve' && String(l.valveType).toUpperCase() === 'GPV') { ids.push(String(c.link)); return; }
			if (!act.status && l.type !== 'valve' && !(act.setting >= 0)) { ids.push(String(c.link)); return; }
			// ...and a control on a check-valve pipe (error 207, "attempt to control a CV").
			if (l.type === 'pipe' && l.status === 'cv') { ids.push(String(c.link)); }
		});
		add('native-run-control-unsupported', ids);
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
			patStep, patStart, repStep, hydStep, tStart, byPat = {}, dm, tanks = [], frames = [], warnings = [],
			htime = 0, rtime, guard = 0, res, stepModel, tstep, t, nextPat, dmult, levelNow = {}, cur,
			links, ls, ctl, tankById = {}, nodeById = {};
		if (refusals.length) { return { ok: false, refused: true, issues: refusals }; }
		tm = model.time || {};
		times = Object.assign({}, EC.lpnTimesDefaults(), tm.times || {});
		dur = times.duration > 0 ? times.duration : 0;
		patStep = times.patternStep > 0 ? times.patternStep : 3600;
		patStart = times.patternStart > 0 ? times.patternStart : 0;
		repStep = times.reportStep > 0 ? times.reportStep : 3600;
		tStart = times.startClock > 0 ? times.startClock % SEC_PER_DAY : 0;
		// input1.c: the hydraulic step is never longer than the pattern step or the report step.
		hydStep = times.hydraulicStep > 0 ? times.hydraulicStep : 3600;
		if (hydStep > patStep) { hydStep = patStep; }
		if (hydStep > repStep) { hydStep = repStep; }
		(tm.patterns || []).forEach(function (p) { byPat[String(p.id)] = p; });
		dm = model.hydraulics && typeof model.hydraulics.demandMultiplier === 'number'
			? model.hydraulics.demandMultiplier : 1;
		dmult = dm;

		model.nodes.forEach(function (n) {
			nodeById[String(n.id)] = n;
			if (tankHasArea(n)) {
				tanks.push(tankState(n));
				tankById[String(n.id)] = tanks[tanks.length - 1];
				levelNow[n.id] = solverLevel(tanks[tanks.length - 1]);
			}
		});
		links = model.links;
		ls = links.map(linkState);
		ctl = compileControls(model, links, nodeById, tankById, warnings);

		function mult(patId, time) {
			var p = patId ? byPat[String(patId)] : null;
			return p ? EC.lpnPatternValue(p, time, patStep, patStart) : 1;
		}
		function stepNodes(time) {
			return model.nodes.map(function (n) {
				var c, sum;
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
		// hydsolver.c pswitch(): the controls on a junction's pressure, judged on a converged trial.
		// Only pipes and pumps reach here (a valve under one is refused). EPANET compares the
		// pipe's STATUS and the pump's SETTING, and changes both when either differs.
		function pswitch(stepLinks) {
			return function (headOf) {
				var any = false;
				ctl.forEach(function (c) {
					var h, reset = false, st = ls[c.k], s;
					if (c.on !== 'junction') { return; }
					h = headOf(c.node) / FT;
					if (c.type === LOWLEVEL && h <= c.grade + HTOL) { reset = true; }
					if (c.type === HILEVEL && h >= c.grade - HTOL) { reset = true; }
					if (!reset) { return; }
					s = st.s === XHEAD || st.s === TEMPCLOSED ? OPEN : st.s;
					if ((st.kind === 'pipe' && s !== c.status) || (st.kind === 'pump' && st.k !== c.setting)) {
						st.s = c.status;
						if (st.kind === 'pump') { st.k = c.setting; }
						applyLink(stepLinks[c.k], st);
						any = true;
					}
				});
				return any;
			};
		}
		rtime = repStep;

		for (;;) {
			// ---- hydraul.c runhyd(): demands(), then controls(), then the solve ----
			controls(ctl, ls, tankById, htime, tStart);
			cur = stepNodes(htime);
			var stepLinks = links.map(function (l, k) { return applyLink(Object.assign({}, l), ls[k]); });
			stepModel = Object.assign({}, model, { nodes: cur, links: stepLinks });
			delete stepModel.time;
			var sOpts = {};
			if (opts.tol) { sOpts.tol = opts.tol; }
			if (ctl.some(function (c) { return c.on === 'junction'; })) { sOpts.pswitch = pswitch(stepLinks); }
			sOpts.tempClosed = {};
			ls.forEach(function (st, k) { if (st.s === TEMPCLOSED) { sOpts.tempClosed[links[k].id] = true; } });
			// A check valve the last step shut starts this solve shut, as EPANET carries its status.
			sOpts.cvClosed = {};
			ls.forEach(function (st, k) { if (st.kind === 'cv' && st.s === CLOSED) { sOpts.cvClosed[links[k].id] = true; } });
			res = EC.lpnSolve(stepModel, sOpts);
			if (!res.ok) { return { ok: false, issues: res.issues || [], t: htime }; }
			readBack(stepModel, stepLinks, ls, res);
			// A tank's net inflow, from the link flows the solve returned (a link a full or empty tank
			// shut reports no flow, which is what keeps the level from passing its limits).
			tanks.forEach(function (tk) {
				var s = 0;
				links.forEach(function (l) {
					var q = res.flows[l.id] || 0;
					if (l.to === tk.id) { s += q; }
					if (l.from === tk.id) { s -= q; }
				});
				tk.q = s * 1000 / LPS_PER_CFS;   // cfs, as EPANET holds it
			});
			if (isReportTime(htime)) {
				frames.push(frameOf(model, cur, res, htime, tanks, ls));
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
				ts = round(xt);
				if (ts > 0 && ts < tstep) { tstep = ts; }
			});
			tstep = controlTimestep(ctl, ls, tankById, htime, tStart, tstep);
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

	// ---- SIMPLE CONTROLS (slice 2) -----------------------------------------------------------------
	//
	// EPANET's link STATE, by its own codes (types.h StatusType), because the controls compare them
	// as numbers: `<= CLOSED` is "shut for any reason". TEMPCLOSED is a link a full or empty tank
	// shut and XHEAD a pump that cannot lift against the head; both are what the LAST solve ended
	// with, and the next solve starts by re-opening them (hydstatus.c linkstatus()), but a control
	// sees them in between -- controltimestep() cuts the step for `status != control status`.
	var XHEAD = 0, TEMPCLOSED = 1, CLOSED = 2, OPEN = 3, ACTIVE = 4, XFCV = 6, XPRESSURE = 7,
		MISSING = -1e10,                    // types.h MISSING, an unset valve setting
		LOWLEVEL = 0, HILEVEL = 1, TIMER = 2, TIMEOFDAY = 3,
		SEC_PER_DAY = 86400,
		HTOL = 0.0005;                      // ft (input1.c HTOL), pswitch()'s head tolerance

	// ROUND, as consts.h defines it (half away from zero).
	function round(x) { return x >= 0 ? Math.floor(x + 0.5) : -Math.floor(-x + 0.5); }

	// One link's state as hydraul.c inithyd() starts it. `kind` is how a control treats it: a pump
	// with no curve is written to EPANET as a pipe (js/lpn-epanet.js), so it is one here too.
	function linkState(l) {
		var closed, st = { s: OPEN, k: MISSING, kind: 'pipe' };
		if (l.type === 'pump' && (l.h0 > 0 || l.a > 0)) {
			closed = (l.statusBase !== undefined ? l.statusBase : l.status) === 'closed';
			st.kind = 'pump';
			// The curve at speed 1. A page model carries it as h0Base/aBase beside its speed; a model
			// without them has its speed already in h0/a and EPANET is handed no SPEED, so 1.
			st.h0 = l.h0Base !== undefined ? l.h0Base : l.h0;
			st.a = l.aBase !== undefined ? l.aBase : l.a;
			st.b = l.b;
			// input3.c changestatus(): a pump stated Closed has setting 0; otherwise its speed.
			st.s = closed ? CLOSED : OPEN;
			st.k = closed ? 0 : (l.h0Base !== undefined && l.speed > 0 ? l.speed : 1);
			return st;
		}
		if (l.type === 'valve') {
			st.kind = 'valve';
			st.vt = String(l.valveType || 'TCV').toUpperCase();
			if (st.vt === 'GPV') {           // input3.c valvedata(): a GPV is OPEN, its setting its curve
				st.s = l.status === 'closed' ? CLOSED : OPEN;
				st.k = 1;
				return st;
			}
			// valvedata() starts a valve ACTIVE at its setting; inithyd() unsets the setting of one
			// stated Closed (or Open), which is what makes it FIXED.
			if (l.status === 'closed') { st.s = CLOSED; st.k = MISSING; }
			else { st.s = ACTIVE; st.k = l.setting || 0; }
			return st;
		}
		// A check-valve pipe (status 'cv') starts OPEN and the solve decides it (Task 733's seam).
		if (l.type === 'pipe' && l.status === 'cv') { st.kind = 'cv'; return st; }
		st.s = l.status === 'closed' ? CLOSED : OPEN;
		return st;
	}

	// The step's copy of a link, as the built-in solver is to see it this step. TEMPCLOSED and
	// XHEAD are open to the solver: it re-decides both, as linkstatus() does.
	function applyLink(c, st) {
		if (st.kind === 'pump') {
			if (st.s === CLOSED || st.k === 0) { c.status = 'closed'; return c; }
			c.status = 'open';
			c.h0 = st.h0 * st.k * st.k;
			c.a = st.a * Math.pow(st.k, 2 - st.b);
			// A custom (multi-point) curve is turned by js/lpn-solver.js itself, from its points
			// (curveSI) and this speed; h0 above is then its shutoff head at speed. Only a page
			// model's: one without h0Base states its speed already in h0 and pumpSpeed.
			if (c.h0Base !== undefined) { c.pumpSpeed = st.k; }
			return c;
		}
		if (st.kind === 'valve') {
			delete c.valveFixed;
			if (st.vt === 'GPV') { c.status = st.s === CLOSED ? 'closed' : 'open'; return c; }
			if (st.k === MISSING) {
				if (st.s === CLOSED) { c.status = 'closed'; return c; }
				c.status = 'open';
				// Fixed open: a PRV, PSV or FCV is told so; a TCV or PBV with no setting is its open
				// minor loss, which a setting of zero is in both engines (hydcoeffs.c tcvcoeff(),
				// pbvcoeff(); js/lpn-epanet.js writes a TCV's minor loss as 0).
				if (st.vt === 'PRV' || st.vt === 'PSV' || st.vt === 'FCV') { c.valveFixed = 'open'; }
				else { c.setting = 0; }
				return c;
			}
			c.status = 'open';
			c.setting = st.k;
			return c;
		}
		if (st.kind === 'cv') { c.status = 'cv'; return c; }
		c.status = st.s === CLOSED ? 'closed' : 'open';
		return c;
	}

	// What the solve ended with, in EPANET's codes, for the controls to compare.
	function readBack(stepModel, stepLinks, ls, res) {
		var tankShut = {}, byId = {}, cvShut = {};
		(res.tankClosed || []).forEach(function (id) { tankShut[String(id)] = true; });
		(res.cvClosed || []).forEach(function (id) { cvShut[String(id)] = true; });
		stepModel.nodes.forEach(function (n) { byId[String(n.id)] = n; });
		stepLinks.forEach(function (l, k) {
			var st = ls[k], vs, gain;
			if (st.kind === 'pipe') {
				if (st.s !== CLOSED) { st.s = tankShut[String(l.id)] ? TEMPCLOSED : OPEN; }
				return;
			}
			if (st.kind === 'cv') {
				st.s = cvShut[String(l.id)] ? CLOSED : tankShut[String(l.id)] ? TEMPCLOSED : OPEN;
				return;
			}
			if (st.kind === 'pump') {
				if (st.s === CLOSED || st.k === 0) { return; }
				// hydstatus.c pumpstatus(): head gain above the speed-adjusted shutoff head is XHEAD;
				// then tankstatus(), which can shut it as it can any link to a tank.
				gain = (headOf(l.to) - headOf(l.from)) / FT;
				st.s = OPEN;
				if (gain > st.k * st.k * st.h0 / FT + HTOL) { st.s = XHEAD; }
				if (tankShut[String(l.id)]) { st.s = TEMPCLOSED; }
				return;
			}
			if (st.k === MISSING || !(st.vt === 'PRV' || st.vt === 'PSV' || st.vt === 'FCV')) { return; }
			vs = res.valveStatus && res.valveStatus[l.id];
			st.s = vs === 'open' ? OPEN : vs === 'closed' ? CLOSED : vs === 'xpressure' ? XPRESSURE :
				vs === 'xfcv' ? XFCV : ACTIVE;
		});
		function headOf(id) {
			var h = res.heads[id];
			return typeof h === 'number' ? h : (byId[String(id)] && byId[String(id)].head) || 0;
		}
	}

	// input3.c controldata() and input1.c adjustdata(): each control as EPANET holds it. A control
	// on an asset not in the run is left out, as js/lpn-epanet.js leaves it out, and said the same way.
	function compileControls(model, links, nodeById, tankById, warnings) {
		var out = [], linkIx = {}, dropped = [];
		links.forEach(function (l, k) { linkIx[String(l.id)] = k; });
		((model.time && model.time.controls) || []).forEach(function (c) {
			var cond = c.condition, act = c.action || {}, k = linkIx[String(c.link)], st, rec, n, hrs, sec;
			if (!cond) { return; }
			if (k === undefined || (cond.kind === 'node' && !nodeById[String(cond.node)])) {
				if (dropped.indexOf(String(c.link)) < 0) { dropped.push(String(c.link)); }
				return;
			}
			st = linkState(links[k]);
			rec = { k: k, status: ACTIVE, setting: MISSING };
			if (act.status) {
				rec.status = act.status === 'closed' ? CLOSED : OPEN;
				if (st.kind === 'pump') { rec.setting = act.status === 'closed' ? 0 : 1; }
				if (st.kind === 'valve' && st.vt === 'GPV') { rec.setting = 1; }
			} else if (isFinite(act.setting)) {
				rec.setting = act.setting;
				if (st.kind === 'pump' || st.kind === 'pipe') { rec.status = act.setting === 0 ? CLOSED : OPEN; }
			} else { return; }
			if (cond.kind === 'node') {
				n = nodeById[String(cond.node)];
				rec.type = cond.cmp === 'above' ? HILEVEL : LOWLEVEL;
				rec.node = String(cond.node);
				rec.on = tankById[rec.node] ? 'tank' : 'junction';
				// The control level as a head in feet: the node's elevation plus the level (a tank)
				// or the pressure (a junction), both stated in metres in the LPS file.
				rec.grade = (n.elev || 0) / FT + cond.value / FT;
			} else if (cond.kind === 'time' || cond.kind === 'clocktime') {
				// js/lpn-epanet.js writes H:MM[:SS]; input2.c hour() reads it back as decimal hours
				// and controldata() truncates 3600 x hours to a whole second.
				sec = Math.max(0, Math.round(cond.seconds || 0));
				hrs = Math.floor(sec / 3600) + Math.floor((sec % 3600) / 60) / 60 + (sec % 60) / 3600;
				rec.time = Math.trunc(3600 * hrs);
				rec.type = cond.kind === 'time' ? TIMER : TIMEOFDAY;
				if (rec.type === TIMEOFDAY) { rec.time %= SEC_PER_DAY; }
			} else { return; }
			out.push(rec);
		});
		if (dropped.length) { warnings.push({ code: 'control-inactive', ids: dropped }); }
		return out;
	}

	// hydraul.c tankvolume(), no volume curve (slice 5 refuses one).
	function tankVolume(tk, h) { return tk.Vmin + (h - tk.Hmin) * tk.A; }

	// hydraul.c controls(): the tank, time and time-of-day controls, before the step's solve.
	function controls(ctl, ls, tankById, htime, tStart) {
		ctl.forEach(function (c) {
			var reset = false, tk, v1, v2, vplus, st = ls[c.k], s1, k2;
			if (c.on === 'tank') {
				tk = tankById[c.node];
				vplus = Math.abs(tk.q || 0);
				v1 = tankVolume(tk, tk.h);
				v2 = tankVolume(tk, c.grade);
				if (c.type === LOWLEVEL && v1 <= v2 + vplus) { reset = true; }
				if (c.type === HILEVEL && v1 >= v2 - vplus) { reset = true; }
			}
			if (c.type === TIMER && c.time === htime) { reset = true; }
			if (c.type === TIMEOFDAY && (htime + tStart) % SEC_PER_DAY === c.time) { reset = true; }
			if (!reset) { return; }
			s1 = st.s <= CLOSED ? CLOSED : OPEN;
			k2 = st.kind !== 'pipe' ? c.setting : st.k;
			if (s1 !== c.status || st.k !== k2) { st.s = c.status; st.k = k2; }
		});
	}

	// hydraul.c controltimestep(): the step cut to the next control that would change something.
	function controlTimestep(ctl, ls, tankById, htime, tStart, tstep) {
		ctl.forEach(function (c) {
			var t = 0, tk, q, st = ls[c.k], t1;
			if (c.node !== undefined) {
				if (c.on !== 'tank') { return; }
				tk = tankById[c.node];
				q = tk.q || 0;
				if (Math.abs(q) <= QZERO) { return; }
				if ((tk.h < c.grade && c.type === HILEVEL && q > 0) || (tk.h > c.grade && c.type === LOWLEVEL && q < 0)) {
					t = round((tankVolume(tk, c.grade) - tk.V) / q);
				}
			}
			if (c.type === TIMER && c.time > htime) { t = c.time - htime; }
			if (c.type === TIMEOFDAY) {
				t1 = (htime + tStart) % SEC_PER_DAY;
				t = c.time >= t1 ? c.time - t1 : SEC_PER_DAY - t1 + c.time;
			}
			if (t > 0 && t < tstep && ((st.kind !== 'pipe' && st.k !== c.setting) || st.s !== c.status)) {
				tstep = t;
			}
		});
		return tstep;
	}

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

	function frameOf(model, cur, res, t, tanks, ls) {
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
		// epanet.c EN_getlinkvalue(EN_STATUS): anything `<= CLOSED` reads closed, a pump at speed 0 too.
		model.links.forEach(function (l, k) {
			var st = ls[k];
			f.statuses[l.id] = (st.s <= CLOSED || (st.kind === 'pump' && st.k === 0)) ? 'closed' : 'open';
		});
		return f;
	}
}(typeof globalThis !== 'undefined' ? globalThis : this));
