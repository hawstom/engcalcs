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
	var state = { t: 0, run: null, token: 0, playing: false, timer: null, dragging: false };

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
			duration: pageConfig.lpn_time_duration || 'Total run time',
			hydraulicStep: pageConfig.lpn_time_hyd_step || 'Hydraulic time step',
			patternStep: pageConfig.lpn_time_pattern_step || 'Pattern time step',
			patternStart: pageConfig.lpn_time_pattern_start || 'Pattern start time',
			reportStep: pageConfig.lpn_time_report_step || 'Report time step',
			reportStart: pageConfig.lpn_time_report_start || 'Report start time',
			startClock: pageConfig.lpn_time_clock_start || 'Clock time at the start',
			formatTip: pageConfig.lpn_time_format_tip || 'Write a time as hours and minutes, like 2:30. A plain number means hours; a number with its own word means that word: 30 minutes.',
			steady: pageConfig.lpn_time_steady || 'This network is worked out at one moment. Give it a total run time above zero and it runs over time instead.',
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
		// 400 ms a frame: fast enough to read as motion, slow enough to see a tank rise. Wrapping
		// rather than stopping at the end, because a daily pattern IS a loop and stopping dead at
		// 24:00 hides the join.
		state.timer = setInterval(function () {
			var s = EC.lpnReportTimes(docTimes()),
				i = s.indexOf(state.t);
			setTime(s[(i + 1) % s.length]);
		}, 400);
		renderPanel();
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
		// Probed BEFORE the snapshot, so text that is not a time costs nothing: an undo step that
		// undoes nothing is worse than no undo step, because it eats a real one off a 20-deep stack.
		var probe = EC.lpnParseTime(String(text).trim().split(/\s+/)), times;
		if (probe === null || !isFinite(probe) || probe < 0) { renderPanel(); return; }
		host.snapshot();
		times = ensureTimes();
		if (!EC.lpnTimeSetField(times, key, text)) { renderPanel(); return; }
		// A shorter run can leave the transport past the end of it.
		clampTime();
		host.save();
		host.solve();
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

	function renderPanel() {
		var panel = panelEl(), S = strings(), times, stops, form, transport;
		if (!panel || !host) { return; }
		// A drag in progress owns the slider; rebuilding it under the pointer would drop the grab.
		if (state.dragging) { updateReadout(); return; }
		times = docTimes() || EC.lpnTimesDefaults();
		panel.textContent = '';

		// -- the settings form (Task 248.01) --
		form = el('div', { class: 'lpn-time-form', style: 'display:flex;flex-wrap:wrap;gap:.4rem 1rem;padding:.4rem .6rem' });
		EC.LPN_TIME_FIELDS.forEach(function (pair) {
			// **DECLARED IN HERE, not shared across the seven.** Hoisted to the function above,
			// every listener would close over the LAST input built, so editing the duration would
			// commit whatever was sitting in the start-clock box.
			var row = el('label', { style: 'display:flex;align-items:center;gap:.35rem' }),
				label = el('span', { class: 'ec-help', title: S.formatTip }, S[pair[0]]),
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
			form.appendChild(row);
		});
		panel.appendChild(form);

		// -- the transport (Task 248 / 410) --
		if (!EC.lpnTimeIsExtended(times)) {
			panel.appendChild(el('p', { style: 'padding:.2rem .6rem;margin:0' }, S.steady));
			return;
		}
		stops = EC.lpnReportTimes(times);
		transport = el('div', { class: 'lpn-time-transport', style: 'display:flex;align-items:center;gap:.4rem;padding:.3rem .6rem;flex-wrap:wrap' });
		[[S.first, '|◀', function () { setTime(stops[0]); }],
			[S.prev, '◀', function () { stepBy(-1); }],
			[state.playing ? S.pause : S.play, state.playing ? '⏸' : '▶',
				function () { if (state.playing) { pause(); } else { play(); } }],
			[S.next, '▶', function () { stepBy(1); }],
			[S.last, '▶|', function () { setTime(stops[stops.length - 1]); }]
		].forEach(function (b) {
			var btn = el('button', { type: 'button', class: 'btn btn-sm btn-outline-secondary ec-help', title: b[0] }, b[1]);
			btn.setAttribute('aria-label', b[0]);
			btn.addEventListener('click', b[2]);
			transport.appendChild(btn);
		});
		var slider = el('input', {
			type: 'range', min: '0', max: String(stops.length - 1), step: '1',
			id: 'lpn_time_slider', style: 'flex:1 1 12rem;min-width:8rem',
			value: String(Math.max(0, stops.indexOf(state.t)))
		});
		slider.setAttribute('aria-label', S.slider);
		slider.addEventListener('pointerdown', function () { state.dragging = true; });
		['pointerup', 'pointercancel', 'blur'].forEach(function (evt) {
			slider.addEventListener(evt, function () { state.dragging = false; });
		});
		slider.addEventListener('input', function () {
			var s = EC.lpnReportTimes(docTimes());
			setTime(s[Math.min(s.length - 1, Math.max(0, parseInt(slider.value, 10) || 0))]);
		});
		transport.appendChild(slider);
		transport.appendChild(el('output', { id: 'lpn_time_readout', style: 'font-variant-numeric:tabular-nums;white-space:nowrap' }));
		panel.appendChild(transport);
		updateReadout();

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

	function updateReadout() {
		var out = document.getElementById('lpn_time_readout'), times = docTimes();
		if (!out) { return; }
		out.textContent = EC.lpnTimeElapsedText(state.t) + '  ·  ' + EC.lpnTimeClockText(times, state.t);
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
				refresh: renderPanel,
				// Playing while the tab is hidden would keep re-solving a map nobody is watching.
				hide: pause
			});
		}
	};

	if (typeof module !== 'undefined' && module.exports) { module.exports = EC; }

}(typeof globalThis !== 'undefined' ? globalThis : this));
