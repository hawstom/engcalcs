// THE PER-JUNCTION REQUIRED FIRE FLOW (ROADMAP Task 530). Run with:
//   node dev/lpn-spike/fireflow-required-harness.js
//
// dev/lpn-spike/fireflow-harness.js proves the sweep's arithmetic and fireflow-box-harness.js
// proves the box. This proves the one thing neither can see: that a junction may carry a required
// fire flow OF ITS OWN, that the sweep tests it against that number and everybody else against the
// run's, and that the four ways it can go wrong are all shut:
//
//   1. THE NUMBER IS THE JUNCTION'S. A required fire flow comes from land use, so a residential
//      cul-de-sac and a warehouse district are two different numbers out of the same code table.
//      One number for a whole run was the simplification; this is the end of it.
//   2. BLANK FALLS BACK, and blank is the ordinary case. A junction that states nothing is tested
//      against the number in the box, exactly as every junction was before this existed.
//   3. AN OVERRIDE INSIDE A SCENARIO DOES NOT TOUCH BASE. This property goes through setProp(),
//      the one write seam (dev/scenario-seam-repair.md); a direct `n._fireFlow = ...` would edit
//      Base under every other scenario at once and still show the right number on screen.
//   4. IT IS OURS, NOT EPANET'S. Nothing in an `.inp` file says it, so the exporter must not write
//      it -- and it rides in the document, so a save and reopen must bring it back.
//
// The network is the shipped gallery example, opened the way a visitor opens it.

const { ROOT, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS, openExample } = require('./example-fixture.js');
require(ROOT + 'js/lpn-inp.js');

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; }, nodeById: nodeById,\n" +
	"\t\trunSolve: runSolve, assembleModel: assembleModel,\n" +
	"\t\teffective: effective, setProp: setProp, hasOverride: hasOverride,\n" +
	"\t\tfireFlowOwn: fireFlowOwn, fireFlowOwnCount: fireFlowOwnCount,\n" +
	"\t\tfireFlowStore: fireFlowStore,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tbaseScenarioId: function () { return baseScenario().id; },\n" +
	"\t\tserializeProject: serializeProject,\n" +
	"\t\twireFireFlowBox: wireFireFlowBox, openFireFlowBox: openFireFlowBox,\n" +
	"\t\trunFireFlowSweep: runFireFlowSweep,\n" +
	"\t\tsetAsk: function (k, v) { if (!fireFlowAsk) { fireFlowAsk = fireFlowDefaults(); } fireFlowAsk[k] = v; },\n" +
	"\t\trun: function () { return fireFlowRun; },\n" +
	"\t\ttoSI: toSI,\n" +
	// The popup, the pane and the two halves of Find and replace, read through the page's own
	// declarations rather than through a second copy of them here.
	"\t\tpaneCols: function () { var t = paneTables().filter(function (s) { return s.id === 'junctions'; })[0];\n" +
	"\t\t\treturn t.cols.map(function (c) { return c.key; }); },\n" +
	"\t\tpaneCol: function (key) { var t = paneTables().filter(function (s) { return s.id === 'junctions'; })[0];\n" +
	"\t\t\treturn t.cols.filter(function (c) { return c.key === key; })[0] || null; },\n" +
	"\t\tpopupFields: function (id) { renderNodeFields(id);\n" +
	"\t\t\treturn document.getElementById('lpn_popup_fields'); },\n" +
	"\t\treplaceFields: function () { return pushSpecList().map(function (s) { return s.field; }); },\n" +
	"\t\treplaceSpec: function (f) { return pushSpecList().filter(function (s) { return s.field === f; })[0] || null; },\n" +
	"\t\tfindProps: function (scope) { findState.scope = scope;\n" +
	"\t\t\treturn findPropDefs().map(function (r) { return r[0]; }); },\n" +
	"\t\tfindValue: function (n) { return findValueOf({ group: 'node', el: n }, 'fireFlow'); },\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name + (extra === undefined ? '' : '   ' + extra)); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function near(a, b) { return typeof a === 'number' && Math.abs(a - b) <= Math.max(1e-9, Math.abs(b) * 1e-9); }
// Every text node under an element, joined -- the popup is labels and inputs, so one walk is what
// "does the popup show this" means here.
function textOf(el) {
	if (!el) { return ''; }
	let out = el.textContent || '';
	(el.children || []).forEach(c => { out += ' ' + textOf(c); });
	return out;
}

// A number nothing else in the example can be confused with, so "is it in the exported file" is a
// question a text search can answer honestly.
const OWN_GPM = 3777;
const SCN_GPM = 6421;
const RUN_GPM = 250;

(async function () {
	setUnitSet('us');
	L.reset();
	openExample(L, 'us');
	L.wireFireFlowBox();
	L.runSolve();

	const ids = L.getDoc().nodes.filter(n => n.type === 'junction').map(n => n.id);
	ok('the example has junctions to test', ids.length >= 2, String(ids.length));
	const own = L.nodeById(ids[0]), plain = L.nodeById(ids[1]);

	console.log('\n--- the property, written through the one seam ---');
	L.setProp(own, 'fireFlow', OWN_GPM);
	ok('the junction states its own requirement, as typed', L.fireFlowOwn(own) === OWN_GPM,
		String(L.fireFlowOwn(own)));
	ok('and it is stored under the underscored name setProp() writes', own._fireFlow === OWN_GPM);
	ok('a junction that states nothing reads as undefined', L.fireFlowOwn(plain) === undefined);
	// Blank, zero and negative are ONE rule at ONE seam -- the three doors into this property answer
	// an empty box differently and none of them may mean "a requirement of zero".
	ok('blank, zero and negative all mean "states nothing"',
		L.fireFlowStore(undefined) === undefined && L.fireFlowStore(0) === undefined &&
		L.fireFlowStore(-5) === undefined && L.fireFlowStore(120) === 120);
	ok('the box can count how many carry one', L.fireFlowOwnCount() === 1,
		String(L.fireFlowOwnCount()));

	console.log('\n--- it is wired where the other junction properties are ---');
	const popup = textOf(L.popupFields(own.id));
	ok('the property popup asks for it', popup.indexOf('Required fire flow') >= 0);
	ok('in the project\'s flow unit', popup.indexOf('Required fire flow (gpm)') >= 0);
	ok('the Junctions table has a column for it', L.paneCols().indexOf('fireFlow') >= 0,
		L.paneCols().join(','));
	// The pane cell hands back +'' === 0 for a blank, which must clear rather than store a zero.
	const col = L.paneCol('fireFlow');
	ok('the column writes through the override seam', col.prop === 'fireFlow');
	col.set(plain, 0);
	ok('and an emptied cell clears it rather than storing a zero', L.fireFlowOwn(plain) === undefined);
	ok('Find offers it on junctions', L.findProps('junction').indexOf('fireFlow') >= 0,
		L.findProps('junction').join(','));
	ok('and not on reservoirs, which cannot hold one', L.findProps('reservoir').indexOf('fireFlow') < 0);
	ok('Find reads the typed number', L.findValue(own) === OWN_GPM);
	ok('Replace can write it', L.replaceFields().indexOf('fireFlow') >= 0, L.replaceFields().join(','));
	ok('and Replace writes it through setProp(), not directly',
		L.replaceSpec('fireFlow').prop === 'fireFlow');
	ok('Replace offers it on junctions only',
		L.replaceSpec('fireFlow').applies(own) === true &&
		L.replaceSpec('fireFlow').applies({ type: 'reservoir' }) === false);

	console.log('\n--- the sweep tests each junction against ITS number ---');
	L.setAsk('required', String(RUN_GPM));
	L.setAsk('design', 'off');
	L.setAsk('scope', 'all');
	await L.runFireFlowSweep();
	const set = L.run();
	ok('the sweep ran', !!set && !!set.byId, set ? 'ok' : 'null');
	// The engine speaks SI; the document speaks what the user typed. The conversion happens once, at
	// the call, which is what these two assertions are really about.
	ok('the junction with its own requirement was tested against ITS number',
		near(set.byId[own.id].required, L.toSI(OWN_GPM, 'lpn_u_flow')),
		String(set.byId[own.id].required));
	ok('every other junction fell back to the run\'s number',
		near(set.byId[plain.id].required, L.toSI(RUN_GPM, 'lpn_u_flow')),
		String(set.byId[plain.id].required));
	ok('and the two are genuinely different numbers',
		set.byId[own.id].required !== set.byId[plain.id].required);
	// The requirement is what a verdict is measured against, so a junction asked for fifteen times
	// the flow must not come back Passing on the run's easier number.
	ok('so the harder requirement is the one it is judged on',
		!(set.byId[own.id].available >= set.byId[own.id].required),
		set.byId[own.id].state);
	ok('the run left the junction\'s own number in the document untouched',
		L.fireFlowOwn(own) === OWN_GPM);

	console.log('\n--- an override inside a scenario does not touch Base ---');
	const baseId = L.baseScenarioId();
	const scn = L.createScenario('Rezoned');
	L.setProp(own, 'fireFlow', SCN_GPM);
	ok('the scenario reads its own number', L.fireFlowOwn(own) === SCN_GPM, String(L.fireFlowOwn(own)));
	ok('and it is recorded as an override, not as an edit', L.hasOverride(own, 'fireFlow'));
	ok('BASE IS UNMOVED', own._fireFlow === OWN_GPM, String(own._fireFlow));
	L.switchScenario(baseId);
	ok('and Base still reads its own number', L.fireFlowOwn(L.nodeById(own.id)) === OWN_GPM,
		String(L.fireFlowOwn(L.nodeById(own.id))));
	L.switchScenario(scn.id);
	ok('the scenario still reads the override after a round trip through Base',
		L.fireFlowOwn(L.nodeById(own.id)) === SCN_GPM);
	L.switchScenario(baseId);

	console.log('\n--- it survives a save and reopen ---');
	const saved = JSON.stringify(L.serializeProject());
	L.reset();
	const reopened = L.acceptImportedText(saved);
	ok('the saved project reopens', !!reopened);
	L.applySaved(reopened);
	L.buildDom();
	ok('the junction\'s own required fire flow came back',
		L.fireFlowOwn(L.nodeById(own.id)) === OWN_GPM, String(L.fireFlowOwn(L.nodeById(own.id))));
	const other = L.serializeProject().scenarios.filter(s => !s.isBase)[0];
	L.switchScenario(other.id);
	ok('and so did the scenario\'s override', L.fireFlowOwn(L.nodeById(own.id)) === SCN_GPM,
		String(L.fireFlowOwn(L.nodeById(own.id))));
	L.switchScenario(L.baseScenarioId());

	console.log('\n--- and an .inp export does not carry it ---');
	// EPANET has no such field. An exporter that invented one would write a file no other program
	// reads back the same way, and would be claiming EPANET says something it does not.
	const out = L.exportInp();
	ok('the export succeeded', !!out && out.ok, out ? String(out.detail || '') : 'null');
	ok('the required fire flow is nowhere in the file',
		out.inp.indexOf(String(OWN_GPM)) < 0, 'searched for ' + OWN_GPM);
	ok('and neither is the scenario\'s override', out.inp.indexOf(String(SCN_GPM)) < 0);
	ok('nor the property name', out.inp.toLowerCase().indexOf('fireflow') < 0);

	console.log(fails ? '\nFAILED (' + fails + ')' : '\nAll fire-flow requirement checks passed.');
	process.exit(fails ? 1 : 0);
}());
