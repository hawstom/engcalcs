// THE SHEET STYLE IS APPLIED TO EVERY BOX THAT SHOULD HAVE IT (round 10b; Tom, 2026-10-31: "audit the entire app to be sure that it is applied
// cleanly and systematically wherever appropriate"). The sheet audit found it missing in a dozen boxes because the class is easy to forget:
// a box takes the style only when Looped-Network.php marks it `lpn-sheetbox`, and a new box built by lpnGridRow() without the mark silently gets the
// older "Label | Value" grid. This opens each box the audit listed as one that should be a sheet (its sections A and B) on Net1, at 1366 x 900 and
// at 390 x 844 touch, and fails if a box shows
//   - a `.lpn-grow` row outside a `.lpn-sheet` (the old grid),
//   - a "Label | Value" heading band (`.lpn-ghdr`; Task 842: no first-column heading),
//   - a button row or a note confined to the Value column (`.lpn-gcol2`, or a button standing in the Value column that is not in a row),
//   - horizontal overflow of the box.
// Settings uses its own `.lpn-set-row` rows and is checked for the heading band and overflow only. Tables, the Screenshot box, Scenario manager,
// import mapping tables and prose dialogs are rightly not sheets (the audit's section C) and are not opened here.
//
//   node dev/lpn-spike/sheet-coverage-browser-harness.js   (takes the browser lock itself)
//   SHEETCOV_SHOT=<dir> writes a screenshot of each box there.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SHEETCOV_LOCKED';
const NAME = 'sheet-coverage-browser-harness';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
const { openBox } = require('./dock-boxes.js');
let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

// Runs in the page. `spec` = { root, sheet }: the box's element, and whether it must be a sheet (Settings is not).
function inspect(spec) {
	const root = document.querySelector(spec.root);
	if (!root) { return { missing: true }; }
	const R = (e) => e.getBoundingClientRect();
	const vis = (e) => { const r = R(e), cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !e.closest('[hidden]'); };
	const box = root.closest('.lpn-popover, #lpn_dialog') || root;
	const out = { grow: [], band: 0, oneCol: [], over: Math.max(box.scrollWidth - box.clientWidth, root.scrollWidth - root.clientWidth) };
	out.band = Array.from(root.querySelectorAll('.lpn-ghdr')).filter(vis).length;
	if (!spec.sheet) { return out; }
	out.grow = Array.from(root.querySelectorAll('.lpn-grow')).filter(vis).filter((r) => !r.closest('.lpn-sheet') && !r.closest('.lpn-gplain'))
		.map((r) => (r.querySelector('.lpn-gname') || r).textContent.trim().slice(0, 24));
	out.oneCol = Array.from(root.querySelectorAll('.lpn-gcol2')).filter(vis).map((e) => 'gcol2 ' + (e.id || e.className).toString().slice(0, 40));
	// A button standing in the Value column outside any row is a button row confined to one column.
	const names = Array.from(root.querySelectorAll('.lpn-gname')).filter(vis);
	if (names.length) {
		const xs = {};
		names.forEach((n) => { const k = Math.round(R(n).right); xs[k] = (xs[k] || 0) + 1; });
		const cellX = +Object.keys(xs).sort((a, b) => xs[b] - xs[a])[0];
		Array.from(root.querySelectorAll('button')).filter(vis).forEach((b) => {
			if (b.closest('.lpn-grow, table, .lpn-popover-x, .lpn-corner-btn, .lpn-setbox-title, .lpn-box-tools, .lpn-report-tools, .lpn-ff-buttons:not(:has(> .lpn-ff-run, > .lpn-ff-stopbtn)), .lpn-gsplit, .lpn-gfull, .lpn-gtext, .lpn-pane-goto, .lpn-lib-note, .lpn-lib-nav, #lpn_libbox_index, .lpn-setbox-index, .lpn-gtitle-id')) { return; }
			if (R(b).left >= cellX - 2) { out.oneCol.push('button ' + (b.id || b.textContent.trim().slice(0, 20)) + '@' + Math.round(R(b).left - cellX)); }
		});
	}
	return out;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const SHOT = process.env.SHEETCOV_SHOT || '';
	const MODES = [['PC', { viewport: { width: 1366, height: 900 } }], ['phone', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }]];
	try {
		for (const [mode, opt] of MODES) {
			console.log('\n=== ' + mode + ' ===');
			const a = await Session.open(browser, NAME + '-' + mode, Object.assign({ serviceWorkers: 'block' }, opt));
			await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
			await a.goto('Looped-Network.php?ec_nolog=1');
			await a.answerTrainingPanel().catch(() => {});
			await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } localStorage.removeItem('lpn_gcols'); });
			await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
			await a.settle(1500);
			const close = async (id) => {
				await a.page.evaluate((i) => { const b = document.querySelector('#' + i + ' .lpn-popover-x, #' + i + ' [id$="_close"]'); if (b) { b.click(); } }, id);
				await a.settle(250);
			};
			const check = async (tag, root, sheet, shotSel) => {
				await a.settle(700);
				const m = await a.page.evaluate(inspect, { root, sheet });
				if (m.missing) { ok(tag + ': opened', false, 'no ' + root); return; }
				if (SHOT) { await a.page.locator(shotSel || root).screenshot({ path: path.join(SHOT, 'sheetcov-' + tag.replace(/\W+/g, '-') + '-' + mode + '.png') }).catch(() => {}); }
				if (sheet) { ok(tag + ': every row is in a sheet', m.grow.length === 0, JSON.stringify(m.grow)); }
				ok(tag + ': no "Label | Value" heading band', m.band === 0, String(m.band));
				if (sheet) { ok(tag + ': no button row or note confined to one column', m.oneCol.length === 0, JSON.stringify(m.oneCol)); }
				ok(tag + ': does not scroll sideways', m.over <= 1, String(m.over));
			};
			// Boxes opened from a menu.
			for (const [id, name, root] of [
				['lpn_ff_box', 'fire flow', '#lpn_ff_box .lpn-popover-body'], ['lpn_crit_box', 'criticality', '#lpn_crit_box .lpn-popover-body'],
				['lpn_ds_box', 'demand scaling', '#lpn_ds_box .lpn-popover-body'], ['lpn_contour_box', 'contour', '#lpn_contour_body'],
				['lpn_find_popup', 'find', '#lpn_find_form'], ['lpn_scncmp_box', 'scenario comparison', '#lpn_scncmp_box .lpn-popover-body'],
				['lpn_calib_box', 'calibration report', '#lpn_calib_box .lpn-popover-body'], ['lpn_full_box', 'full report', '#lpn_full_box .lpn-popover-body']]) {
				await openBox(a, id);
				await check(name, root, true, '#' + id);
				await close(id);
			}
			// Libraries: the sections that carry entry fields.
			await openBox(a, 'lpn_library_box');
			for (const sec of ['patterns', 'curves']) {
				await a.page.click('#lpn_libbox_link_' + sec);
				await check('libraries ' + sec, '#lpn_libbox_content', true, '#lpn_library_box');
			}
			await close('lpn_library_box');
			// Settings: its own rows; no heading band, no overflow.
			await openBox(a, 'lpn_settings_box');
			await check('settings', '#lpn_settings_box .lpn-popover-body', false, '#lpn_settings_box');
			await close('lpn_settings_box');
			// New project and the projection chooser it opens; Convert as; Export tables.
			await a.menuClick(await a.lang('lpn_file_new'), 'file');
			await a.page.waitForSelector('#lpn_new_panel', { state: 'visible', timeout: 4000 }).catch(() => {});
			await check('new project', '#lpn_new_body', true, '#lpn_new_panel');
			await a.page.click('#lpn_new_coords_geo').catch(() => {});
			await a.page.click('#lpn_new_crs_pick').catch(() => {});
			await a.page.waitForSelector('#lpn_crsbox', { state: 'visible', timeout: 4000 }).catch(() => {});
			await check('projection chooser', '#lpn_crsbox_body', true, '#lpn_crsbox');
			await close('lpn_crsbox');
			await a.page.click('#lpn_new_cancel').catch(() => {});
			await a.settle(300);
			await a.menuClick(await a.lang('lpn_file_convert_as'), 'file');
			await a.page.waitForSelector('#lpn_convas_panel', { state: 'visible', timeout: 4000 }).catch(() => {});
			await check('convert as', '#lpn_convas_body', true, '#lpn_convas_panel');
			await a.page.click('#lpn_convas_cancel').catch(() => {});
			await a.settle(300);
			await a.menuClickSub((await a.lang('lpn_file_export_menu')).trim(), await a.lang('lpn_file_export_item_ods')).catch(() => {});
			await a.page.waitForSelector('#lpn_dialog', { state: 'visible', timeout: 3000 }).catch(() => {});
			await check('export tables', '#lpn_dialog_body', false, '#lpn_dialog');
			await a.close();
		}
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
