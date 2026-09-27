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
//   5. **R-349: A LINK'S CONCENTRATION, IN EVERY VENUE A NODE'S HAS IT.** Tom's pre-review pass
//      found linkQualityLabel()/linkQualityValue() (Task 638) wired into the Tables column, Find
//      and the legend for a NODE but stopping short of a LINK in three places: no Tables column,
//      no Find row, and no Properties popup row at all -- "incomplete execution of the task."
//      This section sweeps pipe/pump/valve x {Tables, Find, Properties} and proves each one.
//   6. **R-350: SOURCE TYPE DEFAULTS TO NONE AND DISABLES WHILE SOURCE QUALITY IS BLANK.** "Maybe
//      just disable if Source quality is blank, since that's what's really happening; it's
//      ignored if Source Quality is blank." Checked in the popup and the Tables column, and that
//      an untyped node still exports no `sourceType` line.

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
	// R-349/R-350: a column's full behaviour for one element, not just its heading -- its VALUE,
	// whether it is disabled right now, and (for a choice column) the list it is offering.
	"\t\tpaneColCell: function (tab, key, el) { var t = paneTables().filter(function (s) { return s.id === tab; })[0],\n" +
	"\t\t\tc = paneCols(t).filter(function (x) { return x.key === key; })[0];\n" +
	"\t\t\tif (!c) { return null; }\n" +
	"\t\t\treturn { value: c.get(el), disabled: c.disabledFor ? !!c.disabledFor(el) : false,\n" +
	"\t\t\t\tchoices: c.choices ? c.choices(el).map(function (o) { return o[0]; }) : null }; },\n" +
	"\t\tpipeTypeLabel: pipeTypePropLabel,\n" +
	"\t\tserializeProject: serializeProject,\n" +
	"\t\texportInp: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
	"\t\tengineInp: function () { return EngCalcs.lpnToInp(assembleModel(), { eps: true }).inp; },\n" +
	// R-349: linkQualityLabel() itself, and applySolveResult() to drive a fake but shape-correct
	// solve so nodeQualityValue()/linkQualityValue() answer without running the real engine --
	// dev/lpn-spike/chemical-symbology-harness.js already proves the engine bridge is honest.
	"\t\tlinkQualityLabel: linkQualityLabel,\n" +
	"\t\tapplySolveResult: applySolveResult, assembleModel: assembleModel,\n" +
	// R-349: the Properties popup for a node and for a link, read the same way
	// dev/lpn-spike/closed-link-harness.js does -- through the real renderer, not a second opinion.
	"\t\trenderNodeFields: renderNodeFields, renderLinkFields: renderLinkFields,\n" +
	"\t\tpopupFields: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	// R-349: Find's own property list for one scope, by internal key -- findPropDefs() itself asks
	// findState.scope, so the scope is set through the same door the panel's own selector writes.
	"\t\tfindProps: function (scope) { findState.scope = scope; return findPropDefs(); },\n" +
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
// All text under a node, the same recursive read closed-link-harness.js's own allText() uses: a
// stub node's textContent does not aggregate its children's, so each one is added by hand.
function allTextOf(n) {
	if (!n) { return ''; }
	var t = n.textContent || '';
	(n.children || []).forEach(function (c) { t += allTextOf(c); });
	return t;
}
function near(a, b, tol) {
	return typeof a === 'number' && typeof b === 'number' && isFinite(a) && isFinite(b)
		&& Math.abs(a - b) <= (tol || 1e-9) * Math.max(1, Math.abs(b));
}
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

// =================================================================================================
console.log('\n5. R-349: A LINK\'S CONCENTRATION IN EVERY VENUE A NODE\'S HAS IT, AND PROPERTIES FOR BOTH');
// =================================================================================================
L.setQuality({ mode: 'chemical', traceNode: '', chemical: 'Chlorine mg/L' });
const jA = L.addNode('junction', 0, 0), jB = L.addNode('junction', 100, 0);
// A base demand of 0 (never undefined) is the ordinary junction: refreshLabelText()'s own Base
// demand row reads baseDemandTotal(), which this harness's minimal setup (no lpn-patterns.js) has
// no demand-categories bridge for -- an unset demand would read undefined rather than 0 and crash
// the label pass. Every junction on the document gets one (including section 4's, which the label
// pass walks too), not just this section's own -- a fixture fact, not a claim about a real
// project's own defaults.
L.getDoc().nodes.forEach(function (n) { if (n.type === 'junction') { L.setProp(n, 'demand', 0); } });
const pipe2 = L.addLink('pipe', jA.id, jB.id);
const pumpLink = L.addLink('pump', jA.id, jB.id);
const valveLink = L.addLink('valve', jA.id, jB.id);
L.rebuildSettings();

