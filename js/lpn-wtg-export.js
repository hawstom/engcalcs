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
 * **LICENCE LINE.** Built only from files an ordinary user or the public holds: a project saved by
 * the user's own WaterGEMS, the CC BY 4.0 Zenodo 7162154 files, TSNet's MIT samples. No Bentley
 * software or DLL was looked inside, and none of Bentley's schema, defaults or code is in this
 * repository. THE SCHEMA COMES FROM THE USER: the page asks for a project the user saved from their
 * own copy, and this module copies that project, empties its elements, and writes ours into it.
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
var TESTED_SCHEMAS = ['1.0.54.0'];

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
function insert(db, table, obj) {
	const keys = Object.keys(obj);
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
	if (!r.length) { throw fail('template-kind', 'The template has no ' + label + ' to copy. Save the project from WaterGEMS with at least one of each element kind the network uses.', [label]); }
	return r[0].id;
}
function findSupportProto(db, typeId, label) {
	const r = rowsOf(db, 'SELECT SupportElementID AS id FROM HMISupportElement WHERE SupportElementTypeID = ? AND IsDeleted = 0 ORDER BY SupportElementID', [typeId]);
	if (!r.length) { throw fail('template-kind', 'The template has no ' + label + ' to copy. Save the project from WaterGEMS with at least one of each element kind the network uses.', [label]); }
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
function fail(code, message, ids) {
	const e = new Error(message);
	e.code = code;
	if (ids) { e.ids = ids; }
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
	function carried(s) { report.carried.push(s); }
	function lost(s) { report.notCarried.push(s); }

	if (String(parsed.flowUnits).toUpperCase() !== 'GPM') {
		throw fail('units', 'WaterGEMS storage units were measured for US customary projects only, so the flow unit must be gpm; this project writes ' + parsed.flowUnits + '.');
	}
	if (String(parsed.headloss || 'H-W').toUpperCase().indexOf('H-W') < 0) {
		throw fail('headloss', 'Only the Hazen-Williams head loss formula is written.');
	}

	let db;
	try { db = new SQL.Database(new Uint8Array(templateBytes)); } catch (e) { throw fail('template', 'The template is not a SQLite database.'); }
	hold(db);
	{
		let ver = null;
		try { ver = rowsOf(db, "SELECT Value FROM HMISchemaVersionInfo WHERE Name = 'HMICoreSchemaVersion'")[0]; } catch (e) { ver = null; }
		if (!ver) { throw fail('template', 'The template is not a WaterGEMS or WaterCAD project (no HMICoreSchemaVersion).'); }
		report.schemaVersion = String(ver.Value);
		if (!opts.allowUntestedSchema && TESTED_SCHEMAS.indexOf(report.schemaVersion) < 0) {
			throw fail('schema', 'The template\'s schema version is ' + report.schemaVersion + '; this writer has been tested only against ' + TESTED_SCHEMAS.join(', ') + '.');
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
	db.run('DELETE FROM HMIModelingElement WHERE ElementID > ' + DEFAULT_MAX);
	db.run("DELETE FROM sqlite_sequence WHERE name <> 'HMIModelingElement'");
	db.run("UPDATE sqlite_sequence SET seq = " + DEFAULT_MAX + " WHERE name = 'HMIModelingElement'");
	db.run('UPDATE HMIDomainDataSet SET ActiveScenarioID = (SELECT MIN(ScenarioID) FROM HMIScenario)');
	report.removedChildScenarios = childScen; report.removedChildAlternatives = childAlts;

	// ---- ids and labels ----
	let nextId = DEFAULT_MAX + 1;
	const newId = () => nextId++;
	const live = { 55: 0, 56: 0, 52: 0, 69: 0, 68: 0, 64: 0, 65: 0, 66: 0, 60: 0, 61: 0, 62: 0 };
	const supportLive = { 50: 0, 51: 0, 54: 0, 55: 0, 56: 0, 59: 0, 63: 0 };

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
					if (!(c in row)) { throw fail('data', 'Template table ' + pr.table + ' has no column ' + c + ' (the schema differs from the one this writer was written against).'); }
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
	const coordScale = ratios.length ? Math.round(ratios[Math.floor(ratios.length / 2)] / 10) * 10 || 1000 : 1000;
	report.coordScaleFtPerMapUnit = coordScale;
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
	links.filter((l) => l.type === 'pump').forEach((pm) => {
		const c = curveById[pm.curveId];
		if (!c || c.points.length !== 3 || c.points[0][0] !== 0) {
			throw fail('pump-curve', 'Pump ' + pm.id + ' has no three-point head curve (shutoff, design, maximum). Power pumps and multiple-point curves are not written.', [pm.id]);
		}
		if (pumpDefId[pm.curveId]) { return; }
		const id = newId(); pumpDefId[pm.curveId] = id;
		const pts = c.points;
		supportElement(id, 51, 'Pump Curve ' + c.id, 'EPANET curve ' + c.id + (c.note ? ': ' + c.note : ''));
		const eff = opts.efficiency || 75;
		cloneRows(proto.pumpDef, id, { IdahoPumpDefinition_PumpEfficiencyType_BestEfficiencyPointType: 1 }, {
			IdahoPumpDefinition: {
				PumpDefinitionType: 2,                       // standard three point (observed: Tom's PD1 and its design/shutoff/max fields)
				ShutoffHead: pts[0][1],
				DesignDischarge: pts[1][0] * GPM_TO_CFS, DesignHead: pts[1][1],
				MaxOperatingDischarge: pts[2][0] * GPM_TO_CFS, MaxOperatingHead: pts[2][1],
				IdahoPumpDefinition_MotorEfficiency: 100.0,
				PumpEfficiencyType: 0                        // constant (EPS sample's ConstantEfficiencyType)
			}
		});
		insert(db, 'IdahoPumpDefinition_PumpEfficiencyType_ConstantEfficiencyType', { SupportElementID: id, ConstantEfficiencyType_PumpEfficiency: eff });
	});
	carried('pump curves: ' + Object.keys(pumpDefId).length + ' three-point pump definitions, constant efficiency ' + (opts.efficiency || 75) + ' %');

	// ---- GPV headloss curves (support type 63): flow gpm -> ft3/s, headloss ft ----
	const gpvCurveId = {};
	links.filter((l) => l.type === 'valve' && String(l.valveType).toUpperCase() === 'GPV').forEach((v) => {
		const c = curveById[v.curveId];
		if (!c || !c.points || c.points.length < 2) { throw fail('data', 'GPV ' + v.id + ': the headloss curve ' + v.curveId + ' is not in the file.'); }
		if (gpvCurveId[c.id]) { return; }
		if (!gpvCurveProto) { throw fail('data', 'The template holds no GPV headloss curve to copy.'); }
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
			if (d < pts[0][0] - 1e-9 || d > pts[pts.length - 1][0] + 1e-9) { throw fail('data', 'Tank ' + n.id + ': volume curve ' + vc.id + ' does not cover its level range ' + n.minLevel + ' to ' + n.maxLevel + '.'); }
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
	nodes.forEach((n) => {
		const id = newId(); elId['n:' + n.id] = id;
		const xy = P(n);
		const geo = { BaseIdahoNode_HmiDataSetGeometry_Data: { HMIGeometry: wkbPoint(xy[0], xy[1]) } };
		if (n.type === 'junction') {
			domainElement(id, 55, n.id);
			const ov = Object.assign({}, geo, {
				BaseIdahoNode_Physical_Data: { Physical_NodeElevation: n.elev },
				IdahoDemandNode_Demand_Data: { DemandCollectionCount: n.demand ? 1 : 0, UnitDemandLoadCollectionCount: 0 },
				IdahoFireFlowNode_Physical_Data: { Physical_EmitterCoefficient: 0 }
			});
			if (n.emitter) { lost('emitter on ' + n.id + ' (storage unit of the emitter coefficient is not measured)'); }
			cloneRows(proto.junction, id, { IdahoDemandNode_Demand_DemandCollection: 1 }, ov);
			if (n.demand) {
				const pat = n.demandPattern || defaultPattern;
				const row = Object.assign({}, demandProtoRow);
				delete row.ItemID;
				row.DomainElementID = id; row.AlternativeID = altOfType[20];
				row.DemandCollection_BaseFlow = n.demand * GPM_TO_CFS;
				row.DemandCollection_DemandPattern = pat ? patId[pat] : null;
				insert(db, 'IdahoDemandNode_Demand_DemandCollection', row);
			}
			nJ++;
		} else if (n.type === 'reservoir') {
			domainElement(id, 56, n.id);
			const resOv = Object.assign({}, geo, { BaseIdahoNode_Physical_Data: { Physical_NodeElevation: n.head } });
			if (n.headPattern) {
				if (patId[n.headPattern] === undefined) { throw fail('data', 'Reservoir ' + n.id + ' names head pattern ' + n.headPattern + ', which the file does not define.'); }
				resOv.IdahoReservoir_Physical_Data = { Physical_HglPattern: patId[n.headPattern] };
			}
			cloneRows(proto.reservoir, id, null, resOv);
			nR++;
		} else if (n.type === 'tank') {
			domainElement(id, 52, n.id);
			// A volume curve: EPANET gives depth above the tank bottom and volume (ft3). WaterGEMS holds
			// the active range as depth ratio and volume ratio (OBSERVED in Tom's saved TGH-1 scenario
			// against its .inp: depth 16.2 of 1..20 is ratio 0.8; volume / total active volume), the total
			// active volume, the inactive volume below the minimum level, and TankSection 2.
			const vc = n.volCurve ? curveById[n.volCurve] : null;
			let tankSection = null;
			if (n.volCurve && !(vc && vc.points && vc.points.length >= 2)) { throw fail('data', 'Tank ' + n.id + ' names volume curve ' + n.volCurve + ', which the file does not define.'); }
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
			throw fail('node-kind', 'Node ' + n.id + ' is of kind ' + n.type + ', which is not written.', [n.id]);
		}
	});
	report.counts.junctions = nJ; report.counts.reservoirs = nR; report.counts.tanks = nT;

	// ---- links ----
	const initialStatus = (schedule && schedule.initial) || {};
	const pipeElId = {};        // EPANET link id -> ElementID of the pipe that carries its status
	const pumpNodeId = {};
	let nPipe = 0, nPump = 0, nAdded = 0;
	function pipeRows(id, label, startEl, stopEl, pts, lengthFt, diaIn, C, minorK, closed, checkValve) {
		domainElement(id, 69, label);
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
		if (!valveProto[vt]) { throw fail('data', 'Valve ' + l.id + ' is a ' + vt + ', and the template holds no ' + vt + ' to copy.'); }
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
			if (!(l.curveId && gpvCurveId[l.curveId])) { throw fail('data', 'GPV ' + l.id + ' has no headloss curve.'); }
			ov.GPV_Physical_Data = { Physical_GpvHeadlossCurveID: gpvCurveId[l.curveId] };
		}
		domainElement(valveId, VALVE_TYPE_ID[vt], l.id);
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
		pipeRows(id, l.id, elId['n:' + l.from], elId['n:' + l.to], pts, l.length, l.diameter, l.roughness, l.k || 0, closedAtStart, st === 'CV');
		nPipe++;
	});
	links.forEach((l) => {
		if (l.type === 'pipe') { return; }
		if (l.type === 'valve') { writeValve(l); return; }
		if (l.type !== 'pump') { throw fail('link-kind', 'Link ' + l.id + ' is a ' + l.type + ', which is not written.', [l.id]); }
		// A pump is a NODE between two pipes. Upstream pipe "<id>-A", downstream "<id>-B", both
		// 1 ft long and 99 in across as WaterGEMS's own .inp import makes them (EPS sample: length 1,
		// diameter 8.25 ft), so they add no head loss worth the name. The pump node sits at the
		// middle of the two end nodes.
		const a = nodeById[l.from], b = nodeById[l.to];
		const mid = [(P(a)[0] + P(b)[0]) / 2, (P(a)[1] + P(b)[1]) / 2];
		const pumpId = newId(), aId = newId(), bId = newId();
		pumpNodeId[l.id] = pumpId;
		domainElement(pumpId, 68, l.id);
		cloneRows(proto.pump, pumpId, null, {
			BaseDirectedNode_HmiDataSetGeometry_Data: { HMIGeometry: wkbPoint(mid[0], mid[1]) },
			BaseDirectedNode_HMIDataSetTopology_Data: { HMITopologyDownstreamLinkID: bId },
			BaseDirectedNode_Physical_Data: { Physical_NodeElevation: a.type === 'reservoir' ? a.head : a.elev },
			StandardPump_Physical_Data: { Physical_PumpDefinitionID: pumpDefId[l.curveId] },
			BasePump_InitialSettings_Data: { InitialSettings_RelativeSpeedFactor: l.speed > 0 ? l.speed : 1 }
		});
		if (l.speedPattern) { lost('speed pattern ' + l.speedPattern + ' on pump ' + l.id + ' (the table exists, no sample states it)'); }
		if (l.power) { lost('constant power on pump ' + l.id); }
		const closed = (initialStatus[l.id] || (String(l.status || '').toUpperCase() === 'CLOSED' ? 'closed' : 'open')) === 'closed';
		pipeRows(aId, l.id + '-A', elId['n:' + l.from], pumpId, [P(a), mid], 1, 99, 130, 0, closed, false);
		pipeRows(bId, l.id + '-B', pumpId, elId['n:' + l.to], [mid, P(b)], 1, 99, 130, 0, false, false);
		pipeElId[l.id] = aId;     // pump on/off is carried by the upstream pipe's status
		nPump++; nAdded += 2;
	});
	report.counts.pipes = nPipe; report.counts.pumps = nPump; report.counts.valves = nValve; report.counts.pumpConnectingPipes = nAdded;
	carried('junctions ' + nJ + ', reservoirs ' + nR + ', tanks ' + nT + ', pipes ' + nPipe + ', pumps ' + nPump + ' (each a node with ' + 2 + ' added 1 ft pipes), valves ' + nValve);

	// ---- controls ----
	// Three support elements per control: a condition, an action, and the control that joins them.
	// Only the clock-time condition and the pipe-status action have codes anyone has SEEN in a file,
	// so every EPANET control is carried as clock-time controls on a pipe, from a reference run
	// (dev/wtg-export.md, "Controls").
	const changes = (schedule && schedule.changes) || [];
	const clockEpoch = (t) => EPOCH_2000 + (t % 86400);
	function controlText(t, linkLabel, status) {
		const hh = Math.floor((t % 86400) / 3600), mm = Math.floor((t % 3600) / 60), ss = t % 60;
		const clock = String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0') + (ss ? ':' + String(ss).padStart(2, '0') : '');
		return { cond: 'Clock Time  = ' + clock + ' ', act: linkLabel + ' Pipe Status = ' + status + ' ' };
	}
	let nCtl = 0, nLevel = 0;
	const controlIds = [];
	// Tank-level controls ("Link 335 OPEN IF Node 1 BELOW 17.1") are written as real tank-level controls,
	// in the codes Tom's own saved wtg-control-1 showed (dev/wtg-export.md, "Tank-level controls").
	// A junction-pressure condition has no sample, so its link keeps the frozen clock schedule.
	const levelCtl = opts.frozenLevelControls ? [] : (parsed.controls || []).filter((c) => c.condition && c.condition.kind === 'node'
		&& nodeById[c.condition.node] && nodeById[c.condition.node].type === 'tank' && pipeElId[c.link]
		&& (c.condition.cmp === 'below' || c.condition.cmp === 'above'));
	const realLinks = {};
	levelCtl.forEach((c) => { realLinks[c.link] = 1; });
	const fmt2 = (v) => Number(v).toFixed(2);
	function setRows(table, id, rowObj) { insert(db, table, Object.assign({ SupportElementID: id }, rowObj)); }
	levelCtl.forEach((c) => {
		const isPump = !!pumpNodeId[c.link];
		const pipeLabel = isPump ? (c.link + '-A') : c.link;
		const statusWord = c.action.status === 'open' ? 'Open' : 'Closed';
		const sym = c.condition.cmp === 'below' ? '<' : '>';
		const cId = newId(), aId = newId(), kId = newId();
		const cName = 'Node-' + c.condition.node + '-' + c.condition.cmp + '-' + c.condition.value;
		const aName = statusWord + '-' + pipeLabel;
		const condTxt = cName + ' {"' + c.condition.node + '" Level ' + sym + ' ' + fmt2(c.condition.value) + ' ft}';
		const actTxt = aName + ' {"' + pipeLabel + '" Pipe Status = ' + statusWord + ' }';
		supportElement(cId, 56, 'C' + cId, '{C' + cId + ':  ' + condTxt + '}');
		supportElement(aId, 55, 'A' + aId, '{A' + aId + ':  ' + actTxt.replace(/"/g, '""') + '}');
		supportElement(kId, 54, 'LC' + kId, '');
		setRows('IdahoControlCondition', cId, { IdahoControlCondition_DefineDescription: 1, IdahoControlCondition_Description: cName + ' {"%e" %a %o %v %u}', IdahoControlCondition_ExpandedDescription: condTxt, ConditionType: 0 });
		setRows('IdahoControlCondition_ConditionType_SimpleConditionType', cId, { SimpleConditionType: 0, CompareOperator: c.condition.cmp === 'below' ? 3 : 1 });
		setRows('IdahoControlCondition_SimpleConditionType_ElementType', cId, {
			ElementType_Element: elId['n:' + c.condition.node], ElementType_Demand: 0, ElementType_HydraulicGrade: 0, ElementType_Pressure: 0,
			ElementType_TankLevel: c.condition.value, ElementType_TankTimeToFill: 0, ElementType_TankTimeToDrain: 0, ElementType_Discharge: 0,
			ElementType_HeadlossCoefficient: 0, ElementType_RelativeSpeedFactor: 0, ElementType_TankPercentFull: 0,
			ControlConditionPumpStatus: 0, ControlConditionPipeStatus: 0, ControlConditionGPVStatus: 0, ControlConditionValveStatus: 0,
			ControlConditionElementType: 52
		});
		const cSub = { NodeType: ['ControlConditionNodeType', 'NodeAttribute', 1], TankType: ['ControlConditionTankType', 'TankAttribute', 3],
			PumpType: ['ControlConditionPumpType', 'ControlConditionPumpAttribute', 0], PipeType: ['ControlConditionPipeType', 'ConditionPipeAttribute', 0],
			PressureValveType: ['ControlConditionPressureValveType', 'ControlConditionPressureValveAttribute', 0],
			FCVType: ['ControlConditionFCVType', 'ControlConditionFCVAttribute', 0], GPVType: ['ControlConditionGPVType', 'ControlConditionGPVAttribute', 0],
			TCVType: ['ControlConditionTCVType', 'ControlConditionTCVAttribute', 0], HydroTankType: ['ControlConditionHydroTankType', 'HydroTankAttribute', 1],
			SurgeTankType: ['ControlConditionSurgeTankType', 'SurgeTankAttribute', 1] };
		Object.keys(cSub).forEach((k) => { const v = cSub[k]; setRows('IdahoControlCondition_ControlConditionElementType_' + v[0], cId, { [v[1]]: v[2] }); });
		setRows('IdahoControlAction', aId, { IdahoControlAction_DefineDescription: 1, IdahoControlAction_Description: aName + ' {"%e" %a %o %v %u}', IdahoControlAction_ExpandedDescription: actTxt, ControlActionType: 0 });
		setRows('IdahoControlAction_ControlActionType_SimpleActionType', aId, { SimpleActionType_Element: pipeElId[c.link], ElementType: 69 });
		const aSub = [
			['IdahoControlAction_ElementType_ControlActionPipeType', { PipeAttribute: 0 }],
			['IdahoControlAction_PipeAttribute_ActionPipeStatusType', { ActionPipeStatus: c.action.status === 'open' ? 0 : 1 }],
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
		const words = 'IF ' + condTxt + ' THEN ' + actTxt;
		setRows('IdahoControl', kId, { IdahoControl_DefineDescription: 0, IdahoControl_Description: words, IdahoControl_ExpandedDescription: words, IdahoControl_ControlCondition: cId, IdahoControl_ControlAction: aId, IdahoControl_ControlNotes: '', ControlType: 0 });
		setRows('IdahoControl_ControlType_LogicalType', kId, { LogicalType_HasPriority: 0, LogicalType_HasElse: 0, LogicalType_ElseAction: null, ControlPriority: 0 });
		controlIds.push(kId); nCtl++; nLevel++;
	});
	changes.forEach((ch) => {
		if (realLinks[ch.link]) { return; }
		const pipeEl = pipeElId[ch.link];
		if (!pipeEl) { return; }
		const isPump = !!pumpNodeId[ch.link];
		const label = isPump ? (ch.link + '-A') : ch.link;
		const txt = controlText(ch.t, label, ch.status === 'open' ? 'Open' : 'Closed');
		const cId = newId(), aId = newId(), kId = newId();
		supportElement(cId, 56, 'C' + cId); supportElement(aId, 55, 'A' + aId); supportElement(kId, 54, 'LC' + kId);
		insert(db, 'IdahoControlCondition', { SupportElementID: cId, IdahoControlCondition_DefineDescription: 0, IdahoControlCondition_Description: 'text', IdahoControlCondition_ExpandedDescription: txt.cond, ConditionType: 0 });
		insert(db, 'IdahoControlCondition_ConditionType_SimpleConditionType', { SupportElementID: cId, SimpleConditionType: 2, CompareOperator: 0 });
		insert(db, 'IdahoControlCondition_SimpleConditionType_ClockTimeType', { SupportElementID: cId, ClockTimeType_ClockTime: clockEpoch(ch.t) });
		insert(db, 'IdahoControlAction', { SupportElementID: aId, IdahoControlAction_DefineDescription: 0, IdahoControlAction_Description: 'text', IdahoControlAction_ExpandedDescription: txt.act, ControlActionType: 0 });
		insert(db, 'IdahoControlAction_ControlActionType_SimpleActionType', { SupportElementID: aId, SimpleActionType_Element: pipeEl, ElementType: 69 });
		insert(db, 'IdahoControlAction_ElementType_ControlActionPipeType', { SupportElementID: aId, PipeAttribute: 0 });
		insert(db, 'IdahoControlAction_PipeAttribute_ActionPipeStatusType', { SupportElementID: aId, ActionPipeStatus: ch.status === 'open' ? 0 : 1 });
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

	// ---- analysis options: the template's own EPS options already read 24 h, 1 h step; set them explicitly ----
	const T = parsed.times;
	// Specific gravity and relative viscosity as the file states them (EPANET: 1 and 1). A pressure valve's
	// psi setting becomes a head by the specific gravity, so a file that states 0.998 needs it carried.
	const hy = parsed.hydraulics || {};
	const sg = hy.specificGravity > 0 ? hy.specificGravity : 1.0, visc = hy.viscosity > 0 ? hy.viscosity : 1.0;
	db.run('UPDATE EpaNetEngine_TimeAnalysisType_EpsType SET EpsType_Duration = ?, EpsType_HydraulicTimeStep = ?', [T.duration, T.hydraulicStep]);
	// EPANET's own physical constants for the file (specific gravity 1.0; relative viscosity 1.0 is
	// 1.1e-5 ft2/s) and its "Unbalanced Continue 10". Hazen-Williams never reads the viscosity.
	db.run('UPDATE EpaNetEngine SET TimeAnalysisType = 1, FrictionMethod = 1, EpaNetEngine_AnalysisStartTime = ?, '
		+ 'EpaNetEngine_LiquidSpecificGravity = ?, EpaNetEngine_LiquidKinematicViscosity = ?, EpaNetEngine_ExtraIterations = 10',
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
	report.ids = { firstId: DEFAULT_MAX + 1, lastId: nextId - 1, pumpNodes: pumpNodeId, patterns: patId };
	report.notCarried.push('quality analysis (Trace Lake), reactions, mixing, sources, energy price and pattern, the [REPORT] settings');
	if (!report.counts.levelControls) { report.notCarried.push('tank-level controls as controls: carried as the clock-time schedule EPANET followed'); }
	report.notCarried.push('pipe material (every pipe keeps the template default)');
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
		return !c || !c.points || c.points.length !== 3 || c.points[0][0] !== 0;
	});
	if (badPumps.length) { refused.push({ code: 'pump_curve', ids: badPumps }); }

	const emit = idsOf(nodes, (n) => n.type === 'junction' && n.emitter);
	if (emit.length) { notCarried.push({ code: 'emitters', ids: emit }); }
	const multi = idsOf(nodes, (n) => n.type === 'junction' && n.extraDemands && n.extraDemands.length);
	if (multi.length) { notCarried.push({ code: 'extra_demands', ids: multi }); }
	// A water quality analysis asked for ([OPTIONS] Quality other than None), or a source, a mixing model or a reaction stated.
	const q = parsed.qualityOptions || {};
	const quality = (String(q.quality || '').trim() !== '' && !/^none\b/i.test(String(q.quality).trim()))
		|| (secs.SOURCES || []).length > 0 || (secs.MIXING || []).length > 0 || (secs.REACTIONS || []).length > 0;
	if (quality) { notCarried.push({ code: 'quality', ids: [] }); }
	// An energy line that states a price, a price pattern or a demand charge other than zero. Efficiency lines are carried.
	const price = (secs.ENERGY || []).filter((ln) => {
		const f = String(ln).replace(/;.*$/, '').trim().split(/\s+/);
		if (f.length < 2) { return false; }
		const key = f.slice(0, -1).join(' ').toLowerCase(), val = f[f.length - 1];
		if (/efficiency/.test(key)) { return false; }
		if (/pattern/.test(key)) { return true; }
		return /price|charge/.test(key) && Number(val) !== 0;
	});
	if (price.length) { notCarried.push({ code: 'energy_price', ids: [] }); }
	if ((parsed.rules || []).length) { notCarried.push({ code: 'rules', ids: [] }); }
	const frozen = [];
	(parsed.controls || []).forEach((c) => {
		const cond = c.condition || {};
		const tankLevel = cond.kind === 'node' && (cond.cmp === 'below' || cond.cmp === 'above')
			&& nodes.some((n) => n.id === cond.node && n.type === 'tank');
		const clock = cond.kind !== 'node';
		if (!tankLevel && !clock && frozen.indexOf(c.link) < 0) { frozen.push(c.link); }
	});
	if (frozen.length) { notCarried.push({ code: 'controls_pressure', ids: frozen }); }
	const mix = idsOf(nodes, (n) => n.type === 'tank' && n.mixingModel && String(n.mixingModel).toUpperCase() !== 'MIXED');
	if (mix.length) { notCarried.push({ code: 'tank_mixing', ids: mix }); }
	const minvol = idsOf(nodes, (n) => n.type === 'tank' && n.minVol > 0);
	if (minvol.length) { notCarried.push({ code: 'tank_minvol', ids: minvol }); }
	const sp = idsOf(links, (l) => l.type === 'pump' && l.speedPattern);
	if (sp.length) { notCarried.push({ code: 'pump_speed_pattern', ids: sp }); }
	const ec = idsOf(links, (l) => l.type === 'pump' && l.efficCurveId);
	if (ec.length) { notCarried.push({ code: 'pump_efficiency_curve', ids: ec }); }
	// Always: these have no place in the file, whatever the network.
	notCarried.push({ code: 'material', ids: [] });
	notCarried.push({ code: 'positions', ids: [] });
	return { ok: true, refused: refused, notCarried: notCarried, inp: out.inp, parsed: parsed, differences: out.differences || [] };
}

// ---------------------------------------------------------------------------------------------
// The SQLite engine (sql.js), loaded the first time and only here: the same two files, the same
// versioned URLs and the same "fetch the wasm as bytes" rule as js/lpn-sqlite.js (which, if it is
// also on the page, shares the global `initSqlJs` and nothing else).
// ---------------------------------------------------------------------------------------------
var SQLJS_VERSION = '1.14.2';
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
		throw fail('engine', 'The SQLite engine could not be loaded (' + (e && e.message) + ').');
	});
	return engine;
}

// ---------------------------------------------------------------------------------------------
// Build: the plan, a template, the engines -> the two files.
// ---------------------------------------------------------------------------------------------
/**
 * @param planned  lpnWtgExportPlan()'s result (ok, no refusals)
 * @param o        { sqlite: Uint8Array (the user's saved project), wtg: string (its .wtg XML),
 *                   name: the project's name, epanet: the epanet-js module namespace,
 *                   allowUntestedSchema }
 * @returns Promise of { sqlite: Uint8Array, wtg: string, report }
 * Rejects with an Error whose `.code` names the cause: 'engine', 'template', 'template-kind',
 * 'schema', 'pump-curve', 'data'... and `.ids` where there are elements to name.
 */
async function build(planned, o) {
	if (!planned || !planned.ok || planned.refused.length) { throw fail('refused', 'The plan was refused.'); }
	if (!o || !o.sqlite || typeof o.wtg !== 'string') { throw fail('template', 'Both files of the saved project are needed: the .wtg and the .wtg.sqlite.'); }
	if (!o.epanet) { throw fail('engine', 'The EPANET engine is needed to find when each pump switches.'); }
	const SQL = await getEngine();
	const parsed = planned.parsed;
	const watch = Array.from(new Set(parsed.links.filter((l) => l.type === 'pump').map((l) => l.id).concat((parsed.controls || []).map((c) => c.link))));
	let sched = { initial: {}, changes: [] };
	if (watch.length) { sched = await referenceSchedule(o.epanet, planned.inp, watch); }
	const eff = Number((/Global Efficiency\s+([\d.]+)/i.exec(planned.inp) || [])[1]) || 75;
	const out = writeWtg(SQL, o.sqlite, parsed, sched, { name: o.name || 'Network', efficiency: eff, allowUntestedSchema: !!o.allowUntestedSchema });
	const R = out.report;
	if (R.integrity !== 'ok' || R.foreignKeyViolations) {
		throw fail('integrity', 'The file written failed its own integrity check (' + R.integrity + ', ' + R.foreignKeyViolations + ' foreign key violations), so it was not offered.');
	}
	const wtg = patchWtgXml(o.wtg, R.removedChildScenarios, 1, R.removedChildAlternatives, R.extentFt);
	return { sqlite: out.bytes, wtg: wtg, report: R };
}

EngCalcs.lpnWtgExportPlan = plan;
EngCalcs.lpnWtgExportBuild = build;
EngCalcs.lpnWtgExportSetEngine = function (initSqlJs, wasmBinary) { injected = { init: initSqlJs, wasmBinary: wasmBinary }; engine = null; };
EngCalcs.lpnWtgExportTestedSchemas = TESTED_SCHEMAS.slice();
// For the spike's command line and harness (dev/lpn-spike/wtg-export.js): the pieces under the page.
EngCalcs.lpnWtgExportInternals = { writeWtg: writeWtg, patchWtgXml: patchWtgXml, symbolMultiplier: symbolMultiplier, smartLabel: smartLabel,
	referenceSchedule: referenceSchedule, GPM_TO_CFS: GPM_TO_CFS };

}(typeof globalThis !== 'undefined' ? globalThis : this));
