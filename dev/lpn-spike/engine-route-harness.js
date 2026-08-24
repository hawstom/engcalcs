// WHICH ENGINE ACTUALLY SOLVED THIS NETWORK -- ROADMAP Task 496. Run with:
//   node dev/lpn-spike/engine-route-harness.js
//
// WHAT WAS WRONG. `dev/lpn-spike/lpn-dom-stub.js` never defined EngCalcs.lpnSolveEpanet, and
// runSolve() routes to EPANET only if that function exists -- so every lpn harness fell through to
// the native solver whatever `settings.engine` said, and passed identically on both engines.
// Nothing that routes to EPANET was under test on this path, PRV/PSV/FCV included. The stub now
// loads the real vendored engine; this harness is what proves the setting reaches it.
//
// **THE OBSERVABLE IS PHYSICS, NOT A FLAG.** A counter alone ("lpnSolveEpanet was called") would
// still pass if the answer came from somewhere else, so the load-bearing assertion is the one
// place the two engines KNOWINGLY disagree: Chezy-Manning. Our resistance is the exact derivation
// from V = (1/n) R^(2/3) with R = d/4, constant 10.2936; EPANET's implies 10.231, so its head loss
// is a near-constant 0.9939-0.9944 of ours (measured across an 8x diameter range, 2026-08-09 --
// see the note in dev/lpn-spike/validate_epanet.js). A network solved on 'epanet' must land in
// that band and a network solved on 'native' must land at exactly 1. Delete the routing and both
// come back at 1.000, which fails here.
//
// Sections 2 and 3 are the two halves of the valve rule CLAUDE.md states: an active valve routes
// to EPANET on its own without rewriting the user's setting, and the native solver refuses such a
// network BY NAME when the engine is unreachable.

const { setUnitSet, loadLoopedNetwork, settleEpanet, epanetSolves, warmEpanet } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\trunSolve: runSolve, assembleModel: assembleModel, buildDom: buildDom,\n" +
	"\t\tgetDoc: function () { return doc; }, settings: function () { return settings; },\n" +
	"\t\tlastResult: function () { return lastSolveResult; },\n" +
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

// A plain reservoir-pipe-junction line, written straight into the document the way
// unknown-unit-harness.js does. The numbers are in the SI strip's own units (mm, m, L/s), because
// the document stores what the user typed and the solver is the one that converts.
function line() {
	const doc = L.getDoc();
	doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
	doc.nodes.push({ id: 'R1', type: 'reservoir', x: 0, y: 0, elev: 100 });
	doc.nodes.push({ id: 'J1', type: 'junction', x: 500, y: 0, elev: 0, _demand: 30 });
	doc.links.push({ id: 'L1', type: 'pipe', from: 'R1', to: 'J1', verts: [],
		_diameter: 200, _roughness: 0.013, _length: 1000, _k: 0, _status: 'open' });
	return doc;
}

async function solved() {
	L.runSolve();
	await settleEpanet();
	return L.lastResult();
}

