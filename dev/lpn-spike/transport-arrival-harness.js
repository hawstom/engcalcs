// DOES THE TRANSPORT STRIP KNOW A PROJECT ARRIVED? Run with:
//   node dev/lpn-spike/transport-arrival-harness.js
//
// **THE DEFECT THIS EXISTS FOR WAS FOUND BY A FIRST-TIME USER, 2026-09-09.** Tom sat a colleague
// in front of the map; the colleague opened EPANET Net3 from the gallery, reached for the play
// controls, and the tip said the project had no extended period simulation set. Net3 states a
// 24-hour duration. The sentence was false, and the reason it was false is the thing this file
// guards:
//
//   The strip is built ONCE, by wireToolbar(), over the EMPTY STARTUP DOCUMENT -- which really
//   does have one moment and really should be inert. Every state change after that goes through
//   renderTransport(). Nothing called it when a project ARRIVED, so the three player controls and
//   the step selector kept the born state for the life of the page.
//
// **AND THE HARNESS THAT COULD HAVE CAUGHT IT WAS ALREADY GREEN.** small-screen-harness.js asserts
// a LIVE transport on Net3 -- 25 stops, enabled controls -- and it passed throughout, because it
// sets the document and THEN builds the toolbar. That is the boot order, and the boot order is the
// one order in which this defect cannot happen. So the whole point here is ORDER: mount the strip
// on the startup document first, exactly as the page does, and only then let a project arrive.
//
// Everything below goes through the page's own chain -- applySaved() and refreshAllFromDocument()
// for a saved project, lpnInpParse() and docFromInp() for an imported one. Nothing here assembles
// a document of its own (dev/session-handoff.md section 3: a harness that builds its own model can
// be green while the feature does not work).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const stub = require('./lpn-dom-stub.js');
const ROOT = stub.ROOT;

// js/looped-network.js mounts the strip through EngCalcs.lpnTimeMountToolbar; without these two
// the run group is built EMPTY and every assertion below passes on nothing at all.
require(path.join(ROOT, 'js', 'lpn-patterns.js'));
require(path.join(ROOT, 'js', 'lpn-time.js'));
require(path.join(ROOT, 'js', 'lpn-inp.js'));

const PC = global.EngCalcs.pageConfig;

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

const L = stub.loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, setDoc: function (d) { doc = d; },\n" +
	"\t\tseedDefaultInputs: seedDefaultInputs, wireToolbar: wireToolbar,\n" +
	"\t\tapplySaved: applySaved, refreshAllFromDocument: refreshAllFromDocument,\n" +
	"\t\tserializeProject: serializeProject, docFromInp: docFromInp,\n" +
	"\t\tapplyUnits: function (p) { applyUnitSelections(inpUnitSelections(p)); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

// The stub's getElementById() answers from a fixed registry, and the strip's controls are made
// with createElement() and appended -- so they are found by walking the toolbar the page built,
// which is also the only way to be sure they are ON it.
function find(root, id) {
	let hit = null;
	(function walk(n) {
		if (!n || hit) { return; }
		if (n.id === id) { hit = n; return; }
		(n.children || []).forEach(walk);
	}(root));
	return hit;
}
function buttons(root) {
	const out = [];
	(function walk(n) { if (n._tag === 'button') { out.push(n); } (n.children || []).forEach(walk); }(root));
	return out;
}
function optionText(o) { return o._text || o.textContent || ''; }

// ============================================================================================
// 1. THE PAGE'S OWN ORDER: the startup document, then the strip
// ============================================================================================
stub.setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
L.wireToolbar();

const toolbar = document.getElementById('lpn_toolbar');
const step = find(toolbar, 'lpn_time_step');
const speed = find(toolbar, 'lpn_time_speed');

console.log('\n--- 1. the strip as it is BORN, over the empty startup document ---');
ok('the step selector is on the toolbar', !!step);
ok('the speed selector is on the toolbar', !!speed);
ok('one moment, so the step selector holds one row', step.children.length === 1,
	step.children.length + ' rows');
ok('...and the player controls are disabled, which is the honest state here', step.disabled);
ok('...and they say why, in the words lang.ec.en.php states', step.title === PC.lpn_time_no_period,
	JSON.stringify(String(step.title).slice(0, 40)));

// ============================================================================================
// 2. NET3 ARRIVES -- the gallery, File > Open, a tab switch: all one seam
// ============================================================================================
// The fixture is the file the gallery actually serves, read rather than described.
const NET3_TEXT = fs.readFileSync(path.join(ROOT, 'dev', 'water-network-examples', 'Net3.lwn'), 'utf8');
function net3() { return JSON.parse(NET3_TEXT); }

const saved = net3();
L.applySaved(saved);
L.refreshAllFromDocument();

console.log('\n--- 2. EPANET Net3, opened onto a page whose strip was built on the empty document ---');
const STOPS = global.EngCalcs.lpnReportTimes(L.getDoc().times);
ok('the DOCUMENT carries the clock the file states', L.getDoc().times.duration === 86400,
	String(L.getDoc().times && L.getDoc().times.duration));
ok('...so the reporting grid is 25 stops', STOPS.length === 25, STOPS.length + ' stops');
ok('the step selector now holds one row per stop', step.children.length === STOPS.length,
	step.children.length + ' rows');
ok('...and the player controls are LIVE', !step.disabled);
ok('...and the tip no longer says the project has no extended period simulation',
	step.title !== PC.lpn_time_no_period, JSON.stringify(String(step.title).slice(0, 40)));

// The three transport buttons, by the class css/engcalcs.css exempts from the icon-only styling.
const players = buttons(toolbar).filter((b) => String(b['class'] || '').indexOf('lpn-transport-btn') >= 0);
ok('all three player buttons are on the strip', players.length === 3, players.length + ' buttons');
ok('...and none of them is disabled on a 24-hour project', players.every((b) => !b.disabled));
ok('...and none of them carries the no-period sentence',
	players.every((b) => b.title !== PC.lpn_time_no_period));

// ============================================================================================
// 3. THE FIX DID NOT SIMPLY ENABLE EVERYTHING
// ============================================================================================
// A project with no duration is Tom's own 2026-08-19 case (Net3-World, which carries no [TIMES]
// block at all): one moment, three disabled controls, and the sentence saying so. An arrival has
// to be able to put the strip BACK into that state, or the repair is just a stuck switch the other
// way round.
console.log('\n--- 3. and a project with no duration goes back to the inert strip ---');
const still = net3();
still.times = null;
L.applySaved(still);
L.refreshAllFromDocument();
ok('one row again', step.children.length === 1, step.children.length + ' rows');
ok('...disabled again', step.disabled);
ok('...and the no-period sentence is back, which is TRUE of this project',
	step.title === PC.lpn_time_no_period);

// ============================================================================================
// 4. THE CLOCK ON THE ROWS FOLLOWS THE ARRIVING PROJECT
// ============================================================================================
// The rows were rebuilt only when the STOP LIST changed, so a project stating the same reporting
// grid from a different hour kept the hours of the project before it -- a wrong number rather than
// a missing one, and invisible to anybody who only ever opens one project.
console.log('\n--- 4. the clock time on each row belongs to the project on screen ---');
L.applySaved(net3());
L.refreshAllFromDocument();
const midnightRow = optionText(step.children[0]);
const sixAm = net3();
sixAm.times.startClock = 6 * 3600;
sixAm.times.text.startClock = '6 am';
L.applySaved(sixAm);
L.refreshAllFromDocument();
const sixAmRow = optionText(step.children[0]);
ok('the same grid from a different hour redraws the rows', midnightRow !== sixAmRow,
	JSON.stringify(midnightRow) + ' vs ' + JSON.stringify(sixAmRow));
ok('...and the first row states the hour this project starts at',
	sixAmRow.indexOf(global.EngCalcs.lpnTimeClockText(sixAm.times, 0)) >= 0,
	JSON.stringify(sixAmRow));

// ============================================================================================
// 5. THE CALCULATE BUTTON IS PROJECT DATA TOO
// ============================================================================================
// settings.autoRun rides in serializeProject(), so it arrives with the project -- and the button
// was stale for exactly the same reason the transport was. Task 467: the button is HIDDEN while
// the project recalculates itself, and shown when it does not.
console.log('\n--- 5. Calculate follows the arriving project\'s Recalculate automatically setting ---');
function runButton() {
	// By the icon it was built with, not by its words: dev/scripts/harness_wording_check.php, and
	// `data-icon` is what the strip's own swapIcon() reads.
	return buttons(toolbar).find((b) => b['data-icon'] === 'run');
}
const autoOff = net3();
autoOff.settings = autoOff.settings || {};
autoOff.settings.autoRun = false;
L.applySaved(autoOff);
L.refreshAllFromDocument();
const rb = runButton();
ok('the Calculate button is on the strip', !!rb);
ok('...and it is SHOWN for a project that does not recalculate itself',
	!!rb && rb.style.display !== 'none', rb && JSON.stringify(rb.style.display));

const autoOn = net3();
autoOn.settings = autoOn.settings || {};
autoOn.settings.autoRun = true;
L.applySaved(autoOn);
L.refreshAllFromDocument();
ok('...and hidden again for one that does', !!runButton() && runButton().style.display === 'none',
	runButton() && JSON.stringify(runButton().style.display));

// ============================================================================================
// 6. AN IMPORTED .inp ARRIVES THE SAME WAY
// ============================================================================================
// File > Import EPANET file does not go through applySaved() at all -- it parses, builds a
// document with docFromInp(), and refreshes. Same seam, and it has to reach it.
console.log('\n--- 6. File > Import EPANET file, through the page\'s own parser and importer ---');
const parsed = global.EngCalcs.lpnInpParse(
	fs.readFileSync(path.join(ROOT, 'dev/lpn-spike/reference/Net3.inp'), 'utf8'));
stub.setUnitSet('us');
L.applyUnits(parsed);
L.setDoc(L.docFromInp(parsed, 'Net3'));
L.refreshAllFromDocument();
ok('the imported document states the file\'s own duration', L.getDoc().times.duration === 86400,
	String(L.getDoc().times && L.getDoc().times.duration));
ok('...and the strip is live on it', step.children.length === 25 && !step.disabled,
	step.children.length + ' rows, disabled=' + step.disabled);
ok('...with no false no-period sentence', step.title !== PC.lpn_time_no_period);

console.log(fails === 0 ? '\nALL PASS' : '\n' + fails + ' FAILURE(S)');
process.exit(fails === 0 ? 0 : 1);
