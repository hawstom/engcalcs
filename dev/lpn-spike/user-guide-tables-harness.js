// THE GUIDE'S TABLES CHAPTER (Task 785): the tabs, the states of a cell, fill and filters.
//   node dev/lpn-spike/user-guide-tables-harness.js   (takes the browser lock itself)
//
// Real Chromium on Net1, in the Pipes table:
//   1. The Tables section has the two ruled key terms and the chapter's three.
//   2. The tabs are the ones the chapter lists, in its order; Water, Tables opens the pane.
//   3. A selected cell: arrows move between cells; typing starts an entry that an arrow commits and
//      moves from; F2 opens an edit where the arrow moves the caret; Esc cancels.
//   4. Ctrl+D fills down and states the counts, leaving the ID column alone; Ctrl+Shift+L shows only
//      the selection.
//   5. In a scenario a cell edit is stored as an override.
//   6. A page in another language renders the same terms.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, plain, checkQuotes, openGuide, dialogPress, finish } = L;
const NAME = 'user-guide-tables-harness';
U.takeBrowserLock(NAME, 'EC_UGTBL_LOCKED');

const TERMS = ['lpn_notes_6_term', 'lpn_notes_7_term', 'lpn_guide_tbl_tabs_term', 'lpn_guide_tbl_cell_term', 'lpn_guide_tbl_fill_term'];
async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	console.log('\n1. Every interface name the chapter quotes is the language file\'s');
	checkQuotes({ lpn_guide_tbl_tabs_def: ['lpn_menu_project', 'lpn_tables_menu', 'lpn_pane_toggle'] });
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const ctx = await U.openNet1(browser, NAME);
		const { a, P } = ctx;
		const T = async (k) => { try { return await U.lang(ctx, k); } catch (e) { return enString(k); } };
		const settle = (ms) => a.settle(ms || 500);
		await openGuide(a);
		console.log('\n2. The section and the tabs');
		const dts = await P.evaluate(() => Array.from(document.querySelectorAll('[data-guide-section="tables"] > dl > dt')).map((d) => d.textContent.trim()));
		ok('the two ruled key terms, then the chapter\'s three', JSON.stringify(dts) === JSON.stringify(TERMS.map(enString)), JSON.stringify(dts));
		await P.evaluate(() => document.getElementById('lpn_hotkeys_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(400);
		await a.menuClick(await T('lpn_tables_menu'), 'project');
		await settle(900);
		const tabs = await P.evaluate(() => Array.from(document.querySelectorAll('[id^="lpn_pane_tab_"]')).filter((e) => e.getClientRects().length && !/menu/.test(e.id)).map((e) => e.textContent.trim()));
		const def = plain(enString('lpn_guide_tbl_tabs_def'));
		const list = (def.match(/left to right, are (.*?)\. The Scenarios tab/) || [])[1] || '';
		const names = list.replace(/, and /, ', ').split(', ');
		ok('Water, Tables opens the pane, and its tabs are the ones the chapter lists, in order, but for Scenarios (Basic mode is checked)', JSON.stringify(tabs) === JSON.stringify(names.filter((n) => n !== 'Scenarios')), JSON.stringify(tabs) + ' vs ' + JSON.stringify(names));
		await P.evaluate(() => { const t = document.getElementById('lpn_pane_tab_pipes'); if (t) { t.click(); } });
		await settle(700);

		console.log('\n3. The states of a cell');
		const cellAt = (r, name) => P.evaluate(([row, nm]) => {
			const tb = document.querySelector('#lpn_pane_pipes table'), ths = Array.from(tb.querySelectorAll('thead th'));
			const col = ths.findIndex((th) => th.textContent.replace(/­/g, '').trim().indexOf(nm) === 0);
			const td = tb.querySelectorAll('tbody tr')[row].children[col], b = td.getBoundingClientRect();
			return { x: b.left + b.width / 2, y: b.top + b.height / 2, col: col };
		}, [r, name]);
		const cur = () => P.evaluate(() => { const c = document.querySelector('#lpn_pane_pipes td.lpn-pane-cur'); if (!c) { return null; } const tr = c.parentNode; return { row: Array.from(tr.parentNode.children).indexOf(tr), col: Array.from(tr.children).indexOf(c) }; });
		const DIA = await T('lpn_field_diameter');
		const d0 = await cellAt(1, DIA);
		await P.mouse.click(d0.x, d0.y);
		await settle(300);
		const c0 = await cur();
		await P.keyboard.press('ArrowDown');
		await settle(300);
		const c1 = await cur();
		ok('a selected cell: the arrow key moves to the next cell', c0.row === 1 && c1.row === 2 && c1.col === c0.col, JSON.stringify([c0, c1]));
		await P.keyboard.press('ArrowUp');
		await settle(200);
		await P.keyboard.type('5');
		await settle(300);
		const ent = await P.evaluate(() => { const i = document.activeElement; return { tag: i.tagName, v: i.value, ro: i.readOnly }; });
		ok('typing a character starts an entry holding the typed text', ent.tag === 'INPUT' && ent.v === '5' && ent.ro === false, JSON.stringify(ent));
		await P.keyboard.press('Escape');
		await settle(300);
		const after = await P.evaluate(() => ({ tag: document.activeElement.tagName, ro: document.activeElement.readOnly }));
		ok('Esc cancels it and leaves the cell selected', (await cur()).row === 1 && after.ro !== false, JSON.stringify(after));
		await P.keyboard.press('F2');
		await settle(300);
		const ed = await P.evaluate(() => { const i = document.activeElement; return { ro: i.readOnly, s: i.selectionStart, e: i.selectionEnd, n: i.value.length }; });
		await P.keyboard.press('ArrowLeft');
		await settle(200);
		const ed2 = await P.evaluate(() => { const i = document.activeElement; return { s: i.selectionStart }; });
		ok('F2 opens the cell to edit, and an arrow key moves the caret and not the cell', ed.ro === false && (await cur()).row === 1 && ed2.s <= ed.e && ed2.s !== ed.e || ed.n < 1, JSON.stringify([ed, ed2, await cur()]));
		await P.keyboard.press('Escape');
		await settle(300);
		await P.keyboard.type('9');
		await P.keyboard.press('ArrowDown');
		await settle(500);
		const c3 = await cur();
		const dia1 = (await U.storedProject(ctx)).links[1];
		const dv = dia1._diameter !== undefined ? dia1._diameter : dia1.diameter;
		ok('in an entry, an arrow key commits the text and moves to the next cell', c3.row === 2 && dv === 9, JSON.stringify([c3, dv]));
		await P.keyboard.press('Control+z');
		await settle(700);

		console.log('\n4. Fill down, and the selection filter');
		const r0 = await cellAt(0, DIA), r2 = await cellAt(2, DIA), idc = await cellAt(0, await T('lpn_field_id'));
		await P.mouse.click(idc.x, idc.y);
		await P.keyboard.down('Shift'); await P.mouse.click(r2.x, r2.y); await P.keyboard.up('Shift');
		await settle(300);
		await P.keyboard.press('Control+d');
		await settle(800);
		const note = await a.notice();
		const links = (await U.storedProject(ctx)).links;
		const dd = links.slice(0, 3).map((l) => (l._diameter !== undefined ? l._diameter : l.diameter));
		ok('Ctrl+D fills down from the top row, states the counts, and leaves the ID column alone', dd[0] === dd[1] && dd[1] === dd[2] && /\(\d+\)/.test(note) && /\(0\)\.$/.test(note) && new Set(links.slice(0, 3).map((l) => l.id)).size === 3, note + ' ' + JSON.stringify(dd));
		ok('...the notice has the form the chapter describes (filled cells and cells not changed)', note.indexOf(enString('lpn_pane_filled').split('{n}')[0]) === 0 && note.indexOf(enString('lpn_pane_filled').split('{n}')[1].split('{skipped}')[0].trim().slice(0, 12)) >= 0, note);
		await P.keyboard.press('Control+z');
		await settle(700);
		const p10 = await P.evaluate(() => { const e = Array.from(document.querySelectorAll('#lpn_canvas [data-link="10"]')).filter((x) => x.classList.contains('lpn-link-hit'))[0]; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
		await P.mouse.click(p10.x, p10.y);
		await settle(800);
		await P.evaluate(() => { const bt = document.getElementById('lpn_popup_close'); if (bt && bt.offsetParent) { bt.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
		await settle(300);
		const cc = await cellAt(1, DIA);
		await P.mouse.click(cc.x, cc.y);
		await P.keyboard.press('Control+Shift+L');
		await settle(700);
		const rows = await P.evaluate(() => document.querySelectorAll('#lpn_pane_pipes tbody tr').length);
		ok('Ctrl+Shift+L shows only the selected asset', rows === 1, String(rows));
		await P.keyboard.press('Control+Shift+L');
		await settle(500);

		console.log('\n5. In a scenario');
		await a.menuClickSub(await T('lpn_scenario_menu'), await T('lpn_scenario_new'), 'project');
		await a.waitDialog(3000);
		await dialogPress(P, await T('lpn_dialog_ok'));
		await settle(1000);
		const base11 = (await U.storedProject(ctx)).links[0];
		const e0 = await cellAt(0, DIA);
		await P.mouse.click(e0.x, e0.y);
		await P.keyboard.type('33');
		await P.keyboard.press('Enter');
		await settle(900);
		const st = await U.storedProject(ctx);
		const alt = (st.alternatives || []).filter((x) => x.category === 'physical')[0];
		const baseNow = st.links[0];
		ok('a cell edit in a scenario is stored as an override, and Base keeps its value', !!alt && Object.keys(alt.values).length === 1 && Object.values(alt.values)[0].diameter === 33 && JSON.stringify(baseNow._diameter !== undefined ? baseNow._diameter : baseNow.diameter) === JSON.stringify(base11._diameter !== undefined ? base11._diameter : base11.diameter), JSON.stringify(alt && alt.values));
		ok('no page errors (English)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.context.close().catch(() => {});

		console.log('\n6. Another language');
		const { Session } = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
		const b = await Session.open(browser, NAME + '-es', { locale: 'es', viewport: { width: 1400, height: 900 } });
		await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await b.goto('Looped-Network.php?lang=es');
		await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await b.openExampleCard(await b.lang('lpn_ex_net1_title'));
		await b.settle(1200);
		await openGuide(b);
		const es = await b.page.evaluate(() => Array.from(document.querySelectorAll('[data-guide-section="tables"] > dl > dt')).map((d) => d.textContent.trim()));
		ok('the Spanish page shows the three new terms', es.length === 5 && TERMS.slice(2).every((k, i) => es[i + 2] === enString(k)), JSON.stringify(es));
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
