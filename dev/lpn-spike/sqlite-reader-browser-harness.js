// THE SQLITE READER IN A REAL BROWSER: nothing at page load, everything from this site
// (ROADMAP Task 749).   node dev/lpn-spike/sqlite-reader-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// The Node half, dev/lpn-spike/sqlite-reader-harness.js, holds what the reader answers. This holds
// the two promises only a browser can break: an ordinary page load fetches neither js/vendor/sql-
// wasm.js nor its 658 KB wasm, and opening a database fetches both from the page's own origin,
// once, never from a CDN. Requests are counted by the browser, with the service worker blocked so
// none can be answered out of sight.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SQLITE_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('sqlite-reader-browser-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('sqlite-reader-browser-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 180 s.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('sqlite-reader-browser-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// A small model-shaped database, written by Python's sqlite3 and handed over as base64.
const PY = `
import sqlite3, base64, sys
db = sqlite3.connect(':memory:')
db.executescript('''
CREATE TABLE Scenario (ScenarioID INTEGER PRIMARY KEY, Label TEXT, ParentID INTEGER);
CREATE TABLE Pipe (ElementID INTEGER PRIMARY KEY, Label TEXT, Diameter REAL);
INSERT INTO Scenario VALUES (1,'Base',NULL),(2,'Fire flow',1);
INSERT INTO Pipe VALUES (200,'P-1',0.3048),(201,'P-2',0.1524),(202,'P-3',0.2032);
''')
sys.stdout.write(base64.b64encode(db.serialize()).decode())
`;

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('sqlite-reader-browser-harness: no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const b64 = execFileSync('python3', ['-I', '-c', PY]).toString();
	const browser = await chromium.launch({ executablePath });
	const SQL = /\/js\/vendor\/sql-wasm\.(js|wasm)/;
	try {
		const s = await Session.open(browser, 'sqlite', { serviceWorkers: 'block' });
		const seen = [];
		s.context.on('request', (r) => { if (/sql-wasm|sql\.js|sqljs/i.test(r.url())) { seen.push(r.url()); } });
		await s.goto('Looped-Network.php');
		await s.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await s.settle(2500);

		console.log('1. An ordinary page load');
		ok('the reader is on the page', await s.page.evaluate(() => typeof EngCalcs.lpnSqliteOpen === 'function'));
		ok('nothing of sql.js was fetched', seen.length === 0, JSON.stringify(seen));
		ok('no page error', s.errors.length === 0, s.errors.join(' | '));

		console.log('2. Opening a database');
		const got = await s.page.evaluate(async (data) => {
			const bin = atob(data), u = new Uint8Array(bin.length);
			for (let i = 0; i < bin.length; i++) { u[i] = bin.charCodeAt(i); }
			const db = await EngCalcs.lpnSqliteOpen(u.buffer);
			const out = {
				tables: db.tables.map((t) => t.name + ':' + t.rowCount + ':' + t.columns.map((c) => c.name).join('|')),
				pipes: db.readRows('Pipe').rows
			};
			db.close();
			const again = await EngCalcs.lpnSqliteOpen(u);
			out.again = again.tables.length;
			again.close();
			try { await EngCalcs.lpnSqliteOpen(new TextEncoder().encode('[JUNCTIONS]\n')); out.junk = 'opened'; }
			catch (e) { out.junk = e.code; out.junkMsg = e.message; }
			return out;
		}, b64);
		ok('tables, row counts and columns', JSON.stringify(got.tables) === JSON.stringify(['Pipe:3:ElementID|Label|Diameter', 'Scenario:2:ScenarioID|Label|ParentID']),
			JSON.stringify(got.tables));
		ok('rows read exactly', JSON.stringify(got.pipes) === JSON.stringify([[200, 'P-1', 0.3048], [201, 'P-2', 0.1524], [202, 'P-3', 0.2032]]));
		ok('a second open works', got.again === 2);
		ok('a file that is not SQLite is refused', got.junk === 'not-sqlite', got.junkMsg);
		const origin = env.origin();
		const sqlReqs = seen.filter((u) => SQL.test(u));
		ok('both files fetched, once each', sqlReqs.length === 2 && sqlReqs.some((u) => /\.js\?/.test(u)) && sqlReqs.some((u) => /\.wasm\?/.test(u)),
			JSON.stringify(sqlReqs));
		ok('every sql.js request went to this site', seen.length > 0 && seen.every((u) => u.indexOf(origin + '/') === 0), JSON.stringify(seen));
		ok('no page error', s.errors.length === 0, s.errors.join(' | '));
		await s.context.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
