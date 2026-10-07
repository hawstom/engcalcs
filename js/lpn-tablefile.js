// lpn-tablefile.js -- a table of text cells as a file: tab-separated text for the clipboard, CSV
// ODS and XLSX for a download. Pure: strings in, a string or bytes out. No DOM, no strings of its own.
//
// Tom, 2026-10-06: *"When copying from a Table, it would be nice to be able to copy the headings
// somehow. It might also be nice to Export to CSV and ODS the Tables."*
//
// **THE CELLS ARE THE ONES THE TABLE SHOWS, AND THEY GO OUT AS THEY ARE.** The caller hands over
// text; this file never reformats a number. An ODS cell is a float only when its column is a
// number column AND its text parses as one, and its office:value is that same text, so a "1.50"
// on screen is 1.50 in the sheet and not 1.5.
//
// **CSV IS RFC 4180** (CRLF line ends, a field quoted when it holds a comma, a quote or a line
// break, a quote doubled inside quotes). **IT CARRIES A UTF-8 BYTE ORDER MARK, ON PURPOSE.** RFC
// 4180 says nothing about one and the Unicode Standard (ch. 3, "Byte Order Mark") calls it
// unnecessary for UTF-8, but Excel for Windows opens a BOM-less .csv in the legacy ANSI code page
// and turns every non-ASCII pipe or street name into mojibake; its own "CSV UTF-8" save writes the
// BOM, and it is what makes the file open correctly on a double click. Every other reader we know
// of (LibreOffice, Google Sheets, Python's utf-8-sig, R) skips it. Pass `{ bom: false }` to omit.
//
// **ODS IS A ZIP** whose first entry is `mimetype`, STORED and with no extra field, so a reader can
// sniff it at byte 38 (OpenDocument 1.2 part 3, section 3.3). Every entry here is STORED: a table
// of a few hundred rows gains little from deflate, and a store-only writer is 60 lines with no
// dependency. The CRC-32 is the standard one (polynomial 0xEDB88320).

var EngCalcs = (typeof require === 'function' && typeof module !== 'undefined')
	? require('./PipeHydraulics.lib.js')
	: (EngCalcs || {});

