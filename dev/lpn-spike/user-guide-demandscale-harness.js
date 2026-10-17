// THE GUIDE'S DEMAND SCALING CHAPTER (Task 785).
//   node dev/lpn-spike/user-guide-demandscale-harness.js   (takes the browser lock itself)
//
// Real Chromium on Net1:
//   1. Every interface name the chapter quotes is the language file's own.
//   2. The entry has the box's paragraphs and the chapter's four terms.
//   3. The example is performed: Find (5.76, 20.11 psi at N32, 19.8 psi at 5.77, 13 solves), then
//      Run at 3 (N32 85.99 psi against 111 psi, L112 3.13 against 0.535 ft/sec, two solves).
//   4. Run lists ten links at most; a limit the demands as entered already violate is marked with a
//      warning sign; Selected junctions scales and checks only the selection.
//   5. A page in another language renders the same terms.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, plain, checkQuotes, openGuide, entry, finish } = L;
const NAME = 'user-guide-demandscale-harness';
U.takeBrowserLock(NAME, 'EC_UGDS_LOCKED');

const TERMS = ['lpn_guide_ds_run_term', 'lpn_guide_ds_find_term', 'lpn_guide_ds_scope_term', 'lpn_guide_ds_example_term'];
async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	console.log('\n1. Every interface name the chapter quotes is the language file\'s');
	checkQuotes({
		lpn_guide_ds_run_def: ['lpn_ds_multiplier', 'lpn_ds_head_lowest', 'lpn_ds_head_velocity', 'lpn_ds_col_scaled', 'lpn_ds_col_unscaled'],
		lpn_guide_ds_find_def: ['lpn_ds_minpressure', 'lpn_ff_minpressure'],
		lpn_guide_ds_scope_def: ['lpn_ds_scope_selected'],
		lpn_guide_ds_example_def: ['lpn_menu_project', 'lpn_analyze_menu', 'lpn_ds_multiplier', 'lpn_ds_run']
	});
	ok('the example names the menu row without its ellipsis', plain(enString('lpn_guide_ds_example_def')).indexOf(enString('lpn_ds_menu').replace(/…$/, '')) >= 0);
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
		const en = await entry(P, 'lpn_ds_box');
		ok('the entry holds the chapter\'s four terms after the box\'s paragraphs', !!en && TERMS.every((k, i) => en.dts[i] === enString(k)) && en.paras >= 3, en && JSON.stringify(en.dts));
		await P.evaluate(() => document.getElementById('lpn_hotkeys_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(400);

		console.log('\n3. The example');
		await a.menuClickSub(await T('lpn_analyze_menu'), await T('lpn_ds_menu'), 'project');
		await settle(1000);
		const ins = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_ds_controls input, #lpn_ds_controls select')).map((e) => e.value));
		const def = await ins();
		ok('the box opens with all junctions, 20 psi, and a demand scale of 2', JSON.stringify(def) === JSON.stringify(['all', '20', '2']), JSON.stringify(def));
		const press = async (label, until) => {
			await P.evaluate((t) => { Array.from(document.querySelectorAll('#lpn_ds_box button')).filter((x) => x.textContent.trim() === t)[0].click(); }, label);
			await a.waitFor(() => P.evaluate((u) => document.getElementById('lpn_ds_box').innerText.indexOf(u) >= 0, until), 'result ' + until, 90000);
			await settle(800);
			return P.evaluate(() => document.getElementById('lpn_ds_box').innerText.replace(/\s+/g, ' '));
		};
		const findLabel = await T('lpn_find_btn');
		const f = await press(findLabel, '5.76');
		const ex = plain(enString('lpn_guide_ds_example_def'));
		ok('Find: ' + enString('lpn_ds_found').replace('{pressure}', '20 psi').replace('{m}', '5.76'), f.indexOf(enString('lpn_ds_found').replace('{pressure}', '20 psi').replace('{m}', '5.76')) >= 0);
		ok('...the lowest pressure at 5.76 is 20.11 psi at N32, and at 5.77 it is 19.8 psi, as the chapter says', f.indexOf(enString('lpn_ds_lowest_at').replace('{m}', '5.76').replace('{pressure}', '20.11 psi').replace('{id}', 'N32')) >= 0 && f.indexOf(enString('lpn_ds_lowest_at').replace('{m}', '5.77').replace('{pressure}', '19.8 psi').replace('{id}', 'N32')) >= 0 && ['5.76', '20.11 psi', 'N32', '5.77', '19.8 psi'].every((w) => ex.indexOf(w) >= 0), f.slice(0, 300));
		ok('...in 13 solves, at the time step 0:00', f.indexOf(enString('lpn_ff_cost').replace('{solves}', '13')) >= 0 && /Time step: 0:00/.test(f) && ex.indexOf('13 solves') >= 0 && ex.indexOf('0:00') >= 0);
		await P.evaluate(() => { const i = document.querySelectorAll('#lpn_ds_controls input')[1]; i.value = '3'; i.dispatchEvent(new Event('change', { bubbles: true })); });
		const r = await press(await T('lpn_ds_run'), 'At a demand scale of 3');
		ok('Run at 3: every junction keeps 20 psi, in two solves', r.indexOf(enString('lpn_ds_scale_ok').replace('{m}', '3').replace('{pressure}', '20 psi')) >= 0 && r.indexOf(enString('lpn_ff_cost').replace('{solves}', '2')) >= 0, r.slice(0, 200));
		const tabs = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_ds_box table')).map((t) => Array.from(t.querySelectorAll('tbody tr')).map((tr) => Array.from(tr.cells).map((c) => c.textContent.trim()))));
		const n32 = tabs[0].filter((x) => x[0] === 'N32')[0], l112 = tabs[1].filter((x) => x[0] === 'L112')[0];
		ok('N32 goes from ' + n32[2] + ' to ' + n32[1] + ', and L112 from ' + l112[2] + ' to ' + l112[1] + ', as the chapter says', n32[1] === '85.99 psi' && n32[2] === '111 psi' && l112[1] === '3.13 ft/sec' && l112[2] === '0.535 ft/sec' && ['111 psi', '85.99 psi', 'L112', '0.535 ft/sec', '3.13 ft/sec'].every((w) => ex.indexOf(w) >= 0), JSON.stringify([n32, l112]));
		ok('each list holds at most ten rows, and the links not shown are counted', tabs[1].length === 10 && r.indexOf(enString('lpn_ff_rows_more_links').replace('{n}', '2')) >= 0, String(tabs[1].length));

		console.log('\n4. The warning, and the selection');
		await P.evaluate(() => { const i = document.querySelectorAll('#lpn_ds_controls input')[0]; i.value = '112'; i.dispatchEvent(new Event('change', { bubbles: true })); });
		const w = await press(findLabel, enString('lpn_ds_found_below').slice(0, 2));
		ok('with 112 psi as the limit, the answer is marked with a warning sign', w.indexOf(enString('lpn_ds_found_below').split('{pressure}')[0]) >= 0, w.slice(0, 160));
		await P.evaluate(() => { const i = document.querySelectorAll('#lpn_ds_controls input')[0]; i.value = '20'; i.dispatchEvent(new Event('change', { bubbles: true })); });
		await P.evaluate(() => document.getElementById('lpn_ds_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(300);
		const n = await P.evaluate(() => { const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="31"]')).filter((x) => x.tagName === 'circle' && x.getBoundingClientRect().width > 0)[0]; const q = e.getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2 }; });
		await P.mouse.click(n.x, n.y);
		await settle(900);
		await a.menuClickSub(await T('lpn_analyze_menu'), await T('lpn_ds_menu'), 'project');
		await settle(900);
		await P.evaluate((t) => { const s = document.querySelector('#lpn_ds_controls select'); s.value = Array.from(s.options).filter((o) => o.textContent === t)[0].value; s.dispatchEvent(new Event('change', { bubbles: true })); }, enString('lpn_ds_scope_selected'));
		const sRun = await press(await T('lpn_ds_run'), enString('lpn_ds_scaled_selected').split(':')[0]);
		ok('Selected junctions scales and checks the one selected', sRun.indexOf(enString('lpn_ds_scaled_selected').replace('{n}', '1')) >= 0, sRun.slice(0, 200));
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
		const es = await entry(b.page, 'lpn_ds_box');
		ok('the Spanish page shows the four terms', !!es && TERMS.every((k, i) => es.dts[i] === enString(k)), es && JSON.stringify(es.dts));
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
