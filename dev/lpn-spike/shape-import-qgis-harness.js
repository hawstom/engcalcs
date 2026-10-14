// TOM'S TWO QGIS SHAPEFILES (ROADMAP Task 779), in a real Chrome, through the real File > Import row.
//
//   node dev/lpn-spike/shape-import-qgis-harness.js
//
// Tom, 2026-10-13, feat/shape: *"(a) I created a shapefile in EPSG:2223 for Elm Street Center and
// imported it. It came in about 1000 miles NNE of Hawaii. (b) I created a EPSG:3857 ... and imported
// it. EPP told me "test-n.shp is damaged or cut short, so nothing was imported.""* His own files, as
// QGIS 3.40 wrote them, are the fixtures (dev/lpn-spike/fixtures/tom-test-e.*, tom-test-n.*).
//
// (a) test-e's .prj states NAD83 / Arizona Central (ft), but its numbers are Web Mercator metres
//     (-12503154, 4107640): read as the .prj says they fall at 154.2 W 33.9 N, which is where it came
//     in. Read as EPSG:3857 they fall on Elm Street. The page now asks, with one button.
// (b) test-n has no .prj and Web Mercator numbers. The offer to read them as EPSG:3857 called a
//     converter that was null until proj4 had loaded, which a latitude-and-longitude project never
//     does, and the throw read as "damaged". It must import on the first try in a fresh page.
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SHAPE_QGIS_LOCKED';
const NAME = 'shape-import-qgis-harness';

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

