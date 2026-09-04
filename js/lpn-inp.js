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
		SOURCES: 'sources', MIXING: 'mixing', TAGS: 'tags', REPORT: 'report'
	};

	// **EVERY SECTION THIS READER TAKES APART.** Anything else in the file -- [ENERGY], [QUALITY],
	// [SOURCES], [REACTIONS], [MIXING], [TAGS], [REPORT], [RULES], and any section some other
	// program invented -- is CARRIED VERBATIM (Tom, 2026-08-29: *"every setting from EPANET must be
	// added and implemented unless research says otherwise"*). Carrying is the [RULES] answer of
	// Task 248.03 generalised: the file's own characters, kept line for line, written back
	// unchanged, and never handed to a solver. It is the only form that can be right for a section
	// nothing here understands, and it is what the input-file-is-canonical rule requires -- a value
	// this page cannot use is still the user's, and reading past it spent it.
	//
	// **THE LIST IS OF WHAT IS READ, NOT OF WHAT IS CARRIED**, deliberately: a section nobody here
	// has heard of then carries by default rather than vanishing, which is the safe direction for
	// the one case we cannot enumerate.
	var INP_SECTIONS_READ = {
		TITLE: 1, JUNCTIONS: 1, RESERVOIRS: 1, TANKS: 1, PIPES: 1, PUMPS: 1, VALVES: 1,
		DEMANDS: 1, STATUS: 1, PATTERNS: 1, CURVES: 1, CONTROLS: 1, EMITTERS: 1,
		TIMES: 1, OPTIONS: 1, COORDINATES: 1, VERTICES: 1, LABELS: 1, BACKDROP: 1, END: 1
	};

	// The carried sections EPANET's own writer has a place for, and therefore the ones the exporter
	// puts back where they belong. A section NOT here is still carried; it simply has no home in
	// EPANET's order, so it is written after the options, in the order the source stated it.
	var LPN_CARRIED_PLACED = {
		TAGS: 1, ENERGY: 1, QUALITY: 1, SOURCES: 1, REACTIONS: 1, MIXING: 1, REPORT: 1
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
	 * A junction's demands, in order, as one list (ROADMAP Task 468).
	 *
	 * **ROW 0 IS THE JUNCTION'S OWN `_demand` / `demandPattern` / `demandCategory`,** and the rest
	 * are `extraDemands`. One function says so, and the reader, the writer, the solve, the resolved
	 * Demand and the property popup all ask it -- so a junction with one demand (every junction in
	 * Net1, Net2 and Net3, and every junction anybody draws) is exactly the object it always was,
	 * and nothing downstream has a second opinion about where row 0 lives.
	 *
	 * `base` is row 0's base demand, passed in rather than read, because inside a scenario it is
	 * `effective(n, 'demand')` and this file knows nothing of scenarios. Omit it and the Base
	 * document's own number is used.
	 *
	 * `rec`/`key` on each row name WHERE THAT NUMBER'S OWN TEXT IS KEPT, which is what lets the
	 * writer hand every one of them back character-for-character (EngCalcs.lpnNumText).
	 */
	EngCalcs.lpnDemandRows = function (nd, base) {
		var out = [{
			base: base === undefined ? nd._demand : base,
			pattern: nd.demandPattern || null,
			category: nd.demandCategory || null,
			rec: nd, key: '_demand'
		}], extra = nd.extraDemands || [], i;
		for (i = 0; i < extra.length; i++) {
			out.push({
				base: extra[i].base, pattern: extra[i].pattern || null,
				category: extra[i].category || null, rec: extra[i], key: 'base'
			});
		}
		return out;
	};

	/**
	 * Does this junction's demand have to be written in [DEMANDS] rather than in the [JUNCTIONS]
	 * demand column? Three reasons, and each is a thing the [JUNCTIONS] column cannot say:
	 * more than one row, a CATEGORY name on row 0 (the column has nowhere to put one), or the file
	 * it came from having said it there already -- a statement written back where it was made.
	 */
	EngCalcs.lpnDemandItemized = function (nd) {
		return !!(nd && (nd.demandItemized || nd.demandCategory ||
			(nd.extraDemands && nd.extraDemands.length)));
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
			i, line, semi, toks, cmt;

		var carried = {};   // section name -> the file's own lines, for every section not read below
		for (i = 0; i < lines.length; i++) {
			line = lines[i];
			semi = line.indexOf(';');
			cmt = '';
			// **ONE SECTION'S DATA IS WRITTEN AS A COMMENT, AND IT IS [DEMANDS].** A demand
			// CATEGORY -- the name of who is drawing this water -- is a trailing `;Elm Acres`, not
			// a fourth column: EPANET's own writer emits it that way and its reader reads it back
			// out of the comment. Stripping comments and stopping there is what threw the
			// categories away before Task 468. Kept on the token array rather than as a fifth
			// token, so no section that does NOT mean anything by its comments can mistake one for
			// data.
			if (semi >= 0) { cmt = line.slice(semi + 1).trim(); line = line.slice(0, semi); }
			if (!line.trim()) { continue; }
			if (line.charAt(0) === '[' || /^\s*\[/.test(line)) {
				section = line.trim().replace(/^\[|\]\s*$/g, '').toUpperCase();
				if (!rawSections[section]) { rawSections[section] = []; }
				continue;
			}
			// **EVERY SECTION THIS READER DOES NOT TAKE APART IS KEPT AS TEXT, LINE FOR LINE.**
			// [RULES] was the first (Task 248.03): a rule is a small LANGUAGE -- priorities, AND/OR
			// clauses, an ELSE -- and this page does not model it. What it could do, and until that
			// task did not, is stop THROWING IT AWAY: the section was counted as a difference and
			// then dropped, so a file with rules came back out of the exporter with none, which is
			// the input-file-is-canonical rule broken exactly as `[OPTIONS]` was under Task 553.
			// [ENERGY], [QUALITY], [SOURCES], [REACTIONS], [MIXING], [TAGS] and [REPORT] were the
			// same defect a third time, and they are kept here on the same terms.
			//
			// The ORIGINAL line, not the tokens: nothing here understands these sections well enough
			// to write one, so the only honest form is the characters the file stated. A
			// comment-only line inside such a section is lost with the blank lines above -- it is
			// not data, and keeping it would mean carrying the section's whitespace too.
			// **AND IT IS STILL COUNTED.** `seen` is what makes REPORTABLE say "this file has rules" at
			// the end, and the early `continue` below skips the counter every other section reaches --
			// so keeping the text silently stopped the import REPORTING the text. Caught by
			// import-notes-harness.js. Carrying a thing and telling the user about it are two jobs.
			if (section && !INP_SECTIONS_READ[section]) {
				if (!carried[section]) { carried[section] = []; }
				carried[section].push(lines[i].replace(/\s+$/, ''));
				seen[section] = (seen[section] || 0) + 1;
				continue;
			}
			toks = tokenize(line);
			if (!toks.length) { continue; }
			if (cmt) { toks.cmt = cmt; }
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
		//
		// **`hydraulics` IS SPARSE ON PURPOSE** (Task 553). A key is present only where the FILE
		// stated it, so absent means "EPANET's own default" and never "we set it to the default".
		// The exporter writes back exactly the keys that are present, which is the same rule the
		// `Pattern` line has always followed: writing a line that says the default is a statement
		// the source file never made, and it would fail the byte-identity test the round trip is
		// held to.
		var flowKey = 'GPM', headloss = 'H-W', emitterExponent = 0.5, demandMultiplier = 1,
			defaultPattern = null, hydraulics = {}, qualityOptions = {}, fileOptions = {}, rows, r;
		rows = rawSections.OPTIONS || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			var key = (r[0] || '').toUpperCase();
			if (key === 'UNITS' && r[1]) { flowKey = r[1].toUpperCase(); }
			else if (key === 'HEADLOSS' && r[1]) { headloss = r[1].toUpperCase(); }
			else if (key === 'EMITTER' && r[2]) { emitterExponent = num(r[2], 0.5); hydraulics.emitterExponent = emitterExponent; }
			// **`Demand` NAMES TWO DIFFERENT OPTIONS AND ONLY ONE OF THEM IS A NUMBER.**
			// `Demand Multiplier 1.5` scales every demand; `Demand Model PDA` chooses EPANET 2.2's
			// pressure-driven analysis. Matching on the first token alone read `Demand Model PDA`
			// as a multiplier, got `NaN`, fell back to 1, and then WROTE `Demand Multiplier 1` in
			// place of the line the file stated -- a carried value replaced by an invented one,
			// which is worse than the dropping this task exists to stop. The keyword is tested, so
			// `Demand Model` now falls through to the carry at the end of this chain.
			else if (key === 'DEMAND' && /^MULT/.test((r[1] || '').toUpperCase()) && r[2]) { demandMultiplier = num(r[2], 1); hydraulics.demandMultiplier = demandMultiplier; }
			// **THE REST OF EPANET'S HYDRAULIC OPTIONS** (Task 553, Tom's own list). Every one was
			// read past in silence until now -- not even reported as a difference -- so a file
			// stating `Viscosity 1.3` came back out of the exporter stating nothing, which is the
			// input-file-is-canonical rule broken in the quietest possible way.
			//
			// The token positions are the file's own two-word keywords: `Specific Gravity 1.0` puts
			// the number at r[2] exactly as `Demand Multiplier` and `Emitter Exponent` do, while
			// one-word keywords put it at r[1].
			else if (key === 'VISCOSITY' && r[1]) { hydraulics.viscosity = num(r[1], 1); }
			else if (key === 'SPECIFIC' && r[2]) { hydraulics.specificGravity = num(r[2], 1); }
			else if (key === 'TRIALS' && r[1]) { hydraulics.trials = num(r[1], 40); }
			else if (key === 'ACCURACY' && r[1]) { hydraulics.accuracy = num(r[1], 0.001); }
			else if (key === 'HEADERROR' && r[1]) { hydraulics.headError = num(r[1], 0); }
			else if (key === 'FLOWCHANGE' && r[1]) { hydraulics.flowChange = num(r[1], 0); }
			else if (key === 'DAMPLIMIT' && r[1]) { hydraulics.dampLimit = num(r[1], 0); }
			else if (key === 'CHECKFREQ' && r[1]) { hydraulics.checkFreq = num(r[1], 2); }
			else if (key === 'MAXCHECK' && r[1]) { hydraulics.maxCheck = num(r[1], 10); }
			// **`Unbalanced Continue 10` IS ONE OPTION IN TWO TOKENS**, and the count is optional:
			// `Unbalanced Stop`, `Unbalanced Continue` and `Unbalanced Continue 10` are all legal.
			// Stored as the two fields the exporter needs to write the line back as it came.
			else if (key === 'UNBALANCED' && r[1]) {
				hydraulics.unbalanced = r[1].toUpperCase() === 'CONTINUE' ? 'continue' : 'stop';
				if (r[2] !== undefined && r[2] !== '') { hydraulics.unbalancedTrials = num(r[2], 0); }
			}
			// A REPORTING option, not a hydraulic one: it decides what EPANET's own `.rpt` holds,
			// and this page has no `.rpt`. Carried verbatim so an export does not delete it, and
			// deliberately given NO control -- CLAUDE.md's emitter-exponent precedent, that the
			// most technical-looking control in a box must not be one that adjusts nothing.
			else if (key === 'STATUS' && r[1]) { hydraulics.statusReport = r[1].toUpperCase(); }
			// **[OPTIONS] Pattern IS THE DEFAULT DEMAND PATTERN, AND IT IS THE EASIEST THING IN
			// THIS FILE TO MISS.** A junction whose [JUNCTIONS] pattern column is BLANK does not
			// have "no pattern" -- it has this one. Net3 says `Pattern 1`, and pattern 1 starts at
			// 1.34, so a reader that treats a blank column as 1.00 is 34% low on nearly every
			// demand in the network at t=0 while every number it can see looks reasonable. That is
			// the second of the two bugs recorded in dev/lpn-spike/net3-vs-epanet-report.js's
			// header, and it cost 13% of flow.
			else if (key === 'PATTERN' && r[1]) { defaultPattern = r[1]; }
			// **THE THREE WATER-QUALITY OPTIONS, CARRIED AS THE FILE'S OWN CHARACTERS.** Net1 states
			// `Quality Chlorine mg/L`, `Diffusivity 1.0` and `Tolerance 0.01`, and every one of them
			// was read past in silence until now -- so a file stating them came back out of the
			// exporter stating none, which is the input-file-is-canonical rule broken in exactly the
			// way the rest of `[OPTIONS]` was under Task 553.
			//
			// **VERBATIM, NOT PARSED, AND THAT IS THE CHEAP CORRECT ANSWER.** CLAUDE.md's rule is
			// that a unit is a LABEL and a MAGNITUDE with different requirements: a magnitude is
			// only needed by a SOLVE, and no solve on this page reads any of these three. So they
			// are carried as text and never as numbers, which also happens to be the only form that
			// round-trips -- `Quality Trace Lake` (Net3) is not a number at all, and `String(1.0)`
			// is `'1'`, so a parsed `Diffusivity` could not come back as the file wrote it.
			// One value, one string: `Quality` takes the rest of the line because its value is two
			// tokens (a chemical and its unit, or TRACE and a node id) and the pair is one fact.
			else if (key === 'QUALITY' && r[1]) { qualityOptions.quality = r.slice(1).join(' '); }
			else if (key === 'DIFFUSIVITY' && r[1]) { qualityOptions.diffusivity = r[1]; }
			else if (key === 'TOLERANCE' && r[1]) { qualityOptions.tolerance = r[1]; }
			// **THE TWO `[OPTIONS]` KEYS THAT NAME A FILE**, carried for exactly the reason the
			// three above are: an import that reads past a line the source stated and then writes
			// the file back without it has DELETED the user's data, which is the one thing this
			// reader may never do. Neither is a number a person could type on this page -- `Map`
			// names a `.map` of coordinates beside the `.inp`, and `Hydraulics USE/SAVE` names a
			// `.hyd` of already-solved hydraulics -- and neither changes an answer here, so they
			// are a CARRY and not a control. Verbatim and never parsed, on the same argument the
			// quality three carry: nothing solves with them, so their text is the only form that
			// can round-trip. The value takes the rest of the line because both are two tokens
			// (`USE net.hyd`) or one path with no fixed shape.
			else if (key === 'MAP' && r[1]) { fileOptions.map = r.slice(1).join(' '); }
			else if (key === 'HYDRAULICS' && r[1]) { fileOptions.hydraulics = r.slice(1).join(' '); }
			// **AND EVERY OTHER `[OPTIONS]` LINE, WHATEVER IT SAYS.** This is the section-carry of
			// Task 553 done one level down, and it is what finally makes this class of defect
			// impossible rather than fixed for the fourth time: the branches above are the list of
			// what this page READS, and anything else is carried by DEFAULT instead of vanishing --
			// exactly the rule INP_SECTIONS_READ states for a section nobody here has heard of.
			//
			// What it catches today, all of them EPANET 2.2 options this reader never had a branch
			// for: `Demand Model DDA|PDA` and its three companions `Minimum Pressure`,
			// `Required Pressure` and `Pressure Exponent`; `Pressure psi|kPa|m`, which names the
			// pressure unit; and the obsolete `Segments` and `Verify` EPANET itself now ignores.
			// What it catches tomorrow is whatever EPANET adds next, with no edit here.
			//
			// TOKENS, NEVER NUMBERS, on the same argument the quality and file options carry:
			// nothing on this page solves with any of these, so the file's own characters are the
			// only form that can round-trip (`Minimum Pressure 0.0` parsed and re-written is `0`).
			//
			// **CARRIED, AND NOT YET REPORTED, WHICH IS A REAL GAP AND NOT A DECISION.** A file
			// asking for pressure-driven analysis is solved here demand-driven, and the user should
			// be told. The sentence belongs with the others in `js/looped-network.js`'s
			// `inpDropText()`, and writing one there is the follow-up this note owes.
			else if (r.length) { fileOptions.other = (fileOptions.other || []).concat([r.slice()]); }
		}
		// **CARRYING A THING AND TELLING THE USER ABOUT IT ARE TWO JOBS** (Task 248.03's lesson,
		// recorded there after `[RULES]` stopped being reported the moment it started being kept).
		// These three are kept and written back, and they are still a difference: nothing on this
		// page acts on them, so a network whose chlorine decays is not being modelled here. The
		// sentence says both halves, and it is a different sentence from the one about the
		// water-quality SECTIONS -- [QUALITY], [REACTIONS], [SOURCES], [MIXING] -- which really are
		// dropped.
		if (Object.keys(qualityOptions).length) {
			drop('quality-options', [], Object.keys(qualityOptions).length);
		}
		// **CARRIED AND STILL REPORTED**, the same two jobs. Both name a file this page cannot
		// open, and a user who saves an `.inp` from here and moves it will find those lines
		// pointing at nothing -- which is a fact about their file worth one sentence.
		// **THE COUNT IS OF THE TWO THAT NAME A FILE, AND `other` IS DELIBERATELY NOT IN IT.** The
		// sentence this code reaches says "this file points at another file beside it", which is
		// true of `Map` and `Hydraulics` and false of everything the catch-all above holds. Saying
		// it about a `Demand Model` line would be a worse report than none.
		var namedFiles = (fileOptions.map ? 1 : 0) + (fileOptions.hydraulics ? 1 : 0);
		if (namedFiles) {
			drop('file-options', [], namedFiles);
		}
		// **AND THE CARRIED OPTIONS GET THEIR SENTENCE AT LAST, WHICH THE CARRY OWED.** Carrying a
		// line and telling the user about it are two jobs, and this one has a case where the second
		// job matters more than anywhere else in this section: `Demand Model PDA` asks for EPANET
		// 2.2's PRESSURE-DRIVEN analysis, and this page solves demand-driven. That is a difference
		// in the ANSWERS, not in what the file holds, so it gets a sentence of its own rather than
		// joining the kept-but-unused list. `DDA` is EPANET's own default and is what this page
		// does, so a file stating it has nothing to be told.
		var otherOpts = fileOptions.other || [], demandModel = null, otherCount = 0;
		otherOpts.forEach(function (r) {
			if (/^DEMAND$/i.test(r[0] || '') && /^MODEL$/i.test(r[1] || '')) {
				demandModel = (r[2] || '').toUpperCase();
				return;
			}
			otherCount++;
		});
		if (demandModel && demandModel !== 'DDA') { drop('demand-model', [], demandModel); }
		if (otherCount) { drop('other-options', [], otherCount); }

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
				// **NOT MULTIPLIED BY `Demand Multiplier`** (Task 553). It used to be, and that made
				// the stored number one nobody typed: a file stating 189.95 with a multiplier of
				// 2.5 came in as 474.875, and came back out of the exporter as 474.875 -- the
				// user's own characters spent, which is the one thing CLAUDE.md's file rule forbids
				// outright. The multiplier is now carried in `hydraulics` and applied where every
				// other scaling is, at resolvedDemand().
				demand: num(r[2]),
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
		// **THE CATEGORIES ARE KEPT, ONE ROW EACH** (Task 468). They used to be SUMMED into this
		// page's single demand and the loss reported as `demand-categories`; a junction now holds
		// an ordered LIST of (base, pattern, category) rows, so there is nothing to report and
		// nothing thrown away. `50 gpm residential + 20 gpm irrigation` is how a demand is actually
		// assembled, and two categories on two patterns are two daily shapes no single row can say.
		//
		// ROW 0 LANDS ON THE JUNCTION'S OWN `demand` / `demandPattern` FIELDS and the rest ride in
		// `extraDemands`. That asymmetry is deliberate and is EPANET's own: its property sheet
		// shows category 1 as the junction's Base Demand and the rest behind a categories editor.
		// It is what makes a one-category junction -- every junction in Net1, Net2 and Net3 -- come
		// out of here byte-for-byte the shape it always did.
		var demandNodes = [], started = {};
		rows = rawSections.DEMANDS || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			var dn = nodeIndex[r[0]];
			if (!dn || dn.type !== 'junction') { continue; }
			if (!started[r[0]]) {
				started[r[0]] = true;
				demandNodes.push(dn);
				// **[DEMANDS] REPLACES THE [JUNCTIONS] DEMAND rather than adding to it** -- measured,
				// not assumed: a junction with 100 there and rows of 50 and 25 here is reported by
				// the real engine as 75 (checked against js/vendor/epanet-js.js). Adding instead of
				// replacing inflates every multi-category junction in silence. EPANET's own writer
				// makes the same statement from the other end -- it writes [JUNCTIONS] with an
				// elevation and NO demand column whenever [DEMANDS] carries one -- which is the
				// shape the exporter writes back and why no copy of the discarded column is kept.
				dn.demandItemized = true;
				dn.demands = [];
			}
			// A row is its own record with its own token bag, so mergeTok()'s three conditions
			// apply to a category's base exactly as they apply to a junction's elevation.
			var drow = {
				// Unmultiplied, for the reason given at the [JUNCTIONS] column above.
				base: num(r[1]),
				// null means the column was blank, which is NOT "no pattern" -- [OPTIONS] Pattern
				// applies, exactly as it does for the [JUNCTIONS] column. Same resolution, made by
				// the same caller.
				pattern: r[2] || null,
				// **WHO, NOT WHAT KIND** (Tom, 2026-08-21). The pattern is the type of user
				// ("residential"); the category is the user ("Elm Acres", "Taco Bell 354"). Nothing
				// validates it and nothing indexes it, because it is a name and not a key -- EPANET
				// validates nothing here either and runs happily with varying text on one pattern.
				category: r.cmt || null
			};
			mergeTok(drow, 'base', r[1], drow.base);
			dn.demands.push(drow);
			if (r[2]) { drop('demand-pattern', [r[0]], r[2], 'node'); }
		}
		for (i = 0; i < demandNodes.length; i++) {
			var dnode = demandNodes[i], first = dnode.demands[0] || { base: 0, pattern: null, category: null };
			dnode.demand = first.base;
			// mergeTok SETS OR REMOVES: handing it the row's kept token restores the file's own
			// text, and handing it nothing (because String(value) already said it) clears the
			// [JUNCTIONS] column's stale token off this field. Neither case needs a caller to know
			// which one it is in.
			mergeTok(dnode, 'demand', first.tok ? first.tok.base : null, dnode.demand);
			dnode.demandPattern = first.pattern;
			dnode.demandCategory = first.category;
			dnode.extraDemands = dnode.demands.slice(1);
			delete dnode.demands;
		}

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
					// A RELATIVE SPEED, dimensionless: 1 is the curve as drawn, 0.9 is the same
					// pump turning slower. It scales the curve as h = s^2 h0 - a (Q/s)^b, which is
					// EPANET's own law and the one js/looped-network.js applies at the solve.
					// The token is kept beside it like every other number the file states, so a
					// `1.20` comes back out as `1.20`.
					pump.speed = num(r[j + 1], 1);
					mergeTok(pump, 'speed', r[j + 1], pump.speed);
					if (pump.speed !== 1) { drop('pump-speed', [r[0]], r[j + 1], 'link'); }
					j++;
				} else if (kw === 'PATTERN') {
					// A pump SCHEDULE: the multiplier series is a speed, not a demand, which is
					// why js/lpn-patterns.js knows nothing about what a pattern is for.
					pump.speedPattern = r[j + 1] || null;
					if (r[j + 1]) { drop('pump-pattern', [r[0]], r[j + 1], 'link'); }
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
		// **A SECTION NO VERSION OF EPANET DOCUMENTS, AND THEREFORE NO SENTENCE CAN DESCRIBE.** It is
		// carried like the rest and reported BY NAME, because the only true thing we can say about it
		// is what the file called it. A file stating none produces no line, which is why this is
		// inside the test rather than a sentence that always shows.
		var otherSections = Object.keys(carried).filter(function (name) {
			return name !== 'RULES' && !REPORTABLE[name];
		});
		if (otherSections.length) { drop('other-sections', otherSections, null); }
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
			// Every [OPTIONS] key this file stated that is not the flow unit, the head-loss formula
			// or the default pattern -- sparse, so absent is "the file did not say" (Task 553).
			hydraulics: hydraulics,
			// The three water-quality `[OPTIONS]`, as the file's own text. Sparse on the same rule
			// as `hydraulics`: absent means the file did not say it, so the exporter writes nothing.
			qualityOptions: qualityOptions,
			// The `[OPTIONS]` this page carries instead of reading: `map` and `hydraulics` name a
			// file beside the `.inp`, and `other` holds every remaining line as its own tokens.
			// Sparse on the same rule -- a key is here only where the file stated it.
			fileOptions: fileOptions,
			// [RULES], verbatim, one string per line (Task 248.03). Empty for a file with none, so
			// no caller has to test for absence.
			rules: carried.RULES || [],
			// **EVERY OTHER SECTION THIS READER DOES NOT TAKE APART, VERBATIM** -- name -> the
			// file's own lines. [RULES] is NOT in here: it has had its own field since Task 248.03
			// and `EngCalcs.lpnRuleBlocks()` reads it, so one section in two places would be two
			// answers to the same question. Empty object for a file with none.
			inpSections: (function () {
				var out = {}, k;
				for (k in carried) {
					if (k !== 'RULES' && carried[k].length) { out[k] = carried[k]; }
				}
				return out;
			}()),
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
	// **A NOTE ON AN ELEMENT IS A LOSS; A LINE IN THE REPORT CAN BE GOOD NEWS.** The two readers are
	// different people asking different questions. The report answers "what happened to my file",
	// and "these valves came in whole and are solved by the EPANET engine" is exactly the kind of
	// thing it should say. The popup answers "what is missing from THIS element", and the same
	// sentence there is a note about nothing.
	//
	// Tom, 2026-08-29, of a `demand-pattern` note on Net3's junction 15 — *"These junctions change
	// their demand through the day. Their patterns came in whole, and the demand you see is the one
	// for the moment the clock is showing."*: *"The detail does not seem like something we can't
	// handle. So I don't understand why I get the note."* He is right, and it is a leftover: every
	// code below described a real loss when it was written, and each stopped doing so as the feature
	// that closed the gap shipped -- patterns and the clock with Task 423 and 248.02, the two live
	// valve fates with 248's phase 2. The SENTENCES were rewritten each time; nobody asked whether
	// the element still deserved a note at all.
	//
	// So the list is here rather than in a filter at the call site: this is a fact about the code,
	// and the next feature that closes a gap adds its code here in the same commit that rewrites its
	// sentence. `dev/lpn-spike/import-notes-harness.js` asserts both halves -- in the report, absent
	// from the element.
	var LPN_INP_NOT_A_LOSS = {
		'demand-pattern': 1,   // Task 423: applied at the solved moment, and the clock runs (248.02).
		'head-pattern': 1,     // Task 248.02: a reservoir rises and falls.
		'pump-speed': 1,       // Task 248.02: the speed and its pattern are kept and solved.
		'pump-pattern': 1,
		'valve-tcv': 1,        // Task 248 phase 2: a throttle valve is a throttle valve; either solver.
		'valve-active': 1      // ...and PRV/PSV/FCV come in whole and route to the EPANET engine.
	};
	// **THE FILTER RUNS AT DISPLAY TIME AS WELL, and that is the half that matters to anybody who
	// already has a project.** A note is written into the document at import, so filtering only here
	// fixes the next import and leaves every network already on disk wearing the note it was given.
	// Tom, 2026-08-29, having reloaded: *"Node 15 has not changed. It still has the note."* The
	// record is kept -- it is the document's, and a later feature may make it a loss again or make
	// it good news -- and the popup simply does not compose a sentence for it.
	EngCalcs.lpnInpNoteIsLoss = function (code) { return !LPN_INP_NOT_A_LOSS[code]; };
	EngCalcs.lpnInpNotes = function (dropped, group) {
		var byId = {};
		(dropped || []).forEach(function (d) {
			if (!d || !d.ids || !d.ids.length) { return; }
			// **KEYED BY KIND AS WELL AS BY ID.** A caller asking for nodes must not be handed a
			// pipe's note because the two share a number -- see the comment on drop(). A difference
			// that named no kind belongs to no element and is skipped here; it is still in the
			// report, which is where a network-wide statement belongs.
			if (!d.group || (group && d.group !== group)) { return; }
			if (LPN_INP_NOT_A_LOSS[d.code]) { return; }
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

	/**
	 * **WHICH ELEMENTS A [RULES] BLOCK NAMES, WITHOUT UNDERSTANDING A RULE** (ROADMAP Task 248.03).
	 *
	 * This page does not model rule-based controls and this function does not pretend to. It reads
	 * ONE fact out of the text -- the ids -- because that is the only fact needed to decide whether
	 * a rule can safely be handed to the EPANET engine. **A `[RULES]` line naming a link the file
	 * does not declare makes EPANET reject the WHOLE input**, so passing rules through blind would
	 * turn "this network has rules we do not model" into "this network does not solve at all".
	 *
	 * The grammar it leans on is one line of EPANET's: after an object keyword the next token is the
	 * id, and SYSTEM is the one object that has none. That is true in the IF, the AND/OR and the
	 * THEN/ELSE alike, so no clause has to be told apart from another. Everything else in the rule --
	 * the attribute, the relation, the value, the priority -- is passed over without being read,
	 * which is exactly what "we do not model this" should look like in code.
	 *
	 * Returns one record per rule: its name, its lines in order, and the ids it names split by kind.
	 * A line before the first `RULE` keyword is impossible in a valid file and is attached to an
	 * unnamed leading record rather than dropped, so nothing silently disappears.
	 */
	var RULE_NODE_WORDS = { NODE: 1, JUNCTION: 1, RESERVOIR: 1, TANK: 1 };
	var RULE_LINK_WORDS = { LINK: 1, PIPE: 1, PUMP: 1, VALVE: 1 };
	EngCalcs.lpnRuleBlocks = function (lines) {
		var out = [], cur = null, i, j, toks, w;
		for (i = 0; i < (lines || []).length; i++) {
			toks = String(lines[i]).replace(/;.*$/, '').trim().split(/\s+/).filter(Boolean);
			if (!toks.length) { continue; }
			if (toks[0].toUpperCase() === 'RULE') {
				cur = { name: toks[1] || '', lines: [], nodes: [], links: [] };
				out.push(cur);
			} else if (!cur) {
				cur = { name: '', lines: [], nodes: [], links: [] };
				out.push(cur);
			}
			cur.lines.push(String(lines[i]));
			for (j = 0; j < toks.length - 1; j++) {
				w = toks[j].toUpperCase();
				if (RULE_NODE_WORDS[w]) { cur.nodes.push(toks[j + 1]); j++; }
				else if (RULE_LINK_WORDS[w]) { cur.links.push(toks[j + 1]); j++; }
			}
		}
		return out;
	};

	// The stand-in pipe a curveless pump becomes needs a roughness in the file's own formula, and
	// "very smooth" is a different number in each. The same three js/lpn-epanet.js uses.
	function roughStandIn(method) {
		if (method === 'dw') { return '0.0000015'; }
		if (method === 'manning') { return '0.008'; }
		return '150';
	}

	// ONE [OPTIONS] LINE PER KEY THE DOCUMENT ACTUALLY HOLDS, in EPANET's own spelling and in the
	// order its own writer uses. Sparse in, sparse out: this is the export half of the rule stated
	// at the importer, that a key absent from `hydraulics` means the source file never said it.
	//
	// **`Unbalanced` IS THE ONE THAT IS NOT A NUMBER**, and its trailing trial count is optional --
	// `Stop`, `Continue` and `Continue 10` are all legal and all round-trip as they came.
	var LPN_OPT_LINES = [
		['accuracy', 'Accuracy'], ['trials', 'Trials'], ['headError', 'HeadError'],
		['flowChange', 'FlowChange'], ['dampLimit', 'DampLimit'],
		['checkFreq', 'CheckFreq'], ['maxCheck', 'MaxCheck'],
		['viscosity', 'Viscosity'], ['specificGravity', 'Specific Gravity'],
		['demandMultiplier', 'Demand Multiplier'], ['statusReport', 'Status']
	];
	// The water-quality half of the same list, in EPANET's own spelling and order, and STRINGS all
	// the way through: these are carried, never computed with, so nothing ever turns one into a
	// number and back (`Diffusivity 1.0` would come back as `1`, and `Quality Trace Lake` is not a
	// number at all).
	var LPN_QUAL_LINES = [
		['quality', 'Quality'], ['diffusivity', 'Diffusivity'], ['tolerance', 'Tolerance']
	];
	// **`Quality` IS THE ONE OF THE THREE THAT IS NOW A LIVE INPUT** (water age and source share).
	// The other two, Diffusivity and Tolerance, only mean anything to a reacting chemical, which
	// this page still does not work out, so they stay carried text and nothing below touches them.
	//
	// **HOW THE FILE'S OWN TOKEN SURVIVES BEING INTERPRETED.** The importer keeps `Quality`'s
	// characters verbatim on `settings.qualityOptions.quality` and NEVER writes to that field
	// again; the interpreted setting lives beside it on `settings.quality`, carrying the token it
	// was derived from as `src`. The exporter writes the token back byte for byte while the
	// interpreted setting still parses out of it, and composes its own line only once the user has
	// actually chosen something else. That is the `_xsrc`/`_ysrc` rule from CLAUDE.md's coordinate
	// note applied to a word instead of a number: believe the source text while the derived value
	// is still the one derived from it.
	//
	// A CHEMICAL IS NEVER COMPOSED. `Quality Chlorine mg/L` parses to mode 'chemical', which means
	// "carried, not worked out" -- so it can only ever go back out as its own token, and the moment
	// a user picks age or source share instead, the file stops claiming a chemical it no longer has.
	EngCalcs.lpnQualityParse = function (text) {
		var t = String(text === undefined || text === null ? '' : text).trim(), w;
		if (!t) { return { mode: 'none', traceNode: '' }; }
		w = t.split(/\s+/);
		if (/^none$/i.test(w[0])) { return { mode: 'none', traceNode: '' }; }
		if (/^age$/i.test(w[0])) { return { mode: 'age', traceNode: '' }; }
		if (/^trace$/i.test(w[0])) { return { mode: 'trace', traceNode: w[1] || '' }; }
		// Everything else names a chemical -- `Chlorine mg/L`, or EPANET's own longer
		// `CHEMICAL Chlorine mg/L`. Kept whole, because the name and its units are the user's.
		return { mode: 'chemical', traceNode: '' };
	};
	/**
	 * The `[OPTIONS] Quality` value this document now states, or '' where it states none.
	 * `src` wins whenever it still parses to the same thing, so an untouched file round-trips.
	 */
	EngCalcs.lpnQualityText = function (q) {
		var mode = (q && q.mode) || 'none', src = q && q.src, was;
		if (src !== undefined && src !== null && src !== '') {
			was = EngCalcs.lpnQualityParse(src);
			if (was.mode === mode && (mode !== 'trace' || was.traceNode === ((q && q.traceNode) || ''))) {
				return String(src);
			}
		}
		if (mode === 'age') { return 'Age'; }
		if (mode === 'trace') { return 'Trace ' + ((q && q.traceNode) || ''); }
		// 'chemical' with no source token is not a state anything can produce -- the mode exists
		// only to name a token we did not interpret -- so it falls through with 'none' to the one
		// honest answer: say nothing, and let EPANET's own default stand.
		return '';
	};
	function qualityOptionRows(qual, row, live) {
		var q = qual || {}, out = '', text;
		LPN_QUAL_LINES.forEach(function (pair) {
			if (pair[0] === 'quality') {
				// **THE LIVE SETTING DECIDES ONLY ONCE IT HAS MET THE TOKEN.** A setting carrying no
				// `src` has never been derived from this document's own text -- a project saved
				// before the option was interpreted at all -- and reading its default 'none' as a
				// decision would delete a line the source stated. `src` present, or a mode the user
				// can only have chosen, is what makes it a decision.
				var decided = live && (live.src !== undefined || (live.mode && live.mode !== 'none'));
				text = decided ? EngCalcs.lpnQualityText(live)
					: (q.quality === undefined || q.quality === null ? '' : String(q.quality));
				if (text !== '') { out += row([pair[1], text]) + '\n'; }
				return;
			}
			if (q[pair[0]] === undefined || q[pair[0]] === null || q[pair[0]] === '') { return; }
			out += row([pair[1], String(q[pair[0]])]) + '\n';
		});
		return out;
	}

	// ------------------------------------------------------------------------------------------
	// **[REACTIONS] AND [QUALITY], INTERPRETED** (ROADMAP Task 566; dev/water-quality.md steps 1-3).
	//
	// Both sections were carried verbatim and never read, so a file stating `Global Bulk -.5`
	// arrived with no coefficient at all and a chemical could not be run. They are interpreted
	// here on EXACTLY the terms `[OPTIONS] Quality` already uses: the interpretation lives BESIDE
	// the file's own text, never over it. The carried lines stay in `doc.inpSections` and stay the
	// source of truth; the exporter writes them back character for character while the live values
	// still parse out of them, and composes its own section only once somebody has really changed
	// something. That is CLAUDE.md's `_xsrc`/`_ysrc` rule applied to a section instead of a number.
	//
	// **WHAT A COEFFICIENT MEANS, AND THE ONE OF THEM THAT CARRIES A UNIT.** A first-order BULK
	// coefficient is a reciprocal time (1/day) and a zero-order one is a concentration per day, so
	// neither moves between unit systems -- a concentration is never converted by anybody, EPANET
	// included. A first-order WALL coefficient is a LENGTH PER DAY, and the length is the one the
	// file's own flow units imply. Measured against the engine rather than read off a manual:
	// `Global Wall -1` in an LPS file and `Global Wall -3.2808...` in an otherwise identical GPM
	// file give the same concentration to 1e-6 (dev/lpn-spike/reaction-anchor-harness.js). That is
	// the dimensioned quantity this feature has, and js/looped-network.js converts it on a clone at
	// the engine boundary, never in the document.
	function reactNum(t) {
		var v = parseFloat(t);
		return isFinite(v) ? v : undefined;
	}
	function reactSet(out, key, v) { if (v !== undefined) { out[key] = v; } }
	var LPN_REACT_GLOBALS = ['orderBulk', 'orderTank', 'orderWall', 'globalBulk', 'globalWall',
		'limitingPotential', 'roughnessCorrelation'];
	/**
	 * `[REACTIONS]` as a record. Sparse: a key is present only where the section stated it, so
	 * absent means "the file said nothing" and the exporter writes nothing -- the same rule
	 * `hydraulics` and `qualityOptions` follow.
	 *
	 * `bulk`/`wall` are keyed by PIPE id and `tank` by tank id; all three are always objects, so no
	 * caller has to test for absence.
	 */
	EngCalcs.lpnReactionsParse = function (lines) {
		var out = { bulk: {}, wall: {}, tank: {} };
		(lines || []).forEach(function (raw) {
			var line = String(raw), semi = line.indexOf(';'), w, k0, k1;
			if (semi >= 0) { line = line.slice(0, semi); }
			line = line.trim();
			if (!line) { return; }
			w = line.split(/\s+/);
			k0 = (w[0] || '').toUpperCase();
			k1 = (w[1] || '').toUpperCase();
			if (k0 === 'ORDER') {
				if (k1 === 'BULK') { reactSet(out, 'orderBulk', reactNum(w[2])); }
				else if (k1 === 'TANK') { reactSet(out, 'orderTank', reactNum(w[2])); }
				else if (k1 === 'WALL') { reactSet(out, 'orderWall', reactNum(w[2])); }
				return;
			}
			if (k0 === 'GLOBAL') {
				if (k1 === 'BULK') { reactSet(out, 'globalBulk', reactNum(w[2])); }
				else if (k1 === 'WALL') { reactSet(out, 'globalWall', reactNum(w[2])); }
				return;
			}
			if (k0 === 'LIMITING') { reactSet(out, 'limitingPotential', reactNum(w[2])); return; }
			if (k0 === 'ROUGHNESS') { reactSet(out, 'roughnessCorrelation', reactNum(w[2])); return; }
			// A per-element row. The keyword is the same word the global rows use, told apart by
			// the SECOND token being an id rather than BULK/WALL -- which is EPANET's own grammar.
			if ((k0 === 'BULK' || k0 === 'WALL' || k0 === 'TANK') && w[1] && w[2] !== undefined) {
				reactSet(out[k0.toLowerCase()], w[1], reactNum(w[2]));
			}
		});
		return out;
	};
	function reactMapSame(a, b) {
		var ka = Object.keys(a || {}), kb = Object.keys(b || {}), i;
		if (ka.length !== kb.length) { return false; }
		for (i = 0; i < ka.length; i++) {
			if (!Object.prototype.hasOwnProperty.call(b, ka[i]) || b[ka[i]] !== a[ka[i]]) { return false; }
		}
		return true;
	}
	function reactSame(a, b) {
		var i;
		for (i = 0; i < LPN_REACT_GLOBALS.length; i++) {
			if (a[LPN_REACT_GLOBALS[i]] !== b[LPN_REACT_GLOBALS[i]]) { return false; }
		}
		return reactMapSame(a.bulk, b.bulk) && reactMapSame(a.wall, b.wall)
			&& reactMapSame(a.tank, b.tank);
	}
	function reactRow(cells) {
		var out = '', i;
		for (i = 0; i < cells.length; i++) { out += (i ? '\t' : ' ') + String(cells[i]); }
		return out;
	}
	/**
	 * The `[REACTIONS]` lines this document now states, or [] where it states none.
	 * `src` wins whenever it still parses to the same record, so an untouched file round-trips
	 * byte for byte.
	 */
	EngCalcs.lpnReactionsText = function (live, src) {
		var r = live || {}, out = [], k;
		if (src && src.length && reactSame(EngCalcs.lpnReactionsParse(src), {
			orderBulk: r.orderBulk, orderTank: r.orderTank, orderWall: r.orderWall,
			globalBulk: r.globalBulk, globalWall: r.globalWall,
			limitingPotential: r.limitingPotential, roughnessCorrelation: r.roughnessCorrelation,
			bulk: r.bulk || {}, wall: r.wall || {}, tank: r.tank || {}
		})) { return src.slice(); }
		// EPANET's own writer order, and sparse: nothing is written that the document does not say.
		[['orderBulk', 'Order Bulk'], ['orderTank', 'Order Tank'], ['orderWall', 'Order Wall'],
			['globalBulk', 'Global Bulk'], ['globalWall', 'Global Wall'],
			['limitingPotential', 'Limiting Potential'],
			['roughnessCorrelation', 'Roughness Correlation']].forEach(function (pair) {
			if (r[pair[0]] === undefined || r[pair[0]] === null) { return; }
			out.push(reactRow([pair[1], String(r[pair[0]])]));
		});
		[['bulk', 'BULK'], ['wall', 'WALL'], ['tank', 'TANK']].forEach(function (pair) {
			var m = r[pair[0]] || {};
			Object.keys(m).forEach(function (id) {
				if (m[id] === undefined || m[id] === null) { return; }
				out.push(reactRow([pair[1], id, String(m[id])]));
			});
		});
		return out;
	};
	/**
	 * `[QUALITY]` -- the concentration each node starts the run holding, keyed by node id.
	 *
	 * **AND FOR A RESERVOIR IT IS NOT AN INITIAL VALUE AT ALL**: EPANET holds a reservoir at its
	 * own quality for the whole run, which is what makes this section the simplest way a chemical
	 * enters a network. `[SOURCES]`, the booster kind, is still carried and not read.
	 */
	EngCalcs.lpnInitQualityParse = function (lines) {
		var out = {};
		(lines || []).forEach(function (raw) {
			var line = String(raw), semi = line.indexOf(';'), w, v;
			if (semi >= 0) { line = line.slice(0, semi); }
			line = line.trim();
			if (!line) { return; }
			w = line.split(/\s+/);
			if (!w[0] || w[1] === undefined) { return; }
			v = parseFloat(w[1]);
			if (isFinite(v)) { out[w[0]] = v; }
		});
		return out;
	};
	/** The `[QUALITY]` lines this document now states. `src` wins while it still parses to them. */
	EngCalcs.lpnInitQualityText = function (live, src) {
		var m = live || {}, out = [];
		if (src && src.length && reactMapSame(EngCalcs.lpnInitQualityParse(src), m)) { return src.slice(); }
		Object.keys(m).forEach(function (id) {
			if (m[id] === undefined || m[id] === null) { return; }
			out.push(reactRow([id, String(m[id])]));
		});
		return out;
	};

	// ------------------------------------------------------------------------------------------
	// **[ENERGY], INTERPRETED** (ROADMAP Task 566; dev/pump-energy.md).
	//
	// The one section on the carried list whose ANSWER IS MONEY. It was carried verbatim and never
	// read, so a file stating `Global Efficiency 75` arrived with no efficiency at all and the page
	// could not say what a pump costs to run. Read here on exactly the terms `[REACTIONS]` already
	// uses: the interpretation lives BESIDE the file's own text, never over it, and the exporter
	// writes the carried lines back character for character while the live values still parse out
	// of them.
	//
	// **NOTHING IN THIS SECTION CARRIES A UNIT, AND THAT IS WORTH SAYING RATHER THAN ASSUMING.**
	// An efficiency is a percent; a price is a currency per kWh and a demand charge a currency per
	// kW, and EPANET states energy in kWh and power in kW whatever the flow units are. A currency
	// is a LABEL, like the concentration unit beside a chemical's name: carried and shown, never
	// converted, with no currency family and no factor. So `[ENERGY]` needs no
	// engineHydraulics()/engineQuality() clone; the numbers cross to the engine as they stand.
	// **The dimensioned quantity in pump energy is the HEAD**, and it is already SI everywhere past
	// assembleModel().
	//
	// `Global Pattern` and a pump's own `PATTERN` name a price schedule: an id, not a number.
	// `PUMP <id> EFFIC <curve>` names a [CURVES] entry. It is parsed and written back so a file
	// that states one round-trips, and it has no control on this page, which keeps no general curve
	// library (a pump's head curve lives on the pump). js/lpn-epanet.js does not write it into the
	// engine input for that reason, and the run says which efficiency it used.
	var LPN_ENERGY_GLOBALS = [['globalEfficiency', 'Global Efficiency'],
		['globalPrice', 'Global Price'], ['globalPattern', 'Global Pattern'],
		['demandCharge', 'Demand Charge']];
	/**
	 * `[ENERGY]` as a record. Sparse, like `lpnReactionsParse`: a key is present only where the
	 * section stated it, so absent means "the file said nothing" and the exporter writes nothing.
	 *
	 * `effic`, `price` and `pattern` are keyed by PUMP id and are always objects, so no caller has
	 * to test for absence. `globalPattern`, `pattern` and `effic` hold the id VERBATIM: a pattern
	 * name is a name, and reading it as a number is how `P1` becomes NaN.
	 */
	EngCalcs.lpnEnergyParse = function (lines) {
		var out = { effic: {}, price: {}, pattern: {} };
		(lines || []).forEach(function (raw) {
			var line = String(raw), semi = line.indexOf(';'), w, k0, k1, k2;
			if (semi >= 0) { line = line.slice(0, semi); }
			line = line.trim();
			if (!line) { return; }
			w = line.split(/\s+/);
			k0 = (w[0] || '').toUpperCase();
			k1 = (w[1] || '').toUpperCase();
			if (k0 === 'GLOBAL') {
				if (k1 === 'EFFIC' || k1 === 'EFFICIENCY') { reactSet(out, 'globalEfficiency', reactNum(w[2])); }
				else if (k1 === 'PRICE') { reactSet(out, 'globalPrice', reactNum(w[2])); }
				else if (k1 === 'PATTERN' && w[2]) { out.globalPattern = w[2]; }
				return;
			}
			if (k0 === 'DEMAND' && k1 === 'CHARGE') { reactSet(out, 'demandCharge', reactNum(w[2])); return; }
			// A per-pump row. EPANET's own grammar: the keyword PUMP, the pump's id, then which of
			// the three this line states.
			if (k0 === 'PUMP' && w[1] && w[2]) {
				k2 = String(w[2]).toUpperCase();
				if (k2 === 'EFFIC' && w[3]) { out.effic[w[1]] = w[3]; }
				else if (k2 === 'PRICE') { reactSet(out.price, w[1], reactNum(w[3])); }
				else if (k2 === 'PATTERN' && w[3]) { out.pattern[w[1]] = w[3]; }
			}
		});
		return out;
	};
	function energySame(a, b) {
		var i;
		for (i = 0; i < LPN_ENERGY_GLOBALS.length; i++) {
			if (a[LPN_ENERGY_GLOBALS[i][0]] !== b[LPN_ENERGY_GLOBALS[i][0]]) { return false; }
		}
		return reactMapSame(a.effic, b.effic) && reactMapSame(a.price, b.price)
			&& reactMapSame(a.pattern, b.pattern);
	}
	/**
	 * The `[ENERGY]` lines this document now states, or [] where it states none.
	 * `src` wins whenever it still parses to the same record, so an untouched file round-trips
	 * byte for byte. Net1, Net2 and Net3 all state this section.
	 */
	EngCalcs.lpnEnergyText = function (live, src) {
		var e = live || {}, out = [], now = {
			effic: e.effic || {}, price: e.price || {}, pattern: e.pattern || {}
		};
		LPN_ENERGY_GLOBALS.forEach(function (pair) { now[pair[0]] = e[pair[0]]; });
		if (src && src.length && energySame(EngCalcs.lpnEnergyParse(src), now)) { return src.slice(); }
		// EPANET's own writer order: the globals, then every pump that states something of its own.
		LPN_ENERGY_GLOBALS.forEach(function (pair) {
			if (e[pair[0]] === undefined || e[pair[0]] === null || e[pair[0]] === '') { return; }
			out.push(reactRow([pair[1], String(e[pair[0]])]));
		});
		[['effic', 'EFFIC'], ['price', 'PRICE'], ['pattern', 'PATTERN']].forEach(function (pair) {
			var m = now[pair[0]];
			Object.keys(m).forEach(function (id) {
				if (m[id] === undefined || m[id] === null || m[id] === '') { return; }
				out.push(reactRow(['PUMP', id, pair[1], String(m[id])]));
			});
		});
		return out;
	};

	// `Map` and `Hydraulics USE/SAVE`, as the file's own characters. The value is split back into
	// its own tokens so `Hydraulics USE net.hyd` comes out as three columns the way it went in,
	// rather than as a keyword and one long string.
	var LPN_FILE_LINES = [['map', 'Map'], ['hydraulics', 'Hydraulics']];
	function fileOptionRows(files, row) {
		var f = files || {}, out = '';
		LPN_FILE_LINES.forEach(function (pair) {
			if (f[pair[0]] === undefined || f[pair[0]] === null || f[pair[0]] === '') { return; }
			out += row([pair[1]].concat(String(f[pair[0]]).split(/\s+/))) + '\n';
		});
		// Every other `[OPTIONS]` line the source stated and this page does not read, in the order
		// it stated them, each token exactly as it came. See the importer's note: this is the
		// section carry one level down, and it is why a new EPANET option needs no edit here.
		(f.other || []).forEach(function (toks) {
			if (toks && toks.length) { out += row(toks) + '\n'; }
		});
		return out;
	}

	// `scenarioDM`, when the caller supplies one, REPLACES the document's `Demand Multiplier` --
	// the export writes the scenario the user is looking at, which is already what `opts.effective`
	// does to every element property. Undefined leaves the document's own key exactly as it is,
	// present or absent, so sparse in stays sparse out.
	function hydraulicOptionRows(hyd, row, scenarioDM) {
		var h = hyd || {}, out = '';
		if (scenarioDM !== undefined && scenarioDM !== null) {
			h = Object.assign({}, h, { demandMultiplier: scenarioDM });
		}
		LPN_OPT_LINES.forEach(function (pair) {
			if (h[pair[0]] === undefined || h[pair[0]] === null) { return; }
			out += row([pair[1], String(h[pair[0]])]) + '\n';
		});
		if (h.unbalanced) {
			out += row(['Unbalanced', h.unbalanced === 'continue' ? 'Continue' : 'Stop']
				.concat(h.unbalanced === 'continue' && h.unbalancedTrials !== undefined
					? [String(h.unbalancedTrials)] : [])) + '\n';
		}
		return out;
	}


	/**
	 * Write an EPANET `.inp` for a saved lpn_ document.
	 *
	 *   doc   the saved document shape (docFromInp / serializeProject)
	 *   opts  .effective(el, prop)  scenario resolver; default is Base (`el['_' + prop]`)
	 *         .demandMultiplier      the active scenario's own, if it has one; the document's otherwise
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
			demandRows = [],
			nodeById = {}, linkById = {}, omitted = {}, i, j, nd, lk, lb;

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
				// **THE HEAD PATTERN IS THE THIRD COLUMN, AND IT IS THE NODE'S OWN OR NOTHING**
				// (Task 248.02) -- the same rule the junction's pattern column follows below. There
				// is no document-wide default for a head pattern in EPANET, so a blank column here
				// really does mean "no pattern" and writing one would state what the user never did.
				var rpat = nd.headPattern ? [String(nd.headPattern)] : [];
				if (rh === undefined || rh === null || rh === '') {
					reservoirs.push(row([nd.id, n(cHead, nd, 'elev', nd.elev || 0)].concat(rpat)));
				} else {
					reservoirs.push(row([nd.id, n(cHead, nd, '_head', rh)].concat(rpat)));
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
				//
				// **A JUNCTION WITH DEMAND CATEGORIES GOES OUT ITEMIZED** (Task 468), one [DEMANDS]
				// row each and NO demand column here at all -- which is EPANET's own writer's
				// layout, and the only unambiguous one, since [DEMANDS] REPLACES this column. Any
				// lumping for readability is a decision the property popup and the Tables pane get
				// to make; the file states the rows.
				var drows = EngCalcs.lpnDemandRows(nd, eff(nd, 'demand') || 0);
				if (EngCalcs.lpnDemandItemized(nd)) {
					junctions.push(row([nd.id, n(cHead, nd, 'elev', nd.elev || 0)]));
					for (j = 0; j < drows.length; j++) {
						// The CATEGORY is a trailing comment, not a column -- see the reader's note
						// at [DEMANDS]. Written verbatim, with anything that would start a second
						// comment or break the line taken out, because it is a name the user typed.
						demandRows.push(row([nd.id,
							n(cFlow, drows[j].rec, drows[j].key, drows[j].base || 0)].concat(
							drows[j].pattern ? [String(drows[j].pattern)] : [])) +
							(drows[j].category
								? '\t;' + String(drows[j].category).replace(/[;\r\n]+/g, ' ')
								: ''));
					}
				} else {
					junctions.push(row([nd.id,
						n(cHead, nd, 'elev', nd.elev || 0),
						n(cFlow, nd, '_demand', drows[0].base || 0)].concat(
						nd.demandPattern ? [String(nd.demandPattern)] : [])));
				}
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
			linkById[lk.id] = lk;
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
					// **KEYWORD-VALUE PAIRS, AND ONLY THE ONES THIS PUMP ACTUALLY STATES** (Task
					// 248.02). EPANET reads a [PUMPS] row as `HEAD c [SPEED s] [PATTERN p]` in any
					// order; a speed of exactly 1 is EPANET's own default, so writing it would put a
					// column in the file that the file it came from did not have. The SPEED token is
					// kept like every other number's, so `1.20` returns as `1.20`.
					var pumpRow = [lk.id, lk.from, lk.to, 'HEAD ' + cname],
						psp = lk.speed;
					if (typeof psp === 'number' && isFinite(psp) && psp !== 1) {
						pumpRow.push('SPEED ' + n(PLAIN, lk, 'speed', psp));
					}
					if (lk.speedPattern) { pumpRow.push('PATTERN ' + String(lk.speedPattern)); }
					pumps.push(row(pumpRow));
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
		// **EPANET'S ANCHOR IS A NODE AND ONLY A NODE.** A Text attached to a LINK (Task 502) has
		// no fourth token it could be given, so the words go out at the place they are drawn and
		// the attachment is REPORTED rather than faked -- writing the link id there would name a
		// node that does not exist, and writing the nearest node would move the note.
		// linkAnchorPoint() resolves the same fraction the editor draws at, from the file's own
		// coordinates, so the exported point is where the reader was looking.
		var unmeasured = [], linkAnchored = [];
		function linkAnchorPoint(lb2) {
			var lk = linkById[lb2.anchorLink], pts, t;
			if (!lk || !EngCalcs.lpnGeom || !EngCalcs.lpnGeom.pointAlongPolyline) { return null; }
			pts = [nodeById[lk.from]].concat(lk.verts || [], [nodeById[lk.to]]);
			if (!pts[0] || !pts[pts.length - 1]) { return null; }
			t = (typeof lb2.anchorT === 'number' && isFinite(lb2.anchorT))
				? Math.max(0, Math.min(1, lb2.anchorT)) : 0.5;
			return EngCalcs.lpnGeom.pointAlongPolyline(pts, t);
		}
		for (i = 0; i < (doc.labels || []).length; i++) {
			lb = doc.labels[i];
			if (!isActive(lb)) { continue; }
			var anchor = lb.anchorNode ? nodeById[lb.anchorNode] : null;
			if (!anchor && lb.anchorLink) {
				// REPORTED WHETHER OR NOT THE POINT RESOLVES: the attachment is lost from the file
				// either way, and the count the user is shown must say so.
				anchor = linkAnchorPoint(lb);
				linkAnchored.push(lb.id);
			}
			var px = (lb.x || 0) + (anchor ? (anchor.x || 0) : 0) + origin.x,
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
				.concat(lb.anchorNode && anchor ? [lb.anchorNode] : [])));
		}
		if (unmeasured.length) { diff('label-anchor-unmeasured', unmeasured); }
		if (linkAnchored.length) { diff('label-link-anchor-flattened', linkAnchored); }

		// ---- backdrop ----
		//
		// **ONLY AN IMAGE BACKDROP HAS ANYTHING AN `.inp` CAN SAY**, and even then not the picture:
		// EPANET stores a PATH on somebody's disk and this page stores the image itself, so the
		// placement goes out and the file name cannot. A TILE BASEMAP is not a file at all -- there is
		// no path to write and inventing one would name a file that does not exist -- so it is
		// reported and nothing is written. That is the seam shared with the tile-basemap track: this
		// writer recognises an image by its `href` and writes [BACKDROP] for nothing else.
		var backdrop = doc.backdrop, backdropRows = [];
		// **UNITS COMES FIRST AND IS NOT ABOUT THE IMAGE.** [BACKDROP] UNITS is the file's own
		// statement about what its [COORDINATES] MEAN, which is the one thing the reader uses to
		// decide grid or lat/lon (LPN_INP_MAP_UNITS above). A geographic project that exported
		// without it re-imported as a GRID project holding longitudes -- and since Task 145's
		// projection seam those numbers would then be drawn unprojected, so the loss is visible
		// rather than merely nominal. Written only when geographic: a grid document's coordinates
		// are canvas units and this page has no business claiming they are feet or metres.
		if (doc.project && doc.project.coords === 'geo') {
			backdropRows.push(row(['UNITS', 'DEGREES']));
		}
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
		// **A CARRIED SECTION GOES BACK OUT AS THE TEXT IT CAME IN AS**, on the [RULES] rule: nothing
		// on this page edits one and nothing here understands one well enough to compose a line. The
		// section is omitted entirely when the document holds none, so an empty [ENERGY] is never a
		// statement the source did not make.
		var carriedOut = doc.inpSections || {};
		function carriedSection(name) {
			var lines = carriedOut[name];
			return (lines && lines.length) ? '[' + name + ']\n' + lines.join('\n') + '\n\n' : '';
		}
		// **THE TWO WATER-QUALITY SECTIONS THAT ARE NO LONGER MERELY CARRIED** (Task 566). The
		// file's own lines are still in `carriedOut` and are still what goes out while the live
		// values parse out of them; these compose only once a coefficient or an initial
		// concentration has really been edited. Same rule, same shape, as `[OPTIONS] Quality`.
		function liveReactions() {
			var r = (settings.reactions || {}), out = { bulk: {}, wall: {}, tank: {} }, i, lk2, bv, wv, nd3, tv;
			['orderBulk', 'orderTank', 'orderWall', 'globalBulk', 'globalWall',
				'limitingPotential', 'roughnessCorrelation'].forEach(function (k) {
				if (r[k] !== undefined && r[k] !== null) { out[k] = r[k]; }
			});
			// **A TANK COEFFICIENT IS READ OFF THE TANK, like the pipe pair below** (Task 566). It
			// was carried on the setting while nothing on this page could edit one; the tank popup
			// and the Tanks table both write it now, so the element is where it lives and
			// `eff()` is how a scenario's own value reaches the file.
			// An older project's map is moved onto its tanks when it is opened; see
			// adoptTankCoeffs() in js/looped-network.js.
			Object.keys(r.tank || {}).forEach(function (id) { out.tank[id] = r.tank[id]; });
			for (i = 0; i < (doc.nodes || []).length; i++) {
				nd3 = doc.nodes[i];
				if (nd3.type !== 'tank' || omitted[nd3.id]) { continue; }
				tv = eff(nd3, 'tankCoeff');
				if (typeof tv === 'number' && isFinite(tv)) { out.tank[nd3.id] = tv; }
			}
			for (i = 0; i < (doc.links || []).length; i++) {
				lk2 = doc.links[i];
				if (lk2.type !== 'pipe' || omitted[lk2.id]) { continue; }
				bv = eff(lk2, 'bulkCoeff'); wv = eff(lk2, 'wallCoeff');
				if (typeof bv === 'number' && isFinite(bv)) { out.bulk[lk2.id] = bv; }
				if (typeof wv === 'number' && isFinite(wv)) { out.wall[lk2.id] = wv; }
			}
			return out;
		}
		function liveInitQuality() {
			var out = {}, i, nd2, v;
			for (i = 0; i < (doc.nodes || []).length; i++) {
				nd2 = doc.nodes[i];
				if (omitted[nd2.id]) { continue; }
				v = eff(nd2, 'initQuality');
				if (typeof v === 'number' && isFinite(v)) { out[nd2.id] = v; }
			}
			return out;
		}
		// **A DOCUMENT THAT HAS NEVER MET THE INTERPRETER STILL WRITES ITS CARRIED TEXT**, which is
		// the `decided` guard qualityOptionRows() already states one section along. `settings.reactions`
		// is written by the import pass that reads BOTH of these sections, so its presence is what
		// says "these lines have been read"; absent, the live record would be empty for the honest
		// reason that nobody ever filled it, and composing from it would delete a section the source
		// stated. A project saved before Task 566 is exactly that case.
		function anyReaction(r) {
			var i;
			for (i = 0; i < LPN_REACT_GLOBALS.length; i++) {
				if (r[LPN_REACT_GLOBALS[i]] !== undefined) { return true; }
			}
			return !!(Object.keys(r.bulk).length || Object.keys(r.wall).length
				|| Object.keys(r.tank).length);
		}
		function reactionsSection() {
			var live = liveReactions();
			// A document with neither an interpreted record nor one live value has never met the
			// interpreter, so composing from the empty record would delete a section the source
			// stated. A value typed on a pipe counts on its own -- a project that never imported an
			// `.inp` has no `settings.reactions` until somebody edits a global.
			if (!settings.reactions && !anyReaction(live)) { return carriedSection('REACTIONS'); }
			var lines = EngCalcs.lpnReactionsText(live, carriedOut.REACTIONS);
			return lines.length ? '[REACTIONS]\n' + lines.join('\n') + '\n\n' : '';
		}
		// **[ENERGY], ON THE SAME TERMS** (Task 566). The globals live on `settings.energy` and the
		// per-pump price and price pattern on the pumps, through the resolver seam; the efficiency
		// curve id is carried on the setting, having no control on this page. `settings.energy` is
		// written by the import pass that reads the section, so its presence is what says "these
		// lines have been read" -- absent, the carried text is what goes out.
		function liveEnergy() {
			var e = (settings.energy || {}), out = { effic: {}, price: {}, pattern: {} }, i, lk3, pv;
			['globalEfficiency', 'globalPrice', 'globalPattern', 'demandCharge'].forEach(function (k) {
				if (e[k] !== undefined && e[k] !== null && e[k] !== '') { out[k] = e[k]; }
			});
			Object.keys(e.effic || {}).forEach(function (id) { out.effic[id] = e.effic[id]; });
			for (i = 0; i < (doc.links || []).length; i++) {
				lk3 = doc.links[i];
				if (lk3.type !== 'pump' || omitted[lk3.id]) { continue; }
				pv = eff(lk3, 'energyPrice');
				if (typeof pv === 'number' && isFinite(pv)) { out.price[lk3.id] = pv; }
				pv = eff(lk3, 'energyPattern');
				if (pv) { out.pattern[lk3.id] = pv; }
			}
			return out;
		}
		function anyEnergy(e) {
			return e.globalEfficiency !== undefined || e.globalPrice !== undefined
				|| e.globalPattern !== undefined || e.demandCharge !== undefined
				|| !!(Object.keys(e.effic).length || Object.keys(e.price).length
					|| Object.keys(e.pattern).length);
		}
		function energySection() {
			var live = liveEnergy();
			if (!settings.energy && !anyEnergy(live)) { return carriedSection('ENERGY'); }
			var lines = EngCalcs.lpnEnergyText(live, carriedOut.ENERGY);
			return lines.length ? '[ENERGY]\n' + lines.join('\n') + '\n\n' : '';
		}
		function initQualitySection() {
			var live = liveInitQuality();
			if (!settings.reactions && !Object.keys(live).length) { return carriedSection('QUALITY'); }
			var lines = EngCalcs.lpnInitQualityText(live, carriedOut.QUALITY);
			return lines.length ? '[QUALITY]\n' + lines.join('\n') + '\n\n' : '';
		}
		// Everything carried that EPANET's own writer has no place for -- a section some other
		// program invented. Written last, before the drawing, in the order the source stated them.
		function carriedRest() {
			var out = '';
			Object.keys(carriedOut).forEach(function (name) {
				if (LPN_CARRIED_PLACED[name] || !carriedOut[name] || !carriedOut[name].length) { return; }
				out += '[' + name + ']\n' + carriedOut[name].join('\n') + '\n\n';
			});
			return out;
		}
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
			// [TAGS], where EPANET's own writer puts it. Carried, never read.
			carriedSection('TAGS') +
			// After [JUNCTIONS], whose rows it replaces, and beside [EMITTERS], the other section
			// that says something extra about a node this page draws once (Task 468).
			section('DEMANDS', demandRows) +
			section('EMITTERS', emitters) +
			section('CURVES', curves) +
			// After the links, because a [STATUS] row names a link that must already be declared.
			section('STATUS', statuses) +
			section('PATTERNS', patternRows) +
			// After the links a control names, and after the patterns, which is EPANET's own order.
			section('CONTROLS', controlRows) +
			// **[RULES] GOES BACK OUT AS THE TEXT IT CAME IN AS** (Task 248.03). Nothing on this
			// page edits a rule, and nothing here understands one well enough to compose a line, so
			// the file's own characters are the only honest form. The section is omitted entirely
			// when the document holds none -- an empty `[RULES]` is a statement the source never
			// made, the same rule `[OPTIONS] Pattern` follows.
			((doc.rules && doc.rules.length) ? '[RULES]\n' + doc.rules.join('\n') + '\n\n' : '') +
			// **THE ENERGY AND WATER-QUALITY SECTIONS**, in EPANET's own writer order. What is left
			// carried here this page really does not work out, and that is exactly why those have
			// to be written back untouched: a value we cannot use is still the user's.
			energySection() +
			initQualitySection() +
			carriedSection('SOURCES') +
			reactionsSection() +
			carriedSection('MIXING') +
			section('TIMES', timeRows) +
			// EPANET's own report settings. This page has its own way of showing answers and reads
			// none of these; they go back out as they came in.
			carriedSection('REPORT') +
			'[OPTIONS]\n' +
			row(['Units', flowKey]) + '\n' +
			row(['Headloss', headloss]) + '\n' +
			// The DEFAULT demand pattern, for every junction whose own column is blank. Omitted
			// entirely when the document has none: EPANET's own default is "no pattern", and writing
			// a line that says so is a statement the source file never made.
			(doc.defaultPattern ? row(['Pattern', String(doc.defaultPattern)]) + '\n' : '') +
			// **SPARSE, LIKE EVERY OTHER OPTION BESIDE IT.** This line was written unconditionally,
			// so a source file that stated no exponent came back out of the exporter stating one --
			// the same invented-line defect as the rest of this section, hidden because every EPA
			// reference model states it and so the round-trip fixtures never saw it. The document's
			// own sparse home is `hydraulics.emitterExponent`; `settings.emitterExponent` is the
			// LIVE value the solver reads and always has a number in it, which is why it cannot be
			// the test. A pre-Task-553 document that carries only the live copy is honoured too,
			// but only where it is not EPANET's own default -- an untouched 0.5 there is our
			// default showing through, not a statement the user made.
			(function () {
				var h = settings.hydraulics || {};
				if (h.emitterExponent !== undefined && h.emitterExponent !== null) {
					return row(['Emitter Exponent', String(h.emitterExponent)]) + '\n';
				}
				if (settings.emitterExponent !== undefined && settings.emitterExponent !== null
					&& +settings.emitterExponent !== 0.5) {
					return row(['Emitter Exponent', String(settings.emitterExponent)]) + '\n';
				}
				return '';
			}()) +
			// **EVERY OTHER HYDRAULIC OPTION THE DOCUMENT HOLDS, AND ONLY THOSE** (Task 553). The
			// list is sparse -- see the importer's own note -- so a key absent here means the file
			// did not state it and neither do we. That is what keeps a round trip byte-identical:
			// EPANET's defaults written out explicitly would be eleven lines the source never had.
			hydraulicOptionRows(settings.hydraulics, row, opts.demandMultiplier) +
			// **THE WATER-QUALITY OPTIONS GO BACK OUT AS THE TEXT THEY CAME IN AS**, last, which is
			// where EPANET's own writer puts them. Nothing here computes with them, so the file's
			// own characters are the only honest form -- see the importer's note. Sparse in, sparse
			// out: a document holding none writes none.
			qualityOptionRows(settings.qualityOptions, row, settings.quality) +
			// **AND THE TWO THAT NAME A FILE, LAST**, because EPANET's own writer emits neither and
			// there is therefore no order of its to follow. Written only where the source stated
			// one; a project holding none writes none, exactly as every other option here.
			fileOptionRows(settings.fileOptions, row) + '\n' +
			carriedRest() +
			section('COORDINATES', coords) +
			section('VERTICES', verts) +
			section('LABELS', labelRows) +
			section('BACKDROP', backdropRows) +
			'[END]\n';
		return { ok: true, inp: inp, differences: differences };
	};

}(typeof globalThis !== 'undefined' ? globalThis : this));
