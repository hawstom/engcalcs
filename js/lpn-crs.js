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
		var id = name(code), out;
		if (!id || !ll || !isFinite(ll.lon) || !isFinite(ll.lat)) { return null; }
		try { out = root.proj4(WGS84, id, [ll.lon, ll.lat]); } catch (e) { return null; }
		if (!out || !isFinite(out[0]) || !isFinite(out[1])) { return null; }
		return { x: out[0], y: out[1] };
	}

	/** The plane -> lon/lat. Returns `{lon, lat}` or null. */
	function inverse(code, xy) {
		var id = name(code), out;
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
		if (!d) { return null; }
		m = /\+units=(\S+)/.exec(d);
		if (m) { return { units: m[1] }; }
		m = /\+to_meter=(\S+)/.exec(d);
		return m ? { toMeter: parseFloat(m[1]) } : { units: 'm' };
	}

	EngCalcs.lpnCrsLoad = load;
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
