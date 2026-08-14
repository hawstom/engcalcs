// Does the kept-open EPANET Project ever answer the WRONG network? -- ROADMAP Task 313.
//
//   node dev/lpn-spike/session-harness.js
//
// WHY THIS EXISTS. EngCalcs.lpnSolveEpanet used to hand EPANET a freshly parsed .inp on every
// solve, which was 95% of the round trip (see engine-bench.js) but could not possibly be stale.
// It now keeps the Project open and pushes edits through the toolkit's setters, reopening only
// when a derived structural signature changes. That trade buys ~25x per solve and introduces one
// new failure mode, and the new failure mode is INVISIBLE: a Project that missed an edit returns
// a fully converged, entirely plausible set of heads and flows for the network the user USED to
// have. No exception, no NaN, nothing on screen that looks wrong. A number that is quietly wrong
// is worse than no number, so the reopen trigger cannot be taken on trust.
//
// THE ASSERTION, which is the whole design. For every edit, the incremental answer must equal
// the answer you get from a COLD engine solving the edited model -- and the cold answer is
// produced by the same code path that shipped before Task 313. So one comparison catches both
// halves at once:
//
//   * a MISSED reopen or a value that never got pushed   -> incremental != cold  (staleness)
//   * a setter that disagrees with lpnToInp's writer     -> incremental != cold  (unit/convention)
//
// The second is not hypothetical: pushValues() has to repeat every conversion the .inp writer
// does (diameter m -> mm, demand m3/s -> L/s, a pump curve sampled at [0, 0.5, 0.9] of shutoff),
// and a diameter pushed in metres solves perfectly for a pipe a thousand times too narrow. That
// is the same silent class validate_epanet.js exists for, one layer further in.
//
// Each case also asserts WHICH path ran, by counting calls to EngCalcs.lpnToInp -- only
// openSession() builds an .inp, so that count is an honest reopen counter and needs nothing
// exported from the module for the test's benefit.
//
// AND THE HARNESS IS ITSELF MUTATION-TESTED, every run, in a child process: a copy of
// js/lpn-epanet.js with signatureOf() neutered to a constant (so NOTHING ever triggers a reopen)
// must make this file FAIL. A green harness that would also be green against a broken signature
// is not evidence of anything, and this is the cheapest possible way to keep saying so.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const MODULE_URL = 'file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js');

// Which copy of lpn-epanet.js to test. Normally the real one; the sabotage child points this at
// a deliberately broken copy in a temp dir.
const EPANET_JS = process.env.LPN_SESSION_MODULE || path.join(ROOT, 'js', 'lpn-epanet.js');

require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(EPANET_JS);

// Reopen counter. openSession() is the only caller of lpnToInp, so wrapping it reports exactly
// how many times the engine was handed a fresh network to parse.
let inpBuilds = 0;
const realToInp = EngCalcs.lpnToInp;
EngCalcs.lpnToInp = function () { inpBuilds++; return realToInp.apply(this, arguments); };

let pass = 0, fail = 0;
function check(ok, what, detail) {
	if (ok) { pass++; return true; }
	fail++;
	console.log('FAIL ' + what + (detail ? '   ' + detail : ''));
	return false;
}

const clone = (m) => JSON.parse(JSON.stringify(m));

// A throw is a failure of ONE case, not of the run: a stale Project asked for a node it has
// never heard of raises EPANET error 203, and if that aborted the harness the later cases --
// including the ones that fail QUIETLY, with a plausible wrong number -- would never be reached
// and the sabotage check would prove much less than it looks like it proves.
function solve(model) {
	return EngCalcs.lpnSolveEpanet(model, { moduleUrl: MODULE_URL })
		.catch(e => ({ ok: false, threw: e.message, heads: {}, pressures: {}, flows: {} }));
}
function coldSolve(model) { EngCalcs.lpnEpanetReset(); return solve(model); }

