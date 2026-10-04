// REORDERING THE AUTO-HIDE FLAGS (Tom: "I would like a good college try."). A hidden box is a flag on
// its dock bar; dragging a flag along the bar reorders them, the order lives on the box records the
// layout already keeps (`dockOrd`), a click that does not move still opens the box, and Alt+Arrow
// reorders from the keyboard.
//
//   node dev/lpn-spike/dock-flag-order-harness.js     (takes the browser lock itself)
'use strict';


const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_FLAGORDER_BROWSER_LOCKED';
const NAME = 'dock-flag-order-harness';

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
const reload = async (a) => {
	await a.reload();
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.settle(1500);
};
const tabs = (page) => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_dock_strip_right .lpn-dock-tab')).map((t) => t.textContent));
const stored = (page, key) => page.evaluate((k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return 'BAD'; } }, key);
const opened = (page, id) => page.evaluate((i) => { const b = document.getElementById(i), r = b.getBoundingClientRect(); return getComputedStyle(b).visibility !== 'hidden' && !b.classList.contains('lpn-dock-collapsed') && r.width > 0; }, id);

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
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await a.settle(1200);
		const setT = await a.lang('lpn_tool_settings');
		// Find (registered first) and Settings, both docked right and auto-hidden.
		await a.menuClick(await a.lang('lpn_find_menu'), 'edit');
		await a.settle(400);
		await a.toolbarClick(setT);
		await a.settle(500);
		for (const id of ['lpn_find_popup', 'lpn_settings_box']) {
			await a.page.click('#' + id + ' .lpn-corner-btn[data-dock="right"]');
			await a.settle(300);
			await a.page.click('#' + id + ' .lpn-corner-btn[data-dock="autohide"]');
			await a.settle(300);
		}
		let t = await tabs(a.page);
		ok('two flags on the right bar', t.length === 2, JSON.stringify(t));
		const first = t[0], second = t[1];
		const rec0 = await stored(a.page, 'lpn_setbox');
		ok('no order is stored until a flag is dragged', !rec0 || rec0.dockOrd === undefined, JSON.stringify(rec0));

		// A plain click, no movement, opens the box.
		const sel = '#lpn_dock_strip_right .lpn-dock-tab';
		let bb = await (await a.page.$$(sel))[1].boundingBox();
		await a.page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
		await a.page.mouse.down();
		await a.page.mouse.up();
		await a.settle(300);
		ok('a click without movement opens the box', await opened(a.page, 'lpn_settings_box'));
		await a.page.keyboard.press('Escape');
		await a.settle(300);
		ok('...and Escape tucks it again', !(await opened(a.page, 'lpn_settings_box')));
		ok('...with the order unchanged by the click', JSON.stringify(await tabs(a.page)) === JSON.stringify(t));

		// Drag the second flag up past the first.
		const all = await a.page.$$(sel);
		const b1 = await all[0].boundingBox(), b2 = await all[1].boundingBox();
		await a.page.mouse.move(b2.x + b2.width / 2, b2.y + b2.height / 2);
		await a.page.mouse.down();
		await a.page.mouse.move(b2.x + b2.width / 2, b2.y + b2.height / 2 - 3, { steps: 2 });
		await a.page.mouse.move(b2.x + b2.width / 2, b1.y + 4, { steps: 8 });
		await a.page.mouse.up();
		await a.settle(400);
		t = await tabs(a.page);
		ok('dragging a flag past another reorders the flags', t[0] === second && t[1] === first, JSON.stringify(t));
		ok('...and the drag did not open the box', !(await opened(a.page, 'lpn_settings_box')) && !(await opened(a.page, 'lpn_find_popup')));
		const sRec = await stored(a.page, 'lpn_setbox'), fRec = await stored(a.page, 'lpn_findbox');
		ok('the order rides on the existing box records', sRec && fRec && sRec.dockOrd === 0 && fRec.dockOrd === 1, JSON.stringify({ sRec, fRec }));
		const keys = await a.page.evaluate(() => Object.keys(localStorage).filter((k) => /dock|flag|order/i.test(k)));
		ok('...and no new storage key appeared', keys.length === 0, JSON.stringify(keys));

		await reload(a);
		t = await tabs(a.page);
		ok('the order survives a reload', t.length === 2 && t[0] === second && t[1] === first, JSON.stringify(t));

		// Keyboard: Alt+ArrowDown on the first flag puts it back.
		await a.page.focus(sel);
		await a.page.keyboard.press('Alt+ArrowDown');
		await a.settle(300);
		t = await tabs(a.page);
		ok('Alt+ArrowDown on a flag moves it along the bar', t[0] === first && t[1] === second, JSON.stringify(t));
		ok('...and the focus stays on that flag', await a.page.evaluate(() => document.activeElement && document.activeElement.classList.contains('lpn-dock-tab') && document.activeElement.textContent));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
