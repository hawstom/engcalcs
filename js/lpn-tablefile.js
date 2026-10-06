// lpn-tablefile.js -- a table of text cells as a file: tab-separated text for the clipboard, CSV
// and ODS for a download. Pure: strings in, a string or bytes out. No DOM, no strings of its own.
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

	// ---- ODS ---------------------------------------------------------------------------------
	var NUMBER = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;
	function xmlText(s) {
		// Characters XML 1.0 forbids are dropped; the five markup characters are escaped.
		return String(s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, '')
			.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}
	// ODF collapses runs of spaces; text:s spells them out so a name with two spaces keeps both.
	function paragraph(s) {
		return '<text:p>' + xmlText(s).replace(/\t/g, '<text:tab/>').replace(/\r?\n/g, '<text:line-break/>')
			.replace(/ {2,}/g, function (m) { return ' <text:s text:c="' + (m.length - 1) + '"/>'; })
			.replace(/^ /, '<text:s/>') + '</text:p>';
	}
	function odsCell(text, isNum, head) {
		var s = text === undefined || text === null ? '' : String(text), st = head ? ' table:style-name="ceh"' : '';
		if (s === '') { return '<table:table-cell' + st + '/>'; }
		if (isNum && !head && NUMBER.test(s)) {
			return '<table:table-cell office:value-type="float" office:value="' + s + '">' + paragraph(s) + '</table:table-cell>';
		}
		return '<table:table-cell' + st + ' office:value-type="string">' + paragraph(s) + '</table:table-cell>';
	}
	// `numeric` is one boolean per column: a column of identities or words is never a float, even
	// when one of its cells happens to read 12.
	function ods(heads, rows, sheetName, numeric) {
		var NS = 'xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" ' +
			'xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" ' +
			'xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" ' +
			'xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" ' +
			'xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"',
			sheet = String(sheetName || 'Table').replace(/[\[\]*?:\/\\]/g, ' ').slice(0, 31) || 'Table',
			body = '<table:table-row>' + heads.map(function (h) { return odsCell(h, false, true); }).join('') + '</table:table-row>',
			content, manifest, mime = 'application/vnd.oasis.opendocument.spreadsheet';
		rows.forEach(function (r) {
			body += '<table:table-row>' + r.map(function (t, i) { return odsCell(t, numeric && numeric[i], false); }).join('') + '</table:table-row>';
		});
		content = '<?xml version="1.0" encoding="UTF-8"?>\n<office:document-content ' + NS + ' office:version="1.2">' +
			'<office:automatic-styles><style:style style:name="ceh" style:family="table-cell">' +
			'<style:text-properties fo:font-weight="bold"/></style:style></office:automatic-styles>' +
			'<office:body><office:spreadsheet><table:table table:name="' + xmlText(sheet) + '">' + body +
			'</table:table></office:spreadsheet></office:body></office:document-content>';
		manifest = '<?xml version="1.0" encoding="UTF-8"?>\n<manifest:manifest ' +
			'xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2">' +
			'<manifest:file-entry manifest:full-path="/" manifest:version="1.2" manifest:media-type="' + mime + '"/>' +
			'<manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/></manifest:manifest>';
		return zipStore([
			{ name: 'mimetype', data: utf8(mime) },
			{ name: 'META-INF/manifest.xml', data: utf8(manifest) },
			{ name: 'content.xml', data: utf8(content) }
		]);
	}

	EngCalcs.lpnTableTsv = tsv;
	EngCalcs.lpnTableCsv = csv;
	EngCalcs.lpnTableOds = ods;
	EngCalcs.lpnZipStore = zipStore;
	EngCalcs.lpnCrc32 = crc32;
}());

if (typeof module !== 'undefined' && module.exports) {
	module.exports = EngCalcs;
}
