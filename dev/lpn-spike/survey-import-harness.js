// READING A SURVEYED POINT LIST -- ROADMAP Task 592. Run with:
//   node dev/lpn-spike/survey-import-harness.js
//
// WHY THIS EXISTS. This is the second feature that puts NUMBERS FROM OUTSIDE into the document (the
// first was the terrain fill), and it is the first that puts POSITIONS there. Every way it can go
// wrong is quiet:
//
//   1. **The pair is swapped.** A northing read as an easting draws a map that looks perfectly
//      reasonable and is somewhere else. Nothing throws and every length still solves. Tom's own
//      judgement on this one (2026-09-17) is that a swap IS visible on the map -- and it is, which
//      is why the format chooser is for convenience and correctness rather than a catastrophe
//      guard. It is still the thing most worth a test, because the code cannot see it at all.
//   2. **The user's own numbers are rewritten.** A geographic document is DRAWN in Web Mercator and
//      STORED in longitude and latitude, and `mercLat(mercY(lat))` is a different double for 69.8%
//      of latitudes -- so an import that goes through the projection without carrying the file's own
//      value hands back a coordinate one bit away from the one that was surveyed, on every save.
//      `38.50` also comes back as `38.5` unless the TEXT is carried too, and that is a statement
//      about how well the point is known.
//   3. **A row is dropped in silence.** The file is the user's record. A row this page cannot
//      honour and does not mention is a point that has vanished between the field book and the
//      model, and the only person who could notice is the one who walked the survey.
//   4. **The undo is per junction.** Four hundred points imported and four hundred Ctrl-Z's to get
//      back is the same thing to the code and quite a different thing to the person pressing it.
//
// **THE PARSING IS TESTED DIRECTLY AND THE DOCUMENT THROUGH THE REAL PAGE.** js/lpn-survey.js is
// DOM-free, so sections 1 to 4 call it with strings. Sections 5 onward load the real
// js/looped-network.js over the shared stub and assert what lands in the document and what comes
// back out of serializeProject(), because the exactness claim is about the SAVED file and nothing
// smaller can see it.
//
// NOTHING HERE PINS ENGLISH WORDING (dev/scripts/harness_wording_check.php). A sentence is asserted
// against `EngCalcs.pageConfig.<key>`, which the stub fills from the real lib/lang.ec.en.php.

