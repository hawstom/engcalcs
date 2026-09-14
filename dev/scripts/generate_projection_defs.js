#!/usr/bin/env node
//
// GENERATE js/data/epsg-proj4.json -- a proj4 definition string for every live projected EPSG CRS
// this suite can transform.
//
//     node dev/scripts/generate_projection_defs.js --db=<path to proj.db> [--write]
//
// **THE SECOND HALF OF THE PROJECTION DATA, AND IT IS A SEPARATE FILE ON PURPOSE.**
// js/data/epsg-projected.json answers "what is this coordinate system CALLED and where does it
// apply" -- 5,346 rows, fetched the moment somebody opens the chooser. This answers "how do I turn
// a longitude into an easting", which is only ever needed once a PROJECTED project actually
// exists. Two files, two moments; the chooser stays light for the many people who never make one.
//
// Same pinned input as the catalogue, for the same reason -- see the header of
// dev/scripts/generate_projection_catalogue.js for why it is a PyPI wheel and not IOGP's REST API.
//
// ---- WHY THIS EXISTS AT ALL (Task 641 phase 5) -------------------------------------------------
//
// A projected project could not draw a basemap and could not open on the place the wizard searched
// for. Both were reported as separate defects and both are one missing piece: a transform between
// lon/lat and the plane. The initial view needs ONE point; the basemap needs FOUR CORNERS PER TILE.
// Everything phase 4 shipped was data and needed none of this.
//
// proj4js implements the projections; it bundles almost no DEFINITIONS. This builds them.
//
// ---- WHAT IS COVERED, AND THE HONEST REMAINDER -------------------------------------------------
//
// **98.0% -- 5,240 of 5,346 -- because the register is enormously concentrated.** Transverse
// Mercator alone is 3,828 of them, and six methods cover 96%:
//
//     3828  Transverse Mercator            955  Lambert Conformal Conic 2SP
//      240  LCC 1SP                         40  Albers Equal Area
//       32  LCC Michigan (NOT DONE)         30  Cassini-Soldner
//
// A CRS whose method is not in METHOD below simply gets no definition. **That is a real state and
// the page must say so rather than draw something wrong**: the chooser still lists it, the project
// still opens, the coordinates are still the user's own -- there is just no basemap and no arrival
// at a searched place. Silently substituting a near-enough projection would put a map under
// somebody's network that is tens of metres out, which is worse than no map.
//
// ---- HOW IT IS CHECKED, AND THE CHECK THAT MATTERS MOST ----------------------------------------
//
// dev/lpn-spike/projection-defs-harness.js runs three, because a definition can be self-consistent
// and still wrong:
//
//   1. **AGAINST proj4's OWN BUNDLED DEFINITIONS** for the 120 WGS 84 UTM zones. Two independent
//      derivations of the same thing; measured agreement is EXACTLY 0.000 m over 1,080 points.
//   2. **ROUND TRIP** -- forward then inverse returns the point. Catches a broken parameter, and
//      is the weakest of the three: a WRONG CENTRAL MERIDIAN round-trips perfectly.
//   3. **THE PARAMETERS AGAINST THE REGISTER'S OWN NAMES**, which is the one that catches (2)'s
//      blind spot. 1,550 names state their central meridian ("... CM 75E", "UTM zone 12N"); the
//      name and the parameter table are different columns filled in by different people, so an
//      agreement between them is real evidence. All 1,550 agree.
//
// **THE SEXAGESIMAL TRAP IS WHY CHECK 3 IS NOT OPTIONAL.** EPSG unit of measure 9110 is
// DDD.MMSSsss -- 38.3025 means 38 degrees 30 minutes 25 seconds, not 38.3025 degrees. Reading it as
// a decimal degree yields a central meridian about half a degree out, which round-trips perfectly,
// draws a plausible-looking map, and puts it several kilometres from where it belongs.
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
	console.error('usage: node generate_projection_defs.js --db=<proj.db> [--write]');
	console.error('see dev/scripts/generate_projection_catalogue.js for how to obtain proj.db');
	process.exit(2);
}
if (!fs.existsSync(dbPath)) { console.error('no such file: ' + dbPath); process.exit(2); }

var repo = path.resolve(__dirname, '..', '..');
var outPath = path.join(repo, 'js', 'data', 'epsg-proj4.json');
var db = new sqlite.DatabaseSync(dbPath, { readOnly: true });

// EPSG method code -> proj4 projection, with any fixed extras. Counts are of live projected CRS.
var METHOD = {
	9807: { proj: 'tmerc' },                        // Transverse Mercator            3828
	9802: { proj: 'lcc' },                          // LCC 2SP                         955
	9801: { proj: 'lcc' },                          // LCC 1SP                         240
	9822: { proj: 'aea' },                          // Albers Equal Area                40
	9806: { proj: 'cass' },                         // Cassini-Soldner                  30
	9829: { proj: 'stere' },                        // Polar Stereographic B            28
	9808: { proj: 'tmerc', extra: ['+axis=wsu'] },  // TM South Oriented                28
	9812: { proj: 'omerc', extra: ['+no_uoff'] },   // Hotine Oblique Mercator A        22
	9820: { proj: 'laea' },                         // Lambert Azimuthal Equal Area     21
	9809: { proj: 'sterea' },                       // Oblique Stereographic            19
	9826: { proj: 'lcc', extra: ['+axis=wnu'] },    // LCC West Orientated              15
	9815: { proj: 'omerc' },                        // Hotine Oblique Mercator B        12
	9810: { proj: 'stere' },                        // Polar Stereographic A            10
	9804: { proj: 'merc' },                         // Mercator variant A                8
	9818: { proj: 'poly' },                         // American Polyconic                4
	9805: { proj: 'merc' },                         // Mercator variant B                3
	9819: { proj: 'krovak' }                        // Krovak                            3
};

// EPSG parameter code -> proj4 key. Several EPSG parameters map to one proj4 key: EPSG carefully
// distinguishes the natural origin from the false origin from the projection centre, and proj4
// spells all three `+lat_0`/`+lon_0`. `null` means known and deliberately dropped.
var PARAM = {
	8801: 'lat_0', 8802: 'lon_0', 8805: 'k_0', 8806: 'x_0', 8807: 'y_0',
	8821: 'lat_0', 8822: 'lon_0', 8823: 'lat_1', 8824: 'lat_2', 8826: 'x_0', 8827: 'y_0',
	8811: 'lat_0', 8812: 'lonc', 8813: 'alpha', 8814: 'gamma', 8815: 'k_0', 8816: 'x_0', 8817: 'y_0',
	8832: 'lat_ts', 8833: 'lon_0',
	8818: 'lat_0', 8819: 'k_0',
	1036: null, 1038: null
};
// 9110 is handled separately: it is sexagesimal DDD.MMSSsss, not a scaled decimal degree.
var UOM_DEG = { 9102: 1, 9101: 180 / Math.PI, 9105: 0.9 };
var UOM_LEN = { 9001: 1, 9002: 0.3048, 9003: 1200 / 3937, 9005: 0.3047972654 };
var LINEAR_KEYS = { x_0: 1, y_0: 1 };
var ANGLE_KEYS = { lat_0: 1, lon_0: 1, lat_1: 1, lat_2: 1, lat_ts: 1, lonc: 1, alpha: 1, gamma: 1 };

function sexagesimalToDeg(v) {
	var sign = v < 0 ? -1 : 1, a = Math.abs(v), d = Math.floor(a),
		m = Math.floor((a - d) * 100 + 1e-9),
		s = (((a - d) * 100) - m) * 100;
	return sign * (d + m / 60 + s / 3600);
}
function fmt(n) { return isFinite(n) ? String(Math.round(n * 1e9) / 1e9) : null; }

var q = {
	crs: db.prepare(
		"select p.code, p.conversion_auth_name ca, p.conversion_code cc," +
		" p.geodetic_crs_auth_name ga, p.geodetic_crs_code gc," +
		" p.coordinate_system_auth_name csa, p.coordinate_system_code csc" +
		" from projected_crs p where p.auth_name='EPSG' and p.deprecated=0 order by p.code"),
	conv: db.prepare('select * from conversion_table where auth_name=? and code=?'),
	axis: db.prepare('select uom_code uc from axis where coordinate_system_auth_name=?' +
		' and coordinate_system_code=? order by coordinate_system_order limit 1'),
	geod: db.prepare('select datum_auth_name da, datum_code dc from geodetic_crs where auth_name=? and code=?'),
	datum: db.prepare('select ellipsoid_auth_name ea, ellipsoid_code ec,' +
		' prime_meridian_auth_name pa, prime_meridian_code pc from geodetic_datum where auth_name=? and code=?'),
	ell: db.prepare('select semi_major_axis a, inv_flattening rf, semi_minor_axis b, uom_code uc' +
		' from ellipsoid where auth_name=? and code=?'),
	pm: db.prepare('select longitude lon, uom_code uc from prime_meridian where auth_name=? and code=?'),
	// **THE DATUM SHIFT, BEST ACCURACY FIRST, AND IT IS NOT COSMETIC.** Without it an older datum
	// sits where its own survey put it rather than where the tiles do -- NAD27 is out by up to
	// ~200 m in the United States, which is a street and a half on the screen.
	helmert: db.prepare(
		'select h.tx,h.ty,h.tz,h.rx,h.ry,h.rz,h.scale_difference sd, h.rotation_uom_code ruc' +
		' from helmert_transformation h' +
		' join coordinate_operation_view o on o.auth_name=h.auth_name and o.code=h.code' +
		" where h.source_crs_auth_name='EPSG' and h.source_crs_code=?" +
		' and h.target_crs_code in (4326,4978,4979) and h.deprecated=0' +
		' order by (o.accuracy is null), o.accuracy limit 1')
};

var defs = {};
var skipped = {};
function skip(why) { skipped[why] = (skipped[why] || 0) + 1; }

q.crs.all().forEach(function (c) {
	var cv = q.conv.get(c.ca, c.cc);
	if (!cv) { skip('no conversion'); return; }
	var m = METHOD[cv.method_code];
	if (!m) { skip('method ' + cv.method_code); return; }

	var parts = ['+proj=' + m.proj], bad = null, i2, pc, key, v, uom;
	for (i2 = 1; i2 <= 7; i2++) {
		pc = cv['param' + i2 + '_code'];
		if (pc === null || pc === undefined) { continue; }
		key = PARAM[pc];
		if (key === null) { continue; }
		if (key === undefined) { bad = 'param ' + pc; break; }
		v = cv['param' + i2 + '_value'];
		uom = cv['param' + i2 + '_uom_code'];
		if (ANGLE_KEYS[key]) {
			if (uom === 9110) { v = sexagesimalToDeg(v); }
			else if (UOM_DEG[uom] !== undefined) { v = v * UOM_DEG[uom]; }
			else { bad = 'angle uom ' + uom; break; }
		} else if (LINEAR_KEYS[key]) {
			if (UOM_LEN[uom] === undefined) { bad = 'length uom ' + uom; break; }
			v = v * UOM_LEN[uom];
		}
		parts.push('+' + key + '=' + fmt(v));
	}
	if (bad) { skip(bad); return; }

	var g = q.geod.get(c.ga, c.gc);
	var d = g && q.datum.get(g.da, g.dc);
	var e = d && q.ell.get(d.ea, d.ec);
	if (!e) { skip('no ellipsoid'); return; }
	var ef = UOM_LEN[e.uc] === undefined ? 1 : UOM_LEN[e.uc];
	parts.push('+a=' + fmt(e.a * ef));
	if (e.rf) { parts.push('+rf=' + fmt(e.rf)); }
	else if (e.b) { parts.push('+b=' + fmt(e.b * ef)); }
	else { skip('no flattening'); return; }

	var pm = d && q.pm.get(d.pa, d.pc);
	if (pm && pm.lon) {
		var plon = pm.lon;
		if (pm.uc === 9110) { plon = sexagesimalToDeg(plon); }
		else if (UOM_DEG[pm.uc] !== undefined) { plon = plon * UOM_DEG[pm.uc]; }
		else { skip('pm uom ' + pm.uc); return; }
		if (plon) { parts.push('+pm=' + fmt(plon)); }
	}

	var h = q.helmert.get(c.gc);
	if (h && h.tx !== null) {
		// Rotations are stored in arc-seconds (9104) or radians (9101); proj4 wants arc-seconds.
		var rot = h.ruc === 9101 ? 206264.80624709636 : 1;
		if (h.rx !== null && h.ry !== null && h.rz !== null && h.sd !== null) {
			parts.push('+towgs84=' + [h.tx, h.ty, h.tz, h.rx * rot, h.ry * rot, h.rz * rot, h.sd]
				.map(fmt).join(','));
		} else {
			parts.push('+towgs84=' + [h.tx, h.ty, h.tz].map(fmt).join(',') + ',0,0,0,0');
		}
	}

	// **THE PLANE'S OWN UNIT, READ FROM THE CRS RATHER THAN ASSUMED.** This is the half that makes
	// a State Plane ftUS zone come out in feet, and getting it wrong is a silent factor of 3.28.
	var ax = q.axis.get(c.csa, c.csc);
	var au = ax ? ax.uc : 9001;
	if (au === 9001) { parts.push('+units=m'); }
	else if (au === 9002) { parts.push('+units=ft'); }
	else if (au === 9003) { parts.push('+units=us-ft'); }
	else if (UOM_LEN[au] !== undefined) { parts.push('+to_meter=' + fmt(UOM_LEN[au])); }
	else { skip('axis uom ' + au); return; }

	// **POLAR STEREOGRAPHIC B STATES NO LATITUDE OF ORIGIN, AND THE POLE IS IMPLIED BY THE SIGN OF
	// THE STANDARD PARALLEL.** EPSG method 9829 carries only `lat_ts`, `lon_0` and the false
	// origin; proj4 defaults `+lat_0` to 0, which is an EQUATORIAL stereographic -- a different
	// projection wearing the same name. It was found by the round-trip check on EPSG:3032
	// (WGS 84 / Australian Antarctic Polar Stereographic), which came back 3,652 km away.
	// Variant A (9810) states its own `lat_0` of ±90 and needs nothing.
	if (cv.method_code === 9829) {
		var ts = null;
		parts.forEach(function (p) { var mm = /^\+lat_ts=(-?[0-9.]+)$/.exec(p); if (mm) { ts = parseFloat(mm[1]); } });
		if (ts === null) { skip('polar stereographic with no standard parallel'); return; }
		parts.push('+lat_0=' + (ts < 0 ? '-90' : '90'));
	}
	if (m.extra) { m.extra.forEach(function (x) { parts.push(x); }); }
	parts.push('+no_defs');
	defs[c.code] = parts.join(' ');
});

