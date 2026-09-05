// **THE TAG IN FIND AND REPLACE** (Tom, 2026-09-05, in his own browser pass: *"Tag needs to be
// added to Find."*). Run with:
//
//   node dev/lpn-spike/find-tag-harness.js
//
// `[TAGS]` shipped as Task 579 and the tag reached exactly one screen -- the element popup, one
// element at a time. A tag is the join key to whatever system the utility already keeps its assets
// in, so "which of these is MAIN-1962" and "put this word on all forty of them" are the two things
// anybody would ever want to do with one, and neither was reachable.
//
// **WHAT IS DIFFERENT ABOUT A TAG, AND THEREFORE WHAT THIS FILE ASSERTS.** Every property Find
// already offered was a number or an enum belonging to ONE kind of element. A tag is none of that,
// and each difference is a way to be quietly wrong:
//
//   1. **IT IS ON NODES AND ON LINKS.** Every other writable property belongs to one group, so a
//      Replace spec is written per group. Two specs both named Tag would print the word twice in
//      one pull-down and write only whichever came first -- so `group: 'any'`, and section 1 checks
//      it is offered in every scope where it can match and refused in the one where it cannot.
//   2. **AN ID IS UNIQUE ONLY WITHIN ITS OWN KIND.** The fixture is tags-harness.js's, and it is
//      the shape of a real file: a JUNCTION 12 and a PIPE 12 carrying DIFFERENT tags. One map, or
//      one careless read, gives each the other's.
//   3. **ONE WORD.** EPANET's reader stops at whitespace. Find and replace is a SECOND door onto
//      the same field, and a door that skipped `lpnTagText()` would write a tag the exporter then
//      silently truncated -- the user would see their words on screen and lose them on the way out.
//      Section 3 replaces with `MAIN 1962 south` and follows the result all the way through an
//      export and back in again.
//   4. **A TAG IS BASE-OWNED.** It is not in LPN_OVERRIDABLE, on purpose: a scenario asks what if
//      this pipe were bigger, not what if it were a different asset. So a Replace run INSIDE a
//      scenario writes Base and records no override -- the exact opposite of what every other
//      property in that pull-down does, and section 5 says so out loud rather than leaving the next
//      reader to assume the seam rule was forgotten.
//
// **AND SECTION 4 IS A DEFECT THIS WORK FOUND RATHER THAN A PROPERTY OF THE TAG.** Replace read the
// pull-down state where it should have read the typed query's AST, so after a compound query it
// previewed and wrote the PREVIOUS query's elements. It was wrong for every property; the tag is
// simply the first fixture sharp enough to see it with, because node 12 and link 12 share an id and
// only the group tells the right set from the wrong one.

'use strict';

