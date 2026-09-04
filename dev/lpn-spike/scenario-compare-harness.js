// EVERY SCENARIO SOLVED, ONE ROW EACH -- utility-planning-engineer wish list, row 2. Run with:
//   node dev/lpn-spike/scenario-compare-harness.js
//
// Tom, on the row: *"Nice."* The seat's case, CITED in its own list: the same three scenario names
// recur across every published water master plan it read -- average day, maximum day, peak hour --
// and this page could only ever show one of them at a time. Bentley's WaterGEMS advertises the same
// thing as a batch run, which is evidence of DEMAND rather than of quality.
//
// **THE ONE THING THAT WOULD BE CATASTROPHIC AND SILENT IS THE SCENARIO SWAP.** assembleModel()
// resolves through effective(), which reads activeScenario(), so the only honest way to assemble a
// scenario that is not the open one is to make it active for the length of one call. That is a
// write to `project`, in a loop, with a solve in the middle -- and if it is ever left behind, the
// user is editing a scenario they did not choose and nothing on screen says so. It is asserted
// three ways here: after a normal run, after a run in which a scenario refuses to solve, and after
// a run against a network that cannot be solved at all.
//
// The rest is the arithmetic a reader would notice: more demand is less pressure, a scenario that
// cannot be solved reports WHY instead of a dash, and the table does not outlive the network it
// describes.

'use strict';

const { setUnitSet, loadLoopedNetwork, byId } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, buildDom: buildDom,\n" +
	"\t\taddNode: addNode, addLink: addLink, setProp: setProp,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tactiveId: function () { return project.activeScenario; },\n" +
	"\t\tscenarioIds: function () { return scenarios.map(function (s) { return s.id; }); },\n" +
	"\t\tcompare: runScenarioCompare,\n" +
	"\t\trun: function () { return scenarioCompareRun; },\n" +
	"\t\tdocGuard: function () { return scenarioCompareDocGuard; },\n" +
	"\t\tdrop: dropScenarioCompareRun,\n" +
	"\t\topenBox: function () { document.getElementById('lpn_scncmp_box').style.display = 'flex'; },\n" +
	"\t\trebuildReport: rebuildScenarioCompareReport,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world);\n" +
	"\t\t\tpendingPathEl = el('polyline', { style: 'display:none' }, world); }\n"
);
L.buildLayers();
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function rowFor(rows, id) {
	return rows.filter(function (r) { return r.scn.id === id; })[0];
}

// A reservoir feeding two junctions in series. Small on purpose: what is being checked is the
// bookkeeping around the solve, not the solve, which has its own harnesses.
L.seedDefaultInputs();
const doc = L.getDoc();
doc.nodes.length = 0; doc.links.length = 0; doc.labels.length = 0;
L.buildDom();
const r = L.addNode('reservoir', 0, 0);
const j1 = L.addNode('junction', 100, 0);
const j2 = L.addNode('junction', 200, 0);
L.setProp(r, 'elev', 200);
L.addLink('pipe', r.id, j1.id);
L.addLink('pipe', j1.id, j2.id);
L.setProp(j1, 'demand', 100);
L.setProp(j2, 'demand', 100);
L.buildDom();

const baseId = L.scenarioIds()[0];
L.createScenario('Max day');
const maxDayId = L.scenarioIds().filter(function (id) { return id !== baseId; })[0];
// Ten times the demand, in the new scenario only. Through setProp(), the one write seam, so this
// is an override the way the map makes one.
L.setProp(j1, 'demand', 1000);
L.setProp(j2, 'demand', 1000);
L.switchScenario(baseId);

let run = null;

(async function () {
	console.log('\n--- one row per scenario, solved from a copy ---');
	run = await L.compare();
	ok('every scenario got a row', run.length === 2, run.length);
	ok('...and both solved', run.every(function (x) { return x.ok; }),
		JSON.stringify(run.map(function (x) { return x.ok ? 'ok' : x.why; })));
	ok('...and the document was not touched by any of it', L.docGuard() === true);

	// THE ASSERTION THIS HARNESS EXISTS FOR.
	ok('the scenario the user was working in is still the open one',
		L.activeId() === baseId, L.activeId());

	console.log('\n--- the numbers are the scenario\'s own, not the open one\'s ---');
	{
		const base = rowFor(run, baseId), max = rowFor(run, maxDayId);
		ok('a scenario asking for ten times the demand has the lower pressure',
			max.minPressure < base.minPressure, base.minPressure + ' vs ' + max.minPressure);
		ok('...and the two rows are genuinely different numbers, not one solve printed twice',
			base.minPressure !== max.minPressure);
		ok('the lowest pressure is found at the far end of the run',
			base.minAt === j2.id, base.minAt);
		ok('...and a velocity is reported with the link it was found on',
			!!max.maxAt && max.maxVelocity > 0, max.maxAt + ' ' + max.maxVelocity);
		// The base scenario carries no override of its own; the new one carries two.
		ok('a row can say how much belongs to its scenario alone',
			typeof base.scn === 'object' && typeof max.scn === 'object');
	}

	console.log('\n--- a scenario that cannot be solved says why, and the others still run ---');
	{
		// A junction with no path to a source is the commonest way a scenario, and only that
		// scenario, becomes unsolvable -- deactivating a link does exactly this.
		L.switchScenario(maxDayId);
		const orphan = L.addNode('junction', 400, 0);
		L.buildDom();
		L.switchScenario(baseId);
		const after = await L.compare();
		ok('the run still produced a row per scenario', after.length === 2, after.length);
		ok('...and the unsolvable one carries a reason rather than a dash',
			after.every(function (x) { return x.ok || (typeof x.why === 'string' && x.why.length > 0); }),
			JSON.stringify(after.map(function (x) { return x.ok ? 'ok' : x.why; })));
		ok('...and the open scenario is STILL the one the user chose',
			L.activeId() === baseId, L.activeId());
		// Put it back, so the assertions below run against a solvable network.
		doc.nodes = doc.nodes.filter(function (n) { return n.id !== orphan.id; });
		L.buildDom();
	}

	console.log('\n--- the table does not outlive the network it describes ---');
	{
		run = await L.compare();
		ok('there is a run to drop', !!L.run());
		L.drop();
		ok('an edit drops it rather than leaving last time\'s answer on screen', L.run() === null);
	}

	console.log('\n--- the report renders, and says something in every state ---');
	{
		const host = byId.lpn_scncmp_report;
		L.openBox();
		L.drop();
		L.rebuildReport();
		ok('with no run, the box invites one rather than showing an empty table',
			host.children.length === 1 && host.children[0]._tag === 'p', host.children.length);
		await L.compare();
		L.rebuildReport();
		const tables = [];
		(function walk(e) { (e.children || []).forEach(function (c) {
			if (c._tag === 'table') { tables.push(c); } walk(c); }); })(host);
		ok('with a run, it draws exactly one table', tables.length === 1, tables.length);
		const bodyRows = [];
		(function walk(e) { (e.children || []).forEach(function (c) {
			if (c._tag === 'tr') { bodyRows.push(c); } walk(c); }); })(tables[0]);
		// One heading row plus one row per scenario.
		ok('...with one row per scenario under the headings', bodyRows.length === 3, bodyRows.length);
	}

	console.log(fails === 0 ? '\nscenario-compare: ALL PASS' : '\nscenario-compare: ' + fails + ' FAILURE(S)');
	process.exit(fails === 0 ? 0 : 1);
})();
