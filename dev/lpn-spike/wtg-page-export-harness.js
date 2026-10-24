// THE PAGE'S .wtg.sqlite EXPORT (ROADMAP Task 749), headless. Run with:
//
//   node dev/lpn-spike/wtg-page-export-harness.js
//
// WHAT IT PROVES. The real page code (js/looped-network.js, through the DOM stub) imports EPA's
// Net3, and the page's own export path -- wtgExportPlan() over inpExportDocument() and
// inpExportOptions(), then wtgExportWrite() with the two files a visitor chooses -- makes the
// .zip it would download. The database inside is then
//   1. identical, table by table and row by row (random identifiers and the save time masked), to the
//      one the spike's writer makes straight from Net3.inp, which Tom's WaterGEMS opened and ran
//      (dev/wtg-export.md, rounds 1 to 3). The page's route and the spike's route must not drift;
//   2. read back by the WaterGEMS reader (js/lpn-sqlite.js and js/lpn-wtg.js, branch
//      feat/sqlite-reader): 97 nodes, 117 pipes, both pump curves, five patterns, EPS times;
//   3. solved by EPANET from the read-back network: heads agree with Net3's own run.
// It also holds the refusals (a flow unit other than gpm, a pump with a four-point curve), the
// schema-version gate, the list of what the file cannot carry, the menu row, and that the box
// the visitor sees names every item on that list.
//
// NEEDS the saved project the writer takes its schema from (Tom's, outside the repo):
//   $WTG_TEMPLATE_DIR, default ~/webdev/fixtures/wtg-tgh-1  (WTG-tgh-1.wtg.sqlite + WTG-tgh-1.wtg)
// and the reader files from branch feat/sqlite-reader (dev/lpn-spike/wtg-sqljs.js finds them).
// Missing either, it prints NOT RUN and exits 0, as wtg-export-harness.js does.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
const helper = require('./wtg-sqljs.js');
const { EXAMPLE_EXPORTS, openExample } = require('./example-fixture.js');

const TEMPLATE_DIR = process.env.WTG_TEMPLATE_DIR || path.join(os.homedir(), 'webdev', 'fixtures', 'wtg-tgh-1');
const TPL_SQLITE = path.join(TEMPLATE_DIR, 'WTG-tgh-1.wtg.sqlite'), TPL_WTG = path.join(TEMPLATE_DIR, 'WTG-tgh-1.wtg');

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
function head(t) { console.log('\n' + t); }

