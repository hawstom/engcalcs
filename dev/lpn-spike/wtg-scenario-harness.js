// The WaterGEMS child-scenario writer (Task 749, candidate `opts.candidate.scenarios`, 2026-11-13).
//   node dev/lpn-spike/wtg-scenario-harness.js
// Writes a base network and child scenarios whose overrides are a pipe diameter and a junction's demand (the two that Tom's
// pair of 2026-11-13 differs on, ctl-composite-test and ctl-composite-test-w-scenario, dev/wtg-export.md "Child scenarios"),
// resolves each scenario back from the file twice (by this harness's own walk up the alternatives, and through the reader of
// branch feat/sqlite-reader), and checks the structure against what the saved pair and Tom's TGH-1 show. NOT proof that
// WaterGEMS opens or resolves it: only Tom's copy can say that.
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

(async function () {
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
	const ELEV = edit(/ J0\s+40\s+0/, ' J0 45 0');

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

	console.log('\n3. What it will not write is named, and the scenario is left out whole');
	{
		const D = write([['Rougher', ROUGH], ['Higher ground', ELEV], ['Good one', DEMAND_ONLY]]);
		ok('3 requested, only the good one written', D.report.scenarios.map((x) => x.written).join(',') === 'false,false,true' && rows(D.db, 'SELECT * FROM HMIScenario WHERE ParentID IS NOT NULL').length === 1);
		const r0 = D.report.scenarios[0], r1 = D.report.scenarios[1];
		ok('a roughness override is named: pipe roughness on pipe 3', r0.reason === 'unsupported' && r0.unsupported.length === 1 && r0.unsupported[0].what === 'pipe roughness' && r0.unsupported[0].ids.join() === '3', JSON.stringify(r0.unsupported));
		ok('an elevation override is named: junction elev on J0', r1.reason === 'unsupported' && r1.unsupported.some((u) => u.what === 'junction elev' && u.ids.join() === 'J0'), JSON.stringify(r1.unsupported));
		ok('and each says so in the not-written list of the report', D.report.notCarried.filter((x) => /^scenario (Rougher|Higher ground) not written/.test(x)).length === 2);
		const E = write([['A', DEMAND_ONLY], ['A', DIAM_ONLY], ['', DIAM_ONLY], ['Nested', DIAM_ONLY]].map((x, i) => x), null);
		ok('(names) a repeated or empty name is refused, a nested scenario is refused', (() => {
			const parsed = EC.lpnInpParse(BASE);
			const w = lib.writeWtg(SQL, env.tplSqlite, parsed, { initial: {}, changes: [] }, { name: 'x', candidate: { scenarios: [{ name: 'A', inp: DEMAND_ONLY }, { name: 'A', inp: DIAM_ONLY }, { name: '', inp: DIAM_ONLY }, { name: 'Child', parent: 'A', inp: DIAM_ONLY }] } });
			return w.report.scenarios.map((x) => x.written + ':' + (x.reason || '')).join(',') === 'true:,false:name,false:name,false:nested' && w.report.integrity === 'ok';
		})());
		ok('(a refused scenario leaves no QBAT, no scenario row and no counts behind)', (() => {
			const w = write([['Rougher', ROUGH]]);
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

	console.log('\n6. The page path is unchanged');
	ok('no scenarios asked: the report has no scenario list, no QBAT and the counts of one scenario', !plain.report.scenarios && rows(plain.db, 'SELECT * FROM QBATDefinition').length === 0 && rows(plain.db, 'SELECT * FROM HMIScenario').length === 1);

	console.log(fails ? '\n' + fails + ' FAILED' : '\nall checks passed');
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });
