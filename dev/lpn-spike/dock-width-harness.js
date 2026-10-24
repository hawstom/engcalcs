// A DOCKED BOX KEEPS ITS OWN OPTIMAL WIDTH, NOT ONE WIDTH FOR ALL (Tom, 2026-10-24: the first-visit
// docks "made them all a uniform width instead of leveraging our pre-existing knowledge about their
// ideal widths... the default docked Settings box is too narrow for the label rows").
//
//   1. Each of the fourteen first-visit docks flies out at its own optimal width (the list in
//      dev/box-width-audit.md), not at one shared 360 px.
//   2. Settings, flown out, shows its Node labels rows with nothing cut off: every label fits its own
//      box, every control sits inside the pane, and the Decimals, Show and Drop columns are 90% of
//      their old 2.6 rem.
//   3. A box docked by the visitor, by its own corner button, docks at that same optimal width.
//   4. A width the visitor has stored is theirs and wins.
//
//   node dev/lpn-spike/dock-width-harness.js     (takes the browser lock itself)
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_DOCKW_BROWSER_LOCKED';
const NAME = 'dock-width-harness';

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


let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const { openBox } = require('./dock-boxes.js');
// Each box's optimal width, in rem, as dev/box-width-audit.md lists it: what its own CSS gives it
// floating, except Settings (33.75, which is 50% over the old 360 px) and Properties (28).
const OPTIMAL_REM = {
	lpn_energy_box: 52, lpn_scncmp_box: 52, lpn_rptbox: 52, lpn_status_box: 52, lpn_calib_box: 52, lpn_full_box: 52,
	lpn_settings_box: 33.75, lpn_popup: 28, lpn_find_popup: 22, lpn_library_box: 44, lpn_contour_box: 24,
	lpn_ff_box: 52, lpn_crit_box: 52, lpn_ds_box: 52
};
const LEFT = ['lpn_energy_box', 'lpn_scncmp_box', 'lpn_rptbox', 'lpn_status_box', 'lpn_calib_box', 'lpn_full_box'];
const noConsent = (a) => a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
const widthOf = (a, id) => a.page.evaluate((i) => Math.round(document.getElementById(i).getBoundingClientRect().width), id);
const want = (id) => Math.round(OPTIMAL_REM[id] * 16);

async function visit(Session, browser, label, defaults, seed) {
	const a = await Session.open(browser, NAME + '-' + label, { viewport: { width: 1600, height: 1000 } });
	await a.context.addInitScript((v) => { window.EC_DEFAULT_DOCKS = v; }, defaults);
	if (seed) { await a.context.addInitScript((kv) => { try { if (localStorage.getItem(kv[0]) === null) { localStorage.setItem(kv[0], kv[1]); } } catch (e) { /* none */ } }, seed); }
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await noConsent(a);
	await a.settle(1500);
	return a;
}
async function openSettings(a) {
	await a.toolbarClick(await a.lang('lpn_tool_settings'));
	await a.page.waitForSelector('#lpn_settings_box', { state: 'visible' });
	await a.settle(400);
}
// Anything in Settings' content pane that is cut off: a control past its right edge, or text wider
// than the box that holds it.
const clipped = (a) => a.page.evaluate(() => {
	const pane = document.querySelector('#lpn_settings_box .lpn-setbox-content'), pr = pane.getBoundingClientRect(), bad = [];
	Array.from(pane.querySelectorAll('input, select, button, label, .lpn-set-row > *')).forEach((e) => {
		const r = e.getBoundingClientRect();
		if (!(r.width > 0) || !(r.height > 0)) { return; }
		if (r.right > pr.right + 1) { bad.push('past right: ' + (e.textContent || e.className || e.tagName).trim().slice(0, 24)); }
		if (e.tagName === 'LABEL' && e.scrollWidth > e.clientWidth + 1) { bad.push('cut: ' + e.textContent.trim().slice(0, 24)); }
	});
	return bad;
});

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		console.log('\n--- 1. first-visit docks, each at its own width ---');
		const a = await visit(Session, browser, 'first', true);
		const seen = {};
		for (const id of Object.keys(OPTIMAL_REM)) {
			const side = LEFT.includes(id) ? 'left' : 'right';
			await a.page.click('#lpn_dock_strip_' + side + ' .lpn-dock-tab[aria-controls="' + id + '"]');
			await a.settle(500);
			const w = await widthOf(a, id);
			seen[w] = true;
			ok(id + ' flies out at ' + want(id) + ' px', Math.abs(w - want(id)) <= 1, w + ' px');
			await a.page.keyboard.press('Escape');
			await a.settle(400);
		}
		ok('the fourteen are not one width', Object.keys(seen).length >= 6, Object.keys(seen).join(', '));

		console.log('\n--- 2. Settings rows are not cut off ---');
		await a.page.click('#lpn_dock_strip_right .lpn-dock-tab[aria-controls="lpn_settings_box"]');
		await a.settle(500);
		await a.page.click('#lpn_settings_box .lpn-setbox-link');
		await a.settle(500);
		const info = await a.page.evaluate(() => {
			const pane = document.querySelector('#lpn_settings_box .lpn-setbox-content'), r = pane.getBoundingClientRect();
			return { visible: r.width > 0 && r.height > 0, rows: pane.querySelectorAll('label').length,
				nums: Array.from(pane.querySelectorAll('input[type=text],input[type=number],input:not([type])')).map((i) => i.getBoundingClientRect().width).filter((x) => x > 0) };
		});
		ok('the Node labels rows are drawn and have width', info.visible && info.rows > 8, JSON.stringify({ rows: info.rows }));
		const bad = await clipped(a);
		ok('no label is cut off and no control runs past the pane', bad.length === 0, bad.slice(0, 4).join(' | '));
		const narrow = info.nums.filter((x) => Math.abs(x - 0.9 * 41.6) <= 1.5).length;
		ok('Decimals, Show and Drop boxes are 90% of their old width (37 px)', narrow >= 10, narrow + ' boxes near 37 px; widths ' + Array.from(new Set(info.nums.map(Math.round))).join(','));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();

		console.log('\n--- 3. a box the visitor docks keeps its optimal width ---');
		const b = await visit(Session, browser, 'user', false);
		for (const id of ['lpn_settings_box', 'lpn_library_box', 'lpn_contour_box', 'lpn_find_popup', 'lpn_energy_box', 'lpn_ff_box']) {
			if (id === 'lpn_settings_box') { await openSettings(b); } else { await openBox(b, id); }
			await b.page.click('#' + id + ' .lpn-corner-btn[data-dock="left"]', { timeout: 4000 });
			await b.settle(400);
			const w = await widthOf(b, id);
			ok(id + ' docked by the visitor is ' + want(id) + ' px', Math.abs(w - want(id)) <= 1, w + ' px');
			await b.page.click('#' + id + ' .lpn-corner-btn[data-dock="float"]', { timeout: 4000 });
			await b.page.evaluate((i) => { document.getElementById(i).style.display = 'none'; }, id);
			await b.settle(300);
		}
		ok('no uncaught page errors', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
		await b.close();

		console.log('\n--- 4. a stored width is the visitor\'s own ---');
		const c = await visit(Session, browser, 'stored', true, ['lpn_setbox', JSON.stringify({ left: 300, top: 200, w: null, h: null, open: true, dock: 'right', autohide: true, dockW: 420 })]);
		await c.page.click('#lpn_dock_strip_right .lpn-dock-tab[aria-controls="lpn_settings_box"]');
		await c.settle(500);
		const w = await widthOf(c, 'lpn_settings_box');
		ok('a stored dock width of 420 px is kept', Math.abs(w - 420) <= 1, w + ' px');
		await c.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' passed' + (failures ? ', ' + failures + ' FAILED' : ''));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
