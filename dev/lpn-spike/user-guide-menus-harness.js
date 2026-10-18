// THE GUIDE'S MENUS CHAPTER (Task 785).
//   node dev/lpn-spike/user-guide-menus-harness.js   (takes the browser lock itself)
//
// Real Chromium:
//   1. Every interface name the chapter quotes is the language file's own.
//   2. The Menus section has the ruled keys term and the chapter's two terms.
//   3. The list: the five menus in order and no Language menu; rows of a fly-out indented one level
//      only; no row named from the project (Base is not listed under Scenarios); a row that is
//      disabled now (Zoom to selection) is listed with no sign of it.
//   4. The keyboard: Alt+Shift+E opens Edit by the physical key; after F10 the letter alone opens a
//      menu; Esc on the bar returns focus; the pointer-only rows the chapter names have no letter and
//      the arrow keys skip them.
//   5. A page in another language renders the same terms.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, esString, plain, checkQuotes, openGuide, finish } = L;
const NAME = 'user-guide-menus-harness';
U.takeBrowserLock(NAME, 'EC_UGMN_LOCKED');

const TERMS = ['lpn_hotkeys_menu_term', 'lpn_guide_mn_kbd_term', 'lpn_guide_mn_list_term'];
async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	console.log('\n1. Every interface name the chapter quotes is the language file\'s');
	checkQuotes({
		lpn_guide_mn_kbd_def: ['lpn_tool_vertices', 'lpn_tool_zoom_window', 'lpn_screenshot_menu']
	});
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
		await settle(500);

		console.log('\n2. The section');
		const dts = await P.evaluate(() => Array.from(document.querySelectorAll('[data-guide-section="menus"] > dl > dt')).map((d) => d.textContent.trim()));
		ok('the ruled keys term, then the keyboard term, then the list term', JSON.stringify(dts) === JSON.stringify(TERMS.map(enString)), JSON.stringify(dts));

		const bar = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_menubar .lpn-menubar-item')).map((b) => (b.getAttribute('aria-label') || b.textContent).replace(/\s+/g, ' ').trim()));
		const kbd = plain(enString('lpn_guide_mn_kbd_def'));
		ok('the chapter names the menus as the menu bar does (File, Edit, Map, Water, Help); the sixth button shows the language in use', bar.length === 6 && bar.slice(0, 5).every((n) => kbd.indexOf(n) >= 0), JSON.stringify(bar));
		console.log('\n3. The list');
		const blocks = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_guide_menus > .lpn-guide-menu')).map((b) => ({
			head: b.querySelector('h3').textContent, id: b.getAttribute('data-guide-menu'),
			rows: Array.from(b.querySelectorAll('.lpn-guide-row')).map((r) => ({ n: r.querySelector('.lpn-guide-name').textContent, sub: r.classList.contains('lpn-guide-sub'), ctx: r.querySelector('.lpn-guide-name').getAttribute('data-guide-ctx') || '' })) })));
		ok('five menus in order: File, Edit, Map, Water, Help, and none for Language', JSON.stringify(blocks.map((b) => b.id)) === JSON.stringify(['lpn_menu_file', 'lpn_menu_edit', 'lpn_menu_map', 'lpn_menu_project', 'lpn_menu_help']), JSON.stringify(blocks.map((b) => b.head)));
		const all = [].concat(...blocks.map((b) => b.rows));
		ok('a fly-out row is indented under its parent, one level only', all.some((r) => r.sub) && all.filter((r) => r.sub).every((r) => r.ctx.indexOf('›') < 0), String(all.filter((r) => r.sub).length));
		const water = blocks.filter((b) => b.id === 'lpn_menu_project')[0];
		ok('no row named from the project: Base is not listed in the Water menu', water.rows.every((r) => r.n !== enString('lpn_scenario_base')));
		const zs = await T('lpn_tool_zoom_selection');
		const mapRows = blocks.filter((b) => b.id === 'lpn_menu_map')[0].rows.map((r) => r.n);
		const disabledNow = (await a.menuRows('map')).filter((r) => r.disabled).map((r) => r.label);
		ok('a row that is disabled now is listed: ' + (disabledNow[0] || ''), disabledNow.length > 0 && disabledNow.every((n) => mapRows.indexOf(n) >= 0), JSON.stringify(disabledNow));
		await P.keyboard.press('Escape');
		await settle(300);
		await P.evaluate(() => { const x = document.getElementById('lpn_hotkeys_close'); if (x) { x.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
		await settle(400);

		console.log('\n4. The keyboard');
		await P.mouse.move(700, 500);
		await P.keyboard.press('Alt+Shift+KeyE');
		await settle(600);
		const menuUp = () => P.evaluate(() => { const m = document.getElementById('lpn_menu_popup'); return !!m && m.style.display === 'block'; });
		ok('Alt+Shift+E (the physical key) opens the Edit menu', await menuUp());
		const rowsInfo = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).map((b) => ({ n: b.textContent.replace(/\s+/g, ' ').trim(), po: b.hasAttribute('data-pointer-only'), mn: b.getAttribute('data-mnemonic') || '' })));
		const pointerOnly = rowsInfo.filter((r) => r.po);
		ok('the Edit menu has pointer-only rows, and none has a letter', pointerOnly.length >= 3 && pointerOnly.every((r) => r.mn === ''), JSON.stringify(pointerOnly.map((r) => r.n)));
		const named = [await T('lpn_tool_vertices'), await T('lpn_tool_area_window'), await T('lpn_tool_area_lasso'), await T('lpn_tool_area_polygon')];
		ok('Vertices and the three area selections are among them', named.every((n) => pointerOnly.some((r) => r.n.indexOf(n) === 0)), JSON.stringify(named));
		const visited = [];
		for (let i = 0; i < rowsInfo.length + 2; i++) { visited.push(await P.evaluate(() => (document.activeElement.textContent || '').replace(/\s+/g, ' ').trim())); await P.keyboard.press('ArrowDown'); }
		ok('the arrow keys skip every pointer-only row', visited.length > 3 && !visited.some((v) => pointerOnly.some((r) => r.n === v)), JSON.stringify(visited.slice(0, 6)));
		await P.keyboard.press('Escape');
		await P.keyboard.press('Escape');
		await settle(400);
		await P.keyboard.press('F10');
		await settle(300);
		await P.keyboard.press('KeyM');
		await settle(500);
		const mapUp = await P.evaluate(() => { const b = document.getElementById('lpn_menu_map'); return b.getAttribute('aria-expanded') === 'true'; });
		ok('after F10, the letter M alone opens the Map menu', mapUp && await menuUp());
		await P.keyboard.press('Escape');
		await P.keyboard.press('Escape');
		await settle(400);
		ok('Esc on the menu bar leaves keyboard mode', !(await P.evaluate(() => document.getElementById('lpn_menubar').classList.contains('lpn-kbdmode'))));
		ok('no page errors (English)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.context.close().catch(() => {});

		console.log('\n5. Another language');
		const { Session } = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
		const b = await Session.open(browser, NAME + '-es', { locale: 'es', viewport: { width: 1400, height: 900 } });
		await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await b.goto('Looped-Network.php?lang=es');
		await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await b.openExampleCard(await b.lang('lpn_ex_net1_title'));
		await b.settle(1200);
		await openGuide(b);
		const es = await b.page.evaluate(() => Array.from(document.querySelectorAll('[data-guide-section="menus"] > dl > dt')).map((d) => d.textContent.trim()));
		ok('the Spanish page shows the same terms, the two new ones as the Spanish file has them', es.length === 3 && es[1] === esString('lpn_guide_mn_kbd_term') && es[2] === esString('lpn_guide_mn_list_term'), JSON.stringify(es));
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
