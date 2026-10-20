// A FIRE FOR A STATED DURATION INSIDE AN EXTENDED-PERIOD RUN (ROADMAP Task 578, "duration fire").
// Run:  node dev/lpn-spike/duration-fire-harness.js
//
// Sue's practice (Bentley's wiki: a demand on the hydrant for a stated time, then a full EPS): the
// Fire flow box, "A fire for a stated duration", on Net1 (24 h, pattern step 2 h).
//
// THE INDEPENDENT READING is a hand-made copy: Net1's own .inp, with the fire written into its
// [DEMANDS] as a second category on a FIRE pattern (0 0 0 0 1 1 0 ...), opened through the page's
// .inp importer and run through the same EPANET engine. The tool must give the same tank levels,
// pressures and verdicts, because it built nothing the engine would not have been given.
//   1. The tool's run and the hand-made run: every pressure, head and tank level at every step.
//   2. The box's answer (lowest pressure, fire-node pressure, tanks, recovery) equals the numbers
//      read off the hand-made run.
//   3. The document is not touched; the scenario's demand multiplier is not applied to the fire.
//   4. A fire that empties the tank; a start off the pattern step; no junction selected.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-fireflow.js');
require(ROOT + 'js/lpn-demandscale.js');
require(ROOT + 'js/lpn-durfire.js');

global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
const EC = global.EngCalcs;

let failures = 0;
function check(ok, msg) {
	console.log((ok ? '  ok   ' : '  FAIL ') + msg);
	if (!ok) { failures++; }
}
function head(t) { console.log('\n' + t); }

