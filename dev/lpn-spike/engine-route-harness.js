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
// Sections 2 and 3 are the two halves of the valve rule: a valve only EPANET can answer routes
// to EPANET on its own without rewriting the user's setting, and the native solver refuses such a
// network BY NAME when the engine is unreachable.

const { setUnitSet, loadLoopedNetwork, settleEpanet, epanetSolves, warmEpanet } = require('./lpn-dom-stub.js');

const PC = global.EngCalcs.pageConfig;
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
// 2. A NETWORK ONLY EPANET CAN ANSWER ROUTES ITSELF, AND DOES NOT REWRITE THE USER'S CHOICE
// ------------------------------------------------------------------------------------------
// **A PRESSURE-DRIVEN DEMAND MODEL, SINCE NO VALVE ROUTES ANY MORE** (Task 733; Tom, 2026-10-18).
// Every valve type is the built-in solver's; what still sends a single-instant solve to EPANET by
// its own contents is PDA (Task 762), so it is the network that has to route on its own here.
const PDA = { demandModel: 'PDA', minPressure: 0, reqPressure: 20, pressureExponent: 0.5 };
function pdaLine() {
	const doc = line();
	doc.links[0]._roughness = 130;
	L.settings().hydraulics = Object.assign({}, PDA);
	return doc;
}
console.log('\n--- a pressure-driven network takes itself to EPANET ---');
L.settings().method = 'hw';
L.settings().engine = 'native';
{
	pdaLine();
	const was = epanetSolves();
	const r = await solved();
	ok('the demand model alone sent it to EPANET, with the setting still on the built-in solver',
		epanetSolves() === was + 1, epanetSolves() - was + ' calls');
	ok('...and the answer really is EPANET\'s', !!r && r.engine === 'epanet', r && r.engine);
	ok('...and it converged rather than being quietly dropped', !!r && r.converged === true);
	// THE HALF THAT IS ABOUT HONESTY: the setting is a preference, the routing is a fact about this
	// network, so the setting must survive untouched and the reader must be told.
	ok('the stored engine setting was NOT rewritten', L.settings().engine === 'native', L.settings().engine);
	ok('the status bar says why it switched', status().indexOf(PC.lpn_engine_pda_route) >= 0, JSON.stringify(status()));
	L.settings().hydraulics = {};
}

// ------------------------------------------------------------------------------------------
// 2a. A CURVELESS GPV IS AN OPEN CONNECTION IN THE BUILT-IN SOLVER, AND SAYS NOTHING
// ------------------------------------------------------------------------------------------
// Tom, 2026-10-18: the built-in solver handles it exactly as EPANET does -- js/lpn-epanet.js writes
// it as a TCV at zero loss -- with no routing and no message. A freshly chosen GPV has no curve.
console.log('\n--- a curveless GPV stays on the built-in solver ---');
{
	const doc = line();
	doc.links[0]._roughness = 130;
	doc.nodes.push({ id: 'J2', type: 'junction', x: 900, y: 0, elev: 0, _demand: 10 });
	doc.links.push({ id: 'V1', type: 'valve', valveType: 'GPV', from: 'J1', to: 'J2', verts: [],
		_diameter: 200, _setting: 0, _k: 5, _status: 'open' });
	const was = epanetSolves();
	L.runSolve();
	const r = L.lastResult();
	ok('the curveless GPV network is not handed to EPANET', epanetSolves() === was, epanetSolves() - was + ' calls');
	ok('...it is the built-in solver\'s answer, converged', !!r && r.engine !== 'epanet' && r.converged === true, r && r.engine);
	ok('...an open connection: no loss across it, its k ignored as EPANET\'s TCV ignores it',
		!!r && Math.abs(r.heads.J1 - r.heads.J2) < 1e-3, r && r.heads.J1 - r.heads.J2);
	ok('...and the status bar says nothing about the valve', status().indexOf('V1') < 0, JSON.stringify(status()));
	const epa = await (async () => { L.settings().engine = 'epanet'; const x = await solved(); L.settings().engine = 'native'; return x; })();
	ok('...and EPANET gives the same heads', !!epa && Math.abs(epa.heads.J2 - r.heads.J2) < 2e-3,
		epa && (epa.heads.J2 - r.heads.J2));
	doc.links.pop();
	doc.nodes.pop();
}

// ------------------------------------------------------------------------------------------
// 2b. A PRV, A PBV AND A GPV WITH A CURVE NO LONGER LEAVE THE BUILT-IN SOLVER (Task 733)
// ------------------------------------------------------------------------------------------
console.log('\n--- a PRV, a PBV and a GPV stay on the built-in solver ---');
function nativeValve(v, check, demandJ2) {
	const doc = line();
	doc.links[0]._roughness = 130;
	doc.nodes.push({ id: 'J2', type: 'junction', x: 900, y: 0, elev: 0, _demand: demandJ2 || 0 });
	doc.links.push(Object.assign({ id: 'V2', type: 'valve', from: 'J1', to: 'J2', verts: [],
		_diameter: 200, _k: 0, _status: 'open' }, v));
	const was = epanetSolves();
	L.runSolve();
	const r = L.lastResult();
	ok('the ' + v.valveType + ' network is not handed to EPANET', epanetSolves() === was, epanetSolves() - was + ' calls');
	ok('...it is the built-in solver\'s answer', !!r && r.engine !== 'epanet', r && r.engine);
	check(r);
	doc.links.pop();
	doc.nodes.pop();
}
nativeValve({ valveType: 'PRV', _setting: 40 }, (r) => {
	ok('...and the PRV holds its downstream head at the setting',
		!!r && Math.abs(r.heads.J2 - 40) < 0.01, r && r.heads.J2);
	ok('...and says the valve is active', !!r && r.valveStatus && r.valveStatus.V2 === 'active',
		r && JSON.stringify(r.valveStatus));
});
nativeValve({ valveType: 'PBV', _setting: 40 }, (r) => {
	ok('...and the PBV takes exactly its setting out of the head',
		!!r && Math.abs(r.heads.J1 - r.heads.J2 - 40) < 0.01, r && r.heads.J1 - r.heads.J2);
});
// **A PBV's DROP IS A PRESSURE, IN THE PRESSURE UNIT** -- under the US preset 10 psi, not 10 m.
// assembleModel() passed a PBV's setting through unconverted until Task 733 phase 2, so a 10 psi
// PBV took out 14.2 psi in both engines.
setUnitSet('us');
nativeValve({ valveType: 'PBV', _setting: 10, _diameter: 8 }, (r) => {
	const psi = !!r && (r.heads.J1 - r.heads.J2) / 0.3048 * 0.4333;
	ok('...and a 10 psi PBV under the US preset takes out 10 psi, not 10 m',
		!!r && Math.abs(psi - 10) < 0.01, psi);
});
// **AND A GPV's CURVE IS IN THE STRIP's gpm AND ft** under the US preset: 100 -> 5, 300 -> 15,
// 500 -> 40. Read by hand: 200 gpm is 10 ft, 400 gpm is 27.5 ft, and 50 gpm extrapolates the first
// segment back to 2.5 ft (pre-reviewer's probe, 2026-10-18). J1 carries the line's own 30 gpm, so
// the valve's flow is J2's demand alone.
L.getDoc().curves = (L.getDoc().curves || []).concat([{ id: 'GUS', kind: 'headloss',
	points: [[100, 5], [300, 15], [500, 40]] }]);
for (const [gpm, ft] of [[200, 10], [400, 27.5], [50, 2.5]]) {
	nativeValve({ valveType: 'GPV', _setting: 0, _curveId: 'GUS', _diameter: 8 }, (r) => {
		const drop = !!r && (r.heads.J1 - r.heads.J2) / 0.3048;
		ok('...and a US GPV curve read at ' + gpm + ' gpm loses ' + ft + ' ft', !!r && Math.abs(drop - ft) < 0.01, drop);
	}, gpm);
}
setUnitSet('si');
// A GPV naming a library head-loss curve, in the strip's L/s and metres: 20 L/s through it sits
// halfway along the 10-30 L/s segment, so it loses 4 m.
L.getDoc().curves = (L.getDoc().curves || []).concat([{ id: 'GL1', kind: 'headloss',
	points: [[10, 2], [30, 6], [50, 14]] }]);
nativeValve({ valveType: 'GPV', _setting: 0, _curveId: 'GL1' }, (r) => {
	ok('...and the GPV loses what its curve says at 20 L/s, 4 m',
		!!r && Math.abs(r.heads.J1 - r.heads.J2 - 4) < 0.01, r && r.heads.J1 - r.heads.J2);
}, 20);

