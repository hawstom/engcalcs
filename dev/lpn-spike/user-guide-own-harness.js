// THE USER MANUAL'S OWN ENTRY (Task 785).
//   node dev/lpn-spike/user-guide-own-harness.js   (takes the browser lock itself)
//
// Real Chromium on Net1:
//   1. Every interface name the entry quotes is the language file's own.
//   2. The page has the nine sections the entry lists, in its order, under the headings it names.
//   3. The entry holds its paragraph and its example term.
//   4. Ctrl+K opens the user manual from the map with the search field focused, and does nothing while
//      a question is open.
//   5. The example: "critical" shows the Criticality analysis menu row and the three entries it names.
//   6. A page in another language renders the same entry.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, plain, checkQuotes, openGuide, entry, esEntryCheck, dialogPress, finish } = L;
const NAME = 'user-guide-own-harness';
U.takeBrowserLock(NAME, 'EC_UGOW_LOCKED');

const TERMS = ['lpn_guide_own_example_term'];
const SECTIONS = [['using', 'lpn_guide_using_heading'], ['toolbar', 'lpn_help_icons'], ['menus', 'lpn_hotkeys_menu_heading'], ['map', 'lpn_hotkeys_map_heading'],
	['snip', 'lpn_hotkeys_snip_heading'], ['tables', 'lpn_hotkeys_tables_heading'], ['boxes', 'lpn_guide_boxes_heading'], ['about', 'lpn_guide_about_heading'], ['notes', 'lpn_help_notes']];
async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	console.log('\n1. Every interface name the entry quotes is the language file\'s');
	checkQuotes({
		lpn_guide_text_hotkeys_popup: SECTIONS.map((s) => s[1]),
		lpn_guide_own_example_def: ['lpn_menu_project', 'lpn_analyze_menu', 'lpn_crit_menu', 'lpn_crit_title']
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
		const isOpen = () => P.evaluate(() => { const b = document.getElementById('lpn_hotkeys_popup'); return !!b && getComputedStyle(b).display !== 'none'; });

		console.log('\n4. Ctrl+K');
		ok('the user manual starts closed', !(await isOpen()));
		await P.keyboard.press('Control+k');
		await settle(800);
		ok('Ctrl+K from the map opens it with the search field focused', (await isOpen()) && (await P.evaluate(() => document.activeElement.id)) === 'lpn_guide_search');

		console.log('\n2. The sections');
		const secs = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_hotkeys_popup .lpn-guide-section')).map((s) => [s.dataset.guideSection, s.querySelector('h2').textContent.trim()]));
		const headings = await Promise.all(SECTIONS.map((s) => T(s[1])));
		const para = plain(enString('lpn_guide_text_hotkeys_popup'));
		const at = headings.map((h) => para.indexOf(h));
		ok('nine sections, in the order the entry lists them, under the headings it names', JSON.stringify(secs) === JSON.stringify(SECTIONS.map((s, i) => [s[0], headings[i]])) && at.every((x, i) => x >= 0 && (i === 0 || x > at[i - 1])), JSON.stringify(secs));

		console.log('\n3. The entry');
		const en = await entry(P, 'lpn_hotkeys_popup');
		ok('the user manual\'s own entry holds its paragraph and its example term', !!en && en.dts.length === 1 && en.dts[0] === enString(TERMS[0]) && en.paras >= 1, en && JSON.stringify(en.dts));

		console.log('\n5. The example');
		await P.keyboard.type('critical');
		await settle(500);
		const hit = await P.evaluate(() => ({
			rows: Array.from(document.querySelectorAll('#lpn_hotkeys_popup .lpn-guide-row')).filter((r) => r.offsetParent).map((r) => r.querySelector('.lpn-guide-name').textContent.trim()),
			entries: Array.from(document.querySelectorAll('#lpn_hotkeys_popup .lpn-guide-boxentry')).filter((r) => r.offsetParent && r.style.display !== 'none').map((r) => r.querySelector('h3').textContent.trim()),
			sections: Array.from(document.querySelectorAll('#lpn_hotkeys_popup .lpn-guide-section')).filter((r) => r.offsetParent).map((s) => s.dataset.guideSection)
		}));
		const ex = plain(enString('lpn_guide_own_example_def'));
		const entryNames = hit.entries.slice().sort();
		ok('"critical" shows one menu row and the entries the example names, this entry among them', hit.rows.length === 1 && hit.rows[0] === await T('lpn_crit_menu') && hit.entries.length === 4 && hit.entries.indexOf(await T('lpn_help_manual')) >= 0 && hit.sections.join() === 'menus,boxes' && hit.entries.filter((n) => n !== 'User manual').every((n) => ex.indexOf(n) >= 0) && ex.indexOf(hit.rows[0]) >= 0, JSON.stringify(hit));
		void entryNames;
		await P.fill('#lpn_guide_search', '');
		await settle(300);
		await P.evaluate(() => document.getElementById('lpn_hotkeys_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(500);

		console.log('\n4b. Ctrl+K while a question is open');
		await a.menuClick(await T('lpn_tool_settings'), 'project');
		await settle(900);
		await P.evaluate((t) => { const b = Array.from(document.querySelectorAll('#lpn_settings_box button')).filter((x) => x.textContent.trim() === t)[0]; b.click(); }, await T('lpn_settings_wipe_btn'));
		await settle(700);
		const asked = await P.evaluate(() => { const d = document.getElementById('lpn_dialog'); return !!d && getComputedStyle(d).display !== 'none'; });
		await P.keyboard.press('Control+k');
		await settle(600);
		ok('a question is open, and Ctrl+K does not open the user manual', asked && !(await isOpen()));
		const buttons = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).map((b) => b.textContent.trim()));
		await dialogPress(P, buttons[buttons.length - 1]);
		await settle(500);
		ok('no page errors (English)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.context.close().catch(() => {});

		console.log('\n6. Another language');
		await esEntryCheck(browser, NAME + '-1', 'lpn_hotkeys_popup', TERMS);
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
