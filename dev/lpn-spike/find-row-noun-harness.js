// EVERY FIND RESULT SAYS WHAT IT IS -- Tom, 2026-09-28: *"In Find results, some of Net3's junctions
// are listed as Junction n, and others are listed as n. I can't see any reason for this. Can you
// figure it out?"* Run with:
//   node dev/lpn-spike/find-row-noun-harness.js
//
// THE CAUSE: a row named its kind only when a pipe shared the junction's ID (Net3 has pipes named
// like junctions: 10, 20, 40, 50, 60 ...), so those junctions read "Junction 10" and the rest bare.
// Now every node, link and customer row names its kind. Asserted on the shipped Net3 itself, so the
// case he saw is the case tested: the ID-sharing junctions exist (the cause is real), and every row,
// shared or not, starts with its noun (the fix).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, ensure, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

global.fetch = () => Promise.reject(new Error('no network in this harness'));
global.EngCalcs.setIconLabel = () => {};
global.window.history = { replaceState: () => {} };
global.requestAnimationFrame = global.window.requestAnimationFrame = () => 0;
ensure('lpn_find_form');
ensure('lpn_find_results');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, applySaved: applySaved,\n" +
	"\t\tsetState: function (scope, prop, op, value) {\n" +
	"\t\t\tfindState.scope = scope; findState.prop = prop; findState.op = op;\n" +
	"\t\t\tfindState.value = value === undefined ? '' : value; findNormalize(); },\n" +
	"\t\tbuildPanel: function () { rebuildFindForm(); }, pressFind: function () { runFind(); },\n" +
	"\t\tresultsBox: function () { return document.getElementById('lpn_find_results'); }\n"
);
const PC = global.EngCalcs.pageConfig;
let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function rowTexts() {
	const out = [];
	(function walk(e) { (e.children || []).forEach((k) => { if (k._tag === 'button' && k._lpnFindRef) { out.push(k.textContent); } walk(k); }); })(L.resultsBox());
	return out;
}

setUnitSet('us');
L.applySaved(JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', 'Net3.lwn'), 'utf8')));
const doc = L.getDoc();
const junctions = doc.nodes.filter((n) => n.type === 'junction');
const linkIds = {};
doc.links.forEach((l) => { linkIds[l.id] = true; });
const shared = junctions.filter((n) => linkIds[n.id]).map((n) => n.id);
ok('THE CAUSE IS REAL: some Net3 junctions share their ID with a pipe', shared.length > 0 && shared.length < junctions.length,
	shared.length + ' of ' + junctions.length + ' (' + shared.slice(0, 6).join(', ') + ' ...)');

L.buildPanel();
L.setState('junction', 'id', 'contains', '');
L.pressFind();
let rows = rowTexts();
const J = PC.lpn_tool_add_junction;
ok('Find lists every Net3 junction', rows.length === junctions.length, rows.length + ' / ' + junctions.length);
ok('EVERY row reads "Junction n", shared ID or not', rows.every((t) => t.indexOf(J + ' ') === 0),
	JSON.stringify(rows.filter((t) => t.indexOf(J + ' ') !== 0).slice(0, 5)));
const notShared = junctions.filter((n) => !linkIds[n.id])[0].id;
ok('...including a junction no pipe shares an ID with (' + notShared + ')', rows.indexOf(J + ' ' + notShared) >= 0);
ok('...and one that does (' + shared[0] + ')', rows.indexOf(J + ' ' + shared[0]) >= 0);

L.setState('all', 'id', 'contains', '');
L.pressFind();
rows = rowTexts();
const nouns = [PC.lpn_tool_add_junction, PC.lpn_tool_add_reservoir, PC.lpn_tool_add_tank, PC.lpn_tool_add_pipe,
	PC.lpn_tool_add_pump, PC.lpn_tool_add_valve, PC.lpn_tool_add_meter];
const ided = rows.filter((t) => t.indexOf(' ') > 0 || /^\S+$/.test(t));
ok('under Everything, no node or link row is bare', doc.nodes.length + doc.links.length ===
	rows.filter((t) => nouns.some((w) => t.indexOf(w + ' ') === 0)).length, rows.length + ' rows, ' + ided.length);
// In Net3, "10" is a junction and a pump.
const tens = rows.filter((t) => / 10$/.test(t));
ok('Junction 10 and the link named 10 still read apart', tens.length >= 2 && tens.indexOf(J + ' 10') >= 0 &&
	new Set(tens).size === tens.length, JSON.stringify(tens));

if (fails) { console.log('\n' + fails + ' find row noun check(s) FAILED'); process.exit(1); }
console.log('\nFind row noun harness: all checks passed.');
