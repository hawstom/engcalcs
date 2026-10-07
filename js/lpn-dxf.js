// Looped Pipe Network -- WRITING A DXF FILE OF THE MODEL (ROADMAP Task 772).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
//
// WHAT THIS IS FOR: DATA, NOT A DRAWING. Tom's DXF Interface Manager specification
// (dev/dxf-interface.md, 2026-10-07): *"Scope: data only, no annotation"*; *"AutoCAD objects:
// polylines, points (nodes), and attributed block inserts only."* And on the first cut's browser
// pass: *"There should not be annotation other than the attributed blocks."* So every link is an
// LWPOLYLINE, every element is an attributed block insert (a link's block at mid-run), and the one
// thing that is not the model -- the read-me -- is itself an attributed block. No TEXT, no MTEXT,
// no LINE. The labels a CAD user sees are the blocks' own attributes (Tom, 2026-10-07: *"I would
// like labeling to be a mere consequence of the decision to transfer data by attributed blocks."*).
//
// **NO MLEADER.** Tom allowed annotation only as MULTILEADER (*"make them all MLEADER"*) and
// expected most people to use the file for geometry transfer. MULTILEADER is an AutoCAD 2008
// entity: it is in the AutoCAD 2008 DXF Reference and not in the AutoCAD 2000 one this R2000 file
// follows, and it needs an MLEADERSTYLE object and a context-data block besides. Free annotation is
// dropped instead, which his note allows.
//
// **ASCII DXF R2000 (AC1015)**, the oldest version with LWPOLYLINE (Mary, 2026-10-06), structured
// per the Autodesk DXF Reference for AutoCAD 2000 and ezdxf's "minimal DXF content" for R2000 and
// later: HEADER with $ACADVER and $HANDSEED; CLASSES; TABLES with VPORT, LTYPE (ByBlock, ByLayer,
// Continuous), LAYER, STYLE (Standard), VIEW, UCS, APPID (ACAD), DIMSTYLE (Standard) and
// BLOCK_RECORD; BLOCKS; ENTITIES; OBJECTS with the root dictionary. Every object carries a handle
// (group 5, or 105 on DIMSTYLE) and an owner (group 330).
//
// **NO XDATA** (Tom: invisible to users). Identity rides in the visible ID attribute.
//
// **ALL CAPS** (Tom, 2026-10-07: *"ALL CAPS in AutoCAD."*): every layer name, block name, attribute
// tag, prompt and read-me line this file composes is upper case. An attribute VALUE is the user's
// own data and goes out verbatim (dev/dxf-interface.md: *"values ... are imported verbatim"*).
//
// **THIS FILE KNOWS NOTHING ABOUT THE PAGE.** The caller hands it coordinates already in drawing
// units and strings already formatted. No DOM, no EngCalcs.pageConfig, so
// dev/lpn-spike/dxf-export-harness.js can drive it directly.

