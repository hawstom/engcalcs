// A STANDING NOTE WHEN PIPES HOLD A ROUGHNESS MEANT FOR ANOTHER FRICTION METHOD. Run with:
//   node dev/lpn-spike/roughness-method-note-harness.js
//
// Sue's wish list, 2026-10-05, item 5: a scenario's Calculation alternative can switch the friction
// method while its pipes keep the other method's roughness, and it solves, with garbage. The
// per-value glyph (dev/value-warning.md) marks each number; this note says it once, in the status
// bar, with a count, in the scenario where it is true only. The values are never changed.
'use strict';
const fs = require('fs');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const PC = global.EngCalcs.pageConfig;
const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, applySaved: applySaved, buildDom: buildDom,\n" +
	"\t\tacceptImportedText: acceptImportedText, createScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tsetScenarioSetting: setScenarioSetting, setProp: setProp, effective: effective,\n" +
	"\t\tnote: function () { return roughnessNoteText(assembleModel()); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
setUnitSet('us');
L.buildLayers();
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
}
const fileOf = (name) => L.acceptImportedText(fs.readFileSync(ROOT + 'examples/' + name, 'utf8'));
const files = fs.readdirSync(ROOT + 'examples/').filter((f) => /\.lwn$/.test(f));

ok('the key is in the English strings', /\{n\}/.test(PC.lpn_roughness_method_note || '') && /^⚠/.test(PC.lpn_roughness_method_note));

// ---- Net1 (C values) with a child scenario that switches to Darcy-Weisbach ----
L.applySaved(fileOf('Net1.lwn'));
L.buildDom();
L.switchScenario('base');
const pipes = L.getDoc().links.filter((l) => l.type === 'pipe');
ok('Net1 Base (Hazen-Williams): no note', L.note() === '');
const child = L.createScenario('Darcy');
ok('the child scenario was created', !!child);
ok('...and the method override is accepted', L.setScenarioSetting(child, 'settings.method', 'dw') === true);
const before = JSON.stringify(pipes.map((l) => l.roughness));
L.switchScenario(child.id);
const n = L.note();
ok('child (Darcy-Weisbach), pipes still C: the note appears', n !== '', n);
ok('...it names the method', n.indexOf('Darcy-Weisbach') >= 0);
ok('...and counts every pipe (' + pipes.length + ')', n.indexOf(': ' + pipes.length + '.') >= 0, n);
ok('...it leads with the warning sign', n.charAt(0) === '⚠');
ok('...and no stored roughness changed', JSON.stringify(L.getDoc().links.filter((l) => l.type === 'pipe').map((l) => l.roughness)) === before);
L.switchScenario('base');
ok('back in Base: the note is gone', L.note() === '');

// ---- exactly the pipes that are off: fix two in the child, the count follows ----
L.switchScenario(child.id);
const two = pipes.slice(0, 2);
two.forEach((l) => L.setProp(l, 'roughness', 0.005));
const n2 = L.note();
ok('two pipes given a Darcy-Weisbach roughness (0.005 ft): the count falls by two', n2.indexOf(': ' + (pipes.length - 2) + '.') >= 0, n2);
L.switchScenario('base');
ok('...and Base is still clean (the override lives in the child)', L.note() === '');

// ---- the reverse: a Darcy-Weisbach network opened under Hazen-Williams ----
L.applySaved(fileOf('Net1.lwn'));
L.buildDom();
L.switchScenario('base');
L.getDoc().links.filter((l) => l.type === 'pipe').forEach((l) => L.setProp(l, 'roughness', 0.005));
ok('Base is Hazen-Williams with e-sized numbers: the note appears', /: \d+\./.test(L.note()), L.note());

// ---- every shipped example, in each of its own scenarios, says nothing ----
let scen = 0;
files.forEach((f) => {
	L.applySaved(fileOf(f));
	L.buildDom();
	const ids = ['base'].concat((L.getDoc().scenarios || []).map((s) => s.id));
	ids.forEach((id) => {
		L.switchScenario(id);
		scen++;
		const t = L.note();
		ok(f + ' / ' + id + ': no note', t === '', t);
	});
});
console.log('(' + files.length + ' examples, ' + scen + ' scenarios)');
console.log(fails ? fails + ' FAILED' : 'all passed');
process.exit(fails ? 1 : 0);
