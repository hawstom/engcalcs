// An engine-difference note is said ONCE, not on every solve -- ROADMAP Task 525.
//
//   node dev/lpn-spike/engine-note-once-harness.js
//
// WHY THIS EXISTS. Tom, 2026-08-25, photographing his own phone: the EPANET minor-loss note
// *"is stuck open"*, and then, correcting the first diagnosis, *"a solve didn't dismiss it."*
//
// He was right, and the reason is the opposite of stuck. `minor-loss-gravity-differs` is a solver
// WARNING, raised whenever the EPANET engine meets a network with minor losses. runSolve() rebuilt
// the status line from the warnings on every solve, and this page solves on a 300 ms debounce after
// every keystroke and every drag -- so the note was not surviving, it was being recreated, forever,
// by the very act that was supposed to clear it. On a desktop it is a line in a corner. On a phone
// it is a fifth of the drawing surface that nothing can remove.
//
// It is also not a fact about the solve. It is a fact about the ENGINE, it is 0.08%, there is
// nothing to be done about it, and the same sentence is already in the engine checkbox's own
// tooltip. So it is said once and then it is quiet.
//
// THE MUTANT THIS IS AIMED AT is the obvious wrong fix: clearing the note on the next solve
// regardless. That would make a note the user never got to read if a drag were in flight, and it
// would break section 2, where a SECOND solve with no intervening change must still be silent.

const { setUnitSet, loadLoopedNetwork, settleEpanet, warmEpanet } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\trunSolve: runSolve, assembleModel: assembleModel, buildDom: buildDom,\n" +
	"\t\tgetDoc: function () { return doc; }, settings: function () { return settings; },\n" +
	"\t\tlastResult: function () { return lastSolveResult; },\n" +
	"\t\tresetEngineNotes: resetEngineNotes,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

const statusEl = global.document.getElementById('lpn_status');
function status() { return statusEl.textContent || ''; }
// Matched on a distinctive fragment of the real string rather than the whole of it, so a wording
// edit does not fail this file -- and never on emptiness, which would pass for the wrong reason.
function hasMinorNote() { return /gravity/i.test(status()); }

// A reservoir-pipe-junction line WITH A MINOR LOSS on the pipe. `_k` is the whole point: without it
// EPANET raises no warning and every assertion below would pass by never being exercised.
function lineWithMinorLoss() {
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
	doc.nodes.push({ id: 'R1', type: 'reservoir', x: 0, y: 0, elev: 100 });
	doc.nodes.push({ id: 'J1', type: 'junction', x: 500, y: 0, elev: 0, _demand: 30 });
	doc.links.push({ id: 'L1', type: 'pipe', from: 'R1', to: 'J1', verts: [],
		_diameter: 200, _roughness: 130, _length: 1000, _k: 5, _status: 'open' });
	return doc;
}

async function solved() {
	L.runSolve();
	await settleEpanet();
	return L.lastResult();
}

async function main() {

setUnitSet('si');
await warmEpanet();
L.buildLayers();
lineWithMinorLoss();
L.buildDom();
L.settings().engine = 'epanet';
L.resetEngineNotes();

console.log('=== 1. the first solve says it ===');
{
	await solved();
	ok('the minor-loss note appears on the first EPANET solve', hasMinorNote(), JSON.stringify(status()));
}

console.log('\n=== 2. and no solve after that says it again ===');
{
	// THREE, not one. The defect was a note re-raised by every solve, and a fix that merely
	// alternated would pass a single re-check.
	await solved();
	const after1 = status();
	await solved();
	await solved();
	ok('a second solve is silent about it', !/gravity/i.test(after1), JSON.stringify(after1));
	ok('...and so are the third and fourth', !hasMinorNote(), JSON.stringify(status()));
}

console.log('\n=== 3. changing the engine makes it new again ===');
{
	// The real page calls resetEngineNotes() from the engine checkbox and from applySaved(). Driven
	// directly here: what matters is that the STORE is what gates the note, so whoever clears it
	// gets the note back.
	L.resetEngineNotes();
	await solved();
	ok('after an engine change the note is said once more', hasMinorNote(), JSON.stringify(status()));
	await solved();
	ok('...and then falls quiet again', !hasMinorNote(), JSON.stringify(status()));
}

function codes() {
	return (L.lastResult().warnings || []).map(function (w) { return w.code; });
}

console.log('\n=== 4. the warning follows the CURRENT k, in both directions (Task 526) ===');
{
	// **THIS SECTION USED TO ASSERT THE DEFECT AND NOW ASSERTS THE FIX.**
	//
	// js/lpn-epanet.js cached `built.warnings` on the EPANET session for as long as
	// signatureOf(model) held, on the reasoning that a warning depends only on the method and on
	// which pumps have curves -- both in the signature. `minor-loss-gravity-differs` broke that,
	// because it is raised from `lpnLinkK(link) > 0`, a VALUE, and `k` is not in the signature.
	//
	// Both directions are checked, and the SECOND is the one that cost something: a stale warning
	// on a network whose losses went to zero merely says something harmless, while a network that
	// GAINS a minor loss and is told nothing hides a real difference between the two engines.
	//
	// The signature must not move across these solves, or this proves nothing -- a rebuild would
	// refresh the warnings for the uninteresting reason. Only `k` is touched, and lpnToInp is
	// counted to prove the warm session was reused throughout.
	const realToInp = global.EngCalcs.lpnToInp;
	let inpBuilds = 0;
	global.EngCalcs.lpnToInp = function () { inpBuilds++; return realToInp.apply(this, arguments); };

	L.resetEngineNotes();
	L.getDoc().links[0]._k = 0;
	await solved();
	const modelK = L.assembleModel().links[0].k;
	const warnedAtZero = codes().indexOf('minor-loss-gravity-differs') >= 0;
	ok('the model really does go to k = 0, so this is not the test being wrong', modelK === 0,
		'model k = ' + JSON.stringify(modelK));
	ok('zeroing every minor loss drops the warning', !warnedAtZero,
		'warnings = ' + JSON.stringify(codes()));

	// The costly direction. Same session, same signature, k comes back.
	L.getDoc().links[0]._k = 2;
	await solved();
	ok('...and adding one back raises it again, which is what used to be silent',
		codes().indexOf('minor-loss-gravity-differs') >= 0,
		'warnings = ' + JSON.stringify(codes()));

	global.EngCalcs.lpnToInp = realToInp;
	ok('and neither solve rebuilt the .inp, so the warm session really was reused',
		inpBuilds === 0, inpBuilds + ' rebuild(s)');
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

}
main().catch(function (e) { console.log('  FAIL harness threw -- ' + (e && e.stack || e)); process.exit(1); });
