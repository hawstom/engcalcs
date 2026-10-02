// FILE, CONVERT AS... IN A REAL CHROME -- ROADMAP Task 696 (which absorbed 688 and 693).
//
//   node dev/lpn-spike/convert-as-browser-harness.js
//
// convert-as-harness.js holds the arithmetic on lpn-dom-stub.js. This one drives the page itself,
// through its own menu row, box, chooser and wizard buttons, because the two defects Tom reported
// on 2026-09-22 only exist on a rendered page:
//   (1) "In Step 1, a background image gets dragged around with the map (then snaps back on release
//       of drag) instead of always staying with the project."
//   (2) "When I finished the Convert coordinates as... wizard on the Elm Street Center example, the
//       world map worked, but the satellite view didn't."
// and because his design is a sequence of screens: "(a) Project and units ..., (b) step 1 (if CRS
// changed), (c) step 2 (if CRS changed)", opening already answered when the project already knows
// where it is.
//
// What it holds, one section each:
//   1. Units only: a new tab "Copy of ...", its numbers converted, no placement steps, the original
//      byte for byte untouched.
//   2. Not georeferenced -> lat/lon (EPSG:4326), Tom's Elm Street Center: step 1 opens on the whole
//      world, and during a real mouse drag the site plan stays with the model, not the map.
//   3. lat/lon (EPSG:4326) -> UTM zone 10N (EPSG:32610), Net3 at Novato: the steps open already
//      answered, and every node lands on proj4's own easting and northing of its lon/lat.
//   4. Round trip: that UTM copy -> EPSG:4326 again, and every node is back on its original
//      longitude and latitude.
//   5. A grid with the world map attached -> EPSG:32610: the steps open answered FROM THE
//      ATTACHMENT, the site plan stays with the model during a step 1 drag, and every node lands
//      where the attachment put it. Then the satellite switch asks Mapbox for tiles.
//   7-10. Tom's five of 2026-09-26: the site plan held at 50% or less while either wizard is open
//      and the user's own fade back afterwards (7); both bars dragged by their title over the menu
//      bar, clamped, and docked again on close with nothing stored (8); at Prescott Valley the
//      chooser lists only what covers the network, on UTM zone 12N (9); and step 1 opens there (10).
//
// No network: OpenStreetMap and Mapbox tiles are answered locally by a route, so this counts the
// requests the page makes and never depends on either service being up.
//
// Screenshots of every wizard screen go to $CONVERT_AS_SHOTS (default: a folder under the system
// temp directory, printed at the end). Look at them; a green run is not a picture.
//
// **DO NOT PREFIX THIS WITH `flock`.** It launches Chromium, so it takes /tmp/engcalcs-browser.lock
// itself by re-executing under flock, as table-divider-align-harness.js does; an outer flock on
// the same file would deadlock.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_CONVERT_AS_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('convert-as-browser-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('convert-as-browser-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a conversion failure; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('convert-as-browser-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

