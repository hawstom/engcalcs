// AN IMPORT MAY LAND IN A NEW SCENARIO, IN A REAL CHROMIUM (Task 814, the standard's question 1).
//   node dev/lpn-spike/import-new-scenario-browser-harness.js   (takes the browser lock itself)
// A two-scenario project (Base and "Peak hour"), every command reached through its real menu row.
//   N1  File > Import > EPANET file in Peak hour: the question offers "A new scenario, child of
//       Base" (Basic mode on), a taken name is refused and asked again, the new scenario is created,
//       opened, holds the file's changes as overrides, an asset only in the file is active only there,
//       the receipt names it, and ONE undo takes all of it back.
//   N2  Basic mode off: the choice reads "child of Peak hour" and the new scenario's parent is Peak hour.
//   N3  File > Import > GeoJSON network: the same choice, the same result.
//   N4  File > Import > Surveyed points, with more than Base: asked where the points go; open
//       scenario, Base, and a new scenario each put the nodes where they say; ONE undo each.
//   N5  Base alone: surveyed points are not asked anything.
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = process.env.EC_REPO || path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_IMPORTNEWSCN_LOCKED';
const NAME = 'import-new-scenario-browser-harness';
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
		d.settings.autoRun = false;
		const a = await Session.open(browser, 'A', { serviceWorkers: 'block', acceptDownloads: true });
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		const boot = async (data) => {
			await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); }, JSON.stringify(data));
			await a.reload();
			await a.answerTrainingPanel().catch(() => {});
			await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
			await page.setViewportSize({ width: 1600, height: 1000 });
			await a.settle(2500);
		};
		await boot(d);
		const L = async (k) => (await a.lang(k)).trim();
		const clickRow = (sel, text) => page.evaluate(([s, t]) => {
			const r = Array.from(document.querySelectorAll(s)).find((b) => b.textContent.replace(/[▸\s]+$/, '').trim().indexOf(t) >= 0);
			if (r) { r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
			return !!r;
		}, [sel, text]);
		const menuRow = async (top, item) => {
			await page.click('#lpn_menu_file');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			await clickRow('#lpn_menu_list button.lpn-menu-row', await L(top));
			await page.waitForSelector('#lpn_menu_list2 button.lpn-menu-row', { state: 'attached' });
			if (await clickRow('#lpn_menu_list2 button.lpn-menu-row', await L(item))) { return; }
			const groups = await page.$$eval('#lpn_menu_list2 button.lpn-menu-row', (els) => els.filter((e) => e.querySelector('.lpn-menu-arrow')).map((e) => e.textContent.replace(/[▸\s]+$/, '').trim()));
			for (const g of groups) {
				await clickRow('#lpn_menu_list2 button.lpn-menu-row', g);
				await page.waitForSelector('#lpn_menu_list3 button.lpn-menu-row', { state: 'attached' });
				if (await clickRow('#lpn_menu_list3 button.lpn-menu-row', await L(item))) { return; }
			}
		};
		const toScenario = async (name) => {
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			const hit = await clickRow('#lpn_menu_list button.lpn-menu-row, #lpn_menu_list2 button.lpn-menu-row', name);
			await a.settle(1200);
			return hit;
		};
		const scnButton = () => page.evaluate(() => (document.getElementById('lpn_scenario_btn') || {}).textContent || '');
		const notice = () => a.notice();
		// The saved project, as the page last wrote it.
		const state = async () => { await a.settle(1500); return stateNow(); };
		const stateNow = () => page.evaluate(() => {
			let best = null;
			for (let i = 0; i < localStorage.length; i++) {
				const v = localStorage.getItem(localStorage.key(i));
				if (v && v.indexOf('"scenarios"') >= 0 && v.length > (best ? best.length : 0)) { best = v; }
			}
			return best;
		}).then((t) => {
			const j = JSON.parse(t);
			const nodes = j.nodes || (j.network && j.network.nodes) || [];
			return { j, nodes, scn: j.scenarios || [], active: (j.project || {}).activeScenario };
		});
		const nodeOf = (st, id) => st.nodes.find((n) => String(n.id) === id);
		// A scenario's own values: its overrides plus the stored alternatives it names (Basic mode keeps them there).
		const own = (st, scn) => {
			const out = Object.assign({}, scn.overrides || {});
			Object.keys(scn.alternatives || {}).forEach((cat) => {
				const alt = (st.j.alternatives || []).find((x) => x.id === scn.alternatives[cat]);
				if (alt) { Object.keys(alt.values || {}).forEach((k) => { out[k] = Object.assign({}, out[k] || {}, alt.values[k]); }); }
			});
			return out;
		};
		const names = (st) => st.scn.map((s) => s.name || (s.isBase ? 'Base' : s.id));
		const doExport = async (item) => {
			let dl = null;
			const p = page.waitForEvent('download', { timeout: 8000 }).then((x) => { dl = x; }, () => {});
			await menuRow('lpn_file_export_menu', item);
			await a.settle(400);
			const asked = await a.dialog();
			if (asked && asked.buttons.indexOf(await L('lpn_export_table_go')) >= 0) { await a.dialogClick(await L('lpn_export_table_go')); }
			await p;
			await a.settle(500);
			const text = dl ? fs.readFileSync(await dl.path(), 'utf8') : null;
			const dlg = await a.dialog();
			if (dlg) { await a.dialogClick(await L('lpn_dialog_ok')); }
			return text;
		};
		// Further questions the page queues behind a receipt (looking up elevations) are declined, never answered yes.
		const declineMore = async () => { for (let k = 0; k < 3; k++) { const q = await a.dialog(); if (!q) { return; } await page.keyboard.press('Escape'); await a.settle(500); } };
		const undo = async () => { await page.keyboard.press('Control+z'); await a.settle(1500); const dd = await a.dialog(); if (dd) { console.log('   (dialog after undo: ' + dd.text.slice(0, 200) + ' / ' + dd.buttons.join(' | ') + ')'); await a.dialogClick(dd.buttons[0]); await a.settle(600); } };
		const NB = await L('lpn_inpup_btn_newscn');
		const newBtn = (parent) => NB.replace('{parent}', parent);
		const added = async (scn) => (await L('lpn_survey_added_scenario')).split('{scenario}').join(scn).split('.')[0] + '.';
		const created = async (scn, parent) => (await L('lpn_inpup_new_scn')).replace('{scenario}', scn).replace('{parent}', parent);

		// ---- the files ----
		await toScenario('Base');
		const inpBase = await doExport('lpn_file_export_item_inp');
		ok('an .inp was exported from the project', !!inpBase && inpBase.indexOf('[JUNCTIONS]') >= 0);
		const lines = inpBase.split(/\r?\n/);
		const jh = lines.findIndex((l) => /^\[JUNCTIONS\]/.test(l));
		const first = lines.slice(jh + 1).find((l) => l.trim() && l[0] !== ';');
		const f = first.trim().split(/\s+/);
		const editedLine = [f[0], String(parseFloat(f[1]) + 7)].concat(f.slice(2)).join(' ');
		let inpEdit = lines.slice();
		inpEdit[inpEdit.indexOf(first)] = editedLine;
		inpEdit.splice(jh + 1, 0, ' NEWJ  123  0');
		const ch = inpEdit.findIndex((l) => /^\[COORDINATES\]/.test(l));
		const coordRow = inpEdit.slice(ch + 1).find((l) => l.trim() && l[0] !== ';').trim().split(/\s+/);
		inpEdit.splice(ch + 1, 0, ' NEWJ  ' + coordRow[1] + '  ' + coordRow[2]);
		const INP = inpEdit.join('\n');
		const jid = f[0];
		const baseElev = parseFloat(f[1]);
		const importInp = async (name) => {
			await page.setInputFiles('#lpn_inp_file', { name, mimeType: 'text/plain', buffer: Buffer.from(INP) });
			await a.settle(900);
		};

		console.log('--- N1. EPANET file into a new scenario, from Peak hour (Basic mode on) ---');
		ok('Peak hour is opened', await toScenario('Peak hour'));
		const st0 = await state();
		const nPeakOv0 = JSON.stringify(own(st0, st0.scn.find((s) => s.name === 'Peak hour')));
		await importInp('edited.inp');
		let dlg = await a.dialog();
		ok('the question has the new-scenario choice, after the open scenario and before Base',
			dlg && dlg.buttons.join('|') === [await L('lpn_inpup_btn_new'), (await L('lpn_inpup_btn_scenario')).replace('{scenario}', 'Peak hour'), newBtn('Base'), await L('lpn_scenario_base'), await L('lpn_cancel')].join('|'),
			dlg && dlg.buttons.join(' | '));
		ok('the dialog has the name field with a default name', (await page.inputValue('#lpn_import_newscn')) === 'Scenario 2', await page.inputValue('#lpn_import_newscn'));
		ok('the dialog labels the field', dlg.text.indexOf(await L('lpn_inpup_newscn_name')) >= 0);
		await page.fill('#lpn_import_newscn', 'Peak hour');
		await a.dialogClick(newBtn('Base'));
		dlg = await a.dialog();
		ok('a taken name is refused, the question is asked again with the typed name kept',
			dlg && dlg.buttons.indexOf(newBtn('Base')) >= 0 && (await page.inputValue('#lpn_import_newscn')) === 'Peak hour');
		ok('the refusal is said', (await notice()).indexOf('Peak hour') >= 0 && (await notice()).indexOf((await L('lpn_sm_name_taken')).split('{name}')[1]) >= 0, await notice());
		ok('nothing was created by the refusal', (await state()).scn.length === st0.scn.length);
		await page.fill('#lpn_import_newscn', 'Edited');
		await a.dialogClick(newBtn('Base'));
		await a.settle(1200);
		dlg = await a.dialog();
		ok('the receipt dialog says the scenario was created and opened',
			dlg && dlg.text.indexOf((await created('Edited', 'Base'))) >= 0, dlg && dlg.text.slice(0, 160));
		ok('the receipt names the new scenario in its heading', dlg && dlg.text.indexOf((await L('lpn_inpup_heading')).replace('{file}', 'edited.inp').replace('{scenario}', 'Edited').split('{project}')[0]) >= 0);
		ok('the receipt lists the change and the added asset', dlg && dlg.text.indexOf(jid) >= 0 && dlg.text.indexOf('NEWJ') >= 0);
		await a.dialogClick(await L('lpn_dialog_ok'));
		await declineMore();
		ok('the new scenario is the open one', (await scnButton()).indexOf('Edited') >= 0, await scnButton());
		const st1 = await state();
		const ed = st1.scn.find((s) => s.name === 'Edited');
				ok('exactly one scenario was added', st1.scn.length === st0.scn.length + 1 && !!ed, names(st1).join(','));
		ok('it holds overrides, among them the changed elevation', ed && own(st1, ed)['n:' + jid] && own(st1, ed)['n:' + jid].elev === baseElev + 7, JSON.stringify(ed && own(st1, ed)).slice(0, 200));
		ok('Base still holds the old elevation', String(nodeOf(st1, jid).elev) === String(baseElev) || nodeOf(st1, jid).elev === baseElev, String(nodeOf(st1, jid).elev));
		ok('Peak hour is untouched', JSON.stringify(own(st1, st1.scn.find((s) => s.name === 'Peak hour'))) === nPeakOv0);
		const nj = nodeOf(st1, 'NEWJ');
		ok('the new junction exists, inactive in Base', !!nj && nj._active === false, JSON.stringify(nj && nj._active));
		ok('and is made active by the new scenario alone', ed && JSON.stringify(own(st1, ed)).indexOf('NEWJ') >= 0 && JSON.stringify(own(st1, st1.scn.find((s) => s.name === 'Peak hour'))).indexOf('NEWJ') < 0);
		await undo();
		const st2 = await state();
		ok('ONE undo removes the scenario and the asset and returns to Peak hour',
			st2.scn.length === st0.scn.length && !nodeOf(st2, 'NEWJ') && (await scnButton()).indexOf('Peak hour') >= 0, names(st2).join(',') + ' / ' + (await scnButton()));

		console.log('--- N2. Basic mode off: a child of Peak hour ---');
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		await clickRow('#lpn_menu_list button.lpn-menu-row, #lpn_menu_list2 button.lpn-menu-row', await L('lpn_scenario_basic'));
		await a.settle(900);
		let more = await a.dialog();
		if (more) { await a.dialogClick(more.buttons[0]); await a.settle(600); }
		await importInp('edited2.inp');
		dlg = await a.dialog();
		ok('the choice now names Peak hour as the parent', dlg && dlg.buttons.indexOf(newBtn('Peak hour')) >= 0, dlg && dlg.buttons.join(' | '));
		await a.dialogClick(newBtn('Peak hour'));
		await a.settle(1200);
		dlg = await a.dialog();
		ok('the receipt says it is a child of Peak hour', dlg && dlg.text.indexOf((await created('Scenario 2', 'Peak hour'))) >= 0, dlg && dlg.text.slice(0, 160));
		await a.dialogClick(await L('lpn_dialog_ok'));
		await declineMore();
		const st3 = await state();
		const child = st3.scn.find((s) => s.name === 'Scenario 2');
		ok('its stored parent is Peak hour', child && child.parent === 's1', JSON.stringify(child && child.parent));
		await undo();
		ok('one undo again', (await state()).scn.length === st0.scn.length);

		console.log('--- N3. GeoJSON network into a new scenario ---');
		await toScenario('Base');
		const gj = await doExport('lpn_file_export_item_geojson');
		const g = JSON.parse(gj);
		const jf = g.features.find((x) => x.properties && x.properties.node_type === 'Junction' && String(x.properties.name) === jid);
		jf.properties.elevation = jf.properties.elevation + 7;
		const nf = JSON.parse(JSON.stringify(jf));
		nf.properties.name = 'NEWG';
		nf.geometry.coordinates = [jf.geometry.coordinates[0] + 0.001, jf.geometry.coordinates[1] + 0.001];
		g.features.push(nf);
		await toScenario('Peak hour');
		const chooser = page.waitForEvent('filechooser', { timeout: 8000 });
		await menuRow('lpn_file_import_menu', 'lpn_file_import_gjnet');
		await (await chooser).setFiles({ name: 'edited.geojson', mimeType: 'application/geo+json', buffer: Buffer.from(JSON.stringify(g)) });
		await page.waitForSelector('#lpn_dialog_buttons button', { state: 'visible', timeout: 8000 });
		await a.settle(400);
		dlg = await a.dialog();
		ok('the GeoJSON question has the same choice', dlg && dlg.buttons.indexOf(newBtn('Peak hour')) >= 0 || dlg.buttons.indexOf(newBtn('Base')) >= 0, dlg && dlg.buttons.join(' | '));
		const gbtn = dlg.buttons.find((b) => b.indexOf('A new scenario') === 0);
		await a.dialogClick(gbtn);
		await a.settle(1200);
		dlg = await a.dialog();
		ok('its receipt names the new scenario', dlg && dlg.text.indexOf((await L('lpn_inpup_new_scn')).split('{scenario}')[0]) >= 0 && dlg.text.indexOf('NEWG') >= 0, dlg && dlg.text.slice(0, 200));
		await a.dialogClick(await L('lpn_dialog_ok'));
		await declineMore();
		const st4 = await state();
		ok('a scenario was added and NEWG is inactive in Base', st4.scn.length === st0.scn.length + 1 && nodeOf(st4, 'NEWG') && nodeOf(st4, 'NEWG')._active === false);
		await undo();
		const st5 = await state();
		ok('one undo removes it all', st5.scn.length === st0.scn.length && !nodeOf(st5, 'NEWG'));

		console.log('--- N4. surveyed points, with more than Base ---');
		const csv = '1,38.10,-122.57,50,P1\n2,38.11,-122.58,51,P2\n';
		const survey = async () => {
			const chooser2 = page.waitForEvent('filechooser', { timeout: 8000 });
			await menuRow('lpn_file_import_menu', 'lpn_file_import_survey');
			await (await chooser2).setFiles({ name: 'pts.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
			await page.waitForSelector('#lpn_dialog_buttons button', { state: 'visible', timeout: 8000 });
			await a.settle(300);
			await a.dialogClick(await L('lpn_survey_create'));
			await a.settle(500);
		};
		const finish = async () => {
			let r = await a.dialog();
			const text = r ? r.text : '';
			if (r) { await a.dialogClick(await L('lpn_dialog_ok')); }
			await a.settle(500);
			r = await a.dialog();
			if (r) { await page.keyboard.press('Escape'); await a.settle(400); }
			return text;
		};
		const open = (await L('lpn_inpup_btn_scenario')).replace('{scenario}', 'Peak hour');
		const countNodes = async () => (await state()).nodes.length;
		const n0 = await countNodes();
		await survey();
		dlg = await a.dialog();
		ok('the points are asked where they go: open scenario, new scenario, Base, Cancel',
			dlg && dlg.buttons.join('|') === [open, newBtn('Peak hour'), await L('lpn_scenario_base'), await L('lpn_cancel')].join('|') || (dlg && dlg.buttons.join('|') === [open, newBtn('Base'), await L('lpn_scenario_base'), await L('lpn_cancel')].join('|')), dlg && dlg.buttons.join(' | '));
		ok('the box says what the choice means', dlg && dlg.text.indexOf(await L('lpn_survey_where_lead')) >= 0 && dlg.text.indexOf(await L('lpn_survey_where_note')) >= 0);
		await a.dialogClick(await L('lpn_cancel'));
		ok('Cancel makes nothing', (await countNodes()) === n0 && !!(await notice()));
		// (a) the open scenario, the default
		await survey();
		await a.dialogClick(open);
		await a.settle(600);
		let rep = await finish();
		let s = await state();
		ok('the open scenario: the report says the nodes went to Peak hour', rep.indexOf(await added('Peak hour')) >= 0, rep.slice(0, 120));
		ok('two nodes added, inactive in Base', s.nodes.length === n0 + 2 && s.nodes.slice(n0).every((n) => n._active === false));
		await undo();
		ok('undo (open scenario)', (await countNodes()) === n0);
		// (b) Base
		await survey();
		await a.dialogClick(await L('lpn_scenario_base'));
		await a.settle(600);
		rep = await finish();
		s = await state();
		ok('Base: no scenario sentence', rep.indexOf((await L('lpn_survey_added_scenario')).split('{scenario}')[0]) < 0 && rep.indexOf((await L('lpn_inpup_new_scn')).split('{scenario}')[0]) < 0, rep.slice(0, 120));
		ok('two nodes added, active in Base, no Peak hour overrides for them', s.nodes.length === n0 + 2 && s.nodes.slice(n0).every((n) => n._active !== false) && JSON.stringify(own(s, s.scn.find((x) => x.name === 'Peak hour'))).indexOf('active') < 0);
		ok('Peak hour is still the open scenario', (await scnButton()).indexOf('Peak hour') >= 0, await scnButton());
		await undo();
		ok('undo (Base)', (await countNodes()) === n0 && (await scnButton()).indexOf('Peak hour') >= 0);
		// (c) a new scenario
		await survey();
		await page.fill('#lpn_import_newscn', 'Survey');
		await a.dialogClick((await a.dialog()).buttons.find((b) => b.indexOf('A new scenario') === 0));
		await a.settle(700);
		rep = await finish();
		s = await state();
		ok('new scenario: the report says it was created, then where the nodes went',
			rep.indexOf((await created('Survey', '@')).split('@')[0]) === 0 && rep.indexOf(await added('Survey')) >= 0, rep.slice(0, 200));
		ok('Survey exists and is open; two nodes are active only there',
			!!s.scn.find((x) => x.name === 'Survey') && (await scnButton()).indexOf('Survey') >= 0 && s.nodes.length === n0 + 2 && s.nodes.slice(n0).every((n) => n._active === false));
		await undo();
		s = await state();
		ok('ONE undo removes the scenario and the nodes', s.scn.length === st0.scn.length && s.nodes.length === n0 && (await scnButton()).indexOf('Peak hour') >= 0, names(s).join(',') + ' / ' + s.nodes.length);

		console.log('--- N5. Base alone: no question for surveyed points ---');
		const d5 = JSON.parse(JSON.stringify(d));
		d5.scenarios = [d5.scenarios[0]];
		d5.project.activeScenario = 'base';
		await boot(d5);
		const m0 = await countNodes();
		await survey();
		await a.settle(400);
		rep = await finish();
		ok('the points went in at once, with no destination question', (await countNodes()) === m0 + 2 && rep.indexOf(await L('lpn_survey_where_lead')) < 0, rep.slice(0, 100));

		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 400));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