async function main() {

console.log('=== Task 496: settings.engine has to reach an engine ===');

setUnitSet('si');
L.buildLayers();
L.seedDefaultInputs();
// Fetch the engine once up front, exactly as warmEpanetEngine() does in the browser the moment a
// network can only be solved by it. Nothing below then waits on a 664 KB import.
await warmEpanet();

// ------------------------------------------------------------------------------------------
// 1. THE SETTING IS OBSERVABLE
// ------------------------------------------------------------------------------------------
console.log('\n--- the same Manning network, both engines ---');
L.settings().method = 'manning';

L.settings().engine = 'native';
line();
const before = epanetSolves();
const nat = await solved();
ok('the built-in solver answers', !!nat && nat.converged === true, JSON.stringify(nat && nat.issues));
ok('...and never reached for EPANET', epanetSolves() === before, epanetSolves() - before + ' calls');
ok('...and says so in the result', !nat.engine, nat.engine);

L.settings().engine = 'epanet';
line();
const epa = await solved();
ok('EPANET was actually handed the network', epanetSolves() === before + 1, epanetSolves() - before + ' calls');
ok('...and the result carries its name', epa && epa.engine === 'epanet', epa && epa.engine);
ok('...and its own version, which only the engine can supply',
	!!epa && typeof epa.engineVersion === 'number' && epa.engineVersion > 0, epa && epa.engineVersion);

// THE PHYSICS. Manning is where the two engines deliberately differ; anything routed back to the
// native solver would print 1.0000 here.
const hNative = nat.headlosses.L1, hEpanet = epa.headlosses.L1;
const ratio = hEpanet / hNative;
ok('the built-in solver produced a real head loss to compare against', hNative > 0.5, hNative);
ok('EPANET\'s Chezy-Manning head loss is its own, 0.9939-0.9944 of ours',
	ratio > 0.9930 && ratio < 0.9950, 'ratio ' + ratio.toFixed(6));
ok('...which is a DIFFERENCE, so a silent fall-back to the built-in solver fails here',
	Math.abs(ratio - 1) > 1e-4, 'ratio ' + ratio.toFixed(6));

// And the page says the two disagree rather than letting the reader find it.
ok('the status bar warns that the engines differ on Manning',
	/manning/i.test(status()), JSON.stringify(status()));

// ------------------------------------------------------------------------------------------
// 2. AN ACTIVE VALVE ROUTES ITSELF, AND DOES NOT REWRITE THE USER'S CHOICE
// ------------------------------------------------------------------------------------------
console.log('\n--- a PRV takes the network to EPANET on its own ---');
L.settings().method = 'hw';
L.settings().engine = 'native';
{
	const doc = line();
	doc.links[0]._roughness = 130;
	// A PRV may not sit on a fixed head (EPANET input error 219, and lpnDiagnose says so), so the
	// valve goes between two junctions with a pipe either side.
	doc.nodes.push({ id: 'J2', type: 'junction', x: 900, y: 0, elev: 0, _demand: 0 });
	doc.links.push({ id: 'V1', type: 'valve', valveType: 'PRV', from: 'J1', to: 'J2', verts: [],
		_diameter: 200, _setting: 40, _k: 0, _status: 'open' });

	const was = epanetSolves();
	const r = await solved();
	ok('the valve alone sent it to EPANET, with the setting still on the built-in solver',
		epanetSolves() === was + 1, epanetSolves() - was + ' calls');
	ok('...and the answer really is EPANET\'s', !!r && r.engine === 'epanet', r && r.engine);
	ok('...and it converged rather than being quietly dropped', !!r && r.converged === true);
	// THE HALF THAT IS ABOUT HONESTY: the setting is a preference, the routing is a fact about this
	// network, so the setting must survive untouched and the reader must be told.
	ok('the stored engine setting was NOT rewritten', L.settings().engine === 'native', L.settings().engine);
	ok('the status bar names the valve that caused the switch',
		status().indexOf('V1') >= 0, JSON.stringify(status()));
	// The PRV is doing something, or nothing above is about a PRV at all.
	ok('the PRV actually holds its downstream head at the setting',
		Math.abs(r.heads.J2 - 40) < 0.01, r.heads.J2);
}

// ------------------------------------------------------------------------------------------
// 3. WITH NO ENGINE, THE BUILT-IN SOLVER REFUSES BY NAME
// ------------------------------------------------------------------------------------------
// The other half of the same rule, and the state the stub used to be in permanently. Removing
// lpnSolveEpanet is exactly what an offline first visit looks like to runSolve().
console.log('\n--- and with EPANET unreachable, the refusal names the valve ---');
{
	const keep = EngCalcs.lpnSolveEpanet;
	delete EngCalcs.lpnSolveEpanet;
	try {
		const was = epanetSolves();
		L.runSolve();
		ok('nothing was handed to an engine that is not there', epanetSolves() === was);
		ok('no numbers were produced', L.lastResult() === null, JSON.stringify(L.lastResult()));
		ok('the refusal names the valve', status().indexOf('V1') >= 0, JSON.stringify(status()));
		ok('...and says it is the EPANET engine that is missing',
			/EPANET/.test(status()), JSON.stringify(status()));
	} finally { EngCalcs.lpnSolveEpanet = keep; }

	// Put it back and the same network solves again -- so the refusal is about the engine being
	// absent, not about the network being bad.
	const r = await solved();
	ok('the engine returning revives the same network', !!r && r.engine === 'epanet', r && r.engine);
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

}
main().catch(function (e) { console.log('  FAIL harness threw -- ' + (e && e.stack || e)); process.exit(1); });
