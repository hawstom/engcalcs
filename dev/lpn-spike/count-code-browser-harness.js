// THE RANDOM BROWSER CODE, in a real browser (Tom, 2026-10-08, call F01: "Go (random code, new
// consent text)").
//
//   node dev/lpn-spike/count-code-browser-harness.js
//
// What the ruling promised, each held here by clicking the real banner on a real page:
//   * no code before a yes;
//   * after "Allow this", a code of 16 characters (lowercase hex), readable by the page, lasting
//     400 days, and carried by the log rows that page load writes;
//   * the 400 days start again on the next day's first visit (the page's clock is faked to put the
//     yes on the day before);
//   * Refuse all deletes it at once, and it stays gone;
//   * the consent version moved to 2, so an "Allow this" from version 1 is asked again and has its
//     code deleted, while "Allow all" and "Refuse all" from version 1 are not asked again;
//   * a page in another language (Spanish, still on the old banner sentence until the sprint)
//     makes the code the same way.
// Start fresh / Erase everything deleting it is dev/lpn-spike/start-fresh-consent-harness.js, which
// clicks that control; the server half (renewal, log fields, the tester log) is
// dev/calc-spike/visit-dedupe-harness.js.
//
// **DO NOT PREFIX THIS WITH `flock`.** It takes /tmp/engcalcs-browser.lock itself, exactly as
// start-fresh-consent-harness.js does; an outer flock on the same file would deadlock.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_COUNT_CODE_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('count-code-browser-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('count-code-browser-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a defect; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('count-code-browser-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

// Names read out of the source, so a rename fails loudly here instead of testing a stale name.
const configSrc = fs.readFileSync(path.join(REPO, 'lib', 'config.inc.php'), 'utf8');
function constant(name) {
	const m = new RegExp(`define\\('${name}',\\s*'?([^')]*)'?\\)`).exec(configSrc);
	if (!m) { throw new Error('count-code-browser-harness: could not read ' + name + ' out of lib/config.inc.php'); }
	return m[1];
}
const CONSENT_COOKIE = constant('EC_CONSENT_COOKIE');
const CONSENT_VERSION = constant('EC_CONSENT_VERSION');
const CODE_COOKIE = constant('EC_CODE_COOKIE');
const DAY = 86400;