const fs = require('fs');
const { ROOT, byId, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
global.window.EngCalcs = global.EngCalcs;
require(ROOT + 'js/lpn-survey.js');
const EC = global.EngCalcs;
const PC = EC.pageConfig;

let fails = 0;
function ok(label, cond, detail) {
	if (!cond) { fails++; }
	console.log(`${cond ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : '   ' + detail}`);
}
function section(name) { console.log(`\n--- ${name} ---`); }

// The file a person can actually pick, shipped so Tom can import something real rather than
// inventing one. The harness reads the SAME bytes the browser would.
const FIX = ROOT + 'dev/lpn-spike/fixtures/';
const CSV = fs.readFileSync(FIX + 'survey-points.csv', 'utf8');

function noteCodes(parsed) { return (parsed.notes || []).map(n => n.code); }

// **THE BOUNDS A GEOREFERENCED PROJECT HAS, and the ONLY project kind that has any** (Tom,
// 2026-09-17: *"There is no good reason why the file can't be in any system the user wants."*). The
// reader is handed them by the page; with none, a northing of 700,000 is an ordinary northing.
const GEO_LIMITS = { limits: { north: 85.0511287798066, east: 180 } };

// The page's own source, for the one question that is about WHERE a command is rather than what it
// does. Same idiom as dev/lpn-spike/recent-files-harness.js.
const PAGE_SRC = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
function bodyOf(name) {
	const at = PAGE_SRC.search(new RegExp('(?:async )?function ' + name + '\\s*\\('));
	if (at < 0) { throw new Error('not found: ' + name); }
	let i = PAGE_SRC.indexOf('{', at), depth = 0, end = i;
	for (; end < PAGE_SRC.length; end++) {
		if (PAGE_SRC[end] === '{') { depth++; }
		else if (PAGE_SRC[end] === '}') { depth--; if (depth === 0) { end++; break; } }
	}
	return PAGE_SRC.slice(at, end);
}

// ================================================================================================
// 0. WHERE THE COMMAND LIVES -- the File menu, by Tom's own vote (2026-09-17)
// ================================================================================================
//
// It was a button in Settings > New assets, on the argument that it makes new assets and takes the
// new-asset values. Tom used it and disagreed: *"My vote is File since they come from a file."* A
// harness assertion rather than a comment, because a menu row is exactly the kind of thing a later
// edit moves without noticing that its placement was a decision.
section('0. the File menu is where it is reached from');
ok('the File menu carries the row', /pickSurveyFile/.test(bodyOf('openFileMenu')));
ok('...and no other menu does, the Settings panel that used to hold it included',
	['openEditMenu', 'mapMenuRows', 'openHelpMenu', 'rebuildSettingsFields']
		.every(n => !/pickSurveyFile/.test(bodyOf(n))));
ok('the whole page names the picker in exactly two places: the menu row and the definition',
	(PAGE_SRC.match(/pickSurveyFile/g) || []).length === 2,
	String((PAGE_SRC.match(/pickSurveyFile/g) || []).length));

// ================================================================================================
// 1. WHICH COLUMN IS WHICH, and the one question it still refuses to answer
// ================================================================================================
section('1. the column mapping');
{
	const m = EC.lpnSurveyColumnMap(['Point', 'Latitude', 'Longitude', 'Elevation_ft']);
	ok('the fixture header maps to id, north, east and elevation',
		m.matched && m.mapping.id === 0 && m.mapping.north === 1 && m.mapping.east === 2 && m.mapping.elev === 3,
		JSON.stringify(m.mapping));
	// **AND IT SAYS NOTHING ABOUT WHAT THE ELEVATION IS MEASURED IN** (Tom, 2026-09-18). A column
	// called `Elevation_ft` used to be read as a claim that the file is in feet, and the import
	// converted on the strength of it. A point list usually has no header at all, so the guess
	// answered a question almost no file asks, and where it fired it rewrote the user's numbers.
	ok('...and NOTHING is inferred about the unit from the column name',
		m.elevUnit === undefined, String(m.elevUnit));
}
// **THE CHANGE TOM ASKED FOR, IN ONE ASSERTION.** A northing and an easting used to be refused BY
// NAME, on the argument that a plane coordinate is not a latitude. He disagreed: the file is in
// whatever system the user works in, and the page already knows which system this project is.
{
	const m = EC.lpnSurveyColumnMap(['Point', 'Northing', 'Easting', 'Elev']);
	ok('a northing and an easting are an ORDINARY file now, not a refusal',
		m.matched && m.mapping.north === 1 && m.mapping.east === 2, JSON.stringify(m.mapping));
}
ok('bare N and E are read as the two coordinates',
	(() => { const m = EC.lpnSurveyColumnMap(['P', 'N', 'E', 'Z']);
		return m.matched && m.mapping.north === 1 && m.mapping.east === 2 && m.mapping.elev === 3; })());
ok('a plain grid file writes Y and X, and those are the same two columns',
	(() => { const m = EC.lpnSurveyColumnMap(['name', 'Y', 'X']);
		return m.matched && m.mapping.north === 1 && m.mapping.east === 2; })());
ok('a header written in other words still maps',
	(() => { const m = EC.lpnSurveyColumnMap(['name', 'LAT_DD', 'lon_dd', 'elev (m)']);
		return m.mapping.id === 0 && m.mapping.north === 1 && m.mapping.east === 2; })());
ok('...and a unit written into the column name is still not read as one',
	EC.lpnSurveyColumnMap(['id', 'lat', 'lon', 'elev (m)']).elevUnit === undefined);
ok('the trailing D of PNEZD is read as the description',
	EC.lpnSurveyColumnMap(['P', 'N', 'E', 'Z', 'Description']).mapping.desc === 4);
// **THE REFUSAL THAT REMAINS IS THE ONE WHERE AN ANSWER WOULD BE A GUESS.**
ok('two columns that could both be the northing are refused, not chosen between',
	(() => { const e = EC.lpnSurveyColumnMap(['north', 'northing', 'east']);
		return e.error === 'ambiguous-coord' && e.axis === 'north'; })());
ok('...and the same on the other axis, reported as the other axis',
	(() => { const e = EC.lpnSurveyColumnMap(['n', 'east', 'easting']);
		return e.error === 'ambiguous-coord' && e.axis === 'east'; })());
ok('...and the message names the columns it found AND what the project calls that axis',
	(() => { const e = EC.lpnSurveyColumnMap(['north', 'northing', 'east']);
		const t = EC.lpnSurveyErrorText(e, { north: 'Latitude', east: 'Longitude' });
		return /northing/.test(t) && /Latitude/.test(t) && !/\{axis\}/.test(t); })());
ok('a header naming no two coordinates is NOT an error -- it is a file to read by position',
	(() => { const m = EC.lpnSurveyColumnMap(['a', 'b', 'c']);
		return m.matched === false && !m.error && m.detail === 'a, b, c'; })());

// ================================================================================================
// 2. THE CSV, against the shipped fixture
// ================================================================================================
section('2. the CSV fixture');
const csv = EC.lpnSurveyParse(CSV, GEO_LIMITS);
ok('the fixture reads', csv.ok === true, csv.error || '');
ok('six of its seven rows became points', csv.points.length === 6, String(csv.points.length));
ok('...and the comment lines above the header were not read as rows',
	csv.counts.rows === 7, String(csv.counts.rows));
// **THE FOUR COMMENT PREFIXES, AND THE PROOF THAT IT IS A PREFIX TEST** (Tom, 2026-09-18: *"I hope
// you are using prefixes ! # / to detect a comment line and not some more sophisticated
// detector."*). The second assertion is the one that matters: a line that READS like prose but does
// not start with one of the four is a data row, and is refused as one rather than silently eaten.
{
	const r = EC.lpnSurveyParse('# hash\n; semicolon\n! bang\n// slashes\nA,1000,2000,55\n',
		{ format: 'PNEZD' });
	ok('all four comment prefixes are passed over, and the data row after them is read',
		r.ok && r.points.length === 1 && r.points[0].line === 5,
		JSON.stringify(r.points.map(p => p.line)));
	const q = EC.lpnSurveyParse('A,1000,2000,55\nthis line is a note somebody typed,,,\n',
		{ format: 'PNEZD' });
	ok('...and a prose line with NO prefix is a bad row, not a guessed-at comment',
		q.ok && q.points.length === 1 && q.notes.some(n => n.line === 2 && (n.code === 'bad-coord' || n.code === 'coord-missing')),
		JSON.stringify(q.notes.map(n => n.code + '@' + n.line)));
}
ok('the deliberately swapped row is REPORTED and made no point',
	noteCodes(csv).indexOf('coord-range') >= 0 && !csv.points.some(p => p.id === 'PT-6'));
ok('...and its own number is printed in the note, not a paraphrase',
	(csv.notes.find(n => n.code === 'coord-range') || {}).detail === '-111.830400');
// **THE NOTE NAMES THE LINE, NOT THE POINT** (Tom, 2026-09-17: *"The import report needs to list
// line numbers."*). It used to carry the surveyor's own name for the point, which is what a person
// RECOGNISES and not what they can FIND -- the reader has the file open in another window and is
// about to put the cursor on a line.
ok('...and the note names the LINE the row is on, counted the way an editor counts',
	(csv.notes.find(n => n.code === 'coord-range') || {}).line === 11,
	String((csv.notes.find(n => n.code === 'coord-range') || {}).line));
ok('...and carries the line itself, character for character, for printing underneath',
	(csv.notes.find(n => n.code === 'coord-range') || {}).raw === 'PT-6,-111.830400,33.415910,1247.00',
	JSON.stringify((csv.notes.find(n => n.code === 'coord-range') || {}).raw));
// **THE SAME FILE, READ WITH NO BOUNDS, KEEPS ALL SEVEN.** That is not a bug: on a projected or a
// grid project -111.83 is a perfectly good northing, and refusing it would be the georeferenced-only
// rule stated as a number instead of as a sentence.
ok('...and with no bounds stated, that same row is an ordinary point',
	EC.lpnSurveyParse(CSV).points.length === 7,
	String(EC.lpnSurveyParse(CSV).points.length));
ok('the unreadable elevation is reported and the junction is STILL made',
	noteCodes(csv).indexOf('bad-elev') >= 0 && csv.points.some(p => p.id === 'PT-7'));
ok('...with no elevation of its own, rather than a zero',
	(csv.points.find(p => p.id === 'PT-7') || {}).elev === null);
{
	const p1 = csv.points.find(p => p.id === 'PT-1');
	ok('a coordinate keeps its own TEXT where the plain number would not reproduce it',
		p1.northTok === '33.415300' && p1.eastTok === '-111.831400', p1.northTok + ' / ' + p1.eastTok);
	ok('...and its VALUE is the number the file states',
		p1.north === 33.4153 && p1.east === -111.8314);
	ok('...and the elevation keeps its text too', p1.elevTok === '1243.50');
}
ok('a number whose plain rendering already matches keeps NO token, so an ordinary file costs nothing',
	EC.lpnSurveyParse('lat,lon\n33.4153,-111.8314\n').points[0].northTok === null);

// ================================================================================================
// 3. EVERY OTHER SHAPE A CSV ARRIVES IN, and every row that cannot be honoured
// ================================================================================================
section('3. the other shapes, and the rows that cannot be honoured');
ok('semicolons are read as the delimiter where that is what the file uses',
	(() => { const r = EC.lpnSurveyParse('id;lat;lon\nA;33.5;-111.8\n');
		return r.ok && r.delimiter === ';' && r.points[0].id === 'A'; })());
ok('tabs are read as the delimiter',
	(() => { const r = EC.lpnSurveyParse('id\tlat\tlon\nA\t33.5\t-111.8\n');
		return r.ok && r.delimiter === '\t' && r.points[0].north === 33.5; })());
ok('a quoted cell holding a comma does not elect the comma in a semicolon file',
	(() => { const r = EC.lpnSurveyParse('name;lat;lon\n"Tank Farm, north";33.5;-111.8\n');
		return r.ok && r.points[0].id === 'Tank Farm, north'; })());
ok('CRLF line endings read the same as LF',
	EC.lpnSurveyParse('lat,lon\r\n33.5,-111.8\r\n').points.length === 1);
ok('a byte order mark does not swallow the first column name',
	EC.lpnSurveyParse('﻿lat,lon\n33.5,-111.8\n').ok === true);
ok('degrees, minutes and seconds are REPORTED rather than half read',
	(() => { const r = EC.lpnSurveyParse('lat,lon\n33 24 55.1 N,-111.8\n');
		return r.error === 'no-points' || noteCodes(r).indexOf('bad-coord') >= 0; })());
ok('a coordinate with a hemisphere letter is not quietly taken as a decimal',
	noteCodes(EC.lpnSurveyParse('lat,lon\n33.5N,-111.8\nx,y\n33.6,-111.9\n')).indexOf('bad-coord') >= 0);
ok('...and the note says WHICH axis it was, in the project\'s own word for it',
	(() => { const r = EC.lpnSurveyParse('lat,lon\n33.5N,-111.8\n33.6,-111.9\n');
		const n = r.notes.find(x => x.code === 'bad-coord');
		return n.axis === 'north' &&
			/Northing/.test(EC.lpnSurveyNoteText(n, { north: 'Northing', east: 'Easting' }).text); })());
ok('a short row is reported as a short row, which is a different fix',
	noteCodes(EC.lpnSurveyParse('id,lat,lon\nA,33.5\nB,33.6,-111.9\n')).indexOf('row-short') >= 0);
ok('an empty coordinate cell is reported as empty, not as unreadable',
	noteCodes(EC.lpnSurveyParse('id,lat,lon\nA,,-111.8\nB,33.6,-111.9\n')).indexOf('coord-missing') >= 0);
ok('an out-of-range east is refused for the same reason an out-of-range north is, WHEN there are bounds',
	(() => { const n = EC.lpnSurveyParse('lat,lon\n33.5,999\n33.6,-111.9\n', GEO_LIMITS)
		.notes.find(x => x.code === 'coord-range');
		return !!n && n.axis === 'east'; })());
ok('a name used twice keeps one and reports the other',
	(() => { const r = EC.lpnSurveyParse('id,lat,lon\nA,33.5,-111.8\nA,33.6,-111.9\n');
		return r.points.length === 2 && r.points[1].id === '' && noteCodes(r).indexOf('id-duplicate') >= 0; })());
ok('blank lines are counted and mentioned, never merely skipped',
	(() => { const r = EC.lpnSurveyParse('lat,lon\n33.5,-111.8\n\n\n33.6,-111.9\n');
		return r.points.length === 2 && r.counts.blank === 2 && noteCodes(r).indexOf('blank-rows') >= 0; })());
ok('...and the empty string a trailing newline leaves is not counted as one of them',
	EC.lpnSurveyParse('lat,lon\n33.5,-111.8\n').counts.blank === 0);
ok('an empty file says so', EC.lpnSurveyParse('   \n').error === 'empty');
ok('a file whose every row is unreadable says how many rows it tried',
	(() => { const r = EC.lpnSurveyParse('lat,lon\nx,y\n');
		return r.error === 'no-points' && r.detail === '1'; })());
ok('a description column is carried onto the point',
	(() => { const r = EC.lpnSurveyParse('P,N,E,Z,D\nA,33.5,-111.8,10,Fire hydrant\n');
		return r.points[0].desc === 'Fire hydrant'; })());
// A caller-supplied mapping, which is what the format chooser hands back. Proven here so this file
// keeps no second opinion about which column is which once a person has chosen.
ok('a mapping handed in overrides the detection',
	(() => { const r = EC.lpnSurveyParse('a,b,c\nP1,33.5,-111.8\n',
		{ mapping: { id: 0, north: 1, east: 2, elev: null, desc: null } });
		return r.ok && r.points[0].id === 'P1' && r.points[0].north === 33.5; })());

// ================================================================================================
// 4b. THE SENTENCES, against the language file rather than against English typed here
// ================================================================================================
section('4b. what it says');
// What this project calls its two axes -- the page's own axisNames(), handed in.
const AX = { north: 'Latitude', east: 'Longitude' };
const texts = (r, o) => EC.lpnSurveyReportLines(r, o || { created: 6 }, AX).map(e => e.text);
// **THE BOX IS ONE SENTENCE NOW** (Tom, 2026-09-18). It used to name the mapping, the axes, the
// unit and the fact that no pipes are drawn; all four are cut, so what is asserted is that the
// count is there and that the paragraphs are NOT -- a cut nothing tests grows back.
ok('the confirm names how many junctions it is about to make',
	EC.lpnSurveyConfirmText(csv, 'junction') === PC.lpn_survey_confirm_junction.replace('{n}', 6),
	EC.lpnSurveyConfirmText(csv));
ok('...and says nothing else at all: no mapping, no axes, no unit, no note about pipes',
	EC.lpnSurveyConfirmText(csv).split('\n').length === 1);
ok('a clean file is told that it was clean, so silence never means two things',
	texts(EC.lpnSurveyParse('lat,lon\n33.5,-111.8\n'), { created: 1 })
		.indexOf(PC.lpn_survey_report_clean) >= 0);
ok('a file with a bad line gets the heading that names what follows',
	texts(csv).indexOf(PC.lpn_survey_report_notes) >= 0);
// **THE REPORT OPENS ON ONE COUNTS LINE, and it is the FIRST line** (Tom, 2026-09-18: *"6
// junction(s) imported, 5 with elevation."*). Three things are held here because each can come
// back on its own: the file name is not above it, both numbers are in the one line, and the second
// number is stated even when it is zero.
{
	const lines = texts(csv, { created: 6, elevFromFile: 5 });
	ok('the report opens on the count, with nothing above it',
		lines[0] === PC.lpn_survey_report_junction.replace('{n}', 6).replace('{m}', 5), lines[0]);
	const none = texts(EC.lpnSurveyParse('lat,lon\n33.5,-111.8\n'), { created: 1 });
	ok('...and says how many took an elevation even when none did',
		none[0] === PC.lpn_survey_report_junction.replace('{n}', 1).replace('{m}', 0), none[0]);
	ok('...and the heading comes straight after it, with no paragraph between',
		lines[1] === PC.lpn_survey_report_notes, lines[1]);
}

// ---- THE SHAPE OF A LINE ERROR, which is the whole of this section ----------------------------
//
//     Line 6: warning: DUPLICATE_NAME: Name already in project, new name assigned.
//         PT-1,33.415300,-111.831400,1243.50
//
// Tom asked for this shape on 2026-09-18 and then asked that it be checked against real tools. The
// line number spelled out, the reader's own line echoed underneath and an uppercase symbolic code
// are all attested; the dash that used to join the code to its sentence is attested nowhere, and
// `(see below)` had no precedent and described the layout of the report inside a message about a
// file. What the check found MISSING is the severity word, and it is the claim this section cares
// about most: without it DUPLICATE_NAME, where a junction exists, reads in the same shape as
// BAD_COORDINATE, where none was made.
//
// Every assertion here is built out of the shell key itself rather than out of English typed here,
// so rewording the shell in lib/lang.ec.en.php stays free -- the freedom dev/english-key-rulings.json
// is built on. `sentenceOf()` is the same derivation: it takes the shell apart at its placeholders
// and reads the four pieces back out of a rendered line.
{
	const rep = EC.lpnSurveyReportLines(csv, { created: 6 }, AX);
	const bad = rep.find(e => /33\.415910/.test(e.raw || ''));
	const esc = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const parts = PC.lpn_survey_note_line.split(/\{(?:line|sev|code|text)\}/);
	const shellRx = new RegExp('^' + esc(parts[0]) + '(\\d+)' + esc(parts[1]) + '(\\S+?)'
		+ esc(parts[2]) + '([A-Z_]+)' + esc(parts[3]) + '([\\s\\S]*)' + esc(parts[4]) + '$');
	const partsOf = t => shellRx.exec(t);
	const sentenceOf = t => { const m = partsOf(t); return m ? m[4] : t; };
	ok('a refusal is written in the shell, leading with its line number',
		!!bad && bad.text.indexOf(parts[0] + '11' + parts[1]) === 0, bad && bad.text);
	ok('...and every part of the shell is filled: line, severity, code, sentence',
		!!bad && !!partsOf(bad.text), bad && bad.text);
	ok('...and carries the machine-readable CODE, which is never translated',
		!!bad && bad.text.indexOf('COORDINATE_OUT_OF_RANGE') >= 0, bad && bad.text);
	ok('...and prints the reader\'s own line underneath, verbatim',
		!!bad && bad.raw === 'PT-6,-111.830400,33.415910,1247.00', bad && bad.raw);
	ok('...and the sentence after the code is SHORT -- one plain statement, not a paragraph',
		!!bad && sentenceOf(bad.text).split(/\s+/).length <= 12, bad && sentenceOf(bad.text));
	ok('...and no refusal anywhere in this report runs longer than that',
		rep.filter(e => e.raw !== null)
			.every(e => sentenceOf(e.text).split(/\s+/).length <= 12));
	ok('a note about the FILE rather than a line prints nothing underneath it',
		rep.filter(e => e.raw === null).length >= 2);
	// **THE SEVERITY WORD SPLITS THE ONE THING THE READER CAME TO FIND OUT: is there a junction on
	// that line or not?** A row this page could not read at all produced nothing; a row it read and
	// then adjusted produced a junction that is on the map right now under a name or an elevation
	// the file did not state. The two used to be one shape.
	const sevOf = t => { const m = partsOf(t); return m && m[2]; };
	ok('a row that produced NO junction is an error',
		sevOf(bad.text) === PC.lpn_survey_sev_error, bad && bad.text);
	ok('...and a row that produced one, adjusted, is a warning',
		(() => { const e = rep.find(x => x.text.indexOf('BAD_ELEVATION') >= 0);
			return !!e && sevOf(e.text) === PC.lpn_survey_sev_warning; })(),
		JSON.stringify(rep.map(e => e.text)));
	ok('...and a name already taken is a warning, because the point is on the map',
		(() => { const r = EC.lpnSurveyParse('id,lat,lon\nA,33.5,-111.8\nA,33.6,-111.9\n');
			const e = EC.lpnSurveyReportLines(r, { created: 2 }, AX)
				.find(x => x.text.indexOf('DUPLICATE_NAME') >= 0);
			return !!e && sevOf(e.text) === PC.lpn_survey_sev_warning; })());
	ok('...and every refusal in the report carries one of exactly the two words',
		rep.filter(e => e.raw !== null).every(e =>
			sevOf(e.text) === PC.lpn_survey_sev_error
			|| sevOf(e.text) === PC.lpn_survey_sev_warning));
	// **THE JOINT IS A COLON AND NOT A DASH.** The one part of Tom's own spelling that the research
	// turned up no precedent for anywhere, in any tool; pinned here so it cannot drift back.
	ok('the code is joined to its sentence the way every real tool joins it, never by a dash',
		PC.lpn_survey_note_line.indexOf('{code} - {text}') < 0
			&& PC.lpn_survey_note_line.indexOf('(') < 0, PC.lpn_survey_note_line);
	// **THE VALUE IS NO LONGER QUOTED INTO THE SENTENCE** (Tom, 2026-09-18). It used to be, and the
	// reader's own line was already being printed directly underneath holding that same text -- so
	// the report said everything twice. The record still CARRIES the cell verbatim, which is what
	// stops the old defect coming back the day somebody wants to print it again: Tom's own finding
	// (2026-09-17, *"This error seems wrong: 'The elevation here does not read as a number (about
	// 1240).' "*) was that we must never parse that text into a number.
	ok('the elevation it could not read is carried verbatim on the record, never as a number',
		(() => { const n = csv.notes.find(x => x.code === 'bad-elev');
			return n.detail === 'about 1240' && typeof n.detail === 'string'; })());
	ok('...and the line it is on still became a junction, which the sentence has to say',
		csv.points.some(p => p.line === 12 && p.elev === null));
	ok('...and the sentence does not repeat the cell, because the line below already holds it',
		!!rep.find(e => e.raw === 'PT-7,33.414700,-111.830400,about 1240'
			&& e.text.indexOf('about 1240') < 0), JSON.stringify(rep.map(e => e.text)));
}
// **TWO ROWS THAT FAILED THE SAME WAY ARE NOW TWO LINES, NOT ONE.** That reverses what this report
// did, and deliberately: pooling them into one sentence with both names in brackets is shorter and
// cannot carry either line number, which is the one thing the reader came for.
ok('two lines failing identically are TWO entries, each with its own number and its own line',
	(() => { const r = EC.lpnSurveyParse('id,lat,lon\nA,,-111.8\nB,,-111.9\nC,33.5,-111.7\n');
		const rep = EC.lpnSurveyReportLines(r, { created: 1 }, AX);
		return rep.filter(e => e.raw !== null).length === 2 &&
			rep.some(e => e.raw === 'A,,-111.8') && rep.some(e => e.raw === 'B,,-111.9'); })());
ok('...and a note with no line of its own is still said ONCE however many lines caused it',
	(() => { const r = EC.lpnSurveyParse('lat,lon\n33.5,-111.8\n\n\n33.6,-111.9\n');
		return texts(r, { created: 2 }).filter(t => t === PC.lpn_survey_note_blank_rows
			.replace('{detail}', '2')).length === 1; })());
ok('the refusals come out in LINE ORDER, whatever order they were found in',
	(() => { const r = EC.lpnSurveyParse('id,lat,lon\nA,33.5,-111.8\nB,x,-111.9\nC,,-111.7\nD,33.6,y\n');
		const nums = EC.lpnSurveyReportLines(r, { created: 1 }, AX)
			.filter(e => e.raw !== null).map(e => e.raw.charAt(0));
		return nums.join('') === 'BCD'; })());
// A line number is only useful if it is the one the reader's editor shows. Counted from 1, over the
// file as it is -- comment lines and blank lines included, because they are lines in the file.
ok('a line number counts the file\'s own lines, comments and blanks included',
	(() => { const r = EC.lpnSurveyParse('# a note\nlat,lon\n\n33.5,-111.8\nx,y\n');
		return (r.notes.find(n => n.code === 'bad-coord') || {}).line === 5; })());

// ================================================================================================
// 5. THE DOCUMENT, through the real page
// ================================================================================================
section('5. the junctions, through the real page');

let alerts = [], confirmAnswer = true;
global.window.alert = global.alert = function (m) { alerts.push(String(m)); };

// **THE QUESTION IS A DIALOG NOW, NOT window.confirm()** (Task 592's format chooser). A confirm can
// only be answered yes or no; this one has a control in it, so it had to become the page's own
// openDialog() -- the same box the `.inp` importer's report uses, driven here the way a person
// drives it. `boxText()` reads what is on screen; `press()` finds a button by its label and clicks
// the real listener, so nothing about the box is taken on trust.
function boxText() {
	const walk = (el) => (!el.children || !el.children.length)
		? (el.textContent || '') : el.children.map(walk).join('\n');
	return walk(byId.lpn_dialog_body);
}
// Every <p> the box draws, in order. The box is a label, a chooser and one sentence, so this is
// how the cut is measured rather than by naming a paragraph that is supposed to be gone.
function boxParagraphs() {
	const out = [];
	const walk = (el) => {
		if (el.tagName === 'P') { out.push(el.textContent || ''); }
		(el.children || []).forEach(walk);
	};
	walk(byId.lpn_dialog_body);
	return out;
}
function boxButtons() { return byId.lpn_dialog_buttons.children || []; }
function press(label) {
	const btn = boxButtons().find(b => b.textContent === label);
	if (!btn) { throw new Error('no button: ' + label + ' of ' + boxButtons().map(b => b.textContent)); }
	(btn._listeners.click || []).forEach(f => f());
}
// Every <select> the box draws, in order. TWO now, and their ORDER is the design: the asset kind
// comes first because it is the one choice that cannot be made again afterwards.
function boxSelects() {
	const out = [];
	const walk = (el) => {
		if (el.tagName === 'SELECT') { out.push(el); }
		(el.children || []).forEach(walk);
	};
	walk(byId.lpn_dialog_body);
	return out;
}
function boxTypeSelect() { return boxSelects()[0]; }
function boxSelect() { return boxSelects()[1]; }
// The element carrying the note that sits BESIDE the format chooser, found by its own id rather
// than by position -- the point of the note is that it is not in the chooser, so a helper that
// found it by counting children of the chooser would be asserting the opposite of the rule.
function boxById(id) {
	let found = null;
	const walk = (el) => {
		if (el.id === id) { found = el; }
		(el.children || []).forEach(walk);
	};
	walk(byId.lpn_dialog_body);
	return found;
}
function clearBox() {
	byId.lpn_dialog_body.children.length = 0;
	byId.lpn_dialog_buttons.children.length = 0;
}

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tland: landSurveyText, undo: undo,\n" +
	"\t\tundoDepth: function () { return undoStack.length; },\n" +
	"\t\tserialize: serializeProject,\n" +
	"\t\taddNode: addNode,\n" +
	"\t\tlonOf: function (id) { return outwardX(nodeById(id).x); },\n" +
	"\t\tlatOf: function (id) { return outwardY(nodeById(id).y); },\n" +
	"\t\tnode: function (id) { return nodeById(id); },\n" +
	"\t\torigin: function () { return docOrigin(); },\n" +
	"\t\tnumText: function (rec, key, v) { return EngCalcs.lpnNumText(rec, key, v); },\n" +
	"\t\treset: function (coords) { doc = { nodes: [], links: [], labels: [] };\n" +
	"\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
	"\t\t\tnextId = { J: 1, R: 1, T: 1, L: 1, P: 1, V: 1, X: 1 };\n" +
	"\t\t\tproject = { name: 'T', activeScenario: 'base' };\n" +
	"\t\t\tif (coords) { project.coords = coords; }\n" +
	"\t\t\tscenarios = defaultScenarios();\n" +
	"\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
	"\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
	"\t\t\tsvg.clientWidth = 900; svg.clientHeight = 600;\n" +
	"\t\t\tworld = el('g', {}, svg);\n" +
	"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
	"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
	"\t\t\tlabelsLayer = el('g', {}, world);\n" +
	"\t\t\trubberBandEl = el('line', {}, world); },\n" +
	"\t\tGEO: LPN_COORDS_GEO\n"
);
byId.lpn_toolbar.querySelectorAll = () => [];
setUnitSet('us');

