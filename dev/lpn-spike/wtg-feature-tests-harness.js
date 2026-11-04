// The WaterGEMS feature writer paths (Task 749). Confirmed by Tom's WaterGEMS on 2026-11-03 and written by the page with
// no `opts.candidate`: emitter coefficient (ft3/s per psi^n), pump speed pattern (VSPType 0), tank mixing mixed/FIFO/LIFO
// (codes 1/2/3). A chemical run (constituent, bulk -2 per day, wall -1 ft per day, as Tom's own save stores it) is written with no
// candidate. Since round 3 (Tom, 2026-11-03) also written with no candidate: two-compartment mixing (code 0, percents), age (type 2)
// and trace (type 4). Since Tom's ten saves (2026-11-03) also written with no candidate: per-pipe and per-tank rates and a source's pattern.
//   node dev/lpn-spike/wtg-feature-tests-harness.js
// Checks the round-2 files dev/lpn-spike/wtg-feature-tests.js builds and the plain writer. NOT proof that WaterGEMS
// accepts the candidates: only Tom's copy can say that.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

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
	const SQL = r.env.SQL, x = r.expected, EC = r.env.EngCalcs, lib = r.env.lib;
	const GPM = 0.22280092967190634 / 100;

	const wrap = (bytes) => new SQL.Database(new Uint8Array(bytes));
	const open = (feature, name) => wrap(fs.readFileSync(path.join(out, feature, name + '.wtg.sqlite')));
	const rows = (db, sql, params) => { const st = db.prepare(sql), o = []; if (params) { st.bind(params); } while (st.step()) { o.push(st.getAsObject()); } st.free(); return o; };
	const elOf = (db, label) => rows(db, 'SELECT m.ElementID AS id FROM HMIModelingElement m JOIN HMIDomainElement d ON d.DomainElementID = m.ElementID WHERE m.Label = ? AND d.IsDeleted = 0', [label])[0].id;
	const supOf = (db, label) => rows(db, 'SELECT m.ElementID AS id FROM HMIModelingElement m JOIN HMISupportElement d ON d.SupportElementID = m.ElementID WHERE m.Label = ? AND d.IsDeleted = 0', [label])[0].id;
	const plainWrite = (inp, extra) => lib.writeWtg(r.env.SQL, r.env.tplSqlite, EC.lpnInpParse(inp), { initial: {}, changes: [] }, Object.assign({ name: 'plain', efficiency: 75 }, extra || {}));

	console.log('\nRound 2: the set');
	ok('8 files written', r.files.length === 8, String(r.files.length));
	ok('every file: integrity ok and no foreign key violations', r.files.every((f) => f.report.integrity === 'ok' && f.report.foreignKeyViolations === 0));
	ok('every file has its .wtg beside it', r.files.every((f) => fs.existsSync(path.join(f.dir, f.name + '.wtg'))));
	ok('no file names a column the template lacks', r.files.every((f) => f.report.skippedColumns.length === 0), JSON.stringify(r.files.map((f) => f.report.skippedColumns).filter((s) => s.length)));

	console.log('\n1. Two compartment (candidate only): code 0, percents');
	[['twocomp-c1-20-c2-80', 20, 80], ['twocomp-c1-80-c2-20', 80, 20]].forEach((c) => {
		const db = open('1-two-compartment', c[0]);
		const t = elOf(db, 'T1');
		const m = rows(db, 'SELECT TankMixingModel AS m FROM ConventionalTank_Constituent_Data WHERE DomainElementID = ?', [t])[0].m;
		const tc = rows(db, 'SELECT TwoCompartmentType_Compartment1 AS a, TwoCompartmentType_Compartment2 AS b FROM ConventionalTank_Constituent_TankMixingModel_TwoCompartmentType WHERE DomainElementID = ?', [t]);
		ok(c[0] + ': code 0, compartments ' + c[1] + ' and ' + c[2], m === 0 && tc.length === 1 && near(tc[0].a, c[1], 1e-9) && near(tc[0].b, c[2], 1e-9), JSON.stringify(tc));
		ok(c[0] + ': calculation type 3 (constituent) with its tolerance row', rows(db, 'SELECT CalculationType AS t FROM EpaNetEngine')[0].t === 3 && rows(db, 'SELECT COUNT(*) AS c FROM EpaNetEngine_CalculationType_ConstituentAnalysisType')[0].c === 1);
		db.close();
	});
	{
		const a = x.twoComp.frac02[12].node.T1.quality, b = x.twoComp.frac08[12].node.T1.quality;
		ok('EPANET at hour 12: 20 percent entry compartment ' + a.toFixed(3) + ' is apart from 80 percent ' + b.toFixed(3), a > b + 0.05);
	}

	console.log('\n2. Chlorine (candidate only): calculation type 3, source code 2, four reaction storages');
	[['chlorine-day-signed', 1, 1], ['chlorine-second-signed', 1 / 86400, 1], ['chlorine-day-positive', 1, -1], ['chlorine-second-positive', 1 / 86400, -1]].forEach((c) => {
		const db = open('2-chlorine', c[0]);
		const ch = rows(db, 'SELECT * FROM IdahoConstituent')[0];
		const wall = rows(db, 'SELECT FirstOrderType_FirstOrderWallReactionRate AS w FROM IdahoConstituent_WallReactionOrder_FirstOrderType')[0].w;
		ok(c[0] + ': bulk ' + (-2 * c[1] * c[2]) + ', wall ' + (-1 * c[1] * c[2]) + ', order 1 each', near(ch.IdahoConstituent_BulkReactionRate, -2 * c[1] * c[2], 1e-12) && near(wall, -1 * c[1] * c[2], 1e-12) && ch.IdahoConstituent_BulkReactionOrder === 1 && ch.WallReactionOrder === 1);
		const sysRow = rows(db, 'SELECT Constituent_ConstituentID AS c FROM Constituent_SystemData')[0].c;
		ok(c[0] + ': the project\'s constituent is the Chlorine element (support type 52)', sysRow === ch.SupportElementID && rows(db, 'SELECT SupportElementTypeID AS t FROM HMISupportElement WHERE SupportElementID = ?', [sysRow])[0].t === 52);
		const s = rows(db, 'SELECT Constituent_IsConstituentSource AS s, ConstituentSourceType AS t, BaselineConcentration AS b FROM BaseIdahoNode_Constituent_Data WHERE DomainElementID = ?', [elOf(db, 'J0')])[0];
		ok(c[0] + ': J0 is a source, code 2 (set point), strength 1.0', s.s === 1 && s.t === 2 && s.b === 1.0);
		ok(c[0] + ': calculation type 3 with a constituent tolerance of 0.01', rows(db, 'SELECT CalculationType AS t FROM EpaNetEngine')[0].t === 3 && rows(db, 'SELECT ConstituentAnalysisType_ConstituentTolerance AS v FROM EpaNetEngine_CalculationType_ConstituentAnalysisType')[0].v === 0.01);
		db.close();
	});
	{
		const c24 = x.chlorine[24].node, n24 = x.chlorineNoDecay[24].node;
		ok('EPANET: the reactions lower the chlorine at J1 and T1 (' + c24.J1.quality.toFixed(3) + ' < ' + n24.J1.quality.toFixed(3) + ', ' + c24.T1.quality.toFixed(3) + ' < ' + n24.T1.quality.toFixed(3) + ')', c24.J1.quality < n24.J1.quality - 0.01 && c24.T1.quality < n24.T1.quality - 0.01);
	}
	// every source type's code, from one chlorine network with the source type changed (candidate only)
	{
		const inp = fs.readFileSync(path.join(out, '2-chlorine', 'chlorine.inp'), 'utf8');
		[['CONCEN', 0], ['FLOWPACED', 1], ['SETPOINT', 2], ['MASS', 3]].forEach((c) => {
			const w = plainWrite(inp.replace(/J0\s+SETPOINT/, 'J0 ' + c[0]), { candidate: { wq: {} } });
			const db = wrap(w.bytes);
			const j0 = elOf(db, 'J0');
			const s = rows(db, 'SELECT ConstituentSourceType AS t, BaselineConcentration AS b FROM BaseIdahoNode_Constituent_Data WHERE DomainElementID = ?', [j0])[0];
			const mass = rows(db, 'SELECT MassBoosterType_BaselineMassRate AS m FROM BaseIdahoNode_Constituent_ConstituentSourceType_MassBoosterType WHERE DomainElementID = ?', [j0]);
			ok(c[0] + ' source is stored as code ' + c[1] + (c[1] === 3 ? ', its rate in the mass booster table (not confirmed there)' : ''), s.t === c[1] && (c[1] === 3 ? mass.length === 1 && mass[0].m === 1.0 && s.b === 0 : mass.length === 0), JSON.stringify([s, mass]));
			db.close();
		});
	}

	console.log('\n3. Age and trace (candidate only): calculation types 2 and 4');
	{
		const db = open('3-age-and-trace', 'age');
		ok('age: calculation type 2 with an age tolerance row, no constituent element', rows(db, 'SELECT CalculationType AS t FROM EpaNetEngine')[0].t === 2 && rows(db, 'SELECT COUNT(*) AS c FROM EpaNetEngine_CalculationType_AgeAnalysisType')[0].c === 1 && rows(db, 'SELECT COUNT(*) AS c FROM IdahoConstituent')[0].c === 0);
		db.close();
		const db2 = open('3-age-and-trace', 'trace');
		ok('trace: calculation type 4 with a trace tolerance row; the trace element is reservoir R', rows(db2, 'SELECT CalculationType AS t FROM EpaNetEngine')[0].t === 4 && rows(db2, 'SELECT COUNT(*) AS c FROM EpaNetEngine_CalculationType_TraceAnalysisType')[0].c === 1
			&& rows(db2, 'SELECT Trace_TraceElement AS t FROM Trace_SystemData')[0].t === elOf(db2, 'R'));
		db2.close();
		ok('EPANET: age at T1 is older than at J1, and trace at T1 is a fraction of J1\'s 100 percent', x.age[24].node.T1.quality > x.age[24].node.J1.quality && near(x.trace[24].node.J1.quality, 100, 0.01) && x.trace[24].node.T1.quality < 100);
	}

	console.log('\nConfirmed 2026-11-03: written with NO candidate');
	{
		const w = plainWrite(ft.EMITTER_NET);
		const db = wrap(w.bytes);
		const v = (lab) => rows(db, 'SELECT Physical_EmitterCoefficient AS v FROM IdahoFireFlowNode_Physical_Data WHERE DomainElementID = ?', [elOf(db, lab)])[0].v;
		ok('emitter: J3 (1.0 gpm per psi^0.5) is stored as 1.0 x 0.00222800929672 ft3/s per psi^0.5', near(v('J3'), 1.0 * 0.00222800929672, 1e-12), String(v('J3')));
		ok('emitter: J1 (0.01) is stored as 0.01 x 0.00222800929672; J2 stores 0', near(v('J1'), 0.01 * 0.00222800929672, 1e-13) && v('J2') === 0);
		ok('emitter: the export no longer lists the emitters as not written', !w.report.notCarried.some((s) => /^emitter on/.test(s)));
		db.close();
		// The parser keeps k in SI whatever the project displays; the stored number comes from that SI value, so it is one number per physical emitter.
		const par = EC.lpnInpParse(ft.EMITTER_NET);
		const k3 = par.nodes.filter((n) => n.id === 'J3')[0].emitter;
		ok('emitter: the parser holds J3 in SI (not 1.0), which the writer converts back', k3 > 0 && !near(k3, 1.0, 1e-3), String(k3));
	}
	{
		const w = plainWrite(ft.cyclingNet({ pumpPattern: true }));
		const db = wrap(w.bytes);
		const pump = elOf(db, 'PU1'), pat = supOf(db, 'SP');
		const d = rows(db, 'SELECT Physical_IsVariableSpeedPump AS iv, VSPType AS t FROM StandardPump_Physical_Data WHERE DomainElementID = ?', [pump])[0];
		const pb = rows(db, 'SELECT PatternBasedType_Pattern AS p FROM StandardPump_Physical_VSPType_PatternBasedType WHERE DomainElementID = ?', [pump]);
		ok('pump speed: PU1 is a variable speed pump, VSPType 0, on pattern SP', d.iv === 1 && d.t === 0 && pb.length === 1 && pb[0].p === pat, JSON.stringify(d));
		const pts = rows(db, 'SELECT PatternCurve_TimeFromStart AS t, PatternCurve_Multiplier AS m FROM IdahoPattern_PatternCurve WHERE SupportElementID = ? ORDER BY t', [pat]);
		ok('pump speed: SP is written stepwise (24 points, closing on the first value)', pts.length === 24 && pts[0].t === 3600 && pts[23].t === 86400 && pts[23].m === 1.0 && pts[5].m === 0.9);
		ok('pump speed: the export no longer lists the pattern as not written', !w.report.notCarried.some((s) => /^speed pattern/.test(s)));
		db.close();
		const w2 = plainWrite(ft.cyclingNet({}));
		const db2 = wrap(w2.bytes);
		ok('a pump with no speed pattern stays a fixed speed pump', rows(db2, 'SELECT COUNT(*) AS c FROM StandardPump_Physical_Data WHERE Physical_IsVariableSpeedPump = 1')[0].c === 0);
		db2.close();
	}
	{
		[['MIXED', 1], ['FIFO', 2], ['LIFO', 3]].forEach((c) => {
			const w = plainWrite(ft.cyclingNet({ quality: 'Chlorine mg/L', source: true, mixing: c[0] }));
			const db = wrap(w.bytes);
			const m = rows(db, 'SELECT TankMixingModel AS m FROM ConventionalTank_Constituent_Data WHERE DomainElementID = ?', [elOf(db, 'T1')])[0].m;
			ok('tank mixing ' + c[0] + ' is stored as code ' + c[1] + ' with no candidate', m === c[1], String(m));
			ok('...and the export does not list it as not written', !w.report.notCarried.some((s) => /mixing on tank/.test(s)));
			db.close();
		});
		const w = plainWrite(ft.cyclingNet({ quality: 'Chlorine mg/L', source: true, mixing: '2COMP 0.2' }));
		const db = wrap(w.bytes);
		const tc = rows(db, 'SELECT TwoCompartmentType_Compartment1 AS a, TwoCompartmentType_Compartment2 AS b FROM ConventionalTank_Constituent_TankMixingModel_TwoCompartmentType WHERE DomainElementID = ?', [elOf(db, 'T1')]);
		ok('two-compartment mixing 0.2 is written with no candidate: code 0, compartments 20 and 80 percent (Tom, round 3)',
			rows(db, 'SELECT TankMixingModel AS m FROM ConventionalTank_Constituent_Data WHERE DomainElementID = ?', [elOf(db, 'T1')])[0].m === 0
			&& tc.length === 1 && near(tc[0].a, 20, 1e-9) && near(tc[0].b, 80, 1e-9) && w.report.candidateWritten === undefined, JSON.stringify(tc));
		ok('...and the report does not list it as not written', !w.report.notCarried.some((s) => /two-compartment mixing/.test(s)));
		const w8 = plainWrite(ft.cyclingNet({ quality: 'Chlorine mg/L', source: true, mixing: '2COMP 0.8' }));
		const db8 = wrap(w8.bytes);
		const tc8 = rows(db8, 'SELECT TwoCompartmentType_Compartment1 AS a, TwoCompartmentType_Compartment2 AS b FROM ConventionalTank_Constituent_TankMixingModel_TwoCompartmentType')[0];
		ok('0.8 stores compartment 1 = 80 and compartment 2 = 20', near(tc8.a, 80, 1e-9) && near(tc8.b, 20, 1e-9), JSON.stringify(tc8));
		db8.close();
		const w3 = plainWrite(ft.cyclingNet({ quality: 'Chlorine mg/L', source: true, mixing: '2COMP 0.333' }));
		const db3m = wrap(w3.bytes);
		const tc3 = rows(db3m, 'SELECT TwoCompartmentType_Compartment1 AS a, TwoCompartmentType_Compartment2 AS b FROM ConventionalTank_Constituent_TankMixingModel_TwoCompartmentType')[0];
		ok('0.333 stores 33.3 and 66.7, which add to 100', near(tc3.a, 33.3, 1e-9) && near(tc3.a + tc3.b, 100, 1e-9), JSON.stringify(tc3));
		db3m.close();
		const wn = plainWrite(ft.cyclingNet({ quality: 'Chlorine mg/L', source: true, mixing: '2COMP' }));
		const dbn = wrap(wn.bytes);
		ok('a two-compartment tank with no fraction is not written (code stays 1, no row) and is listed',
			rows(dbn, 'SELECT TankMixingModel AS m FROM ConventionalTank_Constituent_Data WHERE DomainElementID = ?', [elOf(dbn, 'T1')])[0].m === 1
			&& rows(dbn, 'SELECT COUNT(*) AS c FROM ConventionalTank_Constituent_TankMixingModel_TwoCompartmentType')[0].c === 0
			&& wn.report.notCarried.some((s) => /two-compartment mixing on tank T1/.test(s)), JSON.stringify(wn.report.notCarried));
		dbn.close();
		db.close();
	}

	console.log('\nA chemical run is written with NO candidate, as Tom\'s own save stores it (2026-11-03)');
	{
		const inp = fs.readFileSync(path.join(out, '2-chlorine', 'chlorine.inp'), 'utf8');
		const plain = plainWrite(inp);
		const db = wrap(plain.bytes);
		const ch = rows(db, 'SELECT * FROM IdahoConstituent');
		ok('one Chlorine constituent: bulk -2.0 per day, order 1, wall order 1; no per-second conversion', ch.length === 1 && ch[0].IdahoConstituent_BulkReactionRate === -2 && ch[0].IdahoConstituent_BulkReactionOrder === 1 && ch[0].WallReactionOrder === 1, JSON.stringify(ch));
		ok('wall first order -1.0, and the zero order sub-table holds 0 as WaterGEMS writes it',
			rows(db, 'SELECT FirstOrderType_FirstOrderWallReactionRate AS v FROM IdahoConstituent_WallReactionOrder_FirstOrderType')[0].v === -1
			&& rows(db, 'SELECT ZeroOrderType_ZeroOrderWallReactionRate AS v FROM IdahoConstituent_WallReactionOrder_ZeroOrderType')[0].v === 0);
		ok('it is the project\'s constituent (Constituent_SystemData) and a support element of type 52 named Chlorine',
			rows(db, 'SELECT Constituent_ConstituentID AS c FROM Constituent_SystemData')[0].c === ch[0].SupportElementID && supOf(db, 'Chlorine') === ch[0].SupportElementID);
		ok('calculation type 3 with its tolerance row; J0 is a set point source (code 2) at 1.0',
			rows(db, 'SELECT CalculationType AS t FROM EpaNetEngine')[0].t === 3 && rows(db, 'SELECT COUNT(*) AS c FROM EpaNetEngine_CalculationType_ConstituentAnalysisType')[0].c === 1
			&& rows(db, 'SELECT ConstituentSourceType AS t, BaselineConcentration AS b FROM BaseIdahoNode_Constituent_Data WHERE DomainElementID = ?', [elOf(db, 'J0')])[0].t === 2);
		ok('nothing is written under a candidate name: candidateWritten is unset, and the report no longer lists the chemical as not written',
			plain.report.candidateWritten === undefined && plain.report.carried.some((s) => /^chemical Chlorine: bulk -2, wall -1 per day/.test(s)) && !plain.report.notCarried.some((s) => /reactions, sources/.test(s)));
		db.close();
		// what is still candidate-only is still not written without one
		const loc = plainWrite(inp.replace('[END]', '[REACTIONS]\n Bulk 1 -3\n\n[END]'));
		const db2 = wrap(loc.bytes);
		ok('a rate stated for one pipe is not written without a candidate', rows(db2, 'SELECT COUNT(*) AS c FROM IdahoPipe_Constituent_Data WHERE Constituent_SpecifyLocalBulkReactionRate = 1')[0].c === 0);
		db2.close();
		const ageW = plainWrite(fs.readFileSync(path.join(out, '3-age-and-trace', 'age.inp'), 'utf8'));
		const db3 = wrap(ageW.bytes);
		ok('an age run is written with no candidate: calculation type 2 with its tolerance row, no constituent, and not listed as lost',
			rows(db3, 'SELECT CalculationType AS t FROM EpaNetEngine')[0].t === 2 && rows(db3, 'SELECT COUNT(*) AS c FROM EpaNetEngine_CalculationType_AgeAnalysisType')[0].c === 1
			&& rows(db3, 'SELECT COUNT(*) AS c FROM IdahoConstituent')[0].c === 0 && ageW.report.candidateWritten === undefined && ageW.report.ageTraceWritten === true
			&& !ageW.report.notCarried.some((s) => /reactions, sources/.test(s)));
		const trW = plainWrite(fs.readFileSync(path.join(out, '3-age-and-trace', 'trace.inp'), 'utf8'));
		const dbt = wrap(trW.bytes);
		ok('a trace run from R is written with no candidate: type 4, tolerance row, Trace_SystemData holds R',
			rows(dbt, 'SELECT CalculationType AS t FROM EpaNetEngine')[0].t === 4 && rows(dbt, 'SELECT COUNT(*) AS c FROM EpaNetEngine_CalculationType_TraceAnalysisType')[0].c === 1
			&& rows(dbt, 'SELECT Trace_TraceElement AS e FROM Trace_SystemData')[0].e === elOf(dbt, 'R'));
		dbt.close();
		const trBad = plainWrite(fs.readFileSync(path.join(out, '3-age-and-trace', 'trace.inp'), 'utf8').replace('Trace R', 'Trace NOPE'));
		ok('a trace from a node that does not exist is not written and stays listed', trBad.report.ageTraceWritten === undefined && trBad.report.notCarried.some((s) => /reactions, sources/.test(s)));
		db3.close();
		const noQ = plainWrite(ft.cyclingNet({}));
		const db4 = wrap(noQ.bytes);
		ok('a project with no quality analysis has no constituent and stays type 5', rows(db4, 'SELECT COUNT(*) AS c FROM IdahoConstituent')[0].c === 0 && rows(db4, 'SELECT CalculationType AS t FROM EpaNetEngine')[0].t === 5);
		db4.close();
	}

	console.log('\nThe README');
	{
		const text = ft.readme(x);
		const lines = text.split('\n').filter((l) => l.trim());
		ok('every paragraph is one line (no line is a wrapped fragment)', lines.every((l) => /^#|^[A-Z`]|^\d/.test(l)));
		ok('it quotes the EPANET numbers it computed', text.indexOf(x.twoComp.frac02[12].node.T1.quality.toFixed(3)) >= 0 && text.indexOf(x.chlorine[24].node.J1.quality.toFixed(3)) >= 0 && text.indexOf(x.age[24].node.T1.quality.toFixed(2)) >= 0);
		ok('it asks for the saved file with bulk -2 per day and wall -1 ft per day', /bulk reaction rate of -2 per day and a wall reaction rate of -1 ft per day/.test(text));
		ok('it uses no em dash', text.indexOf('—') < 0);
	}

	console.log('\nRound 3 (dev/lpn-spike/wtg-feature-tests-3.js)');
	{
		const ft3 = require('./wtg-feature-tests-3.js');
		const out3 = fs.mkdtempSync(path.join(os.tmpdir(), 'wtg-feature-tests-3-'));
		const r3 = await ft3.build(out3);
		ok('6 files written, each with integrity ok, no foreign key violation and its .wtg beside it', r3.files.length === 6 && r3.files.every((f) => f.report.integrity === 'ok' && f.report.foreignKeyViolations === 0 && fs.existsSync(path.join(f.dir, f.name + '.wtg'))));
		const chl = r3.files.filter((f) => f.name === 'chlorine')[0];
		ok('the chlorine file is written by the page\'s path: no candidate', chl.candidate === undefined && chl.report.candidateWritten === undefined);
		const dbq = wrap(fs.readFileSync(path.join(out3, '2-two-compartment', 'twocomp-c1-20-c2-80-wq5min.wtg.sqlite')));
		const eq = rows(dbq, 'SELECT EpaSetWaterQualityTimeStep AS f, EpaWaterQualityTimeStep AS s FROM EpaNetEngine')[0];
		ok('the wq5min file sets the water quality time step flag and 300 seconds', eq.f === 1 && eq.s === 300, JSON.stringify(eq));
		dbq.close();
		const db20 = wrap(fs.readFileSync(path.join(out3, '2-two-compartment', 'twocomp-c1-20-c2-80.wtg.sqlite')));
		ok('the plain two compartment file leaves the time step at the template\'s', rows(db20, 'SELECT EpaSetWaterQualityTimeStep AS f FROM EpaNetEngine')[0].f === 0);
		db20.close();
		const e = r3.expected.twoComp;
		ok('EPANET at the 5 minute step (converged; the loop now runs every quality step) puts the 20 and 80 percent tanks within 0.1 of Tom\'s readings at hour 12 (' + e.step5min.frac02[12].node.T1.quality.toFixed(3) + ', ' + e.step5min.frac08[12].node.T1.quality.toFixed(3) + ')',
			near(e.step5min.frac02[12].node.T1.quality, 0.5, 0.1) && near(e.step5min.frac08[12].node.T1.quality, 0.4, 0.1));
		const text3 = ft3.readme(r3.expected);
		ok('the round 3 README names the single most useful step first, quotes the EPANET numbers, uses no em dash and mentions no letter',
			text3.indexOf('## Single most useful step') > 0 && text3.indexOf('## Single most useful step') < text3.indexOf('## 1-chlorine') && text3.indexOf(e.step5min.frac02[12].node.T1.quality.toFixed(3)) >= 0 && text3.indexOf('\u2014') < 0 && !/letter|Bentley/i.test(text3));
		fs.rmSync(out3, { recursive: true, force: true });
	}

	console.log('\nRound 4 (dev/lpn-spike/wtg-feature-tests-4.js)');
	{
		const ft4 = require('./wtg-feature-tests-4.js');
		const out4 = fs.mkdtempSync(path.join(os.tmpdir(), 'wtg-feature-tests-4-'));
		const r4 = await ft4.build(out4);
		ok('4 files written by the page\'s own path (no candidate), each with integrity ok and no foreign key violation', r4.files.length === 4 && r4.files.every((f) => f.candidate === undefined && f.report.candidateWritten === undefined && f.report.integrity === 'ok' && f.report.foreignKeyViolations === 0 && fs.existsSync(path.join(f.dir, f.name + '.wtg'))));
		const e4 = r4.expected;
		ok('EPANET with the pump held as two 1 ft pipes reproduces WaterGEMS\'s J1 age of 0.173 h to the third decimal (' + e4.age[24].node.J1.quality.toFixed(3) + ')', near(e4.age[24].node.J1.quality, e4.tomAge.J1_24, 0.0005));
		ok('chlorine at a 1 hour step: T1 with the reactions (' + e4.chlorine[12].node.T1.quality.toFixed(3) + ') rounds to 0.2 as Tom read, with none to 0.4', e4.chlorine[12].node.T1.quality.toFixed(1) === '0.2' && e4.chlorineNoReactions[12].node.T1.quality.toFixed(1) === '0.4');
		ok('chlorine J1 tells the wall rate from the bulk rate: both ' + e4.chlorine[12].node.J1.quality.toFixed(3) + ', bulk only ' + e4.chlorineBulkOnly[12].node.J1.quality.toFixed(3), e4.chlorineBulkOnly[12].node.J1.quality - e4.chlorine[12].node.J1.quality > 0.01);
		ok('with the pump as two pipes EPANET\'s T1 hardly depends on the step (6 min, 30 min, 1 h within 0.03 at hour 12): the earlier swing was a harness fault', [e4.twoComp.step5min, e4.twoComp.step30min, e4.twoComp.step1h].every((x) => near(x[12].node.T1.quality, e4.twoComp.step5min[12].node.T1.quality, 0.03)));
		const db4t = wrap(fs.readFileSync(path.join(out4, '1-quality-step', 'twocomp-c1-20-c2-80.wtg.sqlite')));
		ok('the round 4 two-compartment file leaves the quality step at the template\'s and holds 20 and 80', rows(db4t, 'SELECT EpaSetWaterQualityTimeStep AS f FROM EpaNetEngine')[0].f === 0
			&& rows(db4t, 'SELECT TwoCompartmentType_Compartment1 AS a FROM ConventionalTank_Constituent_TankMixingModel_TwoCompartmentType')[0].a === 20);
		db4t.close();
		const text4 = ft4.readme(e4);
		const sm = text4.indexOf('## Single most useful step');
		ok('the round 4 README leads with the single most useful step, quotes the EPANET numbers, uses no em dash and mentions no letter',
			sm > 0 && sm < text4.indexOf('## 1-quality-step') && text4.indexOf(e4.twoComp.step30min[12].node.T1.quality.toFixed(3)) >= 0 && text4.indexOf('\u2014') < 0 && !/letter|Bentley/i.test(text4));
		ok('every paragraph is one line and no code appears', text4.split('\n').filter((l) => l.trim()).every((l) => /^#|^[A-Z`]|^\d/.test(l)) && !/```|=>|function /.test(text4));
		fs.rmSync(out4, { recursive: true, force: true });
	}

	console.log('\nTom\'s ten saves of 2026-11-03 (dev/lpn-spike/wtg-saves-epanet.js, dev/wtg-export.md "Tom\'s ten saves")');
	{
		const sv = require('./wtg-saves-epanet.js');
		const base = sv.chlorineNet();
		// 5. a reaction rate on one pipe: his save stored (specify 1, -10) and (specify 1, -5) in the pipe's row, in his units
		{
			const w = plainWrite(sv.CASES['rates-one-pipe'](base));
			const db = wrap(w.bytes);
			const p2 = elOf(db, '2'), p3 = elOf(db, '3');
			const a = rows(db, 'SELECT * FROM IdahoPipe_Constituent_Data WHERE DomainElementID = ?', [p2])[0], b = rows(db, 'SELECT * FROM IdahoPipe_Constituent_Data WHERE DomainElementID = ?', [p3])[0];
			ok('rates on one pipe: pipe 2 specifies bulk -10 and wall -5 (as Tom\'s save), pipe 3 specifies none', a.Constituent_SpecifyLocalBulkReactionRate === 1 && a.Constituent_LocalBulkReactionRate === -10
				&& a.Constituent_SpecifyLocalWallRate === 1 && a.Constituent_WallReactionRate === -5 && a.Constituent_PipeZeroOrderWallReactionRate === 0 && b.Constituent_SpecifyLocalBulkReactionRate === 0 && b.Constituent_SpecifyLocalWallRate === 0, JSON.stringify(a));
			ok('rates on one pipe: written with no candidate', w.report.candidateWritten === undefined && w.report.chemicalWritten === true);
			db.close();
		}
		// 6. a bulk rate on the tank
		{
			const w = plainWrite(sv.CASES['rate-tank'](base));
			const db = wrap(w.bytes);
			const t = rows(db, 'SELECT * FROM ConventionalTank_Constituent_Data WHERE DomainElementID = ?', [elOf(db, 'T1')])[0];
			ok('rate on the tank: T1 specifies bulk -30 and keeps mixing code 1 (as Tom\'s save)', t.Constituent_TankSpecifyLocalBulkRate === 1 && t.Constituent_TankBulkReactionRate === -30 && t.TankMixingModel === 1, JSON.stringify(t));
			db.close();
		}
		// 7. a pattern on the booster
		{
			const w = plainWrite(sv.CASES['source-pattern'](base));
			const db = wrap(w.bytes);
			const s0 = rows(db, 'SELECT * FROM BaseIdahoNode_Constituent_Data WHERE DomainElementID = ?', [elOf(db, 'J0')])[0];
			ok('source pattern: J0 is a set point source (code 2, 1.0) naming pattern SP', s0.Constituent_IsConstituentSource === 1 && s0.ConstituentSourceType === 2 && s0.BaselineConcentration === 1 && s0.Constituent_ConstituentSourcePattern === supOf(db, 'SP'), JSON.stringify(s0));
			db.close();
		}
		// 1. a pump switched on a tank level: the action is the pump itself (ElementType 68, status 0 On / 1 Off), as Tom's save stores it
		{
			const w = plainWrite(sv.CASES['ctl-pump-level'](base));
			const db = wrap(w.bytes);
			const acts = rows(db, 'SELECT a.SimpleActionType_Element AS el, a.ElementType AS ty, p.ActionPumpStatus AS st FROM IdahoControlAction_ControlActionType_SimpleActionType a JOIN IdahoControlAction_PumpAttribute_ActionPumpStatusType p ON p.SupportElementID = a.SupportElementID ORDER BY p.ActionPumpStatus');
			ok('pump level controls: two actions on pump PU1 itself (type 68), one Off (1) and one On (0)', acts.length === 2 && acts.every((a) => a.ty === 68 && a.el === elOf(db, 'PU1')) && acts[0].st === 0 && acts[1].st === 1, JSON.stringify(acts));
			ok('pump level controls: both sit in the control set the operational alternative names', rows(db, 'SELECT COUNT(*) AS c FROM IdahoLogicalControlSet_LogicalControlCollection')[0].c === 2 && rows(db, 'SELECT Operational_IdahoControlSetID AS s FROM Operational_SystemData')[0].s !== null);
			db.close();
		}
		// 3. a junction pressure condition (candidate only: the control in Tom's save was never in the control set)
		{
			const inp = sv.CASES['ctl-pressure-time'](base).replace(' LINK PU1 OPEN AT TIME 6', '');
			const wc = plainWrite(inp, { candidate: { pressureControls: true } });
			const db = wrap(wc.bytes);
			const j1 = elOf(db, 'J1');
			const e = rows(db, 'SELECT * FROM IdahoControlCondition_SimpleConditionType_ElementType')[0];
			const op = rows(db, 'SELECT * FROM IdahoControlCondition_ConditionType_SimpleConditionType')[0];
			ok('pressure condition (candidate): J1, 60 in the pressure column, element type 50, node attribute 2, operator greater (1), as Tom\'s save', e && e.ElementType_Element === j1 && e.ElementType_Pressure === 60 && e.ElementType_TankLevel === 0 && e.ControlConditionElementType === 50
				&& rows(db, 'SELECT NodeAttribute AS a FROM IdahoControlCondition_ControlConditionElementType_ControlConditionNodeType')[0].a === 2 && op.SimpleConditionType === 0 && op.CompareOperator === 1, JSON.stringify(e));
			db.close();
			const wp = plainWrite(inp);
			const dbp = wrap(wp.bytes);
			ok('without the candidate flag no pressure condition is written', rows(dbp, 'SELECT COUNT(*) AS c FROM IdahoControlCondition_ControlConditionElementType_ControlConditionNodeType WHERE NodeAttribute = 2')[0].c === 0);
			dbp.close();
		}
		// 4. pressure-driven demand: power 0.5, threshold 40 psi
		{
			const w = plainWrite(sv.CASES['pdd-on'](base));
			const db = wrap(w.bytes);
			const sys = rows(db, 'SELECT * FROM PressureDependentDemand_SystemData')[0];
			const fn = rows(db, 'SELECT * FROM PressureDependentDemandFunction')[0];
			ok('pressure-driven demand: a type 60 function, threshold 40, has threshold 1, power type 0, exponent 0.5 (as Tom\'s save)', fn && fn.SupportElementID === sys.PressureDependentDemand_GlobalPDDFunction && fn.PressureDependentDemandFunction_PressureThreshold === 40
				&& fn.PressureDependentDemandFunction_HasThresholdPressure === 1 && fn.PddFunctionType === 0
				&& rows(db, 'SELECT PowerFunctionType_PowerFunctionExponent AS e FROM PressureDependentDemandFunction_PddFunctionType_PowerFunctionType')[0].e === 0.5
				&& rows(db, 'SELECT SupportElementTypeID AS t FROM HMISupportElement WHERE SupportElementID = ?', [fn.SupportElementID])[0].t === 60, JSON.stringify(fn));
			ok('pressure-driven demand: global reference pressure 0, percent 100, equals threshold 1, and the calculation option is on', sys.GlobalReferencePressure === 0 && sys.GlobalPddPercent === 100 && sys.GlobalRefPressureEqualsPressureThreshold === 1
				&& rows(db, 'SELECT EpaNetEngine_UsePressureDependentDemand AS u FROM EpaNetEngine')[0].u === 1);
			db.close();
			const wm = plainWrite(sv.CASES['pdd-on'](base).replace('Minimum Pressure   \t0', 'Minimum Pressure   \t5'));
			const dbm = wrap(wm.bytes);
			ok('a minimum pressure above 0 has no place in WaterGEMS\'s function: nothing is written', !wm.report.pddWritten && rows(dbm, 'SELECT COUNT(*) AS c FROM PressureDependentDemandFunction')[0].c === 0
				&& rows(dbm, 'SELECT EpaNetEngine_UsePressureDependentDemand AS u FROM EpaNetEngine')[0].u === 0);
			dbm.close();
		}
		// The EPANET side, converged (6 minute quality step), against what Tom read
		const f = await sv.figures();
		const q = (k, h, n) => f[k].step6min[h].node[n].quality;
		ok('pump level controls: EPANET T1 grade at hours 12 and 24 ' + f['ctl-pump-level'].step6min[12].node.T1.head.toFixed(2) + ', ' + f['ctl-pump-level'].step6min[24].node.T1.head.toFixed(2) + ' against Tom\'s 131.25 and 131.55', near(f['ctl-pump-level'].step6min[12].node.T1.head, 131.25, 0.2) && near(f['ctl-pump-level'].step6min[24].node.T1.head, 131.55, 0.2));
		ok('pressure-driven demand: EPANET (minimum 0, required 40 psi, exponent 0.5) delivers ' + f['pdd-on'].step6min[12].node.J1.demand.toFixed(1) + ' gpm at ' + f['pdd-on'].step6min[12].node.J1.pressure.toFixed(1) + ' psi against Tom\'s 290 at 37', near(f['pdd-on'].step6min[12].node.J1.demand, 290, 3) && near(f['pdd-on'].step6min[12].node.J1.pressure, 37, 1));
		ok('rates on one pipe: EPANET J1 hour 12 ' + q('rates-one-pipe', 12, 'J1').toFixed(3) + ' against Tom\'s 0.845 (the engines differ by about 2 percent; without the rates both read 0.96)', near(q('rates-one-pipe', 12, 'J1'), 0.845, 0.03) && q('base', 12, 'J1') > 0.95);
		ok('rate on the tank: EPANET T1 hour 24 ' + q('rate-tank', 24, 'T1').toFixed(3) + ' against Tom\'s 0.076', near(q('rate-tank', 24, 'T1'), 0.076, 0.02));
		ok('source pattern: EPANET J1 hours 6 and 14 ' + q('source-pattern', 6, 'J1').toFixed(3) + ', ' + q('source-pattern', 14, 'J1').toFixed(3) + ' against Tom\'s 0.955 and 0.479', near(q('source-pattern', 6, 'J1'), 0.955, 0.01) && near(q('source-pattern', 14, 'J1'), 0.479, 0.01));
	}

	fs.rmSync(out, { recursive: true, force: true });
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall checks passed');
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });
