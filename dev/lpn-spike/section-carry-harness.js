// EVERY EPANET SECTION THIS PAGE DOES NOT READ IS CARRIED, NOT DISCARDED. Run with:
//   node dev/lpn-spike/section-carry-harness.js
//
// Tom, 2026-08-29, having exported a file he had just imported: *"every setting from EPANET must be
// added and implemented unless research says otherwise"*, and, reading the import report: *"The
// import message is confusing. We should not be discarding anything, should we? It seems to be
// saying that quality and pump energy cost info is discarded."*
//
// **THE SAME DEFECT, THE THIRD TIME.** `[OPTIONS]` was fixed under Task 553 and `[RULES]` under
// 248.03, and both times the fix was the same three words: keep the user's own text. The sections
// left over -- [ENERGY], [QUALITY], [SOURCES], [REACTIONS], [MIXING], [TAGS], [REPORT] -- were in
// the importer's REPORTABLE list, which means each was COUNTED as a difference and then dropped, so
// EPA's own Net1 came back out of the exporter with no chlorine, no reaction coefficients and no
// pump price. That is CLAUDE.md's input-file-is-canonical rule broken in the quietest way there is.
//
// **THE DESIGN IS "READ" AS THE LIST, NOT "CARRY".** js/lpn-inp.js names the sections it takes
// APART; everything else is carried verbatim by default. That is the safe direction for the one
// case nobody can enumerate -- a section some other program invented -- and section 5 is that case.
//
// **THE EXPECTATION IS THE FILE.** Nothing here holds a copy of what Net1 states. The carried set is
// derived by subtracting js/lpn-inp.js's own INP_SECTIONS_READ, read out of the source, from the
// section headers the `.inp` actually has; the lines are compared against the file's own.
//
// **AND THE SENTENCE, WHICH IS THE HALF THAT WAS WRONG TWICE.** Carrying a thing and telling the
// user about it are two jobs (Task 248.03's lesson). Section 4 renders the real report and asserts
// that nothing it says about a carried section claims a loss.

'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');

require(ROOT + 'js/lpn-patterns.js');
require(ROOT + 'js/lpn-time.js');
require(ROOT + 'js/lpn-inp.js');
require(ROOT + 'js/lpn-net.js');

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
	"\t\tserialize: serializeProject, migrateSaved: migrateSaved, applySaved: applySaved,\n" +
	"\t\tassembleModel: assembleModel, dropText: inpDropText,\n" +
	"\t\texport: function () { return EngCalcs.lpnExportInp(serializeProject(), { effective: effective }); },\n" +
	"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); }\n"
);
L.buildLayers();
setUnitSet('us');

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (cond) { return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '   ' + extra));
}
function done(label) { console.log('  ' + (fails ? 'FAIL ' : 'ok   ') + label + '   ' + checks + ' checks'); }

// **THE LIST OF SECTIONS THE READER TAKES APART, READ OUT OF THE READER.** A second copy here would
// pass forever after somebody taught the importer a new section and forgot this file.
const SECTIONS_READ = (function () {
	const src = fs.readFileSync(ROOT + 'js/lpn-inp.js', 'utf8');
	const m = /var INP_SECTIONS_READ = \{([\s\S]*?)\};/.exec(src);
	if (!m) { throw new Error('cannot find INP_SECTIONS_READ in js/lpn-inp.js -- fix the parse, do not restate the list'); }
	const out = {};
	for (const p of m[1].matchAll(/(\w+)\s*:\s*1/g)) { out[p[1]] = 1; }
	if (Object.keys(out).length < 15) { throw new Error('INP_SECTIONS_READ parsed as ' + Object.keys(out).length + ' names'); }
	return out;
}());

// A deliberately dumber reader than the one under test: section header, then the lines under it with
// blank lines and comment-only lines removed, exactly as the carry itself keeps them.
function sectionLines(text) {
	const out = {};
	let section = null;
	for (const raw of text.split(/\r?\n/)) {
		const m = /^\s*\[(\w+)\]/.exec(raw);
		if (m) { section = m[1].toUpperCase(); out[section] = out[section] || []; continue; }
		if (!section) { continue; }
		const bare = raw.replace(/;.*$/, '');
		if (!bare.trim()) { continue; }
		out[section].push(raw.replace(/\s+$/, ''));
	}
	return out;
}

const REFERENCE = ['Net1.inp', 'Net2.inp', 'Net3.inp'];
const refPath = (f) => path.join(ROOT, 'dev', 'lpn-spike', 'reference', f);

