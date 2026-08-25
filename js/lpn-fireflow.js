// lpn-fireflow.js -- available fire flow at a hydrant (ROADMAP Task 530), computation only.
//
// THE QUESTION: how much can this hydrant deliver while a stated critical node still holds at
// least a stated residual pressure (20 psi by convention)? Flow and pressure trade against each
// other, so there is no closed form -- it is a SEARCH. Put a demand on the hydrant, solve, read
// the critical node's pressure, bisect.
//
// PURE, like js/lpn-geom.js and js/lpn-collide.js: values in, values out. No DOM, no `doc`, no
// settings, no language strings, no engine of its own. Everything here is SI -- m3/s, metres of
// head, metres of pipe, metres of diameter -- and every imperial number the research supplied is
// converted HERE, once, in a derivation that stays visible rather than as a typed-in decimal.
//
// WHAT THIS FILE DELIBERATELY IS NOT:
//   * It is not a wizard. No interface, no strings, no wiring into the map editor. A result here
//     carries machine-readable codes and numbers; the wording is somebody else's job.
//   * It does not choose an engine. The solve is INJECTED (options.solve) -- see below.
//   * It never touches the user's document. The hydrant assembly is built onto a COPY. That IS the
//     "inject the hydrant into the physical model" design -- two junctions and two pipes in series,
//     every number of them an input a person can read and change.
//   * It does NOT carry a pre-computed flow-versus-loss table, and that was measured rather than
//     assumed: the assembly costs 0.03 ms of a 0.61 ms solve at 49 junctions and nothing measurable
//     at 225, while the bisection's ~16 NETWORK solves are the cost and no table can remove them.
//     EPANET would accept such a table (a GPV), but a GPV is EPANET-only, so it would take the
//     built-in solver away from this search to save nothing. Full record, and the one case that
//     would justify storing points: dev/fireflow-loss-table.md.
//
// SOURCES for every number below: the utility-planning-engineer's Task 530 research, 2026-08-25
// (dev/agents/utility-planning-engineer/journal.md, entries "Task 530 research" and its same-day
// follow-up "the k I said did not exist was hiding under a different name"), and Tom's rulings
// recorded in dev/ROADMAP.md Task 530.

// Browser: js/lpn-solver.js is already loaded by the page ahead of this file, and it in turn has
// js/PipeHydraulics.lib.js and js/Calculators.lib.js (which is where EngCalcs.G lives) ahead of
// it. Node: ask for the solver directly, exactly as lpn-solver.js asks for PipeHydraulics.
var EngCalcs = (typeof require === 'function' && typeof module !== 'undefined')
	? require('./lpn-solver.js')
	: (EngCalcs || {});