const wantNodeLabel = L.qualityLabel();
const wantLinkLabel = L.linkQualityLabel();
ok('a node\'s and a link\'s own concentration words are different', wantNodeLabel !== wantLinkLabel,
	wantNodeLabel + ' / ' + wantLinkLabel);
// No English literal here (dev/scripts/harness_wording_check.php): the template comes straight off
// the real language file the DOM stub loaded, exactly as the node's own named-chemical check does.
ok('the link\'s label is one whole named template, not "Average" glued to the node\'s own string',
	wantLinkLabel === PC.lpn_quality_named_avg_concentration.replace('{chemical}', 'Chlorine'),
	wantLinkLabel);

// TABLES: every link table gets the column, headed by the link's own word (Tom found none did),
// with its own unit beside it -- the document's own mg/L, exactly as the node's column carries.
const wantLinkHeading = wantLinkLabel + ' (mg/L)';
['pipes', 'pumps', 'valves'].forEach(function (tab) {
	ok('the ' + tab + ' table has a quality column headed ' + JSON.stringify(wantLinkHeading),
		L.paneHeading(tab, 'quality') === wantLinkHeading, L.paneHeading(tab, 'quality'));
});

// FIND: the node scope already offered it; the link scopes did not (R-349's own finding).
const findNode = L.findProps('junction').filter(function (r) { return r[0] === 'quality'; })[0];
const findPipe = L.findProps('pipe').filter(function (r) { return r[0] === 'quality'; })[0];
const findPump = L.findProps('pump').filter(function (r) { return r[0] === 'quality'; })[0];
const findValve = L.findProps('valve').filter(function (r) { return r[0] === 'quality'; })[0];
ok('Find offers the node\'s own quality row, worded the node\'s way',
	!!findNode && findNode[1] === wantNodeLabel, findNode && findNode[1]);
[['pipe', findPipe], ['pump', findPump], ['valve', findValve]].forEach(function (pair) {
	ok('Find NOW offers a ' + pair[0] + '\'s quality row too, worded the link\'s way (R-349)',
		!!pair[1] && pair[1][1] === wantLinkLabel, pair[1] && pair[1][1]);
});

// A FAKE BUT SHAPE-CORRECT SOLVE, so every reader below has a real number to print. Whether the
// ENGINE hands back the right number at all is dev/lpn-spike/chemical-symbology-harness.js's own
// job (it drives the real EPANET bridge); this file's job is that every venue prints what
// linkQualityValue()/nodeQualityValue() already say.
L.applySolveResult({
	ok: true, qualityMode: 'chemical',
	qualities: (function () { var o = {}; o[jA.id] = 0.8; o[jB.id] = 0.6; return o; }()),
	linkQualities: (function () { var o = {}; o[pipe2.id] = 0.7; o[pumpLink.id] = 0.72; o[valveLink.id] = 0.74; return o; }()),
	flows: (function () { var o = {}; o[pipe2.id] = 1; o[pumpLink.id] = 1; o[valveLink.id] = 1; return o; }()),
	// Every node/link on the document is walked by refreshLabelText()'s own pass, whether or not
	// this test cares about its head or velocity -- so every array it might index needs an entry,
	// not just the ones this section is about.
	heads: (function () { var o = {}; o[jA.id] = 100; o[jB.id] = 99; return o; }()),
	pressures: (function () { var o = {}; o[jA.id] = 43; o[jB.id] = 43; return o; }()),
	velocities: (function () { var o = {}; o[pipe2.id] = 1; o[pumpLink.id] = 1; o[valveLink.id] = 1; return o; }()),
	headlosses: (function () { var o = {}; o[pipe2.id] = 1; o[pumpLink.id] = 1; o[valveLink.id] = 1; return o; }()),
	// The pipe reaction rate row (Task 652) reads this array on any chemical run whether or not a
	// label is drawn for it; a pump and a valve never react, so they carry no entry.
	linkRates: (function () { var o = {}; o[pipe2.id] = 0.01; return o; }())
});

ok('the pipe\'s Tables cell reads its own average, not the node\'s',
	near(L.paneColCell('pipes', 'quality', pipe2).value, 0.7), JSON.stringify(L.paneColCell('pipes', 'quality', pipe2)));
ok('the pump\'s Tables cell reads its own average',
	near(L.paneColCell('pumps', 'quality', pumpLink).value, 0.72), JSON.stringify(L.paneColCell('pumps', 'quality', pumpLink)));
