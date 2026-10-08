// EVERY DOCK SURVIVES A RELOAD, IN THE SAME ORDER (Tom, 2026-10-07: "there seems to be a limit to the
// number of docks that are remembered on production. All the docks I make need to be remembered.",
// and "Is there a default order for docks? I am finding that my docks are not going to the bottom.").
//
// Fifteen boxes docked as auto-hide tabs, seven on the left and eight on the right, each in an order
// that is NOT the order the page wires them in, then three reloads: the same tabs in the same order
// every time. One more docked lands last. A docked Properties stays in its dock when the selection
// clears, its own X closes it for good, and a reload leaves it closed.
//
//   node dev/lpn-spike/dock-memory-harness.js     (takes the browser lock itself)
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_DOCKMEM_BROWSER_LOCKED';
const NAME = 'dock-memory-harness';

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
const noConsent = (a) => a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
const reload = async (a) => { await a.reload(); await noConsent(a); await a.settle(1500); };
const strips = (page) => page.evaluate(() => ['left', 'right'].map((s) =>
	Array.from(document.querySelectorAll('#lpn_dock_strip_' + s + ' .lpn-dock-tab')).map((t) => t.getAttribute('aria-controls'))));

// Each box, with how a visitor opens it: [menu, flyout row key or null, row key] or 'node'.
const OPENERS = {
	lpn_energy_box: ['project', 'lpn_reports_menu', 'lpn_energy_menu'],
	lpn_scncmp_box: ['project', 'lpn_reports_menu', 'lpn_scncmp_title'],
	lpn_rptbox: ['project', 'lpn_reports_menu', 'lpn_reports_epanet'],
	lpn_status_box: ['project', 'lpn_reports_menu', 'lpn_reports_status'],
	lpn_calib_box: ['project', 'lpn_reports_menu', 'lpn_reports_calib'],
	lpn_full_box: ['project', 'lpn_reports_menu', 'lpn_reports_full'],
	lpn_alt_box: ['project', 'lpn_scenario_menu', 'lpn_alt_title'],
	lpn_settings_box: ['project', null, 'lpn_tool_settings'],
	lpn_popup: 'node',
	lpn_find_popup: ['edit', null, 'lpn_find_menu'],
	lpn_library_box: ['project', null, 'lpn_library_menu'],
	lpn_contour_box: ['project', 'lpn_graphs_menu', 'lpn_contour_menu'],
	lpn_ff_box: ['project', 'lpn_analyze_menu', 'lpn_ff_menu'],
	lpn_crit_box: ['project', 'lpn_analyze_menu', 'lpn_crit_menu'],
	lpn_ds_box: ['project', 'lpn_analyze_menu', 'lpn_ds_menu'],
	lpn_notes_popup: ['help', null, 'lpn_help_notes']
};
// Deliberately not the order wireBoxDocking() registers them in.
const LEFT = ['lpn_full_box', 'lpn_calib_box', 'lpn_energy_box', 'lpn_alt_box', 'lpn_status_box', 'lpn_rptbox', 'lpn_scncmp_box'];
const RIGHT = ['lpn_contour_box', 'lpn_ds_box', 'lpn_settings_box', 'lpn_popup', 'lpn_crit_box', 'lpn_find_popup', 'lpn_ff_box', 'lpn_library_box'];

async function clickNode(a) {
	const at = await a.page.evaluate(() => {
		const ns = Array.from(document.querySelectorAll('#lpn_canvas .lpn-symbols circle:not(.lpn-node-hit)')).filter((c) => {
			const r = c.getBoundingClientRect();
			return r.width > 0 && document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) !== null &&
				!document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2).closest('.lpn-dock-strip, .lpn-popover');
		});
		const r = ns[Math.floor(ns.length / 2)].getBoundingClientRect();
		return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
	});
	await a.page.mouse.click(at.x, at.y);
	await a.settle(600);
}
async function openBox(a, id) {
	const o = OPENERS[id];
	if (o === 'node') { await clickNode(a); return; }
	if (o[1]) { await a.menuClickSub(await a.lang(o[1]), await a.lang(o[2]), o[0]); }
	else { await a.menuClick(await a.lang(o[2]), o[0]); }
	await a.settle(500);
}
async function dockHidden(a, id, side) {
	await openBox(a, id);
	await a.page.click('#' + id + ' .lpn-corner-btn[data-dock="' + side + '"]', { timeout: 4000 });
	await a.settle(200);
	await a.page.click('#' + id + ' .lpn-corner-btn[data-dock="autohide"]', { timeout: 4000 });
	await a.settle(300);
}

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
	const a = await Session.open(browser, NAME, { viewport: { width: 1600, height: 1000 } });
	try {
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		// Basic mode off (the browser's own setting), so Alternatives can be opened and docked.
		await a.page.evaluate(() => { try { localStorage.setItem('lpn_scnbasic', 'off'); } catch (e) {} });
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await noConsent(a);
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await a.settle(800);

		console.log('\n--- fifteen auto-hide docks, in a chosen order ---');
		for (const id of LEFT) { await dockHidden(a, id, 'left'); }
		for (const id of RIGHT) { await dockHidden(a, id, 'right'); }
		const want = JSON.stringify([LEFT, RIGHT]);
		let got = await strips(a.page);
		ok('all fifteen are tabs, each edge in the order they were docked', JSON.stringify(got) === want, JSON.stringify(got));
		for (let i = 1; i <= 3; i++) {
			await reload(a);
			got = await strips(a.page);
			ok('reload ' + i + ': the same fifteen tabs in the same order', JSON.stringify(got) === want, JSON.stringify(got));
		}

		console.log('\n--- one more dock goes to the bottom ---');
		await dockHidden(a, 'lpn_notes_popup', 'right');
		got = await strips(a.page);
		ok('Notes, docked last, is the last tab on the right', got[1].length === 9 && got[1][8] === 'lpn_notes_popup', JSON.stringify(got[1]));
		await reload(a);
		got = await strips(a.page);
		ok('...and still last after a reload, the rest unmoved', JSON.stringify(got) === JSON.stringify([LEFT, RIGHT.concat('lpn_notes_popup')]), JSON.stringify(got));

		console.log('\n--- a docked Properties box with nothing selected ---');
		const none = await a.lang('lpn_popup_none');
		await a.page.click('#lpn_dock_strip_right .lpn-dock-tab[aria-controls="lpn_popup"]');
		await a.settle(400);
		ok('after a reload its tab opens it, saying nothing is selected',
			(await a.page.$eval('#lpn_popup_fields', (e) => e.textContent.trim())) === none);
		await a.page.keyboard.press('Escape');
		await a.settle(300);
		await clickNode(a);
		const title = await a.page.$eval('#lpn_popup_title', (e) => e.textContent.trim());
		ok('selecting a junction fills it', title.length > 0 && (await a.page.$$('#lpn_popup_fields input')).length > 0, JSON.stringify(title));
		// Deleting the junction it shows is a selection going away, not a request to close the box.
		await a.page.evaluate(() => { if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });
		await a.page.keyboard.press('Delete');
		await a.settle(600);
		got = await strips(a.page);
		ok('...deleting the junction it shows leaves Properties in its dock', got[1].includes('lpn_popup'), JSON.stringify(got[1]));
		await a.page.click('#lpn_dock_strip_right .lpn-dock-tab[aria-controls="lpn_popup"]');
		await a.settle(400);
		ok('...saying nothing is selected', (await a.page.$eval('#lpn_popup_fields', (e) => e.textContent.trim())) === none);
		await a.page.click('#lpn_popup_close');
		await a.settle(400);
		got = await strips(a.page);
		ok('its own X closes it: no tab', !got[1].includes('lpn_popup'), JSON.stringify(got[1]));
		await reload(a);
		got = await strips(a.page);
		ok('...and a reload leaves it closed, every other dock in place',
			JSON.stringify(got) === JSON.stringify([LEFT, RIGHT.filter((x) => x !== 'lpn_popup').concat('lpn_notes_popup')]), JSON.stringify(got));
		await openBox(a, 'lpn_popup');
		got = await strips(a.page);
		ok('reopened by a selection, it is docked again in its old place',
			JSON.stringify(got[1]) === JSON.stringify(RIGHT.concat('lpn_notes_popup')), JSON.stringify(got[1]));

		console.log('\n--- a phone does not forget the desktop docks ---');
		await a.page.setViewportSize({ width: 390, height: 844 });
		await reload(a);
		got = await strips(a.page);
		ok('on a 390 px phone no tab is shown', got[0].length + got[1].length === 0, JSON.stringify(got));
		await a.page.setViewportSize({ width: 1600, height: 1000 });
		await reload(a);
		got = await strips(a.page);
		ok('back on the desktop every dock is there, in order', JSON.stringify(got) === JSON.stringify([LEFT, RIGHT.concat('lpn_notes_popup')]), JSON.stringify(got));

		console.log('\n--- floating one takes it off its edge for good ---');
		await a.page.click('#lpn_dock_strip_right .lpn-dock-tab[aria-controls="lpn_crit_box"]');
		await a.settle(400);
		await a.page.click('#lpn_crit_box .lpn-corner-btn[data-dock="float"]');
		await a.settle(300);
		await reload(a);
		got = await strips(a.page);
		ok('Criticality floated: not a tab after a reload, the rest in order',
			JSON.stringify(got) === JSON.stringify([LEFT, RIGHT.filter((x) => x !== 'lpn_crit_box').concat('lpn_notes_popup')]), JSON.stringify(got));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await a.close();
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
