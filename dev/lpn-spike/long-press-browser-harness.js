// **LONG PRESS OPENS THE ASSET MENU** (Roadmap Task 789; Tom, 2026-10-14: long press is a touch
// screen's right-click). Real Chromium with touch, real touches sent through the DevTools protocol
// (which can hold a finger down) on Net1:
//   1. a held finger on a junction opens the asset menu with its rows, once, and after the lift no
//      property sheet opens (the tap action is swallowed);
//   2. a short tap selects and opens nothing;
//   3. a press that travels 30 px opens nothing; a held press on bare map opens nothing;
//   4. a two-finger pinch opens nothing, nor does a second finger landing mid-press;
//   5. a mouse right-click still opens the menu, once.
//
//   node dev/lpn-spike/long-press-browser-harness.js
'use strict';
const path = require('path');
const REPO = path.resolve(__dirname, '..', '..');
const NAME = 'long-press-browser-harness';
const { execFileSync, spawnSync } = require('child_process');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_LONGPRESS_BROWSER_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'A', { hasTouch: true });
		const page = a.page;
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1500);
		await page.evaluate(() => {
			delete window.lpnDialogAnswerer;
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
			window.__menusOpened = 0;
			new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => {
				if (n.classList && n.classList.contains('lpn-pane-ctxmenu')) { window.__menusOpened++; }
			}))).observe(document.body, { childList: true });
		});
		const cdp = await page.context().newCDPSession(page);
		const COPY = await a.lang('lpn_copy_props_menu'), PASTE = await a.lang('lpn_paste_props_menu'), GRAPH = await a.lang('lpn_tsb_menu');
		const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map((p, i) => ({ x: p.x, y: p.y, id: i + 1 })) });
		const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
		const nodePt = (id) => page.evaluate((i) => {
			for (const el of document.querySelectorAll('#lpn_canvas [data-node="' + i + '"]')) {
				const r = el.getBoundingClientRect();
				if (r.width > 0) { return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
			}
			return null;
		}, id);
		const rows = () => page.$$eval('.lpn-pane-ctxmenu button', (bs) => bs.map((b) => b.textContent.trim()));
		const opened = () => page.evaluate(() => window.__menusOpened);
		const popupOpen = () => page.evaluate(() => { const p = document.getElementById('lpn_popup'); return !!p && getComputedStyle(p).display !== 'none'; });
		const reset = async () => { await page.keyboard.press('Escape'); await page.evaluate(() => { document.querySelectorAll('.lpn-pane-ctxmenu').forEach((m) => m.remove()); window.__menusOpened = 0; }); await a.settle(300); };
		const p10 = await nodePt('10');
		ok('junction 10 is on screen', !!p10, JSON.stringify(p10));

		// 1. long press
		await touch('touchStart', [p10]);
		await sleep(900);
		ok('a held finger opens the menu', (await opened()) === 1);
		const r1 = await rows();
		ok('...with Copy, Paste and Time series graph rows', [COPY, PASTE, GRAPH].every((l) => r1.indexOf(l) >= 0), JSON.stringify(r1));
		await touch('touchEnd', []);
		await a.settle(700);
		ok('...opened once only, and stays open after the lift', (await opened()) === 1 && (await rows()).length === r1.length);
		ok('...and no property sheet opens behind it', !(await popupOpen()));
		await reset();

		// 2. a short tap
		await touch('touchStart', [p10]);
		await sleep(80);
		await touch('touchEnd', []);
		await a.settle(900);
		ok('a short tap opens no menu', (await opened()) === 0);
		ok('...and still selects the junction', (await page.evaluate(() => document.querySelectorAll('#lpn_canvas .lpn-selected').length)) > 0);
		await reset();
		await page.evaluate(() => { const p = document.getElementById('lpn_popup_close'); if (p && p.offsetParent) { p.click(); } });

		// 3. a press that travels
		const q = await nodePt('10');
		await touch('touchStart', [q]);
		await sleep(100);
		for (let i = 1; i <= 6; i++) { await touch('touchMove', [{ x: q.x + i * 5, y: q.y }]); await sleep(30); }
		await sleep(800);
		await touch('touchEnd', []);
		await a.settle(500);
		ok('a press that travels 30 px opens no menu', (await opened()) === 0);
		await reset();
		const bare = { x: 40, y: 400 };
		const bareHit = await page.evaluate(([x, y]) => (document.elementsFromPoint(x, y)[0] || {}).id || (document.elementsFromPoint(x, y)[0] || {}).tagName, [bare.x, bare.y]);
		await touch('touchStart', [bare]);
		await sleep(900);
		await touch('touchEnd', []);
		await a.settle(400);
		ok('a held press on bare map opens no menu', (await opened()) === 0, bareHit);
		await reset();

		// 4. pinch
		const p2 = await nodePt('10');
		await touch('touchStart', [p2, { x: p2.x + 120, y: p2.y + 40 }]);
		await sleep(900);
		ok('a two-finger press opens no menu', (await opened()) === 0);
		await touch('touchEnd', []);
		await a.settle(400);
		await reset();
		const p3 = await nodePt('10');
		await touch('touchStart', [p3]);
		await sleep(250);
		await touch('touchStart', [p3, { x: p3.x + 120, y: p3.y + 40 }]);
		await sleep(900);
		ok('a second finger landing mid-press cancels it', (await opened()) === 0);
		await touch('touchEnd', []);
		await a.settle(400);
		await reset();

		// 5. a mouse is unchanged
		const p4 = await nodePt('10');
		await page.mouse.move(p4.x, p4.y);
		await page.mouse.click(p4.x, p4.y, { button: 'right' });
		await a.settle(500);
		ok('a mouse right-click opens the menu once', (await opened()) === 1 && (await rows()).indexOf(COPY) >= 0);
		await reset();
		await page.mouse.move(p4.x, p4.y);
		await page.mouse.down();
		await sleep(900);
		await page.mouse.up();
		await a.settle(300);
		ok('a held mouse button is not a long press', (await opened()) === 0);
		ok('no page error', a.errors.length === 0, JSON.stringify(a.errors).slice(0, 300));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
