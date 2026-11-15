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
//   3. THE SAME NET3 OPEN ON A PHONE (390x844, touch, mobile) WITH THE CPU SLOWED 4 TIMES (fix/phone-open-freeze).
//      The independent reviewer measured 4750 ms on the box-design branch (1400 without docks): a node
//      label was measured with getBBox() between two appends, 97 forced layouts, each also laying out the
//      two thousand elements of the tucked Settings and guide boxes. Fixed: the measuring is one read after
//      the loop, and a tucked box has `content-visibility: hidden`. Measured 1200 ms with docks, 1100
//      without, map drawn in about 2400 ms; the budget below is 2000 and 5000.
//
//   4. NO LEGEND ON A PHONE AT OPEN, AND A LEGEND IS ABOVE EVERYTHING (Task 851; Tom, 2026-11-14: "On a phone, we
//      should never have the legends shown by default on any example or for any reason. The legends should
//      have higher zindex than anything on the map."). Net1 and Net3 at 390x844: neither legend is showing,
//      whatever the file says (Net1 stores the Labels legend at the top right), and the project's own setting
//      is still what the file said. The Settings dropdown of a held legend reads None; choosing a corner shows
//      that legend, drawn over the lettering beneath it (elementFromPoint with pointer events switched on, since
//      a legend takes none), and above every other positioned thing on the map bar the tile credit and the
//      georeferencing tools. A reload holds both again; a desktop window shows its legend as it always did.
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
const { strips, openBox } = require('./dock-boxes.js');
const WANT = JSON.stringify([['lpn_sm_box', 'lpn_hotkeys_popup'], ['lpn_popup', 'lpn_settings_box', 'lpn_library_box']]);
const LONG_TASK_MAX_MS = 1500, DRAW_MAX_MS = 3000;
const PHONE = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 };
const PHONE_SLOWDOWN = 4, PHONE_LONG_TASK_MAX_MS = 2000, PHONE_DRAW_MAX_MS = 5000;
const openBoxes = (a) => a.page.evaluate(() => Array.from(document.querySelectorAll('.lpn-popover, .lpn-setbox, [id$="_box"]'))
	.filter((b) => b.style.display && b.style.display !== 'none' && !b.classList.contains('lpn-dock-collapsed') && b.getBoundingClientRect().width > 0)
	.map((b) => b.id));

