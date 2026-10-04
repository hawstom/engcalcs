// Task 640 (Tom, 2026-10-01): Water menu holds a Graphs fly-out with Time series, Profile,
// Contour, Frequency and (Task 600) Flow balance, in EPANET's order (Tom, 2026-10-04), each opening its own bottom-pane tab. The old top-level Profile row is
// gone. Real headless Chrome, because a fly-out is hover/tap behaviour.
//
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/graphs-menu-harness.js
const path = require('path');
const env = require('../browser-pass/lib/env');
let fails = 0;
function ok(name, cond, extra) {
	if (cond) { console.log('  ok   ' + name); return; }
	fails++;
	console.log('  FAIL ' + name + (extra === undefined ? '' : '  -- ' + extra));
}
async function main() {
	let playwright;
	try { playwright = require(path.join(__dirname, '..', 'browser-pass', 'node_modules', 'playwright-core')); }
	catch (e) { console.log('playwright-core is not installed -- run: cd dev/browser-pass && npm install'); process.exit(1); }
	await env.startServer();
	const browser = await env.launchBrowser(playwright);
	try {
		const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
		await page.goto(env.pageUrl('Looped-Network.php?ec_nolog=1'), { waitUntil: 'load' });
		await page.waitForSelector('#lpn_menu_project');
		await page.waitForTimeout(300);
		const rows = () => page.$$eval('#lpn_menu_popup .lpn-menu-row', (els) => els.map((e) => e.textContent.replace('▸', '').trim()));
		const names = await page.evaluate(() => {
			const c = window.EngCalcs.pageConfig; return { g: c.lpn_graphs_menu, p: c.lpn_profile_menu, t: c.lpn_ts_menu, f: c.lpn_freq_menu, s: c.lpn_sysflow_menu };
		});
		ok('Graphs key is defined', names.g === 'Graphs', JSON.stringify(names));
		const tabs = [['profile', names.p], ['timeseries', names.t], ['frequency', names.f], ['sysflow', names.s]];
		for (const [id, label] of tabs) {
			await page.click('#lpn_menu_project');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			const top = await rows();
			ok('Water menu has a Graphs row', top.includes(names.g), top.join('|'));
			const gTip = await page.$eval('#lpn_menu_popup .lpn-menu-row:has-text("' + names.g + '")', (e) => e.getAttribute('data-bs-original-title') || e.title);
			// Tom, 2026-10-04 tip verdicts: the Graphs row's tip was deleted, so it must carry none.
			ok('Graphs row carries no tip (lpn_graphs_menu_tip deleted)', !gTip, gTip);
			ok('...and no top-level ' + label + ' row', !top.includes(label), top.join('|'));
			await page.click('#lpn_menu_popup .lpn-menu-row:has-text("' + names.g + '")');
			await page.waitForTimeout(250);
			const all = await page.$$eval('#lpn_menu_popup2 .lpn-menu-row',
				(els) => els.map((e) => e.textContent.replace('▸', '').trim()));
			const i = all.indexOf(names.t);
			// Contour joined them (Task 600): a map layer, so its row shows the plot rather than a tab.
			const contourName = await page.evaluate(() => window.EngCalcs.pageConfig.lpn_contour_menu);
			ok('fly-out lists Time series, Profile, Contour, Frequency, Flow balance in order (EPANET\'s), and nothing else after them',
				i >= 0 && all[i + 1] === names.p && all[i + 2] === contourName && all[i + 3] === names.f &&
				all[i + 4] === names.s &&
				all[i + 5] === undefined, all.join('|'));
			// Tom, 2026-10-02: no graph icon on the Profile row; the Graphs row keeps it.
			const pIcon = await page.$$eval('#lpn_menu_popup2 .lpn-menu-row', (els, p) => {
				const r = els.filter((e) => e.textContent.trim() === p).pop();
				return r ? r.querySelectorAll('.lpn-menu-icon *').length : -1;
			}, names.p);
			ok('Profile row has no icon', pIcon === 0, pIcon);
			await page.locator('#lpn_menu_popup2 .lpn-menu-row', { hasText: label }).last().click();
			await page.waitForTimeout(300);
			const sel = await page.$eval('#lpn_pane_tab_' + id, (e) => e.getAttribute('aria-selected'));
			ok(label + ' opens its tab', sel === 'true', sel);
			const open = await page.evaluate(() => { const p = document.getElementById('lpn_pane'); return !!p && getComputedStyle(p).display !== 'none'; });
			ok('...with the pane open', open);
		}
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
