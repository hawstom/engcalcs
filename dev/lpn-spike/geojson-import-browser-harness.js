// FILE > IMPORT > GeoJSON NETWORK (ROADMAP Task 728, import half), in a real Chrome, through the
// real menu row, the real file chooser, the real mapping dialog and the real report.
//
//   node dev/lpn-spike/geojson-import-browser-harness.js
//
// Covered: a file this page exported (Net3 in US units, Net3 in SI units) opens as a NEW project
// with no question asked, holds the same network as the example (IDs, kinds, positions, values),
// moves the units strip to the file's units, and exports again to the same features byte for byte;
// a utility layer goes through the one mapping step, with the guesses shown, a field changed to
// the diameter in millimetres and another left out, the tolerance stated, and Import pressed with
// a real click; the report lists what was changed and skipped; Cancel imports nothing; a file in
// another coordinate system is refused with a message naming it, and imports nothing.
// The reader and builder alone: geojson-import-harness.js.
'use strict';
const { serveLatLonNet3 } = require('./latlon-net3-route.js');

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_GJNET_IMPORT_LOCKED';
const NAME = 'geojson-import-browser-harness';

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
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (cond || detail === undefined ? '' : '   ' + detail));
}

async function open(browser) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 }, serviceWorkers: 'block' });
	await serveLatLonNet3(a.page);
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1000);
	return a;
}
const FIXTURE = fs.readFileSync(path.join(REPO, 'dev', 'lpn-spike', 'fixtures', 'geojson-utility-layer.geojson'));
// The features, without the results: a result is a number of ours, computed again for the new
// project by the page's own solve, and the EPANET options a GeoJSON file does not hold (the report
// says so) move its last digit. Every input is compared, byte for byte.
const RESULT = /"(head|pressure|demand|flowrate|headloss|unit_headloss|velocity)":("[^"]*"|[-+0-9.eE]+),?/g;
const QGIS = fs.readFileSync(path.join(REPO, 'dev', 'lpn-spike', 'fixtures', 'geojson-qgis-layer.geojson'));
// The pre-reviewer's large layer, made here rather than stored (1 MB): a 55 by 55 grid of points
// 0.001 degree apart, every row joined west to east and the first eleven columns north to south.
function bigGrid() {
	const f = [];
	for (let i = 0; i < 55; i++) {
		for (let j = 0; j < 55; j++) {
			f.push({ type: 'Feature', properties: { ID: 'N' + i + '_' + j, EL: String(300 + i), D: '0.5' },
				geometry: { type: 'Point', coordinates: [+(-112 + 0.001 * j).toFixed(3), +(33 + 0.001 * i).toFixed(3)] } });
		}
	}
	let k = 0;
	const at = (i, j) => [+(-112 + 0.001 * j).toFixed(3), +(33 + 0.001 * i).toFixed(3)];
	for (let i = 0; i < 55; i++) { for (let j = 0; j < 54; j++) { f.push({ type: 'Feature', properties: { PID: 'P' + (k++), DIA: '200', C: '120' }, geometry: { type: 'LineString', coordinates: [at(i, j), at(i, j + 1)] } }); } }
	for (let j = 0; j < 11; j++) { for (let i = 0; i < 54; i++) { f.push({ type: 'Feature', properties: { PID: 'P' + (k++), DIA: '200', C: '120' }, geometry: { type: 'LineString', coordinates: [at(i, j), at(i + 1, j)] } }); } }
	return JSON.stringify({ type: 'FeatureCollection', features: f });
}
const featuresOf = (t) => t.slice(t.indexOf('\n"features":')).replace(RESULT, '').replace(/,}/g, '}');

