// SETTINGS INDEX JUMPS LAND ON THEIR HEADING, FROM ANY STARTING POSITION, IN A REAL CHROMIUM.
// Run with: node dev/lpn-spike/settings-index-jump-harness.js     (also PHONE=1 for a 390 px viewport)
//
// Production defect (Tom): clicking Map in the Settings index, from a lower section, showed only the
// bottom of the Map section. A section heading is position:sticky; one whose section is already
// scrolled past rides at the BOTTOM of its section, and scrollIntoView() on a sticky element aims at
// where it sits now, not where its section begins. Every section heading was exposed, not just Map.
//
// For every index row, from several starting scroll positions (top, middle, bottom, and after every
// other row), click the row and require the heading to sit at the top of the content pane within 3 px
// (a sub-heading: just under its section's sticky heading). A row near the end that cannot scroll
// that far must at least be fully inside the pane.
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
if (process.env.EC_SETJUMP_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '200', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_SETJUMP_LOCKED: '1' }) });
		if (r.status === 75) { console.error('settings-index-jump-harness: NOT RUN -- browser lock held 200 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; console.log('  FAIL ' + name + (extra === undefined ? '' : '   ' + extra)); }
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
		if (process.env.PHONE) { await page.setViewportSize({ width: 390, height: 844 }); }
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1500);
		await page.evaluate(() => {
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		if (process.env.PHONE) { await a.menuClick(await a.lang('lpn_tool_settings'), 'project'); }
		else { await a.toolbarClick(await a.lang('lpn_tool_settings')); }
		await page.waitForSelector('#lpn_settings_box', { state: 'visible' });
		await a.settle(800);
		const rows = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_setbox_index .lpn-setbox-link'))
			.map((b) => ({ sec: b.getAttribute('data-sec'), sub: b.getAttribute('data-sub'), text: b.textContent })));
		if (process.env.DEBUG) { console.log(JSON.stringify(rows)); }
		ok('the index has rows', rows.length > 5, rows.length);
		const click = (i) => page.evaluate((i) => { document.querySelectorAll('#lpn_setbox_index .lpn-setbox-link')[i].click(); }, i);
		const measure = (i) => page.evaluate((i) => {
			const b = document.querySelectorAll('#lpn_setbox_index .lpn-setbox-link')[i];
			const c = document.getElementById('lpn_setbox_content');
			const t = document.getElementById(b.getAttribute('data-sec') || b.getAttribute('data-sub'));
			// A section heading is sticky and rides at the bottom of an already-passed section, so its
			// own rect proves nothing: measure the SECTION's top edge, where its heading naturally sits.
			const head = t;
			const cr = c.getBoundingClientRect(), hr = head.getBoundingClientRect();
			let covered = 0;
			if (b.getAttribute('data-sub')) {
				const sh = t.closest('.lpn-set-sec').querySelector('.lpn-set-head');
				covered = sh.getBoundingClientRect().height;
			}
			return { top: hr.top - cr.top, bottom: hr.bottom - cr.top, h: cr.height, covered,
				maxScroll: c.scrollHeight - c.clientHeight, scrollTop: c.scrollTop };
		}, i);
		const scrollTo = (y) => page.evaluate((y) => { document.getElementById('lpn_setbox_content').scrollTop = y; }, y);
		const starts = [['top', (m) => 0], ['middle', (m) => m / 2], ['bottom', (m) => m]];
		for (let i = 0; i < rows.length; i++) {
			const label = rows[i].text;
			const starters = starts.map((s) => async () => {
				const m = (await measure(i)).maxScroll; await scrollTo(s[1](m)); await a.settle(100); return s[0];
			});
			// after every other row (the "jump from a lower section" case)
			for (let j = 0; j < rows.length; j++) {
				if (j === i) { continue; }
				starters.push(async () => { await click(j); await a.settle(80); return 'from row ' + j; });
			}
			for (const st of starters) {
				const from = await st();
				await click(i); await a.settle(120);
				const m = await measure(i);
				const want = m.covered;
				const atTop = Math.abs(m.top - want) <= 3;
				const reachable = m.scrollTop < m.maxScroll - 1;
				const visible = m.top >= -1 && m.bottom <= m.h + 1;
				ok('"' + label + '" from ' + from + ': ' + (reachable ? 'heading at top' : 'heading visible (end of pane)'),
					reachable ? atTop : (atTop || visible),
					'heading top ' + m.top.toFixed(1) + ' px, wanted ' + want.toFixed(1) + ', scrollTop ' + m.scrollTop.toFixed(0) + '/' + m.maxScroll.toFixed(0));
			}
		}
		console.log('settings-index-jump-harness' + (process.env.PHONE ? ' (phone)' : '') + ': ' + (checks - fails) + '/' + checks + ' ok');
	} finally { await browser.close(); env.stopServer(); }
}
main().then(() => process.exit(fails ? 1 : 0), (e) => { console.error(e); process.exit(1); });