const L = loadLoopedNetwork(
	"\t\tacceptImportedText: acceptImportedText, applySaved: applySaved, buildDom: buildDom, applyMethodUI: applyMethodUI,\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, importInp: importInpFromFile,\n" +
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\tassembleModel: assembleModel, analysisRun: analysisRun,\n" +
	"\t\trunDurationFire: runDurationFire, durRun: function () { return fireDurRun; },\n" +
	"\t\tsetDm: function (v) { settings.hydraulics = settings.hydraulics || {}; settings.hydraulics.demandMultiplier = v; },\n" +
	"\t\tsetAsk: function (k, v) { if (!fireFlowAsk) { fireFlowAsk = fireFlowDefaults(); } fireFlowAsk[k] = v; },\n" +
	"\t\tsetSelectionList: setSelectionList,\n" +
	"\t\tsetEngine: function (e) { settings.engine = e; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

const GPM = 6.30901964e-5;          // m3/s per gpm
const PSI = 0.70307;                // m of head per psi
const NET1 = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net1.inp'), 'utf8');

function openLwn() {
	const saved = L.acceptImportedText(fs.readFileSync(ROOT + 'examples/Net1.lwn', 'utf8'));
	if (!saved) { throw new Error('Net1.lwn did not open'); }
	L.applySaved(saved);
	L.buildDom();
	L.applyMethodUI();
	L.setEngine('epanet');
}
// The hand-made copy: Net1's .inp with the fire written in as a demand category on a FIRE pattern.
function handMadeInp(node, gpm, firstPeriod, lastPeriod, periods, baseGpm) {
	const mult = [];
	for (let k = 0; k < periods; k++) { mult.push(k >= firstPeriod && k <= lastPeriod ? 1 : 0); }
	let txt = NET1.replace('[DEMANDS]\n;Junction        \tDemand      \tPattern         \tCategory\n',
		'[DEMANDS]\n;Junction        \tDemand      \tPattern         \tCategory\n ' + node + '\t' + baseGpm + '\t1\n ' + node + '\t' + gpm + '\tFIRE\n');
	txt = txt.replace('[CURVES]', ' FIRE\t' + mult.join('\t') + '\n\n[CURVES]');
	return txt;
}
function framesOf(run) { return run.frames; }
function maxDiff(a, b, key, ids) {
	let worst = 0, where = '';
	a.forEach((fa, i) => {
		const fb = b[i];
		ids.forEach((id) => {
			const x = fa[key] ? fa[key][id] : undefined, y = fb[key] ? fb[key][id] : undefined;
			if (typeof x !== 'number' || typeof y !== 'number') { return; }
			const d = Math.abs(x - y);
			if (d > worst) { worst = d; where = id + '@' + fa.t; }
		});
	});
	return { worst, where };
}

(async function () {
	setUnitSet('us');
	L.buildLayers();
	await warmEpanet();

	head('1. NET1: 2,000 gpm AT JUNCTION 22, 8:00 TO 12:00 (pattern periods 4 and 5 of 2 h)');
	openLwn();
	const before = JSON.stringify(L.getDoc());
	L.setSelectionList([{ kind: 'node', id: '22' }]);
	L.setAsk('when', 'dur');
	L.setAsk('required', '2000');
	L.setAsk('residual', '20');
	L.setAsk('durStart', String(8 * 3600));
	L.setAsk('durLen', '4:00');
	await L.runDurationFire();
	const d = L.durRun();
	check(d && d.ok, 'the run answered');
	check(JSON.stringify(L.getDoc()) === before && d.docGuard === true, 'the project is not changed by the run');
	check(d.fire.start === 8 * 3600 && d.fire.end === 12 * 3600 && Math.abs(d.fire.flow - 2000 * GPM) < 1e-9, 'the fire is 2000 gpm from 8:00 to 12:00 (' + (d.fire.flow / GPM).toFixed(3) + ' gpm)');

	// the hand-made run
	L.importInp({ name: 'Net1-fire.inp', _text: handMadeInp('22', 2000, 4, 5, 13, 200) });
	L.setEngine('epanet');
	const hand = await L.analysisRun();
	const handModel = L.assembleModel();
	check(hand && hand.ok && hand.frames.length === 25, 'the hand-made copy ran (' + (hand && hand.frames.length) + ' steps)');
	// the tool's own run, rebuilt from a fresh Net1
	openLwn();
	const m0 = L.assembleModel();
	const built = EC.lpnDurFireModel(m0, { nodeId: '22', flow: 2000 * GPM, start: 8 * 3600, duration: 4 * 3600 });
	check(built.ok, 'the model builder accepted it');
	const tool = await EC.lpnEpanetRun(built.model, {});
	const none = await L.analysisRun();
	const ids = m0.nodes.map((n) => n.id);
	const pd = maxDiff(framesOf(tool), framesOf(hand), 'pressures', ids);
	const hd = maxDiff(framesOf(tool), framesOf(hand), 'heads', ids);
	const tank = m0.nodes.find((n) => n.type === 'tank').id;
	const ld = maxDiff(framesOf(tool), framesOf(hand), 'levels', [tank]);
	check(pd.worst < 1e-6, 'every pressure at every step equals the hand-made run (worst ' + pd.worst.toExponential(2) + ' m at ' + pd.where + ')');
	check(hd.worst < 1e-6, 'every head equals it (worst ' + hd.worst.toExponential(2) + ')');
	check(ld.worst < 1e-6, 'and tank ' + tank + "'s level (worst " + ld.worst.toExponential(2) + ' m)');
	const nd = maxDiff(framesOf(none), framesOf(hand), 'levels', [tank]);
	check(nd.worst > 0.05, 'the fire matters: the tank differs from the run without it by up to ' + (nd.worst / 0.3048).toFixed(2) + ' ft');

	head('2. THE BOX\'S ANSWER IS THE NUMBERS ON THE HAND-MADE RUN');
	let lo = null, loFire = null;
	const junc = handModel.nodes.filter((n) => n.type === 'junction').map((n) => n.id);
	hand.frames.forEach((f) => {
		junc.forEach((id) => { if (!lo || f.pressures[id] < lo.p) { lo = { id, p: f.pressures[id], t: f.t }; } });
		if (f.t >= 8 * 3600 && f.t < 12 * 3600 && (!loFire || f.pressures['22'] < loFire.p)) { loFire = { p: f.pressures['22'], t: f.t }; }
	});
	check(d.lowest.id === lo.id && d.lowest.t === lo.t && Math.abs(d.lowest.pressure - lo.p) < 1e-6,
		'lowest pressure anywhere: junction ' + d.lowest.id + ' at ' + EC.lpnFormatTime(d.lowest.t) + ', ' + (d.lowest.pressure / PSI).toFixed(2) + ' psi (hand-made: ' + lo.id + ' ' + (lo.p / PSI).toFixed(2) + ' psi)');
	check(d.lowestAtFire && d.lowestAtFire.t === loFire.t && Math.abs(d.lowestAtFire.pressure - loFire.p) < 1e-6,
		'lowest at the fire junction during the fire: ' + (d.lowestAtFire.pressure / PSI).toFixed(2) + ' psi at ' + EC.lpnFormatTime(d.lowestAtFire.t));
	check(d.holds === (loFire.p >= 20 * PSI), 'the residual test (20 psi) agrees: ' + (d.holds ? 'holds' : 'fails'));
	check(d.series.length === 25 && d.series.every((r, i) => Math.abs(r.pressure - hand.frames[i].pressures['22']) < 1e-6), 'the fire junction pressure series is the hand-made run at all 25 steps');
	check(d.series.filter((r) => r.fire).map((r) => EC.lpnFormatTime(r.t)).join(' ') === '8:00 9:00 10:00 11:00', 'the fire is marked on 8:00 to 11:00');
	const tk = d.tanks[0];
	let tkLow = null;
	hand.frames.forEach((f) => { if (!tkLow || f.levels[tank] < tkLow.v) { tkLow = { v: f.levels[tank], t: f.t }; } });
	check(tk.id === tank && Math.abs(tk.lowest.level - tkLow.v) < 1e-6 && tk.lowest.t === tkLow.t, 'tank ' + tank + ' lowest level ' + (tk.lowest.level / 0.3048).toFixed(2) + ' ft at ' + EC.lpnFormatTime(tk.lowest.t));
	const lastH = hand.frames[hand.frames.length - 1], lastN = none.frames[none.frames.length - 1];
	check(Math.abs(tk.final - lastH.levels[tank]) < 1e-6 && Math.abs(tk.finalNoFire - lastN.levels[tank]) < 1e-6, 'level at the end, with and without the fire, equal the two runs');
	let worst = 0; junc.concat([tank]).forEach((id) => { worst = Math.max(worst, Math.abs(lastH.pressures[id] - lastN.pressures[id])); });
	check(d.recovery && Math.abs(d.recovery.worst.diff - worst) < 1e-6 && d.recovery.recovered === (worst <= 0.1),
		'recovery: the largest difference at 24:00 is ' + (worst / PSI).toFixed(3) + ' psi, ' + (d.recovery.recovered ? 'recovered' : 'not recovered'));

	head('3. THE SCENARIO\'S DEMAND MULTIPLIER DOES NOT SCALE THE FIRE');
	openLwn();
	L.setDm(2);
	L.setSelectionList([{ kind: 'node', id: '22' }]);
	await L.runDurationFire();
	const dm2 = L.durRun();
	const mDm = L.assembleModel();
	const bDm = EC.lpnDurFireModel(mDm, { nodeId: '22', flow: 2000 * GPM, start: 8 * 3600, duration: 4 * 3600 });
	const rDm = await EC.lpnEpanetRun(bDm.model, {});
	L.importInp({ name: 'Net1-fire.inp', _text: handMadeInp('22', 2000, 4, 5, 13, 200).replace(/Demand Multiplier\s+1\.0/, 'Demand Multiplier 2.0') });
	L.setEngine('epanet');
	const hDm = await L.analysisRun();
	// in the hand-made file the multiplier also doubles the fire (EPANET's rule); halve it there
	const hDm2 = await (async () => {
		L.importInp({ name: 'Net1-fire.inp', _text: handMadeInp('22', 1000, 4, 5, 13, 200).replace(/Demand Multiplier\s+1\.0/, 'Demand Multiplier 2.0') });
		L.setEngine('epanet');
		return L.analysisRun();
	})();
	const dd = maxDiff(framesOf(rDm), framesOf(hDm2), 'pressures', ids);
	check(dm2 && dm2.ok && dd.worst < 1e-6, 'at a multiplier of 2 the fire is still 2000 gpm: equals a hand-made file that states 1000 gpm under the same multiplier (worst ' + dd.worst.toExponential(2) + ')');
	check(maxDiff(framesOf(rDm), framesOf(hDm), 'pressures', ids).worst > 1e-3, 'and a hand-made file that states 2000 gpm under that multiplier is a different, larger fire');
	L.setDm(1);

	head('4. A FIRE THAT EMPTIES THE TANK');
	openLwn();
	L.setSelectionList([{ kind: 'node', id: '22' }]);
	L.setAsk('required', '9000');
	L.setAsk('durStart', String(2 * 3600));
	L.setAsk('durLen', '20:00');
	await L.runDurationFire();
	const big = L.durRun();
	const bigModel = EC.lpnDurFireModel(L.assembleModel(), { nodeId: '22', flow: 9000 * GPM, start: 2 * 3600, duration: 20 * 3600 });
	const bigRun = await EC.lpnEpanetRun(bigModel.model, {});
	const emp = EC.lpnEpsTankEmptyAt(bigRun.frames, L.assembleModel(), null);
	check(!!emp && big.emptyAt && big.emptyAt.t === emp.t && big.emptyAt.id === emp.id, 'the tank empties at ' + (big.emptyAt ? EC.lpnFormatTime(big.emptyAt.t) : 'never') + '; an independent read of the run says ' + (emp ? EC.lpnFormatTime(emp.t) : 'never'));
	check(!big.lowest || big.lowest.t < big.emptyAt.t, 'the lowest pressure is read only before it empties');

	head('5. REFUSALS');
	openLwn();
	L.setAsk('required', '2000');
	L.setAsk('durStart', String(8 * 3600));
	L.setAsk('durLen', '4:00');
	L.setSelectionList([]);
	await L.runDurationFire();
	check(L.durRun() === null, 'no junction selected: no result');
	L.setSelectionList([{ kind: 'node', id: '22' }]);
	L.setAsk('durLen', '3:00');
	await L.runDurationFire();
	check(L.durRun() === null, 'a duration of 3:00 on a 2:00 pattern step: refused, not rounded');
	L.setAsk('durLen', '2:00');
	L.setAsk('durStart', String(9 * 3600));
	await L.runDurationFire();
	check(L.durRun() === null, 'a start of 9:00 on a 2:00 pattern step: refused');
	const m = L.assembleModel();
	check(EC.lpnDurFireModel(m, { nodeId: '2', flow: 1, start: 0, duration: 7200 }).code === 'not-junction', 'a tank is not a junction');
	check(EC.lpnDurFireModel(m, { nodeId: '22', flow: 1, start: 30 * 3600, duration: 7200 }).code === 'outside-the-run', 'a start after the run ends is refused');
	const copyBefore = JSON.stringify(m.nodes.find((n) => n.id === '22')) + JSON.stringify(m.time.patterns);
	EC.lpnDurFireModel(m, { nodeId: '22', flow: 0.1, start: 0, duration: 7200 });
	check(copyBefore === JSON.stringify(m.nodes.find((n) => n.id === '22')) + JSON.stringify(m.time.patterns), 'the model it was handed is unchanged');

	console.log(failures ? '\n' + failures + ' FAILED' : '\nall duration fire checks passed');
	process.exit(failures ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(2); });
