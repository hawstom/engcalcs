// READING A SURVEYED POINT LIST -- ROADMAP Task 592. Run with:
//   node dev/lpn-spike/survey-import-harness.js
//
// WHY THIS EXISTS. This is the second feature that puts NUMBERS FROM OUTSIDE into the document (the
// first was the terrain fill), and it is the first that puts POSITIONS there. Every way it can go
// wrong is quiet:
//
//   1. **The pair is swapped.** A latitude read as a longitude draws a map that looks perfectly
//      reasonable and is somewhere else on Earth. Nothing throws and every length still solves.
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

// The two files a person can actually pick, shipped so Tom can import something real rather than
// inventing one. The harness reads the SAME bytes the browser would.
const FIX = ROOT + 'dev/lpn-spike/fixtures/';
const CSV = fs.readFileSync(FIX + 'survey-points.csv', 'utf8');
const GPX = fs.readFileSync(FIX + 'survey-points.gpx', 'utf8');

function noteCodes(parsed) { return (parsed.notes || []).map(n => n.code); }

// ================================================================================================
// 1. WHICH COLUMN IS WHICH, and the two questions it refuses to answer
// ================================================================================================
section('1. the column mapping');
{
	const m = EC.lpnSurveyColumnMap(['Point', 'Latitude', 'Longitude', 'Elevation_ft']);
	ok('the fixture header maps to id, latitude, longitude and elevation',
		m.mapping.id === 0 && m.mapping.lat === 1 && m.mapping.lon === 2 && m.mapping.elev === 3,
		JSON.stringify(m.mapping));
	ok('...and the elevation column states its own unit', m.elevUnit === 'ft', String(m.elevUnit));
}
ok('a header written in other words still maps',
	(() => { const m = EC.lpnSurveyColumnMap(['name', 'LAT_DD', 'lon_dd', 'elev (m)']);
		return m.mapping.id === 0 && m.mapping.lat === 1 && m.mapping.lon === 2 && m.elevUnit === 'm'; })());
ok('a header with no unit on its elevation says so, rather than assuming one',
	EC.lpnSurveyColumnMap(['id', 'lat', 'lon', 'height']).elevUnit === null);
// **THE TWO REFUSALS ARE THE POINT OF THIS SECTION.** Both are cases where an answer could be
// produced and would be a guess.
ok('two columns that could both be the latitude are refused, not chosen between',
	EC.lpnSurveyColumnMap(['lat', 'latitude', 'lon']).error === 'ambiguous-lat');
ok('eastings and northings are refused BY NAME -- a plane coordinate is not a latitude',
	EC.lpnSurveyColumnMap(['point', 'Easting', 'Northing']).error === 'plane-columns');
ok('...and the message names the columns it found, so the reader can act on it',
	/Easting/.test(EC.lpnSurveyErrorText(EC.lpnSurveyColumnMap(['point', 'Easting', 'Northing']))));
ok('a header naming neither is refused with the header printed back',
	(() => { const e = EC.lpnSurveyColumnMap(['a', 'b', 'c']);
		return e.error === 'no-latlon' && e.detail === 'a, b, c'; })());

// ================================================================================================
// 2. THE CSV, against the shipped fixture
// ================================================================================================
section('2. the CSV fixture');
const csv = EC.lpnSurveyParse(CSV);
ok('the fixture reads', csv.ok === true, csv.error || '');
ok('six of its seven rows became points', csv.points.length === 6, String(csv.points.length));
ok('...and the comment lines above the header were not read as rows',
	csv.counts.rows === 7, String(csv.counts.rows));
ok('the deliberately swapped row is REPORTED and made no point',
	noteCodes(csv).indexOf('lat-range') >= 0 && !csv.points.some(p => p.id === 'PT-6'));
ok('...and its own number is printed in the note, not a paraphrase',
	(csv.notes.find(n => n.code === 'lat-range') || {}).detail === '-111.830400');
ok('...and the note names the row by the name the file gave it',
	((csv.notes.find(n => n.code === 'lat-range') || {}).ids || [])[0] === 'PT-6');
ok('the unreadable elevation is reported and the junction is STILL made',
	noteCodes(csv).indexOf('bad-elev') >= 0 && csv.points.some(p => p.id === 'PT-7'));
