// THE BUILT-IN RUN WRITES EPANET'S TEXT REPORT (Task 733, native-wire slice 4).
//
//   node dev/lpn-spike/native-report-harness.js
//
// EPANET writes a report as it runs: the banner, the summary of the project, "Hydraulic Status:" with a line for every
// balanced step, every tank and reservoir that changes from filling to emptying or closed, every link that changes
// status, every control and rule that acts, the WARNING lines, and the flow balance. The built-in loop writes the same
// lines in the same order (js/lpn-native-run.js, THE RUN REPORT). Each case here runs EPANET 2.3.5 and the loop on one
// network and holds the two texts equal line for line, the three clock stamps aside, Net1, Net2 and Net3 as EPA ships them
// and Net3 with its demands raised until its pumps and tanks act at other moments, at Accuracy 1e-5 and 1e-3. The trial
// count in "Balanced after N trials" is the loop stopping where EPANET's solve does (hasconverged()), from the flows
// EPANET starts from (initlinkflow()), so it is held too.
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
function ok(name, cond, extra) {
	console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '   ' + extra : ''));
	if (cond) { pass++; } else { fail++; }
}
// The banner box (lines that start and end with a star) names the solver that wrote the report, so the two differ by design.
const stamp = (t) => String(t || '').replace(/(Sun|Mon|Tue|Wed|Thu|Fri|Sat) [A-Z][a-z]{2} [ 0-9]\d \d\d:\d\d:\d\d \d{4}/g, '<TIME>').replace(/^[ \t]*\*.*\*[ \t]*$/gm, '<BANNER>');
const copy = (m) => JSON.parse(JSON.stringify(m));
function load(file, edit) {
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(path.join(__dirname, 'reference', file), 'utf8'));
	const m = buildModel(EngCalcs, parsed);
	m.hydraulics = Object.assign({ accuracy: 1e-5 }, m.hydraulics || {});
	if (edit) { edit(m); }
	return m;
}
async function same(name, m) {
	const e = await EngCalcs.lpnEpanetRun(copy(m)), n = EngCalcs.lpnNativeRun(copy(m));
	if (!e.ok || !n.ok) { ok(name, false, `epanet ok=${e.ok} built-in ok=${n.ok} ` + JSON.stringify(n.issues || '')); return; }
	const a = stamp(e.report).split('\n'), b = stamp(n.report).split('\n');
	let first = -1;
	const bal = /^(\s+)(Total Inflow|Consumer Demand|Demand Deficit|Emitter Flow|Leakage Flow|Total Outflow|Storage Flow|Flow Ratio):\s+(-?[0-9.]+)$/;
	for (let i = 0; i < Math.max(a.length, b.length); i++) {
		if (a[i] === b[i]) { continue; }
		const x = bal.exec(a[i] || ''), y = bal.exec(b[i] || '');
		if (x && y && x[2] === y[2] && Math.abs(Number(x[3]) - Number(y[3])) <= Math.max(0.0015, 2e-5 * Math.abs(Number(x[3])))) { continue; }   // the two hydraulics differ by a few millionths of the flow
		first = i; break;
	}
	ok(name + ': the run report is EPANET\'s, line for line', first < 0 && a.length > 60,
		first < 0 ? `${a.length} lines, ${a.filter((l) => /Balanced after/.test(l)).length} steps` : `line ${first + 1}: EPANET "${a[first]}" built-in "${b[first]}"`);
	return { e, n, a, b };
}
async function run() {
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	for (const file of ['Net1.inp', 'Net2.inp', 'Net3.inp']) {
		for (const acc of [1e-5, 1e-3]) {
			await same(`${file} at Accuracy ${acc}`, load(file, (m) => { m.hydraulics.accuracy = acc; }));
		}
	}
	for (const mult of [1.2, 1.3, 1.6, 2]) {
		await same(`Net3 with demands x${mult} (controls fire at other moments)`, load('Net3.inp', (m) => { m.hydraulics.demandMultiplier = mult; }));
	}
	// The WARNING lines: negative pressures, a pump past its curve or unable to lift, nodes cut off (and the closed link
	// that cuts them off), written after the step they belong to.
	for (const [file, mult] of [['Net1.inp', 3], ['Net1.inp', 6], ['Net3.inp', 3], ['Net3.inp', 6]]) {
		const r = await same(`${file} with demands x${mult} (warnings)`, load(file, (m) => { m.hydraulics.demandMultiplier = mult; }));
		ok(`${file} x${mult}: EPANET wrote warnings and so did the loop`, r.a.some((l) => /WARNING/.test(l)) && r.b.filter((l) => /WARNING/.test(l)).length === r.a.filter((l) => /WARNING/.test(l)).length,
			r.a.filter((l) => /WARNING/.test(l)).length + ' lines');
	}
	// The pieces by name, on the shipped example, so a regression says which line broke.
	const r = await same('Net3 as shipped', load('Net3.inp'));
	const t = r.b.join('\n');
	ok('the built-in report header names the built-in solver and never prints EPANET\'s banner; EPANET\'s own report keeps its banner', /Looped Network built-in solver/.test(r.n.report) && !/E P A N E T/.test(r.n.report) && /E P A N E T/.test(r.e.report));
	ok('the report has the banner, the summary, the status table and the flow balance in EPANET\'s order',
		t.indexOf('Number of Junctions') < t.indexOf('Analysis begun') && t.indexOf('Hydraulic Status:') < t.indexOf('Hydraulic Flow Balance (L/s)') && /Analysis ended/.test(t));
	ok('a control that acts is written as EPANET writes it ("changed by Tank 1 control", then "changed from closed to open")',
		/Pump 335 changed by Tank 1 control/.test(t) && /Pipe 330 changed from closed to open/.test(t));
	ok('a tank and a reservoir are written when they change ("Tank 1 is filling at 3.99 m", "Reservoir Lake is closed")',
		/Tank 1 is (filling|emptying) at \d+\.\d\d m/.test(t) && /Reservoir Lake is closed/.test(t));
	console.log(`\n${pass} passed, ${fail} failed`);
	process.exit(fail ? 1 : 0);
}
run().catch((e) => { console.error(e); process.exit(2); });
