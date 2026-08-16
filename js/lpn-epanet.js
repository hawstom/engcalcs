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
		EN_FLOW = 8,
		EN_VELOCITY = 9,
		EN_HEADLOSS = 10,
		EN_INITSTATUS = 4,
		// Link properties a VALVE needs and a pipe does not. EN_DIAMETER is shared with a pipe
		// but reached separately here, because setPipeData() is not valid on a valve index.
		EN_DIAMETER = 0,
		EN_INITSETTING = 5;

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
			valves = [],
			statuses = [],
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
				//     FCV      a FLOW       -> m3/s to L/s, x1000, same as a junction demand.
				//     TCV      a LOSS COEFFICIENT, dimensionless, unscaled.
				//   dev/lpn-spike/valve-harness.js round-trips all three through the text, because
				//   validate_epanet.js cannot: it compares two engines reading the SAME .inp, so a
				//   setting written in the wrong unit is wrong identically on both sides.
				var vt = (link.valveType || 'TCV').toUpperCase(),
					setting = link.setting || 0;
				if (vt === 'FCV') { setting = setting * 1000; }
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
				if (link.h0 > 0 || link.a > 0) {
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

		var inp = '[TITLE]\nEngCalcs looped network\n\n' +
			'[JUNCTIONS]\n' + junctions.join('\n') + '\n\n' +
			'[RESERVOIRS]\n' + reservoirs.join('\n') + '\n\n' +
			(tanks.length ? '[TANKS]\n' + tanks.join('\n') + '\n\n' : '') +
			(pipes.length ? '[PIPES]\n' + pipes.join('\n') + '\n\n' : '') +
			(pumps.length ? '[PUMPS]\n' + pumps.join('\n') + '\n\n' : '') +
			(valves.length ? '[VALVES]\n' + valves.join('\n') + '\n\n' : '') +
			(curves.length ? '[CURVES]\n' + curves.join('\n') + '\n\n' : '') +
			(emitters.length ? '[EMITTERS]\n' + emitters.join('\n') + '\n\n' : '') +
			// After [VALVES] and [PUMPS], because a [STATUS] line names a link that must already
			// have been declared.
			(statuses.length ? '[STATUS]\n' + statuses.join('\n') + '\n\n' : '') +
			'[OPTIONS]\n Units LPS\n Headloss ' + headloss +
			'\n Emitter Exponent ' + emitterExp +
			// Match our own convergence, which is far tighter than EPANET's 0.001 default,
			// so a disagreement between the two engines is never just tolerance.
			'\n Accuracy 1e-8\n Trials 200\n Unbalanced Continue 10\n\n' +
			'[END]\n';

		return { inp: inp, warnings: warnings };
	};

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
				'\u0001' + (l.type === 'valve' ? String(l.valveType || 'TCV').toUpperCase() : ''));
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
	// long as the signature holds: the index of every node, link and pump curve, and the warnings
	// lpnToInp produced (those depend only on the method and on which pumps have curves -- both of
	// which are in the signature, so a cached warning list can never go stale under a value edit).
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
				warnings: built.warnings, nodeIdx: {}, linkIdx: {}, curveIdx: {}
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
				p.setLinkValue(idx, EN_DIAMETER, l.diameter * 1000);
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

		return EngCalcs.lpnEpanetLoad(opts.moduleUrl).then(function (mod) {
			// Reuse the open Project when the model is still the same SHAPE; otherwise rebuild.
			// getting this wrong in the reuse direction is the silent-stale-answer failure the
			// section comment above is about, so the test is on the derived signature and on
			// nothing the caller told us.
			var reusable = session && session.sig === sig && session.moduleUrl === url;
			return reusable ? session : openSession(mod, model, sig, url);
		}).then(function (s) {
			try {
				pushValues(s, model);

				var p = s.project;
				p.openH();
				p.initH(0);
				p.runH();

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
					issues: [],
					warnings: s.warnings,
					converged: true,
					iterations: null,
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
				throw e;
			}
		});
	};

}(typeof globalThis !== 'undefined' ? globalThis : this));
