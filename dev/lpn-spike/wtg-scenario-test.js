// WaterGEMS child-scenario test file (Task 749, 2026-11-13): the small chlorine project of ctl-composite-test with ONE child
// scenario, "Child A", written by the candidate scenario writer. Base: J1 demand 300 gpm, pipe 2 8 in. Child A: 250 gpm, 10 in (500 gpm drains T1 to empty and runs negative).
//
//   node dev/lpn-spike/wtg-scenario-test.js [--out <dir>]    default ~/tom-files/2026-11-13/wtg-scenario-test
//
// Prints EPANET's expected J1 pressure at hour 0 and T1 level at hour 12, for Base and Child A, to the terminal ONLY, so Tom's
// reading stays blind (the same numbers are in dev/wtg-export.md). Licence line: nobody decompiles or probes Bentley software.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const ft = require('./wtg-feature-tests.js');
const ct = require('./wtg-composite-test.js');
const ROOT = path.resolve(__dirname, '..', '..');
const NAME = 'ctl-scenario-test';

function baseNet() { return ct.compositeNet(); }
function childNet() {
	const t = baseNet().replace(/ J1\s+50\s+300/, ' J1 50 250').replace(/ 2\s+J0\s+J1\s+1000\s+8 /, ' 2 J0 J1 1000 10 ');
	if (t === baseNet()) { throw new Error('the child edits did not apply'); }
	return t;
}

// EPANET's J1 pressure (psi) at hour 0 and T1 level (ft) at hours 0..24, for the network WaterGEMS holds (the pump a node between two 1 ft pipes).
async function expected(inp, ruleStep) {
	let t = inp.replace(/(\[JUNCTIONS\]\n[^\n]*\n)/, '$1 PUa             \t20          \t0           \t\n PUb             \t20          \t0           \t\n');
	t = t.replace(/ PU1\s+R\s+J0\s+HEAD 1(\s+PATTERN \w+)?\s*;/, ' PU1             \tPUa             \tPUb             \tHEAD 1$1');
	t = t.replace(/(\[PIPES\]\n[^\n]*\n)/, '$1 PU1-A           \tR               \tPUa             \t1           \t99          \t130         \t0           \tOpen\n PU1-B           \tPUb             \tJ0              \t1           \t99          \t130         \t0           \tOpen\n');
	t = t.replace(/(\[COORDINATES\]\n[^\n]*\n)/, '$1 PUa             \t0.50            \t1.00\n PUb             \t1.50            \t1.00\n');
	if (ruleStep) { t = t.replace('[TIMES]\n', '[TIMES]\n Rule Timestep      \t' + ruleStep + '\n'); }
	const ep = await import('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const ws = new ep.Workspace(); await ws.loadModule();
	const p = new ep.Project(ws);
	ws.writeFile('r.inp', t); p.open('r.inp', 'r.rpt', 'r.out');
	const tk = p.getNodeIndex('T1'), j1 = p.getNodeIndex('J1'), out = { j1p0: null, t1: {} };
	p.openH(); p.initH(0);
	for (let g = 0; g < 1000; g++) {
		const tt = p.runH();
		if (tt === 0) { out.j1p0 = p.getNodeValue(j1, 11); }
		if (tt % 3600 === 0) { out.t1[tt / 3600] = p.getNodeValue(tk, 11) / 0.4333; }
		if (!(p.nextH() > 0)) { break; }
	}
	p.close();
	return out;
}

// What the writer produces now: { sqlite, wtg, report }. The same bytes feed the folder and the harness.
async function build(env) {
	const parsed = env.EngCalcs.lpnInpParse(baseNet());
	const out = env.lib.writeWtg(env.SQL, env.tplSqlite, parsed, { initial: {}, changes: [] }, { name: NAME, efficiency: 75, candidate: { scenarios: [{ name: 'Child A', inp: childNet() }] } });
	const wtg = env.lib.patchWtgXml(env.tplWtg, out.report.removedChildScenarios, 1, out.report.removedChildAlternatives, out.report.extentFt, out.report.addedScenarios);
	return { sqlite: out.bytes, wtg: wtg, report: out.report };
}

async function main(outDir) {
	const env = await ft.setup();
	const b = await build(env);
	fs.mkdirSync(outDir, { recursive: true });
	fs.writeFileSync(path.join(outDir, NAME + '.wtg.sqlite'), b.sqlite);
	fs.writeFileSync(path.join(outDir, NAME + '.wtg'), b.wtg);
	return b.report;
}

module.exports = { NAME, baseNet, childNet, expected, build, main };

if (require.main === module) {
	(async function () {
		const args = {};
		for (let i = 2; i < process.argv.length; i += 2) { args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1]; }
		const outDir = args.out || path.join(os.homedir(), 'tom-files', '2026-11-13', 'wtg-scenario-test');
		const r = await main(outDir);
		console.log('written under ' + outDir + ': integrity ' + r.integrity + ', foreign key violations ' + r.foreignKeyViolations + ', scenarios ' + JSON.stringify(r.scenarios));
		for (const rs of [[null, 'rule step 6 min (EPANET default)'], ['1:00', 'rule step 1 h']]) {
			for (const [label, net] of [['Base', baseNet()], ['Child A', childNet()]]) {
				const e = await expected(net, rs[0]);
				console.log('EPANET, ' + rs[1] + ', ' + label + ': J1 hour 0 ' + e.j1p0.toFixed(2) + ' psi; T1 hour 12 ' + e.t1[12].toFixed(2) + ' ft');
			}
		}
	}()).catch((e) => { console.error(e); process.exit(1); });
}
