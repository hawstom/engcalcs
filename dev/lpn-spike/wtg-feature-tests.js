// WaterGEMS FEATURE TESTS (Task 749). Round 1 (2026-11-02) offered guesses; Tom's results of 2026-11-03 confirmed the
// emitter unit, the pump speed type and the mixing codes (dev/wtg-export.md), which the writer now writes without
// `opts.candidate`. This script keeps the shared helpers (networks, EPANET runs, the pair writer) and builds ROUND 2,
// what is still open: two-compartment mixing, chlorine reactions and the source type, age and trace.
//
//   node dev/lpn-spike/wtg-feature-tests.js [--out <dir>]        default ~/tom-files/2026-11-03/wtg-feature-tests-2
//
// Licence line: nobody decompiles or probes Bentley software; Tom's WaterGEMS is used only as an ordinary user would
// (does a file we wrote open, with the same results as EPANET?). The harness: dev/lpn-spike/wtg-feature-tests-harness.js.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const zlib = require('zlib');
const ROOT = path.resolve(__dirname, '..', '..');
// ---------------------------------------------------------------------------------------------
// The networks. All are US customary, gpm, Hazen-Williams, 24 h at a 1 h step, with coordinates.
// ---------------------------------------------------------------------------------------------
const TINY = fs.readFileSync(path.join(__dirname, 'reference', 'wtg-export-tiny.inp'), 'utf8');

// The tiny network (reservoir R, pump PU1, junctions J0 and J1, tank T1) made to cycle: J1 draws 300 gpm on pattern P1,
// and the tank sits where it fills at the troughs and drains at the peaks, so that its water is a mix of ages.
function cyclingNet(opt) {
	opt = opt || {};
	let t = TINY.replace(/\[TITLE\][\s\S]*?\n\n/, '[TITLE]\n' + (opt.title || 'Test network') + '\n\n');
	t = t.replace(/ J1\s+50\s+100\s+P1/, ' J1              \t50          \t300         \tP1');
	t = t.replace(/ T1\s+80\s+10\s+2\s+20\s+30/, ' T1              \t120         \t12          \t2           \t25          \t30');
	if (opt.pumpPattern) {
		t = t.replace(' PU1             \tR               \tJ0              \tHEAD 1\t;', ' PU1             \tR               \tJ0              \tHEAD 1 PATTERN SP\t;');
		const v = [];
		for (let h = 0; h < 24; h++) { v.push(h < 6 ? 1.0 : h < 12 ? 0.9 : h < 18 ? 0.95 : 1.0); }
		let rows = '';
		for (let i = 0; i < 24; i += 6) { rows += ' SP              \t' + v.slice(i, i + 6).map((x) => x.toFixed(2)).join('\t') + '\n'; }
		t = t.replace('\n[CURVES]', '\n' + rows + '\n[CURVES]');
	}
	if (opt.quality) {
		t = t.replace('[OPTIONS]\n', '[OPTIONS]\n Quality            \t' + opt.quality + '\n Tolerance          \t0.01\n');
		const sections = [];
		if (opt.source) { sections.push('[SOURCES]\n;Node            \tType        \tQuality     \tPattern\n J0              \tSETPOINT    \t1.0\n'); }
		if (opt.mixing) { sections.push('[MIXING]\n;Tank            \tModel\n T1              \t' + opt.mixing + '\n'); }
		if (opt.reactions) { sections.push('[REACTIONS]\n Order Bulk         \t1\n Order Wall         \t1\n Global Bulk        \t' + opt.reactions.bulk + '\n Global Wall        \t' + opt.reactions.wall + '\n'); }
		t = t.replace('\n[END]', '\n' + sections.join('\n') + '\n[END]');
	}
	return t;
}

