// THE GUIDE'S TOOLBAR CHAPTER (Task 785).
//   node dev/lpn-spike/user-guide-toolbar-harness.js   (takes the browser lock itself)
//
// Real Chromium, at desktop width and at 390 px:
//   1. Every interface name the chapter quotes is the language file's own.
//   2. The Toolbar section has its three terms before the rows, and a row for every toolbar button.
//   3. Rows read as the chapter says: keys, Also in the menu path, a rule between groups.
//   4. Dimmed names: Calculate is dimmed while Recalculate automatically is checked, Undo with nothing
//      to undo is not, and at phone width every name but the five run controls is dimmed.
//   5. A dimmed row opens its menu row; Bottom panel has none and says so.
//   6. A second consecutive press turns Zoom to fit into Zoom Window.
//   7. A page in another language renders the same terms.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, plain, checkQuotes, openGuide, finish } = L;
const NAME = 'user-guide-toolbar-harness';
U.takeBrowserLock(NAME, 'EC_UGTB_LOCKED');

const TERMS = ['lpn_guide_tb_row_term', 'lpn_guide_tb_dim_term', 'lpn_guide_tb_two_term'];
async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	console.log('\n1. Every interface name the chapter quotes is the language file\'s');
	checkQuotes({
		lpn_guide_tb_dim_def: ['lpn_tool_undo', 'lpn_time_run', 'lpn_settings_auto_run', 'lpn_pane_toggle'],
		lpn_guide_tb_two_def: ['lpn_tool_zoom_extent', 'lpn_tool_zoom_window', 'lpn_tool_area_window']
	});
	ok('the chapter says "Also in", as the rows do', plain(enString('lpn_guide_tb_row_def')).indexOf(enString('lpn_guide_also').split('{menu}')[0].trim()) >= 0);
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const ctx = await U.openNet1(browser, NAME);
		const { a, P } = ctx;
		const T = async (k) => { try { return await U.lang(ctx, k); } catch (e) { return enString(k); } };
		const rows = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_guide_toolbar > .lpn-guide-row')).map((r) => ({
			n: r.querySelector('.lpn-guide-name').textContent, off: r.classList.contains('lpn-guide-off'),
			keys: Array.from(r.querySelectorAll('kbd')).map((k) => k.textContent), twin: (r.querySelector('.lpn-guide-twin') || { textContent: '' }).textContent })));
		await openGuide(a);
		await a.settle(500);

		console.log('\n2. The section');
		const sec = await P.evaluate(() => { const s = document.querySelector('[data-guide-section="toolbar"]'); return { dts: Array.from(s.querySelectorAll(':scope > dl > dt')).map((d) => d.textContent.trim()), firstIsDl: s.children[1].tagName === 'DL', rows: s.querySelectorAll('.lpn-guide-row').length }; });
		const buttons = await P.evaluate(() => EngCalcs.lpnGuideProbe().toolbar.length);
		ok('three terms, before the rows', JSON.stringify(sec.dts) === JSON.stringify(TERMS.map(enString)) && sec.firstIsDl, JSON.stringify(sec));
		ok('...and a row for every toolbar button', sec.rows === buttons && buttons > 20, sec.rows + ' rows, ' + buttons + ' buttons');

		console.log('\n3. Reading a row');
		let r = await rows();
		const undo = r.filter((x) => x.n === 'Undo')[0] || r.filter((x) => x.n === enString('lpn_tool_undo'))[0];
		ok('Undo shows Ctrl+Z and Also in Edit, Undo', !!undo && undo.keys.join() === 'Ctrl+Z' && undo.twin.indexOf(enString('lpn_guide_also').split('{menu}')[0].trim()) === 0 && /Undo$/.test(undo.twin), JSON.stringify(undo));
		ok('rules separate the groups', (await P.evaluate(() => document.querySelectorAll('#lpn_guide_toolbar > .lpn-guide-rule').length)) >= 3);

		console.log('\n4. Dimmed names');
		const calc = r.filter((x) => x.n === enString('lpn_time_run'))[0];
		ok('Calculate is dimmed while Recalculate automatically is checked', !!calc && calc.off === true && !!(await P.evaluate(() => EngCalcs.pageConfig)) && (await P.evaluate(() => document.getElementById('lpn_guide_dimnote').hidden)) === false, JSON.stringify(calc));
		const undoBtn = await P.evaluate((n) => { const b = Array.from(document.querySelectorAll('#lpn_toolbar button')).filter((x) => (x.getAttribute('aria-label') || x.title || x.textContent).indexOf(n) >= 0)[0]; return { shown: b.getClientRects().length > 0, disabled: b.disabled || b.getAttribute('aria-disabled') === 'true' }; }, await T('lpn_tool_undo'));
		ok('Undo is on screen, and its row is not dimmed', undo.off === false && undoBtn.shown, JSON.stringify(undoBtn));
		await P.setViewportSize({ width: 390, height: 800 });
		await a.settle(900);
		r = await rows();
		const live = r.filter((x) => !x.off).map((x) => x.n);
		ok('at 390 px only the five run controls are not dimmed', live.length === 5 && !r.filter((x) => x.off).some((x) => !x.twin && x.n !== enString('lpn_pane_toggle')), JSON.stringify(live));
		ok('...every dimmed name but Bottom panel has a menu row to open', r.filter((x) => x.off && !x.twin).map((x) => x.n).join() === enString('lpn_pane_toggle'));

		console.log('\n5. A dimmed row');
		await P.evaluate(() => { const row = Array.from(document.querySelectorAll('#lpn_guide_toolbar > .lpn-guide-row')).filter((x) => x.querySelector('.lpn-guide-name').textContent === 'Undo')[0]; row.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); });
		await a.settle(700);
		ok('clicking Undo opens its menu row (the Edit menu is up)', await P.evaluate(() => { const m = document.getElementById('lpn_menu_popup'); return !!m && m.style.display !== 'none' && m.getClientRects().length > 0; }));
		await P.keyboard.press('Escape');
		await a.settle(300);
		await P.evaluate((n) => { const row = Array.from(document.querySelectorAll('#lpn_guide_toolbar > .lpn-guide-row')).filter((x) => x.querySelector('.lpn-guide-name').textContent === n)[0]; row.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }, enString('lpn_pane_toggle'));
		await a.settle(500);
		const note = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_guide_toolbar .lpn-guide-nopoint')).map((n) => n.textContent));
		ok('Bottom panel says that the control is not on screen', note.length === 1 && note[0] === enString('lpn_guide_not_shown'), JSON.stringify(note));
		await P.setViewportSize({ width: 1400, height: 900 });
		await a.settle(700);

		console.log('\n6. A corner triangle');
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		const zoomName = enString('lpn_tool_zoom_extent');
		const pressZoom = async () => {
			const pt = await P.evaluate((n) => { const b = Array.from(document.querySelectorAll('#lpn_toolbar button')).filter((x) => x.getClientRects().length && ((x.getAttribute('aria-label') || '') + x.title + x.textContent).indexOf(n) >= 0)[0]; const q = b.getBoundingClientRect(); return { x: q.left + q.width / 3, y: q.top + q.height / 3 }; }, zoomName);
			await P.mouse.click(pt.x, pt.y);
			await a.settle(500);
			return P.evaluate(() => { const b = document.querySelector('#lpn_toolbar [data-tool="zoom-window"]'); return b ? (b.getAttribute('aria-label') || b.title || b.textContent).replace(/\s+/g, ' ').trim() : null; });
		};
		await P.keyboard.press('Escape');
		const first = await pressZoom();
		ok('the first press leaves the button as Zoom to fit', !!first && first.indexOf(enString('lpn_tool_zoom_window')) < 0, first);
		await a.settle(700);
		const second = await pressZoom();
		ok('a second press turns it into Zoom Window', !!second && second.indexOf(enString('lpn_tool_zoom_window')) >= 0, second);
		ok('no page errors (English)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.context.close().catch(() => {});

		console.log('\n7. Another language');
		const { Session } = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
		const b = await Session.open(browser, NAME + '-es', { locale: 'es', viewport: { width: 1400, height: 900 } });
		await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await b.goto('Looped-Network.php?lang=es');
		await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await b.openExampleCard(await b.lang('lpn_ex_net1_title'));
		await b.settle(1200);
		await openGuide(b);
		const es = await b.page.evaluate(() => Array.from(document.querySelectorAll('[data-guide-section="toolbar"] > dl > dt')).map((d) => d.textContent.trim()));
		ok('the Spanish page shows the three terms', JSON.stringify(es) === JSON.stringify(TERMS.map(enString)), JSON.stringify(es));
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
