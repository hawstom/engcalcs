// The whole-system fire flow sweep (ROADMAP Task 530). Run:
//   node dev/lpn-spike/fireflow-harness.js
//
// **THIS ASSERTS THE PHYSICS AND THE ANSWERS, NOT THAT A NUMBER MOVED.** Four properties, and each
// one is a way the sweep could be wrong while looking right:
//
//   1. THE BISECTION LANDS ON THE FLOW THAT PUTS THE JUNCTION AT EXACTLY ITS RESIDUAL, and that
//      flow is derived HERE from EPANET's own published 4.727 US Hazen-Williams equation rather
//      than from js/lpn-solver.js. Anchoring against our own resistance function would prove only
//      that the search agrees with the thing it is searching.
//   2. THE FIRE FLOW IS DRAWN ON TOP OF WHAT THE JUNCTION ALREADY USES. The anchor case carries a
//      base demand, so a sweep that REPLACED the demand instead of adding to it lands on a
//      different number and this fails.
//   3. THE THREE STATES ARE DECIDED BY BOTH ANSWERS. The same junction, in the same network, at the
//      same required flow, comes back Passing with the design scope off and a Design issue with it
//      on -- so the design half is doing the work, not the compliance half.
//   4. THE STATES PARTITION THE JUNCTIONS. Every junction asked for comes back in exactly one
//      bucket, and the buckets add up to the ask.
//
// AND THE DOCUMENT IS NEVER TOUCHED: the model handed in is byte-identical afterwards. That is what
// makes the sweep's storage safe -- it writes no element property, so js/looped-network.js's
// setProp() write seam is not involved at all.

const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EC = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EC;
require(path.join(ROOT, 'js', 'lpn-fireflow.js'));

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name + (extra === undefined ? '' : '   ' + extra)); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function near(a, b, tol) { return Math.abs(a - b) <= tol; }

const S = EC.lpnFireFlowStates, C = EC.lpnFireFlowCodes;
const gpm = EC.lpnFireFlowGpmToSI, psi = EC.lpnFireFlowPsiToHead;

// The one engine every case here uses. Synchronous, so the sweep's promise chain is the only
// asynchrony and a failure cannot be a race.
function nativeSolve(m) { return EC.lpnSolve(m, { tol: 1e-12, maxIter: 400 }); }
// No timers: the sweep's macrotask yield exists to keep a browser painting and has nothing to say
// here, and a harness that waited on 200 timers would take longer than the solves.
const noYield = () => Promise.resolve();

// ---------------------------------------------------------------------------
// 1. The anchor: one reservoir, one pipe, one junction, checked by hand
// ---------------------------------------------------------------------------
//
// EPANET's own US-unit Hazen-Williams equation, which is where the constant in
// js/PipeHydraulics.lib.js comes from and is NOT that constant re-used:
//     h_f = 4.727 L Q^1.852 / (C^1.852 d^4.871)      L, d in ft; Q in cfs; h_f in ft
const FT = 0.3048, CFS = FT * FT * FT;
const ANCHOR = { L: 600, D: 0.2032, C: 130, HEAD: 60, ELEV: 10, BASE: gpm(120) };
function anchorLossFt(qSI) {
	return 4.727 * (ANCHOR.L / FT) * Math.pow(qSI / CFS, 1.852) /
		(Math.pow(ANCHOR.C, 1.852) * Math.pow(ANCHOR.D / FT, 4.871));
}
// The TOTAL pipe flow that leaves exactly `headroom` metres of head at the junction. Solved by a
// bisection of its own on the equation above -- a different equation, solved independently, so the
// two searches can only agree if both are right.
function totalFlowForLoss(headroomM) {
	let lo = 0, hi = 1;
	for (let i = 0; i < 200; i++) {
		const mid = (lo + hi) / 2;
		if (anchorLossFt(mid) * FT < headroomM) { lo = mid; } else { hi = mid; }
	}
	return (lo + hi) / 2;
}
function anchorModel() {
	return {
		method: 'hw',
		nodes: [
			{ id: 'R', type: 'reservoir', elev: 0, head: ANCHOR.HEAD },
			{ id: 'J', type: 'junction', elev: ANCHOR.ELEV, demand: ANCHOR.BASE }
		],
		links: [{ id: 'P1', type: 'pipe', from: 'R', to: 'J', length: ANCHOR.L,
			diameter: ANCHOR.D, roughness: ANCHOR.C, k: 0, status: 'open' }]
	};
}

