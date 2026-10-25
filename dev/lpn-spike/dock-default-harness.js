// A FIRST VISIT GETS TOM'S LAYOUT WHEN THE FIRST PROJECT OPENS (Tom, 2026-10-07 card E02; revised
// 2026-10-24: Settings is the one pinned box, the rest are auto-hide tabs).
//
//   1. A browser with no saved layout shows NO box and NO tab over the examples gallery.
//   2. Opening the first project docks Settings pinned (right, the only pinned box) and five
//      auto-hide tabs: left, Junctions (the Scenario manager joins it once Basic mode is off); right, Properties, Libraries, User
//      manual. Nothing is stored for them, through a reload.
//   3. The first change the visitor makes (closing one tab's box) stores the whole layout.
//   4. A browser with any saved layout keeps its own and gets no defaults.
//   5. A 390 px phone keeps its behaviour: no tab, no box opened, nothing stored.
//   6. A browser driven by a harness gets no defaults unless it asks (window.EC_DEFAULT_DOCKS).
//   Set SHOT=/path.png to also save a screenshot of the first view with the first project open.
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
// The Scenario manager is in the table too but a fresh browser is in Basic mode, where it is not offered at all.
const LEFT = ['lpn_panebox_junctions'];
const RIGHT = ['lpn_popup', 'lpn_library_box', 'lpn_hotkeys_popup'];
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
		console.log('\n--- 1. a first visit: the gallery is not covered ---');
		const a = await visit(Session, browser, 'first', DESK, true);
		let got = await strips(a.page);
		ok('over the gallery: no tab on either edge', got[0].length + got[1].length === 0, JSON.stringify(got));
		ok('...and no box open', (await openBoxes(a)).length === 0, JSON.stringify(await openBoxes(a)));
		console.log('\n--- 2. the first project opens ---');
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await a.settle(2500);
		got = await strips(a.page);
		ok('four auto-hide tabs (the Scenario manager waits for Basic mode off), each edge in order', JSON.stringify(got) === WANT, JSON.stringify(got));
		const titles = await a.page.evaluate(() => Array.from(document.querySelectorAll('.lpn-dock-tab')).map((t) => {
			const b = document.getElementById(t.getAttribute('aria-controls')), h = b && b.querySelector('.lpn-setbox-title');
			return t.textContent === (h ? h.textContent.replace(/\s+/g, ' ').trim() : '');
		}));
		ok('each tab reads its box\'s own title', titles.length === 4 && titles.every(Boolean));
		const pinned = await a.page.evaluate(() => {
			const b = document.getElementById('lpn_settings_box'), r = b.getBoundingClientRect(), m = document.getElementById('lpn_canvas').getBoundingClientRect();
			return { shown: b.style.display !== 'none' && r.width > 0, tucked: b.classList.contains('lpn-dock-collapsed'), right: r.left >= m.right - 2,
				docked: b.classList.contains('lpn-docked') || /dock/.test(b.className) };
		});
		ok('Settings stands pinned, docked beside the map', pinned.shown && !pinned.tucked && pinned.right, JSON.stringify(pinned));
		ok('...and it is the only open box (the others are tucked)', JSON.stringify(await openBoxes(a)) === JSON.stringify(['lpn_settings_box']), JSON.stringify(await openBoxes(a)));
		ok('nothing is stored for the layout', (await layoutKeys(a)).length === 0, JSON.stringify(await layoutKeys(a)));
		if (process.env.SHOT) { await a.page.screenshot({ path: process.env.SHOT }); }
		await a.page.click('#lpn_dock_strip_right .lpn-dock-tab[aria-controls="lpn_library_box"]');
		await a.settle(500);
		ok('a tab flies its box out', (await openBoxes(a)).includes('lpn_library_box'), JSON.stringify(await openBoxes(a)));
		await a.page.keyboard.press('Escape');
		await a.settle(500);
		ok('...looking is not changing: still nothing stored', (await layoutKeys(a)).length === 0, JSON.stringify(await layoutKeys(a)));
		await a.reload();
		await noConsent(a);
		await a.settle(2000);
		got = await strips(a.page);
		ok('a reload with the project and nothing stored shows the same layout', JSON.stringify(got) === WANT, JSON.stringify(got));

		console.log('\n--- 2b. the first change stores the whole layout ---');
		await a.page.click('#lpn_dock_strip_right .lpn-dock-tab[aria-controls="lpn_library_box"]');
		await a.settle(500);
		await a.page.click('#lpn_library_box .lpn-popover-x');
		await a.settle(500);
		const keys = await layoutKeys(a);
		ok('closing Libraries stores the layout', keys.includes('lpn_dockbox') && keys.includes('lpn_setbox'), JSON.stringify(keys));
		await a.reload();
		await noConsent(a);
		await a.settle(2000);
		got = await strips(a.page);
		ok('after a reload: every other default tab, in order, and Libraries closed',
			JSON.stringify(got) === JSON.stringify([LEFT, RIGHT.filter((x) => x !== 'lpn_library_box')]), JSON.stringify(got));
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
