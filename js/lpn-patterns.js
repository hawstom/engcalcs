// lpn-patterns.js -- the CLOCK: patterns, time settings and simple controls (ROADMAP Tasks
// 248.01, 248.02, 248.03).
//
// Split from everything else by PURITY, the same rule js/lpn-geom.js states: every function here
// takes values and returns values. No DOM, no `doc`, no settings, no closure state -- and, the one
// extra rule this file needs, NO UNITS. A pattern multiplier is dimensionless; a control's
// threshold and setting are not, and the numbers are handed in and back in whatever unit the
// caller is holding them in. js/lpn-inp.js says which unit that is (`thresholdUnit`,
// `settingUnit`, and its `scale` record); this file never converts and never guesses.
//
// TIME IS SECONDS EVERYWHERE in this file. An `.inp` writes `24:00`, `1:00`, `0:05`, `2`,
// `30 MINUTES` and `12 am` for the same kind of quantity; all of them arrive here as an integer
// number of seconds, and the file's own text is kept beside the number rather than in it (see
// lpnTimeText below, which is lpnNumText's twin for a quantity whose text is not a number at all).
//
// RULE-BASED CONTROLS ([RULES]) ARE OUT OF SCOPE and are deliberately not here. A simple control
// is four sentence shapes; [RULES] is a small language with priorities, AND/OR clauses and
// premises over link and system state, and EPA's own Net1/Net2/Net3 use none of it. Simple
// controls cover the great majority of real models. js/lpn-inp.js keeps reporting a [RULES]
// section as unread, which is the honest state until a real file arrives that needs one.

