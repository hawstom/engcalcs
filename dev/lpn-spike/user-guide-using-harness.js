// THE GUIDE'S "USING THE USER MANUAL" CHAPTER (Task 785): its five keys, its search, its links.
//   node dev/lpn-spike/user-guide-using-harness.js   (takes the browser lock itself)
//
// Real Chromium, pressing the keys the chapter lists:
//   1. The chapter renders first in the Guide with its two terms, and its table has the five keys.
//   2. ? opens the Guide at the toolbar button under the pointer; elsewhere it opens with the search
//      field selected; typed in a field it is a ?; and while a question is open it opens nothing.
//   3. F1 in a box opens the Guide at that box's entry. Ctrl+K opens it with the selected text, cut
//      to 80 characters, in the search field. / selects the search field. Esc closes it and returns
//      focus to where it was.
//   4. Search ignores capitals and accents.
//   5. The address follows the entry being read, and closing the Guide clears it.
//   6. The contents list's state is kept in this browser.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, plain, openGuide, dialogPress, finish } = L;
const NAME = 'user-guide-using-harness';
U.takeBrowserLock(NAME, 'EC_UGUSE_LOCKED');

async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));

	console.log('\n1. Every interface name the chapter quotes is the language file\'s');
	const keyRows = (enString('lpn_guide_keys_def').match(/<tr><td>([^<]+)<\/td>/g) || []).map((r) => r.replace(/<[^>]+>/g, ''));
	ok('the table lists ?, F1, Ctrl+K, /, and Esc', JSON.stringify(keyRows) === JSON.stringify(['?', 'F1', 'Ctrl+K', '/', 'Esc']), JSON.stringify(keyRows));

	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const ctx = await U.openNet1(browser, NAME);
		const { a, P } = ctx;
		const T = async (k) => { try { return await U.lang(ctx, k); } catch (e) { return enString(k); } };
		const settle = (ms) => a.settle(ms || 500);
		const guideOpen = () => P.evaluate(() => { const b = document.getElementById('lpn_hotkeys_popup'); return !!b && b.style.display === 'flex'; });
		const active = () => P.evaluate(() => { const e = document.activeElement; return { id: e && e.id, row: !!(e && e.closest && e.closest('#lpn_hotkeys_popup .lpn-guide-row')), tag: e && e.tagName }; });
		const closeGuide = async () => { if (await guideOpen()) { await P.evaluate(() => document.getElementById('lpn_hotkeys_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))); await settle(300); } };
		const blurAll = () => P.evaluate(() => { if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });

		// ---- 1. the chapter renders first ---------------------------------------------------------
		console.log('\n2. The chapter is first in the Guide');
		await openGuide(a);
		const ch = await P.evaluate(() => {
			const s = document.querySelector('#lpn_guide_content .lpn-guide-section');
			return { key: s.getAttribute('data-guide-section'), dts: Array.from(s.querySelectorAll('dt')).map((d) => d.textContent.trim()), rows: Array.from(s.querySelectorAll('table tr')).map((r) => r.cells[0].textContent.trim()) };
		});
		ok('Using the user manual is the first section, with the keys term and the searching term', ch.key === 'using' && ch.dts[0] === enString('lpn_guide_keys_term') && ch.dts[1] === enString('lpn_guide_use_term'), JSON.stringify(ch));
		ok('...and its table has the five keys', JSON.stringify(ch.rows) === JSON.stringify(['?', 'F1', 'Ctrl+K', '/', 'Esc']));
		await closeGuide();

		// ---- 2. the ? key ------------------------------------------------------------------------------
		console.log('\n3. The ? key');
		const btn = await P.evaluate(() => { const b = Array.from(document.querySelectorAll('#lpn_toolbar button')).filter((x) => x.getClientRects().length)[3]; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, name: b.getAttribute('aria-label') || b.title || b.textContent }; });
		await P.mouse.move(btn.x, btn.y);
		await settle(300);
		await P.keyboard.press('?');
		await settle(600);
		let st = await active();
		ok('? with the pointer over a toolbar button opens the Guide at that button\'s row', await guideOpen() && st.row, JSON.stringify(st));
		await P.keyboard.press('Escape');
		await settle(400);
		ok('Esc, with focus in the Guide, closes it', !(await guideOpen()));
		await P.mouse.move(700, 500);
		await blurAll();
		await settle(200);
		await P.keyboard.press('?');
		await settle(600);
		st = await active();
		ok('? with nothing under the pointer opens the Guide with the search field selected', await guideOpen() && st.id === 'lpn_guide_search', JSON.stringify(st));
		await closeGuide();
		await a.menuClick(await T('lpn_find_menu'), 'edit');
		await settle(800);
		await P.focus('#lpn_find_popup .lpn-find-query');
		await P.keyboard.type('a?b');
		await settle(300);
		ok('a ? typed in a field is a ?, and the Guide stays shut', !(await guideOpen()) && (await P.inputValue('#lpn_find_popup .lpn-find-query')) === 'a?b');
		// A question open: ? and Ctrl+K open nothing.
		await P.evaluate(() => document.getElementById('lpn_find_close') && document.getElementById('lpn_find_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(300);
		await a.menuClick(await T('lpn_edit_delete_network'), 'edit');
		const q = await a.waitDialog(3000);
		await P.keyboard.press('?');
		await P.keyboard.press('Control+k');
		await settle(500);
		ok('while a question is open, neither ? nor Ctrl+K opens the Guide', !!q && !(await guideOpen()));
		if (q) { await dialogPress(P, q.buttons[q.buttons.length - 1]); }
		await settle(300);
		await a.menuClick(await T('lpn_find_menu'), 'edit');
		await settle(800);
		await P.focus('#lpn_find_popup .lpn-find-query');
		// F1 inside the Find box.
		await P.keyboard.press('F1');
		await settle(800);
		const hash = await P.evaluate(() => location.hash);
		ok('F1 with focus in the Find and replace box opens the Guide at that box\'s entry (the address names it)', await guideOpen() && hash === '#guide/box-lpn_find_popup', hash);
		ok('...and the address follows the entry being read', /^#guide\//.test(hash));
		await P.keyboard.press('Escape');
		await settle(500);
		ok('Esc closes the Guide and clears the address', !(await guideOpen()) && (await P.evaluate(() => location.hash)) === '');
		st = await active();
		ok('...and focus returns to where it was: the Find box\'s query field', st.tag === 'INPUT', JSON.stringify(st));
		await P.evaluate(() => document.getElementById('lpn_find_close') && document.getElementById('lpn_find_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(300);

		// ---- 3. Ctrl+K, /, search ------------------------------------------------------------------------
		console.log('\n4. Ctrl+K, /, and search');
		const long = 'x'.repeat(5) + ' ' + 'wordy '.repeat(20);
		await P.evaluate((t) => {
			const d = document.createElement('div'); d.id = 'ugu_probe'; d.textContent = t; d.style.cssText = 'position:fixed;left:10px;top:10px;z-index:1;background:#fff';
			document.body.appendChild(d);
			const r = document.createRange(); r.selectNodeContents(d);
			const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
		}, long);
		await P.keyboard.press('Control+k');
		await settle(600);
		const v = await P.evaluate(() => document.getElementById('lpn_guide_search').value);
		ok('Ctrl+K opens the Guide with the selected text in the search field, cut to 80 characters', await guideOpen() && v.length > 60 && v.length <= 80 && long.trim().indexOf(v) === 0, String(v.length));
		await P.evaluate(() => { const d = document.getElementById('ugu_probe'); if (d) { d.remove(); } window.getSelection().removeAllRanges(); });
		await P.fill('#lpn_guide_search', '');
		await settle(200);
		await P.evaluate(() => { const h = document.querySelector('#lpn_guide_content h2'); h.tabIndex = -1; h.focus(); });
		await P.keyboard.press('/');
		await settle(300);
		st = await active();
		ok('/ with focus in the Guide selects the search field', st.id === 'lpn_guide_search', JSON.stringify(st));
		const shown = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_guide_content .lpn-guide-section')).filter((s) => s.style.display !== 'none').length);
		await P.fill('#lpn_guide_search', 'sélect');
		await settle(300);
		const withAccent = await shown();
		await P.fill('#lpn_guide_search', 'SELECT');
		await settle(300);
		const withCaps = await shown();
		await P.fill('#lpn_guide_search', 'select');
		await settle(300);
		const plainQ = await shown();
		ok('search ignores accents and capitals: sélect, SELECT, and select list the same sections', withAccent > 0 && withAccent === plainQ && withCaps === plainQ, JSON.stringify([withAccent, withCaps, plainQ]));
		await P.fill('#lpn_guide_search', '');
		await settle(200);

		// ---- 4. what is remembered --------------------------------------------------------------------------
		console.log('\n5. What the Guide remembers');
		await P.evaluate(() => document.getElementById('lpn_guide_railtoggle').click());
		await settle(400);
		const rail = await P.evaluate(() => JSON.parse(localStorage.getItem('lpn_hotkeysbox') || '{}'));
		ok('hiding the contents list is kept in this browser, with the Guide being open', rail.rail === 'closed' && rail.open === true, JSON.stringify(rail));
		await P.evaluate(() => document.getElementById('lpn_guide_railtoggle').click());
		await closeGuide();
		ok('closing the Guide is kept too', (await P.evaluate(() => JSON.parse(localStorage.getItem('lpn_hotkeysbox') || '{}'))).open === false);
		ok('no page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.context.close().catch(() => {});
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
