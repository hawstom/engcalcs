// THE RUN BOX SAYS SO WHEN THE ENGINE WARNED. Run with:
//
//   node dev/lpn-spike/run-warning-box-harness.js
//
// Defect (pre-reviewer): an extended-period run through EPANET finished with "The run finished.
// Reporting time steps: 25." even when EPANET reported time steps that did not balance, or other
// warnings. The Run report showed them; the map did not, and a reader at that step saw nonsense
// (a pipe at 56 ft/s) with no hint. The box now counts the warnings and points at the Run report.
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
require('./bootstrap.js');
const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js'));
global.EngCalcs = EngCalcs;
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-inp.js'));
require(path.join(ROOT, 'js', 'lpn-epanet.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));
const { buildModel } = require('./net3-model.js');

let failures = 0;
function check(ok, msg, detail) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg + (detail === undefined ? '' : `  (${detail})`));
	if (!ok) failures++;
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const PUMPX = `[TITLE]
pump beyond curve
[JUNCTIONS]
 J1 0 4000
 J2 0 0
[RESERVOIRS]
 R1 0
[PUMPS]
 PU1 R1 J1 HEAD C1
[CURVES]
 C1 500 100
[PIPES]
 P1 J1 J2 100 24 130 0 Open
[TIMES]
 Duration 2:00
 Hydraulic Timestep 1:00
 Report Timestep 1:00
[OPTIONS]
 Units GPM
 Headloss H-W
[END]
`;

async function load(inpText) {
	const parsed = EngCalcs.lpnInpParse(inpText);
	return buildModel(EngCalcs, parsed);
}

async function boxFor(model, report, run) {
	// Drive the real time layer with the real run as the engine's answer.
	EngCalcs.lpnEpanetRun = function () { return Promise.resolve(run); };
	const doc = { times: EngCalcs.lpnTimesDefaults(), nodes: [], links: [] };
	doc.times.duration = 7200;
	const solveNow = () => { EngCalcs.lpnTimeRun({ nodes: [{ id: 'J1', type: 'junction', elev: 0 }], links: [] }); };
	EngCalcs.lpnTimeInit({
		tabs: [], doc: () => doc, apply: () => {}, status: () => {},
		solve: solveNow, solveNow: solveNow,
		native: () => ({ ok: true, converged: true, heads: {}, flows: {} }),
		snapshot: () => {}, save: () => {},
		toSI: (v) => v, toDisplay: (v) => v, unitLabel: () => ''
	});
	EngCalcs.lpnTimeRunNow();
	await wait(150);
	return EngCalcs.lpnTimeRunBoxState();
}

(async () => {
	await EngCalcs.lpnEpanetLoad('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const real = EngCalcs.lpnEpanetRun;

	// ---- clean: Net1 ----
	const net1 = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net1.inp'), 'utf8');
	const net3 = fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8');
	const cleanRun = await real.call(EngCalcs, await load(net1), {});
	check(cleanRun.ok, 'Net1 runs');
	let st = await boxFor(null, null, cleanRun);
	check(st.warnings === 0, 'Net1: no warnings counted', String(st.warnings));
	check(/^The run finished\. Reporting time steps: \d+\. Time taken: [\d.]+ s\.$/.test(st.text), 'Net1: the plain finish line, unchanged', st.text);

	// ---- unbalanced ----
	const unRun = await real.call(EngCalcs, Object.assign(await load(net3), { hydraulics: { trials: 1, accuracy: 1e-8, unbalanced: 'continue', unbalancedTrials: 0 } }), {});
	// Net3 with one trial allowed and no extra trials: EPANET cannot balance it and says so.
	console.log('unbalanced run: ok=' + unRun.ok + ' stepsUnconverged=' + unRun.stepsUnconverged);
	console.log((unRun.report || '').split('\n').filter((l) => /WARNING|nbalanced/.test(l)).join('\n'));
	st = await boxFor(null, null, unRun);
	check(st.warnings > 0, 'unbalanced: warnings counted', String(st.warnings));
	check(/Time steps not balanced \(\d+\)/.test(st.text) && /Run report/.test(st.text), 'unbalanced: the box names it and points at the Run report', st.text);

	// ---- pump beyond its curve ----
	const pxRun = await real.call(EngCalcs, await load(PUMPX), {});
	console.log('pump run: ok=' + pxRun.ok);
	console.log((pxRun.report || '').split('\n').filter((l) => /WARNING/.test(l)).join('\n'));
	st = await boxFor(null, null, pxRun);
	check(st.warnings > 0, 'pump: warnings counted', String(st.warnings));
	check(/Warnings \(\d+\)/.test(st.text) && /Run report/.test(st.text), 'pump: the box names it and points at the Run report', st.text);

	console.log(failures ? `\n${failures} FAILED` : '\nall ok');
	process.exit(failures ? 1 : 0);
})();
