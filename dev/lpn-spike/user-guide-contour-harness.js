// THE GUIDE'S CONTOUR PLOT CHAPTER (Task 785).
//   node dev/lpn-spike/user-guide-contour-harness.js   (takes the browser lock itself)
//
// Real Chromium on Net1:
//   1. Every interface name the chapter quotes is the language file's own.
//   2. The entry has the box's paragraph and the chapter's three terms.
//   3. In a scenario, Water, Graphs, Contour turns the plot on in that scenario only (the settings are
//      stored in it, and Base has no contour). Then in Base: the node colors become pressure, the line
//      under the key is the chapter's (9 nodes, 11 pipes, 2.5, every 5 psi), the box holds the
//      controls the chapter lists with the values it implies, and clearing Show contours keeps the
//      node colors.
//   4. A page in another language renders the same terms.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, plain, checkQuotes, openGuide, entry, dialogPress, finish } = L;
const NAME = 'user-guide-contour-harness';
U.takeBrowserLock(NAME, 'EC_UGCT_LOCKED');

const TERMS = ['lpn_guide_ct_what_term', 'lpn_guide_ct_box_term', 'lpn_guide_ct_example_term'];
async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	console.log('\n1. Every interface name the chapter quotes is the language file\'s');
	checkQuotes({
		lpn_guide_ct_what_def: ['lpn_menu_project', 'lpn_graphs_menu', 'lpn_contour_menu'],
		lpn_guide_ct_box_def: ['lpn_contour_show', 'lpn_settings_sec_symbology', 'lpn_settings_sym_node_colors', 'lpn_contour_fill_smooth', 'lpn_contour_fill_bands', 'lpn_contour_opacity', 'lpn_contour_lines', 'lpn_contour_interval', 'lpn_contour_buffer'],
		lpn_guide_ct_example_def: ['lpn_contour_show']
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
		console.log('\n2. The entry');
		const en = await entry(P, 'lpn_contour_box');
		ok('the entry holds the chapter\'s three terms after the box\'s paragraph', !!en && TERMS.every((k, i) => en.dts[i] === enString(k)), en && JSON.stringify(en.dts));
		await P.evaluate(() => document.getElementById('lpn_hotkeys_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(400);

		console.log('\n3. In a scenario, then in Base');
		const fills = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas [class*="contour"]')).map((e) => e.tagName + '.' + (e.getAttribute('class') || '')).join(' ').split(' ').filter((x) => x).length);
		const fillNames = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas [class*="contour"]')).map((e) => e.tagName + '.' + (e.getAttribute('class') || '')));
		const contour = async () => { await a.menuClickSub(await T('lpn_graphs_menu'), await T('lpn_contour_menu'), 'project'); await settle(1500); };
		const closeBox = async () => { await P.evaluate(() => document.getElementById('lpn_contour_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))); await settle(300); };
		ok('a project opens with no contour plot', (await fills()) === 0);
		await a.menuClickSub(await T('lpn_scenario_menu'), await T('lpn_scenario_new'), 'project');
		await a.waitDialog(3000);
		await dialogPress(P, await T('lpn_dialog_ok'));
		await settle(1000);
		await contour();
		const st = await U.storedProject(ctx);
		const alt = JSON.stringify(st.alternatives || []);
		ok('Graphs, Contour in a scenario turns the plot on there: the fill is drawn, and the scenario stores the settings', (await fills()) > 0 && alt.indexOf('contourFill') >= 0 && alt.indexOf('colorNodeField') >= 0, alt.slice(0, 220));
		ok('...and the project\'s own settings still have no contour', !st.settings.contourFill && !st.settings.colorNodeField, JSON.stringify([st.settings.contourFill, st.settings.colorNodeField]));
		await closeBox();
		await P.click('#lpn_scenario_btn');
		await P.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		for (const r of await P.$$('#lpn_menu_list button.lpn-menu-row')) { if ((await r.textContent()).trim().replace(/^✓\s*/, '') === await T('lpn_scenario_base')) { await r.click(); break; } }
		await settle(1200);
		const baseNames = await fillNames();
		ok('in Base there is no contour plot (only the empty layer)', baseNames.length <= 1, JSON.stringify(baseNames));
		await contour();
		const ex = plain(enString('lpn_guide_ct_example_def'));
		const note = await P.evaluate(() => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (/^\s*Contour plot:/.test(n.textContent) || n.textContent.indexOf('interpolated along') >= 0) { return n.textContent.replace(/\s+/g, ' ').trim(); } } return ''; });
		const want = enString('lpn_contour_support').replace('{n}', '9').replace('{p}', '11').replace('{k}', '2.5') + ' ' + enString('lpn_contour_support_lines').replace('{i}', '5').replace(' {u}', ' psi');
		ok('the line under the color key reads as the chapter gives it', note === want, note);
		ok('...with 9 nodes, 11 pipes, 2.5 times, and 5 psi, all in the chapter', ['9 nodes', '11 pipes', '2.5 times', '5 psi'].every((w) => ex.indexOf(w) >= 0));
		const ctl = await P.evaluate(() => ({ labels: document.getElementById('lpn_contour_body').innerText.replace(/\s+/g, ' '), vals: Array.from(document.querySelectorAll('#lpn_contour_body input, #lpn_contour_body select')).map((e) => e.type === 'checkbox' ? e.checked : e.value) }));
		const needs = ['lpn_contour_show', 'lpn_contour_fill', 'lpn_contour_opacity', 'lpn_contour_lines', 'lpn_contour_interval', 'lpn_contour_buffer'].map(enString);
		ok('the box holds the controls the chapter lists', needs.every((w) => ctl.labels.indexOf(w) >= 0), ctl.labels.slice(0, 200));
		ok('...opening on Show contours checked, pressure, Smooth, 60 percent, lines on, every 5, buffer 2.5', ctl.vals[0] === true && ctl.vals[1] === 'pressure' && ctl.vals[2] === 'smooth' && ctl.vals[3] === '60' && ctl.vals[4] === true && ctl.vals[5] === '5' && ctl.vals[7] === '2.5', JSON.stringify(ctl.vals));
		await P.evaluate(() => { const c = document.querySelector('#lpn_contour_body input[type=checkbox]'); c.click(); });
		await settle(1200);
		const after = await P.evaluate(() => ({ color: document.querySelector('#lpn_contour_body select').value, nodes: Array.from(document.querySelectorAll('#lpn_canvas circle[data-node]')).filter((c) => c.style.fill || c.getAttribute('fill')).length }));
		ok('clearing Show contours removes the fill and the lines, and the node coloring stays on pressure', (await fillNames()).length <= 1 && after.color === 'pressure', JSON.stringify(after));
		ok('no page errors (English)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.context.close().catch(() => {});

		console.log('\n4. Another language');
		const { Session } = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
		const b = await Session.open(browser, NAME + '-es', { locale: 'es', viewport: { width: 1400, height: 900 } });
		await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await b.goto('Looped-Network.php?lang=es');
		await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await b.openExampleCard(await b.lang('lpn_ex_net1_title'));
		await b.settle(1200);
		await openGuide(b);
		const es = await entry(b.page, 'lpn_contour_box');
		ok('the Spanish page shows the three terms', !!es && TERMS.every((k, i) => es.dts[i] === enString(k)), es && JSON.stringify(es.dts));
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