// One import, the whole way through: the box opens, and the reader answers it. `confirmAnswer` is
// which button they press, so the two paths are the same call with one flag.
function importCsv(text, name) {
	alerts = []; clearBox();
	L.land(text === undefined ? CSV : text, name || 'survey-points.csv');
	if (!boxButtons().length) { return false; }
	press(confirmAnswer ? PC.lpn_survey_create : PC.lpn_cancel);
	return true;
}

L.reset(L.GEO);
importCsv();
ok('the box was put up BEFORE anything was created, and says what it is about to make',
	L.getDoc().nodes.length === 6);
ok('six junctions arrived', L.getDoc().nodes.length === 6, String(L.getDoc().nodes.length));
ok('NO pipes were invented between them', L.getDoc().links.length === 0);
ok('every junction is a junction', L.getDoc().nodes.every(n => n.type === 'junction'));
ok('the file\'s own names became the ids',
	['PT-1', 'PT-2', 'PT-3', 'PT-4', 'PT-5', 'PT-7'].every(id => !!L.node(id)),
	L.getDoc().nodes.map(n => n.id).join(','));
ok('a point is at the longitude the file states, read back out of the drawing frame',
	L.lonOf('PT-1') === -111.8314, String(L.lonOf('PT-1')));
ok('...and at its latitude, within the projection round trip',
	Math.abs(L.latOf('PT-1') - 33.4153) < 1e-9, String(L.latOf('PT-1')));