async function fresh(Session, browser, label, phone) {
	const a = await Session.open(browser, NAME + '-' + label, phone ? PHONE : { viewport: { width: 1400, height: 900 } });
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
	if (phone) { await (await a.context.newCDPSession(a.page)).send('Emulation.setCPUThrottlingRate', { rate: PHONE_SLOWDOWN }); }
	return a;
}
async function judge(a, what, mapSel, t0, phone) {
	const maxBlock = phone ? PHONE_LONG_TASK_MAX_MS : LONG_TASK_MAX_MS, maxDraw = phone ? PHONE_DRAW_MAX_MS : DRAW_MAX_MS;
	await a.page.waitForSelector(mapSel, { state: 'attached', timeout: 60000 });
	const drawn = Date.now() - t0;
	await a.settle(3000);
	const lt = await a.page.evaluate(() => window.__longTasks);
	const worst = lt.reduce((m, x) => Math.max(m, x), 0);
	const got = await strips(a.page);
	ok(what + ': five auto-hide tabs, left manager and manual, right Properties, Settings, Libraries', JSON.stringify(got) === WANT, JSON.stringify(got));
	ok(what + ': nothing is pinned open', (await openBoxes(a)).length === 0, JSON.stringify(await openBoxes(a)));
	ok(what + ': longest main-thread block ' + worst + ' ms, under ' + maxBlock, worst < maxBlock, JSON.stringify(lt));
	ok(what + ': map drawn ' + drawn + ' ms after the click, under ' + maxDraw, drawn < maxDraw);
	ok(what + ': no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
}

// What a visitor sees: the legends with a box on the screen.
const shownLegends = (page) => page.evaluate(() => ['lpn_labels_legend', 'lpn_color_legend'].filter((id) => {
	const e = document.getElementById(id), r = e && e.getBoundingClientRect();
	return !!e && getComputedStyle(e).display !== 'none' && r.width > 0 && r.height > 0;
}));
const projectLegendSettings = (page) => page.evaluate(() => {
	const st = JSON.parse(EngCalcs.lpnCleanMap.projectText()).settings;
	return [st.legendPosition, st.colorLegendPosition];
});
// Pick a corner in the Settings box's own dropdown, found by its row's label.
const pickCorner = (page, label, value) => page.evaluate(([label, value]) => {
	const box = document.getElementById('lpn_settings_box');
	for (const lab of box.querySelectorAll('label, .ec-label, div, span')) {
		if ((lab.textContent || '').trim() !== label) { continue; }
		const sel = (lab.parentNode || lab).querySelector('select');
		if (!sel) { continue; }
		const was = sel.value;
		sel.value = value;
		sel.dispatchEvent(new Event('change', { bubbles: true }));
		return was;
	}
	return null;
}, [label, value]);
const cornerShown = (page, label) => page.evaluate((label) => {
	const box = document.getElementById('lpn_settings_box');
	for (const lab of box.querySelectorAll('label, .ec-label, div, span')) {
		if ((lab.textContent || '').trim() !== label) { continue; }
		const sel = (lab.parentNode || lab).querySelector('select');
		if (sel) { return sel.value; }
	}
	return null;
}, label);
const SHOTS = process.env.EC_LEGEND_PICS || '';

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

		console.log('\n--- 3. Fresh, Allow this, Net3, on a phone with the CPU slowed ' + PHONE_SLOWDOWN + ' times ---');
		a = await fresh(Session, browser, 'phone', true);
		t0 = Date.now();
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await judge(a, 'Phone Net3', 'circle.lpn-node', t0, true);
		ok('Phone Net3: no legend is showing', (await shownLegends(a.page)).length === 0, JSON.stringify(await shownLegends(a.page)));
		await a.close();

		console.log('\n--- 4. Phone Net1: no legend at open; one shown by the visitor is drawn over the lettering ---');
		a = await fresh(Session, browser, 'phone-net1', true);
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(2500);
		ok('Phone Net1: no legend is showing', (await shownLegends(a.page)).length === 0, JSON.stringify(await shownLegends(a.page)));
		if (SHOTS) { await a.page.screenshot({ path: path.join(SHOTS, 'net1-phone-after.png') }); }
		ok('...yet the project still says what its file said (Labels legend top-right, colour key bottom-right)',
			JSON.stringify(await projectLegendSettings(a.page)) === '["top-right","bottom-right"]', JSON.stringify(await projectLegendSettings(a.page)));
		await openBox(a, 'lpn_settings_box');
		const LAB = await a.lang('lpn_settings_legend_position'), KEY = await a.lang('lpn_settings_color_key_position');
		ok('...and its Settings dropdowns read None while the legends are held', (await cornerShown(a.page, LAB)) === 'off' && (await cornerShown(a.page, KEY)) === 'off',
			(await cornerShown(a.page, LAB)) + ' / ' + (await cornerShown(a.page, KEY)));
		await a.page.evaluate(() => { const s = document.getElementById('lpn_set_color_node'); s.value = 'pressure'; s.dispatchEvent(new Event('change', { bubbles: true })); });
		await a.settle(800);
		ok('...a colour scheme turned on does not bring the colour key back', (await shownLegends(a.page)).length === 0, JSON.stringify(await shownLegends(a.page)));
		await pickCorner(a.page, KEY, 'bottom-right');
		await a.settle(500);
		ok('choosing a corner for the colour key shows it, and only it', JSON.stringify(await shownLegends(a.page)) === '["lpn_color_legend"]', JSON.stringify(await shownLegends(a.page)));
		await pickCorner(a.page, LAB, 'top-right');
		await a.settle(500);
		ok('choosing a corner for the Labels legend shows it too', JSON.stringify(await shownLegends(a.page)) === '["lpn_labels_legend","lpn_color_legend"]', JSON.stringify(await shownLegends(a.page)));
		ok('...and the project holds the corners that were chosen', JSON.stringify(await projectLegendSettings(a.page)) === '["top-right","bottom-right"]');
		await a.page.addStyleTag({ content: '#lpn_labels_legend, .lpn-color-legend { pointer-events: auto !important; }' });   // a legend takes no pointer events, so elementFromPoint would look through it
		await a.page.evaluate(() => { const b = document.getElementById('lpn_settings_box'); if (b) { b.style.display = 'none'; } });
		const stack = await a.page.evaluate(() => {
			const lg = document.getElementById('lpn_labels_legend'), r = lg.getBoundingClientRect(), svg = document.getElementById('lpn_canvas'), over = [];
			svg.querySelectorAll('text').forEach((t) => {
				if (!t.textContent.trim() || getComputedStyle(t).display === 'none') { return; }
				const b = t.getBoundingClientRect(), x0 = Math.max(b.left, r.left), x1 = Math.min(b.right, r.right), y0 = Math.max(b.top, r.top), y1 = Math.min(b.bottom, r.bottom);
				if (x1 - x0 < 3 || y1 - y0 < 3) { return; }
				const e = document.elementFromPoint((x0 + x1) / 2, (y0 + y1) / 2);
				over.push({ text: t.textContent.trim().slice(0, 12), onTop: !!(e && e.closest('#lpn_labels_legend')) });
			});
			const wrap = svg.parentNode, zs = {};
			for (const c of wrap.children) { const z = getComputedStyle(c).zIndex; if (c !== lg && z !== 'auto' && c.id !== 'lpn_color_legend') { zs[c.id] = +z; } }
			return { over, zs, z: +getComputedStyle(lg).zIndex, zColor: +getComputedStyle(document.getElementById('lpn_color_legend')).zIndex };
		});
		ok('a Labels legend over lettering: there is lettering under it (the test means something)', stack.over.length > 0, JSON.stringify(stack.over));
		ok('...and the legend is what is on top at each such point', stack.over.every((o) => o.onTop), JSON.stringify(stack.over));
		const above = Object.keys(stack.zs).filter((k) => stack.zs[k] >= stack.z);
		ok('...above every positioned thing on the map but the tile credit and the georeferencing tools', JSON.stringify(above.sort()) === JSON.stringify(['lpn_basemap_credit', 'lpn_georef_bar', 'lpn_mapgeo_bar', 'lpn_mapgeo_dial']),
			JSON.stringify(stack.zs) + ' legend ' + stack.z);
		ok('...and the colour key is at the same height', stack.zColor === stack.z, stack.zColor + ' vs ' + stack.z);
		if (SHOTS) { await a.page.screenshot({ path: path.join(SHOTS, 'net1-phone-legend-by-hand.png') }); }
		await a.page.reload();
		await a.settle(2500);
		ok('Net1 reopened by a reload: both legends are held again', (await shownLegends(a.page)).length === 0, JSON.stringify(await shownLegends(a.page)));
		ok('...and a Labels legend shown by hand was not stored on the device', await a.page.evaluate(() => !Object.keys(localStorage).some((k) => /legend/i.test(k))));
		ok('Phone Net1: no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();

		console.log('\n--- 5. A desktop window shows its legend as it always did ---');
		a = await fresh(Session, browser, 'desk-net1');
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1500);
		ok('Desktop Net1: the Labels legend is showing', JSON.stringify(await shownLegends(a.page)) === '["lpn_labels_legend"]', JSON.stringify(await shownLegends(a.page)));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
