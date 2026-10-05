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
const SEL = '#lpn_dock_strip_right .lpn-dock-tab';
const tabs = (page) => page.evaluate((sel) => Array.from(document.querySelectorAll(sel)).map((t) => t.textContent), SEL);
const stored = (page, key) => page.evaluate((k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return 'BAD'; } }, key);
const opened = (page, id) => page.evaluate((i) => { const b = document.getElementById(i), r = b.getBoundingClientRect(); return getComputedStyle(b).visibility !== 'hidden' && !b.classList.contains('lpn-dock-collapsed') && r.width > 0; }, id);
const stuck = (page) => page.evaluate(() => document.querySelectorAll('.lpn-dock-tab-drag').length);
const boxes = (page, ids) => Promise.all(ids.map((i) => opened(page, i)));

async function openNet3(Session, browser) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 }, hasTouch: true });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(1200);
	return a;
}
async function openBox(a, id) {
	if (id === 'lpn_find_popup') { await a.menuClick(await a.lang('lpn_find_menu'), 'edit'); }
	else if (id === 'lpn_settings_box') { await a.toolbarClick(await a.lang('lpn_tool_settings')); }
	else if (id === 'lpn_library_box') { await a.menuClick(await a.lang('lpn_library_menu'), 'project'); }
	await a.settle(500);
}
async function hideBox(a, id) {
	await a.page.click('#' + id + ' .lpn-corner-btn[data-dock="right"]');
	await a.settle(300);
	await a.page.click('#' + id + ' .lpn-corner-btn[data-dock="autohide"]');
	await a.settle(300);
}
const IDS = ['lpn_find_popup', 'lpn_settings_box', 'lpn_library_box'];
async function threeFlags(a) {
	for (const id of IDS) { await openBox(a, id); await hideBox(a, id); }
}
// Drag the flag at index `from` down/up by dy pixels, with a mouse or with CDP touch.
async function drag(a, from, dy, how) {
	const bb = await (await a.page.$$(SEL))[from].boundingBox();
	const x = bb.x + bb.width / 2, y = bb.y + bb.height / 2;
	if (how === 'mouse') {
		await a.page.mouse.move(x, y);
		await a.page.mouse.down();
		await a.page.mouse.move(x, y + (dy > 0 ? 3 : -3), { steps: 2 });
		await a.page.mouse.move(x, y + dy, { steps: 14 });
		await a.page.mouse.up();
	} else {
		const c = await a.page.context().newCDPSession(a.page);
		const t = (type, yy) => c.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y: yy, id: 1 }] });
		await t('touchStart', y);
		for (let i = 1; i <= 16; i++) { await t('touchMove', y + dy * i / 16); }
		await t('touchEnd', y + dy);
		await c.detach();
	}
	await a.settle(400);
}

