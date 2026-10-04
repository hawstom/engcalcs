// TOM'S PATH FOR PRESSURE-DRIVEN ANALYSIS, IN A REAL CHROMIUM -- ROADMAP Task 762. Run with:
//   node dev/lpn-spike/pda-status-browser-harness.js
//
// Tom: *"The status bar counts the junctions that are short. [If the status bar is at the bottom,
// this is missing.]"* His path: Net1, Settings > Calculation > Hydraulics, Demand model = Pressure
// driven, Required pressure 150 (psi), then the Tables pane > Junctions. The count has to be ON
// SCREEN after that, in the page's own message door (#lpn_status), and still there after the
// Tables pane opens.
//
// DO NOT PREFIX THIS WITH `flock`: it takes /tmp/engcalcs-browser.lock itself.
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
if (process.env.EC_PDA_STATUS_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_PDA_STATUS_LOCKED: '1' }) });
		if (r.status === 75) { console.error('pda-status-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'A');
		const page = a.page;
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1500);
		const gear = await a.lang('lpn_tool_settings');
		await a.toolbarClick(gear);
		await page.waitForSelector('#lpn_settings_box', { state: 'visible' });
		await a.settle(500);
		const dm = await a.lang('lpn_settings_demand_model');
		const pda = await a.lang('lpn_settings_demand_model_pda');
		const reqLabel = await a.lang('lpn_settings_req_pressure');
		// The Demand model select, found by its row label.
		await page.evaluate((label) => {
			const rows = Array.from(document.querySelectorAll('#lpn_set_hydraulics_fields label'));
			const row = rows.filter((r) => (r.textContent || '').trim().indexOf(label) === 0)[0];
			row.scrollIntoView();
		}, dm);
		const sel = await page.evaluateHandle((label) => {
			const rows = Array.from(document.querySelectorAll('#lpn_set_hydraulics_fields label'));
			return rows.filter((r) => (r.textContent || '').trim().indexOf(label) === 0)[0].querySelector('select');
		}, dm);
		await sel.asElement().selectOption({ label: pda });
		await a.settle(1500);
		const req = await page.evaluateHandle((label) => {
			const rows = Array.from(document.querySelectorAll('#lpn_set_hydraulics_fields label'));
			return rows.filter((r) => (r.textContent || '').trim().indexOf(label) === 0)[0].querySelector('input');
		}, reqLabel);
		await req.asElement().fill('150');
		await req.asElement().dispatchEvent('change');
		await a.settle(4000);
		const shown = () => page.evaluate(() => {
			const e = document.getElementById('lpn_status');
			const r = e.getBoundingClientRect();
			return { text: (e.textContent || ''), display: getComputedStyle(e).display, w: r.width, h: r.height, top: r.top };
		});
		const want = (await a.lang('lpn_pda_deficit_note')).split('{n}')[0];
		const wantFull = want;
		let st = await shown();
		console.log('   status:', JSON.stringify(st));
		ok('after Required pressure 150 the count is in the status box', st.text.indexOf(want) >= 0, JSON.stringify(st.text));
		ok('...and the box is on screen', st.display !== 'none' && st.w > 0 && st.h > 0);
		await a.settle(8000);
		st = await shown();
		ok('...and it is still there eight seconds later', st.text.indexOf(want) >= 0 && st.display !== 'none', JSON.stringify(st));
		await page.screenshot({ path: (process.env.PDA_SHOTS || '/tmp') + '/pda-status-1-settings-open.png' });
		await page.keyboard.press('Escape'); await page.evaluate(() => { const b = document.getElementById('lpn_setbox_close'); if (b) { b.click(); } });
		await a.toolbarClick(await a.lang('lpn_pane_toggle'));
		await a.settle(500);
		await page.click('#lpn_pane_tab_junctions');
		await a.settle(1500);
		await page.screenshot({ path: (process.env.PDA_SHOTS || '/tmp') + '/pda-status-2-tables.png' });
		st = await shown();
		ok('with the Tables pane open on Junctions the count is still on screen', st.text.indexOf(want) >= 0 && st.display !== 'none', JSON.stringify(st));
		// Tom's "status bar": the strip along the bottom of the map, which says Flow, Pressure and Friction method.
		const strip = await page.evaluate(() => { const e = document.getElementById('lpn_map_status'); return { text: e.textContent, w: e.getBoundingClientRect().width }; });
		const wantDm = await a.lang('lpn_settings_demand_model') + ': ' + await a.lang('lpn_settings_demand_model_pda');
		ok('the bottom status strip names the demand model', strip.text.indexOf(wantDm) >= 0 && strip.w > 0, JSON.stringify(strip.text));
		ok('...and counts the short junctions (8 on Net1 at Required pressure 150 psi)',
			strip.text.indexOf(want.replace('{n}', '') + '8') >= 0, JSON.stringify(strip.text));
		const log = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_msg_log, .lpn-msglog')).map((e) => e.textContent).join(' | '));
		console.log('   message log:', JSON.stringify(log.slice(0, 300)));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall pda status checks passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
