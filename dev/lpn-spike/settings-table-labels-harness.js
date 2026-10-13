// EVERY SETTING CELL OF THE SETTINGS TABLE IS VISITOR WORDS. Run with:
//   node dev/lpn-spike/settings-table-labels-harness.js
//
// The Settings table (dev/scenario-alternatives.md, "Stage 3b") names each row in its Setting
// column. A row the page has no words for falls back to its stored name (`symbolCapMultiple`,
// `colorBreaks › node.pressure`), which reads as code to a visitor. This opens every shipped
// example, turns on every view option (every label field of every kind, a colour and a contour for
// every field, every quality analysis), gives a scenario every calculation option a file can carry,
// and fails on any Setting cell that looks like a stored name: camelCase, a dotted or piped member,
// an underscore, a `quality:trace` mode, or the › the fallback joins with.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

setUnitSet('us');
const L = loadLoopedNetwork(EXAMPLE_EXPORTS +
	"\t\tlabels: function () { return settingTableRows().map(function (r) { var os = settingTableOwnerSetting(r.path); return { id: r.id, label: settingTableLabel(r.path), minor: r.minor, owner: os.owner, setting: os.setting, cpKey: r.path[0] === 'customProps' ? customPropBareKey(r.path[1]) : '' }; }); },\n" +
	"\t\tpc: function (k) { return (EngCalcs.pageConfig || {})[k]; },\n" +
	"\t\taddCustomProp: function () { settings.customProps = [{ key: 'custom_date_installed', label: 'Date installed', applies: 'L', validate: 'none', restrictMode: 'allow', restrict: '#-', minLength: '', maxLength: '', low: '', high: '' }]; },\n" +
	// Every view option on, in the project's own objects, the way the Settings and Labels boxes write them.
	"\t\tallOn: function () {\n" +
	"\t\t\tvar pc = EngCalcs.pageConfig || {};\n" +
	"\t\t\t[['node', nodeFieldDefs(pc)], ['link', linkFieldDefs(pc)], ['customer', customerFieldDefs(pc)]].forEach(function (g) {\n" +
	"\t\t\t\tg[1].forEach(function (d) {\n" +
	"\t\t\t\t\tlabelSettings[g[0]] = labelSettings[g[0]] || {}; labelSettings[g[0]][d[0]] = true;\n" +
	"\t\t\t\t\t['decimals', 'show', 'priority', 'useUnits', 'prefix', 'suffix'].forEach(function (k) {\n" +
	"\t\t\t\t\t\tvar m = labelSettings[k] || (labelSettings[k] = {}); m[g[0]] = m[g[0]] || {};\n" +
	"\t\t\t\t\t\tif (m[g[0]][d[0]] === undefined) { m[g[0]][d[0]] = k === 'prefix' || k === 'suffix' ? 'x' : 1; }\n" +
	"\t\t\t\t\t\t['age', 'trace', 'chemical'].forEach(function (mode) { if (d[0] === 'quality') { m[g[0]]['quality:' + mode] = 1; } });\n" +
	"\t\t\t\t\t});\n" +
	"\t\t\t\t\tif (g[0] === 'customer') { return; }\n" +
	"\t\t\t\t\tsettings.colorBreaks = settings.colorBreaks || {}; settings.colorBreaks[g[0] + '.' + d[0]] = [1, 2];\n" +
	"\t\t\t\t\tsettings.colorModes = settings.colorModes || {}; settings.colorModes[g[0] + '.' + d[0]] = 'equal';\n" +
	"\t\t\t\t\tif (g[0] === 'node') { settings.contourInterval = settings.contourInterval || {}; settings.contourInterval[contourIntervalKey(d[0])] = 5; }\n" +
	"\t\t\t\t});\n" +
	"\t\t\t});\n" +
	"\t\t\tsettings.colorNodeField = 'pressure'; settings.colorLinkField = 'velocity'; settings.contourFill = 'smooth';\n" +
	"\t\t\tsettings.contourLines = true; settings.contourLabels = true; settings.contourTerrain = true;\n" +
	"\t\t\tsettings.quality = { mode: 'trace', traceNode: '' }; settings.qualityOptions = { quality: 'Trace 1', diffusivity: '1', tolerance: '0.01' };\n" +
	"\t\t\tsettings.tolerance = 0.001; settings.emitterExponent = 0.5; settings.nodeElevSource = 'value';\n" +
	"\t\t\tsettings.hydraulics = Object.assign(settings.hydraulics || {}, { accuracy: 0.001, trials: 40, unbalanced: 'CONTINUE', unbalancedTrials: 10,\n" +
	"\t\t\t\theadError: 0, flowChange: 0, dampLimit: 0, checkFreq: 2, maxCheck: 10, demandModel: 'PDA', pdaSrc: true, minPressure: 0,\n" +
	"\t\t\t\treqPressure: 20, pressureExponent: 0.5, specificGravity: 1, viscosity: 1, emitterExponent: 0.5, statusReport: 'YES', demandMultiplier: 1 });\n" +
	"\t\t\tsettings.reactions = Object.assign(settings.reactions || {}, { globalBulk: -0.5, globalWall: -1, orderBulk: 1, orderWall: 1, orderTank: 1,\n" +
	"\t\t\t\tlimitingPotential: 0, roughnessCorrelation: 0 });\n" +
	"\t\t\tsettings.energy = Object.assign(settings.energy || {}, { globalEfficiency: 75, globalPrice: 0.1, globalPattern: '1', demandCharge: 0, currency: 'USD' });\n" +
	"\t\t\tdoc.times = Object.assign(doc.times || EngCalcs.lpnTimesDefaults(), { qualityStep: 300, statistic: 'AVERAGED' });\n" +
	"\t\t\tdoc.defaultPattern = '1';\n" +
	"\t\t\tvar s = { id: 'sAll', name: 'All held', overrides: {} }; scenarios.push(s); touchTree('harness');\n" +
	"\t\t\tsetScenarioSetting(s, ['view'], { cx: 1, cy: 1, s: 1 });\n" +
	"\t\t\tsetScenarioSetting(s, ['settings', 'textSize'], 20);\n" +
	"\t\t},\n");