async function threeCase(Session, browser, how) {
	console.log('\n--- three flags, ' + how + ' ---');
	const a = await openNet3(Session, browser);
	try {
		await threeFlags(a);
		let t = await tabs(a.page);
		ok('three flags on the right bar', t.length === 3, JSON.stringify(t));
		const orig = t.slice();
		await drag(a, 0, 300, how);
		t = await tabs(a.page);
		ok('dragging the top flag down past two slots puts it last', t.length === 3 && t[2] === orig[0] && t[0] === orig[1] && t[1] === orig[2], JSON.stringify(t));
		ok('...no drag mark is left stuck on a flag', (await stuck(a.page)) === 0);
		ok('...and no box opened', (await boxes(a.page, IDS)).every((v) => !v));
		const recs = [await stored(a.page, 'lpn_findbox'), await stored(a.page, 'lpn_setbox'), await stored(a.page, 'lpn_libbox')];
		ok('...every box record carries its rank (find 2, settings 0, libraries 1)',
			recs[0] && recs[1] && recs[2] && recs[0].dockOrd === 2 && recs[1].dockOrd === 0 && recs[2].dockOrd === 1, JSON.stringify(recs.map((r) => r && r.dockOrd)));
		await reload(a);
		const after = await tabs(a.page);
		ok('...the order survives a reload', JSON.stringify(after) === JSON.stringify(t), JSON.stringify(after));
		// A click on the first flag opens the box it names (screen order and internal order agree).
		await a.page.click(SEL);
		await a.settle(400);
		const states = await boxes(a.page, IDS);
		const wantId = await a.page.evaluate((sel) => document.querySelector(sel).getAttribute('aria-controls'), SEL);
		ok('...and a click on the first flag opens the box it names', states[IDS.indexOf(wantId)] === true && states.filter(Boolean).length === 1, JSON.stringify({ wantId, states }));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally { await a.close(); }
}

async function keyboardCase(Session, browser) {
	console.log('\n--- three flags, keyboard and click ---');
	const a = await openNet3(Session, browser);
	try {
		await threeFlags(a);
		const t0 = await tabs(a.page);
		const bb = await (await a.page.$$(SEL))[1].boundingBox();
		await a.page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
		await a.page.mouse.down();
		await a.page.mouse.up();
		await a.settle(300);
		ok('a click without movement opens the box', (await boxes(a.page, IDS)).filter(Boolean).length === 1);
		await a.page.keyboard.press('Escape');
		await a.settle(300);
		ok('...Escape tucks it, and the order is unchanged', JSON.stringify(await tabs(a.page)) === JSON.stringify(t0) && (await boxes(a.page, IDS)).every((v) => !v));
		ok('no order is stored until a flag is moved', (await stored(a.page, 'lpn_setbox')).dockOrd === undefined);
		await a.page.focus(SEL);
		await a.page.keyboard.press('Alt+ArrowDown');
		await a.page.keyboard.press('Alt+ArrowDown');
		await a.settle(300);
		let t = await tabs(a.page);
		ok('Alt+ArrowDown twice moves the top flag to the bottom', t[2] === t0[0] && t[0] === t0[1] && t[1] === t0[2], JSON.stringify(t));
		ok('...with the keyboard still on that flag', (await a.page.evaluate(() => document.activeElement.textContent)) === t0[0]);
		await a.page.keyboard.press('Alt+ArrowDown');
		ok('...Alt+ArrowDown on the last flag does nothing', JSON.stringify(await tabs(a.page)) === JSON.stringify(t));
		await a.page.keyboard.press('Alt+ArrowUp');
		t = await tabs(a.page);
		ok('Alt+ArrowUp moves it back one place', t[1] === t0[0], JSON.stringify(t));
		await reload(a);
		ok('...and that order survives a reload', JSON.stringify(await tabs(a.page)) === JSON.stringify(t));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally { await a.close(); }
}

async function mixedCase(Session, browser) {
	console.log('\n--- a box with no layout record among the flags ---');
	const a = await openNet3(Session, browser);
	try {
		await threeFlags(a);
		// Properties keeps no record: select a node, dock it right, hide it.
		const at = await a.page.evaluate(() => {
			const ns = Array.from(document.querySelectorAll('#lpn_canvas .lpn-symbols circle:not(.lpn-node-hit)')).filter((c) => c.getBoundingClientRect().width > 0);
			const r = ns[10].getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		});
		await a.page.mouse.click(at.x, at.y);
		await a.settle(700);
		const propsOpen = await a.page.evaluate(() => { const b = document.getElementById('lpn_popup'); return b && b.style.display !== 'none' && b.style.display !== ''; });
		ok('Properties (no record) is open to dock', !!propsOpen);
		if (propsOpen) {
			await hideBox(a, 'lpn_popup');
			let t = await tabs(a.page);
			ok('four flags, Properties among them', t.length === 4, JSON.stringify(t));
			await drag(a, t.length - 1, -400, 'mouse');
			t = await tabs(a.page);
			ok('Libraries dragged to the front is first, Properties second', t[0] === 'Libraries' && t[1] === 'Properties', JSON.stringify(t));
			ok('...no drag mark left stuck', (await stuck(a.page)) === 0);
			const rest = t.filter((x) => x !== 'Properties');
			await reload(a);
			const after = await tabs(a.page);
			// Properties' docking is for the page load only (it keeps no record), so after a reload the
			// three recorded boxes remain, in the order the drag left them.
			ok('after a reload the recorded boxes keep their dragged order and Properties is not a flag', JSON.stringify(after) === JSON.stringify(rest), JSON.stringify({ after, rest }));
		}
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally { await a.close(); }
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
		await threeCase(Session, browser, 'mouse');
		await threeCase(Session, browser, 'touch');
		await keyboardCase(Session, browser);
		await mixedCase(Session, browser);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
