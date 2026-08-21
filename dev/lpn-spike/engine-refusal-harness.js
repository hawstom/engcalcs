// A RUN EPANET REFUSED MUST NOT READ AS A RUN THAT HAPPENED -- ROADMAP Task 471, and the
// reporting half of Task 466.
//
//   node dev/lpn-spike/engine-refusal-harness.js
//
// EngCalcs.lpnEpanetRun used to THROW on an input EPANET rejected, and js/lpn-time.js's single
// rejection handler called noEngine() -- so a refusal and an unreachable engine arrived at the
// same place and said the same thing. What the user then saw was our own steady answer, at one
// instant, with nothing on screen saying the engine never ran. That is why one dangling
// [CONTROLS] line presented itself as "the Run button doesn't do anything".
//
// THE LOAD-BEARING PART IS THAT THE REFUSAL IS REAL. Everything in section 2 runs the vendored
// EPANET engine against Net3 with one sentence forced back in that the page normally drops, and
// checks that the engine really does say no -- exactly the pairing
// dev/lpn-spike/control-dangling-harness.js uses. A stub that resolved `{refused: true}` would
// make every assertion here pass while proving nothing about the engine at all.
//
// Section 1 is the OTHER half of the same claim and has to run FIRST, before any successful
// import: an absent engine must still REJECT, or the distinction this task is about does not
// exist. (lpnEpanetLoad caches the module promise, so a bad URL after a good load is ignored.)

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));
const { buildModel } = require('./net3-model.js');

let failures = 0;
function check(ok, msg, detail) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg + (detail === undefined ? '' : `  (${detail})`));
	if (!ok) failures++;
}
function eq(a, b, msg) { check(JSON.stringify(a) === JSON.stringify(b), `${msg}  (${JSON.stringify(a)})`); }
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const ENGINE = 'file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js');

// ================================================================================================
// 1. AN ABSENT ENGINE STILL REJECTS
// ================================================================================================
async function absentEngineSection() {
	console.log('\n---- no engine at all: still a rejected promise ----');
	// A network that PASSES lpnDiagnose, or the run would answer from our own diagnostics and
	// never reach for the engine at all.
	const model = {
		nodes: [{ id: 'R1', type: 'reservoir', head: 100 }, { id: 'J1', type: 'junction', elev: 0, demand: 0.001 }],
		links: [{ id: 'P1', type: 'pipe', from: 'R1', to: 'J1', diameter: 0.2, roughness: 130, length: 100 }],
		method: 'hw'
	};
	let rejected = false, resolvedWith = null;
	try {
		resolvedWith = await EngCalcs.lpnEpanetRun(model, {
			moduleUrl: 'file://' + path.join(ROOT, 'js', 'vendor', 'no-such-engine.js')
		});
	} catch (e) { rejected = true; }
	check(rejected, 'an engine that cannot be imported REJECTS, which is what noEngine() answers',
		rejected ? '' : JSON.stringify(resolvedWith));
	check(!resolvedWith || !resolvedWith.refused,
		'...and is never dressed up as a refusal, which would blame a network that is fine');
}

// ================================================================================================
// 2. A REAL REFUSAL, FROM THE REAL ENGINE
// ================================================================================================
async function refusalSection() {
	console.log('\n---- EPANET reads Net3 and says no ----');
	const inp = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8');
	const parsed = EngCalcs.lpnInpParse(inp);
	const model = buildModel(EngCalcs, parsed);
	await EngCalcs.lpnEpanetLoad(ENGINE);

	// The control the page drops: a sentence naming a link nobody drew. Forced back in, because
	// the guard is only worth testing if what it guards against is real.
	const dangling = { link: 'GONE', action: { status: 'open' }, condition: { kind: 'time', seconds: 3600 } };
	const bad = Object.assign({}, model, {
		time: Object.assign({}, model.time, { controls: model.time.controls.concat([dangling]) })
	});

	let threw = '';
	let run = null;
	try { run = await EngCalcs.lpnEpanetRun(bad, { moduleUrl: ENGINE }); }
	catch (e) { threw = String((e && e.message) || e); }

	check(threw === '', 'a network EPANET rejects RESOLVES rather than throwing', threw);
	check(!!run && run.ok === false, 'and the result says the run did not happen');
	check(!!run && run.refused === true,
		'and says REFUSED -- the one field that tells this apart from an unreachable engine');
	check(!!run && typeof run.engineError === 'string' && run.engineError.length > 0,
		'carrying EPANET\'s own words, which are the only thing that names what it choked on',
		run && run.engineError);
	eq(run && run.frames.length, 0, 'and no frames, so nothing partial can be drawn as a whole run');

	// THE CONTROL, and the pairing that keeps the assertions above honest: the SAME network with
	// that one sentence left out is accepted and runs. Without this, everything above would still
	// pass if the engine refused Net3 for some reason of its own.
	const good = await EngCalcs.lpnEpanetRun(model, { moduleUrl: ENGINE });
	check(good.ok === true, 'while the same network WITHOUT that sentence runs', good.ok ? '' : good.engineError);
	check(!good.refused, '...and is not marked refused');
	check(good.frames.length > 0, '...and produces frames', String(good.frames.length));

	// ---- the steady-state path, which had the same defect ----
	// TWO JUNCTIONS SHARING AN ID -- one rename away on a real page, and a state lpnDiagnose does
	// not look for, so EPANET is the first thing that sees it. (A link pointing at a node that is
	// not there would be caught by our own diagnostics first and never reach the engine, which
	// would test the wrong path.)
	const orphan = {
		nodes: [{ id: 'R1', type: 'reservoir', head: 100 },
			{ id: 'J1', type: 'junction', elev: 0, demand: 0.001 },
			{ id: 'J1', type: 'junction', elev: 0, demand: 0.001 }],
		links: [{ id: 'P1', type: 'pipe', from: 'R1', to: 'J1', diameter: 0.2, roughness: 130, length: 100 }],
		method: 'hw'
	};
	let steadyThrew = '';
	let steady = null;
	try { steady = await EngCalcs.lpnSolveEpanet(orphan, { moduleUrl: ENGINE }); }
	catch (e) { steadyThrew = String((e && e.message) || e); }
	check(steadyThrew === '', 'a one-moment solve EPANET rejects also resolves rather than throwing', steadyThrew);
	check(!!steady && steady.ok === false && steady.refused === true,
		'...and is marked refused, not "did not converge"',
		steady && steady.engineError);

	// The session must have been dropped, or the NEXT solve answers out of a half-built Project.
	EngCalcs.lpnEpanetReset();
	const after = await EngCalcs.lpnSolveEpanet({
		nodes: [{ id: 'R1', type: 'reservoir', head: 100 }, { id: 'J1', type: 'junction', elev: 0, demand: 0.001 }],
		links: [{ id: 'P1', type: 'pipe', from: 'R1', to: 'J1', diameter: 0.2, roughness: 130, length: 100 }],
		method: 'hw'
	}, { moduleUrl: ENGINE });
	check(after.ok === true, 'and a sound network solves straight afterwards, from a clean Project');
}

// ================================================================================================
// 3. WHAT WE LEFT OUT, SAID OUT LOUD (Task 466)
// ================================================================================================
async function warningsSection() {
	console.log('\n---- the controls we dropped now have a channel ----');
	const doc = {
		times: EngCalcs.lpnTimesDefaults(),
		patterns: [], defaultPattern: null,
		nodes: [{ id: 'T1', type: 'tank', elev: 0, level: 3 }, { id: 'J1', type: 'junction', elev: 0 }],
		links: [{ id: 'P1', type: 'pipe', from: 'T1', to: 'J1' }],
		controls: [
			{ link: 'P1', action: { status: 'closed' }, condition: { kind: 'time', seconds: 3600 } },
			{ link: 'GONE', action: { status: 'open' }, condition: { kind: 'time', seconds: 7200 } },
			{ link: 'P1', action: { status: 'open' }, condition: { kind: 'node', node: 'VANISHED', cmp: 'below', value: 2 } },
			{ link: 'P1', raw: 'LINK P1 OPEN IF SOMETHING', action: {}, condition: null, text: {} }
		]
	};
	const block = EngCalcs.lpnTimeModelBlock(doc, (v) => v);
	eq(block.controls.length, 1, 'only the one live, readable control reaches the solver');
	const codes = (block.warnings || []).map((w) => w.code).sort();
	eq(codes, ['control-dangling', 'control-unreadable'],
		'and the three drops are STATED rather than silent, which was the whole of Task 466');
	const dangling = block.warnings.filter((w) => w.code === 'control-dangling')[0];
	eq(dangling.ids.sort(), ['GONE', 'VANISHED'],
		'naming the element on either side -- the controlled link and the watched node');

	// The channel only means something if it comes out the other end. lpnToInp concatenates it
	// into the same warnings array js/looped-network.js already reads, so there is one place to
	// look for "what did we ignore" rather than two.
	const model = {
		nodes: [{ id: 'R1', type: 'reservoir', head: 100 }, { id: 'J1', type: 'junction', elev: 0, demand: 0.001 }],
		links: [{ id: 'P1', type: 'pipe', from: 'R1', to: 'J1', diameter: 0.2, roughness: 130, length: 100 }],
		method: 'hw', time: block
	};
	const built = EngCalcs.lpnToInp(model, { eps: true });
	const outCodes = built.warnings.map((w) => w.code).sort();
	eq(outCodes, ['control-dangling', 'control-unreadable'],
		'the block\'s warnings ride out on the .inp\'s own warnings array');
	check(!/GONE|VANISHED/.test(built.inp),
		'...while the dropped sentences themselves never reach EPANET, which would reject the lot');

	// A document that DECLARES no topology (a block built straight from a parsed file) must warn
	// about nothing: there is no list to check against, and filtering would drop every control.
	const fromFile = EngCalcs.lpnTimeModelBlock(
		{ times: doc.times, patterns: [], controls: [doc.controls[1]] }, (v) => v);
	eq(fromFile.controls.length, 1, 'a block with no element arrays keeps its controls...');
	eq(fromFile.warnings.length, 0, '...and warns about nothing, because it was never asked');
}

