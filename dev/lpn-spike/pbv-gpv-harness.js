// PBV AND GPV, THROUGH THE REAL EPANET ENGINE -- ROADMAP Task 248. Run with:
//   node dev/lpn-spike/pbv-gpv-harness.js
//
// WHY THIS IS AN ENGINE HARNESS AND NOT A UNIT TEST. Both types are EPANET-only: they switch their
// own state inside the iteration, so our native solver never sees one and there is no second answer
// to compare against. Everything that can go wrong is therefore in the `.inp` WRITER, and it goes
// wrong silently -- js/lpn-epanet.js's own opening note says it exactly: a 0.15 m diameter written
// as "0.15" is read as 0.15 mm, "and the network still solves perfectly, just for a different
// network."
//
// So each case here is a network whose right answer is known by hand:
//
//   * A PBV removes EXACTLY its setting, whatever the flow. So the head difference across it is the
//     setting, and nothing else in the network can change that. If the setting were written in the
//     wrong unit, or into the wrong column, this comes out a plausible number that is not 7.
//   * A GPV's head loss is read off ITS OWN CURVE at the solved flow. So solving, then looking up
//     the flow on the curve we wrote, must reproduce the head difference the engine reports.
//
// A GPV also has a failure case worth pinning: with no curve there is nothing for EPANET to name,
// and the writer degrades it to an open throttle and says so, exactly as a pump with no curve
// becomes a pipe and says so.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-epanet.js'));

const MODULE_URL = 'file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js');
const LPS = 0.001;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function pipe(id, from, to, len, dia, rough) {
	return { id, type: 'pipe', from, to, length: len, diameter: dia, roughness: rough, k: 0, status: 'open' };
}
// A reservoir, a pipe, the valve under test, a pipe, and a demand at the end. The valve is the only
// thing between two measurable heads.
function network(valve) {
	return {
		name: valve.valveType, method: 'hw',
		nodes: [
			{ id: 'R', type: 'reservoir', elev: 0, head: 100 },
			{ id: 'J1', type: 'junction', elev: 10, demand: 0 },
			{ id: 'J2', type: 'junction', elev: 10, demand: 0 },
			{ id: 'J3', type: 'junction', elev: 5, demand: 40 * LPS }
		],
		links: [
			pipe('L1', 'R', 'J1', 400, 0.25, 130),
			Object.assign({ id: 'V1', type: 'valve', from: 'J1', to: 'J2',
				length: 0, diameter: 0.25, roughness: 130, k: 0, status: 'open' }, valve),
			pipe('L2', 'J2', 'J3', 300, 0.25, 130)
		]
	};
}

