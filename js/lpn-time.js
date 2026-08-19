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
		sec = EC.lpnParseTime(raw.split(/\s+/));
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
	var state = { t: 0, run: null, token: 0, playing: false, timer: null, speed: 1 };

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
		// **THE TWO SPEED KEYS ARE READ THROUGH `pc`, NOT `pageConfig.`, AND ONLY UNTIL THE BRIDGE
		// CARRIES THEM.** dev/scripts/pageconfig_check.php greps for exactly `pageConfig.<key>` and
		// fails the build on a key the page does not supply; Looped-Network.php's block is another
		// track's file this session, so these two would fail it before they could be added. Move them
		// up into the object below -- and delete this alias -- the moment the page supplies them, or
		// they stay invisible to the one check that stops a visitor seeing "undefined".
		var pc = pageConfig;
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
			formatTip: pageConfig.lpn_time_format_tip || 'Write a time as hours and minutes, like 2:30. A plain number means hours; a number with its own word means that word: 30 minutes.',
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
			first: pageConfig.lpn_time_first || 'Go to the start',
			prev: pageConfig.lpn_time_prev || 'Step back',
			play: pageConfig.lpn_time_play || 'Play',
			pause: pageConfig.lpn_time_pause || 'Pause',
			next: pageConfig.lpn_time_next || 'Step forward',
			last: pageConfig.lpn_time_last || 'Go to the end',
			tank: pageConfig.lpn_time_tank || 'Tank',
			level: pageConfig.lpn_time_level || 'Water level',
			// Read by js/looped-network.js's own tab strip, not here; listed so the bridge check
			// sees them, because the tab row names them by key and nothing else does.
			settingsOpen: pageConfig.lpn_time_settings_open || 'Time settings',
			menu: pageConfig.lpn_time_menu || 'Time',
			menuTip: pageConfig.lpn_time_menu_tip || 'Set how long this network runs, and step through it.'
		};
	}
	function docTimes() {
		var d = host && host.doc();
		return (d && d.times) || null;
	}

	EC.lpnTimeNow = function () { return state.t; };

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
	 * Take over the solve when the document describes a period rather than an instant.
	 * Returns false when it does not, and js/looped-network.js carries on exactly as before.
	 */
	EC.lpnTimeRun = function (model) {
		var times = docTimes(), token;
		if (!host || !EC.lpnTimeIsExtended(times)) {
			// Back to one instant: drop the frames, or a later edit that shortens the duration to 0
			// would leave the transport showing a run that is no longer being computed.
			if (state.run) { state.run = null; state.t = 0; renderPanel(); }
			return false;
		}
		if (!EC.lpnEpanetRun) { return noEngine(model); }
		token = ++state.token;
		host.status(strings().running);
		EC.lpnEpanetRun(model).then(function (run) {
			if (token !== state.token) { return; }   // a newer edit already started its own run
			if (!run.ok) {
				state.run = null;
				host.apply(run);
				renderPanel();
				return;
			}
			state.run = run;
			clampTime();
			showFrame();
		}, function (err) {
			if (token !== state.token) { return; }
			noEngine(model);
			if (root.console && console.warn) { console.warn('EPANET extended-period run failed:', err); }
		});
		return true;
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
		if (state.run) { showFrame(); }
		else {
			// No frames: the only way to show another moment is to solve it, and modelTimeSeconds()
			// now reads state.t so the rebuilt model is at the new instant.
			renderPanel();
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
		var probe = EC.lpnParseTime(String(text).trim().split(/\s+/)), times;
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

	// ---- the pane tab ----

	function panelEl() {
		var el = document.getElementById('lpn_pane_time'), body;
		if (el) { return el; }
		body = document.getElementById('lpn_pane_body');
		if (!body) { return null; }
		// Built here rather than in Looped-Network.php so that the whole of this feature is one
		// file plus a tab registration. It carries the same classes the hand-written panels do.
		el = document.createElement('div');
		el.id = 'lpn_pane_time';
		// **NOT `on`.** applyPaneLayout() over in js/looped-network.js decides which panel is
		// showing, and a panel built pre-lit would be visible on top of whichever tab the user is
		// actually on -- renderPanel() runs on every solve, not only while this tab is up.
		el.className = 'lpn-pane-panel lpn-pane-scroll';
		el.setAttribute('role', 'tabpanel');
		el.setAttribute('aria-labelledby', 'lpn_pane_tab_time');
		body.appendChild(el);
		return el;
	}

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
			var row = el('label', { class: 'lpn-time-row', style: 'display:flex;align-items:center;gap:.35rem;margin:.15rem 0' }),
				label = el('span', { class: 'ec-help', title: S.formatTip, style: 'flex:1 1 auto' }, S[pair[0]]),
				input = el('input', {
					type: 'text', size: '7', inputmode: 'text',
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
		function btn(icon, label, fn) {
			var b = document.createElement('button');
			b.type = 'button';
			name(b, icon, label, null);
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
	}

	function renderPanel() {
		var panel = panelEl(), S = strings(), open;
		// **THE TRANSPORT IS ON THE TOOLBAR AND THE PANE MAY BE SHUT**, so it is refreshed before the
		// panel is even looked for -- an early return here used to be harmless and would now freeze
		// the clock readout of a user watching a profile with the pane hidden, which is the exact
		// case the move was made for.
		renderTransport();
		if (!panel || !host) { return; }
		panel.textContent = '';

		// **THE ONE DOOR FROM THE TRANSPORT TO ITS SETTINGS.** The seven fields left this tab for
		// the Settings box, and a user who came here to change the duration would otherwise have to
		// be told where it went by somebody. A button that opens the box on the Time section is
		// that telling, and it costs one string.
		open = el('button', {
			type: 'button', class: 'btn btn-sm btn-outline-secondary ec-help',
			style: 'margin:.3rem .6rem',
			title: S.menuTip
		}, S.settingsOpen);
		open.addEventListener('click', function () { if (host.openSettings) { host.openSettings('time'); } });
		panel.appendChild(open);

		// **THE TRANSPORT LEFT THIS TAB FOR THE TOOLBAR** (Tom, 2026-08-18: "I was trying to find a
		// nice place for this so you can hide the bottom pane or watch a profile during animation.
		// epanetjs puts it on the toolbar"). It is the one thing in this pane you want to work while
		// looking at something else, and a control inside a panel cannot be used while that panel is
		// hidden. See lpnTimeMountToolbar().
		//
		// **AND THERE IS EXACTLY ONE OF IT.** The slider that used to be here is gone rather than
		// mirrored: two controls for one current step is two controls that can disagree, and the one
		// on the toolbar is the one that is always on screen. What is left in this tab is what a
		// panel is for -- the tank levels, which are a TABLE.
		//
		// **AND A NETWORK WITH NO DURATION IS NOT TOLD ANYTHING** (Tom, 2026-08-18: "I don't think
		// it's needed at all. The transport will always be there, and no explanation is needed").
		// It has no run, so it has no tank levels, so this tab is the settings door and nothing
		// else -- which is the honest amount of content for it rather than a paragraph explaining
		// an absence.

		// -- tank levels, which are the reason a run is a run --
		var levels = state.run ? (EC.lpnTimeFrameResult(state.run, state.t) || {}).levels : null,
			ids = levels ? Object.keys(levels) : [];
		if (ids.length) {
			var tbl = el('table', { class: 'table table-sm', style: 'width:auto;margin:.3rem .6rem' }),
				thead = el('tr');
			thead.appendChild(el('th', {}, S.tank));
			thead.appendChild(el('th', {}, S.level + ' (' + host.unitLabel('lpn_u_elevhead') + ')'));
			tbl.appendChild(thead);
			ids.forEach(function (id) {
				var tr = el('tr');
				tr.appendChild(el('td', {}, id));
				// **A RESULT, DISPLAYED. NEVER WRITTEN BACK ONTO THE TANK.** The document's `level`
				// is the user's starting condition and stays exactly as they typed it.
				//
				// Shown in the INPUT head unit rather than the result one (Task 422 split them),
				// because the number a reader is comparing this against is the tank's own stored
				// starting level, which is typed in that unit.
				tr.appendChild(el('td', {}, host.toDisplay(levels[id], 'lpn_u_elevhead').toFixed(2)));
				tbl.appendChild(tr);
			});
			panel.appendChild(tbl);
		}
		if (EC.initTips) { EC.initTips(panel); }
	}

	/**
	 * The whole seam. js/looped-network.js calls this once, at script scope, before its own
	 * DOMContentLoaded handler builds the pane -- which is why the tab can simply be pushed onto
	 * the list it is handed.
	 */
	EC.lpnTimeInit = function (h) {
		host = h;
		if (h.tabs) {
			h.tabs.push({
				id: 'time', panel: 'lpn_pane_time',
				label: 'lpn_time_menu', tip: 'lpn_time_menu_tip',
				// The panel is built here rather than in the page, so the first show has to light it:
				// applyPaneLayout() ran before it existed and found nothing to switch on.
				show: function () {
					renderPanel();
					var el = panelEl();
					if (el) { el.classList.add('on'); }
				},
				refresh: renderPanel
				// **NO `hide` HOOK ANY MORE.** It used to pause the run when this tab stopped being
				// the one showing, on the reasoning that nobody was watching. That reasoning died
				// with the move to the toolbar: the thing being watched during playback is the MAP
				// and the PROFILE, and Tom asked for the transport out here precisely "so you can
				// hide the bottom pane or watch a profile during animation". Pausing on tab-hide
				// would stop the run at the moment it became useful.
			});
		}
	};

	if (typeof module !== 'undefined' && module.exports) { module.exports = EC; }

}(typeof globalThis !== 'undefined' ? globalThis : this));
