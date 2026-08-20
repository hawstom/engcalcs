// lpn-time.js -- THE RUN: an extended-period simulation, and the control that moves through it
// (ROADMAP Task 248, children 248.01 and 248.02).
//
// js/lpn-patterns.js is the CLOCK -- index arithmetic, [TIMES] parsing, control sentences, all of
// it pure and unit-free. This file is what the clock DRIVES: it turns a document into a run, keeps
// the frames, and answers "what does the network look like at 9:00". The split is the same one
// js/lpn-geom.js and js/lpn-collide.js keep, and for the same reason -- everything above the
// horizontal rule below is values in and values out, testable in Node with no page at all.
//
// **TIME IS SECONDS HERE TOO**, exactly as in js/lpn-patterns.js. The only place a time becomes
// text is lpnTimeText/lpnFormatTime, which are that file's.
//
// WHERE THE RUN HAPPENS: js/lpn-epanet.js, in EPANET's own runH()/nextH() loop. Not here, and not
// as a series of independent steady states -- see the long note on EngCalcs.lpnEpanetRun. A tank's
// level at 9:00 is the integral of everything that flowed into it since midnight, and a page that
// re-solved a fresh steady state per reporting time would leave every tank exactly where it
// started, all day, with every other number looking perfectly reasonable.
//
// **THE RESULTS OF A RUN NEVER TOUCH THE DOCUMENT.** A tank's stored `level` is the user's initial
// condition; the level at 14:00 is a result. They are the same quantity in the same unit and they
// are different kinds of thing, so they live in different places and no code path here writes one
// into the other. That is CLAUDE.md's "a number the user supplied and a number we computed must
// never occupy the same field", and a tank is the one element where the temptation is real.
//
// WATER QUALITY IS NOT IN SCOPE and is not started here. A pattern is read through
// lpnPatternValue() by whoever needs one, so a WQ source could read one later without this file
// changing; nothing in that direction is built on the strength of it.