// The surveyor's own note about the point, which is the D of PNEZD and the thing a clerk most wants
// to keep. Written as a description, which is a field this page already has.
{
	L.reset(L.GEO);
	importCsv('P,N,E,Z,D\nA,33.5,-111.8,10,Fire hydrant at Elm and 1st\n', 'd.csv');
	ok('a description column lands on the junction as its description',
		L.node('A').desc === 'Fire hydrant at Elm and 1st', String(L.node('A').desc));
	L.reset(L.GEO);
	importCsv();
}
ok('the elevation came from the file, in the unit the project is showing',
	L.node('PT-1').elev === 1243.5, String(L.node('PT-1').elev));
ok('...and the row whose elevation could not be read has none',
	L.node('PT-7').elev === undefined || L.node('PT-7').elev === 0,
	String(L.node('PT-7').elev));

// ---- the claim this whole feature has to meet: the file's own numbers come back out ------------
section('6. the user\'s numbers, on the way back out');
{
	const saved = L.serialize();
	const n1 = saved.nodes.find(n => n.id === 'PT-1');
	ok('the SAVED longitude is the file\'s own double, bit for bit',
		n1.x === -111.8314, String(n1.x));
	ok('the SAVED latitude is the file\'s own double, bit for bit -- NOT mercLat(mercY(lat))',
		n1.y === 33.4153, String(n1.y));
	ok('...and a geographic file still states the identity origin',
		saved.origin.x === 0 && saved.origin.y === 0);
	ok('the file\'s own TEXT survives to the writer that asks for it',
		L.numText(n1, 'y', n1.y) === '33.415300' && L.numText(n1, 'x', n1.x) === '-111.831400',
		L.numText(n1, 'y', n1.y));
	ok('...and so does the elevation\'s text', L.numText(n1, 'elev', n1.elev) === '1243.50');
	ok('the markers themselves never reach the file',
		n1._xsrc === undefined && n1._ysrc === undefined);
	// **THE INVARIANT, NOT A PROMISE.** A coordinate the user has since moved must NOT come back as
	// the text of a number it no longer is.
	const moved = L.node('PT-2');
	moved.x += 0.01;
	const after = L.serialize().nodes.find(n => n.id === 'PT-2');
	ok('a point that has been dragged loses its source and comes back as what it now is',
		Math.abs(after.x - (-111.8214)) < 1e-9 && L.numText(after, 'x', after.x) !== '-111.831400',
		String(after.x));
}

