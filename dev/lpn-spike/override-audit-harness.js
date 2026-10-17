// THE OVERRIDE COUNT, THE LIST AND DELETE AGREE, BY ONE RULE (Task 800). Headless. Run with:
//   node dev/lpn-spike/override-audit-harness.js
//
// The list and its count are held in a real Chromium by override-audit-browser-harness.js; this
// holds the rule under them, on Tom's Fotobi file (fixtures/fotobi-override-audit.epp):
//   A1  every value counts by presence (Tom, 2026-10-05 and 2026-10-06: *"We can't treat any value
//       overrides differently."*): a demand multiplier equal to the project's counts, as a demand
//       equal to Base's does, and so does a run time equal to the project's;
//   A2  for every stored alternative and calculation set, what Delete says goes with it
//       (storedOverrideCount()) is the number of rows the list shows for it;
//   A3  a scenario's count is its list's rows; the list's groups are exactly its holders.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const fs = require('fs');
const path = require('path');
const { loadLoopedNetwork } = require('./lpn-dom-stub.js');
const FIXTURE = path.join(__dirname, 'fixtures', 'fotobi-override-audit.epp');
const L = loadLoopedNetwork(
	"\t\tapplySaved: applySaved, acceptImportedText: acceptImportedText, getScenarios: function () { return scenarios; },\n" +
	"\t\toverrideCount: overrideCount, ownOverrideItems: ownOverrideItems, ownOverrideGroups: ownOverrideGroups,\n" +
	"\t\tstoredOverrideCount: storedOverrideCount, storedOwnItems: storedOwnItems, getDoc: function () { return doc; },\n" +
	"\t\ttouchTree: touchTree, getSettings: function () { return settings; },\n");
let fails = 0, n = 0;
function ok(name, cond, extra) {
	n++;
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function load(edit) {
	const saved = L.acceptImportedText(fs.readFileSync(FIXTURE, 'utf8'));
	if (edit) { edit(saved); }
	L.applySaved(saved);
}
const scn = (name) => L.getScenarios().find((s) => s.name === name);

console.log('--- A1. by presence ---');
load();
const before = L.overrideCount(scn('1-hr drain w pump off'));
ok('A1 Tom\'s scenario counts 17 (his 16, and J-NE-S-3\'s Demand equal to Base\'s)', before === 17, String(before));
load((d) => { d.calcSets.filter((c) => c.id === 'c5')[0].demandMultiplier = d.settings.hydraulics.demandMultiplier; });
const same = L.ownOverrideItems(scn('1-hr drain w pump off')).filter((it) => it.path && it.path.join('.') === 'settings.hydraulics.demandMultiplier');
ok('A1 a multiplier set to the project\'s own 6.4 still counts', L.overrideCount(scn('1-hr drain w pump off')) === 17 && same.length === 1 && same[0].value === 6.4,
	String(L.overrideCount(scn('1-hr drain w pump off'))));
const g = L.ownOverrideGroups(scn('1-hr drain w pump off')).filter((x) => x.cat === 'calculation')[0];
ok('A1 ...and the list marks it as equal to what it replaces', !!g && g.items.length === 1 && g.items[0].same === true, JSON.stringify(g && g.items));
const dem = L.ownOverrideGroups(scn('1-hr drain w pump off')).filter((x) => x.cat === 'demand')[0];
ok('A1 J-NE-S-3\'s Demand is marked the same; the default pattern is not', !!dem && dem.items.filter((o) => o.id === 'J-NE-S-3')[0].same === true && dem.items.filter((o) => o.id === null)[0].same === false,
	JSON.stringify(dem && dem.items));
load((d) => { d.calcSets.filter((c) => c.id === 'c1')[0].times = { duration: d.times.duration }; });
ok('A1 a run time equal to the project\'s counts in EPS', L.overrideCount(scn('EPS')) === 5, String(L.overrideCount(scn('EPS'))));

console.log('--- A2. Delete says what the list shows ---');
load();
const doc = L.getDoc();
const users = {};
L.getScenarios().forEach((s) => {
	Object.keys(s.alternatives || {}).forEach((c) => { users['alt:' + s.alternatives[c]] = s; });
	if (s.calc) { users['calc:' + s.calc] = s; }
});
let checked = 0;
[['alt', doc.alternatives], ['calc', doc.calcSets]].forEach(([kind, list]) => {
	(list || []).forEach((r) => {
		const k = L.storedOverrideCount(kind, r), items = L.storedOwnItems(kind, r).length, s = users[kind + ':' + r.id];
		let rows = items;
		if (s) {
			const grp = L.ownOverrideGroups(s).filter((x) => x.kind === kind && x.name === String(r.name || '') && x.cat === (kind === 'calc' ? 'calculation' : r.category))[0];
			rows = grp ? grp.items.length : 0;
		}
		checked++;
		ok('A2 ' + kind + ' ' + r.id + ' "' + r.name + '": Delete says ' + k + ', the list shows ' + rows, k === items && k === rows);
	});
});
ok('A2 every stored record was checked', checked === (doc.alternatives || []).length + (doc.calcSets || []).length, String(checked));

console.log('--- A3. the count is the list ---');
L.getScenarios().forEach((s) => {
	const rows = L.ownOverrideGroups(s).reduce((t, x) => t + x.items.length, 0);
	ok('A3 ' + s.name + ': count ' + L.overrideCount(s) + ' = rows ' + rows, rows === L.overrideCount(s));
});

console.log(fails ? fails + ' of ' + n + ' FAILED' : 'all ' + n + ' ok');
process.exit(fails ? 1 : 0);
