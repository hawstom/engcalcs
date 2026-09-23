// A TEXT OBJECT'S "Show at all zoom levels" -- ROADMAP review-queue R-174. Run with:
//   node dev/lpn-spike/text-all-zoom-property-harness.js
//
// Tom, 2026-09-23 (review-queue R-174), of the property Task 705/708 shipped: *"This property
// should be off for all but the largest text object in our examples and for all projects with no
// previous settings."* And: *"This property should appear in multi-properties, Tables, and
// Find/Replace."*
//
// **THREE FINDINGS, NOT ONE.** The launch ruling (recorded at js/looped-network.js's
// applyLabelVisibility() and renderLabelFields()) had it ticked by default, on the argument that a
// Text object is authored content and the shipped Net3 note reading "Zoom in to see labels" only
// makes sense if it outlives the labels it names. Tom's R-174 ruling REVERSES the default without
// reversing that argument: a note keeps showing past the threshold only if it SAYS SO, and the
// examples now say so explicitly on whichever of their own Text objects is the largest -- which is
// exactly the note the launch ruling was protecting.
//
//   1. DEFAULT OFF. A Text with no stored `allZoom` at all -- a fresh one, or one saved by a
//      project from before this property existed -- goes with the labeling threshold, the same as
//      one explicitly stored `allZoom: false` (the old off-spelling). Only `allZoom: true` is kept.
//   2. EVERY SHIPPED EXAMPLE, READ FROM THE MANIFEST rather than a typed list (so an eighth example
//      is covered the day it ships): exactly one of its Text objects carries `allZoom: true`, and
//      it is the one with the largest `sizeMult` (a tie broken to the first in the file, since nothing
//      in Tom's ruling orders two texts of equal size against each other). Reported by id and text.
//   3. THE THREE VENUES, driven through their own doors rather than by reading the source for the
//      word "allZoom": the Tables pane's Text table (a `bool` column, read and written), the
//      multi-properties box (built from that same table spec, so this also proves the one-list
//      argument for it), and Find and replace (searchable under the Text scope, and writable --
//      `replaceElement()` needed a `label` branch it did not have, which section 3c is what caught).
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
ensure('lpn_toolbar').querySelectorAll = () => [];

let W = 1200, H = 600;
const canvas = require('./lpn-dom-stub.js').byId.lpn_canvas;
Object.defineProperty(canvas, 'clientWidth', { get() { return W; } });
Object.defineProperty(canvas, 'clientHeight', { get() { return H; } });
canvas.getBoundingClientRect = function () { return { left: 0, top: 0, right: W, bottom: H, width: W, height: H }; };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\tgetState: function () { return state; },\n" +
	"\t\taddText: addText, setProp: setProp, effective: effective, buildDom: buildDom,\n" +
	"\t\tapplySaved: applySaved,\n" +
	"\t\tapplyLabelVisibility: applyLabelVisibility,\n" +
	"\t\tdataLabelsHidden: function () { return dataLabelsHidden; },\n" +
	"\t\tlabelEls: function () { return labelEls; },\n" +
	"\t\tlabelById: labelById,\n" +
	// Selection and the multi-properties box, through their own doors.
	"\t\tsetSelection: setSelection, toggleInSelection: toggleInSelection,\n" +
	"\t\topenMulti: openMultiProperties, popupFields: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tpopupTitle: function () { return document.getElementById('lpn_popup_title').textContent; },\n" +
	// The Tables pane, and the one list that also feeds the multi-properties box.
	"\t\tpaneTables: paneTables, paneCols: paneCols,\n" +
	"\t\tpaneCellText: paneCellText, paneWriteCellText: paneWriteCellText,\n" +
	// Find and replace, driven exactly as the pull-downs drive it.
	"\t\tfindState: function () { return findState; }, findPropDefs: findPropDefs,\n" +
	"\t\tfindValueOf: findValueOf,\n" +
	"\t\tqueryLabels: function (scope, prop, op, value) {\n" +
	"\t\t\tfindState.scope = scope; findState.prop = prop; findState.op = op; findState.value = value;\n" +
	"\t\t\treturn findMatches();\n" +
	"\t\t},\n" +
	"\t\treplaceSpecs: function (scope) { findState.scope = scope; findState.op = 'equals'; return replaceSpecs(); },\n" +
	"\t\tsetReplace: function (prop, value) { replaceState.prop = prop; replaceState.value = value; },\n" +
	"\t\tpreview: runReplacePreview, apply: applyReplace, cancel: cancelReplace,\n" +
	"\t\tpending: function () { return replacePending && replacePending.refs.map(function (r) { return r.group + ':' + r.id; }); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); linkSymbolLayer = el('g', {}, world);\n" +
	"\t\t\tnodesLayer = el('g', {}, world); labelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
