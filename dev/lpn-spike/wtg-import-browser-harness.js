// FILE > IMPORT > WATERCAD OR WATERGEMS MODEL (ROADMAP Task 749), in a real Chromium, through the
// real menu row, the real file chooser and the real report, solved by the page itself.
//
//   node dev/lpn-spike/wtg-import-browser-harness.js
//
// 1. ALWAYS RUN, on the synthetic model wtg-synthetic-fixture.js builds: the row opens a chooser; the
//    import lands as a NEW project with the report saying so; the network, the inactive element, the
//    two scenarios (one with its override), and the alternative no scenario uses are in the stored
//    project; sql.js was fetched from this site only once the file was chosen; the page's own solve
//    matches EPANET's solve of the `.inp` the reader wrote (computed here in Node) within 1 mm.
// 2. WHEN WTG_SAMPLES POINTS AT THE PUBLIC SAMPLES (not in the repository; dev/sqlite-reader.md): the
//    EPS model and its `.wtg` are imported together and solved; the `.inp` WaterGEMS exported from the
//    same model is imported by File > Import > EPANET file and solved; the heads at every shared
//    node agree within 1 mm. Without it: NOT RUN, exit 0.
// The reader alone: wtg-import-harness.js.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_WTG_IMPORT_LOCKED';
const NAME = 'wtg-import-browser-harness';

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

require('./bootstrap.js');
const initSqlJs = require(path.join(REPO, 'js', 'vendor', 'sql-wasm.js'));
require(path.join(REPO, 'js', 'lpn-sqlite.js'));
require(path.join(REPO, 'js', 'lpn-inp.js'));
require(path.join(REPO, 'js', 'lpn-wtg.js'));
const EC = globalThis.EngCalcs;
EC.lpnSqliteSetEngine(initSqlJs, fs.readFileSync(path.join(REPO, 'js', 'vendor', 'sql-wasm.wasm')));
const { buildSyntheticWtg, unitDemandExtra } = require('./wtg-synthetic-fixture.js');

let checks = 0, failures = 0, Session;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (cond || detail === undefined ? '' : '   ' + detail));
}

async function epanetHeads(inpText) {
	const mod = await import('file://' + path.join(REPO, 'js', 'vendor', 'epanet-js.js'));
	const ws = new mod.Workspace();
	await ws.loadModule();
	const p = new mod.Project(ws);
	ws.writeFile('b.inp', inpText);
	p.open('b.inp', 'b.rpt', 'b.out');
	p.openH(); p.initH(0); p.runH();
	const heads = {};
	for (let i = 1; i <= p.getCount(0); i++) { heads[p.getNodeId(i)] = p.getNodeValue(i, 10); }
	p.closeH(); p.close();
	return heads;
}

async function open(browser) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
	const fetched = [];
	a.page.on('request', (r) => { if (/sql-wasm/.test(r.url())) { fetched.push(r.url()); } });
	a.fetched = fetched;
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1000);
	return a;
}
function helpers(a) {
	const P = a.page;
	const stored = async () => {
		await a.settle(450);
		return P.evaluate(() => {
			const idx = JSON.parse(localStorage.getItem('lpn_index') || '{}');
			return { id: idx.openId, count: (idx.projects || []).length, doc: JSON.parse(localStorage.getItem('lpn_project_' + idx.openId) || 'null') };
		});
	};
	const importVia = async (rowKey, files) => {
		await P.keyboard.press('Escape'); await P.keyboard.press('Escape');
		const [chooser] = await Promise.all([
			P.waitForEvent('filechooser', { timeout: 10000 }),
			a.menuClickSub(await a.lang('lpn_file_import_menu'), await a.lang(rowKey), 'file')
		]);
		await chooser.setFiles(files);
	};
	const markSolve = () => P.evaluate(() => { window.__wtgPrev = EngCalcs.lpnSolveProbe(); });
	const solved = async () => {
		await a.waitFor(() => P.evaluate(() => { const r = EngCalcs.lpnSolveProbe(); return !!(r && r !== window.__wtgPrev && r.heads); }), 'a solve', 60000);
		return P.evaluate(() => EngCalcs.lpnSolveProbe().heads);
	};
	return { P, stored, importVia, markSolve, solved };
}
function worst(a, b, alias) {
	let w = 0, at = '', n = 0;
	Object.keys(b).forEach((id) => {
		const o = a[alias ? alias(id) : id];
		if (typeof o !== 'number' || typeof b[id] !== 'number') { return; }
		n++;
		if (Math.abs(o - b[id]) > w) { w = Math.abs(o - b[id]); at = id; }
	});
	return { w, at, n };
}

