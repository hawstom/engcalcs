// FILE > EXPORT > EPANET FILE NAMES THE OPEN SCENARIO, IN A REAL CHROMIUM (Tom, 2026-10-16:
// "Scenario export to EPANET: Do we append the project name with the name of the scenario?").
//   node dev/lpn-spike/inp-export-scenario-name-browser-harness.js   (takes the browser lock itself)
//
//   N1  In Base the file is named after the project alone: Elm-Street.inp.
//   N2  In the scenario "Peak hour: 3x" it is <project>-<scenario>, each made safe the same way:
//       Elm-Street-Peak-hour-3x.inp.
//   N3  Back in Base, the project name alone again.
// Labels are read from the page's own language strings.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_INPNAME_LOCKED';
const NAME = 'inp-export-scenario-name-browser-harness';
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
const byId = (arr, id) => (arr || []).filter((x) => x.id === id)[0];
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	let a = null, page = null;
	try {
		const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
		d.scenarios.push({ id: 's1', name: 'Peak hour: 3x', overrides: {}, demandMultiplier: 3 });
		d.project = Object.assign({}, d.project, { name: 'Elm Street', activeScenario: 'base' });
		a = await Session.open(browser, 'A', { serviceWorkers: 'block' });
		page = a.page;
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
		const exportName = async () => {
			let dl = null;
			const p = page.waitForEvent('download', { timeout: 8000 }).then((x) => { dl = x; }, () => {});
			await page.click('#lpn_menu_file');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			await clickRow('#lpn_menu_list button.lpn-menu-row', (await L('lpn_file_export_menu')).trim());
			await page.waitForSelector('#lpn_menu_list2 button.lpn-menu-row', { state: 'attached' });
			// The formats are in the Network group (Task 819), and a project with more than Base is asked first.
			await clickRow('#lpn_menu_list2 button.lpn-menu-row', (await L('lpn_calib_network')).trim());
			await page.waitForSelector('#lpn_menu_list3 button.lpn-menu-row', { state: 'attached' });
			await clickRow('#lpn_menu_list3 button.lpn-menu-row', (await L('lpn_file_export_item_inp')).trim());
			await a.settle(500);
			if (await a.dialog()) { await a.dialogClick((await L('lpn_export_table_go')).trim()); }
			await p;
			await page.keyboard.press('Escape');
			await a.settle(600);
			return dl ? dl.suggestedFilename() : null;
		};
		const toScenario = async (name) => {
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			const hit = await clickRow('#lpn_menu_list button.lpn-menu-row, #lpn_menu_list2 button.lpn-menu-row', name);
			await a.settle(1200);
			return hit;
		};

		console.log('--- N1. Base ---');
		const n1 = await exportName();
		ok('N1 in Base the file is the project name alone', n1 === 'Elm-Street.inp', n1);

		console.log('--- N2. a scenario ---');
		ok('N2 the scenario Peak hour: 3x is opened', await toScenario('Peak hour: 3x'));
		const n2 = await exportName();
		// The export saves first (saveToStorage()), so the stored project says which scenario was open.
		ok('N2 ...and was the open scenario when exported', await page.evaluate(() => JSON.parse(localStorage.getItem('lpn_project_hover')).project.activeScenario) === 's1');
		ok('N2 the file is <project>-<scenario>, each made safe', n2 === 'Elm-Street-Peak-hour-3x.inp', n2);

		console.log('--- N3. Base again ---');
		await toScenario(await L('lpn_scenario_base'));
		const n3 = await exportName();
		ok('N3 back in Base, the project name alone', n3 === 'Elm-Street.inp', n3);

		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 400));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
