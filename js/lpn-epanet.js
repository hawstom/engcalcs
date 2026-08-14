// Looped Pipe Network -- optional solve through the REAL EPANET engine (ROADMAP Task 243).
//
// WHY THIS EXISTS, AND WHY IT IS OFF BY DEFAULT.
// js/lpn-solver.js already agrees with EPANET to 0.0002 ft of head and 0.004 gpm of flow on
// EPA's own Net1/Net2/Net3 (see dev/lpn-spike/). So this buys no correctness. It buys two
// things Tom named on 2026-08-09: for some agencies "does it run the actual EPANET engine?"
// is a yes/no procurement gate that no amount of mobile-and-26-languages substitutes for
// (ROADMAP Task 222), and it is the door to tanks, valves, extended-period simulation and
// .inp interop that we would otherwise hand-write. Task 248 walked through that door: TANKS
// shipped 2026-08-14 and are written into [TANKS] below.
//
// It stays OFF by default because the costs are real and land on our differentiator: the
// engine module is 678 KB (236 KB gzipped) and loading it is async, against a native solve
// that is synchronous and takes 0.4 ms at the 21-node target. So we lazy-import it only when
// the user asks, and the offline PWA bundle never carries it unless it has been used.
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
		EN_HEAD = 10,
		EN_PRESSURE = 11,
		EN_FLOW = 8,
		EN_VELOCITY = 9,
		EN_HEADLOSS = 10;

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
	EngCalcs.lpnToInp = function (model) {
		var method = model.method || 'hw',
			headloss = HEADLOSS[method] || 'H-W',
			emitterExp = model.emitterExponent || 0.5,
			junctions = [],
			reservoirs = [],
			tanks = [],
			pipes = [],
			pumps = [],
			curves = [],
			emitters = [],
			warnings = [],
			i, n, k, link;

		for (i = 0; i < model.nodes.length; i++) {
			n = model.nodes[i];
			if (n.type === 'reservoir') {
				// EPANET reservoirs carry a total head, which is exactly what we store.
				reservoirs.push(' ' + n.id + '  ' + (n.head || 0));
			} else if (n.type === 'tank') {
				// [TANKS] is  ID  Elev  InitLvl  MinLvl  MaxLvl  Diam  MinVol  [VolCurve].
				//
				// EVERY ONE OF THESE IS IN THE LENGTH UNIT, INCLUDING THE DIAMETER -- metres under
				// LPS. That is NOT the rule for a pipe, whose diameter is in millimetres in the
				// same file (see roughnessFor() and the [PIPES] writer below), and mixing the two
				// up is the exact silent failure this file's header warns about: a 20 m tank
				// written as 20000 still solves, it just holds a thousand times the water. Task
				// 248, 2026-08-14.
				//
				// MinVol is written as 0 and no VolCurve is written, because this page has neither.
				// 0 means "no separate minimum volume", which is EPANET's own default, not a
				// stand-in for missing data. A non-cylindrical tank imported from a file with a
				// volume curve is reported as a difference rather than faked (js/lpn-inp.js).
				tanks.push(' ' + n.id + '  ' + (n.elev || 0) + '  ' + (n.level || 0) + '  ' +
					(n.minLevel || 0) + '  ' + (n.maxLevel || 0) + '  ' + (n.diameter || 0) + '  0');
			} else {
				// Demand m3/s -> L/s.
				junctions.push(' ' + n.id + '  ' + (n.elev || 0) + '  ' + (n.demand || 0) * 1000);
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
			if (link.type === 'pump') {
				if (link.h0 > 0 || link.a > 0) {
					// Our curve is H = h0 - a Q^b, and EPANET fits exactly that form to a 3-point
					// HEAD curve -- so three points sampled off our own curve round-trip it
					// rather than approximating it, PROVIDED the first sample sits at Q = 0.
					//
					// THE FIRST POINT MUST BE THE SHUTOFF POINT. This is not a preference and it
					// is not documented anywhere obvious; it was measured 2026-08-09 after Tom
					// reported in the browser that "the EPANET engine gives me bigger losses than
					// our engine, and the difference seems possibly to be entirely in the pump."
					// He was exactly right. This code first sampled [0.25, 0.5, 0.75] of shutoff
					// flow, and EPANET then fitted a DIFFERENT curve through them -- on a 30 m
					// design-point pump it delivered 36.00 m of head where our own curve says
					// 36.40 at the same flow, a 1.1% shortfall that reads as extra loss.
					// Measured across four samplings: [0, .5, .9] and [0, .6, .95] reproduce our
					// curve to 0.0000 m; [.25, .5, .75] is off by 0.40 m and [.1, .5, .9] by
					// 1.60 m. Anything whose first point has Q > 0 is wrong.
					// dev/lpn-spike/validate_epanet.js now carries a pump case so this cannot
					// regress unnoticed -- its absence is why this shipped in the first place.
					var qMax = Math.pow(link.h0 / link.a, 1 / link.b),
						pts = [0, 0.5, 0.9],
						cname = 'C_' + link.id,
						rows = [],
						j, q, h;
					for (j = 0; j < pts.length; j++) {
						q = qMax * pts[j];
						h = link.h0 - link.a * Math.pow(q, link.b);
						rows.push(' ' + cname + '  ' + (q * 1000) + '  ' + h);
					}
					curves.push(rows.join('\n'));
					pumps.push(' ' + link.id + '  ' + link.from + '  ' + link.to + '  HEAD ' + cname);
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
		// and the user is told rather than left to notice. Measured 2026-08-09 over an 8x
		// diameter range (0.1 m to 0.8 m): EPANET's Chezy-Manning head loss is 0.9939 to
		// 0.9944 of ours, i.e. a near-constant factor, NOT the truncated 16/3 exponent that
		// was the obvious first suspect -- that hypothesis predicts 0.9924 to 0.9993 and the
		// data flatly refute it. Our resistance is the exact derivation from V = (1/n)R^(2/3)
		// with R = d/4, giving 10.2936; EPANET's implies 10.231.
		//
		// WE DO NOT ADOPT EPANET'S NUMBER HERE, and that is the opposite of the Task 213 call
		// on Hazen-Williams. Two reasons, both stronger than interop: ours is the exact form
		// and EPANET's is rounded, and Manning's n is shared with Manning-Pipe-Flow,
		// Manning-Pipe-Head-Loss and Manning-Trap -- the calculators carrying the large
		// majority of this suite's users. Matching EPANET on this page would make it disagree
		// with those, which is a far worse outcome than a 0.6% delta on an opt-in toggle.
		if (method === 'manning') {
			warnings.push({ code: 'manning-constant-differs', ids: [] });
		}

		var inp = '[TITLE]\nEngCalcs looped network\n\n' +
			'[JUNCTIONS]\n' + junctions.join('\n') + '\n\n' +
			'[RESERVOIRS]\n' + reservoirs.join('\n') + '\n\n' +
			(tanks.length ? '[TANKS]\n' + tanks.join('\n') + '\n\n' : '') +
			(pipes.length ? '[PIPES]\n' + pipes.join('\n') + '\n\n' : '') +
			(pumps.length ? '[PUMPS]\n' + pumps.join('\n') + '\n\n' : '') +
			(curves.length ? '[CURVES]\n' + curves.join('\n') + '\n\n' : '') +
			(emitters.length ? '[EMITTERS]\n' + emitters.join('\n') + '\n\n' : '') +
			'[OPTIONS]\n Units LPS\n Headloss ' + headloss +
			'\n Emitter Exponent ' + emitterExp +
			// Match our own convergence, which is far tighter than EPANET's 0.001 default,
			// so a disagreement between the two engines is never just tolerance.
			'\n Accuracy 1e-8\n Trials 200\n Unbalanced Continue 10\n\n' +
			'[END]\n';

		return { inp: inp, warnings: warnings };
	};

	// Cached module promise -- the 678 KB import happens at most once per page.
	var enginePromise = null;

	EngCalcs.lpnEpanetLoad = function (url) {
		if (enginePromise === null) {
			enginePromise = import(url || '/engcalcs/js/vendor/epanet-js.js');
		}
		return enginePromise;
	};

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

		var built = EngCalcs.lpnToInp(model);

		return EngCalcs.lpnEpanetLoad(opts.moduleUrl).then(function (mod) {
			var ws = new mod.Workspace();
			return Promise.resolve(ws.loadModule()).then(function () {
				var p = new mod.Project(ws);
				ws.writeFile('net.inp', built.inp);
				p.open('net.inp', 'net.rpt', 'net.out');
				p.openH();
				p.initH(0);
				p.runH();

				var heads = {}, pressures = {}, flows = {}, headlosses = {}, velocities = {},
					i, n, k, link, idx;

				for (i = 0; i < model.nodes.length; i++) {
					n = model.nodes[i];
					idx = p.getNodeIndex(n.id);
					heads[n.id] = p.getNodeValue(idx, EN_HEAD);
					pressures[n.id] = p.getNodeValue(idx, EN_PRESSURE);
				}
				for (k = 0; k < model.links.length; k++) {
					link = model.links[k];
					idx = p.getLinkIndex(link.id);
					// L/s -> m3/s, and EPANET's headloss is already m for a pipe.
					flows[link.id] = p.getLinkValue(idx, EN_FLOW) / 1000;
					velocities[link.id] = p.getLinkValue(idx, EN_VELOCITY);
					headlosses[link.id] = p.getLinkValue(idx, EN_HEADLOSS);
				}

				p.closeH();
				p.close();

				return {
					ok: true,
					engine: 'epanet',
					engineVersion: ws.version,
					issues: [],
					warnings: built.warnings,
					converged: true,
					iterations: null,
					heads: heads,
					pressures: pressures,
					flows: flows,
					headlosses: headlosses,
					velocities: velocities
				};
			});
		});
	};

}(typeof globalThis !== 'undefined' ? globalThis : this));