ok('...with no elevation of its own, rather than a zero',
	(csv.points.find(p => p.id === 'PT-7') || {}).elev === null);
{
	const p1 = csv.points.find(p => p.id === 'PT-1');
	ok('a coordinate keeps its own TEXT where the plain number would not reproduce it',
		p1.latTok === '33.415300' && p1.lonTok === '-111.831400', p1.latTok + ' / ' + p1.lonTok);
	ok('...and its VALUE is the number the file states',
		p1.lat === 33.4153 && p1.lon === -111.8314);
	ok('...and the elevation keeps its text too', p1.elevTok === '1243.50');
}
ok('a number whose plain rendering already matches keeps NO token, so an ordinary file costs nothing',
	EC.lpnSurveyParse('lat,lon\n33.4153,-111.8314\n').points[0].latTok === null);

// ================================================================================================
// 3. EVERY OTHER SHAPE A CSV ARRIVES IN, and every row that cannot be honoured
// ================================================================================================
section('3. the other shapes, and the rows that cannot be honoured');
ok('semicolons are read as the delimiter where that is what the file uses',
	(() => { const r = EC.lpnSurveyParse('id;lat;lon\nA;33.5;-111.8\n');
		return r.ok && r.delimiter === ';' && r.points[0].id === 'A'; })());
ok('tabs are read as the delimiter',
	(() => { const r = EC.lpnSurveyParse('id\tlat\tlon\nA\t33.5\t-111.8\n');
		return r.ok && r.delimiter === '\t' && r.points[0].lat === 33.5; })());
ok('a quoted cell holding a comma does not elect the comma in a semicolon file',
	(() => { const r = EC.lpnSurveyParse('name;lat;lon\n"Tank Farm, north";33.5;-111.8\n');
		return r.ok && r.points[0].id === 'Tank Farm, north'; })());
ok('CRLF line endings read the same as LF',
	EC.lpnSurveyParse('lat,lon\r\n33.5,-111.8\r\n').points.length === 1);
ok('a byte order mark does not swallow the first column name',
	EC.lpnSurveyParse('﻿lat,lon\n33.5,-111.8\n').ok === true);
ok('degrees, minutes and seconds are REPORTED rather than half read',
	(() => { const r = EC.lpnSurveyParse('lat,lon\n33 24 55.1 N,-111.8\n');
		return r.error === 'no-points' || noteCodes(r).indexOf('bad-lat') >= 0; })());
ok('a latitude with a hemisphere letter is not quietly taken as a decimal',
	noteCodes(EC.lpnSurveyParse('lat,lon\n33.5N,-111.8\nx,y\n33.6,-111.9\n')).indexOf('bad-lat') >= 0);
ok('a short row is reported as a short row, which is a different fix',
	noteCodes(EC.lpnSurveyParse('id,lat,lon\nA,33.5\nB,33.6,-111.9\n')).indexOf('row-short') >= 0);
ok('an empty coordinate cell is reported as empty, not as unreadable',
	noteCodes(EC.lpnSurveyParse('id,lat,lon\nA,,-111.8\nB,33.6,-111.9\n')).indexOf('lat-missing') >= 0);
ok('a longitude past 180 is refused for the same reason a latitude past 90 is',
	noteCodes(EC.lpnSurveyParse('lat,lon\n33.5,999\n33.6,-111.9\n')).indexOf('lon-range') >= 0);
ok('a name used twice keeps one and reports the other',
	(() => { const r = EC.lpnSurveyParse('id,lat,lon\nA,33.5,-111.8\nA,33.6,-111.9\n');
		return r.points.length === 2 && r.points[1].id === '' && noteCodes(r).indexOf('id-duplicate') >= 0; })());
ok('blank lines are counted and mentioned, never merely skipped',
	(() => { const r = EC.lpnSurveyParse('lat,lon\n33.5,-111.8\n\n\n33.6,-111.9\n');
		return r.points.length === 2 && r.counts.blank === 2 && noteCodes(r).indexOf('blank-rows') >= 0; })());
ok('...and the empty string a trailing newline leaves is not counted as one of them',
	EC.lpnSurveyParse('lat,lon\n33.5,-111.8\n').counts.blank === 0);
