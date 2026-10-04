// Harness for ROADMAP Task 664: coloured by link Status, the legend prints the state words
// (Open, Closed), never numeric bands, and the map's colours are as they were -- a closed link
// lands in the bottom band. Run with: node dev/lpn-spike/status-legend-harness.js

const { ROOT, mkEl, byId, ensure, unitSelects, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const { drawExampleSource } = require('./example-fixture.js');

// The same module the page loads, asked directly: an expectation computed from it is the coupling
// under test, while a retyped hex or a retyped break would be testing a copy.
const R = require(ROOT + 'js/lpn-ramps.js').lpnRamps;

const L = loadLoopedNetwork(
	"\t\tdrawExample: drawExampleNetwork, runSolve: runSolve,\n" +
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\trefreshValueColors: refreshValueColors,\n" +
	"\t\trebuildSettingsFields: rebuildSettingsFields,\n" +
	"\t\tbuildColoringSection: buildColoringSection,\n" +
	"\t\tcomputedBreaks: computedBreaks, effectiveBreaks: effectiveBreaks,\n" +
	"\t\tstoredBreaks: storedBreaks, colorModeOf: colorModeOf,\n" +
	"\t\tfillFromMethod: fillFromMethod,\n" +
	"\t\tsetProp: setProp, effective: effective,\n" +
	"\t\tcolorClassCount: colorClassCount, rampColorList: rampColorList,\n" +
	"\t\trampGroups: rampGroups, bandColor: bandColor, colorForValue: colorForValue,\n" +
	"\t\tcolorNodeValue: colorNodeValue, colorLinkValue: colorLinkValue,\n" +
	"\t\tserializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tcolorValues: colorValues,\n" +
	// **THE COLOUR CHANNEL IS `color`, NOT `fill`, FOR EVERY NODE TYPE** (2026-09-02). A junction is
	// a shaded ring now -- a wash plus its own stroke -- so both halves have to take the ramp
	// together or a coloured junction keeps a black outline round a coloured middle. That is the
	// same channel the reservoir and tank symbols have always used, so this reads one seam for all
	// three rather than two.
	"\t\tnodeFill: function (id) { return nodeEls[id] ? (nodeEls[id].circle.style.color || '') : null; },\n" +
	"\t\tnodeShade: function (id) { return nodeEls[id] ? nodeEls[id].circle.style.getPropertyValue('--lpn-shade') : null; },\n" +
	"\t\tnodeSymbolColor: function (id) { return (nodeEls[id] && nodeEls[id].symbol) ? (nodeEls[id].symbol.style.color || '') : null; },\n" +
	"\t\tlinkStroke: function (id) { return linkEls[id] ? (linkEls[id].line.style.stroke || '') : null; },\n" +
	"\t\tsvgClasses: function () { return svg && svg.classList ? svg.classList : null; },\n" +
	"\t\tlegendBox: function () { return colorLegendBox; },\n" +
	"\t\tlabelSettingsJson: function () { return JSON.stringify(labelSettings); },\n" +
	"\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); } ",
	// The code-drawn ring main, moved out of the shipped file (Task 378) and spliced back
	// into its own scope here. See dev/lpn-spike/example-draw-fixture.js.
	drawExampleSource()
);

// **THIS HARNESS PINS THE BUILT-IN SOLVER, AND THE REASON IS SYNCHRONY** (Task 605). EPANET is the
// page's default since that task, and runSolve() hands a network to it through a promise: a
// harness that calls L.runSolve() and reads the drawing on the next line would be reading the
// PREVIOUS solve, which is the stale-but-plausible answer dev/testing-notes.md warns about. This
// file is about how results become colours and asserts nothing whatever about engines, so it takes the
// solver that answers on the same tick rather than becoming async throughout.
//
// Pinned INSIDE the wrapper rather than once at the top, because L.reset() and L.applySaved() both
// seat a fresh settings object carrying the new 'epanet' default, and a pin placed before either
// of them is silently undone.
{
	const realRunSolve = L.runSolve;
	L.runSolve = function () { L.getSettings().engine = 'native'; return realRunSolve.apply(this, arguments); };
}



let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function walk(n, out) {
	out = out || [];
	(n.children || []).forEach(function (c) { out.push(c); walk(c, out); });
	return out;
}
byId.lpn_canvas.appendChild(byId.lpn_labels_legend);

setUnitSet('us');
L.reset();
L.drawExample();
L.runSolve();
const s = L.getSettings();
const links = L.getDoc().links;
const pipe = links.filter(l => l.type === 'pipe')[0];
L.setProp(pipe, 'status', 'closed');
L.runSolve();
s.colorLinkField = 'status';
L.refreshValueColors();

const box = L.legendBox();
const rows = walk(box).filter(n => n.className !== 'lpn-color-swatch');
const text = rows.map(n => n.textContent || '').join('|');
console.log('legend text: ' + text);
ok('the legend names Open', /Open/.test(text));
ok('the legend names Closed', /Closed/.test(text));
ok('no numeric band text', !/[<\u2265\u2013]/.test(text));
const breaks = L.effectiveBreaks('link', 'status');
const bottom = L.bandColor('link', 0, breaks.length + 1);
const top = L.bandColor('link', breaks.length, breaks.length + 1);
ok('the closed link is painted the bottom band', L.linkStroke(pipe.id) === bottom, L.linkStroke(pipe.id) + ' vs ' + bottom);
const open = links.filter(l => l !== pipe && l.type === 'pipe')[0];
ok('an open link differs from the closed one', L.linkStroke(open.id) !== L.linkStroke(pipe.id));
const sw = walk(box).filter(n => n.className === 'lpn-color-swatch').map(n => n.style.background);
ok('exactly two swatches', sw.length === 2, sw.length);
ok('Closed swatch equals the closed link colour', sw[1] === L.linkStroke(pipe.id), sw[1] + ' vs ' + L.linkStroke(pipe.id));
ok('Open swatch equals the open link colour', sw[0] === L.linkStroke(open.id), sw[0] + ' vs ' + L.linkStroke(open.id));

// velocity legend is still numeric
s.colorLinkField = 'velocity';
L.refreshValueColors();
ok('colouring by velocity still prints numeric bands', /[<\u2265\u2013]/.test(walk(L.legendBox()).map(n => n.textContent || '').join('|')));

console.log(fails ? '\n' + fails + ' FAILED' : '\nall ok');
process.exit(fails ? 1 : 0);
