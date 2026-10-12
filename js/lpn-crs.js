/**
 * lpn-crs.js — turning a longitude into an easting, and back.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * ROADMAP Task 641 phase 5. **THE ONE THING A PROJECTED PROJECT COULD NOT DO.** Until this
 * existed, a project on a projected coordinate system drew no basemap and could not open on the
 * place the wizard searched for — both reported as defects, and both the same hole: the page held
 * the user's eastings and northings and had no way to say where on the Earth they were.
 *
 * **IT CONVERTS A POSITION AND IT NEVER TOUCHES THE DOCUMENT.** That distinction is the whole of
 * the safety here and it is the standing rule of this suite: the numbers in the file are the
 * user's. What this is for is putting a picture BEHIND them and pointing the camera — questions
 * about the view, which is ours. A transform makes "convert my network" askable and the answer is
 * still no, because converting rewrites every number somebody typed.
 *
 * **NO DOM, so a harness can ask it anything.** The loader is the one impure part and it is one
 * function; everything else is arithmetic.
 *
 * ---- WHAT IS LOADED, AND WHEN --------------------------------------------------------------
 *
 * Two files, both only once a projected project actually needs them:
 *
 *   js/vendor/proj4.js       130 KB — the projections themselves, MIT, pinned in the manifest
 *   js/data/epsg-proj4.json  847 KB / 62 KB gzipped — 5,240 definitions, generated from the same
 *                            pinned proj.db as the catalogue
 *
 * **NEITHER IS FETCHED AT PAGE LOAD AND NEITHER IS PRECACHED.** Most visitors never open the map
 * editor, and most who do work in latitude and longitude, where none of this is needed: the
 * geographic path has always drawn its tiles straight into a Mercator frame with no transform at
 * all. Paying 190 KB on every page load to serve the minority is the shape of decision that put
 * the EPANET engine on the critical path (Task 608).
 *
 * ---- 98%, AND THE 2% IS A REAL ANSWER ------------------------------------------------------
 *
 * 5,240 of 5,346 live projected CRS have a definition. The rest use projection methods proj4 does
 * not implement. `has()` answers honestly and the page is expected to act on it: no basemap, no
 * arrival, the project still opens and the coordinates are still the user's own. Substituting a
 * near-enough projection would put a map under somebody's network that is tens of metres out,
 * which is worse than no map — a wrong map is read as the truth.
 */
(function (root) {
	'use strict';
	// The same root as every other lpn_ module: a browser gives `window` and a harness in Node
	// gives `globalThis`, so one file serves both without either knowing about the other.
	var EngCalcs = root.EngCalcs = root.EngCalcs || {};

	var state = 'idle';          // idle | loading | ready | failed
	var defs = null;             // code -> proj4 string, as generated
	var registered = {};         // codes already handed to proj4
	var waiting = [];
	var WGS84 = 'EPSG:4326';

	function base() { return EngCalcs.suiteBase || '/engcalcs/'; }

	// ---- EPSG:3857, IN CLOSED FORM (Task 775) --------------------------------------------------
	//
	// **WEB MERCATOR NEEDS NO LIBRARY AND NO DOWNLOAD.** It is the spherical Mercator of the WGS 84
	// semi-major axis applied to WGS 84 latitude and longitude, EPSG's "Popular Visualisation
	// Pseudo Mercator" (method 1024): x = R lon, y = R ln tan(pi/4 + lat/2), R = 6,378,137 m. The
	// generated definitions file does not carry it (it was the lat/lon project's own frame when the
	// file was built), and a project on it must not wait 190 KB for a formula. So has() answers true
	// for it before anything has loaded, and forward()/inverse() never touch proj4 for it.
	var WEBMERC = '3857';
	var WEBMERC_R = 6378137;
	var DEG = Math.PI / 180;
	function webMercForward(ll) {
		var lat = Math.max(-89.999999, Math.min(89.999999, ll.lat));
		return { x: WEBMERC_R * ll.lon * DEG, y: WEBMERC_R * Math.log(Math.tan(Math.PI / 4 + lat * DEG / 2)) };
	}
	function webMercInverse(xy) {
		return { lon: xy.x / WEBMERC_R / DEG, lat: (2 * Math.atan(Math.exp(xy.y / WEBMERC_R)) - Math.PI / 2) / DEG };
	}

	// **EVERY CALLER IS ANSWERED, INCLUDING ONE THAT ARRIVES MID-FLIGHT.** The map repaints on a
	// pan, so the second, third and tenth caller all turn up while the first fetch is still in the
	// air; a loader that returned silently for those would leave the tiles missing until something
	// else happened to repaint. The same defect was found and fixed in the catalogue loader the
	// day before this was written, by a harness being the second caller.
	function settle(next) {
		state = next;
		var list = waiting, i;
		waiting = [];
		for (i = 0; i < list.length; i++) { list[i](); }
	}

	function loadScript(src) {
		return new Promise(function (resolve, reject) {
			var s = document.createElement('script');
			s.src = src;
			s.async = true;
			s.onload = function () { resolve(); };
			s.onerror = function () { reject(new Error('script')); };
			(document.head || document.documentElement).appendChild(s);
		});
	}

	/** Load the library and the definitions. `done` is called however it ends. */
	function load(done) {
		var cb = (typeof done === 'function') ? done : function () {};
		if (state === 'ready' || state === 'failed') { cb(); return; }
		waiting.push(cb);
		if (state === 'loading') { return; }
		state = 'loading';
		var p = root.proj4 ? Promise.resolve() : loadScript(base() + 'js/vendor/proj4.js');
		p.then(function () {
			if (!root.proj4) { throw new Error('proj4 did not define itself'); }
			return fetch(base() + 'js/data/epsg-proj4.json', { credentials: 'same-origin' });
		}).then(function (r) {
			if (!r.ok) { throw new Error('HTTP ' + r.status); }
			return r.json();
		}).then(function (doc) {
			if (!doc || !doc.defs) { throw new Error('no definitions'); }
			defs = doc.defs;
			settle('ready');
		}).catch(function () {
			// Silent. The project still opens and the numbers are still there; what is missing is
			// a picture behind them, and a dialog about a file the visitor never asked for is
			// noise. The caller sees has() answer false and says what it can.
			settle('failed');
		});
	}

	function ready() { return state === 'ready' && !!defs; }

	// `code` is 'EPSG:26929' or the bare number; the catalogue speaks the first and the file the
	// second, so this takes either rather than making every call site remember which.
	function key(code) {
		var s = String(code === undefined || code === null ? '' : code);
		return s.indexOf('EPSG:') === 0 ? s.slice(5) : s;
	}

	/** Is there a transform for this coordinate system, right now? */
	function has(code) {
		var k = key(code);
		if (k === WEBMERC) { return true; }
		return ready() && !!defs[k];
	}

	// Registered with proj4 on first use rather than all 5,240 at load: proj4 parses a definition
	// string when it is handed over, and a project uses exactly one.
	function name(code) {
		var k = key(code);
		if (!has(k)) { return null; }
		var id = 'LPNCRS:' + k;
		if (!registered[id]) {
			try { root.proj4.defs(id, defs[k]); } catch (e) { return null; }
			registered[id] = true;
		}
		return id;
	}

	/**
	 * lon/lat -> the plane, in the CRS's OWN unit (metres for most, US survey feet for much of
	 * State Plane). `ll` is `{lon, lat}` — SYSTEM order, x then y, as everything computed here is.
	 * Returns `{x, y}` or null where there is no transform.
	 */
	function forward(code, ll) {
		var id, out;
		if (key(code) === WEBMERC) {
			if (!ll || !isFinite(ll.lon) || !isFinite(ll.lat)) { return null; }
			out = webMercForward(ll);
			return (isFinite(out.x) && isFinite(out.y)) ? out : null;
		}
		id = name(code);
		if (!id || !ll || !isFinite(ll.lon) || !isFinite(ll.lat)) { return null; }
		try { out = root.proj4(WGS84, id, [ll.lon, ll.lat]); } catch (e) { return null; }
		if (!out || !isFinite(out[0]) || !isFinite(out[1])) { return null; }
		return { x: out[0], y: out[1] };
	}

	/** The plane -> lon/lat. Returns `{lon, lat}` or null. */
	function inverse(code, xy) {
		var id, out;
		if (key(code) === WEBMERC) {
			if (!xy || !isFinite(xy.x) || !isFinite(xy.y)) { return null; }
			out = webMercInverse(xy);
			return (isFinite(out.lon) && isFinite(out.lat)) ? out : null;
		}
		id = name(code);
		if (!id || !xy || !isFinite(xy.x) || !isFinite(xy.y)) { return null; }
		try { out = root.proj4(id, WGS84, [xy.x, xy.y]); } catch (e) { return null; }
		if (!out || !isFinite(out[0]) || !isFinite(out[1])) { return null; }
		return { lon: out[0], lat: out[1] };
	}

	/**
	 * **THE LON/LAT BOX A RECTANGLE OF THE PLANE COVERS**, which is what decides which tiles to
	 * fetch. The rectangle is stated in PLANE coordinates — eastings and northings as the CRS
	 * defines them, not the drawing frame's local, y-negated ones; the caller converts at
	 * `outwardX`/`outwardY`, which is the same seam every other outward-facing question uses. Not four corners: a projected rectangle's edges BOW, so on a wide view the extreme
	 * latitude can sit in the middle of an edge rather than at a corner, and a four-corner box
	 * leaves a strip of missing tiles along the top. Samples the perimeter instead.
	 *
	 * Deliberately generous — a tile too many costs one request, a tile too few is a hole in the
	 * map — and it gives up rather than guessing if any sample fails to invert, which is what
	 * happens when a view wanders outside the projection's domain.
	 */
	function boundsOf(code, x1, y1, x2, y2) {
		if (!has(code)) { return null; }
		var lo = Math.min, hi = Math.max,
			w = lo(x1, x2), e = hi(x1, x2), s = lo(y1, y2), n = hi(y1, y2),
			N = 8, i, t, pts = [], ll,
			west = 181, east = -181, south = 91, north = -91, any = false;
		for (i = 0; i <= N; i++) {
			t = i / N;
			pts.push({ x: w + (e - w) * t, y: s });
			pts.push({ x: w + (e - w) * t, y: n });
			pts.push({ x: w, y: s + (n - s) * t });
			pts.push({ x: e, y: s + (n - s) * t });
		}
		for (i = 0; i < pts.length; i++) {
			ll = inverse(code, pts[i]);
			if (!ll) { continue; }
			any = true;
			if (ll.lon < west) { west = ll.lon; }
			if (ll.lon > east) { east = ll.lon; }
			if (ll.lat < south) { south = ll.lat; }
			if (ll.lat > north) { north = ll.lat; }
		}
		if (!any) { return null; }
		// A box wider than half the world is a view that has wrapped or left the projection's
		// domain. Tiles for it would be most of the Earth, so the caller is told nothing instead.
		if (east - west > 180) { return null; }
		return { west: west, south: south, east: east, north: north };
	}

	/**
	 * **THREE CORNERS OF ONE WEB MERCATOR TILE, IN THE PLANE.** A tile is a square in Mercator
	 * and a curved quadrilateral here; three corners are what an affine needs, and an affine is
	 * the most an SVG `<image>` can be given. Absorbing the curvature TILE BY TILE is the whole
	 * accuracy decision: pinned once for the view the error reaches 2,338 m across this suite's
	 * 300 km scope, and pinned per tile it is far under the width of the line a pipe is drawn
	 * with.
	 *
	 * **IN THE PLANE, NOT IN THE DRAWING FRAME**, and that is deliberate rather than lazy. The
	 * drawing frame subtracts a local origin and NEGATES y (`cartesianY`), so a northing drawn
	 * raw would put the map upside down. That conversion is `inwardX`/`inwardY` in
	 * js/looped-network.js and it is the one boundary between the two frames — this file does not
	 * get a second opinion about it. Task 354 counts those call sites for exactly this reason.
	 */
	function tileCorners(code, lonW, latN, lonE, latS) {
		var tl = forward(code, { lon: lonW, lat: latN }),
			tr = forward(code, { lon: lonE, lat: latN }),
			bl = forward(code, { lon: lonW, lat: latS });
		if (!tl || !tr || !bl) { return null; }
		// Degenerate — zero area — would collapse the image to a line. It happens at the pole,
		// where every longitude is one point.
		var a = tr.x - tl.x, b = tr.y - tl.y, c = bl.x - tl.x, d = bl.y - tl.y;
		if (!isFinite(a) || !isFinite(b) || !isFinite(c) || !isFinite(d)) { return null; }
		if (Math.abs(a * d - b * c) < 1e-12) { return null; }
		return { tl: tl, tr: tr, bl: bl };
	}

	/**
	 * The plane's own unit, read out of its definition: `{ units: 'm' | 'us-ft' | 'ft' | ... }`, or
	 * `{ toMeter: n }` for the few stated as a bare factor, or null while not loaded or unknown.
	 * For the read-only Map coordinates line in Settings (Task 693); nothing converts through it.
	 */
	function unitOf(code) {
		var k = key(code), d = ready() ? defs[k] : null, m;
		if (k === WEBMERC) { return { units: 'm' }; }
		if (!d) { return null; }
		m = /\+units=(\S+)/.exec(d);
		if (m) { return { units: m[1] }; }
		m = /\+to_meter=(\S+)/.exec(d);
		return m ? { toMeter: parseFloat(m[1]) } : { units: 'm' };
	}

	/**
	 * **DOES AN ESRI OR OGC WKT .prj STATE THIS COORDINATE SYSTEM?** (Task 779.) An ArcGIS-written
	 * .prj carries no EPSG code, only the projection method and its parameters
	 * (NAD_1983_StatePlane_Texas_South_Central_FIPS_4204_Feet), so a name or a code cannot say. The
	 * test is the arithmetic: the WKT is turned into a proj4 definition and both are asked for the
	 * plane position of nine points about its origin; they are the same system when every answer
	 * agrees to 5 mm. Returns true, false, or null where the method is not one this reads (so the
	 * caller must not claim either). No datum shift is applied: both sides are taken as the
	 * geographic coordinates they are given, the way the suite reads every other .prj.
	 */
	// A WKT .prj as a proj4 definition string, or null where its method is not one this reads.
	// { def, uf, lon0, lat0 }: `uf` is the plane unit in metres.
	function wktDef(wkt) {
		var t = String(wkt || ''), P = {}, m, re = /PARAMETER\s*\[\s*"([^"]+)"\s*,\s*([-+0-9.eE]+)\s*\]/gi,
			proj, sph, units, uf, mapped, lon0, lat0, defStr;
		while ((m = re.exec(t))) { P[m[1].toLowerCase().replace(/[^a-z0-9]/g, '')] = parseFloat(m[2]); }
		proj = /PROJECTION\s*\[\s*"([^"]+)"/i.exec(t);
		sph = /SPHEROID\s*\[\s*"[^"]*"\s*,\s*([-+0-9.eE]+)\s*,\s*([-+0-9.eE]+)/i.exec(t);
		units = t.match(/UNIT\s*\[\s*"[^"]*"\s*,\s*([-+0-9.eE]+)/gi) || [];
		if (!proj || !sph || units.length < 2) { return null; }
		uf = parseFloat(/,\s*([-+0-9.eE]+)/.exec(units[units.length - 1])[1]);
		mapped = { transversemercator: 'tmerc', gausskruger: 'tmerc', lambertconformalconic: 'lcc', lambertconformalconic2sp: 'lcc',
			lambertconformalconic1sp: 'lcc', albers: 'aea', albersconicequalarea: 'aea', mercator: 'merc', mercator1sp: 'merc' }[proj[1].toLowerCase().replace(/[^a-z0-9]/g, '')];
		if (!mapped || !isFinite(uf) || !(uf > 0)) { return null; }
		lon0 = P.centralmeridian !== undefined ? P.centralmeridian : (P.longitudeoforigin !== undefined ? P.longitudeoforigin : 0);
		lat0 = P.latitudeoforigin !== undefined ? P.latitudeoforigin : 0;
		defStr = '+proj=' + mapped + ' +lat_0=' + lat0 + ' +lon_0=' + lon0;
		if (mapped === 'lcc' || mapped === 'aea') {
			defStr += ' +lat_1=' + (P.standardparallel1 !== undefined ? P.standardparallel1 : lat0);
			defStr += ' +lat_2=' + (P.standardparallel2 !== undefined ? P.standardparallel2 : (P.standardparallel1 !== undefined ? P.standardparallel1 : lat0));
		}
		if (mapped === 'tmerc' || mapped === 'lcc' || mapped === 'merc') { defStr += ' +k_0=' + (P.scalefactor !== undefined ? P.scalefactor : 1); }
		defStr += ' +x_0=' + ((P.falseeasting || 0) * uf) + ' +y_0=' + ((P.falsenorthing || 0) * uf);
		defStr += ' +a=' + parseFloat(sph[1]) + ' +rf=' + parseFloat(sph[2]) + ' +to_meter=' + uf + ' +no_defs';
		return { def: defStr, uf: uf, lon0: lon0, lat0: lat0 };
	}
	function matchWkt(code, wkt) {
		var id = name(code), d, probes = [], i, j, A, B, maxd = 0;
		if (!id || !root.proj4) { return null; }
		d = wktDef(wkt);
		if (!d) { return null; }
		try {
			root.proj4.defs('LPNCRS:WKT', d.def);
			for (i = -1; i <= 1; i++) { for (j = -1; j <= 1; j++) { probes.push([d.lon0 + i * 0.5, Math.max(-80, Math.min(80, d.lat0 + j * 0.5))]); } }
			for (i = 0; i < probes.length; i++) {
				A = root.proj4(WGS84, id, probes[i]); B = root.proj4(WGS84, 'LPNCRS:WKT', probes[i]);
				if (!isFinite(A[0]) || !isFinite(B[0])) { return false; }
				maxd = Math.max(maxd, Math.abs(A[0] - B[0]), Math.abs(A[1] - B[1]));
			}
		} catch (e) { return null; }
		return maxd < 0.005;
	}
	/**
	 * **A FILE'S OWN PROJECTED SYSTEM, AS A WAY BACK TO LONGITUDE AND LATITUDE** (Task 779; Tom,
	 * 2026-10-12: "Convert and say so"). `prj` is { epsg, wkt }: the system is identified by its EPSG
	 * code where this page holds a definition of it, else by the method and parameters in its WKT.
	 * Returns function (xy) -> { lon, lat } or null (not identifiable, or not loaded).
	 */
	function fileInverse(prj) {
		var id = null, d;
		if (!root.proj4 || !prj) { return null; }
		if (prj.epsg && has(prj.epsg) && key(prj.epsg) !== WEBMERC) { id = name(prj.epsg); }
		else if (prj.epsg && key(prj.epsg) === WEBMERC) { return function (xy) { return webMercInverse(xy); }; }
		if (!id) {
			d = wktDef(prj.wkt);
			if (!d) { return null; }
			try { root.proj4.defs('LPNCRS:FILE', d.def); } catch (e) { return null; }
			id = 'LPNCRS:FILE';
		}
		return function (xy) {
			var out;
			try { out = root.proj4(id, WGS84, [xy.x, xy.y]); } catch (e) { return null; }
			return (out && isFinite(out[0]) && isFinite(out[1])) ? { lon: out[0], lat: out[1] } : null;
		};
	}

	EngCalcs.lpnCrsLoad = load;
	EngCalcs.lpnCrsMatchWkt = matchWkt;
	EngCalcs.lpnCrsFileInverse = fileInverse;
	EngCalcs.lpnCrsUnit = unitOf;
	EngCalcs.lpnCrsReady = ready;
	EngCalcs.lpnCrsHas = has;
	EngCalcs.lpnCrsForward = forward;
	EngCalcs.lpnCrsInverse = inverse;
	EngCalcs.lpnCrsBounds = boundsOf;
	EngCalcs.lpnCrsTileCorners = tileCorners;
	// For a harness: the count it holds, so a test can say the file arrived without reaching in.
	EngCalcs.lpnCrsCount = function () { return ready() ? Object.keys(defs).length : 0; };
}(typeof window !== 'undefined' ? window : globalThis));