ok('a file with no header is refused rather than read by column position',
	EC.lpnSurveyParse('33.5,-111.8\n33.6,-111.9\n').error === 'no-latlon');
ok('an empty file says so', EC.lpnSurveyParse('   \n').error === 'empty');
ok('a file whose every row is unreadable says how many rows it tried',
	(() => { const r = EC.lpnSurveyParse('lat,lon\nx,y\n');
		return r.error === 'no-points' && r.detail === '1'; })());
// A caller-supplied mapping, which is what a mapping control would hand back. Proven here so the
// door exists before anybody builds the control, and so this file keeps no second opinion about
// which column is which once a person has chosen.
ok('a mapping handed in overrides the detection',
	(() => { const r = EC.lpnSurveyParse('a,b,c\nP1,33.5,-111.8\n',
		{ mapping: { id: 0, lat: 1, lon: 2, elev: null } });
		return r.ok && r.points[0].id === 'P1' && r.points[0].lat === 33.5; })());

// ================================================================================================
// 4. THE GPX, which needs no mapping step because the format states its own schema
// ================================================================================================
section('4. the GPX fixture');
const gpx = EC.lpnSurveyParse(GPX);
ok('the fixture reads as GPX from its CONTENT, not from a file name', gpx.ok && gpx.kind === 'gpx');
ok('four of its five waypoints became points', gpx.points.length === 4, String(gpx.points.length));
ok('the waypoint with no latitude is reported and made no point',
	noteCodes(gpx).indexOf('bad-lat') >= 0 && !gpx.points.some(p => p.id === 'WP-4'));
ok('a waypoint with no elevation is a point with no elevation',
	(gpx.points.find(p => p.id === 'WP-5') || {}).elev === null);
ok('an elevation is in meters BY THE FORMAT, so nothing is asked and nothing is guessed',
	gpx.elevUnit === 'm');
ok('...and it keeps its own text', (gpx.points.find(p => p.id === 'WP-1') || {}).elevTok === '379.0');
ok('the track point is REPORTED rather than turned into a junction or ignored',
	noteCodes(gpx).indexOf('gpx-trkpt') >= 0 &&
	(gpx.notes.find(n => n.code === 'gpx-trkpt') || {}).detail === '1');
ok('a GPX with no waypoints at all says so',
	EC.lpnSurveyParse('<gpx version="1.1"><trk><trkseg><trkpt lat="1" lon="2"/></trkseg></trk></gpx>')
		.error === 'gpx-no-waypoints');
ok('a self-closing waypoint is read',
	EC.lpnSurveyParse('<gpx><wpt lat="33.5" lon="-111.8"/></gpx>').points.length === 1);

// ================================================================================================
// 4b. THE SENTENCES, against the language file rather than against English typed here
// ================================================================================================
section('4b. what it says');
ok('the confirm names how many junctions it is about to make',
	EC.lpnSurveyConfirmText(csv, 'ft').indexOf(PC.lpn_survey_confirm.replace('{n}', 6)) >= 0);
ok('...and names the mapping, which is the whole column-mapping step',
	EC.lpnSurveyConfirmText(csv, 'ft').indexOf('Elevation_ft') >= 0 &&
	EC.lpnSurveyConfirmText(csv, 'ft').indexOf('Latitude') >= 0);
ok('...and says that no pipes are drawn',
	EC.lpnSurveyConfirmText(csv, 'ft').indexOf(PC.lpn_survey_confirm_pipes) >= 0);
ok('a clean file is told that it was clean, so silence never means two things',
	EC.lpnSurveyReportLines(EC.lpnSurveyParse('lat,lon\n33.5,-111.8\n'), { created: 1 })
		.indexOf(PC.lpn_survey_report_clean) >= 0);
ok('a file with a bad row gets the lead-in that says nothing was thrown away',
	EC.lpnSurveyReportLines(csv, { created: 6 }).indexOf(PC.lpn_survey_report_lead) >= 0);
ok('...and every note is printed, each with the rows it is about',
	EC.lpnSurveyReportLines(csv, { created: 6 }).some(t => /PT-6/.test(t)));