// ---------------------------------------------------------------------------
// 2. A network where one junction starves another
// ---------------------------------------------------------------------------
//
// R --A1-- A --A2-- B, with B hanging off the far end of a long small pipe. Drawing a fire flow at
// A pulls the head down at the tee, and B -- which has no other supply -- goes with it. A itself
// still holds its own 20 psi, so A passes the COMPLIANCE question and fails the DESIGN one. That
// pair of facts about ONE junction is the whole point of the three states.
function starveModel() {
	return {
		method: 'hw',
		nodes: [
			{ id: 'R', type: 'reservoir', elev: 0, head: 55 },
			{ id: 'A', type: 'junction', elev: 5, demand: gpm(50) },
			{ id: 'B', type: 'junction', elev: 22, demand: gpm(20) }
		],
		links: [
			{ id: 'A1', type: 'pipe', from: 'R', to: 'A', length: 500, diameter: 0.1524,
				roughness: 130, k: 0, status: 'open' },
			{ id: 'A2', type: 'pipe', from: 'A', to: 'B', length: 400, diameter: 0.1016,
				roughness: 130, k: 0, status: 'open' }
		]
	};
}

(async function () {
	// -----------------------------------------------------------------------
	console.log('\n--- 1. the bisection lands on the residual, anchored on EPANET\'s own equation ---');
	const residual = psi(20);
	const model = anchorModel();
	const before = JSON.stringify(model);
	// Headroom at the junction when it sits at exactly the residual: reservoir head, less the
	// junction's ground, less the pressure it must still hold.
	const headroom = ANCHOR.HEAD - ANCHOR.ELEV - residual;
	const expectedTotal = totalFlowForLoss(headroom);
	const expectedFire = expectedTotal - ANCHOR.BASE;

	let set = await EC.lpnFireFlowSweep(model, {
		solve: nativeSolve, junctions: ['J'], required: gpm(500), residual: residual, yield: noYield
	});
	let rec = set.byId['J'];
	// The bisection reports `lo`, the largest flow KNOWN to hold the residual, so it lands at or
	// just below the true answer -- never above it. The tolerance is the search's own bracket
	// (1e-4 of the 10,000 gpm ceiling = 1 gpm), which is the honest bound on this comparison.
	const bracket = 1e-4 * EC.lpnFireFlowDefaults.maxFlow;
	ok('available flow matches the hand-derived flow', near(rec.available, expectedFire, bracket),
		(rec.available / gpm(1)).toFixed(2) + ' gpm vs ' + (expectedFire / gpm(1)).toFixed(2) + ' gpm');
	ok('and it is never reported above the true answer', rec.available <= expectedFire + 1e-12);
	ok('the pressure it reports there IS the residual',
		near(rec.residualAt, residual, 0.02), rec.residualAt.toFixed(4) + ' m vs ' + residual.toFixed(4) + ' m');
	// **THE COUPLING THE STUB COULD HAVE REMOVED.** If the sweep set the junction's demand to the
	// fire flow instead of adding it, the answer would be `expectedTotal`, not `expectedTotal`
	// minus the base -- 120 gpm out, and every number above would still look plausible.
	ok('the fire flow is ADDED to the base demand, not substituted for it',
		!near(rec.available, expectedTotal, bracket),
		'a substituting sweep would have reported ' + (expectedTotal / gpm(1)).toFixed(2) + ' gpm');
	ok('the model handed in is byte-identical afterwards', JSON.stringify(model) === before);
	ok('the sweep reports what it cost', rec.solves > 3 && set.solves === rec.solves, rec.solves + ' solves');

	// -----------------------------------------------------------------------
	console.log('\n--- 2. pass and fail are decided against the requirement ---');
	// The same junction, twice, with the requirement either side of what it can deliver.
	set = await EC.lpnFireFlowSweep(anchorModel(), {
		solve: nativeSolve, junctions: ['J'], required: expectedFire * 0.5,
		residual: residual, yield: noYield
	});
	ok('a junction that can deliver the requirement passes', set.byId['J'].state === S.PASS,
		set.byId['J'].state);
	ok('and its available flow is above the requirement',
		set.byId['J'].available >= set.byId['J'].required);
	set = await EC.lpnFireFlowSweep(anchorModel(), {
		solve: nativeSolve, junctions: ['J'], required: expectedFire * 2,
		residual: residual, yield: noYield
	});
	ok('a junction that cannot deliver it fails', set.byId['J'].state === S.FAIL,
		set.byId['J'].state);
	ok('and its available flow is below the requirement',
		set.byId['J'].available < set.byId['J'].required);

	// -----------------------------------------------------------------------
	console.log('\n--- 3. no available fire flow is not an available fire flow of zero ---');
	const flat = anchorModel();
	// The reservoir put below the junction's own 20 psi line: the residual is unmet with nothing
	// drawn at all, so no flow satisfies the definition and the question has no answer.
	flat.nodes[0].head = ANCHOR.ELEV + residual - 1;
	set = await EC.lpnFireFlowSweep(flat, {
		solve: nativeSolve, junctions: ['J'], required: gpm(500), residual: residual, yield: noYield
	});
	rec = set.byId['J'];
	ok('a junction below the residual at rest is a failure', rec.state === S.FAIL, rec.state);
	ok('and it is named rather than numbered', rec.code === C.BELOW_AT_REST, rec.code);
	ok('and it carries NO available flow at all', rec.available === undefined,
		'reporting 0 gpm here would be an answer where there is none');
	ok('it costs one solve, not sixteen', rec.solves === 1, rec.solves + ' solves');

	// -----------------------------------------------------------------------
	console.log('\n--- 4. the design half changes the state, and the compliance half does not ---');
	const required = gpm(700), minPressure = psi(20), maxVelocity = 1.5;
	const starve = starveModel();
	const starveBefore = JSON.stringify(starve);

	// Compliance alone: no design scope at all.
	let plain = await EC.lpnFireFlowSweep(starveModel(), {
		solve: nativeSolve, junctions: ['A'], required: required, residual: residual, yield: noYield
	});
	ok('A holds its own residual at the required flow, so it PASSES on compliance',
		plain.byId['A'].state === S.PASS, plain.byId['A'].state);

	// The same junction, the same flow, with the rest of the system in scope.
	let designed = await EC.lpnFireFlowSweep(starve, {
		solve: nativeSolve, junctions: ['A'], required: required, residual: residual,
		design: { nodes: ['A', 'B'], links: ['A1', 'A2'], minPressure: minPressure,
			maxVelocity: maxVelocity },
		yield: noYield
	});
	rec = designed.byId['A'];
	ok('with the design scope on, the SAME junction is a design issue', rec.state === S.DESIGN,
		rec.state);
	ok('and it names the junction it starved',
		rec.effects.nodes.length === 1 && rec.effects.nodes[0].id === 'B',
		JSON.stringify(rec.effects.nodes.map(n => n.id)));
	ok('with the pressure it fell to', rec.effects.nodes[0].pressure < minPressure,
		rec.effects.nodes[0].pressure.toFixed(2) + ' m < ' + minPressure.toFixed(2) + ' m');
	// **THE TESTED JUNCTION IS NEVER ITS OWN CASUALTY.** A is in the design scope above and is
	// pulled down by its own fire flow -- that is what the residual criterion is FOR -- so counting
	// it would make every passing junction a design issue.
	// **AND THE CHECK THAT MEANS SOMETHING: a minimum the tested junction ITSELF cannot hold.**
	// At 45 psi both junctions are under water; A is excluded because it is the one on fire, and B
	// is not. Without the exclusion every passing junction in the system would report itself as its
	// own design issue, which is the quietest way this feature could have been useless.
	let strict = await EC.lpnFireFlowSweep(starveModel(), {
		solve: nativeSolve, junctions: ['A'], required: required, residual: residual,
		design: { nodes: ['A', 'B'], links: [], minPressure: psi(45), maxVelocity: maxVelocity },
		yield: noYield
	});
	ok('the tested junction is never its own side effect, even under a minimum it cannot hold',
		!strict.byId['A'].effects.nodes.some(n => n.id === 'A') &&
		strict.byId['A'].effects.nodes.some(n => n.id === 'B'),
		JSON.stringify(strict.byId['A'].effects.nodes.map(n => n.id)));
	ok('and A really is under that minimum, so the exclusion did the work',
		strict.byId['A'].pressureAtRequired < psi(45),
		strict.byId['A'].pressureAtRequired.toFixed(2) + ' m < ' + psi(45).toFixed(2) + ' m');
	ok('and the pipe running over the velocity limit is named',
		rec.effects.links.some(l => l.id === 'A1' && l.velocity > maxVelocity),
		JSON.stringify(rec.effects.links.map(l => l.id + '=' + l.velocity.toFixed(2))));
	// The design half is read from a probe the bisection had to make anyway.
	ok('the design half costs no extra solve', rec.solves === plain.byId['A'].solves,
		rec.solves + ' with the design half, ' + plain.byId['A'].solves + ' without');
	ok('the starve model is byte-identical afterwards', JSON.stringify(starve) === starveBefore);

	// A requirement small enough to hurt nobody: the design scope is still on, and the state is
	// Pass -- so the DESIGN state comes from a real violation and not from having a scope at all.
	let gentle = await EC.lpnFireFlowSweep(starveModel(), {
		solve: nativeSolve, junctions: ['A'], required: gpm(30), residual: residual,
		design: { nodes: ['A', 'B'], links: ['A1', 'A2'], minPressure: minPressure,
			maxVelocity: maxVelocity },
		yield: noYield
	});
	ok('a fire flow that hurts nobody passes with the design scope on',
		gentle.byId['A'].state === S.PASS, gentle.byId['A'].state);

	// -----------------------------------------------------------------------
	console.log('\n--- 5. the states partition the junctions ---');
	let whole = await EC.lpnFireFlowSweep(starveModel(), {
		solve: nativeSolve, junctions: ['A', 'B'], required: required, residual: residual,
		design: { nodes: ['A', 'B'], links: ['A1', 'A2'], minPressure: minPressure,
			maxVelocity: maxVelocity },
		yield: noYield
	});
	const c = whole.counts, total = c.pass + c.fail + c.design + c.error;
	ok('every junction asked for comes back', whole.results.length === 2, whole.results.length);
	ok('the four buckets add up to the ask', total === whole.requested,
		JSON.stringify(c) + ' = ' + total + ' of ' + whole.requested);
	ok('and every result is in exactly one of them',
		whole.results.every(r => [S.PASS, S.FAIL, S.DESIGN, S.ERROR].filter(s => s === r.state).length === 1));
	ok('B, on the far end of the small pipe, cannot deliver it', whole.byId['B'].state === S.FAIL,
		whole.byId['B'].state);

	// -----------------------------------------------------------------------
	console.log('\n--- 6. the things that are not answers ---');
	// A reservoir is not a junction, and a name that is not in the model is not silently skipped.
	set = await EC.lpnFireFlowSweep(starveModel(), {
		solve: nativeSolve, junctions: ['R', 'nowhere', 'A'], required: gpm(30),
		residual: residual, yield: noYield
	});
	ok('a reservoir is reported, not skipped',
		set.byId['R'].state === S.ERROR && set.byId['R'].code === C.NOT_A_JUNCTION, set.byId['R'].code);
	ok('a name that is not in the model is reported too',
		set.byId['nowhere'].code === C.UNKNOWN_NODE, set.byId['nowhere'].code);
	ok('and the sweep carries on to the junctions after it', set.byId['A'].state === S.PASS);
	ok('the counts still add up', set.counts.pass + set.counts.fail + set.counts.design +
		set.counts.error === 3);

	// A network with no head loss to speak of: the residual still holds at the search ceiling, so
	// the ceiling is reported as a floor under the answer and never as the answer.
	const fat = anchorModel();
	fat.links[0].diameter = 1.2; fat.links[0].length = 5;
	set = await EC.lpnFireFlowSweep(fat, {
		solve: nativeSolve, junctions: ['J'], required: gpm(500), residual: residual, yield: noYield
	});
	rec = set.byId['J'];
	ok('a network with no head loss reports AT LEAST the ceiling', rec.atLeast === true &&
		rec.code === C.AT_LEAST, rec.code);
	ok('and it passes without pretending the ceiling was found', rec.state === S.PASS &&
		rec.available === EC.lpnFireFlowDefaults.maxFlow);

	// -----------------------------------------------------------------------
	console.log('\n--- 7. a stopped sweep is a partial answer, not a discarded one ---');
	let seen = 0;
	set = await EC.lpnFireFlowSweep(starveModel(), {
		solve: nativeSolve, junctions: ['A', 'B'], required: required, residual: residual,
		onProgress: function () { seen++; },
		shouldStop: function () { return seen >= 1; },
		yield: noYield
	});
	ok('the sweep says it was stopped', set.stopped === true);
	ok('and it keeps what it had already worked out', set.results.length === 1, set.results.length);
	ok('progress was reported for each junction as it finished', seen === 1, seen);

	// -----------------------------------------------------------------------
	console.log('\n--- 8. what the run states about itself ---');
	ok('the loss accounting is stated as a value, not implied',
		set.lossAccounting === 'raw-node', set.lossAccounting);
	ok('the ISO single-hydrant credit cap is carried, not applied',
		near(set.isoCap, gpm(1500), 1e-12));
	ok('a required flow is refused rather than defaulted', (function () {
		try {
			EC.lpnFireFlowSweep(anchorModel(), { solve: nativeSolve, junctions: ['J'] });
			return false;
		} catch (e) { return e instanceof TypeError; }
	}()));
	ok('an engine is refused rather than chosen for the caller', (function () {
		try {
			EC.lpnFireFlowSweep(anchorModel(), { junctions: ['J'], required: gpm(500) });
			return false;
		} catch (e) { return e instanceof TypeError; }
	}()));

	console.log('');
	if (fails) { console.log(fails + ' FAILED'); process.exit(1); }
	console.log('all fire flow sweep checks passed');
}()).catch(function (e) { console.error(e); process.exit(1); });
