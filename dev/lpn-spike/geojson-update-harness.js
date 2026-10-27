// Headless check of File > Import > GeoJSON network when a project is already open -- ROADMAP Task 814.
//
//   node dev/lpn-spike/geojson-update-harness.js
//
// A GeoJSON network may now UPDATE the open project, by the same code as an EPANET file
// (inpPlanFromSource / updateProjectWithPlan): assets matched by ID, a differing value written
// through setProp() (an override in a scenario), an asset only in the file added (inactive in Base
// when a scenario is the target), an asset only in the project kept, ONE undo step, a unit mismatch
// refused by name, and a receipt dialog naming the scenario. The file here is written by this
// page's own export, then edited: one changed value and one new junction.
// Every sentence is read from the page's own config, never retyped (harness_wording_check.php).

const { ROOT, byId, ensure, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
ensure('lpn_dialog_title');
const fs = require('fs');
const PC = global.EngCalcs.pageConfig;
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-geojson.js');
require(ROOT + 'js/lpn-georef.js');

global.alert = global.window.alert = function () {};
global.confirm = global.window.confirm = function () { return true; };

setUnitSet('us');
const L = loadLoopedNetwork(
	"\t\tapplySaved: applySaved, buildDom: buildDom, serialize: serializeProject, geoOptions: geoJsonExportOptions,\n" +
	"\t\tland: landGeoJsonNetText, askInp: inpAskDestination, getDoc: function () { return doc; }, undo: undo, getProject: function () { return project; },\n" +
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\teffective: effective, nodeById: nodeById, linkById: linkById,\n" +
	"\t\tprojectCount: function () { return library.projects.length; },\n" +
	"\t\tscenarios: function () { return scenarios; }, overrideCount: overrideCount,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tz: 0 "
);
L.buildLayers();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function walk(el) { return (!el.children || !el.children.length) ? (el.textContent || '') : el.children.map(walk).join('\n'); }
const dialogText = () => walk(byId.lpn_dialog_body);
const dialogButtons = () => byId.lpn_dialog_buttons.children.map(c => c.textContent);
function press(label) {
	const btn = byId.lpn_dialog_buttons.children.filter(c => c.textContent === label)[0];
	if (!btn) { throw new Error('no such button: ' + label + ' in ' + JSON.stringify(dialogButtons())); }
	(btn._listeners.click || []).forEach(fn => fn({}));
}
function clearDialog() { byId.lpn_dialog_body.children.length = 0; byId.lpn_dialog_buttons.children.length = 0; }
const snap = () => JSON.stringify(L.getDoc());
const ROUNDS = [];
function importText(text, name) { clearDialog(); L.land(text, name, (r) => ROUNDS.push(r)); }

// ---- the file: this page's own export of the geographic Net3, edited -----------------------------
L.applySaved(JSON.parse(fs.readFileSync(ROOT + 'dev/water-network-examples/latlon-originals/Net3-Novato-CA-World.lwn', 'utf8'))); L.buildDom();
const out = global.EngCalcs.lpnExportGeoJson(L.serialize(), L.geoOptions());
ok('the page writes a GeoJSON network', out.ok);
const base = JSON.parse(out.text);
const edited = JSON.parse(out.text);
const j20 = edited.features.find(f => f.properties.node_type === 'Junction' && f.properties.name === '20');
const oldElev = j20.properties.elevation;
j20.properties.elevation = oldElev + 7;
const j10 = edited.features.find(f => f.properties.node_type === 'Junction' && f.properties.name === '10');
const newJ = JSON.parse(JSON.stringify(j10));
newJ.properties.name = 'NEWJ';
newJ.properties.elevation = 123;
newJ.geometry.coordinates = [j10.geometry.coordinates[0] + 0.001, j10.geometry.coordinates[1] + 0.001];
edited.features.push(newJ);
const TEXT = JSON.stringify(edited);

delete global.window.lpnInpDestination;   // drive the real question

console.log('\n--- Base only: the question, then update the open project ---');
{
	const nodes0 = L.getDoc().nodes.length, links0 = L.getDoc().links.length, proj0 = L.projectCount();
	const before = snap();
	importText(TEXT, 'edited.geojson');
	const names = dialogButtons();
	ok('one small question, the same as for an EPANET file: new project, this project, a new scenario, Cancel',
		names.length === 4 && names[0] === PC.lpn_inpup_btn_new && names[3] === PC.lpn_cancel, JSON.stringify(names));
	ok('its lead names a GeoJSON file', dialogText().indexOf(PC.lpn_gjup_lead.split(/\\n\\n|\n\n/)[0]) >= 0);
	{
		const paras = PC.lpn_gjup_lead.split(/\\n\\n|\n\n/), dt = dialogText();
		ok('the lead is two paragraphs, the second stating the rule', paras.length === 2 && paras[1].length > 0 && paras[1] !== paras[0]);
		ok('both are shown, as separate paragraphs, with no literal \\n', dt.indexOf(paras[0]) >= 0 && dt.indexOf(paras[1]) >= 0 && dt.indexOf('\\n') < 0);
		ok('the EPANET how-paragraph is not repeated under it', dt.indexOf(PC.lpn_inpup_how) < 0);
	}
	press(names[1]);
	ok('no second project was made', L.projectCount() === proj0);
	ok('the changed value is updated', L.nodeById('20').elev === oldElev + 7, String(L.nodeById('20').elev));
	ok('the new junction is added with the file values', !!L.nodeById('NEWJ') && L.nodeById('NEWJ').elev === 123);
	ok('the rest is unchanged and kept', L.getDoc().nodes.length === nodes0 + 1 && L.getDoc().links.length === links0 && L.nodeById('10').elev === base.features.find(f => f.properties.name === '10' && f.properties.node_type === 'Junction').properties.elevation);
	const t = dialogText();
	ok('the receipt is a dialog titled for GeoJSON', byId.lpn_dialog_title.textContent === PC.lpn_gjup_title, byId.lpn_dialog_title.textContent);
	ok('the receipt names the change old to new', t.indexOf('20') >= 0 && t.indexOf(String(oldElev)) >= 0 && t.indexOf(String(oldElev + 7)) >= 0, t.slice(0, 300));
	ok('the receipt lists what was added', t.indexOf(PC.lpn_inpup_h_added) >= 0 && t.indexOf('NEWJ') >= 0);
	ok('the receipt says what a GeoJSON file did not apply, never "sync"', t.indexOf(PC.lpn_inpup_h_na) >= 0 && !/sync/i.test(t));
	L.undo();
	ok('ONE undo restores the project exactly', snap() === before);
}

console.log('\n--- a child scenario is open: it receives the values, Base is untouched ---');
{
	const sc = L.createScenario('Peak', 'base');
	const before = snap();
	const baseElev20 = L.nodeById('20').elev;
	importText(TEXT, 'edited.geojson');
	const names = dialogButtons();
	ok('the question offers the open scenario and Base', names[1] === PC.lpn_inpup_btn_scenario.replace('{scenario}', 'Peak') && names[3] === PC.lpn_scenario_base && names[2] === PC.lpn_inpup_btn_newscn_basic, JSON.stringify(names));
	press(names[1]);
	ok('Base holds the old value', L.nodeById('20').elev === baseElev20);
	ok('the scenario reads the file value', L.effective(L.nodeById('20'), 'elev') === oldElev + 7);
	ok('it is an override of the scenario, and nothing else is overridden but the new junction\'s activation', L.overrideCount(L.scenarios().filter(x => !x.isBase)[0]) === 2, String(L.overrideCount(L.scenarios().filter(x => !x.isBase)[0])));
	ok('the new junction is inactive in Base and active in the scenario', L.nodeById('NEWJ')._active === false && L.effective(L.nodeById('NEWJ'), 'active') === true);
	ok('every other asset is unchanged', L.getDoc().nodes.filter(n => n.id !== 'NEWJ').every(n => JSON.stringify(n) === JSON.stringify(JSON.parse(before).nodes.filter(m => m.id === n.id)[0]) || n.id === '20'));
	ok('the receipt names the scenario', dialogText().indexOf('Peak') >= 0);
	L.undo();
	ok('one undo restores the scenario and Base exactly', snap() === before);
	// And Base, chosen on purpose from inside the scenario.
	importText(TEXT, 'edited.geojson');
	press(PC.lpn_scenario_base);
	ok('Base chosen: Base takes the value', L.nodeById('20').elev === oldElev + 7);
	ok('the open scenario stays open', L.getProject().activeScenario === sc.id);
	L.undo();
	ok('undo of a Base update restores it', snap() === before);
}

console.log('\n--- a file in other units is refused by name ---');
{
	const si = JSON.parse(TEXT);
	si.lwn.units = Object.assign({}, si.lwn.units, { lpn_u_flow: 'lps' });
	const before = snap();
	importText(JSON.stringify(si), 'si.geojson');
	press(dialogButtons()[1]);
	const t = dialogText();
	ok('the refusal leaves the project as it was', snap() === before);
	ok('it names the flow unit and says what to do instead', t.indexOf(PC.lpn_result_flow) >= 0 && t.indexOf(PC.lpn_inpup_refused_lead) >= 0, t.slice(0, 300));
}

console.log('\n--- the EPANET file box has the same two paragraphs ---');
{
	clearDialog();
	L.askInp('x.inp', 'x.inp', null);
	const paras = PC.lpn_inpup_lead.split(/\\n\\n|\n\n/), dt = dialogText();
	const count = (h, n) => h.split(n).length - 1;
	ok('the .inp lead is two paragraphs, the second stating the rule', paras.length === 2 && paras[1].length > 0 && paras[1] !== paras[0]);
	ok('the .inp box shows both paragraphs once, with no literal \\n', count(dt, paras[0]) === 1 && count(dt, paras[1]) === 1 && dt.indexOf('\\n') < 0);
	ok('no old explanation paragraph is repeated under it', dt.indexOf(PC.lpn_inpup_how) < 0);
	press(PC.lpn_cancel);
}

(async () => {
console.log('\n--- the new-project route is unchanged ---');
{
	const n0 = L.projectCount();
	importText(TEXT, 'edited.geojson');
	press(PC.lpn_inpup_btn_new);
	await new Promise((r) => setTimeout(r, 300));
	ok('a new project is made, holding the file and not a merge', L.projectCount() === n0 + 1 && L.nodeById('NEWJ') && L.getDoc().nodes.length === base.features.filter(f => f.properties.node_type).length + 1);
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
process.exit(fails ? 1 : 0);
})();
