// THE QUALITY SETTINGS BOX ITSELF -- R-321 through R-324 (dev/tom-review-queue.md). Run with:
//
//   node dev/lpn-spike/quality-settings-harness.js
//
// dev/lpn-spike/reaction-globals-harness.js and reaction-anchor-harness.js already own the
// coefficients' physics and their reader. This file owns the four things Tom asked for on the
// Quality panel itself, none of which either of those touches:
//
//   1. **THE PARAMETER ORDER.** "Quality parameter order must be: None, Chemical, Trace, Age (as
//      he sees in EPANET)." Asserted off the rendered <select>'s own option order, not off the
//      source array, so a future reorder that forgets this row fails here rather than in his
//      browser.
//   2. **QUALITY TOLERANCE AND RELATIVE DIFFUSIVITY HAD NO BOX.** "I don't see this in our
//      interface. Is it missing?" -- twice. They were carried in the file and handed to the
//      engine all along; what is new is a control, so this proves the control reaches the same
//      two places the carry already did: the exported `.inp` and the engine's own input text.
//   3. **THE CHEMICAL NAME AND MASS UNITS ARE TWO CONTROLS, AND THE NAME IS NOT REQUIRED.** A
//      renamed chemical or a changed mass unit must reach the exported file (js/lpn-inp.js's
//      lpnQualityText() gained a compose branch for exactly this); an untouched Net1/Net2/Net3
//      import must still round-trip its own characters.
//   4. **THE WALL COEFFICIENT'S UNIT FOLLOWS THE WALL REACTION ORDER.** Mass per area per day at
//      order 0, length per day at order 1 (EPANET's own default), read off the SAME function in
//      the Settings box, the pipe type Library and the Tables column.

'use strict';