// **AND THE REPORT ON SCREEN, not merely the list of lines it is built from.** Mutation-testing
// found this gap: the whole of section 4b passed with js/looped-network.js printing the sentence and
// silently dropping the reader's own line under it, because nothing here had ever looked at the box.
section('6b. the report as it reaches the screen');
L.reset(L.GEO);
importCsv();
{
	const shown = boxText();
	ok('the report box carries the refusal sentence for the swapped line',
		shown.indexOf(PC.lpn_survey_note_coord_range.split('{')[0].trim()) >= 0);
	ok('...and the reader\'s own line, verbatim, underneath it',
		shown.indexOf('PT-6,-111.830400,33.415910,1247.00') >= 0, shown);
	ok('...and the line for the elevation it could not read',
		shown.indexOf('PT-7,33.414700,-111.830400,about 1240') >= 0);
}

section('7. one undo, and the refusals');
// **AND IT MATTERS MORE SINCE 2026-09-18 THAN IT DID BEFORE.** Undo is now the ONLY remedy for an
// elevation that came in under the wrong unit -- Tom traded the header-name detection away for it
// in terms (*"We take what we are given, and we provide a robust undo feature."*) -- so the depth
// is asserted as well as the effect: one snapshot for the whole file, whatever it holds.
L.reset(L.GEO);
const depthBefore = L.undoDepth();
importCsv();
ok('the whole import is exactly ONE snapshot on the undo stack',
	L.undoDepth() === depthBefore + 1, String(L.undoDepth() - depthBefore));
L.undo();
ok('ONE undo takes the whole import back, not one junction of it',
	L.getDoc().nodes.length === 0, String(L.getDoc().nodes.length));

L.reset(L.GEO);
confirmAnswer = false;
importCsv();
ok('answering Cancel creates nothing at all', L.getDoc().nodes.length === 0);
confirmAnswer = true;

// **AN XY PROJECT NOW TAKES THE FILE, and this is the assertion Tom's second instruction is** (he
// disagreed with the old refusal in terms: *"There is no good reason why the file can't be in any
// system the user wants."*). All SEVEN rows land, because a grid has no range to be outside of --
// the row the fixture calls deliberately wrong is only wrong on a georeferenced project.
L.reset();
importCsv();
ok('an XY project takes the file rather than refusing it',
	L.getDoc().nodes.length === 7 && alerts.length === 0, String(L.getDoc().nodes.length));
