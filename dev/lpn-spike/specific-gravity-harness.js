// SPECIFIC GRAVITY SCALES A PRESSURE IN EVERY UNIT, IN BOTH ENGINES (Tom, 2026-10-12: *"1 ft or
// meter of water creates a pressure that varies with specific gravity"*). A pressure in m or ft is
// a column of WATER; head and HGL stay heads of the fluid, unscaled. Run with:
//   node dev/lpn-spike/specific-gravity-harness.js
//
// On Net1 with Specific gravity 1.1:
//   1. Heads are the same as SG 1 in both engines.
//   2. Pressure in metres = 1.1 x (H - z) in both engines, and the two agree to solver tolerance.
//   3. A tank's pressure is SG x (head - ground), after the ground shift, in both engines.
//   4. The page shows psi = metres x the psi factor, with SG counted once (not twice); SG 1 is
//      unchanged from before.
//   5. The contour scale for one metre of head is SG x the unit's factor.

'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-inp.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections, migrateSaved: migrateSaved, applySaved: applySaved,\n" +
	"\t\tassembleModel: assembleModel, toSI: toSI, toDisplay: toDisplay, resultUnit: resultUnit,\n" +
	"\t\tcontourScale: contourGroundScale, unitFactor: unitFactor,\n"
);

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined || cond ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-12);

(async function main() {
	setUnitSet('us');
	L.seedDefaultInputs();
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net1.inp'), 'utf8'));
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	L.applySaved(L.migrateSaved(L.docFromInp(parsed, 'Net1.inp')));

	const hyd = () => { const s = L.getSettings(); if (!s.hydraulics) { s.hydraulics = {}; } return s.hydraulics; };
	delete hyd().specificGravity;
	const m1 = L.assembleModel();
	const nat1 = EngCalcs.lpnSolve(m1), epa1 = await EngCalcs.lpnSolveEpanet(m1);
	hyd().specificGravity = 1.1;
	const m2 = L.assembleModel();
	const nat2 = EngCalcs.lpnSolve(m2), epa2 = await EngCalcs.lpnSolveEpanet(m2);

	console.log('\n1. BOTH ENGINES: heads unscaled, pressures x SG');
	const all = Object.keys(nat1.pressures);
	const junctions = all.filter((id) => m1.nodes.some((n) => n.id === id && n.type === 'junction'));
	const byId = {}; m1.nodes.forEach((n) => { byId[n.id] = n; });
	ok('Net1 solves in both engines', nat2.converged !== false && epa2.ok !== false);
	let wh = 0, wp = 0, we = 0, we1 = 0, wz = 0;
	junctions.forEach((id) => {
		wh = Math.max(wh, Math.abs(nat2.heads[id] - nat1.heads[id]), Math.abs(epa2.heads[id] - epa1.heads[id]));
		wp = Math.max(wp, Math.abs(nat2.pressures[id] - 1.1 * nat1.pressures[id]), Math.abs(epa2.pressures[id] - 1.1 * epa1.pressures[id]));
		we = Math.max(we, Math.abs(nat2.pressures[id] - epa2.pressures[id]));
		we1 = Math.max(we1, Math.abs(nat1.pressures[id] - epa1.pressures[id]));
		wz = Math.max(wz, Math.abs(nat2.pressures[id] - 1.1 * (nat2.heads[id] - (byId[id].elev || 0))));
	});
	ok('heads do not move with SG, in either engine', wh < 1e-3, String(wh));
	ok('pressure in metres is 1.1 x the SG 1 pressure, in each engine', wp < 1e-3, String(wp));
	ok('pressure_m = 1.1 x (H - z) at every junction (native)', wz < 1e-9, String(wz));
	ok('with SG 1.1 the engines agree in metres (solver tolerance)', we < 1e-3, String(we));
	ok('with SG 1 they agree as before', we1 < 1e-3, String(we1));
	const tank = m1.nodes.find((n) => n.type === 'tank');
	if (tank) {
		const g = (typeof tank.ground === 'number') ? tank.ground : (tank.elev || 0);
		ok('tank pressure = 1.1 x (head - ground), native and EPANET',
			Math.abs(nat2.pressures[tank.id] - 1.1 * (nat2.heads[tank.id] - g)) < 1e-9 &&
			Math.abs(epa2.pressures[tank.id] - 1.1 * (epa2.heads[tank.id] - g)) < 1e-3,
			nat2.pressures[tank.id] + ' / ' + epa2.pressures[tank.id] + ' / ' + 1.1 * (nat2.heads[tank.id] - g));
	}

	console.log('\n2. THE PAGE: psi is metres x the factor, SG counted once');
	const psiF = EngCalcs.unitFactors.psi, jId = junctions[0];
	function show(unit, res, sg) {
		L.applyUnitSelections({ lpn_u_pressure: unit });
		if (sg === undefined) { delete hyd().specificGravity; } else { hyd().specificGravity = sg; }
		return L.toDisplay(res.pressures[jId], L.resultUnit('pressure'));
	}
	ok('psi, SG 1.1: metres (already x1.1) x the psi factor', rel(show('psi', nat2, 1.1), 1.1 * nat1.pressures[jId] * psiF) < 1e-9);
	ok('psi, SG 1.1: EPANET engine agrees with the native one', rel(show('psi', epa2, 1.1), show('psi', nat2, 1.1)) < 1e-4);
	ok('psi, SG 1: unchanged from before', rel(show('psi', nat1, 1), nat1.pressures[jId] * psiF) < 1e-12);
	ok('metres, SG 1.1: 1.1 x (H - z)', rel(show('mh2o', nat2, 1.1), 1.1 * nat1.pressures[jId]) < 1e-9);
	ok('metres, SG 1.1: EPANET engine agrees with the native one', rel(show('mh2o', epa2, 1.1), show('mh2o', nat2, 1.1)) < 1e-4);

	console.log('\n3. CONTOURS');
	L.applyUnitSelections({ lpn_u_pressure: 'psi' }); hyd().specificGravity = 1.1;
	ok('one metre of head contours as SG x the psi factor', rel(L.contourScale(), 1.1 * psiF) < 1e-12);

	console.log('\n' + (fails ? fails + ' FAILED of ' + checks : 'all ' + checks + ' specific-gravity checks passed'));
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });
