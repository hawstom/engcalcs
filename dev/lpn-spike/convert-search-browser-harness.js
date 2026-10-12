// FILE, CONVERT AS... REMEMBERS THE PLACE SEARCHED FOR IN ITS COORDINATE-SYSTEM CHOOSER.
//
//   node dev/lpn-spike/convert-search-browser-harness.js
//
// Tom, 2026-10-12: "It would be good for the wizard to remember if user does place name search in
// the coordinate system chooser and place the Step 1 of 2 view based on that name search or
// results so that they don't type the same search twice."
//
//   1. A chooser search, then Convert: Step 1 opens centred on the found place, and Search by name
//      opens with the query already typed. Exactly ONE request has gone to Nominatim, and
//      submitting the pre-filled query sends no second one.
//   2. The chooser was not searched: Step 1 opens on the whole world and the search box is empty.
//   3. Nothing about the search is stored on the device.
//   4. A chooser search followed by "unnamed (local) georeference": the world-map wizard opens
//      centred there as well.
//
// Nominatim is stubbed at the route; it is never called. Do not prefix with flock.
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
const LOCK_ENV = 'EC_CONVERT_SEARCH_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('convert-search-browser-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('convert-search-browser-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a conversion failure; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('convert-search-browser-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}


let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
const QUERY = 'Prescott Valley, Arizona';
const PV = { lat: 34.61, lon: -112.32 };
const HIT = [{ lat: String(PV.lat), lon: String(PV.lon), display_name: 'Prescott Valley, Yavapai County, Arizona',
	boundingbox: ['34.56', '34.66', '-112.37', '-112.27'] }];

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('convert-search-browser-harness: playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('convert-search-browser-harness: no Chromium found (set CHROME_PATH). SKIPPING rather than failing on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'A');
		const page = a.page;
		let geocoder = 0;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) =>
			route.fulfill({ status: 200, contentType: 'image/png', body: PNG }));
		await page.route(/nominatim\.openstreetmap\.org/, (route) => {
			geocoder++;
			return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(HIT),
				headers: { 'access-control-allow-origin': '*' } });
		});
		const answers = [];
		const prompts = [];   // the default text each prompt opened with
		page.removeAllListeners('dialog');
		page.on('dialog', async (d) => {
			if (d.type() === 'prompt') {
				prompts.push(d.defaultValue());
				const v = answers.shift();
				if (v === undefined) { await d.dismiss(); } else { await d.accept(v); }
				return;
			}
			await d.accept();
		});
		const PC = {};
		async function S(key) { if (!(key in PC)) { PC[key] = await a.lang(key); } return PC[key]; }
		async function openConvertAs() {
			await a.menuClick(await S('lpn_file_convert_as'));
			await page.waitForSelector('#lpn_convas_panel', { state: 'visible' });
		}
		// The chooser: optionally search a place, then choose UTM 12N by its code.
		async function chooser(searchText) {
			await page.check('#lpn_convas_kind_epsg');
			await page.click('#lpn_convas_crs_pick');
			await page.waitForSelector('#lpn_crsbox', { state: 'visible' });
			await a.settle(500);
			if (searchText) {
				await page.fill('#lpn_crsbox_place', searchText);
				await page.click('#lpn_crsbox_search');
				await a.settle(1200);
			}
			const view = await page.$('#lpn_crsbox_view');
			if (view && await view.isChecked()) { await view.uncheck(); }
			await page.fill('#lpn_crsbox_name', '32612');
			await a.settle(300);
			await page.selectOption('#lpn_crsbox_list', 'EPSG:32612');
			await page.click('#lpn_crsbox_ok');
			await page.waitForSelector('#lpn_crsbox', { state: 'hidden' });
		}
		const barVisible = () => page.$eval('#lpn_georef_bar', (e) => e.style.display !== 'none').catch(() => false);
		const mapgeoVisible = () => page.$eval('#lpn_mapgeo_bar', (e) => e.style.display !== 'none').catch(() => false);
		async function centre() {
			const c = await page.$eval('#lpn_canvas', (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
			await page.mouse.move(c.x, c.y);
			await a.settle(250);
			const t = await page.$eval('#lpn_coords', (e) => e.textContent);
			const n = (t.match(/-?\d+(\.\d+)?/g) || []).map(Number);
			return { text: t, lat: n[0], lon: n[1] };
		}
		const near = (c) => c.lat !== undefined && Math.abs(c.lat - PV.lat) < 0.2 && Math.abs(c.lon - PV.lon) < 0.2;

		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		const ELM = await S('lpn_ex_elm_street_title');
		await a.openExampleCard(ELM);

		console.log('\n--- 1. a chooser search is carried into Step 1 ---');
		await openConvertAs();
		await chooser(QUERY);
		ok('the chooser search made exactly one Nominatim request', geocoder === 1, String(geocoder));
		await page.click('#lpn_convas_ok');
		await a.settle(1800);
		ok('the wizard opens at Step 1', await barVisible());
		const c1 = await centre();
		ok('Step 1 is centred on the searched place, not the whole world', near(c1), c1.text);
		ok('...with no further request to Nominatim', geocoder === 1, String(geocoder));
		prompts.length = 0;
		answers.push('');
		await page.click('#lpn_georef_search');
		await a.settle(600);
		ok('Search by name opens with the chooser query already typed', prompts[0] === QUERY, JSON.stringify(prompts[0]));
		prompts.length = 0;
		answers.push(QUERY);
		await page.click('#lpn_georef_search');
		await a.settle(1500);
		ok('submitting it again sends no second request (the result is in hand)', geocoder === 1, String(geocoder));
		await page.click('#lpn_georef_cancel');
		await a.settle(800);
		prompts.length = 0;

		console.log('\n--- 2. no chooser search: Step 1 is as it was ---');
		await openConvertAs();
		await chooser('');
		await page.click('#lpn_convas_ok');
		await a.settle(1800);
		ok('the wizard opens at Step 1', await barVisible());
		const c2 = await centre();
		ok('Step 1 is NOT centred on Prescott Valley', !near(c2), c2.text);
		answers.push('');
		await page.click('#lpn_georef_search');
		await a.settle(600);
		ok('Search by name opens empty', prompts[0] === '', JSON.stringify(prompts[0]));
		ok('no request was made', geocoder === 1, String(geocoder));
		await page.click('#lpn_georef_cancel');
		await a.settle(800);
		prompts.length = 0;

		console.log('\n--- 3. nothing about the search is stored, and the pre-fill ends with the wizard ---');
		await openConvertAs();
		await chooser(QUERY);
		await page.click('#lpn_convas_ok');
		await a.settle(1800);
		await page.click('#lpn_georef_cancel');
		await a.settle(800);
		ok('no localStorage entry other than a project holds the query',
			!(await page.evaluate((q) => Object.keys(localStorage).some((k) => (localStorage.getItem(k) || '').indexOf(q) >= 0 && k.indexOf('lpn_project_') !== 0), QUERY)));
		ok('...and no cookie holds it', !(await page.evaluate((q) => document.cookie.indexOf(encodeURIComponent(q)) >= 0 || document.cookie.indexOf(q) >= 0, QUERY)));

		console.log('\n--- 4. the world-map wizard (unnamed georeference) is seeded too ---');
		await openConvertAs();
		await chooser(QUERY);
		await page.check('#lpn_convas_kind_unnamed');
		const before = geocoder;
		await page.click('#lpn_convas_ok');
		await a.settle(1800);
		ok('the world-map wizard opens', await mapgeoVisible());
		// This wizard shows no lat/lon readout, so finish it and read the placement it wrote.
		await page.click('#lpn_mapgeo_place');
		await a.settle(800);
		await page.click('#lpn_mapgeo_finish');
		await a.settle(1500);
		const g4 = await page.evaluate(() => {
			const ix = JSON.parse(localStorage.getItem('lpn_index') || '{}');
			const d = JSON.parse(localStorage.getItem('lpn_project_' + ix.openId) || 'null');
			return d && d.project && d.project.georef ? d.project.georef.origin : null;
		});
		ok('...the placement it wrote is at the searched place', !!g4 && Math.abs(g4.lat - PV.lat) < 0.2 && Math.abs(g4.lon - PV.lon) < 0.2, JSON.stringify(g4));
		ok('...with no further request', geocoder === before, String(geocoder));

		ok('no page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails === 0 ? 'ALL PASS (' + checks + ' checks)' : fails + ' of ' + checks + ' FAILED');
	process.exit(fails === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(1); });