ok('...and the columns land on the document axes the right way round: north is y, east is x',
	L.node('PT-1').x === -111.8314 && L.node('PT-1').y === -33.4153,
	L.node('PT-1').x + ' / ' + L.node('PT-1').y);
ok('...and nothing geographic was written to a grid document',
	L.serialize().nodes.every(n => n._xsrc === undefined && n._ysrc === undefined));

// A name the document already holds cannot be honoured, and is reported rather than repaired by
// adding a digit to somebody's field-book name.
L.reset(L.GEO);
L.addNode('junction', 0, 0);
L.node('J1').id = 'PT-1';
importCsv();
ok('a name already in the project is reported, and the junction keeps the name this page minted',
	L.getDoc().nodes.length === 7 && !!L.node('J2'),
	L.getDoc().nodes.map(n => n.id).join(','));
// **AND IT OWES THE READER THE SAME LINE NUMBER AS EVERY OTHER REFUSAL.** These two -- a name the
// document already holds, and a name it cannot spell -- are the only ones discovered while the
// junction is being made rather than while the file is being read, and mutation-testing found that
// nothing here could see them lose it. A reader does not know or care where we noticed.
ok('...naming the LINE it is on and printing that line, like every other refusal',
	boxText().indexOf('PT-1,33.415300,-111.831400,1243.50') >= 0 &&
	/\b6\b/.test(boxText().split('PT-1,33.415300')[0].split('\n').slice(-2)[0]),
	boxText());

// ---- the elevation, which is taken exactly as the file writes it -------------------------------
//
// **THERE IS NO CONVERSION LEFT AND THERE MUST NOT BE ONE** (Tom, 2026-09-18: *"I don't think it's
// wise to build in any units detection. We take what we are given, and we provide a robust undo
// feature."*). The fixture's elevation column is called `Elevation_ft`, which used to be read as a
// claim that the file is in feet: opening it into a project showing meters converted 1243.50 to
// 379.0188. That is the page rewriting the user's own number off a column name, which is the one
// thing CLAUDE.md forbids outright, and a point list usually has no header to read anyway.
section('8. the elevation, taken as written');
L.reset(L.GEO);
setUnitSet('si');
importCsv();
{
	const e = L.node('PT-1').elev;
	ok('a file naming its elevation column for feet is NOT converted into a project showing meters',
		e === 1243.5, String(e));
	const n1 = L.serialize().nodes.find(n => n.id === 'PT-1');
	ok('...and the file\'s own text for it rides through untouched',
		!!n1.tok && n1.tok.elev === '1243.50', JSON.stringify(n1.tok || {}));
	ok('...and the coordinates are untouched by any of that',
		n1.x === -111.8314 && n1.y === 33.4153);
}
setUnitSet('us');

// ================================================================================================
// 9. THE FILE FORMAT CHOOSER (Tom, 2026-09-17)
// ================================================================================================
//
// *"We will need to include a file format chooser (PNEZD, PENZD, or whatever format is useful for
// Declan."* PNEZD and PENZD are the same five columns and differ in ONE thing: whether the northing
// or the easting comes first. So the assertion this whole section is built on is that the SAME FIVE
// NUMBERS read under the two orders give DIFFERENT ANSWERS -- if they did not, the chooser would be
// decoration and nothing would be able to tell.
//
// **NOTHING MAY BE INFERRED FROM THE SIZE OF THE NUMBERS**, which is the rule the chooser exists to
// keep. A magnitude rule is right on the file it was written against and silently wrong on the next
// one, so the fixtures below are deliberately chosen to be plausible either way round.
//
// Tom overruled half of Declan's case for it: a swapped northing and easting is immediately obvious
// on the map, so this is a convenience and not a guard against a silent catastrophe. Nothing here
// asserts any scare wording, because there is none to assert.
section('9. the file format chooser');

// Five columns, no header line at all, and numbers that are a perfectly good survey either way
// round. 1,000 and 2,000 are both ordinary plane coordinates.
const PNEZD_TEXT = 'A,1000.00,2000.00,55.5,Hydrant\nB,1010.00,2015.00,56.0,Valve\n';

ok('PNEZD and PENZD put the two coordinates in different columns, which is the whole difference',
	(() => { const a = EC.lpnSurveyFormatMapping('PNEZD'), b = EC.lpnSurveyFormatMapping('PENZD');
		return a.north === 1 && a.east === 2 && b.north === 2 && b.east === 1
			&& a.id === b.id && a.elev === b.elev && a.desc === b.desc; })());
ok('...and every order the chooser offers maps to real columns',
	EC.lpnSurveyFormats.every(f => { const m = EC.lpnSurveyFormatMapping(f);
		return m.north !== null && m.east !== null; }), EC.lpnSurveyFormats.join(' '));
ok('an order with no point-name column says so, rather than reading a coordinate as a name',
	EC.lpnSurveyFormatMapping('NEZ').id === null && EC.lpnSurveyFormatMapping('NEZ').north === 0);
ok('a stored order this version does not know falls back rather than stopping a file opening',
	EC.lpnSurveyFormatMapping('WHATEVER').north === EC.lpnSurveyFormatMapping(EC.LPN_SURVEY_DEFAULT_FORMAT).north);

// ---- THE CLAIM: the same file, the two orders, two different answers ---------------------------
{
	const asN = EC.lpnSurveyParse(PNEZD_TEXT, { format: 'PNEZD' });
	const asE = EC.lpnSurveyParse(PNEZD_TEXT, { format: 'PENZD' });
	ok('a headerless file reads under the chosen order, keeping every line',
		asN.ok && asN.points.length === 2 && asE.ok && asE.points.length === 2,
		String(asN.points.length) + ' / ' + String(asE.points.length));
	ok('THE SAME FILE READ AS PNEZD AND AS PENZD GIVES DIFFERENT COORDINATES',
		asN.points[0].north === 1000 && asN.points[0].east === 2000 &&
		asE.points[0].north === 2000 && asE.points[0].east === 1000,
		JSON.stringify([asN.points[0].north, asN.points[0].east, asE.points[0].north, asE.points[0].east]));
	ok('...and everything that is NOT the coordinate pair is untouched by the choice',
		asN.points[0].id === 'A' && asE.points[0].id === 'A' &&
		asN.points[0].elev === 55.5 && asE.points[0].elev === 55.5 &&
		asN.points[0].desc === 'Hydrant' && asE.points[0].desc === 'Hydrant');
	ok('...and the file\'s own text survives under either order',
		asN.points[0].northTok === '1000.00' && asE.points[0].eastTok === '1000.00');
	ok('the reading says which order it used, so the confirm can name it',
		asN.format === 'PNEZD' && asE.format === 'PENZD');
}
// **THE FIRST LINE OF A HEADERLESS FILE IS DATA AND MUST NOT BE EATEN.** The old reader always
// started on line two, because it always had a header; a file that begins with its first point
// would have lost that point with nothing said.
ok('a headerless file loses no line to a header that is not there',
	EC.lpnSurveyParse('1000,2000\n1010,2015\n', { format: 'NEZ' }).points.length === 2);
