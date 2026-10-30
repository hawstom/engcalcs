// BACKGROUND LAYERS FROM A GIS SERVER, in a real Chromium (ROADMAP Task 720).
//
//   node dev/lpn-spike/gis-background-browser-harness.js
//
// Tom, 2026-09-25, on WaterCAD's background layers: *"This seems like a GIS REST server offering."*
//
// What it holds, against a fake server (dev/lpn-spike/gis-background-stub.php under `php -S` on a free
// loopback port, killed at the end) and with the street map answered locally:
//   1. js/lpn-gis.js, alone: the tile box, the address checks, the three URL shapes, the ArcGIS reading.
//   2. an XYZ layer, a WMS layer, a tiled ArcGIS layer and an untiled ArcGIS layer each add through the
//      Settings form and draw UNDER the network, ABOVE the street map, each tile exactly where the street
//      map's tile with the same address sits, and where the tile address itself says it should (the
//      WMS and export requests carry the tile's own EPSG:3857 box);
//   3. the tiled service is asked at /tile/{z}/{y}/{x}, the other at /export with bboxSR=3857;
//   4. the attribution line shows what the ArcGIS services state about themselves, and the host of the
//      WMS and XYZ servers;
//   5. opacity and on/off; the layers draw in the order they were added;
//   6. the project carries them (saved, reopened, drawn again), and removing the last one leaves the saved
//      project exactly as it was before any was added;
//   7. a refusing server, and a server that is not there, each say so once, naming the host, draw nothing,
//      and leave the map and the other layers alone;
//   8. a screenshot leaves a tile it cannot read out and says so, and does not throw.
//
// **DO NOT PREFIX THIS WITH `flock`.** It launches Chromium, so it takes /tmp/engcalcs-browser.lock itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');
const net = require('net');
const http = require('http');
const { execFileSync, spawnSync, spawn } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_GIS_BACKGROUND_LOCKED';
const NAME = 'gis-background-browser-harness';

let checks = 0, fails = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

// ---- 1. the pure half, no browser, no lock --------------------------------------------------------
function pure() {
	console.log('\n--- 1. js/lpn-gis.js alone ---');
	const G = require(path.join(REPO, 'js', 'lpn-gis.js'));
	const HALF = 20037508.342789244;
	const b0 = G.tileBbox3857(0, 0, 0);
	ok('tile 0/0/0 is the whole Web Mercator square', Math.abs(b0[0] + HALF) < 1e-6 && Math.abs(b0[3] - HALF) < 1e-6 && Math.abs(b0[2] - HALF) < 1e-6);
	const b1 = G.tileBbox3857(1, 1, 0);
	ok('tile 1/1/0 is the north-east quarter', Math.abs(b1[0]) < 1e-6 && Math.abs(b1[1]) < 1e-6 && Math.abs(b1[2] - HALF) < 1e-6 && Math.abs(b1[3] - HALF) < 1e-6);
	ok('an http address to another machine is refused', !G.normalise({ kind: 'xyz', url: 'http://example.org/{z}/{x}/{y}.png' }).ok);
	ok('an https tile address is accepted', G.normalise({ kind: 'xyz', url: 'https://example.org/t/{z}/{x}/{y}.png' }).ok);
	ok('a tile address without {z}{x}{y} says template', G.normalise({ kind: 'xyz', url: 'https://example.org/t.png' }).why === 'template');
	ok('a WMS with no layer name says layers', G.normalise({ kind: 'wms', url: 'https://example.org/wms', layers: ' , ' }).why === 'layers');
	ok('an ArcGIS address not ending /MapServer says mapserver', G.normalise({ kind: 'arcgis', url: 'https://example.org/arcgis/rest/services/x' }).why === 'mapserver');
	ok('a ruled-out address (javascript:) says address', G.normalise({ kind: 'xyz', url: 'javascript:alert(1)' }).why === 'address');
	ok('an ArcGIS address is cut back to /MapServer', G.normalise({ kind: 'arcgis', url: 'https://example.org/a/MapServer/export?f=json' }).layer.url === 'https://example.org/a/MapServer');
	const wms = G.normalise({ kind: 'wms', url: 'https://example.org/wms?map=x', layers: 'roads, water' }).layer;
	const u = G.tileUrl(wms, 3, 2, 1);
	ok('a WMS tile is a GetMap in EPSG:3857, PNG, transparent, 256 square, keeping the address\'s own query',
		/^https:\/\/example\.org\/wms\?map=x&SERVICE=WMS&VERSION=1\.1\.1&REQUEST=GetMap&LAYERS=roads,water&STYLES=&SRS=EPSG:3857&BBOX=[-\d.,]+&WIDTH=256&HEIGHT=256&FORMAT=image\/png&TRANSPARENT=TRUE$/.test(u), u);
	const arc = G.normalise({ kind: 'arcgis', url: 'https://example.org/a/MapServer' }).layer;
	ok('an untiled ArcGIS tile is an /export with bboxSR and imageSR 3857, png, transparent',
		/\/MapServer\/export\?bbox=[-\d.,]+&bboxSR=3857&imageSR=3857&size=256,256&format=png&transparent=true&f=image$/.test(G.tileUrl(arc, 3, 2, 1, { tiled: false })));
	ok('a tiled ArcGIS tile is /tile/{z}/{y}/{x}', G.tileUrl(arc, 3, 2, 1, { tiled: true }) === 'https://example.org/a/MapServer/tile/3/1/2');
	const info = G.arcgisInfo({ copyrightText: ' (c) County ', singleFusedMapCache: true, tileInfo: { rows: 256, cols: 256, spatialReference: { wkid: 102100 }, lods: [{ level: 2 }, { level: 9 }] } });
	ok('ArcGIS: tiled in 102100 at 256 is tiled, with its level range and copyright', info.tiled && info.minZ === 2 && info.maxZ === 9 && info.credit === '(c) County');
	ok('ArcGIS: a cache in another system is not used', !G.arcgisInfo({ tileInfo: { rows: 256, cols: 256, spatialReference: { wkid: 26910 }, lods: [{ level: 0 }] } }).tiled);
	ok('ArcGIS: an answer that is not a service is not tiled', !G.arcgisInfo(null).tiled && !G.arcgisInfo({ error: {} }).tiled);
}

