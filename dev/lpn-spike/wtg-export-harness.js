// THE WATERGEMS EXPORT SPIKE, dev/lpn-spike/wtg-export.js -- writes Net3 into a WaterGEMS project
// and reads it straight back. Run with:
//
//   node dev/lpn-spike/wtg-export-harness.js
//
// WHAT THE PROOF IS, AND WHAT IT IS NOT. The proof is that the file is a sound SQLite database
// (checked by Python's sqlite3 as well as sql.js), that the reader written for WaterGEMS files
// (js/lpn-wtg.js, branch feat/sqlite-reader) reads back every element, attribute, pattern, pump
// curve and control we wrote, and that EPANET solves the read-back network over 24 hours to the
// same heads and flows as it solves Net3 itself. It is NOT proof that WaterGEMS opens the file:
// only Tom's WaterGEMS can say that. The reader here was written from the same samples as the
// writer, so agreement shows consistency, not truth.
//
// NEEDS: the saved WaterGEMS project the writer takes its schema from (Tom's, outside the repo):
//   $WTG_TEMPLATE_DIR, default ~/webdev/fixtures/wtg-tgh-1  (WTG-tgh-1.wtg.sqlite + WTG-tgh-1.wtg)
// and the reader/sql.js files from branch feat/sqlite-reader (dev/lpn-spike/wtg-sqljs.js fetches them
// with `git show`). Missing either, the harness prints NOT RUN and exits 0.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
require('./bootstrap.js');
const helper = require('./wtg-sqljs.js');
const lib = require('./wtg-export.js');

const TEMPLATE_DIR = process.env.WTG_TEMPLATE_DIR || path.join(os.homedir(), 'webdev', 'fixtures', 'wtg-tgh-1');
const TPL_SQLITE = path.join(TEMPLATE_DIR, 'WTG-tgh-1.wtg.sqlite'), TPL_WTG = path.join(TEMPLATE_DIR, 'WTG-tgh-1.wtg');

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAILED: ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function head(t) { console.log('\n' + t); }

