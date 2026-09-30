// CRITICALITY ANALYSIS -- break each asset in turn and report what the system loses. Tom,
// 2026-09-30: *"Criticality analysis: This sounds like a fun report to build. Break each asset and
// report."* Run with:
//   node dev/lpn-spike/criticality-harness.js
//
// On Net1 (examples/Net1.lwn), through the page's own Run path:
//   1. As shipped, Net1 is fully looped: breaking any pipe cuts nothing off.
//   2. With pipe 122 taken out of the network first, pipe 31 is the only way to junction 32:
//      breaking it reports 32 cut off with its demand, and 121 cuts off 31 and 32 with both.
//      Rows are sorted by severity, the asset ID is a go-to link, and the project is unchanged.
//   3. A case whose solve fails is a row saying so, never an abort.
//   4. Selected with nothing selected says so and runs nothing; Selected breaks only the selection.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { byId, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');
const PC = global.EngCalcs.pageConfig;
const ROOT = path.join(__dirname, '..', '..') + '/';

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\trunSolve: runSolve, openBox: openCriticalityBox, wireBox: wireCriticalityBox,\n" +
	"\t\trunCrit: runCriticality, run: function () { return critRun; },\n" +
	"\t\tsetScope: function (v) { critAsk.scope = v; },\n" +
	"\t\tdocGuard: function () { return critDocGuard; },\n" +
	"\t\tminPressureText: function () { return critFireFlowAsk().minPressure; },\n" +
	"\t\tsetInactive: function (id) { setProp(linkById(id), 'active', false); },\n" +
	"\t\tsetSelectionList: setSelectionList, clearSel: clearSelection,\n" +
	"\t\tnotice: function () { var n = document.getElementById('lpn_map_notice'); return n ? n.textContent : ''; },\n" +
	"\t\tswapEngine: function (f) { var was = EngCalcs.lpnSolve, wasE = EngCalcs.lpnSolveEpanet;\n" +
	"\t\t\tEngCalcs.lpnSolve = f(was); EngCalcs.lpnSolveEpanet = null; return function () { EngCalcs.lpnSolve = was; EngCalcs.lpnSolveEpanet = wasE; }; },\n" +
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
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function kids(n) { return (n && (n.childNodes || n.children)) || []; }
function isTag(n, t) { return String(n && (n.tagName || n._tag)).toLowerCase() === t; }
function text(n) {
	if (!n) { return ''; }
	if (n.nodeType === 3 || n._text !== undefined && !kids(n).length) { return String(n.textContent || n._text || ''); }
	const k = kids(n);
	return k.length ? k.map(text).join('') : String(n.textContent || '');
}
function rows(el) {
	const out = [];
	(function walk(x) {
		if (!x) { return; }
		if (isTag(x, 'tr')) { const tds = kids(x).filter((c) => isTag(c, 'td')); if (tds.length) { out.push(tds); } return; }
		kids(x).forEach(walk);
	})(el);
	return out;
}
function gotoIn(el) {
	const out = [];
	(function walk(x) {
		if (!x) { return; }
		if (isTag(x, 'button') && String(x.className || '').indexOf('lpn-ff-goto') >= 0) { out.push(x); }
		kids(x).forEach(walk);
	})(el);
	return out;
}
const GPM = 3.785411784e-3 / 60;

function openNet1() {
	L.reset();
	const saved = L.acceptImportedText(fs.readFileSync(ROOT + 'examples/Net1.lwn', 'utf8'));
	if (!saved) { throw new Error('Net1.lwn did not open'); }
	L.applySaved(saved);
	L.buildDom();
	L.applyMethodUI();
	L.wireBox();
	L.runSolve();
	L.openBox();
}

