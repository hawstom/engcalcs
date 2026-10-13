/**
 * lpn_ READERS FOR CAD AND GIS FILES, AS SHAPES (Task 779). Pure: no DOM, no project. The caller
 * places the coordinates in the project and says what was done (looped-network.js, landDxfShapes()
 * and landShapefileShapes()).
 *
 * Tom, 2026-10-11: *"the main presenting use case I see for this is to import shapes from GIS or CAD
 * to guide precise placement or map supplementation."* So every coordinate keeps the characters it
 * was written as where the file has any (a DXF is text), else String() of the double, which
 * reproduces it exactly; the Shapes table hands them back.
 *
 * **NOTHING IS DROPPED WITHOUT BEING NAMED.** Each reader returns what it did not take:
 *   DXF        `skipped`  [{ name: 'CIRCLE', n: 2 }]   entity types not read, with counts
 *              `bulged`   polylines whose arc segments were read as straight chords
 *   shapefile  `skipped`  [{ name: 'MultiPatch', n: 1 }] record types not read; `holes`, `multipart`
 *
 * Z and M are ignored: a Shape is flat. No library: a DXF is a list of code/value pairs, a
 * shapefile is ESRI's published binary layout (ESRI Shapefile Technical Description, July 1998),
 * a dBASE III table and a ZIP central directory (PKWARE APPNOTE), inflated by the browser.
 */
