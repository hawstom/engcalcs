// DXF AND SHAPEFILE SHAPE IMPORT (ROADMAP Task 779), in a real Chrome, through the real File > Import rows.
//
//   node dev/lpn-spike/shape-import-harness.js
//
// Tom, 2026-10-12: *"feat/shape: Import from dxf and shapefile before merging."* Fixtures come from
// dev/lpn-spike/fixtures/make-shape-fixtures.js. Covered: counts, coordinates exact, closed against
// open, a multipart polyline and a multipoint becoming one Shape per part, the polygon's hole named,
// the skipped DXF entities and the skipped shapefile record named, the layer and the dBASE columns
// kept as properties, one Undo for a whole import, our own DXF export read back, and the coordinate
// rules: a grid project reads the numbers as its own, a latitude-and-longitude project refuses a DXF
// and a projected .prj that differs, a projected project refuses another EPSG code and converts
// latitude and longitude.
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SHAPE_IMPORT_LOCKED';
const NAME = 'shape-import-harness';

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

let checks = 0, failures = 0, Session;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

async function open(browser, url, name) {
	const a = await Session.open(browser, name || NAME, { viewport: { width: 1400, height: 900 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
	await a.goto(url || 'Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1000);
	return a;
}


const FX = path.join(REPO, 'dev', 'lpn-spike', 'fixtures');
const fx = (n) => ({ name: n, buffer: fs.readFileSync(path.join(FX, n)) });
const stage = (pairs) => pairs;

function helpers(a) {
	const P = a.page;
	const settle = (ms) => a.settle(ms || 300);
	const stored = async () => {
		await settle(450);
		return P.evaluate(() => {
			const idx = JSON.parse(localStorage.getItem('lpn_index') || '{}');
			return JSON.parse(localStorage.getItem('lpn_project_' + idx.openId) || 'null');
		});
	};
	const shapes = async () => ((await stored()).shapes || []);
	// One File > Import row, by the real menu and the real file chooser.
	const importVia = async (labelKey, files) => {
		await P.keyboard.press('Escape'); await P.keyboard.press('Escape');
		const [chooser] = await Promise.all([
			P.waitForEvent('filechooser', { timeout: 10000 }),
			a.menuClickSub(await a.lang('lpn_file_import_menu'), await a.lang(labelKey), 'file')
		]);
		await chooser.setFiles(files);
		await settle(1200);
		return a.notice();
	};
	const exportVia = async (key) => {
		const downloads = [];
		const onDl = (d) => downloads.push(d);
		P.on('download', onDl);
		await P.keyboard.press('Escape');
		await a.menuClickSub(await a.lang('lpn_file_export_menu'), await a.lang(key), 'file');
		const t0 = Date.now();
		while (!downloads.length && Date.now() - t0 < 15000) { await P.waitForTimeout(200); }
		await P.waitForTimeout(600);
		P.off('download', onDl);
		if (!downloads.length) { return null; }
		const p = await downloads[0].path();
		return p ? fs.readFileSync(p, 'utf8') : null;
	};
	const undo = async () => { await P.keyboard.press('Control+z'); await settle(500); };
	// A fresh project in UTM 12N, through the New project box and its coordinate system chooser.
	const newCrsProject = async (code) => {
		await a.menuClick(await a.lang('lpn_file_new'), 'file');
		await P.waitForSelector('#lpn_new_panel', { state: 'visible' });
		await P.check('#lpn_new_panel input[name="lpn_new_coords"][value="geo"]');
		await P.click('#lpn_new_crs_pick');
		await P.waitForSelector('#lpn_crsbox', { state: 'visible' });
		await a.settle(500);
		const view = await P.$('#lpn_crsbox_view');
		if (view && await view.isChecked()) { await view.uncheck(); }
		await P.fill('#lpn_crsbox_name', code);
		await a.settle(300);
		await P.selectOption('#lpn_crsbox_list', 'EPSG:' + code);
		await P.click('#lpn_crsbox_ok');
		await P.waitForSelector('#lpn_crsbox', { state: 'hidden' });
		await P.click('#lpn_new_us');
		await P.click('#lpn_new_create');
		await P.waitForSelector('#lpn_new_panel', { state: 'hidden' });
		await a.settle(800);
	};
	return { P, settle, stored, shapes, importVia, exportVia, undo, newCrsProject };
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await open(browser);
		const h = helpers(a), P = h.P;
		const L = (k) => a.lang(k);

		console.log('\n--- 1. a DXF into a grid project ---');
		await a.newProject('us');
		await a.dismissGallery().catch(() => {});
		await h.settle(500);
		let note = await h.importVia('lpn_file_import_dxf', fx('shapes-sample.dxf'));
		let sh = await h.shapes();
		ok('six Shapes: two points, a line, two LWPOLYLINEs and an old POLYLINE', sh.length === 6, JSON.stringify(sh.map((s) => [s.id, s.pts.length])));
		const byLayer = {}; sh.forEach((s) => { (byLayer[s.props && s.props.layer] = byLayer[s.props && s.props.layer] || []).push(s); });
		ok('each Shape carries its layer name', ['WELLS', 'MAIN', 'LOTS', 'PARCEL'].every((l) => byLayer[l]) && byLayer.WELLS.length === 2 && byLayer.MAIN.length === 2, Object.keys(byLayer).join());
		const ptsOf = (s) => s.pts.map((p) => [p.x, Math.abs(p.y)]);
		const w = byLayer.WELLS.find((s) => s.pts[0].x === 1000.5);
		ok('a point keeps its coordinates exactly, and the characters 1000.50 it was written as',
			!!w && w.pts.length === 1 && Math.abs(w.pts[0].y) === 2000.25 && w.pts[0].tok && w.pts[0].tok.x === '1000.50', JSON.stringify(w));
		const lots = byLayer.LOTS[0], parcel = byLayer.PARCEL[0], mainPoly = byLayer.MAIN.find((s) => s.pts.length === 4), line = byLayer.MAIN.find((s) => s.pts.length === 2);
		ok('the closed LWPOLYLINE is a polygon of four points, exact', lots.closed === true && lots.pts.length === 4 &&
			lots.pts[1].x === 200 && Math.abs(lots.pts[2].y) === 200, JSON.stringify(lots.pts));
		ok('the closed old-style POLYLINE is a polygon of three points', parcel.closed === true && parcel.pts.length === 3 && parcel.pts[2].x === 350);
		ok('the open LWPOLYLINE stays open with its four points; the LINE is open with two',
			mainPoly.closed === false && mainPoly.pts.length === 4 && mainPoly.pts[0].x === 0.5 && Math.abs(mainPoly.pts[0].y) === 0.25 &&
			line.closed === false && line.pts[1].x === 1200.5 && Math.abs(line.pts[1].y) === 2150.75);
		ok('the notice names the skipped entities with counts: CIRCLE (2), TEXT (1), and the block content',
			note.indexOf('CIRCLE (2)') >= 0 && note.indexOf('TEXT (1)') >= 0 && note.indexOf((await L('lpn_dxf_import_inblocks')) + ' (1)') >= 0, note);
		ok('...and says the coordinates were read as the X and Y of this project',
			note.indexOf((await L('lpn_shapes_import_frame')).replace('{frame}', await L('lpn_shapes_frame_xy'))) >= 0, note);
		ok('...and that the drawing is in feet, which matches, so no units line', note.indexOf((await L('lpn_dxf_import_units')).split('{theirs}')[0]) < 0, note);
		await h.undo();
		ok('one Undo takes the whole import back', (await h.shapes()).length === 0);
		// Our own DXF export, read back.
		note = await h.importVia('lpn_file_import_dxf', fx('shapes-sample.dxf'));
		const dxfOut = await h.exportVia('lpn_file_export_item_dxf');
		ok('the project exports a DXF with the Shapes on layer C-WATR-MODL-SHAP-BASE', !!dxfOut && dxfOut.indexOf('C-WATR-MODL-SHAP-BASE') >= 0);
		await a.newProject('us');
		await h.settle(600);
		note = await h.importVia('lpn_file_import_dxf', { name: 'ours.dxf', mimeType: 'application/dxf', buffer: Buffer.from(dxfOut || '') });
		sh = await h.shapes();
		ok('our own export reads back as six Shapes, each on the SHAP layer',
			sh.length === 6 && sh.every((s) => s.props && s.props.layer === 'C-WATR-MODL-SHAP-BASE'), JSON.stringify(sh.map((s) => s.props)));
		const lots2 = sh.find((s) => s.closed);
		ok('...with the same coordinates (a closed square of side 100 among them)', sh.some((s) => s.closed && s.pts.length === 4 && s.pts.some((p) => p.x === 200)), JSON.stringify(sh.map((s) => ptsOf(s))));

		console.log('\n--- 2. a shapefile into a grid project (no .prj) ---');
		await a.newProject('us');
		await h.settle(600);
		note = await h.importVia('lpn_file_import_shp', [fx('shapes-grid.shp'), fx('shapes-grid.dbf')]);
		sh = await h.shapes();
		ok('a .shp with its .dbf: two Shapes, IDs from the NAME column', sh.length === 2 && sh.some((s) => s.id === 'Hydrant') && sh.some((s) => s.id === 'Yard'), JSON.stringify(sh.map((s) => s.id)));
		const hy = sh.find((s) => s.id === 'Hydrant'), yard = sh.find((s) => s.id === 'Yard');
		ok('the point is exact', hy.pts.length === 1 && hy.pts[0].x === 1000.5 && Math.abs(hy.pts[0].y) === 2000.25 && hy.closed === false);
		ok('the polygon is closed with four points (the repeated last point is dropped)', yard.closed === true && yard.pts.length === 4 && yard.pts[2].x === 100);
		ok('the notice says there is no .prj and the numbers were read as the project\'s own',
			note.indexOf((await L('lpn_shp_import_noprj')).replace('{frame}', await L('lpn_shapes_frame_xy'))) >= 0, note);
		await h.undo();
		ok('one Undo takes it back', (await h.shapes()).length === 0);
		note = await h.importVia('lpn_file_import_shp', fx('shapes-geo-noprj.shp'));
		ok('a .shp alone also imports (seven Shapes: lon/lat numbers read as plain X and Y here)', (await h.shapes()).length === 7, note);
		await h.undo();
		note = await h.importVia('lpn_file_import_shp', fx('shapes-geo.zip'));
		ok('a geographic .prj into a grid project is refused, and nothing is made',
			(await h.shapes()).length === 0 && note === (await L('lpn_shp_import_refuse_local')).replace('{file}', 'shapes-geo.zip'), note);
		note = await h.importVia('lpn_file_import_shp', fx('shapes-utm10.zip'));
		sh = await h.shapes();
		ok('a projected .prj into a grid project is read as its X and Y and the .prj is named',
			sh.length === 1 && sh[0].pts[0].x === 500000.125 && note.indexOf('32610') >= 0, note);
		await h.undo();
		note = await h.importVia('lpn_file_import_dxf', { name: 'bad.dxf', buffer: Buffer.from('not a dxf') });
		ok('a file that is no DXF is said so and imports nothing', (await h.shapes()).length === 0 && note === (await L('lpn_dxf_import_unreadable')).replace('{file}', 'bad.dxf'), note);

		console.log('\n--- 3. the zip into a latitude-and-longitude project ---');
		await a.newGeoProject('us');
		await a.dismissGallery().catch(() => {});
		await h.settle(600);
		note = await h.importVia('lpn_file_import_shp', fx('shapes-geo.zip'));
		sh = await h.shapes();
		ok('seven Shapes: the point, two from the multipoint, two parts of the polyline, the polygon, the Z line', sh.length === 7, JSON.stringify(sh.map((s) => [s.id, s.pts.length, s.closed])));
		const poly = sh.find((s) => s.closed), pt1 = sh.find((s) => s.pts.length === 1 && s.pts[0].x === -112.0123);
		ok('the point is stored as the file\'s longitude and latitude, exactly', !!pt1 && pt1.pts[0].y === 33.4567, JSON.stringify(pt1));
		ok('the polygon is closed: four corners, its hole not imported', !!poly && poly.pts.length === 4 && poly.pts[0].x === -112 && poly.pts[1].y === 33.01, JSON.stringify(poly));
		ok('the two parts of the multipart polyline are open, three points and two', sh.filter((s) => !s.closed && s.pts.length === 3).length >= 1 && sh.some((s) => s.pts.length === 2 && s.pts[0].x === -112.4));
		ok('a name with a space is kept as the description (Well A)', sh.some((s) => s.desc === 'Well A'));
		const main1 = sh.filter((s) => s.desc === 'Main 1');
		ok('both parts of Main 1 keep the name and the dBASE columns as properties',
			main1.length === 2 && main1.every((s) => s.props && s.props.KIND === 'main' && s.props.DIAM === '12' && /^00000001\d\d$/.test(s.props.CODE)), JSON.stringify(main1.map((s) => s.props)));
		ok('the notice names the unread MultiPatch, the hole, the two multipart features and the columns',
			note.indexOf('MultiPatch (1)') >= 0 && note.indexOf((await L('lpn_geojson_import_holes_one'))) >= 0 &&
			note.indexOf((await L('lpn_geojson_import_parts')).replace('{n}', '2')) >= 0 && note.indexOf('KIND, DIAM, CODE') >= 0, note);
		ok('a numeric column keeps its source characters: 0000000170 is not 170', sh.some((x) => x.props.CODE === '0000000170'), JSON.stringify(sh.map((x) => x.props.CODE)));
		ok('seven kept names are listed five and then "and 2 more"', note.indexOf((await L('lpn_shapes_import_more')).replace('{n}', '2')) >= 0 && note.indexOf('Z line (S7)') < 0, note);
		await h.undo();
		ok('one Undo takes the seven back', (await h.shapes()).length === 0);
		note = await h.importVia('lpn_file_import_dxf', fx('shapes-sample.dxf'));
		ok('a DXF into a latitude-and-longitude project is refused', (await h.shapes()).length === 0 &&
			note === (await L('lpn_dxf_import_refuse_geo')).replace('{file}', 'shapes-sample.dxf'), note);
		note = await h.importVia('lpn_file_import_shp', fx('shapes-utm12.zip'));
		sh = await h.shapes();
		const want12 = await P.evaluate(() => EngCalcs.lpnCrsInverse('EPSG:32612', { x: 400000.125, y: 3700000.5 }));
		ok('a projected .prj into a latitude-and-longitude project is CONVERTED to longitude and latitude, and the notice says from what to what',
			sh.length === 1 && Math.abs(sh[0].pts[0].x - want12.lon) < 1e-9 && Math.abs(sh[0].pts[0].y - want12.lat) < 1e-9 &&
			note.indexOf((await L('lpn_shp_import_reprojected')).split('{theirs}')[0]) >= 0 && note.indexOf('EPSG:32612') >= 0 && note.indexOf(await L('lpn_shapes_frame_latlon')) >= 0, note + ' ' + JSON.stringify(sh[0] && sh[0].pts));
		ok('...and converted coordinates keep no source text', !(sh[0].pts[0].tok));
		await h.undo();
		const odd = { name: 'odd.prj', buffer: Buffer.from('PROJCS["Odd",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Hotine_Oblique_Mercator_Azimuth_Natural_Origin"],UNIT["Meter",1.0]]') };
		note = await h.importVia('lpn_file_import_shp', [Object.assign({}, fx('shapes-grid.shp'), { name: 'odd.shp' }), odd]);
		ok('a system the page cannot identify is the one case still refused', (await h.shapes()).length === 0 && note.indexOf('Odd') >= 0 && note.indexOf('nothing was converted') >= 0, note);
		note = await h.importVia('lpn_file_import_shp', fx('shapes-geo-noprj.shp'));
		ok('a .shp with no .prj and in-range numbers is read as latitude and longitude', (await h.shapes()).length === 7 &&
			note.indexOf((await L('lpn_shp_import_noprj')).replace('{frame}', await L('lpn_shapes_frame_latlon'))) >= 0, note);
		await h.undo();
		const pick = await L('lpn_shp_import_pick_hint');
		const dlg = () => P.evaluate(() => { const d = document.getElementById('lpn_dialog'); return d && getComputedStyle(d).display !== 'none' ? { text: document.getElementById('lpn_dialog_body').textContent, buttons: Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).map((b) => b.textContent) } : null; });
		const press = async (i) => { await P.evaluate((k) => { const b = document.querySelectorAll('#lpn_dialog_buttons button')[k]; b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }, i); await h.settle(800); };
		note = await h.importVia('lpn_file_import_shp', fx('shapes-huge.shp'));
		ok('a .shp with no .prj and numbers too large even for Web Mercator is refused, and the message says what to pick instead',
			(await h.shapes()).length === 0 && (await dlg()) === null && note === (await L('lpn_shp_import_refuse_range')).replace('{file}', 'shapes-huge.shp') + ' ' + pick, note);
		note = await h.importVia('lpn_file_import_shp', fx('shapes-grid.shp'));
		let d = await dlg();
		ok('numbers that fit Web Mercator but not degrees are offered as EPSG:3857 by a question with one action button',
			!!d && d.text.indexOf('EPSG:3857') >= 0 && d.text.indexOf(pick) >= 0 && d.buttons[0] === await L('lpn_shp_import_webmerc_ok'), JSON.stringify(d));
		await press(1);
		note = await a.notice();
		ok('Cancel imports nothing and says what to pick', (await h.shapes()).length === 0 && note.indexOf((await L('lpn_shp_import_refuse_range')).replace('{file}', 'shapes-grid.shp')) === 0 && note.indexOf(pick) >= 0, note);
		await h.importVia('lpn_file_import_shp', fx('shapes-webmerc-noprj.shp'));
		await press(0);
		note = await a.notice(); sh = await h.shapes();
		ok('the offered button imports them converted from EPSG:3857, exactly to the longitude and latitude they stand for',
			sh.length === 2 && Math.abs(sh.find((x) => x.pts.length === 1).pts[0].x + 112.0123) < 1e-8 && Math.abs(sh.find((x) => x.pts.length === 1).pts[0].y - 33.4567) < 1e-8 &&
			note.indexOf((await L('lpn_shp_import_reprojected')).split('{theirs}')[0]) >= 0 && note.indexOf('EPSG:3857') >= 0, note);
		await h.undo();
		note = await h.importVia('lpn_file_import_shp', fx('shapes-geo-noprj.shp'));
		ok('a no-.prj import that goes ahead also says what to pick', note.indexOf(pick) >= 0, note);
		await h.undo();
		for (const z of ['shapes-webmerc-qgis.zip', 'shapes-webmerc-ogc.zip']) {
			note = await h.importVia('lpn_file_import_shp', fx(z));
			sh = await h.shapes();
			ok(z + ' (a QGIS / GDAL EPSG:3857 .prj) is recognised and converted into a latitude-and-longitude project',
				sh.length === 2 && Math.abs(sh.find((x) => x.pts.length === 1).pts[0].x + 112.0123) < 1e-8 && Math.abs(sh.find((x) => x.pts.length === 1).pts[0].y - 33.4567) < 1e-8 &&
				note.indexOf('EPSG:3857') >= 0, note.slice(0, 300));
			await h.undo();
		}

		console.log('\n--- 4. into a project in UTM 12N ---');
		await h.newCrsProject('32612');
		await a.dismissGallery().catch(() => {});
		note = await h.importVia('lpn_file_import_shp', fx('shapes-geo.zip'));
		sh = await h.shapes();
		ok('latitude and longitude are converted: seven Shapes, and the notice says so', sh.length === 7 && note.indexOf((await L('lpn_shp_import_converted')).split('{crs}')[0]) >= 0, note);
		const A = await P.evaluate(() => ({ a: EngCalcs.lpnCrsForward('EPSG:32612', { lon: -112.0123, lat: 33.4567 }), b: EngCalcs.lpnCrsForward('EPSG:32612', { lon: -112.3, lat: 33.3 }) }));
		const sa = sh.find((s) => s.pts.length === 1 && s.desc === 'Well A'), sb = sh.find((s) => s.pts.length === 3 && s.desc === 'Main 1');
		const dStored = Math.hypot(sa.pts[0].x - sb.pts[0].x, sa.pts[0].y - sb.pts[0].y), dWant = Math.hypot(A.a.x - A.b.x, A.a.y - A.b.y);
		ok('...by the map\'s own transform (the distance between two points matches EPSG:32612 to a millimetre)', Math.abs(dStored - dWant) < 0.001, dStored + ' vs ' + dWant);
		await h.undo();
		note = await h.importVia('lpn_file_import_shp', fx('shapes-utm12.zip'));
		sh = await h.shapes();
		ok('a .prj stating the project\'s own EPSG:32612 is read unchanged, and said', sh.length === 1 && sh[0].pts[0].x + ((await h.stored()).origin || { x: 0 }).x === 400000.125 &&
			note.indexOf((await L('lpn_shp_import_prj_same')).split('{crs}')[0]) >= 0, note);
		await h.undo();
		note = await h.importVia('lpn_file_import_shp', fx('shapes-utm10.zip'));
		sh = await h.shapes();
		const w10 = await P.evaluate(() => EngCalcs.lpnCrsForward('EPSG:32612', EngCalcs.lpnCrsInverse('EPSG:32610', { x: 500000.125, y: 4000000.5 })));
		const o10 = (await h.stored()).origin || { x: 0, y: 0 };
		ok('a .prj stating EPSG:32610 into a UTM 12N project is converted (numbers agree with the suite\'s transform to a micrometre) and the notice says from and to',
			sh.length === 1 && Math.abs(sh[0].pts[0].x + o10.x - w10.x) < 1e-6 && (Math.abs(sh[0].pts[0].y + o10.y - w10.y) < 1e-6 || Math.abs(sh[0].pts[0].y - o10.y + w10.y) < 1e-6 || Math.abs(-sh[0].pts[0].y + o10.y - w10.y) < 1e-6) &&
			note.indexOf('EPSG:32610') >= 0 && note.indexOf('EPSG:32612') >= 0 && note.indexOf((await L('lpn_shp_import_reprojected')).split('{theirs}')[0]) >= 0, note + ' ' + JSON.stringify([sh[0] && sh[0].pts[0], w10, o10]));
		await h.undo();
		note = await h.importVia('lpn_file_import_dxf', fx('shapes-sample.dxf'));
		sh = await h.shapes();
		ok('a DXF is read as the project\'s own numbers, six Shapes, and a feet drawing in a metre project is said',
			sh.length === 6 && note.indexOf((await L('lpn_dxf_import_units')).split('{theirs}')[0]) >= 0 && note.indexOf('ft') >= 0, note);


		console.log('\n--- 5. real files: ArcGIS .prj, the Object Coordinate System, paper space, damage, deleted rows ---');
		await h.newCrsProject('32612');
		await a.dismissGallery().catch(() => {});
		const stk = [fx('gdal-Stacks.shp'), fx('gdal-Stacks.dbf'), fx('gdal-Stacks.prj')];
		note = await h.importVia('lpn_file_import_shp', stk);
		ok('an ArcGIS .prj (no EPSG code) into UTM 12N is converted by its parameters, and the notice names it',
			(await h.shapes()).length === 2 && note.indexOf('NAD_1983_StatePlane_Texas_South_Central') >= 0 &&
			note.indexOf((await L('lpn_shp_import_reprojected')).split('{theirs}')[0]) >= 0 && note.indexOf('Convert as') < 0, note);
		await h.undo();
		await h.newCrsProject('2278');
		await a.dismissGallery().catch(() => {});
		note = await h.importVia('lpn_file_import_shp', stk);
		sh = await h.shapes();
		ok('the same ArcGIS .prj into EPSG:2278 (Texas South Central, US ft) is recognised by its parameters: two Shapes, unchanged',
			sh.length === 2 && note.indexOf((await L('lpn_shp_import_prj_same')).split('{crs}')[0]) >= 0, note);
		ok('...the first coordinate exactly as the file wrote it', sh.some((s) => s.pts[0].tok && s.pts[0].tok.x === '3115478.809630728'));
		await h.undo();
		note = await h.importVia('lpn_file_import_dxf', fx('shapes-sample.dxf'));
		ok('a DXF in feet into a US-survey-foot project says nothing about units', (await h.shapes()).length === 6 &&
			note.indexOf((await L('lpn_dxf_import_units')).split('{theirs}')[0]) < 0 && note.indexOf('us-ft') < 0, note);
		await h.undo();
		await a.newProject('us');
		await h.settle(600);
		note = await h.importVia('lpn_file_import_dxf', fx('gdal-ocs2wcs1.dxf'));
		sh = await h.shapes();
		const tri = (xs) => sh.some((s) => s.closed && s.pts.length === 3 && JSON.stringify(s.pts.map((p) => [p.x, Math.abs(p.y)])) === JSON.stringify(xs));
		ok('mirrored (extrusion 0,0,-1) polylines land in the mirrored quadrant: (-1,1)(-2,1)(-1,2) and also the ordinary (1,1)(2,1)(1,2)',
			tri([[-1, 1], [-2, 1], [-1, 2]]) && tri([[1, 1], [2, 1], [1, 2]]), JSON.stringify(sh.map((s) => s.pts.map((p) => [p.x, p.y]))).slice(0, 400));
		await h.undo();
		note = await h.importVia('lpn_file_import_dxf', fx('gdal-LWPOLYLINE-OCS.dxf'));
		sh = await h.shapes();
		const xsAll = [].concat(...sh.map((s) => s.pts.map((p) => p.x)));
		ok('a survey drawing near 600000 stays near 600000 (no polyline thrown thousands of km by its OCS)', sh.length > 0 &&
			Math.min(...xsAll) > 590000 && Math.max(...xsAll) < 620000, Math.min(...xsAll) + ' to ' + Math.max(...xsAll));
		await h.undo();
		note = await h.importVia('lpn_file_import_dxf', fx('ezdxf-VP4.dxf'));
		sh = await h.shapes();
		ok('paper-space entities are not imported and are counted', sh.length === 2 && note.indexOf((await L('lpn_dxf_import_paperspace')) + ' (21)') >= 0, sh.length + ' ' + note);
		await h.undo();
		note = await h.importVia('lpn_file_import_shp', fx('gdal-truncated.shp'));
		ok('a cut-short .shp gives a notice, not silence, and imports nothing', (await h.shapes()).length === 0 &&
			note === (await L('lpn_shp_import_damaged')).replace('{file}', 'gdal-truncated.shp'), note);
		note = await h.importVia('lpn_file_import_shp', [fx('gdal-polydel-poly.shp'), fx('gdal-polydel-poly.dbf')]);
		sh = await h.shapes();
		ok('a record marked deleted in the .dbf is skipped and the notice says so (9 of 10)', sh.length === 9 &&
			note.indexOf(await L('lpn_shp_import_deleted_one')) >= 0, sh.length + ' ' + note.slice(0, 300));
		await h.undo();

		console.log('\n--- 6. naming, damage, unplaceable records, nothing imported ---');
		await h.newCrsProject('2278');
		await a.dismissGallery().catch(() => {});
		await h.importVia('lpn_file_import_shp', stk);
		sh = await h.shapes();
		ok('Stacks: the Name column names the Shapes ("4 level"), not the all-zero Id', sh.some((s) => s.desc === '4 level' || s.id === '4 level') && !sh.some((s) => s.id === '0'), JSON.stringify(sh.map((s) => [s.id, s.desc])));
		await h.undo();
		note = await h.importVia('lpn_file_import_shp', { name: 'corrupt.zip', mimeType: 'application/zip', buffer: Buffer.from('PK\u0003\u0004 this is not really a zip archive at all') });
		ok('a corrupt zip is said in the plain damaged-file sentence', note === (await L('lpn_shp_import_damaged')).replace('{file}', 'corrupt.zip'), note);
		note = await h.importVia('lpn_file_import_dxf', { name: 'circle.dxf', buffer: Buffer.from('0\nSECTION\n2\nENTITIES\n0\nCIRCLE\n8\n0\n10\n1\n20\n1\n40\n2\n0\nENDSEC\n0\nEOF\n') });
		ok('nothing imported reads as nothing imported, not "0 Shapes"', note.indexOf((await L('lpn_shapes_import_none')).replace('{file}', 'circle.dxf')) === 0 && note.indexOf('0 Shapes') < 0, note);
		await a.newGeoProject('us');
		await a.dismissGallery().catch(() => {});
		await h.settle(500);
		note = await h.importVia('lpn_file_import_shp', fx('shapes-highlat.shp'));
		ok('a record beyond the map latitude limit is named by record number with its reason, not as "2 (1)"', (await h.shapes()).length === 2 &&
			note.indexOf((await L('lpn_shp_import_unplaced_one')).split('{list}')[0]) >= 0 && note.indexOf('Record number: 2.') >= 0, note);
		await h.undo();
		note = await h.importVia('lpn_file_import_shp', fx('shapes-geo.zip'));
		ok('the unread MultiPatch sentence gives its reason', note.indexOf((await L('lpn_shp_import_skipped_one')).split('{list}')[0]) >= 0, note);


		console.log('\n--- 8. a QGIS EPSG:3857 .prj into projected projects ---');
		await h.newCrsProject('32612');
		await a.dismissGallery().catch(() => {});
		note = await h.importVia('lpn_file_import_shp', fx('shapes-webmerc-qgis.zip'));
		sh = await h.shapes();
		const w12 = await P.evaluate(() => EngCalcs.lpnCrsForward('EPSG:32612', { lon: -112.0123, lat: 33.4567 }));
		const o12 = (await h.stored()).origin || { x: 0, y: 0 }, p12 = sh.length ? sh.find((x) => x.pts.length === 1).pts[0] : null;
		ok('into UTM 12N it is converted, to the suite\'s transform within a millimetre', sh.length === 2 && Math.abs(p12.x + o12.x - w12.x) < 0.001 && note.indexOf('EPSG:3857') >= 0 && note.indexOf('EPSG:32612') >= 0, note.slice(0, 300) + JSON.stringify([p12, w12, o12]));
		await h.newCrsProject('3857');
		await a.dismissGallery().catch(() => {});
		note = await h.importVia('lpn_file_import_shp', fx('shapes-webmerc-qgis.zip'));
		sh = await h.shapes();
		ok('into a project that IS EPSG:3857 the numbers are kept unchanged and it says so',
			sh.length === 2 && note.indexOf((await L('lpn_shp_import_prj_same')).split('{crs}')[0]) >= 0, note.slice(0, 300));
		const inp = await P.evaluate(() => { const i = document.getElementById('lpn_shp_file'); return { accept: i.accept, multiple: i.multiple }; });
		ok('the shapefile chooser takes several files and all of .shp, .shx, .dbf, .prj and .zip', inp.multiple && ['.shp', '.shx', '.dbf', '.prj', '.zip'].every((e) => inp.accept.indexOf(e) >= 0), JSON.stringify(inp));
		console.log('\n--- 7. F is the Shape tool ---');
		await a.newProject('us');
		await a.dismissGallery().catch(() => {});
		await h.settle(500);
		await P.mouse.click(700, 500);
		await P.keyboard.press('Escape');
		await P.keyboard.press('f');
		await h.settle(250);
		const hint = await P.evaluate(() => (document.getElementById('lpn_mode_hint') || {}).textContent || '');
		ok('plain F starts the Shape tool', hint === await L('lpn_mode_add_shape'), hint);
		await P.keyboard.press('Escape'); await h.settle(150);
		const tipBtn = await P.evaluate(() => { const b = document.querySelector('#lpn_toolbar [data-tool="add-shape"]'); if (!b) { return null; } const i = window.bootstrap && window.bootstrap.Tooltip.getInstance(b); return (i && i._config && i._config.title) || b.getAttribute('data-bs-original-title') || b.title || ''; });
		ok('the toolbar button\'s tip names the key', typeof tipBtn === 'string' && tipBtn.indexOf((await L('lpn_tool_key_hint')).replace('{key}', 'F')) >= 0, tipBtn);
		await P.keyboard.press('Control+f'); await h.settle(150);
		ok('Ctrl+F does not start it', (await P.evaluate(() => (document.getElementById('lpn_mode_hint') || {}).textContent || '')) !== await L('lpn_mode_add_shape'));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