(async function () {
	setUnitSet('us');

	console.log('--- 1. Net1 as shipped is looped: no pipe cuts anything off ---');
	openNet1();
	let before = JSON.stringify(L.getDoc());
	L.setScope('all');
	await L.runCrit();
	let set = L.run();
	ok('a run happened', !!set && set.ok, set && JSON.stringify({ ok: set.ok, code: set.code }));
	ok('every pipe was broken, and only pipes', !!set && set.results.length === 12 &&
		set.results.every((r) => r.type === 'pipe'), set && set.results.length);
	ok('no pipe cuts off a junction', !!set && set.results.every((r) => r.cutOff && r.cutOff.length === 0),
		set && JSON.stringify(set.results.filter((r) => r.cutOff && r.cutOff.length).map((r) => r.id)));
	const r111 = set && set.byId['111'];
	ok('looped pipe 111: nothing cut off, no demand lost', !!r111 && r111.cutOff.length === 0 && r111.unserved === 0,
		JSON.stringify(r111));
	ok('the minimum pressure is fire flow\'s own, as the box shows it', L.minPressureText() === '20', L.minPressureText());
	ok('the project is unchanged', JSON.stringify(L.getDoc()) === before && L.docGuard());

	console.log('\n--- 2. With 122 out, 31 and 121 isolate junctions ---');
	L.setInactive('122');
	L.runSolve();
	before = JSON.stringify(L.getDoc());
	await L.runCrit();
	set = L.run();
	ok('122 itself is not broken again (it is already out)', !!set && !set.byId['122'] && set.results.length === 11,
		set && set.results.length);
	const r31 = set.byId['31'], r121 = set.byId['121'];
	ok('breaking 31 cuts off junction 32', !!r31 && r31.cutOff.join() === '32', JSON.stringify(r31 && r31.cutOff));
	ok('...with its demand, 100 gpm, not served', !!r31 && Math.abs(r31.unserved / GPM - 100) < 1e-6,
		r31 && r31.unserved / GPM);
	ok('breaking 121 cuts off 31 and 32, 200 gpm', !!r121 && r121.cutOff.slice().sort().join() === '31,32' &&
		Math.abs(r121.unserved / GPM - 200) < 1e-6, JSON.stringify(r121));
	ok('a looped pipe still cuts off nothing', set.byId['111'].cutOff.length === 0);
	ok('the project is unchanged', JSON.stringify(L.getDoc()) === before && L.docGuard());

	const tr = rows(byId.lpn_crit_report);
	ok('one row per broken asset', tr.length === 11, tr.length);
	const first = tr[0] && gotoIn(tr[0][0])[0];
	ok('sorted by severity: 121 first, then 31', !!first && first.textContent === '121' &&
		gotoIn(tr[1][0])[0].textContent === '31', tr.slice(0, 3).map((r) => text(r[0])).join());
	ok('the asset ID is a go-to link', !!first && first.title === PC.lpn_goto_on_map);
	ok('the cut-off cell names the junctions as links', gotoIn(tr[0][2]).map((b) => b.textContent).sort().join() === '31,32',
		text(tr[0][2]));
	ok('the demand cell reads in gpm', /^200 gpm$/.test(text(tr[0][1])), text(tr[0][1]));
	const ths = [];
	(function walk(x) { if (!x) { return; } if (isTag(x, 'th')) { ths.push(x); return; } kids(x).forEach(walk); })(byId.lpn_crit_report);
	const heads = ths.map((t) => kids(t).filter((c) => !isTag(c, 'button')).map((c) => c.textContent || '').join('') || t.textContent);
	ok('headings are the page\'s own words', ths.length === 4 && ths.some((t) => String(t.textContent).indexOf(PC.lpn_crit_col_unserved) >= 0),
		JSON.stringify(heads));

	console.log('\n--- 3. A case that fails to solve is a row, never an abort ---');
	const restore = L.swapEngine((was) => function (m, o) {
		if (!m.nodes.some((n) => n.id === '32')) { return { ok: false, issues: [{ code: 'test-failure', ids: [] }] }; }
		return was(m, o);
	});
	await L.runCrit();
	restore();
	set = L.run();
	ok('the run finished all 11', !!set && set.ok && set.results.length === 11, set && set.results.length);
	const e31 = set.byId['31'];
	ok('31 is an error row that still knows what it cut off', e31.state === 'error' && e31.cutOff.join() === '32' &&
		Math.abs(e31.unserved / GPM - 100) < 1e-6, JSON.stringify(e31));
	const row31 = rows(byId.lpn_crit_report).filter((r) => gotoIn(r[0])[0] && gotoIn(r[0])[0].textContent === '31')[0];
	ok('...and its row says the solve failed', !!row31 && text(row31[3]) === PC.lpn_ff_err_solve, row31 && text(row31[3]));

	console.log('\n--- 4. Selected scope ---');
	L.clearSel();
	L.setScope('selected');
	const kept = L.run();
	await L.runCrit();
	ok('nothing selected: no run', L.run() === kept);
	ok('...and the notice says so', L.notice() === PC.lpn_crit_no_selection, L.notice());
	L.setSelectionList([{ kind: 'link', id: '31' }, { kind: 'link', id: '9' }, { kind: 'node', id: '32' }]);
	await L.runCrit();
	set = L.run();
	ok('Selected breaks exactly the selected links, pump included', !!set && set.results.map((r) => r.id).sort().join() === '31,9',
		set && set.results.map((r) => r.id).join());
	ok('...and says the node was not broken', L.notice() === PC.lpn_crit_skipped.replace('{n}', '1'), L.notice());

	if (fails) { console.log('\n' + fails + ' criticality check(s) FAILED'); process.exit(1); }
	console.log('\nCriticality harness: all checks passed.');
	process.exit(0);
}()).catch((e) => { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });
