// lpn-native-run.js -- THE BUILT-IN SOLVER'S EXTENDED-PERIOD LOOP, SLICES 1 TO 6 (Task 733, phase 3).
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
// SLICE 3, PUMP SPEED PATTERNS AND A PUMP'S STARTING STATE, also from OWA-EPANET 2.3.5:
//   demands()       hydraul.c -- at EVERY hydraulic step, before the controls, a pump on a pattern
//                   is handed that period's multiplier as its speed (setlinksetting()): above 0 it
//                   OPENS a pump that is shut for any reason, a stated Closed or a control's
//                   included; exactly 0 shuts an open one. So a control that shuts a pump on a
//                   pattern holds only until the next step, in EPANET and here alike.
//   pumpdata()      input3.c -- a pump's SPEED is its starting setting, and a SPEED of 0 is a pump
//                   that is OPEN at speed 0: no flow (pumpcoeff()), but its status reads open.
// SLICE 4, RULE-BASED CONTROLS ([RULES]), also from OWA-EPANET 2.3.5 (rules.c, hydraul.c):
//   input1.c        -- the rule time step is a tenth of the (adjusted) hydraulic step, in whole
//                   seconds, and never more than the hydraulic step.
//   ruletimestep()  hydraul.c -- instead of one tanklevels() over the whole step, the clock is
//                   walked in rule steps (the first only up to the next multiple of the rule
//                   step), the tanks are moved by each increment, and checkrules() is asked after
//                   each; the first increment at which an action is actually TAKEN ends the step.
//                   So a rule firing between hydraulic steps shortens the step, and the tanks are
//                   already where they stood at that moment.
//   checkrules()    rules.c -- every rule in file order; premises true adds its THEN actions to the
//                   action list, false its ELSE actions. A link already on the list keeps its
//                   action unless the new rule's PRIORITY is strictly higher. The list is built by
//                   pushing on the front, so actions are taken last-added first (order never
//                   matters, one action per link).
//   evalpremises()  rules.c -- the first premise is an AND; an OR premise is judged only while the
//                   result so far is false, an AND premise ends the rule at the first false result.
//   checkvalue()    rules.c -- node and link values are those of the LAST solve (tank levels moved
//                   by tanklevels() since), judged in the file's units with a tolerance of 0.001,
//                   and with EPANET's own lopsided <= and >= (LE is false above value - tol).
//   checktime()     rules.c -- TIME and CLOCKTIME compare the END of the increment; `=` and `<>`
//                   ask whether the stated second fell inside it (past midnight too).
//   checkstatus()   rules.c -- anything at or below CLOSED reads closed, ACTIVE reads active.
//   takeactions()   rules.c -- OPEN on a closed link and CLOSED on an open one are setlinkstatus();
//                   a number is setlinksetting(), taken only when it differs from the link's
//                   setting by more than 0.001 in EPANET's internal units (feet of head, cfs). A
//                   pipe given a number is opened (non-zero) or closed (zero). ACTIVE does nothing
//                   but still holds its link's place on the action list.
//   hour()          input2.c -- how "10 AM", "13:30", "36 HOURS" become seconds.
// Times are whole seconds, as EPANET's are.
//
// SLICE 5, TANK VOLUME CURVES, MINIMUM VOLUME AND OVERFLOW, also from OWA-EPANET 2.3.5:
//   inittanks()     input1.c -- a tank on a VOLUME curve takes its minimum, maximum and initial volumes
//                   from the curve read at MinLvl, MaxLvl and InitLvl; a stated MinVol is then ignored.
//   tankdata()      input3.c -- with no curve Vmin is MinVol when above 0 (else area x MinLvl) and the
//                   others are measured up from it, so a stated MinVol only moves the zero of the scale.
//   tankvolume(), tankgrade(), interp()  hydraul.c, project.c -- level to volume and back by linear
//                   interpolation on the curve, never extrapolating past either end; the curve stays in
//                   the file's units (here metres and cubic metres, as js/lpn-epanet.js writes it).
//   tankstatus()    hydstatus.c -- a full tank closes the link into it unless CanOverflow is set; an
//                   overflowing tank at its maximum keeps taking the inflow, tanklevels() holds its
//                   volume at Vmax, and the excess is the tank's reported inflow.
//   validate.c      a curve that does not reach from MinLvl to MaxLvl is error 225.
// tanktimestep(), controls(), controltimestep() and the rules need no change: they already read the
// volume through tankVolume()/tankGrade(), which are now the curve's when there is one.
//
// SLICE 6, PUMP ENERGY, also from OWA-EPANET 2.3.5 (hydraul.c, output.c, report.c):
//   getenergy()     hydraul.c -- a pump's kW = head across it (ft) x flow (cfs) x specific gravity / 8.814 /
//                   efficiency x 0.7457; zero when the link is CLOSED, XHEAD or TEMPCLOSED (status <= CLOSED).
//                   Efficiency is the global one (default 75 percent) or the pump's EFFIC curve read at its
//                   flow brought to full speed (q / speed, in the file's flow unit), then "Sarbu and Borza"
//                   100 - (100 - e) x (1 / speed)^0.1, held between 1 and 100 percent.
//   getallpumpsenergy(), nexthyd()  hydraul.c -- power and efficiency are read from each step's solution
//                   BEFORE the step is chosen (rules and controls act after), and a pump whose efficiency
//                   reads 0 (closed) is skipped.
//   addenergy()     hydraul.c -- per step of hstep seconds (one hour when the duration is 0, nothing at
//                   the final instant): time on line, efficiency x dt, kW/Q x dt, kWh, the largest kW, and
//                   cost = price x kW x dt, the price being the pump's own (when above 0) or the global
//                   one, times the pump's price pattern or else the global pattern, at period
//                   (time + pattern start) / pattern step; Emax is the largest sum of kW over the pumps
//                   that were on line at one step.
//   saveenergy()    output.c -- the report's numbers: usage as a share of the duration, efficiency, kW and
//                   kWh/flow averaged over the time on line, cost per day (x 24 / duration), and the
//                   demand charge = Emax x Demand Charge; writeenergy() (report.c) prints the totals line.
//
// WHAT IT REFUSES, by name, so the caller can hand the network to the EPANET engine exactly as it
// does for anything the built-in solver cannot do (see EngCalcs.lpnNativeRunRefusals): a rule the
// loop does not copy exactly (a rule on a pipe's roughness, a reservoir's level or pressure, a
// GPV's setting; one EPANET itself rejects when it reads the file), a speed pattern that is not the page's (a pump without its unscaled curve, a pattern the model
// lacks, a negative multiplier), a tank that names a volume curve it has no usable rows for (or one EPANET refuses), water quality, EPANET-MSX, pump energy EPANET itself refuses to read (a price pattern the model lacks, a negative price or demand charge, a global efficiency of 0 or less, an efficiency curve whose flows do not increase), a
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
		EDGE = 1e-9,                       // m, the hair a not-quite-full level is kept under its limit
		KW_PER_HP = 0.7457,                // types.h KWperHP
		CBIG = 1e8,                        // consts.h, the conductance pumpcoeff() gives a pump at setting 0
		EPUMP = 75;                        // input1.c / types.h EPUMP, the default pump efficiency (percent)

	function tankHasArea(n) { return n.type === 'tank' && n.diameter > 0; }
	// The rows of a tank's volume curve, [[level m, volume m3], ...], exactly as the bridge writes them
	// (js/lpn-epanet.js: a curve goes out only with a name AND rows), or null.
	function curveRows(n) {
		var r = n.volCurveSI, i;
		if (!n.volCurve || !r || r.length < 2) { return null; }
		for (i = 0; i < r.length; i++) {
			if (!(isFinite(r[i][0]) && isFinite(r[i][1]))) { return null; }
			if (i && !(r[i][0] > r[i - 1][0])) { return null; }   // input3.c curvedata(): X must increase (error 230)
		}
		// validate.c: the curve must reach from MinLvl to MaxLvl, within TINY (error 225); EPANET
		// refuses to run otherwise, so the built-in loop names it rather than inventing an answer.
		if (n.minLevel < r[0][0] - 1e-6 || n.maxLevel > r[r.length - 1][0] + 1e-6) { return null; }
		return r;
	}
	// project.c interp(): linear on a data curve, never extrapolating past either end; a step in x
	// of under TINY (1e-6) returns the upper y.
	function interp(x, y, xx) {
		var n = x.length, k, dx, dy;
		if (n === 0) { return 0; }
		if (xx <= x[0]) { return y[0]; }
		for (k = 1; k < n; k++) {
			if (x[k] >= xx) {
				dx = x[k] - x[k - 1]; dy = y[k] - y[k - 1];
				if (Math.abs(dx) < 1e-6) { return y[k]; }
				return y[k] - (x[k] - xx) * dy / dx;
			}
		}
		return y[n - 1];
	}
	// hydraul.c tankvolume(): the cylinder (Vmin + (h - Hmin) x A) when there is no curve; with one,
	// the curve read at the level in the curve's own units (the file's, here metres and cubic
	// metres), brought to cubic feet. `h` is a head in feet.
	function tankVolume(tk, h) {
		if (!tk.cx) { return tk.Vmin + (h - tk.Hmin) * tk.A; }
		return interp(tk.cx, tk.cy, (h - tk.El) * FT) / FT3;
	}
	// hydraul.c tankgrade(): the other way, interpolating the curve with volume as the abscissa.
	function tankGrade(tk, v) {
		if (!tk.cx) { return tk.Hmin + (v - tk.Vmin) / tk.A; }
		return tk.El + interp(tk.cy, tk.cx, v * FT3) / FT;
	}

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
		if (model.rules && model.rules.length) {
			var rp = parseRules(model, nodeType, linkOf);
			if (rp.bad.length) { add('native-run-rules', rp.bad); }
			// input1.c: a rule step of zero (a hydraulic step under 10 s) is EPANET's `% 0`.
			else if (hydStepOf(time.times) < 10) { add('native-run-rules', ['Rule Timestep']); }
		}
		// A speed pattern is run only on the page's own model of a pump: the curve at speed 1 beside
		// it (h0Base/aBase), which is also the only pump js/lpn-epanet.js writes a PATTERN for
		// (pumpEps). A pump with no curve is a pipe to both engines and its pattern means nothing.
		ids = [];
		(model.links || []).forEach(function (l) {
			var p;
			if (l.type !== 'pump' || !l.speedPattern || !(l.h0 > 0 || l.a > 0)) { return; }
			p = ((model.time && model.time.patterns) || []).filter(function (x) { return String(x.id) === String(l.speedPattern); })[0];
			if (l.h0Base === undefined || !p || (p.multipliers || []).some(function (v) { return !(v >= 0); })) { ids.push(l.id); }
		});
		add('native-run-speed-pattern', ids);
		ids = [];
		(model.nodes || []).forEach(function (n) {
			// SLICE 5 RUNS A VOLUME CURVE THE PAGE HANDED OVER (`volCurve` with `volCurveSI`, the
			// level in metres and the volume in cubic metres, js/lpn-time.js lpnTankVolumeAttach). A
			// tank that NAMES a curve the model carries no usable rows for is refused: the bridge
			// would write it as a cylinder, which of the two was meant is not ours to say. So is a
			// curve EPANET itself will not run (fewer than two rows, X not increasing, not reaching
			// from MinLvl to MaxLvl: validate.c error 225).
			if (n.type === 'tank' && (n.volCurveName || n.volCurve) && !curveRows(n)) { ids.push(n.id); }
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
		add('native-run-energy', energyConfig(model).bad);
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
			patStep, patStart, repStep, hydStep, tStart, byPat = {}, dm, tanks = [], frames = [], warnings = [], solveTimes = [],
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
		var speedPat = [];   // [k, pattern id] of each pump on a speed pattern (slice 3)
		links.forEach(function (l, k) { if (ls[k].kind === 'pump' && l.speedPattern) { speedPat.push([k, l.speedPattern]); } });

		// ---- PUMP ENERGY (slice 6): the pumps EPANET would list, in file order, with their sums ----
		var ecfg = energyConfig(model), epumps = [], emax = 0, anyPumpLink = false;
		links.forEach(function (l, k) {
			var pe;
			if (l.type === 'pump') { anyPumpLink = true; }
			if (ls[k].kind !== 'pump') { return; }
			pe = ecfg.per[String(l.id)] || null;
			epumps.push({ k: k, id: l.id, from: l.from, to: l.to, pe: pe, p: 0, e: 0, q: 0,
				hours: 0, eff: 0, perFlow: 0, kwh: 0, maxKw: 0, cost: 0 });
		});

		// ---- RULES (slice 4): compiled once; evaluated inside the step, by ruleTimestep() below ----
		var rules = [], linkIxById = {}, curById = {}, dsys = 0, ruleStep = 0, nodeTypeOf = {}, linkOfId = {};
		links.forEach(function (l, k) { linkIxById[String(l.id)] = k; linkOfId[String(l.id)] = l; });
		model.nodes.forEach(function (n) { nodeTypeOf[String(n.id)] = n.type; });
		if (model.rules && model.rules.length) {
			rules = parseRules(model, nodeTypeOf, linkOfId).rules;
			ruleStep = Math.min(Math.floor(hydStep / 10), hydStep);   // input1.c adjustdata()
		}

		function mult(patId, time) {
			var p = patId ? byPat[String(patId)] : null;
			return p ? EC.lpnPatternValue(p, time, patStep, patStart) : 1;
		}
		function stepNodes(time) {
			dsys = 0;   // hydraul.c demands(): Dsystem, the demand categories above zero
			return model.nodes.map(function (n) {
				var c, sum, dj;
				if (n.type === 'junction') {
					if (n.demands && n.demands.length) {
						sum = 0;
						n.demands.forEach(function (r) { dj = (r.base || 0) * mult(r.pattern, time) * dmult; if (dj > 0) { dsys += dj; } sum += dj; });
						c = Object.assign({}, n); c.demand = sum;
						return c;
					}
					if (typeof n.demandBase === 'number') {
						c = Object.assign({}, n); c.demand = n.demandBase * mult(n.demandPattern, time) * dmult;
						if (c.demand > 0) { dsys += c.demand; }
						return c;
					}
					if (n.demand > 0) { dsys += n.demand; }
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
		// hydraul.c tanklevels()
		function tankLevels(dt) {
			tanks.forEach(function (tk) {
				var q = tk.q;
				if (Math.abs(q) <= QZERO) { return; }
				tk.V += q * dt;
				if (tk.V + q >= tk.Vmax) { tk.V = tk.Vmax; }
				else if (tk.V - q <= tk.Vmin) { tk.V = tk.Vmin; }
				tk.h = tankGrade(tk, tk.V);
			});
		}
		// The head (m) of a node as rules.c reads NodeHead: a tank's from its volume, any other
		// node's from the last solve.
		function headNow(id) {
			var tk = tankById[id];
			return tk ? tk.h * FT : res.heads[id];
		}
		// rules.c checkvalue(): the numbers are the file's (LPS: metres, L/s), tolerance 0.001.
		function ruleValue(p) {
			var n, tk, x, i, q;
			if (p.sys) { return dsys * 1000; }
			if (p.link) {
				i = linkIxById[p.link];
				if (p.attr === 'FLOW') { return Math.abs(res.flows[p.link] || 0) * 1000; }
				x = ls[i].k;                                      // SETTING
				return x === MISSING ? null : x * p.scale;
			}
			n = nodeById[p.node]; tk = tankById[p.node];
			switch (p.attr) {
			case 'DEMAND':
				if (tk) { return tk.q * LPS_PER_CFS; }
				if (n.type === 'junction') { return (curById[p.node].demand || 0) * 1000; }
				q = 0;                                            // a reservoir: net inflow, as newflows() sums it
				links.forEach(function (l) {
					var f = res.flows[l.id] || 0;
					if (l.to === n.id) { q += f; }
					if (l.from === n.id) { q -= f; }
				});
				return q * 1000;
			case 'HEAD': case 'GRADE': return headNow(p.node);
			case 'LEVEL': case 'PRESSURE': return headNow(p.node) - (n.elev || 0);
			case 'FILLTIME':
				if (!tk || !(tk.q > 1e-6)) { return null; }       // TINY, consts.h; a reservoir has no area
				return (tk.Vmax - tk.V) / tk.q;
			case 'DRAINTIME':
				if (!tk || !(tk.q < -1e-6)) { return null; }
				return (tk.Vmin - tk.V) / tk.q;
			}
			return null;
		}
		// rules.c checkpremise(), t1..t2 being the increment just taken
		function checkPremise(p, t1, t2) {
			var x, v, st, j, tol = RTOL;
			if (p.attr === 'TIME' || p.attr === 'CLOCKTIME') {
				if (p.attr === 'CLOCKTIME') { t1 = (t1 + tStart) % SEC_PER_DAY; t2 = (t2 + tStart) % SEC_PER_DAY; }
				x = p.value;
				switch (p.rel) {
				case R_LT: return t2 < x;
				case R_LE: return t2 <= x;
				case R_GT: return t2 > x;
				case R_GE: return t2 >= x;
				default:   // equality: did the stated second fall inside the increment?
					j = t2 < t1 ? (x >= t1 || x <= t2) : (x >= t1 && x <= t2);   // e.g. 11:00 pm to 1:00 am
					return p.rel === R_EQ ? j : !j;
				}
			}
			if (p.never) { return false; }
			if (p.status > A_NUMBER) {                            // checkstatus()
				st = ls[linkIxById[p.link]].s;
				j = st <= CLOSED ? A_CLOSED : st === ACTIVE ? A_ACTIVE : A_OPEN;
				return (j === p.status && p.rel === R_EQ) || (j !== p.status && p.rel === R_NE);
			}
			v = ruleValue(p);
			if (v === null) { return false; }
			x = p.value;
			switch (p.rel) {
			case R_EQ: return !(Math.abs(v - x) > tol);
			case R_NE: return !(Math.abs(v - x) < tol);
			case R_LT: return !(v > x + tol);
			case R_LE: return !(v > x - tol);
			case R_GT: return !(v < x - tol);
			case R_GE: return !(v < x + tol);
			}
			return false;
		}
		// rules.c evalpremises()
		function evalPremises(r, t1, t2) {
			var result = true, i, p;
			for (i = 0; i < r.prem.length; i++) {
				p = r.prem[i];
				if (p.logop === 'OR') {
					if (result === false) { result = checkPremise(p, t1, t2); }
				} else {
					if (result === false) { return false; }
					result = checkPremise(p, t1, t2);
				}
			}
			return result;
		}
		// rules.c setlinkstatus(), setlinksetting()
		function setStatus(st, open) {
			if (open) {
				if (st.kind === 'pump') { st.k = 1; }
				if (st.kind === 'valve' && st.vt !== 'GPV') { st.k = MISSING; }
				st.s = OPEN;
			} else {
				if (st.kind === 'pump') { st.k = 0; }
				if (st.kind === 'valve' && st.vt !== 'GPV') { st.k = MISSING; }
				st.s = CLOSED;
			}
		}
		function setSetting(st, x) {
			if (st.kind === 'pump') {
				st.k = x;
				if (x > 0 && st.s <= CLOSED) { st.s = OPEN; }
				if (x === 0 && st.s > CLOSED) { st.s = CLOSED; }
			} else if (st.vt === 'FCV') {
				st.k = x; st.s = ACTIVE;
			} else {
				if (st.k === MISSING && st.s <= CLOSED) { st.s = OPEN; }
				st.k = x;
			}
		}
		// rules.c checkrules() with takeactions(): returns how many actions changed something
		function checkRules(t1, t2) {
			var list = [], taken = 0;
			function onList(r, a) {   // onactionlist(): a link on the list stays, unless outranked
				var i;
				for (i = 0; i < list.length; i++) {
					if (list[i].a.link === a.link) {
						if (r.priority > list[i].r.priority) { list[i] = { a: a, r: r }; }
						return true;
					}
				}
				return false;
			}
			rules.forEach(function (r) {
				var acts = evalPremises(r, t1, t2) ? r.then : r.els;
				acts.forEach(function (a) { if (!onList(r, a)) { list.push({ a: a, r: r }); } });
			});
			for (var q = list.length - 1; q >= 0; q--) {   // the list is built from the front
				var a = list[q].a, st = ls[linkIxById[a.link]], flag = false, x, v;
				if (a.status === A_OPEN && st.s <= CLOSED) { setStatus(st, true); flag = true; }
				else if (a.status === A_CLOSED && st.s > CLOSED) { setStatus(st, false); flag = true; }
				else if (a.setting !== null) {
					x = a.setting; v = st.k;
					// EPANET compares in its internal units: feet of head, cubic feet per second.
					if (st.vt === 'PRV' || st.vt === 'PSV' || st.vt === 'PBV') { x /= FT; v /= FT; }
					else if (st.vt === 'FCV') { x = x * 1000 / LPS_PER_CFS; v = v * 1000 / LPS_PER_CFS; }
					if (Math.abs(x - v) > RTOL) { setSetting(st, a.setting); flag = true; }
				}
				if (flag) { taken++; }
			}
			return taken;
		}
		// hydraul.c ruletimestep(): walk the step in rule steps, moving the tanks, until a rule acts
		function ruleTimestep(tstepIn) {
			var tnow = htime, tmax = tnow + tstepIn, now = tnow, dt = ruleStep, dt1 = ruleStep - (tnow % ruleStep);
			dt = Math.min(dt, tstepIn); dt1 = Math.min(dt1, tstepIn);
			if (dt1 === 0) { dt1 = dt; }
			do {
				now += dt1;
				tankLevels(dt1);
				if (checkRules(now - dt1 + 1, now)) { break; }
				dt = Math.min(dt, tmax - now);
				dt1 = dt;
			} while (dt > 0);
			return now - tnow;
		}
		// hydraul.c getallpumpsenergy(): each pump's power and efficiency from this step's solution.
		function pumpsEnergyNow() {
			epumps.forEach(function (pu) {
				var st = ls[pu.k], h1 = nodeHeadM(pu.from) / FT, h2 = nodeHeadM(pu.to) / FT, q = (res.flows[pu.id] || 0) * 1000 / LPS_PER_CFS, r;
				// hydcoeffs.c pumpcoeff(): a pump at setting 0 is a link of conductance 1/CBIG, so the flow
				// EPANET holds for it is the head difference over CBIG (a few millionths of a cfs), where
				// the built-in solver, which shuts it, holds 0. getenergy() reads that flow.
				if (st.k === 0 && st.s > CLOSED) { q = (h1 - h2) / CBIG; }
				r = pumpEnergyNow(ecfg, pu.pe, st.s, st.k, q, h1, h2);
				pu.p = r[0]; pu.e = r[1]; pu.q = q;
			});
		}
		function nodeHeadM(id) {
			var tk = tankById[String(id)];
			return tk ? tk.h * FT : res.heads[id];
		}
		// hydraul.c addenergy(): the step of `hstep` seconds starting at htime.
		function addEnergy(hstep) {
			var dt, f0 = 1, psum = 0;
			if (dur === 0) { dt = 1; } else if (htime < dur) { dt = hstep / 3600; } else { dt = 0; }
			if (dt === 0) { return; }
			if (ecfg.epat) { f0 = mult(ecfg.epat, htime); }
			epumps.forEach(function (pu) {
				var q, c;
				if (pu.e === 0) { return; }                       // a closed pump is skipped
				q = Math.max(QZERO, Math.abs(pu.q));
				c = pu.pe && pu.pe.ecost > 0 ? pu.pe.ecost : ecfg.ecost;
				if (pu.pe && pu.pe.epat) { c *= mult(pu.pe.epat, htime); } else { c *= f0; }
				psum += pu.p;
				pu.hours += dt;
				pu.eff += pu.e * dt;
				pu.perFlow += pu.p / q * dt;
				pu.kwh += pu.p * dt;
				pu.maxKw = Math.max(pu.maxKw, pu.p);
				pu.cost += c * pu.p * dt;
			});
			emax = Math.max(emax, psum);
		}
		rtime = repStep;

		for (;;) {
			// ---- hydraul.c runhyd(): demands(), then controls(), then the solve ----
			// demands()' last loop, setlinksetting() on a pump: the multiplier IS the speed.
			speedPat.forEach(function (sp) {
				var st = ls[sp[0]], v = mult(sp[1], htime);
				st.k = v;
				if (v > 0 && st.s <= CLOSED) { st.s = OPEN; }
				if (v === 0 && st.s > CLOSED) { st.s = CLOSED; }
			});
			controls(ctl, ls, tankById, htime, tStart);
			cur = stepNodes(htime);
			cur.forEach(function (n) { curById[String(n.id)] = n; });
			var stepLinks = links.map(function (l, k) { return applyLink(Object.assign({}, l), ls[k]); });
			stepModel = Object.assign({}, model, { nodes: cur, links: stepLinks });
			delete stepModel.time;
			var sOpts = {};
			if (opts.tol) { sOpts.tol = opts.tol; }
			if (ctl.some(function (c) { return c.on === 'junction'; })) { sOpts.pswitch = pswitch(stepLinks); }
			sOpts.tempClosed = {};
			sOpts.xhead = {};   // and a pump that could not lift starts the next solve shut, as XHEAD does
			// A check valve the last step shut starts this solve shut, as EPANET carries its status.
			sOpts.cvClosed = {};
			ls.forEach(function (st, k) {
				if (st.s === TEMPCLOSED) { sOpts.tempClosed[links[k].id] = true; }
				if (st.s === XHEAD && st.kind === 'pump') { sOpts.xhead[links[k].id] = true; }
				if (st.kind === 'cv' && st.s === CLOSED) { sOpts.cvClosed[links[k].id] = true; }
			});
			res = EC.lpnSolve(stepModel, sOpts);
			if (!res.ok) { return { ok: false, issues: res.issues || [], t: htime }; }
			readBack(stepModel, stepLinks, ls, res);
			solveTimes.push(htime);
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
			// hydraul.c nexthyd(): getallpumpsenergy() reads the solve just made, before the step is chosen
			pumpsEnergyNow();
			if (!(htime < dur)) { if (dur === 0) { addEnergy(0); } break; }
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
			// hydraul.c timestep(): rules, when there are any, move the tanks themselves
			if (rules.length) { tstep = ruleTimestep(tstep); } else { tankLevels(tstep); }
			addEnergy(tstep);   // nexthyd(): addenergy(hydstep), with the clock not yet moved
			tanks.forEach(function (tk) { levelNow[tk.id] = solverLevel(tk); });
			htime += tstep;
			if (htime >= rtime) { rtime += repStep; }
			if (++guard >= 100000) { break; }
		}
		return { ok: true, engine: 'native', frames: frames, warnings: warnings, duration: dur, solveTimes: solveTimes,
			// What the pumps used and cost, or null for a model with no pump (the page's own rule,
			// js/lpn-epanet.js). A pump without a curve is a pipe to EPANET and is not listed.
			energy: anyPumpLink ? energySummary(ecfg, epumps, emax, dur) : null };
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
			// A page model states its speed (0 included: OPEN at speed 0, pumpdata()); a speed pattern
			// replaces it at the first step, before anything is solved.
			st.s = closed ? CLOSED : OPEN;
			st.k = closed ? 0 : (l.h0Base !== undefined && l.speed >= 0 ? l.speed : 1);
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
		var tankShut = {}, xhead = {}, cvShut = {};
		(res.tankClosed || []).forEach(function (id) { tankShut[String(id)] = true; });
		(res.pumpXhead || []).forEach(function (id) { xhead[String(id)] = true; });
		(res.cvClosed || []).forEach(function (id) { cvShut[String(id)] = true; });
		stepLinks.forEach(function (l, k) {
			var st = ls[k], vs;
			if (st.kind === 'pipe') {
				if (st.s !== CLOSED) { st.s = tankShut[String(l.id)] ? TEMPCLOSED : OPEN; }
				return;
			}
			if (st.kind === 'cv') {
				st.s = cvShut[String(l.id)] ? CLOSED : tankShut[String(l.id)] ? TEMPCLOSED : OPEN;
				return;
			}
			if (st.kind === 'pump') {
				if (st.s === CLOSED) { return; }
				// linkstatus(): XHEAD and TEMPCLOSED re-open, and a pump at speed 0 is not judged
				// by pumpstatus(), so it ends the solve OPEN (a speed pattern at 0 shut it already).
				if (st.k === 0) { st.s = OPEN; return; }
				// hydstatus.c pumpstatus() (XHEAD, a pump that cannot lift) then tankstatus(), both
				// decided inside the solve, which reports each (res.pumpXhead, res.tankClosed).
				st.s = xhead[String(l.id)] ? XHEAD : tankShut[String(l.id)] ? TEMPCLOSED : OPEN;
				return;
			}
			if (st.k === MISSING || !(st.vt === 'PRV' || st.vt === 'PSV' || st.vt === 'FCV')) { return; }
			vs = res.valveStatus && res.valveStatus[l.id];
			st.s = vs === 'open' ? OPEN : vs === 'closed' ? CLOSED : vs === 'xpressure' ? XPRESSURE :
				vs === 'xfcv' ? XFCV : ACTIVE;
		});
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

	// ---- RULES (slice 4) ---------------------------------------------------------------------------

	// input1.c adjustdata(): the hydraulic step as EPANET settles it (never past the pattern or report step).
	function hydStepOf(timesIn) {
		var t = Object.assign({}, EC.lpnTimesDefaults(), timesIn || {}),
			h = t.hydraulicStep > 0 ? t.hydraulicStep : 3600,
			p = t.patternStep > 0 ? t.patternStep : 3600,
			r = t.reportStep > 0 ? t.reportStep : p;
		if (h > p) { h = p; }
		if (h > r) { h = r; }
		return h;
	}

	// input2.c match(): the keyword must be the START of the token, not case-sensitive.
	function starts(tok, kw) { return String(tok || '').toUpperCase().indexOf(kw) === 0; }
	// input2.c getfloat(): strtod over the whole token.
	function getFloat(tok) {
		return /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(String(tok)) ? parseFloat(tok) : NaN;
	}
	// input2.c hour(): a time in hours, or -1. `text` is the premise's value words ("10 AM", "13:30").
	function hourOf(text) {
		var w = String(text || '').trim().split(/\s+/), units = w.length > 1 ? w[1] : '', parts, y = [0, 0, 0], n, v, i;
		if (w.length > 2 || !w[0]) { return -1; }
		parts = w[0].split(':').filter(function (x) { return x.length; });
		n = parts.length;
		if (n < 1 || n > 3) { return -1; }
		for (i = 0; i < n; i++) { v = getFloat(parts[i]); if (isNaN(v)) { return -1; } y[i] = v; }
		if (n === 1) {
			if (!units) { return y[0]; }
			if (starts(units, 'SEC')) { return y[0] / 3600; }
			if (starts(units, 'MIN')) { return y[0] / 60; }
			if (starts(units, 'HOU')) { return y[0]; }
			if (starts(units, 'DAY')) { return y[0] * 24; }
		}
		if (n > 1) { y[0] = y[0] + y[1] / 60 + y[2] / 3600; }
		if (!units) { return y[0]; }
		if (starts(units, 'AM')) { return y[0] >= 13 ? -1 : y[0] >= 12 ? y[0] - 12 : y[0]; }
		if (starts(units, 'PM')) { return y[0] >= 13 ? -1 : y[0] >= 12 ? y[0] : y[0] + 12; }
		return -1;
	}

	// rules.c enums
	var R_EQ = 0, R_NE = 1, R_LE = 2, R_GE = 3, R_LT = 4, R_GT = 5,
		A_NUMBER = 0, A_OPEN = 1, A_CLOSED = 2, A_ACTIVE = 3,
		RELOP = { '=': R_EQ, IS: R_EQ, '<>': R_NE, NOT: R_NE, '<=': R_LE, '>=': R_GE, '<': R_LT, BELOW: R_LT, '>': R_GT, ABOVE: R_GT },
		RTOL = 1e-3;                        // rules.c checkvalue()/takeactions() tolerance

	function statusWord(tok) {
		return starts(tok, 'OPEN') ? A_OPEN : starts(tok, 'CLOSED') ? A_CLOSED : starts(tok, 'ACTIVE') ? A_ACTIVE : A_NUMBER;
	}

	/**
	 * rules.c newpremise()/newaction()/newpriority(): `model.rules` (the converted blocks
	 * assembleModel() hands both engines, SI values) as EPANET holds them. `bad` lists the names of
	 * the rules this loop does not copy exactly, or that EPANET would reject on reading the file.
	 */
	function parseRules(model, nodeType, linkOf) {
		var rules = [], bad = [];
		(model.rules || []).forEach(function (b, ri) {
			var name = b && b.name ? String(b.name) : '#' + (ri + 1), r, state = 'cond', fail = false;
			if (!b || !b.name || !Array.isArray(b.clauses)) { bad.push(name); return; }
			r = { name: name, prem: [], then: [], els: [], priority: 0 };
			b.clauses.forEach(function (c) {
				var p, a, l, x, s, v, w;
				if (fail) { return; }
				if (c.part === 'priority') { r.priority = c.value; if (!isFinite(c.value)) { fail = true; } return; }
				if (!c.ok) { fail = true; return; }
				if (c.part === 'cond') {
					p = { logop: c.join === 'OR' ? 'OR' : 'AND', rel: RELOP[c.rel], attr: c.attr, status: A_NUMBER, value: 0 };
					if (p.rel === undefined) { fail = true; return; }
					if (c.object === 'SYSTEM') {
						p.sys = true;
						if (c.attr === 'TIME' || c.attr === 'CLOCKTIME') {
							x = hourOf(c.valueText);
							if (x < 0) { fail = true; return; }
							p.value = Math.trunc(x * 3600);
						} else if (c.attr === 'DEMAND') {
							p.value = c.value * 1000;                    // L/s, the file's flow unit
						} else { fail = true; return; }
					} else if (c.attr === 'FLOW' || c.attr === 'STATUS' || c.attr === 'SETTING') {
						l = linkOf[c.id];
						if (!l) { fail = true; return; }
						p.link = String(c.id);
						if (c.attr === 'STATUS') {
							s = statusWord(c.valueText);
							if (s !== A_NUMBER) { p.status = s; } else { p.never = true; }   // checkvalue() has no STATUS
						} else if (c.attr === 'FLOW') {
							p.value = c.value * 1000;
						} else {
							// A setting: a pump's speed, a valve's setting. A pipe's is its roughness
							// and a GPV's a curve, neither copied.
							if (l.type === 'pipe' || (l.type === 'valve' && String(l.valveType).toUpperCase() === 'GPV')) { fail = true; return; }
							p.value = c.kind === 'flow' ? c.value * 1000 : c.value;
							p.scale = c.kind === 'flow' ? 1000 : 1;
						}
					} else {
						// a node's DEMAND, HEAD, GRADE, LEVEL, PRESSURE, FILLTIME or DRAINTIME
						if (!nodeType[String(c.id)]) { fail = true; return; }
						p.node = String(c.id);
						if (c.attr === 'FILLTIME' || c.attr === 'DRAINTIME') {
							if (nodeType[p.node] === 'junction') { fail = true; return; }   // error 201 in EPANET
							if (!isFinite(c.value)) { fail = true; return; }
							p.value = c.value * 3600;
						} else {
							if (!isFinite(c.value)) { fail = true; return; }
							if (nodeType[p.node] === 'reservoir' && (c.attr === 'LEVEL' || c.attr === 'PRESSURE')) { fail = true; return; }
							p.value = c.attr === 'DEMAND' ? c.value * 1000 : c.value;
						}
					}
					r.prem.push(p);
					state = 'cond';
					return;
				}
				// an action: THEN or ELSE opens its list, AND continues the one in force
				if (c.join === 'THEN') { state = 'then'; } else if (c.join === 'ELSE') { state = 'else'; }
				l = linkOf[c.id];
				if (!l || (l.type === 'pipe' && l.status === 'cv')) { fail = true; return; }   // errors 204 and 207
				a = { link: String(c.id), status: A_NUMBER, setting: null };
				w = String(c.valueText || '');
				s = statusWord(w);
				if (s !== A_NUMBER) { a.status = s; }
				else {
					v = c.value;
					if (!isFinite(v) || !(v >= 0)) { fail = true; return; }          // error 202
					if (l.type === 'valve' && String(l.valveType).toUpperCase() === 'GPV') { fail = true; return; }
					if (l.type === 'pipe') { a.status = v === 0 ? A_CLOSED : A_OPEN; }
					else { a.setting = v; }
				}
				(state === 'else' ? r.els : r.then).push(a);
			});
			if (fail || !r.prem.length || !r.then.length) { bad.push(name); return; }
			rules.push(r);
		});
		return { rules: rules, bad: bad };
	}


	// ---- PUMP ENERGY (slice 6) ---------------------------------------------------------------------
	//
	// input3.c energydata(): the [ENERGY] section as EPANET holds it, from `model.energy` (the shape
	// js/looped-network.js docEnergy() hands both engines: globalEfficiency, globalPrice, globalPattern,
	// demandCharge, and per pump price, pattern, effic (a curve name) with efficCurves[name] = [[m3/s,
	// percent], ...]). It follows what js/lpn-epanet.js WRITES, because that is what EPANET reads: a
	// value only when stated, and a per-pump row only for a pump that went out as a pump (one with a
	// curve; a curveless pump is a pipe there and has no energy). `bad` lists what EPANET refuses to read:
	// error 217 (a negative price, a global efficiency of 0 or less), 213 (a negative demand charge), 205
	// (a pattern the file lacks) and 230 (a curve whose x does not increase).
	function energyConfig(model) {
		var e = model.energy || {}, bad = [], pats = {}, pumps = {}, c, y, curves;
		function has(v) { return !(v === undefined || v === null || v === ''); }
		c = { epump: EPUMP, ecost: 0, epat: null, dcost: 0, per: {}, bad: bad, spGrav: 1 };
		((model.time && model.time.patterns) || []).forEach(function (p) { pats[String(p.id)] = true; });
		(model.links || []).forEach(function (l) { if (l.type === 'pump' && (l.h0 > 0 || l.a > 0)) { pumps[String(l.id)] = true; } });
		if (model.hydraulics && typeof model.hydraulics.specificGravity === 'number' && isFinite(model.hydraulics.specificGravity)) {
			c.spGrav = model.hydraulics.specificGravity;
		}
		if (has(e.globalEfficiency)) {
			y = Number(e.globalEfficiency);
			if (!(y > 0)) { bad.push('Global Efficiency'); } else { c.epump = y; }
		}
		if (has(e.globalPrice)) {
			y = Number(e.globalPrice);
			if (!(y >= 0)) { bad.push('Global Price'); } else { c.ecost = y; }
		}
		if (has(e.globalPattern)) {
			if (!pats[String(e.globalPattern)]) { bad.push('Global Pattern'); } else { c.epat = String(e.globalPattern); }
		}
		if (has(e.demandCharge)) {
			y = Number(e.demandCharge);
			if (!(y >= 0)) { bad.push('Demand Charge'); } else { c.dcost = y; }
		}
		function per(id) { return c.per[id] || (c.per[id] = { ecost: 0, epat: null, curve: null }); }
		Object.keys(e.price || {}).forEach(function (id) {
			if (!pumps[id] || !has(e.price[id])) { return; }
			y = Number(e.price[id]);
			if (!(y >= 0)) { bad.push(id); } else { per(id).ecost = y; }
		});
		Object.keys(e.pattern || {}).forEach(function (id) {
			if (!pumps[id] || !has(e.pattern[id])) { return; }
			if (!pats[String(e.pattern[id])]) { bad.push(id); } else { per(id).epat = String(e.pattern[id]); }
		});
		curves = e.efficCurves || {};
		Object.keys(e.effic || {}).forEach(function (id) {
			var nm = e.effic[id], pts = nm ? curves[nm] : null, i, x = [], v = [];
			if (!pumps[id] || !pts || !pts.length) { return; }   // js/lpn-epanet.js writes no EFFIC row
			for (i = 0; i < pts.length; i++) {
				if (!isFinite(pts[i][0]) || !isFinite(pts[i][1])) { return; }
				x.push(pts[i][0] * 1000); v.push(pts[i][1]);       // m3/s to L/s, as the file states it
			}
			for (i = 1; i < x.length; i++) { if (!(x[i] > x[i - 1])) { bad.push(id); return; } }
			per(id).curve = { x: x, y: v };
		});
		return c;
	}

	// hydraul.c getenergy() for one pump: [kW, efficiency as a fraction], or [0, 0] when it is shut.
	// `headFt` gives a node's head in feet, `qCfs` the pump's flow in cfs, `status` and `speed` are its
	// EPANET status code and setting.
	function pumpEnergyNow(cfg, pe, status, speed, qCfs, h1Ft, h2Ft) {
		var q, dh, e, q4eff;
		if (status <= CLOSED) { return [0, 0]; }
		q = Math.abs(qCfs);
		dh = Math.abs(h1Ft - h2Ft);
		e = cfg.epump;
		if (pe && pe.curve) {
			q4eff = q / speed * LPS_PER_CFS;                      // the flow at full speed, in L/s (Ucf[FLOW])
			e = interp(pe.curve.x, pe.curve.y, q4eff);
			e = 100 - ((100 - e) * Math.pow(1 / speed, 0.1));      // Sarbu and Borza pump speed adjustment
		}
		e = e <= 100 ? e : 100;                                   // C's MIN and MAX, which differ from
		e = e >= 1 ? e : 1;                                       // Math.min/max when e is NaN
		e /= 100;
		return [dh * q * cfg.spGrav / 8.814 / e * KW_PER_HP, e];
	}

	// output.c saveenergy() and report.c writeenergy(): the accumulated sums as the report states them,
	// in the shape js/lpn-epanet.js lpnEnergySummary() returns (a fraction, never a percent, for usage and
	// avgEfficiency; kwh and cost over the whole run), with EPANET's own report columns beside them
	// (kwhPerM3 for the "Kw-hr /m3" column, costPerDay for "Cost /day").
	function energySummary(cfg, list, emax, dur) {
		var out = { pumps: [], energyCost: 0, kwh: 0, peakKw: emax, demandCharge: 0, totalCost: 0,
				costPerDay: 0, totalCostPerDay: 0, duration: dur }, hdur = dur / 3600;
		list.forEach(function (pu) {
			var t = pu.hours, row;
			row = {
				id: pu.id,
				onSeconds: t * 3600,
				usage: hdur === 0 ? t : t / hdur,                  // saveenergy(): with no duration it stays hours
				avgKw: t > 0 ? pu.kwh / t : 0,
				peakKw: pu.maxKw,
				avgEfficiency: t > 0 ? pu.eff / t : 0,
				kwh: pu.kwh,
				cost: pu.cost,
				kwhPerM3: t > 0 ? pu.perFlow / t * (1000 / LPS_PER_CFS / 3600) : 0,
				costPerDay: hdur === 0 ? pu.cost * 24 : pu.cost * 24 / hdur
			};
			out.pumps.push(row);
			out.kwh += pu.kwh;
			out.energyCost += pu.cost;
			out.costPerDay += row.costPerDay;
		});
		out.demandCharge = emax * cfg.dcost;
		out.totalCost = out.energyCost + out.demandCharge;
		out.totalCostPerDay = out.costPerDay + out.demandCharge;
		return out;
	}

	// One tank in EPANET's internal units (input1.c, input3.c).
	function tankState(n) {
		// input3.c tankdata(): Vmin = area x MinLvl, or the stated MinVol when above 0; V0 and Vmax
		// are measured up from it. input1.c inittanks(): a VOLUME CURVE replaces all three with the
		// curve read at MinLvl, InitLvl and MaxLvl (a stated MinVol is then ignored) and the area is
		// no longer used by tankvolume()/tankgrade().
		var area = Math.PI * n.diameter * n.diameter / 4,
			rows = curveRows(n),
			vminM = n.minVolume > 0 ? n.minVolume : area * n.minLevel,
			El = (n.elev || 0) / FT,
			tk = {
				id: n.id, node: n, El: El,
				Hmin: El + n.minLevel / FT, Hmax: El + n.maxLevel / FT,
				A: Math.PI * Math.pow(n.diameter / FT, 2) / 4,
				Vmin: vminM / FT3,
				Vmax: (vminM + area * (n.maxLevel - n.minLevel)) / FT3,
				V: (vminM + area * (n.level - n.minLevel)) / FT3
			};
		if (rows) {
			tk.cx = rows.map(function (r) { return r[0]; });
			tk.cy = rows.map(function (r) { return r[1]; });
			tk.Vmin = interp(tk.cx, tk.cy, n.minLevel) / FT3;
			tk.Vmax = interp(tk.cx, tk.cy, n.maxLevel) / FT3;
			tk.V = interp(tk.cx, tk.cy, n.level) / FT3;
		}
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
		// epanet.c EN_getlinkvalue(EN_STATUS): anything `<= CLOSED` reads closed. A pump at speed 0
		// reads OPEN when it is OPEN (a stated SPEED 0); one a control or a pattern set to 0 is CLOSED.
		model.links.forEach(function (l, k) {
			f.statuses[l.id] = ls[k].s <= CLOSED ? 'closed' : 'open';
		});
		return f;
	}
}(typeof globalThis !== 'undefined' ? globalThis : this));