// Largest disagreement over the ids the two results have in common. Comparing only the common
// ids is what lets an ADD or a DELETE be compared at all; every other case has identical id sets.
function worstDiff(a, b) {
	let worst = 0, at = null;
	// PRESSURES are in here for one case and would be easy to leave out: in a demand-driven solve
	// an elevation change moves NOTHING else -- not a head, not a flow -- so head+flow alone
	// cannot tell a pushed elevation from an ignored one.
	for (const field of ['heads', 'pressures', 'flows']) {
		for (const id of Object.keys(a[field] || {})) {
			if (!(id in (b[field] || {}))) { continue; }
			// Flows are ~1e-2 m3/s and heads ~1e2 m in these models, so compare flows on a scale
			// that makes a real change visible next to a head: 1 L/s matters as much as 1 m.
			const scale = field === 'flows' ? 1000 : 1;
			const d = Math.abs(a[field][id] - b[field][id]) * scale;
			if (d > worst) { worst = d; at = field + ':' + id; }
		}
	}
	return { worst, at };
}

// A cold solve and a warm one run the same engine on the same numbers, so they should agree to
// far better than this; 1e-4 is chosen to sit above EPANET's single-precision reporting floor
// (~1e-5, see validate_epanet.js) and thousands of times below any staleness or units error.
const SAME_TOL = 1e-4;
// And an edit that is supposed to change the answer has to change it by more than the noise by a
// wide margin, or "it changed" proves nothing.
const CHANGE_MIN = 1e-2;

// ---------------------------------------------------------------------------------------------
// The base networks. Two loops with every node reachable by more than one route, so closing a
// link is a VALUE edit rather than a structural one (an isolated node is refused by lpnDiagnose
// before the engine is ever reached, which would test nothing).
const cases = require('./cases.js');
const GRID = cases.twoLoopGrid;      // R -> A, loops A-B-C-D-A and B-C-E
const PUMP = cases.pumpCase;         // reservoir, curved pump, two junctions in a loop
const TANK = cases.tankCase;         // two tanks either side of one junction

const node = (m, id) => m.nodes.find(n => n.id === id);
const link = (m, id) => m.links.find(l => l.id === id);