var meta = {};
db.prepare('select key, value from metadata').all().forEach(function (r) { meta[r.key] = r.value; });

var total = q.crs.all().length;
var n = Object.keys(defs).length;
var doc = {
	_comment: [
		'GENERATED by dev/scripts/generate_projection_defs.js -- do not hand-edit.',
		'A proj4 definition string per live projected EPSG CRS, for js/vendor/proj4.js.',
		'',
		'Checked offline by dev/scripts/projection_catalogue_check.php and exercised against the',
		'real proj4 by dev/lpn-spike/projection-defs-harness.js, which holds them three ways:',
		'against proj4’s own bundled UTM definitions (0.000 m over 1,080 points), by round',
		'trip, and by cross-checking the central meridian against the register’s own NAMES.',
		'',
		'A CRS ABSENT FROM HERE IS A REAL STATE, not an oversight: its projection method is one',
		'proj4 does not implement or we have not mapped. The chooser still offers it and a project',
		'still opens in it -- there is no basemap and no arrival at a searched place, and the page',
		'says so. Substituting a near-enough projection would draw a map tens of metres out.'
	],
	epsg_version: meta['EPSG.VERSION'],
	epsg_date: String(meta['EPSG.DATE']).slice(0, 10),
	proj_version: meta['PROJ.VERSION'],
	proj4js_version: '2.22.0',
	attribution: 'EPSG Dataset © IOGP',
	count: n,
	of: total,
	defs: defs
};

var head = JSON.stringify(doc, function (k, v) { return k === 'defs' ? undefined : v; }, '\t');
var body = Object.keys(defs).sort(function (a, b) { return a - b; })
	.map(function (k) { return '\t\t"' + k + '": ' + JSON.stringify(defs[k]); }).join(',\n');
var text = head.replace(/\n}$/, ',\n\t"defs": {\n' + body + '\n\t}\n}') + '\n';

console.log('EPSG ' + doc.epsg_version + ' (' + doc.epsg_date + '), PROJ ' + doc.proj_version);
console.log('defined ' + n + ' of ' + total + '  (' + (100 * n / total).toFixed(1) + '%)');
Object.keys(skipped).sort(function (a, b) { return skipped[b] - skipped[a]; }).slice(0, 10)
	.forEach(function (k) { console.log('  skipped ' + String(skipped[k]).padStart(4) + '  ' + k); });
console.log('bytes ' + text.length + '  gzipped ' +
	require('zlib').gzipSync(Buffer.from(text), { level: 9 }).length);

if (!write) { console.log('\nnot written (pass --write)'); process.exit(0); }
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, text);
console.log('\nwrote ' + path.relative(repo, outPath));
console.log('  openssl dgst -sha384 -binary ' + path.relative(repo, outPath) + ' | openssl base64 -A');
