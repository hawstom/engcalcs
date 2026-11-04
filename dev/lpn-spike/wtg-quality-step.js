// A WaterGEMS file for the quality time step (Task 749, 2026-11-03): Net3 as a 72 hour chlorine run, a source of 1.0 mg/L at
// the Lake, bulk and wall -0.05, and a quality time step of 30 minutes STATED in the .inp. The page export writes the step
// (flag True, 1800 s), and WaterGEMS should show 0.5 hr. EPANET's number is computed at the same step, and at 6 minutes.
//   node dev/lpn-spike/wtg-quality-step.js [--out <dir>]     default ~/tom-files/<Arizona date>/wtg-quality-step
// Licence line: nobody decompiles or probes Bentley software.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const ft = require('./wtg-feature-tests.js');
const wex = require('./wtg-export.js');

const ROOT = path.join(__dirname, '..', '..');
function net3Chlorine(step) {
	let t = fs.readFileSync(path.join(__dirname, 'reference', 'Net3.inp'), 'utf8');
	t = t.replace(/Duration\s+24:00/, 'Duration           \t72:00').replace(/ Quality Timestep.*\n/, '').replace(/Quality\s+Trace Lake/, 'Quality            \tChlorine mg/L');
	if (step) { t = t.replace('[TIMES]\n', '[TIMES]\n Quality Timestep    \t' + step + '\n'); }
	t = t.replace(/Global Bulk\s+0.0/, 'Global Bulk           \t-0.05').replace(/Global Wall\s+0.0/, 'Global Wall           \t-0.05');
	t = t.replace(/\[SOURCES\]\n[^\n]*\n/, '[SOURCES]\n;Node            \tType        \tQuality     \tPattern\n Lake            \tCONCEN      \t1.0\n');
	return t;
}
function secs(step) { const w = step.split(':'); return Number(w[0]) * 3600 + Number(w[1]) * 60; }

async function build(outDir) {
	const env = await ft.setup();
	const inp = net3Chlorine('0:30');
	const parsed = env.EngCalcs.lpnInpParse(inp);
	const watch = Array.from(new Set(parsed.links.filter((l) => l.type === 'pump').map((l) => l.id).concat(parsed.controls.map((c) => c.link))));
	const ref = await wex.epanetReference(inp, watch, [], []);
	const out = env.lib.writeWtg(env.SQL, env.tplSqlite, parsed, { initial: ref.initial, changes: ref.changes },
		{ name: 'Net3-quality-step-30min', efficiency: 75, qualityStepSeconds: secs('0:30') });
	fs.mkdirSync(outDir, { recursive: true });
	fs.writeFileSync(path.join(outDir, 'Net3-quality-step-30min.wtg.sqlite'), out.bytes);
	fs.writeFileSync(path.join(outDir, 'Net3-quality-step-30min.wtg'), env.lib.patchWtgXml(env.tplWtg, out.report.removedChildScenarios, 1, out.report.removedChildAlternatives, out.report.extentFt));
	fs.writeFileSync(path.join(outDir, 'Net3-quality-step-30min.inp'), inp);
	const expected = {};
	for (const step of ['0:30', '0:06']) {
		const r = await ft.runEpanet(net3Chlorine(step), ['243'], [], [45, 60]);
		expected[step] = { hr45: r[45].node['243'].quality, hr60: r[60].node['243'].quality };
	}
	return { expected: expected, report: out.report };
}

function readme(x) {
	const f3 = (v) => Number(v).toFixed(3);
	return [
		'# WaterGEMS quality time step test', '',
		'Written 2026-11-03 (Arizona time). One file, a pair: `Net3-quality-step-30min.wtg` and `Net3-quality-step-30min.wtg.sqlite`. Keep them side by side and copy the folder to a plain local disk folder before opening.', '',
		'The network is Net3 run for 72 hours as a chlorine model: 1.0 mg/L entering at the Lake, a bulk and a wall reaction coefficient of -0.05 for the whole network, and a water quality time step of 30 minutes stated in the file (you did not say where your chlorine source was, so this is our choice). The same network is beside the pair as `Net3-quality-step-30min.inp`.', '',
		'## Steps', '',
		'Open the file and open the Calculation Options. The water quality time step should read True and 0.5 hours. If it shows something else, write down what it shows. Compute, then read the chlorine at node 243 at hour 60.', '',
		'EPANET gets at node 243, hour 60: ' + f3(x['0:30'].hr60) + ' mg/L with the 30 minute step, and ' + f3(x['0:06'].hr60) + ' mg/L with a 6 minute step (a tenth of the hydraulic step, which is what you get when the setting is left False). At hour 45 it gets ' + f3(x['0:30'].hr45) + ' and ' + f3(x['0:06'].hr45) + '.', '',
		'What it means: if the step reads True and 0.5 hr, the export now carries a quality time step you can control, and the page writes it from the project. If WaterGEMS then reads about the same as EPANET, the step is not what separates the two programs on a network like this. If it differs, send the number and I will look at what else we write.', ''
	].join('\n');
}

module.exports = { build, readme, net3Chlorine };

if (require.main === module) {
	(async function () {
		const args = {};
		for (let i = 2; i < process.argv.length; i += 2) { args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1]; }
		const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Phoenix' });
		const outDir = args.out || path.join(os.homedir(), 'tom-files', today, 'wtg-quality-step');
		const r = await build(outDir);
		fs.writeFileSync(path.join(outDir, 'README.md'), readme(r.expected));
		fs.writeFileSync(path.join(outDir, 'expected.json'), JSON.stringify(r.expected, null, 1));
		console.log('written to ' + outDir, JSON.stringify(r.expected), 'integrity', r.report.integrity);
	}()).catch((e) => { console.error(e); process.exit(1); });
}
