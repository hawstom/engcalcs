// EXPORTS AND IMPORTS NAME THE SCENARIO THEY TOUCH, IN A REAL CHROMIUM (Task 814, defects 1-4).
//   node dev/lpn-spike/scenario-receipt-browser-harness.js   (takes the browser lock itself)
// A two-scenario project (Base and "Peak hour"), every command reached through its real menu row.
//   R1  EPANET, GeoJSON and DXF exports in Peak hour: file names carry the scenario, and the
//       notice says "It holds the scenario Peak hour only." In Base the notice says the Base
//       scenario only; in a project of Base alone nothing is added (checked in R5).
//   R2  GeoJSON with Recalculate off: results solved in Base are NOT attached to Peak hour's
//       values, and the notice names Base as the scenario they belong to. In Base they are.
//   R3  Surveyed points imported in Peak hour: the report opens on the scenario sentence.
//   R4  A paste into the Tables pane in Peak hour: the notice says the values are overrides.
//   R5  In Base, a paste or an import carries no scenario sentence.
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = process.env.EC_REPO || path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SCNRECEIPT_LOCKED';
const NAME = 'scenario-receipt-browser-harness';
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
		d.settings.engine = 'native';
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

		console.log('--- solve in Base with Recalculate off (the Calculate button) ---');
		const calc = await page.evaluate(() => {
			const g = document.getElementById('lpn_toolbar_run');
			const b = g && g.querySelector('button');
			if (b) { b.click(); }
			return g ? Array.from(g.querySelectorAll('button')).map((x) => x.id + ':' + (x.title || x.textContent)).join('|') : 'no group';
		});
		await a.settle(2500);
		console.log('   run group: ' + calc);

		console.log('--- R2 (Base). results are attached in Base ---');
		const gb = await doExport('lpn_file_export_item_geojson');
		const jb = gb.text ? JSON.parse(gb.text) : null;
		ok('R2 Base GeoJSON has results', jb && /"has_results":\s*true/.test(gb.text), gb.notice);
		ok('R2 Base file name is the project alone', gb.name === 'Elm-Street.geojson', gb.name);
		ok('R1 Base notice names the Base scenario', gb.notice.indexOf((await L('lpn_export_holds_base')).trim()) >= 0, gb.notice);

		console.log('--- R1/R2 (Peak hour) ---');
		ok('Peak hour is opened', await toScenario('Peak hour'));
		const gp = await doExport('lpn_file_export_item_geojson');
		ok('R1 GeoJSON file name carries the scenario', gp.name === 'Elm-Street-Peak-hour.geojson', gp.name);
		ok('R1 GeoJSON notice names the scenario', /It holds the scenario Peak hour only\./.test(gp.notice), gp.notice);
		ok('R2 stale results are not attached to Peak hour', gp.text && !/"has_results":\s*true/.test(gp.text) && !/"head":/.test(gp.text.replace(/"has_results"/g, '')), gp.text && String(/"has_results":\s*true/.test(gp.text)));
		ok('R2 the notice names Base as the results\' scenario', gp.notice.indexOf((await L('lpn_geojson_results_other')).replace('{scenario}', base).trim()) >= 0, gp.notice);
		ok('R1 the GeoJSON export from Peak hour is asked first, naming the scenario', gp.asked && gp.asked.indexOf('It holds the scenario Peak hour only') >= 0, gp.asked);
		ok('R1 Base export is asked first while Peak hour exists', gb.asked && gb.asked.indexOf((await L('lpn_export_holds_base')).trim()) >= 0, gb.asked);
		const ip = await doExport('lpn_file_export_item_inp');
		ok('R1 EPANET file name carries the scenario', ip.name === 'Elm-Street-Peak-hour.inp', ip.name);
		ok('R1 the EPANET export is asked first', ip.asked && ip.asked.indexOf('It holds the scenario Peak hour only') >= 0, ip.asked);
		ok('R1 EPANET notice names the scenario', /It holds the scenario Peak hour only\./.test(ip.notice), ip.notice);
		const dp = await doExport('lpn_file_export_item_dxf');
		ok('R1 DXF file name carries the scenario', dp.name === 'Elm-Street-Peak-hour.dxf', dp.name);
		ok('R1 the DXF export is asked first', dp.asked && dp.asked.indexOf('It holds the scenario Peak hour only') >= 0, dp.asked);
		ok('R1 DXF notice names the scenario', /It holds the scenario Peak hour only\./.test(dp.notice), dp.notice);

		console.log('--- R3. survey points in Peak hour ---');
		const csv = '1,38.10,-122.57,50,P1\n2,38.11,-122.58,51,P2\n';
		const chooser = page.waitForEvent('filechooser', { timeout: 8000 });
		await menuRow('lpn_file_import_menu', null, 'lpn_file_import_survey');
		const fc = await chooser;
		await fc.setFiles({ name: 'pts.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
		await page.waitForSelector('#lpn_dialog_buttons button', { state: 'visible', timeout: 8000 });
		await a.settle(300);
		const createLabel = (await L('lpn_survey_create')).trim();
		await page.click('#lpn_dialog_buttons button:text-is("' + createLabel + '")');
		await a.settle(600);
		// With more than Base in the project the points are asked where they go (Task 814): the open scenario.
		await a.dialogClick((await L('lpn_inpup_btn_scenario')).replace('{scenario}', 'Peak hour').trim());
		await a.settle(600);
		const rep = await page.evaluate(() => { const b = document.querySelector('#lpn_dialog_body, .lpn-dialog-body, #lpn_dialog'); return b ? b.innerText : ''; });
		ok('R3 the survey report opens with the scenario sentence', /The nodes were added to Peak hour\. In Base they are inactive\./.test(rep), rep.slice(0, 200));
		await a.dialogClick((await L('lpn_dialog_ok')).trim());
		await a.settle(800);
		// A consent question about looking up elevations may follow; it is declined, not answered yes.
		let still = await a.dialog();
		if (still) { console.log('   a further question: ' + still.text.slice(0, 60) + ' | ' + still.buttons.join(' / ')); await page.keyboard.press('Escape'); await a.settle(500); still = await a.dialog(); }
		ok('R3 the report closes with OK', !still);
		console.log('--- R4. paste into the Tables pane in Peak hour ---');
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
		ok('R4 a demand cell is there to paste into', await paste('7.5'));
		await a.settle(400);
		const np = await notice();
		ok('R4 the notice names the scenario and says overrides', /Pasted cells \(1\)\./.test(np) && /overrides in the scenario Peak hour\./.test(np), np);

		console.log('--- R5. Base carries no scenario sentence on a paste ---');
		await toScenario(base);
		await page.click('#lpn_pane_tab_junctions').catch(() => {});
		await a.settle(500);
		await paste('8.5');
		await a.settle(400);
		const nb = await notice();
		ok('R5 in Base the paste notice has no scenario sentence', /Pasted cells/.test(nb) && nb.indexOf((await L('lpn_pane_pasted_scenario')).split('{scenario}')[0].trim()) < 0, nb);

		console.log('--- R6. Base only, with and without stored alternatives ---');
		const reopen = async (proj) => {
			await page.evaluate((txt) => { localStorage.setItem('lpn_project_hover', txt); }, JSON.stringify(proj));
			await a.reload();
			await a.answerTrainingPanel().catch(() => {});
			await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
			await a.settle(2500);
		};
		const d6 = JSON.parse(JSON.stringify(d));
		d6.scenarios = [d6.scenarios[0]];
		d6.project.activeScenario = 'base';
		await reopen(d6);
		const e0 = await doExport('lpn_file_export_item_inp');
		// Task 814: a receipt dialog now ends every export, but with Base alone it claims nothing is left behind.
		ok('R6 Base alone, no alternatives: no question, a receipt, no sentence about what is left', !(e0.asked && e0.asked.indexOf((await L('lpn_export_confirm_lead')).split('{format}')[1].split('{n}')[0]) >= 0) && !!e0.dialog && /Elm-Street\.inp/.test(e0.dialog) && !/It holds/.test(e0.dialog) && !/It holds/.test(e0.notice), e0.dialog + ' | ' + e0.notice);
		d6.alternatives = [{ id: 'a1', category: 'physical', name: 'A', parent: null }, { id: 'a2', category: 'physical', name: 'B', parent: 'a1', values: {} }];
		await reopen(d6);
		const e1 = await doExport('lpn_file_export_item_geojson');
		const leaves = (await L('lpn_export_leaves_alternatives')).trim();
		ok('R6 Base alone with stored alternatives: asked first, naming what is left behind', e1.asked && e1.asked.indexOf(leaves) >= 0 && e1.notice.indexOf(leaves) >= 0, e1.asked);
		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 400));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
