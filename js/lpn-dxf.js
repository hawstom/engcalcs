// Looped Pipe Network -- WRITING A DXF DRAWING (ROADMAP Task 772).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
//
// WHAT THIS IS FOR. Tom, 2026-10-06: *"Since simplest AutoCAD can't import a shapefile, I suppose it
// would be nice to Export to DXF... We want to do what's stable, venerable, and widely usable."* and
// *"They may be most interested in a dumb annotated network."* So this writes a drawing, not a model:
// layers a CAD user can freeze, pipes as polylines, nodes as attributed blocks, and the map's own
// lettering as text. The rules and the layer table are in dev/dxf.md.
//
// **ASCII DXF R2000 (AC1015)**, the oldest version with LWPOLYLINE (Mary, 2026-10-06), structured
// per the Autodesk DXF Reference for AutoCAD 2000 and ezdxf's "minimal DXF content" for R2000 and
// later: HEADER with $ACADVER and $HANDSEED; CLASSES; TABLES with VPORT, LTYPE (ByBlock, ByLayer,
// Continuous), LAYER ("0"), STYLE (Standard), VIEW, UCS, APPID (ACAD), DIMSTYLE (Standard) and
// BLOCK_RECORD (*Model_Space, *Paper_Space); BLOCKS; ENTITIES; OBJECTS with the root dictionary.
// Every object carries a handle (group 5, or 105 on DIMSTYLE) and an owner (group 330).
//
// **NO XDATA** (Tom: invisible to users). Identity rides in a visible-in-CAD place instead: the ID
// attribute of each node's block.
//
// **THIS FILE KNOWS NOTHING ABOUT THE PAGE.** The caller hands it plain numbers already in drawing
// units -- coordinates, text heights, a symbol size -- and strings already formatted. No DOM, no
// EngCalcs.pageConfig, so dev/lpn-spike/dxf-export-harness.js can drive it directly.

