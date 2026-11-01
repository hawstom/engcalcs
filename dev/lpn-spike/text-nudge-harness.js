// A TEXT THAT MEETS ANOTHER TEXT IS NUDGED, NEVER HIDDEN. Run with:
//   node dev/lpn-spike/text-nudge-harness.js
//
// Tom, 2026-10-24, of ROAD on Elm Street Center, hidden because it crossed ST. FRANCIS: "I guess I
// was wrong to advise hiding/dropping user Text. Should we nudge it instead? ... Probably C or
// revert the hiding decision and leave the overlap in the user's hands." Option C: user Text is
// never hidden by the overlap rule; the later of two meeting Texts slides along its own line by the
// least distance that clears the earlier; if no slide clears it, it stays where the user put it.
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
const canvas = require('./lpn-dom-stub.js').byId.lpn_canvas;
Object.defineProperty(canvas, 'clientWidth', { get() { return 1200; } });
Object.defineProperty(canvas, 'clientHeight', { get() { return 600; } });
canvas.getBoundingClientRect = function () { return { left: 0, top: 0, right: 1200, bottom: 600, width: 1200, height: 600 }; };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getState: function () { return state; },\n" +
	"\t\taddText: addText, setProp: setProp, applySaved: applySaved,\n" +
	"\t\tapplyLabelVisibility: applyLabelVisibility,\n" +
	"\t\tlabelEls: function () { return labelEls; }, crowdedTexts: crowdedTexts,\n" +
	"\t\tbuildDom: buildDom, updateLabelGeometry: updateLabelGeometry,\n" +
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
function drawn(id) { return !L.labelEls()[id].text.classList.contains('lpn-lbl-hidden'); }
function empty() {
	L.applySaved({ version: 10, project: { coords: 'xy', units: { lpn_u_length: 'ft' } },
		nodes: [], links: [], labels: [], settings: { labelMaxWidth: 100000 }, view: null });
}

console.log('--- 1. two Texts that meet: neither is hidden, the later one slides along its line ---');
{
	empty();
	const a = L.addText(0, 0, null, null), b = L.addText(8, 1, null, null);
	L.setProp(a, 'text', 'ST. FRANCIS'); L.setProp(b, 'text', 'ROAD');
	a.allZoom = true; b.allZoom = true; a.sizeMult = 1.5; b.sizeMult = 1.5;
	L.getState().s = 2;
	L.applyLabelVisibility();
	const c = L.crowdedTexts();
	ok('1.1 both are drawn (the overlap rule no longer hides a user Text)', drawn(a.id) && drawn(b.id));
	ok('1.2 neither is marked crowd-hidden', !c.hidden[a.id] && !c.hidden[b.id]);
	ok('1.3 the earlier one stays put', !c.nudge[a.id]);
	ok('1.4 the later one is nudged', !!c.nudge[b.id], JSON.stringify(c.nudge[b.id]));
	ok('1.5 the nudge is display only: the stored point is untouched', b.x === 8 && b.y === 1);
	const tr = L.labelEls()[b.id].text.getAttribute('transform') || '';
	ok('1.6 the nudge is drawn as a translate on the words', /translate\(/.test(tr), tr);
}

console.log('--- 2. when no slide clears it, the Text stays exactly where the user put it ---');
{
	empty();
	const a = L.addText(0, 0, null, null), b = L.addText(0, 0, null, null);
	L.setProp(a, 'text', 'SAME PLACE'); L.setProp(b, 'text', 'SAME PLACE');
	a.allZoom = true; b.allZoom = true;
	L.getState().s = 2;
	L.applyLabelVisibility();
	const c = L.crowdedTexts();
	ok('2.1 both are drawn', drawn(a.id) && drawn(b.id));
	ok('2.2 no nudge is invented', !c.nudge[b.id] && !L.labelEls()[b.id].text.getAttribute('transform'));
}

console.log('--- 3. Texts that do not meet are untouched ---');
{
	empty();
	const a = L.addText(0, 0, null, null), b = L.addText(100000, 0, null, null);
	a.allZoom = true; b.allZoom = true; L.setProp(a, 'text', 'A'); L.setProp(b, 'text', 'B');
	L.getState().s = 2;
	L.applyLabelVisibility();
	const c = L.crowdedTexts();
	ok('3.1 no nudge', !c.nudge[a.id] && !c.nudge[b.id] && drawn(a.id) && drawn(b.id));
}

console.log('--- 4. Elm Street Center: ROAD and ST. FRANCIS, at every zoom, are never hidden ---');
{
	const saved = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', 'Elm-Street-Center.lwn'), 'utf8'));
	L.applySaved(saved);
	L.buildDom();
	const doc = L.getDoc();
	doc.labels.forEach(function (lb) { lb.allZoom = true; });
	doc.labels.filter(function (lb) { return lb.id === 'X18'; })[0].rot = 90;   // ROAD, turned as Tom has it
	// The stub measures every word the same; give these two their real proportions (screen pixels).
	L.labelEls().X17.widthPx = 100; L.labelEls().X18.widthPx = 46;
	// (The DOM stub does not carry the loaded words into the element; the real page does.)
	doc.labels.forEach(function (lb) { L.labelEls()[lb.id].text.textContent = lb.text || lb._text || lb.id; });
	let hiddenAny = 0, nudged = 0, road = null;
	[0.02, 0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 1, 1.3, 2, 5].forEach(function (s) {
		L.getState().s = s; L.applyLabelVisibility();
		L.crowdedTexts(); // settle
		const c = L.crowdedTexts();
		if (s === 1.3) { road = c.nudge.X18 || null; }
		doc.labels.forEach(function (lb) { if (!drawn(lb.id)) { hiddenAny++; } if (c.nudge[lb.id]) { nudged++; } });
	});
	ok('4.1 no Text on Elm Street Center is hidden by the overlap rule at any of eleven zooms', hiddenAny === 0, hiddenAny + ' hidden');
	ok('4.2 at Elm Street Center\'s own zoom, ROAD slides along its own (vertical) line to clear ST. FRANCIS',
		!!road && Math.abs(road.x) < 1e-3 && Math.abs(road.y) > 1, JSON.stringify(road));
	console.log('       (' + nudged + ' nudges across the eleven zooms)');
}

console.log(fails ? fails + ' FAILED' : 'All text nudge checks passed.');
process.exit(fails ? 1 : 0);
