/**
 * lpn_ GeoJSON writer (ROADMAP Task 728, export half). Pure: no DOM, no storage, no page state.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * One FeatureCollection per call, RFC 7946 (https://www.rfc-editor.org/rfc/rfc7946):
 *   - section 4: the coordinate reference system is WGS 84 and a position is [longitude, latitude],
 *     which is exactly how a geographic project is already stored, so no coordinate is converted;
 *   - section 3.1.1: a position is an array of numbers, longitude first;
 *   - section 3.1.4: a LineString has two or more positions (a pipe is node, vertices, node);
 *   - section 6.1: foreign members are allowed on any object, which is where `lwn` lives.
 *   No `crs` member is ever written: RFC 7946 removed it, so a file that carried one would not be
 *   GeoJSON. A project that is not on the Earth is REFUSED, not written with a made-up system
 *   (dev/geojson.md says why).
 *
 * **THE NUMBERS ARE THE USER'S CHARACTERS.** A coordinate or a property value the user typed and
 * has not changed is written as the exact text it was typed or read as (`9.00` stays `9.00`),
 * through the same EngCalcs.lpnNumText() the `.inp` writer uses; JSON allows trailing zeros. A
 * token that is not a legal JSON number (`.1`, `5.`, `+3`) falls back to the plain rendering of the
 * same value, which is the one place the characters differ and the value does not.
 *
 * **THE FIELD NAMES ARE NOT OURS.** They are Gusnet's (QGIS, github.com/angusmcb/gusnet,
 * gusnet/elements.py `Field`), which are WNTR's (USEPA/WNTR 1.5.0, wntr/network/elements.py
 * `_base_attributes`) except where Gusnet renamed one. `node_type`/`link_type`, `start_node_name`
 * and `end_node_name` are WNTR's. dev/geojson.md holds the table and says where the two differ.
 *
 * Values are in the units the project is in, and each feature names them (`units`): a stored unit
 * NAME (`ft`, `in`, `gpm`, `fth2o`, `psi`), never a factor and never a translated symbol, so the
 * file reads the same in all 27 languages.
 */
(function (root) {
	'use strict';
	var EngCalcs = root.EngCalcs = root.EngCalcs || {};

	// A JSON number, RFC 8259 section 6. Anything else cannot ride in the file as the user's text.
	var JSON_NUMBER = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/;

	/** A number to be written as these characters. */
	function Raw(text) { this.text = text; }

	/** The characters for one number: the user's own where still true and legal, else String(v). */
	function numText(rec, key, v) {
		var t = (EngCalcs.lpnNumText && rec) ? EngCalcs.lpnNumText(rec, key, v) : String(v);
		return JSON_NUMBER.test(t) ? t : String(v);
	}
	function num(rec, key, v) { return new Raw(numText(rec, key, v)); }

	/** JSON text, with Raw numbers written as their characters. Compact; the caller breaks lines. */
	function jsonText(v) {
		var out, i, k;
		if (v instanceof Raw) { return v.text; }
		if (v === null || v === undefined) { return 'null'; }
		if (typeof v === 'number') { return isFinite(v) ? String(v) : 'null'; }
		if (typeof v === 'string' || typeof v === 'boolean') { return JSON.stringify(v); }
		if (Array.isArray(v)) {
			out = [];
			for (i = 0; i < v.length; i++) { out.push(jsonText(v[i])); }
			return '[' + out.join(',') + ']';
		}
		out = [];
		for (k in v) {
			if (Object.prototype.hasOwnProperty.call(v, k) && v[k] !== undefined) {
				out.push(JSON.stringify(k) + ':' + jsonText(v[k]));
			}
		}
		return '{' + out.join(',') + '}';
	}

	var NODE_TYPE = { junction: 'Junction', reservoir: 'Reservoir', tank: 'Tank' };
	var LINK_TYPE = { pipe: 'Pipe', pump: 'Pump', valve: 'Valve' };
	// Gusnet's HeadlossFormula values (gusnet/elements.py), for the project-level statement.
	var FORMULA = { hw: 'H-W', dw: 'D-W', manning: 'C-M' };

	/**
	 * Export a saved lpn_ document as GeoJSON.
	 *
	 *   doc   the serialized document (serializeProject() or a `.lwn` file's parsed text)
	 *   opts  .effective(el, prop)    scenario resolver; default reads the Base `_prop`
	 *         .coordOverride(id)      {x, y} the active scenario moved this node to, or null
	 *         .customProps(el)        [{key, value}] this element carries, or nothing
	 *         .results                null (not solved) or { nodes: {id: {head, pressure, demand}},
	 *                                 links: {id: {flowrate, headloss, unit_headloss, velocity}},
	 *                                 time: seconds | undefined }, every value already in the
	 *                                 project's result units
	 *         .scenarioName           stated in the file
	 *         .crsInverse(code, {x,y}) plane -> {lon, lat}, for a projected project; default
	 *                                 EngCalcs.lpnCrsInverse
	 *         .crsHas(code)           is there a transform for it; default EngCalcs.lpnCrsHas
	 *
	 * Returns { ok: true, text, counts: {...}, hasResults } or
 	 *         { ok: false, error: 'local' | 'range' | 'empty' | 'crs', detail }.
	 */
	EngCalcs.lpnExportGeoJson = function (doc, opts) {
		opts = opts || {};
		var eff = typeof opts.effective === 'function' ? opts.effective
				: function (el, prop) { return el['_' + prop]; },
			covOf = typeof opts.coordOverride === 'function' ? opts.coordOverride : function () { return null; },
			units = doc.units || {}, settings = doc.settings || {}, project = doc.project || {},
			origin = (doc.origin && isFinite(doc.origin.x) && isFinite(doc.origin.y)) ? doc.origin : { x: 0, y: 0 },
			geographic = project.coords === 'geo',
			crsCode = (!geographic && project.crs) ? String(project.crs) : '',
			inverse = opts.crsInverse || EngCalcs.lpnCrsInverse,
			results = opts.results || null, hasResults = !!results,
			nodes = doc.nodes || [], links = doc.links || [],
			nodeById = {}, features = [], counts = { junction: 0, reservoir: 0, tank: 0, pipe: 0, pump: 0, valve: 0, shape: 0 },
			i, j, bad = null;

		function refuse(error, detail) { return { ok: false, error: error, detail: detail === undefined ? '' : detail }; }
		function isActive(el) {
			var a = eff(el, 'active');
			return a === undefined || a === null || a === true;
		}

		if (!geographic && !crsCode) { return refuse('local'); }
		// A coordinate system the page has no definition for (or whose definitions are not loaded)
		// is its own refusal; the page loads the table before asking (exportGeoJsonResult()).
		if (!geographic) {
			var knows = typeof opts.crsHas === 'function' ? opts.crsHas
				: (opts.crsInverse ? function () { return true; } : EngCalcs.lpnCrsHas);
			if (typeof inverse !== 'function' || typeof knows !== 'function' || !knows(crsCode)) {
				return refuse('crs', crsCode);
			}
		}

		/**
		 * One position, [longitude, latitude]. A geographic project's stored numbers ARE those, so
		 * they go out as their own characters; a projected project's are eastings and northings,
		 * so they are converted by the same transform the page's map uses and are numbers of ours
		 * (stated in `lwn.coordinates`). null where a position cannot be made.
		 */
		function position(rec, ax, ay) {
			var ll;
			if (geographic) {
				if (!(ax >= -180 && ax <= 180 && ay >= -90 && ay <= 90)) {
					if (!bad) { bad = (rec && rec.id !== undefined ? rec.id + ': ' : '') + ax + ', ' + ay; }
					return null;
				}
				return [num(rec, 'x', ax), num(rec, 'y', ay)];
			}
			ll = inverse(crsCode, { x: ax, y: ay });
			if (!ll || !(ll.lon >= -180 && ll.lon <= 180 && ll.lat >= -90 && ll.lat <= 90)) {
				if (!bad) { bad = (rec && rec.id !== undefined ? rec.id + ': ' : '') + ax + ', ' + ay; }
				return null;
			}
			return [new Raw(String(ll.lon)), new Raw(String(ll.lat))];
		}
		// A scenario's own position is already absolute (the .inp writer's rule); a stored one is
		// local to the document's origin, which is {0, 0} in every geographic file.
		function absX(rec, cov) { return (cov && typeof cov.x === 'number') ? cov.x : (rec.x || 0) + origin.x; }
		function absY(rec, cov) { return (cov && typeof cov.y === 'number') ? cov.y : (rec.y || 0) + origin.y; }
		/** A typed number, as its characters, and its unit name noted on `u` where it has one. */
		function put(p, u, name, rec, key, v, unitName) {
			if (typeof v !== 'number' || !isFinite(v)) { return; }
			p[name] = num(rec, key, v);
			if (unitName) { u[name] = unitName; }
		}
		function putText(p, name, v) {
			if (v === undefined || v === null || v === '') { return; }
			p[name] = String(v);
		}
		// ---- patterns and curves, in Gusnet's meaning ----
		// Gusnet (gusnet/pattern_curve.py, read 2026-10-06) reads a pattern field as the MULTIPLIERS,
		// space separated ("1 1.2 0.8"), and a curve field as POINTS ("(0, 10), (2, 5)"), not as a
		// name. So the Gusnet-named field carries the numbers and a WNTR-style `<field>_name` carries
		// the name. Written from the project's own patterns and curves; a multiplier is the exact
		// characters it was typed or read as, joined by a space. A point is the plain rendering of
		// its number (the project keeps no text for a curve point), joined as Gusnet writes it.
		var patById = {}, curveById = {};
		(doc.patterns || []).forEach(function (pt) { if (pt && pt.id !== undefined) { patById[pt.id] = pt; } });
		(doc.curves || []).forEach(function (c) { if (c && c.id !== undefined) { curveById[c.id] = c; } });
		function putPattern(p, field, id) {
			var pt, parts = [], k;
			if (id === undefined || id === null || id === '') { return; }
			p[field + '_name'] = String(id);
			pt = Object.prototype.hasOwnProperty.call(patById, id) ? patById[id] : null;
			if (!pt || !(pt.multipliers || []).length) { return; }
			for (k = 0; k < pt.multipliers.length; k++) { parts.push(numText(pt, 'm' + k, pt.multipliers[k])); }
			p[field] = parts.join(' ');
		}
		function putCurve(p, field, id) {
			var c, pts;
			if (id === undefined || id === null || id === '') { return; }
			p[field + '_name'] = String(id);
			c = Object.prototype.hasOwnProperty.call(curveById, id) ? curveById[id] : null;
			pts = (c && EngCalcs.lpnCurvePoints) ? EngCalcs.lpnCurvePoints(c) : [];
			if (!pts.length) { return; }
			p[field] = pts.map(function (q) { return '(' + q[0] + ', ' + q[1] + ')'; }).join(', ');
		}
		// A RESULT is a number of ours with float noise in its tail (0.30000000000000004), so it is
		// rounded to six significant figures. Typed inputs are never rounded.
		function round6(v) { return (typeof v === 'number' && isFinite(v)) ? Number(v.toPrecision(6)) : v; }
		function putResult(p, u, name, v, unitName) { put(p, u, name, null, '', round6(v), unitName); }
		function extras(p, el) {
			if (typeof opts.customProps !== 'function') { return; }
			(opts.customProps(el) || []).forEach(function (cp) {
				if (cp && cp.key && cp.value !== undefined && cp.value !== null && cp.value !== '') {
					// The text as typed, even for a numeric design: a string cannot be reformatted.
					p[cp.key] = String(cp.value);
				}
			});
		}
		function finish(p, u, own) {
			if (Object.keys(u).length) { p.units = u; }
			p.has_results = own;
			return p;
		}
		var uLen = units.lpn_u_length, uDia = units.lpn_u_diameter, uHead = units.lpn_u_elevhead,
			uFlow = units.lpn_u_flow, uPress = units.lpn_u_pressure, uVel = units.lpn_u_velocity,
			uGrad = units.lpn_u_gradient, method = settings.method || 'hw',
			uRough = method === 'dw' ? units.lpn_u_roughness : '';

		// ---- nodes ----
		for (i = 0; i < nodes.length; i++) {
			var nd = nodes[i], cov, pos, p, u, rs, q;
			nodeById[nd.id] = nd;
			if (!NODE_TYPE[nd.type] || !isActive(nd)) { continue; }
			cov = covOf(nd.id);
			pos = position(nd, absX(nd, cov), absY(nd, cov));
			if (!pos) { continue; }
			p = { name: String(nd.id), node_type: NODE_TYPE[nd.type] };
			u = {};
			putText(p, 'description', nd.desc);
			if (nd.type === 'junction') {
				put(p, u, 'elevation', nd, 'elev', nd.elev || 0, uHead);
				var rows = EngCalcs.lpnDemandRows ? EngCalcs.lpnDemandRows(nd, eff(nd, 'demand') || 0) : null;
				if (rows) {
					put(p, u, 'base_demand', rows[0].rec, rows[0].key, rows[0].base || 0, uFlow);
					// A blank pattern means the project's default pattern ([OPTIONS] Pattern), which is
					// what EPANET applies; written resolved, so a reader does not apply none.
					putPattern(p, 'demand_pattern', rows[0].pattern || (EngCalcs.lpnEffDefaultPattern ? EngCalcs.lpnEffDefaultPattern() : doc.defaultPattern));
					// Further demand rows are the user's too; their count is stated so a reader of the
					// table knows base_demand is not the junction's whole demand.
					if (rows.length > 1) { p.demand_rows = rows.length; }
				}
			} else if (nd.type === 'reservoir') {
				var rh = eff(nd, 'head');
				if (rh === undefined || rh === null || rh === '') { put(p, u, 'base_head', nd, 'elev', nd.elev || 0, uHead); }
				else { put(p, u, 'base_head', nd, '_head', rh, uHead); }
				putPattern(p, 'head_pattern', nd.headPattern);
			} else {
				put(p, u, 'elevation', nd, 'elev', nd.elev || 0, uHead);
				put(p, u, 'init_level', nd, '_level', eff(nd, 'level') || 0, uHead);
				put(p, u, 'min_level', nd, 'minLevel', nd.minLevel || 0, uHead);
				put(p, u, 'max_level', nd, 'maxLevel', nd.maxLevel || 0, uHead);
				// Tank diameter is in the LENGTH unit, not the pipe-diameter unit (CLAUDE.md).
				put(p, u, 'tank_diameter', nd, 'tankDiameter', nd.tankDiameter || 0, uLen);
				putCurve(p, 'vol_curve', nd.volCurve);
				// EPANET's own MinVol column, which this page does not hold: 0, as the .inp writer
				// writes it. With a volume curve EPANET takes the minimum volume from the curve.
				p.min_vol = new Raw('0');
			}
			extras(p, nd);
			rs = results && results.nodes && results.nodes[nd.id];
			if (rs) {
				putResult(p, u, 'head', rs.head, uHead);
				putResult(p, u, 'pressure', rs.pressure, uPress);
				putResult(p, u, 'demand', rs.demand, uFlow);
			}
			features.push({ type: 'Feature', geometry: { type: 'Point', coordinates: pos },
				properties: finish(p, u, !!rs) });
			counts[nd.type]++;
		}

		// ---- links ----
		for (j = 0; j < links.length; j++) {
			var lk = links[j], a = nodeById[lk.from], b = nodeById[lk.to], line = [], v, vp, lp, lu, ls;
			if (!LINK_TYPE[lk.type] || !isActive(lk)) { continue; }
			// A link to a node this scenario switched off or that is absent has nowhere to land.
			if (!a || !b || !isActive(a) || !isActive(b)) { continue; }
			var ca = covOf(a.id), cb = covOf(b.id);
			line.push(position(a, absX(a, ca), absY(a, ca)));
			for (v = 0; v < (lk.verts || []).length; v++) {
				vp = position(lk.verts[v], absX(lk.verts[v], null), absY(lk.verts[v], null));
				line.push(vp);
			}
			line.push(position(b, absX(b, cb), absY(b, cb)));
			if (line.indexOf(null) >= 0) { continue; }
			lp = { name: String(lk.id), link_type: LINK_TYPE[lk.type],
				start_node_name: String(lk.from), end_node_name: String(lk.to) };
			lu = {};
			putText(lp, 'description', lk.desc);
			var closed = eff(lk, 'status') === 'closed';
			if (lk.type === 'pipe') {
				put(lp, lu, 'length', lk, '_length', eff(lk, 'length') || 0, uLen);
				put(lp, lu, 'diameter', lk, '_diameter', eff(lk, 'diameter') || 0, uDia);
				put(lp, lu, 'roughness', lk, '_roughness', eff(lk, 'roughness') || 0, uRough);
				var ml = null;
				if (eff(lk, 'fittingsId') && EngCalcs.lpnFittingsSum) {
					(doc.fittingSets || []).forEach(function (f) { if (f && f.id === eff(lk, 'fittingsId')) { ml = f; } });
				}
				if (ml) { put(lp, lu, 'minor_loss', null, '', EngCalcs.lpnFittingsSum(ml), ''); }
				else { put(lp, lu, 'minor_loss', lk, '_k', eff(lk, 'k') || 0, ''); }
				lp.initial_status = closed ? 'Closed' : 'Open';
				putText(lp, 'pipe_type', eff(lk, 'typeId'));
			} else if (lk.type === 'pump') {
				lp.pump_type = 'HEAD';
				putCurve(lp, 'pump_curve', eff(lk, 'curveId'));
				if (typeof lk.speed === 'number') { put(lp, lu, 'base_speed', lk, 'speed', lk.speed, ''); }
				putPattern(lp, 'speed_pattern', lk.speedPattern);
				lp.initial_status = closed ? 'Closed' : 'Open';
			} else {
				var vt = String(lk.valveType || 'TCV').toUpperCase(), set = eff(lk, 'setting') || 0;
				lp.valve_type = vt;
				put(lp, lu, 'diameter', lk, '_diameter', eff(lk, 'diameter') || 0, uDia);
				// Gusnet gives each valve type its own field; the unit follows the type (EPANET: PRV,
				// PSV, PBV pressure; FCV flow; TCV a loss coefficient; GPV a headloss curve).
				if (vt === 'PRV' || vt === 'PSV' || vt === 'PBV') { put(lp, lu, 'pressure_setting', lk, '_setting', set, uPress); }
				else if (vt === 'FCV') { put(lp, lu, 'flow_setting', lk, '_setting', set, uFlow); }
				else if (vt === 'GPV') { putCurve(lp, 'headloss_curve', eff(lk, 'curveId')); }
				else { put(lp, lu, 'throttle_setting', lk, '_setting', set, ''); }
				put(lp, lu, 'minor_loss', lk, '_k', vt === 'TCV' ? 0 : (eff(lk, 'k') || 0), '');
				lp.valve_status = closed ? 'Closed' : 'Active';
			}
			extras(lp, lk);
			ls = results && results.links && results.links[lk.id];
			if (ls) {
				putResult(lp, lu, 'flowrate', ls.flowrate, uFlow);
				putResult(lp, lu, 'headloss', ls.headloss, uHead);
				putResult(lp, lu, 'unit_headloss', ls.unit_headloss, uGrad);
				putResult(lp, lu, 'velocity', ls.velocity, uVel);
			}
			features.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: line },
				properties: finish(lp, lu, !!ls) });
			counts[lk.type]++;
		}

		// ---- Shapes (Task 779): map annotation, in no scenario ----
		(doc.shapes || []).forEach(function (sh) {
			var pts = sh.pts || [], ring = [], k, g, sp, area = 0, c;
			for (k = 0; k < pts.length; k++) {
				c = position(pts[k], absX(pts[k], null), absY(pts[k], null));
				if (!c) { return; }
				// An elevation the file stated rides through as the third number (RFC 7946 3.1.1).
				if (typeof pts[k].z === 'number') { c.push(num(pts[k], 'z', pts[k].z)); }
				ring.push(c);
			}
			if (!ring.length) { return; }
			if (ring.length === 1) { g = { type: 'Point', coordinates: ring[0] }; }
			else if (sh.closed && ring.length >= 3) {
				// RFC 7946 3.1.6: a linear ring is closed (its first and last positions are the same)
				// and an exterior ring is counterclockwise. The Shape keeps the order it was drawn in;
				// a clockwise one is written reversed, from the same first point.
				for (k = 0; k < pts.length; k++) {
					var a = ring[k], b = ring[(k + 1) % ring.length];
					area += (+jsonText(a[0])) * (+jsonText(b[1])) - (+jsonText(b[0])) * (+jsonText(a[1]));
				}
				if (area < 0) { ring = [ring[0]].concat(ring.slice(1).reverse()); }
				g = { type: 'Polygon', coordinates: [ring.concat([ring[0]])] };
			} else { g = { type: 'LineString', coordinates: ring }; }
			sp = { name: String(sh.id), element: 'Shape' };
			putText(sp, 'description', sh.desc);
			// The other properties an imported feature stated, carried through as they came.
			Object.keys(sh.props || {}).forEach(function (key) { if (!(key in sp)) { sp[key] = sh.props[key]; } });
			var f = { type: 'Feature' };
			if (sh.fid !== undefined) { f.id = sh.fid; }
			f.geometry = g; f.properties = sp;
			features.push(f);
			counts.shape++;
		});

		if (bad) { return refuse('range', bad); }
		if (!features.length) { return refuse('empty'); }

		var meta = {
			format: 'LibreWaterNet GeoJSON',
			version: 1,
			schema: 'Field names follow Gusnet (QGIS) and WNTR 1.5.0; see dev/geojson.md',
			project: project.name || '',
			scenario: opts.scenarioName || '',
			headloss_formula: FORMULA[method] || method,
			// The unit names every quantity in this file is in. A feature's own `units` repeats the
			// ones it carries, so a feature copied out of the file still says what it is in.
			units: units,
			unit_note: 'Values are in this project\'s own units, named in units, exactly as typed. They are not SI and not converted to WNTR\'s units. Gusnet reads a layer in the units of its flow unit (traditional for gpm and cfs, SI for L/s); this file matches that for a US project (ft, in, gpm, psi) except Darcy-Weisbach roughness (this project: ft, Gusnet: 0.001 ft) and unit_headloss (this project: the gradient unit named in units, for example percent; Gusnet: ft per 1000 ft or m per km); an SI project differs where its pressure is in m of water or kPa, and its roughness is in m or mm.',
			headloss_sign: 'headloss is as the map shows it. EPANET and WNTR report the headloss of a pump as negative.',
			result_precision: 'Result numbers are rounded to 6 significant figures; typed inputs are never rounded.',
			coordinates: geographic
				? 'Longitude and latitude exactly as stored in the project (WGS 84).'
				: 'Converted from ' + crsCode + ' to longitude and latitude by proj4 with no datum shift, so a NAD83 system such as State Plane is treated as WGS 84, which agrees to under a metre in North America.',
			results: hasResults
				? { included: true, note: 'Results are those on the screen when the file was written.' +
					(results && typeof results.time === 'number' ? ' Time of day, seconds: ' + results.time + '.' : '') }
				: { included: false, note: 'The network was not solved, so no results are in this file.' }
		};
		var lines = features.map(function (f) { return jsonText(f); });
		return {
			ok: true, counts: counts, hasResults: hasResults,
			text: '{"type":"FeatureCollection","lwn":' + jsonText(meta) + ',\n"features":[\n' +
				lines.join(',\n') + '\n]}\n'
		};
	};

	/**
	 * **READ A GeoJSON FILE'S POINTS, LINES AND POLYGONS AS SHAPES** (Task 779). Pure: the caller
	 * places the positions in the project. RFC 7946: section 3.1.1 a position is [longitude,
	 * latitude] and may carry an elevation; 3.1.2 Point; 3.1.4 LineString (two or more positions);
	 * 3.1.6 Polygon, whose first ring is the exterior and whose first and last positions are the
	 * same; 3.1.3, 3.1.5 and 3.1.7 the Multi* forms; 3.1.8 GeometryCollection; 3.2 Feature; 3.3
	 * FeatureCollection. A bare geometry or a single Feature is read as a collection of one.
	 *
	 * **NOTHING IS DROPPED WITHOUT BEING NAMED.** A feature carrying `node_type` or `link_type` is a
	 * network asset (the writer above and Gusnet both mark them so) and is listed, not imported. A
	 * geometry that is not one of the seven, or a position that is not a longitude and latitude, is
	 * listed. A Multi* or a GeometryCollection becomes one Shape per part and is counted; a polygon's
	 * holes are counted. The closing position of a ring is the first position again, so it is not a
	 * point of the Shape. A third number is carried as `z`. Every number keeps its characters where
	 * the browser reports them (JSON.parse source text access), else String() of the value.
	 *
	 * Returns { ok: true, shapes: [{ name, srcName, desc, props, fid, closed, pts: [{ lon, lat, z?, tok }] }],
	 *           skipped: [{ name, why: 'network' | 'geometry' | 'position' }], holes, multipart }
	 *      or { ok: false, detail }.
	 */
	EngCalcs.lpnGeoJsonShapes = function (text) {
		var root2, out = [], skipped = [], holes = 0, multipart = 0;
		try {
			root2 = JSON.parse(String(text), function (key, value, ctx) {
				if (typeof value === 'number' && ctx && typeof ctx.source === 'string') {
					return new Num(value, ctx.source);
				}
				return value;
			});
		} catch (e) { return { ok: false, detail: String(e && e.message ? e.message : e) }; }
		function n(v) { return v instanceof Num ? v.v : v; }
		function tokOf(v) { return v instanceof Num ? v.t : (typeof v === 'number' ? String(v) : undefined); }
		function plain(v) {
			var o, k;
			if (v instanceof Num) { return v.v; }
			if (Array.isArray(v)) { return v.map(plain); }
			if (v && typeof v === 'object') { o = {}; for (k in v) { if (Object.prototype.hasOwnProperty.call(v, k)) { o[k] = plain(v[k]); } } return o; }
			return v;
		}
		function pos(c) {
			var lon, lat, p;
			if (!Array.isArray(c) || c.length < 2) { return null; }
			lon = n(c[0]); lat = n(c[1]);
			if (typeof lon !== 'number' || typeof lat !== 'number' || !(lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90)) { return null; }
			p = { lon: lon, lat: lat, tok: { x: tokOf(c[0]), y: tokOf(c[1]) } };
			if (c.length > 2 && typeof n(c[2]) === 'number') { p.z = n(c[2]); p.tok.z = tokOf(c[2]); }
			return p;
		}
		function list(cs) {
			var r = [], i, p;
			if (!Array.isArray(cs)) { return null; }
			for (i = 0; i < cs.length; i++) { p = pos(cs[i]); if (!p) { return null; } r.push(p); }
			return r;
		}
		function sameXY(a, b) { return a.lon === b.lon && a.lat === b.lat; }
		// One geometry into Shapes (pushed onto `into`); false when it cannot be read.
		function geom(g, into) {
			var p, l, i, parts;
			if (!g || typeof g !== 'object') { return false; }
			switch (g.type) {
			case 'Point':
				p = pos(g.coordinates); if (!p) { return 'position'; }
				into.push({ closed: false, pts: [p] }); return true;
			case 'LineString':
				l = list(g.coordinates); if (!l || !l.length) { return 'position'; }
				into.push({ closed: false, pts: l }); return true;
			case 'Polygon':
				if (!Array.isArray(g.coordinates) || !g.coordinates.length) { return 'position'; }
				l = list(g.coordinates[0]); if (!l || !l.length) { return 'position'; }
				if (l.length > 1 && sameXY(l[0], l[l.length - 1])) { l.pop(); }
				holes += g.coordinates.length - 1;
				into.push({ closed: l.length >= 3, pts: l }); return true;
			case 'MultiPoint': case 'MultiLineString': case 'MultiPolygon':
				if (!Array.isArray(g.coordinates)) { return 'position'; }
				parts = [];
				for (i = 0; i < g.coordinates.length; i++) {
					var r = geom({ type: g.type.slice(5), coordinates: g.coordinates[i] }, parts);
					if (r !== true) { return r; }
				}
				if (parts.length > 1) { multipart++; }
				Array.prototype.push.apply(into, parts); return true;
			case 'GeometryCollection':
				if (!Array.isArray(g.geometries)) { return 'geometry'; }
				parts = [];
				for (i = 0; i < g.geometries.length; i++) {
					var r2 = geom(g.geometries[i], parts);
					if (r2 !== true) { return r2; }
				}
				if (parts.length > 1) { multipart++; }
				Array.prototype.push.apply(into, parts); return true;
			default:
				return 'geometry';
			}
		}
		var feats;
		if (!root2 || typeof root2 !== 'object') { return { ok: false, detail: 'not a JSON object' }; }
		if (root2.type === 'FeatureCollection') {
			if (!Array.isArray(root2.features)) { return { ok: false, detail: 'a FeatureCollection with no features list' }; }
			feats = root2.features;
		} else if (root2.type === 'Feature') { feats = [root2]; }
		else if (typeof root2.type === 'string') { feats = [{ type: 'Feature', geometry: root2, properties: null }]; }
		else { return { ok: false, detail: 'no GeoJSON type member' }; }
		feats.forEach(function (f, idx) {
			var pr = (f && f.properties && typeof f.properties === 'object') ? plain(f.properties) : {},
				name = (pr.name !== undefined && pr.name !== null && pr.name !== '') ? String(pr.name)
					: (f && f.id !== undefined ? String(plain(f.id)) : ''),
				label = name || ('#' + (idx + 1)), got = [], r, props = {}, k;
			if (pr.node_type !== undefined || pr.link_type !== undefined) { skipped.push({ name: label, why: 'network' }); return; }
			r = geom(f && f.geometry, got);
			if (r !== true) { skipped.push({ name: label, why: r === 'position' ? 'position' : 'geometry' }); return; }
			for (k in pr) {
				if (Object.prototype.hasOwnProperty.call(pr, k) && k !== 'name' && k !== 'description' && k !== 'element') { props[k] = pr[k]; }
			}
			got.forEach(function (sh) {
				// The ID is tried from a single-part feature's name; every part keeps the name the
				// file gave it (`srcName`), so the page can carry it where it cannot be an ID.
				sh.name = got.length > 1 ? '' : name;
				sh.srcName = name;
				if (pr.description !== undefined && pr.description !== null && pr.description !== '') { sh.desc = String(pr.description); }
				if (Object.keys(props).length) { sh.props = JSON.parse(JSON.stringify(props)); }
				if (f && f.id !== undefined && got.length === 1) { sh.fid = plain(f.id); }
				out.push(sh);
			});
		});
		return { ok: true, shapes: out, skipped: skipped, holes: holes, multipart: multipart };
	};
	/** A number and the characters it was written as in the file. */
	function Num(v, t) { this.v = v; this.t = t; }
}(typeof globalThis !== 'undefined' ? globalThis : this));