// ------------------------------------------------------------------------------------------------
// 1. EPA's own Net1/Net2/Net3: every carried section comes back out line for line.
// ------------------------------------------------------------------------------------------------
console.log('\n1. Every section EPA states and this page does not read survives a round trip');
let carriedSeen = 0;
REFERENCE.forEach((f) => {
	const text = fs.readFileSync(refPath(f), 'utf8');
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: f, _text: text });

	const src = sectionLines(text);
	const carried = Object.keys(src).filter((n) => !SECTIONS_READ[n] && src[n].length);
	// A file with none of these would make every assertion below vacuous, and all three EPA models
	// have them -- so this counts as well as asserts.
	ok(f + ' states sections this page does not read', carried.length > 0, carried.join(','));

	const doc = L.getDoc();
	carried.forEach((name) => {
		carriedSeen++;
		ok(f + ' ' + name + ' reached the document',
			(doc.inpSections[name] || []).length === src[name].length,
			(doc.inpSections[name] || []).length + ' vs ' + src[name].length);
		// THE CHARACTERS, not a rebuilt line: nothing here understands these sections well enough
		// to compose one, and `String(parseFloat('1.0'))` is `'1'`.
		ok(f + ' ' + name + ' is the file\'s own characters',
			(doc.inpSections[name] || []).join('\n') === src[name].join('\n'),
			JSON.stringify((doc.inpSections[name] || [])[0]) + ' vs ' + JSON.stringify(src[name][0]));
	});

	const out = L.export();
	ok(f + ' exports', out.ok === true, out && out.error);
	const back = sectionLines(out.inp);
	carried.forEach((name) => {
		ok(f + ' ' + name + ' is written back unchanged',
			(back[name] || []).join('\n') === src[name].join('\n'),
			JSON.stringify((back[name] || []).slice(0, 2)));
	});

	// A save and an open is the round trip a person makes every day, and a field in no explicit
	// serializer list rides on nothing.
	const saved = JSON.parse(JSON.stringify(L.serialize()));
	L.applySaved(L.migrateSaved(saved));
	const reopened = sectionLines(L.export().inp);
	carried.forEach((name) => {
		ok(f + ' ' + name + ' survives save and open',
			(reopened[name] || []).join('\n') === src[name].join('\n'));
	});
});
ok('the three models between them exercised several carried sections', carriedSeen >= 8, carriedSeen);
done('EPA\'s own models keep everything they state');

// ------------------------------------------------------------------------------------------------
// 2. And nothing is invented for a file that states none.
// ------------------------------------------------------------------------------------------------
console.log('\n2. A file stating none gets none invented, and says nothing about them');
const BARE = [
	'[TITLE]',
	'A network with nothing but a network in it',
	'',
	'[JUNCTIONS]',
	' J1              	100         	200         	                	;',
	'',
	'[RESERVOIRS]',
	' R1              	150         	                	;',
	'',
	'[PIPES]',
	' P1              	R1          	J1          	1000        	12          	130         	0           	Open  	;',
	'',
	'[OPTIONS]',
	' Units              	GPM',
	' Headloss           	H-W',
	'',
	'[END]',
	''
].join('\n');
{
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: 'bare.inp', _text: BARE });
	ok('nothing was carried', Object.keys(L.getDoc().inpSections || {}).length === 0,
		JSON.stringify(L.getDoc().inpSections));
	const inp = L.export().inp;
	// An empty [ENERGY] header is a statement the source never made -- the same reasoning
	// `[OPTIONS] Pattern` follows, and what keeps the round trip byte-identical.
	['ENERGY', 'QUALITY', 'SOURCES', 'REACTIONS', 'MIXING', 'TAGS', 'REPORT', 'RULES'].forEach((name) => {
		ok('no [' + name + '] header is invented', !new RegExp('^\\[' + name + '\\]', 'm').test(inp));
	});
	const notes = byId.lpn_dialog_body.textContent || '';
	ok('...and the report mentions none of them',
		!/pumps cost|water quality|tags|report it prints|does not read at all/i.test(notes),
		JSON.stringify(notes.slice(0, 200)));
}
done('silence about what the file does not say');

// ------------------------------------------------------------------------------------------------
// 3. A section stated IS still reported -- the trap Task 248.03 recorded.
// ------------------------------------------------------------------------------------------------
console.log('\n3. Keeping a section did not stop it being reported');
{
	// The line that KEEPS the text `continue`s past the counter every other section reaches. When
	// [RULES] started being kept it silently stopped being reported at all, and the same one line
	// now keeps seven more sections -- so the counter is asserted at the source of the difference
	// rather than only through the dialog.
	const parsed = EngCalcs.lpnInpParse(fs.readFileSync(refPath('Net1.inp'), 'utf8'));
	const codes = parsed.dropped.map((d) => d.code);
	['energy', 'quality', 'reactions', 'report'].forEach((code) => {
		ok('Net1 still reports its ' + code + ' section', codes.indexOf(code) >= 0, codes.join(','));
	});
	// Net1's [TAGS], [SOURCES] and [MIXING] hold nothing but a column heading, and a file that
	// states nothing must not be told it did.
	['tags', 'sources', 'mixing'].forEach((code) => {
		ok('...and says nothing about its empty ' + code + ' section', codes.indexOf(code) < 0, codes.join(','));
	});
}
done('carried and counted, which are two jobs');

// ------------------------------------------------------------------------------------------------
// 4. THE SENTENCE. Nothing carried may be described as a loss.
// ------------------------------------------------------------------------------------------------
console.log('\n4. The report no longer claims a loss for anything it keeps');
{
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: 'Net1.inp', _text: fs.readFileSync(refPath('Net1.inp'), 'utf8') });
	const notes = byId.lpn_dialog_body.textContent || '';
	// The exact words Tom read and objected to. `discarded` never shipped; `left out` did, on the
	// sentence that covered both water quality and pump energy cost.
	ok('the report does not say anything was left out or discarded',
		!/left out|discard|thrown away(?! )/i.test(notes.replace(/nothing in your file is thrown away/i, '')),
		JSON.stringify((/[^.]*(left out|discard)[^.]*\./i.exec(notes) || [])[0]));
	// Each carried subject says the two things that are true of it: this page does not use it, and
	// it is kept and written back.
	['energy', 'quality', 'reactions', 'sources', 'mixing', 'tags', 'report', 'other-sections'].forEach((code) => {
		const s = L.dropText(code);
		ok(code + ' has a sentence of its own', s !== code && s.length > 40, s);
		ok(code + ' says it is kept and written back', /\bkept\b/.test(s) && /written back/.test(s), s);
		ok(code + ' does not claim a loss', !/left out|discard/i.test(s), s);
	});
	// Energy and water quality are unrelated subjects and shared one sentence, which is a large part
	// of why the old one read as a list of casualties.
	ok('energy and water quality no longer share a sentence', L.dropText('energy') !== L.dropText('quality'));
}
done('kept is not lost, and the words say so');

// ------------------------------------------------------------------------------------------------
// 5. A section nobody has heard of, and the ENGINE, which must be handed none of them.
// ------------------------------------------------------------------------------------------------
console.log('\n5. An unknown section is carried by name, and no carried section reaches the engine');
const ODD = BARE.replace('[OPTIONS]', '[VENDORDATA]\n VDA1            	something we do not model\n\n[OPTIONS]');
{
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: 'odd.inp', _text: ODD });
	ok('the unknown section is carried',
		(L.getDoc().inpSections.VENDORDATA || []).length === 1,
		JSON.stringify(L.getDoc().inpSections));
	ok('...and written back', /^\[VENDORDATA\]$/m.test(L.export().inp),
		JSON.stringify((L.export().inp.match(/\[VENDORDATA\][\s\S]{0,60}/) || [])[0]));
	// The only true thing anybody can say about it is what the file called it, so the report names
	// it rather than describing it.
	const notes = byId.lpn_dialog_body.textContent || '';
	ok('...and the report names it', /VENDORDATA/.test(notes), JSON.stringify(notes.slice(-200)));

	// **THE ENGINE IS HANDED NONE OF THE SECTIONS THIS PAGE ONLY CARRIES**, on the [RULES] reason:
	// js/lpn-epanet.js writes LPS and METRES always, EPANET rejects a whole input over one line
	// naming an element it was not given, and no answer this page shows depends on a section
	// nothing here reads. Silence is the correct input.
	//
	// **[QUALITY] AND [REACTIONS] LEFT THAT LIST 2026-09-03, AND [ENERGY] LEFT IT 2026-09-04**
	// (Task 566). All three are INTERPRETED now, so the engine is handed them composed from the
	// model's own record rather than as carried text -- which is the opposite of passing a section
	// through. [QUALITY] and [REACTIONS] are still absent for every analysis that is not a
	// chemical, and that is asserted below rather than assumed; [ENERGY] rides on every run,
	// because energy is what the pumps did.
	byId.lpn_dialog_body.children.length = 0;
	L.importInp({ name: 'Net1.inp', _text: fs.readFileSync(refPath('Net1.inp'), 'utf8') });
	const built = EngCalcs.lpnToInp(L.assembleModel());
	['SOURCES', 'MIXING', 'TAGS', 'REPORT'].forEach((name) => {
		ok('the engine input states no [' + name + ']', !new RegExp('^\\[' + name + '\\]', 'm').test(built.inp));
	});
	// **AND [ENERGY] IS WRITTEN, WITH NET1'S OWN EFFICIENCY IN IT** (Task 566). Net1 states
	// `Global Efficiency 75`, and handing that to the engine is the whole reason the page can say
	// what a pump costs. It states no `PUMP <id> EFFIC <curve>` and neither do Net2 and Net3, so no
	// EFFIC row is expected here -- and since Task 582 that is a fact about the FILE rather than
	// about the writer, which now emits the row and its curve together
	// (dev/lpn-spike/pump-effic-curve-harness.js).
	ok('the engine input states [ENERGY], composed from the record', /^\[ENERGY\]/m.test(built.inp),
		JSON.stringify((built.inp.match(/\[ENERGY\][\s\S]{0,60}/) || [])[0]));
	ok('...with Net1\'s own global efficiency in it', /Global Efficiency  75/.test(built.inp));
	ok('...and no EFFIC row, because Net1 states no efficiency curve', !/EFFIC/.test(built.inp));
	// Net1 states `Quality Chlorine mg/L`, so this import IS a chemical run and the two interpreted
	// sections are exactly what it needs.
	ok('...but a chemical run is handed the two sections it needs',
		/^\[QUALITY\]/m.test(built.inp) && /^\[REACTIONS\]/m.test(built.inp));
	ok('...with Net1\'s own bulk coefficient in them', /Global Bulk  -0.5/.test(built.inp),
		JSON.stringify((built.inp.match(/\[REACTIONS\][\s\S]{0,90}/) || [])[0]));
	{
		const notChem = L.assembleModel();
		notChem.quality = { mode: 'age' };
		const ageInp = EngCalcs.lpnToInp(notChem).inp;
		ok('...and a water-age run is handed neither',
			!/^\[QUALITY\]/m.test(ageInp) && !/^\[REACTIONS\]/m.test(ageInp));
	}
	// And carrying them changed nothing about what the engine IS given.
	ok('the engine input is still a network', /^\[JUNCTIONS\]/m.test(built.inp) && /^\[PIPES\]/m.test(built.inp));
}
done('the unknown is kept, and the engine is spared');

// ------------------------------------------------------------------------------------------------
// 6. THE GALLERY, which is where this was actually noticed.
// ------------------------------------------------------------------------------------------------
console.log('\n6. A shipped example states what its own source .inp states');
{
	// **A GALLERY EXAMPLE IS A STORED PROJECT, NOT A RE-IMPORT**, so it does not gain a feature the
	// day the importer does -- `examples/Net3.lwn` carried no `Quality` line for as long as the
	// carry existed, and the first person to notice was Tom exporting one. The source `.inp` is the
	// expectation here for the same reason it is everywhere else in this file.
	// **AND CARRYING IS ONLY HALF OF IT** (2026-09-04). A section this page INTERPRETS is not in
	// `inpSections` at all -- it is taken apart onto the model record -- so a stored project written
	// before the page learned to interpret it passes every carry check above and still opens with
	// the information missing from the interface. That is how the gallery came to state
	// `Quality Trace Lake` in its carried options while `settings.quality` said nothing, so Net3
	// opened in no analysis at all. The expectation is a FRESH IMPORT of the example's own source:
	// whatever the importer makes of that file today, the stored copy must already say.
	//
	// The named fields are the interpreted record, and naming them is deliberate -- the gallery
	// differs from a fresh import ON PURPOSE in engine, view, labels and backdrop, so a whole-object
	// comparison would fail for the wrong reasons. Add a field here when the importer learns one.
	const INTERPRETED = ['settings.quality', 'settings.reactions', 'settings.energy', 'times.qualityStep'];
	const dig = (o, p) => p.split('.').reduce((v, k) => (v == null ? v : v[k]), o);
	['Net1', 'Net2', 'Net3'].forEach((name) => {
		const srcText = fs.readFileSync(
			path.join(ROOT, 'dev', 'water-network-examples', name + '.inp'), 'utf8');
		const src = sectionLines(srcText);
		const carried = Object.keys(src).filter((n) => !SECTIONS_READ[n] && src[n].length);
		const saved = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', name + '.lwn'), 'utf8'));

		byId.lpn_dialog_body.children.length = 0;
		L.importInp({ name: name + '.inp', _text: srcText });
		const fresh = L.serialize();
		INTERPRETED.forEach((f) => {
			ok(name + ' gallery copy carries its interpreted ' + f,
				JSON.stringify(dig(saved, f)) === JSON.stringify(dig(fresh, f)),
				'stored ' + JSON.stringify(dig(saved, f)) + ' vs source ' + JSON.stringify(dig(fresh, f)));
		});
		// [QUALITY]'s initial quality is per NODE, and is the one interpreted field that is not a
		// single value. Net3 states none, which is itself the expectation.
		{
			const want = {}, got = {};
			(fresh.nodes || []).forEach((n) => { if (n._initQuality != null) { want[n.id] = n._initQuality; } });
			(saved.nodes || []).forEach((n) => { if (n._initQuality != null) { got[n.id] = n._initQuality; } });
			ok(name + ' gallery copy carries its ' + Object.keys(want).length + ' initial qualities',
				JSON.stringify(want) === JSON.stringify(got),
				Object.keys(got).length + ' stored');
		}

		L.applySaved(L.migrateSaved(saved));
		const out = L.export();
		ok(name + ' exports from the gallery', out.ok === true, out && out.error);
		const back = sectionLines(out.inp);
		carried.forEach((sec) => {
			ok(name + ' gallery copy states its ' + sec,
				(back[sec] || []).join('\n') === src[sec].join('\n'),
				JSON.stringify((back[sec] || []).slice(0, 2)));
		});
		// The three water-quality `[OPTIONS]` (Task 553), which is the line Tom looked for.
		const opt = (src.OPTIONS || []).filter((l) => /^\s*Quality\s/i.test(l))[0];
		ok(name + '\'s source states a Quality option', !!opt, JSON.stringify(opt));
		ok(name + ' gallery copy writes it back',
			(back.OPTIONS || []).some((l) => l.trim().replace(/\s+/g, ' ') === opt.trim().replace(/\s+/g, ' ')),
			JSON.stringify((back.OPTIONS || []).filter((l) => /Quality/i.test(l))));
	});
}
done('the gallery has not fallen behind its own sources');

// ---- A CARRIED OPTION REACHES THE SCREEN, not just the parse result ---------------------------
//
// **THE GAP THIS SHUTS IS THE ONE TOM FELL INTO** (2026-09-02: *"I can't see that the import report
// mentions PDA."*). Everything about `Demand Model PDA` was asserted at the PARSER -- the code is
// emitted, the token round-trips -- and nothing asserted that the report a person actually reads
// says a word about it. A drop code with no sentence behind it renders as the bare code string
// (`inpDropText`'s own default), which is a defect nobody would call a defect: it looks like a
// label. So the sentence is read back through the same function the dialog calls.
console.log('\n10. a carried option has a sentence a person can read');
{
	const inp = [
		'[TITLE]', 'pressure-driven', '',
		'[JUNCTIONS]', ' J1\t100\t250', '',
		'[RESERVOIRS]', ' R1\t220.0', '',
		'[PIPES]', ' P1\tR1\tJ1\t1200\t12\t130\t0\tOpen', '',
		'[OPTIONS]', ' Units\tGPM', ' Headloss\tH-W', ' Demand Model\tPDA',
		' Minimum Pressure\t0.0', ' Required Pressure\t20', '',
		'[COORDINATES]', ' J1\t10.0\t10.0', ' R1\t0.0\t0.0', '', '[END]', ''
	].join('\n');
	const parsed = EngCalcs.lpnInpParse(inp);
	const codes = (parsed.dropped || []).map((d) => d.code);
	ok('a pressure-driven file is reported at all', codes.indexOf('demand-model') >= 0,
		JSON.stringify(codes));
	const said = L.dropText('demand-model');
	ok('...with a sentence, not the bare code', said !== 'demand-model' && said.length > 40,
		JSON.stringify(String(said).slice(0, 60)));
	ok('...that names what changes for the answers', /demand-driven/i.test(said), JSON.stringify(said));
	const other = L.dropText('other-options');
	ok('the remaining unread options say so too',
		other !== 'other-options' && other.length > 20, JSON.stringify(String(other).slice(0, 60)));
	// DDA is what this page already does, so a file stating it has nothing to be told.
	const dda = EngCalcs.lpnInpParse(inp.replace('Demand Model\tPDA', 'Demand Model\tDDA'));
	ok('a demand-driven file is told nothing about it',
		(dda.dropped || []).every((d) => d.code !== 'demand-model'),
		JSON.stringify((dda.dropped || []).map((d) => d.code)));
}
done('a carried option reaches the report');

console.log(fails ? '\n' + fails + ' FAILED of ' + checks : '\nall ' + checks + ' section-carry checks passed');
process.exit(fails ? 1 : 0);
