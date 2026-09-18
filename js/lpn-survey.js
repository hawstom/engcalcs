// Looped Pipe Network -- READING A SURVEYED POINT LIST (ROADMAP Task 592).
//
// WHAT THIS IS FOR. A field survey produces a flat list of a point name and two coordinates -- a
// column of numbers typed off a level book, or a data collector's own export. It never produces an
// EPANET `.inp`, and EPANET itself has no path for one either, which is why the forum answer to
// "how do I get my survey into a model" is always somebody's ad hoc workaround. This module is the
// reading half: text in, a list of surveyed points and a list of everything that could not be
// honoured out. It creates nothing and draws nothing -- js/looped-network.js owns the document, the
// undo stack and the map.
//
// **JUNCTIONS ONLY, AND NO PIPES.** A surveyed point list is points. Which of them are connected,
// and in what order, is a decision the surveyor did not write down and we must not invent.
//
// THE ONE RULE THAT DECIDES EVERY CASE BELOW, taken from js/lpn-inp.js because this is the same
// question in a smaller file: **a row that cannot be honoured is REPORTED, never dropped in silence
// and never guessed at.** So nothing here refuses a whole file for one bad row, nothing here
// repairs a row, and every departure gets a record in `notes` precise enough to name the row it
// came from.
//
// **AND NOTHING HERE GUESSES WHICH COLUMN IS WHICH.** A header naming two columns that could both
// be the northing is reported as ambiguous rather than resolved by position.
//
// **THE TWO COORDINATES ARE A NORTHING AND AN EASTING, WHICHEVER KIND OF PROJECT IS OPEN** (Tom,
// 2026-09-17: *"I disagree that a project must be 'georeferenced'... There is no good reason why
// the file can't be in any system the user wants."*). This module reads a pair of numbers and says
// which is which; what those numbers MEAN is the page's business, and the page already has one
// opinion about it -- a georeferenced project reads the pair as a latitude and a longitude, a
// projected one as a northing and an easting, a plain grid as Y and X. So there is no latitude in
// here at all, and a file of eastings and northings is an ordinary file rather than a refusal.
//
// **RANGE LIMITS COME FROM THE CALLER, for exactly that reason.** A latitude of 122 is not a
// latitude; a northing of 122 is a perfectly good northing. `opts.limits` is how the page states
// the bound its own kind of project has, and with none stated nothing is range-checked.
//
// **THE TOKEN IS KEPT BESIDE THE NUMBER, for the reason CLAUDE.md gives in terms: the numbers came
// out of the user's file and they are the user's.** `parseFloat('38.50')` can only ever come back
// as `38.5`, and a surveyed coordinate written to two more places than it needs is somebody saying
// how well they know it. So every number this module reads carries the exact characters it was
// written as, and the caller files them where the project's own writers already look
// (`_xsrc`/`_ysrc` for the double, the `tok` bag for the text).
//
// **NO REQUEST OF ANY KIND.** This module reads a string the user chose from their own disk. It
// talks to no host, has no consent gate of its own, and must never grow one.
//
// DOM-free and EngCalcs-free by design, so it is testable in Node
// (dev/lpn-spike/survey-import-harness.js).

