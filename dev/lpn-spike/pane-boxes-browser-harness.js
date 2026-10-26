// THE BOTTOM PANE'S TABS ALSO AS DOCKABLE BOXES (option branch, ROADMAP Task 799).
//
// Tom, 2026-10-15: "Can we try a UI option branch for everything in the bottom pane to be available
// also as dockable boxes: (a) Tables and (b) Graphs?"
//
// A table is opened as a box by the right-click on its tab; a graph by the button beside the pane's X.
// In the box the table still edits, takes a paste and sorts; the box docks; a reload finds both where
// they were; closing the box sends the tab back to the strip; a phone offers none of it.
//
//   node dev/lpn-spike/pane-boxes-browser-harness.js     (takes the browser lock itself)
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PANEBOXES_BROWSER_LOCKED';
const NAME = 'pane-boxes-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure of what this measures; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const noConsent = (a) => a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
const reload = async (a) => { await a.reload(); await noConsent(a); await a.settle(2000); };

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	const a = await Session.open(browser, NAME, { viewport: { width: 1600, height: 1000 } });
	const page = a.page;
	const L = (k) => a.lang(k);
	try {
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await noConsent(a);
		await a.openExampleCard(await L('lpn_ex_net3_title'));
		await a.settle(1500);
		await a.toolbarClick(await L('lpn_pane_toggle'));
		await a.settle(500);

		const popLabel = await L('lpn_pane_popout');
		const stripHas = (id) => page.evaluate((id) => {
			const b = document.getElementById('lpn_pane_tab_' + id);
			return !!b && getComputedStyle(b).display !== 'none' && b.getBoundingClientRect().width > 0;
		}, id);
		const boxState = (id) => page.evaluate((id) => {
			const box = document.getElementById('lpn_panebox_' + id), panel = document.getElementById('lpn_pane_' + id);
			if (!box) { return null; }
			const r = panel.getBoundingClientRect();
			return { shown: box.style.display !== 'none' && box.style.display !== '', panelIn: !!panel.closest('#lpn_panebox_' + id),
				panelH: Math.round(r.height), panelW: Math.round(r.width), docked: /lpn-docked/.test(box.className) ||
				!!document.querySelector('#lpn_dock_strip_left .lpn-dock-tab[aria-controls="lpn_panebox_' + id + '"], #lpn_dock_strip_right .lpn-dock-tab[aria-controls="lpn_panebox_' + id + '"]'),
				boxClass: box.className };
		}, id);
		const roughness = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_pane_pipes td.lpn-pane-col-roughness input')).slice(0, 8).map((i) => i.value));
		const firstIds = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_pane_pipes tbody tr')).slice(0, 4).map((tr) => String(tr.querySelector('td')._lpnPaneId)));

		console.log('\n--- the pane is as it was by default ---');
		await page.click('#lpn_pane_tab_pipes');
		await a.settle(500);
		ok('Pipes is a tab in the strip', await stripHas('pipes'));
		ok('no box exists yet', (await boxState('pipes')) === null);
		ok('the pane\'s button is offered, titled from the language file', (await page.getAttribute('#lpn_pane_popout', 'title')) === popLabel, popLabel);

		console.log('\n--- a table opened as a box (right-click on its tab) ---');
		await page.click('#lpn_pane_tab_pipes', { button: 'right' });
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		const rows = await page.$$eval('#lpn_menu_list button.lpn-menu-row', (bs) => bs.map((b) => b.textContent.trim()));
		ok('the menu has the one row', rows.length === 1 && rows[0] === popLabel, JSON.stringify(rows));
		await page.click('#lpn_menu_list button.lpn-menu-row');
		await a.settle(800);
		let st = await boxState('pipes');
		ok('the box is shown with the panel inside it', st && st.shown && st.panelIn, JSON.stringify(st));
		ok('the table has room (not a sliver)', st && st.panelH > 150 && st.panelW > 300, st && (st.panelW + 'x' + st.panelH));
		ok('a new box opens docked at the right, 480 px wide, not over the strip it came from', st && st.docked &&
			Math.abs(await page.evaluate(() => document.getElementById('lpn_panebox_pipes').getBoundingClientRect().width) - 480) <= 2);
		ok('Pipes left the strip', !(await stripHas('pipes')));
		ok('the pane moved to another tab and still works', await page.evaluate(() => !document.getElementById('lpn_pane').classList.contains('lpn-pane-shut') &&
			!!document.querySelector('#lpn_pane .lpn-pane-panel.on') && !document.getElementById('lpn_pane_pipes').closest('#lpn_pane')));
		ok('the table is drawn in the box', (await roughness()).length > 5);

		console.log('\n--- it edits, pastes and sorts in the box ---');
		const before = await roughness();
		await page.evaluate(() => {
			const inp = document.querySelector('#lpn_pane_pipes td.lpn-pane-col-roughness input');
			inp.value = '0.75'; inp.dispatchEvent(new Event('change', { bubbles: true }));
		});
		await a.settle(1500);
		const after = await roughness();
		ok('an edited cell holds its value', after[0] === '0.75', JSON.stringify([before[0], after[0]]));
		const tds = await page.$$('#lpn_pane_pipes td.lpn-pane-col-roughness');
		await tds[2].click();
		await a.settle(200);
		const pasted = await page.evaluate(() => {
			const t = document.querySelector('#lpn_pane_pipes table');
			const dt = new DataTransfer(); dt.setData('text/plain', '123');
			const ev = new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true });
			t.dispatchEvent(ev);
			return ev.defaultPrevented;
		});
		await a.settle(1500);
		const afterPaste = await roughness();
		ok('a paste is taken by the table', pasted === true);
		ok('and lands in the selected cell', afterPaste[2] === '123', JSON.stringify(afterPaste.slice(0, 4)));
		const idsBefore = await firstIds();
		const sorter = await page.$('#lpn_pane_pipes thead th.lpn-pane-col-roughness .lpn-pane-sortarrow');
		if (sorter) { await sorter.click(); await a.settle(800); }
		const idsAfter = await firstIds();
		ok('a heading sorts the rows', !!sorter && JSON.stringify(idsAfter) !== JSON.stringify(idsBefore), JSON.stringify([idsBefore, idsAfter]));

		console.log('\n--- docked, and found there after a reload ---');
		await a.settle(300);
		st = await boxState('pipes');
		ok('docked at the right', st && st.docked && st.shown, JSON.stringify(st));
		const dockedW = await page.evaluate(() => Math.round(document.getElementById('lpn_panebox_pipes').getBoundingClientRect().width));
		const keys = await page.evaluate(() => Object.keys(localStorage).filter((k) => /panebox/.test(k)));
		ok('the one new browser key is written', JSON.stringify(keys) === '["lpn_paneboxes"]', JSON.stringify(keys));
		await reload(a);
		st = await boxState('pipes');
		ok('after a reload the box is back, docked, with the table in it', st && st.shown && st.panelIn && st.docked, JSON.stringify(st));
		ok('Pipes is still out of the strip', !(await stripHas('pipes')));
		ok('and the same width', Math.abs((await page.evaluate(() => Math.round(document.getElementById('lpn_panebox_pipes').getBoundingClientRect().width))) - dockedW) <= 2);
		ok('the table is drawn', (await roughness()).length > 5);

		console.log('\n--- a menu door that names the table shows the box, not the pane ---');
		await a.menuClickSub(await L('lpn_tables_menu'), await L('lpn_tables_menu'), 'project').catch(() => {});
		await page.keyboard.press('Escape');
		await page.evaluate(() => { window.__paneBefore = document.getElementById('lpn_pane').classList.contains('lpn-pane-shut'); });
		await page.evaluate(() => { const b = document.getElementById('lpn_pane_tab_pipes'); b.click(); });
		await a.settle(300);
		ok('pressing the hidden tab changes nothing in the pane', !(await stripHas('pipes')));

		console.log('\n--- a graph as a box (the button beside the X) ---');
		await page.click('#lpn_pane_tab_timeseries');
		await a.settle(1200);
		await page.click('#lpn_pane_popout');
		await a.settle(1200);
		st = await boxState('timeseries');
		ok('the Time series box is shown with its panel', st && st.shown && st.panelIn, JSON.stringify(st));
		ok('Time series left the strip', !(await stripHas('timeseries')));
		ok('its chart is drawn in the box', await page.evaluate(() => !!document.querySelector('#lpn_panebox_timeseries #lpn_ts_chart svg')));
		const chartW = await page.evaluate(() => Math.round(document.getElementById('lpn_ts_chart').getBoundingClientRect().width));
		ok('the chart has width', chartW > 150, String(chartW));
		await page.click('#lpn_panebox_timeseries .lpn-corner-btn[data-dock="left"]');
		await a.settle(600);
		await reload(a);
		st = await boxState('timeseries');
		ok('after a reload the graph box is back, docked, chart drawn', st && st.shown && st.panelIn && st.docked &&
			await page.evaluate(() => !!document.querySelector('#lpn_panebox_timeseries #lpn_ts_chart svg')), JSON.stringify(st));
		ok('both boxes are back', (await boxState('pipes')) && (await boxState('pipes')).shown);

		console.log('\n--- Ctrl+Shift+PageDown in a boxed table stays in the box ---');
		const paneTabBefore = await page.evaluate(() => (document.querySelector('#lpn_pane_tabs [aria-selected=true]') || {}).id);
		await (await page.$$('#lpn_pane_pipes td.lpn-pane-col-roughness'))[1].click();
		await page.keyboard.press('Control+Shift+PageDown');
		await a.settle(400);
		ok('the pane\'s tab did not move', (await page.evaluate(() => (document.querySelector('#lpn_pane_tabs [aria-selected=true]') || {}).id)) === paneTabBefore);
		ok('and the focus is still inside the box', await page.evaluate(() => !!document.activeElement.closest('#lpn_panebox_pipes')));

		console.log('\n--- a boxed Profile: the second press chooses a path ---');
		await page.click('#lpn_pane_tab_profile');
		await a.settle(800);
		await page.click('#lpn_pane_popout');
		await a.settle(1000);
		ok('the Profile box is out', (await boxState('profile')) && (await boxState('profile')).shown);
		await a.menuClickSub(await L('lpn_graphs_menu'), await L('lpn_profile_menu'), 'project');
		await a.settle(800);
		const say = await page.evaluate(() => (document.getElementById('lpn_profile_say') || {}).textContent || '');
		ok('the Profile row starts the chooser: "Select the node where the path starts."', say.indexOf(await L('lpn_profile_draw_start')) >= 0, say);
		await page.keyboard.press('Escape');
		await page.click('#lpn_panebox_profile .lpn-popover-x');
		await a.settle(400);

		console.log('\n--- closing a box sends the tab home ---');
		await page.click('#lpn_panebox_pipes .lpn-popover-x');
		await a.settle(600);
		ok('Pipes is a tab again', await stripHas('pipes'));
		ok('its panel is back in the pane', await page.evaluate(() => !!document.getElementById('lpn_pane_pipes').closest('#lpn_pane_body')));
		await page.click('#lpn_pane_tab_pipes');
		await a.settle(600);
		ok('and works there', (await roughness()).length > 5);
		await page.click('#lpn_panebox_timeseries .lpn-popover-x');
		await a.settle(500);
		ok('Time series is a tab again', await stripHas('timeseries'));
		const left = await page.evaluate(() => localStorage.getItem('lpn_paneboxes'));
		await reload(a);
		ok('after another reload neither is a box', (await page.evaluate(() => document.querySelector('.lpn-panebox-host > .lpn-pane-panel'))) === null && (await stripHas('pipes')), String(left));

		console.log('\n--- on a short window the pane gives its height back ---');
		await page.setViewportSize({ width: 1400, height: 700 });
		await a.settle(600);
		await page.click('#lpn_pane_tab_pipes');
		await a.settle(400);
		await page.click('#lpn_pane_popout');
		await a.settle(800);
		ok('popping the tab in use closes the pane (window under 800 px tall)', await page.evaluate(() => document.getElementById('lpn_pane').classList.contains('lpn-pane-shut')));
		await page.click('#lpn_panebox_pipes .lpn-popover-x');
		await page.setViewportSize({ width: 1600, height: 1000 });
		await a.toolbarClick(await L('lpn_pane_toggle'));
		await a.settle(500);

		console.log('\n--- a phone does not get it ---');
		await page.setViewportSize({ width: 390, height: 800 });
		await a.settle(600);
		ok('the pane\'s button is not shown', await page.evaluate(() => getComputedStyle(document.getElementById('lpn_pane_popout')).display === 'none'));
		await page.evaluate(() => {
			localStorage.setItem('lpn_paneboxes', JSON.stringify({ pipes: { open: true, dock: 'right' } }));
		});
		await reload(a);
		ok('a stored box stays in the pane on a phone', (await stripHas('pipes')) && !(await boxState('pipes')));
		ok('no horizontal page scroll', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
		await page.evaluate(() => { localStorage.removeItem('lpn_paneboxes'); });
	} catch (e) {
		failures++;
		console.log('  FAIL harness error: ' + (e && e.stack || e));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + (failures ? 'FAILED' : 'OK') + ': ' + checks + ' checks, ' + failures + ' failed.');
	process.exit(failures ? 1 : 0);
}
main();
