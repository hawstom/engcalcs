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
	var REPORTABLE = {
		VALVES: 'valves', PATTERNS: 'patterns', CONTROLS: 'controls',
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
		function drop(code, ids, detail) {
			dropped.push({ code: code, ids: ids || [], detail: detail === undefined ? null : detail });
		}

		// ---- [OPTIONS], first, because the flow unit fixes every other unit in the file ----
		var flowKey = 'GPM', headloss = 'H-W', emitterExponent = 0.5, demandMultiplier = 1, rows, r;
		rows = rawSections.OPTIONS || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			var key = (r[0] || '').toUpperCase();
			if (key === 'UNITS' && r[1]) { flowKey = r[1].toUpperCase(); }
			else if (key === 'HEADLOSS' && r[1]) { headloss = r[1].toUpperCase(); }
			else if (key === 'EMITTER' && r[2]) { emitterExponent = num(r[2], 0.5); }
			else if (key === 'DEMAND' && r[2]) { demandMultiplier = num(r[2], 1); }
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
			if (r[3]) { drop('demand-pattern', [r[0]], r[3]); }
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
			if (r[2]) { drop('head-pattern', [r[0]], r[2]); }
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
		if (volCurveIds.length) { drop('tank-volume-curve', volCurveIds); }

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
			if (r[2]) { drop('demand-pattern', [r[0]], r[2]); }
		}
		if (multiDemand.length) { drop('demand-categories', multiDemand); }

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
		if (emitterIds.length) { drop('emitters-not-editable', emitterIds); }

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
			if (st === 'CV') { drop('check-valve', [r[0]]); st = 'OPEN'; }
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
					var pts = curves[r[j + 1]] || [];
					if (!pts.length) { drop('pump-curve-missing', [r[0]], r[j + 1]); }
					else if (pts.length <= 3) { pump.curvePoints = pts.slice(); }
					else {
						// This page fits h = h0 - a Q^b from at most three points (see
						// EngCalcs.lpnPumpFromCurve). A longer curve is sampled at its ends and
						// middle rather than truncated, so the fitted curve still spans the pump's
						// real operating range instead of only its low-flow end.
						var sorted = pts.slice().sort(function (u, v) { return u[0] - v[0]; });
						pump.curvePoints = [sorted[0], sorted[Math.floor((sorted.length - 1) / 2)], sorted[sorted.length - 1]];
						drop('pump-curve-reduced', [r[0]], pts.length);
					}
					j++;
				} else if (kw === 'POWER') {
					// A constant-power pump is H = P/(rho g Q) -- a different law from the one this
					// page's solver carries, and not expressible as three points on ours. Imported
					// as a curveless pump (a lossless connection) and reported.
					drop('pump-constant-power', [r[0]], r[j + 1]);
					j++;
				} else if (kw === 'SPEED' && num(r[j + 1], 1) !== 1) {
					drop('pump-speed', [r[0]], r[j + 1]);
					j++;
				} else if (kw === 'PATTERN') {
					drop('pump-pattern', [r[0]], r[j + 1]);
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
			return null;   // TCV is dimensionless; GPV's "setting" is a curve id we do not read.
		}

		rows = rawSections.VALVES || [];
		var tcvIds = [], activeValveIds = [], unsupportedValveIds = [];
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
			if (vtype === 'PBV' || vtype === 'GPV') {
				unsupportedValveIds.push(r[0]);
				// The minor-loss column is the coefficient EPANET applies while such a valve sits
				// fully open, so that is what the substitute pipe carries. The control is not
				// substituted for; it is reported gone.
				vlink = Object.assign({}, vcommon, { type: 'pipe', k: vloss });
			} else {
				if (vtype === 'TCV') { tcvIds.push(r[0]); } else { activeValveIds.push(r[0]); }
				vlink = Object.assign({}, vcommon, {
					type: 'valve',
					valveType: vtype || 'TCV',
					setting: setting,
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
			}
			// A valve's diameter falls back to a plausible main when the column is blank, and a TCV's
			// k is forced to zero -- both are numbers WE chose, so mergeTok refuses their columns'
			// text on its own and neither case needs a branch here.
			mergeTok(vlink, 'diameter', r[3], vlink.diameter);
			mergeTok(vlink, 'k', r[6], vlink.k);
			if (vlink.type === 'valve') { mergeTok(vlink, 'setting', r[5], vlink.setting); }
			links.push(vlink); linkIndex[vlink.id] = vlink;
		}
		if (tcvIds.length) { drop('valve-tcv', tcvIds); }
		if (activeValveIds.length) { drop('valve-active', activeValveIds); }
		if (unsupportedValveIds.length) { drop('valve-dropped', unsupportedValveIds); }

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
			else { drop('link-setting', [r[0]], r[1]); }
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
			// x y "text" [anchor node]. The anchor is kept: this page has the same concept.
			var lb = { x: num(r[0]), y: num(r[1]), text: r[2] || '', anchorNode: r[3] || null };
			mergeTok(lb, 'x', r[0], lb.x);
			mergeTok(lb, 'y', r[1], lb.y);
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
		if (dangling.length) { drop('dangling-link', dangling); }

		// ---- everything else we can only count ----
		Object.keys(REPORTABLE).forEach(function (name) {
			// VALVES is reported above, element by element, which is strictly better. TANKS is not
			// in this table at all: tanks are imported in full, so there is nothing to report.
			if (name === 'VALVES') { return; }
			if (seen[name]) { drop(REPORTABLE[name], [], seen[name]); }
		});
		// An extended-period run is a cut feature, and [TIMES] Duration is the only place it shows.
		rows = rawSections.TIMES || [];
		for (i = 0; i < rows.length; i++) {
			if ((rows[i][0] || '').toUpperCase() === 'DURATION' && /[1-9]/.test(rows[i][1] || '')) {
				drop('extended-period', [], rows[i][1]);
			}
		}

		var backdrop = null;
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
			nodes: nodes,
			links: links,
			labels: labels,
			backdrop: backdrop,
			dropped: dropped
		};
	};

}(typeof globalThis !== 'undefined' ? globalThis : this));