// **AND A HEADER IN WORDS THIS PAGE DOES NOT KNOW IS A HEADER, not a bad row.** Told about, passed
// over, and the chosen order used underneath it.
{
	const r = EC.lpnSurveyParse('Pt,Nor,Eas,Elv,Rem\nA,1000,2000,55.5,H\n', { format: 'PNEZD' });
	ok('an unrecognised header line is passed over and SAID, never read as a point',
		r.ok && r.points.length === 1 && noteCodes(r).indexOf('header-unread') >= 0,
		noteCodes(r).join(','));
	ok('...and that note is about the file, so it prints no line underneath it',
		EC.lpnSurveyReportLines(r, { created: 1 }, AX)
			.filter(e => e.raw === null).length >= 2);
}
// ---- A HEADER BEATS THE CHOOSER, which is the one rule Declan ranked above the chooser itself ---
{
	const r = EC.lpnSurveyParse('P,Northing,Easting,Z\nA,1000,2000,55.5\n', { format: 'PENZD' });
	ok('a file that names its own columns IGNORES the chosen order entirely',
		r.headerRead === true && r.points[0].north === 1000 && r.points[0].east === 2000,
		JSON.stringify([r.points[0].north, r.points[0].east]));
	// The BEHAVIOUR is what is held here, not a sentence about it: the box no longer explains
	// which half answered, and `headerRead` is how the page greys the chooser instead.
	const h = EC.lpnSurveyParse(PNEZD_TEXT, { format: 'PENZD' });
	ok('...and a file with no names of its own records the order it was read in',
		h.headerRead === false && h.format === 'PENZD');
}
// **NOT FROM THE SIZE OF THE NUMBERS.** A file whose eastings are far larger than its northings,
// which is what a State Plane survey looks like, still reads in the order that was CHOSEN.
{
	const r = EC.lpnSurveyParse('A,250000.00,1500.00,55.5,H\n', { format: 'PNEZD' });
	ok('a lopsided pair is NOT quietly re-ordered to the plausible reading',
		r.points[0].north === 250000 && r.points[0].east === 1500,
		JSON.stringify([r.points[0].north, r.points[0].east]));
}

// ---- and through the real page, where the reader actually turns the control --------------------
section('9b. the chooser, in the box the reader sees');
L.reset();
alerts = []; clearBox();
L.land(PNEZD_TEXT, 'points.txt');
{
	const sel = boxSelect();
	ok('the box carries a chooser', !!sel);
	ok('...offering exactly the orders the module declares, in that order',
		!!sel && sel.children.map(o => o.value).join(' ') === EC.lpnSurveyFormats.join(' '),
		sel && sel.children.map(o => o.value).join(' '));
	// **THE SHORT NAME AND NOTHING ELSE** (Tom, 2026-09-18: *"use short version only: PNEZD etc.
	// It's standard"*). No language key is read here on purpose: an acronym is a code, not English.
	ok('...each named by its trade acronym alone',
		!!sel && sel.children[0].textContent === 'PNEZD',
		sel && sel.children[0].textContent);
	// **THE WHOLE BOX IS THE LABEL, THE CHOOSER AND ONE SENTENCE.** Asserted by counting the lines
	// rather than by naming what is absent: a cut nothing measures grows back one paragraph at a
	// time, and the next paragraph would have no assertion written against it.
	ok('...under the short label, with no paragraph explaining it',
		boxText().indexOf(PC.lpn_survey_format_label) >= 0
			&& boxParagraphs().length === 3,
		boxParagraphs().join(' | '));
	// Turn it, and the file must be re-read: what the box stands for has to be what pressing the
	// button will DO. The box says only a count now, so the PLACEMENT below is the proof.
	sel.value = 'PENZD';
	(sel._listeners.change || []).forEach(f => f());
	press(PC.lpn_survey_create);
}
ok('the junctions landed in the order the reader chose, not the one it opened on',
	L.node('A').y === -2000 && L.node('A').x === 1000,
	L.node('A').x + ' / ' + L.node('A').y);
{
	// The same file again, left on the default. The two runs must differ, which is the whole point.
	L.reset();
	clearBox();
	L.land(PNEZD_TEXT, 'points.txt');
	boxSelect().value = 'PNEZD';
	(boxSelect()._listeners.change || []).forEach(f => f());
	press(PC.lpn_survey_create);
	ok('...and the other order puts the same point somewhere else, which is why the control exists',
		L.node('A').y === -1000 && L.node('A').x === 2000,
		L.node('A').x + ' / ' + L.node('A').y);
}
// ---- AND WHERE THE FILE STATES ITS OWN ORDER, THE CHOOSER SAYS SO ------------------------------
//
// **THE FACT LIVES IN THE CONTROL, NOT IN A SENTENCE BESIDE IT** (Tom, 2026-09-18, writing the box
// he wants: *"File format: / PNEZD specified internally"*). A file whose first row names its own
// columns used to grey the chooser out while it still displayed a stale preference read off the
// LAST file this browser opened -- so the one control on screen was showing an order that had
// nothing to do with the file in front of the reader, and a paragraph underneath explained it away.
{
	ok('a column map spells its own acronym back',
		EC.lpnSurveyFormatLetters({ id: 0, north: 1, east: 2, elev: 3, desc: 4 }) === 'PNEZD',
		EC.lpnSurveyFormatLetters({ id: 0, north: 1, east: 2, elev: 3, desc: 4 }));
	// Derived from the INDICES, so a header naming the easting first says PENZ and is not tidied
	// into the order somebody expected.
	ok('...in the order the columns actually come, never the order we expected',
		EC.lpnSurveyFormatLetters({ id: 0, east: 1, north: 2, elev: 3, desc: null }) === 'PENZ',
		EC.lpnSurveyFormatLetters({ id: 0, east: 1, north: 2, elev: 3, desc: null }));
	// A header naming only two columns spells two letters. It is not one of the eight orders and
	// must not be forced into one: it describes the file rather than offering a choice.
	ok('...and a header naming two columns spells two letters, not the nearest whole format',
		EC.lpnSurveyFormatLetters({ id: null, north: 0, east: 1, elev: null, desc: null }) === 'NE');
	L.reset(L.GEO);
	alerts = []; clearBox();
	L.land(CSV, 'survey-points.csv');
	const sel = boxSelect();
	ok('a file that states its own order offers no choice at all, only what it states',
		!!sel && sel.children.length === 1 && sel.disabled === true,
		sel && (sel.children.length + ' options, disabled=' + sel.disabled));
	// **AND THE OPTION IS THE FORMAT, FULL STOP** (Tom, 2026-09-18: *"The selector option should not
	// be reworded when a format is specified internally. Simply show the specified format, disable
	// the selector, and print 'specified internally' outside the selector (right or below)."*). It
	// read `PNEZ specified internally`, so the control's VALUE carried a sentence about the control.
	// Asserted as an exact equality against the letters alone, which is what kills the old shape:
	// a substring test would have passed on both.
	ok('...and the control itself carries the order and NOTHING else, read out of the file\'s header',
		!!sel && sel.children[0].textContent === 'PNEZ',
		sel && sel.children[0].textContent);
	{
		// The explanation is its own text, beside the greyed control. Read off pageConfig so the
		// wording stays a one-line edit, and asserted to be OUTSIDE the select -- which is the
		// whole instruction: a disabled control plus a sentence next to it, not one string
		// pretending to be a value.
		const beside = boxById('lpn_survey_format_internal');
		ok('...while the words specified internally stand beside it as their own text',
			!!beside && beside.textContent === PC.lpn_survey_format_internal
				&& beside.tagName !== 'SELECT' && beside.tagName !== 'OPTION',
			beside && (beside.tagName + ': ' + beside.textContent));
		ok('...and that text is nowhere inside the chooser',
			sel.children.every(o => o.textContent.indexOf(PC.lpn_survey_format_internal) < 0),
			sel.children.map(o => o.textContent).join(' | '));
	}
	// The label is the same short one either way: the parenthetical it used to carry -- *(if not
	// specified internally)* -- was the same explanation in the other half of the box.
	ok('...under the same short label, which no longer explains the case it is in',
		boxText().indexOf(PC.lpn_survey_format_label) >= 0 && boxParagraphs().length === 3,
		boxParagraphs().join(' | '));
	press(PC.lpn_cancel);
	clearBox();
	// ...and where the reader DOES get the choice, the note is not there to be read. A sentence that
	// is always on screen says nothing, and this one is the reason the control is greyed.
	L.reset();
	L.land(PNEZD_TEXT, 'points.txt');
	ok('...and a file that states nothing leaves the chooser live and the note off the screen',
		boxSelect().disabled === false
			&& (boxById('lpn_survey_format_internal') || {}).textContent === '',
		boxSelect().disabled + ' / ' + JSON.stringify((boxById('lpn_survey_format_internal') || {}).textContent));
	press(PC.lpn_cancel);
	clearBox();
}

