// MAP > SCREENSHOT, THE SNIPPING TOOL, IN A REAL CHROMIUM. Tom, 2026-10-05, on a proposed "Copy
// image at 2x-3x": *"Good if presented as a snipping tool. 'Sharper screenshot' or 'Screenshot'
// (with tip) may work ... Map menu seems right to me since it's not about Water."*
//
// What this proves, on Net1:
//   1. the Map menu has the Screenshot row, carrying its tip;
//   2. a plain click takes the whole visible map, as a PNG three times the map's CSS size;
//   3. a dragged rectangle gives a PNG three times that rectangle, and it is not blank;
//   4. Esc cancels: the veil goes and nothing is captured;
//   5. with no clipboard, the PNG is offered as a download instead, and the notice says so;
//   6. on a phone, a tap takes the whole map.
// The clipboard is replaced by a recorder, because a headless clipboard is the browser's to refuse
// and this is about what the page HANDS it.
//
//   node dev/lpn-spike/screenshot-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SCREENSHOT_BROWSER_LOCKED';
const NAME = 'screenshot-browser-harness';

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

// The clipboard, replaced by a recorder of what the page hands it.
const RECORDER = () => {
	window.__snipBlobs = [];
	Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
		write: async (items) => { window.__snipBlobs.push(await items[0].getType('image/png')); }
	} });
};
// The map's visible content box, the same rectangle the page calls "the whole map".
const MAP_RECT = () => {
	const s = document.getElementById('lpn_canvas'), r = s.getBoundingClientRect();
	const left = Math.max(r.left + s.clientLeft, 0), top = Math.max(r.top + s.clientTop, 0);
	const right = Math.min(r.left + s.clientLeft + s.clientWidth, innerWidth);
	const bottom = Math.min(r.top + s.clientTop + s.clientHeight, innerHeight);
	return { x: left, y: top, w: right - left, h: bottom - top };
};
// The last recorded PNG: its size, and how many pixels differ from the map's background.
const LAST_PNG = async () => {
	const b = window.__snipBlobs[window.__snipBlobs.length - 1];
	if (!b) { return null; }
	const bm = await createImageBitmap(b);
	const c = document.createElement('canvas'); c.width = bm.width; c.height = bm.height;
	const g = c.getContext('2d'); g.drawImage(bm, 0, 0);
	const d = g.getImageData(0, 0, c.width, c.height).data;
	const bg = getComputedStyle(document.getElementById('lpn_canvas')).backgroundColor.match(/\d+/g).map(Number);
	let ink = 0;
	for (let i = 0; i < d.length; i += 4) {
		if (Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) > 60) { ink++; }
	}
	// The bottom-right corner, where the tile credit goes: inked (text) pixels in the last 240 x 24
	// CSS pixels, at the picture's 3x.
	let cornerDark = 0;
	for (let y = Math.max(0, bm.height - 72); y < bm.height; y++) {
		for (let x = Math.max(0, bm.width - 720); x < bm.width; x++) {
			const i = (y * bm.width + x) * 4;
			// Text, in whatever colour the credit's link is: far from white AND far from the
			// light test tile (200, 230, 200) that section 4b lays under the map.
			const fromWhite = (255 - d[i]) + (255 - d[i + 1]) + (255 - d[i + 2]);
			const fromTile = Math.abs(d[i] - 200) + Math.abs(d[i + 1] - 230) + Math.abs(d[i + 2] - 200);
			if (fromWhite > 100 && fromTile > 100) { cornerDark++; }
		}
	}
	return { type: b.type, w: bm.width, h: bm.height, ink: ink, total: bm.width * bm.height, cornerDark: cornerDark };
};
async function waitBlobs(page, n) {
	await page.waitForFunction((k) => (window.__snipBlobs || []).length >= k, n, { timeout: 15000 });
}
async function startSnip(a, label) {
	await a.menuClick(label, 'map');
	await a.page.waitForSelector('.lpn-snip-veil', { state: 'visible' });
}

async function desktop(Session, browser) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
	const page = a.page;
	try {
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1000);
		const LABEL = await a.lang('lpn_screenshot_menu'), TIP = await a.lang('lpn_screenshot_tip');

		// 1. The row, and its tip.
		await a.openMenu('map');
		const row = await page.evaluate((label) => {
			const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row'))
				.filter((b) => b.textContent.trim() === label)[0];
			return r ? { title: r.getAttribute('data-bs-original-title') || r.title, help: r.classList.contains('ec-help'), disabled: r.disabled } : null;
		}, LABEL);
		await a.closeMenu();
		ok('the Map menu has a Screenshot row', !!row, JSON.stringify(row));
		ok('...carrying its tip', !!row && row.title === TIP && row.help, row && row.title);

		await page.evaluate(RECORDER);
		const map = await page.evaluate(MAP_RECT);

		// 2. A plain click: the whole map at three times its CSS size.
		await startSnip(a, LABEL);
		ok('choosing it shows the hint', (await a.notice()) === await a.lang('lpn_screenshot_hint'), await a.notice());
		await page.mouse.click(map.x + map.w / 2, map.y + map.h / 2);
		await waitBlobs(page, 1);
		let png = await page.evaluate(LAST_PNG);
		ok('a click gives a PNG', !!png && png.type === 'image/png', JSON.stringify(png));
		ok('...of the whole map at 3x (' + Math.round(map.w * 3) + ' x ' + Math.round(map.h * 3) + ')',
			!!png && png.w === Math.round(map.w * 3) && png.h === Math.round(map.h * 3), png && (png.w + ' x ' + png.h));
		ok('...and it shows the network', !!png && png.ink > 500, png && png.ink + ' inked pixels');
		if (process.env.SNIP_SHOTS) {   // a person's look at the picture: SNIP_SHOTS=/some/dir
			const b64 = await page.evaluate(async () => { const b = window.__snipBlobs[0]; const u = new Uint8Array(await b.arrayBuffer()); let s = ''; for (let i = 0; i < u.length; i += 8192) { s += String.fromCharCode.apply(null, u.subarray(i, i + 8192)); } return btoa(s); });
			require('fs').writeFileSync(path.join(process.env.SNIP_SHOTS, 'screenshot-whole.png'), Buffer.from(b64, 'base64'));
			await page.screenshot({ path: path.join(process.env.SNIP_SHOTS, 'screenshot-screen.png') });
		}
		await a.settle(200);
		ok('the notice says it was copied', (await a.notice()).indexOf(await a.lang('lpn_screenshot_copied')) === 0, await a.notice());
		ok('the veil is gone', !(await page.$('.lpn-snip-veil')));
		ok('with no tiles drawn there is no tile credit in the corner', !!png && png.cornerDark === 0, png && png.cornerDark + ' dark pixels');

		// 3. A dragged rectangle in the middle of the fitted network.
		const r = { x: Math.round(map.x + map.w * 0.3), y: Math.round(map.y + map.h * 0.3), w: 300, h: 220 };
		await startSnip(a, LABEL);
		await page.mouse.move(r.x, r.y);
		await page.mouse.down();
		await page.mouse.move(r.x + r.w / 2, r.y + r.h / 2, { steps: 4 });
		await page.mouse.move(r.x + r.w, r.y + r.h, { steps: 4 });
		const rect = await page.$eval('.lpn-snip-rect', (e) => ({ w: e.offsetWidth, h: e.offsetHeight, shown: !!e.parentNode }));
		ok('dragging draws the rectangle', rect.shown && rect.w === r.w && rect.h === r.h, JSON.stringify(rect));
		await page.mouse.up();
		await waitBlobs(page, 2);
		png = await page.evaluate(LAST_PNG);
		ok('a drag gives a PNG of 3x the rectangle (900 x 660)', !!png && png.w === r.w * 3 && png.h === r.h * 3, png && (png.w + ' x ' + png.h));
		ok('...and it is not blank', !!png && png.ink > 200, png && png.ink + ' inked pixels');

		// 4. Esc cancels, and nothing is captured.
		await startSnip(a, LABEL);
		await page.keyboard.press('Escape');
		await a.settle(100);
		ok('Esc takes the veil away', !(await page.$('.lpn-snip-veil')));
		await a.settle(1500);
		ok('...and captures nothing', (await page.evaluate(() => window.__snipBlobs.length)) === 2);

		// 4b. Tiles in the picture carry their credit (pre-review, 2026-10-05: Net3 pasted with no
		// "© OpenStreetMap contributors"). Net1 is a grid drawing, so one light tile is laid under the
		// whole map in the basemap layer, exactly where real tiles live, and the credit's own set is shown.
		const credit = await page.evaluate(() => {
			const c = document.createElement('canvas'); c.width = c.height = 16;
			const g = c.getContext('2d'); g.fillStyle = 'rgb(200,230,200)'; g.fillRect(0, 0, 16, 16);
			const im = document.createElementNS('http://www.w3.org/2000/svg', 'image');
			im.setAttribute('href', c.toDataURL()); im.setAttribute('class', 'lpn-basemap-tile');
			im.setAttribute('preserveAspectRatio', 'none');
			['x', 'y'].forEach((k) => im.setAttribute(k, '-100000'));
			['width', 'height'].forEach((k) => im.setAttribute(k, '200000'));
			im.id = 'snip_fake_tile';
			document.querySelector('#lpn_canvas g.lpn-basemap').appendChild(im);
			const cr = document.getElementById('lpn_basemap_credit');
			return cr ? cr.querySelector('[data-basemap-credit="osm"]').textContent.trim() : '';
		});
		ok('the street-map credit the screen shows is the OpenStreetMap one', /OpenStreetMap/.test(credit), credit);
		await startSnip(a, LABEL);
		await page.mouse.click(map.x + map.w / 2, map.y + map.h / 2);
		await waitBlobs(page, 3);
		png = await page.evaluate(LAST_PNG);
		ok('with tiles drawn the picture carries the tile credit in its bottom-right corner', !!png && png.cornerDark > 100,
			png && png.cornerDark + ' dark pixels');
		if (process.env.SNIP_SHOTS) {
			const b64 = await page.evaluate(async () => { const b = window.__snipBlobs[window.__snipBlobs.length - 1]; const u = new Uint8Array(await b.arrayBuffer()); let s = ''; for (let i = 0; i < u.length; i += 8192) { s += String.fromCharCode.apply(null, u.subarray(i, i + 8192)); } return btoa(s); });
			require('fs').writeFileSync(path.join(process.env.SNIP_SHOTS, 'screenshot-credit.png'), Buffer.from(b64, 'base64'));
		}
		await page.evaluate(() => document.getElementById('snip_fake_tile').remove());

		// 5. No clipboard: a download, and a notice that says so.
		await page.evaluate(() => { delete navigator.clipboard; Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }); });
		await startSnip(a, LABEL);
		const [dl] = await Promise.all([
			page.waitForEvent('download', { timeout: 15000 }),
			page.mouse.click(map.x + map.w / 2, map.y + map.h / 2)
		]);
		ok('with no clipboard the PNG is downloaded', /\.png$/.test(dl.suggestedFilename()), dl.suggestedFilename());
		await a.settle(200);
		ok('...and the notice says so', (await a.notice()).indexOf(await a.lang('lpn_screenshot_saved')) === 0, await a.notice());
		ok('no page errors', a.errors.length === 0, a.errors.join(' | ').slice(0, 300));
	} finally { await a.close(); }
}

async function phone(Session, browser) {
	const a = await Session.open(browser, NAME + '-phone', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
	const page = a.page;
	try {
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1000);
		await page.evaluate(RECORDER);
		const map = await page.evaluate(MAP_RECT);
		await startSnip(a, await a.lang('lpn_screenshot_menu'));
		await page.touchscreen.tap(map.x + map.w / 2, map.y + map.h / 2);
		await waitBlobs(page, 1);
		const png = await page.evaluate(LAST_PNG);
		ok('on a phone a tap takes the whole map at 3x', !!png && png.w === Math.round(map.w * 3) && png.h === Math.round(map.h * 3),
			png && (png.w + ' x ' + png.h + ' for ' + map.w + ' x ' + map.h));
		ok('...and it shows the network', !!png && png.ink > 200, png && png.ink + ' inked pixels');
	} finally { await a.close(); }
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
		await desktop(Session, browser);
		await phone(Session, browser);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
