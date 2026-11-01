// Builds js/data/wtg-template/ from a project the owner saved in his own WaterGEMS (a project holding
// one of every element kind, schema 1.0.54.0): the template the .wtg export writes into, so the
// visitor supplies no file.
//
//   node dev/scripts/build_wtg_template.js --src <project.wtg.sqlite> --src-wtg <project.wtg> [--out js/data/wtg-template]
//
// Nothing is executed from the project: the files are read as data (sql.js, text). Record: dev/wtg-export.md.
//
// WHAT IT DOES. (1) Keeps one live element of each kind the writer clones (junction, reservoir, tank,
// pipe, pump, the six valve kinds) with the pump definition, one pattern and the valve headloss curve,
// every row as the program saved it, and removes the rest of the model, its change log, its selection
// sets and its graph. (2) Sets the project name to "Network" and clears the notes. (3) Sets the .wtg
// display units to US customary, which the export writes. (4) Compresses both files (gzip) for the
// page to fetch.
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
	const db = new SQL.Database(fs.readFileSync(args.src));
	const tables = tablesOf(db);
	const keyOf = (t) => { const c = colsOf(db, t).map((x) => x.name); return c.indexOf('DomainElementID') >= 0 ? 'DomainElementID' : c.indexOf('SupportElementID') >= 0 ? 'SupportElementID' : null; };

	// ---- which elements stay ----
	function firstDomain(type, where) {
		const r = rowsOf(db, 'SELECT d.DomainElementID AS id FROM HMIDomainElement d JOIN HMIModelingElement m ON m.ElementID = d.DomainElementID '
			+ 'WHERE d.DomainElementTypeID = ? AND d.IsDeleted = 0 AND m.IsDeleted = 0 ' + (where || '') + ' ORDER BY d.DomainElementID', [type]);
		if (!r.length) { throw new Error('the sample has no element of type ' + type); }
		return r[0].id;
	}
	function firstSupport(type) {
		const r = rowsOf(db, 'SELECT SupportElementID AS id FROM HMISupportElement WHERE SupportElementTypeID = ? AND IsDeleted = 0 ORDER BY SupportElementID', [type]);
		if (!r.length) { throw new Error('the project has no support element of type ' + type); }
		return r[0].id;
	}
	const keepDomain = new Set([55, 56, 52, 69, 68, 60, 61, 62, 64, 65, 66].map((t) => firstDomain(t)));
	const pump = firstDomain(68);
	const pumpDefId = rowsOf(db, 'SELECT Physical_PumpDefinitionID AS d FROM StandardPump_Physical_Data WHERE DomainElementID = ?', [pump])[0].d;
	const patNew = firstSupport(50);
	const keepSupport = new Set([pumpDefId, patNew, firstSupport(63)]);

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
	// Anything in a
	// kept element's rows that names an element removed above goes back to the column's own default.
	{
		const kept = Array.from(keepDomain).concat(Array.from(keepSupport));
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

	// ---- the counters of live elements by type are rewritten by the writer; reset the project name ----
	db.run("UPDATE HMIDomainDataSet SET Name = 'Network', Notes = ''");
	db.run('VACUUM');
	const bytes = db.export();
	const check = rowsOf(db, 'PRAGMA integrity_check')[0];
	db.close();
	if (Object.values(check)[0] !== 'ok') { throw new Error('integrity check failed'); }

	// ---- the .wtg ----
	let xml = fs.readFileSync(args['src-wtg'], 'utf8');
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

	fs.mkdirSync(OUT, { recursive: true });
	fs.writeFileSync(path.join(OUT, 'wtg-template.wtg.sqlite.gz'), zlib.gzipSync(Buffer.from(bytes), { level: 9 }));
	fs.writeFileSync(path.join(OUT, 'wtg-template.wtg.gz'), zlib.gzipSync(Buffer.from(xml, 'utf8'), { level: 9 }));
	fs.writeFileSync('/dev/stderr', 'template: ' + bytes.length + ' bytes sqlite, ' + swapped + ' display units set to US, protos ' + Array.from(keepDomain).join(',') + ' pump def ' + pumpDefId + ', pattern ' + patNew + '\n');
}
main().catch((e) => { console.error(e); process.exit(1); });
