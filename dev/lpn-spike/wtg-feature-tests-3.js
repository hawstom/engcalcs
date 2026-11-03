// WaterGEMS FEATURE TESTS, ROUND 3 (Task 749, 2026-11-03). Round 2 left three questions open (dev/wtg-export.md):
//   * the chlorine constituent: Tom's own save showed where WaterGEMS keeps it, and the page now writes a chemical run
//     that way, so file 1 is written by the plain (page) path, with no candidate;
//   * two-compartment tanks: his numbers matched neither EPANET pair. EPANET's answer at the tank depends strongly on the
//     water quality time step, and one hour reproduces his rounded numbers. So the pair asks for the time step WaterGEMS
//     shows, the tank's initial quality, and J1 at hour 12, and a third file writes a 5 minute step (candidate);
//   * age and trace, asked again briefly.
//   node dev/lpn-spike/wtg-feature-tests-3.js [--out <dir>]     default ~/tom-files/2026-11-03/wtg-feature-tests-3
// Licence line: nobody decompiles or probes Bentley software. The harness: wtg-feature-tests-3-harness.js.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const ft = require('./wtg-feature-tests.js');

const QSTEP = '0:05';   // every round 3 .inp states its water quality time step, so EPANET's answer is one answer
function withStep(inp, step) { return inp.replace(/\[TIMES\]\n/, '[TIMES]\n Quality Timestep    \t' + step + '\n'); }
const CHL = { bulk: -2, wall: -1 };

async function build(outDir) {
	const env = await ft.setup();
	const files = [], expected = {};
	const nodes = ['J0', 'J1', 'T1'], lk = ['PU1', '3'];
	function add(feature, inp, name, candidate) {
		const dir = path.join(outDir, feature);
		const report = ft.writePair(env, inp, name, candidate, dir);
		files.push({ feature: feature, name: name, candidate: candidate, report: report, dir: dir });
	}
	function inpCopy(feature, name, text) { fs.mkdirSync(path.join(outDir, feature), { recursive: true }); fs.writeFileSync(path.join(outDir, feature, name + '.inp'), text); }
	const mk = (o, step) => withStep(ft.cyclingNet(Object.assign({ quality: 'Chlorine mg/L', source: true }, o)), step || QSTEP);

	// 1. Chlorine, written the way Tom's own save stores it. No candidate.
	{
		const chl = mk({ mixing: 'MIXED', reactions: CHL, title: 'Chlorine test: set point 1.0 mg/L at J0, bulk -2 per day, wall -1 ft per day' });
		expected.chlorine = { step5min: await ft.runEpanet(chl, nodes, lk, [12, 24]), step1h: await ft.runEpanet(withStep(chl.replace(/ Quality Timestep.*\n/, ''), '1:00'), nodes, lk, [12, 24]) };
		inpCopy('1-chlorine', 'chlorine', chl);
		add('1-chlorine', chl, 'chlorine', undefined);
	}
	// 2. Two compartment, percents, 20/80 and 80/20, and the 20/80 again with a 5 minute water quality time step written.
	{
		const a = mk({ mixing: '2COMP 0.2', title: 'Two compartment test: set point 1.0 mg/L at J0, T1 two compartment 0.2' });
		const b = mk({ mixing: '2COMP 0.8', title: 'Two compartment test: set point 1.0 mg/L at J0, T1 two compartment 0.8' });
		const m = mk({ mixing: 'MIXED' });
		const h = (x) => withStep(x.replace(/ Quality Timestep.*\n/, ''), '1:00');
		expected.twoComp = {
			step5min: { frac02: await ft.runEpanet(a, nodes, lk, [12, 24]), frac08: await ft.runEpanet(b, nodes, lk, [12, 24]), mixed: await ft.runEpanet(m, nodes, lk, [12, 24]) },
			step1h: { frac02: await ft.runEpanet(h(a), nodes, lk, [12, 24]), frac08: await ft.runEpanet(h(b), nodes, lk, [12, 24]), mixed: await ft.runEpanet(h(m), nodes, lk, [12, 24]) },
			tom: { 'c1-20-c2-80': { T1_12: 0.5, T1_24: 0.7 }, 'c1-80-c2-20': { T1_12: 0.4, T1_24: 0.6 } }
		};
		inpCopy('2-two-compartment', 'twocomp-0.2', a);
		inpCopy('2-two-compartment', 'twocomp-0.8', b);
		const two = { mixCode: 0, mixFraction: 'percent', wq: {} };
		add('2-two-compartment', a, 'twocomp-c1-20-c2-80', two);
		add('2-two-compartment', b, 'twocomp-c1-80-c2-20', two);
		add('2-two-compartment', a, 'twocomp-c1-20-c2-80-wq5min', { mixCode: 0, mixFraction: 'percent', wq: { qualityStepSeconds: 300 } });
	}
	// 3. Age and trace.
	{
		const age = withStep(ft.cyclingNet({ quality: 'Age', title: 'Age test' }), QSTEP);
		expected.age = await ft.runEpanet(age, nodes, ['PU1'], [12, 24]);
		inpCopy('3-age-and-trace', 'age', age);
		add('3-age-and-trace', age, 'age', { wq: {} });
		const trace = withStep(ft.cyclingNet({ quality: 'Trace R', title: 'Trace test: percent of water from reservoir R' }), QSTEP);
		expected.trace = await ft.runEpanet(trace, nodes, ['PU1'], [12, 24]);
		inpCopy('3-age-and-trace', 'trace', trace);
		add('3-age-and-trace', trace, 'trace', { wq: {} });
	}
	return { files: files, expected: expected, env: env };
}