// Two rows that failed the same way in the same WORDS are one line naming both; two that each
// print their own number are two lines, because the number is the useful half.
ok('two rows failing identically are ONE line naming both',
	(() => { const r = EC.lpnSurveyParse('id,lat,lon\nA,,-111.8\nB,,-111.9\nC,33.5,-111.7\n');
		return EC.lpnSurveyReportLines(r, { created: 1 }).filter(t => /A, B/.test(t)).length === 1; })());
ok('...but two that print their own numbers stay two lines',
	(() => { const r = EC.lpnSurveyParse('id,lat,lon\nA,999,-111.8\nB,998,-111.9\nC,33.5,-111.7\n');
		const lines = EC.lpnSurveyReportLines(r, { created: 1 });
		return lines.some(t => /\(A\)/.test(t)) && lines.some(t => /\(B\)/.test(t)); })());

// ================================================================================================
// 5. THE DOCUMENT, through the real page
// ================================================================================================
section('5. the junctions, through the real page');

let alerts = [], confirms = [], confirmAnswer = true;
global.window.alert = global.alert = function (m) { alerts.push(String(m)); };
global.window.confirm = global.confirm = function (m) { confirms.push(String(m)); return confirmAnswer; };

const L = loadLoopedNetwork(
	"\t\tgetDoc: function () { return doc; },\n" +
	"\t\tland: landSurveyText, undo: undo,\n" +
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

function importCsv() { alerts = []; confirms = []; L.land(CSV, 'survey-points.csv'); }

L.reset(L.GEO);
importCsv();
ok('the confirm was asked BEFORE anything was created', confirms.length === 1);
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

section('7. one undo, and the refusals');
L.reset(L.GEO);
importCsv();
L.undo();
ok('ONE undo takes the whole import back, not one junction of it',
	L.getDoc().nodes.length === 0, String(L.getDoc().nodes.length));

L.reset(L.GEO);
confirmAnswer = false;
importCsv();
ok('answering no to the confirm creates nothing at all', L.getDoc().nodes.length === 0);
confirmAnswer = true;

// **AN XY PROJECT IS REFUSED IN WORDS.** A latitude has no meaning on a grid, and projecting one
// silently is the defect this refusal exists for.
L.reset();
importCsv();
ok('an XY project refuses the file and says why',
	L.getDoc().nodes.length === 0 && alerts.length === 1 && alerts[0] === PC.lpn_survey_not_geo,
	alerts[0]);

// A name the document already holds cannot be honoured, and is reported rather than repaired by
// adding a digit to somebody's field-book name.
L.reset(L.GEO);
L.addNode('junction', 0, 0);
L.node('J1').id = 'PT-1';
importCsv();
ok('a name already in the project is reported, and the junction keeps a name of ours',
	L.getDoc().nodes.length === 7 && !!L.node('J2'),
	L.getDoc().nodes.map(n => n.id).join(','));

// ---- the elevation unit, which is the one place a number may be touched ------------------------
section('8. the elevation unit, and the only conversion there is');
L.reset(L.GEO);
setUnitSet('si');
importCsv();
{
	const e = L.node('PT-1').elev;
	// 1243.50 ft is 379.0188 m, computed by hand from ft = 0.3048 m exactly -- not read off this
	// code, which would agree with any mistake in it.
	ok('a file stating feet into a project showing meters is CONVERTED, not read raw',
		Math.abs(e - 379.0188) < 1e-6, String(e));
	const n1 = L.serialize().nodes.find(n => n.id === 'PT-1');
	ok('...and the converted number keeps no token, because the text no longer says the number',
		!n1.tok || n1.tok.elev === undefined, JSON.stringify(n1.tok || {}));
	ok('...and the coordinates are untouched by any of that',
		n1.x === -111.8314 && n1.y === 33.4153);
}
L.reset(L.GEO);
alerts = []; confirms = [];
L.land(GPX, 'survey-points.gpx');
ok('a GPX elevation in meters passes straight through a project showing meters',
	L.node('WP-1').elev === 379 && L.serialize().nodes.find(n => n.id === 'WP-1').tok.elev === '379.0',
	String(L.node('WP-1').elev));
setUnitSet('us');

console.log('');
if (fails) { console.log(`${fails} FAILED`); process.exit(1); }
console.log('survey import: all assertions passed.');
