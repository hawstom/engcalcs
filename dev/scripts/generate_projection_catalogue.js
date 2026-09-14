#!/usr/bin/env node
//
// GENERATE js/data/epsg-projected.json -- every live projected coordinate system in the EPSG
// register, with its name and its area of use.
//
//     node dev/scripts/generate_projection_catalogue.js --db=<path to proj.db> [--write]
//
// **THIS IS A DEVELOPMENT-TIME TOOL AND PRODUCTION NEVER RUNS IT.** Deployment is `git pull`, so
// the file it writes is committed and IS the served source, exactly as `examples/` and
// `dev/features.md` are. The offline half -- the one that runs in check_all.sh on every commit and
// on a machine with no network and no proj.db -- is dev/scripts/projection_catalogue_check.php.
//
// ---- WHY THE INPUT IS A PINNED WHEEL AND NOT THE EPSG REST API ---------------------------------
//
// apps.epsg.org is IOGP's own service and is the first-party source, and it was measured and
// rejected on 2026-09-14 for a reason that is about VENDORING rather than about correctness. The
// register's list endpoint returns an area of use as a NAME, not as a box, so building this file
// from the API costs ~5,346 CRS detail calls plus ~3,700 extent calls -- and at the end of nine
// thousand requests you hold a snapshot that NOTHING PUBLISHES A HASH FOR. A vendored artifact
// whose input cannot be re-obtained bit-for-bit is one nobody can ever check.
//
// The PROJ project already solves this. `proj.db` is PROJ's build of the EPSG dataset, it is the
// file every QGIS, GDAL, PostGIS and pyproj install reads, and it states the register version it
// was built from in its own `metadata` table. It arrives inside a pyproj wheel on PyPI, which
// publishes a sha256 for every file it serves -- so the input to this generator is PINNED, and a
// later run on another machine can prove it used the same bytes. That is the property the API
// could not give, and it is the whole argument.
//
//     curl -sSL https://pypi.org/pypi/pyproj/json          # find the wheel and its sha256
//     curl -sSL <wheel url> -o pyproj.whl && sha256sum pyproj.whl
//     python3 -m zipfile -e pyproj.whl unpacked/
//     node dev/scripts/generate_projection_catalogue.js \
//          --db=unpacked/pyproj/proj_dir/share/proj/proj.db --write
//
// The wheel and proj.db are BUILD INPUTS and are not committed: 10 MB of database to produce
// 326 KB of answer, and the answer is the part that ships. dev/vendor-manifest.json records which
// wheel it was, by hash.
//
// ---- WHAT IS IN THE FILE, AND WHAT IS DELIBERATELY NOT ------------------------------------------
//
// A projected project in this suite CONVERTS NOTHING -- it holds the user's own eastings and
// northings and states what they are called. So the only two things the register has to give us
// are a NAME and a lon/lat AREA OF USE, and both are data. No proj4js, no transform, no
// projection mathematics of any kind: dev/projection-catalogue.md section 2 has the line between
// what data can answer and what a transform would be needed for.
//
// LIVE ONLY. A deprecated code is worse than an unknown one, because every GIS still reads it and
// nothing complains -- so `deprecated = 0` is the filter that keeps 25838 and 26979 out of a
// chooser, and it is why this cannot be a family formula. 5,708 projected CRS exist; 5,346 live.
//
// FIRST USAGE ONLY. 17 of the 5,346 state more than one usage, each with its own extent. The first
// is taken rather than the union, because a union across two disjoint areas is a box covering the
// gap between them -- which claims coverage the register does not state. Under-offering a
// projection loses a row from a filtered list; over-offering puts a wrong coordinate system in
// front of somebody. The count is printed so the number cannot drift unnoticed.
'use strict';

var fs = require('fs');
var path = require('path');
var sqlite = require('node:sqlite');

var args = process.argv.slice(2);
var dbPath = '';
var write = false;
var i;
for (i = 0; i < args.length; i++) {
	if (args[i].indexOf('--db=') === 0) { dbPath = args[i].slice(5); }
	else if (args[i] === '--write') { write = true; }
	else { console.error('unknown argument: ' + args[i]); process.exit(2); }
}
if (!dbPath) {
	console.error('usage: node generate_projection_catalogue.js --db=<proj.db> [--write]');
	console.error('see the header of this file for how to obtain proj.db from a pinned wheel');
	process.exit(2);
}
if (!fs.existsSync(dbPath)) { console.error('no such file: ' + dbPath); process.exit(2); }

var repo = path.resolve(__dirname, '..', '..');
var outPath = path.join(repo, 'js', 'data', 'epsg-projected.json');

var db = new sqlite.DatabaseSync(dbPath, { readOnly: true });

// The register version this proj.db was built from, out of the database's own metadata rather than
// out of anybody's memory. A file that cannot say which EPSG it is cannot be audited later.
var meta = {};
db.prepare('select key, value from metadata').all().forEach(function (r) { meta[r.key] = r.value; });
['EPSG.VERSION', 'EPSG.DATE', 'PROJ.VERSION'].forEach(function (k) {
	if (!meta[k]) { console.error('proj.db states no ' + k + '; refusing to write an unattributable file'); process.exit(1); }
});

