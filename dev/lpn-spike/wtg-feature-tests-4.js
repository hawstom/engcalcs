// WaterGEMS FEATURE TESTS, ROUND 4 (Task 749, 2026-11-03). Round 3 settled: the two-compartment codes, the age and trace
// calculation types, the water quality time step field (read as 0.083 hr from 300 s), and that the chlorine reactions are
// applied (T1 read 0.2 where no reactions would give 0.4). What is open is why WaterGEMS's tank numbers sit a little off
// EPANET's at a 1 hour step, and why a stored 5 minute step did not move them.
//   * Every EPANET number here is for the network WaterGEMS holds: a pump is a node between two 1 ft pipes 99 in across,
//     and that water takes time to cross (it explains WaterGEMS's J1 age of 0.173 h exactly; EPANET's own pump has none).
//   * Every EPANET number is at the water quality step WaterGEMS shows: 1 hour.
//   node dev/lpn-spike/wtg-feature-tests-4.js [--out <dir>]     default ~/tom-files/<today>/wtg-feature-tests-4
// Licence line: nobody decompiles or probes Bentley software. The harness: wtg-feature-tests-harness.js, Round 4.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const ft = require('./wtg-feature-tests.js');

function withStep(inp, step) { return inp.replace(/ Quality Timestep.*\n/, '').replace(/\[TIMES\]\n/, '[TIMES]\n Quality Timestep    \t' + step + '\n'); }
// The pump as WaterGEMS holds it: R, a 1 ft pipe 99 in across, the pump, another such pipe, J0.
function withPumpPipes(t) {
	t = t.replace(/(\[JUNCTIONS\]\n[^\n]*\n)/, '$1 PUa             \t20          \t0           \t\n PUb             \t20          \t0           \t\n');
	t = t.replace(/ PU1\s+R\s+J0\s+HEAD 1\s*;/, ' PU1             \tPUa             \tPUb             \tHEAD 1');
	t = t.replace(/(\[PIPES\]\n[^\n]*\n)/, '$1 PU1-A           \tR               \tPUa             \t1           \t99          \t130         \t0           \tOpen\n PU1-B           \tPUb             \tJ0              \t1           \t99          \t130         \t0           \tOpen\n');
	return t.replace(/(\[COORDINATES\]\n[^\n]*\n)/, '$1 PUa             \t0.50            \t1.00\n PUb             \t1.50            \t1.00\n');
}
const CHL = { bulk: -2, wall: -1 };
const NODES = ['J0', 'J1', 'T1'], LINKS = ['PU1'];

async function build(outDir) {
	const env = await ft.setup();
	const files = [], expected = {};
	function add(feature, inp, name, candidate) {
		const dir = path.join(outDir, feature);
		const report = ft.writePair(env, inp, name, candidate, dir);
		files.push({ feature: feature, name: name, candidate: candidate, report: report, dir: dir });
	}
	function inpCopy(feature, name, text) { fs.mkdirSync(path.join(outDir, feature), { recursive: true }); fs.writeFileSync(path.join(outDir, feature, name + '.inp'), text); }
	const mk = (o) => ft.cyclingNet(Object.assign({ quality: 'Chlorine mg/L', source: true }, o));
	const run = (inp, step) => ft.runEpanet(withStep(withPumpPipes(inp), step), NODES, LINKS, [12, 24]);

	// 1. Two compartment, 20/80, no candidate: the page's own path now writes it.
	const a = mk({ mixing: '2COMP 0.2', title: 'Two compartment test: set point 1.0 mg/L at J0, T1 two compartment 0.2' });
	expected.twoComp = {
		step1h: await run(a, '1:00'), step30min: await run(a, '0:30'), step5min: await run(a, '0:05'),
		tom1h: { T1_12: 0.49, T1_24: 0.65 }, tom5min: { T1_12: 0.49, T1_24: 0.65 }
	};
	inpCopy('1-quality-step', 'twocomp-c1-20-c2-80', withStep(withPumpPipes(a), '1:00'));
	add('1-quality-step', a, 'twocomp-c1-20-c2-80', undefined);
	// 2. Age and trace.
	const age = ft.cyclingNet({ quality: 'Age', title: 'Age test' });
	const trace = ft.cyclingNet({ quality: 'Trace R', title: 'Trace test: percent of water from reservoir R' });
	expected.age = await run(age, '1:00'); expected.trace = await run(trace, '1:00');
	expected.tomAge = { J1_24: 0.173, T1_24: 17.96 }; expected.tomTrace = { J1_24: 100, T1_24: 57.5 };
	inpCopy('2-age-and-trace', 'age', withStep(withPumpPipes(age), '1:00'));
	inpCopy('2-age-and-trace', 'trace', withStep(withPumpPipes(trace), '1:00'));
	add('2-age-and-trace', age, 'age', undefined);
	add('2-age-and-trace', trace, 'trace', undefined);
	// 3. Chlorine, the same file as round 3, read to three decimals.
	const chl = mk({ mixing: 'MIXED', reactions: CHL, title: 'Chlorine test: set point 1.0 mg/L at J0, bulk -2 per day, wall -1 ft per day' });
	expected.chlorine = await run(chl, '1:00');
	expected.chlorineNoReactions = await run(mk({ mixing: 'MIXED', reactions: { bulk: 0, wall: 0 } }), '1:00');
	expected.chlorineBulkOnly = await run(mk({ mixing: 'MIXED', reactions: { bulk: -2, wall: 0 } }), '1:00');
	inpCopy('3-chlorine', 'chlorine', withStep(withPumpPipes(chl), '1:00'));
	add('3-chlorine', chl, 'chlorine', undefined);
	return { files: files, expected: expected, env: env };
}