(async function () {
	let readerPaths;
	try { readerPaths = helper.readerPaths(); helper.sqlJsPath(); } catch (e) { readerPaths = null; }
	if (!fs.existsSync(TPL_SQLITE) || !readerPaths) {
		console.log('NOT RUN: needs ' + TPL_SQLITE + ' (a project saved from WaterGEMS) and the reader from branch feat/sqlite-reader.');
		process.exit(0);
	}
	const EngCalcs = require(path.join(ROOT, 'js', 'lpn-solver.js')); global.EngCalcs = EngCalcs;
	require(path.join(ROOT, 'js', 'lpn-patterns.js')); require(path.join(ROOT, 'js', 'lpn-inp.js'));
	require(readerPaths.sqlite); require(readerPaths.wtg);
	const initSqlJs = require(helper.sqlJsPath());
	const wasm = fs.readFileSync(helper.wasmPath());
	const SQL = await initSqlJs({ wasmBinary: wasm });
	EngCalcs.lpnSqliteSetEngine(initSqlJs, wasm);

	const inpText = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net3.inp'), 'utf8');
	const parsed = EngCalcs.lpnInpParse(inpText);

	// ---- 1. write ----
	head('1. Write Net3 into a copy of the saved WaterGEMS project');
	const tplBytes = fs.readFileSync(TPL_SQLITE);
	const watch = Array.from(new Set(parsed.links.filter((l) => l.type === 'pump').map((l) => l.id).concat(parsed.controls.map((c) => c.link))));
	const ref = await lib.epanetReference(inpText, watch, parsed.nodes.map((n) => n.id), parsed.links.map((l) => l.id));
	const out = lib.writeWtg(SQL, tplBytes, parsed, { initial: ref.initial, changes: ref.changes }, { name: 'Net3', efficiency: 75 });
	const R = out.report;
	ok('the template file was not modified (its bytes are the same after the run)', Buffer.compare(tplBytes, fs.readFileSync(TPL_SQLITE)) === 0);
	ok('92 junctions, 2 reservoirs, 3 tanks, 117 pipes, 2 pumps',
		R.counts.junctions === 92 && R.counts.reservoirs === 2 && R.counts.tanks === 3 && R.counts.pipes === 117 && R.counts.pumps === 2, JSON.stringify(R.counts));
	ok('4 pipes added for the pumps (one each side of each pump node)', R.counts.pumpConnectingPipes === 4);
	ok('6 clock-time controls: pump 10 at 1:00 and 15:00, and 335/330 at the two tank-level crossings', R.counts.controls === 6,
		JSON.stringify(ref.changes));
	ok('sql.js integrity_check ok and no foreign key violations', R.integrity === 'ok' && R.foreignKeyViolations === 0, R.integrity + ' / ' + R.foreignKeyViolations);

	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'wtg-export-'));
	const sqlitePath = path.join(tmp, 'Net3.wtg.sqlite'), wtgPath = path.join(tmp, 'Net3.wtg');
	fs.writeFileSync(sqlitePath, out.bytes);
	if (fs.existsSync(TPL_WTG)) {
		fs.writeFileSync(wtgPath, lib.patchWtgXml(fs.readFileSync(TPL_WTG, 'utf8'), R.removedChildScenarios, 1, R.removedChildAlternatives, R.extentFt));
	}

	// ---- 2. a different SQLite agrees the file is sound ----
	head('2. Python\'s sqlite3 (a different SQLite build) checks the file');
	const py = "import sqlite3,sys,json\ndb=sqlite3.connect('file:'+sys.argv[1]+'?mode=ro',uri=True)\n"
		+ "print(json.dumps({'integrity':db.execute('pragma integrity_check').fetchone()[0],'fk':len(db.execute('pragma foreign_key_check').fetchall()),"
		+ "'tables':db.execute(\"select count(*) from sqlite_master where type='table'\").fetchone()[0],"
		+ "'live':db.execute('select count(*) from HMIDomainElement where IsDeleted=0').fetchone()[0],"
		+ "'deleted':db.execute('select count(*) from HMIDomainElement where IsDeleted=1').fetchone()[0],"
		+ "'ver':db.execute(\"select Value from HMISchemaVersionInfo where Name='HMICoreSchemaVersion'\").fetchone()[0]}))";
	const pyOut = JSON.parse(execFileSync('python3', ['-I', '-c', py, sqlitePath], { encoding: 'utf8' }));
	ok('integrity_check ok, no foreign key violations', pyOut.integrity === 'ok' && pyOut.fk === 0, JSON.stringify(pyOut));
	ok('same table count as the template (406): the schema is untouched', pyOut.tables === 406);
	ok('220 live elements (97 nodes + 2 pump nodes + 121 pipes), none soft-deleted', pyOut.live === 220 && pyOut.deleted === 0);
	ok('schema version is the template\'s', pyOut.ver === '1.0.54.0', pyOut.ver);

	// ---- 3. read it back with the WaterGEMS reader ----
	head('3. Read it back with the WaterGEMS reader (branch feat/sqlite-reader)');
	const db = await EngCalcs.lpnSqliteOpen(fs.readFileSync(sqlitePath));
	ok('recognised as a WaterGEMS model', EngCalcs.lpnWtgIsWtg(db));
	const display = fs.existsSync(wtgPath) ? EngCalcs.lpnWtgDisplayUnits(fs.readFileSync(wtgPath, 'utf8')) : {};
	const rb = EngCalcs.lpnWtgRead(db, { display: display, flowUnits: 'GPM' });
	ok('read succeeds', rb.ok, rb.message);
	const back = EngCalcs.lpnInpParse(rb.inp);
	const byId = (arr) => Object.fromEntries(arr.map((x) => [x.id, x]));
	const bn = byId(back.nodes), bl = byId(back.links);
	ok('the display units in the .wtg are US (GPM, feet)', /gpm/i.test(display.flow || '') && /feet/i.test(display.elevation || ''), display.flow + ' ' + display.elevation);

	head('4. Every element and attribute comes back as Net3 states it');
	let nNode = 0, bad = [];
	parsed.nodes.forEach((n) => {
		const b = bn[n.id]; nNode++;
		if (!b || b.type !== n.type) { bad.push(n.id + ' kind'); return; }
		if (n.type === 'junction') {
			if (b.elev !== n.elev) { bad.push(n.id + ' elev ' + b.elev + ' vs ' + n.elev); }
			if (Math.abs(b.demand - n.demand) > 1e-6 * Math.max(1, Math.abs(n.demand))) { bad.push(n.id + ' demand ' + b.demand + ' vs ' + n.demand); }
			const want = n.demand ? (n.demandPattern || parsed.defaultPattern) : null;
			if (n.demand && b.demandPattern !== want) { bad.push(n.id + ' pattern ' + b.demandPattern + ' vs ' + want); }
		} else if (n.type === 'reservoir') {
			if (b.head !== n.head) { bad.push(n.id + ' head'); }
		} else {
			['elev', 'level', 'minLevel', 'maxLevel', 'diameter'].forEach((k) => {
				if (Math.abs(b[k] - n[k]) > 1e-6 * Math.max(1, Math.abs(n[k]))) { bad.push(n.id + ' ' + k + ' ' + b[k] + ' vs ' + n[k]); }
			});
		}
	});
	ok('all ' + nNode + ' nodes (elevation, demand, pattern, head, tank geometry)', bad.length === 0, bad.slice(0, 6).join('; '));
	bad = [];
	let nPipe = 0;
	parsed.links.filter((l) => l.type === 'pipe').forEach((l) => {
		const b = bl[l.id]; nPipe++;
		if (!b || b.type !== 'pipe') { bad.push(l.id + ' missing'); return; }
		['length', 'diameter', 'roughness', 'k'].forEach((k) => {
			if (Math.abs((b[k] || 0) - (l[k] || 0)) > 1e-6 * Math.max(1, Math.abs(l[k] || 0))) { bad.push(l.id + ' ' + k + ' ' + b[k] + ' vs ' + l[k]); }
		});
		if (b.from !== l.from || b.to !== l.to) { bad.push(l.id + ' ends ' + b.from + '-' + b.to); }
	});
	ok('all ' + nPipe + ' pipes (ends, length, diameter, C, minor loss)', bad.length === 0, bad.slice(0, 6).join('; '));
	// Pipe 330 starts closed: that is the status EPANET holds at time zero after its level control acts.
	ok('pipe 330 starts Closed, as EPANET holds it at 0:00', String(bl['330'].status).toUpperCase() === 'CLOSED');

	// Pumps: a node with a pipe each side.
	const curvePts = (id) => (back.curves.find((c) => c.id === id) || { points: [] }).points;
	parsed.links.filter((l) => l.type === 'pump').forEach((pm) => {
		const b = bl[pm.id];
		ok('pump ' + pm.id + ' is a link between two coincident junctions ' + (b && b.from) + ' / ' + (b && b.to), !!b && b.type === 'pump');
		const a = bl[pm.id + '-A'], z = bl[pm.id + '-B'];
		ok('pump ' + pm.id + ': the upstream pipe runs ' + pm.from + ' to the pump, the downstream pipe from the pump to ' + pm.to,
			!!a && !!z && a.from === pm.from && a.to === b.from && z.from === b.to && z.to === pm.to, a && z && (a.from + '>' + a.to + ' / ' + z.from + '>' + z.to));
		const want = (parsed.curves.find((c) => c.id === pm.curveId) || {}).points;
		const got = curvePts(b.curveId);
		ok('pump ' + pm.id + ': the three-point curve ' + JSON.stringify(want), JSON.stringify(got.map((p) => p.map((v) => Math.round(v * 1e6) / 1e6))) === JSON.stringify(want), JSON.stringify(got));
	});
	ok('pump 10 starts Closed (its suction pipe is Closed)', String(bl['10-A'].status).toUpperCase() === 'CLOSED');
	let patBad = [];
	parsed.patterns.forEach((p) => {
		const q = back.patterns.find((x) => x.id === p.id);
		if (!q || q.multipliers.length !== p.multipliers.length || q.multipliers.some((v, i) => Math.abs(v - p.multipliers[i]) > 1e-9)) { patBad.push(p.id); }
	});
	ok('all 5 patterns: 24 hourly values each', patBad.length === 0, patBad.join());
	ok('EPS: 24 h, 1 h step, starting at midnight', back.times.duration === 86400 && back.times.hydraulicStep === 3600 && back.times.startClock === 0, JSON.stringify(back.times && { d: back.times.duration, h: back.times.hydraulicStep }));
	ok('the six controls come back as clock-time controls', back.controls.length === 6 && back.controls.every((c) => /CLOCKTIME/i.test(c.raw)), String(back.controls.length));

	// ---- 5. EPANET solves both ----
	head('5. EPANET solves Net3 and the read-back network over 24 hours');
	const ids = parsed.nodes.map((n) => n.id), lids = parsed.links.filter((l) => l.type !== 'pump').map((l) => l.id).concat(parsed.links.filter((l) => l.type === 'pump').map((l) => l.id));
	const A = await lib.epanetReference(inpText, [], ids, lids);
	const B = await lib.epanetReference(rb.inp, [], ids, lids);
	const hours = Object.keys(A.snapshots).map(Number).sort((a, b) => a - b);
	ok('25 hourly results in each', hours.length === 25 && Object.keys(B.snapshots).length === 25);
	let wh = 0, whAt = '', wq = 0, wqAt = '', wt = 0, nh = 0, nq = 0;
	hours.forEach((t) => {
		const a = A.snapshots[t], b = B.snapshots[t];
		ids.forEach((id) => { const d = Math.abs(a.heads[id] - b.heads[id]); nh++; if (d > wh) { wh = d; whAt = id + ' at ' + t / 3600 + ' h'; } });
		lids.forEach((id) => { const d = Math.abs(a.flows[id] - b.flows[id]); nq++; if (d > wq) { wq = d; wqAt = id + ' at ' + t / 3600 + ' h'; } });
	});
	ok('head: ' + nh + ' comparisons, worst ' + wh.toFixed(4) + ' ft at ' + whAt + ' (tolerance 0.05 ft)', wh < 0.05);
	// 3 gpm, not 1: the reader writes a clock-time control to the minute (4:13 for 4:13:33), so its
	// .inp switches pumps up to 59 s early, which moves a flow by a gpm or two for the hours after.
	// The database holds the seconds exactly (checked below).
	ok('flow: ' + nq + ' comparisons, worst ' + wq.toFixed(3) + ' gpm at ' + wqAt + ' (tolerance 3 gpm)', wq < 3.0);
	const stored = db.select('SELECT ClockTimeType_ClockTime FROM IdahoControlCondition_SimpleConditionType_ClockTimeType').rows.map((r) => r[0] % 86400).sort((p, q) => p - q);
	const wanted = ref.changes.map((c) => c.t % 86400).sort((p, q) => p - q);
	ok('the six switching times are stored to the second: ' + wanted.join(', '), JSON.stringify(stored) === JSON.stringify(wanted), stored.join(', '));
	// The time-zero comparison alone, which does not depend on the control schedule at all.
	let w0 = 0; ids.forEach((id) => { w0 = Math.max(w0, Math.abs(A.snapshots[0].heads[id] - B.snapshots[0].heads[id])); });
	ok('time zero: heads at all 97 nodes agree within 0.001 ft (worst ' + w0.toExponential(2) + ')', w0 < 0.001);

	// The tanks must actually move, or every number above could agree while both runs are flat.
	['1', '2', '3'].forEach((id) => {
		const lo = Math.min.apply(null, hours.map((t) => B.snapshots[t].heads[id])), hi = Math.max.apply(null, hours.map((t) => B.snapshots[t].heads[id]));
		ok('tank ' + id + ' moves over the day in the read-back run (' + (hi - lo).toFixed(1) + ' ft)', hi - lo > 0.5);
	});

	// ---- 6. the .wtg ----
	head('6. The .wtg beside it');
	if (fs.existsSync(wtgPath)) {
		const x = fs.readFileSync(wtgPath, 'utf8');
		ok('no reference to the removed scenario or its alternatives remains',
			!/ScenarioId="38"|ScenarioID="38"|Identifier="3[678]"/.test(x), '');
		const m = /<DrawingOptions [^>]*SymbolSizeMultiplier="([^"]*)"[^>]*TextHeightMultiplier="([^"]*)"/.exec(x);
		ok('symbols and text scale with the map: Net3 spans ' + Math.round(R.extentFt) + ' ft, multipliers ' + (m && m[1]) + ' / ' + (m && m[2]),
			!!m && m[1] === String(lib.symbolMultiplier(R.extentFt)) && m[2] === m[1] && Number(m[1]) >= 40, '');
		ok('the XML is still well formed enough to count: equal numbers of < and >', (x.match(/</g) || []).length === (x.match(/>/g) || []).length);
	} else { console.log('  (no template .wtg found)'); }

	// ---- 7. the smallest network, which is the first file Tom is asked to open ----
	head('7. The tiny network (reservoir, pump, junction on a pattern, tank)');
	const tinyText = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'wtg-export-tiny.inp'), 'utf8');
	const tp = EngCalcs.lpnInpParse(tinyText);
	const tw = lib.writeWtg(SQL, tplBytes, tp, { initial: {}, changes: [] }, { name: 'Tiny', efficiency: 75 });
	ok('written, integrity ok', tw.report.integrity === 'ok' && tw.report.foreignKeyViolations === 0 && tw.report.counts.pumps === 1 && tw.report.counts.tanks === 1);
	const tdb = await EngCalcs.lpnSqliteOpen(Buffer.from(tw.bytes));
	const trb = EngCalcs.lpnWtgRead(tdb, { display: display, flowUnits: 'GPM' });
	ok('read back', trb.ok, trb.message);
	const tids = tp.nodes.map((n) => n.id), tlids = tp.links.map((l) => l.id);
	const TA = await lib.epanetReference(tinyText, [], tids, tlids), TB = await lib.epanetReference(trb.inp, [], tids, tlids);
	let th = 0, tq = 0;
	Object.keys(TA.snapshots).forEach((t) => {
		tids.forEach((id) => { th = Math.max(th, Math.abs(TA.snapshots[t].heads[id] - TB.snapshots[t].heads[id])); });
		tlids.forEach((id) => { tq = Math.max(tq, Math.abs(TA.snapshots[t].flows[id] - TB.snapshots[t].flows[id])); });
	});
	ok('24 hours: worst head ' + th.toExponential(2) + ' ft, worst flow ' + tq.toExponential(2) + ' gpm', th < 0.01 && tq < 0.1);

	console.log(fails ? '\n' + fails + ' check(s) FAILED:' : '\nall checks passed');
	process.exit(fails ? 1 : 0);
}()).catch((e) => { console.error(e); process.exit(1); });