async function synthetic(browser) {
	console.log('\n--- 1. the synthetic model, through the menu ---');
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lpn-wtg-b-'));
	const file = buildSyntheticWtg(path.join(tmp, 'Synthetic model.wtg.sqlite'));
	const db = await EC.lpnSqliteOpen(fs.readFileSync(file));
	const read = EC.lpnWtgRead(db, { flowUnits: 'LPS' });
	db.close();
	// EPANET's solve of what the reader wrote, with the inactive J_3 and its pipe P5 taken out, as the
	// page takes an inactive element out of the network.
	const active = read.inp.split('\n').filter((l) => !/^ (J_3|P5)\t/.test(l) && !/LINK P5 /.test(l)).join('\n');
	const ref = await epanetHeads(active);

	const a = await open(browser), h = helpers(a), L = (k) => a.lang(k);
	await a.newProject('si').catch(() => {});
	await a.dismissGallery().catch(() => {});
	const before = await h.stored();
	ok('sql.js is not fetched by the page load', a.fetched.length === 0, a.fetched.join(' '));
	await h.markSolve();
	await h.importVia('lpn_file_import_wtg', file);
	const d = await a.waitDialog(20000);
	const intro = (await L('lpn_wtg_report_intro')).replace('{base}', 'Base').replace('{n}', '2');
	ok('the report opens, headed with the file name, saying it is a new project with 2 more scenarios',
		!!d && d.text.indexOf((await L('lpn_inp_report_heading')).replace('{file}', 'Synthetic model.wtg.sqlite')) === 0 && d.text.indexOf(intro) > 0, d && d.text.slice(0, 300));
	ok('...naming the pump and valve split, the inactive element and the unread table',
		!!d && d.text.indexOf(await L('lpn_wtg_note_directed_split')) > 0 && d.text.indexOf(await L('lpn_wtg_note_inactive')) > 0 &&
		d.text.indexOf(await L('lpn_wtg_note_tables_unread')) > 0 && d.text.indexOf('IdahoPipe_Hammer_Data') > 0);
	ok('...and the units the page assumed, with no .wtg chosen', !!d && d.text.indexOf(await L('lpn_wtg_note_units_assumed')) > 0);
	if (d) { await a.dialogClick(await L('lpn_dialog_ok')); }
	ok('sql.js came from this site, once each (script and wasm)', a.fetched.length === 2 && a.fetched.every((u) => u.indexOf(a.base || '') === 0 || /^https?:\/\/(localhost|127\.0\.0\.1)/.test(u)), a.fetched.join(' '));
	const after = await h.stored();
	const doc = after.doc || {};
	ok('a NEW project, named after the file', after.count === before.count + 1 && after.id !== before.id && doc.project && doc.project.name === 'Synthetic model', JSON.stringify(doc.project));
	const ids = (doc.nodes || []).map((n) => n.id).sort().join(',');
	ok('its nodes: the four imported, and the four beside the pump and valve', ids === 'J1,J_3,PMP1-D,PMP1-U,PRV1-D,PRV1-U,R1,T1', ids);
	const lk = (doc.links || []).map((l) => l.id + ':' + l.type).sort().join(',');
	ok('its links: five pipes, the pump and the PRV', lk === 'P1:pipe,P2:pipe,P3:pipe,P4:pipe,P5:pipe,PMP1:pump,PRV1:valve', lk);
	const j3 = (doc.nodes || []).filter((n) => n.id === 'J_3')[0];
	ok('J_3 is inactive', j3 && j3._active === false);
	const p2 = (doc.links || []).filter((l) => l.id === 'P2')[0];
	ok('P2 is 300 mm in Base', p2 && p2._diameter === 300);
	const scn = (doc.scenarios || []).map((s) => s.name);
	ok('Base and the two scenarios', scn.join('|') === 'Base|Peak|Peak, small main', scn.join('|'));
	const small = (doc.scenarios || []).filter((s) => s.name === 'Peak, small main')[0], peak = (doc.scenarios || []).filter((s) => s.name === 'Peak')[0];
	ok('"Peak, small main" is a child of Peak with P2 at 200 mm', small && peak && small.parent === peak.id && JSON.stringify(small.overrides) === '{"l:P2":{"diameter":200}}', JSON.stringify(small));
	const alt = (doc.alternatives || []).filter((x) => x.name === 'Rehab')[0];
	ok('the unused alternative "Rehab" is stored, Physical, a Base of its own', alt && alt.category === 'physical' && alt.root === true && alt.values['l:P3'].diameter === 350, JSON.stringify(alt));
	const heads = await h.solved();
	const w = worst(heads, ref);
	console.log('        page solve vs EPANET of the written .inp: ' + w.n + ' heads, largest difference ' + w.w.toExponential(2) + ' m at ' + w.at);
	ok('the page solves it, and every head is within 1 mm of EPANET', w.n >= 7 && w.w <= 1e-3);
	ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.close();
	fs.rmSync(tmp, { recursive: true, force: true });
}