// Emitters: a reservoir on high ground feeds J1 and J3, which draw nothing but their emitters, and J2, which draws 100 gpm.
const EMITTER_NET = [
	'[TITLE]', 'Emitter test: J1 has k 0.01 and J3 has k 1.0 (gpm per psi^0.5), no other demand on them.', '',
	'[JUNCTIONS]', ';ID              \tElev        \tDemand      \tPattern',
	' J1              \t50          \t0           \t', ' J2              \t50          \t100         \t', ' J3              \t50          \t0           \t', '',
	'[RESERVOIRS]', ';ID              \tHead        \tPattern', ' R               \t250         \t', '',
	'[PIPES]', ';ID              \tNode1           \tNode2           \tLength      \tDiameter    \tRoughness   \tMinorLoss   \tStatus',
	' 1               \tR               \tJ1              \t1000        \t8           \t120         \t0           \tOpen',
	' 2               \tJ1              \tJ2              \t1000        \t8           \t120         \t0           \tOpen',
	' 3               \tJ1              \tJ3              \t1000        \t8           \t120         \t0           \tOpen', '',
	'[EMITTERS]', ';Junction        \tCoefficient', ' J1              \t0.01', ' J3              \t1.0', '',
	'[TIMES]', ' Duration           \t24:00', ' Hydraulic Timestep \t1:00', ' Pattern Timestep   \t1:00', ' Report Timestep    \t1:00', ' Start ClockTime    \t12 am', '',
	'[OPTIONS]', ' Units              \tGPM', ' Headloss           \tH-W', ' Accuracy           \t0.00001', ' Emitter Exponent    \t0.5', '',
	'[COORDINATES]', ';Node            \tX-Coord         \tY-Coord', ' J1              \t1.00            \t1.00', ' J2              \t2.00            \t1.00',
	' J3              \t1.00            \t0.00', ' R               \t0.00            \t1.00', '', '[END]', ''
].join('\n');

// ---------------------------------------------------------------------------------------------
// EPANET: the numbers Tom should see. Hours are whole hours; quality is stepped with the hydraulics.
// ---------------------------------------------------------------------------------------------
let epanetMod = null;
async function runEpanet(inpText, nodes, links, hours) {
	if (!epanetMod) { epanetMod = await import('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js')); }
	const ws = new epanetMod.Workspace();
	await ws.loadModule();
	const p = new epanetMod.Project(ws);
	ws.writeFile('r.inp', inpText);
	p.open('r.inp', 'r.rpt', 'r.out');
	const EN_DEMAND = 9, EN_HEAD = 10, EN_PRESSURE = 11, EN_QUALITY = 12, EN_FLOW = 8;
	const ni = {}, li = {}, out = {};
	nodes.forEach((n) => { ni[n] = p.getNodeIndex(n); });
	links.forEach((l) => { li[l] = p.getLinkIndex(l); });
	try {
		p.openH(); p.initH(0); p.openQ(); p.initQ(0);
		for (let guard = 0; guard < 100000; guard++) {
			const t = p.runH();
			p.runQ();
			if (t % 3600 === 0 && hours.indexOf(t / 3600) >= 0) {
				const row = { node: {}, link: {} };
				nodes.forEach((n) => { row.node[n] = { demand: p.getNodeValue(ni[n], EN_DEMAND), head: p.getNodeValue(ni[n], EN_HEAD), pressure: p.getNodeValue(ni[n], EN_PRESSURE), quality: p.getNodeValue(ni[n], EN_QUALITY) }; });
				links.forEach((l) => { row.link[l] = { flow: p.getLinkValue(li[l], EN_FLOW) }; });
				out[t / 3600] = row;
			}
			const ts = p.nextH();
			// stepQ advances ONE quality step; loop until the hydraulic interval is covered (a step shorter than the hydraulic one needs many).
			for (let g2 = 0; g2 < 100000; g2++) { if (!(p.stepQ() > 0)) { break; } }
			if (!(ts > 0)) { break; }
		}
		p.closeH(); p.closeQ();
	} finally { try { p.close(); } catch (e) { /* closed */ } }
	return out;
}

