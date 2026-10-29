// THE GUIDE'S SCENARIOS AND SCENARIO COMPARISON CHAPTERS (Task 785).
//   node dev/lpn-spike/user-guide-scenarios-harness.js   (takes the browser lock itself)
//
// The chapters are the Scenario manager entry (after the box's own help, lpn_sm_help) and the Scenario
// comparison entry. Real Chromium:
//   1. Every interface name the chapters quote is the language file's own, read from it.
//   2. Both entries render in the Guide with their terms and tables, and a search finds them.
//   3. The worked example is performed on Net1 exactly as the chapter says, and the comparison table
//      holds the chapter's numbers cell for cell.
//   4. The behaviour the chapter states: the status strip text, the list's counts, the Properties
//      marks and the inherited-value line, the rings and Clean map, the amber Tables cell and its
//      tip, the Settings box marks, Delete in a scenario and in Base, Description being Base-wide,
//      the seven ready-made scenarios and their multipliers.
//   5. A page in another language renders the same entries.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, esString, plain, checkQuotes, openGuide, entry, searchFinds, dialogPress, finish } = L;
const NAME = 'user-guide-scenarios-harness';
U.takeBrowserLock(NAME, 'EC_UGSCN_LOCKED');

// Chapter key -> language keys whose English text the chapter writes out.
const QUOTES = {
	lpn_guide_scn_use_def: ['lpn_ff_title', 'lpn_scenario_preset_flow_static', 'lpn_scenario_preset_flow_mid', 'lpn_scenario_preset_flow_max',
		'lpn_scenario_preset_average_day', 'lpn_scenario_preset_max_day', 'lpn_scenario_preset_peak_hour'],
	lpn_guide_scn_open_def: ['lpn_menu_project', 'lpn_scenario_menu', 'lpn_scenario_label', 'lpn_scenario_overrides', 'lpn_scenario_base',
		'lpn_sm_title', 'lpn_scenario_basic'],
	lpn_guide_scn_marks_def: ['lpn_alt_cat_physical', 'lpn_pane_scn_show', 'lpn_settings_override_marks', 'lpn_clean_map', 'lpn_menu_map',
		'lpn_tool_settings', 'lpn_settings_page', 'lpn_settings_sec_symbology', 'lpn_labels_heading_node', 'lpn_labels_heading_link'],
	lpn_guide_scn_make_def: ['lpn_morph_menu', 'lpn_paste_props_menu', 'lpn_find_menu', ['lpn_sm_list_overrides', 'Override manager'], 'lpn_ovl_clear_selected',
		'lpn_pane_clear_override', 'lpn_ovl_clear_all'],
	lpn_guide_scn_move_def: ['lpn_pane_scn_show', ['lpn_field_active', 'Is active']],
	lpn_guide_scn_scope_def: ['lpn_alt_cat_physical', 'lpn_alt_cat_demand', 'lpn_alt_cat_topology', 'lpn_alt_cat_initial', 'lpn_alt_cat_constituent',
		'lpn_alt_cat_fireflow', 'lpn_alt_cat_energy', 'lpn_settings_custom_props', 'lpn_alt_cat_text', 'lpn_alt_cat_presentation', 'lpn_settings_sec_calculation',
		'lpn_field_desc'],
	lpn_guide_scn_example_def: ['lpn_menu_project', 'lpn_scenario_menu', 'lpn_scenario_new', 'lpn_dialog_ok', 'lpn_field_diameter', 'lpn_scenario_base',
		'bpn_demand_mult', 'lpn_tool_settings', 'lpn_settings_sec_calculation', 'lpn_settings_hydraulics', 'lpn_reports_menu', 'lpn_scncmp_title',
		'lpn_scenario_label', 'lpn_scenario_overrides', 'bpn_p_min', 'lpn_scncmp_col_maxvelocity'],
	lpn_guide_scn_notes_def: [['lpn_sm_list_overrides', 'Override manager'], 'lpn_ovl_same', 'lpn_scenario_basic', 'lpn_sm_title'],
	lpn_guide_text_scncmp_box: ['lpn_sm_title', 'lpn_menu_project', 'lpn_reports_menu', 'lpn_scncmp_title'],
	lpn_guide_cmp_cols_def: ['lpn_scenario_label', 'lpn_scncmp_current', 'lpn_scenario_overrides', 'bpn_demand_mult', 'lpn_time_duration',
		'lpn_time_hyd_step', 'bpn_p_min', 'lpn_scncmp_col_maxvelocity'],
	lpn_guide_cmp_run_def: ['lpn_time_duration'],
	lpn_guide_cmp_notes_def: ['lpn_scncmp_same', 'lpn_sm_title'],
	lpn_guide_cmp_byasset_def: ['lpn_scnres_title', 'lpn_survey_codes_col_type', 'points_data_copy', 'lpn_full_download_csv']
};
// The terms of the two chapters, in order (the template in Looped-Network.php).
const SM_TERMS = ['lpn_guide_scn_use_term', 'lpn_guide_scn_open_term', 'lpn_guide_scn_marks_term', 'lpn_guide_scn_make_term',
	'lpn_guide_scn_move_term', 'lpn_guide_scn_scope_term', 'lpn_guide_scn_example_term', 'lpn_guide_scn_notes_term'];
