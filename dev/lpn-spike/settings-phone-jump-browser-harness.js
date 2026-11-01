// THE PHONE'S SETTINGS BAR: TAP IT, TAP A SECTION, LAND ON THAT SECTION, IN A REAL CHROMIUM. Run with:
//   node dev/lpn-spike/settings-phone-jump-browser-harness.js   (takes the browser lock itself)
//
// Tom, 2026-10-28, on the bar under the search field that is the section heading on a phone: "It doesn't work. I don't
// get what I tap. I tested many times. When I tap Asset, I get ID prefixes in the dropdown." The in-content heading is
// hidden on a phone, so the section's first sub-heading sits at the very top of the pane and the scroll-spy named it
// (ID prefixes) a moment after the jump named the section (Asset). At 390 x 844 with touch (hasTouch, isMobile), tap
// the bar, tap each row of the list in turn (sections and sub-headings, from several starting places):
//   P1  the list closes and the bar reads the words of the row tapped, and STILL reads them after the pane has settled;
//   P2  what was tapped is at the top of the content pane (a section: its top edge; a sub-heading: its own top);
//   P3  scrolling the pane by hand afterwards makes the bar follow the scroll again (the spy is not dead);
//   P4  no page errors.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const NAME = 'settings-phone-jump-browser-harness';
if (process.env.EC_PHONEJUMP_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_PHONEJUMP_LOCKED: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let checks = 0, fails = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1500);
		await page.evaluate(() => {
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		await a.menuClick(await a.lang('lpn_tool_settings'), 'project');
		await page.waitForSelector('#lpn_settings_box', { state: 'visible' });
		await a.settle(800);
		const rows = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_setbox_index .lpn-setbox-link'))
			.map((b) => ({ sec: b.getAttribute('data-sec'), sub: b.getAttribute('data-sub'), text: b.textContent })));
		ok('the list has rows', rows.length > 5, rows.length);
		ok('the bar is on screen at phone width', await page.evaluate(() => { const j = document.getElementById('lpn_setbox_jump'); return !!j && j.getBoundingClientRect().height > 0; }));
		const barText = () => page.evaluate(() => document.querySelector('#lpn_setbox_jump .lpn-setbox-jump-text').textContent.trim());
		const open = () => page.evaluate(() => document.getElementById('lpn_setbox_panes').classList.contains('lpn-jump-open'));
		const where = (i) => page.evaluate((i) => {
			const b = document.querySelectorAll('#lpn_setbox_index .lpn-setbox-link')[i], c = document.getElementById('lpn_setbox_content');
			let t = document.getElementById(b.getAttribute('data-sec') || b.getAttribute('data-sub'));
			if (b.getAttribute('data-sec')) { t = t.closest('.lpn-set-sec'); }   // a section's heading is hidden here: its top edge is the section's
			return { top: t.getBoundingClientRect().top - c.getBoundingClientRect().top, scrollTop: c.scrollTop, max: c.scrollHeight - c.clientHeight };
		}, i);
		// Which rows to try: every row once going down, then a few going back up from the bottom.
		const order = rows.map((r, i) => i).concat([rows.length - 1, 0, Math.floor(rows.length / 2), 1, rows.length - 2]);
		for (const i of order) {
			await page.tap('#lpn_setbox_jump');
			await a.settle(60);
			ok('tapping the bar opens the list', await open());
			await page.tap('#lpn_setbox_index .lpn-setbox-link:nth-of-type(' + (i + 1) + ')');
			await a.settle(500);
			const w = await where(i), bar = await barText();
			const reach = w.scrollTop < w.max - 1;
			ok('"' + rows[i].text + '": the list closes', !(await open()));
			ok('"' + rows[i].text + '": the bar reads what was tapped', bar === rows[i].text, 'bar says "' + bar + '"');
			ok('"' + rows[i].text + '": it is at the top of the pane' + (reach ? '' : ' (end of pane, cannot scroll further)'), reach ? Math.abs(w.top) <= 4 : w.top >= -1, 'top ' + w.top.toFixed(1) + ', scrollTop ' + w.scrollTop.toFixed(0) + '/' + w.max.toFixed(0));
		}
		// P3: the spy still follows a hand scroll.
		await page.evaluate(() => { document.getElementById('lpn_setbox_content').scrollTop = 0; });
		await a.settle(300);
		const first = await barText();
		await page.evaluate(() => { const c = document.getElementById('lpn_setbox_content'); c.dispatchEvent(new Event('touchmove')); c.scrollTop = c.scrollHeight; });
		await a.settle(500);
		const last = await barText();
		ok('scrolling the pane by hand moves the bar on', first !== last, '"' + first + '" -> "' + last + '"');
		ok('no page errors', a.errors.length === 0, a.errors.join(' | ').slice(0, 300));
		console.log(NAME + ': ' + (checks - fails) + '/' + checks + ' ok');
	} finally { await browser.close(); env.stopServer(); }
}
main().then(() => process.exit(fails ? 1 : 0), (e) => { console.error(e); process.exit(1); });
