// Writes the DXF and shapefile fixtures of dev/lpn-spike/shape-import-harness.js (Task 779).
//
//   node dev/lpn-spike/fixtures/make-shape-fixtures.js
//
// Reproducible: the same bytes every run (the zip stamps a fixed date). Output, beside this file:
//   shapes-sample.dxf   2 POINTs, a LINE, an open and a closed LWPOLYLINE, a closed old-style POLYLINE,
//                       2 CIRCLEs, 1 TEXT, and a POINT inside a block definition
//   shapes-geo.zip      .shp/.shx/.dbf/.prj in WGS 84: a Point, a MultiPoint (2), a two-part PolyLine,
//                       a Polygon with one hole, a PolyLineZ, and a MultiPatch (not read)
//   shapes-geo-noprj.shp  the same .shp alone
//   shapes-grid.shp/.dbf  a projected-style file with no .prj: one Point, one Polygon
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const here = __dirname;

// ---- DXF ----
function dxf(pairs) { return pairs.map((p) => p[0] + '\n' + p[1]).join('\n') + '\n'; }
const ent = (type, layer, g) => [[0, type], [8, layer]].concat(g);
const D = [];
D.push([0, 'SECTION'], [2, 'HEADER'], [9, '$ACADVER'], [1, 'AC1015'], [9, '$INSUNITS'], [70, 2], [0, 'ENDSEC']);
D.push([0, 'SECTION'], [2, 'BLOCKS'], [0, 'BLOCK'], [8, '0'], [2, 'B1'], [70, 0], [10, 0], [20, 0],
	[0, 'POINT'], [8, '0'], [10, 5], [20, 5], [0, 'ENDBLK'], [8, '0'], [0, 'ENDSEC']);
D.push([0, 'SECTION'], [2, 'ENTITIES']);
[].push.apply(D, ent('POINT', 'WELLS', [[10, '1000.50'], [20, '2000.25'], [30, 0]]));
[].push.apply(D, ent('POINT', 'WELLS', [[10, '1010'], [20, '2010.125']]));
[].push.apply(D, ent('LINE', 'MAIN', [[10, '1100'], [20, '2100'], [11, '1200.5'], [21, '2150.75']]));
[].push.apply(D, ent('LWPOLYLINE', 'MAIN', [[90, 4], [70, 0], [10, '0.5'], [20, '0.25'], [10, '10'], [20, '0'], [10, '10'], [20, '10'], [10, '20'], [20, '10']]));
[].push.apply(D, ent('LWPOLYLINE', 'LOTS', [[90, 4], [70, 1], [10, '100'], [20, '100'], [10, '200'], [20, '100'], [10, '200'], [20, '200'], [10, '100'], [20, '200']]));
D.push([0, 'POLYLINE'], [8, 'PARCEL'], [66, 1], [70, 1]);
[[300, 300], [400, 300], [350, 400]].forEach((v) => D.push([0, 'VERTEX'], [8, 'PARCEL'], [10, v[0]], [20, v[1]], [30, 0]));
D.push([0, 'SEQEND'], [8, 'PARCEL']);
[].push.apply(D, ent('CIRCLE', 'TANKS', [[10, 50], [20, 50], [40, 5]]));
[].push.apply(D, ent('CIRCLE', 'TANKS', [[10, 70], [20, 50], [40, 5]]));
[].push.apply(D, ent('TEXT', 'NOTES', [[10, 0], [20, 0], [40, 2], [1, 'Note']]));
D.push([0, 'ENDSEC'], [0, 'EOF']);
fs.writeFileSync(path.join(here, 'shapes-sample.dxf'), dxf(D));