ok('the valve\'s Tables cell reads its own average',
	near(L.paneColCell('valves', 'quality', valveLink).value, 0.74), JSON.stringify(L.paneColCell('valves', 'quality', valveLink)));

// PROPERTIES: a node already had its tail row (qualityResultRow()); a link had none at all until
// this branch's linkQualityResultRow() -- the gap Tom's "or in Properties" named.
L.renderNodeFields(jA.id);
const nodeText = allTextOf(L.popupFields());
ok('the node\'s Properties popup states its own concentration', nodeText.indexOf(wantNodeLabel) >= 0, nodeText);

L.renderLinkFields(pipe2.id);
const pipeText = allTextOf(L.popupFields());
ok('the pipe\'s Properties popup NOW states its own average concentration (R-349)',
	pipeText.indexOf(wantLinkLabel) >= 0, pipeText);
ok('...with the right number beside it', pipeText.indexOf('0.7') >= 0, pipeText);

L.renderLinkFields(pumpLink.id);
ok('the pump\'s Properties popup states it too (a pump has no reaction row to hide behind)',
	allTextOf(L.popupFields()).indexOf(wantLinkLabel) >= 0, allTextOf(L.popupFields()));

L.renderLinkFields(valveLink.id);
ok('and the valve\'s does as well',
	allTextOf(L.popupFields()).indexOf(wantLinkLabel) >= 0, allTextOf(L.popupFields()));

// =================================================================================================
console.log('\n6. R-350: SOURCE TYPE DEFAULTS TO NONE AND DISABLES WHILE SOURCE QUALITY IS BLANK');
// =================================================================================================
const src = L.addNode('junction', 200, 0);
L.rebuildSettings();

function sourceTypeSelectIn(host) {
	return controlsIn(host, 'SELECT').filter(function (s) {
		return (s.children || []).some(function (o) { return o.value === 'CONCEN'; });
	})[0];
}
// **THE STUB'S <select> DOES NOT DERIVE `.value` FROM ITS OPTIONS' OWN `.selected`** the way a
// real browser does (only `unitSelects()`'s own selects get that wiring) -- so the option actually
// marked selected is read directly, the same fact selectFieldPlain() itself set with `o.selected`.
function selectedOptionValue(sel) {
	var opt = (sel.children || []).filter(function (o) { return o.selected; })[0];
	return opt ? opt.value : '';
}

L.renderNodeFields(src.id);
var typeSel = sourceTypeSelectIn(L.popupFields());
ok('an untyped node\'s Source type control exists', !!typeSel);
ok('...and is DISABLED while Source quality is blank', !!typeSel && typeSel.disabled === true, typeSel && typeSel.disabled);
ok('...and reads as none, not a live-looking "Concentration"',
	!!typeSel && selectedOptionValue(typeSel) === '', typeSel && selectedOptionValue(typeSel));

const colBlank = L.paneColCell('junctions', 'sourceType', src);
ok('the Tables column agrees: disabled', colBlank.disabled === true, JSON.stringify(colBlank));
ok('...and blank', colBlank.value === '', JSON.stringify(colBlank));

// Typing a source quality is what turns the control on -- EPANET's own default (CONCEN) unless
// the user then picks something else.
L.setProp(src, 'sourceQuality', 0.5);
L.renderNodeFields(src.id);
typeSel = sourceTypeSelectIn(L.popupFields());
ok('typing a quality enables the type control', !!typeSel && typeSel.disabled === false, typeSel && typeSel.disabled);
ok('...defaulting to EPANET\'s own CONCEN',
	!!typeSel && selectedOptionValue(typeSel) === 'CONCEN', typeSel && selectedOptionValue(typeSel));

const colFilled = L.paneColCell('junctions', 'sourceType', src);
ok('the Tables column agrees: enabled and CONCEN', colFilled.disabled === false && colFilled.value === 'CONCEN',
	JSON.stringify(colFilled));

// **DOES NOT CHANGE WHAT AN UNEDITED FILE EXPORTS.** `sourceType` was never written for this node
// (the None state stores nothing, exactly as before this branch) -- clearing the quality again
// must leave no stray `sourceType` behind for the exporter to find.
L.setProp(src, 'sourceQuality', undefined);
ok('clearing the quality again leaves sourceType unwritten, exactly as an untouched import would',
	L.effective(src, 'sourceType') === undefined, L.effective(src, 'sourceType'));

console.log(fails === 0 ? '\nquality settings harness: all checks passed'
	: `\nquality settings harness: ${fails} FAILED`);
process.exit(fails === 0 ? 0 : 1);
