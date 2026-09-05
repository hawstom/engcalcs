// **`[TAGS]`, INTERPRETED** -- ROADMAP Task 579. Run with:
//
//   node dev/lpn-spike/tags-harness.js
//
// A free-text word on any node or link. It was carried verbatim and never read, and it is the ONE
// interpreted section that changes no answer: EPANET does not read a tag either, so nothing here
// reaches a solve. What it buys is the join to whatever system the utility already keeps its assets
// in, which is most of what makes a model of somebody's real network somebody's real network. It is
// also where Task 247's customer and account work belongs.
//
// **SO THE ENGINE ASSERTION EVERY OTHER SECTION HARNESS LEANS ON DOES NOT EXIST HERE**, and this
// file says so rather than inventing a weaker substitute. Section 4 asserts the ABSENCE instead:
// tagging every element must not move a single number, which is the honest thing to check about a
// section that is metadata. A tag that changed an answer would be a defect.
//
// **THE THREE THAT MATTER:**
//   1. TWO MAPS, NOT ONE. An EPANET id is unique only within its own kind, and this fixture holds a
//      junction `12` and a pipe `12` with different tags. One map gives each the other's.
//   2. ONE WORD. EPANET's reader stops at whitespace, so a tag with a space comes back truncated
//      and everything after the first word is silently lost. Enforced as you type, not at save.
//   3. THE ONCE-ONLY READ HAS ITS OWN GUARD. [TAGS] landed after [SOURCES], so a project saved in
//      between already carries `settings.sources`; a tags read nested under that test would walk
//      past exactly the documents it exists for. Section 5 is a document in that state.

'use strict';

const { ROOT, setUnitSet, loadLoopedNetwork, NODE_ENGINE_URL } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');
require(ROOT + 'js/lpn-epanet.js');

global.FileReader = function () {
	this.readAsArrayBuffer = function (file) {
		const bytes = new TextEncoder().encode(file._text);
		this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
		if (this.onload) { this.onload({ target: { result: this.result } }); }
	};
};
global.alert = global.window.alert = function () { };

const L = loadLoopedNetwork(
	"\t\timportInp: importInpFromFile, getDoc: function () { return doc; },\n" +
	"\t\tgetSettings: function () { return settings; },\n" +
	"\t\tserialize: serializeProject, migrateSaved: migrateSaved, applySaved: applySaved,\n" +
	"\t\tassembleModel: assembleModel, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tnodeById: nodeById, linkById: linkById,\n" +
	"\t\tpopupNode: function (id) { renderNodeFields(id); return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tpopupLink: function (id) { renderLinkFields(id); return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\texport: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
const EngCalcs = global.EngCalcs;
L.buildLayers();
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name + (extra === undefined ? '' : '   ' + extra)); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function head(t) { console.log('\n' + t); }
function sectionCount(text, name) {
	return (text.match(new RegExp('^\\s*\\[' + name + '\\]', 'gm')) || []).length;
}
function tagLines(text) {
	const out = [];
	let inTags = false;
	for (const raw of text.split(/\r?\n/)) {
		const m = /^\s*\[(\w+)\]/.exec(raw);
		if (m) { inTags = m[1].toUpperCase() === 'TAGS'; continue; }
		if (inTags && raw.replace(/;.*$/, '').trim()) { out.push(raw.replace(/\s+$/, '')); }
	}
	return out;
}

// **A JUNCTION 12 AND A PIPE 12, WHICH IS THE COLLISION.** Net3 really does hold an id in both
// kinds, so this is the shape of a real file and not a contrived one.
const FIXTURE = [
	'[TITLE]',
	'Tags fixture',
	'',
	'[JUNCTIONS]',
	' 12              \t100         \t50          \t;',
	' J2              \t90          \t25          \t;',
	'',
	'[RESERVOIRS]',
	' R1              \t200         \t;',
	'',
	'[PIPES]',
	' 12              \tR1          \t12          \t1000        \t12          \t100         \t0           \tOpen  ;',
	' P2              \t12          \tJ2          \t1000        \t12          \t100         \t0           \tOpen  ;',
	'',
	'[TAGS]',
	' NODE            \t12          \tMETER-4417',
	' LINK            \t12          \tMAIN-1962',
	' NODE            \tJ2          \tHYD-88',
	'',
	'[OPTIONS]',
	' Units           \tGPM',
	' Headloss        \tH-W',
	'',
	'[COORDINATES]',
	' 12              \t10          \t10',
	' J2              \t20          \t10',
	' R1              \t0           \t10',
	'',
	'[END]',
	''
].join('\n');

