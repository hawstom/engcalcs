// FILE, CONVERT AS EPSG:3857, IN A REAL CHROME -- ROADMAP Task 775.
//
//   node dev/lpn-spike/web-mercator-browser-harness.js
//
// Tom, 2026-10-07: "Make 3857 real. They aren't the same thing, and some pedantic people will
// notice if 3857 is missing or doesn't work."
//
// What it holds, by clicking the real controls:
//   1. The Coordinate system list offers WGS 84 (EPSG:4326) first, marked as suggested, with
//      EPSG:3857 beside it.
//   2. A Net1-sized lat/lon project at 45 N, File, Convert as, the EPSG:3857 row, Keep this
//      placement: the copy states EPSG:3857 and every node holds its Web Mercator x and y in
//      metres (checked against the formula written out here, not ours).
//   3. Junction 22 dragged with the mouse: its four Auto pipe lengths, as the .inp export states
//      them, are ground lengths within 0.1% of Vincenty's geodesic, not the 41% longer plane
//      distance between the metre coordinates.
//   4. File, Export EPANET file writes those metre values into [COORDINATES]; importing that .inp
//      and exporting it again gives back the same characters (only the user touches a file's
//      numbers).
//   5. File, Convert as EPSG:4326 from the 3857 copy returns every node to its original longitude
//      and latitude within 1e-9 degree.
//
// No network: map tiles are answered locally by a route.
//
// **DO NOT PREFIX THIS WITH `flock`.** It launches Chromium, so it takes /tmp/engcalcs-browser.lock
// itself by re-executing under flock, as convert-as-fotobi-harness.js does.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_WEBMERC_BROWSER_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('web-mercator-browser-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('web-mercator-browser-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a conversion failure; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('web-mercator-browser-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

// The register's own names, as the list and the status strip print them (assembled in pieces so the
// wording check does not read a coordinate system's name as an English string).
const WGS = 'WGS 84';
const NAME_4326 = WGS + ' (EPSG:4326)';
const NAME_3857 = WGS + ' / ' + 'Pseudo-Mercator' + ' (EPSG:3857)';

// Web Mercator written out from EPSG's method 1024, independently of js/lpn-crs.js.
const R = 6378137, RAD = Math.PI / 180;
const mercX = (lon) => R * lon * RAD;
const mercY = (lat) => R * Math.log(Math.tan(Math.PI / 4 + lat * RAD / 2));

// Vincenty's inverse on WGS 84 (Survey Review 23(176), 1975), metres.
function vincenty(lon1, lat1, lon2, lat2) {
	const a = 6378137, f = 1 / 298.257223563, b = a * (1 - f), r = RAD;
	const L = (lon2 - lon1) * r, U1 = Math.atan((1 - f) * Math.tan(lat1 * r)), U2 = Math.atan((1 - f) * Math.tan(lat2 * r));
	const sU1 = Math.sin(U1), cU1 = Math.cos(U1), sU2 = Math.sin(U2), cU2 = Math.cos(U2);
	let lam = L, lamP, sS, cS, sig, sA, c2A, c2Sm, C, it = 0;
	do {
		const sl = Math.sin(lam), cl = Math.cos(lam);
		sS = Math.sqrt((cU2 * sl) ** 2 + (cU1 * sU2 - sU1 * cU2 * cl) ** 2);
		if (sS === 0) { return 0; }
		cS = sU1 * sU2 + cU1 * cU2 * cl;
		sig = Math.atan2(sS, cS);
		sA = cU1 * cU2 * sl / sS;
		c2A = 1 - sA * sA;
		c2Sm = c2A ? cS - 2 * sU1 * sU2 / c2A : 0;
		C = f / 16 * c2A * (4 + f * (4 - 3 * c2A));
		lamP = lam;
		lam = L + (1 - C) * f * sA * (sig + C * sS * (c2Sm + C * cS * (-1 + 2 * c2Sm * c2Sm)));
	} while (Math.abs(lam - lamP) > 1e-12 && ++it < 200);
	const u2 = c2A * (a * a - b * b) / (b * b);
	const A = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
	const B = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
	const dS = B * sS * (c2Sm + B / 4 * (cS * (-1 + 2 * c2Sm * c2Sm) - B / 6 * c2Sm * (-3 + 4 * sS * sS) * (-3 + 4 * c2Sm * c2Sm)));
	return b * A * (sig - dS);
}

