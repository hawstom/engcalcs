// THE 5,240 GENERATED proj4 DEFINITIONS, HELD THREE WAYS -- ROADMAP Task 641 phase 5. Run with:
//
//   node dev/lpn-spike/projection-defs-harness.js
//
// js/data/epsg-proj4.json is generated from the same pinned proj.db as the catalogue and is what
// lets a PROJECTED project draw a basemap and open on the place the wizard searched for. Both of
// those were reported as defects on 2026-09-14 and both are one missing piece: a transform.
//
// **A COORDINATE DEFINITION CAN BE SELF-CONSISTENT AND COMPLETELY WRONG, WHICH IS WHY THERE ARE
// THREE CHECKS AND NOT ONE.** Feed proj4 a central meridian half a degree out and every round
// trip still closes perfectly, every number still looks like an easting, and the map under the
// network is four kilometres from where it belongs. So:
//
//   1. AGAINST proj4's OWN BUNDLED DEFINITIONS, for the 120 WGS 84 UTM zones. Two independent
//      derivations of one thing -- ours assembled from the EPSG parameter tables, proj4's written
//      by its authors. This is the strongest evidence available and it is exact.
//   2. ROUND TRIP over every definition. The weakest of the three, and it is here for the failure
//      the other two cannot see: a parameter that makes the projection itself unusable.
//   3. THE CENTRAL MERIDIAN AGAINST THE REGISTER'S OWN NAMES. 1,550 names state it outright
//      ("... CM 75E", "UTM zone 12N"). The name and the parameter table are different columns of
//      somebody else's database, so agreement between them is real evidence rather than our own
//      arithmetic agreeing with itself. **This is the one that catches the sexagesimal trap**:
//      EPSG unit 9110 is DDD.MMSSsss, so 38.3025 is 38°30'25" and reading it as a decimal degree
//      puts the meridian half a degree out -- silently, and it round-trips.
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const proj4 = require(path.join(ROOT, 'js', 'vendor', 'proj4.js'));
const DEFS = JSON.parse(fs.readFileSync(path.join(ROOT, 'js', 'data', 'epsg-proj4.json'), 'utf8'));
const CAT = JSON.parse(fs.readFileSync(path.join(ROOT, 'js', 'data', 'epsg-projected.json'), 'utf8'));

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function head(t) { console.log('\n' + t); }

const box = {};
CAT.crs.forEach((r) => { box[r[0]] = r; });
const codes = Object.keys(DEFS.defs);
codes.forEach((c) => { proj4.defs('D:' + c, DEFS.defs[c]); });

head('1. The file says what it is');
ok('it names the EPSG release it came from', /^v\d/.test(String(DEFS.epsg_version)), DEFS.epsg_version);
ok('...the same one the catalogue came from', DEFS.epsg_version === CAT.epsg_version,
	DEFS.epsg_version + ' vs ' + CAT.epsg_version);
ok('its own count is the number of definitions', DEFS.count === codes.length,
	DEFS.count + ' vs ' + codes.length);
ok('it carries the IOGP acknowledgement', /IOGP/.test(String(DEFS.attribution)), DEFS.attribution);
// **EVERY DEFINITION MUST NAME A CRS THE CHOOSER OFFERS.** A definition for a code the catalogue
// does not list is one nothing can ever reach, and more to the point it means the two files were
// generated from different registers.
ok('every definition belongs to a CRS the catalogue lists',
	codes.every((c) => !!box[c]), String(codes.filter((c) => !box[c]).slice(0, 5)));

