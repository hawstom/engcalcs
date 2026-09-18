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
// be a latitude is reported as ambiguous rather than resolved by position; a file with eastings and
// northings is refused by name, because a plane coordinate is not a latitude and treating one as a
// latitude puts a network in the Gulf of Guinea with no symptom but the map being wrong.
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
	// word. DELIBERATELY SHORT LISTS: a name nobody recognises is reported as "no latitude column"
	// with the header printed back, which a person can act on in one edit of their own file. A long
	// list of clever synonyms is where a wrong guess comes from.
	var LAT_NAMES = { lat: 1, latitude: 1, latdd: 1, latdeg: 1, latitudedd: 1 };
	var LON_NAMES = { lon: 1, long: 1, lng: 1, longitude: 1, londd: 1, londeg: 1, longitudedd: 1 };
	var ID_NAMES = { id: 1, name: 1, point: 1, pointid: 1, pointname: 1, pt: 1, ptid: 1,
		station: 1, node: 1, nodeid: 1, junction: 1 };
	var ELEV_NAMES = { elev: 1, elevation: 1, ele: 1, z: 1, alt: 1, altitude: 1, height: 1,
		elevm: 1, elevft: 1, elevationm: 1, elevationft: 1, elem: 1, eleft: 1, zm: 1, zft: 1,
		altm: 1, altft: 1, heightm: 1, heightft: 1 };
	// **A PLANE COORDINATE IS NOT A LATITUDE, and this is the list that says so out loud.** A State
	// Plane or UTM file is the commonest wrong file to bring to this control, its columns are
	// numbers of exactly the right shape, and a metre read as a degree is silent.
	var PLANE_NAMES = { easting: 1, northing: 1, east: 1, north: 1, e: 1, n: 1, x: 1, y: 1,
		eastingm: 1, northingm: 1, eastingft: 1, northingft: 1 };

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
	 * Returns `{mapping, notes, error, detail}`. `mapping` holds the column INDEX for each of
	 * id/lat/lon/elev, with null where the header names none; `elevUnit` is what the elevation
	 * column says about itself, or null.
	 *
	 * Exported so the harness can assert the mapping without building a file around it, and so a
	 * future mapping dialog can show what was detected before anything is created.
	 */
	EngCalcs.lpnSurveyColumnMap = function (header) {
		var mapping = { id: null, lat: null, lon: null, elev: null },
			hits = { id: [], lat: [], lon: [], elev: [] },
			plane = [], notes = [], i, n;
		for (i = 0; i < (header || []).length; i++) {
			n = norm(header[i]);
			if (!n) { continue; }
			if (LAT_NAMES[n]) { hits.lat.push(i); }
			else if (LON_NAMES[n]) { hits.lon.push(i); }
			else if (ID_NAMES[n]) { hits.id.push(i); }
			else if (ELEV_NAMES[n]) { hits.elev.push(i); }
			else if (PLANE_NAMES[n]) { plane.push(header[i]); }
		}
		// **AMBIGUITY IS REPORTED, NEVER RESOLVED BY POSITION.** Two columns called `lat` and
		// `latitude` are a file somebody has edited by hand, and picking the first one is a coin
		// toss whose wrong answer draws a plausible map in the wrong place.
		['lat', 'lon', 'id', 'elev'].forEach(function (k) {
			if (hits[k].length === 1) { mapping[k] = hits[k][0]; }
		});
		if (hits.lat.length > 1) {
			return { error: 'ambiguous-lat', detail: hits.lat.map(function (j) { return header[j]; }).join(', ') };
		}
		if (hits.lon.length > 1) {
			return { error: 'ambiguous-lon', detail: hits.lon.map(function (j) { return header[j]; }).join(', ') };
		}
		if (mapping.lat === null || mapping.lon === null) {
			// A plane file gets its own answer, because "no latitude column" would send the reader
			// hunting for a spelling mistake in a file that does not hold a latitude at all.
			if (plane.length) { return { error: 'plane-columns', detail: plane.join(', ') }; }
			return { error: 'no-latlon', detail: (header || []).join(', ') };
		}
		if (hits.elev.length > 1) {
			// Not fatal: the junctions are still points. The elevation column is left unread and
			// said so, which is the same shape as an unreadable value in one row.
			notes.push({ code: 'ambiguous-elev', ids: [],
				detail: hits.elev.map(function (j) { return header[j]; }).join(', ') });
			mapping.elev = null;
		}
		return { mapping: mapping, notes: notes,
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

	function rowLabel(row) {
		return (PC.lpn_survey_row || 'row {n}').replace('{n}', row);
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
		// The header is the first line that is neither blank nor a comment. **A CSV WITH NO HEADER
		// IS REFUSED RATHER THAN READ BY POSITION**: which column is a latitude cannot be told from
		// numbers, both of a pair are plausible either way round, and a swapped pair draws a map
		// that looks fine and is somewhere else entirely.
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
		map = opts.mapping ? { mapping: opts.mapping, notes: [], elevUnit: opts.elevUnit || null }
			: EngCalcs.lpnSurveyColumnMap(header);
		if (map.error) { return { ok: false, error: map.error, detail: map.detail }; }
		mapping = map.mapping;
		elevUnit = (opts.elevUnit !== undefined && opts.elevUnit !== null) ? opts.elevUnit : map.elevUnit;
		(map.notes || []).forEach(function (n) { notes.push(n); });
		for (i = lineNo + 1; i < lines.length; i++) {
			if (isCommentLine(lines[i])) { continue; }
			cells = splitRow(lines[i], delim);
			if (isBlankRow(cells)) { blank++; continue; }
			rows++;
			readCsvRow(cells, i + 1, mapping, seen, points, notes);
		}
		if (blank) { notes.push({ code: 'blank-rows', ids: [], detail: String(blank) }); }
		if (!points.length) { return { ok: false, error: 'no-points', detail: String(rows) }; }
		return { ok: true, kind: 'csv', delimiter: delim, header: header, mapping: mapping,
			elevUnit: elevUnit, points: points, notes: notes,
			counts: { rows: rows, points: points.length, blank: blank } };
	}

	function readCsvRow(cells, lineNumber, mapping, seen, points, notes) {
		var id = mapping.id === null ? '' : readId(cells[mapping.id]),
			label = id || rowLabel(lineNumber),
			lat, lon, ele;
		// A row too short to hold the coordinate columns at all. Reported as its own case rather
		// than as an unreadable number, because the reader's fix is different: a ragged file is one
		// a spreadsheet wrote badly, not one with a typo in it.
		if (cells.length <= Math.max(mapping.lat, mapping.lon)) {
			notes.push({ code: 'row-short', ids: [label], detail: String(cells.length) });
			return;
		}
		lat = readNumber(cells[mapping.lat]);
		lon = readNumber(cells[mapping.lon]);
		if (!lat.ok) {
			notes.push({ code: lat.blank ? 'lat-missing' : 'bad-lat', ids: [label], detail: lat.tok });
			return;
		}
		if (!lon.ok) {
			notes.push({ code: lon.blank ? 'lon-missing' : 'bad-lon', ids: [label], detail: lon.tok });
			return;
		}
		// **THE RANGE TEST IS SUGGESTIVE AND IS USED ONLY TO REFUSE, NEVER TO SWAP.** A latitude of
		// 122 is not a latitude; it is very probably a longitude in the latitude column, and
		// putting the pair back the other way round would be exactly the guess this module does not
		// make. So the row is reported with its own number printed, and the reader fixes their file.
		if (Math.abs(lat.value) > 90) {
			notes.push({ code: 'lat-range', ids: [label], detail: lat.tok || String(lat.value) });
			return;
		}
		if (Math.abs(lon.value) > 180) {
			notes.push({ code: 'lon-range', ids: [label], detail: lon.tok || String(lon.value) });
			return;
		}
		if (id !== '') {
			// A name repeated inside the file. The point is still created -- it is a real surveyed
			// place -- and it takes a name of ours, which is said out loud.
			if (seen[id]) { notes.push({ code: 'id-duplicate', ids: [label], detail: null }); id = ''; }
			else { seen[id] = 1; }
		}
		ele = mapping.elev === null || mapping.elev >= cells.length
			? { ok: false, blank: true, tok: '' } : readNumber(cells[mapping.elev]);
		if (!ele.ok && !ele.blank) {
			// The junction is still created. An elevation we could not read is left for the
			// new-asset setting to answer, which is the same thing a blank column gets.
			notes.push({ code: 'bad-elev', ids: [label], detail: ele.tok });
		}
		points.push({ row: lineNumber, id: id, lat: lat.value, lon: lon.value,
			latTok: lat.tok, lonTok: lon.tok,
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
	function fill(text, detail) {
		return String(text).replace('{detail}', detail === null || detail === undefined ? '' : detail);
	}
	EngCalcs.lpnSurveyNoteText = function (note) {
		var code = (note && note.code) || '', d = note && note.detail;
		if (code === 'row-short') { return fill(PC.lpn_survey_note_row_short || 'This row does not have enough columns to hold a position, so no junction was made for it.', d); }
		if (code === 'lat-missing') { return fill(PC.lpn_survey_note_lat_missing || 'The latitude column is empty on this row, so no junction was made for it.', d); }
		if (code === 'lon-missing') { return fill(PC.lpn_survey_note_lon_missing || 'The longitude column is empty on this row, so no junction was made for it.', d); }
		if (code === 'bad-lat') { return fill(PC.lpn_survey_note_bad_lat || 'The latitude here does not read as a decimal number of degrees ({detail}), so no junction was made for this row. Degrees, minutes and seconds are not read; convert them to decimal degrees first.', d); }
		if (code === 'bad-lon') { return fill(PC.lpn_survey_note_bad_lon || 'The longitude here does not read as a decimal number of degrees ({detail}), so no junction was made for this row. Degrees, minutes and seconds are not read; convert them to decimal degrees first.', d); }
		if (code === 'lat-range') { return fill(PC.lpn_survey_note_lat_range || 'This latitude is outside the range a latitude can have ({detail}), so no junction was made for this row. If your latitude and longitude columns are the other way round, swap them in your own file: this page will not swap them for you, because it cannot tell a mistake from a place.', d); }
		if (code === 'lon-range') { return fill(PC.lpn_survey_note_lon_range || 'This longitude is outside the range a longitude can have ({detail}), so no junction was made for this row.', d); }
		if (code === 'bad-elev') { return fill(PC.lpn_survey_note_bad_elev || 'The elevation here does not read as a number ({detail}). The junction was still made, and its elevation follows the Elevation setting for new assets.', d); }
		if (code === 'id-duplicate') { return fill(PC.lpn_survey_note_id_duplicate || 'This name is used more than once in the file, so this junction was given a name of ours instead.', d); }
		if (code === 'id-taken') { return fill(PC.lpn_survey_note_id_taken || 'This name already belongs to something in the project, so this junction was given a name of ours instead.', d); }
		if (code === 'id-invalid') { return fill(PC.lpn_survey_note_id_invalid || 'This name cannot be used as an ID here, so this junction was given a name of ours instead.', d); }
		if (code === 'ambiguous-elev') { return fill(PC.lpn_survey_note_ambiguous_elev || 'More than one column could be the elevation ({detail}), so none of them was read and every elevation follows the Elevation setting for new assets.', d); }
		if (code === 'blank-rows') { return fill(PC.lpn_survey_note_blank_rows || 'Blank lines were passed over: {detail}.', d); }
		if (code === 'elev-converted') { return fill(PC.lpn_survey_note_elev_converted || 'The elevations in the file are in {detail}, which is not the unit this project is showing, so those numbers were converted. Every other number came across exactly as the file states it.', d); }
		return code;
	};

	/**
	 * Why a whole file could not be read, as a sentence. One per `error` code, and each one names
	 * what the reader has to change.
	 */
	EngCalcs.lpnSurveyErrorText = function (parsed) {
		var code = (parsed && parsed.error) || '', d = (parsed && parsed.detail) || '';
		if (code === 'empty') { return fill(PC.lpn_survey_err_empty || 'That file has nothing in it.', d); }
		if (code === 'no-latlon') { return fill(PC.lpn_survey_err_no_latlon || 'This page could not find a latitude column and a longitude column in that file. Name two of the columns latitude and longitude, in the first row of the file, and try again. The first row reads: {detail}', d); }
		if (code === 'ambiguous-lat') { return fill(PC.lpn_survey_err_ambiguous_lat || 'More than one column in that file could be the latitude ({detail}), and this page will not choose between them. Leave one of them named as the latitude and try again.', d); }
		if (code === 'ambiguous-lon') { return fill(PC.lpn_survey_err_ambiguous_lon || 'More than one column in that file could be the longitude ({detail}), and this page will not choose between them. Leave one of them named as the longitude and try again.', d); }
		if (code === 'plane-columns') { return fill(PC.lpn_survey_err_plane || 'That file holds plane survey coordinates ({detail}), not latitude and longitude. A northing is a distance across a flat plane, and this page cannot yet turn one into a position on the Earth, so nothing was read. Export the same points as latitude and longitude, in decimal degrees, and try again.', d); }
		if (code === 'no-points') { return fill(PC.lpn_survey_err_no_points || 'Not one row of that file could be read as a surveyed point. Rows read: {detail}', d); }
		return fill(PC.lpn_survey_err_unreadable || 'That file could not be read as a surveyed point list.', d);
	};

	/**
	 * What the import is about to do, for the confirm that stands in front of it.
	 *
	 * **IT NAMES THE MAPPING, IT DOES NOT MERELY COUNT THE POINTS.** This is the whole of the
	 * column-mapping step for a file whose header we recognised: the reader sees which of their own
	 * columns became the latitude, the longitude, the name and the elevation BEFORE anything is
	 * created, so a wrong guess of ours is answerable with Cancel rather than with an undo.
	 *
	 * `unitText` is the label of the unit the project is showing for elevations, which this file
	 * cannot know.
	 */
	EngCalcs.lpnSurveyConfirmText = function (parsed, unitText) {
		var lines = [], m = parsed.mapping, none = PC.lpn_survey_map_none || 'not used';
		lines.push((PC.lpn_survey_confirm || 'Create {n} junction(s) from this surveyed point list?')
			.replace('{n}', parsed.points.length));
		if (parsed.kind === 'csv' && m) {
			lines.push((PC.lpn_survey_map_lines || 'Latitude comes from the column {lat}, longitude from {lon}, the name from {id}, and the elevation from {elev}.')
				.replace('{lat}', parsed.header[m.lat])
				.replace('{lon}', parsed.header[m.lon])
				.replace('{id}', m.id === null ? none : parsed.header[m.id])
				.replace('{elev}', m.elev === null ? none : parsed.header[m.elev]));
		}
		if (unitText && parsed.elevUnit) {
			lines.push((PC.lpn_survey_elev_unit || 'Elevations in the file are read as {file}, and this project is showing {project}.')
				.replace('{file}', parsed.elevUnit === 'm' ? (PC.lpn_survey_unit_m || 'meters') : (PC.lpn_survey_unit_ft || 'feet'))
				.replace('{project}', unitText));
		} else if (unitText && m && m.elev !== null) {
			lines.push((PC.lpn_survey_elev_assumed || 'The file does not say what unit its elevations are in, so they are read as {project}, which is the unit this project is showing.')
				.replace('{project}', unitText));
		}
		lines.push(PC.lpn_survey_confirm_pipes || 'No pipes are drawn. A surveyed list says where the points are, not which of them are joined.');
		return lines.join('\n\n');
	};

	/**
	 * The import report, as lines of text. The caller puts them on screen.
	 *
	 * **IT SPEAKS EVEN WHEN NOTHING WENT WRONG**, for the reason js/lpn-inp.js's report does: "what
	 * came across" is the question, and an answer only on failure makes silence mean two things.
	 */
	EngCalcs.lpnSurveyReportLines = function (parsed, outcome) {
		var out = [], byText = [], seen = {};
		out.push((PC.lpn_survey_report_counts || '{n} junction(s) created.')
			.replace('{n}', (outcome && outcome.created) || 0));
		if (outcome && outcome.elevFromFile) {
			out.push((PC.lpn_survey_report_elev || '{n} of them took an elevation from the file.')
				.replace('{n}', outcome.elevFromFile));
		}
		((parsed && parsed.notes) || []).concat((outcome && outcome.notes) || []).forEach(function (d) {
			var text = EngCalcs.lpnSurveyNoteText(d), at = seen[text];
			if (at === undefined) { seen[text] = byText.length; byText.push({ text: text, ids: (d.ids || []).slice() }); }
			else { byText[at].ids = byText[at].ids.concat(d.ids || []); }
		});
		if (!byText.length) {
			out.push(PC.lpn_survey_report_clean || 'Every point in the file came across, and nothing was changed on the way in.');
			return out;
		}
		out.push(PC.lpn_survey_report_lead || 'Nothing in your file was thrown away quietly. Below is every row that could not be taken as it stands, and everything that was changed on the way in:');
		byText.forEach(function (rowNote) {
			out.push(rowNote.ids.length ? rowNote.text + ' (' + rowNote.ids.join(', ') + ')' : rowNote.text);
		});
		return out;
	};

}(typeof window !== 'undefined' ? window : globalThis));