(function (root) {
	'use strict';

	var EngCalcs = root.EngCalcs = root.EngCalcs || {};

	// **THE BRIDGE, IN THE SHAPE THE CHECKS READ.** `dev/scripts/pageconfig_check.php` recognises a
	// pageConfig ALIAS -- an assignment of the object itself -- and
	// `dev/scripts/js_fallback_string_check.php` then holds every `PC.<key> || '<English>'` literal
	// in this file against `lib/lang.ec.en.php`. A `function pc()` returning the same object would
	// be invisible to both of them, which is how js/lpn-search.js and js/lpn-terrain.js came to
	// carry English nothing compares. The object is captured once and mutated by nobody, so a key
	// added to it later is still seen.
	var PC = EngCalcs.pageConfig || {};

	// ---- the column vocabulary -----------------------------------------------------------------
	//
	// Normalised to lowercase letters and digits, so `Latitude (DD)`, `LAT_DD` and `lat dd` are one
	// word. DELIBERATELY SHORT LISTS: a name nobody recognises is reported with the header printed
	// back, which a person can act on in one edit of their own file. A long list of clever synonyms
	// is where a wrong guess comes from.
	// **NORTH AND EAST, and every word for either goes in one of these two lists.** A georeferenced
	// file writes `Latitude`, a State Plane file writes `Northing`, a grid file writes `Y`, and all
	// three are the same column as far as this module is concerned: the one the page will read as
	// its first axis. Keeping them in one list is what lets a survey in any system come in.
	var NORTH_NAMES = { north: 1, northing: 1, n: 1, y: 1, ycoord: 1, northingm: 1, northingft: 1,
		lat: 1, latitude: 1, latdd: 1, latdeg: 1, latitudedd: 1 };
	var EAST_NAMES = { east: 1, easting: 1, e: 1, x: 1, xcoord: 1, eastingm: 1, eastingft: 1,
		lon: 1, long: 1, lng: 1, longitude: 1, londd: 1, londeg: 1, longitudedd: 1 };
	var ID_NAMES = { p: 1, id: 1, name: 1, point: 1, pointid: 1, pointname: 1, pointnumber: 1, pt: 1,
		ptid: 1, station: 1, node: 1, nodeid: 1, junction: 1 };
	var ELEV_NAMES = { elev: 1, elevation: 1, ele: 1, z: 1, alt: 1, altitude: 1, height: 1,
		elevm: 1, elevft: 1, elevationm: 1, elevationft: 1, elem: 1, eleft: 1, zm: 1, zft: 1,
		altm: 1, altft: 1, heightm: 1, heightft: 1 };
	// The trailing D of PNEZD. Read and carried onto the junction as its description, which is a
	// field this page already has -- the surveyor's own note about the point is the single most
	// useful thing in a point list after the position itself.
	var DESC_NAMES = { d: 1, desc: 1, descr: 1, description: 1, note: 1, notes: 1, remark: 1,
		remarks: 1, comment: 1, comments: 1, code: 1 };

	// ---- the named column orders (ROADMAP Task 592; Tom, 2026-09-17) ---------------------------
	//
	// **A CHOOSER, AND DELIBERATELY NOT A GUESS** (Tom: *"We will need to include a file format
	// chooser (PNEZD, PENZD, or whatever format is useful for Declan."*). Declan's own answer, from
	// the data-entry-clerk seat and cited in his journal, is that the one field that MUST be
	// explicit is which of the two coordinates comes first, and that the way NOT to answer it is to
	// infer it from the size of the numbers -- a magnitude rule works on the file you tried it on
	// and fails silently on the next one.
	//
	// **THE LIST IS THE ONE THE TRADE ALREADY USES.** PNEZD and PENZD are Autodesk Civil 3D's own
	// names; CivilGEO's supported-formats page names at least eight of these as distinct orderings
	// it accepts. Three things vary independently -- whether there is a point-name column, whether a
	// description trails, and which coordinate comes first -- and these eight are that cross.
	//
	// **A HEADER ROW BEATS EVERY ONE OF THEM.** See lpnSurveyColumnMap(): a file that names its own
	// columns needs nobody to be asked, and a chooser left over from the last file somebody opened
	// is exactly the stale default Declan warned about.
	//
	// P = point name, N = northing, E = easting, Z = elevation, D = description. The letters ARE the
	// mapping, so adding an order is adding a row here and one label in lib/lang.ec.en.php; nothing
	// else in this file knows the list exists.
	var FORMAT_ROLE = { P: 'id', N: 'north', E: 'east', Z: 'elev', D: 'desc' };
	var FORMATS = ['PNEZD', 'PENZD', 'PNEZ', 'PENZ', 'NEZD', 'ENZD', 'NEZ', 'ENZ'];
	EngCalcs.lpnSurveyFormats = FORMATS.slice();
	EngCalcs.LPN_SURVEY_DEFAULT_FORMAT = 'PNEZD';

	/**
	 * The column indices a named order states. Unknown names fall back to the default rather than
	 * throwing: this is read from a stored preference, and a preference from an older version must
	 * not be able to stop a file opening.
	 */
	EngCalcs.lpnSurveyFormatMapping = function (format) {
		var letters = String(format || '').toUpperCase(),
			mapping = { id: null, north: null, east: null, elev: null, desc: null }, i, role;
		if (FORMATS.indexOf(letters) < 0) { letters = EngCalcs.LPN_SURVEY_DEFAULT_FORMAT; }
		for (i = 0; i < letters.length; i++) {
			role = FORMAT_ROLE[letters.charAt(i)];
			if (role) { mapping[role] = i; }
		}
		return mapping;
	};

	/**
	 * What the chooser's row for one order says: THE ACRONYM, AND NOTHING ELSE.
	 *
	 * **THE ACRONYM IS THE STANDARD AND THE READER IS A SURVEYOR** (Tom, 2026-09-18: *"For format
	 * selector, use short version only: PNEZD etc. It's standard; ask Mary. These are humans. Always
	 * as short as the audience can handle."*). This REVERSES the previous design, which spelled every
	 * order out -- *"Point name, northing, easting, elevation, description (PNEZD)"* -- on the
	 * argument that a clerk may not know which of PNEZD and PENZD puts the northing first. That
	 * argument assumes a reader who needs teaching; the person holding a point list already reads
	 * these five letters, and eight spelled-out rows are eight sentences to compare where eight
	 * acronyms are one glance.
	 *
	 * **SO THERE IS NO LANGUAGE KEY HERE AT ALL, in any of the 27 files.** PNEZD is a code and not
	 * English -- it does not translate, and a key whose value is the same five letters everywhere is
	 * 26 translations of nothing. The eight `lpn_survey_fmt_*` keys are left in lib/lang.ec.en.php
	 * unread rather than deleted; whether an unread key is debt is a judgement for a person.
	 */
	EngCalcs.lpnSurveyFormatLabel = function (format) {
		var f = String(format || '').toUpperCase();
		return FORMATS.indexOf(f) >= 0 ? f : String(format || '');
	};

	/**
	 * The acronym a COLUMN MAP spells, read back out of the indices.
	 *
	 * **THIS IS THE CHOOSER'S VALUE WHEN THE FILE ANSWERED FOR ITSELF** (Tom, 2026-09-18, writing
	 * the box he wants: *"File format: / PNEZD specified internally"*). A file whose first row
	 * names its own columns is not a file with no format -- it is a file that STATES one, and the
	 * control is where a reader looks for it. The chooser used to grey out beside a sentence
	 * explaining that a header had won, which put the fact in our prose and left the control empty.
	 *
	 * The letters are the roles in COLUMN ORDER, which is the same derivation
	 * lpnSurveyFormatMapping() runs backwards, so a header naming easting before northing spells
	 * PENZD and says so. A column the header does not name contributes no letter. The result need
	 * not be one of FORMATS -- a header may name only two columns -- and that is correct: it
	 * describes the file rather than offering an order to choose.
	 */
	EngCalcs.lpnSurveyFormatLetters = function (mapping) {
		var roles = ['id', 'north', 'east', 'elev', 'desc'], out = [];
		roles.forEach(function (r) {
			if (mapping && typeof mapping[r] === 'number') { out.push({ i: mapping[r], r: r }); }
		});
		out.sort(function (a, b) { return a.i - b.i; });
		return out.map(function (w) {
			return { id: 'P', north: 'N', east: 'E', elev: 'Z', desc: 'D' }[w.r];
		}).join('');
	};

	function norm(s) {
		return String(s === undefined || s === null ? '' : s)
			.toLowerCase().replace(/[^a-z0-9]/g, '');
	}

	// **NOTHING HERE READS A UNIT OFF A COLUMN NAME, AND NOTHING MAY LEARN TO** (Tom, 2026-09-18:
	// *"that's not typically the case for a PNEZD file. They often lack even a header. I don't think
	// it's wise to build in any units detection. We take what we are given, and we provide a robust
	// undo feature."*). A `headerUnit()` used to read `elev_m` and `Elevation (ft)` as claims about
	// the file's vertical unit, and the import then CONVERTED on the strength of a column name.
	// Two things are wrong with that and only one is about accuracy. A point list usually has no
	// header at all, so the feature answers a question almost no real file asks; and where it does
	// fire it rewrites the user's own numbers off a guess, which is the one thing CLAUDE.md forbids
	// outright -- only the user touches a file's numbers. The elevation is now taken exactly as the
	// file states it, in whatever unit the project is showing, and the reader's remedy if that is
	// wrong is one press of Undo.

	/**
	 * Which column is which, read out of a header row.
	 *
	 * Returns `{mapping, notes}`, or `{error, detail, axis}` where the header itself is
	 * the problem. `mapping` holds the column INDEX for each of id/north/east/elev/desc, with null
	 * where the header names none.
	 *
	 * **THIS IS THE HALF THAT WINS OVER THE FORMAT CHOOSER.** A file that names its own columns
	 * needs nobody to be asked, and Declan put that third on his own list for the reason a `.inp`
	 * file's own UNITS line beats any default we would have picked: what the file says about itself
	 * is evidence, and a chooser is a preference left over from the last file somebody opened.
	 */
	EngCalcs.lpnSurveyColumnMap = function (header) {
		var mapping = { id: null, north: null, east: null, elev: null, desc: null },
			hits = { id: [], north: [], east: [], elev: [], desc: [] },
			notes = [], i, n;
		for (i = 0; i < (header || []).length; i++) {
			n = norm(header[i]);
			if (!n) { continue; }
			if (NORTH_NAMES[n]) { hits.north.push(i); }
			else if (EAST_NAMES[n]) { hits.east.push(i); }
			else if (ID_NAMES[n]) { hits.id.push(i); }
			else if (ELEV_NAMES[n]) { hits.elev.push(i); }
			else if (DESC_NAMES[n]) { hits.desc.push(i); }
		}
		// **AMBIGUITY IS REPORTED, NEVER RESOLVED BY POSITION.** Two columns called `north` and
		// `northing` are a file somebody has edited by hand, and picking the first one is a coin
		// toss whose wrong answer draws a plausible map in the wrong place.
		['north', 'east', 'id', 'elev', 'desc'].forEach(function (k) {
			if (hits[k].length === 1) { mapping[k] = hits[k][0]; }
		});
		if (hits.north.length > 1) {
			return { error: 'ambiguous-coord', axis: 'north',
				detail: hits.north.map(function (j) { return header[j]; }).join(', ') };
		}
		if (hits.east.length > 1) {
			return { error: 'ambiguous-coord', axis: 'east',
				detail: hits.east.map(function (j) { return header[j]; }).join(', ') };
		}
		// **NOT AN ERROR ANY MORE.** A first row this module cannot read is a file with no header,
		// or one whose header is written in words nobody listed -- and either way the FORMAT the
		// reader chose says where the columns are. `matched` is how the caller tells the two apart.
		if (mapping.north === null || mapping.east === null) {
			return { matched: false, mapping: null, notes: [],
				detail: (header || []).join(', ') };
		}
		if (hits.elev.length > 1) {
			// Not fatal: the junctions are still points. The elevation column is left unread and
			// said so, which is the same shape as an unreadable value in one row.
			notes.push({ code: 'ambiguous-elev', ids: [],
				detail: hits.elev.map(function (j) { return header[j]; }).join(', ') });
			mapping.elev = null;
		}
		if (hits.desc.length > 1) { mapping.desc = null; }
		return { matched: true, mapping: mapping, notes: notes };
	};

	// ---- CSV ------------------------------------------------------------------------------------

	// The delimiter the first non-empty line is written with. Counted OUTSIDE quotes, because a
	// quoted place name holding a comma is exactly the row that would otherwise elect the comma in
	// a semicolon file.
	function sniffDelimiter(line) {
		var counts = { ',': 0, ';': 0, '\t': 0 }, inQ = false, i, c;
		for (i = 0; i < line.length; i++) {
			c = line.charAt(i);
			if (c === '"') { inQ = !inQ; continue; }
			if (!inQ && counts[c] !== undefined) { counts[c]++; }
		}
		if (counts['\t'] >= counts[','] && counts['\t'] >= counts[';'] && counts['\t'] > 0) { return '\t'; }
		if (counts[';'] > counts[',']) { return ';'; }
		return ',';
	}

	// One line into cells, with RFC 4180 quoting. A doubled quote inside a quoted cell is one
	// quote; everything else is taken verbatim, trailing spaces included -- trimming happens where
	// a value is interpreted, never here, because a cell's own text is what gets reported back.
	function splitRow(line, delim) {
		var out = [], cur = '', inQ = false, i, c;
		for (i = 0; i < line.length; i++) {
			c = line.charAt(i);
			if (inQ) {
				if (c === '"') {
					if (line.charAt(i + 1) === '"') { cur += '"'; i++; } else { inQ = false; }
				} else { cur += c; }
			} else if (c === '"') { inQ = true; }
			else if (c === delim) { out.push(cur); cur = ''; }
			else { cur += c; }
		}
		out.push(cur);
		return out;
	}

	function isBlankRow(cells) {
		var i;
		for (i = 0; i < cells.length; i++) { if (String(cells[i]).trim() !== '') { return false; } }
		return true;
	}

	// A comment line, so a survey file can carry a note above its header.
	//
	// **A DUMB PREFIX TEST, AND NOTHING CLEVERER** (Tom, 2026-09-18: *"I hope you are using prefixes
	// ! # / to detect a comment line and not some more sophisticated detector."*). It is a prefix
	// test, and the four prefixes are the ones below. **This is the whole list and it is closed**:
	// anything that tried to decide from a line's CONTENT whether it was meant as prose would be a
	// heuristic that eats somebody's data the first time a description column reads like a sentence.
	// A line either starts with one of these four characters or it is a row.
	//
	// `;` is EPANET's own comment character, which this page's readers already write. A `;` line
	// cannot be confused with a semicolon-delimited data row, because a data row does not START
	// with its delimiter. `!` and `//` were added on his instruction; `//` is two characters rather
	// than one and is tested as a prefix all the same.
	//
	// **AND THIS IS A DIFFERENT TEST FROM looksLikeHeader() BELOW.** That one asks whether the
	// file's first row is a header or its first point, and it has already been wrong once. Neither
	// test is allowed to answer the other's question.
	function isCommentLine(line) {
		var t = String(line).trim(), c = t.charAt(0);
		return c === '#' || c === ';' || c === '!' || t.slice(0, 2) === '//';
	}

	/**
	 * Is this first row a HEADER, or is it the file's first point?
	 *
	 * **DECIDED ON THE TWO COORDINATE CELLS ALONE, and on nothing else.** The question is asked only
	 * of a file whose first row named no columns this page knows, so the chosen order is already the
	 * mapping: a row is a HEADER when BOTH of the cells that order calls coordinates fail to read as
	 * numbers, and DATA otherwise.
	 *
	 * **THE FIRST VERSION OF THIS ASKED WHETHER ANY CELL WAS TEXT, AND THAT ATE THE FIRST POINT OF
	 * EVERY PNEZD FILE** -- found by dev/lpn-spike/survey-import-harness.js and by nothing else. A
	 * PNEZD row is `A,1000.00,2000.00,55.5,Hydrant`: the point name and the description are text by
	 * definition of the format, so "holds a cell that is not a number" is true of every data row
	 * there is. The row was passed over, a note said a header had been skipped, and the file came in
	 * one point short with the reader told something that was not true about it.
	 *
	 * **STILL NOTHING FROM THE SIZE OF A NUMBER**, here or anywhere in this file: this is TEXT
	 * versus NUMBER, which is decidable. The one thing it costs is a first data row with a typo in
	 * BOTH its coordinates, which is read as a header rather than reported as a bad row -- and the
	 * report says the line was passed over and prints it, so nothing vanishes in silence.
	 */
	function looksLikeHeader(cells, mapping) {
		var a = (cells || [])[mapping.north], b = (cells || [])[mapping.east];
		if (a === undefined && b === undefined) { return false; }
		return !readNumber(a).ok && !readNumber(b).ok;
	}

	// ---- reading one number, and keeping its text ------------------------------------------------
	//
	// Returns `{ok, value, tok}`. `tok` is the cell's own characters with surrounding space
	// removed, and it is handed on ONLY while it still parses back to the same number -- exactly
	// mergeTok()'s invariant in js/lpn-inp.js. A cell reading `38.50` keeps its text; a cell
	// reading `38,50` or `1.2.3` is not a number at all and is reported.
	function readNumber(cell) {
		var tok = String(cell === undefined || cell === null ? '' : cell).trim(), v;
		if (tok === '') { return { ok: false, blank: true, tok: '' }; }
		// **WHAT COMES BACK ON FAILURE IS THE CELL'S OWN TEXT AND NOT A READING OF IT** (Tom,
		// 2026-09-17, on the sentence that used to print it: *"This error seems wrong: 'The
		// elevation here does not read as a number (about 1240).' "*). He is right about the
		// sentence and the code was doing the right thing under it: `tok` is the characters the
		// file holds, trimmed, and nothing here ever parsed them. The old wording put them in a
		// bare parenthesis after "does not read as a number", where a parenthesis is how this page
		// prints a VALUE everywhere else -- so it read as a claim that the elevation is about 1240,
		// which is precisely what we cannot say. The fix is the sentence: the text is now
		// introduced by a colon, as the quotation it is.
		// **STRICTER THAN parseFloat, DELIBERATELY.** `parseFloat('38.5 N')` is 38.5, and a bearing
		// or a hemisphere letter silently becoming a decimal degree is the kind of guess this
		// module does not make. Degrees-minutes-seconds is not read either; it is reported, and the
		// reader converts it in the tool that produced it.
		if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(tok)) {
			return { ok: false, tok: tok };
		}
		v = parseFloat(tok);
		if (!isFinite(v)) { return { ok: false, tok: tok }; }
		return { ok: true, value: v, tok: String(v) === tok ? null : tok };
	}

	// The id the file states for a point, or '' where it states none. Kept VERBATIM -- it is the
	// name on somebody's field sheet, and the caller decides whether the document can take it.
	function readId(cell) {
		return String(cell === undefined || cell === null ? '' : cell).trim();
	}

	/**
	 * Read a surveyed point list.
	 *
	 * `opts.mapping` overrides the column detection for a CSV (indices for id/lat/lon/elev), and
	 * control can hand back what a person chose without this file growing a second opinion about
	 * which column is which.
	 *
	 * On success: `{ok: true, kind, header, mapping, points, notes, counts}`. Every point
	 * carries the file's own text for each number it read (`latTok`, `lonTok`, `elevTok`), null
	 * where the plain rendering of the number already reproduces it.
	 *
	 * On failure: `{ok: false, error, detail}` -- and there are only three kinds of failure, all of
	 * them about the file as a whole. A row that cannot be read is never one of them.
	 */
	EngCalcs.lpnSurveyParse = function (text, opts) {
		opts = opts || {};
		var src = String(text === undefined || text === null ? '' : text);
		if (src.replace(/^﻿/, '').trim() === '') { return { ok: false, error: 'empty' }; }
		src = src.replace(/^﻿/, '');
		return parseCsv(src, opts);
	};

	function parseCsv(src, opts) {
		var lines = src.split(/\r\n|\r|\n/), notes = [], points = [],
			delim = null, header = null, mapping = null, headerRead = false,
			firstIsData = false, seen = {}, blank = 0, rows = 0, i, cells, lineNo, map;
		// The header is the first line that is neither blank nor a comment.
		for (i = 0; i < lines.length; i++) {
			if (lines[i].trim() === '' || isCommentLine(lines[i])) { continue; }
			delim = sniffDelimiter(lines[i]);
			header = splitRow(lines[i], delim);
			lineNo = i;
			break;
		}
		// The empty string a trailing newline leaves behind is not a blank LINE in the file, and
		// counting it would report every well-formed file as having one. Dropped before anything is
		// counted, so `blank` means what a person reading their own file would mean by it.
		while (lines.length && lines[lines.length - 1] === '') { lines.pop(); }
		if (header === null) { return { ok: false, error: 'empty' }; }
		map = opts.mapping ? { matched: true, mapping: opts.mapping, notes: [] }
			: EngCalcs.lpnSurveyColumnMap(header);
		if (map.error) { return { ok: false, error: map.error, detail: map.detail, axis: map.axis }; }
		// **THE HEADER WINS WHERE THERE IS ONE, AND THE CHOSEN ORDER ANSWERS WHERE THERE IS NOT.**
		// Three cases and they are decidable, which is the whole reason nothing here has to guess:
		//
		//   1. The first row names two coordinate columns -- read it, and the chooser is not needed.
		//   2. The first row is not all numbers -- it is a header written in words this page does
		//      not know. SKIPPED rather than read as data (reading it would report a bad row for a
		//      line that is not a row at all), said out loud, and the chosen order is used.
		//   3. The first row is all numbers -- there is no header and the file starts here. The
		//      chosen order is used and NOTHING is skipped.
		//
		// **CASE 3 IS THE ONE THAT MUST NOT LOSE A ROW**, so `firstIsData` decides where the loop
		// starts rather than a blanket "data begins on line two".
		headerRead = map.matched;
		if (!headerRead) {
			mapping = EngCalcs.lpnSurveyFormatMapping(opts.format);
			if (looksLikeHeader(header, mapping)) {
				notes.push({ code: 'header-unread', ids: [], detail: header.join(', ') });
			} else {
				firstIsData = true;
			}
		} else {
			mapping = map.mapping;
			(map.notes || []).forEach(function (n) { notes.push(n); });
		}
		for (i = firstIsData ? lineNo : lineNo + 1; i < lines.length; i++) {
			if (isCommentLine(lines[i])) { continue; }
			cells = splitRow(lines[i], delim);
			if (isBlankRow(cells)) { blank++; continue; }
			rows++;
			// **THE LINE NUMBER AND THE LINE ITSELF, CARRIED FROM HERE** (Tom, 2026-09-17: *"The
			// import report needs to list line numbers. And it should print the entire line with a
			// much shorter message. Remember we are interfacing with humans, not AI."*). This is
			// the only place in the module that still knows either, so a note that does not take
			// them here can never get them back. `i + 1` is the number an editor shows.
			readCsvRow(cells, i + 1, lines[i], mapping, seen, points, notes, opts.limits);
		}
		if (blank) { notes.push({ code: 'blank-rows', ids: [], detail: String(blank) }); }
		if (!points.length) { return { ok: false, error: 'no-points', detail: String(rows) }; }
		return { ok: true, kind: 'csv', delimiter: delim, header: header, headerRead: headerRead,
			format: headerRead ? null : (opts.format || EngCalcs.LPN_SURVEY_DEFAULT_FORMAT),
			mapping: mapping, points: points, notes: notes,
			counts: { rows: rows, points: points.length, blank: blank } };
	}

	/**
	 * One row. `limits` is `{north, east}` where the CALLER's kind of project has a bound, and
	 * absent where it has none -- see the note at the top of this file.
	 *
	 * **EVERY REFUSAL CARRIES THE LINE NUMBER AND THE LINE** (Tom, 2026-09-17). A note used to name
	 * the row by the surveyor's own point name, on the argument that a name is what a person
	 * recognises. It is not what a person can FIND: the reader has the file open in another window
	 * and wants to put the cursor on the line. So `line` is the number an editor shows and `raw` is
	 * the line's own characters, printed underneath the sentence rather than described in it.
	 */
	function readCsvRow(cells, lineNumber, rawLine, mapping, seen, points, notes, limits) {
		var id = mapping.id === null ? '' : readId(cells[mapping.id]),
			north, east, ele, desc;
		// One refusal, in the one shape they all take: which line, the one thing wrong, the value
		// that is wrong, and the line itself. Nothing else -- a note that explains is a note the
		// reader has to read before they can start looking.
		function refuse(code, detail, axis) {
			notes.push({ code: code, line: lineNumber, raw: rawLine, detail: detail, axis: axis });
		}
		// A row too short to hold the coordinate columns at all. Reported as its own case rather
		// than as an unreadable number, because the reader's fix is different: a ragged file is one
		// a spreadsheet wrote badly, not one with a typo in it.
		if (cells.length <= Math.max(mapping.north, mapping.east)) {
			refuse('row-short', String(cells.length));
			return;
		}
		north = readNumber(cells[mapping.north]);
		east = readNumber(cells[mapping.east]);
		if (!north.ok) {
			refuse(north.blank ? 'coord-missing' : 'bad-coord', north.tok, 'north');
			return;
		}
		if (!east.ok) {
			refuse(east.blank ? 'coord-missing' : 'bad-coord', east.tok, 'east');
			return;
		}
		// **THE RANGE TEST IS SUGGESTIVE AND IS USED ONLY TO REFUSE, NEVER TO SWAP.** A latitude of
		// 122 is not a latitude; it is very probably a longitude in the latitude column, and
		// putting the pair back the other way round would be exactly the guess this module does not
		// make. So the row is reported with its own number printed, and the reader fixes their file
		// -- or presses the other way round in the format chooser, which is one gesture.
		//
		// **THERE IS NO BOUND AT ALL WITHOUT `limits`**, which is the whole of what dropping the
		// georeferenced-only rule cost: a northing of 700,000 is an ordinary northing.
		if (limits && isFinite(limits.north) && Math.abs(north.value) > limits.north) {
			refuse('coord-range', north.tok || String(north.value), 'north');
			return;
		}
		if (limits && isFinite(limits.east) && Math.abs(east.value) > limits.east) {
			refuse('coord-range', east.tok || String(east.value), 'east');
			return;
		}
		if (id !== '') {
			// A name repeated inside the file. The point is still created -- it is a real surveyed
			// place -- and this page assigns it a new name, which is said out loud. **NOT "a name of
			// ours"** (Tom, 2026-09-18, asked what that meant): it was our own coinage and it named
			// nothing a reader could picture. A new name was assigned. That is the whole fact.
			if (seen[id]) { refuse('id-duplicate', id); id = ''; }
			else { seen[id] = 1; }
		}
		ele = mapping.elev === null || mapping.elev >= cells.length
			? { ok: false, blank: true, tok: '' } : readNumber(cells[mapping.elev]);
		if (!ele.ok && !ele.blank) {
			// The junction is still created. An elevation we could not read is left for the
			// new-asset setting to answer, which is the same thing a blank column gets.
			refuse('bad-elev', ele.tok);
		}
		desc = (mapping.desc === null || mapping.desc >= cells.length) ? '' : readId(cells[mapping.desc]);
		// `line` and `raw` ride on the POINT as well, because two of the refusals -- a name the
		// document already holds, and a name it cannot spell -- are only discovered by
		// js/looped-network.js once the junction is being made, and they owe the reader the same
		// line number as every other one.
		points.push({ row: lineNumber, line: lineNumber, raw: rawLine, id: id,
			north: north.value, east: east.value,
			northTok: north.tok, eastTok: east.tok, desc: desc,
			elev: ele.ok ? ele.value : null, elevTok: ele.ok ? ele.tok : null });
	}

	// ---- the sentences --------------------------------------------------------------------------
	//
	// Composed here rather than in js/looped-network.js for one reason: that file is 40,000 lines and
	// this feature is a module. Every string is read in the `PC.<key> || '<English>'` position, so
	// dev/scripts/pageconfig_check.php sees the read and dev/scripts/js_fallback_string_check.php
	// holds the literal against lib/lang.ec.en.php.
	//
	// NOTES ARE RECORDS AND NOT SENTENCES until they are printed, exactly as js/lpn-inp.js keeps
	// them: the same fact is wanted in the report now and possibly on the element later, and a
	// record can be re-read while a sentence can only be re-parsed.
	//
	// **A SENTENCE ABOUT A COORDINATE NAMES THE AXIS THE PROJECT CALLS IT, and the caller is the
	// only one who knows what that is.** A georeferenced project reads the first column as a
	// latitude, a projected one as a northing, a plain grid as Y -- and the page settled that once,
	// in axisNames(). So every function here takes an `axes` pair and substitutes `{axis}`; nothing
	// in this module decides what kind of project is open, and nothing keeps a second list of what
	// an axis is called.
	function axisWord(axes, which) {
		if (axes && axes[which]) { return axes[which]; }
		return which === 'east' ? (PC.lpn_survey_axis_east || 'Easting')
			: (PC.lpn_survey_axis_north || 'Northing');
	}
	function fill(text, detail, axis, line) {
		return String(text)
			.replace(/\{detail\}/g, detail === null || detail === undefined ? '' : detail)
			.replace(/\{axis\}/g, axis === null || axis === undefined ? '' : axis)
			.replace(/\{line\}/g, line === null || line === undefined ? '' : line);
	}

	// ---- THE SHAPE OF A LINE ERROR -------------------------------------------------------------
	//
	//     Line 6: warning: DUPLICATE_NAME: Name already in project, new name assigned.
	//         PT-1,33.415300,-111.831400,1243.50
	//
	// One shell, filled once, so every refusal in the report reads the same way down the left-hand
	// edge and a reader scanning for their line number never has to parse a sentence to find it.
	// Tom asked for this shape on 2026-09-18 and then asked that it be checked against what real
	// tools do. Three of its parts survived that check unchanged and are here for that reason: the
	// number spelled out as `Line 6` (Python, PostgreSQL COPY, pandas, Oracle SQL*Loader, csvlint),
	// the offending line echoed underneath (SQL*Loader, and the SARIF standard's `snippet`), and an
	// uppercase symbolic code beside a plain sentence (Node's ENOENT, ShellCheck's SC2086, rustc's
	// error[E0308]). Two did not survive it, and both are gone rather than argued for:
	//
	//   * THE DASH JOINING THE CODE TO ITS SENTENCE IS ATTESTED NOWHERE. Every tool found joins the
	//     two with a colon or with brackets, so this is a colon.
	//   * `(see below)` HAS NO PRECEDENT AND WAS REDUNDANT: the offending line is always printed
	//     directly underneath, so the shell was carrying a layout instruction about itself.
	//
	// **THE SEVERITY WORD IS THE PART THAT WAS MISSING, and it is the one the reader most needs.**
	// Every convention carries one, and without it DUPLICATE_NAME -- we fixed it, carried on, and a
	// junction exists -- reads in exactly the same shape as BAD_COORDINATE, where no junction was
	// made at all. That difference is the whole question a reader brings to this report. Lowercase,
	// as in every tool cited.
	//
	// **THE CODE IS A JS LITERAL AND NOT A LANGUAGE KEY, in any of the 27 files.** It is a symbol
	// rather than a word -- the thing somebody quotes into a mail or searches this page for -- and a
	// symbol that reads differently in Turkish is no longer the same symbol. The SENTENCE beside it
	// is the translated half, and it carries the whole meaning on its own: the code is a handle,
	// never the only statement of what went wrong. **The severity word goes the other way** and is
	// a language key, because it is a word and not a symbol: nothing is searched for by it, and a
	// reader who cannot read `warning` has lost the one part of the line that was written for them.
	//
	// **AND THE VALUE IS NOT IN THE SENTENCE ANY MORE.** Every one of these used to quote the
	// offending cell back -- `repeated name: PT-1` -- while the reader's own line was already being
	// printed directly underneath, holding that same text in its own columns. Saying it twice is
	// what made these read as prose rather than as a report.
	var NOTE_CODE = {
		'row-short': 'TOO_FEW_COLUMNS',
		'coord-missing': 'MISSING_COORDINATE',
		'bad-coord': 'BAD_COORDINATE',
		'coord-range': 'COORDINATE_OUT_OF_RANGE',
		'bad-elev': 'BAD_ELEVATION',
		'id-duplicate': 'DUPLICATE_NAME',
		'id-taken': 'DUPLICATE_NAME',
		'id-invalid': 'INVALID_NAME'
	};
	// **THE SPLIT IS A FACT ABOUT THE CODE ABOVE, NOT A JUDGEMENT ABOUT SEVERITY.** `error` is every
	// case where readCsvRow() returns before pushing a point, so the file's row produced nothing;
	// `warning` is every case where the junction was made and something about it was adjusted or
	// left out. Anything absent from this table is a note about the FILE rather than about a line,
	// and carries no number, no severity and no code.
	var NOTE_SEV = {
		'row-short': 'error',
		'coord-missing': 'error',
		'bad-coord': 'error',
		'coord-range': 'error',
		'bad-elev': 'warning',
		'id-duplicate': 'warning',
		'id-taken': 'warning',
		'id-invalid': 'warning'
	};
	function sevWord(code) {
		return NOTE_SEV[code] === 'error'
			? (PC.lpn_survey_sev_error || 'error')
			: (PC.lpn_survey_sev_warning || 'warning');
	}
	function lineNote(code, sentence, axis, line) {
		return (PC.lpn_survey_note_line || 'Line {line}: {sev}: {code}: {text}')
			.replace('{line}', line === null || line === undefined ? '' : line)
			.replace('{sev}', sevWord(code))
			.replace('{code}', NOTE_CODE[code] || '')
			.replace('{text}', fill(sentence, null, axis, line));
	}
	/**
	 * One note as the reader sees it: `{text, raw}`.
	 *
	 * **SHORT SENTENCE, THEN THE LINE ITSELF** (Tom, 2026-09-17: *"it should print the entire line
	 * with a much shorter message. Remember we are interfacing with humans, not AI."*). A refusal
	 * names the line number, the one thing wrong and the value that is wrong, and then gets out of
	 * the way -- the line underneath says everything a paragraph of ours was trying to say about it,
	 * in the reader's own file's words, and it is what they will be looking for in the other window.
	 *
	 * `raw` is null for a note about the FILE rather than about a line, which has no line to print.
	 */
	EngCalcs.lpnSurveyNoteText = function (note, axes) {
		var code = (note && note.code) || '', d = note && note.detail,
			line = note && note.line,
			ax = axisWord(axes, (note && note.axis) || 'north'),
			raw = (note && note.raw !== undefined && note.raw !== null) ? String(note.raw) : null,
			text = code;
		if (code === 'row-short') { text = lineNote(code, PC.lpn_survey_note_row_short || 'Too few columns for the file format above.', ax, line); }
		else if (code === 'coord-missing') { text = lineNote(code, PC.lpn_survey_note_coord_missing || 'The {axis} cell is empty.', ax, line); }
		else if (code === 'bad-coord') { text = lineNote(code, PC.lpn_survey_note_bad_coord || 'The {axis} does not read as a number.', ax, line); }
		else if (code === 'coord-range') { text = lineNote(code, PC.lpn_survey_note_coord_range || 'The {axis} is outside the range this project allows.', ax, line); }
		else if (code === 'bad-elev') { text = lineNote(code, PC.lpn_survey_note_bad_elev || 'Non-numeric elevation. Imported without elevation.', ax, line); }
		else if (code === 'id-duplicate') { text = lineNote(code, PC.lpn_survey_note_id_duplicate || 'Name already used earlier in this file, new name assigned.', ax, line); }
		else if (code === 'id-taken') { text = lineNote(code, PC.lpn_survey_note_id_taken || 'Name already in project, new name assigned.', ax, line); }
		else if (code === 'id-invalid') { text = lineNote(code, PC.lpn_survey_note_id_invalid || 'Name cannot be used here, new name assigned.', ax, line); }
		// The rest are about the FILE and not about a line, so they carry no number, no code and
		// nothing printed underneath them: there is no line to point at.
		else if (code === 'ambiguous-elev') { text = fill(PC.lpn_survey_note_ambiguous_elev || 'More than one column could be the elevation, so none of them was read.', d, ax, line); }
		else if (code === 'header-unread') { text = fill(PC.lpn_survey_note_header_unread || 'The first line was passed over: it names no columns this page knows.', d, ax, line); }
		else if (code === 'blank-rows') { text = fill(PC.lpn_survey_note_blank_rows || 'Blank lines passed over: {detail}.', d, ax, line); }
		return { text: text, raw: raw };
	};

	/**
	 * Why a whole file could not be read, as a sentence. One per `error` code, and each one names
	 * what the reader has to change.
	 */
	EngCalcs.lpnSurveyErrorText = function (parsed, axes) {
		var code = (parsed && parsed.error) || '', d = (parsed && parsed.detail) || '',
			ax = axisWord(axes, (parsed && parsed.axis) || 'north');
		if (code === 'empty') { return fill(PC.lpn_survey_err_empty || 'That file has nothing in it.', d, ax); }
		if (code === 'ambiguous-coord') { return fill(PC.lpn_survey_err_ambiguous_coord || 'More than one column in that file could be the {axis} ({detail}), and this page will not choose between them. Leave one of them named as the {axis} and try again.', d, ax); }
		if (code === 'no-points') { return fill(PC.lpn_survey_err_no_points || 'Not one row of that file could be read as a surveyed point. Rows read: {detail}', d, ax); }
		return fill(PC.lpn_survey_err_unreadable || 'That file could not be read as a surveyed point list.', d, ax);
	};

	/**
	 * What the import is about to do, for the box that stands in front of it.
	 *
	 * **ONE SENTENCE: HOW MANY, AND MAY WE** (Tom, 2026-09-18, reading the box this used to write and
	 * calling it *"AI slop"*, then writing what he wants in its place):
	 *
	 *     File format (if not specified internally):
	 *     PNEZD [etc]
	 *     6 junction(s) found. Proceed?
	 *
	 * Gone with that: the sentence saying which coordinate column comes first, the sentence saying a
	 * header was used instead, the sentence naming which of the reader's columns became which field,
	 * the sentence about the elevation column's unit, and the sentence saying no pipes are drawn.
	 * Every one of them was true and every one of them was a paragraph standing between a person and
	 * a button. The reader has their own file open; what they cannot see without being told is how
	 * many points came out of it.
	 *
	 * **THE HEADER STILL WINS AND THAT DID NOT CHANGE.** What was cut is the EXPLANATION, not the
	 * mechanism: a file naming its own columns is still read by those names, and the chooser is still
	 * disabled while that is so, which says the same thing without a sentence.
	 */
	EngCalcs.lpnSurveyConfirmText = function (parsed) {
		return (PC.lpn_survey_confirm || '{n} junction(s) found. Proceed?')
			.replace('{n}', parsed.points.length);
	};

	/**
	 * The import report, as a list of `{text, raw}`. The caller puts them on screen; `raw` is the
	 * reader's own line, printed under the sentence, and null where the note is about the file.
	 *
	 * **IT SPEAKS EVEN WHEN NOTHING WENT WRONG**, for the reason js/lpn-inp.js's report does: "what
	 * came across" is the question, and an answer only on failure makes silence mean two things.
	 *
	 * **A LINE-NUMBERED NOTE IS NEVER POOLED WITH ANOTHER, and that reverses what this function did**
	 * (Tom, 2026-09-17: *"The import report needs to list line numbers."*). Two rows that failed the
	 * same way used to become one sentence with both point names in brackets after it, which is
	 * shorter and is the wrong shape: the reader is going line by line through their own file, and a
	 * sentence about two lines at once cannot carry either of them. So they are printed in LINE
	 * ORDER, one each. Pooling survives only for the notes that have no line -- there is exactly one
	 * blank-lines note however many blank lines there were.
	 */
	EngCalcs.lpnSurveyReportLines = function (parsed, outcome, axes) {
		var out = [], perLine = [], fileWide = [], seen = {};
		out.push({ text: (PC.lpn_survey_report_counts || '{n} junction(s) created.')
			.replace('{n}', (outcome && outcome.created) || 0), raw: null });
		if (outcome && outcome.elevFromFile) {
			out.push({ text: (PC.lpn_survey_report_elev || '{n} of them took an elevation from the file.')
				.replace('{n}', outcome.elevFromFile), raw: null });
		}
		((parsed && parsed.notes) || []).concat((outcome && outcome.notes) || []).forEach(function (d) {
			var said = EngCalcs.lpnSurveyNoteText(d, axes);
			if (d && d.line) { perLine.push({ line: d.line, text: said.text, raw: said.raw }); return; }
			if (seen[said.text]) { return; }
			seen[said.text] = 1;
			fileWide.push({ text: said.text, raw: null });
		});
		// **LINE ORDER, AND STABLE WITHIN A LINE.** One line can produce two notes -- a repeated
		// name and an unreadable elevation on the same row -- and they must stay in the order they
		// were found rather than being reordered by a comparison that cannot tell them apart.
		perLine = perLine.map(function (n, i) { return { n: n, i: i }; })
			.sort(function (a, b) { return (a.n.line - b.n.line) || (a.i - b.i); })
			.map(function (w) { return { text: w.n.text, raw: w.n.raw }; });
		if (!perLine.length && !fileWide.length) {
			out.push({ text: PC.lpn_survey_report_clean || 'Every point in the file came across, and nothing was changed on the way in.', raw: null });
			return out;
		}
		out.push({ text: PC.lpn_survey_report_lead || 'Below is every line that could not be taken as it stands, and everything that was changed on the way in. Nothing was thrown away quietly.', raw: null });
		return out.concat(perLine, fileWide);
	};

}(typeof window !== 'undefined' ? window : globalThis));