// ---- shapefile ----
function recHeader(n, len) { const b = Buffer.alloc(8); b.writeInt32BE(n, 0); b.writeInt32BE(len / 2, 4); return b; }
function dbl(...v) { const b = Buffer.alloc(8 * v.length); v.forEach((x, i) => b.writeDoubleLE(x, i * 8)); return b; }
function i32(...v) { const b = Buffer.alloc(4 * v.length); v.forEach((x, i) => b.writeInt32LE(x, i * 4)); return b; }
function box(pts) {
	const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
	return dbl(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys));
}
// type 1 Point, 8 MultiPoint, 3 PolyLine, 5 Polygon, 13 PolyLineZ, 31 MultiPatch
function content(type, parts) {
	if (type === 1) { return Buffer.concat([i32(1), dbl(parts[0][0][0], parts[0][0][1])]); }
	const pts = [].concat(...parts), flat = Buffer.concat(pts.map((p) => dbl(p[0], p[1])));
	if (type === 8) { return Buffer.concat([i32(8), box(pts), i32(pts.length), flat]); }
	let starts = [], n = 0; parts.forEach((p) => { starts.push(n); n += p.length; });
	const head = Buffer.concat([i32(type), box(pts), i32(parts.length, pts.length), i32(...starts), flat]);
	if (type === 13) {
		const zr = dbl(0, 10), z = dbl(...pts.map((p, i) => 100 + i)), m = dbl(0, 1);
		return Buffer.concat([head, zr, z]);
	}
	return head;
}
function shp(type, recs) {
	const bodies = recs.map((r, i) => { const c = r.raw || content(r.type, r.parts); return Buffer.concat([recHeader(i + 1, c.length), c]); });
	const total = 100 + bodies.reduce((s, b) => s + b.length, 0), h = Buffer.alloc(100);
	h.writeInt32BE(9994, 0); h.writeInt32BE(total / 2, 24); h.writeInt32LE(1000, 28); h.writeInt32LE(type, 32);
	const shx = Buffer.alloc(100 + recs.length * 8); h.copy(shx, 0, 0, 100); shx.writeInt32BE((100 + recs.length * 8) / 2, 24);
	let off = 100;
	bodies.forEach((b, i) => { shx.writeInt32BE(off / 2, 100 + i * 8); shx.writeInt32BE((b.length - 8) / 2, 104 + i * 8); off += b.length; });
	return { shp: Buffer.concat([h].concat(bodies)), shx };
}
function dbf(fields, rows) {
	const hlen = 32 + fields.length * 32 + 1, rlen = 1 + fields.reduce((s, f) => s + f.len, 0), h = Buffer.alloc(hlen);
	h[0] = 3; h[1] = 126; h[2] = 10; h[3] = 12; h.writeUInt32LE(rows.length, 4); h.writeUInt16LE(hlen, 8); h.writeUInt16LE(rlen, 10);
	fields.forEach((f, i) => { h.write(f.name, 32 + i * 32, 'latin1'); h.write(f.type, 32 + i * 32 + 11, 'latin1'); h[32 + i * 32 + 16] = f.len; });
	h[hlen - 1] = 0x0d;
	const body = rows.map((r) => Buffer.concat([Buffer.from(' ')].concat(fields.map((f, i) => {
		const s = String(r[i]), b = Buffer.alloc(f.len, 0x20);
		(f.type === 'N' ? Buffer.from(s.padStart(f.len)) : Buffer.from(s)).copy(b, 0, 0, f.len); return b;
	}))));
	return Buffer.concat([h].concat(body, [Buffer.from([0x1a])]));
}
const WGS84 = 'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433],AUTHORITY["EPSG","4326"]]';
const cw = [[-112.0, 33.0], [-112.0, 33.01], [-111.99, 33.01], [-111.99, 33.0], [-112.0, 33.0]];   // clockwise
const ccwHole = [[-111.997, 33.003], [-111.993, 33.003], [-111.993, 33.007], [-111.997, 33.007], [-111.997, 33.003]];
const geoRecs = [
	{ type: 1, parts: [[[-112.0123, 33.4567]]] },
	{ type: 8, parts: [[[-112.1, 33.1], [-112.2, 33.2]]] },
	{ type: 3, parts: [[[-112.3, 33.3], [-112.31, 33.31], [-112.32, 33.3]], [[-112.4, 33.4], [-112.41, 33.41]]] },
	{ type: 5, parts: [cw, ccwHole] },
	{ type: 13, parts: [[[-112.5, 33.5], [-112.51, 33.51]]] },
	{ raw: Buffer.concat([i32(31), Buffer.alloc(60)]) }
];
const g = shp(0, geoRecs);
const gd = dbf([{ name: 'NAME', type: 'C', len: 12 }, { name: 'KIND', type: 'C', len: 8 }, { name: 'DIAM', type: 'N', len: 6 }],
	[['Well A', 'well', 0], ['Pair', 'well', 0], ['Main 1', 'main', 12], ['Lot 7', 'lot', 0], ['Z line', 'main', 8], ['Patch', 'x', 0]]);
