// THE GUIDE'S SETTINGS CHAPTER (Task 785).
//   node dev/lpn-spike/user-guide-settings-harness.js   (takes the browser lock itself)
//
// The chapter is the entry for the Settings box. Real Chromium:
//   1. Every interface name the chapter quotes is the language file's own, read from it.
//   2. The entry renders in the Guide with its six terms, and a search finds it.
//   3. The sections and sub-headings the chapter lists are the box's own, in order, with the saved
//      marks it states, and the Settings tab in Tables has the columns it names.
//   4. The searches the chapter gives return what it says, a word in a tip included.
//   5. The units example is performed on Net1: the question, Destructive (13 values, 457.2 mm, one
//      Undo), Non-destructive (13 values untouched, 18 mm).
//   6. Restore defaults and Start fresh ask the questions the chapter describes, Undo does not
//      reverse Restore defaults, and in a scenario Restore defaults is dimmed, the units note shows,
//      and applying new-asset values is refused.
//   7. A page in another language renders the same entry.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, esString, plain, checkQuotes, openGuide, entry, searchFinds, dialogPress, finish } = L;
const NAME = 'user-guide-settings-harness';
U.takeBrowserLock(NAME, 'EC_UGSET_LOCKED');

const QUOTES = {
	lpn_guide_text_settings_box: ['lpn_menu_project', 'lpn_tool_settings', 'calc_defaults', 'lpn_settings_wipe_btn', 'lpn_settings_search'],
	lpn_guide_set_where_def: ['lpn_settings_sec_symbology', 'lpn_labels_heading_node', 'lpn_settings_sym_node_colors', 'lpn_labels_heading_link', 'lpn_settings_sym_link_colors',
		'lpn_settings_sym_customer', 'lpn_settings_sym_all', 'lpn_menu_map', 'lpn_settings_page', 'lpn_settings_sec_assets',
		'lpn_settings_id_prefixes', 'lpn_settings_defaults', 'lpn_settings_custom_props', 'lpn_settings_sec_calculation', 'lpn_view_units', 'lpn_time_menu',
		'lpn_settings_hydraulics', 'lpn_settings_energy', 'lpn_settings_quality', 'lpn_settings_color_credits', 'lpn_saved_project', 'lpn_saved_browser',
		'lpn_settings_runbox', 'lpn_tool_settings', 'lpn_settings_table_category', 'lpn_find_value'],
	lpn_guide_set_search_def: ['lpn_settings_search', 'lpn_settings_symbol_opacity', 'lpn_settings_backdrop_opacity', 'lpn_settings_emitter_exponent'],
	lpn_guide_set_scn_def: ['calc_defaults', 'lpn_settings_push_btn'],
	lpn_guide_set_units_def: ['lpn_units_nondestructive', 'lpn_units_destructive', 'lpn_cancel', 'lpn_field_diameter', 'lpn_view_units'],
	lpn_guide_set_assets_def: ['lpn_settings_apply_to_all', 'lpn_settings_push_btn', 'lpn_settings_id_prefixes', 'lpn_settings_defaults'],
	lpn_guide_set_reset_def: ['calc_defaults', 'lpn_settings_wipe_btn']
};
const TERMS = ['lpn_guide_set_where_term', 'lpn_guide_set_search_term', 'lpn_guide_set_scn_term', 'lpn_guide_set_units_term',
	'lpn_guide_set_assets_term', 'lpn_guide_set_reset_term'];
// The box's own order, by language key: [section, [sub-headings]].
const STRUCTURE = [
	['lpn_settings_sec_symbology', ['lpn_labels_heading_node', 'lpn_settings_sym_node_colors', 'lpn_labels_heading_link', 'lpn_settings_sym_link_colors', 'lpn_settings_sym_customer', 'lpn_settings_sym_all']],
	['lpn_menu_map', ['lpn_menu_map']],
	['lpn_settings_page', ['lpn_settings_page']],
	['lpn_settings_sec_assets', ['lpn_settings_id_prefixes', 'lpn_settings_defaults', 'lpn_settings_custom_props']],
	['lpn_settings_sec_calculation', ['lpn_view_units', 'lpn_time_menu', 'lpn_settings_hydraulics', 'lpn_settings_energy', 'lpn_settings_quality']],
	['lpn_settings_color_credits', []]
];
// The numbers the units example states, read out of the chapter so a changed example is re-measured.
function unitsExample() {
	const t = plain(enString('lpn_guide_set_units_def'));
	const d = t.match(/Destructive rewrites (\d+) values, and Pipe 10 reads ([\d.]+) mm\./);
	const n = t.match(/Non-destructive leaves the (\d+) values alone, and Pipe 10 reads ([\d.]+) mm\./);
	return { d: d && d.slice(1), n: n && n.slice(1) };
}

async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));

	console.log('\n1. Every interface name the chapter quotes is the language file\'s');
	checkQuotes(QUOTES);
	const ux = unitsExample();
	ok('the units example is in the form this harness measures', !!ux.d && !!ux.n, JSON.stringify(ux));

	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const ctx = await U.openNet1(browser, NAME);
		const { a, P } = ctx;
		const T = async (k) => { try { return await U.lang(ctx, k); } catch (e) { return enString(k); } };
		const settle = (ms) => a.settle(ms || 700);
		const closeBox = (id) => P.evaluate((i) => { const x = document.getElementById(i); if (x) { x.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } }, id);
		const closePopup = () => closeBox('lpn_popup_close').then(() => settle(400));
		const settingsOpen = () => P.evaluate(() => { const b = document.getElementById('lpn_settings_box'); return !!b && b.style.display !== 'none' && b.getClientRects().length > 0; });
		const openSettings = async () => {
			if (!(await settingsOpen())) { await a.menuClick(await T('lpn_tool_settings'), 'project'); await settle(900); }
		};
		const goTo = async (heading) => {
			await P.evaluate((h) => { const b = Array.from(document.querySelectorAll('#lpn_setbox_index button')).filter((x) => x.textContent.trim() === h)[0]; if (b) { b.click(); } }, heading);
			await settle(500);
		};
		const diameter = async () => {
			await U.openProperties(ctx, 'link', '10');
			await settle(500);
			const v = await P.evaluate(() => { const l = Array.from(document.querySelectorAll('#lpn_popup_fields label')).filter((x) => x.textContent.replace(/\s+/g, ' ').trim().indexOf('Diameter') === 0)[0]; const n = l.querySelector('.lpn-gname'), u = l.querySelector('.lpn-gutext'); return { label: (n ? n.textContent + (u ? '(' + u.textContent + ')' : '') : l.textContent).replace(/\s+/g, ' ').trim(), value: l.querySelector('input').value }; });
			await closePopup();
			return v;
		};
		const undo = async () => {
			await P.evaluate(() => { if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });
			await P.mouse.move(700, 600);
			await P.keyboard.press('Control+z');
			await settle(900);
		};
		const press = (text) => P.evaluate((t) => {
			const b = Array.from(document.querySelectorAll('#lpn_settings_box button')).filter((x) => x.textContent.trim() === t)[0];
			if (!b) { return null; }
			const off = b.disabled;
			if (!off) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }
			return { off: off };
		}, text);
		const setNumber = (label, value) => P.evaluate(([l, v]) => {
			const box = document.getElementById('lpn_settings_box');
			const row = Array.from(box.querySelectorAll('label, .lpn-set-row, tr, div')).filter((x) => x.textContent.replace(/\s+/g, ' ').trim().indexOf(l) === 0 && x.querySelector('input'))[0];
			const i = row.querySelector('input'); i.focus(); i.value = v;
			i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); i.blur();
		}, [label, value]);
		const readNumber = (label) => P.evaluate((l) => {
			const box = document.getElementById('lpn_settings_box');
			const row = Array.from(box.querySelectorAll('label, .lpn-set-row, tr, div')).filter((x) => x.textContent.replace(/\s+/g, ' ').trim().indexOf(l) === 0 && x.querySelector('input'))[0];
			return row.querySelector('input').value;
		}, label);

		// ---- 2. the entry renders ---------------------------------------------------------------
		console.log('\n2. The entry renders in the Guide, and a search finds it');
		await openGuide(a);
		const en = await entry(P, 'lpn_settings_box');
		ok('the Settings entry is in the Guide, with its six terms in order', !!en && TERMS.every((k, i) => en.dts[i] === enString(k)), en && JSON.stringify(en.dts));
		ok('...after the box\'s opening paragraph', !!en && en.text.indexOf(plain(enString('lpn_guide_text_settings_box')).slice(0, 30)) >= 0);
		ok('a search for "Start fresh" shows the Settings entry', await searchFinds(a, 'lpn_settings_box', 'Start fresh'));
		await P.keyboard.press('Escape');
		await settle(300);

		// ---- 3. the box's own structure ---------------------------------------------------------
		console.log('\n3. Sections, sub-headings, and where each is saved');
		await openSettings();
		const dom = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_settings_box .lpn-set-head, #lpn_settings_box .lpn-set-sub')).map((e) => ({
			head: e.classList.contains('lpn-set-head'), text: e.childNodes[0].textContent.replace(/\s*\?\s*$/, '').trim(), saved: e.getAttribute('data-saved') })));
		const want = [];
		for (const [sec, subs] of STRUCTURE) { want.push({ head: true, text: await T(sec) }); for (const s of subs) { want.push({ head: false, text: await T(s) }); } }
		ok('the sections and sub-headings are the ones the chapter lists, in its order', JSON.stringify(dom.map((d) => [d.head, d.text])) === JSON.stringify(want.map((d) => [d.head, d.text])), JSON.stringify(dom.map((d) => d.text)));
		const pageName = await T('lpn_settings_page');
		ok('every sub-heading is saved with the project except Page, which is saved in this browser', dom.filter((d) => !d.head).every((d) => d.saved === (d.text === pageName ? 'browser' : 'project')), JSON.stringify(dom.filter((d) => !d.head).map((d) => d.saved)));
		const marks = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_settings_box .lpn-set-subbody .lpn-saved[data-saved-class="browser"]')).map((m) => {
			const body = m.closest('.lpn-set-subbody'), sub = body && body.previousElementSibling, row = m.closest('label, .lpn-set-row, div');
			return { sub: sub ? sub.childNodes[0].textContent.trim() : '', row: row ? row.textContent.replace(/\s+/g, ' ').trim().slice(0, 40) : '' };
		}));
		const outsidePage = marks.filter((m) => m.sub !== pageName);
		ok('outside Page, one row says Saved in this browser: Show the run progress box, in Hydraulics',
			outsidePage.length === 1 && outsidePage[0].sub === await T('lpn_settings_hydraulics') && outsidePage[0].row.indexOf(await T('lpn_settings_runbox')) === 0, JSON.stringify(outsidePage));
		await closeBox('lpn_setbox_close');
		await settle(300);
		await P.evaluate(() => document.getElementById('lpn_pane_btn').click());
		await settle(900);
		await P.evaluate(() => { const t = document.getElementById('lpn_pane_tab_settings'); if (t) { t.click(); } });
		await settle(900);
		const tab = await P.evaluate(() => ({ label: (document.getElementById('lpn_pane_tab_settings') || {}).textContent, heads: Array.from(document.querySelectorAll('#lpn_pane_settings table thead th')).map((th) => th.textContent.replace(/­/g, '').trim()) }));
		ok('Tables has a Settings tab whose columns include Setting, Category, and Value',
			tab.label.trim() === await T('lpn_tool_settings') && [await T('lpn_settings_table_setting'), await T('lpn_settings_table_category'), await T('lpn_find_value')].every((h) => tab.heads.indexOf(h) >= 0), JSON.stringify(tab));
		await P.evaluate(() => document.getElementById('lpn_pane_btn').click());
		await settle(500);

		// ---- 4. searching --------------------------------------------------------------------------
		console.log('\n4. Searching');
		await openSettings();
		const visible = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_settings_box [data-lpn-setting]')).filter((e) => e.getClientRects().length).map((e) => e.textContent.replace(/\s+/g, ' ').replace(/\s*\?\s*$/, '').trim()));
		const search = async (q) => { await P.fill('#lpn_setbox_filter', q); await settle(500); return visible(); };
		const sym = await T('lpn_settings_symbol_opacity'), bd = await T('lpn_settings_backdrop_opacity'), em = await T('lpn_settings_emitter_exponent');
		let v = await search('opacity');
		ok('opacity lists ' + sym + ' and ' + bd + ' and nothing else', JSON.stringify(v) === JSON.stringify([sym, bd]), JSON.stringify(v));
		v = await search('opacity symbol');
		ok('the two-word search narrows it to the first', JSON.stringify(v) === JSON.stringify([sym]), JSON.stringify(v));
		v = await search('sprinklers');
		ok('sprinklers lists ' + em + ', whose tip has the word and whose name does not', v.length === 1 && v[0].indexOf(em) === 0 && em.indexOf('sprinklers') < 0 && enString('lpn_settings_emitter_exponent_tip').indexOf('sprinklers') >= 0, JSON.stringify(v));
		const inHyd = await P.evaluate(() => document.getElementById('lpn_set_sub_hydraulics').nextElementSibling.querySelectorAll('[data-lpn-setting]').length);
		v = await search(await T('lpn_settings_hydraulics'));
		const hydVisible = await P.evaluate(() => Array.from(document.getElementById('lpn_set_sub_hydraulics').nextElementSibling.querySelectorAll('[data-lpn-setting]')).filter((e) => e.getClientRects().length).length);
		ok('a word that matches a heading (Hydraulics) shows every setting under it', inHyd > 5 && hydVisible === inHyd, hydVisible + ' of ' + inHyd);
		await search('');
		await closeBox('lpn_setbox_close');
		await settle(300);

		// ---- 5. changing a unit: the example -----------------------------------------------------------
		console.log('\n5. Changing a unit');
		const start = await diameter();
		ok('Pipe 10 starts as 18 in.', start.value === '18' && start.label === 'Diameter (in)', JSON.stringify(start));
		const changeUnit = async (to) => {
			await openSettings();
			await goTo(await T('lpn_view_units'));
			await P.selectOption('#lpn_u_diameter', to);
			await settle(900);
			return a.dialog();
		};
		let dlg = await changeUnit('mm');
		const head = await T('lpn_units_warn_title');
		ok('choosing mm asks the question: its title, the quantity Diameter, and the three buttons', !!dlg && dlg.text.indexOf(head) === 0 && dlg.text.indexOf(await T('lpn_field_diameter')) > 0
			&& JSON.stringify(dlg.buttons) === JSON.stringify([await T('lpn_units_nondestructive'), await T('lpn_units_destructive'), await T('lpn_cancel')]), JSON.stringify(dlg));
		await a.dialogClick(await T('lpn_cancel'));
		await settle(500);
		ok('Cancel changes nothing: the unit is still in', (await P.evaluate(() => document.getElementById('lpn_u_diameter').value)) === 'in' && (await diameter()).value === '18');
		dlg = await changeUnit('mm');
		await a.dialogClick(await T('lpn_units_destructive'));
		await settle(900);
		const wantD = (await T('lpn_status_converted')).replace('{n}', ux.d[0]).replace('{unit}', 'mm');
		ok('Destructive: the notice reads "' + wantD + '"', (await a.notice()) === wantD, await a.notice());
		let dia = await diameter();
		ok('...and Pipe 10 reads ' + ux.d[1] + ' mm', dia.value === ux.d[1] && dia.label === 'Diameter (mm)', JSON.stringify(dia));
		await undo();
		dia = await diameter();
		ok('one Undo restores the numbers and the unit: Pipe 10 is 18 in again', dia.value === '18' && dia.label === 'Diameter (in)', JSON.stringify(dia));
		dlg = await changeUnit('mm');
		await a.dialogClick(await T('lpn_units_nondestructive'));
		await settle(900);
		const wantN = (await T('lpn_status_reinterpreted')).replace('{n}', ux.n[0]).replace('{unit}', 'mm');
		ok('Non-destructive: the notice reads "' + wantN + '"', (await a.notice()) === wantN, await a.notice());
		dia = await diameter();
		ok('...and Pipe 10 reads ' + ux.n[1] + ' mm', dia.value === ux.n[1] && dia.label === 'Diameter (mm)', JSON.stringify(dia));
		await changeUnit('in');
		const back = await a.dialog();
		if (back) { await a.dialogClick(await T('lpn_units_nondestructive')); await settle(700); }
		ok('the unit is put back to in for what follows', (await diameter()).label === 'Diameter (in)');
		await closeBox('lpn_setbox_close');
		await settle(300);

		// ---- 6. Restore defaults and Start fresh ----------------------------------------------------------
		console.log('\n6. Restore defaults and Start fresh');
		await openSettings();
		const ACC = await T('lpn_settings_accuracy');
		const prefixVal = () => P.evaluate(() => {
			const row = Array.from(document.querySelectorAll('#lpn_settings_box [data-lpn-setting]')).filter((e) => (e.getAttribute('data-lpn-setting') || '').indexOf('"idPrefixes","J"') >= 0)[0];
			return row.querySelector('input').value;
		});
		const setPrefix = (v) => P.evaluate((val) => {
			const row = Array.from(document.querySelectorAll('#lpn_settings_box [data-lpn-setting]')).filter((e) => (e.getAttribute('data-lpn-setting') || '').indexOf('"idPrefixes","J"') >= 0)[0];
			const i = row.querySelector('input'); i.focus(); i.value = val;
			i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); i.blur();
		}, v);
		const accWas = await readNumber(ACC), prefWas = await prefixVal();
		await setNumber(ACC, '0.01');
		await setPrefix('JJ');
		await settle(600);
		ok('Accuracy is typed as 0.01 (it was ' + accWas + ') and the junction ID prefix as JJ (it was ' + prefWas + ')', (await readNumber(ACC)) === '0.01' && (await prefixVal()) === 'JJ');
		let r = await press(await T('calc_defaults'));
		await a.waitDialog(3000);
		let q = await a.dialog();
		ok('Restore defaults asks first, in the words the chapter summarizes', !!r && !r.off && !!q && q.text.indexOf(await T('lpn_confirm_restore_defaults')) >= 0, q && q.text.slice(0, 120));
		await dialogPress(P, q.buttons[0]);
		await settle(900);
		ok('...and both settings are back to their original values', (await readNumber(ACC)) !== '0.01' && (await prefixVal()) === prefWas, JSON.stringify([await readNumber(ACC), await prefixVal()]));
		await closeBox('lpn_setbox_close');
		await undo();
		await openSettings();
		ok('one Undo puts both typed settings back (0.01 and JJ)', (await readNumber(ACC)) === '0.01' && (await prefixVal()) === 'JJ', JSON.stringify([await readNumber(ACC), await prefixVal()]));
		await openSettings();
		r = await press(await T('lpn_settings_wipe_btn'));
		await a.waitDialog(3000);
		q = await a.dialog();
		ok('Start fresh asks first, and says what it deletes and that it cannot be undone', !!q && q.text.indexOf(await T('lpn_confirm_wipe')) >= 0, q && q.text.slice(0, 100));
		await dialogPress(P, q.buttons[q.buttons.length - 1]);
		await settle(500);
		ok('...and answering no leaves the project in place', (await U.storedProject(ctx)).nodes.length > 5);
		await closeBox('lpn_setbox_close');
		await settle(300);

		// ---- 7. in a scenario -------------------------------------------------------------------------------
		console.log('\n7. In a scenario');
		await a.menuClickSub(await T('lpn_scenario_menu'), await T('lpn_scenario_new'), 'project');
		await a.waitDialog(3000);
		await dialogPress(P, await T('lpn_dialog_ok'));
		await settle(1200);
		await openSettings();
		r = await press(await T('calc_defaults'));
		ok('in a scenario the Restore defaults button is disabled', !!r && r.off === true, JSON.stringify(r));
		await goTo(await T('lpn_view_units'));
		const note = await P.evaluate(() => document.getElementById('lpn_settings_box').innerText.replace(/\s+/g, ' '));
		ok('the Units sub-heading says units are the same in every scenario', note.indexOf(await T('lpn_settings_units_one_project')) >= 0);
		await goTo(await T('lpn_settings_defaults'));
		r = await press(await T('lpn_settings_push_btn'));
		await settle(700);
		q = await a.dialog();
		const baseName = await T('lpn_scenario_base');
		ok('Apply these new-asset values to every existing asset is refused, naming Base', !!q && q.text === (await T('lpn_push_base_only')).replace(/\{base\}/g, baseName), q && q.text);
		if (q) { await dialogPress(P, q.buttons[0]); }
		ok('no page errors (English)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.context.close().catch(() => {});

		// ---- 8. another language ----------------------------------------------------------------------------------
		console.log('\n8. A page in another language shows the same entry');
		const { Session } = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
		const b = await Session.open(browser, NAME + '-es', { locale: 'es', viewport: { width: 1400, height: 900 } });
		await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await b.goto('Looped-Network.php?lang=es');
		await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await b.openExampleCard(await b.lang('lpn_ex_net1_title'));
		await b.settle(1200);
		await openGuide(b);
		const es = await entry(b.page, 'lpn_settings_box');
		ok('the Spanish page shows the Settings entry with its six terms', !!es && TERMS.every((k, i) => es.dts[i] === esString(k)), es && JSON.stringify(es.dts.slice(0, 2)));
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
main();