(function (root) {
	'use strict';
	var EngCalcs = root.EngCalcs = root.EngCalcs || {};

	// ---- DXF ---------------------------------------------------------------------------------------
	// Group 70 on an LWPOLYLINE or POLYLINE: bit 1 is closed. On a POLYLINE, 16 and 64 are meshes.
	// $INSUNITS is the header's drawing-units code; the table is the DXF reference's.
	var INSUNITS_NAME = { 1: 'in', 2: 'ft', 4: 'mm', 5: 'cm', 6: 'm', 7: 'km', 10: 'yd' };

	/**
	 * Read the points, lines and polylines of an ASCII DXF as Shapes.
	 *   POINT -> one point; LINE -> two points, open; LWPOLYLINE and POLYLINE -> the vertices in order,
	 *   closed when group 70 bit 1 is set (a closed one with fewer than three vertices stays open).
	 * Entities inside BLOCKS are counted, not read, and an INSERT is counted under its own name.
	 * Returns { ok: true, shapes: [{ closed, layer, pts: [{ x, y, tok: { x, y } }] }], skipped, bulged,
	 *           insunits: code | null, unit: 'ft' | ... | '' }  or { ok: false, detail }.
	 */
	EngCalcs.lpnDxfShapes = function (text) {
		var lines, i, code, val, section = '', want = false, ents = [], cur = null, insunits = null, hdr = '',
			shapes = [], skipped = {}, order = [], bulged = 0, inBlocks = 0, paper = 0, sawEnt = false;
		text = String(text);
		if (text.slice(0, 18) === 'AutoCAD Binary DXF') { return { ok: false, detail: 'binary' }; }
		lines = text.split(/\r\n|\n|\r/);
		if (lines.length < 4) { return { ok: false, detail: 'empty' }; }
		// Pass 1: the file as entities, each a type and its (code, value) groups.
		for (i = 0; i + 1 < lines.length; i += 2) {
			code = parseInt(lines[i].trim(), 10);
			val = lines[i + 1].trim();
			if (!isFinite(code)) { return { ok: false, detail: 'pairs' }; }
			if (code === 0) {
				cur = null;
				if (val === 'SECTION') { want = true; sawEnt = true; continue; }
				if (val === 'ENDSEC') { section = ''; continue; }
				if (val === 'EOF') { sawEnt = true; break; }
				if (section === 'ENTITIES' || section === 'BLOCKS') { cur = { type: val, g: [], blocks: section === 'BLOCKS' }; ents.push(cur); }
				continue;
			}
			if (want && code === 2) { section = val; want = false; continue; }
			if (section === 'HEADER') {
				if (code === 9) { hdr = val; }
				else if (hdr === '$INSUNITS' && code === 70) { insunits = parseInt(val, 10); hdr = ''; }
				continue;
			}
			if (cur) { cur.g.push([code, val]); }
		}
		function skip(name, n) { if (!skipped[name]) { skipped[name] = 0; order.push(name); } skipped[name] += n || 1; }
		function num(t) { return /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(t) ? parseFloat(t) : NaN; }
		function group(e, c) { var k; for (k = 0; k < e.g.length; k++) { if (e.g[k][0] === c) { return e.g[k][1]; } } return undefined; }
		// Vertices of an LWPOLYLINE: each group 10 starts one, the next 20 completes it.
		function lwVerts(e) {
			var out = [], k, c, t, p;
			for (k = 0; k < e.g.length; k++) {
				c = e.g[k][0]; t = e.g[k][1];
				if (c === 10) { p = { x: num(t), y: NaN, tok: { x: t, y: undefined } }; out.push(p); }
				else if (c === 20 && p) { p.y = num(t); p.tok.y = t; }
				else if (c === 42 && num(t) !== 0 && !isNaN(num(t))) { e.bulge = true; }
			}
			return out;
		}
		function pointOf(e, cx, cy) {
			var x = group(e, cx), y = group(e, cy);
			return { x: num(x), y: num(y), tok: { x: x, y: y } };
		}
		function good(p) { return isFinite(p.x) && isFinite(p.y); }
		// **OBJECT COORDINATE SYSTEM** (DXF reference, "Arbitrary Axis Algorithm"): the vertices of an
		// LWPOLYLINE and of a 2D POLYLINE are in a plane whose normal is the extrusion direction
		// (groups 210, 220, 230; default 0,0,1), at the elevation given. A mirrored drawing (0,0,-1) or
		// an inclined plane puts them elsewhere in the world. Returns null where the plane is the
		// ordinary one, so the file's own characters are kept; else a function (x, y, z) -> {x, y}.
		function ocsOf(e) {
			var nx = num(group(e, 210) || '0'), ny = num(group(e, 220) || '0'), nz = num(group(e, 230) || '1'), l, ax, ay, az, bx, by, bz;
			if (!isFinite(nx) || !isFinite(ny) || !isFinite(nz)) { return null; }
			l = Math.sqrt(nx * nx + ny * ny + nz * nz);
			if (!l) { return null; }
			nx /= l; ny /= l; nz /= l;
			if (nx === 0 && ny === 0 && nz === 1) { return null; }
			if (Math.abs(nx) < 1 / 64 && Math.abs(ny) < 1 / 64) { ax = nz; ay = 0; az = -nx; }   // Wy x N
			else { ax = -ny; ay = nx; az = 0; }                                                              // Wz x N
			l = Math.sqrt(ax * ax + ay * ay + az * az); ax /= l; ay /= l; az /= l;
			bx = ny * az - nz * ay; by = nz * ax - nx * az; bz = nx * ay - ny * ax;                                                    // N x Ax
			return function (x, y, z) { return { x: x * ax + y * bx + z * nx, y: x * ay + y * by + z * ny }; };
		}
		function toWorld(pts, f, z) {
			if (!f) { return pts; }
			return pts.map(function (p) {
				var w = f(p.x, p.y, z);
				return { x: w.x, y: w.y, tok: { x: undefined, y: undefined }, computed: true };
			});
		}
		function emit(type, layer, flags, pts, bulge) {
			if (!pts.length || !pts.every(good)) { skip(type + ' (no usable position)'); return; }
			if (bulge) { bulged++; }
			shapes.push({ closed: (flags & 1) === 1 && pts.length >= 3, layer: layer, pts: pts });
		}
		for (i = 0; i < ents.length; i++) {
			var e = ents[i], layer = group(e, 8) || '', flags = parseInt(group(e, 70), 10) || 0;
			if (e.blocks) { if (e.type !== 'BLOCK' && e.type !== 'ENDBLK') { inBlocks++; } continue; }
			// MODEL SPACE ONLY: group 67 = 1 is paper space, the sheet and its title block.
			if (group(e, 67) === '1') {
				if (e.type === 'POLYLINE') { var kk = i + 1; while (kk < ents.length && ents[kk].type === 'VERTEX') { kk++; } if (ents[kk] && ents[kk].type === 'SEQEND') { kk++; } i = kk - 1; }
				paper++; continue;
			}
			if (e.type === 'POINT') { emit('POINT', layer, 0, [pointOf(e, 10, 20)]); }
			else if (e.type === 'LINE') { emit('LINE', layer, 0, [pointOf(e, 10, 20), pointOf(e, 11, 21)]); }
			else if (e.type === 'LWPOLYLINE') { e.bulge = false; var vs = lwVerts(e); emit('LWPOLYLINE', layer, flags, toWorld(vs, ocsOf(e), num(group(e, 38) || '0') || 0), e.bulge); }
			else if (e.type === 'POLYLINE') {
				var pv = [], bl = false, k = i + 1, f2;
				while (k < ents.length && ents[k].type === 'VERTEX') {
					f2 = parseInt(group(ents[k], 70), 10) || 0;
					// 16 marks a spline frame control point, which is not on the curve.
					if (!(f2 & 16)) {
						pv.push(pointOf(ents[k], 10, 20));
						if (num(group(ents[k], 42) || '0') !== 0) { bl = true; }
					}
					k++;
				}
				if (ents[k] && ents[k].type === 'SEQEND') { k++; }
				i = k - 1;
				if (flags & (16 | 64)) { skip('POLYLINE (mesh)'); }
				else { emit('POLYLINE', layer, flags, (flags & 8) ? pv : toWorld(pv, ocsOf(e), num(group(e, 30) || '0') || 0), bl); }
			}
			else if (e.type === 'VERTEX' || e.type === 'SEQEND') { continue; }
			else { skip(e.type); }
		}
		if (!sawEnt) { return { ok: false, detail: 'sections' }; }
		return {
			ok: true, shapes: shapes, bulged: bulged, inBlocks: inBlocks, paperSpace: paper,
			skipped: order.map(function (k) { return { name: k, n: skipped[k] }; }),
			insunits: insunits, unit: INSUNITS_NAME[insunits] || ''
		};
	};

	// ---- ZIP (central directory, stored and deflated entries) -------------------------------------
	function u16(d, o) { return d.getUint16(o, true); }
	function u32(d, o) { return d.getUint32(o, true); }
	// Resolves { name: Uint8Array } for every file entry in the archive, or rejects with a reason.
	function unzip(bytes) {
		var dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength), e = bytes.length - 22, n, off, k, jobs = [], out = {};
		while (e >= 0 && u32(dv, e) !== 0x06054b50) { e--; }
		if (e < 0) { return Promise.reject(new Error('not a zip archive')); }
		n = u16(dv, e + 10); off = u32(dv, e + 16);
		for (k = 0; k < n; k++) {
			if (u32(dv, off) !== 0x02014b50) { return Promise.reject(new Error('damaged zip directory')); }
			(function (meth, csize, nl, xl, cl, lh) {
				var name = new TextDecoder().decode(bytes.subarray(off + 46, off + 46 + nl)), p, data;
				off += 46 + nl + xl + cl;
				if (name.slice(-1) === '/') { return; }
				p = lh + 30 + u16(dv, lh + 26) + u16(dv, lh + 28);
				data = bytes.subarray(p, p + csize);
				if (meth === 0) { out[name] = data; }
				else if (meth === 8) {
					if (typeof DecompressionStream === 'undefined') { jobs.push(Promise.reject(new Error('this browser cannot unzip'))); return; }
					jobs.push(new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer()
						.then(function (ab) { out[name] = new Uint8Array(ab); }));
				} else { jobs.push(Promise.reject(new Error('zip method ' + meth))); }
			}(u16(dv, off + 10), u32(dv, off + 20), u16(dv, off + 28), u16(dv, off + 30), u16(dv, off + 32), u32(dv, off + 42)));
		}
		return Promise.all(jobs).then(function () { return out; });
	}

	// ---- DBF ---------------------------------------------------------------------------------------
	function readDbf(bytes, cpg) {
		var dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength), nrec, hlen, rlen, fields = [], o = 32, rows = [], r, f, dec, p;
		if (bytes.length < 33) { return null; }
		nrec = u32(dv, 4); hlen = u16(dv, 8); rlen = u16(dv, 10);
		while (o + 32 <= hlen && bytes[o] !== 0x0d) {
			fields.push({
				name: ascii(bytes, o, 11), type: String.fromCharCode(bytes[o + 11]), len: bytes[o + 16]
			});
			o += 32;
		}
		// The .cpg names the code page: UTF-8, or a number such as 1251 for windows-1251.
		var label = 'utf-8', cm = /^\s*(?:cp|windows-?)?(\d{3,5})\s*$/i.exec(cpg || '');
		if (/utf-?8|65001/i.test(cpg || '')) { label = 'utf-8'; }
		else if (cm) { label = 'windows-' + cm[1]; }
		else if (/8859|latin|ansi/i.test(cpg || '')) { label = 'windows-1252'; }
		try { dec = new TextDecoder(label, { fatal: true }); }
		catch (e) { try { dec = new TextDecoder('utf-8', { fatal: true }); } catch (e1) { dec = null; } }
		for (r = 0; r < nrec; r++) {
			p = hlen + r * rlen;
			if (p + rlen > bytes.length) { break; }
			var row = { deleted: bytes[p] === 0x2a }, q = p + 1;
			for (f = 0; f < fields.length; f++) {
				var raw = bytes.subarray(q, q + fields[f].len), t;
				try { t = (dec || new TextDecoder('windows-1252')).decode(raw); } catch (e2) { t = new TextDecoder('windows-1252').decode(raw); }
				t = t.replace(/\0/g, '').trim();
				// A number stays the characters it was written as ("0000000170" is not 170).
				row[fields[f].name] = fields[f].type === 'L' ? (/^[TtYy]/.test(t) ? true : (/^[FfNn]/.test(t) ? false : '')) : t;
				q += fields[f].len;
			}
			rows.push(row);
		}
		return { fields: fields.map(function (x) { return x.name; }), rows: rows };
	}
	function ascii(b, o, n) {
		var s = '', i;
		for (i = 0; i < n && b[o + i]; i++) { s += String.fromCharCode(b[o + i]); }
		return s;
	}

	// ---- .prj (ESRI WKT) ---------------------------------------------------------------------------
	// { kind: 'geographic' | 'projected' | 'unknown', name, epsg }. The EPSG code is the AUTHORITY
	// of the outermost GEOGCS or PROJCS, and only when the file states one; nothing is guessed from
	// a name (ESRI names such as NAD_1983_StatePlane_Arizona_Central_FIPS_0202_Feet are not codes).
	function readPrj(wkt) {
		var t = String(wkt || '').trim(), m, kind, name = '', epsg = null, depth = 0, i, ch, last = -1;
		if (!t) { return null; }
		if (/^PROJCS\s*\[/i.test(t) || /^PROJCRS\s*\[/i.test(t)) { kind = 'projected'; }
		else if (/^GEOGCS\s*\[/i.test(t) || /^GEOGCRS\s*\[/i.test(t)) { kind = 'geographic'; }
		else { return { kind: 'unknown', name: '', epsg: null }; }
		m = /^[A-Z]+\s*\[\s*"([^"]*)"/i.exec(t); if (m) { name = m[1]; }
		// The outermost AUTHORITY is the last one at depth 1.
		for (i = 0; i < t.length; i++) {
			ch = t.charAt(i);
			if (ch === '"') { i = t.indexOf('"', i + 1); if (i < 0) { break; } continue; }
			if (ch === '[') { depth++; }
			else if (ch === ']') { depth--; }
			else if (depth === 1 && /^(AUTHORITY|ID)\s*\[/i.test(t.slice(i, i + 12))) { last = i; }
		}
		if (last >= 0) {
			m = /^(?:AUTHORITY|ID)\s*\[\s*"EPSG"\s*,\s*"?(\d+)"?/i.exec(t.slice(last));
			if (m) { epsg = 'EPSG:' + m[1]; }
		}
		// QGIS and ArcGIS write Web Mercator without a code, by name or by method: WGS_1984_Web_Mercator_
		// Auxiliary_Sphere (PROJECTION Mercator_Auxiliary_Sphere) or "WGS 84 / Pseudo-Mercator" (Popular
		// Visualisation Pseudo Mercator). Both state EPSG:3857, which is closed-form in the suite.
		if (!epsg && kind === 'projected' && /Mercator_Auxiliary_Sphere|Web_?Mercator|Pseudo.?Mercator|Popular.?Visuali[sz]ation/i.test(t)) { epsg = 'EPSG:3857'; }
		return { kind: kind, name: name, epsg: epsg, wkt: t };
	}

	// ---- shapefile ---------------------------------------------------------------------------------
	var TYPE_NAME = { 1: 'Point', 3: 'PolyLine', 5: 'Polygon', 8: 'MultiPoint', 11: 'PointZ', 13: 'PolyLineZ', 15: 'PolygonZ',
		18: 'MultiPointZ', 21: 'PointM', 23: 'PolyLineM', 25: 'PolygonM', 28: 'MultiPointM', 31: 'MultiPatch' };
	var BASE = { 1: 'point', 11: 'point', 21: 'point', 3: 'line', 13: 'line', 23: 'line', 5: 'poly', 15: 'poly', 25: 'poly',
		8: 'multi', 18: 'multi', 28: 'multi' };

	function readShp(bytes) {
		var dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength), o = 100, recs = [], skipped = {}, order = [],
			holes = 0, multipart = 0, fileLen;
		if (bytes.length < 100 || dv.getInt32(0, false) !== 9994) { return { ok: false, detail: 'header' }; }
		fileLen = dv.getInt32(24, false) * 2;
		if (fileLen > bytes.length) { fileLen = bytes.length; }
		function skip(name) { if (!skipped[name]) { skipped[name] = 0; order.push(name); } skipped[name]++; }
		function pt(p) { var x = dv.getFloat64(p, true), y = dv.getFloat64(p + 8, true); return { x: x, y: y, tok: { x: String(x), y: String(y) } }; }
		while (o + 12 <= fileLen) {
			var cl = dv.getInt32(o + 4, false) * 2, c = o + 8, type, base, parts = [], np, nq, k, j, ring, end;
			if (cl < 4 || c + cl > bytes.length) { return { ok: false, detail: 'damaged' }; }
			type = dv.getInt32(c, true); base = BASE[type];
			o = c + cl;
			if (type === 0) { skip('Null'); recs.push({ shapes: [] }); continue; }
			if (!base) { skip(TYPE_NAME[type] || ('type ' + type)); recs.push({ shapes: [] }); continue; }
			if ((base === 'point' && cl < 20) || (base === 'multi' && cl < 40) || ((base === 'line' || base === 'poly') && cl < 44)) { return { ok: false, detail: 'damaged' }; }
			if (base === 'multi' && c + 40 + dv.getInt32(c + 36, true) * 16 > bytes.length) { return { ok: false, detail: 'damaged' }; }
			if (base === 'point') { parts.push({ closed: false, pts: [pt(c + 4)] }); }
			else if (base === 'multi') {
				nq = dv.getInt32(c + 36, true);
				for (k = 0; k < nq; k++) { parts.push({ closed: false, pts: [pt(c + 40 + k * 16)] }); }
			} else {
				np = dv.getInt32(c + 36, true); nq = dv.getInt32(c + 40, true);
				var pOff = c + 44, qOff = pOff + np * 4, starts = [], rings = [], anyCw = false;
				if (np < 0 || nq < 0 || qOff + nq * 16 > bytes.length) { return { ok: false, detail: 'damaged' }; }
				for (k = 0; k < np; k++) { starts.push(dv.getInt32(pOff + k * 4, true)); }
				// A conforming writer puts exteriors clockwise; one that wrote every ring the other way
				// would otherwise lose all but the first, so counterclockwise rings are holes only when
				// some ring in the record is clockwise.
				if (base === 'poly') {
					for (k = 0; k < np; k++) {
						var e2 = k + 1 < np ? starts[k + 1] : nq, a2 = 0, j2;
						for (j2 = starts[k]; j2 + 1 < e2; j2++) {
							var x1 = dv.getFloat64(qOff + j2 * 16, true), y1 = dv.getFloat64(qOff + j2 * 16 + 8, true),
								x2 = dv.getFloat64(qOff + (j2 + 1) * 16, true), y2 = dv.getFloat64(qOff + (j2 + 1) * 16 + 8, true);
							a2 += x1 * y2 - x2 * y1;
						}
						if (a2 < 0) { anyCw = true; }
					}
				}
				for (k = 0; k < np; k++) {
					end = k + 1 < np ? starts[k + 1] : nq;
					ring = [];
					for (j = starts[k]; j < end; j++) { ring.push(pt(qOff + j * 16)); }
					if (base === 'poly') {
						// ESRI: an exterior ring runs clockwise and a hole counterclockwise (y up).
						var area = 0, m;
						for (m = 0; m + 1 < ring.length; m++) { area += ring[m].x * ring[m + 1].y - ring[m + 1].x * ring[m].y; }
						rings.push(area);
						if (k > 0 && area > 0 && parts.length && anyCw) { holes++; continue; }
						if (ring.length > 1 && ring[0].x === ring[ring.length - 1].x && ring[0].y === ring[ring.length - 1].y) { ring.pop(); }
						parts.push({ closed: ring.length >= 3, pts: ring });
					} else if (ring.length) { parts.push({ closed: false, pts: ring }); }
				}
			}
			if (parts.length > 1) { multipart++; }
			recs.push({ shapes: parts });
		}
		return {
			ok: true, recs: recs, holes: holes, multipart: multipart,
			skipped: order.map(function (k) { return { name: k, n: skipped[k] }; })
		};
	}

	/**
	 * Read an ESRI shapefile as Shapes. `files` is [{ name, bytes: Uint8Array }]: one .zip, or the .shp
	 * with any of its .dbf, .prj and .cpg beside it. Resolves to
	 *   { ok: true, shapes: [{ closed, pts: [{x, y, tok}], attrs: {col: value} | null, row: n }],
	 *     fields: [dbf column names] | null, prj: { kind, name, epsg } | null, holes, multipart, skipped,
	 *     deletedRows: n }  or  { ok: false, detail }.
	 * One Shape per part of a multipart record. A deleted dBASE row (its record still in the .shp) is
	 * read like any other, and counted in `deletedRows`.
	 */
	EngCalcs.lpnShapefileRead = function (files) {
		var byExt = {}, prep;
		function sort(map) {
			Object.keys(map).forEach(function (name) {
				var base = name.split('/').pop();
				if (/^(\.|__MACOSX)/.test(base) || name.indexOf('__MACOSX/') === 0) { return; }
				var ext = (/\.([a-z0-9]+)$/i.exec(base) || [])[1];
				if (ext) { ext = ext.toLowerCase(); (byExt[ext] = byExt[ext] || []).push({ name: base, bytes: map[name] }); }
			});
		}
		if (files.length === 1 && /\.zip$/i.test(files[0].name)) {
			prep = unzip(files[0].bytes).then(sort);
		} else {
			var m = {}; files.forEach(function (f) { m[f.name] = f.bytes; }); sort(m); prep = Promise.resolve();
		}
		return prep.then(function () {
			var shp = byExt.shp, stem, pick, r, dbf = null, prj = null, cpg = '', shapes = [], deleted = 0;
			if (!shp || !shp.length) { return { ok: false, detail: 'noshp' }; }
			if (shp.length > 1) { return { ok: false, detail: 'manyshp' }; }
			stem = shp[0].name.replace(/\.shp$/i, '').toLowerCase();
			pick = function (ext) {
				var l = byExt[ext] || [], i;
				for (i = 0; i < l.length; i++) { if (l[i].name.replace(/\.[^.]*$/, '').toLowerCase() === stem) { return l[i].bytes; } }
				return l.length === 1 && !shp.length ? l[0].bytes : null;
			};
			try { r = readShp(shp[0].bytes); } catch (e) { r = { ok: false, detail: 'damaged' }; }
			if (!r.ok) { return r; }
			var cp = pick('cpg'); if (cp) { cpg = new TextDecoder().decode(cp); }
			var db = pick('dbf'); if (db) { dbf = readDbf(db, cpg); }
			var pj = pick('prj'); if (pj) { prj = readPrj(new TextDecoder().decode(pj)); }
			r.recs.forEach(function (rec, idx) {
				var row = dbf && dbf.rows[idx] ? dbf.rows[idx] : null, attrs = null;
				// A record the .dbf marks deleted ('*') is not part of the layer: skipped, and counted.
				if (row && row.deleted) { if (rec.shapes.length) { deleted++; } return; }
				if (row) {
					attrs = {};
					dbf.fields.forEach(function (f) { attrs[f] = row[f]; });
				}
				rec.shapes.forEach(function (s) { s.attrs = attrs; s.row = idx + 1; shapes.push(s); });
			});
			return { ok: true, shapes: shapes, fields: dbf ? dbf.fields : null, prj: prj, holes: r.holes,
				multipart: r.multipart, skipped: r.skipped, deletedRows: deleted };
		}, function (e) { return { ok: false, detail: 'damaged', error: String(e && e.message ? e.message : e) }; });
	};
}(typeof globalThis !== 'undefined' ? globalThis : this));
