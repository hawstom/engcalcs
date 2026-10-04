// A SCENARIO CARRIES ITS OWN TOTAL RUN TIME AND HYDRAULIC TIME STEP (ROADMAP Task 755). Run with:
//   node dev/lpn-spike/scenario-time-option-harness.js
//
// Tom, 2026-09-30: *"A Demand Multiplier column with the alternatives? What about other settings?"*
// Sue ranked a steady against a 24-hour run, and the duration, next. On Net1 (a 24-hour project):
//   1. A project with no scenario options opens, saves and exports exactly as before.
//   2. Typed in the Alternatives preview, a scenario's own run time and step reach the model, the
//      badge and the transport, and never the project's own [TIMES] block. Bad text writes nothing.
//   3. Each accepted edit is one undo step, and undo and redo walk it.
//   4. A duration of 0 is a steady-state run, in a project that runs 24 hours.
//   5. The .inp export writes the OPEN scenario's [TIMES]; from Base, the document's, unchanged.
//   6. Saved and reopened, the values survive; a malformed block in a file is dropped.
//   7. The scenario comparison runs each scenario on its own clock, states once what does not vary,
//      and lists per row what does.
//
// Mutations this must catch: docTimes() reading doc.times (2, 7); setScenarioTime() writing
// doc.times (2); no saveUndoSnapshot() in commitAltOption() (3); the export ignoring opts.times (5);
// sanitizeScenarioTimes() not called (6); the compare solving every scenario steady (7).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const { ROOT, byId, ensure, setUnitSet, loadLoopedNetwork, warmEpanet } = require('./lpn-dom-stub.js');
const { EXAMPLE_EXPORTS } = require('./example-fixture.js');
const PC = global.EngCalcs.pageConfig;

require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-epanet.js');
require(ROOT + 'js/lpn-time.js');

const L = loadLoopedNetwork(
	EXAMPLE_EXPORTS +
	"\t\tgetDoc: function () { return doc; }, getScenarios: function () { return scenarios; },\n" +
	"\t\tbyIdScn: scenarioById, createScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tactiveId: function () { return project.activeScenario; },\n" +
	"\t\tcommit: commitAltOption, effectiveTimes: effectiveTimes, extended: effectiveTimesExtended,\n" +
	"\t\tassembleModel: assembleModel, overrideCount: overrideCount,\n" +
	"\t\tundo: undo, redo: redo, undoDepth: function () { return undoStack.length; },\n" +
	"\t\tserializeProject: serializeProject,\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(serializeProject(), inpExportOptions()); },\n" +
	"\t\tcompare: runScenarioCompare, rebuildReport: rebuildScenarioCompareReport,\n" +
	"\t\topenCmp: function () { document.getElementById('lpn_scncmp_box').style.display = 'flex'; },\n" +
	"\t\trebuildAlt: rebuildAlternativesTable,\n" +
	"\t\trefreshStatus: refreshScenarioStatus,\n" +
	"\t\tsetEngine: function (e) { settings.engine = e; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);
const EC = global.EngCalcs;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function kids(n) { if (!n) { return []; } return (n.children && n.children.length) ? n.children : (n.childNodes || []); }
function walk(n, fn) { fn(n); kids(n).forEach(function (k) { walk(k, fn); }); }
function text(n) {
	let out = '';
	walk(n, function (x) { if (!kids(x).length) { out += (x.textContent || '') + '|'; } });
	return out;
}
function rowsOf(host) { const out = []; walk(host, function (x) { if (x.tagName === 'TR' || x._tag === 'tr') { out.push(x); } }); return out; }
function cellText(c) {
	const inp = kids(c).filter(function (k) { return k.tagName === 'INPUT' || k._tag === 'input'; })[0];
	return inp ? String(inp.value) : String(c.textContent || '');
}
// The Alternatives preview's own edit path: a change event on the input, here its handler.
function type(id, key, value) { L.commit(L.byIdScn(id), key, { value: value }); }
function timesLines(inp) {
	const m = /\[TIMES\]\n([\s\S]*?)\n\n/.exec(inp);
	return m ? m[1] : '';
}

(async function () {
	setUnitSet('us');
	L.buildLayers();
	await warmEpanet();
	const saved = L.acceptImportedText(fs.readFileSync(ROOT + 'examples/Net1.lwn', 'utf8'));
	L.applySaved(saved);
	L.buildDom();
	L.applyMethodUI();
	L.setEngine('epanet');
	const doc = L.getDoc();

	console.log('--- 1. a project with no scenario options is what it always was ---');
	const fileBefore = JSON.stringify(L.serializeProject());
	const inpBefore = L.exportInp();
	ok('Net1 runs 24 hours', doc.times && doc.times.duration === 86400, doc.times && doc.times.duration);
	ok('Base runs on the document\'s own [TIMES] block, the same object', L.effectiveTimes() === doc.times);
	L.applySaved(JSON.parse(fileBefore));
	L.buildDom();
	ok('saved and reopened, the file is byte-identical', JSON.stringify(L.serializeProject()) === fileBefore);
	ok('...and no scenario carries a `times` block', L.getScenarios().every(function (s) { return !s.times; }));

	console.log('\n--- 2. a scenario\'s own run time and step, typed in the Alternatives preview ---');
	const two = L.createScenario('Two days');
	const undo0 = L.undoDepth();
	type(two.id, 'duration', 'abc');
	type(two.id, 'duration', '-1');
	type(two.id, 'hydraulicStep', '0');
	ok('text that is not a usable time writes nothing', !L.byIdScn(two.id).times, JSON.stringify(L.byIdScn(two.id).times));
	ok('...and pushes no undo step', L.undoDepth() === undo0, L.undoDepth() + ' vs ' + undo0);
	type(two.id, 'duration', '48:00');
	type(two.id, 'hydraulicStep', '0:30');
	let s2 = L.byIdScn(two.id);
	ok('the scenario holds 48:00 and 0:30, in seconds, with the typed text',
		s2.times && s2.times.duration === 172800 && s2.times.hydraulicStep === 1800 &&
		s2.times.text.duration === '48:00' && s2.times.text.hydraulicStep === '0:30', JSON.stringify(s2.times));
	ok('the project\'s own block is untouched', doc.times.duration === 86400 && doc.times.hydraulicStep === 3600,
		doc.times.duration + ' / ' + doc.times.hydraulicStep);
	ok('the open scenario runs on its own clock', L.effectiveTimes().duration === 172800 && L.effectiveTimes().hydraulicStep === 1800);
	const m2 = L.assembleModel();
	ok('...and that clock is the one the engine is handed', m2.time && m2.time.times.duration === 172800 && m2.time.times.hydraulicStep === 1800,
		m2.time && JSON.stringify(m2.time.times));
	ok('...and the one the transport steps through', EC.lpnReportTimes(L.effectiveTimes()).length === 49);
	ok('the badge counts each as a custom value', L.overrideCount(s2) === 2, L.overrideCount(s2));
	ok('typing the project\'s own value counts nothing', (function () {
		type(two.id, 'hydraulicStep', '1:00');
		const n = L.overrideCount(L.byIdScn(two.id));
		type(two.id, 'hydraulicStep', '0:30');
		return n === 1;
	}()));
	L.switchScenario('base');
	ok('Base still runs 24 hours', L.effectiveTimes() === doc.times && L.assembleModel().time.times.duration === 86400);
	L.switchScenario(two.id);

	console.log('\n--- 3. undo and redo ---');
	const depth = L.undoDepth();
	type(two.id, 'duration', '72:00');
	ok('one accepted edit is one undo step', L.undoDepth() === depth + 1, L.undoDepth() - depth);
	L.undo();
	ok('undo puts the scenario\'s 48:00 back', L.byIdScn(two.id).times.duration === 172800, L.byIdScn(two.id).times.duration);
	ok('...and the open scenario runs on it', L.effectiveTimes().duration === 172800);
	L.redo();
	ok('redo puts 72:00 back', L.byIdScn(two.id).times.duration === 259200);
	L.undo();
	type(two.id, 'duration', '');
	ok('a blank inherits again', L.byIdScn(two.id).times && L.byIdScn(two.id).times.duration === undefined &&
		L.effectiveTimes().duration === 86400);
	L.undo();
	ok('...and undoing the blank restores the scenario\'s own', L.byIdScn(two.id).times.duration === 172800);
	s2 = L.byIdScn(two.id);

	console.log('\n--- 4. a duration of 0 is a steady-state run ---');
	const steady = L.createScenario('Steady');
	type(steady.id, 'duration', '0');
	ok('a steady scenario in a 24-hour project is not a period run', !L.extended() && L.byIdScn(steady.id).times.duration === 0);
	ok('...and its model says so', !EC.lpnTimeIsExtended(L.assembleModel().time.times));
	ok('...while Base is still a period run', (function () { L.switchScenario('base'); const x = L.extended(); return x; }()));

	console.log('\n--- 5. the .inp export writes the open scenario\'s [TIMES] ---');
	L.switchScenario('base');
	const inpBase = L.exportInp();
	ok('an export from Base is the document\'s, character for character', inpBase.ok && inpBase.inp === inpBefore.inp);
	L.switchScenario(two.id);
	const inpTwo = L.exportInp(), tl = timesLines(inpTwo.inp), tb = timesLines(inpBefore.inp);
	ok('an export from "Two days" states its own Duration and Hydraulic Timestep',
		/Duration\s+48:00/.test(tl) && /Hydraulic Timestep\s+0:30/.test(tl), tl.replace(/\n/g, ' / '));
	ok('...and every other [TIMES] line as the document states it',
		tl.split('\n').filter(function (l) { return !/Duration|Hydraulic/.test(l); }).join('\n') ===
		tb.split('\n').filter(function (l) { return !/Duration|Hydraulic/.test(l); }).join('\n'));
	ok('...without writing the document', doc.times.duration === 86400);
	const bare = JSON.parse(JSON.stringify(L.serializeProject()));
	bare.times = null;
	const out = EC.lpnExportInp(bare, { times: { duration: 172800, text: { duration: '48:00' } } });
	ok('a document with no [TIMES] exports only the scenario\'s own line, not seven defaults',
		out.ok && timesLines(out.inp).trim().split('\n').length === 1 && /Duration\s+48:00/.test(timesLines(out.inp)),
		timesLines(out.inp));

	console.log('\n--- 6. saved and reopened ---');
	const file = JSON.parse(JSON.stringify(L.serializeProject()));
	L.applySaved(JSON.parse(JSON.stringify(file)));
	L.buildDom();
	const back = L.getScenarios().filter(function (s) { return s.name === 'Two days'; })[0];
	ok('the scenario\'s run time and step survive, with their text', back && back.times &&
		back.times.duration === 172800 && back.times.text.hydraulicStep === '0:30', back && JSON.stringify(back.times));
	const bad = JSON.parse(JSON.stringify(file));
	bad.scenarios.forEach(function (s) {
		if (s.isBase) { s.times = { duration: 3600 }; }
		if (s.name === 'Steady') { s.times = { duration: 'x', hydraulicStep: -3 }; }
	});
	L.applySaved(bad);
	L.buildDom();
	ok('a file\'s Base block and a malformed scenario block are dropped on the way in',
		L.getScenarios().every(function (s) { return s.isBase || s.name !== 'Steady' ? !s.isBase || !s.times : !s.times; }),
		JSON.stringify(L.getScenarios().map(function (s) { return s.times || null; })));
	L.applySaved(JSON.parse(JSON.stringify(file)));
	L.buildDom();

	console.log('\n--- 7. the scenario comparison ---');
	const twoId = L.getScenarios().filter(function (s) { return s.name === 'Two days'; })[0].id;
	const steadyId = L.getScenarios().filter(function (s) { return s.name === 'Steady'; })[0].id;
	L.switchScenario('base');
	L.openCmp();
	const before = JSON.stringify(L.getDoc());
	const rows = await L.compare();
	const row = function (id) { return rows.filter(function (r) { return r.scn.id === id; })[0]; };
	ok('every scenario solved', rows.length === 3 && rows.every(function (r) { return r.ok; }),
		JSON.stringify(rows.map(function (r) { return r.ok ? 'ok' : r.why; })));
	ok('Base and "Two days" were run over a period, "Steady" was solved at one moment',
		row('base').period && row(twoId).period && !row(steadyId).period);
	ok('...each on its own clock', row('base').opts.times.duration === 86400 && row(twoId).opts.times.duration === 172800 &&
		row(steadyId).opts.times.duration === 0);
	ok('a period row says when its extremes happened', typeof row(twoId).minT === 'number' && typeof row(twoId).maxT === 'number');
	ok('the open scenario is still Base, and the document untouched', L.activeId() === 'base' && JSON.stringify(L.getDoc()) === before);
	L.rebuildReport();
	const host = byId.lpn_scncmp_report, all = text(host);
	ok('the header states once what does not vary', all.indexOf(PC.lpn_scncmp_same) >= 0 &&
		[PC.bpn_method, PC.lpn_view_units, PC.lpn_settings_accuracy, PC.lpn_settings_trials].every(function (k) { return all.indexOf(k) >= 0; }));
	const trs = rowsOf(host), head = kids(trs[0]).map(cellText);
	const DMi = head.indexOf(PC.bpn_demand_mult), Di = head.indexOf(PC.lpn_time_duration), Hi = head.indexOf(PC.lpn_time_hyd_step);
	ok('the table lists per scenario what does vary', DMi > 0 && Di > 0 && Hi > 0, JSON.stringify(head));
	const byName = {};
	trs.slice(1).forEach(function (tr) { const c = kids(tr).map(cellText); byName[c[0].split(' (')[0]] = c; });
	ok('"Two days" reads 48:00 and 0:30', byName['Two days'] && byName['Two days'][Di] === '48:00' && byName['Two days'][Hi] === '0:30',
		JSON.stringify(byName['Two days']));
	// Its own typed text, `0`, since that is what was typed (the [TIMES] rule: we write back what came in).
	ok('"Steady" reads 0, and no time step', byName.Steady && byName.Steady[Di] === '0' && byName.Steady[Hi] === '–',
		JSON.stringify(byName.Steady));
	ok('the period note is there', all.indexOf(PC.lpn_scncmp_period_note) >= 0);

	console.log('\n--- the Alternatives preview shows them ---');
	const altHost = ensure('lpn_alt_report');
	L.rebuildAlt();
	const at = rowsOf(altHost), ah = kids(at[0]).map(cellText);
	const col = function (label) { return ah.findIndex(function (h) { return h.indexOf(label) === 0; }); };
	const aD = col(PC.lpn_time_duration), aH = col(PC.lpn_time_hyd_step), an = {};
	at.slice(1).forEach(function (tr) { const k = kids(tr); an[cellText(k[0])] = k; });
	ok('Base shows the project\'s values as text', cellText(an[PC.lpn_scenario_base][aD]) === '24:00' &&
		kids(an[PC.lpn_scenario_base][aD]).every(function (k) { return k.tagName !== 'INPUT' && k._tag !== 'input'; }));
	ok('a scenario shows its own in a box', cellText(an['Two days'][aD]) === '48:00' && cellText(an['Two days'][aH]) === '0:30');
	ok('...and one that inherits shows a blank box', cellText(an.Steady[aH]) === '');

	// TOM, 2026-10-04, on a preview: *"I can't find Scenario options or the tip in question."* The
	// column tips were a bare `title` (nothing on the heading said a tip existed, and touch never
	// shows one), the blank box did not say what blank means, and Settings, Calculation, Time sits
	// thousands of pixels down a box that opens on Symbology.
	const optTh = [PC.lpn_time_duration, PC.lpn_time_hyd_step].map(function (lab) { return kids(at[0])[col(lab)]; });
	ok('each calculation-option heading shows a ? for its tip', optTh.every(function (th) {
		let q = false; walk(th, function (x) { if (/(^|\s)ec-tip(\s|$)/.test(x.className || '')) { q = true; } }); return q; }));
	const blank = kids(an.Steady[aH]).filter(function (k) { return k._tag === 'input'; })[0];
	ok('a blank box shows the Base value it falls back to', blank && blank.placeholder === '1:00', blank && blank.placeholder);
	const door = kids(an[PC.lpn_scenario_base][aD]).filter(function (k) { return k._tag === 'button'; })[0];
	ok('Base\'s own value is a button into Settings, Time', !!door && door.textContent === '24:00');
	if (door) {
		const sb = ensure('lpn_settings_box'); sb.style.display = 'none';
		(door._listeners.click || []).forEach(function (f) { f(); });
		ok('...and pressing it opens the Settings box', sb.style.display === 'flex', sb.style.display);
		sb.style.display = 'none';
	}

	console.log('\n--- 8. Settings > Time states which scenarios override it ---');
	// Two days: 48:00 and 0:30; Steady: duration 0 and no step. Rebuilt from the document each time.
	EC.lpnTimeRenderSettings();
	const tf = ensure('lpn_set_time_fields'), notes = [];
	walk(tf, function (x) { if (/(^|\s)lpn-time-ovr(\s|$)/.test(x.className || (x.getAttribute && x.getAttribute('class')) || '')) { notes.push(x); } });
	ok('a note sits under each of the two options', notes.length === 2, notes.length);
	const shown = function (n) { return n.style.display !== 'none' ? String(n.textContent) : ''; };
	ok('the run time note names both scenarios with their own values',
		shown(notes[0]).indexOf(PC.lpn_time_scn_overrides) === 0 && shown(notes[0]).indexOf('Two days (48:00)') > 0 &&
		shown(notes[0]).indexOf('Steady (0)') > 0, shown(notes[0]));
	ok('the time step note names only the scenario that states one', shown(notes[1]).indexOf('Two days (0:30)') > 0 &&
		shown(notes[1]).indexOf('Steady') < 0, shown(notes[1]));
	let btns = []; walk(notes[0], function (x) { if (x.tagName === 'BUTTON' || x._tag === 'button') { btns.push(x); } });
	ok('each name is a button', btns.map(function (b) { return b.textContent; }).sort().join() === 'Steady,Two days', btns.length);
	type(steadyId, 'duration', '');
	L.refreshStatus();
	ok('clearing an override takes the scenario out of the note, without a rebuild of the fields',
		shown(notes[0]).indexOf('Steady') < 0 && shown(notes[0]).indexOf('Two days (48:00)') > 0, shown(notes[0]));
	type(two.id, 'duration', '');
	type(two.id, 'hydraulicStep', '');
	L.refreshStatus();
	ok('with no overrides left both notes are hidden', shown(notes[0]) === '' && shown(notes[1]) === '',
		shown(notes[0]) + ' / ' + shown(notes[1]));

	// TOM, 2026-10-04: the override tips still carry the placeholder, and the count is no longer "custom".
	ok('the overrides tip keeps its {base} placeholder', /\{base\}/.test(PC.lpn_scenario_overrides_tip), PC.lpn_scenario_overrides_tip);
	ok('the count heading does not say "custom"', !/custom/i.test(PC.lpn_scenario_overrides), PC.lpn_scenario_overrides);

	console.log(fails ? '\n' + fails + ' scenario time option check(s) FAILED' : '\nScenario time option harness: all checks passed.');
	process.exit(fails ? 1 : 0);
}()).catch(function (e) { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });
