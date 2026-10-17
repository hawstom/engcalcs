// THE SCENARIO WORKBOOK IN A REAL BROWSER, BY ITS MENU ROWS (Task 752; dev/scenario-workbook.md).
//
//   node dev/lpn-spike/scenario-workbook-browser-harness.js        (takes the browser lock itself)
//
// The model is held headless by scenario-workbook-harness.js; this clicks the real rows:
//   1. File > Export > Scenario workbook downloads one .xlsx whose Scenarios sheet names Base.
//   2. The same file through File > Import > Import scenario workbook says there are no differences,
//      with OK only, and changes nothing.
//   3. That workbook with a scenario, two alternatives and two values added: the report lists each,
//      Cancel changes nothing, and Apply changes makes the scenario, which then holds the two values
//      (read back through a second export).
//   4. Undo (Ctrl+Z) takes the whole import back.
//   5. The Spanish page offers both rows under its own Export and Import menus, and an unchanged
//      round trip there is no difference too.
// Every button is pressed with a real click: openDialog() ignores a click with detail 0 that no key
// armed, which is what a bare el.click() delivers.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SCNBOOK_BROWSER_LOCKED';
const NAME = 'scenario-workbook-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure of what this measures; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

// The workbook is read and written here by the page's own pure libraries.
global.EngCalcs = global.EngCalcs || {};
Object.assign(global.EngCalcs, require(path.join(REPO, 'js', 'lpn-tablefile.js')));
require(path.join(REPO, 'js', 'lpn-gisread.js'));
const E = global.EngCalcs;

let checks = 0, failures = 0, Session;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'lpn-scnbook-'));
const SUB = '#lpn_menu_list2 button.lpn-menu-row';
const norm = (t) => String(t || '').replace(/[▸\s]+$/, '').trim();

async function open(browser, rel) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto(rel);
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1000);
	await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
	await a.settle(1500);
	return a;
}
// A row of a File fly-out, pressed as a mouse presses it.
async function subRows(a, parentKey) {
	const parent = norm(await a.lang(parentKey));
	await a.page.click('#lpn_menu_file');
	await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
	await a.page.evaluate((l) => {
		const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).find((b) => b.textContent.replace(/[▸\s]+$/, '').trim() === l);
		r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
	}, parent);
	await a.page.waitForSelector(SUB, { state: 'attached' });
	return a.page.$$eval(SUB, (els) => els.map((b) => b.textContent.replace(/[▸\s]+$/, '').trim()));
}
async function pressSub(a, parentKey, rowKey) {
	const rows = await subRows(a, parentKey), want = norm(await a.lang(rowKey));
	if (rows.indexOf(want) < 0) { throw new Error('no row ' + want + ' in ' + rows.join(' | ')); }
	await a.page.evaluate((l) => {
		const r = Array.from(document.querySelectorAll('#lpn_menu_list2 button.lpn-menu-row')).find((b) => b.textContent.replace(/[▸\s]+$/, '').trim() === l);
		r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
	}, want);
}
async function exportBook(a, tag) {
	const [dl] = await Promise.all([
		a.page.waitForEvent('download', { timeout: 8000 }),
		pressSub(a, 'lpn_file_export_menu', 'lpn_file_export_item_scnbook')
	]);
	const file = path.join(TMP, tag + '.xlsx');
	await dl.saveAs(file);
	const bytes = new Uint8Array(fs.readFileSync(file));
	return { name: dl.suggestedFilename(), file: file, book: E.lpnTableXlsxRead(await E.lpnUnzip(bytes)) };
}
async function importBook(a, file) {
	const [chooser] = await Promise.all([
		a.page.waitForEvent('filechooser', { timeout: 8000 }),
		pressSub(a, 'lpn_file_import_menu', 'lpn_file_import_scnbook')
	]);
	await chooser.setFiles(file);
	await a.page.waitForSelector('#lpn_dialog', { state: 'visible', timeout: 8000 });
	await a.settle(300);
	return a.page.evaluate(() => ({
		title: (document.getElementById('lpn_dialog_title') || {}).textContent || '',
		summary: ((document.querySelector('#lpn_dialog_body [data-scnbook="summary"]') || {}).textContent) || '',
		changes: Array.from(document.querySelectorAll('#lpn_dialog_body table.lpn-scnbook-changes tbody tr')).map((tr) => Array.from(tr.cells).map((c) => c.textContent)),
		unusable: Array.from(document.querySelectorAll('#lpn_dialog_body table.lpn-scnbook-unusable tbody tr')).map((tr) => Array.from(tr.cells).map((c) => c.textContent)),
		kept: Array.from(document.querySelectorAll('#lpn_dialog_body ul.lpn-scnbook-kept li')).map((li) => li.textContent),
		buttons: Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).map((b) => b.textContent)
	}));
}
// A real click on a dialog button: a MouseEvent with detail 1, as a mouse makes.
async function pressButton(a, label) {
	const done = await a.page.evaluate((l) => {
		const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent === l);
		if (!b) { return false; }
		b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
		return true;
	}, label);
	await a.settle(600);
	return done;
}
const dialogShown = (a) => a.page.evaluate(() => { const d = document.getElementById('lpn_dialog'); return !!d && d.style.display === 'block'; });
const sheetOf = (book, kind) => book.filter((s) => String((s.rows[1] || [])[0] || '').indexOf(kind + ':') === 0)[0];
const scenarioNames = (book) => sheetOf(book, 'scenarios').rows.slice(2).map((r) => r[1]);
// The sheets back as the writer takes them, so an edited copy is a real .xlsx again.
function writeBook(book, file) {
	const sheets = book.map((s) => ({ name: s.name, heads: s.rows[0] || [], keys: s.rows[1] || [], rows: s.rows.slice(2) }));
	sheets.forEach((s) => { const w = Math.max(s.heads.length, s.keys.length); while (s.heads.length < w) { s.heads.push(''); } });
	fs.writeFileSync(file, Buffer.from(E.lpnTableXlsxBook(sheets)));
	return file;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		console.log('\n--- 1. File > Export > Scenario workbook ---');
		const a = await open(browser, 'Looped-Network.php');
		const ex = await subRows(a, 'lpn_file_export_menu');
		await a.page.keyboard.press('Escape');
		ok('1.1 the Export fly-out has the row, after CSV file', ex.indexOf(norm(await a.lang('lpn_file_export_item_scnbook'))) === ex.indexOf(norm(await a.lang('lpn_file_export_item_csv'))) + 1, ex.join(' | '));
		const im = await subRows(a, 'lpn_file_import_menu');
		await a.page.keyboard.press('Escape');
		ok('1.2 the Import fly-out has its twin', im.indexOf(norm(await a.lang('lpn_file_import_scnbook'))) >= 0, im.join(' | '));
		const out0 = await exportBook(a, 'out0');
		ok('1.3 one .xlsx, named for the project', /-scenarios\.xlsx$/.test(out0.name), out0.name);
		ok('1.4 its Scenarios sheet names Base, and only Base', JSON.stringify(scenarioNames(out0.book)) === JSON.stringify([await a.lang('lpn_scenario_base')]), JSON.stringify(scenarioNames(out0.book)));
		ok('1.5 it has the twelve sheets', out0.book.length === 12, out0.book.map((s) => s.name).join(', '));

		console.log('\n--- 2. the same file back: no differences ---');
		let rep = await importBook(a, out0.file);
		ok('2.1 the report says there are no differences', rep.summary.indexOf(out0.name) >= 0 && rep.changes.length === 0 && rep.unusable.length === 0 && rep.kept.length === 0, JSON.stringify(rep));
		ok('2.2 ...with OK only', JSON.stringify(rep.buttons) === JSON.stringify([await a.lang('lpn_dialog_ok')]), JSON.stringify(rep.buttons));
		await pressButton(a, await a.lang('lpn_dialog_ok'));
		ok('2.3 OK closes it', !(await dialogShown(a)));

		console.log('\n--- 3. a scenario, two alternatives and two values added ---');
		const book = JSON.parse(JSON.stringify(out0.book));
		const scn = sheetOf(book, 'scenarios'), keys = scn.rows[1].map((k, i) => (i === 0 ? 'id' : String(k)));
		const row = keys.map(() => '');
		row[1] = 'Peak'; row[2] = 'Base'; row[keys.indexOf('physical')] = 'Peak pipes'; row[keys.indexOf('demand')] = 'Peak demand';
		scn.rows.push(row);
		sheetOf(book, 'alternatives').rows.push(['physical', '', 'Peak pipes', ''], ['demand', '', 'Peak demand', '']);
		const ph = sheetOf(book, 'physical'), dcol = ph.rows[1].findIndex((k) => String(k).split('|')[0] === 'diameter');
		const prow = ph.rows[1].map(() => ''); prow[0] = 'Peak pipes'; prow[1] = 'Pipe'; prow[2] = '12'; prow[dcol] = '16';
		ph.rows.push(prow);
		const dm = sheetOf(book, 'demand'), ccol = dm.rows[1].findIndex((k) => String(k).split('|')[0] === 'demand');
		const drow = dm.rows[1].map(() => ''); drow[0] = 'Peak demand'; drow[1] = 'Junction'; drow[2] = '22'; drow[ccol] = '520';
		dm.rows.push(drow);
		const f3 = writeBook(book, path.join(TMP, 'peak.xlsx'));
		rep = await importBook(a, f3);
		ok('3.1 the report lists the five: the scenario, two alternatives, two picks and two values (seven rows)', rep.changes.length === 7 && rep.unusable.length === 0 && rep.kept.length === 0,
			JSON.stringify(rep.changes) + JSON.stringify(rep.unusable));
		ok('3.2 ...with Apply changes and Cancel', JSON.stringify(rep.buttons) === JSON.stringify([await a.lang('lpn_scnbook_apply'), await a.lang('lpn_cancel')]), JSON.stringify(rep.buttons));
		await pressButton(a, await a.lang('lpn_cancel'));
		let back = await exportBook(a, 'afterCancel');
		ok('3.3 Cancel changes nothing', JSON.stringify(scenarioNames(back.book)) === JSON.stringify(scenarioNames(out0.book)));
		rep = await importBook(a, f3);
		ok('3.4 Apply changes is pressed', await pressButton(a, await a.lang('lpn_scnbook_apply')));
		ok('3.5 ...and the dialog closes', !(await dialogShown(a)));
		back = await exportBook(a, 'afterApply');
		ok('3.6 Peak is a scenario now', scenarioNames(back.book).indexOf('Peak') >= 0, JSON.stringify(scenarioNames(back.book)));
		const ph2 = sheetOf(back.book, 'physical'), dm2 = sheetOf(back.book, 'demand');
		ok('3.7 ...whose Peak pipes holds Pipe 12 at 16', ph2.rows.some((r) => r[0] === 'Peak pipes' && r[2] === '12' && r[dcol] === '16'), JSON.stringify(ph2.rows.slice(2)));
		ok('3.8 ...and whose Peak demand holds Junction 22 at 520', dm2.rows.some((r) => r[0] === 'Peak demand' && r[2] === '22' && r[ccol] === '520'), JSON.stringify(dm2.rows.slice(2)));
		const scnRow = sheetOf(back.book, 'scenarios').rows.filter((r) => r[1] === 'Peak')[0];
		ok('3.9 ...and Peak names both', !!scnRow && scnRow[keys.indexOf('physical')] === 'Peak pipes' && scnRow[keys.indexOf('demand')] === 'Peak demand', JSON.stringify(scnRow));
		rep = await importBook(a, back.file);
		ok('3.10 the new export read back is no difference', rep.changes.length === 0 && rep.kept.length === 0 && rep.unusable.length === 0, JSON.stringify(rep));
		await pressButton(a, await a.lang('lpn_dialog_ok'));

		console.log('\n--- 4. Undo ---');
		await a.page.click('#lpn_canvas', { position: { x: 5, y: 5 } }).catch(() => {});
		await a.page.keyboard.press('Escape');
		await a.page.keyboard.press('Control+z');
		await a.settle(600);
		back = await exportBook(a, 'afterUndo');
		ok('4.1 one Ctrl+Z takes the whole import back', JSON.stringify(scenarioNames(back.book)) === JSON.stringify(scenarioNames(out0.book)), JSON.stringify(scenarioNames(back.book)));
		ok('4.2 no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 3).join(' | '));
		await a.close();

		console.log('\n--- 5. the Spanish page ---');
		const es = await open(browser, 'Looped-Network.php?lang=es');
		ok('5.0 the page is Spanish', await es.page.evaluate(() => document.documentElement.lang) === 'es');
		const exEs = await subRows(es, 'lpn_file_export_menu');
		await es.page.keyboard.press('Escape');
		const imEs = await subRows(es, 'lpn_file_import_menu');
		await es.page.keyboard.press('Escape');
		ok('5.1 its Export menu has the row', exEs.indexOf(norm(await es.lang('lpn_file_export_item_scnbook'))) >= 0, exEs.join(' | '));
		ok('5.2 its Import menu has the row', imEs.indexOf(norm(await es.lang('lpn_file_import_scnbook'))) >= 0, imEs.join(' | '));
		const outEs = await exportBook(es, 'es');
		ok('5.3 the Spanish workbook has Spanish headings over the same keys', sheetOf(outEs.book, 'scenarios').rows[1].join() === sheetOf(out0.book, 'scenarios').rows[1].join());
		rep = await importBook(es, outEs.file);
		ok('5.4 ...and read back is no difference', rep.changes.length === 0 && rep.unusable.length === 0 && rep.kept.length === 0, JSON.stringify(rep));
		await pressButton(es, await es.lang('lpn_dialog_ok'));
		rep = await importBook(es, f3);
		ok('5.5 the English workbook with Peak reads on the Spanish page too: the same seven changes', rep.changes.length === 7 && rep.unusable.length === 0, JSON.stringify(rep.unusable));
		await pressButton(es, await es.lang('lpn_cancel'));
		ok('5.6 no uncaught page errors', es.errors.length === 0, es.errors.slice(0, 3).join(' | '));
		await es.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