// ---------------------------------------------------------------------------------------------
// Writing a candidate pair
// ---------------------------------------------------------------------------------------------
async function setup() {
	require('./bootstrap.js');
	const helper = require('./wtg-sqljs.js');
	const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js')); global.EngCalcs = EngCalcs;
	require(path.join(ROOT, 'js', 'lpn-patterns.js')); require(path.join(ROOT, 'js', 'lpn-inp.js')); Object.assign(EngCalcs, require(path.join(ROOT, 'js', 'lpn-rules.js')));
	require(path.join(ROOT, 'js', 'lpn-wtg-export.js'));
	const initSqlJs = require(helper.sqlJsPath());
	const SQL = await initSqlJs({ wasmBinary: fs.readFileSync(helper.wasmPath()) });
	const tplDir = path.join(ROOT, 'js', 'data', 'wtg-template');
	return {
		EngCalcs: EngCalcs, SQL: SQL, lib: EngCalcs.lpnWtgExportInternals,
		tplSqlite: zlib.gunzipSync(fs.readFileSync(path.join(tplDir, 'wtg-template.wtg.sqlite.gz'))),
		tplWtg: zlib.gunzipSync(fs.readFileSync(path.join(tplDir, 'wtg-template.wtg.gz'))).toString('utf8')
	};
}

function writePair(env, inpText, name, candidate, dir) {
	const parsed = env.EngCalcs.lpnInpParse(inpText);
	const out = env.lib.writeWtg(env.SQL, env.tplSqlite, parsed, { initial: {}, changes: [] }, { name: name, efficiency: 75, candidate: candidate });
	fs.mkdirSync(dir, { recursive: true });
	fs.writeFileSync(path.join(dir, name + '.wtg.sqlite'), out.bytes);
	fs.writeFileSync(path.join(dir, name + '.wtg'), env.lib.patchWtgXml(env.tplWtg, out.report.removedChildScenarios, 1, out.report.removedChildAlternatives, out.report.extentFt));
	return out.report;
}

const f1 = (v) => Number(v).toFixed(1), f2 = (v) => Number(v).toFixed(2), f3 = (v) => Number(v).toFixed(3);


// ---------------------------------------------------------------------------------------------
// ROUND 2: only what is still open. Calculation type, source codes and mixing codes are the confirmed ones.
// ---------------------------------------------------------------------------------------------
const CHLORINE_REACTIONS = { bulk: -2, wall: -1 };

async function build(outDir) {
	const env = await setup();
	const files = [], expected = {};
	function add(feature, inp, name, candidate) {
		const dir = path.join(outDir, feature);
		const report = writePair(env, inp, name, candidate, dir);
		files.push({ feature: feature, name: name, candidate: candidate, report: report, dir: dir });
	}
	function inpCopy(feature, name, text) { fs.mkdirSync(path.join(outDir, feature), { recursive: true }); fs.writeFileSync(path.join(outDir, feature, name + '.inp'), text); }
	const nodes = ['J0', 'J1', 'T1'], lk = ['PU1', '3'];

	// 1. Two compartment. The .inp states 0.2 (EPANET: 0.2 of the tank volume is the compartment water enters and leaves by).
	{
		const mk = (frac) => cyclingNet({ quality: 'Chlorine mg/L', source: true, mixing: '2COMP ' + frac, title: 'Two compartment test: chlorine set point 1.0 mg/L at J0, tank T1 two compartment ' + frac });
		const inp = mk('0.2'), inpRev = mk('0.8');
		expected.twoComp = {
			frac02: await runEpanet(inp, nodes, lk, [12, 24]),
			frac08: await runEpanet(inpRev, nodes, lk, [12, 24]),
			mixed: await runEpanet(cyclingNet({ quality: 'Chlorine mg/L', source: true, mixing: 'MIXED' }), nodes, lk, [12, 24])
		};
		inpCopy('1-two-compartment', 'twocomp-0.2', inp);
		inpCopy('1-two-compartment', 'twocomp-0.8', inpRev);
		add('1-two-compartment', inp, 'twocomp-c1-20-c2-80', { mixCode: 0, mixFraction: 'percent', wq: {} });
		add('1-two-compartment', inp, 'twocomp-c1-80-c2-20', { mixCode: 0, mixFraction: 'percent', swap: true, wq: {} });
	}
	// 2. Chlorine, four ways of storing the reaction rates.
	{
		const chl = cyclingNet({ quality: 'Chlorine mg/L', source: true, mixing: 'MIXED', reactions: CHLORINE_REACTIONS, title: 'Chlorine test: set point 1.0 mg/L at J0, bulk -2 per day, wall -1 ft per day' });
		expected.chlorine = await runEpanet(chl, nodes, lk, [12, 24]);
		expected.chlorineNoDecay = await runEpanet(cyclingNet({ quality: 'Chlorine mg/L', source: true, mixing: 'MIXED', reactions: { bulk: 0, wall: 0 } }), nodes, lk, [12, 24]);
		inpCopy('2-chlorine', 'chlorine', chl);
		add('2-chlorine', chl, 'chlorine-day-signed', { wq: { bulkUnit: 'day', sign: 'epanet' } });
		add('2-chlorine', chl, 'chlorine-second-signed', { wq: { bulkUnit: 'sec', sign: 'epanet' } });
		add('2-chlorine', chl, 'chlorine-day-positive', { wq: { bulkUnit: 'day', sign: 'positive' } });
		add('2-chlorine', chl, 'chlorine-second-positive', { wq: { bulkUnit: 'sec', sign: 'positive' } });
	}
	// 3. Age and trace.
	{
		const age = cyclingNet({ quality: 'Age', title: 'Age test' });
		expected.age = await runEpanet(age, nodes, ['PU1'], [12, 24]);
		inpCopy('3-age-and-trace', 'age', age);
		add('3-age-and-trace', age, 'age', { wq: {} });
		const trace = cyclingNet({ quality: 'Trace R', title: 'Trace test: percent of water from reservoir R' });
		expected.trace = await runEpanet(trace, nodes, ['PU1'], [12, 24]);
		inpCopy('3-age-and-trace', 'trace', trace);
		add('3-age-and-trace', trace, 'trace', { wq: {} });
	}
	return { files: files, expected: expected, env: env };
}

// The README Tom reads: plain steps, a few numbers per file, what each outcome means. One paragraph per line.
function readme(x) {
	const L = [];
	const p = (t) => { L.push(t, ''); };
	const q = (e, h, n) => f3(e[h].node[n].quality);
	const tc = x.twoComp, ch = x.chlorine, nd = x.chlorineNoDecay, ag = x.age, tr = x.trace;
	L.push('# WaterGEMS feature tests, round 2', '');
	p('Written 2026-11-03 (Arizona time). Thank you for round 1. Because of your answers, the emitter, pump speed and the plain, first in first out and last in first out tank mixing are now written by the page. This round is only what is still open: two compartment tank mixing, chlorine, and age and trace. Eight files, in three folders.');
	p('Each file is a pair, a `.wtg` and a `.wtg.sqlite` with the same name; keep the two side by side, and copy the whole folder to a plain local disk folder before opening. Every file is a tiny project in US units (gpm, feet, inches, psi), Base scenario only, 24 hours at a 1 hour step. The same network is beside each folder\'s files as an EPANET `.inp`.');
	p('This time the Calculation Type is already set to the right run (Constituent for chlorine and two compartment, Age, Trace), so you should not need to change it. If you find it set to something else, tell me.');
	p('To compute, press Compute on the Home tab, set the time to the hour named below, and read the value in the element\'s properties or a Flex Table.');

	L.push('## Single most useful step', '');
	p('If you only do one thing: in WaterGEMS, make a chlorine constituent with a bulk reaction rate of -2 per day and a wall reaction rate of -1 ft per day, apply it to the whole network, and save the project (File > Save As) under any name. Send me that pair of files. We can then read where WaterGEMS keeps the rates, and the signs and units, instead of guessing between the four files in the second folder.');

	L.push('## 1-two-compartment (2 files)', '');
	p('The small network: reservoir `R`, pump `PU1`, junctions `J0` and `J1`, tank `T1`. A set point booster of 1.0 mg/L at `J0`, no reactions, and `T1` set to two compartment. Last time your file read 0.2 and 0.8 and WaterGEMS asked for 100 in total, so these use percents. `twocomp-c1-20-c2-80` has compartment 1 at 20 and compartment 2 at 80. `twocomp-c1-80-c2-20` has them the other way round.');
	p('Steps: open `twocomp-c1-20-c2-80`, double-click `T1`, and write down the Mixing Model and the two compartment numbers. Compute and read the chlorine at `T1` at hours 12 and 24. Then do the same for the other file.');
	p('EPANET gets, when the compartment that water enters and leaves by is 20 percent of the tank: hour 12 ' + q(tc.frac02, 12, 'T1') + ', hour 24 ' + q(tc.frac02, 24, 'T1') + ' mg/L. When it is 80 percent: hour 12 ' + q(tc.frac08, 12, 'T1') + ', hour 24 ' + q(tc.frac08, 24, 'T1') + '. A completely mixed tank gets ' + q(tc.mixed, 12, 'T1') + ' and ' + q(tc.mixed, 24, 'T1') + '. Last time you read 0.5 at hour 12.');
	p('What it means: if the first file gives the first pair of numbers and the second gives the second pair, compartment 1 is the compartment water enters and leaves by, just as in EPANET, and the codes are right. If the first file gives the second pair, compartment 1 and 2 are the other way round and we swap them. If neither pair appears, the way WaterGEMS runs two compartment tanks differs from EPANET; send both results and the chlorine at `J1` at hour 12 (EPANET gets ' + q(tc.frac02, 12, 'J1') + ').');

	L.push('## 2-chlorine (4 files, open `chlorine-day-signed` first)', '');
	p('The same network: set point booster of 1.0 mg/L at `J0`, a bulk reaction of -2 per day and a wall reaction of -1 ft per day, tank `T1` completely mixed. The four files differ only in how the two rates are stored: per day with the minus signs (`chlorine-day-signed`), per second with minus signs, per day written positive, per second written positive.');
	p('Steps: open `chlorine-day-signed`, double-click `J0` (it should read Setpoint Booster 1.0), open the water quality reaction settings and write down the bulk and wall rates with their units text. Compute and read the chlorine at `J1` and `T1` at hours 12 and 24.');
	p('EPANET gets: hour 12 `J1` ' + q(ch, 12, 'J1') + ', `T1` ' + q(ch, 12, 'T1') + '; hour 24 `J1` ' + q(ch, 24, 'J1') + ', `T1` ' + q(ch, 24, 'T1') + ' mg/L. With no reactions it gets `J1` ' + q(nd, 24, 'J1') + ' and `T1` ' + q(nd, 24, 'T1') + ' at hour 24. Last time you read 1.0 at `J1` and 0.2 at `T1`, which looks like no reactions at all.');
	p('What it means: the file whose numbers match EPANET has the right unit and sign. If `J1` is about 1.00 everywhere, the rates were not read in that file; try the next one. If none of the four match, please send the rates the reaction settings showed and their units text, and the Save As file from the step above.');

	L.push('## 3-age-and-trace (2 files)', '');
	p('The same network without a chemical. `age` is an age run: EPANET gets ' + f2(ag[24].node.J1.quality) + ' hours at `J1` and ' + f2(ag[24].node.T1.quality) + ' hours at `T1` at hour 24 (' + f2(ag[12].node.T1.quality) + ' at `T1` at hour 12). `trace` follows the water from reservoir `R`: EPANET gets ' + f1(tr[24].node.J1.quality) + ' percent at `J1` and ' + f1(tr[24].node.T1.quality) + ' percent at `T1` at hour 24 (' + f1(tr[12].node.T1.quality) + ' at hour 12).');
	p('Steps: open each, check the Calculation Type reads Age or Trace, compute, and compare. For `trace`, also say whether the trace node reads `R`. What it means: matching numbers confirm the type and the trace node; a different type name tells us which code is wrong.');

	p('If a file will not open: the exact message and the file name is all I need. If it opens but the numbers differ: send the number you saw and the file name.');
	return L.join('\n');
}

module.exports = { build, readme, cyclingNet, EMITTER_NET, runEpanet, setup, writePair };

if (require.main === module) {
	(async function () {
		const args = {};
		for (let i = 2; i < process.argv.length; i += 2) { args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1]; }
		const outDir = args.out || path.join(os.homedir(), 'tom-files', '2026-11-03', 'wtg-feature-tests-2');
		const r = await build(outDir);
		fs.writeFileSync(path.join(outDir, 'expected.json'), JSON.stringify(r.expected, null, 1));
		fs.writeFileSync(path.join(outDir, 'README.md'), module.exports.readme(r.expected) + '\n');
		console.log(r.files.length + ' files under ' + outDir);
		r.files.forEach((f) => { console.log(' ', f.feature + '/' + f.name, 'integrity', f.report.integrity, 'fk', f.report.foreignKeyViolations); });
	}()).catch((e) => { console.error(e); process.exit(1); });
}
