// Looped Pipe Network -- READING A DXF FILE THIS PAGE WROTE, AS A NETWORK (ROADMAP Task 772, import
// half, slice 1).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
//
// WHAT THIS IS: the other half of js/lpn-dxf.js. Tom's DXF Interface Manager specification
// (dev/dxf-interface.md) is for import AND export, and the builder's note is that the import "should
// read exactly what this export writes, and the round trip is its first harness". So this reads
// only that: layers C-WATR-MODL-<ASSET>-<alternative>, LWPOLYLINEs as links, attributed INSERTs as
// nodes and as the data of a link at its mid-run, a customer's INSERT and its two-point service
// line. Reading a stranger's drawing (tag matching, the Interface Manager's editable translation
// table) is slice 2 and is NOT here.
//
// **NOTHING IS DROPPED WITHOUT BEING NAMED** (CLAUDE.md: an import "reports every difference, never
// rejects, never drops silently"). Every layer, entity, block or attribute tag this does not
// understand comes back in `notes`, by name, with a count.
//
// **VALUES ARE VERBATIM** ("Only the user touches a file's numbers"): a number's own characters are
// kept in `tok` beside it, and the page hands them back out as typed. No value is converted here.
//
// THE FILE'S READER IS js/lpn-gisread.js's (lpnDxfRead): the same first pass, the same paper-space
// rule, the same object coordinate system, as the Shape import. THIS FILE KNOWS NOTHING ABOUT THE
// PAGE: no DOM, no project. The page passes the property keys and the tags of its own language in
// `opts`, and does everything that needs a project (units, ids, customers).
(function (root) {
	'use strict';
	var EngCalcs = root.EngCalcs = root.EngCalcs || {};

	var CODE_TYPE = { NODE: 'junction', RESV: 'reservoir', TANK: 'tank', LINK: 'pipe', PUMP: 'pump', VALV: 'valve', CUST: 'customer', SHAP: 'shape' };
	var NODE_CODES = { NODE: 1, RESV: 1, TANK: 1 }, LINK_CODES = { LINK: 1, PUMP: 1, VALV: 1 };
	var VALVE_TYPES = { PRV: 1, PSV: 1, FCV: 1, TCV: 1, PBV: 1, GPV: 1 };
	var NUMBER = /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/;
	// The unit family each attribute's prompt states, by [element type][property key].
	var UNIT_FAMILY = {
		junction: { ELEV: 'lpn_u_elevhead', DEMAND: 'lpn_u_flow' },
		reservoir: { HEAD: 'lpn_u_elevhead' },
		tank: { ELEV: 'lpn_u_elevhead', BASEELEV: 'lpn_u_elevhead', LEVEL: 'lpn_u_elevhead', MINLEVEL: 'lpn_u_elevhead',
			MAXLEVEL: 'lpn_u_elevhead', DIAMETER: 'lpn_u_length' },
		pipe: { DIAMETER: 'lpn_u_diameter', LENGTH: 'lpn_u_length' },
		valve: { DIAMETER: 'lpn_u_diameter' },
		customer: { DEMAND: 'lpn_u_flow' }
	};
	var INSUNITS_NAME = { 1: 'in', 2: 'ft', 3: 'mi', 4: 'mm', 5: 'cm', 6: 'm', 7: 'km', 10: 'yd' };

	/**
	 * A string from the file, as the user typed it: the inverse of js/lpn-dxf.js's one escape.
	 * `\U+XXXX` is a character, `^ ` a caret, `^@`..`^_` a control character; where the string holds
	 * `%%%` (the writer's literal percent, used where the original held `%%`) it is one percent sign.
	 */
	function unesc(s) {
		s = String(s === undefined || s === null ? '' : s);
		var out = s.replace(/\\U\+([0-9A-Fa-f]{4})|\^(.)/g, function (all, hex, c) {
			var k;
			if (hex) { return String.fromCharCode(parseInt(hex, 16)); }
			if (c === ' ') { return '^'; }
			k = c.charCodeAt(0);
			return (k >= 64 && k <= 95) ? String.fromCharCode(k - 64) : all;
		});
		return /%%%/.test(s) ? out.replace(/%%%/g, '%') : out;
	}

	/**
	 * The bytes of a DXF as text: the file says its own code page ($DWGCODEPAGE, ANSI_1252 for the
	 * R2000 this page writes) unless it is AutoCAD 2007 or later, which is UTF-8.
	 */
	function decode(bytes) {
		var head = '', i, ver, cp, label = 'windows-1252';
		for (i = 0; i < Math.min(bytes.length, 4096); i++) { head += String.fromCharCode(bytes[i]); }
		ver = /\$ACADVER\s*\r?\n\s*1\s*\r?\n\s*(AC\d+)/.exec(head);
		cp = /\$DWGCODEPAGE\s*\r?\n\s*3\s*\r?\n\s*(\S+)/.exec(head);
		if (ver && ver[1] >= 'AC1021') { label = 'utf-8'; }
		else if (cp && /^ANSI_(\d+)$/i.test(cp[1])) { label = 'windows-' + /^ANSI_(\d+)$/i.exec(cp[1])[1]; }
		else if (cp && /^UTF-?8$/i.test(cp[1])) { label = 'utf-8'; }
		try { return new TextDecoder(label).decode(bytes); }
		catch (e) {
			try { return new TextDecoder('windows-1252').decode(bytes); }
			catch (e2) { return String.fromCharCode.apply(null, Array.prototype.slice.call(bytes)); }
		}
	}

	function notes() {
		var list = [], at = {}, seen = {};
		return {
			list: list,
			add: function (code, id, detail) {
				var n = at[code];
				if (!n) { n = at[code] = { code: code, ids: [], detail: detail === undefined ? '' : detail }; list.push(n); seen[code] = {}; }
				if (id !== undefined && id !== null && !Object.prototype.hasOwnProperty.call(seen[code], String(id))) {
					seen[code][String(id)] = 1;
					n.ids.push(String(id));
				}
				return n;
			}
		};
	}

	/**
	 * Read the text of a DXF this page wrote.
	 *   opts.keys   { junction: ['ID', 'ELEV', ...], ... }  the property keys of each block, in the
	 *               order the writer's ATTDEFs run (LPN_DXF_KEYS in looped-network.js)
	 *   opts.tags   { junction: ['ID', 'ELEVATION', ...], ... }  the same, as tags in the page's own
	 *               language; read beside the file's own block definitions, which win
	 * Returns { ok: false, detail } or { ok: true, nodes, links, customers, insunits, coordUnit,
	 *   unitText, notes: [{ code, ids, detail }], counts }. Nodes and links are the document's own
	 * shape (type, x, y, `tok`, `_diameter`, ...), positions as the file states them.
	 */
	function read(text, opts) {
		opts = opts || {};
		var R = EngCalcs.lpnDxfRead, rd, N = notes(), keys = opts.keys || {}, ents, i, e, prefix, blocks = {}, cur = null,
			tagKeys = {}, unitText = {}, items = [], wanted = [], nodes = [], links = [], customers = [],
			counts = { junction: 0, reservoir: 0, tank: 0, pipe: 0, pump: 0, valve: 0, customer: 0 },
			nodeIds = {}, linkIds = {}, custIds = {}, nodesByPos = {}, ambiguous = {}, paper = 0,
			foreign = {}, kinds = {}, alts = {}, shapes = {}, unread = {}, crsCode = '', readme, blockOf, typeOfBlock = {};
		if (!R) { return { ok: false, detail: 'reader' }; }
		rd = R.entities(text, true);
		if (!rd.ok) { return rd; }
		if (!rd.sawEnt) { return { ok: false, detail: 'sections' }; }
		prefix = EngCalcs.lpnDxfModelPrefix.toUpperCase();
		readme = String(EngCalcs.lpnDxfReadmeLayer).toUpperCase();
		blockOf = EngCalcs.lpnDxfBlocks;
		Object.keys(blockOf).forEach(function (t) { typeOfBlock[blockOf[t]] = t; });
		ents = rd.ents;

		// ---- the file's own block definitions: which tag is which property, and in what unit ----
		for (i = 0; i < ents.length; i++) {
			e = ents[i];
			if (!e.blocks) { continue; }
			if (e.type === 'BLOCK') { cur = unesc(R.group(e, 2)).toUpperCase(); if (!blocks[cur]) { blocks[cur] = []; } continue; }
			if (e.type === 'ENDBLK') { cur = null; continue; }
			if (e.type === 'ATTDEF' && cur) { blocks[cur].push({ tag: unesc(R.group(e, 2)), prompt: unesc(R.group(e, 3)) }); }
		}
		Object.keys(keys).forEach(function (t) {
			var map = {}, def = blocks[blockOf[t]] || [];
			((opts.tags && opts.tags[t]) || []).forEach(function (tag, k) { if (keys[t][k]) { map[String(tag).toUpperCase()] = keys[t][k]; } });
			// The block definition wins: it is the file's own statement, in the language it was written
			// in, whatever language this page is in.
			if (def.length === keys[t].length) {
				def.forEach(function (d, k) {
					var key = keys[t][k], m = /\(([^()]*)\)\s*$/.exec(d.prompt), fam = (UNIT_FAMILY[t] || {})[key];
					map[d.tag.toUpperCase()] = key;
					if (fam && m && m[1].trim() && !unitText[fam]) { unitText[fam] = m[1].trim(); }
				});
			}
			tagKeys[t] = map;
		});

		// ---- model space, as top-level entities (an INSERT with the ATTRIBs that follow it) ----
		function skipChildren(k) {
			while (ents[k + 1] && (ents[k + 1].type === 'ATTRIB' || ents[k + 1].type === 'VERTEX')) { k++; }
			if (ents[k + 1] && ents[k + 1].type === 'SEQEND') { k++; }
			return k;
		}
		for (i = 0; i < ents.length; i++) {
			e = ents[i];
			if (e.blocks || e.type === 'ATTRIB' || e.type === 'SEQEND' || e.type === 'VERTEX') { continue; }
			if (R.group(e, 67) === '1') { i = skipChildren(i); paper++; continue; }
			if (e.type === 'INSERT') {
				e.attribs = [];
				while (ents[i + 1] && ents[i + 1].type === 'ATTRIB' && !ents[i + 1].blocks) { e.attribs.push(ents[i + 1]); i++; }
				if (ents[i + 1] && ents[i + 1].type === 'SEQEND') { i++; }
			} else if (e.type === 'POLYLINE') { i = skipChildren(i); }
			e.layer = unesc(R.group(e, 8) || '0');
			items.push(e);
		}
		if (paper) { N.add('paper-space', null, paper); }

		// ---- which layers are ours ----
		function tally(map, layer, type) {
			if (!map[layer]) { map[layer] = {}; }
			map[layer][type] = (map[layer][type] || 0) + 1;
		}
		function say(map, layer) {
			var by = map[layer];
			return layer + ' (' + Object.keys(by).map(function (t) { return by[t] + ' ' + t; }).join(', ') + ')';
		}
		items.forEach(function (it) {
			var up = it.layer.toUpperCase(), m;
			if (up === readme) {
				if (it.type !== 'MTEXT') { tally(unread, it.layer, it.type); return; }
				// The read-me is the one place the export states a coordinate system, as "(EPSG:32610)".
				var said = /EPSG:(\d+)/i.exec(it.g.filter(function (q) { return q[0] === 3 || q[0] === 1; }).map(function (q) { return unesc(q[1]); }).join(''));
				if (said && !crsCode) { crsCode = 'EPSG:' + said[1]; }
				return;
			}
			if (up.slice(0, prefix.length) !== prefix) { tally(foreign, it.layer, it.type); return; }
			m = /^([^-]{4})-(.+)$/.exec(it.layer.slice(prefix.length));
			it.code = m ? m[1].toUpperCase() : '';
			if (!m || !CODE_TYPE[it.code]) { tally(kinds, it.layer, it.type); return; }
			if (m[2].toUpperCase() !== 'BASE') { tally(alts, it.layer, it.type); return; }
			if (it.code === 'SHAP') { tally(shapes, it.layer, it.type); return; }
			wanted.push(it);
		});

		// ---- the pieces ----
		function point(it) { return R.pointOf(it, 10, 20); }
		function posKey(x, y) { return x + ',' + y; }
		function attrs(it, type) {
			var out = {}, map = tagKeys[type] || {}, bad = {};
			(it.attribs || []).forEach(function (a) {
				var tag = unesc(R.group(a, 2)), key = map[tag.toUpperCase()];
				if (!key) { bad[tag] = (bad[tag] || 0) + 1; return; }
				out[key] = unesc(R.group(a, 1));
			});
			Object.keys(bad).forEach(function (t) { N.add('tag-unknown', t + ' (' + bad[t] + ')'); });
			return out;
		}
		// A number stated by an attribute: the value and the characters it came as. Blank is nothing.
		function put(el, label, a, key, prop, tag) {
			var t = a[key] === undefined ? '' : String(a[key]).trim();
			if (t === '') { return; }
			if (!NUMBER.test(t)) { N.add('value-unread', label + ' ' + (tag || key) + ': ' + t); return; }
			el[prop] = parseFloat(t);
			(el.tok = el.tok || {})[prop] = t;
		}
		function val(a, key) { return a[key] === undefined ? '' : String(a[key]); }
		function idOk(id) { return id !== '' && !/[\s;"]/.test(id) && id.length <= 31; }
		function vertsOf(ln) {
			var pts = R.toWorld(R.lwVerts(ln), R.ocsOf(ln), R.num(R.group(ln, 38) || '0') || 0);
			return pts.every(R.good) ? pts : null;
		}

		var inserts = [], lines = [];
		wanted.forEach(function (it) {
			var type = CODE_TYPE[it.code], bn;
			if (it.type === 'INSERT') {
				bn = unesc(R.group(it, 2)).toUpperCase();
				if (typeOfBlock[bn] !== type) { N.add('block-unknown', bn + ' on ' + it.layer); return; }
				inserts.push(it);
			} else if (it.type === 'LWPOLYLINE' && (LINK_CODES[it.code] || it.code === 'CUST')) {
				lines.push(it);
			} else { tally(unread, it.layer, it.type); }
		});

		// ---- the nodes ----
		inserts.forEach(function (it) {
			if (!NODE_CODES[it.code]) { return; }
			var type = CODE_TYPE[it.code], a = attrs(it, type), p = point(it), id = val(a, 'ID'), nd, k;
			if (!R.good(p)) { N.add('no-position', it.layer); return; }
			if (!idOk(id)) { N.add('bad-id', (id === '' ? '(blank)' : id) + ' at ' + p.tok.x + ', ' + p.tok.y); return; }
			if (nodeIds[id]) { N.add('dup-id', id); return; }
			nd = { id: id, type: type, x: p.x, y: p.y, tok: { x: p.tok.x, y: p.tok.y } };
			if (type === 'junction') {
				put(nd, id, a, 'ELEV', 'elev');
				put(nd, id, a, 'DEMAND', '_demand');
				if (nd._demand === undefined) { nd._demand = 0; }
			} else if (type === 'reservoir') {
				put(nd, id, a, 'HEAD', '_head');
			} else {
				put(nd, id, a, 'ELEV', 'elev');
				put(nd, id, a, 'BASEELEV', 'bottomElev');
				put(nd, id, a, 'LEVEL', '_level');
				put(nd, id, a, 'MINLEVEL', 'minLevel');
				put(nd, id, a, 'MAXLEVEL', 'maxLevel');
				put(nd, id, a, 'DIAMETER', 'tankDiameter');
			}
			if (val(a, 'TAG') !== '') { nd.tag = val(a, 'TAG'); }
			if (val(a, 'DESC') !== '') { nd.desc = val(a, 'DESC'); }
			nodes.push(nd); nodeIds[id] = nd; counts[type]++;
			k = posKey(nd.x, nd.y);
			if (nodesByPos[k]) { ambiguous[k] = true; } else { nodesByPos[k] = nd; }
		});

		// ---- the links: a polyline, and the block at its mid-run ----
		var insertAt = {};
		inserts.forEach(function (it) {
			if (!LINK_CODES[it.code]) { return; }
			var p = point(it);
			if (R.good(p)) { (insertAt[posKey(p.x, p.y)] = insertAt[posKey(p.x, p.y)] || []).push(it); }
		});
		function blockFor(pts, code) {
			var m = EngCalcs.lpnDxfMidAlong(pts), list = insertAt[posKey(m.x, m.y)], k, best = null, bd = Infinity, tol = 0, d, q;
			if (list) { for (k = 0; k < list.length; k++) { if (!list[k].used && list[k].code === code) { return list[k]; } } }
			// Not exactly there (a drawing edited since): the nearest unused block of the same layer
			// within a thousandth of the line's length.
			for (k = 0; k + 1 < pts.length; k++) { tol += Math.hypot(pts[k + 1].x - pts[k].x, pts[k + 1].y - pts[k].y); }
			tol *= 0.001;
			inserts.forEach(function (c) {
				if (c.used || c.code !== code) { return; }
				q = point(c);
				d = Math.hypot(q.x - m.x, q.y - m.y);
				if (d < bd && d <= tol) { bd = d; best = c; }
			});
			return best;
		}
		lines.forEach(function (ln) {
			if (ln.code === 'CUST') { return; }
			var pts = vertsOf(ln), type = CODE_TYPE[ln.code], ins, a, id, ka, kb, lk, closed = (parseInt(R.group(ln, 70), 10) || 0) & 1, vt;
			if (!pts || pts.length < 2 || closed) { tally(unread, ln.layer, closed ? 'closed LWPOLYLINE' : 'LWPOLYLINE without usable vertices'); return; }
			ins = blockFor(pts, ln.code);
			if (!ins) { N.add('link-no-block', ln.layer + ' at ' + pts[0].tok.x + ', ' + pts[0].tok.y); return; }
			ins.used = true;
			a = attrs(ins, type);
			id = val(a, 'ID');
			if (!idOk(id)) { N.add('bad-id', (id === '' ? '(blank)' : id) + ' on ' + ln.layer); return; }
			if (linkIds[id]) { N.add('dup-id', id); return; }
			ka = posKey(pts[0].x, pts[0].y); kb = posKey(pts[pts.length - 1].x, pts[pts.length - 1].y);
			if (ambiguous[ka] || ambiguous[kb]) { N.add('end-ambiguous', id); return; }
			if (!nodesByPos[ka] || !nodesByPos[kb]) { N.add('end-no-node', id); return; }
			if (nodesByPos[ka] === nodesByPos[kb]) { N.add('end-loop', id); return; }
			lk = { id: id, type: type, from: nodesByPos[ka].id, to: nodesByPos[kb].id, lenAuto: false, _status: 'open', _k: 0,
				verts: pts.slice(1, -1).map(function (v) { return { x: v.x, y: v.y, tok: { x: v.tok.x, y: v.tok.y } }; }) };
			if (type === 'pipe') {
				put(lk, id, a, 'DIAMETER', '_diameter');
				put(lk, id, a, 'LENGTH', '_length');
				put(lk, id, a, 'ROUGHNESS', '_roughness');
				if (lk._length === undefined) { lk.lenAuto = true; }
			} else if (type === 'valve') {
				vt = val(a, 'VALVETYPE').trim().toUpperCase();
				if (VALVE_TYPES[vt]) { lk.valveType = vt; } else { lk.valveType = 'TCV'; N.add('value-unread', id + ' VALVE TYPE: ' + (vt || '(blank)')); }
				put(lk, id, a, 'DIAMETER', '_diameter');
				put(lk, id, a, 'SETTING', '_setting');
				if (lk._setting === undefined) { lk._setting = 0; }
				lk._length = 0;
			}
			if (val(a, 'TAG') !== '') { lk.tag = val(a, 'TAG'); }
			if (val(a, 'DESC') !== '') { lk.desc = val(a, 'DESC'); }
			links.push(lk); linkIds[id] = lk; counts[type]++;
		});
		inserts.forEach(function (it) {
			if (LINK_CODES[it.code] && !it.used) { N.add('block-no-line', val(attrs(it, CODE_TYPE[it.code]), 'ID') || it.layer); }
		});

		// ---- the customers: a block, and the service line that ends on it ----
		var lineEnd = {};
		lines.forEach(function (ln) {
			if (ln.code !== 'CUST') { return; }
			var pts = vertsOf(ln);
			if (!pts || pts.length !== 2) { tally(unread, ln.layer, 'LWPOLYLINE of ' + (pts ? pts.length : 0) + ' vertices'); return; }
			lineEnd[posKey(pts[1].x, pts[1].y)] = { ln: ln, from: pts[0] };
		});
		inserts.forEach(function (it) {
			if (it.code !== 'CUST') { return; }
			var a = attrs(it, 'customer'), p = point(it), id = val(a, 'ID'), c, sl;
			if (!R.good(p)) { N.add('no-position', it.layer); return; }
			if (!idOk(id)) { N.add('bad-id', (id === '' ? '(blank)' : id) + ' at ' + p.tok.x + ', ' + p.tok.y); return; }
			if (custIds[id]) { N.add('dup-id', id); return; }
			c = { id: id, x: p.x, y: p.y, from: null };
			sl = lineEnd[posKey(p.x, p.y)];
			if (sl) { c.from = { x: sl.from.x, y: sl.from.y }; sl.used = true; }
			put(c, id, a, 'DEMAND', 'demand');
			put(c, id, a, 'COUNT', 'count');
			if (val(a, 'TAG') !== '') { c.tag = val(a, 'TAG'); }
			if (val(a, 'DESC') !== '') { c.desc = val(a, 'DESC'); }
			customers.push(c); custIds[id] = c; counts.customer++;
		});
		Object.keys(lineEnd).forEach(function (k) {
			if (!lineEnd[k].used) { N.add('line-no-block', lineEnd[k].ln.layer + ' at ' + lineEnd[k].from.tok.x + ', ' + lineEnd[k].from.tok.y); }
		});

		// A pump is its ends and its name here: the curve that gives it a head is not in the file.
		links.forEach(function (l) { if (l.type === 'pump') { N.add('pump-no-curve', l.id); } });

		// ---- what was not read, by layer, with the count of each kind of entity ----
		[['layer-foreign', foreign], ['layer-unknown', kinds], ['alternative', alts], ['shapes', shapes], ['entity-unread', unread]].forEach(function (g) {
			Object.keys(g[1]).forEach(function (l) { N.add(g[0], say(g[1], l)); });
		});

		return {
			ok: true, nodes: nodes, links: links, customers: customers, insunits: rd.insunits,
			coordUnit: INSUNITS_NAME[rd.insunits] || '', crsCode: crsCode, unitText: unitText, notes: N.list, counts: counts
		};
	}

	EngCalcs.lpnDxfNetRead = read;
	EngCalcs.lpnDxfDecode = decode;
	EngCalcs.lpnDxfUnescape = unesc;
}(typeof window !== 'undefined' ? window : globalThis));
