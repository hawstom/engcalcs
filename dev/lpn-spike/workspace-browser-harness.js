// WORKSPACE EXPORT AND IMPORT, IN A REAL BROWSER (Tom, 2026-10-07: *"It would be really cool to be
// able to export and import my workspace (profile), mainly all my dockable boxes, but anything else
// also that is a browser-saved user setting."*).
//
//   node dev/lpn-spike/workspace-browser-harness.js        (takes the browser lock itself)
//
//   1. Two boxes (Settings, Find) are moved and resized by the mouse. File > Export > Workspace
//      downloads a JSON file carrying them, and carrying NO project, identity or consent record.
//   2. Every workspace key is removed and the page reloaded: the boxes are gone. File > Import >
//      Workspace with that file brings both back, in the same place and at the same size, with no reload. Nothing new appears in localStorage.
//   3. A bad file (not JSON, wrong format, a newer version) is refused with a message, changes no
//      stored key and does not reload. A good file with entries it does not know applies what it
//      knows, ignores the rest, reports the count, and never writes a project or index key.
//   4. The check (workspace_keys_check.php) fails on a non-`lpn_` key that is neither carried nor
//      excluded, and lets a new `lpn_` furniture key ride along.
//   6. Tom's sequence (2026-10-07): fifteen boxes docked as auto-hide tabs, exported, Alternatives
//      (top left) and Properties (top right) closed, imported: a confirm first, whose Cancel changes
//      nothing; Replace brings both back, all fifteen docked in the same order, still fifteen after
//      a further reload.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_WORKSPACE_BROWSER_LOCKED';
const NAME = 'workspace-browser-harness';

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
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'lpn-workspace-'));
const { strips, dockHidden } = require('./dock-boxes.js');
// What the page itself carries: every lpn_ key it does not exclude, plus its named extras.
const carried = (a, k) => a.page.evaluate((x) => EngCalcs.lpnWorkspaceCarries(x), k);
const heldKeys = (a) => a.page.evaluate(() => Object.keys(localStorage).filter((k) => EngCalcs.lpnWorkspaceCarries(k)).sort());

async function openNet3(browser) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	// The session installs an auto-answering dialog hook; a real visitor has none, and the OK that
	// precedes the reload is part of what is asserted here.
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(1200);
	return a;
}
const rect = (a, id) => a.page.evaluate((i) => {
	const b = document.getElementById(i);
	if (!b || b.style.display === 'none' || b.style.display === '') { return null; }
	const r = b.getBoundingClientRect();
	return { l: Math.round(r.left), t: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
}, id);
const allKeys = (a) => a.page.evaluate(() => Object.keys(localStorage).sort());
const snapshot = (a) => a.page.evaluate(() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { o[localStorage.key(i)] = localStorage.getItem(localStorage.key(i)); } return o; });
const near = (p, q, tol) => !!p && !!q && ['l', 't', 'w', 'h'].every((k) => Math.abs(p[k] - q[k]) <= tol);

