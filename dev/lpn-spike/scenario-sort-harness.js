// Headless check of scenariosForDisplay() -- Tom, 2026-09-30: "We immediately need a better way to
// sort the Scenarios list. For now, let's sort it by name."
//
//   node dev/lpn-spike/scenario-sort-harness.js
//
// WHY THIS EXISTS. scenariosForDisplay() is the one sort every visible scenario list is supposed to
// read through -- the Scenario menu, the scenario comparison report -- and the rule (Base first,
// then natural case-insensitive order by name, ties broken by id) is invisible to look at: a list
// that happens to be in creation order and a list that happens to be alphabetical by accident look
// identical until a name like "Scenario 10" sits next to "Scenario 2". This drives the real page
// code and asserts both that the display is sorted AND that the stored array and the saved file are
// not reordered by looking at it.

const { ROOT, setUnitSet, loadLoopedNetwork, ensure } = require('./lpn-dom-stub.js');
function byId(id) { return ensure(id); }

const L = loadLoopedNetwork(
	"\t\tgetScenarios: function () { return scenarios; },\n" +
	"\t\tscenariosForDisplay: scenariosForDisplay,\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tactiveScenario: activeScenario,\n" +
	"\t\tserializeProject: serializeProject,\n" +
	"\t\tscenarioCompareModels: scenarioCompareModels,\n" +
	"\t\tscenarioMenu: openScenarioMenu, menuRows: function () { return document.getElementById('lpn_menu_list'); },\n" +
	"\t\twireScenarioButton: wireScenarioButton,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs && L.seedDefaultInputs();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
// openMenu() builds a row as a button with an icon span and a text node; read the tree, as a
// reader would.
function rowText(el) {
	if (!el.children || !el.children.length) { return el.textContent || ''; }
	return (el.textContent || '') + el.children.map(rowText).join('');
}
function openScenarioMenu() {
	const btn = byId('lpn_scenario_btn');
	L.scenarioMenu(btn);
	if (byId('lpn_menu_popup').style.display !== 'block') { L.scenarioMenu(btn); }
	return L.menuRows().children.filter(function (c) { return c.tagName === 'BUTTON'; });
}

console.log('\n--- scenarios created out of order, by name, natural and case-insensitive ---');
{
	// Created in a deliberately scrambled order, so a passing test cannot be an accident of
	// creation order happening to already be sorted.
	['Zeta', 'alpha', 'Scenario 10', 'Scenario 2'].forEach(function (name) {
		L.createScenario(name);
	});
	L.switchScenario('base');

	const want = ['Base', 'alpha', 'Scenario 2', 'Scenario 10', 'Zeta'];
	const storedNames = L.getScenarios().map(function (s) { return s.isBase ? 'Base' : s.name; });
	ok('the STORED array is still creation order (Base, Zeta, alpha, Scenario 10, Scenario 2)',
		JSON.stringify(storedNames) === JSON.stringify(['Base', 'Zeta', 'alpha', 'Scenario 10', 'Scenario 2']),
		JSON.stringify(storedNames));

	const displayNames = L.scenariosForDisplay().map(function (s) { return s.isBase ? 'Base' : s.name; });
	ok('scenariosForDisplay() sorts them Base, alpha, Scenario 2, Scenario 10, Zeta',
		JSON.stringify(displayNames) === JSON.stringify(want), JSON.stringify(displayNames));
}

console.log('\n--- the Scenario menu shows the sorted order ---');
{
	const rows = openScenarioMenu();
	// Rows after the five scenarios are the separator and the New/Rename/Delete/Push actions; read
	// only the scenario rows off the front.
	const names = rows.slice(0, 5).map(function (r) {
		var t = rowText(r).replace(/✓/g, '');
		if (/Base/.test(t)) { return 'Base'; }
		if (/Scenario 10/.test(t)) { return 'Scenario 10'; }
		if (/Scenario 2/.test(t)) { return 'Scenario 2'; }
		if (/alpha/.test(t)) { return 'alpha'; }
		if (/Zeta/.test(t)) { return 'Zeta'; }
		return t;
	});
	ok('the menu lists Base, alpha, Scenario 2, Scenario 10, Zeta, in that order',
		JSON.stringify(names) === JSON.stringify(['Base', 'alpha', 'Scenario 2', 'Scenario 10', 'Zeta']),
		JSON.stringify(names));
}

console.log('\n--- the scenario comparison walks the same sorted order ---');
{
	const models = L.scenarioCompareModels();
	const names = models.map(function (p) { return p.scn.isBase ? 'Base' : p.scn.name; });
	ok('scenarioCompareModels() is in display order too',
		JSON.stringify(names) === JSON.stringify(['Base', 'alpha', 'Scenario 2', 'Scenario 10', 'Zeta']),
		JSON.stringify(names));
}

console.log('\n--- the saved file keeps the unsorted, creation order ---');
{
	const file = JSON.parse(JSON.stringify(L.serializeProject()));
	const fileNames = file.scenarios.map(function (s) { return s.isBase ? 'Base' : s.name; });
	ok('serializeProject() writes creation order, not display order',
		JSON.stringify(fileNames) === JSON.stringify(['Base', 'Zeta', 'alpha', 'Scenario 10', 'Scenario 2']),
		JSON.stringify(fileNames));
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
