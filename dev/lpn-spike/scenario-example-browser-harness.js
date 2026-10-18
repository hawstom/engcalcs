// THE SCENARIO EXAMPLE, OPENED THE WAY A VISITOR OPENS IT (Ida's wish list, rank 1, 2026-10-08).
//   node dev/lpn-spike/scenario-example-browser-harness.js
//
// Real Chromium, the real page. The gallery card "EPANET Net1 with scenarios" is clicked; the
// Scenario manager must show the tree (Base; Peak hour > Peak hour with main break; Max day > Max day
// plus fire flow > Max day plus fire flow with main break); each scenario is made current in the
// manager and solved by the page, and the differences a person would look for are read off the
// page's own solve: the fire pulls the hydrant junction down, the grandchild still carries the
// parent's fire demand, and the main break lowers pressure again. Both engines are held headless
// by scenario-example-harness.js; this one runs the file's own engine (EPANET).
//
// DO NOT PREFIX THIS WITH `flock`: it takes /tmp/engcalcs-browser.lock itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
if (process.env.EC_SCNEX_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_SCNEX_LOCKED: '1' }) });
		if (r.status === 75) { console.error('scenario-example-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
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
	const errors = [];
	try {
		const a = await Session.open(browser, 'T');
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		a.__url = 'Looped-Network.php';
		await page.setViewportSize({ width: 1400, height: 900 });
		await a.goto(a.__url);
		const title = await a.lang('lpn_ex_net1_scn_title');
		await a.openExampleCard(title);
		await a.settle(1500);
		await page.evaluate(() => {
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		ok('1. the card "' + title + '" opened the example', (await a.nodeCount()) > 0, String(await a.nodeCount()));

		await require('./manager-door.js').ensure(page, await a.lang('lpn_sm_menu'));
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		const smLabel = await a.lang('lpn_sm_menu');
		for (const r of await page.$$('#lpn_menu_list button.lpn-menu-row')) {
			if ((await r.textContent()).trim().replace(/^✓\s*/, '') === smLabel.trim()) { await r.click(); break; }
		}
		await a.settle(900);
		const BASE = await a.lang('lpn_scenario_base');
		const names = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_sm_tree .lpn-sm-row')).map((r) => '-'.repeat(+r.getAttribute('aria-level') - 1) + r.querySelector('.lpn-sm-name').textContent));
		// Children are listed in name order.
		const want = [BASE, '-Max day', '--Max day plus fire flow', '---Max day plus fire flow with main break', '-Peak hour', '--Peak hour with main break'];
		ok('2. the Scenario manager shows the tree', JSON.stringify(await names()) === JSON.stringify(want), JSON.stringify(await names()));

		const makeCurrent = async (name) => {
			const row = page.locator('#lpn_sm_tree .lpn-sm-row', { has: page.locator('.lpn-sm-name', { hasText: new RegExp('^' + name + '$') }) }).first();
			await row.locator('.lpn-sm-name').click({ button: 'right' });
			await a.settle(300);
			await page.evaluate(() => document.querySelector('.lpn-sm-menu button[data-sm-cmd="current"]').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })));
			await a.settle(1200);
		};
		const solveOf = async (id) => {
			await page.evaluate(() => { window.__prevSolve = EngCalcs.lpnSolveProbe(); });
			// The switch re-solves on its own; wait for a new result object.
			await a.waitFor(() => page.evaluate(() => { const r = EngCalcs.lpnSolveProbe(); return !!(r && r !== window.__prevSolve && r.pressures); }), 'a solve', 60000).catch(() => null);
			return page.evaluate((j) => { const r = EngCalcs.lpnSolveProbe(); return r && r.pressures ? { p: r.pressures[j], converged: r.converged, engine: r.engine } : null; }, id);
		};
		const P = {};
		for (const n of ['Max day', 'Max day plus fire flow', 'Max day plus fire flow with main break', 'Peak hour', 'Peak hour with main break']) {
			await page.evaluate(() => { window.__prevSolve = EngCalcs.lpnSolveProbe(); });
			await makeCurrent(n);
			const cur = await page.evaluate(() => document.getElementById('lpn_scenario_btn').textContent);
			ok('3. "' + n + '" is the open scenario', cur.indexOf(n) >= 0, cur);
			await a.settle(1500);
			P[n] = await page.evaluate(() => { const r = EngCalcs.lpnSolveProbe(); return r && r.pressures ? { j23: r.pressures['23'], j22: r.pressures['22'], converged: r.converged } : null; });
			ok('3. ...and it solved', !!P[n] && P[n].converged === true, JSON.stringify(P[n]));
		}
		const d = (x, y) => (P[x].j23 - P[y].j23);
		ok('4. the fire flow pulls junction 23 down from Max day', d('Max day', 'Max day plus fire flow') > 5 * 0.70307, String(d('Max day', 'Max day plus fire flow')));
		ok('5. the grandchild is lower again with the main break closed (it still carries the inherited fire demand)', P['Max day plus fire flow with main break'].j23 < P['Max day plus fire flow'].j23);
		ok('6. the main break also lowers junction 22 at the peak hour', P['Peak hour with main break'].j22 < P['Peak hour'].j22);
		ok('7. no page errors', errors.length === 0, errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