async function drag(a, selector, dx, dy) {
	const tb = await (await a.page.$(selector)).boundingBox();
	const x = tb.x + 20, y = tb.y + tb.height / 2;
	await a.page.mouse.move(x, y);
	await a.page.mouse.down();
	await a.page.mouse.move(x + dx, y + dy, { steps: 8 });
	await a.page.mouse.up();
	await a.settle(400);
}
// A real resize: the corner grip of a box, dragged.
async function resizeBy(a, id, dw, dh) {
	const b = await (await a.page.$('#' + id)).boundingBox();
	const x = b.x + b.width - 5, y = b.y + b.height - 5;
	await a.page.mouse.move(x, y);
	await a.page.mouse.down();
	await a.page.mouse.move(x + dw, y + dh, { steps: 8 });
	await a.page.mouse.up();
	await a.settle(400);
}
async function exportWorkspace(a) {
	const [dl] = await Promise.all([
		a.page.waitForEvent('download', { timeout: 8000 }),
		a.menuClickSub(await a.lang('lpn_file_export_menu'), await a.lang('lpn_file_export_item_workspace'))
	]);
	const file = path.join(TMP, 'out.json');
	await dl.saveAs(file);
	return { name: dl.suggestedFilename(), text: fs.readFileSync(file, 'utf8') };
}
// Offer a file to File > Import > Workspace. A file the page can use is first met by the confirm
// (Tom: "Add a confirm"); `answer` is the button pressed there, and the dialog after it is returned.
// A file the page refuses never reaches the confirm, so its refusal is what comes back.
async function importWorkspace(a, text, fname, answer) {
	const file = path.join(TMP, fname || 'in.json');
	fs.writeFileSync(file, text);
	const [chooser] = await Promise.all([
		a.page.waitForEvent('filechooser', { timeout: 8000 }),
		a.menuClickSub(await a.lang('lpn_file_import_menu'), await a.lang('lpn_file_import_workspace'))
	]);
	await chooser.setFiles(file);
	const first = await a.waitDialog(6000);
	if (!first || first.text !== await a.lang('lpn_workspace_confirm')) { return first; }
	await a.dialogClick(answer || await a.lang('lpn_replace_btn'));
	await a.settle(300);
	if (answer === await a.lang('lpn_cancel')) { return null; }
	return a.waitDialog(6000);
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
		console.log('\n--- 1. two boxes moved and resized, then exported ---');
		const a = await openNet3(browser);
		await a.toolbarClick(await a.lang('lpn_tool_settings'));
		await a.settle(500);
		await a.menuClick(await a.lang('lpn_find_menu'), 'edit');
		await a.settle(500);
		await drag(a, '#lpn_settings_box .lpn-setbox-title', -150, 90);
		await resizeBy(a, 'lpn_settings_box', 60, 40);
		await a.settle(500);
		await drag(a, "#lpn_find_popup .lpn-setbox-title", 0, 160);
		await resizeBy(a, 'lpn_find_popup', 70, 50);
		await a.settle(500);
		const setBefore = await rect(a, 'lpn_settings_box'), findBefore = await rect(a, 'lpn_find_popup');
		ok('both boxes are open', !!setBefore && !!findBefore && setBefore.w > 300 && findBefore.w > 300, JSON.stringify([setBefore, findBefore]));
		const keysBefore = await allKeys(a);
		const out = await exportWorkspace(a);
		ok('the download is a .json file', /\.json$/.test(out.name), out.name);
		const doc = JSON.parse(out.text);
		ok('it declares its format and version', doc.format === 'engcalcs-lpn-workspace' && doc.version === 1, doc.format + ' v' + doc.version);
		ok('it carries both boxes', !!doc.settings.lpn_setbox && !!doc.settings.lpn_findbox, Object.keys(doc.settings).join(', '));
		const carriedAll = await Promise.all(Object.keys(doc.settings).map((k) => carried(a, k)));
		ok('every key in it is one the workspace carries', carriedAll.every(Boolean));
		ok('no project, index, identity or consent record in it', !/lpn_project_|lpn_index|lpn_identity|lpn_document|ec_consent|ec_geosearch|ec_terrain/.test(out.text));
		ok('exporting wrote nothing to the device', JSON.stringify(await allKeys(a)) === JSON.stringify(keysBefore));

		console.log('\n--- 2. cleared, reloaded, imported ---');
		await a.page.evaluate((ks) => ks.forEach((k) => localStorage.removeItem(k)), await heldKeys(a));
		await a.reload();
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await a.settle(1500);
		ok('with the keys cleared, neither box comes back', (await rect(a, 'lpn_settings_box')) === null && (await rect(a, 'lpn_find_popup')) === null);
		const keysCleared = await allKeys(a);
		const dlg = await importWorkspace(a, out.text);
		ok('a report dialog says what was applied, and no reload is announced', !!dlg && /Workspace applied/.test(dlg.text) && !/records/i.test(dlg.text) && !/reload/i.test(dlg.text), dlg && dlg.text);
		await a.dialogClick('OK');
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await a.settle(2000);
		const setAfter = await rect(a, 'lpn_settings_box'), findAfter = await rect(a, 'lpn_find_popup');
		ok('Settings returns in place and size', near(setBefore, setAfter, 2), JSON.stringify([setBefore, setAfter]));
		ok('Find returns in place and size', near(findBefore, findAfter, 2), JSON.stringify([findBefore, findAfter]));
		const keysAfter = await allKeys(a);
		ok('importing created no key but the ones in the file', keysAfter.every((k) => keysCleared.indexOf(k) >= 0 || k in doc.settings), keysAfter.filter((k) => keysCleared.indexOf(k) < 0).join(', '));

		console.log('\n--- 3. bad files are refused; unknown entries are ignored ---');
		await a.page.evaluate(() => { window.__noReload = true; delete window.lpnDialogAnswerer; });
		const snap = await snapshot(a);
		const bad = [
			['not JSON', '{ this is not json', 'lpn_workspace_refused_unreadable'],
			['wrong format', JSON.stringify({ format: 'something-else', version: 1, settings: {} }), 'lpn_workspace_refused_format'],
			['a project document', JSON.stringify({ v: 3, name: 'x', nodes: [] }), 'lpn_workspace_refused_format'],
			['settings an array', JSON.stringify({ format: 'engcalcs-lpn-workspace', version: 1, settings: [] }), 'lpn_workspace_refused_format'],
			['a future format', JSON.stringify({ format: 'engcalcs-lpn-workspace', version: 99, settings: {} }), 'lpn_workspace_refused_newer']
		];
		for (const [label, text, key] of bad) {
			const d = await importWorkspace(a, text, 'bad.json');
			const want = (await a.lang(key)).split('{version}')[0].trim();
			ok(label + ': refused with its message', !!d && d.text.indexOf(want) === 0, d && d.text);
			await a.dialogClick('OK');
			await a.settle(400);
			ok(label + ': nothing stored changed and the page did not reload',
				JSON.stringify(await snapshot(a)) === JSON.stringify(snap) && await a.page.evaluate(() => window.__noReload === true));
		}
		const mixed = JSON.stringify({ format: 'engcalcs-lpn-workspace', version: 1, settings: {
			lpn_runbox: 'off', lpn_index: 'EVIL', lpn_project_zzz: '{}', lpn_identity: 'EVIL', ec_consent: 'x', unknown_key: 'y',
			lpn_setbox: 'not json {' } });
		const d = await importWorkspace(a, mixed, 'mixed.json');
		ok('a file with strangers applies what it knows and reports the rest', !!d && /Settings applied: 1\./.test(d.text) && /recognized: 6\./.test(d.text), d && d.text);
		await a.dialogClick('OK');
		await a.page.evaluate(() => { delete window.lpnDialogAnswerer; });
		await a.settle(1500);
		const fin = await snapshot(a);
		ok('lpn_runbox applied', fin.lpn_runbox === 'off');
		ok('the project index and identity were not overwritten, no stranger key appeared', fin.lpn_identity === snap.lpn_identity && fin.lpn_index.indexOf('EVIL') < 0 && !('lpn_project_zzz' in fin) && !('unknown_key' in fin) && fin.ec_consent === undefined);
		ok('keys absent from the file were returned to their defaults', fin.lpn_setbox === undefined && fin.lpn_findbox === undefined);
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));

		console.log('\n--- 5. boxes from a bigger screen land inside this window ---');
		const big = JSON.stringify({ format: 'engcalcs-lpn-workspace', version: 1, settings: {
			lpn_setbox: JSON.stringify({ left: 5000, top: 4000, w: 430, h: 380, open: true }),
			lpn_findbox: JSON.stringify({ left: -3000, top: -50, w: 400, h: 300, open: true }) } });
		const d5 = await importWorkspace(a, big, 'big.json');
		ok('the big-screen file is accepted', !!d5 && /Workspace applied/.test(d5.text), d5 && d5.text);
		await a.dialogClick('OK');
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await a.settle(2000);
		for (const id of ['lpn_settings_box', 'lpn_find_popup']) {
			const r = await rect(a, id);
			const vp = await a.page.evaluate(() => ({ w: innerWidth, h: innerHeight }));
			ok(id + ' is open with its whole title bar inside the window', !!r && r.l >= 0 && r.l + r.w <= vp.w + 1 && r.t >= 0 && r.t + 40 <= vp.h, JSON.stringify([r, vp]));
		}
		ok('no uncaught page errors (after import 5)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();

		console.log('\n--- 6. Tom\'s sequence: fifteen docks, export, close two, import ---');
		const b = await Session.open(browser, NAME + '-tom', { viewport: { width: 1600, height: 1000 } });
		await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await b.goto('Looped-Network.php');
		// Basic mode off, the browser's own setting, so the Alternatives box can be opened.
		await b.page.evaluate(() => { try { localStorage.setItem('lpn_scnbasic', 'off'); } catch (e) {} });
		await b.reload();
		await b.answerTrainingPanel().catch(() => {});
		const quiet = () => b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await quiet();
		await b.openExampleCard(await b.lang('lpn_ex_net3_title'));
		await b.settle(800);
		const L = ['lpn_sm_box', 'lpn_energy_box', 'lpn_scncmp_box', 'lpn_rptbox', 'lpn_status_box', 'lpn_calib_box', 'lpn_full_box'];
		const R = ['lpn_popup', 'lpn_settings_box', 'lpn_find_popup', 'lpn_library_box', 'lpn_contour_box', 'lpn_ff_box', 'lpn_crit_box', 'lpn_ds_box'];
		for (const id of L) { await dockHidden(b, id, 'left'); }
		for (const id of R) { await dockHidden(b, id, 'right'); }
		const fifteen = JSON.stringify([L, R]);
		let st = await strips(b.page);
		ok('fifteen boxes docked as auto-hide tabs, Alternatives top left and Properties top right', JSON.stringify(st) === fifteen, JSON.stringify(st));
		const tomFile = (await exportWorkspace(b)).text;
		ok('the exported file carries the docks of the boxes with no record of their own', /lpn_dockbox/.test(tomFile) && /lpn_calib_box/.test(tomFile) && /lpn_popup/.test(tomFile));
		// The Scenario manager keeps its own record (lpn_smbox, feat/bentley-interop), which a workspace carries.
		ok('...and the Alternatives box\'s own record, lpn_smbox', /lpn_smbox/.test(tomFile));
		// Close the top one on each edge with its own X, from its flown-out tab.
		for (const [side, id, x] of [['left', 'lpn_sm_box', 'lpn_sm_close'], ['right', 'lpn_popup', 'lpn_popup_close']]) {
			await b.page.click('#lpn_dock_strip_' + side + ' .lpn-dock-tab[aria-controls="' + id + '"]');
			await b.settle(400);
			await b.page.click('#' + x);
			await b.settle(400);
		}
		st = await strips(b.page);
		ok('Scenario manager and Properties closed: thirteen tabs', st[0].length + st[1].length === 13 && !st[0].includes('lpn_sm_box') && !st[1].includes('lpn_popup'), JSON.stringify(st));
		const before = await snapshot(b);
		await b.page.evaluate(() => { window.__noReload = true; });
		const cancelled = await importWorkspace(b, tomFile, 'tom.json', await b.lang('lpn_cancel'));
		await b.settle(500);
		ok('the confirm\'s Cancel changes nothing: no further dialog, no reload, storage as it was',
			cancelled === null && (await b.dialog()) === null && await b.page.evaluate(() => window.__noReload === true) &&
			JSON.stringify(await snapshot(b)) === JSON.stringify(before));
		ok('...and the layout on screen is unchanged', JSON.stringify(await strips(b.page)) === JSON.stringify(st));
		// The confirm itself: its words and its two buttons.
		const file2 = path.join(TMP, 'tom2.json');
		fs.writeFileSync(file2, tomFile);
		const [ch2] = await Promise.all([b.page.waitForEvent('filechooser', { timeout: 8000 }),
			b.menuClickSub(await b.lang('lpn_file_import_menu'), await b.lang('lpn_file_import_workspace'))]);
		await ch2.setFiles(file2);
		const conf = await b.waitDialog(6000);
		ok('Import asks first, in the page\'s own dialog, with Replace and Cancel',
			!!conf && conf.text === await b.lang('lpn_workspace_confirm') && JSON.stringify(conf.buttons) === JSON.stringify([await b.lang('lpn_replace_btn'), await b.lang('lpn_cancel')]),
			JSON.stringify(conf));
		await b.dialogClick(await b.lang('lpn_replace_btn'));
		const rep = await b.waitDialog(6000);
		ok('Replace applies it and reports it', !!rep && /Workspace applied/.test(rep.text) && !/reload/i.test(rep.text), rep && rep.text);
		await b.dialogClick('OK');
		await quiet();
		await b.settle(2000);
		st = await strips(b.page);
		ok('(a) the two closed boxes are back, (b) all fifteen docked in the same order', JSON.stringify(st) === fifteen, JSON.stringify(st));
		await b.reload();
		await quiet();
		await b.settle(1500);
		st = await strips(b.page);
		ok('...and still fifteen, in order, after a further reload', JSON.stringify(st) === fifteen, JSON.stringify(st));
		ok('no uncaught page errors (Tom\'s sequence)', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
		await b.close();

		console.log('\n--- 4. the allow-list check fails on a key that is in neither list ---');
		const php = `define('WORKSPACE_KEYS_LIB_ONLY', true);
require ${JSON.stringify(path.join(REPO, 'dev/scripts/workspace_keys_check.php'))};
$f = ecWorkspaceFindings(['js/x.js' => "localStorage.setItem('lpn_newbox', '1');\\nlocalStorage.setItem('ec_newpref', '1');\\nlocalStorage.setItem('bpn_sketch_toggles', '1');"], ['bpn_sketch_toggles'], ['lpn_index'], []);
echo json_encode($f);`;
		const res = spawnSync('php', ['-r', php], { encoding: 'utf8' });
		let f = [];
		try { f = JSON.parse(res.stdout); } catch (e) { /* reported below */ }
		ok('a new lpn_ furniture key rides along; a new key outside lpn_ is a finding that names it', f.length === 1 && /ec_newpref/.test(f[0]), res.stdout + res.stderr);
		const real = spawnSync('php', [path.join(REPO, 'dev/scripts/workspace_keys_check.php')], { encoding: 'utf8' });
		ok('the real tree passes the check', real.status === 0, real.stdout.trim());
	} finally {
		await browser.close();
		env.stopServer();
		try { fs.rmSync(TMP, { recursive: true, force: true }); } catch (e) { /* tmp */ }
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
