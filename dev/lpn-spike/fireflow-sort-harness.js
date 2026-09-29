// EVERY FIRE-FLOW RESULTS COLUMN SORTS FROM ITS HEADING -- Tom, 2026-09-28: *"Sort Fire flow
// analysis columns."* Run with:
//   node dev/lpn-spike/fireflow-sort-harness.js
//
// A real sweep on the built-in example, then every heading driven through its own arrow: the first
// press sorts ascending, the second descending; numbers sort as numbers; blank cells (a dash) go
// last both ways; the arrow says which column and which way; the go-to links still go to the right
// junction after a sort; and the arrow is a button that keeps the keyboard's focus across the
// rebuild.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const { byId, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS, openExample } = require('./example-fixture.js');
const PC = global.EngCalcs.pageConfig;

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\trunSolve: runSolve, openFireFlowBox: openFireFlowBox, wireFireFlowBox: wireFireFlowBox,\n" +
	"\t\trunFireFlowSweep: runFireFlowSweep, run: function () { return fireFlowRun; },\n" +
	"\t\tsetAsk: function (k, v) { if (!fireFlowAsk) { fireFlowAsk = fireFlowDefaults(); } fireFlowAsk[k] = v; },\n" +
	"\t\tsetNodeIdPrefix: function (p) { labelSettings.prefix = labelSettings.prefix || {};\n" +
	"\t\t\tlabelSettings.prefix.node = labelSettings.prefix.node || {};\n" +
	"\t\t\tlabelSettings.prefix.node.id = p; },\n" +
	"\t\trebuildFireFlowReport: rebuildFireFlowReport,\n" +
	"\t\tselectedRefs: selectedRefs, setSelectionList: setSelectionList, clearSel: clearSelection,\n" +
	"\t\tlocatedRef: locatedElementRef,\n" +
	"\t\tsortIds: function (rs, c, d) { var keep = ffSortState; ffSortState = { col: c, dir: d };\n" +
	"\t\t\tvar out = ffSortResults(rs).map(function (r) { return r.id; }); ffSortState = keep; return out; },\n" +
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
function rows(el) {
	const out = [];
	(function walk(x) {
		if (!x) { return; }
		if (isTag(x, 'tr')) { const tds = kids(x).filter((c) => isTag(c, 'td')); if (tds.length) { out.push(tds); } return; }
		kids(x).forEach(walk);
	})(el);
	return out;
}
function links(el) {
	const out = [];
	(function walk(x) {
		if (!x) { return; }
		if (isTag(x, 'button') && String(x.className || x['class'] || '').indexOf('lpn-ff-goto') >= 0) { out.push(x); }
		kids(x).forEach(walk);
	})(el);
	return out;
}
function click(b) { ((b._listeners && b._listeners.click) || []).forEach((f) => f({})); }

function heads(el) {
	const out = [];
	(function walk(x) { if (!x) { return; } if (isTag(x, 'th')) { out.push(x); return; } kids(x).forEach(walk); })(el);
	return out;
}
function arrowOf(th) { return kids(th).filter((c) => isTag(c, 'button'))[0]; }
function cls(e) { return String(e.className || e['class'] || ''); }
function press(col) { const a = arrowOf(heads(byId.lpn_ff_report)[col]); click(a); }
function colVals(col, fn) { return rows(byId.lpn_ff_report).map((tds) => fn(tds, col)); }
const idOrder = () => rows(byId.lpn_ff_report).map((tds) => links(tds[0])[0].textContent);

