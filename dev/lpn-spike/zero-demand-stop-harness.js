// A RUN THAT STOPS ON A FULL TANK WITH NO WATER MOVING SAYS WHICH LINK, WHICH TANK AND WHICH NODES
// (R-402). Run with:
//   node dev/lpn-spike/zero-demand-stop-harness.js
//
// Tom, 2026-10-15, on his Fotobi project: "The patterns were intended to be all 0 except the time
// of use. But since that caused problems, I tried all 0.001 and 0.0001. It seems to me that the
// solver should be smart enough to handle 0." fixtures/zero-demand-full-tank.epp is the north-west
// system of that project as his "1-hr drain w pump off" scenario has it: pump and well switched
// off, the tank starting at its maximum level, pipes with minor losses, and a demand pattern of 0
// in every hour but one.
//
// What it holds, with the real engine (js/vendor/epanet-js.js):
//   1. The run stops at 0:00 with EPANET's Error 110, and the result names the link EPANET had
//      just closed (L11), the full tank at its end (T-NW) and the nodes it then could not solve.
//   2. Stock EPANET stops identically on the .inp this page writes, run straight through the
//      engine with none of our code between: the stop is the engine's, not our input.
//   3. The two ways out the message offers are true: every 0 at 0.0001 runs the whole period, and
//      so does the tank starting 0.01 ft below its maximum. Neither is applied by the page.
//   4. The sentence shown is the full-tank one, filled with those ids; an empty tank and no tank
//      get their own sentences; no cut named, no sentence. A tank run dry (fixtures/fotobi-topology.epp)
//      is read as empty from the real engine.
//   5. The report reader: a stop part-way through ("changed from open to temporarily closed" at
//      8:02:24) is read at its own clock; a report without Error 110 names nothing.
//
// Mutations this must catch: cutOff not attached in failed(); tankStatesNow() reading the wrong
// level (no 'full'); refusedText() not calling cutOffText(); the reader taking a closure from an
// earlier clock than the stop.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
['log', 'warn', 'error'].forEach((k) => {
	const f = console[k].bind(console);
	console[k] = (...a) => { if (typeof a[0] === 'string' && a[0].indexOf('epanet-js (') === 0) { return; } f(...a); };
});

const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');

const L = loadLoopedNetwork(EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; }, assembleModel: assembleModel, switchScenario: switchScenario,\n" +
	"\t\tscenarios: function () { return scenarios; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas'); world = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); },\n");
const EC = global.EngCalcs;
const PC = EC.pageConfig;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const FIXTURE = JSON.parse(fs.readFileSync(__dirname + '/fixtures/zero-demand-full-tank.epp', 'utf8'));

function open(mutate) {
	const j = JSON.parse(JSON.stringify(FIXTURE));
	if (mutate) { mutate(j); }
	L.applySaved(L.acceptImportedText(JSON.stringify(j)));
	L.buildDom();
	L.applyMethodUI();
	return L.assembleModel();
}

