// CLEAR OVERRIDE ON A WHOLE COLUMN IS ONE REDRAW, NOT ONE PER CELL -- IN A REAL CHROMIUM.
// Run with:
//   node dev/lpn-spike/pane-clear-override-speed-browser-harness.js
//
// Tom, 2026-10-07: *"When I used Clear override on roughness.e, my CPU fan revved up and there was
// a long delay completing the override clear. Fix that."* The cause: paneClearOverrides() ran
// afterPropertyEdit() once per element it cleared, and each of those re-rendered the open table
// (refreshPaneIfOpen()) and recounted the scenario, so clearing a column of N pipes rendered the
// table N times; and each pipe's label was written, measured and placed in turn, a forced layout
// of the whole drawing per pipe. Now each element is redrawn, every label is measured together, and
// the shared tail (count, solve, save, one table render) runs once. Measured on jasmine: 3,135 ms
// before, about 170 ms after.
//
// Asserted on EPANET Net3 (117 pipes), in a scenario, with Show scenarios on (two rows per pipe):
//   1. Fill down puts a roughness override on every pipe of the scenario.
//   2. Clear override on the whole Roughness column clears every one of them, and Base keeps its
//      own values.
//   3. The click completes within a time bound.
//   4. One undo step brings every override back.
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
if (process.env.EC_CLRSPD_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_CLRSPD_LOCKED: '1' }) });
		if (r.status === 75) { console.error('pane-clear-override-speed-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
// Generous for a loaded machine; before the fix this click took several seconds on jasmine.
const BOUND_MS = +(process.env.EC_CLRSPD_BOUND_MS || 1000);
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
		const L = async (k) => a.lang(k);
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await L('lpn_ex_net3_title'));
		await a.settle(2500);
		await page.evaluate(() => {
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		await a.toolbarClick(await L('lpn_pane_toggle'));
		await a.settle(500);
		// A scenario, as a person makes one.
		a.answerPromptWith('Peak');
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		const nw = await L('lpn_scenario_new');
		for (const r of await page.$$('#lpn_menu_list button.lpn-menu-row')) {
			if ((await r.textContent()).trim() === nw) { await r.click(); break; }
		}
		await a.settle(2000);
		await page.click('#lpn_pane_tab_pipes');
		await a.settle(800);

		// Each roughness cell of the open table as {id, value, local}.
		const cells = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_pane_pipes td.lpn-pane-col-roughness')).map((td) => {
			const inp = td.querySelector('input');
			const tr = td.closest('tr'), sc = tr && tr.querySelector('td.lpn-pane-col-scn_name');
			return { id: String(td._lpnPaneId), value: inp ? inp.value : td.textContent.trim(), local: td.classList.contains('lpn-pane-ovcell'),
				scn: sc ? sc.textContent.trim() : null };
		}));
		const baseBefore = (await cells()).map((c) => c.value);
		// 1. Type a roughness in the first row, select the column by its heading, Fill down (Ctrl+D).
		await page.evaluate(() => {
			const inp = document.querySelector('#lpn_pane_pipes td.lpn-pane-col-roughness input');
			inp.value = '0.75'; inp.dispatchEvent(new Event('change', { bubbles: true }));
		});
		await a.settle(1500);
		const menuPick = (t) => page.evaluate((t) => {
			const b = Array.from(document.querySelectorAll('.lpn-pane-ctxmenu [role=menuitem]')).filter((e) => e.textContent.trim().indexOf(t) === 0)[0];
			if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
			return !!b;
		}, t);
		const selectColumn = async () => {
			await page.click('#lpn_pane_pipes thead th.lpn-pane-col-roughness', { position: { x: 8, y: 8 } });
			await a.settle(300);
		};
		await selectColumn();
		await (await page.$$('#lpn_pane_pipes td.lpn-pane-col-roughness'))[3].click({ button: 'right' });
		await a.settle(300);
		await menuPick(await L('lpn_pane_filldown'));
		await a.settle(3000);
		let c1 = await cells();
		ok('Fill down puts an override on every pipe of the scenario', c1.length >= 117 && c1.every((c) => c.local && c.value === '0.75'),
			c1.length + ' rows, ' + c1.filter((c) => c.local).length + ' marked');

		// Show scenarios on: Base's row and Peak's row for every pipe.
		await page.click('#lpn_pane_pipes td.lpn-pane-col-roughness', { button: 'right' });
		await a.settle(300);
		await menuPick(await L('lpn_pane_scn_show'));
		await a.settle(2500);
		c1 = await cells();
		const peakName = 'Peak';
		ok('Show scenarios shows two rows per pipe', c1.length >= 234, String(c1.length));

		// 2-3. The whole column, then Clear override from its own menu, timed and counted.
		await selectColumn();
		const last = (await page.$$('#lpn_pane_pipes td.lpn-pane-col-roughness')).slice(-1)[0];
		await last.click({ button: 'right' });
		await a.settle(300);
		const res = await page.evaluate((t) => {
			const b = Array.from(document.querySelectorAll('.lpn-pane-ctxmenu [role=menuitem]')).filter((e) => e.textContent.trim().indexOf(t) === 0)[0];
			if (!b) { return { found: false }; }
			const t0 = performance.now();
			b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
			return { found: true, ms: performance.now() - t0 };
		}, await L('lpn_pane_clear_override'));
		ok('Clear override is offered on the selected column', res.found);
		ok('Clear override on ' + c1.filter((c) => c.scn === peakName).length + ' pipes completes in under ' + BOUND_MS + ' ms',
			res.found && res.ms < BOUND_MS, res.ms !== undefined ? Math.round(res.ms) + ' ms' : '');
		await a.settle(2500);
		const c2 = await cells();
		const peak = c2.filter((c) => c.scn === peakName), base = c2.filter((c) => c.scn !== peakName);
		ok('every Peak override is cleared', peak.length >= 117 && peak.every((c) => !c.local), peak.filter((c) => c.local).length + ' still marked');
		ok('Peak reads Base\'s values again, and Base kept its own',
			peak.every((c, i) => c.value === base[i].value) && base.map((c) => c.value).join() === baseBefore.join());

		// 4. One undo step brings every override back.
		await page.keyboard.press('Escape');
		await page.evaluate(() => { document.activeElement && document.activeElement.blur && document.activeElement.blur(); });
		await a.toolbarClick(await L('lpn_tool_undo'));
		await a.settle(2500);
		const c3 = (await cells()).filter((c) => c.scn === peakName);
		ok('one undo restores every override', c3.length >= 117 && c3.every((c) => c.local && c.value === '0.75'),
			c3.filter((c) => c.local).length + ' marked');
		ok('no page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? 'pane-clear-override-speed-browser-harness: ' + fails + ' FAILED' : 'pane-clear-override-speed-browser-harness: all ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