fs.writeFileSync(path.join(here, 'shapes-geo-noprj.shp'), g.shp);

// A zip with fixed dates; deflated entries so the page's unzip is exercised, one stored.
function zip(entries) {
	const locals = [], centrals = []; let off = 0;
	entries.forEach((e) => {
		const name = Buffer.from(e.name), method = e.store ? 0 : 8, data = e.store ? e.data : zlib.deflateRawSync(e.data);
		let crc = zlib.crc32 ? zlib.crc32(e.data) : crc32(e.data);
		const lh = Buffer.alloc(30); lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(method, 8);
		lh.writeUInt16LE(0x0000, 10); lh.writeUInt16LE(0x2821, 12); lh.writeUInt32LE(crc >>> 0, 14); lh.writeUInt32LE(data.length, 18);
		lh.writeUInt32LE(e.data.length, 22); lh.writeUInt16LE(name.length, 26);
		const ch = Buffer.alloc(46); ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6); ch.writeUInt16LE(method, 10);
		ch.writeUInt16LE(0x2821, 14); ch.writeUInt32LE(crc >>> 0, 16); ch.writeUInt32LE(data.length, 20); ch.writeUInt32LE(e.data.length, 24);
		ch.writeUInt16LE(name.length, 28); ch.writeUInt32LE(off, 42);
		locals.push(lh, name, data); centrals.push(ch, name); off += 30 + name.length + data.length;
	});
	const cd = Buffer.concat(centrals), end = Buffer.alloc(22);
	end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
	end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(off, 16);
	return Buffer.concat(locals.concat([cd, end]));
}
function crc32(b) {
	let c, crc = 0xffffffff;
	for (let i = 0; i < b.length; i++) { c = (crc ^ b[i]) & 0xff; for (let k = 0; k < 8; k++) { c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1; } crc = (crc >>> 8) ^ c; }
	return (crc ^ 0xffffffff) >>> 0;
}
fs.writeFileSync(path.join(here, 'shapes-geo.zip'), zip([
	{ name: 'shapes-geo.shp', data: g.shp }, { name: 'shapes-geo.shx', data: g.shx, store: true },
	{ name: 'shapes-geo.dbf', data: gd }, { name: 'shapes-geo.prj', data: Buffer.from(WGS84) }
]));

const gr = shp(0, [
	{ type: 1, parts: [[[1000.5, 2000.25]]] },
	{ type: 5, parts: [[[0, 0], [0, 100], [100, 100], [100, 0], [0, 0]]] }
]);
fs.writeFileSync(path.join(here, 'shapes-grid.shp'), gr.shp);
fs.writeFileSync(path.join(here, 'shapes-grid.dbf'), dbf([{ name: 'NAME', type: 'C', len: 10 }], [['Hydrant'], ['Yard']]));
// One projected point in UTM zones 10 and 12, each with its own .prj stating the EPSG code.
[['10', 32610, 500000, 4000000], ['12', 32612, 400000, 3700000]].forEach(([z, code, e, n]) => {
	const prj = 'PROJCS["WGS_1984_UTM_Zone_' + z + 'N",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["Central_Meridian",' + (z === '10' ? -123 : -111) + '.0],UNIT["Meter",1.0],AUTHORITY["EPSG","' + code + '"]]';
	const u = shp(0, [{ type: 1, parts: [[[e + 0.125, n + 0.5]]] }]);
	fs.writeFileSync(path.join(here, 'shapes-utm' + z + '.zip'), zip([
		{ name: 'utm' + z + '.shp', data: u.shp }, { name: 'utm' + z + '.prj', data: Buffer.from(prj) }
	]));
});
console.log('wrote fixtures in ' + here);