// kind: 'value' expects the open Project to be reused; 'topology' expects a rebuild.
// changes: false for an edit that is genuinely physics-neutral (a rename), where "the answer
// moved" is the wrong question and matching the cold solve is the whole test.
const TESTS = [
	// ---- value edits: the common case, one per keystroke ----
	{ n: 'pipe diameter', base: GRID, kind: 'value', mutate: m => { link(m, 'L2').diameter = 0.12; } },
	{ n: 'junction demand', base: GRID, kind: 'value', mutate: m => { node(m, 'C').demand = 0.09; } },
	{ n: 'junction elevation', base: GRID, kind: 'value', mutate: m => { node(m, 'D').elev = 60; } },
	{ n: 'pipe roughness', base: GRID, kind: 'value', mutate: m => { link(m, 'L3').roughness = 60; } },
	{ n: 'pipe length', base: GRID, kind: 'value', mutate: m => { link(m, 'L4').length = 4000; } },
	{ n: 'minor loss k', base: GRID, kind: 'value', mutate: m => { link(m, 'L1').k = 40; } },
	{ n: 'reservoir head', base: GRID, kind: 'value', mutate: m => { node(m, 'R').head = 200; } },
	{ n: 'close a link', base: GRID, kind: 'value', mutate: m => { link(m, 'L5').status = 'closed'; } },
	{ n: 'add an emitter', base: GRID, kind: 'value', mutate: m => { node(m, 'E').emitter = 0.01; } },
	{
		// The mirror of the one above, and the reason pushValues() writes the emitter even when it
		// is zero: lpnToInp only writes an [EMITTERS] row for a node that HAS one, so a node that
		// lost its emitter would keep discharging if the zero case were skipped.
		n: 'remove an emitter', base: GRID, kind: 'value',
		pre: m => { node(m, 'E').emitter = 0.01; },
		mutate: m => { node(m, 'E').emitter = 0; }
	},
	{ n: 'tank water level', base: TANK, kind: 'value', mutate: m => { node(m, 'T1').level = 2; node(m, 'T1').head = 62; } },
	{ n: 'tank floor elevation', base: TANK, kind: 'value', mutate: m => { node(m, 'T2').elev = 40; node(m, 'T2').head = 49; } },
	{
		// The pump curve is the one value the setters cannot copy from lpnToInp -- pushValues()
		// re-derives the three sample points -- so this case is really asking whether the two
		// samplings still agree. If they ever drift, the warm answer stops matching the cold one.
		n: 'pump shutoff head', base: PUMP, kind: 'value', mutate: m => { link(m, 'PU').h0 = 70; }
	},
	{ n: 'pump curve slope', base: PUMP, kind: 'value', mutate: m => { link(m, 'PU').a = 12000; } },

	// ---- topology edits: discrete clicks, and they must rebuild ----
	{
		n: 'add a node', base: GRID, kind: 'topology',
		mutate: m => {
			m.nodes.push({ id: 'F', type: 'junction', elev: 9, demand: 0.02 });
			m.links.push({ id: 'L8', type: 'pipe', from: 'D', to: 'F', length: 250, diameter: 0.2, roughness: 130, k: 0, status: 'open' });
		}
	},
	{
		n: 'delete a node', base: GRID, kind: 'topology',
		mutate: m => {
			m.nodes = m.nodes.filter(n => n.id !== 'E');
			m.links = m.links.filter(l => l.from !== 'E' && l.to !== 'E');
		}
	},
	{
		// Physics-neutral on purpose. A missed reopen here does not produce a wrong number, it
		// produces a lookup for an id the cached index map has never heard of -- which is why the
		// comparison, not the "did it change" test, is what this case rests on.
		n: 'rename a node', base: GRID, kind: 'topology', changes: false,
		mutate: m => {
			node(m, 'E').id = 'E2';
			m.links.forEach(l => { if (l.from === 'E') { l.from = 'E2'; } if (l.to === 'E') { l.to = 'E2'; } });
		},
		expectIds: ['E2']
	},
	{ n: 'rename a link', base: GRID, kind: 'topology', changes: false, mutate: m => { link(m, 'L6').id = 'L6b'; } },
	{
		// Re-pointing a link is the edit a signature keyed only on ids would miss entirely: the
		// same elements, the same count, a different network.
		n: 're-point a link', base: GRID, kind: 'topology',
		mutate: m => { link(m, 'L7').from = 'D'; }
	},
	{ n: 'friction method to D-W', base: GRID, kind: 'topology', mutate: m => { m.method = 'dw'; m.links.forEach(l => { l.roughness = 0.00015; }); } },
	{ n: 'friction method to Manning', base: GRID, kind: 'topology', mutate: m => { m.method = 'manning'; m.links.forEach(l => { l.roughness = 0.011; }); } },
	{
		// A pump that loses its curve stops being a [PUMPS] row and becomes a [PIPES] row, so it
		// is a topology change even though nothing on the map moved.
		n: 'pump loses its curve', base: PUMP, kind: 'topology',
		mutate: m => { const p = link(m, 'PU'); p.h0 = 0; p.a = 0; }
	},
	{
		n: 'emitter exponent', base: GRID, kind: 'topology',
		pre: m => { node(m, 'E').emitter = 0.01; },
		mutate: m => { m.emitterExponent = 0.9; }
	},
	{
		// A pipe converted to a curveless pump: same id, same endpoints, different element.
		n: 'pipe becomes a pump', base: GRID, kind: 'topology',
		mutate: m => { link(m, 'L6').type = 'pump'; }
	}
];