function readme(x) {
	const L = [];
	const p = (t) => { L.push(t, ''); };
	const f1 = (v) => Number(v).toFixed(1), f2 = (v) => Number(v).toFixed(2), f3 = (v) => Number(v).toFixed(3);
	const q = (e, h, n) => f3(e[h].node[n].quality);
	const tc = x.twoComp, c5 = x.chlorine.step5min, c1 = x.chlorine.step1h, ag = x.age, tr = x.trace;
	L.push('# WaterGEMS feature tests, round 3', '');
	p('Written 2026-11-03 (Arizona time). Thank you for the chlorine save and the two compartment numbers. Six files, in three folders.');
	L.push('## Single most useful step', '');
	p('Open `twocomp-c1-20-c2-80`, open the Calculation Options, and write down the water quality time step it shows (and its units, if any). Then double-click `T1` and write down the initial concentration of chlorine at `T1`. Those two numbers decide most of what is still open.');
	p('Why: your two compartment numbers (0.5 and 0.7, then 0.4 and 0.6) are within about a tenth of what EPANET gets when its water quality step is one hour (see below), and far from what it gets with a 5 minute step. If WaterGEMS shows a one hour step, that is most of the difference and the tank codes are probably fine.');
	p('Each file is a pair, a `.wtg` and a `.wtg.sqlite` with the same name; keep the two side by side, and copy the whole folder to a plain local disk folder before opening. Every file is a tiny project in US units (gpm, feet, inches, psi), Base scenario only, 24 hours at a 1 hour step. The same network is beside each folder\'s files as an EPANET `.inp`; every `.inp` states a 5 minute water quality step. To compute, press Compute on the Home tab, set the time to the hour named below, and read the value in the element\'s properties or a Flex Table. The Calculation Type is already set to the right run; if it is not, tell me.');

	L.push('## 1-chlorine (1 file)', '');
	p('The network: reservoir `R`, pump `PU1`, junctions `J0` and `J1`, tank `T1` (completely mixed). A set point booster of 1.0 mg/L at `J0`, a bulk reaction of -2 per day and a wall reaction of -1 ft per day for the whole network. This file is written the way your own save stores the chlorine, per day with the minus signs.');
	p('Steps: open `chlorine`, check the chlorine constituent shows -2 and -1 and `J0` reads Setpoint Booster 1.0, Compute, and read the chlorine at `J1` and `T1` at hours 12 and 24.');
	p('EPANET gets, with a 5 minute water quality step: hour 12 `J1` ' + q(c5, 12, 'J1') + ', `T1` ' + q(c5, 12, 'T1') + '; hour 24 `J1` ' + q(c5, 24, 'J1') + ', `T1` ' + q(c5, 24, 'T1') + ' mg/L. With a 1 hour step `J1` is the same (' + q(c1, 12, 'J1') + ', ' + q(c1, 24, 'J1') + ') and `T1` is ' + q(c1, 12, 'T1') + ' and ' + q(c1, 24, 'T1') + '. With no reactions `J1` would read 1.000.');
	p('What it means: `J1` near 0.96 means the rates are read, with the right sign and units. `J1` of 1.00 means they were not read; send what the constituent dialog shows. `T1` depends on the water quality time step, so read it with the first file of the next folder in mind.');

	L.push('## 2-two-compartment (3 files)', '');
	p('The same network with `T1` set to two compartment, set point booster 1.0 mg/L at `J0`, no reactions. `twocomp-c1-20-c2-80` has compartment 1 at 20 and compartment 2 at 80; `twocomp-c1-80-c2-20` the other way round; `twocomp-c1-20-c2-80-wq5min` is the first one with a 5 minute water quality time step written into the Calculation Options.');
	p('Steps for each file: double-click `T1` and write down the Mixing Model, the two compartment numbers and the initial concentration. Compute, and read the chlorine at `J1` at hour 12 and at `T1` at hours 12 and 24. For `twocomp-c1-20-c2-80-wq5min` also write down what the water quality time step shows (we wrote 300 seconds; if it shows something else, that tells us the unit).');
	const a5 = tc.step5min, a1 = tc.step1h;
	p('EPANET gets at `T1` with a 5 minute step: 20 percent compartment ' + q(a5.frac02, 12, 'T1') + ' at hour 12 and ' + q(a5.frac02, 24, 'T1') + ' at hour 24; 80 percent ' + q(a5.frac08, 12, 'T1') + ' and ' + q(a5.frac08, 24, 'T1') + '. With a 1 hour step: 20 percent ' + q(a1.frac02, 12, 'T1') + ' and ' + q(a1.frac02, 24, 'T1') + '; 80 percent ' + q(a1.frac08, 12, 'T1') + ' and ' + q(a1.frac08, 24, 'T1') + '. `J1` at hour 12 is ' + q(a5.frac02, 12, 'J1') + ' either way. Last time you read 0.5 and 0.7 (20 percent) and 0.4 and 0.6 (80 percent).');
	p('What it means: if `twocomp-c1-20-c2-80` and `twocomp-c1-80-c2-20` read within a tenth of the one hour numbers, WaterGEMS is stepping the water quality once an hour, and the 20 percent tank reading higher than the 80 percent tank is just EPANET\'s behavior, so the codes stand. If `twocomp-c1-20-c2-80-wq5min` then reads ' + q(a5.frac02, 12, 'T1') + ' and ' + q(a5.frac02, 24, 'T1') + ', the step is what we guessed and we will write it. If the initial concentration at `T1` is not 0, that alone changes the numbers, so send it. If `J1` at hour 12 is not 1.00, tell me.');

	L.push('## 3-age-and-trace (2 files)', '');
	p('The same network without a chemical. `age` is an age run: with a 5 minute step EPANET gets ' + f2(ag[24].node.J1.quality) + ' hours at `J1` and ' + f2(ag[24].node.T1.quality) + ' hours at `T1` at hour 24 (' + f2(ag[12].node.T1.quality) + ' at `T1` at hour 12). `trace` follows the water from reservoir `R`: EPANET gets ' + f1(tr[24].node.J1.quality) + ' percent at `J1` and ' + f1(tr[24].node.T1.quality) + ' percent at `T1` at hour 24 (' + f1(tr[12].node.T1.quality) + ' at hour 12).');
	p('Steps: open each, check the Calculation Type reads Age or Trace (for `trace`, that the trace node is `R`), compute, and compare. These two do not need to be done if time is short.');

	p('If a file will not open: the exact message and the file name is all I need. If it opens but the numbers differ: send the number you saw and the file name.');
	return L.join('\n');
}

module.exports = { build, readme };

if (require.main === module) {
	(async function () {
		const args = {};
		for (let i = 2; i < process.argv.length; i += 2) { args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1]; }
		const outDir = args.out || path.join(os.homedir(), 'tom-files', '2026-11-03', 'wtg-feature-tests-3');
		const r = await build(outDir);
		fs.writeFileSync(path.join(outDir, 'expected.json'), JSON.stringify(r.expected, null, 1));
		fs.writeFileSync(path.join(outDir, 'README.md'), readme(r.expected) + '\n');
		console.log(r.files.length + ' files under ' + outDir);
		r.files.forEach((f) => { console.log(' ', f.feature + '/' + f.name, 'integrity', f.report.integrity, 'fk', f.report.foreignKeyViolations); });
	}()).catch((e) => { console.error(e); process.exit(1); });
}