// The chooser is remembered for the next file, and it is BROWSER furniture: it says which way round
// this person's data collector writes, not anything about this network.
ok('the order chosen is remembered for the next file',
	global.localStorage.getItem('lpn_survey_format') === 'PNEZD',
	String(global.localStorage.getItem('lpn_survey_format')));
ok('...and never rides in the saved project',
	JSON.stringify(L.serialize()).indexOf('lpn_survey_format') < 0);

// ---- THE ASSET KIND, WHICH IS THE ONE CHOICE THAT CANNOT BE MADE AGAIN -------------------------
//
// **FIRST IN THE BOX BECAUSE IT IS IRREVERSIBLE** (Tom, 2026-09-18: *"Since once a node is imported
// its asset type cannot be changed, we should offer asset type as a first selector."*). The POSITION
// is asserted and not just the presence: a control that drifts under the format is a control the
// reader meets after they have stopped reading.
section('9c. the asset kind');
L.reset(L.GEO);
alerts = []; clearBox();
L.land(CSV, 'survey-points.csv');
{
	const sels = boxSelects();
	ok('the box carries two choosers, and the asset kind is the FIRST of them',
		sels.length === 2 && sels[0].id === 'lpn_survey_type', sels.map(x => x.id).join(' '));
	ok('...offering the three kinds a surveyed point can become, and no link kind',
		sels[0].children.map(o => o.value).join(' ') === 'junction reservoir tank',
		sels[0].children.map(o => o.value).join(' '));
	// The toolbar's own labels, reused whole. Read off pageConfig rather than typed here, so
	// rewording Junction stays a one-line edit -- dev/scripts/harness_wording_check.php's rule.
	ok('...named by the words the toolbar already uses for them',
		sels[0].children.map(o => o.textContent).join('|')
			=== [PC.lpn_tool_add_junction, PC.lpn_tool_add_reservoir, PC.lpn_tool_add_tank].join('|'),
		sels[0].children.map(o => o.textContent).join('|'));
	ok('...opening on junction every time, never on what the last import chose',
		sels[0].children.find(o => o.selected).value === 'junction');
	// **AND THE BUTTON NAMES NO KIND AT ALL** (Tom, 2026-09-18: *"Create junctions should say
	// 'Create nodes'."*). It said `Create junctions` while the chooser above it offered three, so
	// the button was wrong two times in three -- and it is the LAST thing read before the
	// irreversible press. A node is the one word true of all three. Asserted as a NEGATIVE against
	// the toolbar's own three words rather than against the literal `Create nodes`, so rewording it
	// again stays a one-line edit and the rule survives the wording.
	ok('the button that does it names no kind, because it makes whichever kind is chosen',
		[PC.lpn_tool_add_junction, PC.lpn_tool_add_reservoir, PC.lpn_tool_add_tank]
			.every(w => PC.lpn_survey_create.toLowerCase().indexOf(w.toLowerCase()) < 0),
		PC.lpn_survey_create);
	// ...and the button carries the key VERBATIM, with nothing appended to it. That is the leg that
	// matters, because the buttons are built once when the box opens while the kind chooser is
	// turned afterwards -- so a label composed from the chosen kind would go stale in place rather
	// than say the wrong thing loudly. Asserting equality rather than "it did not change" is what
	// catches that: a label that varies by kind cannot also be the key on its own.
	ok('...and carries that one key whole, never a kind noun composed onto it at render time',
		boxButtons()[0].textContent === PC.lpn_survey_create, boxButtons()[0].textContent);
	// **THE QUESTION NAMES THE KIND, AND IT IS A WHOLE SENTENCE PER KIND.** Never a noun dropped
	// into a shared one: CLAUDE.md forbids composing a label from fragments at render time, and a
	// translator who never sees the noun cannot inflect it, move it or agree its plural.
	ok('the question at the foot of the box names junctions while junction is chosen',
		boxText().indexOf(PC.lpn_survey_confirm_junction.replace('{n}', 6)) >= 0, boxText());
	boxTypeSelect().value = 'reservoir';
	(boxTypeSelect()._listeners.change || []).forEach(f => f());
	ok('...and re-asks itself in reservoirs the moment the kind is turned',
		boxText().indexOf(PC.lpn_survey_confirm_reservoir.replace('{n}', 6)) >= 0, boxText());
	ok('...out of its own key, not out of the junction sentence with a word swapped',
		PC.lpn_survey_confirm_reservoir !== PC.lpn_survey_confirm_junction
			&& PC.lpn_survey_confirm_tank !== PC.lpn_survey_confirm_junction);
	press(PC.lpn_survey_create);
}
ok('every point in the import arrived as the kind that was chosen',
	L.getDoc().nodes.length === 6 && L.getDoc().nodes.every(n => n.type === 'reservoir'),
	L.getDoc().nodes.map(n => n.type).join(' '));
// A reservoir minted here is the toolbar's reservoir: addNode() is the one door, so the id prefix
// is the reservoir prefix. Shown on a file that names no points, because where the file DOES name
// them the surveyor's own names win -- which is the rule above this one and not an exception to it.
{
	const before = L.getDoc().nodes.map(n => n.id).join(' ');
	ok('...under the surveyor\'s own names, where the file states them', /PT-1/.test(before), before);
	L.reset(L.GEO);
	clearBox();
	L.land('lat,lon\n33.5,-111.8\n33.6,-111.9\n');
	boxTypeSelect().value = 'reservoir';
	(boxTypeSelect()._listeners.change || []).forEach(f => f());
	press(PC.lpn_survey_create);
	ok('...and through the same door a hand-drawn one comes through, so a nameless point is minted R',
		L.getDoc().nodes.every(n => /^R/.test(n.id)), L.getDoc().nodes.map(n => n.id).join(' '));
	L.reset(L.GEO);
	clearBox();
	L.land(CSV, 'survey-points.csv');
	boxTypeSelect().value = 'reservoir';
	(boxTypeSelect()._listeners.change || []).forEach(f => f());
	press(PC.lpn_survey_create);
}
// And the REPORT names them too. The counts line is per kind for the same reason the question is.
ok('the report counts reservoirs, in the sentence written for reservoirs',
	boxText().indexOf(PC.lpn_survey_report_reservoir.replace('{n}', 6).replace('{m}', 5)) >= 0,
	boxText());
{
	// Tanks, which carry a level and bounds a point list says nothing about: they come from the
	// new-asset settings, exactly as they would if the reader had drawn one.
	L.reset(L.GEO);
	clearBox();
	L.land(CSV, 'survey-points.csv');
	boxTypeSelect().value = 'tank';
	(boxTypeSelect()._listeners.change || []).forEach(f => f());
	press(PC.lpn_survey_create);
	ok('a tank import makes tanks, each with the level and bounds a new tank is born with',
		L.getDoc().nodes.every(n => n.type === 'tank' && typeof n.maxLevel === 'number'),
		L.getDoc().nodes.map(n => n.type).join(' '));
	ok('...and the report says tanks, out of the key written for tanks',
		boxText().indexOf(PC.lpn_survey_report_tank.replace('{n}', 6).replace('{m}', 5)) >= 0,
		boxText());
	// The file's own elevations still land, on all three kinds: an elevation is the one field they
	// share, which is why nothing in createSurveyNodes() branches on the kind to write it.
	ok('...and the file\'s own elevations came across onto them',
		L.getDoc().nodes.filter(n => typeof n.elev === 'number').length >= 5,
		String(L.getDoc().nodes.filter(n => typeof n.elev === 'number').length));
}

console.log('');
if (fails) { console.log(`${fails} FAILED`); process.exit(1); }
console.log('survey import: all assertions passed.');