(function () {
	'use strict';

	function tsvCell(s) { return String(s === undefined || s === null ? '' : s).replace(/[\t\r\n]+/g, ' '); }
	function tsv(heads, rows) {
		var lines = [];
		if (heads) { lines.push(heads.map(tsvCell).join('\t')); }
		rows.forEach(function (r) { lines.push(r.map(tsvCell).join('\t')); });
		return lines.join('\n');
	}

	function csvField(s) {
		s = s === undefined || s === null ? '' : String(s);
		return (/[",\r\n]/).test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
	}
	function csv(heads, rows, options) {
		var lines = [heads.map(csvField).join(',')], bom = !options || options.bom !== false;
		rows.forEach(function (r) { lines.push(r.map(csvField).join(',')); });
		return (bom ? '﻿' : '') + lines.join('\r\n') + '\r\n';
	}

	// ---- ZIP, STORE only ---------------------------------------------------------------------
	var crcTable = null;
	function crc32(bytes) {
		var c, n, k, crc = 0xFFFFFFFF;
		if (!crcTable) {
			crcTable = [];
			for (n = 0; n < 256; n++) {
				c = n;
				for (k = 0; k < 8; k++) { c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); }
				crcTable[n] = c >>> 0;
			}
		}
		for (n = 0; n < bytes.length; n++) { crc = crcTable[(crc ^ bytes[n]) & 0xFF] ^ (crc >>> 8); }
		return (crc ^ 0xFFFFFFFF) >>> 0;
	}
	function utf8(s) { return new TextEncoder().encode(s); }
	function zipStore(files) {
		var parts = [], central = [], offset = 0, total = 0, out, pos = 0;
		function u16(v) { return [v & 255, (v >>> 8) & 255]; }
		function u32(v) { return [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]; }
		files.forEach(function (f) {
			var name = utf8(f.name), data = f.data, crc = crc32(data),
				// 1980-01-01 00:00:00: a file we made has no honest mtime worth a fingerprint.
				common = [].concat(u16(20), u16(0x0800), u16(0), u16(0), u16(0x21), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0)),
				local = Uint8Array.from([0x50, 0x4B, 3, 4].concat(common)),
				cen = Uint8Array.from([0x50, 0x4B, 1, 2].concat(u16(20), common, u16(0), u16(0), u16(0), u32(0), u32(offset)));
			parts.push(local, name, data);
			central.push(cen, name);
			offset += local.length + name.length + data.length;
		});
		total = 0;
		central.forEach(function (p) { total += p.length; });
		central.push(Uint8Array.from([0x50, 0x4B, 5, 6].concat(u16(0), u16(0), u16(files.length), u16(files.length), u32(total), u32(offset), u16(0))));
		parts = parts.concat(central);
		total = 0;
		parts.forEach(function (p) { total += p.length; });
		out = new Uint8Array(total);
		parts.forEach(function (p) { out.set(p, pos); pos += p.length; });
		return out;
	}

	// ---- WHAT EVERY SHEET SHARES: names, widths, number formats ------------------------------
	var NUMBER = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;
	function xmlText(s) {
		// Characters XML 1.0 forbids are dropped; the five markup characters are escaped.
		return String(s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, '')
			.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}
	// A sheet name: no [ ] * ? : / \, at most 31 characters (Excel's limit, and ODS tolerates it),
	// never empty, never repeated within a workbook (case-insensitively, as Excel compares).
	function sheetNames(wanted) {
		var seen = {};
		return wanted.map(function (w) {
			var base = String(w || 'Table').replace(/[\[\]*?:\/\\]/g, ' ').replace(/\s+/g, ' ').replace(/^[\s']+|[\s']+$/g, '').slice(0, 31) || 'Table',
				name = base, n = 1, tail;
			while (seen[name.toLowerCase()]) {
				n++; tail = ' (' + n + ')';
				name = base.slice(0, 31 - tail.length) + tail;
			}
			seen[name.toLowerCase()] = true;
			return name;
		});
	}
	function glyphs(s) { return Array.from(String(s)).length; }
	// **COLUMN WIDTHS FROM THE CONTENT**, in characters: the widest cell, or the room a heading needs
	// when it is allowed to wrap onto two lines (its longest word, or half its length, whichever is
	// more), plus one character of padding; never under 6 or over 40, so a long vertex list or name
	// does not take the whole screen. The ID column (the first) is never under 8.
	function colWidths(heads, rows) {
		return heads.map(function (h, i) {
			var cell = 0, word = 0, len = glyphs(h), w;
			rows.forEach(function (r) { cell = Math.max(cell, glyphs(r[i] === undefined || r[i] === null ? '' : r[i])); });
			String(h).split(/\s+/).forEach(function (t) { word = Math.max(word, glyphs(t)); });
			w = Math.max(cell, word, Math.ceil(len / 2)) + 1;
			return Math.min(40, Math.max(i === 0 ? 8 : 6, w));
		});
	}
	// How many lines a heading takes at a width, wrapping greedily at spaces.
	function headLines(h, width) {
		var words = String(h).split(/\s+/), lines = 1, cur = 0;
		words.forEach(function (t, i) {
			var n = glyphs(t);
			if (i === 0) { cur = n; } else if (cur + 1 + n <= width - 1) { cur += 1 + n; } else { lines++; cur = n; }
			while (cur > width - 1 && width > 1) { lines++; cur -= (width - 1); }
		});
		return lines;
	}
	// A cell is a number only in a number column, and its text then is the number AS SHOWN. The
	// displayed decimals ride along as a number format ("1.50" stays two places), so a sheet reads
	// as the screen does without the value being rounded or reformatted.
	function numberCell(text, isNum) {
		var m;
		if (!isNum || !NUMBER.test(text)) { return null; }
		m = /^[+-]?\d*\.(\d+)$/.exec(text);
		return { dec: m ? Math.min(m[1].length, 15) : 0, general: /[eE]/.test(text) };
	}
	function colLetter(i) {
		var s = '';
		for (i = i + 1; i > 0; i = Math.floor((i - 1) / 26)) { s = String.fromCharCode(65 + ((i - 1) % 26)) + s; }
		return s;
	}
	function normSheet(sh) {
		return { name: sh.name, heads: sh.heads, rows: sh.rows, numeric: sh.numeric || [] };
	}

	// ---- ODS ---------------------------------------------------------------------------------
	// ODF collapses runs of spaces; text:s spells them out so a name with two spaces keeps both.
	function paragraph(s) {
		return '<text:p>' + xmlText(s).replace(/\t/g, '<text:tab/>').replace(/\r?\n/g, '<text:line-break/>')
			.replace(/ {2,}/g, function (m) { return ' <text:s text:c="' + (m.length - 1) + '"/>'; })
			.replace(/^ /, '<text:s/>') + '</text:p>';
	}
	function odsCell(text, nm, head, decs) {
		var s = text === undefined || text === null ? '' : String(text), st = head ? ' table:style-name="ceh"' : '';
		if (s === '') { return '<table:table-cell' + st + '/>'; }
		if (nm && !head) {
			if (!nm.general) { decs[nm.dec] = true; }
			return '<table:table-cell' + (nm.general ? '' : ' table:style-name="cn' + nm.dec + '"') +
				' office:value-type="float" office:value="' + s + '">' + paragraph(s) + '</table:table-cell>';
		}
		return '<table:table-cell' + st + ' office:value-type="string">' + paragraph(s) + '</table:table-cell>';
	}
	function odsConfigTable(name, cols) {
		function item(n, t, v) { return '<config:config-item config:name="' + n + '" config:type="' + t + '">' + v + '</config:config-item>'; }
		// The heading row and, where there is more than one column, the ID column are frozen.
		var fc = cols > 1 ? 1 : 0;
		return '<config:config-item-map-entry config:name="' + xmlText(name) + '">' +
			item('CursorPositionX', 'int', 0) + item('CursorPositionY', 'int', 0) +
			item('HorizontalSplitMode', 'short', fc ? 2 : 0) + item('VerticalSplitMode', 'short', 2) +
			item('HorizontalSplitPosition', 'int', fc) + item('VerticalSplitPosition', 'int', 1) +
			item('ActiveSplitRange', 'short', fc ? 3 : 2) +
			item('PositionLeft', 'int', 0) + item('PositionRight', 'int', fc) +
			item('PositionTop', 'int', 0) + item('PositionBottom', 'int', 1) +
			'</config:config-item-map-entry>';
	}
	function odsBook(sheetsIn) {
		var NS = 'xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" ' +
			'xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" ' +
			'xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" ' +
			'xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" ' +
			'xmlns:number="urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0" ' +
			'xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"',
			sheets = sheetsIn.map(normSheet), names = sheetNames(sheets.map(function (x) { return x.name; })),
			decs = {}, colStyles = '', body = '', config = '', content, manifest, settings, d,
			mime = 'application/vnd.oasis.opendocument.spreadsheet';
		sheets.forEach(function (sh, si) {
			var widths = colWidths(sh.heads, sh.rows), t = '<table:table table:name="' + xmlText(names[si]) + '">';
			widths.forEach(function (w, i) {
				// About 0.19 cm a character at the default 10 pt face, plus a little padding.
				colStyles += '<style:style style:name="co' + si + '_' + i + '" style:family="table-column">' +
					'<style:table-column-properties style:column-width="' + ((w * 0.19 + 0.2).toFixed(2)) + 'cm"/></style:style>';
				t += '<table:table-column table:style-name="co' + si + '_' + i + '"/>';
			});
			t += '<table:table-header-rows><table:table-row>' +
				sh.heads.map(function (h) { return odsCell(h, null, true, decs); }).join('') + '</table:table-row></table:table-header-rows>';
			sh.rows.forEach(function (r) {
				t += '<table:table-row>' + sh.heads.map(function (h, i) {
					var v = r[i];
					return odsCell(v, numberCell(v === undefined || v === null ? '' : String(v), sh.numeric[i]), false, decs);
				}).join('') + '</table:table-row>';
			});
			body += t + '</table:table>';
			config += odsConfigTable(names[si], sh.heads.length);
		});
		var dataStyles = '';
		for (d in decs) {
			if (decs.hasOwnProperty(d)) {
				dataStyles += '<number:number-style style:name="N' + d + '"><number:number number:decimal-places="' + d +
					'" number:min-integer-digits="1"/></number:number-style>' +
					'<style:style style:name="cn' + d + '" style:family="table-cell" style:data-style-name="N' + d + '"/>';
			}
		}
		content = '<?xml version="1.0" encoding="UTF-8"?>\n<office:document-content ' + NS + ' office:version="1.2">' +
			'<office:automatic-styles>' + colStyles +
			'<style:style style:name="ceh" style:family="table-cell">' +
			'<style:table-cell-properties fo:wrap-option="wrap" style:vertical-align="middle"/>' +
			'<style:paragraph-properties fo:text-align="center"/>' +
			'<style:text-properties fo:font-weight="bold"/></style:style>' + dataStyles +
			'</office:automatic-styles>' +
			'<office:body><office:spreadsheet>' + body + '</office:spreadsheet></office:body></office:document-content>';
		settings = '<?xml version="1.0" encoding="UTF-8"?>\n<office:document-settings ' +
			'xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" ' +
			'xmlns:config="urn:oasis:names:tc:opendocument:xmlns:config:1.0" office:version="1.2"><office:settings>' +
			'<config:config-item-set config:name="ooo:view-settings"><config:config-item-map-indexed config:name="Views">' +
			'<config:config-item-map-entry><config:config-item config:name="ViewId" config:type="string">view1</config:config-item>' +
			'<config:config-item-map-named config:name="Tables">' + config + '</config:config-item-map-named>' +
			'<config:config-item config:name="ActiveTable" config:type="string">' + xmlText(names[0]) + '</config:config-item>' +
			'</config:config-item-map-entry></config:config-item-map-indexed></config:config-item-set>' +
			'</office:settings></office:document-settings>';
		manifest = '<?xml version="1.0" encoding="UTF-8"?>\n<manifest:manifest ' +
			'xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2">' +
			'<manifest:file-entry manifest:full-path="/" manifest:version="1.2" manifest:media-type="' + mime + '"/>' +
			'<manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>' +
			'<manifest:file-entry manifest:full-path="settings.xml" manifest:media-type="text/xml"/></manifest:manifest>';
		return zipStore([
			{ name: 'mimetype', data: utf8(mime) },
			{ name: 'META-INF/manifest.xml', data: utf8(manifest) },
			{ name: 'content.xml', data: utf8(content) },
			{ name: 'settings.xml', data: utf8(settings) }
		]);
	}
	// `numeric` is one boolean per column: a column of identities or words is never a float, even
	// when one of its cells happens to read 12.
	function ods(heads, rows, sheetName, numeric) {
		return odsBook([{ name: sheetName, heads: heads, rows: rows, numeric: numeric }]);
	}

	// ---- XLSX --------------------------------------------------------------------------------
	// Office Open XML, by hand, STORED like the ODS. Text is written inline (t="inlineStr"), so there
	// is no shared-string part to keep in step. Style 0 is plain, 1 the heading (bold, wrapped,
	// centred), and 2+d a number shown with d decimals.
	function xlsxSheet(sh, first) {
		var widths = colWidths(sh.heads, sh.rows), lines = 1, cols = '', data = '', decs = {}, fc = sh.heads.length > 1 ? 1 : 0, pane;
		widths.forEach(function (w, i) {
			cols += '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + (w + 1).toFixed(2) + '" customWidth="1"/>';
			lines = Math.max(lines, headLines(sh.heads[i], w));
		});
		data = '<row r="1" ht="' + (15 * lines) + '" customHeight="1">' + sh.heads.map(function (h, i) {
			return '<c r="' + colLetter(i) + '1" s="1" t="inlineStr"><is><t xml:space="preserve">' + xmlText(h) + '</t></is></c>';
		}).join('') + '</row>';
		sh.rows.forEach(function (r, ri) {
			data += '<row r="' + (ri + 2) + '">' + sh.heads.map(function (h, i) {
				var v = r[i], t = v === undefined || v === null ? '' : String(v), ref = colLetter(i) + (ri + 2), nm;
				if (t === '') { return ''; }
				nm = numberCell(t, sh.numeric[i]);
				if (nm) { return '<c r="' + ref + '" s="' + (nm.general ? 0 : 2 + nm.dec) + '"><v>' + t + '</v></c>'; }
				return '<c r="' + ref + '" t="inlineStr"><is><t xml:space="preserve">' + xmlText(t) + '</t></is></c>';
			}).join('') + '</row>';
		});
		// A pane freezing the heading row and, with more than one column, the ID column.
		pane = fc
			? '<pane xSplit="1" ySplit="1" topLeftCell="B2" activePane="bottomRight" state="frozen"/>' +
				'<selection pane="topRight" activeCell="B1" sqref="B1"/><selection pane="bottomLeft" activeCell="A2" sqref="A2"/>' +
				'<selection pane="bottomRight" activeCell="B2" sqref="B2"/>'
			: '<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A2" sqref="A2"/>';
		return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
			'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
			'<sheetViews><sheetView workbookViewId="0"' + (first ? ' tabSelected="1"' : '') + '>' + pane + '</sheetView></sheetViews>' +
			'<sheetFormatPr defaultRowHeight="15"/><cols>' + cols + '</cols><sheetData>' + data + '</sheetData></worksheet>';
	}
	function xlsxStyles() {
		var xfs = '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
			'<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1">' +
			'<alignment horizontal="center" vertical="center" wrapText="1"/></xf>', fmts = '', d;
		for (d = 0; d <= 15; d++) {
			fmts += '<numFmt numFmtId="' + (164 + d) + '" formatCode="' + (d ? '0.' + new Array(d + 1).join('0') : '0') + '"/>';
			xfs += '<xf numFmtId="' + (164 + d) + '" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>';
		}
		return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
			'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
			'<numFmts count="16">' + fmts + '</numFmts>' +
			'<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>' +
			'<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>' +
			'<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
			'<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
			'<cellXfs count="18">' + xfs + '</cellXfs>' +
			'<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
	}
	function xlsxBook(sheetsIn) {
		var sheets = sheetsIn.map(normSheet), names = sheetNames(sheets.map(function (x) { return x.name; })),
			head = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n',
			RN = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
			files = [], types, wb, rels = '';
		types = head + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
			'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
			'<Default Extension="xml" ContentType="application/xml"/>' +
			'<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
			'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
			sheets.map(function (x, i) {
				return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
			}).join('') + '</Types>';
		wb = head + '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="' + RN + '"><sheets>' +
			names.map(function (n, i) {
				return '<sheet name="' + xmlText(n) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>';
			}).join('') + '</sheets></workbook>';
		sheets.forEach(function (x, i) {
			rels += '<Relationship Id="rId' + (i + 1) + '" Type="' + RN + '/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>';
		});
		rels += '<Relationship Id="rId' + (sheets.length + 1) + '" Type="' + RN + '/styles" Target="styles.xml"/>';
		files.push({ name: '[Content_Types].xml', data: utf8(types) });
		files.push({ name: '_rels/.rels', data: utf8(head + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
			'<Relationship Id="rId1" Type="' + RN + '/officeDocument" Target="xl/workbook.xml"/></Relationships>') });
		files.push({ name: 'xl/workbook.xml', data: utf8(wb) });
		files.push({ name: 'xl/_rels/workbook.xml.rels', data: utf8(head + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + rels + '</Relationships>') });
		files.push({ name: 'xl/styles.xml', data: utf8(xlsxStyles()) });
		sheets.forEach(function (x, i) { files.push({ name: 'xl/worksheets/sheet' + (i + 1) + '.xml', data: utf8(xlsxSheet(x, i === 0)) }); });
		return zipStore(files);
	}
	function xlsx(heads, rows, sheetName, numeric) {
		return xlsxBook([{ name: sheetName, heads: heads, rows: rows, numeric: numeric }]);
	}

	EngCalcs.lpnTableTsv = tsv;
	EngCalcs.lpnTableCsv = csv;
	EngCalcs.lpnTableOds = ods;
	EngCalcs.lpnTableOdsBook = odsBook;
	EngCalcs.lpnTableXlsx = xlsx;
	EngCalcs.lpnTableXlsxBook = xlsxBook;
	EngCalcs.lpnTableSheetNames = sheetNames;
	EngCalcs.lpnTableColWidths = colWidths;
	EngCalcs.lpnZipStore = zipStore;
	EngCalcs.lpnCrc32 = crc32;
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
