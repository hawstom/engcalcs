// Looped Pipe Network -- READING an EPANET `.inp` file (ROADMAP Task 196).
//
// The other direction already existed: EngCalcs.lpnToInp() in js/lpn-epanet.js writes one, so the
// real EPANET engine can solve what this page has drawn. This is the missing half, and it is much
// the harder one -- writing only has to express what we model, while reading has to survive
// everything EPANET can express, including the elements this calculator deliberately does not
// have (dev/looped-network-calculator-scope.md's "Cut, not deferred" list: patterns, water
// quality, extended-period simulation -- tanks and valves both left that list in Task 248).
//
// THE ONE RULE THAT DECIDES EVERY CASE BELOW: never drop anything silently, and never reject a
// file for using a cut feature. Real production models routinely use them -- a rejecting importer
// refused a third of the first real test set. So: import the supported subset, and hand the caller
// a `dropped` list precise enough to show the user element by element.
//
// UNITS. An `.inp` names its flow unit, and that one keyword fixes every other unit in the file --
// GPM means feet, inches, psi and gpm together; LPS means metres, millimetres, metres-of-water and
// L/s together.
//
// **EVERY NUMBER IS HANDED BACK IN THE FILE'S OWN UNIT, unconverted**, and `scale` says what one
// of those units is in SI so a caller that wants SI can multiply. This is exactness, not
// convenience: a value normalised to SI here and converted back for display by
// lib/Units.lib.php's factors does NOT return the number the file stated. Both halves are correct
// to sixteen digits and their product still is not exactly 1 -- 710 ft came back as
// 709.9913664 and 150 gpm as 149.98747841154 while the two tables disagreed, and even with
// exactly-reciprocal factors 35% of a random sample fails to return bit-identical, because
// (x*f)/f is not an identity in doubles. Passing the token through untouched is the only way the
// user's own numbers survive, and the page stores what the user typed (CLAUDE.md's unit rule).
//
// A number's TEXT is preserved alongside its value -- see mergeTok() and EngCalcs.lpnNumText()
// below. `parseFloat` is exact and still loses `220.0`, `20.00` and `4530.`.
//
// `lengthUnit` names the length unit and the caller sets the Length/Map selector to match; the
// other selectors follow `unitSystem` and `flowUnits`. The ONE quantity still normalised is an
// emitter coefficient, which has no display unit on this page at all -- see the [EMITTERS] note.
//
// This module is DOM-free and EngCalcs-free by design, so it can be tested in Node
// (dev/lpn-spike/validate_inp.js) against EPA's own Net1/Net2/Net3 without a browser.

