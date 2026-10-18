// THE SHIPPED SCENARIO EXAMPLE (Net1-Scenarios.lwn) -- Ida's wish list, rank 1, 2026-10-08.
//   node dev/lpn-spike/scenario-example-harness.js
//
// The Scenario manager had nothing to show: every shipped example had one scenario. This example is
// Net1 with five scenarios under Base, built by dev/scripts/build_scenario_example.js out of the
// page's own scenario code. What is asserted, headless, through the real open path:
//   1. the tree: Base; Peak hour > Peak hour with main break; Max day > Max day plus fire flow >
//      Max day plus fire flow with main break (depth 3, so a grandchild inherits twice);
//   2. one stored alternative is named by TWO scenarios (the main break); Peak hour and Max day are
//      ONE override each, the demand multiplier (no junction is rewritten); the fire flow is the one
//      Demand alternative, holding junction 23 alone;
//   3. every scenario solves and converges in BOTH engines, and the two engines agree to 0.5 psi
//      on every junction (EPANET and the built-in solver use the same Hazen-Williams constants here);
//   4. the engineering: multipliers are 2.25 and 1.5, the fire flow is 1,500 gpm on top of
//      Max day at junction 23 (entered as 1,150, because the multiplier scales it too), the fire pulls junction 23 below Max day, the grandchild keeps the
//      fire demand it inherited, and the main break lowers junction 22's pressure below Max day plus
//      fire flow's own.
//   5. opening and re-saving the file is byte-stable in its scenario blocks (nothing is lost).
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

const L = loadLoopedNetwork(EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; }, getScenarios: function () { return scenarios; },\n" +
	"\t\tsettings: function () { return settings; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tswitchScenario: switchScenario, scenarioDemandMultiplier: scenarioDemandMultiplier, effective: effective, runSolve: runSolve,\n" +
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
	const NAMES = ['Peak hour', 'Peak hour with main break', 'Max day', 'Max day plus fire flow', 'Max day plus fire flow with main break'];

	console.log('--- 1. the tree');
	ok('six scenarios: Base and the five', scns.length === 6 && NAMES.every((n) => byName[n]), scns.map((s) => s.name).join(' | '));
	const par = (n) => byName[n].parent || null;
	ok('Peak hour and Max day are Base\'s children', par('Peak hour') === null && par('Max day') === null);
	ok('Peak hour with main break is under Peak hour', par('Peak hour with main break') === byName['Peak hour'].id);
	ok('Max day plus fire flow is under Max day', par('Max day plus fire flow') === byName['Max day'].id);
	ok('the main break with fire flow is under Max day plus fire flow (a grandchild of Max day)',
		par('Max day plus fire flow with main break') === byName['Max day plus fire flow'].id);

	console.log('--- 2. the alternatives');
	const alts = doc.alternatives || [];
	const used = {};
	scns.forEach((s) => Object.keys(s.alternatives || {}).forEach((c) => { (used[s.alternatives[c]] = used[s.alternatives[c]] || []).push(s.name); }));
	const brk = alts.filter((a) => a.category === 'topology')[0];
	ok('one Active topology alternative, "Main break, pipe 112 closed"', alts.filter((a) => a.category === 'topology').length === 1 && brk && brk.name === 'Main break, pipe 112 closed');
	ok('...named by exactly two scenarios, one under each branch',
		brk && (used[brk.id] || []).length === 2 && used[brk.id].indexOf('Peak hour with main break') >= 0 && used[brk.id].indexOf('Max day plus fire flow with main break') >= 0, JSON.stringify(used[brk && brk.id]));
	ok('...and it closes pipe 112 only', brk && JSON.stringify(brk.values) === JSON.stringify({ 'l:112': { active: false } }), JSON.stringify(brk && brk.values));
	const calcs = doc.calcSets || [];
	ok('no Demand alternative rewrites junctions for Peak hour or Max day: the only Demand alternative holds junction 23 alone',
		alts.filter((a) => a.category === 'demand').length === 1 && JSON.stringify(Object.keys(alts.filter((a) => a.category === 'demand')[0].values)) === '["n:23"]');
	ok('Peak hour and Max day each hold one Calculation override, the demand multiplier, and nothing else',
		calcs.length === 2 && ['Peak hour', 'Max day'].every((n) => { const c = calcs.filter((x) => x.id === byName[n].calc)[0]; return c && Object.keys(c).filter((k) => ['settings', 'times'].indexOf(k) >= 0).length === 0 && typeof c.demandMultiplier === 'number'; }));
	ok('...and neither scenario holds a junction demand override of its own',
		['Peak hour', 'Max day'].every((n) => Object.keys(byName[n].overrides || {}).length === 0 && !byName[n].alternatives));

	console.log('--- 3. the numbers a person reads');
	const node = (id) => doc.nodes.filter((n) => n.id === id)[0];
	const link = (id) => doc.links.filter((l) => l.id === id)[0];
	const base = scns.filter((s) => s.isBase)[0];
	// The demand the solver is given: the junction's value times the scenario's multiplier.
	const demand = (scn, id) => { L.switchScenario(scn.id); const m = L.scenarioDemandMultiplier(); return L.effective(node(id), 'demand') * (m === undefined ? 1 : m); };
	const J = ['11', '12', '13', '21', '22', '23', '31', '32'];
	ok('Peak hour multiplier is 2.25, and every junction demand is 2.25 times Base', byName['Peak hour'] && (L.switchScenario(byName['Peak hour'].id), L.scenarioDemandMultiplier() === 2.25) && J.every((j) => demand(byName['Peak hour'], j) === 2.25 * demand(base, j)));
	ok('Max day multiplier is 1.5, and every junction demand is 1.5 times Base', (L.switchScenario(byName['Max day'].id), L.scenarioDemandMultiplier() === 1.5) && J.every((j) => demand(byName['Max day'], j) === 1.5 * demand(base, j)));
	ok('Max day plus fire flow inherits the 1.5 multiplier (the child holds none)', (L.switchScenario(byName['Max day plus fire flow'].id), L.scenarioDemandMultiplier() === 1.5) && !byName['Max day plus fire flow'].calc);
	ok('...the multiplier also scales junction 23\'s own entry, so 1,150 gpm gives Max day plus exactly 1,500 gpm of fire flow',
		demand(byName['Max day plus fire flow'], '23') === demand(byName['Max day'], '23') + 1500 &&
		J.filter((j) => j !== '23').every((j) => demand(byName['Max day plus fire flow'], j) === demand(byName['Max day'], j)));
	ok('the grandchild inherits the multiplier and the fire demand (1,725 gpm at junction 23)', demand(byName['Max day plus fire flow with main break'], '23') === 1725);
	L.switchScenario(byName['Max day plus fire flow with main break'].id);
	ok('...and pipe 112 is out of service there', L.effective(link('112'), 'active') === false);
	L.switchScenario(base.id);
	ok('...and in service in Base', L.effective(link('112'), 'active') !== false);

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

	console.log('--- 5. the engineering');
	for (const eng of ['native', 'epanet']) {
		const p = (s, j) => psi(eng, s, j);
		console.log('       ' + eng + ' J23 psi: Base ' + p('Base', '23').toFixed(1) + ', Peak ' + p('Peak hour', '23').toFixed(1) + ', Max day ' + p('Max day', '23').toFixed(1) +
			', fire ' + p('Max day plus fire flow', '23').toFixed(1) + ', fire+break ' + p('Max day plus fire flow with main break', '23').toFixed(1));
		ok(eng + ': more demand, lower pressure (Peak hour below Base at junction 23)', p('Peak hour', '23') < p('Base', '23'));
		ok(eng + ': the fire pulls junction 23 below Max day by more than 5 psi', p('Max day', '23') - p('Max day plus fire flow', '23') > 5);
		ok(eng + ': the main break lowers junction 23 further in the fire scenario', p('Max day plus fire flow with main break', '23') < p('Max day plus fire flow', '23'));
		ok(eng + ': the main break lowers junction 22 in the peak hour scenario', p('Peak hour with main break', '22') < p('Peak hour', '22'));
		ok(eng + ': Max day plus fire flow keeps junction 23 above 20 psi (the usual fire-flow floor)', p('Max day plus fire flow', '23') >= 20);
	}

	console.log('--- 6. a re-save loses no scenario');
	L.switchScenario(base.id);
	const out = JSON.parse(JSON.stringify(L.serializeProject()));
	const orig = JSON.parse(text);
	ok('scenarios round-trip', JSON.stringify(out.scenarios) === JSON.stringify(orig.scenarios));
	ok('alternatives round-trip', JSON.stringify(out.alternatives) === JSON.stringify(orig.alternatives));
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