(function (root) {
	'use strict';

	var EngCalcs = root.EngCalcs = root.EngCalcs || {};

	// ---- THE LAYER TABLE ---------------------------------------------------------------------------
	// AIA CAD Layer Guidelines, United States National CAD Standard v5 (the edition its own page
	// footers name; the copy read is the one Duke University hosts). Discipline C (Civil), Major
	// Group WATR (water supply). Its Civil list names C-WATR-PIPE outright. EQPM, VALV, TANK, LABL,
	// TEXT and RDME are prescribed Minor Group codes, used here under the Guidelines' own rule that
	// "any Minor Group may be used to modify any Major Group". NODE is a prescribed code too, but a
	// MAJOR group ("Node", the survey layers' V-NODE); in the minor position it is used with that
	// same meaning. RSVR and CUST are user-defined, which the Guidelines allow when documented, and
	// dev/dxf.md is that document. The Guidelines' own layer for valves is C-WATR-INST
	// ("instrumentation (meters, valves, etc.)"); VALV is used instead because a model's valves are
	// control valves with settings, not instruments, and INST would put them with meters.
	// ACI colours 1-9 only, so every program shows the same colour.
	var LAYERS = [
		{ key: 'pipe', name: 'C-WATR-PIPE', color: 5 },
		{ key: 'pump', name: 'C-WATR-EQPM', color: 6 },
		{ key: 'valve', name: 'C-WATR-VALV', color: 1 },
		{ key: 'junction', name: 'C-WATR-NODE', color: 4 },
		{ key: 'tank', name: 'C-WATR-TANK', color: 3 },
		{ key: 'reservoir', name: 'C-WATR-RSVR', color: 3 },
		{ key: 'customer', name: 'C-WATR-CUST', color: 8 },
		{ key: 'label', name: 'C-WATR-LABL', color: 7 },
		{ key: 'text', name: 'C-WATR-TEXT', color: 7 },
		{ key: 'note', name: 'C-WATR-RDME', color: 8, noPlot: true }
	];
	var BLOCK_OF = {
		junction: 'WATR_JUNCTION', reservoir: 'WATR_RESERVOIR', tank: 'WATR_TANK',
		pipe: 'WATR_PIPE', pump: 'WATR_PUMP', valve: 'WATR_VALVE', customer: 'WATR_CUSTOMER'
	};
	// Each block's geometry, in units of ONE SYMBOL (a junction's diameter on the map), so the
	// INSERT's scale is the symbol size and nothing else. Outlines only: no HATCH, no SOLID, which
	// every reader draws the same way. Shapes follow the map's own (SYMBOL_SILHOUETTE in
	// js/looped-network.js): an inverted triangle for a reservoir, a square for a tank, a bow tie
	// for a valve, a circle with a discharge for a pump. Sizes are the map's: a tank is 3 junction
	// diameters across (TANK_HALF_W / JUNCTION_R).
	var SHAPES = {
		junction: [{ circle: 0.5 }],
		reservoir: [{ poly: [[-1.4, 0.9], [1.4, 0.9], [0, -1.5]], closed: true }],
		tank: [{ poly: [[-1.5, -1.5], [1.5, -1.5], [1.5, 1.5], [-1.5, 1.5]], closed: true }],
		pump: [{ circle: 0.75 }, { poly: [[0, 0.75], [1.25, 0.75], [1.25, 0.25], [0.66, 0.25]] }],
		valve: [{ poly: [[-1, -0.75], [-1, 0.75], [1, -0.75], [1, 0.75]], closed: true }],
		customer: [{ circle: 0.35 }],
		// A pipe's data carrier: a POINT at mid-run, a node a cursor can snap to and a crossing window
		// can pick, and nothing drawn on the sheet beyond a dot.
		pipe: [{ point: true }]
	};

	function layerName(key, prefix) {
		for (var i = 0; i < LAYERS.length; i++) {
			if (LAYERS[i].key === key) { return tableName((prefix || '') + LAYERS[i].name); }
		}
		return '0';
	}
	// A layer or block NAME: the same escape as every other string, then the characters the DXF
	// Reference forbids in a symbol-table name (< > / \ " : ; ? * | = `) made underscores, so a
	// caller's prefix cannot produce a table AutoCAD rejects.
	function tableName(v) {
		return str(v).replace(/\\U\+005C/g, '_').replace(/[<>\/\\":;?*|=`]/g, '_');
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
	//     between whole escapes, and ends in an ellipsis; tooLong() lets the caller say so.
	var LIMIT_CHARS = 2049, ELLIPSIS = String.fromCharCode(0x85);
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
	// `room` (optional) is the characters this value may take, for a caller composing one string
	// out of several (a label row with an underlined value in it).
	function str(v, room) {
		var parts = escapeParts(v), max = room === undefined ? LIMIT_CHARS : room, out = '', i;
		if (parts.join('').length <= max) { return parts.join(''); }
		for (i = 0; i < parts.length && out.length + parts[i].length <= max - 1; i++) { out += parts[i]; }
		return out + ELLIPSIS;
	}
	function tooLong(v) { return escapeParts(v).join('').length > LIMIT_CHARS; }
	function bytes(text) {
		var b = new Uint8Array(text.length), i;
		for (i = 0; i < text.length; i++) { b[i] = text.charCodeAt(i) & 0xFF; }
		return b;
	}
	// A TEXT's content: plain, or a list of segments of which some carry the map's extrema mark
	// (%%u underline, %%o overline), each escaped by str() and the whole held to the limit.
	function textContent(t) {
		if (!t.segs) { return str(t.text); }
		var out = '', i, seg, code, room;
		for (i = 0; i < t.segs.length; i++) {
			seg = t.segs[i];
			code = seg.mark === 'under' ? '%%u' : (seg.mark === 'over' ? '%%o' : '');
			room = LIMIT_CHARS - out.length - 2 * code.length;
			if (room <= 1) { break; }
			out += code + str(seg.text, room) + code;
		}
		return out;
	}

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
	 *   insunits, measurement (0 imperial, 1 metric), layerPrefix,
	 *   symbol: drawing units per map symbol, textHeight: drawing units,
	 *   nodes:     [{ id, type, x, y, attrs: [{ tag, value }] }],
	 *   links:     [{ id, type, pts: [{x, y}...], attrs }]    -- each gets its block at mid-run
	 *   customers: [{ id, x, y, from: {x, y} | null, attrs }]
	 *   texts:     [{ text | segs: [{ text, mark: 'under'|'over'|'' }], x, y, h, rot, halign 0|1|2, valign 0|1|2|3, layer: 'label'|'text'|'note' }]
	 *   lines:     [{ x1, y1, x2, y2, layer }]
	 *   prompts:   { TAG or 'type.TAG': 'prompt shown in Edit Attributes' }
	 *   tags:      { junction: [TAG...], ... }  -- the ATTDEFs each block carries, in order
	 * }
	 * Returns the DXF text.
	 */
	function writeDxf(model) {
		var w = new Writer(), pfx = model.layerPrefix || '', S = +model.symbol || 1,
			th = +model.textHeight || S, ext = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity },
			H = {}, blockRec = {}, blockTypes = [], i;
		function grow(x, y) {
			if (!isFinite(x) || !isFinite(y)) { return; }
			if (x < ext.x0) { ext.x0 = x; } if (x > ext.x1) { ext.x1 = x; }
			if (y < ext.y0) { ext.y0 = y; } if (y > ext.y1) { ext.y1 = y; }
		}
		(model.nodes || []).forEach(function (n) { grow(n.x, n.y); });
		(model.links || []).forEach(function (l) { (l.pts || []).forEach(function (p) { grow(p.x, p.y); }); });
		(model.customers || []).forEach(function (c) { grow(c.x, c.y); });
		(model.texts || []).forEach(function (t) { grow(t.x, t.y); });
		if (!isFinite(ext.x0)) { ext = { x0: 0, y0: 0, x1: 1, y1: 1 }; }
		// Grown by a symbol so the extents hold the blocks drawn at the outermost nodes.
		ext.x0 -= 2 * S; ext.y0 -= 2 * S; ext.x1 += 2 * S; ext.y1 += 2 * S;

		// Handles are fixed for the structural objects, then counted up for everything else.
		['vportT', 'ltypeT', 'layerT', 'styleT', 'viewT', 'ucsT', 'appidT', 'dimT', 'brT',
			'ltByBlock', 'ltByLayer', 'ltCont', 'layer0', 'style', 'appAcad', 'dimStd', 'vpActive',
			'brModel', 'brPaper', 'blkModel', 'endModel', 'blkPaper', 'endPaper',
			'dictRoot', 'dictGroup', 'dictLayout', 'dictPsn', 'psnNormal', 'layoutModel', 'layoutPaper'
		].forEach(function (k) { H[k] = w.handle(); });
		LAYERS.forEach(function (L) { H['layer:' + L.key] = w.handle(); });
		Object.keys(BLOCK_OF).forEach(function (t) {
			if (t === 'customer' && !(model.customers || []).length) { return; }
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
		function lwpoly(pts, layer, closed, owner) {
			entity('LWPOLYLINE', layer, owner);
			body.g(100, 'AcDbPolyline').g(90, pts.length).g(70, closed ? 1 : 0);
			pts.forEach(function (p) { body.g(10, num(p[0] !== undefined ? p[0] : p.x)).g(20, num(p[1] !== undefined ? p[1] : p.y)); });
		}
		function line(x1, y1, x2, y2, layer) {
			entity('LINE', layer);
			body.g(100, 'AcDbLine').g(10, num(x1)).g(20, num(y1)).g(30, '0.0')
				.g(11, num(x2)).g(21, num(y2)).g(31, '0.0');
		}
		// TEXT: the alignment point (11) is written whenever the justification is not plain
		// left-baseline, and 10 carries the same point; AutoCAD recomputes 10 from 11 on open.
		function text(t, layer) {
			var ha = t.halign | 0, va = t.valign | 0;
			entity('TEXT', layer);
			body.g(100, 'AcDbText').g(10, num(t.x)).g(20, num(t.y)).g(30, '0.0').g(40, num(t.h || th))
				.g(1, textContent(t));
			if (t.rot) { body.g(50, num(t.rot)); }
			if (ha) { body.g(72, ha); }
			if (ha || va) { body.g(11, num(t.x)).g(21, num(t.y)).g(31, '0.0'); }
			body.g(100, 'AcDbText');
			if (va) { body.g(73, va); }
		}
		// An attribute's place in the block: stacked to the right of the symbol, one text height
		// apart, so ATTDISP ON shows a readable column rather than every value on one point.
		function attrOffset(k, type) {
			var r = type === 'tank' ? 1.5 : (type === 'reservoir' ? 1.4 : (type === 'pump' || type === 'valve' ? 1 : (type === 'pipe' ? 0.25 : 0.5)));
			return { x: r + 0.25, y: -k * 1.5 * th / S };
		}
		function insert(type, x, y, rot, attrs, layer) {
			var tags = (model.tags && model.tags[type]) || [], ins, values = {}, c, s, k;
			(attrs || []).forEach(function (a) { values[a.tag] = a.value; });
			ins = entity('INSERT', layer);
			body.g(100, 'AcDbBlockReference');
			if (tags.length) { body.g(66, 1); }
			body.g(2, BLOCK_OF[type]).g(10, num(x)).g(20, num(y)).g(30, '0.0')
				.g(41, num(S)).g(42, num(S)).g(43, num(S));
			if (rot) { body.g(50, num(rot)); }
			if (!tags.length) { return; }
			c = Math.cos((rot || 0) * Math.PI / 180); s = Math.sin((rot || 0) * Math.PI / 180);
			for (k = 0; k < tags.length; k++) {
				var o = attrOffset(k, type), ax = x + S * (o.x * c - o.y * s), ay = y + S * (o.x * s + o.y * c),
					v = values[tags[k]];
				entity('ATTRIB', layer, ins);
				body.g(100, 'AcDbText').g(10, num(ax)).g(20, num(ay)).g(30, '0.0').g(40, num(th))
					.g(1, str(v === undefined || v === null ? '' : v));
				if (rot) { body.g(50, num(rot)); }
				// Flag 1 = invisible: the map's own lettering is the visible annotation (dev/dxf.md),
				// so a visible attribute would print every ID twice. ATTDISP ON shows them all.
				body.g(100, 'AcDbAttribute').g(2, str(tags[k])).g(70, 1);
			}
			var seq = body.handle();
			body.g(0, 'SEQEND').g(5, seq).g(330, ins).g(100, 'AcDbEntity').g(8, layer);
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
				var br = blockRec[t], tags = (model.tags && model.tags[t]) || [];
				blockBegin(BLOCK_OF[t], br.begin, br.rec, tags.length ? 2 : 0);
				// Geometry on layer 0 and colour ByLayer, so each INSERT takes its own layer's colour.
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
				tags.forEach(function (tag, k) {
					var o = attrOffset(k, t), hh = w.handle();
					w.g(0, 'ATTDEF').g(5, hh).g(330, br.rec).g(100, 'AcDbEntity').g(8, '0')
						.g(100, 'AcDbText').g(10, num(o.x)).g(20, num(o.y)).g(30, '0.0')
						.g(40, num(th / S)).g(1, '')
						.g(100, 'AcDbAttributeDefinition')
						.g(3, str((model.prompts && (model.prompts[t + '.' + tag] || model.prompts[tag])) || tag)).g(2, str(tag)).g(70, 1);
				});
				blockEnd(br.end, br.rec);
			});
		}

		// ---- ENTITIES, built first so the handle seed is known for the header ----
		(model.links || []).forEach(function (l) {
			var lay = layerName(l.type === 'pump' ? 'pump' : (l.type === 'valve' ? 'valve' : 'pipe'), pfx);
			if (!l.pts || l.pts.length < 2) { return; }
			lwpoly(l.pts, lay, false);
			if (l.type === 'pump' || l.type === 'valve' || l.type === 'pipe') {
				var m = midAlong(l.pts);
				insert(l.type, m.x, m.y, m.angle, l.attrs, lay);
			}
		});
		(model.customers || []).forEach(function (c) {
			var lay = layerName('customer', pfx);
			if (c.from) { line(c.from.x, c.from.y, c.x, c.y, lay); }
			insert('customer', c.x, c.y, 0, c.attrs, lay);
		});
		(model.nodes || []).forEach(function (n) {
			insert(n.type, n.x, n.y, 0, n.attrs, layerName(n.type, pfx));
		});
		(model.lines || []).forEach(function (ln) {
			line(ln.x1, ln.y1, ln.x2, ln.y2, layerName(ln.layer || 'label', pfx));
		});
		(model.texts || []).forEach(function (t) { text(t, layerName(t.layer || 'label', pfx)); });
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
			.g(9, '$TEXTSIZE').g(40, num(th))
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
		table('LAYER', H.layerT, LAYERS.length + 1);
		rec('LAYER', H.layer0, H.layerT, 'AcDbLayerTableRecord');
		w.g(2, '0').g(70, 0).g(62, 7).g(6, 'Continuous').g(370, -3).g(390, H.psnNormal);
		LAYERS.forEach(function (L) {
			rec('LAYER', H['layer:' + L.key], H.layerT, 'AcDbLayerTableRecord');
			w.g(2, tableName(pfx + L.name)).g(70, 0).g(62, L.color).g(6, 'Continuous');
			if (L.noPlot) { w.g(290, 0); }
			w.g(370, -3).g(390, H.psnNormal);
		});
		w.g(0, 'ENDTAB');
		// Arial, because a TrueType font is what a reader on any system substitutes cleanly, and
		// the text heights below are worked out from Arial's cap height (dev/dxf.md).
		table('STYLE', H.styleT, 1);
		rec('STYLE', H.style, H.styleT, 'AcDbTextStyleTableRecord');
		w.g(2, 'Standard').g(70, 0).g(40, '0.0').g(41, '1.0').g(50, '0.0').g(71, 0)
			.g(42, num(th)).g(3, 'arial.ttf').g(4, '').g(0, 'ENDTAB');
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
	// has no code before AutoCAD 2018, so it is written as feet and the note says which foot.
	var INSUNITS = { 'in': 1, 'ft': 2, 'us-ft': 2, 'mi': 3, 'mm': 4, 'cm': 5, 'm': 6, 'km': 7, 'yd': 10 };

	EngCalcs.lpnDxfWrite = writeDxf;
	EngCalcs.lpnDxfLayers = function (prefix) {
		return LAYERS.map(function (L) { return { key: L.key, name: (prefix || '') + L.name, color: L.color }; });
	};
	EngCalcs.lpnDxfBlocks = BLOCK_OF;
	EngCalcs.lpnDxfInsUnits = function (u) { return INSUNITS[u] || 0; };
	EngCalcs.lpnDxfMidAlong = midAlong;
	EngCalcs.lpnDxfString = str;
	EngCalcs.lpnDxfTooLong = tooLong;
	EngCalcs.lpnDxfLimit = LIMIT_CHARS;
	EngCalcs.lpnDxfBytes = bytes;
}(typeof window !== 'undefined' ? window : globalThis));