(function (root) {
	'use strict';

	var EngCalcs = root.EngCalcs = root.EngCalcs || {};

	// js/lpn-patterns.js owns what a pattern, a time setting and a control MEAN (ROADMAP Task 248);
	// this file reads them out of the text. In the browser the page's script tags supply it. In
	// Node a harness has no script tags, so it is pulled in here rather than left for every harness
	// to remember -- forgetting it is silent, and the symptom is three sections quietly reported as
	// unread.
	if (typeof require === 'function' && typeof __dirname === 'string' &&
		typeof EngCalcs.lpnTimesDefaults !== 'function') {
		require(__dirname + '/lpn-patterns.js');
	}

	// Flow unit keyword -> {toSI: m3/s per unit, system: 'us'|'si'}. The `system` is what fixes
	// every OTHER unit in the file; EPANET has no way to mix them.
	var FLOW_UNITS = {
		CFS: { toSI: 0.0283168466, system: 'us' },
		GPM: { toSI: 6.30901964e-5, system: 'us' },
		MGD: { toSI: 0.0438126364, system: 'us' },
		IMGD: { toSI: 0.0526168, system: 'us' },
		AFD: { toSI: 0.0142764, system: 'us' },
		LPS: { toSI: 0.001, system: 'si' },
		LPM: { toSI: 1.66666667e-5, system: 'si' },
		MLD: { toSI: 0.0115740741, system: 'si' },
		CMH: { toSI: 2.77777778e-4, system: 'si' },
		CMD: { toSI: 1.15740741e-5, system: 'si' }
	};

	// Exported so a caller comparing our numbers with EPANET's own output has ONE table to read
	// from rather than a second copy of it (dev/lpn-spike/validate_inp.js).
	EngCalcs.lpnInpFlowUnits = FLOW_UNITS;

	var FT = 0.3048, IN = 0.0254, MM = 0.001;
	// 1 psi of water column, in metres. Only used for emitters, which are the one place EPANET
	// states a coefficient per unit of PRESSURE rather than per unit of head.
	var PSI_M = 0.703070;

	// Sections we read. Anything else in the file is either irrelevant to a steady-state hydraulic
	// solve (report/times/graphics settings) or a cut feature, and the cut ones are named in
	// REPORTABLE below so they are counted rather than skipped in silence.
	// [PATTERNS], [TIMES] and [CONTROLS] LEFT THIS TABLE in Task 248: they are read now, into
	// `patterns`, `times` and `controls` on the result. [RULES] stays -- rule-based controls are a
	// language and are deliberately out of scope (see js/lpn-patterns.js's header).
	// **[BACKDROP] UNITS -- THE FILE'S OWN STATEMENT ABOUT ITS COORDINATES** (Task 447). EPANET's Map
	// Dimensions dialog offers exactly these four words and writes the chosen one here, so a file
	// saying DEGREES is a file saying its X and Y are a longitude and a latitude. Any other word is
	// left as the file's own token with no meaning attached; see the reader below for why "the file
	// said NONE" and "the file said nothing" must stay tellable apart.
	var LPN_INP_MAP_UNITS = {
		FEET: 'feet', METERS: 'meters', DEGREES: 'degrees', NONE: 'none'
	};

	var REPORTABLE = {
		VALVES: 'valves',
		RULES: 'rules', ENERGY: 'energy', QUALITY: 'quality', REACTIONS: 'reactions',
		SOURCES: 'sources', MIXING: 'mixing'
	};

	/**
	 * Split one line into tokens, honouring the quoted string [LABELS] uses for its text.
	 * EPANET strips `;` comments first, and so do we -- a label's own text is quoted before
	 * any semicolon it might contain could matter.
	 */
	function tokenize(line) {
		var out = [], i = 0, n = line.length, c, start;
		while (i < n) {
			c = line.charAt(i);
			if (c === ' ' || c === '\t') { i++; continue; }
			if (c === '"') {
				start = ++i;
				while (i < n && line.charAt(i) !== '"') { i++; }
				out.push(line.slice(start, i));
				i++; // closing quote
				continue;
			}
			start = i;
			while (i < n && line.charAt(i) !== ' ' && line.charAt(i) !== '\t') { i++; }
			out.push(line.slice(start, i));
		}
		return out;
	}

	function num(tok, fallback) {
		var v = parseFloat(tok);
		return isFinite(v) ? v : (fallback === undefined ? 0 : fallback);
	}

	// ---- THE TOKEN, KEPT BESIDE THE NUMBER (ROADMAP Task 390 step 3) ----------------------------
	//
	// A number's VALUE and its TEXT are two different facts about the file, and both of them are the
	// user's. `parseFloat('710.0')` can only ever come back as `710`; across EPA's own Net1/Net2/Net3
	// 243 of 2,608 numeric tokens (9.3%) are written in a form `String(parseFloat(t))` does not
	// reproduce -- `220.0`, `20.00`, `4530.`. Value fidelity was fixed by passing the NUMBER through
	// untouched; this is the other half.
	//
	// **A TOKEN IS A STRING AND MUST NEVER REACH ARITHMETIC.** `'710' * 2` is 1420 and `'710' + 1` is
	// `'7101'`, and only one of those looks wrong. So a token never occupies the field its number
	// occupies: every record carries a SEPARATE `tok` object keyed by field name, nothing reads it
	// but EngCalcs.lpnNumText() below, and that function returns a string in every branch. This is
	// CLAUDE.md's rule -- a number the user supplied and a number we computed must never share a
	// field -- applied one level down, to the text and the number.
	//
	// Three conditions, and each one deletes a class of bug rather than warning about it:
	//   1. `String(v) !== tok` -- nothing to remember when the plain rendering already matches, so an
	//      ordinary file carries no `tok` object at all and only the 9.3% costs anything.
	//   2. `parseFloat(tok) === v` -- the text must still SAY this number. A value that was scaled
	//      (a demand times a multiplier), converted, or defaulted from a missing column fails this
	//      and keeps no token, so no later reader can be handed the text of a different number.
	//   3. the same test AGAIN at read time (lpnNumText), so a value the user later edited drops its
	//      stale token by itself. No edit path has to remember to clear one, which is why this needs
	//      nothing of setProp() or of the scenario-override machinery.
	// SETS OR REMOVES -- never only sets. A field written twice (a [DEMANDS] category over a
	// [JUNCTIONS] demand, a [STATUS] setting over a [VALVES] one) would otherwise keep the first
	// row's text against the second row's number, which is the exact confusion this whole task is
	// about. Making the function an assignment rather than an accumulation means no call site has
	// to know it is the second one.
	function mergeTok(rec, key, tok, v) {
		if (typeof tok === 'string' && tok !== '' && String(v) !== tok && parseFloat(tok) === v) {
			(rec.tok || (rec.tok = {}))[key] = tok;
		} else if (rec.tok) {
			delete rec.tok[key];
		}
		return v;
	}

	/**
	 * The exact text a value must be written back as. Task 281's (`.inp` export) one entry point,
	 * and dev/lpn-spike/inp-token-harness.js's.
	 *
	 * ALWAYS RETURNS A STRING. That is the whole containment: nothing that reads this can be
	 * mistaken for a number, and nothing that reads the number can be handed a token.
	 */
	EngCalcs.lpnNumText = function (rec, key, value) {
		var t = rec && rec.tok ? rec.tok[key] : undefined;
		if (typeof t === 'string' && parseFloat(t) === value) { return t; }
		return String(value);
	};

	/**
	 * Read an EPANET `.inp` into an SI model plus a report of everything it could not keep.
	 *
	 * Returns null-free: `ok` false with `error` set means the text was not an `.inp` at all.
	 * `ok` true with a non-empty `dropped` means it WAS imported, and the caller owes the user
	 * the list.
	 */
	EngCalcs.lpnInpParse = function (text) {
		var lines = String(text == null ? '' : text).split(/\r\n|\r|\n/),
			section = '',
			rawSections = {},   // name -> array of token arrays, for the sections we read below
			seen = {},          // name -> row count, for the ones we only count
			i, line, semi, toks;

		for (i = 0; i < lines.length; i++) {
			line = lines[i];
			semi = line.indexOf(';');
			if (semi >= 0) { line = line.slice(0, semi); }
			if (!line.trim()) { continue; }
			if (line.charAt(0) === '[' || /^\s*\[/.test(line)) {
				section = line.trim().replace(/^\[|\]\s*$/g, '').toUpperCase();
				if (!rawSections[section]) { rawSections[section] = []; }
				continue;
			}
			toks = tokenize(line);
			if (!toks.length) { continue; }
			if (!rawSections[section]) { rawSections[section] = []; }
			rawSections[section].push(toks);
			seen[section] = (seen[section] || 0) + 1;
		}

		// A file with no [JUNCTIONS] and no [PIPES] is not a network, whatever else it holds. This
		// is the whole "is this an .inp?" test, and it is deliberately weak: a hand-edited file
		// missing [TITLE] or [END] is still a perfectly good network, and refusing it would be
		// pedantry the user cannot act on.
		if (!rawSections.JUNCTIONS && !rawSections.PIPES && !rawSections.RESERVOIRS) {
			return { ok: false, error: 'not-an-inp' };
		}

		var dropped = [];
		// **`group` IS NOT DECORATION: AN EPANET ID IS ONLY UNIQUE WITHIN ITS OWN KIND.** Net3 has a
		// junction 123 and a pipe 123, and 3 of its 4 element-naming differences name an id that
		// exists twice -- so a per-asset note keyed by the bare id lands a junction's demand pattern
		// on a pipe as well. The kind is known at the moment the difference is found and nowhere
		// afterwards, so it is stated here rather than inferred from the code later. Null means the
		// difference belongs to the network, not to an element.
		function drop(code, ids, detail, group) {
			dropped.push({
				code: code, ids: ids || [], detail: detail === undefined ? null : detail,
				group: group || null
			});
		}

		// ---- [OPTIONS], first, because the flow unit fixes every other unit in the file ----
		var flowKey = 'GPM', headloss = 'H-W', emitterExponent = 0.5, demandMultiplier = 1,
			defaultPattern = null, rows, r;
		rows = rawSections.OPTIONS || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			var key = (r[0] || '').toUpperCase();
			if (key === 'UNITS' && r[1]) { flowKey = r[1].toUpperCase(); }
			else if (key === 'HEADLOSS' && r[1]) { headloss = r[1].toUpperCase(); }
			else if (key === 'EMITTER' && r[2]) { emitterExponent = num(r[2], 0.5); }
			else if (key === 'DEMAND' && r[2]) { demandMultiplier = num(r[2], 1); }
			// **[OPTIONS] Pattern IS THE DEFAULT DEMAND PATTERN, AND IT IS THE EASIEST THING IN
			// THIS FILE TO MISS.** A junction whose [JUNCTIONS] pattern column is BLANK does not
			// have "no pattern" -- it has this one. Net3 says `Pattern 1`, and pattern 1 starts at
			// 1.34, so a reader that treats a blank column as 1.00 is 34% low on nearly every
			// demand in the network at t=0 while every number it can see looks reasonable. That is
			// the second of the two bugs recorded in dev/lpn-spike/net3-vs-epanet-report.js's
			// header, and it cost 13% of flow.
			else if (key === 'PATTERN' && r[1]) { defaultPattern = r[1]; }
		}
		var fu = FLOW_UNITS[flowKey];
		if (!fu) { drop('unknown-flow-units', [], flowKey); fu = FLOW_UNITS.GPM; flowKey = 'GPM'; }
		var us = fu.system === 'us',
			lenSI = us ? FT : 1,            // file length unit -> m
			diaSI = us ? IN : MM,           // file pipe-diameter unit -> m
			headSI = us ? FT : 1,           // file elevation/head unit -> m
			pressSI = us ? PSI_M : 1,       // file PRESSURE unit -> m of water (emitters, PRV/PSV)
			qSI = fu.toSI;

		// The page computes Hazen-Williams and has no control for anything else yet, so a D-W or
		// C-M file would import roughness numbers that are then read as a
		// Hazen-Williams C. The numbers are kept AS WRITTEN rather than converted into a fake C --
		// converting would destroy the file's own data to produce an answer that is still wrong --
		// and the caller is told, loudly, that the results will not match the source until the
		// friction-method control ships.
		if (headloss !== 'H-W') { drop('headloss-formula', [], headloss); }

		// ---- [PATTERNS] and [TIMES] (ROADMAP Tasks 248.01, 248.02) ----
		//
		// THE ARITHMETIC IS NOT HERE. js/lpn-patterns.js owns what a pattern MEANS -- the wrap, the
		// pattern-start offset, the [TIMES] defaults, the four control sentences -- and this file
		// owns only what the file SAYS. Two files, one subject, and the split is the same one
		// lpn-geom.js draws: the pure half is testable without a file and the reading half without
		// a browser.
		//
		// **A MISSING js/lpn-patterns.js DEGRADES, IT DOES NOT THROW.** The page loads its scripts
		// in a fixed order and a forgotten tag would otherwise take the whole importer down for a
		// section that is not even the point of the file. So the sections are reported as unread,
		// exactly as they were before Task 248, and the reason is named in the report rather than
		// left for somebody to notice.
		var haveClock = typeof EngCalcs.lpnParseControl === 'function' &&
			typeof EngCalcs.lpnTimesDefaults === 'function';
		if (!haveClock) {
			// Exactly the pre-Task-248 report, section by section, so a page that has not yet added
			// the script tag behaves as it always did rather than telling every user about a
			// section their file does not contain.
			if (seen.PATTERNS) { drop('patterns', [], 'lpn-patterns.js not loaded'); }
			if (seen.CONTROLS) { drop('controls', [], 'lpn-patterns.js not loaded'); }
			if (seen.TIMES) { drop('extended-period', [], 'lpn-patterns.js not loaded'); }
		}

		var patterns = [], patternIndex = {}, times = null, controls = [];
		rows = rawSections.PATTERNS || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			if (!r[0]) { continue; }
			// **THE ID REPEATS AND THE MULTIPLIERS CONCATENATE.** Net3's pattern 1 is four lines of
			// six values and is one 24-hour pattern, not four patterns of six; a reader that
			// replaced instead of appending would keep only the last six hours of the day.
			var pat = patternIndex[r[0]];
			if (!pat) {
				pat = { id: r[0], multipliers: [] };
				patterns.push(pat); patternIndex[r[0]] = pat;
			}
			for (var pj = 1; pj < r.length; pj++) {
				var pv = parseFloat(r[pj]);
				if (!isFinite(pv)) { continue; }
				// A multiplier's own text, keyed by its position in the CONCATENATED series -- so
				// `m5` is the sixth value of the pattern however many lines it took to write. `.76`
				// and `1.10` are both in Net3 and neither survives String(parseFloat()).
				mergeTok(pat, 'm' + pat.multipliers.length, r[pj], pv);
				pat.multipliers.push(pv);
			}
		}

		// [TIMES] values are DURATIONS AND CLOCK TIMES, not plain numbers -- `24:00` is 86400
		// seconds and parseFloat says 24 -- so mergeTok cannot hold their text and they keep their
		// own `text` bag, read back through EngCalcs.lpnTimeText(). Same rule, different parser.
		rows = rawSections.TIMES || [];
		if (haveClock) {
			times = EngCalcs.lpnTimesDefaults();
			times.text = {};
			for (i = 0; i < rows.length; i++) {
				r = rows[i];
				if (!r[0]) { continue; }
				// EPANET's keywords are one or two words ('Duration', 'Pattern Timestep'), matched
				// with the spaces squeezed out so 'PatternTimestep' and 'PATTERN TIMESTEP' agree.
				var tk1 = (r[0] || '').toUpperCase(),
					tk2 = tk1 + (r[1] || '').toUpperCase(),
					twoWord = !!EngCalcs.lpnTimesKeys[tk2],
					field = twoWord ? EngCalcs.lpnTimesKeys[tk2] : EngCalcs.lpnTimesKeys[tk1],
					vals = twoWord ? r.slice(2) : r.slice(1),
					secs;
				// Quality Timestep, Report Start's siblings and Statistic all land here and are
				// skipped: nothing on this page reads them (see lpnTimesDefaults).
				if (!field) { continue; }
				secs = EngCalcs.lpnParseTime(vals);
				if (secs === null) { continue; }
				times[field] = secs;
				times.text[field] = vals.join(' ');
			}
		}

		// ---- nodes ----
		var nodes = [], nodeIndex = {};
		function addNode(n) { nodes.push(n); nodeIndex[n.id] = n; return n; }

		rows = rawSections.JUNCTIONS || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			if (!r[0]) { continue; }
			var jn = addNode({
				id: r[0], type: 'junction', x: 0, y: 0,
				elev: num(r[1]),
				// The multiplier is dimensionless, so applying it here keeps the number in the
				// file's own flow unit.
				demand: num(r[2]) * demandMultiplier,
				emitter: 0
			});
			mergeTok(jn, 'elev', r[1], jn.elev);
			// Keeps no token when the multiplier is not 1: the text says the file's number and the
			// field now holds a scaled one, so mergeTok's own second test refuses it. Nothing here
			// has to know that -- see its comment.
			mergeTok(jn, 'demand', r[2], jn.demand);
			// THE REFERENCE IS KEPT, and the difference is still REPORTED: the pattern is on the
			// junction now, but no solve reads it yet (the solve is one moment, ROADMAP Task 248),
			// so at t=0 this page still shows the base demand where EPANET shows the base demand
			// times the pattern's first multiplier. That is a real difference until the run does,
			// and the importer's contract is to name every one of them.
			// null means "the column was blank", NOT "no pattern": the document-level
			// `defaultPattern` above applies. The resolution is the CALLER's -- storing the default
			// here would put a number the file never wrote on this junction into a field labelled
			// as the file's, which is the confusion CLAUDE.md's number rule is about. Read it as
			// `jn.demandPattern || parsed.defaultPattern`.
			jn.demandPattern = r[3] || null;
			if (r[3]) { drop('demand-pattern', [r[0]], r[3], 'node'); }
		}

		rows = rawSections.RESERVOIRS || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			if (!r[0]) { continue; }
			// **EPANET's reservoir column is a TOTAL HEAD, so it lands in HEAD and nowhere else**
			// (ROADMAP Task 390's last open item). It used to be written into the elevation as
			// well, on the reasoning that a reservoir's water surface sits at its ground -- which
			// is a fact about a reservoir somebody DREW, not one this file states. An `.inp` says
			// where the water surface is and says nothing whatever about the ground, so writing a
			// ground elevation from it put a number the user never supplied into a field labelled
			// as theirs. The solve is identical either way: reservoirHead() reads the head.
			//
			// What follows from it is that an imported reservoir has NO elevation, so its pressure
			// is not knowable and is shown as blank rather than as zero. That is the honest reading
			// of the file, and it is the shape this whole task is about: one field, one meaning.
			var rn = addNode({ id: r[0], type: 'reservoir', x: 0, y: 0, head: num(r[1]) });
			// One token for one column, under the name the DOCUMENT stores it as.
			mergeTok(rn, 'head', r[1], rn.head);
			rn.headPattern = r[2] || null;
			if (r[2]) { drop('head-pattern', [r[0]], r[2], 'node'); }
		}

		// TANKS ARE IMPORTED AS TANKS, never as a reservoir at their initial level -- that
		// substitution would silently turn a storage element into an infinite source.
		//
		// [TANKS] is  ID  Elev  InitLvl  MinLvl  MaxLvl  Diam  MinVol  [VolCurve]  [Overflow].
		// EVERY LENGTH HERE IS IN THE FILE'S LENGTH UNIT, THE DIAMETER INCLUDED -- unlike a pipe
		// diameter two sections later, which is in inches or millimetres. MinVol is a VOLUME, so it
		// is the length unit cubed.
		rows = rawSections.TANKS || [];
		var volCurveIds = [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			if (!r[0]) { continue; }
			var tn = addNode({
				id: r[0], type: 'tank', x: 0, y: 0,
				elev: num(r[1]),
				level: num(r[2]),
				minLevel: num(r[3]),
				maxLevel: num(r[4]),
				diameter: num(r[5]),
				// The solve reads `head`, and at the instant a steady-state solve describes, the
				// water surface is the bottom plus the initial level. See EngCalcs.lpnIsFixedHead.
				// DERIVED, so it gets no token: it is a number we computed, and the whole point of
				// the split is that such a number never carries the user's text.
				head: num(r[1]) + num(r[2])
			});
			mergeTok(tn, 'elev', r[1], tn.elev);
			mergeTok(tn, 'level', r[2], tn.level);
			mergeTok(tn, 'minLevel', r[3], tn.minLevel);
			mergeTok(tn, 'maxLevel', r[4], tn.maxLevel);
			mergeTok(tn, 'diameter', r[5], tn.diameter);
			// A VOLUME CURVE makes the tank non-cylindrical, and this page holds only a diameter.
			// The level -> head relationship a steady-state solve uses is unaffected (the surface is
			// still Elev + InitLvl), so the imported network solves identically; what is lost is how
			// the level would MOVE over time, which matters once extended-period simulation lands.
			// Reported rather than faked, per this module's whole contract.
			if (r[7] && r[7] !== '*' && r[7] !== '0') { volCurveIds.push(r[0]); }
		}
		if (volCurveIds.length) { drop('tank-volume-curve', volCurveIds, null, 'node'); }

		// ---- demand categories ----
		// [DEMANDS] REPLACES the [JUNCTIONS] demand rather than adding to it, measured rather than
		// assumed: a junction with 100 in [JUNCTIONS] and rows of 50 and 25 in [DEMANDS] is reported
		// by the real engine as 75, not 175 (checked against js/vendor/epanet-js.js). Adding instead
		// of replacing inflates every multi-category junction in silence.
		// Categories then SUM into this page's single demand field. That is the same network -- a
		// junction's total draw is what the solve uses -- and the caller is told the breakdown was
		// flattened, since nothing here can hold two categories.
		var multiDemand = [], zeroed = {};
		rows = rawSections.DEMANDS || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			var dn = nodeIndex[r[0]];
			if (!dn || dn.type !== 'junction') { continue; }
			if (!zeroed[r[0]]) {
				dn.demand = 0; zeroed[r[0]] = true; multiDemand.push(r[0]);
			}
			dn.demand += num(r[1]) * demandMultiplier;
			// A single category that survives the sum keeps its own text. A second one lands on a
			// total no single token states, and mergeTok drops it.
			mergeTok(dn, 'demand', r[1], dn.demand);
			// The LAST category's pattern wins, because this page holds one demand and therefore
			// one pattern. Two categories on different patterns are two different daily shapes and
			// no single one of them describes the sum -- which is what 'demand-categories' below
			// already tells the user about the demand itself.
			if (r[2]) { dn.demandPattern = r[2]; drop('demand-pattern', [r[0]], r[2], 'node'); }
		}
		if (multiDemand.length) { drop('demand-categories', multiDemand, null, 'node'); }

		// ---- emitters ----
		// THE ONE QUANTITY STILL CONVERTED TO SI, and it is the exception that proves the rule: an
		// emitter coefficient is a DERIVED quantity (flow per pressure^gamma), this page has no
		// selector for it and never displays it, so there is no file unit for it to be returned in
		// and no display round trip for a conversion to spoil. EPANET states it per unit of
		// PRESSURE (psi under US units, metres under SI); js/lpn-solver.js wants it per unit of
		// HEAD in metres, with flow in m3/s. Both scales move.
		rows = rawSections.EMITTERS || [];
		var emitterIds = [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			var en = nodeIndex[r[0]];
			if (!en) { continue; }
			en.emitter = num(r[1]) * qSI / Math.pow(pressSI, emitterExponent);
			emitterIds.push(r[0]);
		}
		// Imported rather than dropped -- an emitter changes the answer, so removing it would be
		// the silent-data-loss this module exists to avoid. But nothing in the UI can show or edit
		// one yet (see the note at settings.emitterExponent), so the user is told it is there.
		if (emitterIds.length) { drop('emitters-not-editable', emitterIds, null, 'node'); }

		// ---- links ----
		var links = [], linkIndex = {};

		rows = rawSections.PIPES || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			if (!r[0]) { continue; }
			var st = (r[7] || 'OPEN').toUpperCase();
			// A check valve is a cut element. It is imported as an OPEN pipe -- the same pipe
			// minus the one-way rule -- because dropping it would disconnect the network, and the
			// caller reports it so the user knows the direction constraint is gone.
			if (st === 'CV') { drop('check-valve', [r[0]], null, 'link'); st = 'OPEN'; }
			var pipe = {
				id: r[0], type: 'pipe', from: r[1], to: r[2],
				length: num(r[3]),                    // stays in the FILE's length unit -- see header
				diameter: num(r[4]),                  // stays in the FILE's pipe-diameter unit
				roughness: num(r[5]),                 // dimensionless C for H-W; see headloss note
				k: num(r[6]),
				status: st === 'CLOSED' ? 'closed' : 'open',
				verts: []
			};
			mergeTok(pipe, 'length', r[3], pipe.length);
			mergeTok(pipe, 'diameter', r[4], pipe.diameter);
			mergeTok(pipe, 'roughness', r[5], pipe.roughness);
			mergeTok(pipe, 'k', r[6], pipe.k);
			links.push(pipe); linkIndex[pipe.id] = pipe;
		}

		// ---- curves, needed before pumps can be resolved ----
		var curves = {};
		rows = rawSections.CURVES || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			if (!r[0]) { continue; }
			if (!curves[r[0]]) { curves[r[0]] = []; }
			// File flow unit and file head unit, matching every other number here.
			//
			// NO TOKENS ON A CURVE POINT, and that is a decision rather than an omission. A pump
			// curve does not survive as text in either direction: a curve of more than three points
			// is sampled at its ends and middle on the way in, and js/lpn-epanet.js's [CURVES]
			// writer re-samples our fitted curve at [0, 0.5, 0.9] q_max on the way out. There is no
			// point at which the file's own text still describes what we would write, so keeping it
			// would be keeping text for a number nobody will ever emit.
			curves[r[0]].push([num(r[1]), num(r[2])]);
		}

		rows = rawSections.PUMPS || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			if (!r[0]) { continue; }
			var pump = { id: r[0], type: 'pump', from: r[1], to: r[2], curvePoints: [], verts: [] },
				j, kw;
			for (j = 3; j < r.length; j++) {
				kw = (r[j] || '').toUpperCase();
				if (kw === 'HEAD' && r[j + 1]) {
					// **THE CURVE'S NAME IS KEPT EVEN THOUGH ITS POINTS' TEXT IS NOT** (Task 430).
					// The note in [CURVES] above -- that a curve does not survive as text -- is about
					// the POINTS, which get sampled and re-sampled. The id is a separate thing: it is
					// the user's own label, it is never arithmetic, and without it the writer invents
					// `C_<pumpid>` and Net3's curves `1` and `2` come back as `C_10` and `C_335`.
					pump.curveId = r[j + 1];
					var pts = curves[r[j + 1]] || [];
					if (!pts.length) { drop('pump-curve-missing', [r[0]], r[j + 1], 'link'); }
					else if (pts.length <= 3) { pump.curvePoints = pts.slice(); }
					else {
						// This page fits h = h0 - a Q^b from at most three points (see
						// EngCalcs.lpnPumpFromCurve). A longer curve is sampled at its ends and
						// middle rather than truncated, so the fitted curve still spans the pump's
						// real operating range instead of only its low-flow end.
						var sorted = pts.slice().sort(function (u, v) { return u[0] - v[0]; });
						pump.curvePoints = [sorted[0], sorted[Math.floor((sorted.length - 1) / 2)], sorted[sorted.length - 1]];
						drop('pump-curve-reduced', [r[0]], pts.length, 'link');
					}
					j++;
				} else if (kw === 'POWER') {
					// A constant-power pump is H = P/(rho g Q) -- a different law from the one this
					// page's solver carries, and not expressible as three points on ours. Imported
					// as a curveless pump (a lossless connection) and reported.
					drop('pump-constant-power', [r[0]], r[j + 1], 'link');
					j++;
				} else if (kw === 'SPEED') {
					// Kept whatever it is, so a later reader need not re-tokenize the row; only a
					// speed that is not 1 changes the answer, and only that is reported.
					pump.speed = num(r[j + 1], 1);
					if (pump.speed !== 1) { drop('pump-speed', [r[0]], r[j + 1], 'link'); }
					j++;
				} else if (kw === 'PATTERN') {
					// A pump SCHEDULE: the multiplier series is a speed, not a demand, which is
					// why js/lpn-patterns.js knows nothing about what a pattern is for.
					pump.speedPattern = r[j + 1] || null;
					drop('pump-pattern', [r[0]], r[j + 1], 'link');
					j++;
				}
			}
			links.push(pump); linkIndex[pump.id] = pump;
		}

		// VALVES ARE IMPORTED AS VALVES. Four of the five types are real elements, and the split
		// that remains is about WHICH ENGINE, not about what we can hold:
		//   - TCV        a throttle: a minor loss on a zero-length link, so it solves in either
		//                engine (EngCalcs.lpnLinkK).
		//   - PRV/PSV/FCV  active controls whose open/active/closed state comes out of the solve.
		//                Imported in full and solved by the EPANET engine, to which the page routes
		//                automatically. Reported anyway -- a file that arrives needing a different
		//                engine has changed for the reader, even though nothing was lost.
		//   - PBV/GPV    still substituted with an open pipe. A GPV's whole behaviour lives in a
		//                head-loss CURVE and a PBV's in a fixed pressure drop; this page has no
		//                element for either, and inventing one from a curve id we do not store
		//                would be the silent-substitution failure this module exists to avoid.
		//
		// SETTING UNITS DIFFER BY TYPE and are fixed by the file's own flow-unit keyword, exactly
		// as on the writing side (js/lpn-epanet.js): a PRV/PSV setting is a PRESSURE (psi in a US
		// file, metres of water in an SI one), an FCV setting is a FLOW, a TCV setting is
		// dimensionless. Reading a psi as a metre is a factor of 1.42 and the network still solves.
		// A setting is handed back exactly as the file wrote it, like everything else here, so
		// there is no conversion function -- only a rule about which unit the number is IN, and
		// `settingUnit` states it so a caller never has to re-derive the type table. A [STATUS]
		// line can override a valve's setting, and reads the same way.
		function valveSettingUnit(type) {
			if (type === 'PRV' || type === 'PSV' || type === 'PBV') { return 'press'; }
			if (type === 'FCV') { return 'flow'; }
			return null;   // TCV is dimensionless; a GPV's "setting" is a curve id, not a number.
		}

		rows = rawSections.VALVES || [];
		var tcvIds = [], activeValveIds = [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			if (!r[0]) { continue; }
			var vtype = (r[4] || '').toUpperCase(),
				vdia = num(r[3]),
				setting = num(r[5]),
				vloss = num(r[6]),
				vlink;
			// LENGTH ZERO on every one of these, and that is exact rather than approximate: a valve
			// has no length in EPANET, and EngCalcs.lpnResistance returns r = 0 for a zero-length
			// link while the minor-loss term (k V^2 / 2g) is computed from k and diameter alone. So
			// no friction is ever smuggled in by giving a valve a plausible-looking length.
			// A valve with no diameter of its own would divide by zero in that same term, so it
			// falls back to a sensible main rather than breaking the solve.
			var vcommon = {
				id: r[0], from: r[1], to: r[2],
				length: 0,
				diameter: vdia || (us ? 8 : 200),   // in the file's pipe-diameter unit: in or mm
				roughness: 150,
				status: (r[7] || '').toUpperCase() === 'CLOSED' ? 'closed' : 'open',
				verts: []
			};
			// **PBV AND GPV ARE REAL ELEMENTS NOW** (Task 248). Both used to arrive as an open pipe
			// carrying the minor-loss column, with the control reported gone. A PBV is a fixed
			// pressure DROP -- a setting in the same unit as a PRV's -- and a GPV's head loss
			// follows a CURVE, which this page can now hold because the curve belongs to the valve
			// and is named after it (Task 248.04), exactly as a pump's does.
			//
			// **A GPV NAMING A CURVE THE FILE DOES NOT CONTAIN still arrives as a valve**, with no
			// points. It solves as an open connection and js/lpn-epanet.js reports that, which is
			// the same treatment a pump with no curve gets -- an honest empty element beats a pipe
			// wearing the wrong name.
			{
				if (vtype === 'TCV') { tcvIds.push(r[0]); } else { activeValveIds.push(r[0]); }
				// A GPV's sixth column is a curve NAME, so the points come out of [CURVES] under it
				// and there is no numeric setting at all.
				var gcurve = vtype === 'GPV' ? (curves[r[5]] || []) : null;
				vlink = Object.assign({}, vcommon, {
					type: 'valve',
					valveType: vtype || 'TCV',
					setting: vtype === 'GPV' ? 0 : setting,
					settingUnit: valveSettingUnit(vtype),
					// A TCV's loss is its SETTING ALONE. The [VALVES] minor-loss column is IGNORED
					// for it, which is the opposite of what the section's own column heading
					// suggests and was measured rather than assumed (js/vendor/epanet-js.js:
					// setting 16 with loss 0 gives 8.00 ft, setting 12 with loss 3 gives 6.00 ft
					// = 12/16 of it, and setting 0 with loss 16 gives exactly zero). Adding the
					// two -- the obvious reading -- puts ~10.6 m of phantom head into a real model.
					// So a TCV's k is stored as zero and never read; EngCalcs.lpnLinkK is the one
					// place that rule lives.
					k: vtype === 'TCV' ? 0 : vloss
				});
				if (gcurve) {
					vlink.curvePoints = gcurve.map(function (pt) { return [pt[0], pt[1]]; });
					if (!gcurve.length && r[5]) { drop('gpv-curve-missing', [r[0]], r[5], 'link'); }
				}
			}
			// A valve's diameter falls back to a plausible main when the column is blank, and a TCV's
			// k is forced to zero -- both are numbers WE chose, so mergeTok refuses their columns'
			// text on its own and neither case needs a branch here.
			mergeTok(vlink, 'diameter', r[3], vlink.diameter);
			mergeTok(vlink, 'k', r[6], vlink.k);
			if (vlink.type === 'valve') { mergeTok(vlink, 'setting', r[5], vlink.setting); }
			links.push(vlink); linkIndex[vlink.id] = vlink;
		}
		if (tcvIds.length) { drop('valve-tcv', tcvIds, null, 'link'); }
		if (activeValveIds.length) { drop('valve-active', activeValveIds, null, 'link'); }

		// ---- [STATUS] overrides ----
		rows = rawSections.STATUS || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			var sl = linkIndex[r[0]];
			if (!sl) { continue; }
			var sv = (r[1] || '').toUpperCase();
			if (sv === 'CLOSED') { sl.status = 'closed'; }
			else if (sv === 'OPEN') { sl.status = 'open'; }
			else if (sl.type === 'valve' && r[1] !== '' && isFinite(+r[1])) {
				// A NUMBER here is a SETTING, not a status, and for a valve that is a value this
				// page can hold -- so it is applied rather than reported as a loss. It is in the
				// same units the [VALVES] row's own setting column was, so it goes through the
				// same converter. For a PUMP a number is a speed multiplier,
				// which this page has no element for, so that case still falls through to the
				// report below.
				sl.setting = +r[1];
				mergeTok(sl, 'setting', r[1], sl.setting);
			}
			else { drop('link-setting', [r[0]], r[1], 'link'); }
		}

		// ---- [CONTROLS] (ROADMAP Task 248.03) ----
		//
		// The sentence shapes are parsed by js/lpn-patterns.js, which knows the grammar and nothing
		// else. WHAT THIS FILE ADDS IS THE UNITS, and they are the trap: a multiplier is
		// dimensionless, but a control's threshold and its setting are neither dimensionless nor
		// the same as each other.
		//
		//   threshold  a TANK's is a water LEVEL above its own bottom, in the file's length unit;
		//              a JUNCTION's is a PRESSURE. Told apart only by the node's TYPE. A reservoir
		//              counts as a tank here, which is EPANET's own reading -- everything that is
		//              not a junction is a level.
		//   setting    whatever a number means on THAT link: valveSettingUnit() for a valve, a
		//              dimensionless speed multiplier for a pump. Read from the same function the
		//              [VALVES] rows and the [STATUS] overrides use, so there is one type table in
		//              this file and not three.
		//
		// A control naming a link or a node the file does not contain is reported, not dropped in
		// silence and not repaired -- the same treatment a dangling link gets.
		rows = rawSections.CONTROLS || [];
		if (haveClock) {
			for (i = 0; i < rows.length; i++) {
				var parsedCtl = EngCalcs.lpnParseControl(rows[i]);
				if (!parsedCtl.ok) { drop('controls', [], parsedCtl.raw + ' (' + parsedCtl.error + ')'); continue; }
				var ctl = parsedCtl.control, cLink = linkIndex[ctl.link];
				if (!cLink) { drop('controls', [ctl.link], ctl.raw + ' (link not in file)', 'link'); continue; }
				if (ctl.action.setting !== undefined) {
					ctl.action.settingUnit = cLink.type === 'valve'
						? valveSettingUnit((cLink.valveType || '').toUpperCase())
						: null;
				}
				if (ctl.condition.kind === 'node') {
					var cNode = nodeIndex[ctl.condition.node];
					if (!cNode) { drop('controls', [ctl.condition.node], ctl.raw + ' (node not in file)', 'node'); continue; }
					// 'head' and 'press' are keys of `scale` below, so a caller wanting SI
					// multiplies by scale[unit] and never re-derives which is which.
					ctl.condition.unit = cNode.type === 'junction' ? 'press' : 'head';
				}
				controls.push(ctl);
			}
		}

		// ---- geometry ----
		rows = rawSections.COORDINATES || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			var cn = nodeIndex[r[0]];
			if (cn) {
				cn.x = num(r[1]); cn.y = num(r[2]);
				mergeTok(cn, 'x', r[1], cn.x);
				mergeTok(cn, 'y', r[2], cn.y);
			}
		}
		rows = rawSections.VERTICES || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			// A VERTEX IS ITS OWN RECORD and carries its own `tok`, rather than the link carrying
			// one bag for all of them: the bag is keyed by field name, and a link has as many x's
			// as it has bends.
			if (linkIndex[r[0]]) {
				var vt = { x: num(r[1]), y: num(r[2]) };
				mergeTok(vt, 'x', r[1], vt.x);
				mergeTok(vt, 'y', r[2], vt.y);
				linkIndex[r[0]].verts.push(vt);
			}
		}

		var labels = [];
		rows = rawSections.LABELS || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			// x y "text" [anchor node]. The anchor is kept: this page has the same concept, so a
			// Text object imported from an anchored EPANET label follows its node exactly as one
			// drawn here does.
			var lb = { x: num(r[0]), y: num(r[1]), text: r[2] || '', anchorNode: r[3] || null, notes: [] };
			mergeTok(lb, 'x', r[0], lb.x);
			mergeTok(lb, 'y', r[1], lb.y);
			// **AN ANCHOR NAMING SOMETHING THE FILE DOES NOT CONTAIN was silently forgotten** until
			// Task 483: the text landed as a free-floating Text at the file's own point and nothing
			// anywhere said what it had been attached to. A label carries no id of its own in the
			// file, so its notes ride on the label record and docFromInp() moves them onto the Text
			// element it mints. The anchor itself is still dropped -- there is nothing to follow --
			// but the name it named survives in the note.
			if (lb.anchorNode && !nodeIndex[lb.anchorNode]) {
				lb.notes.push({ code: 'label-anchor-missing', detail: lb.anchorNode });
				// The missing NAME rides in the ids slot so the report says which one; it is not an
				// element id, and nothing reads it as one -- a Text element takes its notes from
				// this record, never from the id map.
				drop('label-anchor-missing', [lb.anchorNode], null, 'label');
				lb.anchorNode = null;
			}
			labels.push(lb);
		}

		// A PUMP NEEDS A DIAMETER even though no head-loss term uses one. js/lpn-solver.js seeds
		// every link's starting flow from 0.3 * pi d^2 / 4, so a pump without one starts at NaN and
		// the whole network solves to NaN while still reporting ok -- the trap documented on
		// pumpCase in dev/lpn-spike/cases.js. EPANET pumps carry no diameter, so one is inherited
		// from the largest pipe the pump touches (a fair guess at the main it sits in) and falls
		// back to a plain 200 mm / 8 in main when it touches none.
		links.forEach(function (l) {
			if (l.type !== 'pump') { return; }
			var best = 0;
			links.forEach(function (o) {
				if (o.type === 'pump' || !(o.diameter > 0)) { return; }
				if (o.from === l.from || o.to === l.from || o.from === l.to || o.to === l.to) {
					best = Math.max(best, o.diameter);
				}
			});
			l.diameter = best || (us ? 8 : 200);   // file pipe-diameter unit: in or mm
		});

		// A link whose end node never appeared is a broken file, not a cut feature. Left OUT rather
		// than imported, because lpnDiagnose would only report it again as a dangling link, and a
		// drawing the user cannot repair is worse than a drawing that says what was missing.
		var dangling = [];
		links = links.filter(function (l) {
			if (nodeIndex[l.from] && nodeIndex[l.to]) { return true; }
			dangling.push(l.id);
			return false;
		});
		if (dangling.length) { drop('dangling-link', dangling, null, 'link'); }

		// ---- everything else we can only count ----
		Object.keys(REPORTABLE).forEach(function (name) {
			// VALVES is reported above, element by element, which is strictly better. TANKS is not
			// in this table at all: tanks are imported in full, so there is nothing to report.
			if (name === 'VALVES') { return; }
			if (seen[name]) { drop(REPORTABLE[name], [], seen[name]); }
		});
		// **NO LONGER REPORTED: the run landed** (Task 248, 2026-08-18). The sentence said a file with
		// a duration describes more than this page shows, and it was true for exactly as long as a
		// solve was one moment. `js/lpn-time.js` now runs the whole period through the EPANET engine
		// and the map follows the clock, so keeping the line would be telling the user we dropped
		// something we did not. The `extended-period` case stays in inpDropText() for reports saved
		// before today.

		var backdrop = null, mapUnits = null, mapUnitsRaw = null;
		rows = rawSections.BACKDROP || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			if ((r[0] || '').toUpperCase() === 'FILE' && r[1]) {
				// The image itself is NEVER in the file -- neither `.inp` nor EPANET's binary `.net`
				// embeds it, both store only a path on somebody else's disk. So this reports the
				// name and the user attaches the picture themselves through Map, Backdrop.
				backdrop = { file: r.slice(1).join(' ') };
				drop('backdrop-not-embedded', [], backdrop.file);
			}
			// **ABSENT AND `NONE` ARE DIFFERENT FACTS, AND THEY STAY DIFFERENT HERE.** Both open an
			// XY project today, but only one of them is a file that never said anything -- EPA's own
			// Net1, Net2 and Net3 all write `UNITS None`, so treating a missing line as NONE would
			// erase the only distinction a later reader could act on. `mapUnitsRaw` is the file's own
			// token and is null ONLY when there is no UNITS line at all; a word this page does not
			// know keeps its token and leaves `mapUnits` null.
			if ((r[0] || '').toUpperCase() === 'UNITS' && r[1]) {
				mapUnitsRaw = r[1];
				mapUnits = LPN_INP_MAP_UNITS[r[1].toUpperCase()] || null;
			}
		}

		var title = '';
		rows = rawSections.TITLE || [];
		if (rows.length) { title = rows[0].join(' '); }

		return {
			ok: true,
			title: title,
			flowUnits: flowKey,
			unitSystem: fu.system,
			lengthUnit: us ? 'ft' : 'm',
			// SI per ONE of the file's own units, for a caller that wants SI (the solver
			// harnesses do; the page does not). Exported rather than re-derived, so nothing
			// keeps a second copy of these constants.
			scale: { len: lenSI, dia: diaSI, head: headSI, press: pressSI, flow: qSI },
			headloss: headloss,
			emitterExponent: emitterExponent,
			// The clock (ROADMAP Task 248). `times` is null only when js/lpn-patterns.js was not
			// loaded, which is reported above; `patterns` and `controls` are empty arrays for a
			// file that states none, so a caller never has to test for absence.
			patterns: patterns,
			// The [OPTIONS] Pattern default, for every junction whose own column is blank.
			defaultPattern: defaultPattern,
			times: times,
			controls: controls,
			nodes: nodes,
			links: links,
			labels: labels,
			backdrop: backdrop,
			// [BACKDROP] UNITS: 'feet', 'meters', 'degrees' or 'none' when the file names one of
			// EPANET's four, and null both when the line is absent and when its word is one this
			// page does not know. `mapUnitsRaw` tells those two apart -- null there, and only there,
			// means the file said nothing. DEGREES is the one that changes what happens: the import
			// opens a lat/lon project, and every other answer opens an XY one.
			mapUnits: mapUnits,
			mapUnitsRaw: mapUnitsRaw,
			dropped: dropped
		};
	};

	/**
	 * PER-ASSET IMPORT NOTES (ROADMAP Task 483). The import report is a dialog you read once and
	 * dismiss; after that the fact that THIS pump lost its curve, or THIS junction had three demand
	 * categories added together, was gone. This regroups `parsed.dropped` by the element each
	 * difference NAMES, so docFromInp() can file a copy on the element itself and the property
	 * popup can hand it back weeks later.
	 *
	 * **THE NOTE IS A RECORD, NOT A SENTENCE.** `{code, detail}` is stored, never rendered English:
	 * the document is opened in whatever language the reader is using, and freezing the import-time
	 * language into the file would make a Spanish reader's own project speak English forever. The
	 * sentence is composed at display time from the same inpDropText() the report uses, so the two
	 * can never drift apart either.
	 *
	 * A drop with no ids is network-wide (the flow unit, the head-loss formula) and belongs to no
	 * element; it stays in the report alone. A drop naming a dangling link names something that is
	 * deliberately NOT in the document, so it simply matches nothing here.
	 */
	EngCalcs.lpnInpNotes = function (dropped, group) {
		var byId = {};
		(dropped || []).forEach(function (d) {
			if (!d || !d.ids || !d.ids.length) { return; }
			// **KEYED BY KIND AS WELL AS BY ID.** A caller asking for nodes must not be handed a
			// pipe's note because the two share a number -- see the comment on drop(). A difference
			// that named no kind belongs to no element and is skipped here; it is still in the
			// report, which is where a network-wide statement belongs.
			if (!d.group || (group && d.group !== group)) { return; }
			d.ids.forEach(function (id) {
				if (!byId[id]) { byId[id] = []; }
				byId[id].push({ code: d.code, detail: d.detail === undefined ? null : d.detail });
			});
		});
		return byId;
	};

	// ============================================================================================
	// WRITING an EPANET `.inp` (ROADMAP Task 281)
	// ============================================================================================
	//
	// The reader's mirror, and it lives beside it on purpose: the two share the flow-unit table, the
	// pressure constant and the token rule, and a writer keeping its own copies of those would be a
	// second opinion about one file format.
	//
	// NOT js/lpn-epanet.js's lpnToInp(). That one writes LPS always, samples a pump curve at
	// [0, 0.5, 0.9] q_max and preserves nothing, because the only thing that ever reads it is the
	// engine, which hands its answers straight back. A file a HUMAN keeps has the opposite
	// requirement: it comes back in the units they were working in, carrying their own numbers,
	// character for character. Both writers therefore stay.
	//
	// THE ACCEPTANCE CRITERION IS BYTE IDENTITY, never tolerance: import then export reproduces every
	// value the user did not edit as the characters the file stated
	// (dev/lpn-spike/inp-export-harness.js). That is what EngCalcs.lpnNumText() above is for, and it
	// is why nothing here formats a number.
	//
	// THE DOCUMENT IT READS is the SAVED shape -- what docFromInp() builds and serializeProject()
	// writes. Coordinates are Cartesian (y up) and LOCAL to `doc.origin`, so the origin is added back
	// here; this is one of the outward-facing sites Task 354 names. Overridable properties are read
	// through `opts.effective`, so this file spells no scenario key and duplicates no resolver; with
	// no resolver supplied it writes Base.
	//
	// THE ONE PLACE IT REACHES OUTSIDE ITSELF is EngCalcs.unitFactors, and only when the project's
	// units are not a set EPANET can name. Everything else here is still DOM-free and testable in
	// Node.

	// EPANET's ten flow keywords as the unit NAMES this suite uses -- the exact inverse of
	// LPN_INP_FLOW_UNIT in js/looped-network.js, which is the reading direction. That the two are
	// inverses is asserted by dev/lpn-spike/inp-export-harness.js rather than left to inspection.
	var FLOW_KEYWORD_UNIT = {
		GPM: 'gpm', MGD: 'mgd', IMGD: 'imgd', CFS: 'ft3ps', AFD: 'afd',
		LPS: 'lps', LPM: 'lpm', MLD: 'mld', CMH: 'cmh', CMD: 'cmd'
	};
	// The other units a keyword fixes, per system. `fth2o` and `ft` are the same magnitude, as are
	// `mh2o` and `m`, which is why the comparison below is on FACTORS and never on names: an
	// elevation in fth2o is ALREADY in EPANET's US length unit and must not be "converted" through a
	// pair of factors whose product is not exactly 1.
	var FILE_UNITS = {
		us: { len: 'ft', dia: 'in', head: 'ft', press: 'psi' },
		si: { len: 'm', dia: 'mm', head: 'm', press: 'mh2o' }
	};

	// The stand-in pipe a curveless pump becomes needs a roughness in the file's own formula, and
	// "very smooth" is a different number in each. The same three js/lpn-epanet.js uses.
	function roughStandIn(method) {
		if (method === 'dw') { return '0.0000015'; }
		if (method === 'manning') { return '0.008'; }
		return '150';
	}

	/**
	 * Write an EPANET `.inp` for a saved lpn_ document.
	 *
	 *   doc   the saved document shape (docFromInp / serializeProject)
	 *   opts  .effective(el, prop)  scenario resolver; default is Base (`el['_' + prop]`)
	 *         .labelSize(label)     {w, h} of the rendered label IN MAP UNITS, for the corner shift
	 *         .title                [TITLE] text; default doc.project.name
	 *
	 * Returns { ok: true, inp: text, differences: [{code, ids, detail}] }, `differences` being the
	 * export-side twin of the reader's `dropped`: everything this file cannot say, said out loud.
	 * { ok: false, error, detail } is refusal, and there is exactly one cause -- a unit whose
	 * magnitude this browser does not know, where a conversion is unavoidable. Per CLAUDE.md a unit
	 * we cannot convert is NAMED and the operation refused, never guessed at.
	 */
	EngCalcs.lpnExportInp = function (doc, opts) {
		opts = opts || {};
		var eff = typeof opts.effective === 'function'
			? opts.effective
			: function (el, prop) { return el['_' + prop]; };
		function isActive(el) {
			var a = eff(el, 'active');
			return a === undefined || a === null || a === true;
		}
		var differences = [], failure = null;
		function diff(code, ids, detail) {
			differences.push({ code: code, ids: ids || [], detail: detail === undefined ? null : detail });
		}

		var units = doc.units || {},
			settings = doc.settings || {},
			origin = (doc.origin && isFinite(doc.origin.x) && isFinite(doc.origin.y)) ? doc.origin : { x: 0, y: 0 };

		// ---- which .inp unit set this project is written in ----
		// The FLOW selector decides, because the flow keyword is the only unit an `.inp` states.
		var flowUnit = units.lpn_u_flow, flowKey = null, kw;
		for (kw in FLOW_KEYWORD_UNIT) {
			if (FLOW_KEYWORD_UNIT[kw] === flowUnit) { flowKey = kw; break; }
		}
		if (!flowKey) {
			// The three flow units this page offers that EPANET has no keyword for (m3ps, lph, gph).
			// The file cannot name them, so the flows convert into the keyword of the same system and
			// the user is told which. The alternative -- writing the number under a keyword that
			// means something else -- is the silent corruption this module exists to prevent.
			flowKey = (units.lpn_u_length === 'ft' || units.lpn_u_diameter === 'in') ? 'GPM' : 'LPS';
			diff('flow-units-not-epanet', [], (flowUnit || '?') + ' -> ' + flowKey);
		}
		var sys = FLOW_UNITS[flowKey].system, fileU = FILE_UNITS[sys];

		// A converter between two unit NAMES. `same` is the pass-through case, decided by the FACTORS
		// being identical rather than the names being equal: nothing is multiplied, so the user's own
		// token survives. Anything else really does convert, and says so once.
		function converter(projUnit, fileUnit, what) {
			var table = EngCalcs.unitFactors || {},
				fp = Object.prototype.hasOwnProperty.call(table, projUnit) ? table[projUnit] : undefined,
				ff = Object.prototype.hasOwnProperty.call(table, fileUnit) ? table[fileUnit] : undefined;
			if (!projUnit || fp === undefined) {
				if (!failure) { failure = { ok: false, error: 'unknown-unit', detail: projUnit || what }; }
				return { same: true, mul: 1 };
			}
			if (ff === undefined || fp === ff) { return { same: true, mul: 1 }; }
			diff('unit-converted', [], what + ': ' + projUnit + ' -> ' + fileUnit);
			return { same: false, mul: ff / fp };
		}
		var cLen = converter(units.lpn_u_length, fileU.len, 'length'),
			cDia = converter(units.lpn_u_diameter, fileU.dia, 'diameter'),
			cHead = converter(units.lpn_u_elevhead, fileU.head, 'elevation'),
			cPress = converter(units.lpn_u_pressure, fileU.press, 'pressure'),
			cFlow = converter(units.lpn_u_flow, FLOW_KEYWORD_UNIT[flowKey], 'flow');
		if (failure) { return failure; }

		// ONE NUMBER, WRITTEN. `rec`/`key` name where the file's own text was kept, and lpnNumText()
		// hands it back only while it still states this value -- so an edited number loses its token
		// by itself, and a converted one never had a claim to it (`same` is false, the arithmetic
		// moves the value, and the text no longer parses to it).
		function n(c, rec, key, value) {
			var v = (typeof value === 'number' && isFinite(value)) ? value : 0;
			if (c.same) { return EngCalcs.lpnNumText(rec, key, v); }
			return String(v * c.mul);
		}
		// A dimensionless number -- roughness C, minor loss k, a map coordinate. Same token rule.
		var PLAIN = { same: true, mul: 1 };
		function curveNum(c, v) { return c.same ? String(v) : String(v * c.mul); }

		// Column-separated like EPANET's own writer, because the first thing anybody does with an
		// exported file is read it.
		function row(cells) {
			var out = '', i;
			for (i = 0; i < cells.length; i++) { out += (i ? '\t' : ' ') + String(cells[i]); }
			return out;
		}

		var junctions = [], reservoirs = [], tanks = [], pipes = [], pumps = [], valves = [],
			curves = [], emitters = [], statuses = [], coords = [], verts = [], labelRows = [],
			nodeById = {}, omitted = {}, i, j, nd, lk, lb;

		// ---- nodes ----
		for (i = 0; i < (doc.nodes || []).length; i++) {
			nd = doc.nodes[i];
			nodeById[nd.id] = nd;
			if (!isActive(nd)) { omitted[nd.id] = 1; continue; }
			if (nd.type === 'reservoir') {
				// A blank head means "the water surface follows the ground", which is a rule of this
				// page and not of the file. EPANET states one number, so the rule is resolved here --
				// exactly as reservoirHead() resolves it for the solver.
				var rh = eff(nd, 'head');
				if (rh === undefined || rh === null || rh === '') {
					reservoirs.push(row([nd.id, n(cHead, nd, 'elev', nd.elev || 0)]));
				} else {
					reservoirs.push(row([nd.id, n(cHead, nd, '_head', rh)]));
				}
			} else if (nd.type === 'tank') {
				// ID Elev InitLvl MinLvl MaxLvl Diam MinVol. Every one in the ELEVATION unit, the
				// vessel diameter included -- which is NOT the unit a pipe diameter two sections down
				// is in. MinVol 0 is EPANET's own "no separate minimum volume".
				tanks.push(row([nd.id,
					n(cHead, nd, 'elev', nd.elev || 0),
					n(cHead, nd, '_level', eff(nd, 'level') || 0),
					n(cHead, nd, 'minLevel', nd.minLevel || 0),
					n(cHead, nd, 'maxLevel', nd.maxLevel || 0),
					n(cHead, nd, 'tankDiameter', nd.tankDiameter || 0),
					'0']));
			} else {
				// **THE PATTERN COLUMN IS THE JUNCTION'S OWN OR NOTHING** (Task 423). A blank column
				// means [OPTIONS] Pattern applies, which is written once below -- so writing the
				// document-wide default into every row here would be putting a name the file never
				// stated at this row into a column that says the file did.
				junctions.push(row([nd.id,
					n(cHead, nd, 'elev', nd.elev || 0),
					n(cFlow, nd, '_demand', eff(nd, 'demand') || 0)].concat(
					nd.demandPattern ? [String(nd.demandPattern)] : [])));
				var em = eff(nd, 'emitter');
				if (em > 0) {
					// THE ONE QUANTITY THAT CANNOT COME BACK AS TEXT, and it is the same exception the
					// reader documents at [EMITTERS]: the coefficient is held in the solver's own SI
					// terms (m3/s per metre^gamma) because this page has no display unit for it, so
					// the file's number was converted on the way in and converts back here. The VALUE
					// returns; the characters need not.
					emitters.push(row([nd.id, String(em *
						Math.pow(sys === 'us' ? PSI_M : 1, settings.emitterExponent || 0.5) /
						FLOW_UNITS[flowKey].toSI)]));
				}
			}
			coords.push(row([nd.id,
				n(PLAIN, nd, 'x', (nd.x || 0) + origin.x),
				n(PLAIN, nd, 'y', (nd.y || 0) + origin.y)]));
		}

		// ---- links ----
		for (i = 0; i < (doc.links || []).length; i++) {
			lk = doc.links[i];
			if (!isActive(lk)) { continue; }
			if (omitted[lk.from] || omitted[lk.to]) {
				// A link to a node this scenario switched off has nowhere to land, and EPANET rejects
				// a file naming a node it does not contain.
				diff('inactive-node-link', [lk.id]);
				continue;
			}
			var status = eff(lk, 'status') === 'closed' ? 'Closed' : 'Open',
				dia = n(cDia, lk, '_diameter', eff(lk, 'diameter') || 0);
			if (lk.type === 'valve') {
				var vt = (lk.valveType || 'TCV').toUpperCase(),
					setting = eff(lk, 'setting') || 0,
					settingText;
				// A SETTING IS A DIFFERENT QUANTITY PER TYPE and there is no symptom when it goes out
				// in the wrong one -- the same trap js/lpn-epanet.js's [VALVES] writer carries, and
				// the reader's valveSettingUnit() states the type table.
				if (vt === 'FCV') { settingText = n(cFlow, lk, '_setting', setting); }
				else if (vt === 'PRV' || vt === 'PSV' || vt === 'PBV') { settingText = n(cPress, lk, '_setting', setting); }
				else { settingText = n(PLAIN, lk, '_setting', setting); }
				if (vt === 'GPV') {
					var gpts = (lk.curvePoints || []).filter(function (q) {
						return q && isFinite(q[0]) && isFinite(q[1]);
					});
					if (!gpts.length) {
						// EPANET rejects a GPV naming a curve that is not there, so an empty one goes
						// out as an open throttle and is reported -- which is what the reader does in
						// the other direction.
						diff('gpv-no-curve-as-open', [lk.id]);
						vt = 'TCV';
						settingText = '0';
					} else {
						var gname = 'G_' + lk.id;
						for (j = 0; j < gpts.length; j++) {
							curves.push(row([gname, curveNum(cFlow, gpts[j][0]), curveNum(cHead, gpts[j][1])]));
						}
						settingText = gname;
					}
				}
				// A TCV's minor-loss column is IGNORED by EPANET (measured -- see EngCalcs.lpnLinkK),
				// so writing anything but 0 there states a number the engine discards.
				valves.push(row([lk.id, lk.from, lk.to, dia, vt, settingText,
					vt === 'TCV' ? '0' : n(PLAIN, lk, '_k', eff(lk, 'k') || 0)]));
				// A valve row has no status column; a closed one is stated in [STATUS].
				if (status === 'Closed') { statuses.push(row([lk.id, 'Closed'])); }
			} else if (lk.type === 'pump') {
				var pts = (lk.curvePoints || []).filter(function (q) {
					return q && isFinite(q[0]) && isFinite(q[1]);
				});
				if (pts.length) {
					// THE POINTS GO OUT AS THE DOCUMENT HOLDS THEM, never re-sampled off a fitted
					// curve the way the engine adapter does. An imported curve therefore comes back as
					// the curve that arrived, and a curve typed here goes out as typed.
					// The curve's own name when the document has one (an import kept it, Task 430),
					// and an invented one only when it does not -- a curve drawn on this page has no
					// name of its own because this page has no control for one.
					var cname = lk.curveId || ('C_' + lk.id);
					for (j = 0; j < pts.length; j++) {
						curves.push(row([cname, curveNum(cFlow, pts[j][0]), curveNum(cHead, pts[j][1])]));
					}
					pumps.push(row([lk.id, lk.from, lk.to, 'HEAD ' + cname]));
					if (status === 'Closed') { statuses.push(row([lk.id, 'Closed'])); }
				} else {
					// A PUMP WITH NO CURVE IS THE ONE ELEMENT THAT CANNOT ROUND-TRIP. It is this
					// page's own idea -- a lossless connection, the state every freshly drawn pump is
					// in -- and EPANET has no such element, so it goes out as a short, very wide, very
					// smooth pipe whose head loss is below solver tolerance, and it is reported.
					// Reading that file back gives a pipe, not a pump.
					pipes.push(row([lk.id, lk.from, lk.to, '0.01', sys === 'us' ? '40' : '1000',
						roughStandIn(settings.method), '0', status]));
					diff('pump-no-curve-as-pipe', [lk.id]);
				}
			} else {
				pipes.push(row([lk.id, lk.from, lk.to,
					n(cLen, lk, '_length', eff(lk, 'length') || 0),
					dia,
					n(PLAIN, lk, '_roughness', eff(lk, 'roughness') || 0),
					n(PLAIN, lk, '_k', eff(lk, 'k') || 0),
					status]));
			}
			for (j = 0; j < (lk.verts || []).length; j++) {
				verts.push(row([lk.id,
					n(PLAIN, lk.verts[j], 'x', (lk.verts[j].x || 0) + origin.x),
					n(PLAIN, lk.verts[j], 'y', (lk.verts[j].y || 0) + origin.y)]));
			}
		}

		// ---- text labels ----
		//
		// **EPANET'S [LABELS] POINT IS THE LABEL'S UPPER-LEFT CORNER** -- its own documentation says
		// so -- while this page anchors most text at its centre. The shift back is half the label's
		// width and half its height IN MAP UNITS, which only the renderer can measure, so the caller
		// supplies `opts.labelSize`. Without it a centred label would go out half its own width to the
		// left of where it sits, so the point is written unshifted and the difference REPORTED rather
		// than guessed at. A label that arrived from an `.inp` is already stored left/top (Task 332)
		// and needs no shift, which is why an imported file round-trips with no measurer at all.
		var unmeasured = [];
		for (i = 0; i < (doc.labels || []).length; i++) {
			lb = doc.labels[i];
			if (!isActive(lb)) { continue; }
			var anchor = lb.anchorNode ? nodeById[lb.anchorNode] : null,
				px = (lb.x || 0) + (anchor ? (anchor.x || 0) : 0) + origin.x,
				py = (lb.y || 0) + (anchor ? (anchor.y || 0) : 0) + origin.y,
				// An anchored label is rendered from the side its offset points to and is vertically
				// centred (labelHAlign/labelVAlign); a free one uses its own align/valign, which
				// default to centre and middle.
				hal = anchor ? (lb.x >= 0 ? 'left' : 'right') : (lb.align || 'center'),
				val = anchor ? 'middle' : (lb.valign || 'middle'),
				size = (typeof opts.labelSize === 'function') ? opts.labelSize(lb) : null;
			if (hal !== 'left' || val !== 'top') {
				if (size && isFinite(size.w) && isFinite(size.h)) {
					if (hal === 'center') { px -= size.w / 2; } else if (hal === 'right') { px -= size.w; }
					// Y IS CARTESIAN HERE, so the top edge is ABOVE the centre and this adds where a
					// screen-frame version would subtract.
					if (val === 'middle') { py += size.h / 2; } else if (val === 'bottom') { py += size.h; }
				} else {
					unmeasured.push(lb.id);
				}
			}
			var et = eff(lb, 'text'),
				text = String(et === undefined || et === null ? (lb._text || '') : et);
			if (/[\r\n]/.test(text)) {
				// **A MULTI-LINE LABEL CANNOT ROUND-TRIP**: [LABELS] is ONE quoted string per row and
				// EPANET has no line break inside it. FLATTENED TO ONE LINE rather than split into N
				// labels, because N labels need a line spacing in MAP units -- the same quantity a
				// screen-pixel-sized label does not have, which is what makes the corner shift above
				// need a measurer. One label with all the words in it loses the line breaks and
				// nothing else; N labels invent positions and come back as separate notes somebody has
				// to re-join.
				diff('label-multiline-flattened', [lb.id]);
				text = text.replace(/[\r\n]+/g, ' ');
			}
			if (text.indexOf('"') >= 0) {
				// EPANET's quoting has no escape, so a quote inside the text would end the string.
				diff('label-quote-replaced', [lb.id]);
				text = text.replace(/"/g, "'");
			}
			labelRows.push(row([n(PLAIN, lb, 'x', px), n(PLAIN, lb, 'y', py), '"' + text + '"']
				.concat(anchor ? [lb.anchorNode] : [])));
		}
		if (unmeasured.length) { diff('label-anchor-unmeasured', unmeasured); }

		// ---- backdrop ----
		//
		// **ONLY AN IMAGE BACKDROP HAS ANYTHING AN `.inp` CAN SAY**, and even then not the picture:
		// EPANET stores a PATH on somebody's disk and this page stores the image itself, so the
		// placement goes out and the file name cannot. A TILE BASEMAP is not a file at all -- there is
		// no path to write and inventing one would name a file that does not exist -- so it is
		// reported and nothing is written. That is the seam shared with the tile-basemap track: this
		// writer recognises an image by its `href` and writes [BACKDROP] for nothing else.
		var backdrop = doc.backdrop, backdropRows = [];
		if (backdrop && backdrop.href) {
			// DIMENSIONS is lower-left x, lower-left y, upper-right x, upper-right y in map
			// coordinates. `tx`/`ty` are the image's TOP-left corner in the stored Cartesian frame, so
			// the bottom edge is ty - height.
			var bx = (backdrop.tx || 0) + origin.x, by = (backdrop.ty || 0) + origin.y,
				bw = (backdrop.width || 0) * (backdrop.s || 1),
				bh = (backdrop.height || 0) * (backdrop.s || 1);
			backdropRows.push(row(['DIMENSIONS', String(bx), String(by - bh), String(bx + bw), String(by)]));
			diff('backdrop-image-not-named', []);
		} else if (backdrop) {
			diff('backdrop-not-a-file', [], backdrop.type || 'backdrop');
		}

		// ---- the clock (ROADMAP Task 423) ----------------------------------------------------
		//
		// **WITHOUT THESE THREE SECTIONS AN EXPORTED Net3 SOLVES DIFFERENTLY IN EPANET THAN THE FILE
		// IT CAME FROM**, and every number in it looks reasonable: its demands are the base ones, a
		// third low. The document has carried them since Task 423; this is the other end of that.
		//
		// Every value goes out as ITS OWN TEXT where it still says the same thing -- a multiplier
		// through lpnNumText against the `m<i>` tokens the reader kept, a time through lpnTimeText,
		// which is the same rule for a quantity whose text is not a number (`24:00`, `12 am`).
		var patternRows = [], controlRows = [], timeRows = [];
		(doc.patterns || []).forEach(function (pat) {
			var mults = (pat.multipliers || []), k, line;
			// SIX PER LINE, which is EPANET's own layout and the one Net3 is written in. The id
			// repeats on each line and the values concatenate; that is the format, not a nicety.
			for (k = 0; k < mults.length; k += 6) {
				line = [String(pat.id)];
				for (var q = k; q < Math.min(k + 6, mults.length); q++) {
					line.push(EngCalcs.lpnNumText(pat, 'm' + q, mults[q]));
				}
				patternRows.push(row(line));
			}
		});
		// **A CONTROL GOES OUT AS THE LINE IT CAME IN AS.** Nothing on this page edits one yet, so
		// its own text is exactly right and composing a sentence from the record could only differ
		// from it. THE DAY A CONTROL EDITOR EXISTS this must compose from the record instead, and
		// `raw` becomes a fallback -- an edited control would otherwise be written back unedited.
		(doc.controls || []).forEach(function (ctl) {
			if (ctl && ctl.raw) { controlRows.push(ctl.raw); }
		});
		if (doc.times) {
			[['Duration', 'duration'], ['Hydraulic Timestep', 'hydraulicStep'],
				['Pattern Timestep', 'patternStep'], ['Pattern Start', 'patternStart'],
				['Report Timestep', 'reportStep'], ['Report Start', 'reportStart'],
				['Start ClockTime', 'startClock']].forEach(function (pair) {
				timeRows.push(row([pair[0], EngCalcs.lpnTimeText(doc.times, pair[1], doc.times[pair[1]])]));
			});
		}

		// ---- assembly ----
		function section(name, rows) { return rows.length ? '[' + name + ']\n' + rows.join('\n') + '\n\n' : ''; }
		var method = settings.method || 'hw',
			headloss = { hw: 'H-W', dw: 'D-W', manning: 'C-M' }[method] || 'H-W';
		if (method !== 'hw') {
			// EPANET's D-W roughness is in millifeet (US) or millimetres (SI), and its C-M roughness
			// is Manning's n. This page's roughness field is neither reliably -- it holds what the
			// user typed in whatever the roughness selector shows. Written as stored, and said out
			// loud, because converting it would be inventing a number.
			diff('roughness-method', [], headloss);
		}
		var title = opts.title !== undefined ? opts.title : ((doc.project && doc.project.name) || '');
		var inp = '[TITLE]\n' + String(title).replace(/[\r\n]+/g, ' ') + '\n\n' +
			// [JUNCTIONS] is written even when empty: it is one of the three sections lpnInpParse()
			// tests for to decide the text is an `.inp` at all.
			'[JUNCTIONS]\n' + (junctions.length ? junctions.join('\n') + '\n' : '') + '\n' +
			section('RESERVOIRS', reservoirs) +
			section('TANKS', tanks) +
			section('PIPES', pipes) +
			section('PUMPS', pumps) +
			section('VALVES', valves) +
			section('EMITTERS', emitters) +
			section('CURVES', curves) +
			// After the links, because a [STATUS] row names a link that must already be declared.
			section('STATUS', statuses) +
			section('PATTERNS', patternRows) +
			// After the links a control names, and after the patterns, which is EPANET's own order.
			section('CONTROLS', controlRows) +
			section('TIMES', timeRows) +
			'[OPTIONS]\n' +
			row(['Units', flowKey]) + '\n' +
			row(['Headloss', headloss]) + '\n' +
			// The DEFAULT demand pattern, for every junction whose own column is blank. Omitted
			// entirely when the document has none: EPANET's own default is "no pattern", and writing
			// a line that says so is a statement the source file never made.
			(doc.defaultPattern ? row(['Pattern', String(doc.defaultPattern)]) + '\n' : '') +
			row(['Emitter Exponent', String(settings.emitterExponent || 0.5)]) + '\n\n' +
			section('COORDINATES', coords) +
			section('VERTICES', verts) +
			section('LABELS', labelRows) +
			section('BACKDROP', backdropRows) +
			'[END]\n';
		return { ok: true, inp: inp, differences: differences };
	};

}(typeof globalThis !== 'undefined' ? globalThis : this));