const SHOTS = process.env.CONVERT_AS_SHOTS || path.join(os.tmpdir(), 'convert-as-shots');
const proj4 = require(path.join(REPO, 'js', 'vendor', 'proj4.js'));
const DEFS = JSON.parse(fs.readFileSync(path.join(REPO, 'js', 'data', 'epsg-proj4.json'), 'utf8'));
const UTM10 = 'EPSG:32610';
function defOf(code) {
	const d = DEFS[code] || (DEFS.defs && DEFS.defs[code]);
	if (typeof d === 'string') { return d; }
	if (d && typeof d.proj4 === 'string') { return d.proj4; }
	return '+proj=utm +zone=10 +datum=WGS84 +units=m +no_defs';
}

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
// A 1x1 PNG; the browser stretches it over a 256 px tile, which is all a tile has to do here.
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('convert-as-browser-harness: playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	fs.mkdirSync(SHOTS, { recursive: true });
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('convert-as-browser-harness: no Chromium found (set CHROME_PATH). SKIPPING rather than failing on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'A');
		const page = a.page;
		const tiles = { osm: 0, satellite: 0 };
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => {
			const u = route.request().url();
			if (/api\.mapbox\.com\/v4\/mapbox\.satellite/.test(u)) { tiles.satellite++; }
			else if (/openstreetmap/.test(u)) { tiles.osm++; }
			return route.fulfill({ status: 200, contentType: /\.jpg/.test(u) ? 'image/jpeg' : 'image/png', body: PNG });
		});
		// Prompts are answered in order from this queue (Go to asks two questions while placing).
		const answers = [];
		page.removeAllListeners('dialog');
		page.on('dialog', async (d) => {
			if (d.type() === 'prompt') {
				const v = answers.shift();
				if (v === undefined) { await d.dismiss(); } else { await d.accept(v); }
				return;
			}
			await d.accept();
		});
		const shot = (name) => page.screenshot({ path: path.join(SHOTS, name + '.png') });

		const PC = {};
		async function S(key) { if (!(key in PC)) { PC[key] = await a.lang(key); } return PC[key]; }
		// ---- reading what the page stored ------------------------------------------------------
		const index = () => page.evaluate(() => JSON.parse(localStorage.getItem('lpn_index') || '{}'));
		const stored = (id) => page.evaluate((i) => JSON.parse(localStorage.getItem('lpn_project_' + i) || 'null'), id);
		const bytes = async (id) => { const s = await stored(id); if (!s) { return null; } delete s.view; return JSON.stringify(s); };
		// Absolute positions by node id, in the document's own frame (lon/lat, or the plane's numbers).
		function positions(doc) {
			const geo = doc.project && doc.project.coords === 'geo';
			const o = (!geo && doc.origin) ? doc.origin : { x: 0, y: 0 };
			const out = {};
			(doc.nodes || []).forEach((n) => { out[n.id] = { x: n.x + (o.x || 0), y: n.y + (o.y || 0) }; });
			return out;
		}
		// A tab is pressed by its own name, the way a visitor finds it.
		async function switchTo(name) {
			const tabs = await page.$$('#lpn_tabs .lpn-tab');
			for (const t of tabs) {
				const n = await t.$('.lpn-tab-name');
				if (n && ((await n.textContent()) || '').trim() === name) { await n.click(); await a.settle(600); return true; }
			}
			return false;
		}
		const tabName = async () => { const ix = await index(); const e = (ix.projects || []).find((p) => p.id === ix.openId); return e ? e.name : null; };
		// ---- the page's own controls -------------------------------------------------------------
		async function openConvertAs() {
			await a.menuClick(await S('lpn_file_convert_as'));
			await page.waitForSelector('#lpn_convas_panel', { state: 'visible' });
		}
		async function pickCrs(code, screenshotName) {
			await page.check('#lpn_convas_kind_epsg');
			await page.click('#lpn_convas_crs_pick');
			await page.waitForSelector('#lpn_crsbox', { state: 'visible' });
			await a.settle(600);
			const view = await page.$('#lpn_crsbox_view');
			if (view && await view.isChecked()) { await view.uncheck(); }
			await page.fill('#lpn_crsbox_name', code.replace('EPSG:', ''));
			await a.settle(300);
			if (screenshotName) { await shot(screenshotName); }
			await page.selectOption('#lpn_crsbox_list', code);
			await page.click('#lpn_crsbox_ok');
			await page.waitForSelector('#lpn_crsbox', { state: 'hidden' });
		}
		async function convert() { await page.click('#lpn_convas_ok'); await a.settle(1500); }
		const barVisible = () => page.$eval('#lpn_georef_bar', (e) => e.style.display !== 'none').catch(() => false);
		const stepText = () => page.$eval('#lpn_georef_step', (e) => e.textContent).catch(() => '');
		async function dropAndKeep(prefix) {
			await page.click('#lpn_georef_drop');
			await a.settle(600);
			ok(prefix + ': "Put the model here" goes to step 2', await stepText() === await S('lpn_georef_step2'), await stepText());
			await shot(prefix + '-step2');
			await page.click('#lpn_georef_finish');
			await a.settle(1500);
			ok(prefix + ': "Keep this placement" ends the wizard', !(await barVisible()));
		}
		const canvasBox = () => page.$eval('#lpn_canvas', (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
		// Screen rectangles of the site plan, the model and one street tile, as the eye sees them.
		const rects = () => page.evaluate(() => {
			const r = (el) => { if (!el) { return null; } const b = el.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; };
			const imgs = Array.from(document.querySelectorAll('#lpn_canvas image'));
			const href = (i) => i.getAttribute('href') || i.getAttribute('xlink:href') || '';
			return {
				plan: r(imgs.filter((i) => /^data:/.test(href(i)))[0]),
				// The drawing ON SCREEN: other open tabs keep theirs hidden beside it (Task 680).
				model: r(Array.from(document.querySelectorAll('#lpn_canvas g.lpn-symbols'))
					.filter((g) => getComputedStyle(g).display !== 'none')[0]),
				tile: r(imgs.filter((i) => /^https?:/.test(href(i)))[0])
			};
		});
		const moved = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
		// **THE ANSWERED STEP 1 OPENS ON THE NETWORK, FITTED.** It once opened Elm Street Center as a
		// 13 px dot on a 500,000 ft scale: the fit backed off to meet stale labels, and at street
		// zoom the drawing was past Chrome's layout range. Both are asserted as what a person sees.
		async function fitted(prefix) {
			const c = await canvasBox(), m = (await rects()).model;
			ok(prefix + ': step 1 opens fitted to the network (it spans over a third of the canvas, all on it)',
				!!m && Math.max(m.w / c.w, m.h / c.h) > 0.33 && m.x >= c.x - 1 && m.y >= c.y - 1 &&
				m.x + m.w <= c.x + c.w + 1 && m.y + m.h <= c.y + c.h + 1,
				m ? JSON.stringify({ x: Math.round(m.x), y: Math.round(m.y), w: Math.round(m.w), h: Math.round(m.h) }) : 'no model');
		}
		const groundBox = () => page.$eval('#lpn_georef_scale_in', (e) => +e.value).catch(() => NaN);
		// **TOM'S DEFECT (1), MEASURED MID-DRAG.** The pointer is held down while the positions are
		// read, which is the moment he saw the picture go with the map; a check after release would
		// pass over the very snap-back he described.
		async function dragStep1(prefix) {
			const c = await canvasBox();
			const x0 = c.x + c.w * 0.5, y0 = c.y + c.h * 0.75;
			const before = await rects();
			await page.mouse.move(x0, y0);
			await page.mouse.down();
			for (let i = 1; i <= 8; i++) { await page.mouse.move(x0 + i * 15, y0 - i * 6); await page.waitForTimeout(25); }
			const mid = await rects();
			await shot(prefix + '-step1-middrag');
			await page.mouse.up();
			await a.settle(700);
			const after = await rects();
			ok(prefix + ': the map really moved under the drag (a street tile moved)',
				!!(before.tile && mid.tile) && moved(before.tile, mid.tile) > 50,
				before.tile && mid.tile ? moved(before.tile, mid.tile).toFixed(1) + ' px' : 'no tile');
			ok(prefix + ': R-172 (1) mid-drag, the model holds still on the screen',
				!!(before.model && mid.model) && moved(before.model, mid.model) < 1.5, mid.model ? moved(before.model, mid.model).toFixed(2) + ' px' : 'none');
			ok(prefix + ': R-172 (1) mid-drag, the site plan holds still WITH the model, not with the map',
				!!(before.plan && mid.plan) && moved(before.plan, mid.plan) < 1.5 && Math.abs(before.plan.w - mid.plan.w) < 1.5,
				mid.plan ? moved(before.plan, mid.plan).toFixed(2) + ' px' : 'no plan');
			ok(prefix + ': ...and after release it has not snapped anywhere either',
				!!(before.plan && after.plan) && moved(before.plan, after.plan) < 1.5 && Math.abs(before.plan.w - after.plan.w) < 1.5,
				after.plan ? moved(before.plan, after.plan).toFixed(2) + ' px' : 'no plan');
			// And on a wheel, which is the other half of "pan and zoom the map underneath it".
			await page.mouse.move(x0, y0);
			await page.mouse.wheel(0, -240);
			await page.waitForTimeout(40);
			const wheel = await rects();
			await a.settle(700);
			ok(prefix + ': a wheel zoom in step 1 leaves the site plan with the model too',
				!!(before.plan && wheel.plan) && moved(before.plan, wheel.plan) < 1.5 && Math.abs(before.plan.w - wheel.plan.w) < 1.5,
				wheel.plan ? moved(before.plan, wheel.plan).toFixed(2) + ' px, width ' + before.plan.w.toFixed(1) + ' -> ' + wheel.plan.w.toFixed(1) : 'no plan');
		}

		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		const ELM = await S('lpn_ex_elm_street_title');
		const NET3W = await S('lpn_ex_net3_world_title');

		console.log('\n--- 1. units only: a new tab, its numbers converted, the original untouched ---');
		await a.openExampleCard(ELM);
		const elmId = (await index()).openId, elmName = await tabName();
		const elmBefore = await bytes(elmId), elm0 = await stored(elmId);
		await openConvertAs();
		await shot('1-box');
		ok('the box opens on this project\'s own case, not georeferenced', await page.isChecked('#lpn_convas_kind_none'));
		await page.click('#lpn_convas_si');
		await convert();
		const u1 = await stored((await index()).openId);
		ok('a NEW tab is open', (await index()).openId !== elmId);
		ok('...named "Copy of" the original', await tabName() === (await S('lpn_copy_of')).replace('{name}', elmName), await tabName());
		ok('...and no placement steps were shown for a units-only change', !(await barVisible()));
		ok('...with its recorded units converted to SI', u1.units.lpn_u_diameter === 'mm' && u1.units.lpn_u_length === 'm',
			JSON.stringify(u1.units));
		const pipe0 = elm0.links.find((l) => l.type === 'pipe' && typeof l._diameter === 'number');
		const pipe1 = u1.links.find((l) => l.id === pipe0.id);
		ok('a pipe diameter is converted (' + pipe0._diameter + ' in -> mm)', Math.abs(pipe1._diameter - pipe0._diameter * 25.4) < 1e-9, pipe1._diameter);
		ok('its length is converted (ft -> m)', Math.abs(pipe1._length - pipe0._length * 0.3048) < 1e-9, pipe1._length);
		const p0 = positions(elm0), p1 = positions(u1), nid = elm0.nodes[0].id;
		ok('a local grid\'s coordinates rescale with its length unit', Math.abs(p1[nid].x - p0[nid].x * 0.3048) < 1e-6,
			p0[nid].x + ' ft -> ' + p1[nid].x + ' m');
		ok('THE ORIGINAL IS UNTOUCHED, byte for byte', await bytes(elmId) === elmBefore);
		await shot('1-done');

		console.log('\n--- 2. Elm Street Center, not georeferenced -> lat/lon: step 1 from the whole world ---');
		await switchTo(elmName);
		ok('back on the original through its tab', (await index()).openId === elmId);
		await openConvertAs();
		await page.check('#lpn_convas_kind_epsg');
		ok('the EPSG choice offers lat/lon as WGS 84 (EPSG:4326)',
			/EPSG:4326/.test(await page.$eval('#lpn_convas_crs_name', (e) => e.textContent)),
			await page.$eval('#lpn_convas_crs_name', (e) => e.textContent));
		await shot('2-box');
		await convert();
		ok('the wizard opens at step 1', await barVisible() && await stepText() === await S('lpn_georef_step1'), await stepText());
		ok('...saying it starts from the whole world', await a.notice() === await S('lpn_georef_intro'));
		await shot('2-step1');
		await dragStep1('2');
		// Then to the site, at street zoom, the way a person does it: Go to, a latitude and
		// longitude, and about how wide the site is. Far from 0 N 0 E at this zoom the drawing used
		// to leave Chrome's layout range; it has to still be a drawing on the screen.
		answers.push('38.1074,-122.5697', '300');
		await page.click('#lpn_georef_goto');
		await a.settle(1500);
		await shot('2-step1-goto');
		const onScreen = async (label) => {
			const c = await canvasBox(), m = (await rects()).model;
			ok(label, !!m && m.w > 150 && m.x > c.x - 50 && m.x + m.w < c.x + c.w + 50,
				m ? JSON.stringify({ x: Math.round(m.x), w: Math.round(m.w) }) : 'no model');
		};
		await onScreen('2: after Go to at street zoom, the model is a drawing on the screen, not a clamped point');
		await page.click('#lpn_georef_drop');
		await a.settle(800);
		await shot('2-step2');
		await onScreen('2: ...and still is at step 2');
		await page.click('#lpn_georef_cancel');
		await a.settle(800);
		ok('Cancel closes the copy and says nothing was converted', await a.notice() === await S('lpn_convas_cancelled'), await a.notice());

		console.log('\n--- 3. Net3 at Novato, lat/lon -> UTM zone 10N (EPSG:32610), answered ---');
		await a.menuClick(await S('lpn_examples_menu'));
		await a.openExampleCard(NET3W);
		const n3Id = (await index()).openId, n3Before = await bytes(n3Id), n3 = await stored(n3Id);
		const ll0 = positions(n3);
		ok('Net3 at Novato is a lat/lon project', n3.project.coords === 'geo');
		await openConvertAs();
		ok('the box opens on EPSG, since lat/lon is one EPSG system', await page.isChecked('#lpn_convas_kind_epsg'));
		await pickCrs(UTM10, '3-crsbox');
		ok('the chooser\'s answer is shown beside the choice', /32610/.test(await page.$eval('#lpn_convas_crs_name', (e) => e.textContent)));
		await shot('3-box');
		await convert();
		ok('NO "already on lat/lon" refusal: the wizard opens', await barVisible());
		ok('...at step 1, already answered', await stepText() === await S('lpn_georef_step1') && await a.notice() === await S('lpn_georef_answered'),
			await a.notice());
		await shot('3-step1');
		await fitted('3');
		await dropAndKeep('3');
		const utm = await stored((await index()).openId), pu = positions(utm);
		ok('the copy states EPSG:32610', utm.project.crs === UTM10 && utm.project.coords === undefined, JSON.stringify(utm.project.crs));
		let worst = 0;
		const def = defOf(UTM10);
		Object.keys(ll0).forEach((id) => {
			const e = proj4('EPSG:4326', def, [ll0[id].x, ll0[id].y]);
			worst = Math.max(worst, Math.hypot(pu[id].x - e[0], pu[id].y - e[1]));
		});
		ok('every node is proj4\'s own UTM easting and northing of its lon/lat, to 1 mm', worst < 1e-3, worst.toExponential(2) + ' m');
		ok('the original lat/lon Net3 is untouched', await bytes(n3Id) === n3Before);
		await shot('3-done');

		console.log('\n--- 4. round trip: that UTM copy -> EPSG:4326 again ---');
		const utmId = (await index()).openId;
		await openConvertAs();
		await pickCrs('EPSG:4326');
		await convert();
		ok('an EPSG plane opens the steps answered too', await barVisible() && await a.notice() === await S('lpn_georef_answered'), await a.notice());
		await fitted('4');
		await page.click('#lpn_georef_drop');
		await a.settle(600);
		// Net3 at Novato is in US units, so one UTM metre reads as 3.28084 ft.
		ok('step 2\'s Ground distance reads per unit of the file it came from: one UTM metre, 3.28084 ft',
			Math.abs(await groundBox() - 3.28084) < 1e-4, await groundBox());
		await page.click('#lpn_georef_detach');
		await a.settle(600);
		await dropAndKeep('4');
		const back = await stored((await index()).openId), pb = positions(back);
		ok('the round-trip copy is lat/lon again', back.project.coords === 'geo');
		let worstDeg = 0;
		Object.keys(ll0).forEach((id) => { worstDeg = Math.max(worstDeg, Math.abs(pb[id].x - ll0[id].x), Math.abs(pb[id].y - ll0[id].y)); });
		// 1e-7 degree is about 1 cm on the ground.
		ok('every node is back on its original longitude and latitude, to 1e-7 degree', worstDeg < 1e-7, worstDeg.toExponential(2) + ' deg');
		ok('the UTM copy it came from is untouched', !!(await stored(utmId)) && (await stored(utmId)).project.crs === UTM10);

		console.log('\n--- 5. a grid with the world map attached -> EPSG:32610, answered from the attachment ---');
		// Elm Street Center with an attachment near Novato, opened as a file so nothing is faked in
		// memory: what the page reads is exactly what a saved project would hold.
		const elmFile = JSON.parse(fs.readFileSync(path.join(REPO, 'examples', 'Elm-Street-Center.lwn'), 'utf8'));
		let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
		elmFile.nodes.forEach((n) => { minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x); minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y); });
		const T = { anchor: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 }, origin: { lon: -122.5697, lat: 38.1074 }, metersPerUnit: 0.3048, rotDeg: 12 };
		elmFile.project = Object.assign({}, elmFile.project, { name: 'Elm-attached', georef: T, basemap: 'osm' });
		delete elmFile.project.gallery;
		await a.writeFile('Elm-attached.lwn', JSON.stringify(elmFile));
		await a.queuePick('Elm-attached.lwn');
		await a.menuClick(await S('lpn_file_open'));
		await a.settle(1500);
		// A fresh profile meets the first-run file panel before its first Open; it is a real step.
		{ const dlg = await a.dialog(); if (dlg && (dlg.buttons || []).includes('Continue')) { await a.answerTrainingPanel(); await a.settle(1500); } }
		const attId = (await index()).openId, attBefore = await bytes(attId), att = await stored(attId);
		ok('the attached grid opened', !!att && !!att.project.georef && !att.project.coords, att ? JSON.stringify(att.project.georef) : 'nothing');
		const want = await page.evaluate((args) => {
			const out = {};
			Object.keys(args.p).forEach((id) => { const q = window.EngCalcs.lpnGeorefToLonLat(args.t, args.p[id].x, args.p[id].y); out[id] = { x: q.lon, y: q.lat }; });
			return out;
		}, { t: T, p: positions(att) });
		await openConvertAs();
		ok('the box says this project is an unnamed (local) georeference', await page.isChecked('#lpn_convas_kind_unnamed'));
		await pickCrs(UTM10);
		await shot('5-box');
		await convert();
		ok('the steps open at step 1, already answered from the attachment',
			await barVisible() && await stepText() === await S('lpn_georef_step1') && await a.notice() === await S('lpn_georef_answered'), await a.notice());
		await shot('5-step1');
		await fitted('5');
		await dragStep1('5');
		// The drag above moved the ground under the held model, so put it back where the attachment
		// said by cancelling and running the answered steps again untouched.
		await page.click('#lpn_georef_cancel');
		await a.settle(800);
		await switchTo('Elm-attached');
		ok('Cancel came back to the attached original', (await index()).openId === attId);
		await openConvertAs();
		await pickCrs(UTM10);
		await convert();
		await page.click('#lpn_georef_drop');
		await a.settle(600);
		ok('step 2\'s Ground distance reads 1 ft per drawing unit, the attachment\'s own scale (R-219: type 1 to keep the numbers)',
			Math.abs(await groundBox() - 1) < 1e-6, await groundBox());
		await page.click('#lpn_georef_detach');
		await a.settle(600);
		await dropAndKeep('5');
		// The attachment turns 12 degrees and a background image cannot turn, so the page says so.
		ok('the finish says the site plan could not be turned with the 12 degree attachment',
			(await a.notice()).indexOf(await S('lpn_georef_backdrop_unrotated')) > 0, await a.notice());
		const out5 = await stored((await index()).openId), p5 = positions(out5);
		let worst5 = 0;
		Object.keys(want).forEach((id) => {
			const e = proj4('EPSG:4326', def, [want[id].x, want[id].y]);
			worst5 = Math.max(worst5, Math.hypot(p5[id].x - e[0], p5[id].y - e[1]));
		});
		ok('pressing through untouched puts every node where the attachment said, in UTM, to 1 cm', out5.project.crs === UTM10 && worst5 < 0.01,
			worst5.toExponential(2) + ' m');
		ok('the attached original is untouched', await bytes(attId) === attBefore);
		await shot('5-done');

		console.log('\n--- 6. R-172 (2): satellite after the wizard ---');
		const teaser = await page.$('#lpn_basemap_teaser');
		ok('the satellite switch is offered on the converted copy', !!teaser && await teaser.isVisible());
		tiles.satellite = 0;
		if (teaser) { await teaser.click(); }
		await a.settle(1500);
		const satImgs = await page.$$eval('#lpn_canvas image', (els) => els.filter((i) => /mapbox\.satellite/.test(i.getAttribute('href') || '')).length);
		ok('pressing it asks Mapbox for satellite tiles and draws them', tiles.satellite > 0 && satImgs > 0, tiles.satellite + ' requests, ' + satImgs + ' drawn');
		await shot('6-satellite');

		// ---- Tom's five, 2026-09-26 ------------------------------------------------------------
		// Elm Street Center as a file, optionally with the world map attached near Prescott Valley,
		// AZ -- the place he tested from -- and the site plan at a stated fade.
		const PV = { lon: -112.32, lat: 34.61 };
		async function openElm(name, fade, attached) {
			const f = JSON.parse(fs.readFileSync(path.join(REPO, 'examples', 'Elm-Street-Center.lwn'), 'utf8'));
			let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
			f.nodes.forEach((n) => { x0 = Math.min(x0, n.x); x1 = Math.max(x1, n.x); y0 = Math.min(y0, n.y); y1 = Math.max(y1, n.y); });
			f.project = Object.assign({}, f.project, { name: name });
			delete f.project.gallery;
			if (attached) {
				f.project.georef = { anchor: { x: (x0 + x1) / 2, y: (y0 + y1) / 2 }, origin: { lon: PV.lon, lat: PV.lat }, metersPerUnit: 0.3048, rotDeg: 0 };
				f.project.basemap = 'osm';
			}
			f.settings = Object.assign({}, f.settings, { backdropOpacity: fade });
			await a.writeFile(name + '.lwn', JSON.stringify(f));
			await a.queuePick(name + '.lwn');
			await a.menuClick(await S('lpn_file_open'));
			await a.settle(1500);
			return (await index()).openId;
		}
		const planOpacity = () => page.evaluate(() => {
			const g = document.querySelector('#lpn_canvas .lpn-backdrop');
			return g ? +getComputedStyle(g).opacity : NaN;
		});
		const tileOpacity = () => page.evaluate(() => {
			const g = document.querySelector('#lpn_canvas .lpn-basemap');
			return g ? +getComputedStyle(g).opacity : NaN;
		});

		console.log('\n--- 7. Tom (1): the site plan is held at 50% or less while either wizard is open ---');
		const fadeId = await openElm('Elm-fade', 0.9, false);
		ok('the site plan opens at the project\'s own 90%', Math.abs(await planOpacity() - 0.9) < 1e-6, await planOpacity());
		await a.menuClickSub(await S('lpn_map_attach_menu'), await S('lpn_map_attach_add'), 'map');
		await page.waitForSelector('#lpn_mapgeo_bar', { state: 'visible' });
		await a.settle(600);
		ok('World map, Attach holds it at 50%', Math.abs(await planOpacity() - 0.5) < 1e-6, await planOpacity());
		ok('...the street tiles keep the user\'s own fade', Math.abs(await tileOpacity() - 0.9) < 1e-6, await tileOpacity());
		await shot('7-attach-faded');
		await page.click('#lpn_mapgeo_cancel');
		await a.settle(600);
		ok('Cancel gives back the user\'s 90%', Math.abs(await planOpacity() - 0.9) < 1e-6, await planOpacity());
		ok('...and the project still says 90%, never the capped 50%', (await stored(fadeId)).settings.backdropOpacity === 0.9,
			(await stored(fadeId)).settings.backdropOpacity);
		await openConvertAs();
		await page.check('#lpn_convas_kind_epsg');
		await convert();
		ok('File, Convert as holds it at 50% on step 1', await barVisible() && Math.abs(await planOpacity() - 0.5) < 1e-6, await planOpacity());
		answers.push('34.61,-112.32', '300');
		await page.click('#lpn_georef_goto');
		await a.settle(1200);
		await page.click('#lpn_georef_drop');
		await a.settle(600);
		ok('...and on step 2', Math.abs(await planOpacity() - 0.5) < 1e-6, await planOpacity());
		await page.click('#lpn_georef_finish');
		await a.settle(1500);
		ok('Keep this placement gives back the user\'s 90%', !(await barVisible()) && Math.abs(await planOpacity() - 0.9) < 1e-6, await planOpacity());
		ok('...and the converted copy stores 90%', (await stored((await index()).openId)).settings.backdropOpacity === 0.9);
		ok('...as does the original', (await stored(fadeId)).settings.backdropOpacity === 0.9);

		console.log('\n--- 8. Tom (2): both wizard bars drag by their title, up over the menus ---');
		const barRect = (id) => page.$eval('#' + id, (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, pos: getComputedStyle(e).position }; });
		const menuBottom = () => page.$eval('#lpn_menubar', (e) => e.getBoundingClientRect().bottom).catch(() => 40);
		async function dragTitle(barId, titleId, dx, dy) {
			// Pressed on a part of the title that is ON the screen, as a person would after pushing
			// the bar most of the way off an edge.
			const t = await page.$eval('#' + titleId, (e) => {
				const r = e.getBoundingClientRect(), l = Math.max(r.left, 0), rt = Math.min(r.right, window.innerWidth);
				return { x: l + Math.min(20, (rt - l) / 2), y: r.top + r.height / 2 };
			});
			await page.mouse.move(t.x, t.y);
			await page.mouse.down();
			for (let i = 1; i <= 10; i++) { await page.mouse.move(t.x + dx * i / 10, t.y + dy * i / 10); await page.waitForTimeout(20); }
			await page.mouse.up();
			await a.settle(300);
		}
		async function barOverMenus(prefix, barId, titleId) {
			const r0 = await barRect(barId);
			await dragTitle(barId, titleId, -150, -(r0.y + 200));
			const r1 = await barRect(barId);
			ok(prefix + ': dragging the title carries the bar to the top of the page', r1.y >= 0 && r1.y < 3 && Math.abs((r0.x - 150) - r1.x) < 3,
				JSON.stringify({ from: [Math.round(r0.x), Math.round(r0.y)], to: [Math.round(r1.x), Math.round(r1.y)] }));
			const topHit = await page.evaluate((args) => {
				const el = document.elementFromPoint(args.x, args.y), bar = document.getElementById(args.id);
				return !!(el && bar.contains(el));
			}, { x: r1.x + r1.w / 2, y: Math.min(r1.y + 6, (await menuBottom()) - 2), id: barId });
			ok(prefix + ': ...where it is drawn OVER the menu bar, not under it', topHit);
			await shot(prefix + '-over-menus');
			await dragTitle(barId, titleId, -5000, -500);
			const r2 = await barRect(barId);
			ok(prefix + ': the title cannot leave the screen (top edge on screen, a sliver at the side)',
				r2.y >= 0 && r2.x + r2.w >= 27, JSON.stringify({ x: Math.round(r2.x), y: Math.round(r2.y), w: Math.round(r2.w) }));
			await dragTitle(barId, titleId, 900, 300);
			const r3 = await barRect(barId);
			ok(prefix + ': ...and it comes back by the same title', r3.x > r2.x + 300 && r3.y > r2.y + 200, JSON.stringify({ x: Math.round(r3.x), y: Math.round(r3.y) }));
		}
		const dragId = await openElm('Elm-drag', 0.5, false);
		await openConvertAs();
		await page.check('#lpn_convas_kind_epsg');
		await convert();
		await barOverMenus('8 Convert as', 'lpn_georef_bar', 'lpn_georef_step');
		const btnOk = await page.$eval('#lpn_georef_drop', (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await page.mouse.click(btnOk.x, btnOk.y);
		await a.settle(600);
		ok('8 Convert as: its buttons still work where it was dragged to', await stepText() === await S('lpn_georef_step2'), await stepText());
		await page.click('#lpn_georef_cancel');
		await a.settle(800);
		await switchTo('Elm-drag');
		await openConvertAs();
		await page.check('#lpn_convas_kind_epsg');
		await convert();
		const home = await barRect('lpn_georef_bar'), cv = await canvasBox();
		ok('8 Convert as: the next wizard opens the bar back at the top of the map, nothing remembered',
			home.pos === 'absolute' && home.y >= cv.y && home.y < cv.y + 20, JSON.stringify(home));
		await page.click('#lpn_georef_cancel');
		await a.settle(800);
		await switchTo('Elm-drag');
		ok('8: back on the plain grid', (await index()).openId === dragId);
		await a.menuClickSub(await S('lpn_map_attach_menu'), await S('lpn_map_attach_add'), 'map');
		await page.waitForSelector('#lpn_mapgeo_bar', { state: 'visible' });
		await a.settle(600);
		await barOverMenus('8 World map', 'lpn_mapgeo_bar', 'lpn_mapgeo_step');
		await page.click('#lpn_mapgeo_cancel');
		await a.settle(600);
		ok('8 World map: Cancel docks the bar again', (await barRect('lpn_mapgeo_bar')).pos === 'absolute');
		ok('8: nothing new in this browser\'s storage for a bar\'s place',
			!(await page.evaluate(() => Object.keys(localStorage).some((k) => /georef|mapgeo|wizbar/i.test(k)))),
			JSON.stringify(await page.evaluate(() => Object.keys(localStorage))));

		console.log('\n--- 9. Tom (3) and (4): the chooser lists what covers the network, on its UTM zone ---');
		const pvId = await openElm('Elm-PV', 0.5, true);
		await openConvertAs();
		await page.check('#lpn_convas_kind_epsg');
		await page.click('#lpn_convas_crs_pick');
		await page.waitForSelector('#lpn_crsbox', { state: 'visible' });
		await a.settle(1500);
		const codes = () => page.$$eval('#lpn_crsbox_list option', (o) => o.map((e) => e.value));
		const listed = await codes();
		const total = await page.evaluate(() => document.getElementById('lpn_crsbox_list').options.length);
		ok('9: with the world map attached at Prescott Valley the list is filtered, not the whole register',
			listed.length > 2 && listed.length < 100, listed.length + ' rows');
		ok('9: ...it keeps UTM zone 12N and drops 10N', listed.includes('EPSG:32612') && !listed.includes('EPSG:32610'));
		ok('9: ...and Arizona Central, which holds the whole network', listed.includes('EPSG:26949'));
		ok('9: ...and the two world-wide systems always stay', listed.includes('EPSG:3857') && listed.includes('EPSG:4326'));
		const note9 = await page.$eval('#lpn_crsbox_note', (e) => e.textContent);
		const want9 = (await S('lpn_crs_count_network')).replace('{n}', String(total));
		ok('9: the note says the list is what covers this network', note9.indexOf(want9.slice(0, want9.indexOf('{total}') >= 0 ? want9.indexOf('{total}') : want9.length)) === 0 || note9.indexOf(String(total)) === 0, note9);
		ok('9 (Tom 4): the selected row is UTM zone 12N, the zone Prescott Valley is in',
			await page.$eval('#lpn_crsbox_list', (e) => e.value) === 'EPSG:32612', await page.$eval('#lpn_crsbox_list', (e) => e.value));
		const selVisible = await page.$eval('#lpn_crsbox_list', (e) => {
			const o = e.options[e.selectedIndex]; if (!o) { return false; }
			const r = e.getBoundingClientRect(), q = o.getBoundingClientRect();
			return q.top >= r.top - 1 && q.bottom <= r.bottom + 1;
		});
		ok('9: ...and it is scrolled into sight', selVisible);
		await shot('9-crsbox-filtered');
		await page.uncheck('#lpn_crsbox_view');
		await a.settle(300);
		ok('9: unticking Filter by map view shows every coordinate system again', (await codes()).length > 1000, (await codes()).length + ' rows');
		await page.check('#lpn_crsbox_view');
		await a.settle(300);
		await page.click('#lpn_crsbox_ok');
		await page.waitForSelector('#lpn_crsbox', { state: 'hidden' });
		ok('9: Select takes zone 12N into the box', /32612/.test(await page.$eval('#lpn_convas_crs_name', (e) => e.textContent)),
			await page.$eval('#lpn_convas_crs_name', (e) => e.textContent));

		console.log('\n--- 10. Tom (5): a project with the world map attached starts step 1 where it is ---');
		await convert();
		ok('10: step 1 opens already answered', await barVisible() && await stepText() === await S('lpn_georef_step1') &&
			await a.notice() === await S('lpn_georef_answered'), await a.notice());
		await fitted('10');
		const m10 = (await rects()).model;
		await page.mouse.move(m10.x + m10.w / 2, m10.y + m10.h / 2);
		await a.settle(200);
		const read10 = await page.$eval('#lpn_coords', (e) => e.textContent);
		const nums = (read10.match(/-?\d+(\.\d+)?/g) || []).map(Number);
		ok('10: the middle of the screen is Prescott Valley, not the whole world',
			nums.length >= 2 && Math.abs(nums[0] - PV.lat) < 0.01 && Math.abs(nums[1] - PV.lon) < 0.01, read10);
		await shot('10-step1-prescott');
		await page.click('#lpn_georef_cancel');
		await a.settle(800);
		ok('10: the attached original is where Cancel returns', (await index()).openId === pvId);

		ok('no page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\nScreenshots: ' + SHOTS);
	console.log(fails === 0 ? 'ALL PASS (' + checks + ' checks)' : fails + ' of ' + checks + ' FAILED');
	process.exit(fails === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(1); });