(function (root) {
	'use strict';

	var EC = root.EngCalcs = root.EngCalcs || {};

	var SEC_PER_DAY = 86400;

	// ================================================================================================
	// PURE: values in, values out. No DOM, no document, no page.
	// ================================================================================================

	/**
	 * Is this a RUN or an INSTANT? EPANET's own answer: a duration of 0 is the steady-state
	 * single-period run, which is what this page has always done. So the question is asked of the
	 * duration alone and never of "does the document have patterns" -- a network with patterns and
	 * no duration is one instant with a multiplier on it, which is a perfectly ordinary thing to want.
	 */
	EC.lpnTimeIsExtended = function (times) {
		return !!(times && times.duration > 0);
	};

	/**
	 * Every reporting time, in seconds, inclusive of both ends.
	 *
	 * REPORT START IS NOT ALWAYS ZERO. EPANET lets a run report only its later part, and a slider
	 * built on `k * reportStep` would then be labelled with times the run never reported. So the
	 * grid starts where the report starts, which is also the test EngCalcs.lpnEpanetRun applies when
	 * it decides whether a solved instant is a frame.
	 */
	EC.lpnReportTimes = function (times) {
		var t = times || EC.lpnTimesDefaults(),
			step = t.reportStep > 0 ? t.reportStep : 3600,
			start = t.reportStart > 0 ? t.reportStart : 0,
			dur = t.duration > 0 ? t.duration : 0,
			out = [], k;
		if (start > dur) { return [0]; }
		for (k = start; k <= dur; k += step) { out.push(k); }
		return out.length ? out : [0];
	};

	/**
	 * Elapsed time as `H:MM`, and the WALL CLOCK as `HH:MM` on a 24-hour dial.
	 *
	 * Two different readouts because they answer two different questions and are routinely
	 * different numbers: at hour 30 of a 48-hour run the elapsed time is `30:00` and the clock says
	 * `06:00`. A CLOCKTIME control fires on the second of those; a demand pattern runs on the first.
	 *
	 * 24-hour, not am/pm: the dial is read the same way in every language this suite ships in, and
	 * "am"/"pm" are English words that would need translating to stay honest.
	 */
	EC.lpnTimeElapsedText = function (t) { return EC.lpnFormatTime(t); };
	EC.lpnTimeClockText = function (times, t) {
		var start = (times && times.startClock) || 0,
			s = ((start + (t || 0)) % SEC_PER_DAY + SEC_PER_DAY) % SEC_PER_DAY,
			h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60),
			two = function (n) { return (n < 10 ? '0' : '') + n; };
		return two(h) + ':' + two(m);
	};

	/**
	 * Which frame shows time `t`: the last one at or before it, so a slider that lands between two
	 * reporting times shows the state that was true then rather than one that has not happened.
	 * -1 for an empty run.
	 */
	EC.lpnTimeFrameIndexAt = function (frames, t) {
		var i, best = -1;
		for (i = 0; i < (frames || []).length; i++) {
			if (frames[i].t <= t) { best = i; } else { break; }
		}
		if (best < 0 && frames && frames.length) { best = 0; }
		return best;
	};

	/**
	 * One frame, in the shape EngCalcs.lpnSolve returns, so every reader downstream -- labels,
	 * colours, the profile, the junction table -- swallows it without knowing a run happened.
	 * That shape-compatibility is the whole reason the page needs no second results pipeline.
	 */
	EC.lpnTimeFrameResult = function (run, t) {
		var i = EC.lpnTimeFrameIndexAt(run && run.frames, t), f;
		if (i < 0) { return null; }
		f = run.frames[i];
		return {
			ok: true, engine: 'epanet', engineVersion: run.engineVersion, issues: [],
			warnings: run.warnings || [], converged: true, iterations: null,
			heads: f.heads, pressures: f.pressures, flows: f.flows,
			headlosses: f.headlosses, velocities: f.velocities,
			// Carried but NOT part of the steady-state contract: only this file's own readouts look
			// at them, and only a run can produce them.
			demands: f.demands, levels: f.levels, statuses: f.statuses, t: f.t
		};
	};

	/**
	 * The document's clock as the solver-side model wants it: seconds and SI, with a pattern table
	 * and controls whose numbers have been converted out of the display units the document states
	 * them in.
	 *
	 * `toSI(value, unitId)` is the page's own converter, handed in rather than reimplemented -- the
	 * same edge assembleModel() is, and the only place on this path where a unit is applied.
	 *
	 * **A CONTROL'S THRESHOLD IS NOT A DIMENSIONLESS NUMBER**, and it is the one that bites. A tank
	 * condition is a water LEVEL above that tank's own bottom; a junction condition is a PRESSURE.
	 * js/lpn-inp.js already recorded which ('head' or 'press'), so this reads that flag instead of
	 * re-deriving the node's type. Left unconverted, Net3's `Link 335 OPEN IF Node 1 BELOW 17.1`
	 * becomes 17.1 metres -- above that tank's maximum level, so the pump never starts and the run
	 * is quietly wrong instead of visibly broken.
	 */
	EC.lpnTimeModelBlock = function (doc, toSI) {
		var times = (doc && doc.times) || EC.lpnTimesDefaults(),
			conv = typeof toSI === 'function' ? toSI : function (v) { return v; },
			controls = [];
		((doc && doc.controls) || []).forEach(function (c) {
			var out, cond = c && c.condition;
			if (!cond) { return; }
			out = { link: c.link, action: {}, condition: null };
			if (c.action && c.action.status) { out.action.status = c.action.status; }
			else if (c.action && isFinite(c.action.setting)) {
				out.action.settingUnit = c.action.settingUnit || null;
				out.action.setting =
					c.action.settingUnit === 'press' ? conv(c.action.setting, 'lpn_u_pressure') :
					c.action.settingUnit === 'flow' ? conv(c.action.setting, 'lpn_u_flow') :
					c.action.setting;
			} else { return; }
			if (cond.kind === 'node') {
				out.condition = {
					kind: 'node', node: cond.node, cmp: cond.cmp,
					value: cond.unit === 'press'
						? conv(cond.value, 'lpn_u_pressure')
						: conv(cond.value, 'lpn_u_elevhead')
				};
			} else {
				out.condition = { kind: cond.kind, seconds: cond.seconds };
			}
			controls.push(out);
		});
		return {
			times: times,
			patterns: (doc && doc.patterns) || [],
			defaultPattern: (doc && doc.defaultPattern) || null,
			controls: controls
		};
	};

	/**
	 * Write one time setting from what the user typed.
	 *
	 * **THE TYPED TEXT IS KEPT, NOT A REFORMATTING OF IT.** `24:00` stays `24:00` and `30 minutes`
	 * stays `30 minutes`, in `times.text`, which is where js/lpn-patterns.js's lpnTimeText looks --
	 * and lpnTimeText hands it back only while it still PARSES to the stored number, so the text
	 * drops itself the moment somebody changes the number by any other route. That is the same rule
	 * the `.inp` importer keeps for every value in a file: we display it, we solve from a copy, and
	 * we write back what came in.
	 *
	 * Returns true on a value this page can use, false on text that is not a time or is negative --
	 * in which case NOTHING is written and the caller redraws the old value. A rejected edit must
	 * not leave a half-changed clock behind.
	 */
	EC.lpnTimeSetField = function (times, key, text) {
		var raw = String(text === undefined || text === null ? '' : text).trim(), sec;
		if (!times || !(key in times)) { return false; }
		if (raw === '') { return false; }
		sec = EC.lpnParseTime(raw.split(/\s+/), { typed: true });
		if (sec === null || !isFinite(sec) || sec < 0) { return false; }
		times[key] = sec;
		times.text = times.text || {};
		times.text[key] = raw;
		return true;
	};

	// The seven settings, in the order EPANET's own [TIMES] lists them, paired with the lang key
	// naming each one. Exported because both the editor below and the harnesses walk it, and a
	// second hand-written list is how one of them silently loses a field.
	EC.LPN_TIME_FIELDS = [
		['duration', 'lpn_time_duration'],
		['hydraulicStep', 'lpn_time_hyd_step'],
		['patternStep', 'lpn_time_pattern_step'],
		['patternStart', 'lpn_time_pattern_start'],
		['reportStep', 'lpn_time_report_step'],
		['reportStart', 'lpn_time_report_start'],
		['startClock', 'lpn_time_clock_start']
	];

	// ================================================================================================
	// THE EDITOR SIDE. Everything below needs a page; everything above does not.
	// ================================================================================================
	//
	// js/looped-network.js hands this file a HOST and nothing else -- the document, the model
	// builder, the two functions that own the status bar and the results, and the page's own unit
	// converters. That seam is deliberately narrow: this file adds one pane tab and three call sites
	// over there, and every line of the run, the transport and the settings form lives here.

	var host = null;
	// `t` is THE MOMENT THE PAGE IS SHOWING. modelTimeSeconds() over in js/looped-network.js reads
	// it, so a document rebuilt for a solve is rebuilt at this instant -- which is what makes the
	// no-engine fallback honest rather than a stale t=0 answer wearing a clock.
	// `speed` is a PLAYBACK multiplier and nothing else: it never reaches the document, the model or
	// a result, so it is not a setting and is not stored. 1 is the shipped 400 ms a frame.
	var state = {
		t: 0, run: null, token: 0, playing: false, timer: null, speed: 1,
		// ---- the four fields that make a period run cheap enough to leave automatic (2026-08-19) ----
		// `lastRunMs` is how long the LAST run of THIS network took, measured; it is what decides
		// whether the page may run the period by itself (see EC.LPN_TIME_AUTO).
		// `wanted` is "a run has been asked for", set by the Run button, by a document arriving and
		// by the transport, and consumed by the next solve.
		// `busy` is a run in flight, so a second request queues instead of piling up.
		// `idle` is the quiet-period timer that provokes an automatic run.
		// `runSig` is the fingerprint of the model the frames in hand came out of, so an edit can be
		// asked the only question that matters: did anything the solver reads actually change?
		// `wantedByUser` rides along with `wanted` and decides ONE thing: whether the run box
		// appears (Task 450). A run somebody pressed Run for owes them a sign that it started; an
		// automatic run after a quiet moment owes them silence, or the page grows a box that pops
		// up every time the mouse stops moving.
		lastRunMs: null, wanted: false, wantedByUser: false, busy: false, idle: null, runSig: null
	};

	/**
	 * **HOW LONG A PERIOD RUN MAY TAKE AND STILL RE-RUN ITSELF.**
	 *
	 * Tom, 2026-08-19: "I am not opposed to benchmarking and brainstorming entire-simulation
	 * recalculation on the fly. I am just foreseeing the multiplied burden of recalculating every
	 * time step at every value change. That's not good for data entry efficiency."
	 *
	 * So it was measured -- dev/lpn-spike/eps-cost-bench.js, on Net3 (97 nodes, 119 links):
	 *
	 *     one steady solve, which is what an edit costs anyway            11 ms
	 *     the whole 24 h period at Net3's own 1 hour report step      40-180 ms      25 frames
	 *     the same day at a 15 minute report step                        736 ms      97 frames
	 *     the same day at a 1 minute report step                        2972 ms    1441 frames
	 *     10 x Net3 (970 nodes), 24 h at 1 hour                          381 ms      25 frames
	 *     Net3 over 30 days at 1 hour                                   1255 ms     721 frames
	 *
	 * **THE REPORTING STEP IS THE AXIS, NOT THE SIZE OF THE NETWORK.** The cost is per FRAME, so a
	 * finer step multiplies it while ten times the drawing merely triples it -- and a modeller
	 * chasing a transient sets a one-minute step on purpose. That is the "multiplied burden" as a
	 * number: at 3 s a run, a page that re-runs while you type is unusable; at 60 ms it is the live
	 * page every other calculator in this suite is.
	 *
	 * Neither answer is right for both, and the page does not have to guess or ask: **it times its
	 * own run** and keeps re-running by itself only while that measurement stays under the budget.
	 * Above it the period waits for the Run button, and the status bar says so.
	 *
	 * 400 ms because it sits above every measurement of an ordinary network (Net3 at its own
	 * settings measured 40-250 ms, browser included) and below every measurement of an expensive
	 * one (736 ms at the next step down), and because a pause of about half a second is where a
	 * page stops feeling live. The idle wait is on top of js/looped-network.js's own 300 ms solve
	 * debounce, so nothing is ever provoked by a keystroke -- only by putting the mouse down and
	 * leaving it there.
	 *
	 * Exported because they are tuning constants a reader will want to find, and because
	 * dev/lpn-spike/time-harness.js drives them rather than sleeping for a second per check.
	 */
	EC.LPN_TIME_AUTO = { budgetMs: 400, idleMs: 900 };

	/**
	 * EVERY STRING THIS FILE SHOWS, in one place, and read through an explicit `pageConfig.<key>`
	 * on purpose: dev/scripts/pageconfig_check.php greps the source for exactly that shape, and a
	 * lookup through a variable key is INVISIBLE to it. That invisibility is how a page silently
	 * ships one of these in English to somebody who does not read English -- the whole class of
	 * defect that check exists for.
	 *
	 * The right-hand side is the English fallback, and it is used only where there is no bridge at
	 * all: a Node harness, or this file loaded on a page that supplies no pageConfig.
	 */
	function strings() {
		var pageConfig = EC.pageConfig || {};
		return {
			speed: pageConfig.lpn_time_speed,
			speedTip: pageConfig.lpn_time_speed_tip,
			duration: pageConfig.lpn_time_duration || 'Total run time',
			hydraulicStep: pageConfig.lpn_time_hyd_step || 'Hydraulic time step',
			patternStep: pageConfig.lpn_time_pattern_step || 'Pattern time step',
			patternStart: pageConfig.lpn_time_pattern_start || 'Pattern start time',
			reportStep: pageConfig.lpn_time_report_step || 'Report time step',
			reportStart: pageConfig.lpn_time_report_start || 'Report start time',
			startClock: pageConfig.lpn_time_clock_start || 'Clock time at the start',
			formatTip: pageConfig.lpn_time_format_tip || 'Enter times and durations as decimal hours (17.5 or 72.5) or in hours:minutes notation (17:30 or 72:30).',
			// **THERE IS NO STEADY-STATE MESSAGE.** Tom, 2026-08-18, on the sentence that used to be
			// here: "'This network is worked out at one moment' is the very string I told you I don't
			// understand. And I don't think it's needed at all. The transport will always be there,
			// and no explanation is needed." A one-step network is not a special case to be explained
			// away -- the step selector holds one step and that is the whole of what there is to say.
			// (lpn_time_no_engine is a DIFFERENT thing and stays: "the engine is unreachable, so you
			// are seeing one instant" is a fact about this session that the user acts on.)
			running: pageConfig.lpn_time_running || 'Working out the whole time period with the EPANET engine.',
			noEngine: pageConfig.lpn_time_no_engine || 'The built-in solver works out one moment at a time, so this is the network at {time} only: the demands carry that moment’s pattern multipliers, and every tank still sits at its starting level instead of filling and draining. Connect to the internet once to fetch the EPANET engine, which runs the whole period.',
			slider: pageConfig.lpn_time_slider || 'Time',
			noPeriod: pageConfig.lpn_time_no_period || 'This project has no time period, so there is one moment to show. Set a Total run time in Settings to work the network out over time.',
			first: pageConfig.lpn_time_first || 'Go to the start',
			prev: pageConfig.lpn_time_prev || 'Step back',
			play: pageConfig.lpn_time_play || 'Play',
			pause: pageConfig.lpn_time_pause || 'Pause',
			next: pageConfig.lpn_time_next || 'Step forward',
			last: pageConfig.lpn_time_last || 'Go to the end',
			// **"Run", because EPANET's own command is Run Analysis.** Not "Simulate", which is
			// epanet-js's word rather than ours, and not "Recalculate", which is both long for an
			// icon-only strip and untrue of a page where everything else recalculates as you type.
			run: pageConfig.lpn_time_run || 'Run',
			runTip: pageConfig.lpn_time_run_tip || 'Work out this network at every reporting time, from the start of the run to the end of it.',
			runNote: pageConfig.lpn_time_run_note || 'You are seeing the first reporting time. This network takes long enough to work out over its whole time period that the later times are not kept up to date while you work: press Run when you want them.',
			// ---- the run box (Task 450) ----
			// `running` above is what it says while it works, borrowed rather than re-keyed: it is
			// already the sentence the status bar uses for exactly this moment.
			runDone: pageConfig.lpn_time_run_done || 'The run finished. Reporting times: {frames}. Time taken: {secs} s.',
			runFailed: pageConfig.lpn_time_run_failed || 'The run did not finish, so there are no results for the later times.',
			runReport: pageConfig.lpn_time_run_report || 'EPANET run report',
			close: pageConfig.lpn_close || 'Close'
			// **FIVE STRINGS LEFT THIS LIST WITH THE PANE TAB**: lpn_time_tank, lpn_time_level and
			// lpn_time_settings_open named the tank table and the door to the settings, and
			// lpn_time_menu / lpn_time_menu_tip named the tab itself. lpn_time_menu is still
			// RENDERED -- it is the Time sub-heading in the Settings box, straight out of
			// Looped-Network.php -- and the other four are now rendered by nothing. They are left
			// in lib/lang.ec.en.php rather than deleted: whether an unreferenced key is debt or
			// lost content is Tom's call, and the tank levels are meant to come back.
		};
	}
	function docTimes() {
		var d = host && host.doc();
		return (d && d.times) || null;
	}

	EC.lpnTimeNow = function () { return state.t; };

	/**
	 * THE RUN AS IT STANDS AT THIS INSTANT, in the shape a solve returns -- levels, statuses and
	 * demands included. null when there is no run.
	 *
	 * The one way in to a frame from outside this file, and the readout the removed Time tab's tank
	 * table used to be. It exists so the next thing that wants those levels -- a tank table, a
	 * chart, a report -- asks the run rather than scraping a panel, and so the browser pass can
	 * check that a tank really fills now that nothing on the page draws it.
	 */
	EC.lpnTimeCurrentFrame = function () {
		return state.run ? EC.lpnTimeFrameResult(state.run, state.t) : null;
	};

	/**
	 * Hang the document's clock on a model on its way to the solver. One line in assembleModel().
	 * Absent host or absent js/lpn-patterns.js leaves the model exactly as it was, which is the
	 * pre-Task-248 model -- so nothing on this page depends on this file having loaded.
	 */
	EC.lpnTimeAttach = function (model) {
		if (!host || !EC.lpnTimesDefaults) { return model; }
		model.time = EC.lpnTimeModelBlock(host.doc(), host.toSI);
		return model;
	};

	/**
	 * Take over the solve when the document describes a period rather than an instant, AND this
	 * particular solve is a run rather than an edit. Returns false otherwise, and
	 * js/looped-network.js carries on to the ordinary steady solve.
	 *
	 * **A HYDRAULIC EDIT RECALCULATES THE FIRST REPORTING TIME AND NOTHING ELSE** (Tom, 2026-08-19:
	 * "On any edit, only the first time step should be recalculated"). Two things follow, and the
	 * second is the whole point of the change:
	 *
	 *   1. The page stays LIVE. Returning false here hands the solve back, and what gets drawn is
	 *      the steady solve of the document as it now stands -- the same as-you-type behaviour
	 *      every other calculator in this suite has, at t = the first reporting time.
	 *   2. **THE FRAMES GO.** They describe a network that no longer exists, and a result that no
	 *      longer matches the document must never be on screen as if it did. Dropping them rather
	 *      than labelling them stale is EPANET's own answer, it keeps EC.lpnTimeCurrentFrame()
	 *      honest for free, and it is what gives "only the first time step" a literal meaning on
	 *      screen: the transport goes back to the start, because the start is the one moment that
	 *      has actually been worked out.
	 *
	 * The period comes back either by itself, after a quiet moment, or on the Run button -- see
	 * EC.LPN_TIME_AUTO for which, and why that is a measurement rather than a preference.
	 *
	 * **AND AN EDIT THAT IS NOT HYDRAULIC COSTS NOTHING AT ALL**, which is the biggest saving here
	 * and the only one with no numerical risk in it: see the fingerprint test below.
	 */
	EC.lpnTimeRun = function (model) {
		var times = docTimes();
		if (!host || !EC.lpnTimeIsExtended(times)) {
			// Back to one instant: drop the frames, or a later edit that shortens the duration to 0
			// would leave the transport showing a run that is no longer being computed.
			cancelIdleRun();
			state.lastRunMs = null;
			state.runSig = null;
			state.wantedByUser = false;
			if (state.run) { state.run = null; state.t = 0; renderPanel(); }
			return false;
		}
		// The engine is unreachable: one instant, said out loud. Unchanged, and it is not an edit
		// path -- there is nothing to invalidate because there were never any frames.
		if (!EC.lpnEpanetRun) { state.wanted = false; state.wantedByUser = false; return noEngine(model); }
		if (state.wanted) { state.wanted = false; startRun(model); return true; }
		// **AN EDIT THE SOLVER CANNOT SEE IS NOT AN EDIT AT ALL.** Moving a node, editing a text
		// element, renaming, recolouring, retitling a label: none of them can change one flow, and
		// every one of them provoked a full period run before 2026-08-19. So the frames are
		// kept, nothing is re-run, and the frame on screen is simply re-applied.
		//
		// **THIS IS THE BIGGEST SAVING AVAILABLE HERE AND IT CARRIES NO NUMERICAL RISK**, because
		// the question is not "was that edit hydraulic?" but "is the model handed to the solver
		// byte-for-byte the one these frames came out of?". A drag is free by measurement, not by
		// a list of edit types somebody has to keep in step.
		if (state.run && state.runSig && modelFingerprint(model) === state.runSig) {
			showFrame();
			return true;
		}
		dropFrames();
		state.runSig = null;
		if (autoRunAllowed()) { scheduleIdleRun(); }
		return false;
	};

	/**
	 * Everything the solver reads, as one string. Same string, same answers.
	 *
	 * **NOT js/lpn-epanet.js's signatureOf(), and the difference is the point.** That one is the
	 * SHAPE of the network -- which ids exist, what connects to what -- and deliberately excludes
	 * values, because its question is "can the open Project be reused, or must it be rebuilt". This
	 * one includes every value, because its question is "are the answers still the answers".
	 *
	 * The per-instant `demand` field is dropped, and only that: it is `demandBase` times the
	 * pattern multiplier at the moment the model was assembled, so it moves with the transport
	 * while nothing about the document has changed. Both of its inputs are in the fingerprint, so
	 * nothing is lost -- a demand or a pattern the user edits still changes this string.
	 */
	function modelFingerprint(model) {
		return JSON.stringify(model, function (k, v) { return k === 'demand' ? undefined : v; });
	}

	/**
	 * May the page re-run the period by itself? Only while the last measured run of THIS network
	 * came in under the budget. Unmeasured (a document that has just arrived) counts as allowed:
	 * the first run is how the measurement is taken, and refusing to take it would leave every
	 * project manual forever.
	 */
	function autoRunAllowed() {
		return state.lastRunMs === null || state.lastRunMs <= EC.LPN_TIME_AUTO.budgetMs;
	}
	function cancelIdleRun() {
		if (state.idle) { clearTimeout(state.idle); state.idle = null; }
	}
	function scheduleIdleRun() {
		cancelIdleRun();
		state.idle = setTimeout(function () {
			state.idle = null;
			// Asked AGAIN at the moment it would fire, not only when it was scheduled: a run that
			// finished in between is a new measurement, and a timer set under the old one must not
			// spend a second's work the new one says is too expensive.
			if (autoRunAllowed()) { requestRun(); }
		}, EC.LPN_TIME_AUTO.idleMs);
	}
	// The frames, and the moment being shown, both go back to where a fresh document starts. pause()
	// as well: playing through frames that have just been discarded animates nothing.
	function dropFrames() {
		var stops = EC.lpnReportTimes(docTimes());
		if (!state.run && state.t === stops[0] && !state.playing) { return; }
		state.run = null;
		state.runSig = null;
		state.t = stops[0];
		if (state.playing) { pause(); }
		renderPanel();
	}
	function nowMs() {
		return (root.performance && root.performance.now) ? root.performance.now() : Date.now();
	}
	/**
	 * **THE ONE DOOR TO A PERIOD RUN.** Sets the flag the next solve consumes, and asks for that
	 * solve IMMEDIATELY rather than through the 300 ms debounce -- a debounced request can be
	 * consumed by a keystroke that lands inside the window, which is the run-while-typing this
	 * whole design exists to prevent.
	 *
	 * A run already in flight owns the engine, so the flag is left set and the finishing run kicks
	 * the next solve on its way out: a Run pressed during a slow run is queued, never dropped.
	 */
	function requestRun(byUser) {
		cancelIdleRun();
		if (!host) { return; }
		state.wanted = true;
		if (byUser) { state.wantedByUser = true; }
		if (state.busy) { return; }
		if (host.solveNow) { host.solveNow(); } else { host.solve(); }
	}
	function startRun(model) {
		var token = ++state.token, t0 = nowMs(), sig = modelFingerprint(model),
			shown = state.wantedByUser;
		cancelIdleRun();
		state.busy = true;
		state.wantedByUser = false;
		host.status(strings().running);
		if (shown) { boxStart(token); }
		EC.lpnEpanetRun(model, {
			onProgress: function (p) {
				// **A SUPERSEDED RUN MAY NOT DRIVE THE BOX.** It is still running, and its bar
				// would still be filling, and it is answering a network that no longer exists.
				if (token !== state.token || boxState.token !== token) { return; }
				boxProgress(p);
			}
		}).then(function (run) {
			// **THE MEASUREMENT IS TAKEN WHATEVER HAPPENED TO THE TOKEN.** A superseded run cost
			// exactly as much wall clock as a kept one, and it is the cost this network's next
			// automatic run is judged by.
			state.lastRunMs = nowMs() - t0;
			runFinished();
			if (token !== state.token) {
				// The box belonged to this run and this run no longer belongs to the page. It goes
				// rather than freezing part-filled, which would read as a live run for ever.
				if (boxState.token === token) { boxHide(); }
				return;   // a newer edit already started its own run
			}
			if (!run.ok) {
				state.run = null;
				host.apply(run);
				boxFailed(token);
				renderPanel();
				return;
			}
			boxDone(token, run, state.lastRunMs);
			state.run = run;
			// The model these frames came out of, so a later edit can ask whether it changed.
			// Taken from the model that was RUN, never from a fresh assembly at this moment.
			state.runSig = sig;
			clampTime();
			showFrame();
		}, function (err) {
			state.lastRunMs = nowMs() - t0;
			runFinished();
			if (token !== state.token) {
				if (boxState.token === token) { boxHide(); }
				return;
			}
			boxFailed(token);
			noEngine(model);
			if (root.console && console.warn) { console.warn('EPANET extended-period run failed:', err); }
		});
	}
	function runFinished() {
		state.busy = false;
		// The queued request keeps whatever it was asked with: a Run pressed during a slow run is
		// still a Run the user pressed, so the box it earned is not lost by being queued.
		if (state.wanted) { requestRun(state.wantedByUser); }
	}

	/**
	 * Run the whole period NOW. The Run button, and the transport asking to see a moment it has no
	 * frame for.
	 */
	EC.lpnTimeRunNow = function () { requestRun(true); };

	// **WHY THE FRAMES ARE JUDGED AT THE SOLVE AND NOT AT THE EDIT.** There was briefly a
	// lpnTimeInvalidate() on scheduleSolve(), dropping them 300 ms earlier, to close the window in
	// which lpnTimeCurrentFrame() could answer out of the previous network. It had to go: whether
	// an edit changed anything the solver reads is a question about the MODEL, and the model does
	// not exist until assembleModel() runs at the solve. Dropping first and asking afterwards
	// throws away exactly the frames a node drag is entitled to keep.
	//
	// What is left is one debounce of lag, and it is the lag the whole page already has -- every
	// label on the map still shows the previous solve's number for those same 300 ms. The frames
	// are never MORE stale than what is drawn beside them, which is the property that matters.

	/**
	 * A document has ARRIVED -- opened, imported, switched to. Its run is PRESENTED rather than
	 * waited for: a file that states a duration is asking to be seen over that duration, and this
	 * change is about what an edit does, not about what arriving does.
	 *
	 * The cost measurement starts again from nothing, because it was a measurement of a different
	 * network. The flag is consumed by the solve js/looped-network.js schedules immediately after
	 * this, so nothing is started from here.
	 */
	EC.lpnTimeArrived = function () {
		cancelIdleRun();
		state.lastRunMs = null;
		state.run = null;
		state.runSig = null;
		state.t = 0;
		state.wanted = true;
	};

	/**
	 * What the status bar has to say while the later times are NOT being kept up to date. Empty
	 * whenever they are -- including while an automatic run is a second away, because a warning
	 * that appears and disappears on every edit is noise rather than information.
	 *
	 * js/looped-network.js's applySolveResult() composes it beside valveRouteNote, which is the
	 * same kind of thing: a fact about this network that the user has to know to read the numbers.
	 */
	EC.lpnTimeStatusNote = function () {
		if (!host || state.run || !EC.lpnEpanetRun) { return ''; }
		if (!EC.lpnTimeIsExtended(docTimes()) || autoRunAllowed()) { return ''; }
		return strings().runNote;
	};

	/**
	 * What the run is doing, for a test that has to know. NOT read by anything on the page: the
	 * page shows this through the transport and the status bar, which is where a user reads it.
	 */
	EC.lpnTimeRunState = function () {
		return {
			frames: state.run ? state.run.frames.length : 0,
			t: state.t, lastRunMs: state.lastRunMs,
			auto: autoRunAllowed(), wanted: state.wanted, busy: state.busy,
			idle: !!state.idle
		};
	};

	/**
	 * **THE HONEST ANSWER WHEN THE ENGINE IS NOT THERE.** js/lpn-solver.js has no time dimension at
	 * all -- it solves one steady state -- so the only truthful thing to show is ONE INSTANT, said
	 * out loud, with the two consequences named: the demand multipliers are the ones for that
	 * moment, and the tanks are sitting at their stored starting levels rather than filling and
	 * draining. Running the native solver once per reporting time and calling the result a run is
	 * the tempting alternative and it is the one thing this must never do; every tank would be flat
	 * across the whole day and nothing on screen would say so.
	 */
	function noEngine(model) {
		state.run = null;
		host.apply(host.native(model));
		host.status(strings().noEngine.replace('{time}', EC.lpnTimeElapsedText(state.t)));
		renderPanel();
		return true;
	}

	function clampTime() {
		var stops = EC.lpnReportTimes(docTimes()), i, best = stops[0];
		for (i = 0; i < stops.length; i++) { if (stops[i] <= state.t) { best = stops[i]; } }
		state.t = best;
	}

	// Repaint the map at the moment the transport is on. NO SOLVE -- the frames are already
	// computed, so scrubbing the slider is a redraw and not 25 round trips through WASM.
	function showFrame() {
		var r = state.run ? EC.lpnTimeFrameResult(state.run, state.t) : null;
		if (r) { host.apply(r); }
		renderPanel();
	}

	// ---- moving the clock ----

	function setTime(t) {
		state.t = t;
		if (state.run) { showFrame(); return; }
		renderPanel();
		// **NO FRAMES, AND THE USER HAS ASKED TO SEE ANOTHER MOMENT.** That gesture is the same
		// request the Run button makes, so it makes it -- a transport that answered "press Run
		// first" would be a control that does nothing. The rejected alternative is to solve one
		// instant at t and draw it: that is the flat-tank answer noEngine() exists to refuse to
		// give silently, and it is only honest where there is no engine to give a better one.
		if (EC.lpnEpanetRun && EC.lpnTimeIsExtended(docTimes())) { requestRun(true); }
		else {
			// No engine: the only way to show another moment is to solve it, and modelTimeSeconds()
			// reads state.t so the rebuilt model is at the new instant.
			host.solve();
		}
	}
	function stepBy(n) {
		var stops = EC.lpnReportTimes(docTimes()),
			i = EC.lpnTimeFrameIndexAt(stops.map(function (s) { return { t: s }; }), state.t) + n;
		if (i < 0) { i = 0; }
		if (i > stops.length - 1) { i = stops.length - 1; }
		setTime(stops[i]);
	}
	function play() {
		var stops = EC.lpnReportTimes(docTimes());
		if (state.playing || stops.length < 2) { return; }
		state.playing = true;
		// 400 ms a frame at 1x: fast enough to read as motion, slow enough to see a tank rise. It is
		// a MULTIPLIER on that rather than a millisecond box, because the only question a viewer has
		// is "faster or slower than this", and epanet-js's own control asks it the same way. Wrapping
		// rather than stopping at the end, because a daily pattern IS a loop and stopping dead at
		// 24:00 hides the join.
		state.timer = setInterval(function () {
			var s = EC.lpnReportTimes(docTimes()),
				i = s.indexOf(state.t);
			setTime(s[(i + 1) % s.length]);
		}, frameMs());
		renderPanel();
	}
	function frameMs() { return Math.round(400 / (state.speed > 0 ? state.speed : 1)); }
	// Changing speed mid-run must not stop it: setInterval's period is fixed at creation, so the
	// only way to a new one is a new timer. pause()/play() together are that, and they leave
	// `state.t` exactly where it was.
	function setSpeed(v) {
		state.speed = v > 0 ? v : 1;
		if (state.playing) { pause(); play(); }
		else { renderTransport(); }
	}
	function pause() {
		if (state.timer) { clearInterval(state.timer); state.timer = null; }
		state.playing = false;
		renderPanel();
	}

	// ---- the time settings, edited ----

	function ensureTimes() {
		var d = host.doc();
		if (!d.times) { d.times = EC.lpnTimesDefaults(); d.times.text = {}; }
		return d.times;
	}
	function commitField(key, text) {
		// **BOTH HALVES REDRAW, because the fields and the transport are in different boxes now.**
		// The seven inputs live in the Settings box and the play/slider in the pane, and an edit to
		// the duration changes what both of them say. Rejecting an entry redraws only the fields --
		// nothing about the run changed, so redrawing the transport would be a flicker for nothing.
		var probe = EC.lpnParseTime(String(text).trim().split(/\s+/), { typed: true }), times;
		// Probed BEFORE the snapshot, so text that is not a time costs nothing: an undo step that
		// undoes nothing is worse than no undo step, because it eats a real one off a 20-deep stack.
		if (probe === null || !isFinite(probe) || probe < 0) { EC.lpnTimeRenderSettings(); return; }
		host.snapshot();
		times = ensureTimes();
		if (!EC.lpnTimeSetField(times, key, text)) { EC.lpnTimeRenderSettings(); return; }
		// A shorter run can leave the transport past the end of it.
		clampTime();
		host.save();
		host.solve();
		EC.lpnTimeRenderSettings();
		renderPanel();
	}

	// ---- THERE IS NO TIME TAB IN THE BOTTOM PANE ----------------------------------------------
	//
	// Tom, 2026-08-19: *"No need for this to have a tab in the bottom pane. Remove the tab and
	// what's on it."* Time had become the THIRD place the clock lived: the seven [TIMES] settings
	// moved into the Settings box and the transport moved onto the toolbar, which left a tab
	// holding a door to the first and a table of tank levels.
	//
	// **THE TANK-LEVEL TABLE WENT WITH IT, and that is a real loss to record rather than a tidy-up
	// to celebrate.** A tank filling and draining is the one thing an extended-period run shows
	// that a series of instants cannot, and the map does not draw it: a tank's head label is its
	// STORED starting level, because that number is the user's. Nothing on the page reads a run's
	// tank levels now. Put them back as a COLUMN of a tank table -- the shape the junctions tab
	// already has -- rather than as a tab of their own.

	function el(tag, attrs, text) {
		var e = document.createElement(tag), k;
		for (k in (attrs || {})) { if (attrs[k] !== null && attrs[k] !== undefined) { e.setAttribute(k, attrs[k]); } }
		if (text !== undefined) { e.textContent = text; }
		return e;
	}

	/**
	 * **THE SEVEN [TIMES] FIELDS, IN THE SETTINGS BOX** (ROADMAP Task 441). Tom, 2026-08-18:
	 * "Combine Labels settings, present design Settings, Time settings (from the bottom pane), and
	 * Coloring into the Settings box with a simple rule: 'If it's for the entire project, it's in
	 * Settings.'" A run duration and a reporting step are properties of the whole project by any
	 * reading, so they are settings and they moved.
	 *
	 * **THE TRANSPORT DID NOT MOVE, AND THE RULE IS WHY.** Play, step and the slider change WHICH
	 * MOMENT YOU ARE LOOKING AT and never touch the document -- they are a viewing control, the
	 * same kind of thing as pan and zoom, and pan and zoom are not settings either. So the tab
	 * keeps them, beside the tank levels they explain.
	 *
	 * Called by js/looped-network.js's rebuildSettingsBox(). Silent when the host section is not on
	 * the page, so a page without the Settings box still gets the transport.
	 */
	EC.lpnTimeRenderSettings = function () {
		var panel = document.getElementById('lpn_set_time_fields'), S = strings(), times;
		if (!panel || !host) { return; }
		times = docTimes() || EC.lpnTimesDefaults();
		panel.textContent = '';
		EC.LPN_TIME_FIELDS.forEach(function (pair) {
			// **DECLARED IN HERE, not shared across the seven.** Hoisted to the function above,
			// every listener would close over the LAST input built, so editing the duration would
			// commit whatever was sitting in the start-clock box.
			// **THE BOX'S OWN ROW SHAPE, not a private one** (Tom, 2026-08-19: "Some inputs are
			// right justified. Others are not. Standardize with an eye for design"). These seven
			// were the only rows in the Settings box laying themselves out by hand, so they were
			// the only ones whose control did not line up with the column above and below it.
			// `lpn-set-num` is the rule for a number-shaped TEXT box: `24:00` is a number to every
			// reader and a string only to the parser. See css/engcalcs.css.
			var row = el('label', { class: 'lpn-set-row lpn-time-row' }),
				label = el('span', { class: 'ec-help', title: S.formatTip }, S[pair[0]]),
				input = el('input', {
					type: 'text', inputmode: 'text', class: 'lpn-set-num',
					// **THE FILE'S OWN TEXT, WHILE IT STILL SAYS THIS NUMBER.** lpnTimeText hands
					// back `24:00` rather than the `24:00` we would have composed, and hands back a
					// composed one the moment the number stops matching. So an edit never silently
					// reformats a value the user did not touch.
					value: EC.lpnTimeText(times, pair[0], times[pair[0]] || 0)
				});
			input.addEventListener('change', function () { commitField(pair[0], input.value); });
			row.appendChild(label);
			row.appendChild(input);
			panel.appendChild(row);
		});
		if (EC.initTips) { EC.initTips(panel); }
	};

	// ================================================================================================
	// THE RUN BOX -- ROADMAP Task 450
	// ================================================================================================
	//
	// Tom, 2026-08-19: "The Run button does nothing... It needs a box with a progress bar and
	// completion report. epanetjs also includes a link to the EPANET run report."
	//
	// **WHAT WAS ACTUALLY WRONG.** The wiring was live the whole time. What is missing is the sign
	// that it is live: on a network over the auto-run budget -- which is the state Run is most often
	// pressed from, because that is the state the page waits in -- pressing Run starts SECONDS of
	// work and shows nothing at all while it happens. A button that takes seconds in silence is
	// indistinguishable from a dead one, and the status line flashing "working" then vanishing is
	// no better on a run that finishes in 265 ms.
	//
	// **THE PROGRESS IS REAL, NOT A SPINNER PRETENDING.** js/lpn-epanet.js's run loop reports the
	// simulated time it has reached, so the fraction is t/duration -- EPANET's own clock, which only
	// moves forward. Nothing here estimates or interpolates anything.
	//
	// **ONLY A RUN SOMEBODY ASKED FOR GETS A BOX** (state.wantedByUser). An automatic run after a
	// quiet moment is the page keeping up, and a box that appears every time the mouse stops moving
	// is noise; the whole point of the automatic path is that it costs no attention.
	//
	// **IT STAYS UNTIL IT IS CLOSED**, rather than vanishing when the run ends. What it holds after
	// the run is a report -- how many reporting times, how long, and EPANET's own text -- and a
	// report nobody can finish reading is not a report. The next run replaces its contents.
	//
	// **THE BOX IS BUILT HERE AND APPENDED TO document.body**, not into a container the page owns.
	// That keeps this whole feature inside this file: js/looped-network.js needs no new element, no
	// new id and no new call site for it.

	var boxState = { open: false, phase: 'idle', fraction: 0, frames: 0, ms: 0, reportLength: 0, token: 0 },
		boxReport = '',
		boxUi = null;

	function boxStart(token) {
		boxState = { open: true, phase: 'running', fraction: 0, frames: 0, ms: 0, reportLength: 0, token: token };
		boxReport = '';
		renderBox(true);
	}
	function boxProgress(p) {
		if (!boxState.open || boxState.phase !== 'running') { return; }
		// MONOTONIC HERE TOO. The engine already promises it; a bar that could go backwards is
		// worse than no bar, so the guarantee is kept on both sides of the seam rather than
		// trusted across it.
		var f = (p && p.fraction) || 0;
		if (f > boxState.fraction) { boxState.fraction = f > 1 ? 1 : f; }
		boxState.frames = (p && p.frames) || boxState.frames;
		renderBox(false);
	}
	function boxDone(token, run, ms) {
		if (!boxState.open || boxState.token !== token) { return; }
		boxState.phase = 'done';
		boxState.fraction = 1;
		boxState.frames = ((run && run.frames) || []).length;
		boxState.ms = ms;
		boxReport = (run && run.report) || '';
		boxState.reportLength = boxReport.length;
		renderBox(true);
	}
	function boxFailed(token) {
		if (!boxState.open || boxState.token !== token) { return; }
		boxState.phase = 'failed';
		boxReport = '';
		boxState.reportLength = 0;
		renderBox(true);
	}
	function boxHide() {
		boxState = { open: false, phase: 'idle', fraction: 0, frames: 0, ms: 0, reportLength: 0, token: 0 };
		boxReport = '';
		renderBox(true);
	}

	function boxMessage(S) {
		if (boxState.phase === 'running') { return S.running; }
		if (boxState.phase === 'failed') { return S.runFailed; }
		return S.runDone
			.replace('{frames}', String(boxState.frames))
			// Two decimals under a second, one above it. A 40 ms run printed as "0.0 s" reads as
			// "no time was measured" rather than "it was quick", which is the opposite of what the
			// number is there to say.
			.replace('{secs}', (boxState.ms / 1000).toFixed(boxState.ms < 1000 ? 2 : 1));
	}

	/**
	 * The box on screen. `full` redraws the parts that change only when the phase does -- the
	 * message, the report, whether the bar is there at all; a progress tick moves the fill and the
	 * percentage and nothing else, because re-announcing the message to a screen reader thirty
	 * times during one run is exactly the noise `aria-live` is famous for.
	 */
	function renderBox(full) {
		var S, pct;
		if (typeof document === 'undefined' || !document.body) { return; }
		if (!boxState.open) {
			if (boxUi && boxUi.root && boxUi.root.parentNode) { boxUi.root.parentNode.removeChild(boxUi.root); }
			boxUi = null;
			return;
		}
		S = strings();
		if (!boxUi) { boxUi = buildBox(S); }
		if (!boxUi.root.parentNode) { document.body.appendChild(boxUi.root); }
		pct = Math.round(boxState.fraction * 100);
		boxUi.fill.style.width = pct + '%';
		// A bare number and a percent sign, which reads the same in every language this suite ships
		// in -- no string, and therefore nothing to translate or to get wrong.
		boxUi.pct.textContent = pct + '%';
		boxUi.bar.setAttribute('aria-valuenow', String(pct));
		if (!full) { return; }
		boxUi.msg.textContent = boxMessage(S);
		boxUi.bar.style.display = boxState.phase === 'running' ? '' : 'none';
		boxUi.pct.style.display = boxState.phase === 'running' ? '' : 'none';
		// **THE ENGINE'S OWN REPORT, OR NOTHING.** Where the build wrote none, the control is
		// absent rather than empty -- offering a report and then showing an empty box would be a
		// worse answer than not offering one.
		if (boxReport) {
			boxUi.pre.textContent = boxReport;
			boxUi.report.style.display = '';
			boxUi.report.open = false;
		} else {
			boxUi.pre.textContent = '';
			boxUi.report.style.display = 'none';
		}
	}

	function buildBox(S) {
		var root = el('div', { id: 'lpn_runbox', 'class': 'lpn-runbox' }),
			head = el('div', { 'class': 'lpn-runbox-head' }),
			title = el('span', { 'class': 'lpn-runbox-title' }, S.run),
			x = el('button', { type: 'button', 'class': 'lpn-runbox-x', title: S.close, 'aria-label': S.close }, '×'),
			// `aria-live` on the MESSAGE only. The box itself must not be a live region or every
			// percentage tick would be read out loud.
			msg = el('p', { 'class': 'lpn-runbox-msg', 'aria-live': 'polite' }),
			bar = el('div', {
				'class': 'lpn-runbox-bar', role: 'progressbar', 'aria-label': S.running,
				'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0'
			}),
			fill = el('div', { 'class': 'lpn-runbox-fill' }),
			pct = el('span', { 'class': 'lpn-runbox-pct' }),
			report = el('details', { 'class': 'lpn-runbox-report' }),
			summary = el('summary', null, S.runReport),
			pre = el('pre', { 'class': 'lpn-runbox-pre' });
		x.addEventListener('click', boxHide);
		bar.appendChild(fill);
		head.appendChild(title);
		head.appendChild(pct);
		head.appendChild(x);
		report.appendChild(summary);
		report.appendChild(pre);
		root.appendChild(head);
		root.appendChild(msg);
		root.appendChild(bar);
		root.appendChild(report);
		return { root: root, msg: msg, bar: bar, fill: fill, pct: pct, report: report, pre: pre, x: x };
	}

	/**
	 * What the box is showing, for a test that has to know. The report itself is not in here -- it
	 * is the one field that can be hundreds of kilobytes -- so its length stands in for it and
	 * EC.lpnTimeRunReport() hands over the text.
	 */
	EC.lpnTimeRunBoxState = function () {
		return {
			open: boxState.open, phase: boxState.phase, fraction: boxState.fraction,
			frames: boxState.frames, ms: boxState.ms, reportLength: boxState.reportLength
		};
	};
	/**
	 * **EPANET'S OWN REPORT FOR THE LAST RUN, VERBATIM.** Never composed by us: see the note on
	 * EngCalcs.lpnEpanetRun. Empty string when there is none.
	 */
	EC.lpnTimeRunReport = function () { return boxReport; };

	// ================================================================================================
	// THE TRANSPORT, ON THE TOOLBAR
	// ================================================================================================
	//
	// Tom, 2026-08-18: "I was trying to find a nice place for this so you can hide the bottom pane or
	// watch a profile during animation. epanetjs puts it on the toolbar. Play/pause, Speed, Step
	// back, Step forward, Step selector." Five controls, and they are on the strip because the thing
	// they change is WHAT YOU ARE LOOKING AT -- the map, the profile, the labels -- and a control
	// that lives inside one of the panels it is animating cannot be used while that panel is shut.
	//
	// **IT IS STILL NOT A SETTING.** Play and step change which moment is on screen and never touch
	// the document, exactly as pan and zoom do not; the seven [TIMES] fields are settings and stayed
	// in the Settings box (Task 441). The toolbar is where this page's other viewing commands already
	// are, so this is the same rule landing somewhere new rather than an exception to it.
	//
	// **AND IT IS THERE AT ALL TIMES.** Tom: "We can show the time play controls at all times even if
	// there is only one time step." A network with no duration has exactly ONE reporting time, and
	// the honest thing is to show that one step rather than to hide the controls -- hiding makes the
	// strip change shape between two projects and makes the feature undiscoverable in the state most
	// people open the page in. Nothing here is disabled either: a step selector holding one entry
	// says what there is to say, and Play on a single step is a no-op by arithmetic rather than by a
	// greyed-out button (see play(), which needs two stops before it starts a timer).

	// **THE TRANSPORT GLYPHS LIVE IN lib/Icons.lib.php**, like every other icon in the suite.
	// They were briefly registered from here, only-if-absent, because a toolbar button with no
	// <svg> fails the browser pass and the feature could not ship dark while they were drawn.
	// They landed the same day and that block is gone; `play`, `pause`, `step-back` and
	// `step-fwd` come from the PHP set now, and nothing here registers an icon.

	// The five controls, once built. They are rebuilt only when wireToolbar() rebuilds the whole
	// strip; every state change after that goes through renderTransport(), which UPDATES them.
	// Rebuilding a <select> the user has open closes it under the pointer, and rebuilding a button
	// re-sets a `title` Bootstrap has already moved to data-bs-original-title.
	var ui = null;

	function stepTimes() { return EC.lpnReportTimes(docTimes()); }
	function stepText(t) {
		return EC.lpnTimeElapsedText(t) + '  ·  ' + EC.lpnTimeClockText(docTimes(), t);
	}
	// Only the <svg> is swapped, never the whole button: `aria-label` and `title` stay exactly what
	// setIconLabel() put there. The NAME does not flip with the state -- `aria-pressed` already says
	// pressed, and dev/toolbar-icons.md rules that a toggle keeps one name.
	function swapIcon(btn, icon) {
		var ic, old;
		if (!btn || btn.getAttribute('data-icon') === icon) { return; }
		ic = EC.iconEl && EC.iconEl(icon);
		if (!ic) { return; }
		old = btn.querySelector('svg');
		if (old) { btn.replaceChild(ic, old); } else { btn.insertBefore(ic, btn.firstChild); }
		btn.setAttribute('data-icon', icon);
	}

	/**
	 * Build the five controls into a group js/looped-network.js's wireToolbar() has just made.
	 *
	 * `iconLabel` is that file's OWN setIconLabel wrapper, handed over rather than reached for: it
	 * is EngCalcs.setIconLabel plus the one line that records the button in toolbarIconIndex, which
	 * is what Help > "What the toolbar icons mean" is derived from. Calling EngCalcs.setIconLabel
	 * directly would build four correct buttons the guide has never heard of -- and
	 * dev/browser-pass/specs/toolbar.js asserts that the guide lists exactly the strip.
	 */
	EC.lpnTimeMountToolbar = function (container, iconLabel) {
		var S = strings(), name;
		if (!container) { return; }
		name = iconLabel || function (el2, icon, n, tip) { EC.setIconLabel(el2, icon, n, tip); };
		function btn(icon, label, fn, tip) {
			var b = document.createElement('button');
			b.type = 'button';
			name(b, icon, label, tip || null);
			b.setAttribute('data-icon', icon);
			b.addEventListener('click', fn);
			container.appendChild(b);
			return b;
		}
		// A <select> is NOT given .ec-help, on purpose (dev/toolbar-icons.md, "the one control that
		// is not a button"): a tooltip that opens on focus over a dropdown the user is about to open
		// is a tooltip in the way of the control. It carries an explicit aria-label instead, because
		// a select named only by its title has a weak, browser-dependent accessible name and there
		// is no visible label beside it on an icon-only strip.
		//
		// **BOTH ARE WIDTH-CAPPED.** The one wide control this strip ever had was a field-name
		// dropdown, and it was removed for being wide (Task 427). A step reads as two clock times at
		// its longest and a speed reads "0.5x", so 8.5rem and 4.5rem hold them with nothing to
		// spare -- and a max-width means a long translation shrinks the control rather than the map.
		function picker(id, label, tip, w) {
			var sel = document.createElement('select');
			sel.id = id;
			sel.className = 'form-select form-select-sm lpn-time-picker';
			sel.style.cssText = 'width:auto;max-width:' + w + ';font-size:.8rem;padding:.1rem 1.3rem .1rem .35rem';
			sel.setAttribute('aria-label', label);
			if (tip) { sel.title = tip; }
			container.appendChild(sel);
			return sel;
		}
		ui = {};
		// **RUN COMES FIRST, AND IT IS NOT A TRANSPORT CONTROL.** The other four change which
		// moment you are looking at; this one works the moments out. It is on the strip at all
		// times, like the rest of the group: on a network with no duration it is an ordinary
		// recalculate, which is a true thing for a button called Run to do, and hiding it would
		// make the one feature it announces undiscoverable in the state most people open the page
		// in. It is never the ONLY way to a period result -- see EC.LPN_TIME_AUTO.
		ui.run = btn('run', S.run, function () { requestRun(true); }, S.runTip);
		ui.prev = btn('step-back', S.prev, function () { stepBy(-1); });
		ui.play = btn('play', S.play, function () { if (state.playing) { pause(); } else { play(); } });
		ui.next = btn('step-fwd', S.next, function () { stepBy(1); });
		// **THE STEP SELECTOR IS THE ONLY CONTROL THAT SAYS WHICH MOMENT IS SHOWING.** The slider in
		// the pane is gone rather than mirrored here: two controls for one current step are two
		// controls that can disagree, and only one of them is on screen when the pane is shut.
		ui.step = picker('lpn_time_step', S.slider, S.slider, '8.5rem');
		ui.step.addEventListener('change', function () {
			var stops = stepTimes(), i = parseInt(ui.step.value, 10) || 0;
			setTime(stops[Math.min(stops.length - 1, Math.max(0, i))]);
		});
		// Playback speed only, and it is not stored anywhere: how fast you like to watch is a fact
		// about this minute, not about the project.
		ui.speed = picker('lpn_time_speed', S.speed, S.speedTip, '4.5rem');
		[[0.5, '0.5x'], [1, '1x'], [2, '2x'], [4, '4x']].forEach(function (o) {
			ui.speed.appendChild(el('option', { value: String(o[0]) }, o[1]));
		});
		ui.speed.value = String(state.speed);
		ui.speed.addEventListener('change', function () { setSpeed(parseFloat(ui.speed.value)); });
		renderTransport();
	};

	function renderTransport() {
		var stops, sig, i;
		if (!ui || !ui.step) { return; }
		stops = stepTimes();
		sig = stops.join(',');
		// Rebuilt only when the reporting grid itself changed -- an edit to the duration or to the
		// report step. Rebuilding on every solve would close the list under a user who had it open.
		if (ui.sig !== sig) {
			ui.sig = sig;
			ui.step.textContent = '';
			stops.forEach(function (t, k) {
				ui.step.appendChild(el('option', { value: String(k) }, stepText(t)));
			});
		}
		i = stops.indexOf(state.t);
		if (i < 0) {
			i = EC.lpnTimeFrameIndexAt(stops.map(function (t) { return { t: t }; }), state.t);
		}
		ui.step.value = String(i < 0 ? 0 : i);
		ui.play.setAttribute('aria-pressed', state.playing ? 'true' : 'false');
		swapIcon(ui.play, state.playing ? 'pause' : 'play');
		// **ONE STOP MEANS THE TRANSPORT IS INERT BY DESIGN, AND IT HAS TO SAY SO.** Tom, 2026-08-19,
		// on Net3-World -- a file that carries no [TIMES] block at all: "No time steps are
		// available. It is not running or something is wrong with the play controls and the time
		// step selector." Nothing was wrong; the project's duration is 0, so there is exactly one
		// moment and Play has nowhere to go. Three live controls that quietly do nothing are
		// indistinguishable from three broken ones, so they are DISABLED -- which is the visible
		// signal that this is by design -- and every one of them carries the reason and the cure.
		// Run stays enabled: on a network with no duration it is an ordinary recalculate, which is
		// a true thing for a button called Run to do (see the note where it is built).
		var inert = stops.length < 2, why = inert ? strings().noPeriod : null;
		[ui.prev, ui.play, ui.next, ui.step].forEach(function (c) {
			if (!c) { return; }
			c.disabled = inert;
			// The tip a control carries when it WORKS is its own; only the reason for being
			// switched off is shared. Restoring rather than clearing, so a re-enabled control does
			// not come back mute.
			if (!c.dataset.tipWhenLive) { c.dataset.tipWhenLive = c.title || ''; }
			c.title = why || c.dataset.tipWhenLive;
		});
	}

	// The one thing a solve or a clock edit still has to repaint: the transport on the toolbar.
	// Kept under its old name because it is called from eight places that mean "the run changed".
	function renderPanel() {
		renderTransport();
	}

	/**
	 * The whole seam. js/looped-network.js calls this once, at script scope, and everything this
	 * file shows -- the seven settings, the transport, the status line -- hangs off the host it is
	 * handed here.
	 */
	EC.lpnTimeInit = function (h) {
		host = h;
		// **NO TAB IS PUSHED ONTO `h.tabs`.** There was one; see the note where panelEl() used to
		// be. The transport is on the toolbar and the settings are in the Settings box, and a third
		// place for the clock was the whole of what the tab had left to offer.
	};

	if (typeof module !== 'undefined' && module.exports) { module.exports = EC; }

}(typeof globalThis !== 'undefined' ? globalThis : this));