const { ROOT, ensure, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

// The panel builds itself into these two, and the Replace preview writes its message into a box
// only buildReplaceForm() creates -- so the form is built for real rather than stubbed.
ensure('lpn_find_form');
ensure('lpn_find_results');

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
	"\t\tnodeById: nodeById, linkById: linkById,\n" +
	"\t\texport: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
	// The query, driven through the state the three pull-downs write.
	"\t\tquery: function (scope, prop, op, value) {\n" +
	"\t\t\tfindState.scope = scope; findState.prop = prop; findState.op = op;\n" +
	"\t\t\tfindState.value = value === undefined ? '' : value;\n" +
	"\t\t\treturn findMatches().map(function (c) { return c.group + ':' + c.el.id; });\n" +
	"\t\t},\n" +
	"\t\tpropKeys: function (scope) { findState.scope = scope; return findPropDefs().map(function (p) { return p[0]; }); },\n" +
	"\t\tpropLabels: function (scope) { findState.scope = scope; return findPropDefs().map(function (p) { return p[1]; }); },\n" +
	"\t\topKeys: function (scope, prop) { findState.scope = scope; findState.prop = prop;\n" +
	"\t\t\treturn findOpDefs().map(function (o) { return o[0]; }); },\n" +
	// The write half.
	"\t\tbuildForm: rebuildFindForm,\n" +
	"\t\ttype: function (text) { findQueryInput.value = text;\n" +
	"\t\t\t(findQueryInput._listeners.input || []).forEach(function (f) { f({}); }); },\n" +
	"\t\tpressFind: function () { runFind(); },\n" +
	"\t\tresults: function () { return findResults.map(function (c) { return c.group + ':' + c.el.id; }); },\n" +
	"\t\tsetReplace: function (prop, value) { replaceState.prop = prop; replaceState.value = value; },\n" +
	"\t\tspecFields: function () { return replaceSpecs().map(function (s) { return s.field; }); },\n" +
	"\t\tpreview: runReplacePreview, apply: applyReplace,\n" +
	"\t\tpending: function () { return replacePending && replacePending.refs.map(function (r) { return r.group + ':' + r.id; }); },\n" +
	"\t\tmessage: function () { return replaceMsgBox ? replaceMsgBox.textContent : null; },\n" +
	// Scenarios, for the base-owned assertion.
	"\t\tcreateScenario: createScenario, switchScenario: switchScenario,\n" +
	"\t\tbaseId: function () { return baseScenario().id; },\n" +
	"\t\thasOverride: hasOverride,\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);

ensure('lpn_toolbar').querySelectorAll = () => [];
L.buildLayers();
setUnitSet('us');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function head(t) { console.log('\n' + t); }
function same(a, b) { return JSON.stringify(a.slice().sort()) === JSON.stringify(b.slice().sort()); }
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

// **A JUNCTION 12 AND A PIPE 12 WITH DIFFERENT TAGS**, plus a second junction that is tagged and a
// second pipe that is not. tags-harness.js's fixture, deliberately -- the collision is real (Net3
// holds an id in both kinds) and one fixture serving both files means one thing to keep true.
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

function load() { L.importInp({ name: 'tags.inp', _text: FIXTURE }); }

// =====================================================================================
head('1. WHERE TAG IS OFFERED, and the one scope where it is not');
// =====================================================================================
load();
['all', 'junction', 'reservoir', 'tank', 'pipe', 'pump', 'valve'].forEach(function (scope) {
	ok('Tag is offered under ' + scope, L.propKeys(scope).indexOf('tag') >= 0,
		JSON.stringify(L.propKeys(scope)));
});
// **THE MATCHES-NOTHING RULE, WHICH IS THE ONE FIND ALREADY BROKE ONCE.** A Text label is not an
// asset in anybody's inventory and carries no tag, so offering the row there would be a condition
// that can never match -- exactly the Text.ID defect Tom found on 2026-08-29.
ok('and NOT under Text, which carries no tag', L.propKeys('text').indexOf('tag') < 0,
	JSON.stringify(L.propKeys('text')));
// Band 1: identity. A tag is not a value you typed ABOUT the asset, it is what somebody else's
// records CALL the asset -- so it belongs beside the ID and above Elevation, not among the inputs.
ok('it sits in band 1, immediately after ID', L.propKeys('junction').slice(0, 2).join(',') === 'id,tag',
	JSON.stringify(L.propKeys('junction')));
ok('and on a pipe too', L.propKeys('pipe').slice(0, 2).join(',') === 'id,tag',
	JSON.stringify(L.propKeys('pipe')));
ok('under Everything it is between ID and Connection',
	L.propKeys('all').join(',') === 'id,tag,connection', JSON.stringify(L.propKeys('all')));
// The popup's own whole label, reused rather than re-keyed (CLAUDE.md's concept-level reuse rule).
ok('the row is labelled with the popup\'s own word', L.propLabels('pipe')[1] === 'Tag',
	JSON.stringify(L.propLabels('pipe')[1]));
// **A TAG IS TEXT, SO IT GETS THE TEXT CONDITIONS** -- contains and equals, plus the two extremes,
// and NOT greater/less than, which on a word means nothing.
ok('its conditions are the text ones', same(L.opKeys('pipe', 'tag'), ['contains', 'equals', 'top', 'bottom']),
	JSON.stringify(L.opKeys('pipe', 'tag')));

// =====================================================================================
head('2. THE COLLISION: a junction 12 and a pipe 12 with different tags');
// =====================================================================================
ok('the junction\'s tag finds the junction and nothing else',
	same(L.query('all', 'tag', 'equals', 'METER-4417'), ['node:12']),
	JSON.stringify(L.query('all', 'tag', 'equals', 'METER-4417')));
ok('the pipe\'s tag finds the pipe, not the junction of the same id',
	same(L.query('all', 'tag', 'equals', 'MAIN-1962'), ['link:12']),
	JSON.stringify(L.query('all', 'tag', 'equals', 'MAIN-1962')));
// **CASE-INSENSITIVE, BOTH CONDITIONS**, which is what `id`, `text` and a demand description have
// always meant here: MAIN-1962 and main-1962 are one tag in every asset register anybody keeps.
ok('equals is case-insensitive', same(L.query('all', 'tag', 'equals', 'main-1962'), ['link:12']));
ok('contains is a case-insensitive substring',
	same(L.query('all', 'tag', 'contains', 'meter'), ['node:12']),
	JSON.stringify(L.query('all', 'tag', 'contains', 'meter')));
ok('a scope narrows the same question', same(L.query('pipe', 'tag', 'contains', '196'), ['link:12']));
ok('and finds nothing where the tag is not', same(L.query('junction', 'tag', 'contains', '196'), []));
// **AN EMPTY BOX WITH `contains` IS "WHAT HAVE WE TAGGED"**, not "every element". An untagged
// element reads as undefined, exactly like a fire flow nobody stated, so it is left out.
ok('an empty contains lists exactly the tagged elements',
	same(L.query('all', 'tag', 'contains', ''), ['node:12', 'node:J2', 'link:12']),
	JSON.stringify(L.query('all', 'tag', 'contains', '')));
ok('a tag nobody wrote matches nothing', same(L.query('all', 'tag', 'equals', 'HYD-99'), []));

// =====================================================================================
head('3. A REPLACE GOES THROUGH lpnTagText(), so what is stored survives the export');
// =====================================================================================
load();
L.query('pipe', 'id', 'contains', '');
L.buildForm();
ok('Tag is a writable property of the found set', L.specFields().indexOf('tag') >= 0,
	JSON.stringify(L.specFields()));
// **AN EMPTY BOX IS STILL A REFUSAL.** Erasing the tag on every pipe at once is a real action and a
// destructive one, and it must not be spelled the same way as leaving the value box alone.
L.setReplace('tag', '   ');
L.preview();
ok('an empty value is refused rather than clearing every tag', L.pending() === null, L.message());
ok('and it says which box is empty', /value/i.test(L.message() || ''), L.message());
// The one-word rule, at the door Task 579 did not have.
L.setReplace('tag', 'MAIN 1962 south');
L.preview();
ok('both pipes are previewed', same(L.pending(), ['link:12', 'link:P2']), JSON.stringify(L.pending()));
ok('the count is in the message', /2/.test(L.message() || ''), L.message());
ok('the write reports two', L.apply() === 2);
ok('the pipe stores the FIRST WORD, not the sentence', L.linkById('12').tag === 'MAIN',
	L.linkById('12').tag);
ok('...and so does the pipe that had no tag', L.linkById('P2').tag === 'MAIN', L.linkById('P2').tag);
ok('the junction of the same id is untouched', L.nodeById('12').tag === 'METER-4417',
	L.nodeById('12').tag);
const out = L.export();
ok('the export writes the stored word', /\bMAIN\b/.test(out.inp), JSON.stringify(tagLines(out.inp)));
ok('and writes no sentence', !/1962 south/.test(out.inp), JSON.stringify(tagLines(out.inp)));
// **THE ROUND TRIP IS THE POINT.** A tag with a space in it comes back truncated, so a Replace that
// skipped lpnTagText() would look right on screen and lose the words on the way out and back.
L.importInp({ name: 'roundtrip.inp', _text: out.inp });
ok('and it comes back the same after a round trip', L.linkById('12').tag === 'MAIN',
	L.linkById('12').tag);
ok('on both pipes', L.linkById('P2').tag === 'MAIN', L.linkById('P2').tag);

// **THE SAME ONE SPEC WRITES NODES TOO**, which no other property in this pull-down can do: every
// other writable property belongs to one group, and Tag is a single `group: 'any'` spec offered
// under a node scope and a link scope alike. So it is asserted under BOTH -- one spec, two kinds of
// element, and neither borrowing the other's row.
load();
L.query('junction', 'id', 'contains', '');
L.buildForm();
ok('Tag is writable under a NODE scope as well', L.specFields().indexOf('tag') >= 0,
	JSON.stringify(L.specFields()));
L.setReplace('tag', 'ZONE-7');
L.preview();
ok('both junctions are previewed', same(L.pending(), ['node:12', 'node:J2']), JSON.stringify(L.pending()));
ok('and both are written', L.apply() === 2);
ok('the junction took it', L.nodeById('12').tag === 'ZONE-7', L.nodeById('12').tag);
ok('the pipe of the same id did NOT', L.linkById('12').tag === 'MAIN-1962', L.linkById('12').tag);
// Nothing already carrying the value is counted a second time -- the standing rule that the
// preview's number is a promise about the DOCUMENT, not about the query.
L.query('junction', 'tag', 'equals', 'ZONE-7');
L.buildForm();
L.setReplace('tag', 'ZONE-7');
L.preview();
ok('an element already carrying the tag is not a change', L.pending() === null, L.message());
// **AND "Everything" OFFERS NO WRITE AT ALL**, which is not about the tag: Replace has never
// written under that scope, for any property, and the heading says so in its own words. A tag is
// findable there and changeable one kind at a time, which is the standing behaviour rather than a
// gap this task opened.
L.query('all', 'tag', 'contains', '');
L.buildForm();
ok('Everything still writes nothing, tag included', L.specFields().length === 0,
	JSON.stringify(L.specFields()));

// =====================================================================================
head('4. A COMPOUND QUERY WRITES THE SET IT SHOWS (found here, wrong for every property)');
// =====================================================================================
// **THIS IS NOT A TAG BUG AND IT WAS NOT INTRODUCED TODAY.** replaceSpecs() and replaceTargets()
// called findMatches(), which reads `findState` alone. A typed COMPOUND query has no pull-down
// representation, so findState still holds whatever the controls last expressed and findEvalNode()
// restores it untouched -- meaning Replace previewed and wrote the PREVIOUS query's elements under
// a count the user had read and approved. It surfaced on the tag because a tag is the first
// property a node and a link can both be found by in one query.
//
// The tag is the sharpest fixture available: node 12 and link 12 share an id, so a set built from
// the wrong half is indistinguishable by id alone and only the GROUP gives it away.
load();
L.query('junction', 'id', 'contains', '');   // the stale state the bug used to write to
L.buildForm();
L.type("Junction.Tag equal to 'METER-4417' OR Pipe.Tag equal to 'MAIN-1962'");
L.pressFind();
ok('the compound query finds one node and one link',
	same(L.results(), ['node:12', 'link:12']), JSON.stringify(L.results()));
L.setReplace('tag', 'BOTH');
L.preview();
ok('and the preview names THOSE two, not the pull-downs\' leftovers',
	same(L.pending(), ['node:12', 'link:12']), JSON.stringify(L.pending()));
ok('the write reports two', L.apply() === 2);
ok('the junction took it', L.nodeById('12').tag === 'BOTH', L.nodeById('12').tag);
ok('the pipe took it', L.linkById('12').tag === 'BOTH', L.linkById('12').tag);
ok('and the junction the stale query would have hit is untouched',
	L.nodeById('J2').tag === 'HYD-88', L.nodeById('J2').tag);

// =====================================================================================
head('5. A TAG IS BASE-OWNED: a Replace inside a scenario writes BASE, and that is the ruling');
// =====================================================================================
// Every other property in this pull-down goes through setProp(), and inside a scenario that records
// an override. A tag deliberately does not: it is not in LPN_OVERRIDABLE, because a scenario asks
// what if this pipe were bigger, not what if it were a different asset. So the assertion here is
// the OPPOSITE of replace-harness.js's, and the two must both hold.
load();
L.createScenario('What if');
L.query('pipe', 'id', 'equals', '12');
L.buildForm();
L.setReplace('tag', 'SCN-TAG');
L.preview();
ok('the replace runs inside the scenario', same(L.pending(), ['link:12']), JSON.stringify(L.pending()));
ok('and writes one', L.apply() === 1);
ok('the tag is written on the element itself', L.linkById('12').tag === 'SCN-TAG',
	L.linkById('12').tag);
ok('NO override is recorded, because a tag is not overridable',
	L.hasOverride(L.linkById('12'), 'tag') === false);
ok('and no _tag is invented for nothing to read', L.linkById('12')._tag === undefined,
	String(L.linkById('12')._tag));
L.switchScenario(L.baseId());
ok('so Base carries it too, which is the ruling and not a leak',
	L.linkById('12').tag === 'SCN-TAG', L.linkById('12').tag);

console.log('\n' + (fails ? fails + ' FAILURE(S)' : 'All checks passed.'));
process.exit(fails ? 1 : 0);
