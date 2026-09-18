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

	function norm(s) {
		return String(s === undefined || s === null ? '' : s)
			.toLowerCase().replace(/[^a-z0-9]/g, '');
	}

	// The unit a header states for itself, or null for "it does not say". Only the two vertical
	// units this page can name, and only as a SUFFIX of the column name -- `elev_m`, `Elevation
	// (ft)`. Anything else is not read as a unit at all, which is the honest answer: a column
	// called `height` says nothing about what it is measured in.
	function headerUnit(nameText) {
		var n = norm(nameText);
		if (/(?:^|[a-z0-9])(?:m|meter|meters|metre|metres)$/.test(n) && n !== 'm') { return 'm'; }
		if (/(?:^|[a-z0-9])(?:ft|foot|feet)$/.test(n) && n !== 'ft') { return 'ft'; }
		return null;
	}

	/**
	 * Which column is which, read out of a header row.
	 *
	 * Returns `{mapping, notes, elevUnit}`, or `{error, detail, axis}` where the header itself is
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
			return { matched: false, mapping: null, notes: [], elevUnit: null,
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
		return { matched: true, mapping: mapping, notes: notes,
			elevUnit: mapping.elev === null ? null : headerUnit(header[mapping.elev]) };
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

	// A comment line, so a survey file can carry a note above its header. `#` and `;` are what
	// people actually write; a `;` line cannot be confused with a semicolon-delimited data row
	// because a data row does not START with one.
	function isCommentLine(line) {
		var t = String(line).trim();
		return t.charAt(0) === '#' || t.charAt(0) === ';';
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
	 * `opts.elevUnit` overrides what the elevation column says about itself -- both so a mapping
	 * control can hand back what a person chose without this file growing a second opinion about
	 * which column is which.
	 *
	 * On success: `{ok: true, kind, header, mapping, elevUnit, points, notes, counts}`. Every point
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
			delim = null, header = null, mapping = null, elevUnit = null,
			seen = {}, blank = 0, rows = 0, i, cells, lineNo, map;
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
		map = opts.mapping ? { matched: true, mapping: opts.mapping, notes: [], elevUnit: opts.elevUnit || null }
			: EngCalcs.lpnSurveyColumnMap(header);
		if (map.error) { return { ok: false, error: map.error, detail: map.detail, axis: map.axis }; }
		if (!map.matched) {
			return { ok: false, error: 'no-coords', detail: (header || []).join(', ') };
		}
		mapping = map.mapping;
		elevUnit = (opts.elevUnit !== undefined && opts.elevUnit !== null) ? opts.elevUnit : map.elevUnit;
		(map.notes || []).forEach(function (n) { notes.push(n); });
		for (i = lineNo + 1; i < lines.length; i++) {
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
		return { ok: true, kind: 'csv', delimiter: delim, header: header, headerRead: true,
			mapping: mapping, elevUnit: elevUnit, points: points, notes: notes,
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
			// place -- and it takes a name of ours, which is said out loud.
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
		if (code === 'row-short') { text = fill(PC.lpn_survey_note_row_short || 'Line {line} too few columns: {detail} See entire line below.', d, ax, line); }
		else if (code === 'coord-missing') { text = fill(PC.lpn_survey_note_coord_missing || 'Line {line} empty {axis}. See entire line below.', d, ax, line); }
		else if (code === 'bad-coord') { text = fill(PC.lpn_survey_note_bad_coord || 'Line {line} invalid {axis}: {detail} See entire line below.', d, ax, line); }
		else if (code === 'coord-range') { text = fill(PC.lpn_survey_note_coord_range || 'Line {line} {axis} out of range: {detail} See entire line below.', d, ax, line); }
		else if (code === 'bad-elev') { text = fill(PC.lpn_survey_note_bad_elev || 'Line {line} unreadable elevation: {detail} Junction made. See entire line below.', d, ax, line); }
		else if (code === 'id-duplicate') { text = fill(PC.lpn_survey_note_id_duplicate || 'Line {line} repeated name: {detail} Junction made, under a name of ours. See entire line below.', d, ax, line); }
		else if (code === 'id-taken') { text = fill(PC.lpn_survey_note_id_taken || 'Line {line} name already in this project: {detail} Junction made, under a name of ours. See entire line below.', d, ax, line); }
		else if (code === 'id-invalid') { text = fill(PC.lpn_survey_note_id_invalid || 'Line {line} name cannot be an ID here: {detail} Junction made, under a name of ours. See entire line below.', d, ax, line); }
		// The rest are about the FILE and not about a line, so they carry no number and nothing
		// is printed underneath them.
		else if (code === 'ambiguous-elev') { text = fill(PC.lpn_survey_note_ambiguous_elev || 'More than one column could be the elevation ({detail}), so none of them was read and every elevation follows the Elevation setting for new assets.', d, ax, line); }
		else if (code === 'blank-rows') { text = fill(PC.lpn_survey_note_blank_rows || 'Blank lines were passed over: {detail}.', d, ax, line); }
		else if (code === 'elev-converted') { text = fill(PC.lpn_survey_note_elev_converted || 'The elevation column in your file is named for {detail}, which is not the unit this project is showing, so those numbers were converted. Every other number came across exactly as the file states it.', d, ax, line); }
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
		if (code === 'no-coords') { return fill(PC.lpn_survey_err_no_coords || 'This page could not find two coordinate columns in that file. Name two of the columns in the first row of the file, and try again. The first row reads: {detail}', d, ax); }
		if (code === 'ambiguous-coord') { return fill(PC.lpn_survey_err_ambiguous_coord || 'More than one column in that file could be the {axis} ({detail}), and this page will not choose between them. Leave one of them named as the {axis} and try again.', d, ax); }
		if (code === 'no-points') { return fill(PC.lpn_survey_err_no_points || 'Not one row of that file could be read as a surveyed point. Rows read: {detail}', d, ax); }
		return fill(PC.lpn_survey_err_unreadable || 'That file could not be read as a surveyed point list.', d, ax);
	};

	/**
	 * What the import is about to do, for the box that stands in front of it.
	 *
	 * **IT NAMES THE MAPPING, IT DOES NOT MERELY COUNT THE POINTS.** The reader sees which of their
	 * own columns became which coordinate, which the name and which the elevation BEFORE anything is
	 * created, so a wrong reading of ours is answerable with Cancel rather than with an undo.
	 *
	 * `unitText` is the label of the unit the project is showing for elevations, and `axes` is what
	 * the project calls its two axes -- neither of which this file can know.
	 */
	EngCalcs.lpnSurveyConfirmText = function (parsed, unitText, axes) {
		var lines = [], m = parsed.mapping, none = PC.lpn_survey_map_none || 'not used';
		lines.push((PC.lpn_survey_confirm || 'Create {n} junction(s) from this surveyed point list?')
			.replace('{n}', parsed.points.length));
		if (m) {
			lines.push((PC.lpn_survey_map_lines || '{first} comes from the column {a}, {second} from {b}, the name from {id}, and the elevation from {elev}.')
				.replace('{first}', axisWord(axes, 'north'))
				.replace('{second}', axisWord(axes, 'east'))
				.replace('{a}', columnName(parsed, m.north))
				.replace('{b}', columnName(parsed, m.east))
				.replace('{id}', m.id === null ? none : columnName(parsed, m.id))
				.replace('{elev}', m.elev === null ? none : columnName(parsed, m.elev)));
		}
		// **THE UNIT IS KNOWN ONLY WHEN THE COLUMN SAYS SO**, which is Tom's own question about this
		// sentence (2026-09-17, on the old wording: *"Under what condition would we know the units
		// of the file?"*). The answer is a header reading `Elevation_ft` or `elev (m)` and nothing
		// else, so the sentence now says where the claim comes from instead of asserting it.
		if (unitText && parsed.elevUnit) {
			lines.push((PC.lpn_survey_elev_unit || 'The elevation column in your file is named for {file}, and this project is showing {project}.')
				.replace('{file}', parsed.elevUnit === 'm' ? (PC.lpn_survey_unit_m || 'meters') : (PC.lpn_survey_unit_ft || 'feet'))
				.replace('{project}', unitText));
		} else if (unitText && m && m.elev !== null) {
			lines.push((PC.lpn_survey_elev_assumed || 'The file does not say what unit its elevations are in, so they are read as {project}, which is the unit this project is showing.')
				.replace('{project}', unitText));
		}
		lines.push(PC.lpn_survey_confirm_pipes || 'No pipes are drawn. A surveyed list says where the points are, not which of them are joined.');
		return lines.join('\n\n');
	};

	// The file's own word for a column where it states one, and the column's NUMBER where it does
	// not -- a file read by position has no names to print, and "column 2" is still an answer a
	// person can check against the file open beside them.
	function columnName(parsed, index) {
		if (index === null || index === undefined) { return ''; }
		if (parsed.header && parsed.headerRead && parsed.header[index] !== undefined
			&& String(parsed.header[index]).trim() !== '') {
			return String(parsed.header[index]).trim();
		}
		return (PC.lpn_survey_column_n || 'column {n}').replace('{n}', index + 1);
	}

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
