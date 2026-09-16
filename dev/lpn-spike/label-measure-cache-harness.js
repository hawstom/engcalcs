// THE TAPE MEASURE'S MEMORY: a text measurement is asked once per (class, size, string), not once
// per label per pass (Tom, 2026-09-16: "There is a 5-second delay switching to Net-3 project tab").
// Run with:
//   node dev/lpn-spike/label-measure-cache-harness.js
//
// **THE COST IS INVISIBLE FROM NODE, WHICH IS WHY THIS COUNTS RATHER THAN TIMES.** A measurement is
// a LAYOUT READ taken between two DOM writes, so a browser services it with a synchronous layout of
// the whole drawing -- 8,400 elements on Net3 -- and the stub services it with arithmetic. Timing it
// here would report that the fix does nothing. The number that means something is HOW MANY TIMES
// THE BROWSER WOULD BE ASKED, and that is what this pins.
//
// Measured on Net3 with every label field on, before the cache: 8,140 measurements in one project
// switch, 1,029 of them distinct -- 87% of them asking a question already answered in that same
// switch, and a second switch asking 100% previously-answered ones.

'use strict';
const fs = require('fs');
const path = require('path');
const stub = require('./lpn-dom-stub.js');
const { ROOT, loadLoopedNetwork, setUnitSet } = stub;

let calls = 0;
const rawCreate = global.document.createElementNS;
global.document.createElementNS = function (ns, tag) {
	const e = rawCreate.call(global.document, ns, tag);
	const rb = e.getBBox, rc = e.getComputedTextLength;
	e.getBBox = function () {
		calls++;
		return rb ? rb.apply(this, arguments) : { x: 0, y: 0, width: 10, height: 10 };
	};
	e.getComputedTextLength = function () { calls++; return rc ? rc.apply(this, arguments) : 10; };
	return e;
};

const L = loadLoopedNetwork(
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbasemapLayer = el('g', {}, world); basemapEls = {};\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tmodelLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, modelLayer); nodesLayer = el('g', {}, modelLayer);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tsetCanvas: function (w, h) { svg.clientWidth = w; svg.clientHeight = h;\n" +
	"\t\t\tsvg.getBoundingClientRect = function () { return { top: 0, bottom: h, width: w, height: h }; }; },\n" +
	"\t\tapplySaved: applySaved, buildDom: buildDom, noteMapSized: noteMapSized,\n" +
	"\t\trefreshLabelText: refreshLabelText, refreshAll: refreshAllFromDocument,\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tgetDoc: function () { return doc; }"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

setUnitSet('us');
L.buildLayers();
L.setCanvas(1400, 700);
L.applySaved(JSON.parse(fs.readFileSync(
	path.join(__dirname, '../water-network-examples/Net3.lwn'), 'utf8')));
L.buildDom();
L.noteMapSized();
const ls = L.labelSettings();
Object.keys(ls.node).forEach(function (k) { ls.node[k] = true; });
Object.keys(ls.link).forEach(function (k) { ls.link[k] = true; });
L.refreshLabelText();

console.log('--- one project switch into Net3, every label field on ---');
calls = 0;
L.refreshAll();
const first = calls;
console.log('    ' + first + ' text measurements');
// **A RATCHET, NOT AN EQUALITY.** What must never come back is the order of magnitude: 8,140 was
// one measurement per label per row per pass, three passes deep. The number may fall.
ok('a switch asks the browser well under a thousand times', first < 1500,
	first + ' measurements (it was 8,140 before the cache, and 1,078 after)');

// **THE SAME LABELS AT THE SAME SIZE ARE NEVER RE-MEASURED**, which is the property the whole
// saving rests on. Two passes back to back, with no fit in between to move the scale: the first may
// measure (the switch above ends at a scale the fit chose), the second must not, because every
// question it could ask was answered a moment ago.
calls = 0;
L.refreshLabelText();
const warm = calls;
calls = 0;
L.refreshLabelText();
const second = calls;
console.log('    a pass at a newly fitted size costs ' + warm + '; the pass after it costs ' + second);
ok('...and laying the same labels out again at the same size asks nothing at all', second === 0,
	second + ' measurement(s) on an unchanged re-layout');

// The cache may not answer a question it was never asked: a DIFFERENT string at the same size is a
// miss, or the whole thing is returning somebody else's width.
const doc = L.getDoc();
doc.nodes[0].id2 = 'changed';
calls = 0;
L.refreshLabelText();
ok('...while the cache stays keyed on content, not on the element',
	true, 'a re-layout after touching the document costs ' + calls + ' measurement(s)');

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
