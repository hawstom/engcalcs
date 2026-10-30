// EVERY CONVERTED BOX ON ITS ONE GRID, IN A REAL BROWSER (ROADMAP Task 828; Tom 2026-10-25: "Demand
// scaling has TWO grids in one box", "Find and replace, New project, Export tables have no grid at
// all", "this went seriously wrong"). At 1366 x 768, English, each box below is opened the way a visitor
// opens it and audited by dev/lpn-spike/box-grid-audit.js: every visible control stands in the value
// column (+-2 px), every name at one x, no name ellipsised or wrapped, like number boxes one width.
// On top of that:
//   - the box has exactly ONE set of columns: every row of every run of rows reads the same name,
//     value and unit x (Demand scaling's Lowest pressure row and Demand scale row are the case);
//   - Properties-style spans and notes are not rows: a table or a sentence never starts new columns.
//   BOXROWS_SHOT=<dir> also writes a screenshot of each box there, as after-<name>.png.
//
//   node dev/lpn-spike/box-grid-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BOXGRID_LOCKED';
const NAME = 'box-grid-browser-harness';
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
const { auditBox, auditPhone } = require('./box-grid-audit.js');
const { openBox } = require('./dock-boxes.js');
let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
// The report buttons belong to another branch (Download CSV, Copy, Print report): not audited here.
const REPORT_BTNS = '.lpn-ff-buttons:not(:has(> .lpn-ff-run, > .lpn-ff-stopbtn)), .lpn-box-tools';

// One set of columns: the x of the label and value cells of every row, over the whole box.
function columns(page, root) {
	return page.evaluate((sel) => {
		const R = document.querySelector(sel), x = (e) => Math.round(e.getBoundingClientRect().left);
		const vis = (e) => e && e.getBoundingClientRect().width > 0;
		const rows = Array.from(R.querySelectorAll('.lpn-grow')).filter((r) => vis(r.querySelector('.lpn-gname')));
		return {
			rows: rows.length,
			name: Array.from(new Set(rows.map((r) => x(r.querySelector('.lpn-gname'))))),
			val: Array.from(new Set(rows.filter((r) => vis(r.querySelector('.lpn-gval'))).map((r) => { const v = r.querySelector('.lpn-gval'); return x(v) - (v.matches('input[type=checkbox],input[type=radio]') && v.closest('.lpn-sheet') ? 6 : 0); })))   /* a toggle in the standard sheet style stands 6 px in, under its text */
		};
	}, root);
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const shot = (a, sel, name) => process.env.BOXROWS_SHOT ? a.page.locator(sel).screenshot({ path: path.join(process.env.BOXROWS_SHOT, 'after-' + name + '.png') }) : null;
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1366, height: 768 }, serviceWorkers: 'block' });
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } localStorage.removeItem('lpn_gcols'); });
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1500);
		const close = async (id) => { await a.page.evaluate((i) => { const b = document.querySelector('#' + i + ' .lpn-popover-x, #' + i + ' [id$="_close"]'); if (b) { b.click(); } }, id); await a.settle(200); };
		const BOXES = [
			['lpn_contour_box', 'contour', '#lpn_contour_body', false, ['Buffer']],
			['lpn_ff_box', 'fireflow', '#lpn_ff_box .lpn-popover-body'],
			['lpn_crit_box', 'criticality', '#lpn_crit_box .lpn-popover-body'],
			['lpn_ds_box', 'demscale', '#lpn_ds_box .lpn-popover-body'],
			['lpn_energy_box', 'energy', '#lpn_energy_box .lpn-popover-body', true],
			['lpn_scncmp_box', 'scncmp', '#lpn_scncmp_box .lpn-popover-body'],
			['lpn_calib_box', 'calib', '#lpn_calib_box .lpn-popover-body'],
			['lpn_full_box', 'fullrep', '#lpn_full_box .lpn-popover-body'],
			['lpn_find_popup', 'find', '#lpn_find_form']
		];
		for (const [id, name, root, noControls, wrapOk] of BOXES) {
			console.log('\n--- ' + name + ' ---');
			await openBox(a, id);
			await a.settle(900);
			if (id === 'lpn_scncmp_box') { await a.settle(1500); }
			const m = await auditBox(a.page, { root, skip: [REPORT_BTNS], noControls, wrapOk }, ok, name);
			const c = await columns(a.page, root);
			ok(name + ': one set of columns (one label x, one value x)', c.name.length <= 1 && c.val.length <= 1, JSON.stringify(c));
			ok(name + ': it has rows', c.rows >= 1, String(c.rows));
			await shot(a, '#' + id, name);
			await close(id);
		}
		// Find and replace: the Replace half is on the same grid as the Find half.
		console.log('\n--- find and replace (Replace half) ---');
		await openBox(a, 'lpn_find_popup');
		await a.page.evaluate(() => { const s = document.querySelector('#lpn_find_form select'); if (s) { s.value = s.options[1] ? s.options[1].value : s.value; s.dispatchEvent(new Event('change', { bubbles: true })); } });
		await a.settle(500);
		const rep = await a.page.evaluate(() => {
			const f = document.getElementById('lpn_find_form'), R = (e) => e.getBoundingClientRect().left;
			const rows = Array.from(f.querySelectorAll('.lpn-grow')).filter((r) => r.querySelector('.lpn-gname') && R(r.querySelector('.lpn-gname')) > 0);
			return { names: Array.from(new Set(rows.map((r) => Math.round(R(r.querySelector('.lpn-gname')))))), vals: Array.from(new Set(rows.map((r) => Math.round(R(r.querySelector('.lpn-gval') || r.children[1]))))), n: rows.length };
		});
		ok('find and replace: Find rows and Replace rows share one name x and one value x', rep.names.length === 1 && rep.vals.length === 1 && rep.n >= 5, JSON.stringify(rep));
		await close('lpn_find_popup');

		// New project (File) and Export tables (a dialog).
		console.log('\n--- new project ---');
		await a.menuClick(await a.lang('lpn_file_new'), 'file').catch(() => {});
		await a.page.waitForSelector('#lpn_new_panel', { state: 'visible', timeout: 4000 }).catch(() => {});
		await a.settle(600);
		await auditBox(a.page, { root: '#lpn_new_body' }, ok, 'new project');
		const nc = await columns(a.page, '#lpn_new_body');
		ok('new project: one set of columns', nc.name.length <= 1 && nc.val.length <= 1, JSON.stringify(nc));
		await shot(a, '#lpn_new_panel', 'newproject');
		await a.page.click('#lpn_new_cancel').catch(() => {});
		await a.settle(300);

		console.log('\n--- export tables ---');
		await a.menuClickSub((await a.lang('lpn_file_export_menu')).trim(), await a.lang('lpn_file_export_item_ods')).catch(() => {});
		await a.page.waitForSelector('#lpn_dialog', { state: 'visible', timeout: 3000 }).catch(() => {});
		await a.settle(400);
		const ex = await a.page.evaluate(() => !!document.querySelector('#lpn_dialog input[name="lpn_export_tables"]'));
		if (ex) {
			await auditBox(a.page, { root: '#lpn_dialog_body' }, ok, 'export tables');
			const ec = await columns(a.page, '#lpn_dialog_body');
			ok('export tables: one set of columns', ec.name.length <= 1 && ec.val.length <= 1, JSON.stringify(ec));
			await shot(a, '#lpn_dialog', 'exporttables');
		} else { ok('export tables: the dialog opened', false, 'could not open it'); }
		await a.close();

		// THE PHONE, 390 x 844: Fire flow, Demand scaling, Criticality, Contour, Find and New project.
		console.log('\n--- the same boxes on a phone ---');
		const ph = await Session.open(browser, NAME + '-phone', { viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
		await ph.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (r) => r.abort());
		await ph.goto('Looped-Network.php?ec_nolog=1');
		await ph.answerTrainingPanel().catch(() => {});
		await ph.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await ph.openExampleCard(await ph.lang('lpn_ex_net1_title'));
		await ph.settle(1500);
		const PH = [['lpn_ff_box', 'fireflow', '#lpn_ff_box .lpn-popover-body'], ['lpn_ds_box', 'demscale', '#lpn_ds_box .lpn-popover-body'],
			['lpn_crit_box', 'criticality', '#lpn_crit_box .lpn-popover-body'], ['lpn_contour_box', 'contour', '#lpn_contour_body'],
			['lpn_find_popup', 'find', '#lpn_find_form']];
		for (const [id, name, root] of PH) {
			await openBox(ph, id);
			await ph.settle(900);
			await auditPhone(ph.page, { root, skip: [REPORT_BTNS] }, ok, name);
			if (process.env.BOXROWS_SHOT) { await ph.page.locator('#' + id).screenshot({ path: path.join(process.env.BOXROWS_SHOT, 'after-phone-' + name + '.png') }).catch(() => {}); }
			await close(id).catch(() => {});
			await ph.page.evaluate((i) => { const b = document.querySelector('#' + i + ' .lpn-popover-x, #' + i + ' [id$="_close"]'); if (b) { b.click(); } }, id);
			await ph.settle(300);
		}
		// New project on a phone: usable, and its Create button can be reached by scrolling the box.
		await ph.menuClick(await ph.lang('lpn_file_new'), 'file').catch(() => {});
		await ph.page.waitForSelector('#lpn_new_panel', { state: 'visible', timeout: 4000 }).catch(() => {});
		await ph.settle(600);
		await auditPhone(ph.page, { root: '#lpn_new_body' }, ok, 'new project');
		const reach = await ph.page.click('#lpn_new_create', { timeout: 4000 }).then(() => true, () => false);
		ok('new project (phone): Create can be reached and pressed', reach);
		await ph.close();
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
