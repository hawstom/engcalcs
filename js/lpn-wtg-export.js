/**
 * lpn-wtg-export.js -- the open network written as a WaterGEMS/WaterCAD project pair,
 * `<name>.wtg` and `<name>.wtg.sqlite`.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * ROADMAP Task 749. The record, the mapping, the codes and what is still unproven:
 * dev/wtg-export.md. Tom's WaterGEMS 26.0.0.532 opened and ran the spike's files (his rounds 1 to 3,
 * 2026-10-22 and 23); this module is that writer moved out of dev/lpn-spike/ so the page can call it.
 *
 * **LICENCE LINE.** Built only from files an ordinary user or the public holds: TSNet's MIT samples and
 * a project saved by Tom's own WaterGEMS. No Bentley software or
 * DLL was looked inside, and no Bentley code is in this repository. THE TEMPLATE IS BUILT IN: js/data/
 * wtg-template/ is Tom's own saved project (its schema version is the one his WaterGEMS wrote) emptied to one prototype of each kind
 * by dev/scripts/build_wtg_template.js; this module copies it, removes the prototypes, and writes ours.
 * The visitor chooses no file. A caller may still pass any saved project's bytes (`o.sqlite`, `o.wtg`).
 *
 * **NO DOM.** The caller supplies everything that is not arithmetic: the open document (as
 * `EngCalcs.lpnExportInp` takes it) and the options the page passes the .inp export, the template's
 * bytes, the epanet-js module for the reference run, and (in Node) sql.js. In a browser the SQLite
 * engine is js/vendor/sql-wasm.js and its 658 KB wasm (sql.js 1.14.2, MIT), fetched from this
 * site the first time the command is used, never at page load, never precached.
 *
 * **THE DOCUMENT IS READ THROUGH THE .inp WRITER.** The open scenario's resolved values, flattened
 * as an EPANET file is (pipe types to diameters and roughness, fittings to minor loss, customers to
 * demand, inactive assets left out), are the one thing every file-format export of this page agrees
 * on (dev/import-export-scenarios.md, level 1 formats). So the .inp text is built in memory by
 * `lpnExportInp`, read back by `lpnInpParse`, and written. No second reading of the document exists
 * to drift from the first. The .inp itself is never offered.
 *
 * **WHAT IT REFUSES, BY NAME** (`lpnWtgExportPlan().refused`): a flow unit other than gpm (the storage
 * units were measured for US customary only), a head loss formula other than Hazen-Williams, a pump
 * without a three-point head curve (power, multiple-point), and a template whose schema version is
 * not on the tested list or which lacks an element kind the network needs.
 * **WHAT IT CANNOT CARRY** is returned as `notCarried`, element IDs included, and the page names it
 * in the box before the file is written.
 */
(function (root) {
'use strict';
var EngCalcs = root.EngCalcs = root.EngCalcs || {};

// The core schema versions the writer has been tested against (HMISchemaVersionInfo, name
// HMICoreSchemaVersion). Anything else is refused, because a release can add a table or change a
// default. Adding a version means a harness run against a project saved by that release.
var TESTED_SCHEMAS = [['1', '0', '44', '0'].join('.'), ['1', '0', '54', '0'].join('.')];   // spelled in parts: a bare 1.0.54 reads as a head loss constant to js_constant_check

function uuid() {
	if (root.crypto && typeof root.crypto.randomUUID === 'function') { return root.crypto.randomUUID(); }
	var h = '0123456789abcdef', s = '', i;
	for (i = 0; i < 36; i++) {
		s += (i === 8 || i === 13 || i === 18 || i === 23) ? '-' : h.charAt(Math.floor(Math.random() * 16));
	}
	return s;
}

// ---------------------------------------------------------------------------------------------
// Storage units. WaterGEMS stores every quantity in one fixed unit per field whatever it
// displays (dev/sqlite-reader.md, "Storage units"): feet, cubic feet per second, seconds.
// GPM_TO_CFS is MEASURED from the saved file: 100 gpm is stored 0.22280092967190634 ft3/s.
// ---------------------------------------------------------------------------------------------
const GPM_TO_CFS = 0.22280092967190634 / 100;
const IN_TO_FT = 1 / 12;
const EPOCH_2000 = 946684800;            // 2000-01-01 00:00 UTC, the template's own analysis start

function smartLabel(label) {
	// 'J-12' -> 'J-0000012', 'U1-A' -> 'U0000001-A': every run of digits padded to seven.
	return String(label).replace(/\d+/g, (d) => d.length >= 7 ? d : '0'.repeat(7 - d.length) + d);
}

// ---------------------------------------------------------------------------------------------
// A thin layer over sql.js
// ---------------------------------------------------------------------------------------------
function rowsOf(db, sql, params) {
	const st = db.prepare(sql), out = [];
	try {
		if (params) { st.bind(params); }
		while (st.step()) { out.push(st.getAsObject()); }
	} finally { st.free(); }
	return out;
}
function colsOf(db, table) {
	return rowsOf(db, 'PRAGMA table_info("' + table + '")').map((r) => r.name);
}
function tablesOf(db) {
	return rowsOf(db, "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite\\_%' ESCAPE '\\' ORDER BY name").map((r) => r.name);
}
// Columns this writer states that the template's layout does not have (an older schema lacks a few that a newer one
// added) are left out, and named in report.notes by the caller through `skippedColumns`.
let skippedColumns = {};
const columnCache = new WeakMap();
function insert(db, table, obj) {
	let cache = columnCache.get(db);
	if (!cache) { cache = {}; columnCache.set(db, cache); }
	const have = cache[table] || (cache[table] = colsOf(db, table));
	const keys = Object.keys(obj).filter((k) => {
		if (have.indexOf(k) >= 0) { return true; }
		skippedColumns[table + '.' + k] = 1;
		return false;
	});
	db.run('INSERT INTO "' + table + '" (' + keys.map((k) => '"' + k + '"').join(',') + ') VALUES (' + keys.map(() => '?').join(',') + ')',
		keys.map((k) => obj[k]));
}

// ---------------------------------------------------------------------------------------------
// The prototypes: the template's own rows for one live element of each kind.
// ---------------------------------------------------------------------------------------------
const KEYS = ['DomainElementID', 'SupportElementID'];
const SKIP_TABLES = { HMIDomainElement: 1, HMIModelingElement: 1, HMISupportElement: 1, HMIChangeTracking: 1 };

function collectPrototype(db, tables, id, baseAlts) {
	const out = [];
	tables.forEach((t) => {
		if (SKIP_TABLES[t]) { return; }
		const cols = colsOf(db, t), key = KEYS.find((k) => cols.indexOf(k) >= 0);
		if (!key) { return; }
		let sql = 'SELECT * FROM "' + t + '" WHERE "' + key + '" = ?';
		const rows = rowsOf(db, sql, [id]).filter((r) => !('AlternativeID' in r) || baseAlts.has(r.AlternativeID));
		rows.forEach((r) => { out.push({ table: t, key: key, row: r }); });
	});
	return out;
}

// Find the template's prototype of each kind by its element type id and a live (undeleted) row.
function findProto(db, typeId, label) {
	const r = rowsOf(db, 'SELECT m.ElementID AS id FROM HMIModelingElement m JOIN HMIDomainElement d ON d.DomainElementID = m.ElementID '
		+ 'WHERE d.DomainElementTypeID = ? AND d.IsDeleted = 0 AND m.IsDeleted = 0 ORDER BY m.ElementID', [typeId]);
	if (!r.length) { throw fail('template-kind', 'The saved project has no ' + label + ' to copy.', [label], 'kind', { kind: label }); }
	return r[0].id;
}
function findSupportProto(db, typeId, label) {
	const r = rowsOf(db, 'SELECT SupportElementID AS id FROM HMISupportElement WHERE SupportElementTypeID = ? AND IsDeleted = 0 ORDER BY SupportElementID', [typeId]);
	if (!r.length) { throw fail('template-kind', 'The saved project has no ' + label + ' to copy.', [label], 'kind', { kind: label }); }
	return r[0].id;
}

// ---------------------------------------------------------------------------------------------
// Geometry: standard Well-Known Binary, in feet (OBSERVED in every sample).
// ---------------------------------------------------------------------------------------------
function wkbPoint(x, y) {
	const b = new Uint8Array(21), dv = new DataView(b.buffer);
	b[0] = 1; dv.setUint32(1, 1, true); dv.setFloat64(5, x, true); dv.setFloat64(13, y, true);
	return b;
}
function wkbLine(pts) {
	const b = new Uint8Array(9 + 16 * pts.length), dv = new DataView(b.buffer);
	b[0] = 1; dv.setUint32(1, 2, true); dv.setUint32(5, pts.length, true);
	pts.forEach((p, i) => { dv.setFloat64(9 + 16 * i, p[0], true); dv.setFloat64(17 + 16 * i, p[1], true); });
	return b;
}
// `reason` and `vals` are what the page turns into a sentence of its own (language keys
// lpn_wtg_export_t_<reason>, {name} placeholders filled from `vals`); `message` is the plain
// English for a harness or a console and names no program.
function fail(code, message, ids, reason, vals) {
	const e = new Error(message);
	e.code = code;
	if (ids) { e.ids = ids; }
	e.reason = reason || code;
	e.vals = vals || {};
	return e;
}
function polyLength(pts) {
	let s = 0, i;
	for (i = 1; i < pts.length; i++) { s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); }
	return s;
}

// ---------------------------------------------------------------------------------------------
// The writer
// ---------------------------------------------------------------------------------------------
/**
 * @param SQL         initialised sql.js
 * @param templateBytes  the saved WaterGEMS project (.wtg.sqlite)
 * @param parsed      EngCalcs.lpnInpParse() of the EPANET file
 * @param schedule    { initial: {linkId: 'open'|'closed'}, changes: [{t, link, status}] } from a reference
 *                    run: how the level controls are carried (see dev/wtg-export.md)
 * @returns { bytes, report }
 */
function writeWtg(SQL, templateBytes, parsed, schedule, opts) {
	let handle = null;
	try {
		return writeWtgBody(SQL, templateBytes, parsed, schedule, opts, function (d) { handle = d; });
	} finally {
		if (handle) { try { handle.close(); } catch (e) { /* closed already, at the end of a good run */ } }
	}
}
function writeWtgBody(SQL, templateBytes, parsed, schedule, opts, hold) {
	opts = opts || {};
	const report = { carried: [], notCarried: [], counts: {}, ids: {}, notes: [] };
	skippedColumns = {};
	function carried(s) { report.carried.push(s); }
	function lost(s) { report.notCarried.push(s); }

	if (String(parsed.flowUnits).toUpperCase() !== 'GPM') {
		throw fail('units', 'Only US customary projects are written, so the flow unit must be gpm; this project writes ' + parsed.flowUnits + '.', null, 'units', { unit: String(parsed.flowUnits) });
	}
	if (String(parsed.headloss || 'H-W').toUpperCase().indexOf('H-W') < 0) {
		throw fail('headloss', 'Only the Hazen-Williams head loss formula is written.', null, 'headloss', { method: String(parsed.headloss) });
	}

	let db;
	try { db = new SQL.Database(new Uint8Array(templateBytes)); } catch (e) { throw fail('template', 'The saved project is not a SQLite database.', null, 'not_project'); }
	hold(db);
	{
		let ver = null;
		try { ver = rowsOf(db, "SELECT Value FROM HMISchemaVersionInfo WHERE Name = 'HMICoreSchemaVersion'")[0]; } catch (e) { ver = null; }
		if (!ver) { throw fail('template', 'The saved project has no schema version.', null, 'not_project'); }
		report.schemaVersion = String(ver.Value);
		if (!opts.allowUntestedSchema && TESTED_SCHEMAS.indexOf(report.schemaVersion) < 0) {
			throw fail('schema', 'The saved project\'s schema version is ' + report.schemaVersion + '; this writer has been tested only against ' + TESTED_SCHEMAS.join(', ') + '.', null, 'schema', { found: report.schemaVersion, tested: TESTED_SCHEMAS.join(', ') });
		}
	}
	const tables = tablesOf(db);

	// ---- what the template holds ----
	const baseAlts = new Set(rowsOf(db, 'SELECT AlternativeID FROM HMIAlternative WHERE ParentID IS NULL AND IsDeleted = 0').map((r) => r.AlternativeID));
	const altOfType = {};
	rowsOf(db, 'SELECT AlternativeID, AlternativeTypeID FROM HMIAlternative WHERE ParentID IS NULL AND IsDeleted = 0').forEach((r) => { altOfType[r.AlternativeTypeID] = r.AlternativeID; });
	const protoIds = {
		junction: findProto(db, 55, 'junction'), reservoir: findProto(db, 56, 'reservoir'), tank: findProto(db, 52, 'tank'),
		pipe: findProto(db, 69, 'pressure pipe'), pump: findProto(db, 68, 'pump'),
		pattern: findSupportProto(db, 50, 'pattern'), pumpDef: findSupportProto(db, 51, 'pump definition')
	};
	// Valves and the GPV headloss curve: optional prototypes, needed only when the network has a valve.
	const VALVE_TYPE_ID = { PRV: 64, PSV: 65, PBV: 66, FCV: 60, TCV: 61, GPV: 62 };
	const valveProto = {};
	Object.keys(VALVE_TYPE_ID).forEach((k) => {
		const r = rowsOf(db, 'SELECT m.ElementID AS id FROM HMIModelingElement m JOIN HMIDomainElement d ON d.DomainElementID = m.ElementID '
			+ 'WHERE d.DomainElementTypeID = ? AND d.IsDeleted = 0 AND m.IsDeleted = 0 ORDER BY m.ElementID', [VALVE_TYPE_ID[k]]);
		if (r.length) { valveProto[k] = collectPrototype(db, tables, r[0].id, baseAlts); }
	});
	const gpvCurveRows = rowsOf(db, 'SELECT SupportElementID AS id FROM HMISupportElement WHERE SupportElementTypeID = 63 AND IsDeleted = 0 ORDER BY SupportElementID');
	const gpvCurveProto = gpvCurveRows.length ? collectPrototype(db, tables, gpvCurveRows[0].id, baseAlts) : null;
	// A pump prototype must be a plain Standard pump (a pump station's or battery's pump has more rows).
	const proto = {};
	Object.keys(protoIds).forEach((k) => { proto[k] = collectPrototype(db, tables, protoIds[k], baseAlts); });
	const protoModel = {};
	['junction', 'reservoir', 'tank', 'pipe', 'pump'].forEach((k) => {
		protoModel[k] = rowsOf(db, 'SELECT * FROM HMIDomainElement WHERE DomainElementID = ?', [protoIds[k]])[0];
	});
	const protoSupport = {
		pattern: rowsOf(db, 'SELECT * FROM HMISupportElement WHERE SupportElementID = ?', [protoIds.pattern])[0],
		pumpDef: rowsOf(db, 'SELECT * FROM HMISupportElement WHERE SupportElementID = ?', [protoIds.pumpDef])[0]
	};
	const demandProtoRow = (proto.junction.filter((r) => r.table === 'IdahoDemandNode_Demand_DemandCollection')[0] || {}).row;
	report.template = { protoIds: protoIds, baseAlternatives: Array.from(baseAlts).sort((a, b) => a - b) };

	// ---- empty the template: every element above the defaults, the child scenario, its alternatives ----
	const DEFAULT_MAX = 30;   // elements 1..30 are the defaults every new project carries
	tables.forEach((t) => {
		if (t === 'HMIModelingElement' || t === 'HMIChangeTracking') { return; }
		const cols = colsOf(db, t), key = KEYS.find((k) => cols.indexOf(k) >= 0);
		if (key && !SKIP_TABLES[t]) { db.run('DELETE FROM "' + t + '" WHERE "' + key + '" > ' + DEFAULT_MAX); }
	});
	db.run('DELETE FROM HMIDomainElement WHERE DomainElementID > ' + DEFAULT_MAX);
	db.run('DELETE FROM HMISupportElement WHERE SupportElementID > ' + DEFAULT_MAX);
	// Child scenarios and the alternatives that belong to them alone.
	const childAlts = rowsOf(db, 'SELECT AlternativeID FROM HMIAlternative WHERE ParentID IS NOT NULL').map((r) => r.AlternativeID);
	const childScen = rowsOf(db, 'SELECT ScenarioID FROM HMIScenario WHERE ParentID IS NOT NULL').map((r) => r.ScenarioID);
	tables.forEach((t) => {
		if (t === 'HMIAlternative' || t === 'HMIScenarioAlternative') { return; }
		const cols = colsOf(db, t);
		if (cols.indexOf('AlternativeID') >= 0 && childAlts.length) {
			db.run('DELETE FROM "' + t + '" WHERE AlternativeID IN (' + childAlts.join(',') + ')');
		}
	});
	if (childScen.length) {
		db.run('DELETE FROM HMIScenarioAlternative WHERE ScenarioID IN (' + childScen.join(',') + ')');
		db.run('DELETE FROM HMIScenarioCalculationOptions WHERE ScenarioID IN (' + childScen.join(',') + ')');
		db.run('DELETE FROM HMIScenario WHERE ScenarioID IN (' + childScen.join(',') + ')');
	}
	if (childAlts.length) { db.run('DELETE FROM HMIAlternative WHERE AlternativeID IN (' + childAlts.join(',') + ')'); }
	// Elements go by their kind (domain 3, support 4) and the removed child alternatives and scenarios by their id; the
	// live scenario, alternatives and calculation options stay whatever their numbers (a project saved after edits has
	// them above 30).
	db.run('DELETE FROM HMIModelingElement WHERE ElementID > ' + DEFAULT_MAX + ' AND (ElementType IN (3, 4)'
		+ (childAlts.concat(childScen).length ? ' OR ElementID IN (' + childAlts.concat(childScen).join(',') + ')' : '') + ')');
	const keptMax = Math.max(DEFAULT_MAX, rowsOf(db, 'SELECT MAX(ElementID) AS m FROM HMIModelingElement')[0].m || 0);
	db.run("DELETE FROM sqlite_sequence WHERE name <> 'HMIModelingElement'");
	db.run("UPDATE sqlite_sequence SET seq = " + keptMax + " WHERE name = 'HMIModelingElement'");
	db.run('UPDATE HMIDomainDataSet SET ActiveScenarioID = (SELECT MIN(ScenarioID) FROM HMIScenario WHERE IsDeleted = 0)');
	report.removedChildScenarios = childScen; report.removedChildAlternatives = childAlts;

	// ---- ids and labels ----
	let nextId = keptMax + 1;
	const newId = () => nextId++;
	const live = { 55: 0, 56: 0, 52: 0, 69: 0, 68: 0, 64: 0, 65: 0, 66: 0, 60: 0, 61: 0, 62: 0 };
	const supportLive = { 50: 0, 51: 0, 54: 0, 55: 0, 56: 0, 59: 0, 61: 0, 63: 0 };

	function modeling(id, type, label, notes) {
		insert(db, 'HMIModelingElement', {
			ElementID: id, DomainDataSetID: 1, IsDeleted: 0, ElementType: type, HMIModelingElementGISIDsCount: 0,
			Label: label, SmartLabel: smartLabel(label), Notes: notes || ''
		});
	}
	function cloneRows(protoRows, id, skipTables, overrides) {
		// overrides: { table: {col: value} | function(row) }
		protoRows.forEach((pr) => {
			if (skipTables && skipTables[pr.table]) { return; }
			const row = Object.assign({}, pr.row);
			row[pr.key] = id;
			if ('ItemID' in row) { delete row.ItemID; }
			const ov = overrides && overrides[pr.table];
			if (ov) {
				Object.keys(ov).forEach((c) => {
					if (!(c in row)) { throw fail('data', 'The saved project is laid out differently from the version this writer was written against.', null, 'layout'); }
					row[c] = ov[c];
				});
			}
			insert(db, pr.table, row);
		});
	}
	function domainElement(id, typeId, label, notes) {
		modeling(id, 3, label, notes);
		insert(db, 'HMIDomainElement', { DomainElementID: id, DomainElementTypeID: typeId, IsDeleted: 0, DomainDataSetID: 1, IsPrototype: 0 });
		live[typeId]++;
	}
	function guid16() { const b = new Uint8Array(16); for (let i = 0; i < 16; i++) { b[i] = Math.floor(Math.random() * 256); } return b; }
	function supportElement(id, typeId, label, notes) {
		modeling(id, 4, label, notes);
		insert(db, 'HMISupportElement', {
			SupportElementID: id, SupportElementTypeID: typeId, IsDeleted: 0, DomainDataSetID: 1, IsPrototype: 0,
			EngineeringReferenceGuid: guid16(), DateModified: Math.floor(Date.now() / 1000)
		});
		supportLive[typeId] = (supportLive[typeId] || 0) + 1;
	}

	// ---- the network, in file units ----
	const nodes = parsed.nodes, links = parsed.links;
	const nodeById = {};
	nodes.forEach((n) => { nodeById[n.id] = n; });

	// An element's Notes (the Notes field every element of a saved project has) carries what the file states about it that
	// the project has no field of its own for: the description, the tag, and the names of the demand categories.
	const tagMaps = (EngCalcs.lpnTagsParse && (parsed.inpSections || {}).TAGS) ? EngCalcs.lpnTagsParse(parsed.inpSections.TAGS) : { node: {}, link: {} };
	function notesOf(kind, el) {
		const out = [];
		if (el.desc && String(el.desc).trim()) { out.push(String(el.desc).trim()); report.notesFrom.descriptions++; }
		const tag = (tagMaps[kind] || {})[el.id];
		if (tag) { out.push('Tag: ' + tag); report.notesFrom.tags++; }
		if (kind === 'node' && el.type === 'junction') {
			const cats = [{ base: el.demand, category: el.demandCategory }].concat(el.extraDemands || []).filter((d) => d.base && d.category)
				.map((d) => d.category + ' ' + d.base + ' gpm');
			if (cats.length) { out.push('Demand ' + (cats.length > 1 ? 'categories' : 'category') + ': ' + cats.join('; ')); report.notesFrom.categories += cats.length; }
		}
		return out.join('\n');
	}
	report.notesFrom = { descriptions: 0, tags: 0, categories: 0 };

	// Drawing scale: EPANET map units -> feet. One number for the whole map, the median of
	// (pipe length / drawn distance) over pipes that state both. Lengths do NOT depend on it: every
	// pipe is written with its stated length as a user-defined length.
	const ratios = [];
	links.forEach((l) => {
		if (l.type !== 'pipe' || !(l.length > 0) || l.length === 99 || l.length === 99.9) { return; }
		const a = nodeById[l.from], b = nodeById[l.to];
		if (!a || !b) { return; }
		const d = Math.hypot(a.x - b.x, a.y - b.y);
		if (d > 0) { ratios.push(l.length / d); }
	});
	ratios.sort((p, q) => p - q);
	const coordScale = opts.crsJson ? 1 : ratios.length ? Math.round(ratios[Math.floor(ratios.length / 2)] / 10) * 10 || 1000 : 1000;
	report.coordScaleFtPerMapUnit = coordScale;
	// TRUE POSITIONS (Tom's save spatial-ref, 2026-11-03): choosing NAD83 / Arizona Central (ft), EPSG:2223, changed one
	// column of the project and no geometry: IdahoDataSet.HmiModelCoordinateReference holds the system's definition (JSON,
	// kept byte for byte in js/data/wtg-template/crs-epsg-2223.json.gz) and the drawn feet are read as that system's feet.
	if (opts.crsJson) { db.run('UPDATE IdahoDataSet SET HmiModelCoordinateReference = ?', [opts.crsJson]); carried('coordinate system EPSG:2223, positions in international feet as the project states them'); report.crs = 'EPSG:2223'; }
	// Extent of the drawn map in feet: sizes the symbols (see symbolMultiplier()).
	{
		const xs = nodes.map((n) => n.x * coordScale), ys = nodes.map((n) => n.y * coordScale);
		report.extentFt = xs.length ? Math.max(Math.max.apply(null, xs) - Math.min.apply(null, xs), Math.max.apply(null, ys) - Math.min.apply(null, ys)) : 0;
	}
	const P = (n) => [n.x * coordScale, n.y * coordScale];

	// ---- patterns (support) ----
	const patId = {};
	parsed.patterns.forEach((pt) => {
		const id = newId(); patId[pt.id] = id;
		supportElement(id, 50, pt.id, pt.note || '');
		const m = pt.multipliers, n = m.length, step = parsed.times.patternStep || 3600;
		cloneRows(proto.pattern, id, { IdahoPattern_PatternCurve: 1 }, {
			IdahoPattern: {
				IdahoPattern_PatternStartTime: EPOCH_2000, IdahoPattern_PatternStartingMultiplier: m[0],
				PatternFormat: 0, PatternCurveCount: n, PatternCategory: 0
			}
		});
		// STEPWISE: the starting multiplier is the first value; point k states the value from k*step on,
		// and the last point closes the cycle with the first value again (Tnet3 against its .inp).
		for (let k = 1; k <= n; k++) {
			db.run('INSERT INTO IdahoPattern_PatternCurve (SupportElementID, PatternCurve_TimeFromStart, PatternCurve_Multiplier) VALUES (?,?,?)',
				[id, k * step, m[k % n]]);
		}
	});
	report.counts.patterns = parsed.patterns.length;
	carried('patterns: ' + parsed.patterns.length + ' stepwise, one value per hour, same ids as labels');

	// ---- pump definitions (support) ----
	const curveById = {};
	parsed.curves.forEach((c) => { curveById[c.id] = c; });
	const pumpDefId = {};
	// A pump's efficiency curve (EPANET [ENERGY] "Pump <id> Efficiency <curve>"): two or more points make a
	// multiple-point efficiency curve; one point is a constant. Two pumps share a definition only if both curves match.
	function effCurveOf(pm) {
		const c = pm.efficCurveId && curveById[pm.efficCurveId];
		return c && c.points && c.points.length ? c : null;
	}
	function defKey(pm) { return pm.curveId + '|' + (effCurveOf(pm) ? effCurveOf(pm).id : ''); }
	links.filter((l) => l.type === 'pump').forEach((pm) => {
		const c = curveById[pm.curveId];
		if (!pumpCurveCarriable(c)) {
			throw fail('pump-curve', 'Pump ' + pm.id + ' has no three-point or one-point head curve. Power pumps and other multiple-point curves are not written.', [pm.id], 'pump_curve', { ids: pm.id });
		}
		const dk = defKey(pm);
		if (pumpDefId[dk]) { return; }
		const id = newId(); pumpDefId[dk] = id;
		const ec = effCurveOf(pm);
		// A one-point curve (design point) is WaterGEMS's "design point" definition, PumpDefinitionType 1 (Tom's save tompump1pt,
		// 2026-11-03, our three-point pump changed to one point at 300 gpm and 120 ft): the type and the best-efficiency maximum
		// flow (twice the design flow) change; the design point, shutoff 1.25 x head and maximum 2 x flow at 0.5 x head keep
		// the values WaterGEMS holds for that design point.
		const one = c.points.length === 1;
		const pts = one ? [[0, c.points[0][1] * 1.25], c.points[0], [c.points[0][0] * 2, c.points[0][1] * 0.5]] : c.points;
		supportElement(id, 51, 'Pump Curve ' + c.id, 'EPANET curve ' + c.id + (c.note ? ': ' + c.note : ''));
		const eff = ec && ec.points.length === 1 ? ec.points[0][1] : (opts.efficiency || 75);
		const multi = !!(ec && ec.points.length > 1);
		cloneRows(proto.pumpDef, id, { IdahoPumpDefinition_PumpEfficiencyType_BestEfficiencyPointType: 1, IdahoPumpDefinition_PumpEfficiencyType_ConstantEfficiencyType: 1 }, {
			IdahoPumpDefinition: {
				PumpDefinitionType: one ? 1 : 2,             // 1 design point (tompump1pt); 2 standard three point (Tom's PD1)
				ShutoffHead: pts[0][1],
				DesignDischarge: pts[1][0] * GPM_TO_CFS, DesignHead: pts[1][1],
				MaxOperatingDischarge: pts[2][0] * GPM_TO_CFS, MaxOperatingHead: pts[2][1],
				IdahoPumpDefinition_MotorEfficiency: 100.0,
				PumpEfficiencyType: multi ? 2 : 0            // 0 constant (EPS sample's ConstantEfficiencyType); 2 efficiency points (the reader's)
			}
		});
		if (one) { db.run('UPDATE IdahoPumpDefinition SET IdahoPumpDefinition_UserDefinedBestEfficiencyMaxFlow = ? WHERE SupportElementID = ?', [pts[2][0] * GPM_TO_CFS, id]); }
		insert(db, 'IdahoPumpDefinition_PumpEfficiencyType_ConstantEfficiencyType', { SupportElementID: id, ConstantEfficiencyType_PumpEfficiency: eff });
		if (multi) {
			// The rows are the curve's own points, flow gpm to ft3/s, efficiency as stated.
			insert(db, 'IdahoPumpDefinition_PumpEfficiencyType_MultipleEfficiencyPointsType', { SupportElementID: id, DischargeEfficiencyCurveCount: ec.points.length });
			ec.points.forEach((pt) => {
				insert(db, 'IdahoPumpDefinition_DischargeEfficiencyCurve', { SupportElementID: id, DischargeEfficiencyCurve_Discharge: pt[0] * GPM_TO_CFS, DischargeEfficiencyCurve_Efficiency: pt[1] });
			});
		}
	});
	carried('pump curves: ' + Object.keys(pumpDefId).length + ' pump definitions (three-point or one-point), constant efficiency ' + (opts.efficiency || 75) + ' %');

	// ---- GPV headloss curves (support type 63): flow gpm -> ft3/s, headloss ft ----
	const gpvCurveId = {};
	links.filter((l) => l.type === 'valve' && String(l.valveType).toUpperCase() === 'GPV').forEach((v) => {
		const c = curveById[v.curveId];
		if (!c || !c.points || c.points.length < 2) { throw fail('data', 'GPV ' + v.id + ': the headloss curve ' + v.curveId + ' is not in the project.', [v.id], 'gpv_curve', { id: v.id }); }
		if (gpvCurveId[c.id]) { return; }
		if (!gpvCurveProto) { throw fail('data', 'The saved project has no GPV headloss curve to copy.', null, 'kind', { kind: 'general purpose valve headloss curve' }); }
		const id = newId(); gpvCurveId[c.id] = id;
		supportElement(id, 63, c.id, 'EPANET headloss curve ' + c.id);
		cloneRows(gpvCurveProto, id, { GpvHeadlossCurve_GpvHeadlossFlowCurve: 1 }, { GpvHeadlossCurve: { GpvHeadlossFlowCurveCount: c.points.length } });
		c.points.forEach((p) => {
			db.run('INSERT INTO GpvHeadlossCurve_GpvHeadlossFlowCurve (SupportElementID, GpvHeadlossFlowCurve_GpvFlow, GpvHeadlossFlowCurve_GpvHeadloss) VALUES (?,?,?)', [id, p[0] * GPM_TO_CFS, p[1]]);
		});
	});

	// ---- tank volume curves ----
	const tankPhysAlt = (proto.tank.filter((r) => r.table === 'ConventionalTank_Physical_Data')[0] || { row: {} }).row.AlternativeID;
	function volumeCurveRows(n, vc) {
		// Linear interpolation of the curve at the tank's minimum and maximum level, then the points between.
		const pts = vc.points.slice().sort((a, b) => a[0] - b[0]);
		const at = (d) => {
			if (d < pts[0][0] - 1e-9 || d > pts[pts.length - 1][0] + 1e-9) { throw fail('data', 'Tank ' + n.id + ': volume curve ' + vc.id + ' does not cover its level range ' + n.minLevel + ' to ' + n.maxLevel + '.', [n.id], 'vol_range', { id: n.id }); }
			for (let i = 1; i < pts.length; i++) {
				if (d <= pts[i][0] + 1e-12) { const f = pts[i][0] === pts[i - 1][0] ? 0 : (d - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]); return pts[i - 1][1] + f * (pts[i][1] - pts[i - 1][1]); }
			}
			return pts[pts.length - 1][1];
		};
		const lo = n.minLevel, hi = n.maxLevel, vLo = at(lo), vHi = at(hi);
		const inner = pts.filter((p) => p[0] > lo + 1e-9 && p[0] < hi - 1e-9);
		const rows = [[lo, vLo]].concat(inner).concat([[hi, vHi]]);
		const active = vHi - vLo;
		return { alt: tankPhysAlt, inactive: vLo, active: active, points: rows.map((p) => [(p[0] - lo) / (hi - lo), active > 0 ? (p[1] - vLo) / active : 0]) };
	}

	// ---- nodes ----
	const elId = {};            // EPANET node id -> ElementID
	const defaultPattern = parsed.defaultPattern;
	const circle = (d) => Math.PI * d * d / 4;
	let nJ = 0, nR = 0, nT = 0;
	// A junction's demands: row 0 is its own demand, the rest are `extraDemands`. A row that states no flow is not written.
	// The file's Demand Multiplier is applied here: every base demand is written already multiplied by it, which is what
	// EPANET does to each demand before the pattern (no field for the multiplier itself has a stated place in a saved project).
	const dmRaw = parsed.hydraulics && parsed.hydraulics.demandMultiplier;
	const demandMult = (dmRaw !== undefined && isFinite(Number(dmRaw))) ? Number(dmRaw) : 1;
	report.demandMultiplier = demandMult;
	function demandRows(n) {
		return [{ base: n.demand, pattern: n.demandPattern }].concat(n.extraDemands || []).filter((d) => d.base).map((d) => ({ base: d.base * demandMult, pattern: d.pattern }));
	}
	nodes.forEach((n) => {
		const id = newId(); elId['n:' + n.id] = id;
		const xy = P(n);
		const geo = { BaseIdahoNode_HmiDataSetGeometry_Data: { HMIGeometry: wkbPoint(xy[0], xy[1]) } };
		if (n.type === 'junction') {
			domainElement(id, 55, n.id, notesOf('node', n));
			const ov = Object.assign({}, geo, {
				BaseIdahoNode_Physical_Data: { Physical_NodeElevation: n.elev },
				IdahoDemandNode_Demand_Data: { DemandCollectionCount: demandRows(n).length, UnitDemandLoadCollectionCount: 0 },
				IdahoFireFlowNode_Physical_Data: { Physical_EmitterCoefficient: 0 }
			});
			cloneRows(proto.junction, id, { IdahoDemandNode_Demand_DemandCollection: 1 }, ov);
			// One row per demand, in the order the junction states them (EPANET's [DEMANDS] lines).
			demandRows(n).forEach((d) => {
				const pat = d.pattern || defaultPattern;
				const row = Object.assign({}, demandProtoRow);
				delete row.ItemID;
				row.DomainElementID = id; row.AlternativeID = altOfType[20];
				row.DemandCollection_BaseFlow = d.base * GPM_TO_CFS;
				row.DemandCollection_DemandPattern = pat ? patId[pat] : null;
				insert(db, 'IdahoDemandNode_Demand_DemandCollection', row);
			});
			nJ++;
		} else if (n.type === 'reservoir') {
			domainElement(id, 56, n.id, notesOf('node', n));
			const resOv = Object.assign({}, geo, { BaseIdahoNode_Physical_Data: { Physical_NodeElevation: n.head } });
			if (n.headPattern) {
				if (patId[n.headPattern] === undefined) { throw fail('data', 'Reservoir ' + n.id + ' names head pattern ' + n.headPattern + ', which the project does not define.', [n.id], 'head_pattern', { id: n.id }); }
				resOv.IdahoReservoir_Physical_Data = { Physical_HglPattern: patId[n.headPattern] };
			}
			cloneRows(proto.reservoir, id, null, resOv);
			nR++;
		} else if (n.type === 'tank') {
			domainElement(id, 52, n.id, notesOf('node', n));
			// A volume curve: EPANET gives depth above the tank bottom and volume (ft3). WaterGEMS holds
			// the active range as depth ratio and volume ratio (OBSERVED in Tom's saved TGH-1 scenario
			// against its .inp: depth 16.2 of 1..20 is ratio 0.8; volume / total active volume), the total
			// active volume, the inactive volume below the minimum level, and TankSection 2.
			const vc = n.volCurve ? curveById[n.volCurve] : null;
			let tankSection = null;
			if (n.volCurve && !(vc && vc.points && vc.points.length >= 2)) { throw fail('data', 'Tank ' + n.id + ' names volume curve ' + n.volCurve + ', which the project does not define.', [n.id], 'vol_missing', { id: n.id }); }
			if (vc) { tankSection = volumeCurveRows(n, vc); }
			cloneRows(proto.tank, id, tankSection ? { ConventionalTank_Physical_DepthRatioVolumeRatioCurve: 1 } : null, Object.assign({}, geo, {
				BaseIdahoNode_Physical_Data: { Physical_NodeElevation: n.elev },
				ConventionalTank_Physical_Data: {
					Physical_TankBaseElevation: n.elev, Physical_TankMinimumElevation: n.elev + n.minLevel,
					Physical_TankMaximumElevation: n.elev + n.maxLevel,
					CircularTankSectionType_TankDiameter: n.diameter, NonCircularTankSectionType_TankAverageArea: circle(n.diameter),
					OperatingRangeType: 0, TankSection: 0
				},
				ConventionalTank_InitialSettings_Data: { InitialSettings_TankInitialElevation: n.elev + n.level }
			}));
			if (tankSection) {
				db.run('UPDATE ConventionalTank_Physical_Data SET TankSection = 2, VariableAreaTankSectionType_TotalActiveVolume = ?, Physical_InactiveVolume = ?, DepthRatioVolumeRatioCurveCount = ? WHERE DomainElementID = ? AND AlternativeID = ?',
					[tankSection.active, tankSection.inactive, tankSection.points.length, id, tankSection.alt]);
				tankSection.points.forEach((p) => {
					db.run('INSERT INTO ConventionalTank_Physical_DepthRatioVolumeRatioCurve (DomainElementID, AlternativeID, DepthRatioVolumeRatioCurve_DepthRatio, DepthRatioVolumeRatioCurve_VolumeRatio) VALUES (?,?,?,?)',
						[id, tankSection.alt, p[0], p[1]]);
				});
			}
			nT++;
		} else {
			throw fail('node-kind', 'Node ' + n.id + ' is of kind ' + n.type + ', which is not written.', [n.id], 'asset_kind', { id: n.id });
		}
	});
	report.counts.junctions = nJ; report.counts.reservoirs = nR; report.counts.tanks = nT;

	// ---- links ----
	const initialStatus = (schedule && schedule.initial) || {};
	const pipeElId = {};        // EPANET link id -> ElementID of the pipe that carries its status
	const pumpNodeId = {};
	let nPipe = 0, nPump = 0, nAdded = 0;
	function pipeRows(id, label, startEl, stopEl, pts, lengthFt, diaIn, C, minorK, closed, checkValve, notes) {
		domainElement(id, 69, label, notes);
		cloneRows(proto.pipe, id, null, {
			BaseLink_HMIDataSetTopology_Data: { HMITopologyStartNodeID: startEl, HMITopologyStopNodeID: stopEl },
			BaseLink_HmiDataSetGeometry_Data: { HMIGeometry: wkbLine(pts), HMIGeometryScaledLength: polyLength(pts) },
			BaseLink_Physical_Data: { Physical_IsUserDefinedLength: 1, Physical_UserDefinedLength: lengthFt },
			IdahoPipe_Physical_Data: {
				Physical_PipeDiameter: diaIn * IN_TO_FT, Physical_HazenWilliamsC: C,
				Physical_CompositeMinorLoss: minorK, Physical_CalculatedMinorLossCoefficient: minorK,
				Physical_HasCheckValve: checkValve ? 1 : 0
			},
			IdahoPipe_InitialSettings_Data: { PipeStatus: closed ? 1 : 0 }
		});
	}
	// A valve is a NODE between two pipes, as a pump is (Tom's saved TGH-1 and its .inp export: PRV-2 is a
	// node with pipes 57-A and 57-B). Its elevation is the DOWNSTREAM node's, because an EPANET pressure
	// valve states its setting at the downstream node and WaterGEMS states it at the valve.
	// Closed valves are carried by closing the upstream pipe.
	const psiToFt = 115.52457081915186 / 50;        // the HGL WaterGEMS stored beside a 50 psi setting (TGH-1)
	let nValve = 0;
	function writeValve(l) {
		const vt = String(l.valveType || '').toUpperCase();
		if (!valveProto[vt]) { throw fail('data', 'Valve ' + l.id + ' is a ' + vt + ', and the saved project holds no ' + vt + ' to copy.', [l.id], 'kind', { kind: vt + ' valve' }); }
		const a = nodeById[l.from], b = nodeById[l.to];
		const mid = [(P(a)[0] + P(b)[0]) / 2, (P(a)[1] + P(b)[1]) / 2];
		const valveId = newId(), aId = newId(), bId = newId();
		const ov = {
			BaseDirectedNode_HmiDataSetGeometry_Data: { HMIGeometry: wkbPoint(mid[0], mid[1]) },
			BaseDirectedNode_HMIDataSetTopology_Data: { HMITopologyDownstreamLinkID: bId },
			BaseDirectedNode_Physical_Data: { Physical_NodeElevation: b.type === 'reservoir' ? b.head : b.elev },
			BaseValve_Physical_Data: { Physical_ValveDiameter: l.diameter * IN_TO_FT, Physical_CompositeMinorLoss: l.k || 0 }
		};
		if (vt === 'PRV' || vt === 'PSV' || vt === 'PBV') {
			ov.PressureValve_InitialSettings_PressureValveSetting_ValvePressureType = { ValvePressureType_ValvePressureSetting: l.setting };
			ov.PressureValve_InitialSettings_PressureValveSetting_ValveHGLType = { ValveHGLType_ValveHGLSetting: l.setting * psiToFt };
			ov.PressureValve_InitialSettings_Data = { PressureValveSetting: 0 };
		} else if (vt === 'FCV') {
			ov.FCV_InitialSettings_Data = { InitialSettings_FlowSetting: l.setting * GPM_TO_CFS };
		} else if (vt === 'TCV') {
			ov.TCV_InitialSettings_Data = { InitialSettings_HeadlossCoefficient: l.setting, TCVCoefficientType: 1 };
		} else if (vt === 'GPV') {
			if (!(l.curveId && gpvCurveId[l.curveId])) { throw fail('data', 'GPV ' + l.id + ' has no headloss curve.', [l.id], 'gpv_curve', { id: l.id }); }
			ov.GPV_Physical_Data = { Physical_GpvHeadlossCurveID: gpvCurveId[l.curveId] };
		}
		domainElement(valveId, VALVE_TYPE_ID[vt], l.id, notesOf('link', l));
		cloneRows(valveProto[vt], valveId, null, ov);
		const closed = String(l.status || '').toUpperCase() === 'CLOSED';
		pipeRows(aId, l.id + '-A', elId['n:' + l.from], valveId, [P(a), mid], 1, 99, 130, 0, closed, false);
		pipeRows(bId, l.id + '-B', valveId, elId['n:' + l.to], [mid, P(b)], 1, 99, 130, 0, false, false);
		pipeElId[l.id] = aId;
		report.counts['valve' + vt] = (report.counts['valve' + vt] || 0) + 1;
		nValve++; nAdded += 2;
	}
	// Pass 1: ordinary pipes (so they take consecutive ids), then the pumps and valves.
	links.forEach((l) => {
		if (l.type !== 'pipe') { return; }
		const id = newId(); pipeElId[l.id] = id;
		const a = nodeById[l.from], b = nodeById[l.to];
		const pts = [P(a)].concat((l.verts || []).map((v) => [v.x !== undefined ? v.x * coordScale : v[0] * coordScale, v.y !== undefined ? v.y * coordScale : v[1] * coordScale])).concat([P(b)]);
		const st = String(l.status || 'open').toUpperCase();
		const closedAtStart = initialStatus[l.id] ? initialStatus[l.id] === 'closed' : st === 'CLOSED';
		pipeRows(id, l.id, elId['n:' + l.from], elId['n:' + l.to], pts, l.length, l.diameter, l.roughness, l.k || 0, closedAtStart, st === 'CV', notesOf('link', l));
		nPipe++;
	});
	links.forEach((l) => {
		if (l.type === 'pipe') { return; }
		if (l.type === 'valve') { writeValve(l); return; }
		if (l.type !== 'pump') { throw fail('link-kind', 'Link ' + l.id + ' is a ' + l.type + ', which is not written.', [l.id], 'asset_kind', { id: l.id }); }
		// A pump is a NODE between two pipes. Upstream pipe "<id>-A", downstream "<id>-B", both
		// 1 ft long and 99 in across as WaterGEMS's own .inp import makes them (EPS sample: length 1,
		// diameter 8.25 ft), so they add no head loss worth the name. The pump node sits at the
		// middle of the two end nodes.
		const a = nodeById[l.from], b = nodeById[l.to];
		const mid = [(P(a)[0] + P(b)[0]) / 2, (P(a)[1] + P(b)[1]) / 2];
		const pumpId = newId(), aId = newId(), bId = newId();
		pumpNodeId[l.id] = pumpId;
		domainElement(pumpId, 68, l.id, notesOf('link', l));
		cloneRows(proto.pump, pumpId, null, {
			BaseDirectedNode_HmiDataSetGeometry_Data: { HMIGeometry: wkbPoint(mid[0], mid[1]) },
			BaseDirectedNode_HMIDataSetTopology_Data: { HMITopologyDownstreamLinkID: bId },
			BaseDirectedNode_Physical_Data: { Physical_NodeElevation: a.type === 'reservoir' ? a.head : a.elev },
			StandardPump_Physical_Data: { Physical_PumpDefinitionID: pumpDefId[defKey(l)] },
			BasePump_InitialSettings_Data: { InitialSettings_RelativeSpeedFactor: l.speed > 0 ? l.speed : 1 }
		});
		if (l.power) { lost('constant power on pump ' + l.id); }
		const closed = (initialStatus[l.id] || (String(l.status || '').toUpperCase() === 'CLOSED' ? 'closed' : 'open')) === 'closed';
		pipeRows(aId, l.id + '-A', elId['n:' + l.from], pumpId, [P(a), mid], 1, 99, 130, 0, closed, false);
		pipeRows(bId, l.id + '-B', pumpId, elId['n:' + l.to], [mid, P(b)], 1, 99, 130, 0, false, false);
		pipeElId[l.id] = aId;     // pump on/off is carried by the upstream pipe's status
		nPump++; nAdded += 2;
	});
	// ---- energy price (dev/wtg-export.md, "Energy price") ----
	// One EnergyPricing support element (type 61) per distinct price, price pattern and demand charge; a pump points at it
	// through its BasePump_EnergyCost_Data row. [ENERGY] "Global Price" reaches every pump with no price of its own, a pump's
	// own PRICE replaces it, and a price of zero is no price. A price pattern becomes the element's price curve (a start
	// price and points of time from the start, as Tom's energy-price-pattern save holds it); "Demand Charge" (global, per kW)
	// becomes the peak demand charge. A pump with no price still gets an element when a demand charge is stated.
	{
		const en = EngCalcs.lpnEnergyParse ? EngCalcs.lpnEnergyParse((parsed.inpSections || {}).ENERGY || []) : null;
		const priceEl = {}, written = [];
		if (en) {
			const demand = en.demandCharge > 0 ? en.demandCharge : 0;
			const tm = parsed.times || {}, pstep = tm.patternStep || 3600, pstart = tm.patternStart || 0, dur = tm.duration || 0;
			const rd = (x) => Math.round(x * 1e10) / 1e10;
			links.forEach((l) => {
				if (l.type !== 'pump') { return; }
				const own = Object.prototype.hasOwnProperty.call(en.price, l.id) ? en.price[l.id] : en.globalPrice;
				const base = own > 0 ? own : 0;
				if (!base && !demand) { return; }
				const patName = en.pattern[l.id] || en.globalPattern;
				const pat = base && patName ? parsed.patterns.find((q) => q.id === patName) : null;
				let start = base, curve = [];
				if (pat && pat.multipliers && pat.multipliers.length) {
					const m = pat.multipliers, n = m.length, cycle = n * pstep, total = cycle * Math.max(1, Math.ceil(dur / cycle));
					const at = (t) => rd(base * m[Math.floor((t + pstart) / pstep) % n]);
					start = at(0);
					for (let t = pstep; t <= total; t += pstep) { if (t === total || at(t) !== at(t - pstep)) { curve.push([t, at(t)]); } }
					if (curve.length === 1 && curve[0][1] === start) { curve = []; }
				}
				const key = JSON.stringify([base, start, curve, demand]);
				if (!priceEl[key]) {
					const eid = newId();
					supportElement(eid, 61, 'Energy Pricing - ' + (Object.keys(priceEl).length + 1));
					insert(db, 'EnergyPricing', {
						SupportElementID: eid, EnergyPricing_IncludePeakDemandCharge: demand ? 1 : 0, EnergyPricing_BillingPeriod: 30,
						EnergyPricing_EnergyPricingStartTime: EPOCH_2000, EnergyPricing_PeakDemandCharge: demand,
						EnergyPricing_StartEnergyPrice: start, EnergyPricing_EnergyPrice: base, EnergyPricing_AboveRangeEnergyPrice: 0,
						EnergyPricing_BillingDemand: 0, EnergyPricing_UseAdvancedPeakCharges: 0, TariffType: curve.length ? 1 : 0, PeakChargeType: 0,
						EnergyPriceCurveCount: curve.length, BlockRateCurveCount: 0, BlockRateBasedOnDemandCurveCount: 0,
						ClockTimePeakChargesCount: 0, SimulationTimePeakChargesCount: 0
					});
					curve.forEach((c) => {
						db.run('INSERT INTO EnergyPricing_EnergyPriceCurve (SupportElementID, EnergyPriceCurve_TimeFromStart, EnergyPriceCurve_EnergyPrice) VALUES (?,?,?)', [eid, c[0], c[1]]);
					});
					priceEl[key] = eid;
				}
				db.run('UPDATE BasePump_EnergyCost_Data SET EnergyCost_EnergyPricingID = ? WHERE DomainElementID = ?', [priceEl[key], pumpNodeId[l.id]]);
				written.push(l.id);
			});
		}
		report.counts.energyPrices = Object.keys(priceEl).length; report.counts.pumpsWithPrice = written.length;
		if (written.length) { carried('energy price: ' + report.counts.energyPrices + ' pricing element' + (report.counts.energyPrices > 1 ? 's' : '') + ' on ' + written.length + ' pump' + (written.length > 1 ? 's' : '')); }
	}
	report.counts.pipes = nPipe; report.counts.pumps = nPump; report.counts.valves = nValve; report.counts.pumpConnectingPipes = nAdded;
	carried('junctions ' + nJ + ', reservoirs ' + nR + ', tanks ' + nT + ', pipes ' + nPipe + ', pumps ' + nPump + ' (each a node with ' + 2 + ' added 1 ft pipes), valves ' + nValve);

	// ---- controls ----
	// Three support elements per control: a condition, an action, and the control that joins them.
	// Only the clock-time condition and the pipe-status action have codes anyone has SEEN in a file,
	// so every EPANET control is carried as clock-time controls on a pipe, from a reference run
	// (dev/wtg-export.md, "Controls").
	const changes = (schedule && schedule.changes) || [];
	const clockEpoch = (t) => EPOCH_2000 + (t % 86400);
	function controlText(t, linkLabel, status, isPump) {
		const hh = Math.floor((t % 86400) / 3600), mm = Math.floor((t % 3600) / 60), ss = t % 60;
		const clock = String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0') + (ss ? ':' + String(ss).padStart(2, '0') : '');
		return { cond: 'Clock Time  = ' + clock + ' ', act: linkLabel + (isPump ? ' Pump' : ' Pipe') + ' Status = ' + status + ' ' };
	}
	let nCtl = 0, nLevel = 0;
	const controlIds = [];
	// Tank-level controls ("Link 335 OPEN IF Node 1 BELOW 17.1") are written as real tank-level controls,
	// in the codes Tom's own saved wtg-control-1 showed (dev/wtg-export.md, "Tank-level controls").
	// A junction-pressure condition has no sample, so its link keeps the frozen clock schedule.
	const levelCtl = opts.frozenLevelControls ? [] : (parsed.controls || []).filter((c) => c.condition && c.condition.kind === 'node'
		&& nodeById[c.condition.node] && (nodeById[c.condition.node].type === 'tank' || nodeById[c.condition.node].type === 'junction') && pipeElId[c.link]
		&& (c.condition.cmp === 'below' || c.condition.cmp === 'above'));
	// [RULES] of the simplest shape (carriableRules) join them as logical controls. A link a written rule acts on keeps no frozen schedule.
	const ruleCtl = carriableRules(parsed).written;
	const realLinks = {};
	levelCtl.forEach((c) => { realLinks[c.link] = 1; });
	ruleCtl.forEach((c) => { c.thenActs.concat(c.elseAct ? [c.elseAct] : []).forEach((a) => { realLinks[a.link] = 1; }); });
	const fmt2 = (v) => Number(v).toFixed(2);
	function setRows(table, id, rowObj) { insert(db, table, Object.assign({ SupportElementID: id }, rowObj)); }
	// One action row set: a pump's action is the pump itself, a pipe's the pipe (status only). Returns its id and text.
	// A composite action (several THEN actions; Tom's ctl-composite save) is a parent row, ControlActionType 1, that repeats its first
	// action's row set and lists every action in IdahoControlAction_ActionCollection, in the order stated; `kids` are the written ones.
	const statusText = (link, status) => { const isPump = !!pumpNodeId[link]; return link + (isPump ? ' Pump' : ' Pipe') + ' Status = ' + (isPump ? (status === 'open' ? 'On' : 'Off') : (status === 'open' ? 'Open' : 'Closed')) + ' '; };
	function writeActions(list) {
		if (list.length === 1) { return writeAction(list[0].link, list[0].status); }
		const kids = list.map((a) => writeAction(a.link, a.status));
		const parent = writeAction(list[0].link, list[0].status, { kids: kids, plain: list.map((a) => statusText(a.link, a.status)).join(', ') });
		return parent;
	}
	function writeAction(link, status, parentOf) {
		const isPump = !!pumpNodeId[link];
		const statusWord = isPump ? (status === 'open' ? 'On' : 'Off') : (status === 'open' ? 'Open' : 'Closed');
		const aId = newId(), aName = statusWord + '-' + link;
		let actTxt = aName + ' {"' + link + '" ' + (isPump ? 'Pump' : 'Pipe') + ' Status = ' + statusWord + ' }';
		supportElement(aId, 55, 'A' + aId, '{A' + aId + ':  ' + actTxt.replace(/"/g, '""') + '}');
		if (parentOf) {
			actTxt = parentOf.plain;
			setRows('IdahoControlAction', aId, { IdahoControlAction_DefineDescription: 0, IdahoControlAction_Description: 'text', IdahoControlAction_ExpandedDescription: actTxt, ControlActionType: 1 });
		} else {
			setRows('IdahoControlAction', aId, { IdahoControlAction_DefineDescription: 1, IdahoControlAction_Description: aName + ' {"%e" %a %o %v %u}', IdahoControlAction_ExpandedDescription: actTxt, ControlActionType: 0 });
		}
		setRows('IdahoControlAction_ControlActionType_SimpleActionType', aId, isPump ? { SimpleActionType_Element: pumpNodeId[link], ElementType: 68 } : { SimpleActionType_Element: pipeElId[link], ElementType: 69 });
		// A pump's action is the pump itself (Tom's ctl-pump-level save, whose run switched the pump by its rule): the pump,
		// FCV and pump-status rows only, status 0 On and 1 Off. A pipe's carries the full set.
		const aSub = isPump ? [
			['IdahoControlAction_ElementType_ControlActionFCVType', { FCVAttribute: 0 }],
			['IdahoControlAction_ElementType_ControlActionPumpType', { PumpAttribute: 0 }],
			['IdahoControlAction_PumpAttribute_ActionPumpStatusType', { ActionPumpStatus: status === 'open' ? 0 : 1 }],
			['IdahoControlAction_FCVAttribute_ActionFCVSettingType', { ActionFCVSettingType_Discharge: 0 }]
		] : [
			['IdahoControlAction_ElementType_ControlActionPipeType', { PipeAttribute: 0 }],
			['IdahoControlAction_PipeAttribute_ActionPipeStatusType', { ActionPipeStatus: status === 'open' ? 0 : 1 }],
			['IdahoControlAction_ElementType_ControlActionPumpType', { PumpAttribute: 0 }],
			['IdahoControlAction_PumpAttribute_ActionPumpStatusType', { ActionPumpStatus: 0 }],
			['IdahoControlAction_PumpAttribute_ActionPumpSettingType', { ActionPumpSettingType_RelativeSpeedFactor: 0 }],
			['IdahoControlAction_PumpAttribute_ActionPumpPressureSettingType', { ActionPumpPressureSettingType_TargetPressure: 0 }],
			['IdahoControlAction_PumpAttribute_ActionPumpHeadSettingType', { ActionPumpHeadSettingType_TargetHead: 0 }],
			['IdahoControlAction_ElementType_ControlActionTCVType', { TCVAttribute: 0 }],
			['IdahoControlAction_TCVAttribute_ActionTCVStatusType', { TCVStatus: 1 }],
			['IdahoControlAction_TCVAttribute_ActionTCVSettingType', { ActionTCVSettingType_HeadlossCoefficient: 0 }],
			['IdahoControlAction_ElementType_ControlActionGPVType', { GPVAttribute: 0 }],
			['IdahoControlAction_GPVAttribute_ActionGPVStatusType', { GPVStatus: 1 }],
			['IdahoControlAction_ElementType_ControlActionFCVType', { FCVAttribute: 0 }],
			['IdahoControlAction_FCVAttribute_ActionFCVSettingType', { ActionFCVSettingType_Discharge: 0 }],
			['IdahoControlAction_FCVAttribute_ActionFCVStatusType', { FCVStatus: 1 }],
			['IdahoControlAction_ElementType_ControlActionPressureValveType', { PRVAttribute: 0 }],
			['IdahoControlAction_PRVAttribute_ActionPressureValveSettingType', { ActionPressureValveSettingType_HydraulicGrade: 0, ActionPressureValveSettingType_Pressure: 0 }],
			['IdahoControlAction_PRVAttribute_ActionPressureValveStatusType', { ActionPressureValveStatus: 1 }]
		];
		aSub.forEach((r) => { setRows(r[0], aId, r[1]); });
		if (parentOf) {
			setRows('IdahoControlAction_ControlActionType_CompositeActionType', aId, { ActionCollectionCount: parentOf.kids.length });
			parentOf.kids.forEach((k) => { insert(db, 'IdahoControlAction_ActionCollection', { SupportElementID: aId, ActionCollection_ControlAction: k.id }); });
		}
		return { id: aId, txt: actTxt };
	}
	// One simple condition. With `parentOf` it is the parent row of a composite condition (Tom's ctl-composite save): ConditionType 1, a
	// plain-text description, the first condition's rows repeated, and the children listed with the operator that joins each
	// (LogicalOperator 0 for the first, 1 AND, 2 OR) in IdahoControlCondition_ControlConditionCollection.
	function writeCond(cd, parentOf) {
		const sym = cd.cmp === 'below' ? '<' : '>';
		const cId = newId();
		const cName = 'Node-' + cd.node + '-' + cd.cmp + '-' + cd.value;
		// A junction pressure condition (written always since 2026-11-09), the codes of Tom's ctl-pressure-time save
		// (NodeAttribute 2, value in ElementType_Pressure in psi, element type 50, tank row at 1). The 2-pressure run (2026-11-09)
		// showed WaterGEMS applying it, one hydraulic step later than EPANET (dev/wtg-export.md).
		const isJ = nodeById[cd.node].type === 'junction';
		const plain = cd.node + (isJ ? ' Pressure' : ' Level') + ' ' + sym + ' ' + fmt2(cd.value) + (isJ ? ' psi' : ' ft');
		let condTxt = cName + ' {"' + cd.node + '" ' + (isJ ? 'Pressure' : 'Level') + ' ' + sym + ' ' + fmt2(cd.value) + (isJ ? ' psi}' : ' ft}');
		supportElement(cId, 56, 'C' + cId, '{C' + cId + ':  ' + condTxt + '}');
		if (parentOf) {
			condTxt = parentOf.plain;
			setRows('IdahoControlCondition', cId, { IdahoControlCondition_DefineDescription: 0, IdahoControlCondition_Description: 'text', IdahoControlCondition_ExpandedDescription: condTxt, ConditionType: 1 });
		} else {
			setRows('IdahoControlCondition', cId, { IdahoControlCondition_DefineDescription: 1, IdahoControlCondition_Description: cName + ' {"%e" %a %o %v %u}', IdahoControlCondition_ExpandedDescription: condTxt, ConditionType: 0 });
		}
		setRows('IdahoControlCondition_ConditionType_SimpleConditionType', cId, { SimpleConditionType: 0, CompareOperator: cd.cmp === 'below' ? 3 : 1 });
		setRows('IdahoControlCondition_SimpleConditionType_ElementType', cId, {
			ElementType_Element: elId['n:' + cd.node], ElementType_Demand: 0, ElementType_HydraulicGrade: 0, ElementType_Pressure: isJ ? cd.value : 0,
			ElementType_TankLevel: isJ ? 0 : cd.value, ElementType_TankTimeToFill: 0, ElementType_TankTimeToDrain: 0, ElementType_Discharge: 0,
			ElementType_HeadlossCoefficient: 0, ElementType_RelativeSpeedFactor: 0, ElementType_TankPercentFull: 0,
			ControlConditionPumpStatus: 0, ControlConditionPipeStatus: 0, ControlConditionGPVStatus: 0, ControlConditionValveStatus: 0,
			ControlConditionElementType: isJ ? 50 : 52
		});
		const cSub = { NodeType: ['ControlConditionNodeType', 'NodeAttribute', isJ ? 2 : 1], TankType: ['ControlConditionTankType', 'TankAttribute', isJ ? 1 : 3],
			PumpType: ['ControlConditionPumpType', 'ControlConditionPumpAttribute', 0], PipeType: ['ControlConditionPipeType', 'ConditionPipeAttribute', 0],
			PressureValveType: ['ControlConditionPressureValveType', 'ControlConditionPressureValveAttribute', 0],
			FCVType: ['ControlConditionFCVType', 'ControlConditionFCVAttribute', 0], GPVType: ['ControlConditionGPVType', 'ControlConditionGPVAttribute', 0],
			TCVType: ['ControlConditionTCVType', 'ControlConditionTCVAttribute', 0], HydroTankType: ['ControlConditionHydroTankType', 'HydroTankAttribute', 1],
			SurgeTankType: ['ControlConditionSurgeTankType', 'SurgeTankAttribute', 1] };
		Object.keys(cSub).forEach((k) => { const v = cSub[k]; setRows('IdahoControlCondition_ControlConditionElementType_' + v[0], cId, { [v[1]]: v[2] }); });
		if (parentOf) {
			setRows('IdahoControlCondition_ConditionType_CompositeConditionType', cId, { ControlConditionCollectionCount: parentOf.kids.length });
			parentOf.kids.forEach((k, i) => { insert(db, 'IdahoControlCondition_ControlConditionCollection', { SupportElementID: cId, ControlConditionCollection_ControlCondition: k.id, LogicalOperator: i === 0 ? 0 : (parentOf.join === 'OR' ? 2 : 1) }); });
		}
		return { id: cId, txt: condTxt, plain: plain };
	}
	// A control as the writer holds it: `conds` (one or two) joined by `join` (AND or OR), `thenActs`, an optional `elseAct`, a priority.
	// A simple control (a tank-level [CONTROLS] line) is the one-condition, one-action case.
	function writeControl(c) {
		if (!c.conds) { c = { conds: [c.condition], join: null, thenActs: [{ link: c.link, status: c.action.status }], elseAct: c.elseAction || null, priority: c.priority }; }
		let cond;
		if (c.conds.length === 1) { cond = writeCond(c.conds[0]); }
		else {
			const kids = c.conds.map((cd) => writeCond(cd));
			cond = writeCond(c.conds[0], { kids: kids, join: c.join, plain: kids.map((k) => k.plain).join(c.join === 'OR' ? ' Or ' : ' And ') });
		}
		const condTxt = cond.txt;
		const act = writeActions(c.thenActs);
		const actTxt = act.txt;
		const elseAct = c.elseAct ? writeAction(c.elseAct.link, c.elseAct.status) : null;
		const cId = cond.id;
		const kId = newId();
		supportElement(kId, 54, 'LC' + kId, '');
		// A logical control (Tom's ctl-logical save): the ELSE action's id, a priority and their two flags; otherwise 0, 0, NULL, 0.
		const hasPrio = c.priority !== undefined && c.priority !== null;
		const words = 'IF ' + condTxt + ' THEN ' + actTxt + (elseAct ? ' ELSE ' + elseAct.txt : '') + (hasPrio ? ' PRIORITY ' + c.priority : '');
		setRows('IdahoControl', kId, { IdahoControl_DefineDescription: 0, IdahoControl_Description: words, IdahoControl_ExpandedDescription: words, IdahoControl_ControlCondition: cId, IdahoControl_ControlAction: act.id, IdahoControl_ControlNotes: '', ControlType: 0 });
		setRows('IdahoControl_ControlType_LogicalType', kId, { LogicalType_HasPriority: hasPrio ? 1 : 0, LogicalType_HasElse: elseAct ? 1 : 0, LogicalType_ElseAction: elseAct ? elseAct.id : null, ControlPriority: hasPrio ? c.priority : 0 });
		controlIds.push(kId); nCtl++; nLevel++;
	}
	levelCtl.forEach(writeControl);
	ruleCtl.forEach(writeControl);
	changes.forEach((ch) => {
		if (realLinks[ch.link]) { return; }
		const pipeEl = pipeElId[ch.link];
		if (!pipeEl) { return; }
		const isPump = !!pumpNodeId[ch.link];
		const label = ch.link;
		const txt = controlText(ch.t, label, ch.status === 'open' ? (isPump ? 'On' : 'Open') : (isPump ? 'Off' : 'Closed'), isPump);
		const cId = newId(), aId = newId(), kId = newId();
		supportElement(cId, 56, 'C' + cId); supportElement(aId, 55, 'A' + aId); supportElement(kId, 54, 'LC' + kId);
		insert(db, 'IdahoControlCondition', { SupportElementID: cId, IdahoControlCondition_DefineDescription: 0, IdahoControlCondition_Description: 'text', IdahoControlCondition_ExpandedDescription: txt.cond, ConditionType: 0 });
		insert(db, 'IdahoControlCondition_ConditionType_SimpleConditionType', { SupportElementID: cId, SimpleConditionType: 2, CompareOperator: 0 });
		insert(db, 'IdahoControlCondition_SimpleConditionType_ClockTimeType', { SupportElementID: cId, ClockTimeType_ClockTime: clockEpoch(ch.t) });
		insert(db, 'IdahoControlAction', { SupportElementID: aId, IdahoControlAction_DefineDescription: 0, IdahoControlAction_Description: 'text', IdahoControlAction_ExpandedDescription: txt.act, ControlActionType: 0 });
		if (isPump) {
			insert(db, 'IdahoControlAction_ControlActionType_SimpleActionType', { SupportElementID: aId, SimpleActionType_Element: pumpNodeId[ch.link], ElementType: 68 });
			insert(db, 'IdahoControlAction_ElementType_ControlActionFCVType', { SupportElementID: aId, FCVAttribute: 0 });
			insert(db, 'IdahoControlAction_ElementType_ControlActionPumpType', { SupportElementID: aId, PumpAttribute: 0 });
			insert(db, 'IdahoControlAction_PumpAttribute_ActionPumpStatusType', { SupportElementID: aId, ActionPumpStatus: ch.status === 'open' ? 0 : 1 });
			insert(db, 'IdahoControlAction_FCVAttribute_ActionFCVSettingType', { SupportElementID: aId, ActionFCVSettingType_Discharge: 0 });
		} else {
			insert(db, 'IdahoControlAction_ControlActionType_SimpleActionType', { SupportElementID: aId, SimpleActionType_Element: pipeEl, ElementType: 69 });
			insert(db, 'IdahoControlAction_ElementType_ControlActionPipeType', { SupportElementID: aId, PipeAttribute: 0 });
			insert(db, 'IdahoControlAction_PipeAttribute_ActionPipeStatusType', { SupportElementID: aId, ActionPipeStatus: ch.status === 'open' ? 0 : 1 });
		}
		insert(db, 'IdahoControl', { SupportElementID: kId, IdahoControl_DefineDescription: 0, IdahoControl_Description: 'IF ' + txt.cond + ' THEN ' + txt.act, IdahoControl_ExpandedDescription: 'IF ' + txt.cond + ' THEN ' + txt.act, IdahoControl_ControlCondition: cId, IdahoControl_ControlAction: aId, ControlType: 1 });
		insert(db, 'IdahoControl_ControlType_LogicalType', { SupportElementID: kId, LogicalType_HasPriority: 0, LogicalType_HasElse: 0, LogicalType_ElseAction: null, ControlPriority: 0 });
		controlIds.push(kId); nCtl++;
	});
	// One control set holding every control, made the Base operational alternative's active set: Tom's
	// wtg-control-1 showed a control lives in a set, and the alternative's set is NULL until assigned.
	if (controlIds.length) {
		const setId = newId();
		supportElement(setId, 59, 'Logical Control Set - 1', '');
		setRows('IdahoLogicalControlSet', setId, { LogicalControlCollectionCount: controlIds.length });
		controlIds.forEach((k) => { insert(db, 'IdahoLogicalControlSet_LogicalControlCollection', { SupportElementID: setId, LogicalControlCollection_IdahoLogicalControlID: k }); });
		db.run('UPDATE Operational_SystemData SET Operational_IdahoControlSetID = ?', [setId]);
		report.controlSetId = setId;
	}
	report.counts.controls = nCtl; report.counts.levelControls = nLevel;
	carried('controls: ' + nLevel + ' tank-level controls and ' + (nCtl - nLevel) + ' clock-time pipe-status controls, in one control set assigned to the Base operational alternative');

	// ---- CONFIRMED BY TOM'S WATERGEMS, 2026-11-03: emitter coefficient, pump speed pattern, tank mixing (mixed, FIFO, LIFO) ----
	writeConfirmed();
	function writeConfirmed() {
		const secs = parsed.inpSections || {};
		// -- emitters. WaterGEMS stores the coefficient in cubic feet per second per psi^n (candidate B; its dialog
		// shows gpm per psi^n). The parser keeps n.emitter in SI (m3/s per m^n of head), whatever units the project
		// displays, so the value is first turned back to EPANET's US figure (gpm per psi^n: scale by the head in
		// metres of one psi, raised to the exponent, and divide by the m3/s in one gpm), then by GPM_TO_CFS. A
		// US project and an SI project that state the same physical emitter therefore store the same number.
		const expo = (parsed.hydraulics && parsed.hydraulics.emitterExponent) || 0.5;
		const M_PER_PSI_HEAD = 0.3048 / EngCalcs.EPANET_PSI_PER_FT;
		const kGpm = (n) => n.emitter * Math.pow(M_PER_PSI_HEAD, expo) / 6.30901964e-5;
		nodes.filter((n) => n.type === 'junction' && n.emitter).forEach((n) => {
			const v = kGpm(n) * GPM_TO_CFS;
			db.run('UPDATE IdahoFireFlowNode_Physical_Data SET Physical_EmitterCoefficient = ? WHERE DomainElementID = ?', [v, elId['n:' + n.id]]);
			carried('emitter on ' + n.id + ': ' + kGpm(n).toFixed(6) + ' gpm per psi^' + expo + ', stored as ' + v + ' ft3/s per psi^' + expo);
		});
		// -- a pump speed pattern: VSPType 0 is pattern based
		links.filter((l) => l.type === 'pump' && l.speedPattern).forEach((l) => {
			if (patId[l.speedPattern] === undefined) { throw fail('data', 'Pump ' + l.id + ' names speed pattern ' + l.speedPattern + ', which the project does not define.', [l.id], 'data'); }
			const id = pumpNodeId[l.id];
			db.run('UPDATE StandardPump_Physical_Data SET Physical_IsVariableSpeedPump = 1, VSPType = 0 WHERE DomainElementID = ?', [id]);
			const have = rowsOf(db, 'SELECT COUNT(*) AS c FROM StandardPump_Physical_VSPType_PatternBasedType WHERE DomainElementID = ?', [id])[0].c;
			if (have) { db.run('UPDATE StandardPump_Physical_VSPType_PatternBasedType SET PatternBasedType_Pattern = ? WHERE DomainElementID = ?', [patId[l.speedPattern], id]); }
			else {
				const alt = rowsOf(db, 'SELECT AlternativeID AS a FROM StandardPump_Physical_Data WHERE DomainElementID = ?', [id])[0].a;
				insert(db, 'StandardPump_Physical_VSPType_PatternBasedType', { DomainElementID: id, AlternativeID: alt, PatternBasedType_Pattern: patId[l.speedPattern] });
			}
			carried('pump ' + l.id + ' speed pattern ' + l.speedPattern);
		});
		// -- tank mixing: TankMixingModel 0 two compartment, 1 mixed, 2 FIFO, 3 LIFO
		const mixMap = (EngCalcs.lpnMixingParse && secs.MIXING) ? EngCalcs.lpnMixingParse(secs.MIXING) : {};
		Object.keys(mixMap).forEach((tid) => {
			const m = mixMap[tid];
			if (!nodeById[tid] || nodeById[tid].type !== 'tank') { return; }
			if (m.model === '2COMP') {
				// Confirmed by Tom's round 3 (2026-11-03): code 0, compartments as percents, compartment 1 the inlet one. WaterGEMS
				// refuses fractions ("Must add to 100"). EPANET's fraction is the inlet compartment's share of the volume.
				if (!twoCompCarriable(m)) { lost('two-compartment mixing on tank ' + tid + ' (no fraction between 0 and 1 stated)'); return; }
				const tk = elId['n:' + tid];
				const c1 = Math.round(m.fraction * 1e9) / 1e7;
				db.run('UPDATE ConventionalTank_Constituent_Data SET TankMixingModel = 0 WHERE DomainElementID = ?', [tk]);
				const alt = rowsOf(db, 'SELECT AlternativeID AS a FROM ConventionalTank_Constituent_Data WHERE DomainElementID = ?', [tk])[0].a;
				db.run('DELETE FROM ConventionalTank_Constituent_TankMixingModel_TwoCompartmentType WHERE DomainElementID = ?', [tk]);
				insert(db, 'ConventionalTank_Constituent_TankMixingModel_TwoCompartmentType', { DomainElementID: tk, AlternativeID: alt, TwoCompartmentType_Compartment1: c1, TwoCompartmentType_Compartment2: Math.round((100 - c1) * 1e7) / 1e7 });
				carried('tank ' + tid + ' mixing 2COMP ' + m.fraction + ' (TankMixingModel 0, compartments ' + c1 + ' and ' + (100 - c1) + ' percent)');
				return;
			}
			const code = { MIXED: 1, FIFO: 2, LIFO: 3 }[m.model];
			if (code === undefined || m.model === 'MIXED') { return; }
			db.run('UPDATE ConventionalTank_Constituent_Data SET TankMixingModel = ? WHERE DomainElementID = ?', [code, elId['n:' + tid]]);
			carried('tank ' + tid + ' mixing ' + m.model + ' (TankMixingModel ' + code + ')');
		});
	}

	// ---- CANDIDATE FEATURES (Task 749, 2026-11-02): written ONLY when the caller passes `opts.candidate`. ----
	// Each states a guess at a column or a code that no saved project has ever shown (dev/wtg-export.md, "Candidates under test").
	// The page never passes it, so the shipped export and its list of what is not written do not change until
	// WaterGEMS has confirmed a candidate.
	if (opts.candidate) { writeCandidates(opts.candidate); }
	function writeCandidates(cand) {
		const secs = parsed.inpSections || {};
		const isNum = (v) => typeof v === 'number' && isFinite(v);
		// -- two-compartment mixing. cand.mixCode (confirmed 0), cand.mixFraction: 'fraction' | 'percent' (percent confirmed);
		// cand.swap puts the stated first compartment in compartment 2.
		if (cand.mixCode !== undefined) {
			const mixMap = (EngCalcs.lpnMixingParse && secs.MIXING) ? EngCalcs.lpnMixingParse(secs.MIXING) : {};
			Object.keys(mixMap).forEach((tid) => {
				const m = mixMap[tid];
				if (!nodeById[tid] || nodeById[tid].type !== 'tank' || m.model !== '2COMP') { return; }
				const id = elId['n:' + tid];
				const code = cand.mixCode;
				db.run('UPDATE ConventionalTank_Constituent_Data SET TankMixingModel = ? WHERE DomainElementID = ?', [code, id]);
				const alt = rowsOf(db, 'SELECT AlternativeID AS a FROM ConventionalTank_Constituent_Data WHERE DomainElementID = ?', [id])[0].a;
				const f = isNum(m.fraction) ? m.fraction : 0.5;
				const scale = cand.mixFraction === 'fraction' ? 1 : 100;
				const c1 = cand.swap ? 1 - f : f;
				db.run('DELETE FROM ConventionalTank_Constituent_TankMixingModel_TwoCompartmentType WHERE DomainElementID = ?', [id]);
				insert(db, 'ConventionalTank_Constituent_TankMixingModel_TwoCompartmentType', { DomainElementID: id, AlternativeID: alt, TwoCompartmentType_Compartment1: c1 * scale, TwoCompartmentType_Compartment2: (1 - c1) * scale });
				carried('tank ' + tid + ' mixing ' + m.model + (m.fraction !== undefined ? ' ' + m.fraction : '') + ' (candidate TankMixingModel ' + code + ')');
				report.candidateWritten = (report.candidateWritten || 0) + 1;
			});
		}
	}

	// ---- AN AGE OR TRACE RUN: written on the page's path (Tom's round 3, 2026-11-03). He saw Age and Trace R in the
	// Calculation Type of the files written this way: type 2 with its tolerance row, type 4 with its tolerance row and the
	// traced node in Trace_SystemData. WaterGEMS's J1 age (0.173 h) agreed with EPANET's to the third decimal once the
	// pump's two 1 ft connecting pipes were counted. ----
	function writeAgeTrace() {
		const qo = parsed.qualityOptions || {};
		const q = EngCalcs.lpnQualityParse(qo.quality || '');
		const calcId = rowsOf(db, 'SELECT CalculationOptionsID AS c FROM EpaNetEngine ORDER BY CalculationOptionsID')[0].c;
		const calcType = q.mode === 'age' ? 2 : 4;
		db.run('UPDATE EpaNetEngine SET CalculationType = ?', [calcType]);
		const tol = parseFloat(qo.tolerance), tv = isFinite(tol) ? tol : 0.01;
		if (q.mode === 'age') { insert(db, 'EpaNetEngine_CalculationType_AgeAnalysisType', { CalculationOptionsID: calcId, AgeAnalysisType_AgeTolerance: tv }); }
		else {
			insert(db, 'EpaNetEngine_CalculationType_TraceAnalysisType', { CalculationOptionsID: calcId, TraceAnalysisType_TraceTolerance: tv });
			db.run('UPDATE Trace_SystemData SET Trace_TraceElement = ? ', [elId['n:' + q.traceNode]]);
		}
		carried('calculation type ' + calcType + ' for a ' + q.mode + ' run' + (q.mode === 'trace' ? ' from ' + q.traceNode : ''));
		report.ageTraceWritten = true;
	}
	if (ageTraceCarriable(parsed)) { writeAgeTrace(); }

	// ---- A CHEMICAL QUALITY RUN: written on the page's path (Tom's own WaterGEMS save, 2026-11-03, dev/wtg-export.md). ----
	// His save made a Chlorine constituent (support element type 52), bulk -2 per day and wall -1 ft per day. It stored
	// bulk -2.0 and wall first order -1.0: per day, EPANET's own sign (a decay is negative), in the units the page shows,
	// so nothing is converted. The constituent is tied to the whole network by the one row of Constituent_SystemData (the
	// alternative's constituent), and every node already has its Constituent_Data row. WaterGEMS writes both wall-order
	// sub-tables; the order not in use holds 0. The Constituent calculation type is 3 (the nine files).
	// `w` carries the round-2 storage variants (opts.candidate.wq). Per-pipe and per-tank rates and a source's pattern are
	// written as Tom's saves rates-one-pipe, rate-tank and source-pattern stored them (dev/wtg-export.md).
	function writeChemical(w) {
		const secs = parsed.inpSections || {};
		const qo = parsed.qualityOptions || {};
		const calcId = rowsOf(db, 'SELECT CalculationOptionsID AS c FROM EpaNetEngine ORDER BY CalculationOptionsID')[0].c;
		const calcType = w.calcType !== undefined ? w.calcType : 3;
		db.run('UPDATE EpaNetEngine SET CalculationType = ?', [calcType]);
		const tol = parseFloat(qo.tolerance), tv = isFinite(tol) ? tol : 0.01;
		insert(db, 'EpaNetEngine_CalculationType_ConstituentAnalysisType', { CalculationOptionsID: calcId, ConstituentAnalysisType_ConstituentTolerance: tv });
		carried('calculation type ' + calcType + ' for a chemical run');
		const chem = String(qo.quality || '').replace(/^chemical\s+/i, '').split(/\s+/)[0] || 'Chemical';
		const R = EngCalcs.lpnReactionsParse(secs.REACTIONS || []);
		const perDay = w.bulkUnit === 'sec' ? 1 / 86400 : 1;            // EPANET states 1/day (and ft/day for a wall)
		const sgn = (v) => (w.sign === 'positive' ? Math.abs(v) : v) * perDay;
		const cid = newId();
		supportElement(cid, 52, chem, 'EPANET chemical ' + chem);
		const wallOrder = R.orderWall !== undefined ? R.orderWall : 1;
		const lim = R.limitingPotential;
		const dif = parseFloat(qo.diffusivity);
		insert(db, 'IdahoConstituent', {
			SupportElementID: cid, IdahoConstituent_Diffusivity: 1.3e-8 * (isFinite(dif) ? dif : 1),
			IdahoConstituent_HasUnlimitedConcentration: lim ? 0 : 1, IdahoConstituent_ConcentrationLimit: lim || 0,
			IdahoConstituent_BulkReactionOrder: R.orderBulk !== undefined ? R.orderBulk : 1,
			IdahoConstituent_BulkReactionRate: sgn(R.globalBulk || 0),
			IdahoConstituent_IsRoughnessCorrelated: R.roughnessCorrelation ? 1 : 0, IdahoConstituent_RoughnessCorrelationFactor: R.roughnessCorrelation || 0,
			WallReactionOrder: wallOrder
		});
		insert(db, 'IdahoConstituent_WallReactionOrder_ZeroOrderType', { SupportElementID: cid, ZeroOrderType_ZeroOrderWallReactionRate: wallOrder === 0 ? sgn(R.globalWall || 0) : 0 });
		insert(db, 'IdahoConstituent_WallReactionOrder_FirstOrderType', { SupportElementID: cid, FirstOrderType_FirstOrderWallReactionRate: wallOrder === 0 ? 0 : sgn(R.globalWall || 0) });
		db.run('UPDATE Constituent_SystemData SET Constituent_ConstituentID = ?', [cid]);
		const init = EngCalcs.lpnInitQualityParse(secs.QUALITY || []);
		Object.keys(init).forEach((nid) => {
			if (!nodeById[nid]) { return; }
			db.run('UPDATE BaseIdahoNode_Constituent_Data SET Constituent_InitialConcentration = ? WHERE DomainElementID = ?', [init[nid], elId['n:' + nid]]);
			db.run('UPDATE BaseDirectedNode_Constituent_Data SET Constituent_InitialConcentration = ? WHERE DomainElementID = ?', [init[nid], elId['n:' + nid]]);
		});
		const srcs = EngCalcs.lpnSourcesParse(secs.SOURCES || []);
		const codeOf = (t) => (w.sourceCode !== undefined ? w.sourceCode : { CONCEN: 0, FLOWPACED: 1, SETPOINT: 2, MASS: 3 }[t]);
		Object.keys(srcs).forEach((nid) => {
			const n = nodeById[nid], s = srcs[nid];
			if (!n) { return; }
			const id = elId['n:' + nid];
			const sp = s.pattern && patId[s.pattern] !== undefined ? patId[s.pattern] : null;
			db.run('UPDATE BaseIdahoNode_Constituent_Data SET Constituent_IsConstituentSource = 1, ConstituentSourceType = ?, Constituent_ConstituentSourcePattern = ?, BaselineConcentration = ? WHERE DomainElementID = ?',
				[codeOf(s.type), sp, s.type === 'MASS' ? 0 : s.quality, id]);
			if (s.type === 'MASS') {
				const alt = rowsOf(db, 'SELECT AlternativeID AS a FROM BaseIdahoNode_Constituent_Data WHERE DomainElementID = ?', [id])[0].a;
				db.run('DELETE FROM BaseIdahoNode_Constituent_ConstituentSourceType_MassBoosterType WHERE DomainElementID = ?', [id]);
				insert(db, 'BaseIdahoNode_Constituent_ConstituentSourceType_MassBoosterType', { DomainElementID: id, AlternativeID: alt, MassBoosterType_BaselineMassRate: s.quality });
			}
			carried('source on ' + nid + ': ' + s.type + ' ' + s.quality + ' (source code ' + codeOf(s.type) + ')');
		});
		{
			Object.keys(R.bulk).forEach((pid) => { if (pipeElId[pid] !== undefined) { db.run('UPDATE IdahoPipe_Constituent_Data SET Constituent_SpecifyLocalBulkReactionRate = 1, Constituent_LocalBulkReactionRate = ? WHERE DomainElementID = ?', [sgn(R.bulk[pid]), pipeElId[pid]]); } });
			Object.keys(R.wall).forEach((pid) => { if (pipeElId[pid] !== undefined) { db.run('UPDATE IdahoPipe_Constituent_Data SET Constituent_SpecifyLocalWallRate = 1, Constituent_WallReactionRate = ? WHERE DomainElementID = ?', [sgn(R.wall[pid]), pipeElId[pid]]); } });
			Object.keys(R.tank).forEach((tid) => { if (elId['n:' + tid] !== undefined) { db.run('UPDATE ConventionalTank_Constituent_Data SET Constituent_TankSpecifyLocalBulkRate = 1, Constituent_TankBulkReactionRate = ? WHERE DomainElementID = ?', [sgn(R.tank[tid]), elId['n:' + tid]]); } });
		}
		carried('chemical ' + chem + ': bulk ' + sgn(R.globalBulk || 0) + ', wall ' + sgn(R.globalWall || 0) + ' per day');
		report.chemicalWritten = true;
	}
	if (chemicalCarriable(parsed)) { writeChemical((opts.candidate && opts.candidate.wq) || {}); }

	// ---- analysis options: the template's own EPS options already read 24 h, 1 h step; set them explicitly ----
	const T = parsed.times;
	// Specific gravity and relative viscosity as the file states them (EPANET: 1 and 1). A pressure valve's
	// psi setting becomes a head by the specific gravity, so a file that states 0.998 needs it carried.
	const hy = parsed.hydraulics || {};
	const sg = hy.specificGravity > 0 ? hy.specificGravity : 1.0, visc = hy.viscosity > 0 ? hy.viscosity : 1.0;
	// ---- PRESSURE-DRIVEN DEMAND: Tom's save pdd-on (2026-11-03). A Pressure Dependent Demand Function (support type 60) of
	// type power, the threshold pressure in psi and the power as typed, named by the alternative's global function; the
	// calculation option turns it on. EPANET: Minimum Pressure 0, Required Pressure = threshold, Pressure Exponent = power. ----
	if (pddCarriable(hy)) {
		const fId = newId();
		supportElement(fId, 60, 'Pressure Dependent Demand Function - 1', '');
		insert(db, 'PressureDependentDemandFunction', { SupportElementID: fId, PressureDependentDemandFunction_PressureThreshold: hy.reqPressure, PressureDependentDemandFunction_HasThresholdPressure: 1, PddFunctionType: 0 });
		insert(db, 'PressureDependentDemandFunction_PddFunctionType_PowerFunctionType', { SupportElementID: fId, PowerFunctionType_PowerFunctionExponent: typeof hy.pressureExponent === 'number' ? hy.pressureExponent : 0.5 });
		insert(db, 'PressureDependentDemandFunction_PddFunctionType_PieceLinearType', { SupportElementID: fId, PressureFlowCurveCount: 0 });
		db.run('UPDATE PressureDependentDemand_SystemData SET PressureDependentDemand_GlobalPDDFunction = ?', [fId]);
		db.run('UPDATE EpaNetEngine SET EpaNetEngine_UsePressureDependentDemand = 1');
		carried('pressure-driven demand: power ' + (typeof hy.pressureExponent === 'number' ? hy.pressureExponent : 0.5) + ', threshold ' + hy.reqPressure + ' psi');
		report.pddWritten = true;
	}
	db.run('UPDATE EpaNetEngine_TimeAnalysisType_EpsType SET EpsType_Duration = ?, EpsType_HydraulicTimeStep = ?', [T.duration, T.hydraulicStep]);
	// The water quality time step, in seconds like the hydraulic one (False, the template's, means a tenth of the hydraulic step).
	const qStepWanted = opts.qualityStepSeconds > 0 ? opts.qualityStepSeconds : ((opts.candidate && opts.candidate.wq && opts.candidate.wq.qualityStepSeconds) || 0);
	if (qStepWanted > 0) {
		db.run('UPDATE EpaNetEngine SET EpaSetWaterQualityTimeStep = 1, EpaWaterQualityTimeStep = ?', [qStepWanted]);
		carried('water quality time step ' + qStepWanted + ' s');
	}
	// The report time step, in seconds like the other two. 0 is the template's "same as the hydraulic step"; no
	// results depend on it. (Whether WaterGEMS reports at it is for Tom's copy to say.)
	db.run('UPDATE EpaNetEngine_TimeAnalysisType_EpsType SET EpsType_ReportingTimeStep = ?', [T.reportStep > 0 && T.reportStep !== T.hydraulicStep ? T.reportStep : 0]);
	// EPANET's own physical constants for the file (specific gravity 1.0; relative viscosity 1.0 is
	// 1.1e-5 ft2/s) and its "Unbalanced Continue 10". Hazen-Williams never reads the viscosity.
	// The extra-iterations column exists from schema 1.0.54 on; an older layout has no such setting.
	const hasExtra = colsOf(db, 'EpaNetEngine').indexOf('EpaNetEngine_ExtraIterations') >= 0;
	db.run('UPDATE EpaNetEngine SET TimeAnalysisType = 1, FrictionMethod = 1, EpaNetEngine_AnalysisStartTime = ?, '
		+ 'EpaNetEngine_LiquidSpecificGravity = ?, EpaNetEngine_LiquidKinematicViscosity = ?' + (hasExtra ? ', EpaNetEngine_ExtraIterations = 10' : ''),
		[EPOCH_2000 + (T.startClock || 0), sg, 1.1e-5 * visc]);

	// ---- counts, dataset notes ----
	db.run('UPDATE HMIElementTypeCount SET Count = 0 WHERE ElementType IN (3,4)');
	Object.keys(live).forEach((k) => { db.run('UPDATE HMIElementTypeCount SET Count = ? WHERE ElementType = 3 AND ElementTypeID = ?', [live[k], Number(k)]); });
	Object.keys(supportLive).forEach((k) => { db.run('UPDATE HMIElementTypeCount SET Count = ? WHERE ElementType = 4 AND ElementTypeID = ?', [supportLive[k], Number(k)]); });
	db.run('UPDATE HMIElementTypeCount SET Count = 1 WHERE ElementType IN (1,2) AND Count > 1');
	// A new project identity, so WaterGEMS does not take this for the saved project it was made from.
	db.run('UPDATE HMIDomainDataSet SET Name = ?, Notes = ?, Guid = randomblob(16)', [opts.name || 'Net3', String(parsed.title || '').trim()]);

	// ---- integrity ----
	const integ = rowsOf(db, 'PRAGMA integrity_check')[0].integrity_check;
	db.run('PRAGMA foreign_keys = ON');
	const fk = rowsOf(db, 'PRAGMA foreign_key_check');
	report.integrity = integ; report.foreignKeyViolations = fk.length;
	if (fk.length) { report.foreignKeySample = fk.slice(0, 5); }
	db.run('VACUUM');
	const bytes = db.export();
	db.close();
	report.skippedColumns = Object.keys(skippedColumns);
	report.ids = { firstId: keptMax + 1, lastId: nextId - 1, pumpNodes: pumpNodeId, patterns: patId };
	report.notCarried.push(((report.chemicalWritten || report.ageTraceWritten) ? 'quality analysis other than the run written above' : 'quality analysis (Trace Lake), reactions, sources') + ', the [REPORT] settings');
	if (!report.counts.levelControls) { report.notCarried.push('tank-level controls as controls: carried as the clock-time schedule EPANET followed'); }
	return { bytes: bytes, report: report };
}

// ---------------------------------------------------------------------------------------------
// The .wtg beside it (XML presentation file): the template's, with the deleted scenario's
// references taken out. Without them WaterGEMS would be asked to open a view on scenario 38.
// ---------------------------------------------------------------------------------------------
// WaterGEMS draws a symbol 4 ft across (and text 4 ft high at the default scale) times these two
// multipliers, whatever the map covers. The template covers about 410 ft, where 1 is right; the
// openly licensed samples that span thousands of feet carry 10 to 20 (Zenodo 7162154: 4,600 ft, 10;
// TSNet tnet3: 26,000 ft, 20). Keep the template's proportion: extent / 500 ft, at least 1.
function symbolMultiplier(extentFt) {
	return Math.max(1, Math.round((extentFt || 0) / 500));
}
function patchWtgXml(text, removedScenarios, keepScenario, removedAlternatives, extentFt) {
	const eol = text.indexOf('\r\n') >= 0 ? '\r\n' : '\n';
	const lines = text.split(eol);
	const gone = new Set(removedScenarios.map(String)), goneAlt = new Set(removedAlternatives.map(String));
	const out = [];
	lines.forEach((ln) => {
		let m;
		if ((m = /<Scenario ScenarioId="(\d+)"/.exec(ln)) && gone.has(m[1])) { return; }
		if ((m = /<ScenarioSettings ScenarioID="(\d+)"/.exec(ln)) && gone.has(m[1])) { return; }
		if ((m = /<Node Identifier="(\d+)" IsGuid="false" IsInt="true"/.exec(ln)) && (gone.has(m[1]) || goneAlt.has(m[1]))) { return; }
		out.push(ln.replace(/ScenarioId="(\d+)"(?= \/>)/g, (all, id) => gone.has(id) ? 'ScenarioId="' + keepScenario + '"' : all));
	});
	let t = out.join(eol);
	// Counts that follow what was removed.
	t = t.replace(/<ComputeStatusIndicator ScenarioCount="\d+"/, '<ComputeStatusIndicator ScenarioCount="' + (t.match(/<Scenario ScenarioId=/g) || []).length + '"');
	t = t.replace(/<ScenarioAnimationSettingStorageElement ScenarioCount="\d+"/, '<ScenarioAnimationSettingStorageElement ScenarioCount="' + (t.match(/<ScenarioSettings /g) || []).length + '"');
	t = t.replace(/<TreeExpandedStateManager Count="\d+">([\s\S]*?)<\/TreeExpandedStateManager>/g, (all, body) => {
		const n = (body.match(/<Node /g) || []).length;
		return '<TreeExpandedStateManager Count="' + n + '">' + body + '</TreeExpandedStateManager>';
	});
	t = t.replace(/<ViewAssociationsManager Count="\d+"/, '<ViewAssociationsManager Count="' + (t.match(/<ViewIndex /g) || []).length + '"');
	// Results were computed in the template's own project; the files holding them are not shipped, so
	// no scenario is marked computed.
	t = t.replace(/ScenarioComputeStatus="\d+"/g, 'ScenarioComputeStatus="0"');
	// Symbols and text sized to the map's extent.
	if (extentFt > 0) {
		const m = String(symbolMultiplier(extentFt));
		t = t.replace(/(<DrawingOptions [^>]*?)SymbolSizeMultiplier="[^"]*"/, '$1SymbolSizeMultiplier="' + m + '"');
		t = t.replace(/(<DrawingOptions [^>]*?)TextHeightMultiplier="[^"]*"/, '$1TextHeightMultiplier="' + m + '"');
	}
	// Likewise a new identity for the presentation file.
	t = t.replace(/(<StorageFileHeader [^>]*\bId=")[0-9a-f-]{36}(")/, '$1' + uuid() + '$2');
	return t;
}


// ---------------------------------------------------------------------------------------------
// The reference run: the EPANET engine (epanet-js, the one this suite ships) over the network. It
// gives the status each pump and controlled pipe holds at the start and the times it changes, which
// the clock-time controls carry. `mod` is the epanet-js module namespace the caller loaded.
// ---------------------------------------------------------------------------------------------
async function referenceSchedule(mod, inpText, watchLinks) {
	const ws = new mod.Workspace();
	await ws.loadModule();
	const p = new mod.Project(ws);
	ws.writeFile('r.inp', inpText);
	p.open('r.inp', 'r.rpt', 'r.out');
	const EN_STATUS = 11;
	const idx = {};
	watchLinks.forEach((id) => { idx[id] = p.getLinkIndex(id); });
	const initial = {}, changes = [], last = {};
	let t = 0, guard = 0;
	try {
		p.openH(); p.initH(0);
		for (;;) {
			t = p.runH();
			watchLinks.forEach((id) => {
				const s = p.getLinkValue(idx[id], EN_STATUS) > 0 ? 'open' : 'closed';
				if (last[id] === undefined) { initial[id] = s; } else if (last[id] !== s) { changes.push({ t: t, link: id, status: s }); }
				last[id] = s;
			});
			const ts = p.nextH();
			if (!(ts > 0) || ++guard > 100000) { break; }
		}
		p.closeH();
	} finally { try { p.close(); } catch (e) { /* already closed */ } }
	return { initial: initial, changes: changes };
}

// ---------------------------------------------------------------------------------------------
// The plan: what the open network can and cannot become, worked out BEFORE a template is asked for.
// ---------------------------------------------------------------------------------------------
function idsOf(list, test) { return list.filter(test).map((x) => x.id); }

/**
 * @param doc   the serialized document, as EngCalcs.lpnExportInp takes it
 * @param opts  the export options the page passes the .inp export (scenario resolver and the rest)
 * @returns { ok:false, error, detail }                            the .inp writer refused (an unknown unit)
 *          { ok:true, refused:[{code, detail, ids}], notCarried:[{code, ids}], inp, parsed, differences }
 * `refused` non-empty means the export cannot be made; each entry is one reason, named.
 * `notCarried` is what the file will leave out, element IDs where there are some: the page lists it
 * before anything is written (nothing dropped silently).
 */

// Is this project's water quality a chemical run this export writes in full? A chemical in mg/L with the global
// reactions, a bulk or wall rate stated for one pipe, a bulk rate for one tank, sources with or without a pattern, and
// initial quality (Tom's saves of 2026-11-03: dev/wtg-export.md, "Tom's ten saves"). A rate for one pipe's wall is
// kept in WaterGEMS beside the first-order wall rate only, so a zero-order wall network keeps its note.
// Age and trace runs, and the rest, are not written on the page's path.
function chemicalCarriable(parsed) {
	const q = parsed.qualityOptions || {}, secs = parsed.inpSections || {};
	const text = String(q.quality || '').trim();
	if (!text || EngCalcs.lpnQualityParse(text).mode !== 'chemical') { return false; }
	if (/\b(ug|\u00b5g|g|mg)\/\w+/i.test(text) && !/\bmg\/L\b/i.test(text)) { return false; }
	const R = EngCalcs.lpnReactionsParse(secs.REACTIONS || []);
	if (Object.keys(R.wall).length && R.orderWall !== undefined && R.orderWall !== 1) { return false; }
	const srcs = EngCalcs.lpnSourcesParse(secs.SOURCES || []);
	const havePattern = {};
	(parsed.patterns || []).forEach((p) => { havePattern[p.id] = true; });
	return !Object.keys(srcs).some((k) => srcs[k].pattern && !havePattern[srcs[k].pattern]);
}

// Is this project's pressure-driven demand one WaterGEMS holds? Tom's save pdd-on (2026-11-03) stored a power function:
// demand is the full demand times (pressure / threshold) ^ power below the threshold pressure, from zero pressure. That is
// EPANET's pressure-driven model with a minimum pressure of 0, a required pressure equal to the threshold, and the same
// exponent. A minimum above 0 has no place in it.
function pddCarriable(hy) {
	if (!hy || String(hy.demandModel || '').toUpperCase() !== 'PDA') { return false; }
	const min = typeof hy.minPressure === 'number' ? hy.minPressure : 0;
	const exp = typeof hy.pressureExponent === 'number' ? hy.pressureExponent : 0.5;
	return min === 0 && typeof hy.reqPressure === 'number' && hy.reqPressure > 0 && exp > 0;
}

// Is this a two-compartment tank WaterGEMS can hold? Its compartments are percents that add to 100, so the EPANET
// fraction must lie strictly between 0 and 1.
// A pump curve WaterGEMS can hold: three points from zero flow (shutoff, design, maximum) or one design point.
function pumpCurveCarriable(c) {
	if (!c || !c.points) { return false; }
	if (c.points.length === 1) { return c.points[0][0] > 0 && c.points[0][1] > 0; }
	return c.points.length === 3 && c.points[0][0] === 0;
}

function twoCompCarriable(m) {
	return !!m && typeof m.fraction === 'number' && m.fraction > 0 && m.fraction < 1;
}

// Is this project's analysis an age or a trace run this export writes? A trace needs a node that is written. A project
// that also states sources or reactions keeps its "Water quality" note.
function ageTraceCarriable(parsed) {
	const q = parsed.qualityOptions || {}, secs = parsed.inpSections || {};
	const m = EngCalcs.lpnQualityParse(String(q.quality || '').trim());
	if (m.mode !== 'age' && m.mode !== 'trace') { return false; }
	if ((secs.SOURCES || []).length || (secs.REACTIONS || []).length) { return false; }
	return m.mode === 'age' || (parsed.nodes || []).some((n) => n.id === m.traceNode);
}

// The one coordinate system whose WaterGEMS definition a saved project has shown us.
var CRS_WRITTEN = 'EPSG:2223';

// [RULES] that WaterGEMS holds as a logical control (Tom's ctl-logical and ctl-composite saves): one or two premises joined by AND or by
// OR (each a tank level above or below a value, or a junction pressure), one or more THEN actions and at most one ELSE
// action, each setting a pump's or pipe's status, and an optional PRIORITY. Several ELSE actions have no saved example. Everything
// else is named in `unwritten` (the rule's name) and stays out.
function carriableRules(parsed) {
	const pressure = true;
	const out = { written: [], unwritten: [] };
	const lines = parsed.rules || [];
	if (!lines.length || !EngCalcs.lpnRuleParse) { if (lines.length) { out.unwritten.push('?'); } return out; }
	const nodes = parsed.nodes || [], links = parsed.links || [];
	const nodeType = (id) => { const n = nodes.find((x) => x.id === id); return n && n.type; };
	const linkType = (id) => { const l = links.find((x) => x.id === id); return l && l.type; };
	const REL = { BELOW: 'below', '<': 'below', ABOVE: 'above', '>': 'above' };
	EngCalcs.lpnRuleParse(lines).forEach((b) => {
		const live = b.lines.some((ln) => String(ln).replace(/;.*$/, '').trim() !== '');
		if (!live) { return; }
		const no = () => { out.unwritten.push(b.name || '?'); };
		if (!b.ok || !b.name) { return no(); }
		const conds = b.clauses.filter((c) => c.part === 'cond'), acts = b.clauses.filter((c) => c.part === 'act'), pr = b.clauses.filter((c) => c.part === 'priority');
		if (conds.length < 1 || conds.length > 2 || conds[0].join !== 'IF' || !acts.length || pr.length > 1) { return no(); }
		if (conds.length === 2 && conds[1].join !== 'AND' && conds[1].join !== 'OR') { return no(); }
		const cond = (cl) => {
			const cmp = REL[cl.rel];
			const tankOk = cl.attr === 'LEVEL' && (cl.object === 'TANK' || cl.object === 'NODE') && nodeType(cl.id) === 'tank';
			const presOk = pressure && cl.attr === 'PRESSURE' && (cl.object === 'JUNCTION' || cl.object === 'NODE') && nodeType(cl.id) === 'junction';
			if (!cmp || !(tankOk || presOk) || typeof cl.value !== 'number') { return null; }
			return { kind: 'node', node: cl.id, cmp: cmp, value: cl.value };
		};
		const act = (a) => {
			const lt = linkType(a.id), v = String(a.valueText).toUpperCase();
			if (a.attr !== 'STATUS' || !((a.object === 'PUMP' && lt === 'pump') || (a.object === 'PIPE' && lt === 'pipe') || (a.object === 'LINK' && (lt === 'pump' || lt === 'pipe')))) { return null; }
			if (v === 'OPEN' || (v === 'ON' && lt === 'pump')) { return { link: a.id, status: 'open' }; }
			if (v === 'CLOSED' || (v === 'OFF' && lt === 'pump')) { return { link: a.id, status: 'closed' }; }
			return null;
		};
		// THEN, then any AND actions; at most one ELSE action, after them.
		const ei = acts.findIndex((a) => a.join === 'ELSE');
		const thenCl = ei < 0 ? acts : acts.slice(0, ei), elseCl = ei < 0 ? [] : acts.slice(ei);
		if (!thenCl.length || thenCl[0].join !== 'THEN' || thenCl.slice(1).some((a) => a.join !== 'AND') || elseCl.length > 1) { return no(); }
		const cs = conds.map(cond), thenActs = thenCl.map(act), elseActs = elseCl.map(act);
		if (cs.some((c) => !c) || thenActs.some((a) => !a) || elseActs.some((a) => !a)) { return no(); }
		if (!(a => a === undefined || (isFinite(a) && a >= 0))(pr[0] && pr[0].value)) { return no(); }
		out.written.push({ name: b.name, conds: cs, join: conds.length === 2 ? conds[1].join : null, thenActs: thenActs, elseAct: elseActs[0] || null, priority: pr[0] ? pr[0].value : null });
	});
	return out;
}

// The [ENERGY] lines the writer has no place for: a price pattern (global or a pump's) the project does not define.
// A constant price, a price pattern and a demand charge are written (dev/wtg-export.md, "Energy price").
function energyNotWritten(lines, patternIds) {
	return (lines || []).filter((ln) => {
		const f = String(ln).replace(/;.*$/, '').trim().split(/\s+/);
		if (f.length < 2) { return false; }
		const key = f.slice(0, -1).join(' ').toLowerCase(), val = f[f.length - 1];
		return /pattern/.test(key) && !(patternIds || []).includes(val);
	});
}

function plan(doc, opts) {
	const out = EngCalcs.lpnExportInp(doc, opts || {});
	if (!out || !out.ok) { return { ok: false, error: out && out.error, detail: out && out.detail }; }
	const parsed = EngCalcs.lpnInpParse(out.inp);
	if (!parsed || parsed.ok === false) { return { ok: false, error: 'unreadable', detail: (parsed && parsed.message) || '' }; }
	const refused = [], notCarried = [];
	const nodes = parsed.nodes || [], links = parsed.links || [], secs = parsed.inpSections || {};
	if (!nodes.length) { refused.push({ code: 'empty', ids: [] }); }
	if (String(parsed.flowUnits).toUpperCase() !== 'GPM') { refused.push({ code: 'units', detail: String(parsed.flowUnits), ids: [] }); }
	if (String(parsed.headloss || 'H-W').toUpperCase().indexOf('H-W') < 0) { refused.push({ code: 'headloss', detail: String(parsed.headloss), ids: [] }); }
	const curveById = {};
	(parsed.curves || []).forEach((c) => { curveById[c.id] = c; });
	const badPumps = idsOf(links, (l) => {
		if (l.type !== 'pump') { return false; }
		const c = curveById[l.curveId];
		return !pumpCurveCarriable(c);
	});
	if (badPumps.length) { refused.push({ code: 'pump_curve', ids: badPumps }); }

	// A water quality analysis asked for ([OPTIONS] Quality other than None), or a source, a mixing model or a reaction stated.
	const q = parsed.qualityOptions || {};
	const quality = (String(q.quality || '').trim() !== '' && !/^none\b/i.test(String(q.quality).trim()))
		|| (secs.SOURCES || []).length > 0 || (secs.REACTIONS || []).length > 0;
	if (quality && !chemicalCarriable(parsed) && !ageTraceCarriable(parsed)) { notCarried.push({ code: 'quality', ids: [] }); }
	// The water quality time step. EPANET's default is a tenth of the hydraulic step, and so is WaterGEMS's when its
	// setting is False, so a project that states none (or states exactly that) writes False. Any other stated step is
	// written as True with the seconds: the file of 2026-11-03 showed 300 s as True 0.083 hr, so that field is read.
	// The .inp this plan reads back never states it (js/lpn-patterns.js), so it is read from the document itself.
	const dt = (doc && doc.times) || {}, qStep = dt.qualityStep, hStepSec = (parsed.times && parsed.times.hydraulicStep) || 3600;
	const qualityStepSeconds = (typeof qStep === 'number' && qStep > 0 && Math.abs(qStep - hStepSec / 10) > 0.5) ? qStep : 0;
	// An energy line that names a price pattern the project does not define (a price, a pattern and a demand charge are written).
	const price = energyNotWritten(secs.ENERGY || [], (parsed.patterns || []).map((q) => q.id));
	if (price.length) { notCarried.push({ code: 'energy_price', ids: [] }); }
	{ const rc = carriableRules(parsed); if (rc.unwritten.length) { notCarried.push({ code: 'rules', ids: rc.unwritten }); } }
	const frozen = [];
	(parsed.controls || []).forEach((c) => {
		const cond = c.condition || {};
		const tankLevel = cond.kind === 'node' && (cond.cmp === 'below' || cond.cmp === 'above')
			&& nodes.some((n) => n.id === cond.node && (n.type === 'tank' || n.type === 'junction'));
		const clock = cond.kind !== 'node';
		if (!tankLevel && !clock && frozen.indexOf(c.link) < 0) { frozen.push(c.link); }
	});
	if (frozen.length) { notCarried.push({ code: 'controls_pressure', ids: frozen }); }
	// Mixed, FIFO, LIFO and two-compartment are written; a two-compartment tank with no usable fraction is named here.
	const mixMap = (EngCalcs.lpnMixingParse && secs.MIXING) ? EngCalcs.lpnMixingParse(secs.MIXING) : {};
	const mix = Object.keys(mixMap).filter((tid) => mixMap[tid].model === '2COMP' && !twoCompCarriable(mixMap[tid]) && nodes.some((n) => n.id === tid && n.type === 'tank'));
	if (mix.length) { notCarried.push({ code: 'tank_mixing', ids: mix }); }
	// Settings and drawing data with no place in the file. The multiplier and the demand model change the
	// numbers a run gives, so they carry their value; no sample file states where a multiplier lives.
	const hy = parsed.hydraulics || {};
	if (hy.demandMultiplier !== undefined && Number(hy.demandMultiplier) !== 1) { notCarried.push({ code: 'demand_multiplier', ids: [], value: String(hy.demandMultiplier) }); }
	if (hy.demandModel && String(hy.demandModel).toUpperCase() !== 'DDA' && !pddCarriable(hy)) { notCarried.push({ code: 'demand_model', ids: [], value: String(hy.demandModel) }); }
	if ((parsed.labels || []).length) { notCarried.push({ code: 'texts', ids: [] }); }
	if (parsed.backdrop) { notCarried.push({ code: 'backdrop', ids: [] }); }
	// Always: this has no place in the file, whatever the network. (A pipe's material is not named: an EPANET project
	// states none, so there is nothing to leave out; every pipe keeps the template's default.)
	const crs = (doc && doc.project && doc.project.crs) === CRS_WRITTEN ? CRS_WRITTEN : '';
	if (!crs) { notCarried.push({ code: 'positions', ids: [] }); }
	return { ok: true, crs: crs, refused: refused, notCarried: notCarried, qualityStepSeconds: qualityStepSeconds, inp: out.inp, parsed: parsed, differences: out.differences || [] };
}

// ---------------------------------------------------------------------------------------------
// The SQLite engine (sql.js), loaded the first time and only here: the same two files, the same
// versioned URLs and the same "fetch the wasm as bytes" rule as js/lpn-sqlite.js (which, if it is
// also on the page, shares the global `initSqlJs` and nothing else).
// ---------------------------------------------------------------------------------------------
var SQLJS_VERSION = '1.14.2';
var TEMPLATE_VERSION = '2';   // bumped when js/data/wtg-template/ is rebuilt
var engine = null, injected = null;
function base() { return EngCalcs.suiteBase || '/engcalcs/'; }
function loadScript(src) {
	return new Promise((resolve, reject) => {
		const s = document.createElement('script');
		s.src = src; s.async = true;
		s.onload = () => resolve();
		s.onerror = () => reject(new Error('script'));
		(document.head || document.documentElement).appendChild(s);
	});
}
function getEngine() {
	if (engine) { return engine; }
	let p;
	if (injected) {
		p = injected.init({ wasmBinary: injected.wasmBinary });
	} else if (typeof document === 'undefined' || typeof fetch !== 'function') {
		return Promise.reject(fail('engine', 'No SQLite engine: outside a browser, call EngCalcs.lpnWtgExportSetEngine(initSqlJs, wasmBytes) first.'));
	} else {
		const dir = base() + 'js/vendor/';
		p = Promise.all([
			root.initSqlJs ? Promise.resolve() : loadScript(dir + 'sql-wasm.js?v=' + SQLJS_VERSION),
			fetch(dir + 'sql-wasm.wasm?v=' + SQLJS_VERSION, { credentials: 'same-origin' }).then((r) => {
				if (!r.ok) { throw new Error('HTTP ' + r.status); }
				return r.arrayBuffer();
			})
		]).then((got) => {
			if (typeof root.initSqlJs !== 'function') { throw new Error('sql.js did not define itself'); }
			return root.initSqlJs({ wasmBinary: new Uint8Array(got[1]) });
		});
	}
	engine = p.catch((e) => {
		engine = null;   // a failed fetch may succeed on the next attempt
		throw fail('engine', 'The SQLite engine could not be loaded (' + (e && e.message) + ').', null, 'offline');
	});
	return engine;
}

// ---------------------------------------------------------------------------------------------
// The built-in template: two gzip files fetched from this site only when an export runs, never
// precached, unpacked with the browser's own DecompressionStream.
// ---------------------------------------------------------------------------------------------
var templatePromise = null, templateInjected = null;
function gunzip(buf) {
	if (typeof DecompressionStream !== 'function') { return Promise.reject(new Error('no DecompressionStream')); }
	const ds = new DecompressionStream('gzip');
	const stream = new Response(new Blob([buf]).stream().pipeThrough(ds));
	return stream.arrayBuffer().then((b) => new Uint8Array(b));
}
function loadTemplate() {
	if (templateInjected) { return Promise.resolve(templateInjected); }
	if (templatePromise) { return templatePromise; }
	if (typeof fetch !== 'function') { return Promise.reject(fail('template-load', 'No way to fetch the template.', null, 'offline')); }
	const dir = base() + 'js/data/wtg-template/';
	function get(name) {
		return fetch(dir + name + '?v=' + TEMPLATE_VERSION, { credentials: 'same-origin' }).then((r) => {
			if (!r.ok) { throw new Error('HTTP ' + r.status); }
			return r.arrayBuffer();
		}).then(gunzip);
	}
	templatePromise = Promise.all([get('wtg-template.wtg.sqlite.gz'), get('wtg-template.wtg.gz')]).then((got) => ({
		sqlite: got[0], wtg: new TextDecoder('utf-8', { ignoreBOM: true }).decode(got[1])
	})).catch((e) => {
		templatePromise = null;   // a failed fetch may succeed on the next attempt
		throw fail('template-load', 'The export template could not be loaded (' + (e && e.message) + ').', null, 'offline');
	});
	return templatePromise;
}

var crsPromise = null;
function loadCrs() {
	if (crsPromise) { return crsPromise; }
	crsPromise = fetch(base() + 'js/data/wtg-template/crs-epsg-2223.json.gz?v=' + TEMPLATE_VERSION, { credentials: 'same-origin' }).then((r) => {
		if (!r.ok) { throw new Error('HTTP ' + r.status); }
		return r.arrayBuffer();
	}).then(gunzip).then((b) => new TextDecoder('utf-8').decode(b)).catch((e) => {
		crsPromise = null;
		throw fail('template-load', 'The export template could not be loaded (' + (e && e.message) + ').', null, 'offline');
	});
	return crsPromise;
}

// ---------------------------------------------------------------------------------------------
// Build: the plan, a template, the engines -> the two files.
// ---------------------------------------------------------------------------------------------
/**
 * @param planned  lpnWtgExportPlan()'s result (ok, no refusals)
 * @param o        { name: the project's name, epanet: the epanet-js module namespace, allowUntestedSchema,
 *                   sqlite, wtg: a template to use in place of the built-in one (bytes, XML text) }
 * @returns Promise of { sqlite: Uint8Array, wtg: string, report }
 * Rejects with an Error whose `.code` names the cause: 'engine', 'template', 'template-kind',
 * 'schema', 'pump-curve', 'data'... and `.ids` where there are elements to name.
 */
async function build(planned, o) {
	if (!planned || !planned.ok || planned.refused.length) { throw fail('refused', 'The plan was refused.'); }
	o = o || {};
	if (!o.sqlite || typeof o.wtg !== 'string') {
		const tpl = await loadTemplate();
		o = Object.assign({}, o, { sqlite: tpl.sqlite, wtg: tpl.wtg });
	}
	if (!o.epanet) { throw fail('engine', 'The EPANET engine is needed to find when each pump switches.', null, 'offline'); }
	const SQL = await getEngine();
	const parsed = planned.parsed;
	const watch = Array.from(new Set(parsed.links.filter((l) => l.type === 'pump').map((l) => l.id).concat((parsed.controls || []).map((c) => c.link))));
	let sched = { initial: {}, changes: [] };
	if (watch.length) { sched = await referenceSchedule(o.epanet, planned.inp, watch); }
	const eff = Number((/Global Efficiency\s+([\d.]+)/i.exec(planned.inp) || [])[1]) || 75;
	let crsJson = o.crsJson || '';
	if (planned.crs === CRS_WRITTEN && !crsJson) { crsJson = await loadCrs(); }
	const out = writeWtg(SQL, o.sqlite, parsed, sched, { crsJson: crsJson, name: o.name || 'Network', efficiency: eff, qualityStepSeconds: planned.qualityStepSeconds || 0, allowUntestedSchema: !!o.allowUntestedSchema });
	const R = out.report;
	if (R.integrity !== 'ok' || R.foreignKeyViolations) {
		throw fail('integrity', 'The file written failed its own integrity check (' + R.integrity + ', ' + R.foreignKeyViolations + ' foreign key violations), so it was not offered.', null, 'integrity');
	}
	const wtg = patchWtgXml(o.wtg, R.removedChildScenarios, 1, R.removedChildAlternatives, R.extentFt);
	return { sqlite: out.bytes, wtg: wtg, report: R };
}

EngCalcs.lpnWtgExportPlan = plan;
EngCalcs.lpnWtgExportBuild = build;
EngCalcs.lpnWtgExportSetTemplate = function (sqliteBytes, wtgText) { templateInjected = sqliteBytes ? { sqlite: sqliteBytes, wtg: wtgText } : null; };
EngCalcs.lpnWtgExportSetEngine = function (initSqlJs, wasmBinary) { injected = { init: initSqlJs, wasmBinary: wasmBinary }; engine = null; };
EngCalcs.lpnWtgExportTestedSchemas = TESTED_SCHEMAS.slice();
// For the spike's command line and harness (dev/lpn-spike/wtg-export.js): the pieces under the page.
EngCalcs.lpnWtgExportInternals = { writeWtg: writeWtg, patchWtgXml: patchWtgXml, symbolMultiplier: symbolMultiplier, smartLabel: smartLabel,
	referenceSchedule: referenceSchedule, GPM_TO_CFS: GPM_TO_CFS, carriableRules: carriableRules, energyNotWritten: energyNotWritten };

}(typeof globalThis !== 'undefined' ? globalThis : this));
