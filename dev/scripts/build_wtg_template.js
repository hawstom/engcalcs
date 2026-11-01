// Builds js/data/wtg-template/ from the CC BY 4.0 Zenodo 7162154 sample (Sinha, Ghorpade, Damani,
// Kalbar, IIT Bombay, 2022): the template the .wtg export writes into, so the visitor supplies no file.
//
//   node dev/scripts/build_wtg_template.js --eps <EPS...base_model.wtg.sqlite> --eps-wtg <same .wtg>
//        --patterns <Badapokharan_MBR_withdrwal capacity curve.wtg.sqlite> [--out js/data/wtg-template]
//
// Nothing is executed from the sample: the files are read as data (sql.js, text). Record: dev/wtg-export.md.
//
// WHAT IT DOES. (1) Keeps one live element of each kind the writer clones (junction, reservoir, tank,
// pipe, pump, pump definition) and removes the rest of the author's model, its change log (a user
// name and every edit), its selection sets and its graph. (2) Takes a pattern from the sample's second
// file (same schema). (3) Adds the kinds the sample lacks, six valve kinds and the valve headloss
// curve, as ONE ROW PER TABLE holding the schema's own column defaults (the DEFAULT clauses of the
// sample's CREATE TABLE), the key columns and the alternative the pump's rows use for the same topic.
// A valve's node-level rows are the pump's. (4) Sets the .wtg display units to US customary, since
// the export writes US/gpm only. (5) Compresses both files (gzip) for the page to fetch.
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const ROOT = path.resolve(__dirname, '..', '..');
const args = {};
for (let i = 2; i < process.argv.length; i += 2) { args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1]; }
const OUT = path.resolve(args.out || path.join(ROOT, 'js', 'data', 'wtg-template'));

// US customary display units (the WaterGEMS names), by formatter name. Only formatters whose
// sample value differs are listed; the spelling is the one the program writes in a saved .wtg.
const US_DISPLAY = {
	angle: 'angle:angleDegrees', area: 'area:squareFeet', area_large: 'area:squareMiles', area_medium: 'area:acres',
	backgroundlayer_unit: 'length:feet', breakrate: 'breakRate:breakRatePerMi', capita: 'flowpercapita:gpdPerCapita',
	coordinate: 'length:feet', costperunitvolumeformatter: 'costperunitvolume:dollarsPerMillionGallons',
	currencyperlengthformatter: 'currencyperlength:dollarsPerFoot', density: 'flowdensityperarea:gpdPerAcres',
	depth: 'length:feet', diameter: 'length:inches', diameter_large: 'length:feet',
	diffusivity: 'diffusivity:squareFeetPerSecond', dischargeperpressuredrop: 'dischargeperpressuredrop:cfsPerSquareRootFooH20',
	elevation: 'length:feet', emittercoefficientformatter: 'emittercoefficient:gallonsPerMinutePerPSI',
	energyperunitvolumeformatter: 'energyperunitvolume:kiloWattHourPerMillionGallons', flow: 'flow:gpm', flow_small: 'flow:gpm',
	force: 'force:poundForce', headlossformatter: 'length:feet', inertia: 'inertia:poundSquareFeet',
	kinematicviscosity: 'diffusivity:squareFeetPerSecond', largevolumeformatter: 'volume:millionGallons', length: 'length:feet',
	length_short: 'length:inches', massperarea: 'massPerArea:poundsPerAcre', massperenergyformatter: 'massPerEnergy:poundsPerKilowattHour',
	massrate_large: 'massrate:poundsPerDay', pipeslope: 'slope:footPerFoot', pressure: 'pressure:psi',
	pressure_shear: 'pressure:poundsPerSquareFoot', pressureheadformatter: 'length:feet', pressureloss: 'pressure:psi',
	pressurelossgradient: 'pressurePerLength:PSIPerFoot', reactionrate: 'reactionrate:perDay', roughness_absolute: 'length:feet',
	roughness_darcyweisbach: 'length:feet', slope: 'slope:footPerFoot', springconstant: 'springconstant:poundPerInch',
	surfacereactionrateformatter: 'surfacereactionrate:feetPerDay', tankvolume: 'volume:millionGallons',
	temperature: 'temperature:fahrenheit', time_extended: 'time:hours', torque: 'torque:poundFeet',
	valveopencloseratecoefficientformatter: 'valveOpenCloseRateCoefficient:percentPerSecondPerFtH2O',
	velocity: 'velocity:velocityFeetPerSecond', volumeunit: 'volume:gallons', weircoefficient: 'weircoefficient:weircoefficientUs',
	width: 'length:feet', zeroordersurfacereactionrateformatter: 'zeroordersurfacereactionrate:milliGramsPerSquareFeetPerDay'
};

// The tables a valve (or the valve headloss curve) has rows in, by kind. The node-level tables a valve
// shares with a pump (position, topology, node physical, node demand-free settings...) are the pump's.
const VALVE_TYPE = { PRV: 64, PSV: 65, PBV: 66, FCV: 60, TCV: 61, GPV: 62 };
const PRESSURE_TABLES = ['PressureValve', 'PressureValve_InitialSettings_Data',
	'PressureValve_InitialSettings_PressureValveSetting_ValvePressureType',
	'PressureValve_InitialSettings_PressureValveSetting_ValveHGLType', 'PressureValve_Physical_Data'];
const BASE_VALVE = ['BaseValve', 'BaseValve_InitialSettings_Data', 'BaseValve_Physical_Data', 'BaseValve_Hammer_Data'];
const VALVE_TABLES = {
	PRV: PRESSURE_TABLES.concat(['PRV', 'PRV_Hammer_Data', 'PRV_Physical_Data']),
	PSV: PRESSURE_TABLES.concat(['PSV', 'PSV_Hammer_Data', 'PSV_Physical_Data']),
	PBV: PRESSURE_TABLES.concat(['PBV', 'PBV_Hammer_Data']),
	FCV: ['FCV', 'FCV_InitialSettings_Data', 'FCV_Hammer_Data', 'FCV_Physical_Data'],
	TCV: ['TCV', 'TCV_InitialSettings_Data', 'TCV_Hammer_Data', 'TCV_Physical_Data'],
	GPV: ['GPV', 'GPV_Physical_Data', 'GPV_Hammer_Data']
};
const PUMP_ONLY = /^(BasePump|StandardPump)/;

function rowsOf(db, sql, params) {
	const st = db.prepare(sql), out = [];
	if (params) { st.bind(params); }
	while (st.step()) { out.push(st.getAsObject()); }
	st.free();
	return out;
}
function colsOf(db, t) { return rowsOf(db, 'PRAGMA table_info("' + t + '")'); }
function tablesOf(db) { return rowsOf(db, "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite\\_%' ESCAPE '\\'").map((r) => r.name); }
function insert(db, t, obj) {
	const k = Object.keys(obj);
	db.run('INSERT INTO "' + t + '" (' + k.map((c) => '"' + c + '"').join(',') + ') VALUES (' + k.map(() => '?').join(',') + ')', k.map((c) => obj[c]));
}

async function main() {
	const { sqlJsPath, wasmPath } = require('../lpn-spike/wtg-sqljs.js');
	const initSqlJs = require(sqlJsPath());
	const SQL = await initSqlJs({ wasmBinary: fs.readFileSync(wasmPath()) });
	const db = new SQL.Database(fs.readFileSync(args.eps));
	const src = new SQL.Database(fs.readFileSync(args.patterns));
	const tables = tablesOf(db);
	const keyOf = (t) => { const c = colsOf(db, t).map((x) => x.name); return c.indexOf('DomainElementID') >= 0 ? 'DomainElementID' : c.indexOf('SupportElementID') >= 0 ? 'SupportElementID' : null; };

	// ---- which elements stay ----
	function firstDomain(type, where) {
		const r = rowsOf(db, 'SELECT d.DomainElementID AS id FROM HMIDomainElement d JOIN HMIModelingElement m ON m.ElementID = d.DomainElementID '
			+ 'WHERE d.DomainElementTypeID = ? AND d.IsDeleted = 0 AND m.IsDeleted = 0 ' + (where || '') + ' ORDER BY d.DomainElementID', [type]);
		if (!r.length) { throw new Error('the sample has no element of type ' + type); }
		return r[0].id;
	}
	const keepDomain = new Set([55, 56, 52, 69, 68].map((t) => firstDomain(t)));
	const pump = firstDomain(68);
	const pumpDefId = rowsOf(db, 'SELECT Physical_PumpDefinitionID AS d FROM StandardPump_Physical_Data WHERE DomainElementID = ?', [pump])[0].d;
	const keepSupport = new Set([pumpDefId]);

	// ---- pattern from the second file, renumbered above everything in the first ----
	const maxId = rowsOf(db, 'SELECT MAX(ElementID) AS m FROM HMIModelingElement')[0].m;
	const patOld = rowsOf(src, 'SELECT SupportElementID AS id FROM HMISupportElement WHERE SupportElementTypeID = 50 AND IsDeleted = 0 ORDER BY SupportElementID')[0].id;
	const patNew = maxId + 1;
	let nextId = patNew + 1;

	const removedIds = rowsOf(db, 'SELECT ElementID AS i FROM HMIModelingElement WHERE ElementType IN (3, 4)').map((r) => r.i)
		.filter((i) => !keepDomain.has(i) && !keepSupport.has(i));
	// ---- remove the rest of the author's model ----
	tables.forEach((t) => {
		if (t === 'HMIDomainElement' || t === 'HMISupportElement' || t === 'HMIModelingElement' || t === 'HMIChangeTracking') { return; }
		const k = keyOf(t);
		if (!k) { return; }
		const keep = k === 'DomainElementID' ? keepDomain : keepSupport;
		db.run('DELETE FROM "' + t + '" WHERE "' + k + '" NOT IN (' + Array.from(keep).join(',') + ') AND "' + k + '" > 0');
	});
	db.run('DELETE FROM HMIDomainElement WHERE DomainElementID NOT IN (' + Array.from(keepDomain).join(',') + ')');
	db.run('DELETE FROM HMISupportElement WHERE SupportElementID NOT IN (' + Array.from(keepSupport).join(',') + ')');
	db.run('DELETE FROM HMIModelingElement WHERE ElementType IN (3, 4) AND ElementID NOT IN (' + Array.from(keepDomain).concat(Array.from(keepSupport)).join(',') + ')');
	db.run('DELETE FROM HMIChangeTracking');
	db.run('DELETE FROM HMISelectionSet');
	db.run("DELETE FROM sqlite_sequence WHERE name = 'HMIChangeTracking'");
	// Notes left on the kept elements are the author's wording; the writer sets its own.
	db.run("UPDATE HMIModelingElement SET Notes = '' WHERE ElementType IN (3, 4)");

	// ---- the kept elements, made plain ----
	// The tank is a circular one (the sample's is a variable-area tank with an inlet pipe); anything else in a
	// kept element's rows that names an element removed above goes back to the column's own default.
	{
		const kept = Array.from(keepDomain).concat(Array.from(keepSupport));
		const tankId = firstDomain(52);
		db.run('DELETE FROM ConventionalTank_Physical_DepthRatioVolumeRatioCurve WHERE DomainElementID = ?', [tankId]);
		db.run('UPDATE ConventionalTank_Physical_Data SET TankSection = 0, VariableAreaTankSectionType_TotalActiveVolume = 0, DepthRatioVolumeRatioCurveCount = 0 WHERE DomainElementID = ?', [tankId]);
		const dflt = (v) => (v === null || v === 'NULL') ? null : /^'.*'$/.test(v) ? v.slice(1, -1) : Number(v);
		const gone = new Set(removedIds);
		const reset = [];
		tables.forEach((t) => {
			const k = keyOf(t);
			if (!k || t === 'HMIDomainElement' || t === 'HMISupportElement') { return; }
			const info = colsOf(db, t);
			info.forEach((c) => {
				if (c.name === k || /^(AlternativeID|ItemID)$/.test(c.name) || !/INT/i.test(c.type)) { return; }
				rowsOf(db, 'SELECT rowid AS r, "' + c.name + '" AS v FROM "' + t + '" WHERE "' + k + '" IN (' + kept.join(',') + ')').forEach((r) => {
					if (r.v !== null && gone.has(r.v) && !/Topology/.test(t)) {   // a link's end nodes are written for every pipe
						db.run('UPDATE "' + t + '" SET "' + c.name + '" = ? WHERE rowid = ?', [dflt(c.dflt_value), r.r]);
						reset.push(t + '.' + c.name);
					}
				});
			});
		});
		process.stderr.write('reset to default: ' + reset.join(', ') + '\n');
	}

	// ---- the pattern ----
	{
		const sup = rowsOf(src, 'SELECT * FROM HMISupportElement WHERE SupportElementID = ?', [patOld])[0];
		const mod = rowsOf(src, 'SELECT * FROM HMIModelingElement WHERE ElementID = ?', [patOld])[0];
		sup.SupportElementID = patNew; mod.ElementID = patNew; mod.Label = 'Pattern prototype'; mod.SmartLabel = 'Pattern prototype'; mod.Notes = '';
		insert(db, 'HMIModelingElement', mod);
		insert(db, 'HMISupportElement', sup);
		tablesOf(src).forEach((t) => {
			const cols = colsOf(src, t).map((c) => c.name);
			if (cols.indexOf('SupportElementID') < 0 || t === 'HMISupportElement') { return; }
			rowsOf(src, 'SELECT * FROM "' + t + '" WHERE SupportElementID = ?', [patOld]).forEach((r) => {
				r.SupportElementID = patNew;
				if ('ItemID' in r) { delete r.ItemID; }
				if (t === 'IdahoPattern_PatternCurve') { return; }
				insert(db, t, r);
			});
		});
	}

	// ---- the alternative the pump's rows use for each topic ----
	const altBySuffix = {};
	tables.filter((t) => /^BasePump_(Physical|InitialSettings|Hammer|EnergyCost)_Data$/.test(t)).forEach((t) => {
		const r = rowsOf(db, 'SELECT AlternativeID AS a FROM "' + t + '" WHERE DomainElementID = ?', [pump])[0];
		if (r) { altBySuffix[t.replace(/^BasePump_/, '').replace(/_Data$/, '')] = r.a; }
	});
	function altFor(table) {
		const m = /_(Physical|InitialSettings|Hammer|EnergyCost)(_|$)/.exec(table);
		if (!m || !(m[1] in altBySuffix)) { throw new Error('no alternative known for ' + table); }
		return altBySuffix[m[1]];
	}
	function defaultRow(table, key, id) {
		const cols = colsOf(db, table).map((c) => c.name);
		const sets = [key], vals = [id];
		if (cols.indexOf('AlternativeID') >= 0) { sets.push('AlternativeID'); vals.push(altFor(table)); }
		db.run('INSERT INTO "' + table + '" (' + sets.map((c) => '"' + c + '"').join(',') + ') VALUES (' + sets.map(() => '?').join(',') + ')', vals);
	}

	// ---- the six valve kinds: the pump's node rows plus defaults ----
	const pumpRows = [];
	tables.forEach((t) => {
		if (PUMP_ONLY.test(t) || t === 'HMIDomainElement' || t === 'HMIModelingElement') { return; }
		if (keyOf(t) !== 'DomainElementID') { return; }
		rowsOf(db, 'SELECT * FROM "' + t + '" WHERE DomainElementID = ?', [pump]).forEach((r) => { pumpRows.push({ table: t, row: r }); });
	});
	const modelingOfPump = rowsOf(db, 'SELECT * FROM HMIModelingElement WHERE ElementID = ?', [pump])[0];
	const domainOfPump = rowsOf(db, 'SELECT * FROM HMIDomainElement WHERE DomainElementID = ?', [pump])[0];
	Object.keys(VALVE_TYPE).forEach((kind) => {
		const id = nextId++;
		insert(db, 'HMIModelingElement', Object.assign({}, modelingOfPump, { ElementID: id, Label: kind + ' prototype', SmartLabel: kind + ' prototype', Notes: '' }));
		insert(db, 'HMIDomainElement', Object.assign({}, domainOfPump, { DomainElementID: id, DomainElementTypeID: VALVE_TYPE[kind] }));
		pumpRows.forEach((p) => { const r = Object.assign({}, p.row, { DomainElementID: id }); if ('ItemID' in r) { delete r.ItemID; } insert(db, p.table, r); });
		BASE_VALVE.concat(VALVE_TABLES[kind]).forEach((t) => { defaultRow(t, 'DomainElementID', id); });
	});
	// ---- the valve headloss curve (a support element) ----
	{
		const id = nextId++;
		const supOfDef = rowsOf(db, 'SELECT * FROM HMISupportElement WHERE SupportElementID = ?', [pumpDefId])[0];
		const modOfDef = rowsOf(db, 'SELECT * FROM HMIModelingElement WHERE ElementID = ?', [pumpDefId])[0];
		insert(db, 'HMIModelingElement', Object.assign({}, modOfDef, { ElementID: id, Label: 'Headloss curve prototype', SmartLabel: 'Headloss curve prototype', Notes: '' }));
		insert(db, 'HMISupportElement', Object.assign({}, supOfDef, { SupportElementID: id, SupportElementTypeID: 63 }));
		defaultRow('GpvHeadlossCurve', 'SupportElementID', id);
	}
	// The next id the file hands out (HMIModelingElement is AUTOINCREMENT).
	db.run("UPDATE sqlite_sequence SET seq = ? WHERE name = 'HMIModelingElement'", [nextId - 1]);

	// ---- the counters of live elements by type are rewritten by the writer; reset the project name ----
	db.run("UPDATE HMIDomainDataSet SET Name = 'Network', Notes = ''");
	// The sample asks for a one-minute water quality step and a one-minute report step. This export writes no water
	// quality, and the report step is stated by the writer (0 means the hydraulic step).
	db.run('UPDATE EpaNetEngine SET EpaSetWaterQualityTimeStep = 0, EpaWaterQualityTimeStep = 0');
	db.run('UPDATE EpaNetEngine_TimeAnalysisType_EpsType SET EpsType_ReportingTimeStep = 0');
	db.run('VACUUM');
	const bytes = db.export();
	const check = rowsOf(db, 'PRAGMA integrity_check')[0];
	db.close(); src.close();
	if (Object.values(check)[0] !== 'ok') { throw new Error('integrity check failed'); }

	// ---- the .wtg ----
	let xml = fs.readFileSync(args['eps-wtg'], 'utf8');
	const eol = xml.indexOf('\r\n') >= 0 ? '\r\n' : '\n';
	// The author's graph of one tank.
	xml = xml.replace(/<GraphElementManager GraphElementManagerCurrentId="\d+" CountOfGraphElements="1"([^>]*)>[\s\S]*?<\/GraphElementManager>/,
		(all, rest) => '<GraphElementManager GraphElementManagerCurrentId="0" CountOfGraphElements="0"' + rest + ' />');
	let swapped = 0;
	xml = xml.replace(/(<NumericFormatter [^>]*?Name=")([^"]*)("[^>]*?DisplayUnit=")([^"]*)(")/g, (all, a, name, b, unit, c) => {
		if (US_DISPLAY[name] && US_DISPLAY[name] !== unit) { swapped++; return a + name + b + US_DISPLAY[name] + c; }
		return all;
	});
	xml = xml.replace(/ ScenarioComputeStatus="\d+"/g, ' ScenarioComputeStatus="0"');
	xml = xml.replace(/Date="[^"]*" Title=/, 'Date="2022-01-01T00:00:00.0000000" Title=');

	fs.mkdirSync(OUT, { recursive: true });
	fs.writeFileSync(path.join(OUT, 'wtg-template.wtg.sqlite.gz'), zlib.gzipSync(Buffer.from(bytes), { level: 9 }));
	fs.writeFileSync(path.join(OUT, 'wtg-template.wtg.gz'), zlib.gzipSync(Buffer.from(xml, 'utf8'), { level: 9 }));
	fs.writeFileSync('/dev/stderr', 'template: ' + bytes.length + ' bytes sqlite, ' + swapped + ' display units set to US, protos ' + Array.from(keepDomain).join(',') + ' pump def ' + pumpDefId + ', pattern ' + patNew + '\n');
}
main().catch((e) => { console.error(e); process.exit(1); });
