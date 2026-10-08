// A FIRST VISIT STARTS WITH TOM'S AUTO-HIDE DOCKS (Tom, 2026-10-07, card E02: "I want to give the
// initial user default my auto-hidden docks ... It's cheap discoverability").
//
//   1. A browser with no saved layout opens with exactly his tabs: left, top to bottom, Pump energy,
//      Scenario comparison, EPANET run, Status, Calibration, Full; right, Settings, Properties, Find
//      and replace, Libraries, Contour plot, Fire flow, Criticality, Demand scaling. Nothing is
//      stored for them, through a load, an example opened and a reload.
//   2. The first change the visitor makes (closing one box) stores the whole layout, so the next
//      reload keeps every other default dock, in order, and the closed one stays closed.
//   3. A browser with any saved layout keeps its own and gets no defaults.
//   4. A 390 px phone keeps its behaviour: no tab, no box opened, nothing stored.
//   5. A browser driven by a harness gets no defaults unless it asks (window.EC_DEFAULT_DOCKS).
//
//   node dev/lpn-spike/dock-default-harness.js     (takes the browser lock itself)
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_DOCKDEF_BROWSER_LOCKED';
const NAME = 'dock-default-harness';

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
const { strips } = require('./dock-boxes.js');
const LEFT = ['lpn_energy_box', 'lpn_scncmp_box', 'lpn_rptbox', 'lpn_status_box', 'lpn_calib_box', 'lpn_full_box'];
const RIGHT = ['lpn_settings_box', 'lpn_popup', 'lpn_find_popup', 'lpn_library_box', 'lpn_contour_box', 'lpn_ff_box', 'lpn_crit_box', 'lpn_ds_box'];
const WANT = JSON.stringify([LEFT, RIGHT]);
const noConsent = (a) => a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
// Box records and the dock key: the layout this feature must not write on its own.
const layoutKeys = (a) => a.page.evaluate(() => Object.keys(localStorage).filter((k) =>
	/^lpn_(setbox|findbox|libbox|ffbox|energybox|cmpbox|reportbox|statusbox|fullbox|contourbox|notesbox|hotkeysbox|snipbox|dockbox)$/.test(k)).sort());
const openBoxes = (a) => a.page.evaluate(() => Array.from(document.querySelectorAll('.lpn-popover, .lpn-setbox, [id$="_box"]'))
	.filter((b) => b.style.display && b.style.display !== 'none' && !b.classList.contains('lpn-dock-collapsed') && b.getBoundingClientRect().width > 0)
	.map((b) => b.id));

async function visit(Session, browser, label, viewport, wantDefaults) {
	const a = await Session.open(browser, NAME + '-' + label, { viewport });
	if (wantDefaults !== undefined) {
		await a.context.addInitScript((v) => { window.EC_DEFAULT_DOCKS = v; }, wantDefaults);
	}
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await noConsent(a);
	await a.settle(1500);
	return a;
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
	const DESK = { width: 1600, height: 1000 };
	try {
		console.log('\n--- 1. a first visit ---');
		const a = await visit(Session, browser, 'first', DESK, true);
		let got = await strips(a.page);
		ok('his fourteen auto-hide tabs, each edge in his order', JSON.stringify(got) === WANT, JSON.stringify(got));
		const titles = await a.page.evaluate(() => Array.from(document.querySelectorAll('.lpn-dock-tab')).map((t) => {
			const b = document.getElementById(t.getAttribute('aria-controls')), h = b && b.querySelector('.lpn-setbox-title');
			return t.textContent === (h ? h.textContent.replace(/\s+/g, ' ').trim() : '');
		}));
		ok('each tab reads its box\'s own title', titles.length === 14 && titles.every(Boolean));
		ok('every box is tucked: none stands over the map', (await openBoxes(a)).length === 0, JSON.stringify(await openBoxes(a)));
		ok('nothing is stored for the layout on load', (await layoutKeys(a)).length === 0, JSON.stringify(await layoutKeys(a)));
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await a.settle(2000);
		ok('...nor after opening an example', (await layoutKeys(a)).length === 0, JSON.stringify(await layoutKeys(a)));
		await a.page.click('#lpn_dock_strip_right .lpn-dock-tab[aria-controls="lpn_settings_box"]');
		await a.settle(500);
		ok('a tab flies its box out', (await openBoxes(a)).includes('lpn_settings_box'), JSON.stringify(await openBoxes(a)));
		await a.page.keyboard.press('Escape');
		await a.settle(500);
		ok('...looking is not changing: still nothing stored', (await layoutKeys(a)).length === 0, JSON.stringify(await layoutKeys(a)));
		await a.reload();
		await noConsent(a);
		await a.settle(1500);
		got = await strips(a.page);
		ok('a reload with nothing stored shows the same defaults', JSON.stringify(got) === WANT, JSON.stringify(got));

		console.log('\n--- 2. the first change stores the whole layout ---');
		await a.page.click('#lpn_dock_strip_left .lpn-dock-tab[aria-controls="lpn_scncmp_box"]');
		await a.settle(500);
		await a.page.click('#lpn_scncmp_close');
		await a.settle(500);
		const keys = await layoutKeys(a);
		ok('closing Scenario comparison stores the layout', keys.length >= 10 && keys.includes('lpn_dockbox') && keys.includes('lpn_cmpbox'), JSON.stringify(keys));
		await a.reload();
		await noConsent(a);
		await a.settle(1500);
		got = await strips(a.page);
		ok('after a reload: every other default dock, in order, and Scenario comparison closed',
			JSON.stringify(got) === JSON.stringify([LEFT.filter((x) => x !== 'lpn_scncmp_box'), RIGHT]), JSON.stringify(got));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();

		console.log('\n--- 3. a saved layout is the visitor\'s own ---');
		const c = await visit(Session, browser, 'saved', DESK, true);
		await c.page.evaluate(() => { localStorage.setItem('lpn_setbox', JSON.stringify({ left: 300, top: 200, w: null, h: null, open: true })); });
		await c.reload();
		await noConsent(c);
		await c.settle(1500);
		got = await strips(c.page);
		ok('one stored box record: no default docks', got[0].length + got[1].length === 0, JSON.stringify(got));
		ok('...and that box opens floating, as it was left', (await openBoxes(c)).includes('lpn_settings_box'));
		ok('no uncaught page errors', c.errors.length === 0, c.errors.slice(0, 2).join(' | '));
		await c.close();

		console.log('\n--- 4. a phone ---');
		const p = await visit(Session, browser, 'phone', { width: 390, height: 844 }, true);
		got = await strips(p.page);
		ok('390 px: no tab', got[0].length + got[1].length === 0, JSON.stringify(got));
		ok('...no box opened over the page', (await openBoxes(p)).length === 0, JSON.stringify(await openBoxes(p)));
		ok('...nothing stored', (await layoutKeys(p)).length === 0);
		ok('no uncaught page errors', p.errors.length === 0, p.errors.slice(0, 2).join(' | '));
		await p.close();

		console.log('\n--- 5. a harness opts in ---');
		const h = await visit(Session, browser, 'harness', DESK);
		got = await strips(h.page);
		ok('a browser driven by a harness that does not ask gets no default docks', got[0].length + got[1].length === 0, JSON.stringify(got));
		await h.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
