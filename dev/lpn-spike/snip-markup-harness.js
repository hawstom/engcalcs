// THE SNIP BUTTON AND THE MARKUP VIEW, IN A REAL CHROMIUM. Tom, 2026-10-06, on the Windows snipping
// tool: clip by rectangle or lasso, scribble with a red pen, Copy or Save.
//
// What this proves, on Net1 at 2x:
//   1. the box's Snip button (Rectangle) makes a PNG exactly rectangle x scale, and its pixels match
//      the same region of the whole-map capture;
//   2. a capture opens the markup view and puts nothing on the clipboard until Copy is pressed;
//   3. a pen stroke puts red pixels along its path and Undo (button and Ctrl+Z) takes them away,
//      and Ctrl+Z does not reach the map;
//   4. Esc cancels a snip in progress (no view, no download) and closes the view (no download);
//   5. Save fires exactly one download per click;
//   7. the eraser removes whole strokes (click and drag), Undo and Redo include erasures, E and Esc
//      switch tool, every icon has a tip equal to its aria-label, and the box and view carry no words;
//   6. Freehand leaves every pixel outside the outline transparent and the inside opaque.
//
//   node dev/lpn-spike/snip-markup-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SNIPMARKUP_BROWSER_LOCKED';
const NAME = 'snip-markup-harness';

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


const RECORDER = () => {
	window.__snipBlobs = [];
	Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
		write: async (items) => { window.__snipBlobs.push(await items[0].getType('image/png')); }
	} });
};
const MAP_RECT = () => {
	const s = document.getElementById('lpn_canvas'), r = s.getBoundingClientRect();
	const left = Math.max(r.left + s.clientLeft, 0), top = Math.max(r.top + s.clientTop, 0);
	const right = Math.min(r.left + s.clientLeft + s.clientWidth, innerWidth);
	const bottom = Math.min(r.top + s.clientTop + s.clientHeight, innerHeight);
	return { x: left, y: top, w: right - left, h: bottom - top };
};
// RGBA of a recorded blob: its size, and a reader for any region.
const DECODE = async (i) => {
	const bm = await createImageBitmap(window.__snipBlobs[i]);
	const c = document.createElement('canvas'); c.width = bm.width; c.height = bm.height;
	const g = c.getContext('2d'); g.drawImage(bm, 0, 0);
	window.__dec = window.__dec || {};
	window.__dec[i] = g.getImageData(0, 0, c.width, c.height);
	return { w: bm.width, h: bm.height };
};
const PIXEL = (a) => { const d = window.__dec[a.i], k = (a.y * d.width + a.x) * 4; return Array.from(d.data.slice(k, k + 4)); };
// Mean absolute difference between blob j's whole picture and the region of blob i at (ox, oy).
const REGION_DIFF = (a) => {
	const f = window.__dec[a.i], c = window.__dec[a.j];
	let sum = 0, bad = 0, n = 0;
	for (let y = 0; y < c.height; y++) {
		for (let x = 0; x < c.width; x++) {
			const p = ((y + a.oy) * f.width + (x + a.ox)) * 4, q = (y * c.width + x) * 4;
			const d = Math.abs(f.data[p] - c.data[q]) + Math.abs(f.data[p + 1] - c.data[q + 1]) + Math.abs(f.data[p + 2] - c.data[q + 2]);
			sum += d; n++; if (d > 90) { bad++; }
		}
	}
	return { mean: sum / n, badFraction: bad / n };
};
// Red pen pixels on the markup canvas, and the colour at a point on it (canvas pixels).
const RED_COUNT = () => {
	const c = document.getElementById('lpn_snip_canvas'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
	let n = 0;
	for (let i = 0; i < d.length; i += 4) { if (d[i] > 200 && d[i + 1] < 60 && d[i + 2] < 60 && d[i + 3] > 200) { n++; } }
	return n;
};
async function pressBox(page, id) {
	await page.evaluate((i) => document.getElementById(i).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })), id);
}
async function capture(page, n, how) {
	await how();
	await page.waitForSelector('#lpn_snip_canvas', { state: 'visible', timeout: 15000 });
}
async function copyAndClose(page, n) {
	await page.click('#lpn_snip_copy');
	await page.waitForFunction((k) => window.__snipBlobs.length >= k, n, { timeout: 15000 });
	await page.keyboard.press('Escape');
	await page.waitForSelector('#lpn_snip_canvas', { state: 'detached' });
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
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
		const page = a.page;
		let downloads = 0;
		page.on('download', () => { downloads++; });
		try {
			await a.goto('Looped-Network.php');
			await a.answerTrainingPanel().catch(() => {});
			await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
			await a.settle(1000);
			await page.evaluate(RECORDER);
			await a.menuClick(await a.lang('lpn_screenshot_menu'), 'map');
			await page.waitForSelector('.lpn-snip-veil', { state: 'visible' });
			await page.keyboard.press('Escape');
			await page.selectOption('#lpn_snip_scale', '2');
			const S = 2, map = await page.evaluate(MAP_RECT);

			// Whole map first, as the reference.
			await capture(page, 1, () => pressBox(page, 'lpn_snip_again'));
			ok('a capture opens the markup view and copies nothing yet', (await page.evaluate(() => window.__snipBlobs.length)) === 0);
			const IDS = ['lpn_snip_pen', 'lpn_snip_eraser', 'lpn_snip_undo', 'lpn_snip_redo', 'lpn_snip_copy', 'lpn_snip_save', 'lpn_snip_edit_close'];
			const icons = await page.evaluate((ids) => ids.map((i) => { const e = document.getElementById(i), b = e.getBoundingClientRect();
				return { id: i, title: e.title || e.getAttribute('data-bs-original-title'), aria: e.getAttribute('aria-label'), text: e.textContent.trim(), svg: !!e.querySelector('svg') || i === 'lpn_snip_edit_close', h: b.height }; }), IDS);
			ok('the view offers Pen, Eraser, Undo, Redo, Copy, Save, Close, each with a tip and the same aria-label',
				icons.length === 7 && icons.every((i) => i.title && i.title === i.aria && i.svg), JSON.stringify(icons.map((i) => i.title)));
			ok('...and the icon buttons carry no words', icons.filter((i) => i.id !== 'lpn_snip_edit_close').every((i) => i.text === ''));
			ok('the eraser tip and the shortcuts are named', icons[1].title === 'Eraser: click a stroke to remove it (E)' && /Ctrl\+Z/.test(icons[2].title) && /Ctrl\+Y/.test(icons[3].title), icons[1].title);
			await copyAndClose(page, 1);
			const full = await page.evaluate(DECODE, 0);
			ok('the whole map is map x 2', full.w === Math.round(map.w * S) && full.h === Math.round(map.h * S), full.w + ' x ' + full.h);

			// 1. Snip, rectangle, from the box.
			const boxIcons = await page.evaluate(() => ['lpn_snip_scale', 'lpn_snip_go', 'lpn_snip_mode', 'lpn_snip_again', 'lpn_snip_mode_rect', 'lpn_snip_mode_free'].map((i) => { const e = document.getElementById(i);
				return { id: i, title: e.title || e.getAttribute('data-bs-original-title'), aria: e.getAttribute('aria-label'), text: i === 'lpn_snip_scale' ? '' : e.textContent.trim() }; }));
			ok('the box is wordless: tips and aria-labels on the scale, Snip, its chevron, the monitor, and both modes',
				boxIcons.every((i) => i.title && i.title === i.aria && i.text === ''), JSON.stringify(boxIcons.map((i) => i.title)));
			ok('...Snip says Rectangle with its shortcut, and the scale reads as a bare number', boxIcons[1].title === 'Snip a rectangle (S)'
				&& (await page.$eval('#lpn_snip_scale', (s) => Array.from(s.options).map((o) => o.textContent).join(','))) === '1\u00d7,2\u00d7,3\u00d7,4\u00d7');
			ok('the mode menu opens from the chevron and holds Rectangle and Freehand', await (async () => {
				const closed = await page.$eval('#lpn_snip_menu', (m) => getComputedStyle(m).display === 'none');
				await page.click('#lpn_snip_mode');
				const opened = await page.$eval('#lpn_snip_menu', (m) => getComputedStyle(m).display !== 'none');
				await page.click('#lpn_snip_mode');
				return closed && opened && await page.$eval('#lpn_snip_menu', (m) => getComputedStyle(m).display === 'none');
			})());
			const r = { x: Math.round(map.x + map.w * 0.3), y: Math.round(map.y + map.h * 0.3), w: 240, h: 180 };
			await pressBox(page, 'lpn_snip_go');
			await page.waitForSelector('.lpn-snip-veil', { state: 'visible' });
			ok('Snip shows the veil with a crosshair', await page.$eval('.lpn-snip-veil', (e) => getComputedStyle(e).cursor === 'crosshair'));
			await page.mouse.move(r.x, r.y); await page.mouse.down();
			await page.mouse.move(r.x + r.w, r.y + r.h, { steps: 6 }); await page.mouse.up();
			await page.waitForSelector('#lpn_snip_canvas', { state: 'visible' });
			const cdim = await page.$eval('#lpn_snip_canvas', (c) => ({ w: c.width, h: c.height }));
			ok('the snip is rectangle x scale (' + r.w * S + ' x ' + r.h * S + ')', cdim.w === r.w * S && cdim.h === r.h * S, JSON.stringify(cdim));

			ok('the snip hint is gone once the markup view is open', (await a.notice()) === '', JSON.stringify(await a.notice()));
			// 3. The pen, on this snip.
			const red0 = await page.evaluate(RED_COUNT);
			const cb = await page.$eval('#lpn_snip_canvas', (c) => { const b = c.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; });
			const p1 = { x: cb.x + cb.w * 0.2, y: cb.y + cb.h * 0.5 }, p2 = { x: cb.x + cb.w * 0.8, y: cb.y + cb.h * 0.5 };
			await page.mouse.move(p1.x, p1.y); await page.mouse.down();
			await page.mouse.move(p2.x, p2.y, { steps: 10 }); await page.mouse.up();
			const red1 = await page.evaluate(RED_COUNT);
			ok('a pen stroke adds red pixels', red1 > red0 + 200, red0 + ' -> ' + red1);
			const expectW = 3 * S, expectLen = (p2.x - p1.x) * (cdim.w / cb.w);
			ok('...about the width of the Windows pen (3 screen px, here ' + expectW + ' px) times the stroke length',
				red1 - red0 > expectW * expectLen * 0.7 && red1 - red0 < expectW * expectLen * 1.6 + 400, 'added ' + (red1 - red0) + ' vs ~' + Math.round(expectW * expectLen));
			const mid = await page.evaluate((a) => { const c = document.getElementById('lpn_snip_canvas'); return Array.from(c.getContext('2d').getImageData(a.x, a.y, 1, 1).data); },
				{ x: Math.round(cdim.w * 0.5), y: Math.round(cdim.h * 0.5) });
			ok('the middle of the path is red', mid[0] > 200 && mid[1] < 60 && mid[2] < 60, JSON.stringify(mid));
			await page.click('#lpn_snip_undo');
			ok('Undo takes the stroke away', (await page.evaluate(RED_COUNT)) === red0);
			// Ctrl+Z, and it must not reach the map.
			await page.evaluate(() => { window.__mapKeys = 0; document.addEventListener('keydown', () => { window.__mapKeys++; }); });
			await page.mouse.move(p1.x, p1.y); await page.mouse.down(); await page.mouse.move(p2.x, p2.y, { steps: 6 }); await page.mouse.up();
			ok('a second stroke is red again', (await page.evaluate(RED_COUNT)) > red0 + 200);
			await page.keyboard.press('Control+z');
			ok('Ctrl+Z undoes it', (await page.evaluate(RED_COUNT)) === red0);
			ok('...without reaching the map', (await page.evaluate(() => window.__mapKeys)) === 0);
			// The eraser: three strokes, erase the middle one by click; two remain and the picture differs.
			const ys = [0.25, 0.5, 0.75];
			for (const f of ys) {
				await page.mouse.move(p1.x, cb.y + cb.h * f); await page.mouse.down();
				await page.mouse.move(p2.x, cb.y + cb.h * f, { steps: 6 }); await page.mouse.up();
			}
			const pngNow = () => page.evaluate(() => document.getElementById('lpn_snip_canvas').toDataURL('image/png'));
			const three = await pngNow(), redThree = await page.evaluate(RED_COUNT);
			await page.keyboard.press('e');
			ok('E selects the eraser', (await page.getAttribute('#lpn_snip_eraser', 'aria-pressed')) === 'true' && (await page.getAttribute('#lpn_snip_pen', 'aria-pressed')) === 'false');
			await page.mouse.click((p1.x + p2.x) / 2, cb.y + cb.h * 0.5);
			const two = await pngNow(), redTwo = await page.evaluate(RED_COUNT);
			ok('clicking the middle stroke removes that whole stroke (red falls by about a third)', redTwo < redThree * 0.75 && redTwo > redThree * 0.5, redThree + ' -> ' + redTwo);
			ok('...and the exported PNG differs', two !== three);
			const rowRed = (y) => page.evaluate((a) => { const c = document.getElementById('lpn_snip_canvas'), d = c.getContext('2d').getImageData(0, Math.round(c.height * a), c.width, 1).data; let n = 0; for (let i = 0; i < d.length; i += 4) { if (d[i] > 200 && d[i + 1] < 60) { n++; } } return n; }, y);
			ok('...the top and bottom strokes remain, the middle row is clear', (await rowRed(0.25)) > 100 && (await rowRed(0.75)) > 100 && (await rowRed(0.5)) === 0);
			await page.click('#lpn_snip_undo');
			ok('Undo restores the erased stroke', (await page.evaluate(RED_COUNT)) === redThree && (await pngNow()) === three);
			await page.keyboard.press('Control+y');
			ok('Redo erases it again', (await pngNow()) === two);
			await page.keyboard.press('Control+z');
			await page.keyboard.press('Control+z');
			ok('Undo steps back past the erasure to two strokes', (await page.evaluate(RED_COUNT)) < redThree * 0.75 && (await page.evaluate(RED_COUNT)) > redThree * 0.5);
			await page.keyboard.press('Control+y');
			// A drag across two strokes erases both, as one Undo.
			await page.mouse.move(cb.x + cb.w * 0.5, cb.y + cb.h * 0.15); await page.mouse.down();
			await page.mouse.move(cb.x + cb.w * 0.5, cb.y + cb.h * 0.9, { steps: 20 }); await page.mouse.up();
			ok('dragging the eraser across strokes removes them all', (await page.evaluate(RED_COUNT)) === 0);
			await page.keyboard.press('Control+z');
			ok('...and one Undo brings them back', (await page.evaluate(RED_COUNT)) > 0);
			await page.keyboard.press('Escape');
			ok('Esc returns from the eraser to the pen without closing the view', (await page.getAttribute('#lpn_snip_pen', 'aria-pressed')) === 'true' && !!(await page.$('#lpn_snip_canvas')));
			// Clear the canvas of strokes for what follows: undo everything.
			for (let i = 0; i < 10; i++) { await page.keyboard.press('Control+z'); }
			ok('everything undone leaves no red', (await page.evaluate(RED_COUNT)) === red0);
			// Put a stroke on and copy: the copied picture carries it.
			await page.mouse.move(p1.x, p1.y); await page.mouse.down(); await page.mouse.move(p2.x, p2.y, { steps: 6 }); await page.mouse.up();
			await page.click('#lpn_snip_copy');
			await page.waitForFunction(() => window.__snipBlobs.length >= 2, null, { timeout: 15000 });
			const marked = await page.evaluate(DECODE, 1);
			ok('Copy hands over the marked picture at the same size', marked.w === r.w * S && marked.h === r.h * S);
			const mpx = await page.evaluate(PIXEL, { i: 1, x: Math.round(marked.w * 0.5), y: Math.round(marked.h * 0.5) });
			ok('...with the stroke in it', mpx[0] > 200 && mpx[1] < 60 && mpx[2] < 60, JSON.stringify(mpx));
			// 1b. Unmarked snip matches the whole-map region: take it again, copy with no stroke.
			await page.click('#lpn_snip_undo');
			await page.click('#lpn_snip_copy');
			await page.waitForFunction(() => window.__snipBlobs.length >= 3, null, { timeout: 15000 });
			await page.keyboard.press('Escape');
			await page.evaluate(DECODE, 2);
			const diff = await page.evaluate(REGION_DIFF, { i: 0, j: 2, ox: Math.round((r.x - map.x) * S), oy: Math.round((r.y - map.y) * S) });
			if (process.env.SNIP_SHOTS) {
				for (const [i, nm] of [[0, 'full'], [2, 'crop']]) {
					const b64 = await page.evaluate(async (k) => { const u = new Uint8Array(await window.__snipBlobs[k].arrayBuffer()); let s = ''; for (let q = 0; q < u.length; q += 8192) { s += String.fromCharCode.apply(null, u.subarray(q, q + 8192)); } return btoa(s); }, i);
					require('fs').writeFileSync(path.join(process.env.SNIP_SHOTS, nm + '.png'), Buffer.from(b64, 'base64'));
				}
			}
			ok('the snip matches the same region of the whole-map capture', diff.mean < 6 && diff.badFraction < 0.01, JSON.stringify(diff));

			// 7. The hint goes when the view opens, and the shape switch applies to a veil already up.
			await pressBox(page, 'lpn_snip_go');
			await page.waitForSelector('.lpn-snip-veil', { state: 'visible' });
			ok('the hint shows while the veil is up', (await a.notice()) === await a.lang('lpn_screenshot_hint'), await a.notice());
			await page.click('#lpn_snip_mode');
			await page.click('#lpn_snip_mode_free');
			ok('switching to Freehand with the veil up shows the freehand hint', (await a.notice()) === await a.lang('lpn_snip_hint_free'), await a.notice());
			const vs = await page.$$eval('.lpn-snip-veil', (v) => v.length);
			const T0 = await page.evaluate(MAP_RECT);
			await page.mouse.move(T0.x + 300, T0.y + 300); await page.mouse.down();
			await page.mouse.move(T0.x + 400, T0.y + 320, { steps: 4 });
			ok('...and the veil already up now draws a freehand outline, one veil only', vs === 1 && !!(await page.$('.lpn-snip-lasso polygon')));
			await page.mouse.move(T0.x + 330, T0.y + 420, { steps: 4 }); await page.mouse.up();
			await page.waitForSelector('#lpn_snip_canvas', { state: 'visible' });
			await page.keyboard.press('Escape');
			await page.click('#lpn_snip_mode'); await page.click('#lpn_snip_mode_rect');
			await page.waitForSelector('.lpn-snip-veil', { state: 'visible' });
			ok('picking Rectangle from the menu starts a rectangle snip and the S key does too', (await page.$eval('#lpn_snip_go', (b) => b.title || b.getAttribute('data-bs-original-title'))) === 'Snip a rectangle (S)');
			await page.keyboard.press('Escape');
			await page.keyboard.press('s');
			await page.waitForSelector('.lpn-snip-veil', { state: 'visible' });
			await page.keyboard.press('Escape');
			await a.settle(200);
			ok('cancelling a snip clears the hint', (await a.notice()) === '', JSON.stringify(await a.notice()));

			// 4. Esc cancels a snip in progress; and closes the view.
			const dl0 = downloads, blobs0 = await page.evaluate(() => window.__snipBlobs.length);
			await pressBox(page, 'lpn_snip_go');
			await page.waitForSelector('.lpn-snip-veil', { state: 'visible' });
			await page.keyboard.press('Escape');
			await a.settle(300);
			ok('Esc cancels the snip: no veil, no view', !(await page.$('.lpn-snip-veil')) && !(await page.$('#lpn_snip_canvas')));
			await pressBox(page, 'lpn_snip_again');
			await page.waitForSelector('#lpn_snip_canvas', { state: 'visible' });
			await page.keyboard.press('Escape');
			await a.settle(300);
			ok('Esc closes the view', !(await page.$('#lpn_snip_canvas')));
			ok('...and neither wrote a download or a clipboard picture', downloads === dl0 && (await page.evaluate(() => window.__snipBlobs.length)) === blobs0);

			// 5. Save: one click, one download.
			await pressBox(page, 'lpn_snip_again');
			await page.waitForSelector('#lpn_snip_canvas', { state: 'visible' });
			await Promise.all([page.waitForEvent('download', { timeout: 15000 }), page.click('#lpn_snip_save')]);
			await a.settle(1200);
			ok('Save makes exactly one download', downloads === dl0 + 1, dl0 + ' -> ' + downloads);
			await page.keyboard.press('Escape');

			// 6. Freehand: a triangle.
			await page.click('#lpn_snip_mode'); await page.click('#lpn_snip_mode_free');
			await page.waitForSelector('.lpn-snip-veil', { state: 'visible' });
			ok('after Freehand, Snip carries the freehand tip', (await page.$eval('#lpn_snip_go', (b) => b.title || b.getAttribute('data-bs-original-title'))) === 'Snip a freehand shape (S)');
			const T = [{ x: r.x, y: r.y + r.h }, { x: r.x + r.w, y: r.y + r.h }, { x: r.x + r.w / 2, y: r.y }];
			await page.mouse.move(T[0].x, T[0].y); await page.mouse.down();
			for (const p of [T[1], T[2], { x: T[0].x + 2, y: T[0].y - 2 }]) { await page.mouse.move(p.x, p.y, { steps: 8 }); }
			ok('dragging shows the freehand outline', await page.$eval('.lpn-snip-lasso polygon', (e) => e.getAttribute('points').split(' ').length > 10));
			await page.mouse.up();
			await page.waitForSelector('#lpn_snip_canvas', { state: 'visible' });
			await copyAndClose(page, 4);
			const free = await page.evaluate(DECODE, 3);
			ok('the lasso picture is its bounding box x scale', Math.abs(free.w - r.w * S) <= 6 && Math.abs(free.h - r.h * S) <= 6, free.w + ' x ' + free.h);
			const out1 = await page.evaluate(PIXEL, { i: 3, x: 4, y: 4 }), out2 = await page.evaluate(PIXEL, { i: 3, x: free.w - 5, y: 4 });
			const inside = await page.evaluate(PIXEL, { i: 3, x: Math.round(free.w / 2), y: Math.round(free.h * 0.8) });
			ok('outside the outline is transparent (top corners)', out1[3] === 0 && out2[3] === 0, JSON.stringify([out1, out2]));
			ok('inside the outline is opaque', inside[3] === 255, JSON.stringify(inside));
			// 8. Phone width: every icon button in the view is at least 40 px each way.
			await page.setViewportSize({ width: 390, height: 800 });
			await a.settle(500);
			await page.evaluate(() => { const b = document.getElementById('lpn_snip_box'); if (b) { b.style.display = 'none'; } });
			await pressBox(page, 'lpn_snip_again').catch(() => {});
			const phoneOpen = await page.waitForSelector('#lpn_snip_canvas', { state: 'visible', timeout: 5000 }).then(() => true, () => false);
			if (phoneOpen) {
				const sizes = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_snip_edit .lpn-snip-ic, #lpn_snip_edit .lpn-popover-x')).map((e) => { const b = e.getBoundingClientRect(); return Math.min(b.width, b.height); }));
				ok('on a phone every icon button in the view is at least 40 px', sizes.length === 7 && sizes.every((n) => n >= 39.5), JSON.stringify(sizes));
			} else { ok('on a phone the markup view opens (reached through the box button)', false); }
			ok('no page errors', a.errors.length === 0, a.errors.join(' | ').slice(0, 300));
		} finally { await a.close(); }
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
