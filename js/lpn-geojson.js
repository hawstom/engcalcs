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
			nodeById = {}, features = [], counts = { junction: 0, reservoir: 0, tank: 0, pipe: 0, pump: 0, valve: 0 },
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
					putPattern(p, 'demand_pattern', rows[0].pattern || doc.defaultPattern);
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
}(typeof globalThis !== 'undefined' ? globalThis : this));