(function (root) {
	'use strict';

	// The same root-object pattern js/lpn-inp.js uses: one EngCalcs, whether that is the browser's
	// global or the object a Node harness has already built.
	var EC = root.EngCalcs = root.EngCalcs || {};

	var SEC_PER_DAY = 86400;

	// ============================================================================================
	// PATTERNS (Task 248.02)
	// ============================================================================================
	//
	// A pattern is A NAME AND A LIST OF MULTIPLIERS, and nothing else. EPANET's [PATTERNS] repeats
	// the id on as many lines as it likes and the multipliers CONCATENATE in file order -- Net3's
	// pattern 1 is four lines of six, one 24-hour day.

	/**
	 * Build a pattern record. `multipliers` is copied, so the record does not alias the caller's
	 * array, and a caller appending a second [PATTERNS] line uses lpnPatternAppend below.
	 */
	EC.lpnPatternMake = function (id, multipliers) {
		return { id: String(id), multipliers: (multipliers || []).slice() };
	};

	EC.lpnPatternAppend = function (pattern, multipliers) {
		var i;
		for (i = 0; i < multipliers.length; i++) { pattern.multipliers.push(multipliers[i]); }
		return pattern;
	};

	/**
	 * THE INDEX ARITHMETIC, which is the whole of what a pattern IS.
	 *
	 *     index = floor((t + patternStart) / patternStep)  mod  length
	 *
	 * Three things in that line are each a plausible wrong answer, so each is stated:
	 *
	 * 1. **The pattern WRAPS.** A 24-value pattern on a 1-hour step run for 48 hours is two
	 *    identical days, not one day followed by nothing. `mod`, never a clamp to the last value.
	 * 2. **Pattern start is ADDED, not subtracted.** EPANET's manual: "Pattern Start -- the time
	 *    offset at which all patterns will start. A value of 6 hours would mean that the first
	 *    pattern interval used is the one which corresponds to 6 hours." So a start of 6 h on a
	 *    1 h step reads multipliers[6] at t = 0. Subtracting reads multipliers[length-6], which is
	 *    a perfectly ordinary-looking number from the wrong end of the day.
	 * 3. **The first interval is [0, step), and it is index 0, not index 1.** A pattern's first
	 *    multiplier applies AT t = 0 -- which is exactly why Net3 at t=0 has 1.34 times its base
	 *    demands and we, until this file existed, had 1.00. floor(), so t = step - 1 is still 0.
	 *
	 * Returns -1 for a pattern with no multipliers -- a caller must not read `multipliers[-1]` and
	 * lpnPatternValue below turns that case into 1.0 instead.
	 */
	EC.lpnPatternIndex = function (length, t, patternStep, patternStart) {
		var step = (patternStep > 0) ? patternStep : 3600,
			start = patternStart > 0 ? patternStart : 0,
			periods, i;
		if (!(length > 0)) { return -1; }
		periods = Math.floor((t + start) / step);
		i = periods % length;
		// A time before the pattern start (a caller asking about negative elapsed time) would give a
		// negative remainder in JavaScript, which indexes off the front of the array.
		if (i < 0) { i += length; }
		return i;
	};

	/**
	 * The multiplier a pattern has at time `t` seconds.
	 *
	 * `pattern` is a record from lpnPatternMake, a bare array of multipliers, or null. **A missing
	 * or empty pattern is 1.0, never 0** -- "this element names no pattern" means "unmodified", and
	 * a 0 would silently switch off every demand in a file whose [PATTERNS] we failed to read.
	 *
	 * A multiplier of 0 is a REAL VALUE and comes back as 0. Net3's pattern 2 starts with six of
	 * them, and a falsy test on that zero has already produced a confident wrong answer in this
	 * repo (see the header of dev/lpn-spike/net3-vs-epanet-report.js).
	 */
	EC.lpnPatternValue = function (pattern, t, patternStep, patternStart) {
		var mult = !pattern ? null : (pattern.multipliers || (pattern.length !== undefined ? pattern : null)),
			i;
		if (!mult || !mult.length) { return 1; }
		i = EC.lpnPatternIndex(mult.length, t, patternStep, patternStart);
		if (i < 0) { return 1; }
		return isFinite(mult[i]) ? mult[i] : 1;
	};

	/**
	 * The same question asked of a whole table at once: id -> multiplier at `t`.
	 * `patterns` is an array of pattern records. A caller holding a base demand and a pattern id
	 * multiplies; nothing here knows what the multiplier is FOR, which is why the same function
	 * serves a demand, a reservoir head, a pump speed and a price.
	 */
	EC.lpnPatternValuesAt = function (patterns, t, patternStep, patternStart) {
		var out = {}, i;
		for (i = 0; i < (patterns || []).length; i++) {
			out[patterns[i].id] = EC.lpnPatternValue(patterns[i], t, patternStep, patternStart);
		}
		return out;
	};

	EC.lpnPatternById = function (patterns, id) {
		var i;
		if (id === undefined || id === null || id === '') { return null; }
		for (i = 0; i < (patterns || []).length; i++) {
			if (patterns[i].id === String(id)) { return patterns[i]; }
		}
		return null;
	};

	// ============================================================================================
	// TIME SETTINGS (Task 248.01)
	// ============================================================================================
	//
	// EPANET's [TIMES] section is the authority for every default below, and each is named with the
	// keyword it comes from so a reader can check it against the manual rather than against us.
	// Water-quality timestep and the reporting statistic are NOT here: nothing on this page reads
	// them, and a field nobody reads is a field that goes stale.

	/**
	 * EPANET's own [TIMES] defaults, in seconds.
	 *
	 *   duration       0        EPANET default: a duration of 0 IS the steady-state single-period
	 *                           run this page has always done. So a document with no time settings
	 *                           at all behaves exactly as it does today -- the defaults are not a
	 *                           new behaviour, they are a name for the current one.
	 *   hydraulicStep  1:00     [TIMES] Hydraulic Timestep default, 1 hour.
	 *   patternStep    1:00     [TIMES] Pattern Timestep default, 1 hour.
	 *   patternStart   0:00     [TIMES] Pattern Start default.
	 *   reportStep     1:00     [TIMES] Report Timestep default, 1 hour.
	 *   reportStart    0:00     [TIMES] Report Start default.
	 *   startClock     12 am    [TIMES] Start ClockTime default, i.e. midnight = 0 s past midnight.
	 *                           This is the wall clock the run BEGINS at; a CLOCKTIME control is
	 *                           the only thing that reads it.
	 */
	EC.lpnTimesDefaults = function () {
		return {
			duration: 0,
			hydraulicStep: 3600,
			patternStep: 3600,
			patternStart: 0,
			reportStep: 3600,
			reportStart: 0,
			startClock: 0
		};
	};

	// [TIMES] keyword (upper case, spaces squeezed out) -> field name. EPANET matches on the first
	// word or two and ignores the rest of the line, so `Pattern Timestep` and `PATTERN TIMESTEP`
	// are the same key.
	var TIMES_KEYS = {
		DURATION: 'duration',
		HYDRAULICTIMESTEP: 'hydraulicStep',
		PATTERNTIMESTEP: 'patternStep',
		PATTERNSTART: 'patternStart',
		REPORTTIMESTEP: 'reportStep',
		REPORTSTART: 'reportStart',
		STARTCLOCKTIME: 'startClock',
		// **READ, BUT NEVER WRITTEN BACK, AND THAT IS DELIBERATE.** A water-quality run wants the
		// file's own quality time step (Net3 states 0:05), so it is parsed onto `times.qualityStep`
		// where js/lpn-epanet.js can find it. It is NOT in lpnTimesDefaults() and NOT in the `.inp`
		// exporter's own [TIMES] list: absent means "EPANET's own default", and writing a line
		// stating that default into every file that never had one is exactly the round-trip damage
		// the sparseness rule exists to prevent.
		QUALITYTIMESTEP: 'qualityStep'
	};
	EC.lpnTimesKeys = TIMES_KEYS;

	var TIME_UNITS = {
		SEC: 1, SECOND: 1, SECONDS: 1,
		MIN: 60, MINUTE: 60, MINUTES: 60,
		HOUR: 3600, HOURS: 3600, HR: 3600, HRS: 3600,
		DAY: 86400, DAYS: 86400
	};

	/**
	 * Parse one EPANET time value into SECONDS.
	 *
	 * `tokens` is the value's word or words, already split: `['24:00']`, `['30', 'MINUTES']`,
	 * `['12', 'am']`, `['2']`. Returns null when nothing here is a time, so the caller can leave a
	 * field at its default rather than storing a 0 that means "midnight" just as convincingly as it
	 * means "unreadable".
	 *
	 * **A BARE NUMBER IS HOURS.** That is EPANET's rule for [TIMES] and for a control's `AT TIME`,
	 * and it is the one most likely to be assumed to be seconds: `Duration 24` is a day, not
	 * twenty-four seconds.
	 *
	 * **`opts.typed` accepts a COMMA DECIMAL, and only typed input may pass it** (Task 444). One
	 * function parses both a person's keystrokes and a file's bytes, and the two have opposite
	 * rules: a `.inp` file's separator is always a dot, so a comma in a file is not a decimal and
	 * guessing at one would rewrite the user's own number. Typed, `2,5` is two and a half hours to
	 * most of the world, and `parseFloat` silently stopped at the comma and returned 2 -- half the
	 * value, with no error, in the field that sizes the whole run.
	 * Accepted only as `<digits>,<digits>`; every other comma shape returns null so the field
	 * snaps back rather than the parser guessing between a decimal and a thousands group.
	 */
	EC.lpnParseTime = function (tokens, opts) {
		var toks = [], i, t, parts, v, unit, sec, ampm = null,
			typed = !!(opts && opts.typed);
		for (i = 0; i < (tokens || []).length; i++) {
			t = String(tokens[i] === undefined || tokens[i] === null ? '' : tokens[i]).trim();
			if (t === '') { continue; }
			if (t.indexOf(',') >= 0) {
				if (!typed || !/^\d+,\d+$/.test(t)) { return null; }
				t = t.replace(',', '.');
			}
			toks.push(t);
		}
		if (!toks.length) { return null; }

		// AM/PM may be attached ('12am') or separate ('12 am'), and only ever on the last token.
		t = toks[toks.length - 1].toUpperCase();
		if (t === 'AM' || t === 'PM') { ampm = t; toks.pop(); }
		else if (/(AM|PM)$/.test(t) && toks[toks.length - 1].length > 2) {
			ampm = t.slice(-2);
			toks[toks.length - 1] = toks[toks.length - 1].slice(0, -2);
		}
		if (!toks.length) { return null; }

		t = toks[0];
		if (t.indexOf(':') >= 0) {
			// hh:mm or hh:mm:ss. Hours are NOT capped at 24 -- `Duration 55:00` is Net2's, and it
			// means 55 hours.
			parts = t.split(':');
			sec = (parseFloat(parts[0]) || 0) * 3600 +
				(parseFloat(parts[1]) || 0) * 60 +
				(parts.length > 2 ? (parseFloat(parts[2]) || 0) : 0);
		} else {
			v = parseFloat(t);
			if (!isFinite(v)) { return null; }
			unit = toks.length > 1 ? TIME_UNITS[toks[1].toUpperCase()] : undefined;
			sec = v * (unit === undefined ? 3600 : unit);
		}
		if (ampm) {
			// 12 am is 0:00 and 12 pm is 12:00 -- the one pair the obvious arithmetic gets wrong in
			// both directions.
			var h = Math.floor(sec / 3600) % 12, rest = sec - Math.floor(sec / 3600) * 3600;
			sec = h * 3600 + rest + (ampm === 'PM' ? 12 * 3600 : 0);
		}
		return sec;
	};

	/**
	 * Seconds -> the text EPANET writes, `H:MM` (or `H:MM:SS` when the seconds do not divide).
	 * Used only by lpnTimeText below and by a future [TIMES] writer; nothing solves from it.
	 */
	EC.lpnFormatTime = function (sec) {
		var s = Math.max(0, Math.round(sec || 0)),
			h = Math.floor(s / 3600),
			m = Math.floor((s % 3600) / 60),
			r = s % 60,
			two = function (n) { return (n < 10 ? '0' : '') + n; };
		return h + ':' + two(m) + (r ? ':' + two(r) : '');
	};

	/**
	 * lpnNumText's twin, for a quantity whose FILE TEXT IS NOT A NUMBER.
	 *
	 * js/lpn-inp.js's mergeTok keeps a token only while `parseFloat(tok)` still equals the value,
	 * which is exactly right for `710.0` and exactly wrong for `24:00` -- parseFloat says 24 and
	 * the value is 86400, so a time could never keep its own text through that gate. The rule is
	 * the same one a level up: the text is kept in its own bag (`times.text`), never in the field
	 * holding the number, and it is handed back only while it still SAYS this number.
	 *
	 * So `24:00` survives as `24:00`, `55:00` as `55:00`, `12 am` as `12 am` -- and a duration the
	 * user later edits to 36000 s comes back as `10:00`, because the stored text no longer parses
	 * to it and drops itself. No edit path has to remember to clear one.
	 */
	EC.lpnTimeText = function (times, key, seconds) {
		var t = times && times.text ? times.text[key] : undefined;
		if (typeof t === 'string' && EC.lpnParseTime(t.split(/\s+/)) === seconds) { return t; }
		return EC.lpnFormatTime(seconds);
	};

	// ============================================================================================
	// SIMPLE CONTROLS (Task 248.03)
	// ============================================================================================
	//
	// Four sentence shapes, all of them `LINK <id> <status|setting>` plus a condition:
	//
	//   LINK 9   OPEN   IF NODE 2 BELOW 110        node condition: a TANK LEVEL or a JUNCTION
	//   LINK 9   CLOSED IF NODE 2 ABOVE 140        PRESSURE -- see thresholdUnit below
	//   LINK 10  OPEN   AT TIME 1                  elapsed time; a bare number is HOURS
	//   LINK 12  CLOSED AT CLOCKTIME 3 AM          wall clock, read against Start ClockTime
	//
	// The action is OPEN, CLOSED, or a NUMBER, and a number means different things per link type --
	// a valve's setting (pressure, flow or a bare coefficient by valve type) or a pump's speed
	// multiplier. This file records the number and lets js/lpn-inp.js name the unit, exactly as it
	// already does for a [VALVES] row and a [STATUS] override; there is no second convention here.

	/**
	 * Parse one [CONTROLS] line into a record. Returns { ok: false, error, raw } rather than
	 * throwing, so an importer can report the line verbatim and keep the rest of the file -- which
	 * is the module contract js/lpn-inp.js is built on.
	 *
	 * `toks` is the line already tokenized (comments stripped). Case is EPANET's: keywords are
	 * matched case-insensitively, ids are kept exactly as written.
	 */
	EC.lpnParseControl = function (toks) {
		var t = (toks || []).slice(), up = t.map(function (x) { return String(x).toUpperCase(); }),
			raw = t.join(' '), rec, v, sec;
		if (up.length < 3 || up[0] !== 'LINK') { return { ok: false, error: 'not-a-control', raw: raw }; }

		rec = { link: t[1], raw: raw, action: {}, condition: null, text: {} };

		if (up[2] === 'OPEN') { rec.action.status = 'open'; }
		else if (up[2] === 'CLOSED') { rec.action.status = 'closed'; }
		else {
			v = parseFloat(t[2]);
			if (!isFinite(v)) { return { ok: false, error: 'bad-action', raw: raw }; }
			// A SETTING, whose unit belongs to the link and not to the control. Left un-named here;
			// js/lpn-inp.js fills `action.settingUnit` in from the link it resolves.
			rec.action.setting = v;
			rec.action.settingUnit = null;
			rec.text.setting = t[2];
		}

		if (up.length === 3) {
			// EPANET has no unconditional simple control; a bare `LINK 9 OPEN` is a truncated line.
			return { ok: false, error: 'no-condition', raw: raw };
		}
		if (up[3] === 'IF' && up[4] === 'NODE') {
			if (up.length < 8) { return { ok: false, error: 'bad-node-condition', raw: raw }; }
			if (up[6] !== 'ABOVE' && up[6] !== 'BELOW') { return { ok: false, error: 'bad-comparison', raw: raw }; }
			v = parseFloat(t[7]);
			if (!isFinite(v)) { return { ok: false, error: 'bad-threshold', raw: raw }; }
			rec.condition = {
				kind: 'node', node: t[5], cmp: up[6] === 'ABOVE' ? 'above' : 'below',
				value: v,
				// A TANK's threshold is a water LEVEL above its bottom and a JUNCTION's is a
				// PRESSURE -- two different quantities in two different units, told apart only by
				// the node's type, which this file does not know. js/lpn-inp.js sets it.
				unit: null
			};
			rec.text.value = t[7];
			return { ok: true, control: rec };
		}
		if (up[3] === 'AT' && (up[4] === 'TIME' || up[4] === 'CLOCKTIME')) {
			sec = EC.lpnParseTime(t.slice(5));
			if (sec === null) { return { ok: false, error: 'bad-time', raw: raw }; }
			rec.condition = {
				kind: up[4] === 'TIME' ? 'time' : 'clocktime',
				seconds: sec
			};
			rec.text.time = t.slice(5).join(' ');
			return { ok: true, control: rec };
		}
		return { ok: false, error: 'unknown-condition', raw: raw };
	};

	/**
	 * When a TIME-ish control last fired at or before elapsed time `t`, or null if it has not.
	 *
	 * A CLOCKTIME control is stated on the wall clock, so it fires at the first elapsed time whose
	 * clock reads that value -- `(clock - startClock) mod 86400` -- and EVERY DAY THEREAFTER. The
	 * daily repeat is not decoration: a pair like `OPEN AT CLOCKTIME 6 AM` / `CLOSED AT CLOCKTIME
	 * 10 PM` gives the wrong answer on day two of a 48-hour run if you only ask "has it happened
	 * yet", because both have, and the file order would then decide instead of the clock.
	 */
	EC.lpnControlFiredAt = function (control, t, startClock) {
		var c = control.condition, first;
		if (!c) { return null; }
		if (c.kind === 'time') { return t >= c.seconds ? c.seconds : null; }
		if (c.kind === 'clocktime') {
			first = ((c.seconds - (startClock || 0)) % SEC_PER_DAY + SEC_PER_DAY) % SEC_PER_DAY;
			if (t < first) { return null; }
			return first + Math.floor((t - first) / SEC_PER_DAY) * SEC_PER_DAY;
		}
		return null;
	};

	/**
	 * What every named link's status/setting should be at time `t`.
	 *
	 *   controls  array of records from lpnParseControl
	 *   ctx       .time        elapsed seconds (default 0)
	 *             .startClock  the run's Start ClockTime in seconds past midnight (default 0)
	 *             .node(id)    the node's CURRENT value, in the same unit as the control's
	 *                          threshold: a tank's LEVEL above its own bottom, a junction's
	 *                          PRESSURE. Returning undefined means "not known", and a control on
	 *                          that node is skipped rather than guessed at.
	 *
	 * Returns { linkId: { status: 'open'|'closed' } | { setting: <number> } } holding only the
	 * links some control actually acts on. A link absent from the result keeps whatever the
	 * document says, which is what makes this safe to apply blindly.
	 *
	 * **ORDER OF APPLICATION, which is where two reasonable implementations disagree.** EPANET
	 * checks every control in file order at each hydraulic step, and the last one to act wins. A
	 * time control only acts at the instant it fires; a node control acts whenever its condition
	 * holds. Asked instead for the STATE AT A MOMENT, that comes out as: sort by when each control
	 * last acted -- its most recent firing for a time control, `t` itself for a node control whose
	 * condition holds now -- breaking ties by file order, then apply in that order. So a node
	 * condition overrides a time control that fired an hour ago, and loses to nothing except a
	 * later-listed control acting at the same instant, which is EPANET's own tie-break.
	 */
	EC.lpnControlStates = function (controls, ctx) {
		var t = (ctx && isFinite(ctx.time)) ? ctx.time : 0,
			startClock = (ctx && isFinite(ctx.startClock)) ? ctx.startClock : 0,
			nodeVal = (ctx && typeof ctx.node === 'function') ? ctx.node : function () { return undefined; },
			acting = [], out = {}, i, c, cond, when, v;

		for (i = 0; i < (controls || []).length; i++) {
			c = controls[i];
			if (!c || !c.condition) { continue; }
			cond = c.condition;
			if (cond.kind === 'node') {
				v = nodeVal(cond.node);
				if (typeof v !== 'number' || !isFinite(v)) { continue; }
				// `>` and `<`, strictly: EPANET's ABOVE/BELOW do not fire on equality, and a tank
				// sitting exactly on its trigger level is the commonest way to notice.
				if (cond.cmp === 'above' ? !(v > cond.value) : !(v < cond.value)) { continue; }
				when = t;
			} else {
				when = EC.lpnControlFiredAt(c, t, startClock);
				if (when === null) { continue; }
			}
			acting.push({ when: when, order: i, control: c });
		}
		acting.sort(function (a, b) { return a.when - b.when || a.order - b.order; });

		for (i = 0; i < acting.length; i++) {
			c = acting[i].control;
			if (c.action.status) { out[c.link] = { status: c.action.status }; }
			else { out[c.link] = { setting: c.action.setting }; }
		}
		return out;
	};

	if (typeof module !== 'undefined' && module.exports) { module.exports = EC; }

}(typeof globalThis !== 'undefined' ? globalThis : this));
