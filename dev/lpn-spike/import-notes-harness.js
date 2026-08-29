// PER-ASSET IMPORT NOTES -- ROADMAP Task 483. Run with:
//   node dev/lpn-spike/import-notes-harness.js
//
// WHAT THIS DEFENDS. The import report is one dialog, read once and dismissed; after that the fact
// that THIS pump lost its curve, or THIS reservoir arrived with a head and no ground elevation,
// was gone from the model entirely. Task 483 files a copy of each difference on the element it
// names, so the user meets it again at the moment it matters -- standing in that element's own
// property popup, weeks later.
//
// The three ways that can be wrong, one section each, and every one of them is SILENT:
//
//   1. THE NOTE IS NEVER WRITTEN, or is written under the wrong id. Section 1 imports EPA's own
//      Net1/Net2/Net3 and asserts, per element, that the notes on it are exactly the drops that
//      NAMED it -- derived from parsed.dropped, never from a hand-typed expectation, so the
//      fixture cannot go stale when the reader learns a new difference.
//
//   2. THE NOTE DOES NOT SURVIVE A SAVE. A note is metadata and lives in no explicit serializer
//      list, so it rides on doc.nodes/links/labels being written whole -- true today and true only
//      by accident if nothing asserts it. Section 3 does the real save/open round trip
//      (serializeProject -> JSON -> migrateSaved -> applySaved).
//
//   3. THE NOTE LEAKS INTO THE EXPORTED `.inp`. An importNotes key written out as a fake EPANET
//      field would break the one acceptance criterion Task 281 has: import then export is
//      byte-identical for every value the user did not edit. Section 4 asserts the exported text
//      is character-for-character the same with the notes on the document as without them, which
//      is a stronger statement than "the word importNotes does not appear".
//
// AND THE STRING, section 2: a note is stored as a RECORD, not as a sentence, because a document
// opened in Spanish must read in Spanish however it was imported. So the popup composes English at
// display time. A harness that only checked the record would pass while the popup showed a raw
// code like `pump-curve-missing`; section 2 renders the popup and reads the words back out of it.
//
// THE STUB holds nothing this needs: nothing here solves, and the one physical relationship in
// play -- which element a difference names -- comes from the real parser on a real file.

