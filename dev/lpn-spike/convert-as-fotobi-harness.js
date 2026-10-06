// FILE, CONVERT AS... LEAVES THE ORIGINAL AS IT WAS -- ROADMAP Task 775, in a real Chrome.
//
//   node dev/lpn-spike/convert-as-fotobi-harness.js
//
// Tom, 2026-10-06, on a lat/lon project at Fotobi, Ghana:
//   (1) "I used File, Convert as... on a project in Fotobi, Ghana to change it from WGS84 to WGS84
//       Pseudo Mercator. The old project lost its node symbols. I got them back by closing and
//       opening again. Note that when I first switched back to it after conversion, it was zoomed
//       to the wrong place."
//   (3) "File, Convert as on a project that has no objects causes a file Open dialog"
//
// What it holds:
//   1. Fotobi opened from a file, Convert as with the chooser's EPSG:3857 row, then back to the
//      original through its tab: every node symbol is drawn, on the screen where it was before.
//   2. The same through a conversion that DOES change the coordinate system (UTM zone 30N) and is
//      then cancelled in the placement steps: the original is drawn whole, where it was.
//   3. An empty project: Convert as opens the Convert as box, never a file picker, and Convert
//      makes the copy on the system asked for.
//
// No network: OpenStreetMap tiles are answered locally by a route.
//
// **DO NOT PREFIX THIS WITH `flock`.** It launches Chromium, so it takes /tmp/engcalcs-browser.lock
// itself by re-executing under flock, as convert-as-browser-harness.js does.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_CONVAS_FOTOBI_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('convert-as-fotobi-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('convert-as-fotobi-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a conversion failure; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('convert-as-fotobi-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

// A small lat/lon network at Fotobi, Ghana: a reservoir and six junctions on a loop with a tail.
function fotobi() {
	const at = [
		['R1', 'reservoir', -0.3060, 6.1040], ['J1', 'junction', -0.3040, 6.1030], ['J2', 'junction', -0.3010, 6.1032],
		['J3', 'junction', -0.3008, 6.1005], ['J4', 'junction', -0.3038, 6.1002], ['J5', 'junction', -0.2985, 6.0990],
		['J6', 'junction', -0.2970, 6.1015]
	];
	const nodes = at.map(([id, type, x, y]) => type === 'reservoir'
		? { id, type, x, y, head: 120 }
		: { id, type, x, y, elev: 80, _demand: 1 });
	const pipe = (id, from, to) => ({ id, type: 'pipe', from, to, verts: [], _diameter: 150, _roughness: 120, _length: 300,
		lenAuto: false, _status: 'open', _k: 0 });
	return {
		format: 'hawsedc-lpn', v: 11,
		project: { name: 'Fotobi', activeScenario: 'base', coords: 'geo', basemap: 'osm' },
		scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
		nodes,
		links: [pipe('P1', 'R1', 'J1'), pipe('P2', 'J1', 'J2'), pipe('P3', 'J2', 'J3'), pipe('P4', 'J3', 'J4'),
			pipe('P5', 'J4', 'J1'), pipe('P6', 'J3', 'J5'), pipe('P7', 'J2', 'J6')],
		units: { lpn_u_length: 'm', lpn_u_diameter: 'mm', lpn_u_elevhead: 'mh2o', lpn_u_pressure: 'kpa',
			lpn_u_flow: 'lps', lpn_u_velocity: 'mps', lpn_u_gradient: 'gradePercent', lpn_u_roughness: 'mm', lpn_u_age: 'hr' }
	};
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('convert-as-fotobi-harness: playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('convert-as-fotobi-harness: no Chromium found (set CHROME_PATH). SKIPPING rather than failing on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'A');
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) =>
			route.fulfill({ status: 200, contentType: 'image/png', body: PNG }));
		const S = (k) => a.lang(k);
		const index = () => page.evaluate(() => JSON.parse(localStorage.getItem('lpn_index') || '{}'));
		const stored = (id) => page.evaluate((i) => JSON.parse(localStorage.getItem('lpn_project_' + i) || 'null'), id);
		const bytes = async (id) => { const s = await stored(id); if (!s) { return null; } delete s.view; return JSON.stringify(s); };
		const tabName = async () => { const ix = await index(); const e = (ix.projects || []).find((p) => p.id === ix.openId); return e ? e.name : null; };
		async function switchTo(name) {
			for (const t of await page.$$('#lpn_tabs .lpn-tab')) {
				const n = await t.$('.lpn-tab-name');
				const txt = n ? await n.evaluate((e) => Array.from(e.childNodes).filter((c) => c.nodeType === 3).map((c) => c.textContent).join('').trim()) : '';
				if (n && (txt === name || txt === name + '.lwn')) { await n.click(); await a.settle(900); return true; }
			}
			return false;
		}
		// **WHAT THE EYE SEES OF THE OPEN PROJECT**: the node symbols in the drawing that is on
		// screen (other tabs keep theirs hidden beside it, Task 680) that actually have a box, and
		// where each one is on the screen.
		const seen = () => page.evaluate(() => {
			const at = {}, c = document.getElementById('lpn_canvas').getBoundingClientRect();
			const shown = (el) => { for (let e = el; e; e = e.parentElement) { if (getComputedStyle(e).display === 'none') { return false; } } return true; };
			let n = 0;
			document.querySelectorAll('#lpn_canvas circle.lpn-node[data-node]').forEach((el) => {
				if (!shown(el) || getComputedStyle(el).visibility === 'hidden') { return; }
				const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
				if (r.width > 0.5 && r.height > 0.5 && x >= c.left && x <= c.right && y >= c.top && y <= c.bottom) {
					n++;
					const cs = getComputedStyle(el);
					at[el.getAttribute('data-node')] = { x, y, paint: [cs.fill, cs.stroke, cs.opacity, cs.fillOpacity, cs.strokeWidth, Math.round(r.width * 10) / 10].join('|') };
				}
			});
			// The reservoir's and tank's own drawn symbol, which is a separate box over the disc.
			const sym = {};
			document.querySelectorAll('#lpn_canvas g.lpn-node-symbol-box').forEach((el, i) => {
				if (!shown(el) || getComputedStyle(el).visibility === 'hidden') { return; }
				const r = el.getBoundingClientRect();
				sym['s' + i] = { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
			});
			return { n, at, sym };
		});
		const drift = (p, q) => {
			let worst = 0;
			Object.keys(p.at).forEach((k) => {
				if (!q.at[k]) { worst = Infinity; return; }
				worst = Math.max(worst, Math.hypot(p.at[k].x - q.at[k].x, p.at[k].y - q.at[k].y));
				if (p.at[k].paint !== q.at[k].paint) { console.log('    paint ' + k + ': ' + p.at[k].paint + ' -> ' + q.at[k].paint); worst = Math.max(worst, 999); }
			});
			return worst;
		};
		async function openConvertAs() {
			await a.menuClick(await S('lpn_file_convert_as'));
			await page.waitForSelector('#lpn_convas_panel', { state: 'visible', timeout: 4000 });
		}
		async function pickCrs(code) {
			await page.check('#lpn_convas_kind_epsg');
			await page.click('#lpn_convas_crs_pick');
			await page.waitForSelector('#lpn_crsbox', { state: 'visible' });
			await a.settle(600);
			const view = await page.$('#lpn_crsbox_view');
			if (view && await view.isChecked()) { await view.uncheck(); }
			await page.fill('#lpn_crsbox_name', code.replace('EPSG:', ''));
			await a.settle(300);
			await page.selectOption('#lpn_crsbox_list', code);
			await page.click('#lpn_crsbox_ok');
			await page.waitForSelector('#lpn_crsbox', { state: 'hidden' });
		}

		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.dismissGallery();

		console.log('\n--- 1. Fotobi: Convert as EPSG:3857, then back to the original ---');
		await a.writeFile('Fotobi.lwn', JSON.stringify(fotobi(), null, '\t'));
		await a.queuePick('Fotobi.lwn');
		await a.menuClick(await S('lpn_file_open'));
		await a.settle(300);
		await a.answerTrainingPanel();
		await a.settle(2000);
		const srcId = (await index()).openId, srcName = await tabName();
		const opened = await seen();
		ok('Fotobi is open, all seven nodes drawn', opened.n === 7, opened.n + ' symbols, tab ' + srcName);
		// Zoomed in and panned, as somebody working on it leaves it: the view is the original's own.
		{
			const c = await page.$eval('#lpn_canvas', (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
			await page.mouse.move(c.x, c.y);
			for (let i = 0; i < 3; i++) { await page.mouse.wheel(0, -240); await page.waitForTimeout(120); }
			await a.settle(800);
			await page.mouse.move(c.x, c.y); await page.mouse.down();
			await page.mouse.move(c.x + 60, c.y + 40, { steps: 6 }); await page.mouse.up();
			await a.settle(900);
		}
		const before = await seen(), srcBytes = await bytes(srcId);
		const starOf = (nm) => page.$$eval('#lpn_tabs .lpn-tab-name', (ts, nm) => { const t = ts.find((e) => e.textContent.indexOf(nm) >= 0 && e.textContent.indexOf('Copy') < 0); return t ? (t.getAttribute('data-bs-original-title') || t.title) : null; }, nm);
		const srcTitle = await starOf('Fotobi');
		await openConvertAs();
		await pickCrs('EPSG:3857');
		await page.click('#lpn_convas_ok');
		await a.settle(1500);
		ok('a copy is open in a new tab', (await index()).openId !== srcId, await tabName());
		const copy = await seen();
		// Worked in for a moment, as anybody looks at what they just made: zoomed out a notch.
		{
			const c = await page.$eval('#lpn_canvas', (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 3, y: r.top + r.height / 3 }; });
			await page.mouse.move(c.x, c.y);
			for (let i = 0; i < 2; i++) { await page.mouse.wheel(0, 240); await page.waitForTimeout(120); }
			await a.settle(800);
		}
		ok('the copy draws every node symbol', copy.n === before.n, copy.n + ' of ' + before.n);
		ok('back on the original through its tab', await switchTo(srcName) && (await index()).openId === srcId);
		const back = await seen();
		ok('Tom (1): the original still draws every node symbol', back.n === before.n, back.n + ' of ' + before.n);
		ok('Tom (1): ...and each where it was on the screen (the same view)', drift(before, back) < 1.5,
			drift(before, back).toFixed(2) + ' px');
		ok('Tom (1): ...and the reservoir symbol is drawn, at the size and place it was',
			JSON.stringify(Object.values(before.sym).map((r) => [Math.round(r.x), Math.round(r.y), Math.round(r.w)])) ===
			JSON.stringify(Object.values(back.sym).map((r) => [Math.round(r.x), Math.round(r.y), Math.round(r.w)])) && Object.keys(back.sym).length > 0,
			JSON.stringify(before.sym) + ' -> ' + JSON.stringify(back.sym));
		ok('the original\'s stored bytes are untouched', await bytes(srcId) === srcBytes);
		ok('...and its tab says what it said before (no new unsaved mark)', await starOf('Fotobi') === srcTitle, srcTitle + ' -> ' + await starOf('Fotobi'));

		console.log('\n--- 2. Fotobi: Convert as UTM zone 30N, cancelled in the placement steps ---');
		await openConvertAs();
		await pickCrs('EPSG:32630');
		await page.click('#lpn_convas_ok');
		await a.settle(1500);
		const bar = await page.$eval('#lpn_georef_bar', (e) => e.style.display !== 'none').catch(() => false);
		ok('the placement steps opened on the copy', bar);
		if (bar) { await page.click('#lpn_georef_cancel'); await a.settle(1200); }
		ok('Cancel returns to the original', (await index()).openId === srcId);
		const back2 = await seen();
		ok('the original still draws every node symbol', back2.n === before.n, back2.n + ' of ' + before.n);
		ok('...each where it was on the screen', drift(before, back2) < 1.5, drift(before, back2).toFixed(2) + ' px');
		ok('...and its stored bytes are untouched', await bytes(srcId) === srcBytes);

		console.log('\n--- 2b. Fotobi: Convert as UTM zone 30N, placed and kept, then back to the original ---');
		await openConvertAs();
		await pickCrs('EPSG:32630');
		await page.click('#lpn_convas_ok');
		await a.settle(1500);
		const bar2 = await page.$eval('#lpn_georef_bar', (e) => e.style.display !== 'none').catch(() => false);
		ok('the placement steps opened on the copy', bar2);
		if (bar2) {
			await page.click('#lpn_georef_drop'); await a.settle(800);
			await page.click('#lpn_georef_finish'); await a.settle(1500);
		}
		const utmId = (await index()).openId, utmDoc = await stored(utmId);
		ok('the copy is on UTM zone 30N', utmId !== srcId && !!utmDoc && utmDoc.project.crs === 'EPSG:32630',
			utmDoc ? JSON.stringify({ crs: utmDoc.project.crs, coords: utmDoc.project.coords }) : 'none');
		const utmSeen = await seen();
		ok('the copy draws every node symbol', utmSeen.n === 7, utmSeen.n + ' of 7');
		ok('back on the original through its tab', await switchTo(srcName) && (await index()).openId === srcId);
		const back3 = await seen();
		ok('Tom (1): the original still draws every node symbol', back3.n === before.n, back3.n + ' of ' + before.n);
		ok('Tom (1): ...each where it was on the screen (the same view)', drift(before, back3) < 1.5, drift(before, back3).toFixed(2) + ' px');
		ok('Tom (1): ...and the reservoir symbol where it was',
			JSON.stringify(Object.values(before.sym).map((r) => [Math.round(r.x), Math.round(r.y), Math.round(r.w)])) ===
			JSON.stringify(Object.values(back3.sym).map((r) => [Math.round(r.x), Math.round(r.y), Math.round(r.w)])),
			JSON.stringify(before.sym) + ' -> ' + JSON.stringify(back3.sym));
		ok('...and its stored bytes are untouched', await bytes(srcId) === srcBytes);

		console.log('\n--- 4. A lat/lon project drawn in this session: Convert as EPSG:3857, then back ---');
		await a.newGeoProject('si');
		await a.dismissGallery();
		{
			const c = await page.$eval('#lpn_canvas', (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
			for (let i = 0; i < 10; i++) { await page.mouse.move(c.x, c.y); await page.mouse.wheel(0, -120); }
			await a.settle(600);
		}
		for (let i = 0; i < 4; i++) { await a.makeEdit(); }
		await a.settle(800);
		const drawnId = (await index()).openId, drawnName = await tabName();
		const d0 = await seen();
		ok('four junctions drawn', d0.n === 4, d0.n + ' in ' + drawnName);
		await openConvertAs();
		await pickCrs('EPSG:3857');
		await page.click('#lpn_convas_ok');
		await a.settle(1500);
		ok('a copy is open', (await index()).openId !== drawnId, await tabName());
		ok('back on the drawn project through its tab', await switchTo(drawnName) && (await index()).openId === drawnId);
		const d1 = await seen();
		ok('Tom (1): it still draws every node symbol', d1.n === d0.n, d1.n + ' of ' + d0.n);
		ok('Tom (1): ...each where it was on the screen', drift(d0, d1) < 1.5, drift(d0, d1).toFixed(2) + ' px');

		console.log('\n--- 3. An empty project: the Convert as box, never a file picker ---');
		await a.newProject('us');
		const emptyId = (await index()).openId;
		const picks0 = (await a.pickerCalls()).length;
		let fileInputClicked = false;
		await page.exposeFunction('__convasFileClick', () => { fileInputClicked = true; });
		await page.evaluate(() => {
			const i = document.getElementById('lpn_geo_file');
			if (i) { i.addEventListener('click', (e) => { e.preventDefault(); window.__convasFileClick(); }, true); }
		});
		await a.menuClick(await S('lpn_file_convert_as'));
		await a.settle(400);
		const boxOpen = await page.$eval('#lpn_convas_panel', (e) => e.style.display !== 'none').catch(() => false);
		ok('Tom (3): Convert as on an empty project opens the Convert as box', boxOpen);
		ok('Tom (3): ...and no file picker', !fileInputClicked && (await a.pickerCalls()).length === picks0);
		if (boxOpen) {
			await pickCrs('EPSG:32630');
			await page.click('#lpn_convas_ok');
			await a.settle(1200);
			const ix = await index(), cp = await stored(ix.openId);
			ok('Convert makes a copy in a new tab', ix.openId !== emptyId, await tabName());
			ok('...stated on the system asked for, with no placement steps for nothing to place',
				!!cp && cp.project.crs === 'EPSG:32630' &&
				!(await page.$eval('#lpn_georef_bar', (e) => e.style.display !== 'none').catch(() => false)),
				cp ? JSON.stringify({ crs: cp.project.crs, coords: cp.project.coords }) : 'none');
		}
		ok('no page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails === 0 ? 'ALL PASS (' + checks + ' checks)' : fails + ' of ' + checks + ' FAILED');
	process.exit(fails === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(1); });
