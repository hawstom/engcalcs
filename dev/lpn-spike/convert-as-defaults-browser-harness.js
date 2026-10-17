// FILE, CONVERT AS CONVERTS THE SETTINGS > NEW ASSETS NUMBERS TOO -- IN A REAL CHROME.
//
//   node dev/lpn-spike/convert-as-defaults-browser-harness.js
//
// Tom, 2026-10-16: "Convert as doesn't convert the Settings starting values: Fix it." His Fotobi,
// converted to SI, kept a starting diameter of 4 and a tank level of 20: typed in inches and feet,
// read as millimetres and metres, so the next pipe drawn was 4 mm across. Convert as now converts
// them with the factor it uses on the network. fixtures/fotobi-us-2026-10-15.epp is his US original.
//
// **DO NOT PREFIX THIS WITH `flock`.** It takes /tmp/engcalcs-browser.lock itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');

const NAME = 'convert-as-defaults-browser-harness';
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_CONVAS_DEFAULTS_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure of this harness; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

const FOTOBI = path.join(__dirname, 'fixtures', 'fotobi-us-2026-10-15.epp');
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
const near = (a, b) => typeof a === 'number' && Math.abs(a - b) <= 1e-4 * Math.max(1, Math.abs(b));

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error(NAME + ': playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'A', { extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' } });
		const page = a.page;
		await a.context.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) =>
			r.fulfill({ status: 200, contentType: 'image/png', body: PNG }));
		const byName = (n) => page.evaluate((nm) => {
			const ix = JSON.parse(localStorage.getItem('lpn_index') || '{}');
			const p = (ix.projects || []).find((x) => x.name === nm);
			return p ? JSON.parse(localStorage.getItem('lpn_project_' + p.id) || 'null') : null;
		}, n);
		async function dialogs() {
			for (let k = 0; k < 4 && (await a.dialog()); k++) {
				const d = await a.dialog();
				const want = ['Continue', 'Open read-only', 'OK'].find((b) => d.buttons.indexOf(b) >= 0) || d.buttons[0];
				await a.dialogClick(want).catch(() => {});
				await a.settle(800);
			}
		}
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.dismissGallery();
		await a.writeFile('Fotobi_US_WGS84.epp', fs.readFileSync(FOTOBI, 'utf8'));
		await a.queuePick('Fotobi_US_WGS84.epp');
		await a.menuClick(await a.lang('lpn_file_open'));
		await a.settle(1500); await dialogs();
		const us = (await byName('Fotobi_US_WGS84')).settings.defaults;
		ok('the US original starts a pipe at 4 in and a tank at 20 of 30 ft, 50 ft across',
			us.diameter === 4 && us.tankLevel === 20 && us.tankMaxLevel === 30 && us.tankDiameter === 50, JSON.stringify(us));

		console.log('\n--- File, Convert as, SI ---');
		await a.menuClick(await a.lang('lpn_file_convert_as'));
		await page.waitForSelector('#lpn_convas_panel', { state: 'visible' });
		await page.click('#lpn_convas_si');
		await page.click('#lpn_convas_ok');
		await a.settle(2000); await dialogs();
		const copy = await byName((await a.lang('lpn_copy_of')).replace('{name}', 'Fotobi_US_WGS84'));
		const d = copy.settings.defaults;
		ok('the copy is in millimetres and metres', copy.units.lpn_u_diameter === 'mm' && copy.units.lpn_u_elevhead === 'mh2o');
		ok('its starting diameter is 101.6 mm, not 4', near(d.diameter, 101.6), d.diameter);
		ok('its starting tank level is 6.096 m and its maximum 9.144 m', near(d.tankLevel, 6.096) && near(d.tankMaxLevel, 9.144), d.tankLevel + ', ' + d.tankMaxLevel);
		ok('its starting tank diameter is 15.24 m', near(d.tankDiameter, 15.24), d.tankDiameter);
		ok('zero stays zero (elevation, demand, tank minimum)', d.nodeElev === 0 && d.demand === 0 && d.tankMinLevel === 0);
		ok('numbers no unit decides are left alone (Hazen-Williams C 130, minor loss 2)', d.roughness === 130 && d.k === 2, d.roughness + ', ' + d.k);
		const after = (await byName('Fotobi_US_WGS84')).settings.defaults;
		ok('the original keeps its own', JSON.stringify(after) === JSON.stringify(us));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' checks passed');
	process.exit(fails ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