(async function () {
	setUnitSet('us');
	L.buildLayers();
	await warmEpanet();

	console.log('\n--- 1. the run stops, and says where ---');
	let model = open();
	const run = await EC.lpnEpanetRun(model);
	ok('EPANET stops the run', run.ok === false && run.refused === true, JSON.stringify(run.engineError));
	ok('...with Error 110', /\b110\b/.test(run.engineError || ''));
	ok('...in EPANET\'s words, the code stated once', run.engineError === 'Error 110: cannot solve network hydraulic equations',
		JSON.stringify(run.engineError));
	ok('...at 0:00', run.stoppedAt === 0, run.stoppedAt);
	const c = run.cutOff || {};
	ok('the result names the link EPANET had just closed', c.link === 'L11', JSON.stringify(c));
	ok('...the tank at its end, standing full', c.tank === 'T-NW' && c.tankState === 'full');
	ok('...and the nodes it then could not solve, as EPANET lists them',
		Array.isArray(c.nodes) && c.nodes.indexOf('J-NW-S-3') >= 0, JSON.stringify(c.nodes));

	console.log('\n--- 2. stock EPANET on the same input ---');
	const inp = EC.lpnToInp(model, { eps: true }).inp;
	ok('the input states the zero multipliers as written', /\n P1 {2}0 {2}0 {2}0/.test(inp));
	const mod = await EC.lpnEpanetLoad();
	const ws = new mod.Workspace();
	await ws.loadModule();
	ws.writeFile('z.inp', inp);
	const p = new mod.Project(ws);
	let stockErr = null, steps = 0;
	try {
		p.open('z.inp', 'z.rpt', 'z.out');
		p.openH(); p.initH(0);
		do { p.runH(); steps++; } while (p.nextH() > 0);
	} catch (e) { stockErr = String(e.message || e); }
	ok('the engine alone stops on it too, with Error 110', stockErr !== null && /\b110\b/.test(stockErr), stockErr);

	console.log('\n--- 3. the two ways out the message offers ---');
	model = open((j) => { j.patterns[0].multipliers = j.patterns[0].multipliers.map((m) => (m === 0 ? 0.0001 : m)); });
	let r = await EC.lpnEpanetRun(model);
	ok('a demand slightly above zero runs the whole period', r.ok === true && r.frames.length === 25 && r.converged === true,
		JSON.stringify({ ok: r.ok, n: (r.frames || []).length, conv: r.converged }));
	model = open((j) => { j.nodes.forEach((n) => { if (n.type === 'tank') { n._level = n.maxLevel - 0.01; } }); });
	r = await EC.lpnEpanetRun(model);
	ok('a tank level 0.01 ft below its maximum runs the whole period', r.ok === true && r.frames.length === 25 && r.converged === true,
		JSON.stringify({ ok: r.ok, n: (r.frames || []).length, conv: r.converged }));

	console.log('\n--- 4. the sentence ---');
	const ids = c.nodes.join(', ');
	ok('the full-tank sentence, filled with the ids',
		EC.lpnTimeCutOffTextForTest(run) === ' ' + PC.lpn_time_run_cut_off_full.replace('{tank}', 'T-NW').replace('{link}', 'L11').replace('{nodes}', ids));
	ok('an empty tank has its own sentence',
		EC.lpnTimeCutOffTextForTest({ cutOff: { link: 'P9', tank: 'T1', tankState: 'empty', nodes: ['J1'] } }) ===
			' ' + PC.lpn_time_run_cut_off_empty.replace('{tank}', 'T1').replace('{link}', 'P9').replace('{nodes}', 'J1'));
	ok('no tank at the closed link: the plain sentence',
		EC.lpnTimeCutOffTextForTest({ cutOff: { link: 'P9', tank: null, tankState: null, nodes: ['J1', 'J2'] } }) ===
			' ' + PC.lpn_time_run_cut_off.replace('{link}', 'P9').replace('{nodes}', 'J1, J2'));
	ok('the run box and status line carry it, after "stopped at" and before EPANET\'s own words',
		EC.lpnTimeRefusedTextForTest(run) === PC.lpn_time_run_stopped.replace('{time}', EC.lpnTimeElapsedText(0)) +
			EC.lpnTimeCutOffTextForTest(run) + ' ' + PC.lpn_engine_refused_why.replace('{message}', run.engineError));
	ok('no cut named: no sentence', EC.lpnTimeCutOffTextForTest({ cutOff: null }) === '');
	ok('every key reached the page', ['lpn_time_run_cut_off', 'lpn_time_run_cut_off_full', 'lpn_time_run_cut_off_empty']
		.every((k) => typeof PC[k] === 'string' && PC[k].indexOf('{link}') >= 0 && PC[k].indexOf('{nodes}') >= 0));

	console.log('\n--- 4b. an empty tank, from the real engine ---');
	// fixtures/fotobi-topology.epp, "Tanks run dry": both tanks drain, the pipes beside them close
	// earlier in the run, and at the stop EPANET names the link only in its disconnection warning.
	L.applySaved(L.acceptImportedText(fs.readFileSync(__dirname + '/fixtures/fotobi-topology.epp', 'utf8')));
	L.buildDom(); L.applyMethodUI();
	const dry = L.scenarios().filter((s) => /run dry/i.test(s.name))[0];
	L.switchScenario(dry.id);
	const dr = await EC.lpnEpanetRun(L.assembleModel());
	const dc = dr.cutOff || {};
	ok('a tank run dry: stopped part-way, the link and the empty tank named',
		dr.ok === false && dr.partial === true && dc.link === 'L22' && dc.tank === 'T-NE' && dc.tankState === 'empty', JSON.stringify(dc));
	ok('...with the nodes EPANET lists as disconnected', Array.isArray(dc.nodes) && dc.nodes.length === 6, JSON.stringify(dc.nodes));

	console.log('\n--- 5. the report reader ---');
	const MID = [
		'     7:06:00: Pipe L11 changed from open to temporarily closed',
		'     7:30:00: Pipe L22 changed from temporarily closed to open',
		'     8:00:00: Balanced after 1 trials',
		'     8:02:24: System ill-conditioned at node J-NW-S-3',
		'     8:02:24: Pipe L12 changed from open to temporarily closed',
		'  Error 110: cannot solve network hydraulic equations'
	].join('\n');
	const mm = { links: [{ id: 'L12', from: 'T-NW', to: 'J2' }, { id: 'L11', from: 'T-NE', to: 'J9' }] };
	const mc = EC.lpnRunCutOff(MID, mm, { 'T-NW': 'full', 'T-NE': 'full' }) || {};
	ok('a stop part-way is read at its own clock, not at an earlier closure', mc.link === 'L12', JSON.stringify(mc));
	ok('...naming the node EPANET could not solve where it lists none disconnected',
		JSON.stringify(mc.nodes) === '["J-NW-S-3"]');
	ok('...and the tank at that link', mc.tank === 'T-NW' && mc.tankState === 'full');
	ok('a report with no Error 110 names nothing', EC.lpnRunCutOff(MID.replace('Error 110', 'Error 200'), mm, {}) === null);

	console.log(fails ? '\n' + fails + ' FAILED' : '\nALL OK');
	process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
