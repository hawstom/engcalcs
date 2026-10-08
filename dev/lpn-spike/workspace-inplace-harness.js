// IMPORTING A WORKSPACE LAYS THE BOXES OUT IN PLACE, WITH NO RELOAD (Tom, 2026-10-08, on the branch:
// "Why does it reload the page?"). It reloaded only because re-applying every box live was harder.
//
//   node dev/lpn-spike/workspace-inplace-harness.js        (takes the browser lock itself)
//
//   1. A workspace file that moves, sizes, docks and opens several boxes, sets both panes and turns
//      a preference, is exported from one browser and imported into another that has a different
//      layout, an open project, a selected element and a marker set on `window`.
//   2. After Replace and OK: the marker survives (no navigation), the project and the selection are
//      the same, and every box, dock strip, pane and map margin is exactly where a RELOAD of that
//      same storage puts it.
//   3. A second import, of a file holding nothing, with first-visit docks switched on, gives the
//      first-visit docks, again equal to a reload.
//   4. Storage after the import holds exactly the file's keys, and still does after the page settles.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_WSINPLACE_BROWSER_LOCKED';
const NAME = 'workspace-inplace-harness';

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
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'lpn-wsinplace-'));
const { clickNode } = require('./dock-boxes.js');

const quiet = (a) => a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
async function openNet3(browser, name, init) {
	const a = await Session.open(browser, name, { viewport: { width: 1400, height: 900 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	if (init) { await a.page.addInitScript(init); }
	return a;
}
async function boot(a, tomsStorage) {
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await quiet(a);
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(1200);
	if (tomsStorage) {
		await a.page.evaluate((s) => { Object.keys(s).forEach((k) => localStorage.setItem(k, typeof s[k] === 'string' ? s[k] : JSON.stringify(s[k]))); }, tomsStorage);
		await a.reload();
		await quiet(a);
		await a.settle(2000);
	}
}
const paneTabId = (a) => a.page.evaluate(() => {
	const t = document.querySelector('#lpn_pane [id^="lpn_pane_tab_"]:not([id^="lpn_pane_tab_menu_"])');
	return t ? t.id.replace('lpn_pane_tab_', '') : null;
});
// Everything about where the furniture is, as plain data. The Properties box is left out when asked
// (its content follows a selection, which a reload drops by design).
const layoutSnapshot = (a, withPopup) => a.page.evaluate((withPopup) => {
	const ids = ['lpn_settings_box', 'lpn_find_popup', 'lpn_library_box', 'lpn_ff_box', 'lpn_crit_box', 'lpn_ds_box',
		'lpn_energy_box', 'lpn_contour_box', 'lpn_snip_box', 'lpn_scncmp_box', 'lpn_rptbox', 'lpn_status_box', 'lpn_alt_box',
		'lpn_full_box', 'lpn_calib_box', 'lpn_notes_popup', 'lpn_hotkeys_popup'];
	if (withPopup) { ids.push('lpn_popup'); }
	const out = { boxes: {}, strips: {} };
	ids.forEach((id) => {
		const b = document.getElementById(id);
		if (!b) { out.boxes[id] = 'missing'; return; }
		const shown = b.style.display !== 'none' && b.style.display !== '';
		const r = b.getBoundingClientRect();
		out.boxes[id] = shown ? {
			l: Math.round(r.left), t: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height),
			docked: b.classList.contains('lpn-docked'), out: b.classList.contains('lpn-dock-out'), tucked: b.classList.contains('lpn-dock-collapsed')
		} : null;
	});
	['left', 'right'].forEach((s) => {
		out.strips[s] = Array.from(document.querySelectorAll('#lpn_dock_strip_' + s + ' .lpn-dock-tab')).map((t) => t.getAttribute('aria-controls'));
	});
	const wrap = document.querySelector('.lpn-map-wrap'), svg = document.getElementById('lpn_canvas');
	out.margins = wrap ? [wrap.style.getPropertyValue('--lpn-dock-ml'), wrap.style.getPropertyValue('--lpn-dock-mr')] : null;
	const sr = svg.getBoundingClientRect();
	out.map = [Math.round(sr.left), Math.round(sr.top), Math.round(sr.width), Math.round(sr.height)];
	const pane = document.getElementById('lpn_pane'), body = document.getElementById('lpn_pane_body'), rp = document.getElementById('lpn_rpane');
	out.pane = { display: pane.style.display, h: body ? body.style.height : null,
		on: Array.from(document.querySelectorAll('#lpn_pane .lpn-pane-panel.on, #lpn_pane [aria-selected="true"]')).map((e) => e.id).sort() };
	const rr = rp.getBoundingClientRect();
	out.rpane = { display: rp.style.display, w: Math.round(rr.width), l: Math.round(rr.left) };
	out.cols = Array.from(document.querySelectorAll('#lpn_pane table th')).filter((t) => t.getBoundingClientRect().width > 0).slice(0, 4).map((t) => Math.round(t.getBoundingClientRect().width));
	const ix = document.getElementById('lpn_setbox_index');
	out.ix = ix ? ix.style.flexBasis : null;
	return out;
}, withPopup);
const storageOf = (a) => a.page.evaluate(() => {
	const o = {};
	for (let i = 0; i < localStorage.length; i++) {
		const k = localStorage.key(i);
		if (EngCalcs.lpnWorkspaceCarries(k)) { o[k] = localStorage.getItem(k); }
	}
	return o;
});
function diff(x, y, p) {
	p = p || '';
	if (typeof x !== 'object' || typeof y !== 'object' || x === null || y === null) { return JSON.stringify(x) === JSON.stringify(y) ? [] : [p + ': ' + JSON.stringify(x) + ' vs ' + JSON.stringify(y)]; }
	let out = [];
	new Set(Object.keys(x).concat(Object.keys(y))).forEach((k) => { out = out.concat(diff(x[k], y[k], p + '/' + k)); });
	return out;
}
async function importFile(a, text, name) {
	const file = path.join(TMP, name);
	fs.writeFileSync(file, text);
	const [chooser] = await Promise.all([
		a.page.waitForEvent('filechooser', { timeout: 8000 }),
		a.menuClickSub(await a.lang('lpn_file_import_menu'), await a.lang('lpn_file_import_workspace'))
	]);
	await chooser.setFiles(file);
	const first = await a.waitDialog(6000);
	if (!first || first.text !== await a.lang('lpn_workspace_confirm')) { return first; }
	await a.dialogClick(await a.lang('lpn_replace_btn'));
	return a.waitDialog(6000);
}
async function exportWorkspace(a) {
	const [dl] = await Promise.all([
		a.page.waitForEvent('download', { timeout: 8000 }),
		a.menuClickSub(await a.lang('lpn_file_export_menu'), await a.lang('lpn_file_export_item_workspace'))
	]);
	const file = path.join(TMP, 'out.json');
	await dl.saveAs(file);
	return fs.readFileSync(file, 'utf8');
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
		console.log('\n--- 1. the file: several boxes moved, sized, docked and opened; both panes; a preference ---');
		const src = await openNet3(browser, NAME + '-src');
		await src.goto('Looped-Network.php');
		const tab = await (async () => { await src.answerTrainingPanel().catch(() => {}); return paneTabId(src); })();
		ok('the bottom pane has a first tab to remember', !!tab, String(tab));
		const SRC = {
			lpn_setbox: { left: 180, top: 140, w: 520, h: 420, ix: 150, open: true },
			lpn_libbox: { left: 700, top: 200, w: 480, h: 360, open: true },
			lpn_findbox: { left: 400, top: 160, w: 380, h: 300, open: true, dock: 'left', autohide: true, dockW: 340, dockOrd: 0 },
			lpn_energybox: { left: null, top: null, w: null, h: null, open: true, dock: 'right', dockW: 400, dockOrd: 0 },
			lpn_contourbox: { left: 300, top: 260, w: 430, h: 390, userSized: true, open: true },
			lpn_reportbox: { left: null, top: null, w: null, h: null, open: true, dock: 'right', autohide: true, dockOrd: 1 },
			lpn_dockbox: { lpn_crit_box: { dock: 'left', open: true, dockW: 330, dockOrd: 1 } },
			lpn_pane: { open: true, h: 300, tab: tab },
			lpn_rpane: { open: true, w: 300 },
			lpn_panecols: { [tab]: { w: { id: 19 } } },
			lpn_runbox: 'off',
			lpn_areahint: '0'
		};
		await boot(src, SRC);
		const fileText = await exportWorkspace(src);
		const file = JSON.parse(fileText);
		ok('the exported file carries those records', Object.keys(SRC).every((k) => k in file.settings), Object.keys(file.settings).join(','));
		await src.close();

		console.log('\n--- 2. imported into a browser with another layout, an open project and a selection ---');
		const DST = {
			lpn_setbox: { left: 40, top: 110, w: 400, h: 350, open: true },
			lpn_findbox: { left: 600, top: 300, w: 360, h: 280, open: true },
			lpn_contourbox: { open: true, dock: 'left', dockW: 300, dockOrd: 0 },
			lpn_ffbox: { left: 500, top: 120, w: 420, h: 340, open: true },
			lpn_cmpbox: { open: true, dock: 'right', dockOrd: 0 },
			lpn_pane: { open: true, h: 180, tab: 'profile' },
			lpn_scnbasic: 'off'
		};
		const dst = await openNet3(browser, NAME + '-dst');
		await boot(dst, DST);
		await clickNode(dst);
		await dst.page.evaluate(() => { window.__marker = 'same page'; window.__t0 = performance.timeOrigin; });
		const projectBefore = await dst.page.evaluate(() => document.title + '|' + (document.querySelector('.lpn-tab-current, .lpn-tab.on') || {}).textContent);
		const popupBefore = await dst.page.evaluate(() => { const p = document.getElementById('lpn_popup'); return p ? p.style.display + '|' + p.innerText : null; });
		ok('before: a selection has the Properties box open', /^(flex|block)\|./.test(popupBefore || ''), String(popupBefore).slice(0, 60));
		const pre = await layoutSnapshot(dst, false);
		const dlg = await importFile(dst, fileText, 'in.json');
		ok('the report dialog does not announce a reload', !!dlg && /Workspace applied/.test(dlg.text) && !/reload/i.test(dlg.text), dlg && dlg.text);
		await dst.dialogClick('OK');
		await dst.settle(1200);
		ok('the page did NOT reload: a marker set on window survives', await dst.page.evaluate(() => window.__marker === 'same page'));
		ok('the open project is the same one', (await dst.page.evaluate(() => document.title + '|' + (document.querySelector('.lpn-tab-current, .lpn-tab.on') || {}).textContent)) === projectBefore);
		const popupAfter = await dst.page.evaluate(() => { const p = document.getElementById('lpn_popup'); return p ? p.style.display + '|' + p.innerText : null; });
		ok('the selection is undisturbed: the Properties box shows the same element', popupAfter === popupBefore, String(popupAfter).slice(0, 60));
		const inPlace = await layoutSnapshot(dst, false);
		ok('the layout changed (the test would mean nothing otherwise)', diff(pre, inPlace).length > 6, String(diff(pre, inPlace).length));
		ok('the column width in the file reached the open table', inPlace.cols.length > 0 && inPlace.cols[0] !== pre.cols[0], JSON.stringify([pre.cols, inPlace.cols]));
		const stAfter = await storageOf(dst);
		const want = file.settings;
		ok('storage holds exactly the file\'s keys and values', diff(stAfter, want).length === 0, diff(stAfter, want).join(' ; '));
		await dst.settle(1500);
		ok('...and still does after the page settles', diff(await storageOf(dst), want).length === 0, diff(await storageOf(dst), want).join(' ; '));
		await dst.reload();
		await quiet(dst);
		await dst.settle(2200);
		const reloaded = await layoutSnapshot(dst, false);
		const d = diff(inPlace, reloaded);
		ok('every box, strip, pane and margin is where a reload puts it', d.length === 0, d.slice(0, 8).join(' ; '));
		ok('no uncaught page errors', dst.errors.length === 0, dst.errors.slice(0, 2).join(' | '));

		console.log('\n--- 3. a file holding nothing, with first-visit docks on: the first-visit docks, in place ---');
		await dst.page.addInitScript(() => { window.EC_DEFAULT_DOCKS = true; });
		await dst.page.evaluate(() => { window.__marker = 'same page'; window.EC_DEFAULT_DOCKS = true; });
		const empty = JSON.stringify({ format: 'engcalcs-lpn-workspace', version: 1, settings: {} });
		const dlg3 = await importFile(dst, empty, 'empty.json');
		ok('the empty file is accepted', !!dlg3 && /Workspace applied/.test(dlg3.text), dlg3 && dlg3.text);
		await dst.dialogClick('OK');
		await dst.settle(1500);
		ok('no reload', await dst.page.evaluate(() => window.__marker === 'same page'));
		const inPlace3 = await layoutSnapshot(dst, true);
		ok('first-visit docks stand: fourteen tabs', inPlace3.strips.left.length + inPlace3.strips.right.length === 14, JSON.stringify(inPlace3.strips));
		ok('nothing is stored for them', Object.keys(await storageOf(dst)).length === 0, Object.keys(await storageOf(dst)).join(','));
		await dst.reload();
		await quiet(dst);
		await dst.settle(2200);
		const d3 = diff(inPlace3, await layoutSnapshot(dst, true));
		ok('equal to a reload', d3.length === 0, d3.slice(0, 8).join(' ; '));
		ok('no uncaught page errors (3)', dst.errors.length === 0, dst.errors.slice(0, 2).join(' | '));
		await dst.close();
	} finally {
		await browser.close();
		env.stopServer();
		try { fs.rmSync(TMP, { recursive: true, force: true }); } catch (e) { /* tmp */ }
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