(function () {
	'use strict';

	// ---------------------------------------------------------------------------
	// UNIT BRIDGE -- the boundary, and the only place imperial appears
	// ---------------------------------------------------------------------------
	//
	// Every default in this file comes from an American standard and is stated there in inches,
	// feet, psi or gpm. The house rule is SI throughout with conversion at the boundary, so the
	// conversions happen once, here, DERIVED from the suite's exact definitions (CLAUDE.md:
	// ft = 0.3048 m, gal = 3.785411784 L, lbf = 4.4482216152605 N) rather than retyped as
	// decimals. A reader can follow every constant below back to the sentence it came from.
	var M_PER_FT = 0.3048,
		M_PER_IN = M_PER_FT / 12,
		M3_PER_GAL = 3.785411784e-3,
		// 1 psi = 1 lbf / in^2, in pascals.
		PA_PER_PSI = 4.4482216152605 / (M_PER_IN * M_PER_IN),
		// Water at ordinary distribution temperatures. 1000 kg/m3 is the density every
		// pressure-to-head conversion in this suite assumes; g is the suite's one gravity.
		RHO = 1000;

	// Pressure in psi -> head in metres of water. Exported because a caller that wants to offer
	// "20 psi" in an interface must convert with THIS function, not its own.
	function psiToHead(psi) {
		return psi * PA_PER_PSI / (RHO * EngCalcs.G);
	}
	function gpmToSI(gpm) {
		return gpm * M3_PER_GAL / 60;
	}

	// ---------------------------------------------------------------------------
	// THE ASSEMBLY -- barrel + lateral + k, all three, and none of them optional
	// ---------------------------------------------------------------------------
	//
	// Tom, 2026-08-25: *"we must either ask or disclose our assumptions about the diameter,
	// roughness, k, and length of a hydrant and lateral assembly"*, and *"including some k
	// whatsoever is non-negotiable."*
	//
	// THE FAILURE THIS PREVENTS: modelling "a 150 mm hydrant" as one 150 mm pipe. 150 mm is the
	// hydrant's SHOE -- its mechanical-joint inlet. AWWA C502 sets the main-valve waterway behind
	// it at 4 1/2 or 5 1/4 in (114-133 mm). Leave that constriction out and the tool overstates
	// capacity, which is the exact error this task exists to prevent.
	//
	// AND THE MINOR LOSS IS NOT THE SMALL TERM. Measured in the research at 1000 gpm through 6 in
	// C=140 ductile iron: friction is 64.5 ft per 1000 ft against the barrel's fixed 6.93 ft, so
	// minor loss is 4.3x friction at a 25 ft lateral, 2.2x at 50 ft, and about equal at 100 ft.
	// Across every lateral length real agency standards use, minor loss is never the smaller term.
	// A k of zero is not an option here.
	var DEFAULTS = {
		// LENGTH HAS NO DEFAULT AND MUST BE SUPPLIED. Five agency standards span 25-100 ft for the
		// same pipe (Addison TX 25 ft, Northlake and Clyde Hill 50 ft, Prosper TX 100 ft), and the
		// answer is sensitive to it. Inventing one would be the dishonest kind of convenience.
		lateralLength: null,

		// 6 in: the standard hydrant lateral / hydrant shoe connection size.
		lateralDiameter: 6 * M_PER_IN,

		// Cement-lined ductile iron. The research puts the defensible band at C = 120-140 and
		// calls roughness the cheapest of the four assumptions to get wrong; 130 is its middle.
		lateralRoughness: 130,

		// The hydrant's own waterway -- AWWA C502's main-valve opening, 4 1/2 or 5 1/4 in. The
		// smaller of the two is the default because it is the more common and the conservative
		// one. THIS, not the 150 mm shoe, is the real constriction.
		barrelDiameter: 4.5 * M_PER_IN,

		// About 5 ft of waterway -- a common 3 1/2 ft bury plus roughly 1 1/2 ft up to the pumper
		// nozzle. This length carries only the barrel's own FRICTION, which is the minor part of
		// the barrel's loss; the dominant part is in the k below, measured across the whole
		// barrel + main valve + nozzle. Overriding this changes the answer very little, which is
		// why a rounded typical value is honest here and a made-up lateral length would not be.
		barrelLength: 5 * M_PER_FT,

		// Same lining as the lateral; the barrel is a short run of coated iron.
		barrelRoughness: 130,

		// The hydrant outlet is taken at the hydrant node's own elevation. The nozzle actually
		// sits some distance above grade, but how far is a fact about one installed hydrant that
		// this file cannot know, and 18 in of head is 0.65 psi -- worth supplying when it is
		// known, not worth inventing. Supply `outletRise` in metres to include it.
		outletRise: 0,

		// 20 psi residual: the AWWA M31 / NFPA 291 convention for available fire flow.
		residualPsi: 20,

		// The search ceiling. 10,000 gpm is about 6.7x the ISO single-hydrant credit cap and far
		// past any real hydrant; a search that reaches it has not found a hydrant answer, and says
		// so by name rather than reporting the ceiling as though it were one.
		maxFlow: gpmToSI(10000),

		// Stop bisecting when the bracket is this narrow, relative to the upper bound. 1e-4 of
		// 10,000 gpm is 1 gpm -- far finer than any fire-flow number is ever quoted to, and about
		// 14 solves.
		flowTol: 1e-4
	};

	// ---- the k, in two labelled pieces, each derived rather than typed ----------
	//
	// **A MINOR-LOSS COEFFICIENT IS MEANINGLESS WITHOUT THE VELOCITY IT IS REFERENCED TO**, and
	// this assembly has TWO diameters -- a 6 in lateral and a 4.5 in waterway. h = k V^2/2g, and
	// V goes as 1/D^2, so the SAME k applied at the barrel's velocity instead of the lateral's
	// develops (D_lateral/D_barrel)^4 = (6/4.5)^4 = 3.16 times the head loss. Tom, 2026-08-25:
	// *"We must be crystal clear on which velocity any k belongs to. I see this as critical in
	// the hydrant model."*
	//
	// SO THE REFERENCE VELOCITY IS IN THE NAME OF EVERY k IN THIS FILE, in the comment beside it,
	// and in the result record -- never merely implied by which link the number happens to sit
	// on. `K_REFERENCE_LINK` below names the one link the assembly's k may ride, the build puts
	// it there and pins the other link's k to zero, and
	// dev/lpn-spike/fireflow-harness.js asserts the 3.16x separation so that moving the k to the
	// barrel fails loudly instead of quietly reporting a hydrant 12% weaker than it is.
	//
	// NEVER PRESENT THE SUM AS ONE MEASURED NUMBER. The two halves have completely different
	// provenance and a user must be able to see that (they may be ADDED only because both are
	// referenced to the same velocity -- that is what makes the sum arithmetic and not a fudge):
	//
	// PIECE 1 -- the hydrant barrel, main valve and nozzle. AWWA C502's QA clause, quoted
	// word-for-word and independently in the Bryan/College Station TX joint municipal water design
	// standard (Section 33 12 19, rev. 3/2024) and in American-Darling/Waterous's own ALPHA-base
	// product specification: *"Friction loss shall not exceed 3.0 psig at 1000 GPM through the
	// hydrant 4-1/2 in. pumper nozzle."* This is a MAXIMUM-ALLOWABLE test limit, not a textbook K,
	// which is why no hydraulics reference carries it -- it lives in procurement boilerplate. It
	// is therefore conservative by construction: a hydrant that passes QA does at least this well,
	// so using the ceiling understates available flow, which is the right direction to be wrong in
	// a fire-flow tool.
	//
	// Referenced to the velocity IN THE 6 IN LATERAL -- note that the loss it describes happens in
	// the 4.5 in waterway, which is exactly why the reference has to be stated rather than
	// inferred from where the loss occurs. That ceiling is K = h / (V_lateral^2/2g). Derived
	// below so the trace back to "3.0 psi at 1000 gpm" stays visible; it comes out ~3.46.
	var K_QA_PSI = 3.0,
		K_QA_GPM = 1000,
		K_QA_AREA = Math.PI * DEFAULTS.lateralDiameter * DEFAULTS.lateralDiameter / 4,
		K_QA_V = gpmToSI(K_QA_GPM) / K_QA_AREA,
		K_BARREL_AT_LATERAL_V = psiToHead(K_QA_PSI) / (K_QA_V * K_QA_V / (2 * EngCalcs.G));

	// PIECE 2 -- the rest of the run, by Crane Technical Paper 410's standard fitting values:
	// tee, flow through the branch, into the lateral ~1.0; fully open gate valve ~0.15; one
	// flanged 90 degree elbow into the riser ~0.35 (published 0.3-0.5). Widely tabulated -- unlike
	// the barrel term, this half was never the gap. Subtotal ~1.5. These fittings ARE in the
	// lateral, so Crane's own reference velocity and ours are the same one here; the suffix is
	// kept on the name anyway, because a reader must not have to know that to trust the sum.
	var K_TEE = 1.0,
		K_GATE = 0.15,
		K_ELBOW = 0.35,
		K_FITTINGS_AT_LATERAL_V = K_TEE + K_GATE + K_ELBOW;

	// Recommended total K ~ 5, research range 3-6.
	//
	// **IT RIDES ON THE LATERAL LINK BECAUSE THAT IS THE VELOCITY IT IS REFERENCED TO** -- the
	// solver reads a link's k against that link's own diameter (EngCalcs.lpnLinkK, then
	// k/(2 g A^2) in the iteration), so the link a k sits on IS the reference velocity, and the
	// two must be chosen together. Moving this k to the barrel without re-deriving it would
	// inflate its head loss 3.16x and understate the hydrant by ~12%.
	//
	// A caller that overrides `lateralDiameter` moves that reference velocity with it: the k is
	// still referenced to the lateral, but to a lateral of a different size than the one the
	// derivation above assumed. The result record reports the diameter actually in force
	// (assembly.k.referencedTo.diameter) beside the one the derivation used
	// (assembly.k.derivedAtDiameter), so the two can be compared without reading this file.
	//
	// NOT IMPORTED, and worth naming so nobody imports it later: the NFPA 291 pitot coefficients
	// (0.90 / 0.80). They convert a field pitot reading to gpm. They are a different quantity that
	// merely sounds adjacent, and using one as a k would be nonsense.
	var K_TOTAL_AT_LATERAL_V = K_BARREL_AT_LATERAL_V + K_FITTINGS_AT_LATERAL_V;

	// The one link of the assembly a k may ride, stated once. The build reads it, the result
	// record reports it, and the harness asserts against it -- so "which velocity does the k
	// belong to" has exactly one answer in this file and it is a value, not a convention.
	var K_REFERENCE_LINK = 'lateral';

	// ISO caps the credit given to a single hydrant at 1,500 gpm whatever the hydraulics say.
	// REPORTED AS A NOTE BESIDE THE COMPUTED NUMBER, NEVER SILENTLY CLAMPED: a clamped number is a
	// lie with a tidy face, while a computed number the reader is told to cap is the truth.
	var ISO_SINGLE_HYDRANT_CAP = gpmToSI(1500);

	// ---------------------------------------------------------------------------
	// Result codes -- every outcome is NAMED, and no failure is ever a number
	// ---------------------------------------------------------------------------
	//
	// The edge cases are the deliverable. In particular "there is no available fire flow" must
	// never come back as 0 gpm, because THE QUESTION HAS NO ANSWER RATHER THAN AN ANSWER OF ZERO.
	// Available fire flow is DEFINED as the flow at which the critical node still holds the
	// residual; if the residual is already unmet with the hydrant shut, no flow satisfies the
	// definition and there is nothing to report. The system fails the criterion before the
	// hydrant is opened. That is a different fact from "the answer is zero", and the caller has
	// to be told which one it is -- so the case is NAMED (below-residual-at-rest) and carries the
	// static pressure that failed, with no `flow` field at all.
	var CODES = {
		OK: 'ok',
		NO_LATERAL_LENGTH: 'lateral-length-required',
		UNKNOWN_HYDRANT: 'hydrant-node-not-found',
		UNKNOWN_CRITICAL: 'critical-node-not-found',
		NOT_A_JUNCTION: 'hydrant-node-not-a-junction',
		BELOW_AT_REST: 'below-residual-at-rest',
		CEILING: 'search-ceiling-reached',
		NO_CONVERGENCE: 'solve-did-not-converge',
		SOLVE_FAILED: 'solve-reported-issues'
	};

	// ---------------------------------------------------------------------------
	// Building the assembly onto a COPY
	// ---------------------------------------------------------------------------
	//
	// Tom: the add-on is *"ad-hoc"* and *"applied before asserting anything about fire flow"* --
	// it never enters the user's document, the asset list, a saved file or the .inp export. That
	// boundary is kept structurally here: nothing below writes to anything reachable from the
	// model passed in. Nodes and links are shallow-copied into fresh arrays, and only the copies
	// are ever mutated (one node gets a demand). dev/lpn-spike/fireflow-harness.js asserts the
	// input model is byte-identical afterwards.
	function copyModel(model) {
		var out = {}, key;
		for (key in model) {
			if (Object.prototype.hasOwnProperty.call(model, key)) { out[key] = model[key]; }
		}
		out.nodes = model.nodes.map(function (n) {
			var c = {}, k;
			for (k in n) { if (Object.prototype.hasOwnProperty.call(n, k)) { c[k] = n[k]; } }
			return c;
		});
		out.links = model.links.map(function (l) {
			var c = {}, k;
			for (k in l) { if (Object.prototype.hasOwnProperty.call(l, k)) { c[k] = l[k]; } }
			return c;
		});
		return out;
	}

	// An id nothing in the model already uses. The assembly is ad-hoc, but while it exists it
	// shares an id namespace with the user's elements and a collision would silently re-wire
	// their network.
	function freeId(taken, base) {
		var id = base, n = 2;
		while (taken[id]) { id = base + '_' + n; n++; }
		taken[id] = true;
		return id;
	}

	// Which of the two a value came from -- what makes "ask or disclose" possible in an interface
	// later. Every assumption in the result carries it.
	function chose(opts, name, dflt) {
		var supplied = opts[name] !== undefined && opts[name] !== null;
		return { value: supplied ? opts[name] : dflt, source: supplied ? 'supplied' : 'default' };
	}

	/**
	 * Build the hydrant assembly onto a copy of `model`.
	 *
	 * Returns { model, assembly, elements } where `model` is the copy carrying three new
	 * elements in series off the named hydrant node:
	 *
	 *     [hydrant node on the main] --lateral--> [hydrant base] --barrel--> [outlet]
	 *
	 * The demand goes on the OUTLET, so the answer is the flow at the hydrant outlet -- the
	 * boundary AWWA M31 and NFPA 291 both define performance at, and where WaterGEMS's own
	 * Hydrant element stops. (Everything past the nozzle is fire-ground hydraulics: hose lay is
	 * chosen at the scene and a distribution model cannot know it. Task 530 closed that option.)
	 *
	 * Exported separately from the search so a caller can show the assembly it is about to use,
	 * and so the harness can test the copy and the geometry without running a search.
	 */
	function build(model, options) {
		var opts = options || {},
			m = copyModel(model),
			taken = {},
			i,
			lateralLength = chose(opts, 'lateralLength', DEFAULTS.lateralLength),
			lateralDiameter = chose(opts, 'lateralDiameter', DEFAULTS.lateralDiameter),
			lateralRoughness = chose(opts, 'lateralRoughness', DEFAULTS.lateralRoughness),
			barrelDiameter = chose(opts, 'barrelDiameter', DEFAULTS.barrelDiameter),
			barrelLength = chose(opts, 'barrelLength', DEFAULTS.barrelLength),
			barrelRoughness = chose(opts, 'barrelRoughness', DEFAULTS.barrelRoughness),
			outletRise = chose(opts, 'outletRise', DEFAULTS.outletRise),
			k = chose(opts, 'k', K_TOTAL_AT_LATERAL_V),
			hydrant = null,
			baseId,
			outletId,
			lateralLink,
			barrelLink,
			elev;

		for (i = 0; i < m.nodes.length; i++) {
			taken[m.nodes[i].id] = true;
			if (m.nodes[i].id === opts.hydrantNode) { hydrant = m.nodes[i]; }
		}
		for (i = 0; i < m.links.length; i++) { taken[m.links[i].id] = true; }

		if (!hydrant) { return { error: CODES.UNKNOWN_HYDRANT, id: opts.hydrantNode }; }
		// A hydrant hangs off a junction of the distribution system. Asking for one off a
		// reservoir or a tank is a modelling mistake, and answering it would give a number set by
		// the fixed head alone.
		if (hydrant.type !== 'junction') {
			return { error: CODES.NOT_A_JUNCTION, id: hydrant.id, type: hydrant.type };
		}
		if (!(lateralLength.value > 0)) { return { error: CODES.NO_LATERAL_LENGTH }; }

		elev = hydrant.elev || 0;
		baseId = freeId(taken, opts.hydrantNode + '~base');
		outletId = freeId(taken, opts.hydrantNode + '~outlet');

		m.nodes.push({ id: baseId, type: 'junction', elev: elev, demand: 0 });
		m.nodes.push({ id: outletId, type: 'junction', elev: elev + outletRise.value, demand: 0 });

		// **THE ENTIRE k GOES ON THE LATERAL, AND THE BARREL'S k IS PINNED TO ZERO.** The link a k
		// sits on is the velocity it is referenced to (see K_REFERENCE_LINK above), so these two
		// lines are the reference declaration, not a placement detail. Splitting the k across the
		// two links, or moving it to the barrel, changes what the number MEANS -- the barrel's
		// velocity is (6/4.5)^2 = 1.78x the lateral's, so the same k there is 3.16x the head loss.
		lateralLink = {
			id: freeId(taken, opts.hydrantNode + '~lateral'), type: 'pipe',
			from: hydrant.id, to: baseId,
			length: lateralLength.value, diameter: lateralDiameter.value,
			roughness: lateralRoughness.value, k: k.value, status: 'open'
		};
		barrelLink = {
			id: freeId(taken, opts.hydrantNode + '~barrel'), type: 'pipe',
			from: baseId, to: outletId,
			length: barrelLength.value, diameter: barrelDiameter.value,
			roughness: barrelRoughness.value, k: 0, status: 'open'
		};
		m.links.push(lateralLink);
		m.links.push(barrelLink);

		return {
			model: m,
			elements: {
				baseNode: baseId,
				outletNode: outletId,
				lateralLink: lateralLink.id,
				barrelLink: barrelLink.id,
				// WHICH LINK CARRIES THE k, reported rather than assumed. A caller drawing the
				// assembly, and the harness, both read this instead of guessing from the ids.
				kOnLink: lateralLink.id
			},
			// WHAT WAS USED AND WHERE IT CAME FROM. An interface reads this to ask or to disclose;
			// a report reads it to state its assumptions.
			assembly: {
				lateral: {
					length: lateralLength, diameter: lateralDiameter, roughness: lateralRoughness
				},
				barrel: {
					length: barrelLength, diameter: barrelDiameter, roughness: barrelRoughness
				},
				outletRise: outletRise,
				k: {
					total: k,
					// Two pieces, never one number -- the provenance of each half is different.
					// Both are referenced to the same velocity, which is the only reason they can
					// be added; each says so on its own so neither can be lifted out alone.
					parts: k.source === 'supplied' ? [] : [
						{
							name: 'barrel-valve-nozzle', value: K_BARREL_AT_LATERAL_V,
							referencedTo: K_REFERENCE_LINK,
							basis: 'AWWA C502 QA ceiling, 3.0 psi at 1000 gpm through the 4.5 in ' +
								'pumper nozzle, referenced to the velocity in the 6 in lateral ' +
								'(the loss occurs in the 4.5 in waterway; the reference does not)'
						},
						{
							name: 'lateral-fittings', value: K_FITTINGS_AT_LATERAL_V,
							referencedTo: K_REFERENCE_LINK,
							basis: 'Crane TP-410: tee through branch 1.0, open gate valve 0.15, ' +
								'flanged 90 elbow 0.35, referenced to the lateral velocity'
						}
					],
					// **WHICH VELOCITY THIS k BELONGS TO.** Stated as data, in the result, so an
					// interface can say it out loud and a report can print it. `diameter` is the
					// lateral diameter ACTUALLY IN FORCE -- override the lateral and the reference
					// velocity moves with it -- while `derivedAtDiameter` is the 6 in the research
					// derivation assumed. When they differ, a disclosed k is being used at a
					// velocity it was not derived at, and the reader is the one who must decide
					// whether that is acceptable.
					referencedTo: {
						link: K_REFERENCE_LINK,
						linkId: lateralLink.id,
						diameter: lateralDiameter.value,
						basis: k.source === 'supplied'
							? 'YOUR k IS TAKEN TO BE REFERENCED TO THE VELOCITY IN THE LATERAL, ' +
								'at the lateral diameter above. A coefficient referenced to any ' +
								'other velocity -- the hydrant waterway, a nozzle, a table whose ' +
								'reference is not stated -- must be re-referenced by multiplying ' +
								'it by (its own diameter / the lateral diameter) to the fourth ' +
								'power before it is supplied here.'
							: 'Both pieces are referenced to the velocity in the lateral, at the ' +
								'lateral diameter above.'
					},
					derivedAtDiameter: DEFAULTS.lateralDiameter,
					range: { low: 3, high: 6 }
				}
			}
		};
	}

	// ---------------------------------------------------------------------------
	// The search
	// ---------------------------------------------------------------------------
	//
	// THE SOLVE IS INJECTED, and that is the one design decision here worth defending. Three
	// facts force it:
	//   1. the native solver (EngCalcs.lpnSolve) is synchronous and EPANET's
	//      (EngCalcs.lpnSolveEpanet) returns a promise;
	//   2. a network holding a PRV/PSV/FCV is routed to EPANET automatically, and where that line
	//      falls is EngCalcs.lpnValveIsNative's business, not this file's;
	//   3. a bisection makes ~15 solves, so the caller -- who knows what it is willing to pay and
	//      which engine the page is set to -- must choose, not us.
	// So: options.solve is a function(model) returning a solve result OR a promise of one, and
	// this function ALWAYS returns a promise. Async for both, never one shape for the harness and
	// another for the page.
	function solveOnce(solve, m) {
		return Promise.resolve().then(function () { return solve(m); });
	}

	/**
	 * EngCalcs.lpnFireFlow(model, options) -> Promise<result>
	 *
	 * options:
	 *   solve            REQUIRED function(model) -> result | Promise<result>, in lpnSolve's shape
	 *   hydrantNode      REQUIRED id of the junction the hydrant hangs off
	 *   lateralLength    REQUIRED metres -- there is no honest default (see DEFAULTS)
	 *   criticalNode     id in the caller's own model; omit for the hydrant OUTLET, which is where
	 *                    AWWA M31 and NFPA 291 define the residual
	 *   residual         metres of head; omit for 20 psi
	 *   maxFlow, flowTol search ceiling and bracket tolerance (SI, see DEFAULTS)
	 *   lateralDiameter, lateralRoughness, barrelDiameter, barrelLength, barrelRoughness,
	 *   outletRise, k    every assumption is overridable, and the result says which were supplied.
	 *                    A SUPPLIED `k` IS TAKEN TO BE REFERENCED TO THE LATERAL'S VELOCITY, at
	 *                    whatever lateralDiameter is in force; the result states that in
	 *                    assembly.k.referencedTo so a caller can repeat it to the user rather
	 *                    than letting them paste a coefficient that meant another velocity.
	 *
	 * result always carries { ok, code, assembly, elements, criticalNode, solves }, and on ok
	 * also { flow, residual, residualAt, staticPressure, notes }.
	 */
	function fireFlow(model, options) {
		var opts = options || {},
			residual = chose(opts, 'residual', psiToHead(DEFAULTS.residualPsi)).value,
			maxFlow = chose(opts, 'maxFlow', DEFAULTS.maxFlow).value,
			flowTol = chose(opts, 'flowTol', DEFAULTS.flowTol).value,
			built,
			critical,
			solves = 0,
			i;

		if (typeof opts.solve !== 'function') {
			// A wiring error, not a network result: there is no honest answer to return.
			throw new TypeError('lpnFireFlow: options.solve must be a function(model) returning ' +
				'a solve result or a promise of one. The engine is the caller\'s choice.');
		}

		built = build(model, opts);
		if (built.error) {
			return Promise.resolve({
				ok: false, code: built.error, id: built.id, type: built.type, solves: 0
			});
		}

		// The critical node is the outlet unless the caller names one of its OWN nodes. Checked
		// against the model as it came in, so a caller cannot accidentally name a node this file
		// invented.
		critical = built.elements.outletNode;
		if (opts.criticalNode !== undefined && opts.criticalNode !== null) {
			critical = null;
			for (i = 0; i < model.nodes.length; i++) {
				if (model.nodes[i].id === opts.criticalNode) { critical = opts.criticalNode; }
			}
			if (critical === null) {
				return Promise.resolve({
					ok: false, code: CODES.UNKNOWN_CRITICAL, id: opts.criticalNode,
					assembly: built.assembly, elements: built.elements, solves: 0
				});
			}
		}

		function fail(code, extra) {
			var out = {
				ok: false, code: code, assembly: built.assembly, elements: built.elements,
				criticalNode: critical, residual: residual, solves: solves
			}, key;
			for (key in extra) {
				if (Object.prototype.hasOwnProperty.call(extra, key)) { out[key] = extra[key]; }
			}
			return out;
		}

		// One trial: set the outlet demand, solve, read the critical node's pressure.
		function probe(q) {
			var m = built.model, node, j;
			for (j = 0; j < m.nodes.length; j++) {
				if (m.nodes[j].id === built.elements.outletNode) { node = m.nodes[j]; }
			}
			node.demand = q;
			solves++;
			return solveOnce(opts.solve, m).then(function (r) {
				return {
					q: q, result: r,
					pressure: r && r.pressures ? r.pressures[critical] : undefined
				};
			});
		}

		// A trial that did not produce a trustworthy pressure is NAMED, never folded into the
		// search as though it meant "cannot deliver". A non-converged solve is not a small flow;
		// it is an unknown one, and reporting it as a flow would be inventing an answer.
		function check(p) {
			if (!p.result || !p.result.ok) {
				return fail(CODES.SOLVE_FAILED, {
					flowAtFailure: p.q, issues: (p.result && p.result.issues) || []
				});
			}
			if (!p.result.converged) {
				return fail(CODES.NO_CONVERGENCE, {
					flowAtFailure: p.q, iterations: p.result.iterations,
					maxFlowChange: p.result.maxFlowChange
				});
			}
			if (!isFinite(p.pressure)) {
				return fail(CODES.SOLVE_FAILED, { flowAtFailure: p.q, issues: [] });
			}
			return null;
		}

		// Step 1: the hydrant SHUT. Available fire flow is the flow at which the critical node
		// still holds the residual. If the residual is already unmet with nothing flowing, NO
		// SUCH FLOW EXISTS -- the network fails the criterion before the hydrant is opened, so
		// the question has no answer rather than an answer of zero. Reported by name, with no
		// flow field, and with the reason in the record so a caller can say it without knowing it.
		return probe(0).then(function (rest) {
			var bad = check(rest);
			if (bad) { return bad; }
			if (rest.pressure < residual) {
				return fail(CODES.BELOW_AT_REST, {
					staticPressure: rest.pressure,
					basis: 'Available fire flow is the flow at which the critical node still ' +
						'holds the residual. With the hydrant shut the residual is already not ' +
						'held, so there is no such flow: the question has no answer here. This ' +
						'is not an available fire flow of zero.'
				});
			}

			// Step 2: the ceiling. If the residual still holds there, the network is not telling
			// us about a hydrant -- it is telling us the model has no meaningful head loss, or
			// the ceiling is too low. Say which, by name; do NOT report the ceiling as an answer.
			return probe(maxFlow).then(function (top) {
				var bad2 = check(top);
				if (bad2) { return bad2; }
				if (top.pressure >= residual) {
					return fail(CODES.CEILING, {
						ceiling: maxFlow, pressureAtCeiling: top.pressure,
						staticPressure: rest.pressure
					});
				}

				// Step 3: bisect. `lo` always MEETS the residual and `hi` always fails, so the
				// answer reported is `lo` -- the largest flow known to hold the residual. Erring
				// on the low side is the right direction for a fire-flow number.
				var lo = 0, hi = maxFlow, loPressure = rest.pressure, aborted = null;

				function step() {
					if (aborted || hi - lo <= flowTol * maxFlow) {
						return aborted || {
							ok: true, code: CODES.OK,
							flow: lo,
							residual: residual,
							residualAt: loPressure,
							staticPressure: rest.pressure,
							criticalNode: critical,
							bracket: { low: lo, high: hi },
							assembly: built.assembly,
							elements: built.elements,
							solves: solves,
							// The ISO note travels WITH the number, and the number is never
							// changed by it.
							notes: [{
								code: 'iso-single-hydrant-cap',
								limit: ISO_SINGLE_HYDRANT_CAP,
								exceeded: lo > ISO_SINGLE_HYDRANT_CAP,
								basis: 'ISO credits a single hydrant with at most 1,500 gpm ' +
									'whatever the hydraulics say. Not applied to the computed flow.'
							}]
						};
					}
					return probe((lo + hi) / 2).then(function (p) {
						var b = check(p);
						if (b) { aborted = b; return step(); }
						if (p.pressure >= residual) { lo = p.q; loPressure = p.pressure; }
						else { hi = p.q; }
						return step();
					});
				}
				return step();
			});
		});
	}

	EngCalcs.lpnFireFlow = fireFlow;
	EngCalcs.lpnFireFlowBuild = build;
	EngCalcs.lpnFireFlowDefaults = DEFAULTS;
	EngCalcs.lpnFireFlowCodes = CODES;
	// EVERY NAME HERE CARRIES ITS REFERENCE VELOCITY. A bare `total` would be a number a caller
	// could put on any link it liked; `totalAtLateralVelocity` cannot be misread that way, and the
	// two fields under it say at which lateral diameter and on which link.
	EngCalcs.lpnFireFlowK = {
		barrelAtLateralVelocity: K_BARREL_AT_LATERAL_V,
		fittingsAtLateralVelocity: K_FITTINGS_AT_LATERAL_V,
		totalAtLateralVelocity: K_TOTAL_AT_LATERAL_V,
		referenceLink: K_REFERENCE_LINK,
		referenceDiameter: DEFAULTS.lateralDiameter
	};
	EngCalcs.lpnFireFlowIsoCap = ISO_SINGLE_HYDRANT_CAP;
	EngCalcs.lpnFireFlowPsiToHead = psiToHead;
	EngCalcs.lpnFireFlowGpmToSI = gpmToSI;
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
