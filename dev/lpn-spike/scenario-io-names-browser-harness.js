// A FILE THAT SHOWS ONE SCENARIO NAMES IT, AND A DEM WRITE SAYS WHERE IT WENT, IN A REAL CHROMIUM
// (Task 814, standard rules 5 and 6).   node dev/lpn-spike/scenario-io-names-browser-harness.js
// Base and "Peak hour".
//   N1  The table right-click export (CSV) is named <project>-<table>-<scenario> in Peak hour,
//       and <project>-<table> in Base.
//   N2  Print table suggests a PDF name carrying the scenario in Peak hour, and none in Base.
//   N3  The map picture (Screenshot, no clipboard) is named <project>-<scenario>-screenshot.png in
//       Peak hour and <project>-screenshot.png in Base.
//   S1  A GeoJSON shapes import says the Shapes appear in every scenario when a second scenario
//       exists, and says nothing of the kind in a project that is Base alone.
//   D1  The Mapbox DEM fill question and its answer afterwards (the page's own plan and done texts)
//       say the elevations are overrides in Peak hour, say they go into Base in Base, and say
//       nothing in a project that is Base alone.
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = process.env.EC_REPO || path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SCNIONAMES_LOCKED';
const NAME = 'scenario-io-names-browser-harness';
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
		d.settings.autoRun = false;
		const a = await Session.open(browser, 'A', { serviceWorkers: 'block', acceptDownloads: true });
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		const load = async (doc) => {
			await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); }, JSON.stringify(doc));
			await a.reload();
			await a.answerTrainingPanel().catch(() => {});
			await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
			await page.setViewportSize({ width: 1600, height: 1000 });
			await a.settle(2500);
		};
		await a.goto('Looped-Network.php?ec_nolog=1');
		await load(d);
		const L = (k) => a.lang(k);
		const clickRow = (sel, text) => page.evaluate(([s, t]) => {
			const r = Array.from(document.querySelectorAll(s)).find((b) => b.textContent.replace(/[▸\s]+$/, '').trim().indexOf(t) >= 0);
			if (r) { r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
			return !!r;
		}, [sel, text]);
		const toScenario = async (name) => {
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			const hit = await clickRow('#lpn_menu_list button.lpn-menu-row, #lpn_menu_list2 button.lpn-menu-row', name);
			await a.settle(1200);
			return hit;
		};
		await page.click('#lpn_pane_btn');
		await a.settle(500);
		await page.click('#lpn_pane_tab_junctions');
		await a.settle(600);
		const ctxRows = async () => {
			await page.click('#lpn_pane_junctions tbody td', { button: 'right' });
			await page.waitForSelector('.lpn-pane-ctxmenu', { state: 'visible' });
		};
		const ctxClick = (t) => page.evaluate((w) => {
			const row = Array.from(document.querySelector('.lpn-pane-ctxmenu').children).find((x) => x.textContent.replace(/\s+/g, ' ').trim().indexOf(w) === 0);
			if (row) { row.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }
			return !!row;
		}, t);
		const csvName = async () => {
			await ctxRows();
			const csv = (await L('lpn_export_table_title')).replace('{format}', 'CSV');
			const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }), ctxClick(csv)]);
			await a.settle(300);
			return dl.suggestedFilename();
		};
		const printTitle = async () => {
			await page.evaluate(() => { window.__printTitle = null; window.print = function () { window.__printTitle = document.title; }; });
			await ctxRows();
			await ctxClick((await L('lpn_pane_print')).trim());
			await a.settle(300);
			return page.evaluate(() => window.__printTitle);
		};

		console.log('--- N1/N2. the Tables pane, in Peak hour and in Base ---');
		ok('Peak hour is opened', await toScenario('Peak hour'));
		const n1 = await csvName();
		ok('N1 Peak hour: the CSV name carries the scenario', /^Elm_Street-Junctions-Peak-hour\.csv$/.test(n1), n1);
		const p1 = await printTitle();
		ok('N2 Peak hour: the PDF name carries the scenario', p1 === 'Elm Street-Junctions-Peak-hour', JSON.stringify(p1));
		await toScenario('Base');
		const n0 = await csvName();
		ok('N1 Base: the CSV name is the project and table alone', n0 === 'Elm_Street-Junctions.csv', n0);
		const p0 = await printTitle();
		ok('N2 Base: the PDF name has no scenario', p0 === 'Elm Street-Junctions', JSON.stringify(p0));

		console.log('--- N3. the map picture ---');
		await page.click('#lpn_pane_btn').catch(() => {});
		await a.settle(400);
		await page.evaluate(() => { delete navigator.clipboard; Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }); });
		const shotName = async () => {
			await a.menuClick(await L('lpn_screenshot_menu'), 'map');
			await page.waitForSelector('.lpn-snip-veil', { state: 'visible' });
			const r = await page.evaluate(() => { const b = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
			await page.mouse.click(r.x, r.y);
			await page.waitForSelector('#lpn_snip_copy', { state: 'visible', timeout: 15000 });
			const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }), page.click('#lpn_snip_copy')]);
			await a.settle(300);
			await page.keyboard.press('Escape');
			await page.evaluate(() => { const x = document.getElementById('lpn_snip_close'); if (x) { x.click(); } });
			return dl.suggestedFilename();
		};
		const s0 = await shotName();
		ok('N3 Base: the picture is named for the project alone', s0 === 'Elm-Street-screenshot.png', s0);
		await toScenario('Peak hour');
		const s1 = await shotName();
		ok('N3 Peak hour: the picture names the scenario', s1 === 'Elm-Street-Peak-hour-screenshot.png', s1);

		console.log('--- S1. shapes appear in every scenario ---');
		const gj = JSON.stringify({ type: 'FeatureCollection', features: [{ type: 'Feature', properties: { name: 'Lot' }, geometry: { type: 'Point', coordinates: [-122.57, 38.1] } }] });
		const notice = () => page.evaluate(() => (document.getElementById('lpn_map_notice') || {}).textContent || '');
		const everyLine = (await L('lpn_shapes_every_scenario')).trim();
		const importShape = async () => { await page.setInputFiles('#lpn_geojson_file', { name: 'lot.geojson', mimeType: 'application/geo+json', buffer: Buffer.from(gj) }); await a.settle(700); return notice(); };
		let sn = await importShape();
		ok('S1 Peak hour exists: the receipt says Shapes appear in every scenario', /Shape imported from lot\.geojson/.test(sn) && sn.indexOf(everyLine) >= 0, sn);

		console.log('--- D1. the DEM fill says where it writes ---');
		const dem = () => page.evaluate(() => ({
			plan: EngCalcs.lpnTerrainPlanText(['J1'], [], 1),
			done: EngCalcs.lpnTerrainDoneText(['J1'], [], 0)
		}));
		const inP = (await L('lpn_dem_scenario')).replace('{scenario}', 'Peak hour').trim();
		const inB = (await L('lpn_dem_base')).trim();
		let t = await dem();
		ok('D1 Peak hour: the question says the elevations are overrides there', t.plan.indexOf(inP) >= 0, t.plan.slice(-300));
		ok('D1 Peak hour: the answer afterwards says so too', t.done.indexOf(inP) >= 0, t.done.slice(-300));
		await toScenario('Base');
		t = await dem();
		ok('D1 Base with other scenarios: the question says they go into Base', t.plan.indexOf(inB) >= 0 && t.done.indexOf(inB) >= 0);
		const d4 = JSON.parse(JSON.stringify(d));
		d4.scenarios = [d4.scenarios[0]];
		d4.project.activeScenario = 'base';
		await load(d4);
		t = await dem();
		sn = await importShape();
		ok('S1 Base alone: the receipt does not say it', /Shape imported from lot\.geojson/.test(sn) && sn.indexOf(everyLine) < 0, sn);
		ok('D1 Base alone: neither text mentions a scenario', t.plan.indexOf(inB) < 0 && t.done.indexOf(inB) < 0 && t.plan.indexOf((await L('lpn_dem_scenario')).split('{scenario}')[0].trim()) < 0);
		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 400));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
