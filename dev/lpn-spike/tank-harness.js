// Headless check of the TANK element -- ROADMAP Task 248.
//
//   node dev/lpn-spike/tank-harness.js
//
// WHY THIS EXISTS ALONGSIDE cases.tankCase. That case runs both engines over a tank network and
// proves they agree, which is the strongest evidence available about the SOLVE. It is blind to
// everything the solve does not read, and the tank's most dangerous number is exactly that: a
// steady-state solve never looks at a tank's diameter, so writing it in the pipe convention
// (millimetres) instead of the tank convention (metres) leaves every head and flow correct to the
// last digit. Measured, not assumed -- multiplying the diameter by 1000 in js/lpn-epanet.js on
// purpose leaves validate_epanet.js fully green. Only a round trip through the file can see it.
//
// So this harness works on TEXT and on the DOCUMENT, the two layers cases.js cannot reach:
//   1. model -> .inp -> model.  Every tank number must survive, in the right column and the right
//      unit, in both of EPANET's unit systems.
//   2. .inp -> document.  A tank must arrive as a tank, in the project's own display units, with
//      the pipes that connect to it -- the branches that used to be thrown away with it.
//   3. The native solver's own reading of a tank: fixed head at the water surface, and a pressure
//      that is the depth of water standing in the vessel.

const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-inp.js'));

const cases = require('./cases.js');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 1e-9 : tol); }

// ---------------------------------------------------------------------------
// 1. model -> .inp -> model
// ---------------------------------------------------------------------------
// The writer emits LPS, so the reader has to be told nothing: the [OPTIONS] Units keyword the
// writer put there is what fixes every unit on the way back in. That is the whole point of doing
// it as a round trip rather than comparing against a hand-typed expected string -- a string
// comparison tests that the writer did not change, this tests that the two halves agree.
console.log('\n--- a tank survives model -> .inp -> model ---');
{
	const model = cases.tankCase;
	const built = EngCalcs.lpnToInp(model);
	ok('the writer emits a [TANKS] section', /\[TANKS\]/.test(built.inp));
	ok('...and does not smuggle the tanks into [RESERVOIRS] as well',
		(built.inp.match(/^\s*T1\b/gm) || []).length === 1);

	const back = EngCalcs.lpnInpParse(built.inp);
	ok('the round trip parses', back.ok, back.error || '');
	ok('...losing nothing', back.dropped.length === 0, JSON.stringify(back.dropped));

	for (const src of model.nodes.filter((n) => n.type === 'tank')) {
		const got = back.nodes.filter((n) => n.id === src.id)[0];
		ok(src.id + ' comes back as a tank', !!got && got.type === 'tank');
		if (!got) { continue; }
		// EPANET writes and reads these as decimal text, so the tolerance is about the text, not
		// about arithmetic: everything here should be exact to well within a micrometre.
		const TOL = 1e-6;
		ok(src.id + ' keeps its bottom elevation', near(got.elev, src.elev, TOL), got.elev + ' vs ' + src.elev);
		ok(src.id + ' keeps its water level', near(got.level, src.level, TOL), got.level + ' vs ' + src.level);
		ok(src.id + ' keeps its lowest level', near(got.minLevel, src.minLevel, TOL), got.minLevel + ' vs ' + src.minLevel);
		ok(src.id + ' keeps its highest level', near(got.maxLevel, src.maxLevel, TOL), got.maxLevel + ' vs ' + src.maxLevel);
		// THE ONE THE SOLVE CANNOT SEE. A tank diameter is in the LENGTH unit, not the pipe
		// diameter unit, and this assertion is the only thing in the repo that says so.
		ok(src.id + ' keeps its VESSEL DIAMETER, in metres not millimetres',
			near(got.diameter, src.diameter, TOL), got.diameter + ' vs ' + src.diameter);
		ok(src.id + ' resolves to a water surface of elev + level',
			near(got.head, src.elev + src.level, TOL), got.head + ' vs ' + (src.elev + src.level));
	}
}

