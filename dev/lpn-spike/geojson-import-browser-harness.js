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
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
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
const featuresOf = (t) => t.slice(t.indexOf('\n"features":')).replace(RESULT, '').replace(/,}/g, '}');

function helpers(a) {
	const P = a.page;
	const settle = (ms) => a.settle(ms || 300);
	const stored = async () => {
		await settle(450);
		return P.evaluate(() => {
			const idx = JSON.parse(localStorage.getItem('lpn_index') || '{}');
			return { id: idx.openId, count: (idx.projects || []).length, doc: JSON.parse(localStorage.getItem('lpn_project_' + idx.openId) || 'null') };
		});
	};
	const importVia = async (file) => {
		await P.keyboard.press('Escape'); await P.keyboard.press('Escape');
		const [chooser] = await Promise.all([
			P.waitForEvent('filechooser', { timeout: 10000 }),
			a.menuClickSub(await a.lang('lpn_file_import_menu'), await a.lang('lpn_file_import_geojson_net'), 'file')
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
		const sel = (kind, field) => P.$eval('table[data-kind="' + kind + '"] select[data-field="' + field + '"]', (s) => s.value);
		const unit = (kind, field) => P.$eval('table[data-kind="' + kind + '"] select[data-unit-for="' + field + '"]', (s) => s.style.display === 'none' ? '' : s.value);
		ok('the guesses are shown: FACILITYID the ID, ELEV_FT the elevation in ft, OWNER a custom property',
			await sel('point', 'FACILITYID') === 'id' && await sel('point', 'ELEV_FT') === 'elev' && await unit('point', 'ELEV_FT') === 'fth2o' && await sel('point', 'OWNER') === 'custom');
		ok('PIPE_ID the ID, C the roughness (no unit under Hazen-Williams)', await sel('line', 'PIPE_ID') === 'id' && await sel('line', 'C') === 'roughness' && await unit('line', 'C') === '');
		ok('the tolerance is stated, 0.5 m, with its tip', await P.$eval('#lpn_gjnet_tolerance', (i) => i.value) === '0.5' &&
			await P.$eval('#lpn_gjnet_tolerance', (i) => i.parentNode.title) === await L('lpn_gjnet_tolerance_tip'));
		// The user's choices: DIAM_MM fills the diameter, in mm; LEN is left out.
		await P.selectOption('table[data-kind="line"] select[data-field="DIAM_MM"]', 'diameter');
		ok('a field chosen as the diameter shows the diameter units, on the project unit', await unit('line', 'DIAM_MM') === 'in');
		await P.selectOption('table[data-kind="line"] select[data-unit-for="DIAM_MM"]', 'mm');
		await P.selectOption('table[data-kind="line"] select[data-field="LEN"]', 'skip');
		// One field per property: choosing PIPE_ID's property for MATERIAL hands PIPE_ID back to custom.
		await P.selectOption('table[data-kind="line"] select[data-field="MATERIAL"]', 'id');
		ok('one field per property: a second field taking the ID makes the first a custom property', await sel('line', 'PIPE_ID') === 'custom');
		await P.selectOption('table[data-kind="line"] select[data-field="PIPE_ID"]', 'id');
		ok('...and taking it back makes the second one a custom property again', await sel('line', 'MATERIAL') === 'custom');
		await a.dialogClick(await L('lpn_library_import_go'));
		d = await a.waitDialog(4000);
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
		// M-2 runs 0.01 degree of latitude (3640 ft) from HY-2 (1201.25 ft) down to a junction added at
		// the default elevation 0: the slope distance, as every Auto length is measured.
		const h2 = 0.01 * 110574 / 0.3048, want2 = Math.sqrt(h2 * h2 + 1201.25 * 1201.25);
		ok('a pipe with no length is Auto, the slope distance along its line (M-2 about ' + Math.round(want2) + ' ft)',
			Lk['M-2'].lenAuto === true && Math.abs(Lk['M-2']._length - want2) < 15, String(Lk['M-2']._length));
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
		ok('the menu row has its tip', await P.evaluate(() => !!(window.EngCalcs.pageConfig || {}).lpn_file_import_geojson_net_tip));
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