async function main() {
	// ---- 1. what gets written -------------------------------------------------------------------
	console.log('\n--- the .inp we hand the engine ---');
	const pbvInp = EngCalcs.lpnToInp(network({ valveType: 'PBV', setting: 7 }));
	const pbvRow = pbvInp.inp.split('\n').filter(l => /^\s*V1\s/.test(l))[0] || '';
	ok('a PBV is written as a PBV', /\bPBV\b/.test(pbvRow), pbvRow.trim());
	ok('...with its pressure drop as the setting, unscaled -- LPS pressure IS metres of water',
		/\bPBV\s+7\b/.test(pbvRow), pbvRow.trim());

	const gpv = network({ valveType: 'GPV', setting: 0,
		curvePoints: [[0, 0], [20 * LPS, 1.5], [40 * LPS, 6]] });
	const gpvInp = EngCalcs.lpnToInp(gpv);
	const gpvRow = gpvInp.inp.split('\n').filter(l => /^\s*V1\s/.test(l))[0] || '';
	ok('a GPV is written as a GPV naming its own curve', /\bGPV\s+G_V1\b/.test(gpvRow), gpvRow.trim());
	ok('...and that curve is in the file', /\[CURVES\]/.test(gpvInp.inp) && /G_V1\s+20\s+1\.5/.test(gpvInp.inp),
		(gpvInp.inp.match(/ G_V1[^\n]*/g) || []).join(' | '));
	// The curve is named for the element that owns it (Task 248.04) -- there is no curve library.
	ok('...named after the valve, so no curve exists apart from its owner', /G_V1/.test(gpvInp.inp));

	// A GPV with no points cannot be written: EPANET rejects a GPV naming a curve that is not there.
	const bare = EngCalcs.lpnToInp(network({ valveType: 'GPV', setting: 0, curvePoints: [] }));
	const bareRow = bare.inp.split('\n').filter(l => /^\s*V1\s/.test(l))[0] || '';
	ok('a GPV with no curve degrades to an open throttle rather than an invalid file',
		/\bTCV\s+0\b/.test(bareRow), bareRow.trim());
	ok('...and says so', bare.warnings.some(w => w.code === 'gpv-no-curve-as-open'),
		JSON.stringify(bare.warnings.map(w => w.code)));

	// ---- 2. what the engine then does -------------------------------------------------------------
	console.log('\n--- and what EPANET makes of it ---');
	const pbvRes = await EngCalcs.lpnSolveEpanet(network({ valveType: 'PBV', setting: 7 }),
		{ moduleUrl: MODULE_URL });
	ok('the PBV network solves', pbvRes.ok, JSON.stringify(pbvRes.issues || []));
	if (pbvRes.ok) {
		const drop = pbvRes.heads.J1 - pbvRes.heads.J2;
		// **EXACTLY THE SETTING.** A PBV is defined by this and by nothing else, so any other number
		// here is a units or column error in the writer, not a modelling difference.
		ok('...and the valve removes exactly the pressure drop it was given',
			Math.abs(drop - 7) < 2e-3, drop.toFixed(6) + ' m against 7');
		ok('...with water still flowing through it', Math.abs(pbvRes.flows.V1) > 1e-6,
			(pbvRes.flows.V1 * 1000).toFixed(3) + ' L/s');
	}

	const gpvRes = await EngCalcs.lpnSolveEpanet(gpv, { moduleUrl: MODULE_URL });
	ok('the GPV network solves', gpvRes.ok, JSON.stringify(gpvRes.issues || []));
	if (gpvRes.ok) {
		const q = Math.abs(gpvRes.flows.V1), drop = gpvRes.heads.J1 - gpvRes.heads.J2;
		// Read our own curve at the solved flow, linearly between the points we wrote -- which is
		// how EPANET interpolates a curve too.
		const pts = gpv.links[1].curvePoints;
		let want = pts[pts.length - 1][1];
		for (let i = 1; i < pts.length; i++) {
			if (q <= pts[i][0]) {
				const t = (q - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]);
				want = pts[i - 1][1] + t * (pts[i][1] - pts[i - 1][1]);
				break;
			}
		}
		ok('...and the valve loses what its own curve says at the flow it settled on',
			Math.abs(drop - want) < 5e-3,
			drop.toFixed(4) + ' m against ' + want.toFixed(4) + ' at ' + (q * 1000).toFixed(3) + ' L/s');
	}

	// **EDITING A GPV'S CURVE MUST INVALIDATE THE CACHED ENGINE PROJECT.** Every other valve is
	// re-pushed through setLinkValue on each solve; a GPV cannot be (EPANET error 207), so the only
	// thing that can carry a curve edit to the engine is a rebuild — and the only thing that forces
	// a rebuild is the signature. Without the points in it, changing a curve returns the OLD curve's
	// answer, with no error anywhere.
	console.log('\n--- a curve edit reaches the engine ---');
	const steeper = network({ valveType: 'GPV', setting: 0,
		curvePoints: [[0, 0], [20 * LPS, 3], [40 * LPS, 12]] });
	const steepRes = await EngCalcs.lpnSolveEpanet(steeper, { moduleUrl: MODULE_URL });
	ok('a steeper curve gives a bigger loss, so the edit was not cached away',
		steepRes.ok && Math.abs((steepRes.heads.J1 - steepRes.heads.J2) - 12) < 5e-3,
		steepRes.ok ? (steepRes.heads.J1 - steepRes.heads.J2).toFixed(4) + ' m against 12'
			: JSON.stringify(steepRes.issues));

	// ---- 3. the routing rule ----------------------------------------------------------------------
	console.log('\n--- which engine answers ---');
	ok('neither type is native, so a network holding one is routed to EPANET',
		!EngCalcs.lpnValveIsNative({ type: 'valve', valveType: 'PBV' }) &&
		!EngCalcs.lpnValveIsNative({ type: 'valve', valveType: 'GPV' }));
	ok('...and both are named when the engine is unreachable',
		EngCalcs.lpnEpanetOnlyValves(network({ valveType: 'PBV', setting: 7 })).join() === 'V1');
	// The native solver must REFUSE rather than solve one wrong.
	const refused = EngCalcs.lpnSolve(network({ valveType: 'PBV', setting: 7 }));
	ok('the native solver refuses a PBV by name rather than solving it as an open pipe',
		!refused.ok && JSON.stringify(refused.issues || []).indexOf('V1') >= 0,
		JSON.stringify(refused.issues || []));

	console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILED');
	process.exit(fails === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
