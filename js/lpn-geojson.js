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
		// The properties a document stores under their own name rather than an underscore (all
		// overridable since 2026-10-12; LPN_BARE_PROP in js/looped-network.js).
		var BARE = { elev: 1, bottomElev: 1, minLevel: 1, maxLevel: 1, tankDiameter: 1, volCurve: 1, mixingModel: 1, mixingFraction: 1,
				headPattern: 1, speed: 1, speedPattern: 1 },
			// A caller's resolver written before then reads `_prop` only; a bare one it cannot find
			// is read off the element, which is what Base holds.
			effIn = typeof opts.effective === 'function' ? opts.effective : function (el, prop) { return el['_' + prop]; },
			eff = function (el, prop) { var v = effIn(el, prop); return (v === undefined && BARE[prop]) ? el[prop] : v; },
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
				put(p, u, 'elevation', nd, 'elev', (eff(nd, 'elev') || 0), uHead);
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
				if (rh === undefined || rh === null || rh === '') { put(p, u, 'base_head', nd, 'elev', (eff(nd, 'elev') || 0), uHead); }
				else { put(p, u, 'base_head', nd, '_head', rh, uHead); }
				putPattern(p, 'head_pattern', eff(nd, 'headPattern'));
			} else {
				// `elevation` is the GROUND, as for every node and as in the DXF (ELEVATION); the BASE the
				// levels stand on, EPANET's tank Elevation, is its own field (Tom, 2026-10-11). Both are
				// the scenario's own where it holds one (every property is overridable, 2026-10-12).
				var bEl = eff(nd, 'bottomElev'), baseKey = (typeof bEl === 'number' && isFinite(bEl)) ? 'bottomElev' : 'elev';
				put(p, u, 'elevation', nd, 'elev', (eff(nd, 'elev') || 0), uHead);
				put(p, u, 'base_elevation', nd, baseKey, eff(nd, baseKey) || 0, uHead);
				put(p, u, 'init_level', nd, '_level', eff(nd, 'level') || 0, uHead);
				put(p, u, 'min_level', nd, 'minLevel', (eff(nd, 'minLevel') || 0), uHead);
				put(p, u, 'max_level', nd, 'maxLevel', (eff(nd, 'maxLevel') || 0), uHead);
				// Tank diameter is in the LENGTH unit, not the pipe-diameter unit (CLAUDE.md).
				put(p, u, 'tank_diameter', nd, 'tankDiameter', (eff(nd, 'tankDiameter') || 0), uLen);
				putCurve(p, 'vol_curve', eff(nd, 'volCurve'));
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
				if (typeof eff(lk, 'speed') === 'number') { put(lp, lu, 'base_speed', lk, 'speed', eff(lk, 'speed'), ''); }
				putPattern(lp, 'speed_pattern', eff(lk, 'speedPattern'));
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

		// ---- Shapes (Task 779): map annotation; the caller passes only the open scenario's active ones ----
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
	EngCalcs.lpnGeoJsonShapes = function (text, preRead) {
		var root2, out = [], skipped = [], holes = 0, multipart = 0, rd;
		// `preRead` is a tree readJson() already made (the network import hands over its Shape
		// features this way, so their characters are not lost to a second JSON.stringify).
		if (preRead) { root2 = preRead; }
		else {
			rd = readJson(text);
			if (!rd.ok) { return { ok: false, detail: rd.detail }; }
			root2 = rd.value;
		}
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
	// =============================================================================================
	// **IMPORT A GeoJSON FILE AS A NETWORK** (ROADMAP Task 728, import half; Tom, 2026-10-06: *"yes
	// to shapefile + GeoJSON import behind one mapping step"*). Pure: the page builds the document
	// and shows the dialog and the report. dev/geojson.md holds the rules; in short:
	//
	//   - A file this suite wrote (`lwn.format`) is read by its own schema, the one the writer above
	//     states, and comes back as the network it was: the same IDs, kinds, values, characters and
	//     positions. Nothing is asked.
	//   - Any other file goes through ONE mapping step: the page shows the attribute fields found
	//     on its points and its lines, the user says which property each fills and what unit a
	//     number is in, and lpnGeoJsonNetBuild() makes junctions from the points and pipes from the
	//     lines. A line end that lands on no point within the stated tolerance gets a junction of
	//     its own; a LineString's interior positions become the pipe's bends.
	//   - RFC 7946 section 4: positions are WGS 84 longitude and latitude. A legacy `crs` member
	//     naming CRS84 or EPSG:4326 is that frame and is read, and said; one naming NAD83 (EPSG:4269) is read the same way, with a note that the frames differ by 1 to 2 m; one naming any other frame
	//     is refused with its name, because a guess would place the network somewhere false.
	//   - **NOTHING IS DROPPED OR CHANGED WITHOUT BEING NAMED.** Every feature not imported, every
	//     ID changed, every junction added, every line end moved and every default used is a note
	//     with the IDs it concerns, and the page lists every note.
	//   - **THE NUMBERS ARE THE USER'S CHARACTERS.** Every number keeps the text it was written as
	//     in a `tok` bag beside it, under the key the `.inp` and GeoJSON writers read.
	// =============================================================================================

	var GJ_TYPES = { Point: 'point', MultiPoint: 'point', LineString: 'line', MultiLineString: 'line' };
	// The legacy names (GeoJSON 2008 section 3) for the one frame RFC 7946 allows.
	var GJ_WGS84 = /^(urn:ogc:def:crs:OGC:1\.3:CRS84|urn:ogc:def:crs:OGC::CRS84|OGC:CRS84|CRS:?84|urn:ogc:def:crs:EPSG:[0-9.]*:4326|EPSG:+4326|https?:\/\/www\.opengis\.net\/def\/crs\/(OGC\/1\.3\/CRS84|EPSG\/0\/4326))$/i;
	// NAD83 (Tom, 2026-10-16): read as WGS 84 with no transform, so the stored numbers equal the
	// file's, and said. The two frames differ by about 1 to 2 m in the continental US.
	var GJ_NAD83 = /^(urn:ogc:def:crs:EPSG:[0-9.]*:4269|EPSG:+4269|https?:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/4269)$/i;
	// What the writer above puts on every feature. A file of ours whose features carry any other
	// key carries it as a custom property and says so.
	var GJ_OURS_NODE = ['name', 'node_type', 'description', 'elevation', 'base_demand', 'demand_pattern',
		'demand_pattern_name', 'demand_rows', 'base_head', 'head_pattern', 'head_pattern_name',
		'base_elevation', 'init_level', 'min_level', 'max_level', 'tank_diameter', 'vol_curve',
		'vol_curve_name', 'min_vol', 'units', 'has_results', 'head', 'pressure', 'demand'];
	var GJ_OURS_LINK = ['name', 'link_type', 'start_node_name', 'end_node_name', 'description', 'length',
		'diameter', 'roughness', 'minor_loss', 'initial_status', 'pipe_type', 'pump_type', 'pump_curve',
		'pump_curve_name', 'base_speed', 'speed_pattern', 'speed_pattern_name', 'valve_type',
		'pressure_setting', 'flow_setting', 'throttle_setting', 'headloss_curve', 'headloss_curve_name',
		'valve_status', 'units', 'has_results', 'flowrate', 'headloss', 'unit_headloss', 'velocity'];
	var GJ_RESULT_KEYS = { head: 1, pressure: 1, demand: 1, flowrate: 1, headloss: 1, unit_headloss: 1, velocity: 1 };
	var GJ_FORMULA_BACK = { 'H-W': 'hw', 'D-W': 'dw', 'C-M': 'manning' };
	// A decimal number written as text, which a GIS often does with a numeric column.
	var GJ_NUMERIC_TEXT = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;
	// The page's own ID rule (validateNewId(): no white space, no quotation marks).
	function gjIdOk(s) { return typeof s === 'string' && s !== '' && !/[\s'"]/.test(s); }

	function gjPlain(v) {
		var o, k;
		if (v instanceof Num) { return v.v; }
		if (Array.isArray(v)) { return v.map(gjPlain); }
		if (v && typeof v === 'object') { o = {}; for (k in v) { if (Object.prototype.hasOwnProperty.call(v, k)) { o[k] = gjPlain(v[k]); } } return o; }
		return v;
	}
	/** A property value as a number and its characters, or null where it states none or no number. */
	function gjNumber(v) {
		var t;
		if (v instanceof Num) { return { v: v.v, t: v.t }; }
		if (typeof v === 'string') {
			t = v.trim();
			if (GJ_NUMERIC_TEXT.test(t)) { return { v: Number(t), t: t }; }
		}
		return null;
	}
	function gjBlank(v) { return v === undefined || v === null || (typeof v === 'string' && v.trim() === ''); }
	/** A property value as the text it was written as. */
	function gjText(v) {
		if (v instanceof Num) { return v.t; }
		if (typeof v === 'string') { return v; }
		if (v === null || v === undefined) { return ''; }
		return JSON.stringify(gjPlain(v));
	}
	/** [lon, lat] as { lon, lat, tok: {x, y}, z }, or null where it is not a longitude and latitude. */
	function gjPos(c) {
		var lon, lat, p;
		if (!Array.isArray(c) || c.length < 2 || !(c[0] instanceof Num) || !(c[1] instanceof Num)) { return null; }
		lon = c[0].v; lat = c[1].v;
		if (!(lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90)) { return null; }
		p = { lon: lon, lat: lat, tok: { x: c[0].t, y: c[1].t } };
		if (c.length > 2 && c[2] instanceof Num) { p.z = c[2].v; }
		return p;
	}
	function gjCrsName(crs) {
		var p;
		if (!crs || typeof crs !== 'object') { return String(gjPlain(crs)); }
		p = crs.properties || {};
		if (p.name !== undefined) { return String(gjPlain(p.name)); }
		if (p.code !== undefined) { return 'EPSG:' + gjPlain(p.code); }
		if (p.href !== undefined) { return String(gjPlain(p.href)); }
		return JSON.stringify(gjPlain(crs));
	}
	function gjFeatures(root) {
		if (!root || typeof root !== 'object' || Array.isArray(root)) { return null; }
		if (root.type === 'FeatureCollection') { return Array.isArray(root.features) ? root.features : null; }
		if (root.type === 'Feature') { return [root]; }
		if (typeof root.type === 'string') { return [{ type: 'Feature', geometry: root, properties: null }]; }
		return null;
	}

	/**
	 * **READ THE FILE, AND SAY WHAT IS IN IT.** Returns
	 *   { ok: false, error: 'unreadable' | 'crs' | 'empty', detail }
	 *   { ok: true, ours, crsNamed, feats, counts: { point, line, other }, fields: { point: [...],
	 *     line: [...] } }, each field { name, numeric, numbers, count, sample } in the order first
	 *     seen: `numeric` when every value stated is a number, `numbers` how many are.
	 */
	EngCalcs.lpnGeoJsonNetScan = function (text) {
		var rd = readJson(text), root, feats, crsNamed = '', nad83Named = '', bad = '', counts = { point: 0, line: 0, other: 0 },
			fields = { point: [], line: [] }, seen = { point: {}, line: {} }, i;
		if (!rd.ok) { return { ok: false, error: 'unreadable', detail: rd.detail }; }
		root = rd.value;
		feats = gjFeatures(root);
		if (!feats) { return { ok: false, error: 'unreadable', detail: 'no GeoJSON type member' }; }
		// The legacy member, on the collection or on any feature (GeoJSON 2008 allowed both).
		function crsCheck(obj) {
			var name;
			if (!obj || typeof obj !== 'object' || obj.crs === undefined || obj.crs === null) { return; }
			name = gjCrsName(obj.crs);
			if (GJ_WGS84.test(name.trim())) { crsNamed = crsNamed || name; }
			else if (GJ_NAD83.test(name.trim())) { nad83Named = nad83Named || name; }
			else if (!bad) { bad = name; }
		}
		crsCheck(root);
		for (i = 0; i < feats.length; i++) { crsCheck(feats[i]); }
		if (bad) { return { ok: false, error: 'crs', detail: bad }; }
		feats.forEach(function (f) {
			var kind = (f && f.geometry && GJ_TYPES[f.geometry.type]) || 'other', pr, k, rec, nv;
			counts[kind]++;
			if (kind === 'other') { return; }
			pr = (f.properties && typeof f.properties === 'object') ? f.properties : {};
			for (k in pr) {
				if (!Object.prototype.hasOwnProperty.call(pr, k)) { continue; }
				rec = seen[kind][k];
				if (!rec) { rec = seen[kind][k] = { name: k, numeric: true, numbers: 0, count: 0, sample: '' }; fields[kind].push(rec); }
				if (gjBlank(pr[k])) { continue; }
				rec.count++;
				nv = gjNumber(pr[k]);
				if (!nv) { rec.numeric = false; } else { rec.numbers++; }
				if (rec.sample === '') { rec.sample = gjText(pr[k]); }
			}
		});
		fields.point.concat(fields.line).forEach(function (r) { if (!r.count) { r.numeric = false; } });
		if (!counts.point && !counts.line) { return { ok: false, error: 'empty', detail: '' }; }
		return {
			ok: true, root: root, feats: feats, crsNamed: crsNamed, nad83Named: nad83Named, counts: counts, fields: fields,
			ours: !!(root.lwn && gjPlain(root.lwn.format) === 'LibreWaterNet GeoJSON')
		};
	};

	// ---- the mapping step's targets, and the guesses ----
	// A target's family is the units-strip selector its numbers are stated in.
	EngCalcs.lpnGeoJsonNetTargets = {
		point: [
			{ id: 'id' }, { id: 'nodeType' }, { id: 'elev', family: 'lpn_u_elevhead' },
			{ id: 'demand', family: 'lpn_u_flow' }, { id: 'desc' }, { id: 'custom' }, { id: 'skip' }
		],
		line: [
			{ id: 'id' }, { id: 'diameter', family: 'lpn_u_diameter' }, { id: 'roughness', family: 'lpn_u_roughness' },
			{ id: 'length', family: 'lpn_u_length' }, { id: 'k' }, { id: 'status' }, { id: 'desc' },
			{ id: 'custom' }, { id: 'skip' }
		]
	};
	// Names a utility layer uses, lower case with `_` and spaces removed, best first. GIS internal
	// columns (OBJECTID, Shape_Length, which is in the file's own map units) are never guessed.
	var GJ_GUESS = {
		point: [
			['id', /^(name|id|nodeid|nodename|node|assetid|asset|facilityid|facid|gisid|junctionid|junction|hydrantid|label|tag)$/],
			['nodeType', /^(nodetype|epanettype|elementtype|kind)$/],
			['elev', /^(elevation|elev|el|z|ground|groundelevation|groundelev|grndelev|gndelev|grelev|surfelev|elevft|elevm|elevationft|elevationm|elft|elm)$/],
			['demand', /^(basedemand|basedem|demand|dem|avgdemand|averagedemand|avgdem|demandgpm|demandlps|demgpm|demlps|bdemand)$/],
			['desc', /^(description|desc|comment|comments|notes|note|remarks)$/]
		],
		line: [
			['id', /^(name|id|pid|pipe|pipeid|pipeno|pipenum|pipename|linkid|link|mainid|assetid|asset|facilityid|facid|gisid|label|tag)$/],
			['diameter', /^(diameter|diam|dia|size|pipesize|pipediam|pipedia|nomdiam|nomdia|nomsize|nominaldiameter|diameterin|diameterinch|diametermm|diammm|diamin|diain|diamm|sizein|sizemm)$/],
			['roughness', /^(roughness|rough|cfactor|cval|cvalue|hwc|hwcoef|hwcfactor|hazen|hazenc|hazenwilliamsc|c)$/],
			['length', /^(length|len|pipelength|pipelen|lengthft|lengthm|lenft|lenm)$/],
			['k', /^(minorloss|minorlosscoefficient|mloss|k|km)$/],
			['status', /^(status|initialstatus)$/],
			['desc', /^(description|desc|comment|comments|notes|note|remarks)$/]
		]
	};
	// A unit stated at the end of a field name (`diam_in`, `elev_ft`, `demand_lps`), for each family.
	var GJ_UNIT_SUFFIX = {
		lpn_u_elevhead: { ft: 'fth2o', feet: 'fth2o', m: 'mh2o', meters: 'mh2o', metres: 'mh2o' },
		lpn_u_length: { ft: 'ft', feet: 'ft', m: 'm', meters: 'm', metres: 'm', km: 'km', mi: 'mi' },
		lpn_u_diameter: { in: 'in', inch: 'in', inches: 'in', mm: 'mm', cm: 'cm', m: 'm' },
		lpn_u_flow: { gpm: 'gpm', mgd: 'mgd', cfs: 'ft3ps', lps: 'lps', ls: 'lps', lpm: 'lpm', cmh: 'cmh', cmd: 'cmd', mld: 'mld' },
		lpn_u_roughness: { ft: 'ft', mm: 'mm', m: 'm', in: 'in' }
	};
	/**
	 * The mapping the dialog opens on: each field's best guess by name (a target only once per
	 * kind; the first field to match it takes it), every other field kept as a custom property.
	 * `unitsNow` is the open project's unit per family, the default where a name states none;
	 * `unitsOffered` lists the names each family's selector offers.
	 * Returns { point: { field: target }, line: { field: target }, units: { 'point:field': name } }.
	 */
	EngCalcs.lpnGeoJsonNetGuess = function (scan, unitsNow, unitsOffered) {
		var out = { point: {}, line: {}, units: {} };
		unitsNow = unitsNow || {}; unitsOffered = unitsOffered || {};
		['point', 'line'].forEach(function (kind) {
			var taken = {};
			(scan.fields[kind] || []).forEach(function (f) {
				var key = String(f.name).toLowerCase().replace(/[\s_\-.]/g, ''), g = 'custom', i, rule;
				for (i = 0; i < GJ_GUESS[kind].length; i++) {
					rule = GJ_GUESS[kind][i];
					if (!taken[rule[0]] && rule[1].test(key)) { g = rule[0]; break; }
				}
				// A numeric target wants numbers: guessed where at least half the values stated are
				// numbers (a stray "1,5" is then named in the report); a column of text is kept.
				var tg = EngCalcs.lpnGeoJsonNetTargets[kind].filter(function (t) { return t.id === g; })[0];
				if (tg && tg.family && !(f.numbers && f.numbers * 2 >= f.count)) { g = 'custom'; tg = null; }
				if (g !== 'custom') { taken[g] = true; }
				out[kind][f.name] = g;
				if (tg && tg.family) {
					var m = /[_\s\-.]([a-z]+)$/i.exec(String(f.name)), u = null, sfx = m ? m[1].toLowerCase() : '';
					if (sfx && GJ_UNIT_SUFFIX[tg.family] && GJ_UNIT_SUFFIX[tg.family][sfx]) { u = GJ_UNIT_SUFFIX[tg.family][sfx]; }
					if (u && unitsOffered[tg.family] && unitsOffered[tg.family].indexOf(u) < 0) { u = null; }
					out.units[kind + ':' + f.name] = u || unitsNow[tg.family] || null;
				}
			});
		});
		return out;
	};

	/** One curve field ("(0, 104), (2000, 92)") as [[x, y], ...], or null where it does not read. */
	function gjCurvePoints(s) {
		var re = /\(\s*([^,()\s]+)\s*,\s*([^,()\s]+)\s*\)/g, m, pts = [], rest;
		if (typeof s !== 'string') { return null; }
		rest = s.replace(re, function (all, x, y) {
			if (!GJ_NUMERIC_TEXT.test(x) || !GJ_NUMERIC_TEXT.test(y)) { pts = null; return all; }
			if (pts) { pts.push([Number(x), Number(y)]); }
			return '';
		});
		m = rest.replace(/[\s,]/g, '');
		return (pts && pts.length && m === '') ? pts : null;
	}

	/**
	 * **BUILD THE NETWORK.** `scan` from lpnGeoJsonNetScan(); `opts`:
	 *   .mapping    lpnGeoJsonNetGuess()'s shape, as the user left it (not read for a file of ours)
	 *   .units      the unit per family the user chose (a file of ours states its own)
	 *   .tolerance  metres within which a line end joins a point or another line end
	 *   .prefixes   the ID prefix per kind letter (J, L), for an ID made here
	 *   .defaults   the new-asset values (nodeElev, demand, diameter, roughness, k, tankLevel,
	 *               tankMinLevel, tankMaxLevel, tankDiameter), in the units the project will have
	 *   .method     the friction method the project will have (a file of ours states its own)
	 * Returns { ok: true, ours, nodes, links, shapes, patterns, curves, customProps, units, method,
	 *   notes: [{ code, ids, detail }], counts } in the saved document's frame: x is the longitude,
	 *   y the latitude, each with the characters it was written as in `tok`.
	 */
	EngCalcs.lpnGeoJsonNetBuild = function (scan, opts) {
		opts = opts || {};
		return scan.ours ? gjBuildOurs(scan, opts) : gjBuildMapped(scan, opts);
	};

	function gjNotes() {
		var list = [], at = {}, seen = {};
		return {
			list: list,
			add: function (code, id, detail) {
				var n = at[code];
				if (!n) { n = at[code] = { code: code, ids: [], detail: detail === undefined ? '' : detail }; list.push(n); seen[code] = {}; }
				// Each name once: a field or a pattern is named by every feature that carries it.
				if (id !== undefined && id !== null && !Object.prototype.hasOwnProperty.call(seen[code], String(id))) {
					seen[code][String(id)] = 1;
					n.ids.push(String(id));
				}
				return n;
			}
		};
	}
	function gjCustomKey(field) {
		var k = String(field).replace(/\s+/g, '');
		while (k.indexOf('custom_') === 0) { k = k.slice(7); }
		return 'custom_' + k;
	}
	function gjCustomDefs(byKey) {
		return Object.keys(byKey).map(function (key) {
			return { key: key, label: byKey[key].label || '', applies: Object.keys(byKey[key].letters).join(','), validate: 'none',
				restrictMode: 'allow', restrict: '', minLength: '', maxLength: '', low: '', high: '' };
		});
	}
	var GJ_TYPE_LETTER = { junction: 'J', reservoir: 'R', tank: 'T', pipe: 'L', pump: 'P', valve: 'V' };

	// ---- a file this suite wrote ----
	function gjBuildOurs(scan, opts) {
		var notes = gjNotes(), meta = gjPlain(scan.root.lwn) || {}, nodes = [], links = [], shapeFeats = [],
			nodeById = {}, linkIds = {}, patterns = [], patById = {}, curves = [], curveById = {}, custom = {},
			counts = { junction: 0, reservoir: 0, tank: 0, pipe: 0, pump: 0, valve: 0, shape: 0 }, hadResults = false;
		if (scan.crsNamed) { notes.add('crs-named', null, scan.crsNamed); }
		if (scan.nad83Named) { notes.add('crs-nad83', null, scan.nad83Named); }
		function num(pr, key, dst, dkey) {
			var n = gjNumber(pr[key]);
			if (!n) { return; }
			dst[dkey] = n.v;
			(dst.tok = dst.tok || {})[dkey] = n.t;
		}
		function text(pr, key) { return gjBlank(pr[key]) ? '' : gjText(pr[key]); }
		function pattern(pr, field, id) {
			var src = pr[field], parts, pt, mult = [], tok = {}, k, same;
			if (!id) { return; }
			if (gjBlank(src)) { return; }
			parts = String(gjText(src)).trim().split(/\s+/);
			for (k = 0; k < parts.length; k++) {
				if (!GJ_NUMERIC_TEXT.test(parts[k])) { notes.add('value-unread', id + ' ' + field + ': ' + gjText(src)); return; }
				mult.push(Number(parts[k])); tok['m' + k] = parts[k];
			}
			pt = patById[id];
			if (!pt) { pt = patById[id] = { id: id, multipliers: mult, tok: tok }; patterns.push(pt); return; }
			same = pt.multipliers.length === mult.length && pt.multipliers.every(function (m, i) { return m === mult[i]; });
			if (!same) { notes.add('pattern-conflict', id); }
		}
		function curve(pr, field, id, kind, owner) {
			var pts;
			if (!id || gjBlank(pr[field])) { return; }
			pts = gjCurvePoints(gjText(pr[field]));
			if (!pts) { notes.add('value-unread', owner + ' ' + field + ': ' + gjText(pr[field])); return; }
			if (!curveById[id]) { curveById[id] = { id: id, kind: kind, points: pts }; curves.push(curveById[id]); }
		}
		function extras(pr, el, known) {
			var k, key;
			for (k in pr) {
				if (!Object.prototype.hasOwnProperty.call(pr, k) || known.indexOf(k) >= 0 || gjBlank(pr[k])) { continue; }
				key = k.indexOf('custom_') === 0 ? k : gjCustomKey(k);
				if (key !== k) { notes.add('field-custom', k); }
				el['_' + key] = gjText(pr[k]);
				custom[key] = custom[key] || { letters: {} };
				custom[key].letters[GJ_TYPE_LETTER[el.type]] = 1;
			}
		}
		scan.feats.forEach(function (f, idx) {
			var pr = (f && f.properties && typeof f.properties === 'object') ? f.properties : {},
				g = f && f.geometry, label = text(pr, 'name') || ('#' + (idx + 1)), nt, lt;
			if (gjPlain(pr.element) === 'Shape') { shapeFeats.push(f); return; }
			nt = String(gjPlain(pr.node_type) || '').toLowerCase();
			lt = String(gjPlain(pr.link_type) || '').toLowerCase();
			if (pr.has_results === true) { hadResults = true; }
			if (nt === 'junction' || nt === 'reservoir' || nt === 'tank') {
				var p = (g && g.type === 'Point') ? gjPos(g.coordinates) : null, nd;
				if (!g || g.type !== 'Point') { notes.add('skip-geometry', label); return; }
				if (!p) { notes.add('skip-position', label); return; }
				if (!gjIdOk(label) || nodeById[label]) { notes.add('skip-id', label); return; }
				nd = { id: label, type: nt, x: p.lon, y: p.lat, tok: { x: p.tok.x, y: p.tok.y } };
				if (text(pr, 'description')) { nd.desc = text(pr, 'description'); }
				if (nt === 'junction') {
					num(pr, 'elevation', nd, 'elev');
					num(pr, 'base_demand', nd, '_demand');
					if (nd._demand === undefined) { nd._demand = 0; }
					if (text(pr, 'demand_pattern_name')) { nd.demandPattern = text(pr, 'demand_pattern_name'); }
					pattern(pr, 'demand_pattern', nd.demandPattern);
					if (gjNumber(pr.demand_rows) && gjNumber(pr.demand_rows).v > 1) { notes.add('demand-rows', label); }
				} else if (nt === 'reservoir') {
					num(pr, 'base_head', nd, '_head');
					if (text(pr, 'head_pattern_name')) { nd.headPattern = text(pr, 'head_pattern_name'); }
					pattern(pr, 'head_pattern', nd.headPattern);
				} else {
					num(pr, 'elevation', nd, 'elev');
					num(pr, 'base_elevation', nd, 'bottomElev');
					num(pr, 'init_level', nd, '_level');
					num(pr, 'min_level', nd, 'minLevel');
					num(pr, 'max_level', nd, 'maxLevel');
					num(pr, 'tank_diameter', nd, 'tankDiameter');
					if (text(pr, 'vol_curve_name')) { nd.volCurve = text(pr, 'vol_curve_name'); }
					curve(pr, 'vol_curve', nd.volCurve, 'volume', label);
				}
				extras(pr, nd, GJ_OURS_NODE);
				nodes.push(nd); nodeById[nd.id] = nd; counts[nt]++;
				return;
			}
			if (lt === 'pipe' || lt === 'pump' || lt === 'valve') {
				links.push({ f: f, pr: pr, label: label, lt: lt });
				return;
			}
			notes.add(g && GJ_TYPES[g.type] ? 'skip-kind' : 'skip-geometry', label);
		});
		links = links.map(function (q) {
			var pr = q.pr, g = q.f.geometry, cs, from = text(pr, 'start_node_name'), to = text(pr, 'end_node_name'),
				a = nodeById[from], b = nodeById[to], lk, verts = [], i, p, first, last;
			if (!g || g.type !== 'LineString' || !Array.isArray(g.coordinates)) { notes.add('skip-geometry', q.label); return null; }
			if (g.coordinates.length < 2) { notes.add('skip-short', q.label); return null; }
			if (!a || !b) { notes.add('skip-no-node', q.label); return null; }
			if (!gjIdOk(q.label) || linkIds[q.label]) { notes.add('skip-id', q.label); return null; }
			cs = g.coordinates;
			for (i = 0; i < cs.length; i++) {
				p = gjPos(cs[i]);
				if (!p) { notes.add('skip-position', q.label); return null; }
				if (i === 0) { first = p; } else if (i === cs.length - 1) { last = p; }
				else { verts.push({ x: p.lon, y: p.lat, tok: { x: p.tok.x, y: p.tok.y } }); }
			}
			// The ends are the nodes. A file edited in a GIS may have moved one without its node.
			if (first.lon !== a.x || first.lat !== a.y || last.lon !== b.x || last.lat !== b.y) { notes.add('end-off-node', q.label); }
			lk = { id: q.label, type: q.lt, from: from, to: to, verts: verts, lenAuto: false };
			if (text(pr, 'description')) { lk.desc = text(pr, 'description'); }
			var closed = /^closed$/i.test(text(pr, q.lt === 'valve' ? 'valve_status' : 'initial_status'));
			lk._status = closed ? 'closed' : 'open';
			if (q.lt === 'pipe') {
				num(pr, 'length', lk, '_length');
				num(pr, 'diameter', lk, '_diameter');
				num(pr, 'roughness', lk, '_roughness');
				num(pr, 'minor_loss', lk, '_k');
				if (text(pr, 'pipe_type')) { notes.add('pipe-type', q.label + ' (' + text(pr, 'pipe_type') + ')'); }
			} else if (q.lt === 'pump') {
				lk._k = 0;
				if (text(pr, 'pump_curve_name')) { lk._curveId = text(pr, 'pump_curve_name'); }
				curve(pr, 'pump_curve', lk._curveId, 'head', q.label);
				num(pr, 'base_speed', lk, 'speed');
				if (text(pr, 'speed_pattern_name')) { lk.speedPattern = text(pr, 'speed_pattern_name'); }
				pattern(pr, 'speed_pattern', lk.speedPattern);
			} else {
				lk.valveType = (text(pr, 'valve_type') || 'TCV').toUpperCase();
				num(pr, 'diameter', lk, '_diameter');
				num(pr, 'minor_loss', lk, '_k');
				lk._length = 0;
				['pressure_setting', 'flow_setting', 'throttle_setting'].forEach(function (k) { if (lk._setting === undefined) { num(pr, k, lk, '_setting'); } });
				if (lk._setting === undefined) { lk._setting = 0; }
				if (text(pr, 'headloss_curve_name')) { lk._curveId = text(pr, 'headloss_curve_name'); }
				curve(pr, 'headloss_curve', lk._curveId, 'headloss', q.label);
			}
			extras(pr, lk, GJ_OURS_LINK);
			linkIds[lk.id] = 1; counts[q.lt]++;
			return lk;
		}).filter(function (l) { return l; });
		// Shapes, through the Shape reader, from the same tree (so their characters survive).
		var shapes = [];
		if (shapeFeats.length) {
			var rs = EngCalcs.lpnGeoJsonShapes(null, { type: 'FeatureCollection', features: shapeFeats }), used = {}, sn = 0;
			nodes.forEach(function (n) { used[n.id] = 1; }); links.forEach(function (l) { used[l.id] = 1; });
			(rs.skipped || []).forEach(function (k) { notes.add('skip-position', k.name); });
			(rs.shapes || []).forEach(function (sh) {
				var id = (sh.name && gjIdOk(sh.name) && !used[sh.name]) ? sh.name : null, s;
				if (!id) { do { id = ((opts.prefixes || {}).S || 'S') + (++sn); } while (used[id]); notes.add('id-new', (sh.srcName || '?') + ' (' + id + ')'); }
				used[id] = 1;
				s = { id: id, closed: !!sh.closed, pts: sh.pts.map(function (q) {
					var o = { x: q.lon, y: q.lat, tok: { x: q.tok.x, y: q.tok.y } };
					if (typeof q.z === 'number') { o.z = q.z; if (q.tok.z) { o.tok.z = q.tok.z; } }
					return o;
				}) };
				if (sh.desc) { s.desc = sh.desc; }
				if (sh.props) { s.props = sh.props; }
				if (sh.fid !== undefined) { s.fid = sh.fid; }
				shapes.push(s); counts.shape++;
			});
		}
		if (hadResults) { notes.add('results-dropped'); }
		notes.add('not-in-geojson');
		return {
			ok: true, ours: true, nodes: nodes, links: links, shapes: shapes, patterns: patterns, curves: curves,
			customProps: gjCustomDefs(custom), units: meta.units || null,
			method: GJ_FORMULA_BACK[meta.headloss_formula] || opts.method || 'hw',
			notes: notes.list, counts: counts
		};
	}

	// ---- any other file, through the mapping the user chose ----
	function gjBuildMapped(scan, opts) {
		var notes = gjNotes(), map = opts.mapping || { point: {}, line: {} }, d = opts.defaults || {},
			tol = (typeof opts.tolerance === 'number' && opts.tolerance >= 0) ? opts.tolerance : 0.5,
			pre = opts.prefixes || {}, nodes = [], links = [], custom = {}, used = {}, nodeIds = {}, linkIds = {},
			counts = { junction: 0, reservoir: 0, tank: 0, pipe: 0, pump: 0, valve: 0, shape: 0 },
			fieldOf = { point: {}, line: {} }, zCount = [], minted = { J: 0, L: 0 }, lat0 = 0, nLat = 0,
			noElev = [], demandKept = [];
		if (scan.crsNamed) { notes.add('crs-named', null, scan.crsNamed); }
		if (scan.nad83Named) { notes.add('crs-nad83', null, scan.nad83Named); }
		['point', 'line'].forEach(function (kind) {
			Object.keys(map[kind] || {}).forEach(function (field) {
				var t = map[kind][field];
				if (t === 'skip') { notes.add('field-skipped', field); }
				else if (t === 'custom') { (fieldOf[kind].custom = fieldOf[kind].custom || []).push(field); }
				else if (!fieldOf[kind][t]) { fieldOf[kind][t] = field; }
			});
		});
		// Every ID the file states is claimed first, so one made here can never take a later one's.
		scan.feats.forEach(function (f) {
			var kind = f && f.geometry && GJ_TYPES[f.geometry.type], pr = (f && f.properties) || {}, fid;
			if (!kind || !fieldOf[kind].id) { return; }
			fid = gjText(pr[fieldOf[kind].id]).trim();
			if (fid) { used[fid] = 1; }
		});
		function mint(letter) {
			var id, p = pre[letter] || letter;
			do { id = p + (++minted[letter]); } while (used[id]);
			used[id] = 1;
			return id;
		}
		// An ID for an element: the file's where it is usable and not yet taken in its kind.
		function idFor(kind, pr, label, letter, taken) {
			var field = fieldOf[kind].id, raw = field ? gjText(pr[field]).trim() : '', id;
			if (raw && gjIdOk(raw) && !taken[raw]) { taken[raw] = 1; return raw; }
			id = mint(letter);
			taken[id] = 1;
			// A usable ID already taken is a duplicate; a blank or unusable one is replaced. With no
			// ID field mapped every ID is made here, which one line says ('unmapped-id').
			if (field) { notes.add(raw && gjIdOk(raw) ? 'id-dup' : 'id-new', (raw || label) + ' (' + id + ')'); }
			return id;
		}
		function numInto(kind, target, pr, el, key, owner) {
			var field = fieldOf[kind][target], n;
			if (!field) { return false; }
			if (gjBlank(pr[field])) { return false; }
			n = gjNumber(pr[field]);
			if (!n) { notes.add('value-unread', owner + ' ' + field + ': ' + gjText(pr[field])); return false; }
			el[key] = n.v;
			(el.tok = el.tok || {})[key] = n.t;
			return true;
		}
		function customs(kind, pr, el) {
			(fieldOf[kind].custom || []).forEach(function (field) {
				var key = gjCustomKey(field);
				if (gjBlank(pr[field])) { return; }
				el['_' + key] = gjText(pr[field]);
				custom[key] = custom[key] || { letters: {}, label: field };
				custom[key].letters[GJ_TYPE_LETTER[el.type]] = 1;
			});
		}
		function fill(el, key, value, code, id) {
			if (el[key] !== undefined) { return; }
			el[key] = value;
			notes.add(code, id, value);
		}
		// ---- points: one node each ----
		var pointFeats = [], lineFeats = [];
		scan.feats.forEach(function (f, idx) {
			var g = f && f.geometry, kind = g && GJ_TYPES[g.type], pr = (f && f.properties && typeof f.properties === 'object') ? f.properties : {},
				label = '#' + (idx + 1);
			if (fieldOf.point.id && kind === 'point' && !gjBlank(pr[fieldOf.point.id])) { label = gjText(pr[fieldOf.point.id]); }
			if (fieldOf.line.id && kind === 'line' && !gjBlank(pr[fieldOf.line.id])) { label = gjText(pr[fieldOf.line.id]); }
			if (!kind) {
				// Named by whichever ID field it carries, so the report says which feature it was.
				[fieldOf.point.id, fieldOf.line.id, 'name'].some(function (k) { if (k && !gjBlank(pr[k])) { label = gjText(pr[k]); return true; } return false; });
				notes.add('skip-geometry', label);
				return;
			}
			(kind === 'point' ? pointFeats : lineFeats).push({ f: f, pr: pr, label: label });
		});
		pointFeats.forEach(function (q) {
			var g = q.f.geometry, list = g.type === 'Point' ? [g.coordinates] : (Array.isArray(g.coordinates) ? g.coordinates : []), ps = [], i, p;
			for (i = 0; i < list.length; i++) { p = gjPos(list[i]); if (!p) { notes.add('skip-position', q.label); return; } ps.push(p); }
			if (!ps.length) { notes.add('skip-position', q.label); return; }
			if (ps.length > 1) { notes.add('parts-points', q.label); }
			ps.forEach(function (p, k) {
				var tv = fieldOf.point.nodeType ? String(gjText(q.pr[fieldOf.point.nodeType])).trim().toLowerCase() : '',
					type = /^(junction|j)$/.test(tv) || tv === '' ? 'junction' : /^(reservoir|r)$/.test(tv) ? 'reservoir' : /^(tank|t)$/.test(tv) ? 'tank' : null,
					nd, id;
				if (!type) { notes.add('value-unread', q.label + ' ' + fieldOf.point.nodeType + ': ' + gjText(q.pr[fieldOf.point.nodeType])); type = 'junction'; }
				id = idFor('point', ps.length > 1 ? {} : q.pr, q.label + (ps.length > 1 ? '/' + (k + 1) : ''), 'J', nodeIds);
				nd = { id: id, type: type, x: p.lon, y: p.lat, tok: { x: p.tok.x, y: p.tok.y } };
				if (typeof p.z === 'number') { zCount.push(id); }
				// A node with no elevation is settled after the pipes are built (below), from its neighbours.
				if (!numInto('point', 'elev', q.pr, nd, 'elev', id)) { noElev.push(nd); }
				if (type === 'junction') {
					numInto('point', 'demand', q.pr, nd, '_demand', id);
					fill(nd, '_demand', d.demand === undefined ? 0 : d.demand, 'default-demand', id);
				} else if (fieldOf.point.demand && !gjBlank(q.pr[fieldOf.point.demand])) {
					// A reservoir or tank has no demand; the value is kept, as typed, and named.
					var dk = gjCustomKey(fieldOf.point.demand);
					nd['_' + dk] = gjText(q.pr[fieldOf.point.demand]);
					custom[dk] = custom[dk] || { letters: {}, label: fieldOf.point.demand };
					custom[dk].letters[GJ_TYPE_LETTER[type]] = 1;
					demandKept.push(id);
					notes.add('demand-kept', null, dk);
				}
				if (type === 'tank') {
					nd._level = d.tankLevel; nd.minLevel = d.tankMinLevel; nd.maxLevel = d.tankMaxLevel; nd.tankDiameter = d.tankDiameter;
					notes.add('default-tank', id);
				}
				if (fieldOf.point.desc && !gjBlank(q.pr[fieldOf.point.desc])) { nd.desc = gjText(q.pr[fieldOf.point.desc]); }
				customs('point', q.pr, nd);
				nodes.push(nd); counts[type]++;
				lat0 += p.lat; nLat++;
			});
		});
		// ---- the snapping index: a grid in metres on a plane tangent at the mean latitude ----
		lineFeats.forEach(function (q) {
			var c = q.f.geometry.coordinates, first = Array.isArray(c) && c.length ? (q.f.geometry.type === 'LineString' ? c[0] : (c[0] || [])[0]) : null, p = gjPos(first);
			if (p) { lat0 += p.lat; nLat++; }
		});
		lat0 = nLat ? lat0 / nLat : 0;
		var MX = 111320 * Math.cos(lat0 * Math.PI / 180), MY = 110574, cell = Math.max(tol, 1e-6), grid = {};
		function mx(p) { return p.lon * MX; }
		function my(p) { return p.lat * MY; }
		function gkey(i, j) { return i + ',' + j; }
		function addToGrid(nd) {
			var k = gkey(Math.floor(nd.x * MX / cell), Math.floor(nd.y * MY / cell));
			(grid[k] = grid[k] || []).push(nd);
		}
		function nearest(p, wantAuto) {
			var ci = Math.floor(mx(p) / cell), cj = Math.floor(my(p) / cell), best = null, bd = Infinity, i, j, list, k, dd;
			for (i = ci - 1; i <= ci + 1; i++) {
				for (j = cj - 1; j <= cj + 1; j++) {
					list = grid[gkey(i, j)];
					if (!list) { continue; }
					for (k = 0; k < list.length; k++) {
						if (!!list[k].auto !== wantAuto) { continue; }
						dd = Math.sqrt(Math.pow(list[k].x * MX - mx(p), 2) + Math.pow(list[k].y * MY - my(p), 2));
						if (dd <= tol && dd < bd) { bd = dd; best = list[k]; }
					}
				}
			}
			return best ? { node: best, dist: bd } : null;
		}
		nodes.forEach(addToGrid);
		var added = [], moved = [], maxMove = 0;
		function nodeAt(p, pipeId) {
			var hit = nearest(p, false) || nearest(p, true), nd;
			if (hit) {
				if (hit.dist > 0) { moved.push(pipeId); maxMove = Math.max(maxMove, hit.dist); }
				return hit.node;
			}
			nd = { id: mint('J'), type: 'junction', x: p.lon, y: p.lat, tok: { x: p.tok.x, y: p.tok.y }, auto: true,
				_demand: d.demand === undefined ? 0 : d.demand };
			nodeIds[nd.id] = 1;
			noElev.push(nd);
			nodes.push(nd); addToGrid(nd); added.push(nd.id); counts.junction++;
			return nd;
		}
		// ---- lines: one pipe per line, or per unconnected part of a multipart line ----
		lineFeats.forEach(function (q) {
			var g = q.f.geometry, raw = g.type === 'LineString' ? [g.coordinates] : g.coordinates, parts = [], i, k, part, p, pts;
			if (!Array.isArray(raw)) { notes.add('skip-position', q.label); return; }
			for (i = 0; i < raw.length; i++) {
				if (!Array.isArray(raw[i])) { notes.add('skip-position', q.label); return; }
				pts = [];
				for (k = 0; k < raw[i].length; k++) { p = gjPos(raw[i][k]); if (!p) { notes.add('skip-position', q.label); return; } pts.push(p); }
				if (pts.length < 2) { notes.add('skip-short', q.label); return; }
				// A part that starts exactly where the last one ended continues it (one pipe).
				part = parts[parts.length - 1];
				if (part && part[part.length - 1].lon === pts[0].lon && part[part.length - 1].lat === pts[0].lat) {
					parts[parts.length - 1] = part.concat(pts.slice(1));
				} else { parts.push(pts); }
			}
			if (!parts.length) { notes.add('skip-geometry', q.label); return; }
			if (parts.length > 1) { notes.add('parts', q.label, parts.length); }
			parts.forEach(function (pts, pi) {
				var lk = { type: 'pipe', verts: [], lenAuto: false, _status: 'open' }, a, b, label = parts.length > 1 ? q.label + '/' + (pi + 1) : q.label, id;
				id = idFor('line', parts.length > 1 ? {} : q.pr, label, 'L', linkIds);
				lk.id = id;
				a = nodeAt(pts[0], id); b = nodeAt(pts[pts.length - 1], id);
				if (a === b) { notes.add('skip-loop', id); return; }
				lk.from = a.id; lk.to = b.id;
				lk.verts = pts.slice(1, -1).map(function (v) { return { x: v.lon, y: v.lat, tok: { x: v.tok.x, y: v.tok.y } }; });
				numInto('line', 'diameter', q.pr, lk, '_diameter', id);
				fill(lk, '_diameter', d.diameter, 'default-diameter', id);
				numInto('line', 'roughness', q.pr, lk, '_roughness', id);
				fill(lk, '_roughness', d.roughness, 'default-roughness', id);
				if (!numInto('line', 'length', q.pr, lk, '_length', id)) { lk.lenAuto = true; notes.add('length-auto', id); }
				numInto('line', 'k', q.pr, lk, '_k', id);
				// 0 where the file is silent, as EPANET reads a silent [PIPES] row; never the New
				// assets default, which is a drawing preference, not a statement about this pipe.
				fill(lk, '_k', 0, 'default-k', id);
				if (fieldOf.line.status && !gjBlank(q.pr[fieldOf.line.status])) {
					var sv = String(gjText(q.pr[fieldOf.line.status])).trim().toLowerCase();
					if (/^(closed|close|c|0|false|no)$/.test(sv)) { lk._status = 'closed'; }
					else if (!/^(open|o|1|true|yes|active)$/.test(sv)) { notes.add('value-unread', id + ' ' + fieldOf.line.status + ': ' + gjText(q.pr[fieldOf.line.status])); }
				}
				if (fieldOf.line.desc && !gjBlank(q.pr[fieldOf.line.desc])) { lk.desc = gjText(q.pr[fieldOf.line.desc]); }
				customs('line', q.pr, lk);
				links.push(lk); counts.pipe++;
			});
		});
		// ---- a line end that lies along another pipe but not at its end is named, not joined ----
		var degree = {}, onPipe = [];
		links.forEach(function (l) { degree[l.from] = (degree[l.from] || 0) + 1; degree[l.to] = (degree[l.to] || 0) + 1; });
		if (added.length) {
			var SEG = Math.max(tol, 50), segGrid = {};
			var nodeIdx = {};
			nodes.forEach(function (n) { nodeIdx[n.id] = n; });
			links.forEach(function (l, li) {
				var pts = [nodeIdx[l.from]].concat(l.verts, [nodeIdx[l.to]]), s, a, b, i0, i1, j0, j1, i, j, k;
				for (s = 0; s + 1 < pts.length; s++) {
					a = pts[s]; b = pts[s + 1];
					i0 = Math.floor(Math.min(a.x, b.x) * MX / SEG); i1 = Math.floor(Math.max(a.x, b.x) * MX / SEG);
					j0 = Math.floor(Math.min(a.y, b.y) * MY / SEG); j1 = Math.floor(Math.max(a.y, b.y) * MY / SEG);
					for (i = i0; i <= i1; i++) { for (j = j0; j <= j1; j++) { k = gkey(i, j); (segGrid[k] = segGrid[k] || []).push([li, a, b]); } }
				}
			});
			added.forEach(function (id) {
				var n = nodeIdx[id], px, py, list, k, sg, ax, ay, bx, by, t, dx, dy, dd;
				if (degree[id] !== 1) { return; }
				px = n.x * MX; py = n.y * MY;
				list = segGrid[gkey(Math.floor(px / SEG), Math.floor(py / SEG))] || [];
				for (k = 0; k < list.length; k++) {
					sg = list[k];
					if (links[sg[0]].from === id || links[sg[0]].to === id) { continue; }
					ax = sg[1].x * MX; ay = sg[1].y * MY; bx = sg[2].x * MX; by = sg[2].y * MY;
					dx = bx - ax; dy = by - ay;
					t = (dx || dy) ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy))) : 0;
					dd = Math.sqrt(Math.pow(ax + t * dx - px, 2) + Math.pow(ay + t * dy - py, 2));
					if (dd <= tol) { onPipe.push(id + ' (' + links[sg[0]].id + ')'); return; }
				}
			});
		}
		// ---- an elevation the file does not state is taken from a node that states one ----
		// An added line-end junction takes the elevation of a pipe neighbour that states one (the
		// other end of its pipe); any other node, and a junction with no such neighbour, takes the
		// nearest node that states one. Named, with the node it came from. With no elevation field
		// chosen, or none stated, every node keeps the default.
		var hasElev = {}, statedList = [];
		nodes.forEach(function (n) { if (typeof n.elev === 'number') { hasElev[n.id] = n; statedList.push(n); } });
		if (noElev.length && statedList.length) {
			var adj = {}, EC = 200, eg = {}, eMinI = Infinity, eMaxI = -Infinity, eMinJ = Infinity, eMaxJ = -Infinity;
			links.forEach(function (l) { (adj[l.from] = adj[l.from] || []).push(l.to); (adj[l.to] = adj[l.to] || []).push(l.from); });
			statedList.forEach(function (n) {
				var i = Math.floor(n.x * MX / EC), j = Math.floor(n.y * MY / EC), k = gkey(i, j);
				(eg[k] = eg[k] || []).push(n);
				eMinI = Math.min(eMinI, i); eMaxI = Math.max(eMaxI, i); eMinJ = Math.min(eMinJ, j); eMaxJ = Math.max(eMaxJ, j);
			});
			var nearestStated = function (n) {
				var ci = Math.floor(n.x * MX / EC), cj = Math.floor(n.y * MY / EC), best = null, bd = Infinity, r, i, j, list, k, dd,
					maxR = Math.max(Math.abs(ci - eMinI), Math.abs(ci - eMaxI), Math.abs(cj - eMinJ), Math.abs(cj - eMaxJ)) + 1;
				for (r = 0; r <= maxR; r++) {
					for (i = ci - r; i <= ci + r; i++) {
						for (j = cj - r; j <= cj + r; j++) {
							if (Math.max(Math.abs(i - ci), Math.abs(j - cj)) !== r) { continue; }
							list = eg[gkey(i, j)];
							if (!list) { continue; }
							for (k = 0; k < list.length; k++) {
								dd = Math.pow(list[k].x * MX - n.x * MX, 2) + Math.pow(list[k].y * MY - n.y * MY, 2);
								if (dd < bd) { bd = dd; best = list[k]; }
							}
						}
					}
					// Every node in a ring beyond r is at least r cells away.
					if (best && Math.sqrt(bd) <= r * EC) { break; }
				}
				return best;
			};
			var taken = notes.add('elev-taken');
			noElev.forEach(function (n) {
				var src = null;
				if (n.auto) { (adj[n.id] || []).some(function (o) { if (hasElev[o]) { src = hasElev[o]; return true; } return false; }); }
				src = src || nearestStated(n);
				n.elev = src.elev;
				if (src.tok && src.tok.elev) { (n.tok = n.tok || {}).elev = src.tok.elev; }
				taken.ids.push(n.id + ' (' + src.id + ')');
			});
		} else {
			noElev.forEach(function (n) { fill(n, 'elev', d.nodeElev === undefined ? 0 : d.nodeElev, n.auto ? 'default-elev-added' : 'default-elev', n.id); });
		}
		if (demandKept.length) { notes.list.forEach(function (x) { if (x.code === 'demand-kept') { x.ids = demandKept; } }); }
		nodes.forEach(function (n) { delete n.auto; });
		if (added.length) { notes.add('junction-added').ids = added; }
		if (moved.length) { notes.add('end-moved', null, maxMove).ids = moved; }
		if (onPipe.length) { notes.add('end-on-pipe').ids = onPipe; }
		if (zCount.length) { notes.add('z-ignored').ids = zCount; }
		if (pointFeats.length && !fieldOf.point.id) { notes.add('unmapped-id-point'); }
		if (lineFeats.length && !fieldOf.line.id) { notes.add('unmapped-id-line'); }
		if (!fieldOf.line.length) { notes.list.forEach(function (x) { if (x.code === 'length-auto') { x.code = 'unmapped-length'; x.ids = []; } }); }
		['elev', 'demand', 'diameter', 'roughness', 'k'].forEach(function (t) {
			var kind = (t === 'elev' || t === 'demand') ? 'point' : 'line';
			if (!fieldOf[kind][t]) {
				// No field fills it: every element has the default, which one line says.
				var n = null;
				notes.list.forEach(function (x) { if (x.code === 'default-' + t) { n = x; } });
				if (n) { n.code = 'unmapped-' + t; n.ids = []; }
				if (t === 'elev') {
					// The added junctions have the same default, so one line says it for every node.
					notes.list.forEach(function (x) { if (x.code === 'default-elev-added') { if (n) { x.code = '_drop'; } else { x.code = 'unmapped-elev'; x.ids = []; n = x; } } });
				}
			}
		});
		if (fieldOf.point.custom || fieldOf.line.custom) {
			(fieldOf.point.custom || []).concat(fieldOf.line.custom || []).forEach(function (f) { notes.add('field-custom', f); });
		}
		for (var di = notes.list.length - 1; di >= 0; di--) { if (notes.list[di].code === '_drop') { notes.list.splice(di, 1); } }
		return {
			ok: true, ours: false, nodes: nodes, links: links, shapes: [], patterns: [], curves: [],
			customProps: gjCustomDefs(custom), units: opts.units || null, method: opts.method || 'hw',
			notes: notes.list, counts: counts, tolerance: tol
		};
	}

	/** A number and the characters it was written as in the file. */
	function Num(v, t) { this.v = v; this.t = t; }
	/**
	 * JSON text to a tree in which every number is a Num carrying the characters it was written
	 * as (JSON.parse source text access; where a browser does not offer it, String() of the value).
	 */
	function readJson(text) {
		try {
			// A byte order mark is not JSON text (RFC 8259 section 8.1 lets a reader ignore it).
			return { ok: true, value: JSON.parse(String(text).replace(/^\uFEFF/, ''), function (key, value, ctx) {
				if (typeof value === 'number') {
					return new Num(value, (ctx && typeof ctx.source === 'string') ? ctx.source : String(value));
				}
				return value;
			}) };
		} catch (e) { return { ok: false, detail: String(e && e.message ? e.message : e) }; }
	}
}(typeof globalThis !== 'undefined' ? globalThis : this));
