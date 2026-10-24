// THE .wtg.sqlite EXPORT IN A REAL BROWSER (ROADMAP Task 749).   node dev/lpn-spike/wtg-page-export-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// The Node half, wtg-page-export-harness.js, holds what the files contain. This holds what only a
// browser can break, with Net3 opened the way a visitor opens it:
//   1. an ordinary page load fetches nothing of sql.js; the export fetches js/vendor/sql-wasm.js and
//      its wasm from this site, once each, and nothing from anywhere else;
//   2. File > Export > Network offers the row, and the row opens the box BEFORE anything is written,
//      with the list of what the files cannot carry and a button that opens the file picker;
//   3. choosing the saved project's two files downloads ONE .zip, whose database passes SQLite's
//      integrity check (Python's, a different build), holds Net3's 220 elements, and whose .wtg opens
//      with the byte order mark the saved project's had;
//   4. the receipt names the zip and what was left out; the scenario is named when the project has
//      more than Base; nothing is stored on the device by it (Exporting is not saving).
//
// NEEDS the saved project (Tom's, outside the repo): $WTG_TEMPLATE_DIR, default
// ~/webdev/fixtures/wtg-tgh-1 (WTG-tgh-1.wtg + .wtg.sqlite). Absent, it prints NOT RUN and exits 0.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const zlib = require('zlib');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_WTGEXP_LOCKED';

const TEMPLATE_DIR = process.env.WTG_TEMPLATE_DIR || path.join(os.homedir(), 'webdev', 'fixtures', 'wtg-tgh-1');
const TPL_SQLITE = path.join(TEMPLATE_DIR, 'WTG-tgh-1.wtg.sqlite'), TPL_WTG = path.join(TEMPLATE_DIR, 'WTG-tgh-1.wtg');
if (!fs.existsSync(TPL_SQLITE) || !fs.existsSync(TPL_WTG)) {
	console.log('NOT RUN: needs ' + TPL_SQLITE + ' and its .wtg (a project saved from WaterGEMS).');
	process.exit(0);
}

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('wtg-page-export-browser-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('wtg-page-export-browser-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 180 s.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('wtg-page-export-browser-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// The entries of a .zip: central directory, inflated by node's zlib.
function unzip(buf) {
	const out = {};
	let e = buf.length - 22;
	while (e >= 0 && buf.readUInt32LE(e) !== 0x06054b50) { e--; }
	if (e < 0) { return out; }
	for (let i = 0, p = buf.readUInt32LE(e + 16); i < buf.readUInt16LE(e + 10); i++) {
		const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20), nlen = buf.readUInt16LE(p + 28),
			loc = buf.readUInt32LE(p + 42), name = buf.toString('utf8', p + 46, p + 46 + nlen);
		const start = loc + 30 + buf.readUInt16LE(loc + 26) + buf.readUInt16LE(loc + 28), body = buf.subarray(start, start + csize);
		out[name] = method === 8 ? zlib.inflateRawSync(body) : Buffer.from(body);
		p += 46 + nlen + buf.readUInt16LE(p + 30) + buf.readUInt16LE(p + 32);
	}
	return out;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('wtg-page-export-browser-harness: no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const NET3 = fs.readFileSync(path.join(REPO, 'dev', 'lpn-spike', 'reference', 'Net3.inp'));
	const browser = await chromium.launch({ executablePath });
	try {
		const s = await Session.open(browser, 'wtgexp', { serviceWorkers: 'block', viewport: { width: 1400, height: 900 }, acceptDownloads: true });
		const seen = [];
		s.context.on('request', (r) => { if (/sql-wasm|sql\.js|sqljs/i.test(r.url())) { seen.push(r.url()); } });
		await s.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await s.goto('Looped-Network.php');
		await s.answerTrainingPanel().catch(() => {});
		await s.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await s.settle(1500);

		console.log('1. Net3 opened the way a visitor opens it');
		await s.page.setInputFiles('#lpn_inp_file', { name: 'Net3.inp', mimeType: 'text/plain', buffer: NET3 });
		await s.settle(2500);
		// The import report stands in front of the page until it is answered.
		const rep = await s.waitDialog(6000);
		ok('the import report names Net3.inp', !!rep && rep.text.indexOf('Net3.inp') >= 0, rep && rep.text.slice(0, 60));
		await s.dialogClick(await s.lang('lpn_dialog_ok'));
		await s.settle(500);
		ok('an ordinary page load, and an import, fetched nothing of sql.js', seen.length === 0, JSON.stringify(seen));
		const before = await s.page.evaluate(() => JSON.stringify(Object.keys(localStorage).sort().map((k) => [k, (localStorage.getItem(k) || '').length])));

		console.log('2. File > Export > Network > the row, and its box');
		const labels = await s.page.evaluate(() => ({
			file: EngCalcs.pageConfig.lpn_file_export_menu, row: EngCalcs.pageConfig.lpn_file_export_item_wtg, choose: EngCalcs.pageConfig.lpn_wtg_export_choose,
			need: EngCalcs.pageConfig.lpn_wtg_export_need, cancel: EngCalcs.pageConfig.lpn_cancel
		}));
		await s.page.click('#lpn_menu_file');
		await s.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		await s.page.evaluate((l) => { const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).find((b) => b.textContent.trim().indexOf(l) === 0); if (r) { r.click(); } }, labels.file);
		await s.page.waitForSelector('#lpn_menu_list2 button.lpn-menu-row', { state: 'attached' });
		await s.page.evaluate(() => { const r = document.querySelector('#lpn_menu_list2 button.lpn-menu-row[aria-haspopup]'); if (r) { r.click(); } });
		await s.page.waitForSelector('#lpn_menu_list3 button.lpn-menu-row', { state: 'attached' });
		const rowTexts = await s.page.$$eval('#lpn_menu_list3 button.lpn-menu-row', (els) => els.map((e) => e.textContent.trim()));
		ok('the row is in the Network group, named for the file and no program', rowTexts.indexOf(labels.row) >= 0 && !/water(cad|gems)|bentley/i.test(labels.row), JSON.stringify(rowTexts));
		await s.page.evaluate((l) => { const r = Array.from(document.querySelectorAll('#lpn_menu_list3 button.lpn-menu-row')).find((b) => b.textContent.trim().indexOf(l) === 0); if (r) { r.click(); } }, labels.row);
		const box = await s.waitDialog(4000);
		ok('a box opens before any file is made', !!box && seen.length === 0, box && box.text.slice(0, 60));
		ok('it holds the instruction to choose a saved project, and names no program', !!box && box.text.indexOf(labels.need) >= 0 && !/water(cad|gems)|bentley/i.test(box.text));
		const items = await s.page.$$eval('#lpn_dialog_body li', (els) => els.map((e) => e.textContent));
		const wantItems = await s.page.evaluate(() => ['quality', 'texts', 'material', 'positions'].map((c) => EngCalcs.pageConfig['lpn_wtg_export_lost_' + c]));
		ok('it lists what the files cannot carry, as list entries (water quality, map Text, pipe material, map positions)', JSON.stringify(items) === JSON.stringify(wantItems), JSON.stringify(items));
		const dlgW = await s.page.evaluate(() => { const b = document.getElementById('lpn_dialog_body'), r = b.getBoundingClientRect(); return { w: r.width, h: r.height, sw: b.scrollWidth, cw: b.clientWidth }; });
		ok('the box is visible and its text does not overflow sideways', dlgW.w > 200 && dlgW.h > 100 && dlgW.sw <= dlgW.cw + 1, JSON.stringify(dlgW));
		ok('its buttons are Choose the saved project and Cancel', JSON.stringify(box.buttons) === JSON.stringify([labels.choose, labels.cancel]), JSON.stringify(box.buttons));

		console.log('3. Choosing the saved project downloads one .zip');
		const tplS = fs.readFileSync(TPL_SQLITE), tplW = fs.readFileSync(TPL_WTG);
		const [chooser] = await Promise.all([s.page.waitForEvent('filechooser'), s.dialogClick(labels.choose)]);
		ok('the button opens the file picker, for both files at once', chooser.isMultiple());
		const dlP = s.page.waitForEvent('download', { timeout: 120000 });
		await chooser.setFiles([{ name: 'Saved.wtg', mimeType: 'application/xml', buffer: tplW }, { name: 'Saved.wtg.sqlite', mimeType: 'application/octet-stream', buffer: tplS }]);
		const dl = await dlP;
		const name = dl.suggestedFilename();
		ok('one download, a .zip named for the project: ' + name, name === 'Net3.wtg.zip', name);
		const files = unzip(fs.readFileSync(await dl.path()));
		ok('it holds Net3.wtg and Net3.wtg.sqlite', JSON.stringify(Object.keys(files).sort()) === JSON.stringify(['Net3.wtg', 'Net3.wtg.sqlite']), JSON.stringify(Object.keys(files)));
		const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'wtg-page-export-browser-'));
		fs.writeFileSync(path.join(tmp, 'Net3.wtg.sqlite'), files['Net3.wtg.sqlite']);
		const pyOut = JSON.parse(execFileSync('python3', ['-I', '-c', "import sqlite3,sys,json\ndb=sqlite3.connect('file:'+sys.argv[1]+'?mode=ro',uri=True)\n"
			+ "print(json.dumps({'integrity':db.execute('pragma integrity_check').fetchone()[0],'fk':len(db.execute('pragma foreign_key_check').fetchall()),'tables':db.execute(\"select count(*) from sqlite_master where type='table'\").fetchone()[0],'live':db.execute('select count(*) from HMIDomainElement where IsDeleted=0').fetchone()[0],'name':db.execute('select Name from HMIDomainDataSet').fetchone()[0]}))", path.join(tmp, 'Net3.wtg.sqlite')], { encoding: 'utf8' }));
		ok('the database passes SQLite\'s integrity check, with 406 tables, 220 live elements, named Net3', pyOut.integrity === 'ok' && pyOut.fk === 0 && pyOut.tables === 406 && pyOut.live === 220 && pyOut.name === 'Net3', JSON.stringify(pyOut));
		const wtgText = files['Net3.wtg'];
		ok('the .wtg keeps the byte order mark the saved project\'s had, and a new identity',
			wtgText[0] === 0xEF && wtgText[1] === 0xBB && wtgText[2] === 0xBF && tplW[0] === 0xEF && wtgText.toString('utf8') !== tplW.toString('utf8'));

		console.log('4. The receipt, the requests, the device');
		const rc = await s.waitDialog(8000);
		const rcLeft = await s.page.evaluate(() => EngCalcs.pageConfig.lpn_wtg_export_left_out.split('{items}')[0]);
		ok('a receipt names the zip and what was left out', !!rc && rc.text.indexOf('Net3.wtg.zip') >= 0 && rc.text.indexOf(rcLeft) >= 0, rc && rc.text.slice(0, 160));
		const origin = env.origin();
		const sqlReqs = seen.filter((u) => /\/js\/vendor\/sql-wasm\.(js|wasm)/.test(u));
		ok('sql.js and its wasm were fetched once each, now', sqlReqs.length === 2 && sqlReqs.some((u) => /\.js\?/.test(u)) && sqlReqs.some((u) => /\.wasm\?/.test(u)), JSON.stringify(seen));
		ok('every such request went to this site', seen.every((u) => u.indexOf(origin + '/') === 0), JSON.stringify(seen));
		const after = await s.page.evaluate(() => JSON.stringify(Object.keys(localStorage).sort().map((k) => [k, (localStorage.getItem(k) || '').length])));
		const keysOf = (j) => JSON.parse(j).map((x) => x[0]).join();
		ok('the export stored nothing new on the device', keysOf(before) === keysOf(after), keysOf(after));
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
