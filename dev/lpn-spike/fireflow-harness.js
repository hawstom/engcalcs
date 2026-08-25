// Available fire flow at a hydrant -- js/lpn-fireflow.js (ROADMAP Task 530). Run:
//   node dev/lpn-spike/fireflow-harness.js
//
// THE SOLVES HERE ARE REAL. CLAUDE.md's standing warning is the whole design of this file: a stub
// that holds pressure constant while flow varies makes a bisection harness pass for the wrong
// reason, because the quantity the search is searching ON is the one the stub froze. So every
// assertion below except the two that are ABOUT a broken solve drives EngCalcs.lpnSolve on a real
// network, and the headline answer is checked against arithmetic done here from the other
// direction -- EPANET's published US 4.727 Hazen-Williams equation and a bisection written in this
// file, neither of which shares a line with the solver.
//
// ---------------------------------------------------------------------------
// THE WORKED EXAMPLE, and its arithmetic
// ---------------------------------------------------------------------------
// Network: a reservoir at head 60 m, one 600 m 8 in (0.2032 m) C=130 main to junction J1, which
// carries an ordinary 0.02 m3/s background demand. A hydrant hangs off J1 on a 50 ft (15.24 m)
// lateral; everything else is this module's disclosed default -- 6 in C=130 lateral, 4.5 in C=130
// barrel 5 ft long, K = 4.958. The residual is the default 20 psi = 14.0614 m of water.
//
// At the answer Q = 1555.5 gpm (0.098135 m3/s) the head budget closes on the reservoir exactly:
//
//     main P1, carrying Q + 0.02             35.0199 m
//     lateral friction, 15.24 m of 6 in       2.5618 m
//     minor loss, K = 4.958 at 6 in           7.3167 m     <- 2.9x the lateral's own friction
//     barrel friction, 5 ft of 4.5 in         1.0402 m
//     residual held at the outlet            14.0614 m
//                                          -----------
//                                            60.0000 m  = the reservoir head
//
// Note the third row against the second: the research said minor loss is 2-4x friction across
// every realistic lateral length, and this network reproduces that without being tuned to.
//
// THE BARREL CONSTRICTION IS WORTH 16 gpm HERE, and the honest reading of that number is in the
// assertion below: 5 ft of 4.5 in waterway loses 1.0402 m where 5 ft of 6 in would lose 0.2562 m,
// so leaving the constriction out overstates this hydrant by 1.06%. The barrel's real cost is not
// its friction -- it is the AWWA C502 QA term inside K, which is worth 11.6%.
//
// WHICH VELOCITY THE k BELONGS TO gets its own block of assertions, and it is the one block here
// written to catch a FUTURE edit rather than to check today's answer. A k is meaningless without
// its reference velocity; this assembly has two diameters; and the solver reads a link's k against
// that link's own area, so moving the k from the lateral to the barrel silently re-references it
// and inflates its head loss by (6/4.5)^4 = 3.16x. Proven to bite by mutation: putting the k on
// the barrel link in js/lpn-fireflow.js turns the answer from 1555.2 gpm into 1308.4 gpm and fails
// four assertions -- the structural pair on where the k sits, and the pair that compares the
// answer against a root find run at each of the two reference velocities.
//
// SI throughout, like the module. gpm appears only in the printed messages.

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

const GPM = 1 / EC.lpnFireFlowGpmToSI(1);       // m3/s -> gpm, for messages only
const g = (q) => (q * GPM).toFixed(1) + ' gpm';

// The engine, injected exactly as the page will inject it. Synchronous here.
const solve = (m) => EC.lpnSolve(m, { tol: 1e-12 });

function network(head) {
	return {
		method: 'hw',
		nodes: [
			{ id: 'R', type: 'reservoir', elev: 0, head: head === undefined ? 60 : head },
			{ id: 'J1', type: 'junction', elev: 0, demand: 0.02 }
		],
		links: [{
			id: 'P1', type: 'pipe', from: 'R', to: 'J1', length: 600, diameter: 0.2032,
			roughness: 130, k: 0, status: 'open'
		}]
	};
}
const BASE = { solve: solve, hydrantNode: 'J1', lateralLength: 15.24 };
function opts(extra) {
	const o = {}; Object.keys(BASE).forEach(k => { o[k] = BASE[k]; });
	Object.keys(extra || {}).forEach(k => { o[k] = extra[k]; });
	return o;
}