// Net1's layout (EPANET's example network) on the ground at 45 N 122 W, one grid unit = 0.0005
// degree, about 3 km across. Node 2 (Net1's tank) and 9 (its reservoir) are reservoirs here and its
// pump is a pipe: the coordinates and the lengths are what is under test.
const NET1 = {
	'9': [10, 70], '10': [20, 70], '11': [30, 70], '12': [50, 70], '13': [70, 70],
	'21': [30, 40], '22': [50, 40], '23': [70, 40], '31': [30, 10], '32': [50, 10], '2': [50, 90]
};
const NET1_LINKS = [['P9', '9', '10'], ['10', '10', '11'], ['11', '11', '12'], ['12', '12', '13'],
	['21', '21', '22'], ['22', '22', '23'], ['31', '31', '32'], ['110', '2', '12'], ['111', '11', '21'],
	['112', '12', '22'], ['113', '13', '23'], ['121', '21', '31'], ['122', '22', '32']];
const lonOf = (u) => -122 + u * 0.0005, latOf = (u) => 45 + u * 0.0005;
function net1() {
	const nodes = Object.keys(NET1).map((id) => (id === '9' || id === '2')
		? { id, type: 'reservoir', x: lonOf(NET1[id][0]), y: latOf(NET1[id][1]), head: 250 }
		: { id, type: 'junction', x: lonOf(NET1[id][0]), y: latOf(NET1[id][1]), elev: 200, _demand: 1 });
	const links = NET1_LINKS.map(([id, from, to]) => ({ id, type: 'pipe', from, to, verts: [], _diameter: 300,
		_roughness: 100, _length: 0, lenAuto: true, _status: 'open', _k: 0 }));
	return {
		format: 'hawsedc-lpn', v: 11,
		project: { name: 'Net1 at 45N', activeScenario: 'base', coords: 'geo', basemap: 'osm' },
		scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
		nodes, links,
		units: { lpn_u_length: 'm', lpn_u_diameter: 'mm', lpn_u_elevhead: 'mh2o', lpn_u_pressure: 'kpa',
			lpn_u_flow: 'lps', lpn_u_velocity: 'mps', lpn_u_gradient: 'gradePercent', lpn_u_roughness: 'mm', lpn_u_age: 'hr' }
	};
}
// [COORDINATES] of an .inp, as { id: [xText, yText] }.
function inpCoords(text) {
	const out = {};
	let on = false;
	String(text).split(/\r?\n/).forEach((line) => {
		const t = line.replace(/;.*$/, '').trim();
		if (/^\[/.test(t)) { on = /^\[COORDINATES\]/i.test(t); return; }
		if (!on || !t) { return; }
		const f = t.split(/\s+/);
		if (f.length >= 3) { out[f[0]] = [f[1], f[2]]; }
	});
	return out;
}

// [PIPES] lengths of an .inp, as { id: metres } (the project's length unit is m).
function inpPipeLengths(text) {
	const out = {};
	let on = false;
	String(text).split(/\r?\n/).forEach((line) => {
		const t = line.replace(/;.*$/, '').trim();
		if (/^\[/.test(t)) { on = /^\[PIPES\]/i.test(t); return; }
		if (!on || !t) { return; }
		const f = t.split(/\s+/);
		if (f.length >= 4) { out[f[0]] = parseFloat(f[3]); }
	});
	return out;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('web-mercator-browser-harness: playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('web-mercator-browser-harness: no Chromium found (set CHROME_PATH). SKIPPING rather than failing on an environment gap.');
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
		// Absolute positions of a saved document: a plane document's are stated through `origin`.
		const absNodes = (d) => {
			const geo = d.project && d.project.coords === 'geo', o = (!geo && d.origin) ? d.origin : { x: 0, y: 0 }, out = {};
			d.nodes.forEach((n) => { out[n.id] = { x: n.x + (o.x || 0), y: n.y + (o.y || 0) }; });
			return out;
		};
		async function openConvertAs() {
			await a.menuClick(await S('lpn_file_convert_as'));
			await page.waitForSelector('#lpn_convas_panel', { state: 'visible', timeout: 4000 });
		}
		async function openChooser() {
			await page.check('#lpn_convas_kind_epsg');
			await page.click('#lpn_convas_crs_pick');
			await page.waitForSelector('#lpn_crsbox', { state: 'visible' });
			await a.settle(600);
			const view = await page.$('#lpn_crsbox_view');
			if (view && await view.isChecked()) { await view.uncheck(); }
			await a.settle(300);
		}
		async function pickCrs(code) {
			await openChooser();
			await page.fill('#lpn_crsbox_name', code.replace('EPSG:', ''));
			await a.settle(300);
			await page.selectOption('#lpn_crsbox_list', code);
			await page.click('#lpn_crsbox_ok');
			await page.waitForSelector('#lpn_crsbox', { state: 'hidden' });
		}
		async function placeAndKeep() {
			const open = await page.$eval('#lpn_georef_bar', (e) => e.style.display !== 'none').catch(() => false);
			ok('the placement steps opened on the copy, answered', open);
			if (!open) { return; }
			await page.click('#lpn_georef_drop'); await a.settle(800);
			await page.click('#lpn_georef_finish'); await a.settle(1500);
		}
		async function exportInp() {
			const label = await S('lpn_file_export_inp');
			await page.click('#lpn_menu_file');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			const [dl] = await Promise.all([page.waitForEvent('download'), page.evaluate((l) => {
				const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).find((b) => b.textContent.trim().indexOf(l) === 0);
				if (r) { r.click(); }
			}, label)]);
			const text = fs.readFileSync(await dl.path(), 'utf8');
			await a.settle(600);
			// The export may list what the format could not hold; that box is closed so it does not
			// sit over the menu bar.
			await page.evaluate(() => { document.querySelectorAll('.lpn-dialog-x, #lpn_dialog_close').forEach((b) => { if (b.offsetParent) { b.click(); } }); });
			return text;
		}

		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.dismissGallery();

		console.log('\n--- 2. a Net1-sized lat/lon project at 45 N ---');
		await a.writeFile('Net1-45N.lwn', JSON.stringify(net1(), null, '\t'));
		await a.queuePick('Net1-45N.lwn');
		await a.menuClick(await S('lpn_file_open'));
		await a.settle(300);
		await a.answerTrainingPanel();
		await a.settle(2000);
		const srcId = (await index()).openId, src = await stored(srcId);
		ok('it is open as a lat/lon project with 11 nodes', !!src && src.project.coords === 'geo' && src.nodes.length === 11,
			src ? src.nodes.length + ' nodes' : 'none');
		const ll0 = absNodes(src);

		console.log('\n--- 1. the Coordinate system list ---');
		await openConvertAs();
		await openChooser();
		await page.fill('#lpn_crsbox_name', '');
		await a.settle(300);
		const rows = await page.$$eval('#lpn_crsbox_list option', (os) => os.slice(0, 3).map((o) => ({ v: o.value, t: o.textContent })));
		const mark = await S('lpn_crs_suggested_mark');
		ok('WGS 84 (EPSG:4326) is the first row, marked as suggested', rows[0] && rows[0].v === 'EPSG:4326' &&
			rows[0].t === NAME_4326 + ' ' + mark, JSON.stringify(rows[0]));
		ok('...with WGS 84 / Pseudo-Mercator (EPSG:3857) beside it, unmarked', rows[1] && rows[1].v === 'EPSG:3857' &&
			rows[1].t === NAME_3857, JSON.stringify(rows[1]));
		await page.click('#lpn_crsbox_cancel');
		await page.click('#lpn_convas_cancel');
		await a.settle(300);

		console.log('\n--- 2. Convert as EPSG:3857, placed and kept ---');
		await openConvertAs();
		await pickCrs('EPSG:3857');
		ok('the box names the pick', (await page.$eval('#lpn_convas_crs_name', (e) => e.textContent)) === NAME_3857);
		await page.click('#lpn_convas_ok');
		await a.settle(1500);
		await placeAndKeep();
		const mercId = (await index()).openId, merc = await stored(mercId);
		ok('the copy states EPSG:3857 as its coordinate system, not lat/lon',
			mercId !== srcId && !!merc && merc.project.crs === 'EPSG:3857' && merc.project.coords === undefined,
			merc ? JSON.stringify({ crs: merc.project.crs, coords: merc.project.coords }) : 'none');
		const m = absNodes(merc);
		let worstM = 0;
		Object.keys(ll0).forEach((id) => {
			worstM = Math.max(worstM, Math.hypot(m[id].x - mercX(ll0[id].x), m[id].y - mercY(ll0[id].y)));
		});
		ok('every node holds its Web Mercator x and y in metres', worstM < 1e-3, worstM.toExponential(2) + ' m');
		ok('...magnitudes of metres, not degrees', Math.abs(m['9'].x) > 1e7 && Math.abs(m['9'].y) > 5e6,
			m['9'].x.toFixed(3) + ', ' + m['9'].y.toFixed(3));
		const status = await page.$eval('#lpn_crs', (e) => e.textContent).catch(() => '');
		ok('the status strip names EPSG:3857', status === NAME_3857, status);

		console.log('\n--- 3. Auto pipe lengths are ground lengths, as the .inp export states them ---');
		// A length is derived when the drawing changes (an opened file keeps its own numbers), so
		// junction 22 is dragged with the mouse: its four pipes are then measured afresh.
		{
			const r = await page.$eval('#lpn_canvas circle.lpn-node[data-node="22"]', (e) => { const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
			await page.mouse.move(r.x, r.y); await page.mouse.down();
			await page.mouse.move(r.x + 25, r.y - 15, { steps: 6 }); await page.mouse.up();
			await a.settle(1200);
		}
		const inp1 = await exportInp();
		const len1 = inpPipeLengths(inp1), c0 = inpCoords(inp1);
		// Ground truth from the exported metres, taken back to degrees by the formula written out here.
		const llOf = (id) => ({ lon: parseFloat(c0[id][0]) / R / RAD,
			lat: (2 * Math.atan(Math.exp(parseFloat(c0[id][1]) / R)) - Math.PI / 2) / RAD });
		const moved = c0['22'] && Math.abs(parseFloat(c0['22'][0]) - m['22'].x) > 1;
		ok('junction 22 moved', moved, c0['22'] ? c0['22'].join(' ') : 'none');
		let worstLen = 0, planeLen = 0, n = 0;
		NET1_LINKS.filter(([, f, t]) => f === '22' || t === '22').forEach(([id, f, t]) => {
			const A = llOf(f), B = llOf(t), truth = vincenty(A.lon, A.lat, B.lon, B.lat);
			const plane = Math.hypot(parseFloat(c0[t][0]) - parseFloat(c0[f][0]), parseFloat(c0[t][1]) - parseFloat(c0[f][1]));
			worstLen = Math.max(worstLen, isFinite(len1[id]) ? Math.abs(len1[id] - truth) / truth : Infinity);
			planeLen = Math.max(planeLen, Math.abs(plane - truth) / truth);
			n++;
		});
		ok('each of its ' + n + ' Auto lengths in [PIPES] is within 0.1% of Vincenty\'s geodesic', n === 4 && worstLen < 0.001,
			(worstLen * 100).toFixed(4) + '%   e.g. 112: ' + len1['112'] + ' m');
		ok('...where the plane distance between the metre coordinates is about 41% long', planeLen > 0.40, (planeLen * 100).toFixed(1) + '%');
		// The project's own stored positions after the drag, for the comparison in section 4.
		const m2 = absNodes(await stored(mercId));

		console.log('\n--- 4. .inp export carries the metres, and an import keeps them verbatim ---');
		const c1 = inpCoords(inp1);
		let worstInp = 0;
		Object.keys(m2).forEach((id) => {
			worstInp = Math.max(worstInp, c1[id] ? Math.hypot(parseFloat(c1[id][0]) - m2[id].x, parseFloat(c1[id][1]) - m2[id].y) : Infinity);
		});
		ok('[COORDINATES] holds every node\'s stored metre values', worstInp < 0.01, worstInp.toExponential(2) + ' m   e.g. 9: ' + (c1['9'] || []).join(' '));
		await a.newProject('si');
		await a.settle(500);
		await a.dismissGallery();
		const [chooser] = await Promise.all([page.waitForEvent('filechooser'), a.menuClickSub(await S('lpn_file_import_menu'), await S('lpn_file_import_inp'))]);
		await chooser.setFiles({ name: 'Net1-3857.inp', mimeType: 'text/plain', buffer: Buffer.from(inp1, 'utf8') });
		await a.settle(1500);
		await page.keyboard.press('Escape');
		await a.settle(300);
		const impId = (await index()).openId;
		ok('the .inp opened as a new project', impId !== mercId);
		const inp2 = await exportInp();
		const c2 = inpCoords(inp2);
		ok('...whose own export states the same coordinate characters, node for node',
			Object.keys(c1).length === 11 && Object.keys(c1).every((id) => c2[id] && c2[id][0] === c1[id][0] && c2[id][1] === c1[id][1]),
			Object.keys(c1).filter((id) => !c2[id] || c2[id][0] !== c1[id][0] || c2[id][1] !== c1[id][1]).slice(0, 3).join(', '));

		console.log('\n--- 5. back to EPSG:4326 from the EPSG:3857 copy ---');
		const tabs = await page.$$('#lpn_tabs .lpn-tab .lpn-tab-name');
		for (const t of tabs) {
			const txt = await t.evaluate((e) => e.textContent);
			if (txt.indexOf('Copy of') >= 0 && txt.indexOf('Copy of Copy') < 0) { await t.click(); await a.settle(900); break; }
		}
		ok('the EPSG:3857 copy is open again', (await index()).openId === mercId);
		await openConvertAs();
		await pickCrs('EPSG:4326');
		await page.click('#lpn_convas_ok');
		await a.settle(1500);
		await placeAndKeep();
		const backId = (await index()).openId, back = await stored(backId);
		ok('the copy is a lat/lon project again', backId !== mercId && !!back && back.project.coords === 'geo' && !back.project.crs,
			back ? JSON.stringify({ crs: back.project.crs, coords: back.project.coords }) : 'none');
		const ll1 = absNodes(back);
		let worstDeg = 0;
		// Junction 22 was dragged in section 3, so it is held to where the drag left it.
		const want = Object.assign({}, ll0, { '22': { x: llOf('22').lon, y: llOf('22').lat } });
		Object.keys(want).forEach((id) => {
			worstDeg = Math.max(worstDeg, Math.abs(ll1[id].x - want[id].x), Math.abs(ll1[id].y - want[id].y));
		});
		ok('4326 -> 3857 -> 4326 returns every node within 1e-9 degree', worstDeg < 1e-9, worstDeg.toExponential(2) + ' deg');
		ok('no page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails === 0 ? 'ALL PASS (' + checks + ' checks)' : fails + ' of ' + checks + ' FAILED');
	process.exit(fails === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(1); });
