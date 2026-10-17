// THE GUIDE'S BOXES CHAPTER (Task 785): docking and tabs, what a box remembers, the phone.
//   node dev/lpn-spike/user-guide-boxes-harness.js   (takes the browser lock itself)
//
// Real Chromium. The default docks of a first visit are held by dock-default-harness.js.
//   1. The Boxes section has the chapter's three terms after Tom's two paragraphs.
//   2. The corner of the Settings box offers the dock buttons the chapter names; docking, then
//      Auto-hide, gives a tab; hovering the tab opens the box after the delay; a drag of the title
//      band floats a docked box; Alt+Down on a tab moves it.
//   3. Settings keeps its dock in its own record; Properties keeps only its dock fields, in lpn_dockbox.
//   4. At 390 px the dock buttons are gone.
//   5. A page in another language renders the same terms.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, plain, checkQuotes, openGuide, finish } = L;
const NAME = 'user-guide-boxes-harness';
U.takeBrowserLock(NAME, 'EC_UGBX_LOCKED');

const TERMS = ['lpn_guide_bx_dock_term', 'lpn_guide_bx_keep_term', 'lpn_guide_bx_phone_term'];
async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	console.log('\n1. Every interface name the chapter quotes is the language file\'s');
	checkQuotes({ lpn_guide_bx_dock_def: ['lpn_dock_left', 'lpn_dock_right', 'lpn_dock_float', 'lpn_dock_autohide'] });
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
		console.log('\n2. The section');
		const dts = await P.evaluate(() => Array.from(document.querySelectorAll('[data-guide-section="boxes"] > dl > dt')).map((d) => d.textContent.trim()));
		ok('the chapter\'s three terms follow the two paragraphs', JSON.stringify(dts) === JSON.stringify(TERMS.map(enString)), JSON.stringify(dts));
		await P.evaluate(() => document.getElementById('lpn_hotkeys_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(400);

		console.log('\n3. Docking the Settings box');
		await a.menuClick(await T('lpn_tool_settings'), 'project');
		await settle(900);
		const corner = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_settings_box .lpn-box-corner button[data-dock]')).map((b) => b.getAttribute('data-dock')));
		const labels = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_settings_box .lpn-box-corner button[data-dock]')).map((b) => b.getAttribute('aria-label') || b.title || b.textContent));
		let c = await corner();
		ok('a floating box offers the two dock buttons and not Float or Auto-hide', JSON.stringify(c) === JSON.stringify(['left', 'right']), JSON.stringify(c));
		await P.evaluate(() => document.querySelector('#lpn_settings_box .lpn-box-corner button[data-dock="right"]').click());
		await settle(700);
		c = await corner();
		ok('docked, it offers Auto-hide, the other dock button, and Float', JSON.stringify(c) === JSON.stringify(['autohide', 'left', 'float']), JSON.stringify(c));
		const boxW = await P.evaluate(() => document.getElementById('lpn_settings_box').getBoundingClientRect().width);
		const mapW = await P.evaluate(() => document.getElementById('lpn_canvas').getBoundingClientRect().width);
		ok('the box is a column beside the map, and the map is at least 320 px', boxW > 200 && mapW >= 320, JSON.stringify([boxW, mapW]));
		await P.evaluate(() => document.querySelector('#lpn_settings_box .lpn-box-corner button[data-dock="autohide"]').click());
		await settle(900);
		const tab = await P.evaluate(() => { const t = document.querySelector('.lpn-dock-tab[aria-controls="lpn_settings_box"]'); const b = document.getElementById('lpn_settings_box'); return { tab: !!t && t.getClientRects().length > 0, tucked: b.classList.contains('lpn-dock-collapsed'), open: b.style.display !== 'none' }; });
		ok('with Auto-hide, the box is a tab, tucked but still open', tab.tab && tab.tucked && tab.open, JSON.stringify(tab));
		const tp = await P.evaluate(() => { const r = document.querySelector('.lpn-dock-tab[aria-controls="lpn_settings_box"]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await P.mouse.move(tp.x, tp.y);
		await settle(60);
		const early = await P.evaluate(() => document.getElementById('lpn_settings_box').classList.contains('lpn-dock-collapsed'));
		await settle(500);
		const late = await P.evaluate(() => document.getElementById('lpn_settings_box').classList.contains('lpn-dock-collapsed'));
		ok('hovering the tab opens the box after a short delay (150 ms), not at once', early === true && late === false, JSON.stringify([early, late]));
		const rec = await P.evaluate(() => JSON.parse(localStorage.getItem('lpn_setbox') || '{}'));
		ok('Settings keeps its dock, auto-hide, and open state in its own record in this browser', rec.dock === 'right' && rec.autohide === true && rec.open === true, JSON.stringify(rec));
		// Two tabs on one side, then Alt+Up on the second.
		await P.mouse.move(100, 400);
		await settle(600);
		await a.menuClick(await T('lpn_library_menu'), 'project');
		await settle(900);
		await P.evaluate(() => document.querySelector('#lpn_library_box .lpn-box-corner button[data-dock="right"]').click());
		await settle(600);
		await P.evaluate(() => document.querySelector('#lpn_library_box .lpn-box-corner button[data-dock="autohide"]').click());
		await settle(900);
		await P.mouse.move(100, 400);
		await settle(600);
		const order = () => P.evaluate(() => Array.from(document.querySelectorAll('.lpn-dock-tab')).filter((t) => t.getClientRects().length).map((t) => t.getAttribute('aria-controls')).filter((x) => x === 'lpn_settings_box' || x === 'lpn_library_box'));
		const o1 = await order();
		const lastId = o1[o1.length - 1];
		await P.evaluate((id) => document.querySelector('.lpn-dock-tab[aria-controls="' + id + '"]').focus(), lastId);
		await P.keyboard.press('Alt+ArrowUp');
		await settle(400);
		const o2 = await order();
		ok('Alt+Up on a focused tab moves it one place up the strip', o1.length === 2 && o2[0] === lastId && o2[1] === o1[0], JSON.stringify([o1, o2]));
		await P.evaluate(() => document.querySelector('.lpn-dock-tab[aria-controls="lpn_library_box"]').click());
		await settle(600);
		await P.evaluate(() => { const b = document.querySelector('#lpn_library_box .lpn-box-corner button[data-dock="float"]'); if (b) { b.click(); } });
		await settle(500);
		await P.evaluate(() => document.getElementById('lpn_libbox_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(300);
		// Float again, dock without auto-hide, and drag by the title band.
		await P.evaluate(() => { const t = document.querySelector('.lpn-dock-tab[aria-controls="lpn_settings_box"]'); t.click(); });
		await settle(700);
		await P.evaluate(() => { const b = document.querySelector('#lpn_settings_box .lpn-box-corner button[data-dock="autohide"]'); if (b) { b.click(); } });
		await settle(700);
		c = await corner();
		const band = await P.evaluate(() => { const t = document.querySelector('#lpn_settings_box .lpn-setbox-title'); const r = t.getBoundingClientRect(); return { x: r.left + 20, y: r.top + r.height / 2 }; });
		await P.mouse.move(band.x, band.y);
		await P.mouse.down();
		await P.mouse.move(band.x - 60, band.y + 40, { steps: 6 });
		await P.mouse.up();
		await settle(700);
		const after = await corner();
		const rec2 = await P.evaluate(() => JSON.parse(localStorage.getItem('lpn_setbox') || '{}'));
		ok('dragging a docked box by its title band floats it, and its auto-hide is off', JSON.stringify(after) === JSON.stringify(['left', 'right']) && !rec2.dock && !rec2.autohide, JSON.stringify([after, rec2.dock, rec2.autohide]));
		await P.evaluate(() => document.getElementById('lpn_setbox_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(300);

		console.log('\n4. Properties keeps only its dock');
		const p10 = await P.evaluate(() => { const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="11"]')).filter((x) => x.getBoundingClientRect().width > 0)[0]; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await P.mouse.click(p10.x, p10.y);
		await settle(900);
		await P.evaluate(() => document.querySelector('#lpn_popup .lpn-box-corner button[data-dock="left"]').click());
		await settle(800);
		const shared = await P.evaluate(() => JSON.parse(localStorage.getItem('lpn_dockbox') || '{}'));
		ok('docking Properties writes lpn_dockbox, with its dock side and open flag and no position', !!shared.lpn_popup && shared.lpn_popup.dock === 'left' && shared.lpn_popup.open === true && Object.keys(shared.lpn_popup).every((k) => ['dock', 'autohide', 'dockW', 'dockOrd', 'open'].indexOf(k) >= 0), JSON.stringify(shared));
		ok('no page errors (desktop)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));

		console.log('\n5. On a phone');
		await P.setViewportSize({ width: 390, height: 800 });
		await settle(900);
		await P.evaluate(() => { const b = document.querySelector('#lpn_popup .lpn-box-corner'); return b; });
		const phone = await P.evaluate(() => ({ btns: document.querySelectorAll('#lpn_popup .lpn-box-corner button[data-dock]').length, w: document.getElementById('lpn_popup').getBoundingClientRect().width, iw: window.innerWidth }));
		ok('no dock button is offered, and the open box fills the window', phone.btns === 0 && phone.w >= phone.iw - 20, JSON.stringify(phone));
		await a.context.close().catch(() => {});

		console.log('\n6. Another language');
		const { Session } = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
		const b = await Session.open(browser, NAME + '-es', { locale: 'es', viewport: { width: 1400, height: 900 } });
		await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await b.goto('Looped-Network.php?lang=es');
		await b.page.evaluate(() => { const x = document.getElementById('ec-consent'); if (x) { x.remove(); } });
		await b.openExampleCard(await b.lang('lpn_ex_net1_title'));
		await b.settle(1200);
		await openGuide(b);
		const es = await b.page.evaluate(() => Array.from(document.querySelectorAll('[data-guide-section="boxes"] > dl > dt')).map((d) => d.textContent.trim()));
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