function readme(x) {
	const L = [];
	const p = (t) => { L.push(t, ''); };
	const f1 = (v) => Number(v).toFixed(1), f2 = (v) => Number(v).toFixed(2), f3 = (v) => Number(v).toFixed(3);
	const q = (e, h, n) => f3(e[h].node[n].quality), hd = (e, h) => f1(e[h].node.T1.head), fl = (e, h) => f1(e[h].link.PU1.flow);
	const tc = x.twoComp, ch = x.chlorine, nr = x.chlorineNoReactions, bo = x.chlorineBulkOnly, ag = x.age, tr = x.trace;
	L.push('# WaterGEMS feature tests, round 4', '');
	p('Written 2026-11-03 (Arizona time). Thank you for round 3. It settled a lot, and the three small questions left are below. Four files in three folders, all tiny projects in US units (gpm, feet, inches, psi), Base scenario only, 24 hours at a 1 hour step. Each file is a pair, a `.wtg` and a `.wtg.sqlite` with the same name; keep the two side by side and copy the folder to a plain local disk folder before opening.');
	L.push('## Single most useful step', '');
	p('Open `twocomp-c1-20-c2-80` (folder 1). In the Calculation Options, change the water quality time step to 30 minutes (0.5 hours) yourself, by typing it. Compute. Read the chlorine at `T1` at hour 12 and hour 24. Then save the project under the new name `tom-wq30min` and send me both files.');
	p('Why: last time the file that stored a 5 minute step showed 0.083 hours in the dialog, but the answers did not move from the 1 hour answers. EPANET moves a lot when the step changes. With the pump counted as WaterGEMS holds it, EPANET gets at `T1` for the 20 percent compartment: with a 1 hour step ' + q(tc.step1h, 12, 'T1') + ' at hour 12 and ' + q(tc.step1h, 24, 'T1') + ' at hour 24; with a 30 minute step ' + q(tc.step30min, 12, 'T1') + ' and ' + q(tc.step30min, 24, 'T1') + '; with a 5 minute step ' + q(tc.step5min, 12, 'T1') + ' and ' + q(tc.step5min, 24, 'T1') + '. You read ' + tc.tom1h.T1_12 + ' and ' + tc.tom1h.T1_24 + ' at 1 hour, and the same again with the 5 minute file.');
	p('What it means: if `T1` now reads about ' + q(tc.step30min, 12, 'T1') + ' and ' + q(tc.step30min, 24, 'T1') + ', WaterGEMS does use a step you type, and something in our stored step is missing; your saved file will show me what. If `T1` still reads about 0.5 and 0.65, WaterGEMS runs its own water quality step whatever the dialog says, nothing in our file is wrong, and we stop working on the step. Either answer closes the question.');

	L.push('## 1-quality-step (1 file)', '');
	p('`twocomp-c1-20-c2-80`: the network is reservoir `R`, pump `PU1`, junctions `J0` and `J1`, tank `T1` set to two compartment, 20 and 80 percent, a set point booster of 1.0 mg/L at `J0`, no reactions. The steps are the single most useful step above. Please check that the Calculation Type reads Constituent and the Mixing Model of `T1` reads two compartment with 20 and 80.');

	L.push('## 2-age-and-trace (2 files)', '');
	p('The same network without a chemical: `age` is an age run, `trace` follows the water from reservoir `R`. Round 3 showed the Calculation Type came out right in both. What is left is a small gap in the tank numbers, and I want to know whether it is the water or the flow that differs.');
	p('Steps for each file: Compute. At hour 12 and hour 24 read, in the properties or a Flex Table, the hydraulic grade (head) of `T1` in feet and the flow of pump `PU1` in gpm, and the age (or trace percent) at `J1` and `T1`.');
	p('EPANET gets, with a 1 hour water quality step and the pump counted as WaterGEMS holds it (a node between two 1 foot pipes): hydraulic grade of `T1` ' + hd(ag, 12) + ' ft at hour 12 and ' + hd(ag, 24) + ' ft at hour 24; flow of `PU1` ' + fl(ag, 12) + ' gpm and ' + fl(ag, 24) + ' gpm. For `age` at hour 24: `J1` ' + f3(ag[24].node.J1.quality) + ' hours and `T1` ' + f2(ag[24].node.T1.quality) + ' hours (you read 0.173 and 17.96). For `trace` at hour 24: `J1` ' + f1(tr[24].node.J1.quality) + ' percent and `T1` ' + f1(tr[24].node.T1.quality) + ' percent (you read 100 and 57.5).');
	p('What it means: `J1` age matched to three digits, so the pump is built right. If the hydraulic grade of `T1` and the pump flow agree with the numbers above to within a foot and a few gpm, the water is the same and the remaining gap (17.96 against ' + f2(ag[24].node.T1.quality) + ' hours) is the way WaterGEMS stirs the tank, which is its engine and not our file. If they differ by more, the tank is filling differently and I will look at the pump curve, the tank levels and the demand pattern we wrote, one at a time.');

	L.push('## 3-chlorine (1 file)', '');
	p('The same chlorine file as round 3 (set point booster of 1.0 mg/L at `J0`, bulk -2 per day and wall -1 ft per day for the whole network, `T1` completely mixed). Your round 3 readings were already informative: with no reactions `T1` would read about ' + f1(nr[12].node.T1.quality) + ' and ' + f1(nr[24].node.T1.quality) + ' and you read 0.2 and 0.2, so the rates are read. `J1` showed 1.0 only because one decimal rounds 0.96 up.');
	p('Steps: open `chlorine`, set the chlorine display to three decimals (Flex Table, then the column\'s number format), Compute, and read `J1` and `T1` at hours 12 and 24.');
	p('EPANET gets, with a 1 hour step: hour 12 `J1` ' + q(ch, 12, 'J1') + ', `T1` ' + q(ch, 12, 'T1') + '; hour 24 `J1` ' + q(ch, 24, 'J1') + ', `T1` ' + q(ch, 24, 'T1') + ' mg/L. With the bulk rate only (no wall reaction) `J1` would be ' + q(bo, 12, 'J1') + ' and with no reactions 1.000.');
	p('What it means: `J1` near ' + q(ch, 12, 'J1') + ' means the wall rate is read as well as the bulk rate. `J1` near ' + q(bo, 12, 'J1') + ' would mean only the bulk rate is, and I will write the wall rate differently. `J1` of 1.000 would contradict `T1`, so send it as it is.');
	p('If a file will not open: the exact message and the file name is all I need. If it opens but the numbers differ: send the number you saw and the file name.');
	return L.join('\n');
}

module.exports = { build, readme, withPumpPipes, withStep };

if (require.main === module) {
	(async function () {
		const args = {};
		for (let i = 2; i < process.argv.length; i += 2) { args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1]; }
		const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Phoenix' });
		const outDir = args.out || path.join(os.homedir(), 'tom-files', today, 'wtg-feature-tests-4');
		const r = await build(outDir);
		fs.writeFileSync(path.join(outDir, 'expected.json'), JSON.stringify(r.expected, null, 1));
		fs.writeFileSync(path.join(outDir, 'README.md'), readme(r.expected) + '\n');
		console.log(r.files.length + ' files under ' + outDir);
		r.files.forEach((f) => { console.log(' ', f.feature + '/' + f.name, 'integrity', f.report.integrity, 'fk', f.report.foreignKeyViolations); });
	}()).catch((e) => { console.error(e); process.exit(1); });
}