function helpers(a) {
	const P = a.page;
	const settle = (ms) => a.settle(ms || 300);
	const readStored = () => P.evaluate(() => {
		const idx = JSON.parse(localStorage.getItem('lpn_index') || '{}');
		return { id: idx.openId, count: (idx.projects || []).length, doc: JSON.parse(localStorage.getItem('lpn_project_' + idx.openId) || 'null') };
	});
	// STILL, NOT MERELY WAITED FOR: the page saves on a debounce, which a loaded machine can run late
	// past any fixed wait. Read until two readings 300 ms apart agree (at most 20 s more).
	const stored = async () => {
		await settle(450);
		let v = await readStored();
		for (let t = 0; t < 66; t++) {
			await P.waitForTimeout(300);
			const w = await readStored();
			if (JSON.stringify(w) === JSON.stringify(v)) { return w; }
			v = w;
		}
		return v;
	};
	const importVia = async (file) => {
		await P.keyboard.press('Escape'); await P.keyboard.press('Escape');
		const [chooser] = await Promise.all([
			P.waitForEvent('filechooser', { timeout: 10000 }),
			a.menuClickSub(await a.lang('lpn_file_import_menu'), await a.lang('lpn_file_import_gjnet'), 'file')
		]);
		await chooser.setFiles(file);
		await settle(900);
	};
	const exportVia = async () => {
		const downloads = [];
		const onDl = (d) => downloads.push(d);
		P.on('download', onDl);
		await P.keyboard.press('Escape');
		await a.menuClickSub(await a.lang('lpn_file_export_menu'), await a.lang('lpn_file_export_item_geojson'), 'file');
		const t0 = Date.now();
		while (!downloads.length && Date.now() - t0 < 15000) { await P.waitForTimeout(200); }
		await P.waitForTimeout(600);
		P.off('download', onDl);
		if (!downloads.length) { return null; }
		const p = await downloads[0].path();
		return p ? fs.readFileSync(p, 'utf8') : null;
	};
	const strip = () => P.evaluate(() => {
		const o = {};
		['lpn_u_length', 'lpn_u_diameter', 'lpn_u_elevhead', 'lpn_u_flow', 'lpn_u_pressure'].forEach((n) => {
			const s = document.querySelector('select[name="' + n + '"]'); o[n] = s ? s.value : null;
		});
		return o;
	});
	return { P, settle, stored, importVia, exportVia, strip };
}

