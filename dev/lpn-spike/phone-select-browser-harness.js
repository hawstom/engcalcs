// A PHONE'S SELECT AREA, ITS PROPERTIES BOX AND ITS SELECTED CUSTOMER (Tom, 2026-10-24, on a phone).
// In real Chromium at 390 x 844 with a touch screen:
//   1. the select-area help box has an Exit control, and Exit returns to the normal Select mode;
//   2. an area that catches at least one asset ends the mode and opens Properties; one that catches
//      nothing stays in the mode; a Shift area (not available on touch) is covered in
//      select-area-harness.js;
//   3. a closed Properties box comes back from Water > Properties, with a selection or without;
//   4. a selected Customer shows a halo that can be counted in the screen's own pixels, larger on a
//      touch screen than with a mouse.
//
//   node dev/lpn-spike/phone-select-browser-harness.js   (takes the browser lock itself)
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PHONESEL_BROWSER_LOCKED';
const NAME = 'phone-select-browser-harness';

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

function projectText() {
	const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
	d.customers = [{ id: 'M1', demand: 12.5, count: 3, link: null, x: 25, y: 60, desc: 'School', tag: 'inst' }];
	return JSON.stringify(d);
}

async function open(Session, browser, extra) {
	const a = await Session.open(browser, NAME, Object.assign({ serviceWorkers: 'block' }, extra));
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php?ec_nolog=1');
	await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_phonesel', txt); }, projectText());
	await a.reload();
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.settle(2500);
	return a;
}

const visible = (page, sel) => page.evaluate((s) => {
	const e = document.querySelector(s);
	return !!e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0;
}, sel);
const areaToolOn = (page) => page.evaluate(() => document.getElementById('lpn_canvas').classList.contains('lpn-placemode'));

// A finger's press-drag-lift, through the browser's own touch input.
async function swipe(a, cdp, from, to) {
	const pt = (p) => [{ x: p.x, y: p.y, id: 1 }];
	await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt(from) });
	for (let i = 1; i <= 6; i++) {
		await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pt({ x: from.x + (to.x - from.x) * i / 6, y: from.y + (to.y - from.y) * i / 6 }) });
	}
	await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
	await a.settle(500);
}

// A tap sent the same way as the swipes above. Playwright's own tap() right after a CDP swipe is
// dropped by Chromium (no click follows its touchend), so the harness keeps to one input path.
// It also waits 2.5 s first: a tap on Properties' X within about a second of the box opening from an
// area selection is not acted on (found 2026-10-24, not yet explained; a tap after 3 s closes it).
async function tapAt(a, cdp, sel) {
	await a.settle(2500);
	const p = await a.page.evaluate((q) => { const r = document.querySelector(q).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
	await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p.x, y: p.y, id: 1 }] });
	await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
	await a.settle(400);
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const browser = await chromium.launch({ executablePath: env.findChromium() });
	try {
		const a = await open(Session, browser, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
		const page = a.page;
		const cdp = await a.context.newCDPSession(page);
		const selectedCount = () => page.evaluate(() => document.querySelectorAll('#lpn_canvas .lpn-selected').length);
		const lang = (k) => a.lang(k);

		console.log('--- 1. Exit in the help box ---');
		await a.menuClick(await lang('lpn_tool_area_window'), 'edit');
		await a.settle(400);
		ok('1.1 the area tool is on', await areaToolOn(page));
		ok('1.2 the help box shows', await visible(page, '#lpn_area_hint'));
		ok('1.3 ...with an Exit control', await visible(page, '#lpn_area_hint_exit'));
		const sz = await page.evaluate(() => { const r = document.getElementById('lpn_area_hint_exit').getBoundingClientRect(); return { w: r.width, h: r.height }; });
		ok('1.4 ...that is finger-sized (40 px tall)', sz.h >= 40, JSON.stringify(sz));
		await page.tap('#lpn_area_hint_exit');
		await a.settle(400);
		ok('1.5 Exit returns to the normal Select mode: tool off, help box gone', !(await areaToolOn(page)) && !(await visible(page, '#lpn_area_hint')));

		console.log('\n--- 2. an area that catches something ends the mode ---');
		const box = await page.evaluate(() => {
			const r = document.getElementById('lpn_canvas').getBoundingClientRect();
			const ns = Array.from(document.querySelectorAll('#lpn_canvas circle.lpn-node')).map((c) => c.getBoundingClientRect());
			return { map: { l: r.left, t: r.top, r: r.right, b: r.bottom }, l: Math.min(...ns.map((n) => n.left)), t: Math.min(...ns.map((n) => n.top)), r: Math.max(...ns.map((n) => n.right)), b: Math.max(...ns.map((n) => n.bottom)) };
		});
		await a.menuClick(await lang('lpn_tool_area_window'), 'edit');
		await a.settle(400);
		// An empty patch of map first: the top-left corner of the map, 20 px square.
		await swipe(a, cdp, { x: box.map.l + 4, y: box.map.t + 4 }, { x: box.map.l + 24, y: box.map.t + 24 });
		ok('2.1 a window over nothing stays in the tool', await areaToolOn(page) && await visible(page, '#lpn_area_hint'));
		ok('2.2 ...and selects nothing', (await selectedCount()) === 0);
		const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
		console.log('       network box ' + JSON.stringify(box));
		await swipe(a, cdp, { x: cl(box.l - 6, box.map.l + 2, box.map.r - 2), y: cl(box.t - 6, box.map.t + 2, box.map.b - 2) },
			{ x: cl(box.r + 6, box.map.l + 2, box.map.r - 2), y: cl(box.b + 6, box.map.t + 2, box.map.b - 2) });
		const n = await selectedCount();
		ok('2.3 a window over the network selects assets', n > 0, String(n));
		ok('2.4 ...and ends the tool: help box gone, normal Select mode', !(await areaToolOn(page)) && !(await visible(page, '#lpn_area_hint')));
		ok('2.5 ...and Properties opens on the selection', await visible(page, '#lpn_popup'));

		console.log('\n--- 3. a closed Properties box comes back ---');
		await tapAt(a, cdp, "#lpn_popup_close");
		await a.settle(400);
		ok('3.1 closed with its X', !(await visible(page, '#lpn_popup')), await page.evaluate(() => { const p = document.getElementById('lpn_popup'); return 'display=' + getComputedStyle(p).display + ' style=' + p.style.display + ' class=' + p.className; }));
		const rows = await a.menuRows('project');
		await a.closeMenu();
		const propLabel = await page.evaluate(() => document.getElementById('lpn_popup_boxtitle').textContent.trim());
		ok('3.2 the Water menu has a Properties row', rows.some((r) => r.label === propLabel), JSON.stringify(rows.map((r) => r.label)));
		await a.menuClick(propLabel, 'project');
		await a.settle(500);
		ok('3.3 choosing it brings Properties back on the selection', await visible(page, '#lpn_popup') && /selected/.test(await page.evaluate(() => document.getElementById('lpn_popup_title').textContent)),
			await page.evaluate(() => document.getElementById('lpn_popup_title').textContent));
		await tapAt(a, cdp, "#lpn_popup_close");
		await a.settle(300);
		await page.keyboard.press('Escape');
		await a.settle(300);
		await a.menuClick(propLabel, 'project');
		await a.settle(500);
		ok('3.4 with nothing selected it still opens', await visible(page, '#lpn_popup'));
		await tapAt(a, cdp, "#lpn_popup_close");

		console.log('\n--- 4. a selected Customer is easy to see ---');
		// Counted from the screen's own pixels (Tom, 2026-10-24: a CSS drop-shadow passed a style check
		// and he still could not see it): the pixels in a 40 px square round the dot that are clearly
		// blue, before and after the tap, with Properties hidden so it is not what is being counted.
		const bluePixels = async (pg) => {
			const r = await pg.evaluate(() => { const b = document.querySelector('.lpn-meter[data-cust="M1"]').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
			const buf = await pg.screenshot({ clip: { x: Math.max(0, r.x - 20), y: Math.max(0, r.y - 20), width: 40, height: 40 } });
			return pg.evaluate(async (b64) => {
				const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
				const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
				const g = c.getContext('2d'); g.drawImage(img, 0, 0);
				const d = g.getImageData(0, 0, c.width, c.height).data; let n = 0;
				for (let k = 0; k < d.length; k += 4) { if (d[k + 2] > 150 && d[k + 2] - d[k] > 40 && d[k + 2] - d[k + 1] > 20) { n++; } }
				return { n, total: c.width * c.height };
			}, buf.toString('base64'));
		};
		const hidePopup = (pg) => pg.evaluate(() => { document.getElementById('lpn_popup').style.visibility = 'hidden'; });
		const showPopup = (pg) => pg.evaluate(() => { document.getElementById('lpn_popup').style.visibility = ''; });
		const sel1 = (pg) => pg.evaluate(() => {
			const m = document.querySelector('.lpn-meter[data-cust="M1"]');
			const b = m.getBoundingClientRect();
			const o = { bubbles: true, clientX: b.left + b.width / 2, clientY: b.top + b.height / 2, pointerId: 5, pointerType: 'touch', button: 0, isPrimary: true };
			m.dispatchEvent(new PointerEvent('pointerdown', o)); m.dispatchEvent(new PointerEvent('pointerup', o));
		});
		const before = await bluePixels(page);
		await sel1(page);
		await a.settle(500);
		const isSel = await page.evaluate(() => document.querySelector('.lpn-meter[data-cust="M1"]').classList.contains('lpn-selected'));
		await hidePopup(page);
		const after = await bluePixels(page);
		await page.screenshot({ path: process.env.PHONESEL_SHOT || '/tmp/phone-select-halo.png' });
		await showPopup(page);
		ok('4.1 tapped: the customer is selected', isSel);
		ok('4.2 before the tap almost no blue round the dot', before.n < 15, JSON.stringify(before));
		ok('4.3 after the tap, a halo: at least 600 blue pixels in the 40 px square (a 22 px disc is about 1000 of 6400 at 2x)', after.n >= 600, JSON.stringify(after));
		await a.close();

		const d = await open(Session, browser, { viewport: { width: 1200, height: 800 } });
		const dBefore = await bluePixels(d.page);
		await sel1(d.page);
		await d.settle(500);
		await hidePopup(d.page);
		const dAfter = await bluePixels(d.page);
		ok('4.4 with a mouse a selected customer also shows a halo, smaller than the phone\'s', dAfter.n > dBefore.n + 20 && dAfter.n <= after.n, JSON.stringify([dBefore, dAfter]));
		ok('no page errors', !a.errors.length && !d.errors.length, (a.errors[0] || d.errors[0] || '').slice(0, 200));
		await d.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
