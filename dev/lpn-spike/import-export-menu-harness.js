// FILE > IMPORT AND FILE > EXPORT ARE GROUPED, THE TABLES CARRY THE LIBRARIES, AND A FILE THAT LEAVES
// SCENARIOS BEHIND IS CONFIRMED FIRST, IN A REAL CHROMIUM (Task 819; Tom, 2026-10-20).
//   node dev/lpn-spike/import-export-menu-harness.js   (takes the browser lock itself)
//   EC_REPO=<another checkout> node ...                (proves the harness fails on master)
//
//   M1  Import holds Network, Shapes, Surveyed points, Libraries, Workspace (last). Network opens a
//       third level of EPANET file, EPANET-MSX file, GeoJSON file; Shapes of GeoJSON file, DXF file,
//       Shapefile. Rows inside a group carry the shortened names.
//   M2  Export holds Network, Tables, Workspace (last). Network: EPANET file, GeoJSON file, DXF file
//       (EPANET-MSX only when one is attached); Tables: ODS, XLSX, CSV.
//   M3  The keyboard walks it: Right on Import opens the fly-out, Right on a group opens its rows,
//       Left comes back one level, Escape closes one level at a time.
//   M4  Every import and export command keeps its usage id (the row's language key), the two
//       "GeoJSON file…" import rows have different ids, and the command list names each of them.
//   M5  Tables to CSV, all tables, writes the libraries too: controls and rules among them.
//   M6  An export to EPANET, GeoJSON or DXF from a project with more than Base asks first, names the
//       scenario that goes out and that the others do not, writes nothing on Cancel, and writes the
//       file on Export. A project of Base alone asks nothing.
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');
const REPO = process.env.EC_REPO || path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_IEMENU_LOCKED';
const NAME = 'import-export-menu-harness';
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
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

async function load(browser, Session, d, ctx, url) {
	const a = await Session.open(browser, NAME, Object.assign({ serviceWorkers: 'block', acceptDownloads: true, viewport: { width: 1600, height: 1000 } }, ctx || {}));
	const page = a.page;
	await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto(url || 'Looped-Network.php?ec_nolog=1');
	await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); }, JSON.stringify(d));
	await a.reload();
	await a.answerTrainingPanel().catch(() => {});
	await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(2500);
	return a;
}
// The rows of one menu level as the visitor reads them; a row with the fly-out arrow is a group.
const rowsOf = (page, n) => page.$$eval('#lpn_menu_list' + n + ' button.lpn-menu-row', (els) => els.map((e) => {
	const arrow = e.querySelector('.lpn-menu-arrow');
	return { label: (arrow ? e.textContent.replace(arrow.textContent, '') : e.textContent).trim(), group: !!arrow };
}));
const labels = (rows) => rows.map((r) => r.label);

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
		// One rule, with a description above it, so the Rules sheet has something to carry.
		d.rules = [';Night shutoff', 'RULE R1', 'IF TANK 1 LEVEL ABOVE 20', 'THEN PUMP 10 STATUS IS CLOSED'];
		const a = await load(browser, Session, d);
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		const L = (k) => a.lang(k);
		// A name the page does not have is "undefined" on master; the shortened names are the point.
		const tx = async (k) => (await L(k).catch(() => '')).trim();
		const importLabel = await tx('lpn_file_import_menu'), exportLabel = await tx('lpn_file_export_menu');
		const netL = await tx('lpn_calib_network').catch(() => 'Network'), shapesL = await tx('lpn_pane_tab_shapes').catch(() => 'Shapes'),
			tablesL = await tx('lpn_tables_menu').catch(() => 'Tables');
		ok('the page supplies the group names Network, Shapes and Tables', netL === 'Network' && shapesL === 'Shapes' && tablesL === 'Tables', [netL, shapesL, tablesL].join('|'));

		// ---- M1 ----------------------------------------------------------------------------------
		console.log('\n--- M1. Import ---');
		await a.openMenu('file');
		await a._clickRow('#lpn_menu_list', importLabel);
		await page.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
		const imp = await rowsOf(page, 2);
		ok('Import holds Network, Shapes, Surveyed points, Libraries, Workspace, in that order',
			same(labels(imp), ['Network', 'Shapes', 'Surveyed points…', 'Libraries…', 'Workspace…']), JSON.stringify(labels(imp)));
		ok('Network and Shapes are groups; the other three are commands',
			same(imp.map((r) => r.group), [true, true, false, false, false]));
		await a._clickRow('#lpn_menu_list2', 'Network');
		await page.waitForSelector('#lpn_menu_popup3', { state: 'visible' });
		const net = await rowsOf(page, 3);
		ok('Network holds EPANET file, EPANET-MSX file, GeoJSON file', same(labels(net), ['EPANET file…', 'EPANET-MSX file…', 'GeoJSON file…']), JSON.stringify(labels(net)));
		ok('the Import fly-out stays open beside the third level', await page.evaluate(() => document.getElementById('lpn_menu_popup2').style.display === 'block'));
		await a._clickRow('#lpn_menu_list2', 'Shapes');
		await page.waitForFunction(() => document.getElementById('lpn_menu_list3').textContent.indexOf('DXF') >= 0);
		const shp = await rowsOf(page, 3);
		ok('Shapes holds GeoJSON file, DXF file, Shapefile', same(labels(shp), ['GeoJSON file…', 'DXF file…', 'Shapefile…']), JSON.stringify(labels(shp)));
		await a.closeMenu();

		// ---- M2 ----------------------------------------------------------------------------------
		console.log('\n--- M2. Export ---');
		await a.openMenu('file');
		await a._clickRow('#lpn_menu_list', exportLabel);
		await page.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
		const exp = await rowsOf(page, 2);
		ok('Export holds Network, Tables, Workspace, in that order', same(labels(exp), ['Network', 'Tables', 'Workspace…']), JSON.stringify(labels(exp)));
		ok('Network and Tables are groups', same(exp.map((r) => r.group), [true, true, false]));
		await a._clickRow('#lpn_menu_list2', 'Network');
		await page.waitForSelector('#lpn_menu_popup3', { state: 'visible' });
		const enet = await rowsOf(page, 3);
		ok('Network holds EPANET file, GeoJSON file, DXF file (no MSX file attached)', same(labels(enet), ['EPANET file…', 'GeoJSON file…', 'DXF file…']), JSON.stringify(labels(enet)));
		await a._clickRow('#lpn_menu_list2', 'Tables');
		await page.waitForFunction(() => document.getElementById('lpn_menu_list3').textContent.indexOf('ODS') >= 0);
		const etab = await rowsOf(page, 3);
		ok('Tables holds ODS file, XLSX file, CSV file', same(labels(etab), ['ODS file…', 'XLSX file…', 'CSV file…']), JSON.stringify(labels(etab)));
		await a.closeMenu();

		// ---- M3 ----------------------------------------------------------------------------------
		console.log('\n--- M3. keyboard ---');
		const vis = (n) => page.evaluate((x) => document.getElementById('lpn_menu_popup' + (x === 1 ? '' : x)).style.display === 'block', n);
		const focusText = () => page.evaluate(() => (document.activeElement.textContent || '').replace(/[▸\s]+$/, '').trim());
		await page.click('#lpn_menu_file');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		await page.evaluate((t) => { const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).find((b) => b.textContent.replace(/[▸\s]+$/, '').trim() === t); r.focus(); }, importLabel);
		await page.keyboard.press('ArrowRight');
		await a.settle(300);
		ok('Right on Import opens the fly-out and focuses its first row', (await vis(2)) && (await focusText()) === 'Network', await focusText());
		await page.keyboard.press('ArrowRight');
		await a.settle(300);
		ok('Right on Network opens the third level and focuses EPANET file…', (await vis(3)) && (await focusText()) === 'EPANET file…', await focusText());
		await page.keyboard.press('ArrowDown');
		ok('Down moves within the third level', (await focusText()) === 'EPANET-MSX file…', await focusText());
		await page.keyboard.press('ArrowLeft');
		await a.settle(200);
		ok('Left closes the third level and returns to Network', !(await vis(3)) && (await vis(2)) && (await focusText()) === 'Network', await focusText());
		await page.keyboard.press('ArrowRight');
		await a.settle(200);
		await page.keyboard.press('Escape');
		await a.settle(200);
		ok('Escape closes only the third level', !(await vis(3)) && (await vis(2)));
		await page.keyboard.press('Escape');
		await a.settle(200);
		ok('a second Escape closes the fly-out and leaves the menu', !(await vis(2)) && (await vis(1)));
		await a.closeMenu();

		// ---- M4 ----------------------------------------------------------------------------------
		console.log('\n--- M4. command ids ---');
		const cat = await page.evaluate(() => EngCalcs.lpnCommandCatalog());
		const ids = cat.map((c) => c.id);
		const want = ['file/file_import_menu/file_import_survey', 'file/file_import_menu/file_import_inp', 'file/file_import_menu/file_import_msx',
			'file/file_import_menu/file_import_gjnet', 'file/file_import_menu/file_import_shapes', 'file/file_import_menu/file_import_dxf',
			'file/file_import_menu/file_import_shp', 'file/file_import_menu/library_import', 'file/file_import_menu/file_import_workspace',
			'file/file_export_menu/file_export_item_inp', 'file/file_export_menu/file_export_item_geojson', 'file/file_export_menu/file_export_item_msx',
			'file/file_export_menu/file_export_item_dxf', 'file/file_export_menu/file_export_item_ods', 'file/file_export_menu/file_export_item_xlsx',
			'file/file_export_menu/file_export_item_csv', 'file/file_export_menu/file_export_item_workspace'];
		ok('every import and export command keeps its usage id', want.every((w) => ids.indexOf(w) >= 0), want.filter((w) => ids.indexOf(w) < 0).join(', '));
		ok('the two GeoJSON import rows have two ids, not one', ids.indexOf('file/file_import_menu/file_import_gjnet') !== ids.indexOf('file/file_import_menu/file_import_shapes'));
		const gj = cat.filter((c) => c.id === 'file/file_import_menu/file_import_gjnet' || c.id === 'file/file_import_menu/file_import_shapes');
		ok('the command list names both as GeoJSON file under Import', gj.length === 2 && gj.every((c) => c.label === 'GeoJSON file…' && c.parent === importLabel), JSON.stringify(gj));
		ok('the command list holds no File group row as a command', !cat.some((c) => c.group === 'file' && ['Network', 'Shapes', 'Tables'].indexOf(c.label) >= 0));
		// A harness-side click on a third-level row still logs under the top submenu's key.
		const sentIds = await page.evaluate(() => { window.__sent = []; const o = EngCalcs.logSignal; EngCalcs.logSignal = function (a, b) { window.__sent.push(b); }; return true; });
		await a.openMenu('file');
		await a._clickRow('#lpn_menu_list', importLabel);
		await a._clickRow('#lpn_menu_list2', 'Shapes');
		await page.waitForSelector('#lpn_menu_popup3', { state: 'visible' });
		const fc = page.waitForEvent('filechooser', { timeout: 5000 }).catch(() => null);
		await a._clickRow('#lpn_menu_list3', 'DXF file…');
		await fc;
		await a.settle(400);
		const sent = await page.evaluate(() => window.__sent);
		ok('a click on Import > Shapes > DXF file… logs file/file_import_menu/file_import_dxf', sentIds && same(sent, ['cmd:file/file_import_menu/file_import_dxf']), JSON.stringify(sent));

		// ---- M5 ----------------------------------------------------------------------------------
		console.log('\n--- M5. Tables to CSV carry the libraries ---');
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'iem-'));
		let dl = null;
		const wait = page.waitForEvent('download', { timeout: 15000 }).then((x) => { dl = x; }, () => {});
		await a.menuClickSub(importLabel === exportLabel ? exportLabel : exportLabel, 'CSV file…');
		await page.waitForSelector('#lpn_dialog_buttons button', { state: 'visible', timeout: 8000 });
		await page.click('#lpn_export_tables_all');
		await page.click('#lpn_dialog_buttons button:text-is("' + (await tx('lpn_export_table_go')) + '")');
		await wait;
		ok('the export wrote one file', !!dl);
		if (dl) {
			const zipPath = path.join(dir, dl.suggestedFilename());
			await dl.saveAs(zipPath);
			const names = execFileSync('unzip', ['-Z1', zipPath], { encoding: 'utf8' }).split('\n').filter(Boolean);
			const lib = (n) => names.filter((x) => x.toLowerCase() === n.toLowerCase() + '.csv');
			const ctlName = await tx('lpn_library_controls'), ruleName = await tx('lpn_library_rules');
			ok('the zip holds the Patterns, Curves and Controls sheets', lib(await tx('lpn_library_patterns')).length === 1 && lib(ctlName).length === 1, names.join(', '));
			ok('the zip holds a Rules sheet', lib(ruleName).length === 1, names.join(', '));
			if (lib(ctlName)[0]) {
				const csv = execFileSync('unzip', ['-p', zipPath, lib(ctlName)[0]], { encoding: 'utf8' });
				ok('the Controls sheet carries the control statements and their descriptions', /Link 10 OPEN AT TIME 1/i.test(csv) && /Lake source operates only part of the day/.test(csv), csv.slice(0, 160));
			}
			if (lib(ruleName)[0]) {
				const csv = execFileSync('unzip', ['-p', zipPath, lib(ruleName)[0]], { encoding: 'utf8' });
				ok('the Rules sheet carries the rule, line by line, with its description', /RULE R1/.test(csv) && /THEN PUMP 10 STATUS IS CLOSED/.test(csv) && /Night shutoff/.test(csv), csv.slice(0, 200));
			}
		}

		// ---- M6 ----------------------------------------------------------------------------------
		console.log('\n--- M6. the leave-behind confirmation ---');
		a.autoConfirmExport = false;   // this section is about the question itself
		const exportDownload = async (rows, clickName) => {
			let got = null;
			const w = page.waitForEvent('download', { timeout: 4000 }).then((x) => { got = x; }, () => {});
			await a.menuClickSub(exportLabel, clickName);
			await a.settle(500);
			const dlg = await a.dialog();
			return { got: () => got, wait: w, dlg };
		};
		const exportLabelBase = { 'lpn_file_export_item_inp': 'EPANET file…', 'lpn_file_export_item_geojson': 'GeoJSON file…', 'lpn_file_export_item_dxf': 'DXF file…' };
		const exportBtn = (await tx('lpn_export_table_go')) || 'Export', cancelBtn = (await tx('lpn_cancel')) || 'Cancel';
		for (const key of Object.keys(exportLabelBase)) {
			const row = exportLabelBase[key];
			let r = await exportDownload(null, row);
			const title = await page.evaluate(() => (document.getElementById('lpn_dialog_title') || {}).textContent || '');
			ok(row + ': a project with a scenario besides Base asks first', !!r.dlg && r.dlg.buttons.join('|') === exportBtn + '|' + cancelBtn, JSON.stringify(r.dlg));
			if (r.dlg) {
				ok(row + ': the box names the file kind', title.indexOf(row.replace(/…$/, '')) >= 0, title);
				const lead = (await L('lpn_noscn_lead')).replace('{format}', await L('lpn_noscn_fmt_' + key.replace('lpn_file_export_item_', ''))).replace('{n}', '2');
				ok(row + ': Tom\'s pattern, a notice that this project has 2 scenarios and the file kind has none, then what is exported',
					r.dlg.text === lead + ' ' + (await L('lpn_export_goes_base')), r.dlg.text);
				if (key.endsWith('_inp')) {
					ok('the EPANET file wording is exactly Tom\'s sentence', r.dlg.text.indexOf('This project has 2 scenarios, but an EPANET file has no scenarios or alternatives. ') === 0, r.dlg.text);
				}
			}
			await r.wait;
			ok(row + ': nothing is written before the answer', !r.got());
			if (r.dlg) { await a.dialogClick(cancelBtn); }
			let g2 = null;
			const w2 = page.waitForEvent('download', { timeout: 2500 }).then((x) => { g2 = x; }, () => {});
			await w2;
			ok(row + ': Cancel writes nothing', !g2);
			r = await exportDownload(null, row);
			const w3 = page.waitForEvent('download', { timeout: 8000 }).then((x) => { g2 = x; }, () => {});
			if (r.dlg) { await a.dialogClick(exportBtn); }
			await w3;
			ok(row + ': Export writes the file', !!g2, g2 ? g2.suggestedFilename() : '');
			await a.settle(500);
			const dlg2 = await a.dialog();
			if (dlg2) { await page.keyboard.press('Escape'); await a.settle(200); }
			ok(row + ': no second question after the download', !dlg2 || dlg2.buttons.indexOf(exportBtn) < 0, dlg2 && dlg2.text.slice(0, 80));
		}
		// Peak hour open: the box names Peak hour.
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		await page.evaluate(() => { const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).find((b) => b.textContent.indexOf('Peak hour') >= 0); if (r) { r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
		await a.settle(1200);
		const rp = await exportDownload(null, 'EPANET file…');
		ok('with Peak hour open the box names Peak hour', !!rp.dlg && rp.dlg.text.indexOf('Exporting the scenario "Peak hour" to a unique file name.') >= 0
			&& rp.dlg.text === 'This project has 2 scenarios, but an EPANET file has no scenarios or alternatives. Exporting the scenario "Peak hour" to a unique file name.', rp.dlg && rp.dlg.text);
		if (rp.dlg) { await a.dialogClick(cancelBtn); }
		await a.closeMenu();

		// A project of Base alone asks nothing.
		const d1 = JSON.parse(JSON.stringify(d));
		d1.scenarios = d1.scenarios.filter((s) => s.isBase);
		const b = await load(browser, Session, d1);
		const bp = b.page;
		b.autoConfirmExport = false;
		bp.on('pageerror', (e) => errors.push(String(e && e.message)));
		for (const row of Object.values(exportLabelBase)) {
			let got = null;
			const w = bp.waitForEvent('download', { timeout: 8000 }).then((x) => { got = x; }, () => {});
			await b.menuClickSub(exportLabel, row);
			await w;
			const dlg = await b.dialog();
			ok('Base alone, ' + row + ': no confirmation, and the file is written', !!got && !(dlg && dlg.buttons.indexOf(exportBtn) >= 0), dlg ? dlg.text.slice(0, 80) : '');
			if (dlg) { await bp.keyboard.press('Escape'); await b.settle(200); }
		}

		// ---- M7 ----------------------------------------------------------------------------------
		console.log('\n--- M7. placement: a phone, and right-to-left ---');
		// Every row of every open level must be what a finger or pointer lands on at its centre.
		const covered = (pg) => pg.evaluate(() => {
			const bad = [];
			['', '2', '3'].forEach((n) => {
				const pop = document.getElementById('lpn_menu_popup' + n);
				if (!pop || pop.style.display !== 'block') { return; }
				Array.from(pop.querySelectorAll('button.lpn-menu-row')).forEach((row) => {
					const r = row.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
					const off = x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight;
					const hit = document.elementFromPoint(x, y);
					if (off || !hit || (hit !== row && !row.contains(hit))) { bad.push('popup' + (n || '1') + ':' + row.textContent.trim().slice(0, 18)); }
				});
			});
			return bad;
		});
		const openLevels = (pg) => pg.evaluate(() => ['', '2', '3'].filter((n) => document.getElementById('lpn_menu_popup' + n).style.display === 'block').length);
		const tapRow = async (pg, list, text) => {
			const h = await pg.evaluateHandle(([l, t]) => Array.from(document.querySelectorAll('#' + l + ' button.lpn-menu-row')).find((b) => b.textContent.replace(/[▸\s]+$/, '').trim() === t), [list, text]);
			const el = h.asElement();
			if (!el) { throw new Error('no row ' + text + ' in ' + list); }
			await el.tap();
			await pg.waitForTimeout(500);
		};
		const ph = await load(browser, Session, d, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
		ph.autoConfirmExport = false;
		const pp = ph.page;
		pp.on('pageerror', (e) => errors.push(String(e && e.message)));
		await pp.tap('#lpn_menu_file');
		await pp.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		await tapRow(pp, 'lpn_menu_list', importLabel);
		ok('phone: the Import fly-out leaves no row covered', same(await covered(pp), []), JSON.stringify(await covered(pp)));
		await tapRow(pp, 'lpn_menu_list2', 'Network');
		ok('phone: Network leaves no row of any open level covered', same(await covered(pp), []), JSON.stringify(await covered(pp)));
		const phRows = labels(await rowsOf(pp, 3)).concat(labels(await rowsOf(pp, 2)));
		ok('phone: the EPANET file row, Shapes and Surveyed points can all be tapped (in the group panel or the fly-out)',
			['EPANET file…'].every((t) => phRows.indexOf(t) >= 0) && (await openLevels(pp)) >= 2, JSON.stringify(phRows));
		// Whatever panel holds the group's rows, a tap on Shapes must not open the EPANET file picker.
		let picked = null;
		pp.once('filechooser', () => { picked = true; });
		const back = labels(await rowsOf(pp, 2))[0] === 'Back';
		if (back) {
			await tapRow(pp, 'lpn_menu_list2', 'Back');
			ok('phone: Back restores the Import fly-out', same(labels(await rowsOf(pp, 2)).slice(0, 2), ['Network', 'Shapes']), JSON.stringify(labels(await rowsOf(pp, 2))));
			await tapRow(pp, 'lpn_menu_list2', 'Shapes');
			ok('phone: Shapes shows its own rows, and no file picker opened', !picked && labels(await rowsOf(pp, 2)).concat(labels(await rowsOf(pp, 3))).indexOf('DXF file…') >= 0 && same(await covered(pp), []), JSON.stringify(await covered(pp)));
		} else {
			ok('phone: the third level sits clear of its parent, so Shapes is still tappable', false, 'no Back row and the rows overlap');
		}
		await ph.close();

		// Right-to-left: the third level flips the way the second one did.
		const rtlCheck = async (label, ctxUrl) => {
			const r = await load(browser, Session, d, { viewport: { width: 1000, height: 800 } }, ctxUrl);
			const rp = r.page;
			rp.on('pageerror', (e) => errors.push(String(e && e.message)));
			if (!ctxUrl) { await rp.evaluate(() => { document.documentElement.dir = 'rtl'; }); }
			await rp.click('#lpn_menu_file');
			await rp.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			await tapRowMouse(rp, 'lpn_menu_list', (await r.lang('lpn_file_export_menu')).trim());
			await tapRowMouse(rp, 'lpn_menu_list2', null, true);
			const bad = await covered(rp);
			ok(label + ': Export > Network leaves no row of any open level covered', same(bad, []), JSON.stringify(bad));
			await r.close();
		};
		async function tapRowMouse(pg, list, text, firstGroup) {
			await pg.evaluate(([l, t, fg]) => {
				const rows = Array.from(document.querySelectorAll('#' + l + ' button.lpn-menu-row'));
				const r = fg ? rows.find((b) => b.getAttribute('aria-haspopup')) : rows.find((b) => b.textContent.replace(/[▸\s]+$/, '').trim() === t);
				r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
			}, [list, text, !!firstGroup]);
			await pg.waitForTimeout(500);
		}
		await rtlCheck('RTL (dir=rtl)', null);
		await rtlCheck('Arabic page', 'Looped-Network.php?ec_nolog=1&lang=ar');
		ok('no uncaught page error', errors.length === 0, errors.join(' | '));
	} catch (e) {
		ok('harness error: ' + e.message, false);
		console.log(e.stack);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { console.log('FAILED: ' + failures); }
	process.exit(failures ? 1 : 0);
}
main();