setUnitSet('us');
L.buildLayers();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function head(t) { console.log(t); }

// ====================================================================================================
head('--- 1. default off ---');
{
	L.applySaved({ version: 10, project: { coords: 'xy', units: { lpn_u_length: 'ft' } },
		nodes: [], links: [], labels: [], settings: { labelMaxWidth: 100 }, view: null });
	const lb = L.addText(0, 0, null, null);
	ok('1.1 a freshly-drawn Text carries no allZoom at all', lb.allZoom === undefined);
	L.getState().s = 1200 / 200;   // narrower than the 100 ft threshold: past it
	L.applyLabelVisibility();
	const els = L.labelEls();
	const hidden = !!(els[lb.id] && els[lb.id].text.classList.contains('lpn-lbl-hidden'));
	ok('1.2 ...so it goes with the labels once the view is past the threshold', hidden);
	// The Tables/multi-properties column reads the same default the map does.
	const textSpec = L.paneTables().filter(function (s) { return s.id === 'text'; })[0];
	const col = L.paneCols(textSpec).filter(function (c) { return c.key === 'allZoom'; })[0];
	ok('1.3 the column reads it as unticked too', !!col && col.get(lb) === false);
	ok('1.4 Find reads it as 0', L.findValueOf({ group: 'label', el: lb }, 'allZoom') === 0);
}

// ====================================================================================================
head('--- 2. every shipped example: exactly one Text kept on, and it is the largest ---');
{
	const exDir = path.join(ROOT, 'examples');
	const manifest = JSON.parse(fs.readFileSync(path.join(exDir, 'manifest.json'), 'utf8'));
	manifest.examples.forEach(function (ex) {
		const saved = JSON.parse(fs.readFileSync(path.join(exDir, ex.file), 'utf8'));
		L.applySaved(saved);
		const labels = L.getDoc().labels;
		if (!labels.length) { ok('2.x ' + ex.file + ' has no Text objects to check', true); return; }
		const on = labels.filter(function (lb) { return lb.allZoom === true; });
		ok('2.1 ' + ex.file + ': exactly one Text is kept on', on.length === 1,
			on.map(function (lb) { return lb.id; }).join(','));
		if (on.length !== 1) { return; }
		const maxSize = Math.max.apply(null, labels.map(function (lb) { return lb.sizeMult || 1; }));
		ok('2.2 ' + ex.file + ': ' + on[0].id + ' (size ' + (on[0].sizeMult || 1) + ') is (a) the largest',
			(on[0].sizeMult || 1) === maxSize);
		console.log('       chosen: ' + ex.file + ' -> ' + on[0].id +
			(on[0].text !== undefined ? ' "' + on[0].text + '"' : (on[0]._text !== undefined ? ' "' + on[0]._text + '"' : '')) +
			', sizeMult ' + (on[0].sizeMult || 1) + ' of ' + labels.map(function (lb) { return lb.sizeMult || 1; }).join(','));
	});
}

// ====================================================================================================
head('--- 3a. the Tables pane: a bool column, read and written ---');
{
	L.applySaved({ version: 10, project: { coords: 'xy', units: { lpn_u_length: 'ft' } },
		nodes: [], links: [], labels: [], settings: {}, view: null });
	const a = L.addText(0, 0, null, null), b = L.addText(10, 0, null, null);
	const textSpec = L.paneTables().filter(function (s) { return s.id === 'text'; })[0];
	ok('3a.1 the Text table declares an allZoom column', !!textSpec);
	const col = L.paneCols(textSpec).filter(function (c) { return c.key === 'allZoom'; })[0];
	ok('3a.2 ...and it is a checkbox (bool: true)', !!col && col.bool === true);
	ok('3a.3 the cell reads "0" for an untouched Text', L.paneCellText(col, a) === '0');
	ok('3a.4 typing "1" into the cell writes allZoom: true',
		L.paneWriteCellText(textSpec, col, a, '1') && a.allZoom === true);
	ok('3a.5 ...and the cell now reads "1"', L.paneCellText(col, a) === '1');
	ok('3a.6 typing "0" clears it back to the default (absent, not false)',
		L.paneWriteCellText(textSpec, col, a, '0') && a.allZoom === undefined);
	// `b`, the second Text added above, is left as-is here and picked up by section 3b below --
	// same document, same two labels, so that section's selection is exactly these two.
}

