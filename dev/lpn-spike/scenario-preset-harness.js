// TASK 721 -- EVERY NEW PROJECT STARTS WITH READY-MADE SCENARIOS; NOTHING OPENED GETS THEM.
//   node dev/lpn-spike/scenario-preset-harness.js
//
// Tom, 2026-09-30: *"could we provide some pre-packaged Scenarios in all new projects? It should be
// easy to do a few like '1. Flow test: Static, 2. Flow test: Mid, 3. Flow test: Max, 4. Average
// Day, 5. Max Day, 6. Peak hour, 7. Fire plus max day'"*.
//
// Checked: the first-visit project and a wizard-made project both hold Base plus the seven, in his
// order in the scenario menu, with the multipliers LPN_PRESET_SCENARIOS states and a tip on each;
// a new project made from a customized one gets the seven again, not that project's list; an
// opened project file and an imported .inp get Base alone; and a Base-only file round-trips
// byte-identical.

'use strict';

const fs = require('fs');
const { execFileSync } = require('child_process');
const { ROOT, loadLoopedNetwork, byId, setUnitSet } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-inp.js');

let checks = 0, failures = 0;
function check(ok, label, detail) {
	checks++;
	if (!ok) { failures++; }
	console.log((ok ? '  ok   ' : '  FAIL ') + label + (detail ? '   ' + detail : ''));
}

// The page's own English strings for the new keys, so the tips are the real ones.
const KEYS = ['flow_static', 'flow_mid', 'flow_max', 'average_day', 'max_day', 'peak_hour', 'fire_max_day']
	.map((k) => 'lpn_scenario_preset_' + k);
const strings = JSON.parse(execFileSync('php', ['-r',
	'$ec_lang = array(); $ec_lang_syn = array(); include "' + ROOT + 'lib/lang.ec.en.php"; $o = array();' +
	'foreach ($ec_lang as $k => $v) { if (strpos($k, "lpn_scenario_preset_") === 0) { $o[$k] = $v; } }' +
	'echo json_encode($o);'], { encoding: 'utf8' }));

setUnitSet('us');
global.fetch = () => Promise.reject(new Error('no network in this harness'));
global.EngCalcs.setIconLabel = () => {};
global.window.setTimeout = (f, t) => setTimeout(f, t);
global.window.clearTimeout = (t) => clearTimeout(t);
global.window.history = { replaceState: () => {} };
global.requestAnimationFrame = global.window.requestAnimationFrame = () => 0;
global.EngCalcs.pageConfig = Object.assign(global.EngCalcs.pageConfig || {}, strings);
const canvas = byId.lpn_canvas;
Object.defineProperty(canvas, 'clientWidth', { get() { return 1000; } });
Object.defineProperty(canvas, 'clientHeight', { get() { return parseFloat(this.height) || 0; } });
canvas.getBoundingClientRect = function () {
	const h = parseFloat(this.height) || 0;
	return { left: 0, top: 0, right: 1000, bottom: h, width: 1000, height: h };
};

const L = loadLoopedNetwork(
	"\t\tinit: init, getScenarios: function () { return scenarios; },\n" +
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\tscenarioMenuRows: scenarioMenuRows, overrideCount: overrideCount,\n" +
	"\t\tswitchScenario: switchScenario, docDM: docDemandMultiplier,\n" +
	"\t\tcreateProjectFrom: createProjectFrom, unitKey: unitKey,\n" +
	"\t\tdeleteScenario: deleteScenario, createScenario: createScenario,\n" +
	"\t\timportProject: importProject, prepareDocument: prepareDocument,\n" +
	"\t\tdocFromInp: docFromInp, serializeProject: serializeProject,\n" +
	"\t\tindexEntry: indexEntry, getLibrary: function () { return library; }\n"
);

// Tom's order is the key order; the words themselves come from the language file.
const TOM = KEYS.map((k) => strings[k]);
const WANT_DM = { average_day: 1, max_day: 2, peak_hour: 3, fire_max_day: 2 };

function menuNames() {
	return L.scenarioMenuRows().filter((r) => !r.separator && !r.icon && r.fn && /^(✓|\s)\s/.test(r.label))
		.map((r) => r.label.slice(2).replace(/ \(\d+\)$/, ''));
}
function checkPresets(where) {
	const sc = L.getScenarios();
	check(sc.length === 8 && sc[0].isBase, where + ': Base plus seven scenarios', sc.length + ' scenarios');
	const names = menuNames();
	check(JSON.stringify(names.slice(1)) === JSON.stringify(TOM), where + ': the menu lists them in Tom\'s order',
		JSON.stringify(names));
	const tips = L.scenarioMenuRows().filter((r) => r.tip && r.fn && /^(✓|\s)\s/.test(r.label || ''));
	check(tips.length === 7, where + ': each of the seven carries its tip', tips.length + ' tips');
	sc.forEach(function (s) {
		if (s.isBase) { return; }
		if (WANT_DM[s.id] !== undefined) {
			check(s.demandMultiplier === WANT_DM[s.id], where + ': ' + s.name + ' multiplies demand by ' + WANT_DM[s.id],
				String(s.demandMultiplier));
		} else {
			check(s.demandMultiplier === undefined && Object.keys(s.overrides).length === 0,
				where + ': ' + s.name + ' holds no flow and no multiplier of its own', JSON.stringify(s));
		}
	});
}

console.log('--- a first-ever visit: Project1 ---');
L.init();
checkPresets('first visit');
check(!L.indexEntry(L.getLibrary().openId).dirty, 'first visit: the presets do not leave the new tab dirty');
{
	const byId2 = {};
	L.getScenarios().forEach((s) => { byId2[s.id] = s; });
	check(L.overrideCount(byId2.average_day) === 0, '4. Average Day (multiplier 1) counts as no change on a document stating none');
	check(L.overrideCount(byId2.max_day) === 1, '5. Max Day counts its multiplier as one change');
	L.switchScenario('peak_hour');
	check(L.docDM() === 3, 'switching to 6. Peak hour solves at 3 x demand', String(L.docDM()));
	L.switchScenario('base');
}

console.log('\n--- they are ordinary scenarios: renamed, deleted, and a user one added ---');
{
	L.getScenarios().filter((s) => s.id === 'max_day')[0].name = 'Max Day (ours)';
	L.getScenarios().filter((s) => s.id === 'max_day')[0].demandMultiplier = 1.6;
	L.deleteScenario('flow_mid');
	const mine = L.createScenario('My scenario');
	check(mine.id === 's1', 'a scenario the user adds next is still s1', mine.id);
	check(L.getScenarios().length === 8 && !L.getScenarios().some((s) => s.id === 'flow_mid'),
		'deleting one removes it', L.getScenarios().map((s) => s.id).join(','));
}

console.log('\n--- a NEW project made from that customized one gets the seven again ---');
{
	const units = {};
	['lpn_u_length', 'lpn_u_diameter', 'lpn_u_elevhead', 'lpn_u_pressure', 'lpn_u_flow',
		'lpn_u_velocity', 'lpn_u_gradient', 'lpn_u_roughness', 'lpn_u_age'].forEach((n) => { units[n] = L.unitKey(n); });
	L.createProjectFrom({ geo: false, crs: '', place: null, method: 'hw', units: units });
	checkPresets('wizard project');
	check(!L.indexEntry(L.getLibrary().openId).dirty, 'wizard project: born clean');
}

console.log('\n--- a project file that is opened gets Base alone, and round-trips byte-identical ---');
{
	const text = fs.readFileSync(ROOT + 'examples/Net1.lwn', 'utf8');
	const saved = L.prepareDocument(JSON.parse(text));
	L.importProject(saved);
	const sc = L.getScenarios();
	check(sc.length === 1 && sc[0].isBase, 'Net1.lwn opens with Base alone', sc.map((s) => s.id).join(','));
	const once = JSON.stringify(L.serializeProject());
	check(JSON.stringify(JSON.parse(once).scenarios) === JSON.stringify(JSON.parse(text).scenarios),
		'its scenarios are written back exactly as the file had them');
	L.importProject(L.prepareDocument(JSON.parse(once)));
	check(JSON.stringify(L.serializeProject()) === once, 'save, reopen, save: byte-identical');
}

console.log('\n--- an imported .inp gets Base alone ---');
{
	const inp = fs.readFileSync(ROOT + 'dev/lpn-spike/reference/Net1.inp', 'utf8');
	L.importProject(L.docFromInp(EngCalcs.lpnInpParse(inp), 'Net1'));
	const sc = L.getScenarios();
	check(sc.length === 1 && sc[0].isBase, 'Net1.inp opens with Base alone', sc.map((s) => s.id).join(','));
}

console.log('\n' + (failures ? failures + ' FAILED of ' : 'all ') + checks + ' checks');
process.exit(failures ? 1 : 0);