// ---------------------------------------------------------------------------
// 2. a US (GPM) file, where every length in the tank row is in FEET
// ---------------------------------------------------------------------------
// The unit system is named once, in [OPTIONS], and fixes all six numbers on the tank row at once.
// Written by hand rather than round-tripped, because the writer only ever emits LPS -- a US file
// is a thing we read and never produce, so nothing else in the repo exercises this path for a tank.
console.log('\n--- a GPM (feet) file ---');
{
	const FT = 0.3048;
	const inp = [
		'[JUNCTIONS]', ' J1  100  50', '',
		'[RESERVOIRS]', '',
		'[TANKS]', ' TK1  200  15  2  30  60  0', '',
		// A pipe ON the tank. Until Task 248 this line was dropped as an orphan, taking the branch
		// with it, which is what made an imported municipal model look nothing like the model.
		'[PIPES]', ' P1  TK1  J1  1000  12  130  0  Open', '',
		'[OPTIONS]', ' Units GPM', ' Headloss H-W', '',
		'[END]'
	].join('\n');
	const p = EngCalcs.lpnInpParse(inp);
	ok('parses', p.ok, p.error || '');
	const tk = p.nodes.filter((n) => n.id === 'TK1')[0];
	ok('the tank came in', !!tk && tk.type === 'tank');
	ok('...bottom elevation in feet -> m', near(tk.elev, 200 * FT, 1e-9), tk.elev);
	ok('...water level in feet -> m', near(tk.level, 15 * FT, 1e-9), tk.level);
	ok('...lowest/highest in feet -> m', near(tk.minLevel, 2 * FT, 1e-9) && near(tk.maxLevel, 30 * FT, 1e-9));
	// 60 ft across, NOT 60 inches. If this ever reads 1.524 the tank diameter has been put through
	// the pipe-diameter conversion.
	ok('...vessel diameter in feet -> m, not inches', near(tk.diameter, 60 * FT, 1e-9), tk.diameter);
	ok('...water surface = bottom + level', near(tk.head, 215 * FT, 1e-9), tk.head);
	ok('THE PIPE ON THE TANK SURVIVED', p.links.length === 1 && p.links[0].from === 'TK1',
		p.links.length + ' link(s)');
	ok('...and nothing was reported as dropped', p.dropped.length === 0, JSON.stringify(p.dropped));
}

// ---------------------------------------------------------------------------
// 3. a volume curve is reported, not faked
// ---------------------------------------------------------------------------
// The level the solve uses is unaffected by the vessel's shape, so the network still imports and
// still answers correctly. What is lost is how the level would MOVE, which is why this is a
// difference to report rather than a reason to refuse the file.
console.log('\n--- a non-cylindrical tank ---');
{
	const inp = [
		'[JUNCTIONS]', ' J1  100  50', '',
		'[TANKS]', ' TK1  200  15  2  30  60  0  VC1', '',
		'[PIPES]', ' P1  TK1  J1  1000  12  130  0  Open', '',
		'[OPTIONS]', ' Units GPM', ' Headloss H-W', '',
		'[END]'
	].join('\n');
	const p = EngCalcs.lpnInpParse(inp);
	const d = p.dropped.filter((x) => x.code === 'tank-volume-curve')[0];
	ok('the volume curve is reported', !!d && d.ids.indexOf('TK1') >= 0, JSON.stringify(p.dropped));
	ok('...but the tank is still imported, at the right level',
		near(p.nodes.filter((n) => n.id === 'TK1')[0].head, 215 * 0.3048, 1e-9));
}

// ---------------------------------------------------------------------------
// 4. what the native solver makes of a tank
// ---------------------------------------------------------------------------
console.log('\n--- the native solver ---');
{
	const model = cases.tankCase;
	ok('a tank counts as a fixed head', EngCalcs.lpnIsFixedHead({ type: 'tank' }));
	// The diagnostic that fires when nothing anchors the network must be satisfied by a tank on its
	// own -- otherwise a perfectly good tank-fed model is refused with "add a reservoir".
	const tankOnly = {
		method: 'hw',
		nodes: [
			{ id: 'T', type: 'tank', elev: 50, head: 55, level: 5, minLevel: 0, maxLevel: 6, diameter: 10 },
			{ id: 'J', type: 'junction', elev: 0, demand: 0.01 }
		],
		links: [{ id: 'L', type: 'pipe', from: 'T', to: 'J', length: 300, diameter: 0.25, roughness: 130, k: 0, status: 'open' }]
	};
	ok('a network anchored only by a tank is not "no-fixed-head"',
		EngCalcs.lpnDiagnose(tankOnly).length === 0, JSON.stringify(EngCalcs.lpnDiagnose(tankOnly)));

	const res = EngCalcs.lpnSolve(model);
	ok('it solves', res.ok && res.converged, JSON.stringify(res.issues));
	ok('T1 is held at its water surface, not at its bottom', near(res.heads.T1, 68, 1e-9), res.heads.T1);
	ok('T2 is held at its water surface, not at its bottom', near(res.heads.T2, 29, 1e-9), res.heads.T2);
	// A tank's reported pressure is head minus elevation, which for a tank is the DEPTH OF WATER
	// STANDING IN IT. That is the reading a person actually wants at a tank, and it falls out of
	// the same subtraction a junction uses rather than needing a case of its own.
	ok('T1 reports the depth of water in it as its pressure', near(res.pressures.T1, 8, 1e-9), res.pressures.T1);
	ok('T2 reports the depth of water in it as its pressure', near(res.pressures.T2, 9, 1e-9), res.pressures.T2);
	// Continuity across the whole network: what the two tanks give up equals what J1 draws.
	const net = res.flows.L1 - res.flows.L2;
	ok('continuity at the junction between the two tanks', near(net, 0.025, 1e-9), net);
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