const CODE = /[a-z][A-Z]|\w\.\w|\u203a|_|\w:\w|\w\|\w/;
const files = ['Net1.lwn', 'Net3-Novato-CA-World.lwn', 'Net3.lwn', 'Net2.lwn', 'Elm-Street-Center.lwn',
	'Basic-example-US-units.lwn', 'Basic-example-SI-units.lwn'];
files.forEach(function (f) {
	console.log('--- ' + f + ' ---');
	L.applySaved(L.acceptImportedText(fs.readFileSync(ROOT + 'examples/' + f, 'utf8')));
	const shipped = L.labels().filter((r) => CODE.test(r.label.split(r.cpKey || '\u0000').join('')));
	ok(f + ' as shipped: no Setting cell reads as a stored name', shipped.length === 0,
		JSON.stringify(shipped.slice(0, 12).map((r) => r.label)));
	L.allOn();
	const all = L.labels(), bad = all.filter((r) => CODE.test(r.label.split(r.cpKey || '\u0000').join('')));
	ok(f + ' with every view option on (' + all.length + ' rows): no Setting cell reads as a stored name', bad.length === 0,
		JSON.stringify(bad.slice(0, 12).map((r) => r.id + ' => ' + r.label)));
	const seen = {}, dup = [];
	// Node and link colours share their words; the Minor heading (Node colors, Link colors) tells them apart.
	all.forEach((r) => { const k = r.minor + '|' + r.label; if (seen[k]) { dup.push(k); } seen[k] = true; });
	ok('...and no two rows under one Minor heading share one label', dup.length === 0, JSON.stringify(dup.slice(0, 12)));
	// The Owner column (Tom, 2026-10-07): Minor, Owner and Setting together name one row, in visitor
	// words (a custom property's key is the user's own, as the box heads it), and never "Rank".
	const seen2 = {}, dup2 = [], bad2 = all.filter((r) => (r.owner !== r.cpKey && CODE.test(r.owner)) || CODE.test(r.setting) || /Rank/.test(r.setting));
	all.forEach((r) => { const k = r.minor + '|' + r.owner + '|' + r.setting; if (seen2[k]) { dup2.push(k); } seen2[k] = true; });
	ok('...Owner and Setting are visitor words, never Rank', bad2.length === 0, JSON.stringify(bad2.slice(0, 8).map((r) => r.id + ' => ' + r.owner + ' / ' + r.setting)));
	ok('...and no two rows share one Minor, Owner and Setting', dup2.length === 0, JSON.stringify(dup2.slice(0, 12)));
});
// Tom's own examples, row for row: Node labels.ID.Is active / Show order / Drop order, a label's Before
// and After stated or not (his "Bef. and Aft."), and a custom property's design owned by its key.
L.applySaved(L.acceptImportedText(fs.readFileSync(ROOT + 'examples/Net1.lwn', 'utf8')));
L.addCustomProp();
{
	const rows = L.labels(), pick = (id) => rows.filter((r) => r.id === JSON.stringify(id))[0];
	const on = pick(['labelSettings', 'node', 'id']), show = pick(['labelSettings', 'show', 'node', 'id']),
		drop = pick(['labelSettings', 'priority', 'node', 'id']), bef = pick(['labelSettings', 'prefix', 'link', 'flow']),
		aft = pick(['labelSettings', 'suffix', 'node', 'pressure']), uu = pick(['labelSettings', 'useUnits', 'node', 'pressure']),
		cpl = pick(['customProps', 'custom_date_installed', 'label']), cpr = pick(['customProps', 'custom_date_installed', 'restrict']);
	const W = (k) => L.pc(k), ID = W('lpn_field_id');
	ok('Node labels, ID, Is active', on && on.owner === ID && on.setting === W('lpn_settings_row_label_on'), JSON.stringify(on));
	ok('Node labels, ID, Show order (not Rank)', show && show.owner === ID && show.setting === W('lpn_settings_row_label_show'), JSON.stringify(show));
	ok('Node labels, ID, Drop order', drop && drop.owner === ID && drop.setting === W('lpn_settings_row_label_drop'), JSON.stringify(drop));
	ok('an unstated Before is a row (Link labels, Flow, Text before)', bef && !!bef.owner && bef.setting === W('lpn_settings_row_label_before'), JSON.stringify(bef));
	ok('an unstated After is a row, and so is its Use units', !!aft && !!uu && uu.setting === W('lpn_labels_use_units'), JSON.stringify([aft, uu]));
	ok('a custom property\'s design is rows owned by its key, under Custom properties',
		cpl && cpl.owner === 'date_installed' && cpl.setting === W('lpn_cp_label') && cpl.minor === 'lpn_set_sub_customProps', JSON.stringify(cpl));
	ok('...its character box named by its mode, as the box names it', cpr && cpr.setting === W('lpn_cp_restrict_allow'), JSON.stringify(cpr));
}
// The pattern itself is live: a stored name it must refuse.
ok('the check refuses a stored name (symbolCapMultiple, colorBreaks \u203a node.pressure)',
	CODE.test('symbolCapMultiple') && CODE.test('colorBreaks \u203a node.pressure') && !CODE.test('Plain words, with a unit (in parentheses)'));

console.log(fails ? '\n' + fails + ' of ' + checks + ' settings table label check(s) FAILED' : '\nSettings table labels: all ' + checks + ' checks passed.');
process.exit(fails ? 1 : 0);