(async function () {
	setUnitSet('us');
	L.reset();
	openExample(L, 'us');
	L.wireFireFlowBox();
	L.runSolve();
	L.openFireFlowBox();
	L.setAsk('required', '3000');
	L.setAsk('design', 'all');
	await L.runFireFlowSweep();
	const set = L.run();
	const byId2 = {}; set.results.forEach((r) => { byId2[r.id] = r; });
	L.rebuildFireFlowReport();
	const hs = heads(byId.lpn_ff_report);
	ok('every heading carries a sort arrow', hs.length === 10 && hs.every((h) => arrowOf(h) && cls(arrowOf(h)).indexOf('lpn-pane-sortarrow') >= 0), hs.length);
	ok('...a button, so Tab reaches it', hs.every((h) => arrowOf(h).type === 'button'));
	ok('no column is marked sorted before one is pressed', hs.every((h) => cls(arrowOf(h)).indexOf('active') < 0));

	console.log('\n--- a number column: Available flow ---');
	const avail = (ids) => ids.map((t) => byId2[t.replace(/^[^J]*/, '')].available);
	press(4);
	let a = avail(idOrder());
	const nums = a.filter((v) => typeof v === 'number' && isFinite(v));
	ok('the first press sorts ascending, numerically', nums.every((v, i) => i === 0 || nums[i - 1] <= v), JSON.stringify(a));
	ok('...blanks last', a.slice(nums.length).every((v) => !(typeof v === 'number' && isFinite(v))));
	let h4 = arrowOf(heads(byId.lpn_ff_report)[4]);
	ok('...and the arrow says so (shown, pointing up)', cls(h4).indexOf('lpn-pane-sortarrow-active') >= 0 && cls(h4).indexOf('desc') < 0, cls(h4));
	ok('...and it kept the keyboard\'s focus across the rebuild', global.document.activeElement === h4);
	press(4);
	a = avail(idOrder());
	const nums2 = a.filter((v) => typeof v === 'number' && isFinite(v));
	ok('the second press sorts descending', nums2.every((v, i) => i === 0 || nums2[i - 1] >= v), JSON.stringify(a));
	ok('...blanks still last', a.slice(nums2.length).every((v) => !(typeof v === 'number' && isFinite(v))));
	h4 = arrowOf(heads(byId.lpn_ff_report)[4]);
	ok('...and the arrow points down', cls(h4).indexOf('lpn-pane-sortarrow-desc') >= 0);

	console.log('\n--- the text column: Junction ---');
	press(0);
	const ids = idOrder().map((t) => t.replace('NODE-', ''));
	const want = ids.slice().sort((x, y) => x.localeCompare(y, undefined, { numeric: true }));
	ok('Junction sorts by ID, naturally', JSON.stringify(ids) === JSON.stringify(want), JSON.stringify(ids));
	ok('...and the other column\'s arrow is no longer marked', cls(arrowOf(heads(byId.lpn_ff_report)[4])).indexOf('active') < 0);

	console.log('\n--- every column sorts ---');
	for (let c = 0; c < 10; c++) {
		const before = JSON.stringify(idOrder());
		press(c); const up = idOrder();
		press(c); const down = idOrder();
		ok('column ' + c + ' (' + hs[c].textContent.slice(0, 24) + ') sorts both ways', up.length === set.results.length && down.length === set.results.length,
			before !== JSON.stringify(up) || JSON.stringify(up) !== JSON.stringify(down) ? 'order changes' : 'all equal');
	}

	console.log('\n--- blanks go last both ways (records with no answer) ---');
	const recs = [{ id: 'A', available: 5, state: 'pass' }, { id: 'B', state: 'error' }, { id: 'C', available: 1, state: 'pass' },
		{ id: 'D', available: NaN, state: 'error' }, { id: 'E', available: 30, state: 'pass' }];
	ok('ascending: numbers low to high, then the blanks', L.sortIds(recs, 4, 1).join() === 'C,A,E,B,D', L.sortIds(recs, 4, 1).join());
	ok('descending: numbers high to low, then the blanks', L.sortIds(recs, 4, -1).join() === 'E,A,C,B,D', L.sortIds(recs, 4, -1).join());
	ok('10 sorts after 9, not before 2', L.sortIds([{ id: 'x', available: 10, state: 'pass' }, { id: 'y', available: 9, state: 'pass' },
		{ id: 'z', available: 2, state: 'pass' }], 4, 1).join() === 'z,y,x');

	console.log('\n--- the links still go where they say after a sort ---');
	press(4);
	L.clearSel();
	const r0 = rows(byId.lpn_ff_report)[0];
	const l0 = links(r0[0])[0];
	click(l0);
	ok('the first row\'s link goes to the junction it names', JSON.stringify(L.selectedRefs()) === JSON.stringify([{ kind: 'node', id: l0.textContent.replace(/^NODE-/, '') }]),
		l0.textContent + ' -> ' + JSON.stringify(L.selectedRefs()));
	const clickHead = heads(byId.lpn_ff_report)[1];
	((clickHead._listeners && clickHead._listeners.click) || []).forEach((f) => f({}));
	ok('a click on the heading itself sorts too', cls(arrowOf(heads(byId.lpn_ff_report)[1])).indexOf('lpn-pane-sortarrow-active') >= 0);

	if (fails) { console.log('\n' + fails + ' fire-flow sort check(s) FAILED'); process.exit(1); }
	console.log('\nFire-flow sort harness: all checks passed.');
	process.exit(0);
}()).catch((e) => { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });
