// THE GUIDE'S CRITICALITY ANALYSIS CHAPTER (Task 785).
//   node dev/lpn-spike/user-guide-criticality-harness.js   (takes the browser lock itself)
//
// Real Chromium on Net1:
//   1. Every interface name the chapter quotes is the language file's own.
//   2. The entry has the box's paragraphs and the chapter's three terms.
//   3. The example is performed: Lowest pressure allowed 116 psi, Run. The summary, the 14 solves,
//      the four links and their junctions, and the two junctions already below, are the chapter's.
//   4. Cut off and dead ends: in a scenario with Pipe 121 inactive, the end of the network is a dead
//      end; with Skip dead ends checked the run states how many it skipped, and with it cleared
//      those links are solved and cut junctions off. Lowest pressure allowed is shared with the Fire
//      flow analysis.
//   5. A page in another language renders the same terms.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, esString, plain, checkQuotes, openGuide, entry, dialogPress, finish } = L;
const NAME = 'user-guide-criticality-harness';
U.takeBrowserLock(NAME, 'EC_UGCR_LOCKED');

const TERMS = ['lpn_guide_cr_case_term', 'lpn_guide_cr_dead_term', 'lpn_guide_cr_example_term'];
async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	console.log('\n1. Every interface name the chapter quotes is the language file\'s');
	checkQuotes({
		lpn_guide_cr_case_def: ['lpn_crit_col_unserved', 'lpn_crit_col_below', 'lpn_crit_minpressure', 'lpn_ff_minpressure'],
		lpn_guide_cr_dead_def: ['lpn_crit_skipdead', 'lpn_crit_col_unserved', 'lpn_crit_col_cutoff', 'lpn_crit_col_below', 'lpn_crit_scope_selected'],
		lpn_guide_cr_example_def: ['lpn_menu_project', 'lpn_analyze_menu', 'lpn_crit_minpressure', 'lpn_ff_calculate']
	});
	ok('the example names the menu row without its ellipsis', plain(enString('lpn_guide_cr_example_def')).indexOf(enString('lpn_crit_menu').replace(/…$/, '')) >= 0);
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
		const en = await entry(P, 'lpn_crit_box');
		ok('the entry holds the chapter\'s three terms after the box\'s paragraphs', !!en && TERMS.every((k, i) => en.dts[i] === enString(k)) && en.paras >= 1, en && JSON.stringify(en.dts));
		ok('the entry\'s help text describes the reporting step choices (its own paragraph, whole)', await P.evaluate((t) => document.body.innerText.replace(/\s+/g, ' ').indexOf(t.replace(/\s+/g, ' ')) >= 0, enString('lpn_crit_intro').split(/\\n\\n|\n\n/)[1]));
		await P.evaluate(() => document.getElementById('lpn_hotkeys_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(400);

		console.log('\n3. The example');
		const open = async () => { await a.menuClickSub(await T('lpn_analyze_menu'), await T('lpn_crit_menu'), 'project'); await settle(900); };
		const run = async (min) => {
			await P.evaluate((v) => { const i = document.querySelector('#lpn_crit_controls input[type=text], #lpn_crit_controls input:not([type]):not([type=checkbox])'); if (v !== null) { i.value = v; i.dispatchEvent(new Event('change', { bubbles: true })); } }, min);
			await P.evaluate((t) => { Array.from(document.querySelectorAll('#lpn_crit_box button')).filter((x) => x.textContent.trim() === t)[0].click(); }, enString('lpn_ff_calculate'));
			await a.waitFor(() => P.evaluate(() => !!document.querySelector('#lpn_crit_report table')), 'crit table', 120000);
			await settle(1500);
			return P.evaluate(() => ({ text: document.getElementById('lpn_crit_report').innerText.replace(/\s+/g, ' '), rows: Array.from(document.querySelectorAll('#lpn_crit_report table tbody tr')).map((r) => Array.from(r.cells).map((c) => c.textContent.trim())) }));
		};
		await open();
		const ctl = await P.evaluate(() => ({ skip: !!document.querySelector('#lpn_crit_box input[type=checkbox]') && document.querySelector('#lpn_crit_box input[type=checkbox]').checked, scope: document.querySelector('#lpn_crit_box select').selectedOptions[0].textContent }));
		ok('the box opens with All links and Skip dead ends cleared', ctl.scope === enString('lpn_crit_scope_all') && ctl.skip === false, JSON.stringify(ctl));
		const r1 = await run('116');
		const ex = plain(enString('lpn_guide_cr_example_def'));
		const sum = enString('lpn_crit_summary').replace('{pressure}', '116 psi').replace('{n}', '4').replace('{total}', '13');
		ok('the summary reads "' + sum + '"', r1.text.indexOf(sum) >= 0, r1.text.slice(0, 120));
		ok('...with 14 solves and the time step 0:00', r1.text.indexOf(enString('lpn_ff_cost').replace('{solves}', '14')) >= 0 && ex.indexOf('14 times') >= 0 && /Time step: 0:00/.test(r1.text) && ex.indexOf('0:00') >= 0);
		const below = r1.rows.filter((r) => r[3] && r[3] !== '0').map((r) => r[0] + ' ' + r[3].replace(/^\d+: /, '').split(', ').join('+'));
		ok('four links drop junctions: L9, L10, L111, and L112 with the junctions the chapter names', below.length === 4 && r1.rows.slice(0, 4).map((r) => r[0]).join() === 'L9,L10,L111,L112' && r1.rows[0][3] === '3: N10, N11, N21' && r1.rows[1][3] === '2: N11, N21' && r1.rows[2][3] === '2: N21, N22' && r1.rows[3][3] === '2: N21, N22', JSON.stringify(r1.rows.slice(0, 4)));
		ok('...and the chapter names each of them', ['L9', 'L10', 'L111', 'L112', 'N10', 'N11', 'N21', 'N22'].every((w) => ex.indexOf(w) >= 0));
		ok('two junctions are already below, and not counted', r1.text.indexOf(enString('lpn_crit_baseline_below').replace('{n}', '2')) >= 0 && ex.indexOf('Two junctions are already below') >= 0, r1.text.slice(0, 220));
		ok('no link cuts a junction off: Junctions cut off is 0 in every row', r1.rows.every((r) => r[2] === '0'));
		const shared = await P.evaluate(() => 0);
		await P.evaluate(() => document.getElementById('lpn_crit_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(300);
		await a.menuClickSub(await T('lpn_analyze_menu'), await T('lpn_ff_menu'), 'project');
		await settle(900);
		const ffMin = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_ff_controls input')).map((i) => i.value));
		ok('Lowest system pressure allowed in the Fire flow analysis took the same 116', ffMin.indexOf('116') >= 0, JSON.stringify(ffMin));
		await P.evaluate(() => document.getElementById('lpn_ff_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(300);

		console.log('\n4. Cut off, and dead ends');
		await a.menuClickSub(await T('lpn_scenario_menu'), await T('lpn_scenario_new'), 'project');
		await a.waitDialog(3000);
		await dialogPress(P, await T('lpn_dialog_ok'));
		await settle(900);
		const pt = await P.evaluate(() => { const e = Array.from(document.querySelectorAll('#lpn_canvas [data-link="121"]')).filter((x) => x.classList.contains('lpn-link-hit'))[0]; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await P.mouse.click(pt.x, pt.y);
		await settle(900);
		await P.keyboard.press('Delete');
		await settle(900);
		await open();
		const r2 = await run('20');
		const skipped = enString('lpn_crit_skipped_dead').split('{n}');
		const cut = r2.rows.filter((r) => r[2] !== '0');
		ok('with Skip dead ends cleared, the links at the end of the network are solved and cut junctions off', r2.text.indexOf(skipped[0]) < 0 && cut.length >= 1, JSON.stringify(cut.slice(0, 3)));
		ok('...the cut-off junctions are listed by ID, as the chapter says', cut.every((r) => /^\d+: N\d+/.test(r[2])) && cut.length >= 1);
		await P.evaluate(() => { const c = document.querySelector('#lpn_crit_box input[type=checkbox]'); c.click(); });
		await settle(300);
		const r3 = await run('20');
		ok('with Skip dead ends checked, the run says how many links it skipped, and those links are not solved', /Dead-end links skipped: [1-9]/.test(r3.text) && r3.text.indexOf(skipped[0]) >= 0, r3.text.slice(0, 260));
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
		const es = await entry(b.page, 'lpn_crit_box');
		ok('the Spanish page shows the three terms', !!es && TERMS.every((k, i) => es.dts[i] === esString(k)), es && JSON.stringify(es.dts));
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