const FX = path.join(REPO, 'dev', 'lpn-spike', 'fixtures');
const fx = (n) => ({ name: n.replace(/^tom-/, ''), buffer: fs.readFileSync(path.join(FX, n)) });
// Web Mercator metres to longitude and latitude, in closed form, independent of the page.
const R = 6378137, D = 180 / Math.PI;
const merc = (x, y) => ({ lon: x / R * D, lat: (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * D });
// The file's own numbers, read straight from the .shp (one PolyLine record each).
function shpPoints(n) {
	const b = fs.readFileSync(path.join(FX, n)), np = b.readInt32LE(148), out = [];
	for (let i = 0; i < np; i++) { out.push({ x: b.readDoubleLE(156 + 16 * i), y: b.readDoubleLE(164 + 16 * i) }); }
	return out;
}

async function open(browser) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1000);
	return a;
}

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
	const importVia = async (files) => {
		await P.keyboard.press('Escape'); await P.keyboard.press('Escape');
		const [chooser] = await Promise.all([
			P.waitForEvent('filechooser', { timeout: 10000 }),
			a.menuClickSub(await a.lang('lpn_file_import_menu'), await a.lang('lpn_file_import_shp'), 'file')
		]);
		await chooser.setFiles(files);
		await settle(1200);
		return a.notice();
	};
	const dlg = () => P.evaluate(() => {
		const d = document.getElementById('lpn_dialog');
		return d && getComputedStyle(d).display !== 'none' ? { text: document.getElementById('lpn_dialog_body').textContent, buttons: Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).map((b) => b.textContent) } : null;
	});
	const press = async (i) => {
		await P.evaluate((k) => { const b = document.querySelectorAll('#lpn_dialog_buttons button')[k]; b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }, i);
		await settle(900);
	};
	const undo = async () => { await P.keyboard.press('Control+z'); await settle(500); };
	return { P, settle, stored, importVia, dlg, press, undo };
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
		console.log('\n--- (b) test-n.shp, no .prj, into Net3 at Novato, in a fresh page ---');
		const a = await open(browser);
		const h = helpers(a), P = h.P;
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await h.settle(600);
		ok('the fresh latitude-and-longitude page has not loaded proj4 (the state Tom imported in)', await P.evaluate(() => typeof window.proj4 === 'undefined'));
		const nFiles = [fx('tom-test-n.shp'), fx('tom-test-n.shx'), fx('tom-test-n.dbf')];
		let note = await h.importVia(nFiles);
		let d = await h.dlg();
		ok('it offers EPSG:3857 by one button', !!d && d.text.indexOf('EPSG:3857') >= 0 && d.buttons[0] === await a.lang('lpn_shp_import_webmerc_ok'), JSON.stringify(d));
		await h.press(0);
		note = await a.notice();
		let doc = await h.stored();
		let sh = doc.shapes || [];
		const damaged = (await a.lang('lpn_shp_import_damaged')).replace('{file}', 'test-n.shp');
		ok('...and pressing it imports, never "damaged or cut short"', note !== damaged && sh.length === 1 && sh[0].pts.length === 7, note);
		const nPts = shpPoints('tom-test-n.shp');
		let worst = 0;
		const ll = await P.evaluate(() => {
			const idx = JSON.parse(localStorage.getItem('lpn_index') || '{}');
			const s = JSON.parse(localStorage.getItem('lpn_project_' + idx.openId) || 'null');
			return s.shapes[0].pts.map((p) => p);
		});
		// The stored point keeps its source longitude and latitude under whichever names the page uses;
		// find the pair that matches the Web Mercator reading of the first point.
		const w0 = merc(nPts[0].x, nPts[0].y);
		const keys = Object.keys(ll[0]);
		const lonKey = keys.find((k) => typeof ll[0][k] === 'number' && Math.abs(ll[0][k] - w0.lon) < 1e-9);
		const latKey = keys.find((k) => typeof ll[0][k] === 'number' && Math.abs(ll[0][k] - w0.lat) < 1e-9);
		ll.forEach((p, i) => { const w = merc(nPts[i].x, nPts[i].y); worst = Math.max(worst, Math.abs(p[lonKey] - w.lon), Math.abs(p[latKey] - w.lat)); });
		ok('every point is the Web Mercator reading of the file\'s own numbers, to 1e-9 degree', !!lonKey && !!latKey && worst < 1e-9, JSON.stringify(ll[0]) + ' worst ' + worst);
		const nbox = doc.nodes.reduce((b, n) => ({ w: Math.min(b.w, n.x), e: Math.max(b.e, n.x), s: Math.min(b.s, n.y), n: Math.max(b.n, n.y) }), { w: 180, e: -180, s: 90, n: -90 });
		ok('...which is inside Net3 at Novato (122.57 W, 38.11 N)', lonKey && ll.every((p) => p[lonKey] > nbox.w && p[lonKey] < nbox.e && p[latKey] > nbox.s && p[latKey] < nbox.n), JSON.stringify(nbox));
		ok('the notice says it was converted from EPSG:3857', note.indexOf('EPSG:3857') >= 0 && note.indexOf((await a.lang('lpn_shp_import_reprojected')).split('{theirs}')[0]) >= 0, note);
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();

		console.log('\n--- (a) test-e, a .prj stating EPSG:2223 over Web Mercator numbers, into Elm Street Center in EPSG:2223 ---');
		const b = await open(browser);
		const g = helpers(b), Q = g.P;
		// Elm Street Center's numbers ARE Arizona Central (ft) eastings and northings, so the project
		// Tom imported into is the example stating EPSG:2223, opened as a file.
		const elm = JSON.parse(fs.readFileSync(path.join(REPO, 'examples', 'Elm-Street-Center.lwn'), 'utf8'));
		elm.project = Object.assign({}, elm.project, { name: 'Elm-2223', crs: 'EPSG:2223' });
		delete elm.project.gallery;
		await b.writeFile('Elm-2223.lwn', JSON.stringify(elm));
		await b.queuePick('Elm-2223.lwn');
		await b.menuClick(await b.lang('lpn_file_open'));
		await b.settle(1500);
		{ const dl = await b.dialog(); if (dl && (dl.buttons || []).includes('Continue')) { await b.answerTrainingPanel(); await b.settle(1500); } }
		await g.settle(800);
		doc = await g.stored();
		ok('Elm Street Center is open, stating EPSG:2223', !!doc && doc.project.crs === 'EPSG:2223' && doc.nodes.length > 5, doc && JSON.stringify(doc.project));
		const eFiles = [fx('tom-test-e.shp'), fx('tom-test-e.shx'), fx('tom-test-e.dbf'), fx('tom-test-e.prj')];
		note = await g.importVia(eFiles);
		d = await g.dlg();
		ok('the .prj (NAD_1983_StatePlane_Arizona_Central_FIPS_0202_Feet_Intl) is recognised as the project\'s own system, and its reading 3,900 km away is questioned by one button',
			!!d && d.text.indexOf('NAD_1983_StatePlane_Arizona_Central') >= 0 && /\b3[89]\d\d km\b/.test(d.text) && d.buttons[0] === await b.lang('lpn_shp_import_webmerc_ok'), JSON.stringify(d));
		await g.press(1);
		note = await b.notice();
		ok('Cancel imports nothing and says so', ((await g.stored()).shapes || []).length === 0 && note === (await b.lang('lpn_shapes_import_none')).replace('{file}', 'test-e.shp'), note);
		await g.importVia(eFiles);
		await g.press(0);
		note = await b.notice();
		doc = await g.stored();
		sh = doc.shapes || [];
		ok('the button imports one Shape of four points', sh.length === 1 && sh[0].pts.length === 4, JSON.stringify(sh));
		const ePts = shpPoints('tom-test-e.shp');
		const want = await Q.evaluate((pts) => pts.map((q) => EngCalcs.lpnCrsForward('EPSG:2223', { lon: q.x / 6378137 * 180 / Math.PI, lat: (2 * Math.atan(Math.exp(q.y / 6378137)) - Math.PI / 2) * 180 / Math.PI })), ePts);
		const o = doc.origin || { x: 0, y: 0 };
		worst = 0;
		if (sh.length === 1) {
			sh[0].pts.forEach((p, i) => {
				const dx = Math.abs(p.x + o.x - want[i].x);
				// The drawing frame's y is y-down about the origin (Task 354); either sign convention is accepted.
				const dy = Math.min(Math.abs(p.y + o.y - want[i].y), Math.abs(-p.y + o.y - want[i].y), Math.abs(o.y - p.y - want[i].y));
				worst = Math.max(worst, dx, dy);
			});
		}
		ok('each point is the EPSG:3857 reading of the file\'s numbers, forward into EPSG:2223 by the suite\'s transform, to 1 mm', worst < 0.001 / 0.3048, worst + ' ft; ' + JSON.stringify([sh[0] && sh[0].pts[0], want[0], o]));
		const ebox = elm.nodes.reduce((bx, n) => ({ w: Math.min(bx.w, n.x), e: Math.max(bx.e, n.x), s: Math.min(bx.s, n.y), n: Math.max(bx.n, n.y) }), { w: Infinity, e: -Infinity, s: Infinity, n: -Infinity });
		ok('...which lands on Elm Street Center: every point within 300 ft of its network', want.every((p) => p.x > ebox.w - 300 && p.x < ebox.e + 300 && p.y > ebox.s - 300 && p.y < ebox.n + 300), JSON.stringify([ebox, want]));
		ok('the notice says it was converted from EPSG:3857 to EPSG:2223', note.indexOf('EPSG:3857') >= 0 && note.indexOf('EPSG:2223') >= 0, note);
		await g.undo();
		ok('one Undo takes it back', ((await g.stored()).shapes || []).length === 0);
		// A .prj that is right is not questioned: test-e's numbers carried to Arizona Central (ft) by
		// the suite's own transform, under the same .prj, import unchanged with no question asked.
		const good = Buffer.from(fs.readFileSync(path.join(FX, 'tom-test-e.shp')));
		const bb = [Infinity, Infinity, -Infinity, -Infinity];
		want.forEach((p, i) => { good.writeDoubleLE(p.x, 156 + 16 * i); good.writeDoubleLE(p.y, 164 + 16 * i); bb[0] = Math.min(bb[0], p.x); bb[1] = Math.min(bb[1], p.y); bb[2] = Math.max(bb[2], p.x); bb[3] = Math.max(bb[3], p.y); });
		[36, 112].forEach((off) => { good.writeDoubleLE(bb[0], off); good.writeDoubleLE(bb[1], off + 8); good.writeDoubleLE(bb[2], off + 16); good.writeDoubleLE(bb[3], off + 24); });
		note = await g.importVia([{ name: 'test-e.shp', buffer: good }, fx('tom-test-e.dbf'), fx('tom-test-e.prj')]);
		ok('the same .prj over true Arizona Central (ft) numbers asks nothing and keeps the numbers', (await g.dlg()) === null &&
			((await g.stored()).shapes || []).length === 1 && note.indexOf((await b.lang('lpn_shp_import_prj_same')).split('{crs}')[0]) >= 0, note);
		ok('no uncaught page errors', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
		await b.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