const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
require(ROOT + 'js/lpn-inp.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\taddLink: addLink, addNode: addNode, effective: effective, setProp: setProp,\n" +
	"\t\trebuildSettings: rebuildSettingsFields,\n" +
	"\t\tsetQuality: function (q) { settings.quality = q; },\n" +
	"\t\tqualityLabel: qualityLabel,\n" +
	"\t\tpaneCol: function (tab, key) { var t = paneTables().filter(function (s) { return s.id === tab; })[0];\n" +
	"\t\t\treturn paneCols(t).map(function (c) { return c.key; }); },\n" +
	"\t\tpaneHeading: function (tab, key) { var t = paneTables().filter(function (s) { return s.id === tab; })[0],\n" +
	"\t\t\tc = paneCols(t).filter(function (x) { return x.key === key; })[0];\n" +
	"\t\t\treturn c ? paneHeadingText(c) : null; },\n" +
	"\t\tpipeTypeLabel: pipeTypePropLabel,\n" +
	"\t\tserializeProject: serializeProject,\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
	"\t\tengineInp: function () { return EngCalcs.lpnToInp(assembleModel(), { eps: true }).inp; },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const PC = global.EngCalcs.pageConfig || {};
function all(root, out) {
	(root.children || []).forEach(function (c) { out.push(c); all(c, out); });
	return out;
}
function controlsIn(host, tag) { return all(host, []).filter(function (n) { return n.tagName === tag; }); }
const fire = (el, type) => (el._listeners[type] || []).forEach((f) => f({}));
function rowsIn(host) {
	return all(host, [])
		.filter(n => n.tagName === 'LABEL' && /lpn-set-row/.test(n.className || ''))
		.map(function (line) {
			const span = (line.children || []).filter(c => c.tagName === 'SPAN')[0];
			return { text: span ? span.textContent.replace(/\s+/g, ' ').trim() : '', line: line };
		});
}

setUnitSet('us');
L.setQuality({ mode: 'none', traceNode: '' });

// =================================================================================================
console.log('1. THE PARAMETER ORDER IS NONE, CHEMICAL, TRACE, AGE -- AS TOM SEES IT IN EPANET (R-321)');
// =================================================================================================
L.rebuildSettings();
const sels = controlsIn(byId.lpn_set_quality_fields, 'SELECT');
const paramSel = sels.filter(s => (s.children || []).length === 4
	&& (s.children || []).map(o => o.value).indexOf('none') >= 0)[0];
ok('the Quality parameter select is on the box', !!paramSel,
	sels.map(s => (s.children || []).map(o => o.value).join(',')).join(' | '));
if (paramSel) {
	const order = (paramSel.children || []).map(o => o.value);
	ok('...in exactly that order', order.join(',') === 'none,chemical,trace,age', order.join(','));
}

// =================================================================================================
console.log('\n2. QUALITY TOLERANCE AND RELATIVE DIFFUSIVITY HAVE A BOX (R-322)');
// =================================================================================================
L.setQuality({ mode: 'chemical', traceNode: '', chemical: 'Chlorine mg/L' });
L.rebuildSettings();
const rows = rowsIn(byId.lpn_set_quality_fields);
ok('the row says "Quality tolerance", EPANET\'s own name',
	rows.some(r => r.text.indexOf(PC.lpn_quality_tolerance || 'Quality tolerance') >= 0), rows.map(r => r.text).join(' | '));
ok('the row says "Relative diffusivity", EPANET\'s own name',
	rows.some(r => r.text.indexOf(PC.lpn_quality_diffusivity || 'Relative diffusivity') >= 0), rows.map(r => r.text).join(' | '));
const texts = controlsIn(byId.lpn_set_quality_fields, 'INPUT').filter(n => n.type === 'text');
const tolBox = texts.filter(n => n.placeholder === '0.01')[0];
const diffBox = texts.filter(n => n.placeholder === '1.0')[0];
ok('the tolerance box opens blank, not defaulted in', !!tolBox && tolBox.value === '', tolBox && tolBox.value);
ok('the diffusivity box opens blank, not defaulted in', !!diffBox && diffBox.value === '', diffBox && diffBox.value);

// Type a value through the real control's own change handler, exactly as a person would.
tolBox.value = '0.005'; fire(tolBox, 'change');
diffBox.value = '1.2'; fire(diffBox, 'change');
ok('typing one stores it as TEXT, never a re-rounded number',
	L.getSettings().qualityOptions.tolerance === '0.005', L.getSettings().qualityOptions.tolerance);
ok('...and so does the other', L.getSettings().qualityOptions.diffusivity === '1.2',
	L.getSettings().qualityOptions.diffusivity);

// It must reach BOTH the saved file and the engine's own input, not just the document.
const exported = L.exportInp().inp;
ok('the exported .inp states the tolerance', / Tolerance\s+0\.005\b/.test(exported), exported.match(/\n[^\n]*Tolerance[^\n]*/));
ok('the exported .inp states the diffusivity', / Diffusivity\s+1\.2\b/.test(exported), exported.match(/\n[^\n]*Diffusivity[^\n]*/));
const engineInp = L.engineInp();
ok('the engine\'s own input states the tolerance', /\n Tolerance 0\.005\b/.test(engineInp));
ok('the engine\'s own input states the diffusivity', /\n Diffusivity 1\.2\b/.test(engineInp));

// Clearing the box is a STATE, not a zero: the exporter must then write no line at all.
tolBox.value = ''; fire(tolBox, 'change');
ok('clearing the box deletes the key rather than storing a number',
	!('tolerance' in L.getSettings().qualityOptions), JSON.stringify(L.getSettings().qualityOptions));

// Only a chemical means anything to either one -- gone the moment the mode leaves chemical.
L.setQuality({ mode: 'age', traceNode: '' });
L.rebuildSettings();
ok('neither row survives outside a chemical run',
	rowsIn(byId.lpn_set_quality_fields).every(r =>
		r.text.indexOf(PC.lpn_quality_tolerance || 'Quality tolerance') < 0
		&& r.text.indexOf(PC.lpn_quality_diffusivity || 'Relative diffusivity') < 0));
L.setQuality({ mode: 'chemical', traceNode: '', chemical: 'Chlorine mg/L', tolerance: undefined });
L.getSettings().qualityOptions = { diffusivity: '1.2' };

// =================================================================================================
console.log('\n3. THE CHEMICAL NAME AND MASS UNITS ARE TWO CONTROLS, AND THE NAME IS OPTIONAL (R-323)');
// =================================================================================================
L.setQuality({ mode: 'chemical', traceNode: '', chemical: 'Chlorine mg/L' });
L.rebuildSettings();
const nameBox = controlsIn(byId.lpn_set_quality_fields, 'INPUT')
	.filter(n => n.type === 'text' && n.placeholder !== '0.01' && n.placeholder !== '1.0')[0];
const massSel = controlsIn(byId.lpn_set_quality_fields, 'SELECT')
	.filter(s => (s.children || []).map(o => o.value).join(',') === 'mg/L,ug/L')[0];
ok('the name is its own text box', !!nameBox && nameBox.value === 'Chlorine', nameBox && nameBox.value);
ok('mass units is a dropdown of EPANET\'s own two choices', !!massSel && massSel.value === 'mg/L',
	massSel && (massSel.children || []).map(o => o.value).join(','));

// Renaming the chemical and changing the mass unit must reach the exported file.
nameBox.value = 'Fluoride'; fire(nameBox, 'change');
massSel.value = 'ug/L'; fire(massSel, 'change');
ok('the document now states the new name and unit', L.getSettings().quality.chemical === 'Fluoride ug/L',
	L.getSettings().quality.chemical);
ok('and the exported file follows the edit, not the file it was opened from',
	/ Quality\s+Fluoride ug\/L\b/.test(L.exportInp().inp), L.exportInp().inp.match(/\n[^\n]*Quality[^\n]*/));

// A blank name is not required, on EPANET's own terms -- it falls back to EPANET's own default
// label, and the heading a reader sees stays the plain word rather than "Chemical concentration".
nameBox.value = ''; fire(nameBox, 'change');
ok('a blank name still commits, to EPANET\'s own default keyword',
	L.getSettings().quality.chemical === 'Chemical ug/L', L.getSettings().quality.chemical);
ok('and the label a reader sees is the plain word, not "Chemical concentration"',
	L.qualityLabel() === (PC.lpn_result_concentration || 'Concentration'), L.qualityLabel());

// A named chemical prefixes the label everywhere qualityLabel() is read.
nameBox.value = 'Chlorine'; fire(nameBox, 'change');
const wantNamed = (PC.lpn_quality_named_concentration || '{chemical} concentration').replace('{chemical}', 'Chlorine');
ok('a named chemical reads as "{chemical} concentration"', L.qualityLabel() === wantNamed, L.qualityLabel());
ok('...and the Tables column heading follows the same function, with its own unit beside it',
	L.paneHeading('junctions', 'quality') === wantNamed + ' (ug/L)', L.paneHeading('junctions', 'quality'));

// An untouched import round-trips its own characters exactly, byte for byte.
L.setQuality({ mode: 'chemical', traceNode: '', src: 'Chlorine mg/L' });
ok('an untouched import still exports the file\'s own text unchanged',
	/ Quality\s+Chlorine mg\/L\b/.test(L.exportInp().inp));

// =================================================================================================
console.log('\n4. THE WALL COEFFICIENT\'S UNIT FOLLOWS THE WALL REACTION ORDER (R-324)');
// =================================================================================================
L.setQuality({ mode: 'chemical', traceNode: '', chemical: 'Chlorine mg/L' });
const pipe = L.addLink('pipe', L.addNode('junction', 0, 0).id, L.addNode('junction', 100, 0).id);
const s = L.getSettings();
s.reactions = s.reactions || { tank: {} };
delete s.reactions.orderWall;
L.rebuildSettings();
ok('unstated wall order reads as EPANET\'s own default of 1, a length per day',
	L.paneHeading('pipes', 'wallCoeff') === 'Wall reaction (ft/day)', L.paneHeading('pipes', 'wallCoeff'));
ok('...and the pipe type Library label agrees',
	L.pipeTypeLabel('wallCoeff').indexOf('(ft/day)') >= 0, L.pipeTypeLabel('wallCoeff'));

s.reactions.orderWall = 0;
L.rebuildSettings();
ok('order 0 switches the unit to mass per area per day, mg by EPANET\'s own default mass unit',
	L.paneHeading('pipes', 'wallCoeff') === 'Wall reaction (mg/ft²/day)', L.paneHeading('pipes', 'wallCoeff'));
ok('...and the Library label follows the same switch',
	L.pipeTypeLabel('wallCoeff').indexOf('(mg/ft²/day)') >= 0, L.pipeTypeLabel('wallCoeff'));

// Mass units moves the mass half of the same unit, not just the concentration's own heading.
L.setQuality({ mode: 'chemical', traceNode: '', chemical: 'Chlorine ug/L' });
L.rebuildSettings();
ok('a µg mass unit reaches the wall coefficient\'s own label too',
	L.paneHeading('pipes', 'wallCoeff') === 'Wall reaction (µg/ft²/day)', L.paneHeading('pipes', 'wallCoeff'));

// SI, so the length half of the unit moves with the project's own length unit -- ft under US, m
// under SI -- exactly as the Darcy-Weisbach roughness label already does.
setUnitSet('si');
s.reactions.orderWall = 1;
L.rebuildSettings();
ok('order 1 under SI names metres, not feet',
	L.paneHeading('pipes', 'wallCoeff') === 'Wall reaction (m/day)', L.paneHeading('pipes', 'wallCoeff'));
setUnitSet('us');

console.log(fails === 0 ? '\nquality settings harness: all checks passed'
	: `\nquality settings harness: ${fails} FAILED`);
process.exit(fails === 0 ? 0 : 1);