// ------------------------------------------------------------------------------------------
// 3. WITH NO ENGINE, THE BUILT-IN SOLVER REFUSES BY NAME
// ------------------------------------------------------------------------------------------
// The other half of the same rule, and the state the stub used to be in permanently. Removing
// lpnSolveEpanet is exactly what an offline first visit looks like to runSolve().
console.log('\n--- and with EPANET unreachable, the refusal says what needs it ---');
{
	pdaLine();
	const keep = EngCalcs.lpnSolveEpanet;
	delete EngCalcs.lpnSolveEpanet;
	try {
		const was = epanetSolves();
		L.runSolve();
		ok('nothing was handed to an engine that is not there', epanetSolves() === was);
		ok('no numbers were produced', L.lastResult() === null, JSON.stringify(L.lastResult()));
		ok('the refusal is the pressure-driven one', status().indexOf(PC.lpn_diag_pda_needs_epanet) >= 0,
			JSON.stringify(status()));
	} finally { EngCalcs.lpnSolveEpanet = keep; }

	// Put it back and the same network solves again -- so the refusal is about the engine being
	// absent, not about the network being bad.
	const r = await solved();
	ok('the engine returning revives the same network', !!r && r.engine === 'epanet', r && r.engine);
	L.settings().hydraulics = {};
}

// ------------------------------------------------------------------------------------------
// 4. THE VALVE DATA FAULTS ARE THE SAME IN BOTH ENGINES (Task 733; Tom, 2026-10-18)
// ------------------------------------------------------------------------------------------
console.log('\n--- valve data faults, either engine ---');
for (const engine of ['native', 'epanet']) {
	L.settings().engine = engine;
	{
		// Two PRVs in series: EPANET's error 220 (project.c valvecheck()).
		const doc = line();
		doc.links[0]._roughness = 130;
		doc.nodes.push({ id: 'J2', type: 'junction', x: 900, y: 0, elev: 0, _demand: 0 });
		doc.nodes.push({ id: 'J3', type: 'junction', x: 1300, y: 0, elev: 0, _demand: 5 });
		doc.links.push({ id: 'V1', type: 'valve', valveType: 'PRV', from: 'J1', to: 'J2', verts: [], _diameter: 200, _setting: 60, _k: 0, _status: 'open' });
		doc.links.push({ id: 'V2', type: 'valve', valveType: 'PRV', from: 'J2', to: 'J3', verts: [], _diameter: 200, _setting: 30, _k: 0, _status: 'open' });
		const r = await solved();
		ok(engine + ': two PRVs in series are refused, by name', r === null &&
			status().indexOf(PC.lpn_diag_valve_conflict + ' V1, V2') >= 0, JSON.stringify(status()));
		doc.links.pop(); doc.links.pop(); doc.nodes.pop(); doc.nodes.pop();
	}
	{
		// A GPV curve whose flows do not increase: validate.c validatecurves(), error 230.
		L.getDoc().curves = (L.getDoc().curves || []).filter((c) => c.id !== 'GBAD' && c.id !== 'GONE').concat([
			{ id: 'GBAD', kind: 'headloss', points: [[20, 5], [20, 8]] },
			{ id: 'GONE', kind: 'headloss', points: [[20, 5]] }]);
		const doc = line();
		doc.links[0]._roughness = 130;
		doc.nodes.push({ id: 'J2', type: 'junction', x: 900, y: 0, elev: 0, _demand: 10 });
		doc.links.push({ id: 'V1', type: 'valve', valveType: 'GPV', from: 'J1', to: 'J2', verts: [], _diameter: 200, _setting: 0, _curveId: 'GBAD', _k: 0, _status: 'open' });
		let r = await solved();
		ok(engine + ': a GPV curve whose flows do not increase is refused, by name', r === null &&
			status().indexOf(PC.lpn_diag_gpv_curve_order + ' V1') >= 0, JSON.stringify(status()));
		// One point (20 L/s -> 5 m): solved as the line through the origin and it, and said.
		doc.links[doc.links.length - 1]._curveId = 'GONE';
		r = await solved();
		ok(engine + ': a one-point GPV curve solves as the line through the origin: 10 L/s loses 2.5 m',
			!!r && Math.abs(r.heads.J1 - r.heads.J2 - 2.5) < 2e-3, r && (r.heads.J1 - r.heads.J2));
		ok(engine + ': ...and says so, naming the valve',
			status().indexOf(PC.lpn_gpv_one_point_note.replace('{ids}', 'V1')) >= 0, JSON.stringify(status()));
		doc.links.pop(); doc.nodes.pop();
	}
}
L.settings().engine = 'native';

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);

}
main().catch(function (e) { console.log('  FAIL harness threw -- ' + (e && e.stack || e)); process.exit(1); });
