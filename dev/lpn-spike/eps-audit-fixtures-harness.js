// THE BUILT-IN SOLVER AGAINST EPANET'S OWN ENGINE ON THE SETTINGS-AND-TANKS FIXTURES (EPS audit 2, 2026-11-18). Run with:
//   node dev/lpn-spike/eps-audit-fixtures-harness.js
//
// Small networks in dev/lpn-spike/fixtures/eps-audit/ (tanks, pumps, pumps2, valves, valves2, valves3, emitters, emitters2 with a demand multiplier and pattern start, emitters-pda; valves2 and valves3 carry a TCV with minor loss 2 that a control, rule or [STATUS] Open fixes open; two scenario runs below) are each run
// through eps-audit-vs-epanet.js, which compares the built-in loop and the page's EPANET bridge with the engine driven
// directly at every reporting time: heads, pressures, demands, tank level and VOLUME, flows, headloss, link status, pump
// SPEED, valve SETTING and EMITTER flow. Every comparison must stay inside the audit's tolerance, the original file and
// the page's own export of it must run the same in EPANET (a [TIMES] value or tank column the page drops shows here), and
// each fixture must still exercise what it is for (a negative emitter flow, a tank that fills and empties, a pump that
// stops, a valve that changes setting), so a fixture cannot go on passing by no longer testing anything.
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..', '..') + path.sep;
let fails = 0;
function ok(name, cond, extra) { console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra)); if (!cond) { fails++; } }
const NEEDS = {
	tanks: (c) => c.tankVolSpan > 300,
	pumps: (c) => c.pumpSettings >= 6 && c.pumpStops > 0 && c.statusChanges > 0,
	pumps2: (c) => c.pumpSettings >= 3 && c.pumpStops > 0 && c.statusChanges > 4,
	energy: (c) => c.pumpStops > 0 && c.statusChanges > 3,
	valves: (c) => c.valveSettings >= 8 && c.statusChanges > 4,
	valves2: (c) => c.valveSettings >= 8 && c.statusChanges > 3,
	valves3: (c) => c.valveSettings >= 2,
	emitters: (c) => c.minEmit < -1e-3 && c.maxEmit > 1e-3,
	emitters2: (c) => c.minEmit < -1e-3 && c.maxEmit > 1e-3,
	'emitters-pda': (c) => c.minEmit < -1e-3 && c.maxEmit > 1e-3
};
// Third pass (2026-11-20): a SCENARIO's override of a pump speed or a tank's Can overflow, run through the page (createScenario, setProp,
// assembleModel) in both engines, against EPANET on the ORIGINAL file with the same change written in by hand (<name>.<what>.scn.json).
const SCENARIOS = {
	'pumps.speed': (c) => c.scenarioMoved > 0.05 && c.pumpSettings >= 6,
	'tanks.overflow': (c) => c.scenarioMoved > 0.05 && c.tankVolSpan > 300
};
const RUNS = Object.keys(NEEDS).map((n) => ({ name: n, base: n, scn: null, needs: NEEDS[n] })).concat(Object.keys(SCENARIOS).map((n) => ({ name: n + ' (scenario)', base: n.split('.')[0], scn: n, needs: SCENARIOS[n] })));
RUNS.forEach((run) => {
	const name = run.name, rel = 'dev/lpn-spike/fixtures/eps-audit/' + run.base + '.inp', jf = path.join(os.tmpdir(), 'epsfix-' + process.pid + '-' + run.base + (run.scn ? '-scn' : '') + '.json');
	const args = [path.join(__dirname, 'eps-audit-vs-epanet.js'), '--one=' + rel, '--json=' + jf];
	if (run.scn) { args.push('--scenario=dev/lpn-spike/fixtures/eps-audit/' + run.scn + '.scn.json'); }
	const r = cp.spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 1 << 26, cwd: ROOT });
	let j = null; try { j = JSON.parse(fs.readFileSync(jf, 'utf8')); fs.unlinkSync(jf); } catch (e) { }
	const res = j && j.results && j.results[0];
	if (!res) { ok(name + ': ran', false, ((j && j.skipped) || [r.stderr]).join(' ').slice(0, 300)); return; }
	['BRIDGE', 'NATIVE'].forEach((lab) => {
		const rr = res.runs.filter((x) => x.label === lab)[0];
		ok(name + ': ' + lab + ' agrees with the engine', !!rr && rr.exceed.length === 0 && rr.sameTimes, rr ? rr.exceed.join(',') : 'no run: ' + res.notes.join(' '));
	});
	ok(name + (run.scn ? ': the page\'s export of the scenario and the hand-edited file run alike in EPANET' : ': the original file and the page\'s export run alike in EPANET'), res.origVsExport && res.origVsExport.head <= 1e-3 && res.origVsExport.frames === res.origVsExport.exportFrames,
		res.origVsExport ? res.origVsExport.head.toExponential(1) + ' m' : 'not run');
	// energy (third pass): the built-in summary and the bridge's, per pump and the demand charge, against the engine's energy block for the ORIGINAL file
	// (prices, a price pattern, per-pump price, pattern and efficiency curve, a demand charge).
	// KNOWN: a pump stated `SPEED 0` is Open at speed 0 to EPANET (usage, average and peak kW counted while it stands open) and Closed to the page
	// (audit record, finding 5); pumps.inp has one (PU3), so only the other pumps' rows are held there.
	if (res.energyOrig && name === 'pumps') { ok(name + ': pump energy: every pump but the SPEED 0 one (PU3) agrees with the engine on the original file', !/PU[12]\./.test(res.energyOrig.detail), res.energyOrig.detail); }
	else if (res.energyOrig) {
		ok(name + ': pump energy, cost and demand charge: built-in summary agrees with the engine on the original file', res.energyOrig.good, res.energyOrig.detail);
		ok(name + ': pump energy cost and demand charge: bridge summary agrees with the engine on the original file', !!res.energyOrig.bridge && res.energyOrig.bridge.good, JSON.stringify(res.energyOrig.bridge));
		// EPANET 2.2's printed report multiplies the demand charge in twice (output.c saveenergy() stores Emax x Dcost back into Emax and report.c writeenergy() multiplies again);
		// the binary block is right. Pinned so the day the engine is fixed, the record is revisited.
		if (res.energyOrig.demandCharge > 0) { ok(name + ': the engine\'s printed demand charge is still its binary figure times the charge per kW (record, finding 3)', Math.abs(res.energyOrig.reportDemandCharge / res.energyOrig.demandCharge - 12) < 1e-2, res.energyOrig.reportDemandCharge + ' / ' + res.energyOrig.demandCharge); }
	}
	ok(name + ': still exercises its feature', !!res.cover && run.needs(res.cover), JSON.stringify(res.cover));
});
// Third pass (MSX over changing settings), a CEILING and not an agreement: the two engines still differ on these (audit record, finding 6), so each run is held to
// the worst gap measured on 2026-11-20 (mg/L on species that start at 0.5 to 1.2) with a margin, and fails if a change makes it worse. A fixed run raises no flag; lower the ceiling.
const MSX_CEILING = { pumps: 0.015, pumps2: 0.002, valves: 1e-4, valves2: 0.1, tanks: 1e-4 };
Object.keys(MSX_CEILING).forEach((base) => {
	const jf = path.join(os.tmpdir(), 'epsfix-' + process.pid + '-' + base + '-msx.json');
	const r = cp.spawnSync(process.execPath, [path.join(__dirname, 'eps-audit-vs-epanet.js'), '--one=dev/lpn-spike/fixtures/eps-audit/' + base + '.inp', '--msx=dev/lpn-spike/fixtures/eps-audit/changing.msx', '--json=' + jf], { encoding: 'utf8', maxBuffer: 1 << 26, cwd: ROOT });
	let j = null; try { j = JSON.parse(fs.readFileSync(jf, 'utf8')); fs.unlinkSync(jf); } catch (e) { }
	const res = j && j.results && j.results[0];
	ok(base + ' (MSX, links change under the species): the engine\'s species and the built-in loop\'s stay within the measured ceiling ' + MSX_CEILING[base], !!res && !!res.msx && res.msx.moved > 100 && res.msx.worst <= MSX_CEILING[base],
		res && res.msx ? 'worst ' + res.msx.worst.toExponential(2) + ' ' + res.msx.at : (r.stderr || '').slice(0, 200));
});
console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
