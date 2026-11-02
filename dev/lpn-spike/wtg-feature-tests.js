// CANDIDATE FILES FOR TOM'S WATERGEMS (Task 749): one tiny network per feature, written once per plausible guess
// at a storage unit or a code that no saved project has ever shown, with the numbers EPANET gives for the same
// network so that Tom can compare what his WaterGEMS shows.
//
//   node dev/lpn-spike/wtg-feature-tests.js [--out <dir>]        default ~/tom-files/2026-11-02/wtg-feature-tests
//
// The features: emitter coefficient, pump speed pattern, tank mixing (2-compartment, FIFO, LIFO), water quality
// (chlorine with a source and reactions, age, trace). The writer is js/lpn-wtg-export.js, switched by `opts.candidate`.
// Licence line: nobody decompiles or probes Bentley software; Tom's WaterGEMS is used only as an ordinary user would
// (does a file we wrote open, with the same results as EPANET?). What each guess rests on: dev/wtg-export.md,
// "Candidates under test". The harness: dev/lpn-spike/wtg-feature-tests-harness.js.
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
			p.stepQ();
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
	require(path.join(ROOT, 'js', 'lpn-patterns.js')); require(path.join(ROOT, 'js', 'lpn-inp.js'));
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
// The whole set. Returns { files: [{path, feature, candidate, report}], expected: {...} }.
// ---------------------------------------------------------------------------------------------
async function build(outDir) {
	const env = await setup();
	const files = [], expected = {};
	function add(feature, inp, name, candidate) {
		const dir = path.join(outDir, feature);
		const report = writePair(env, inp, name, candidate, dir);
		files.push({ feature: feature, name: name, candidate: candidate, report: report, dir: dir });
	}
	function inpCopy(feature, name, text) { fs.mkdirSync(path.join(outDir, feature), { recursive: true }); fs.writeFileSync(path.join(outDir, feature, name + '.inp'), text); }

	// 1. Emitter
	{
		const ex = await runEpanet(EMITTER_NET, ['J1', 'J2', 'J3'], ['1', '2', '3'], [0, 12]);
		expected.emitter = { hour0: ex[0], hour12: ex[12] };
		inpCopy('1-emitter', 'emitter', EMITTER_NET);
		['A', 'B', 'C', 'D'].forEach((c) => { add('1-emitter', EMITTER_NET, 'emitter-' + c, { emitter: c }); });
	}
	// 2. Pump speed pattern
	{
		const inp = cyclingNet({ pumpPattern: true, title: 'Pump speed pattern test: pump PU1 follows pattern SP' });
		const ex = await runEpanet(inp, ['J0', 'J1', 'T1'], ['PU1', '2', '3'], [0, 6, 12, 18]);
		expected.pumpSpeed = ex;
		expected.pumpFixed = await runEpanet(cyclingNet({}), ['J0', 'J1', 'T1'], ['PU1', '2', '3'], [0, 6, 12, 18]);
		inpCopy('2-pump-speed', 'pump-speed', inp);
		[0, 1, 2, 3].forEach((v) => { add('2-pump-speed', inp, 'pump-speed-vsp' + v, { vsp: v }); });
	}
	// 3. Tank mixing
	{
		expected.mixing = {};
		for (const m of [['mixed', 'MIXED'], ['2comp', '2COMP 0.2'], ['fifo', 'FIFO'], ['lifo', 'LIFO']]) {
			const inp = cyclingNet({ quality: 'Chlorine mg/L', source: true, mixing: m[1], title: 'Tank mixing test: chlorine set point 1.0 mg/L at J0, tank T1 mixing ' + m[1] });
			const ex = await runEpanet(inp, ['J0', 'J1', 'T1'], ['PU1', '3'], [6, 12, 24]);
			expected.mixing[m[0]] = ex;
			inpCopy('4-tank-mixing', 'mix-' + m[0], inp);
			if (m[0] === 'mixed') { continue; }
			if (m[0] === '2comp') {
				add('4-tank-mixing', inp, 'mix-2comp-code2-fraction', { mixCode: 2, mixFraction: 'fraction', wq: {} });
				add('4-tank-mixing', inp, 'mix-2comp-code2-percent', { mixCode: 2, mixFraction: 'percent', wq: {} });
				add('4-tank-mixing', inp, 'mix-2comp-code0-fraction', { mixCode: 0, mixFraction: 'fraction', wq: {} });
			}
			if (m[0] === 'fifo') { add('4-tank-mixing', inp, 'mix-fifo-code3', { mixCode: 3, wq: {} }); }
			if (m[0] === 'lifo') { add('4-tank-mixing', inp, 'mix-lifo-code4', { mixCode: 4, wq: {} }); }
		}
	}
	// 4. The calculation type (which number is "Constituent", "Age", "Trace")
	{
		const inp = cyclingNet({ quality: 'Chlorine mg/L', source: true, title: 'Calculation type series: open the calculation options and read the Calculation Type' });
		for (let k = 0; k <= 9; k++) { if (k !== 5) { add('3-calculation-type', inp, 'calctype-' + k, { wq: { calcType: k } }); } }
	}
	// 5. Water quality
	{
		const reactions = { bulk: -2, wall: -1 };
		const chl = cyclingNet({ quality: 'Chlorine mg/L', source: true, mixing: 'MIXED', reactions: reactions, title: 'Chlorine test: set point 1.0 mg/L at J0, bulk -2 per day, wall -1 ft per day' });
		expected.chlorine = await runEpanet(chl, ['J0', 'J1', 'T1'], ['PU1', '3'], [6, 12, 24]);
		inpCopy('5-water-quality', 'chlorine', chl);
		expected.chlorineNoDecay = await runEpanet(cyclingNet({ quality: 'Chlorine mg/L', source: true, mixing: 'MIXED', reactions: { bulk: 0, wall: 0 } }), ['J0', 'J1', 'T1'], ['PU1'], [12, 24]);
		add('5-water-quality', chl, 'chlorine-day-signed', { wq: { bulkUnit: 'day', sign: 'epanet' } });
		add('5-water-quality', chl, 'chlorine-second-signed', { wq: { bulkUnit: 'sec', sign: 'epanet' } });
		add('5-water-quality', chl, 'chlorine-day-positive', { wq: { bulkUnit: 'day', sign: 'positive' } });
		add('5-water-quality', chl, 'chlorine-second-positive', { wq: { bulkUnit: 'sec', sign: 'positive' } });
		[0, 1, 3].forEach((c) => { add('5-water-quality', chl, 'source-type-code' + c, { wq: { bulkUnit: 'day', sign: 'epanet', sourceCode: c } }); });
		const age = cyclingNet({ quality: 'Age', title: 'Age test' });
		expected.age = await runEpanet(age, ['J0', 'J1', 'T1'], ['PU1'], [12, 24]);
		inpCopy('5-water-quality', 'age', age);
		add('5-water-quality', age, 'age', { wq: {} });
		const trace = cyclingNet({ quality: 'Trace R', title: 'Trace test: percent of water from reservoir R' });
		expected.trace = await runEpanet(trace, ['J0', 'J1', 'T1'], ['PU1'], [12, 24]);
		inpCopy('5-water-quality', 'trace', trace);
		add('5-water-quality', trace, 'trace', { wq: {} });
	}
	return { files: files, expected: expected, env: env };
}

