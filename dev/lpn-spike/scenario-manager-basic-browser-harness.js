// THE SCENARIO MANAGER HAS A BASIC FACE (Tom, 2026-10-25; Ida's design), and a fresh browser, which is
// in Basic mode, shows its tab on the left. Real Chromium, first-view docks on:
//   1. the Scenario manager is the first tab on the left of a fresh browser (Basic mode on);
//   2. flown out, it lists the scenarios (Scenario and No. of overrides), * on the current one, with
//      New scenario, Copy scenario, Rename scenario, Delete scenario, Override manager and the Basic
//      mode tick; Rename and Delete are greyed on Base; no selector, tree, Add base or Scenarios table;
//   3. New scenario adds a row and makes it current; a click on the Base row makes Base current;
//      Rename and Delete act on the current scenario;
//   4. the Water > Scenarios "Scenario manager" row is not greyed in Basic mode;
//   5. clearing the Basic mode tick turns the box into the full manager (tree, selector, buttons)
//      in place, and ticking it again brings the list back.
//
//   node dev/lpn-spike/scenario-manager-basic-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const NAME = 'scenario-manager-basic-browser-harness';
if (process.env.EC_SMB_LOCKED !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename],
			{ stdio: 'inherit', env: Object.assign({}, process.env, { EC_SMB_LOCKED: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
const { strips } = require('./dock-boxes.js');

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1366, height: 800 } });
		const page = a.page;
		await a.context.addInitScript(() => { window.EC_DEFAULT_DOCKS = true; });
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(2500);
		const L = (k) => a.lang(k);
		console.log('--- 1. the tab ---');
		const st = await strips(page);
		ok('1.1 a fresh browser (Basic mode) shows the Scenario manager as the first tab on the left', st[0][0] === 'lpn_sm_box', JSON.stringify(st));
		ok('1.2 Basic mode is on', await page.evaluate(() => localStorage.getItem('lpn_scnbasic') === null));
		await page.click('#lpn_dock_strip_left .lpn-dock-tab[aria-controls="lpn_sm_box"]');
		await a.settle(700);
		const info = () => page.evaluate(() => {
			const q = (s) => Array.from(document.querySelectorAll(s));
			return {
				rows: q('#lpn_sm_basic_list .lpn-sm-basic-row').map((r) => Array.from(r.children).map((c) => c.textContent.trim())),
				head: q('#lpn_sm_body .lpn-sm-basic-head > span').map((c) => c.textContent.trim()),
				buttons: q('#lpn_sm_body .lpn-sm-tools button').map((b) => ({ t: b.textContent.trim(), off: b.getAttribute('aria-disabled') === 'true' })),
				tick: !!document.getElementById('lpn_sm_basic_mode') && document.getElementById('lpn_sm_basic_mode').checked,
				selector: !!document.getElementById('lpn_sm_tree_select'), tree: !!document.getElementById('lpn_sm_tree'),
				addbase: !!document.querySelector('#lpn_sm_body [data-sm-cmd="addbase"]'),
				table: document.getElementById('lpn_sm_box').classList.contains('lpn-sm-has-table'),
				shown: getComputedStyle(document.getElementById('lpn_sm_box')).display !== 'none'
			};
		});
		console.log('--- 2. the Basic face ---');
		let i = await info();
		ok('2.1 the box is out and shows a list headed Scenario and No. of overrides', i.shown && JSON.stringify(i.head) === JSON.stringify(['', await L('lpn_scenario_label'), await L('lpn_scenario_overrides')]), JSON.stringify(i.head));
		ok('2.2 Base is the one row, marked * as current', i.rows.length === 1 && i.rows[0][0] === '*' && i.rows[0][1] === await L('lpn_scenario_base'), JSON.stringify(i.rows));
		const want = [await L('lpn_scenario_new'), await L('lpn_scenario_copy'), await L('lpn_scenario_rename'), await L('lpn_scenario_delete'), await L('lpn_sm_list_overrides')];
		ok('2.3 buttons: New, Copy, Rename, Delete, Override manager', JSON.stringify(i.buttons.map((b) => b.t)) === JSON.stringify(want), JSON.stringify(i.buttons));
		ok('2.4 Copy, Rename, Delete and Override manager are greyed on Base; New is not', i.buttons[0].off === false && i.buttons.slice(1).every((b) => b.off), JSON.stringify(i.buttons));
		ok('2.5 the Basic mode tick is at the bottom and checked', i.tick);
		ok('2.6 no selector, tree, Add base or Scenarios table', !i.selector && !i.tree && !i.addbase && !i.table, JSON.stringify([i.selector, i.tree, i.addbase, i.table]));

		console.log('--- 3. the commands ---');
		a.answerPromptWith('Fig 5');
		await page.click('#lpn_sm_basic_new');
		await a.settle(1000);
		i = await info();
		ok('3.1 New scenario adds a row, and it is the current one (*)', i.rows.length === 2 && i.rows[1][1] === 'Fig 5' && i.rows[1][0] === '*' && i.rows[0][0] === '', JSON.stringify(i.rows));
		ok('3.2 Rename and Delete are enabled on it', i.buttons[2].off === false && i.buttons[3].off === false, JSON.stringify(i.buttons));
		await page.click('#lpn_sm_basic_list .lpn-sm-basic-row[data-scn] >> nth=0');
		await a.settle(700);
		i = await info();
		ok('3.3 a click on the Base row makes Base current', i.rows[0][0] === '*' && i.rows[1][0] === '', JSON.stringify(i.rows));
		ok('3.4 ...and the status strip names Base', (await page.evaluate(() => document.getElementById('lpn_scenario_btn').textContent)).indexOf(await L('lpn_scenario_base')) >= 0);
		await page.click('#lpn_sm_basic_list .lpn-sm-basic-row[data-scn] >> nth=1');
		await a.settle(700);
		a.answerPromptWith('Fig 6');
		await page.click('#lpn_sm_basic_rename');
		await a.settle(1000);
		i = await info();
		ok('3.5 Rename scenario renames the current one', i.rows.length === 2 && i.rows[1][1] === 'Fig 6', JSON.stringify(i.rows));
		await page.click('#lpn_sm_basic_copy');
		await a.settle(1000);
		i = await info();
		ok('3.6 Copy scenario adds a third row', i.rows.length === 3, JSON.stringify(i.rows));
		await page.click('#lpn_sm_basic_delete');
		await a.settle(800);
		if (await a.dialog()) { await a.dialogClick(await L('lpn_dialog_ok')); }
		await a.settle(800);
		i = await info();
		ok('3.7 Delete scenario removes the current one', i.rows.length === 2, JSON.stringify(i.rows));

		console.log('--- 4. the Water menu row ---');
		await page.mouse.click(700, 400);   // a press on the map tucks the flyout
		await a.settle(900);
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		const first = await page.evaluate(() => { const b = document.querySelector('#lpn_menu_list button.lpn-menu-row'); return { t: b.textContent.trim(), off: b.disabled || b.getAttribute('aria-disabled') === 'true' }; });
		ok('4.1 the Scenario manager row is not greyed with Basic mode on', first.t === await L('lpn_sm_menu') && !first.off, JSON.stringify(first));
		await page.keyboard.press('Escape');
		await a.settle(300);

		console.log('--- 5. unticking Basic mode turns the box into the full manager ---');
		await page.click('#lpn_dock_strip_left .lpn-dock-tab[aria-controls="lpn_sm_box"]');
		await a.settle(700);
		await page.evaluate(() => { document.getElementById('lpn_sm_basic_mode').click(); });
		await a.settle(1200);
		i = await info();
		ok('5.1 the same box now has the selector, the tree and the Scenarios table, and no Basic list', i.shown && i.selector && i.tree && i.rows.length === 0, JSON.stringify([i.shown, i.selector, i.tree, i.rows.length]));
		ok('5.2 Basic mode is stored as off', await page.evaluate(() => localStorage.getItem('lpn_scnbasic') === 'off'));
		await page.mouse.click(1260, 300);
		await a.settle(900);
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		await (await page.$$('#lpn_menu_list button.lpn-menu-row'))[2].click();
		await a.settle(1200);
		await page.click('#lpn_dock_strip_left .lpn-dock-tab[aria-controls="lpn_sm_box"]');
		await a.settle(700);
		i = await info();
		ok('5.3 ticking Basic mode again (Water menu) brings the list back in the same box', i.shown && i.rows.length === 2 && !i.tree, JSON.stringify([i.shown, i.rows.length, i.tree]));
		ok('5.4 no page errors', a.errors.length === 0, (a.errors[0] || '').slice(0, 160));
		await a.close();
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' checks passed');
	if (fails) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => process.exit(process.exitCode || 0));
