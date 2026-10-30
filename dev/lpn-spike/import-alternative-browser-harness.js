// QUESTION 3 OF AN IMPORT: WHICH ALTERNATIVE RECEIVES THE VALUES, IN A REAL CHROMIUM (Task 814).
//   node dev/lpn-spike/import-alternative-browser-harness.js   (takes the browser lock itself)
// A two-scenario project (Base and "Peak hour"), Basic mode OFF, every command reached through its real menu row.
//   A1  EPANET file into the open scenario: after the destination the page asks, per category the file
//       writes (Physical for an elevation, Active topology for an asset added), which alternative takes
//       the values. The default is the scenario's own alternative; the receipt names each.
//   A2  A NEW alternative, named by the visitor, a child of what the scenario used: it exists, the
//       scenario names it, the values are in it, ONE undo takes all of it back; a taken name is refused.
//   A3  The Base alternative: the value is written to Base, the scenario holds no override.
//   A4  Basic mode on: no alternative question. Base open: none either.
//   A5  Surveyed points ask for Active topology alone; a new alternative takes the nodes.
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
//   N5  Base alone: surveyed points are not asked anything.
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = process.env.EC_REPO || path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_IMPORTALT_LOCKED';
const NAME = 'import-alternative-browser-harness';
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
		const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'latlon-originals', 'Net3-Novato-CA-World.lwn'), 'utf8'));
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
		// The open dialog sits inside the viewport and its name field can be reached.
		const dialogFits = async () => page.evaluate(() => {
			const d = document.getElementById('lpn_dialog'), i = document.getElementById('lpn_import_newscn');
			if (!d || !i) { return 'no dialog or field'; }
			const r = d.getBoundingClientRect(), ir = i.getBoundingClientRect(), lab = document.querySelector('label[for=lpn_import_newscn]').getBoundingClientRect();
			const bad = [];
			if (r.left < -1 || r.right > innerWidth + 1) { bad.push('dialog ' + Math.round(r.left) + '..' + Math.round(r.right)); }
			if (ir.right > innerWidth + 1 || ir.width < 40) { bad.push('field ' + Math.round(ir.left) + '..' + Math.round(ir.right)); }
			if (ir.left < lab.right + 4 && Math.abs(ir.top - lab.top) < 10) { bad.push('no gap between label and field'); }
			if (document.documentElement.scrollWidth > innerWidth + 1) { bad.push('page scrolls sideways'); }
			return bad.join('; ');
		});
		const undo = async () => { await page.keyboard.press('Control+z'); await a.settle(1500); const dd = await a.dialog(); if (dd) { console.log('   (dialog after undo: ' + dd.text.slice(0, 200) + ' / ' + dd.buttons.join(' | ') + ')'); await a.dialogClick(dd.buttons[0]); await a.settle(600); } };
		const NB = await L('lpn_inpup_btn_newscn'), NBB = await L('lpn_inpup_btn_newscn_basic');
		// Basic mode hides the tree words; with it off the button names the parent.
		let basicOn = true;
		const newBtn = (parent) => (basicOn ? NBB : NB.replace('{parent}', parent));
		const added = async (scn) => (await L('lpn_survey_added_scenario')).split('{scenario}').join(scn).split('.')[0] + '.';
		const created = async (scn, parent) => basicOn ? (await L('lpn_inpup_new_scn_basic')).replace('{scenario}', scn) : (await L('lpn_inpup_new_scn')).replace('{scenario}', scn).replace('{parent}', parent);

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

		const peakOf = (st) => st.scn.find((s) => s.name === 'Peak hour');
		const altsIn = (st) => st.j.alternatives || [];
		const elevOf = (n) => (n._elev !== undefined ? n._elev : n.elev);
		// Every {category, alt name, prop} holding an elevation written for the junction, wherever it sits.
		const valueHolders = (st, id, prop) => {
			const out = [];
			const scan = (map, where) => Object.keys(map || {}).forEach((k) => { if (k.indexOf(id) >= 0 && map[k] && map[k][prop] !== undefined) { out.push({ where, key: k, value: map[k][prop] }); } });
			st.scn.forEach((s) => scan(s.overrides, 'scenario ' + (s.name || s.id)));
			altsIn(st).forEach((x) => scan(x.values, 'alternative ' + x.name));
			return out;
		};
		const catHeading = async (cat) => (await L('lpn_inpalt_heading')).replace('{category}', await a.lang('lpn_alt_cat_' + cat));
		const goBtn = await L('lpn_library_import_go');
		const open = (await L('lpn_inpup_btn_scenario')).replace('{scenario}', 'Peak hour');
		// Basic mode off, with Peak hour open.
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		await clickRow('#lpn_menu_list button.lpn-menu-row, #lpn_menu_list2 button.lpn-menu-row', await L('lpn_scenario_basic'));
		await a.settle(900);
		let more = await a.dialog();
		if (more) { await a.dialogClick(more.buttons[0]); await a.settle(600); }
		basicOn = false;
		ok('Peak hour is open', await toScenario('Peak hour'));
		const st0 = await state();
		const baseElev0 = elevOf(nodeOf(st0, jid));
		const toAlternativeQuestion = async () => {
			await importInp('edited.inp');
			let dlg = await a.dialog();
			await a.dialogClick(open);
			await a.settle(700);
			return dlg;
		};

		console.log('--- A1. the question, and its default ---');
		let dlg = await toAlternativeQuestion();
		dlg = await a.dialog();
		ok('after the destination the alternative question is asked', dlg && dlg.buttons.indexOf(goBtn) >= 0, dlg && dlg.buttons.join(' | '));
		ok('it heads Physical (the elevation)', dlg && dlg.text.indexOf(await catHeading('physical')) >= 0, dlg && dlg.text.slice(0, 300));
		ok('it heads Active topology (the asset added)', dlg && dlg.text.indexOf(await catHeading('topology')) >= 0);
		ok('each category offers the three answers',
			dlg && dlg.text.indexOf((await L('lpn_inpalt_own')).replace('{scenario}', 'Peak hour')) >= 0 && dlg.text.indexOf((await L('lpn_inpalt_new')).replace('{parent}', 'Base')) >= 0 && dlg.text.indexOf(await L('lpn_inpalt_base')) >= 0, dlg && dlg.text.slice(0, 500));
		ok('the default is the scenario\'s own alternative', await page.isChecked('#lpn_inpalt_physical_own') && await page.isChecked('#lpn_inpalt_topology_own'));
		ok('the new alternative has a default name', (await page.inputValue('#lpn_inpalt_physical_name')) === 'Child_1_of_Base', await page.inputValue('#lpn_inpalt_physical_name'));
		await a.dialogClick(goBtn);
		await a.settle(1200);
		dlg = await a.dialog();
		ok('the receipt names the alternatives that took the values',
			dlg && dlg.text.indexOf((await L('lpn_inpalt_receipt')).split('{list}')[0]) >= 0 && dlg.text.indexOf(await a.lang('lpn_alt_cat_physical') + ': Peak hour') >= 0, dlg && dlg.text.slice(0, 400));
		await a.dialogClick(await L('lpn_dialog_ok'));
		await declineMore();
		let st1 = await state();
		const h1 = valueHolders(st1, jid, 'elev');
		ok('the elevation is an override held for Peak hour, Base untouched', h1.length === 1 && h1[0].value === baseElev + 7 && elevOf(nodeOf(st1, jid)) === baseElev0, JSON.stringify(h1));
		await undo();
		ok('one undo takes it all back', valueHolders(await state(), jid, 'elev').length === 0 && !nodeOf(await state(), 'NEWJ'));

		console.log('--- A2. a new alternative ---');
		await toAlternativeQuestion();
		await page.click('#lpn_inpalt_physical_new');
		await page.fill('#lpn_inpalt_physical_name', 'Elevation study');
		await a.dialogClick(goBtn);
		await a.settle(1200);
		dlg = await a.dialog();
		ok('the receipt names the new alternative', dlg && dlg.text.indexOf((await a.lang('lpn_alt_cat_physical')) + ': Elevation study') >= 0, dlg && dlg.text.slice(0, 400));
		await a.dialogClick(await L('lpn_dialog_ok'));
		await declineMore();
		let st2 = await state();
		const made = altsIn(st2).find((x) => x.name === 'Elevation study');
		ok('the alternative exists in Physical, a child of Base', !!made && made.category === 'physical' && (made.parent === null || made.parent === undefined), JSON.stringify(made));
		ok('Peak hour names it', peakOf(st2).alternatives && peakOf(st2).alternatives.physical === (made && made.id), JSON.stringify(peakOf(st2).alternatives));
		const h2 = valueHolders(st2, jid, 'elev');
		ok('the elevation is held by the new alternative alone', h2.length === 1 && h2[0].where === 'alternative Elevation study' && h2[0].value === baseElev + 7, JSON.stringify(h2));
		ok('the asset added is active in Peak hour through its own Active topology alternative', !!nodeOf(st2, 'NEWJ') && nodeOf(st2, 'NEWJ')._active === false);
		await undo();
		st2 = await state();
		ok('one undo removes the alternative, the value and the asset', !altsIn(st2).some((x) => x.name === 'Elevation study') && !(peakOf(st2).alternatives || {}).physical && !nodeOf(st2, 'NEWJ'));
		// A taken name is refused and the question is asked again, the typed name kept.
		await toAlternativeQuestion();
		await page.click('#lpn_inpalt_physical_new');
		await page.fill('#lpn_inpalt_physical_name', 'Base');
		await a.dialogClick(goBtn);
		await a.settle(600);
		dlg = await a.dialog();
		ok('a taken name is refused and the question stays', dlg && dlg.buttons.indexOf(goBtn) >= 0 && (await page.inputValue('#lpn_inpalt_physical_name')) === 'Base' && await page.isChecked('#lpn_inpalt_physical_new'), dlg && dlg.buttons.join(' | '));
		ok('nothing was written meanwhile', valueHolders(await state(), jid, 'elev').length === 0);
		await a.dialogClick(await L('lpn_cancel'));
		await a.settle(500);
		ok('Cancel on the question changes nothing and says so', (await notice()).indexOf(await L('lpn_inpalt_cancelled')) >= 0 && !nodeOf(await state(), 'NEWJ'), await notice());

		console.log('--- A3. the Base alternative ---');
		await toAlternativeQuestion();
		await page.click('#lpn_inpalt_physical_base');
		await a.dialogClick(goBtn);
		await a.settle(1200);
		dlg = await a.dialog();
		ok('the receipt names Base for Physical', dlg && dlg.text.indexOf((await a.lang('lpn_alt_cat_physical')) + ': Base') >= 0, dlg && dlg.text.slice(0, 400));
		await a.dialogClick(await L('lpn_dialog_ok'));
		await declineMore();
		const st3 = await state();
		ok('Base itself now holds the new elevation', elevOf(nodeOf(st3, jid)) === baseElev + 7, String(elevOf(nodeOf(st3, jid))));
		ok('Peak hour holds no elevation override', valueHolders(st3, jid, 'elev').length === 0);
		await undo();
		ok('one undo restores Base', elevOf(nodeOf(await state(), jid)) === baseElev0);

		console.log('--- A4. no question where there is nothing to choose ---');
		await toScenario('Base');
		await importInp('edited.inp');
		dlg = await a.dialog();
		ok('in Base the destination is the project and no alternative is asked',
			dlg && dlg.buttons.indexOf((await L('lpn_inpup_btn_project')).replace('{project}', 'Elm Street')) >= 0, dlg && dlg.buttons.join(' | '));
		await a.dialogClick((await L('lpn_inpup_btn_project')).replace('{project}', 'Elm Street'));
		await a.settle(1000);
		dlg = await a.dialog();
		ok('Base goes straight to the receipt', dlg && dlg.buttons.indexOf(goBtn) < 0, dlg && dlg.buttons.join(' | '));
		await a.dialogClick(await L('lpn_dialog_ok'));
		await declineMore();
		await undo();
		await toScenario('Peak hour');
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		await clickRow('#lpn_menu_list button.lpn-menu-row, #lpn_menu_list2 button.lpn-menu-row', await L('lpn_scenario_basic'));
		await a.settle(900);
		more = await a.dialog();
		if (more) { await a.dialogClick(more.buttons[0]); await a.settle(600); }
		basicOn = true;
		await importInp('edited.inp');
		await a.dialogClick(open);
		await a.settle(900);
		dlg = await a.dialog();
		ok('with Basic mode on the import goes straight to the receipt', dlg && dlg.buttons.indexOf(goBtn) < 0, dlg && dlg.buttons.join(' | '));
		await a.dialogClick(await L('lpn_dialog_ok'));
		await declineMore();
		await undo();

		console.log('--- A5. surveyed points ask for Active topology alone ---');
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		await clickRow('#lpn_menu_list button.lpn-menu-row, #lpn_menu_list2 button.lpn-menu-row', await L('lpn_scenario_basic'));
		await a.settle(900);
		more = await a.dialog();
		if (more) { await a.dialogClick(more.buttons[0]); await a.settle(600); }
		basicOn = false;
		await toScenario('Peak hour');
		const csv = '1,38.10,-122.57,50,P1\n2,38.11,-122.58,51,P2\n';
		const n0 = (await state()).nodes.length;
		const chooser = page.waitForEvent('filechooser', { timeout: 8000 });
		await menuRow('lpn_file_import_menu', 'lpn_file_import_survey');
		await (await chooser).setFiles({ name: 'pts.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
		await page.waitForSelector('#lpn_dialog_buttons button', { state: 'visible', timeout: 8000 });
		await a.settle(300);
		await a.dialogClick(await L('lpn_survey_create'));
		await a.settle(500);
		await a.dialogClick(open);
		await a.settle(600);
		dlg = await a.dialog();
		ok('the survey asks for Active topology alone', dlg && dlg.text.indexOf(await catHeading('topology')) >= 0 && dlg.text.indexOf(await catHeading('physical')) < 0, dlg && dlg.text.slice(0, 300));
		await page.click('#lpn_inpalt_topology_new');
		await page.fill('#lpn_inpalt_topology_name', 'Survey nodes');
		await a.dialogClick(goBtn);
		await a.settle(900);
		dlg = await a.dialog();
		ok('the report names the alternative', dlg && dlg.text.indexOf((await a.lang('lpn_alt_cat_topology')) + ': Survey nodes') >= 0, dlg && dlg.text.slice(0, 300));
		await a.dialogClick(await L('lpn_dialog_ok'));
		await declineMore();
		const st5 = await state();
		const alt5 = altsIn(st5).find((x) => x.name === 'Survey nodes');
		ok('two nodes were added and the new Active topology alternative holds their activation',
			st5.nodes.length === n0 + 2 && !!alt5 && alt5.category === 'topology' && Object.keys(alt5.values || {}).length === 2, JSON.stringify(alt5 && alt5.values).slice(0, 200));
		await undo();
		const st6 = await state();
		ok('one undo takes the nodes and the alternative', st6.nodes.length === n0 && !altsIn(st6).some((x) => x.name === 'Survey nodes'));


		console.log('--- A6. layout, and the label when the alternative is shared ---');
		// The name box sits directly under the second choice.
		await importInp('edited.inp');
		await a.dialogClick(open);
		await a.settle(700);
		ok('the name box follows the "new" choice directly',
			await page.evaluate(() => { const r = document.getElementById('lpn_inpalt_physical_new'); const n = document.getElementById('lpn_inpalt_physical_name'); return !!r && !!n && r.parentNode.nextElementSibling === n; }));
		await a.dialogClick(await L('lpn_cancel'));
		await a.settle(400);
		// Two scenarios share one Physical alternative.
		const d2 = JSON.parse(JSON.stringify(d));
		d2.alternatives = [{ id: 'a1', category: 'physical', name: 'Shared pipes', parent: null }];
		d2.scenarios.find((x) => x.id === 's1').alternatives = { physical: 'a1' };
		d2.scenarios.push({ id: 's2', name: 'Off peak', overrides: {}, alternatives: { physical: 'a1' } });
		d2.scenarios.push({ id: 's3', name: 'Fire A', overrides: {}, alternatives: { physical: 'a1' } });
		d2.scenarios.push({ id: 's4', name: 'Fire B', overrides: {}, alternatives: { physical: 'a1' } });
		d2.scenarios.push({ id: 's5', name: 'Fire C', overrides: {}, alternatives: { physical: 'a1' } });
		d2.project = Object.assign({}, d2.project, { activeScenario: 's1' });
		await boot(d2);
		const basicRow = async () => {
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			const t = await page.evaluate((x) => { const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row, #lpn_menu_list2 button.lpn-menu-row')).find((b) => b.textContent.indexOf(x) >= 0); return r ? r.textContent : ''; }, await L('lpn_scenario_basic'));
			if (t.indexOf('✓') >= 0) { await clickRow('#lpn_menu_list button.lpn-menu-row, #lpn_menu_list2 button.lpn-menu-row', await L('lpn_scenario_basic')); await a.settle(900); const m = await a.dialog(); if (m) { await a.dialogClick(m.buttons[0]); await a.settle(600); } } else { await page.keyboard.press('Escape'); }
		};
		await basicRow();
		await toScenario('Peak hour');
		await importInp('shared.inp');
		await a.dialogClick(open);
		await a.settle(700);
		dlg = await a.dialog();
		const sharedLabel = (await L('lpn_inpalt_shared')).replace('{alternative}', 'Shared pipes');
		ok('the default is labelled with the alternative and its first three other users, then the count',
			dlg && dlg.text.indexOf(sharedLabel.split('{scenarios}')[0] + 'Off peak, Fire A, Fire B ' + (await L('lpn_inpalt_more')).replace('{n}', '1')) >= 0 && dlg.text.split(await catHeading('topology'))[0].indexOf("Peak hour's own alternative") < 0, dlg && dlg.text.slice(150, 500));
		ok('the default is still chosen', await page.isChecked('#lpn_inpalt_physical_own'));
		await a.dialogClick(await L('lpn_library_import_go'));
		await a.settle(1200);
		dlg = await a.dialog();
		if (dlg) { await a.dialogClick(await L('lpn_dialog_ok')); }
		await declineMore();
		const st7 = await state();
		const h7 = valueHolders(st7, jid, 'elev');
		ok('the default wrote into the shared alternative', h7.length === 1 && h7[0].where === 'alternative Shared pipes', JSON.stringify(h7));
		await undo();
		// Active topology answered Base, then New.
		await importInp('topo.inp');
		await a.dialogClick(open);
		await a.settle(700);
		await page.click('#lpn_inpalt_topology_base');
		await a.dialogClick(await L('lpn_library_import_go'));
		await a.settle(1200);
		dlg = await a.dialog();
		ok('the receipt names Base for Active topology', dlg && dlg.text.indexOf((await a.lang('lpn_alt_cat_topology')) + ': Base') >= 0, dlg && dlg.text.slice(0, 300));
		await a.dialogClick(await L('lpn_dialog_ok'));
		await declineMore();
		const st8 = await state();
		ok('the added asset is active in Base itself and held by no alternative', !!nodeOf(st8, 'NEWJ') && nodeOf(st8, 'NEWJ')._active !== false && valueHolders(st8, 'NEWJ', 'active').length === 0, JSON.stringify(valueHolders(st8, 'NEWJ', 'active')));
		await undo();
		await importInp('topo2.inp');
		await a.dialogClick(open);
		await a.settle(700);
		await page.click('#lpn_inpalt_topology_new');
		await page.fill('#lpn_inpalt_topology_name', 'New nodes');
		await a.dialogClick(await L('lpn_library_import_go'));
		await a.settle(1200);
		dlg = await a.dialog();
		if (dlg) { await a.dialogClick(await L('lpn_dialog_ok')); }
		await declineMore();
		const st9 = await state();
		const t9 = altsIn(st9).find((x) => x.name === 'New nodes');
		ok('a new Active topology alternative holds the activation and Peak hour names it',
			!!t9 && t9.category === 'topology' && JSON.stringify(t9.values || {}).indexOf('NEWJ') >= 0 && peakOf(st9).alternatives.topology === t9.id, JSON.stringify(t9));
		await undo();

		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 400));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
