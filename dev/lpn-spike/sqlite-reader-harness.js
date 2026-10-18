// THE READ-ONLY SQLITE READER, js/lpn-sqlite.js -- ROADMAP Task 749, the foundation. Run with:
//
//   node dev/lpn-spike/sqlite-reader-harness.js
//
// There is no Bentley sample yet, so the database is BUILT HERE, at test time, by Python's own
// sqlite3 (a different SQLite build from the one sql.js compiles), shaped loosely like a hydraulic
// model: nodes, pipes, scenarios with a parent column, alternatives, and a view. Writer and reader
// being different libraries is the point: one library agreeing with itself proves little.
//
// What it holds: tables, columns, row counts and cells come back as written, exactly (a REAL is
// the same double, an integer past 2^53 stays exact as a BigInt, a blob is its bytes); a WAL-mode
// file opens; the caller's bytes are unchanged afterwards and a write is refused; a file that is
// not SQLite is refused with a clear message.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const initSqlJs = require(path.join(ROOT, 'js', 'vendor', 'sql-wasm.js'));
require(path.join(ROOT, 'js', 'lpn-sqlite.js'));
const EC = globalThis.EngCalcs;

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
function head(t) { console.log('\n' + t); }
function sha(b) { return crypto.createHash('sha256').update(b).digest('hex'); }

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'lpn-sqlite-'));
const PY = `
import sqlite3, sys
path, mode = sys.argv[1], sys.argv[2]
db = sqlite3.connect(path)
if mode == 'wal':
    db.execute('PRAGMA journal_mode=WAL')
db.executescript('''
CREATE TABLE Scenario (ScenarioID INTEGER PRIMARY KEY, Label TEXT NOT NULL, ParentID INTEGER);
CREATE TABLE Alternative (AlternativeID INTEGER PRIMARY KEY, Kind TEXT, ParentID INTEGER, Level INTEGER);
CREATE TABLE Node (ElementID INTEGER PRIMARY KEY, Label TEXT, X REAL, Y REAL, Elevation REAL, Shape BLOB);
CREATE TABLE Pipe (ElementID INTEGER PRIMARY KEY, Label TEXT, StartNodeID INTEGER, StopNodeID INTEGER,
                   Diameter REAL, Roughness REAL, BigCounter INTEGER);
CREATE TABLE "Odd ""quoted"" name" (k TEXT);
CREATE VIEW PipeCount AS SELECT COUNT(*) AS n FROM Pipe;
''')
db.executemany('INSERT INTO Scenario VALUES (?,?,?)', [(1,'Base',None),(2,'Fire flow',1),(3,'Fire flow, pump off',2)])
db.executemany('INSERT INTO Alternative VALUES (?,?,?,?)', [(10,'Physical',None,0),(11,'Physical',10,1)])
db.executemany('INSERT INTO Node VALUES (?,?,?,?,?,?)', [
    (100,'J-1',0.1+0.2,-1234.5,  305.0, bytes([0,1,2,255])),
    (101,'J-2',1e-300, 6.02214076e23, None, None),
    (102,'Rés-1 ✓',0.0, 0.0, 9999.123456789012, b''),
])
db.executemany('INSERT INTO Pipe VALUES (?,?,?,?,?,?,?)', [
    (200,'P-1',100,101,0.3048,130.0, 2**60+1),
    (201,'P-2',101,102,0.1524,120.0, -42),
])
db.execute('INSERT INTO "Odd ""quoted"" name" VALUES (?)', ("it's",))
db.commit()
if mode == 'wal':
    db.execute('PRAGMA wal_checkpoint(TRUNCATE)')
db.close()
`;

function build(name, mode) {
	const p = path.join(TMP, name);
	execFileSync('python3', ['-I', '-c', PY, p, mode]);
	return p;
}

async function main() {
	head('0. The engine is the vendored one, handed over as bytes');
	const wasm = fs.readFileSync(path.join(ROOT, 'js', 'vendor', 'sql-wasm.wasm'));
	EC.lpnSqliteSetEngine(initSqlJs, wasm);
	ok('the module states its sql.js version', EC.lpnSqliteVersion === '1.14.2', EC.lpnSqliteVersion);
	const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
	ok('...and it is the version package.json pins', pkg.devDependencies['sql.js'] === EC.lpnSqliteVersion);
	const src = fs.readFileSync(path.join(ROOT, 'js', 'lpn-sqlite.js'), 'utf8');
	ok('the loader names no host but this one', !/https?:\/\//.test(src.replace(/^\s*(\*|\/\/).*$/gm, '')));

	const file = build('model.sqlite', 'plain');
	const bytes = new Uint8Array(fs.readFileSync(file));
	const before = sha(bytes);
	ok('the header test says yes to a database', EC.lpnSqliteIsSqlite(bytes) === true);

	head('1. Tables, columns and row counts');
	const db = await EC.lpnSqliteOpen(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
	const by = {};
	db.tables.forEach((t) => { by[t.name] = t; });
	const names = db.tables.map((t) => t.name);
	ok('every table and the view are listed, sorted, no sqlite_ internals',
		JSON.stringify(names) === JSON.stringify(['Alternative', 'Node', 'Odd "quoted" name', 'Pipe', 'PipeCount', 'Scenario']),
		JSON.stringify(names));
	ok('a view is marked as a view', by.PipeCount.kind === 'view' && by.Pipe.kind === 'table');
	ok('row counts', by.Scenario.rowCount === 3 && by.Node.rowCount === 3 && by.Pipe.rowCount === 2
		&& by.Alternative.rowCount === 2 && by.PipeCount.rowCount === 1);
	ok('Pipe columns in file order',
		by.Pipe.columns.map((c) => c.name).join(',') === 'ElementID,Label,StartNodeID,StopNodeID,Diameter,Roughness,BigCounter');
	ok('declared types come through', by.Node.columns.map((c) => c.type).join(',') === 'INTEGER,TEXT,REAL,REAL,REAL,BLOB');
	ok('NOT NULL and primary key come through',
		by.Scenario.columns[1].notNull === true && by.Scenario.columns[0].pk === 1 && by.Scenario.columns[2].pk === 0);

	head('2. Rows, exactly as written');
	const sc = db.readRows('Scenario');
	ok('the parent column reads as a chain', JSON.stringify(sc.rows) === JSON.stringify([[1, 'Base', null], [2, 'Fire flow', 1], [3, 'Fire flow, pump off', 2]]),
		JSON.stringify(sc.rows));
	ok('column names come with the rows', sc.columns.join(',') === 'ScenarioID,Label,ParentID');
	const nd = db.readRows('Node').rows;
	ok('a REAL is the same double (0.1+0.2)', nd[0][2] === 0.1 + 0.2, String(nd[0][2]));
	ok('tiny and huge REALs survive', nd[1][2] === 1e-300 && nd[1][3] === 6.02214076e23);
	ok('a 16-digit REAL survives', nd[2][4] === 9999.123456789012);
	ok('NULL is null', nd[1][4] === null && nd[1][5] === null);
	ok('a BLOB is its bytes', nd[0][5] instanceof Uint8Array && Array.from(nd[0][5]).join(',') === '0,1,2,255');
	ok('Unicode text survives', nd[2][1] === 'Rés-1 ✓', nd[2][1]);
	const pp = db.readRows('Pipe').rows;
	ok('an integer past 2^53 stays exact (BigInt)', pp[0][6] === (2n ** 60n) + 1n, String(pp[0][6]));
	ok('an ordinary integer is a plain number', pp[1][6] === -42 && typeof pp[1][2] === 'number');
	ok('a quoted table name is readable', db.readRows('Odd "quoted" name').rows[0][0] === "it's");
	ok('offset and limit page through a table',
		JSON.stringify(db.readRows('Scenario', { offset: 1, limit: 1 }).rows) === JSON.stringify([[2, 'Fire flow', 1]]));
	ok('select() answers an exploring query',
		db.select('SELECT Label FROM Pipe WHERE Diameter = ?', [0.1524]).rows[0][0] === 'P-2');
	let threw = null;
	try { db.readRows('Nope'); } catch (e) { threw = e; }
	ok('an unknown table is refused, by name', threw && threw.code === 'no-table', threw && threw.message);

	head('3. Read-only');
	threw = null;
	try { db.select("UPDATE Pipe SET Diameter = 1"); } catch (e) { threw = e; }
	ok('a write is refused by the engine', !!threw, threw && threw.message);
	threw = null;
	try { db.select("CREATE TABLE x (a)"); } catch (e) { threw = e; }
	ok('a CREATE is refused too', !!threw);
	ok('the value was not changed even in the engine\'s copy', db.readRows('Pipe').rows[0][4] === 0.3048);
	db.close();
	ok('the caller\'s bytes are unchanged', sha(bytes) === before);
	ok('the file on disk is unchanged', sha(fs.readFileSync(file)) === before);
	threw = null;
	try { db.readRows('Pipe'); } catch (e) { threw = e; }
	ok('a closed database says so', threw && threw.code === 'closed');

	head('4. A database saved in WAL mode');
	const wfile = build('wal.sqlite', 'wal');
	const wbytes = new Uint8Array(fs.readFileSync(wfile));
	ok('the file really is WAL-marked (header bytes 18, 19 = 2)', wbytes[18] === 2 && wbytes[19] === 2);
	const wbefore = sha(wbytes);
	const wdb = await EC.lpnSqliteOpen(wbytes);
	ok('it opens and lists its tables', wdb.tables.length === 6);
	ok('...and its rows read', wdb.readRows('Pipe').rows.length === 2);
	wdb.close();
	ok('the caller\'s bytes are unchanged', sha(wbytes) === wbefore);

	head('5. A file that is not SQLite is refused, clearly');
	const inp = fs.readFileSync(path.join(ROOT, 'dev', 'lpn-spike', 'reference', 'Net1.inp'), 'latin1');
	const cases = [
		['an EPANET .inp', new TextEncoder().encode(inp)],
		['a zip (a zipped .wtg.sqlite)', new Uint8Array([0x50, 0x4b, 0x03, 0x04].concat(new Array(200).fill(0)))],
		['an empty file', new Uint8Array(0)],
		['the header alone, too short to be a database', bytes.slice(0, 50)],
	];
	for (const [what, b] of cases) {
		ok(what + ': the header test says no', EC.lpnSqliteIsSqlite(b) === false);
		let err = null;
		try { await EC.lpnSqliteOpen(b); } catch (e) { err = e; }
		ok(what + ': open refuses with code not-sqlite', err && err.code === 'not-sqlite', err && err.message);
	}
	let err = null;
	try { await EC.lpnSqliteOpen('not bytes'); } catch (e) { err = e; }
	ok('something that is not bytes at all is refused', err && err.code === 'not-sqlite');
	const broken = bytes.slice();
	broken.fill(0x55, 100);   // a valid header over garbage pages
	err = null;
	try { const d = await EC.lpnSqliteOpen(broken); d.close(); } catch (e) { err = e; }
	ok('a damaged database is refused as unreadable, not crashed on', err && err.code === 'unreadable', err && err.message);

	fs.rmSync(TMP, { recursive: true, force: true });
	console.log('\n' + (fails ? fails + ' FAILED' : 'all passed'));
	process.exit(fails ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