// Every log row this run writes goes to a temporary directory, never the checkout's log/:
// lib/config.inc.php honours EC_TEST_LOG_DIR under `php -S` only, and env.startServer() spawns that
// server with this process's environment.
const logDir = fs.mkdtempSync(path.join(os.tmpdir(), 'count-code-'));
process.env.EC_TEST_LOG_DIR = logDir;

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env'));
	let playwright;
	try { playwright = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')); }
	catch (err) {
		console.log('count-code-browser-harness: playwright-core is not installed (cd dev/browser-pass && npm install). SKIPPING.');
		process.exit(0);
	}
	if (!env.findChromium()) {
		console.error('count-code-browser-harness: no Chromium found (set CHROME_PATH). SKIPPING rather than failing on an environment gap.');
		process.exit(0);
	}
	await env.startServer();
	const browser = await env.launchBrowser(playwright);
	const host = new URL(env.origin()).hostname;
	const PAGE = 'Manning-Pipe-Flow.php';

	async function jarOf(context) { return context.cookies(env.origin()); }
	async function codeOf(context) { return (await jarOf(context)).find((c) => c.name === CODE_COOKIE) || null; }
	function bannerVisible(page) {
		return page.evaluate(() => { const b = document.getElementById('ec-consent'); return !!b && !b.hidden; });
	}
	function consentedInPage(page) { return page.evaluate(() => EngCalcs.analyticsConsented()); }
	async function answer(page, value) {
		// The banner's own button, clicked as a visitor clicks it. Reopened first through the footer
		// control's function when the banner is already answered.
		if (!(await bannerVisible(page))) { await page.evaluate(() => window.ecReopenConsent()); }
		await page.click(`#ec-consent button[name="ec_consent"][value="${value}"]`);
		await page.waitForTimeout(200);
	}
	function langRows() {
		const f = path.join(logDir, 'engcalcs-lang.log');
		return fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => l.split('\t')) : [];
	}

	try {
		console.log('\n--- 1. a first visit: no code before a yes ---');
		// SERVICE WORKERS BLOCKED in this one context, and only because of the faked clock: the
		// worker's install fetches every calculator page in the background, each of those is a
		// page view, and the server renews the code on a page view by its own (real) clock --
		// which is correct, and would hide whether the PAGE renewed it by its (faked) one.
		const ctx = await browser.newContext({ serviceWorkers: 'block' });
		const realNow = Date.now();
		// The yes happens "yesterday" by the page's clock, so the next step can be the next day.
		await ctx.clock.install({ time: new Date(realNow - DAY * 1000) });
		const page = await ctx.newPage();
		await page.goto(env.pageUrl(PAGE), { waitUntil: 'load' });
		ok('the banner shows', await bannerVisible(page));
		ok('no ' + CODE_COOKIE + ' cookie before any answer', !(await codeOf(ctx)), (await jarOf(ctx)).map((c) => c.name).join(','));
		ok('the page does not read silence as a yes', (await consentedInPage(page)) === false);

		console.log('\n--- 2. "Allow this" makes the code, at once and without a page load ---');
		await answer(page, '1');
		ok('the banner closes', !(await bannerVisible(page)));
		const first = await codeOf(ctx);
		ok('a code exists right after the yes', !!first, (await jarOf(ctx)).map((c) => c.name).join(','));
		ok('it is 16 lowercase hex characters', !!first && /^[0-9a-f]{16}$/.test(first.value), first && first.value);
		ok('the page can read it (not HttpOnly), so a no can delete it at once', !!first && first.httpOnly === false);
		const expectFirst = (realNow / 1000) - DAY + 400 * DAY;
		ok('it lasts 400 days from the moment of the yes', !!first && Math.abs(first.expires - expectFirst) < 120,
			first && ((first.expires - realNow / 1000) / DAY).toFixed(3) + ' days from now');
		ok('the consent record carries version ' + CONSENT_VERSION,
			(await jarOf(ctx)).some((c) => c.name === CONSENT_COOKIE && c.value.split('.')[0] === '1' && c.value.split('.')[2] === CONSENT_VERSION));
		ok('the page now reads a yes', (await consentedInPage(page)) === true);

		console.log('\n--- 3. the next day\'s first visit renews the 400 days ---');
		await ctx.clock.setSystemTime(new Date(realNow));
		const rowsBefore = langRows().length;
		// ?lang=en, an explicit language choice, is the reach row written on every page load; the
		// automatic one is written once per browser, so it would prove nothing here.
		await page.goto(env.pageUrl(PAGE + '?lang=en'), { waitUntil: 'load' });
		await page.waitForTimeout(200);
		const second = await codeOf(ctx);
		ok('the same code, not a new one', !!second && !!first && second.value === first.value, second && second.value);
		ok('its expiry moved a day later', !!second && !!first && Math.abs((second.expires - first.expires) - DAY) < 120,
			second && first && ((second.expires - first.expires) / 3600).toFixed(2) + ' hours later');
		const newRows = langRows().slice(rowsBefore);
		const r = newRows[newRows.length - 1] || [];
		ok('that page load\'s reach row carries the code just before the said-yes bucket',
			r.length > 2 && r[r.length - 1] === 'visitor' && r[r.length - 2] === (first && first.value), JSON.stringify(r));

		console.log('\n--- 4. Refuse all deletes it at once, and it stays gone ---');
		await answer(page, '0');
		ok('gone before any page load', !(await codeOf(ctx)), (await jarOf(ctx)).map((c) => c.name).join(','));
		await page.reload({ waitUntil: 'load' });
		await page.waitForTimeout(200);
		ok('still gone after a page load', !(await codeOf(ctx)));
		ok('and the refusal is not asked again', !(await bannerVisible(page)));
		const refusedRow = langRows().slice(-1)[0] || [];
		ok('a refused page load is a page-load row with no code', refusedRow[refusedRow.length - 1] === 'visit'
			&& !refusedRow.some((f) => /^[0-9a-f]{16}$/.test(f)), JSON.stringify(refusedRow));

		console.log('\n--- 5. "Allow all" makes a new code ---');
		await answer(page, '2');
		const third = await codeOf(ctx);
		ok('a code again', !!third && /^[0-9a-f]{16}$/.test(third.value), third && third.value);
		ok('a NEW one: nothing was kept from the refused browser', !!third && !!first && third.value !== first.value);
		await ctx.close();

		console.log('\n--- 6. consent version ' + CONSENT_VERSION + ': who is asked again ---');
		const now = Math.floor(Date.now() / 1000);
		const OLD = '1';
		async function visitWith(consentValue, extra) {
			const c = await browser.newContext();
			const cookies = [{ name: CONSENT_COOKIE, value: consentValue, domain: host, path: '/' }];
			if (extra) { cookies.push(Object.assign({ domain: host, path: '/' }, extra)); }
			await c.addCookies(cookies);
			const p = await c.newPage();
			await p.goto(env.pageUrl(PAGE), { waitUntil: 'load' });
			await p.waitForTimeout(200);
			const out = { banner: await bannerVisible(p), code: await codeOf(c), consented: await consentedInPage(p) };
			await c.close();
			return out;
		}
		ok('the version really did move (else this section proves nothing)', CONSENT_VERSION !== OLD, CONSENT_VERSION);
		let v = await visitWith(`1.${now}.${OLD}`, { name: CODE_COOKIE, value: 'aaaaaaaaaaaaaaaa' });
		ok('"Allow this" from version 1: the banner asks again', v.banner);
		ok('"Allow this" from version 1: its old code is deleted and no new one made', !v.code, v.code && v.code.value);
		ok('"Allow this" from version 1: the page reads no yes', v.consented === false);
		v = await visitWith(`2.${now}.${OLD}`);
		ok('"Allow all" from version 1: not asked again', !v.banner);
		ok('"Allow all" from version 1: a code is made', !!v.code && /^[0-9a-f]{16}$/.test(v.code.value), v.code && v.code.value);
		ok('"Allow all" from version 1: the page reads a yes (it read no before 2026-10-08)', v.consented === true);
		v = await visitWith(`0.${now}.${OLD}`, { name: CODE_COOKIE, value: 'bbbbbbbbbbbbbbbb' });
		ok('"Refuse all" from version 1: not asked again', !v.banner);
		ok('"Refuse all" from version 1: no code, and a stray one is deleted', !v.code, v.code && v.code.value);
		v = await visitWith(`1.${now}.${CONSENT_VERSION}`);
		ok('"Allow this" for the current version: not asked again, and a code is made',
			!v.banner && !!v.code && /^[0-9a-f]{16}$/.test(v.code.value), JSON.stringify({ banner: v.banner, code: v.code && v.code.value }));

		console.log('\n--- 7. a Spanish page ---');
		const es = await browser.newContext();
		const ep = await es.newPage();
		await ep.goto(env.pageUrl(PAGE + '?lang=es'), { waitUntil: 'load' });
		const body = await ep.evaluate(() => document.querySelector('#ec-consent .ec-consent-body').textContent);
		ok('the Spanish banner shows', await bannerVisible(ep), body);
		ok('no code before the yes', !(await codeOf(es)));
		await answer(ep, '1');
		const esCode = await codeOf(es);
		ok('"Allow this" on the Spanish page makes the code too', !!esCode && /^[0-9a-f]{16}$/.test(esCode.value), esCode && esCode.value);
		await es.close();
	} finally {
		await browser.close();
		env.stopServer();
		fs.rmSync(logDir, { recursive: true, force: true });
	}

	console.log(`\n${checks - fails}/${checks} checks passed.`);
	process.exit(fails ? 1 : 0);
}

main().catch((err) => {
	console.error('count-code-browser-harness: ' + (err && err.stack || err));
	process.exit(1);
});
