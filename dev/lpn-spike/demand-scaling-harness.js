// DEMAND SCALING -- the demands multiplied on a copy, and the largest multiplier the system holds
// above a pressure limit (ROADMAP Task 754). Run with:
//   node dev/lpn-spike/demand-scaling-harness.js
//
// On Net1 (examples/Net1.lwn), through the page's own Run and Find paths:
//   1. Scale 1 reproduces the ordinary solve's pressures, junction by junction.
//   2. Scale 2 lowers every junction's pressure, and the report says which fall below the limit.
//   3. The search answers a multiple of the step, m, where every junction holds the limit at m and
//      some junction does not at m + step -- both checked here by a solve of their own.
//   4. A limit already broken at the demands as they are is said, and the search still answers.
//   5. A limit that holds to the top of the range, and one broken even at zero, are said as such.
//   6. Selected with nothing selected runs nothing; Selected scales only the selection.
//   7. The project is byte-identical before and after every run, and the module never writes to
//      the model it is handed.
//   8. One analysis at a time: criticality refuses while a search runs.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { byId, loadLoopedNetwork, setUnitSet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');
const EC = global.EngCalcs;
const PC = EC.pageConfig;
const ROOT = path.join(__dirname, '..', '..') + '/';

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\trunSolve: runSolve, openBox: openDemandScaleBox, wireBox: wireDemandScaleBox,\n" +
	"\t\trunScale: runDemandScale, runFind: runDemandScaleSearch,\n" +
	"\t\tscaleRun: function () { return dsRun; }, searchRun: function () { return dsSearch; },\n" +
	"\t\tsetScope: function (v) { dsAsk.scope = v; }, setMult: function (t) { dsAsk.multiplier = t; },\n" +
	"\t\tsetMin: function (t) { critFireFlowAsk().minPressure = t; },\n" +
	"\t\tminText: function () { return critFireFlowAsk().minPressure; },\n" +
	"\t\tdocGuard: function () { return dsDocGuard; }, dsBusy: function () { return dsBusy; },\n" +
	"\t\tcurrentModel: function () { var m = assembleModel(); fireFlowAtFrame(m); return m; },\n" +
	"\t\tsolveOnScreen: function (m) { return Promise.resolve(engineFor(m).solve(m)); },\n" +
	"\t\ttoPsi: function (si) { return toDisplay(si, 'lpn_u_pressure'); },\n" +
	"\t\twireCrit: wireCriticalityBox, runCrit: runCriticality, critRun: function () { return critRun; },\n" +
	"\t\tsetSelectionList: setSelectionList, clearSel: clearSelection,\n" +
	"\t\tnotice: function () { var n = document.getElementById('lpn_map_notice'); return n ? n.textContent : ''; },\n" +
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
function openNet1() {
	L.reset();
	const saved = L.acceptImportedText(fs.readFileSync(ROOT + 'examples/Net1.lwn', 'utf8'));
	if (!saved) { throw new Error('Net1.lwn did not open'); }
	L.applySaved(saved);
	L.buildDom();
	L.applyMethodUI();
	L.wireBox();
	L.wireCrit();
	L.runSolve();
	L.openBox();
}
// The lowest junction pressure, in psi, at multiplier m, by a solve of the harness's own through
// the page's engine (Net1 names EPANET), on the network on screen.
async function minPsiAt(m) {
	const model = EC.lpnDemandScaleModel(L.currentModel(), m, null);
	const r = await L.solveOnScreen(model);
	let lo = Infinity;
	model.nodes.forEach((n) => {
		if (n.type === 'junction' && isFinite(r.pressures[n.id])) { lo = Math.min(lo, L.toPsi(r.pressures[n.id])); }
	});
	return lo;
}

