// THE BUILT-IN SOLVER AGAINST EPANET'S OWN ENGINE ON THE SETTINGS-AND-TANKS FIXTURES (EPS audit 2, 2026-11-18). Run with:
//   node dev/lpn-spike/eps-audit-fixtures-harness.js
//
// Five small networks in dev/lpn-spike/fixtures/eps-audit/ (tanks, pumps, pumps2, valves, emitters) are each run
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
	valves: (c) => c.valveSettings >= 8 && c.statusChanges > 4,
	emitters: (c) => c.minEmit < -1e-3 && c.maxEmit > 1e-3
};
Object.keys(NEEDS).forEach((name) => {
	const rel = 'dev/lpn-spike/fixtures/eps-audit/' + name + '.inp', jf = path.join(os.tmpdir(), 'epsfix-' + process.pid + '-' + name + '.json');
	const r = cp.spawnSync(process.execPath, [path.join(__dirname, 'eps-audit-vs-epanet.js'), '--one=' + rel, '--json=' + jf], { encoding: 'utf8', maxBuffer: 1 << 26, cwd: ROOT });
	let j = null; try { j = JSON.parse(fs.readFileSync(jf, 'utf8')); fs.unlinkSync(jf); } catch (e) { }
	const res = j && j.results && j.results[0];
	if (!res) { ok(name + ': ran', false, ((j && j.skipped) || [r.stderr]).join(' ').slice(0, 300)); return; }
	['BRIDGE', 'NATIVE'].forEach((lab) => {
		const run = res.runs.filter((x) => x.label === lab)[0];
		ok(name + ': ' + lab + ' agrees with the engine', !!run && run.exceed.length === 0 && run.sameTimes, run ? run.exceed.join(',') : 'no run: ' + res.notes.join(' '));
	});
	ok(name + ': the original file and the page\'s export run alike in EPANET', res.origVsExport && res.origVsExport.head <= 1e-3 && res.origVsExport.frames === res.origVsExport.exportFrames,
		res.origVsExport ? res.origVsExport.head.toExponential(1) + ' m' : 'not run');
	ok(name + ': still exercises its feature', !!res.cover && NEEDS[name](res.cover), JSON.stringify(res.cover));
});
console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