var rows = db.prepare(
	'select p.code, p.name, e.west_lon w, e.south_lat s, e.east_lon e2, e.north_lat n' +
	'  from projected_crs p' +
	'  join usage u on u.object_table_name = \'projected_crs\'' +
	'   and u.object_auth_name = \'EPSG\' and u.object_code = p.code' +
	'  join extent e on e.auth_name = u.extent_auth_name and e.code = u.extent_code' +
	' where p.auth_name = \'EPSG\' and p.deprecated = 0' +
	' order by p.code'
).all();

var seen = Object.create(null);
var extraUsages = 0;
var crs = [];
rows.forEach(function (r) {
	var code = Number(r.code);
	if (seen[code]) { extraUsages++; return; }
	seen[code] = true;
	// Three decimals is ~110 m at the equator. An area of use is a coarse advisory box the register
	// itself rounds to whole minutes or worse, and this file is 5,346 rows long -- so a fourth
	// decimal buys nothing a user could see and costs 20 KB.
	crs.push([code, String(r.name), round3(r.w), round3(r.s), round3(r.e2), round3(r.n)]);
});

function round3(v) { return Math.round(Number(v) * 1000) / 1000; }

// ---- the shape guards, run here as well as in the PHP check ------------------------------------
// The check runs offline against the committed file and is the one that protects the tree. These
// run against the DATABASE, so a bad row is never written in the first place and the failure names
// the query rather than the artifact.
var bad = [];
crs.forEach(function (r) {
	if (!(r[0] > 0)) { bad.push('non-positive code: ' + JSON.stringify(r)); }
	if (!r[1]) { bad.push('empty name for ' + r[0]); }
	// `(Meters)` is an ESRI convention and appears in zero EPSG names. One here would mean this
	// query had picked up the ESRI authority by mistake, and would put an ESRI string in a field
	// claiming to be the EPSG register's own.
	if (r[1].indexOf('(Meters)') >= 0) { bad.push('ESRI-style name for ' + r[0] + ': ' + r[1]); }
	if (!(r[3] >= -90 && r[3] <= 90 && r[5] >= -90 && r[5] <= 90)) { bad.push('latitude out of range for ' + r[0]); }
	if (!(r[2] >= -180 && r[2] <= 180 && r[4] >= -180 && r[4] <= 180)) { bad.push('longitude out of range for ' + r[0]); }
	if (r[5] <= r[3]) { bad.push('north not above south for ' + r[0]); }
});
if (bad.length) {
	console.error('refusing to write; ' + bad.length + ' bad rows:');
	bad.slice(0, 10).forEach(function (m) { console.error('  ' + m); });
	process.exit(1);
}

var doc = {
	_comment: [
		'GENERATED by dev/scripts/generate_projection_catalogue.js -- do not hand-edit.',
		'Every live projected coordinate system in the EPSG register, with its area of use.',
		'',
		'Checked offline by dev/scripts/projection_catalogue_check.php inside check_all.sh, which',
		'verifies this file against dev/vendor-manifest.json and against the shape rules. That is',
		'integrity AT REST: it proves the file has not changed since it was committed. It does NOT',
		'prove the file matches the register, because nothing publishes a hash of this derivation.',
		'Re-running the generator on the pinned wheel is the only way to prove that, and the wheel',
		'is named by hash in the manifest so a later reader can.',
		'',
		'A row is [code, name, west, south, east, north]. Codes are EPSG, bare; the runtime adds',
		'the EPSG: prefix. Bounds are degrees of longitude and latitude -- an AREA OF USE, not a',
		'projected extent, and deliberately coarse.',
		'',
		'NAMES ARE NOT LANGUAGE KEYS. "NAD83 / Alabama East" is the register own name for a',
		'registered thing; it names rather than describes, and a GIS reader in any language looks',
		'for exactly those characters. This file costs zero strings in 26 languages.'
	],
	epsg_version: meta['EPSG.VERSION'],
	epsg_date: String(meta['EPSG.DATE']).slice(0, 10),
	proj_version: meta['PROJ.VERSION'],
	attribution: 'EPSG Dataset © IOGP',
	fields: ['code', 'name', 'west', 'south', 'east', 'north'],
	count: crs.length,
	crs: crs
};

// One row per line: the file is 5,346 rows and a diff of a register upgrade should read as the
// rows that changed, not as one 326 KB line.
var head = JSON.stringify(doc, function (k, v) { return k === 'crs' ? undefined : v; }, '\t');
var body = crs.map(function (r) { return '\t\t' + JSON.stringify(r); }).join(',\n');
var text = head.replace(/\n}$/, ',\n\t"crs": [\n' + body + '\n\t]\n}') + '\n';

console.log('EPSG ' + doc.epsg_version + ' (' + doc.epsg_date + '), PROJ ' + doc.proj_version);
console.log('live projected CRS: ' + crs.length);
console.log('extra usages skipped (first taken): ' + extraUsages);
console.log('bytes: ' + text.length + '  (' + (text.length / 1024).toFixed(0) + ' KB)');
console.log('gzipped: ' + require('zlib').gzipSync(Buffer.from(text), { level: 9 }).length + ' bytes');

if (!write) {
	console.log('\nnot written (pass --write). target: ' + path.relative(repo, outPath));
	process.exit(0);
}
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, text);
console.log('\nwrote ' + path.relative(repo, outPath));
console.log('now update the digest in dev/vendor-manifest.json:');
console.log('  openssl dgst -sha384 -binary ' + path.relative(repo, outPath) + ' | openssl base64 -A');
