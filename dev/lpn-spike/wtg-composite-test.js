// WaterGEMS composite-control test file (Task 749, 2026-11-09): the small chlorine network with the three composite rules of
// Tom's ctl-composite save (AND, OR, two THEN actions), written by the exporter.
//
//   node dev/lpn-spike/wtg-composite-test.js [--out <dir>]    default ~/tom-files/2026-11-09/wtg-composite-test
//
// Prints EPANET's expected PU1 status and T1 level at hours 6, 12, 18 and 24 to the terminal ONLY, so Tom's reading stays blind
// (the same numbers are in dev/wtg-export.md). Licence line: nobody decompiles or probes Bentley software.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const ft = require('./wtg-feature-tests.js');
const ROOT = path.resolve(__dirname, '..', '..');

const RULES = [
	'RULE 1', 'IF TANK T1 LEVEL BELOW 14', 'AND NODE J1 PRESSURE ABOVE 30', 'THEN PUMP PU1 STATUS IS OPEN', '',
	'RULE 2', 'IF TANK T1 LEVEL ABOVE 20', 'OR NODE J1 PRESSURE ABOVE 38', 'THEN PUMP PU1 STATUS IS CLOSED', '',
	'RULE 3', 'IF TANK T1 LEVEL ABOVE 22', 'THEN PUMP PU1 STATUS IS CLOSED', 'AND PIPE 2 STATUS IS CLOSED'
].join('\n');

function compositeNet() {
	const t = ft.cyclingNet({ quality: 'Chlorine mg/L', source: true, mixing: 'MIXED', reactions: { bulk: -2, wall: -1 }, title: 'Composite rules test: chlorine set point 1.0 mg/L at J0, three rules on pump PU1' });
	return t.replace('\n[END]', '\n[RULES]\n' + RULES + '\n[END]');
}

// EPANET's PU1 status and T1 level (ft) by hour, for the network WaterGEMS holds (the pump a node between two 1 ft pipes).
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
	const tk = p.getNodeIndex('T1'), pu = p.getLinkIndex('PU1'), out = {};
	p.openH(); p.initH(0);
	for (let g = 0; g < 1000; g++) {
		const tt = p.runH();
		if (tt % 3600 === 0) { out[tt / 3600] = { pu1: p.getLinkValue(pu, 11) > 0 ? 'On' : 'Off', t1: p.getNodeValue(tk, 11) / 0.4333 }; }
		if (!(p.nextH() > 0)) { break; }
	}
	p.close();
	return out;
}

async function main(outDir) {
	const env = await ft.setup();
	const inp = compositeNet();
	const report = ft.writePair(env, inp, 'ctl-composite-test', undefined, outDir);
	return { inp: inp, report: report };
}

module.exports = { compositeNet, expected, RULES, main };

if (require.main === module) {
	(async function () {
		const args = {};
		for (let i = 2; i < process.argv.length; i += 2) { args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1]; }
		const outDir = args.out || path.join(os.homedir(), 'tom-files', '2026-11-09', 'wtg-composite-test');
		const r = await main(outDir);
		console.log('written under ' + outDir + ': integrity ' + r.report.integrity + ', foreign key violations ' + r.report.foreignKeyViolations);
		for (const rs of [[null, 'rule step 6 min (EPANET default)'], ['1:00', 'rule step 1 h']]) {
			const e = await expected(r.inp, rs[0]);
			console.log('EPANET, ' + rs[1] + ': ' + [6, 12, 18, 24].map((h) => 'hour ' + h + ' PU1 ' + e[h].pu1 + ' T1 ' + e[h].t1.toFixed(2)).join('; '));
		}
	}()).catch((e) => { console.error(e); process.exit(1); });
}
