/**
 * lpn-wtg.js — a Bentley WaterCAD/WaterGEMS `.wtg.sqlite` model, read as an EPANET network.
 *
 * Copyright 2009 Thomas Gail Haws
 * Licensed under GNU GPL v3.0 or later
 *
 * ROADMAP Task 749. The schema is unpublished; every table and column this file relies on was read
 * out of public sample files and is recorded, with the evidence, in dev/sqlite-reader.md. **No DOM**:
 * it is handed an open database (EngCalcs.lpnSqliteOpen() in js/lpn-sqlite.js, or anything with the
 * same `tables` and `select()`), so a harness can run it in Node.
 *
 * **WHAT IT PRODUCES IS `.inp` TEXT**, the same thing js/lpn-net.js makes of a `.net` file, so the
 * import lands by the one route every EPANET file already takes (units strip, document, report).
 * What an `.inp` cannot say (scenarios, alternatives, inactive elements) comes back beside it as
 * plain records for the page to lay onto the document, and every difference comes back as a note
 * `{code, ids, detail}` for the import report: **nothing is dropped silently**.
 *
 * **THE NUMBERS ARE THE MODELLER'S, CONVERTED ONCE.** The database stores every quantity in one
 * fixed unit per field (feet, cubic feet per second, psi...), whatever WaterGEMS displays, and it
 * says which: each field's storage unit is stated in the file's own schema
 * (`HMIDomainDataSetTypeSchema.SchemaInfo`). A number is converted from that unit to the project's
 * by one factor and written to 10 significant digits, which gives back what the modeller typed
 * (13.1 m is stored as 42.9790026245 ft; 10 digits of 13.09999999995 is 13.1). A field whose stated
 * unit is not one this file knows is not converted by guess: it is reported and left out.
 *
 * **IT NEVER WRITES.** It only selects.
 */
(function (root) {
	'use strict';
	var EngCalcs = root.EngCalcs = root.EngCalcs || {};

	// ---- units ---------------------------------------------------------------------------------
	//
	// Storage-unit codes as the file's schema states them per field, with what each code was
	// MEASURED to be (dev/sqlite-reader.md, "Storage units"): the code's meaning is not written in
	// the file, only its number, so each one here is backed by a value lined up against its `.inp`.
	var FT = 0.3048;
	var STORE_KIND = { 63: 'ft', 27: 'cfs', 33: 'ft3', 236: 'ft2', 231: 'psi', 234: 's', 252: 'none', 0: 'none' };
	// The field's code when the schema blob is missing or does not name the field: what every
	// sample states. Used only as a fallback, and the report says when it was.
	var EXPECT = {
		Physical_NodeElevation: 63, Physical_PipeDiameter: 63, Physical_UserDefinedLength: 63,
		HMIGeometryScaledLength: 63, Physical_ValveDiameter: 63, Physical_DarcyWeisbachE: 63,
		Physical_HazenWilliamsC: 252, Physical_PipeMannings: 252, Physical_CompositeMinorLoss: 252,
		Physical_CalculatedMinorLossCoefficient: 252, DemandCollection_BaseFlow: 27, UnitDemandLoadCollection_UnitDemandBaseFlow: 27,
		Physical_TankBaseElevation: 63, Physical_TankMaximumElevation: 63, Physical_TankMinimumElevation: 63,
		Physical_TankMaximumLevel: 63, Physical_TankMinimumLevel: 63, InitialSettings_TankInitialElevation: 63,
		InitialSettings_TankInitialLevel: 63, CircularTankSectionType_TankDiameter: 63,
		NonCircularTankSectionType_TankAverageArea: 236, VariableAreaTankSectionType_TotalActiveVolume: 33,
		Physical_InactiveVolume: 33, PumpCurve_Discharge: 27, PumpCurve_Head: 63, DesignDischarge: 27,
		DesignHead: 63, ShutoffHead: 63, MaxOperatingDischarge: 27, MaxOperatingHead: 63,
		DischargeEfficiencyCurve_Discharge: 27, ValvePressureType_ValvePressureSetting: 231,
		ValveHGLType_ValveHGLSetting: 63, InitialSettings_FlowSetting: 27, GpvHeadlossFlowCurve_GpvFlow: 27,
		GpvHeadlossFlowCurve_GpvHeadloss: 63, InitialSettings_HeadlossCoefficient: 252,
		PatternCurve_TimeFromStart: 234, EpsType_Duration: 234, EpsType_HydraulicTimeStep: 234,
		EpsType_ReportingTimeStep: 234, InitialSettings_RelativeSpeedFactor: 252
	};
	// Bentley's own psi per metre of water, MEASURED, not ours: Tnet0's PRV is set to 100000 m in
	// its `.inp` and its database stores 142232.90511120702 psi. Written as that ratio because it is
	// a different number from the suite's psi (by 4 parts in a million), and converting the stored
	// psi back with ours would turn the modeller's 100000 m into 99999.63.
	var BENTLEY_PSI_PER_M = 142232.90511120702 / 100000;
	// EPANET's [OPTIONS] Viscosity is relative to 1.1e-5 ft2/s; WaterGEMS's own export divides by it.
	var EPANET_VISC_FT2S = 1.1e-5;

	// One factor from a storage unit to a target unit. Exact definitions only (0.3048 m per foot).
	function factor(store, target, flowToSI) {
		switch (store) {
			case 'ft':
				return { m: FT, ft: 1, mm: FT * 1000, in: 12, mft: 1000 }[target];
			case 'ft2':
				return { m2: FT * FT, ft2: 1 }[target];
			case 'ft3':
				return { m3: FT * FT * FT, ft3: 1 }[target];
			case 'cfs':
				return target === 'flow' ? FT * FT * FT / flowToSI : undefined;
			case 'psi':
				return { m: 1 / BENTLEY_PSI_PER_M, psi: 1 }[target];
			case 's':
				return target === 's' ? 1 : undefined;
			case 'none':
				return target === 'none' ? 1 : undefined;
		}
		return undefined;
	}

	/**
	 * A converted number as `.inp` text: the SHORTEST decimal within 5 parts in 10^8 of it, so the
	 * modeller's own digits come back. WaterGEMS stores about 12 significant digits, and its own
	 * conversion constants differ from the suite's exact ones by up to 2 parts in 10^8 (its litre is
	 * 0.035314667 ft3, measured: 43.264 L/s is stored as 1.527853753088 ft3/s), so 43.264 L/s comes
	 * back as 43.26400034 by our factor and as 43.264 here. Never "-0".
	 */
	var REL_TOL = 5e-8;
	function num(v) {
		if (typeof v !== 'number' || !isFinite(v)) { return '0'; }
		if (v === 0) { return '0'; }
		var p, r;
		for (p = 1; p <= 15; p++) {
			r = Number(v.toPrecision(p));
			if (Math.abs(r - v) <= REL_TOL * Math.abs(v)) { break; }
		}
		return r === 0 ? '0' : String(r);
	}
	// Coordinates are not typed numbers: 10 significant digits, a millimetre at a million metres.
	function numXY(v) {
		if (typeof v !== 'number' || !isFinite(v)) { return '0'; }
		var r = Number(v.toPrecision(10));
		return r === 0 ? '0' : String(r);
	}
	// ---- the `.wtg` beside it: what WaterGEMS DISPLAYS --------------------------------------------
	//
	// The `.wtg` is XML (the presentation file); its NumericPresentationManager names a display unit
	// per formatter, `DisplayUnit="flow:litersPerSecond"`. Read with a pattern, not a parser, so this
	// stays DOM-free; only the attributes of <NumericFormatter> elements are looked at.
	function wtgDisplayUnits(text) {
		var out = {}, re = /<NumericFormatter\b([^>]*)>/g, m, attrs, name, unit;
		text = String(text || '');
		while ((m = re.exec(text)) !== null) {
			attrs = m[1];
			name = /\bName="([^"]*)"/.exec(attrs);
			unit = /\bDisplayUnit="([^"]*)"/.exec(attrs);
			if (name && unit) { out[name[1]] = unit[1]; }
		}
		return out;
	}
	// A WaterGEMS flow display unit to an EPANET flow keyword. A unit EPANET has no keyword for
	// (cubic metres per second) gets the nearest one of the same system, and the report says so.
	function flowKeywordFor(displayUnit) {
		var u = String(displayUnit || '').toLowerCase().replace(/^flow:/, '');
		if (!u) { return null; }
		if (/liters?persecond|litrespersecond/.test(u)) { return 'LPS'; }
		if (/liters?perminute/.test(u)) { return 'LPM'; }
		if (/(mega|million)liters?perday/.test(u)) { return 'MLD'; }
		if (/cubicmeters?perhour/.test(u)) { return 'CMH'; }
		if (/cubicmeters?perday/.test(u)) { return 'CMD'; }
		if (/cubicmeters?persecond/.test(u)) { return 'LPS'; }
		if (/imperial/.test(u) && /day/.test(u)) { return 'IMGD'; }
		if (/^gpm$|gallonsperminute/.test(u)) { return 'GPM'; }
		if (/^mgd$|milliongallonsperday/.test(u)) { return 'MGD'; }
		if (/^cfs$|cubicfeetpersecond/.test(u)) { return 'CFS'; }
		if (/acrefeetperday|^afd$/.test(u)) { return 'AFD'; }
		return null;
	}
	// What the project's own unit for each quantity is called in WaterGEMS's display-unit words, so
	// a display unit that differs can be named in the report.
	var SI_WORDS = { length: 'length:meters', elevation: 'length:meters', diameter: 'length:millimeters', pressure: 'length:meters', coordinate: 'length:meters' };
	var US_WORDS = { length: 'length:feet', elevation: 'length:feet', diameter: 'length:inches', pressure: 'pressure:psi', coordinate: 'length:feet' };

	// ---- WKB, the geometry column ----------------------------------------------------------------
	//
	// `HMIGeometry` is a standard Well-Known Binary blob (OBSERVED: `01 01 00 00 00` + two doubles
	// for a node; type 2, a count and the points for a link). Z and M variants are read and the extra
	// ordinates ignored.
	function wkbPoints(blob) {
		if (!blob || !blob.length || blob.length < 21) { return null; }
		var dv = new DataView(blob.buffer, blob.byteOffset || 0, blob.byteLength), le = blob[0] === 1;
		var type = dv.getUint32(1, le), off = 5, dims = 2, base, n, pts = [], i;
		if (type & 0x20000000) { off += 4; }                       // EWKB SRID
		if (type & 0x80000000) { dims++; }                          // EWKB Z
		if (type & 0x40000000) { dims++; }                          // EWKB M
		type = type & 0x0fffffff;
		if (type >= 3000) { dims = 4; type -= 3000; } else if (type >= 2000) { dims = 3; type -= 2000; } else if (type >= 1000) { dims = 3; type -= 1000; }
		if (type === 1) {
			if (off + 16 > blob.length) { return null; }
			return [[dv.getFloat64(off, le), dv.getFloat64(off + 8, le)]];
		}
		if (type !== 2) { return null; }
		n = dv.getUint32(off, le); off += 4;
		for (i = 0; i < n; i++) {
			base = off + i * 8 * dims;
			if (base + 16 > blob.length) { return null; }
			pts.push([dv.getFloat64(base, le), dv.getFloat64(base + 8, le)]);
		}
		return pts;
	}

	// ---- the schema blob: each field's storage unit ----------------------------------------------
	//
	// `HMIDomainDataSetTypeSchema.SchemaInfo` is a serialized copy of the product's field table. A
	// field's record reads: FieldTypeID (int32), FieldDataType (int32), its name, its category
	// ("category..."), a resource key, one more string, then StorageUnit (int32). Strings carry a
	// one-byte length. OBSERVED in all five sample files, schema 1.0.38 and 1.0.44.
	function schemaUnits(blob) {
		var out = {};
		if (!blob || !blob.length) { return out; }
		var b = blob, n = b.length, i, len, name, p, q, k, s, dv;
		dv = new DataView(b.buffer, b.byteOffset || 0, b.byteLength);
		function str(at) {
			var l = b[at], t = '', j;
			if (at + 1 + l > n) { return null; }
			for (j = 0; j < l; j++) { t += String.fromCharCode(b[at + 1 + j]); }
			return { s: t, next: at + 1 + l };
		}
		// Find every "<len>category" and read back to the name before it.
		for (i = 9; i < n - 9; i++) {
			// 'c' 'a' 't' 'e' 'g' 'o' 'r' 'y' at i+1 with a length byte at i
			if (b[i + 1] !== 99 || b[i + 2] !== 97 || b[i + 3] !== 116 || b[i + 4] !== 101 || b[i + 5] !== 103 ||
				b[i + 6] !== 111 || b[i + 7] !== 114 || b[i + 8] !== 121) { continue; }
			// the name ends right before i: scan back for a length byte that fits
			for (len = 1; len < 120 && i - len - 1 >= 8; len++) {
				p = i - len - 1;
				if (b[p] !== len) { continue; }
				name = '';
				for (k = 0; k < len; k++) {
					var ch = b[p + 1 + k];
					if (ch < 48 || ch > 122) { name = null; break; }
					name += String.fromCharCode(ch);
				}
				if (!name || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) { continue; }
				q = str(i);            // the category
				if (!q) { break; }
				s = str(q.next);       // the resource key
				if (!s) { break; }
				s = str(s.next);       // one more string
				if (!s || s.next + 4 > n) { break; }
				if (out[name] === undefined) { out[name] = dv.getInt32(s.next, true); }
				break;
			}
		}
		return out;
	}

	// ---- reading the database --------------------------------------------------------------------

	function fail(code, message) { var e = new Error(message); e.code = code; return e; }

	// The tables that make a file a Bentley model. A file without them is SQLite, not WaterGEMS.
	var REQUIRED = ['HMIScenario', 'HMIModelingElement', 'HMIDomainElement', 'HMIAlternative',
		'HMIScenarioAlternative', 'BaseLink_HMIDataSetTopology_Data'];

	// Bentley's alternative types (HMIScenarioAlternative.AlternativeTypeID), OBSERVED by the labels
	// of the Base alternatives, to this page's categories (dev/scenario-alternatives.md). Geometry
	// is a category of its own there; here a node's x and y are Physical.
	var ALT_TYPE_NAME = { 1: 'Geometry', 2: 'Topology', 3: 'Active Topology', 4: 'Physical', 14: 'SCADA',
		20: 'Demand', 21: 'Initial Settings', 22: 'Operational', 23: 'Age', 24: 'Constituent', 25: 'Trace',
		26: 'Fire Flow', 28: 'Energy Cost', 29: 'Pressure Dependent Demand', 31: 'Flushing', 50: 'Transient',
		51: 'Failure History', 100: 'User Data Extensions' };

	// The columns this reader reads, by table, so everything else that holds data can be named in
	// the report as not read. A table absent here and holding rows for a live element is reported.
	var READ_TABLES = {
		IdahoDemandNode_Demand_UnitDemandLoadCollection: 1,
		BaseIdahoNode_Physical_Data: 1, BaseIdahoNode_HmiDataSetGeometry_Data: 1, BaseIdahoNode_HMIActiveTopology_Data: 1,
		BaseLink_HMIDataSetTopology_Data: 1, BaseLink_HmiDataSetGeometry_Data: 1, BaseLink_Physical_Data: 1,
		BaseLink_HMIActiveTopology_Data: 1, IdahoPipe_Physical_Data: 1, IdahoPipe_InitialSettings_Data: 1,
		BaseDirectedNode_HMIDataSetTopology_Data: 1, BaseDirectedNode_HmiDataSetGeometry_Data: 1,
		BaseDirectedNode_Physical_Data: 1, BaseDirectedNode_HMIActiveTopology_Data: 1,
		IdahoDemandNode_Demand_Data: 1, IdahoDemandNode_Demand_DemandCollection: 1,
		IdahoReservoir_Physical_Data: 1, ConventionalTank_Physical_Data: 1, ConventionalTank_InitialSettings_Data: 1,
		ConventionalTank_Physical_DepthRatioVolumeRatioCurve: 1, IdahoTank_Physical_Data: 1,
		BasePump_InitialSettings_Data: 1, StandardPump_Physical_Data: 1,
		BaseValve_Physical_Data: 1, BaseValve_InitialSettings_Data: 1, PressureValve_InitialSettings_Data: 1,
		PressureValve_InitialSettings_PressureValveSetting_ValvePressureType: 1,
		PressureValve_InitialSettings_PressureValveSetting_ValveHGLType: 1, PressureValve_Physical_Data: 1,
		PRV_Physical_Data: 1, PSV_Physical_Data: 1, PBV_Physical_Data: 1, FCV_Physical_Data: 1, FCV_InitialSettings_Data: 1,
		TCV_Physical_Data: 1, TCV_InitialSettings_Data: 1, GPV_Physical_Data: 1, IdahoFireFlowNode_Physical_Data: 1
	};

	function Model(db) {
		var self = this;
		this.db = db;
		this.cols = {};          // table -> {column: true}
		this.rowCount = {};
		(db.tables || []).forEach(function (t) {
			var c = {};
			t.columns.forEach(function (col) { c[col.name] = true; });
			self.cols[t.name] = c;
			self.rowCount[t.name] = t.rowCount;
		});
		this.cache = {};
	}
	Model.prototype.has = function (t) { return !!this.cols[t]; };
	Model.prototype.rows = function (sql, params) {
		var r = this.db.select(sql, params), out = [], i, j, o;
		for (i = 0; i < r.rows.length; i++) {
			o = {};
			for (j = 0; j < r.columns.length; j++) { o[r.columns[j]] = r.rows[i][j]; }
			out.push(o);
		}
		return out;
	};
	Model.prototype.all = function (t) {
		if (!this.has(t)) { return []; }
		if (!this.cache[t]) { this.cache[t] = this.rows('SELECT * FROM "' + t.replace(/"/g, '""') + '"'); }
		return this.cache[t];
	};

	/**
	 * Read the model. `opts`:
	 *   flowUnits   the EPANET flow keyword to write ('LPS', 'GPM', ...); default from `display`, else 'LPS'
	 *   display     wtgDisplayUnits() of the `.wtg` beside the database, or null when it was not given
	 *   fileName    for the report only
	 * Returns { ok: true, inp, notes, scenarios, alternatives, inactive, counts, flowUnits, unitSystem,
	 *           baseScenario, activeScenario } or { ok: false, code, message }.
	 */
	function read(db, opts) {
		opts = opts || {};
		var M = new Model(db), notes = [], k;
		for (k = 0; k < REQUIRED.length; k++) {
			if (!M.has(REQUIRED[k])) {
				return { ok: false, code: 'not-wtg', message: 'This SQLite database is not a WaterCAD or WaterGEMS model: it has no ' + REQUIRED[k] + ' table.' };
			}
		}
		function note(code, ids, detail) {
			var i;
			for (i = 0; i < notes.length; i++) {
				if (notes[i].code === code && notes[i].detail === (detail === undefined ? null : detail)) {
					notes[i].ids = notes[i].ids.concat(ids || []);
					return;
				}
			}
			notes.push({ code: code, ids: (ids || []).slice(), detail: detail === undefined ? null : detail, group: null });
		}

		// ---- flow keyword and unit system
		var display = opts.display || null;
		var flowKw = opts.flowUnits || (display && flowKeywordFor(display.flow)) || 'LPS';
		var FLOW = EngCalcs.lpnInpFlowUnits || {};
		if (!FLOW[flowKw]) { flowKw = 'LPS'; }
		var us = FLOW[flowKw] && FLOW[flowKw].system === 'us';
		var flowToSI = FLOW[flowKw] ? FLOW[flowKw].toSI : 1e-3;
		var T = us ? { len: 'ft', diam: 'in', press: 'psi', vol: 'ft3', area: 'ft2', rough: 'mft' }
			: { len: 'm', diam: 'mm', press: 'm', vol: 'm3', area: 'm2', rough: 'mm' };
		if (!display) {
			note('wtg-units-assumed', [flowKw]);
		} else {
			var words = us ? US_WORDS : SI_WORDS, differ = [];
			if (display.flow && flowKeywordFor(display.flow) && flowKeywordFor(display.flow) !== flowKw) { differ.push('flow: ' + display.flow.replace(/^flow:/, '')); }
			if (display.flow && /cubicmeters?persecond/i.test(display.flow)) { differ.push('flow: ' + display.flow.replace(/^flow:/, '')); }
			[['length', 'length'], ['elevation', 'elevation'], ['diameter', 'diameter'], ['pressure', 'pressure'], ['coordinate', 'coordinate']].forEach(function (p) {
				var shown = display[p[0]];
				if (shown && shown !== words[p[1]] && !(p[1] === 'pressure' && /metersOfH2O|length:meters/.test(shown) && !us)) {
					differ.push(p[0] + ': ' + shown.replace(/^[a-z]+:/, ''));
				}
			});
			if (differ.length) { note('wtg-units-differ', differ); }
		}
		note('wtg-converted', []);

		// ---- storage units, from the file's own schema
		var schemaRow = M.has('HMIDomainDataSetTypeSchema') ? M.rows('SELECT SchemaInfo FROM HMIDomainDataSetTypeSchema ORDER BY DomainDataSetTypeID LIMIT 1') : [];
		var declared = schemaUnits(schemaRow.length ? schemaRow[0].SchemaInfo : null);
		var assumedFields = {}, unknownFields = {};
		function storeOf(field) {
			var code = declared[field];
			if (code === undefined) {
				code = EXPECT[field];
				if (code === undefined) { return null; }
				assumedFields[field] = true;
			}
			var kind = STORE_KIND[code];
			if (!kind) { unknownFields[field + ' (' + code + ')'] = true; return null; }
			return kind;
		}
		// A stored number in the target unit, or null if its unit is not one this file knows.
		function conv(v, field, target) {
			if (v === null || v === undefined) { return null; }
			var s = storeOf(field), f;
			if (s === null) { return null; }
			if (target === 'flow') { f = factor(s, 'flow', flowToSI); } else { f = factor(s, target); }
			if (f === undefined) { unknownFields[field + ' (' + s + ' to ' + target + ')'] = true; return null; }
			return v * f;
		}

		// ---- elements, scenarios and alternatives
		var labels = {}, kindOfModeling = {};
		M.all('HMIModelingElement').forEach(function (r) { labels[r.ElementID] = r.Label; kindOfModeling[r.ElementID] = r.ElementType; });
		var live = {};
		M.all('HMIDomainElement').forEach(function (r) { if (!r.IsDeleted) { live[r.DomainElementID] = r.DomainElementTypeID; } });
		var supportLive = {};
		M.all('HMISupportElement').forEach(function (r) { if (!r.IsDeleted) { supportLive[r.SupportElementID] = r.SupportElementTypeID; } });

		var alts = {};
		M.all('HMIAlternative').forEach(function (r) {
			alts[r.AlternativeID] = { id: r.AlternativeID, parent: r.ParentID, type: r.AlternativeTypeID, deleted: !!r.IsDeleted, name: labels[r.AlternativeID] };
		});
		var scen = {};
		M.all('HMIScenario').forEach(function (r) {
			if (!r.IsDeleted) { scen[r.ScenarioID] = { id: r.ScenarioID, parent: r.ParentID, name: labels[r.ScenarioID], picks: {}, local: {}, calc: {} }; }
		});
		M.all('HMIScenarioAlternative').forEach(function (r) {
			var s = scen[r.ScenarioID];
			if (s) { s.picks[r.AlternativeTypeID] = r.AlternativeID; s.local[r.AlternativeTypeID] = !!r.IsLocal; }
		});
		if (M.has('HMIScenarioCalculationOptions')) {
			M.all('HMIScenarioCalculationOptions').forEach(function (r) {
				var s = scen[r.ScenarioID];
				if (s) { s.calc[r.NumericalEngineTypeID] = { id: r.CalculationOptionsID, local: !!r.IsLocal }; }
			});
		}
		if (!Object.keys(scen).length) { return { ok: false, code: 'not-wtg', message: 'This model has no scenario.' }; }
		// A pick marked inherited (IsLocal 0) is its parent scenario's, resolved up the tree. In every
		// sample the stored AlternativeID already equals the parent's; resolving says what we mean.
		function resolvedPick(s, type, depth) {
			if (!s || (depth || 0) > 64) { return null; }
			if (s.local[type] === false && s.parent && scen[s.parent]) { return resolvedPick(scen[s.parent], type, (depth || 0) + 1); }
			return s.picks[type] === undefined ? null : s.picks[type];
		}

		var activeId = null;
		if (M.has('HMIDomainDataSet')) {
			var ds = M.all('HMIDomainDataSet');
			if (ds.length) { activeId = ds[0].ActiveScenarioID; }
		}
		// BASE is the root of the active scenario's tree: the scenario WaterGEMS was showing, followed
		// up to its root. With no active scenario, the root with the lowest ID.
		var baseId = null, walk, guard = 0;
		if (activeId && scen[activeId]) {
			walk = scen[activeId];
			while (walk.parent && scen[walk.parent] && guard++ < 64) { walk = scen[walk.parent]; }
			baseId = walk.id;
		} else {
			Object.keys(scen).map(Number).sort(function (a, b) { return a - b; }).forEach(function (id) {
				if (baseId === null && !scen[id].parent) { baseId = id; }
			});
			if (baseId === null) { baseId = Number(Object.keys(scen)[0]); }
		}

		// ---- per-table indexes: element -> alternative -> row, and each table's alternative type
		var idx = {}, tableType = {};
		function index(t) {
			if (idx[t]) { return idx[t]; }
			var map = {}, coll = !!(M.cols[t] && M.cols[t].ItemID);
			M.all(t).forEach(function (r) {
				var e = r.DomainElementID, a = r.AlternativeID, m;
				if (e === undefined || a === undefined) { return; }
				if (tableType[t] === undefined && alts[a]) { tableType[t] = alts[a].type; }
				m = map[e] || (map[e] = {});
				if (coll) { (m[a] || (m[a] = [])).push(r); } else { m[a] = r; }
			});
			if (coll) {
				Object.keys(map).forEach(function (e) {
					Object.keys(map[e]).forEach(function (a) { map[e][a].sort(function (x, y) { return x.ItemID - y.ItemID; }); });
				});
			}
			idx[t] = map;
			return map;
		}
		// Which _Data tables carry a column (a column can move between schema versions: a pipe's
		// user length is in BaseLink_Physical_Data in 10.x and IdahoPipe_Physical_Data in 8.11).
		var colTables = {};
		Object.keys(M.cols).forEach(function (t) {
			if (!M.cols[t].DomainElementID || !M.cols[t].AlternativeID) { return; }
			Object.keys(M.cols[t]).forEach(function (c) { (colTables[c] || (colTables[c] = [])).push(t); });
		});
		// The row of table `t` for element `e` as scenario `s` sees it: the scenario's alternative for
		// the table's type, then that alternative's parents. Deleted alternatives are not skipped
		// here: a scenario can only name a live one, and the chain is the file's.
		function rowAt(t, e, s) {
			var map = index(t)[e], type, a, g = 0;
			if (!map) { return null; }
			type = tableType[t];
			a = type === undefined ? null : resolvedPick(s, type);
			while (a !== null && a !== undefined && g++ < 64) {
				if (map[a] !== undefined) { return { row: map[a], alt: a }; }
				a = alts[a] ? alts[a].parent : null;
			}
			return null;
		}
		function get(e, s, column) {
			var ts = colTables[column] || [], i, hit;
			for (i = 0; i < ts.length; i++) {
				hit = rowAt(ts[i], e, s);
				if (hit && hit.row[column] !== undefined) { return hit.row[column]; }
			}
			return undefined;
		}
		function getHit(e, s, column) {
			var ts = colTables[column] || [], i, hit;
			for (i = 0; i < ts.length; i++) {
				hit = rowAt(ts[i], e, s);
				if (hit && hit.row[column] !== undefined) { return hit; }
			}
			return null;
		}
		// A collection's rows at the alternative where its owner row was found.
		function collection(t, e, ownerHit) {
			if (!ownerHit || !M.has(t)) { return []; }
			var m = index(t)[e];
			return (m && m[ownerHit.alt]) || [];
		}

		// ---- classes: which element is what, from the one-column class tables
		var classesOf = {};
		Object.keys(M.cols).forEach(function (t) {
			// A class table holds DomainElementID and no AlternativeID (IdahoPipe also carries
			// AddedForINPConversion); the per-alternative data tables all have AlternativeID.
			var c = M.cols[t];
			if (c.DomainElementID && !c.AlternativeID && !c.ItemID && Object.keys(c).length <= 2) {
				M.all(t).forEach(function (r) { (classesOf[r.DomainElementID] || (classesOf[r.DomainElementID] = {}))[t] = true; });
			}
		});
		function is(e, cls) { return !!(classesOf[e] && classesOf[e][cls]); }
		function specificClass(e) {
			var best = null;
			Object.keys(classesOf[e] || {}).forEach(function (c) {
				if (best === null || (M.rowCount[c] || 0) < (M.rowCount[best] || 0)) { best = c; }
			});
			return best || ('type ' + live[e]);
		}
		var VALVE_TYPES = ['PRV', 'PSV', 'PBV', 'FCV', 'TCV', 'GPV'];

		// ---- IDs: EPANET's rules (no spaces or semicolons, 31 characters), unique per namespace
		var nodeIds = {}, linkIds = {}, curveIds = {}, patIds = {}, renamed = [];
		function makeId(label, fallback, space) {
			var raw = (label === null || label === undefined || label === '') ? fallback : String(label);
			var id = raw.replace(/[\s;"]+/g, '_');
			if (id.length > 31) { id = id.slice(0, 31); }
			var stem = id, n = 2;
			while (space[id]) { var suf = '_' + n++; id = stem.slice(0, 31 - suf.length) + suf; }
			space[id] = true;
			if (id !== raw) { renamed.push(raw + ' (' + id + ')'); }
			return id;
		}

		var S = scen[baseId];
		var picksOf = function (s) {
			var out = {};
			Object.keys(ALT_TYPE_NAME).forEach(function (t) { out[t] = resolvedPick(s, Number(t)); });
			return out;
		};

		// ---- the network as one scenario sees it, in storage units
		function network(s) {
			var net = { nodes: [], links: [], directed: [], skipped: [], inactive: [], tankInlets: [], tankDemands: [],
				valveStatusGuess: [], pumpDefs: {}, unread: [], emitters: [], customerDemands: [], unitDemands: [], settingPatterns: [] };
			var ids = Object.keys(live).map(Number).sort(function (a, b) { return a - b; });
			ids.forEach(function (e) {
				var lab = labels[e];
				if (is(e, 'IdahoPipe')) { net.links.push({ e: e, label: lab, kind: 'pipe' }); return; }
				if (is(e, 'IdahoJunction')) { net.nodes.push({ e: e, label: lab, kind: 'junction' }); return; }
				if (is(e, 'IdahoReservoir')) { net.nodes.push({ e: e, label: lab, kind: 'reservoir' }); return; }
				if (is(e, 'ConventionalTank')) { net.nodes.push({ e: e, label: lab, kind: 'tank' }); return; }
				if (is(e, 'StandardPump')) { net.directed.push({ e: e, label: lab, kind: 'pump' }); return; }
				if (is(e, 'BaseValve')) {
					var vt = null;
					VALVE_TYPES.forEach(function (v) { if (is(e, v)) { vt = v; } });
					if (vt) { net.directed.push({ e: e, label: lab, kind: 'valve', vtype: vt }); return; }
				}
				net.skipped.push(lab + ' (' + specificClass(e) + ')');
			});
			function active(e) {
				var v = get(e, s, 'HMIActiveTopologyIsActive');
				return v === undefined || v === null || !!v;
			}
			function geom(e) { return wkbPoints(get(e, s, 'HMIGeometry')); }
			function topo(e) {
				var hit = rowAt('BaseLink_HMIDataSetTopology_Data', e, s);
				return hit ? { from: hit.row.HMITopologyStartNodeID, to: hit.row.HMITopologyStopNodeID } : null;
			}
			net.nodes.forEach(function (n) {
				var g = geom(n.e);
				n.x = g ? g[0][0] : 0; n.y = g ? g[0][1] : 0;
				if (!g) { n.noGeom = true; }
				n.active = active(n.e);
				n.elev = get(n.e, s, 'Physical_NodeElevation');
				if (n.kind === 'junction' || n.kind === 'tank') {
					var dHit = getHit(n.e, s, 'DemandCollectionCount');
					n.demands = collection('IdahoDemandNode_Demand_DemandCollection', n.e, dHit).map(function (r) {
						return { q: r.DemandCollection_BaseFlow, pat: r.DemandCollection_DemandPattern };
					});
					// Unit demand loads (loading units times a unit load): each row stores its flow, which
					// is what EPANET needs. The units and the unit load themselves are not carried.
					var ul = collection('IdahoDemandNode_Demand_UnitDemandLoadCollection', n.e, dHit);
					if (ul.length) {
						ul.forEach(function (r) {
							n.demands.push({ q: r.UnitDemandLoadCollection_UnitDemandBaseFlow, pat: r.UnitDemandLoadCollection_UnitDemandPatternID,
								unit: true, field: 'UnitDemandLoadCollection_UnitDemandBaseFlow' });
						});
						net.unitDemands.push(n.label);
					}
					if (dHit && dHit.row.CustomerDemandCollection) { net.customerDemands.push(n.label); }
					var em = get(n.e, s, 'Physical_EmitterCoefficient');
					if (em) { net.emitters.push(n.label); }
				}
				if (n.kind === 'reservoir') { n.pattern = get(n.e, s, 'Physical_HglPattern'); }
				if (n.kind === 'tank') {
					n.base = get(n.e, s, 'Physical_TankBaseElevation');
					n.rangeType = get(n.e, s, 'OperatingRangeType');
					n.maxElev = get(n.e, s, 'Physical_TankMaximumElevation');
					n.minElev = get(n.e, s, 'Physical_TankMinimumElevation');
					n.maxLevel = get(n.e, s, 'Physical_TankMaximumLevel');
					n.minLevel = get(n.e, s, 'Physical_TankMinimumLevel');
					n.initElev = get(n.e, s, 'InitialSettings_TankInitialElevation');
					n.initLevel = get(n.e, s, 'InitialSettings_TankInitialLevel');
					n.section = get(n.e, s, 'TankSection');
					n.diameter = get(n.e, s, 'CircularTankSectionType_TankDiameter');
					n.area = get(n.e, s, 'NonCircularTankSectionType_TankAverageArea');
					n.activeVol = get(n.e, s, 'VariableAreaTankSectionType_TotalActiveVolume');
					n.inactiveVol = get(n.e, s, 'Physical_InactiveVolume');
					var tHit = getHit(n.e, s, 'DepthRatioVolumeRatioCurveCount');
					n.curve = collection('ConventionalTank_Physical_DepthRatioVolumeRatioCurve', n.e, tHit).map(function (r) {
						return [r.DepthRatioVolumeRatioCurve_DepthRatio, r.DepthRatioVolumeRatioCurve_VolumeRatio];
					});
					if (get(n.e, s, 'Physical_HasSeparateInlet')) { net.tankInlets.push(n.label); }
					if ((n.demands || []).some(function (d) { return d.q; })) { net.tankDemands.push(n.label); }
				}
			});
			net.links.forEach(function (l) {
				var t = topo(l.e), g = geom(l.e);
				l.from = t ? t.from : null; l.to = t ? t.to : null;
				l.pts = g || null;
				l.active = active(l.e);
				l.userLen = !!get(l.e, s, 'Physical_IsUserDefinedLength');
				l.length = l.userLen ? get(l.e, s, 'Physical_UserDefinedLength') : get(l.e, s, 'HMIGeometryScaledLength');
				l.lengthField = l.userLen ? 'Physical_UserDefinedLength' : 'HMIGeometryScaledLength';
				l.diameter = get(l.e, s, 'Physical_PipeDiameter');
				l.hw = get(l.e, s, 'Physical_HazenWilliamsC');
				l.dw = get(l.e, s, 'Physical_DarcyWeisbachE');
				l.n = get(l.e, s, 'Physical_PipeMannings');
				l.cv = !!get(l.e, s, 'Physical_HasCheckValve');
				l.k = get(l.e, s, 'Physical_SpecifyLocalMinorLoss') === 0
					? get(l.e, s, 'Physical_CalculatedMinorLossCoefficient') : get(l.e, s, 'Physical_CompositeMinorLoss');
				l.kField = get(l.e, s, 'Physical_SpecifyLocalMinorLoss') === 0 ? 'Physical_CalculatedMinorLossCoefficient' : 'Physical_CompositeMinorLoss';
				l.closed = get(l.e, s, 'PipeStatus') === 1;
			});
			net.directed.forEach(function (d) {
				var g = geom(d.e), dn = rowAt('BaseDirectedNode_HMIDataSetTopology_Data', d.e, s);
				d.x = g ? g[0][0] : 0; d.y = g ? g[0][1] : 0;
				d.active = active(d.e);
				d.elev = get(d.e, s, 'Physical_NodeElevation');
				d.downLink = dn ? dn.row.HMITopologyDownstreamLinkID : null;
				if (d.kind === 'pump') {
					d.def = get(d.e, s, 'Physical_PumpDefinitionID');
					d.speed = get(d.e, s, 'InitialSettings_RelativeSpeedFactor');
					d.off = get(d.e, s, 'PumpStatus') === 1;
					d.vsp = !!get(d.e, s, 'Physical_IsVariableSpeedPump');
				} else {
					d.diameter = get(d.e, s, 'Physical_ValveDiameter');
					d.k = get(d.e, s, 'Physical_SpecifyLocalMinorLoss') === 0
						? get(d.e, s, 'Physical_CalculatedMinorLossCoefficient') : get(d.e, s, 'Physical_CompositeMinorLoss');
					d.kField = get(d.e, s, 'Physical_SpecifyLocalMinorLoss') === 0 ? 'Physical_CalculatedMinorLossCoefficient' : 'Physical_CompositeMinorLoss';
					d.status = get(d.e, s, 'ValveSetting');
					if (d.vtype === 'PRV' || d.vtype === 'PSV' || d.vtype === 'PBV') {
						d.settingKind = get(d.e, s, 'PressureValveSetting');
						d.pressure = get(d.e, s, 'ValvePressureType_ValvePressureSetting');
						d.hgl = get(d.e, s, 'ValveHGLType_ValveHGLSetting');
					} else if (d.vtype === 'FCV') {
						d.flow = get(d.e, s, 'InitialSettings_FlowSetting');
					} else if (d.vtype === 'TCV') {
						d.tcvType = get(d.e, s, 'TCVCoefficientType');
						d.tcvK = get(d.e, s, 'InitialSettings_HeadlossCoefficient');
					} else if (d.vtype === 'GPV') {
						d.gpvCurve = get(d.e, s, 'Physical_GpvHeadlossCurveID');
					}
					var sp = get(d.e, s, 'Physical_SettingPattern');
					if (sp) { net.settingPatterns.push(d.label); }
				}
			});
			net.links.forEach(function (l) { if (!l.active) { net.inactive.push(l.label); } });
			net.nodes.forEach(function (n) { if (!n.active) { net.inactive.push(n.label); } });
			net.directed.forEach(function (d) { if (!d.active) { net.inactive.push(d.label); } });
			return net;
		}

		var net = network(S);

		// ---- unit-converted values, as the `.inp` will state them
		var L = function (v, field) { var c = conv(v, field, T.len); return c === null ? null : num(c); };
		var D = function (v, field) { var c = conv(v, field, T.diam); return c === null ? null : num(c); };
		var Q = function (v, field) { var c = conv(v, field, 'flow'); return c === null ? null : num(c); };
		var V = function (v, field) { var c = conv(v, field, T.vol); return c === null ? null : num(c); };
		var P = function (v, field) { var c = conv(v, field, T.press); return c === null ? null : num(c); };
		var U = function (v) { return (v === null || v === undefined) ? null : num(v); };

		// Coordinates: in the database's length unit (feet) unless a spatial reference is stated.
		var srs = '';
		if (M.has('IdahoDataSet')) {
			var idr = M.all('IdahoDataSet');
			if (idr.length && idr[0].HMIDataSetGeometrySpatialReference) { srs = String(idr[0].HMIDataSetGeometrySpatialReference); }
		}
		if (srs) { note('wtg-srs', [srs]); }
		var coordTarget = us ? 'ft' : 'm';
		if (display && display.coordinate) {
			if (/feet/i.test(display.coordinate)) { coordTarget = 'ft'; } else if (/meters/i.test(display.coordinate)) { coordTarget = 'm'; }
		}
		var XY = function (v) { return numXY(srs ? v : v * factor('ft', coordTarget)); };

		// ---- patterns
		var patterns = {}, patternStep = null, patternStarts = {}, patIrregular = [], patContinuous = [], patWeekly = [];
		function gcd(a, b) { a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b)); while (b) { var t = a % b; a = b; b = t; } return a; }
		var patRows = M.all('IdahoPattern').filter(function (r) { return supportLive[r.SupportElementID] !== undefined; });
		var patPoints = {};
		M.all('IdahoPattern_PatternCurve').forEach(function (r) {
			(patPoints[r.SupportElementID] || (patPoints[r.SupportElementID] = [])).push(r);
		});
		patRows.forEach(function (r) {
			var pts = (patPoints[r.SupportElementID] || []).slice().sort(function (a, b) { return a.ItemID - b.ItemID; });
			var sid = r.SupportElementID, times = pts.map(function (p) { return p.PatternCurve_TimeFromStart; });
			var weekly = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'January', 'Feburary',
				'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].some(function (d) {
				var v = r['IdahoPattern_' + d + 'Multiplier'];
				return v !== undefined && v !== null && v !== 1;
			});
			if (weekly) { patWeekly.push(labels[sid]); }
			if (r.PatternFormat === 1) { patContinuous.push(labels[sid]); }
			patterns[sid] = { sid: sid, label: labels[sid], start: r.IdahoPattern_PatternStartingMultiplier, pts: pts, times: times, startTime: r.IdahoPattern_PatternStartTime };
			times.forEach(function (t) { if (t > 0) { patternStep = patternStep === null ? Math.round(t) : gcd(patternStep, t); } });
		});
		var usedPatterns = {};
		function patternId(sid) {
			if (sid === null || sid === undefined || !patterns[sid]) { return ''; }
			usedPatterns[sid] = true;
			if (!patterns[sid].id) { patterns[sid].id = makeId(patterns[sid].label, 'PAT-' + sid, patIds); }
			return patterns[sid].id;
		}

		// ---- calculation options (the Base scenario's EPANET engine)
		var eng = null, engFor = function () { return null; };
		if (M.has('EpaNetEngine')) {
			var engById = {};
			M.all('EpaNetEngine').forEach(function (r) { engById[r.CalculationOptionsID] = r; });
			Object.keys(S.calc).forEach(function (t) { var c = S.calc[t]; if (engById[c.id]) { eng = engById[c.id]; } });
			engFor = function (sc) {
				var found = null, g = 0, w = sc;
				while (w && !found && g++ < 64) {
					Object.keys(w.calc).forEach(function (t) { if (engById[w.calc[t].id] && !found) { found = engById[w.calc[t].id]; } });
					w = !found && w.parent ? scen[w.parent] : null;
				}
				return found;
			};
		}
		var eps = null;
		if (eng && M.has('EpaNetEngine_TimeAnalysisType_EpsType')) {
			M.all('EpaNetEngine_TimeAnalysisType_EpsType').forEach(function (r) { if (r.CalculationOptionsID === eng.CalculationOptionsID) { eps = r; } });
		}
		// ---- demand adjustments. WaterGEMS adjusts normal demands and unit demand loads separately; one
		// adjustment of everything (scope 0, no pattern) by operation 2 (multiply) is EPANET's Demand
		// Multiplier. Operation 2 meaning "multiply" is read off two real models (1.8 and 3.0 against
		// WaterCAD's own average, maximum-day and peak-hour totals). Anything else is reported.
		function adjustOf(engRow) {
			var res = { normal: 1, unit: 1, stated: false, bad: false };
			if (!engRow) { return res; }
			[['EpaNetEngine_NormalDemandAdjustmentsCollection', 'Normal', 'normal'], ['EpaNetEngine_UnitDemandAdjustmentsCollection', 'Unit', 'unit']].forEach(function (d) {
				if (!M.has(d[0])) { return; }
				var rows = M.all(d[0]).filter(function (r) { return r.CalculationOptionsID === engRow.CalculationOptionsID; });
				rows.forEach(function (r) {
					var v = r[d[1] + 'DemandAdjustmentsCollection_' + d[1] + 'DemandAdjustmentValue'];
					var scope = r[d[1] + 'DemandAdjustmentsCollection_' + d[1] + 'DemandScopeID'];
					var pat = r[d[1] + 'DemandAdjustmentsCollection_DemandPatternID'];
					var id = r[d[1] + 'DemandAdjustmentsCollection_' + d[1] + 'DemandID'];
					if (rows.length === 1 && !scope && !pat && !id && r[d[1] + 'DemandOperation'] === 2 && typeof v === 'number') { res[d[2]] = v; res.stated = true; }
					else { res.bad = true; }
				});
			});
			return res;
		}
		var adjBase = adjustOf(eng);
		var baseHasUnit = net.nodes.some(function (n) { return n.demands && n.demands.some(function (d) { return d.unit && d.q; }); });
		var baseHasNormal = net.nodes.some(function (n) { return n.demands && n.demands.some(function (d) { return !d.unit && d.q; }); });
		// The one multiplier EPANET has: the unit adjustment when every demand is a unit load, else the
		// normal one, with the unit loads scaled by the ratio so each total stays WaterGEMS's.
		function multOf(a, hasUnit, hasNormal) { return hasUnit && !hasNormal ? a.unit : a.normal; }
		var multBase = multOf(adjBase, baseHasUnit, baseHasNormal);
		var unitScale = baseHasUnit && baseHasNormal && multBase ? adjBase.unit / multBase : 1;
		var method = eng ? eng.FrictionMethod : 1;
		var headloss = method === 0 ? 'D-W' : method === 2 ? 'C-M' : 'H-W';
		if (method !== 0 && method !== 1 && method !== 2 && eng) { note('wtg-friction-unknown', [String(method)]); }

		// ---- build the `.inp`
		var out = [], nodeIdOf = {}, linkIdOf = {}, coords = [], verts = [], statusLines = [], controls = [];
		var junctions = [], reservoirs = [], tanks = [], pipes = [], pumps = [], valves = [], demandsSec = [], curves = [], energy = [];
		var counts = { junctions: 0, reservoirs: 0, tanks: 0, pipes: 0, pumps: 0, valves: 0, splitJunctions: 0 };
		var unconverted = [];
		function need(v, what, label) {
			if (v === null) { unconverted.push(label + ': ' + what); return '0'; }
			return v;
		}

		net.nodes.forEach(function (n) {
			n.id = makeId(n.label, n.kind.toUpperCase() + '-' + n.e, nodeIds);
			nodeIdOf[n.e] = n.id;
			coords.push(' ' + n.id + '\t' + XY(n.x) + '\t' + XY(n.y));
			if (n.kind === 'junction') {
				counts.junctions++;
				var d0 = (n.demands || [])[0];
				junctions.push(' ' + n.id + '\t' + need(L(n.elev, 'Physical_NodeElevation'), 'elevation', n.label) + '\t' +
					(d0 ? need(Q(d0.q * (d0.unit ? unitScale : 1), d0.field || 'DemandCollection_BaseFlow'), 'demand', n.label) : '0') + '\t' + (d0 ? patternId(d0.pat) : '') + '\t;');
				if (n.demands && n.demands.length > 1) {
					n.demands.forEach(function (d) {
						demandsSec.push(' ' + n.id + '\t' + need(Q(d.q * (d.unit ? unitScale : 1), d.field || 'DemandCollection_BaseFlow'), 'demand', n.label) + '\t' + patternId(d.pat) + '\t;');
					});
				}
			} else if (n.kind === 'reservoir') {
				counts.reservoirs++;
				reservoirs.push(' ' + n.id + '\t' + need(L(n.elev, 'Physical_NodeElevation'), 'head', n.label) + '\t' + patternId(n.pattern) + '\t;');
			} else {
				counts.tanks++;
				var lv = function (elevField, levelField, elevV, levelV) {
					// OperatingRangeType 0 states elevations, 1 levels (OBSERVED 0 in every sample).
					if (n.rangeType === 1) { return L(levelV, levelField); }
					var e1 = conv(elevV, elevField, T.len), b1 = conv(n.base, 'Physical_TankBaseElevation', T.len);
					return (e1 === null || b1 === null) ? null : num(e1 - b1);
				};
				var init = lv('InitialSettings_TankInitialElevation', 'InitialSettings_TankInitialLevel', n.initElev, n.initLevel);
				var minL = lv('Physical_TankMinimumElevation', 'Physical_TankMinimumLevel', n.minElev, n.minLevel);
				var maxL = lv('Physical_TankMaximumElevation', 'Physical_TankMaximumLevel', n.maxElev, n.maxLevel);
				var diam = D(n.diameter, 'CircularTankSectionType_TankDiameter'), volCurve = '';
				diam = conv(n.diameter, 'CircularTankSectionType_TankDiameter', T.len);
				diam = diam === null ? null : num(diam);
				if (n.section === 1) {
					var a = conv(n.area, 'NonCircularTankSectionType_TankAverageArea', T.area);
					diam = a === null ? null : num(Math.sqrt(4 * a / Math.PI));
					note('wtg-tank-area', [n.label]);
				} else if (n.section === 2) {
					// Depth and volume ratios of the active range (OBSERVED: ratio 1 at the maximum level,
					// the volume ratio times the total active volume giving the .inp's volumes).
					var minN = Number(minL), maxN = Number(maxL);
					var act = conv(n.activeVol, 'VariableAreaTankSectionType_TotalActiveVolume', T.vol);
					var inact = conv(n.inactiveVol || 0, 'Physical_InactiveVolume', T.vol) || 0;
					if (act !== null && n.curve.length) {
						volCurve = makeId(n.label, 'TANK-' + n.e, curveIds);
						curves.push(';VOLUME: ' + n.label);
						n.curve.forEach(function (p) {
							curves.push(' ' + volCurve + '\t' + num(minN + p[0] * (maxN - minN)) + '\t' + num(inact + p[1] * act));
						});
					}
				} else if (n.section !== 0 && n.section !== null && n.section !== undefined) {
					note('wtg-tank-section', [n.label + ' (' + n.section + ')']);
				}
				tanks.push(' ' + n.id + '\t' + need(L(n.base, 'Physical_TankBaseElevation'), 'base elevation', n.label) + '\t' +
					need(init, 'initial level', n.label) + '\t' + need(minL, 'minimum level', n.label) + '\t' + need(maxL, 'maximum level', n.label) + '\t' +
					need(diam, 'diameter', n.label) + '\t' + need(V(n.inactiveVol || 0, 'Physical_InactiveVolume'), 'inactive volume', n.label) + '\t' + volCurve + '\t;');
			}
		});

		// Pumps and valves are NODES in WaterGEMS, each between an upstream and a downstream pipe.
		// Each becomes a link between two new junctions placed a quarter of the way along those pipes'
		// end segments, named after it with -U and -D, at its elevation; the pipes keep their lengths.
		var splitIds = [], splitAt = {}, curveOfDef = {};
		net.directed.forEach(function (d) {
			var adj = net.links.filter(function (l) { return l.from === d.e || l.to === d.e; });
			var down = adj.filter(function (l) { return l.e === d.downLink; })[0];
			var up = adj.filter(function (l) { return l !== down; })[0];
			if (adj.length !== 2 || !down || !up) {
				note('wtg-directed-unlinked', [d.label + ' (' + adj.length + ')']);
				d.unlinked = true;
				return;
			}
			function towards(l) {
				var pts = l.pts, near, far;
				if (!pts || pts.length < 2) { return [d.x, d.y]; }
				if (l.to === d.e) { near = pts[pts.length - 1]; far = pts[pts.length - 2]; } else { near = pts[0]; far = pts[1]; }
				return [near[0] + 0.25 * (far[0] - near[0]), near[1] + 0.25 * (far[1] - near[1])];
			}
			var uId = makeId(d.label + '-U', 'NODE-' + d.e + '-U', nodeIds), dId = makeId(d.label + '-D', 'NODE-' + d.e + '-D', nodeIds);
			var uPt = towards(up), dPt = towards(down);
			var elev = need(L(d.elev, 'Physical_NodeElevation'), 'elevation', d.label);
			junctions.push(' ' + uId + '\t' + elev + '\t0\t\t;');
			junctions.push(' ' + dId + '\t' + elev + '\t0\t\t;');
			coords.push(' ' + uId + '\t' + XY(uPt[0]) + '\t' + XY(uPt[1]));
			coords.push(' ' + dId + '\t' + XY(dPt[0]) + '\t' + XY(dPt[1]));
			counts.splitJunctions += 2;
			splitIds.push(d.label);
			splitAt[d.e] = { up: up.e, down: down.e, uId: uId, dId: dId, uPt: uPt, dPt: dPt };
			d.id = makeId(d.label, d.kind.toUpperCase() + '-' + d.e, linkIds);
			linkIdOf[d.e] = d.id;
			verts.push(' ' + d.id + '\t' + XY(d.x) + '\t' + XY(d.y));
			if (d.kind === 'pump') {
				counts.pumps++;
				var params = '';
				if (d.vsp) { note('wtg-pump-vsp', [d.label]); }
				var def = (M.all('IdahoPumpDefinition').filter(function (r) { return r.SupportElementID === d.def; })[0]) || null;
				if (!def) {
					note('wtg-pump-nodef', [d.label]);
				} else {
					if (curveOfDef[d.def] === undefined) {
						var pts = [], dt = def.PumpDefinitionType, cid = makeId(labels[d.def], 'PUMPDEF-' + d.def, curveIds);
						var pq = function (v, f) { return conv(v, f, 'flow'); }, ph = function (v, f) { return conv(v, f, T.len); };
						// PumpDefinitionType: 0 constant power, 1 design point, 2 standard three-point,
						// 3 standard extended, 4 custom extended, 5 multiple point (OBSERVED 1 and 5;
						// the rest by Bentley's own list order, dev/sqlite-reader.md).
						if (dt === 1) {
							pts = [[pq(def.DesignDischarge, 'DesignDischarge'), ph(def.DesignHead, 'DesignHead')]];
						} else if (dt === 2 || dt === 3) {
							pts = [[0, ph(def.ShutoffHead, 'ShutoffHead')], [pq(def.DesignDischarge, 'DesignDischarge'), ph(def.DesignHead, 'DesignHead')],
								[pq(def.MaxOperatingDischarge, 'MaxOperatingDischarge'), ph(def.MaxOperatingHead, 'MaxOperatingHead')]];
							if (dt === 3) { note('wtg-pump-extended', [labels[d.def]]); }
						} else if (dt === 4 || dt === 5) {
							pts = M.all('IdahoPumpDefinition_PumpCurve').filter(function (r) { return r.SupportElementID === d.def; })
								.sort(function (a, b) { return a.ItemID - b.ItemID; })
								.map(function (r) { return [pq(r.PumpCurve_Discharge, 'PumpCurve_Discharge'), ph(r.PumpCurve_Head, 'PumpCurve_Head')]; });
							if (dt === 4) { note('wtg-pump-extended', [labels[d.def]]); }
						} else {
							note('wtg-pump-deftype', [labels[d.def] + ' (' + dt + ')']);
						}
						if (pts.length && pts.every(function (p) { return p[0] !== null && p[1] !== null; })) {
							curves.push(';PUMP: ' + labels[d.def]);
							pts.forEach(function (p) { curves.push(' ' + cid + '\t' + num(p[0]) + '\t' + num(p[1])); });
							curveOfDef[d.def] = cid;
						} else {
							curveOfDef[d.def] = null;
						}
						// Efficiency: PumpEfficiencyType 0 constant (OBSERVED), written as WaterGEMS's own
						// export writes it, a one-point curve at the design flow.
						var effType = def.PumpEfficiencyType;
						if (effType === 0 && M.has('IdahoPumpDefinition_PumpEfficiencyType_ConstantEfficiencyType')) {
							var ce = M.all('IdahoPumpDefinition_PumpEfficiencyType_ConstantEfficiencyType').filter(function (r) { return r.SupportElementID === d.def; })[0];
							if (ce) {
								var eid = makeId(labels[d.def] + 'E', 'PUMPDEF-' + d.def + 'E', curveIds);
								var qd = pq(def.DesignDischarge, 'DesignDischarge');
								if (!qd && pts.length) { qd = pts[Math.min(1, pts.length - 1)][0]; }
								curves.push(';EFFICIENCY: ' + labels[d.def]);
								curves.push(' ' + eid + '\t' + num(qd || 1) + '\t' + num(ce.ConstantEfficiencyType_PumpEfficiency));
								curveOfDef[d.def + 'E'] = eid;
							}
						} else if (effType === 2 && M.has('IdahoPumpDefinition_DischargeEfficiencyCurve')) {
							var ec = M.all('IdahoPumpDefinition_DischargeEfficiencyCurve').filter(function (r) { return r.SupportElementID === d.def; })
								.sort(function (a, b) { return a.ItemID - b.ItemID; });
							if (ec.length) {
								var eid2 = makeId(labels[d.def] + 'E', 'PUMPDEF-' + d.def + 'E', curveIds);
								curves.push(';EFFICIENCY: ' + labels[d.def]);
								ec.forEach(function (r) { curves.push(' ' + eid2 + '\t' + num(pq(r.DischargeEfficiencyCurve_Discharge, 'DischargeEfficiencyCurve_Discharge')) + '\t' + num(r.DischargeEfficiencyCurve_Efficiency)); });
								curveOfDef[d.def + 'E'] = eid2;
							}
						} else if (effType !== undefined && effType !== null) {
							note('wtg-pump-efficiency', [labels[d.def] + ' (' + effType + ')']);
						}
					}
					if (curveOfDef[d.def]) { params = 'HEAD ' + curveOfDef[d.def]; } else { note('wtg-pump-nocurve', [d.label]); }
					if (curveOfDef[d.def + 'E']) { energy.push(' Pump \t' + d.id + '\tEfficiency\t' + curveOfDef[d.def + 'E']); }
				}
				if (d.speed !== undefined && d.speed !== null && d.speed !== 1) { params += (params ? '\t' : '') + 'SPEED ' + num(d.speed); }
				pumps.push(' ' + d.id + '\t' + uId + '\t' + dId + '\t' + params + '\t;');
				if (d.off) { statusLines.push(' ' + d.id + '\tClosed'); }
			} else {
				counts.valves++;
				var setting = '0';
				if (d.vtype === 'PRV' || d.vtype === 'PSV' || d.vtype === 'PBV') {
					// PressureValveSetting 0 states a pressure, 1 a hydraulic grade (OBSERVED 0).
					if (d.settingKind === 1) {
						var h = conv(d.hgl, 'ValveHGLType_ValveHGLSetting', T.len), z = conv(d.elev, 'Physical_NodeElevation', T.len);
						setting = (h === null || z === null) ? need(null, 'setting', d.label)
							: num(us ? (h - z) * BENTLEY_PSI_PER_M * FT : (h - z));
					} else {
						setting = need(P(d.pressure, 'ValvePressureType_ValvePressureSetting'), 'setting', d.label);
					}
				} else if (d.vtype === 'FCV') {
					setting = need(Q(d.flow, 'InitialSettings_FlowSetting'), 'setting', d.label);
				} else if (d.vtype === 'TCV') {
					if (d.tcvType !== 1) { note('wtg-tcv-coefficient', [d.label]); }
					setting = need(U(d.tcvK), 'setting', d.label);
				} else if (d.vtype === 'GPV') {
					var gp = M.has('GpvHeadlossCurve_GpvHeadlossFlowCurve') ? M.all('GpvHeadlossCurve_GpvHeadlossFlowCurve').filter(function (r) { return r.SupportElementID === d.gpvCurve; })
						.sort(function (a, b) { return a.ItemID - b.ItemID; }) : [];
					if (gp.length) {
						var gid = makeId(labels[d.gpvCurve], 'GPV-' + d.gpvCurve, curveIds);
						curves.push(';HEADLOSS: ' + labels[d.gpvCurve]);
						gp.forEach(function (r) { curves.push(' ' + gid + '\t' + num(conv(r.GpvHeadlossFlowCurve_GpvFlow, 'GpvHeadlossFlowCurve_GpvFlow', 'flow')) + '\t' + num(conv(r.GpvHeadlossFlowCurve_GpvHeadloss, 'GpvHeadlossFlowCurve_GpvHeadloss', T.len))); });
						setting = gid;
					} else { note('wtg-gpv-nocurve', [d.label]); }
				}
				valves.push(' ' + d.id + '\t' + uId + '\t' + dId + '\t' + need(D(d.diameter, 'Physical_ValveDiameter'), 'diameter', d.label) + '\t' +
					d.vtype + '\t' + setting + '\t' + need(U(d.k || 0), 'minor loss', d.label) + '\t;');
				// ValveSetting 0 active (no status), 1 inactive, which EPANET calls Open (OBSERVED: Tnet3's
				// TCVs and Tnet0's PRV against their `.inp` [STATUS] Open); 2 is taken to be Closed.
				if (d.status === 1) { statusLines.push(' ' + d.id + '\tOpen'); }
				else if (d.status === 2) { statusLines.push(' ' + d.id + '\tClosed'); net.valveStatusGuess.push(d.label); }
				else if (d.status !== 0 && d.status !== null && d.status !== undefined) { note('wtg-valve-status', [d.label + ' (' + d.status + ')']); }
			}
		});

		net.links.forEach(function (l) {
			var a = l.from, b = l.to, pts = l.pts ? l.pts.slice() : null, fromId, toId;
			fromId = splitAt[a] ? (splitAt[a].down === l.e ? splitAt[a].dId : splitAt[a].uId) : nodeIdOf[a];
			toId = splitAt[b] ? (splitAt[b].up === l.e ? splitAt[b].uId : splitAt[b].dId) : nodeIdOf[b];
			if (!fromId || !toId) {
				note('wtg-link-unjoined', [l.label]);
				return;
			}
			if (fromId === toId) { note('wtg-link-loop', [l.label]); return; }
			counts.pipes++;
			l.id = makeId(l.label, 'PIPE-' + l.e, linkIds);
			linkIdOf[l.e] = l.id;
			var rough = headloss === 'D-W' ? D(l.dw, 'Physical_DarcyWeisbachE') : headloss === 'C-M' ? U(l.n) : U(l.hw);
			if (headloss === 'D-W') { rough = (function () { var c = conv(l.dw, 'Physical_DarcyWeisbachE', T.rough); return c === null ? null : num(c); }()); }
			var status = l.closed ? 'Closed' : l.cv ? 'CV' : 'Open';
			if (l.closed && l.cv) { note('wtg-cv-closed', [l.label]); }
			pipes.push(' ' + l.id + '\t' + fromId + '\t' + toId + '\t' + need(L(l.length, l.lengthField), 'length', l.label) + '\t' +
				need(D(l.diameter, 'Physical_PipeDiameter'), 'diameter', l.label) + '\t' + need(rough, 'roughness', l.label) + '\t' +
				need(U(l.k || 0), 'minor loss', l.label) + '\t' + status + '\t;');
			if (pts && pts.length > 2) {
				pts.slice(1, -1).forEach(function (p) { verts.push(' ' + l.id + '\t' + XY(p[0]) + '\t' + XY(p[1])); });
			}
		});

		// ---- controls: simple clock-time conditions on a link's status (the one kind a sample has);
		// every other control is reported with WaterGEMS's own words for it.
		var ctlRows = M.all('IdahoControl').filter(function (r) { return supportLive[r.SupportElementID] !== undefined; });
		var opSet = null;
		if (M.has('Operational_SystemData')) {
			var opAlt = resolvedPick(S, 22);
			M.all('Operational_SystemData').forEach(function (r) { if (r.AlternativeID === opAlt) { opSet = r.Operational_IdahoControlSetID; } });
		}
		var ctlUnread = [];
		function one(t, sid) { return M.has(t) ? M.all(t).filter(function (r) { return r.SupportElementID === sid; })[0] : null; }
		ctlRows.forEach(function (c) {
			var words = c.IdahoControl_ExpandedDescription || c.IdahoControl_Description || labels[c.SupportElementID];
			if (opSet) { ctlUnread.push(words); return; }
			var cond = one('IdahoControlCondition', c.IdahoControl_ControlCondition), act = one('IdahoControlAction', c.IdahoControl_ControlAction);
			var sc = cond && cond.ConditionType === 0 ? one('IdahoControlCondition_ConditionType_SimpleConditionType', cond.SupportElementID) : null;
			var ck = sc && sc.SimpleConditionType === 2 && sc.CompareOperator === 0 ? one('IdahoControlCondition_SimpleConditionType_ClockTimeType', cond.SupportElementID) : null;
			var sa = act && act.ControlActionType === 0 ? one('IdahoControlAction_ControlActionType_SimpleActionType', act.SupportElementID) : null;
			var pa = sa ? one('IdahoControlAction_PipeAttribute_ActionPipeStatusType', act.SupportElementID) : null;
			var ptype = sa ? one('IdahoControlAction_ElementType_ControlActionPipeType', act.SupportElementID) : null;
			var hasElse = one('IdahoControl_ControlType_LogicalType', c.SupportElementID);
			// EPANET refuses a control on a check-valve pipe (its error 207), so one is reported instead.
			var target = sa ? net.links.filter(function (l) { return l.e === sa.SimpleActionType_Element; })[0] : null;
			if (ck && sa && pa && ptype && ptype.PipeAttribute === 0 && linkIdOf[sa.SimpleActionType_Element] && !(target && target.cv) && !(hasElse && hasElse.LogicalType_HasElse)) {
				var secs = ((Math.round(ck.ClockTimeType_ClockTime) % 86400) + 86400) % 86400;
				var hh = Math.floor(secs / 3600), mm = Math.floor((secs % 3600) / 60);
				controls.push(' LINK ' + linkIdOf[sa.SimpleActionType_Element] + ' ' + (pa.ActionPipeStatus === 1 ? 'CLOSED' : 'OPEN') +
					// EPANET wants the twelve-hour clock with AM or PM here (its own writer's form).
					' AT CLOCKTIME ' + (hh % 12 === 0 ? 12 : hh % 12) + ':' + (mm < 10 ? '0' : '') + mm + (hh < 12 ? ' AM' : ' PM'));
			} else {
				ctlUnread.push(words);
			}
		});
		if (ctlUnread.length) { note('wtg-controls-unread', ctlUnread); }

		// ---- patterns, written last so only the referenced ones (and all live ones) appear
		var patLines = [], startOffsets = {};
		var analysisStart = eng ? eng.EpaNetEngine_AnalysisStartTime : null;
		patRows.forEach(function (r) {
			var p = patterns[r.SupportElementID], step = patternStep || 3600, mult = [], i, t, j;
			patternId(r.SupportElementID);
			if (!p.pts.length) {
				mult = [p.start];
			} else {
				var total = p.times[p.times.length - 1];
				var at = function (time) {
					// Stepwise: the multiplier of the last point at or before `time`.
					var m = p.start;
					for (j = 0; j < p.times.length; j++) { if (p.times[j] <= time + 1e-6) { m = p.pts[j].PatternCurve_Multiplier; } }
					return m;
				};
				for (t = 0; t < total - 1e-6; t += step) { mult.push(t === 0 ? p.start : at(t)); }
				if (p.times.some(function (x) { return Math.abs(x / step - Math.round(x / step)) > 1e-6; })) { patIrregular.push(p.label); }
				var last = p.pts[p.pts.length - 1].PatternCurve_Multiplier;
				if (last !== p.start) { note('wtg-pattern-end', [p.label]); }
			}
			if (analysisStart !== null && p.startTime !== null && p.startTime !== undefined) {
				var period = p.pts.length ? p.times[p.times.length - 1] : step;
				// A pattern's start is a TIME OF DAY (its date part is whatever day it was made), as
				// is the run's: the offset into the pattern at the run's start is their difference.
				var tod = function (x) { return ((Math.round(x) % 86400) + 86400) % 86400; };
				var off = period > 0 ? (((tod(analysisStart) - tod(p.startTime)) % period) + period) % period : 0;
				startOffsets[Math.round(off)] = true;
			}
			for (i = 0; i < mult.length; i += 6) {
				patLines.push(' ' + p.id + '\t' + mult.slice(i, i + 6).map(num).join('\t'));
			}
		});
		if (patContinuous.length) { note('wtg-pattern-continuous', patContinuous); }
		if (patWeekly.length) { note('wtg-pattern-calendar', patWeekly); }
		if (patIrregular.length) { note('wtg-pattern-irregular', patIrregular); }
		var offs = Object.keys(startOffsets).map(Number);
		if (offs.length > 1) { note('wtg-pattern-start', patRows.map(function (r) { return labels[r.SupportElementID]; })); }

		// ---- [TIMES] and [OPTIONS]
		function clock(sec) {
			var s2 = ((Math.round(sec) % 86400) + 86400) % 86400, h = Math.floor(s2 / 3600), m = Math.floor((s2 % 3600) / 60);
			return h + ':' + (m < 10 ? '0' : '') + m;
		}
		function hms(sec) {
			sec = Math.round(sec || 0);
			var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s2 = sec % 60;
			return h + ':' + (m < 10 ? '0' : '') + m + (s2 ? ':' + (s2 < 10 ? '0' : '') + s2 : '');
		}
		var times = [];
		var isEps = eng && eng.TimeAnalysisType === 1 && eps;
		var hstep = isEps ? eps.EpsType_HydraulicTimeStep : 3600;
		times.push(' Duration           \t' + (isEps ? hms(eps.EpsType_Duration) : '0:00'));
		times.push(' Hydraulic Timestep \t' + hms(hstep));
		if (eng && eng.EpaSetWaterQualityTimeStep && eng.EpaWaterQualityTimeStep) { times.push(' Quality Timestep   \t' + hms(eng.EpaWaterQualityTimeStep)); }
		times.push(' Pattern Timestep   \t' + hms(patternStep || hstep));
		if (offs.length === 1) { times.push(' Pattern Start      \t' + hms(offs[0])); }
		times.push(' Report Timestep    \t' + hms(isEps && eps.EpsType_ReportingTimeStep > 0 ? eps.EpsType_ReportingTimeStep : hstep));
		if (analysisStart !== null && analysisStart !== undefined) { times.push(' Start ClockTime    \t' + clock(analysisStart)); }

		var opt = [' Units              \t' + flowKw, ' Headloss           \t' + headloss];
		if (eng) {
			if (typeof eng.EpaNetEngine_LiquidSpecificGravity === 'number') { opt.push(' Specific Gravity   \t' + num(eng.EpaNetEngine_LiquidSpecificGravity)); }
			if (typeof eng.EpaNetEngine_LiquidKinematicViscosity === 'number') { opt.push(' Viscosity          \t' + num(eng.EpaNetEngine_LiquidKinematicViscosity / EPANET_VISC_FT2S)); }
			if (typeof eng.EpaNetEngine_Trials === 'number') { opt.push(' Trials             \t' + eng.EpaNetEngine_Trials); }
			if (typeof eng.EpaNetEngine_Accuracy === 'number') { opt.push(' Accuracy           \t' + num(eng.EpaNetEngine_Accuracy)); }
			if (typeof eng.EpaNetEngine_CheckFrequency === 'number') { opt.push(' CHECKFREQ          \t' + eng.EpaNetEngine_CheckFrequency); }
			if (typeof eng.EpaNetEngine_CheckCutOff === 'number') { opt.push(' MAXCHECK           \t' + eng.EpaNetEngine_CheckCutOff); }
			if (typeof eng.EpaNetEngine_DampingLimit === 'number') { opt.push(' DAMPLIMIT          \t' + num(eng.EpaNetEngine_DampingLimit)); }
			if (typeof eng.EpaNetEngine_EmitterExponent === 'number') { opt.push(' Emitter Exponent   \t' + num(eng.EpaNetEngine_EmitterExponent)); }
			if (adjBase.stated) { opt.push(' Demand Multiplier  \t' + num(multBase)); }
			if (adjBase.bad || (adjBase.stated && baseHasUnit && baseHasNormal && adjBase.unit !== adjBase.normal)) {
				note('wtg-demand-adjustments', [labels[eng.CalculationOptionsID] || String(eng.CalculationOptionsID)]);
			}
			if (eng.EpaNetEngine_UsePressureDependentDemand) { note('wtg-pdd', []); }
		} else {
			note('wtg-no-options', []);
		}
		// A pattern called "1" would become EPANET's default demand pattern, which WaterGEMS has no
		// notion of; the file names an empty default instead... EPANET has no such word, so say it.
		if (patIds['1'] && net.nodes.some(function (n) { return n.kind === 'junction' && n.demands && n.demands.some(function (d) { return !patterns[d.pat]; }); })) {
			note('wtg-pattern-default', ['1']);
		}

		// ---- what was not carried, by name
		if (renamed.length) { note('wtg-id-changed', renamed); }
		if (net.skipped.length) { note('wtg-element-unread', net.skipped); }
		if (splitIds.length) { note('wtg-directed-split', splitIds); }
		if (net.tankInlets.length) { note('wtg-tank-inlet', net.tankInlets); }
		if (net.tankDemands.length) { note('wtg-tank-demand', net.tankDemands); }
		if (net.emitters.length) { note('wtg-emitter-unread', net.emitters); }
		if (net.customerDemands.length) { note('wtg-customer-demand', net.customerDemands); }
		if (net.unitDemands.length) { note('wtg-unit-demand', net.unitDemands); }
		if (net.settingPatterns.length) { note('wtg-setting-pattern', net.settingPatterns); }
		if (net.valveStatusGuess.length) { note('wtg-valve-closed', net.valveStatusGuess); }
		if (net.inactive.length) { note('wtg-inactive', net.inactive); }
		var noGeom = net.nodes.filter(function (n) { return n.noGeom; }).map(function (n) { return n.label; });
		if (noGeom.length) { note('wtg-no-geometry', noGeom); }
		if (unconverted.length) { note('wtg-unconverted', unconverted); }
		var unk = Object.keys(unknownFields);
		if (unk.length) { note('wtg-unit-unknown', unk); }
		var assumed = Object.keys(assumedFields);
		if (assumed.length) { note('wtg-unit-assumed', assumed); }
		// Tables holding rows this reader did not read, for any element it did import or skip.
		var unreadTables = [];
		Object.keys(M.cols).forEach(function (t) {
			if (READ_TABLES[t] || !M.cols[t].DomainElementID || !M.cols[t].AlternativeID || !(M.rowCount[t] > 0)) { return; }
			if (/_(Age|Constituent|Trace)_Data$|_HMIDataSetTopology_Data$|_HmiDataSetGeometry_Data$/.test(t)) { return; }
			var any = M.all(t).some(function (r) { return live[r.DomainElementID] !== undefined && alts[r.AlternativeID] && !alts[r.AlternativeID].deleted; });
			if (any) { unreadTables.push(t); }
		});
		if (unreadTables.length) { note('wtg-tables-unread', unreadTables); }

		out.push('[TITLE]', (labels[baseId] ? 'Scenario: ' + labels[baseId] : ''), '');
		out.push('[JUNCTIONS]', ';ID\tElev\tDemand\tPattern'); out = out.concat(junctions); out.push('');
		out.push('[RESERVOIRS]', ';ID\tHead\tPattern'); out = out.concat(reservoirs); out.push('');
		out.push('[TANKS]', ';ID\tElevation\tInitLevel\tMinLevel\tMaxLevel\tDiameter\tMinVol\tVolCurve'); out = out.concat(tanks); out.push('');
		out.push('[PIPES]', ';ID\tNode1\tNode2\tLength\tDiameter\tRoughness\tMinorLoss\tStatus'); out = out.concat(pipes); out.push('');
		out.push('[PUMPS]', ';ID\tNode1\tNode2\tParameters'); out = out.concat(pumps); out.push('');
		out.push('[VALVES]', ';ID\tNode1\tNode2\tDiameter\tType\tSetting\tMinorLoss'); out = out.concat(valves); out.push('');
		if (demandsSec.length) { out.push('[DEMANDS]', ';Junction\tDemand\tPattern\tCategory'); out = out.concat(demandsSec); out.push(''); }
		if (statusLines.length) { out.push('[STATUS]'); out = out.concat(statusLines); out.push(''); }
		if (patLines.length) { out.push('[PATTERNS]', ';ID\tMultipliers'); out = out.concat(patLines); out.push(''); }
		if (curves.length) { out.push('[CURVES]', ';ID\tX-Value\tY-Value'); out = out.concat(curves); out.push(''); }
		if (controls.length) { out.push('[CONTROLS]'); out = out.concat(controls); out.push(''); }
		if (energy.length) { out.push('[ENERGY]'); out = out.concat(energy); out.push(''); }
		out.push('[TIMES]'); out = out.concat(times); out.push('');
		out.push('[OPTIONS]'); out = out.concat(opt); out.push('');
		out.push('[COORDINATES]', ';Node\tX-Coord\tY-Coord'); out = out.concat(coords); out.push('');
		if (verts.length) { out.push('[VERTICES]', ';Link\tX-Coord\tY-Coord'); out = out.concat(verts); out.push(''); }
		out.push('[END]', '');

		// ---- scenarios and alternatives beyond Base, as records for the page (scenariosOf below)
		var tree = scenariosOf({
			scen: scen, alts: alts, baseId: baseId, activeId: activeId, picksOf: picksOf, network: network,
			baseNet: net, nodeIdOf: nodeIdOf, linkIdOf: linkIdOf, conv: conv, T: T, num: num, headloss: headloss,
			M: M, live: live, labels: labels, index: index, tableType: tableType, note: note,
			demand: { base: multBase, adjBase: adjBase, hasUnit: baseHasUnit, hasNormal: baseHasNormal, adjust: function (sc) { return adjustOf(engFor(sc)); }, multOf: multOf }
		});

		return {
			ok: true, inp: out.join('\n'), notes: notes, flowUnits: flowKw, unitSystem: us ? 'us' : 'si',
			scenarios: tree.scenarios, alternatives: tree.alternatives, inactive: net.inactive.map(function (lab) { return lab; }),
			inactiveIds: { nodes: net.nodes.filter(function (n) { return !n.active; }).map(function (n) { return n.id; }),
				links: net.links.filter(function (l) { return !l.active && l.id; }).map(function (l) { return l.id; })
					.concat(net.directed.filter(function (d) { return !d.active && d.id; }).map(function (d) { return d.id; })) },
			counts: counts, baseScenario: labels[baseId], activeScenario: activeId ? labels[activeId] : null,
			declaredUnits: declared
		};
	}

	// The values a scenario's alternatives give each element, in this page's property names and the
	// project's units: what is compared against Base to find a scenario's overrides, and what a
	// stored alternative holds. Physical only for now (the one category a sample varies).
	function physicalValues(net, ctx) {
		var out = {}, T = ctx.T, num = ctx.num, conv = ctx.conv;
		function put(key, prop, v) { if (v !== null && v !== undefined) { (out[key] || (out[key] = {}))[prop] = v; } }
		function n2(v, f, t) { var c = conv(v, f, t); return c === null ? null : Number(num(c)); }
		net.nodes.forEach(function (n) {
			var id = ctx.nodeIdOf[n.e];
			if (!id) { return; }
			if (n.kind === 'junction') { put('n:' + id, 'elev', n2(n.elev, 'Physical_NodeElevation', T.len)); }
			if (n.kind === 'reservoir') { put('n:' + id, 'head', n2(n.elev, 'Physical_NodeElevation', T.len)); }
		});
		net.links.forEach(function (l) {
			var id = ctx.linkIdOf[l.e];
			if (!id) { return; }
			put('l:' + id, 'diameter', n2(l.diameter, 'Physical_PipeDiameter', T.diam));
			put('l:' + id, 'length', n2(l.length, l.lengthField, T.len));
			if (ctx.headloss === 'D-W') { put('l:' + id, 'roughness', n2(l.dw, 'Physical_DarcyWeisbachE', T.rough)); }
			else { put('l:' + id, 'roughness', l.hw === null || l.hw === undefined ? null : Number(num(ctx.headloss === 'C-M' ? l.n : l.hw))); }
			put('l:' + id, 'k', l.k === null || l.k === undefined ? 0 : Number(num(l.k)));
		});
		return out;
	}

	/**
	 * The scenario tree beyond Base and the alternatives no scenario uses.
	 *
	 * **A SCENARIO'S DIFFERENCES FROM BASE BECOME ITS OWN OVERRIDES.** Each scenario is read through
	 * its own alternatives, element by element, and every Physical value that resolves differently
	 * from Base is written as an override of that scenario; the alternatives themselves (names,
	 * sharing) are not carried yet, and the report names them. No public sample has a scenario that
	 * differs from Base, so this path is proven only on a synthetic file (dev/sqlite-reader.md).
	 *
	 * **AN ALTERNATIVE NO SCENARIO USES** is carried as a stored alternative of its own (a root
	 * alternative is a "Base of its own" here, `root: true`), holding every Physical value it states,
	 * so it can be picked later. A child alternative hangs from its parent.
	 */
	function scenariosOf(ctx) {
		var scenarios = [], alternatives = [], basePhys = physicalValues(ctx.baseNet, ctx), used = {};
		var ids = Object.keys(ctx.scen).map(Number).sort(function (a, b) { return a - b; });
		var basePicks = ctx.picksOf(ctx.scen[ctx.baseId]);
		var namedAlts = [], otherCats = [], roots = [], badAdj = [];
		ids.forEach(function (sid) {
			var picks = ctx.picksOf(ctx.scen[sid]);
			Object.keys(picks).forEach(function (t) { if (picks[t] !== null) { used[picks[t]] = true; } });
			if (sid === ctx.baseId) { return; }
			var s = ctx.scen[sid], rec = { fileId: sid, name: s.name, parentName: null, overrides: {} };
			if (s.parent && s.parent !== ctx.baseId && ctx.scen[s.parent]) { rec.parentName = ctx.scen[s.parent].name; rec.parentFileId = s.parent; }
			if (!s.parent) { roots.push(s.name); }
			// Demand: a scenario's own adjustment, as the Demand Multiplier it overrides (the page's scenario
			// record holds it as demandMultiplier).
			var da = ctx.demand.adjust(s), dm = ctx.demand.multOf(da, ctx.demand.hasUnit, ctx.demand.hasNormal);
			if (dm !== ctx.demand.base) { rec.demandMultiplier = dm; }
			if (da.bad || (ctx.demand.hasUnit && ctx.demand.hasNormal && da.unit / (da.normal || 1) !== ctx.demand.adjBase.unit / (ctx.demand.adjBase.normal || 1))) { badAdj.push(s.name); }
			Object.keys(picks).forEach(function (t) {
				if (picks[t] === basePicks[t]) { return; }
				if (Number(t) === 4) { namedAlts.push(s.name + ': ' + (ctx.alts[picks[t]] ? ctx.alts[picks[t]].name : picks[t])); }
				else { otherCats.push(s.name + ': ' + (ctx.alts[picks[t]] ? ctx.alts[picks[t]].name : picks[t]) + ' (' + (ALT_TYPE_NAME[t] || t) + ')'); }
			});
			if (picks[4] !== basePicks[4]) {
				var mine = physicalValues(ctx.network(s), ctx);
				Object.keys(mine).forEach(function (key) {
					Object.keys(mine[key]).forEach(function (prop) {
						var b = basePhys[key] && basePhys[key][prop];
						if (b !== mine[key][prop]) { (rec.overrides[key] || (rec.overrides[key] = {}))[prop] = mine[key][prop]; }
					});
				});
			}
			scenarios.push(rec);
		});
		if (roots.length) { ctx.note('wtg-scenario-root', roots); }
		if (badAdj.length) { ctx.note('wtg-demand-adjustments', badAdj); }
		if (namedAlts.length) { ctx.note('wtg-scenario-alternative', namedAlts); }
		if (otherCats.length) { ctx.note('wtg-scenario-category', otherCats); }

		// Alternatives no live scenario uses, Physical only.
		Object.keys(ctx.alts).map(Number).sort(function (a, b) { return a - b; }).forEach(function (aid) {
			var a = ctx.alts[aid];
			if (a.deleted || used[aid] || a.type !== 4) { return; }
			var fake = { id: -1, parent: null, picks: {}, local: {}, calc: {} };
			Object.keys(basePicks).forEach(function (t) { fake.picks[t] = basePicks[t]; fake.local[t] = true; });
			fake.picks[4] = aid;
			var vals = physicalValues(ctx.network(fake), ctx), rec = { fileId: aid, name: a.name, category: 'physical', values: {} };
			if (a.parent && ctx.alts[a.parent] && a.parent !== basePicks[4]) { rec.parentFileId = a.parent; }
			if (!a.parent) {
				// A root alternative states every value: carry them all, as a Base of its own does.
				rec.root = true;
				// Only the elements it has rows for: an element added after it was made has none.
				var has = {};
				['BaseIdahoNode_Physical_Data', 'IdahoPipe_Physical_Data', 'BaseLink_Physical_Data'].forEach(function (t) {
					var m = ctx.index(t);
					Object.keys(m).forEach(function (e) { if (m[e][aid] !== undefined) { has[e] = true; } });
				});
				Object.keys(vals).forEach(function (key) {
					var eid = null;
					Object.keys(ctx.nodeIdOf).forEach(function (e) { if ('n:' + ctx.nodeIdOf[e] === key) { eid = e; } });
					Object.keys(ctx.linkIdOf).forEach(function (e) { if ('l:' + ctx.linkIdOf[e] === key) { eid = e; } });
					if (eid !== null && has[eid]) { rec.values[key] = vals[key]; }
				});
			} else {
				Object.keys(vals).forEach(function (key) {
					Object.keys(vals[key]).forEach(function (prop) {
						var b = basePhys[key] && basePhys[key][prop];
						if (b !== vals[key][prop]) { (rec.values[key] || (rec.values[key] = {}))[prop] = vals[key][prop]; }
					});
				});
			}
			alternatives.push(rec);
		});
		if (alternatives.length) { ctx.note('wtg-alternative-unused', alternatives.map(function (r) { return r.name; })); }
		if (ctx.activeId && ctx.activeId !== ctx.baseId && ctx.scen[ctx.activeId]) { ctx.note('wtg-active-scenario', [ctx.scen[ctx.activeId].name]); }
		return { scenarios: scenarios, alternatives: alternatives };
	}

	/** Does this look like a WaterGEMS/WaterCAD database? Tables only; reads no rows. */
	function isWtg(db) {
		var names = {};
		(db.tables || []).forEach(function (t) { names[t.name] = true; });
		return REQUIRED.every(function (t) { return names[t]; });
	}

	EngCalcs.lpnWtgRead = read;
	EngCalcs.lpnWtgIsWtg = isWtg;
	EngCalcs.lpnWtgDisplayUnits = wtgDisplayUnits;
	EngCalcs.lpnWtgFlowKeyword = flowKeywordFor;
	// For the harnesses: the pieces that are checked on their own.
	EngCalcs.lpnWtgInternals = { wkbPoints: wkbPoints, schemaUnits: schemaUnits, num: num, STORE_KIND: STORE_KIND };
	if (typeof module !== 'undefined' && module.exports) { module.exports = EngCalcs; }
}(typeof window !== 'undefined' ? window : globalThis));
