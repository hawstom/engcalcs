// EVERY RUN LEAVES A RUN REPORT, a single instant included (Task 733; Tom, 2026-11-01).
//
//   node dev/lpn-spike/instant-report-harness.js
//
// js/lpn-time.js keeps the model of the last single-instant solve and turns it into EPANET's text report when the report is
// asked for: at once for the built-in solver, a moment later for EPANET. Held here: neither engine leaves the page without
// one, the two reports agree line for line (clock stamps aside), the model the solver was handed is not changed by solving
// it (so keeping the reference is safe), and a period run replaces an instant's report.
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
Object.assign(EngCalcs, require(path.join(ROOT, 'js', 'lpn-rules.js')));
['lpn-inp', 'lpn-epanet', 'lpn-time', 'lpn-native-run'].forEach((f) => require(path.join(ROOT, 'js', f + '.js')));
const { buildModel } = require('./net3-model.js');
let pass = 0, fail = 0;
function ok(name, cond, extra) { console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : '')); cond ? pass++ : fail++; }
const stamp = (t) => String(t || '').replace(/(Sun|Mon|Tue|Wed|Thu|Fri|Sat) [A-Z][a-z]{2} [ 0-9]\d \d\d:\d\d:\d\d \d{4}/g, '<TIME>');
function load(file) {
	const m = buildModel(EngCalcs, EngCalcs.lpnInpParse(fs.readFileSync(path.join(__dirname, 'reference', file), 'utf8')));
	m.hydraulics = Object.assign({ accuracy: 1e-5 }, m.hydraulics || {});
	m.time = m.time || {}; m.time.times = Object.assign({}, m.time.times || EngCalcs.lpnTimesDefaults(), { duration: 0 });
	return m;
}
async function run() {
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	ok('no run yet: no report to show', EngCalcs.lpnTimeHasReport() === false);
	for (const file of ['Net1.inp', 'Net3.inp']) {
		const m = load(file), before = JSON.stringify(m);
		EngCalcs.lpnSolve(m, { tol: 1e-5 });
		ok(file + ': solving does not change the model it was handed', JSON.stringify(m) === before);
		EngCalcs.lpnTimeInstantRun(m, 'native');
		ok(file + ': a solved instant has a report to show', EngCalcs.lpnTimeHasReport() === true);
		ok(file + ': the built-in solver writes it at once, no waiting', EngCalcs.lpnTimeReportAsync() === null);
		const nat = EngCalcs.lpnTimeLastReport();
		ok(file + ': built-in report is EPANET\'s text', /E P A N E T/.test(nat) && /Analysis ended/.test(nat) && /Balanced after/.test(nat), nat.split('\n').length + ' lines');
		EngCalcs.lpnTimeInstantRun(m, 'epanet');
		ok(file + ': EPANET\'s instant report is not there until asked', EngCalcs.lpnTimeLastReport() === '');
		const later = EngCalcs.lpnTimeReportAsync();
		ok(file + ': ...it is asked for and answers later', !!later && typeof later.then === 'function');
		await later;
		const ep = EngCalcs.lpnTimeLastReport();
		const a = stamp(ep).split('\n'), b = stamp(nat).split('\n');
		let first = -1;
		for (let i = 0; i < Math.max(a.length, b.length); i++) { if (a[i] !== b[i] && !/^\s+(Total Inflow|Consumer Demand|Demand Deficit|Emitter Flow|Leakage Flow|Total Outflow|Storage Flow|Flow Ratio):/.test(a[i] || '')) { first = i; break; } }
		ok(file + ': the two engines\' instant reports agree line for line', first < 0 && a.length > 30, first < 0 ? a.length + ' lines' : `line ${first + 1}: EPANET "${a[first]}" built-in "${b[first]}"`);
	}
	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}
run().catch((e) => { console.error(e); process.exit(2); });