if (process.argv.indexOf('--pure') >= 0) { pure(); console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' passed'); process.exit(fails ? 1 : 0); }

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

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

// A lat/lon network at Fotobi, Ghana, on the street map, no scenarios.
function fotobi() {
	const at = [['R1', 'reservoir', -0.3060, 6.1040], ['J1', 'junction', -0.3040, 6.1030], ['J2', 'junction', -0.3010, 6.1032]];
	const nodes = at.map(([id, type, x, y]) => type === 'reservoir' ? { id, type, x, y, head: 120 } : { id, type, x, y, elev: 80, _demand: 1 });
	const pipe = (id, from, to) => ({ id, type: 'pipe', from, to, verts: [], _diameter: 150, _roughness: 120, _length: 300,
		lenAuto: false, _status: 'open', _k: 0 });
	return {
		format: 'hawsedc-lpn', v: 11,
		project: { name: 'Fotobi', activeScenario: 'base', coords: 'geo', basemap: 'osm' },
		scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
		nodes, links: [pipe('P1', 'R1', 'J1'), pipe('P2', 'J1', 'J2')],
		units: { lpn_u_length: 'm', lpn_u_diameter: 'mm', lpn_u_elevhead: 'mh2o', lpn_u_pressure: 'kpa',
			lpn_u_flow: 'lps', lpn_u_velocity: 'mps', lpn_u_gradient: 'gradePercent', lpn_u_roughness: 'mm', lpn_u_age: 'hr' }
	};
}

function freePort() {
	return new Promise((resolve, reject) => {
		const s = net.createServer();
		s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => resolve(p)); });
		s.on('error', reject);
	});
}
function get(url) {
	return new Promise((resolve, reject) => {
		http.get(url, (r) => { let d = ''; r.on('data', (c) => { d += c; }); r.on('end', () => resolve(d)); }).on('error', reject);
	});
}
async function startStub() {
	const port = await freePort();
	const logFile = path.join(os.tmpdir(), 'gis-stub-' + process.pid + '.log');
	try { fs.unlinkSync(logFile); } catch (e) { /* none */ }
	const proc = spawn('php', ['-S', '127.0.0.1:' + port, path.join(__dirname, 'gis-background-stub.php')],
		{ env: Object.assign({}, process.env, { GIS_STUB_LOG: logFile }), stdio: 'ignore' });
	for (let i = 0; i < 50; i++) {
		try { await get('http://127.0.0.1:' + port + '/log'); return { port, proc, logFile }; } catch (e) { await new Promise((r) => setTimeout(r, 100)); }
	}
	proc.kill();
	throw new Error('the stub server did not start');
}

