// Looped Pipe Network -- optional solve through the REAL EPANET engine (ROADMAP Task 243).
//
// WHY THIS EXISTS. js/lpn-solver.js already agrees with EPANET to 0.0002 ft of head and 0.004
// gpm of flow on EPA's own Net1/Net2/Net3 (see dev/lpn-spike/), so this buys no correctness. It
// buys two things: for some agencies "does it run the actual EPANET engine?" is a yes/no
// procurement gate, and it is the door to tanks, valves, extended-period simulation and .inp
// interop we would otherwise hand-write.
//
// VALVES ARE THE FIRST FEATURE THIS PAGE HAS THAT THE ENGINE TOGGLE DOES NOT MERELY ACCELERATE.
// A throttle valve (TCV) is a minor loss and solves in either engine. A PRV, PSV or FCV switches
// its own state during the solve, and that is numerics we deliberately did not write a second
// copy of -- so a network containing one is SOLVED HERE whatever the user's engine preference
// says, and js/lpn-solver.js refuses it by name if this module cannot be reached. See the note
// on EngCalcs.lpnValveIsNative there for the reasoning and the measurement behind it.
//
// THE NATIVE SOLVER IS THE DEFAULT, AND NOT FOR SPEED -- EPANET IS FASTER. Measured by
// dev/lpn-spike/engine-bench.js:
//
//   21 nodes    native 0.43 ms    EPANET's actual SOLVE 0.05 ms     -- EPANET ~9x faster
//   201 nodes   native 36.3 ms    EPANET's actual SOLVE 0.78 ms     -- EPANET ~46x faster
//
// The C engine beats a JavaScript dense Cholesky and degrades gracefully where ours is O(n^3).
// The honest cost of choosing EPANET is the ONE-TIME module load: 663 KB to fetch (236 KB
// gzipped) and ~33 ms to import and instantiate in Node. That is a real cost for the
// offline/low-bandwidth case this suite cares about, and it is the whole of the case for keeping
// a native solver at all. It is not a speed argument, and must not be written up as one.
//
// MEASURE THE EXPORTED FUNCTION END TO END before believing any decomposition of its cost. Two
// separate benches of this file went wrong by hoisting setup out of their own timing loop, so
// they measured a shape the shipped code never had and blamed the .inp parse for time that
// belonged to WASM instantiation.
//
// LICENSING. js/vendor/epanet-js.js is epanet-js 0.9.0, MIT, (c) Luke Butler, wrapping
// OWA-EPANET (also MIT). MIT is GPL-3-compatible, so this suite stays GPL v3+. The full
// licence text is js/vendor/epanet-js.LICENSE and must ship with any redistribution.
// NOTE the name collision that caused real confusion when this was scoped: the epanetjs.com
// WEB APP is FSL-1.1-MIT (not FLOSS today, MIT after two years) and is a different thing from
// this MIT toolkit. We use the toolkit. We have never read the app's source.
//
// UNITS. lpn-solver.js is SI throughout: Q in m3/s, heads/lengths/diameters in m. EPANET's
// LPS unit set is metric but NOT the same metric: flow in L/s, diameter in MILLIMETRES, and
// everything else in m. Every conversion in this file exists for that mismatch, and getting
// one wrong is silent -- a 0.15 m pipe written as "0.15" is read as 0.15 mm and the network
// still solves, just absurdly. That is why validate_epanet.js compares against the native
// solver rather than eyeballing output.

(function (root) {
	'use strict';

	var EngCalcs = root.EngCalcs = root.EngCalcs || {};

	// EPANET headloss formula keyword per our method code. All three of ours map to a
	// native EPANET formula -- Chezy-Manning is the one people forget EPANET has.
	var HEADLOSS = { hw: 'H-W', dw: 'D-W', manning: 'C-M' };

	// EPANET node/link property codes we read back. These are the toolkit's own enum values;
	// spelled out here so a reader does not have to trust a magic number.
	var EN_ELEVATION = 0,
		EN_EMITTER = 3,
		EN_HEAD = 10,
		EN_PRESSURE = 11,
		// The node's water-quality value at the moment the quality clock is standing on. What it
		// MEANS is whatever [OPTIONS] Quality asked for: HOURS for water age, PERCENT for a source
		// share. EPANET reports both through this one property, which is why the caller has to know
		// which analysis it asked for -- the number carries no unit with it.
		EN_QUALITY = 12,
		EN_FLOW = 8,
		EN_VELOCITY = 9,
		EN_HEADLOSS = 10,
		EN_INITSTATUS = 4,
		// Link properties a VALVE needs and a pipe does not. EN_DIAMETER is shared with a pipe
		// but reached separately here, because setPipeData() is not valid on a valve index.
		EN_DIAMETER = 0,
		EN_INITSETTING = 5;

	// **THE STATISTICS AND OPTIONS THAT SAY WHETHER THE RUN CONVERGED** (ROADMAP Task 565).
	// EN_AnalysisStatistic on the left, EN_Option on the right; both are the toolkit's own enum
	// values and both were verified against the vendored engine before this code was written.
	var EN_STAT_ITERATIONS = 0,
		EN_STAT_RELATIVEERROR = 1,
		EN_STAT_MAXHEADERROR = 2,
		EN_STAT_MAXFLOWCHANGE = 3,
		EN_OPT_ACCURACY = 1,
		EN_OPT_HEADERROR = 5,
		EN_OPT_FLOWCHANGE = 6;

	/**
	 * **DID THIS HYDRAULIC STEP ACTUALLY CONVERGE?** ROADMAP Task 565.
	 *
	 * Until this existed, both success sites in this file returned `converged: true` HARDCODED and
	 * the steady site threw `runH()`'s return away. EPANET reports an unbalanced system as a
	 * WARNING, not an error: the run completes and hands back the last iterate. The vendored
	 * wrapper's `_checkError()` prints any code under 100 to `console.warn` and returns, so
	 * nothing throws, nothing rejects, and the page drew a plausible answer nobody had checked.
	 * Measured on Net3 with `Trials 1`: node 10's head came back 47.05 m against the converged
	 * 50.35 m, and the page said it converged.
	 *
	 * **THE TEST IS EPANET'S OWN, not a tolerance of ours.** The engine stops when the relative
	 * flow-change error is within Accuracy AND, where a limit is set, the maximum head error and
	 * maximum flow change are within theirs. All six numbers are readable after `runH()` through
	 * `EN_getstatistic`/`EN_getoption`, which is the documented way to ask and the only one the
	 * wrapper exposes -- it swallows the warning code itself.
	 *
	 * **READ THE ACCURACY BACK FROM THE ENGINE RATHER THAN FROM `model.hydraulics`**, because
	 * EPANET CLAMPS IT to [1e-5, 1e-1] on input. Comparing against what we asked for would call
	 * every run unconverged the moment somebody asked for 1e-8. Measured: we wrote `Accuracy 1e-8`
	 * and `getOption(EN_OPT_ACCURACY)` answered 1e-5.
	 *
	 * A build too old for a statistic is the one case that must not turn into a false alarm: an
	 * engine that cannot answer the question has not said no, so it is reported as UNKNOWN
	 * (`converged: null`) and the caller decides. Nothing in the vendored build takes that path.
	 */
	function convergenceOf(p) {
		var relErr, iterations, maxHeadErr, maxFlowChg, accuracy, headLimit, flowLimit;
		try {
			iterations = p.getStatistic(EN_STAT_ITERATIONS);
			relErr = p.getStatistic(EN_STAT_RELATIVEERROR);
			maxHeadErr = p.getStatistic(EN_STAT_MAXHEADERROR);
			maxFlowChg = p.getStatistic(EN_STAT_MAXFLOWCHANGE);
			accuracy = p.getOption(EN_OPT_ACCURACY);
			headLimit = p.getOption(EN_OPT_HEADERROR);
			flowLimit = p.getOption(EN_OPT_FLOWCHANGE);
		} catch (e) {
			return { converged: null, iterations: null, relativeError: null, accuracy: null };
		}
		var ok = relErr <= accuracy
			&& (!(headLimit > 0) || maxHeadErr <= headLimit)
			&& (!(flowLimit > 0) || maxFlowChg <= flowLimit);
		return {
			converged: ok,
			iterations: iterations,
			relativeError: relErr,
			accuracy: accuracy,
			maxHeadError: maxHeadErr,
			maxFlowChange: maxFlowChg
		};
	}

	/**
	 * Roughness as EPANET wants it for the chosen formula.
	 *   H-W  -> Hazen-Williams C, dimensionless, same number we hold.
	 *   D-W  -> absolute roughness in MILLIMETRES; we hold metres.
	 *   C-M  -> Manning n, dimensionless, same number we hold.
	 */
	function roughnessFor(method, link) {
		if (method === 'dw') { return (link.roughness || 0) * 1000; }
		return link.roughness;
	}

	/**
	 * Build an EPANET .inp for a model in this suite's SI convention.
	 *
	 * Exported (not private) because it is independently useful: it is most of what Task 196
	 * needs for .inp export, and it is the piece a reader should be able to eyeball.
	 */
	EngCalcs.lpnToInp = function (model, options) {
		// `options.eps` asks for the EXTENDED-PERIOD form of the same network (Task 248): the clock,
		// the patterns and the controls are written out and EPANET runs its own time loop. Without it
		// this writes exactly what it always wrote -- one instant, demands already multiplied.
		var eps = !!(options && options.eps) && !!model.time,
			time = eps ? model.time : null,
			method = model.method || 'hw',
			headloss = HEADLOSS[method] || 'H-W',
			emitterExp = model.emitterExponent || 0.5,
			// The project's own [OPTIONS], sparse: a key is here only where a file stated it or a
			// person typed it, so `undefined` means "leave EPANET's default alone" (Task 553).
			hyd = model.hydraulics || {},
			junctions = [],
			reservoirs = [],
			tanks = [],
			pipes = [],
			pumps = [],
			valves = [],
			statuses = [],
			curves = [],
			emitters = [],
			demands = [],
			// **THE TWO WATER-QUALITY SECTIONS A CHEMICAL RUN NEEDS** (Task 566). Written only for
			// a chemical: an age or a source-share run has no species to start anywhere and no
			// reaction to apply, and stating either would be handing EPANET input for an analysis
			// nobody asked for.
			initQuality = [],
			reactionRows = [],
			warnings = [],
			i, n, k, link;

		for (i = 0; i < model.nodes.length; i++) {
			n = model.nodes[i];
			if (n.type === 'reservoir') {
				// EPANET reservoirs carry a total head, which is exactly what we store.
				// **UNDER `eps` THE HEAD IS THE BASE HEAD AND THE PATTERN IS NAMED BESIDE IT**
				// (Task 248.02), for the same reason a junction's demand is written that way twenty
				// lines down: EPANET multiplies Head by Pattern on its own clock, so writing the
				// t=0 head under a pattern would apply the first multiplier twice.
				reservoirs.push(' ' + n.id + '  ' +
					(eps && n.headBase !== undefined ? n.headBase : (n.head || 0)) +
					(eps && n.headPattern ? '  ' + n.headPattern : ''));
			} else if (n.type === 'tank') {
				// [TANKS] is  ID  Elev  InitLvl  MinLvl  MaxLvl  Diam  MinVol  [VolCurve].
				//
				// EVERY ONE OF THESE IS IN THE LENGTH UNIT, INCLUDING THE DIAMETER -- metres under
				// LPS. That is NOT the rule for a pipe, whose diameter is in millimetres in the
				// same file (see roughnessFor() and the [PIPES] writer below), and mixing the two
				// up is the exact silent failure this file's header warns about: a 20 m tank
				// written as 20000 still solves, it just holds a thousand times the water.
				//
				// MinVol is written as 0 and no VolCurve is written, because this page has neither.
				// 0 means "no separate minimum volume", which is EPANET's own default, not a
				// stand-in for missing data. A non-cylindrical tank imported from a file with a
				// volume curve is reported as a difference rather than faked (js/lpn-inp.js).
				tanks.push(' ' + n.id + '  ' + (n.elev || 0) + '  ' + (n.level || 0) + '  ' +
					(n.minLevel || 0) + '  ' + (n.maxLevel || 0) + '  ' + (n.diameter || 0) + '  0');
			} else {
				// Demand m3/s -> L/s.
				// **UNDER `eps` THE DEMAND IS THE BASE DEMAND AND THE PATTERN IS NAMED BESIDE IT**, so
				// EPANET applies the multiplier on its own clock. Written the ordinary way instead, the
				// t=0 multiplier would be baked in and then multiplied AGAIN at every step -- 1.34 squared
				// at the start of Net3, and a run that looks like a run.
				// **AND A JUNCTION WITH DEMAND CATEGORIES GOES OUT AS [DEMANDS] ROWS** (Task 468),
				// under `eps` only, for exactly the reason above: two categories on two patterns are
				// two daily shapes, and one base times one pattern cannot state them. [DEMANDS]
				// REPLACES the [JUNCTIONS] column rather than adding to it, so the column is left
				// off entirely -- EPANET's own writer's layout. A ONE-INSTANT solve needs none of
				// it: `n.demand` is already the sum at the moment on the clock.
				if (eps && n.demands && n.demands.length) {
					junctions.push(' ' + n.id + '  ' + (n.elev || 0));
					for (var di = 0; di < n.demands.length; di++) {
						demands.push(' ' + n.id + '  ' + (n.demands[di].base || 0) * 1000 +
							(n.demands[di].pattern ? '  ' + n.demands[di].pattern : ''));
					}
				} else {
					junctions.push(' ' + n.id + '  ' + (n.elev || 0) + '  ' +
						(eps && n.demandBase !== undefined ? n.demandBase : (n.demand || 0)) * 1000 +
						(eps && n.demandPattern ? '  ' + n.demandPattern : ''));
				}
				if (n.emitter > 0) {
					// Our emitter is Q = C (H - z)^gamma with Q in m3/s and head in m.
					// EPANET's is the same law in FLOW UNITS per (pressure unit)^gamma, and in
					// LPS the pressure unit is m, so only the flow scale changes.
					emitters.push(' ' + n.id + '  ' + n.emitter * 1000);
				}
			}
		}

		for (k = 0; k < model.links.length; k++) {
			link = model.links[k];
			if (link.type === 'valve') {
				// [VALVES] is  ID  Node1  Node2  Diameter  Type  Setting  [MinorLoss].
				//
				// TWO DIFFERENT UNIT TRAPS SIT ON ONE ROW, and neither one can be caught by
				// comparing engines -- both produce a network that solves perfectly, just not the
				// network the user drew:
				//
				//   DIAMETER is in the PIPE diameter unit -- MILLIMETRES under LPS. That is the
				//   OPPOSITE of a tank's diameter twenty lines up, which is in metres. Same word,
				//   three units, one file. It is only read through the minor-loss term (k V^2/2g),
				//   so a 200 mm valve written as "0.2" is read as 0.2 mm and develops an
				//   astronomically large loss -- which at least shows. Written the other way, a
				//   valve on a network with a small k barely moves and the error hides.
				//
				//   SETTING MEANS A DIFFERENT QUANTITY PER TYPE, and this is the one with no
				//   symptom at all:
				//     PRV/PSV  a PRESSURE   -> LPS pressure unit is METRES of water, which is what
				//                             this suite stores, so it passes through unscaled.
				//     PBV      a PRESSURE DROP, the same unit as a PRV's setting and unscaled with it.
				//     FCV      a FLOW       -> m3/s to L/s, x1000, same as a junction demand.
				//     TCV      a LOSS COEFFICIENT, dimensionless, unscaled.
				//     GPV      a CURVE ID, not a number at all -- see below.
				//   dev/lpn-spike/valve-harness.js round-trips them through the text, because
				//   validate_epanet.js cannot: it compares two engines reading the SAME .inp, so a
				//   setting written in the wrong unit is wrong identically on both sides.
				var vt = (link.valveType || 'TCV').toUpperCase(),
					setting = link.setting || 0;
				if (vt === 'FCV') { setting = setting * 1000; }
				// **A GPV'S "SETTING" IS THE NAME OF A HEAD-LOSS CURVE.** Its points are (flow,
				// head loss) rather than a pump's (flow, head), and they belong to this valve --
				// which is exactly the shape Task 248.04 says a curve should have here: owned by
				// one element and named after it, with no separate curve library to manage.
				//
				// A GPV WITH NO POINTS CANNOT BE WRITTEN. EPANET rejects a GPV naming a curve that
				// does not exist, so an empty one becomes a plain throttle at zero loss -- an open
				// connection, reported, exactly as a pump with no curve does.
				if (vt === 'GPV') {
					var gpts = (link.curvePoints || []).filter(function (q) {
						return q && q[0] !== undefined && q[1] !== undefined;
					});
					if (!gpts.length) {
						warnings.push({ code: 'gpv-no-curve-as-open', ids: [link.id] });
						vt = 'TCV';
						setting = 0;
					} else {
						var gname = 'G_' + link.id, grows = [], gi;
						for (gi = 0; gi < gpts.length; gi++) {
							// m3/s -> L/s on the flow, head loss already in metres.
							grows.push(' ' + gname + '  ' + (gpts[gi][0] * 1000) + '  ' + gpts[gi][1]);
						}
						curves.push(grows.join('\n'));
						setting = gname;
					}
				}
				valves.push(' ' + link.id + '  ' + link.from + '  ' + link.to + '  ' +
					(link.diameter * 1000) + '  ' + vt + '  ' + setting + '  ' +
					// A TCV's minor-loss column is IGNORED by EPANET (measured -- see
					// EngCalcs.lpnLinkK), so writing anything but 0 there would be a number the
					// file states and the engine discards. Every other type applies it while the
					// valve is fully open, so it is written.
					(vt === 'TCV' ? 0 : (link.k || 0)));
				// A VALVE HAS NO STATUS COLUMN of its own -- unlike a pipe, whose Open/Closed is
				// the eighth token on its own row. A closed valve is stated in [STATUS] instead,
				// which is why that section exists below and did not before.
				if (link.status === 'closed') { statuses.push(' ' + link.id + '  Closed'); }
			} else if (link.type === 'pump') {
				// **UNDER `eps` THE CURVE IS THE UNSCALED ONE AND THE SPEED IS NAMED BESIDE IT**
				// (Task 248.02). EPANET applies SPEED and its PATTERN to the curve itself, so
				// sampling the already-scaled curve here and then stating the speed as well would
				// apply the multiplier twice -- the pump-curve twin of the demand trap below.
				// The STATUS is the document's for the same reason: assembleModel() closes a pump
				// whose schedule reads 0 at this instant, and that is a fact about the instant.
				var pumpEps = eps && link.h0Base !== undefined,
					ph0 = pumpEps ? link.h0Base : link.h0,
					pa = pumpEps ? link.aBase : link.a,
					pStatus = (eps && link.statusBase !== undefined) ? link.statusBase : link.status;
				if (ph0 > 0 || pa > 0) {
					// Our curve is H = h0 - a Q^b, and EPANET fits exactly that form to a 3-point
					// HEAD curve -- so three points sampled off our own curve round-trip it
					// rather than approximating it, PROVIDED the first sample sits at Q = 0.
					//
					// THE FIRST POINT MUST BE THE SHUTOFF POINT (Q = 0). This is not a preference
					// and it is not documented anywhere obvious; without it EPANET fits a DIFFERENT
					// curve through the samples and the pump quietly delivers less head, which
					// reads as extra loss. Measured across four samplings: [0, .5, .9] and
					// [0, .6, .95] reproduce our curve to 0.0000 m; [.25, .5, .75] is off by
					// 0.40 m and [.1, .5, .9] by 1.60 m. Anything whose first point has Q > 0 is
					// wrong. dev/lpn-spike/validate_epanet.js carries a pump case so this cannot
					// regress unnoticed.
					var qMax = Math.pow(ph0 / pa, 1 / link.b),
						pts = [0, 0.5, 0.9],
						cname = 'C_' + link.id,
						rows = [],
						j, q, h;
					for (j = 0; j < pts.length; j++) {
						q = qMax * pts[j];
						h = ph0 - pa * Math.pow(q, link.b);
						rows.push(' ' + cname + '  ' + (q * 1000) + '  ' + h);
					}
					curves.push(rows.join('\n'));
					// SPEED then PATTERN, and each only when the pump states one: a speed of 1 is
					// EPANET's own default, so writing it would put a column in the file that says
					// nothing. Both are dimensionless and cross unconverted.
					// SPEED, or PATTERN, and never both: EPANET DISCARDS the speed of a pump that
					// also names a pattern and uses the multiplier as the speed itself (measured --
					// dev/lpn-spike/pattern-attach-harness.js). Writing both would state a number
					// the engine throws away, which is the same rule as a TCV's minor-loss column
					// above. Both are dimensionless and cross unconverted.
					pumps.push(' ' + link.id + '  ' + link.from + '  ' + link.to + '  HEAD ' + cname +
						(pumpEps && link.speedPattern ? '  PATTERN ' + link.speedPattern :
							(pumpEps && link.speed !== undefined && link.speed !== 1 ? '  SPEED ' + link.speed : '')));
					// **A PUMP HAS NO STATUS COLUMN EITHER**, exactly like a valve, so a closed one is
					// stated in [STATUS] or it is written open. pushValues() writes EN_INITSTATUS over the
					// top, which hid this for as long as every solve went through the warm path; an
					// extended-period run opens a Project from the text alone, and Net3's pump 10 -- closed
					// until its own control opens it at 1:00 -- came out 96 ft wrong at midnight.
					if (pStatus === 'closed') { statuses.push(' ' + link.id + '  Closed'); }
				} else {
					// A pump with NO curve is our own concept: a lossless connection, the state
					// every freshly drawn pump is in. EPANET has no such element, so it becomes a
					// short, very wide, very smooth pipe -- head loss below solver tolerance.
					// This is an APPROXIMATION and the only one in this file; it is reported so
					// the UI can say so rather than quietly diverging from the native solver.
					pipes.push(' ' + link.id + '  ' + link.from + '  ' + link.to +
						'  0.01  1000  ' + (method === 'dw' ? '0.0000015' : (method === 'manning' ? '0.008' : '150')) +
						'  0  ' + (link.status === 'closed' ? 'Closed' : 'Open'));
					warnings.push({ code: 'pump-no-curve-as-pipe', ids: [link.id] });
				}
			} else {
				// length m, diameter m -> mm, minor-loss coefficient dimensionless.
				pipes.push(' ' + link.id + '  ' + link.from + '  ' + link.to + '  ' +
					link.length + '  ' + (link.diameter * 1000) + '  ' +
					roughnessFor(method, link) + '  ' + (link.k || 0) + '  ' +
					(link.status === 'closed' ? 'Closed' : 'Open'));
			}
		}

		// MANNING IS THE ONE METHOD WHERE THE TWO ENGINES GENUINELY DISAGREE, by about 0.6%,
		// and the user is told rather than left to notice. Measured over an 8x diameter range
		// (0.1 m to 0.8 m): EPANET's Chezy-Manning head loss is 0.9939 to 0.9944 of ours, i.e. a
		// near-constant factor, NOT a truncated 16/3 exponent (that hypothesis predicts 0.9924 to
		// 0.9993 and the data refute it). Our resistance is the exact derivation from
		// V = (1/n)R^(2/3) with R = d/4, giving 10.2936; EPANET's implies 10.231.
		//
		// WE DO NOT ADOPT EPANET'S NUMBER HERE, unlike on Hazen-Williams. Two reasons, both
		// stronger than interop: ours is the exact form and EPANET's is rounded, and Manning's n
		// is shared with Manning-Pipe-Flow,
		// Manning-Pipe-Head-Loss and Manning-Trap -- the calculators carrying the large
		// majority of this suite's users. Matching EPANET on this page would make it disagree
		// with those, which is a far worse outcome than a 0.6% delta on an opt-in toggle.
		if (method === 'manning') {
			warnings.push({ code: 'manning-constant-differs', ids: [] });
		}

		// MINOR LOSSES ARE THE SECOND DECLARED DISAGREEMENT, and it is the same shape as Manning:
		// EPANET's constant is the rounded one and we are not adopting it.
		//
		// A minor loss is k V^2 / 2g, so g is the whole of the coefficient. EPANET's g is
		// 32.2 ft/s^2 = 9.81456; ours is standard gravity, 9.80665. Ours are therefore 0.081%
		// LARGER, per pipe, and it accumulates along a path -- which is how it is noticed: Tom,
		// 2026-08-17, saw 0.003 psi build up with distance from the source on Elm Street Center,
		// where every pipe carries k = 2. Measured by differencing two k values on one pipe so
		// friction cancels (dev/lpn-spike/minor-loss-gravity-harness.js): implied g, ours 9.80665,
		// EPANET 9.815822 -- 32.2 ft/s^2 plus EPANET's own rounded 28.317 L/s per cfs.
		//
		// FRICTION IS NOT AFFECTED and must not be blamed for this: our Hazen-Williams reproduces
		// EPANET's own 4.727 equation to 6.7e-16, and EPANET's answer is 1.0e-5 LOW against that
		// equation from the same L/s-per-cfs rounding. Only the minor-loss term carries g.
		//
		// Announced only when there is a minor loss to announce, so a network without one says
		// nothing. Raised in valueWarnings() rather than here, because it is a fact about CURRENT
		// VALUES and must not be cached on the session -- see that function and Task 526.

		// ---- the clock, written only for an extended-period run (Task 248) ----
		//
		// Every number below is already SI when it arrives, so the conversions are the SAME ones the
		// rest of this file makes, for the same reason: LPS is metric but not our metric. A pattern
		// multiplier is dimensionless and passes straight through; a control's threshold is a head
		// or a pressure, both METRES under LPS; a control's setting means whatever the link says it
		// means, and only an FCV's flow is scaled.
		var patternRows = [], controlRows = [], timeRows = [];
		if (eps) {
			(time.patterns || []).forEach(function (pat) {
				var mults = pat.multipliers || [], q, row;
				// Six per line, EPANET's own layout: the id repeats and the values concatenate.
				for (q = 0; q < mults.length; q += 6) {
					row = ' ' + pat.id;
					for (var z = q; z < Math.min(q + 6, mults.length); z++) { row += '  ' + mults[z]; }
					patternRows.push(row);
				}
			});
			// **A CONTROL IS COMPOSED FROM THE RECORD, NEVER COPIED FROM ITS `raw` LINE.** The raw
			// line states its numbers in the FILE's units -- Net3's `Link 335 OPEN IF Node 1 BELOW
			// 17.1` is 17.1 FEET -- and this file is LPS. Copied through, that tank would switch its
			// pump at 17.1 metres, which is above its own maximum level, so the pump never starts and
			// the run is quietly wrong rather than visibly broken.
			(time.controls || []).forEach(function (c) {
				var line, act = c.action || {}, cond = c.condition;
				if (!cond) { return; }
				if (act.status) { line = ' LINK ' + c.link + ' ' + (act.status === 'closed' ? 'CLOSED' : 'OPEN'); }
				else if (isFinite(act.setting)) {
					line = ' LINK ' + c.link + ' ' +
						(act.settingUnit === 'flow' ? act.setting * 1000 : act.setting);
				} else { return; }
				if (cond.kind === 'node') {
					line += ' IF NODE ' + cond.node + ' ' + (cond.cmp === 'above' ? 'ABOVE' : 'BELOW') +
						' ' + cond.value;
				} else if (cond.kind === 'time') {
					line += ' AT TIME ' + EngCalcs.lpnFormatTime(cond.seconds);
				} else if (cond.kind === 'clocktime') {
					line += ' AT CLOCKTIME ' + EngCalcs.lpnFormatTime(cond.seconds);
				} else { return; }
				controlRows.push(line);
			});
			// H:MM rather than a bare number, because a BARE NUMBER IN [TIMES] IS HOURS -- writing
			// 86400 for a one-day duration asks EPANET for a ten-year run.
			[['Duration', 'duration'], ['Hydraulic Timestep', 'hydraulicStep'],
				['Pattern Timestep', 'patternStep'], ['Pattern Start', 'patternStart'],
				['Report Timestep', 'reportStep'], ['Report Start', 'reportStart'],
				['Start ClockTime', 'startClock']].forEach(function (pair) {
				timeRows.push(' ' + pair[0] + '  ' + EngCalcs.lpnFormatTime(time.times[pair[1]] || 0));
			});
			// **THE QUALITY TIME STEP, ONLY WHERE THE DOCUMENT STATES ONE.** Absent it, EPANET uses
			// its own default (a tenth of the hydraulic step), which is the right answer for a
			// network nobody has said anything about -- and stating a made-up number here would put
			// this bridge's opinion in front of the engine's. Net3 states 0:05 and its published
			// report is worked out at that step, which is why reproducing that report needs it.
			if (time.times.qualityStep > 0) {
				timeRows.push(' Quality Timestep  ' + EngCalcs.lpnFormatTime(time.times.qualityStep));
			}
		}

		// **THE WATER-QUALITY ANALYSIS, AND ONLY THE TWO THIS PAGE ACTUALLY WORKS OUT.**
		// `model.quality` is the document's interpreted setting (js/lpn-inp.js's lpnQualityParse);
		// mode 'age' and mode 'trace' are written here and run, and mode 'chemical' is NOT --
		// a reacting chemical needs [REACTIONS], [SOURCES] and [MIXING], which this bridge does not
		// write, so stating `Quality Chlorine mg/L` would ask EPANET for an analysis whose inputs
		// are all missing and get a plausible column of zeros back. Carried text stays carried text.
		//
		// A TRACE WITH NO SOURCE NAMED IS NOT WRITTEN either: EPANET rejects the file over an
		// unknown trace node, and refusing the whole network is a far worse answer than leaving the
		// quality column empty until the user picks one.
		var qual = model.quality || {}, qualMode = qual.mode, qualLine = '';
		if (qualMode === 'age') { qualLine = 'AGE'; }
		else if (qualMode === 'trace' && qual.traceNode) { qualLine = 'TRACE ' + qual.traceNode; }
		else if (qualMode === 'chemical') {
			// **THE CHEMICAL'S NAME AND ITS UNITS ARE THE USER'S OWN TEXT, PASSED THROUGH.**
			// `Chlorine mg/L` is a name and a unit label, and EPANET converts neither -- a
			// concentration is transported and reacted in whatever units its sources and its
			// coefficients are stated in, so there is no factor to get wrong and none to invent.
			// A document that names nothing gets EPANET's own default, exactly as every other
			// unstated option here does.
			qualLine = String(qual.chemical || 'CHEMICAL');
		}
		// **[QUALITY] -- WHAT EACH NODE STARTS THE RUN HOLDING, AND FOR A RESERVOIR WHAT IT HOLDS
		// FOR EVER.** This is how a chemical gets into the network at all; the booster kind,
		// [SOURCES], is still carried and not read (dev/water-quality.md).
		//
		// **NOT CONVERTED, AND THAT IS NOT AN OMISSION.** See the note on the Quality line above:
		// a concentration has no factor on either side of this boundary.
		if (qualMode === 'chemical') {
			for (i = 0; i < model.nodes.length; i++) {
				n = model.nodes[i];
				if (typeof n.initQuality === 'number' && isFinite(n.initQuality) && n.initQuality !== 0) {
					initQuality.push(' ' + n.id + '  ' + n.initQuality);
				}
			}
			// **[REACTIONS], FROM THE MODEL'S OWN RECORD.** Every number here is already at the
			// engine's boundary: js/looped-network.js's engineQuality() has converted the WALL
			// coefficients out of the project's length unit into metres, on a clone, because this
			// writer emits an LPS-and-metres file always. That is the same defect `HeadError`
			// had -- a coefficient stated in ft/day arriving as m/day is wrong by 3.28 in the one
			// term that decides how much chlorine is left.
			var react = model.reactions || {};
			[['orderBulk', 'Order Bulk'], ['orderTank', 'Order Tank'], ['orderWall', 'Order Wall'],
				['globalBulk', 'Global Bulk'], ['globalWall', 'Global Wall'],
				['limitingPotential', 'Limiting Potential'],
				['roughnessCorrelation', 'Roughness Correlation']].forEach(function (pair) {
				if (typeof react[pair[0]] !== 'number' || !isFinite(react[pair[0]])) { return; }
				reactionRows.push(' ' + pair[1] + '  ' + react[pair[0]]);
			});
			[['bulk', 'BULK'], ['wall', 'WALL'], ['tank', 'TANK']].forEach(function (pair) {
				var m2 = react[pair[0]] || {};
				Object.keys(m2).forEach(function (id) {
					if (typeof m2[id] !== 'number' || !isFinite(m2[id])) { return; }
					reactionRows.push(' ' + pair[1] + '  ' + id + '  ' + m2[id]);
				});
			});
		}

		var inp = '[TITLE]\nEngCalcs looped network\n\n' +
			'[JUNCTIONS]\n' + junctions.join('\n') + '\n\n' +
			'[RESERVOIRS]\n' + reservoirs.join('\n') + '\n\n' +
			(tanks.length ? '[TANKS]\n' + tanks.join('\n') + '\n\n' : '') +
			(pipes.length ? '[PIPES]\n' + pipes.join('\n') + '\n\n' : '') +
			(pumps.length ? '[PUMPS]\n' + pumps.join('\n') + '\n\n' : '') +
			(valves.length ? '[VALVES]\n' + valves.join('\n') + '\n\n' : '') +
			(curves.length ? '[CURVES]\n' + curves.join('\n') + '\n\n' : '') +
			(demands.length ? '[DEMANDS]\n' + demands.join('\n') + '\n\n' : '') +
			(emitters.length ? '[EMITTERS]\n' + emitters.join('\n') + '\n\n' : '') +
			// After [VALVES] and [PUMPS], because a [STATUS] line names a link that must already
			// have been declared.
			(statuses.length ? '[STATUS]\n' + statuses.join('\n') + '\n\n' : '') +
			(patternRows.length ? '[PATTERNS]\n' + patternRows.join('\n') + '\n\n' : '') +
			// After the links a control names, and after the patterns -- EPANET's own order.
			(controlRows.length ? '[CONTROLS]\n' + controlRows.join('\n') + '\n\n' : '') +
			// **[RULES] IS DELIBERATELY NOT WRITTEN HERE, AND THE REASON IS UNITS** (Task 248.03).
			//
			// It was, for about an hour, on the reasonable-sounding argument that this page does not
			// model a rule and the engine does, so handing the text through would make a rule-driven
			// network solve correctly. `dev/lpn-spike/rules-carry-harness.js` measured it and it is
			// false: **this writer emits LPS and METRES always**, and a rule's numbers are in the
			// units of the file the user opened. `IF TANK T1 LEVEL ABOVE 20` means 20 FEET in a GPM
			// file, and arrives here beside a tank whose level is 7.62 -- so the rule never fires,
			// and a rule that DID fire would fire at the wrong threshold. Every number on screen
			// would look reasonable, which is the exact shape of the two worst defects this project
			// has recorded.
			//
			// **CONVERTING THEM REQUIRES THE LANGUAGE**, which is the rest of Task 248.03: you
			// cannot scale a rule's numbers without knowing, per clause, whether the value is a
			// level, a pressure, a flow, a setting or a bare time. So this is not an oversight to be
			// patched with a factor -- it is why the parked half of that task is parked. The rules
			// are still CARRIED: `js/lpn-inp.js` keeps them and writes them back in the user's own
			// units, where verbatim text is exactly right.
			'' +
			(initQuality.length ? '[QUALITY]\n' + initQuality.join('\n') + '\n\n' : '') +
			(reactionRows.length ? '[REACTIONS]\n' + reactionRows.join('\n') + '\n\n' : '') +
			(timeRows.length ? '[TIMES]\n' + timeRows.join('\n') + '\n\n' : '') +
			'[OPTIONS]\n Units LPS\n Headloss ' + headloss +
			'\n Emitter Exponent ' + emitterExp +
			(qualLine ? '\n Quality ' + qualLine : '') +
			// **`Tolerance` IS THE PARCEL-MERGING TOLERANCE AND IT DOMINATES A CHEMICAL RUN'S
			// ACCURACY.** EPANET merges two adjacent parcels of water whose concentrations differ
			// by less than this, so a big one smears the whole profile: measured on the single-pipe
			// analytic case in dev/lpn-spike/reaction-anchor-harness.js, EPANET's own default of
			// 0.01 puts the answer up to 0.9% off the exact first-order decay and refuses to
			// converge as the quality step shrinks, where a tight one lands inside 0.01%.
			//
			// **THIS FILE USED TO SEND NEITHER**, on the reasoning that they mean something only to
			// a reacting chemical -- which was true while a chemical was carried and not run, and
			// is false now. Sent only for a chemical, and only where the document states one.
			((qualMode === 'chemical' && typeof qual.tolerance === 'number' && isFinite(qual.tolerance))
				? '\n Tolerance ' + qual.tolerance : '') +
			((qualMode === 'chemical' && typeof qual.diffusivity === 'number' && isFinite(qual.diffusivity))
				? '\n Diffusivity ' + qual.diffusivity : '') +
			// **THE FLUID, WHERE THE PROJECT NAMES IT** (Task 553). Written only when stated, so a
			// project that says nothing gets EPANET's own defaults exactly as it always did.
			// Viscosity here is EPANET's RELATIVE one, which is the form the option is stored in;
			// the native solver multiplies it into an absolute at assembleModel() instead.
			(hyd.viscosity !== undefined ? '\n Viscosity ' + hyd.viscosity : '') +
			(hyd.specificGravity !== undefined ? '\n Specific Gravity ' + hyd.specificGravity : '') +
			// **THE DEMAND MULTIPLIER IS WRITTEN ONLY ON THE EXTENDED-PERIOD PATH, AND THAT IS NOT AN
			// OMISSION.** On a one-instant run this bridge hands EPANET `n.demand`, which came out
			// of resolvedDemand() with the multiplier ALREADY IN IT; stating the option as well
			// would apply it twice. On an extended-period run it hands `demandBase` and the pattern
			// name and lets the engine do the multiplying, so there the option is the only thing
			// that can carry it. The same one-or-the-other rule assembleModel() states for the two
			// demand fields, seen from this end.
			(eps && hyd.demandMultiplier !== undefined ? '\n Demand Multiplier ' + hyd.demandMultiplier : '') +
			// **HOW HARD TO TRY, AND THE DEFAULTS HERE ARE OURS, NOT EPANET'S.** 1e-5 / 200 is
			// tighter than EPANET's own 0.001 / 40, deliberately, so that a disagreement between the
			// two engines is never just tolerance. A project that STATES a value overrules that --
			// the user asked for their file's number, and comparing engines is our concern, not
			// theirs.
			//
			// **THE DEFAULT WAS 1e-8 AND THAT WAS A FICTION** (Task 565): EPANET CLAMPS Accuracy to
			// [1e-5, 1e-1] as it reads the file, so every run this bridge has ever made was solved
			// at 1e-5 while this line claimed three more decades. Measured -- we wrote 1e-8,
			// `getOption(EN_OPT_ACCURACY)` answered 1e-5. Writing the number the engine will
			// actually honour changes no result and stops the comment being false. It is also why
			// convergenceOf() reads the accuracy back out of the engine rather than off `hyd`.
			//
			// `Unbalanced Continue 10` stays the fallback: refusing to report a network that did
			// not converge would give this page nothing to draw. **What changed is that the page
			// no longer PRETENDS it converged** -- convergenceOf() asks, applySolveResult() says so,
			// and the numbers are still drawn.
			'\n Accuracy ' + (hyd.accuracy !== undefined ? hyd.accuracy : '1e-5') +
			'\n Trials ' + (hyd.trials !== undefined ? hyd.trials : '200') +
			'\n Unbalanced ' + (hyd.unbalanced === 'stop' ? 'Stop'
				: hyd.unbalanced === 'continue'
					? 'Continue ' + (hyd.unbalancedTrials !== undefined ? hyd.unbalancedTrials : 10)
					: 'Continue 10') +
			// **THE TWO THAT CARRY UNITS.** This writer emits LPS and metres always, and the model
			// reaching it is already in SI -- so a head error goes out as it stands and a flow
			// change is scaled the same 1000 every other flow on this page is. The document's own
			// copy is in the project's units; assembleModel()'s engineHydraulics() is where the
			// conversion happens, for the same reason every other unit conversion is there.
			(hyd.headError !== undefined ? '\n HeadError ' + hyd.headError : '') +
			(hyd.flowChange !== undefined ? '\n FlowChange ' + hyd.flowChange * 1000 : '') +
			(hyd.dampLimit !== undefined ? '\n DampLimit ' + hyd.dampLimit : '') +
			(hyd.checkFreq !== undefined ? '\n CheckFreq ' + hyd.checkFreq : '') +
			(hyd.maxCheck !== undefined ? '\n MaxCheck ' + hyd.maxCheck : '') +
			'\n\n' +
			'[END]\n';

		// **THE TIME BLOCK'S OWN DROPS COME OUT HERE** (Task 466). EngCalcs.lpnTimeModelBlock throws
		// away a control naming an element that no longer exists -- it has to, EPANET rejects the
		// whole input over one of them -- and until now it did so silently. It has no channel of its
		// own to the status bar, and inventing a second one would give the page two places to look
		// for "what did we ignore"; this array is already that place, already carried on the solve
		// result, and already read by js/looped-network.js's applySolveResult(). So the block states
		// its drops as the same {code, ids} records lpnToInp states its own, and one message design
		// serves both.
		if (eps && Array.isArray(time.warnings) && time.warnings.length > 0) {
			warnings = warnings.concat(time.warnings);
		}

		// TWO LISTS, AND THE SPLIT IS THE WHOLE OF TASK 526. `signatureWarnings` are the ones that
		// cannot change while signatureOf(model) holds -- the method, which pumps have curves, which
		// controls were dropped -- so the session may cache them. `warnings` is what this build
		// actually warrants, signature-stable plus value-derived, and it is what every caller that
		// is not the warm session should read.
		return {
			inp: inp,
			warnings: warnings.concat(valueWarnings(model)),
			signatureWarnings: warnings
		};
	};

	/**
	 * The warnings that depend on VALUES rather than on shape, recomputed at every solve.
	 *
	 * There is one, and it is why this function exists (ROADMAP Task 526). The minor-loss gravity
	 * note is raised from `lpnLinkK(link) > 0` -- a number a setter can change without moving the
	 * signature one bit. Cached alongside the others it went stale in both directions, and the
	 * costly one is silent: ADDING a minor loss to a network that had none announced nothing, so a
	 * real difference between the two engines was never mentioned.
	 *
	 * `k` is read through the same lpnLinkK() the .inp writer uses, or the note would claim a
	 * difference on a throttle valve whose loss comes from its SETTING instead.
	 *
	 * The rule for anything added here: if a value edit can change the answer, it belongs in this
	 * function; if only the signature can, it belongs in the build.
	 */
	function valueWarnings(model) {
		var out = [], i;
		for (i = 0; i < model.links.length; i++) {
			if (EngCalcs.lpnLinkK(model.links[i]) > 0) {
				out.push({ code: 'minor-loss-gravity-differs', ids: [] });
				break;
			}
		}
		return out;
	}

	// Cached module promise -- the 664 KB import happens at most once per page.
	//
	// A FAILURE IS NOT CACHED, and that is the whole point of the catch below. Storing the promise
	// unconditionally means a single failed import -- being offline for one moment, a blocked
	// request, a flaky connection -- is remembered FOREVER: every later call gets the same rejected
	// promise back and EPANET stays dead for the rest of the page's life even after the network
	// returns. Nothing surfaces it, because the visible symptom is identical to "this network cannot
	// be solved here", which is a message we legitimately print. warmEpanetEngine() in
	// js/looped-network.js makes the first attempt happen early and in worse conditions than a solve
	// would, so caching its failure would be a permanent penalty for being briefly offline.
	var enginePromise = null;

	EngCalcs.lpnEpanetLoad = function (url) {
		if (enginePromise === null) {
			enginePromise = import(url || '/engcalcs/js/vendor/epanet-js.js').catch(function (err) {
				enginePromise = null;   // let the next caller try again
				throw err;
			});
		}
		return enginePromise;
	};

	// ------------------------------------------------------------------------------------------
	// KEEPING THE PROJECT OPEN ACROSS SOLVES.
	//
	// Measured by dev/lpn-spike/engine-bench.js, before this existed:
	//
	//   21 nodes     our .inp writer 0.01 ms    engine PARSE 1.18 ms    engine SOLVE 0.05 ms
	//   201 nodes    our .inp writer 0.26 ms    engine PARSE 1.68 ms    engine SOLVE 0.78 ms
	//
	// i.e. ~95% of the round trip was the engine re-reading a text file we had just re-written, on
	// a page that re-solves 300 ms after every keystroke. None of that cost was EPANET's.
	//
	// So a Project is opened once and kept, and an ordinary edit is pushed through the toolkit's
	// own setters (setJunctionData/setTankData/setPipeData/setNodeValue/setLinkValue/setCurve).
	//
	// THE FAILURE MODE THIS INTRODUCES, and why the split is DERIVED rather than declared. A stale
	// Project answers the OLD network with a perfectly converged, perfectly plausible set of
	// numbers -- no exception, no NaN, nothing on screen that looks wrong. The obvious design (let
	// the caller say "that was only a value edit") breaks silently the first time someone adds a
	// code path and forgets, and nothing would ever tell us. So the caller says NOTHING:
	// signatureOf() reduces the model to the things a setter CANNOT change -- which ids exist,
	// what type each one is, what each link connects, which pumps have a curve at all, the
	// friction method, the emitter exponent -- and any difference from the signature the open
	// Project was built from forces a full rebuild and reopen. A field added to the model in
	// future is therefore treated as a value (the cheap path) until someone puts it in the
	// signature; dev/lpn-spike/session-harness.js is what catches that being wrong, because it
	// mutation-tests the trigger instead of trusting it.
	//
	// Reopening costs 1.0-1.8 ms at this page's sizes and happens on discrete clicks -- placing an
	// element, deleting one, renaming an id, re-pointing a link, changing the friction method.
	// Nobody types those.
	//
	// UNITS ARE NOT IN THE SIGNATURE, ON PURPOSE. The model handed to this file is always SI
	// (js/looped-network.js's assembleModel() is the edge that converts), so a unit switch arrives
	// here as changed NUMBERS, and the value path is already right for it.
	var session = null;

	function isCurvedPump(link) {
		// Must stay identical to the test in lpnToInp's [PUMPS] writer: a pump with no curve is
		// written there as a short fat pipe, so it is a PIPE to every setter below. The two are
		// held together by dev/lpn-spike/session-harness.js, which parses lpnToInp's own output.
		return link.type === 'pump' && (link.h0 > 0 || link.a > 0);
	}

	/**
	 * Three points off our own pump curve, in EPANET's LPS units, the first at shutoff.
	 *
	 * DUPLICATES the sampling in lpnToInp's [CURVES] writer, and the duplication is deliberate
	 * rather than merely tolerated: lpnToInp is the exported, eyeball-able .inp writer and is not
	 * the place to hang a setter helper. The risk -- the two drifting apart, so a pump answers one
	 * way on the solve after a reopen and another way on the solve after a value edit -- is covered
	 * by session-harness.js, which parses [CURVES] out of lpnToInp and asserts these numbers equal
	 * it. The [0, 0.5, 0.9] sampling itself is load-bearing; see the long note in lpnToInp.
	 */
	function pumpCurvePoints(link) {
		var qMax = Math.pow(link.h0 / link.a, 1 / link.b),
			pts = [0, 0.5, 0.9],
			xs = [], ys = [], j, q;
		for (j = 0; j < pts.length; j++) {
			q = qMax * pts[j];
			xs.push(q * 1000);
			ys.push(link.h0 - link.a * Math.pow(q, link.b));
		}
		return { x: xs, y: ys };
	}

	/**
	 * Everything about a model that a setter cannot reach. Same string => the open Project is
	 * still the right shape and only values need pushing.
	 */
	function signatureOf(model) {
		var parts = [model.method || 'hw', model.emitterExponent || 0.5], i, n, l;
		// **EVERY `[OPTIONS]` VALUE IS IN THE SIGNATURE, AND IT HAS TO BE** (Task 553). These are
		// written into the `.inp` text and nothing pushes them afterwards -- there is no setter for
		// Accuracy or Viscosity the warm path could use. Left out, a person who changed Accuracy or
		// Specific gravity in Settings and pressed solve got the PREVIOUS session's options back,
		// silently and forever, because the network's SHAPE had not changed. Measured before this
		// line existed: fourteen different option sets on one four-pipe network returned the
		// identical head to the last bit, including `Trials 1 Unbalanced Stop`, which cannot
		// converge and must refuse.
		//
		// Sorted, because `hydraulics` is built by two different writers (the importer's own scan
		// order and the Settings box's) and key ORDER is not a fact about the network.
		var hyd = model.hydraulics || {};
		parts.push(Object.keys(hyd).sort().map(function (k) {
			return k + '=' + hyd[k];
		}).join(''));
		for (i = 0; i < model.nodes.length; i++) {
			n = model.nodes[i];
			parts.push('n' + n.id + '\u0001' + n.type);
		}
		for (i = 0; i < model.links.length; i++) {
			l = model.links[i];
			// isCurvedPump decides whether this link is a [PUMPS] row or a [PIPES] row, so a pump
			// gaining or losing its curve is a topology change even though nothing moved.
			// VALVE TYPE IS IN THE SIGNATURE, and it has to be. The setting of a PRV is a
			// pressure and the setting of an FCV is a flow, so retyping a valve changes what the
			// number beside it MEANS -- and, because lpnValveIsNative() sends the active types to
			// a different engine entirely, it can change which engine is answering. Pushing a new
			// type through a setter is not possible anyway: EPANET fixes a link's type when the
			// file is read.
			parts.push('l' + l.id + '\u0001' + l.type + '\u0001' + l.from + '\u0001' + l.to +
				'\u0001' + (isCurvedPump(l) ? 'c' : 'p') +
				'\u0001' + (l.type === 'valve' ? String(l.valveType || 'TCV').toUpperCase() : '') +
				// **A GPV'S CURVE IS IN THE SIGNATURE, AND IT HAS TO BE.** Every other valve's behaviour
				// is a SETTING, which the warm path pushes through setLinkValue on every solve. A GPV's
				// is a CURVE, and EPANET refuses to be controlled through the API at all for one (error
				// 207, "attempt to control CV/GPV link"), so pushValues() deliberately skips it. Nothing
				// else would then notice a curve the user edited, and the answer would silently be the
				// PREVIOUS curve's -- exactly the stale answer this signature exists to make impossible.
				// Measured before the fix: a curve steepened at every point still reported the old 6 m.
				'\u0001' + (l.type === 'valve' && String(l.valveType || '').toUpperCase() === 'GPV'
					? (l.curvePoints || []).map(function (q) { return q[0] + ',' + q[1]; }).join(';')
					: ''));
		}
		// U+0001 between fields and U+0002 between records, because an id is user-typed: with a
		// plain separator a node called "A|B" could forge another network's signature, and the
		// consequence of a signature COLLISION is precisely the silent stale answer above.
		return parts.join('\u0002');
	}

	function closeSession() {
		if (session && session.project) {
			try { session.project.close(); } catch (e) { /* already closed or torn down */ }
		}
		session = null;
	}

	// Build the .inp, hand EPANET a fresh Project, and cache everything that stays fixed for as
	// long as the signature holds: the index of every node, link and pump curve, and lpnToInp's
	// SIGNATURE warnings -- only those. The value-derived ones are recomputed at every solve by
	// valueWarnings(), because caching them here was Task 526's defect: the invariant this comment
	// used to claim ("a cached warning list can never go stale under a value edit") stopped being
	// true the day a warning was raised from a `k`.
	// THE WORKSPACE OUTLIVES THE PROJECT. A Workspace owns the instantiated WASM engine; a Project
	// is one network inside it. Building a new Workspace and calling loadModule() per solve costs
	// 8-9 ms of a ~10 ms solve -- five times more than the .inp parse. Keeping it means even a
	// TOPOLOGY click pays ~1.5 ms rather than ~10.
	var workspace = null, workspaceUrl;

	function workspaceFor(mod, moduleUrl) {
		if (workspace && workspaceUrl === moduleUrl) { return Promise.resolve(workspace); }
		var ws = new mod.Workspace();
		return Promise.resolve(ws.loadModule()).then(function () {
			workspace = ws;
			workspaceUrl = moduleUrl;
			return ws;
		});
	}

	function openSession(mod, model, sig, moduleUrl) {
		closeSession();
		var built = EngCalcs.lpnToInp(model);
		return workspaceFor(mod, moduleUrl).then(function (ws) {
			var p = new mod.Project(ws);
			ws.writeFile('net.inp', built.inp);
			p.open('net.inp', 'net.rpt', 'net.out');
			var s = {
				ws: ws, project: p, sig: sig, moduleUrl: moduleUrl || null,
				warnings: built.signatureWarnings, nodeIdx: {}, linkIdx: {}, curveIdx: {}
			}, i, n, l;
			for (i = 0; i < model.nodes.length; i++) {
				n = model.nodes[i];
				s.nodeIdx[n.id] = p.getNodeIndex(n.id);
			}
			for (i = 0; i < model.links.length; i++) {
				l = model.links[i];
				s.linkIdx[l.id] = p.getLinkIndex(l.id);
				if (isCurvedPump(l)) { s.curveIdx[l.id] = p.getCurveIndex('C_' + l.id); }
			}
			session = s;
			return s;
		});
	}

	// Push the model's numbers into an already-open Project. Every conversion here has to match
	// the corresponding one in lpnToInp exactly -- the same trap the writer has, and just as
	// silent: a diameter pushed in metres solves fine, for a pipe a thousand times too narrow.
	function pushValues(s, model) {
		var p = s.project, method = model.method || 'hw', i, n, l, idx, pts;
		for (i = 0; i < model.nodes.length; i++) {
			n = model.nodes[i];
			idx = s.nodeIdx[n.id];
			if (n.type === 'reservoir') {
				// EPANET keeps a reservoir's total head in its ELEVATION property -- there is no
				// separate head field -- which is why [RESERVOIRS] is written with head above.
				p.setNodeValue(idx, EN_ELEVATION, n.head || 0);
			} else if (n.type === 'tank') {
				// One call, because the checks EPANET runs are on the SET: pushing these one at a
				// time can transiently violate min <= level <= max and be rejected. All lengths in
				// metres under LPS, the vessel diameter included (see the [TANKS] note above).
				p.setTankData(idx, n.elev || 0, n.level || 0, n.minLevel || 0,
					n.maxLevel || 0, n.diameter || 0, 0, '');
			} else {
				// Demand m3/s -> L/s. Empty pattern id = no time pattern, matching the [JUNCTIONS]
				// rows (this page has no patterns).
				p.setJunctionData(idx, n.elev || 0, (n.demand || 0) * 1000, '');
				// Set the emitter EVERY time, including to 0. lpnToInp only writes an [EMITTERS]
				// row for a node that has one, so skipping the zero case would leave a node that
				// HAD an emitter and lost it still discharging -- a value edit that silently did
				// not take, which is the whole class of bug this section is trying not to create.
				p.setNodeValue(idx, EN_EMITTER, (n.emitter > 0 ? n.emitter * 1000 : 0));
			}
		}
		for (i = 0; i < model.links.length; i++) {
			l = model.links[i];
			idx = s.linkIdx[l.id];
			if (isCurvedPump(l)) {
				pts = pumpCurvePoints(l);
				p.setCurve(s.curveIdx[l.id], pts.x, pts.y);
			} else if (l.type === 'pump') {
				// Curveless pump: a stand-in pipe whose geometry lpnToInp fixes from the method,
				// and the method is in the signature. Only its status can change.
			} else if (l.type === 'valve') {
				// A VALVE IS NOT A PIPE AND setPipeData() IS NOT VALID ON ONE. Without this branch
				// a valve falls through to the pipe branch and its SETTING is never pushed at all.
				//
				// ORDER IS LOAD-BEARING, AND GETTING IT WRONG COSTS THE WHOLE VALVE. In EPANET a
				// valve has THREE states, not two: closed, fully open, and ACTIVE (controlling to
				// its setting). Writing EN_INITSTATUS = OPEN puts it in the fully-open state, where
				// the setting is IGNORED -- that is what "open" means for a valve, as distinct from
				// a pipe, where it only means not closed. Writing EN_INITSETTING is what puts it
				// back into the active state. So the status is written HERE, before the setting,
				// and the shared status line below skips valves entirely.
				//
				// Written in the other order the network solves with the valve wide open: measured
				// as exactly one k V^2/2g of missing head (0.271 m on cases.valveTcvCase) with the
				// flows still agreeing to 2e-10 m3/s. A plausible number in a plausible place.
				//
				// Same two unit traps as the [VALVES] writer above, and they must agree with it or
				// the cold path and the warm path answer differently: diameter m -> MILLIMETRES
				// (the pipe convention, the opposite of a tank's), and the setting means a
				// different quantity per type, of which only FCV is scaled.
				// **A GPV IS NOT CONTROLLABLE FROM THE API AT ALL, and EPANET says so by name:**
				// error 207, "attempt to control CV/GPV link", thrown by setLinkValue on its status
				// OR its setting. Its behaviour is entirely its curve, which arrived with the file
				// and cannot be pushed through this warm path -- so a GPV whose curve changed needs
				// a REBUILD, and signatureOf() carries its points for exactly that reason.
				//
				// Diameter is still pushed: it is a geometric property, not a control.
				p.setLinkValue(idx, EN_DIAMETER, l.diameter * 1000);
				if (String(l.valveType || 'TCV').toUpperCase() === 'GPV') { continue; }
				p.setLinkValue(idx, EN_INITSTATUS, l.status === 'closed' ? 0 : 1);
				if (l.status !== 'closed') {
					p.setLinkValue(idx, EN_INITSETTING,
						String(l.valveType || 'TCV').toUpperCase() === 'FCV'
							? (l.setting || 0) * 1000
							: (l.setting || 0));
				}
				continue;
			} else {
				// length m, diameter m -> mm, minor-loss coefficient dimensionless.
				p.setPipeData(idx, l.length, l.diameter * 1000, roughnessFor(method, l), l.k || 0);
			}
			// Valves never reach this line -- they `continue` above, having written their own
			// status BEFORE their setting. See that comment for why the order cannot be shared.
			p.setLinkValue(idx, EN_INITSTATUS, l.status === 'closed' ? 0 : 1);
		}
	}

	/**
	 * **A REFUSAL AND AN ABSENT ENGINE ARE DIFFERENT CONDITIONS, AND THEY LEAVE HERE BY DIFFERENT
	 * DOORS** (ROADMAP Task 471).
	 *
	 * EPANET refusing our `.inp` is a fact about THIS NETWORK -- one dangling control, one setting
	 * it would not take -- and the user has to be told what it objected to. The engine being
	 * unreachable is a fact about this SESSION: the network is fine, there is nothing to fix, and
	 * the honest answer is the one instant our own solver can give.
	 *
	 * Both used to arrive as a rejected promise, so the page's single rejection handler called
	 * noEngine() for both -- and a run EPANET refused outright looked exactly like a run that
	 * happened, with our steady answer on screen and nothing saying the engine never ran. That is
	 * the whole of Task 471. **A rejected promise now means only "no engine"**; a refusal is a
	 * RESOLVED result carrying `refused: true`. The two can no longer be confused by a caller that
	 * forgets to look, because they no longer arrive at the same place.
	 *
	 * `engineError` is EPANET's own words, verbatim and untranslated: they name what it choked on,
	 * which is the part a user can act on, and nothing of ours could reconstruct them. The caller
	 * says the rest in the user's language.
	 */
	function engineRefusal(err, extra) {
		var out = {
			ok: false, refused: true, engine: 'epanet', issues: [], warnings: [],
			converged: false, iterations: 0,
			engineError: String((err && err.message) || err || '')
		}, k;
		for (k in (extra || {})) {
			if (Object.prototype.hasOwnProperty.call(extra, k)) { out[k] = extra[k]; }
		}
		return out;
	}

	/**
	 * Drop the open Project. The page never needs this -- the signature handles every edit -- but
	 * a test that wants to time or prove the cold path needs a way back to it, and so does any
	 * caller that has to release the WASM heap.
	 */
	EngCalcs.lpnEpanetReset = function () { closeSession(); };

	/**
	 * Solve through the real EPANET engine, returning the SAME SHAPE lpnSolve returns, in the
	 * SAME SI units, so the caller can swap engines without touching anything downstream.
	 *
	 * Async, unavoidably: the WASM module has to be instantiated. The native solver stays the
	 * default precisely because it is not.
	 *
	 * Structural diagnostics still run through lpnDiagnose FIRST and are still ours. EPANET
	 * reports these as numeric error codes with no offending id attached, which is strictly
	 * worse for a user staring at a drawing -- "node J7 is isolated behind a closed link" beats
	 * "error 110" every time.
	 */
	EngCalcs.lpnSolveEpanet = function (model, options) {
		var opts = options || {};
		var issues = EngCalcs.lpnDiagnose(model);
		if (issues.length > 0) {
			return Promise.resolve({ ok: false, issues: issues, converged: false, iterations: 0, engine: 'epanet' });
		}

		var sig = signatureOf(model);
		var url = opts.moduleUrl || null;

		// **ONLY THIS CALL MAY REJECT**, and its rejection means the module could not be fetched or
		// instantiated -- no engine. Everything after it is EPANET reading OUR network, and a throw
		// there is a REFUSAL, which resolves instead. See engineRefusal().
		return EngCalcs.lpnEpanetLoad(opts.moduleUrl).then(function (mod) {
			// Reuse the open Project when the model is still the same SHAPE; otherwise rebuild.
			// getting this wrong in the reuse direction is the silent-stale-answer failure the
			// section comment above is about, so the test is on the derived signature and on
			// nothing the caller told us.
			var reusable = session && session.sig === sig && session.moduleUrl === url;
			return Promise.resolve(reusable ? session : openSession(mod, model, sig, url));
		}).then(function (s) {
			try {
				pushValues(s, model);

				var p = s.project;
				p.openH();
				p.initH(0);
				p.runH();
				// **ASKED, NOT ASSUMED** (Task 565). `runH()`'s own return is the current TIME, not
				// a status -- the wrapper eats the warning code -- so the question is put to the
				// engine's statistics instead. See convergenceOf().
				var conv = convergenceOf(p);

				var heads = {}, pressures = {}, flows = {}, headlosses = {}, velocities = {},
					i, n, k, link, idx;

				for (i = 0; i < model.nodes.length; i++) {
					n = model.nodes[i];
					idx = s.nodeIdx[n.id];
					heads[n.id] = p.getNodeValue(idx, EN_HEAD);
					pressures[n.id] = p.getNodeValue(idx, EN_PRESSURE);
				}
				for (k = 0; k < model.links.length; k++) {
					link = model.links[k];
					idx = s.linkIdx[link.id];
					// L/s -> m3/s, and EPANET's headloss is already m for a pipe.
					flows[link.id] = p.getLinkValue(idx, EN_FLOW) / 1000;
					velocities[link.id] = p.getLinkValue(idx, EN_VELOCITY);
					headlosses[link.id] = p.getLinkValue(idx, EN_HEADLOSS);
				}

				// closeH() but NOT close(): the hydraulics workspace is per-solve, the parsed
				// network is what we are keeping.
				p.closeH();

				return {
					ok: true,
					engine: 'epanet',
					engineVersion: s.ws.version,
					// **EMPTY BECAUSE IT WAS EARNED, NOT BECAUSE NOBODY LOOKED** (Task 565's second
					// half). `issues` is lpnDiagnose()'s vocabulary -- our own structural findings,
					// each naming an offending id -- and lpnSolveEpanet() returns early above when
					// it has any, so reaching here means it found none. EPANET has no second list
					// of its own to merge in here: what it can say about a completed run is the
					// convergence state, which is now read and carried, and its refusals, which
					// arrive as a throw and become engineRefusal(). The two statistics that WOULD
					// belong here, deficient nodes and demand reduction, exist only under
					// pressure-driven analysis, which this bridge never asks for.
					issues: [],
					warnings: s.warnings.concat(valueWarnings(model)),
					converged: conv.converged,
					iterations: conv.iterations,
					relativeError: conv.relativeError,
					accuracy: conv.accuracy,
					heads: heads,
					pressures: pressures,
					flows: flows,
					headlosses: headlosses,
					velocities: velocities
				};
			} catch (e) {
				// A Project that threw part-way through is of unknown state -- half its values
				// pushed, hydraulics possibly still open. Keeping it would make the NEXT solve
				// answer from that unknown state, so drop it and let the next call reopen cold.
				closeSession();
				return engineRefusal(e, { warnings: (s.warnings || []).concat(valueWarnings(model)) });
			}
		}, function (e) {
			// openSession() itself threw: EPANET would not even parse the file we wrote. The same
			// condition one step earlier, and the same answer.
			closeSession();
			return engineRefusal(e, {});
		});
	};


	// ------------------------------------------------------------------------------------------
	// THE RUN (ROADMAP Task 248). One instant becomes a period.
	//
	// EPANET'S OWN TIME LOOP DOES THIS, and that is the whole design decision. We could step the
	// clock ourselves -- re-solve a steady state at each reporting time with the pattern multipliers
	// for that moment -- and it would look right on every junction and be a lie at every TANK: a
	// tank's level at 9:00 is the integral of everything that flowed into it since midnight, so a
	// series of independent steady states leaves every tank exactly where it started, for ever.
	// runH()/nextH() carries that state; nothing outside EPANET has to integrate anything.
	//
	// A FRESH PROJECT, NEVER THE WARM ONE. The session above is an open Project built from the
	// STEADY-STATE .inp -- no [TIMES], no [PATTERNS], demands already multiplied. Pushing an
	// extended-period run through it would answer from that network, which is the silent-stale
	// answer signatureOf() exists to prevent, arriving by a different door.
	//
	// nextH() returns the seconds to the next hydraulic event, which is NOT the reporting step: it
	// also stops when a tank fills or empties and when a control fires. So a frame is kept only at a
	// REPORTING time, and the intermediate solves happen and are discarded, exactly as EPANET's own
	// report does it.
	var EN_STATUS = 11, EN_DEMAND = 9;

	// initH()'s InitHydOption. 0 runs the hydraulics and throws them away as it goes; 1 SAVES them,
	// which is the whole precondition for a water-quality analysis -- runQ() transports a species
	// along flows that have already been worked out, so it reads a saved hydraulics file rather
	// than re-solving. Asking for the save costs a scratch file inside the engine's own filesystem
	// and nothing on this side, but it is asked for only when a quality run is actually wanted.
	var EN_NOSAVE = 0, EN_SAVE = 1;

	/**
	 * Does this model ask for a water-quality analysis this bridge can actually run?
	 *
	 * **THE ONE PLACE THAT LINE IS DRAWN**, the same way EngCalcs.lpnValveIsNative is the one place
	 * the valve line is. Age needs nothing but the switch. A source share needs a source named, and
	 * an unnamed one is not a quality run at all -- EPANET rejects the file over a trace node it
	 * cannot resolve, so it must never reach the writer. A chemical is carried, never run: see the
	 * note in lpnToInp.
	 */
	EngCalcs.lpnQualityRuns = function (quality) {
		var q = quality || {};
		if (q.mode === 'age') { return true; }
		// **A CHEMICAL RUNS NOW** (Task 566). It needs nothing named to be legal input -- an
		// unstated coefficient is EPANET's own zero, which is a chemical that does not react, and
		// a network with no initial concentration anywhere answers zero everywhere, which is the
		// true answer to the question asked rather than a failure.
		if (q.mode === 'chemical') { return true; }
		return q.mode === 'trace' && !!q.traceNode;
	};

	function nowMs() {
		return (root.performance && root.performance.now) ? root.performance.now() : Date.now();
	}

	/**
	 * **HOW LONG THE RUN MAY HOLD THE THREAD BEFORE IT LETS GO.** Task 450.
	 *
	 * runH()/nextH() is a synchronous loop, and on a network over the auto-run budget it is
	 * SECONDS of synchronous loop. While it holds the thread nothing paints -- so a progress bar
	 * fed from inside it would be a progress bar nobody ever sees move, and the page is frozen
	 * besides. So the loop runs in slices and yields between them.
	 *
	 * **THIS DOES NOT TOUCH ONE NUMBER.** EPANET's whole hydraulic state lives in the Project, and
	 * a slice boundary is simply a moment between two toolkit calls; the sequence of calls, and
	 * therefore every result, is byte-identical to the old do/while. dev/lpn-spike/eps-net3-harness.js
	 * and eps-document-harness.js are what say so out loud -- both still match EPA's own published
	 * report.
	 *
	 * 100 ms because it is the shortest slice whose yield overhead stays negligible (one macrotask,
	 * ~4 ms clamped in a browser, so ~4%) while still giving a 3 second run thirty repaints, which
	 * is far more than a bar needs to read as motion. A run shorter than one slice never yields at
	 * all, so the cheap networks this page re-runs by itself pay nothing.
	 */
	EngCalcs.LPN_EPANET_SLICE_MS = 100;

	/**
	 * `options.onProgress` is called with `{t, duration, fraction, frames}` at the end of every
	 * slice, plus once at the start and once at the end. **THE FRACTION IS SIMULATED TIME**, which
	 * is real progress rather than a guess: EPANET's clock only ever moves forward, so t/duration is
	 * monotonic by construction, and it is the same axis the reporting grid is on.
	 *
	 * `run.report` is **EPANET'S OWN REPORT FILE**, verbatim -- the header, the input summary, the
	 * hydraulic status messages, the flow balance. It is not composed by us and must never be:
	 * setStatusReport(1) tells the engine to write it, and it is read back off the engine's own
	 * in-memory filesystem after the Project closes. Empty string if the build cannot produce one.
	 */
	EngCalcs.lpnEpanetRun = function (model, options) {
		var opts = options || {}, url = opts.moduleUrl || null;
		var issues = EngCalcs.lpnDiagnose(model);
		if (issues.length > 0) {
			return Promise.resolve({ ok: false, engine: 'epanet', issues: issues, frames: [], report: '' });
		}
		var built = EngCalcs.lpnToInp(model, { eps: true });
		var times = (model.time && model.time.times) || EngCalcs.lpnTimesDefaults(),
			reportStart = times.reportStart || 0,
			reportStep = times.reportStep > 0 ? times.reportStep : 3600,
			duration = times.duration || 0,
			onProgress = typeof opts.onProgress === 'function' ? opts.onProgress : null,
			sliceMs = opts.sliceMs > 0 ? opts.sliceMs : EngCalcs.LPN_EPANET_SLICE_MS;

		return EngCalcs.lpnEpanetLoad(url).then(function (mod) {
			return workspaceFor(mod, url).then(function (ws) {
				var p = new mod.Project(ws), frames = [], nodeIdx = {}, linkIdx = {},
					i, n, l, t = 0, tstep, guard = 0, seen = 0, closed = false,
					// **THE QUALITY ANALYSIS IS A SECOND PASS OVER THE SAME CLOCK, NOT A SECOND
					// COLUMN IN THE FIRST ONE.** EPANET transports a species along flows that have
					// already been solved, so the order is fixed: run the hydraulics with EN_SAVE,
					// close them, then open the quality clock and walk it. Interleaving runH() and
					// runQ() is not a thing the toolkit offers, and doing the quality pass first is
					// not either.
					qualOn = EngCalcs.lpnQualityRuns(model.quality),
					qualityIsAge = qualOn && (model.quality || {}).mode === 'age',
					// The two passes share one progress bar, so each owns half of it. Both are the
					// same walk over the same duration, which is the only reason a flat half-and-half
					// split is honest rather than a guess.
					phase0 = 0, phaseSpan = qualOn ? 0.5 : 1;

				// ALWAYS closed, on every path out. A Project is a WASM allocation inside a
				// Workspace that outlives it, so a run that threw would otherwise leak the whole
				// network on every retry. The report is read back HERE because closing is what
				// flushes the last of it to the engine's filesystem.
				function shutdown() {
					var txt = '';
					if (closed) { return txt; }
					closed = true;
					try { p.closeQ(); } catch (e) { /* no quality pass, or already shut */ }
					try { p.closeH(); } catch (e) { /* never opened, or already shut */ }
					try { p.close(); } catch (e) { /* already torn down */ }
					try { txt = ws.readFile('eps.rpt') || ''; } catch (e) { txt = ''; }
					return txt;
				}
				function tell(frac) {
					if (!onProgress) { return; }
					// A consumer that throws must not take the run down with it: the run is the
					// work, the progress bar is decoration on top of it.
					try {
						onProgress({ t: t, duration: duration, fraction: frac, frames: frames.length });
					} catch (e) { /* the caller's problem, not the run's */ }
				}
				function fractionNow() {
					var f = duration > 0 ? t / duration : 1;
					if (!(f >= 0)) { f = 0; }
					if (f > 1) { f = 1; }
					f = phase0 + f * phaseSpan;
					// Monotonic OUT as well as in: nothing downstream should ever have to wonder.
					if (f < seen) { f = seen; }
					seen = f;
					return f;
				}
				// Is `t` a moment the report keeps? The hydraulic loop and the quality loop ask the
				// same question of the same grid, and asking it twice in two places is how the two
				// passes end up with different frame lists.
				function isReportTime(now) {
					return now >= reportStart && ((now - reportStart) % reportStep) === 0 && now <= duration;
				}

				ws.writeFile('eps.inp', built.inp);
				try {
					p.open('eps.inp', 'eps.rpt', 'eps.out');
					// The engine writes its own report only when it is asked to. Level 1 is the
					// status report -- what balanced in how many trials, which control fired, which
					// tank filled -- which is the half of EPANET's report that says what HAPPENED.
					// Wrapped because a build without it must degrade to "no report offered", never
					// to "no run".
					try { p.setStatusReport(1); } catch (e) { /* this build writes no status report */ }
					for (i = 0; i < model.nodes.length; i++) { nodeIdx[model.nodes[i].id] = p.getNodeIndex(model.nodes[i].id); }
					for (i = 0; i < model.links.length; i++) { linkIdx[model.links[i].id] = p.getLinkIndex(model.links[i].id); }
					p.openH();
					p.initH(qualOn ? EN_SAVE : EN_NOSAVE);
				} catch (e) {
					// **THE REFUSAL** (Task 471). EPANET has our file and will not take it -- a
					// dangling control, an id it cannot resolve. It resolves rather than rejects,
					// so the page can tell this apart from an engine it could not fetch, and it
					// carries the engine's own report because a rejected open still writes one and
					// that text is the only place the offending line is named.
					return engineRefusal(e, {
						warnings: built.warnings, frames: [], report: shutdown(),
						duration: duration, reportStart: reportStart, reportStep: reportStep
					});
				}

				return new Promise(function (resolve) {
					// The frames, by their own reporting time, so the quality pass can find the one
					// it is standing on without searching the array at every step.
					var frameAt = {};
					// **CONVERGENCE OVER A WHOLE RUN IS A CONJUNCTION** (Task 565). Every hydraulic
					// step is a separate solve with its own answer, so a run converged only if all
					// of them did, and the first step that did not is the one worth naming -- after
					// it, tank levels carry the error forward and every later step is downstream of
					// a number nobody checked. `worst` is the largest relative error seen, which is
					// what a user comparing two runs actually wants.
					var stepsRun = 0, stepsUnconverged = 0, firstBadT = null, worstRelErr = 0,
						convAccuracy = null, convUnknown = false;
					function noteStep(tNow, c) {
						stepsRun++;
						if (c.converged === null) { convUnknown = true; return; }
						if (convAccuracy === null) { convAccuracy = c.accuracy; }
						if (c.relativeError > worstRelErr) { worstRelErr = c.relativeError; }
						if (!c.converged) {
							stepsUnconverged++;
							if (firstBadT === null) { firstBadT = tNow; }
						}
					}
					function done() {
						var report = shutdown();
						seen = 1;
						tell(1);
						resolve({
							ok: true, engine: 'epanet', engineVersion: ws.version,
							// See the steady site's note: empty because lpnDiagnose() found none,
							// not because nothing was asked.
							issues: [],
							warnings: built.warnings,
							converged: convUnknown ? null : (stepsUnconverged === 0),
							iterations: null,
							steps: stepsRun,
							stepsUnconverged: stepsUnconverged,
							firstUnconvergedTime: firstBadT,
							relativeError: worstRelErr,
							accuracy: convAccuracy,
							frames: frames,
							duration: duration, reportStart: reportStart, reportStep: reportStep,
							quality: qualOn ? (model.quality || null) : null,
							report: report
						});
					}
					function failed(e) {
						resolve(engineRefusal(e, {
							warnings: built.warnings, frames: [], report: shutdown(),
							duration: duration, reportStart: reportStart, reportStep: reportStep
						}));
					}
					/**
					 * **THE QUALITY WALK.** Same clock, same reporting grid, same slicing -- and a
					 * frame that already exists rather than a second frame list, so a scrub of the
					 * transport can never show a head from one moment beside a water age from
					 * another.
					 *
					 * **THE NUMBER IS CONVERTED HERE AND NOWHERE ELSE.** EPANET reports water age in
					 * HOURS, and every result on this bridge leaves in SI -- so age crosses to
					 * SECONDS at this one line, exactly as a flow crosses from L/s. A source share
					 * is a percentage and is nobody's unit, so it crosses nothing. Getting this
					 * backwards would be silent: 6.5 read as seconds is a plausible small number
					 * beside a plausible large one.
					 */
					function qslice() {
						var slice0 = nowMs(), finished = false, f, tq, qstep, qi, qn;
						try {
							for (;;) {
								tq = p.runQ();
								t = tq;
								f = frameAt[tq];
								if (f && isReportTime(tq)) {
									f.qualities = {};
									for (qi = 0; qi < model.nodes.length; qi++) {
										qn = model.nodes[qi];
										f.qualities[qn.id] = p.getNodeValue(nodeIdx[qn.id], EN_QUALITY) *
											(qualityIsAge ? 3600 : 1);
									}
								}
								qstep = p.nextQ();
								if (!(qstep > 0) || ++guard >= 200000) { finished = true; break; }
								if (nowMs() - slice0 >= sliceMs) { break; }
							}
						} catch (e) { failed(e); return; }
						if (!finished) { tell(fractionNow()); setTimeout(qslice, 0); return; }
						done();
					}
					function startQuality() {
						try {
							// closeH() flushes the saved hydraulics the quality walk reads. It is
							// the precondition, not tidying up.
							p.closeH();
							p.openQ();
							p.initQ(EN_NOSAVE);
						} catch (e) { failed(e); return; }
						phase0 = 0.5; phaseSpan = 0.5; t = 0; guard = 0;
						qslice();
					}
					function slice() {
						var slice0 = nowMs(), finished = false, f, stepConv;
						try {
							for (;;) {
								t = p.runH();
								stepConv = convergenceOf(p);
								noteStep(t, stepConv);
								// The reporting grid, and nothing else. `>= reportStart` because a run
								// may be asked to report only its second half; the modulo because
								// runH() lands on tank and control events that belong to nobody's
								// report.
								if (isReportTime(t)) {
									f = {
										t: t, heads: {}, pressures: {}, demands: {}, levels: {},
										flows: {}, velocities: {}, headlosses: {}, statuses: {},
										// **PER FRAME, BECAUSE THE SCRUBBER IS PER FRAME** (Task 565).
										// A run of 25 steps where step 14 did not converge is one bad
										// frame and 24 good ones; marking the whole run would put the
										// warning on every frame, and marking none would put it on the
										// frame that needs it. `null` means the engine could not be
										// asked, which is neither a yes nor a no.
										converged: stepConv.converged,
										relativeError: stepConv.relativeError,
										accuracy: stepConv.accuracy,
										iterations: stepConv.iterations
									};
									for (i = 0; i < model.nodes.length; i++) {
										n = model.nodes[i];
										f.heads[n.id] = p.getNodeValue(nodeIdx[n.id], EN_HEAD);
										f.pressures[n.id] = p.getNodeValue(nodeIdx[n.id], EN_PRESSURE);
										// L/s -> m3/s, the same scale a [JUNCTIONS] demand is written in.
										f.demands[n.id] = p.getNodeValue(nodeIdx[n.id], EN_DEMAND) / 1000;
										// **THE TANK LEVEL IS A RESULT, NOT AN INPUT** -- the point of the run.
										// It is metres above the tank's own bottom under LPS, the same quantity
										// and the same unit the document's `level` field holds. They must never
										// be written into each other; see the note in js/lpn-time.js.
										//
										// DERIVED FROM THE HEAD, NOT READ FROM EN_TANKLEVEL. Measured against
										// EPA's own Net3 report: EN_TANKLEVEL answers the INITIAL level and
										// keeps answering it for the whole run, so every tank reads flat all day
										// while its head moves nine feet underneath it. Head minus elevation is
										// the level by definition -- it is what a tank IS, see
										// EngCalcs.lpnIsFixedHead -- and it tracks the report.
										if (n.type === 'tank') { f.levels[n.id] = f.heads[n.id] - (n.elev || 0); }
									}
									for (i = 0; i < model.links.length; i++) {
										l = model.links[i];
										f.flows[l.id] = p.getLinkValue(linkIdx[l.id], EN_FLOW) / 1000;
										f.velocities[l.id] = p.getLinkValue(linkIdx[l.id], EN_VELOCITY);
										f.headlosses[l.id] = p.getLinkValue(linkIdx[l.id], EN_HEADLOSS);
										f.statuses[l.id] = p.getLinkValue(linkIdx[l.id], EN_STATUS) > 0 ? 'open' : 'closed';
									}
									frames.push(f);
									frameAt[f.t] = f;
								}
								tstep = p.nextH();
								// A guard, not a policy: a network that somehow never advances would hang
								// the tab. 100000 steps is far past any real model at any real timestep.
								if (!(tstep > 0) || ++guard >= 100000) { finished = true; break; }
								if (nowMs() - slice0 >= sliceMs) { break; }
							}
						} catch (e) {
							// A refusal can also arrive mid-run: EPANET checks some things only
							// when it reaches them. Same condition, same shape, resolved for the
							// same reason -- and the frames gathered so far go, because a partial
							// period drawn as a whole one is the silent wrong answer again.
							failed(e);
							return;
						}
						if (!finished) {
							tell(fractionNow());
							// setTimeout rather than a microtask ON PURPOSE: a microtask does not
							// end the task, so the browser never gets to paint and the whole point
							// of slicing is lost.
							setTimeout(slice, 0);
							return;
						}
						if (qualOn) { startQuality(); return; }
						done();
					}
					tell(0);
					slice();
				});
			});
		});
	};

}(typeof globalThis !== 'undefined' ? globalThis : this));