(async function () {
	// =====================================================================================
	head('1. TWO MAPS: a junction 12 and a pipe 12 keep their own tags');
	// =====================================================================================
	const parsed = EngCalcs.lpnTagsParse(tagLines(FIXTURE));
	ok('the node map holds the junction\'s tag', parsed.node['12'] === 'METER-4417', parsed.node['12']);
	ok('the link map holds the pipe\'s, and they are different', parsed.link['12'] === 'MAIN-1962', parsed.link['12']);
	ok('and a second node is read too', parsed.node.J2 === 'HYD-88', parsed.node.J2);
	// A row naming neither kind is not a tag row. It is dropped from the MAP and never from the
	// FILE: the carried text is still what the exporter writes back while it parses to what the
	// document states, so a section another program invented survives untouched.
	const odd = EngCalcs.lpnTagsParse([' PATTERN  X  Y', ' NODE  A', ' NODE  B  ']);
	ok('a row that is neither NODE nor LINK is not a tag', Object.keys(odd.node).length === 0
		&& Object.keys(odd.link).length === 0, JSON.stringify(odd));

	// =====================================================================================
	head('2. ONE WORD, because EPANET\'s reader stops at whitespace');
	// =====================================================================================
	ok('a tag with a space keeps its first word only',
		EngCalcs.lpnTagText('MAIN 1962 south') === 'MAIN', EngCalcs.lpnTagText('MAIN 1962 south'));
	ok('surrounding space is not a word', EngCalcs.lpnTagText('  HYD-88  ') === 'HYD-88');
	ok('and an empty tag is empty rather than a blank word',
		EngCalcs.lpnTagText('   ') === '' && EngCalcs.lpnTagText(undefined) === '');

	// =====================================================================================
	head('3. IMPORT THEN EXPORT IS BYTE-IDENTICAL while nothing has been edited');
	// =====================================================================================
	L.importInp({ name: 'tags.inp', _text: FIXTURE });
	const doc0 = L.getDoc();
	ok('the junction carries its tag', L.nodeById('12').tag === 'METER-4417', L.nodeById('12').tag);
	ok('the pipe carries its own, not the junction\'s',
		L.linkById('12').tag === 'MAIN-1962', L.linkById('12').tag);
	const out0 = L.export();
	ok('[TAGS] appears exactly once', sectionCount(out0.inp, 'TAGS') === 1,
		String(sectionCount(out0.inp, 'TAGS')));
	// The file's own characters, column padding included: `lpnTagsText()` hands the carried lines
	// straight back while they still parse to what the document states.
	ok('and its lines are the file\'s own, character for character',
		tagLines(out0.inp).join('|') === tagLines(FIXTURE).join('|'),
		JSON.stringify(tagLines(out0.inp)));

	// =====================================================================================
	head('4. A TAG CHANGES NO ANSWER, which is the assertion this section is owed');
	// =====================================================================================
	await EngCalcs.lpnEpanetLoad(NODE_ENGINE_URL);
	const before = await EngCalcs.lpnEpanetRun(L.assembleModel(), { sliceMs: 100000 });
	L.nodeById('J2').tag = 'CHANGED-1';
	L.linkById('P2').tag = 'CHANGED-2';
	const after = await EngCalcs.lpnEpanetRun(L.assembleModel(), { sliceMs: 100000 });
	ok('the network ran both times', before.ok && after.ok, JSON.stringify(before.error || after.error || ''));
	ok('and every head is identical after tagging two elements',
		JSON.stringify(before.frames[0].heads) === JSON.stringify(after.frames[0].heads),
		JSON.stringify(after.frames[0].heads));
	ok('the engine input states no [TAGS] at all, because EPANET does not read one',
		sectionCount(EngCalcs.lpnToInp(L.assembleModel()).inp || '', 'TAGS') === 0);

	// =====================================================================================
	head('5. AN EDIT IS COMPOSED, and a tag cleared writes no row');
	// =====================================================================================
	const out1 = L.export();
	const lines1 = tagLines(out1.inp);
	ok('the edited tags are written', /CHANGED-1/.test(out1.inp) && /CHANGED-2/.test(out1.inp),
		JSON.stringify(lines1));
	ok('the untouched ones are still there', /METER-4417/.test(out1.inp) && /MAIN-1962/.test(out1.inp));
	ok('and [TAGS] is still written once', sectionCount(out1.inp, 'TAGS') === 1);
	delete L.nodeById('12').tag;
	const out2 = L.export();
	ok('a cleared tag writes no row for that element', !/METER-4417/.test(out2.inp),
		JSON.stringify(tagLines(out2.inp)));

	// =====================================================================================
	head('6. THE TWO DOORS, and the guard that is the reason for this section');
	// =====================================================================================
	// Save and reopen: the tags must survive as document data rather than being re-read from text.
	L.nodeById('12').tag = 'METER-4417';
	const saved = JSON.parse(JSON.stringify(L.serialize()));
	L.applySaved(L.migrateSaved(saved));
	ok('a saved and reopened project keeps every tag',
		L.nodeById('12').tag === 'METER-4417' && L.linkById('12').tag === 'MAIN-1962'
		&& L.nodeById('J2').tag === 'CHANGED-1',
		[L.nodeById('12').tag, L.linkById('12').tag, L.nodeById('J2').tag].join('|'));

	// **THE DOCUMENT THIS GUARD EXISTS FOR.** Saved after [SOURCES] shipped and before [TAGS] did:
	// it carries `settings.sources`, no `settings.tags`, no `tag` on any element, and the file's own
	// [TAGS] text on `inpSections`. A tags read nested inside the sources guard walks straight past
	// it and every tag in that project is lost on the next export.
	const legacy = JSON.parse(JSON.stringify(saved));
	delete legacy.settings.tags;
	legacy.settings.sources = { read: true };
	(legacy.nodes || []).forEach(function (n) { delete n.tag; });
	(legacy.links || []).forEach(function (l) { delete l.tag; });
	legacy.inpSections = legacy.inpSections || {};
	legacy.inpSections.TAGS = tagLines(FIXTURE);
	L.applySaved(L.migrateSaved(legacy));
	ok('a project saved between the two tasks still gets its tags read',
		L.nodeById('12').tag === 'METER-4417' && L.linkById('12').tag === 'MAIN-1962',
		[L.nodeById('12').tag, L.linkById('12').tag].join('|'));

	// =====================================================================================
	head('7. THE POPUP, on a node and on a link');
	// =====================================================================================
	const np = L.popupNode('12');
	ok('the node popup offers a Tag row', /Tag/.test(np.textContent || ''),
		(np.textContent || '').slice(-120));
	const lp = L.popupLink('12');
	ok('and so does the link popup', /Tag/.test(lp.textContent || ''),
		(lp.textContent || '').slice(-120));

	console.log('\n' + (fails ? fails + ' FAILURE(S)' : 'All checks passed.'));
	process.exit(fails ? 1 : 0);
}());