(function (root) {
	'use strict';

	var EngCalcs = root.EngCalcs = root.EngCalcs || {};

	// ---- THE LAYERS --------------------------------------------------------------------------------
	// dev/dxf-interface.md: *"EPANET++ imports all legal objects on layers with a specified prefix
	// like C-WATR-MODL-. Everything after this prefix is used to specify asset and alternative
	// according to the asset prefixes in the destination project like J___-BASE for a junction on
	// (geometry) alternative Base"*. So a layer is PREFIX + ASSET CODE + "-" + ALTERNATIVE:
	// C-WATR-MODL-J___-BASE. Tom, on the browser pass: *"let's attempt to make the layers prefix
	// somewhat unique in the DWG with C-WATR-MODL-"*; the DXF Interface Manager will let a user
	// change it, so it is this ONE constant, and a caller's `layerPrefix` replaces it.
	var MODEL_PREFIX = 'C-WATR-MODL-';
	// The ASSET CODE is the project's own ID prefix for that type, upper case, letters and digits
	// only (a hyphen would split the code from the alternative), padded with underscores to four
	// characters as Tom's "J___" is. These are the built-in prefixes (settings.idPrefixes in
	// js/looped-network.js), used where the project's are empty or two types would share a code.
	var TYPE_KEY = { junction: 'J', reservoir: 'R', tank: 'T', pipe: 'L', pump: 'P', valve: 'V', customer: 'M' };
	var DEFAULT_PREFIX = { J: 'J', R: 'R', T: 'T', L: 'L', P: 'P', V: 'V', M: 'C' };
	// Layer order and ACI colours (1-9 only, so every program shows the same colour).
	var TYPES = [
		{ type: 'pipe', color: 5 }, { type: 'pump', color: 6 }, { type: 'valve', color: 1 },
		{ type: 'junction', color: 4 }, { type: 'tank', color: 3 }, { type: 'reservoir', color: 3 },
		{ type: 'customer', color: 8 }
	];
	// **THE READ-ME IS OUTSIDE THE MODEL PREFIX**, so an import of C-WATR-MODL-* never reads it as an
	// asset. White (ACI 7; Tom: *"Make the README layer white."*) and not plotted.
	var README_LAYER = 'C-WATR-RDME';
	function codeOf(prefix) {
		var c = String(prefix || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
		return c ? (c + '____').slice(0, 4) : '';
	}
	/** settings.idPrefixes -> { junction: 'J___', ... }, the built-in set if any is empty or shared. */
	function assetCodes(idPrefixes) {
		var out = {}, seen = {}, clash = false;
		Object.keys(TYPE_KEY).forEach(function (t) {
			var c = codeOf((idPrefixes || {})[TYPE_KEY[t]]);
			if (!c || seen[c]) { clash = true; }
			seen[c] = true; out[t] = c;
		});
		if (clash) {
			Object.keys(TYPE_KEY).forEach(function (t) { out[t] = codeOf(DEFAULT_PREFIX[TYPE_KEY[t]]); });
		}
		return out;
	}
	/**
	 * An alternative's name as the part of a layer name after the asset code: capitals in the
	 * page's locale, letters and digits of ANY script kept (pre-review 2026-10-07: "Пожар" fell back
	 * to BASE and "Débit max" became D_BIT_MAX), every run of anything else one underscore. A
	 * character Windows-1252 lacks reaches the file as \U+XXXX through str(), like every string:
	 * ezdxf's "DXF File Encoding" gives that schema for R2000-R2004 files and says the R2000
	 * extended symbol names take it; AutoCAD's EXTNAMES = 1 (the AutoCAD 2000 rules) allows a name
	 * up to 255 characters with "any special characters not used by Microsoft Windows and AutoCAD
	 * for other purposes". Returns '' when nothing is left; the caller chooses then, never BASE.
	 */
	function alternativeCode(name, locale) {
		return caps(name, locale).replace(/[^\p{L}\p{N}_]+/gu, '_').replace(/^_+|_+$/g, '');
	}
	var BLOCK_OF = {
		junction: 'WATR_JUNCTION', reservoir: 'WATR_RESERVOIR', tank: 'WATR_TANK',
		pipe: 'WATR_PIPE', pump: 'WATR_PUMP', valve: 'WATR_VALVE', customer: 'WATR_CUSTOMER',
		readme: 'WATR_README'
	};
	// Each block's geometry, in block units, where ONE BLOCK UNIT IS ONE ATTRIBUTE HEIGHT (Tom,
	// 2026-10-07: *"My specification for attribute height is 1 so that user can scale the blocks to
	// their standards."*). A junction is 1 across; the other shapes keep the map's proportions
	// (SYMBOL_SILHOUETTE in js/looped-network.js): an inverted triangle for a reservoir, a square 3
	// junctions across for a tank, a bow tie for a valve, a circle with a discharge for a pump.
	// Outlines only, on layer 0, colour ByLayer, so each INSERT takes its own layer's colour.
	var SHAPES = {
		junction: [{ circle: 0.5 }],
		reservoir: [{ poly: [[-1.4, 0.9], [1.4, 0.9], [0, -1.5]], closed: true }],
		tank: [{ poly: [[-1.5, -1.5], [1.5, -1.5], [1.5, 1.5], [-1.5, 1.5]], closed: true }],
		pump: [{ circle: 0.75 }, { poly: [[0, 0.75], [1.25, 0.75], [1.25, 0.25], [0.66, 0.25]] }],
		valve: [{ poly: [[-1, -0.75], [-1, 0.75], [1, -0.75], [1, 0.75]], closed: true }],
		customer: [{ circle: 0.35 }],
		// A pipe's data carrier: a POINT at mid-run, which a cursor can snap to.
		pipe: [{ point: true }],
		readme: []
	};
	// The ID is the one VISIBLE attribute of an element (Tom, 2026-10-06); every other one is
	// invisible until ATTDISP ON. Every line of the read-me is visible.
	var VISIBLE_TAG = 'ID';
	// Capitals in the page's locale, so Turkish "derinliği" is DERİNLİĞİ, not DERINLIĞI.
	var LOCALE = '';
	function caps(v, locale) {
		var s = String(v === undefined || v === null ? '' : v), loc = locale || LOCALE;
		if (loc) { try { return s.toLocaleUpperCase(loc); } catch (e) { /* an unknown tag: plain */ } }
		return s.toUpperCase();
	}
	// A layer or block NAME: upper case, the characters the DXF Reference forbids in a
	// symbol-table name (< > / \ " : ; ? * | = `) made underscores, then the one escape. In that
	// order, so the backslash of a \U+XXXX escape survives.
	function tableName(v) {
		return str(caps(v).replace(/[<>\/\\":;?*|=`]/g, '_'));
	}
	// **PLAIN ASCII QUOTES** in what this file composes (Tom: *"Don't use fancy quotes in the
	// README."*): a translation's typographic quotes become ' and ".
	function plainQuotes(v) {
		return String(v).replace(/[‘’‚′]/g, "'").replace(/[“”„«»″]/g, '"');
	}

	// ---- VALUES -------------------------------------------------------------------------------------
	// A number goes out as JavaScript's shortest round-trip form, so a reader parsing it gets the
	// same double back: an XY project's coordinates land EXACTLY. `E` rather than `e` is the
	// spelling AutoCAD itself writes.
	function num(v) {
		var n = +v;
		if (!isFinite(n)) { return '0.0'; }
		if (n === 0) { return '0.0'; }
		var s = String(n);
		if (s.indexOf('e') >= 0) { return s.replace('e', 'E'); }
		return s.indexOf('.') < 0 ? s + '.0' : s;
	}
	// **THE ONE ESCAPE, AND EVERY STRING IN THE FILE GOES THROUGH IT** -- TEXT, ATTRIB and ATTDEF
	// values, prompts, tags, names. The DXF Reference's rules for a group-1 string, plus the
	// sequences AutoCAD itself interprets inside one:
	//   - the file is ANSI_1252 ($DWGCODEPAGE), as AutoCAD 2000 writes it: a character Windows-1252
	//     holds goes out as its one byte, any other as \U+XXXX. The result is a BYTE string (every
	//     char 0-255); lpnDxfBytes() turns it into the file.
	//   - a character outside the Basic Multilingual Plane has no \U+ form (four hex digits), so it
	//     becomes '?' rather than two escaped surrogate halves.
	//   - a CARET introduces a control character (^J, ^I...), so a literal caret is written "^ ".
	//     A control character itself is written in that caret form, never raw.
	//   - a BACKSLASH would let a user's own "\U+0041" or "\P" be decoded, so every literal
	//     backslash is written as \U+005C, which decodes to a backslash and nothing more.
	//   - "%%" introduces %%u, %%o, %%d...: where a string holds "%%", every percent sign in it is
	//     written %%%, AutoCAD's literal percent, so it reads exactly as typed.
	//   - LIMIT_CHARS: the Reference limits these strings to 2049 characters. A longer value is cut,
	//     between whole escapes, and ends in "..." (three ASCII periods, not the one-character
	//     ellipsis: plain ASCII in a file written for another program); tooLong() lets the caller
	//     say so.
	var LIMIT_CHARS = 2049, ELLIPSIS = '...';
	var CP1252 = { 0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85, 0x2020: 0x86,
		0x2021: 0x87, 0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A, 0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E,
		0x2018: 0x91, 0x2019: 0x92, 0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
		0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C, 0x017E: 0x9E, 0x0178: 0x9F };
	function escapeParts(v) {
		var s = String(v === undefined || v === null ? '' : v), parts = [], i, c, d,
			pct = s.indexOf('%%') >= 0 ? '%%%' : '%';
		for (i = 0; i < s.length; i++) {
			c = s.charCodeAt(i);
			if (c >= 0xD800 && c <= 0xDBFF && i + 1 < s.length) {
				d = s.charCodeAt(i + 1);
				if (d >= 0xDC00 && d <= 0xDFFF) { i++; parts.push('?'); continue; }
			}
			if (c >= 0xD800 && c <= 0xDFFF) { parts.push('?'); continue; }   // a lone surrogate
			if (c < 32) { parts.push('^' + String.fromCharCode(c + 64)); continue; }
			if (c === 0x5E) { parts.push('^ '); continue; }
			if (c === 0x5C) { parts.push('\\U+005C'); continue; }
			if (c === 0x25) { parts.push(pct); continue; }
			if (c < 127) { parts.push(s.charAt(i)); continue; }
			if (c >= 0xA0 && c <= 0xFF) { parts.push(String.fromCharCode(c)); continue; }
			if (CP1252[c]) { parts.push(String.fromCharCode(CP1252[c])); continue; }
			parts.push('\\U+' + ('0000' + c.toString(16).toUpperCase()).slice(-4));
		}
		return parts;
	}
	function str(v) {
		var parts = escapeParts(v), out = '', i;
		if (parts.join('').length <= LIMIT_CHARS) { return parts.join(''); }
		for (i = 0; i < parts.length && out.length + parts[i].length <= LIMIT_CHARS - ELLIPSIS.length; i++) { out += parts[i]; }
		return out + ELLIPSIS;
	}
	function tooLong(v) { return escapeParts(v).join('').length > LIMIT_CHARS; }
	function bytes(text) {
		var b = new Uint8Array(text.length), i;
		for (i = 0; i < text.length; i++) { b[i] = text.charCodeAt(i) & 0xFF; }
		return b;
	}
	// An attribute TAG: upper case, and no spaces or exclamation points, which AutoCAD's ATTDEF
	// refuses in a tag (dev/dxf-interface.md: *"spaces can be replaced with underscores or
	// hyphens"*; underscores are used).
	function tagName(v, locale) { return caps(v, locale).trim().replace(/\s+/g, '_').replace(/!/g, ''); }

	// ---- THE WRITER ---------------------------------------------------------------------------------
	function Writer() { this.lines = []; this.next = 0x20; }
	Writer.prototype.g = function (code, value) {
		var c = String(code);
		this.lines.push(('   ' + c).slice(-Math.max(3, c.length)), String(value));
		return this;
	};
	Writer.prototype.handle = function () { var h = (this.next++).toString(16).toUpperCase(); return h; };
	Writer.prototype.text = function () { return this.lines.join('\r\n') + '\r\n'; };

	/**
	 * model = {
	 *   insunits, measurement (0 imperial, 1 metric),
	 *   layerPrefix: replaces MODEL_PREFIX ('C-WATR-MODL-'),
	 *   codes: { junction: 'J___', ... } (assetCodes()), alternative: 'BASE',
	 *   locale: the page's language, for capitals ('tr' upper-cases i as İ),
	 *   idTags: { junction: 'ID', ... } -- each block's ID tag, which is its VISIBLE attribute. By
	 *     property, not by text: a translated label is not "ID" (pre-review 2026-10-07: in ar, fa,
	 *     he, km, sw and am every attribute came out invisible).
	 *   nodes:     [{ id, type, x, y, attrs: [{ tag, value }] }],
	 *   links:     [{ id, type, pts: [{x, y}...], attrs }]    -- each gets its block at mid-run
	 *   customers: [{ id, x, y, from: {x, y} | null, attrs }]
	 *   readme:    [ 'line', ... ]  -- one visible attribute each, in a block on README_LAYER
	 *   prompts:   { TAG or 'type.TAG': 'prompt shown in Edit Attributes' }
	 *   tags:      { junction: [TAG...], ... }  -- the ATTDEFs each block carries, in order
	 * }
	 * Returns the DXF text.
	 */
	function writeDxf(model) {
		LOCALE = model.locale || '';
		var w = new Writer(), pfx = model.layerPrefix === undefined ? MODEL_PREFIX : model.layerPrefix,
			codes = model.codes || assetCodes(null), alt = alternativeCode(model.alternative) || 'BASE',
			idTags = model.idTags || {},
			ext = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity },
			H = {}, blockRec = {}, blockTypes = [], tags = {}, i,
			readme = (model.readme || []).map(function (s) { return caps(plainQuotes(s)); });
		function layerOf(type) { return tableName(pfx + (codes[type] || codeOf(DEFAULT_PREFIX[TYPE_KEY[type]])) + '-' + alt); }
		Object.keys(BLOCK_OF).forEach(function (t) {
			tags[t] = ((model.tags && model.tags[t]) || []).map(function (x) { return tagName(x); });
		});
		tags.readme = readme.map(function (s, k) { return 'NOTE_' + (k + 1); });
		function grow(x, y) {
			if (!isFinite(x) || !isFinite(y)) { return; }
			if (x < ext.x0) { ext.x0 = x; } if (x > ext.x1) { ext.x1 = x; }
			if (y < ext.y0) { ext.y0 = y; } if (y > ext.y1) { ext.y1 = y; }
		}
		(model.nodes || []).forEach(function (n) { grow(n.x, n.y); });
		(model.links || []).forEach(function (l) { (l.pts || []).forEach(function (p) { grow(p.x, p.y); }); });
		(model.customers || []).forEach(function (c) { grow(c.x, c.y); });
		if (!isFinite(ext.x0)) { ext = { x0: 0, y0: 0, x1: 1, y1: 1 }; }
		// The read-me sits above the top-left of the network, its first line 3 units up.
		var readmeAt = { x: ext.x0, y: ext.y1 + 3 + 1.5 * readme.length };
		if (readme.length) { grow(readmeAt.x, readmeAt.y + 1); }
		ext.x0 -= 2; ext.y0 -= 2; ext.x1 += 2; ext.y1 += 2;

		// Handles are fixed for the structural objects, then counted up for everything else.
		['vportT', 'ltypeT', 'layerT', 'styleT', 'viewT', 'ucsT', 'appidT', 'dimT', 'brT',
			'ltByBlock', 'ltByLayer', 'ltCont', 'layer0', 'style', 'appAcad', 'dimStd', 'vpActive',
			'brModel', 'brPaper', 'blkModel', 'endModel', 'blkPaper', 'endPaper',
			'dictRoot', 'dictGroup', 'dictLayout', 'dictPsn', 'psnNormal', 'layoutModel', 'layoutPaper',
			'layerReadme'
		].forEach(function (k) { H[k] = w.handle(); });
		var hasCustomers = !!(model.customers || []).length;
		var layerTypes = TYPES.filter(function (T) { return T.type !== 'customer' || hasCustomers; });
		layerTypes.forEach(function (T) { H['layer:' + T.type] = w.handle(); });
		Object.keys(BLOCK_OF).forEach(function (t) {
			if (t === 'customer' && !hasCustomers) { return; }
			if (t === 'readme' && !readme.length) { return; }
			blockTypes.push(t);
			blockRec[t] = { rec: w.handle(), begin: w.handle(), end: w.handle() };
		});

		var body = new Writer();
		body.next = w.next;
		function entity(type, layer, owner) {
			var h = body.handle();
			body.g(0, type).g(5, h).g(330, owner || H.brModel).g(100, 'AcDbEntity').g(8, layer);
			return h;
		}
		function lwpoly(pts, layer) {
			entity('LWPOLYLINE', layer);
			body.g(100, 'AcDbPolyline').g(90, pts.length).g(70, 0);
			pts.forEach(function (p) { body.g(10, num(p.x)).g(20, num(p.y)); });
		}
		// An attribute's place in the block, in block units: stacked to the right of the symbol,
		// 1.5 apart, so ATTDISP ON shows a readable column. The read-me's lines stack under its
		// insertion point.
		function attrOffset(k, type) {
			if (type === 'readme') { return { x: 0, y: -k * 1.5 }; }
			var r = type === 'tank' ? 1.5 : (type === 'reservoir' ? 1.4 : (type === 'pump' || type === 'valve' ? 1 : (type === 'pipe' ? 0.25 : 0.5)));
			return { x: r + 0.25, y: -k * 1.5 };
		}
		function visible(type, tag) { return type === 'readme' || tag === tagName(idTags[type] || VISIBLE_TAG); }
		// INSERT scale 1: an attribute is 1 high in the block and so 1 high in the drawing, and
		// scaling the insertion is how a CAD user brings it to the height they plot at.
		function insert(type, x, y, rot, values, layer) {
			var tg = tags[type] || [], ins, c, s, k;
			ins = entity('INSERT', layer);
			body.g(100, 'AcDbBlockReference');
			if (tg.length) { body.g(66, 1); }
			body.g(2, BLOCK_OF[type]).g(10, num(x)).g(20, num(y)).g(30, '0.0')
				.g(41, '1.0').g(42, '1.0').g(43, '1.0');
			if (rot) { body.g(50, num(rot)); }
			if (!tg.length) { return; }
			c = Math.cos((rot || 0) * Math.PI / 180); s = Math.sin((rot || 0) * Math.PI / 180);
			// **TEXT READS UPRIGHT.** A pump or valve on a link drawn right to left is inserted at
			// 90-270 degrees; its attributes turn a half circle and are right- and top-justified on the
			// same point (72 = 2 with the alignment point 11, DXF Reference TEXT; 74 = 3 below), so they cover the
			// same place, reading left to right. The symbol itself keeps the link's direction.
			var r = (((rot || 0) % 360) + 360) % 360, flip = r > 90 && r < 270;
			for (k = 0; k < tg.length; k++) {
				var o = attrOffset(k, type), v = values[tg[k]];
				// An ATTRIB is stored in the drawing's own coordinates, already through the INSERT,
				// and on the INSERT's layer: its ATTDEF is on layer 0, which AutoCAD resolves to the
				// insert's layer, so freezing an element's layer hides its attributes with it.
				entity('ATTRIB', layer, ins);
				var ax = x + o.x * c - o.y * s, ay = y + o.x * s + o.y * c;
				body.g(100, 'AcDbText').g(10, num(ax)).g(20, num(ay)).g(30, '0.0')
					.g(40, '1.0').g(1, str(v === undefined || v === null ? '' : v));
				if (flip) { body.g(50, num(r - 180)).g(72, 2).g(11, num(ax)).g(21, num(ay)).g(31, '0.0'); } else if (rot) { body.g(50, num(rot)); }
				// Flag 1 = invisible.
				body.g(100, 'AcDbAttribute').g(2, str(tg[k])).g(70, visible(type, tg[k]) ? 0 : 1);
				// Top-justified (ATTRIB 74 = 3, TEXT's 73) so the turned text hangs on the side of
				// the line the upright text stood on.
				if (flip) { body.g(74, 3); }
			}
			var seq = body.handle();
			body.g(0, 'SEQEND').g(5, seq).g(330, ins).g(100, 'AcDbEntity').g(8, layer);
		}
		function valuesOf(type, attrs) {
			var out = {};
			(attrs || []).forEach(function (a) { out[tagName(a.tag)] = a.value; });
			return out;
		}

		function writeBlocks(w) {
			function blockBegin(name, h, owner, flags) {
				w.g(0, 'BLOCK').g(5, h).g(330, owner).g(100, 'AcDbEntity').g(8, '0')
					.g(100, 'AcDbBlockBegin').g(2, name).g(70, flags).g(10, '0.0').g(20, '0.0').g(30, '0.0')
					.g(3, name).g(1, '');
			}
			function blockEnd(h, owner) {
				w.g(0, 'ENDBLK').g(5, h).g(330, owner).g(100, 'AcDbEntity').g(8, '0').g(100, 'AcDbBlockEnd');
			}
			blockBegin('*Model_Space', H.blkModel, H.brModel, 0); blockEnd(H.endModel, H.brModel);
			blockBegin('*Paper_Space', H.blkPaper, H.brPaper, 0); blockEnd(H.endPaper, H.brPaper);
			blockTypes.forEach(function (t) {
				var br = blockRec[t], tg = tags[t] || [];
				blockBegin(BLOCK_OF[t], br.begin, br.rec, tg.length ? 2 : 0);
				SHAPES[t].forEach(function (sh) {
					var hh = w.handle();
					if (sh.point) {
						w.g(0, 'POINT').g(5, hh).g(330, br.rec).g(100, 'AcDbEntity').g(8, '0')
							.g(100, 'AcDbPoint').g(10, '0.0').g(20, '0.0').g(30, '0.0');
					} else if (sh.circle) {
						w.g(0, 'CIRCLE').g(5, hh).g(330, br.rec).g(100, 'AcDbEntity').g(8, '0')
							.g(100, 'AcDbCircle').g(10, '0.0').g(20, '0.0').g(30, '0.0').g(40, num(sh.circle));
					} else {
						w.g(0, 'LWPOLYLINE').g(5, hh).g(330, br.rec).g(100, 'AcDbEntity').g(8, '0')
							.g(100, 'AcDbPolyline').g(90, sh.poly.length).g(70, sh.closed ? 1 : 0);
						sh.poly.forEach(function (p) { w.g(10, num(p[0])).g(20, num(p[1])); });
					}
				});
				tg.forEach(function (tag, k) {
					var o = attrOffset(k, t), hh = w.handle(), raw = ((model.tags && model.tags[t]) || [])[k],
						prompt = t === 'readme' ? tag.replace('_', ' ')
							: ((model.prompts && (model.prompts[t + '.' + raw] || model.prompts[raw])) || tag);
					w.g(0, 'ATTDEF').g(5, hh).g(330, br.rec).g(100, 'AcDbEntity').g(8, '0')
						.g(100, 'AcDbText').g(10, num(o.x)).g(20, num(o.y)).g(30, '0.0')
						.g(40, '1.0').g(1, '')
						.g(100, 'AcDbAttributeDefinition')
						.g(3, str(caps(plainQuotes(prompt)))).g(2, str(tag))
						.g(70, visible(t, tag) ? 0 : 1);
				});
				blockEnd(br.end, br.rec);
			});
		}

		// ---- ENTITIES, built first so the handle seed is known for the header ----
		(model.links || []).forEach(function (l) {
			var lay = layerOf(l.type);
			if (!l.pts || l.pts.length < 2 || !BLOCK_OF[l.type]) { return; }
			lwpoly(l.pts, lay);
			var m = midAlong(l.pts);
			insert(l.type, m.x, m.y, l.type === 'pipe' ? 0 : m.angle, valuesOf(l.type, l.attrs), lay);
		});
		(model.customers || []).forEach(function (c) {
			var lay = layerOf('customer');
			// The service line is geometry, so it is a polyline like any other link.
			if (c.from) { lwpoly([c.from, { x: c.x, y: c.y }], lay); }
			insert('customer', c.x, c.y, 0, valuesOf('customer', c.attrs), lay);
		});
		(model.nodes || []).forEach(function (n) {
			if (!BLOCK_OF[n.type]) { return; }
			insert(n.type, n.x, n.y, 0, valuesOf(n.type, n.attrs), layerOf(n.type));
		});
		if (readme.length) {
			var rv = {};
			readme.forEach(function (s, k) { rv[tags.readme[k]] = s; });
			insert('readme', readmeAt.x, readmeAt.y, 0, rv, README_LAYER);
		}
		// ---- BLOCKS, built next for the same reason ----
		var blk = new Writer();
		blk.next = body.next;
		writeBlocks(blk);
		w.next = blk.next;
		var seed = w.handle();

		// ---- HEADER ----
		w.g(0, 'SECTION').g(2, 'HEADER')
			.g(9, '$ACADVER').g(1, 'AC1015')
			.g(9, '$DWGCODEPAGE').g(3, 'ANSI_1252')
			.g(9, '$INSBASE').g(10, '0.0').g(20, '0.0').g(30, '0.0')
			.g(9, '$EXTMIN').g(10, num(ext.x0)).g(20, num(ext.y0)).g(30, '0.0')
			.g(9, '$EXTMAX').g(10, num(ext.x1)).g(20, num(ext.y1)).g(30, '0.0')
			.g(9, '$LIMMIN').g(10, num(ext.x0)).g(20, num(ext.y0))
			.g(9, '$LIMMAX').g(10, num(ext.x1)).g(20, num(ext.y1))
			.g(9, '$ATTMODE').g(70, 1)
			.g(9, '$TEXTSIZE').g(40, '1.0')
			.g(9, '$TEXTSTYLE').g(7, 'Standard')
			.g(9, '$CLAYER').g(8, '0')
			.g(9, '$LUNITS').g(70, 2)
			.g(9, '$LUPREC').g(70, 4)
			.g(9, '$HANDSEED').g(5, seed)
			.g(9, '$MEASUREMENT').g(70, model.measurement ? 1 : 0)
			.g(9, '$INSUNITS').g(70, model.insunits | 0)
			.g(0, 'ENDSEC');
		w.g(0, 'SECTION').g(2, 'CLASSES').g(0, 'ENDSEC');

		// ---- TABLES ----
		function table(name, h, count) {
			w.g(0, 'TABLE').g(2, name).g(5, h).g(330, 0).g(100, 'AcDbSymbolTable').g(70, count);
		}
		function rec(type, h, owner, sub) {
			w.g(0, type).g(5, h).g(330, owner).g(100, 'AcDbSymbolTableRecord').g(100, sub);
		}
		w.g(0, 'SECTION').g(2, 'TABLES');
		// The view the drawing opens on: the whole network.
		var cx = (ext.x0 + ext.x1) / 2, cy = (ext.y0 + ext.y1) / 2,
			vw = ext.x1 - ext.x0, vh = ext.y1 - ext.y0, aspect = 1.5;
		table('VPORT', H.vportT, 1);
		rec('VPORT', H.vpActive, H.vportT, 'AcDbViewportTableRecord');
		w.g(2, '*Active').g(70, 0).g(10, '0.0').g(20, '0.0').g(11, '1.0').g(21, '1.0')
			.g(12, num(cx)).g(22, num(cy)).g(13, '0.0').g(23, '0.0').g(14, '1.0').g(24, '1.0')
			.g(15, '1.0').g(25, '1.0').g(16, '0.0').g(26, '0.0').g(36, '1.0')
			.g(17, '0.0').g(27, '0.0').g(37, '0.0')
			.g(40, num(Math.max(vh, vw / aspect) * 1.05)).g(41, num(aspect)).g(42, '50.0')
			.g(43, '0.0').g(44, '0.0').g(50, '0.0').g(51, '0.0')
			.g(71, 0).g(72, 1000).g(73, 1).g(74, 3).g(75, 0).g(76, 0).g(77, 0).g(78, 0)
			.g(0, 'ENDTAB');
		table('LTYPE', H.ltypeT, 3);
		[['ltByBlock', 'ByBlock', ''], ['ltByLayer', 'ByLayer', ''], ['ltCont', 'Continuous', 'Solid line']]
			.forEach(function (lt) {
				rec('LTYPE', H[lt[0]], H.ltypeT, 'AcDbLinetypeTableRecord');
				w.g(2, lt[1]).g(70, 0).g(3, lt[2]).g(72, 65).g(73, 0).g(40, '0.0');
			});
		w.g(0, 'ENDTAB');
		table('LAYER', H.layerT, layerTypes.length + 2);
		rec('LAYER', H.layer0, H.layerT, 'AcDbLayerTableRecord');
		w.g(2, '0').g(70, 0).g(62, 7).g(6, 'Continuous').g(370, -3).g(390, H.psnNormal);
		layerTypes.forEach(function (T) {
			rec('LAYER', H['layer:' + T.type], H.layerT, 'AcDbLayerTableRecord');
			w.g(2, layerOf(T.type)).g(70, 0).g(62, T.color).g(6, 'Continuous').g(370, -3).g(390, H.psnNormal);
		});
		// Group 290 = 0: not plotted (the DXF Reference's LAYER plotting flag).
		rec('LAYER', H.layerReadme, H.layerT, 'AcDbLayerTableRecord');
		w.g(2, README_LAYER).g(70, 0).g(62, 7).g(6, 'Continuous').g(290, 0).g(370, -3).g(390, H.psnNormal);
		w.g(0, 'ENDTAB');
		// **STYLE Standard ON txt, THE FONT AUTOCAD ITSELF GIVES IT** (Tom, 2026-10-06: *"Use
		// 'Standard' style."*). Group 3 is the STYLE record's primary font file name (DXF Reference,
		// STYLE). It used to be written empty; AutoCAD drew the text in a substitute and its text
		// editor showed it in Arial (Tom, 2026-10-07: *"When I TEDIT the TEXT objects they
		// temporarily appear as ARIAL, and there is not any ARIAL style in the DWG"*). "txt" is what
		// AutoCAD writes for Standard (ezdxf's R2000 STYLE example shows the same record), so the
		// style resolves to txt.shx in every AutoCAD. 4 (big font) stays empty.
		table('STYLE', H.styleT, 1);
		rec('STYLE', H.style, H.styleT, 'AcDbTextStyleTableRecord');
		w.g(2, 'Standard').g(70, 0).g(40, '0.0').g(41, '1.0').g(50, '0.0').g(71, 0)
			.g(42, '1.0').g(3, 'txt').g(4, '').g(0, 'ENDTAB');
		table('VIEW', H.viewT, 0); w.g(0, 'ENDTAB');
		table('UCS', H.ucsT, 0); w.g(0, 'ENDTAB');
		table('APPID', H.appidT, 1);
		rec('APPID', H.appAcad, H.appidT, 'AcDbRegAppTableRecord');
		w.g(2, 'ACAD').g(70, 0).g(0, 'ENDTAB');
		// DIMSTYLE's table carries a second subclass marker and its record's handle is group 105:
		// both are the DXF Reference's own exceptions, not slips.
		w.g(0, 'TABLE').g(2, 'DIMSTYLE').g(5, H.dimT).g(330, 0).g(100, 'AcDbSymbolTable').g(70, 1)
			.g(100, 'AcDbDimStyleTable');
		w.g(0, 'DIMSTYLE').g(105, H.dimStd).g(330, H.dimT).g(100, 'AcDbSymbolTableRecord')
			.g(100, 'AcDbDimStyleTableRecord').g(2, 'Standard').g(70, 0).g(0, 'ENDTAB');
		table('BLOCK_RECORD', H.brT, 2 + blockTypes.length);
		rec('BLOCK_RECORD', H.brModel, H.brT, 'AcDbBlockTableRecord');
		w.g(2, '*Model_Space').g(340, H.layoutModel);
		rec('BLOCK_RECORD', H.brPaper, H.brT, 'AcDbBlockTableRecord');
		w.g(2, '*Paper_Space').g(340, H.layoutPaper);
		blockTypes.forEach(function (t) {
			rec('BLOCK_RECORD', blockRec[t].rec, H.brT, 'AcDbBlockTableRecord');
			w.g(2, BLOCK_OF[t]).g(340, 0);
		});
		w.g(0, 'ENDTAB').g(0, 'ENDSEC');

		w.g(0, 'SECTION').g(2, 'BLOCKS');
		w.lines = w.lines.concat(blk.lines);
		w.g(0, 'ENDSEC');

		// ---- ENTITIES ----
		w.g(0, 'SECTION').g(2, 'ENTITIES');
		w.lines = w.lines.concat(body.lines);
		w.g(0, 'ENDSEC');

		// ---- OBJECTS: the root dictionary and what AutoCAD 2000 itself writes beside it ----
		// ACAD_GROUP is the one entry the minimal file requires; the two layouts and the plot-style
		// placeholder (which every LAYER's 390 points at) are written too, so nothing is left for
		// AutoCAD to rebuild on open.
		w.g(0, 'SECTION').g(2, 'OBJECTS');
		w.g(0, 'DICTIONARY').g(5, H.dictRoot).g(330, 0).g(100, 'AcDbDictionary').g(281, 1)
			.g(3, 'ACAD_GROUP').g(350, H.dictGroup)
			.g(3, 'ACAD_LAYOUT').g(350, H.dictLayout)
			.g(3, 'ACAD_PLOTSTYLENAME').g(350, H.dictPsn);
		w.g(0, 'DICTIONARY').g(5, H.dictGroup).g(330, H.dictRoot).g(100, 'AcDbDictionary').g(281, 1);
		w.g(0, 'DICTIONARY').g(5, H.dictLayout).g(330, H.dictRoot).g(100, 'AcDbDictionary').g(281, 1)
			.g(3, 'Layout1').g(350, H.layoutPaper).g(3, 'Model').g(350, H.layoutModel);
		w.g(0, 'ACDBDICTIONARYWDFLT').g(5, H.dictPsn).g(330, H.dictRoot).g(100, 'AcDbDictionary').g(281, 1)
			.g(3, 'Normal').g(350, H.psnNormal).g(100, 'AcDbDictionaryWithDefault').g(340, H.psnNormal);
		w.g(0, 'ACDBPLACEHOLDER').g(5, H.psnNormal).g(330, H.dictPsn);
		function layout(h, name, flags, order, br) {
			w.g(0, 'LAYOUT').g(5, h).g(330, H.dictLayout)
				.g(100, 'AcDbPlotSettings').g(1, '').g(4, '').g(6, '')
				.g(40, '0.0').g(41, '0.0').g(42, '0.0').g(43, '0.0').g(44, '0.0').g(45, '0.0')
				.g(46, '0.0').g(47, '0.0').g(48, '0.0').g(49, '0.0').g(140, '0.0').g(141, '0.0')
				.g(142, '1.0').g(143, '1.0').g(70, flags).g(72, 0).g(73, 0).g(74, 5).g(7, '')
				.g(75, 16).g(147, '1.0').g(148, '0.0').g(149, '0.0')
				.g(100, 'AcDbLayout').g(1, name).g(70, 1).g(71, order)
				.g(10, '0.0').g(20, '0.0').g(11, '12.0').g(21, '9.0')
				.g(12, '0.0').g(22, '0.0').g(32, '0.0')
				.g(14, num(ext.x0)).g(24, num(ext.y0)).g(34, '0.0')
				.g(15, num(ext.x1)).g(25, num(ext.y1)).g(35, '0.0')
				.g(146, '0.0').g(13, '0.0').g(23, '0.0').g(33, '0.0')
				.g(16, '1.0').g(26, '0.0').g(36, '0.0').g(17, '0.0').g(27, '1.0').g(37, '0.0')
				.g(76, 0).g(330, br);
		}
		layout(H.layoutModel, 'Model', 1024, 0, H.brModel);
		layout(H.layoutPaper, 'Layout1', 0, 1, H.brPaper);
		w.g(0, 'ENDSEC').g(0, 'EOF');
		return w.text();
	}

	// The point half-way along a polyline, and the direction of the segment it falls on, in
	// degrees counter-clockwise from +X -- where a pump's or a valve's block sits and faces.
	function midAlong(pts) {
		var total = 0, i, seg = [], d, run = 0, t;
		for (i = 0; i + 1 < pts.length; i++) {
			d = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
			seg.push(d); total += d;
		}
		for (i = 0; i < seg.length; i++) {
			if (run + seg[i] >= total / 2 && seg[i] > 0) {
				t = (total / 2 - run) / seg[i];
				return {
					x: pts[i].x + (pts[i + 1].x - pts[i].x) * t,
					y: pts[i].y + (pts[i + 1].y - pts[i].y) * t,
					angle: Math.atan2(pts[i + 1].y - pts[i].y, pts[i + 1].x - pts[i].x) * 180 / Math.PI
				};
			}
			run += seg[i];
		}
		return { x: pts[0].x, y: pts[0].y, angle: 0 };
	}

	// $INSUNITS codes from the DXF Reference's HEADER table (R2000 defines 0-20). US survey feet
	// has no code before AutoCAD 2018, so it is written as feet and the read-me says which foot.
	var INSUNITS = { 'in': 1, 'ft': 2, 'us-ft': 2, 'mi': 3, 'mm': 4, 'cm': 5, 'm': 6, 'km': 7, 'yd': 10 };

	EngCalcs.lpnDxfWrite = writeDxf;
	EngCalcs.lpnDxfModelPrefix = MODEL_PREFIX;
	EngCalcs.lpnDxfReadmeLayer = README_LAYER;
	EngCalcs.lpnDxfAssetCodes = assetCodes;
	EngCalcs.lpnDxfAlternative = alternativeCode;
	EngCalcs.lpnDxfTag = tagName;
	EngCalcs.lpnDxfBlocks = BLOCK_OF;
	EngCalcs.lpnDxfInsUnits = function (u) { return INSUNITS[u] || 0; };
	EngCalcs.lpnDxfMidAlong = midAlong;
	EngCalcs.lpnDxfString = str;
	EngCalcs.lpnDxfTooLong = tooLong;
	EngCalcs.lpnDxfLimit = LIMIT_CHARS;
	EngCalcs.lpnDxfBytes = bytes;
}(typeof window !== 'undefined' ? window : globalThis));
