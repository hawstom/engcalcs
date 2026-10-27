// THE GUIDE'S PUMP ENERGY CHAPTER (Task 785).
//   node dev/lpn-spike/user-guide-energy-harness.js   (takes the browser lock itself)
//
// Real Chromium on Net1:
//   1. Every interface name the chapter quotes is the language file's own.
//   2. The entry has the box's paragraph and the chapter's three terms.
//   3. The example is performed: calculate, Water, Reports, Pump energy; the row of L9 and the totals
//      are the chapter's; with no price every cost is zero and the report says so; with 0.12 the cost
//      is 182.
//   4. The columns are the ones the chapter lists. In a scenario the price and the Pump
//      efficiency (percent) are overrides.
//   5. A page in another language renders the same terms.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const L = require('./user-guide-chapter-lib.js');
const { U, ok, enString, esString, plain, checkQuotes, openGuide, entry, dialogPress, finish } = L;
const NAME = 'user-guide-energy-harness';
U.takeBrowserLock(NAME, 'EC_UGEN_LOCKED');

const TERMS = ['lpn_guide_en_read_term', 'lpn_guide_en_set_term', 'lpn_guide_en_example_term'];
async function main() {
	const env = require(path.join(L.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(L.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	console.log('\n1. Every interface name the chapter quotes is the language file\'s');
	checkQuotes({
		lpn_guide_en_read_def: ['lpn_menu_project', 'lpn_reports_menu', 'lpn_energy_menu', 'lpn_time_duration', 'lpn_energy_col_running', 'lpn_energy_col_effic', 'lpn_energy_col_avg_kw', 'lpn_energy_col_peak_kw', 'lpn_energy_col_kwh', 'lpn_energy_col_cost',
			'lpn_energy_total_kwh', 'lpn_energy_total_energy_cost', 'lpn_energy_peak_kw', 'lpn_energy_total_demand_charge', 'lpn_energy_total_cost'],
		lpn_guide_en_set_def: ['lpn_energy_efficiency', 'lpn_energy_price', 'lpn_energy_price_pattern', 'lpn_energy_demand_charge', 'lpn_energy_currency', 'lpn_alt_cat_energy'],
		lpn_guide_en_example_def: ['lpn_energy_menu', 'lpn_energy_price']
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
		const en = await entry(P, 'lpn_energy_box');
		ok('the entry holds the chapter\'s three terms after the box\'s paragraph', !!en && TERMS.every((k, i) => en.dts[i] === enString(k)), en && JSON.stringify(en.dts));
		await P.evaluate(() => document.getElementById('lpn_hotkeys_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await settle(400);

		console.log('\n3. The example');
		const calc = async () => { await P.evaluate(() => { EngCalcs.lpnTimeRunNow(); }); await a.waitFor(() => P.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'frames', 120000); await settle(1200); };
		const report = async () => {
			await a.menuClickSub(await T('lpn_reports_menu'), await T('lpn_energy_menu'), 'project');
			await settle(1500);
			const r = await P.evaluate(() => ({ head: Array.from(document.querySelectorAll('#lpn_energy_report table th')).map((t) => t.textContent.trim().replace(/\s*\([^)]*\)$/, '')), rows: Array.from(document.querySelectorAll('#lpn_energy_report table tbody tr')).map((r) => Array.from(r.cells).map((c) => c.textContent.trim())), text: document.getElementById('lpn_energy_report').innerText.replace(/\s+/g, ' ') }));
			await P.evaluate(() => document.getElementById('lpn_energy_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
			await settle(300);
			return r;
		};
		await calc();
		const r1 = await report();
		const ex = plain(enString('lpn_guide_en_example_def'));
		const cols = ['lpn_energy_col_pump', 'lpn_energy_col_running', 'lpn_energy_col_effic', 'lpn_energy_col_avg_kw', 'lpn_energy_col_peak_kw', 'lpn_energy_col_kwh', 'lpn_energy_col_cost'];
		const want = [];
		for (const k of cols) { want.push(await T(k)); }
		ok('the columns are Pump and the six the chapter lists, in its order', JSON.stringify(r1.head) === JSON.stringify(want), JSON.stringify(r1.head));
		const l9 = r1.rows.filter((r) => r[0] === 'L9')[0];
		ok('L9: ' + l9[1] + ' running, efficiency ' + l9[2] + ', ' + l9[3] + ' kW on average, ' + l9[4] + ' at the peak, ' + l9[5] + ' kWh, as the chapter says',
			['65.71%', '75%', '96.22 kW', '96.71 kW', '1518 kWh'].every((w) => ex.indexOf(w) >= 0) && l9[1] === '65.71' && l9[2] === '75' && l9[3] === '96.22' && l9[4] === '96.71' && l9[5] === '1518', JSON.stringify(l9));
		ok('with no price stated every cost is zero and the report says so', l9[6] === '0' && r1.text.indexOf(enString('lpn_energy_price_zero')) >= 0 && ex.indexOf('the cost is 0') >= 0, r1.text.slice(-160));
		ok('...the totals are listed below the table in the order the chapter gives', ['lpn_energy_total_kwh', 'lpn_energy_total_energy_cost', 'lpn_energy_peak_kw', 'lpn_energy_total_demand_charge', 'lpn_energy_total_cost'].map((k) => r1.text.indexOf(enString(k))).every((v, i, arr) => v >= 0 && (i === 0 || v > arr[i - 1])), r1.text.slice(60, 250));
		await a.menuClick(await T('lpn_tool_settings'), 'project');
		await settle(900);
		const setPrice = async (label, v) => P.evaluate(([l, val]) => {
			const b = Array.from(document.querySelectorAll('#lpn_setbox_index button')).filter((x) => x.textContent.trim() === 'Energy')[0]; b.click();
			const row = Array.from(document.querySelectorAll('#lpn_set_sub_energy + .lpn-set-subbody label, #lpn_set_sub_energy + .lpn-set-subbody .lpn-set-row')).filter((x) => x.textContent.replace(/\s+/g, ' ').trim().indexOf(l) === 0 && x.querySelector('input'))[0];
			const i = row.querySelector('input'); i.value = val; i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true }));
		}, [label, v]);
		await setPrice(await T('lpn_energy_price'), '0.12');
		await settle(800);
		await P.evaluate(() => document.getElementById('lpn_setbox_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await calc();
		const r2 = await report();
		const l9b = r2.rows.filter((r) => r[0] === 'L9')[0];
		ok('with 0.12 for Price of power the cost of L9 is 182, and so is the total, as the chapter says', l9b[6] === '182' && r2.text.indexOf(enString('lpn_energy_total_cost') + ' 182') >= 0 && ex.indexOf('is 182') >= 0 && ex.indexOf('0.12') >= 0, JSON.stringify(l9b));

		console.log('\n4. In a scenario');
		await a.menuClickSub(await T('lpn_scenario_menu'), await T('lpn_scenario_new'), 'project');
		await a.waitDialog(3000);
		await dialogPress(P, await T('lpn_dialog_ok'));
		await settle(1000);
		await a.menuClick(await T('lpn_tool_settings'), 'project');
		await settle(900);
		await setPrice(await T('lpn_energy_price'), '0.2');
		await settle(600);
		await setPrice(await T('lpn_energy_efficiency'), '70');
		await settle(900);
		const st = await U.storedProject(ctx);
		const blob = JSON.stringify([st.alternatives || [], st.scenarios || []]);
		ok('the price typed in a scenario is stored in the scenario, and Base keeps 0.12', blob.indexOf('0.2') >= 0 && JSON.stringify(st.settings.energy).indexOf('0.12') >= 0, blob.slice(0, 200));
		ok('the Pump efficiency (percent) typed in a scenario is stored in the scenario too, and Base keeps 75', blob.indexOf('"globalEfficiency":70') >= 0 && st.settings.energy.globalEfficiency === 75, JSON.stringify(st.settings.energy));
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
		const es = await entry(b.page, 'lpn_energy_box');
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
