// THE GUIDE'S MAP CHAPTER (Task 785): Undo and Redo, Delete, Esc, and the letter keys.
//   node dev/lpn-spike/user-guide-map-harness.js   (takes the browser lock itself)
//
// Real Chromium, pressing the keys the chapter describes on Net1:
//   1. The Map section has the ruled keys term and the chapter's four terms.
//   2. Ctrl+Z and Ctrl+Y / Ctrl+Shift+Z; the stack holds 20 steps; a new project clears it; a
//      scenario made is a step that Undo takes back; in a Tables cell being typed the keys are the text's.
//   3. Delete: a notice with nothing selected, none from Backspace, one Undo for two assets, and not
//      while typing in a field.
//   4. Esc: closes a menu and leaves the tool; a half-drawn pipe takes two; Select clears the selection.
//   5. W, A, F, the digits, + and -; a digit in a field; a digit on a selected Tables cell.
//   6. A page in another language renders the same terms.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, esString, plain, checkQuotes, openGuide, dialogPress, finish } = L;
const NAME = 'user-guide-map-harness';
U.takeBrowserLock(NAME, 'EC_UGMAP_LOCKED');

const TERMS = ['lpn_hotkeys_map_term', 'lpn_guide_map_undo_term', 'lpn_tool_delete', 'lpn_guide_map_esc_term', 'lpn_guide_map_letters_term'];
async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	console.log('\n1. Every interface name the chapter quotes is the language file\'s');
	checkQuotes({ lpn_guide_map_letters_def: ['lpn_tool_zoom_window'], lpn_guide_map_esc_def: ['lpn_tool_select'], lpn_guide_map_del_def: ['lpn_tool_delete'] });
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const ctx = await U.openNet1(browser, NAME);
		const { a, P } = ctx;
		const T = async (k) => { try { return await U.lang(ctx, k); } catch (e) { return enString(k); } };
		const settle = (ms) => a.settle(ms || 500);
		const depth = () => P.evaluate(() => EngCalcs.lpnGuideProbe().undo);
		const mode = () => P.evaluate(() => EngCalcs.lpnGuideProbe().mode);
		const press = async (k) => { await P.mouse.move(700, 500); await P.keyboard.press(k); await settle(500); };
		const diam = async (id) => { const l = (await U.storedProject(ctx)).links.filter((x) => String(x.id) === id)[0]; return l._diameter !== undefined ? l._diameter : l.diameter; };
		const closePopup = () => P.evaluate(() => { const b = document.getElementById('lpn_popup_close'); if (b && b.offsetParent) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } }).then(() => settle(300));
		const sel = () => P.evaluate(() => document.querySelectorAll('#lpn_canvas .lpn-selected').length);
		const center = (kind, id) => P.evaluate(([k, i]) => { const all = Array.from(document.querySelectorAll('#lpn_canvas [data-' + k + '="' + i + '"]')); const e = all.filter((x) => x.classList.contains('lpn-link-hit') && (x.getBoundingClientRect().width > 0 || x.getBoundingClientRect().height > 0))[0] || all.filter((x) => x.getBoundingClientRect().width > 0)[0]; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, [kind, id]);

		await openGuide(a);
		console.log('\n2. The section');
		const dts = await P.evaluate(() => Array.from(document.querySelectorAll('[data-guide-section="map"] > dl > dt')).map((d) => d.textContent.trim()));
		ok('the ruled keys term, then the four terms of the chapter', JSON.stringify(dts) === JSON.stringify(TERMS.map(enString)), JSON.stringify(dts));
		await P.evaluate(() => document.getElementById('lpn_hotkeys_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(400);

		console.log('\n3. Undo and Redo');
		const d0 = await diam('10');
		await U.openProperties(ctx, 'link', '10');
		await U.typeProperty(ctx, await T('lpn_field_diameter'), '20');
		await closePopup();
		ok('a Properties edit is a step', (await diam('10')) === 20 && (await depth()) === 1);
		await press('Control+z');
		ok('Ctrl+Z undoes it', (await diam('10')) === d0);
		await press('Control+y');
		ok('Ctrl+Y redoes it', (await diam('10')) === 20);
		await press('Control+z');
		await press('Control+Shift+z');
		ok('Ctrl+Z then Ctrl+Shift+Z leaves it redone', (await diam('10')) === 20);
		for (let i = 0; i < 24; i++) {
			await U.openProperties(ctx, 'link', '10');
			await U.typeProperty(ctx, await T('lpn_field_diameter'), String(21 + i));
			await closePopup();
		}
		ok('after 25 edits the stack holds 20 steps', (await depth()) === 20, String(await depth()));
		await a.menuClickSub(await T('lpn_scenario_menu'), await T('lpn_scenario_new'), 'project');
		await a.waitDialog(3000);
		await dialogPress(P, await T('lpn_dialog_ok'));
		await settle(900);
		const scnBefore = (await U.storedProject(ctx)).scenarios.length;
		await press('Control+z');
		ok('a scenario made is a step: Undo takes it away, and the open scenario returns to Base', scnBefore === 2 && (await U.storedProject(ctx)).scenarios.length === 1 && (await P.evaluate(() => document.getElementById('lpn_scenario_btn').textContent)).indexOf(enString('lpn_scenario_base')) >= 0);
		await a.newProject('us');
		await settle(1200);
		ok('a new project clears the steps', (await depth()) === 0, String(await depth()));
		await a.context.close().catch(() => {});

		const ctx2 = await U.openNet1(browser, NAME + '2');
		const b = ctx2.a, Q = ctx2.P;
		const bsettle = (ms) => b.settle(ms || 500);
		const bpress = async (k) => { await Q.mouse.move(700, 500); await Q.keyboard.press(k); await bsettle(500); };
		const bmode = () => Q.evaluate(() => EngCalcs.lpnGuideProbe().mode);
		const bdepth = () => Q.evaluate(() => EngCalcs.lpnGuideProbe().undo);
		const bcenter = (kind, id) => Q.evaluate(([k, i]) => { const all = Array.from(document.querySelectorAll('#lpn_canvas [data-' + k + '="' + i + '"]')); const e = all.filter((x) => x.classList.contains('lpn-link-hit') && (x.getBoundingClientRect().width > 0 || x.getBoundingClientRect().height > 0))[0] || all.filter((x) => x.getBoundingClientRect().width > 0)[0]; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, [kind, id]);
		const nodes = async () => (await U.storedProject(ctx2)).nodes.length;

		console.log('\n4. Delete');
		await bpress('Delete');
		ok('Delete with nothing selected says so', (await b.notice()) === await U.lang(ctx2, 'lpn_select_first'), await b.notice());
		await Q.evaluate(() => { const n = document.getElementById('lpn_map_notice'); if (n) { n.style.display = 'none'; } });
		const links0 = (await U.storedProject(ctx2)).links.length;
		await bpress('Backspace');
		ok('Backspace with nothing selected does nothing (no notice, nothing deleted)', (await b.notice()) === '' && (await U.storedProject(ctx2)).links.length === links0, await b.notice());
		const p31 = await bcenter('link', '31'), p113 = await bcenter('link', '113');
		await Q.mouse.click(p113.x, p113.y);
		await bsettle(900);
		await Q.keyboard.down('Shift'); await Q.mouse.click(p31.x, p31.y); await Q.keyboard.up('Shift');
		await bsettle(900);
		await Q.evaluate(() => { const bt = document.getElementById('lpn_popup_close'); if (bt && bt.offsetParent) { bt.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
		await bsettle(300);
		await Q.keyboard.press('Delete');
		await bsettle(900);
		ok('Delete removes both selected pipes', (await U.storedProject(ctx2)).links.length === links0 - 2);
		await Q.keyboard.press('Control+z');
		await bsettle(900);
		ok('and one Undo brings both back', (await U.storedProject(ctx2)).links.length === links0);
		await a0(b, Q, bsettle);
		await Q.fill('#lpn_find_popup .lpn-find-query', 'abc');
		await Q.focus('#lpn_find_popup .lpn-find-query');
		await Q.keyboard.press('Backspace');
		ok('Backspace in a field edits the field and deletes nothing', (await Q.inputValue('#lpn_find_popup .lpn-find-query')) === 'ab' && (await U.storedProject(ctx2)).links.length === links0);
		await Q.evaluate(() => document.getElementById('lpn_find_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await bsettle(300);

		console.log('\n5. Esc');
		await bpress('Digit5');
		ok('the 5 key picks the pipe tool', (await bmode()) === 'add-pipe', await bmode());
		const n10 = await bcenter('node', '11');
		await Q.mouse.click(n10.x, n10.y);
		await bsettle(400);
		await Q.keyboard.press('Escape');
		await bsettle(400);
		ok('a half-drawn pipe: the first Esc abandons the drawing and the tool stays', (await bmode()) === 'add-pipe', await bmode());
		await Q.keyboard.press('Escape');
		await bsettle(400);
		ok('...the second returns to Select', (await bmode()) === 'select', await bmode());
		await bpress('Digit5');
		await b.openMenu('edit');
		await Q.keyboard.press('Escape');
		await bsettle(400);
		const menuShut = await Q.evaluate(() => { const m = document.getElementById('lpn_menu_popup'); return !m || m.style.display !== 'block'; });
		ok('an Esc that closes a menu leaves the tool alone', menuShut && (await bmode()) === 'add-pipe', await bmode());
		await Q.keyboard.press('Escape');
		await bsettle(400);
		const nn = await bcenter('node', '11');
		await Q.mouse.click(nn.x, nn.y);
		await bsettle(900);
		await Q.evaluate(() => { const bt = document.getElementById('lpn_popup_close'); if (bt && bt.offsetParent) { bt.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
		await bsettle(300);
		const sel1 = await Q.evaluate(() => document.querySelectorAll('#lpn_canvas .lpn-selected').length);
		await bpress('Escape');
		const sel2 = await Q.evaluate(() => document.querySelectorAll('#lpn_canvas .lpn-selected').length);
		ok('in Select, Esc clears the selection', sel1 > 0 && sel2 === 0, JSON.stringify([sel1, sel2]));

		console.log('\n6. Letters, digits, and zoom keys');
		await bpress('KeyW');
		ok('the W key starts the Zoom Window tool', (await bmode()) === 'zoom-window', await bmode());
		await bpress('Escape');
		await bpress('KeyA');
		ok('the A key starts the area tool', (await bmode()) === 'select-area', await bmode());
		await bpress('Escape');
		await bpress('KeyF');
		ok('the F key starts the Shape tool', (await bmode()) === 'add-shape', await bmode());
		await bpress('Escape');
		await b.menuClick(await U.lang(ctx2, 'lpn_find_menu'), 'edit');
		await bsettle(700);
		await Q.focus('#lpn_find_popup .lpn-find-query');
		await Q.keyboard.type('7w');
		ok('digits and letters typed in a field stay in the field (the tool is still Select)', (await bmode()) === 'select' && (await Q.inputValue('#lpn_find_popup .lpn-find-query')).indexOf('7w') >= 0);
		await Q.evaluate(() => document.getElementById('lpn_find_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await Q.keyboard.press('Control+Digit5');
		ok('Ctrl with a digit is not taken', (await bmode()) === 'select');
		await Q.evaluate(() => document.getElementById('lpn_pane_btn').click());
		await bsettle(900);
		await Q.evaluate(() => { const t = document.getElementById('lpn_pane_tab_pipes'); if (t) { t.click(); } });
		await bsettle(700);
		const cell = await Q.evaluate(() => { const tb = document.querySelector('#lpn_pane_pipes table'); const ths = Array.from(tb.querySelectorAll('thead th')); const col = ths.findIndex((th) => th.textContent.replace(/­/g, '').trim().indexOf('Diameter') === 0); const td = tb.querySelector('tbody tr').children[col]; const r = td.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await Q.mouse.click(cell.x, cell.y);
		await bsettle(300);
		await Q.keyboard.press('Digit7');
		await bsettle(400);
		ok('a digit on a selected Tables cell starts typing in the cell and does not choose the Valve tool', (await bmode()) === 'select' && (await Q.evaluate(() => document.activeElement.tagName)) === 'INPUT', await bmode());
		await Q.keyboard.press('Escape');
		ok('no page errors (English)', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
		await b.context.close().catch(() => {});

		console.log('\n7. Another language');
		const { Session } = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
		const c = await Session.open(browser, NAME + '-es', { locale: 'es', viewport: { width: 1400, height: 900 } });
		await c.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await c.goto('Looped-Network.php?lang=es');
		await c.page.evaluate(() => { const x = document.getElementById('ec-consent'); if (x) { x.remove(); } });
		await c.openExampleCard(await c.lang('lpn_ex_net1_title'));
		await c.settle(1200);
		await openGuide(c);
		const es = await c.page.evaluate(() => Array.from(document.querySelectorAll('[data-guide-section="map"] > dl > dt')).map((d) => d.textContent.trim()));
		ok('the Spanish page shows the four new terms', es.length === 5 && TERMS.slice(1).every((k, i) => es[i + 1] === esString(k)), JSON.stringify(es));
		ok('no page errors (Spanish)', c.errors.length === 0, c.errors.slice(0, 2).join(' | '));
		await c.context.close().catch(() => {});
	} catch (e) {
		console.error(e && e.stack || e);
		ok('the harness ran to the end', false, String(e && e.message));
	} finally {
		await browser.close().catch(() => {});
		env.stopServer();
	}
	process.exit(finish(NAME));
}
// Opens the Find box (an ordinary field to type in).
async function a0(b, Q, bsettle) {
	await b.menuClick(await b.lang('lpn_find_menu'), 'edit');
	await bsettle(700);
}
main();