const EPS = 'EPS_Badapokharan_Operation as per design_base_model';
// Unit demand loads, a scenario's own demand adjustment and a junction's own fire flow, from the
// synthetic model's second shape (wtg-unit-demand-harness.js holds the reader side): they must
// arrive in the stored project, not only in the reader's result.
async function unitDemand(browser) {
	console.log('\n--- 1b. unit demand loads, scenario demand multipliers and fire flow, in the stored project ---');
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lpn-wtg-ud-'));
	const file = buildSyntheticWtg(path.join(tmp, 'Unit loads.wtg.sqlite'), unitDemandExtra(3.5, true, 2.0));
	const a = await open(browser), h = helpers(a);
	await a.newProject('si').catch(() => {});
	await a.dismissGallery().catch(() => {});
	await h.importVia('lpn_file_import_wtg', file);
	const d = await a.waitDialog(20000);
	ok('the report opens', !!d);
	ok('...naming the unit demand loads and the fire flow settings',
		!!d && d.text.indexOf(await a.lang('lpn_wtg_note_unit_demand')) > 0 && d.text.indexOf(await a.lang('lpn_wtg_note_fireflow')) > 0, d && d.text.slice(0, 200));
	if (d) { await a.dialogClick(await a.lang('lpn_dialog_ok')); }
	const doc = (await h.stored()).doc || {};
	const peak = (doc.scenarios || []).filter((s) => s.name === 'Peak')[0];
	ok('scenario Peak keeps its own demand multiplier, 3.5', peak && peak.demandMultiplier === 3.5, JSON.stringify(peak));
	const j1 = (doc.nodes || []).filter((n) => n.id === 'J1')[0];
	ok('J1 keeps its own required fire flow, 20', j1 && j1._fireFlow === 20, JSON.stringify(j1 && j1._fireFlow));
	ok('J1 carries the unit load\'s flow, 4', j1 && j1._demand === 4, JSON.stringify(j1));
	ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.close();
	fs.rmSync(tmp, { recursive: true, force: true });
}

// Tom's WTG-tgh-1 (Base plus a child scenario changing a diameter and a demand), in the repository:
// the import must put both overrides in the stored project (wtg-tgh-harness.js holds the reader side).
async function tgh(browser) {
	console.log('\n--- 1c. WTG-tgh-1: a child scenario with a diameter and a demand override ---');
	const FX = path.join(REPO, 'dev', 'lpn-spike', 'fixtures', 'wtg');
	const a = await open(browser), h = helpers(a);
	await a.newProject('us').catch(() => {});
	await a.dismissGallery().catch(() => {});
	await h.importVia('lpn_file_import_wtg', [path.join(FX, 'WTG-tgh-1.wtg.sqlite'), path.join(FX, 'WTG-tgh-1.wtg')]);
	const d = await a.waitDialog(30000);
	ok('the report opens', !!d, d && d.text.slice(0, 200));
	if (d) { await a.dialogClick(await a.lang('lpn_dialog_ok')); }
	const doc = (await h.stored()).doc || {};
	const ids = (doc.nodes || []).map((n) => n.id).sort().join(',');
	ok('three nodes, two pipes', ids === 'J-1,J-2,R-1' && (doc.links || []).length === 2, ids);
	const scn = (doc.scenarios || []).map((x) => x.name).join('|');
	ok('Base and TGH-1', scn === 'Base|TGH-1', scn);
	const t = (doc.scenarios || []).filter((x) => x.name === 'TGH-1')[0];
	ok('TGH-1 overrides P-1 diameter 10 and J-1 demand 1250, nothing else', t && JSON.stringify(t.overrides) === '{"l:P-1":{"diameter":10},"n:J-1":{"demand":1250}}', JSON.stringify(t));
	const p1 = (doc.links || []).filter((l) => l.id === 'P-1')[0], j1 = (doc.nodes || []).filter((n) => n.id === 'J-1')[0];
	ok('Base keeps P-1 at 8 and J-1 at 0', p1 && p1._diameter === 8 && j1 && j1._demand === 0, JSON.stringify([p1 && p1._diameter, j1 && j1._demand]));
	ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.close();
}

async function samples(browser) {
	console.log('\n--- 2. the public WaterGEMS sample, against the .inp WaterGEMS exported ---');
	const S = process.env.WTG_SAMPLES || '';
	const dbFile = S && path.join(S, 'WaterGems model', EPS + '.wtg.sqlite');
	const wtgFile = S && path.join(S, 'WaterGems model', EPS + '.wtg');
	const inpFile = S && path.join(S, 'EPANET Model', EPS + '.inp');
	if (!S || !fs.existsSync(dbFile) || !fs.existsSync(inpFile)) {
		console.log('  NOT RUN: set WTG_SAMPLES to the folder holding "WaterGems model" and "EPANET Model" (dev/sqlite-reader.md).');
		return;
	}
	const a = await open(browser), h = helpers(a), L = (k) => a.lang(k);
	await a.newProject('si').catch(() => {});
	await a.dismissGallery().catch(() => {});
	await h.markSolve();
	await h.importVia('lpn_file_import_wtg', [dbFile, wtgFile]);
	const d = await a.waitDialog(30000);
	const counts = (await L('lpn_inp_report_counts')).replace('{nodes}', '33').replace('{links}', '32').replace('{units}', 'LPS');
	ok('the EPS model and its .wtg: 33 nodes, 32 links, in LPS', !!d && d.text.indexOf(counts) > 0, d && d.text.slice(0, 400));
	ok('...the report names the pump split and the tank inlet', !!d && d.text.indexOf(await L('lpn_wtg_note_directed_split')) > 0 && d.text.indexOf(await L('lpn_wtg_note_tank_inlet')) > 0);
	ok('...and says pressure is shown in kPa in WaterGEMS', !!d && d.text.indexOf('pressure: kiloPascals') > 0);
	if (d) { await a.dialogClick(await L('lpn_dialog_ok')); }
	const units = await a.page.evaluate(() => ['lpn_u_flow', 'lpn_u_diameter', 'lpn_u_length'].map((n) => { const s = document.querySelector('select[name="' + n + '"]'); return s ? s.value : null; }).join(','));
	ok('the units strip moved to L/s, mm, m', units === 'lps,mm,m', units);
	const ours = await h.solved();
	await h.markSolve();
	await h.importVia('lpn_file_import_inp', inpFile);
	const d2 = await a.waitDialog(20000);
	if (d2) { await a.dialogClick(await L('lpn_dialog_ok')); }
	const theirs = await h.solved();
	const alias = (id) => ({ 3: 'U1-D', 4: 'U1-U' }[id] || id);
	const shared = {};
	// Set aside: 1 and 2, the tank-inlet construction WaterGEMS's export adds, and 3 and 4, the pump's
	// two junctions, whose heads hang on that construction: through the export's PSV into the full tank
	// the page's solve passes the pump's flow; with the inlet pipe joined to the tank (this import) the
	// full tank shuts it off. EPANET itself shuts it off in both (wtg-import-harness.js agrees there to
	// 2e-7 m at every node). The report names this tank (lpn_wtg_note_tank_inlet).
	Object.keys(theirs).forEach((id) => { if (['1', '2', '3', '4'].indexOf(id) < 0) { shared[id] = theirs[id]; } });
	Object.keys(shared).forEach((id) => { const o = ours[alias(id)]; if (typeof o === 'number' && Math.abs(o - shared[id]) > 1e-3) { console.log('        ' + id + ': ' + o + ' vs ' + shared[id]); } });
	const w = worst(ours, shared, alias);
	console.log('        page solve of the import vs page solve of the exported .inp: ' + w.n + ' heads, largest difference ' + w.w.toExponential(2) + ' m at ' + w.at);
	ok('all 31 other shared nodes within 1 mm', w.n === 31 && w.w <= 1e-3);
	ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
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
		await synthetic(browser);
		await unitDemand(browser);
		await tgh(browser);
		await samples(browser);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
