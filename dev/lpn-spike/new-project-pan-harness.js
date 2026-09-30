// A PAN IS LOST WHEN FILE, NEW PROJECT OPENS BESIDE IT (Task 711). Run with:
//   node dev/lpn-spike/new-project-pan-harness.js
//
// Pre-reviewer's finding: openProject() remembers the outgoing tab's view before switching
// (rememberCurrentView(), followed by rememberSwitchState() AFTER the flush -- see the comment at
// rememberOutgoingProject() in js/looped-network.js). newProject() and importProject() -- which is
// also File > Open example's own door, per example-view-harness.js's header -- changed
// `library.openId` without ever calling rememberCurrentView() for the tab being left. The pan and
// zoom on the outgoing tab were never captured, so switching back to it ran the one fallback
// restoreViewOrFit() has for a tab with nothing remembered: a re-fit, which is indistinguishable
// from having lost the pan.
//
// THE FIX pulls openProject()'s outgoing sequence into one shared function,
// rememberOutgoingProject(), and every path that moves `library.openId` away from a live project
// -- openProject(), newProject(), saveProjectAs(), importProject() -- now calls it. This harness
// drives newProject() and importProject() (the shipped `Basic-example-US-units.lwn`, standing in
// for the Open example gallery's own call) exactly as example-view-harness.js drives importProject
// for the gallery, then asserts the view an ABANDONED tab comes back to is the one it was panned
// to, not a fit.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, addNode: addNode, addLink: addLink,\n" +
	"\t\tcurrentView: currentView, applyView: applyView, validView: validView,\n" +
	"\t\trestoreOrFit: restoreViewOrFit,\n" +
	"\t\tnewProject: newProject, openProject: openProject,\n" +
	"\t\tacceptImportedText: acceptImportedText, importProject: importProject,\n" +
	"\t\topenId: function () { return library.openId; },\n" +
	"\t\tview: function () { return { tx: state.tx, ty: state.ty, s: state.s }; },\n" +
	"\t\tsetViewRaw: function (tx, ty, s) { state.tx = tx; state.ty = ty; state.s = s;\n" +
	"\t\t\tsetTransform(); relayoutLabels(); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h;\n" +
	"\t\t\tsvg.getBoundingClientRect = function () { return { top: 0, bottom: h, width: w, height: h }; }; },\n" +
	"\t\tmarkSized: noteMapSized,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;

setUnitSet('us');
L.buildLayers();
L.setCanvas(1000, 600);
L.markSized();

console.log('--- File, New project leaves the outgoing tab\'s pan behind it ---');
{
	// Project A: the tab that will be panned and then abandoned.
	L.newProject();
	const aId = L.openId();
	const a = L.addNode('junction', 0, 0), b = L.addNode('junction', 400, 300);
	L.addLink('pipe', a.id, b.id);
	// A deliberate pan, panned so far off the model that viewShowsModel() would refuse it as a
	// COLD-LOAD default -- on purpose: the outgoing document's own saveToStorage() write (still
	// present, unchanged, on every path below) also carries this view, and a stored file's view is
	// restored on next open ONLY when viewShowsModel() approves it (applySaved()'s
	// `pendingView = viewShowsModel(saved.view) ? saved.view : null`). An on-model pan would still
	// come back right even with rememberCurrentView() missing, rescued by that fallback, and would
	// not tell tabViews's own bug apart from it. Off-model is the one shape only tabViews answers
	// for -- exactly Tom's paradigm (view-memory-harness.js section 4b): a DELIBERATE pan is kept
	// regardless of whether it shows the model, never silently improved on.
	L.setViewRaw(-9500, 0, 1);
	const panned = L.currentView();

	// File, New project: opens a second, empty project beside A.
	L.newProject();
	const bId = L.openId();
	ok('the new project is a different tab', bId !== aId, bId + ' vs ' + aId);

	// Back to A.
	L.openProject(aId);
	const back = L.currentView();
	ok('project A reopens at the pan it was left on, not a fit',
		near(back.cx, panned.cx) && near(back.cy, panned.cy) && back.s === panned.s,
		JSON.stringify(back) + ' vs ' + JSON.stringify(panned));
	void bId;
}

console.log('\n--- File, Open example (importProject(), the gallery\'s own door) does the same ---');
{
	// Fresh library: a second project switch on the SAME abandoned tab, this time via the door
	// example-view-harness.js's header names as the one a visitor actually comes through.
	L.newProject();
	const aId = L.openId();
	const a = L.addNode('junction', 0, 0), b = L.addNode('junction', 200, -150);
	L.addLink('pipe', a.id, b.id);
	// Off-model, for the same reason as section 1 -- isolates tabViews from the file's own
	// viewShowsModel()-gated fallback.
	L.setViewRaw(-9500, 0, 1);
	const panned = L.currentView();

	const text = fs.readFileSync(path.join(ROOT, 'examples', 'Basic-example-US-units.lwn'), 'utf8');
	const saved = L.acceptImportedText(text);
	ok('the example file reads as a project', !!saved);
	const exId = L.importProject(saved);
	ok('the example lands as its own new tab', !!exId && exId !== aId, exId + ' vs ' + aId);

	L.openProject(aId);
	const back = L.currentView();
	ok('project A reopens at its pan after Open example landed beside it, not a fit',
		near(back.cx, panned.cx) && near(back.cy, panned.cy) && back.s === panned.s,
		JSON.stringify(back) + ' vs ' + JSON.stringify(panned));
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
