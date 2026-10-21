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
		FireFlow_NeededFireFlow: 27, FireFlow_SystemNeededFireFlow: 27, FireFlow_SystemFireFlowUpperLimit: 27, FireFlow_SystemResidualPressure: 231,
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
		BasePump_InitialSettings_Data: 1, StandardPump_Physical_Data: 1, VariableSpeedPumpBattery_Physical_Data: 1,
		BaseValve_Physical_Data: 1, BaseValve_InitialSettings_Data: 1, PressureValve_InitialSettings_Data: 1,
		PressureValve_InitialSettings_PressureValveSetting_ValvePressureType: 1,
		PressureValve_InitialSettings_PressureValveSetting_ValveHGLType: 1, PressureValve_Physical_Data: 1,
		PRV_Physical_Data: 1, PSV_Physical_Data: 1, PBV_Physical_Data: 1, FCV_Physical_Data: 1, FCV_InitialSettings_Data: 1,
		TCV_Physical_Data: 1, TCV_InitialSettings_Data: 1, GPV_Physical_Data: 1, IdahoFireFlowNode_Physical_Data: 1,
		IdahoFireFlowNode_FireFlow_Data: 1
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
				// A variable speed pump battery is one node between pipes, like a pump; WaterGEMS's own EPANET
				// export writes it as one pump at relative speed 1 (OBSERVED, WTG-tgh-1).
				if (is(e, 'VariableSpeedPumpBattery')) { net.directed.push({ e: e, label: lab, kind: 'pump', battery: true }); return; }
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
					d.def = d.battery ? get(d.e, s, 'Physical_VspbDefinition') : get(d.e, s, 'Physical_PumpDefinitionID');
					d.speed = get(d.e, s, 'InitialSettings_RelativeSpeedFactor');
					d.off = get(d.e, s, 'PumpStatus') === 1;
					d.vsp = d.battery || !!get(d.e, s, 'Physical_IsVariableSpeedPump');
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
			patterns[sid] = { sid: sid, label: labels[sid], start: r.IdahoPattern_PatternStartingMultiplier, pts: pts, times: times, startTime: r.IdahoPattern_PatternStartTime,
				continuous: r.PatternFormat === 1 };
			times.forEach(function (t) { if (t > 0) { patternStep = patternStep === null ? Math.round(t) : gcd(patternStep, t); } });
		});
		// A continuous pattern is sampled at the pattern time step, which must not be coarser than the
		// hydraulic time step, or the samples would miss the line between points.
		if (patContinuous.length) {
			var hstepPre = (eng && eng.TimeAnalysisType === 1 && eps && eps.EpsType_HydraulicTimeStep > 0) ? eps.EpsType_HydraulicTimeStep : 3600;
			patternStep = patternStep === null ? Math.round(hstepPre) : gcd(patternStep, hstepPre);
		}
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
			if (v === null) { if (unconverted.indexOf(label + ': ' + what) < 0) { unconverted.push(label + ': ' + what); } return '0'; }
			return v;
		}

		// A tank as one scenario sees it, in the project's units and as the `.inp` states it: base elevation,
		// the three levels measured from the base, the diameter, and the ID of its volume curve ('' for none).
		// `loud` is true for the Base pass, which alone reports what it cannot carry.
		var tankCurveOf = {};
		function tankFacts(n, loud) {
			var lv = function (elevField, levelField, elevV, levelV) {
				// OperatingRangeType 0 states elevations, 1 levels (OBSERVED 0 in every sample).
				if (n.rangeType === 1) { return L(levelV, levelField); }
				var e1 = conv(elevV, elevField, T.len), b1 = conv(n.base, 'Physical_TankBaseElevation', T.len);
				return (e1 === null || b1 === null) ? null : num(e1 - b1);
			};
			var f = { init: lv('InitialSettings_TankInitialElevation', 'InitialSettings_TankInitialLevel', n.initElev, n.initLevel),
				minL: lv('Physical_TankMinimumElevation', 'Physical_TankMinimumLevel', n.minElev, n.minLevel),
				maxL: lv('Physical_TankMaximumElevation', 'Physical_TankMaximumLevel', n.maxElev, n.maxLevel), curve: '' };
			var diam = conv(n.diameter, 'CircularTankSectionType_TankDiameter', T.len);
			diam = diam === null ? null : num(diam);
			if (n.section === 1) {
				var a = conv(n.area, 'NonCircularTankSectionType_TankAverageArea', T.area);
				diam = a === null ? null : num(Math.sqrt(4 * a / Math.PI));
				if (loud) { note('wtg-tank-area', [n.label]); }
			} else if (n.section === 2) {
				// Depth and volume ratios of the active range (OBSERVED: ratio 1 at the maximum level,
				// the volume ratio times the total active volume giving the .inp's volumes).
				var minN = Number(f.minL), maxN = Number(f.maxL);
				var act = conv(n.activeVol, 'VariableAreaTankSectionType_TotalActiveVolume', T.vol);
				var inact = conv(n.inactiveVol || 0, 'Physical_InactiveVolume', T.vol) || 0;
				if (act !== null && n.curve.length) {
					var sig = n.e + '|' + minN + '|' + maxN + '|' + act + '|' + inact + '|' + JSON.stringify(n.curve);
					if (tankCurveOf[sig] === undefined) {
						var cid = makeId(n.label, 'TANK-' + n.e, curveIds);
						curves.push(';VOLUME: ' + n.label);
						n.curve.forEach(function (p) {
							curves.push(' ' + cid + '\t' + num(minN + p[0] * (maxN - minN)) + '\t' + num(inact + p[1] * act));
						});
						tankCurveOf[sig] = cid;
					}
					f.curve = tankCurveOf[sig];
				}
			} else if (n.section !== 0 && n.section !== null && n.section !== undefined) {
				if (loud) { note('wtg-tank-section', [n.label + ' (' + n.section + ')']); }
			}
			f.diam = diam;
			f.base = L(n.base, 'Physical_TankBaseElevation');
			return f;
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
				var tf = tankFacts(n, true), init = tf.init, minL = tf.minL, maxL = tf.maxL, diam = tf.diam, volCurve = tf.curve;
				tanks.push(' ' + n.id + '\t' + need(L(n.base, 'Physical_TankBaseElevation'), 'base elevation', n.label) + '\t' +
					need(init, 'initial level', n.label) + '\t' + need(minL, 'minimum level', n.label) + '\t' + need(maxL, 'maximum level', n.label) + '\t' +
					need(diam, 'diameter', n.label) + '\t' + need(V(n.inactiveVol || 0, 'Physical_InactiveVolume'), 'inactive volume', n.label) + '\t' + volCurve + '\t;');
			}
		});

		// Pumps and valves are NODES in WaterGEMS, each between an upstream and a downstream pipe.
		// Each becomes a link between two new junctions AT ITS OWN POSITION and elevation, named after
		// its element ID number with -A (upstream) and -B (downstream): exactly what WaterGEMS's own
		// EPANET export writes (46-A, 46-B for PMP-1; OBSERVED, WTG-tgh-1, 2026-10-21), so the two files
		// compare line for line (Tom, 2026-10-21). The pipes keep their lengths.
		var splitIds = [], splitAt = {}, curveOfDef = {}, gpvCurveOf = {};
		// The curves a pump definition gives a pump: its head curve and its efficiency curve, written into
		// [CURVES] once per definition, whichever pump (or scenario) names it. Notes name what is not carried.
		function pumpDefCurves(defId) {
			var def = defId === null || defId === undefined ? null : ((M.all('IdahoPumpDefinition').filter(function (r) { return r.SupportElementID === defId; })[0]) || null);
			if (!def) { return { def: null, h: null, e: null }; }
			if (curveOfDef[defId] === undefined) {
				var pts = [], dt = def.PumpDefinitionType, cid = makeId(labels[defId], 'PUMPDEF-' + defId, curveIds);
				var pq = function (v, f) { return conv(v, f, 'flow'); }, ph = function (v, f) { return conv(v, f, T.len); };
				// PumpDefinitionType: 0 constant power, 1 design point, 2 standard three-point,
				// 3 standard extended, 4 custom extended, 5 multiple point (OBSERVED 1 and 5;
				// the rest by Bentley's own list order, dev/sqlite-reader.md).
				if (dt === 1) {
					pts = [[pq(def.DesignDischarge, 'DesignDischarge'), ph(def.DesignHead, 'DesignHead')]];
				} else if (dt === 2 || dt === 3) {
					pts = [[0, ph(def.ShutoffHead, 'ShutoffHead')], [pq(def.DesignDischarge, 'DesignDischarge'), ph(def.DesignHead, 'DesignHead')],
						[pq(def.MaxOperatingDischarge, 'MaxOperatingDischarge'), ph(def.MaxOperatingHead, 'MaxOperatingHead')]];
					if (dt === 3) { note('wtg-pump-extended', [labels[defId]]); }
				} else if (dt === 4 || dt === 5) {
					pts = M.all('IdahoPumpDefinition_PumpCurve').filter(function (r) { return r.SupportElementID === defId; })
						.sort(function (a, b) { return a.ItemID - b.ItemID; })
						.map(function (r) { return [pq(r.PumpCurve_Discharge, 'PumpCurve_Discharge'), ph(r.PumpCurve_Head, 'PumpCurve_Head')]; });
					if (dt === 4) { note('wtg-pump-extended', [labels[defId]]); }
				} else {
					note('wtg-pump-deftype', [labels[defId] + ' (' + dt + ')']);
				}
				if (pts.length && pts.every(function (p) { return p[0] !== null && p[1] !== null; })) {
					curves.push(';PUMP: ' + labels[defId]);
					pts.forEach(function (p) { curves.push(' ' + cid + '\t' + num(p[0]) + '\t' + num(p[1])); });
					curveOfDef[defId] = cid;
				} else {
					curveOfDef[defId] = null;
				}
				// Efficiency: PumpEfficiencyType 0 constant (OBSERVED), written as WaterGEMS's own
				// export writes it, a one-point curve at the design flow.
				var effType = def.PumpEfficiencyType;
				if (effType === 0 && M.has('IdahoPumpDefinition_PumpEfficiencyType_ConstantEfficiencyType')) {
					var ce = M.all('IdahoPumpDefinition_PumpEfficiencyType_ConstantEfficiencyType').filter(function (r) { return r.SupportElementID === defId; })[0];
					if (ce) {
						var eid = makeId(labels[defId] + 'E', 'PUMPDEF-' + defId + 'E', curveIds);
						var qd = pq(def.DesignDischarge, 'DesignDischarge');
						if (!qd && pts.length) { qd = pts[Math.min(1, pts.length - 1)][0]; }
						curves.push(';EFFICIENCY: ' + labels[defId]);
						curves.push(' ' + eid + '\t' + num(qd || 1) + '\t' + num(ce.ConstantEfficiencyType_PumpEfficiency));
						curveOfDef[defId + 'E'] = eid;
					}
				} else if (effType === 2 && M.has('IdahoPumpDefinition_DischargeEfficiencyCurve')) {
					var ec = M.all('IdahoPumpDefinition_DischargeEfficiencyCurve').filter(function (r) { return r.SupportElementID === defId; })
						.sort(function (a, b) { return a.ItemID - b.ItemID; });
					if (ec.length) {
						var eid2 = makeId(labels[defId] + 'E', 'PUMPDEF-' + defId + 'E', curveIds);
						curves.push(';EFFICIENCY: ' + labels[defId]);
						ec.forEach(function (r) { curves.push(' ' + eid2 + '\t' + num(pq(r.DischargeEfficiencyCurve_Discharge, 'DischargeEfficiencyCurve_Discharge')) + '\t' + num(r.DischargeEfficiencyCurve_Efficiency)); });
						curveOfDef[defId + 'E'] = eid2;
					}
				} else if (effType === 1 && typeof def.IdahoPumpDefinition_MotorEfficiency === 'number') {
					// OBSERVED once (WTG-tgh-1, motor efficiency 100): WaterGEMS's export writes a one-point
					// EFFICIENCY curve at flow 0 holding the motor efficiency.
					var eid3 = makeId(labels[defId] + 'E', 'PUMPDEF-' + defId + 'E', curveIds);
					curves.push(';EFFICIENCY: ' + labels[defId]);
					curves.push(' ' + eid3 + '\t0\t' + num(def.IdahoPumpDefinition_MotorEfficiency));
					curveOfDef[defId + 'E'] = eid3;
				} else if (effType !== undefined && effType !== null) {
					note('wtg-pump-efficiency', [labels[defId] + ' (' + effType + ')']);
				}
			}
			return { def: def, h: curveOfDef[defId] || null, e: curveOfDef[defId + 'E'] || null };
		}
		// A valve's setting as the `.inp` states it: a pressure, a flow, a throttle's coefficient, or a GPV's curve
		// ID. `loud` is true for the Base pass, which alone reports what it cannot carry.
		function gpvCurveId(sid) {
			var gp = M.has('GpvHeadlossCurve_GpvHeadlossFlowCurve') ? M.all('GpvHeadlossCurve_GpvHeadlossFlowCurve').filter(function (r) { return r.SupportElementID === sid; })
				.sort(function (a, b) { return a.ItemID - b.ItemID; }) : [];
			if (!gp.length) { return null; }
			if (gpvCurveOf[sid] === undefined) {
				var gid = makeId(labels[sid], 'GPV-' + sid, curveIds);
				curves.push(';HEADLOSS: ' + labels[sid]);
				gp.forEach(function (r) { curves.push(' ' + gid + '\t' + num(conv(r.GpvHeadlossFlowCurve_GpvFlow, 'GpvHeadlossFlowCurve_GpvFlow', 'flow')) + '\t' + num(conv(r.GpvHeadlossFlowCurve_GpvHeadloss, 'GpvHeadlossFlowCurve_GpvHeadloss', T.len))); });
				gpvCurveOf[sid] = gid;
			}
			return gpvCurveOf[sid];
		}
		function valveSettingOf(d, loud) {
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
				if (d.tcvType !== 1 && loud) { note('wtg-tcv-coefficient', [d.label]); }
				setting = need(U(d.tcvK), 'setting', d.label);
			} else if (d.vtype === 'GPV') {
				var gid = gpvCurveId(d.gpvCurve);
				if (gid) { setting = gid; }
				// A GPV with no curve is reported once, by the .inp reader (gpv-curve-missing), which sees the setting the file states.
			}
			return setting;
		}
		net.directed.forEach(function (d) {
			// The node's DOWNSTREAM pipe (named by the database) joins the pump or valve's outlet. Every
			// other pipe at the node joins its inlet: WaterGEMS's own EPANET export does exactly this
			// (OBSERVED, WTG-tgh-1: a pump node with three pipes beside its outlet pipe), so a node with
			// more than two pipes is no different from one with two.
			var adj = net.links.filter(function (l) { return l.from === d.e || l.to === d.e; });
			var down = adj.filter(function (l) { return l.e === d.downLink; })[0];
			var ups = adj.filter(function (l) { return l !== down; }), up = ups[0];
			if (!down || !up) {
				note('wtg-directed-unlinked', [d.label + ' (' + adj.length + ')']);
				d.unlinked = true;
				return;
			}
			var uId = makeId(d.e + '-A', 'NODE-' + d.e + '-A', nodeIds), dId = makeId(d.e + '-B', 'NODE-' + d.e + '-B', nodeIds);
			var elev = need(L(d.elev, 'Physical_NodeElevation'), 'elevation', d.label);
			junctions.push(' ' + uId + '\t' + elev + '\t0\t\t;');
			junctions.push(' ' + dId + '\t' + elev + '\t0\t\t;');
			coords.push(' ' + uId + '\t' + XY(d.x) + '\t' + XY(d.y));
			coords.push(' ' + dId + '\t' + XY(d.x) + '\t' + XY(d.y));
			counts.splitJunctions += 2;
			splitIds.push(d.label + ' (' + uId + ', ' + dId + ')');
			splitAt[d.e] = { down: down.e, uId: uId, dId: dId };
			d.id = makeId(d.label, d.kind.toUpperCase() + '-' + d.e, linkIds);
			linkIdOf[d.e] = d.id;
			if (d.kind === 'pump') {
				counts.pumps++;
				var params = '';
				if (d.battery) { note('wtg-pump-battery', [d.label]); } else if (d.vsp) { note('wtg-pump-vsp', [d.label]); }
				var pcv = pumpDefCurves(d.def);
				if (!pcv.def) {
					note('wtg-pump-nodef', [d.label]);
				} else {
					if (pcv.h) { params = 'HEAD ' + pcv.h; } else { note('wtg-pump-nocurve', [d.label]); }
					if (pcv.e) { energy.push(' Pump \t' + d.id + '\tEffic\t' + pcv.e); }
				}
				if (d.speed !== undefined && d.speed !== null && d.speed !== 1) { params += (params ? '\t' : '') + 'SPEED ' + num(d.speed); }
				pumps.push(' ' + d.id + '\t' + uId + '\t' + dId + '\t' + params + '\t;');
				if (d.off) { statusLines.push(' ' + d.id + '\tClosed'); }
			} else {
				counts.valves++;
				var setting = valveSettingOf(d, true);
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
			toId = splitAt[b] ? (splitAt[b].down === l.e ? splitAt[b].dId : splitAt[b].uId) : nodeIdOf[b];
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
			} else if (p.continuous) {
				// CONTINUOUS: the multiplier is the straight line between points, which EPANET has not. Written as
				// WaterGEMS's own EPANET export writes it (OBSERVED, WTG-tgh-1: ten points over 24 hours came out as
				// 26 multipliers at a one-hour step): the starting multiplier first, then the line's value at the
				// time of each step from 0 to the last point, both ends included.
				var tEnd = p.times[p.times.length - 1];
				var line = function (time) {
					var q;
					if (time <= p.times[0]) { return p.pts[0].PatternCurve_Multiplier; }
					for (q = 1; q < p.times.length; q++) {
						if (time <= p.times[q] + 1e-6) {
							var f = p.times[q] === p.times[q - 1] ? 1 : (time - p.times[q - 1]) / (p.times[q] - p.times[q - 1]);
							return p.pts[q - 1].PatternCurve_Multiplier + f * (p.pts[q].PatternCurve_Multiplier - p.pts[q - 1].PatternCurve_Multiplier);
						}
					}
					return p.pts[p.pts.length - 1].PatternCurve_Multiplier;
				};
				mult = [p.start];
				for (t = 0; t <= tEnd + 1e-6; t += step) { mult.push(Number(line(t).toPrecision(10))); }
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

		// ---- fire flow. A junction that states its own needed flow (FireFlow_HasLocalFireFlowConstraints)
		// becomes that junction's Required fire flow, in the project's flow unit, laid on by the page.
		// The model's system-wide settings (needed flow, upper limit, residual pressure, velocity limit) and
		// a junction's own upper limit have no home in the document, so they are reported with their values.
		var fireFlow = {};
		net.nodes.forEach(function (n) {
			if (n.kind !== 'junction' || !get(n.e, S, 'FireFlow_HasLocalFireFlowConstraints')) { return; }
			var q = get(n.e, S, 'FireFlow_NeededFireFlow');
			if (typeof q === 'number' && q > 0) { fireFlow[n.id] = Number(Q(q, 'FireFlow_NeededFireFlow')); }
		});
		var ffSys = null, ffAlt = resolvedPick(S, 26);
		if (M.has('FireFlow_SystemData') && ffAlt !== null) {
			M.all('FireFlow_SystemData').forEach(function (r) { if (r.AlternativeID === ffAlt) { ffSys = r; } });
		}
		if (ffSys && ffSys.SystemNeededFireFlow > 0) {
			var qu = flowKw, ffWords = [];
			ffWords.push('needed flow ' + Q(ffSys.SystemNeededFireFlow, 'FireFlow_SystemNeededFireFlow') + ' ' + qu);
			if (ffSys.SystemFireFlowUpperLimit > 0) { ffWords.push('upper limit ' + Q(ffSys.SystemFireFlowUpperLimit, 'FireFlow_SystemFireFlowUpperLimit') + ' ' + qu); }
			if (ffSys.SystemResidualPressure > 0) { ffWords.push('residual pressure ' + P(ffSys.SystemResidualPressure, 'FireFlow_SystemResidualPressure') + ' ' + T.press); }
			if (ffSys.SystemUseVelocityConstraint && ffSys.SystemMaximumVelocity > 0) { ffWords.push('velocity limit ' + num(us ? ffSys.SystemMaximumVelocity : ffSys.SystemMaximumVelocity * 0.3048) + (us ? ' ft/s' : ' m/s')); }
			note('wtg-fireflow', ffWords);
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

		// ---- scenarios and alternatives beyond Base, as records for the page (treeOf below). Before the file
		// is assembled: an alternative's pump curve, GPV curve or tank volume curve is written into [CURVES].
		var tree = treeOf({
			scen: scen, alts: alts, baseId: baseId, activeId: activeId, picksOf: picksOf, network: network,
			baseNet: net, nodeIdOf: nodeIdOf, linkIdOf: linkIdOf, splitAt: splitAt, conv: conv, T: T, num: num, headloss: headloss,
			M: M, live: live, labels: labels, index: index, tableType: tableType, note: note, get: get,
			Q: Q, unitScale: unitScale, patternId: patternId, tankFacts: tankFacts, valveSettingOf: valveSettingOf,
			gpvCurveId: gpvCurveId, pumpDefCurves: pumpDefCurves,
			demand: { base: multBase, adjBase: adjBase, hasUnit: baseHasUnit, hasNormal: baseHasNormal, adjust: function (sc) { return adjustOf(engFor(sc)); }, multOf: multOf }
		});

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

		return {
			ok: true, inp: out.join('\n'), notes: notes, flowUnits: flowKw, unitSystem: us ? 'us' : 'si',
			scenarios: tree.scenarios, alternatives: tree.alternatives, inactive: net.inactive.map(function (lab) { return lab; }),
			inactiveIds: { nodes: net.nodes.filter(function (n) { return !n.active; }).map(function (n) { return n.id; }),
				links: net.links.filter(function (l) { return !l.active && l.id; }).map(function (l) { return l.id; })
					.concat(net.directed.filter(function (d) { return !d.active && d.id; }).map(function (d) { return d.id; })) },
			counts: counts, baseScenario: labels[baseId], activeScenario: activeId ? labels[activeId] : null,
			declaredUnits: declared, fireFlow: fireFlow
		};
	}

	// WaterGEMS's alternative types, to this page's categories (dev/scenario-alternatives.md). A category
	// in READ_CATS has its values read; the others are carried by name and sharing only. A type missing
	// here (Geometry, Topology, Operational, Age, Trace, Pressure Dependent Demand, ...) has no
	// counterpart on this page and is named in the report.
	var NATIVE_CAT = { 3: 'topology', 4: 'physical', 20: 'demand', 21: 'initial', 26: 'fireflow', 24: 'constituent', 28: 'energy', 100: 'userdata' };
	var READ_CATS = { topology: 1, physical: 1, demand: 1, initial: 1, fireflow: 1 };

	// Every value this reader carries for the elements of one network (one scenario's view of the model), in this
	// page's property names and the project's units, as { category: { 'n:ID' | 'l:ID': { prop: value } } }.
	// What is compared against Base to find a scenario's or an alternative's differences. A property that
	// starts with an underscore is read to be compared but cannot be carried (the report names it).
	function allValues(net, ctx) {
		var out = { physical: {}, initial: {}, topology: {}, fireflow: {}, demand: {} }, T = ctx.T, num = ctx.num, conv = ctx.conv;
		function put(cat, key, prop, v) {
			if (v === null || v === undefined || (typeof v === 'number' && !isFinite(v))) { return; }
			(out[cat][key] || (out[cat][key] = {}))[prop] = v;
		}
		function n2(v, f, t) { var c = conv(v, f, t); return c === null ? null : Number(num(c)); }
		function numOrNull(v) { return v === null || v === undefined ? null : Number(v); }
		net.nodes.forEach(function (n) {
			var id = ctx.nodeIdOf[n.e], key = 'n:' + id;
			if (!id) { return; }
			put('topology', key, 'active', !!n.active);
			if (n.kind === 'junction') {
				put('physical', key, 'elev', n2(n.elev, 'Physical_NodeElevation', T.len));
				// The demand rows in this page's flow numbers (one conversion, the one the Base [JUNCTIONS] line uses),
				// each with its pattern ID; a junction with none has one row of 0.
				var rows = (n.demands || []).map(function (d) {
					return { base: Number(ctx.Q(d.q * (d.unit ? ctx.unitScale : 1), d.field || 'DemandCollection_BaseFlow')), pattern: ctx.patternId(d.pat) || null, category: null };
				});
				put('demand', key, 'demands', rows.length ? rows : [{ base: 0, pattern: null, category: null }]);
				if (ctx.get(n.e, ctx.sc, 'FireFlow_HasLocalFireFlowConstraints')) {
					var q = ctx.get(n.e, ctx.sc, 'FireFlow_NeededFireFlow');
					if (typeof q === 'number' && q > 0) { put('fireflow', key, 'fireFlow', Number(ctx.Q(q, 'FireFlow_NeededFireFlow'))); }
				}
			} else if (n.kind === 'reservoir') {
				put('physical', key, 'head', n2(n.elev, 'Physical_NodeElevation', T.len));
			} else {
				var f = ctx.tankFacts(n, false), base = numOrNull(f.base);
				put('physical', key, 'elev', base); put('physical', key, 'bottomElev', base);
				put('physical', key, 'minLevel', numOrNull(f.minL)); put('physical', key, 'maxLevel', numOrNull(f.maxL));
				put('physical', key, 'tankDiameter', numOrNull(f.diam)); put('physical', key, 'volCurve', f.curve || '');
				put('initial', key, 'level', numOrNull(f.init));
			}
		});
		net.links.forEach(function (l) {
			var id = ctx.linkIdOf[l.e], key = 'l:' + id;
			if (!id) { return; }
			put('physical', key, 'diameter', n2(l.diameter, 'Physical_PipeDiameter', T.diam));
			put('physical', key, 'length', n2(l.length, l.lengthField, T.len));
			if (ctx.headloss === 'D-W') { put('physical', key, 'roughness', n2(l.dw, 'Physical_DarcyWeisbachE', T.rough)); }
			else { put('physical', key, 'roughness', l.hw === null || l.hw === undefined ? null : Number(num(ctx.headloss === 'C-M' ? l.n : l.hw))); }
			put('physical', key, 'k', l.k === null || l.k === undefined ? 0 : Number(num(l.k)));
			put('initial', key, 'status', l.closed ? 'closed' : 'open');
			put('topology', key, 'active', !!l.active);
		});
		net.directed.forEach(function (d) {
			var id = ctx.linkIdOf[d.e], key = 'l:' + id, sp = ctx.splitAt[d.e];
			if (!id || !sp) { return; }
			put('topology', key, 'active', !!d.active);
			['n:' + sp.uId, 'n:' + sp.dId].forEach(function (nk) { put('physical', nk, 'elev', n2(d.elev, 'Physical_NodeElevation', T.len)); });
			if (d.kind === 'pump') {
				var pc = ctx.pumpDefCurves(d.def);
				put('physical', key, 'curveId', pc.h || ''); put('physical', key, 'efficCurveId', pc.e || '');
				put('initial', key, 'speed', d.speed === undefined || d.speed === null ? 1 : Number(d.speed));
				put('initial', key, 'status', d.off ? 'closed' : 'open');
			} else {
				put('physical', key, 'diameter', n2(d.diameter, 'Physical_ValveDiameter', T.diam));
				put('physical', key, 'k', Number(num(d.k || 0)));
				if (d.vtype === 'GPV') { put('physical', key, 'curveId', ctx.gpvCurveId(d.gpvCurve) || ''); }
				else { put('initial', key, 'setting', numOrNull(ctx.valveSettingOf(d, false))); }
				put('initial', key, 'status', d.status === 2 ? 'closed' : 'open');
			}
		});
		return out;
	}
	function cloneVals(v) { return JSON.parse(JSON.stringify(v)); }
	// What `a` states that `ref` does not, as { values: { category: { key: { prop: v } } } }. A junction whose
	// demand differs is one `demand` when both sides state one row with the same pattern (a scenario retyping the
	// base), else the whole list as `demands`, as the page holds a scenario's own demand table.
	function diffVals(a, ref) {
		var out = {};
		function put(cat, key, prop, v) { ((out[cat] || (out[cat] = {}))[key] || (out[cat][key] = {}))[prop] = v; }
		Object.keys(a).forEach(function (cat) {
			Object.keys(a[cat]).forEach(function (key) {
				var mine = a[cat][key], theirs = (ref[cat] && ref[cat][key]) || {};
				Object.keys(mine).forEach(function (prop) {
					if (JSON.stringify(mine[prop]) === JSON.stringify(theirs[prop])) { return; }
					if (prop === 'demands') {
						var b = theirs.demands || [{ base: 0, pattern: null, category: null }];
						if (mine.demands.length === 1 && b.length === 1 && mine.demands[0].pattern === b[0].pattern) { put(cat, key, 'demand', mine.demands[0].base); }
						else { put(cat, key, 'demands', cloneVals(mine.demands)); }
						return;
					}
					put(cat, key, prop, mine[prop]);
				});
			});
		});
		return { values: out };
	}
	// Values laid onto a state (the same shape as allValues()). A `demand` retypes row 0's base of the junction's list.
	function overlayVals(state, values) {
		Object.keys(values).forEach(function (cat) {
			Object.keys(values[cat]).forEach(function (key) {
				var tgt = (state[cat] || (state[cat] = {})), cur = tgt[key] || (tgt[key] = {});
				Object.keys(values[cat][key]).forEach(function (prop) {
					var v = values[cat][key][prop];
					if (prop === 'demand') {
						var rows = cur.demands ? cloneVals(cur.demands) : [{ base: 0, pattern: null, category: null }];
						rows[0].base = v;
						cur.demands = rows;
					} else {
						cur[prop] = cloneVals(v);
					}
				});
			});
		});
	}
	function flatten(values) {
		var out = {};
		Object.keys(values).forEach(function (cat) {
			Object.keys(values[cat]).forEach(function (key) { out[key] = Object.assign(out[key] || {}, values[cat][key]); });
		});
		return out;
	}

	/**
	 * The scenario tree and the alternatives of a WaterGEMS model, as this page holds them
	 * (dev/scenario-alternatives.md, "Stages 4 and 5: the stored tree"; dev/sqlite-reader.md).
	 *
	 * **EVERY ALTERNATIVE A SCENARIO NAMES BECOMES A STORED ALTERNATIVE OF THE SAME NAME**, in the category
	 * that matches its type (Physical, Demand, Initial settings, Fire flow, Active topology; Constituent,
	 * Energy cost and User data by name only), holding only the values in which it differs from its parent
	 * alternative, and hanging from that parent. A scenario names the alternatives it uses where they differ
	 * from its parent scenario's, so an alternative two scenarios share is one record both name. A scenario's
	 * parent is its parent scenario. **WHAT AN ALTERNATIVE CANNOT SAY IS A SCENARIO'S OWN OVERRIDE**: after
	 * the alternatives are laid on, whatever still differs from what WaterGEMS computes for the scenario
	 * (a tank's depth, which follows its base elevation) is written as the scenario's own override, so the
	 * imported scenario always reads the values the model states. The scenario's `differences` (everything
	 * that differs from Base) is kept beside it for the harnesses.
	 *
	 * **AN ALTERNATIVE WITH NO PARENT** that is not Base's is "a Base of its own" (`root: true`) holding every
	 * value it has rows for. An alternative no scenario uses is imported too, so a scenario can use it.
	 */
	function treeOf(ctx) {
		var scenarios = [], alternatives = [], used = {}, nameOnly = [], noHome = [], roots = [], badAdj = [];
		var basePicks = ctx.picksOf(ctx.scen[ctx.baseId]);
		var baseVals = allValues(ctx.baseNet, Object.assign({}, ctx, { sc: ctx.scen[ctx.baseId] }));
		function fakeWith(type, aid) {
			var f = { id: -1, parent: null, picks: {}, local: {}, calc: {} };
			Object.keys(basePicks).forEach(function (t) { f.picks[t] = basePicks[t]; f.local[t] = true; });
			f.picks[type] = aid;
			return f;
		}
		function netVals(sc) { return allValues(ctx.network(sc), Object.assign({}, ctx, { sc: sc })); }
		var altVals = {};
		function valsOfAlt(aid) {
			if (!altVals[aid]) { altVals[aid] = netVals(fakeWith(ctx.alts[aid].type, aid)); }
			return altVals[aid];
		}
		function importable(aid) {
			var a = ctx.alts[aid];
			return !!(a && !a.deleted && NATIVE_CAT[a.type] && basePicks[a.type] !== aid);
		}
		function parentOf(aid) {   // the parent alternative that is itself imported; null when it hangs from Base
			var a = ctx.alts[aid], p = a.parent;
			return (p !== null && p !== undefined && p !== basePicks[a.type] && importable(p)) ? p : null;
		}
		function isRoot(aid) { var a = ctx.alts[aid]; return a.parent === null || a.parent === undefined; }
		var diffOfAlt = {};
		function diffAlt(aid) {
			if (!diffOfAlt[aid]) {
				var p = parentOf(aid);
				diffOfAlt[aid] = diffVals(valsOfAlt(aid), p === null ? baseVals : valsOfAlt(p));
			}
			return diffOfAlt[aid];
		}
		// The elements that have rows of their own at an alternative (a root alternative states every value
		// it has rows for, and no others).
		function hasRows(aid) {
			var has = {}, type = ctx.alts[aid].type;
			Object.keys(READ_TABLES).forEach(function (t) {
				if (!ctx.M.has(t) || !ctx.M.cols[t].DomainElementID || !ctx.M.cols[t].AlternativeID) { return; }
				var m = ctx.index(t);
				if (ctx.tableType[t] !== type) { return; }
				Object.keys(m).forEach(function (e) { if (m[e][aid] !== undefined) { has[e] = true; } });
			});
			return has;
		}
		function keyToElement() {
			var map = {};
			Object.keys(ctx.nodeIdOf).forEach(function (e) { map['n:' + ctx.nodeIdOf[e]] = e; });
			Object.keys(ctx.linkIdOf).forEach(function (e) { map['l:' + ctx.linkIdOf[e]] = e; });
			Object.keys(ctx.splitAt).forEach(function (e) { map['n:' + ctx.splitAt[e].uId] = e; map['n:' + ctx.splitAt[e].dId] = e; });
			return map;
		}
		// The stored record of each imported alternative (values filled in when the records are made).
		var recOf = {};
		function valuesOfRecord(aid) {
			var cat = NATIVE_CAT[ctx.alts[aid].type], byKey = {};
			if (!READ_CATS[cat]) { return {}; }
			if (isRoot(aid)) {
				var has = hasRows(aid), k2e = keyToElement(), full = valsOfAlt(aid)[cat] || {};
				Object.keys(full).forEach(function (key) { if (has[k2e[key]]) { byKey[key] = full[key]; } });
			} else {
				byKey = (diffAlt(aid).values[cat]) || {};
			}
			return cloneVals(byKey);
		}
		// Which stored values an alternative's chain gives a category, laid onto a copy of Base's.
		function chainOf(aid) {
			var chain = [], g = 0;
			while (aid !== null && g++ < 64) { chain.unshift(aid); aid = parentOf(aid); }
			return chain;
		}
		function applyChain(state, aid) {
			var cat = NATIVE_CAT[ctx.alts[aid].type];
			state[cat] = cloneVals(baseVals[cat] || {});
			if (!READ_CATS[cat]) { return; }
			chainOf(aid).forEach(function (a) {
				var vals = {};
				vals[cat] = valuesOfRecord(a);
				overlayVals(state, vals);
			});
		}
		var made = {};
		function recordFor(aid) {
			if (made[aid]) { return made[aid]; }
			var a = ctx.alts[aid], cat = NATIVE_CAT[a.type], p = parentOf(aid);
			var rec = { fileId: aid, name: a.name, category: cat, values: {} };
			if (p !== null) { rec.parentFileId = p; recordFor(p); }
			else if (isRoot(aid)) { rec.root = true; }
			rec.values = valuesOfRecord(aid);
			if (!READ_CATS[cat]) { nameOnly.push(a.name + ' (' + (ALT_TYPE_NAME[a.type] || a.type) + ')'); }
			made[aid] = rec;
			return rec;
		}

		var ids = Object.keys(ctx.scen).map(Number).sort(function (a, b) { return a - b; });
		ids.forEach(function (sid) {
			var pk = ctx.picksOf(ctx.scen[sid]);
			Object.keys(pk).forEach(function (t) { if (pk[t] !== null) { used[pk[t]] = true; } });
		});
		var built = {};
		function build(sid) {
			if (built[sid]) { return built[sid]; }
			var s = ctx.scen[sid], P = (s.parent && s.parent !== ctx.baseId && ctx.scen[s.parent]) ? ctx.scen[s.parent] : null;
			built[sid] = { picks: ctx.picksOf(s), final: baseVals, pending: true };   // a parent loop falls back to Base
			var up = P ? build(P.id) : null;
			var picks = built[sid].picks, rec = { fileId: sid, name: s.name, parentName: null, overrides: {}, alternatives: {} };
			if (P) { rec.parentName = P.name; rec.parentFileId = P.id; }
			if (!s.parent) { roots.push(s.name); }
			var state = cloneVals(up ? up.final : baseVals);
			var da = ctx.demand.adjust(s), dm = ctx.demand.multOf(da, ctx.demand.hasUnit, ctx.demand.hasNormal);
			if (dm !== ctx.demand.base) { rec.demandMultiplier = dm; }
			if (da.bad || (ctx.demand.hasUnit && ctx.demand.hasNormal && da.unit / (da.normal || 1) !== ctx.demand.adjBase.unit / (ctx.demand.adjBase.normal || 1))) { badAdj.push(s.name); }
			Object.keys(picks).forEach(function (t) {
				var pS = picks[t], pP = up ? up.picks[t] : basePicks[t], cat = NATIVE_CAT[t];
				if (pS === pP || pS === null) { return; }
				if (!cat) { noHome.push(s.name + ': ' + (ctx.alts[pS] ? ctx.alts[pS].name : pS) + ' (' + (ALT_TYPE_NAME[t] || t) + ')'); return; }
				if (pS === basePicks[t]) {
					rec.alternatives[cat] = 'base';
					state[cat] = cloneVals(baseVals[cat] || {});
					return;
				}
				if (!importable(pS)) { noHome.push(s.name + ': ' + (ctx.alts[pS] ? ctx.alts[pS].name : pS) + ' (' + (ALT_TYPE_NAME[t] || t) + ')'); return; }
				recordFor(pS);
				rec.alternatives[cat] = pS;
				applyChain(state, pS);
			});
			var truth = netVals(s);
			rec.overrides = flatten(diffVals(truth, state).values);
			rec.differences = flatten(diffVals(truth, baseVals).values);
			built[sid].final = truth;
			built[sid].rec = rec;
			return built[sid];
		}
		ids.forEach(function (sid) {
			if (sid === ctx.baseId) { return; }
			scenarios.push(build(sid).rec);
		});
		// Alternatives no scenario uses are imported too, so a scenario can use them.
		var unused = [];
		Object.keys(ctx.alts).map(Number).sort(function (a, b) { return a - b; }).forEach(function (aid) {
			if (!importable(aid)) { return; }
			var had = !!made[aid];
			recordFor(aid);
			if (!used[aid] && !had) { unused.push(ctx.alts[aid].name); }
		});
		Object.keys(made).map(Number).sort(function (a, b) { return a - b; }).forEach(function (aid) { alternatives.push(made[aid]); });
		if (roots.length) { ctx.note('wtg-scenario-root', roots); }
		if (badAdj.length) { ctx.note('wtg-demand-adjustments', badAdj); }
		if (noHome.length) { ctx.note('wtg-scenario-category', noHome); }
		if (nameOnly.length) { ctx.note('wtg-alternative-nameonly', nameOnly); }
		if (unused.length) { ctx.note('wtg-alternative-unused', unused); }
		if (alternatives.length) { ctx.note('wtg-alternatives', alternatives.map(function (r) { return r.name + ' (' + (ALT_TYPE_NAME[ctx.alts[r.fileId].type] || r.category) + ')'; })); }
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