(async function () {
	setUnitSet('us');
	openNet1();

	console.log('--- 1. Scale 1 reproduces the ordinary solve ---');
	let before = JSON.stringify(L.getDoc());
	const plain = (await L.solveOnScreen(L.currentModel())).pressures;
	L.setScope('all');
	L.setMult('1');
	ok('the minimum pressure is fire flow\'s own, as the box shows it', L.minText() === '20', L.minText());
	await L.runScale();
	let set = L.scaleRun();
	ok('a run happened and solved', !!set && set.ok, set && set.code);
	ok('every junction is reported', !!set && set.pressures.length === 9, set && set.pressures.length);
	ok('each scaled pressure equals the ordinary solve\'s', !!set && set.pressures.every((x) => Math.abs(x.pressure - plain[x.id]) < 1e-9),
		set && JSON.stringify(set.pressures.map((x) => [x.id, x.pressure - plain[x.id]])));
	ok('...and equals its own unscaled column', !!set && set.pressures.every((x) => x.unscaled === x.pressure));
	ok('the project is unchanged', JSON.stringify(L.getDoc()) === before && L.docGuard());
	ok('the verdict leads with a check mark and reads in psi',
		text(byId.lpn_ds_report).indexOf(PC.lpn_ds_scale_ok.replace('{m}', '1').replace('{pressure}', '20 psi')) >= 0);

	console.log('\n--- 2. Scale 2 lowers every pressure ---');
	L.setMult('2');
	L.setMin('110');
	await L.runScale();
	set = L.scaleRun();
	ok('it solved', !!set && set.ok);
	ok('every junction is lower than unscaled', !!set && set.pressures.every((x) => x.pressure < x.unscaled),
		set && JSON.stringify(set.pressures.map((x) => [x.id, +L.toPsi(x.pressure).toFixed(1), +L.toPsi(x.unscaled).toFixed(1)])));
	ok('the rows are lowest first', !!set && set.pressures.every((x, i, a) => !i || a[i - 1].pressure <= x.pressure));
	const nBelow = set.pressures.filter((x) => L.toPsi(x.pressure) < 110).length;
	ok('the below list is exactly the junctions under 110 psi', set.below.length === nBelow && nBelow > 0, nBelow);
	ok('...and the verdict says how many, with a warning sign', text(byId.lpn_ds_report).indexOf(PC.lpn_ds_scale_below
		.replace('{m}', '2').replace('{n}', String(nBelow)).replace('{pressure}', '110 psi')) >= 0, text(byId.lpn_ds_report).slice(0, 200));
	let tr = rows(byId.lpn_ds_report);
	ok('two tables: nine junctions and the top velocities', tr.length === 9 + Math.min(10, set.velocities.length), tr.length);
	ok('the first row is the lowest junction, as a go-to link', gotoIn(tr[0][0])[0] && gotoIn(tr[0][0])[0].textContent === set.pressures[0].id);
	ok('velocities are highest first, pumps left out', set.velocities.every((x, i, a) => !i || a[i - 1].velocity >= x.velocity) &&
		!set.velocities.some((x) => x.id === '9'));
	ok('the project is unchanged', JSON.stringify(L.getDoc()) === before && L.docGuard());

	console.log('\n--- 3. Find: the largest scale that holds 100 psi ---');
	L.setMin('100');
	await L.runFind();
	let s = L.searchRun();
	ok('it found an answer inside the range', !!s && s.outcome === EC.lpnDemandScaleOutcomes.FOUND, s && s.outcome);
	const m = s.multiplier;
	ok('the answer is above 1 here and a multiple of 0.01', m > 1 && Math.abs(m * 100 - Math.round(m * 100)) < 1e-9, m);
	ok('at m every junction holds 100 psi (own solve)', await minPsiAt(m) >= 100, await minPsiAt(m));
	ok('at m + 0.01 some junction does not (own solve)', await minPsiAt(m + 0.01) < 100, await minPsiAt(m + 0.01));
	ok('the holding probe is the limiting junction at m', s.holding.lowest && L.toPsi(s.holding.lowest.pressure) >= 100 &&
		Math.abs(L.toPsi(s.holding.lowest.pressure) - await minPsiAt(m)) < 1e-9);
	ok('the search took at most 13 solves', s.solves <= 13, s.solves);
	const rep = text(byId.lpn_ds_report);
	ok('the verdict says so', rep.indexOf(PC.lpn_ds_found.replace('{pressure}', '100 psi').replace('{m}', String(m))) >= 0, rep.slice(0, 160));
	const links = gotoIn(byId.lpn_ds_report);
	ok('the limiting junction is a go-to link', links.length >= 1 && links[0].textContent === s.holding.lowest.id &&
		links[0].title === PC.lpn_goto_on_map);
	ok('the project is unchanged', JSON.stringify(L.getDoc()) === before && L.docGuard());

	console.log('\n--- 4. A limit already broken at the demands as they are ---');
	const at1 = await minPsiAt(1);
	L.setMin(String(Math.ceil(at1 + 1)));
	await L.runFind();
	s = L.searchRun();
	ok('it says the system is already below the limit', s.belowAtOne === true && s.outcome === EC.lpnDemandScaleOutcomes.FOUND && s.multiplier < 1,
		JSON.stringify({ o: s.outcome, m: s.multiplier, b: s.belowAtOne }));
	ok('...the answer still brackets the limit', await minPsiAt(s.multiplier) >= Math.ceil(at1 + 1) && await minPsiAt(s.multiplier + 0.01) < Math.ceil(at1 + 1));
	ok('...and the report leads with a warning sign', text(byId.lpn_ds_report).indexOf('⚠') >= 0 &&
		text(byId.lpn_ds_report).indexOf(PC.lpn_ds_found_below.split('{pressure}')[0]) >= 0);

	console.log('\n--- 5. The two ends of the range ---');
	L.setMin('1000');
	await L.runFind();
	s = L.searchRun();
	ok('1000 psi: below even at zero', s.outcome === EC.lpnDemandScaleOutcomes.BELOW_AT_ZERO && s.solves === 2, s.outcome);
	ok('...said with a warning sign', text(byId.lpn_ds_report).indexOf(PC.lpn_ds_below_zero.replace('{pressure}', '1000 psi')) >= 0);
	// A fake solve: pressure 100 m less 1 m per unit of multiplier, so 20x still holds 50 m.
	const fake = (mdl) => {
		const p = {};
		const scale = mdl.nodes.filter((n) => n.type === 'junction')[0].demand / 0.001;
		mdl.nodes.forEach((n) => { if (n.type === 'junction') { p[n.id] = 100 - scale; } });
		return { ok: true, converged: true, pressures: p };
	};
	const toy = { nodes: [{ id: 'R', type: 'reservoir', head: 100 }, { id: 'J', type: 'junction', demand: 0.001 }], links: [] };
	const toyBefore = JSON.stringify(toy);
	s = await EC.lpnDemandScaleSearch(toy, { solve: fake, minPressure: 50, yield: () => Promise.resolve() });
	ok('a limit held at 20x is "the top of the search"', s.outcome === EC.lpnDemandScaleOutcomes.HOLDS_TO_MAX && s.multiplier === 20, s.outcome);
	s = await EC.lpnDemandScaleSearch(toy, { solve: fake, minPressure: 92.5, yield: () => Promise.resolve() });
	ok('toy: the answer is exactly 7.5 on the 0.01 grid', s.outcome === 'found' && s.multiplier === 7.5 && s.failing.multiplier === 7.51,
		JSON.stringify({ m: s.multiplier, f: s.failing && s.failing.multiplier }));
	s = await EC.lpnDemandScaleSearch(toy, { solve: (mdl) => (mdl.nodes[1].demand > 0.004205 ? { ok: true, converged: false } : fake(mdl)),
		minPressure: 0, yield: () => Promise.resolve() });
	ok('a scale that does not solve counts as not holding, and says why', s.outcome === 'found' && s.multiplier === 4.2 &&
		s.failing.ok === false && s.failing.code === EC.lpnDemandScaleCodes.NO_CONVERGENCE, JSON.stringify({ m: s.multiplier, f: s.failing }));
	ok('the module never wrote to the model it was handed', JSON.stringify(toy) === toyBefore);

	console.log('\n--- 6. Selected scope ---');
	L.setMin('20');
	L.clearSel();
	L.setScope('selected');
	const kept = L.scaleRun();
	await L.runScale();
	ok('nothing selected: no run', L.scaleRun() === kept);
	ok('...and the notice says so', L.notice() === PC.lpn_ds_no_selection, L.notice());
	L.setSelectionList([{ kind: 'node', id: '32' }, { kind: 'link', id: '31' }]);
	L.setMult('3');
	await L.runScale();
	set = L.scaleRun();
	ok('Selected ran', !!set && set.ok && set.scaledCount === 1);
	ok('...and says the link was left as it is', L.notice() === PC.lpn_ds_skipped.replace('{n}', '1'), L.notice());
	const p32 = set.pressures.filter((x) => x.id === '32')[0];
	ok('only junction 32\'s demand was scaled: its own pressure falls', p32.pressure < p32.unscaled);
	ok('...and the report says only one junction was scaled', text(byId.lpn_ds_report).indexOf(PC.lpn_ds_scaled_selected.replace('{n}', '1')) >= 0);
	const whole = EC.lpnDemandScaleModel(L.currentModel(), 3, ['32']);
	ok('the copy scaled exactly one junction', whole.nodes.filter((n, i) => n !== L.currentModel().nodes[i] && n.type === 'junction').length >= 1 &&
		whole.nodes.filter((n) => n.type === 'junction' && n.id !== '32').every((n) => n.demand === L.currentModel().nodes.filter((o) => o.id === n.id)[0].demand));
	ok('the project is unchanged', JSON.stringify(L.getDoc()) === before && L.docGuard());
	L.setScope('all');
	L.clearSel();

	console.log('\n--- 7. Bad input ---');
	L.setMult('-1');
	const kept7 = L.scaleRun();
	await L.runScale();
	ok('a negative scale runs nothing and says so', L.scaleRun() === kept7 && L.notice() === PC.lpn_ds_bad_multiplier, L.notice());
	L.setMult('abc');
	await L.runScale();
	ok('...and so does text', L.scaleRun() === kept7);
	L.setMult('2');

	console.log('\n--- 8. One analysis at a time ---');
	const pf = L.runFind();
	const critBefore = L.critRun();
	ok('a search is running', L.dsBusy());
	await L.runCrit();
	ok('criticality refuses while it runs', L.critRun() === critBefore && L.notice() === PC.lpn_crit_busy, L.notice());
	await pf;
	ok('the busy flag clears', !L.dsBusy());
	ok('the project is unchanged after everything', JSON.stringify(L.getDoc()) === before && L.docGuard());

	if (fails) { console.log('\n' + fails + ' demand scaling check(s) FAILED'); process.exit(1); }
	console.log('\nDemand scaling harness: all checks passed.');
	process.exit(0);
}()).catch((e) => { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });
