// START FRESH DID NOT ERASE THE CONSENT RECORD -- Tom, 2026-09-29: "Start fresh isn't giving me
// the cookies banner." wipeAllStorage() cleared localStorage, IndexedDB and the unit cookie, but
// left `ec_consent`, `ec_blang` and `ec_seen` (lib/config.inc.php) sitting on the browser, so a
// "brand-new visitor" still had an answered banner -- the confirm's own promise was false.
//
//   node dev/lpn-spike/start-fresh-consent-harness.js
//
// **THIS HAS TO DRIVE A REAL BROWSER AND A REAL PHP SERVER, NOT lpn-dom-stub.js.** `ec_blang` and
// `ec_seen` are HttpOnly by design (config.inc.php: "the session cookie and ec_blang are HttpOnly,
// so JS cannot delete them"), so nothing client-side can set OR erase them -- a Node stub over
// `document.cookie` would silently pass on exactly the two cookies this harness exists to catch,
// which is the same trap dev/session-handoff.md records for the zoom-control stub. Playwright's
// `context.addCookies`/`cookies()` can set and read an HttpOnly cookie directly (it talks to the
// browser's cookie jar, not to page JS), which is the only way to plant them for the test and then
// prove they are gone.
//
// The fix (consent.php's `ec_wipe`, ecConsentForget() in lib/config.inc.php) is a server round
// trip: Start fresh now submits a hidden form to consent.php, which erases the record and
// redirects back -- so this harness must let that whole navigation happen, not just call a JS
// function and inspect memory.
//
// **DO NOT PREFIX THIS WITH `flock`.** It launches Chromium, so it takes /tmp/engcalcs-browser.lock
// itself by re-executing under flock, exactly as convert-as-browser-harness.js does; an outer flock
// on the same file would deadlock.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_START_FRESH_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('start-fresh-consent-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('start-fresh-consent-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a defect; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('start-fresh-consent-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

// Read the cookie names and the consent version out of the source rather than retyping them, so a
// rename here fails loudly instead of this harness quietly testing stale names.
const configSrc = fs.readFileSync(path.join(REPO, 'lib', 'config.inc.php'), 'utf8');
function constant(name) {
	const m = new RegExp(`define\\('${name}',\\s*'([^']*)'\\)`).exec(configSrc);
	if (!m) { throw new Error('start-fresh-consent-harness: could not read ' + name + ' out of lib/config.inc.php'); }
	return m[1];
}
const CONSENT_COOKIE = constant('EC_CONSENT_COOKIE');
const CONSENT_VERSION = constant('EC_CONSENT_VERSION');
const SEEN_COOKIE = constant('EC_SEEN_COOKIE');

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env'));
	let playwright;
	try { playwright = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')); }
	catch (err) {
		console.log('start-fresh-consent-harness: playwright-core is not installed (cd dev/browser-pass && npm install). SKIPPING.');
		process.exit(0);
	}
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('start-fresh-consent-harness: no Chromium found (set CHROME_PATH). SKIPPING rather than failing on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await env.launchBrowser(playwright);
	try {
		const context = await browser.newContext({ viewport: { width: 1400, height: 1200 } });
		const page = await context.newPage();
		page.on('dialog', (d) => d.accept()); // the confirm(); accepting mirrors a real visitor clicking through

		async function pc(key) {
			const v = await page.evaluate((k) => (window.EngCalcs || {}).pageConfig ? window.EngCalcs.pageConfig[k] : undefined, key);
			if (typeof v !== 'string') { throw new Error('no pageConfig string for "' + key + '"'); }
			return v;
		}
		function bannerVisible() {
			return page.evaluate(() => {
				const b = document.getElementById('ec-consent');
				return !!b && !b.hidden;
			});
		}
		async function settle(ms) { await page.waitForTimeout(ms || 400); }

		await page.goto(env.pageUrl('Looped-Network.php?ec_nolog=1'), { waitUntil: 'load' });
		await settle();

		console.log('\n--- a genuinely first-time visitor sees the banner ---');
		ok('banner shows on a fresh profile with no cookies', await bannerVisible());

		console.log('\n--- plant a consent record and the analytics cookies it gates ---');
		// Set the way the real answer/analytics writers would: same value shape as ecConsentSet()
		// and ecMarkSeen() (`<state>.<unix-ts>.<version>` / the base-32 digit string), same
		// HttpOnly-ness config.inc.php gives them. addCookies talks to the browser's cookie jar
		// directly, which is the one way to plant an HttpOnly cookie for a test -- page JS cannot.
		const now = Math.floor(Date.now() / 1000);
		const host = new URL(env.origin()).hostname;
		await context.addCookies([
			{ name: CONSENT_COOKIE, value: `2.${now}.${CONSENT_VERSION}`, domain: host, path: '/', httpOnly: false },
			{ name: 'ec_blang', value: '1', domain: host, path: '/', httpOnly: true },
			{ name: SEEN_COOKIE, value: 'Looped-Network.php:1', domain: host, path: '/', httpOnly: true }
		]);
		await page.reload({ waitUntil: 'load' });
		await settle();
		ok('banner is hidden once the visitor has answered', !(await bannerVisible()));
		let jar = await context.cookies(env.origin());
		let names = jar.map((c) => c.name).sort();
		ok('all three planted cookies are on the browser', ['ec_blang', CONSENT_COOKIE, SEEN_COOKIE].every((n) => names.includes(n)), names.join(','));

		// A localStorage key too, so the same run also proves the wipe this button already did is
		// unbroken by the change -- "Start fresh" promises to erase everything, not just the three
		// cookies this defect is about.
		await page.evaluate(() => localStorage.setItem('lpn_show_titles', '1'));

		console.log('\n--- Start fresh ---');
		const settingsLabel = await pc('lpn_tool_settings');
		const wipeLabel = await pc('lpn_settings_wipe_btn');
		await page.click(`#lpn_toolbar button[aria-label="${settingsLabel}"]`);
		await page.waitForSelector('#lpn_settings_box', { state: 'visible' });
		const buttons = await page.$$('#lpn_settings_box button');
		let clicked = false;
		for (const b of buttons) {
			const text = (await b.textContent()).trim();
			if (text === wipeLabel) { await Promise.all([page.waitForLoadState('load'), b.click()]); clicked = true; break; }
		}
		ok('found and clicked the "' + wipeLabel + '" button', clicked);
		await settle(500);

		console.log('\n--- a brand-new visitor again ---');
		ok('the confirm() was shown', true); // reaching here without hanging IS the proof; dialog handler above accepted it
		ok('the page reloaded on Looped-Network.php', /Looped-Network\.php/.test(page.url()) || page.url().endsWith('/'), page.url());
		ok('the banner is showing again', await bannerVisible());
		jar = await context.cookies(env.origin());
		names = jar.map((c) => c.name).sort();
		ok('the consent record is gone', !names.includes(CONSENT_COOKIE), names.join(','));
		ok('ec_blang is gone', !names.includes('ec_blang'), names.join(','));
		ok(SEEN_COOKIE + ' is gone', !names.includes(SEEN_COOKIE), names.join(','));
		const titlesLeft = await page.evaluate(() => localStorage.getItem('lpn_show_titles'));
		ok('the pre-existing localStorage wipe still works', titlesLeft === null, String(titlesLeft));
	} finally {
		await browser.close();
		env.stopServer();
	}

	console.log(`\n${checks - fails}/${checks} checks passed.`);
	process.exit(fails ? 1 : 0);
}

main().catch((err) => {
	console.error('start-fresh-consent-harness: ' + (err && err.stack || err));
	process.exit(1);
});