// ---------------------------------------------------------------------------------------------
// The README Tom reads: plain click steps, a few numbers per file, what each outcome tells us.
// One paragraph per line (no hard wraps).
// ---------------------------------------------------------------------------------------------
function readme(x) {
	const L = [];
	const p = (t) => { L.push(t, ''); };
	const q = (e, h, n) => f3(e[h].node[n].quality);
	L.push('# WaterGEMS feature tests: files to open, what to compare', '');
	p('Written 2026-11-02 (Arizona time). Nobody has opened these in WaterGEMS yet; you are the test. Each file is a pair, a `.wtg` and a `.wtg.sqlite` with the same name, and the two must stay side by side. Copy a whole folder to a plain local disk folder (not OneDrive, not a network share) and open the `.wtg` with File > Open. Every file is a tiny project in US units (gpm, feet, inches, psi) with the Base scenario only, 24 hours at a 1 hour step. Next to each folder\'s files is the same network as an EPANET `.inp`, so you can also open that in WaterGEMS or EPANET to see what an import makes of it.');
	p('Why these exist: you asked us to guess and let you test. Where we do not know a storage unit or a code, there is one file per plausible guess, named for the guess. You do not need to open all of them: open the first file of a section, compare, and only go on if it is wrong. Nothing here is on the page or in the visitor export; it stays here until you say which guess is right.');
	p('To compute: press the Compute button on the Home tab, then set the time to the hour named in the table (the time box in the toolbar), and read the value from the element\'s properties or from a Flex Table. If a file will not open, send me the exact message and stop with that file.');

	// 1 emitter
	const e0 = x.emitter.hour0.node;
	L.push('## 1-emitter (4 files, open `emitter-A` first)', '');
	p('The network: a reservoir `R` feeds junction `J1`, which feeds `J2` (100 gpm) and `J3`. `J1` has an emitter coefficient of 0.01 (your value) and `J3` has 1.0, both in EPANET\'s unit for a US project, gpm per psi^0.5, with exponent 0.5. Neither draws anything else. The four files differ only in the number stored for the coefficient: A stores 0.01 and 1.0 as typed; B stores them as cubic feet per second per psi^0.5; C as cubic feet per second per foot^0.5; D as gpm per foot^0.5.');
	p('Steps: open the file, double-click `J1`, and write down the Emitter Coefficient field (the number and the unit it shows). Do the same for `J3`. Compute and read the flow leaving each junction.');
	p('EPANET gets, at every hour: `J3` ' + f2(e0.J3.demand) + ' gpm, `J1` ' + f2(e0.J1.demand) + ' gpm (read it to 0.1 gpm only, since the solver\'s tolerance is that coarse next to a flow of 109 gpm), `J2` 100 gpm, pressure ' + f1(e0.J3.pressure) + ' psi at both emitter junctions, flow in the reservoir pipe ' + f1(x.emitter.hour0.link['1'].flow) + ' gpm.');
	p('What it tells us: the file whose `J3` flow is ' + f2(e0.J3.demand) + ' gpm has the right storage unit, and the other three show flows that are off by a large factor (one of them by only about a third, so read the number). If none matches, send the four `J3` flows and the field text each showed: the ratios give the unit. If the field shows 0.01 with a unit text, send the text.');

	// 2 pump speed
	const pf = x.pumpFixed, ps = x.pumpSpeed;
	L.push('## 2-pump-speed (4 files, open `pump-speed-vsp2` first)', '');
	p('The network is the small one used for the other tests: reservoir `R`, pump `PU1`, junctions `J0` and `J1` (300 gpm on a daily pattern), and tank `T1`. Pump `PU1` follows a relative speed pattern `SP`: 1.00 for hours 0 to 5, 0.90 for 6 to 11, 0.95 for 12 to 17, 1.00 for 18 to 23. The four files differ only in the code for the variable speed pump type: vsp0, vsp1, vsp2, vsp3, and every one is marked a variable speed pump with pattern `SP` as its pattern.');
	p('Steps: double-click `PU1` and write down what its pump type (the field with your five choices) and its speed pattern show. Then compute and read the flow through `PU1` at hours 0, 6, 12 and 18.');
	p('EPANET gets for `PU1`: hour 0 ' + f1(ps[0].link.PU1.flow) + ' gpm, hour 6 ' + f1(ps[6].link.PU1.flow) + ', hour 12 ' + f1(ps[12].link.PU1.flow) + ', hour 18 ' + f1(ps[18].link.PU1.flow) + '. The same pump at a constant speed 1.00 (no pattern) gets ' + f1(pf[0].link.PU1.flow) + ', ' + f1(pf[6].link.PU1.flow) + ', ' + f1(pf[12].link.PU1.flow) + ', ' + f1(pf[18].link.PU1.flow) + '.');
	p('What it tells us: the name each file shows for its pump type tells us which number is which of your five choices, and the one that shows a pattern choice is the code we want (a relative speed factor pattern, as EPANET\'s PATTERN). If the flows follow the first list, that file\'s code works and the pattern multiplies the speed the way EPANET\'s does. If they follow the second list, WaterGEMS ignored the pattern. If the pattern field is empty when you open the pump, tell me which file and what it shows.');

	// 3 calculation type
	L.push('## 3-calculation-type (9 files, `calctype-0` to `calctype-9`, there is no 5)', '');
	p('One tiny network (the same as the tank mixing one), nine times, differing only in the number stored for the Calculation Type of the scenario\'s calculation options. Steps, for each: open the file, go to Analysis > Calculation Options, open the Base calculation options, and write down the Calculation Type it shows. No need to compute. For number 5, write down what your Net3 export from before shows; that is the plain hydraulic run, number 5.');
	p('What it tells us: a list of numbers and names, for example 0 = Age, 1 = Constituent. That is all we need to write the quality runs with the right type; it takes about a minute a file. If a file shows an error or a blank type, say which.');

	// 4 mixing
	const mx = x.mixing;
	L.push('## 4-tank-mixing (5 files, open `mix-2comp-code2-fraction` first)', '');
	p('The same small network, now a water quality run for chlorine: a set point booster of 1.0 mg/L at `J0`, no reactions, and tank `T1` (30 ft across, between 2 and 25 ft) with a mixing model. `T1` fills and drains over the day. The files: mix-2comp-code2-fraction (two compartment, stored as code 2, first compartment 0.2 and second 0.8), mix-2comp-code2-percent (code 2, 20 and 80), mix-2comp-code0-fraction (code 0, 0.2 and 0.8), mix-fifo-code3 (first in first out, code 3), mix-lifo-code4 (last in first out, code 4). Plain mixed is code 1, which your files already use.');
	p('Steps: double-click `T1` and write down the Mixing Model it shows (the name) and, for a two compartment file, the compartment numbers. To run it: Analysis > Calculation Options > Base calculation options, and if the Calculation Type is not the constituent (chlorine) run, choose it (section 3 finds out which number we wrote), then Compute. Read the chlorine concentration at `T1` at hour 12.');
	p('EPANET gets for `T1` at hour 12: completely mixed ' + q(mx.mixed, 12, 'T1') + ' mg/L, two compartment (first compartment 0.2) ' + q(mx['2comp'], 12, 'T1') + ', FIFO ' + q(mx.fifo, 12, 'T1') + ', LIFO ' + q(mx.lifo, 12, 'T1') + '. At hour 24: ' + q(mx.mixed, 24, 'T1') + ', ' + q(mx['2comp'], 24, 'T1') + ', ' + q(mx.fifo, 24, 'T1') + ', ' + q(mx.lifo, 24, 'T1') + '. At `J1`, hour 12, every model gives about ' + q(mx.mixed, 12, 'J1') + '.');
	p('What it tells us: the name in the Mixing Model field of each file gives us the code (for instance, if code 3 shows LIFO, then FIFO is 4). For the two compartment file whose compartment 1 reads as 20 percent (or as 0.2), that is the right way to state the fraction. The concentrations at hour 12 then show whether WaterGEMS applies the model the way EPANET does; the answers above separate the four models plainly.');

	// 5 water quality
	const ch = x.chlorine, nd = x.chlorineNoDecay;
	L.push('## 5-water-quality (chlorine files, then `age` and `trace`)', '');
	p('Your question about Net3: Net3 exports and opens, but the export writes it as a hydraulic run. The only quality in our copy of Net3 is the analysis choice, a trace of the water from `Lake` (it has no chemical, no source and zero reaction rates), and that choice is not written: in your saved project every water quality table was empty or at its defaults, so we had no example of where WaterGEMS keeps the analysis type, the trace node, the sources, the reactions or the mixing. That is why the export\'s list says it does not yet write them. These files are our guess at where they go; `trace` below is Net3\'s own case in a small network.');
	p('The chlorine network is the small one again: a set point booster of 1.0 mg/L at `J0`, a bulk reaction of -2 per day and a wall reaction of -1 ft per day (EPANET\'s units and signs), tank `T1` completely mixed. Four files differ in how the reaction rates are stored: chlorine-day-signed (per day, negative for decay, as EPANET states them), chlorine-second-signed (per second), chlorine-day-positive (per day, written positive), chlorine-second-positive. Three more, source-type-code0, source-type-code1 and source-type-code3, are the same as chlorine-day-signed but with the source type stored as another code.');
	p('Steps: open `chlorine-day-signed` first. Double-click `J0` and write down the source type and strength it shows. Open the Base calculation options; if the Calculation Type is not the constituent (chlorine) run, choose it. Compute, and read the chlorine at `J1` and `T1` at hours 12 and 24. For the three source-type files, only open `J0` and write down the source type name it shows; no need to compute.');
	p('EPANET gets: hour 12 `J1` ' + q(ch, 12, 'J1') + ', `T1` ' + q(ch, 12, 'T1') + '; hour 24 `J1` ' + q(ch, 24, 'J1') + ', `T1` ' + q(ch, 24, 'T1') + ' mg/L. With the reactions switched off it would be `J1` ' + q(nd, 24, 'J1') + ' and `T1` ' + q(nd, 24, 'T1') + ' at hour 24, so a file that shows those means the rates were read as zero (the unit is wrong the other way), and a file that shows 0 at `J1` read them as enormous. A value above 1.0 at `J1` means the sign is the other way. WaterGEMS may differ from EPANET in the third decimal because its water quality time step may not be EPANET\'s 5 minutes.');
	p('What it tells us: which of the four reaction files matches fixes the unit and sign of the rates. The source type names fix the source type code. If `J1` is 1.00 or 0.00 in all four, send what each showed for the bulk and wall rate fields when you opened a pipe\'s water quality properties and the reaction settings, with their units text.');
	const ag = x.age, tr = x.trace;
	p('`age` and `trace` are the same small network without a chemical. `age` is an age run: EPANET gets ' + f2(ag[24].node.J1.quality) + ' hours at `J1` and ' + f2(ag[24].node.T1.quality) + ' hours at `T1` at hour 24 (' + f2(ag[12].node.T1.quality) + ' at `T1` at hour 12). `trace` traces the water from reservoir `R`: ' + f1(tr[24].node.J1.quality) + ' percent at `J1` and ' + f1(tr[24].node.T1.quality) + ' percent at `T1` at hour 24 (' + f1(tr[12].node.T1.quality) + ' at hour 12). Open each, check the Calculation Type (set it by hand to Age or Trace if it is not), compute, and compare. For `trace`, also say whether the trace node reads `R`.');
	p('If any of this does not open: the message, and the file name, is all I need. If it opens but the numbers differ: send me the number you saw and the file name. Saving a file from WaterGEMS (File > Save As) with the setting made by hand, for example one tank on FIFO and one on LIFO, would settle every code in a single file each.');
	return L.join('\n');
}

module.exports = { build, readme, cyclingNet, EMITTER_NET, runEpanet, setup, writePair };

if (require.main === module) {
	(async function () {
		const args = {};
		for (let i = 2; i < process.argv.length; i += 2) { args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1]; }
		const outDir = args.out || path.join(os.homedir(), 'tom-files', '2026-11-02', 'wtg-feature-tests');
		const r = await build(outDir);
		fs.writeFileSync(path.join(outDir, 'expected.json'), JSON.stringify(r.expected, null, 1));
		fs.writeFileSync(path.join(outDir, 'README.md'), module.exports.readme(r.expected) + '\n');
		console.log(r.files.length + ' candidate files under ' + outDir);
		r.files.forEach((f) => { console.log(' ', f.feature + '/' + f.name, 'integrity', f.report.integrity, 'fk', f.report.foreignKeyViolations); });
	}()).catch((e) => { console.error(e); process.exit(1); });
}
