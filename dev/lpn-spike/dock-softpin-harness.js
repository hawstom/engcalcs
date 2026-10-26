// A CLICK ON A BUTTON INSIDE A FLYOUT SOFT-PINS IT (Tom, 2026-10-24: "why doesn't the box
// 'soft-pin' when I click a button? I think this would be a generally good rule to add."). An auto-hide
// docked box flown out from its tab, and then clicked on a button inside, stays out when the pointer
// leaves, until a press outside it (the map, another tab) or Escape. It is not pinned for good.
//
//   1. Control: flown out and only pointed at, a box tucks once the pointer leaves.
//   2. Click a button in it, move off it, wait: still out. Same for every first-visit docked box on
//      the right (a button inside each).
//   3. Press on the map: it tucks. Escape: it tucks. Press another tab: it tucks.
//   4. A click on the box's own corner buttons (pin, dock, float) does not soft-pin it.
//   5. Tucked and flown out again, it is no longer soft-pinned (tucks on leave).
//
//   node dev/lpn-spike/dock-softpin-harness.js     (takes the browser lock itself)
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_DOCKSOFT_BROWSER_LOCKED';
const NAME = 'dock-softpin-harness';

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
const isOut = (a, id) => a.page.evaluate((i) => document.getElementById(i).classList.contains('lpn-dock-out'), id);
const tab = (id) => '#lpn_dock_strip_right .lpn-dock-tab[aria-controls="' + id + '"]';
// A button (or a checkbox) inside the box that does nothing but change a setting.
const BOXES = ['lpn_library_box', 'lpn_find_popup', 'lpn_settings_box', 'lpn_ds_box'];
// The first enabled, visible button inside the box that is not the corner row or the X.
const pickButton = (a, id) => a.page.evaluate((i) => {
	const b = Array.from(document.querySelectorAll('#' + i + ' button, #' + i + ' input[type="checkbox"]')).find((x) => {
		const r = x.getBoundingClientRect();
		return !x.disabled && r.width > 0 && r.height > 0 && !x.closest('.lpn-box-corner') && !x.classList.contains('lpn-popover-x') && !x.closest('.lpn-dock-tab');
	});
	if (!b) { return null; }
	const r = b.getBoundingClientRect();
	return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}, id);

async function visit(Session, browser, label) {
	const a = await Session.open(browser, NAME + '-' + label, { viewport: { width: 1600, height: 1000 } });
	// The first-view layout is five boxes (feat/first-view); this harness needs these five on the right.
	await a.context.addInitScript(() => {
		window.EC_DEFAULT_DOCKS = true;
		window.EC_DEFAULT_DOCK_LIST = ['lpn_contour_box', 'lpn_library_box', 'lpn_find_popup', 'lpn_settings_box', 'lpn_ds_box'].map((id) => ({ id, side: 'right' }));
	});
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await noConsent(a);
	await a.settle(1500);
	// First-view docks arrive when the first project opens (feat/first-view), not over the gallery.
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(2500);
	return a;
}
async function flyOut(a, id) {
	// Pointed at, as a mouse reader does: no keyboard goes inside (a click on the tab would put it there,
	// and a box with the keyboard in it does not tuck on leaving whether or not it is soft-pinned).
	await a.page.hover(tab(id));
	await a.settle(700);
	return isOut(a, id);
}
// Off the box and off the strip, onto bare map, without pressing anything.
const leave = async (a) => { await a.page.mouse.move(500, 700); await a.settle(1200); };

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
		const a = await visit(Session, browser, 'a');
		console.log('\n--- 1. control: only pointed at, it tucks when the pointer leaves ---');
		ok('Contour plot flies out', await flyOut(a, 'lpn_contour_box'));
		await a.page.hover('#lpn_contour_box');
		await leave(a);
		ok('and tucks after the pointer leaves, nothing clicked', !(await isOut(a, 'lpn_contour_box')));

		console.log('\n--- 2. a click on a button inside soft-pins it ---');
		for (const id of BOXES) {
			ok(id + ' flies out', await flyOut(a, id));
			await a.page.hover('#' + id);
			const at = await pickButton(a, id);
			if (!at) { ok(id + ' has a button to click', false); continue; }
			await a.page.mouse.click(at.x, at.y);
			await a.settle(300);
			await leave(a);
			ok(id + ': still out after the pointer left and 1.2 s passed', await isOut(a, id));
			await a.page.mouse.click(500, 700);
			await a.settle(500);
			ok(id + ': a press on the map tucks it', !(await isOut(a, id)));
			await flyOut(a, id);
			await a.page.hover('#' + id);
			await leave(a);
			ok(id + ': flown out again and only pointed at, it tucks (the soft pin does not outlive its tuck)', !(await isOut(a, id)));
		}

		console.log('\n--- 3. Escape and another tab end it ---');
		const softPin = async (id) => {
			await flyOut(a, id);
			await a.page.hover('#' + id);
			const at = await pickButton(a, id);
			await a.page.mouse.click(at.x, at.y);
			await leave(a);
			return isOut(a, id);
		};
		ok('Libraries soft-pinned by a click', await softPin('lpn_library_box'));
		await a.page.keyboard.press('Escape');
		await a.settle(500);
		ok('Escape tucks it', !(await isOut(a, 'lpn_library_box')));
		ok('Libraries soft-pinned again', await softPin('lpn_library_box'));
		await a.page.click(tab('lpn_find_popup'));
		await a.settle(600);
		ok('pressing another tab tucks it and flies that one out', !(await isOut(a, 'lpn_library_box')) && await isOut(a, 'lpn_find_popup'));
		await a.page.mouse.click(500, 700);
		await a.settle(500);

		console.log('\n--- 4. a corner button does not soft-pin ---');
		await flyOut(a, 'lpn_library_box');
		await a.page.hover('#lpn_library_box');
		await a.page.click('#lpn_library_box .lpn-corner-btn[data-dock="float"], #lpn_library_box .lpn-corner-btn[data-dock="left"]').catch(() => {});
		await a.settle(500);
		ok('the box is no longer a flyout after a dock or float button (nothing left soft-pinned)', !(await isOut(a, 'lpn_library_box')));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' passed' + (failures ? ', ' + failures + ' FAILED' : ''));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
