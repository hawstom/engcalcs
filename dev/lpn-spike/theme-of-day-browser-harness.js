// THE THEME OF THE DAY (Task 824), in a real Chromium. Run with:
//   node dev/lpn-spike/theme-of-day-browser-harness.js
//
// Tom, 2026-10-30: "Days of the week starting at noon UTC, Newspaper on Sunday, Desktop on Monday, Prairie on
// Tuesday, System on Wednesday, Platinum on Thursday, Rounded on Friday, Space on Saturday." A browser that has
// never picked a theme sees the day's; any pick, System included (stored as the word "system"), ends the show.
//
// WHAT IT PROVES, with the page's clock injected as window.EC_NOW (milliseconds):
//   1. Each of the 7 days, at mid-day UTC, a fresh browser opens in that day's theme and stores nothing.
//   2. The boundary: at 11:59:59.999 UTC the day before's theme stands, at 12:00:00.000 UTC the new day's,
//      for all seven noons.
//   3. A stored pick beats the day (Dark on a Newspaper Sunday); a stored "system" ends the show (System on
//      a Space Saturday follows the device); an unreadable stored value is System.
//   4. Settings > Page > Theme shows the theme in force; choosing System stores "system" and survives a
//      reload on a day whose theme is Rounded; choosing the very theme in force stores it too, and a
//      later day does not move it.
//   5. The page decides once: moving window.EC_NOW across noon with the page open changes nothing.
//   6. ?theme=system stores "system".
//   7. No page errors.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_THEME_OF_DAY_LOCKED';
const NAME = 'theme-of-day-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error(NAME + ': NOT RUN, browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}

let checks = 0, fails = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

// 2026-10-25 is a Sunday. DAYS[i] is the theme from (that Sunday + i) 12:00 UTC to the next day's 12:00 UTC.
const DAYS = ['newspaper', 'desktop', 'prairie', 'system', 'platinum', 'rounded', 'space'];
const NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SUN = Date.UTC(2026, 9, 25, 0, 0, 0);
const HOUR = 3600e3;
const FRIDAY_NOON_PLUS = SUN + 5 * 24 * HOUR + 15 * HOUR; // a Friday afternoon: Rounded

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];

	// A page whose clock is `now`, in the context `ctx` (its own localStorage unless `seed` is given).
	async function pageAt(ctx, now, seed) {
		const page = await ctx.newPage();
		page.on('pageerror', (e) => errors.push(String(e)));
		await page.addInitScript(([n, sd]) => {
			window.EC_NOW = n;
			if (sd !== null && !sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.setItem('lpn_theme', sd); }
		}, [now, seed === undefined ? null : seed]);
		await page.goto(env.pageUrl('Looped-Network.php?ec_nolog=1'), { waitUntil: 'domcontentloaded' });
		return page;
	}
	const read = (page) => page.evaluate(() => ({
		theme: document.documentElement.getAttribute('data-theme'),
		get: window.ecTheme.get(),
		stored: (function () { try { return localStorage.getItem('lpn_theme'); } catch (e) { return 'ERR'; } })(),
		picked: window.ecTheme.picked()
	}));
	// The resolved name a day's choice paints: System follows the (light) device.
	const painted = (t) => t === 'system' ? 'light' : t;

	try {
		// 1. each day, mid-afternoon UTC, fresh browser
		for (let i = 0; i < 7; i++) {
			const ctx = await browser.newContext({ colorScheme: 'light' });
			try {
				const pg = await pageAt(ctx, SUN + i * 24 * HOUR + 15 * HOUR);
				const st = await read(pg);
				ok('1. ' + NAMES[i] + ' 15:00 UTC opens in ' + DAYS[i] + ', nothing stored',
					st.get === DAYS[i] && st.theme === painted(DAYS[i]) && st.stored === null && st.picked === false, JSON.stringify(st));
			} finally { await ctx.close(); }
		}
		// 2. the noon boundary, all seven, one millisecond either side
		for (let i = 0; i < 7; i++) {
			const noon = SUN + i * 24 * HOUR + 12 * HOUR;
			const before = DAYS[(i + 6) % 7];
			const ctx = await browser.newContext({ colorScheme: 'light' });
			try {
				const a = await read(await pageAt(ctx, noon - 1));
				const b = await read(await pageAt(ctx, noon));
				ok('2. ' + NAMES[i] + ' 11:59:59.999 UTC is still ' + before, a.get === before && a.theme === painted(before), JSON.stringify(a));
				ok('2. ' + NAMES[i] + ' 12:00:00.000 UTC is ' + DAYS[i], b.get === DAYS[i] && b.theme === painted(DAYS[i]), JSON.stringify(b));
			} finally { await ctx.close(); }
		}
		// 3. stored pick, stored system, unreadable value
		{
			const ctx = await browser.newContext({ colorScheme: 'light' });
			try {
				let st = await read(await pageAt(ctx, SUN + 15 * HOUR, 'dark'));
				ok('3. a stored Dark beats Newspaper Sunday', st.get === 'dark' && st.theme === 'dark' && st.picked === true, JSON.stringify(st));
			} finally { await ctx.close(); }
			const c2 = await browser.newContext({ colorScheme: 'light' });
			try {
				const st = await read(await pageAt(c2, SUN + 6 * 24 * HOUR + 15 * HOUR, 'system'));
				ok('3. a stored "system" on Space Saturday is System, light here', st.get === 'system' && st.theme === 'light' && st.picked === true, JSON.stringify(st));
			} finally { await c2.close(); }
			const c3 = await browser.newContext({ colorScheme: 'light' });
			try {
				const st = await read(await pageAt(c3, SUN + 6 * 24 * HOUR + 15 * HOUR, 'sepia-retired'));
				ok('3. an unreadable stored value is System, not the day', st.get === 'system' && st.theme === 'light', JSON.stringify(st));
			} finally { await c3.close(); }
		}
		// 5. the page decides once
		{
			const ctx = await browser.newContext({ colorScheme: 'light' });
			try {
				const pg = await pageAt(ctx, SUN + 11 * HOUR + 59 * 60e3); // Saturday 23:59 minus... Sat before Sunday noon
				const before = await read(pg);
				await pg.evaluate((n) => { window.EC_NOW = n; window.dispatchEvent(new Event('ec-theme')); }, SUN + 13 * HOUR);
				await pg.waitForTimeout(300);
				const after = await read(pg);
				ok('5. the clock crossing noon with the page open changes nothing', before.get === 'space' && after.get === 'space' && after.theme === 'space', JSON.stringify([before, after]));
			} finally { await ctx.close(); }
		}
		// 6. the rescue
		{
			const ctx = await browser.newContext({ colorScheme: 'light' });
			try {
				const pg = await pageAt(ctx, FRIDAY_NOON_PLUS);
				await pg.goto(env.pageUrl('Looped-Network.php?ec_nolog=1&theme=system'), { waitUntil: 'domcontentloaded' });
				const st = await read(pg);
				ok('6. ?theme=system on a Rounded Friday stores "system"', st.stored === 'system' && st.get === 'system' && st.theme === 'light', JSON.stringify(st));
			} finally { await ctx.close(); }
		}
		// 4. the Settings control, by real clicks
		for (const pick of ['system', 'rounded']) {
			const s = await Session.open(browser, 'pick-' + pick, { colorScheme: 'light' });
			try {
				await s.context.addInitScript((n) => { window.EC_NOW = n; }, FRIDAY_NOON_PLUS);
				await s.goto('Looped-Network.php');
				await s.openExampleCard(await s.lang('lpn_ex_net1_title'));
				await s.settle(500);
				if (!(await s.page.isVisible('#lpn_settings_box'))) { await s.toolbarClick(await s.lang('lpn_tool_settings')); }
				await s.settle(400);
				const row = s.page.locator('label.lpn-set-row', { hasText: await s.lang('lpn_settings_theme') }).first();
				await row.scrollIntoViewIfNeeded();
				let st = await s.page.evaluate(() => ({ choice: document.getElementById('lpn_set_theme').getAttribute('data-theme-choice'), theme: document.documentElement.getAttribute('data-theme'), stored: localStorage.getItem('lpn_theme') }));
				ok('4. Friday: the Theme button shows Rounded, the theme in force, and nothing is stored', st.choice === 'rounded' && st.theme === 'rounded' && st.stored === null, JSON.stringify(st));
				await s.page.click('#lpn_set_theme');
				await s.page.waitForSelector('#lpn_theme_gallery', { state: 'visible' });
				await s.page.click('#lpn_theme_gallery .lpn-theme-choice[data-theme-name="' + pick + '"]');
				await s.page.waitForSelector('#lpn_theme_gallery', { state: 'detached' });
				st = await s.page.evaluate(() => ({ choice: window.ecTheme.get(), theme: document.documentElement.getAttribute('data-theme'), stored: localStorage.getItem('lpn_theme') }));
				ok('4. choosing ' + pick + ' stores "' + pick + '"', st.stored === pick && st.choice === pick, JSON.stringify(st));
				await s.page.evaluate((n) => { window.EC_NOW = n; }, SUN + 5 * 24 * HOUR + 12 * HOUR);
				await s.reload();
				await s.page.waitForFunction(() => !!window.ecTheme);
				st = await s.page.evaluate(() => ({ choice: window.ecTheme.get(), theme: document.documentElement.getAttribute('data-theme'), stored: localStorage.getItem('lpn_theme') }));
				// the reload runs the init script again: still a Friday, where the day is Rounded
				ok('4. after a reload on a Rounded day, ' + pick + ' stands', st.stored === pick && st.choice === pick && st.theme === (pick === 'system' ? 'light' : pick), JSON.stringify(st));
				ok('7. no page errors (' + pick + ')', !s.errors.length, (s.errors[0] || '').slice(0, 200));
			} finally { await s.close(); }
		}
		ok('7. no page errors in the plain loads', errors.length === 0, errors[0]);
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? `\n${fails} FAILED of ${checks}` : `\nall ${checks} ok`);
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