(async function () {
	let readerPaths = null;
	try { readerPaths = helper.readerPaths(); helper.sqlJsPath(); } catch (e) { readerPaths = null; }
	if (!fs.existsSync(TPL_SQLITE) || !fs.existsSync(TPL_WTG) || !readerPaths) {
		console.log('NOT RUN: needs ' + TPL_SQLITE + ' and its .wtg (a project saved from WaterGEMS) and the reader from branch feat/sqlite-reader.');
		process.exit(0);
	}

	require(ROOT + 'js/lpn-inp.js');
	require(ROOT + 'js/lpn-net.js');
	require(ROOT + 'js/lpn-patterns.js');
	require(ROOT + 'js/lpn-wtg-export.js');
	global.FileReader = function () {
		this.readAsArrayBuffer = function (file) {
			const bytes = new TextEncoder().encode(file._text);
			this.result = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
			if (this.onload) { this.onload({ target: { result: this.result } }); }
		};
	};
	global.alert = global.window.alert = function () {};
	global.confirm = global.window.confirm = function () { return true; };

	const L = loadLoopedNetwork(
		EXAMPLE_EXPORTS +
		"\t\timportInp: importInpFromFile, getDoc: function () { return doc; },\n" +
		"\t\twtgPlan: wtgExportPlan, wtgWrite: wtgExportWrite, wtgLines: wtgNotCarriedLines,\n" +
		"\t\twtgRefusal: wtgRefusalText, exportWtg: exportWtgFile,\n" +
		"\t\texportRows: exportNetworkRows, exportBase: inpExportBaseName,\n" +
		"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
		"\t\t\tworld = el('g', {}, svg);\n" +
		"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
		"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
		"\t\t\tlabelsLayer = el('g', {}, world);\n" +
		"\t\t\trubberBandEl = el('line', {}, world); },\n" +
		"\t\tunitFactor: unitFactor"
	);
	L.buildLayers();
	const EngCalcs = global.EngCalcs;
	const PC = EngCalcs.pageConfig;   // the page's own strings, from the language file the stub loads
	const fillP = (key, vals) => Object.keys(vals).reduce((s, k) => s.split('{' + k + '}').join(vals[k]), PC[key]);

	// sql.js and the reader, as Node gets them
	const initSqlJs = require(helper.sqlJsPath());
	const wasm = fs.readFileSync(helper.wasmPath());
	const SQL = await initSqlJs({ wasmBinary: wasm });
	EngCalcs.lpnWtgExportSetEngine(initSqlJs, wasm);
	global.window.EngCalcs = EngCalcs;   // the reader modules attach to window when there is one
	require(readerPaths.sqlite); require(readerPaths.wtg);
	EngCalcs.lpnSqliteSetEngine(initSqlJs, wasm);

	const NET3 = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net3.inp'), 'utf8');
	setUnitSet('us');
	L.importInp({ name: 'Net3.inp', _text: NET3 });
	const tplBytes = fs.readFileSync(TPL_SQLITE), tplWtg = fs.readFileSync(TPL_WTG);
	const fileOf = (name, bytes) => ({ name: name, arrayBuffer: () => Promise.resolve(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)) });
	const write = (files) => new Promise((resolve) => L.wtgWrite(files, (out, err) => resolve({ out: out, err: err })));
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'wtg-page-export-'));
	const py = (code, ...args) => execFileSync('python3', ['-I', '-c', code, ...args], { encoding: 'utf8' });

	// ---- 1. the plan ----
	head('1. The plan for the open project (Net3)');
	const planned = L.wtgPlan();
	ok('the plan is made, with no refusal', planned.ok && planned.refused.length === 0, planned.ok ? '' : planned.detail);
	const codes = planned.notCarried.map((x) => x.code);
	ok('it names the water quality analysis (Net3 traces Lake), pipe material and map positions',
		codes.indexOf('quality') >= 0 && codes.indexOf('material') >= 0 && codes.indexOf('positions') >= 0, codes.join(','));
	ok('it names no emitters, no rules and no pressure controls (Net3 has none)',
		['emitters', 'rules', 'controls_pressure', 'extra_demands', 'tank_mixing', 'pump_speed_pattern'].every((c) => codes.indexOf(c) < 0), codes.join(','));
	ok('the plan reads 92 junctions, 2 reservoirs, 3 tanks, 117 pipes, 2 pumps',
		planned.parsed.nodes.filter((n) => n.type === 'junction').length === 92 && planned.parsed.nodes.filter((n) => n.type === 'reservoir').length === 2
		&& planned.parsed.nodes.filter((n) => n.type === 'tank').length === 3 && planned.parsed.links.filter((l) => l.type === 'pipe').length === 117
		&& planned.parsed.links.filter((l) => l.type === 'pump').length === 2);
	const lines = L.wtgLines(planned.notCarried);
	ok('each item has a sentence of its own, none left as a bare code', lines.length === planned.notCarried.length && lines.every((s) => /\s/.test(s) && !/\{/.test(s)), lines.join(' | '));

	// ---- 2. the menu row ----
	head('2. File > Export > Network');
	const rows = L.exportRows();
	const wtgRow = rows.filter((r) => r.key === 'lpn_file_export_item_wtg')[0];
	ok('a row keyed lpn_file_export_item_wtg, labelled ".wtg.sqlite file…" with no program named', !!wtgRow && wtgRow.label === PC.lpn_file_export_item_wtg && !/water(cad|gems)|bentley/i.test(wtgRow.label), wtgRow && wtgRow.label);
	ok('the row\'s key is its own (no other row shares it)', rows.filter((r) => r.key === 'lpn_file_export_item_wtg').length === 1 && typeof wtgRow.fn === 'function');
	ok('the tip names no program', !!PC.lpn_file_export_wtg_tip && !/water(cad|gems)|bentley/i.test(PC.lpn_file_export_wtg_tip));

	// The box the visitor sees. The stub's dialog is the page's own openDialog(), so this is the shipped box.
	head('2b. The box asked before anything is written');
	L.exportWtg();
	const dlgBody = global.document.getElementById('lpn_dialog_body'), dlgBar = global.document.getElementById('lpn_dialog_buttons');
	const walk = (e, f) => { f(e); (e.children || []).forEach((c) => walk(c, f)); };
	const texts = []; walk(dlgBody, (e) => { if (e._tag === 'li' || e._tag === 'p') { texts.push(e.textContent || e._text || ''); } });
	ok('it says the layout comes from a project the visitor saved, and names no program', texts.indexOf(PC.lpn_wtg_export_need) >= 0 && !texts.some((s) => /water(cad|gems)|bentley/i.test(s)));
	ok('it lists every item the plan cannot carry (' + lines.length + '), each as a list entry', lines.every((l) => texts.indexOf(l) >= 0), texts.length + ' lines');
	const btns = (dlgBar.children || []).map((b) => b.textContent || b._text);
	ok('its buttons are "Choose the saved project…" and Cancel', JSON.stringify(btns) === JSON.stringify([PC.lpn_wtg_export_choose, PC.lpn_cancel]), JSON.stringify(btns));
	const cancel = (dlgBar.children || [])[1];
	if (cancel && cancel.click) { cancel.click(); }

	// ---- 3. the files, as the page makes them ----
	head('3. The page writes Net3 into the saved project and zips the pair');
	const bad = await write([fileOf('only.wtg', tplWtg)]);
	ok('one file alone is refused with the "choose both" message', !bad.out && bad.err === PC.lpn_wtg_export_need_both, bad.err);
	const wrote = await write([fileOf('WTG-tgh-1.wtg', tplWtg), fileOf('WTG-tgh-1.wtg.sqlite', tplBytes)]);
	ok('written', !!wrote.out, wrote.err);
	if (!wrote.out) { console.log('\n' + fails + ' check(s) FAILED:'); process.exit(1); }
	const out = wrote.out;
	ok('the template bytes are not modified', Buffer.compare(tplBytes, fs.readFileSync(TPL_SQLITE)) === 0);
	ok('the download is one .zip named for the project and holding the two files',
		out.zipName === 'Net3.wtg.zip' && out.wtgName === 'Net3.wtg' && out.sqliteName === 'Net3.wtg.sqlite', out.zipName + ' / ' + out.wtgName + ' / ' + out.sqliteName);
	const zipPath = path.join(tmp, out.zipName);
	fs.writeFileSync(zipPath, Buffer.from(await out.zip.arrayBuffer()));
	const listing = JSON.parse(py("import zipfile,sys,json\nz=zipfile.ZipFile(sys.argv[1])\nprint(json.dumps({'bad':z.testzip(),'names':z.namelist(),'sizes':[i.file_size for i in z.infolist()]}))", zipPath));
	ok('the archive is sound and holds exactly ' + out.wtgName + ' and ' + out.sqliteName, listing.bad === null && JSON.stringify(listing.names.sort()) === JSON.stringify([out.sqliteName, out.wtgName].sort()), JSON.stringify(listing));
	py("import zipfile,sys\nzipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])", zipPath, tmp);
	const sqlitePath = path.join(tmp, out.sqliteName), wtgPath = path.join(tmp, out.wtgName);
	const pageBytes = fs.readFileSync(sqlitePath), pageWtg = fs.readFileSync(wtgPath, 'utf8');
	const pyOut = JSON.parse(py("import sqlite3,sys,json\ndb=sqlite3.connect('file:'+sys.argv[1]+'?mode=ro',uri=True)\n"
		+ "print(json.dumps({'integrity':db.execute('pragma integrity_check').fetchone()[0],'fk':len(db.execute('pragma foreign_key_check').fetchall()),'tables':db.execute(\"select count(*) from sqlite_master where type='table'\").fetchone()[0],'live':db.execute('select count(*) from HMIDomainElement where IsDeleted=0').fetchone()[0]}))", sqlitePath));
	ok('Python\'s sqlite3: integrity ok, no foreign key violations, 406 tables, 220 live elements', pyOut.integrity === 'ok' && pyOut.fk === 0 && pyOut.tables === 406 && pyOut.live === 220, JSON.stringify(pyOut));

	// ---- 4. the same as the spike's known-good output ----
	head('4. Identical to the database the spike writes straight from Net3.inp');
	const spike = require('./wtg-export.js');
	const parsed = EngCalcs.lpnInpParse(NET3);
	parsed.title = planned.parsed.title;   // the page's .inp states the project's name as the title; Notes follow it
	const watch = Array.from(new Set(parsed.links.filter((l) => l.type === 'pump').map((l) => l.id).concat(parsed.controls.map((c) => c.link))));
	const ref = await spike.epanetReference(NET3, watch, parsed.nodes.map((n) => n.id), parsed.links.map((l) => l.id));
	const known = spike.writeWtg(SQL, tplBytes, parsed, { initial: ref.initial, changes: ref.changes }, { name: 'Net3', efficiency: 75 });
	const MASK = /guid|datemodified/i;
	function dump(bytes) {
		const db = new SQL.Database(new Uint8Array(bytes)), res = {};
		const names = [];
		const st = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
		while (st.step()) { names.push(st.get()[0]); }
		st.free();
		names.forEach((t) => {
			const cols = [], c = db.prepare('PRAGMA table_info("' + t + '")');
			while (c.step()) { cols.push(c.get()[1]); }
			c.free();
			const rows = [], r = db.prepare('SELECT * FROM "' + t + '"');
			while (r.step()) {
				rows.push(JSON.stringify(r.get().map((v, i) => MASK.test(cols[i]) ? '#' : (v instanceof Uint8Array ? 'x' + Buffer.from(v).toString('hex') : v))));
			}
			r.free();
			res[t] = rows.sort();
		});
		db.close();
		return res;
	}
	const A = dump(pageBytes), B = dump(known.bytes);
	const tableNames = Object.keys(B);
	const differing = tableNames.filter((t) => JSON.stringify(A[t]) !== JSON.stringify(B[t]));
	differing.slice(0, 3).forEach((t) => { console.log('   ' + t + '\n     page : ' + A[t].join('\n            ').slice(0, 600) + '\n     spike: ' + B[t].join('\n            ').slice(0, 600)); });
	ok('all ' + tableNames.length + ' tables hold the same rows (identifiers, save times masked)', differing.length === 0 && Object.keys(A).length === tableNames.length, differing.slice(0, 5).join(', '));
	let rowCount = 0; tableNames.forEach((t) => { rowCount += B[t].length; });
	ok('...and that is not an empty comparison: ' + rowCount + ' rows', rowCount > 3000);
	const knownWtg = spike.patchWtgXml(tplWtg.toString('utf8'), known.report.removedChildScenarios, 1, known.report.removedChildAlternatives, known.report.extentFt);
	const noId = (s) => s.replace(/(<StorageFileHeader [^>]*\bId=")[0-9a-f-]{36}(")/, '$1#$2');
	if (noId(pageWtg) !== noId(knownWtg)) { const x = noId(pageWtg).split(/\r?\n/), y = noId(knownWtg).split(/\r?\n/); for (let i = 0; i < Math.max(x.length, y.length); i++) { if (x[i] !== y[i]) { console.log('   line ' + i + '\n     page : ' + String(x[i]).slice(0, 300) + '\n     spike: ' + String(y[i]).slice(0, 300)); break; } } }
	ok('the .wtg is the spike\'s, apart from its new identity', noId(pageWtg) === noId(knownWtg));
	ok('the .wtg\'s identity is new, not the template\'s', !pageWtg.includes((/<StorageFileHeader [^>]*\bId="([0-9a-f-]{36})"/.exec(tplWtg.toString('utf8')) || [])[1]));
	ok('the project name written is the project\'s own', (() => {
		const d = new SQL.Database(new Uint8Array(pageBytes)); const n = d.exec('SELECT Name FROM HMIDomainDataSet')[0].values[0][0]; d.close(); return n === 'Net3';
	})());

	// ---- 5. the reader and EPANET ----
	head('5. Read back with the WaterGEMS reader, then solved by EPANET');
	const db = await EngCalcs.lpnSqliteOpen(pageBytes);
	ok('recognised as a WaterGEMS model', EngCalcs.lpnWtgIsWtg(db));
	const display = EngCalcs.lpnWtgDisplayUnits(pageWtg);
	const rb = EngCalcs.lpnWtgRead(db, { display: display, flowUnits: 'GPM' });
	ok('read back', rb.ok, rb.message);
	const back = EngCalcs.lpnInpParse(rb.inp);
	const bn = Object.fromEntries(back.nodes.map((x) => [x.id, x])), bl = Object.fromEntries(back.links.map((x) => [x.id, x]));
	ok('every node and link of Net3 comes back (97 nodes; 117 pipes; both pumps as nodes with two pipes each)',
		parsed.nodes.every((n) => bn[n.id] && bn[n.id].type === n.type) && parsed.links.filter((l) => l.type === 'pipe').every((l) => bl[l.id] && bl[l.id].type === 'pipe')
		&& parsed.links.filter((l) => l.type === 'pump').every((p) => bl[p.id] && bl[p.id + '-A'] && bl[p.id + '-B']));
	ok('pipe lengths, diameters and roughness are Net3\'s', parsed.links.filter((l) => l.type === 'pipe').every((l) => ['length', 'diameter', 'roughness'].every((k) => Math.abs(bl[l.id][k] - l[k]) <= 1e-6 * Math.max(1, Math.abs(l[k])))));
	ok('both three-point pump curves and all five patterns come back',
		parsed.links.filter((l) => l.type === 'pump').every((pm) => JSON.stringify(back.curves.find((c) => c.id === bl[pm.id].curveId).points.map((p) => p.map((v) => Math.round(v * 1e6) / 1e6)))
			=== JSON.stringify(parsed.curves.find((c) => c.id === pm.curveId).points)) && back.patterns.length === 5);
	ok('EPS: 24 h, 1 h step, starting at midnight', back.times.duration === 86400 && back.times.hydraulicStep === 3600 && back.times.startClock === 0);
	const q = (sql) => db.select(sql).rows;
	const setId = q('SELECT Operational_IdahoControlSetID FROM Operational_SystemData')[0][0];
	ok('the Base operational alternative names a control set holding all six controls', setId !== null && q('SELECT COUNT(*) FROM IdahoLogicalControlSet_LogicalControlCollection WHERE SupportElementID = ' + setId)[0][0] === 6);
	ok('four of them are tank-level conditions (less than = 3, greater than = 1) and two are clock times',
		q('SELECT COUNT(*) FROM IdahoControlCondition_SimpleConditionType_ElementType WHERE ControlConditionElementType = 52')[0][0] === 4
		&& q('SELECT COUNT(*) FROM IdahoControlCondition_ConditionType_SimpleConditionType WHERE SimpleConditionType = 2')[0][0] === 2);
	// the read-back network, with the controls the reader leaves unread put back from the tables, as wtg-export-harness.js does
	const label = (id) => q('SELECT Label FROM HMIModelingElement WHERE ElementID = ' + id)[0][0];
	const hm = (secs) => { const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), x = secs % 60; return (h % 12 === 0 ? 12 : h % 12) + ':' + String(m).padStart(2, '0') + (x ? ':' + String(x).padStart(2, '0') : '') + (h < 12 ? ' AM' : ' PM'); };
	const ctl = q('SELECT LogicalControlCollection_IdahoLogicalControlID FROM IdahoLogicalControlSet_LogicalControlCollection WHERE SupportElementID = ' + setId).map((r) => {
		const k = r[0], c = q('SELECT IdahoControl_ControlCondition, IdahoControl_ControlAction FROM IdahoControl WHERE SupportElementID = ' + k)[0];
		const sc = q('SELECT SimpleConditionType, CompareOperator FROM IdahoControlCondition_ConditionType_SimpleConditionType WHERE SupportElementID = ' + c[0])[0];
		const act = q('SELECT SimpleActionType_Element FROM IdahoControlAction_ControlActionType_SimpleActionType WHERE SupportElementID = ' + c[1])[0];
		const st = q('SELECT ActionPipeStatus FROM IdahoControlAction_PipeAttribute_ActionPipeStatusType WHERE SupportElementID = ' + c[1])[0][0] === 0 ? 'OPEN' : 'CLOSED';
		if (sc[0] === 2) { return 'LINK ' + label(act[0]) + ' ' + st + ' AT CLOCKTIME ' + hm(q('SELECT ClockTimeType_ClockTime FROM IdahoControlCondition_SimpleConditionType_ClockTimeType WHERE SupportElementID = ' + c[0])[0][0] % 86400); }
		const e = q('SELECT ElementType_Element, ElementType_TankLevel FROM IdahoControlCondition_SimpleConditionType_ElementType WHERE SupportElementID = ' + c[0])[0];
		return 'LINK ' + label(act[0]) + ' ' + st + ' IF NODE ' + label(e[0]) + ' ' + (sc[1] === 3 ? 'BELOW' : 'ABOVE') + ' ' + e[1];
	});
	const rbInp = rb.inp.replace(/\[CONTROLS\][\s\S]*?(?=\n\[)/, '').replace(/\n\[TIMES\]/, '\n[CONTROLS]\n' + ctl.join('\n') + '\n\n[TIMES]');
	const ids = parsed.nodes.map((n) => n.id), lids = parsed.links.map((l) => l.id);
	const R0 = await spike.epanetReference(NET3, [], ids, lids), R1 = await spike.epanetReference(rbInp, [], ids, lids);
	let wh = 0, wq = 0;
	Object.keys(R0.snapshots).forEach((t) => {
		ids.forEach((i) => { wh = Math.max(wh, Math.abs(R0.snapshots[t].heads[i] - R1.snapshots[t].heads[i])); });
		lids.forEach((i) => { wq = Math.max(wq, Math.abs(R0.snapshots[t].flows[i] - R1.snapshots[t].flows[i])); });
	});
	ok('EPANET, 24 hours: worst head ' + wh.toFixed(4) + ' ft (tolerance 0.05), worst flow ' + wq.toFixed(3) + ' gpm (tolerance 3)', wh < 0.05 && wq < 3);

	// ---- 6. refusals, by name ----
	head('6. What the export refuses, by name');
	setUnitSet('si');
	openExample(L, 'si');
	const pu = L.wtgPlan();
	ok('a project in SI units (the gallery\'s SI example) is refused for its flow unit', pu.ok && pu.refused.some((r) => r.code === 'units'), JSON.stringify(pu.refused));
	ok('...and the sentence names the unit and says only gpm is written', pu.ok && L.wtgRefusal(pu.refused[0]) === fillP('lpn_wtg_export_no_units', { unit: 'LPS' }), pu.ok && L.wtgRefusal(pu.refused[0]));
	setUnitSet('us');
	// A pump with a four-point head curve: Net3 with one more point on pump 10's curve, imported as a project of its own
	const FOURPT = NET3.replace(/( 1\s+4000\.\s+63\.\s*\r?\n)/, '$1 1               \t5000.       \t40.         \n');
	ok('(the four-point network differs from Net3 only by that point)', FOURPT !== NET3 && FOURPT.length - NET3.length < 60);
	L.importInp({ name: 'Net3-four-point.inp', _text: FOURPT });
	const p4 = L.wtgPlan();
	ok('a pump with a four-point head curve is refused, naming pump 10 and no other', p4.ok && p4.refused.length === 1 && p4.refused[0].code === 'pump_curve' && JSON.stringify(p4.refused[0].ids) === '["10"]', JSON.stringify(p4.refused));
	ok('...in the sentence the language file gives, naming the pump', L.wtgRefusal(p4.refused[0]) === fillP('lpn_wtg_export_no_pump_curve', { ids: '10' }), L.wtgRefusal(p4.refused[0]));
	const w4 = await write([fileOf('a.wtg', tplWtg), fileOf('a.wtg.sqlite', tplBytes)]);
	ok('...and the write is refused with the same reason, no file made', !w4.out && w4.err === fillP('lpn_wtg_export_failed', { detail: L.wtgRefusal(p4.refused[0]) }), w4.err);
	// Emitters and a second demand are carried nowhere, so the plan names them. Net3 again, with an emitter on junction 15.
	const EMIT = NET3.replace(/\[EMITTERS\][^\[]*/, '').replace(/\[PATTERNS\]/, '[EMITTERS]\n 15  2.5\n\n[PATTERNS]');
	L.importInp({ name: 'Net3-emitter.inp', _text: EMIT });
	const pe = L.wtgPlan();
	const em = pe.ok && pe.notCarried.filter((x) => x.code === 'emitters')[0];
	ok('an emitter on junction 15 is named in what the file cannot carry', !!em && JSON.stringify(em.ids) === '["15"]', pe.ok && JSON.stringify(pe.notCarried.map((x) => x.code)));
	ok('...with a sentence naming the junction', !!em && L.wtgLines([em])[0] === fillP('lpn_wtg_export_lost_emitters', { ids: '15' }), em && L.wtgLines([em])[0]);

	// ---- 7. the schema gate and the template checks ----
	head('7. The template is checked before anything is written');
	const sv = await EngCalcs.lpnWtgExportBuild(planned, { sqlite: tplBytes, wtg: tplWtg.toString('utf8'), epanet: await EngCalcs.lpnEpanetLoad(), name: 'Net3' });
	ok('the tested schema version is on the list', EngCalcs.lpnWtgExportTestedSchemas.indexOf(sv.report.schemaVersion) >= 0, sv.report.schemaVersion);
	const odd = new SQL.Database(new Uint8Array(tplBytes));
	odd.run("UPDATE HMISchemaVersionInfo SET Value = '1.0.99.0' WHERE Name = 'HMICoreSchemaVersion'");
	const oddBytes = odd.export(); odd.close();
	let err = null;
	try { await EngCalcs.lpnWtgExportBuild(planned, { sqlite: oddBytes, wtg: tplWtg.toString('utf8'), epanet: await EngCalcs.lpnEpanetLoad() }); } catch (e) { err = e; }
	ok('a schema version not on the list is refused, naming it', !!err && err.code === 'schema' && err.message.indexOf('1.0.99.0') >= 0, err && err.message);
	err = null;
	try { await EngCalcs.lpnWtgExportBuild(planned, { sqlite: Uint8Array.from([1, 2, 3, 4]), wtg: '<x/>', epanet: await EngCalcs.lpnEpanetLoad() }); } catch (e) { err = e; }
	ok('a file that is not a project is refused', !!err && err.code === 'template', err && err.message);
	const bare = new SQL.Database(new Uint8Array(tplBytes));
	bare.run('UPDATE HMIDomainElement SET IsDeleted = 1 WHERE DomainElementTypeID = 52');
	const bareBytes = bare.export(); bare.close();
	err = null;
	try { await EngCalcs.lpnWtgExportBuild(planned, { sqlite: bareBytes, wtg: tplWtg.toString('utf8'), epanet: await EngCalcs.lpnEpanetLoad() }); } catch (e) { err = e; }
	ok('a saved project with no tank to copy is refused, naming the kind', !!err && err.code === 'template-kind' && JSON.stringify(err.ids) === '["tank"]', err && err.message);

	console.log(fails ? '\n' + fails + ' check(s) FAILED' : '\nall ' + checks + ' checks passed');
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });
