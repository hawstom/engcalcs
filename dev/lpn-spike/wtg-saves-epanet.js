// Tom's ten WaterGEMS saves of 2026-11-03 (Task 749, branch feat/wtg-saves): the EPANET side of each comparison.
// Every figure is for the network WaterGEMS holds (a pump is a node between two 1 ft pipes 99 in across, see
// dev/wtg-export.md) and from a converged quality run (the quality step loop of wtg-feature-tests.js, fixed 2026-11-03).
//   node dev/lpn-spike/wtg-saves-epanet.js        prints one line per item
// Licence line: nobody decompiles or probes Bentley software; Tom's numbers are what his WaterGEMS showed him.
'use strict';
const ft = require('./wtg-feature-tests.js');

function withStep(inp, step) { return inp.replace(/ Quality Timestep.*\n/, '').replace(/\[TIMES\]\n/, '[TIMES]\n Quality Timestep    \t' + step + '\n'); }
function withPumpPipes(t) {
	t = t.replace(/(\[JUNCTIONS\]\n[^\n]*\n)/, '$1 PUa             \t20          \t0           \t\n PUb             \t20          \t0           \t\n');
	t = t.replace(/ PU1\s+R\s+J0\s+HEAD 1(\s+PATTERN \w+)?\s*;/, ' PU1             \tPUa             \tPUb             \tHEAD 1$1');
	t = t.replace(/(\[PIPES\]\n[^\n]*\n)/, '$1 PU1-A           \tR               \tPUa             \t1           \t99          \t130         \t0           \tOpen\n PU1-B           \tPUb             \tJ0              \t1           \t99          \t130         \t0           \tOpen\n');
	return t.replace(/(\[COORDINATES\]\n[^\n]*\n)/, '$1 PUa             \t0.50            \t1.00\n PUb             \t1.50            \t1.00\n');
}
// The chlorine network of Tom's `chlorine` save: set point 1.0 mg/L at J0, bulk -2 per day, wall -1 ft per day, T1 mixed.
const CHL = { bulk: -2, wall: -1 };
function chlorineNet(extra) {
	let t = ft.cyclingNet({ quality: 'Chlorine mg/L', source: true, mixing: 'MIXED', reactions: CHL, title: 'Tom chlorine save' });
	return extra ? extra(t) : t;
}
function addSection(t, name, body) { return t.replace('\n[END]', '\n[' + name + ']\n' + body + '\n[END]'); }
const NODES = ['J0', 'J1', 'T1'], LINKS = ['PU1'];
async function run(inp, step, hours) { return ft.runEpanet(withStep(withPumpPipes(inp), step || '0:06'), NODES, LINKS, hours || [6, 7, 12, 14, 24]); }

// name -> the .inp changes for each of Tom's saves
const CASES = {
	'ctl-pump-level': (t) => addSection(t, 'CONTROLS', ' LINK PU1 CLOSED IF NODE T1 ABOVE 20\n LINK PU1 OPEN IF NODE T1 BELOW 14'),
	'ctl-logical': (t) => addSection(t, 'RULES', 'RULE 1\nIF TANK T1 LEVEL BELOW 14\nTHEN PUMP PU1 STATUS IS OPEN\nELSE PUMP PU1 STATUS IS CLOSED\nPRIORITY 3'),
	'ctl-pressure-time': (t) => addSection(t, 'CONTROLS', ' LINK PU1 CLOSED IF NODE J1 ABOVE 60\n LINK PU1 OPEN AT TIME 6'),
	'pdd-on': (t) => t.replace('[OPTIONS]\n', '[OPTIONS]\n Demand Model       \tPDA\n Minimum Pressure   \t0\n Required Pressure  \t40\n Pressure Exponent  \t0.5\n'),
	'rates-one-pipe': (t) => addSection(t, 'REACTIONS_PIPE_PLACEHOLDER', ''),
	'rate-tank': (t) => t.replace('[REACTIONS]\n', '[REACTIONS]\n Tank T1           \t-30\n'),
	'source-pattern': (t) => {
		t = t.replace(/ J0\s+SETPOINT\s+1\.0\n/, ' J0              \tSETPOINT    \t1.0         \tSP\n');
		const v = [];
		for (let h = 0; h < 24; h++) { v.push(h < 12 ? 1.0 : 0.5); }
		let rows = '';
		for (let i = 0; i < 24; i += 6) { rows += ' SP              \t' + v.slice(i, i + 6).map((x) => x.toFixed(2)).join('\t') + '\n'; }
		return t.replace('\n[CURVES]', '\n' + rows + '\n[CURVES]');
	}
};
CASES['rates-one-pipe'] = (t) => t.replace('[REACTIONS]\n', '[REACTIONS]\n Bulk 2             \t-10\n Wall 2             \t-5\n');
CASES.base = (t) => t;

async function figures() {
	const out = {};
	for (const k of Object.keys(CASES)) {
		const inp = CASES[k](chlorineNet());
		out[k] = { step6min: await run(inp, '0:06'), step1h: await run(inp, '1:00') };
	}
	return out;
}
module.exports = { figures, CASES, chlorineNet, withPumpPipes, withStep, run };
if (require.main === module) {
	figures().then((f) => {
		const q = (r, h, n) => r[h].node[n].quality.toFixed(3), hd = (r, h, n) => r[h].node[n].head.toFixed(2);
		Object.keys(f).forEach((k) => {
			const r = f[k].step6min, s = f[k].step1h;
			console.log(k.padEnd(18), 'J1 Cl h6/12/14', q(r, 6, 'J1'), q(r, 12, 'J1'), q(r, 14, 'J1'), '| T1 Cl h12/24', q(r, 12, 'T1'), q(r, 24, 'T1'),
				'| T1 HGL h12/24', hd(r, 12, 'T1'), hd(r, 24, 'T1'), '| J1 dem h12', r[12].node.J1.demand.toFixed(1), 'p', r[12].node.J1.pressure.toFixed(1), '| PU1 flow h7/12', r[7].link.PU1.flow.toFixed(1), r[12].link.PU1.flow.toFixed(1),
				'|| 1h step J1 12/14', q(s, 12, 'J1'), q(s, 14, 'J1'), 'T1', q(s, 24, 'T1'));
		});
	}).catch((e) => { console.error(e); process.exit(1); });
}