const fs = require('fs');
const path = require('path');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-patterns.js');

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; }, seedDefaultInputs: seedDefaultInputs,\n" +
	"\t\tdocFromInp: docFromInp, inpUnitSelections: inpUnitSelections,\n" +
	"\t\tapplyUnitSelections: applyUnitSelections,\n" +
	"\t\tserializeProject: serializeProject, migrateSaved: migrateSaved, applySaved: applySaved,\n" +
	"\t\tbuildDom: buildDom, nodeById: nodeById, linkById: linkById, labelById: labelById,\n" +
	"\t\trenderNodeFields: renderNodeFields, renderLinkFields: renderLinkFields,\n" +
	"\t\trenderLabelFields: renderLabelFields, inpDropText: inpDropText,\n" +
	"\t\tpopupFields: function () { return document.getElementById('lpn_popup_fields'); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n"
);

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (cond) { return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
function done(label) { console.log('  ' + (fails ? 'FAIL ' : 'ok   ') + label + '   ' + checks + ' checks'); }

const refPath = (f) => path.join(ROOT, 'dev', 'lpn-spike', 'reference', f);
function importDoc(text, name) {
	const parsed = EngCalcs.lpnInpParse(text);
	if (!parsed.ok) { throw new Error(name + ': ' + parsed.error); }
	// Units strip first, exactly as importInpFromFile() orders it.
	L.applyUnitSelections(L.inpUnitSelections(parsed));
	return { parsed, doc: L.docFromInp(parsed, name) };
}
function importFile(f) { return importDoc(fs.readFileSync(refPath(f), 'utf8'), f); }

setUnitSet('us');
L.buildLayers();
L.seedDefaultInputs();

// ---------------------------------------------------------------------------
// 1. Every difference that names an element is filed on that element
// ---------------------------------------------------------------------------
console.log('\n1. EPA Net1/Net2/Net3: the notes on an element are exactly the drops that named it');
{
	let filed = 0, elementsWithNotes = 0;
	['Net1.inp', 'Net2.inp', 'Net3.inp', 'import-cases.inp'].forEach((f) => {
		const { parsed, doc } = importFile(f);
		// THE EXPECTATION IS THE PARSER'S OWN REPORT, regrouped by a deliberately dumber second
		// pass. Asking EngCalcs.lpnInpNotes() for the answer would be asking the defendant.
		// KEYED BY KIND AS WELL AS BY ID, because Net3 holds a junction 123 and a pipe 123 -- 3 of
		// its 4 element-naming differences name an id that exists twice, and a bare-id expectation
		// here would agree with a bare-id implementation and both would be wrong.
		const want = {};
		parsed.dropped.forEach((d) => {
			if (!d.group) { return; }
			(d.ids || []).forEach((id) => {
				const k = d.group + ':' + id;
				(want[k] = want[k] || []).push(d.code + '|' + (d.detail === null || d.detail === undefined ? '' : d.detail));
			});
		});
		const seenKeys = {};
		[['node', doc.nodes], ['link', doc.links]].forEach(([group, list]) => list.forEach((el) => {
			const k = group + ':' + el.id;
			seenKeys[k] = 1;
			const got = (el.importNotes || []).map((n) => n.code + '|' + (n.detail === null || n.detail === undefined ? '' : n.detail));
			const expect = want[k] || [];
			ok(f + ' ' + k + ': notes match the report',
				got.join(' / ') === expect.join(' / '), got.join(' / ') + ' vs ' + expect.join(' / '));
			filed += got.length;
			if (got.length) { elementsWithNotes++; }
		}));
		// A drop naming something NOT in the document (a dangling link, a missing anchor name) must
		// not invent an element and must not throw.
		Object.keys(want).forEach((k) => {
			if (seenKeys[k]) { return; }
			ok(f + ': ' + k + ' is named by the report and is deliberately not in the document', true);
		});
	});
	// A COUNT, because "no notes anywhere" would satisfy every equality above.
	ok('the reference models actually produce notes', filed > 0, filed + ' notes on ' + elementsWithNotes + ' elements');
	console.log('     ' + filed + ' notes filed on ' + elementsWithNotes + ' elements');
}
done('notes are filed per element');

// ---------------------------------------------------------------------------
// 2. The popup shows them as sentences, in the reader's language, not as codes
// ---------------------------------------------------------------------------
console.log('\n2. The property popup reads the note back as a sentence');
{
	// Net3's pump 335 names a curve and its junctions carry demand patterns; Net1's pump 9 does
	// too. Rather than naming one, this walks the models for the first element of each kind that
	// has a note, so the section keeps working when the reader learns a new difference.
	const { doc } = importFile('Net3.inp');
	L.applySaved(L.migrateSaved(JSON.parse(JSON.stringify(doc))));
	L.buildDom();
	const fields = L.popupFields();
	function popupText(kind, el) {
		fields.innerHTML = '';
		if (kind === 'node') { L.renderNodeFields(el.id); }
		else if (kind === 'link') { L.renderLinkFields(el.id); }
		else { L.renderLabelFields(el.id); }
		return fields.textContent;
	}
	let shown = 0;
	[['node', L.getDoc().nodes], ['link', L.getDoc().links]].forEach(([kind, list]) => {
		const el = list.filter((x) => x.importNotes && x.importNotes.length)[0];
		if (!el) { return; }
		const text = popupText(kind, el);
		const first = el.importNotes[0];
		const sentence = L.inpDropText(first.code);
		ok(kind + ' ' + el.id + ': the popup shows the sentence, not the code',
			text.indexOf(sentence) >= 0, JSON.stringify(text.slice(-260)));
		ok(kind + ' ' + el.id + ': ...and the sentence is not the raw code',
			sentence !== first.code, first.code);
		if (first.detail) {
			ok(kind + ' ' + el.id + ": ...and the file's own word for it is shown",
				text.indexOf(String(first.detail)) >= 0, String(first.detail));
		}
		shown++;
	});
	ok('at least one popup was rendered with a note in it', shown > 0, String(shown));
	// An element with NO note gets no heading -- the block must not appear empty on every element
	// in every project ever drawn by hand.
	const clean = L.getDoc().nodes.filter((x) => !x.importNotes)[0];
	if (clean) {
		ok('an element with no note shows no notes block',
			popupText('node', clean).indexOf('What the import could not keep') < 0, clean.id);
	}
}
done('the popup composes the sentence');

// ---------------------------------------------------------------------------
// 3. A note survives save and open
// ---------------------------------------------------------------------------
console.log('\n3. Save then open keeps every note');
{
	const { doc } = importFile('Net3.inp');
	L.applySaved(L.migrateSaved(JSON.parse(JSON.stringify(doc))));
	L.buildDom();
	function fingerprint(d) {
		return d.nodes.concat(d.links).concat(d.labels)
			.filter((e) => e.importNotes && e.importNotes.length)
			.map((e) => e.id + '=' + e.importNotes.map((n) => n.code + '|' + (n.detail === null ? '' : n.detail)).join(','))
			.sort().join(' ');
	}
	const before = fingerprint(L.getDoc());
	ok('the open document has notes to lose', before.length > 0, String(before.length));
	const saved = JSON.parse(JSON.stringify(L.serializeProject()));
	ok('the saved JSON carries them', JSON.stringify(saved).indexOf('importNotes') >= 0);
	L.applySaved(L.migrateSaved(JSON.parse(JSON.stringify(saved))));
	L.buildDom();
	ok('...and they are identical after the round trip', fingerprint(L.getDoc()) === before,
		fingerprint(L.getDoc()).slice(0, 200) + ' vs ' + before.slice(0, 200));
}
done('notes survive save/open');

// A Text anchored to something the file does not contain. Written here rather than added to a
// reference file: EPA's own three models have no such label, and editing a reference `.inp` would
// put our test data inside the thing every other harness compares against.
const GHOST_INP = [
	'[JUNCTIONS]', ' J1 100 50', ' J2 90 25', '',
	'[RESERVOIRS]', ' R1 200', '',
	'[PIPES]', ' P1 R1 J1 1000 12 130 0 Open', ' P2 J1 J2 800 10 130 0 Open', '',
	'[COORDINATES]', ' J1 10 10', ' J2 20 10', ' R1 0 10', '',
	'[LABELS]', ' 5 5 "Anchored to a ghost" J99', ' 6 6 "Anchored for real" J1', ' 7 7 "Free"', '',
	'[END]', ''
].join('\n');

// ---------------------------------------------------------------------------
// 4. The exporter writes none of it
// ---------------------------------------------------------------------------
console.log('\n4. .inp export is byte-identical with the notes on the document');
{
	// The ghost fixture is in this list on purpose: EPA's three models put notes on NODES only, so
	// without it the label writer -- the one place a Text's own note could leak -- is never covered.
	[['Net1.inp'], ['Net2.inp'], ['Net3.inp'], ['ghost.inp', GHOST_INP]].forEach(([f, text]) => {
		const { doc } = text ? importDoc(text, f) : importFile(f);
		const withNotes = EngCalcs.lpnExportInp(doc);
		ok(f + ' exports', withNotes.ok === true, JSON.stringify(withNotes.error));
		if (!withNotes.ok) { return; }
		ok(f + ': no importNotes key reaches the file', withNotes.inp.indexOf('importNotes') < 0);
		// STRIPPED AND RE-EXPORTED, which is the real statement: not "the word is absent" but "the
		// bytes do not depend on the notes at all".
		const stripped = JSON.parse(JSON.stringify(doc));
		stripped.nodes.concat(stripped.links).concat(stripped.labels).forEach((e) => { delete e.importNotes; });
		const without = EngCalcs.lpnExportInp(stripped);
		ok(f + ': the exported text is the same with and without them',
			without.ok === true && without.inp === withNotes.inp);
	});
}
done('export is unaffected');

// ---------------------------------------------------------------------------
// 5. A Text anchored to something the file does not contain
// ---------------------------------------------------------------------------
console.log('\n5. A Text whose anchor is not in the file keeps the name it named');
{
	const { parsed, doc } = importDoc(GHOST_INP, 'ghost.inp');
	const ghost = doc.labels[0], real = doc.labels[1], free = doc.labels[2];
	ok('the ghost anchor is reported', parsed.dropped.some((d) => d.code === 'label-anchor-missing' && d.ids[0] === 'J99'),
		JSON.stringify(parsed.dropped.map((d) => d.code)));
	ok('...the Text comes in anyway', ghost && ghost._text === 'Anchored to a ghost');
	ok('...following nothing', ghost && ghost.anchorNode === null, JSON.stringify(ghost && ghost.anchorNode));
	ok('...at the point the file gave it', ghost && ghost.x === 5 && ghost.y === 5,
		JSON.stringify([ghost && ghost.x, ghost && ghost.y]));
	ok('...and the note names J99', !!(ghost.importNotes || []).some((n) => n.code === 'label-anchor-missing' && n.detail === 'J99'),
		JSON.stringify(ghost.importNotes));
	// THE ANCHOR THAT EXISTS STILL WORKS, and is stored as an offset -- the half of Task 483 that
	// was already built, asserted here so a change to the note path cannot quietly break it.
	ok('a real anchor still attaches', real && real.anchorNode === 'J1', JSON.stringify(real && real.anchorNode));
	ok('...and is stored as an offset from its node', real && real.x === -4 && real.y === -4,
		JSON.stringify([real && real.x, real && real.y]));
	ok('...and carries no note', !real.importNotes);
	ok('a free Text carries no note and no anchor', free && free.anchorNode === null && !free.importNotes);
}
done('the missing anchor is kept as a note');

console.log('\n' + (fails ? 'FAILED ' + fails + ' of ' + checks : 'PASS ' + checks + ' checks'));
process.exit(fails ? 1 : 0);
