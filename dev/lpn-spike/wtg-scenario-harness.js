// The WaterGEMS child-scenario writer (Task 749, candidate `opts.candidate.scenarios`, 2026-11-13).
//   node dev/lpn-spike/wtg-scenario-harness.js
// Writes a base network and child scenarios whose overrides are a pipe diameter and a junction's demand (the two that Tom's
// pair of 2026-11-13 differs on, ctl-composite-test and ctl-composite-test-w-scenario, dev/wtg-export.md "Child scenarios"),
// resolves each scenario back from the file twice (by this harness's own walk up the alternatives, and through the reader of
// branch feat/sqlite-reader), and checks the structure against what the saved pair and Tom's TGH-1 show. NOT proof that
// WaterGEMS opens or resolves it: only Tom's copy can say that.
//   node dev/lpn-spike/wtg-scenario-harness.js --page   (section 9 only: it runs in a child process of its own, the page's code and this
//   harness's writer-only environment not sharing one set of globals)
'use strict';
const fs = require('fs');
const path = require('path');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAILED: ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const GPM = 0.22280092967190634 / 100;


// ---------------------------------------------------------------------------------------------
// 9. THE PAGE PATH (Task 749): a project with Base and three scenarios exported through the same functions the File > Export menu
// calls (wtgExportPlan, exportWtgFile's box, wtgExportWrite), with the real page code under the DOM stub. Run as a child process.
// ---------------------------------------------------------------------------------------------
async function pagePath() {
	const os = require('os');
	const { execFileSync } = require('child_process');
	const { ROOT, setUnitSet, loadLoopedNetwork } = require('./lpn-dom-stub.js');
	const helper = require('./wtg-sqljs.js');
	const zlib = require('zlib');
	let rp = null;
	try { rp = helper.readerPaths(); helper.sqlJsPath(); } catch (e) { rp = null; }
	if (!rp) { console.log('  (the reader of feat/sqlite-reader or sql.js is not here: the page path is NOT RUN)'); return; }
	require(ROOT + 'js/lpn-inp.js'); require(ROOT + 'js/lpn-net.js'); require(ROOT + 'js/lpn-patterns.js'); require(ROOT + 'js/lpn-wtg-export.js');
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
		"\t\timportInp: importInpFromFile, wtgPlan: wtgExportPlan, wtgWrite: wtgExportWrite, wtgLines: wtgNotCarriedLines, exportWtg: exportWtgFile,\n" +
		"\t\tcreateScenario: createScenario, switchScenario: switchScenario, baseScenario: baseScenario, activeScenario: activeScenario,\n" +
		"\t\tsetProp: setProp, nodeById: nodeById, linkById: linkById, getScenarios: function () { return scenarios; },\n" +
		"\t\tbuildLayers: function () { svg = document.getElementById('lpn_canvas');\n" +
		"\t\t\tworld = el('g', {}, svg);\n" +
		"\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
		"\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
		"\t\t\tlabelsLayer = el('g', {}, world);\n" +
		"\t\t\trubberBandEl = el('line', {}, world); }"
	);
	L.buildLayers();
	const EC = global.EngCalcs, PC = EC.pageConfig;
	const initSqlJs = require(helper.sqlJsPath()), wasm = fs.readFileSync(helper.wasmPath());
	EC.lpnWtgExportSetEngine(initSqlJs, wasm);
	global.window.EngCalcs = EC;
	require(rp.sqlite); require(rp.wtg);
	EC.lpnSqliteSetEngine(initSqlJs, wasm);
	const tplDir = path.join(ROOT, 'js', 'data', 'wtg-template');
	EC.lpnWtgExportSetTemplate(zlib.gunzipSync(fs.readFileSync(path.join(tplDir, 'wtg-template.wtg.sqlite.gz'))), zlib.gunzipSync(fs.readFileSync(path.join(tplDir, 'wtg-template.wtg.gz'))).toString('utf8'));

	setUnitSet('us');
	L.importInp({ name: 'scen.inp', _text: require('./wtg-composite-test.js').compositeNet() });
	const base = L.baseScenario();
	const mk = (name, parent, edit) => { const sc = L.createScenario(name, parent); edit(); return sc; };
	// Wet year: what the writer carries (pipe 2 diameter 8 to 10 in, J1 demand 300 to 500 gpm). Odd one: a pipe's length, which it does not.
	const wet = mk('Wet year', undefined, () => { L.setProp(L.linkById('2'), 'diameter', 10); L.setProp(L.nodeById('J1'), 'demand', 500); });
	const odd = mk('Odd one', undefined, () => { L.setProp(L.linkById('3'), 'length', 650); });
	const deep = mk('Deeper', wet.id, () => { L.setProp(L.nodeById('J1'), 'demand', 520); });
	// Higher ground: a junction's elevation (carried). Pump side: the elevation of J0, an end of pump PU1 (refused: the writer copies it onto the pump's own node).
	// Other base: a scenario with a Base of its own. wet YEAR: a name that differs from Wet year in capitals only.
	const high = mk('Higher ground', undefined, () => { L.setProp(L.nodeById('J1'), 'elev', L.nodeById('J1').elev + 5); });
	const pside = mk('Pump side', undefined, () => { L.setProp(L.nodeById('J0'), 'elev', L.nodeById('J0').elev + 5); });
	const other = mk('Other base', undefined, () => { });
	other.root = true;
	const dup = mk('wet YEAR', undefined, () => { L.setProp(L.nodeById('J1'), 'demand', 510); });
	L.switchScenario(base.id);

	console.log('\n9. The page path: Base, Wet year and Higher ground (carried), Odd one (a length), Pump side (a pump end), Other base (a root), wet YEAR (a taken name), Deeper (a child of Wet year)');
	const planned = L.wtgPlan();
	ok('the plan is made and holds the three scenarios', planned.ok && planned.scenarios && planned.scenarios.length === 7, planned.ok ? '' : planned.detail);
	ok('Wet year and Higher ground will be written', planned.scenarioWritten.slice().sort().join() === 'Higher ground,Wet year', planned.scenarioWritten.join());
	const lines = L.wtgLines(planned.notCarried);
	const oddLine = lines.find((x) => /^Scenario Odd one is not written/.test(x)), deepLine = lines.find((x) => /^Scenario Deeper is not written/.test(x));
	ok('Odd one is named, with what it changes in a visitor label (Length, pipe 3), no parser field name', !!oddLine && /not write: Length \(3\)\./.test(oddLine) && !/\{|pipe length/.test(oddLine), oddLine);
	const psLine = lines.find((x) => /^Scenario Pump side is not written/.test(x)), rtLine = lines.find((x) => /^Scenario Other base is not written/.test(x)), dupLines = lines.filter((x) => /^Scenario wet YEAR is not written/.test(x));
	ok('Pump side is named: elevation at a pump or valve (J0)', !!psLine && /Elevation at a pump or valve \(J0\)/.test(psLine), psLine);
	ok('Other base is named as a Base of its own, not as a scenario that is not a child of Base', !!rtLine && /a Base of its own/.test(rtLine), rtLine);
	ok('wet YEAR is refused in the plan, for its name, and named once', dupLines.length === 1 && /its name is already used/.test(dupLines[0]), JSON.stringify(dupLines));
	ok('Deeper is named: only children of Base are written', !!deepLine && /only children of Base/.test(deepLine), deepLine);
	ok('the open scenario was put back (Base)', L.activeScenario().id === base.id);
	const was = planned.parsed;
	ok('the plan leaves the project\'s scenarios as they were (4 scenarios)', L.getScenarios().length === 8);

	// The box the menu opens, from inside Wet year: Base is still the file's Base.
	L.switchScenario(wet.id);
	L.exportWtg();
	for (let k = 0; k < 400 && !JSON.stringify((global.document.getElementById('lpn_dialog_body').children || []).map((e) => e.textContent || e._text || '')).includes('does not yet write'); k++) { await new Promise((r) => setTimeout(r, 25)); }
	const walk = (e, f) => { f(e); (e.children || []).forEach((c) => walk(c, f)); };
	const texts = []; walk(global.document.getElementById('lpn_dialog_body'), (e) => { if (e._tag === 'li' || e._tag === 'p') { texts.push(e.textContent || e._text || ''); } });
	ok('the box says what it holds: Base and, as a child of Base, Wet year', texts.some((x) => x.indexOf('It holds the Base scenario and, as children of Base, scenarios (2): ') === 0), JSON.stringify(texts.slice(0, 2)));
	ok('and lists Odd one and Deeper as not written', texts.some((x) => /^Scenario Odd one is not written/.test(x)) && texts.some((x) => /^Scenario Deeper is not written/.test(x)));
	const cancel = (global.document.getElementById('lpn_dialog_buttons').children || [])[1];
	ok('the box names Higher ground as written, in the one-or-many form', texts.some((x) => /scenarios \(2\): (Higher ground, Wet year|Wet year, Higher ground)\./.test(x)), JSON.stringify(texts.slice(0, 1)));
	if (cancel && cancel.click) { cancel.click(); }
	ok('the scenario open when the box was asked for is still open', L.activeScenario().id === wet.id);

	const wrote = await new Promise((resolve) => L.wtgWrite((out, err) => resolve({ out: out, err: err }), planned));
	ok('written', !!wrote.out, wrote.err);
	if (!wrote.out) { return; }
	const recs = wrote.out.report.scenarios, rec = (n) => recs.find((x) => x.name === n) || {};
	ok('the writer was handed all seven and wrote two: Wet year and Higher ground', recs.length === 7 && rec('Wet year').written === true && rec('Higher ground').written === true && recs.filter((x) => x.written).length === 2, JSON.stringify(recs.map((r) => [r.name, r.written, r.reason])));
	ok('the refusals are the reasons the plan gave', rec('Odd one').reason === 'unsupported' && rec('Deeper').reason === 'nested' && rec('Pump side').reason === 'unsupported' && rec('Other base').reason === 'root' && rec('wet YEAR').reason === 'name');
	ok('the receipt lists each refused scenario once (plan and writer do not both name it)', (() => { const it = wrote.out.planned.notCarried.filter((x) => x.code === 'scenario'); return it.length === 5 && new Set(it.map((x) => x.ids[0])).size === 5; })());
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'wtg-scen-page-'));
	fs.writeFileSync(path.join(tmp, 'x.zip'), Buffer.from(await wrote.out.zip.arrayBuffer()));
	execFileSync('python3', ['-I', '-c', "import zipfile,sys\nzipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])", path.join(tmp, 'x.zip'), tmp]);
	const bytes = fs.readFileSync(path.join(tmp, wrote.out.sqliteName)), wtg = fs.readFileSync(path.join(tmp, wrote.out.wtgName), 'utf8');
	const r = EC.lpnWtgRead(await EC.lpnSqliteOpen(bytes), { flowUnits: 'GPM', display: EC.lpnWtgDisplayUnits(wtg) });
	ok('read back from the file', r.ok, r.message);
	const scs = r.scenarios || [];
	ok('the file holds two child scenarios, Wet year and Higher ground', scs.map((x) => x.name).sort().join() === 'Higher ground,Wet year', JSON.stringify(scs.map((x) => x.name)));
	const hg = scs.find((x) => x.name === 'Higher ground');
	ok('Higher ground differs from Base in J1\'s elevation and nothing else', !!hg && Object.keys(hg.differences).join() === 'n:J1' && hg.differences['n:J1'].elev !== undefined, JSON.stringify(hg && hg.differences));
	const dif = ((scs.find((x) => x.name === 'Wet year')) || {}).differences || {};
	ok('Wet year differs from Base in pipe 2 (diameter 10 in) and J1 (demand 500 gpm), and nothing else', Object.keys(dif).sort().join() === 'l:2,n:J1' && dif['l:2'].diameter === 10 && Math.abs(dif['n:J1'].demand - 500) < 1e-6, JSON.stringify(dif));
	const baseInp = EC.lpnInpParse(r.inp);
	ok('the file\'s Base is Base (pipe 2 8 in, J1 300 gpm) though Wet year was open when it was exported', baseInp.links.find((l) => l.id === '2').diameter === 8 && baseInp.nodes.find((n) => n.id === 'J1').demand === 300);
	ok('the .wtg names the child in its tree', wtg.indexOf('<ScenarioSettings ScenarioID="' + rec('Wet year').id + '"') >= 0);
	ok('the open scenario is still Wet year after the write', L.activeScenario().id === wet.id);
	fs.rmSync(tmp, { recursive: true, force: true });
}

