// THE SHIPPED SCENARIO EXAMPLE (Net1-Scenarios.lwn) -- Ida's wish list, rank 1, 2026-10-08.
//   node dev/lpn-spike/scenario-example-harness.js
//
// The Scenario manager had nothing to show: every shipped example had one scenario. This example is
// Net1 with four scenarios under Base, built by dev/scripts/build_scenario_example.js out of the
// page's own scenario code. What is asserted, headless, through the real open path:
//   1. the tree: Base; Max day > Max day with main break; Peak hour > Peak hour with main break;
//   2. Max day and Peak hour are ONE override each, the demand multiplier (1.5, 2.25); no junction
//      demand is overridden anywhere and no Demand alternative exists;
//   3. one stored Active topology alternative (pipe 112 closed) is named by TWO scenarios;
//   4. every scenario solves and converges in BOTH engines, the engines agree to 0.5 psi, more demand
//      gives lower pressure, and the main break lowers pressure again;
//   5. the Fire flow analysis (Tom's rule: fire flow is added on top of the multiplied demand, never
//      multiplied itself) run in Max day at junction 23 draws 1.5 x base + 1,500 gpm there, in the
//      open scenario, and the main break lowers its residual pressure;
//   6. opening and re-saving the file loses no scenario.
'use strict';
const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork, settleEpanet, warmEpanet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');
global.confirm = global.window.confirm = function () { return true; };
global.alert = global.window.alert = function () {};
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
if (!global.EngCalcs.lpnGeorefToLonLat) { require(ROOT + 'js/lpn-georef.js'); }
require(ROOT + 'js/lpn-fireflow.js');

const L = loadLoopedNetwork(EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; }, getScenarios: function () { return scenarios; },\n" +
	"\t\tsettings: function () { return settings; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tswitchScenario: switchScenario, scenarioDemandMultiplier: scenarioDemandMultiplier, effective: effective, runSolve: runSolve,\n" +
	"\t\tassembleModel: assembleModel,\n" +
	"\t\tlastResult: function () { return lastSolveResult; }, serializeProject: serializeProject,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas'); world = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world); linksLayer = el('g', {}, world);\n" +
	"\t\t\tnodesLayer = el('g', {}, world); labelsLayer = el('g', {}, world); rubberBandEl = el('line', {}, world); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h; },\n");

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

async function solved() { L.runSolve(); await settleEpanet(); return L.lastResult(); }

(async function main() {
	setUnitSet('us');
	L.buildLayers(); L.setCanvas(1000, 700); L.seedDefaultInputs();
	await warmEpanet();
	const text = fs.readFileSync(path.join(ROOT, 'examples/Net1-Scenarios.lwn'), 'utf8');
	const saved = L.acceptImportedText(text);
	ok('the shipped file opens through the real import path', !!saved);
	L.applySaved(saved); L.buildDom(); L.applyMethodUI();
	const scns = L.getScenarios(), doc = L.getDoc();
	const byName = {}; scns.forEach((s) => { byName[s.name] = s; });
	const NAMES = ['Max day', 'Max day with main break', 'Peak hour', 'Peak hour with main break'];
	const base = scns.filter((s) => s.isBase)[0];

	console.log('--- 1. the tree');
	ok('five scenarios: Base and the four', scns.length === 5 && NAMES.every((n) => byName[n]), scns.map((s) => s.name).join(' | '));
	const par = (n) => byName[n].parent || null;
	ok('Max day and Peak hour are Base\'s children', par('Max day') === null && par('Peak hour') === null);
	ok('each main break is the child of its own scenario', par('Max day with main break') === byName['Max day'].id && par('Peak hour with main break') === byName['Peak hour'].id);

	console.log('--- 2. one multiplier override each, nothing else');
	const calcs = doc.calcSets || [];
	const calcOf = (n) => calcs.filter((x) => x.id === byName[n].calc)[0];
	ok('Max day holds the multiplier 1.5 and Peak hour 2.25, each in a Calculation set with nothing else',
		['Max day', 'Peak hour'].every((n) => { const c = calcOf(n); return c && Object.keys(c).filter((k) => ['settings', 'times'].indexOf(k) >= 0).length === 0; }) &&
		calcOf('Max day').demandMultiplier === 1.5 && calcOf('Peak hour').demandMultiplier === 2.25 && calcs.length === 2);
	const alts = doc.alternatives || [];
	ok('no scenario holds any element override, and there is no Demand alternative',
		scns.every((s) => Object.keys(s.overrides || {}).length === 0) && alts.every((a) => a.category !== 'demand'));
	const node = (id) => doc.nodes.filter((n) => n.id === id)[0];
	const link = (id) => doc.links.filter((l) => l.id === id)[0];
	const J = ['11', '12', '13', '21', '22', '23', '31', '32'];
	const demand = (scn, id) => { L.switchScenario(scn.id); const m = L.scenarioDemandMultiplier(); return L.effective(node(id), 'demand') * (m === undefined ? 1 : m); };
	ok('the demand the solver gets is 1.5 times Base in Max day and 2.25 times in Peak hour at every junction',
		J.every((j) => demand(byName['Max day'], j) === 1.5 * demand(base, j) && demand(byName['Peak hour'], j) === 2.25 * demand(base, j) &&
			demand(byName['Max day with main break'], j) === 1.5 * demand(base, j)));

	console.log('--- 3. the shared alternative');
	const brk = alts.filter((a) => a.category === 'topology')[0];
	const used = {};
	scns.forEach((s) => Object.keys(s.alternatives || {}).forEach((c) => { (used[s.alternatives[c]] = used[s.alternatives[c]] || []).push(s.name); }));
	ok('one Active topology alternative, "Main break, pipe 112 closed"', alts.length === 1 && brk && brk.name === 'Main break, pipe 112 closed');
	ok('...named by exactly the two main-break scenarios', brk && (used[brk.id] || []).sort().join('|') === 'Max day with main break|Peak hour with main break', JSON.stringify(used[brk && brk.id]));
	ok('...and it closes pipe 112 only', brk && JSON.stringify(brk.values) === JSON.stringify({ 'l:112': { active: false } }));
	L.switchScenario(byName['Peak hour with main break'].id);
	ok('pipe 112 is out of service in a main-break scenario', L.effective(link('112'), 'active') === false);
	L.switchScenario(byName['Max day'].id);
	ok('...and in service in Max day', L.effective(link('112'), 'active') !== false);

	console.log('--- 4. every scenario solves in both engines');
	const P = { native: {}, epanet: {} };
	for (const eng of ['native', 'epanet']) {
		L.settings().engine = eng;
		for (const s of [base].concat(NAMES.map((n) => byName[n]))) {
			L.switchScenario(s.id);
			const r = await solved();
			const label = eng + ' / ' + s.name;
			ok(label + ' converges', !!r && r.converged === true, JSON.stringify(r && r.issues));
			ok(label + ' was solved by ' + (eng === 'epanet' ? 'EPANET' : 'native'), !!r && (eng === 'epanet' ? r.engine === 'epanet' : !r.engine), r && r.engine);
			P[eng][s.name] = r && r.pressures;
		}
	}
	const PSI = 1.4233; // psi per metre of head; the result is in SI
	const psi = (eng, scn, id) => P[eng][scn][id] * PSI;
	let worst = 0;
	for (const s of Object.keys(P.native)) { J.forEach((j) => { worst = Math.max(worst, Math.abs(psi('native', s, j) - psi('epanet', s, j))); }); }
	ok('the two engines agree to 0.5 psi at every junction of every scenario', worst < 0.5, worst.toFixed(3) + ' psi');
	for (const eng of ['native', 'epanet']) {
		const p = (s, j) => psi(eng, s, j);
		console.log('       ' + eng + ' J23 psi: Base ' + p('Base', '23').toFixed(1) + ', Max day ' + p('Max day', '23').toFixed(1) + ', Max day with main break ' +
			p('Max day with main break', '23').toFixed(1) + ', Peak hour ' + p('Peak hour', '23').toFixed(1) + ', Peak hour with main break ' + p('Peak hour with main break', '23').toFixed(1));
		ok(eng + ': more demand, lower pressure at junction 23 (Base, Max day, Peak hour)', p('Base', '23') > p('Max day', '23') && p('Max day', '23') > p('Peak hour', '23'));
		ok(eng + ': the main break lowers junction 22 in both branches', p('Max day with main break', '22') < p('Max day', '22') && p('Peak hour with main break', '22') < p('Peak hour', '22'));
	}

	console.log('--- 5. Fire flow analysis at junction 23, 1,500 gpm, in Max day');
	const EC = global.EngCalcs, gpm = EC.lpnFireFlowGpmToSI;
	const sweep = async (scn) => {
		L.switchScenario(scn.id);
		const model = L.assembleModel();
		const set = await EC.lpnFireFlowSweep(model, { solve: (m) => EC.lpnSolve(m, { tol: 1e-9, maxIter: 400 }), junctions: ['23'], required: gpm(1500), yield: () => Promise.resolve() });
		return { model, rec: set.byId['23'] };
	};
	const md = await sweep(byName['Max day']);
	const n23 = md.model.nodes.filter((n) => n.id === '23')[0];
	ok('the open scenario hands the analysis 1.5 x 150 = 225 gpm at junction 23', Math.abs(n23.demand - gpm(225)) < 1e-9, n23.demand / gpm(1));
	// An independent solve with the demand set by hand to 225 + 1,500 gpm.
	const hand = JSON.parse(JSON.stringify(md.model));
	hand.nodes.filter((n) => n.id === '23')[0].demand = gpm(225 + 1500);
	const ref = EC.lpnSolve(hand, { tol: 1e-9, maxIter: 400 });
	ok('the analysis returns a residual pressure at the required flow', md.rec && typeof md.rec.pressureAtRequired === 'number', JSON.stringify(md.rec && md.rec.state));
	ok('...and it is the pressure with 1.5 x base + 1,500 gpm drawn at junction 23 (the fire flow is not multiplied)',
		Math.abs(md.rec.pressureAtRequired - ref.pressures['23']) < 1e-4, md.rec.pressureAtRequired + ' vs ' + ref.pressures['23']);
	const mb = await sweep(byName['Max day with main break']);
	console.log('       fire flow at 1,500 gpm, junction 23: Max day ' + (md.rec.pressureAtRequired * PSI).toFixed(1) + ' psi, Max day with main break ' + (mb.rec.pressureAtRequired * PSI).toFixed(1) + ' psi');
	ok('the main break lowers the residual pressure at the same fire flow', mb.rec.pressureAtRequired < md.rec.pressureAtRequired);

	console.log('--- 6. a re-save loses no scenario');
	L.switchScenario(base.id);
	const out = JSON.parse(JSON.stringify(L.serializeProject()));
	const orig = JSON.parse(text);
	ok('scenarios round-trip', JSON.stringify(out.scenarios) === JSON.stringify(orig.scenarios));
	ok('alternatives and calculation sets round-trip', JSON.stringify(out.alternatives) === JSON.stringify(orig.alternatives) && JSON.stringify(out.calcSets) === JSON.stringify(orig.calcSets));
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