async function run() {
	for (const t of TESTS) {
		const before = clone(t.base);
		if (t.pre) { t.pre(before); }
		const after = clone(before);
		t.mutate(after);

		// Baseline from a cold engine, so each case starts from a known state rather than
		// inheriting whatever session the previous case left behind.
		const r0 = await coldSolve(before);
		if (!check(r0.ok, t.n + ': baseline solved', r0.threw)) { continue; }

		const builds = inpBuilds;
		const r1 = await solve(after);
		const reopened = inpBuilds > builds;
		if (!check(r1.ok, t.n + ': edited model solved', r1.threw)) { continue; }

		check(reopened === (t.kind === 'topology'), t.n + ': ' + t.kind + ' edit ' +
			(t.kind === 'topology' ? 'must reopen' : 'must reuse the open Project'),
			'reopened=' + reopened);

		if (t.changes !== false) {
			const moved = worstDiff(r0, r1);
			check(moved.worst > CHANGE_MIN, t.n + ': the answer must actually move',
				'worst=' + moved.worst.toExponential(2) + ' @' + moved.at);
		}
		for (const id of (t.expectIds || [])) {
			check(isFinite(r1.heads[id]), t.n + ': result carries ' + id);
		}

		// THE ASSERTION. Whatever path ran, it has to agree with a cold engine given the same
		// model -- the pre-Task-313 behaviour, kept as the reference.
		const r2 = await coldSolve(after);
		const d = worstDiff(r1, r2);
		check(d.worst < SAME_TOL, t.n + ': incremental answer == cold answer',
			'worst=' + d.worst.toExponential(2) + ' @' + d.at);
	}

	// Solving the same model twice must be bit-for-bit repeatable. Cheap, and it is the one thing
	// that would catch a setter that only half-applies (a value pushed on the second pass but not
	// the first would show up here and nowhere else).
	{
		const m = clone(GRID);
		const a = await coldSolve(m);
		const b = await solve(m);
		const d = worstDiff(a, b);
		check(d.worst < SAME_TOL, 'resolving an unchanged model is stable',
			'worst=' + d.worst.toExponential(2) + ' @' + d.at);
	}

	// Warm reuse must be the NORMAL outcome, not an accident. Without this a signature that
	// reopened on everything would pass every case above while delivering none of the speed the
	// task was about.
	{
		const m = clone(GRID);
		await coldSolve(m);
		const builds = inpBuilds;
		for (let i = 0; i < 20; i++) { node(m, 'A').demand = 0.02 + i * 0.001; await solve(m); }
		check(inpBuilds === builds, '20 value edits rebuild the .inp zero times',
			'rebuilds=' + (inpBuilds - builds));
	}

	console.log(`\n${pass} passed, ${fail} failed`);
	if (fail) { process.exit(1); }

	if (!process.env.LPN_SESSION_MODULE) { sabotageCheck(); }
}

// Mutation test. Neuter signatureOf() to a constant -- every model then looks identical to every
// other, so the Project is NEVER rebuilt -- and require this same file to fail against it. If it
// passes, the assertions above are not testing what they claim to and the exit code says so.
function sabotageCheck() {
	const src = fs.readFileSync(path.join(ROOT, 'js', 'lpn-epanet.js'), 'utf8');
	const broken = src.replace("return parts.join('\\u0002');", "return 'ALWAYS-THE-SAME';");
	if (broken === src) {
		console.log('FAIL sabotage: could not find signatureOf\'s return -- this check is dead, fix it');
		process.exit(1);
	}
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lpn-sabotage-'));
	const file = path.join(dir, 'lpn-epanet.js');
	fs.writeFileSync(file, broken);
	let caught = false;
	try {
		execFileSync(process.execPath, [__filename], {
			env: Object.assign({}, process.env, { LPN_SESSION_MODULE: file }),
			stdio: 'pipe'
		});
	} catch (e) {
		caught = true;
	}
	fs.rmSync(dir, { recursive: true, force: true });
	if (!caught) {
		console.log('FAIL sabotage: a signature that never changes still passed every assertion');
		process.exit(1);
	}
	console.log('sabotage check: a constant signature fails the suite, as it must');
}

run().catch(e => { console.error(e); process.exit(1); });
