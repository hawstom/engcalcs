// Settings > Symbology's Node/Link "After" (suffix) and "Decimal" shipped defaults for the
// quality-related rows (ROADMAP Task 664). Run with:
//   node dev/lpn-spike/symbology-defaults-harness.js
//
// Tom, 2026-09-21, dictating the defaults he wants a NEW project to open with:
//   Node > Source share: After '%', Decimal 0        Node > Water age: After ' hr'
//   Node > Initial quality: After ' mg/L'             Node > Concentration: After ' mg/L'
//   Node > Average source share: After '%', Decimal 0 Node > Average concentration: After ' mg/L'
//   Link > Average water age: After ' hr'
//
// ONE ROW, THREE FACES. Node's "quality" is a single settings row whose visible label and whose
// affix both follow settings.quality.mode -- Source share/Water age/Concentration are the SAME
// row under age/trace/chemical, and link's quality row is its Average-prefixed twin (both the
// "Average source share" and "Average concentration" lines above are the trace/chemical faces of
// THAT one link row; Tom's own dictation grouped them under Node, but the code has never had a
// node-level average, so this file asserts the link row directly instead).
//
// **THE DECIMAL CHANGE IS THE INTERESTING HALF.** decimals.node.quality and decimals.link.quality
// were a single number for all three modes; a "0" default for the two share lines would have
// zeroed Water age and Concentration too. qualityDecimals() in js/looped-network.js now reads a
// mode-specific 'quality:trace' entry when the mode is trace and falls back to the flat entry
// otherwise, so this file asserts BOTH halves: trace at 0, and the other two modes unmoved.
//
// **AND THE OLD-PROJECT GUARANTEE IS THE ONE A DEFAULTS CHANGE MOST EASILY BREAKS SILENTLY**
// (CLAUDE.md: "only the user touches a file's numbers", extended by the lpn_-specific rule that a
// project's own labelSettings rides in serializeProject() and a new default must never overwrite
// what an existing project already stored). Section 3 opens a project that stored its own quality
// suffix under the OLD, unmoded shape and checks every mode still reads that value back rather
// than the new per-mode default -- labelSuffixFor()'s legacy-key fallback, asserted rather than
// trusted.

'use strict';

const { setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, getSettings: function () { return settings; },\n" +
	"\t\taddNode: addNode, addLink: addLink, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tsetQuality: function (q) { settings.quality = q; },\n" +
	"\t\tlabelSettings: function () { return labelSettings; },\n" +
	"\t\tlabelSuffixFor: function (g, f) { return labelSuffixFor(g, f); },\n" +
	"\t\tqualityDecimals: function (group) { return qualityDecimals(labelSettings.decimals[group]); },\n" +
	"\t\tserializeProject: serializeProject, applySaved: applySaved,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();
L.addNode('reservoir', 0, 0);
L.addNode('junction', 1000, 0);

const AGE = { mode: 'age', traceNode: '' };
const TRACE = { mode: 'trace', traceNode: '' };
const CHEM = { mode: 'chemical', chemical: 'Chlorine mg/L', traceNode: '' };

console.log('== 1. a fresh project\'s "After" defaults ==');
{
	L.setQuality(TRACE);
	ok('Node > Source share defaults to a bare percent sign',
		L.labelSuffixFor('node', 'quality') === '%', L.labelSuffixFor('node', 'quality'));
	ok('Link > Average source share reads the same, since a percent is a percent either way',
		L.labelSuffixFor('link', 'quality') === '%', L.labelSuffixFor('link', 'quality'));

	L.setQuality(AGE);
	ok('Node > Water age defaults to a leading-space " hr"',
		L.labelSuffixFor('node', 'quality') === ' hr', JSON.stringify(L.labelSuffixFor('node', 'quality')));
	ok('Link > Average water age reads the same unit',
		L.labelSuffixFor('link', 'quality') === ' hr', JSON.stringify(L.labelSuffixFor('link', 'quality')));

	L.setQuality(CHEM);
	ok('Node > Concentration defaults to a leading-space " mg/L"',
		L.labelSuffixFor('node', 'quality') === ' mg/L', JSON.stringify(L.labelSuffixFor('node', 'quality')));
	ok('Node > Average concentration (link\'s quality row) reads the same',
		L.labelSuffixFor('link', 'quality') === ' mg/L', JSON.stringify(L.labelSuffixFor('link', 'quality')));

	ok('Node > Initial quality defaults to " mg/L" regardless of the current mode',
		L.labelSuffixFor('node', 'initQuality') === ' mg/L', JSON.stringify(L.labelSuffixFor('node', 'initQuality')));
}

console.log('== 2. the Decimal default is 0 under trace and unchanged under the other two modes ==');
{
	L.setQuality(TRACE);
	ok('Node > Source share is whole', L.qualityDecimals('node') === 0, L.qualityDecimals('node'));
	ok('Link > Average source share is whole', L.qualityDecimals('link') === 0, L.qualityDecimals('link'));

	L.setQuality(AGE);
	ok('Node > Water age keeps its one decimal', L.qualityDecimals('node') === 1, L.qualityDecimals('node'));
	L.setQuality(CHEM);
	ok('Node > Concentration keeps the same shared entry', L.qualityDecimals('node') === 1, L.qualityDecimals('node'));
}

console.log('== 3. an existing project keeps whatever suffix it already stored ==');
{
	// Simulate a project saved BEFORE the per-mode split, or one where the user simply typed a
	// custom suffix while in some mode: the OLD, unmoded shape stores it under the flat 'quality'
	// key (see labelAffixKey()'s own comment). serializeProject() -> mutate -> applySaved() is the
	// same round trip color-ramp-harness.js uses to open a document written before a later split.
	L.setQuality(AGE);
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	saved.labelSettings.suffix.node.quality = ' CUSTOM';
	delete saved.labelSettings.suffix.node['quality:age'];
	delete saved.labelSettings.suffix.node['quality:trace'];
	delete saved.labelSettings.suffix.node['quality:chemical'];
	saved.labelSettings.decimals.node.quality = 3;
	delete saved.labelSettings.decimals.node['quality:trace'];

	L.applySaved(saved);

	L.setQuality(AGE);
	ok('the stored suffix survives under the mode it was saved in',
		L.labelSuffixFor('node', 'quality') === ' CUSTOM', JSON.stringify(L.labelSuffixFor('node', 'quality')));
	L.setQuality(TRACE);
	ok('...and under a DIFFERENT mode too -- a document that never split by mode has one answer, not three',
		L.labelSuffixFor('node', 'quality') === ' CUSTOM', JSON.stringify(L.labelSuffixFor('node', 'quality')));
	L.setQuality(CHEM);
	ok('...and under the third mode as well',
		L.labelSuffixFor('node', 'quality') === ' CUSTOM', JSON.stringify(L.labelSuffixFor('node', 'quality')));

	L.setQuality(AGE);
	ok('a customized flat decimals count still governs Water age',
		L.qualityDecimals('node') === 3, L.qualityDecimals('node'));
	L.setQuality(TRACE);
	ok('but Source share still gets the new whole-number default -- that key never existed before',
		L.qualityDecimals('node') === 0, L.qualityDecimals('node'));
}

console.log(fails ? ('\n' + fails + ' FAILURE(S)') : '\nall ok');
process.exit(fails ? 1 : 0);