// Page-side readers.
const READ_TILES = () => {
	const out = [];
	document.querySelectorAll('.lpn-gis-layer').forEach((g, layer) => {
		g.querySelectorAll('image.lpn-gis-tile').forEach((im) => {
			out.push({ layer, href: im.getAttribute('href'), x: +im.getAttribute('x'), y: +im.getAttribute('y'),
				w: +im.getAttribute('width'), h: +im.getAttribute('height'), crossorigin: im.getAttribute('crossorigin') });
		});
	});
	return out;
};
const READ_STREET = () => Array.from(document.querySelectorAll('.lpn-basemap image')).map((im) => ({
	href: im.getAttribute('href'), x: +im.getAttribute('x'), y: +im.getAttribute('y'), w: +im.getAttribute('width'), h: +im.getAttribute('height') }));

async function main() {
	pure();
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	const stub = await startStub();
	const S = 'http://127.0.0.1:' + stub.port;
	const dead = await freePort();   // nothing listens here
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); stub.proc.kill(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'A', { viewport: { width: 1400, height: 900 }, serviceWorkers: 'block' });
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org/, (route) => route.fulfill({ status: 200, contentType: 'image/png', body: PNG }));
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.dismissGallery();
		await a.writeFile('Fotobi.lwn', JSON.stringify(fotobi()));
		await a.queuePick('Fotobi.lwn');
		await a.menuClick(await a.lang('lpn_file_open'));
		await a.settle(300);
		await a.answerTrainingPanel();
		await a.settle(2000);
		const stored = () => page.evaluate(() => {
			const p = localStorage.getItem('lpn_project_' + JSON.parse(localStorage.getItem('lpn_index')).openId);
			return p;
		});
		const requests = async () => (await get(S + '/log')).split('\n').filter(Boolean);

		console.log('\n--- 2. the street map is up, and there are no layers yet ---');
		const street0 = await page.evaluate(READ_STREET);
		ok('street tiles are on the map', street0.length > 0, String(street0.length));
		ok('no GIS server has been asked anything', (await requests()).length === 0);
		const before = await stored();
		ok('a project without layers has no gisLayers in its saved text', before.indexOf('gisLayers') < 0);

		// Add through the Settings form.
		async function addLayer(kind, url, layers) {
			await page.evaluate(() => { const e = document.getElementById('lpn_gis_kind'); if (e) { e.scrollIntoView(); } });
			await page.selectOption('#lpn_gis_kind', kind);
			await page.fill('#lpn_gis_url', url);
			if (kind === 'wms') { await page.fill('#lpn_gis_layers', layers); }
			await page.click('#lpn_gis_add');
			await a.settle(1500);
		}
		await a.toolbarClick(await a.lang('lpn_tool_settings'));
		await a.settle(600);
		ok('the Settings box has the add form', await page.$('#lpn_gis_add') !== null);

		console.log('\n--- 3. the four kinds draw, in place ---');
		await addLayer('xyz', S + '/xyz/{z}/{x}/{y}.png');
		await addLayer('wms', S + '/wms', 'roads');
		await addLayer('arcgis', S + '/arc/tiled/MapServer');
		await addLayer('arcgis', S + '/arc/export/MapServer');
		await a.settle(1500);
		const tiles = await page.evaluate(READ_TILES);
		const street = await page.evaluate(READ_STREET);
		const byLayer = [0, 1, 2, 3].map((i) => tiles.filter((t) => t.layer === i));
		byLayer.forEach((l, i) => ok('layer ' + (i + 1) + ' drew tiles', l.length > 0, String(l.length)));

		const HALF = 20037508.342789244;
		function address(kindIdx, href) {
			let m;
			if (kindIdx === 0) { m = /\/xyz\/(\d+)\/(\d+)\/(\d+)\.png/.exec(href); return m && { z: +m[1], x: +m[2], y: +m[3] }; }
			if (kindIdx === 2) { m = /\/tile\/(\d+)\/(\d+)\/(\d+)$/.exec(href); return m && { z: +m[1], y: +m[2], x: +m[3] }; }
			m = /BBOX=([-\d.]+),([-\d.]+),([-\d.]+),([-\d.]+)/i.exec(href) || /bbox=([-\d.]+),([-\d.]+),([-\d.]+),([-\d.]+)/.exec(href);
			if (!m) { return null; }
			const w = +m[3] - +m[1], z = Math.round(Math.log2(2 * HALF / w));
			return { z, x: Math.floor(((+m[1] + +m[3]) / 2 + HALF) / w), y: Math.floor((HALF - (+m[2] + +m[4]) / 2) / w) };
		}
		function streetAt(ad) {
			return street.filter((s) => s.href.indexOf('/' + ad.z + '/' + ad.x + '/' + ad.y + '.png') >= 0)[0];
		}
		const offs = [];
		[0, 1, 2, 3].forEach((i) => {
			let bad = 0, unmatched = 0, absWrong = 0, off = null;
			byLayer[i].forEach((t) => {
				const ad = address(i, t.href), s = ad && streetAt(ad);
				if (!ad) { bad++; return; }
				// Where the tile address itself puts it: west edge in degrees, 360 / 2^z wide.
				const lonW = ad.x / Math.pow(2, ad.z) * 360 - 180;
				// The drawing is shifted by the document's origin, one number for every tile, so the
				// west edge minus that shift is the tile address's own longitude.
				if (off === null) { off = t.x - lonW; }
				if (Math.abs(t.x - lonW - off) > 1e-6 || Math.abs(t.w - 360 / Math.pow(2, ad.z)) > 1e-6) { absWrong++; }
				if (!s) { unmatched++; return; }
				if (Math.abs(s.x - t.x) > 1e-9 || Math.abs(s.y - t.y) > 1e-9 || Math.abs(s.w - t.w) > 1e-9 || Math.abs(s.h - t.h) > 1e-9) { bad++; }
			});
			offs.push(off);
			ok('layer ' + (i + 1) + ': every tile sits where its own address says', absWrong === 0, absWrong + ' wrong');
			ok('layer ' + (i + 1) + ': and where the street map\'s tile of that address sits', bad === 0 && unmatched === 0, bad + ' off, ' + unmatched + ' with no street tile');
			ok('layer ' + (i + 1) + ': drawn without crossorigin, so a server with no CORS still draws', byLayer[i].every((t) => t.crossorigin === null));
		});
		ok('all four layers share one origin shift (the same ground)', offs.every((o) => Math.abs(o - offs[0]) < 1e-9), offs.join(' '));
		const reqs = await requests();
		ok('the tiled service was asked at /tile', reqs.some((r) => /^\/arc\/tiled\/MapServer\/tile\/\d+\/\d+\/\d+$/.test(r)));
		ok('...and its /export was never used', !reqs.some((r) => /^\/arc\/tiled\/MapServer\/export/.test(r)));
		ok('the untiled service was asked at /export with bboxSR=3857 and imageSR=3857', reqs.some((r) => /^\/arc\/export\/MapServer\/export\?.*bboxSR=3857&imageSR=3857.*format=png&transparent=true/.test(r)));
		ok('...and its /tile was never used', !reqs.some((r) => /^\/arc\/export\/MapServer\/tile/.test(r)));
		ok('the WMS was asked for GetMap of roads in EPSG:3857', reqs.some((r) => /^\/wms\?.*REQUEST=GetMap.*LAYERS=roads.*SRS=EPSG:3857/.test(r)));

		const order = await page.evaluate(() => {
			const kids = Array.from(document.querySelector('.lpn-basemap').parentNode.children).map((c) => c.getAttribute('class') || '');
			return { bm: kids.indexOf('lpn-basemap'), gis: kids.indexOf('lpn-gis'), bd: kids.indexOf('lpn-backdrop'), model: kids.length - 1,
				layers: Array.from(document.querySelectorAll('.lpn-gis-layer')).map((g) => (g.querySelector('image') || { getAttribute: () => '' }).getAttribute('href').replace(/^http:\/\/127\.0\.0\.1:\d+/, '').split(/[?\/]/)[1]) };
		});
		ok('the layers sit above the street map and below the backdrop and the network', order.bm >= 0 && order.gis === order.bm + 1 && order.bd === order.gis + 1, JSON.stringify(order));
		ok('and are drawn in the order they were added', order.layers.join(',') === 'xyz,wms,arc,arc', order.layers.join(','));

		console.log('\n--- 4. the attribution line ---');
		const credit = await page.evaluate(() => { const c = document.querySelector('#lpn_basemap_credit [data-gis-credit]'); return c ? { text: c.textContent, shown: getComputedStyle(c).display !== 'none' } : null; });
		ok('the line shows what the tiled service states', !!credit && credit.shown && credit.text.indexOf('Fake County GIS 2026') >= 0, credit && credit.text);
		ok('...what the untiled one states', !!credit && credit.text.indexOf('Fake Export Dept') >= 0);
		ok('...and the host of the XYZ and WMS servers', !!credit && credit.text.indexOf('127.0.0.1:' + stub.port) >= 0);

		console.log('\n--- 5. opacity and on/off ---');
		await page.fill('.lpn-gis-opacity >> nth=0', '0.5');
		await page.dispatchEvent('.lpn-gis-opacity >> nth=0', 'change');
		await a.settle(600);
		ok('opacity 0.5 reaches the layer', await page.evaluate(() => document.querySelectorAll('.lpn-gis-layer')[0].getAttribute('opacity')) === '0.5');
		await page.uncheck('.lpn-gis-on >> nth=1');
		await a.settle(600);
		ok('off hides the second layer and not the others', await page.evaluate(() => Array.from(document.querySelectorAll('.lpn-gis-layer')).map((g) => g.style.display === 'none').join()) === 'false,true,false,false');
		await page.check('.lpn-gis-on >> nth=1');
		await a.settle(600);

		console.log('\n--- 6. the project carries them ---');
		const saved = JSON.parse(await stored());
		ok('the saved project holds the four layers, in order', Array.isArray(saved.project.gisLayers) && saved.project.gisLayers.map((l) => l.kind).join() === 'xyz,wms,arcgis,arcgis', JSON.stringify(saved.project.gisLayers));
		ok('...with their opacity and address', saved.project.gisLayers[0].opacity === 0.5 && saved.project.gisLayers[1].layers === 'roads' && saved.project.gisLayers[2].url === S + '/arc/tiled/MapServer');
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await a.settle(2500);
		const again = await page.evaluate(READ_TILES);
		ok('after a reload the layers draw again', [0, 1, 2, 3].every((i) => again.some((t) => t.layer === i)), again.length + ' tiles');
		ok('...and the credit is back', await page.evaluate(() => (document.querySelector('[data-gis-credit]') || {}).textContent.indexOf('Fake County GIS 2026') >= 0));

		console.log('\n--- 7. the project without layers is as it was ---');
		for (let i = 0; i < 4; i++) { await page.click('.lpn-gis-remove >> nth=0'); await a.settle(500); }
		await a.settle(800);
		const after = await stored();
		ok('no layers draw', (await page.evaluate(READ_TILES)).length === 0);
		ok('the saved project has no gisLayers', after.indexOf('gisLayers') < 0);
		ok('...and is exactly the text it was before the first layer', after === before, 'before ' + before.length + ' bytes, after ' + after.length);

		console.log('\n--- 8. a server that refuses, and one that is not there ---');
		await addLayer('xyz', S + '/refuse/{z}/{x}/{y}.png');
		await a.settle(3500);
		const n1 = await a.notice();
		ok('the refusing server is named in a message', n1.indexOf('127.0.0.1:' + stub.port) >= 0 && /did not return/.test(n1), n1);
		ok('nothing is drawn for it', (await page.evaluate(READ_TILES)).length === 0);
		await addLayer('xyz', 'http://127.0.0.1:' + dead + '/{z}/{x}/{y}.png');
		await a.settle(3500);
		const n2 = await a.notice();
		ok('the missing server is named in a message', n2.indexOf('127.0.0.1:' + dead) >= 0, n2);
		await addLayer('xyz', S + '/xyz/{z}/{x}/{y}.png');
		await a.settle(1500);
		ok('a good layer added after them still draws', (await page.evaluate(READ_TILES)).some((t) => t.href.indexOf('/xyz/') >= 0));
		ok('the street map is untouched', (await page.evaluate(READ_STREET)).length > 0);
		ok('a bad address is refused in words and adds nothing', await (async () => {
			const n = (await page.evaluate(READ_TILES)).length;
			await page.fill('#lpn_gis_url', 'ftp://example.org/{z}/{x}/{y}.png');
			await page.click('#lpn_gis_add');
			await a.settle(300);
			return (await a.notice()).indexOf('https://') >= 0 && (await page.evaluate(READ_TILES)).length === n;
		})());

		console.log('\n--- 9. a screenshot drops the tiles it cannot read, and says so ---');
		await page.keyboard.press('Escape');
		await a.settle(300);
		await page.evaluate(() => { const b = document.getElementById('lpn_setbox_close') || document.querySelector('#lpn_setbox .lpn-popover-x'); if (b) { b.click(); } });
		await a.settle(300);
		const errsBefore = a.errors.length;
		await a.menuClick(await a.lang('lpn_screenshot_menu'), 'map');
		await page.waitForSelector('.lpn-snip-veil', { state: 'visible' });
		const box = await page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await page.mouse.click(box.x, box.y);
		await page.waitForSelector('#lpn_snip_copy', { state: 'visible', timeout: 15000 });
		const nsnip = await a.notice();
		ok('the screenshot opened and said a background layer was left out', nsnip === await a.lang('lpn_screenshot_no_gis'), nsnip);
		ok('no page errors', a.errors.length === errsBefore && a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
		stub.proc.kill();
		try { fs.unlinkSync(stub.logFile); } catch (e) { /* none */ }
	}
	console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
