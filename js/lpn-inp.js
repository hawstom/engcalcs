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
// L/s together. This module normalises ALL of that to SI (m, m3/s, m of head) with two deliberate
// exceptions, `length` and the map coordinates, which stay in the file's own length unit: the page
// stores those declaratively and both of EPANET's length units, ft and m, are on our own
// Length/Map selector, so passing them through untouched is exact where a round trip through SI
// would not be. `lengthUnit` says which one, and the caller sets the selector to match.
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
			addNode({
				id: r[0], type: 'junction', x: 0, y: 0,
				elev: num(r[1]) * headSI,
				demand: num(r[2]) * qSI * demandMultiplier,
				emitter: 0
			});
			if (r[3]) { drop('demand-pattern', [r[0]], r[3]); }
		}

		rows = rawSections.RESERVOIRS || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			if (!r[0]) { continue; }
			// EPANET's reservoir carries a TOTAL HEAD and no separate elevation. This page's
			// reservoir carries both, with a blank head meaning "the water surface is at the
			// ground" -- so an imported reservoir gets elevation = head, which is the same fixed
			// boundary condition and reads as zero pressure at the surface. Exactly what
			// applySaved() already does for reservoirs written before they had an elevation.
			addNode({ id: r[0], type: 'reservoir', x: 0, y: 0, elev: num(r[1]) * headSI, head: num(r[1]) * headSI });
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
			addNode({
				id: r[0], type: 'tank', x: 0, y: 0,
				elev: num(r[1]) * headSI,
				level: num(r[2]) * headSI,
				minLevel: num(r[3]) * headSI,
				maxLevel: num(r[4]) * headSI,
				diameter: num(r[5]) * headSI,
				// The solve reads `head`, and at the instant a steady-state solve describes, the
				// water surface is the bottom plus the initial level. See EngCalcs.lpnIsFixedHead.
				head: (num(r[1]) + num(r[2])) * headSI
			});
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
			if (!zeroed[r[0]]) { dn.demand = 0; zeroed[r[0]] = true; multiDemand.push(r[0]); }
			dn.demand += num(r[1]) * qSI * demandMultiplier;
			if (r[2]) { drop('demand-pattern', [r[0]], r[2]); }
		}
		if (multiDemand.length) { drop('demand-categories', multiDemand); }

		// ---- emitters ----
		// EPANET states the coefficient per unit of PRESSURE (psi under US units, metres under SI);
		// js/lpn-solver.js wants it per unit of HEAD in metres, with flow in m3/s. Both scales move.
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
				diameter: num(r[4]) * diaSI,
				roughness: num(r[5]),                 // dimensionless C for H-W; see headloss note
				k: num(r[6]),
				status: st === 'CLOSED' ? 'closed' : 'open',
				verts: []
			};
			links.push(pipe); linkIndex[pipe.id] = pipe;
		}

		// ---- curves, needed before pumps can be resolved ----
		var curves = {};
		rows = rawSections.CURVES || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			if (!r[0]) { continue; }
			if (!curves[r[0]]) { curves[r[0]] = []; }
			curves[r[0]].push([num(r[1]) * qSI, num(r[2]) * headSI]);
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
		// One valve setting, in the file's units, to SI. Written as a function rather than inline
		// because a [STATUS] line can override a valve's setting too, and the two call sites must
		// convert identically.
		function valveSettingSI(type, value) {
			if (type === 'PRV' || type === 'PSV' || type === 'PBV') { return value * pressSI; }
			if (type === 'FCV') { return value * qSI; }
			return value;   // TCV is dimensionless; GPV's "setting" is a curve id we do not read.
		}

		rows = rawSections.VALVES || [];
		var tcvIds = [], activeValveIds = [], unsupportedValveIds = [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			if (!r[0]) { continue; }
			var vtype = (r[4] || '').toUpperCase(),
				vdia = num(r[3]) * diaSI,
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
				diameter: vdia || (us ? 8 * IN : 0.2),
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
					setting: valveSettingSI(vtype, setting),
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
				sl.setting = valveSettingSI((sl.valveType || '').toUpperCase(), +r[1]);
			}
			else { drop('link-setting', [r[0]], r[1]); }
		}

		// ---- geometry ----
		rows = rawSections.COORDINATES || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			if (nodeIndex[r[0]]) { nodeIndex[r[0]].x = num(r[1]); nodeIndex[r[0]].y = num(r[2]); }
		}
		rows = rawSections.VERTICES || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			if (linkIndex[r[0]]) { linkIndex[r[0]].verts.push({ x: num(r[1]), y: num(r[2]) }); }
		}

		var labels = [];
		rows = rawSections.LABELS || [];
		for (i = 0; i < rows.length; i++) {
			r = rows[i];
			// x y "text" [anchor node]. The anchor is kept: this page has the same concept.
			labels.push({ x: num(r[0]), y: num(r[1]), text: r[2] || '', anchorNode: r[3] || null });
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
			l.diameter = best || (us ? 8 * IN : 0.2);
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
