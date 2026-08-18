// Headless check of the VALVE element -- ROADMAP Task 248 phase 2.
//
//   node dev/lpn-spike/valve-harness.js
//
// WHY THIS EXISTS ALONGSIDE cases.valveTcvCase, which validate_epanet.js runs through both
// engines. That comparison is the strongest evidence available about a THROTTLE valve's solve --
// and it is structurally blind to the two numbers most likely to be wrong on a valve:
//
//   1. A VALVE'S SETTING MEANS A DIFFERENT QUANTITY PER TYPE, and only one of the three is
//      dimensionless. A PRV/PSV setting is a PRESSURE (metres of water under LPS, psi in a US
//      file), an FCV setting is a FLOW (L/s under LPS), a TCV setting is a bare loss coefficient.
//      No engine comparison can see a mis-converted one, for a reason worth stating plainly: the
//      two engines read the SAME model object, so the native solver never touches the file at all,
//      and the only types whose setting HAS a unit are exactly the types the native solver refuses
//      by design. The engine comparison is therefore not merely weak here -- it is empty.
//
//   2. A VALVE DIAMETER IS IN MILLIMETRES, following the PIPE convention. A tank diameter, added
//      to this same writer a few hours earlier, is in METRES. Three sections of one .inp file,
//      one word, two units.
//
// So this harness works on TEXT and on the DOCUMENT, exactly as tank-harness.js does:
//   1. model -> .inp: every valve number in the right column, in the right unit, per type.
//   2. .inp -> model: the same, backwards, in both of EPANET's unit systems.
//   3. What the native solver makes of a valve: a TCV is a pure minor loss it solves, an active
//      valve is refused BY NAME rather than silently wrong.
//
// MUTATION-TESTED (2026-08-14) before being trusted, and the result CORRECTED THE PARAGRAPH
// ABOVE, which is the reason to run a mutation test rather than to reason about coverage. Four
// deliberate breaks in js/lpn-epanet.js, every one caught here:
//
//   valve diameter written in metres        -- 5 failures here, and validate_epanet.js ALSO
//                                              caught it. Expected to be invisible; it is not,
//                                              because a TCV's loss is k V^2/2g and the velocity
//                                              comes from the diameter, so a wrong diameter moves
//                                              the head EPANET reports. The prediction was wrong
//                                              and this line is what corrected it.
//   FCV setting left in m3/s                -- caught here; validate_epanet.js FULLY GREEN.
//   PRV setting sent through the FCV branch -- caught here; validate_epanet.js FULLY GREEN.
//   setting and minor-loss columns swapped  -- 6 failures here, and validate_epanet.js caught it.
//
// So the genuinely invisible class is narrower than "valve numbers" and is exactly the SETTING OF
// AN ACTIVE VALVE: those types never reach validate_epanet.js at all, because the native solver
// refuses them by design and the harness compares the two engines. Nothing but this file's text
// assertions stands between a PRV holding 40 m and a PRV holding 40000.

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