const CMP_TERMS = ['lpn_guide_cmp_cols_term', 'lpn_guide_cmp_run_term', 'lpn_scnres_title', 'lpn_guide_scn_notes_term'];

async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));

	console.log('\n1. Every interface name the chapters quote is the language file\'s');
	checkQuotes(QUOTES);

	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const ctx = await U.openNet1(browser, NAME);
		const { a, P } = ctx;
		// pageConfig carries what the script needs; a heading written in the PHP is read from the English file (this page is English).
		const T = async (k) => { try { return await U.lang(ctx, k); } catch (e) { return enString(k); } };
		const settle = (ms) => a.settle(ms || 700);
		const click = (sel) => P.evaluate((s) => { const e = document.querySelector(s); e.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }, sel);
		const SCN = await T('lpn_scenario_menu'), NEW = await T('lpn_scenario_new'), OK = await T('lpn_dialog_ok');
		const stripText = () => P.evaluate(() => document.getElementById('lpn_scenario_btn').textContent.replace(/\s+/g, ' ').trim());
		const listRows = async () => {
			await P.click('#lpn_scenario_btn');
			await P.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			const rows = await P.$$eval('#lpn_menu_list button.lpn-menu-row', (es) => es.map((e) => ({ text: e.textContent.trim().replace(/^✓\s*/, ''), on: /^✓/.test(e.textContent.trim()), off: e.disabled })));
			await P.keyboard.press('Escape');
			await settle(200);
			return rows;
		};
		const chooseScenario = async (label) => {
			await P.click('#lpn_scenario_btn');
			await P.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			for (const r of await P.$$('#lpn_menu_list button.lpn-menu-row')) {
				const t = (await r.textContent()).trim().replace(/^✓\s*/, '');
				if (t === label || t.replace(/\s*\(\d+\)$/, '') === label) { await r.click(); await settle(1200); return; }
			}
			throw new Error('no scenario row ' + label);
		};
		const newScenario = async (name) => {
			await a.menuClickSub(SCN, NEW, 'project');
			await a.waitDialog(3000);
			await P.fill('#lpn_dialog_body input', name);
			await dialogPress(P, OK);
			await settle(1000);
		};
		const closeBox = (id) => P.evaluate((i) => { const x = document.getElementById(i); if (x) { x.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } }, id);
		// Task 840: Lowest pressure and Highest velocity are compound headings (asset, value, time), so the
		// head has two rows. The table is returned as the chapter shows it: one heading row of column names
		// ("Lowest pressure: Pressure (psi)") and rows of cells.
		const compareTable = async (want) => {
			await a.menuClickSub(await T('lpn_reports_menu'), await T('lpn_scncmp_title'), 'project');
			await a.waitFor(() => P.evaluate((w) => { const t = document.querySelector('#lpn_scncmp_report > .lpn-ff-tablewrap table'); return !!t && t.rows.length === w + 2; }, want), 'comparison table', 90000);
			await settle(300);
			const rows = await P.evaluate(() => {
				const t = document.querySelector('#lpn_scncmp_report > .lpn-ff-tablewrap table'), hs = Array.from(t.tHead.rows), sec = Array.from(hs[1].cells).map((c) => c.textContent.trim()), head = []; let k = 0;
				Array.from(hs[0].cells).forEach((th) => { if (th.colSpan > 1) { for (let i = 0; i < th.colSpan; i++) { head.push(th.textContent.trim() + ': ' + sec[k++]); } } else { head.push(th.textContent.trim()); } });
				return [head].concat(Array.from(t.tBodies[0].rows).map((tr) => Array.from(tr.cells).map((c) => c.textContent.trim())));
			});
			await closeBox('lpn_scncmp_close');
			await settle(300);
			return rows;
		};

		// ---- 2. the entries render -------------------------------------------------------------
		console.log('\n2. Both entries render in the Guide, and a search finds them');
		await openGuide(a);
		let sm = await entry(P, 'lpn_sm_box'), cmp = await entry(P, 'lpn_scncmp_box');
		ok('the Scenario manager entry is in the Guide, titled by the box', !!sm && sm.title.trim() === await T('lpn_sm_title'), sm && sm.title);
		ok('...it opens with the box\'s own help (Tom\'s wording), which the chapter follows', !!sm && (() => { const h = sm.text.indexOf(plain(enString('lpn_sm_help')).slice(0, 30)); return h >= 0 && h < sm.text.indexOf(enString('lpn_guide_scn_use_term')); })());
		// Tom, 2026-10-19: "How scenarios and alternatives work" and "How to manage scenarios" are headings
		// like the chapter's other sub-headings, not paragraphs ending in a colon; the "- " lines are a list.
		const sub = await P.evaluate(() => {
			const en = document.getElementById('lpn_guide_b_lpn_sm_box');
			return { heads: Array.from(en.querySelectorAll('h4.lpn-guide-subhead')).map((h) => h.textContent), items: en.querySelectorAll(':scope > ul > li').length,
				dashParas: Array.from(en.querySelectorAll(':scope > p')).filter((p) => /^- /.test(p.textContent)).length,
				headBold: en.querySelector('h4.lpn-guide-subhead') ? getComputedStyle(en.querySelector('h4.lpn-guide-subhead')).fontWeight : '' };
		});
		const smParas = enString('lpn_sm_help').split('\\n\\n');
		ok('...its two lines of Tom\'s help are headings, colon dropped, and its "- " lines a list', JSON.stringify(sub.heads) === JSON.stringify(smParas.filter((t) => /:$/.test(t)).map((t) => t.replace(/:$/, ''))) && sub.items === smParas.filter((t) => /^- /.test(t)).length && sub.dashParas === 0 && Number(sub.headBold) >= 600, JSON.stringify(sub));
		// Tom, 2026-10-20: the order is production's: Basic mode first, because that is all a beginner wants to read.
		{
			const b = (n) => /Basic mode/.test(smParas[n]);
			ok('...Tom\'s help puts Basic mode first, then the detail, and the entry shows it in that order', /:$/.test(smParas[0]) && b(1) && b(2) && !b(3) && !b(4) && !!sm &&
				smParas.slice(0, 7).every((t, n, a) => n === 0 || sm.text.indexOf(plain(t).slice(0, 25)) > sm.text.indexOf(plain(a[n - 1]).slice(0, 25))));
		}
		ok('...and carries the seven terms of the chapter, in order, after it', !!sm && SM_TERMS.every((k, i) => sm.dts[i] === enString(k)), sm && JSON.stringify(sm.dts));
		ok('...and its tables (what can be overridden, the worked example)', !!sm && sm.tables.length === 2, sm && String(sm.tables.length));
		ok('the Scenario comparison entry carries its four terms and its table', !!cmp && CMP_TERMS.every((k, i) => cmp.dts[i] === enString(k)) && cmp.tables.length === 1, cmp && JSON.stringify(cmp.dts));
		ok('...and its opening paragraphs are the box text', !!cmp && cmp.text.indexOf(plain(enString('lpn_guide_text_scncmp_box')).slice(0, 30)) >= 0);
		ok('a search for "dashed gray" shows the Scenario manager entry', await searchFinds(a, 'lpn_sm_box', 'dashed gray'));
		ok('a search for "fixed head" shows the Scenario comparison entry', await searchFinds(a, 'lpn_scncmp_box', 'fixed head'));
		await P.keyboard.press('Escape');
		await settle(300);

		// ---- 3. Net1: Base alone ---------------------------------------------------------------
		console.log('\n3. Net1 opens with Base alone, and the status strip reads as the chapter quotes it');
		const baseStrip = (await T('lpn_scenario_label')) + ': ' + (await T('lpn_scenario_base')) + ' | ' + (await T('lpn_scenario_overrides')) + ': 0';
		ok('the strip reads "' + baseStrip + '"', (await stripText()) === baseStrip, await stripText());
		ok('...and the chapter quotes that line', plain(enString('lpn_guide_scn_open_def')).indexOf(baseStrip) >= 0);
		let rows = await listRows();
		ok('the list holds Base alone (an opened example has no ready-made scenarios)', rows.filter((r) => /\(\d+\)$/.test(r.text)).length === 0 && rows.some((r) => r.text === 'Base' && r.on), JSON.stringify(rows.map((r) => r.text)));
		const wantRows = [await T('lpn_sm_menu'), await T('lpn_scenario_basic'), NEW, await T('lpn_scenario_copy'), await T('lpn_scenario_rename'),
			await T('lpn_scenario_delete'), await T('lpn_sm_list_overrides')];
		ok('...above Base the list has the rows the chapter names (Scenario manager, Basic mode, New, Copy, Rename, Delete, and the override list), in any order',
			wantRows.every((w) => rows.slice(0, 7).some((r) => r.text === w)), JSON.stringify(rows.slice(0, 7).map((r) => r.text)));
		ok('...the Scenario manager row is not dimmed while Basic mode is checked (Tom, 2026-10-25)', rows.filter((r) => r.text === wantRows[0])[0].off !== true);

		// ---- 4. the worked example, performed ----------------------------------------------------
		console.log('\n4. The worked example: Larger main and Max day on Net1');
		await newScenario('Larger main');
		const afterNew = (await T('lpn_scenario_label')) + ': Larger main | ' + (await T('lpn_scenario_overrides')) + ': 0';
		ok('a new scenario starts with no overrides, and is the open one', (await stripText()) === afterNew, await stripText());
		await U.openProperties(ctx, 'link', '10');
		await U.typeProperty(ctx, await T('lpn_field_diameter'), '24');
		const strip1 = (await T('lpn_scenario_label')) + ': Larger main | ' + (await T('lpn_scenario_overrides')) + ': 1';
		ok('typing 24 for Diameter makes one override: "' + strip1 + '"', (await stripText()) === strip1, await stripText());
		const marks = await P.evaluate(() => {
			const f = document.getElementById('lpn_popup_fields');
			const dots = Array.from(f.querySelectorAll('.lpn-ovm-dot')), hollow = Array.from(f.querySelectorAll('.lpn-ovm-hollow'));
			return { dots: dots.length, dotTip: dots[0] && dots[0].title, hollow: hollow.length, hollowTip: hollow[0] && hollow[0].title,
				notes: Array.from(f.querySelectorAll('.lpn-ov-base')).map((n) => n.textContent.trim()) };
		});
		ok('Properties marks the overridden Diameter with one solid dot, and the other rows with hollow dots', marks.dots === 1 && marks.hollow > 3, JSON.stringify({ d: marks.dots, h: marks.hollow }));
		ok('...the solid dot says what clicking it does', marks.dotTip === (await T('lpn_ovm_dot_clear_one')), marks.dotTip);
		// feat/value-source: the hollow dot also names where the inherited value comes from.
		const fromTip = (await T('lpn_ovm_dot_set_from')).split('{name}');
		ok('...the hollow dot says where the value comes from and what clicking it does', !!marks.hollowTip && marks.hollowTip.startsWith(fromTip[0]) && marks.hollowTip.endsWith(fromTip[1])
			&& marks.hollowTip.length > fromTip[0].length + fromTip[1].length, marks.hollowTip);
		const baseLine = (await T('lpn_ovm_restores')).replace('{value}', '18 in').replace('{source}', (await T('lpn_settings_held_from')).replace('{parent}', await T('lpn_scenario_base')));
		ok('...what Clear restores shows beneath the row, as the chapter quotes it: ' + baseLine, marks.notes.indexOf(baseLine) >= 0 && plain(enString('lpn_guide_scn_marks_def')).indexOf(baseLine) >= 0, JSON.stringify(marks.notes));
		await P.evaluate(() => { const b = document.getElementById('lpn_popup_close'); if (b && b.offsetParent) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
		await settle(300);
		const rings = () => P.evaluate(() => ({ amber: document.querySelectorAll('#lpn_canvas .lpn-override').length, gray: document.querySelectorAll('#lpn_canvas .lpn-override-inh').length }));
		let r = await rings();
		ok('with the Diameter label off, the overridden diameter has no ring (the chapter\'s rule for diameter)', r.amber === 0 && r.gray === 0, JSON.stringify(r));
		// The label is a project setting; ticking it in Base (not in the scenario) adds no override to the example.
		await chooseScenario(await T('lpn_scenario_base'));
		await a.menuClick(await T('lpn_tool_settings'), 'project');
		await settle(900);
		await P.evaluate((d) => {
			const box = document.getElementById('lpn_settings_box');
			const lab = Array.from(box.querySelectorAll('label.lpn-set-name')).filter((l) => l.textContent.trim() === d && l.querySelector('input[type=checkbox]'))[0];
			if (!lab.querySelector('input').checked) { lab.querySelector('input').click(); }
		}, await T('lpn_field_diameter'));
		await settle(1200);
		await closeBox('lpn_setbox_close');
		await chooseScenario('Larger main');
		r = await rings();
		ok('with the Diameter label on, the map rings the one asset with an override in amber', r.amber === 1 && r.gray === 0, JSON.stringify(r));
		rows = await listRows();
		ok('the list shows the count in parentheses, with a check at the open scenario', rows.some((x) => x.text === 'Larger main (1)' && x.on), JSON.stringify(rows.map((x) => x.text)));
		// Tables: the amber cell and its tip.
		await P.evaluate(() => document.getElementById('lpn_pane_btn').click());
		await settle(800);
		await P.evaluate(() => { const t = document.getElementById('lpn_pane_tab_pipes'); if (t) { t.click(); } });
		await settle(700);
		const cell = await P.evaluate(() => { const td = document.querySelector('#lpn_pane_pipes td.lpn-pane-ovcell'); return td ? { tip: td._lpnScnTip || td.title, n: document.querySelectorAll('#lpn_pane_pipes td.lpn-pane-ovcell').length } : null; });
		const cellTip = (await T('lpn_pane_scn_alt_tip')).replace('{category}', await T('lpn_alt_cat_physical')).replace('{alternative}', 'Larger main');
		ok('Tables colors the one cell the scenario sets, and its tip is "' + cellTip + '"', !!cell && cell.n === 1 && cell.tip === cellTip, JSON.stringify(cell));
		ok('...which is the form the chapter quotes', plain(enString('lpn_guide_scn_marks_def')).indexOf(cellTip) >= 0);
		await P.evaluate(() => document.getElementById('lpn_pane_btn').click());
		await settle(500);
		// Clean map hides the rings; the Settings switch is where the chapter says.
		await a.menuClick(await T('lpn_clean_map'), 'map');
		await settle(500);
		r = await rings();
		ok('choosing Clean map in the Map menu hides the rings', r.amber === 0, JSON.stringify(r));
		await a.menuClick('✓ ' + await T('lpn_clean_map'), 'map');
		await settle(500);
		r = await rings();
		ok('...and choosing it again shows them', r.amber === 1, JSON.stringify(r));
		await a.menuClick(await T('lpn_tool_settings'), 'project');
		await settle(900);
		const heads = await P.evaluate((m) => {
			const box = document.getElementById('lpn_settings_box');
			const row = Array.from(box.querySelectorAll('label, tr, div')).filter((x) => x.textContent.replace(/\s+/g, ' ').trim().indexOf(m) === 0 && x.querySelector('input'))[0];
			if (!row) { return null; }
			const out = []; let e = row;
			while (e && e !== box) {
				let p = e.previousElementSibling;
				while (p) { if (/^H[2-4]$/.test(p.tagName) || p.classList.contains('lpn-set-head') || p.classList.contains('lpn-set-sub')) { out.push(p.textContent.trim()); break; } p = p.previousElementSibling; }
				e = e.parentElement;
			}
			return out.join(' < ');
		}, await T('lpn_settings_override_marks'));
		ok('Show override markers on the map sits under ' + (await T('lpn_settings_page')) + ' and ' + (await T('lpn_settings_page')),
			!!heads && heads.indexOf(await T('lpn_settings_page')) === 0 && heads.lastIndexOf('< ' + (await T('lpn_settings_page'))) > 0, heads);
		const hasHead = (t) => P.evaluate((x) => Array.from(document.querySelectorAll('#lpn_settings_box .lpn-set-head, #lpn_settings_box .lpn-set-sub'))
			.some((h) => h.textContent.trim().indexOf(x) === 0), t);
		ok('the Settings box has the headings the chapters name: Symbology with Node labels and Link labels, Calculation with Hydraulics',
			await hasHead(await T('lpn_settings_sec_symbology')) && await hasHead(await T('lpn_labels_heading_node')) && await hasHead(await T('lpn_labels_heading_link'))
			&& await hasHead(await T('lpn_settings_sec_calculation')) && await hasHead(await T('lpn_settings_hydraulics')));
		await closeBox('lpn_setbox_close');
		await settle(300);

		// Max day: the multiplier, typed in Settings.
		await chooseScenario(await T('lpn_scenario_base'));
		await newScenario('Max day');
		await a.menuClick(await T('lpn_tool_settings'), 'project');
		await settle(900);
		const dmName = await T('bpn_demand_mult');
		await P.evaluate((dm) => {
			const box = document.getElementById('lpn_settings_box');
			const lab = Array.from(box.querySelectorAll('label, .lpn-set-row, tr, div')).filter((x) => x.textContent.replace(/\s+/g, ' ').trim().indexOf(dm) === 0 && x.querySelector('input'))[0];
			const i = lab.querySelector('input'); i.focus(); i.value = '1.8';
			i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); i.blur();
		}, dmName);
		await settle(1500);
		const sm2 = await P.evaluate(() => ({ dots: document.querySelectorAll('#lpn_settings_box .lpn-ovm-dot').length, hollow: document.querySelectorAll('#lpn_settings_box .lpn-ovm-hollow').length }));
		ok('the Settings box marks the typed multiplier with a solid dot and has no hollow dots', sm2.dots === 1 && sm2.hollow === 0, JSON.stringify(sm2));
		await closeBox('lpn_setbox_close');
		await settle(300);
		const doc = await U.storedProject(ctx);
		ok('Max day holds the multiplier 1.8 and the project\'s own stays 1', JSON.stringify(doc.calcSets.map((c) => c.demandMultiplier)) === '[1.8]' && doc.settings.hydraulics.demandMultiplier === 1, JSON.stringify(doc.calcSets));

		// The comparison, cell for cell against the chapter's table.
		const table = await compareTable(3);
		const heading = table[0];
		const ex = (await entryTable(P, 'lpn_sm_box', 1));
		// The chapter's table has the comparison's own two heading rows (Tom, 2026-10-27: asset, value and time are three columns each,
		// no sentence cells): group names over Junction/Pressure/Time and Link/Velocity/Time, then the column names, then one row per scenario.
		const colKeys = ['lpn_scenario_label', 'lpn_scenario_overrides', 'bpn_demand_mult', 'bpn_p_min', 'lpn_scncmp_col_maxvelocity'];
		const wantHead = [];
		for (const k of colKeys) { wantHead.push(await T(k)); }
		const idx = { name: heading.indexOf(wantHead[0]), ov: heading.indexOf(wantHead[1]), dm: heading.indexOf(wantHead[2]),
			p: heading.findIndex((h) => h.indexOf(wantHead[3] + ': ') === 0), v: heading.findIndex((h) => h.indexOf(wantHead[4] + ': ') === 0) };
		const subHead = (h) => h.slice(h.indexOf(': ') + 2);
		const liveCols = [heading[idx.name], heading[idx.ov], heading[idx.dm]].concat([0, 1, 2].map((i) => subHead(heading[idx.p + i])), [0, 1, 2].map((i) => subHead(heading[idx.v + i])));
		ok('the chapter\'s example table has the comparison\'s own group headings', JSON.stringify(ex[0]) === JSON.stringify(['', '', '', wantHead[3], wantHead[4]]), JSON.stringify(ex[0]));
		ok('...and the comparison\'s own column names', JSON.stringify(ex[1]) === JSON.stringify(liveCols), JSON.stringify(ex[1]) + ' vs ' + JSON.stringify(liveCols));
		ok('the comparison has the columns the chapter lists (Total run time, Hydraulic time step among them)', heading.indexOf(await T('lpn_time_duration')) > 0 && heading.indexOf(await T('lpn_time_hyd_step')) > 0, JSON.stringify(heading));
		const cur = ' ' + (await T('lpn_scncmp_current'));
		for (const row of ex.slice(2)) {
			const got = table.slice(1).filter((t) => t[idx.name].replace(cur, '') === row[0])[0];
			const live = got && [got[idx.name].replace(cur, ''), got[idx.ov], got[idx.dm]].concat([0, 1, 2].map((i) => got[idx.p + i]), [0, 1, 2].map((i) => got[idx.v + i]));
			ok('comparison row ' + row[0] + ' = chapter: ' + row.slice(1).join(' | '), !!live && JSON.stringify(live) === JSON.stringify(row), JSON.stringify(live));
		}
		ok('...and the open scenario is marked "(currently open)"', table.slice(1).some((t) => t[idx.name] === 'Max day' + cur));
		ok('the comparison lists exactly the three scenarios of the example', table.length === 4, String(table.length - 1));
		const durCol = heading.indexOf(await T('lpn_time_duration'));
		ok('the chapter says the total run time is 24:00 in all three', table.slice(1).every((t) => t[durCol] === '24:00') && plain(enString('lpn_guide_scn_example_def')).indexOf('24:00') >= 0);

		// ---- 5. Delete in a scenario; Description is Base-wide ------------------------------------
		console.log('\n5. Delete in a scenario, Delete in Base, and what is the same in every scenario');
		await U.openProperties(ctx, 'node', '22');
		await P.keyboard.press('Delete');
		await settle(1300);
		const base = await T('lpn_scenario_base');
		const wantNotice = (await T('lpn_scenario_deactivated')).replace('{id}', '22').replace('{scenario}', 'Max day') + ' ' + (await T('lpn_scenario_delete_in_base')).split('{base}').join(base);
		ok('Delete on Junction 22 in Max day says what it did', (await a.notice()) === wantNotice, await a.notice());
		const doc2 = await U.storedProject(ctx);
		const topo = (doc2.alternatives || []).filter((x) => x.category === 'topology')[0];
		ok('...it made the node and its four pipes inactive in Max day (five overrides), and Base still has them',
			!!topo && Object.keys(topo.values).sort().join() === ['l:112', 'l:122', 'l:21', 'l:22', 'n:22'].sort().join() && topo.values['n:22'].active === false && doc2.nodes.some((x) => String(x.id) === '22'),
			topo && Object.keys(topo.values).join());
		await U.openProperties(ctx, 'node', '11');
		await P.evaluate(() => {
			const lab = Array.from(document.querySelectorAll('#lpn_popup_fields label')).filter((l) => l.querySelector('textarea'))[0];
			const t = lab.querySelector('textarea'); t.focus(); t.value = 'Hydrant at Elm';
			t.dispatchEvent(new Event('input', { bubbles: true })); t.dispatchEvent(new Event('change', { bubbles: true })); t.blur();
		});
		await settle(900);
		const doc3 = await U.storedProject(ctx);
		const n11 = doc3.nodes.filter((x) => String(x.id) === '11')[0];
		const anyDesc = JSON.stringify(doc3.alternatives || []).indexOf('"desc"') >= 0 || JSON.stringify(doc3.scenarios || []).indexOf('"desc"') >= 0;
		ok('a Description typed in Max day is stored on the asset itself, in Base, and in no scenario', n11 && n11.desc === 'Hydrant at Elm' && !anyDesc, JSON.stringify(n11 && n11.desc));
		await P.evaluate(() => { const b = document.getElementById('lpn_popup_close'); if (b && b.offsetParent) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
		await settle(300);
		await chooseScenario(await T('lpn_scenario_base'));
		await U.openProperties(ctx, 'link', '10');
		const tri = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-ovm-tri')).map((t) => t.title));
		ok('in Base, the Diameter row of Pipe 10 has a triangle that counts the scenario below it', tri.length === 1 && tri[0] === (enString('lpn_ovm_child_tip')).replace('{n}', '1'), JSON.stringify(tri));
		await P.keyboard.press('Delete');
		await a.waitDialog(3000);
		const dlg = await a.dialog();
		ok('Delete on Pipe 10 in Base asks first, counting its overrides in the other scenarios', !!dlg && dlg.text.indexOf((await T('lpn_delete_drops_overrides')).replace('{n}', '1')) >= 0, dlg && dlg.text);
		if (dlg) { await dialogPress(P, dlg.buttons[dlg.buttons.length - 1]); }
		await settle(500);
		const d4 = await U.storedProject(ctx);
		ok('...and answering no deletes nothing', d4.links.some((l) => String(l.id) === '10'));

		// ---- 6. a new project: the seven ready-made scenarios -------------------------------------
		console.log('\n6. A new project starts with seven ready-made scenarios');
		await a.newProject('us');
		await settle(1500);
		rows = await listRows();
		// The six the chapter lists, by key; a seventh (Fire plus max day) may still be there until the Scenarios menu branch lands.
		const presets = ['flow_static', 'flow_mid', 'flow_max', 'average_day', 'max_day', 'peak_hour'];
		const names = [];
		for (const p of presets) { names.push(await T('lpn_scenario_preset_' + p)); }
		const listed = rows.map((x) => x.text);
		ok('the list holds the six names the chapter writes out, in order, each with one override', names.every((nm, i) => listed.indexOf(nm + ' (1)') >= 0 && (i === 0 || listed.indexOf(nm + ' (1)') > listed.indexOf(names[i - 1] + ' (1)'))), JSON.stringify(listed.slice(-7)));
		const d5 = await U.storedProject(ctx);
		const mult = presets.map((p, i) => { const s = d5.scenarios.filter((x) => x.name === names[i])[0]; return s && s.demandMultiplier; });
		ok('...with multipliers 1, 1, 1, 1, 2, and 3, as the chapter states', JSON.stringify(mult) === '[1,1,1,1,2,3]', JSON.stringify(mult));
		ok('no page errors (English)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.context.close().catch(() => {});

		// ---- 7. another language -------------------------------------------------------------------
		console.log('\n7. A page in another language shows the same entries');
		const { Session } = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
		const b = await Session.open(browser, NAME + '-es', { locale: 'es', viewport: { width: 1400, height: 900 } });
		await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await b.goto('Looped-Network.php?lang=es');
		await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await b.openExampleCard(await b.lang('lpn_ex_net1_title'));
		await b.settle(1200);
		await openGuide(b);
		const esSm = await entry(b.page, 'lpn_sm_box'), esCmp = await entry(b.page, 'lpn_scncmp_box');
		ok('the Spanish page shows the Scenario manager entry with its seven terms', !!esSm && SM_TERMS.every((k, i) => esSm.dts[i] === esString(k)), esSm && JSON.stringify(esSm.dts.slice(0, 2)));
		ok('...and the Scenario comparison entry with its four terms and its table', !!esCmp && CMP_TERMS.every((k, i) => esCmp.dts[i] === esString(k)) && esCmp.tables.length === 1);
		ok('...the entries are titled by the Spanish box titles', !!esSm && esSm.title.trim() === await b.lang('lpn_sm_title') && !!esCmp && esCmp.title.trim() === await b.lang('lpn_scncmp_title'), esSm && esSm.title);
		ok('no page errors (Spanish)', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
		await b.context.close().catch(() => {});
	} catch (e) {
		console.error(e && e.stack || e);
		ok('the harness ran to the end', false, String(e && e.message));
	} finally {
		await browser.close().catch(() => {});
		env.stopServer();
	}
	process.exit(finish(NAME));
}

// One table of a Guide entry, as rows of cell text.
function entryTable(page, boxId, which) {
	return page.evaluate(([id, w]) => {
		const t = document.getElementById('lpn_guide_b_' + id).querySelectorAll('table')[w];
		return Array.from(t.rows).map((r) => Array.from(r.cells).map((c) => c.textContent.trim()));
	}, [boxId, which]);
}
main();