// ====================================================================================================
head('--- 3b. the multi-properties box: the SAME column, built through openMultiProperties() ---');
{
	const doc = L.getDoc();
	const a = doc.labels[0], b = doc.labels[1];
	L.setSelection('label', a.id);
	L.toggleInSelection('label', b.id);
	const opened = L.openMulti();
	ok('3b.1 selecting both Text objects opens the multi box (not the single popup)', opened === true);
	// Walk the popup for the checkbox beside the shared all-zoom label -- read off the real
	// language file the DOM stub loads, never a literal, so a rewording cannot redden this file.
	const pc = global.EngCalcs.pageConfig;
	const wantLabel = pc.lpn_field_text_all_zoom;
	let input = null;
	(function walk(el) {
		if (input) { return; }
		if (el._tag === 'label' && (el.textContent || '').indexOf(wantLabel) >= 0) {
			(el.children || []).forEach(function (c) { if (c.type === 'checkbox') { input = c; } });
		}
		(el.children || []).forEach(walk);
	})(L.popupFields());
	ok('3b.2 the row is on screen, as a checkbox', !!input);
	if (input) {
		ok('3b.3 both being off, the box is unchecked (not indeterminate)',
			input.checked === false && input.indeterminate === false);
		input.checked = true;
		(input._listeners.change || []).forEach(function (f) { f({}); });
		ok('3b.4 ticking it writes BOTH selected Text objects', a.allZoom === true && b.allZoom === true);
	}
}

// ====================================================================================================
head('--- 3c. Find and replace: searchable and writable under the Text scope ---');
{
	L.applySaved({ version: 10, project: { coords: 'xy', units: { lpn_u_length: 'ft' } },
		nodes: [], links: [], labels: [], settings: {}, view: null });
	const on1 = L.addText(0, 0, null, null), off1 = L.addText(10, 0, null, null),
		off2 = L.addText(20, 0, null, null);
	L.setProp(on1, 'text', 'kept');
	on1.allZoom = true;   // base-write, exactly as the popup and the table do it
	L.findState().scope = 'text';
	const propNames = L.findPropDefs().map(function (p) { return p[0]; });
	ok('3c.1 "allZoom" is offered as a Text property to search on', propNames.indexOf('allZoom') >= 0);
	const found = L.queryLabels('text', 'allZoom', 'equals', '1');
	ok('3c.2 "Text.allZoom equal to 1" finds exactly the one kept on',
		found && found.length === 1 && found[0].el.id === on1.id,
		found ? found.map(function (c) { return c.el.id; }).join(',') : 'null');
	const specs = L.replaceSpecs('text');
	ok('3c.3 allZoom is offered as a Replace target under the Text scope',
		specs.some(function (s) { return s.field === 'allZoom'; }));
	// Write it onto every Text currently reading 0 (the two OFF ones) by searching for that and
	// replacing with 1 -- the ordinary "find every X, set it to Y" gesture this panel is for.
	L.queryLabels('text', 'allZoom', 'equals', '0');
	L.setReplace('allZoom', '1');
	L.preview();
	const pend = L.pending();
	ok('3c.4 the preview names exactly the two OFF Text objects',
		pend && pend.length === 2 && pend.indexOf('label:' + off1.id) >= 0 && pend.indexOf('label:' + off2.id) >= 0,
		JSON.stringify(pend));
	L.apply();
	ok('3c.5 applying it writes both', off1.allZoom === true && off2.allZoom === true);
	ok('3c.6 ...and left the one already on alone (still true, not toggled)', on1.allZoom === true);
}

console.log(fails ? '\n' + fails + ' FAILURE(S)' : '\nText all-zoom property harness: all checks passed.');
process.exit(fails ? 1 : 0);