(async function () {
	if (process.argv[2] === '--page') { await pagePath(); console.log(fails ? '\n' + fails + ' FAILED' : '\nall checks passed'); process.exit(fails ? 1 : 0); }
	const helper = require('./wtg-sqljs.js');
	try { helper.sqlJsPath(); } catch (e) { console.log('NOT RUN: sql.js not found (' + e.message + ').'); process.exit(0); }
	const ft = require('./wtg-feature-tests.js');
	const ct = require('./wtg-composite-test.js');
	const env = await ft.setup();
	const EC = env.EngCalcs, SQL = env.SQL, lib = env.lib;
	const rp = helper.readerPaths();
	let reader = false;
	if (rp) {
		require(rp.sqlite); require(rp.wtg);
		const initSqlJs = require(helper.sqlJsPath());
		EC.lpnSqliteSetEngine(initSqlJs, fs.readFileSync(helper.wasmPath()));
		reader = true;
	}
	const rows = (db, sql, params) => { const st = db.prepare(sql), o = []; if (params) { st.bind(params); } while (st.step()) { o.push(st.getAsObject()); } st.free(); return o; };
	const one = (db, sql, params) => rows(db, sql, params)[0];

	const BASE = ct.compositeNet();
	// Tom's Scenario - 1: J1 demand 300 -> 500 gpm, pipe 2 diameter 8 -> 10 in (his .inp against the Base he saved).
	const SCEN1 = BASE.replace(/ J1\s+50\s+300/, ' J1 50 500').replace(/ 2\s+J0\s+J1\s+1000\s+8 /, ' 2 J0 J1 1000 10 ');
	ok('the scenario text differs from the Base text in two places', SCEN1 !== BASE && /J1 50 500/.test(SCEN1) && /J0 J1 1000 10 /.test(SCEN1));
	const edit = (re, to) => { const t = BASE.replace(re, to); if (t === BASE) { throw new Error('edit did not apply: ' + re); } return t; };
	const DEMAND_ONLY = edit(/ J1\s+50\s+300/, ' J1 50 420');
	const DIAM_ONLY = edit(/ 3\s+J1\s+T1\s+500\s+8 /, ' 3 J1 T1 500 12 ');
	const ROUGH = edit(/ 3\s+J1\s+T1\s+500\s+8\s+120/, ' 3 J1 T1 500 8 100');
	const ELEV = edit(/ J1\s+50\s+300/, ' J1 55 300');
	// What the writer still does not store: a pipe's length, a tank's elevation.
	const LONGER = edit(/ 3\s+J1\s+T1\s+500\s+8 /, ' 3 J1 T1 650 8 ');
	const TANKELEV = edit(/ T1\s+120\s+12/, ' T1 125 12');

	function write(scenarios, extra) {
		const parsed = EC.lpnInpParse(BASE);
		const list = (scenarios || []).map((s) => ({ name: s[0], inp: s[1] }));
		const o = Object.assign({ name: 'scen-test', efficiency: 75, candidate: scenarios ? { scenarios: list } : undefined }, extra || {});
		const out = lib.writeWtg(SQL, env.tplSqlite, parsed, { initial: {}, changes: [] }, o);
		return { out: out, report: out.report, db: new SQL.Database(new Uint8Array(out.bytes)) };
	}

	// The resolver of this harness: scenario S's value of a table's row for an element, walking the alternatives S names.
	function resolveRow(db, scenario, table, element, typeId) {
		let s = scenario;
		for (let guard = 0; guard < 8 && s !== null; guard++) {
			const pick = one(db, 'SELECT AlternativeID AS a, IsLocal AS l FROM HMIScenarioAlternative WHERE ScenarioID = ? AND AlternativeTypeID = ?', [s, typeId]);
			if (pick.l === 1 || one(db, 'SELECT ParentID AS p FROM HMIScenario WHERE ScenarioID = ?', [s]).p === null) {
				const r = rows(db, 'SELECT * FROM "' + table + '" WHERE DomainElementID = ? AND AlternativeID = ?', [element, pick.a]);
				if (r.length) { return r; }
				// no row of its own: Base's alternative (the parent alternative)
				const par = one(db, 'SELECT ParentID AS p FROM HMIAlternative WHERE AlternativeID = ?', [pick.a]).p;
				return rows(db, 'SELECT * FROM "' + table + '" WHERE DomainElementID = ? AND AlternativeID = ?', [element, par === null ? pick.a : par]);
			}
			s = one(db, 'SELECT ParentID AS p FROM HMIScenario WHERE ScenarioID = ?', [s]).p;
		}
		return [];
	}
	const elOf = (db, label) => one(db, 'SELECT m.ElementID AS id FROM HMIModelingElement m JOIN HMIDomainElement d ON d.DomainElementID = m.ElementID WHERE m.Label = ? AND d.IsDeleted = 0', [label]).id;
	const PHYS = 4, DEMAND = 20;

	console.log('\n1. Tom\'s Scenario - 1 (a pipe diameter and a junction demand), written as a child of Base');
	const A = write([['Scenario - 1', SCEN1]]);
	ok('written, integrity ok, no foreign key violations, no skipped column', A.report.integrity === 'ok' && A.report.foreignKeyViolations === 0 && A.report.skippedColumns.length === 0, A.report.integrity + ' / ' + A.report.foreignKeyViolations + ' / ' + A.report.skippedColumns.join(','));
	ok('report: one scenario written, one pipe diameter and one junction demand', A.report.scenarios.length === 1 && A.report.scenarios[0].written && A.report.scenarios[0].pipeDiameters === 1 && A.report.scenarios[0].junctionDemands === 1, JSON.stringify(A.report.scenarios));
	const sc = rows(A.db, 'SELECT * FROM HMIScenario ORDER BY ScenarioID');
	ok('two scenarios, the new one a child of Base (ParentID 1, not deleted)', sc.length === 2 && sc[0].ScenarioID === 1 && sc[0].ParentID === null && sc[1].ParentID === 1 && sc[1].IsDeleted === 0, JSON.stringify(sc));
	const S = sc[1].ScenarioID;
	const me = one(A.db, 'SELECT * FROM HMIModelingElement WHERE ElementID = ?', [S]);
	ok('the scenario is a modeling element of type 2, labelled as named, with the smart label the save has', me.ElementType === 2 && me.Label === 'Scenario - 1' && me.SmartLabel === 'Scenario - 0000001', JSON.stringify(me));
	ok('Base stays the active scenario', one(A.db, 'SELECT ActiveScenarioID AS a FROM HMIDomainDataSet').a === 1);
	const sa = rows(A.db, 'SELECT * FROM HMIScenarioAlternative WHERE ScenarioID = ? ORDER BY AlternativeTypeID', [S]);
	const bsa = rows(A.db, 'SELECT * FROM HMIScenarioAlternative WHERE ScenarioID = 1 ORDER BY AlternativeTypeID');
	ok('the child names one alternative of each of the 18 types, as the save does', sa.length === 18 && bsa.length === 18, sa.length + ' / ' + bsa.length);
	const localTypes = sa.filter((r) => r.IsLocal === 1).map((r) => r.AlternativeTypeID).sort((a, b) => a - b);
	ok('local only for physical (4) and demand (20); the other 16 inherit Base\'s alternative', localTypes.join(',') === '4,20' && sa.filter((r) => r.IsLocal === 0).every((r) => bsa.some((b) => b.AlternativeTypeID === r.AlternativeTypeID && b.AlternativeID === r.AlternativeID)), localTypes.join(','));
	const ca = rows(A.db, 'SELECT * FROM HMIAlternative WHERE ParentID IS NOT NULL ORDER BY AlternativeTypeID');
	ok('two child alternatives, each with its Base alternative as parent, level 2, of the same type', ca.length === 2 && ca.every((a) => a.Level === 2 && a.IsDeleted === 0 && one(A.db, 'SELECT AlternativeTypeID AS t, Level AS l FROM HMIAlternative WHERE AlternativeID = ?', [a.ParentID]).t === a.AlternativeTypeID && one(A.db, 'SELECT Level AS l FROM HMIAlternative WHERE AlternativeID = ?', [a.ParentID]).l === 1), JSON.stringify(ca));
	ok('the child alternatives are the local picks', ca.every((a) => sa.some((r) => r.AlternativeID === a.AlternativeID && r.IsLocal === 1)));
	const co = rows(A.db, 'SELECT * FROM HMIScenarioCalculationOptions WHERE ScenarioID = ?', [S]), bco = rows(A.db, 'SELECT * FROM HMIScenarioCalculationOptions WHERE ScenarioID = 1');
	ok('ten calculation-option rows, inherited (IsLocal 0) and naming Base\'s', co.length === 10 && co.every((r) => r.IsLocal === 0 && bco.some((b) => b.NumericalEngineTypeID === r.NumericalEngineTypeID && b.CalculationOptionsID === r.CalculationOptionsID)));
	const qb = rows(A.db, 'SELECT * FROM QBATDefinition');
	ok('one QBAT definition support element (type 1000) whose alternative is Base\'s Active Topology', qb.length === 1 && one(A.db, 'SELECT SupportElementTypeID AS t FROM HMISupportElement WHERE SupportElementID = ?', [qb[0].SupportElementID]).t === 1000 && one(A.db, 'SELECT AlternativeTypeID AS t FROM HMIAlternative WHERE AlternativeID = ?', [qb[0].QBATDefinition_HMIActiveTopologyAlternative]).t === 3, JSON.stringify(qb));
	const cnt = (t, id) => one(A.db, 'SELECT Count AS c FROM HMIElementTypeCount WHERE ElementType = ? AND ElementTypeID = ?', [t, id]).c;
	ok('element-type counts: scenarios 2, physical alternatives 2, demand alternatives 2, QBAT definitions 1', cnt(2, 0) === 2 && cnt(1, 4) === 2 && cnt(1, 20) === 2 && cnt(4, 1000) === 1, [cnt(2, 0), cnt(1, 4), cnt(1, 20), cnt(4, 1000)].join(','));

	console.log('\n   resolved by this harness, up the alternatives');
	const p2 = elOf(A.db, '2'), p3 = elOf(A.db, '3'), j1 = elOf(A.db, 'J1'), j0 = elOf(A.db, 'J0');
	const dia = (scen, el) => resolveRow(A.db, scen, 'IdahoPipe_Physical_Data', el, PHYS)[0].Physical_PipeDiameter * 12;
	ok('pipe 2 diameter: Base 8 in, Scenario - 1 10 in', near(dia(1, p2), 8, 1e-9) && near(dia(S, p2), 10, 1e-9), dia(1, p2) + ' / ' + dia(S, p2));
	ok('pipe 3 (not overridden) is 8 in in both and has no row of its own in the child alternative', near(dia(S, p3), 8, 1e-9) && rows(A.db, 'SELECT 1 FROM IdahoPipe_Physical_Data WHERE DomainElementID = ? AND AlternativeID = ?', [p3, ca.find((a) => a.AlternativeTypeID === PHYS).AlternativeID]).length === 0);
	const dem = (scen, el) => resolveRow(A.db, scen, 'IdahoDemandNode_Demand_DemandCollection', el, DEMAND).map((r) => r.DemandCollection_BaseFlow / GPM);
	ok('J1 demand: Base 300 gpm, Scenario - 1 500 gpm, same pattern', near(dem(1, j1)[0], 300, 1e-6) && near(dem(S, j1)[0], 500, 1e-6) && dem(1, j1).length === 1 && dem(S, j1).length === 1
		&& resolveRow(A.db, S, 'IdahoDemandNode_Demand_DemandCollection', j1, DEMAND)[0].DemandCollection_DemandPattern === resolveRow(A.db, 1, 'IdahoDemandNode_Demand_DemandCollection', j1, DEMAND)[0].DemandCollection_DemandPattern, dem(1, j1) + ' / ' + dem(S, j1));
	ok('J0 (no demand) is untouched: no demand row in either', dem(S, j0).length === 0);
	ok('the pipe\'s other rows of the physical alternative travel with it (BaseLink_Physical_Data), unchanged apart from the diameter',
		(() => { const a = resolveRow(A.db, S, 'BaseLink_Physical_Data', p2, PHYS)[0], b = resolveRow(A.db, 1, 'BaseLink_Physical_Data', p2, PHYS)[0];
			const keys = Object.keys(a).filter((k) => k !== 'AlternativeID' && k !== 'ItemID'); return keys.every((k) => a[k] === b[k]) && a.AlternativeID !== b.AlternativeID; })());
	// Base's own values are the ones the plain writer gives (the child adds rows and changes none of Base's).
	const plain = write(null);
	const baseRowsOnly = (db) => rows(db, "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").map((t) => t.name).filter((t) => !/^HMI(Scenario|Alternative|ModelingElement|ElementTypeCount|SupportElement|DomainDataSet)|^QBAT/.test(t) && !/^sqlite_/.test(t)).map((t) => {
		const cols = rows(db, 'PRAGMA table_info("' + t + '")').map((c) => c.name);
		const sel = cols.filter((c) => !/guid|datemodified|ItemID/i.test(c)).map((c) => '"' + c + '"').join(',');
		if (!sel) { return t + ':0'; }
		const bases = rows(db, 'SELECT AlternativeID AS a FROM HMIAlternative WHERE ParentID IS NULL').map((r) => r.a);
		const where = cols.indexOf('AlternativeID') >= 0 ? ' WHERE AlternativeID IN (' + bases.join(',') + ')' : '';
		return t + ':' + rows(db, 'SELECT ' + sel + ' FROM "' + t + '"' + where).map((r) => JSON.stringify(r)).sort().join('|');
	}).join('\n');
	ok('every Base row (all other tables, and the Base alternatives) equals the plain writer\'s (the new elements take the ids after every Base element\'s)', (() => {
		const x = baseRowsOnly(A.db).split('\n'), y = baseRowsOnly(plain.db).split('\n');
		const dd = x.map((l, i) => l === y[i] ? null : l.split(':')[0]).filter(Boolean);
		if (dd.length) { console.log('   differing tables: ' + dd.join(', ')); }
		return dd.length === 0 && x.length === y.length;
	})());

	console.log('\n   read back through the reader of feat/sqlite-reader');
	if (!reader) { console.log('   (reader not found: skipped)'); } else {
		const d = await EC.lpnSqliteOpen(Buffer.from(A.out.bytes));
		const r = EC.lpnWtgRead(d, { flowUnits: 'GPM' });
		ok('read back, and the Base scenario of it is what the plain write reads back', r.ok, r.message);
		const rp0 = EC.lpnWtgRead(await EC.lpnSqliteOpen(Buffer.from(plain.out.bytes)), { flowUnits: 'GPM' });
		ok('the Base network read back is the same text with and without the child scenario', r.inp === rp0.inp);
		const rec = (r.scenarios || []).find((x) => x.name === 'Scenario - 1');
		ok('the scenario is listed, with its physical and demand alternatives', !!rec && rec.alternatives.physical && rec.alternatives.demand, JSON.stringify(rec && rec.alternatives));
		const diff = (rec && rec.differences) || {};
		ok('its differences from Base: pipe 2 diameter 10 and J1 demand 500, and nothing else', Object.keys(diff).sort().join(',') === 'l:2,n:J1' && diff['l:2'].diameter === 10 && near(diff['n:J1'].demand, 500, 1e-6), JSON.stringify(diff));
	}

	console.log('\n2. One kind at a time');
	{
		const B = write([['Bigger demand', DEMAND_ONLY]]);
		const s2 = rows(B.db, 'SELECT ScenarioID AS s FROM HMIScenario WHERE ParentID IS NOT NULL')[0].s;
		const loc = rows(B.db, 'SELECT AlternativeTypeID AS t FROM HMIScenarioAlternative WHERE ScenarioID = ? AND IsLocal = 1', [s2]).map((r) => r.t);
		ok('demand only: one child alternative, of the demand type', loc.join(',') === String(DEMAND) && rows(B.db, 'SELECT * FROM HMIAlternative WHERE ParentID IS NOT NULL').length === 1);
		ok('J1 demand 420 gpm in the scenario, 300 in Base', near(resolveRow(B.db, s2, 'IdahoDemandNode_Demand_DemandCollection', elOf(B.db, 'J1'), DEMAND)[0].DemandCollection_BaseFlow / GPM, 420, 1e-6));
		ok('element-type counts: demand alternatives 2, physical alternatives 1', one(B.db, 'SELECT Count AS c FROM HMIElementTypeCount WHERE ElementType = 1 AND ElementTypeID = 20').c === 2 && one(B.db, 'SELECT Count AS c FROM HMIElementTypeCount WHERE ElementType = 1 AND ElementTypeID = 4').c === 1);
		const C = write([['Wider pipe', DIAM_ONLY]]);
		const s3 = rows(C.db, 'SELECT ScenarioID AS s FROM HMIScenario WHERE ParentID IS NOT NULL')[0].s;
		const loc3 = rows(C.db, 'SELECT AlternativeTypeID AS t FROM HMIScenarioAlternative WHERE ScenarioID = ? AND IsLocal = 1', [s3]).map((r) => r.t);
		ok('diameter only: one child alternative, of the physical type; pipe 3 is 12 in, pipe 2 still 8', loc3.join(',') === String(PHYS)
			&& near(resolveRow(C.db, s3, 'IdahoPipe_Physical_Data', elOf(C.db, '3'), PHYS)[0].Physical_PipeDiameter * 12, 12, 1e-9)
			&& near(resolveRow(C.db, s3, 'IdahoPipe_Physical_Data', elOf(C.db, '2'), PHYS)[0].Physical_PipeDiameter * 12, 8, 1e-9));
	}

	console.log('\n2b. Pipe roughness and junction elevation (Physical alternative, the rows of the diameter\'s table and the node table)');
	{
		const R = write([['Rougher', ROUGH], ['Higher ground', ELEV], ['Both', ROUGH.replace(/ J1\s+50\s+300/, ' J1 55 300').replace(/ 2\s+J0\s+J1\s+1000\s+8 /, ' 2 J0 J1 1000 9 ')]]);
		const sid = (i) => R.report.scenarios[i].id;
		ok('all three written, one Physical child alternative each, none for demand', R.report.scenarios.every((x) => x.written) && rows(R.db, 'SELECT * FROM HMIAlternative WHERE ParentID IS NOT NULL AND AlternativeTypeID = 4').length === 3 && rows(R.db, 'SELECT * FROM HMIAlternative WHERE ParentID IS NOT NULL AND AlternativeTypeID = 20').length === 0, JSON.stringify(R.report.scenarios.map((x) => x.reason)));
		const c = (scen, el) => resolveRow(R.db, scen, 'IdahoPipe_Physical_Data', el, PHYS)[0].Physical_HazenWilliamsC;
		const ev = (scen, el) => resolveRow(R.db, scen, 'BaseIdahoNode_Physical_Data', el, PHYS)[0].Physical_NodeElevation;
		ok('pipe 3 C: 100 in Rougher, 120 in Base and in Higher ground', c(sid(0), elOf(R.db, '3')) === 100 && c(1, elOf(R.db, '3')) === 120 && c(sid(1), elOf(R.db, '3')) === 120);
		ok('J1 elevation: 55 in Higher ground and Both, 50 in Base and in Rougher', ev(sid(1), elOf(R.db, 'J1')) === 55 && ev(sid(2), elOf(R.db, 'J1')) === 55 && ev(1, elOf(R.db, 'J1')) === 50 && ev(sid(0), elOf(R.db, 'J1')) === 50);
		ok('Both: pipe 2 is 9 in, pipe 3 C 100, one copy of each pipe\'s rows (no duplicate row)', near(resolveRow(R.db, sid(2), 'IdahoPipe_Physical_Data', elOf(R.db, '2'), PHYS)[0].Physical_PipeDiameter * 12, 9, 1e-9) && c(sid(2), elOf(R.db, '3')) === 100
			&& rows(R.db, 'SELECT * FROM IdahoPipe_Physical_Data WHERE DomainElementID = ? AND AlternativeID = (SELECT AlternativeID FROM HMIScenarioAlternative WHERE ScenarioID = ? AND AlternativeTypeID = 4)', [elOf(R.db, '2'), sid(2)]).length === 1);
		ok('integrity ok', R.report.integrity === 'ok' && R.report.foreignKeyViolations === 0);
		if (reader) {
			const rr = EC.lpnWtgRead(await EC.lpnSqliteOpen(Buffer.from(R.out.bytes)), { flowUnits: 'GPM' });
			const dif = (n) => ((rr.scenarios || []).find((x) => x.name === n) || {}).differences || {};
			ok('the reader finds exactly those differences: Rougher l:3 roughness 100; Higher ground n:J1 elev 55', Object.keys(dif('Rougher')).join() === 'l:3' && dif('Rougher')['l:3'].roughness === 100 && Object.keys(dif('Higher ground')).join() === 'n:J1' && dif('Higher ground')['n:J1'].elev === 55, JSON.stringify([dif('Rougher'), dif('Higher ground')]));
		}
	}

	console.log('\n3. What it will not write is named, and the scenario is left out whole');
	{
		const D = write([['Longer pipe', LONGER], ['Higher tank', TANKELEV], ['Good one', DEMAND_ONLY]]);
		ok('3 requested, only the good one written', D.report.scenarios.map((x) => x.written).join(',') === 'false,false,true' && rows(D.db, 'SELECT * FROM HMIScenario WHERE ParentID IS NOT NULL').length === 1);
		const r0 = D.report.scenarios[0], r1 = D.report.scenarios[1];
		ok('a length override is named: pipe length on pipe 3', r0.reason === 'unsupported' && r0.unsupported.length === 1 && r0.unsupported[0].what === 'pipe length' && r0.unsupported[0].ids.join() === '3', JSON.stringify(r0.unsupported));
		ok('a tank elevation override is named: tank elev on T1', r1.reason === 'unsupported' && r1.unsupported.some((u) => u.what === 'tank elev' && u.ids.join() === 'T1'), JSON.stringify(r1.unsupported));
		ok('and each says so in the not-written list of the report', D.report.notCarried.filter((x) => /^scenario (Longer pipe|Higher tank) not written/.test(x)).length === 2);
		ok('(root, switching) a scenario with a Base of its own is refused as a root; one whose switching differs from Base\'s is refused for it', (() => {
			const parsed = EC.lpnInpParse(BASE);
			const w = lib.writeWtg(SQL, env.tplSqlite, parsed, { initial: {}, changes: [] }, { name: 'x', candidate: { scenarios: [{ name: 'R', root: true, inp: DEMAND_ONLY }, { name: 'S', switching: true, inp: DEMAND_ONLY }, { name: 'T', inp: DEMAND_ONLY }] } });
			return w.report.scenarios.map((x) => x.written + ':' + (x.reason || '')).join(',') === 'false:root,false:switching,true:' && w.report.integrity === 'ok';
		})());
		ok('(auto length) an elevation change that moves the length of an auto-length pipe is refused as that; a length change with no elevation behind it is a plain length', (() => {
			const base = EC.lpnInpParse(BASE), p3 = base.links.find((l) => l.id === '3');
			const mk = (fn) => { const sc = JSON.parse(JSON.stringify(base)); fn(sc); return sc; };
			const moved = mk((sc) => { sc.nodes.find((n) => n.id === p3.from).elev += 5; sc.links.find((l) => l.id === '3').length += 7; });
			const a = lib.scenarioOverrides(base, moved, ['3']), b = lib.scenarioOverrides(base, moved, []);
			const lone = mk((sc) => { sc.links.find((l) => l.id === '3').length += 7; });
			const c = lib.scenarioOverrides(base, lone, ['3']);
			const j = EC.lpnWtgScenarioJudge(base, { name: 'x', parsed: moved, autoLengthIds: ['3'] });
			return a.unsupported.length === 1 && a.unsupported[0].scope === 'auto_length' && a.unsupported[0].ids.join() === '3' && a.elevations.length === 1
				&& b.unsupported.some((u) => u.field === 'length') && c.unsupported.some((u) => u.field === 'length') && j.reason === 'autolength';
		})());
		ok('(pump end) an elevation change at an end of a pump is refused, named, as is not a plain junction\'s', (() => {
			const base = EC.lpnInpParse(BASE), pump = base.links.find((l) => l.type === 'pump');
			if (!pump) { return true; }
			const end = base.nodes.find((n) => n.type === 'junction' && (n.id === pump.from || n.id === pump.to));
			if (!end) { return true; }
			const sc = JSON.parse(JSON.stringify(base)); sc.nodes.find((n) => n.id === end.id).elev += 5;
			const ov = lib.scenarioOverrides(base, sc);
			return ov.elevations.length === 0 && ov.unsupported.some((u) => u.scope === 'pump_valve_elevation' && u.ids.join() === end.id);
		})());
		ok('(names) a repeated or empty name is refused, a nested scenario is refused', (() => {
			const parsed = EC.lpnInpParse(BASE);
			const w = lib.writeWtg(SQL, env.tplSqlite, parsed, { initial: {}, changes: [] }, { name: 'x', candidate: { scenarios: [{ name: 'A', inp: DEMAND_ONLY }, { name: 'A', inp: DIAM_ONLY }, { name: '', inp: DIAM_ONLY }, { name: 'Child', parent: 'A', inp: DIAM_ONLY }] } });
			return w.report.scenarios.map((x) => x.written + ':' + (x.reason || '')).join(',') === 'true:,false:name,false:name,false:nested' && w.report.integrity === 'ok';
		})());
		ok('(a refused scenario leaves no QBAT, no scenario row and no counts behind)', (() => {
			const w = write([['Longer pipe', LONGER]]);
			return rows(w.db, 'SELECT * FROM HMIScenario').length === 1 && rows(w.db, 'SELECT * FROM QBATDefinition').length === 0
				&& one(w.db, 'SELECT Count AS c FROM HMIElementTypeCount WHERE ElementType = 2 AND ElementTypeID = 0').c === 1 && one(w.db, 'SELECT Count AS c FROM HMIElementTypeCount WHERE ElementType = 4 AND ElementTypeID = 1000').c === 0
				&& !w.report.addedScenarios;
		})());
	}

	console.log('\n4. A scenario that overrides nothing (the shape of Tom\'s save, whose Scenario - 1 holds no alternative of its own)');
	{
		const F = write([['Scenario - 1', BASE]]);
		const s4 = rows(F.db, 'SELECT ScenarioID AS s FROM HMIScenario WHERE ParentID IS NOT NULL')[0].s;
		ok('18 picks, all inherited; no child alternative; 10 inherited calculation options; one QBAT', rows(F.db, 'SELECT * FROM HMIScenarioAlternative WHERE ScenarioID = ? AND IsLocal = 0', [s4]).length === 18
			&& rows(F.db, 'SELECT * FROM HMIAlternative WHERE ParentID IS NOT NULL').length === 0 && rows(F.db, 'SELECT * FROM QBATDefinition').length === 1
			&& rows(F.db, 'SELECT * FROM HMIScenarioCalculationOptions WHERE ScenarioID = ?', [s4]).length === 10);
		ok('element-type counts as in the save: scenarios 2, QBAT 1, alternatives of type 4 and 20 still 1', one(F.db, 'SELECT Count AS c FROM HMIElementTypeCount WHERE ElementType = 2 AND ElementTypeID = 0').c === 2 && one(F.db, 'SELECT Count AS c FROM HMIElementTypeCount WHERE ElementType = 1 AND ElementTypeID = 4').c === 1);
		const saved = path.join(process.env.HOME || '', 'tom-files', '2026-11-09', 'wtg-composite-test', 'ctl-composite-test-w-scenario.wtg.sqlite');
		if (fs.existsSync(saved)) {
			const T = new SQL.Database(new Uint8Array(fs.readFileSync(saved)));
			const shape = (db, sid) => ({
				sa: rows(db, 'SELECT AlternativeTypeID AS t, IsLocal AS l FROM HMIScenarioAlternative WHERE ScenarioID = ? ORDER BY AlternativeTypeID', [sid]).map((r) => r.t + ':' + r.l).join(','),
				co: rows(db, 'SELECT NumericalEngineTypeID AS n, IsLocal AS l FROM HMIScenarioCalculationOptions WHERE ScenarioID = ? ORDER BY NumericalEngineTypeID', [sid]).map((r) => r.n + ':' + r.l).join(','),
				qbat: JSON.stringify(rows(db, 'SELECT QBATDefinition_HMIActiveTopologyAlternative AS a, QBATDefinition_HMIActiveTopologyIncludeConnectedNodes AS i, HMIActiveTopologyMode AS m, HMIActiveTopologyQueriesCount AS q FROM QBATDefinition'))
			});
			const ts = rows(T, 'SELECT ScenarioID AS s FROM HMIScenario WHERE ParentID IS NOT NULL')[0].s;
			const a = shape(F.db, s4), b = shape(T, ts);
			ok('the same picks, calculation options and QBAT row as Tom\'s saved Scenario - 1 (' + saved.replace(process.env.HOME, '~') + ')', a.sa === b.sa && a.co === b.co && a.qbat === b.qbat, JSON.stringify(a) === JSON.stringify(b) ? '' : JSON.stringify(a) + ' / ' + JSON.stringify(b));
			T.close();
		} else { console.log('   (Tom\'s saved pair is not on this machine: the shape check against it is skipped)'); }
	}

	console.log('\n5. Two scenarios, and the .wtg beside it');
	{
		const G = write([['Wet year', SCEN1], ['Dry year', DEMAND_ONLY]]);
		const ids = G.report.addedScenarios;
		ok('two child scenarios, distinct ids; physical alternatives 2, demand alternatives 3', ids.length === 2 && ids[0] !== ids[1] && one(G.db, 'SELECT Count AS c FROM HMIElementTypeCount WHERE ElementType = 1 AND ElementTypeID = 20').c === 3 && one(G.db, 'SELECT Count AS c FROM HMIElementTypeCount WHERE ElementType = 1 AND ElementTypeID = 4').c === 2 && one(G.db, 'SELECT Count AS c FROM HMIElementTypeCount WHERE ElementType = 2 AND ElementTypeID = 0').c === 3);
		ok('one QBAT definition for both', rows(G.db, 'SELECT * FROM QBATDefinition').length === 1);
		ok('integrity ok, no foreign key violations', G.report.integrity === 'ok' && G.report.foreignKeyViolations === 0);
		const w = lib.patchWtgXml(env.tplWtg, G.report.removedChildScenarios, 1, G.report.removedChildAlternatives, G.report.extentFt, ids);
		ok('the .wtg gets an animation setting row and a tree node for each, and the counts follow', ids.every((id) => w.indexOf('<ScenarioSettings ScenarioID="' + id + '"') >= 0 && w.indexOf('<Node Identifier="' + id + '" IsGuid="false" IsInt="true" />') >= 0)
			&& /<ScenarioAnimationSettingStorageElement ScenarioCount="3">/.test(w), (w.match(/<ScenarioAnimationSettingStorageElement ScenarioCount="\d+">/) || [''])[0]);
		const w0 = lib.patchWtgXml(env.tplWtg, G.report.removedChildScenarios, 1, G.report.removedChildAlternatives, G.report.extentFt);
		ok('with no scenario the .wtg is what it was', /<ScenarioAnimationSettingStorageElement ScenarioCount="1">/.test(w0));
	}

	console.log('\n6. The test pair for Tom (dev/lpn-spike/wtg-scenario-test.js)');
	{
		const st = require('./wtg-scenario-test.js');
		const dir = path.join(process.env.HOME || '', 'tom-files', '2026-11-13', 'wtg-scenario-test');
		// Tom's WaterGEMS readings (2026-11-13): T1 at hour 12 Base 11.56, Child A 15.49 ft; J1 at hour 0 35.69, 35.76 psi. WaterGEMS
		// checks rules at EPANET's default rule step (a tenth of the hydraulic step), not hourly; its psi per foot is 0.43353.
		const eb = await st.expected(st.baseNet(), null), ec = await st.expected(st.childNet(), null), eh = await st.expected(st.baseNet(), '1:00');
		ok('EPANET at its default rule step gives Tom\'s T1 at hour 12: Base 11.56, Child A 15.49 ft', eb.t1[12].toFixed(2) === '11.56' && ec.t1[12].toFixed(2) === '15.49', eb.t1[12].toFixed(2) + ' / ' + ec.t1[12].toFixed(2));
		ok('an hourly rule step does not (8.75): that was the wrong expectation', eh.t1[12].toFixed(2) === '8.75');
		ok('J1 at hour 0 times 0.43353 psi/ft gives Tom\'s 35.69 and 35.76', (eb.j1p0 / 0.4333 * 0.43353).toFixed(2) === '35.69' && (ec.j1p0 / 0.4333 * 0.43353).toFixed(2) === '35.76');
		const fresh = await st.build(env);
		ok('Child A is written, integrity ok', fresh.report.integrity === 'ok' && fresh.report.scenarios.length === 1 && fresh.report.scenarios[0].written && fresh.report.scenarios[0].name === 'Child A');
		const file = path.join(dir, st.NAME + '.wtg.sqlite');
		if (!fs.existsSync(file)) { console.log('   (the folder for Tom is not on this machine: the comparison is skipped)'); } else {
			const dump = require('./wtg-dump.js').dump;
			const a = dump(SQL, fs.readFileSync(file)), b = dump(SQL, Buffer.from(fresh.sqlite));
			const bad = Object.keys(Object.assign({}, a, b)).filter((t) => JSON.stringify(a[t]) !== JSON.stringify(b[t]));
			ok('the .wtg.sqlite in Tom\'s folder is what the writer produces now (every table, ids and times masked)', bad.length === 0, bad.join(', '));
			const w = fs.readFileSync(path.join(dir, st.NAME + '.wtg'), 'utf8').replace(/Id="[0-9a-f-]{36}"/, ''), v = fresh.wtg.replace(/Id="[0-9a-f-]{36}"/, '');
			ok('and so is the .wtg', w === v);
		}
	}

	console.log('\n7. Review fixes (2026-11-14)');
	{
		const tw = (name, text) => { const o = lib.writeWtg(SQL, env.tplSqlite, EC.lpnInpParse(BASE), { initial: {}, changes: [] }, { name: 'x', candidate: { scenarios: [{ name: name, inp: text }] } }); return o.report; };
		// (10) names: case-insensitive, and against alternative labels too
		const w3 = lib.writeWtg(SQL, env.tplSqlite, EC.lpnInpParse(BASE), { initial: {}, changes: [] }, { name: 'x', candidate: { scenarios: [{ name: 'Dry', inp: DEMAND_ONLY }, { name: 'dRY', inp: DIAM_ONLY }, { name: 'base', inp: DIAM_ONLY }, { name: 'Base Physical', inp: DIAM_ONLY }] } });
		ok('(10) a name that differs only by capitals, "base", and an alternative\'s label ("Base Physical") are all refused, and said so in notCarried',
			w3.report.scenarios.map((x) => x.written).join() === 'true,false,false,false' && w3.report.notCarried.filter((x) => /^scenario ".*" not written: its name is empty, or already used/.test(x)).length === 3, w3.report.scenarios.map((x) => x.reason || 'ok').join());
		// (3) demand rows keep Base's order: a junction with three demand rows, all changed
		const MULTI = (a, b, c) => BASE.replace('[PIPES]', '[DEMANDS]\n J1 ' + a + ' P1\n J1 ' + b + '\n J1 ' + c + '\n\n[PIPES]');
		const M0 = MULTI(40, 25, 12), M1 = MULTI(55, 7, 33);
		const pm = EC.lpnInpParse(M0);
		const mo = lib.writeWtg(SQL, env.tplSqlite, pm, { initial: {}, changes: [] }, { name: 'x', candidate: { scenarios: [{ name: 'M', inp: M1 }] } });
		const mdb = new SQL.Database(new Uint8Array(mo.bytes));
		const j1 = one(mdb, "SELECT ElementID AS e FROM HMIModelingElement WHERE Label = 'J1' AND ElementType = 3").e;
		const sidM = mo.report.scenarios[0].id;
		const flowsOf = (alt) => rows(mdb, 'SELECT DemandCollection_BaseFlow AS f FROM IdahoDemandNode_Demand_DemandCollection WHERE DomainElementID = ? AND AlternativeID = ? ORDER BY ItemID', [j1, alt]).map((r) => Math.round(r.f / GPM * 1e6) / 1e6);
		const altOf = (sid) => one(mdb, 'SELECT AlternativeID AS a FROM HMIScenarioAlternative WHERE ScenarioID = ? AND AlternativeTypeID = 20', [sid]).a;
		const baseId = mo.report.baseScenarioId;
		ok('(3) three demand rows: Base keeps 40, 25, 12 and the child holds 55, 7, 33, each in its own place', mo.report.scenarios[0].written && flowsOf(altOf(baseId)).join() === '40,25,12' && flowsOf(altOf(sidM)).join() === '55,7,33', flowsOf(altOf(baseId)).join() + ' | ' + flowsOf(altOf(sidM)).join());
		// (4) no IdahoPipe_Physical_Data row in the template: the scenario is left out by name, nothing throws
		{
			const t2 = new SQL.Database(new Uint8Array(env.tplSqlite));
			t2.run('DELETE FROM IdahoPipe_Physical_Data');
			let r4 = null, threw = null;
			try { r4 = lib.writeWtg(SQL, t2.export(), EC.lpnInpParse(BASE), { initial: {}, changes: [] }, { name: 'x', allowUntestedSchema: true, candidate: { scenarios: [{ name: 'A', inp: DIAM_ONLY }] } }).report; } catch (e) { threw = e; }
			if (threw || !r4) { console.log('   ' + (threw ? threw.message : JSON.stringify(r4 && r4.scenarios))); }
			ok('(4) a template with no pipe Physical rows: no throw, the scenario is named as not written', !threw && r4 && r4.scenarios[0].written === false && r4.scenarios[0].reason === 'layout' && r4.notCarried.some((x) => /holds no IdahoPipe_Physical_Data rows to copy/.test(x)), threw ? String(threw.message) : '');
			t2.close();
		}
		// (5) many overrides: 400 pipes through the shared per-kind table list, every diameter lands (timing is in dev/wtg-export.md)
		{
			const N = 400;
			let big = '', bigK = '', bj = '', bc = '', bp = '', bpk = '';
			for (let i = 1; i <= N; i++) { bj += ' K' + i + '\t45\t5\t\t;\n'; bc += ' K' + i + '\t' + i + '.00\t3.00\n'; bp += ' Q' + i + '\t' + (i === 1 ? 'J1' : 'K' + (i - 1)) + '\tK' + i + '\t100\t8\t120\t0\tOpen\t;\n'; bpk += ' Q' + i + '\t' + (i === 1 ? 'J1' : 'K' + (i - 1)) + '\tK' + i + '\t100\t10\t120\t0\tOpen\t;\n'; }
			const tiny = fs.readFileSync(path.join(__dirname, 'reference', 'wtg-export-tiny.inp'), 'utf8');
			const mk = (pp) => tiny.replace('[RESERVOIRS]', bj + '\n[RESERVOIRS]').replace(/(\[PIPES\]\n[^\n]*\n)/, '$1' + pp).replace(/(\[COORDINATES\]\n[^\n]*\n)/, '$1' + bc);
			const bo = lib.writeWtg(SQL, env.tplSqlite, EC.lpnInpParse(mk(bp)), { initial: {}, changes: [] }, { name: 'x', candidate: { scenarios: [{ name: 'Wide', inp: mk(bpk) }] } });
			const bdb = new SQL.Database(new Uint8Array(bo.bytes));
			const sidB = bo.report.scenarios[0].id;
			const pa = one(bdb, 'SELECT AlternativeID AS a FROM HMIScenarioAlternative WHERE ScenarioID = ? AND AlternativeTypeID = 4', [sidB]).a;
			const d = rows(bdb, 'SELECT Physical_PipeDiameter AS d FROM IdahoPipe_Physical_Data WHERE AlternativeID = ?', [pa]);
			const bd = rows(bdb, 'SELECT Physical_PipeDiameter AS d FROM IdahoPipe_Physical_Data WHERE AlternativeID = ?', [bo.report.baseScenarioId ? one(bdb, 'SELECT AlternativeID AS a FROM HMIScenarioAlternative WHERE ScenarioID = ? AND AlternativeTypeID = 4', [bo.report.baseScenarioId]).a : 0]);
			ok('(5) 400 pipes overridden: 400 child rows at 10 in, Base untouched (8 in)', bo.report.scenarios[0].pipeDiameters === N && d.length === N && d.every((r) => near(r.d * 12, 10, 1e-9)) && bd.filter((r) => near(r.d * 12, 8, 1e-9)).length >= N && bo.report.integrity === 'ok');
		}
		// (1, 2, 8) the .wtg: Base numbered above 30, the child's rows placed by the real Base id, an unplaceable .wtg is an error
		{
			const BIG = 44;
			const wtg44 = env.tplWtg.replace(/<Node Identifier="1" IsGuid="false" IsInt="true" \/>/, '<Node Identifier="' + BIG + '" IsGuid="false" IsInt="true" />').replace(/<ScenarioSettings ScenarioID="1" /, '<ScenarioSettings ScenarioID="' + BIG + '" ');
			const G = write([['Wet year', SCEN1]]);
			const kid = G.report.addedScenarios[0];
			const w = lib.patchWtgXml(wtg44, G.report.removedChildScenarios, BIG, G.report.removedChildAlternatives, G.report.extentFt, [kid]);
			const blocks = w.match(/<TreeExpandedStateManager Count="\d+">[\s\S]*?<\/TreeExpandedStateManager>/g) || [];
			const holder = blocks.filter((b) => b.indexOf('Identifier="' + kid + '"') >= 0);
			ok('(1) Base numbered 44: the child\'s tree node follows Base\'s, in the one block that holds it, and that block\'s count is right', holder.length === 1 && new RegExp('<Node Identifier="' + BIG + '" IsGuid="false" IsInt="true" />\\s*<Node Identifier="' + kid + '"').test(holder[0]) && /Count="(\d+)"/.exec(holder[0])[1] === String((holder[0].match(/<Node /g) || []).length));
			let msg = '';
			try { lib.patchWtgXml(wtg44, G.report.removedChildScenarios, 1, G.report.removedChildAlternatives, G.report.extentFt, [kid]); } catch (e) { msg = e.message; }
			ok('(1) asked for a Base the .wtg has no tree node for: an error that says so, not a silent skip', /no tree node for the Base scenario \(1\)/.test(msg), msg);
			msg = '';
			try { lib.patchWtgXml(env.tplWtg.split('ScenarioAnimationSettingStorageElement').join('Gone'), G.report.removedChildScenarios, 1, G.report.removedChildAlternatives, G.report.extentFt, [kid]); } catch (e) { msg = e.message; }
			ok('(1) a .wtg with no animation settings block is an error too', /no scenario animation settings block/.test(msg), msg);
			const ia = w.indexOf('<ScenarioSettings ScenarioID="' + kid + '"'), ib = w.indexOf('<ScenarioSettings ScenarioID="' + BIG + '"');
			ok('(2) the child\'s animation setting is listed before Base\'s, as TGH-1 (38, 1) and Tom\'s 11-13 save (60, 1) list them', ia > 0 && ib > ia);
			const cs = /<ComputeStatusIndicator ScenarioCount="(\d+)"/.exec(w)[1];
			ok('(8) ComputeStatusIndicator counts its Scenario rows (computed scenarios only: the 11-13 save has 1 beside two scenarios, and the child, never computed, has no row)', cs === String((w.match(/<Scenario ScenarioId=/g) || []).length) && cs === '1');
		}
		// (7) one place states the conversions: with Demand Multiplier 2 the Base rows and the child's override both carry it
		{
			const m2 = (t) => t.replace('[OPTIONS]\n', '[OPTIONS]\n Demand Multiplier \t2\n');
			const mo2 = lib.writeWtg(SQL, env.tplSqlite, EC.lpnInpParse(m2(BASE)), { initial: {}, changes: [] }, { name: 'x', candidate: { scenarios: [{ name: 'M', inp: m2(DEMAND_ONLY) }] } });
			const db2 = new SQL.Database(new Uint8Array(mo2.bytes));
			const j = one(db2, "SELECT ElementID AS e FROM HMIModelingElement WHERE Label = 'J1' AND ElementType = 3").e;
			const alt = (sid) => one(db2, 'SELECT AlternativeID AS a FROM HMIScenarioAlternative WHERE ScenarioID = ? AND AlternativeTypeID = 20', [sid]).a;
			const fl = (sid) => Math.round(one(db2, 'SELECT DemandCollection_BaseFlow AS f FROM IdahoDemandNode_Demand_DemandCollection WHERE DomainElementID = ? AND AlternativeID = ?', [j, alt(sid)]).f / GPM * 1e6) / 1e6;
			ok('(7) Demand Multiplier 2: Base stores 600 gpm for 300, the child 840 for 420, through the one conversion', mo2.report.scenarios[0].written && fl(mo2.report.baseScenarioId) === 600 && fl(mo2.report.scenarios[0].id) === 840, fl(mo2.report.baseScenarioId) + ' / ' + fl(mo2.report.scenarios[0].id));
		}
	}

	console.log('\n8. The page path is unchanged');
	ok('no scenarios asked: the report has no scenario list, no QBAT and the counts of one scenario', !plain.report.scenarios && rows(plain.db, 'SELECT * FROM QBATDefinition').length === 0 && rows(plain.db, 'SELECT * FROM HMIScenario').length === 1);

	console.log('\n9. (runs in a child process)');
	{
		const r = require('child_process').spawnSync(process.execPath, [__filename, '--page'], { encoding: 'utf8' });
		process.stdout.write(r.stdout || '');
		ok('the page path passes', r.status === 0, (r.stderr || '').split('\n').slice(0, 6).join(' | '));
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall checks passed');
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });
