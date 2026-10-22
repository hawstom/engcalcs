// REPORTS AND PASTES NAME THE SCENARIO THEY BELONG TO, IN A REAL CHROMIUM (Task 814, defects 4 and 5).
//   node dev/lpn-spike/import-export-receipts-browser-harness.js   (takes the browser lock itself)
// Base and "Peak hour"; Recalculate off, so what is on screen is a snapshot of the scenario last calculated.
//   F1  Full report: heading, box note and CSV file name name the scenario of the run (not the open one).
//   F2  Run report and Calibration report name the scenario of the run.
//   F3  A paste into Peak hour says how many overrides it added.
//   F4  A Base-only project carries no scenario line on any report.
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = process.env.EC_REPO || path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_IERECEIPTS_LOCKED';
const NAME = 'import-export-receipts-browser-harness';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	try {
		const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net3-Novato-CA-World.lwn'), 'utf8'));
		d.scenarios.push({ id: 's1', name: 'Peak hour', overrides: {}, demandMultiplier: 3 });
		d.project = Object.assign({}, d.project, { name: 'Elm Street', activeScenario: 'base' });
		d.settings.engine = 'epanet';
		d.settings.autoRun = false;   // Recalculate off: what is on screen is a snapshot
		const a = await Session.open(browser, 'A', { serviceWorkers: 'block', acceptDownloads: true });
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); }, JSON.stringify(d));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await page.setViewportSize({ width: 1600, height: 1000 });
		await a.settle(2500);
		const L = (k) => a.lang(k);
		const dock = require(path.join(REPO, 'dev', 'lpn-spike', 'dock-boxes.js'));
		const clickRow = (sel, text) => page.evaluate(([s, t]) => {
			const r = Array.from(document.querySelectorAll(s)).find((b) => b.textContent.replace(/[▸\s]+$/, '').trim().indexOf(t) >= 0);
			if (r) { r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
			return !!r;
		}, [sel, text]);
		const notice = () => page.evaluate(() => (document.getElementById('lpn_map_notice') || {}).textContent || '');
		const menuRow = async (top, sub, item) => {
			await page.click('#lpn_menu_file');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			await clickRow('#lpn_menu_list button.lpn-menu-row', (await L(top)).trim());
			await page.waitForSelector('#lpn_menu_list2 button.lpn-menu-row', { state: 'attached' });
			// File > Import and File > Export hold their rows in groups (Network, Shapes, Tables; Task 819):
			// the row is in the fly-out itself or, failing that, in the third level a group opens.
			if (await clickRow('#lpn_menu_list2 button.lpn-menu-row', (await L(item)).trim())) { return; }
			const groups = await page.$$eval('#lpn_menu_list2 button.lpn-menu-row', (els) => els.filter((e) => e.querySelector('.lpn-menu-arrow')).map((e) => e.textContent.replace(/[▸\s]+$/, '').trim()));
			for (const g of groups) {
				await clickRow('#lpn_menu_list2 button.lpn-menu-row', g);
				await page.waitForSelector('#lpn_menu_list3 button.lpn-menu-row', { state: 'attached' });
				if (await clickRow('#lpn_menu_list3 button.lpn-menu-row', (await L(item)).trim())) { return; }
			}
		};
		const doExport = async (item) => {
			let dl = null;
			const p = page.waitForEvent('download', { timeout: 8000 }).then((x) => { dl = x; }, () => {});
			await menuRow('lpn_file_export_menu', null, item);
			// Task 819: a project that holds more than Base is asked BEFORE the file is written.
			await a.settle(400);
			const asked = await a.dialog();
			if (asked && asked.buttons.indexOf((await L('lpn_export_table_go')).trim()) >= 0) { await a.dialogClick((await L('lpn_export_table_go')).trim()); }
			await p;
			await a.settle(500);
			const n = await notice();
			let text = null;
			if (dl) { text = fs.readFileSync(await dl.path(), 'utf8'); }
			// The .inp's own flattening report may follow the file; it is dismissed. A second "holds one
			// scenario" question after the download would be a defect (the question is asked first now).
			const dlg = await a.dialog();
			if (dlg) { await a.dialogClick((await L('lpn_dialog_ok')).trim()); }
			return { name: dl ? dl.suggestedFilename() : null, notice: n, text, dialog: dlg ? dlg.text : null, asked: asked ? asked.text : null };
		};
		const toScenario = async (name) => {
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			const hit = await clickRow('#lpn_menu_list button.lpn-menu-row, #lpn_menu_list2 button.lpn-menu-row', name);
			await a.settle(1200);
			return hit;
		};
		const base = (await L('lpn_scenario_base')).trim();

		const calculate = async () => {
			await page.evaluate(() => { const g = document.getElementById('lpn_toolbar_run'); const b = g && g.querySelector('button'); if (b) { b.click(); } });
			await a.settle(5000);
		};
		const text = (sel) => page.evaluate((s) => { const e = document.querySelector(s); return e && e.offsetParent !== null ? e.innerText : ''; }, sel);
		const closeBox = async (id) => { await page.evaluate((i) => { const x = document.querySelector('#' + i + ' .lpn-popover-x'); if (x) { x.click(); } }, id); await a.settle(200); };
		const csvName = async () => {
			const p = page.waitForEvent('download', { timeout: 8000 }).catch(() => null);
			await page.click('#lpn_full_csv');
			const dl = await p;
			return dl ? dl.suggestedFilename() : null;
		};
		const line = async (k, scn) => (await L(k)).replace('{scenario}', scn).trim();

		console.log('--- F1/F2. run in Peak hour, then look at the reports from Base (Recalculate off) ---');
		ok('Peak hour is opened', await toScenario('Peak hour'));
		await calculate();
		await toScenario('Base');
		await dock.openBox(a, 'lpn_full_box');
		const fullTitle = (await L('lpn_full_title')).trim();
		const note = await text('#lpn_full_scenario_note');
		ok('F1 the Full report box names the scenario of the run', note.indexOf(await line('lpn_run_of_scenario', 'Peak hour')) >= 0, JSON.stringify(note));
		ok('F1 the CSV name carries the scenario of the run', (await csvName()) === 'Elm Street-Peak hour-Full report.csv', await csvName());
		await closeBox('lpn_full_box');
		await dock.openBox(a, 'lpn_rptbox');
		const rs = await text('#lpn_rptbox_scn');
		ok('F2 the Run report names the scenario of the run', rs.indexOf(await line('lpn_run_of_scenario', 'Peak hour')) >= 0, JSON.stringify(rs));
		await closeBox('lpn_rptbox');
		await dock.openBox(a, 'lpn_calib_box');
		const cal = '0\n';
		const calText = 'N1 0 10\n';
		await page.setInputFiles('#lpn_calib_file', { name: 'c.dat', mimeType: 'text/plain', buffer: Buffer.from(calText) });
		await a.settle(600);
		const cs = await text('#lpn_calib_scenario_note');
		ok('F2 the Calibration report names the scenario of the run', cs.indexOf(await line('lpn_calib_scenario', 'Peak hour')) >= 0, JSON.stringify(cs));
		await closeBox('lpn_calib_box');
		console.log('--- F1b. a run in Base: the CSV name is the project alone plus the report name ---');
		await calculate();
		await dock.openBox(a, 'lpn_full_box');
		ok('F1 Base run: no scenario in the CSV name', (await csvName()) === 'Elm Street-Full report.csv', await csvName());
		await closeBox('lpn_full_box');

		console.log('--- F3. paste into Peak hour counts the overrides ---');
		await toScenario('Peak hour');
		await page.click('#lpn_pane_btn');
		await a.settle(500);
		await page.click('#lpn_pane_tab_junctions');
		await a.settle(600);
		const paste = (tx) => page.evaluate((t) => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_junctions table tbody tr:nth-child(2) td')).find((x) => x._lpnPaneKey === 'demand');
			if (!td) { return false; }
			td.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, detail: 1 }));
			td.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, detail: 1 }));
			const dt = new DataTransfer(); dt.setData('text/plain', t);
			td.closest('table').dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
			return true;
		}, tx);
		ok('F3 a demand cell is there to paste into', await paste('7.5'));
		await a.settle(400);
		const np = await notice();
		ok('F3 the notice counts the overrides added (1)', /Overrides added \(1\)\./.test(np), np);

		console.log('--- F4. Base alone: no scenario line ---');
		const d4 = JSON.parse(JSON.stringify(d));
		d4.scenarios = [d4.scenarios[0]];
		d4.project.activeScenario = 'base';
		await page.evaluate((txt) => { localStorage.setItem('lpn_project_hover', txt); }, JSON.stringify(d4));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await a.settle(2500);
		await calculate();
		await dock.openBox(a, 'lpn_full_box');
		ok('F4 no scenario note in the Full report', (await text('#lpn_full_scenario_note')) === '');
		ok('F4 CSV name has no scenario', (await csvName()) === 'Elm Street-Full report.csv', await csvName());
		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 400));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
