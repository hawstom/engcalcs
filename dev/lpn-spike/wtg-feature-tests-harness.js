// The candidate-feature writer paths (Task 749, 2026-11-02): emitter, pump speed pattern, tank mixing, water quality.
//   node dev/lpn-spike/wtg-feature-tests-harness.js
// Checks the files dev/lpn-spike/wtg-feature-tests.js builds: every file is a sound SQLite database, each candidate
// stores exactly the number or code it says it does, the EPANET expectations printed in the README are the ones the
// networks give, and WITHOUT `opts.candidate` the writer still writes none of it (the page's list is unchanged).
// NOT proof that WaterGEMS accepts any of it: only Tom's copy can say that.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAILED: ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function near(a, b, tol) { return Math.abs(a - b) <= tol; }

(async function () {
	try { require('./wtg-sqljs.js').sqlJsPath(); } catch (e) { console.log('NOT RUN: sql.js not found (' + e.message + ').'); process.exit(0); }
	const ft = require('./wtg-feature-tests.js');
	const out = fs.mkdtempSync(path.join(os.tmpdir(), 'wtg-feature-tests-'));
	const r = await ft.build(out);
	const SQL = r.env.SQL, x = r.expected;
	const GPM = 0.22280092967190634 / 100;

	const open = (feature, name) => new SQL.Database(new Uint8Array(fs.readFileSync(path.join(out, feature, name + '.wtg.sqlite'))));
	const rows = (db, sql, params) => { const st = db.prepare(sql), o = []; if (params) { st.bind(params); } while (st.step()) { o.push(st.getAsObject()); } st.free(); return o; };
	const elOf = (db, label) => rows(db, 'SELECT m.ElementID AS id FROM HMIModelingElement m JOIN HMIDomainElement d ON d.DomainElementID = m.ElementID WHERE m.Label = ? AND d.IsDeleted = 0', [label])[0].id;
	const supOf = (db, label) => rows(db, 'SELECT m.ElementID AS id FROM HMIModelingElement m JOIN HMISupportElement d ON d.SupportElementID = m.ElementID WHERE m.Label = ? AND d.IsDeleted = 0', [label])[0].id;

	console.log('\nThe set');
	ok('31 candidate files written', r.files.length === 31, String(r.files.length));
	ok('every file: integrity ok and no foreign key violations', r.files.every((f) => f.report.integrity === 'ok' && f.report.foreignKeyViolations === 0));
	ok('every file has its .wtg beside it', r.files.every((f) => fs.existsSync(path.join(f.dir, f.name + '.wtg'))));
	ok('no candidate file names a column the template lacks', r.files.every((f) => f.report.skippedColumns.length === 0), JSON.stringify(r.files.map((f) => f.report.skippedColumns).filter((s) => s.length)));

	console.log('\n1. Emitter');
	{
		const k = { A: 1, B: GPM, C: GPM * Math.pow(r.env.EngCalcs.EPANET_PSI_PER_FT, 0.5), D: Math.pow(r.env.EngCalcs.EPANET_PSI_PER_FT, 0.5) };
		['A', 'B', 'C', 'D'].forEach((c) => {
			const db = open('1-emitter', 'emitter-' + c);
			const v = (lab) => rows(db, 'SELECT Physical_EmitterCoefficient AS v FROM IdahoFireFlowNode_Physical_Data WHERE DomainElementID = ?', [elOf(db, lab)])[0].v;
			ok('candidate ' + c + ': J1 stores 0.01 and J3 stores 1.0 in its unit, J2 stores 0', near(v('J1'), 0.01 * k[c], 1e-12) && near(v('J3'), 1.0 * k[c], 1e-12) && v('J2') === 0, v('J1') + ' / ' + v('J3'));
			db.close();
		});
		const e = x.emitter.hour0.node;
		ok('EPANET: J3 emits 1.0 x sqrt(pressure)', near(e.J3.demand, Math.sqrt(e.J3.pressure), 2e-3), e.J3.demand.toFixed(4) + ' vs ' + Math.sqrt(e.J3.pressure).toFixed(4));
		ok('EPANET: J1 emits 0.01 x sqrt(pressure)', near(e.J1.demand, 0.01 * Math.sqrt(e.J1.pressure), 2e-3), e.J1.demand.toFixed(4));
	}

	console.log('\n2. Pump speed pattern');
	{
		[0, 1, 2, 3].forEach((v) => {
			const db = open('2-pump-speed', 'pump-speed-vsp' + v);
			const pump = elOf(db, 'PU1'), pat = supOf(db, 'SP');
			const d = rows(db, 'SELECT Physical_IsVariableSpeedPump AS iv, VSPType AS t FROM StandardPump_Physical_Data WHERE DomainElementID = ?', [pump])[0];
			const pb = rows(db, 'SELECT PatternBasedType_Pattern AS p FROM StandardPump_Physical_VSPType_PatternBasedType WHERE DomainElementID = ?', [pump]);
			ok('vsp' + v + ': PU1 is a variable speed pump of type ' + v + ' on pattern SP', d.iv === 1 && d.t === v && pb.length === 1 && pb[0].p === pat);
			const pts = rows(db, 'SELECT PatternCurve_TimeFromStart AS t, PatternCurve_Multiplier AS m FROM IdahoPattern_PatternCurve WHERE SupportElementID = ? ORDER BY t', [pat]);
			ok('vsp' + v + ': SP is written stepwise (24 points, the cycle closes on the first value)', pts.length === 24 && pts[0].t === 3600 && pts[23].t === 86400 && pts[23].m === 1.0 && pts[5].m === 0.9, pts.length + ' points');
			db.close();
		});
		ok('EPANET: the pattern changes the pump flow (hour 6: ' + x.pumpSpeed[6].link.PU1.flow.toFixed(1) + ' vs ' + x.pumpFixed[6].link.PU1.flow.toFixed(1) + ' gpm at full speed)', Math.abs(x.pumpSpeed[6].link.PU1.flow - x.pumpFixed[6].link.PU1.flow) > 50);
		const db = open('1-emitter', 'emitter-A');
		ok('a pump with no speed pattern stays a fixed speed pump (template defaults)', rows(db, 'SELECT COUNT(*) AS c FROM StandardPump_Physical_Data WHERE Physical_IsVariableSpeedPump = 1').every((q) => q.c === 0));
		db.close();
	}

	console.log('\n3. Calculation type');
	{
		const seen = [];
		for (let k = 0; k <= 9; k++) {
			if (k === 5) { continue; }
			const db = open('3-calculation-type', 'calctype-' + k);
			const t = rows(db, 'SELECT CalculationType AS t FROM EpaNetEngine')[0].t;
			const tol = rows(db, 'SELECT ConstituentAnalysisType_ConstituentTolerance AS v FROM EpaNetEngine_CalculationType_ConstituentAnalysisType');
			seen.push(t === k && tol.length === 1 && tol[0].v === 0.01);
			db.close();
		}
		ok('calctype-N stores CalculationType N (nine files) and the constituent tolerance 0.01', seen.length === 9 && seen.every(Boolean));
	}

	console.log('\n4. Tank mixing');
	{
		const cases = [['mix-2comp-code2-fraction', 2, 0.2, 0.8], ['mix-2comp-code2-percent', 2, 20, 80], ['mix-2comp-code0-fraction', 0, 0.2, 0.8], ['mix-fifo-code3', 3], ['mix-lifo-code4', 4]];
		cases.forEach((c) => {
			const db = open('4-tank-mixing', c[0]);
			const t = elOf(db, 'T1');
			const m = rows(db, 'SELECT TankMixingModel AS m FROM ConventionalTank_Constituent_Data WHERE DomainElementID = ?', [t])[0].m;
			const tc = rows(db, 'SELECT TwoCompartmentType_Compartment1 AS a, TwoCompartmentType_Compartment2 AS b FROM ConventionalTank_Constituent_TankMixingModel_TwoCompartmentType WHERE DomainElementID = ?', [t]);
			const good = m === c[1] && (c.length === 4 ? tc.length === 1 && near(tc[0].a, c[2], 1e-9) && near(tc[0].b, c[3], 1e-9) : tc.length === 0);
			ok(c[0] + ': mixing code ' + c[1] + (c.length === 4 ? ', compartments ' + c[2] + ' and ' + c[3] : ', no compartment row'), good, 'code ' + m + ' ' + JSON.stringify(tc));
			db.close();
		});
		const h = (n) => x.mixing[n][12].node.T1.quality;
		ok('EPANET at hour 12: LIFO > two compartment > mixed > FIFO, plainly apart (' + [h('lifo'), h('2comp'), h('mixed'), h('fifo')].map((v) => v.toFixed(3)).join(' > ') + ')', h('lifo') > h('2comp') + 0.3 && h('2comp') > h('mixed') + 0.05 && h('mixed') > h('fifo') + 0.05);
	}

	console.log('\n5. Water quality');
	{
		const day = 1, sec = 1 / 86400;
		[['chlorine-day-signed', day, 1], ['chlorine-second-signed', sec, 1], ['chlorine-day-positive', day, -1], ['chlorine-second-positive', sec, -1]].forEach((c) => {
			const db = open('5-water-quality', c[0]);
			const ch = rows(db, 'SELECT * FROM IdahoConstituent')[0];
			const wall = rows(db, 'SELECT FirstOrderType_FirstOrderWallReactionRate AS w FROM IdahoConstituent_WallReactionOrder_FirstOrderType')[0].w;
			ok(c[0] + ': bulk ' + (-2 * c[1] * c[2]) + ', wall ' + (-1 * c[1] * c[2]) + ', order 1 each', near(ch.IdahoConstituent_BulkReactionRate, -2 * c[1] * c[2], 1e-12) && near(wall, -1 * c[1] * c[2], 1e-12) && ch.IdahoConstituent_BulkReactionOrder === 1 && ch.WallReactionOrder === 1);
			const sysRow = rows(db, 'SELECT Constituent_ConstituentID AS c FROM Constituent_SystemData')[0].c;
			ok(c[0] + ': the project\'s constituent is the Chlorine element (support type 52)', sysRow === ch.SupportElementID && rows(db, 'SELECT SupportElementTypeID AS t FROM HMISupportElement WHERE SupportElementID = ?', [sysRow])[0].t === 52);
			const j0 = elOf(db, 'J0');
			const s = rows(db, 'SELECT Constituent_IsConstituentSource AS s, ConstituentSourceType AS t, BaselineConcentration AS b FROM BaseIdahoNode_Constituent_Data WHERE DomainElementID = ?', [j0])[0];
			ok(c[0] + ': J0 is a source, code 2 (set point), strength 1.0', s.s === 1 && s.t === 2 && s.b === 1.0);
			ok(c[0] + ': the element type count for constituents is 1', rows(db, 'SELECT Count AS c FROM HMIElementTypeCount WHERE ElementType = 4 AND ElementTypeID = 52')[0].c === 1);
			db.close();
		});
		[0, 1, 3].forEach((c) => {
			const db = open('5-water-quality', 'source-type-code' + c);
			const s = rows(db, 'SELECT ConstituentSourceType AS t FROM BaseIdahoNode_Constituent_Data WHERE DomainElementID = ?', [elOf(db, 'J0')])[0];
			ok('source-type-code' + c + ': J0 stores source code ' + c, s.t === c);
			db.close();
		});
		{
			const db = open('5-water-quality', 'age');
			ok('age: calculation type 0 with an age tolerance row', rows(db, 'SELECT CalculationType AS t FROM EpaNetEngine')[0].t === 0 && rows(db, 'SELECT COUNT(*) AS c FROM EpaNetEngine_CalculationType_AgeAnalysisType')[0].c === 1);
			ok('age: no constituent element is written', rows(db, 'SELECT COUNT(*) AS c FROM IdahoConstituent')[0].c === 0);
			db.close();
		}
		{
			const db = open('5-water-quality', 'trace');
			ok('trace: calculation type 7 with a trace tolerance row; the trace element is reservoir R', rows(db, 'SELECT CalculationType AS t FROM EpaNetEngine')[0].t === 7 && rows(db, 'SELECT COUNT(*) AS c FROM EpaNetEngine_CalculationType_TraceAnalysisType')[0].c === 1
				&& rows(db, 'SELECT Trace_TraceElement AS t FROM Trace_SystemData')[0].t === elOf(db, 'R'));
			db.close();
		}
		const c24 = x.chlorine[24].node, n24 = x.chlorineNoDecay[24].node;
		ok('EPANET: the reactions lower the chlorine at J1 and T1 (' + c24.J1.quality.toFixed(3) + ' < ' + n24.J1.quality.toFixed(3) + ', ' + c24.T1.quality.toFixed(3) + ' < ' + n24.T1.quality.toFixed(3) + ')', c24.J1.quality < n24.J1.quality - 0.02 && c24.T1.quality < n24.T1.quality - 0.01);
		ok('EPANET: age at T1 is older than at J1, and trace at T1 is a fraction of J1\'s 100 percent', x.age[24].node.T1.quality > x.age[24].node.J1.quality && near(x.trace[24].node.J1.quality, 100, 0.01) && x.trace[24].node.T1.quality < 100);
	}

	console.log('\nThe page\'s writer is unchanged without a candidate');
	{
		const inp = fs.readFileSync(path.join(out, '5-water-quality', 'chlorine.inp'), 'utf8');
		const parsed = r.env.EngCalcs.lpnInpParse(inp);
		const plain = r.env.lib.writeWtg(r.env.SQL, r.env.tplSqlite, parsed, { initial: {}, changes: [] }, { name: 'plain', efficiency: 75 });
		const db = new SQL.Database(new Uint8Array(plain.bytes));
		ok('no constituent, no source, no calculation type change when no candidate is passed', rows(db, 'SELECT COUNT(*) AS c FROM IdahoConstituent')[0].c === 0
			&& rows(db, 'SELECT CalculationType AS t FROM EpaNetEngine')[0].t === 5 && rows(db, 'SELECT COUNT(*) AS c FROM BaseIdahoNode_Constituent_Data WHERE Constituent_IsConstituentSource = 1')[0].c === 0);
		ok('the page\'s report still counts the quality analysis as not written', plain.report.notCarried.some((s) => /quality analysis/.test(s)) && plain.report.candidateWritten === undefined);
		db.close();
		const pe = ft.EMITTER_NET, ep = r.env.EngCalcs.lpnInpParse(pe);
		const plainE = r.env.lib.writeWtg(r.env.SQL, r.env.tplSqlite, ep, { initial: {}, changes: [] }, { name: 'plain', efficiency: 75 });
		const db2 = new SQL.Database(new Uint8Array(plainE.bytes));
		ok('a plain export names the emitters as not written and stores 0 for them', plainE.report.notCarried.some((s) => /^emitter on J1/.test(s)) && rows(db2, 'SELECT SUM(Physical_EmitterCoefficient) AS s FROM IdahoFireFlowNode_Physical_Data')[0].s === 0);
		db2.close();
	}

	console.log('\nThe README');
	{
		const text = ft.readme(x);
		const lines = text.split('\n').filter((l) => l.trim());
		ok('every paragraph is one line (no line is a wrapped fragment)', lines.every((l) => /^#|^[A-Z`]|^\d/.test(l)));
		ok('it quotes the EPANET numbers it computed', text.indexOf(x.emitter.hour0.node.J3.demand.toFixed(2)) >= 0 && text.indexOf(x.pumpSpeed[0].link.PU1.flow.toFixed(1)) >= 0 && text.indexOf(x.mixing.lifo[12].node.T1.quality.toFixed(3)) >= 0);
		ok('it says why Net3 does not write its quality', /every water quality table was empty/.test(text));
		ok('it uses no em dash', text.indexOf('—') < 0);
	}

	fs.rmSync(out, { recursive: true, force: true });
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall checks passed');
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });
