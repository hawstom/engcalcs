// A FIRST VISIT'S FIRST PROJECT OPEN DOCKS EVERY BOX AND DOES NOT FREEZE THE PAGE (Tom, 2026-10-27, fix/fresh-freeze).
//
//   Tom met two defects on a fresh browser: (A) "I choose Start here ... Nothing is docked at all", and
//   (B) Fresh, Allow, Net3 left the page unresponsive for 20 seconds or more. This drives the same steps
//   in a browser with empty storage and a 1400x900 window, with default docks on (as a real browser has):
//     1. Allow this, then "Start here" (the blank map): five auto-hide tabs, Settings among them, three on
//        the right and two on the left, nothing pinned open.
//     2. Allow this, then Net3 from the gallery: the same five tabs, nothing pinned open, and the page
//        stays responsive. THE BUDGET: no single main-thread block over 1500 ms, and the map drawn within
//        3000 ms of the click. The defect measured 4100 ms (a docking pass at a stale view scale made a
//        million label stations per pipe); the fix measured a 150 ms block (650 ms with the CPU slowed 4 times) and a map drawn in
//        400 ms (1450 ms slowed), so the budget leaves room for a slower machine and not for 4100.
//
//   node dev/lpn-spike/fresh-open-harness.js     (takes the browser lock itself)
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_FRESHOPEN_BROWSER_LOCKED';
const NAME = 'fresh-open-harness';

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
const WANT = JSON.stringify([['lpn_sm_box', 'lpn_hotkeys_popup'], ['lpn_popup', 'lpn_settings_box', 'lpn_library_box']]);
const LONG_TASK_MAX_MS = 1500, DRAW_MAX_MS = 3000;
const openBoxes = (a) => a.page.evaluate(() => Array.from(document.querySelectorAll('.lpn-popover, .lpn-setbox, [id$="_box"]'))
	.filter((b) => b.style.display && b.style.display !== 'none' && !b.classList.contains('lpn-dock-collapsed') && b.getBoundingClientRect().width > 0)
	.map((b) => b.id));

async function fresh(Session, browser, label) {
	const a = await Session.open(browser, NAME + '-' + label, { viewport: { width: 1400, height: 900 } });
	await a.context.addInitScript(() => {
		window.EC_DEFAULT_DOCKS = true;   // a harness's browser says it is automated, so it must ask for what a real one gets
		window.__longTasks = [];
		try { new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__longTasks.push(Math.round(e.duration)))).observe({ entryTypes: ['longtask'] }); } catch (e) { /* no long-task API */ }
	});
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.page.waitForSelector('.lpn-examples-blank');
	// "Allow this" on the consent banner, as Tom did.
	const allow = await a.page.$('#ec-consent button');
	if (allow) { for (const b of await a.page.$$('#ec-consent button')) { if (/^\s*Allow this\s*$/.test(await b.textContent())) { await b.click(); break; } } }
	await a.settle(1500);
	await a.page.evaluate(() => { window.__longTasks.length = 0; });
	return a;
}
async function judge(a, what, mapSel, t0) {
	await a.page.waitForSelector(mapSel, { state: 'attached', timeout: 60000 });
	const drawn = Date.now() - t0;
	await a.settle(3000);
	const lt = await a.page.evaluate(() => window.__longTasks);
	const worst = lt.reduce((m, x) => Math.max(m, x), 0);
	const got = await strips(a.page);
	ok(what + ': five auto-hide tabs, left manager and manual, right Properties, Settings, Libraries', JSON.stringify(got) === WANT, JSON.stringify(got));
	ok(what + ': nothing is pinned open', (await openBoxes(a)).length === 0, JSON.stringify(await openBoxes(a)));
	ok(what + ': longest main-thread block ' + worst + ' ms, under ' + LONG_TASK_MAX_MS, worst < LONG_TASK_MAX_MS, JSON.stringify(lt));
	ok(what + ': map drawn ' + drawn + ' ms after the click, under ' + DRAW_MAX_MS, drawn < DRAW_MAX_MS);
	ok(what + ': no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
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
	try {
		console.log('\n--- 1. Fresh, Allow this, Start here ---');
		let a = await fresh(Session, browser, 'start');
		let t0 = Date.now();
		await a.page.click('.lpn-examples-blank');
		await judge(a, 'Start here', '#lpn_empty_hint[style*="none"]', t0);
		await a.close();

		console.log('\n--- 2. Fresh, Allow this, Net3 ---');
		a = await fresh(Session, browser, 'net3');
		t0 = Date.now();
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await judge(a, 'Net3', 'circle.lpn-node', t0);
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
