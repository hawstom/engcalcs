// EPANET network -> WaterGEMS project (.wtg + .wtg.sqlite): the SPIKE, ROADMAP-free, feasibility only.
//
//   node dev/lpn-spike/wtg-export.js --template <x.wtg.sqlite> [--wtg <x.wtg>] [--inp <Net3.inp>]
//                                    [--out <dir>] [--name Net3]
//
// WHAT IT DOES. Takes a WaterGEMS project that somebody SAVED AS AN ORDINARY USER (Tom's own
// fixtures/wtg-tgh-1, schema 1.0.54, WaterGEMS 26.0.0.532), keeps the schema and every default row,
// removes the model's elements, and writes the EPANET network's elements into it. Nothing here
// was learned by looking inside Bentley software: every table, column and code used is one seen in
// the openly licensed samples (dev/agents/market-researcher/wtg-samples.md) or in that saved file.
// The record, the mapping and the open questions are in dev/wtg-export.md.
//
// HOW AN ELEMENT IS WRITTEN. By CLONING a prototype: the template holds one live element of every
// kind (junction, reservoir, tank, pipe, pump, pump definition, pattern). Its rows, in every table
// that keys on DomainElementID / SupportElementID and in the Base alternatives, are copied under the
// new ID and the fields the EPANET network states are overwritten by column NAME. A column this
// program does not know keeps the template's default, which is the default WaterGEMS itself wrote.
//
// WHAT THE SPIKE REFUSES. Anything but a US customary, GPM file (the storage units below are
// measured for that case only), and a template with no prototype of a kind it needs.
//
// DOM-free: the library takes an initialised sql.js, so the page could call it later.
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');

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
	if (!r.length) { throw new Error('The template has no live ' + label + ' to use as a prototype (element type ' + typeId + ').'); }
	return r[0].id;
}
function findSupportProto(db, typeId, label) {
	const r = rowsOf(db, 'SELECT SupportElementID AS id FROM HMISupportElement WHERE SupportElementTypeID = ? AND IsDeleted = 0 ORDER BY SupportElementID', [typeId]);
	if (!r.length) { throw new Error('The template has no live ' + label + ' to use as a prototype (support type ' + typeId + ').'); }
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
	opts = opts || {};
	const report = { carried: [], notCarried: [], counts: {}, ids: {}, notes: [] };
	function carried(s) { report.carried.push(s); }
	function lost(s) { report.notCarried.push(s); }

	if (String(parsed.flowUnits).toUpperCase() !== 'GPM') {
		throw new Error('The spike writes US customary files in GPM only (storage units were measured for that case); this file is ' + parsed.flowUnits + '.');
	}
	if (String(parsed.headloss || 'H-W').toUpperCase().indexOf('H-W') < 0) {
		throw new Error('The spike writes Hazen-Williams files only.');
	}

	const db = new SQL.Database(new Uint8Array(templateBytes));
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
	const live = { 55: 0, 56: 0, 52: 0, 69: 0, 68: 0 };
	const supportLive = { 50: 0, 51: 0, 54: 0, 55: 0, 56: 0 };

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
					if (!(c in row)) { throw new Error('Template table ' + pr.table + ' has no column ' + c + ' (schema differs from the one this spike was written against).'); }
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
			throw new Error('Pump ' + pm.id + ': the spike writes three-point pump curves only (shutoff, design, maximum).');
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
			if (n.headPattern) { lost('head pattern on reservoir ' + n.id); }
			cloneRows(proto.reservoir, id, null, Object.assign({}, geo, { BaseIdahoNode_Physical_Data: { Physical_NodeElevation: n.head } }));
			nR++;
		} else if (n.type === 'tank') {
			domainElement(id, 52, n.id);
			if (n.volCurve || n.minVol) { lost('volume curve / minimum volume on tank ' + n.id); }
			cloneRows(proto.tank, id, null, Object.assign({}, geo, {
				BaseIdahoNode_Physical_Data: { Physical_NodeElevation: n.elev },
				ConventionalTank_Physical_Data: {
					Physical_TankBaseElevation: n.elev, Physical_TankMinimumElevation: n.elev + n.minLevel,
					Physical_TankMaximumElevation: n.elev + n.maxLevel,
					CircularTankSectionType_TankDiameter: n.diameter, NonCircularTankSectionType_TankAverageArea: circle(n.diameter),
					OperatingRangeType: 0, TankSection: 0
				},
				ConventionalTank_InitialSettings_Data: { InitialSettings_TankInitialElevation: n.elev + n.level }
			}));
			nT++;
		} else {
			throw new Error('Node ' + n.id + ' is of kind ' + n.type + ', which the spike does not write.');
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
	// Pass 1: ordinary pipes (so they take consecutive ids), then the pumps.
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
		if (l.type !== 'pump') { throw new Error('Link ' + l.id + ' is a ' + l.type + ', which the spike does not write.'); }
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
			StandardPump_Physical_Data: { Physical_PumpDefinitionID: pumpDefId[l.curveId] }
		});
		const closed = (initialStatus[l.id] || (String(l.status || '').toUpperCase() === 'CLOSED' ? 'closed' : 'open')) === 'closed';
		pipeRows(aId, l.id + '-A', elId['n:' + l.from], pumpId, [P(a), mid], 1, 99, 130, 0, closed, false);
		pipeRows(bId, l.id + '-B', pumpId, elId['n:' + l.to], [mid, P(b)], 1, 99, 130, 0, false, false);
		pipeElId[l.id] = aId;     // pump on/off is carried by the upstream pipe's status
		nPump++; nAdded += 2;
	});
	report.counts.pipes = nPipe; report.counts.pumps = nPump; report.counts.pumpConnectingPipes = nAdded;
	carried('junctions ' + nJ + ', reservoirs ' + nR + ', tanks ' + nT + ', pipes ' + nPipe + ', pumps ' + nPump + ' (each a node with ' + 2 + ' added 1 ft pipes)');

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
	let nCtl = 0;
	changes.forEach((ch) => {
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
		nCtl++;
	});
	report.counts.controls = nCtl;
	carried('controls: ' + nCtl + ' clock-time pipe-status controls (the schedule EPANET followed; see dev/wtg-export.md)');

	// ---- analysis options: the template's own EPS options already read 24 h, 1 h step; set them explicitly ----
	const T = parsed.times;
	db.run('UPDATE EpaNetEngine_TimeAnalysisType_EpsType SET EpsType_Duration = ?, EpsType_HydraulicTimeStep = ?', [T.duration, T.hydraulicStep]);
	// EPANET's own physical constants for the file (specific gravity 1.0; relative viscosity 1.0 is
	// 1.1e-5 ft2/s) and its "Unbalanced Continue 10". Hazen-Williams never reads the viscosity.
	db.run('UPDATE EpaNetEngine SET TimeAnalysisType = 1, FrictionMethod = 1, EpaNetEngine_AnalysisStartTime = ?, '
		+ 'EpaNetEngine_LiquidSpecificGravity = 1.0, EpaNetEngine_LiquidKinematicViscosity = 1.1e-5, EpaNetEngine_ExtraIterations = 10',
		[EPOCH_2000 + (T.startClock || 0)]);

	// ---- counts, dataset notes ----
	db.run('UPDATE HMIElementTypeCount SET Count = 0 WHERE ElementType IN (3,4)');
	Object.keys(live).forEach((k) => { db.run('UPDATE HMIElementTypeCount SET Count = ? WHERE ElementType = 3 AND ElementTypeID = ?', [live[k], Number(k)]); });
	Object.keys(supportLive).forEach((k) => { db.run('UPDATE HMIElementTypeCount SET Count = ? WHERE ElementType = 4 AND ElementTypeID = ?', [supportLive[k], Number(k)]); });
	db.run('UPDATE HMIElementTypeCount SET Count = 1 WHERE ElementType IN (1,2) AND Count > 1');
	db.run('UPDATE HMIDomainDataSet SET Name = ?, Notes = ?', [opts.name || 'Net3', String(parsed.title || '').trim()]);

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
	report.notCarried.push('tank-level controls as controls: carried as the clock-time schedule EPANET followed');
	report.notCarried.push('pipe material (every pipe keeps the template default)');
	return { bytes: bytes, report: report };
}

// ---------------------------------------------------------------------------------------------
// The .wtg beside it (XML presentation file): the template's, with the deleted scenario's
// references taken out. Without them WaterGEMS would be asked to open a view on scenario 38.
// ---------------------------------------------------------------------------------------------
function patchWtgXml(text, removedScenarios, keepScenario, removedAlternatives) {
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
	return t;
}

// ---------------------------------------------------------------------------------------------
// The reference run: EPANET (epanet-js, the engine this suite ships) on the original .inp.
// It gives (1) the schedule the level controls followed and (2) numbers to compare with in WaterGEMS.
// ---------------------------------------------------------------------------------------------
async function epanetReference(inpText, watchLinks, snapshotNodes, snapshotLinks) {
	const mod = await import('file://' + path.join(ROOT, 'js', 'vendor', 'epanet-js.js'));
	const ws = new mod.Workspace();
	await ws.loadModule();
	const p = new mod.Project(ws);
	ws.writeFile('r.inp', inpText);
	p.open('r.inp', 'r.rpt', 'r.out');
	const EN_HEAD = 10, EN_PRESSURE = 11, EN_DEMAND = 9, EN_FLOW = 8, EN_STATUS = 11;
	const idx = {}; watchLinks.forEach((id) => { idx[id] = p.getLinkIndex(id); });
	const nIdx = {}; snapshotNodes.forEach((id) => { nIdx[id] = p.getNodeIndex(id); });
	const lIdx = {}; snapshotLinks.forEach((id) => { lIdx[id] = p.getLinkIndex(id); });
	const initial = {}, changes = [], last = {}, snaps = {}, steps = [];
	p.openH(); p.initH(0);
	let t = 0, guard = 0;
	for (;;) {
		t = p.runH();
		steps.push(t);
		watchLinks.forEach((id) => {
			const s = p.getLinkValue(idx[id], EN_STATUS) > 0 ? 'open' : 'closed';
			if (last[id] === undefined) { initial[id] = s; } else if (last[id] !== s) { changes.push({ t: t, link: id, status: s }); }
			last[id] = s;
		});
		if (t % 3600 === 0) {
			const s = { heads: {}, pressures: {}, demands: {}, flows: {} };
			snapshotNodes.forEach((id) => { s.heads[id] = p.getNodeValue(nIdx[id], EN_HEAD); s.pressures[id] = p.getNodeValue(nIdx[id], EN_PRESSURE); s.demands[id] = p.getNodeValue(nIdx[id], EN_DEMAND); });
			snapshotLinks.forEach((id) => { s.flows[id] = p.getLinkValue(lIdx[id], EN_FLOW); });
			snaps[t] = s;
		}
		const ts = p.nextH();
		if (!(ts > 0) || ++guard > 100000) { break; }
	}
	p.closeH(); p.close();
	return { initial: initial, changes: changes, snapshots: snaps, steps: steps };
}

module.exports = { writeWtg, patchWtgXml, epanetReference, smartLabel, GPM_TO_CFS };

// ---------------------------------------------------------------------------------------------
// Command line
// ---------------------------------------------------------------------------------------------
if (require.main === module) {
	(async function () {
		const args = {};
		for (let i = 2; i < process.argv.length; i += 2) { args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1]; }
		if (!args.template) { console.error('usage: node dev/lpn-spike/wtg-export.js --template <x.wtg.sqlite> [--wtg <x.wtg>] [--inp Net3.inp] [--out dir] [--name Net3]'); process.exit(2); }
		require('./bootstrap.js');
		const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js')); global.EngCalcs = EngCalcs;
		require(path.join(ROOT, 'js', 'lpn-patterns.js')); require(path.join(ROOT, 'js', 'lpn-inp.js'));
		const initSqlJs = require(require('./wtg-sqljs.js').sqlJsPath());
		const SQL = await initSqlJs({ wasmBinary: fs.readFileSync(require('./wtg-sqljs.js').wasmPath()) });
		const inpText = fs.readFileSync(args.inp || path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net3.inp'), 'utf8');
		const parsed = EngCalcs.lpnInpParse(inpText);
		const name = args.name || 'Net3', outDir = args.out || path.join(ROOT, 'dev', 'wtg-export-out');
		fs.mkdirSync(outDir, { recursive: true });
		const watch = parsed.links.filter((l) => l.type === 'pump').map((l) => l.id).concat(parsed.controls.map((c) => c.link));
		const watchSet = Array.from(new Set(watch));
		const ref = await epanetReference(inpText, watchSet, parsed.nodes.map((n) => n.id), parsed.links.map((l) => l.id));
		const out = writeWtg(SQL, fs.readFileSync(args.template), parsed, { initial: ref.initial, changes: ref.changes }, { name: name, efficiency: Number((/Global Efficiency\s+([\d.]+)/i.exec(inpText) || [])[1]) || 75 });
		fs.writeFileSync(path.join(outDir, name + '.wtg.sqlite'), out.bytes);
		if (args.wtg) {
			const txt = fs.readFileSync(args.wtg, 'utf8');
			fs.writeFileSync(path.join(outDir, name + '.wtg'), patchWtgXml(txt, out.report.removedChildScenarios, 1, out.report.removedChildAlternatives));
		}
		fs.writeFileSync(path.join(outDir, name + '.export-report.json'), JSON.stringify({ report: out.report, reference: ref }, null, 1));
		console.log(JSON.stringify(out.report.counts), 'integrity', out.report.integrity, 'fk violations', out.report.foreignKeyViolations);
		console.log('written to', outDir);
	}()).catch((e) => { console.error(e); process.exit(1); });
}