head('2. Against proj4\'s own definitions, on the 120 WGS 84 UTM zones');
// The one check where an independent authority states the same answer. Points are spread across
// each zone's real width and height rather than at its centre, where several errors vanish.
{
	let worst = 0, worstAt = '', n = 0, missing = 0;
	for (let z = 1; z <= 60; z++) {
		['N', 'S'].forEach((hemi) => {
			const code = (hemi === 'N' ? 32600 : 32700) + z;
			if (!DEFS.defs[code]) { missing++; return; }
			const lon0 = -183 + 6 * z;
			(hemi === 'N' ? [2, 40, 75] : [-2, -40, -70]).forEach((lat) => {
				[-2.5, 0, 2.5].forEach((dlon) => {
					const ll = [lon0 + dlon, lat];
					const a = proj4('EPSG:4326', 'EPSG:' + code, ll);
					const b = proj4('EPSG:4326', 'D:' + code, ll);
					const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
					n++;
					if (d > worst) { worst = d; worstAt = 'EPSG:' + code + ' at ' + ll.join(','); }
				});
			});
		});
	}
	ok('all 120 UTM zones have a definition', missing === 0, String(missing) + ' missing');
	ok('1,080 points compared', n === 1080, String(n));
	// EXACT. Not "within tolerance" -- both sides are the same projection with the same numbers,
	// so any disagreement at all means the assembly is producing something else.
	ok('...and they agree with proj4 exactly', worst === 0, worst.toExponential(3) + ' m ' + worstAt);
}

head('3. The central meridian against the register\'s own names');
{
	let checked = 0;
	const mismatch = [];
	codes.forEach((code) => {
		const name = box[code] ? box[code][1] : '';
		const m = /\+lon_0=(-?[0-9.]+)/.exec(DEFS.defs[code]) || /\+lonc=(-?[0-9.]+)/.exec(DEFS.defs[code]);
		if (!m) { return; }
		const have = parseFloat(m[1]);
		let want = null;
		let s = /\bCM\s+(\d+(?:\.\d+)?)\s*([EW])\b/i.exec(name);
		if (s) { want = parseFloat(s[1]) * (s[2].toUpperCase() === 'W' ? -1 : 1); }
		else {
			s = /\bUTM zone (\d+)\s*[NS]?\b/i.exec(name);
			if (s) { want = -183 + 6 * parseInt(s[1], 10); }
		}
		if (want === null) { return; }
		checked++;
		if (Math.abs(((have - want + 540) % 360) - 180) > 1e-6) {
			mismatch.push(code + ' "' + name + '" lon_0=' + have + ' name says ' + want);
		}
	});
	// A floor, so a regression that stops PARSING the names reads as a failure rather than as a
	// clean run. It was 1,550 the day this was written.
	ok('the names state a central meridian often enough to be evidence', checked >= 1500, String(checked));
	ok('...and every one of them agrees with the parameter table',
		mismatch.length === 0, mismatch.slice(0, 4).join(' | '));
}

head('4. Every definition projects and comes back');
{
	const rtBad = [];
	const threw = [];
	let worst = 0;
	codes.forEach((code) => {
		const r = box[code];
		if (!r) { return; }
		let lon = (r[2] + r[4]) / 2;
		const lat = (r[3] + r[5]) / 2;
		// An area of use that crosses the antimeridian states west > east.
		if (r[2] > r[4]) { lon = r[2] + (360 - (r[2] - r[4])) / 2; if (lon > 180) { lon -= 360; } }
		let p, back;
		try {
			p = proj4('EPSG:4326', 'D:' + code, [lon, lat]);
			back = proj4('D:' + code, 'EPSG:4326', p);
		} catch (e) { threw.push(code + ' ' + e.message.slice(0, 40)); return; }
		if (!isFinite(p[0]) || !isFinite(p[1])) { threw.push(code + ' non-finite'); return; }
		// Longitude WRAPS, and comparing -180 against +180 as numbers is how this test lies: two
		// Gauss-Kruger zones on the antimeridian read as 15,000 km of error and are perfect.
		let dlon = ((back[0] - lon + 540) % 360) - 180;
		const d = Math.hypot(dlon * Math.cos(lat * Math.PI / 180), back[1] - lat) * 111320;
		if (d > worst) { worst = d; }
		// **3 m, AND THE SLACK IS THE DATUM SHIFT RATHER THAN THE PROJECTION.** proj4 inverts a
		// 7-parameter Helmert iteratively, so a datum with a huge shift does not close exactly:
		// Fatu Iva 72's is 2.6 km, and its round trip is out by 0.2 m. The projections themselves
		// close to millimetres.
		if (d > 3) { rtBad.push(code + ':' + d.toFixed(2) + 'm'); }
	});
	ok('nothing threw and nothing came back non-finite', threw.length === 0,
		threw.slice(0, 4).join(' | '));
	ok('every definition round-trips its own area of use', rtBad.length === 0,
		rtBad.slice(0, 6).join(' '));
	ok('...and the worst is a datum shift, not a projection', worst < 3, worst.toFixed(3) + ' m');
}

head('5. The families this project\'s own users work in');
// Spot checks with parameters that are published and well known, so a reader can verify them
// against a paper source rather than against this file.
{
	// UTM 12N: central meridian 111°W, scale 0.9996, false easting 500 000 m.
	const phx = proj4('EPSG:4326', 'D:32612', [-112.074, 33.4484]);
	ok('Phoenix in UTM 12N is where the published grid puts it',
		Math.abs(phx[0] - 400179.65) < 0.5 && Math.abs(phx[1] - 3701514.11) < 0.5,
		phx.map((v) => v.toFixed(2)).join(', '));
	// State Plane, which is where a United States civil engineer actually works, and the case the
	// 183 hand-typed rows never covered.
	ok('NAD83 / Alabama East is a Transverse Mercator on 85°50\'W with a 200 km false easting',
		/\+proj=tmerc/.test(DEFS.defs[26929]) && /\+lon_0=-85.833333333\b/.test(DEFS.defs[26929])
			&& /\+x_0=200000\b/.test(DEFS.defs[26929]), DEFS.defs[26929]);
	ok('NAD83 / Kentucky North is a two-parallel Lambert',
		/\+proj=lcc/.test(DEFS.defs[2205]) && /\+lat_1=37.966666667\b/.test(DEFS.defs[2205])
			&& /\+lat_2=38.966666667\b/.test(DEFS.defs[2205]), DEFS.defs[2205]);
	// **THE FOOT ZONES CARRY THEIR UNIT, and this is the silent factor of 3.28.** A ftUS zone whose
	// definition says metres draws a map a third of the size and nothing complains.
	const ftUS = codes.filter((c) => / \(ftUS\)$/.test(box[c] ? box[c][1] : ''));
	ok('every (ftUS) zone is defined in US survey feet',
		ftUS.length > 80 && ftUS.every((c) => /\+units=us-ft\b/.test(DEFS.defs[c])),
		ftUS.length + ' zones');
	const ftInt = codes.filter((c) => / \(ft\)$/.test(box[c] ? box[c][1] : ''));
	ok('...and every (ft) zone in international feet',
		ftInt.length > 0 && ftInt.every((c) => /\+units=ft\b/.test(DEFS.defs[c])),
		ftInt.length + ' zones');
	// The same zone in metres and in feet must be the same place on the ground.
	const m = proj4('EPSG:4326', 'D:26929', [-86, 32.5]);
	const f = proj4('EPSG:4326', 'D:2759', [-86, 32.5]);   // NAD83(HARN) / Alabama East, metres
	ok('a zone in metres and its HARN twin agree to a few metres',
		Math.hypot(m[0] - f[0], m[1] - f[1]) < 5,
		Math.hypot(m[0] - f[0], m[1] - f[1]).toFixed(3) + ' m');
}

head('6. What is NOT defined, stated rather than hidden');
{
	const undef = CAT.crs.map((r) => r[0]).filter((c) => !DEFS.defs[c]);
	ok('the remainder is the 106 the generator declares', undef.length === CAT.count - DEFS.count,
		undef.length + ' vs ' + (CAT.count - DEFS.count));
	// **A RATCHET.** The number may FALL as methods are added and must not RISE: a rise means a
	// register upgrade brought in a projection we silently stopped serving.
	ok('...and it has not grown', undef.length <= 106, String(undef.length));
	ok('coverage is still at least 98%', DEFS.count / CAT.count >= 0.98,
		(100 * DEFS.count / CAT.count).toFixed(2) + '%');
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall projection-definition checks passed');
process.exit(fails ? 1 : 0);
