// MAPBOX OUTDOORS BASEMAP -- ROADMAP Task 617 (Tom, 2026-10-15: "I approve."), in a real Chromium.
//
//   node dev/lpn-spike/basemap-outdoors-browser-harness.js
//
// The corner tile cycles street, satellite, outdoors, street. Outdoors is a Mapbox-hosted raster
// style on the satellite's own host and token, so it is gated exactly as satellite is gated.
//
// **THE TILE REQUEST IS REAL.** The harness page is served from 127.0.0.1, which the Mapbox token
// refuses (403; dev/session-handoff.md TRAPS). So each api.mapbox.com request the page makes is
// recorded, then re-sent from Node with a `localhost` Referer, and the answer handed back to the
// page. The status asserted is Mapbox's own.
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BASEMAP_OUTDOORS_BROWSER_LOCKED';
const NAME = 'basemap-outdoors-browser-harness';

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

let Session;
const MAPBOX = /api\.mapbox\.com/;
const OUTDOORS = /^https:\/\/api\.mapbox\.com\/styles\/v1\/mapbox\/outdoors-v12\/tiles\/256\/\d+\/\d+\/\d+\?access_token=pk\./;

async function open(browser, opts) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
	a.mapbox = [];
	a.statuses = [];
	await a.page.route(/tile\.openstreetmap\.org/, (route) => route.abort());
	await a.page.route(MAPBOX, async (route) => {
		const url = route.request().url();
		a.mapbox.push(url);
		try {
			const res = await fetch(url, { headers: { Referer: 'http://localhost/', Origin: 'http://localhost' } });
			a.statuses.push(res.status);
			const body = Buffer.from(await res.arrayBuffer());
			await route.fulfill({ status: res.status, body, headers: { 'content-type': res.headers.get('content-type') || 'image/png', 'access-control-allow-origin': '*' } });
		} catch (e) { a.statuses.push(0); await route.abort(); }
	});
	if (opts && opts.noToken) {
		await a.page.route(/Looped-Network\.php/, async (route) => {
			const res = await route.fetch();
			const body = (await res.text()).replace(/lpn_mapbox_token:\s*"[^"]*"/, 'lpn_mapbox_token: ""');
			await route.fulfill({ response: res, body });
		});
	}
	await a.goto();
	await a.dismissGallery();
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.newGeoProject();
	await a.settle(900);
	return a;
}
const tiles = (a) => a.page.$$eval('.lpn-basemap image', (els) => els.map((e) => e.getAttribute('href')));
const credit = (a) => a.page.evaluate(() => {
	const c = document.getElementById('lpn_basemap_credit');
	const shown = [...c.querySelectorAll('[data-basemap-credit]')].filter((e) => e.style.display !== 'none');
	return { visible: c.style.display !== 'none', sets: shown.map((e) => e.getAttribute('data-basemap-credit')), text: shown.map((e) => e.textContent).join(' ') };
});
const teaser = (a) => a.page.evaluate(() => {
	const b = document.getElementById('lpn_basemap_teaser');
	return { shown: b.style.display !== 'none', label: b.getAttribute('aria-label') };
});
const press = async (a) => { await a.page.click('#lpn_basemap_teaser'); await a.settle(1500); };

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		console.log('\n--- with a token: street, satellite, outdoors, street ---');
		let a = await open(browser);
		const pc = await a.page.evaluate(() => EngCalcs.pageConfig);
		ok('the page carries the token', typeof pc.lpn_mapbox_token === 'string' && pc.lpn_mapbox_token.length > 20);
		ok('a new geographic project starts on street tiles', (await tiles(a)).every((h) => /tile\.openstreetmap\.org/.test(h)));
		ok('the corner tile offers satellite', (await teaser(a)).label === pc.lpn_basemap_satellite_show, (await teaser(a)).label);
		await press(a);
		let t = await tiles(a);
		ok('one press: satellite tiles', t.length > 0 && t.every((h) => /mapbox\.satellite/.test(h)), t[0]);
		ok('the corner tile now offers Outdoors', (await teaser(a)).label === pc.lpn_basemap_outdoors_show, (await teaser(a)).label);
		a.mapbox.length = 0; a.statuses.length = 0;
		await press(a);
		t = await tiles(a);
		ok('two presses: every tile is the outdoors style', t.length > 0 && t.every((h) => OUTDOORS.test(h)), t[0] && t[0].replace(/access_token=.*/, 'access_token=...'));
		ok('...and the page really asked Mapbox for them', a.mapbox.length > 0 && a.mapbox.every((u) => OUTDOORS.test(u)), a.mapbox.length + ' requests');
		ok('...and Mapbox ANSWERED 200 for them (real request, localhost Referer)', a.statuses.length > 0 && a.statuses.every((s) => s === 200), [...new Set(a.statuses)].join(','));
		const c = await credit(a);
		ok('the credit shows, and only the outdoors set', c.visible && c.sets.join() === 'outdoors', c.sets.join());
		ok('...naming Mapbox and OpenStreetMap', /Mapbox/.test(c.text) && /OpenStreetMap/.test(c.text) && /Improve this map/.test(c.text), c.text.trim());
		ok('...with the Mapbox wordmark', await a.page.$('[data-basemap-credit="outdoors"] .lpn-mapbox-logo') !== null);
		ok('...and no imagery supplier it does not use', !/Maxar/.test(c.text));
		ok('the corner tile now offers the street map', (await teaser(a)).label === pc.lpn_basemap_show, (await teaser(a)).label);

		console.log('\n--- never cached, never stored ---');
		const stored = await a.page.evaluate(async () => {
			const out = { caches: [], swControl: !!(navigator.serviceWorker && navigator.serviceWorker.controller), cacheHits: 0, ls: false, idb: [] };
			if (window.caches) {
				for (const n of await caches.keys()) {
					out.caches.push(n);
					const cc = await caches.open(n);
					for (const r of await cc.keys()) { if (/api\.mapbox\.com/.test(r.url)) { out.cacheHits++; } }
				}
			}
			for (let i = 0; i < localStorage.length; i++) {
				const v = localStorage.getItem(localStorage.key(i)) || '';
				if (/api\.mapbox\.com|outdoors-v12|access_token/.test(v)) { out.ls = true; }
			}
			if (indexedDB.databases) { out.idb = (await indexedDB.databases()).map((d) => d.name); }
			return out;
		});
		ok('no Cache API entry holds a Mapbox tile', stored.cacheHits === 0, 'caches=' + stored.caches.join(',') + ' hits=' + stored.cacheHits);
		ok('no localStorage value holds a tile URL or the token', !stored.ls);
		const sw = fs.readFileSync(path.join(REPO, 'sw.php'), 'utf8') + (fs.existsSync(path.join(REPO, 'js', 'sw.js')) ? fs.readFileSync(path.join(REPO, 'js', 'sw.js'), 'utf8') : '');
		ok('the service worker source names no map host (sw_map_host_check holds the same)', !/mapbox|openstreetmap/i.test(sw.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '')));

		console.log('\n--- the choice survives save and reopen ---');
		const saved = await a.page.evaluate(() => {
			const idx = JSON.parse(localStorage.getItem('lpn_index') || '{}');
			for (let i = 0; i < localStorage.length; i++) {
				const k = localStorage.key(i), v = localStorage.getItem(k);
				if (/"basemap":"outdoors"/.test(v || '')) { return k; }
			}
			return null;
		});
		ok('the stored project says basemap outdoors', saved !== null, String(saved));
		await a.page.reload();
		await a.settle(2500);
		await a.dismissGallery().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(1500);
		t = await tiles(a);
		ok('reopened: still outdoors tiles', t.length > 0 && t.every((h) => OUTDOORS.test(h)), t.length + ' tiles; ' + (t[0] || '').slice(0, 60));
		ok('...and the outdoors credit shows', (await credit(a)).sets.join() === 'outdoors');
		await press(a);
		t = await tiles(a);
		ok('another press returns to street tiles', t.length > 0 && t.every((h) => /tile\.openstreetmap\.org/.test(h)));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();

		console.log('\n--- with no token: no choice at all ---');
		a = await open(browser, { noToken: true });
		const pc2 = await a.page.evaluate(() => EngCalcs.pageConfig);
		ok('the page carries an empty token', pc2.lpn_mapbox_token === '');
		ok('the corner tile is hidden, so neither satellite nor outdoors is offered', (await teaser(a)).shown === false);
		ok('only street tiles, and no request to Mapbox', (await tiles(a)).every((h) => /tile\.openstreetmap\.org/.test(h)) && a.mapbox.length === 0);
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + checks + ' checks, ' + failures + ' failures');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