// ================================================================================================
// 4. WHAT THE PAGE SAYS
// ================================================================================================
async function pageSection() {
	console.log('\n---- the three sentences a refused run owes the user ----');
	const doc = { times: EngCalcs.lpnTimesDefaults(), nodes: [], links: [] };
	doc.times.duration = 86400;
	let natives = 0, status = '';
	const solveNow = () => { EngCalcs.lpnTimeRun({ nodes: [{ id: 'J1', type: 'junction', elev: 1 }], links: [] }); };
	EngCalcs.lpnTimeInit({
		tabs: [],
		doc: () => doc,
		apply: () => {}, status: (t) => { status = t; },
		solve: solveNow, solveNow: solveNow,
		native: () => { natives++; return { ok: true, converged: true, heads: {}, flows: {} }; },
		snapshot: () => {}, save: () => {},
		toSI: (v) => v, toDisplay: (v) => v, unitLabel: () => ''
	});
	EngCalcs.LPN_TIME_AUTO.idleMs = 40;
	EngCalcs.LPN_TIME_AUTO.budgetMs = 60;

	// ---- a REFUSAL ----
	const WORDS = 'Error 205: function call contains undefined link';
	EngCalcs.lpnEpanetRun = () => wait(5).then(() => ({
		ok: false, refused: true, engine: 'epanet', issues: [], warnings: [], frames: [],
		engineError: WORDS, report: 'EPANET wrote this while refusing'
	}));
	natives = 0;
	EngCalcs.lpnTimeArrived();
	EngCalcs.lpnTimeRunNow();
	await wait(80);
	check(/would not accept/.test(status), '(a) the user is told EPANET refused the network', status);
	check(status.indexOf(WORDS) >= 0, '(b) ...in the engine\'s own words, so they can act on it');
	check(/built-in solver/.test(status), '(c) ...and that the numbers on screen came from our solver');
	check(natives > 0, 'and the built-in solver really was the one that produced them', String(natives));
	check(!/Connect to the internet/.test(status),
		'and is NOT told to go online -- the engine is right here, and that is an hour wasted');
	eq(EngCalcs.lpnTimeRunBoxState().phase, 'failed', 'the run box says the run did not happen');
	check(EngCalcs.lpnTimeRunBoxState().open, '...and stays up to be read');
	eq(EngCalcs.lpnTimeLastReport(), 'EPANET wrote this while refusing',
		'and the report a refusal writes is KEPT -- it is where the offending line is named');

	// ---- AN ABSENT ENGINE, which must still say the other thing ----
	EngCalcs.lpnTimeRunBoxHide();
	EngCalcs.lpnEpanetRun = () => wait(5).then(() => { throw new Error('module not found'); });
	status = '';
	EngCalcs.lpnTimeRunNow();
	await wait(80);
	check(/Connect to the internet/.test(status),
		'an unreachable engine still gets its own message, unchanged', status);
	check(!/would not accept/.test(status), '...and is never reported as a refusal');
}

(async function () {
	await absentEngineSection();
	await refusalSection();
	await warningsSection();
	await pageSection();
	console.log(failures ? `\n${failures} failure(s)` : '\nall checks passed');
	process.exit(failures ? 1 : 0);
}());