// One of the examples, exported, then imported back as a new project.
async function ownFile(browser, titleKey, file, units) {
	const a = await open(browser), h = helpers(a), L = (k) => a.lang(k);
	await a.openExampleCard(await L(titleKey));
	const before = await h.stored();
	const text = await h.exportVia();
	ok(file + ': the example exports a GeoJSON file', !!text && text.indexOf('"node_type"') > 0);
	await h.importVia({ name: file, mimeType: 'application/geo+json', buffer: Buffer.from(text || '') });
	// The example is open, so the file is first asked where it goes (Task 814); the new project is the answer here.
	const q = await a.waitDialog(4000);
	ok(file + ': an open project is asked where the file goes', !!q && q.text.indexOf((await L('lpn_gjup_lead')).split(/\\n\\n|\n\n/)[0]) === 0, q && q.text.slice(0, 120));
	if (q) { await a.dialogClick(await L('lpn_inpup_btn_new')); }
	const d = await a.waitDialog(4000);
	ok(file + ': no mapping is asked; the report opens, headed with the file name',
		!!d && d.text.indexOf((await L('lpn_inp_report_heading')).replace('{file}', file)) === 0, d && d.text.slice(0, 120));
	ok(file + ': ...and names what a GeoJSON file does not hold', !!d && d.text.indexOf(await L('lpn_gjnet_note_not_held')) >= 0);
	if (d) { await a.dialogClick(await L('lpn_dialog_ok')); }
	const after = await h.stored();
	ok(file + ': a NEW project, named after the file, on the Earth', after.count === before.count + 1 && after.id !== before.id &&
		after.doc.project.name === file.replace(/\.geojson$/, '') && after.doc.project.coords === 'geo', JSON.stringify(after.doc && after.doc.project));
	const tabs = await a.tabs();
	ok(file + ': its tab is the current one', tabs.some((t) => t.current && t.label.indexOf(file.replace(/\.geojson$/, '')) >= 0), JSON.stringify(tabs.map((t) => t.label)));
	const s = await h.strip();
	ok(file + ': the units strip shows the file\'s units', Object.keys(units).every((k) => s[k] === units[k]), JSON.stringify(s));
	const A = before.doc, B = after.doc, bn = {}, bl = {};
	B.nodes.forEach((n) => { bn[n.id] = n; });
	B.links.forEach((l) => { bl[l.id] = l; });
	const badN = A.nodes.filter((n) => { const m = bn[n.id]; return !m || m.type !== n.type || m.x !== n.x || m.y !== n.y || (m.elev || 0) !== (n.elev || 0); }).map((n) => n.id);
	ok(file + ': every node has the same ID, kind, longitude, latitude and elevation as in the example (' + A.nodes.length + ')',
		!badN.length && B.nodes.length === A.nodes.length, badN.slice(0, 5).join());
	const badL = A.links.filter((l) => {
		const m = bl[l.id];
		return !m || m.type !== l.type || m.from !== l.from || m.to !== l.to || (m.verts || []).length !== (l.verts || []).length ||
			(l.type === 'pipe' && (m._length !== l._length || m._diameter !== l._diameter || m._roughness !== l._roughness));
	}).map((l) => l.id);
	ok(file + ': every link has the same ID, kind, ends, bends, length, diameter and roughness (' + A.links.length + ')',
		!badL.length && B.links.length === A.links.length, badL.slice(0, 5).join());
	const again = await h.exportVia();
	const fa = featuresOf(text || '').split('\n'), fb = featuresOf(again || '').split('\n'), at = fa.findIndex((x, i) => x !== fb[i]);
	ok(file + ': exported again, every feature is the same, byte for byte (results aside)', !!again && at < 0 && fa.length === fb.length,
		at < 0 ? '' : '\n     was: ' + String(fa[at]).slice(0, 400) + '\n     now: ' + String(fb[at]).slice(0, 400));
	ok(file + ': no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.close();
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
		console.log('\n--- 1. our own file, US units ---');
		await ownFile(browser, 'lpn_ex_net3_title', 'net3-us.geojson', { lpn_u_flow: 'gpm', lpn_u_diameter: 'in', lpn_u_length: 'ft' });
		console.log('\n--- 2. our own file, SI units ---');
		await ownFile(browser, 'lpn_ex_net3_si_title', 'net3-si.geojson', { lpn_u_flow: 'lps', lpn_u_diameter: 'mm', lpn_u_length: 'm' });

		console.log('\n--- 3. a utility layer, through the mapping step ---');
		const a = await open(browser), h = helpers(a), P = h.P, L = (k) => a.lang(k);
		await a.newProject('us');
		await a.dismissGallery().catch(() => {});
		await h.settle(400);
		const before = await h.stored();
		await h.importVia({ name: 'water_assets.geojson', mimeType: 'application/geo+json', buffer: FIXTURE });
		let d = await a.waitDialog(4000);
		ok('the mapping dialog opens, titled with the file name', !!d && await P.evaluate(() => document.getElementById('lpn_dialog_title').textContent) ===
			(await L('lpn_gjnet_title')).replace('{file}', 'water_assets.geojson'));
		ok('it says how many points and lines were found', !!d && d.text.indexOf((await L('lpn_gjnet_intro')).replace('{points}', '4').replace('{lines}', '5')) >= 0, d && d.text.slice(0, 200));
		const betaText = await L('lpn_gjnet_beta');
		const beta = await P.evaluate(() => { const e = document.querySelector('#lpn_dialog_body .lpn-gjnet-beta'); return e ? { text: e.textContent, title: e.title, shown: e.getBoundingClientRect().height > 0 } : null; });
		ok('the dialog is marked "Beta: feedback requested", visible', !!beta && beta.text === betaText && betaText.length > 0 && beta.shown, JSON.stringify(beta));
		ok('...and its tip names the Something wrong here? button', !!beta && beta.title.indexOf(await L('lpn_wrong_btn')) >= 0 && beta.title.indexOf('{') < 0, beta && beta.title);
		{
			const tip = await L('lpn_file_import_shapes_tip');
			ok('the Import GeoJSON shapes tip names both doors, the EPANET file and the GeoJSON network', tip.indexOf('EPANET file') >= 0 && tip.indexOf((await L('lpn_file_import_gjnet')).replace('…', '')) >= 0 &&
				await P.evaluate((t) => (EngCalcs.pageConfig || {}).lpn_file_import_shapes_tip === t, tip), tip);
		}
		const sel = (kind, field) => P.$eval('table[data-kind="' + kind + '"] select[data-field="' + field + '"]', (s) => s.value);
		const unit = (kind, field) => P.$eval('table[data-kind="' + kind + '"] select[data-gjnet-unit="' + field + '"]', (s) => s.style.display === 'none' ? '' : s.value);
		ok('the guesses are shown: FACILITYID the ID, ELEV_FT the elevation in ft, OWNER a custom property',
			await sel('point', 'FACILITYID') === 'id' && await sel('point', 'ELEV_FT') === 'elev' && await unit('point', 'ELEV_FT') === 'fth2o' && await sel('point', 'OWNER') === 'custom');
		ok('PIPE_ID the ID, C the roughness (no unit under Hazen-Williams)', await sel('line', 'PIPE_ID') === 'id' && await sel('line', 'C') === 'roughness' && await unit('line', 'C') === '');
		ok('the tolerance is stated, 0.5 m, with its tip', await P.$eval('#lpn_gjnet_tolerance', (i) => i.value) === '0.5' &&
			await P.$eval('#lpn_gjnet_tolerance', (i) => i.parentNode.title) === await L('lpn_gjnet_tolerance_tip'));
		// The user's choices: DIAM_MM fills the diameter, in mm; LEN is left out.
		await P.selectOption('table[data-kind="line"] select[data-field="DIAM_MM"]', 'diameter');
		ok('DIAM_MM is guessed the diameter, its unit mm from its name', await sel('line', 'DIAM_MM') === 'diameter' && await unit('line', 'DIAM_MM') === 'mm');
		await P.selectOption('table[data-kind="line"] select[data-gjnet-unit="DIAM_MM"]', 'mm');
		await P.selectOption('table[data-kind="line"] select[data-field="LEN"]', 'skip');
		// One field per property: choosing PIPE_ID's property for MATERIAL hands PIPE_ID back to custom.
		await P.selectOption('table[data-kind="line"] select[data-field="MATERIAL"]', 'id');
		ok('one field per property: a second field taking the ID makes the first a custom property', await sel('line', 'PIPE_ID') === 'custom');
		await P.selectOption('table[data-kind="line"] select[data-field="PIPE_ID"]', 'id');
		ok('...and taking it back makes the second one a custom property again', await sel('line', 'MATERIAL') === 'custom');
		// Every notice the page puts up from here on, so the one shown during the work can be read.
		await P.evaluate(() => {
			window.__gjNotices = [];
			const n = document.getElementById('lpn_map_notice');
			new MutationObserver(() => { if (n.style.display !== 'none' && n.textContent) { window.__gjNotices.push(n.textContent); } })
				.observe(n, { childList: true, characterData: true, subtree: true, attributes: true });
		});
		await a.dialogClick(await L('lpn_library_import_go'));
		d = await a.waitDialog(4000);
		const said = await P.evaluate(() => window.__gjNotices);
		ok('while it works, the notice says it is importing the file', said.indexOf((await L('lpn_gjnet_working')).replace('{file}', 'water_assets.geojson')) >= 0, JSON.stringify(said));
		const items = await P.$$eval('#lpn_gjnet_report li', (ls) => ls.map((li) => ({ code: li.getAttribute('data-code'), text: li.textContent })));
		const item = (c) => items.find((i) => i.code === c);
		ok('the report opens after Import', !!d && items.length > 5, JSON.stringify(items.map((i) => i.code)));
		ok('it names the polygon not imported', !!item('skip-geometry') && item('skip-geometry').text === (await L('lpn_gjnet_note_skip_geometry')) + ' (ZONE)', item('skip-geometry') && item('skip-geometry').text);
		ok('it names the position that is not a longitude and latitude', !!item('skip-position') && item('skip-position').text.indexOf('(BAD)') > 0);
		ok('it names the duplicate ID and the ID given', !!item('id-dup') && item('id-dup').text.indexOf('HY-2 (J1)') > 0);
		ok('it names the end joined within the tolerance, with the distance', !!item('end-moved') && item('end-moved').text.indexOf('0.5 m') > 0 && item('end-moved').text.indexOf('(M-1)') > 0, item('end-moved') && item('end-moved').text);
		ok('it names the junctions added', !!item('junction-added'));
		ok('it names the field left out, as chosen', !!item('field-skipped') && item('field-skipped').text.indexOf('(LEN)') > 0);
		ok('it names the value that is not a number', !!item('value-unread') && item('value-unread').text.indexOf('6 inch') > 0);
		ok('it names the coordinate system the file stated', !!item('crs-named') && item('crs-named').text.indexOf('CRS84') > 0);
		ok('the default diameter is stated with its unit', !!item('default-diameter') && /\bmm\b/.test(item('default-diameter').text), item('default-diameter') && item('default-diameter').text);
		await a.dialogClick(await L('lpn_dialog_ok'));
		const after = await h.stored(), doc = after.doc;
		ok('a new project, on the Earth', after.count === before.count + 1 && doc.project.coords === 'geo' && doc.project.name === 'water_assets');
		ok('its diameter unit is the one chosen (mm); elevation ft', doc.units.lpn_u_diameter === 'mm' && doc.units.lpn_u_elevhead === 'fth2o', JSON.stringify(doc.units));
		const N = {}, Lk = {};
		doc.nodes.forEach((n) => { N[n.id] = n; });
		doc.links.forEach((l) => { Lk[l.id] = l; });
		ok('HY-1 is stored at its longitude and latitude, with the characters typed', N['HY-1'] && N['HY-1'].x === -111.9 && N['HY-1'].y === 33.4 && N['HY-1'].tok && N['HY-1'].tok.x === '-111.90000', JSON.stringify(N['HY-1']));
		ok('HY-1: elevation 1203.50 as typed, OWNER as a custom property', N['HY-1'].elev === 1203.5 && N['HY-1'].tok.elev === '1203.50' && N['HY-1']._custom_OWNER === 'City');
		ok('M-1 joins HY-1 to HY-2, 150.0 mm as typed, with one bend', Lk['M-1'] && Lk['M-1'].from === 'HY-1' && Lk['M-1'].to === 'HY-2' && Lk['M-1']._diameter === 150 &&
			Lk['M-1'].tok._diameter === '150.0' && Lk['M-1'].verts.length === 1, JSON.stringify(Lk['M-1']));
		// M-2 runs 0.01 degree of latitude (about 3640 ft) from HY-2 (1201.25 ft) to a junction added at
		// its far end, which takes HY-2's elevation: level, so the Auto length is the horizontal one.
		const h2 = 0.01 * 110574 / 0.3048;
		ok('the junction added at M-2\'s end has HY-2\'s elevation, 1201.25', N[Lk['M-2'].to].elev === 1201.25, JSON.stringify(N[Lk['M-2'].to]));
		ok('a pipe with no length is Auto, here level, so the horizontal length (M-2 about ' + Math.round(h2) + ' ft)',
			Lk['M-2'].lenAuto === true && Math.abs(Lk['M-2']._length - h2) < 15, String(Lk['M-2']._length));
		ok('every imported pipe has minor loss 0', doc.links.every((l) => l._k === 0));
		ok('the OWNER design is in the project settings', (doc.settings.customProps || []).some((p) => p.key === 'custom_OWNER' && p.label === 'OWNER'));
		const tabs = await a.tabs();
		ok('the new project is the current tab', tabs.some((t) => t.current && t.label.indexOf('water_assets') >= 0), JSON.stringify(tabs.map((t) => t.label)));

		console.log('\n--- 4. Cancel, and a file in another coordinate system ---');
		const n0 = (await h.stored()).count;
		await h.importVia({ name: 'water_assets.geojson', mimeType: 'application/geo+json', buffer: FIXTURE });
		d = await a.waitDialog(4000);
		await a.dialogClick(await L('lpn_cancel'));
		ok('Cancel on the mapping step imports nothing', (await h.stored()).count === n0 && !(await a.dialog()));
		const sp = JSON.stringify({ type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::2223' } },
			features: [{ type: 'Feature', properties: { id: 'A' }, geometry: { type: 'Point', coordinates: [700000, 900000] } }] });
		await h.importVia({ name: 'stateplane.geojson', mimeType: 'application/geo+json', buffer: Buffer.from(sp) });
		d = await a.waitDialog(4000);
		ok('a State Plane file is refused, the message naming the file and its coordinate system',
			!!d && d.text === (await L('lpn_gjnet_refuse_crs')).replace('{crs}', 'urn:ogc:def:crs:EPSG::2223').replace('{file}', 'stateplane.geojson'), d && d.text);
		if (d) { await a.dialogClick(d.buttons[0]); }
		ok('...and nothing is imported', (await h.stored()).count === n0);
		// NAD83 (EPSG:4269) is read as WGS 84 with no transform, and the report says so.
		const nadFile = JSON.stringify({ type: 'FeatureCollection', crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::4269' } },
			features: [
				{ type: 'Feature', properties: { ID: 'N1', ELEV: '300' }, geometry: { type: 'Point', coordinates: [-111.9123456, 33.4123456] } },
				{ type: 'Feature', properties: { ID: 'N2', ELEV: '301' }, geometry: { type: 'Point', coordinates: [-111.9113456, 33.4133456] } },
				{ type: 'Feature', properties: { PID: 'P1' }, geometry: { type: 'LineString', coordinates: [[-111.9123456, 33.4123456], [-111.9113456, 33.4133456]] } }] });
		await h.importVia({ name: 'nad83.geojson', mimeType: 'application/geo+json', buffer: Buffer.from(nadFile) });
		// The project now holds the earlier import, so the file is asked where it goes (Task 814).
		d = await a.waitDialog(4000);
		if (d && d.text.indexOf((await L('lpn_gjup_lead')).split(/\\n\\n|\n\n/)[0]) === 0) { await a.dialogClick(await L('lpn_inpup_btn_new')); }
		d = await a.waitDialog(4000);
		ok('a NAD83 file is not refused: the mapping step opens', !!d && d.text.indexOf((await L('lpn_gjnet_refuse_crs')).slice(0, 12)) < 0 && await P.evaluate(() => !!document.querySelector('#lpn_dialog_body table[data-kind]')), d && d.text.slice(0, 120));
		await a.dialogClick(await L('lpn_library_import_go'));
		d = await a.waitDialog(8000);
		const nadItems = await P.$$eval('#lpn_gjnet_report li', (ls) => ls.map((li) => ({ code: li.getAttribute('data-code'), text: li.textContent })));
		const nadNote = nadItems.find((i) => i.code === 'crs-nad83');
		ok('the report carries the NAD83 note', !!nadNote && nadNote.text === (await L('lpn_gjnet_note_crs_nad83')), JSON.stringify(nadItems.map((i) => i.code)));
		if (d) { await a.dialogClick(await L('lpn_dialog_ok')); }
		const nadDoc = (await h.stored()).doc;
		const nx = (id) => nadDoc.nodes.find((n) => n.id === id);
		ok('the positions are the file\'s, unchanged', !!nx('N1') && !!nx('N2') && nx('N1').x === -111.9123456 && nx('N1').y === 33.4123456 && nx('N2').x === -111.9113456 && nx('N2').y === 33.4133456, JSON.stringify([nx('N1') && [nx('N1').x, nx('N1').y]]));
		ok('the menu row has its tip', await P.evaluate(() => !!(window.EngCalcs.pageConfig || {}).lpn_file_import_gjnet_tip));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();

		console.log('\n--- 5. no elevation field: every node level, every Auto length horizontal ---');
		{
			const b = await open(browser), hb = helpers(b), Pb = hb.P;
			await b.newProject('us'); await b.dismissGallery().catch(() => {}); await hb.settle(400);
			await hb.importVia({ name: 'qgis.geojson', mimeType: 'application/geo+json', buffer: QGIS });
			await b.waitDialog(4000);
			await Pb.selectOption('table[data-kind="point"] select[data-field="ELEV_M"]', 'skip');
			await b.dialogClick(await b.lang('lpn_library_import_go'));
			const rd = await b.waitDialog(8000);
			const unm = (await b.lang('lpn_gjnet_note_unmapped_elev'));
			ok('the report says every node has the default elevation and Auto lengths include no elevation difference',
				!!rd && rd.text.indexOf(unm.split('{value}')[0]) >= 0 && rd.text.indexOf(unm.split('{value}')[1]) >= 0, rd && rd.text.slice(0, 300));
			await b.dialogClick(await b.lang('lpn_dialog_ok'));
			const dq = (await hb.stored()).doc, nq = {};
			dq.nodes.forEach((n) => { nq[n.id] = n; });
			const p3 = dq.links.find((l) => l.id === 'P3');
			// P3 runs 0.01 degree of latitude due south at 33.5 degrees: horizontal, one hundredth of a
			// meridian degree there (111132.954 - 559.822 cos 2phi + 1.175 cos 4phi m), in the project
			// length unit (LEN_M made it metres).
			const ph = 33.495 * Math.PI / 180, mdeg = 111132.954 - 559.822 * Math.cos(2 * ph) + 1.175 * Math.cos(4 * ph);
			const want3 = 0.01 * mdeg / (dq.units.lpn_u_length === 'ft' ? 0.3048 : 1);
			ok('all nodes share one elevation, and P3\'s Auto length is the horizontal ' + want3.toFixed(1) + ' ' + dq.units.lpn_u_length,
				new Set(dq.nodes.map((n) => n.elev)).size === 1 && p3.lenAuto === true && Math.abs(p3._length - want3) < want3 * 0.002, String(p3._length));
			ok('the reservoir J-A keeps the demand 3.20 as a custom property', nq['J-A'].type === 'reservoir' && nq['J-A']._custom_BASEDEM === '3.20');
			ok('no uncaught page errors', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
			await b.close();
		}

		console.log('\n--- 6. a phone, 390 px: every column of the mapping table on screen ---');
		{
			const c = await Session.open(browser, NAME, { viewport: { width: 390, height: 780 } });
			await c.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
			await c.goto('Looped-Network.php');
			await c.answerTrainingPanel().catch(() => {});
			await c.page.evaluate(() => { const e = document.getElementById('ec-consent'); if (e) { e.remove(); } delete window.lpnDialogAnswerer; });
			await c.settle(1000);
			await c.newProject('us'); await c.dismissGallery().catch(() => {});
			await helpers(c).importVia({ name: 'qgis.geojson', mimeType: 'application/geo+json', buffer: QGIS });
			await c.waitDialog(4000);
			const boxes = await c.page.$$eval('table.lpn-gjnet-table select', (ss) => ss.filter((x) => x.style.display !== 'none')
				.map((x) => { const r = x.getBoundingClientRect(); return { f: x.getAttribute('data-field') || 'unit:' + x.getAttribute('data-gjnet-unit'), l: r.left, r: r.right, w: r.width }; }));
			const off = boxes.filter((b2) => b2.l < 0 || b2.r > 390 || b2.w < 20);
			ok('every Fills and Unit select is within the 390 px screen (' + boxes.length + ')', boxes.length > 10 && !off.length, JSON.stringify(off.slice(0, 4)));
			ok('...the DIA_IN unit among them', boxes.some((b2) => b2.f === 'unit:DIA_IN'));
			await c.close();
		}

		console.log('\n--- 7. a 6,589-feature layer: the working notice, and the time it takes ---');
		{
			const e = await open(browser), he = helpers(e), Pe = he.P;
			// The click that starts this import waits while the page parses 6,589 features; on a busy
			// machine that outlasted Playwright's 30 s default (2026-10-29). The timing check below is
			// the guard; the click only needs to land.
			e.page.setDefaultTimeout(180000);
			await e.newProject('si'); await e.dismissGallery().catch(() => {}); await he.settle(400);
			await he.importVia({ name: 'grid.geojson', mimeType: 'application/geo+json', buffer: Buffer.from(bigGrid()) });
			await e.waitDialog(10000);
			await Pe.evaluate(() => {
				window.__gjNotices = [];
				const n = document.getElementById('lpn_map_notice');
				new MutationObserver(() => { if (n.style.display !== 'none' && n.textContent) { window.__gjNotices.push(n.textContent); } })
					.observe(n, { childList: true, characterData: true, subtree: true, attributes: true });
			});
			const t0 = Date.now();
			await e.dialogClick(await e.lang('lpn_library_import_go'));
			const rep2 = await e.waitDialog(120000);
			const ms = Date.now() - t0;
			console.log('        (6,589 features: ' + ms + ' ms from Import to the report)');
			const said2 = await Pe.evaluate(() => window.__gjNotices);
			ok('the working notice is up while it works', said2[0] === (await e.lang('lpn_gjnet_working')).replace('{file}', 'grid.geojson'), JSON.stringify(said2.slice(0, 2)));
			ok('3,025 nodes and 3,564 pipes arrive', !!rep2 && rep2.text.indexOf('3025') >= 0 && rep2.text.indexOf('3564') >= 0, rep2 && rep2.text.slice(0, 160));
			ok('no uncaught page errors', e.errors.length === 0, e.errors.slice(0, 2).join(' | '));
			await e.close();
		}
		console.log('\n--- 5. a page in Spanish: the Beta marker falls back to English, never a raw key ---');
		{
			const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
			await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
			await a.goto('Looped-Network.php?lang=es');
			await a.answerTrainingPanel().catch(() => {});
			await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
			await a.settle(1000);
			await a.newProject('us').catch(() => {});
			await a.dismissGallery().catch(() => {});
			const h = helpers(a);
			await h.importVia({ name: 'agua.geojson', mimeType: 'application/geo+json', buffer: FIXTURE });
			const d = await a.waitDialog(4000);
			const b = await a.page.evaluate(() => { const e = document.querySelector('#lpn_dialog_body .lpn-gjnet-beta'); return e ? { text: e.textContent, title: e.title } : null; });
			ok('Spanish page: the marker shows words, not a key, and its tip has no placeholder left', !!d && !!b && b.text.length > 0 && b.text.indexOf('lpn_') < 0 && b.title.indexOf('{') < 0 && b.title.indexOf('lpn_') < 0, JSON.stringify(b));
			await a.close();
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