// ---- the independent arithmetic -------------------------------------------
// EPANET's own published equation in the US units it is stated in, and this file's own root find.
// Deliberately NOT a call into EngCalcs.hwSlope: the value of this check is that it arrives from
// the other direction.
const FT = 0.3048, CFS = FT * FT * FT;
function usLoss(q, L, d, C) {
	return 4.727 * (L / FT) * Math.pow(q / CFS, 1.852) /
		(Math.pow(C, 1.852) * Math.pow(d / FT, 4.871)) * FT;
}
const A6 = Math.PI * 0.1524 * 0.1524 / 4;
// `kD` IS THE DIAMETER THE k IS REFERENCED TO, and it is a parameter here on purpose: the whole
// point of the reference assertions below is that this arithmetic can be run BOTH ways, so the
// right answer and the mis-referenced one are two calls to one function rather than two functions
// nobody can compare. The default is the 6 in lateral, which is where the module puts the k.
function outletHead(Q, K, barrelD, kD) {
	const A = kD === undefined ? A6 : Math.PI * kD * kD / 4;
	const v = Q / A;
	return 60 - usLoss(Q + 0.02, 600, 0.2032, 130) - usLoss(Q, 15.24, 0.1524, 130)
		- K * v * v / (2 * EC.G) - usLoss(Q, 5 * FT, barrelD, 130);
}
function handAnswer(K, barrelD, kD) {
	const target = 20 * (4.4482216152605 / (0.0254 * 0.0254)) / (1000 * EC.G);
	let lo = 0, hi = 1;
	for (let i = 0; i < 200; i++) {
		const mid = (lo + hi) / 2;
		if (outletHead(mid, K, barrelD, kD) >= target) { lo = mid; } else { hi = mid; }
	}
	return lo;
}

(async function () {

	console.log('\n--- the k is derived from its sources, not typed in ---');
	{
		const K = EC.lpnFireFlowK;
		// 3.0 psi at 1000 gpm through the 4.5 in nozzle, referenced to the 6 in lateral velocity
		// (AWWA C502 QA clause). Done here from scratch: 3.0 psi = 2.1088 m, V = 3.4586 m/s.
		const h = 3 * (4.4482216152605 / (0.0254 * 0.0254)) / (1000 * EC.G);
		const V = EC.lpnFireFlowGpmToSI(1000) / A6;
		ok('the barrel/valve/nozzle k is the AWWA C502 QA ceiling',
			Math.abs(K.barrelAtLateralVelocity - h / (V * V / (2 * EC.G))) < 1e-12,
			K.barrelAtLateralVelocity.toFixed(4));
		ok('...which is the ~3.5 the research reported',
			K.barrelAtLateralVelocity > 3.4 && K.barrelAtLateralVelocity < 3.5);
		ok('the Crane TP-410 fitting build-up is 1.5',
			Math.abs(K.fittingsAtLateralVelocity - 1.5) < 1e-12);
		ok('the recommended total is ~5 and inside the research range 3-6',
			K.totalAtLateralVelocity > 3 && K.totalAtLateralVelocity < 6 &&
			Math.abs(K.totalAtLateralVelocity - 5) < 0.1, K.totalAtLateralVelocity.toFixed(4));
		ok('every exported k NAMES the velocity it is referenced to',
			Object.keys(K).filter(n => /^(barrel|fittings|total)/.test(n))
				.every(n => /AtLateralVelocity$/.test(n)), Object.keys(K).join(' '));
		ok('...and the reference is the 6 in lateral, stated as data',
			K.referenceLink === 'lateral' && Math.abs(K.referenceDiameter - 6 * 0.0254) < 1e-12);
		ok('20 psi is 14.0614 m of water', Math.abs(EC.lpnFireFlowPsiToHead(20) - 14.0614) < 1e-3,
			EC.lpnFireFlowPsiToHead(20).toFixed(6));
		ok('there is NO default lateral length -- it must be supplied',
			EC.lpnFireFlowDefaults.lateralLength === null);
		ok('the default barrel is the 4.5 in waterway, not the 6 in shoe',
			Math.abs(EC.lpnFireFlowDefaults.barrelDiameter - 4.5 * 0.0254) < 1e-12);
	}

	console.log('\n--- the worked example, against arithmetic done the other way ---');
	const model = network();
	const before = JSON.stringify(model);
	const r = await EC.lpnFireFlow(model, opts());
	{
		const hand = handAnswer(EC.lpnFireFlowK.totalAtLateralVelocity, 0.1143);
		const bracket = r.bracket.high - r.bracket.low;
		ok('it reports an answer', r.ok && r.code === 'ok', r.code + '  ' + g(r.flow));
		ok('the flow matches the independent root find', Math.abs(r.flow - hand) <= bracket,
			g(r.flow) + ' vs ' + g(hand));
		// The search reports `lo`, the largest flow KNOWN to hold the residual, so it can only err
		// low. A fire-flow number that erred high would be the dangerous direction.
		ok('...and errs low, never high', r.flow <= hand + 1e-15);
		ok('the residual is met at the reported flow', r.residualAt >= r.residual,
			r.residualAt.toFixed(4) + ' m >= ' + r.residual.toFixed(4) + ' m');
		ok('the static pressure is reported too', Math.abs(r.staticPressure - 58.69) < 0.02,
			r.staticPressure.toFixed(3) + ' m');
		ok('the critical node defaults to the hydrant OUTLET',
			r.criticalNode === r.elements.outletNode, r.criticalNode);
		ok('the search is cheap -- one solve at rest, one at the ceiling, then the bisection',
			r.solves > 10 && r.solves < 25, r.solves + ' solves');
	}

	console.log('\n--- WHICH VELOCITY THE k BELONGS TO (Tom: "critical in the hydrant model") ---');
	{
		// A k is meaningless without its reference velocity, and this assembly has two diameters.
		// h = k V^2/2g and V goes as 1/D^2, so the SAME k referenced to the barrel instead of the
		// lateral develops (D_lateral/D_barrel)^4 times the head loss. That factor is the size of
		// the mistake, and these assertions exist to make a future edit that re-references the k
		// fail loudly rather than report a plausible, wrong hydrant.
		const RATIO = Math.pow(0.1524 / 0.1143, 4);       // (6 / 4.5)^4 = 3.1605
		ok('mis-referencing the k to the barrel would inflate its loss 3.16x',
			Math.abs(RATIO - 3.1605) < 1e-3, RATIO.toFixed(4) + 'x');

		// 1. STRUCTURAL. The link a k sits on IS its reference velocity, because the solver reads
		// k against that link's own area. So the whole k must be on the lateral and the barrel's
		// must be exactly zero -- not small, zero.
		const b = EC.lpnFireFlowBuild(network(), { hydrantNode: 'J1', lateralLength: 15.24 });
		const byId = {}; b.model.links.forEach(l => { byId[l.id] = l; });
		const lat = byId[b.elements.lateralLink], bar = byId[b.elements.barrelLink];
		ok('the build REPORTS which link carries the k, rather than leaving it to be inferred',
			b.elements.kOnLink === b.elements.lateralLink, b.elements.kOnLink);
		ok('the k is on the lateral and the lateral is the 6 in one',
			lat.k === EC.lpnFireFlowK.totalAtLateralVelocity &&
			Math.abs(lat.diameter - 0.1524) < 1e-12, lat.k.toFixed(4) + ' at ' + lat.diameter + ' m');
		ok('the barrel carries NO k at all', bar.k === 0 && Math.abs(bar.diameter - 0.1143) < 1e-12);
		ok('the link carrying the k has the diameter the result says it is referenced to',
			Math.abs(byId[b.elements.kOnLink].diameter - b.assembly.k.referencedTo.diameter) < 1e-12);
		ok('the result names the reference velocity in words too',
			b.assembly.k.referencedTo.link === 'lateral' &&
			/referenced to the velocity in the lateral/i.test(b.assembly.k.referencedTo.basis));
		ok('...and both k pieces declare the SAME reference, which is what lets them be added',
			b.assembly.k.parts.every(p => p.referencedTo === 'lateral'));
		ok('the diameter the k was DERIVED at is reported beside the one in force',
			Math.abs(b.assembly.k.derivedAtDiameter - 6 * 0.0254) < 1e-12);
		// Override the lateral and the reference velocity moves with it. The result must follow,
		// or an interface would disclose the wrong reference for a k it is still applying.
		const wideLat = EC.lpnFireFlowBuild(network(),
			{ hydrantNode: 'J1', lateralLength: 15.24, lateralDiameter: 0.2032 });
		ok('overriding the lateral moves the reference, and the result says so',
			Math.abs(wideLat.assembly.k.referencedTo.diameter - 0.2032) < 1e-12 &&
			Math.abs(wideLat.assembly.k.derivedAtDiameter - 6 * 0.0254) < 1e-12);

		// 2. THE ANSWER. The structural checks above pin where the number sits; this one pins what
		// the SOLVER did with it, which is the fact that actually reaches a user. Two runs of the
		// same independent root find, differing only in which diameter the k is referenced to.
		const K = EC.lpnFireFlowK.totalAtLateralVelocity;
		const atLateral = handAnswer(K, 0.1143, 0.1524);
		const atBarrel = handAnswer(K, 0.1143, 0.1143);
		const bracket = r.bracket.high - r.bracket.low;
		ok('the two references are far apart -- this assertion has something to bite on',
			(atLateral - atBarrel) * GPM > 200,
			g(atLateral) + ' referenced to the lateral vs ' + g(atBarrel) + ' to the barrel, ' +
			((atLateral / atBarrel - 1) * 100).toFixed(1) + '% apart');
		ok('the reported flow is the LATERAL-referenced one', Math.abs(r.flow - atLateral) <= bracket,
			g(r.flow));
		ok('...and is nowhere near the barrel-referenced one',
			Math.abs(r.flow - atBarrel) > 100 * bracket,
			g(Math.abs(r.flow - atBarrel)) + ' away, against a ' + g(bracket) + ' bracket');

		// 3. A SUPPLIED k. The caller's number is applied at the lateral's velocity whether they
		// meant that or not, so the result has to SAY which velocity it assumed -- otherwise a
		// coefficient pasted from a table that meant a nozzle velocity is silently mis-applied.
		const mine = await EC.lpnFireFlow(network(), opts({ k: 4, lateralDiameter: 0.2032 }));
		ok('a supplied k states the velocity it is assumed to be referenced to',
			mine.assembly.k.referencedTo.link === 'lateral' &&
			Math.abs(mine.assembly.k.referencedTo.diameter - 0.2032) < 1e-12 &&
			/TAKEN TO BE REFERENCED/.test(mine.assembly.k.referencedTo.basis));
		ok('...and tells the caller how to re-reference one that meant another velocity',
			/fourth\s+power/.test(mine.assembly.k.referencedTo.basis));
	}

	console.log('\n--- the user’s model is untouched (the add-on is ad-hoc) ---');
	{
		ok('the input model is byte-identical after the search', JSON.stringify(model) === before);
		ok('nothing invented was added to its nodes', model.nodes.length === 2);
		ok('nothing invented was added to its links', model.links.length === 1);
		ok('the assembly ids are namespaced off the hydrant node',
			r.elements.lateralLink === 'J1~lateral' && r.elements.barrelLink === 'J1~barrel' &&
			r.elements.outletNode === 'J1~outlet', r.elements.lateralLink);
	}

	console.log('\n--- the assembly changes the answer, or none of it is doing anything ---');
	{
		// Same network, barrel bored out to the lateral's 6 in: the constriction removed and
		// nothing else. If this came back equal, the barrel would be decorative.
		const wide = await EC.lpnFireFlow(network(), opts({ barrelDiameter: 0.1524 }));
		const gain = wide.flow / r.flow - 1;
		ok('removing the barrel constriction overstates the hydrant by ~1%',
			gain > 0.008 && gain < 0.015, (gain * 100).toFixed(2) + '%  (' +
			g(wide.flow) + ' vs ' + g(r.flow) + ')');
		ok('...and that is far outside the search bracket, so it is a real difference',
			wide.flow - r.flow > 10 * (r.bracket.high - r.bracket.low));
		ok('the wide barrel matches ITS own independent root find',
			Math.abs(wide.flow - handAnswer(EC.lpnFireFlowK.totalAtLateralVelocity, 0.1524)) <=
			wide.bracket.high - wide.bracket.low, g(wide.flow));

		// And the k, which the research says is the bigger of the two and which Tom ruled may
		// never be zero. This run exists to size what a zero k would cost, not to offer it.
		const noK = await EC.lpnFireFlow(network(), opts({ k: 0 }));
		const kGain = noK.flow / r.flow - 1;
		ok('dropping the k overstates the hydrant by ~12% -- the larger error of the two',
			kGain > 0.10 && kGain < 0.13, (kGain * 100).toFixed(2) + '%  (' + g(noK.flow) + ')');

		// Longer lateral, less flow. Monotone in the obvious direction, which a frozen-pressure
		// stub could not have produced.
		const long = await EC.lpnFireFlow(network(), opts({ lateralLength: 30.48 }));
		ok('doubling the lateral to 100 ft reduces the flow', long.flow < r.flow,
			g(long.flow) + ' vs ' + g(r.flow));
	}

	console.log('\n--- what was used, and whether it was supplied or disclosed ---');
	{
		const a = r.assembly;
		ok('the supplied lateral length is marked supplied',
			a.lateral.length.source === 'supplied' && a.lateral.length.value === 15.24);
		ok('the defaulted diameter is marked default',
			a.lateral.diameter.source === 'default' &&
			Math.abs(a.lateral.diameter.value - 6 * 0.0254) < 1e-12);
		ok('the k arrives in TWO labelled pieces, never one number',
			a.k.parts.length === 2 && /AWWA C502/.test(a.k.parts[0].basis) &&
			/Crane/.test(a.k.parts[1].basis));
		ok('...and the pieces sum to the total', Math.abs(
			a.k.parts[0].value + a.k.parts[1].value - a.k.total.value) < 1e-12);
		const supplied = (await EC.lpnFireFlow(network(), opts({ k: 4 }))).assembly.k;
		ok('a supplied k is marked supplied and claims no research provenance',
			supplied.total.source === 'supplied' && supplied.total.value === 4 &&
			supplied.parts.length === 0);
	}

	console.log('\n--- ISO caps the CREDIT, so it is a note beside the number, never a clamp ---');
	{
		const note = r.notes[0];
		ok('the note is present and names itself', note.code === 'iso-single-hydrant-cap');
		ok('the cap is 1,500 gpm in SI', Math.abs(note.limit - 1500 / GPM) < 1e-15);
		ok('this hydrant exceeds it', note.exceeded === true, g(r.flow));
		// The whole point: the reported flow is the computed one. A silently clamped number would
		// be a lie with a tidy face.
		ok('the reported flow is NOT clamped to the cap', r.flow > note.limit,
			g(r.flow) + ' > ' + g(note.limit));
		const weak = await EC.lpnFireFlow(network(35), opts());
		ok('a weaker network reports exceeded = false',
			weak.ok && weak.notes[0].exceeded === false, g(weak.flow));
	}

	console.log('\n--- every edge case is NAMED, and none of them is a number ---');
	{
		// 1. Already under the residual with the hydrant shut. THE QUESTION HAS NO ANSWER HERE,
		// which is not the same fact as an answer of zero: available fire flow is defined as the
		// flow at which the critical node still holds the residual, and no flow satisfies that
		// definition on this network. So the case is named, carries no flow field, and states the
		// reason itself -- a caller must be able to say "there is no such flow" without having
		// read js/lpn-fireflow.js.
		const dead = await EC.lpnFireFlow(network(10), opts());
		ok('below the residual at rest is reported by name',
			dead.ok === false && dead.code === 'below-residual-at-rest', dead.code);
		ok('...and carries no flow at all', dead.flow === undefined,
			'staticPressure = ' + dead.staticPressure.toFixed(3) + ' m');
		ok('...and says WHY there is no number, rather than leaving a zero to be inferred',
			/no such flow/.test(dead.basis) && /not an available fire flow of zero/.test(dead.basis));

		// 2. The residual still met at the ceiling. Driven here by lowering the ceiling, which is
		// the same code path a frictionless model would take at the default 10,000 gpm and costs
		// two solves instead of sixteen.
		const ceil = await EC.lpnFireFlow(network(), opts({ maxFlow: EC.lpnFireFlowGpmToSI(50) }));
		ok('reaching the search ceiling is reported by name',
			ceil.ok === false && ceil.code === 'search-ceiling-reached', ceil.code);
		ok('...and the ceiling is NOT reported as the answer',
			ceil.flow === undefined && Math.abs(ceil.ceiling - EC.lpnFireFlowGpmToSI(50)) < 1e-15,
			'ceiling = ' + g(ceil.ceiling));

		// 3. A solve that does not converge. THIS is the one place a stub is right: the coupling
		// under test is "what does the search do when the engine cannot answer", and a real
		// network that reliably fails to converge at a chosen flow does not exist to hand. The
		// stub wraps the REAL solver and flips one flag, so pressures are still real and the
		// convergence check is the only thing being exercised.
		let n = 0;
		const flaky = (m) => {
			const out = EC.lpnSolve(m, { tol: 1e-12 });
			n++;
			if (n === 4) { out.converged = false; out.maxFlowChange = 1e-2; }
			return out;
		};
		const stuck = await EC.lpnFireFlow(network(), opts({ solve: flaky }));
		ok('a non-converged trial is reported by name',
			stuck.ok === false && stuck.code === 'solve-did-not-converge', stuck.code);
		ok('...and names the flow it happened at', stuck.flowAtFailure > 0,
			g(stuck.flowAtFailure));

		// 4. Nodes that are not there, or are the wrong kind of thing.
		const noNode = await EC.lpnFireFlow(network(), opts({ hydrantNode: 'J9' }));
		ok('an unknown hydrant node is reported by name',
			noNode.code === 'hydrant-node-not-found' && noNode.id === 'J9');
		const noCrit = await EC.lpnFireFlow(network(), opts({ criticalNode: 'J9' }));
		ok('an unknown critical node is reported by name',
			noCrit.code === 'critical-node-not-found' && noCrit.id === 'J9');
		const onRes = await EC.lpnFireFlow(network(), opts({ hydrantNode: 'R' }));
		ok('a hydrant asked for on a reservoir is reported by name',
			onRes.code === 'hydrant-node-not-a-junction' && onRes.type === 'reservoir');
		const noLen = await EC.lpnFireFlow(network(), opts({ lateralLength: undefined }));
		ok('a missing lateral length is reported by name, not defaulted',
			noLen.code === 'lateral-length-required');

		// 5. The engine is the caller's to choose, so failing to name one is a wiring error and
		// throws rather than returning a number.
		let threw = false;
		try { EC.lpnFireFlow(network(), { hydrantNode: 'J1', lateralLength: 15.24 }); }
		catch (e) { threw = e instanceof TypeError; }
		ok('omitting the injected solve throws', threw);
	}

	console.log('\n--- the injected solve: async for both, and the caller names the node ---');
	{
		// The page will pass EngCalcs.lpnSolveEpanet, which returns a promise. Same answer, same
		// shape -- that is the whole reason lpnFireFlow always returns a promise.
		const asPromise = (m) => Promise.resolve().then(() => EC.lpnSolve(m, { tol: 1e-12 }));
		const async1 = await EC.lpnFireFlow(network(), opts({ solve: asPromise }));
		ok('a promise-returning engine gives the identical answer', async1.flow === r.flow,
			g(async1.flow));

		// A critical node named UPSTREAM of the hydrant. Worth pinning because it is not a bug:
		// this is a demand-driven solve, so losses downstream of the tee cannot change J1's own
		// pressure, and the assembly stops mattering to the ANSWER while still mattering to what
		// the hydrant can actually deliver. That is exactly why the outlet is the default.
		const atJ1 = await EC.lpnFireFlow(network(), opts({ criticalNode: 'J1' }));
		const atJ1Wide = await EC.lpnFireFlow(network(),
			opts({ criticalNode: 'J1', barrelDiameter: 0.1524 }));
		ok('a critical node in the caller’s own model is honoured', atJ1.criticalNode === 'J1');
		ok('...and it yields more flow than the outlet does', atJ1.flow > r.flow,
			g(atJ1.flow) + ' vs ' + g(r.flow));
		ok('...and the assembly cannot move a pressure upstream of itself',
			atJ1.flow === atJ1Wide.flow);
	}

	console.log(fails === 0 ? '\nAll fire-flow checks passed.\n' : '\n' + fails + ' FAILED\n');
	process.exit(fails === 0 ? 0 : 1);
}());