// The [VALVES] row for one id, as a token list. Reading the TEXT rather than re-parsing it is the
// point of assertions 1a-1d: a round trip can agree with itself while both halves are wrong.
function valveRow(inp, id) {
	const sec = inp.split(/\[/).filter((s) => s.indexOf('VALVES]') === 0)[0];
	if (!sec) { return null; }
	const line = sec.split('\n').filter((l) => l.trim().split(/\s+/)[0] === id)[0];
	return line ? line.trim().split(/\s+/) : null;
}

// ---------------------------------------------------------------------------
// 1. model -> .inp: the columns and their units, per type
// ---------------------------------------------------------------------------
// One model carrying all four types at once, so a per-type branch that fell through to the wrong
// converter shows up as a difference between two rows of the same section rather than as a number
// that merely looks plausible on its own.
console.log('\n--- what the writer puts in [VALVES] ---');
{
	const model = {
		method: 'hw',
		nodes: [
			{ id: 'R', type: 'reservoir', elev: 0, head: 100 },
			{ id: 'J1', type: 'junction', elev: 0, demand: 0 },
			{ id: 'J2', type: 'junction', elev: 0, demand: 0.02 },
			{ id: 'J3', type: 'junction', elev: 0, demand: 0 },
			{ id: 'J4', type: 'junction', elev: 0, demand: 0 },
			{ id: 'J5', type: 'junction', elev: 0, demand: 0 }
		],
		links: [
			{ id: 'L1', type: 'pipe', from: 'R', to: 'J1', length: 100, diameter: 0.3, roughness: 130, k: 0, status: 'open' },
			// 0.25 m across, setting 8 (dimensionless), minor loss 3 -- which EPANET IGNORES on a
			// TCV, so the writer must put a 0 there rather than pass the 3 through.
			{ id: 'V1', type: 'valve', valveType: 'TCV', from: 'J1', to: 'J2', length: 0, diameter: 0.25, roughness: 150, setting: 8, k: 3, status: 'open' },
			// 40 m of water. Under LPS the pressure unit IS the metre, so this must appear as 40.
			{ id: 'V2', type: 'valve', valveType: 'PRV', from: 'J2', to: 'J3', length: 0, diameter: 0.2, roughness: 150, setting: 40, k: 1.5, status: 'open' },
			// 0.015 m3/s. Under LPS a flow is L/s, so this must appear as 15.
			{ id: 'V3', type: 'valve', valveType: 'FCV', from: 'J3', to: 'J4', length: 0, diameter: 0.15, roughness: 150, setting: 0.015, k: 0, status: 'open' },
			// Closed. A valve has no status column of its own; it goes in [STATUS].
			{ id: 'V4', type: 'valve', valveType: 'PSV', from: 'J4', to: 'J5', length: 0, diameter: 0.1, roughness: 150, setting: 25, k: 0, status: 'closed' }
		]
	};
	const inp = EngCalcs.lpnToInp(model).inp;

	ok('a [VALVES] section is written', /\[VALVES\]/.test(inp));
	// A valve must appear in [VALVES] and NOWHERE ELSE. Before this task every valve was written
	// as a pipe, so a half-done migration that emitted both would produce a network with a
	// duplicated link -- which EPANET rejects, but only after the id has already been reused.
	const pipeSec = inp.split(/\[/).filter((x) => x.indexOf('PIPES]') === 0)[0] || '';
	ok('...and no valve is also written as a pipe',
		!/^\s*V\d\b/m.test(pipeSec), pipeSec);
	const valveSec = inp.split(/\[/).filter((x) => x.indexOf('VALVES]') === 0)[0] || '';
	ok('...all four valves are in [VALVES], once each',
		(valveSec.match(/^\s*V\d\b/gm) || []).length === 4,
		(valveSec.match(/^\s*V\d\b/gm) || []).join('|'));

	// 1a. THE DIAMETER, in millimetres. This is the assertion that fails when a valve diameter is
	// written in the tank convention; nothing in validate_epanet.js can.
	const r1 = valveRow(inp, 'V1');
	ok('V1 row found', !!r1, JSON.stringify(r1));
	if (r1) {
		ok('V1 diameter is in MILLIMETRES, not metres', r1[3] === '250', r1[3]);
		ok('V1 type', r1[4] === 'TCV', r1[4]);
		ok('V1 setting is the bare loss coefficient', +r1[5] === 8, r1[5]);
		// EPANET ignores a TCV's minor-loss column (measured -- see EngCalcs.lpnLinkK). Writing
		// the 3 would state a number the engine discards, and would make the file disagree with
		// the native solver, which reads the setting alone.
		ok('V1 minor loss is written as 0, because EPANET ignores it on a TCV', +r1[6] === 0, r1[6]);
	}

	// 1b. A PRESSURE setting. LPS pressure unit is the metre of water, which is this suite's own
	// SI pressure, so it passes through unscaled -- and "unscaled" is a claim worth asserting,
	// because it is indistinguishable from "we forgot to convert it".
	const r2 = valveRow(inp, 'V2');
	ok('V2 row found', !!r2, JSON.stringify(r2));
	if (r2) {
		ok('V2 diameter in mm', +r2[3] === 200, r2[3]);
		ok('V2 PRV setting is a PRESSURE in metres of water, unscaled', +r2[5] === 40, r2[5]);
		ok('V2 keeps its minor loss, because EPANET applies it while a PRV is open', +r2[6] === 1.5, r2[6]);
	}

	// 1c. A FLOW setting: m3/s -> L/s. Off by 1000 and the valve simply never restricts anything,
	// which looks exactly like a correctly-sized valve on a network that does not need one.
	const r3 = valveRow(inp, 'V3');
	if (r3) {
		ok('V3 FCV setting is a FLOW in L/s, not m3/s', +r3[5] === 15, r3[5]);
		ok('V3 diameter in mm', +r3[3] === 150, r3[3]);
	}

	// 1d. A closed valve. There is no status column on a [VALVES] row.
	ok('a closed valve is stated in [STATUS]', /\[STATUS\][\s\S]*V4\s+Closed/i.test(inp));
	ok('...and [STATUS] comes after [VALVES], so the link is declared first',
		inp.indexOf('[VALVES]') < inp.indexOf('[STATUS]'));
	const r4 = valveRow(inp, 'V4');
	ok('...and the valve row itself carries no status token', !!r4 && r4.length <= 7,
		r4 ? r4.join(' ') : 'no row');
}

// ---------------------------------------------------------------------------
// 2. .inp -> model, in both unit systems
// ---------------------------------------------------------------------------
// The setting's unit is fixed by the file's own flow keyword, so the SAME three rows have to be
// read three different ways depending on one word in [OPTIONS]. That is the reader's half of the
// trap and it has its own converter (valveSettingSI), so it gets its own assertions.
console.log('\n--- a GPM (US) file ---');
{
	const IN = 0.0254, FT = 0.3048, PSI_M = 0.703070, GPM = 6.30901964e-5;
	const inp = [
		'[JUNCTIONS]', ' J1  100  50', ' J2  100  0', ' J3  100  0', ' J4  100  0', '',
		'[RESERVOIRS]', ' R1  200', '',
		'[PIPES]', ' L1  R1  J1  1000  12  130  0  Open', '',
		// ID  Node1 Node2  Diam(in)  Type  Setting  MinorLoss
		'[VALVES]',
		' V1  J1  J2  10  TCV  8  3',
		' V2  J2  J3  8   PRV  60  1.5',
		' V3  J3  J4  6   FCV  250  0',
		'',
		'[OPTIONS]', ' Units GPM', ' Headloss H-W', '',
		'[END]'
	].join('\n');
	const p = EngCalcs.lpnInpParse(inp);
	ok('parses', p.ok, p.error || '');

	const byId = {};
	p.links.forEach((l) => { byId[l.id] = l; });

	ok('a TCV comes in as a valve, not as a pipe', byId.V1 && byId.V1.type === 'valve', byId.V1 && byId.V1.type);
	ok('...with its type recorded', byId.V1 && byId.V1.valveType === 'TCV');
	// The reader converts nothing -- every number comes back in the file's own unit (see the units
	// note at the top of js/lpn-inp.js), so the assertion about WHICH unit is now an assertion
	// about which scale factor the value belongs with. A valve diameter follows the PIPE
	// convention (inches here), not the tank/elevation one (feet).
	ok('...diameter is the file token', byId.V1.diameter === 10, byId.V1.diameter);
	ok('...in the pipe unit (inches), not feet', near(byId.V1.diameter * p.scale.dia, 10 * IN, 1e-9) &&
		!near(byId.V1.diameter * p.scale.dia, 10 * FT, 1e-9), byId.V1.diameter * p.scale.dia);
	ok('...its setting is dimensionless and untouched', byId.V1.setting === 8, byId.V1.setting);
	ok('...its minor loss is dropped to 0, because EPANET ignores it on a TCV', byId.V1.k === 0, byId.V1.k);
	ok('...and it has NO length, so no friction is smuggled in', byId.V1.length === 0, byId.V1.length);

	ok('a PRV comes in as a valve', byId.V2 && byId.V2.type === 'valve' && byId.V2.valveType === 'PRV');
	// 60 psi, not 60 metres. A factor of 1.42, and the network still solves either way.
	ok('...its setting is the file token', byId.V2.setting === 60, byId.V2.setting);
	ok('...named as a PRESSURE, so 60 psi and not 60 m of water',
		byId.V2.settingUnit === 'press' && near(byId.V2.setting * p.scale.press, 60 * PSI_M, 1e-9),
		byId.V2.settingUnit + ' ' + byId.V2.setting * p.scale.press);
	ok('...and it keeps its minor loss', byId.V2.k === 1.5, byId.V2.k);

	ok('an FCV comes in as a valve', byId.V3 && byId.V3.type === 'valve' && byId.V3.valveType === 'FCV');
	ok('...its setting is the file token, named as a FLOW',
		byId.V3.setting === 250 && byId.V3.settingUnit === 'flow', byId.V3.setting + ' ' + byId.V3.settingUnit);
	ok('...so gpm -> m3/s is the caller\'s one multiplication',
		near(byId.V3.setting * p.scale.flow, 250 * GPM, 1e-12), byId.V3.setting * p.scale.flow);

	// Reported, not silent -- the module's whole contract. A TCV and an active valve are reported
	// under DIFFERENT codes, because the second one changes which engine solves the network.
	const codes = p.dropped.map((d) => d.code);
	ok('the throttle valve is reported as kept', codes.indexOf('valve-tcv') >= 0, JSON.stringify(codes));
	ok('the active valves are reported as needing the EPANET engine',
		codes.indexOf('valve-active') >= 0, JSON.stringify(codes));
	const active = p.dropped.filter((d) => d.code === 'valve-active')[0];
	ok('...naming both of them', active && active.ids.indexOf('V2') >= 0 && active.ids.indexOf('V3') >= 0,
		active ? active.ids.join(',') : '');
}

console.log('\n--- an LPS (SI) file, where the same three rows mean different numbers ---');
{
	const MM = 0.001, LPS = 0.001;
	const inp = [
		'[JUNCTIONS]', ' J1  30  5', ' J2  30  0', ' J3  30  0', ' J4  30  0', '',
		'[RESERVOIRS]', ' R1  60', '',
		'[PIPES]', ' L1  R1  J1  300  250  130  0  Open', '',
		'[VALVES]',
		' V1  J1  J2  250  TCV  8  3',
		' V2  J2  J3  200  PRV  40  1.5',
		' V3  J3  J4  150  FCV  15  0',
		'',
		'[OPTIONS]', ' Units LPS', ' Headloss H-W', '',
		'[END]'
	].join('\n');
	const p = EngCalcs.lpnInpParse(inp);
	const byId = {};
	p.links.forEach((l) => { byId[l.id] = l; });
	ok('diameter is the file token, in MILLIMETRES', byId.V1.diameter === 250, byId.V1.diameter);
	ok('...which is m when scaled', near(byId.V1.diameter * p.scale.dia, 250 * MM, 1e-12), byId.V1.diameter * p.scale.dia);
	ok('a PRV setting in metres of water is already SI',
		byId.V2.setting === 40 && p.scale.press === 1, byId.V2.setting + ' x ' + p.scale.press);
	ok('an FCV setting in L/s -> m3/s', near(byId.V3.setting * p.scale.flow, 15 * LPS, 1e-12),
		byId.V3.setting * p.scale.flow);
}

// ---------------------------------------------------------------------------
// 3. round trip: write what was read, read what was written
// ---------------------------------------------------------------------------
// The writer only ever emits LPS, so this closes the loop on the SI branch of both halves at once.
// It is the assertion that would survive a future change to either side alone.
console.log('\n--- model -> .inp -> model ---');
{
	const model = cases.valveTcvCase;
	const built = EngCalcs.lpnToInp(model);
	const back = EngCalcs.lpnInpParse(built.inp);
	ok('the round trip parses', back.ok, back.error || '');
	const v = back.links.filter((l) => l.id === 'V1')[0];
	ok('V1 is still a valve', !!v && v.type === 'valve');
	ok('...still a TCV', v && v.valveType === 'TCV');
	// The writer emits LPS, so the file's pipe-diameter unit is the millimetre and the reader
	// hands that back unconverted; `scale.dia` closes the loop back to the model's metres.
	ok('...same diameter', near(v.diameter * back.scale.dia, 0.25, 1e-9), v.diameter * back.scale.dia);
	ok('...same setting', near(v.setting, 8, 1e-9), v.setting);
	// A GPV and a PBV are the two types this page still cannot hold, and they must arrive as
	// reported pipes rather than as valves with a setting nobody can interpret.
	const gpv = EngCalcs.lpnInpParse([
		'[JUNCTIONS]', ' J1  0  5', ' J2  0  0', '',
		'[RESERVOIRS]', ' R1  50', '',
		'[PIPES]', ' L1  R1  J1  300  250  130  0  Open', '',
		'[VALVES]', ' V9  J1  J2  200  GPV  CURVE1  2.5', '',
		'[OPTIONS]', ' Units LPS', '', '[END]'
	].join('\n'));
	const g = gpv.links.filter((l) => l.id === 'V9')[0];
	// **A GPV IS A VALVE NOW** (Task 248, 2026-08-17). It used to arrive as a pipe carrying the
	// fully-open minor loss, with the control reported gone -- the honest answer while this page had
	// nowhere to put a head-loss curve. It has one now: the curve belongs to the valve and is named
	// after it, which is Task 248.04's ruling for curves generally.
	ok('a GPV comes in as a VALVE', !!g && g.type === 'valve', g && g.type);
	ok('...of its own type', g && g.valveType === 'GPV', g && g.valveType);
	ok('...carrying the fully-open minor loss', g && g.k === 2.5, g && g.k);
	// The file names CURVE1 and does not contain it, so the valve arrives with no points and stands
	// open -- reported, rather than silently becoming something else.
	ok('...with no curve, since the file names one it does not contain',
		g && Array.isArray(g.curvePoints) && g.curvePoints.length === 0, JSON.stringify(g && g.curvePoints));
	ok('...and the missing curve is reported',
		gpv.dropped.filter((d) => d.code === 'gpv-curve-missing' && d.ids.indexOf('V9') >= 0).length === 1,
		JSON.stringify(gpv.dropped.map((d) => d.code)));
	ok('...and it is NOT reported as a dropped valve any more',
		gpv.dropped.filter((d) => d.code === 'valve-dropped').length === 0,
		JSON.stringify(gpv.dropped.map((d) => d.code)));

	// The curve the file DOES contain comes in on the valve, point for point.
	const gpv2 = EngCalcs.lpnInpParse([
		'[JUNCTIONS]', ' J1  0  5', ' J2  0  0', '',
		'[RESERVOIRS]', ' R1  50', '',
		'[PIPES]', ' L1  R1  J1  300  250  130  0  Open', '',
		'[VALVES]', ' V9  J1  J2  200  GPV  CURVE1  2.5', '',
		'[CURVES]', ' CURVE1  0  0', ' CURVE1  10  1.5', ' CURVE1  20  6', '',
		'[OPTIONS]', ' Units LPS', '', '[END]'
	].join('\n'));
	const g2 = gpv2.links.filter((l) => l.id === 'V9')[0];
	ok('a GPV whose curve IS in the file gets its points',
		g2 && g2.curvePoints.length === 3, JSON.stringify(g2 && g2.curvePoints));
	ok('...flow first, head loss second, in the file\'s own units',
		g2 && g2.curvePoints[2][0] === 20 && g2.curvePoints[2][1] === 6,
		JSON.stringify(g2 && g2.curvePoints[2]));

	// A PBV: a fixed pressure DROP, which is a setting in the pressure unit like a PRV's.
	const pbv = EngCalcs.lpnInpParse([
		'[JUNCTIONS]', ' J1  0  5', ' J2  0  0', '',
		'[RESERVOIRS]', ' R1  50', '',
		'[PIPES]', ' L1  R1  J1  300  250  130  0  Open', '',
		'[VALVES]', ' V8  J1  J2  200  PBV  7  1.5', '',
		'[OPTIONS]', ' Units LPS', '', '[END]'
	].join('\n'));
	const pb = pbv.links.filter((l) => l.id === 'V8')[0];
	ok('a PBV comes in as a valve of its own type',
		pb && pb.type === 'valve' && pb.valveType === 'PBV', pb && (pb.type + '/' + pb.valveType));
	ok('...with the pressure drop as its setting', pb && pb.setting === 7, pb && pb.setting);
	ok('...declared to be in the PRESSURE unit, like a PRV\'s',
		pb && pb.settingUnit === 'press', pb && pb.settingUnit);
	ok('...and its fully-open minor loss', pb && pb.k === 1.5, pb && pb.k);

	// Neither is native: both switch their own state inside the iteration, so both route to EPANET.
	ok('both are EPANET-only, like every other active type',
		!EngCalcs.lpnValveIsNative({ type: 'valve', valveType: 'PBV' }) &&
		!EngCalcs.lpnValveIsNative({ type: 'valve', valveType: 'GPV' }));
}

// ---------------------------------------------------------------------------
// 4. what the native solver makes of a valve
// ---------------------------------------------------------------------------
console.log('\n--- the native solver ---');
{
	// A TCV IS A PURE MINOR LOSS, and the closed form is available without any solver machinery:
	// h = k V^2 / 2g with V = Q / A. Asserting against that rather than against the other engine
	// is what makes this an independent check instead of a second opinion.
	const model = cases.valveTcvCase;
	const res = EngCalcs.lpnSolve(model);
	ok('a network with a throttle valve solves natively', res.ok && res.converged, JSON.stringify(res.issues));
	const q = Math.abs(res.flows.V1), d = 0.25, a = Math.PI * d * d / 4;
	const expect = 8 * Math.pow(q / a, 2) / (2 * EngCalcs.lpnG);
	ok('...and its head loss is k V^2 / 2g from the SETTING',
		near(Math.abs(res.headlosses.V1), expect, 1e-9), Math.abs(res.headlosses.V1) + ' vs ' + expect);
	// The trap the other direction: a valve must contribute NO friction. Its zero length is what
	// guarantees that, and a future "give it a small length so it looks like a link" would break
	// this and nothing else.
	ok('...with no friction of its own', EngCalcs.lpnResistance(model.links[1], 'hw').r === 0);

	// THE SETTING, NOT k. A TCV that read link.k would develop zero loss here, which is a network
	// that solves and looks entirely reasonable.
	ok('lpnLinkK reads a TCV\'s loss out of its SETTING',
		EngCalcs.lpnLinkK({ type: 'valve', valveType: 'TCV', setting: 8, k: 3 }) === 8);
	ok('...and every other link\'s out of k',
		EngCalcs.lpnLinkK({ type: 'pipe', k: 3 }) === 3 &&
		EngCalcs.lpnLinkK({ type: 'valve', valveType: 'PRV', setting: 40, k: 3 }) === 3);

	// AN ACTIVE VALVE IS REFUSED BY NAME. This is the message a user meets when the EPANET module
	// cannot be loaded (offline, blocked), and the whole reason this page writes its own
	// diagnostics instead of surfacing EPANET's numbered errors.
	const prvModel = {
		method: 'hw',
		nodes: [
			{ id: 'R', type: 'reservoir', elev: 0, head: 100 },
			{ id: 'J1', type: 'junction', elev: 0, demand: 0 },
			{ id: 'J2', type: 'junction', elev: 0, demand: 0.02 }
		],
		links: [
			{ id: 'L1', type: 'pipe', from: 'R', to: 'J1', length: 200, diameter: 0.25, roughness: 130, k: 0, status: 'open' },
			{ id: 'V7', type: 'valve', valveType: 'PRV', from: 'J1', to: 'J2', length: 0, diameter: 0.25, roughness: 150, setting: 40, k: 0, status: 'open' }
		]
	};
	ok('a PRV is not native', !EngCalcs.lpnValveIsNative(prvModel.links[1]));
	ok('a TCV is', EngCalcs.lpnValveIsNative({ type: 'valve', valveType: 'TCV' }));
	ok('a pipe is', EngCalcs.lpnValveIsNative({ type: 'pipe' }));
	ok('lpnEpanetOnlyValves names it', EngCalcs.lpnEpanetOnlyValves(prvModel).join(',') === 'V7');

	const nativeIssues = EngCalcs.lpnDiagnose(prvModel, { engine: 'native' });
	const refusal = nativeIssues.filter((i) => i.code === 'valve-needs-epanet')[0];
	ok('the native engine refuses it', !!refusal, JSON.stringify(nativeIssues));
	ok('...NAMING the valve', refusal && refusal.ids.join(',') === 'V7');
	const solved = EngCalcs.lpnSolve(prvModel);
	ok('...and lpnSolve carries that refusal out, rather than solving it wrong',
		!solved.ok && solved.issues.some((i) => i.code === 'valve-needs-epanet'));

	// AND THE EPANET PATH MUST NOT INHERIT THE REFUSAL. A caller that names no engine is asking
	// "is this network sound?", which a PRV network is.
	ok('a caller that names no engine gets no such issue',
		EngCalcs.lpnDiagnose(prvModel).every((i) => i.code !== 'valve-needs-epanet'),
		JSON.stringify(EngCalcs.lpnDiagnose(prvModel)));

	// EPANET's own placement rule, checked for BOTH engines because it is a fact about the drawing.
	const onTank = {
		method: 'hw',
		nodes: [
			{ id: 'R', type: 'reservoir', elev: 0, head: 100 },
			{ id: 'J1', type: 'junction', elev: 0, demand: 0.02 }
		],
		links: [
			{ id: 'V8', type: 'valve', valveType: 'PRV', from: 'R', to: 'J1', length: 0, diameter: 0.25, roughness: 150, setting: 40, k: 0, status: 'open' }
		]
	};
	const placed = EngCalcs.lpnDiagnose(onTank).filter((i) => i.code === 'valve-on-fixed-head')[0];
	ok('an active valve sitting straight on a reservoir is caught, in either engine',
		!!placed && placed.ids.join(',') === 'V8', JSON.stringify(EngCalcs.lpnDiagnose(onTank)));
	// A TCV on a reservoir is legal in EPANET and must not be caught by that check.
	const tcvOnRes = JSON.parse(JSON.stringify(onTank));
	tcvOnRes.links[0].valveType = 'TCV';
	ok('...but a throttle valve there is legal and is not',
		EngCalcs.lpnDiagnose(tcvOnRes).every((i) => i.code !== 'valve-on-fixed-head'));
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
